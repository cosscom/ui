"use client";

// PROTOTYPE ONLY. Recurring and seated event types as routes through the
// Booker's steps: select → form → booked, or → broken when a series fails
// partway. Every change goes through BookerSteps. The select step is the
// Booker's real calendar and time list; the form is the chosen form.
//
// The recurrence and seat rows follow the design system: "Booker event
// information" (Recurrence, Seat availability) and "Booker time slots"
// (Seat availability).

import {
  CircleAlertIcon,
  CircleCheckIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
  UserIcon,
} from "lucide-react";
import { useId, useState } from "react";
import {
  BookerCalendar,
  BookerCalendarPane,
} from "@/registry/default/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/booker/booker-labels";
import { BookerSteps } from "@/registry/default/booker/booker-steps";
import { EventDescription } from "@/registry/default/booker/event-description";
import {
  EventTitle,
  FixedDuration,
  HostIdentity,
  SelectedTime,
} from "@/registry/default/booker/event-meta";
import { displayTimeLabel } from "@/registry/default/booker/lib/booker-utils";
import { LocationRow } from "@/registry/default/booker/location";
import {
  TimePicker,
  type TimeSlot,
} from "@/registry/default/booker/time-picker";
import {
  TimezoneDisplay,
  TimezonePicker,
} from "@/registry/default/booker/timezone-picker";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { FieldBlock, TermsNote } from "../prototype-form/field-block";
import {
  type FieldValue,
  type FieldValues,
  isFieldEmpty,
  simpleFields,
} from "../prototype-form/fixtures";
import {
  getCalendarProps,
  getDaySlots,
  getNextAvailableDate,
  slotStart,
  slotTime,
  startOfMonth,
  today,
  toSlots,
} from "../prototype-manage/fixtures";
import {
  bookingUrl,
  getFill,
  getOtherAttendees,
  getSeriesDates,
  type Kind,
  recurrence,
  type Stage,
  seatsPerTimeSlot,
} from "./fixtures";

export type CreateError = "seatGone" | "alreadyIn";

export type Flow = {
  kind: Kind;
  stage: Stage;
  month: Date;
  setMonth: (month: Date) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  pickTime: (time: string) => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
  values: FieldValues;
  setValue: (slug: string, value: FieldValue | undefined) => void;
  // Recurring: what is in the occurrence field, and what the booking uses
  // (the maximum while the entry is out of range).
  countValue: number | null;
  setCountValue: (value: number | null) => void;
  count: number;
  countValid: boolean;
  // Seated: what the host chose to show, and the seats left on a time.
  showSeatCount: boolean;
  showAttendees: boolean;
  seatsRemaining: (date: Date, time: string) => number;
  createError: CreateError | undefined;
  submit: () => void;
  backToSelect: () => void;
  busy: boolean;
};

export type StepProps = { flow: Flow };

const cardClassName =
  "@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]";
const sideClassName =
  "@3xl:w-(--booker-side) @3xl:shrink-0 @3xl:border-e border-b @3xl:border-b-0";
const narrowStepClassName =
  "@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4";
const barClassName =
  "sticky bottom-0 -mx-4 @5xl:-mx-6 -mb-4 @5xl:-mb-6 mt-auto flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] @3xl:rounded-es-none border-t bg-card @5xl:px-6 px-4 py-3";

// The design system shows the first five resolved dates; the rest go in a
// popover behind "+ N more".
const shownDates = 5;

const labels = getBookerLabels();

function getEmail(flow: Flow) {
  const email = flow.values.email;
  return typeof email === "string" ? email.trim() : "";
}

function getDates(flow: Flow) {
  return flow.date ? getSeriesDates(flow.date, flow.count) : [];
}

/** A clock time as the design system writes it: "10:00 am", or "14:00". */
function formatClock(time: string, is24Hour: boolean) {
  return is24Hour
    ? time
    : displayTimeLabel(time, true).replace(/(am|pm)$/, " $1");
}

/** A resolved date, as the design system writes it: "Tue, Sep 15, 10:00 am". */
function formatOccurrence(date: Date, time: string, is24Hour: boolean) {
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
  return `${day}, ${formatClock(time, is24Hour)}`;
}

function getTitle(kind: Kind) {
  return kind === "recurring" ? "Weekly coaching" : "Group workshop";
}

type FillBadge = { label: string; variant: "secondary" | "warning" };

/** "Filling fast" from half booked, "Almost full" from 83%. */
function getFillBadge(remaining: number): FillBadge | undefined {
  const fill = getFill(remaining);
  if (fill === "almostFull") {
    return { label: "Almost full", variant: "warning" };
  }
  if (fill === "fillingFast") {
    return { label: "Filling fast", variant: "secondary" };
  }
  return undefined;
}

/**
 * A seated slot's second line, from the design system's time slots: exact
 * counts, or "Seats available" with a badge. One mode for the whole list.
 */
function getSlotDetail(
  remaining: number,
  showCount: boolean,
): Omit<TimeSlot, "start"> {
  if (remaining <= 0) {
    return { detail: "No more seats available", disabled: true };
  }
  if (showCount) {
    return {
      detail:
        remaining === 1 ? "1 seat available" : `${remaining} seats available`,
    };
  }
  return { badge: getFillBadge(remaining), detail: "Seats available" };
}

/** The design system's RecurrenceSelector. */
function RecurrenceSelector({ flow }: StepProps) {
  const inputId = useId();

  return (
    <Field className="gap-1" invalid={!flow.countValid}>
      <div className="flex gap-2 sm:text-sm">
        <RefreshCcwIcon
          aria-hidden="true"
          className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
        />
        <div className="flex flex-col gap-1">
          <FieldLabel
            className="self-start font-normal leading-6 sm:leading-5"
            htmlFor={inputId}
          >
            Every week for <span className="sr-only">occurrences</span>
          </FieldLabel>
          <div className="flex items-center gap-2">
            <NumberField
              allowOutOfRange
              className="w-14"
              max={recurrence.occurrences}
              min={1}
              onValueChange={flow.setCountValue}
              size="sm"
              value={flow.countValue}
            >
              <NumberFieldGroup>
                <NumberFieldInput id={inputId} />
              </NumberFieldGroup>
            </NumberField>
            <span>occurrences</span>
          </div>
        </div>
      </div>
      <FieldError className="ps-6" match={!flow.countValid}>
        Please enter a number between 1 and {recurrence.occurrences}
      </FieldError>
    </Field>
  );
}

/** The design system's RecurrenceDates. */
function RecurrenceDates({ flow }: StepProps) {
  const time = flow.time;
  if (!time) {
    return null;
  }
  const dates = getDates(flow);
  const rest = dates.slice(shownDates);

  return (
    <div className="flex gap-2 sm:text-sm">
      <RefreshCcwIcon
        aria-hidden="true"
        className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
      />
      <div className="flex min-w-0 flex-col gap-1">
        {dates.slice(0, shownDates).map((date) => (
          <p key={date.toISOString()}>
            {formatOccurrence(date, time, flow.is24Hour)}
          </p>
        ))}
        {rest.length > 0 ? (
          <Popover>
            <PopoverTrigger
              className="w-fit decoration-current/32 decoration-dotted underline-offset-2 hover:text-foreground hover:underline"
              delay={0}
              openOnHover
            >
              + {rest.length} more
            </PopoverTrigger>
            <PopoverPopup
              align="start"
              aria-label="Additional occurrence dates"
              className="*:p-3"
              side="top"
            >
              <ul className="flex flex-col gap-1">
                {rest.map((date) => (
                  <li className="font-medium text-xs" key={date.toISOString()}>
                    {formatOccurrence(date, time, flow.is24Hour)}
                  </li>
                ))}
              </ul>
            </PopoverPopup>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}

/** The recurrence row: the count while picking, the dates after. */
function RecurrenceRow({ flow }: StepProps) {
  return flow.stage === "select" ? (
    <RecurrenceSelector flow={flow} />
  ) : (
    <RecurrenceDates flow={flow} />
  );
}

/**
 * The design system's seat availability row, during the booking step, when
 * at least one seat is taken. Exact counts only when the host shows them.
 */
function SeatRow({ flow }: StepProps) {
  if (flow.stage === "select" || !flow.date || !flow.time) {
    return null;
  }
  const remaining = flow.seatsRemaining(flow.date, flow.time);
  if (remaining >= seatsPerTimeSlot || remaining <= 0) {
    return null;
  }
  const badge = flow.showSeatCount ? undefined : getFillBadge(remaining);

  return (
    <div className="flex items-center gap-2 sm:text-sm">
      <UserIcon
        aria-hidden="true"
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
      />
      <span>
        {flow.showSeatCount
          ? `${remaining} / ${seatsPerTimeSlot} Seats available`
          : "Seats available"}
      </span>
      {badge ? (
        <Badge size="sm" variant={badge.variant}>
          {badge.label}
        </Badge>
      ) : null}
    </div>
  );
}

function EventPane({ flow }: StepProps) {
  const [timeZone, setTimeZone] = useState("Europe/Rome");
  const durationMinutes = flow.kind === "recurring" ? 30 : 60;

  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <HostIdentity name="Rick Astley" />
          <div className="flex flex-col gap-1">
            <EventTitle>{getTitle(flow.kind)}</EventTitle>
            <EventDescription
              description={
                flow.kind === "recurring"
                  ? "A regular check-in to keep your goals on track."
                  : "A small-group session, with time for questions."
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          {flow.stage !== "select" && flow.date && flow.time ? (
            <SelectedTime
              durationMinutes={durationMinutes}
              is24Hour={flow.is24Hour}
              locale="en-US"
              start={slotStart(flow.date, flow.time)}
            />
          ) : null}
          <FixedDuration label={labels.durationMinutes(durationMinutes)} />
          {flow.kind === "recurring" ? <RecurrenceRow flow={flow} /> : null}
          <LocationRow label="Cal Video" provider="cal-video" />
          {flow.stage === "select" ? (
            <TimezonePicker onValueChange={setTimeZone} value={timeZone} />
          ) : (
            <TimezoneDisplay value={timeZone} />
          )}
          {flow.kind === "seated" ? <SeatRow flow={flow} /> : null}
        </div>
      </div>
    </div>
  );
}

/** The Booker's select step, with seat availability on each seated time. */
function SelectStep({ flow }: StepProps) {
  const nextAvailableDate = getNextAvailableDate(
    flow.date && flow.date > today ? flow.date : today,
  );
  const date = flow.date;
  const seated = flow.kind === "seated" && date;

  return (
    <div className="flex w-full @3xl:flex-row flex-col">
      <BookerCalendarPane>
        <BookerCalendar locale="en-US" {...getCalendarProps(flow)} />
      </BookerCalendarPane>
      <TimePicker
        currentMonth={flow.month}
        is24Hour={flow.is24Hour}
        locale="en-US"
        onIs24HourChange={flow.setIs24Hour}
        onSelect={(start) => flow.pickTime(slotTime(start))}
        onViewFirstAvailability={
          nextAvailableDate
            ? () => {
                const first = nextAvailableDate;
                flow.setMonth(startOfMonth(first));
                flow.setDate(first);
              }
            : undefined
        }
        selectedDate={flow.date}
        slots={toSlots(date, getDaySlots(date)).map((slot) =>
          seated
            ? {
                ...slot,
                ...getSlotDetail(
                  flow.seatsRemaining(date, slotTime(slot.start)),
                  flow.showSeatCount,
                ),
              }
            : slot,
        )}
      />
    </div>
  );
}

/** What the fallback shows in place of the calendar. */
function FallbackStep() {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-4`}>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold font-heading text-xl">
          Book this event on Cal.com
        </h2>
        <p className="text-muted-foreground sm:text-sm">
          This event has seats and repeats every week, which can’t be booked
          here.
        </p>
      </div>
      <Button
        className="self-start"
        render={
          // biome-ignore lint/a11y/useAnchorContent: Button renders the children
          <a href={bookingUrl} rel="noreferrer" target="_blank" />
        }
      >
        Book on Cal.com
        <ExternalLinkIcon aria-hidden="true" />
      </Button>
    </div>
  );
}

const createErrorCopy: Record<CreateError, (email: string) => string> = {
  alreadyIn: (email) =>
    `You already have a seat at this time. Your invitation went to ${email}.`,
  seatGone: () =>
    "The last seat at this time was just taken. Pick another time.",
};

/** The chosen form, unchanged. */
function FormStep({ flow }: StepProps) {
  const left = simpleFields.filter(
    (field) => field.required && isFieldEmpty(flow.values[field.slug]),
  ).length;

  return (
    <form
      className={`${narrowStepClassName} flex flex-col gap-4`}
      onSubmit={(event) => {
        event.preventDefault();
        if (left === 0) {
          flow.submit();
        }
      }}
    >
      {simpleFields.map((field) => (
        <FieldBlock
          field={field}
          key={field.slug}
          lockPrefilled={false}
          setValue={flow.setValue}
          showErrors={false}
          values={flow.values}
        />
      ))}
      <TermsNote />
      {flow.createError ? (
        <p
          className="flex gap-2 text-destructive-foreground sm:text-sm"
          role="alert"
        >
          <CircleAlertIcon aria-hidden="true" className="h-lh w-4 shrink-0" />
          {createErrorCopy[flow.createError](getEmail(flow))}
        </p>
      ) : null}
      <div className={barClassName}>
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {left === 0
            ? "Ready to confirm"
            : `${left} required ${left === 1 ? "field" : "fields"} left`}
        </span>
        <div className="flex gap-2">
          <Button onClick={flow.backToSelect} type="button" variant="ghost">
            Back
          </Button>
          <Button
            disabled={flow.createError === "seatGone"}
            loading={flow.busy}
            type="submit"
          >
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
}

/** A series: each occurrence with its own status, as the API returns them. */
function SeriesBooked({ flow }: StepProps) {
  const time = flow.time ?? "";

  return (
    <>
      <div className="flex flex-col gap-2">
        <CircleCheckIcon
          aria-hidden="true"
          className="size-6 text-success-foreground"
        />
        <h2 className="font-bold font-heading text-xl">You’re booked</h2>
        <p className="text-muted-foreground sm:text-sm">
          {flow.count === 1
            ? `A calendar invitation was sent to ${getEmail(flow)}.`
            : `${flow.count} occurrences, every week. Calendar invitations were sent to ${getEmail(flow)}.`}
        </p>
      </div>
      <ul className="flex flex-col divide-y rounded-lg border">
        {getDates(flow).map((date) => (
          <li
            className="flex items-center justify-between gap-2 px-3 py-2 tabular-nums sm:text-sm"
            key={date.toISOString()}
          >
            <span>{formatOccurrence(date, time, flow.is24Hour)}</span>
            <Badge variant="success">Booked</Badge>
          </li>
        ))}
      </ul>
    </>
  );
}

/** A seat: who else is coming, only when the host shows attendees. */
function SeatBooked({ flow }: StepProps) {
  const others =
    flow.date && flow.time ? getOtherAttendees(flow.date, flow.time) : [];

  return (
    <>
      <div className="flex flex-col gap-2">
        <CircleCheckIcon
          aria-hidden="true"
          className="size-6 text-success-foreground"
        />
        <h2 className="font-bold font-heading text-xl">Your seat is booked</h2>
        <p className="text-muted-foreground sm:text-sm">
          A calendar invitation was sent to {getEmail(flow)}.
        </p>
      </div>
      {flow.showAttendees && others.length > 0 ? (
        <div className="flex flex-col gap-1 sm:text-sm">
          <p className="font-medium">Also attending</p>
          <p className="text-muted-foreground">{others.join(", ")}</p>
        </div>
      ) : null}
    </>
  );
}

function BookedStep({ flow }: StepProps) {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      {flow.kind === "recurring" ? (
        <SeriesBooked flow={flow} />
      ) : (
        <SeatBooked flow={flow} />
      )}
    </div>
  );
}

/**
 * The series failed partway. The API returns only the error, so the Booker
 * cannot tell which occurrences were booked before it.
 */
function BrokenStep({ flow }: StepProps) {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <CircleAlertIcon
          aria-hidden="true"
          className="size-6 text-warning-foreground"
        />
        <h2 className="font-bold font-heading text-xl">
          Not every occurrence was booked
        </h2>
        <p className="text-muted-foreground sm:text-sm">
          Something went wrong partway through the series. The first occurrences
          may already be booked: check {getEmail(flow)} for invitations before
          you try again.
        </p>
      </div>
      <div className={`${barClassName} justify-end!`}>
        <Button onClick={flow.backToSelect} variant="outline">
          Pick another time
        </Button>
      </div>
    </div>
  );
}

export function SeriesBooker(props: StepProps) {
  const step = props.flow.kind === "fallback" ? "fallback" : props.flow.stage;

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <BookerSteps step={step}>
        {step === "fallback" ? <FallbackStep /> : null}
        {step === "select" ? <SelectStep {...props} /> : null}
        {step === "form" ? <FormStep {...props} /> : null}
        {step === "booked" ? <BookedStep {...props} /> : null}
        {step === "broken" ? <BrokenStep {...props} /> : null}
      </BookerSteps>
    </Card>
  );
}
