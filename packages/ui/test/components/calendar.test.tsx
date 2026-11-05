import { describe, expect, mock, test } from "bun:test";
import { type DayPicker, defaultDateLib } from "@daypicker/react";
import { type ClassValue, clsx } from "clsx";
import type * as React from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { twMerge } from "tailwind-merge";

// Other suites mock `cn` as a plain join, and Bun module mocks persist across files.
// Restore the real implementation (clsx + tailwind-merge) for Calendar's class merging.
mock.module("@coss/ui/lib/utils", () => ({
  cn: (...inputs: ClassValue[]) => twMerge(clsx(inputs)),
}));

const { Calendar } = await import("../../src/components/calendar");

type DayPickerProps = React.ComponentProps<typeof DayPicker>;
type CalendarProps = Partial<DayPickerProps>;

const month = new Date(2026, 9, 1);

// The props Calendar hands to DayPicker.
function dayPickerProps(props: CalendarProps = {}): DayPickerProps {
  const element = Calendar(props as DayPickerProps);
  return element.props as DayPickerProps;
}

function render(props: CalendarProps): string {
  return renderToStaticMarkup(
    createElement(Calendar, { month, ...props } as DayPickerProps),
  );
}

function monthOptions(html: string): string[] {
  return [...html.matchAll(/<option[^>]*>([^<]*)<\/option>/g)].map(
    (match) => match[1] ?? "",
  );
}

const dropdownCaption = {
  captionLayout: "dropdown",
  endMonth: new Date(2026, 11, 1),
  startMonth: new Date(2026, 0, 1),
} as const;

describe("Calendar classNames", () => {
  test("keeps classes for parts that have no coss default", () => {
    const classNames = {
      month_grid: "custom-grid",
      root: "custom-root",
      selected: "custom-selected",
      weekdays: "custom-weekdays",
    };
    const merged = dayPickerProps({ classNames }).classNames;

    expect(merged?.month_grid).toBe("custom-grid");
    expect(merged?.root).toBe("custom-root");
    expect(merged?.selected).toBe("custom-selected");
    expect(merged?.weekdays).toBe("custom-weekdays");

    const html = render({
      classNames,
      mode: "single",
      selected: new Date(2026, 9, 14),
    });
    for (const className of Object.values(classNames)) {
      expect(html).toContain(className);
    }
  });

  test("merges custom classes with the coss defaults of styled parts", () => {
    const merged = dayPickerProps({
      classNames: { weekday: "custom-weekday" },
    }).classNames;

    expect(merged?.weekday).toContain("custom-weekday");
    expect(merged?.weekday).toContain("text-muted-foreground/72");
  });

  test("lets a conflicting utility override the default one", () => {
    const merged = dayPickerProps({
      classNames: { day: "text-lg" },
    }).classNames;

    expect(merged?.day).toContain("text-lg");
    expect(merged?.day).not.toContain("text-sm");
    expect(merged?.day).toContain("size-(--cell-size)");
  });

  test("uses the defaults when classNames is undefined, empty, or has undefined values", () => {
    const defaults = dayPickerProps().classNames;

    expect(dayPickerProps({ classNames: {} }).classNames).toEqual(defaults);
    expect(
      dayPickerProps({ classNames: { weekday: undefined } }).classNames,
    ).toEqual(defaults);
    // An undefined value for an unstyled part must not clear DayPicker's own class.
    expect(
      dayPickerProps({ classNames: { weekdays: undefined } }).classNames,
    ).not.toHaveProperty("weekdays");
  });

  test("keeps custom classes in range mode", () => {
    const html = render({
      classNames: {
        range_middle: "custom-range-middle",
        selected: "custom-selected",
      },
      mode: "range",
      selected: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 16) },
    });

    expect(html).toContain("custom-range-middle");
    expect(html).toContain("range-middle");
    expect(html).toContain("custom-selected");
  });
});

describe("Calendar formatters", () => {
  test("keeps the short month dropdown labels when another formatter is passed", () => {
    const formatWeekdayName = (weekday: Date) => `W${weekday.getDay()}`;
    const formatters = dayPickerProps({
      formatters: { formatWeekdayName },
    }).formatters;

    expect(formatters?.formatWeekdayName).toBe(formatWeekdayName);
    expect(
      formatters?.formatMonthDropdown?.(new Date(2026, 0, 15), defaultDateLib),
    ).toBe("Jan");

    const html = render({
      ...dropdownCaption,
      formatters: { formatWeekdayName },
    });
    expect(monthOptions(html).slice(0, 3)).toEqual(["Jan", "Feb", "Mar"]);
    expect(html).toContain("W0");
  });

  test("lets the consumer replace the default month dropdown formatter", () => {
    const html = render({
      ...dropdownCaption,
      formatters: {
        formatMonthDropdown: (date: Date) => `Month ${date.getMonth() + 1}`,
      },
    });

    expect(monthOptions(html).slice(0, 2)).toEqual(["Month 1", "Month 2"]);
  });

  test("uses the default when formatters is undefined or a formatter is undefined", () => {
    expect(monthOptions(render(dropdownCaption)).slice(0, 2)).toEqual([
      "Jan",
      "Feb",
    ]);
    expect(
      monthOptions(
        render({
          ...dropdownCaption,
          formatters: { formatMonthDropdown: undefined },
        }),
      ).slice(0, 2),
    ).toEqual(["Jan", "Feb"]);
  });
});
