import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderRegistration } from "../skills/plotter/assets/examples/render-registration.mjs";

const source = fileURLToPath(
  new URL("../app/plotter/drawings/agent-registration.svg", import.meta.url),
);
writeFileSync(source, renderRegistration(readFileSync(source, "utf8")));
console.log("Updated AG01’s helper-generated marks and embedded role styles.");
