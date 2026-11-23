"use client";

import { cn } from "@/registry/default/lib/utils";
import { Card } from "@/registry/default/ui/card";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { BookerAvatars } from "./booker/booker-avatars";
import { BookerCalendar, BookerCalendarPane } from "./booker/booker-calendar";
import { BookerConfirmForm } from "./booker/booker-confirm-form";
import { BookerErrorState } from "./booker/booker-error-state";
import { type BookerLabels, getBookerLabels } from "./booker/booker-labels";
import { BookerSteps } from "./booker/booker-steps";
import { DurationPicker } from "./booker/duration-picker";
import { EventDescription } from "./booker/event-description";
import {
  EventTitle,
  FixedDuration,
  HostIdentity,
  SelectedTime,
} from "./booker/event-meta";
import { HeaderBanner } from "./booker/header-banner";
import { Location } from "./booker/location";
import { TimePicker } from "./booker/time-picker";
import { TimezoneDisplay, TimezonePicker } from "./booker/timezone-picker";
import type { BookerTarget } from "@/lib/booker/target";
import { type BookerInitialData, useBooker } from "@/lib/booker/use-booker";
import { buildBookingStartIso, toCalendarDateKey } from "@/lib/booker/utils";

type BookerProps = {
  target: BookerTarget;
  timezone?: string;
  initialData?: BookerInitialData;
  defaultFormValues?: Record<string, unknown>;
  onCreateBookingSuccess?: (data: unknown) => void;
  /**
   * Follow the event type's redirect after a booking (on by default). The
   * success callback is called first.
   */
  redirectOnSuccess?: boolean;
  labels?: Partial<BookerLabels>;
};

export function Booker({
  initialData,
  target,
  timezone,
  labels,
  defaultFormValues,
  onCreateBookingSuccess,
  redirectOnSuccess = true,
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
              // As the design system: the body overlaps the banner only when
              // an avatar sits on it, less for a stack.
              displayMeta?.eventTypeImageUrl &&
                (displayMeta.hostAvatars?.length ?? 1) === 1 &&
                "relative -mt-11 @5xl:-mt-13",
              displayMeta?.eventTypeImageUrl &&
                (displayMeta.hostAvatars?.length ?? 1) > 1 &&
                "relative -mt-8 @5xl:-mt-10",
            )}
          >
            <div className="flex flex-col gap-4">
              {displayMeta ? (
                <HostIdentity
                  avatars={displayMeta.hostAvatars}
                  name={displayMeta.hostName}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <BookerAvatars />
                  <Skeleton className="my-0.5 h-5 w-24 sm:h-4" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                {displayMeta ? (
                  <>
                    <EventTitle>{displayMeta.eventTypeTitle}</EventTitle>
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
                  <SelectedTime
                    durationMinutes={booker.durationProps.value}
                    is24Hour={booker.timePickerProps.is24Hour}
                    locale={booker.calendarProps.locale}
                    start={
                      new Date(
                        buildBookingStartIso(
                          toCalendarDateKey(selectedDate),
                          selectedTime,
                          booker.timezoneProps.value,
                        ),
                      )
                    }
                    timeZone={booker.timezoneProps.value}
                  />
                ) : null}
                {/* As the design system: the duration can be changed while
                    picking a time, and is static during the booking step. */}
                {displayMeta.eventTypeDurationOptions &&
                booker.step === "select" ? (
                  <DurationPicker
                    formatLabel={t.durationMinutes}
                    options={displayMeta.eventTypeDurationOptions}
                    {...booker.durationProps}
                  />
                ) : booker.durationProps.value ||
                  displayMeta.eventTypeDurationMinutes ? (
                  <FixedDuration
                    label={t.durationMinutes(
                      booker.durationProps.value ||
                        displayMeta.eventTypeDurationMinutes ||
                        0,
                    )}
                  />
                ) : null}
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
            <div className="flex w-full @3xl:flex-row flex-col">
              <BookerCalendarPane>
                <BookerCalendar {...booker.calendarProps} />
              </BookerCalendarPane>
              <TimePicker labels={t} {...booker.timePickerProps} />
            </div>
          ) : (
            <div className="@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4">
              <BookerConfirmForm
                {...booker.confirmFormProps}
                eventTitle={displayMeta?.eventTypeTitle}
                hostName={displayMeta?.hostName}
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
                onSuccess={(booking) => {
                  onCreateBookingSuccess?.(booking);
                  const redirectUrl = displayMeta?.successRedirectUrl;
                  if (redirectOnSuccess && redirectUrl) {
                    window.location.assign(redirectUrl);
                  }
                }}
              />
            </div>
          )}
        </BookerSteps>
      </Card>
      {/* The Cal.com logo: weight 700 with "GEOM" 50, "opsz" 32 (Pasquale,
          2026-11-23), as the design system's font-heading. */}
      <a
        href="https://cal.com"
        className='font-bold font-heading text-lg [font-variation-settings:"GEOM"_50,"opsz"_32]'
        target="_blank"
        rel="noreferrer"
      >
        Cal.com
      </a>
    </div>
  );
}

export default Booker;
