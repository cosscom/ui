import { Field, FieldLabel } from "@/registry/default/ui/field";
import { OTPField, OTPFieldInput } from "@/registry/default/ui/otp-field";

const OTP_LENGTH = 4;

const OTP_SLOT_KEYS = Array.from(
  { length: OTP_LENGTH },
  (_, i) => `otp-slot-${i}`,
);

export default function Particle() {
  return (
    <Field>
      <FieldLabel className="sr-only">One-time password</FieldLabel>
      <OTPField length={OTP_LENGTH} size="lg">
        {OTP_SLOT_KEYS.map((slotKey, index) => (
          <OTPFieldInput
            key={slotKey}
            aria-label={
              index === 0
                ? undefined
                : `Character ${index + 1} of ${OTP_LENGTH}`
            }
          />
        ))}
      </OTPField>
    </Field>
  );
}
