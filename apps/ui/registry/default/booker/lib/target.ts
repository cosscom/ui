export type DynamicTargetContext = {
  usernames: string[];
  orgId?: number;
  orgSlug?: string;
};

export type BookerTarget =
  | {
      type: "user";
      username: string;
      eventSlug: string;
      orgId?: number;
    }
  | {
      type: "team";
      teamId: number;
      eventSlug: string;
      orgId?: number;
    }
  | {
      type: "dynamic";
      usernames: string[];
      orgId?: number;
      orgSlug?: string;
    }
  | {
      type: "link";
      bookingUrl: string;
      orgId?: number;
    };

export type LegacyBookerTargetInput = {
  username?: string | string[];
  eventSlug?: string;
  isTeamEvent?: boolean;
  teamId?: number;
  bookingUrl?: string;
  orgId?: number;
};

export type ParsedLinkTarget =
  | {
      type: "user";
      username: string;
      eventSlug: string;
      orgId?: number;
      orgSlug?: string;
    }
  | {
      type: "dynamic";
      usernames: string[];
      orgId?: number;
      orgSlug?: string;
    }
  | {
      type: "teamSlug";
      teamSlug: string;
      eventSlug: string;
      orgId?: number;
      orgSlug?: string;
    };

const DYNAMIC_EVENT_SLUG = "dynamic";

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function toUrl(value: string): URL {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Pass a non-empty bookingUrl.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return new URL(trimmed);
  }

  return new URL(`https://${trimmed}`);
}

function parseOrgSlugFromHostname(hostname: string): string | undefined {
  const match = hostname.match(/^([a-z0-9-]+)\.cal\.com$/i);
  const subdomain = match?.[1]?.toLowerCase();

  if (!subdomain) {
    return undefined;
  }

  if (["api", "app", "cal", "www"].includes(subdomain)) {
    return undefined;
  }

  return subdomain;
}

function parseDynamicUsernames(
  pathUsername: string,
  userParam: string | null,
): string[] {
  const source = userParam ?? decodeURIComponent(pathUsername);
  return source
    .split(/[+,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getOrgSlugFromTarget(target: BookerTarget): string | undefined {
  if (target.type === "dynamic") {
    return target.orgSlug;
  }

  if (target.type === "link") {
    return parseBookingUrlTarget(target.bookingUrl, target.orgId).orgSlug;
  }

  return undefined;
}

export function getUserSlotParamsFromTarget(
  target: BookerTarget,
): { username: string; eventTypeSlug: string } | null {
  const params = getCreateBookingParamsFromTarget(target);
  if (!params.username || !params.eventTypeSlug) {
    return null;
  }

  return { eventTypeSlug: params.eventTypeSlug, username: params.username };
}

export type CreateBookingTargetParams = {
  eventTypeSlug?: string;
  organizationSlug?: string;
  teamSlug?: string;
  username?: string;
};

export function getCreateBookingParamsFromTarget(
  target: BookerTarget,
  resolved?: { eventTypeSlug?: string | null },
): CreateBookingTargetParams {
  if (target.type === "user") {
    return {
      eventTypeSlug: target.eventSlug,
      organizationSlug: getOrgSlugFromTarget(target),
      username: target.username,
    };
  }

  if (target.type === "team") {
    return {
      eventTypeSlug: target.eventSlug,
      organizationSlug: getOrgSlugFromTarget(target),
    };
  }

  if (target.type === "link") {
    const parsed = parseBookingUrlTarget(target.bookingUrl, target.orgId);
    if (parsed.type === "user") {
      return {
        eventTypeSlug: parsed.eventSlug,
        organizationSlug: parsed.orgSlug,
        username: parsed.username,
      };
    }

    if (parsed.type === "teamSlug") {
      return {
        eventTypeSlug: parsed.eventSlug,
        organizationSlug: parsed.orgSlug,
        teamSlug: parsed.teamSlug,
      };
    }
  }

  return {
    eventTypeSlug: resolved?.eventTypeSlug ?? undefined,
    organizationSlug: getOrgSlugFromTarget(target),
  };
}

export function getPublicEventBannerParamsFromTarget(target: BookerTarget): {
  username: string;
  eventSlug: string;
  orgSlug: string;
  isTeamEvent?: boolean;
} | null {
  if (target.type !== "link") {
    return null;
  }

  const parsed = parseBookingUrlTarget(target.bookingUrl, target.orgId);
  if (!parsed.orgSlug) {
    return null;
  }

  if (parsed.type === "user") {
    return {
      eventSlug: parsed.eventSlug,
      orgSlug: parsed.orgSlug,
      username: parsed.username,
    };
  }

  if (parsed.type === "teamSlug") {
    return {
      eventSlug: parsed.eventSlug,
      isTeamEvent: true,
      orgSlug: parsed.orgSlug,
      username: parsed.teamSlug,
    };
  }

  if (parsed.type === "dynamic") {
    return {
      eventSlug: "dynamic",
      orgSlug: parsed.orgSlug,
      username: parsed.usernames.join("+"),
    };
  }

  return null;
}

export function getDynamicContext(
  target: BookerTarget,
): DynamicTargetContext | null {
  if (target.type === "dynamic") {
    return {
      orgId: target.orgId,
      orgSlug: target.orgSlug,
      usernames: target.usernames,
    };
  }

  if (target.type === "link") {
    const parsed = parseBookingUrlTarget(target.bookingUrl, target.orgId);
    if (parsed.type === "dynamic") {
      return {
        orgId: parsed.orgId,
        orgSlug: parsed.orgSlug,
        usernames: parsed.usernames,
      };
    }
  }

  return null;
}

export function parseBookingUrlTarget(
  bookingUrl: string,
  fallbackOrgId?: number,
): ParsedLinkTarget {
  const url = toUrl(bookingUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const orgId =
    parsePositiveInt(url.searchParams.get("orgId")) ?? fallbackOrgId;
  const orgSlug = parseOrgSlugFromHostname(url.hostname);

  if (parts.length < 2) {
    throw new Error(
      "bookingUrl must include at least username/team and eventSlug.",
    );
  }

  if (parts[0] === "team" && parts.length >= 3) {
    return {
      eventSlug: decodeURIComponent(parts[2] ?? ""),
      orgId,
      orgSlug,
      teamSlug: decodeURIComponent(parts[1] ?? ""),
      type: "teamSlug",
    };
  }

  const eventSlug = decodeURIComponent(parts[1] ?? "");
  const pathUsername = decodeURIComponent(parts[0] ?? "");

  if (eventSlug === DYNAMIC_EVENT_SLUG) {
    const usernames = parseDynamicUsernames(
      pathUsername,
      url.searchParams.get("user"),
    );
    if (usernames.length >= 2) {
      return { orgId, orgSlug, type: "dynamic", usernames };
    }
  }

  return {
    eventSlug,
    orgId,
    orgSlug,
    type: "user",
    username: pathUsername,
  };
}

export function normalizeLegacyTarget(
  props: LegacyBookerTargetInput,
): BookerTarget {
  if (props.bookingUrl) {
    return { bookingUrl: props.bookingUrl, orgId: props.orgId, type: "link" };
  }

  if (props.isTeamEvent) {
    if (!props.teamId || !props.eventSlug) {
      throw new Error(
        "For team events, pass teamId and eventSlug in target or legacy props.",
      );
    }

    return {
      eventSlug: props.eventSlug,
      orgId: props.orgId,
      teamId: props.teamId,
      type: "team",
    };
  }

  const username = Array.isArray(props.username)
    ? props.username.join("+")
    : props.username;
  if (!username || !props.eventSlug) {
    throw new Error("Pass target or username + eventSlug.");
  }

  return {
    eventSlug: props.eventSlug,
    orgId: props.orgId,
    type: "user",
    username,
  };
}
