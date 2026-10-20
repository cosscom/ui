# coss Segmented Control

A segmented control is a visual pattern, not a standalone behavior. `SegmentedControl` and `SegmentedControlItem` provide the presentation and the sliding indicator; the element passed to `render` provides the semantics. Choose that element from the interaction first.

## Choose the behavior

| Intent | Render | State model |
| --- | --- | --- |
| Choose one value, especially in a form | Radio Group primitives | Exactly one mutually exclusive value |
| Navigate to another URL or route | `<nav />` and links | Browser navigation with `aria-current="page"` on the current link |
| Apply an exclusive filter or reversible mode | Toggle Group primitives | At most one pressed item by default; the current item may be cleared |
| Switch between associated content panels | Use Tabs instead | Each tab controls a matching panel |

Do not use Tabs for navigation links, form values, or filters merely because the result should look segmented. Do not use Toggle Group when one value must always remain selected; use Radio Group instead.

## Install

```bash
npx shadcn@latest add @coss/segmented-control
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/segmented-control"
```

## Minimal pattern

```tsx
import {
  RadioGroupPrimitive,
  RadioPrimitive,
} from "@/components/ui/radio-group"

<SegmentedControl
  aria-label="Billing period"
  render={<RadioGroupPrimitive defaultValue="monthly" />}
>
  <SegmentedControlItem render={<RadioPrimitive.Root value="monthly" />}>
    Monthly
  </SegmentedControlItem>
  <SegmentedControlItem render={<RadioPrimitive.Root value="yearly" />}>
    Yearly
  </SegmentedControlItem>
</SegmentedControl>
```

## Patterns from coss particles

### Key patterns

Navigation renders the `<nav>` as the root and a link per item:

```tsx
<SegmentedControl aria-label="Project sections" render={<nav />}>
  <SegmentedControlItem render={<a aria-current="page" href="/overview" />}>
    Overview
  </SegmentedControlItem>
  <SegmentedControlItem render={<a href="/activity" />}>
    Activity
  </SegmentedControlItem>
</SegmentedControl>
```

An exclusive filter that may be cleared renders the Toggle Group primitives:

```tsx
import { ToggleGroupPrimitive } from "@/components/ui/toggle-group"
import { TogglePrimitive } from "@/components/ui/toggle"

<SegmentedControl render={<ToggleGroupPrimitive aria-label="Status" />}>
  <SegmentedControlItem render={<TogglePrimitive value="open" />}>
    Open
  </SegmentedControlItem>
  <SegmentedControlItem render={<TogglePrimitive value="closed" />}>
    Closed
  </SegmentedControlItem>
</SegmentedControl>
```

- Put behavior props (`defaultValue`, `value`, `onValueChange`, `href`, `aria-current`, `onClick`) on the rendered element, not on `SegmentedControl` or `SegmentedControlItem`.
- Use the `*Primitive` exports, not the styled `RadioGroup`/`Radio` or `ToggleGroup`/`ToggleGroupItem`, so their own indicator and styling are not rendered.
- Set `size="sm" | "default" | "lg"` once on `SegmentedControl`; items inherit it. Use an item `size` only as an override.
- Add `className="grow"` to items to fill a full-width control.
- The indicator is built in: it slides to the item with `data-checked`, `aria-current="page"`, or `data-pressed`. Before hydration, the active item paints a static pill. For navigation, the pill animates only when the control persists across route changes, such as in a shared layout.

Tabs keep their own component and Base UI indicator. They import `SegmentedControlSize`, `segmentedControlItemSizeClassNames`, `segmentedControlItemLayoutClassName`, and `segmentedControlIndicatorSurfaceClassName` from `components/ui/segmented-control.tsx` so both look the same.

## Common pitfalls

- Choosing the primitive by appearance instead of interaction.
- Putting `defaultValue`, `value`, or `href` on `SegmentedControl` or `SegmentedControlItem` instead of on the rendered element.
- Rendering a styled `Radio` or `ToggleGroupItem` inside an item, which adds a second indicator or conflicting styles.
- Wrapping the control in an extra `<nav>` or `<div>` instead of rendering it as the root.
- Adding a separate indicator element; `SegmentedControl` already renders one.
- Importing from the removed `lib/segmented-control.ts` library; see the Oct 20, 2026 changelog entry for the migration.

## Useful particle references

- radio group, small/default/large: `p-radio-group-7`, `p-radio-group-8`, `p-radio-group-9`
- navigation, small/default/large: `p-navigation-2`, `p-navigation-1`, `p-navigation-3`
