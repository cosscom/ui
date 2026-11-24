"use client";

// The calendar's roving focus, as the design system's
// (calcom/cal `apps/design-system/components/use-booker-calendar-focus.ts`).
// A move onto a day whose availability is not loaded yet asks the owner for
// that range and restores focus once it is known; pointer input or focus
// elsewhere cancels it.

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  type CalendarDay,
  type CalendarDayState,
  isKnownDay,
  isSelectableDay,
  keyboardDate,
} from "./booker-calendar-model";

const NAVIGATION_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);

export function useBookerCalendarFocus({
  month,
  days,
  getDay,
  minDate,
  maxDate,
  selected,
  today,
  loading,
  dir,
  weekStart,
  onMonthChange,
}: {
  month: string;
  days: CalendarDay[];
  getDay: (key: string) => CalendarDayState;
  minDate: string;
  maxDate?: string;
  selected?: string;
  today: string;
  loading?: string;
  dir: "ltr" | "rtl";
  weekStart: number;
  onMonthChange: (month: string, preserveSelection?: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<
    | {
        date: string;
        current: string;
        key: string;
        shiftKey: boolean;
        originMonth: string;
        requestedMonth: string;
      }
    | undefined
  >(undefined);
  const [focusedDate, setFocusedDate] = useState<string>();
  const [lastFocusedDate, setLastFocusedDate] = useState<string>();
  const visible = days.filter((day) => !day.hidden);
  const getState = (key: string): CalendarDayState => {
    if (key < minDate || (maxDate && key > maxDate))
      return { available: false };
    return getDay(key);
  };
  const target =
    [focusedDate, lastFocusedDate, selected, today].find(
      (key) =>
        key &&
        visible.some((day) => day.key === key) &&
        isSelectableDay(getState(key)),
    ) ?? visible.find((day) => isSelectableDay(getState(day.key)))?.key;

  useEffect(() => {
    const cancelAfterFocusMoves = (event: FocusEvent) => {
      if (event.target instanceof Node && event.target !== document.body) {
        pendingFocus.current = undefined;
      }
    };
    const cancelAfterPointerAction = () => {
      pendingFocus.current = undefined;
    };
    document.addEventListener("focusin", cancelAfterFocusMoves);
    document.addEventListener("pointerdown", cancelAfterPointerAction);
    return () => {
      document.removeEventListener("focusin", cancelAfterFocusMoves);
      document.removeEventListener("pointerdown", cancelAfterPointerAction);
    };
  }, []);

  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    if (
      pending.date < minDate ||
      (maxDate && pending.date > maxDate) ||
      (month !== pending.originMonth && month !== pending.requestedMonth)
    ) {
      pendingFocus.current = undefined;
      return;
    }
    const visibleDays = days.filter((day) => !day.hidden);
    if (
      loading ||
      !visibleDays.some((day) => day.key === pending.date) ||
      !isKnownDay(getDay(pending.date))
    ) {
      return;
    }
    const first = visibleDays[0]?.key ?? minDate;
    const last = visibleDays.at(-1)?.key ?? minDate;
    const next = keyboardDate({
      ...pending,
      dir,
      weekStart,
      minDate: first > minDate ? first : minDate,
      maxDate: maxDate && maxDate < last ? maxDate : last,
      isSelectable: (key) => isSelectableDay(getDay(key)),
      isKnown: (key) => isKnownDay(getDay(key)),
    });
    if (next && !isKnownDay(getDay(next))) return;
    pendingFocus.current = undefined;
    setFocusedDate(next);
    // An empty range: focus the grid rather than an unavailable date.
    if (!next) {
      rootRef.current?.querySelector<HTMLTableElement>("table")?.focus();
    }
  }, [days, getDay, loading, minDate, maxDate, dir, weekStart, month]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    current: string,
  ) {
    if (!NAVIGATION_KEYS.has(event.key)) return;
    event.preventDefault();
    const intent = { current, key: event.key, shiftKey: event.shiftKey };
    const next = keyboardDate({
      ...intent,
      dir,
      weekStart,
      minDate,
      maxDate,
      isSelectable: (key) => isSelectableDay(getState(key)),
      isKnown: (key) => isKnownDay(getState(key)),
    });
    if (!next) return;
    if (!isKnownDay(getState(next))) {
      const requestedMonth = visible.some((day) => day.key === next)
        ? month
        : next.slice(0, 7);
      pendingFocus.current = {
        ...intent,
        date: next,
        originMonth: month,
        requestedMonth,
      };
      setFocusedDate(undefined);
      onMonthChange(requestedMonth, true);
      return;
    }
    pendingFocus.current = undefined;
    // Overflow days take focus where they are; only a day out of view
    // changes the month, and keyboard moves never change the selection.
    if (!visible.some((day) => day.key === next)) {
      onMonthChange(next.slice(0, 7), true);
    }
    setFocusedDate(next);
  }

  return {
    rootRef,
    focusedDate,
    target,
    handleKeyDown,
    onFocus: (key: string) => setFocusedDate(key),
    onBlur: (key: string) => {
      setLastFocusedDate(key);
      setFocusedDate((current) => (current === key ? undefined : current));
    },
  };
}
