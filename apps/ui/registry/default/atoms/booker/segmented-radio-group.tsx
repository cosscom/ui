"use client";

// A copy of Cal's shared SegmentedRadioGroup
// (calcom/cal `packages/coss-ui/src/shared/segmented-radio-group.tsx`), the
// design system's 12h/24h control. Only the import paths differ.

import type * as React from "react";
import {
  RadioGroupPrimitive,
  RadioPrimitive,
} from "@/registry/default/ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlSize,
} from "@/registry/default/ui/segmented-control";

export function SegmentedRadioGroup({
  className,
  size = "default",
  children,
  ...props
}: Omit<RadioGroupPrimitive.Props, "className"> & {
  className?: string;
  size?: SegmentedControlSize;
}): React.ReactElement {
  return (
    <SegmentedControl
      className={className}
      render={
        <RadioGroupPrimitive data-slot="segmented-radio-group" {...props} />
      }
      size={size}
    >
      {children}
    </SegmentedControl>
  );
}

export function SegmentedRadio({
  className,
  size,
  ...props
}: Omit<RadioPrimitive.Root.Props, "className"> & {
  className?: string;
  size?: SegmentedControlSize;
}): React.ReactElement {
  return (
    <SegmentedControlItem
      className={className}
      render={<RadioPrimitive.Root data-slot="segmented-radio" {...props} />}
      size={size}
    />
  );
}
