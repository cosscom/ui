// PROTOTYPE ONLY. A synthetic booking to reschedule or cancel, and synthetic
// availability for the Booker's real calendar and time list. No network.

import type { BookerCalendarProps } from "@/registry/default/atoms/booker/booker-calendar";
import {
  calendarGrid,
  localDate,
  localDateKey,
  resolveSelection,
} from "@/registry/default/atoms/booker/booker-calendar-model";

export type ReasonFieldConfig = {
  label: string;
  required: boolean;
  hidden: boolean;
};

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
  durationMinutes: number;
  durationOptions: number[];
  timeZone: string;
  location: string;
  attendeeEmail: string;
  // The event type's `rescheduleReason` booking field, as the host set it.
  rescheduleReason: ReasonFieldConfig;
  // "Meeting 2 of 4, weekly" for one occurrence of a series.
  seriesNote?: string;
};

const base: ManageBooking = {
  attendeeEmail: "dana@example.com",
  date: { day: 23, month: 10, year: 2026 },
  description: "A walkthrough tailored to your team, with time for questions.",
  durationMinutes: 30,
  durationOptions: [15, 30, 45, 60],
  host: "Rick Astley",
  hostInitials: "RA",
  kind: "single",
  location: "Cal Video",
  rescheduleReason: {
    hidden: false,
    label: "Reason for reschedule",
    required: false,
  },
  status: "accepted",
  time: "10:00",
  timeZone: "Europe/Rome",
  title: "Product demo",
};

export const bookings = {
  accepted: base,
  ended: { ...base, date: { day: 9, month: 10, year: 2026 }, status: "ended" },
  pending: { ...base, status: "pending" },
  reasonHidden: {
    ...base,
    rescheduleReason: { ...base.rescheduleReason, hidden: true },
  },
  reasonRequired: {
    ...base,
    rescheduleReason: { ...base.rescheduleReason, required: true },
  },
  recurring: {
    ...base,
    kind: "occurrence",
    seriesNote: "Meeting 2 of 4, weekly",
  },
  refusals: base,
  seated: { ...base, kind: "seat", title: "Group onboarding" },
} satisfies Record<string, ManageBooking>;

export const variants = [{ key: "A", label: "Steps" }] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "accepted", label: "Confirmed booking" },
  { key: "pending", label: "Requires confirmation" },
  { key: "reasonRequired", label: "Reason required" },
  { key: "reasonHidden", label: "Reason hidden" },
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

/** The BookerSteps key for each stage: what changes the right-hand side. */
export function getStepKey(stage: Stage) {
  if (stage === "rescheduling") {
    return "select";
  }
  if (stage === "confirmingReschedule") {
    return "reason";
  }
  if (stage === "cancelling") {
    return "cancel";
  }
  return "summary";
}

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

/**
 * The selection for a month, as the design system's: kept while it is still
 * visible and selectable, else the month's first selectable day.
 */
export function resolveDate(
  month: Date,
  selected?: Date,
  isAvailable: (date: Date) => boolean = hasSlots,
): Date | undefined {
  const selectedKey = selected ? localDateKey(selected) : undefined;
  const todayKey = localDateKey(today);
  const key = resolveSelection(
    selectedKey,
    calendarGrid({
      minDate: todayKey,
      month: localDateKey(month).slice(0, 7),
      today: todayKey,
    }),
    (day) => ({ available: isAvailable(localDate(day)) }),
  );
  if (!key) {
    return undefined;
  }
  return key === selectedKey ? selected : localDate(key);
}

/**
 * The calendar's props for a prototype's select step. Changing month keeps a
 * still-valid selection; a keyboard move keeps it as it is.
 */
export function getCalendarProps({
  month,
  setMonth,
  date,
  setDate,
  isAvailable = hasSlots,
}: {
  month: Date;
  setMonth: (month: Date) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isAvailable?: (date: Date) => boolean;
}): Pick<
  BookerCalendarProps,
  | "getDay"
  | "minDate"
  | "month"
  | "onMonthChange"
  | "onSelect"
  | "selected"
  | "today"
> {
  const todayKey = localDateKey(today);
  return {
    getDay: (day) => ({ available: isAvailable(localDate(day)) }),
    minDate: todayKey,
    month: localDateKey(month).slice(0, 7),
    onMonthChange: (next, preserveSelection) => {
      const nextMonth = localDate(`${next}-01`);
      setMonth(nextMonth);
      if (!preserveSelection) {
        setDate(resolveDate(nextMonth, date, isAvailable));
      }
    },
    onSelect: (day) => setDate(localDate(day)),
    selected: date ? localDateKey(date) : undefined,
    today: todayKey,
  };
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
}

/**
 * The time list takes the API's instants. The prototypes' stub times are
 * wall-clock "HH:mm" in the browser's timezone, so they are turned into
 * instants at the list and back when one is picked.
 */
export function toSlots(date: Date | undefined, times: string[]) {
  if (!date) {
    return [];
  }
  return times.map((time) => {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    return { start: start.toISOString() };
  });
}

export function slotTime(start: string) {
  const date = new Date(start);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** A picked day at an "HH:mm" time, as a local Date: the start of a slot. */
export function slotStart(date: Date, time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
  );
}
