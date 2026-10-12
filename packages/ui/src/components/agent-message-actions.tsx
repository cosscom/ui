"use client";

import { Button, type ButtonProps } from "@coss/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

export interface AgentMessageActionsProps
  extends Omit<ComponentProps<"div">, "role"> {
  label: string;
  alwaysVisible?: boolean;
}

export function AgentMessageActions({
  className,
  label,
  alwaysVisible = false,
  ...props
}: AgentMessageActionsProps): ReactElement {
  return (
    <TooltipProvider>
      <div
        aria-label={label}
        className={cn(
          "flex flex-wrap items-center gap-0.5 self-start in-[[data-slot=agent-message][data-author=user]]:self-end pt-1 transition-opacity motion-reduce:transition-none",
          !alwaysVisible &&
            "in-data-[slot=agent-message]:pointer-events-none in-[[data-slot=agent-message]:focus-within]:pointer-events-auto in-[[data-slot=agent-message]:hover]:pointer-events-auto pointer-coarse:in-data-[slot=agent-message]:pointer-events-auto in-[[data-slot=agent-message]:focus-within]:opacity-100 in-[[data-slot=agent-message]:hover]:opacity-100 in-data-[slot=agent-message]:opacity-0 pointer-coarse:in-data-[slot=agent-message]:opacity-100",
          className,
        )}
        data-slot="agent-message-actions"
        role="group"
        {...props}
      />
    </TooltipProvider>
  );
}

export interface AgentMessageActionProps
  extends Omit<ButtonProps, "size" | "variant" | "type"> {
  label: string;
}

export function AgentMessageAction({
  label,
  className,
  children,
  ...props
}: AgentMessageActionProps): ReactElement {
  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger
        data-slot="agent-message-action"
        render={
          <Button
            {...props}
            aria-label={label}
            className={cn(
              "pointer-coarse:size-11 text-muted-foreground hover:text-foreground",
              className,
            )}
            size="icon-xs"
            type="button"
            variant="ghost"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipPopup side="bottom">{label}</TooltipPopup>
    </Tooltip>
  );
}

export interface AgentMessageCopyActionProps
  extends Omit<
    AgentMessageActionProps,
    "children" | "label" | "onClick" | "render"
  > {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  errorLabel: string;
  onCopied?: () => void;
  onCopyError?: (error: unknown) => void;
}

export function AgentMessageCopyAction({
  text,
  copyLabel,
  copiedLabel,
  errorLabel,
  onCopied,
  onCopyError,
  disabled,
  loading,
  ...props
}: AgentMessageCopyActionProps): ReactElement {
  const [status, setStatus] = useState<"idle" | "pending" | "copied" | "error">(
    "idle",
  );
  const requestRef = useRef(0);
  const pendingRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: A changed copy payload invalidates pending writes and feedback.
  useEffect(() => {
    setStatus("idle");
    pendingRef.current = false;
    return () => {
      requestRef.current += 1;
    };
  }, [text]);

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  const label =
    status === "copied"
      ? copiedLabel
      : status === "error"
        ? errorLabel
        : copyLabel;
  const Icon =
    status === "copied" ? CheckIcon : status === "error" ? XIcon : CopyIcon;

  async function copy(): Promise<void> {
    if (disabled || loading || !text || pendingRef.current) return;
    const request = ++requestRef.current;
    pendingRef.current = true;
    setStatus("pending");
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(text);
    } catch (error) {
      if (request !== requestRef.current) return;
      pendingRef.current = false;
      setStatus("error");
      onCopyError?.(error);
      return;
    }
    if (request !== requestRef.current) return;
    pendingRef.current = false;
    setStatus("copied");
    onCopied?.();
  }

  return (
    <>
      <AgentMessageAction
        {...props}
        disabled={disabled || !text || status === "pending"}
        label={label}
        loading={loading}
        onClick={copy}
      >
        <Icon aria-hidden="true" />
      </AgentMessageAction>
      <span aria-live="polite" className="sr-only">
        {status === "copied" || status === "error" ? label : null}
      </span>
    </>
  );
}
