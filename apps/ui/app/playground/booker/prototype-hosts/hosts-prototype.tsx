"use client";

// PROTOTYPE ONLY. Holds the flow's state, decides every API answer from the
// scenario, mounts the Booker card and prints the state. Nothing is sent.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import type { FieldValues } from "../prototype-form/fixtures";
import { startOfMonth } from "../prototype-manage/fixtures";
import {
  createAnswer,
  getCommonTimes,
  getHosts,
  getNextCommonDate,
  hostChoiceOn,
  latencyMs,
  type ScenarioKey,
  type Stage,
  scenarios,
  type VariantKey,
  variants,
  wait,
} from "./fixtures";
import { type Flow, HostsBooker } from "./parts";

const pickedDate = new Date(2026, 10, 25);
const filledValues: FieldValues = {
  email: "dana@example.com",
  name: "Dana Whitfield",
};

export function HostsPrototype({
  variant,
  scenario,
  initialStage,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
  initialStage: Stage;
}) {
  const hosts = getHosts(scenario);
  const everyone = hosts.map((host) => host.username);
  const opensPicked = initialStage !== "select";

  const [stage, setStage] = useState<Stage>(initialStage);
  // Everyone starts chosen: that is the event as the host set it up.
  const [chosen, setChosenState] = useState<string[]>(everyone);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(startOfMonth(pickedDate));
  const [date, setDate] = useState<Date | undefined>(
    opensPicked ? pickedDate : undefined,
  );
  const [time, setTime] = useState<string | undefined>(
    opensPicked
      ? getCommonTimes(scenario, hosts, everyone, pickedDate)[0]
      : undefined,
  );
  const [is24Hour, setIs24Hour] = useState(false);
  const [values, setValues] = useState<FieldValues>(
    initialStage === "booked" ? filledValues : {},
  );
  const [invalidHosts, setInvalidHosts] = useState(false);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const note = (line: string) =>
    setLog((current) => [...current.slice(-5), line]);

  // Only a narrowed choice is sent; everyone chosen sends nothing.
  const hostUsernames = chosen.length === hosts.length ? undefined : chosen;
  const query = hostUsernames
    ? `hostUsernames=${hostUsernames.join(",")}`
    : "no hostUsernames";

  // Start over when the scenario or variant changes, but not on first mount,
  // so a link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      setStage("select");
      setChosenState(getHosts(scenario).map((host) => host.username));
      setDate(undefined);
      setTime(undefined);
      setValues({});
      setInvalidHosts(false);
      setLog([]);
    }
    mounted.current = true;
  }, [scenario, variant]);

  // A changed choice changes availability: the slots reload.
  const loadId = useRef(0);
  const setChosen = (next: string[]) => {
    setChosenState(next);
    setLoading(true);
    const id = loadId.current + 1;
    loadId.current = id;
    const sent =
      next.length === hosts.length
        ? "no hostUsernames"
        : `hostUsernames=${next.join(",")}`;
    note(`GET slots (${sent})`);
    setTimeout(() => {
      if (loadId.current === id) {
        setLoading(false);
      }
    }, latencyMs);
  };

  const submit = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    await wait();
    setBusy(false);
    if (createAnswer(scenario) === "invalidHosts") {
      note(`POST booking (${query}) → 400 invalid_hosts`);
      setInvalidHosts(true);
      return;
    }
    note(`POST booking (${query}) → 201, hosts: ${chosen.length}`);
    setStage("booked");
  };

  const times = getCommonTimes(scenario, hosts, chosen, date);

  const flow: Flow = {
    backToSelect: () => {
      setInvalidHosts(false);
      setStage("select");
    },
    busy,
    chosen,
    date,
    hostChoice: hostChoiceOn(scenario),
    hosts,
    invalidHosts,
    is24Hour,
    isDayAvailable: (day) =>
      getCommonTimes(scenario, hosts, chosen, day).length > 0,
    loading,
    month,
    nextAvailableDate: getNextCommonDate(
      scenario,
      hosts,
      chosen,
      date ?? month,
    ),
    pickTime: (next) => {
      setTime(next);
      setStage("form");
    },
    setChosen,
    setDate,
    setIs24Hour,
    setMonth,
    setValue: (slug, value) =>
      setValues((current) => ({ ...current, [slug]: value })),
    stage,
    submit: () => void submit(),
    time,
    times,
    values,
  };

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <HostsBooker flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            apiCalls: log,
            chosen: `${chosen.length} of ${hosts.length}`,
            hostUsernames: hostUsernames ?? null,
            loading,
            scenario,
            stage,
            timesOnPickedDay: date ? times : null,
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
