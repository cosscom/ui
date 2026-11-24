"use client";

// PROTOTYPE ONLY. The chosen layout of the screen an attendee sees after
// booking. The two layouts that lost are on the prototype/booker-confirmation
// branch.

import { CalendarPlusIcon, CircleCheckIcon, HourglassIcon } from "lucide-react";
import type { ReactNode } from "react";
import { getBookerLabels } from "@/registry/default/booker/booker-labels";
import { EventDescription } from "@/registry/default/booker/event-description";
import {
  EventTitle,
  FixedDuration,
  HostIdentity,
  RequiresConfirmation,
  SelectedTime,
} from "@/registry/default/booker/event-meta";
import { LocationRow } from "@/registry/default/booker/location";
import { TimezoneDisplay } from "@/registry/default/booker/timezone-picker";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  calendars,
  getHeadline,
  getLocationText,
  type ProtoBooking,
} from "./fixtures";

const labels = getBookerLabels();

export type VariantProps = {
  booking: ProtoBooking;
  onAction: (action: string) => void;
};

const cardClassName =
  "@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]";
const sideClassName =
  "@3xl:w-(--booker-side) @3xl:border-e border-b @3xl:border-b-0";
const mainClassName =
  "@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4";

function StatusIcon({
  booking,
  className,
}: {
  booking: ProtoBooking;
  className?: string;
}) {
  return booking.status === "pending" ? (
    <HourglassIcon
      aria-hidden="true"
      className={`text-warning-foreground ${className ?? ""}`}
    />
  ) : (
    <CircleCheckIcon
      aria-hidden="true"
      className={`text-success-foreground ${className ?? ""}`}
    />
  );
}

function WhenValue({ booking }: { booking: ProtoBooking }) {
  if (!booking.occurrences) {
    return (
      <span>
        {booking.date}
        <br />
        {booking.time}{" "}
        <span className="text-muted-foreground">({booking.timeZone})</span>
      </span>
    );
  }
  return (
    <ul className="flex flex-col gap-1">
      {booking.occurrences.map((occurrence) => (
        <li key={occurrence.date}>
          {occurrence.date}, {occurrence.time}
        </li>
      ))}
      <li className="text-muted-foreground">{booking.timeZone}</li>
    </ul>
  );
}

/** The event-details pane as it is during booking, unchanged. */
function EventPane({ booking }: { booking: ProtoBooking }) {
  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <HostIdentity name={booking.host} />
          <div className="flex flex-col gap-1">
            <EventTitle>{booking.title}</EventTitle>
            <EventDescription description={booking.description} />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          <SelectedTime
            durationMinutes={booking.durationMinutes}
            is24Hour={false}
            locale="en-US"
            start={booking.start}
          />
          {booking.status === "pending" ? (
            <RequiresConfirmation label="Requires confirmation" />
          ) : null}
          <FixedDuration
            label={labels.durationMinutes(booking.durationMinutes)}
          />
          <LocationRow
            label={getLocationText(booking.location)}
            provider={booking.location.kind === "video" ? "cal-video" : ""}
          />
          <TimezoneDisplay value={booking.timeZone} />
        </div>
      </div>
    </div>
  );
}

/**
 * In place. The left pane stays the event information; only the pane that
 * held the form changes, and now holds the result.
 */
export function VariantA({ booking, onAction }: VariantProps) {
  const headline = getHeadline(booking);

  return (
    <Card className={cardClassName}>
      <EventPane booking={booking} />
      <div className={`${mainClassName} flex flex-col gap-6`}>
        <div className="flex flex-col gap-2">
          <StatusIcon booking={booking} className="size-6" />
          <h2 className="font-bold font-heading text-xl">{headline.title}</h2>
          <p className="text-muted-foreground sm:text-sm">{headline.text}</p>
        </div>

        {booking.occurrences || booking.guests.length > 0 || booking.notes ? (
          <dl className="flex flex-col gap-3 sm:text-sm">
            {booking.occurrences ? (
              <Row label="When">
                <WhenValue booking={booking} />
              </Row>
            ) : null}
            {booking.guests.length > 0 ? (
              <Row label="Guests">{booking.guests.join(", ")}</Row>
            ) : null}
            {booking.notes ? <Row label="Notes">{booking.notes}</Row> : null}
          </dl>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="font-medium sm:text-sm">Add to calendar</p>
          <div className="flex flex-wrap gap-2">
            {calendars.map((calendar) => (
              <Button
                key={calendar}
                onClick={() => onAction(`add to calendar: ${calendar}`)}
                size="sm"
                variant="outline"
              >
                <CalendarPlusIcon aria-hidden="true" />
                {calendar}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex justify-end gap-2 border-t pt-4">
          <Button onClick={() => onAction("cancel")} variant="ghost">
            Cancel booking
          </Button>
          <Button onClick={() => onAction("reschedule")} variant="outline">
            Reschedule
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
