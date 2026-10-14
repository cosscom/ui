"use client";

import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const countries = [
  {
    continent: "America",
    items: [
      { flag: "\u{1F1FA}\u{1F1F8}", label: "United States", value: "us" },
      { flag: "\u{1F1E8}\u{1F1E6}", label: "Canada", value: "ca" },
      { flag: "\u{1F1F2}\u{1F1FD}", label: "Mexico", value: "mx" },
    ],
  },
  {
    continent: "Europe",
    items: [
      { flag: "\u{1F1EC}\u{1F1E7}", label: "United Kingdom", value: "gb" },
      { flag: "\u{1F1EB}\u{1F1F7}", label: "France", value: "fr" },
      { flag: "\u{1F1E9}\u{1F1EA}", label: "Germany", value: "de" },
    ],
  },
  {
    continent: "Asia",
    items: [
      { flag: "\u{1F1E8}\u{1F1F3}", label: "China", value: "cn" },
      { flag: "\u{1F1EF}\u{1F1F5}", label: "Japan", value: "jp" },
      { flag: "\u{1F1EE}\u{1F1F3}", label: "India", value: "in" },
    ],
  },
];

const allItems = countries.flatMap((c) => c.items);

export default function Particle() {
  return (
    <Select
      defaultValue={allItems.find((item) => item.value === "ca")}
      itemToStringValue={(item) => item.value}
    >
      <SelectTrigger aria-label="Select country">
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{item.flag}</span>
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {countries.map((group, index) => (
          <SelectGroup key={group.continent}>
            {index > 0 && <SelectSeparator />}
            <SelectGroupLabel>{group.continent}</SelectGroupLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item}>
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{item.flag}</span>
                  <span className="truncate">{item.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectPopup>
    </Select>
  );
}
