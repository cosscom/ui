// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "The email
// verification step" (.scratch/booker/issues/21-email-verification-step.md).
//
// The verification code as a step of the booking flow, after the form, inside
// the Booker's own BookerSteps. Two variants of when the code is
// sent, switchable with `variant`; the API's answers are picked by `scenario`;
// `stage` opens partway through. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  stages,
  type VariantKey,
  variants,
} from "./fixtures";
import { VerifyPrototype } from "./verify-prototype";

export const metadata: Metadata = {
  title: "Booker email verification prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
    stage?: string | string[];
  }>;
};

export default async function BookerVerifyPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("eventType" satisfies ScenarioKey);
  const stage = stages.find((item) => item === params.stage) ?? "form";

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <VerifyPrototype
        initialStage={stage}
        scenario={scenario}
        variant={variant}
      />
    </main>
  );
}
