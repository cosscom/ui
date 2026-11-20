import "server-only";

import { calApi } from "./client";

const SLOTS_API_VERSION = "2024-09-04";

export async function getAvailableSlots(params: {
  start: string;
  end: string;
  timeZone: string;
  username?: string;
  usernames?: string[];
  eventTypeSlug?: string;
  eventTypeId?: number;
  organizationSlug?: string;
  duration?: number;
}): Promise<unknown> {
  const cacheIdentity =
    params.eventTypeId?.toString() ??
    params.usernames?.join(",") ??
    `${params.username}-${params.eventTypeSlug ?? "dynamic"}`;

  return calApi<unknown>("/slots", {
    apiVersion: SLOTS_API_VERSION,
    next: {
      revalidate: 60,
      tags: [
        "slots",
        cacheIdentity,
        params.duration?.toString() ?? "default",
        params.start,
      ],
    },
    query: {
      duration: params.duration,
      end: params.end,
      eventTypeId: params.eventTypeId,
      eventTypeSlug: params.eventTypeSlug,
      organizationSlug: params.organizationSlug,
      start: params.start,
      timeZone: params.timeZone,
      username: params.username,
      usernames: params.usernames?.join(","),
    },
  });
}
