// PROTOTYPE ONLY. Throwaway route for the wayfinder ticket "The form rendered
// from booking fields" (.scratch/booker/issues/08-booking-fields-form.md).
//
// Three variants of the Booker's confirm step, switchable via `?variant=A|B|C`,
// with synthetic booking fields chosen by `?scenario=`. Nothing is sent.

import type { Metadata } from "next";
import {
  type ScenarioKey,
  scenarios,
  type VariantKey,
  variants,
} from "./fixtures";
import { FormPrototype } from "./form-prototype";

export const metadata: Metadata = {
  title: "Booker form prototype - coss ui",
};

type PageProps = {
  searchParams: Promise<{
    variant?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function BookerFormPrototypePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const variant =
    variants.find((item) => item.key === params.variant)?.key ??
    ("A" satisfies VariantKey);
  const scenario =
    scenarios.find((item) => item.key === params.scenario)?.key ??
    ("full" satisfies ScenarioKey);

  return (
    <main className="container flex min-h-svh w-full items-start py-10">
      <FormPrototype scenario={scenario} variant={variant} />
    </main>
  );
}
