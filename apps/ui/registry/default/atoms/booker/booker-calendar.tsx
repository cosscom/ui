"use client";

// The Booker's month calendar, as the design system's "Booker calendar"
// (calcom/cal `apps/design-system/components/booker-calendar-preview.tsx`).
// The design system simulates its three layouts; the Booker uses container
// queries on its card: mobile below `@3xl`, compact `@3xl` to `@5xl`, wide
// from `@5xl`. No motion for now.

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
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
import {
  addDays,
  addMonths,
  type CalendarDayState,
  calendarDate,
  calendarGrid,
  isKnownDay,
  isSelectableDay,
} from "./booker-calendar-model";
import { bookerHeadingClassName } from "./booker-heading";
import { useBookerCalendarFocus } from "./use-booker-calendar-focus";

export type { CalendarDayState } from "./booker-calendar-model";

// The design system's per-layout geometry, as container queries.
const styles = {
  cell: "aspect-square @max-3xl:aspect-auto @max-3xl:h-9",
  gap: "gap-1 @5xl:gap-1.5",
  heading: "@5xl:ps-1 text-lg @3xl:@max-5xl:text-base",
  hitArea: "after:-inset-0.5 @5xl:after:-inset-0.75",
  monthLabel: "end-1 top-1 @3xl:top-1.5 @5xl:end-1.5",
  row: "mt-1 @5xl:mt-1.5",
};

// English defaults. Localize by passing translated strings via `labels`;
// date, weekday and month names come from `locale` via `Intl`.
export const CALENDAR_LABELS = {
  previousMonth: "Go to the previous month",
  nextMonth: "Go to the next month",
  navigation: "Calendar navigation",
  today: "Today",
  selected: "selected",
  away: "Out of office",
  loading: "Loading availability",
};

export type CalendarLabels = typeof CALENDAR_LABELS;

const formatters = new Map<string, Intl.DateTimeFormat>();

// Calendar dates stay Gregorian whatever the language.
export function formatCalendarDate(
  key: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const id = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      calendar: "gregory",
      timeZone: "UTC",
    });
    formatters.set(id, formatter);
  }
  return formatter.format(calendarDate(key));
}

// Month and year; the year is muted via formatToParts so it stays
// locale-correct (some locales render "2026 June").
function CalendarMonthCaption({
  month,
  locale,
}: {
  month: string;
  locale: string;
}): ReactElement {
  const formatter = new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });
  return (
    <div className={cn(bookerHeadingClassName, styles.heading)}>
      {formatter
        .formatToParts(calendarDate(`${month}-01`))
        .map((part, index) =>
          part.type === "year" ? (
            <span
              key={`${part.type}-${index}`}
              className="text-muted-foreground/72"
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

type TooltipHandle = ReturnType<typeof TooltipCreateHandle<string>>;

function CalendarDayButton({
  date,
  state,
  selected = false,
  today = false,
  loading = false,
  focused = false,
  monthLabel,
  locale,
  labels,
  tooltipHandle,
  ...buttonProps
}: Omit<ComponentProps<"button">, "children"> & {
  date: string;
  state: CalendarDayState;
  selected?: boolean;
  today?: boolean;
  loading?: boolean;
  focused?: boolean;
  monthLabel?: string;
  locale: string;
  labels: CalendarLabels;
  tooltipHandle?: TooltipHandle;
}): ReactElement {
  const ref = useRef<HTMLButtonElement>(null);
  const disabled = !isSelectableDay(state);
  useEffect(() => {
    if (focused && !loading && !disabled) ref.current?.focus();
  }, [focused, loading, disabled]);
  const label = [
    today ? labels.today : undefined,
    formatCalendarDate(date, locale, {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    }),
    state.away ? labels.away : undefined,
    selected ? labels.selected : undefined,
  ]
    .filter(Boolean)
    .join(", ");

  const button = (
    <button
      {...buttonProps}
      aria-current={today ? "date" : undefined}
      aria-label={label}
      className={cn(
        "in-data-disabled:pointer-events-none relative flex w-full items-center justify-center rounded-lg bg-input in-data-disabled:bg-transparent in-data-selected:bg-primary font-medium in-data-disabled:font-normal in-data-selected:text-primary-foreground text-foreground tabular-nums in-data-disabled:opacity-50 outline-none after:absolute not-in-data-disabled:not-in-data-selected:hover:ring-2 not-in-data-disabled:not-in-data-selected:hover:ring-primary/72 focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-primary/72 sm:text-sm",
        styles.cell,
        styles.hitArea,
      )}
      disabled={disabled || loading}
      ref={ref}
      type="button"
    >
      {state.away ? (
        <span aria-hidden="true">{state.away.emoji}</span>
      ) : (
        formatCalendarDate(date, locale, { day: "numeric" })
      )}
      {monthLabel ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute font-medium in-data-selected:text-primary-foreground/72 text-[10px] text-muted-foreground leading-none",
            styles.monthLabel,
          )}
        >
          {monthLabel}
        </span>
      ) : null}
    </button>
  );
  let content: ReactNode = button;
  if (loading) {
    content = <Skeleton className={cn("w-full rounded-lg", styles.cell)} />;
  } else if (tooltipHandle && !disabled) {
    content = (
      <TooltipTrigger
        handle={tooltipHandle}
        payload={formatCalendarDate(date, locale, { month: "long" })}
        render={button}
      />
    );
  }
  return (
    <div
      className={cn(
        "w-full",
        today &&
          !loading &&
          "*:before:pointer-events-none *:before:absolute *:before:start-1/2 *:before:bottom-1/7 *:before:z-1 *:before:size-1 *:before:-translate-x-1/2 *:before:rounded-full *:before:bg-primary [&[data-selected]>*]:before:bg-primary-foreground",
      )}
      data-away={Boolean(state.away) || undefined}
      data-disabled={disabled || undefined}
      data-selected={selected || undefined}
      data-today={today || undefined}
    >
      {content}
    </div>
  );
}

export type BookerCalendarProps = {
  className?: string;
  /** The displayed month, "YYYY-MM". */
  month: string;
  /** Today in the attendee's timezone, "YYYY-MM-DD". */
  today: string;
  /** The first bookable date; earlier months can't be shown. */
  minDate: string;
  /** The last bookable date, when the booking window has one. */
  maxDate?: string;
  selected?: string;
  onSelect: (date: string) => void;
  /**
   * `preserveSelection` is true for keyboard moves: focus changed month, the
   * selection didn't.
   */
  onMonthChange: (month: string, preserveSelection?: boolean) => void;
  /** Each day's state; `{ available: "unknown" }` until its range loads. */
  getDay: (date: string) => CalendarDayState;
  /**
   * First day of the week (0 = Sunday … 6 = Saturday): the event type's,
   * falling back to the host's.
   */
  weekStart?: number;
  /** BCP-47 locale for day, month and weekday names. */
  locale?: string;
  dir?: "ltr" | "rtl";
  labels?: Partial<CalendarLabels>;
  loading?: "initial" | "availability";
  /**
   * For the current month, once today reaches the 4th row, keep its week
   * and the next two visible. On by default.
   */
  shiftWeeks?: boolean;
};

export function BookerCalendar({
  className,
  month,
  today,
  minDate,
  maxDate,
  selected,
  onSelect,
  onMonthChange,
  getDay,
  weekStart = 0,
  locale = "en-US",
  dir = "ltr",
  labels: labelsProp,
  loading,
  shiftWeeks = true,
}: BookerCalendarProps): ReactElement {
  const labels = { ...CALENDAR_LABELS, ...labelsProp };
  // One tooltip per calendar, reused by every next-month day.
  const [tooltipHandle] = useState(() => TooltipCreateHandle<string>());
  const days = useMemo(
    () =>
      calendarGrid({ maxDate, minDate, month, shiftWeeks, today, weekStart }),
    [month, today, minDate, maxDate, weekStart, shiftWeeks],
  );
  const getState = (key: string): CalendarDayState => {
    const state = getDay(key);
    if (key >= minDate && (!maxDate || key <= maxDate)) return state;
    return {
      available: false,
      away: state.away ? { emoji: state.away.emoji } : undefined,
    };
  };
  const focus = useBookerCalendarFocus({
    days,
    dir,
    getDay,
    loading,
    maxDate,
    minDate,
    month,
    onMonthChange,
    selected,
    today,
    weekStart,
  });
  const overflowFirst = days.find((day) => !day.hidden && day.outside)?.key;
  const monthName = formatCalendarDate(`${month}-01`, locale, {
    month: "long",
    year: "numeric",
  });
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    addDays("2026-09-06", (weekStart + index) % 7),
  );

  return (
    <div
      aria-busy={Boolean(loading)}
      className={cn("w-full select-none", className)}
      data-slot="booker-calendar"
      dir={dir}
      lang={locale}
      ref={focus.rootRef}
    >
      <div className="flex w-full flex-col gap-2">
        <div aria-atomic="true" aria-live="polite" className="sr-only">
          {loading ? labels.loading : monthName}
        </div>
        <div className="flex h-10 items-center justify-between sm:h-9">
          {loading === "initial" ? (
            <Skeleton className="h-6 w-28" />
          ) : (
            <>
              <CalendarMonthCaption locale={locale} month={month} />
              <nav
                aria-label={labels.navigation}
                className="flex items-center gap-1"
              >
                <Button
                  aria-label={labels.previousMonth}
                  disabled={month <= minDate.slice(0, 7)}
                  onClick={() =>
                    onMonthChange(addMonths(`${month}-01`, -1).slice(0, 7))
                  }
                  size="icon-lg"
                  variant="ghost"
                >
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="rtl:rotate-180"
                  />
                </Button>
                <Button
                  aria-label={labels.nextMonth}
                  disabled={Boolean(maxDate && month >= maxDate.slice(0, 7))}
                  onClick={() =>
                    onMonthChange(addMonths(`${month}-01`, 1).slice(0, 7))
                  }
                  size="icon-lg"
                  variant="ghost"
                >
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="rtl:rotate-180"
                  />
                </Button>
              </nav>
            </>
          )}
        </div>
        <TooltipProvider delay={0}>
          <table
            aria-label={monthName}
            aria-multiselectable={false}
            className="w-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the design system's date grid, which takes focus when a keyboard move finds no selectable date
            role="grid"
            tabIndex={-1}
          >
            <thead>
              <tr className="flex w-full gap-1 py-2">
                {weekdays.map((key) => (
                  <th
                    aria-label={formatCalendarDate(key, locale, {
                      weekday: "long",
                    })}
                    className="flex-1 font-medium text-muted-foreground/72 text-xs"
                    key={key}
                    scope="col"
                  >
                    {loading === "initial" ? (
                      <Skeleton className="mx-auto my-0.5 h-3 w-6" />
                    ) : (
                      formatCalendarDate(key, locale, { weekday: "short" })
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, row) => (
                <tr
                  className={cn("flex w-full", styles.row, styles.gap)}
                  key={days[row * 7]?.key}
                >
                  {days.slice(row * 7, row * 7 + 7).map((day) => {
                    const state = getState(day.key);
                    return (
                      <td
                        aria-selected={selected === day.key}
                        className="flex-1 p-0"
                        data-day={day.key}
                        data-outside={day.outside || undefined}
                        key={day.key}
                      >
                        {day.hidden ? (
                          <div aria-hidden="true" className={styles.cell} />
                        ) : (
                          <CalendarDayButton
                            date={day.key}
                            focused={focus.focusedDate === day.key}
                            labels={labels}
                            loading={Boolean(loading) || !isKnownDay(state)}
                            locale={locale}
                            monthLabel={
                              day.key === overflowFirst
                                ? formatCalendarDate(day.key, locale, {
                                    month: "short",
                                  })
                                : undefined
                            }
                            onBlur={() => focus.onBlur(day.key)}
                            onClick={() => onSelect(day.key)}
                            onFocus={() => focus.onFocus(day.key)}
                            onKeyDown={(event) =>
                              focus.handleKeyDown(event, day.key)
                            }
                            selected={selected === day.key}
                            state={state}
                            tabIndex={focus.target === day.key ? 0 : -1}
                            today={today === day.key}
                            tooltipHandle={
                              day.outside ? tooltipHandle : undefined
                            }
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip disableHoverablePopup handle={tooltipHandle}>
            {({ payload }) => (
              <TooltipPopup
                className="transition-none! **:data-current:opacity-100! **:data-previous:opacity-0! **:data-current:transition-none! **:data-previous:transition-none!"
                portalProps={{
                  className:
                    "**:data-[slot=tooltip-positioner]:transition-none!",
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

/**
 * The calendar's pane in the Booker's select step. It caps at 28.75rem on
 * mobile and 20rem in compact, as the design system's frame.
 */
export function BookerCalendarPane({
  className,
  ...props
}: ComponentProps<"div">): ReactElement {
  return (
    <div
      className={cn(
        "flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:@max-5xl:max-w-80 @max-3xl:max-w-[28.75rem] @3xl:shrink-0 flex-col items-center @max-3xl:self-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4",
        className,
      )}
      data-slot="booker-calendar-pane"
      {...props}
    />
  );
}
