"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRender } from "@base-ui/react/use-render";
import type {
  ComponentProps,
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  type ComposerEditorOptions,
  ComposerEditorProvider,
  type ComposerItemValue,
  type ComposerTokenPart,
  useComposerAnchorContext,
  useComposerEditorContext,
  useComposerSuggestionsContext,
} from "@/registry/default/lib/composer-editor";
import { cn } from "@/registry/default/lib/utils";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

type ComposerPopupProps = ComponentProps<typeof PopoverPrimitive.Popup> & {
  anchor?: ComponentProps<typeof PopoverPrimitive.Positioner>["anchor"];
  side?: ComponentProps<typeof PopoverPrimitive.Positioner>["side"];
  align?: ComponentProps<typeof PopoverPrimitive.Positioner>["align"];
  sideOffset?: ComponentProps<typeof PopoverPrimitive.Positioner>["sideOffset"];
  alignOffset?: ComponentProps<
    typeof PopoverPrimitive.Positioner
  >["alignOffset"];
  positionerClassName?: string;
  portalProps?: ComponentProps<typeof PopoverPrimitive.Portal>;
};

type ComposerFormProps = useRender.ComponentProps<"form">;
export type ComposerTokenVariant = "default" | "chip";
const composerTokenClassName =
  "inline align-baseline font-normal text-primary data-[variant=default]:font-medium data-[variant=chip]:box-decoration-clone data-[variant=chip]:rounded-md data-[variant=chip]:bg-accent data-[variant=chip]:px-1.5 data-[variant=chip]:py-px data-[variant=chip]:text-accent-foreground [&_[data-slot=composer-token-icon]:empty]:hidden [&_[data-slot=composer-token-icon]>svg]:size-3.5";

type ComposerManagedProps = Omit<
  ComposerFormProps,
  "defaultValue" | "onSubmit"
> &
  ComposerEditorOptions &
  (
    | { value: NonNullable<ComposerEditorOptions["value"]> }
    | { defaultValue: NonNullable<ComposerEditorOptions["defaultValue"]> }
    | { triggers: NonNullable<ComposerEditorOptions["triggers"]> }
    | { onValueChange: NonNullable<ComposerEditorOptions["onValueChange"]> }
  );
type ComposerPlainProps = Omit<ComposerFormProps, "defaultValue"> & {
  defaultValue?: never;
  value?: never;
  onValueChange?: never;
  triggers?: never;
  submitOnEnter?: ComposerEditorOptions["submitOnEnter"];
};

export function Composer(props: ComposerPlainProps): ReactElement;
export function Composer(props: ComposerManagedProps): ReactElement;
export function Composer(
  props: ComposerManagedProps | ComposerPlainProps,
): ReactElement {
  const {
    value,
    defaultValue,
    onValueChange,
    onSubmit,
    onQueryChange,
    triggers,
    disabled,
    submitOnEnter,
    ...frameProps
  } = props as ComposerManagedProps;
  const managed =
    value !== undefined ||
    Array.isArray(defaultValue) ||
    onValueChange !== undefined ||
    triggers !== undefined;
  if (managed) {
    return (
      <ComposerEditorProvider
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
        onQueryChange={onQueryChange}
        triggers={triggers}
        disabled={disabled}
        submitOnEnter={submitOnEnter}
      >
        <ComposerFrame {...frameProps} />
      </ComposerEditorProvider>
    );
  }
  const plainOnSubmit = (props as ComposerPlainProps).onSubmit;
  return (
    <ComposerFrame
      {...frameProps}
      submitOnEnter={submitOnEnter}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        plainOnSubmit?.(event);
      }}
    />
  );
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

function ComposerFrame({
  className,
  onClick,
  onMouseDown,
  render,
  ref,
  submitOnEnter = "always",
  ...props
}: ComposerFormProps & {
  submitOnEnter?: ComposerEditorOptions["submitOnEnter"];
}): ReactElement {
  const editor = useComposerEditorContext();
  const anchorRef = useComposerAnchorContext();
  const defaultProps = {
    "data-slot": "composer",
    "data-base-ui-swipe-ignore": "",
    onMouseDown: (event: MouseEvent<HTMLFormElement>): void => {
      onMouseDown?.(event);
      focusComposerInput(event, true);
    },
    onClick: (event: MouseEvent<HTMLFormElement>): void => {
      onClick?.(event);
      focusComposerInput(event, false);
    },
    onKeyDown: editor
      ? undefined
      : (event: KeyboardEvent<HTMLFormElement>): void => {
          const target = event.target;
          if (
            event.defaultPrevented ||
            !(target instanceof HTMLTextAreaElement) ||
            target.dataset.slot !== "composer-input" ||
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
            event.currentTarget.requestSubmit();
          }
        },
    className: cn(
      "relative flex min-w-0 cursor-text flex-col rounded-xl border border-input bg-background p-2 text-foreground shadow-xs/5 transition-shadow has-[[data-slot=composer-input]:focus-visible]:border-ring has-[[data-slot=composer-input]:focus-visible]:ring-[3px] has-[[data-slot=composer-input]:focus-visible]:ring-ring/24",
      className,
    ),
  };
  return useRender({
    defaultTagName: "form",
    render,
    ref: [anchorRef, ref ?? null],
    props: mergeProps<"form">(defaultProps, editor?.formProps ?? {}, props),
  });
}

export function ComposerInput({
  className,
  minRows,
  maxRows,
  placeholder,
  renderToken,
  render,
  ref,
  ...props
}: useRender.ComponentProps<"div"> & {
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
  renderToken?: (token: ComposerTokenPart) => ReactNode;
}): ReactElement {
  const editor = useComposerEditorContext();
  const suggestions = useComposerSuggestionsContext();
  const tokenHosts = editor?.tokenHosts;
  useLayoutEffect(() => {
    for (const host of tokenHosts ?? []) {
      const fallback = host.previousElementSibling;
      if (fallback instanceof HTMLElement) fallback.hidden = true;
    }
  }, [tokenHosts]);
  const { ref: editorRef, ...editorProps } = editor?.inputProps ?? {};
  const defaultProps = {
    "data-slot": "composer-input",
    ...(render === undefined
      ? {
          contentEditable: true,
          role: "textbox" as const,
          "aria-multiline": true as const,
          suppressContentEditableWarning: true,
        }
      : {}),
    "data-empty": editor?.isEmpty ? "" : undefined,
    "data-placeholder": placeholder,
    "aria-placeholder": editor ? placeholder : undefined,
    style:
      minRows === undefined
        ? undefined
        : ({ "--composer-min-rows": minRows } as CSSProperties),
    className: cn(
      "field-sizing-content wrap-anywhere relative block min-h-[calc(var(--composer-min-rows,1)*1lh+--spacing(2))] w-full min-w-0 resize-none whitespace-pre-wrap border-0 bg-transparent px-1 py-1 outline-none placeholder:text-muted-foreground/72 data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground/72 data-empty:before:content-[attr(data-placeholder)] md:min-h-[calc(var(--composer-min-rows,2)*1lh+--spacing(2))]",
      className,
    ),
  };
  const input = useRender({
    defaultTagName: "div",
    render,
    ref: [editorRef ?? null, ref ?? null],
    props: mergeProps<"div">(
      defaultProps,
      editorProps,
      props,
      suggestions?.inputProps ?? {},
    ),
  });
  return (
    <>
      <ScrollArea
        className="h-auto! min-w-0 text-base **:data-[slot=scroll-area-viewport]:h-auto! **:data-[slot=scroll-area-viewport]:max-h-[min(var(--composer-max-height,calc(var(--composer-max-rows,8)*1lh+--spacing(2))),50dvh)] md:text-sm"
        data-slot="composer-scroll-area"
        overscrollContain
        style={
          maxRows === undefined
            ? undefined
            : ({ "--composer-max-rows": maxRows } as CSSProperties)
        }
      >
        {input}
      </ScrollArea>
      {tokenHosts?.map((host, index) => {
        const node = host.parentElement;
        if (!node) return null;
        const token: ComposerTokenPart = {
          type: node.dataset.composerToken === "action" ? "action" : "mention",
          id: node.dataset.id ?? "",
          label: node.dataset.label ?? "",
          trigger: node.dataset.trigger ?? "@",
          ...(node.dataset.kind ? { kind: node.dataset.kind } : {}),
        };
        return createPortal(
          renderToken?.(token) ?? <ComposerToken token={token} />,
          host,
          String(index),
        );
      })}
    </>
  );
}

export function ComposerToken({
  variant = "default",
  token,
  icon,
  children,
  className,
  ...props
}: Omit<ComponentProps<"span">, "contentEditable"> & {
  variant?: ComposerTokenVariant;
  token: ComposerTokenPart;
  icon?: ReactNode;
}): ReactElement {
  return (
    <span
      className={cn(composerTokenClassName, className)}
      contentEditable={false}
      data-kind={token.kind}
      data-slot="composer-token"
      data-type={token.type}
      data-variant={variant}
      {...props}
    >
      {variant === "chip" && icon && (
        <span
          aria-hidden="true"
          className="me-1 inline-block align-[-0.125em] leading-none opacity-80"
          data-slot="composer-token-icon"
        >
          {icon}
        </span>
      )}
      <span data-slot="composer-token-label">
        {variant === "default" && token.trigger}
        {children ?? token.label}
      </span>
    </span>
  );
}

export function ComposerPopup({
  className,
  anchor,
  side = "top",
  align = "start",
  sideOffset = 4,
  alignOffset,
  positionerClassName,
  portalProps,
  ...props
}: ComposerPopupProps): ReactElement {
  const anchorRef = useComposerAnchorContext();
  const editor = useComposerEditorContext();
  return (
    <PopoverPrimitive.Portal {...portalProps}>
      <PopoverPrimitive.Positioner
        anchor={anchor ?? anchorRef ?? undefined}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn("z-50 w-(--anchor-width)", positionerClassName)}
        data-slot="composer-positioner"
      >
        <PopoverPrimitive.Popup
          className={cn(
            "relative w-(--anchor-width) max-w-(--available-width) rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:invisible data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
          data-slot="composer-popup"
          role={editor ? "presentation" : undefined}
          initialFocus={editor ? false : undefined}
          finalFocus={editor ? false : undefined}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export function ComposerList({
  className,
  children,
  render,
  ref,
  ...props
}: Omit<useRender.ComponentProps<"div">, "children"> & {
  children?:
    | ReactNode
    | ((item: ComposerItemValue, index: number) => ReactNode);
}): ReactElement {
  const suggestions = useComposerSuggestionsContext();
  const defaultProps = {
    "data-slot": "composer-list",
    id: suggestions?.listId,
    role: suggestions ? "listbox" : undefined,
    "aria-label": suggestions ? "Suggestions" : undefined,
    children:
      typeof children === "function"
        ? (suggestions?.items as readonly ComposerItemValue[] | undefined)?.map(
            children,
          )
        : children,
    className: cn(
      "not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3",
      className,
    ),
  };
  const list = useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps<"div">(defaultProps, props),
  });
  return (
    <ScrollArea
      className="h-auto! **:data-[slot=scroll-area-viewport]:h-auto! **:data-[slot=scroll-area-viewport]:max-h-[min(var(--available-height),16rem)]"
      overscrollContain
      scrollbarGutter
      scrollFade
    >
      {list}
    </ScrollArea>
  );
}

export function ComposerItem({
  className,
  value,
  disabled = false,
  render,
  ref,
  ...props
}: Omit<
  useRender.ComponentProps<
    "button",
    { highlighted: boolean; disabled: boolean }
  >,
  "value"
> & {
  value?: ComposerItemValue;
}): ReactElement {
  const suggestions = useComposerSuggestionsContext();
  const index =
    suggestions && value !== undefined
      ? suggestions.items.findIndex((item) => Object.is(item, value))
      : -1;
  const highlighted = index >= 0 && index === suggestions?.highlightedIndex;
  const defaultProps = {
    type: "button" as const,
    "data-slot": "composer-item",
    id: index >= 0 ? `${suggestions?.listId}-${index}` : undefined,
    role: suggestions ? "option" : undefined,
    tabIndex: suggestions ? -1 : undefined,
    disabled,
    "aria-selected": suggestions ? highlighted : undefined,
    "data-highlighted": highlighted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    onPointerMove: () => {
      if (!disabled && value !== undefined) suggestions?.highlightItem(value);
    },
    onClick: () => {
      if (!disabled && value !== undefined) suggestions?.selectItem(value);
    },
    onMouseDown: (event: MouseEvent<HTMLButtonElement>) => {
      if (suggestions) event.preventDefault();
    },
    className: cn(
      "flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-start text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
      className,
    ),
  };
  return useRender({
    defaultTagName: "button",
    render,
    ref,
    state: { highlighted, disabled },
    props: mergeProps<"button">(defaultProps, props),
  });
}

export function ComposerStatus({
  className,
  render,
  ref,
  ...props
}: useRender.ComponentProps<"div">): ReactElement {
  const defaultProps = {
    role: "status",
    "data-slot": "composer-status",
    className: cn(
      "px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0",
      className,
    ),
  };
  return useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export function ComposerActions({
  className,
  ...props
}: ComponentProps<"div">): ReactElement {
  return (
    <div
      className={cn("flex items-center justify-between gap-2", className)}
      data-slot="composer-actions"
      {...props}
    />
  );
}

export function ComposerActionGroup({
  className,
  align = "start",
  ...props
}: ComponentProps<"div"> & { align?: "start" | "end" }): ReactElement {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-1",
        align === "end" && "ms-auto justify-end",
        className,
      )}
      data-slot="composer-action-group"
      {...props}
    />
  );
}

export function ComposerSubmit({
  disabled,
  render,
  ref,
  ...props
}: Omit<useRender.ComponentProps<"button">, "type">): ReactElement {
  const editor = useComposerEditorContext();
  const defaultProps = {
    "data-slot": "composer-submit",
    type: "submit" as const,
    disabled: disabled ?? (editor ? !editor.canSubmit : undefined),
  };
  return useRender({
    defaultTagName: "button",
    render,
    ref,
    props: mergeProps<"button">(defaultProps, props),
  });
}

export type { ComposerPopupProps };
export type { ComposerManagedProps, ComposerPlainProps };
export {
  type ComposerItemValue,
  type ComposerPart,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  useComposerFilter,
} from "@/registry/default/lib/composer-editor";
