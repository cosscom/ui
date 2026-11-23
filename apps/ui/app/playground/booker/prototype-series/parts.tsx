"use client";

// PROTOTYPE ONLY. Recurring and seated event types as routes through the
// Booker's steps: select → form → booked, or → broken when a series fails
// partway. Every change goes through BookerSteps. The select step is the
// Booker's real calendar and time list; the form is the chosen form.

import {
  CalendarIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  ExternalLinkIcon,
  GlobeIcon,
  RepeatIcon,
  VideoIcon,
} from "lucide-react";
import { BookerAvatars } from "@/registry/default/atoms/booker/booker-avatars";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
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
  getOtherAttendees,
  getSeatsRemaining,
  getSeriesDates,
  type Kind,
  recurrence,
  type Stage,
  type VariantKey,
} from "./fixtures";
import { displayTimeLabel } from "@/lib/booker/utils";

export type CreateError = "seatGone" | "alreadyIn";

export type Flow = {
  variant: VariantKey;
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
  // Recurring: how many meetings to book.
  count: number;
  setCount: (count: number) => void;
  // Seated: what the host chose to show, and the times already full.
  showSeatCount: boolean;
  showAttendees: boolean;
  isFull: (date: Date, time: string) => boolean;
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

const labels = getBookerLabels();

function getEmail(flow: Flow) {
  const email = flow.values.email;
  return typeof email === "string" ? email.trim() : "";
}

function getDates(flow: Flow) {
  return flow.date ? getSeriesDates(flow.date, flow.count) : [];
}

/** A short date for the lists of meetings, such as "Wed, Nov 25". */
function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
}

function seatsNote(left: number) {
  return left === 1 ? "1 seat left" : `${left} seats left`;
}

function getTitle(kind: Kind) {
  return kind === "recurring" ? "Weekly coaching" : "Group workshop";
}

/** How many meetings to book, from one up to the event type's limit. */
function MeetingCount({ flow }: StepProps) {
  return (
    <NumberField
      className="w-28"
      max={recurrence.occurrences}
      min={1}
      onValueChange={(value) => flow.setCount(value ?? 1)}
      size="sm"
      value={flow.count}
    >
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Number of meetings" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

/** The dates the series will book, computed the way the server does. */
function SeriesDates({ flow }: StepProps) {
  const dates = getDates(flow);
  if (!flow.time || dates.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col gap-1 tabular-nums sm:text-sm">
        {dates.map((date) => (
          <li key={date.toISOString()}>
            {formatShortDate(date)}{" "}
            {displayTimeLabel(flow.time ?? "", !flow.is24Hour)}
          </li>
        ))}
      </ol>
      <p className="text-muted-foreground text-xs">
        Only the first date is checked against the host’s calendar. The others
        are booked as listed.
      </p>
    </div>
  );
}

/**
 * The repeat line in the event pane. In A it holds the meeting count, and
 * the dates appear under it once a time is picked. In B it only says what
 * the host allows; the count is on the form.
 */
function RepeatLine({ flow }: StepProps) {
  const editable =
    flow.variant === "A" && (flow.stage === "select" || flow.stage === "form");
  const fixed = flow.stage === "booked";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <RepeatIcon aria-hidden="true" className={metaIconClassName} />
        {editable ? (
          <div className="flex flex-col items-start gap-2">
            <span>Every week, for</span>
            <div className="flex items-center gap-2">
              <MeetingCount flow={flow} />
              <span>{flow.count === 1 ? "meeting" : "meetings"}</span>
            </div>
          </div>
        ) : (
          <span>
            {fixed
              ? `Every week, ${flow.count} ${flow.count === 1 ? "meeting" : "meetings"}`
              : `Every week, up to ${recurrence.occurrences} meetings`}
          </span>
        )}
      </div>
      {flow.variant === "A" && flow.stage === "form" ? (
        <SeriesDates flow={flow} />
      ) : null}
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
          {flow.kind === "recurring" ? <RepeatLine flow={flow} /> : null}
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>Cal Video</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden="true" className={metaIconClassName} />
            <span>Europe/Rome</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The Booker's select step, unchanged, with seat counts when the host shows them. */
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
  const daySlots = date
    ? getDaySlots(date).filter((time) => !flow.isFull(date, time))
    : [];

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
        daySlots={daySlots}
        getSlotNote={
          flow.kind === "seated" && flow.showSeatCount && date
            ? (time) => seatsNote(getSeatsRemaining(date, time))
            : undefined
        }
        goToDate={(day) => {
          flow.setMonth(startOfMonth(day));
          flow.setDate(day);
        }}
        hasAvailabilityInView={Boolean(
          nextAvailableDate && nextAvailableDate < nextMonth,
        )}
        initialLoading={false}
        is24Hour={flow.is24Hour}
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

/** The chosen form. In B, a recurring event's meeting count is at the top. */
function FormStep({ flow }: StepProps) {
  const left = simpleFields.filter(
    (field) => field.required && isFieldEmpty(flow.values[field.slug]),
  ).length;
  const countHere = flow.kind === "recurring" && flow.variant === "B";

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
      {countHere ? (
        <div className="flex flex-col gap-3 border-b pb-4">
          <div className="flex flex-col gap-2">
            <p className="font-medium sm:text-sm">How many meetings?</p>
            <div className="flex items-center gap-2 sm:text-sm">
              <MeetingCount flow={flow} />
              <span className="text-muted-foreground">
                every week, up to {recurrence.occurrences}
              </span>
            </div>
          </div>
          <SeriesDates flow={flow} />
        </div>
      ) : null}
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

/** A series: each meeting with its own status, as the API returns them. */
function SeriesBooked({ flow }: StepProps) {
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
            : `${flow.count} meetings, every week. Calendar invitations were sent to ${getEmail(flow)}.`}
        </p>
      </div>
      <ul className="flex flex-col divide-y rounded-lg border">
        {getDates(flow).map((date) => (
          <li
            className="flex items-center justify-between gap-2 px-3 py-2 tabular-nums sm:text-sm"
            key={date.toISOString()}
          >
            <span>
              {formatShortDate(date)}{" "}
              {displayTimeLabel(flow.time ?? "", !flow.is24Hour)}
            </span>
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
 * cannot tell which meetings were booked before it.
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
          Not every meeting was booked
        </h2>
        <p className="text-muted-foreground sm:text-sm">
          Something went wrong partway through the series. The first meetings
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
