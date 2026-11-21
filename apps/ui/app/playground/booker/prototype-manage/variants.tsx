"use client";

// PROTOTYPE ONLY. One variant: rescheduling and cancelling as steps of the
// booking flow. Earlier versions are on the prototype/booker-manage-v1 and
// prototype/booker-manage-v2 branches.

import { ManageBooker, type StepProps } from "./parts";

export function VariantA(props: StepProps) {
  return <ManageBooker {...props} />;
}
