"use client";

// PROTOTYPE ONLY. Building blocks shared by the manage-booking variants. The
// reschedule path uses the Booker's own calendar and time list, unchanged.

import {
  CalendarIcon,
  CircleCheckIcon,
  CircleXIcon,
  Clock3Icon,
  GlobeIcon,
  HourglassIcon,
  VideoIcon,
} from "lucide-react";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { Button } from "@/registry/default/ui/button";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Label } from "@/registry/default/ui/label";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";
import { Textarea } from "@/registry/default/ui/textarea";
import {
  formatDate,
  getDaySlots,
  getNextAvailableDate,
  hasSlots,
  type ManageBooking,
  type Stage,
  startOfMonth,
  toDate,
  today,
} from "./fixtures";
import { displayTimeLabel } from "@/lib/booker/utils";

export type { Stage };

export type Scope = "this" | "following";

export type Flow = {
  stage: Stage;
  setStage: (stage: Stage) => void;
  month: Date;
  setMonth: (month: Date) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  setTime: (time: string | undefined) => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
  scope: Scope;
  setScope: (scope: Scope) => void;
  // What the API said when it refused, if it did.
  rescheduleError: string | undefined;
  cancelError: string | undefined;
  startReschedule: () => void;
  submitReschedule: () => void;
  submitCancel: () => void;
  startOver: () => void;
};

export type VariantProps = { booking: ManageBooking; flow: Flow };

// The same classes the Booker uses for its card and panes.
export const cardClassName =
  "@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]";
const sideClassName =
  "@3xl:w-(--booker-side) @3xl:shrink-0 @3xl:border-e border-b @3xl:border-b-0";
export const mainClassName =
  "@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4";
const metaIconClassName = "h-lh w-4.5 shrink-0 opacity-80 sm:w-4";

const labels = getBookerLabels();

export function canManage(booking: ManageBooking) {
  return booking.status !== "ended";
}

export function getNoun(booking: ManageBooking) {
  return booking.kind === "seat" ? "seat" : "booking";
}

function timeLabel(time: string, is24Hour: boolean) {
  return displayTimeLabel(time, !is24Hour);
}

/**
 * The event information, as during booking. From the moment rescheduling
 * starts, the former time is struck through; the new one appears below it
 * once picked.
 */
export function EventPane({ booking, flow }: VariantProps) {
  const original = toDate(booking.date);
  const isRescheduling =
    flow.stage === "rescheduling" ||
    flow.stage === "confirmingReschedule" ||
    flow.stage === "rescheduled";
  const hasNewTime =
    isRescheduling &&
    flow.stage !== "rescheduling" &&
    flow.date !== undefined &&
    flow.time !== undefined;
  const isStruck = isRescheduling || flow.stage === "cancelled";

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
            <h1 className="font-heading @3xl:@max-5xl:text-lg text-xl">
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
              <span
                className={
                  isStruck ? "text-muted-foreground line-through" : undefined
                }
              >
                {formatDate(original)} {timeLabel(booking.time, flow.is24Hour)}
              </span>
              {hasNewTime && flow.date && flow.time ? (
                <span>
                  {formatDate(flow.date)} {timeLabel(flow.time, flow.is24Hour)}
                </span>
              ) : null}
              {booking.seriesNote ? (
                <span className="text-muted-foreground">
                  {booking.seriesNote}
                </span>
              ) : null}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3Icon aria-hidden="true" className={metaIconClassName} />
            <span>{booking.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>{booking.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden="true" className={metaIconClassName} />
            <span>{booking.timeZone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The Booker's select step, unchanged: its own calendar and time list, in
 * the same layout. Picking a time moves on, as it does when booking.
 */
export function RescheduleSelect({ flow }: VariantProps) {
  const daySlots = getDaySlots(flow.date);
  const monthStart = startOfMonth(flow.month);
  const nextMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    1,
  );
  const nextAvailableDate = getNextAvailableDate(
    flow.date && flow.date > today ? flow.date : today,
  );
  const hasAvailabilityInView = Boolean(
    nextAvailableDate && nextAvailableDate < nextMonth,
  );
  const goToDate = (date: Date) => {
    flow.setMonth(startOfMonth(date));
    flow.setDate(date);
  };

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
        daySlots={daySlots}
        goToDate={goToDate}
        hasAvailabilityInView={hasAvailabilityInView}
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
        onSelectTime={(time) => {
          flow.setTime(time);
          flow.setStage("confirmingReschedule");
        }}
        selectedDate={flow.date}
      />
    </div>
  );
}

/**
 * The reschedule step's short confirm: no booking form, since the API reuses
 * the attendee's answers. The same pinned bar as the booking form.
 */
export function RescheduleConfirm({ flow }: VariantProps) {
  return (
    <div className={`${mainClassName} flex flex-col gap-4`}>
      <ReasonField flow={flow} label="Reason for rescheduling" />
      <ApiRefusal message={flow.rescheduleError} />
      <div className="sticky bottom-0 -mx-4 @5xl:-mx-6 mt-auto -mb-4 @5xl:-mb-6 flex items-center justify-end gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] @3xl:rounded-es-none border-t bg-card @5xl:px-6 px-4 py-3">
        <Button onClick={() => flow.setStage("rescheduling")} variant="ghost">
          Back
        </Button>
        <Button onClick={flow.submitReschedule}>Reschedule</Button>
      </div>
    </div>
  );
}

/** Icon, headline and one sentence for where the booking stands now. */
export function StatusHeadline({ booking, flow }: VariantProps) {
  const noun = getNoun(booking);
  let icon = (
    <CircleCheckIcon
      aria-hidden="true"
      className="size-6 text-success-foreground"
    />
  );
  let title = booking.kind === "seat" ? "Your seat is booked" : "You’re booked";
  let text = `A calendar invitation was sent to ${booking.attendeeEmail}.`;

  if (flow.stage === "cancelled") {
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
  } else if (
    booking.status === "pending" &&
    (flow.stage === "rescheduled" || flow.stage === "summary")
  ) {
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
  } else if (booking.status === "ended") {
    icon = (
      <CircleCheckIcon
        aria-hidden="true"
        className="size-6 text-muted-foreground"
      />
    );
    title = "This meeting has ended";
    text = `It can no longer be changed. You can book a new time with ${booking.host}.`;
  }

  return (
    <div className="flex flex-col gap-2">
      {icon}
      <h2 className="font-heading text-xl">{title}</h2>
      <p className="text-muted-foreground sm:text-sm">
        {text}
        {flow.stage === "summary" && canManage(booking)
          ? ` You can reschedule or cancel this ${noun} below.`
          : null}
      </p>
    </div>
  );
}

export function ReasonField({
  label,
  flow,
  error,
}: {
  label: string;
  flow: Flow;
  error?: string;
}) {
  return (
    <Field className="w-full" invalid={Boolean(error)} name="reason">
      <FieldLabel>
        {label}
        {error ? (
          <span aria-hidden="true" className="text-destructive-foreground">
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground">Optional</span>
        )}
      </FieldLabel>
      <Textarea
        onChange={(event) => flow.setReason(event.target.value)}
        rows={2}
        value={flow.reason}
      />
      {error ? <FieldError match>{error}</FieldError> : null}
    </Field>
  );
}

/** For one meeting of a series: just this one, or this and the rest. */
export function ScopeChoice({ booking, flow }: VariantProps) {
  if (booking.kind !== "occurrence") {
    return null;
  }
  return (
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
  );
}

export function ApiRefusal({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }
  return (
    <p className="text-destructive-foreground text-sm" role="alert">
      {message}
    </p>
  );
}
