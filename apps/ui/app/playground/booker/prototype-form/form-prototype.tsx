"use client";

// PROTOTYPE ONLY. The Booker's card with a static event-details pane on the
// left and one form variant on the right, so each variant is judged in place.

import { CalendarIcon, Clock3Icon, GlobeIcon, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
              <div className="flex flex-col gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-muted font-medium text-xs">
                  RA
                </span>
                <p className="font-medium text-muted-foreground sm:text-sm">
                  Rick Astley
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold font-heading @3xl:@max-5xl:text-lg text-xl">
                  Product demo
                </h1>
                <p className="text-muted-foreground sm:text-sm">
                  A walkthrough tailored to your team, with time for questions.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:text-sm">
              <div className="flex gap-2">
                <CalendarIcon
                  aria-hidden="true"
                  className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                />
                <span>Monday, November 23, 2026 10:00 – 10:30am</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3Icon
                  aria-hidden="true"
                  className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                />
                <span>30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <VideoIcon
                  aria-hidden="true"
                  className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                />
                <span>
                  {fields.some((field) => field.kind === "location")
                    ? "3 location options"
                    : "Cal Video"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GlobeIcon
                  aria-hidden="true"
                  className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4"
                />
                <span>Europe/Rome</span>
              </div>
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
