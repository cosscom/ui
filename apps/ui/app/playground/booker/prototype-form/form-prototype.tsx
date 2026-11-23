"use client";

// PROTOTYPE ONLY. The Booker's card with a static event-details pane on the
// left and one form variant on the right, so each variant is judged in place.

import { useEffect, useState } from "react";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { EventDescription } from "@/registry/default/atoms/booker/event-description";
import {
  EventTitle,
  FixedDuration,
  HostIdentity,
  SelectedTime,
} from "@/registry/default/atoms/booker/event-meta";
import { Location } from "@/registry/default/atoms/booker/location";
import { TimezoneDisplay } from "@/registry/default/atoms/booker/timezone-picker";
import { Card } from "@/registry/default/ui/card";
import { PrototypeSwitcher } from "../../prototype-switcher";
import {
  type FieldValue,
  type FieldValues,
  getInitialValues,
  getScenarioFields,
  type ScenarioKey,
  scenarios,
  type VariantKey,
  variants,
} from "./fixtures";
import { VariantA, type VariantProps } from "./variants";

const variantComponents: Record<
  VariantKey,
  (props: VariantProps) => React.ReactElement
> = { A: VariantA };

const labels = getBookerLabels();

// Monday, November 23, 2026 at 10:00, local time.
const SELECTED_START = new Date(2026, 10, 23, 10, 0);

// The location question's three options, as the event's locations.
const LOCATION_OPTIONS = [
  { label: "Cal Video", provider: "cal-video" },
  { label: "Phone call (we call you)", provider: "" },
  { label: "In person (your address)", provider: "" },
];

export function FormPrototype({
  variant,
  scenario,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
}) {
  const fields = getScenarioFields(scenario);
  const [values, setValues] = useState<FieldValues>(() =>
    getInitialValues(scenario, fields),
  );
  const [lastAction, setLastAction] = useState("none");

  // Values survive a variant switch, so the same input can be compared across
  // layouts. A scenario switch starts over.
  useEffect(() => {
    setValues(getInitialValues(scenario, getScenarioFields(scenario)));
    setLastAction("none");
  }, [scenario]);

  const setValue = (slug: string, value: FieldValue | undefined) =>
    setValues((current) => ({ ...current, [slug]: value }));

  const Variant = variantComponents[variant];
  const skipped = fields.filter((field) => field.kind === "unknown").length;

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <Card className="@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]">
        <div className="@3xl:w-(--booker-side) @3xl:border-e border-b @3xl:border-b-0">
          <div className="flex flex-col gap-6 @5xl:p-6 p-4">
            <div className="flex flex-col gap-4">
              <HostIdentity name="Rick Astley" />
              <div className="flex flex-col gap-1">
                <EventTitle>Product demo</EventTitle>
                <EventDescription description="A walkthrough tailored to your team, with time for questions." />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:text-sm">
              <SelectedTime
                durationMinutes={30}
                is24Hour={false}
                locale="en-US"
                start={SELECTED_START}
              />
              <FixedDuration label={labels.durationMinutes(30)} />
              <Location
                labels={{
                  locationOptions: labels.locationOptions,
                  selectOnNextStep: labels.locationSelectOnNextStep,
                }}
                locations={
                  fields.some((field) => field.kind === "location")
                    ? LOCATION_OPTIONS
                    : LOCATION_OPTIONS.slice(0, 1)
                }
              />
              <TimezoneDisplay value="Europe/Rome" />
            </div>
          </div>
        </div>
        <div className="@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4">
          <Variant
            fields={fields}
            lockPrefilled={scenario === "prefilled"}
            onBack={() => setLastAction("back")}
            onConfirm={() => setLastAction("confirm (stub, nothing sent)")}
            setValue={setValue}
            showErrors={scenario === "errors"}
            values={values}
          />
        </div>
      </Card>

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            fieldOrder: fields
              .filter((field) => field.kind !== "unknown")
              .map(
                (field) => `${field.slug}${field.system ? "" : " (custom)"}`,
              ),
            lastAction,
            scenario,
            unknownOptionalFieldsSkipped: skipped,
            values,
            variant,
          },
          null,
          2,
        )}
      </pre>

      <PrototypeSwitcher
        scenario={scenario}
        scenarios={scenarios.map((item) => ({ ...item }))}
        variant={variant}
        variants={variants.map((item) => ({ ...item }))}
      />
    </div>
  );
}
