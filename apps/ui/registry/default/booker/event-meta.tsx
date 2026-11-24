// The rows of the Booker's event information, as the design system's Booker
// event information (calcom/cal
// `apps/design-system/components/booker-event-information-examples.tsx`:
// HostIdentity, EventTitle, FormerTime, SelectedTime, RequiresConfirmation,
// FixedDuration). Markup and classes are the design system's; only the data
// is passed in.

import {
  CalendarIcon,
  CalendarX2Icon,
  ClockIcon,
  SquareCheckIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/registry/default/lib/utils";
import { BookerAvatars } from "./booker-avatars";
import { bookerHeadingClassName } from "./booker-heading";
import type { BookerAvatar } from "./lib/booker-utils";

/** "Tuesday, September 15, 2026", as the design system writes a date. */
export function formatEventDate(date: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    day: "numeric",
    month: "long",
    timeZone,
    weekday: "long",
    year: "numeric",
  }).format(date);
}

/** "10:00 am" or "10:00", as the design system writes a time. */
export function formatEventTime(
  date: Date,
  is24Hour: boolean,
  locale: string,
  timeZone?: string,
) {
  return new Intl.DateTimeFormat(locale, {
    hour: is24Hour ? "2-digit" : "numeric",
    hour12: !is24Hour,
    minute: "2-digit",
    timeZone,
  })
    .formatToParts(date)
    .map((part) =>
      part.type === "dayPeriod" ? part.value.toLowerCase() : part.value,
    )
    .join("");
}

export function HostIdentity({
  avatars,
  name,
}: {
  avatars?: BookerAvatar[];
  name: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <BookerAvatars avatars={avatars} fallbackName={name} />
      {name ? (
        <p className="font-medium text-muted-foreground sm:text-sm">{name}</p>
      ) : null}
    </div>
  );
}

export function EventTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      className={cn(
        bookerHeadingClassName,
        "@3xl:@max-5xl:text-lg text-xl leading-tight",
      )}
    >
      {children}
    </h1>
  );
}

type TimeProps = {
  start: Date;
  is24Hour: boolean;
  locale: string;
  timeZone?: string;
};

/** The booking being rescheduled: its start only, struck through. */
export function FormerTime({
  start,
  is24Hour,
  locale,
  timeZone,
  label,
}: TimeProps & { label: string }) {
  return (
    <div className="flex gap-2 sm:text-sm">
      <CalendarX2Icon
        aria-hidden="true"
        className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
      />
      <span>
        {label}
        <br />
        <span className="line-through">
          {formatEventDate(start, locale, timeZone)}
          <br />
          {formatEventTime(start, is24Hour, locale, timeZone)}
        </span>
      </span>
    </div>
  );
}

export function SelectedTime({
  start,
  durationMinutes,
  is24Hour,
  locale,
  timeZone,
}: TimeProps & { durationMinutes: number }) {
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return (
    <div className="flex gap-2 sm:text-sm">
      <CalendarIcon
        aria-hidden="true"
        className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
      />
      <span>
        {formatEventDate(start, locale, timeZone)}
        <br />
        {formatEventTime(start, is24Hour, locale, timeZone)}–
        {formatEventTime(end, is24Hour, locale, timeZone)}
      </span>
    </div>
  );
}

export function RequiresConfirmation({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 sm:text-sm">
      <SquareCheckIcon
        aria-hidden="true"
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
      />
      <span>{label}</span>
    </div>
  );
}

export function FixedDuration({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 sm:text-sm">
      <ClockIcon
        aria-hidden="true"
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
      />
      <span>{label}</span>
    </div>
  );
}
