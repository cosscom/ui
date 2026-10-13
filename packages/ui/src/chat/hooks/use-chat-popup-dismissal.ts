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
    const ownerDocument = trigger.ownerDocument;
    const onScrollInput = (event: Event): void => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('[role="menu"], [data-slot="popover-popup"]'))
        return;
      if (event instanceof KeyboardEvent) {
        if (
          event.defaultPrevented ||
          ![
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "PageUp",
            "PageDown",
            "Home",
            "End",
            " ",
          ].includes(event.key) ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.target.closest(
            "input, textarea, select, button, a, [contenteditable], [role=menu], [role=listbox], [role=combobox], [role=slider], [role=tablist]",
          )
        )
          return;
      }
      const isScrollable = (element: Element): boolean => {
        const style = getComputedStyle(element);
        const page = element === ownerDocument.scrollingElement;
        return (
          (element.scrollHeight > element.clientHeight &&
            (page || /auto|scroll/.test(style.overflowY))) ||
          (element.scrollWidth > element.clientWidth &&
            (page || /auto|scroll/.test(style.overflowX)))
        );
      };
      // Dismiss on input in the scroller, never on automatic scrolling or menu navigation.
      for (
        let element: Element | null = event.target;
        element;
        element = element.parentElement
      ) {
        if (!isScrollable(element)) continue;
        if (element.contains(trigger)) onDismiss();
        return;
      }
      // Modal menus intercept wheel/touch input with a backdrop over the scroller.
      const point =
        event instanceof WheelEvent
          ? event
          : event instanceof TouchEvent
            ? event.touches[0]
            : undefined;
      if (!point) return;
      for (
        let element = trigger.parentElement;
        element;
        element = element.parentElement
      ) {
        if (!isScrollable(element)) continue;
        const bounds = element.getBoundingClientRect();
        if (
          point.clientX >= bounds.left &&
          point.clientX <= bounds.right &&
          point.clientY >= bounds.top &&
          point.clientY <= bounds.bottom
        ) {
          onDismiss();
          return;
        }
      }
    };
    const scrollInputs = ["wheel", "touchmove", "keydown"] as const;
    for (const type of scrollInputs)
      ownerDocument.addEventListener(type, onScrollInput, { passive: true });
    return () => {
      for (const type of scrollInputs)
        ownerDocument.removeEventListener(type, onScrollInput);
    };
  }, [active, triggerRef, onDismiss]);
}
