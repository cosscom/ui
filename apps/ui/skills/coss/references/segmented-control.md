# coss Segmented Control Pattern

A segmented control is a shared visual treatment, not a standalone behavior. Choose the underlying primitive from the interaction before applying the styling.

## Choose the behavior

| Intent | Use | State model |
| --- | --- | --- |
| Choose one value, especially in a form | Radio Group | Exactly one mutually exclusive value |
| Navigate to another URL or route | Links | Browser navigation with `aria-current="page"` on the current link |
| Apply an exclusive filter or reversible mode | Toggle Group | At most one pressed item by default; the current item may be cleared |
| Switch between associated content panels | Tabs | Each tab controls a matching panel |

Do not use Tabs for navigation links, form values, or filters merely because the result should look segmented. Do not use Toggle Group when one value must always remain selected; use Radio Group instead.

## Install a particle

| Implementation | Small | Default | Large |
| --- | --- | --- | --- |
| Radio Group | `@coss/p-radio-group-7` | `@coss/p-radio-group-8` | `@coss/p-radio-group-9` |
| Navigation links | `@coss/p-navigation-2` | `@coss/p-navigation-1` | `@coss/p-navigation-3` |

The CLI installs the relevant primitive, the shared `@coss/segmented-control` styling library, and the `@coss/segmented-control-indicator` sliding pill automatically.

COSS does not publish a Toggle Group segmented particle. Use the shared styling directly only when a reversible mode genuinely allows no active option.

## Custom composition

Install the styling library directly when none of the particles matches:

```bash
npx shadcn@latest add @coss/segmented-control @coss/segmented-control-indicator
```

```tsx
import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from "@/lib/segmented-control"
import { SegmentedControlIndicator } from "@/lib/segmented-control-indicator"
```

Apply `segmentedControlRootClassName` to the group surface. Generate one item class with the matching state selector:

```tsx
const itemClassName = segmentedControlItemVariants({
  size: "default",
  state: "checked",
})
```

- `state: "checked"` for Radio Group
- `state: "current"` for navigation links
- `state: "pressed"` for Toggle Group
- `size: "sm" | "default" | "lg"`

The `state` variants paint a static pill on the active item. Render `<SegmentedControlIndicator />` as the last child of the root to animate it; while the indicator is visible, items drop their static pill:

```tsx
<RadioGroupPrimitive className={segmentedControlRootClassName}>
  <RadioPrimitive.Root className={itemClassName} value="monthly">
    Monthly
  </RadioPrimitive.Root>
  <SegmentedControlIndicator />
</RadioGroupPrimitive>
```

The indicator tracks the direct child with `data-checked`, `aria-current="page"`, or `data-pressed`, slides to it (200ms ease-in-out, none under reduced motion), and hides when no item is active. For navigation links, it animates only when the root persists across route changes, such as in a shared layout.

Use the exported Radio Group primitives for a custom segmented radio presentation so the native radio indicator is not rendered. Keep a default or controlled value when the interface requires one option to remain selected.

Tabs do not use the shared state recipe or `SegmentedControlIndicator`; they use Base UI’s `Tabs.Indicator`, styled with the shared `segmentedControlIndicatorSurfaceClassName`. They also import the shared size map and `segmentedControlItemLayoutClassName`: set `size="sm" | "default" | "lg"` on `TabsList`, and use a `TabsTab` size only as an item-level override.

Reuse the shared root, item, layout, and indicator recipes instead of copying their classes into a new segmented particle. This keeps Tabs and the radio, navigation, and toggle implementations optically aligned.
