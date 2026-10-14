"use client";

import { useState } from "react";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import { Slider } from "@/registry/default/ui/slider";

const min = 0;
const max = 150;

export default function Particle() {
  const [value, setValue] = useState(25);

  return (
    <div className="flex items-center gap-4">
      <Slider
        getAriaLabel={() => "Slider value"}
        className="flex-1"
        max={max}
        min={min}
        onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
        value={value}
      />
      <NumberField
        className="w-12"
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
