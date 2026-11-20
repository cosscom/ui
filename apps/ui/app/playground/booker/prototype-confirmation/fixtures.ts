// PROTOTYPE ONLY. Synthetic bookings, modelled on what Cal's API returns after
// a booking is created. No network.

export type ProtoLocation =
  | { kind: "video"; label: string; link: string }
  | { kind: "address"; label: string; address: string }
  | { kind: "phone"; label: string; phone: string };

export type ProtoOccurrence = { date: string; time: string };

export type ProtoBooking = {
  status: "accepted" | "pending";
  title: string;
  description: string;
  host: string;
  hostInitials: string;
  date: string;
  time: string;
  duration: string;
  timeZone: string;
  location: ProtoLocation;
  attendee: { name: string; email: string };
  guests: string[];
  notes?: string;
  // Set for a recurring series; `date` and `time` are then the first one.
  occurrences?: ProtoOccurrence[];
};

const base: ProtoBooking = {
  attendee: { email: "dana@example.com", name: "Dana Whitfield" },
  date: "Monday, November 23, 2026",
  description: "A walkthrough tailored to your team, with time for questions.",
  duration: "30 min",
  guests: [],
  host: "Rick Astley",
  hostInitials: "RA",
  location: {
    kind: "video",
    label: "Cal Video",
    link: "https://app.cal.com/video/abc123",
  },
  status: "accepted",
  time: "10:00 – 10:30am",
  timeZone: "Europe/Rome",
  title: "Product demo",
};

export const bookings = {
  accepted: base,
  inPerson: {
    ...base,
    guests: ["sam@example.com", "priya@example.com"],
    location: {
      address: "Via Torino 12, 20123 Milan",
      kind: "address",
      label: "In person",
    },
    notes: "We would like to see the routing features in particular.",
  },
  pending: { ...base, status: "pending" },
  recurring: {
    ...base,
    occurrences: [
      { date: "Monday, November 23, 2026", time: "10:00 – 10:30am" },
      { date: "Monday, November 30, 2026", time: "10:00 – 10:30am" },
      { date: "Monday, December 7, 2026", time: "10:00 – 10:30am" },
      { date: "Monday, December 14, 2026", time: "10:00 – 10:30am" },
    ],
  },
} satisfies Record<string, ProtoBooking>;

export const variants = [{ key: "A", label: "In place" }] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "accepted", label: "Confirmed" },
  { key: "pending", label: "Awaiting the host" },
  { key: "recurring", label: "Recurring series" },
  { key: "inPerson", label: "In person, guests, notes" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

export const calendars = ["Google", "Outlook", "Apple or other (.ics)"];

export function getHeadline(booking: ProtoBooking) {
  if (booking.status === "pending") {
    return {
      text: `${booking.host} needs to confirm this booking. We’ll email ${booking.attendee.email} when they do.`,
      title: "Waiting for confirmation",
    };
  }
  if (booking.occurrences) {
    return {
      text: `Calendar invitations are on their way to ${booking.attendee.email}.`,
      title: `${booking.occurrences.length} meetings booked`,
    };
  }
  return {
    text: `A calendar invitation is on its way to ${booking.attendee.email}.`,
    title: "You’re booked",
  };
}

export function getLocationText(location: ProtoLocation) {
  if (location.kind === "video") {
    return location.label;
  }
  if (location.kind === "address") {
    return location.address;
  }
  return location.phone;
}
