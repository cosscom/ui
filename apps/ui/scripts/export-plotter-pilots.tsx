import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductionChainStudy } from "../app/plotter/engineering-studies";

const output = process.argv[2];
if (!output) {
  throw new Error(
    "Usage: bun scripts/export-plotter-pilots.tsx <output-directory>",
  );
}
const root = resolve(import.meta.dir, "..");
const exporter = resolve(root, "skills/plotter/scripts/export-svg.py");
const destination = resolve(output);
execFileSync(
  "python3",
  [
    exporter,
    resolve(root, "app/plotter/drawings/agent-registration.svg"),
    resolve(destination, "agent-registration.svg"),
    "--id-prefix",
    "ag01",
  ],
  { stdio: "inherit" },
);

const temporary = mkdtempSync(resolve(tmpdir(), "plotter-export-"));
try {
  const source = resolve(temporary, "production-chain.svg");
  writeFileSync(source, renderToStaticMarkup(<ProductionChainStudy />));
  execFileSync(
    "python3",
    [
      exporter,
      source,
      resolve(destination, "production-chain.svg"),
      "--id-prefix",
      "w05",
      "--title",
      "One line, equal carrier pitch",
      "--description",
      "A square core joins an equally spaced line of open carriers. Diagonal hatching identifies only the core faces.",
    ],
    { stdio: "inherit" },
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
