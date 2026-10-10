"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type {
  ComponentProps,
  Context,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from "react";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  type ComposerEditorController,
  type ComposerItemValue,
  type ComposerValue,
  type UseComposerEditorOptions,
  useComposerEditor,
} from "@coss/ui/hooks/use-composer-editor";

type ComposerEditorOptions = Omit<
  UseComposerEditorOptions,
  "value" | "onValueChange"
> & {
  value?: ComposerValue;
  defaultValue?: ComposerValue;
  onValueChange?: UseComposerEditorOptions["onValueChange"];
  name?: string;
  getSuggestionsAnnouncement?: (count: number) => string;
};

type ComposerContextValue = ComposerEditorController & { reset: () => void };
const ComposerEditorContext: Context<ComposerContextValue | null> =
  createContext<ComposerContextValue | null>(null);

function useComposerEditorContext(): ComposerContextValue | null {
  return useContext(ComposerEditorContext);
}

function useComposerContext(): Pick<
  ComposerContextValue,
  | "value"
  | "isEmpty"
  | "canSubmit"
  | "disabled"
  | "readOnly"
  | "status"
  | "submit"
  | "reset"
> {
  const context = useComposerEditorContext();
  if (!context)
    throw new Error("useComposerContext must be used within Composer.");
  const {
    value,
    isEmpty,
    canSubmit,
    disabled,
    readOnly,
    status,
    submit,
    reset,
  } = context;
  return {
    value,
    isEmpty,
    canSubmit,
    disabled,
    readOnly,
    status,
    submit,
    reset,
  };
}

function useComposerAnchorContext():
  | RefObject<HTMLFormElement | null>
  | undefined {
  return useComposerEditorContext()?.rootRef;
}

const emptyValue: ComposerValue = [];

function ComposerEditorProvider({
  value: controlledValue,
  defaultValue = emptyValue,
  onValueChange,
  getSuggestionsAnnouncement,
  children,
  ...options
}: ComposerEditorOptions & { children: ReactNode }): ReactElement {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const editor = useComposerEditor({
    ...options,
    value: controlledValue ?? uncontrolledValue,
    onValueChange: (nextValue, details) => {
      if (controlledValue === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue, details);
    },
  });
  const reset = () => editor.reset(defaultValue);
  const resetRef = useRef(reset);
  resetRef.current = reset;
  useEffect(() => {
    const form = editor.rootRef.current?.closest("form");
    if (!form) return;
    const onReset = (event: Event) => {
      queueMicrotask(() => {
        if (!event.defaultPrevented) resetRef.current();
      });
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  });

  return createElement(
    ComposerEditorContext.Provider,
    { value: { ...editor, reset } },
    createElement(
      ComposerSuggestions,
      { ...editor.suggestions, getSuggestionsAnnouncement },
      children,
    ),
  );
}

type RegisteredItem = { element: HTMLElement; disabled: boolean };
type SuggestionsContextValue = {
  items: readonly ComposerItemValue[];
  listId: string;
  highlightedId: string | undefined;
  inputProps: ComponentProps<"div">;
  registerItem: (id: string, item: RegisteredItem | null) => void;
  registerList: (element: HTMLElement | null) => void;
  highlightItem: (value: ComposerItemValue) => void;
  selectItem: (value: ComposerItemValue) => void;
};
const ComposerSuggestionsContext: Context<SuggestionsContextValue | null> =
  createContext<SuggestionsContextValue | null>(null);
function useComposerSuggestionsContext(): SuggestionsContextValue | null {
  return useContext(ComposerSuggestionsContext);
}

function defaultAnnouncement(count: number): string {
  return `${count} suggestion${count === 1 ? "" : "s"} available. Use the up and down arrow keys to navigate.`;
}

function ComposerSuggestions({
  enabled,
  items,
  open,
  onOpenChange,
  onItemSelect,
  getSuggestionsAnnouncement = defaultAnnouncement,
  children,
}: {
  enabled: boolean;
  items: readonly ComposerItemValue[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemSelect: (item: ComposerItemValue) => void;
  getSuggestionsAnnouncement?: (count: number) => string;
  children?: ReactNode;
}): ReactElement {
  const listId = useId();
  const [highlightedValue, setHighlightedValue] = useState<string>();
  const [registered, setRegistered] = useState<
    ReadonlyMap<string, RegisteredItem>
  >(() => new Map());
  const [listElement, registerList] = useState<HTMLElement | null>(null);
  const registerItem = useCallback(
    (id: string, item: RegisteredItem | null) => {
      setRegistered((previous) => {
        const next = new Map(previous);
        if (item) next.set(id, item);
        else next.delete(id);
        return next;
      });
    },
    [],
  );
  const enabledItems = items.filter(
    (item) =>
      !item.disabled &&
      registered.has(item.id) &&
      !registered.get(item.id)?.disabled,
  );
  const highlightedId =
    enabledItems.find((item) => item.id === highlightedValue)?.id ??
    enabledItems[0]?.id;
  const itemId = (id: string) => `${listId}-${encodeURIComponent(id)}`;

  function selectItem(value: ComposerItemValue): void {
    const item = enabledItems.find((item) => item.id === value.id);
    if (!open || !item) return;
    onItemSelect(item);
    onOpenChange(false);
    setHighlightedValue(undefined);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (
      !open ||
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229
    )
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
      setHighlightedValue(undefined);
    } else if (event.key === "Tab") {
      onOpenChange(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!enabledItems.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const index = enabledItems.findIndex((item) => item.id === highlightedId);
      const item =
        enabledItems[
          (index + direction + enabledItems.length) % enabledItems.length
        ];
      if (!item) return;
      setHighlightedValue(item.id);
      registered.get(item.id)?.element.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const item = enabledItems.find((item) => item.id === highlightedId);
      if (item) selectItem(item);
    }
  }

  return createElement(
    ComposerSuggestionsContext.Provider,
    {
      value: {
        items,
        listId,
        highlightedId,
        registerItem,
        registerList,
        inputProps: {
          "aria-autocomplete": enabled ? "list" : undefined,
          "aria-haspopup": enabled ? "listbox" : undefined,
          "aria-controls": open && listElement ? listId : undefined,
          "aria-activedescendant":
            open && listElement && highlightedId
              ? itemId(highlightedId)
              : undefined,
          onKeyDown,
        },
        highlightItem: (value) => setHighlightedValue(value.id),
        selectItem,
      },
    },
    createElement(
      PopoverPrimitive.Root,
      {
        open,
        onOpenChange: (nextOpen: boolean) => {
          if (!nextOpen) setHighlightedValue(undefined);
          onOpenChange(nextOpen);
        },
      },
      children,
      createElement(
        "span",
        {
          role: "status",
          "aria-atomic": true,
          style: {
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clipPath: "inset(50%)",
            whiteSpace: "nowrap",
          },
        },
        open && listElement && enabledItems.length
          ? getSuggestionsAnnouncement(enabledItems.length)
          : "",
      ),
    ),
  );
}

function useComposerItem(
  value: ComposerItemValue | undefined,
  disabled: boolean,
) {
  const suggestions = useComposerSuggestionsContext();
  const registerItem = suggestions?.registerItem;
  const id = value?.id;
  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (id !== undefined)
        registerItem?.(id, element ? { element, disabled } : null);
    },
    [id, disabled, registerItem],
  );
  const highlighted = id !== undefined && id === suggestions?.highlightedId;
  return {
    ref,
    highlighted,
    props: {
      id:
        id !== undefined && suggestions
          ? `${suggestions.listId}-${encodeURIComponent(id)}`
          : undefined,
      role: suggestions ? "option" : undefined,
      tabIndex: suggestions ? -1 : undefined,
      "aria-selected": suggestions ? highlighted : undefined,
      "aria-disabled": disabled || undefined,
      "data-highlighted": highlighted ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      onPointerMove: () => {
        if (!disabled && value) suggestions?.highlightItem(value);
      },
      onClick: () => {
        if (!disabled && value) suggestions?.selectItem(value);
      },
      onMouseDown: (event: MouseEvent<HTMLButtonElement>) => {
        if (suggestions) event.preventDefault();
      },
    },
  };
}

function focusComposerInput(
  event: MouseEvent<HTMLFormElement>,
  preventDefault: boolean,
): void {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const interactive = event.target.closest(
    "button, a, input, select, textarea, label, summary, [data-slot='composer-input'], [contenteditable], [role='button'], [role='combobox'], [role='menuitem'], [tabindex]:not([tabindex='-1'])",
  );
  if (
    interactive &&
    interactive !== event.currentTarget &&
    event.currentTarget.contains(interactive)
  )
    return;
  const input = event.currentTarget.querySelector<HTMLElement>(
    '[data-slot="composer-input"]',
  );
  if (!input || input.matches(":disabled, [aria-disabled='true']")) return;
  if (preventDefault) event.preventDefault();
  input.focus();
}

function useComposerInputLayout() {
  const editor = useComposerEditorContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    for (const host of editor?.tokenHosts ?? []) {
      const fallback = host.previousElementSibling;
      if (fallback instanceof HTMLElement) fallback.hidden = true;
    }
  }, [editor?.tokenHosts]);
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const input = scroll?.querySelector<HTMLElement>(
      '[data-slot="composer-input"]',
    );
    if (!scroll || !input) return;
    function measure() {
      if (!scroll || !input) return;
      const style = getComputedStyle(input);
      scroll.style.setProperty("--composer-line-height", style.lineHeight);
      scroll.style.setProperty(
        "--composer-input-padding",
        `${Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)}px`,
      );
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(input);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  });
  return scrollRef;
}

export {
  type ComposerChangeDetails,
  type ComposerItemValue,
  type ComposerPart,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  useComposerFilter,
} from "@coss/ui/hooks/use-composer-editor";
export type { ComposerEditorOptions };

export {
  useComposerEditorContext,
  useComposerContext,
  useComposerAnchorContext,
  ComposerEditorProvider,
  useComposerSuggestionsContext,
  useComposerItem,
  focusComposerInput,
  useComposerInputLayout,
};
