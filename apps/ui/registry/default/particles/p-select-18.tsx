"use client";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const items = [
  {
    description: "Ideal for individuals",
    label: "Standard Plan",
    value: "standard",
  },
  { description: "For professional users", label: "Pro Plan", value: "pro" },
  {
    description: "Built for large teams",
    label: "Enterprise Plan",
    value: "enterprise",
  },
];

export default function Particle() {
  return (
    <Select defaultValue={items[1]} itemToStringValue={(item) => item.value}>
      <SelectTrigger aria-label="Select plan">
        <SelectValue>
          {(item) => <span className="truncate">{item.label}</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex flex-col">
              <span className="truncate">{item.label}</span>
              <span className="truncate text-muted-foreground text-xs">
                {item.description}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
