"use client";

// PROTOTYPE ONLY. The chosen layout of the screen an attendee sees after
// booking. The two layouts that lost are on the prototype/booker-confirmation
// branch.

import {
  CalendarIcon,
  CalendarPlusIcon,
  CircleCheckIcon,
  Clock3Icon,
  GlobeIcon,
  HourglassIcon,
  MapPinIcon,
  PhoneIcon,
  VideoIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  calendars,
  getHeadline,
  getLocationText,
  type ProtoBooking,
  type ProtoLocation,
} from "./fixtures";

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
const metaIconClassName = "h-lh w-4.5 shrink-0 opacity-80 sm:w-4";

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

function LocationIcon({
  location,
  className,
}: {
  location: ProtoLocation;
  className?: string;
}) {
  if (location.kind === "video") {
    return <VideoIcon aria-hidden="true" className={className} />;
  }
  if (location.kind === "address") {
    return <MapPinIcon aria-hidden="true" className={className} />;
  }
  return <PhoneIcon aria-hidden="true" className={className} />;
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
            <span>
              {booking.date} {booking.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3Icon aria-hidden="true" className={metaIconClassName} />
            <span>{booking.duration}</span>
          </div>
          <div className="flex gap-2">
            <LocationIcon
              className={metaIconClassName}
              location={booking.location}
            />
            <span>{getLocationText(booking.location)}</span>
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
