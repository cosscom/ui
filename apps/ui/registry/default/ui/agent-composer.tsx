"use client";

import { ArrowUpIcon } from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type CompositionEvent,
  type Context,
  createContext,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/registry/default/ui/input-group";
import {
  ScrollAreaPrimitive,
  ScrollBar,
} from "@/registry/default/ui/scroll-area";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const useIsomorphicLayoutEffect: typeof useLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

type ComposerContext = {
  value: string;
  onValueChange: (value: string) => void;
  inputLabel: string;
  sendLabel: string;
  stopLabel: string;
  disabled: boolean;
  isBusy: boolean;
  canSubmit: boolean;
  isComposing: () => boolean;
  setComposing: (composing: boolean) => void;
  submit: () => void;
  stop: () => void;
};

const AgentComposerContext: Context<ComposerContext | null> =
  createContext<ComposerContext | null>(null);

function useAgentComposer(): ComposerContext {
  const context = useContext(AgentComposerContext);
  if (!context)
    throw new Error("AgentComposer parts must be inside AgentComposerRoot.");
  return context;
}

export interface AgentComposerRootProps
  extends Omit<ComponentProps<"div">, "onSubmit"> {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onStop: () => void;
  inputLabel: string;
  sendLabel: string;
  stopLabel: string;
  disabled?: boolean;
  isBusy?: boolean;
}

export function AgentComposerRoot({
  value,
  onValueChange,
  onSubmit,
  onStop,
  inputLabel,
  sendLabel,
  stopLabel,
  disabled = false,
  isBusy = false,
  ...props
}: AgentComposerRootProps): ReactElement {
  const composingRef = useRef(false);
  const [isComposing, setIsComposing] = useState(false);
  const canSubmit =
    !disabled && !isBusy && !isComposing && value.trim().length > 0;

  useEffect(() => {
    if (!disabled) return;
    composingRef.current = false;
    setIsComposing(false);
  }, [disabled]);

  return (
    <AgentComposerContext.Provider
      value={{
        value,
        onValueChange,
        inputLabel,
        sendLabel,
        stopLabel,
        disabled,
        isBusy,
        canSubmit,
        isComposing: () => composingRef.current,
        setComposing: (composing: boolean) => {
          composingRef.current = composing;
          setIsComposing(composing);
        },
        submit: () => {
          if (canSubmit && !composingRef.current) onSubmit(value);
        },
        stop: () => {
          if (!disabled && isBusy) onStop();
        },
      }}
    >
      <TooltipProvider>
        <InputGroup data-agent-composer="" {...props} />
      </TooltipProvider>
    </AgentComposerContext.Provider>
  );
}

export interface AgentComposerTextareaProps
  extends Omit<
    ComponentProps<typeof InputGroupTextarea>,
    "children" | "value" | "defaultValue" | "onChange" | "disabled"
  > {
  scrollAreaClassName?: string;
}

export function AgentComposerTextarea({
  className,
  scrollAreaClassName,
  ref,
  onBlur,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  rows = 5,
  autoComplete = "off",
  ...props
}: AgentComposerTextareaProps): ReactElement {
  const {
    value,
    onValueChange,
    inputLabel,
    disabled,
    isComposing,
    setComposing,
    submit,
  } = useAgentComposer();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const revealEndForValue = useRef<string | null>(null);
  useImperativeHandle(
    ref,
    () => textareaRef.current as HTMLTextAreaElement,
    [],
  );

  // Keep autosizing consistent in browsers without CSS field-sizing support.
  useIsomorphicLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (
      revealEndForValue.current === value &&
      document.activeElement === textarea &&
      viewportRef.current
    ) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
    revealEndForValue.current = null;
  }, [value]);

  useIsomorphicLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || typeof ResizeObserver === "undefined") return;
    let width = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === width) return;
      width = textarea.clientWidth;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative max-h-48 min-h-0 w-full", scrollAreaClassName)}
      data-slot="agent-composer-scroll-area"
    >
      <ScrollAreaPrimitive.Viewport
        className="mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] max-h-[inherit] w-full outline-none [--fade-size:1.5rem]"
        data-slot="agent-composer-viewport"
        ref={viewportRef}
      >
        <ScrollAreaPrimitive.Content
          className="[&_[data-slot=textarea-control]]:block"
          style={{ minWidth: 0 }}
        >
          <InputGroupTextarea
            {...props}
            aria-label={inputLabel}
            autoComplete={autoComplete}
            className={cn("flex-1 *:resize-none *:overflow-hidden", className)}
            disabled={disabled}
            onBlur={(event: FocusEvent<HTMLTextAreaElement>) => {
              setComposing(false);
              onBlur?.(event);
            }}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              const input = event.target;
              revealEndForValue.current =
                input.selectionStart === input.value.length
                  ? input.value
                  : null;
              onValueChange(input.value);
            }}
            onCompositionStart={(
              event: CompositionEvent<HTMLTextAreaElement>,
            ) => {
              setComposing(true);
              onCompositionStart?.(event);
            }}
            onCompositionEnd={(
              event: CompositionEvent<HTMLTextAreaElement>,
            ) => {
              setComposing(false);
              onCompositionEnd?.(event);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
              onKeyDown?.(event);
              if (
                event.defaultPrevented ||
                event.key !== "Enter" ||
                event.shiftKey ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                isComposing() ||
                event.nativeEvent.isComposing ||
                event.nativeEvent.keyCode === 229
              )
                return;
              event.preventDefault();
              if (!event.repeat) submit();
            }}
            ref={textareaRef}
            rows={rows}
            value={value}
          />
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
    </ScrollAreaPrimitive.Root>
  );
}

export function AgentComposerActions({
  className,
  ...props
}: ComponentProps<typeof InputGroupAddon>): ReactElement {
  return (
    <InputGroupAddon
      align="block-end"
      className={cn("flex-wrap justify-between", className)}
      data-slot="agent-composer-actions"
      {...props}
    />
  );
}

export function AgentComposerSubmit({
  className,
  ...props
}: Omit<
  ComponentProps<typeof Button>,
  | "children"
  | "onClick"
  | "disabled"
  | "loading"
  | "size"
  | "variant"
  | "type"
  | "render"
>): ReactElement {
  const { isBusy, disabled, canSubmit, submit, stop, sendLabel, stopLabel } =
    useAgentComposer();
  const label = isBusy ? stopLabel : sendLabel;
  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger
        data-slot="agent-composer-submit"
        render={
          <Button
            {...props}
            aria-label={label}
            className={cn("pointer-coarse:size-11 rounded-full", className)}
            disabled={isBusy ? disabled : !canSubmit}
            onClick={isBusy ? stop : submit}
            size="icon-sm"
            type="button"
            variant={isBusy ? "secondary" : "default"}
          />
        }
      >
        {isBusy ? (
          <span
            aria-hidden="true"
            className="size-2.5 rounded-[2px] bg-current"
          />
        ) : (
          <ArrowUpIcon aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipPopup side="bottom">{label}</TooltipPopup>
    </Tooltip>
  );
}

export interface AgentComposerProps
  extends Omit<AgentComposerRootProps, "children"> {
  textareaProps?: AgentComposerTextareaProps;
  leadingActions?: ReactNode;
  trailingActions?: ReactNode;
}

export function AgentComposer({
  textareaProps,
  leadingActions,
  trailingActions,
  ...props
}: AgentComposerProps): ReactElement {
  return (
    <AgentComposerRoot {...props}>
      <AgentComposerTextarea {...textareaProps} />
      <AgentComposerActions>
        {leadingActions}
        <div className="ms-auto flex items-center gap-2.5">
          {trailingActions}
          <AgentComposerSubmit />
        </div>
      </AgentComposerActions>
    </AgentComposerRoot>
  );
}
