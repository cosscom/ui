"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Calendar } from "@/registry/default/ui/calendar";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

export default function Particle() {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={<Button className="w-full justify-start" variant="outline" />}
      >
        <CalendarIcon />
        {date ? format(date, "PPP") : "Pick a date"}
      </PopoverTrigger>
      <PopoverPopup>
        <Calendar
          defaultMonth={date}
          mode="single"
          onSelect={handleSelect}
          selected={date}
        />
      </PopoverPopup>
    </Popover>
  );
}
