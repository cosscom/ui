"use client";

import {
  RadioGroupPrimitive,
  RadioPrimitive,
} from "@/registry/default/ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/default/ui/segmented-control";

export default function Particle() {
  return (
    <SegmentedControl
      aria-label="Billing period"
      render={<RadioGroupPrimitive defaultValue="monthly" />}
      size="sm"
    >
      <SegmentedControlItem
        className="grow"
        render={<RadioPrimitive.Root value="monthly" />}
      >
        Monthly
      </SegmentedControlItem>
      <SegmentedControlItem
        className="grow"
        render={<RadioPrimitive.Root value="yearly" />}
      >
        Yearly
      </SegmentedControlItem>
    </SegmentedControl>
  );
}
