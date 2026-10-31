"""Compile the editable catalog SVGs into local React drawing components."""

import json
import xml.etree.ElementTree as ET
from pathlib import Path

from plotter_svg import element

ROOT = Path(__file__).resolve().parents[1] / "app" / "plotter"
SOURCE = ROOT / "drawings"
manifest = json.loads((SOURCE / "manifest.json").read_text())


components = []
entries = []
uses_ids = False
for item in manifest:
    svg = ET.parse(SOURCE / item["file"]).getroot()
    ids = [n.attrib["id"] for n in svg.iter() if "id" in n.attrib and n.tag.rsplit("}", 1)[-1] not in {"title", "desc"}]
    uses_ids |= bool(ids)
    name = "Drawing" + "".join(part.title() for part in item["id"].split("-"))
    drawing = "\n".join(filter(None, (element(n, ids, 4) for n in svg)))
    join = json.dumps(svg.attrib.get("stroke-linejoin", "round"))
    cap = json.dumps(svg.attrib.get("stroke-linecap", "butt"))
    width = json.dumps(svg.attrib.get("stroke-width", "0.95"))
    declaration = "  const id = useId();\n" if ids else ""
    components.append(f'''function {name}() {{
{declaration}  return (
    <BlueprintDrawing>
      <g strokeLinecap={{{cap}}} strokeLinejoin={{{join}}} strokeWidth={{{width}}}>
{drawing}
      </g>
    </BlueprintDrawing>
  );
}}
''')
    fields = "\n".join(f"    {key}: {json.dumps(item[key], ensure_ascii=False)}," for key in ("id", "code", "title", "description", "category"))
    entries.append("  {\n" + fields + f"\n    illustration: <{name} />,\n  }}")

imports = 'import { useId } from "react";\n' if uses_ids else ""
output = '// Generated from drawings/*.svg by scripts/build-plotter-drawings.py. Edit the SVG sources.\n'
output += imports + 'import { BlueprintDrawing } from "./blueprint-drawing";\nimport type { IllustrationStudy } from "./study-types";\n\n'
output += "\n".join(components)
output += "\nexport const expandedStudies: IllustrationStudy[] = [\n" + ",\n".join(entries) + "\n];\n"
(ROOT / "expanded-studies.tsx").write_text(output)
print(f"Compiled {len(manifest)} editable SVG drawings.")
