import "server-only";

import { calApi } from "./client";
import type { EventType } from "./types";

const EVENT_TYPES_API_VERSION = "2024-06-14";

function findEventTypeBySlug(
  matches: EventType[],
  eventSlug: string,
): EventType | null {
  return matches.find((event) => event.slug === eventSlug) ?? null;
}

export async function listEventTypes(params: {
  username?: string;
  usernames?: string[];
  teamId?: number;
  teamSlug?: string;
  orgId?: number;
  orgSlug?: string;
  isTeamEvent?: boolean;
  eventSlug?: string;
}): Promise<EventType[]> {
  const cacheKey =
    params.teamId?.toString() ??
    params.teamSlug ??
    params.usernames?.join(",") ??
    params.username ??
    "all";

  return calApi<EventType[]>("/event-types", {
    apiVersion: EVENT_TYPES_API_VERSION,
    next: { revalidate: 60, tags: ["event-types", cacheKey] },
    query: {
      eventSlug: params.eventSlug,
      isTeamEvent: params.isTeamEvent,
      orgId: params.orgId,
      orgSlug: params.orgSlug,
      teamId: params.teamId,
      teamSlug: params.teamSlug,
      username: params.username,
      usernames: params.usernames?.join(","),
    },
  });
}

export async function getEventType(params: {
  username: string;
  eventSlug: string;
  orgId?: number;
  orgSlug?: string;
}): Promise<EventType | null> {
  const matches = await listEventTypes(params);
  return findEventTypeBySlug(matches, params.eventSlug);
}

export async function getTeamEventType(params: {
  teamId: number;
  eventSlug: string;
  orgId?: number;
}): Promise<EventType | null> {
  const matches = await listEventTypes({
    eventSlug: params.eventSlug,
    isTeamEvent: true,
    orgId: params.orgId,
    teamId: params.teamId,
  });
  return findEventTypeBySlug(matches, params.eventSlug);
}

export async function getTeamSlugEventType(params: {
  teamSlug: string;
  eventSlug: string;
  orgId?: number;
  orgSlug?: string;
}): Promise<EventType | null> {
  const matches = await listEventTypes({
    eventSlug: params.eventSlug,
    isTeamEvent: true,
    orgId: params.orgId,
    orgSlug: params.orgSlug,
    teamSlug: params.teamSlug,
  });
  return findEventTypeBySlug(matches, params.eventSlug);
}

export async function getDynamicEventType(params: {
  usernames: string[];
  orgId?: number;
  orgSlug?: string;
  eventSlug?: string;
}): Promise<EventType | null> {
  const eventSlug = params.eventSlug ?? "dynamic";
  const matches = await listEventTypes({
    eventSlug,
    orgId: params.orgId,
    orgSlug: params.orgSlug,
    usernames: params.usernames,
  });
  return findEventTypeBySlug(matches, eventSlug);
}

export async function getEventTypeById(
  eventTypeId: number,
): Promise<EventType> {
  return calApi<EventType>(`/event-types/${eventTypeId}`, {
    apiVersion: EVENT_TYPES_API_VERSION,
    next: { revalidate: 60, tags: [`event-type-${eventTypeId}`] },
  });
}
