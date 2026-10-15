"use client";

import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/default/ui/field";
import { OTPField, OTPFieldInput } from "@/registry/default/ui/otp-field";

const OTP_LENGTH = 6;

const OTP_SLOT_KEYS = Array.from(
  { length: OTP_LENGTH },
  (_, i) => `otp-slot-${i}`,
);

export default function Particle() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const valid = value.length === OTP_LENGTH && value === "123456";

  return (
    <Field className="items-center">
      <FieldLabel>Verification code</FieldLabel>
      <OTPField
        length={OTP_LENGTH}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          setInvalid(
            nextValue.length === OTP_LENGTH ? nextValue !== "123456" : false,
          );
        }}
        value={value}
      >
        {OTP_SLOT_KEYS.map((slotKey, index) => (
          <OTPFieldInput
            key={slotKey}
            aria-invalid={invalid || undefined}
            aria-label={`Character ${index + 1} of ${OTP_LENGTH}`}
          />
        ))}
      </OTPField>
      {!valid && !invalid && (
        <FieldDescription>Enter `123456` to pass validation.</FieldDescription>
      )}
      {invalid && <FieldError match>Code must be 123456.</FieldError>}
      {valid && <FieldDescription>Code verified.</FieldDescription>}
    </Field>
  );
}
