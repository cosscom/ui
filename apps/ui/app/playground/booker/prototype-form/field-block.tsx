"use client";

// PROTOTYPE ONLY. One booking field: label, control and error. Shared by the
// variants, which differ in how they group and lay fields out.

import { UserPlusIcon, XIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Input } from "@/registry/default/ui/input";
import { Label } from "@/registry/default/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import { Textarea } from "@/registry/default/ui/textarea";
import type { FieldValue, FieldValues, ProtoField } from "./fixtures";

export type FieldBlockProps = {
  field: ProtoField;
  values: FieldValues;
  setValue: (slug: string, value: FieldValue | undefined) => void;
  showErrors: boolean;
  lockPrefilled: boolean;
  className?: string;
};

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive-foreground">
      *
    </span>
  );
}

const inputTypes = {
  address: "text",
  email: "email",
  name: "text",
  phone: "tel",
  shortText: "text",
  url: "url",
} as const;

export function FieldBlock({
  field,
  values,
  setValue,
  showErrors,
  lockPrefilled,
  className,
}: FieldBlockProps) {
  const value = values[field.slug];
  const error = showErrors ? field.error : undefined;
  const locked =
    lockPrefilled && field.lockedOnPrefill === true && value !== undefined;
  const text = typeof value === "string" ? value : "";
  const list = Array.isArray(value) ? value : [];

  if (field.kind === "checkbox") {
    return (
      <Field className={className} invalid={Boolean(error)} name={field.slug}>
        <FieldLabel className="items-start font-normal">
          <Checkbox
            checked={value === true}
            onCheckedChange={(checked) => setValue(field.slug, checked)}
          />
          <span>
            {field.label} {field.required ? <RequiredMark /> : null}
          </span>
        </FieldLabel>
        {error ? <FieldError match>{error}</FieldError> : null}
      </Field>
    );
  }

  if (field.kind === "guests") {
    return (
      <div className={className}>
        <div className="flex flex-col gap-2">
          {list.length > 0 ? (
            <span className="font-medium text-base/4.5 sm:text-sm/4">
              {field.label}
            </span>
          ) : null}
          {list.map((guest, index) => (
            <div
              className="flex w-full items-center gap-2"
              // biome-ignore lint/suspicious/noArrayIndexKey: prototype
              key={index}
            >
              <Input
                aria-label={`Guest ${index + 1} email`}
                className="flex-1"
                onChange={(event) => {
                  const next = [...list];
                  next[index] = event.target.value;
                  setValue(field.slug, next);
                }}
                placeholder="guest@example.com"
                type="email"
                value={guest}
              />
              <Button
                aria-label="Remove guest"
                onClick={() =>
                  setValue(
                    field.slug,
                    list.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                size="icon"
                type="button"
                variant="outline"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button
            className="h-auto! self-start px-0.5"
            onClick={() => setValue(field.slug, [...list, ""])}
            type="button"
            variant="link"
          >
            <UserPlusIcon aria-hidden="true" />
            Add guests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Field className={className} invalid={Boolean(error)} name={field.slug}>
      <FieldLabel>
        {field.label} {field.required ? <RequiredMark /> : null}
        {locked ? (
          <span className="font-normal text-muted-foreground text-xs">
            Prefilled
          </span>
        ) : null}
      </FieldLabel>

      {field.kind === "name" ||
      field.kind === "email" ||
      field.kind === "phone" ||
      field.kind === "shortText" ||
      field.kind === "url" ||
      field.kind === "address" ? (
        <Input
          disabled={locked}
          onChange={(event) => setValue(field.slug, event.target.value)}
          placeholder={field.placeholder}
          type={inputTypes[field.kind]}
          value={text}
        />
      ) : null}

      {field.kind === "longText" ? (
        <Textarea
          disabled={locked}
          onChange={(event) => setValue(field.slug, event.target.value)}
          placeholder={field.placeholder}
          rows={3}
          value={text}
        />
      ) : null}

      {field.kind === "number" ? (
        <NumberField
          min={0}
          onValueChange={(next) =>
            setValue(field.slug, next === null ? undefined : String(next))
          }
          value={text === "" ? null : Number(text)}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-label={field.label} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      ) : null}

      {field.kind === "select" ? (
        <Select
          onValueChange={(next) =>
            setValue(field.slug, typeof next === "string" ? next : undefined)
          }
          value={text === "" ? null : text}
        >
          <SelectTrigger aria-label={field.label}>
            <SelectValue>
              {(selected: string | null) => selected ?? "Select…"}
            </SelectValue>
          </SelectTrigger>
          <SelectPopup>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      ) : null}

      {field.kind === "multiSelect" ? (
        <Select
          multiple
          onValueChange={(next) =>
            setValue(field.slug, Array.isArray(next) ? next : [])
          }
          value={list}
        >
          <SelectTrigger aria-label={field.label}>
            <SelectValue>
              {(selected: string[]) =>
                selected.length === 0 ? "Select…" : selected.join(", ")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      ) : null}

      {field.kind === "radioGroup" ? (
        <RadioGroup
          aria-label={field.label}
          onValueChange={(next) => setValue(field.slug, String(next))}
          value={text}
        >
          {(field.options ?? []).map((option) => (
            <Label className="font-normal" key={option}>
              <Radio value={option} /> {option}
            </Label>
          ))}
        </RadioGroup>
      ) : null}

      {field.kind === "checkboxGroup" ? (
        <CheckboxGroup
          aria-label={field.label}
          onValueChange={(next) => setValue(field.slug, next)}
          value={list}
        >
          {(field.options ?? []).map((option) => (
            <Label className="font-normal" key={option}>
              <Checkbox value={option} />
              {option}
            </Label>
          ))}
        </CheckboxGroup>
      ) : null}

      {field.kind === "location" ? (
        <LocationChoice
          field={field}
          setValue={setValue}
          text={text}
          values={values}
        />
      ) : null}

      {error ? <FieldError match>{error}</FieldError> : null}
    </Field>
  );
}

function LocationChoice({
  field,
  text,
  values,
  setValue,
}: {
  field: ProtoField;
  text: string;
  values: FieldValues;
  setValue: FieldBlockProps["setValue"];
}) {
  const options = field.locationOptions ?? [];
  const selected = options.find((option) => option.label === text);
  const inputSlug = `${field.slug}:input`;
  const inputValue = values[inputSlug];

  return (
    <div className="flex w-full flex-col gap-2">
      <RadioGroup
        aria-label={field.label}
        onValueChange={(next) => setValue(field.slug, String(next))}
        value={text}
      >
        {options.map((option) => (
          <Label className="font-normal" key={option.label}>
            <Radio value={option.label} /> {option.label}
          </Label>
        ))}
      </RadioGroup>
      {selected?.input ? (
        <Input
          aria-label={
            selected.input === "phone" ? "Your phone number" : "Your address"
          }
          onChange={(event) => setValue(inputSlug, event.target.value)}
          placeholder={
            selected.input === "phone" ? "+1 555 010 0199" : "Street, city"
          }
          type={selected.input === "phone" ? "tel" : "text"}
          value={typeof inputValue === "string" ? inputValue : ""}
        />
      ) : null}
    </div>
  );
}

export function TermsNote() {
  return (
    <p className="text-muted-foreground text-xs">
      By proceeding, you agree to Cal.com’s{" "}
      <a
        className="text-foreground underline-offset-4 hover:underline"
        href="https://cal.com/terms"
        rel="noreferrer"
        target="_blank"
      >
        Terms
      </a>{" "}
      and{" "}
      <a
        className="text-foreground underline-offset-4 hover:underline"
        href="https://cal.com/privacy"
        rel="noreferrer"
        target="_blank"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
}
