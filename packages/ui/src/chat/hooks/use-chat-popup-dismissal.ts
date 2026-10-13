"use client";

import { type RefObject, useEffect } from "react";

export function useChatPopupDismissal(
  active: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
): void {
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!active || !trigger) return;
    let userScroll = false;
    const onScrollInput = (): void => {
      userScroll = true;
    };
    const onScroll = (event: Event): void => {
      // Focus and keyboard transitions scroll without user input when a popup opens.
      if (
        userScroll &&
        event.target instanceof Node &&
        event.target.contains(trigger)
      )
        onDismiss();
    };
    const scrollInputs = [
      "wheel",
      "touchmove",
      "pointerdown",
      "keydown",
    ] as const;
    for (const type of scrollInputs)
      document.addEventListener(type, onScrollInput, {
        capture: true,
        passive: true,
      });
    document.addEventListener("scroll", onScroll, true);
    return () => {
      for (const type of scrollInputs)
        document.removeEventListener(type, onScrollInput, true);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [active, triggerRef, onDismiss]);
}
