// Inline code should wrap only between its words, never after the hyphens
// of a flag ("[-" / "-name N]", "--" / "ttl"). This wraps each space-free
// token of inline code in a span that doesn't break; the text, and what
// copying it gives, are unchanged. In running text only short tokens are
// held together, so a long URL can still wrap rather than widen a phone's
// page.
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

function wrapCode(code: Node, max: number) {
  const out: Node[] = [];
  for (const child of code.children ?? []) {
    if (child.type !== "text" || !child.value) {
      out.push(child);
      continue;
    }
    for (const part of child.value.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part) || !/[-/[]/.test(part) || part.length > max)
        out.push({ type: "text", value: part });
      else
        out.push({
          type: "element",
          tagName: "span",
          properties: { className: ["berth-nw"] },
          children: [{ type: "text", value: part }],
        });
    }
  }
  code.children = out;
}

function walk(node: Node, inCell: boolean, inPre: boolean) {
  const cell = inCell || node.tagName === "td" || node.tagName === "th";
  const pre = inPre || node.tagName === "pre";
  if (node.tagName === "code" && !pre) {
    wrapCode(node, cell ? Number.POSITIVE_INFINITY : 28);
    return;
  }
  for (const child of node.children ?? []) walk(child, cell, pre);
}

export function rehypeNowrapTokens() {
  return (tree: Node) => walk(tree, false, false);
}
