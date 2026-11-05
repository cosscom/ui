"""Shared SVG-to-JSX serialization for Plotter catalogue and grammar drawings."""

import json
import re


def jsx_name(name):
    name = name.rsplit("}", 1)[-1]
    if name.startswith(("aria-", "data-", "--")):
        return name
    if name == "class":
        return "className"
    return re.sub(r"[-:]([a-z])", lambda m: m[1].upper(), name)


def js_string(value, ids, attribute=None):
    # Each component instance owns its defs, including repeated gallery renders.
    dynamic = value
    for svg_id in ids:
        dynamic = dynamic.replace(f"url(#{svg_id})", f"url(#${{id}}-{svg_id})")
        if dynamic == f"#{svg_id}":
            dynamic = f"#${{id}}-{svg_id}"
    if attribute in {"aria-labelledby", "aria-describedby"}:
        dynamic = " ".join(
            f"${{id}}-{token}" if token in ids else token
            for token in dynamic.split()
        )
    if dynamic != value:
        return "`" + dynamic.replace("`", "\\`") + "`"
    return json.dumps(value, ensure_ascii=False)


def element(node, ids, depth=3):
    tag = node.tag.rsplit("}", 1)[-1]
    if tag in {"metadata", "title", "desc"}:
        return ""
    attributes = []
    for key, value in node.attrib.items():
        key = jsx_name(key)
        if key == "id":
            attributes.append(f"id={{`${{id}}-{value}`}}")
        elif key == "style":
            styles = []
            for declaration in value.split(";"):
                if ":" in declaration:
                    prop, val = declaration.split(":", 1)
                    styles.append(f"{json.dumps(jsx_name(prop.strip()))}: {js_string(val.strip(), ids)}")
            attributes.append("style={{" + ", ".join(styles) + "}}")
        else:
            attributes.append(f"{key}={{{js_string(value, ids, key)}}}")
    start = " " * depth * 2 + "<" + tag
    if attributes:
        start += " " + " ".join(attributes)
    children = []
    if node.text and node.text.strip():
        content = json.dumps(node.text.strip(), ensure_ascii=False)
        if tag == "style":
            # Scope the source stylesheet to this rendered SVG instance.
            # Selector IDs and fragment URLs have different CSS syntax.
            def scope_selector(match):
                selector = re.sub(
                    r"#([\w-]+)",
                    lambda m: f'[id="${{id}}-{m[1]}"]' if m[1] in ids else m[0],
                    match[1],
                )
                return selector + "{"

            css = re.sub(r"([^{}]+)\{", scope_selector, node.text.strip())
            for svg_id in ids:
                css = css.replace(f"url(#{svg_id})", f"url(#${{id}}-{svg_id})")
            content = "`" + css.replace("`", "\\`") + "`"
        children.append(" " * (depth + 1) * 2 + "{" + content + "}")
    for child in node:
        rendered = element(child, ids, depth + 1)
        if rendered:
            children.append(rendered)
        if child.tail and child.tail.strip():
            children.append(" " * (depth + 1) * 2 + "{" + json.dumps(child.tail.strip(), ensure_ascii=False) + "}")
    if not children:
        return start + " />"
    return start + ">\n" + "\n".join(children) + "\n" + " " * depth * 2 + f"</{tag}>"

