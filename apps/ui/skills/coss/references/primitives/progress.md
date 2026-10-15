# coss Progress

## When to use

- Task completion and async operation progress bars.
- Indeterminate or determinate status during loading pipelines.

## When NOT to use

- If displaying a bounded measurement (not task completion) -> use Meter instead.
- If the loading state is indeterminate with no percentage -> consider Spinner.

## Install

```bash
npx shadcn@latest add @coss/progress
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
```

## Minimal pattern

```tsx
<Progress aria-label="Upload progress" value={40} />
```

## Patterns from coss particles

### Key patterns

Progress with label and value display:

```tsx
<Progress value={60}>
  <div className="flex justify-between text-sm">
    <ProgressLabel>Uploading...</ProgressLabel>
    <ProgressValue />
  </div>
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</Progress>
```

When supplying children (including only a label or value), include `ProgressTrack` and `ProgressIndicator` to retain the bar. The root renders its default track and indicator only when no children are supplied.

Determinate progress: bind a numeric `value` (0-100) for known completion states.
Indeterminate loading: omit `value` or pass `null` when progress cannot be measured.

### More examples

- with label and value: `p-progress-2`
- with formatted value: `p-progress-3`

## Common pitfalls

- Using progress without text/context for what operation is progressing.
- Using determinate values when state is actually unknown/indeterminate.
- Using progress for static score displays that should use `Meter`.

## Useful particle references

See `p-progress-1` through `p-progress-3` for animated, labeled, and formatted value patterns.
