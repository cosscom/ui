"use client";

import { ChevronsUpDownIcon, GlobeIcon, SearchIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/registry/default/ui/button";
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

type TimezoneOption = {
  label: string;
  numericOffset: number;
  offset: string;
  value: string;
};

type TimezonePickerProps = {
  value: string;
  onValueChange: (value: string) => void;
};

function formatTimezoneLabel(timezone: string): string {
  return timezone.replace(/_/g, " ");
}

export function TimezoneDisplay({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2">
      <GlobeIcon
        className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
        aria-hidden="true"
      />
      <span>{formatTimezoneLabel(value)}</span>
    </div>
  );
}

export function TimezonePicker({ value, onValueChange }: TimezonePickerProps) {
  const timezoneOptions = useMemo<TimezoneOption[]>(() => {
    const rawTimezones =
      typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : [
            "UTC",
            "Europe/Rome",
            "Europe/London",
            "America/New_York",
            "America/Los_Angeles",
            "Asia/Tokyo",
          ];

    return rawTimezones
      .map((timezone) => {
        const formatter = new Intl.DateTimeFormat("en", {
          timeZone: timezone,
          timeZoneName: "shortOffset",
        });
        const parts = formatter.formatToParts(new Date());
        const offset =
          parts.find((part) => part.type === "timeZoneName")?.value || "";
        const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

        const offsetMatch = offset.match(/GMT([+-]?)(\d+)(?::(\d+))?/);
        const sign = offsetMatch?.[1] === "-" ? -1 : 1;
        const hours = Number.parseInt(offsetMatch?.[2] || "0", 10);
        const minutes = Number.parseInt(offsetMatch?.[3] || "0", 10);
        const totalMinutes = sign * (hours * 60 + minutes);

        return {
          label: formatTimezoneLabel(timezone),
          numericOffset: totalMinutes,
          offset: modifiedOffset,
          value: timezone,
        };
      })
      .sort((a, b) => a.numericOffset - b.numericOffset);
  }, []);

  const selectedTimezoneItem =
    timezoneOptions.find((item) => item.value === value) ?? null;

  return (
    <div className="flex items-center gap-2">
      <GlobeIcon
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
        aria-hidden="true"
      />
      <Combobox
        autoHighlight
        itemToStringValue={(item) => item?.label ?? ""}
        items={timezoneOptions}
        onValueChange={(next) => onValueChange(next?.value ?? value)}
        value={selectedTimezoneItem}
      >
        <ComboboxTrigger
          render={
            <Button
              className="min-w-0 shrink justify-between font-normal"
              size="sm"
              variant="outline"
            />
          }
        >
          <span className="truncate">
            <ComboboxValue placeholder="Select timezone" />
          </span>
          <ChevronsUpDownIcon className="-me-1!" />
        </ComboboxTrigger>
        <ComboboxPopup aria-label="Select timezone" className="w-72">
          <div className="border-b p-2">
            <ComboboxInput
              size="sm"
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              placeholder="e.g. Europe/London"
              showTrigger={false}
              startAddon={<SearchIcon />}
            />
          </div>
          <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item.value}
                value={item}
                className="pe-2 *:[div]:flex *:[div]:min-w-0 *:[div]:items-center *:[div]:justify-between *:[div]:gap-2"
              >
                <span className="truncate">{item.label}</span>
                <span className="whitespace-nowrap font-medium text-muted-foreground text-xs sm:text-[10px]">
                  {item.offset}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </div>
  );
}
