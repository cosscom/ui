"use client";

// PROTOTYPE ONLY. Holds the reschedule and cancel flow's state, mounts one
// variant, and prints the state. Every "submit" is a stub.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import {
  bookings,
  formatDate,
  type ScenarioKey,
  type Stage,
  scenarios,
  startOfMonth,
  toDate,
  type VariantKey,
  variants,
} from "./fixtures";
import type { Flow, Scope, VariantProps } from "./parts";
import { VariantA, VariantB } from "./variants";

const variantComponents: Record<
  VariantKey,
  (props: VariantProps) => React.ReactElement
> = { A: VariantA, B: VariantB };

// A day and a time with availability, for links that open after a pick.
const pickedDate = new Date(2026, 10, 25);
const pickedTime = "14:00";

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
  const original = toDate(booking.date);
  const hasPicked =
    initialStage === "confirmingReschedule" || initialStage === "rescheduled";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [month, setMonth] = useState(
    startOfMonth(hasPicked ? pickedDate : original),
  );
  const [date, setDate] = useState<Date | undefined>(
    hasPicked
      ? pickedDate
      : initialStage === "rescheduling"
        ? original
        : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    hasPicked ? pickedTime : undefined,
  );
  const [is24Hour, setIs24Hour] = useState(false);
  const [reason, setReason] = useState("");
  const [scope, setScope] = useState<Scope>("this");
  const [rescheduleError, setRescheduleError] = useState<string>();
  const [cancelError, setCancelError] = useState<string>();

  const startOver = () => {
    setStage("summary");
    setMonth(startOfMonth(original));
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
    is24Hour,
    month,
    reason,
    rescheduleError,
    scope,
    setDate,
    setIs24Hour,
    setMonth,
    setReason,
    setScope,
    setStage: (next) => {
      setRescheduleError(undefined);
      setCancelError(undefined);
      if (next === "summary") {
        setDate(undefined);
        setTime(undefined);
      }
      setStage(next);
    },
    setTime,
    stage,
    startOver,
    // Opens the select step on the booking's own day, as Cal does.
    startReschedule: () => {
      setMonth(startOfMonth(original));
      setDate(original);
      setTime(undefined);
      setRescheduleError(undefined);
      setStage("rescheduling");
    },
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
