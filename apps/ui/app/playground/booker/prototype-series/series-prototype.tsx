"use client";

// PROTOTYPE ONLY. Holds the flow's state, decides every API answer from the
// scenario, mounts the Booker card and prints the state. Nothing is sent.
// One variant, following the design system.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import type { FieldValues } from "../prototype-form/fixtures";
import { startOfMonth } from "../prototype-manage/fixtures";
import {
  breaksAtOccurrence,
  createAnswer,
  getKind,
  getSeatSettings,
  getSeatsRemaining,
  getSeriesDates,
  recurrence,
  resolveCount,
  type ScenarioKey,
  type Stage,
  scenarios,
  seatsPerTimeSlot,
  type VariantKey,
  variants,
  wait,
} from "./fixtures";
import { type CreateError, type Flow, SeriesBooker } from "./parts";

const pickedDate = new Date(2026, 10, 25);
const pickedTime = "14:00";
const filledValues: FieldValues = {
  email: "dana@example.com",
  name: "Dana Whitfield",
};

function slotKey(date: Date, time: string) {
  return `${date.toDateString()} ${time}`;
}

export function SeriesPrototype({
  variant,
  scenario,
  initialStage,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
  initialStage: Stage;
}) {
  const kind = getKind(scenario);
  const seatSettings = getSeatSettings(scenario);
  const opensPicked = initialStage !== "select";
  const opensFilled = initialStage === "booked" || initialStage === "broken";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [month, setMonth] = useState(startOfMonth(pickedDate));
  const [date, setDate] = useState<Date | undefined>(
    opensPicked ? pickedDate : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    opensPicked ? pickedTime : undefined,
  );
  const [is24Hour, setIs24Hour] = useState(false);
  const [values, setValues] = useState<FieldValues>(
    opensFilled ? filledValues : {},
  );
  // Leaving the count out books the whole series, so it starts at the limit.
  const [countValue, setCountValue] = useState<number | null>(
    recurrence.occurrences,
  );
  const { count, valid: countValid } = resolveCount(countValue);
  const [full, setFull] = useState<string[]>([]);
  const [createError, setCreateError] = useState<CreateError>();
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const note = (line: string) =>
    setLog((current) => [...current.slice(-5), line]);

  // Start over when the scenario or variant changes, but not on first mount,
  // so a link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      setStage("select");
      setDate(undefined);
      setTime(undefined);
      setValues({});
      setCountValue(recurrence.occurrences);
      setFull([]);
      setCreateError(undefined);
      setLog([]);
    }
    mounted.current = true;
  }, [scenario, variant]);

  const submit = async () => {
    if (busy || !date || !time) {
      return;
    }
    setBusy(true);
    await wait();
    setBusy(false);
    const body =
      kind === "recurring" ? `start, recurrenceCount: ${count}` : "start";
    const answer = createAnswer(scenario, count);
    if (answer.kind === "broken") {
      note(
        `POST booking (${body}) → 400. Meetings 1–${breaksAtOccurrence - 1} were created before it failed; the answer does not say so.`,
      );
      setStage("broken");
      return;
    }
    if (answer.kind === "seatGone") {
      note("POST booking → 409 No more seats left at this seated booking.");
      setFull((current) => [...current, slotKey(date, time)]);
      setCreateError("seatGone");
      return;
    }
    if (answer.kind === "alreadyIn") {
      note("POST booking → 409 already_signed_up_for_this_booking_error");
      setCreateError("alreadyIn");
      return;
    }
    note(
      kind === "recurring"
        ? `POST booking (${body}) → 201, ${count} bookings sharing one recurringBookingUid, each with its own status`
        : `POST booking (${body}) → 201, seatUid, attendees: ${seatSettings.showAttendeeInfo ? "everyone" : "[]"}`,
    );
    setStage("booked");
  };

  const flow: Flow = {
    backToSelect: () => {
      setCreateError(undefined);
      setStage("select");
    },
    busy,
    count,
    countValue,
    countValid,
    createError,
    date,
    is24Hour,
    kind,
    month,
    pickTime: (next) => {
      setCreateError(undefined);
      setTime(next);
      setStage("form");
    },
    seatsRemaining: (day, slot) =>
      full.includes(slotKey(day, slot)) ? 0 : getSeatsRemaining(day, slot),
    setCountValue,
    setDate,
    setIs24Hour,
    setMonth,
    setValue: (slug, value) =>
      setValues((current) => ({ ...current, [slug]: value })),
    showAttendees: seatSettings.showAttendeeInfo,
    showSeatCount: seatSettings.showAvailabilityCount,
    stage,
    submit: () => void submit(),
    time,
    values,
  };

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <SeriesBooker flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            apiCalls: log,
            kind,
            scenario,
            stage,
            variant,
            ...(kind === "recurring"
              ? {
                  countInField: countValue,
                  recurrenceCount: count,
                  seriesDates:
                    date && time
                      ? getSeriesDates(date, count).map((day) =>
                          day.toDateString(),
                        )
                      : [],
                }
              : {}),
            ...(kind === "seated"
              ? {
                  seats: {
                    ...seatSettings,
                    seatsPerTimeSlot,
                    seatsRemainingOnPick:
                      date && time ? getSeatsRemaining(date, time) : null,
                  },
                }
              : {}),
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
