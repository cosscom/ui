"use client";

// The Booker's time list, as the design system's Booker time slots
// (calcom/cal `apps/design-system/components/booker-time-slots-preview.tsx`:
// TimeSlotsPane, TimeSlotsHeader, TimeFormatSelector, SlotList, SlotButton,
// SlotEmptyState). The design system's three layouts map onto the Booker's
// container queries: mobile below @3xl, compact @3xl to @5xl, wide from @5xl.
// Differences on purpose: no transitions (the Booker has no animation for
// now), and the pane fills the Booker's column instead of a fixed height.

import { CalendarX2Icon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { bookerHeadingClassName } from "./booker-heading";
import { type BookerLabels, getBookerLabels } from "./booker-labels";
import { SegmentedRadio, SegmentedRadioGroup } from "./segmented-radio-group";
import { StatusMark } from "./status-mark";

/** An offered start, kept as the API's instant, with its optional states. */
export type TimeSlot = {
  start: string;
  detail?: string;
  badge?: { label: string; variant: "secondary" | "warning" };
  disabled?: boolean;
  currentBooking?: boolean;
  bypassed?: boolean;
  calendarStatus?: "available" | "busy";
};

/** Why the list is empty: this day, every date checked, or the window ended. */
export type TimePickerEmpty = "day" | "range" | "windowEnded";

type TimePickerLabels = Pick<
  BookerLabels,
  | "availableTimes"
  | "loadingTimes"
  | "findingFirstAvailable"
  | "timeFormat"
  | "hour12Short"
  | "hour12"
  | "hour24Short"
  | "hour24"
  | "noAvailableTimes"
  | "noTimesThisDay"
  | "viewFirstAvailability"
  | "noTimesInRange"
  | "findFirstAvailable"
  | "noTimesInWindow"
  | "loadTimesError"
  | "loadTimesErrorDescription"
  | "retry"
  | "slotNormallyAvailable"
  | "slotHostOverride"
  | "slotCalendarBusy"
  | "slotCalendarAvailable"
>;

type TimePickerProps = {
  slots: TimeSlot[];
  selectedStart?: string;
  onSelect: (start: string) => void;
  selectedDate: Date | undefined;
  currentMonth: Date;
  is24Hour: boolean;
  onIs24HourChange: (value: boolean) => void;
  locale: string;
  /** The Booker's timezone; the browser's when left out. */
  timeZone?: string;
  /** "initial" hides the date; a refresh keeps it. */
  loading?: "initial" | "refresh";
  /** When there are no slots: "day" unless said otherwise. */
  empty?: TimePickerEmpty;
  onViewFirstAvailability?: () => void;
  onFindFirstAvailable?: () => void;
  findingFirstAvailable?: boolean;
  error?: boolean;
  onRetry?: () => void;
  labels?: Partial<TimePickerLabels>;
};

const headingClassName = "@3xl:@max-5xl:text-base text-lg";

function formatUtcOffset(start: string, timeZone: string | undefined) {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone,
    timeZoneName: "longOffset",
  });
  const offset = formatter
    .formatToParts(new Date(start))
    .find((part) => part.type === "timeZoneName")?.value;
  return offset?.replace("GMT", "UTC") ?? "UTC";
}

function TimeFormatSelector({
  is24Hour,
  labels,
  onChange,
}: {
  is24Hour: boolean;
  labels: TimePickerLabels;
  onChange: (value: boolean) => void;
}) {
  return (
    <SegmentedRadioGroup
      aria-label={labels.timeFormat}
      className="shrink-0"
      onValueChange={(value) => {
        if (value !== "12h" && value !== "24h") return;
        onChange(value === "24h");
      }}
      size="sm"
      value={is24Hour ? "24h" : "12h"}
    >
      <SegmentedRadio
        aria-label={labels.hour12}
        className="text-xs sm:text-xs"
        value="12h"
      >
        {labels.hour12Short}
      </SegmentedRadio>
      <SegmentedRadio
        aria-label={labels.hour24}
        className="text-xs sm:text-xs"
        value="24h"
      >
        {labels.hour24Short}
      </SegmentedRadio>
    </SegmentedRadioGroup>
  );
}

function TimeSlotsHeader({
  date,
  month,
  is24Hour,
  onFormatChange,
  loading,
  locale,
  labels,
}: {
  date: Date | undefined;
  month: Date;
  is24Hour: boolean;
  onFormatChange: (value: boolean) => void;
  loading?: "initial" | "refresh";
  locale: string;
  labels: TimePickerLabels;
}) {
  const options: Intl.DateTimeFormatOptions = { calendar: "gregory" };
  const otherMonth =
    date != null &&
    (date.getFullYear() !== month.getFullYear() ||
      date.getMonth() !== month.getMonth());

  return (
    <div className="@3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:pt-2 pt-3">
      <div className="flex @3xl:h-9 h-10 items-center justify-between gap-2">
        {loading === "initial" || date == null ? (
          <Skeleton className="h-6 w-16" />
        ) : (
          <div
            className={cn(
              "flex items-center gap-1.5",
              bookerHeadingClassName,
              headingClassName,
            )}
          >
            <span>
              {new Intl.DateTimeFormat(locale, {
                ...options,
                weekday: "short",
              }).format(date)}
            </span>
            <span className="text-muted-foreground/72">
              {new Intl.DateTimeFormat(locale, {
                ...options,
                day: "numeric",
                ...(otherMonth ? { month: "short" } : {}),
              }).format(date)}
            </span>
          </div>
        )}
        {loading !== "initial" && date != null ? (
          <TimeFormatSelector
            is24Hour={is24Hour}
            labels={labels}
            onChange={onFormatChange}
          />
        ) : null}
      </div>
    </div>
  );
}

function SlotButton({
  slot,
  formatter,
  offsetLabel,
  selected,
  onSelect,
  labels,
}: {
  slot: TimeSlot;
  formatter: Intl.DateTimeFormat;
  offsetLabel?: string;
  selected?: boolean;
  onSelect: (start: string) => void;
  labels: TimePickerLabels;
}) {
  const instant = new Date(slot.start);
  const label = formatter.format(instant);
  const hour = formatter
    .formatToParts(instant)
    .find((part) => part.type === "hour")?.value;
  const padHour = formatter.resolvedOptions().hour12 && hour?.length === 1;
  let statusTone: "destructive" | "success" | undefined;
  let statusLabel: string | undefined;
  if (slot.bypassed !== undefined) {
    statusTone = slot.bypassed ? "destructive" : "success";
    statusLabel = slot.bypassed
      ? labels.slotHostOverride
      : labels.slotNormallyAvailable;
  } else if (slot.calendarStatus) {
    statusTone = slot.calendarStatus === "busy" ? "destructive" : "success";
    statusLabel =
      slot.calendarStatus === "busy"
        ? labels.slotCalendarBusy
        : labels.slotCalendarAvailable;
  }

  return (
    <button
      aria-pressed={selected}
      className={cn(
        "relative col-span-full grid h-9 w-full cursor-pointer grid-cols-subgrid items-center rounded-lg bg-muted font-medium text-foreground tabular-nums outline-none after:absolute @5xl:after:-inset-1 after:-inset-0.75 focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-primary/72 enabled:hover:ring-2 enabled:hover:ring-primary/72 disabled:cursor-not-allowed disabled:opacity-50 disabled:after:hidden sm:h-8 sm:text-sm",
        selected && "ring-2 ring-primary/72",
        (offsetLabel || slot.detail || slot.badge) &&
          "h-auto min-h-12 gap-y-1 px-1 py-2 sm:h-auto",
      )}
      data-slot="booker-time-slot"
      data-start={slot.start}
      disabled={slot.disabled}
      onClick={() => onSelect(slot.start)}
      type="button"
    >
      {statusTone ? (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "col-start-2 size-2 rounded-full",
              statusTone === "destructive" ? "bg-destructive" : "bg-success",
            )}
          />
          {statusLabel ? <span className="sr-only">{statusLabel}</span> : null}
        </>
      ) : null}
      <span className="col-start-3 justify-self-end tabular-nums">
        {padHour && statusTone ? (
          <span aria-hidden="true" className="invisible">
            0
          </span>
        ) : null}
        {label}
      </span>
      {offsetLabel ? (
        <span className="col-span-full justify-self-center text-xs">
          {offsetLabel}
        </span>
      ) : null}
      {slot.detail || slot.badge ? (
        <span className="col-span-full flex items-center gap-1 justify-self-center text-xs">
          {slot.currentBooking ? (
            <CheckIcon
              aria-hidden="true"
              className="size-3.5 text-success-foreground"
            />
          ) : null}
          {slot.detail}
          {slot.badge ? (
            <Badge size="sm" variant={slot.badge.variant}>
              {slot.badge.label}
            </Badge>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}

function SlotList({
  slots,
  is24Hour,
  onSelect,
  selected,
  loading,
  timeZone,
  locale,
  labels,
}: {
  slots: TimeSlot[];
  is24Hour: boolean;
  onSelect: (start: string) => void;
  selected?: string;
  loading?: boolean;
  timeZone?: string;
  locale: string;
  labels: TimePickerLabels;
}) {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: is24Hour ? "2-digit" : "numeric",
    hour12: !is24Hour,
    minute: "2-digit",
    timeZone,
  });
  const timeLabels = slots.map((slot) =>
    formatter.format(new Date(slot.start)),
  );
  const labelCounts = new Map<string, number>();
  for (const label of timeLabels) {
    labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
  }

  return (
    <div className="grid w-full grid-cols-[1fr_auto_auto_1fr] @5xl:gap-1.5 gap-1 @5xl:gap-x-2 gap-x-2">
      {loading
        ? Array.from({ length: 20 }, (_, index) => `slot-${index}`).map(
            (key) => (
              <Skeleton
                className="col-span-full h-9 w-full rounded-lg sm:h-8"
                key={key}
              />
            ),
          )
        : slots.map((slot, index) => (
            <SlotButton
              formatter={formatter}
              key={slot.start}
              labels={labels}
              offsetLabel={
                (labelCounts.get(timeLabels[index] ?? "") ?? 0) > 1
                  ? formatUtcOffset(slot.start, timeZone)
                  : undefined
              }
              onSelect={onSelect}
              selected={selected === slot.start}
              slot={slot}
            />
          ))}
    </div>
  );
}

function SlotEmptyState({
  title,
  titleClassName,
  description,
  media,
  action,
  onAction,
  actionLoading = false,
}: {
  title: string;
  titleClassName?: string;
  description: string;
  media?: ReactNode;
  action?: string;
  onAction?: () => void;
  actionLoading?: boolean;
}) {
  return (
    <Empty className="gap-4 md:pt-2 md:pb-6">
      <EmptyHeader>
        {media ?? (
          <EmptyMedia className="mb-1" variant="icon">
            <CalendarX2Icon aria-hidden="true" />
          </EmptyMedia>
        )}
        <EmptyTitle className={cn(headingClassName, titleClassName)}>
          {title}
        </EmptyTitle>
        <EmptyDescription className="[[data-slot=empty-title]+&]:mt-0">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {action ? (
        <EmptyContent>
          <Button loading={actionLoading} onClick={onAction}>
            {action}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export function TimePicker({
  slots,
  selectedStart,
  onSelect,
  selectedDate,
  currentMonth,
  is24Hour,
  onIs24HourChange,
  locale,
  timeZone,
  loading,
  empty = "day",
  onViewFirstAvailability,
  onFindFirstAvailable,
  findingFirstAvailable = false,
  error = false,
  onRetry,
  labels: labelOverrides,
}: TimePickerProps) {
  const labels: TimePickerLabels = {
    ...getBookerLabels(),
    ...labelOverrides,
  };
  const searching = findingFirstAvailable;
  const isEmpty = !loading && !error && slots.length === 0;
  const centered = error || isEmpty || searching;
  // As the design system: no date header once the empty state is about the
  // dates checked or the booking window rather than this day.
  const showHeader =
    (selectedDate != null || loading === "initial") &&
    !searching &&
    !(isEmpty && (empty === "range" || empty === "windowEnded"));

  let body: ReactNode = (
    <SlotList
      is24Hour={is24Hour}
      labels={labels}
      loading={loading != null}
      locale={locale}
      onSelect={onSelect}
      selected={selectedStart}
      slots={slots}
      timeZone={timeZone}
    />
  );
  if (error) {
    body = (
      <SlotEmptyState
        action={labels.retry}
        description={labels.loadTimesErrorDescription}
        media={<StatusMark className="mb-3" status="error" />}
        onAction={onRetry}
        title={labels.loadTimesError}
        titleClassName="leading-tight"
      />
    );
  } else if (searching || (isEmpty && empty === "range")) {
    body = (
      <SlotEmptyState
        action={onFindFirstAvailable ? labels.findFirstAvailable : undefined}
        actionLoading={searching}
        description={labels.noTimesInRange}
        onAction={onFindFirstAvailable}
        title={labels.noAvailableTimes}
      />
    );
  } else if (isEmpty && empty === "windowEnded") {
    body = (
      <SlotEmptyState
        description={labels.noTimesInWindow}
        title={labels.noAvailableTimes}
      />
    );
  } else if (isEmpty) {
    body = (
      <SlotEmptyState
        action={
          onViewFirstAvailability ? labels.viewFirstAvailability : undefined
        }
        description={labels.noTimesThisDay}
        onAction={onViewFirstAvailability}
        title={labels.noAvailableTimes}
      />
    );
  }

  const busy = loading != null || searching;

  return (
    <section
      aria-busy={busy || undefined}
      aria-label={labels.availableTimes}
      className="relative @3xl:w-(--booker-side) @3xl:border-s border-t @3xl:border-t-0"
      data-slot="booker-time-slots-pane"
    >
      <div className="@3xl:absolute inset-0 flex flex-col gap-2">
        {showHeader ? (
          <TimeSlotsHeader
            date={selectedDate}
            is24Hour={is24Hour}
            labels={labels}
            loading={loading}
            locale={locale}
            month={currentMonth}
            onFormatChange={onIs24HourChange}
          />
        ) : null}
        {centered ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {body}
          </div>
        ) : (
          <div className="@max-3xl:max-h-80 min-h-0 @3xl:flex-1">
            <ScrollArea
              className="@3xl:h-full @max-3xl:max-h-80 @max-3xl:**:data-[slot=scroll-area-viewport]:max-h-80"
              scrollFade
            >
              <div className="flex flex-col gap-3 @3xl:@max-5xl:px-2 px-4 pt-1 @3xl:@max-5xl:pb-2 pb-4">
                {body}
              </div>
            </ScrollArea>
          </div>
        )}
        {busy ? (
          <span className="sr-only" role="status">
            {searching ? labels.findingFirstAvailable : labels.loadingTimes}
          </span>
        ) : null}
      </div>
    </section>
  );
}
