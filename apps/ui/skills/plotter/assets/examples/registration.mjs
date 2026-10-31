// Run from the copied skill: node assets/examples/registration.mjs > registration.svg
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderRegistration } from "./render-registration.mjs";

const source = fileURLToPath(new URL("./registration.svg", import.meta.url));
process.stdout.write(renderRegistration(readFileSync(source, "utf8")));
