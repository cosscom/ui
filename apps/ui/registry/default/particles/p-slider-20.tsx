"use client";

import { Slider } from "@/registry/default/ui/slider";

const bands = [
  { label: "60 Hz", value: 2 },
  { label: "250 Hz", value: 1 },
  { label: "1k", value: -1 },
  { label: "4k", value: -3 },
  { label: "16k", value: 2 },
];

export default function Particle() {
  return (
    <div className="flex h-48 justify-center gap-8">
      {bands.map((band) => (
        <Slider
          getAriaLabel={() => band.label}
          defaultValue={band.value}
          key={band.label}
          max={5}
          min={-5}
          orientation="vertical"
        />
      ))}
    </div>
  );
}
