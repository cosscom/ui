# coss Toggle Group

## When to use

- Grouped pressed-state controls (single or multiple).
- Formatting/action sets needing button-like toggles with shared state.

## Install

```bash
npx shadcn@latest add @coss/toggle-group
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from "@/components/ui/toggle-group"
```

## Minimal pattern

```tsx
<ToggleGroup>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
</ToggleGroup>
```

## Patterns from coss particles

### Key patterns

Toggle group with icon buttons:

```tsx
<ToggleGroup defaultValue={["bold"]}>
  <ToggleGroupItem aria-label="Toggle bold" value="bold">
    <BoldIcon aria-hidden="true" />
  </ToggleGroupItem>
  <ToggleGroupItem aria-label="Toggle italic" value="italic">
    <ItalicIcon aria-hidden="true" />
  </ToggleGroupItem>
  <ToggleGroupItem aria-label="Toggle underline" value="underline">
    <UnderlineIcon aria-hidden="true" />
  </ToggleGroupItem>
</ToggleGroup>
```

Toggle Group is exclusive by default and may be cleared. Add `multiple` only when more than one item may be pressed.

Outlined groups use connected items: include `ToggleGroupSeparator` between adjacent items. The default variant uses spaced items and does not require separators.

```tsx
<ToggleGroup variant="outline">
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupSeparator />
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupSeparator />
  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
</ToggleGroup>
```

In a vertical outlined group, separators must be horizontal:

```tsx
<ToggleGroup orientation="vertical" variant="outline">
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupSeparator orientation="horizontal" />
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupSeparator orientation="horizontal" />
  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
</ToggleGroup>
```

Use the dedicated separator rather than a generic border: the group removes adjoining item borders and coordinates separator styling with hover and pressed states.

Controlled toggle group:

```tsx
import { useState } from "react"

function ControlledToggleGroup() {
  const [value, setValue] = useState<string[]>(["bold"])

  return (
    <ToggleGroup value={value} onValueChange={setValue}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  )
}
```

### More examples

See `p-toggle-group-1` through `p-toggle-group-9` for sizes, outline, vertical, disabled, multiple, and tooltip patterns. Read `../segmented-control.md` before applying segmented styling to a custom reversible mode.

## Common pitfalls

- Using toggle-group when plain buttons (no pressed state) are more appropriate.
- Passing a scalar value: both exclusive and multiple modes use arrays; exclusive mode contains at most one selected value.
- Omitting `ToggleGroupSeparator` in outlined groups or leaving its default vertical orientation inside a vertical group.
- Missing accessible labels on icon-only toggle items.

## Useful particle references

- small toggles: `p-toggle-group-2`
- large toggles: `p-toggle-group-3`
- with outline toggles: `p-toggle-group-4`
- vertical: `p-toggle-group-5`
- disabled: `p-toggle-group-6`
- with disabled toggle: `p-toggle-group-7`
- multiple selection: `p-toggle-group-8`
- with tooltips: `p-toggle-group-9`
