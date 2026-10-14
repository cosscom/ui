# coss Slider

## When to use

- Continuous or ranged numeric tuning interactions.
- Volume/brightness/threshold controls with immediate feedback.

## Install

```bash
npx shadcn@latest add @coss/slider
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import { Slider, SliderValue } from "@/components/ui/slider"
```

## Minimal pattern

```tsx
<Slider getAriaLabel={() => "Volume"} defaultValue={40} max={100} min={0} />
```

## Patterns from coss particles

### Key patterns

Slider with label and live value display:

```tsx
<Field>
  <Slider defaultValue={50} min={0} max={100}>
    <div className="mb-2 flex justify-between text-sm">
      <FieldLabel>Volume</FieldLabel>
      <SliderValue />
    </div>
  </Slider>
</Field>
```

Range slider (two thumbs):

```tsx
<Slider
  defaultValue={[20, 80]}
  getAriaLabel={(index) => index === 0 ? "Minimum price" : "Maximum price"}
  min={0}
  max={100}
/>
```

### More examples

See `p-slider-2`, `p-slider-7`, `p-slider-17`, and `p-slider-23` for label, range, vertical, and form integration patterns.

## Common pitfalls

- Using slider for discrete option labels where select/radio is clearer.
- Not exposing current value context in nearby UI text when needed.
- Confusing single-value vs range value shapes in controlled mode.
- Labeling the root instead of the generated thumbs. Use `getAriaLabel` for each thumb or an associated `FieldLabel`.
- Passing `getAriaLabel` from a Server Component; callbacks require a client boundary.

## Useful particle references

- with label and value: `p-slider-2`
- range slider: `p-slider-7`
- vertical: `p-slider-17`
- form integration: `p-slider-23`
