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
  CalendarIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  ExternalLinkIcon,
  GlobeIcon,
  RepeatIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { BookerAvatars } from "@/registry/default/atoms/booker/booker-avatars";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { Input } from "@/registry/default/ui/input";
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
  formatDate,
  getDaySlots,
  getNextAvailableDate,
  hasSlots,
  startOfMonth,
  today,
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
import { displayTimeLabel } from "@/lib/booker/utils";

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
  // Recurring: what is typed in the occurrence field, and what the booking
  // uses (the maximum while the entry is out of range).
  countInput: string;
  setCountInput: (value: string) => void;
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
const metaIconClassName = "h-lh w-4.5 shrink-0 opacity-80 sm:w-4";
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

/** A resolved date, as the design system writes it: "Tue, Sep 15, 10:00 am". */
function formatOccurrence(date: Date, time: string, is24Hour: boolean) {
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
  return `${day}, ${displayTimeLabel(time, !is24Hour)}`;
}

function getTitle(kind: Kind) {
  return kind === "recurring" ? "Weekly coaching" : "Group workshop";
}

/** The badge for a slot whose exact count is hidden. */
function FillBadge({ remaining }: { remaining: number }) {
  const fill = getFill(remaining);
  if (fill === "almostFull") {
    return (
      <Badge size="sm" variant="warning">
        Almost full
      </Badge>
    );
  }
  if (fill === "fillingFast") {
    return (
      <Badge size="sm" variant="secondary">
        Filling fast
      </Badge>
    );
  }
  return null;
}

/** The second line of a seated time slot. One mode for the whole list. */
function SlotSeats({
  remaining,
  showCount,
}: {
  remaining: number;
  showCount: boolean;
}) {
  let content: ReactNode = (
    <>
      Seats available
      <FillBadge remaining={remaining} />
    </>
  );
  if (remaining <= 0) {
    content = "No more seats available";
  } else if (showCount) {
    content =
      remaining === 1 ? "1 seat available" : `${remaining} seats available`;
  }
  return (
    <span className="flex items-center gap-1.5 font-normal text-muted-foreground text-xs">
      {content}
    </span>
  );
}

/** The occurrence field, inline in the recurrence sentence. */
function OccurrenceCount({ flow }: StepProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Every week for</span>
        <Input
          aria-invalid={!flow.countValid || undefined}
          aria-label="Number of occurrences"
          className="w-16"
          inputMode="numeric"
          max={recurrence.occurrences}
          min={1}
          nativeInput
          onChange={(event) => flow.setCountInput(event.target.value)}
          size="sm"
          type="number"
          value={flow.countInput}
        />
        <span>occurrences</span>
      </div>
      {flow.countValid ? null : (
        <p className="text-destructive-foreground text-xs" role="alert">
          Please enter a number between 1 and {recurrence.occurrences}
        </p>
      )}
    </div>
  );
}

/** The resolved dates, in place of the field once a time is picked. */
function ResolvedDates({ flow }: StepProps) {
  const time = flow.time;
  const dates = getDates(flow);
  if (!time) {
    return null;
  }
  const rest = dates.slice(shownDates);

  return (
    <div className="flex flex-col gap-1 tabular-nums">
      {dates.slice(0, shownDates).map((date) => (
        <span key={date.toISOString()}>
          {formatOccurrence(date, time, flow.is24Hour)}
        </span>
      ))}
      {rest.length > 0 ? (
        <Popover>
          <PopoverTrigger className="cursor-pointer self-start text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:underline">
            + {rest.length} more
          </PopoverTrigger>
          <PopoverPopup className="tabular-nums">
            <div className="flex flex-col gap-1 sm:text-sm">
              {rest.map((date) => (
                <span key={date.toISOString()}>
                  {formatOccurrence(date, time, flow.is24Hour)}
                </span>
              ))}
            </div>
          </PopoverPopup>
        </Popover>
      ) : null}
    </div>
  );
}

/** The recurrence row: the count while picking, the dates after. */
function RecurrenceRow({ flow }: StepProps) {
  return (
    <div className="flex gap-2">
      <RepeatIcon aria-hidden="true" className={metaIconClassName} />
      {flow.stage === "select" ? (
        <OccurrenceCount flow={flow} />
      ) : (
        <ResolvedDates flow={flow} />
      )}
    </div>
  );
}

/**
 * The seat row, during the booking step, when at least one seat is taken.
 * Exact counts only when the host shows them.
 */
function SeatRow({ flow }: StepProps) {
  if (flow.stage === "select" || !flow.date || !flow.time) {
    return null;
  }
  const remaining = flow.seatsRemaining(flow.date, flow.time);
  if (remaining >= seatsPerTimeSlot || remaining <= 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      <UsersIcon aria-hidden="true" className={metaIconClassName} />
      {flow.showSeatCount ? (
        <span>
          {remaining} / {seatsPerTimeSlot} Seats available
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          Seats available
          <FillBadge remaining={remaining} />
        </span>
      )}
    </div>
  );
}

function TimeLine({ flow }: StepProps) {
  if (flow.stage === "select" || !flow.date || !flow.time) {
    return null;
  }
  return (
    <div className="flex gap-2">
      <CalendarIcon aria-hidden="true" className={metaIconClassName} />
      <span>
        {formatDate(flow.date)} {displayTimeLabel(flow.time, !flow.is24Hour)}
      </span>
    </div>
  );
}

function EventPane({ flow }: StepProps) {
  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <BookerAvatars fallbackName="Rick Astley" />
            <p className="font-medium text-muted-foreground sm:text-sm">
              Rick Astley
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold font-heading @3xl:@max-5xl:text-lg text-xl">
              {getTitle(flow.kind)}
            </h1>
            <p className="text-muted-foreground sm:text-sm">
              {flow.kind === "recurring"
                ? "A regular check-in to keep your goals on track."
                : "A small-group session, with time for questions."}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          <TimeLine flow={flow} />
          <div className="flex items-center gap-2">
            <Clock3Icon aria-hidden="true" className={metaIconClassName} />
            <span>
              {labels.durationMinutes(flow.kind === "recurring" ? 30 : 60)}
            </span>
          </div>
          {flow.kind === "recurring" ? <RecurrenceRow flow={flow} /> : null}
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>Cal Video</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden="true" className={metaIconClassName} />
            <span>Europe/Rome</span>
          </div>
          {flow.kind === "seated" ? <SeatRow flow={flow} /> : null}
        </div>
      </div>
    </div>
  );
}

/** The Booker's select step, with seat availability on each seated time. */
function SelectStep({ flow }: StepProps) {
  const monthStart = startOfMonth(flow.month);
  const nextMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    1,
  );
  const nextAvailableDate = getNextAvailableDate(
    flow.date && flow.date > today ? flow.date : today,
  );
  const date = flow.date;
  const seated = flow.kind === "seated" && date;

  return (
    <div className="flex w-full @3xl:flex-row flex-col">
      <div className="flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 flex-col items-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4">
        <BookerCalendar
          disabled={(day) => !hasSlots(day)}
          locale="en-US"
          month={flow.month}
          onMonthChange={flow.setMonth}
          onSelect={(day) => flow.setDate(day)}
          selected={flow.date}
          startMonth={startOfMonth(today)}
          today={today}
        />
      </div>
      <TimePicker
        availabilityLoading={false}
        currentMonth={flow.month}
        daySlots={getDaySlots(date)}
        goToDate={(day) => {
          flow.setMonth(startOfMonth(day));
          flow.setDate(day);
        }}
        hasAvailabilityInView={Boolean(
          nextAvailableDate && nextAvailableDate < nextMonth,
        )}
        initialLoading={false}
        is24Hour={flow.is24Hour}
        isSlotDisabled={
          seated ? (time) => flow.seatsRemaining(date, time) <= 0 : undefined
        }
        labels={{
          hour12Short: labels.hour12Short,
          hour24Short: labels.hour24Short,
          noAvailableTimes: labels.noAvailableTimes,
          noSlotsAvailable: labels.noSlotsAvailable,
          noSlotsThisDay: labels.noSlotsThisDay,
          noSlotsThisMonth: labels.noSlotsThisMonth,
          use24Hour: labels.use24Hour,
          viewFirstAvailability: labels.viewFirstAvailability,
        }}
        locale="en-US"
        nextAvailableDate={nextAvailableDate}
        onIs24HourChange={flow.setIs24Hour}
        onSelectTime={flow.pickTime}
        renderSlotDetail={
          seated
            ? (time) => (
                <SlotSeats
                  remaining={flow.seatsRemaining(date, time)}
                  showCount={flow.showSeatCount}
                />
              )
            : undefined
        }
        selectedDate={flow.date}
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
