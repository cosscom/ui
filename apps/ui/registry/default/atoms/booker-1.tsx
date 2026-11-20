"use client";

import { CalendarIcon, Clock3Icon } from "lucide-react";
import { cn } from "@/registry/default/lib/utils";
import { Card } from "@/registry/default/ui/card";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { BookerAvatars } from "./booker/booker-avatars";
import { BookerCalendar } from "./booker/booker-calendar";
import { BookerConfirmForm } from "./booker/booker-confirm-form";
import { BookerErrorState } from "./booker/booker-error-state";
import { type BookerLabels, getBookerLabels } from "./booker/booker-labels";
import { BookerSteps } from "./booker/booker-steps";
import { DurationPicker } from "./booker/duration-picker";
import { EventDescription } from "./booker/event-description";
import { HeaderBanner } from "./booker/header-banner";
import { Location } from "./booker/location";
import { TimePicker } from "./booker/time-picker";
import { TimezoneDisplay, TimezonePicker } from "./booker/timezone-picker";
import type { BookerTarget } from "@/lib/booker/target";
import { type BookerInitialData, useBooker } from "@/lib/booker/use-booker";
import {
  formatConfirmDateDetail,
  formatConfirmTimeRange,
  formatSelectedWeekday,
} from "@/lib/booker/utils";

type BookerProps = {
  target: BookerTarget;
  timezone?: string;
  initialData?: BookerInitialData;
  defaultFormValues?: Record<string, unknown>;
  onCreateBookingSuccess?: (data: unknown) => void;
  labels?: Partial<BookerLabels>;
};

export function Booker({
  initialData,
  target,
  timezone,
  labels,
  defaultFormValues,
  onCreateBookingSuccess,
}: BookerProps) {
  const t = getBookerLabels(labels);
  const booker = useBooker({ initialData, target, timezone });

  if (booker.error) {
    return (
      <BookerErrorState
        error={booker.error}
        labels={t}
        onRetry={booker.retry}
      />
    );
  }

  const displayMeta = booker.meta;
  const selectedDate = booker.timePickerProps.selectedDate;
  const selectedTime = booker.confirmFormProps.selectedTime;
  const showSelectedSlot =
    booker.step === "confirm" && selectedDate != null && selectedTime != null;
  const headerImageAlt = displayMeta
    ? t.headerImageAlt(displayMeta.hostName, displayMeta.eventTypeTitle)
    : "Booker header";

  return (
    <div
      className="@container flex w-full flex-col items-center gap-4"
      aria-busy={booker.loadingState.busy}
    >
      <Card className="@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]">
        {/* Meta */}
        <div className="@3xl:w-(--booker-side) @3xl:border-e border-b @3xl:border-b-0">
          <HeaderBanner
            alt={headerImageAlt}
            src={displayMeta?.eventTypeImageUrl}
          />
          <div
            className={cn(
              "flex flex-col gap-6 @5xl:p-6 p-4",
              displayMeta?.eventTypeImageUrl && "relative -mt-11 @5xl:-mt-13",
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <BookerAvatars
                  avatars={displayMeta?.hostAvatars}
                  fallbackName={displayMeta?.hostName}
                />
                {displayMeta ? (
                  <p className="font-medium text-muted-foreground sm:text-sm">
                    {displayMeta.hostName}
                  </p>
                ) : (
                  <Skeleton className="my-0.5 h-5 w-24 sm:h-4" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                {displayMeta ? (
                  <>
                    <h1 className="font-heading @3xl:@max-5xl:text-lg text-xl">
                      {displayMeta.eventTypeTitle}
                    </h1>
                    <EventDescription
                      description={displayMeta.eventTypeDescription}
                    />
                  </>
                ) : (
                  <>
                    <Skeleton className="my-0.5 h-6 w-36" />
                    <Skeleton className="my-0.5 h-4 w-full" />
                    <Skeleton className="my-0.5 h-4 w-full" />
                  </>
                )}
              </div>
            </div>

            {displayMeta ? (
              <div className="flex flex-col gap-3 sm:text-sm">
                {showSelectedSlot ? (
                  <div className="flex gap-2">
                    <CalendarIcon
                      className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                      aria-hidden="true"
                    />
                    <span>
                      {formatSelectedWeekday(
                        selectedDate,
                        booker.calendarProps.locale,
                      )}{" "}
                      {formatConfirmDateDetail(
                        selectedDate,
                        booker.calendarProps.locale,
                      )}{" "}
                      {formatConfirmTimeRange(
                        selectedTime,
                        booker.durationProps.value,
                        !booker.timePickerProps.is24Hour,
                        booker.calendarProps.locale,
                      )}
                    </span>
                  </div>
                ) : null}
                {displayMeta.eventTypeDurationOptions ? (
                  <DurationPicker
                    formatLabel={t.durationMinutes}
                    options={displayMeta.eventTypeDurationOptions}
                    {...booker.durationProps}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock3Icon
                      className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                      aria-hidden="true"
                    />
                    <span>
                      {displayMeta.eventTypeDurationMinutes
                        ? t.durationMinutes(
                            displayMeta.eventTypeDurationMinutes,
                          )
                        : t.durationUnknown}
                    </span>
                  </div>
                )}
                <Location
                  labels={{
                    locationOptions: t.locationOptions,
                    selectOnNextStep: t.locationSelectOnNextStep,
                  }}
                  locations={displayMeta.eventTypeLocations}
                />
                {booker.step === "select" ? (
                  <TimezonePicker {...booker.timezoneProps} />
                ) : (
                  <TimezoneDisplay value={booker.timezoneProps.value} />
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Skeleton className="my-0.5 h-4 w-36" />
                <Skeleton className="my-0.5 h-4 w-36" />
                <Skeleton className="my-0.5 h-4 w-36" />
              </div>
            )}
          </div>
        </div>
        <BookerSteps step={booker.step}>
          {booker.step === "select" ? (
            <div key="select" className="flex w-full @3xl:flex-row flex-col">
              <div className="flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 flex-col items-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4">
                <BookerCalendar {...booker.calendarProps} />
              </div>
              <TimePicker
                labels={{
                  hour12Short: t.hour12Short,
                  hour24Short: t.hour24Short,
                  noAvailableTimes: t.noAvailableTimes,
                  noSlotsAvailable: t.noSlotsAvailable,
                  noSlotsThisDay: t.noSlotsThisDay,
                  noSlotsThisMonth: t.noSlotsThisMonth,
                  use24Hour: t.use24Hour,
                  viewFirstAvailability: t.viewFirstAvailability,
                }}
                {...booker.timePickerProps}
              />
            </div>
          ) : (
            <div
              key="confirm"
              className="@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4"
            >
              <BookerConfirmForm
                {...booker.confirmFormProps}
                defaultEmail={
                  typeof defaultFormValues?.email === "string"
                    ? defaultFormValues.email
                    : undefined
                }
                defaultName={
                  typeof defaultFormValues?.name === "string"
                    ? defaultFormValues.name
                    : undefined
                }
                labels={t}
                onSuccess={onCreateBookingSuccess}
              />
            </div>
          )}
        </BookerSteps>
      </Card>
      <a
        href="https://cal.com"
        className="font-heading text-xl"
        target="_blank"
        rel="noreferrer"
      >
        Cal.com
      </a>
    </div>
  );
}

export default Booker;
