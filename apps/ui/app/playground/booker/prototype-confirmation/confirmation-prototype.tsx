"use client";

// PROTOTYPE ONLY. Mounts one confirmation variant with a synthetic booking,
// the state panel and the switcher.

import { useEffect, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import {
  bookings,
  type ScenarioKey,
  scenarios,
  type VariantKey,
  variants,
} from "./fixtures";
import { VariantA, type VariantProps } from "./variants";

const variantComponents: Record<
  VariantKey,
  (props: VariantProps) => React.ReactElement
> = { A: VariantA };

export function ConfirmationPrototype({
  variant,
  scenario,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
}) {
  const [lastAction, setLastAction] = useState("none");
  const booking = bookings[scenario];
  const Variant = variantComponents[variant];

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    setLastAction("none");
  }, [scenario, variant]);

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <Variant booking={booking} onAction={setLastAction} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          { lastAction: `${lastAction} (stub)`, scenario, variant, booking },
          null,
          2,
        )}
      </pre>

      <PrototypeSwitcher
        scenario={scenario}
        scenarios={scenarios.map((item) => ({ ...item }))}
        variant={variant}
        variants={variants.map((item) => ({ ...item }))}
      />
    </div>
  );
}
