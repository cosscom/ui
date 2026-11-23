// The Booker calendar's day model, as the design system's
// (calcom/cal `apps/design-system/components/booker-calendar-model.ts`).
// Dates are plain "YYYY-MM-DD" keys and months "YYYY-MM" keys: calendar
// values, not instants.

export type CalendarDayState = {
  /** `"unknown"` while the day's availability has not been loaded. */
  available: boolean | "unknown";
  away?: {
    emoji: string;
    showNotePublicly?: boolean;
    message?: string;
    alternativeHost?: { name?: string | null };
  };
};

export type CalendarDay = { key: string; outside: boolean; hidden: boolean };

export function calendarDate(key: string): Date {
  return new Date(`${key}T12:00:00Z`);
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(key: string, amount: number): string {
  const date = calendarDate(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateKey(date);
}

// Clamps the day to the target month's end: Jan 31 + 1 month is Feb 28.
export function addMonths(key: string, amount: number): string {
  const date = calendarDate(key);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  const end = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  );
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return dateKey(date);
}

export function startOfWeek(key: string, weekStart: number): string {
  return addDays(key, -((calendarDate(key).getUTCDay() - weekStart + 7) % 7));
}

export function isKnownDay(state: CalendarDayState): boolean {
  return state.available !== "unknown";
}

export function isSelectableDay(state: CalendarDayState): boolean {
  if (!isKnownDay(state)) return false;
  if (state.away) {
    return Boolean(state.away.showNotePublicly || state.away.alternativeHost);
  }
  return state.available === true;
}

// Always 42 cells. For the current month, once today reaches the 4th row,
// today's week and the two after it stay visible: the grid extends into the
// next month and drops early weeks only when it must. UTC arithmetic keeps
// the keys stable across timezones.
export function calendarGrid({
  month,
  today,
  weekStart = 0,
  shiftWeeks = true,
  minDate,
  maxDate,
}: {
  month: string;
  today: string;
  weekStart?: number;
  shiftWeeks?: boolean;
  minDate: string;
  maxDate?: string;
}): CalendarDay[] {
  const first = `${month}-01`;
  const naturalStart = startOfWeek(first, weekStart);
  const todayRow = Math.floor(
    (calendarDate(today).getTime() - calendarDate(naturalStart).getTime()) /
      604800000,
  );
  const expanded = shiftWeeks && today.startsWith(month) && todayRow >= 3;
  const shift = expanded ? Math.max(0, todayRow - 3) * 7 : 0;
  const start = addDays(naturalStart, shift);
  return Array.from({ length: 42 }, (_, index) => {
    const key = addDays(start, index);
    const outside = !key.startsWith(month);
    const hidden =
      key < first ||
      (!expanded && outside) ||
      key.slice(0, 7) < minDate.slice(0, 7) ||
      Boolean(maxDate && key.slice(0, 7) > maxDate.slice(0, 7));
    return { key, outside, hidden };
  });
}

// Keeps a selection that is still visible and selectable; otherwise the
// first selectable day in view, unless `autoSelect` is off.
export function resolveSelection(
  selected: string | undefined,
  days: CalendarDay[],
  getDay: (key: string) => CalendarDayState,
  autoSelect = true,
): string | undefined {
  if (
    selected &&
    days.some(
      (day) =>
        !day.hidden && day.key === selected && isSelectableDay(getDay(day.key)),
    )
  ) {
    return selected;
  }
  if (!autoSelect) return undefined;
  return days.find((day) => !day.hidden && isSelectableDay(getDay(day.key)))
    ?.key;
}

export function keyboardDate({
  current,
  key,
  shiftKey = false,
  dir = "ltr",
  weekStart,
  minDate,
  maxDate,
  isSelectable,
  isKnown = () => true,
}: {
  current: string;
  key: string;
  shiftKey?: boolean;
  dir?: "ltr" | "rtl";
  weekStart: number;
  minDate: string;
  maxDate?: string;
  isSelectable: (key: string) => boolean;
  isKnown?: (key: string) => boolean;
}): string | undefined {
  let candidate: string;
  let direction = 1;
  let end = maxDate;
  let start = minDate;
  switch (key) {
    case "Home":
      candidate = startOfWeek(current, weekStart);
      end = addDays(candidate, 6);
      break;
    case "End":
      start = startOfWeek(current, weekStart);
      candidate = addDays(start, 6);
      direction = -1;
      break;
    case "ArrowLeft":
    case "ArrowRight":
      direction = (key === "ArrowRight" ? 1 : -1) * (dir === "rtl" ? -1 : 1);
      candidate = shiftKey
        ? addMonths(current, direction)
        : addDays(current, direction);
      break;
    case "ArrowUp":
    case "ArrowDown":
      direction = key === "ArrowDown" ? 1 : -1;
      candidate = shiftKey
        ? addMonths(current, direction * 12)
        : addDays(current, direction * 7);
      break;
    case "PageUp":
    case "PageDown":
      direction = key === "PageDown" ? 1 : -1;
      candidate = addMonths(current, direction * (shiftKey ? 12 : 1));
      break;
    default:
      return undefined;
  }
  start = start < minDate ? minDate : start;
  if (maxDate && (!end || end > maxDate)) end = maxDate;
  if (candidate < start) candidate = start;
  if (end && candidate > end) candidate = end;
  for (
    let attempt = 0;
    attempt < 366 && candidate >= start && (!end || candidate <= end);
    attempt++
  ) {
    // Unknown is a focus intent for the owner to load, not a confirmed
    // selectable date.
    if (!isKnown(candidate)) return candidate;
    if (isSelectable(candidate)) return candidate;
    candidate = addDays(candidate, direction);
  }
  return undefined;
}

// For callers that hold local `Date`s: a date's own year, month and day as a
// key, and a key back as local midnight.
export function localDateKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function localDate(key: string): Date {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Cal's weekStart is a day name ("Monday"); the calendar takes 0 = Sunday …
// 6 = Saturday.
const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function toWeekStart(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value)) {
    return ((value % 7) + 7) % 7;
  }
  if (typeof value !== "string") return undefined;
  const index = WEEKDAYS.indexOf(value.trim().toLowerCase());
  return index === -1 ? undefined : index;
}
