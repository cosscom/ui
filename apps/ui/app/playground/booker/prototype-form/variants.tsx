"use client";

// PROTOTYPE ONLY. The chosen layout of the confirm step. The two layouts that
// lost are on the `prototype/booker-form` branch.

import { Button } from "@/registry/default/ui/button";
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

function missingRequired(fields: ProtoField[], values: FieldValues) {
  return fields.filter(
    (field) => field.required && isFieldEmpty(values[field.slug]),
  ).length;
}

/**
 * One list. The Booker never changes what the host decided: every field in
 * the order the API returns, nothing optional hidden or moved, no steps. The
 * Confirm bar is pinned to the bottom and counts the required fields still
 * empty, so a long form stays usable.
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
        <FieldBlock
          field={field}
          key={field.slug}
          lockPrefilled={props.lockPrefilled}
          setValue={props.setValue}
          showErrors={props.showErrors}
          values={props.values}
        />
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
