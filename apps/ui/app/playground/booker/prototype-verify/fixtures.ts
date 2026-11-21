// PROTOTYPE ONLY. Synthetic verification behaviour for the email
// verification step. No network: every API answer is decided here.

export const variants = [
  { key: "A", label: "Code on Confirm" },
  { key: "B", label: "Code once the email is in" },
] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "eventType", label: "Event type requires it" },
  { key: "perEmail", label: "This address requires it" },
  { key: "foundOnCreate", label: "Found out on create" },
  { key: "notSent", label: "Code can’t be sent" },
  { key: "none", label: "No verification" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

// Where in the flow the prototype starts, from the stage search param. Each
// stage is one BookerSteps key.
export const stages = ["select", "form", "verify", "booked"] as const;

export type Stage = (typeof stages)[number];

// The one code the stub accepts. Anything else is "wrong or expired": the
// API does not tell the two apart.
export const correctCode = "123456";

export const codeLength = 6;

// One send per address per minute (Cal's limit), and three sends a minute
// from one visitor.
export const resendCooldownSeconds = 60;
export const sendsPerMinute = 3;

// Fake latency, so the waits can be seen.
export const latencyMs = 700;

/** Known before Confirm: the event type's `requiresBookerEmailVerification`. */
export function eventRequiresCode(scenario: ScenarioKey) {
  return scenario === "eventType" || scenario === "notSent";
}

/** What `GET /bookings/verification/email/check` answers for an address. */
export function checkSaysRequired(scenario: ScenarioKey) {
  return scenario === "perEmail";
}

/** Booking creation refuses with 403 for an address the check missed. */
export function createRefuses(scenario: ScenarioKey) {
  return scenario === "foundOnCreate";
}

/** `POST /send-code` answers `sent: false` for a watchlisted address. */
export function sendSucceeds(scenario: ScenarioKey) {
  return scenario !== "notSent";
}

export function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export function wait(ms = latencyMs) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
