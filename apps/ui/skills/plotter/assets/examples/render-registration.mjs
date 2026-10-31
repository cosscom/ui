import { arrow, dimension, roleCss } from "../foundation/index.mjs";

function numericAttribute(markup, name) {
  const value = markup.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
  if (value === undefined || !Number.isFinite(Number(value))) {
    throw new Error(`AG01 needs a numeric ${name} attribute.`);
  }
  return Number(value);
}

export function renderRegistration(svgSource) {
  let svg = svgSource;

  // The editable record rectangle is the witness source, not a second model.
  const record = svg.match(
    /<rect\b[^>]*data-plotter-part="registry-record"[^>]*\/>/,
  )?.[0];
  if (!record) throw new Error("AG01 is missing its registry-record rectangle.");
  const x = numericAttribute(record, "x");
  const y = numericAttribute(record, "y");
  const width = numericAttribute(record, "width");
  const height = numericAttribute(record, "height");
  const unit = numericAttribute(
    svg.match(/<svg\b[^>]*>/)?.[0] ?? "",
    "data-plotter-unit",
  );
  if (unit <= 0) throw new Error("AG01 needs a positive local unit.");

  const transfer = arrow({ kind: "line", from: [268, 186], to: [268, 212] });
  const measurement = dimension({
    axis: "x",
    witnesses: [
      [x, y + height],
      [x + width, y + height],
    ],
    position: 390,
    extensions: { gap: 8, overshoot: 8 },
    label: {
      text: `${width / unit}u`,
      anchor: [x + width / 2, 393],
      clearance: { x: 264, y: 380, width: 32, height: 20 },
    },
  });

  function replaceFragment(name, body) {
    const start = `<!-- plotter:${name} -->`;
    const end = `<!-- /plotter:${name} -->`;
    const from = svg.indexOf(start);
    const to = svg.indexOf(end, from + start.length);
    if (from < 0 || to < 0)
      throw new Error(`AG01 is missing its ${name} markers.`);
    const indent = svg.slice(svg.lastIndexOf("\n", from) + 1, from);
    svg =
      svg.slice(0, from + start.length) + `\n${body}\n${indent}` + svg.slice(to);
  }

  replaceFragment(
    "registration-transfer",
    `  <g data-plotter-role="transfer">
    <path d="${transfer.shaftD}"/>
    <path d="${transfer.headD}" stroke-dasharray="none"/>
  </g>`,
  );
  replaceFragment(
    "registration-width",
    `    <path d="${measurement.witnessD} ${measurement.lineD} ${measurement.slashD}"/>`,
  );
  replaceFragment(
    "registration-width-label",
    `    <text x="${measurement.label.anchor[0]}" y="${measurement.label.anchor[1]}">${measurement.label.text}</text>`,
  );
  return svg.replace(
    /<style data-plotter-styles="true">[\s\S]*?<\/style>/,
    `<style data-plotter-styles="true">${roleCss}</style>`,
  );
}
