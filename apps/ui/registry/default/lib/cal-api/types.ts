export type ApiSuccess<T> = {
  status: "success";
  data: T;
};

export type ApiError = {
  status: "error";
  timestamp?: string;
  path?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type EventTypeLocation = {
  type: string;
  address?: string;
  link?: string;
  hostPhoneNumber?: string;
  displayLocationPublicly?: boolean;
};

export type EventTypeOwner = {
  id: number;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
  weekStart?: string;
  timeZone?: string;
};

export type EventTypeTeam = {
  id: number;
  slug: string;
  name: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
};

export type EventType = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  lengthInMinutes: number;
  locations: EventTypeLocation[];
  bookingFields?: BookingField[];
  disableGuests?: boolean;
  hidden?: boolean;
  requiresConfirmation?: boolean;
  isInstantEvent?: boolean;
  ownerId?: number;
  teamId?: number;
  team?: EventTypeTeam;
  users?: EventTypeOwner[];
  hosts?: EventTypeOwner[];
  metadata?: Record<string, unknown>;
};

export type BookingFieldType =
  | "name"
  | "email"
  | "phone"
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "boolean"
  | "url"
  | "address";

export type BookingField = {
  slug: string;
  type: BookingFieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disableOnPrefill?: boolean;
  hidden?: boolean;
  options?: Array<{ label: string; value: string }>;
};

export type Slot = {
  start: string;
  attendees?: number;
  bookingUid?: string;
};

export type AvailableSlots = Record<string, Slot[]>;

export type BookingAttendee = {
  name: string;
  email: string;
  timeZone: string;
  language?: string;
  phoneNumber?: string;
};

export type Booking = {
  uid: string;
  id: number;
  title: string;
  status: "accepted" | "pending" | "cancelled" | "rejected" | "awaiting_host";
  start: string;
  end: string;
  duration: number;
  eventTypeId: number;
  eventType?: { id: number; slug: string; title?: string };
  attendees: BookingAttendee[];
  hosts: Array<{ id: number; name: string; email: string; username?: string }>;
  meetingUrl?: string | null;
  location?: string;
  absentHost?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  rescheduledFromUid?: string;
};

export type BookingLocationInput =
  | { type: "integration"; integration: string }
  | { type: "address" }
  | { type: "link" }
  | { type: "phone" }
  | { type: "organizersDefaultApp" };

export type CreateBookingInput = {
  start: string;
  eventTypeId?: number;
  eventTypeSlug?: string;
  username?: string;
  teamSlug?: string;
  organizationSlug?: string;
  attendee: BookingAttendee;
  guests?: string[];
  bookingFieldsResponses?: Record<string, unknown>;
  location?: BookingLocationInput | string;
  metadata?: Record<string, unknown>;
  lengthInMinutes?: number;
};
