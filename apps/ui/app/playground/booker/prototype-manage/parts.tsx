"use client";

// PROTOTYPE ONLY. Rescheduling and cancelling as steps of the booking flow.
// The left pane is the Booker's event information; the right-hand side is one
// step at a time inside the Booker's own BookerSteps. The select
// step uses the Booker's real calendar and time list, unchanged.

import {
  CalendarIcon,
  CalendarPlusIcon,
  CircleCheckIcon,
  CircleXIcon,
  Clock3Icon,
  HourglassIcon,
  VideoIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { DurationPicker } from "@/registry/default/atoms/booker/duration-picker";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import {
  TimezoneDisplay,
  TimezonePicker,
} from "@/registry/default/atoms/booker/timezone-picker";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Label } from "@/registry/default/ui/label";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";
import { Textarea } from "@/registry/default/ui/textarea";
import {
  formatDate,
  getDaySlots,
  getNextAvailableDate,
  getStepKey,
  hasSlots,
  type ManageBooking,
  type Stage,
  startOfMonth,
  today,
} from "./fixtures";
import { displayTimeLabel } from "@/lib/booker/utils";

export type Slot = { date: Date; time: string; durationMinutes: number };

export type Scope = "this" | "following";

export type Flow = {
  stage: Stage;
  // The booking as it stands, and the time it had before a reschedule.
  current: Slot;
  former: Slot | undefined;
  // What is being picked during a reschedule.
  month: Date;
  setMonth: (month: Date) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  durationMinutes: number;
  setDurationMinutes: (minutes: number) => void;
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
  reasonError: string | undefined;
  scope: Scope;
  setScope: (scope: Scope) => void;
  // What the API said when it refused, if it did.
  rescheduleError: string | undefined;
  cancelError: string | undefined;
  startReschedule: () => void;
  pickTime: (time: string) => void;
  backToSelect: () => void;
  submitReschedule: () => void;
  startCancel: () => void;
  submitCancel: () => void;
  backToSummary: () => void;
  bookAgain: () => void;
};

export type StepProps = { booking: ManageBooking; flow: Flow };

// The same classes the Booker uses for its card and panes.
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

function isReschedulingStage(stage: Stage) {
  return stage === "rescheduling" || stage === "confirmingReschedule";
}

export function getNoun(booking: ManageBooking) {
  return booking.kind === "seat" ? "seat" : "booking";
}

function SlotLine({
  slot,
  is24Hour,
  struck,
}: {
  slot: Slot;
  is24Hour: boolean;
  struck?: boolean;
}) {
  return (
    <span className={struck ? "text-muted-foreground line-through" : undefined}>
      {formatDate(slot.date)} {displayTimeLabel(slot.time, !is24Hour)}
    </span>
  );
}

/**
 * The event information, as during booking. While rescheduling, the current
 * time is struck through and the duration and timezone pickers work, as they
 * do when booking. After a reschedule, the former time stays struck through
 * above the new one.
 */
function EventPane({ booking, flow }: StepProps) {
  const rescheduling = isReschedulingStage(flow.stage);
  const picked =
    flow.date && flow.time
      ? {
          date: flow.date,
          durationMinutes: flow.durationMinutes,
          time: flow.time,
        }
      : undefined;

  let timeLines: ReactNode;
  if (rescheduling) {
    timeLines = (
      <>
        <SlotLine is24Hour={flow.is24Hour} slot={flow.current} struck />
        {flow.stage === "confirmingReschedule" && picked ? (
          <SlotLine is24Hour={flow.is24Hour} slot={picked} />
        ) : null}
      </>
    );
  } else if (flow.former) {
    timeLines = (
      <>
        <SlotLine is24Hour={flow.is24Hour} slot={flow.former} struck />
        <SlotLine
          is24Hour={flow.is24Hour}
          slot={flow.current}
          struck={flow.stage === "cancelled"}
        />
      </>
    );
  } else {
    timeLines = (
      <SlotLine
        is24Hour={flow.is24Hour}
        slot={flow.current}
        struck={flow.stage === "cancelled"}
      />
    );
  }

  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted font-medium text-xs">
              {booking.hostInitials}
            </span>
            <p className="font-medium text-muted-foreground sm:text-sm">
              {booking.host}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold font-heading @3xl:@max-5xl:text-lg text-xl">
              {booking.title}
            </h1>
            <p className="text-muted-foreground sm:text-sm">
              {booking.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          <div className="flex gap-2">
            <CalendarIcon aria-hidden="true" className={metaIconClassName} />
            <span className="flex flex-col gap-1">
              {timeLines}
              {booking.seriesNote ? (
                <span className="text-muted-foreground">
                  {booking.seriesNote}
                </span>
              ) : null}
            </span>
          </div>
          {rescheduling && booking.durationOptions.length > 1 ? (
            <DurationPicker
              formatLabel={labels.durationMinutes}
              onValueChange={flow.setDurationMinutes}
              options={booking.durationOptions}
              value={flow.durationMinutes}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Clock3Icon aria-hidden="true" className={metaIconClassName} />
              <span>
                {labels.durationMinutes(flow.current.durationMinutes)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>{booking.location}</span>
          </div>
          {flow.stage === "rescheduling" ? (
            <TimezonePicker
              onValueChange={flow.setTimeZone}
              value={flow.timeZone}
            />
          ) : (
            <TimezoneDisplay value={flow.timeZone} />
          )}
        </div>
      </div>
    </div>
  );
}

/** Step 1 of a reschedule: the Booker's select step, unchanged. */
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

  return (
    <div className="flex w-full @3xl:flex-row flex-col">
      <div className="flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 flex-col items-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4">
        <BookerCalendar
          disabled={(date) => !hasSlots(date)}
          locale="en-US"
          month={flow.month}
          onMonthChange={flow.setMonth}
          onSelect={(date) => flow.setDate(date)}
          selected={flow.date}
          startMonth={startOfMonth(today)}
          today={today}
        />
      </div>
      <TimePicker
        availabilityLoading={false}
        currentMonth={flow.month}
        daySlots={getDaySlots(flow.date)}
        goToDate={(date) => {
          flow.setMonth(startOfMonth(date));
          flow.setDate(date);
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

/**
 * Step 2 of a reschedule: where the booking form would be, the host's
 * `rescheduleReason` field as they set it (label, required, hidden), and the
 * form's pinned bar.
 */
function ReasonStep({ booking, flow }: StepProps) {
  const field = booking.rescheduleReason;
  const left =
    !field.hidden && field.required && flow.reason.trim() === "" ? 1 : 0;

  return (
    <form
      className={`${narrowStepClassName} flex min-h-64 flex-col gap-4`}
      onSubmit={(event) => {
        event.preventDefault();
        flow.submitReschedule();
      }}
    >
      {field.hidden ? null : (
        <Field
          className="w-full"
          invalid={Boolean(flow.reasonError)}
          name="rescheduleReason"
        >
          <FieldLabel>
            {field.label}
            {field.required ? (
              <span aria-hidden="true" className="text-destructive-foreground">
                *
              </span>
            ) : null}
          </FieldLabel>
          <Textarea
            onChange={(event) => flow.setReason(event.target.value)}
            rows={3}
            value={flow.reason}
          />
          {flow.reasonError ? (
            <FieldError match>{flow.reasonError}</FieldError>
          ) : null}
        </Field>
      )}
      <ApiRefusal message={flow.rescheduleError} />
      <div className={barClassName}>
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {left === 0 ? "Ready to confirm" : "1 required field left"}
        </span>
        <div className="flex gap-2">
          <Button onClick={flow.backToSelect} type="button" variant="ghost">
            Back
          </Button>
          <Button type="submit">Reschedule</Button>
        </div>
      </div>
    </form>
  );
}

/** The cancel step: what is cancelled, an optional reason, and the bar. */
function CancelStep({ booking, flow }: StepProps) {
  const noun = getNoun(booking);

  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold font-heading text-xl">Cancel this {noun}?</h2>
        <p className="text-muted-foreground sm:text-sm">
          {booking.host} will be told.
        </p>
      </div>
      {booking.kind === "occurrence" ? (
        <RadioGroup
          aria-label="What to cancel"
          onValueChange={(next) =>
            flow.setScope(next === "following" ? "following" : "this")
          }
          value={flow.scope}
        >
          <Label className="font-normal">
            <Radio value="this" /> This meeting only
          </Label>
          <Label className="font-normal">
            <Radio value="following" /> This and all following meetings
          </Label>
        </RadioGroup>
      ) : null}
      <Field
        className="w-full"
        invalid={Boolean(flow.cancelError)}
        name="cancellationReason"
      >
        <FieldLabel>
          Reason for cancelling
          {flow.cancelError ? (
            <span aria-hidden="true" className="text-destructive-foreground">
              *
            </span>
          ) : (
            <span className="font-normal text-muted-foreground">Optional</span>
          )}
        </FieldLabel>
        <Textarea
          onChange={(event) => flow.setReason(event.target.value)}
          rows={3}
          value={flow.reason}
        />
        {flow.cancelError ? (
          <FieldError match>{flow.cancelError}</FieldError>
        ) : null}
      </Field>
      <div className={`${barClassName} justify-end!`}>
        <Button onClick={flow.backToSummary} variant="ghost">
          Keep {noun}
        </Button>
        <Button onClick={flow.submitCancel} variant="destructive">
          Cancel {noun}
        </Button>
      </div>
    </div>
  );
}

/** The confirmation screen: where the booking stands, and what can be done. */
function SummaryStep({ booking, flow }: StepProps) {
  const noun = getNoun(booking);
  const ended = booking.status === "ended";
  const cancelled = flow.stage === "cancelled";
  const pending = booking.status === "pending";

  let icon = (
    <CircleCheckIcon
      aria-hidden="true"
      className="size-6 text-success-foreground"
    />
  );
  let title = booking.kind === "seat" ? "Your seat is booked" : "You’re booked";
  let text = `A calendar invitation was sent to ${booking.attendeeEmail}.`;

  if (cancelled) {
    icon = (
      <CircleXIcon
        aria-hidden="true"
        className="size-6 text-muted-foreground"
      />
    );
    title = booking.kind === "seat" ? "Seat cancelled" : "Booking cancelled";
    text =
      flow.scope === "following" && booking.kind === "occurrence"
        ? `This meeting and all following ones are cancelled. ${booking.host} has been told.`
        : `${booking.host} has been told.`;
  } else if (ended) {
    icon = (
      <CircleCheckIcon
        aria-hidden="true"
        className="size-6 text-muted-foreground"
      />
    );
    title = "This meeting has ended";
    text = "It can no longer be changed.";
  } else if (pending) {
    icon = (
      <HourglassIcon
        aria-hidden="true"
        className="size-6 text-warning-foreground"
      />
    );
    title = "Waiting for confirmation";
    text =
      flow.stage === "rescheduled"
        ? `${booking.host} needs to confirm the new time. We’ll email ${booking.attendeeEmail} when they do.`
        : `${booking.host} needs to confirm this booking.`;
  } else if (flow.stage === "rescheduled") {
    title = "Rescheduled";
    text = `An updated invitation is on its way to ${booking.attendeeEmail}.`;
  }

  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-6`}>
      <div className="flex flex-col gap-2">
        {icon}
        <h2 className="font-bold font-heading text-xl">{title}</h2>
        <p className="text-muted-foreground sm:text-sm">{text}</p>
      </div>

      {cancelled || ended ? null : (
        <div className="flex flex-col gap-2">
          <p className="font-medium sm:text-sm">Add to calendar</p>
          <div className="flex flex-wrap gap-2">
            {["Google", "Outlook", "Apple or other (.ics)"].map((calendar) => (
              <Button key={calendar} size="sm" variant="outline">
                <CalendarPlusIcon aria-hidden="true" />
                {calendar}
              </Button>
            ))}
          </div>
        </div>
      )}

      {ended ? null : (
        <div className="mt-auto flex justify-end gap-2 border-t pt-4">
          {cancelled ? (
            <Button onClick={flow.bookAgain} variant="outline">
              Book again
            </Button>
          ) : (
            <>
              <Button onClick={flow.startCancel} variant="ghost">
                Cancel {noun}
              </Button>
              <Button onClick={flow.startReschedule} variant="outline">
                Reschedule
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ApiRefusal({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }
  return (
    <p className="text-destructive-foreground text-sm" role="alert">
      {message}
    </p>
  );
}

/** The whole Booker card: event pane, then one step through BookerSteps. */
export function ManageBooker(props: StepProps) {
  const step = getStepKey(props.flow.stage);

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <BookerSteps step={step}>
        {step === "select" ? <SelectStep {...props} /> : null}
        {step === "reason" ? <ReasonStep {...props} /> : null}
        {step === "cancel" ? <CancelStep {...props} /> : null}
        {step === "summary" ? <SummaryStep {...props} /> : null}
      </BookerSteps>
    </Card>
  );
}
