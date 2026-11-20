// PROTOTYPE ONLY. A synthetic booking to reschedule or cancel. No network.

export type ManageBooking = {
  kind: "single" | "occurrence" | "seat";
  status: "accepted" | "pending" | "ended";
  title: string;
  description: string;
  host: string;
  hostInitials: string;
  // Local date parts, so the server and the browser agree.
  date: { year: number; month: number; day: number };
  time: string;
  duration: string;
  timeZone: string;
  location: string;
  attendeeEmail: string;
  // "This is meeting 2 of 4" for one occurrence of a series.
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
  time: "10:00am",
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
  { key: "A", label: "In place" },
  { key: "B", label: "Dialogs" },
  { key: "C", label: "Inline, compact" },
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
  "rescheduled",
  "cancelling",
  "cancelled",
] as const;

export type Stage = (typeof stages)[number];

export const slots = [
  "9:00am",
  "9:30am",
  "10:00am",
  "10:30am",
  "11:00am",
  "2:00pm",
  "2:30pm",
  "3:00pm",
  "4:00pm",
];

// The prototype's fixed "today".
export const today = new Date(2026, 10, 20);

export function toDate(parts: ManageBooking["date"]) {
  return new Date(parts.year, parts.month, parts.day);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
}

export function isSameDay(a: Date | undefined, b: Date | undefined) {
  return Boolean(a && b && a.toDateString() === b.toDateString());
}

// The next weekdays with availability, for the compact picker.
export function getUpcomingDays(count: number) {
  const days: Date[] = [];
  const cursor = new Date(today);
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
      days.push(new Date(cursor));
    }
  }
  return days;
}
