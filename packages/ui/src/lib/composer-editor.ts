"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type {
  ComponentProps,
  Context,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from "react";
import {
  createContext,
  createElement,
  useContext,
  useId,
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
  onValueChange?: (value: ComposerValue) => void;
};

const ComposerEditorContext: Context<ComposerEditorController | null> =
  createContext<ComposerEditorController | null>(null);
const ComposerAnchorContext: Context<RefObject<HTMLFormElement | null> | null> =
  createContext<RefObject<HTMLFormElement | null> | null>(null);

export function useComposerEditorContext(): ComposerEditorController | null {
  return useContext(ComposerEditorContext);
}

export function useComposerAnchorContext(): RefObject<HTMLFormElement | null> | null {
  return useContext(ComposerAnchorContext);
}

export function ComposerEditorProvider({
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  onSubmit,
  onQueryChange,
  triggers,
  disabled,
  submitOnEnter,
  children,
}: ComposerEditorOptions & {
  children: ReactNode;
}): ReactElement {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const anchorRef = useRef<HTMLFormElement>(null);
  const editor = useComposerEditor({
    value: controlledValue ?? uncontrolledValue,
    onValueChange: (nextValue) => {
      if (controlledValue === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    onSubmit,
    onQueryChange,
    triggers,
    disabled,
    submitOnEnter,
  });

  return createElement(
    ComposerEditorContext.Provider,
    { value: editor },
    createElement(
      ComposerAnchorContext.Provider,
      { value: anchorRef },
      createElement(
        ComposerSuggestions<ComposerItemValue>,
        { ...editor.suggestions },
        children,
      ),
    ),
  );
}

type SuggestionsContextValue = {
  items: readonly unknown[];
  listId: string;
  highlightedIndex: number;
  inputProps: ComponentProps<"div">;
  highlightItem: (value: unknown) => void;
  selectItem: (value: unknown) => void;
};

const ComposerSuggestionsContext: Context<SuggestionsContextValue | null> =
  createContext<SuggestionsContextValue | null>(null);

export function useComposerSuggestionsContext(): SuggestionsContextValue | null {
  return useContext(ComposerSuggestionsContext);
}

export function ComposerSuggestions<ItemValue>({
  items,
  open,
  onOpenChange,
  onItemSelect,
  children,
}: {
  items: readonly ItemValue[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemSelect: (item: ItemValue) => void;
  children?: ReactNode;
}): ReactElement {
  const listId = useId();
  const [highlightedValue, setHighlightedValue] = useState<unknown>();
  const highlightedIndex = items.length
    ? Math.max(
        0,
        items.findIndex((item) => Object.is(item, highlightedValue)),
      )
    : -1;

  function isDisabled(index: number): boolean {
    return (
      document
        .getElementById(`${listId}-${index}`)
        ?.hasAttribute("data-disabled") ?? false
    );
  }

  function selectItem(value: unknown): void {
    const index = items.findIndex((item) => Object.is(item, value));
    if (!open || index < 0 || isDisabled(index)) return;
    const item = items[index];
    if (item === undefined) return;
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
      return;
    }
    if (event.key === "Tab") {
      onOpenChange(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!items.length) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      let index = highlightedIndex;
      for (let count = 0; count < items.length; count++) {
        index = (index + direction + items.length) % items.length;
        if (!isDisabled(index)) break;
      }
      if (isDisabled(index)) return;
      setHighlightedValue(() => items[index]);
      document
        .getElementById(`${listId}-${index}`)
        ?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (highlightedIndex >= 0) selectItem(items[highlightedIndex]);
    }
  }

  return createElement(
    ComposerSuggestionsContext.Provider,
    {
      value: {
        items,
        listId,
        highlightedIndex,
        inputProps: {
          "aria-autocomplete": "list",
          "aria-expanded": open,
          "aria-controls": open ? listId : undefined,
          "aria-activedescendant":
            open && highlightedIndex >= 0
              ? `${listId}-${highlightedIndex}`
              : undefined,
          onKeyDownCapture: onKeyDown,
        },
        highlightItem: (value) => setHighlightedValue(() => value),
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
    ),
  );
}

export {
  type ComposerItemValue,
  type ComposerPart,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  useComposerFilter,
} from "@coss/ui/hooks/use-composer-editor";
export type { ComposerEditorOptions };
