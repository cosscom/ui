# coss Button

## When to use

- Primary and secondary action triggers.
- Icon, loading, and shortcut-enhanced actions across forms and toolbars.

## Install

```bash
npx shadcn@latest add @coss/button
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import { Button, buttonVariants } from "@/components/ui/button"
```

## Minimal pattern

```tsx
<Button type="button">Button</Button>
```

`Button` wraps [Base UI Button](https://base-ui.com/react/components/button). For form submit buttons, set `type="submit"` explicitly (Base UI requires it). Prefer `type="button"` for non-submit actions inside forms.

## Patterns from coss particles

### Key patterns

Variants are set via the `variant` prop:

```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

Icon-only button (always needs `aria-label`):

```tsx
<Button aria-label="Close" size="icon" variant="ghost">
  <XIcon aria-hidden="true" />
</Button>
```

Button with icon and text (no opacity on the icon):

```tsx
<Button>
  <PlusIcon aria-hidden="true" />
  Add Item
</Button>
```

Sizes: `xs`, `sm`, `default`, `lg`, `xl`, `icon-xs`, `icon-sm`, `icon`, `icon-lg`, `icon-xl`.

### Links that look like buttons

Do **not** use `<Button render={<Link … />}>` or `<Button render={<a … />}>`. Style the link with `buttonVariants`:

```tsx
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

<Link className={buttonVariants()} href="/login">
  Login
</Link>

<a className={buttonVariants({ variant: "outline", size: "sm" })} href="/docs">
  Docs
</a>
```

Trigger composition is different and still correct: put `Button` on the **other** component’s `render` prop (`MenuTrigger render={<Button … />}`, `DialogTrigger`, etc.).

### Loading state

Built-in `loading` prop (disables and shows spinner automatically; defaults `focusableWhenDisabled` to `true`):

```tsx
<Button loading={isLoading} onClick={handleClick}>Submit</Button>
```

Composite approach (manual `Spinner` + `disabled` / `focusableWhenDisabled` as needed):

```tsx
<Button disabled focusableWhenDisabled>
  <Spinner />
  Loading...
</Button>
```

Prefer the `loading` prop for typical async actions. Use the composite approach when you need custom spinner placement or label.

Disabled styles use `data-disabled` (including when focusable while disabled).

### More examples

- default: `p-button-1`
- outline: `p-button-2`
- secondary: `p-button-3`
- destructive: `p-button-4`
- destructive outline: `p-button-5`
- ghost: `p-button-6`
- link: `p-button-7`
- extra-small size: `p-button-8`
- link styled with `buttonVariants`: `p-button-17`
- built-in loading prop: `p-button-41`
- composite loading (Spinner + disabled): `p-button-18`

## Common pitfalls

- Using `<Button render={<Link|a … />}>` for navigation — use `buttonVariants` on the link instead.
- Omitting explicit `type` inside forms/dialogs and triggering unintended submit behavior.
- Using icon-only buttons without `aria-label` on the button.
- Rebuilding button state styling with ad-hoc classes instead of variants/sizes.
- Using `SelectButton` as if it were a general-purpose `Button`; `SelectButton` is a select-flavored trigger helper and should be treated as a `select`/`combobox` pattern.
- From an RSC, passing `render={<Button />}` into a Client trigger can break children merging — style the client trigger with `buttonVariants` directly when that happens.

## Useful particle references

- variants/sizes: `p-button-1` through `p-button-8`
- link + `buttonVariants`: `p-button-17`
- composite loading (Spinner + disabled): `p-button-18`
- built-in loading prop: `p-button-41`
