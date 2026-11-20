import type { BookingLocationInput } from "@/lib/cal-api/types";

const BOOKING_INTEGRATION_MAP: Record<string, string> = {
  "daily-video": "daily-video",
  "google-meet": "google-meet",
  "huddle01-video": "huddle",
  "microsoft-teams": "office365-video",
  whereby: "whereby-video",
};

export function toBookingLocation(provider: string): BookingLocationInput {
  const normalized = provider.trim().toLowerCase();

  if (normalized === "inperson" || normalized === "in_person") {
    return { type: "address" };
  }

  if (normalized === "phone") {
    return { type: "phone" };
  }

  if (normalized === "conferencing" || normalized === "organizersdefaultapp") {
    return { type: "organizersDefaultApp" };
  }

  if (normalized === "link") {
    return { type: "link" };
  }

  const integration = BOOKING_INTEGRATION_MAP[normalized] ?? normalized;
  return { type: "integration", integration };
}
