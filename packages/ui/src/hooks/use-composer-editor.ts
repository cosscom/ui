"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import {
  COMPOSER_CLIPBOARD_TYPE,
  parseComposerClipboard,
} from "@coss/ui/lib/composer-clipboard";
import {
  type ActiveQuery,
  type ComposerItemValue,
  type ComposerPart,
  type ComposerQuery,
  type ComposerSelection,
  type ComposerSnapshot,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  currentQuery,
  equalValue,
  getComposerText,
  getFilteredItems,
  hasVisibleItems,
  insertItem,
  insertPlainText,
  readSelection,
  readValue,
  restoreSelection,
  writeValue,
} from "@coss/ui/lib/composer-document";
import type {
  ComponentProps,
  FormEvent,
  KeyboardEvent,
  RefObject,
} from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type ComposerChangeDetails = {
  reason: "input" | "selection" | "history" | "reset";
};
type UseComposerEditorOptions = {
  value: ComposerValue;
  onValueChange: (value: ComposerValue, details: ComposerChangeDetails) => void;
  onSubmit?: (value: ComposerValue) => void;
  onQueryChange?: (query: ComposerQuery | null) => void;
  onAction?: (item: ComposerItemValue, query: ComposerQuery) => void;
  submitOnEmptySuggestions?: boolean;
  triggers?: readonly ComposerTrigger[];
  disabled?: boolean;
  readOnly?: boolean;
  submitDisabled?: boolean;
  allowEmpty?: boolean;
  submitOnEnter?: "desktop" | "always" | "never";
};

type ComposerEditorController = {
  value: ComposerValue;
  inputProps: ComponentProps<"div">;
  formProps: Pick<ComponentProps<"form">, "onSubmit">;
  rootRef: RefObject<HTMLFormElement | null>;
  isEmpty: boolean;
  isTextarea: boolean;
  isComposing: boolean;
  canSubmit: boolean;
  disabled: boolean;
  readOnly: boolean;
  submit: () => void;
  insertTrigger: (character: string) => void;
  reset: (value?: ComposerValue) => void;
  status: "ready" | "loading" | "error";
  tokenHosts: readonly HTMLSpanElement[];
  suggestions: {
    enabled: boolean;
    submitOnEmptySuggestions: boolean;
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
  onAction,
  submitOnEmptySuggestions = false,
  triggers = [],
  disabled = false,
  readOnly = false,
  submitDisabled = false,
  allowEmpty = false,
  submitOnEnter = "always",
}: UseComposerEditorOptions): ComposerEditorController {
  const inputRef = useRef<HTMLDivElement>(null);
  const [inputElement, setInputElement] = useState<HTMLDivElement | null>(null);
  const setInputRef = useCallback((element: HTMLDivElement | null): void => {
    inputRef.current = element;
    setInputElement(element);
  }, []);
  const isTextarea = inputElement?.tagName === "TEXTAREA";
  const history = useRef<{
    current: ComposerSnapshot;
    past: ComposerSnapshot[];
    future: ComposerSnapshot[];
    inputType: string;
    timestamp: number;
  }>({
    current: { value, selection: null },
    past: [],
    future: [],
    inputType: "",
    timestamp: 0,
  });
  const pendingInput = useRef({
    type: "",
    selection: null as ComposerSelection | null,
  });
  const lastSelection = useRef<ComposerSelection | null>(null);
  const historyAction = useRef<(direction: "undo" | "redo") => void>(() => {});
  const rootRef = useRef<HTMLFormElement>(null);
  const composing = useRef(false);
  const [isComposing, setIsComposing] = useState(false);
  const compositionValue = useRef(value);
  const ignoreCompositionInput = useRef(false);
  const dismissedQuery = useRef<string | null>(null);
  const queryAction = useRef<() => void>(() => {});
  const [query, setQuery] = useState<ActiveQuery | null>(null);
  const [tokenHosts, setTokenHosts] = useState<HTMLSpanElement[]>([]);
  const [, forceReconcile] = useState(0);
  const trigger = triggers.find((item) => item.character === query?.character);
  const { contains } = useComposerFilter();
  const options = getFilteredItems(trigger, query, contains);
  const open =
    !isTextarea &&
    !isComposing &&
    !disabled &&
    !readOnly &&
    Boolean(query) &&
    hasVisibleItems(trigger, options);
  const isEmpty = !getComposerText(value);
  const canSubmit =
    !isComposing &&
    !disabled &&
    !readOnly &&
    !submitDisabled &&
    (allowEmpty || Boolean(getComposerText(value).trim()));
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const queryCharacter = query?.character;
  const queryText = query?.text;
  const queryKey = query?.key;

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
      queryCharacter && queryText !== undefined && queryKey
        ? { character: queryCharacter, text: queryText, key: queryKey }
        : null,
    );
  }, [queryCharacter, queryText, queryKey]);

  useEffect(() => {
    if (
      query &&
      (disabled ||
        readOnly ||
        !triggers.some((item) => item.character === query.character))
    )
      setQuery(null);
  }, [disabled, readOnly, query, triggers]);

  useEffect(() => {
    const input = inputElement;
    if (!input || input instanceof HTMLTextAreaElement) return;
    const beforeInput = (event: InputEvent) => {
      if (event.defaultPrevented) return;
      if (disabled || readOnly || event.inputType.startsWith("format")) {
        event.preventDefault();
        return;
      }
      if (
        event.inputType === "historyUndo" ||
        event.inputType === "historyRedo"
      ) {
        event.preventDefault();
        historyAction.current(
          event.inputType === "historyUndo" ? "undo" : "redo",
        );
      } else if (!composing.current) {
        pendingInput.current = {
          type: event.inputType,
          selection: readSelection(input),
        };
      }
    };
    input.addEventListener("beforeinput", beforeInput);
    return () => input.removeEventListener("beforeinput", beforeInput);
  }, [inputElement, disabled, readOnly]);

  useEffect(() => {
    const onSelectionChange = () => {
      const input = inputRef.current;
      if (input && document.activeElement === input && !composing.current) {
        lastSelection.current = readSelection(input);
        queryAction.current();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  // Check each commit, including edits the controlled owner rejects without changing value.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || composing.current) return;
    const expected: ComposerValue =
      input instanceof HTMLTextAreaElement
        ? getComposerText(value)
          ? [{ type: "text", text: getComposerText(value) }]
          : []
        : value;
    if (!equalValue(history.current.current.value, expected)) {
      lastSelection.current = null;
      history.current = {
        current: { value: expected, selection: null },
        past: [],
        future: [],
        inputType: "",
        timestamp: 0,
      };
    }
    if (!equalValue(readValue(input), expected)) {
      const selection = readSelection(input);
      writeValue(input, expected);
      restoreSelection(input, selection);
      setQuery(null);
      dismissedQuery.current = null;
    }
    syncTokenHosts(input);
    if (input instanceof HTMLTextAreaElement) {
      input.disabled = disabled;
      input.readOnly = readOnly;
    }
  });

  const updateQuery = (): void => {
    const input = inputRef.current;
    const next =
      input &&
      !composing.current &&
      document.activeElement === input &&
      triggers.length > 0 &&
      !disabled &&
      !readOnly &&
      !(input instanceof HTMLTextAreaElement)
        ? currentQuery(input, triggers)
        : null;
    if (!next || next.key !== dismissedQuery.current)
      dismissedQuery.current = null;
    const active = next?.key === dismissedQuery.current ? null : next;
    setQuery((previous) =>
      previous?.key === active?.key && previous?.node === active?.node
        ? previous
        : active,
    );
  };

  queryAction.current = updateQuery;

  const dismissSuggestions = (): void => {
    dismissedQuery.current = query?.key ?? null;
    setQuery(null);
  };

  const publish = (reason: ComposerChangeDetails["reason"] = "input"): void => {
    const input = inputRef.current;
    if (!input || composing.current || disabled || readOnly) return;
    const next = readValue(input);
    if (!(input instanceof HTMLTextAreaElement)) {
      const previous = history.current;
      if (!equalValue(previous.current.value, next)) {
        const before = pendingInput.current;
        const now = Date.now();
        const group =
          reason === "input" &&
          /^(insertText|deleteContentBackward|deleteContentForward)$/.test(
            before.type,
          ) &&
          previous.inputType === before.type &&
          now - previous.timestamp < 1000 &&
          before.selection?.anchor === previous.current.selection?.anchor &&
          before.selection?.focus === previous.current.selection?.focus;
        if (!group)
          previous.past.push({
            ...previous.current,
            selection: before.selection,
          });
        if (previous.past.length > 100) previous.past.shift();
        previous.future = [];
        previous.current = { value: next, selection: readSelection(input) };
        previous.inputType = before.type;
        previous.timestamp = now;
      }
      pendingInput.current = { type: "", selection: null };
    }
    if (!equalValue(next, value)) onValueChange(next, { reason });
    forceReconcile((revision) => revision + 1);
    syncTokenHosts(input);
    dismissedQuery.current = null;
    updateQuery();
  };

  const selectItem = (suggestion: ComposerItemValue): void => {
    const input = inputRef.current;
    if (
      disabled ||
      readOnly ||
      composing.current ||
      suggestion.disabled ||
      !query ||
      !input?.contains(query.node)
    )
      return;
    pendingInput.current = {
      type: "selection",
      selection: readSelection(input),
    };
    if (suggestion.type === "action" && onAction) {
      const range = document.createRange();
      range.setStart(query.node, query.start);
      range.setEnd(query.node, query.end);
      range.deleteContents();
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      publish("selection");
      setQuery(null);
      onAction(suggestion, query);
      return;
    }
    insertItem(input, query, suggestion);
    publish("selection");
    setQuery(null);
  };

  const insertTrigger = (character: string): void => {
    const input = inputRef.current;
    if (
      !input ||
      input instanceof HTMLTextAreaElement ||
      disabled ||
      readOnly ||
      composing.current ||
      !triggers.some((trigger) => trigger.character === character)
    )
      return;
    const text = getComposerText(readValue(input));
    const selection = readSelection(input) ??
      lastSelection.current ?? {
        anchor: text.length,
        focus: text.length,
      };
    input.focus({ preventScroll: true });
    restoreSelection(input, selection);
    const start = Math.min(selection.anchor, selection.focus);
    const end = Math.max(selection.anchor, selection.focus);
    const preceding = text.slice(0, start);
    const following = text.slice(end);
    const prefix = preceding && !/\s$/u.test(preceding) ? " " : "";
    const suffix = following && !/^\s/u.test(following) ? " " : "";
    pendingInput.current = { type: "trigger", selection: readSelection(input) };
    insertPlainText(input, `${prefix}${character}${suffix}`);
    if (suffix) {
      const caret = start + prefix.length + character.length;
      restoreSelection(input, { anchor: caret, focus: caret });
    }
    publish();
    lastSelection.current = readSelection(input);
  };

  historyAction.current = (direction) => {
    const input = inputRef.current;
    if (
      !input ||
      input instanceof HTMLTextAreaElement ||
      disabled ||
      readOnly ||
      composing.current
    )
      return;
    const state = history.current;
    const source = direction === "undo" ? state.past : state.future;
    const destination = direction === "undo" ? state.future : state.past;
    const snapshot = source.pop();
    if (!snapshot) return;
    destination.push({
      value: readValue(input),
      selection: readSelection(input),
    });
    state.current = snapshot;
    state.inputType = "";
    writeValue(input, snapshot.value);
    restoreSelection(input, snapshot.selection);
    onValueChange(snapshot.value, { reason: "history" });
    forceReconcile((revision) => revision + 1);
    syncTokenHosts(input);
    dismissSuggestions();
  };

  const performSubmit = (): void => {
    if (!canSubmit || composing.current) return;
    dismissSuggestions();
    onSubmit?.(value);
  };

  const submit = (): void => {
    if (!canSubmit || composing.current) return;
    const root = rootRef.current;
    if (root instanceof HTMLFormElement) root.requestSubmit();
    else performSubmit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (
      event.defaultPrevented ||
      composing.current ||
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229
    )
      return;
    if (
      !(event.currentTarget instanceof HTMLTextAreaElement) &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key.toLowerCase() === "z" ||
        (event.ctrlKey && event.key.toLowerCase() === "y"))
    ) {
      event.preventDefault();
      historyAction.current(
        event.shiftKey || event.key.toLowerCase() === "y" ? "redo" : "undo",
      );
      return;
    }
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
    value,
    isEmpty,
    isTextarea,
    isComposing,
    canSubmit,
    disabled,
    readOnly,
    tokenHosts,
    submit,
    insertTrigger,
    rootRef,
    reset: (next = []) => {
      lastSelection.current = null;
      history.current = {
        current: { value: next, selection: null },
        past: [],
        future: [],
        inputType: "",
        timestamp: 0,
      };
      dismissSuggestions();
      onValueChange(next, { reason: "reset" });
      forceReconcile((revision) => revision + 1);
    },
    formProps: {
      onSubmit: (event: FormEvent<HTMLFormElement>) => {
        if (event.defaultPrevented || event.target !== event.currentTarget)
          return;
        event.preventDefault();
        performSubmit();
      },
    },
    inputProps: {
      ref: setInputRef,
      contentEditable: isTextarea ? undefined : !disabled && !readOnly,
      role: "textbox",
      tabIndex: disabled ? -1 : 0,
      suppressContentEditableWarning: true,
      "aria-disabled": disabled || undefined,
      "aria-readonly": readOnly || undefined,
      "aria-multiline": true,
      onKeyDown,
      onKeyUp: (event) => {
        if (!event.defaultPrevented && !composing.current) updateQuery();
      },
      onClick: updateQuery,
      onBlur: (event) => {
        lastSelection.current =
          readSelection(event.currentTarget) ?? lastSelection.current;
        dismissSuggestions();
      },
      onInput: () => {
        if (ignoreCompositionInput.current) return;
        publish();
      },
      onCompositionStart: () => {
        pendingInput.current = {
          type: "composition",
          selection: inputRef.current ? readSelection(inputRef.current) : null,
        };
        composing.current = true;
        setIsComposing(true);
        compositionValue.current = value;
        setQuery(null);
      },
      onCompositionEnd: () => {
        composing.current = false;
        setIsComposing(false);
        ignoreCompositionInput.current = true;
        queueMicrotask(() => {
          ignoreCompositionInput.current = false;
        });
        if (equalValue(compositionValue.current, value)) publish();
        forceReconcile((revision) => revision + 1);
      },
      onCopy: (event) => {
        if (
          event.defaultPrevented ||
          event.currentTarget instanceof HTMLTextAreaElement
        )
          return;
        const selection = window.getSelection();
        if (
          !selection?.rangeCount ||
          selection.isCollapsed ||
          !event.currentTarget.contains(selection.anchorNode) ||
          !event.currentTarget.contains(selection.focusNode)
        )
          return;
        const fragment = document.createElement("div");
        fragment.append(selection.getRangeAt(0).cloneContents());
        const copiedValue = readValue(fragment, false);
        event.clipboardData.setData("text/plain", getComposerText(copiedValue));
        event.clipboardData.setData(
          COMPOSER_CLIPBOARD_TYPE,
          JSON.stringify(copiedValue),
        );
        event.preventDefault();
      },
      onCut: (event) => {
        if (
          event.defaultPrevented ||
          event.currentTarget instanceof HTMLTextAreaElement
        )
          return;
        const selection = window.getSelection();
        if (
          !selection?.rangeCount ||
          selection.isCollapsed ||
          !event.currentTarget.contains(selection.anchorNode) ||
          !event.currentTarget.contains(selection.focusNode)
        )
          return;
        const fragment = document.createElement("div");
        fragment.append(selection.getRangeAt(0).cloneContents());
        const copiedValue = readValue(fragment, false);
        event.clipboardData.setData("text/plain", getComposerText(copiedValue));
        event.clipboardData.setData(
          COMPOSER_CLIPBOARD_TYPE,
          JSON.stringify(copiedValue),
        );
        event.preventDefault();
        if (disabled || readOnly || composing.current) return;
        pendingInput.current = {
          type: "cut",
          selection: readSelection(event.currentTarget),
        };
        selection.getRangeAt(0).deleteContents();
        publish();
      },
      onPaste: (event) => {
        if (
          event.defaultPrevented ||
          event.currentTarget instanceof HTMLTextAreaElement
        )
          return;
        event.preventDefault();
        if (disabled || readOnly || composing.current) return;
        pendingInput.current = {
          type: "paste",
          selection: readSelection(event.currentTarget),
        };
        const pastedValue = parseComposerClipboard(
          event.clipboardData.getData(COMPOSER_CLIPBOARD_TYPE),
        );
        if (pastedValue) {
          const selection = window.getSelection();
          if (
            !selection?.rangeCount ||
            !event.currentTarget.contains(selection.anchorNode) ||
            !event.currentTarget.contains(selection.focusNode)
          )
            return;
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const fragment = document.createElement("div");
          writeValue(fragment, pastedValue);
          const nodes = Array.from(fragment.childNodes);
          const last = nodes.at(-1);
          for (const node of nodes.reverse()) range.insertNode(node);
          if (last) range.setStartAfter(last);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else
          insertPlainText(
            event.currentTarget,
            event.clipboardData.getData("text/plain"),
          );
        publish();
      },
      onDrop: (event) => {
        if (
          event.defaultPrevented ||
          event.currentTarget instanceof HTMLTextAreaElement
        )
          return;
        event.preventDefault();
        if (disabled || readOnly || composing.current) return;
        const text = event.dataTransfer.getData("text/plain");
        if (!text) return;
        const documentWithCaret = document as Document & {
          caretPositionFromPoint?: (
            x: number,
            y: number,
          ) => { offsetNode: Node; offset: number } | null;
          caretRangeFromPoint?: (x: number, y: number) => Range | null;
        };
        const position = documentWithCaret.caretPositionFromPoint?.(
          event.clientX,
          event.clientY,
        );
        const range = documentWithCaret.caretRangeFromPoint?.(
          event.clientX,
          event.clientY,
        );
        const node = position?.offsetNode ?? range?.startContainer;
        const offset = position?.offset ?? range?.startOffset;
        if (
          !node ||
          offset === undefined ||
          !event.currentTarget.contains(node)
        )
          return;
        const token = (
          node instanceof Element ? node : node.parentElement
        )?.closest("[data-composer-token]");
        if (token) {
          const afterToken = document.createRange();
          afterToken.setStartAfter(token);
          afterToken.collapse(true);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(afterToken);
        } else {
          window.getSelection()?.collapse(node, offset);
        }
        event.currentTarget.focus({ preventScroll: true });
        pendingInput.current = {
          type: "drop",
          selection: readSelection(event.currentTarget),
        };
        insertPlainText(event.currentTarget, text);
        publish();
      },
    },
    status: trigger?.status ?? "ready",
    suggestions: {
      submitOnEmptySuggestions,
      enabled:
        triggers.length > 0 &&
        !isTextarea &&
        !isComposing &&
        !disabled &&
        !readOnly,
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
  type ComposerChangeDetails,
  type ComposerEditorController,
  type ComposerItemValue,
  type ComposerPart,
  type ComposerQuery,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  type UseComposerEditorOptions,
};
