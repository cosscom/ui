"use client";

import { cn } from "@coss/ui/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const useIsomorphicLayoutEffect: typeof useLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

export interface AgentMessageProps extends ComponentProps<"div"> {
  author: "assistant" | "user";
}

export function AgentMessage({
  author,
  className,
  ...props
}: AgentMessageProps): ReactElement {
  return (
    <div
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      data-author={author}
      data-slot="agent-message"
      role="article"
      {...props}
    />
  );
}

export function AgentMessageContent({
  className,
  ...props
}: ComponentProps<"div">): ReactElement {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-3xl flex-col gap-2 text-sm [overflow-wrap:anywhere]",
        "in-[[data-slot=agent-message][data-author=user]]:ms-auto in-[[data-slot=agent-message][data-author=user]]:w-fit in-[[data-slot=agent-message][data-author=user]]:max-w-[min(85%,48rem)] in-[[data-slot=agent-message][data-author=user]]:rounded-lg in-[[data-slot=agent-message][data-author=user]]:bg-muted in-[[data-slot=agent-message][data-author=user]]:px-3 in-[[data-slot=agent-message][data-author=user]]:py-2 in-[[data-slot=agent-message][data-author=user]]:text-foreground",
        className,
      )}
      data-slot="agent-message-content"
      {...props}
    />
  );
}

export interface AgentMessageTextProps
  extends Omit<ComponentProps<"div">, "children"> {
  children: string;
  showMoreLabel: string;
  showLessLabel: string;
  isStreaming?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function AgentMessageText({
  children,
  className,
  showMoreLabel,
  showLessLabel,
  isStreaming = false,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  ...props
}: AgentMessageTextProps): ReactElement {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded);
  const expanded = expandedProp ?? uncontrolledExpanded;
  const canCollapse = isOverflowing && !isStreaming;
  const collapsed = canCollapse && !expanded;

  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = (): void => setIsOverflowing(content.scrollHeight > 240);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-1", className)}
      data-slot="agent-message-text"
      {...props}
    >
      <div
        className={cn(collapsed && "overflow-hidden")}
        id={contentId}
        style={{ maxHeight: collapsed ? 240 : undefined }}
      >
        <div
          className="flow-root whitespace-pre-wrap [overflow-wrap:anywhere]"
          ref={contentRef}
        >
          {children}
        </div>
      </div>
      {canCollapse && (
        <button
          aria-controls={contentId}
          aria-expanded={expanded}
          className="flex pointer-coarse:min-h-11 w-fit items-center gap-1.5 self-start rounded-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          onClick={() => {
            if (expandedProp === undefined) setUncontrolledExpanded(!expanded);
            onExpandedChange?.(!expanded);
            if (expanded) {
              requestAnimationFrame(() =>
                buttonRef.current?.scrollIntoView({ block: "nearest" }),
              );
            }
          }}
          ref={buttonRef}
          type="button"
        >
          {expanded ? showLessLabel : showMoreLabel}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 transition-transform motion-reduce:transition-none",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
}

export function AgentMessageTimestamp({
  className,
  ...props
}: ComponentProps<"time">): ReactElement {
  return (
    <time
      className={cn("text-muted-foreground text-xs", className)}
      data-slot="agent-message-timestamp"
      {...props}
    />
  );
}
