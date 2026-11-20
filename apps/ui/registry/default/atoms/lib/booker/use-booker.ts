"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type FetchRawBookerResult,
  fetchRawBookerDataAction,
} from "@/lib/booker/actions";
import {
  type BookerTarget,
  getDynamicContext,
  getOrgSlugFromTarget,
} from "@/lib/booker/target";
import {
  type BookerMeta,
  type CalendarViewOptions,
  extractBookingWindowEnd,
  extractBookingWindowStart,
  extractEventTypeInfo,
  extractHost,
  extractHostAvatars,
  extractHostDisplayName,
  extractMinimumBookingNotice,
  extractSlotsByDate,
  filterBookableSlots,
  findNextAvailableDate,
  getMinimumNavigableMonth,
  getTodayInTimeZone,
  getWeekStartsOn,
  hasAvailabilityInVisibleGrid,
  isCalendarMonthBefore,
  pickDefaultSelectedDate,
  prefers24Hour,
  toCalendarDateKey,
} from "@/lib/booker/utils";

const WINDOW_MONTHS = 3;

export type BookerErrorKind =
  | "not-found"
  | "unpublished"
  | "network"
  | "unknown";

export type BookerError = {
  kind: BookerErrorKind;
  message: string;
};

class BookerDataError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

type ResolvedEventType = Extract<
  FetchRawBookerResult,
  { ok: true }
>["resolved"];

export type BookerInitialData = {
  durationMinutes?: number;
  monthIso: string;
  monthsToFetch?: number;
  result: FetchRawBookerResult;
  timeZone: string;
};

type DerivedBookerData = {
  hasMultiDurationOptions: boolean;
  meta: BookerMeta | null;
  minimumBookingNotice: number;
  selectedDurationMinutes: number | null;
};

type HydratedBookerData = DerivedBookerData & {
  coveredMonthKeys: Set<string>;
  error: BookerError | null;
  resolved: ResolvedEventType;
  slotsByDate: Record<string, string[]>;
  slotsCacheKey: string;
};

function classifyError(caught: unknown): BookerError {
  const code = caught instanceof BookerDataError ? caught.code : "";
  const message =
    caught instanceof Error ? caught.message : "Could not load booker data.";

  if (code === "UNPUBLISHED") {
    return { kind: "unpublished", message };
  }
  if (code === "NOT_FOUND") {
    return { kind: "not-found", message };
  }
  if (
    code.startsWith("HTTP_4") ||
    code.startsWith("HTTP_5") ||
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("ETIMEDOUT") ||
    message.includes("ECONNREFUSED") ||
    /Cal\.com API [45]\d\d/.test(message)
  ) {
    return { kind: "network", message };
  }
  return { kind: "unknown", message };
}

function getTargetIdentity(target: BookerTarget): string {
  if (target.type === "user") {
    return `user:${target.username}:${target.eventSlug}:${target.orgId ?? ""}`;
  }
  if (target.type === "team") {
    return `team:${target.teamId}:${target.eventSlug}:${target.orgId ?? ""}`;
  }
  if (target.type === "dynamic") {
    return `dynamic:${target.usernames.join(",")}:${target.orgSlug ?? ""}:${target.orgId ?? ""}`;
  }
  return `link:${target.bookingUrl}`;
}

function getMonthCacheKey(
  identity: string,
  timeZone: string,
  durationMinutes: number,
  month: Date,
): string {
  return `${identity}|${timeZone}|${durationMinutes}|${month.getFullYear()}-${month.getMonth()}`;
}

function getSlotsCacheKey(
  identity: string,
  timeZone: string,
  durationMinutes: number,
): string {
  return `${identity}|${timeZone}|${durationMinutes}`;
}

function deriveBookerData(
  result: Extract<FetchRawBookerResult, { ok: true }>,
  target: BookerTarget,
): DerivedBookerData {
  if (!result.raw.me) {
    return {
      hasMultiDurationOptions: false,
      meta: null,
      minimumBookingNotice: 0,
      selectedDurationMinutes: null,
    };
  }

  const host = extractHost(result.raw.me);
  const isDynamic = Boolean(getDynamicContext(target));
  const hostAvatars = extractHostAvatars(
    result.raw.selectedEventType,
    result.raw.me,
    { dynamic: isDynamic, orgSlug: getOrgSlugFromTarget(target) },
  );
  const hostName = extractHostDisplayName(
    result.raw.selectedEventType,
    result.raw.me,
    { dynamic: isDynamic },
  );
  const eventType = extractEventTypeInfo(result.raw.selectedEventType);
  const minimumBookingNotice = extractMinimumBookingNotice(
    result.raw.selectedEventType,
  );
  const hasMultiDurationOptions =
    (eventType.eventTypeDurationOptions?.length ?? 0) > 1;
  const selectedDurationMinutes =
    eventType.eventTypeDurationOptions?.[0] ??
    eventType.eventTypeDurationMinutes ??
    null;

  return {
    hasMultiDurationOptions,
    meta: {
      bookingWindowEnd: extractBookingWindowEnd(result.raw.selectedEventType),
      bookingWindowStart: extractBookingWindowStart(
        result.raw.selectedEventType,
      ),
      eventTypeDescription: eventType.eventTypeDescription,
      eventTypeDurationMinutes: eventType.eventTypeDurationMinutes,
      eventTypeDurationOptions: eventType.eventTypeDurationOptions,
      eventTypeImageUrl: result.raw.bannerUrl || eventType.eventTypeImageUrl,
      eventTypeLocations: eventType.eventTypeLocations,
      eventTypeTitle: eventType.eventTypeTitle,
      disableGuests: eventType.disableGuests ?? false,
      hostAvatarUrl: host.hostAvatarUrl,
      hostAvatars,
      hostName:
        host.hostName === "Unknown user" && target.type === "user"
          ? target.username
          : result.raw.publicDisplayName || hostName,
    },
    minimumBookingNotice,
    selectedDurationMinutes,
  };
}

function hydrateBookerData({
  initialData,
  selectedTimeZone,
  target,
}: {
  initialData?: BookerInitialData;
  selectedTimeZone: string;
  target: BookerTarget;
}): HydratedBookerData | null {
  if (!initialData) {
    return null;
  }

  if (initialData.timeZone !== selectedTimeZone) {
    return null;
  }

  if (!initialData.result.ok) {
    const error = classifyError(
      new BookerDataError(
        initialData.result.error,
        initialData.result.errorCode ?? "UNKNOWN",
      ),
    );

    if (error.kind !== "not-found" && error.kind !== "unpublished") {
      return null;
    }

    return {
      coveredMonthKeys: new Set(),
      error,
      hasMultiDurationOptions: false,
      meta: null,
      minimumBookingNotice: 0,
      resolved: { eventTypeId: null, eventTypeSlug: null },
      selectedDurationMinutes: null,
      slotsByDate: {},
      slotsCacheKey: "",
    };
  }

  const derived = deriveBookerData(initialData.result, target);
  const durationMinutes =
    derived.selectedDurationMinutes ?? initialData.durationMinutes ?? 30;
  const identity = getTargetIdentity(target);
  const anchor = new Date(initialData.monthIso);
  const safeAnchor = Number.isNaN(anchor.getTime()) ? new Date() : anchor;
  const monthsToFetch = Math.max(
    1,
    Math.floor(initialData.monthsToFetch ?? WINDOW_MONTHS),
  );
  const coveredMonthKeys = new Set<string>();

  for (let offset = 0; offset < monthsToFetch; offset += 1) {
    coveredMonthKeys.add(
      getMonthCacheKey(
        identity,
        selectedTimeZone,
        durationMinutes,
        new Date(safeAnchor.getFullYear(), safeAnchor.getMonth() + offset, 1),
      ),
    );
  }

  const slotsByDate = filterBookableSlots(
    extractSlotsByDate(initialData.result.raw.slots, selectedTimeZone),
    selectedTimeZone,
    derived.minimumBookingNotice,
    new Date(),
  );

  return {
    ...derived,
    coveredMonthKeys,
    error: null,
    resolved: initialData.result.resolved,
    selectedDurationMinutes: durationMinutes,
    slotsByDate,
    slotsCacheKey: getSlotsCacheKey(
      identity,
      selectedTimeZone,
      durationMinutes,
    ),
  };
}

type UseBookerParams = {
  initialData?: BookerInitialData;
  target: BookerTarget;
  timezone?: string;
};

type BookerLoadingState = {
  availability: boolean;
  busy: boolean;
  initial: boolean;
};

type BookerTimezoneState = {
  onValueChange: (timeZone: string) => void;
  value: string;
};

type BookerDurationState = {
  onValueChange: (minutes: number) => void;
  value: number;
};

type BookerCalendarState = {
  availabilityLoading: boolean;
  disabled: (date: Date) => boolean;
  endMonth?: Date;
  initialLoading: boolean;
  locale: string;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (nextDate: Date | undefined) => void;
  selected: Date | undefined;
  startMonth: Date;
  today: Date;
};

type BookerTimePickerState = {
  availabilityLoading: boolean;
  currentMonth: Date;
  daySlots: string[];
  goToDate: (date: Date) => void;
  hasAvailabilityInView: boolean;
  initialLoading: boolean;
  is24Hour: boolean;
  locale: string;
  nextAvailableDate: Date | null;
  onIs24HourChange: (value: boolean) => void;
  onSelectTime: (time: string) => void;
  selectedDate: Date | undefined;
};

export type BookerStep = "select" | "confirm";

export type BookerConfirmFormContext = {
  disableGuests?: boolean;
  durationMinutes: number;
  includeLengthInMinutes: boolean;
  locale: string;
  locations?: BookerMeta["eventTypeLocations"];
  onBack: () => void;
  selectedDate?: Date;
  selectedTime: string | null;
  target: BookerTarget;
  timeZone: string;
};

export type UseBookerResult = {
  calendarProps: BookerCalendarState;
  confirmFormProps: BookerConfirmFormContext;
  durationProps: BookerDurationState;
  error: BookerError | null;
  loadingState: BookerLoadingState;
  meta: BookerMeta | null;
  retry: () => void;
  step: BookerStep;
  timePickerProps: BookerTimePickerState;
  timezoneProps: BookerTimezoneState;
};

// All booker data + interaction logic: fetching/windowing cal.com availability,
// derived selection state, and the handlers the UI wires to the calendar.
export function useBooker({
  initialData,
  target,
  timezone,
}: UseBookerParams): UseBookerResult {
  const [timeZone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [locale] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().locale || "en-US",
  );
  const initialSelectedTimeZone = initialData?.timeZone ?? timezone ?? timeZone;
  const hydratedData = useMemo(
    () =>
      hydrateBookerData({
        initialData,
        selectedTimeZone: initialSelectedTimeZone,
        target,
      }),
    [initialData, initialSelectedTimeZone, target],
  );
  const initialCurrentMonth = useMemo(() => {
    const initialMonth = initialData?.monthIso
      ? new Date(initialData.monthIso)
      : new Date();
    return Number.isNaN(initialMonth.getTime()) ? new Date() : initialMonth;
  }, [initialData?.monthIso]);
  const initialSelectedDate = useMemo(() => {
    if (!hydratedData || hydratedData.error) {
      return undefined;
    }

    return (
      pickDefaultSelectedDate(
        initialCurrentMonth,
        hydratedData.slotsByDate,
        initialSelectedTimeZone,
        getTodayInTimeZone(initialSelectedTimeZone),
        {
          endMonth: hydratedData.meta?.bookingWindowEnd ?? undefined,
          shiftWeeks: true,
          startMonth: getMinimumNavigableMonth(
            initialSelectedTimeZone,
            hydratedData.meta?.bookingWindowStart,
          ),
          weekStartsOn: getWeekStartsOn(locale),
        },
      ) ?? undefined
    );
  }, [hydratedData, initialCurrentMonth, initialSelectedTimeZone, locale]);
  const [meta, setMeta] = useState<BookerMeta | null>(
    hydratedData?.meta ?? null,
  );
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>(
    hydratedData?.slotsByDate ?? {},
  );
  const [error, setError] = useState<BookerError | null>(
    hydratedData?.error ?? null,
  );
  const [isPending, setIsPending] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialCurrentMonth);
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    initialSelectedTimeZone,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSelectedDate,
  );
  const [_selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<BookerStep>("select");
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(
    hydratedData?.selectedDurationMinutes ?? 30,
  );
  const [is24Hour, setIs24Hour] = useState(() => prefers24Hour(locale));
  const coveredMonthsRef = useRef<Set<string>>(
    hydratedData?.coveredMonthKeys ?? new Set(),
  );
  const resolvedRef = useRef<ResolvedEventType>(
    hydratedData?.resolved ?? { eventTypeId: null, eventTypeSlug: null },
  );
  const [_eventTypeId, setEventTypeId] = useState<number | null>(
    hydratedData?.resolved.eventTypeId ?? null,
  );
  const [_eventTypeSlug, setEventTypeSlug] = useState<string | null>(
    hydratedData?.resolved.eventTypeSlug ?? null,
  );
  const lastIdentityRef = useRef<string | null>(null);
  const lastTimeZoneRef = useRef<string | null>(null);
  const lastDurationRef = useRef<number | null>(null);
  const autoSelectedMonthRef = useRef<string | null>(
    initialSelectedDate
      ? `${initialCurrentMonth.getFullYear()}-${initialCurrentMonth.getMonth()}`
      : null,
  );
  const slotsByDateRef = useRef<Record<string, string[]>>(
    hydratedData?.slotsByDate ?? {},
  );
  const slotsCacheRef = useRef<Map<string, Record<string, string[]>>>(
    new Map(
      hydratedData?.slotsCacheKey
        ? [[hydratedData.slotsCacheKey, hydratedData.slotsByDate]]
        : [],
    ),
  );
  const minimumBookingNoticeRef = useRef(
    hydratedData?.minimumBookingNotice ?? 0,
  );
  const hasMultiDurationOptionsRef = useRef(
    hydratedData?.hasMultiDurationOptions ?? false,
  );
  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;
  const inFlightMonthsRef = useRef<Map<string, Promise<void>>>(new Map());
  const availabilityRequestVersionRef = useRef(0);
  const skipInitialWarmRef = useRef(
    Boolean(hydratedData && !hydratedData.error),
  );

  const targetIdentity = useCallback((): string => {
    return getTargetIdentity(target);
  }, [target]);

  const buildKey = useCallback(
    (month: Date) =>
      getMonthCacheKey(
        targetIdentity(),
        selectedTimeZone,
        selectedDurationMinutes,
        month,
      ),
    [selectedDurationMinutes, selectedTimeZone, targetIdentity],
  );

  const slotsCacheKey = useCallback(
    () =>
      getSlotsCacheKey(
        targetIdentity(),
        selectedTimeZone,
        selectedDurationMinutes,
      ),
    [selectedDurationMinutes, selectedTimeZone, targetIdentity],
  );

  const restoreSlotsFromCache = useCallback(() => {
    const cached = slotsCacheRef.current.get(slotsCacheKey()) ?? {};
    slotsByDateRef.current = cached;
    setSlotsByDate(cached);
  }, [slotsCacheKey]);

  useLayoutEffect(() => {
    restoreSlotsFromCache();
  }, [restoreSlotsFromCache]);

  // Fetch a window of several months in a single request, anchored at `anchor`.
  const fetchWindow = useCallback(
    async (anchor: Date): Promise<void> => {
      const anchorKey = buildKey(anchor);

      if (coveredMonthsRef.current.has(anchorKey)) {
        return;
      }

      const existingRequest = inFlightMonthsRef.current.get(anchorKey);
      if (existingRequest) {
        await existingRequest;
        return;
      }

      const requestVersion = availabilityRequestVersionRef.current;
      const windowMonthKeys = Array.from(
        { length: WINDOW_MONTHS },
        (_, offset) =>
          buildKey(
            new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1),
          ),
      );
      const request = (async () => {
        const durationMinutes =
          getDynamicContext(target) || hasMultiDurationOptionsRef.current
            ? selectedDurationMinutes
            : undefined;

        const result = await fetchRawBookerDataAction({
          durationMinutes,
          fetchMeta: resolvedRef.current.eventTypeId == null,
          monthIso: anchor.toISOString(),
          monthsToFetch: WINDOW_MONTHS,
          target,
          timeZone: selectedTimeZone,
          eventTypeId: resolvedRef.current.eventTypeId ?? undefined,
        });

        if (!result.ok) {
          throw new BookerDataError(
            result.error,
            result.errorCode ?? "UNKNOWN",
          );
        }

        if (availabilityRequestVersionRef.current !== requestVersion) {
          return;
        }

        resolvedRef.current = result.resolved;
        setEventTypeId(result.resolved.eventTypeId);
        setEventTypeSlug(result.resolved.eventTypeSlug);

        for (let offset = 0; offset < WINDOW_MONTHS; offset += 1) {
          const month = new Date(
            anchor.getFullYear(),
            anchor.getMonth() + offset,
            1,
          );
          coveredMonthsRef.current.add(buildKey(month));
        }

        // The host/event metadata only comes back on the full (non slots-only)
        // fetch, so set it once when present.
        if (result.raw.me) {
          const derived = deriveBookerData(result, target);
          minimumBookingNoticeRef.current = derived.minimumBookingNotice;
          hasMultiDurationOptionsRef.current = derived.hasMultiDurationOptions;
          setMeta((prev) => prev ?? derived.meta);

          const defaultDuration = derived.selectedDurationMinutes ?? 30;
          if (derived.meta?.eventTypeDurationOptions?.length) {
            if (
              !derived.meta.eventTypeDurationOptions.includes(
                selectedDurationMinutes,
              )
            ) {
              setSelectedDurationMinutes(defaultDuration);
            }
          } else if (
            derived.meta?.eventTypeDurationMinutes != null &&
            selectedDurationMinutes !== derived.meta.eventTypeDurationMinutes
          ) {
            setSelectedDurationMinutes(derived.meta.eventTypeDurationMinutes);
          }
        }

        const windowSlots = filterBookableSlots(
          extractSlotsByDate(result.raw.slots, selectedTimeZone),
          selectedTimeZone,
          minimumBookingNoticeRef.current,
          new Date(),
        );
        const cacheKey = getSlotsCacheKey(
          targetIdentity(),
          selectedTimeZone,
          selectedDurationMinutes,
        );
        const mergedSlots = {
          ...(slotsCacheRef.current.get(cacheKey) ?? {}),
          ...windowSlots,
        };
        slotsCacheRef.current.set(cacheKey, mergedSlots);
        slotsByDateRef.current = mergedSlots;
        setSlotsByDate(mergedSlots);
      })();

      for (const monthKey of windowMonthKeys) {
        inFlightMonthsRef.current.set(monthKey, request);
      }

      try {
        await request;
      } finally {
        for (const monthKey of windowMonthKeys) {
          if (inFlightMonthsRef.current.get(monthKey) === request) {
            inFlightMonthsRef.current.delete(monthKey);
          }
        }
      }
    },
    [
      buildKey,
      selectedDurationMinutes,
      selectedTimeZone,
      target,
      targetIdentity,
    ],
  );

  const todayStart = useMemo(
    () => getTodayInTimeZone(selectedTimeZone),
    [selectedTimeZone],
  );
  const startMonth = useMemo(
    () => getMinimumNavigableMonth(selectedTimeZone, meta?.bookingWindowStart),
    [meta?.bookingWindowStart, selectedTimeZone],
  );
  const calendarViewOptions = useMemo((): CalendarViewOptions => {
    return {
      endMonth: meta?.bookingWindowEnd ?? undefined,
      shiftWeeks: true,
      startMonth,
      weekStartsOn: getWeekStartsOn(locale),
    };
  }, [locale, meta?.bookingWindowEnd, startMonth]);

  const hasAvailabilityInView = useMemo(
    () =>
      hasAvailabilityInVisibleGrid(
        currentMonth,
        slotsByDate,
        todayStart,
        calendarViewOptions,
      ),
    [calendarViewOptions, currentMonth, slotsByDate, todayStart],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const identity = targetIdentity();
      let deferLoadForMonthSync = false;

      // A different user/event means a different event type and metadata, so
      // reset everything and force a full fetch.
      if (
        lastIdentityRef.current !== null &&
        lastIdentityRef.current !== identity
      ) {
        coveredMonthsRef.current = new Set();
        inFlightMonthsRef.current.clear();
        availabilityRequestVersionRef.current += 1;
        resolvedRef.current = { eventTypeId: null, eventTypeSlug: null };
        setEventTypeId(null);
        setEventTypeSlug(null);
        hasMultiDurationOptionsRef.current = false;
        slotsCacheRef.current = new Map();
        slotsByDateRef.current = {};
        autoSelectedMonthRef.current = null;
        setMeta(null);
        setSelectedDurationMinutes(30);
        setSlotsByDate({});
      } else if (
        lastDurationRef.current !== null &&
        lastDurationRef.current !== selectedDurationMinutes
      ) {
        inFlightMonthsRef.current.clear();
        availabilityRequestVersionRef.current += 1;
        restoreSlotsFromCache();
        autoSelectedMonthRef.current = null;
        setSelectedTime(null);
      } else if (
        lastTimeZoneRef.current !== null &&
        lastTimeZoneRef.current !== selectedTimeZone
      ) {
        coveredMonthsRef.current = new Set();
        inFlightMonthsRef.current.clear();
        availabilityRequestVersionRef.current += 1;
        restoreSlotsFromCache();
        autoSelectedMonthRef.current = null;
        setSelectedTime(null);

        const minMonth = getMinimumNavigableMonth(
          selectedTimeZone,
          meta?.bookingWindowStart,
        );
        if (isCalendarMonthBefore(currentMonth, minMonth)) {
          setCurrentMonth(minMonth);
          deferLoadForMonthSync = true;
        } else {
          const todayInTz = getTodayInTimeZone(selectedTimeZone);
          if (
            selectedDateRef.current &&
            toCalendarDateKey(selectedDateRef.current) <
              toCalendarDateKey(todayInTz)
          ) {
            setSelectedDate(undefined);
          }
        }
      }
      lastIdentityRef.current = identity;
      lastTimeZoneRef.current = selectedTimeZone;
      lastDurationRef.current = selectedDurationMinutes;

      if (deferLoadForMonthSync) {
        return;
      }

      if (!coveredMonthsRef.current.has(buildKey(currentMonth))) {
        setIsPending(true);
        try {
          await fetchWindow(currentMonth);
          if (cancelled) {
            return;
          }
          setError(null);
        } catch (caught) {
          if (cancelled) {
            return;
          }
          setError(classifyError(caught));
          return;
        } finally {
          if (!cancelled) {
            setIsPending(false);
          }
        }
      } else {
        setError(null);
        setIsPending(false);
      }

      // Auto-select the first available day the first time this month's
      // availability is known (on load and on month navigation).
      const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
      if (!cancelled && autoSelectedMonthRef.current !== monthKey) {
        const firstAvailable = pickDefaultSelectedDate(
          currentMonth,
          slotsByDateRef.current,
          selectedTimeZone,
          getTodayInTimeZone(selectedTimeZone),
          calendarViewOptions,
        );
        if (firstAvailable) {
          autoSelectedMonthRef.current = monthKey;
          setSelectedDate(firstAvailable);
          setSelectedTime(null);
        } else {
          autoSelectedMonthRef.current = monthKey;
          setSelectedDate(undefined);
          setSelectedTime(null);
        }
      }

      // Warm the next uncovered window boundary, not just the adjacent month.
      // This keeps navigation instant when the user reaches the end of the
      // currently-covered 3-month range.
      const nextWindow = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + WINDOW_MONTHS,
        1,
      );
      if (skipInitialWarmRef.current) {
        skipInitialWarmRef.current = false;
        return;
      }
      if (!coveredMonthsRef.current.has(buildKey(nextWindow))) {
        void fetchWindow(nextWindow).catch(() => {});
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    buildKey,
    currentMonth,
    fetchWindow,
    selectedDurationMinutes,
    selectedTimeZone,
    meta?.bookingWindowStart,
    calendarViewOptions,
    restoreSlotsFromCache,
    targetIdentity,
  ]);

  const [retryCounter, setRetryCounter] = useState(0);

  const retry = useCallback(() => {
    coveredMonthsRef.current = new Set();
    inFlightMonthsRef.current.clear();
    availabilityRequestVersionRef.current += 1;
    slotsCacheRef.current = new Map();
    slotsByDateRef.current = {};
    autoSelectedMonthRef.current = null;
    setSlotsByDate({});
    setError(null);
    setRetryCounter((c) => c + 1);
  }, []);

  // Re-trigger the main load effect when the user retries.
  useEffect(() => {
    // The first render (retryCounter === 0) is handled by the main effect.
    if (retryCounter === 0) return;
    setIsPending(true);
    let cancelled = false;

    (async () => {
      try {
        await fetchWindow(currentMonth);
        if (cancelled) return;
        setError(null);

        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        if (autoSelectedMonthRef.current !== monthKey) {
          const firstAvailable = pickDefaultSelectedDate(
            currentMonth,
            slotsByDateRef.current,
            selectedTimeZone,
            getTodayInTimeZone(selectedTimeZone),
            calendarViewOptions,
          );
          if (firstAvailable) {
            autoSelectedMonthRef.current = monthKey;
            setSelectedDate(firstAvailable);
            setSelectedTime(null);
          } else {
            autoSelectedMonthRef.current = monthKey;
            setSelectedDate(undefined);
            setSelectedTime(null);
          }
        }
      } catch (caught) {
        if (cancelled) return;
        setError(classifyError(caught));
      } finally {
        if (!cancelled) setIsPending(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    retryCounter,
    fetchWindow,
    currentMonth,
    selectedTimeZone,
    calendarViewOptions,
  ]);

  useEffect(() => {
    if (!timezone) {
      return;
    }
    setSelectedTimeZone(timezone);
  }, [timezone]);

  const selectedDateKey = toCalendarDateKey(selectedDate ?? todayStart);
  const daySlots =
    selectedDate != null ? (slotsByDate[selectedDateKey] ?? []) : [];
  const nextAvailableDate = findNextAvailableDate(
    slotsByDate,
    selectedTimeZone,
    todayStart,
  );

  const handleMonthChange = (month: Date) => {
    const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
    const monthCovered = coveredMonthsRef.current.has(buildKey(month));
    setCurrentMonth(month);
    // Flip to pending in the same render as the month change when the target
    // month still needs fetching, so the skeleton shows immediately instead of
    // the empty state flashing for a frame before the async effect runs.
    if (!monthCovered) {
      setIsPending(true);
    }
    // For an already-loaded month, select the first available day in the same
    // update as the month change so the selection doesn't flicker.
    const firstAvailable = pickDefaultSelectedDate(
      month,
      slotsByDateRef.current,
      selectedTimeZone,
      getTodayInTimeZone(selectedTimeZone),
      calendarViewOptions,
    );
    if (firstAvailable) {
      autoSelectedMonthRef.current = monthKey;
      setSelectedDate(firstAvailable);
      setSelectedTime(null);
    } else {
      if (monthCovered) {
        autoSelectedMonthRef.current = monthKey;
      }
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  };

  const handleSelectDate = (nextDate: Date | undefined) => {
    if (!nextDate) {
      return;
    }
    setSelectedDate(nextDate);
    setSelectedTime(null);
    autoSelectedMonthRef.current = `${nextDate.getFullYear()}-${nextDate.getMonth()}`;
    const isDifferentMonth =
      nextDate.getMonth() !== currentMonth.getMonth() ||
      nextDate.getFullYear() !== currentMonth.getFullYear();
    if (isDifferentMonth) {
      setCurrentMonth(nextDate);
    }
  };

  const isDayDisabled = (date: Date) => {
    const dayKey = toCalendarDateKey(date);
    if (dayKey < toCalendarDateKey(todayStart)) {
      return true;
    }

    return (slotsByDate[dayKey] ?? []).length === 0;
  };

  const goToDate = (date: Date) => {
    setCurrentMonth(date);
    setSelectedDate(date);
    setSelectedTime(null);
    autoSelectedMonthRef.current = `${date.getFullYear()}-${date.getMonth()}`;
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };

  const handleBack = useCallback(() => {
    setStep("select");
  }, []);

  const initialLoading = !meta;
  const currentMonthCovered = coveredMonthsRef.current.has(
    buildKey(currentMonth),
  );
  const availabilityLoading = isPending || !currentMonthCovered;

  const confirmFormProps = useMemo((): BookerConfirmFormContext => {
    return {
      disableGuests: meta?.disableGuests,
      durationMinutes: selectedDurationMinutes,
      includeLengthInMinutes: (meta?.eventTypeDurationOptions?.length ?? 0) > 1,
      locale,
      locations: meta?.eventTypeLocations,
      onBack: handleBack,
      selectedDate,
      selectedTime: _selectedTime,
      target,
      timeZone: selectedTimeZone,
    };
  }, [
    _selectedTime,
    locale,
    meta?.disableGuests,
    meta?.eventTypeDurationOptions,
    meta?.eventTypeLocations,
    selectedDate,
    selectedDurationMinutes,
    selectedTimeZone,
    target,
    handleBack,
  ]);

  return {
    calendarProps: {
      availabilityLoading,
      disabled: isDayDisabled,
      endMonth: meta?.bookingWindowEnd ?? undefined,
      initialLoading,
      locale,
      month: currentMonth,
      onMonthChange: handleMonthChange,
      onSelect: handleSelectDate,
      selected: selectedDate,
      startMonth,
      today: todayStart,
    },
    confirmFormProps,
    durationProps: {
      onValueChange: setSelectedDurationMinutes,
      value: selectedDurationMinutes,
    },
    error,
    loadingState: {
      availability: availabilityLoading,
      busy: initialLoading || availabilityLoading,
      initial: initialLoading,
    },
    meta,
    retry,
    step,
    timePickerProps: {
      availabilityLoading,
      currentMonth,
      daySlots,
      goToDate,
      hasAvailabilityInView,
      initialLoading,
      is24Hour,
      locale,
      nextAvailableDate,
      onIs24HourChange: setIs24Hour,
      onSelectTime: handleSelectTime,
      selectedDate,
    },
    timezoneProps: {
      onValueChange: setSelectedTimeZone,
      value: selectedTimeZone,
    },
  };
}
