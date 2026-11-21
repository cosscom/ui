// PROTOTYPE ONLY. A synthetic booking to reschedule or cancel, and synthetic
// availability for the Booker's real calendar and time list. No network.

export type ManageBooking = {
  kind: "single" | "occurrence" | "seat";
  status: "accepted" | "pending" | "ended";
  title: string;
  description: string;
  host: string;
  hostInitials: string;
  // Local date parts, so the server and the browser agree.
  date: { year: number; month: number; day: number };
  // 24-hour "HH:mm", as the Booker's time list uses.
  time: string;
  duration: string;
  timeZone: string;
  location: string;
  attendeeEmail: string;
  // "Meeting 2 of 4, weekly" for one occurrence of a series.
  seriesNote?: string;
};

const base: ManageBooking = {
  attendeeEmail: "dana@example.com",
  date: { day: 23, month: 10, year: 2026 },
  description: "A walkthrough tailored to your team, with time for questions.",
  duration: "30 min",
  host: "Rick Astley",
  hostInitials: "RA",
  kind: "single",
  location: "Cal Video",
  status: "accepted",
  time: "10:00",
  timeZone: "Europe/Rome",
  title: "Product demo",
};

export const bookings = {
  accepted: base,
  ended: { ...base, date: { day: 9, month: 10, year: 2026 }, status: "ended" },
  pending: { ...base, status: "pending" },
  recurring: {
    ...base,
    kind: "occurrence",
    seriesNote: "Meeting 2 of 4, weekly",
  },
  refusals: base,
  seated: { ...base, kind: "seat", title: "Group onboarding" },
} satisfies Record<string, ManageBooking>;

export const variants = [
  { key: "A", label: "Cancel in the pane" },
  { key: "B", label: "Cancel in a dialog" },
] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "accepted", label: "Confirmed booking" },
  { key: "pending", label: "Requires confirmation" },
  { key: "recurring", label: "One of a series" },
  { key: "seated", label: "A seat" },
  { key: "refusals", label: "API refuses" },
  { key: "ended", label: "Already ended" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

// Where in the flow the prototype starts, from the stage search param.
export const stages = [
  "summary",
  "rescheduling",
  "confirmingReschedule",
  "rescheduled",
  "cancelling",
  "cancelled",
] as const;

export type Stage = (typeof stages)[number];

// The prototype's fixed "today".
export const today = new Date(2026, 10, 20);

const weekdaySlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "16:00",
];

/** Synthetic availability: weekdays from tomorrow on, the same times. */
export function getDaySlots(date: Date | undefined): string[] {
  if (!date || date <= today) {
    return [];
  }
  const day = date.getDay();
  return day === 0 || day === 6 ? [] : weekdaySlots;
}

export function hasSlots(date: Date) {
  return getDaySlots(date).length > 0;
}

export function getNextAvailableDate(from: Date): Date | null {
  const cursor = new Date(from);
  for (let index = 0; index < 60; index += 1) {
    if (hasSlots(cursor)) {
      return new Date(cursor);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

export function toDate(parts: ManageBooking["date"]) {
  return new Date(parts.year, parts.month, parts.day);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
}
