"use client";

import { XIcon } from "lucide-react";
import { motion, usePresence, useReducedMotion } from "motion/react";
import type { ReactElement, ReactNode, RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { ChatMessageBubble } from "./chat-message-bubble";

export type ChatReplyTarget = {
  source: HTMLDivElement;
  width: number;
  firstInGroup: boolean;
};

export type ChatReplyPreviewProps = {
  target: ChatReplyTarget;
  side: "incoming" | "outgoing";
  avatar?: ReactNode;
  author: ReactNode;
  replyLabel: ReactNode;
  cancelLabel: string;
  children: ReactNode;
  dismissalRef: RefObject<"cancel" | "send">;
  onCancel: () => void;
};

export function ChatReplyPreview({
  target,
  side,
  avatar,
  author,
  replyLabel,
  cancelLabel,
  children,
  dismissalRef,
  onCancel,
}: ChatReplyPreviewProps): ReactElement {
  const anchorRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const own = side === "outgoing";

  // biome-ignore lint/correctness/useExhaustiveDependencies: Remeasure the source on exit after the viewport or keyboard may have moved.
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;
    const destination = anchor.getBoundingClientRect();
    const source = target.source.getBoundingClientRect();
    setOrigin(source.top - destination.top - bubble.offsetTop);
  }, [isPresent, target]);
  const returning =
    dismissalRef.current === "cancel" && target.source.isConnected;

  return (
    <>
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label={cancelLabel}
        className="absolute inset-0 z-40 cursor-default touch-none bg-popover/32 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-6 before:bg-linear-to-b before:from-popover before:to-transparent before:content-['']"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPresent ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        onClick={onCancel}
        onMouseDown={(event) => {
          if (event.button === 0) event.preventDefault();
        }}
        onWheel={(event) => event.preventDefault()}
      />
      <div className="pointer-events-none absolute inset-0 z-50 overflow-clip">
        <ScrollArea
          overscrollContain
          className="**:data-[slot=scroll-area-content]:flex **:data-[slot=scroll-area-content]:min-h-full **:data-[slot=scroll-area-content]:flex-col **:data-[slot=scroll-area-content]:py-4 [&_[data-slot=scroll-area-scrollbar]]:pointer-events-auto"
        >
          <div
            ref={anchorRef}
            data-slot="chat-reply-focus"
            className="relative mx-4 mt-auto shrink-0"
          >
            <motion.div
              aria-hidden="true"
              className="absolute -inset-x-4 -top-20 -bottom-4 bg-linear-to-t from-[calc(100%-4rem)] from-popover to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPresent ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            />
            <motion.div
              key={origin === null ? "measuring" : "positioned"}
              initial={
                reduceMotion
                  ? false
                  : { transform: `translateY(${origin ?? 0}px)`, opacity: 1 }
              }
              animate={
                isPresent
                  ? { transform: "translateY(0px)", opacity: 1 }
                  : {
                      transform: returning
                        ? `translateY(${origin ?? 0}px)`
                        : "translateY(6px)",
                      opacity: returning ? 1 : 0,
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : isPresent || returning
                    ? {
                        type: "tween",
                        duration: 0.35,
                        ease: [0.3, 0.84, 0.24, 1],
                      }
                    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }
              onAnimationComplete={() => {
                if (!isPresent) safeToRemove?.();
              }}
              className={cn(
                "relative grid items-start gap-y-1",
                own
                  ? "grid-cols-1"
                  : "grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2",
                origin === null && "invisible",
              )}
            >
              {!own && (
                <motion.div
                  className="col-start-1 row-start-2 w-7"
                  initial={{ opacity: target.firstInGroup ? 1 : 0 }}
                  animate={{
                    opacity: isPresent || target.firstInGroup ? 1 : 0,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                >
                  {avatar}
                </motion.div>
              )}
              <motion.div
                className={cn(
                  "flex h-lh min-w-0 max-w-full items-center gap-2 px-1 font-medium text-muted-foreground text-xs",
                  own ? "justify-self-end" : "col-start-2 row-start-1",
                )}
                initial={{ opacity: !own && target.firstInGroup ? 1 : 0 }}
                animate={{
                  opacity: isPresent || (!own && target.firstInGroup) ? 1 : 0,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              >
                <span role="status" className="min-w-0 truncate">
                  {isPresent ? replyLabel : author}
                </span>
              </motion.div>
              <div
                ref={bubbleRef}
                style={{ width: target.width }}
                className={cn(
                  "pointer-events-auto relative row-start-2 max-w-full rounded-2xl bg-popover",
                  own ? "justify-self-end" : "col-start-2",
                  target.firstInGroup &&
                    (own ? "rounded-se-md" : "rounded-ss-md"),
                )}
              >
                <ChatMessageBubble
                  side={own ? "outgoing" : "incoming"}
                  firstInGroup={target.firstInGroup}
                >
                  {children}
                </ChatMessageBubble>
                <motion.div
                  className={cn(
                    "absolute -top-2.5 z-10 flex rounded-full bg-popover",
                    own ? "-start-2.5" : "-end-2.5",
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isPresent ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                >
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="outline"
                          aria-label={cancelLabel}
                          className="size-6 rounded-full before:rounded-full"
                          onMouseDown={(event) => {
                            if (event.button === 0) event.preventDefault();
                          }}
                          onClick={onCancel}
                        />
                      }
                    >
                      <XIcon aria-hidden="true" />
                    </TooltipTrigger>
                    <TooltipPopup>{cancelLabel}</TooltipPopup>
                  </Tooltip>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
