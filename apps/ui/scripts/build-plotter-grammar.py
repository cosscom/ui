"""Compile the skill's illustrated grammar into the Plotter page's SVG components."""

import xml.etree.ElementTree as ET
from pathlib import Path

from plotter_svg import element

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills" / "plotter" / "references" / "grammar"
components = []
entries = []

for source in sorted(SOURCE.glob("*.svg")):
    svg = ET.parse(source).getroot()
    svg.attrib.pop("role", None)
    svg.attrib.pop("aria-labelledby", None)
    svg.set("aria-hidden", "true")
    svg.set("focusable", "false")
    ids = [
        node.attrib["id"]
        for node in svg.iter()
        if "id" in node.attrib
        and node.tag.rsplit("}", 1)[-1] not in {"title", "desc"}
    ]
    name = "Grammar" + "".join(part.title() for part in source.stem.split("-"))
    components.append(
        f"function {name}() {{\n"
        + ("  const id = useId();\n" if ids else "")
        + "  return (\n"
        + element(svg, ids, 2)
        + "\n  );\n}\n"
    )
    entries.append(f"  {source.stem}: <{name} />,")

output = "// Generated from skills/plotter/references/grammar/*.svg by scripts/build-plotter-grammar.py.\n"
output += 'import { type ReactNode, useId } from "react";\n'
output += 'import type { visualGrammarEntries } from "./visual-grammar-content";\n\n'
output += "\n".join(components)
output += "\nexport const visualGrammarDrawings: Record<\n"
output += '  (typeof visualGrammarEntries)[number]["id"],\n  ReactNode\n> = {\n'
output += "\n".join(entries) + "\n};\n"
(ROOT / "app" / "plotter" / "visual-grammar-drawings.tsx").write_text(output)
print(f"Compiled {len(entries)} illustrated grammar topics.")
