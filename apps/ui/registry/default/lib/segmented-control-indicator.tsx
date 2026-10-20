"use client";

import * as React from "react";
import { segmentedControlIndicatorClassName } from "@/registry/default/lib/segmented-control";
import { cn } from "@/registry/default/lib/utils";

const activeItemSelector =
  ':scope > [data-checked], :scope > [aria-current="page"], :scope > [data-pressed]';

const observedAttributes = ["data-checked", "aria-current", "data-pressed"];

const MAX_LAYOUT_ROUNDING_ERROR = 2;

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

function getCssSize(element: HTMLElement): { height: number; width: number } {
  const style = getComputedStyle(element);
  const width = Number.parseFloat(style.width) || 0;
  const height = Number.parseFloat(style.height) || 0;
  if (
    Math.round(width) !== element.offsetWidth ||
    Math.round(height) !== element.offsetHeight
  ) {
    return { height: element.offsetHeight, width: element.offsetWidth };
  }
  return { height, width };
}

function measureItem(item: HTMLElement, root: HTMLElement): ActiveItemRect {
  const { width, height } = getCssSize(item);
  const rootSize = getCssSize(root);
  const itemRect = item.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const scaleX = rootSize.width > 0 ? rootRect.width / rootSize.width : 1;
  const scaleY = rootSize.height > 0 ? rootRect.height / rootSize.height : 1;

  const rectLeft =
    (itemRect.left - rootRect.left) / scaleX -
    root.clientLeft +
    root.scrollLeft;
  const rectTop =
    (itemRect.top - rootRect.top) / scaleY - root.clientTop + root.scrollTop;

  const isUndistorted =
    Math.abs(rectLeft - item.offsetLeft) <= MAX_LAYOUT_ROUNDING_ERROR &&
    Math.abs(rectTop - item.offsetTop) <= MAX_LAYOUT_ROUNDING_ERROR;

  return {
    height,
    left: isUndistorted ? rectLeft : item.offsetLeft,
    top: isUndistorted ? rectTop : item.offsetTop,
    width,
  };
}

export function SegmentedControlIndicator({
  className,
  ref: refProp,
  style,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [rect, setRect] = React.useState<ActiveItemRect | null>(null);

  const mergedRef = React.useCallback(
    (node: HTMLSpanElement | null) => {
      ref.current = node;
      if (typeof refProp === "function") {
        return refProp(node);
      }
      if (refProp) {
        refProp.current = node;
      }
    },
    [refProp],
  );

  React.useLayoutEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) {
      return;
    }

    const update = () => {
      const item = root.querySelector<HTMLElement>(activeItemSelector);
      const next = item ? measureItem(item, root) : null;
      setRect((previous) => (isSameRect(previous, next) ? previous : next));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    const mutationObserver = new MutationObserver((records) => {
      if (records.some((record) => record.type === "childList")) {
        observeItems();
      }
      update();
    });
    const observeItems = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(root);
      for (const child of root.children) {
        resizeObserver.observe(child);
        mutationObserver.observe(child, {
          attributeFilter: observedAttributes,
          attributes: true,
        });
      }
    };
    mutationObserver.observe(root, { childList: true });
    observeItems();

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
      ref={mergedRef}
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
