// PROTOTYPE ONLY. Synthetic recurring and seated event types. No network:
// every API answer is decided here.

export const variants = [
  { key: "A", label: "Meeting count in the event pane" },
  { key: "B", label: "Meeting count on the form" },
] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "recurring", label: "Recurring, every week, up to 6" },
  { key: "recurringBreaks", label: "Recurring, fails at the 4th meeting" },
  { key: "seated", label: "Seated, counts and attendees shown" },
  { key: "seatedQuiet", label: "Seated, counts and attendees hidden" },
  { key: "seatGone", label: "Seated, the last seat goes first" },
  { key: "alreadyIn", label: "Seated, already booked at this time" },
  { key: "both", label: "Seated and recurring" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

// Where the prototype starts, from the stage search param.
export const stages = ["select", "form", "booked", "broken"] as const;

export type Stage = (typeof stages)[number];

export type Kind = "recurring" | "seated" | "fallback";

export function getKind(scenario: ScenarioKey): Kind {
  if (scenario === "both") {
    return "fallback";
  }
  return scenario === "recurring" || scenario === "recurringBreaks"
    ? "recurring"
    : "seated";
}

/** The event type's `recurrence`: every week, at most 6 meetings. */
export const recurrence = { frequency: "weekly", interval: 1, occurrences: 6 };

/** The event type's `seats`. */
export const seatsPerTimeSlot = 10;

export function getSeatSettings(scenario: ScenarioKey) {
  const quiet = scenario === "seatedQuiet";
  return { showAttendeeInfo: !quiet, showAvailabilityCount: !quiet };
}

/**
 * The slot's `seatsRemaining`. The API returns it whatever the event type
 * says, and leaves full times out of the list altogether.
 */
export function getSeatsRemaining(date: Date, time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return ((date.getDate() * 7 + hours * 3 + minutes) % seatsPerTimeSlot) + 1;
}

/** The other attendees on a slot, when the host shows them. */
export function getOtherAttendees(date: Date, time: string) {
  const names = [
    "Ava Brooks",
    "Leo Martin",
    "Noor Haddad",
    "Sam Okafor",
    "Ines Duarte",
    "Kai Tanaka",
    "Mira Novak",
    "Theo Laurent",
    "Zoe Fischer",
  ];
  const taken = seatsPerTimeSlot - getSeatsRemaining(date, time);
  return names.slice(0, taken);
}

/** The dates the server will book: the first start plus a week each time. */
export function getSeriesDates(first: Date, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index * 7 * recurrence.interval);
    return date;
  });
}

// "Fails at the 4th meeting": three are booked, then only an error comes back.
export const breaksAtOccurrence = 4;

export type CreateAnswer =
  | { kind: "created" }
  | { kind: "broken" }
  | { kind: "seatGone" }
  | { kind: "alreadyIn" };

/** What `POST /bookings` answers. */
export function createAnswer(
  scenario: ScenarioKey,
  count: number,
): CreateAnswer {
  if (scenario === "recurringBreaks" && count >= breaksAtOccurrence) {
    return { kind: "broken" };
  }
  if (scenario === "seatGone") {
    return { kind: "seatGone" };
  }
  if (scenario === "alreadyIn") {
    return { kind: "alreadyIn" };
  }
  return { kind: "created" };
}

export const bookingUrl = "https://cal.com/team/acme/workshop";

export const latencyMs = 700;

export function wait(ms = latencyMs) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
