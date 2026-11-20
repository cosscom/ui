// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "The confirmation
// screen" (.scratch/booker/issues/09-confirmation-screen.md).
//
// Three variants of what an attendee sees after booking, switchable with the
// `variant` search param (A, B, C), with a synthetic booking picked by the
// `scenario` search param. Nothing is sent.

import type { Metadata } from "next";
import { ConfirmationPrototype } from "./confirmation-prototype";
import {
  type ScenarioKey,
  scenarios,
  type VariantKey,
  variants,
} from "./fixtures";

export const metadata: Metadata = {
  title: "Booker confirmation prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function BookerConfirmationPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("accepted" satisfies ScenarioKey);

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <ConfirmationPrototype scenario={scenario} variant={variant} />
    </main>
  );
}
