"use client";

import { Slider } from "@/registry/default/ui/slider";

export default function Particle() {
  return (
    <Slider
      getAriaLabel={(index) => `Value ${index + 1}`}
      defaultValue={[20, 50, 80]}
    />
  );
}
