"use server";

import { toBookingLocation } from "@/lib/booker/booking-location";
import {
  type BookerTarget,
  getCreateBookingParamsFromTarget,
  getDynamicContext,
  getOrgSlugFromTarget,
  getPublicEventBannerParamsFromTarget,
  getUserSlotParamsFromTarget,
  parseBookingUrlTarget,
} from "@/lib/booker/target";
import { buildBookingStartIso } from "@/lib/booker/utils";
import { createBooking } from "@/lib/cal-api/bookings";
import { CalApiError } from "@/lib/cal-api/client";
import {
  getDynamicEventType,
  getEventType,
  getEventTypeById,
  getTeamEventType,
  getTeamSlugEventType,
} from "@/lib/cal-api/event-types";
import { getPublicEventInfo } from "@/lib/cal-api/public-event";
import { getAvailableSlots } from "@/lib/cal-api/slots";
import type { Booking, EventType } from "@/lib/cal-api/types";

export type FetchRawBookerInput = {
  monthIso: string;
  timeZone: string;
  target: BookerTarget;
  monthsToFetch?: number;
  eventTypeId?: number;
  fetchMeta?: boolean;
  durationMinutes?: number;
};

type ResolvedEventType = {
  eventTypeId: number | null;
  eventTypeSlug: string | null;
  dynamic?: {
    orgId?: number;
    orgSlug?: string;
    usernames: string[];
  };
};

export type FetchRawBookerResult =
  | {
      ok: true;
      raw: {
        me: unknown;
        eventTypes: unknown;
        selectedEventType: unknown | null;
        bannerUrl: string;
        publicDisplayName: string;
        slots: unknown;
      };
      resolved: ResolvedEventType;
    }
  | {
      ok: false;
      error: string;
      errorCode?: string;
    };

function buildMePayload(target: BookerTarget, eventType: EventType): unknown {
  const owner = eventType.users?.[0] ?? eventType.hosts?.[0];
  const dynamicContext = getDynamicContext(target);
  const fallbackName =
    target.type === "user"
      ? target.username
      : dynamicContext
        ? dynamicContext.usernames.join(" + ")
        : (owner?.username ?? "Unknown user");

  return {
    data: {
      avatarUrl: owner?.avatarUrl,
      name: owner?.name ?? fallbackName,
      username: owner?.username ?? fallbackName,
    },
  };
}

function buildSlotRange(monthIso: string, monthsToFetch: number) {
  const monthDate = new Date(monthIso);
  const safeMonthDate = Number.isNaN(monthDate.getTime())
    ? new Date()
    : monthDate;
  const monthStart = new Date(
    Date.UTC(safeMonthDate.getFullYear(), safeMonthDate.getMonth(), 1),
  );
  const rangeEnd = new Date(
    Date.UTC(
      safeMonthDate.getFullYear(),
      safeMonthDate.getMonth() + monthsToFetch,
      0,
    ),
  );
  const now = new Date();
  const todayUtc = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const rangeStart = monthStart < todayUtc ? todayUtc : monthStart;

  return {
    end: rangeEnd.toISOString().slice(0, 10),
    start: rangeStart.toISOString().slice(0, 10),
  };
}

async function fetchSlotsForEventType(
  input: FetchRawBookerInput,
  resolved: ResolvedEventType,
): Promise<unknown> {
  const monthsToFetch = Math.max(1, Math.floor(input.monthsToFetch ?? 1));
  const { end, start } = buildSlotRange(input.monthIso, monthsToFetch);
  const duration = input.durationMinutes;
  const organizationSlug = getOrgSlugFromTarget(input.target);
  const userSlotParams = getUserSlotParamsFromTarget(input.target);

  if (resolved.dynamic) {
    return getAvailableSlots({
      duration,
      end,
      organizationSlug: resolved.dynamic.orgSlug,
      start,
      timeZone: input.timeZone,
      usernames: resolved.dynamic.usernames,
    });
  }

  // Org-hosted user events (e.g. i.cal.com/pasquale/15min) need organizationSlug
  // on the slots request; username + slug alone resolve a different availability.
  if (organizationSlug && userSlotParams) {
    return getAvailableSlots({
      duration,
      end,
      eventTypeSlug: userSlotParams.eventTypeSlug,
      organizationSlug,
      start,
      timeZone: input.timeZone,
      username: userSlotParams.username,
    });
  }

  if (resolved.eventTypeId != null) {
    return getAvailableSlots({
      duration,
      end,
      eventTypeId: resolved.eventTypeId,
      organizationSlug,
      start,
      timeZone: input.timeZone,
    });
  }

  const eventTypeSlug = resolved.eventTypeSlug;
  if (!eventTypeSlug) {
    throw new CalApiError(
      "Missing event type slug for slot lookup.",
      "MISSING_SLUG",
      400,
    );
  }

  return getAvailableSlots({
    duration,
    end,
    eventTypeSlug,
    organizationSlug,
    start,
    timeZone: input.timeZone,
    username: userSlotParams?.username,
  });
}

async function fetchPublicEventInfo(
  target: BookerTarget,
): Promise<{ bannerUrl: string; displayName: string }> {
  const params = getPublicEventBannerParamsFromTarget(target);
  if (!params) {
    return { bannerUrl: "", displayName: "" };
  }

  return getPublicEventInfo(params);
}

function getHeaderBannerUrl(
  target: BookerTarget,
  publicInfo: { bannerUrl: string },
): string {
  // Cal's public booker does not show the org/team banner for dynamic bookings.
  if (getDynamicContext(target)) {
    return "";
  }

  return publicInfo.bannerUrl;
}

async function resolveEventType(
  target: BookerTarget,
): Promise<EventType | null> {
  if (target.type === "dynamic") {
    return getDynamicEventType({
      orgId: target.orgId,
      orgSlug: target.orgSlug,
      usernames: target.usernames,
    });
  }

  if (target.type === "user") {
    return getEventType({
      eventSlug: target.eventSlug,
      orgId: target.orgId,
      username: target.username,
    });
  }

  if (target.type === "team") {
    return getTeamEventType({
      eventSlug: target.eventSlug,
      orgId: target.orgId,
      teamId: target.teamId,
    });
  }

  const parsed = parseBookingUrlTarget(target.bookingUrl, target.orgId);
  if (parsed.type === "dynamic") {
    return getDynamicEventType({
      orgId: parsed.orgId,
      orgSlug: parsed.orgSlug,
      usernames: parsed.usernames,
    });
  }

  if (parsed.type === "user") {
    return getEventType({
      eventSlug: parsed.eventSlug,
      orgId: parsed.orgId,
      orgSlug: parsed.orgSlug,
      username: parsed.username,
    });
  }

  return getTeamSlugEventType({
    eventSlug: parsed.eventSlug,
    orgId: parsed.orgId,
    orgSlug: parsed.orgSlug,
    teamSlug: parsed.teamSlug,
  });
}

function buildResolvedEventType(
  target: BookerTarget,
  selectedEventType: EventType,
): ResolvedEventType {
  const dynamic = getDynamicContext(target);
  if (dynamic) {
    return { dynamic, eventTypeId: null, eventTypeSlug: null };
  }

  return {
    eventTypeId: selectedEventType.id > 0 ? selectedEventType.id : null,
    eventTypeSlug: selectedEventType.slug,
  };
}

export async function fetchRawBookerDataAction(
  input: FetchRawBookerInput,
): Promise<FetchRawBookerResult> {
  try {
    if (input.eventTypeId != null) {
      const resolved: ResolvedEventType = {
        eventTypeId: input.eventTypeId,
        eventTypeSlug: null,
      };
      const slots = await fetchSlotsForEventType(input, resolved);

      if (!input.fetchMeta) {
        return {
          ok: true,
          raw: {
            bannerUrl: "",
            eventTypes: null,
            me: null,
            publicDisplayName: "",
            selectedEventType: null,
            slots,
          },
          resolved,
        };
      }

      const [selectedEventType, publicInfo] = await Promise.all([
        getEventTypeById(input.eventTypeId),
        fetchPublicEventInfo(input.target),
      ]);

      return {
        ok: true,
        raw: {
          bannerUrl: getHeaderBannerUrl(input.target, publicInfo),
          eventTypes: [selectedEventType],
          me: buildMePayload(input.target, selectedEventType),
          publicDisplayName: publicInfo.displayName,
          selectedEventType,
          slots,
        },
        resolved,
      };
    }

    const selectedEventType = await resolveEventType(input.target);

    if (!selectedEventType) {
      return {
        error: "No event type found for the provided target.",
        errorCode: "NOT_FOUND",
        ok: false,
      };
    }

    if (selectedEventType.hidden) {
      return {
        error:
          "This event type is currently unpublished and not accepting bookings.",
        errorCode: "UNPUBLISHED",
        ok: false,
      };
    }

    const resolved = buildResolvedEventType(input.target, selectedEventType);
    const [slots, publicInfo] = await Promise.all([
      fetchSlotsForEventType(input, resolved),
      fetchPublicEventInfo(input.target),
    ]);

    return {
      ok: true,
      raw: {
        bannerUrl: getHeaderBannerUrl(input.target, publicInfo),
        eventTypes: [selectedEventType],
        me: buildMePayload(input.target, selectedEventType),
        publicDisplayName: publicInfo.displayName,
        selectedEventType,
        slots,
      },
      resolved,
    };
  } catch (error) {
    if (error instanceof CalApiError) {
      return {
        error: error.message,
        errorCode: error.code,
        ok: false,
      };
    }
    return {
      error:
        error instanceof Error ? error.message : "Could not load booker data.",
      ok: false,
    };
  }
}

export type CreateBookingActionInput = {
  email: string;
  guests?: string[];
  lengthInMinutes?: number;
  locale?: string;
  locationProvider?: string;
  name: string;
  notes?: string;
  selectedDateKey: string;
  selectedTime: string;
  target: BookerTarget;
  timeZone: string;
};

export type CreateBookingActionResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string; errorCode?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCreateBookingInput(
  input: CreateBookingActionInput,
): CreateBookingActionResult | null {
  const name = input.name.trim();
  if (!name) {
    return {
      error: "Name is required.",
      errorCode: "INVALID_NAME",
      ok: false,
    };
  }

  const email = input.email.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    return {
      error: "A valid email address is required.",
      errorCode: "INVALID_EMAIL",
      ok: false,
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.selectedDateKey)) {
    return {
      error: "Invalid booking date.",
      errorCode: "INVALID_DATE",
      ok: false,
    };
  }

  if (!/^\d{2}:\d{2}$/.test(input.selectedTime)) {
    return {
      error: "Invalid booking time.",
      errorCode: "INVALID_TIME",
      ok: false,
    };
  }

  if (!input.timeZone.trim()) {
    return {
      error: "Timezone is required.",
      errorCode: "INVALID_TIMEZONE",
      ok: false,
    };
  }

  if (input.guests?.some((guest) => !EMAIL_PATTERN.test(guest.trim()))) {
    return {
      error: "All guest emails must be valid.",
      errorCode: "INVALID_GUEST_EMAIL",
      ok: false,
    };
  }

  return null;
}

function getEventTypeDurationOptions(eventType: EventType): number[] | null {
  const options = (
    eventType as EventType & { lengthInMinutesOptions?: number[] }
  ).lengthInMinutesOptions;
  if (!Array.isArray(options)) {
    return null;
  }

  const parsed = options.filter(
    (value): value is number => typeof value === "number" && value > 0,
  );
  return parsed.length > 1 ? parsed : null;
}

function resolveBookingLengthInMinutes(
  eventType: EventType,
  lengthInMinutes: number | undefined,
): CreateBookingActionResult | { lengthInMinutes?: number } {
  const durationOptions = getEventTypeDurationOptions(eventType);
  if (!durationOptions) {
    return {};
  }

  if (lengthInMinutes == null) {
    return {
      error: "Duration is required for this event type.",
      errorCode: "INVALID_DURATION",
      ok: false,
    };
  }

  if (!durationOptions.includes(lengthInMinutes)) {
    return {
      error: "The selected duration is not allowed for this event type.",
      errorCode: "INVALID_DURATION",
      ok: false,
    };
  }

  return { lengthInMinutes };
}

async function resolveBookableEventType(
  target: BookerTarget,
): Promise<CreateBookingActionResult | { eventType: EventType }> {
  const eventType = await resolveEventType(target);

  if (!eventType) {
    return {
      error: "No event type found for the provided target.",
      errorCode: "NOT_FOUND",
      ok: false,
    };
  }

  if (eventType.hidden) {
    return {
      error:
        "This event type is not currently published and is not accepting bookings.",
      errorCode: "UNPUBLISHED",
      ok: false,
    };
  }

  return { eventType };
}

export async function createBookingAction(
  input: CreateBookingActionInput,
): Promise<CreateBookingActionResult> {
  try {
    const validationError = validateCreateBookingInput(input);
    if (validationError) {
      return validationError;
    }

    const resolvedEvent = await resolveBookableEventType(input.target);
    if (!("eventType" in resolvedEvent)) {
      return resolvedEvent;
    }

    const { eventType } = resolvedEvent;

    if (eventType.disableGuests && input.guests?.length) {
      return {
        error: "Guests are not allowed for this event type.",
        errorCode: "GUESTS_DISABLED",
        ok: false,
      };
    }

    const lengthResult = resolveBookingLengthInMinutes(
      eventType,
      input.lengthInMinutes,
    );
    if ("ok" in lengthResult) {
      return lengthResult;
    }

    const start = buildBookingStartIso(
      input.selectedDateKey,
      input.selectedTime,
      input.timeZone,
    );
    const bookingFieldsResponses: Record<string, unknown> = {};

    if (input.notes?.trim()) {
      bookingFieldsResponses.notes = input.notes.trim();
    }

    if (input.locationProvider?.trim()) {
      bookingFieldsResponses.location = input.locationProvider.trim();
    }

    const targetParams = getCreateBookingParamsFromTarget(input.target, {
      eventTypeSlug: eventType.slug,
    });

    const body: Parameters<typeof createBooking>[0] = {
      attendee: {
        email: input.email.trim(),
        name: input.name.trim(),
        timeZone: input.timeZone,
        ...(input.locale ? { language: input.locale.split("-")[0] } : {}),
      },
      start,
      ...(input.guests?.length ? { guests: input.guests } : {}),
      ...(Object.keys(bookingFieldsResponses).length
        ? { bookingFieldsResponses }
        : {}),
      ...("lengthInMinutes" in lengthResult && lengthResult.lengthInMinutes
        ? { lengthInMinutes: lengthResult.lengthInMinutes }
        : {}),
    };

    if (eventType.id > 0) {
      body.eventTypeId = eventType.id;
    } else if (
      eventType.slug &&
      (targetParams.username || targetParams.teamSlug)
    ) {
      body.eventTypeSlug = eventType.slug;
      if (targetParams.username) {
        body.username = targetParams.username;
      }
      if (targetParams.teamSlug) {
        body.teamSlug = targetParams.teamSlug;
      }
      if (targetParams.organizationSlug) {
        body.organizationSlug = targetParams.organizationSlug;
      }
    } else {
      return {
        error: "Missing event type for booking.",
        errorCode: "MISSING_EVENT_TYPE",
        ok: false,
      };
    }

    if (input.locationProvider?.trim()) {
      body.location = toBookingLocation(input.locationProvider.trim());
    }

    const booking = await createBooking(body);
    return { ok: true, booking };
  } catch (error) {
    if (error instanceof CalApiError) {
      return {
        error: error.message,
        errorCode: error.code,
        ok: false,
      };
    }

    return {
      error:
        error instanceof Error ? error.message : "Could not create booking.",
      ok: false,
    };
  }
}
