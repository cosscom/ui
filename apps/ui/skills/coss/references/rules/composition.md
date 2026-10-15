# Composition Rules (coss)

Use this when composing complex UI from coss primitives and particles.

## Core Rules

- Prefer composing existing primitives over custom wrappers with duplicated behavior.
- For trigger-based primitives (Dialog, Menu, Select, Popover, Tooltip), follow each primitive's documented trigger/content hierarchy and composition API; do not mix patterns across components.
- Use coss/Base UI trigger APIs consistently (typically `render`-based composition).
- Preserve the complete composition required for the chosen component and variant. Distinguish caller-supplied parts from parts the COSS wrapper already renders; an exported part is not automatically required in every composition. Consult the primitive guide for the exact contract.
- Use complete sub-structures where required (for example title/description regions in dialogs where relevant).
- For overlays, retain displayed content through the exit transition. Change open state through `onOpenChange`; defer close-time cleanup or parent unmounting until `onOpenChangeComplete(false)`. `keepMounted` is a separate portal option for retaining DOM while fully closed, and is not required for ordinary entry/exit transitions. See the Base UI [Dialog API](https://base-ui.com/react/components/dialog) and [portal-props.md](../portal-props.md) for supported callbacks and surfaces.

## Caller-owned and built-in parts

| Composition | Caller supplies | COSS wrapper includes |
| --- | --- | --- |
| Progress or Meter with custom children ([Progress](../primitives/progress.md), [Meter](../primitives/meter.md)) | Track and indicator, if the bar should remain alongside a label or value | Default track and indicator only when there are no children |
| Combobox or Autocomplete results ([Combobox](../primitives/combobox.md), [Autocomplete](../primitives/autocomplete.md), [Select](../primitives/select.md)) | `ComboboxList` / `AutocompleteList` around results | `SelectPopup` renders its list |
| Tabs ([Tabs](../primitives/tabs.md)) | Tabs and panels with matching values | `TabsList` renders its active indicator |
| Combobox chips ([Combobox](../primitives/combobox.md)) | Selected chip content | `ComboboxChip` renders its remove control |
| Scrollable content ([Scroll Area](../primitives/scroll-area.md)) | Content | `ScrollArea` renders the viewport and scrollbars |
| Overlay close affordance ([Dialog](../primitives/dialog.md), [Drawer](../primitives/drawer.md)) | Add a close control to `DrawerPopup` when wanted | Dialog popups show one by default; Drawer does not |

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

For connected controls, use their dedicated separator between adjacent items. See the [Group](../primitives/group.md) and [Toggle Group](../primitives/toggle-group.md) guides for vertical-orientation rules and the default Toggle Group exception.

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
- Omitting caller-supplied subcomponents required by the chosen composition, or duplicating parts already rendered by a COSS wrapper.
