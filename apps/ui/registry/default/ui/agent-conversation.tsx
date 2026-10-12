"use client";

import { ArrowDownIcon } from "lucide-react";
import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
  type UIEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button, type ButtonProps } from "@/registry/default/ui/button";
import {
  ScrollAreaPrimitive,
  ScrollBar,
} from "@/registry/default/ui/scroll-area";

const BOTTOM_THRESHOLD = 24;
const useIsomorphicLayoutEffect: typeof useLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

export interface AgentConversationHandle {
  scrollToLatest: () => void;
  pauseFollowing: () => void;
}

export interface AgentConversationProps extends ComponentProps<"div"> {
  label: string;
  scrollToLatestLabel: string;
  contentClassName?: string;
  viewportClassName?: string;
  scrollbarGutter?: boolean;
  apiRef?: Ref<AgentConversationHandle>;
}

export function AgentConversation({
  children,
  className,
  label,
  scrollToLatestLabel,
  contentClassName,
  viewportClassName,
  scrollbarGutter = false,
  apiRef,
  ...props
}: AgentConversationProps): ReactElement {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const updatePosition = useCallback((): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    lastScrollTopRef.current = viewport.scrollTop;
    setIsAtBottom(
      viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <=
        BOTTOM_THRESHOLD,
    );
  }, []);

  const scrollToLatest = useCallback((): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    followingRef.current = true;
    // An immediate scroll also respects reduced-motion preferences.
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "instant" });
    updatePosition();
  }, [updatePosition]);

  const pauseFollowing = useCallback((): void => {
    followingRef.current = false;
  }, []);

  useImperativeHandle(apiRef, () => ({ scrollToLatest, pauseFollowing }), [
    scrollToLatest,
    pauseFollowing,
  ]);

  // Also handles content appended by the parent, before the next paint.
  useIsomorphicLayoutEffect(() => {
    if (followingRef.current) scrollToLatest();
    else updatePosition();
  });

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (followingRef.current) scrollToLatest();
      else updatePosition();
    });
    observer.observe(content);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [scrollToLatest, updatePosition]);

  return (
    <div
      className={cn("relative h-full min-h-0 min-w-0", className)}
      data-slot="agent-conversation"
      {...props}
    >
      <ScrollAreaPrimitive.Root className="size-full min-h-0">
        <ScrollAreaPrimitive.Viewport
          aria-label={label}
          className={cn(
            "relative h-full overscroll-contain rounded-[inherit] outline-none [overflow-anchor:none] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] [--fade-size:1.5rem]",
            scrollbarGutter &&
              "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
            viewportClassName,
          )}
          data-slot="agent-conversation-viewport"
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>): void => {
            if (
              event.target === event.currentTarget &&
              ["ArrowUp", "PageUp", "Home"].includes(event.key)
            ) {
              pauseFollowing();
            }
          }}
          onScroll={(event: UIEvent<HTMLDivElement>): void => {
            const viewport = event.currentTarget;
            // Ignore the delayed scroll event from our own latest-position write.
            if (viewport.scrollTop !== lastScrollTopRef.current) {
              followingRef.current =
                viewport.scrollHeight -
                  viewport.clientHeight -
                  viewport.scrollTop <=
                BOTTOM_THRESHOLD;
            }
            updatePosition();
          }}
          onTouchMove={pauseFollowing}
          onWheel={(event: WheelEvent<HTMLDivElement>): void => {
            if (event.deltaY < 0) pauseFollowing();
          }}
          ref={viewportRef}
          role="region"
          tabIndex={0}
        >
          <ScrollAreaPrimitive.Content
            className={cn(
              "flex min-h-full flex-col gap-8 p-4",
              contentClassName,
            )}
            data-slot="agent-conversation-content"
            ref={contentRef}
            style={{ minWidth: 0 }}
          >
            {children}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
      {!isAtBottom && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-end px-4">
          <AgentConversationScrollButton
            className="pointer-events-auto"
            label={scrollToLatestLabel}
            onClick={() => {
              // Keep keyboard focus inside the conversation when the button disappears.
              viewportRef.current?.focus({ preventScroll: true });
              scrollToLatest();
            }}
          />
        </div>
      )}
    </div>
  );
}

export interface AgentConversationScrollButtonProps
  extends Omit<ButtonProps, "children" | "size" | "variant" | "type"> {
  label: string;
}

export function AgentConversationScrollButton({
  label,
  className,
  ...props
}: AgentConversationScrollButtonProps): ReactElement {
  return (
    <Button
      {...props}
      aria-label={label}
      className={cn(
        "pointer-coarse:size-11 rounded-full bg-popover shadow-sm dark:bg-popover",
        className,
      )}
      data-slot="agent-conversation-scroll-button"
      size="icon-sm"
      type="button"
      variant="outline"
    >
      <ArrowDownIcon aria-hidden="true" />
    </Button>
  );
}

export function AgentConversationTimestamp({
  className,
  ...props
}: ComponentProps<"time">): ReactElement {
  return (
    <time
      className={cn(
        "self-center text-center text-muted-foreground text-xs",
        className,
      )}
      data-slot="agent-conversation-timestamp"
      {...props}
    />
  );
}
