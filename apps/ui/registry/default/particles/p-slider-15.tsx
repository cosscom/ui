"use client";

import { useState } from "react";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Slider } from "@/registry/default/ui/slider";

const min = 5;
const max = 1240;

export default function Particle() {
  const [values, setValues] = useState([min, max]);

  const formatPrice = (price: number) =>
    price === max
      ? `$${price.toLocaleString()}+`
      : `$${price.toLocaleString()}`;

  return (
    <Fieldset className="flex w-full flex-col gap-3">
      <FieldsetLegend className="tabular-nums">
        From {formatPrice(values[0] ?? min)} to {formatPrice(values[1] ?? max)}
      </FieldsetLegend>
      <Slider
        getAriaLabel={(index) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
        className="flex-1"
        max={max}
        min={min}
        name="price-range"
        onValueChange={(v) => setValues(Array.isArray(v) ? [...v] : [v])}
        value={values}
      />
    </Fieldset>
  );
}
