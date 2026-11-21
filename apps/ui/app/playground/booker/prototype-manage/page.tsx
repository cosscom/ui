// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "Reschedule and
// cancel screens" (.scratch/booker/issues/18-reschedule-and-cancel-screens.md).
//
// Rescheduling and cancelling an existing booking. Rescheduling uses the
// Booker's own calendar and time list. Two variants, chosen with the `variant`
// search param (A, B), differ only in where cancelling happens. A synthetic
// booking is picked by the `scenario` search param, and the `stage` search
// param opens partway through a flow. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  stages,
  type VariantKey,
  variants,
} from "./fixtures";
import { ManagePrototype } from "./manage-prototype";

export const metadata: Metadata = {
  title: "Booker reschedule and cancel prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
    stage?: string | string[];
  }>;
};

export default async function BookerManagePrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("accepted" satisfies ScenarioKey);

  const stage = stages.find((item) => item === params.stage) ?? "summary";

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <ManagePrototype
        initialStage={stage}
        scenario={scenario}
        variant={variant}
      />
    </main>
  );
}
