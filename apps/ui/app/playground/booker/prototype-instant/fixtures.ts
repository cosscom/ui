// PROTOTYPE ONLY. Synthetic instant-meeting behaviour. No network: every API
// answer is decided here.

export const variants = [
  { key: "A", label: "Meet now in the event pane" },
  { key: "B", label: "Meet now above the calendar" },
  { key: "C", label: "Meet now as a bar along the card’s bottom" },
] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "accepted", label: "A host accepts" },
  { key: "expired", label: "No one picks up" },
  { key: "notNow", label: "Outside the instant schedule" },
  { key: "tooSoon", label: "Asked in the last 10 minutes" },
  { key: "off", label: "Instant meetings off" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

// Where in the flow the prototype starts, from the stage search param.
// `form` opens the form of an instant request.
export const stages = [
  "select",
  "form",
  "waiting",
  "joined",
  "ended",
  "booked",
] as const;

export type Stage = (typeof stages)[number];

export type EndReason = "expired" | "notNow" | "tooSoon";

// Cal's default is 90 seconds. The "No one picks up" scenario uses 20, so
// the end can be seen without a long wait.
export function getExpirySeconds(scenario: ScenarioKey) {
  return scenario === "expired" ? 20 : 90;
}

// When the stub host accepts, in seconds after the request.
export const acceptAfterSeconds = 6;

// The Booker fetches the booking this often while waiting.
export const pollEverySeconds = 2;

export const latencyMs = 700;

export const videoLink = "https://app.cal.com/video/8f2c1d7e";

/** The event type's `isInstantEvent`, and the Booker's `instantMeeting`. */
export function instantOffered(scenario: ScenarioKey) {
  return scenario !== "off";
}

/** What `POST /bookings` with `instant: true` answers. */
export function createAnswer(scenario: ScenarioKey): "created" | EndReason {
  if (scenario === "notNow" || scenario === "tooSoon") {
    return scenario;
  }
  return "created";
}

export function wait(ms = latencyMs) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
