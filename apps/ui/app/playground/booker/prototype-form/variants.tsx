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
 * A. One list. Every field in the order the event type gives them, one
 * column, buttons at the end. What Cal's own booking page does.
 */
export function VariantA(props: VariantProps) {
  const visible = props.fields.filter((field) =>
    isFieldVisible(field, props.values),
  );

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
      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={props.onBack} type="button" variant="ghost">
          Back
        </Button>
        <Button type="submit">Confirm</Button>
      </div>
    </form>
  );
}

/**
 * B. Two steps. "Your details" first (Cal's own fields), then the host's
 * questions. Each step is short; a step header shows where you are.
 */
export function VariantB(props: VariantProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const visible = props.fields.filter((field) =>
    isFieldVisible(field, props.values),
  );
  const details = visible.filter(
    (field) =>
      field.system && field.kind !== "guests" && field.slug !== "notes",
  );
  const questions = visible.filter((field) => !details.includes(field));
  const hasQuestions = questions.some((field) => !field.system);
  const steps = hasQuestions
    ? [
        { fields: details, title: "Your details" },
        { fields: questions, title: "A few questions" },
      ]
    : [{ fields: visible, title: "Your details" }];
  const current = steps[Math.min(step, steps.length) - 1] ?? steps[0];
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
