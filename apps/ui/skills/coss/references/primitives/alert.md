# coss Alert

## When to use

- Inline status messaging in content flows.
- Semantic feedback variants (`info`, `success`, `warning`, `error`) with optional icons and actions.

## When NOT to use

- If the message is transient and should auto-dismiss -> use Toast instead.
- If the message requires user action before proceeding -> use AlertDialog instead.
- If it's a brief hover hint -> use Tooltip instead.

## Install

```bash
npx shadcn@latest add @coss/alert
```

Manual deps from docs:

```bash
# No extra runtime dependency required for this primitive.
```

## Canonical imports

```tsx
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

## Minimal pattern

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

## Patterns from coss particles

### Key patterns

When an icon uniquely conveys alert status, explicitly name it with `role="img"` and `aria-label`. Lucide icons are hidden by default; omitting `aria-hidden` alone does not expose their meaning. Keep icons decorative with `aria-hidden="true"` when visible text already conveys the same meaning:

```tsx
<Alert variant="info">
  <InfoIcon aria-label="Information" role="img" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components using the CLI.</AlertDescription>
</Alert>
```

Variants: `default`, `info`, `success`, `warning`, `error`.

Alert with action buttons (use `AlertAction`):

```tsx
<Alert>
  <InfoIcon aria-label="Information" role="img" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Describe what can be done about it here.</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="ghost">Dismiss</Button>
    <Button size="xs">Ok</Button>
  </AlertAction>
</Alert>
```

### More examples

See `p-alert-1` through `p-alert-7` for all variants and action patterns.

## Common pitfalls

- Using alert variants for passive decoration instead of meaningful semantic status.
- Missing title/description structure in complex alerts, reducing scannability.
- Leaving a uniquely meaningful icon unnamed, or repeating status already provided by visible text.

## Useful particle references

- with icon: `p-alert-2`
- with icon and action buttons: `p-alert-3`
- info alert: `p-alert-4`
- success alert: `p-alert-5`
- warning alert: `p-alert-6`
- error alert: `p-alert-7`
