"use client";

import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from "@/registry/default/lib/segmented-control";
import { SegmentedControlIndicator } from "@/registry/default/lib/segmented-control-indicator";
import {
  RadioGroupPrimitive,
  RadioPrimitive,
} from "@/registry/default/ui/radio-group";

const itemClassName = segmentedControlItemVariants({
  className: "grow",
  size: "sm",
  state: "checked",
});

export default function Particle() {
  return (
    <RadioGroupPrimitive
      aria-label="Billing period"
      className={segmentedControlRootClassName}
      defaultValue="monthly"
    >
      <RadioPrimitive.Root className={itemClassName} value="monthly">
        Monthly
      </RadioPrimitive.Root>
      <RadioPrimitive.Root className={itemClassName} value="yearly">
        Yearly
      </RadioPrimitive.Root>
      <SegmentedControlIndicator />
    </RadioGroupPrimitive>
  );
}
