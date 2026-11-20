"use client";

// PROTOTYPE ONLY. Three structurally different takes on the screen an
// attendee sees after booking.

import {
  CalendarIcon,
  CalendarPlusIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  Clock3Icon,
  GlobeIcon,
  HourglassIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCwIcon,
  VideoIcon,
  XIcon,
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

function LocationValue({ location }: { location: ProtoLocation }) {
  if (location.kind === "video") {
    return (
      <a
        className="underline underline-offset-4"
        href={location.link}
        rel="noreferrer"
        target="_blank"
      >
        {location.label}
      </a>
    );
  }
  return <span>{getLocationText(location)}</span>;
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
 * A. In place. The card keeps its shape: event details stay on the left, and
 * the pane that held the form now holds the result. The least movement.
 */
export function VariantA({ booking, onAction }: VariantProps) {
  const headline = getHeadline(booking);

  return (
    <Card className={cardClassName}>
      <EventPane booking={booking} />
      <div className={`${mainClassName} flex flex-col gap-6`}>
        <div className="flex flex-col gap-2">
          <StatusIcon booking={booking} className="size-6" />
          <h2 className="font-heading text-xl">{headline.title}</h2>
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

/**
 * B. Whole card. The two panes collapse into one narrow, centred card that is
 * only about the booking: status on top, a labelled summary, then actions as
 * quiet links. Closest to Cal's own success page.
 */
export function VariantB({ booking, onAction }: VariantProps) {
  const headline = getHeadline(booking);
  const rows: { label: string; value: ReactNode }[] = [
    { label: "What", value: booking.title },
    { label: "When", value: <WhenValue booking={booking} /> },
    {
      label: "Who",
      value: (
        <span>
          {booking.host} <span className="text-muted-foreground">(host)</span>
          <br />
          {booking.attendee.name}
          <br />
          <span className="text-muted-foreground">
            {booking.attendee.email}
          </span>
        </span>
      ),
    },
    { label: "Where", value: <LocationValue location={booking.location} /> },
  ];
  if (booking.guests.length > 0) {
    rows.push({ label: "Guests", value: booking.guests.join(", ") });
  }
  if (booking.notes) {
    rows.push({ label: "Notes", value: booking.notes });
  }

  return (
    <Card className="w-full max-w-md">
      <div className="flex flex-col items-center gap-2 p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <StatusIcon booking={booking} className="size-6" />
        </span>
        <h2 className="font-heading text-xl">{headline.title}</h2>
        <p className="text-muted-foreground sm:text-sm">{headline.text}</p>
      </div>
      <dl className="flex flex-col border-t sm:text-sm">
        {rows.map((row) => (
          <div
            className="grid grid-cols-[5rem_1fr] gap-3 border-b px-6 py-3"
            key={row.label}
          >
            <dt className="font-medium">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between gap-3 border-b px-6 py-3 sm:text-sm">
        <span className="font-medium">Add to calendar</span>
        <div className="flex gap-1">
          {calendars.map((calendar) => (
            <Button
              aria-label={`Add to ${calendar}`}
              key={calendar}
              onClick={() => onAction(`add to calendar: ${calendar}`)}
              size="sm"
              variant="outline"
            >
              {calendar.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>
      <p className="px-6 py-4 text-center text-muted-foreground sm:text-sm">
        Need to make a change?{" "}
        <button
          className="text-foreground underline underline-offset-4"
          onClick={() => onAction("reschedule")}
          type="button"
        >
          Reschedule
        </button>{" "}
        or{" "}
        <button
          className="text-foreground underline underline-offset-4"
          onClick={() => onAction("cancel")}
          type="button"
        >
          cancel
        </button>
      </p>
    </Card>
  );
}

/**
 * C. Summary and next steps. The left pane becomes the booking itself, and
 * the right pane is a list of what the attendee can do now. Actions first.
 */
export function VariantC({ booking, onAction }: VariantProps) {
  const headline = getHeadline(booking);
  const actions = [
    {
      description: calendars.join(", "),
      icon: CalendarPlusIcon,
      key: "add to calendar",
      title: "Add to calendar",
    },
    {
      description: "Pick another time for this meeting",
      icon: RefreshCwIcon,
      key: "reschedule",
      title: "Reschedule",
    },
    {
      description: "Let the host know you can’t make it",
      icon: XIcon,
      key: "cancel",
      title: "Cancel booking",
    },
    {
      description: `Another ${booking.title.toLowerCase()} with ${booking.host}`,
      icon: CalendarIcon,
      key: "book another",
      title: "Book another time",
    },
  ];

  return (
    <Card className={cardClassName}>
      <div className={sideClassName}>
        <div className="flex flex-col gap-5 @5xl:p-6 p-4">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-xs">
            <StatusIcon booking={booking} className="size-3.5" />
            {booking.status === "pending" ? "Awaiting host" : "Confirmed"}
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-heading @3xl:@max-5xl:text-lg text-xl">
              {booking.title}
            </h2>
            <p className="text-muted-foreground sm:text-sm">
              with {booking.host}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:text-sm">
            <div className="flex gap-2">
              <CalendarIcon aria-hidden="true" className={metaIconClassName} />
              <WhenValue booking={booking} />
            </div>
            <div className="flex gap-2">
              <LocationIcon
                className={metaIconClassName}
                location={booking.location}
              />
              <LocationValue location={booking.location} />
            </div>
            {booking.guests.length > 0 ? (
              <p className="text-muted-foreground">
                With {booking.guests.join(", ")}
              </p>
            ) : null}
            {booking.notes ? (
              <p className="text-muted-foreground">“{booking.notes}”</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${mainClassName} flex flex-col gap-4`}>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{headline.title}</h3>
          <p className="text-muted-foreground sm:text-sm">{headline.text}</p>
        </div>
        <ul className="flex flex-col divide-y rounded-lg border">
          {actions.map((action) => (
            <li key={action.key}>
              <button
                className="flex w-full items-center gap-3 px-3 py-3 text-start hover:bg-accent"
                onClick={() => onAction(action.key)}
                type="button"
              >
                <action.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 opacity-80"
                />
                <span className="flex flex-1 flex-col">
                  <span className="font-medium sm:text-sm">{action.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {action.description}
                  </span>
                </span>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 opacity-64"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
