"use client";

// PROTOTYPE ONLY. Three structurally different takes on the confirm step.

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible";
import { FieldBlock, type FieldBlockProps, TermsNote } from "./field-block";
import {
  type FieldValues,
  getFormLayout,
  isFieldEmpty,
  isFieldVisible,
  type ProtoField,
} from "./fixtures";

export type VariantProps = {
  fields: ProtoField[];
  values: FieldValues;
  setValue: FieldBlockProps["setValue"];
  showErrors: boolean;
  lockPrefilled: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

function blockProps(props: VariantProps) {
  return {
    lockPrefilled: props.lockPrefilled,
    setValue: props.setValue,
    showErrors: props.showErrors,
    values: props.values,
  };
}

function missingRequired(fields: ProtoField[], values: FieldValues) {
  return fields.filter(
    (field) => field.required && isFieldEmpty(values[field.slug]),
  ).length;
}

/**
 * A. One list (the chosen direction). The Booker never changes what the host
 * decided: every field in the order the API returns, nothing optional hidden
 * or moved, no steps. The Confirm bar is pinned to the bottom and counts the
 * required fields still empty, so a long form stays usable.
 */
export function VariantA(props: VariantProps) {
  const visible = props.fields.filter((field) =>
    isFieldVisible(field, props.values),
  );
  // Only fields on screen count: a conditional required field joins the
  // count when it appears.
  const left = missingRequired(visible, props.values);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        props.onConfirm();
      }}
    >
      {visible.map((field) => (
        <FieldBlock field={field} key={field.slug} {...blockProps(props)} />
      ))}
      <TermsNote />
      <div className="sticky bottom-0 -mx-4 @5xl:-mx-6 -mb-4 @5xl:-mb-6 flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] @3xl:rounded-es-none border-t bg-card @5xl:px-6 px-4 py-3">
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {left === 0
            ? "Ready to confirm"
            : `${left} required ${left === 1 ? "field" : "fields"} left`}
        </span>
        <div className="flex gap-2">
          <Button onClick={props.onBack} type="button" variant="ghost">
            Back
          </Button>
          <Button type="submit">Confirm</Button>
        </div>
      </div>
    </form>
  );
}

/**
 * B. Two steps, as a cut in the host's list. The Booker never changes what
 * the host decided: every field stays in the order the API returns, nothing
 * optional is hidden, notes and guests stay where they are. Step 1 is
 * everything before the host's first custom question, step 2 is the rest.
 * No custom question, a custom question first, or a short form: one list.
 */
export function VariantB(props: VariantProps) {
  const [chosenStep, setStep] = useState<1 | 2>(1);
  const layout = getFormLayout(props.fields);
  const renderable = props.fields.filter((field) => field.kind !== "unknown");
  const isVisible = (field: ProtoField) => isFieldVisible(field, props.values);
  // The cut is made on the list as returned, not on what is visible right
  // now, so it does not move while the attendee answers.
  const steps =
    layout.steps === 2
      ? [
          {
            fields: renderable.slice(0, layout.cutIndex).filter(isVisible),
            title: "Your details",
          },
          {
            fields: renderable.slice(layout.cutIndex).filter(isVisible),
            title: "A few questions",
          },
        ]
      : [{ fields: renderable.filter(isVisible), title: "Your details" }];
  const step = steps.length === 1 ? 1 : chosenStep;
  const current = steps[step - 1] ?? steps[0];
  const isLast = step >= steps.length;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (isLast) {
          props.onConfirm();
        } else {
          setStep(2);
        }
      }}
    >
      {steps.length > 1 ? (
        <ol className="flex items-center gap-2 text-sm">
          {steps.map((item, index) => {
            const number = index + 1;
            const active = number === step;
            return (
              <li className="flex flex-1 items-center gap-2" key={item.title}>
                <button
                  aria-current={active ? "step" : undefined}
                  className="flex items-center gap-2 text-start"
                  onClick={() => setStep(number === 1 ? 1 : 2)}
                  type="button"
                >
                  <span
                    className={
                      active
                        ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs"
                        : "flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs"
                    }
                  >
                    {number}
                  </span>
                  <span
                    className={active ? "font-medium" : "text-muted-foreground"}
                  >
                    {item.title}
                  </span>
                </button>
                {number < steps.length ? (
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="flex flex-col gap-4">
        {current?.fields.map((field) => (
          <FieldBlock field={field} key={field.slug} {...blockProps(props)} />
        ))}
      </div>

      {isLast ? <TermsNote /> : null}

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-muted-foreground text-xs">
          {steps.length > 1 ? `Step ${step} of ${steps.length}` : null}
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() => (step === 1 ? props.onBack() : setStep(1))}
            type="button"
            variant="ghost"
          >
            Back
          </Button>
          <Button type="submit">{isLast ? "Confirm" : "Continue"}</Button>
        </div>
      </div>
    </form>
  );
}

/**
 * C. Essentials first. Only what is required shows, short fields side by
 * side. Everything optional sits behind one disclosure. The Confirm button
 * stays pinned and says how much is left.
 */
export function VariantC(props: VariantProps) {
  const visible = props.fields.filter((field) =>
    isFieldVisible(field, props.values),
  );
  const required = visible.filter((field) => field.required);
  const optional = visible.filter((field) => !field.required);
  const left = missingRequired(required, props.values);
  const shortKinds = ["name", "email", "phone", "shortText", "select"];

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        props.onConfirm();
      }}
    >
      <div className="grid @md:grid-cols-2 gap-4">
        {required.map((field) => (
          <FieldBlock
            className={
              shortKinds.includes(field.kind) ? undefined : "@md:col-span-2"
            }
            field={field}
            key={field.slug}
            {...blockProps(props)}
          />
        ))}
      </div>

      {optional.length > 0 ? (
        <Collapsible className="rounded-lg border">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2.5 font-medium text-sm data-panel-open:[&_svg]:rotate-180">
            <span>
              Optional details{" "}
              <span className="font-normal text-muted-foreground">
                {optional.length}
              </span>
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-4 opacity-80 transition-transform"
            />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="flex flex-col gap-4 border-t p-3">
              {optional.map((field) => (
                <FieldBlock
                  field={field}
                  key={field.slug}
                  {...blockProps(props)}
                />
              ))}
            </div>
          </CollapsiblePanel>
        </Collapsible>
      ) : null}

      <div className="sticky bottom-0 -mx-4 @5xl:-mx-6 -mb-4 @5xl:-mb-6 flex flex-col gap-3 border-t bg-card @5xl:px-6 px-4 py-3">
        <TermsNote />
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs">
            {left === 0
              ? "Ready to confirm"
              : `${left} required ${left === 1 ? "field" : "fields"} left`}
          </span>
          <div className="flex gap-2">
            <Button onClick={props.onBack} type="button" variant="ghost">
              Back
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
