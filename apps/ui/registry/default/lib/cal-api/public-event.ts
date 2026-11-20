import "server-only";

const PUBLIC_EVENT_APP_URL =
  process.env.CAL_APP_URL ??
  process.env.NEXT_PUBLIC_CAL_APP_URL ??
  "https://app.cal.com";

function normalizeCalAppUrl(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${PUBLIC_EVENT_APP_URL}${trimmed}`;
  }

  return trimmed;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function str(value: unknown): string {
  return typeof value === "string" && value.trim() ? value : "";
}

function getPublicEventInfoFromPayload(payload: unknown): {
  bannerUrl: string;
  displayName: string;
} {
  const root = Array.isArray(payload) ? payload[0] : payload;
  const result = toRecord(root)?.result;
  const data = toRecord(toRecord(result)?.data);
  const json = toRecord(data?.json) ?? toRecord(root);

  if (!json) {
    return { bannerUrl: "", displayName: "" };
  }

  const displayName =
    str(toRecord(json.profile)?.name) ||
    str(toRecord(json.entity)?.name) ||
    str(toRecord(json.team)?.name) ||
    str(toRecord(json.organization)?.name);

  const directCandidates = [
    toRecord(json.organization)?.bannerUrl,
    toRecord(json.team)?.bannerUrl,
    toRecord(json.entity)?.bannerUrl,
  ];

  for (const candidate of directCandidates) {
    const normalized = normalizeCalAppUrl(candidate);
    if (normalized) {
      return { bannerUrl: normalized, displayName };
    }
  }

  const users = json.subsetOfUsers;
  if (Array.isArray(users)) {
    for (const user of users) {
      const organization = toRecord(toRecord(user)?.profile)?.organization;
      const normalized = normalizeCalAppUrl(toRecord(organization)?.bannerUrl);
      if (normalized) {
        return {
          bannerUrl: normalized,
          displayName: displayName || str(toRecord(organization)?.name),
        };
      }
    }
  }

  return { bannerUrl: "", displayName };
}

export async function getPublicEventInfo(params: {
  username: string;
  eventSlug: string;
  orgSlug: string;
  isTeamEvent?: boolean;
}): Promise<{ bannerUrl: string; displayName: string }> {
  const url = new URL("/api/trpc/public/event", PUBLIC_EVENT_APP_URL);
  url.searchParams.set("batch", "1");
  url.searchParams.set(
    "input",
    JSON.stringify({
      0: {
        json: {
          eventSlug: params.eventSlug,
          isTeamEvent: params.isTeamEvent ?? false,
          org: params.orgSlug,
          username: params.username,
        },
      },
    }),
  );

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: {
      revalidate: 60,
      tags: ["public-event", params.orgSlug, params.username, params.eventSlug],
    },
  });

  if (!response.ok) {
    return { bannerUrl: "", displayName: "" };
  }

  return getPublicEventInfoFromPayload(await response.json());
}
