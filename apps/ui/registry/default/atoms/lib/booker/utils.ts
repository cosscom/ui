export type EventTypeLocationOption = {
  label: string;
  provider: string;
};

export type BookerAvatar = {
  name: string;
  avatarUrl: string;
  profileUrl: string;
};

export type BookerMeta = {
  hostName: string;
  hostAvatarUrl: string;
  hostAvatars: BookerAvatar[];
  eventTypeTitle: string;
  eventTypeDescription: string;
  eventTypeDurationMinutes: number | null;
  eventTypeDurationOptions: number[] | null;
  eventTypeLocations: EventTypeLocationOption[];
  eventTypeImageUrl: string;
  disableGuests: boolean;
  bookingWindowStart: Date | null;
  bookingWindowEnd: Date | null;
};

export type EventTypeInfo = {
  eventTypeTitle: string;
  eventTypeDescription: string;
  eventTypeDurationMinutes: number | null;
  eventTypeDurationOptions: number[] | null;
  eventTypeLocations: EventTypeLocationOption[];
  eventTypeImageUrl: string;
  disableGuests?: boolean;
};

export function prettifyLocation(value: string): string {
  const normalized = value.trim().toLowerCase();

  const known: Record<string, string> = {
    "cal-video": "Cal Video",
    "daily-video": "Daily Video",
    "google-meet": "Google Meet",
    "huddle01-video": "Huddle01",
    "microsoft-teams": "Microsoft Teams",
    conferencing: "Organizer's Default App",
    jitsi: "Jitsi Meet",
    inperson: "In person",
    organizersdefaultapp: "Organizer's Default App",
    phone: "Phone call",
    whereby: "Whereby",
    zoom: "Zoom",
  };

  const knownLocation = known[normalized];
  if (knownLocation) {
    return knownLocation;
  }

  return titleizeLocation(value);
}

function titleizeLocation(value: string): string {
  return value
    .replace(/[_:-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) =>
      /^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function normalizeAvatarUrl(value: unknown): string {
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
    return `https://app.cal.com${trimmed}`;
  }

  return trimmed;
}

export function extractHost(payload: unknown): {
  hostName: string;
  hostAvatarUrl: string;
} {
  if (!payload || typeof payload !== "object") {
    return { hostName: "Unknown user", hostAvatarUrl: "" };
  }

  const root = payload as Record<string, unknown>;
  const data = (root.data as Record<string, unknown> | undefined) ?? root;
  const profile =
    data.profile && typeof data.profile === "object"
      ? (data.profile as Record<string, unknown>)
      : undefined;

  const rawAvatar =
    data.avatarUrl ??
    data.avatar_url ??
    data.avatar ??
    profile?.avatarUrl ??
    profile?.avatar_url ??
    profile?.avatar;

  return {
    hostName: String(
      data.name ?? data.username ?? data.email ?? "Unknown user",
    ),
    hostAvatarUrl: normalizeAvatarUrl(rawAvatar),
  };
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getAvatarName(record: Record<string, unknown>): string {
  return String(
    record.name ?? record.username ?? record.email ?? "Unknown user",
  );
}

function getAvatarUrl(record: Record<string, unknown>): string {
  const profile = toRecord(record.profile);
  return normalizeAvatarUrl(
    record.avatarUrl ??
      record.avatar_url ??
      record.avatar ??
      record.image ??
      record.logoUrl ??
      profile?.avatarUrl ??
      profile?.avatar_url ??
      profile?.avatar ??
      profile?.image,
  );
}

function buildProfileUrl(
  username: string,
  orgSlug?: string,
  baseUrl?: string,
): string {
  const normalizedUsername = username.trim();
  if (!normalizedUsername) {
    return "";
  }

  const base =
    baseUrl && /^https?:\/\//i.test(baseUrl)
      ? baseUrl.replace(/\/$/, "")
      : orgSlug
        ? `https://${orgSlug}.cal.com`
        : "https://cal.com";

  return `${base}/${encodeURIComponent(normalizedUsername)}`;
}

function getUserAvatar(
  record: Record<string, unknown>,
  orgSlug?: string,
): BookerAvatar {
  const name = getAvatarName(record);
  const username = getStringValue(record.username);
  const bookerUrl = getStringValue(record.bookerUrl);

  return {
    avatarUrl: getAvatarUrl(record),
    name,
    profileUrl: username
      ? buildProfileUrl(username, orgSlug, bookerUrl ?? undefined)
      : "",
  };
}

function getTeamAvatar(
  record: Record<string, unknown>,
  orgSlug?: string,
): BookerAvatar | null {
  const team = toRecord(record.team) ?? toRecord(record.entity);
  const profile = toRecord(record.profile);
  const source = team ?? profile;
  if (!source) {
    return null;
  }

  const avatarUrl = getAvatarUrl(source);
  const name = String(source.name ?? source.slug ?? "");
  const slug = getStringValue(source.slug);
  if (!avatarUrl && !name) {
    return null;
  }

  return {
    avatarUrl,
    name: name || "Team",
    profileUrl: slug ? buildProfileUrl(slug, orgSlug) : "",
  };
}

function getBooleanValue(value: unknown): boolean {
  return value === true || value === "true";
}

function uniqueAvatars(avatars: BookerAvatar[]): BookerAvatar[] {
  const seen = new Set<string>();
  return avatars.filter((avatar) => {
    const key = `${avatar.name}:${avatar.avatarUrl}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function extractHostAvatars(
  eventTypePayload: unknown,
  hostPayload: unknown,
  options: { dynamic?: boolean; orgSlug?: string } = {},
): BookerAvatar[] {
  const eventType = toRecord(eventTypePayload);
  const host = extractHost(hostPayload);

  if (!eventType) {
    return host.hostName === "Unknown user" && !host.hostAvatarUrl
      ? []
      : [
          {
            avatarUrl: host.hostAvatarUrl,
            name: host.hostName,
            profileUrl: "",
          },
        ];
  }

  const schedulingType = String(eventType.schedulingType ?? "").toUpperCase();
  const metadata = toRecord(eventType.metadata);
  const roundRobinHideOrgAndTeam =
    getBooleanValue(eventType.roundRobinHideOrgAndTeam) ||
    getBooleanValue(metadata?.roundRobinHideOrgAndTeam);
  const hideOrgTeamAvatar =
    getBooleanValue(eventType.hideOrgTeamAvatar) ||
    getBooleanValue(metadata?.hideOrgTeamAvatar);
  const userRecords = [
    ...(Array.isArray(eventType.users) ? eventType.users : []),
    ...(Array.isArray(eventType.hosts) ? eventType.hosts : []),
  ]
    .map(toRecord)
    .filter((record): record is Record<string, unknown> => record != null);
  const userAvatars = userRecords.map((record) =>
    getUserAvatar(record, options.orgSlug),
  );
  const teamAvatar = getTeamAvatar(eventType, options.orgSlug);

  if (options.dynamic) {
    return uniqueAvatars(
      userAvatars.length > 0
        ? userAvatars
        : [
            {
              avatarUrl: host.hostAvatarUrl,
              name: host.hostName,
              profileUrl: "",
            },
          ],
    );
  }

  if (schedulingType === "ROUND_ROBIN") {
    if (roundRobinHideOrgAndTeam || hideOrgTeamAvatar) {
      return [];
    }

    return teamAvatar ? [teamAvatar] : [];
  }

  if (schedulingType === "COLLECTIVE") {
    const avatars = teamAvatar ? [teamAvatar, ...userAvatars] : userAvatars;
    return uniqueAvatars(avatars);
  }

  const firstUserAvatar = userAvatars[0];
  return uniqueAvatars(
    firstUserAvatar
      ? [firstUserAvatar]
      : [
          {
            avatarUrl: host.hostAvatarUrl,
            name: host.hostName,
            profileUrl: "",
          },
        ],
  );
}

export function extractHostDisplayName(
  eventTypePayload: unknown,
  hostPayload: unknown,
  options: { dynamic?: boolean } = {},
): string {
  const host = extractHost(hostPayload);
  const eventType = toRecord(eventTypePayload);
  if (!eventType) {
    return host.hostName;
  }

  const schedulingType = String(eventType.schedulingType ?? "").toUpperCase();
  const profile = toRecord(eventType.profile);
  const team = toRecord(eventType.team) ?? toRecord(eventType.entity);
  const profileName =
    getStringValue(profile?.name) ?? getStringValue(team?.name);
  const userNames = [
    ...(Array.isArray(eventType.users) ? eventType.users : []),
    ...(Array.isArray(eventType.hosts) ? eventType.hosts : []),
  ]
    .map(toRecord)
    .filter((record): record is Record<string, unknown> => record != null)
    .map(getAvatarName)
    .filter((name) => name !== "Unknown user");

  if (options.dynamic) {
    return (
      profileName ??
      (userNames.length > 0 ? userNames.join(", ") : host.hostName)
    );
  }

  if (schedulingType === "ROUND_ROBIN") {
    return profileName ?? host.hostName;
  }

  if (schedulingType === "COLLECTIVE") {
    const firstName = userNames[0];
    if (profileName && firstName && profileName !== firstName) {
      return profileName;
    }

    return userNames.length > 0 ? userNames.join(", ") : host.hostName;
  }

  return host.hostName;
}

function parseLocationOption(value: unknown): EventTypeLocationOption | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    return { label: prettifyLocation(trimmed), provider: "" };
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const loc = value as Record<string, unknown>;
  const integrationProvider = getIntegrationProvider(loc);
  const provider = integrationProvider || getStringValue(loc.type) || "";
  const rawText =
    getDisplayLocationText(loc.label, integrationProvider) ??
    getDisplayLocationText(loc.name, integrationProvider) ??
    (integrationProvider || null) ??
    getStringValue(loc.address) ??
    getStringValue(loc.location) ??
    getStringValue(loc.value) ??
    getStringValue(loc.type);

  if (!rawText) {
    return null;
  }

  return {
    label: prettifyLocation(rawText),
    provider,
  };
}

function extractLocations(
  record: Record<string, unknown>,
): EventTypeLocationOption[] {
  const locationsRaw = record.locations;
  if (Array.isArray(locationsRaw) && locationsRaw.length > 0) {
    const parsed = locationsRaw
      .map(parseLocationOption)
      .filter((item): item is EventTypeLocationOption => item != null);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (typeof record.location === "string" && record.location.trim()) {
    return [{ label: prettifyLocation(record.location), provider: "" }];
  }

  return [{ label: "Unknown", provider: "" }];
}

export function extractEventTypeInfo(payload: unknown): EventTypeInfo {
  if (!payload || typeof payload !== "object") {
    return {
      eventTypeTitle: "No event type found",
      eventTypeDescription: "",
      eventTypeDurationMinutes: null,
      eventTypeDurationOptions: null,
      eventTypeLocations: [{ label: "Unknown", provider: "" }],
      eventTypeImageUrl: "",
      disableGuests: false,
    };
  }

  const record = payload as Record<string, unknown>;
  const durationValue =
    record.lengthInMinutes ??
    record.duration ??
    record.length ??
    record.minutes;
  const duration =
    typeof durationValue === "number"
      ? durationValue
      : typeof durationValue === "string" &&
          Number.isFinite(Number(durationValue))
        ? Number(durationValue)
        : null;

  const durationOptions = extractDurationOptions(record);
  const eventTypeLocations = extractLocations(record);

  return {
    eventTypeTitle: String(
      record.title ?? record.name ?? record.slug ?? "No event type found",
    ),
    eventTypeDescription: String(record.description ?? ""),
    eventTypeDurationMinutes: duration,
    eventTypeDurationOptions:
      durationOptions.length > 1 ? durationOptions : null,
    eventTypeLocations,
    eventTypeImageUrl: normalizeAvatarUrl(
      record.imageUrl ??
        record.image_url ??
        record.image ??
        record.bannerUrl ??
        record.coverImage ??
        record.coverImageUrl,
    ),
    disableGuests: record.disableGuests === true,
  };
}

function getStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function getDisplayLocationText(
  value: unknown,
  integrationProvider: string,
): string | null {
  const text = getStringValue(value);
  if (!text) {
    return null;
  }

  const normalized = text.trim().toLowerCase();
  if (
    integrationProvider &&
    ["integration", "integrations"].includes(normalized)
  ) {
    return null;
  }

  return text;
}

function getIntegrationProvider(record: Record<string, unknown>): string {
  const rawType = getStringValue(record.type);
  const type = rawType?.trim().toLowerCase();
  const candidates = [
    record.value,
    record.integration,
    record.provider,
    record.app,
    record.appSlug,
    record.credentialType,
  ];
  for (const candidate of candidates) {
    const value = getStringValue(candidate);
    if (!value) {
      continue;
    }
    const normalized = value.trim().toLowerCase();
    if (
      ["integration", "integrations"].includes(type ?? "") &&
      !["integration", "integrations"].includes(normalized) &&
      /^[a-z0-9][a-z0-9:_-]*$/i.test(value)
    ) {
      return value;
    }
  }
  return "";
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return Number(value);
  }
  return null;
}

function normalizeDurationList(values: unknown[]): number[] {
  const minutes = values
    .map(toFiniteNumber)
    .filter((value): value is number => value != null && value > 0);

  return [...new Set(minutes)].sort((a, b) => a - b);
}

export function extractDurationOptions(payload: unknown): number[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const fromOptions = record.lengthInMinutesOptions;
  if (Array.isArray(fromOptions)) {
    const normalized = normalizeDurationList(fromOptions);
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const metadata = record.metadata;
  if (metadata && typeof metadata === "object") {
    const multipleDuration = (metadata as Record<string, unknown>)
      .multipleDuration;
    if (Array.isArray(multipleDuration)) {
      return normalizeDurationList(multipleDuration);
    }
  }

  return [];
}

function addCalendarDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let remaining = Math.max(0, days);
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining -= 1;
    }
  }
  return result;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Resolve the event type's booking window start date. For RANGE period types,
// this is the `periodStartDate`; otherwise bookings start from today.
export function extractBookingWindowStart(payload: unknown): Date | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const eventType = payload as Record<string, unknown>;
  const periodType =
    typeof eventType.periodType === "string"
      ? eventType.periodType.toUpperCase()
      : "";

  if (periodType === "RANGE") {
    const start = parseDate(eventType.periodStartDate);
    if (start) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Never return a start date in the past.
      return start > today ? start : null;
    }
  }

  return null;
}

export function extractBookingWindowEnd(payload: unknown): Date | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const eventType = payload as Record<string, unknown>;
  const periodType =
    typeof eventType.periodType === "string"
      ? eventType.periodType.toUpperCase()
      : "";

  if (periodType === "RANGE") {
    return parseDate(eventType.periodEndDate);
  }

  if (periodType === "ROLLING" || periodType === "ROLLING_WINDOW") {
    const days = toFiniteNumber(eventType.periodDays);
    if (days != null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventType.periodCountCalendarDays
        ? addCalendarDays(today, days)
        : addBusinessDays(today, days);
    }
  }

  return null;
}

export function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "NA";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function formatSelectedWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(date);
}

export function formatSelectedDay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
  }).format(date);
}

export function formatSelectedMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
  }).format(date);
}

export function formatConfirmDateDetail(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function parseTimeLabel(
  label: string,
): { hours: number; minutes: number } | null {
  const [hoursRaw, minutesRaw] = label.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return { hours, minutes };
}

function formatConfirmTimePart(
  date: Date,
  locale: string,
  hour12: boolean,
  includePeriod: boolean,
): string {
  if (!hour12) {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
    }).format(date);
  }

  const parts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).formatToParts(date);

  return parts
    .filter(
      (part) =>
        part.type === "hour" ||
        part.type === "minute" ||
        (includePeriod && part.type === "dayPeriod") ||
        (part.type === "literal" && part.value.trim() !== ""),
    )
    .map((part) =>
      part.type === "dayPeriod" ? part.value.toLowerCase() : part.value,
    )
    .join("")
    .trim();
}

export function formatConfirmTimeRange(
  startTime: string,
  durationMinutes: number,
  hour12: boolean,
  locale: string,
): string {
  const parsed = parseTimeLabel(startTime);
  if (!parsed) {
    return startTime;
  }

  const startDate = new Date();
  startDate.setHours(parsed.hours, parsed.minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

  if (!hour12) {
    return `${formatConfirmTimePart(startDate, locale, false, false)} – ${formatConfirmTimePart(endDate, locale, false, false)}`;
  }

  const startParts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).formatToParts(startDate);
  const endParts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).formatToParts(endDate);
  const startPeriod = startParts
    .find((part) => part.type === "dayPeriod")
    ?.value.toLowerCase();
  const endPeriod = endParts
    .find((part) => part.type === "dayPeriod")
    ?.value.toLowerCase();
  const samePeriod = startPeriod === endPeriod;

  return `${formatConfirmTimePart(startDate, locale, true, !samePeriod)} – ${formatConfirmTimePart(endDate, locale, true, true)}`;
}

export function toDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).format(date);
}

// Calendar grid dates are plain Y-M-D values (local Date components), not
// instants. Use this when looking up slots keyed by the API/booking timezone.
export function toCalendarDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildBookingStartIso(
  dateKey: string,
  selectedTime: string,
  timeZone: string,
): string {
  const parsed = parseTimeLabel(selectedTime);
  if (!parsed) {
    throw new Error("Invalid time slot.");
  }

  const dateParts = dateKey.split("-");
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error("Invalid booking date.");
  }

  const { hours, minutes } = parsed;
  const utcGuess = Date.UTC(year, month - 1, day, hours, minutes, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  });
  const parts = formatter.formatToParts(new Date(utcGuess));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  const offset = asUtc - utcGuess;

  return new Date(utcGuess - offset).toISOString();
}

export function getTodayInTimeZone(
  timeZone: string,
  now: Date = new Date(),
): Date {
  const [yearRaw, monthRaw, dayRaw] = toDateKey(now, timeZone).split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    const fallback = new Date(now);
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }
  return new Date(year, month - 1, day);
}

export function getMinimumNavigableMonth(
  timeZone: string,
  bookingWindowStart?: Date | null,
  now: Date = new Date(),
): Date {
  const todayInTz = getTodayInTimeZone(timeZone, now);
  const startBase =
    bookingWindowStart && bookingWindowStart > todayInTz
      ? bookingWindowStart
      : todayInTz;
  return new Date(startBase.getFullYear(), startBase.getMonth(), 1);
}

export function isCalendarMonthBefore(left: Date, right: Date): boolean {
  const leftMonth = new Date(left.getFullYear(), left.getMonth(), 1);
  const rightMonth = new Date(right.getFullYear(), right.getMonth(), 1);
  return leftMonth.getTime() < rightMonth.getTime();
}

function toTimeLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone,
  }).format(date);
}

// Whether a locale conventionally shows time in 24-hour form, used to seed the
// 12h/24h toggle (e.g. en-US → 12h, most of Europe → 24h). Falls back to 24h.
export function prefers24Hour(locale: string): boolean {
  try {
    const resolved = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
    }).resolvedOptions();
    if (typeof resolved.hour12 === "boolean") {
      return !resolved.hour12;
    }
    return resolved.hourCycle === "h23" || resolved.hourCycle === "h24";
  } catch {
    return true;
  }
}

// Slots are stored as 24h "HH:mm" strings (stable ids); reformat for display.
export function displayTimeLabel(label: string, hour12: boolean): string {
  if (!hour12) {
    return label;
  }
  const [hoursRaw, minutesRaw] = label.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return label;
  }
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  const parts = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).formatToParts(date);
  return parts
    .filter((part) => part.type !== "literal" || part.value.trim() !== "")
    .map((part) =>
      part.type === "dayPeriod" ? part.value.toLowerCase() : part.value,
    )
    .join("");
}

export function isSingleDigit12HourLabel(label: string): boolean {
  const hours = Number(label.split(":")[0]);
  if (Number.isNaN(hours)) {
    return false;
  }

  const normalizedHours = hours % 12 || 12;
  return normalizedHours < 10;
}

function parseSlotDate(value: unknown): Date | null {
  if (typeof value === "string") {
    if (/^\d{2}:\d{2}$/.test(value)) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const candidate =
    record.start ??
    record.startTime ??
    record.time ??
    record.dateTime ??
    record.date;

  return parseSlotDate(candidate);
}

export function extractSlotsByDate(
  payload: unknown,
  timeZone: string,
): Record<string, string[]> {
  const byDate = new Map<string, Set<string>>();
  const addSlot = (dateKey: string, time: string) => {
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, new Set<string>());
    }
    byDate.get(dateKey)?.add(time);
  };

  if (!payload || typeof payload !== "object") {
    return {};
  }

  const visitNode = (node: unknown) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        visitNode(item);
      }
      return;
    }

    const record = node as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Array.isArray(value)) {
        for (const slot of value) {
          if (typeof slot === "string" && /^\d{2}:\d{2}$/.test(slot)) {
            addSlot(key, slot);
            continue;
          }

          const parsed = parseSlotDate(slot);
          if (!parsed) {
            continue;
          }

          addSlot(toDateKey(parsed, timeZone), toTimeLabel(parsed, timeZone));
        }
      } else {
        visitNode(value);
      }
    }
  };

  visitNode(payload);

  const result: Record<string, string[]> = {};
  for (const [key, times] of byDate.entries()) {
    result[key] = Array.from(times).sort((a, b) => a.localeCompare(b));
  }

  return result;
}

// Event's minimum booking notice in minutes (cal.com `minimumBookingNotice`).
export function extractMinimumBookingNotice(payload: unknown): number {
  if (!payload || typeof payload !== "object") {
    return 0;
  }
  const minutes = toFiniteNumber(
    (payload as Record<string, unknown>).minimumBookingNotice,
  );
  return minutes != null && minutes > 0 ? minutes : 0;
}

// Drop slots that are no longer bookable: anything earlier than now plus the
// minimum booking notice, evaluated in the booking timezone. Future days are
// kept untouched; only the boundary day is partially filtered. Guards against
// showing already-passed times for today (and as the session ages).
export function filterBookableSlots(
  slotsByDate: Record<string, string[]>,
  timeZone: string,
  noticeMinutes: number,
  now: Date,
): Record<string, string[]> {
  const cutoff = new Date(now.getTime() + noticeMinutes * 60_000);
  const cutoffDateKey = toDateKey(cutoff, timeZone);
  const [cutoffHoursRaw, cutoffMinutesRaw] = toTimeLabel(
    cutoff,
    timeZone,
  ).split(":");
  const cutoffHours = Number(cutoffHoursRaw);
  const cutoffMinutes = Number(cutoffMinutesRaw);
  if (Number.isNaN(cutoffHours) || Number.isNaN(cutoffMinutes)) {
    return slotsByDate;
  }
  const cutoffOfDay = cutoffHours * 60 + cutoffMinutes;

  const result: Record<string, string[]> = {};
  for (const [dateKey, times] of Object.entries(slotsByDate)) {
    if (dateKey < cutoffDateKey) {
      continue;
    }
    if (dateKey > cutoffDateKey) {
      result[dateKey] = times;
      continue;
    }
    const kept = times.filter((time) => {
      const [hoursRaw, minutesRaw] = time.split(":");
      const hours = Number(hoursRaw);
      const minutes = Number(minutesRaw);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return false;
      }
      return hours * 60 + minutes >= cutoffOfDay;
    });
    if (kept.length > 0) {
      result[dateKey] = kept;
    }
  }
  return result;
}

export function findFirstAvailableDate(
  month: Date,
  slotsByDate: Record<string, string[]>,
  _timeZone: string,
  todayStart: Date,
): Date | null {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayKey = toCalendarDateKey(todayStart);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const key = toCalendarDateKey(date);
    if (key < todayKey) {
      continue;
    }

    if ((slotsByDate[key] ?? []).length > 0) {
      return date;
    }
  }

  return null;
}

// --- Calendar grid (mirrors booker-calendar.tsx) ---

export function getWeekStartsOn(locale: string): number {
  try {
    const localeObj = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay?: number };
      getWeekInfo?: () => { firstDay?: number };
    };
    const info =
      typeof localeObj.getWeekInfo === "function"
        ? localeObj.getWeekInfo()
        : localeObj.weekInfo;
    const firstDay = info?.firstDay;
    if (typeof firstDay === "number") {
      return firstDay % 7;
    }
  } catch {
    // Fall through to the Sunday default below.
  }
  return 0;
}

function calendarStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function calendarEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function calendarAddDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function calendarStartOfWeek(date: Date, weekStartsOn = 0): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (day.getDay() - weekStartsOn + 7) % 7;
  return calendarAddDays(day, -diff);
}

function calendarEndOfWeek(date: Date, weekStartsOn = 0): Date {
  return calendarAddDays(calendarStartOfWeek(date, weekStartsOn), 6);
}

function isSameCalendarMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export type CalendarViewOptions = {
  weekStartsOn?: number;
  shiftWeeks?: boolean;
  startMonth?: Date;
  endMonth?: Date;
};

export function getVisibleCalendarDates(
  month: Date,
  today: Date,
  options: CalendarViewOptions = {},
): Date[] {
  const weekStartsOn = options.weekStartsOn ?? 0;
  const shiftWeeks = options.shiftWeeks ?? true;
  const firstMonth = calendarStartOfMonth(month);

  const naturalGridStart = calendarStartOfWeek(firstMonth, weekStartsOn);
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const todayRow = Math.floor(
    Math.round(
      (todayStart.getTime() - naturalGridStart.getTime()) / 86_400_000,
    ) / 7,
  );
  const expand =
    shiftWeeks && isSameCalendarMonth(firstMonth, today) && todayRow >= 3;
  const shiftRows = expand ? Math.max(0, todayRow - 3) : 0;

  const monthStart = calendarStartOfMonth(firstMonth);
  const offset = shiftRows * 7;
  const gridStart = calendarAddDays(
    calendarStartOfWeek(monthStart, weekStartsOn),
    offset,
  );
  const gridEnd = calendarAddDays(
    calendarEndOfWeek(calendarEndOfMonth(firstMonth), weekStartsOn),
    offset,
  );

  const dates: Date[] = [];
  for (
    let cursor = gridStart;
    cursor.getTime() <= gridEnd.getTime();
    cursor = calendarAddDays(cursor, 1)
  ) {
    dates.push(cursor);
  }

  if (expand) {
    while (dates.length < 42) {
      const lastDate = dates.at(-1);
      if (!lastDate) {
        break;
      }
      dates.push(calendarAddDays(lastDate, 1));
    }
  }

  const navStart = options.startMonth
    ? calendarStartOfMonth(options.startMonth)
    : undefined;
  const navEnd = options.endMonth
    ? calendarStartOfMonth(options.endMonth)
    : undefined;
  const monthEnd = calendarEndOfMonth(firstMonth);

  return dates.filter((date) => {
    if (navStart && date < navStart) {
      return false;
    }
    if (navEnd && date > calendarEndOfMonth(navEnd)) {
      return false;
    }
    if (date < monthStart) {
      return false;
    }
    if (!expand && date > monthEnd) {
      return false;
    }
    return true;
  });
}

export function findFirstAvailableInVisibleGrid(
  month: Date,
  slotsByDate: Record<string, string[]>,
  todayStart: Date,
  options: CalendarViewOptions = {},
): Date | null {
  const todayKey = toCalendarDateKey(todayStart);
  for (const date of getVisibleCalendarDates(month, todayStart, options)) {
    const key = toCalendarDateKey(date);
    if (key < todayKey) {
      continue;
    }
    if ((slotsByDate[key] ?? []).length > 0) {
      return date;
    }
  }
  return null;
}

export function hasAvailabilityInVisibleGrid(
  month: Date,
  slotsByDate: Record<string, string[]>,
  todayStart: Date,
  options: CalendarViewOptions = {},
): boolean {
  return (
    findFirstAvailableInVisibleGrid(month, slotsByDate, todayStart, options) !=
    null
  );
}

export function pickDefaultSelectedDate(
  currentMonth: Date,
  slotsByDate: Record<string, string[]>,
  _timeZone: string,
  todayStart: Date,
  viewOptions?: CalendarViewOptions,
): Date | null {
  if (viewOptions) {
    return findFirstAvailableInVisibleGrid(
      currentMonth,
      slotsByDate,
      todayStart,
      viewOptions,
    );
  }

  return findFirstAvailableDate(
    currentMonth,
    slotsByDate,
    _timeZone,
    todayStart,
  );
}

// Earliest loaded date (today or later) that still has open slots, used to
// offer a "jump to next availability" affordance from an empty month/day.
export function findNextAvailableDate(
  slotsByDate: Record<string, string[]>,
  _timeZone: string,
  todayStart: Date,
): Date | null {
  const todayKey = toCalendarDateKey(todayStart);
  let bestKey: string | null = null;
  for (const [key, times] of Object.entries(slotsByDate)) {
    if (times.length === 0 || key < todayKey) {
      continue;
    }
    if (bestKey === null || key < bestKey) {
      bestKey = key;
    }
  }

  if (!bestKey) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = bestKey.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }
  return new Date(year, month - 1, day);
}
