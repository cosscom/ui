// PROTOTYPE ONLY. A synthetic collective team event and its hosts' free
// times. No network: every API answer is decided here.

import { getDaySlots, today } from "../prototype-manage/fixtures";

export const variants = [{ key: "A", label: "Hosts in a combobox" }] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "few", label: "4 hosts" },
  { key: "many", label: "24 hosts" },
  { key: "noTime", label: "No time works for every host" },
  { key: "invalid", label: "A host can no longer be booked" },
  { key: "off", label: "hostChoice off" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

export const stages = ["select", "form", "booked"] as const;

export type Stage = (typeof stages)[number];

export type Host = { name: string; username: string };

const names = [
  "Alex Rivera",
  "Priya Shah",
  "Jordan Lee",
  "Morgan Kim",
  "Noah Okafor",
  "Taylor Brooks",
  "Ines Duarte",
  "Kai Tanaka",
  "Mira Novak",
  "Theo Laurent",
  "Zoe Fischer",
  "Ava Brooks",
  "Leo Martin",
  "Noor Haddad",
  "Sam Okafor",
  "Elena Rossi",
  "Omar Farouk",
  "Hana Sato",
  "Lucas Petit",
  "Freya Lund",
  "Diego Ramos",
  "Maya Cohen",
  "Ravi Iyer",
  "Clara Weiss",
];

export const teamName = "Product Team";

/** The event type's `hosts`, in the host's order. No emails. */
export function getHosts(scenario: ScenarioKey): Host[] {
  const count = scenario === "many" ? 24 : 4;
  return names.slice(0, count).map((name) => ({
    name,
    username: name.toLowerCase().replace(" ", "-"),
  }));
}

export function hostChoiceOn(scenario: ScenarioKey) {
  return scenario !== "off";
}

/** Whether one host is free at a time. Fixed, so a selection always gives the same times. */
function isFree(
  scenario: ScenarioKey,
  hostIndex: number,
  date: Date,
  time: string,
) {
  const timeIndex = getDaySlots(date).indexOf(time);
  // "No time works for every host": Alex and Morgan are never free together.
  if (scenario === "noTime" && (hostIndex === 0 || hostIndex === 3)) {
    return (timeIndex + date.getDate()) % 2 === (hostIndex === 0 ? 0 : 1);
  }
  // A spread that leaves every host free at a few times a day, and more
  // times the fewer hosts are chosen.
  const busyBelow = scenario === "many" ? 1 : 2;
  const spread =
    (date.getDate() * 7 +
      timeIndex * 5 +
      hostIndex * 3 +
      timeIndex * hostIndex) %
    11;
  return spread >= busyBelow;
}

/**
 * What `GET /slots` answers with `hostUsernames`: the times when every
 * chosen host is free. With no `hostUsernames`, every host must be free.
 */
export function getCommonTimes(
  scenario: ScenarioKey,
  hosts: Host[],
  chosen: string[],
  date: Date | undefined,
): string[] {
  if (!date) {
    return [];
  }
  const indexes = hosts
    .map((host, index) => (chosen.includes(host.username) ? index : -1))
    .filter((index) => index >= 0);
  return getDaySlots(date).filter((time) =>
    indexes.every((index) => isFree(scenario, index, date, time)),
  );
}

export function getNextCommonDate(
  scenario: ScenarioKey,
  hosts: Host[],
  chosen: string[],
  from: Date,
): Date | null {
  const cursor = new Date(from > today ? from : today);
  for (let index = 0; index < 60; index += 1) {
    if (getCommonTimes(scenario, hosts, chosen, cursor).length > 0) {
      return new Date(cursor);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

/** What `POST /bookings` answers. */
export function createAnswer(
  scenario: ScenarioKey,
): "created" | "invalidHosts" {
  return scenario === "invalid" ? "invalidHosts" : "created";
}

export const latencyMs = 700;

export function wait(ms = latencyMs) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
