import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const brandAssetsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const generatedDirectory = path.join(brandAssetsDirectory, "generated");
const checkOnly = process.argv.includes("--check");

const cossMap = readJson("coss-map.json");
const primitives = readJson(cossMap.source?.file ?? "Primitives.json");
const legacyOutputs = ["primitives.css", "semantics.css", "coss-bridge.css"];

validateSourceContract();
validatePrimitiveCollection();

const palette = primitives.variables.filter(
  (variable) =>
    variable.type === "COLOR" &&
    cossMap.source.include.some((pattern) => matchesPattern(variable.name, pattern)),
);
const paletteByName = new Map(
  palette.map((variable) => [variable.name, variable]),
);

validatePalette();
validateCossMap();
validateContrast();

const outputs = new Map([
  ["palette.css", renderPaletteCss()],
  ["coss-theme.css", renderCossThemeCss()],
  ["index.css", renderIndexCss()],
]);

if (checkOnly) {
  let hasMismatch = false;

  for (const [filename, expected] of outputs) {
    const outputPath = path.join(generatedDirectory, filename);
    const actual = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, "utf8")
      : null;

    if (actual !== expected) {
      hasMismatch = true;
      console.error(`Out of date: brand-assets/generated/${filename}`);
    }
  }

  for (const filename of legacyOutputs) {
    if (fs.existsSync(path.join(generatedDirectory, filename))) {
      hasMismatch = true;
      console.error(`Legacy output must be removed: brand-assets/generated/${filename}`);
    }
  }

  if (hasMismatch) {
    process.exitCode = 1;
  } else {
    console.log("Accura palette outputs are up to date.");
  }
} else {
  fs.mkdirSync(generatedDirectory, { recursive: true });

  for (const [filename, content] of outputs) {
    fs.writeFileSync(path.join(generatedDirectory, filename), content);
  }

  console.log(
    `Generated ${outputs.size} Accura palette files from ${palette.length} brand and Zinc colors. Semantics.json was not read.`,
  );
}

function readJson(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(brandAssetsDirectory, filename), "utf8"),
  );
}

function validateSourceContract() {
  if (cossMap.version !== 2) {
    throw new Error("coss-map.json must use the palette-only version 2 contract.");
  }
  if (cossMap.source?.file !== "Primitives.json") {
    throw new Error("The palette source must be Primitives.json.");
  }
  if (
    !Array.isArray(cossMap.source.include) ||
    cossMap.source.include.length !== 2 ||
    !cossMap.source.include.includes("color/brand/*") ||
    !cossMap.source.include.includes("color/zinc/*")
  ) {
    throw new Error(
      "The palette must include exactly color/brand/* and color/zinc/*.",
    );
  }
  if (cossMap.theme?.selector !== ":root:not(.dark)") {
    throw new Error("The current Accura palette adapter must be light-mode only.");
  }
}

function validatePrimitiveCollection() {
  if (!Array.isArray(primitives.variables)) {
    throw new Error("Primitives.json has no variables array.");
  }
  if (primitives.variableIds?.length !== primitives.variables.length) {
    throw new Error("Primitive variableIds and variables counts do not match.");
  }

  const ids = new Set();
  const names = new Set();

  for (const variable of primitives.variables) {
    if (ids.has(variable.id)) {
      throw new Error(`Primitives.json has duplicate id ${variable.id}.`);
    }
    if (names.has(variable.name)) {
      throw new Error(`Primitives.json has duplicate name ${variable.name}.`);
    }
    ids.add(variable.id);
    names.add(variable.name);
  }
}

function validatePalette() {
  if (palette.length === 0) {
    throw new Error("No brand or Zinc colors were found in Primitives.json.");
  }

  const cssNames = new Set();

  for (const variable of palette) {
    const values = Object.values(variable.valuesByMode ?? {});
    if (values.length !== 1 || !isColor(values[0])) {
      throw new Error(`${variable.name} must contain one literal color value.`);
    }

    const cssName = toPaletteCssVariableName(variable.name);
    if (cssNames.has(cssName)) {
      throw new Error(`Palette CSS variable collision: ${cssName}.`);
    }
    cssNames.add(cssName);
  }
}

function validateCossMap() {
  if (!cossMap.coss || Object.keys(cossMap.coss).length === 0) {
    throw new Error("coss-map.json must define at least one COSS override.");
  }

  for (const [cossVariable, mapping] of Object.entries(cossMap.coss)) {
    const sources = [mapping.token, mapping.css].filter(Boolean);
    if (sources.length !== 1) {
      throw new Error(
        `--${cossVariable} must define exactly one token or CSS value.`,
      );
    }

    if (mapping.token && !paletteByName.has(mapping.token)) {
      throw new Error(
        `--${cossVariable} references a color outside the approved palette: ${mapping.token}.`,
      );
    }

    if (
      mapping.css &&
      (/(?:#|rgb\(|hsl\(|oklch\()/i.test(mapping.css) ||
        /--accura-(?:primitive|semantic)/.test(mapping.css))
    ) {
      throw new Error(
        `--${cossVariable} must not introduce a raw color or a legacy token namespace.`,
      );
    }
  }
}

function validateContrast() {
  const pairs = [
    ["primary", "primary-foreground"],
    ["sidebar", "sidebar-foreground"],
    ["sidebar-primary", "sidebar-primary-foreground"],
    ["sidebar-accent", "sidebar-accent-foreground"],
  ];

  for (const [backgroundVariable, foregroundVariable] of pairs) {
    const ratio = contrastRatio(
      resolveMappingColor(cossMap.coss[backgroundVariable]),
      resolveMappingColor(cossMap.coss[foregroundVariable]),
    );

    if (ratio < 4.5) {
      throw new Error(
        `Contrast for --${foregroundVariable} on --${backgroundVariable} is ${ratio.toFixed(2)}:1; expected at least 4.5:1.`,
      );
    }
  }
}

function resolveMappingColor(mapping) {
  if (mapping.token) {
    return getOnlyModeValue(paletteByName.get(mapping.token));
  }
  if (mapping.css === "var(--color-white)") {
    return { r: 1, g: 1, b: 1, a: 1 };
  }
  throw new Error(`Cannot resolve ${mapping.css} for contrast validation.`);
}

function renderPaletteCss() {
  const lines = [
    "/* This file is generated. Do not edit directly. */",
    "/* Source: brand-assets/Primitives.json (color/brand/* and color/zinc/* only) */",
    "",
    ":root {",
  ];

  for (const variable of palette) {
    lines.push(
      `  ${toPaletteCssVariableName(variable.name)}: ${formatColor(getOnlyModeValue(variable))};`,
    );
  }

  lines.push("}", "");
  return lines.join("\n");
}

function renderCossThemeCss() {
  const lines = [
    "/* This file is generated. Do not edit directly. */",
    "/* Palette-only Accura overrides. Import after the COSS base styles. */",
    "/* Unlisted COSS roles intentionally retain their native values. */",
    "",
    `${cossMap.theme.selector} {`,
  ];

  for (const [cossVariable, mapping] of Object.entries(cossMap.coss)) {
    const value = mapping.token
      ? `var(${toPaletteCssVariableName(mapping.token)})`
      : mapping.css;
    lines.push(`  --${cossVariable}: ${value};`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

function renderIndexCss() {
  return [
    "/* Generated entry point for the Accura palette adapter. */",
    '@import "./palette.css";',
    '@import "./coss-theme.css";',
    "",
  ].join("\n");
}

function matchesPattern(name, pattern) {
  if (!pattern.endsWith("*")) {
    return name === pattern;
  }
  return name.startsWith(pattern.slice(0, -1));
}

function getOnlyModeValue(variable) {
  return Object.values(variable.valuesByMode ?? {})[0];
}

function isColor(value) {
  return (
    value &&
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number"
  );
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color) {
  const [red, green, blue] = [color.r, color.g, color.b].map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function formatColor(color) {
  const red = Math.round(color.r * 255);
  const green = Math.round(color.g * 255);
  const blue = Math.round(color.b * 255);
  const alpha = color.a ?? 1;

  if (alpha < 0.999) {
    return `rgb(${red} ${green} ${blue} / ${trimNumber(alpha)})`;
  }

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function toPaletteCssVariableName(tokenName) {
  const normalized = tokenName
    .replace(/^color\//, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `--accura-${normalized}`;
}

function toHex(value) {
  return value.toString(16).padStart(2, "0");
}

function trimNumber(value) {
  return Number(value.toFixed(4)).toString();
}
