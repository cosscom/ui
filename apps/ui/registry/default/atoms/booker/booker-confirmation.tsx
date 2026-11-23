"use client";

// The screen after a booking, as decided in "The confirmation screen"
// (.scratch/booker/issues/09-confirmation-screen.md, variant A, in place):
// it replaces the form in the right pane while the event information stays
// on the left. Status, headline and one sentence; details the left pane
// doesn't show; add to calendar; then cancel and reschedule.
//
// Cancel and reschedule open Cal's own pages for the booking until the
// Booker's own flows ("Reschedule and cancel screens") are built.

import { CalendarPlusIcon, CircleCheckIcon, HourglassIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { bookerHeadingClassName } from "./booker-heading";
import { type BookerLabels, getBookerLabels } from "./booker-labels";

export type ConfirmedBooking = {
  uid: string;
  status: string;
  start: string;
  end: string;
  title: string;
  attendeeEmail: string;
  hostName: string;
  guests: string[];
  notes?: string;
  location?: string | null;
  meetingUrl?: string | null;
};

type ConfirmationLabels = Pick<
  BookerLabels,
  | "confirmedTitle"
  | "confirmedText"
  | "pendingTitle"
  | "pendingText"
  | "confirmationGuests"
  | "confirmationNotes"
  | "addToCalendar"
  | "cancelBooking"
  | "reschedule"
>;

const CAL_APP_URL = "https://app.cal.com";

function toCalendarStamp(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function getCalendarDetails(booking: ConfirmedBooking) {
  return [booking.meetingUrl, booking.notes].filter(Boolean).join("\n\n");
}

/** Built in the browser: the API's calendar-links endpoint needs credentials. */
function getGoogleUrl(booking: ConfirmedBooking) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${toCalendarStamp(booking.start)}/${toCalendarStamp(booking.end)}`,
    details: getCalendarDetails(booking),
    location: booking.meetingUrl ?? booking.location ?? "",
    text: booking.title,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function getOutlookUrl(booking: ConfirmedBooking) {
  const params = new URLSearchParams({
    body: getCalendarDetails(booking),
    enddt: new Date(booking.end).toISOString(),
    location: booking.meetingUrl ?? booking.location ?? "",
    path: "/calendar/action/compose",
    rru: "addevent",
    startdt: new Date(booking.start).toISOString(),
    subject: booking.title,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function getIcsUrl(booking: ConfirmedBooking) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//coss//Booker//EN",
    "BEGIN:VEVENT",
    `UID:${booking.uid}`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(booking.start)}`,
    `DTEND:${toCalendarStamp(booking.end)}`,
    `SUMMARY:${escapeIcsText(booking.title)}`,
    `DESCRIPTION:${escapeIcsText(getCalendarDetails(booking))}`,
    `LOCATION:${escapeIcsText(booking.meetingUrl ?? booking.location ?? "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function BookerConfirmation({
  booking,
  labels: labelOverrides,
}: {
  booking: ConfirmedBooking;
  labels?: Partial<ConfirmationLabels>;
}) {
  const labels: ConfirmationLabels = {
    ...getBookerLabels(),
    ...labelOverrides,
  };
  const pending = booking.status === "pending";
  const calendars = [
    { href: getGoogleUrl(booking), label: "Google" },
    { href: getOutlookUrl(booking), label: "Outlook" },
    {
      download: "booking.ics",
      href: getIcsUrl(booking),
      label: "Apple or other (.ics)",
    },
  ];

  return (
    <div className="flex min-h-64 flex-col gap-6">
      <div className="flex flex-col gap-2">
        {pending ? (
          <HourglassIcon
            aria-hidden="true"
            className="size-6 text-warning-foreground"
          />
        ) : (
          <CircleCheckIcon
            aria-hidden="true"
            className="size-6 text-success-foreground"
          />
        )}
        <h2 className={cn(bookerHeadingClassName, "text-xl")}>
          {pending ? labels.pendingTitle : labels.confirmedTitle}
        </h2>
        <p className="text-muted-foreground sm:text-sm">
          {pending
            ? labels.pendingText(booking.hostName, booking.attendeeEmail)
            : labels.confirmedText(booking.attendeeEmail)}
        </p>
      </div>

      {booking.guests.length > 0 || booking.notes ? (
        <dl className="flex flex-col gap-3 sm:text-sm">
          {booking.guests.length > 0 ? (
            <Row label={labels.confirmationGuests}>
              {booking.guests.join(", ")}
            </Row>
          ) : null}
          {booking.notes ? (
            <Row label={labels.confirmationNotes}>{booking.notes}</Row>
          ) : null}
        </dl>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="font-medium sm:text-sm">{labels.addToCalendar}</p>
        <div className="flex flex-wrap gap-2">
          {calendars.map((calendar) => (
            <Button
              key={calendar.label}
              render={
                // biome-ignore lint/a11y/useAnchorContent: Button renders the children
                <a
                  download={calendar.download}
                  href={calendar.href}
                  rel="noreferrer"
                  target={calendar.download ? undefined : "_blank"}
                />
              }
              size="sm"
              variant="outline"
            >
              <CalendarPlusIcon aria-hidden="true" />
              {calendar.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-2 border-t pt-4">
        <Button
          render={
            // biome-ignore lint/a11y/useAnchorContent: Button renders the children
            <a
              href={`${CAL_APP_URL}/booking/${booking.uid}?cancel=true`}
              rel="noreferrer"
              target="_blank"
            />
          }
          variant="ghost"
        >
          {labels.cancelBooking}
        </Button>
        <Button
          render={
            // biome-ignore lint/a11y/useAnchorContent: Button renders the children
            <a
              href={`${CAL_APP_URL}/reschedule/${booking.uid}`}
              rel="noreferrer"
              target="_blank"
            />
          }
          variant="outline"
        >
          {labels.reschedule}
        </Button>
      </div>
    </div>
  );
}
