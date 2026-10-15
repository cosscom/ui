# coss Sheet (legacy)

Sheet has been replaced by [Drawer](drawer.md). Do not use Sheet for new UI, including desktop side panels.

## Migrating an existing Sheet

- Follow the Drawer guide and an existing Drawer particle for the complete composition.
- Replace Sheet parts with the corresponding Drawer parts; verify their props rather than performing a name-only replacement.
- Drawer placement is configured on the root with `position="right"` (or `left`, `top`, `bottom`), instead of `side` on `SheetPopup`.
- `DrawerPopup` does not show a close button by default. Use `showCloseButton` or provide a suitable `DrawerClose` action.
- Preserve accessible naming, form state, focus behavior, and exit-transition cleanup. Check scrolling and dismissal after migration.

This legacy reference does not authorize a bulk migration or removal of the existing Sheet implementation.
