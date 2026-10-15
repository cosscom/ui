"use client";

import { useState } from "react";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import { Slider } from "@/registry/default/ui/slider";

const min = 0;
const max = 100;

export default function Particle() {
  const [value, setValue] = useState(25);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Slider
        getAriaLabel={() => "Slider value"}
        max={max}
        min={min}
        onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
        orientation="vertical"
        value={value}
      />
      <NumberField
        className="w-16"
        max={max}
        min={min}
        onValueChange={(v) => setValue(v ?? min)}
        render={<NumberFieldGroup />}
        size="sm"
        value={value}
      >
        <NumberFieldInput aria-label="Enter slider value" />
      </NumberField>
    </div>
  );
}
