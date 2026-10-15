"use client";

import { useState } from "react";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import { Slider } from "@/registry/default/ui/slider";

const min = 0;
const max = 50;

export default function Particle() {
  const [values, setValues] = useState([0, 20]);

  const updateValue = (index: number, newValue: number | null) => {
    const v = newValue ?? min;
    setValues((prev) => {
      const next = [...prev];
      if (index === 0) {
        // Min value: clamp to not exceed max value
        next[0] = Math.min(v, prev[1] ?? max);
      } else {
        // Max value: clamp to not go below min value
        next[1] = Math.max(v, prev[0] ?? min);
      }
      return next;
    });
  };

  return (
    <div className="flex items-center gap-2">
      <NumberField
        className="w-10"
        max={values[1]}
        min={min}
        onValueChange={(v) => updateValue(0, v)}
        render={<NumberFieldGroup />}
        size="sm"
        value={values[0]}
      >
        <NumberFieldInput aria-label="Minimum value" />
      </NumberField>
      <Slider
        getAriaLabel={(index) =>
          index === 0 ? "Minimum value" : "Maximum value"
        }
        className="flex-1 *:min-w-0!"
        max={max}
        min={min}
        onValueChange={(v) => setValues(Array.isArray(v) ? [...v] : [v])}
        value={values}
      />
      <NumberField
        className="w-10"
        max={max}
        min={values[0]}
        onValueChange={(v) => updateValue(1, v)}
        render={<NumberFieldGroup />}
        size="sm"
        value={values[1]}
      >
        <NumberFieldInput aria-label="Maximum value" />
      </NumberField>
    </div>
  );
}
