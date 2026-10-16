# coss Field

## When to use

- Accessible field wrappers with labels, descriptions, and errors.
- Form control state wiring (`invalid`, `required`, touched/error messaging).

## Install

```bash
npx shadcn@latest add @coss/field
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldValidity,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

## Minimal pattern

```tsx
<Field>
  <FieldLabel>Name</FieldLabel>
  <Input type="text" placeholder="Enter your name" />
  <FieldDescription>Visible on your profile</FieldDescription>
  <FieldError>Please enter a valid name</FieldError>
  <FieldValidity>
    {(validity) => (
      {validity.error && <p>{validity.error}</p>}
    )}
  </FieldValidity>
</Field>
```

## Patterns from coss particles

### Key patterns

Required field with error (Base UI constraint validation):

```tsx
<Field name="email">
  <FieldLabel>
    Email <span className="text-destructive-foreground">*</span>
  </FieldLabel>
  <Input type="email" required placeholder="name@company.com" />
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError>Please enter a valid email.</FieldError>
</Field>
```

Native constraint attributes (`required`, `type="email"`, `min`, `pattern`, …) are the validation source here: `Field` reads the control's `ValidityState` and `FieldError` renders when it fails. Use this only when the browser constraints are the single source of truth.

Required field with React Hook Form (or another schema/form library):

```tsx
const { formState: { errors }, handleSubmit, register } = useForm<Values>({
  resolver: zodResolver(schema),
})

<form noValidate onSubmit={handleSubmit(onSubmit)}>
  <Field invalid={!!errors.email} name="email">
    <FieldLabel>
      Email <span className="text-destructive-foreground">*</span>
    </FieldLabel>
    <Input type="email" {...register("email")} placeholder="name@company.com" />
    <FieldError>{errors.email?.message}</FieldError>
  </Field>
</form>
```

- Let the library own validation: drop `required` (and other constraint attributes like `min`/`max`/`pattern`) from the control and express them in the schema.
- Use a plain `<form noValidate>`. Without `noValidate`, the browser's native validation blocks submit and shows its own bubble before `handleSubmit` runs; with it, `type="email"` can stay for the mobile keyboard and autofill.
- If you wrap the fields in coss `Form` instead: it already sets `noValidate`, but each `Field` inside it still runs native constraint checks on submit (including `type="email"` mismatches) and cancels the submit, focusing the first invalid control, before your `onSubmit` handler fires. Remove every constraint attribute in that case (use `inputMode="email"` for the keyboard).
- Drive the error state from the library: `invalid` on `Field` and the message as `FieldError` children. The asterisk is visual only; the schema enforces it.

Field wrapping an autocomplete:

```tsx
<Field name="framework">
  <FieldLabel>Framework</FieldLabel>
  <Autocomplete items={items}>
    <AutocompleteInput placeholder="Search..." />
    <AutocompletePopup>
      <AutocompleteList>
        {(item) => <AutocompleteItem key={item.value} value={item}>{item.label}</AutocompleteItem>}
      </AutocompleteList>
    </AutocompletePopup>
  </Autocomplete>
  <FieldError />
</Field>
```

### More examples

See `p-field-1` through `p-field-9` for required, disabled, error, validity, input-group, autocomplete, and combobox field patterns.

## Common pitfalls

- Rendering errors detached from the related control, breaking context.
- Missing `name` in form flows, causing silent submit omissions.
- Mixing native constraint attributes (`required`, `min`, `pattern`) with React Hook Form or another schema validator; native/Base UI validation runs first and the library's errors never show.
- Using field wrapper without corresponding label/description/error semantics.

## Useful particle references

- required field: `p-field-2`
- disabled field: `p-field-3`
- with error: `p-field-4`
- with validity: `p-field-5`
- input group: `p-field-6`
- autocomplete field: `p-field-7`
- combobox field: `p-field-8`
- combobox multiple field: `p-field-9`
- form composition references: `p-form-1`, `p-form-2`, `p-input-group-24`
