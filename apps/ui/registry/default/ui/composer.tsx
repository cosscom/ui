"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { mergeProps } from "@base-ui/react/merge-props";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRender } from "@base-ui/react/use-render";
import type {
  ComponentProps,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  type ComposerEditorOptions,
  ComposerEditorProvider,
  type ComposerItemValue,
  type ComposerTokenPart,
  focusComposerInput,
  getComposerText,
  useComposerAnchorContext,
  useComposerEditorContext,
  useComposerInputLayout,
  useComposerItem,
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
type ComposerLayout = "stacked" | "adaptive";
type ComposerTokenVariant = "default" | "chip";
const composerTokenClassName =
  "wrap-break-word inline cursor-default align-baseline font-normal text-primary data-[variant=default]:font-medium data-[variant=chip]:box-decoration-clone data-[variant=chip]:rounded-md data-[variant=chip]:bg-accent data-[variant=chip]:px-1.5 data-[variant=chip]:py-px data-[variant=chip]:text-accent-foreground [&_[data-slot=composer-token-icon]:empty]:hidden [&_[data-slot=composer-token-icon]>svg]:size-3.5";

function ComposerFrame({
  className,
  layout = "stacked",
  render,
  ref,
  name,
  children,
  ...props
}: ComposerFormProps & { layout?: ComposerLayout }): ReactElement {
  const editor = useComposerEditorContext();
  const anchorRef = useComposerAnchorContext();
  const defaultProps = {
    "data-slot": "composer",
    "data-layout": layout,
    "data-base-ui-swipe-ignore": "",
    onMouseDown: (event: MouseEvent<HTMLFormElement>): void => {
      focusComposerInput(event, true);
    },
    onClick: (event: MouseEvent<HTMLFormElement>): void => {
      focusComposerInput(event, false);
    },
    "data-disabled": editor?.disabled ? "" : undefined,
    "data-readonly": editor?.readOnly ? "" : undefined,
    children: (
      <>
        {children}
        {name && (
          <input
            type="hidden"
            name={name}
            value={getComposerText(editor?.value ?? [])}
            disabled={editor?.disabled}
          />
        )}
      </>
    ),
    className: cn(
      "relative flex min-h-0 min-w-0 cursor-text flex-col rounded-(--composer-radius) border border-input bg-background not-dark:bg-clip-padding pb-[calc(var(--composer-padding)-1px)] text-foreground shadow-xs/5 ring-ring/24 transition-shadow [--composer-max-rows:4] [--composer-padding:--spacing(2)] [--composer-radius:var(--radius-xl)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--composer-radius)-1px)] not-data-disabled:not-has-[[data-slot=composer-input]:focus-visible]:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-[[data-slot=composer-input]:focus-visible]:has-aria-invalid:border-destructive/64 has-[[data-slot=composer-input]:focus-visible]:has-aria-invalid:ring-destructive/16 has-[[data-slot=composer-input]:focus-visible]:border-ring has-aria-invalid:border-destructive/36 has-[[data-slot=composer-input]:focus-visible]:shadow-none has-aria-invalid:shadow-none has-[[data-slot=composer-input]:focus-visible]:ring-[3px] aria-invalid:border-destructive/36 aria-invalid:shadow-none data-disabled:opacity-64 data-disabled:shadow-none dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:has-aria-invalid:ring-destructive/24 dark:not-data-disabled:not-has-[[data-slot=composer-input]:focus-visible]:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] md:[--composer-max-rows:8]",
      "data-[layout=adaptive]:data-multiline:grid-rows-[minmax(0,1fr)_auto] data-[layout=adaptive]:grid data-[layout=adaptive]:grid-cols-[auto_minmax(0,1fr)_auto] data-[layout=adaptive]:items-center data-[layout=adaptive]:not-data-multiline:px-[calc(--spacing(2)-1px)] data-[layout=adaptive]:not-data-multiline:pt-[calc(var(--composer-padding)-1px)]",
      className,
    ),
  };
  return useRender({
    defaultTagName: "form",
    render,
    ref: [anchorRef ?? null, ref ?? null],
    props: mergeProps<"form">(defaultProps, editor?.formProps ?? {}, props),
  });
}

export type ComposerProps = Omit<
  ComposerFormProps,
  "defaultValue" | "onSubmit" | "name"
> &
  ComposerEditorOptions & { layout?: ComposerLayout };

export function Composer({
  layout,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  onQueryChange,
  triggers,
  disabled,
  readOnly,
  submitDisabled,
  allowEmpty,
  submitOnEnter,
  name,
  getSuggestionsAnnouncement,
  ...frameProps
}: ComposerProps): ReactElement {
  return (
    <ComposerEditorProvider
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onSubmit={onSubmit}
      onQueryChange={onQueryChange}
      triggers={triggers}
      disabled={disabled}
      readOnly={readOnly}
      submitDisabled={submitDisabled}
      allowEmpty={allowEmpty}
      submitOnEnter={submitOnEnter}
      getSuggestionsAnnouncement={getSuggestionsAnnouncement}
    >
      <ComposerFrame {...frameProps} layout={layout} name={name} />
    </ComposerEditorProvider>
  );
}

export function ComposerInput({
  className,
  placeholder,
  renderToken,
  render,
  ref,
  ...props
}: useRender.ComponentProps<"div"> & {
  placeholder?: string;
  renderToken?: (token: ComposerTokenPart) => ReactNode;
}): ReactElement {
  const editor = useComposerEditorContext();
  const suggestions = useComposerSuggestionsContext();
  const tokenHosts = editor?.tokenHosts;
  const { scrollRef, inputRef: layoutInputRef } = useComposerInputLayout();
  const textarea = editor?.isTextarea ?? false;
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
    "data-empty":
      !textarea && editor?.isEmpty && !editor.isComposing ? "" : undefined,
    ...(textarea ? { placeholder } : {}),
    "data-placeholder": placeholder,
    "aria-placeholder": editor ? placeholder : undefined,
    className: cn(
      "field-sizing-content wrap-anywhere relative block min-h-[calc(var(--composer-min-rows,1)*1lh+--spacing(2))] w-full min-w-0 resize-none whitespace-pre-wrap border-0 bg-transparent in-[[data-layout=adaptive]:not([data-multiline])]:px-1 px-[calc(--spacing(3)-1px)] py-1 outline-none placeholder:text-muted-foreground/72 data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground/72 data-empty:before:content-[attr(data-placeholder)] md:in-data-[layout=adaptive]:min-h-[calc(var(--composer-min-rows,1)*1lh+--spacing(2))] md:min-h-[calc(var(--composer-min-rows,2)*1lh+--spacing(2))]",
      className,
    ),
  };
  const inputBehaviorProps = textarea
    ? {
        contentEditable: undefined,
        disabled: editor?.disabled,
        readOnly: editor?.readOnly,
      }
    : (suggestions?.inputProps ?? {});
  const input = useRender({
    defaultTagName: "div",
    render,
    ref: [editorRef ?? null, layoutInputRef, ref ?? null],
    props: mergeProps<"div">(
      defaultProps,
      editorProps,
      inputBehaviorProps,
      props,
    ),
  });
  return (
    <>
      {/* The drawer reserves keyboard space; its nested input scroller needs no extra bottom padding. */}
      <ScrollArea
        ref={scrollRef}
        className="in-[[data-layout=adaptive][data-multiline]]:col-span-full in-[[data-layout=adaptive][data-multiline]]:col-start-1 in-data-[layout=adaptive]:col-start-2 in-data-[layout=adaptive]:row-start-1 flex h-auto! min-h-0 min-w-0 flex-col in-[[data-layout=adaptive][data-multiline]]:self-stretch in-[[data-layout=adaptive]:not([data-multiline])]:rounded-none rounded-t-[inherit] text-base [--composer-scroll-padding:var(--composer-padding)] in-[[data-layout=adaptive]:not([data-multiline])]:[--composer-scroll-padding:0px] **:data-[slot=scroll-area-viewport]:h-auto! **:data-[slot=scroll-area-viewport]:max-h-[min(var(--composer-max-height,calc(var(--composer-max-rows,8)*var(--composer-line-height,1lh)+var(--composer-input-padding,--spacing(2))+var(--composer-scroll-padding))),50dvh)] **:data-[slot=scroll-area-viewport]:min-h-0 **:data-[slot=scroll-area-content]:pt-[max(0px,calc(var(--composer-scroll-padding)-1px))] **:data-[slot=scroll-area-viewport]:pb-0! md:text-sm"
        data-slot="composer-scroll-area"
        overscrollContain
        scrollFade
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
          className="inline whitespace-nowrap opacity-80 after:content-['\2060\00a0'] [&>svg]:inline-block [&>svg]:align-[-0.125em]"
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
    ref: [suggestions?.registerList ?? null, ref ?? null],
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
  disabled: disabledProp,
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
  const disabled = Boolean(disabledProp || value?.disabled);
  const item = useComposerItem(value, disabled);
  const { highlighted } = item;
  const defaultProps = {
    ...item.props,
    type: "button" as const,
    "data-slot": "composer-item",
    disabled,
    className: cn(
      "flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-start text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
      className,
    ),
  };
  return useRender({
    defaultTagName: "button",
    render,
    ref: [item.ref, ref ?? null],
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
      className={cn(
        "in-data-[layout=adaptive]:col-span-full in-data-[layout=adaptive]:row-start-2 mx-[calc(--spacing(2)-1px)] flex in-[[data-layout=adaptive]:not([data-multiline])]:contents shrink-0 items-center justify-between gap-2",
        className,
      )}
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
        "in-[[data-layout=adaptive]:not([data-multiline])]:row-start-1 flex min-w-0 flex-wrap items-center gap-1",
        align === "start"
          ? "in-[[data-layout=adaptive]:not([data-multiline])]:col-start-1 in-[[data-layout=adaptive]:not([data-multiline])]:me-2"
          : "in-[[data-layout=adaptive]:not([data-multiline])]:col-start-3 in-[[data-layout=adaptive]:not([data-multiline])]:ms-2 ms-auto justify-end",
        className,
      )}
      data-align={align}
      data-slot="composer-action-group"
      {...props}
    />
  );
}

export function ComposerSubmit({
  disabled,
  className,
  style,
  render,
  ref,
  ...props
}: Omit<ComponentProps<typeof ButtonPrimitive>, "type">): ReactElement {
  const editor = useComposerEditorContext();
  const defaultProps = {
    "data-slot": "composer-submit",
    type: "button" as const,
    disabled: disabled ?? !editor?.canSubmit,
    onPointerDown: (event: PointerEvent<HTMLButtonElement>): void => {
      const input = editor?.rootRef.current?.querySelector(
        '[data-slot="composer-input"]',
      );
      if (
        event.button === 0 &&
        input === event.currentTarget.ownerDocument.activeElement
      ) {
        event.preventDefault();
      }
    },
    onClick: (event: MouseEvent<HTMLButtonElement>): void => {
      if (event.defaultPrevented || disabled) return;
      event.preventDefault();
      editor?.submit();
    },
  };
  return (
    <ButtonPrimitive
      {...mergeProps<"button">(defaultProps, props)}
      className={className}
      style={style}
      render={render}
      ref={ref}
    />
  );
}

export type { ComposerPopupProps, ComposerTokenVariant };

export {
  type ComposerChangeDetails,
  type ComposerItemValue,
  type ComposerPart,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  useComposerContext,
  useComposerFilter,
} from "@/registry/default/lib/composer-editor";
