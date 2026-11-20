"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Skeleton } from "@/registry/default/ui/skeleton";
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

// A single shared tooltip reused across every day cell (via the handle/payload
// pattern). Reusing one instance lets it gracefully move/scale between days
// instead of mounting a separate tooltip per cell.
const monthTooltipHandle = TooltipCreateHandle<string>();

// Falls back to English (US) when no `locale` prop is provided.
const DEFAULT_LOCALE = "en-US";

type CalendarLabels = {
  /** ARIA label for the previous-month navigation button. */
  previousMonth: string;
  /** ARIA label for the next-month navigation button. */
  nextMonth: string;
  /** ARIA label for the navigation toolbar. */
  nav: string;
  /** Prefix for today's day button label, e.g. "Today, Monday, …". */
  today: string;
  /** Suffix for the selected day button label, e.g. "…, selected". */
  selected: string;
};

// English defaults. Localize by passing translated strings via the `labels`
// prop (wire it up to your app's own i18n layer); date/weekday/month names are
// still localized automatically from `locale` via `Intl`.
const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: "Go to the Previous Month",
  nextMonth: "Go to the Next Month",
  nav: "Navigation bar",
  today: "Today",
  selected: "selected",
};

// Resolves the text direction for the locale (e.g. "rtl" for Arabic/Hebrew).
function getTextDirection(locale: string): "ltr" | "rtl" {
  try {
    const localeObj = new Intl.Locale(locale) as Intl.Locale & {
      textInfo?: { direction?: string };
      getTextInfo?: () => { direction?: string };
    };
    const info =
      typeof localeObj.getTextInfo === "function"
        ? localeObj.getTextInfo()
        : localeObj.textInfo;
    if (info?.direction === "rtl") {
      return "rtl";
    }
  } catch {
    // Fall through to the ltr default below.
  }
  return "ltr";
}

// Locale-aware formatting/ordering, derived from a BCP-47 locale string.
type Localization = {
  weekStartsOn: number;
  monthYearLabel: (date: Date) => string;
  fullDateLabel: (date: Date) => string;
  monthShortLabel: (date: Date) => string;
  monthLongLabel: (date: Date) => string;
  weekdayLong: (date: Date) => string;
  weekdayShort: (date: Date) => string;
  dayNumber: (date: Date) => string;
  captionFormatter: Intl.DateTimeFormat;
};

// 1 = Monday … 7 = Sunday (ISO) → JS getDay() index (0 = Sunday … 6 = Saturday).
function getWeekStartsOn(locale: string): number {
  try {
    const localeObj = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay?: number };
      getWeekInfo?: () => { firstDay?: number };
    };
    const info =
      typeof localeObj.getWeekInfo === "function"
        ? localeObj.getWeekInfo()
        : localeObj.weekInfo;
    const firstDay = info?.firstDay;
    if (typeof firstDay === "number") {
      return firstDay % 7;
    }
  } catch {
    // Fall through to the Sunday default below.
  }
  return 0;
}

function buildLocalization(
  locale: string,
  weekStartsOnOverride?: number,
): Localization {
  const longDateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const monthYearFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });
  const monthShortFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
  });
  const monthLongFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
  });
  const weekdayLongFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
  });
  const weekdayShortFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });
  const dayFormatter = new Intl.DateTimeFormat(locale, { day: "numeric" });

  return {
    weekStartsOn: weekStartsOnOverride ?? getWeekStartsOn(locale),
    monthYearLabel: (date) => monthYearFormatter.format(date),
    fullDateLabel: (date) => longDateFormatter.format(date),
    monthShortLabel: (date) => monthShortFormatter.format(date),
    monthLongLabel: (date) => monthLongFormatter.format(date),
    weekdayLong: (date) => weekdayLongFormatter.format(date),
    weekdayShort: (date) => weekdayShortFormatter.format(date),
    dayNumber: (date) => dayFormatter.format(date),
    captionFormatter: monthYearFormatter,
  };
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function isoMonth(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, date.getDate());
}

function startOfWeek(date: Date, weekStartsOn = 0): Date {
  const day = startOfDay(date);
  const diff = (day.getDay() - weekStartsOn + 7) % 7;
  return addDays(day, -diff);
}

function endOfWeek(date: Date, weekStartsOn = 0): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function differenceInCalendarMonths(a: Date, b: Date): number {
  return (
    (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
  );
}

type CalendarDay = {
  date: Date;
  outside: boolean;
  isoDate: string;
  dateMonthId: string;
};

type DayModifiers = {
  focused: boolean;
  disabled: boolean;
  hidden: boolean;
  outside: boolean;
  today: boolean;
  selected: boolean;
};

// Builds the month grid as full weeks covering the month.
//
// `shiftRows` slides the window forward by that many weeks, dropping the
// month's earliest week(s). When `fillToSix` is set the grid is then padded to
// a full 6 rows with days from the next month. Together they keep today's week
// plus the next two visible without exceeding 6 rows; with both at their
// defaults the month spans only the weeks it naturally needs.
function buildCalendarDays(
  month: Date,
  weekStartsOn: number,
  shiftRows: number,
  fillToSix: boolean,
): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const offset = shiftRows * 7;
  const gridStart = addDays(startOfWeek(monthStart, weekStartsOn), offset);
  const gridEnd = addDays(endOfWeek(endOfMonth(month), weekStartsOn), offset);

  const dates: Date[] = [];
  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    dates.push(cursor);
  }

  if (fillToSix) {
    while (dates.length < 42) {
      const lastDate = dates.at(-1);
      if (!lastDate) {
        break;
      }
      dates.push(addDays(lastDate, 1));
    }
  }

  return dates.map((date) => ({
    date,
    outside: !isSameMonth(date, month),
    isoDate: isoDate(date),
    dateMonthId: isoMonth(date),
  }));
}

function chunkWeeks(days: CalendarDay[]): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function isFocusableDay(modifiers: DayModifiers): boolean {
  return !modifiers.disabled && !modifiers.hidden && !modifiers.outside;
}

// A single day cell's button. Focuses itself when it becomes the roving-tabindex
// target so keyboard navigation moves the actual DOM focus.
function DayButton({
  focused,
  nextMonthLabel,
  tooltip,
  children,
  ...buttonProps
}: ComponentProps<"button"> & {
  focused: boolean;
  nextMonthLabel?: string;
  tooltip?: string;
}): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focused) ref.current?.focus();
  }, [focused]);

  const button = (
    <button ref={ref} {...buttonProps}>
      {children}
      {nextMonthLabel ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute @5xl:end-1.5 end-1 @3xl:top-1.5 top-1 font-medium in-data-selected:text-primary-foreground/72 text-[10px] text-muted-foreground leading-none"
        >
          {nextMonthLabel}
        </span>
      ) : null}
    </button>
  );

  if (!tooltip) return button;

  return (
    <TooltipTrigger
      handle={monthTooltipHandle}
      payload={tooltip}
      render={button}
    />
  );
}

// Month + year heading; the year is muted via formatToParts so it stays
// locale-correct (some locales render "2026 June").
export function MonthCaption({
  date,
  formatter,
  className,
  muteYear = true,
}: {
  date: Date;
  formatter: Intl.DateTimeFormat;
  className?: string;
  muteYear?: boolean;
}): ReactElement {
  return (
    <div
      className={cn(
        "@5xl:ps-1 font-heading @3xl:@max-5xl:text-base text-lg",
        className,
      )}
    >
      {formatter.formatToParts(date).map((part) =>
        part.type === "year" ? (
          <span
            key={`year-${part.value}`}
            className={muteYear ? "text-muted-foreground/72" : undefined}
          >
            {part.value}
          </span>
        ) : (
          part.value
        ),
      )}
    </div>
  );
}

type MoveBy = "day" | "week" | "month" | "year" | "startOfWeek" | "endOfWeek";
type MoveDir = "before" | "after";

export type BookerCalendarProps = {
  className?: string;
  /**
   * For the current month, once today reaches the 4th row, keep its week plus
   * the next two visible within the 6-row grid: extend into next-month days,
   * and slide the window down (dropping early weeks) only when today sits too
   * low for those two weeks to fit. Off renders a plain month grid. On by
   * default.
   */
  shiftWeeks?: boolean;
  availabilityLoading?: boolean;
  initialLoading?: boolean;
  month?: Date;
  defaultMonth?: Date;
  startMonth?: Date;
  endMonth?: Date;
  selected?: Date;
  onSelect?: (date: Date | undefined, triggerDate: Date) => void;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  /** BCP-47 locale tag used to localize day/month/weekday names and ARIA labels. */
  locale?: string;
  /** Override the locale's first day of the week (0 = Sunday … 6 = Saturday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Text direction; defaults to the locale's direction ("rtl" for ar/he/…). */
  dir?: "ltr" | "rtl";
  /** Translatable strings for the navigation buttons and day button states. */
  labels?: Partial<CalendarLabels>;
  /** Reference "today" for highlighting and week shifting; defaults to now. */
  today?: Date;
};

export function BookerCalendar({
  className,
  shiftWeeks = true,
  availabilityLoading = false,
  initialLoading = false,
  month,
  defaultMonth,
  startMonth,
  endMonth,
  selected,
  onSelect,
  onMonthChange,
  disabled,
  locale = DEFAULT_LOCALE,
  weekStartsOn,
  dir,
  labels,
  today: todayProp,
}: BookerCalendarProps): ReactElement {
  const dayCellsLoading = initialLoading || availabilityLoading;
  const localization = useMemo(
    () => buildLocalization(locale, weekStartsOn),
    [locale, weekStartsOn],
  );
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const resolvedDir = dir ?? getTextDirection(locale);
  const weekStart = localization.weekStartsOn;

  const today = todayProp ?? new Date();

  // The month is controlled by the parent (via `month`/`onMonthChange`), but we
  // keep an internal fallback so the calendar works uncontrolled too.
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(month ?? defaultMonth ?? today),
  );
  const monthTime = month ? startOfMonth(month).getTime() : undefined;
  useEffect(() => {
    if (monthTime !== undefined) {
      setInternalMonth(new Date(monthTime));
    }
  }, [monthTime]);

  const firstMonth = month ? startOfMonth(month) : internalMonth;

  const [focusedDate, setFocusedDate] = useState<Date | undefined>(undefined);
  const [lastFocusedDate, setLastFocusedDate] = useState<Date | undefined>(
    undefined,
  );

  const navStart = startMonth ? startOfMonth(startMonth) : undefined;
  const navEnd = endMonth ? startOfMonth(endMonth) : undefined;

  const previousMonth =
    navStart && differenceInCalendarMonths(firstMonth, navStart) <= 0
      ? undefined
      : addMonths(firstMonth, -1);
  const nextMonth =
    navEnd && differenceInCalendarMonths(navEnd, firstMonth) <= 0
      ? undefined
      : addMonths(firstMonth, 1);

  const goToMonth = useCallback(
    (date: Date) => {
      let newMonth = startOfMonth(date);
      if (navStart && newMonth < navStart) {
        newMonth = navStart;
      }
      if (navEnd && newMonth > navEnd) {
        newMonth = navEnd;
      }
      setInternalMonth(newMonth);
      onMonthChange?.(newMonth);
    },
    [navEnd, navStart, onMonthChange],
  );

  // For the live current month, once today reaches the 4th row, guarantee its
  // week plus the next two are visible. todayRow is today's 0-based row in the
  // natural (unshifted) grid.
  const naturalGridStart = startOfWeek(startOfMonth(firstMonth), weekStart);
  const todayRow = Math.floor(
    Math.round(
      (startOfDay(today).getTime() - naturalGridStart.getTime()) / 86_400_000,
    ) / 7,
  );
  const expand = shiftWeeks && isSameMonth(firstMonth, today) && todayRow >= 3;
  // Extend downward first; only drop early weeks (shift) when today sits so low
  // that the two trailing weeks wouldn't fit within the 6-row cap.
  const shiftRows = expand ? Math.max(0, todayRow - 3) : 0;

  const days = buildCalendarDays(firstMonth, weekStart, shiftRows, expand);
  const weeks = chunkWeeks(days);

  // Reserve any missing rows up to 6 (the most any month needs) with empty
  // placeholders, so the grid keeps a constant height across navigation. This
  // is 0 when expanding, since those months already fill all 6 rows with days.
  const placeholderRows = Math.max(0, 6 - weeks.length);

  const isSelected = (date: Date): boolean =>
    selected ? isSameDay(selected, date) : false;

  const getModifiers = (day: CalendarDay): DayModifiers => {
    const { date, outside } = day;
    const isBeforeNavStart = Boolean(navStart && date < navStart);
    const isAfterNavEnd = Boolean(navEnd && date > endOfMonth(navEnd));
    const isDisabled = disabled ? disabled(date) : false;
    // Leading previous-month days are never shown (past days aren't relevant).
    // Next-month days only belong in the grid while expanding; otherwise the
    // empty placeholder rows reserve their space instead of spilling over.
    const isPrevMonthDay = date < startOfMonth(firstMonth);
    const isNextMonthDay = date > endOfMonth(firstMonth);
    const isHidden =
      isBeforeNavStart ||
      isAfterNavEnd ||
      isPrevMonthDay ||
      (!expand && isNextMonthDay);
    const isToday = isSameDay(date, today);
    const isFocused =
      !isHidden &&
      !outside &&
      focusedDate !== undefined &&
      isSameDay(date, focusedDate);

    return {
      focused: isFocused,
      disabled: isDisabled,
      hidden: isHidden,
      outside,
      today: isToday,
      selected: isSelected(date),
    };
  };

  // Roving tabindex target. Priority: focused > last focused > selected > today
  // > first focusable day.
  const focusTarget = ((): CalendarDay | undefined => {
    let target: CalendarDay | undefined;
    let priority = -1;
    for (const day of days) {
      const modifiers = getModifiers(day);
      if (!isFocusableDay(modifiers)) continue;
      if (modifiers.focused && priority < 3) {
        target = day;
        priority = 3;
      } else if (
        lastFocusedDate &&
        isSameDay(day.date, lastFocusedDate) &&
        priority < 2
      ) {
        target = day;
        priority = 2;
      } else if (isSelected(day.date) && priority < 1) {
        target = day;
        priority = 1;
      } else if (modifiers.today && priority < 0) {
        target = day;
        priority = 0;
      }
    }
    if (!target) {
      target = days.find((day) => isFocusableDay(getModifiers(day)));
    }
    return target;
  })();

  // While expanding, mark the 1st of the next month (the first visible day past
  // the current month's end) with the month label.
  const monthEnd = endOfMonth(firstMonth);
  const nextMonthLabelIso = expand
    ? days.find((day) => {
        const modifiers = getModifiers(day);
        return day.date > monthEnd && !modifiers.hidden;
      })?.isoDate
    : undefined;

  const getFocusableDate = (
    moveBy: MoveBy,
    moveDir: MoveDir,
    refDate: Date,
  ): Date => {
    const delta = moveDir === "after" ? 1 : -1;
    let result: Date;
    switch (moveBy) {
      case "day":
        result = addDays(refDate, delta);
        break;
      case "week":
        result = addDays(refDate, delta * 7);
        break;
      case "month":
        result = addMonths(refDate, delta);
        break;
      case "year":
        result = addMonths(refDate, delta * 12);
        break;
      case "startOfWeek":
        result = startOfWeek(refDate, weekStart);
        break;
      case "endOfWeek":
        result = endOfWeek(refDate, weekStart);
        break;
    }
    if (moveDir === "before" && navStart && result < navStart) {
      result = navStart;
    }
    if (moveDir === "after" && navEnd && result > endOfMonth(navEnd)) {
      result = endOfMonth(navEnd);
    }
    return result;
  };

  const getNextFocus = (
    moveBy: MoveBy,
    moveDir: MoveDir,
    refDate: Date,
    attempt = 0,
  ): Date | undefined => {
    if (attempt > 365) return undefined;
    const next = getFocusableDate(moveBy, moveDir, refDate);
    const isDisabled = disabled ? disabled(next) : false;
    if (!isDisabled) return next;
    return getNextFocus(moveBy, moveDir, next, attempt + 1);
  };

  const moveFocus = (moveBy: MoveBy, moveDir: MoveDir) => {
    if (!focusedDate) return;
    const next = getNextFocus(moveBy, moveDir, focusedDate);
    if (!next) return;
    if (!isSameMonth(next, firstMonth)) {
      goToMonth(next);
    }
    setFocusedDate(next);
  };

  const handleDayClick =
    (day: CalendarDay, modifiers: DayModifiers) => (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setFocusedDate(day.date);
      if (modifiers.disabled) return;
      const newDate =
        selected && isSameDay(day.date, selected) ? undefined : day.date;
      onSelect?.(newDate, day.date);
    };

  const handleDayFocus = (day: CalendarDay) => () => {
    setFocusedDate(day.date);
  };

  const handleDayBlur = () => {
    setLastFocusedDate(focusedDate);
    setFocusedDate(undefined);
  };

  const handleDayKeyDown = (event: KeyboardEvent) => {
    const keyMap: Record<string, [MoveBy, MoveDir]> = {
      ArrowLeft: [event.shiftKey ? "month" : "day", "before"],
      ArrowRight: [event.shiftKey ? "month" : "day", "after"],
      ArrowDown: [event.shiftKey ? "year" : "week", "after"],
      ArrowUp: [event.shiftKey ? "year" : "week", "before"],
      PageUp: [event.shiftKey ? "year" : "month", "before"],
      PageDown: [event.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"],
    };
    const move = keyMap[event.key];
    if (move) {
      event.preventDefault();
      event.stopPropagation();
      const [moveBy, moveDir] = move;
      moveFocus(moveBy, moveDir);
    }
  };

  const weekdayHeaderStart = startOfWeek(today, weekStart);
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekdayHeaderStart, index);
    return {
      long: localization.weekdayLong(date),
      short: localization.weekdayShort(date),
    };
  });

  return (
    <div
      className={cn("w-full", className)}
      data-slot="booker-calendar"
      lang={locale}
      dir={resolvedDir === "rtl" ? "rtl" : undefined}
    >
      <div className="flex w-full flex-col gap-2">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {localization.monthYearLabel(firstMonth)}
        </div>
        <div className="flex h-10 items-center justify-between sm:h-9">
          {initialLoading ? (
            <Skeleton className="h-6 w-28" />
          ) : (
            <>
              <MonthCaption
                date={firstMonth}
                formatter={localization.captionFormatter}
              />
              <nav
                className="flex items-center gap-1"
                aria-label={resolvedLabels.nav}
              >
                <Button
                  variant="ghost"
                  size="icon-lg"
                  disabled={!previousMonth}
                  aria-label={resolvedLabels.previousMonth}
                  onClick={() => {
                    if (previousMonth) goToMonth(previousMonth);
                  }}
                >
                  <ChevronLeftIcon
                    className="rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  disabled={!nextMonth}
                  aria-label={resolvedLabels.nextMonth}
                  onClick={() => {
                    if (nextMonth) goToMonth(nextMonth);
                  }}
                >
                  <ChevronRightIcon
                    className="rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Button>
              </nav>
            </>
          )}
        </div>
        <TooltipProvider delay={0}>
          <table
            aria-multiselectable={false}
            aria-label={localization.monthYearLabel(firstMonth)}
            className="w-full"
          >
            <thead aria-hidden="true">
              <tr className="flex w-full @5xl:gap-1 gap-1 py-2">
                {weekdays.map((weekday) => (
                  <th
                    key={weekday.long}
                    aria-label={weekday.long}
                    className="flex-1 font-medium text-muted-foreground/72 text-xs"
                    scope="col"
                  >
                    {initialLoading ? (
                      <Skeleton className="mx-auto my-0.5 h-3 w-6" />
                    ) : (
                      weekday.short
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr
                  key={week[0]?.isoDate ?? week.at(-1)?.isoDate ?? "week"}
                  className="@5xl:mt-1.5 mt-1 flex w-full @5xl:gap-1.5 gap-1"
                >
                  {week.map((day) => {
                    const modifiers = getModifiers(day);

                    // The day button's own styling is driven by the `data-*`
                    // attributes below; these cell classes only cover the
                    // layout and the outside/hidden/today states.
                    const cellClassName = cn(
                      "@max-3xl:max-h-9 flex-1 p-0",
                      modifiers.hidden && "invisible",
                      modifiers.outside && "text-muted-foreground/50",
                      modifiers.today &&
                        !dayCellsLoading &&
                        "*:before:pointer-events-none *:before:absolute *:before:start-1/2 *:before:bottom-1/7 *:before:z-1 *:before:size-1 *:before:-translate-x-1/2 *:before:rounded-full *:before:bg-primary *:before:transition-colors [&[data-selected]>*]:before:bg-primary-foreground",
                    );

                    // Label (e.g. "Aug") sits on the 1st of the next month.
                    const nextMonthLabel =
                      day.isoDate === nextMonthLabelIso
                        ? localization.monthShortLabel(day.date)
                        : undefined;

                    // Next-month days only show in the shifted current-month
                    // view; a month-name tooltip keeps them from being mistaken
                    // for the current month.
                    const monthTooltip =
                      day.outside && !modifiers.disabled && !modifiers.hidden
                        ? localization.monthLongLabel(day.date)
                        : undefined;

                    return (
                      <td
                        key={day.isoDate}
                        className={cellClassName}
                        aria-selected={modifiers.selected || undefined}
                        data-day={day.isoDate}
                        data-month={day.outside ? day.dateMonthId : undefined}
                        data-selected={modifiers.selected || undefined}
                        data-disabled={modifiers.disabled || undefined}
                        data-hidden={modifiers.hidden || undefined}
                        data-outside={day.outside || undefined}
                        data-focused={modifiers.focused || undefined}
                        data-today={modifiers.today || undefined}
                      >
                        {modifiers.hidden ? null : dayCellsLoading ? (
                          <button
                            type="button"
                            disabled
                            tabIndex={-1}
                            aria-hidden="true"
                            className="pointer-events-none relative flex @max-3xl:aspect-auto aspect-square @max-3xl:h-9 @max-3xl:max-h-9 w-full items-center justify-center rounded-lg"
                          >
                            <Skeleton className="size-full rounded-lg" />
                          </button>
                        ) : (
                          <DayButton
                            className="in-data-disabled:pointer-events-none relative flex @max-3xl:aspect-auto aspect-square @max-3xl:h-9 w-full items-center justify-center rounded-lg bg-muted in-data-disabled:bg-transparent in-data-selected:bg-primary font-medium in-data-disabled:font-normal in-data-selected:text-primary-foreground text-foreground tabular-nums in-data-disabled:opacity-50 outline-none transition-shadow duration-150 ease-out after:absolute @5xl:after:-inset-0.75 after:-inset-0.5 not-in-data-disabled:not-in-data-selected:hover:ring-2 not-in-data-disabled:not-in-data-selected:hover:ring-primary/72 focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-primary/72 sm:text-sm"
                            type="button"
                            focused={modifiers.focused}
                            nextMonthLabel={nextMonthLabel}
                            tooltip={monthTooltip}
                            disabled={
                              (!modifiers.focused && modifiers.disabled) ||
                              undefined
                            }
                            aria-disabled={
                              (modifiers.focused && modifiers.disabled) ||
                              undefined
                            }
                            tabIndex={day === focusTarget ? 0 : -1}
                            aria-label={(() => {
                              let label = localization.fullDateLabel(day.date);
                              if (modifiers.today) {
                                label = `${resolvedLabels.today}, ${label}`;
                              }
                              if (modifiers.selected) {
                                label = `${label}, ${resolvedLabels.selected}`;
                              }
                              return label;
                            })()}
                            onClick={handleDayClick(day, modifiers)}
                            onBlur={handleDayBlur}
                            onFocus={handleDayFocus(day)}
                            onKeyDown={handleDayKeyDown}
                          >
                            {localization.dayNumber(day.date)}
                          </DayButton>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {Array.from(
                { length: placeholderRows },
                (_, rowIndex) => `placeholder-row-${rowIndex}`,
              ).map((rowKey) => (
                <tr
                  key={rowKey}
                  className="@5xl:mt-1.5 mt-1 flex w-full @5xl:gap-1.5 gap-1"
                >
                  {weekdays.map((weekday) => (
                    <td
                      key={`${rowKey}-${weekday.long}`}
                      className="@max-3xl:max-h-9 flex-1 p-0"
                    >
                      <div className="@max-3xl:aspect-auto aspect-square @max-3xl:h-9 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip handle={monthTooltipHandle} disableHoverablePopup>
            {({ payload }) => (
              <TooltipPopup
                className="**:data-current:opacity-100! **:data-previous:opacity-0! **:data-current:transition-none! **:data-previous:transition-none!"
                portalProps={{
                  className: "**:data-[slot=tooltip-positioner]:ease-out",
                }}
              >
                {payload}
              </TooltipPopup>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
