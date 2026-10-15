# coss Input Group

## When to use

- Inputs/textareas that need inline or block addons.
- Input composition with icons, buttons, labels, badges, and shortcuts.

## Install

```bash
npx shadcn@latest add @coss/input-group
```

Manual deps:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
```

## Minimal pattern

```tsx
<InputGroup>
  <InputGroupInput type="email" placeholder="Email" />
  <InputGroupAddon>
    <MailIcon />
  </InputGroupAddon>
</InputGroup>
```

## DOM order convention

Keep `InputGroupInput` or `InputGroupTextarea` before `InputGroupAddon` in the DOM as the conventional composition order. The addon's focus handler searches the entire parent group with `querySelector`, so DOM order does not determine whether it finds the control. The `align` prop controls visual placement, including block-start and block-end addons.

## Patterns from coss particles

### Key patterns

Search input with icon:

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search..." type="search" />
  <InputGroupAddon>
    <SearchIcon aria-hidden="true" />
  </InputGroupAddon>
</InputGroup>
```

URL prefix with text addon:

```tsx
<InputGroup>
  <InputGroupInput placeholder="example.com" />
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

Input with interactive button addon:

```tsx
<InputGroup>
  <InputGroupInput placeholder="Enter value..." />
  <InputGroupAddon>
    <Button size="icon" variant="ghost" aria-label="Clear">
      <XIcon aria-hidden="true" />
    </Button>
  </InputGroupAddon>
</InputGroup>
```

### More examples

See `p-input-group-1` through `p-input-group-29` for icons, text prefixes, interactive addons, textarea layouts, and stateful patterns.

## Common pitfalls

- Using `Input`/`Textarea` directly instead of `InputGroupInput`/`InputGroupTextarea`.
- Reversing the conventional input-first DOM order; the addon focus lookup searches the full group, and `align` controls visual placement.
- Missing explicit input types.

## Useful particle references

- icon addon + search baseline: `p-input-group-1`, `p-input-group-2`, `p-input-group-13`, `p-input-group-14`, `p-input-group-20`
- prefix/suffix text addons (url/domain/currency): `p-input-group-3`, `p-input-group-4`, `p-input-group-5`, `p-input-group-6`
- interactive addons (buttons/badge/kbd/menu/clear/voice): `p-input-group-7`, `p-input-group-8`, `p-input-group-9`, `p-input-group-10`, `p-input-group-11`, `p-input-group-12`, `p-input-group-18`, `p-input-group-21`, `p-input-group-22`, `p-input-group-23`
- textarea/editor-style layouts with block-end/start addons: `p-input-group-17`, `p-input-group-19`, `p-input-group-27`, `p-input-group-28`, `p-input-group-29`
- stateful/validation patterns (disabled/loading/password strength): `p-input-group-15`, `p-input-group-16`, `p-input-group-24`, `p-input-group-26`

