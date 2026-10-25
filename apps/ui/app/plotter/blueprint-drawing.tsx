import type { ReactNode } from "react";

export function BlueprintDrawing({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full overflow-visible font-sans text-foreground [font-optical-sizing:auto] [font-synthesis:none] [font-variation-settings:'GEOM'_25]"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeWidth="0.8"
      viewBox="0 0 560 440"
    >
      {children}
    </svg>
  );
}

// Draws hero geometry at empty-state size. Strokes stay one pixel at any scale.
export function CompactBlueprintDrawing({
  center: [x, y],
  scale,
  children,
}: {
  center: [number, number];
  scale: number;
  children: ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      className="size-full overflow-visible text-foreground [&_*]:[vector-effect:non-scaling-stroke]"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 96 96"
    >
      <g transform={`translate(48 48) scale(${scale}) translate(${-x} ${-y})`}>
        {children}
      </g>
    </svg>
  );
}
