"use client";

import { CopyIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/default/ui/combobox";
import { Label } from "@/registry/default/ui/label";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { SelectButton } from "@/registry/default/ui/select";
import { Switch } from "@/registry/default/ui/switch";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Day = (typeof days)[number];

type TimeRange = {
  id: number;
  start: string;
  end: string;
};

const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  const period = hours < 12 ? "AM" : "PM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
});

const startTimeOptions = timeOptions.slice(0, -1);

const timeIndex = (time: string) => timeOptions.indexOf(time);

let rangeId = 0;
const createRange = (start: string, end: string): TimeRange => ({
  end,
  id: ++rangeId,
  start,
});

const defaultAvailability: Record<Day, TimeRange[]> = {
  Friday: [createRange("9:00 AM", "5:00 PM")],
  Monday: [createRange("9:00 AM", "5:00 PM")],
  Saturday: [],
  Sunday: [],
  Thursday: [createRange("9:00 AM", "5:00 PM")],
  Tuesday: [
    createRange("9:00 AM", "1:00 PM"),
    createRange("3:00 PM", "5:00 PM"),
  ],
  Wednesday: [createRange("9:00 AM", "5:00 PM")],
};

function TimeCombobox({
  ariaLabel,
  items,
  onChange,
  value,
}: {
  ariaLabel: string;
  items: string[];
  onChange: (time: string) => void;
  value: string;
}) {
  return (
    <Combobox
      autoHighlight
      items={items}
      onValueChange={(time) => {
        if (typeof time === "string") {
          onChange(time);
        }
      }}
      value={value}
    >
      <ComboboxTrigger
        aria-label={ariaLabel}
        render={<SelectButton className="w-27 tabular-nums" size="sm" />}
      >
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxPopup aria-label={ariaLabel} className="min-w-44">
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="Search time"
            showTrigger={false}
            size="sm"
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>No times found.</ComboboxEmpty>
        <ComboboxList>
          {(time: string) => (
            <ComboboxItem key={time} value={time}>
              <span className="tabular-nums">{time}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}

function CopyTimesPopover({
  day,
  disabled,
  onCopy,
}: {
  day: Day;
  disabled: boolean;
  onCopy: (targets: Day[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  return (
    <Popover
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setSelectedDays([]);
        }
      }}
      open={open}
    >
      <Tooltip disableHoverablePopup>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  aria-label={`Copy ${day} times to other days`}
                  disabled={disabled}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            />
          }
        >
          <CopyIcon aria-hidden="true" />
        </PopoverTrigger>
        <TooltipPopup>Copy to other days</TooltipPopup>
      </Tooltip>
      <PopoverPopup align="end" className="w-44">
        <div className="flex flex-col gap-3">
          <div className="font-medium text-foreground text-sm">
            Copy times to
          </div>
          <CheckboxGroup
            aria-label={`Copy ${day} times to`}
            onValueChange={setSelectedDays}
            value={selectedDays}
          >
            {days
              .filter((target) => target !== day)
              .map((target) => (
                <Label key={target}>
                  <Checkbox value={target} />
                  {target}
                </Label>
              ))}
          </CheckboxGroup>
          <Button
            disabled={selectedDays.length === 0}
            onClick={() => {
              onCopy(selectedDays as Day[]);
              setOpen(false);
            }}
            size="sm"
          >
            Apply
          </Button>
        </div>
      </PopoverPopup>
    </Popover>
  );
}

export default function Particle() {
  const [availability, setAvailability] =
    useState<Record<Day, TimeRange[]>>(defaultAvailability);

  const setDayRanges = (day: Day, ranges: TimeRange[]) => {
    setAvailability((prev) => ({ ...prev, [day]: ranges }));
  };

  const toggleDay = (day: Day, enabled: boolean) => {
    setDayRanges(day, enabled ? [createRange("9:00 AM", "5:00 PM")] : []);
  };

  const addRange = (day: Day) => {
    const ranges = availability[day];
    const lastRange = ranges[ranges.length - 1];
    if (!lastRange) {
      setDayRanges(day, [createRange("9:00 AM", "5:00 PM")]);
      return;
    }
    const startIndex = Math.min(
      timeIndex(lastRange.end) + 4,
      timeOptions.length - 2,
    );
    const endIndex = Math.min(startIndex + 4, timeOptions.length - 1);
    setDayRanges(day, [
      ...ranges,
      createRange(timeOptions[startIndex] ?? "", timeOptions[endIndex] ?? ""),
    ]);
  };

  const removeRange = (day: Day, id: number) => {
    setDayRanges(
      day,
      availability[day].filter((range) => range.id !== id),
    );
  };

  const updateStart = (day: Day, id: number, start: string) => {
    setDayRanges(
      day,
      availability[day].map((range) => {
        if (range.id !== id) return range;
        const end =
          timeIndex(start) >= timeIndex(range.end)
            ? (timeOptions[
                Math.min(timeIndex(start) + 4, timeOptions.length - 1)
              ] ?? range.end)
            : range.end;
        return { ...range, end, start };
      }),
    );
  };

  const updateEnd = (day: Day, id: number, end: string) => {
    setDayRanges(
      day,
      availability[day].map((range) =>
        range.id === id ? { ...range, end } : range,
      ),
    );
  };

  const copyTo = (source: Day, targets: Day[]) => {
    setAvailability((prev) => {
      const next = { ...prev };
      for (const target of targets) {
        next[target] = prev[source].map((range) =>
          createRange(range.start, range.end),
        );
      }
      return next;
    });
  };

  return (
    <TooltipProvider delay={0}>
      <div className="divide-y">
        {days.map((day) => {
          const ranges = availability[day];
          const lastRange = ranges[ranges.length - 1];
          const addDisabled = lastRange
            ? timeIndex(lastRange.end) >= timeOptions.length - 2
            : false;

          return (
            <div
              className="flex flex-col gap-4 py-3 first:pt-0 last:pb-0 md:flex-row md:flex-wrap md:items-start"
              key={day}
            >
              <Label className="flex h-8 w-30 shrink-0 items-center gap-2.5 sm:h-7">
                <Switch
                  checked={ranges.length > 0}
                  onCheckedChange={(checked) => toggleDay(day, checked)}
                />
                {day}
              </Label>
              <div className="flex w-full min-w-0 items-start gap-4 md:flex-1">
                <div className="flex min-w-0 flex-col gap-2">
                  {ranges.length === 0 ? (
                    <p className="flex h-8 items-center text-muted-foreground sm:h-7 sm:text-sm">
                      Unavailable
                    </p>
                  ) : (
                    ranges.map((range) => (
                      <div className="flex items-center gap-2" key={range.id}>
                        <TimeCombobox
                          ariaLabel={`${day} start time`}
                          items={startTimeOptions}
                          onChange={(start) =>
                            updateStart(day, range.id, start)
                          }
                          value={range.start}
                        />
                        <span
                          aria-hidden="true"
                          className="text-muted-foreground"
                        >
                          –
                        </span>
                        <TimeCombobox
                          ariaLabel={`${day} end time`}
                          items={timeOptions.slice(timeIndex(range.start) + 1)}
                          onChange={(end) => updateEnd(day, range.id, end)}
                          value={range.end}
                        />
                        <Tooltip disableHoverablePopup>
                          <TooltipTrigger
                            render={
                              <Button
                                aria-label={`Delete ${range.start} to ${range.end} on ${day}`}
                                onClick={() => removeRange(day, range.id)}
                                size="icon-sm"
                                variant="ghost"
                              />
                            }
                          >
                            <XIcon aria-hidden="true" />
                          </TooltipTrigger>
                          <TooltipPopup>Delete range</TooltipPopup>
                        </Tooltip>
                      </div>
                    ))
                  )}
                </div>
                <div className="ml-auto flex shrink-0 gap-1">
                  <Tooltip disableHoverablePopup>
                    <TooltipTrigger
                      render={
                        <Button
                          aria-label={`Add time range to ${day}`}
                          disabled={addDisabled}
                          onClick={() => addRange(day)}
                          size="icon-sm"
                          variant="ghost"
                        />
                      }
                    >
                      <PlusIcon aria-hidden="true" />
                    </TooltipTrigger>
                    <TooltipPopup>Add range</TooltipPopup>
                  </Tooltip>
                  <CopyTimesPopover
                    day={day}
                    disabled={ranges.length === 0}
                    onCopy={(targets) => copyTo(day, targets)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
