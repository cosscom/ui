"use client";

import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Label } from "@/registry/default/ui/label";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import { Slider } from "@/registry/default/ui/slider";

const min = -10;
const max = 10;
const defaultValues = { x: 0, y: 0, z: 0 };
const initialValues = { x: -2, y: 4, z: 2 };

export default function Particle() {
  const [values, setValues] = useState(initialValues);

  const updateValue = (axis: keyof typeof values, v: number | null) => {
    setValues((prev) => ({ ...prev, [axis]: v ?? 0 }));
  };

  return (
    <Fieldset className="flex w-full flex-col gap-4">
      <FieldsetLegend>Object position</FieldsetLegend>
      <div className="flex flex-col gap-2">
        {(["x", "y", "z"] as const).map((axis) => (
          <div className="flex items-center gap-2" key={axis}>
            <Label className="w-3 text-muted-foreground text-xs">
              {axis.toUpperCase()}
            </Label>
            <Slider
              getAriaLabel={() => `${axis.toUpperCase()} position`}
              className="flex-1"
              max={max}
              min={min}
              onValueChange={(v) =>
                updateValue(axis, Array.isArray(v) ? v[0] : v)
              }
              value={values[axis]}
            />
            <NumberField
              className="w-16"
              max={max}
              min={min}
              onValueChange={(v) => updateValue(axis, v)}
              render={<NumberFieldGroup />}
              size="sm"
              value={values[axis]}
            >
              <NumberFieldInput
                aria-label={`Enter ${axis.toUpperCase()} value`}
              />
            </NumberField>
          </div>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={() => setValues(defaultValues)}
        variant="outline"
      >
        <RotateCcwIcon aria-hidden="true" className="-ms-1 opacity-60" />
        Reset
      </Button>
    </Fieldset>
  );
}
