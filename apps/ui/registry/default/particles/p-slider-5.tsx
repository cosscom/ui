"use client";

import { cn } from "@/registry/default/lib/utils";
import { Slider } from "@/registry/default/ui/slider";

const max = 12;
const skipInterval = 2;
const ticks = [...Array(max + 1)].map((_, i) => i);

export default function Particle() {
  return (
    <div>
      <Slider
        getAriaLabel={() => "Value selector"}
        defaultValue={5}
        max={max}
      />
      <div
        aria-label="Value scale from 0 to 12"
        className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 font-medium text-muted-foreground text-xs"
        role="group"
      >
        {ticks.map((_, i) => (
          <span
            className="flex w-0 flex-col items-center justify-center gap-2"
            key={String(i)}
          >
            <span
              className={cn(
                "h-1 w-px bg-muted-foreground/72",
                i % skipInterval !== 0 && "h-0.5",
              )}
            />
            <span className={cn(i % skipInterval !== 0 && "opacity-0")}>
              {i}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
