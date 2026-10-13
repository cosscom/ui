"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { Toggle } from "@/registry/default/ui/toggle";
import { useChatPopupDismissal } from "./hooks/use-chat-popup-dismissal";

export type ChatReactionChipProps = {
  animateEntrance?: boolean;
  emoji: string;
  count: number;
  selected: boolean;
  label: string;
  onClick: () => void;
  reactorContent?: ReactNode;
  reactorLabel?: string;
  popupAlign?: ComponentProps<typeof PopoverPopup>["align"];
  className?: string;
};

export function ChatReactionChip({
  animateEntrance = false,
  emoji,
  count,
  selected,
  label,
  onClick,
  className,
  reactorContent,
  reactorLabel,
  popupAlign,
}: ChatReactionChipProps): ReactElement {
  const reduceMotion = useReducedMotion();
  const [animateReaction, setAnimateReaction] = useState(false);
  const previouslySelected = useRef(selected);
  useEffect(() => {
    setAnimateReaction(selected && !previouslySelected.current);
    previouslySelected.current = selected;
  }, [selected]);

  const [open, setOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const clearHold = useCallback((): void => {
    if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }, []);

  useEffect(() => clearHold, [clearHold]);

  useChatPopupDismissal(open || pressing, triggerRef, () => {
    clearHold();
    if (touchOrigin.current) suppressClick.current = true;
    touchOrigin.current = null;
    setPressing(false);
    setOpen(false);
  });

  const chip = (
    <Toggle
      data-slot="chat-reaction-chip"
      variant="outline"
      size="sm"
      aria-label={label}
      pressed={selected}
      className={cn(
        "h-6 min-w-0 gap-1 rounded-full px-2 text-xs shadow-none transition-transform duration-150 [-webkit-touch-callout:none] before:rounded-full active:scale-95 data-pressed:border-primary/48 data-pressed:bg-primary/12 motion-reduce:scale-100 motion-reduce:transition-none sm:h-6 sm:min-w-0 sm:text-xs dark:data-pressed:bg-primary/8",
        className,
      )}
      onPressedChange={(_, details) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          details.cancel();
          return;
        }
        onClick();
      }}
    >
      <motion.span
        className="inline-flex"
        initial={false}
        animate={
          animateReaction && !reduceMotion
            ? {
                transform: [
                  "scale(1) rotate(0deg)",
                  "scale(1.55) rotate(-12deg)",
                  "scale(1.12) rotate(6deg)",
                  "scale(1) rotate(0deg)",
                ],
              }
            : { transform: "scale(1) rotate(0deg)" }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.44,
          times: [0, 0.35, 0.65, 1],
          ease: "easeOut",
        }}
      >
        {emoji}
      </motion.span>
      <span className="tabular-nums">{count}</span>
    </Toggle>
  );

  const content = !reactorContent ? (
    chip
  ) : (
    <Popover
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (details.reason === "trigger-press") {
          details.cancel();
          return;
        }
        if (
          details.reason === "trigger-hover" &&
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
          details.cancel();
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <span ref={anchorRef} className="inline-flex">
        <PopoverTrigger
          ref={triggerRef}
          openOnHover
          delay={300}
          closeDelay={150}
          render={chip}
          onFocus={(event) => {
            if (
              event.currentTarget.matches(":focus-visible") &&
              !touchOrigin.current
            )
              setOpen(true);
          }}
          onBlur={(event) => {
            if (!popupRef.current?.contains(event.relatedTarget))
              setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              suppressClick.current = false;
          }}
          onPointerDown={(event) => {
            suppressClick.current = false;
            if (event.pointerType !== "touch" || !event.isPrimary) return;
            touchOrigin.current = { x: event.clientX, y: event.clientY };
            setPressing(true);
            clearHold();
            holdTimer.current = setTimeout(() => {
              holdTimer.current = null;
              suppressClick.current = true;
              setOpen(true);
            }, 500);
          }}
          onPointerMove={(event) => {
            const origin = touchOrigin.current;
            if (
              !origin ||
              Math.hypot(event.clientX - origin.x, event.clientY - origin.y) <=
                8
            )
              return;
            clearHold();
            suppressClick.current = true;
            touchOrigin.current = null;
            setPressing(false);
            setOpen(false);
          }}
          onPointerUp={() => {
            clearHold();
            touchOrigin.current = null;
            setPressing(false);
          }}
          onPointerCancel={() => {
            clearHold();
            touchOrigin.current = null;
            suppressClick.current = true;
            setPressing(false);
            setOpen(false);
          }}
          onContextMenu={(event) => {
            if (touchOrigin.current || suppressClick.current)
              event.preventDefault();
          }}
        />
      </span>
      <PopoverPopup
        anchor={anchorRef}
        align={popupAlign}
        ref={popupRef}
        initialFocus={false}
        finalFocus={false}
        aria-label={reactorLabel}
        className="w-52 **:data-[slot=popover-viewport]:p-1.5"
      >
        {reactorContent}
      </PopoverPopup>
    </Popover>
  );

  return (
    <motion.span
      className={cn(
        "inline-flex origin-top",
        animateEntrance && !reduceMotion && "will-change-transform",
      )}
      initial={
        animateEntrance && !reduceMotion
          ? { opacity: 0, transform: "scale(0.55)" }
          : false
      }
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              transform: { type: "spring", duration: 0.44, bounce: 0.45 },
              opacity: { duration: 0.12 },
            }
      }
    >
      {content}
    </motion.span>
  );
}
