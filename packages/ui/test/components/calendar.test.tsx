import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Calendar } from "../../src/components/calendar";

function countWeeks(calendar: React.ReactElement) {
  const markup = renderToStaticMarkup(calendar);
  return [...markup.matchAll(/<tr\b/g)].length - 1;
}

test("renders six weeks by default for months with different week counts", () => {
  expect(countWeeks(<Calendar month={new Date(2024, 1, 1)} />)).toBe(6);
  expect(countWeeks(<Calendar month={new Date(2024, 2, 1)} />)).toBe(6);
});

test("allows a caller to opt out of fixed weeks", () => {
  expect(
    countWeeks(<Calendar fixedWeeks={false} month={new Date(2024, 1, 1)} />),
  ).toBe(5);
});

test("supports native month and year dropdowns with fixed weeks", () => {
  const calendar = (
    <Calendar
      captionLayout="dropdown"
      defaultMonth={new Date(2024, 1, 1)}
      endMonth={new Date(2026, 11)}
      startMonth={new Date(2022, 0)}
    />
  );
  const markup = renderToStaticMarkup(calendar);

  expect(markup).toContain('aria-label="Choose the Month"');
  expect(markup).toContain('aria-label="Choose the Year"');
  expect(countWeeks(calendar)).toBe(6);
});
