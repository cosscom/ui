"use client";

import { Slider } from "@/registry/default/ui/slider";

export default function Particle() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Slider
        getAriaLabel={(index) =>
          index === 0 ? "Minimum value" : "Maximum value"
        }
        defaultValue={[25, 75]}
        orientation="vertical"
      />
    </div>
  );
}
