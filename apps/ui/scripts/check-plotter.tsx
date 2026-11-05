/// <reference types="bun-types" />

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { YAML } from "bun";
import { renderToStaticMarkup } from "react-dom/server";
import { illustrations } from "../app/plotter/illustrations";

const skillRoot = resolve(import.meta.dir, "../skills/plotter");
const skill = readFileSync(resolve(skillRoot, "SKILL.md"), "utf8");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatter?.[1]) throw new Error("Plotter is missing YAML frontmatter.");
const metadata = YAML.parse(frontmatter[1]) as Record<string, unknown>;
if (metadata.name !== "plotter" || typeof metadata.description !== "string") {
  throw new Error("Plotter needs a name and description for skill discovery.");
}

function checkLinks(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) checkLinks(file);
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (!target) continue;
      if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith("#"))
        continue;
      statSync(resolve(dirname(file), target.replace(/#.*/, "")));
    }
  }
}
checkLinks(skillRoot);

const referenceRoot = resolve(skillRoot, "references/drawings");
const manifest = JSON.parse(
  readFileSync(resolve(referenceRoot, "manifest.json"), "utf8"),
) as { references: { code: string; file: string; sha256: string }[] };
for (const reference of manifest.references) {
  const contents = readFileSync(resolve(referenceRoot, reference.file));
  const hash = createHash("sha256").update(contents).digest("hex");
  if (hash !== reference.sha256) {
    throw new Error(
      `${reference.code}: bundled snapshot differs from its manifest.`,
    );
  }
}

const codes = new Set<string>();
const ids = new Set<string>();
const svgIds = new Set<string>();
for (const study of illustrations) {
  if (codes.has(study.code) || ids.has(study.id)) {
    throw new Error(`${study.code}: duplicate catalog code or deep-link ID.`);
  }
  codes.add(study.code);
  ids.add(study.id);
  const svg = renderToStaticMarkup(study.illustration);
  if (!svg.startsWith("<svg") || !svg.includes('viewBox="0 0 560 440"')) {
    throw new Error(`${study.code}: expected a 560 × 440 SVG.`);
  }
  for (const match of svg.matchAll(/\bid="([^"]+)"/g)) {
    const id = match[1];
    if (!id) continue;
    if (svgIds.has(id)) throw new Error(`Duplicate SVG ID: ${id}`);
    svgIds.add(id);
  }
}

console.log(
  `Plotter: ${illustrations.length} drawings render, catalog/SVG IDs are unique, skill links resolve, and ${manifest.references.length} reference hashes match.`,
);
console.log(
  "Visual fit and geometric claims still need review of the affected drawings.",
);
