// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "The host picker
// on a collective event" (.scratch/booker/issues/22-host-picker.md).
//
// Choosing which hosts of a collective event attend. Two variants of the
// picker, switchable with `variant`; the event and the API's answers are
// picked by `scenario`; `stage` opens partway through. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  stages,
  type VariantKey,
  variants,
} from "./fixtures";
import { HostsPrototype } from "./hosts-prototype";

export const metadata: Metadata = {
  title: "Booker host picker prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
    stage?: string | string[];
  }>;
};

export default async function BookerHostsPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("few" satisfies ScenarioKey);
  const stage = stages.find((item) => item === params.stage) ?? "select";

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <HostsPrototype
        initialStage={stage}
        scenario={scenario}
        variant={variant}
      />
    </main>
  );
}
