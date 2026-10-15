"use client";

import { Slider } from "@/registry/default/ui/slider";

export default function Particle() {
  return <Slider getAriaLabel={() => "Value"} defaultValue={50} />;
}
