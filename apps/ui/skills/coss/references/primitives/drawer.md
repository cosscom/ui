# coss Drawer

## When to use

- Edge panels on desktop and mobile, including side panels and bottom drawers.
- Replacement for Sheet; do not introduce Sheet usage.
- Form-heavy or multi-step overlays where popover is too constrained.

## When NOT to use

- If the overlay should be a centered modal -> use Dialog instead.
- If you need a simple confirmation -> use AlertDialog instead.

## Install

```bash
npx shadcn@latest add @coss/drawer
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerPanel,
  DrawerPopup,
  DrawerMenuTrigger,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
```

## Minimal pattern

```tsx
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerPopup>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer Description</DrawerDescription>
    </DrawerHeader>
    <DrawerPanel>Content</DrawerPanel>
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerPopup>
</Drawer>
```

## Patterns from coss particles

- **Portal forwarding**: optional `portalProps` on `DrawerPopup` → Base UI `Drawer.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).

### Key patterns

Drawer with a visible drag handle:

```tsx
<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Open Drawer</DrawerTrigger>
  <DrawerPopup showBar>
    <DrawerHeader>
      <DrawerTitle>Edit Profile</DrawerTitle>
      <DrawerDescription>Make changes to your profile here.</DrawerDescription>
    </DrawerHeader>
    <DrawerPanel>
      {/* Form content */}
    </DrawerPanel>
    <DrawerFooter>
      <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
      <Button>Save</Button>
    </DrawerFooter>
  </DrawerPopup>
</Drawer>
```

**Footer action order**: write Cancel first and the primary action last. `DrawerFooter` is `flex-col-reverse` on mobile and `sm:flex-row sm:justify-end` from `sm` up, so source order puts the primary action on the right on desktop and on top when stacked. The same applies to `DialogFooter` and `AlertDialogFooter`.

Responsive drawer + dialog (drawer on mobile, dialog on desktop): see `p-drawer-12`.

### More examples

See `p-drawer-1` through `p-drawer-13` for inset, straight, scrollable, nested, snap points, mobile menu, and responsive patterns.

## Common pitfalls

- Choosing Sheet for desktop side panels; use Drawer. Use Dialog for centered modal flows.
- Forgetting responsive switch logic when drawer is mobile-only variant.
- Putting the primary action before Cancel in `DrawerFooter`; the reversed mobile stack then puts Cancel on top and the primary on the left on desktop.
- Breaking section layout by putting the whole dialog in a block-level `<form>`; prefer **header outside**, **`Form className="contents"`** around **panel + footer** (see dialog/form skills).

## Useful particle references

- inset variant: `p-drawer-4`
- straight variant: `p-drawer-5`
- scrollable content: `p-drawer-6`
- nested drawers: `p-drawer-7`
- snap points: `p-drawer-9`
- mobile menu: `p-drawer-11`
- responsive dialog: `p-drawer-12`
- responsive menu: `p-drawer-13`
- cross-overlay references: `p-dialog-1`, `p-popover-1`, `p-menu-2`
