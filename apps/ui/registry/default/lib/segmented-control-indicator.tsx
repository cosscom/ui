"use client";

import * as React from "react";
import { segmentedControlIndicatorClassName } from "@/registry/default/lib/segmented-control";
import { cn } from "@/registry/default/lib/utils";

const activeItemSelector =
  ':scope > [data-checked], :scope > [aria-current="page"], :scope > [data-pressed]';

const observedAttributes = ["data-checked", "aria-current", "data-pressed"];

interface ActiveItemRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

function isSameRect(
  a: ActiveItemRect | null,
  b: ActiveItemRect | null,
): boolean {
  return (
    a?.left === b?.left &&
    a?.top === b?.top &&
    a?.width === b?.width &&
    a?.height === b?.height
  );
}

/**
 * Animated selection pill for a segmented control. Render it as the last child
 * of the element that has `segmentedControlRootClassName`; it follows whichever
 * direct child is checked, current, or pressed.
 */
export function SegmentedControlIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [rect, setRect] = React.useState<ActiveItemRect | null>(null);

  React.useLayoutEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) {
      return;
    }

    const update = () => {
      const item = root.querySelector<HTMLElement>(activeItemSelector);
      const next: ActiveItemRect | null = item
        ? {
            height: item.offsetHeight,
            left: item.offsetLeft,
            top: item.offsetTop,
            width: item.offsetWidth,
          }
        : null;
      setRect((previous) => (isSameRect(previous, next) ? previous : next));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    const observeItems = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(root);
      for (const child of root.children) {
        resizeObserver.observe(child);
      }
    };
    observeItems();

    const mutationObserver = new MutationObserver((records) => {
      if (records.some((record) => record.type === "childList")) {
        observeItems();
      }
      update();
    });
    mutationObserver.observe(root, {
      attributeFilter: observedAttributes,
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={cn(segmentedControlIndicatorClassName, className)}
      data-slot="segmented-control-indicator"
      hidden={!rect}
      ref={ref}
      style={
        {
          "--active-item-height": `${rect?.height ?? 0}px`,
          "--active-item-left": `${rect?.left ?? 0}px`,
          "--active-item-top": `${rect?.top ?? 0}px`,
          "--active-item-width": `${rect?.width ?? 0}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
