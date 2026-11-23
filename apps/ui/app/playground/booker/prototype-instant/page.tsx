// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "The instant
// meeting flow" (.scratch/booker/issues/20-instant-meeting-flow.md).
//
// An instant meeting as a route through the Booker's steps. Two variants of
// where "Meet now" is offered, switchable with `variant`; the API's answers
// are picked by `scenario`; `stage` opens partway through. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  stages,
  type VariantKey,
  variants,
} from "./fixtures";
import { InstantPrototype } from "./instant-prototype";

export const metadata: Metadata = {
  title: "Booker instant meeting prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
    stage?: string | string[];
  }>;
};

export default async function BookerInstantPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("accepted" satisfies ScenarioKey);
  const stage = stages.find((item) => item === params.stage) ?? "select";

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <InstantPrototype
        initialStage={stage}
        scenario={scenario}
        variant={variant}
      />
    </main>
  );
}
