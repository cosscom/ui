"use client";

// PROTOTYPE ONLY. Holds the flow's state, decides every API answer from the
// scenario, mounts the Booker card and prints the state. Nothing is sent.
// The two variants differ only in where "Meet now" is offered.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import type { FieldValues } from "../prototype-form/fixtures";
import { startOfMonth } from "../prototype-manage/fixtures";
import {
  acceptAfterSeconds,
  createAnswer,
  type EndReason,
  getExpirySeconds,
  instantOffered,
  pollEverySeconds,
  type ScenarioKey,
  type Stage,
  scenarios,
  type VariantKey,
  variants,
  videoLink,
  wait,
} from "./fixtures";
import { type Flow, InstantBooker, type Mode } from "./parts";

const pickedDate = new Date(2026, 10, 25);
const filledValues: FieldValues = {
  email: "dana@example.com",
  name: "Dana Whitfield",
};

function defaultEndReason(scenario: ScenarioKey): EndReason {
  return scenario === "notNow" || scenario === "tooSoon" ? scenario : "expired";
}

export function InstantPrototype({
  variant,
  scenario,
  initialStage,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
  initialStage: Stage;
}) {
  const opensFilled = initialStage !== "select" && initialStage !== "form";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [mode, setMode] = useState<Mode>(
    initialStage === "booked" ? "scheduled" : "instant",
  );
  const [month, setMonth] = useState(startOfMonth(pickedDate));
  const [date, setDate] = useState<Date | undefined>(
    initialStage === "booked" ? pickedDate : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    initialStage === "booked" ? "14:00" : undefined,
  );
  const [is24Hour, setIs24Hour] = useState(false);
  const [values, setValues] = useState<FieldValues>(
    opensFilled ? filledValues : {},
  );
  const [busy, setBusy] = useState(false);
  // One request per event type per ten minutes: after one, the offer goes.
  const [requested, setRequested] = useState(opensFilled);
  const [requestedAt, setRequestedAt] = useState<number>();
  const [now, setNow] = useState(0);
  const [polls, setPolls] = useState(0);
  const [host, setHost] = useState<string | undefined>(
    initialStage === "joined" ? "Rick Astley" : undefined,
  );
  const [endReason, setEndReason] = useState<EndReason>(
    defaultEndReason(scenario),
  );
  const [log, setLog] = useState<string[]>([]);

  const note = (line: string) =>
    setLog((current) => [...current.slice(-7), line]);

  const expirySeconds = getExpirySeconds(scenario);

  // A link that opens on the waiting step: the request was made just now.
  // biome-ignore lint/correctness/useExhaustiveDependencies: first mount only
  useEffect(() => {
    if (initialStage === "waiting") {
      setRequestedAt(Date.now());
    }
  }, []);

  // Ticks the countdown.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed =
    requestedAt && now
      ? Math.max(0, Math.floor((now - requestedAt) / 1000))
      : 0;
  const secondsLeft = Math.max(0, expirySeconds - elapsed);

  // While waiting: poll the booking, and time out on the expiry ourselves,
  // because the booking never changes status when it expires.
  // biome-ignore lint/correctness/useExhaustiveDependencies: note is a logger
  useEffect(() => {
    if (stage !== "waiting" || !requestedAt) {
      return;
    }
    const nextPolls = Math.floor(elapsed / pollEverySeconds);
    if (nextPolls !== polls) {
      setPolls(nextPolls);
      if (scenario === "accepted" && elapsed >= acceptAfterSeconds) {
        note("GET booking → status: accepted, hosts[0]: Rick Astley");
        setHost("Rick Astley");
        setStage("joined");
        return;
      }
      note(`GET booking → status: awaiting_host (poll ${nextPolls})`);
    }
    if (secondsLeft === 0) {
      note("expiry passed: the Booker stops polling");
      setEndReason("expired");
      setStage("ended");
    }
  }, [elapsed, stage, requestedAt, polls, scenario, secondsLeft]);

  // Start over when the scenario or variant changes, but not on first mount,
  // so a link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      setStage("select");
      setMode("instant");
      setDate(undefined);
      setTime(undefined);
      setValues({});
      setRequested(false);
      setRequestedAt(undefined);
      setPolls(0);
      setHost(undefined);
      setLog([]);
    }
    mounted.current = true;
  }, [scenario, variant]);

  const submit = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    await wait();
    setBusy(false);
    if (mode === "scheduled") {
      note("POST booking → 201");
      setStage("booked");
      return;
    }
    setRequested(true);
    const answer = createAnswer(scenario);
    if (answer !== "created") {
      note(
        answer === "notNow"
          ? "POST booking (instant) → 400 instant_meeting_not_available_now"
          : "POST booking (instant) → 429",
      );
      setEndReason(answer);
      setStage("ended");
      return;
    }
    note(
      `POST booking (instant) → 201, status: awaiting_host, expires in ${expirySeconds}s`,
    );
    setPolls(0);
    setRequestedAt(Date.now());
    setNow(Date.now());
    setStage("waiting");
  };

  const flow: Flow = {
    backToSelect: () => setStage("select"),
    busy,
    date,
    endReason,
    host,
    is24Hour,
    meetNow: () => {
      setMode("instant");
      setStage("form");
    },
    mode,
    month,
    offerInstant: instantOffered(scenario) && !requested,
    pickTime: (next) => {
      setMode("scheduled");
      setTime(next);
      setStage("form");
    },
    scheduleInstead: () => {
      setMode("scheduled");
      setStage("select");
    },
    secondsLeft,
    setDate,
    setIs24Hour,
    setMonth,
    setValue: (slug, value) =>
      setValues((current) => ({ ...current, [slug]: value })),
    stage,
    stopWaiting: () => {
      note("cancel booking (stub): the request is withdrawn");
      setRequestedAt(undefined);
      setMode("scheduled");
      setStage("select");
    },
    submit: () => void submit(),
    time,
    values,
    variant,
    videoLink,
  };

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <InstantBooker flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            apiCalls: log,
            expirySeconds,
            meetNowOffered: flow.offerInstant,
            mode,
            polls,
            scenario,
            secondsLeft: stage === "waiting" ? secondsLeft : null,
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
