"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import { Group, GroupSeparator } from "@/registry/default/ui/group";
import { Label } from "@/registry/default/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const occurrences = [
  { date: "Wed, Jul 15", id: "occurrence-1", time: "9:00 – 9:30am" },
  { date: "Wed, Jul 15", id: "occurrence-2", time: "10:00 – 10:30am" },
  { date: "Wed, Jul 15", id: "occurrence-3", time: "11:00 – 11:30am" },
];

export default function Particle() {
  const [selected, setSelected] = useState(
    occurrences.map((occurrence) => occurrence.id),
  );

  return (
    <div className="flex gap-2">
      <Button size="xs" variant="outline">
        Reject
      </Button>
      <Group aria-label="Confirm booking">
        <Button size="xs">Confirm all</Button>
        <GroupSeparator className="bg-primary/72" />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                aria-label="Choose occurrences to confirm"
                size="icon-xs"
              />
            }
          >
            <ChevronDownIcon aria-hidden="true" />
          </PopoverTrigger>
          <PopoverPopup align="end" className="w-84">
            <div className="mb-3">
              <PopoverTitle className="text-sm">
                Confirm occurrences
              </PopoverTitle>
              <PopoverDescription className="text-xs">
                {occurrences.length} pending for this booking
              </PopoverDescription>
            </div>
            <CheckboxGroup
              aria-label="Occurrences to confirm"
              className="gap-0 self-stretch"
              onValueChange={setSelected}
              value={selected}
            >
              {occurrences.map((occurrence) => (
                <Label className="flex w-full gap-2 py-1.5" key={occurrence.id}>
                  <Checkbox value={occurrence.id} />
                  <span className="tabular-nums">{occurrence.time}</span>
                  <span className="ms-auto font-normal text-muted-foreground">
                    {occurrence.date}
                  </span>
                </Label>
              ))}
            </CheckboxGroup>
            <div className="mt-3 flex justify-end gap-2">
              <PopoverClose
                disabled={selected.length === 0}
                render={<Button size="xs" variant="ghost" />}
              >
                Reject selected
              </PopoverClose>
              <PopoverClose
                disabled={selected.length === 0}
                render={<Button size="xs" />}
              >
                Confirm selected
                <span className="text-primary-foreground/64 text-xs">
                  {selected.length}
                </span>
              </PopoverClose>
            </div>
          </PopoverPopup>
        </Popover>
      </Group>
    </div>
  );
}
