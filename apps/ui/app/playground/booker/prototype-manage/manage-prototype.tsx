"use client";

// PROTOTYPE ONLY. Holds the reschedule and cancel flow's state, mounts one
// variant, and prints the state. Every "submit" is a stub.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import {
  bookings,
  formatDate,
  type ScenarioKey,
  scenarios,
  type VariantKey,
  variants,
} from "./fixtures";
import type { Flow, Scope, Stage, VariantProps } from "./parts";
import { VariantA, VariantB, VariantC } from "./variants";

const variantComponents: Record<
  VariantKey,
  (props: VariantProps) => React.ReactElement
> = { A: VariantA, B: VariantB, C: VariantC };

export function ManagePrototype({
  variant,
  scenario,
  initialStage,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
  // Lets a link open the prototype partway through a flow.
  initialStage: Stage;
}) {
  const booking = bookings[scenario];
  const startsWithNewTime =
    initialStage === "rescheduling" || initialStage === "rescheduled";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [date, setDate] = useState<Date | undefined>(
    startsWithNewTime ? new Date(2026, 10, 25) : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    initialStage === "rescheduled" ? "2:00pm" : undefined,
  );
  const [reason, setReason] = useState("");
  const [scope, setScope] = useState<Scope>("this");
  const [rescheduleError, setRescheduleError] = useState<string>();
  const [cancelError, setCancelError] = useState<string>();

  const startOver = () => {
    setStage("summary");
    setDate(undefined);
    setTime(undefined);
    setReason("");
    setScope("this");
    setRescheduleError(undefined);
    setCancelError(undefined);
  };

  // Start over when the variant or scenario changes, but not on first mount,
  // so a link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      startOver();
    }
    mounted.current = true;
  }, [scenario, variant]);

  const flow: Flow = {
    cancelError,
    date,
    reason,
    rescheduleError,
    scope,
    setDate,
    setReason,
    setScope,
    setStage: (next) => {
      setRescheduleError(undefined);
      setCancelError(undefined);
      if (next === "summary" && stage === "rescheduling") {
        setDate(undefined);
        setTime(undefined);
      }
      setStage(next);
    },
    setTime,
    stage,
    startOver,
    submitCancel: () => {
      // The API can demand a reason; that is only known when it refuses.
      if (scenario === "refusals" && reason.trim() === "") {
        setCancelError("Please give a reason.");
        return;
      }
      setCancelError(undefined);
      setStage("cancelled");
    },
    submitReschedule: () => {
      if (scenario === "refusals") {
        setRescheduleError("This booking can’t be rescheduled.");
        return;
      }
      setStage("rescheduled");
    },
    time,
  };

  const Variant = variantComponents[variant];

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <Variant booking={booking} flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            cancelError: cancelError ?? null,
            newTime: date && time ? `${formatDate(date)} ${time}` : null,
            reason,
            rescheduleError: rescheduleError ?? null,
            scenario,
            scope: booking.kind === "occurrence" ? scope : "n/a",
            stage,
            variant,
          },
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
