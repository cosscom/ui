"use client";

import { Clock3Icon } from "lucide-react";
import { useMemo } from "react";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

type DurationPickerProps = {
  formatLabel: (minutes: number) => string;
  onValueChange: (minutes: number) => void;
  options: number[];
  value: number;
};

export function DurationPicker({
  formatLabel,
  onValueChange,
  options,
  value,
}: DurationPickerProps) {
  const items = useMemo(
    () =>
      options.map((minutes) => ({
        label: formatLabel(minutes),
        value: minutes,
      })),
    [formatLabel, options],
  );

  return (
    <div className="flex items-center gap-2">
      <Clock3Icon
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
        aria-hidden="true"
      />
      <Select
        aria-label="Select duration"
        items={items}
        onValueChange={(next) => {
          if (typeof next === "number") {
            onValueChange(next);
          }
        }}
        value={value}
      >
        <SelectTrigger className="w-fit min-w-0" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {items.map(({ label, value: minutes }) => (
            <SelectItem key={minutes} value={minutes}>
              {label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}
