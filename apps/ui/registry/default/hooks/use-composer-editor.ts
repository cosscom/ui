"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import type {
  ComponentProps,
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getComposerQuery } from "@/registry/default/lib/composer-query";

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

function readValue(root: HTMLElement): ComposerValue {
  const parts: ComposerPart[] = [];

  function visit(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(parts, node.textContent ?? "");
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    const tokenType = node.dataset.composerToken;
    if (tokenType === "mention" || tokenType === "action") {
      parts.push({
        type: tokenType,
        id: node.dataset.id ?? "",
        label: node.dataset.label ?? "",
        trigger: node.dataset.trigger ?? "@",
        ...(node.dataset.kind ? { kind: node.dataset.kind } : {}),
      });
      return;
    }
    if (node.tagName === "BR") {
      if (node !== root.firstChild || root.childNodes.length > 1)
        pushText(parts, "\n");
      return;
    }
    const isLine = node.tagName === "DIV" || node.tagName === "P";
    if (isLine && parts.length) pushText(parts, "\n");
    node.childNodes.forEach(visit);
  }

  root.childNodes.forEach(visit);
  return parts;
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
  const fragment = document.createDocumentFragment();
  for (const part of value) {
    if (part.type !== "text") fragment.append(createToken(part));
    else if (part.text) fragment.append(document.createTextNode(part.text));
  }
  root.replaceChildren(fragment);
}

function insertPlainText(root: HTMLElement, text: string): void {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !root.contains(selection.anchorNode)) return;
  if (document.execCommand("insertText", false, text)) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
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
  const caret = selection.anchorOffset;
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
  if (
    document.execCommand(
      "insertHTML",
      false,
      `${token.outerHTML}${trailingSpace}`,
    )
  ) {
    placeCaretAfterToken(input, selection);
  } else {
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
  }
  input.focus({ preventScroll: true });
}

type UseComposerEditorOptions = {
  value: ComposerValue;
  onValueChange: (value: ComposerValue) => void;
  onSubmit?: (value: ComposerValue) => void;
  onQueryChange?: (query: { character: string; text: string } | null) => void;
  triggers?: readonly ComposerTrigger[];
  disabled?: boolean;
  submitOnEnter?: "desktop" | "always" | "never";
};

type ComposerEditorController = {
  inputProps: ComponentProps<"div">;
  formProps: Pick<ComponentProps<"form">, "onSubmit">;
  isEmpty: boolean;
  canSubmit: boolean;
  submit: () => void;
  status: "ready" | "loading" | "error";
  tokenHosts: readonly HTMLSpanElement[];
  suggestions: {
    items: readonly ComposerItemValue[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onItemSelect: (item: ComposerItemValue) => void;
  };
};

export function useComposerEditor({
  value,
  onValueChange,
  onSubmit,
  onQueryChange,
  triggers = [],
  disabled = false,
  submitOnEnter = "always",
}: UseComposerEditorOptions): ComposerEditorController {
  const inputRef = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const dismissedQuery = useRef<string | null>(null);
  const [query, setQuery] = useState<ActiveQuery | null>(null);
  const [tokenHosts, setTokenHosts] = useState<HTMLSpanElement[]>([]);
  const trigger = triggers.find((item) => item.character === query?.character);
  const { contains } = useComposerFilter();
  const options = getFilteredItems(trigger, query, contains);
  const open = !disabled && Boolean(query) && hasVisibleItems(trigger, options);
  const isEmpty = !getComposerText(value);
  const canSubmit = !disabled && Boolean(getComposerText(value).trim());
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const queryCharacter = query?.character;
  const queryText = query?.text;

  const syncTokenHosts = useCallback((input: HTMLDivElement): void => {
    const next = Array.from(
      input.querySelectorAll<HTMLSpanElement>(
        '[data-slot="composer-token-renderer"]',
      ),
    );
    setTokenHosts((previous) =>
      previous.length === next.length &&
      previous.every((host, index) => host === next[index])
        ? previous
        : next,
    );
  }, []);

  useEffect(() => {
    onQueryChangeRef.current?.(
      queryCharacter && queryText !== undefined
        ? { character: queryCharacter, text: queryText }
        : null,
    );
  }, [queryCharacter, queryText]);

  useEffect(() => {
    if (
      query &&
      (disabled || !triggers.some((item) => item.character === query.character))
    )
      setQuery(null);
  }, [disabled, query, triggers]);

  useEffect(() => {
    const input = inputRef.current;
    if (
      input &&
      !composing.current &&
      JSON.stringify(readValue(input)) !== JSON.stringify(value)
    ) {
      writeValue(input, value);
      syncTokenHosts(input);
      setQuery(null);
      dismissedQuery.current = null;
    }
  }, [value, syncTokenHosts]);

  const updateQuery = (): void => {
    const next = inputRef.current
      ? currentQuery(inputRef.current, triggers)
      : null;
    if (!next || next.key !== dismissedQuery.current)
      dismissedQuery.current = null;
    setQuery(next?.key === dismissedQuery.current ? null : next);
  };

  const dismissSuggestions = (): void => {
    dismissedQuery.current = query?.key ?? null;
    setQuery(null);
  };

  const selectItem = (suggestion: ComposerItemValue): void => {
    const input = inputRef.current;
    if (disabled || !query || !input?.contains(query.node)) return;
    insertItem(input, query, suggestion);
    syncTokenHosts(input);
    setQuery(null);
    dismissedQuery.current = null;
    onValueChange(readValue(input));
  };

  const submit = (): void => {
    if (canSubmit && !composing.current) {
      dismissSuggestions();
      onSubmit?.(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229
    )
      return;
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      (submitOnEnter === "always" ||
        (submitOnEnter === "desktop" &&
          window.matchMedia("(pointer: fine)").matches))
    ) {
      event.preventDefault();
      submit();
    }
  };

  return {
    isEmpty,
    canSubmit,
    tokenHosts,
    submit,
    formProps: {
      onSubmit: (event: FormEvent<HTMLFormElement>) => {
        if (event.defaultPrevented) return;
        event.preventDefault();
        submit();
      },
    },
    inputProps: {
      ref: inputRef,
      contentEditable: !disabled,
      role: "textbox",
      tabIndex: 0,
      suppressContentEditableWarning: true,
      "aria-disabled": disabled || undefined,
      "aria-multiline": true,
      onKeyDown,
      onKeyUp: (event) => {
        if (!event.defaultPrevented && !composing.current) updateQuery();
      },
      onClick: updateQuery,
      onInput: (event) => {
        if (composing.current) return;
        onValueChange(readValue(event.currentTarget));
        syncTokenHosts(event.currentTarget);
        dismissedQuery.current = null;
        updateQuery();
      },
      onCompositionStart: () => {
        composing.current = true;
        setQuery(null);
      },
      onCompositionEnd: (event) => {
        composing.current = false;
        onValueChange(readValue(event.currentTarget));
        syncTokenHosts(event.currentTarget);
        updateQuery();
      },
      onPaste: (event) => {
        event.preventDefault();
        insertPlainText(
          event.currentTarget,
          event.clipboardData.getData("text/plain"),
        );
        onValueChange(readValue(event.currentTarget));
        syncTokenHosts(event.currentTarget);
        updateQuery();
      },
      onDrop: (event) => {
        event.preventDefault();
        insertPlainText(
          event.currentTarget,
          event.dataTransfer.getData("text/plain"),
        );
        onValueChange(readValue(event.currentTarget));
        syncTokenHosts(event.currentTarget);
        updateQuery();
      },
    },
    status: trigger?.status ?? "ready",
    suggestions: {
      items: options,
      open,
      onOpenChange: (nextOpen) => {
        if (!nextOpen) dismissSuggestions();
      },
      onItemSelect: selectItem,
    },
  };
}

export const useComposerFilter: typeof AutocompletePrimitive.useFilter =
  AutocompletePrimitive.useFilter;

export {
  type ComposerPart,
  type ComposerTokenPart,
  type ComposerValue,
  type ComposerItemValue,
  type ComposerTrigger,
  type UseComposerEditorOptions,
  type ComposerEditorController,
  getComposerText,
};
