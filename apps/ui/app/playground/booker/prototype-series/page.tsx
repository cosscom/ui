// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "Recurring and
// seated bookings in the flow"
// (.scratch/booker/issues/19-recurring-and-seated-flows.md).
//
// Recurring and seated event types as routes through the Booker's steps. Two
// variants of where a recurring event's meeting count is chosen, switchable
// with `variant`; the event type and the API's answers are picked by
// `scenario`; `stage` opens partway through. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  stages,
  type VariantKey,
  variants,
} from "./fixtures";
import { SeriesPrototype } from "./series-prototype";

export const metadata: Metadata = {
  title: "Booker recurring and seated prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
    stage?: string | string[];
  }>;
};

export default async function BookerSeriesPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("recurring" satisfies ScenarioKey);
  const stage = stages.find((item) => item === params.stage) ?? "select";

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <SeriesPrototype
        initialStage={stage}
        scenario={scenario}
        variant={variant}
      />
    </main>
  );
}
