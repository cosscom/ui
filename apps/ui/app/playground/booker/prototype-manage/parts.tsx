"use client";

// PROTOTYPE ONLY. Building blocks shared by the manage-booking variants: the
// event pane, the pickers and the reason field. The variants decide where
// these go.

import {
  CalendarIcon,
  CircleCheckIcon,
  CircleXIcon,
  Clock3Icon,
  GlobeIcon,
  HourglassIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { Calendar } from "@/registry/default/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Label } from "@/registry/default/ui/label";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";
import { Textarea } from "@/registry/default/ui/textarea";
import {
  formatDate,
  formatShortDate,
  getUpcomingDays,
  isSameDay,
  type ManageBooking,
  type Stage,
  slots,
  toDate,
  today,
} from "./fixtures";

export type { Stage };

export type Scope = "this" | "following";

export type Flow = {
  stage: Stage;
  setStage: (stage: Stage) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  setTime: (time: string | undefined) => void;
  reason: string;
  setReason: (reason: string) => void;
  scope: Scope;
  setScope: (scope: Scope) => void;
  // What the API said when it refused, if it did.
  rescheduleError: string | undefined;
  cancelError: string | undefined;
  submitReschedule: () => void;
  submitCancel: () => void;
  startOver: () => void;
};

export type VariantProps = { booking: ManageBooking; flow: Flow };

export const cardClassName =
  "@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]";
export const sideClassName =
  "@3xl:w-(--booker-side) @3xl:shrink-0 @3xl:border-e border-b @3xl:border-b-0";
export const mainClassName =
  "@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4";
const metaIconClassName = "h-lh w-4.5 shrink-0 opacity-80 sm:w-4";

export function canManage(booking: ManageBooking) {
  return booking.status !== "ended";
}

export function getNoun(booking: ManageBooking) {
  return booking.kind === "seat" ? "seat" : "booking";
}

/**
 * The event information, unchanged from booking. While a new time is being
 * picked, and after, the former time is struck through above the new one.
 */
export function EventPane({ booking, flow }: VariantProps) {
  const original = toDate(booking.date);
  const hasNewTime =
    flow.date !== undefined &&
    flow.time !== undefined &&
    (flow.stage === "rescheduling" || flow.stage === "rescheduled");
  const isCancelled = flow.stage === "cancelled";

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
                  hasNewTime || isCancelled
                    ? "text-muted-foreground line-through"
                    : undefined
                }
              >
                {formatDate(original)} {booking.time}
              </span>
              {hasNewTime && flow.date ? (
                <span>
                  {formatDate(flow.date)} {flow.time}
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

/** A month grid and the times for the chosen day, as in the booking flow. */
export function FullPicker({ booking, flow }: VariantProps) {
  const original = toDate(booking.date);

  return (
    <div className="flex @md:flex-row flex-col gap-4">
      <Calendar
        className="shrink-0"
        defaultMonth={original}
        disabled={[{ dayOfWeek: [0, 6] }, { before: today }]}
        mode="single"
        onSelect={(next) => {
          flow.setDate(next);
          flow.setTime(undefined);
        }}
        selected={flow.date}
      />
      <div className="flex min-w-36 flex-1 flex-col gap-2">
        <p className="font-medium sm:text-sm">
          {flow.date ? formatShortDate(flow.date) : "Pick a day"}
        </p>
        {flow.date ? (
          <SlotButtons booking={booking} className="flex-col" flow={flow} />
        ) : null}
      </div>
    </div>
  );
}

/** A strip of upcoming days and a wrap of times. No month grid. */
export function CompactPicker({ booking, flow }: VariantProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {getUpcomingDays(8).map((day) => (
          <Button
            className="shrink-0"
            key={day.toDateString()}
            onClick={() => {
              flow.setDate(day);
              flow.setTime(undefined);
            }}
            size="sm"
            type="button"
            variant={isSameDay(day, flow.date) ? "default" : "outline"}
          >
            {formatShortDate(day)}
          </Button>
        ))}
      </div>
      {flow.date ? (
        <SlotButtons booking={booking} className="flex-wrap" flow={flow} />
      ) : null}
    </div>
  );
}

function SlotButtons({
  booking,
  flow,
  className,
}: VariantProps & { className: string }) {
  const original = toDate(booking.date);

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {slots.map((slot) => {
        const isCurrent =
          isSameDay(flow.date, original) && slot === booking.time;
        return (
          <Button
            disabled={isCurrent}
            key={slot}
            onClick={() => flow.setTime(slot)}
            size="sm"
            type="button"
            variant={flow.time === slot ? "default" : "outline"}
          >
            {slot}
            {isCurrent ? " (current)" : null}
          </Button>
        );
      })}
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
