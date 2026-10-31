#!/usr/bin/env python3
"""Resolve a Plotter-authored static SVG without depending on the coss stylesheet."""

import argparse
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path


SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
FOUNDATION = Path(__file__).resolve().parents[1] / "assets" / "foundation"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)

WRAPPER_CLASSES = {
    "h-auto", "w-full", "overflow-visible", "font-sans", "text-foreground",
    "[font-optical-sizing:auto]", "[font-synthesis:none]",
    "[font-variation-settings:'GEOM'_25]",
}
STYLE_PROPERTIES = {
    "color", "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width",
    "stroke-opacity", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
    "stroke-dasharray", "stroke-dashoffset", "opacity", "clip-path", "clip-rule",
    "mask", "marker-start", "marker-mid", "marker-end", "font-family",
    "font-size", "font-weight", "font-style", "font-optical-sizing",
    "font-synthesis", "font-variation-settings", "font-variant-numeric",
    "letter-spacing", "text-anchor", "dominant-baseline", "alignment-baseline",
    "visibility", "display", "overflow", "shape-rendering", "vector-effect",
    "transform", "transform-origin", "transform-box",
}
IDREFS = {"aria-labelledby", "aria-describedby", "aria-controls", "aria-owns"}
ACTIVE_ELEMENTS = {"animate", "animateColor", "animateTransform", "animateMotion", "set", "discard", "script", "foreignObject"}
URL = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)


def local_name(name):
    return name.rsplit("}", 1)[-1]


def declarations(value):
    """Read the flat inline declarations supported by the authored SVG format."""
    result = {}
    for declaration in value.split(";"):
        if not declaration.strip():
            continue
        name, separator, body = declaration.partition(":")
        name, body = name.strip(), body.strip()
        if not separator or not body:
            raise ValueError(f"Invalid inline declaration: {declaration!r}")
        if name not in STYLE_PROPERTIES and not name.startswith("--"):
            raise ValueError(f"Unsupported inline style property: {name}")
        if "!important" in body:
            raise ValueError("Inline !important declarations are outside the export format.")
        result[name] = body
    return result


def resolve_variables(value, variables, seen=()):
    while "var(" in value:
        start = value.index("var(")
        depth, end = 1, start + 4
        while end < len(value) and depth:
            depth += (value[end] == "(") - (value[end] == ")")
            end += 1
        if depth:
            raise ValueError(f"Unclosed CSS variable: {value}")
        name, separator, fallback = value[start + 4:end - 1].partition(",")
        name = name.strip()
        if not re.fullmatch(r"--[\w-]+", name):
            raise ValueError(f"Invalid CSS variable name: {name}")
        if name in seen:
            raise ValueError(f"Cyclic CSS variable: {name}")
        if name in variables:
            replacement = resolve_variables(str(variables[name]), variables, (*seen, name))
        elif separator:
            replacement = resolve_variables(fallback.strip(), variables, seen)
        else:
            raise ValueError(f"Unresolved CSS variable: {name}")
        value = value[:start] + replacement + value[end:]
    return value


def paint(value, color):
    return re.sub(r"\bcurrentcolor\b", lambda _: color, value, flags=re.IGNORECASE)


def check_local_urls(value):
    for match in URL.finditer(value):
        if not match[2].startswith("#"):
            raise ValueError(f"External resource is unsupported: {match[0]}")
    if "url(" in URL.sub("", value).lower():
        raise ValueError(f"Unsupported resource reference: {value}")


def set_accessibility(root, title, description):
    def set_text(tag, supplied):
        node = next((child for child in root if isinstance(child.tag, str) and local_name(child.tag) == tag), None)
        if supplied is not None:
            if node is None:
                node = ET.Element(f"{{{SVG}}}{tag}")
                root.insert(0 if tag == "title" else 1, node)
            node.text = supplied
        if node is None or not "".join(node.itertext()).strip():
            option = "description" if tag == "desc" else "title"
            raise ValueError(f"Meaningful standalone output needs --{option} or an existing <{tag}>.")
        if "id" not in node.attrib:
            used = {element.get("id") for element in root.iter()}
            candidate, suffix = f"plotter-{tag}", 1
            while candidate in used:
                candidate = f"plotter-{tag}-{suffix}"
                suffix += 1
            node.set("id", candidate)
        return node.get("id")

    title_id = set_text("title", title)
    description_id = set_text("desc", description)
    root.attrib.pop("aria-hidden", None)
    root.attrib.pop("aria-label", None)
    root.set("role", "img")
    root.set("aria-labelledby", title_id)
    root.set("aria-describedby", description_id)


def namespace_references(root, prefix):
    ids = {}
    for node in root.iter():
        if "id" in node.attrib:
            original = node.get("id")
            if original in ids:
                raise ValueError(f"Duplicate SVG ID: {original}")
            ids[original] = f"{prefix}-{original}"

    def target(identifier):
        if identifier not in ids:
            raise ValueError(f"Reference has no local target: #{identifier}")
        return ids[identifier]

    for node in root.iter():
        for name, value in list(node.attrib.items()):
            if name == "id":
                node.set(name, ids[value])
            elif name in IDREFS:
                node.set(name, " ".join(target(part) for part in value.split()))
            elif local_name(name) == "href":
                if not value.startswith("#"):
                    raise ValueError(f"Only local SVG hrefs are supported: {value}")
                node.set(name, "#" + target(value[1:]))
            else:
                check_local_urls(value)
                node.set(name, URL.sub(lambda match: f"url(#{target(match[2][1:])})", value))


def export_svg(source, *, ink=None, title=None, description=None, id_prefix="plotter", tokens=None):
    if re.search(r"<!DOCTYPE|<!ENTITY|<\?xml-stylesheet", source, re.IGNORECASE):
        raise ValueError("External document declarations and stylesheet instructions are unsupported.")
    standard = json.loads((FOUNDATION / "standard.json").read_text())
    generated_css = (FOUNDATION / "roles.css").read_text().strip()
    parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))
    root = ET.fromstring(source, parser=parser)
    if local_name(root.tag) != "svg":
        raise ValueError("The input must be an SVG document.")
    if not re.fullmatch(r"[A-Za-z_][\w.-]*", id_prefix):
        raise ValueError("The ID prefix must start with a letter or underscore and contain only letters, numbers, _, ., or -.")
    overrides = dict(tokens or {})
    for name, value in overrides.items():
        if name != "--plotter-ink" and name not in standard["tokens"]:
            raise ValueError(f"Unknown Plotter token: {name}")
        if name != "--plotter-ink":
            number = float(value)
            if not math.isfinite(number) or number < 0:
                raise ValueError(f"Token {name} needs a finite non-negative number.")
            if "opacity" in name and number > 1:
                raise ValueError(f"Token {name} must be between zero and one.")
    if ink is not None:
        overrides["--plotter-ink"] = ink

    def resolve_node(node, inherited_variables, inherited_color, in_plotter=False):
        if not isinstance(node.tag, str):
            return
        tag = local_name(node.tag)
        if node.tag.startswith("{") and not node.tag.startswith(f"{{{SVG}}}"):
            raise ValueError(f"Unsupported element namespace: {node.tag}")
        node.tag = f"{{{SVG}}}{tag}"
        if tag in ACTIVE_ELEMENTS or tag == "image":
            raise ValueError(f"Static vector export does not support <{tag}>; supply the static vector drawing.")
        if tag == "style":
            raise ValueError("Only the generated Plotter role stylesheet is supported.")
        if any(local_name(name).lower().startswith("on") for name in node.attrib):
            raise ValueError("Active SVG event handlers are unsupported; export the static drawing.")

        classes = node.attrib.pop("class", "").split()
        if classes and (node is not root or set(classes) - WRAPPER_CLASSES):
            raise ValueError(f"Unresolved application classes: {' '.join(classes)}")
        styles = declarations(node.attrib.pop("style", ""))
        variables = {**inherited_variables, **{name: value for name, value in styles.items() if name.startswith("--")}}
        if node is root:
            variables.update(overrides)
            if "overflow-visible" in classes:
                styles.setdefault("overflow", "visible")
            defaults = {
                "font-family": "Cal Sans, sans-serif",
                "font-optical-sizing": "auto",
                "font-synthesis": "none",
                "font-variation-settings": "'GEOM' 25",
                "font-weight": "400",
            }
            for name, value in defaults.items():
                if name not in node.attrib:
                    styles.setdefault(name, value)

        local_color = resolve_variables(styles.get("color", node.get("color", inherited_color)), variables)
        if node is root and ink is not None:
            local_color = ink
            styles["color"] = ink
        if local_color.lower() in {"inherit", "currentcolor", "unset"}:
            local_color = inherited_color
        resolved_ink = paint(resolve_variables("var(--plotter-ink, currentColor)", variables), local_color)
        plotter_root = "data-plotter" in node.attrib
        if plotter_root:
            node.set("stroke", resolved_ink)
        if in_plotter and node.get("fill") == "currentColor" and "fill" not in styles:
            node.set("fill", resolved_ink)
        role_name = node.get("data-plotter-role")
        if role_name:
            if not in_plotter:
                raise ValueError(f"Role {role_name} is outside a data-plotter drawing.")
            if role_name not in standard["roles"]:
                raise ValueError(f"Unknown drawing role: {role_name}")
            role = standard["roles"][role_name]
            for property_name, token_name in (("stroke-width", role["width"]), ("opacity", role["opacity"])):
                node.set(property_name, resolve_variables(f"var({token_name}, {standard['tokens'][token_name]})", variables))
            node.set("stroke-dasharray", role["dash"])

        for name, value in list(node.attrib.items()):
            node.set(name, paint(resolve_variables(value, variables), local_color))
        resolved_styles = {
            name: paint(resolve_variables(value, variables), local_color)
            for name, value in styles.items() if not name.startswith("--")
        }
        if resolved_styles:
            node.set("style", ";".join(f"{name}:{value}" for name, value in resolved_styles.items()))
        for child in list(node):
            if isinstance(child.tag, str) and local_name(child.tag) == "style":
                if child.get("data-plotter-styles") != "true" or "".join(child.itertext()).strip() != generated_css:
                    raise ValueError("Unrecognized stylesheet; only the unmodified generated Plotter styles can be resolved.")
                node.remove(child)
            else:
                resolve_node(child, variables, local_color, in_plotter or plotter_root)

    resolve_node(root, {}, "#171717")
    view_box = root.get("viewBox", "").replace(",", " ").split()
    if len(view_box) != 4 or not all(math.isfinite(float(value)) for value in view_box) or any(float(value) <= 0 for value in view_box[2:]):
        raise ValueError("A finite SVG viewBox with positive width and height is required.")
    root.attrib.setdefault("width", view_box[2])
    root.attrib.setdefault("height", view_box[3])
    set_accessibility(root, title, description)
    namespace_references(root, id_prefix)
    return ET.tostring(root, encoding="unicode") + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--ink", help="Resolve the monochrome ink, for example '#171717'.")
    parser.add_argument("--title")
    parser.add_argument("--description")
    parser.add_argument("--id-prefix", default="plotter")
    parser.add_argument("--token", action="append", default=[], metavar="NAME=VALUE")
    args = parser.parse_args()
    try:
        tokens = {}
        for item in args.token:
            name, separator, value = item.partition("=")
            if not separator or not value:
                raise ValueError(f"Expected --token NAME=VALUE, got {item!r}")
            tokens[name] = value
        result = export_svg(
            args.input.read_text(), ink=args.ink, title=args.title,
            description=args.description, id_prefix=args.id_prefix, tokens=tokens,
        )
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(result)
    except (ValueError, OSError, ET.ParseError) as error:
        parser.exit(1, f"Plotter export: {error}\n")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
