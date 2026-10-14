"use client";

import {
  DayButton as CalendarDayButton,
  type DayButtonProps,
} from "@daypicker/react";
import { format } from "date-fns";
import { useEffect, useId, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Calendar } from "@/registry/default/ui/calendar";

const GOOD_PRICE_THRESHOLD = 100;

export default function Particle() {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);

  const [mockPriceData, setMockPriceData] = useState<Record<string, number>>(
    {},
  );
  useEffect(() => {
    const generateMockPriceData = () => {
      const data: Record<string, number> = {};
      const todayDate = new Date();

      for (let i = 0; i < 180; i++) {
        const date = new Date(todayDate);
        date.setDate(todayDate.getDate() + i);
        const dateKey = format(date, "yyyy-MM-dd");
        const randomPrice = Math.floor(Math.random() * (200 - 80 + 1)) + 80;
        data[dateKey] = randomPrice;
      }
      return data;
    };
    setMockPriceData(generateMockPriceData());
  }, []);

  const isDateDisabled = (date: Date) => {
    return !mockPriceData[format(date, "yyyy-MM-dd")];
  };

  return (
    <Calendar
      classNames={{
        day_button: "size-12",
        month:
          "relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4",
        months: "sm:flex-col md:flex-row gap-8",
        today: "*:after:hidden",
        weekday: "w-12",
      }}
      components={{
        DayButton: (props: DayButtonProps) => (
          <DayButton {...props} prices={mockPriceData} />
        ),
      }}
      disabled={isDateDisabled}
      mode="single"
      numberOfMonths={2}
      onSelect={setDate}
      pagedNavigation
      selected={date}
      showOutsideDays={false}
    />
  );
}

function DayButton(props: DayButtonProps & { prices: Record<string, number> }) {
  const { day, prices, ...buttonProps } = props;
  const priceId = useId();
  const price = prices[format(day.date, "yyyy-MM-dd")];
  const isGoodPrice = price !== undefined && price < GOOD_PRICE_THRESHOLD;

  return (
    <CalendarDayButton
      {...buttonProps}
      aria-describedby={price !== undefined ? priceId : undefined}
      day={day}
    >
      <span className="flex flex-col">
        {props.children}
        {price && (
          <span
            id={priceId}
            className={cn(
              "font-normal text-xs",
              isGoodPrice
                ? "text-success-foreground"
                : "in-data-selected:text-primary-foreground/70 text-muted-foreground",
            )}
          >
            ${price}
          </span>
        )}
      </span>
    </CalendarDayButton>
  );
}
