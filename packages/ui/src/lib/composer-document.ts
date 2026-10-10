import type { ReactNode } from "react";
import { getComposerQuery } from "@coss/ui/lib/composer-query";

type ComposerPart =
  | { type: "text"; text: string }
  | {
      type: "mention" | "action";
      id: string;
      label: string;
      trigger: string;
      kind?: string;
    };

type ComposerValue = readonly ComposerPart[];
type ComposerTokenPart = Exclude<ComposerPart, { type: "text" }>;

type ComposerItemValue = {
  id: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  type?: "mention" | "action";
  kind?: string;
};

type ComposerTrigger = {
  character: string;
  items: readonly ComposerItemValue[];
  status?: "ready" | "loading" | "error";
  itemsFor?: string;
  filter?: ((item: ComposerItemValue, query: string) => boolean) | null;
};

type ActiveQuery = {
  character: string;
  text: string;
  node: Text;
  start: number;
  end: number;
  key: string;
};

function pushText(parts: ComposerPart[], text: string): void {
  if (!text) return;
  const previous = parts[parts.length - 1];
  if (previous?.type === "text") previous.text += text;
  else parts.push({ type: "text", text });
}

function readValue(
  root: HTMLElement,
  ignoreTrailingPlaceholder = true,
): ComposerValue {
  if (root instanceof HTMLTextAreaElement) {
    return root.value ? [{ type: "text", text: root.value }] : [];
  }
  const parts: ComposerPart[] = [];
  function children(parent: HTMLElement): void {
    const nodes = Array.from(parent.childNodes);
    for (const [index, node] of nodes.entries()) {
      if (node instanceof Text) {
        pushText(parts, node.data);
        continue;
      }
      if (!(node instanceof HTMLElement)) continue;
      const tokenType = node.dataset.composerToken;
      if (tokenType === "mention" || tokenType === "action") {
        parts.push({
          type: tokenType,
          id: node.dataset.id ?? "",
          label: node.dataset.label ?? "",
          trigger: node.dataset.trigger ?? "@",
          ...(node.dataset.kind ? { kind: node.dataset.kind } : {}),
        });
      } else if (node.tagName === "BR") {
        if (node.hasAttribute("data-composer-placeholder")) continue;
        // Browsers end empty lines with a placeholder BR, which is not another newline.
        if (!ignoreTrailingPlaceholder || index !== nodes.length - 1)
          pushText(parts, "\n");
      } else {
        const isBlock = node.tagName === "DIV" || node.tagName === "P";
        if (
          isBlock &&
          index > 0 &&
          !(nodes[index - 1] instanceof HTMLBRElement)
        )
          pushText(parts, "\n");
        children(node);
        if (isBlock && index < nodes.length - 1) {
          const next = nodes[index + 1];
          if (
            !(
              next instanceof HTMLElement &&
              (next.tagName === "DIV" || next.tagName === "P")
            )
          )
            pushText(parts, "\n");
        }
      }
    }
  }
  children(root);
  return parts;
}

function normalizeValue(value: ComposerValue): ComposerValue {
  const parts: ComposerPart[] = [];
  for (const part of value) {
    if (part.type === "text") pushText(parts, part.text);
    else parts.push(part);
  }
  return parts;
}

function equalValue(left: ComposerValue, right: ComposerValue): boolean {
  const a = normalizeValue(left);
  const b = normalizeValue(right);
  return (
    a.length === b.length &&
    a.every((part, index) => {
      const other = b[index];
      if (part.type === "text")
        return other?.type === "text" && part.text === other.text;
      return (
        other?.type !== "text" &&
        other?.type === part.type &&
        other.id === part.id &&
        other.label === part.label &&
        other.trigger === part.trigger &&
        other.kind === part.kind
      );
    })
  );
}

function getComposerText(value: ComposerValue): string {
  return value
    .map((part) =>
      part.type === "text" ? part.text : `${part.trigger}${part.label}`,
    )
    .join("");
}

function createToken(part: ComposerTokenPart): HTMLSpanElement {
  const token = document.createElement("span");
  token.dataset.composerToken = part.type;
  token.dataset.id = part.id;
  token.dataset.label = part.label;
  token.dataset.trigger = part.trigger;
  if (part.kind) token.dataset.kind = part.kind;
  token.contentEditable = "false";
  const fallback = document.createElement("span");
  fallback.dataset.slot = "composer-token-fallback";
  fallback.textContent = `${part.trigger}${part.label}`;
  const renderer = document.createElement("span");
  renderer.dataset.slot = "composer-token-renderer";
  token.append(fallback, renderer);
  return token;
}

function writeValue(root: HTMLElement, value: ComposerValue): void {
  if (root instanceof HTMLTextAreaElement) {
    root.value = getComposerText(value);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const part of value) {
    if (part.type !== "text") fragment.append(createToken(part));
    else if (part.text) fragment.append(document.createTextNode(part.text));
  }
  if (getComposerText(value).endsWith("\n")) {
    const placeholder = document.createElement("br");
    placeholder.dataset.composerPlaceholder = "";
    fragment.append(placeholder);
  }
  root.replaceChildren(fragment);
}

function insertPlainText(root: HTMLElement, text: string): void {
  const selection = window.getSelection();
  if (
    !selection?.rangeCount ||
    !root.contains(selection.anchorNode) ||
    !root.contains(selection.focusNode)
  )
    return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text.replace(/\r\n?/g, "\n"));
  range.insertNode(node);
  range.setStart(node, node.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function placeCaretAfterToken(
  root: HTMLElement,
  selection: Selection | null,
): void {
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (!range.collapsed) return;
  const anchor = selection.anchorNode;
  const token = (
    anchor instanceof Element ? anchor : anchor?.parentElement
  )?.closest("[data-composer-token]");
  if (token && root.contains(token)) {
    const next = token.nextSibling;
    if (next instanceof Text && /^\s/u.test(next.data)) {
      selection.collapse(next, 1);
    } else if (token.parentNode) {
      selection.collapse(
        token.parentNode,
        Array.from(token.parentNode.childNodes).indexOf(token) + 1,
      );
    }
    return;
  }
  const { startContainer, startOffset } = range;
  if (startContainer instanceof Text) {
    if (/^\s/u.test(startContainer.data.slice(startOffset)))
      selection.collapse(startContainer, startOffset + 1);
  } else {
    const next = startContainer.childNodes[startOffset];
    if (next instanceof Text && /^\s/u.test(next.data))
      selection.collapse(next, 1);
  }
}

function currentQuery(
  root: HTMLElement,
  triggers: readonly ComposerTrigger[],
): ActiveQuery | null {
  const selection = window.getSelection();
  if (!selection?.isCollapsed || !root.contains(selection.anchorNode))
    return null;
  const node = selection.anchorNode;
  if (
    !(node instanceof Text) ||
    node.parentElement?.closest("[data-composer-token]")
  )
    return null;
  let caret = selection.anchorOffset;
  let merged = false;
  // Paste and token deletion can leave one query split across adjacent text nodes.
  while (node.previousSibling instanceof Text) {
    const previous = node.previousSibling;
    caret += previous.length;
    node.insertData(0, previous.data);
    previous.remove();
    merged = true;
  }
  while (node.nextSibling instanceof Text) {
    const next = node.nextSibling;
    node.appendData(next.data);
    next.remove();
    merged = true;
  }
  if (merged) selection.collapse(node, caret);
  const query = getComposerQuery(
    node.data,
    caret,
    triggers.map((trigger) => trigger.character),
  );
  if (!query) return null;
  if (
    query.start === 0 &&
    node.previousSibling?.textContent &&
    !/\s$/u.test(node.previousSibling.textContent)
  )
    return null;
  return {
    ...query,
    node,
    key: `${query.character}:${query.start}:${caret}:${query.text}`,
  };
}

function getFilteredItems(
  trigger: ComposerTrigger | undefined,
  query: ActiveQuery | null,
  defaultFilter: (text: string, query: string) => boolean,
): readonly ComposerItemValue[] {
  if (
    !trigger ||
    !query ||
    (trigger.status && trigger.status !== "ready") ||
    (trigger.itemsFor !== undefined && trigger.itemsFor !== query.text)
  )
    return [];
  if (trigger.filter === null) return trigger.items;
  return trigger.items.filter((item) =>
    trigger.filter
      ? trigger.filter(item, query.text)
      : defaultFilter(item.label, query.text),
  );
}

function hasVisibleItems(
  trigger: ComposerTrigger | undefined,
  options: readonly ComposerItemValue[],
): boolean {
  return Boolean(
    trigger &&
      (options.length ||
        trigger.status === "loading" ||
        trigger.status === "error"),
  );
}

function insertItem(
  input: HTMLDivElement,
  query: ActiveQuery,
  suggestion: ComposerItemValue,
): void {
  const range = document.createRange();
  range.setStart(query.node, query.start);
  range.setEnd(query.node, query.end);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  input.focus({ preventScroll: true });
  const token = createToken({
    type: suggestion.type ?? "mention",
    id: suggestion.id,
    label: suggestion.label,
    trigger: query.character,
    ...(suggestion.kind ? { kind: suggestion.kind } : {}),
  });
  const hasSeparator = /^\s/u.test(query.node.data.slice(query.end));
  const trailingSpace = hasSeparator ? "" : " ";
  range.deleteContents();
  const space = trailingSpace ? document.createTextNode(trailingSpace) : null;
  if (space) range.insertNode(space);
  range.insertNode(token);
  if (space) range.setStart(space, 1);
  else range.setStartAfter(token);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
  placeCaretAfterToken(input, selection);
  input.focus({ preventScroll: true });
}

type ComposerSelection = { anchor: number; focus: number };

// Use canonical text offsets so chip labels and their icons do not move the caret.
function readSelection(input: HTMLElement): ComposerSelection | null {
  if (input instanceof HTMLTextAreaElement) {
    return document.activeElement === input
      ? {
          anchor:
            input.selectionDirection === "backward"
              ? input.selectionEnd
              : input.selectionStart,
          focus:
            input.selectionDirection === "backward"
              ? input.selectionStart
              : input.selectionEnd,
        }
      : null;
  }
  const selection = window.getSelection();
  if (
    !selection?.anchorNode ||
    !selection.focusNode ||
    !input.contains(selection.anchorNode) ||
    !input.contains(selection.focusNode)
  )
    return null;
  function offset(node: Node, position: number): number {
    const range = document.createRange();
    range.selectNodeContents(input);
    range.setEnd(node, position);
    const fragment = document.createElement("div");
    fragment.append(range.cloneContents());
    return getComposerText(readValue(fragment, false)).length;
  }
  return {
    anchor: offset(selection.anchorNode, selection.anchorOffset),
    focus: offset(selection.focusNode, selection.focusOffset),
  };
}

function restoreSelection(
  input: HTMLElement,
  selection: ComposerSelection | null,
): void {
  if (!selection) return;
  if (input instanceof HTMLTextAreaElement) {
    input.setSelectionRange(
      Math.min(selection.anchor, selection.focus),
      Math.max(selection.anchor, selection.focus),
      selection.anchor > selection.focus ? "backward" : "forward",
    );
    return;
  }
  function point(offset: number): [Node, number] {
    let remaining = offset;
    for (const [index, node] of Array.from(input.childNodes).entries()) {
      const length =
        node instanceof HTMLElement && node.dataset.composerToken
          ? (node.dataset.trigger ?? "").length +
            (node.dataset.label ?? "").length
          : (node.textContent ?? "").length;
      if (remaining <= length) {
        if (node instanceof Text) return [node, remaining];
        return [input, index + (remaining > 0 ? 1 : 0)];
      }
      remaining -= length;
    }
    return [input, input.childNodes.length];
  }
  const [anchor, anchorOffset] = point(selection.anchor);
  const [focus, focusOffset] = point(selection.focus);
  window
    .getSelection()
    ?.setBaseAndExtent(anchor, anchorOffset, focus, focusOffset);
}

type ComposerSnapshot = {
  value: ComposerValue;
  selection: ComposerSelection | null;
};

export {
  type ComposerPart,
  type ComposerValue,
  type ComposerTokenPart,
  type ComposerItemValue,
  type ComposerTrigger,
  type ActiveQuery,
  type ComposerSelection,
  type ComposerSnapshot,
  currentQuery,
  getFilteredItems,
  hasVisibleItems,
  insertItem,
  readSelection,
  restoreSelection,
  readValue,
  writeValue,
  equalValue,
  insertPlainText,
  getComposerText,
};
