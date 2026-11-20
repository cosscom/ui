"use client";

import { CalendarX2Icon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import { Label } from "@/registry/default/ui/label";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { Switch } from "@/registry/default/ui/switch";
import {
  displayTimeLabel,
  formatSelectedDay,
  formatSelectedMonth,
  formatSelectedWeekday,
  isSingleDigit12HourLabel,
} from "@/lib/booker/utils";

type TimePickerLabels = {
  noAvailableTimes: string;
  noSlotsAvailable: string;
  noSlotsThisDay: string;
  noSlotsThisMonth: string;
  viewFirstAvailability: string;
  use24Hour: string;
  hour12Short: string;
  hour24Short: string;
};

type TimePickerProps = {
  availabilityLoading: boolean;
  currentMonth: Date;
  daySlots: string[];
  goToDate: (date: Date) => void;
  is24Hour: boolean;
  initialLoading: boolean;
  labels: TimePickerLabels;
  locale: string;
  nextAvailableDate: Date | null;
  onIs24HourChange: (value: boolean) => void;
  onSelectTime: (time: string) => void;
  selectedDate: Date | undefined;
  hasAvailabilityInView: boolean;
};

export function TimePicker({
  availabilityLoading,
  currentMonth,
  daySlots,
  goToDate,
  is24Hour,
  initialLoading,
  labels,
  locale,
  nextAvailableDate,
  onIs24HourChange,
  onSelectTime,
  selectedDate,
  hasAvailabilityInView,
}: TimePickerProps) {
  const slotsLoading = initialLoading || availabilityLoading;

  return (
    <div className="relative @3xl:w-(--booker-side) @3xl:border-s border-t @3xl:border-t-0">
      <div className="@3xl:absolute inset-0 flex flex-col gap-2">
        {(slotsLoading || selectedDate != null) && (
          <div className="@3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:pt-2 pt-3">
            <div className="flex h-10 items-center justify-between rounded-se-2xl bg-card sm:h-9">
              {slotsLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <div className="flex items-center gap-1.5 font-heading @3xl:@max-5xl:text-base text-lg">
                  <span>
                    {formatSelectedWeekday(selectedDate ?? new Date(), locale)}
                  </span>
                  <span className="text-muted-foreground/72">
                    {selectedDate &&
                    selectedDate.getMonth() !== currentMonth.getMonth()
                      ? `${formatSelectedMonth(selectedDate, locale)} `
                      : null}
                    {formatSelectedDay(selectedDate ?? new Date(), locale)}
                  </span>
                </div>
              )}
              {!initialLoading ? (
                <Label className="relative">
                  <span
                    className="pointer-events-none absolute inset-0 z-1 flex items-center text-center font-medium text-xs [&:has(+[data-slot=switch][data-checked])>*:first-child]:text-muted-foreground/72 [&:has(+[data-slot=switch][data-unchecked])>*:last-child]:text-muted-foreground/72"
                    aria-hidden="true"
                  >
                    <span className="flex-1 transition-colors">
                      {labels.hour12Short}
                    </span>
                    <span className="flex-1 transition-colors">
                      {labels.hour24Short}
                    </span>
                  </span>
                  <Switch
                    className="h-9 w-[calc(var(--thumb-size)*2)] rounded-lg bg-muted! p-0.5 [--thumb-size:--spacing(10)] *:data-[slot=switch-thumb]:data-checked:translate-x-[calc(var(--thumb-size)-2px)] *:data-[slot=switch-thumb]:aspect-auto *:data-[slot=switch-thumb]:w-[calc(var(--thumb-size)-2px)] *:data-[slot=switch-thumb]:rounded-md sm:h-8 dark:*:data-[slot=switch-thumb]:bg-input sm:[--thumb-size:--spacing(9)] *:[[span]]:text-muted-foreground/70"
                    aria-label={labels.use24Hour}
                    checked={is24Hour}
                    onCheckedChange={onIs24HourChange}
                  />
                </Label>
              ) : null}
            </div>
          </div>
        )}
        <div className="min-h-0 flex-1">
          {!slotsLoading && daySlots.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Empty className="gap-4 md:pt-2 md:pb-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="mb-1">
                    <CalendarX2Icon />
                  </EmptyMedia>
                  <EmptyTitle className="@3xl:@max-5xl:text-base text-lg">
                    {labels.noAvailableTimes}
                  </EmptyTitle>
                  <EmptyDescription className="[[data-slot=empty-title]+&]:mt-0">
                    {hasAvailabilityInView
                      ? labels.noSlotsThisDay
                      : nextAvailableDate
                        ? labels.noSlotsThisMonth
                        : labels.noSlotsAvailable}
                  </EmptyDescription>
                </EmptyHeader>
                {nextAvailableDate ? (
                  <EmptyContent>
                    <Button onClick={() => goToDate(nextAvailableDate)}>
                      {labels.viewFirstAvailability}
                    </Button>
                  </EmptyContent>
                ) : null}
              </Empty>
            </div>
          ) : (
            <ScrollArea className="h-full" scrollFade>
              <div className="flex @max-3xl:max-h-80 flex-col gap-3 @3xl:@max-5xl:px-2 px-4 pt-1 @3xl:@max-5xl:pb-2 pb-4">
                {slotsLoading ? (
                  <div className="grid w-full grid-cols-1 @5xl:gap-1.5 gap-1">
                    {Array.from(
                      { length: 20 },
                      (_, index) => `time-skeleton-${index}`,
                    ).map((skeletonKey) => (
                      <Skeleton
                        key={skeletonKey}
                        className="h-9 w-full rounded-lg sm:h-8"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 @5xl:gap-1.5 gap-1">
                    {daySlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => onSelectTime(time)}
                        className="relative flex h-9 cursor-pointer items-center justify-center rounded-lg bg-muted font-medium text-foreground tabular-nums outline-none transition-shadow after:absolute @5xl:after:-inset-1 after:-inset-0.75 hover:ring-2 hover:ring-primary/72 focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-primary/72 sm:h-8 sm:text-sm"
                      >
                        <span>
                          {!is24Hour && isSingleDigit12HourLabel(time) ? (
                            <span aria-hidden="true" className="invisible">
                              0
                            </span>
                          ) : null}
                          {displayTimeLabel(time, !is24Hour)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
