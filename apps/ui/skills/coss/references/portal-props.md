# Portal forwarding (`portalProps`)

Several composed coss primitives wrap Base UI **`Portal`** inside `*Popup` (or dialog-style) components, and toast exposes the same for **`ToastProvider`** / **`AnchoredToastProvider`**. Those surfaces accept an optional **`portalProps`** object, which is spread onto the internal `Portal`.

Use it when you need portal-level behavior from Base UI, for example:

- **`keepMounted`** — where the component’s `Portal` type supports it (see Base UI typings/docs for that component).
- **`container`** — render portaled content into a specific DOM node (stacking contexts, micro-frontends, shadow DOM setups).
- Other props accepted by that component’s **`Portal.Props`** (including `className` / `ref` when applicable).

## Surfaces that expose `portalProps`

- **Modals / overlays:** `DialogPopup`, `AlertDialogPopup`, `DrawerPopup`, `CommandDialogPopup`
- **Floating layers:** `MenuPopup`, `ContextMenuPopup`, `PopoverPopup`, `TooltipPopup`, `PreviewCardPopup`, `AutocompletePopup`, `ComboboxPopup`, `SelectPopup`
- **Toast (providers, not a `*Popup` name):** `ToastProvider`, `AnchoredToastProvider` — `portalProps` is forwarded to the internal `Toast.Portal` for the stacked and anchored viewports, respectively

The legacy `SheetPopup` also accepts `portalProps`; this is compatibility information, not a recommendation to use Sheet. Use [Drawer](primitives/drawer.md) instead.

Only these surfaces accept `portalProps`. Any other registry component that portals content but is not listed here keeps the portal internal and is out of scope for this prop—compose Base UI parts yourself if you need direct portal control.

## Positioner vs portal

`portalProps` only affects the **portal** node. To tweak **placement** or **positioner** styling, use the existing `side`, `align`, `sideOffset`, etc., or compose Base UI **`Positioner`** / pass through future **`positionerProps`** if the wrapper adds them.
