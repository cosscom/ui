# coss OTP Field

## When to use

- One-time passcode entry with segmented slots.
- Verification code flows with strict length formatting.

## Install

```bash
npx shadcn@latest add @coss/otp-field
```

Manual deps from docs:

```bash
npm install @base-ui/react lucide-react
```

## Canonical imports

```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import {
  OTPField,
  OTPFieldInput,
  OTPFieldSeparator,
} from "@/components/ui/otp-field"
```

## Minimal pattern

```tsx
<Field>
  <FieldLabel className="sr-only">Verification code</FieldLabel>
  <OTPField length={6}>
    <OTPFieldInput />
    <OTPFieldInput aria-label="Character 2 of 6" />
    <OTPFieldInput aria-label="Character 3 of 6" />
    <OTPFieldSeparator />
    <OTPFieldInput aria-label="Character 4 of 6" />
    <OTPFieldInput aria-label="Character 5 of 6" />
    <OTPFieldInput aria-label="Character 6 of 6" />
  </OTPField>
</Field>
```

## Patterns from coss particles

### Key patterns

OTP with label and controlled value:

```tsx
const [value, setValue] = useState("")

<Field>
  <FieldLabel>Verification code</FieldLabel>
  <OTPField
    length={6}
    value={value}
    onValueChange={setValue}
  >
    <OTPFieldInput />
    <OTPFieldInput aria-label="Character 2 of 6" />
    <OTPFieldInput aria-label="Character 3 of 6" />
    <OTPFieldSeparator />
    <OTPFieldInput aria-label="Character 4 of 6" />
    <OTPFieldInput aria-label="Character 5 of 6" />
    <OTPFieldInput aria-label="Character 6 of 6" />
  </OTPField>
</Field>
```

Digit-only SMS-style codes use Base UI’s default `validationType` (`numeric`) and matching `inputMode`; set those props explicitly only when you need different behavior.

Ensure slot count matches `length`.

### More examples

See `p-otp-field-1` through `p-otp-field-4` and `p-otp-field-6` through `p-otp-field-10` for sizes, separators, label, custom sanitization, auto-validation, alphanumeric codes, placeholder hints, and masked entry.

## Common pitfalls

- Slot count mismatch with `length`, causing broken OTP UX.
- A root `aria-label` does not name the first input. Use `Field` with a visible or visually hidden `FieldLabel`; the first input inherits it. Additional slots can use per-slot labels.
- Using OTP slots for arbitrary text input instead of fixed verification codes.

## Useful particle references

- large: `p-otp-field-2`
- with separator: `p-otp-field-3`
- with label: `p-otp-field-4`
- custom sanitization: `p-otp-field-6`
- auto validation: `p-otp-field-7`
- alphanumeric: `p-otp-field-8`
- placeholder hints: `p-otp-field-9`
- masked entry: `p-otp-field-10`
