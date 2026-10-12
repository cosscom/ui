// Reference tables, made linkable.
//
// - A two-column "Command | What it does" table becomes a list: each command's
//   signature on its own line, full width, with its description under it, and
//   an id from the command's words (`berth task new` is #berth-task-new).
//   Long signatures no longer wrap in a narrow column.
// - A "Field", "Event" or "Gate" table keeps its columns, and each row gets an
//   id (#setup, #agent-finished); the name in its first cell links to it. A
//   name used once on the page is its own id; one used in several tables
//   takes its section's id in front (#services-name). A row whose name is
//   already a heading on the page (`services`) links to that heading instead.
//
// The pages' Markdown stays plain tables, so they read the same on GitHub.
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const text = (n: Node): string =>
  n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(text).join("");
const elements = (n: Node | undefined) =>
  (n?.children ?? []).filter((c) => c.type === "element");
const el = (
  tagName: string,
  properties: Record<string, unknown>,
  children: Node[],
): Node => ({ type: "element", tagName, properties, children });

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// The command's own words: `berth task new BOX/LOC/NAME [--agent ID]` is
// "berth task new". A subcommand written as alternatives right after the
// command (`berth agent install|uninstall|status`) takes the first one.
export function commandId(signature: string): string {
  const words: string[] = [];
  for (const token of signature.trim().split(/\s+/)) {
    if (/^[a-z][a-z0-9-]*$/.test(token)) {
      words.push(token);
      continue;
    }
    if (
      words.length <= 2 &&
      /^[a-z][a-z0-9-]*(\|[a-z][a-z0-9-]*)+$/.test(token)
    )
      words.push(token.split("|")[0] ?? token);
    break;
  }
  return slug(words.join(" "));
}

function headers(table: Node): string[] {
  const thead = elements(table).find((c) => c.tagName === "thead");
  const row = elements(thead).find((c) => c.tagName === "tr");
  return elements(row).map((th) => text(th).trim());
}

function rows(table: Node): Node[] {
  const tbody = elements(table).find((c) => c.tagName === "tbody");
  return elements(tbody).filter((c) => c.tagName === "tr");
}

function firstCode(n: Node): Node | undefined {
  for (const c of n.children ?? []) {
    if (c.type !== "element") continue;
    if (c.tagName === "code") return c;
    const found = firstCode(c);
    if (found) return found;
  }
  return undefined;
}

type Kind = "command" | "field";

function kindOf(table: Node): Kind | undefined {
  const h = headers(table);
  if (h[0] === "Command" && h.length === 2) return "command";
  // "Field | Merge" restates fields documented above it; only the tables
  // that define them get ids.
  if (h[0] === "Field" && (h.includes("Type") || h.includes("Meaning")))
    return "field";
  if ((h[0] === "Event" || h[0] === "Gate") && h.length >= 2) return "field";
  return undefined;
}

type Found = {
  table: Node;
  kind: Kind;
  section?: string;
  parent: Node;
  index: number;
};

export function rehypeReference() {
  return (tree: Node) => {
    const ids = new Set<string>();
    const headingIds = new Set<string>();
    const found: Found[] = [];
    let section: string | undefined;

    // In document order: every id already on the page, the section each
    // table sits in, and the tables to change.
    const walk = (node: Node) => {
      (node.children ?? []).forEach((child, index) => {
        if (child.type !== "element") {
          walk(child);
          return;
        }
        const id = child.properties?.id;
        if (typeof id === "string") {
          ids.add(id);
          if (/^h[2-4]$/.test(child.tagName ?? "")) {
            headingIds.add(id);
            section = id;
          }
        }
        if (child.tagName === "table") {
          const kind = kindOf(child);
          if (kind)
            found.push({ table: child, kind, section, parent: node, index });
          return;
        }
        walk(child);
      });
    };
    walk(tree);

    const claim = (candidates: string[]) => {
      for (const c of candidates) {
        if (c && !ids.has(c)) {
          ids.add(c);
          return c;
        }
      }
      const base = candidates.find(Boolean) ?? "item";
      for (let i = 2; ; i++) {
        if (!ids.has(`${base}-${i}`)) {
          ids.add(`${base}-${i}`);
          return `${base}-${i}`;
        }
      }
    };

    // How often each field name appears across the page's field tables.
    const uses = new Map<string, number>();
    for (const f of found) {
      if (f.kind !== "field") continue;
      for (const tr of rows(f.table)) {
        const code = firstCode(elements(tr)[0] ?? { type: "root" });
        if (code)
          uses.set(slug(text(code)), (uses.get(slug(text(code))) ?? 0) + 1);
      }
    }

    for (const f of found) {
      if (f.kind === "command") {
        const items = rows(f.table).map((tr) => {
          const [sig, desc] = elements(tr);
          if (!sig) return el("div", { className: ["berth-ref-item"] }, []);
          const signature = text(sig).trim();
          const words = commandId(signature);
          const id = claim([words, slug(signature.split("[")[0] ?? signature)]);
          return el("div", { className: ["berth-ref-item"], id }, [
            el("dt", { className: ["berth-ref-sig"] }, [
              el(
                "a",
                {
                  className: ["berth-ref-anchor"],
                  href: `#${id}`,
                  ariaLabel: `Link to ${words.replace(/-/g, " ")}`,
                },
                [{ type: "text", value: "#" }],
              ),
              ...(sig.children ?? []),
            ]),
            el("dd", { className: ["berth-ref-desc"] }, desc?.children ?? []),
          ]);
        });
        f.parent.children![f.index] = el(
          "dl",
          { className: ["berth-ref"] },
          items,
        );
        continue;
      }

      f.table.properties = {
        ...f.table.properties,
        className: ["berth-fields"],
      };
      for (const tr of rows(f.table)) {
        const cell = elements(tr)[0];
        const code = cell && firstCode(cell);
        if (!cell || !code) continue;
        const name = slug(text(code));
        if (!name) continue;
        let href: string;
        if (headingIds.has(name)) {
          // Documented under its own heading: link there.
          href = `#${name}`;
        } else {
          const prefixed = f.section ? `${f.section}-${name}` : name;
          const id =
            (uses.get(name) ?? 0) > 1
              ? claim([prefixed, name])
              : claim([name, prefixed]);
          tr.properties = { ...tr.properties, id };
          href = `#${id}`;
        }
        // The code is the link; the row keeps everything else.
        const at = cell.children!.indexOf(code);
        if (at >= 0)
          cell.children![at] = el(
            "a",
            { className: ["berth-field-link"], href },
            [code],
          );
      }
    }
  };
}
