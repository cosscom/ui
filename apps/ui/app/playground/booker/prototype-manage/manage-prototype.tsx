"use client";

// PROTOTYPE ONLY. Holds the reschedule and cancel flow's state, mounts the
// Booker card, and prints the state. Every "submit" is a stub.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import {
  bookings,
  formatDate,
  getStepKey,
  resolveDate,
  type ScenarioKey,
  type Stage,
  scenarios,
  startOfMonth,
  toDate,
  type VariantKey,
  variants,
} from "./fixtures";
import type { Flow, Scope, Slot, StepProps } from "./parts";
import { VariantA } from "./variants";

const variantComponents: Record<
  VariantKey,
  (props: StepProps) => React.ReactElement
> = { A: VariantA };

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
  const original: Slot = {
    date: toDate(booking.date),
    durationMinutes: booking.durationMinutes,
    time: booking.time,
  };
  const picked: Slot = {
    date: pickedDate,
    durationMinutes: booking.durationMinutes,
    time: pickedTime,
  };
  const linkHasPicked = initialStage === "confirmingReschedule";
  const linkRescheduled = initialStage === "rescheduled";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [current, setCurrent] = useState<Slot>(
    linkRescheduled ? picked : original,
  );
  const [former, setFormer] = useState<Slot | undefined>(
    linkRescheduled ? original : undefined,
  );
  const [month, setMonth] = useState(
    startOfMonth(linkHasPicked ? pickedDate : original.date),
  );
  const [date, setDate] = useState<Date | undefined>(
    linkHasPicked
      ? pickedDate
      : initialStage === "rescheduling"
        ? resolveDate(startOfMonth(original.date), original.date)
        : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    linkHasPicked ? pickedTime : undefined,
  );
  const [durationMinutes, setDurationMinutes] = useState(
    booking.durationMinutes,
  );
  const [timeZone, setTimeZone] = useState(booking.timeZone);
  const [is24Hour, setIs24Hour] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string>();
  const [scope, setScope] = useState<Scope>("this");
  const [rescheduleError, setRescheduleError] = useState<string>();
  const [cancelError, setCancelError] = useState<string>();
  const [lastAction, setLastAction] = useState("none");

  const clearMessages = () => {
    setReasonError(undefined);
    setRescheduleError(undefined);
    setCancelError(undefined);
  };

  const startOver = () => {
    clearMessages();
    setStage("summary");
    setCurrent(original);
    setFormer(undefined);
    setMonth(startOfMonth(original.date));
    setDate(undefined);
    setTime(undefined);
    setDurationMinutes(booking.durationMinutes);
    setTimeZone(booking.timeZone);
    setReason("");
    setScope("this");
    setLastAction("none");
  };

  // Start over when the scenario changes, but not on first mount, so a
  // link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      startOver();
    }
    mounted.current = true;
  }, [scenario, variant]);

  const flow: Flow = {
    backToSelect: () => {
      clearMessages();
      setStage("rescheduling");
    },
    backToSummary: () => {
      clearMessages();
      setReason("");
      setStage(former ? "rescheduled" : "summary");
    },
    bookAgain: () => setLastAction("book again (stub: starts a new booking)"),
    cancelError,
    current,
    date,
    durationMinutes,
    former,
    is24Hour,
    month,
    pickTime: (next) => {
      setTime(next);
      setStage("confirmingReschedule");
    },
    reason,
    reasonError,
    rescheduleError,
    scope,
    setDate,
    setDurationMinutes,
    setIs24Hour,
    setMonth,
    setReason: (next) => {
      setReason(next);
      setReasonError(undefined);
    },
    setScope,
    setTimeZone,
    stage,
    // Opens the select step on the booking's own day, as Cal does.
    startCancel: () => {
      clearMessages();
      setReason("");
      setStage("cancelling");
    },
    startReschedule: () => {
      clearMessages();
      setReason("");
      setMonth(startOfMonth(current.date));
      setDate(resolveDate(startOfMonth(current.date), current.date));
      setTime(undefined);
      setDurationMinutes(current.durationMinutes);
      setStage("rescheduling");
    },
    submitCancel: () => {
      // The API can demand a reason; that is only known when it refuses.
      if (scenario === "refusals" && reason.trim() === "") {
        setCancelError("Please give a reason.");
        return;
      }
      clearMessages();
      setStage("cancelled");
    },
    submitReschedule: () => {
      const field = booking.rescheduleReason;
      if (!field.hidden && field.required && reason.trim() === "") {
        setReasonError("Enter a reason.");
        return;
      }
      if (scenario === "refusals") {
        setRescheduleError("This booking can’t be rescheduled.");
        return;
      }
      if (date && time) {
        setFormer(current);
        setCurrent({ date, durationMinutes, time });
      }
      clearMessages();
      setStage("rescheduled");
    },
    time,
    timeZone,
  };

  const Variant = variantComponents[variant];

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <Variant booking={booking} flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            current: `${formatDate(current.date)} ${current.time}, ${current.durationMinutes} min`,
            former: former ? `${formatDate(former.date)} ${former.time}` : null,
            lastAction,
            reason,
            rescheduleReasonField: booking.rescheduleReason,
            scenario,
            scope: booking.kind === "occurrence" ? scope : "n/a",
            stage,
            step: getStepKey(stage),
            timeZone,
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
