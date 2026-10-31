"use client";

import { type ReactNode, useId, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import styles from "./grammar-comparison.module.css";

export function GrammarComparison({
  title,
  children,
  caption,
}: {
  title: string;
  children: ReactNode;
  caption: string;
}) {
  const [isolated, setIsolated] = useState(false);
  const id = useId();
  const drawingId = `${id}-drawing`;
  const instructionId = `${id}-instruction`;

  return (
    <figure className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          aria-controls={drawingId}
          aria-pressed={isolated}
          onClick={() => setIsolated((value) => !value)}
          size="sm"
          variant={isolated ? "secondary" : "ghost"}
        >
          Isolate element
        </Button>
        <p className="text-muted-foreground text-xs" id={instructionId}>
          Hover or focus to reveal the element. Tap to keep it isolated.
        </p>
      </div>
      <div
        aria-describedby={instructionId}
        aria-label={`${title}. ${caption}`}
        className={`${styles.drawing} overflow-x-auto rounded-lg border border-border/64 bg-sidebar p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        data-isolated={isolated ? "" : undefined}
        id={drawingId}
        role="img"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Native-size drawings need keyboard scrolling on narrow screens.
        tabIndex={0}
      >
        <div className="pointer-events-none mx-auto w-[560px] select-none">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 min-h-10 text-pretty text-muted-foreground text-xs">
        {caption}
      </figcaption>
      <p className="text-muted-foreground text-xs sm:hidden">
        Scroll sideways to see the full drawing.
      </p>
    </figure>
  );
}
