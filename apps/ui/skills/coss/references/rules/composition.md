# Composition Rules (coss)

Use this when composing complex UI from coss primitives and particles.

## Core Rules

- Prefer composing existing primitives over custom wrappers with duplicated behavior.
- For trigger-based primitives (Dialog, Menu, Select, Popover, Tooltip), follow each primitive's documented trigger/content hierarchy and composition API; do not mix patterns across components.
- Use coss/Base UI trigger APIs consistently (typically `render`-based composition).
- Use complete sub-structures where required (for example title/description regions in dialogs where relevant).

## Patterns

### Trigger + Popup

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogPanel>Body</DialogPanel>
  </DialogPopup>
</Dialog>
```

### Portal forwarding (`portalProps`)

Only specific composed wrappers (and `ToastProvider` / `AnchoredToastProvider` for toasts) accept optional `portalProps` (spread onto Base UI `Portal`). See `../portal-props.md` for the allowlist.

### Grouped Controls

```tsx
<Group>
  <Button variant="outline">A</Button>
  <GroupSeparator />
  <Button variant="outline">B</Button>
</Group>
```

## Anti-patterns

- Building bespoke dropdown/dialog behavior instead of using primitives.
- Mixing APIs from other ecosystems (`asChild`-only mental model) without checking coss equivalents.
- Using `<Button render={<Link|a … />}>` for navigation — style the link with `buttonVariants` instead (triggers may still use `render={<Button />}`).
- Omitting key subcomponents that preserve accessibility and layout conventions.
