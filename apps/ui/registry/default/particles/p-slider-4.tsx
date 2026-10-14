"use client";

import { Slider } from "@/registry/default/ui/slider";

export default function Particle() {
  return (
    <div>
      <Slider
        getAriaLabel={() => "Storage size in GB"}
        defaultValue={15}
        max={35}
        min={5}
      />
      <div
        aria-label="Storage size reference values"
        className="mt-4 flex w-full items-center justify-between gap-1 font-medium text-muted-foreground text-xs"
        role="group"
      >
        <span>5 GB</span>
        <span>20 GB</span>
        <span>35 GB</span>
      </div>
    </div>
  );
}
