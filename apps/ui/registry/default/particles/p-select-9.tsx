"use client";

import { Code2Icon, GlobeIcon, LayersIcon, ZapIcon } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const items = [
  { icon: LayersIcon, label: "Components", value: "components" },
  { icon: ZapIcon, label: "Performance", value: "performance" },
  { icon: GlobeIcon, label: "Network", value: "network" },
  { icon: Code2Icon, label: "Development", value: "development" },
];

export default function Particle() {
  return (
    <Select defaultValue={items[0]} itemToStringValue={(item) => item.value}>
      <SelectTrigger aria-label="Select category">
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <item.icon />
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex items-center gap-2">
              <item.icon />
              <span className="truncate">{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
