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
