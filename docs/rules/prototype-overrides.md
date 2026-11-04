# Accura Prototype Overrides

Accura deliberately departs from COSS and library defaults in the places listed
below. Each one is easy to lose when a file is regenerated, reformatted, or
rewritten from a generic template, because the surrounding code looks ordinary
and the default it replaces looks correct in isolation.

**Before rewriting any file in this table, read the owning rule and carry the
override forward.** If an override no longer serves its purpose, remove it
through a decision in
[`../change-log/DECISIONS.md`](../change-log/DECISIONS.md), not by regeneration.

This file is an index. It records *where* each override lives and *what it
replaces*; the reasoning belongs to the rule it links to.

## Current overrides

| Override | Lives in | Replaces | Owning rule |
|---|---|---|---|
| Iconoir icons render at stroke width 2 | `apps/accura-prototype/app/layout.tsx` (inline `<style>`) | Iconoir's 1.5 default | [`ui-hierarchy.md`](ui-hierarchy.md) — Icons |
| Icon-only buttons keep full-strength icons | `apps/accura-prototype/app/globals.css` | COSS dims every button icon to 80% | [`ui-hierarchy.md`](ui-hierarchy.md) — Icons |
| Table row actions use the 28 px icon button | `size="icon-sm"` on row action buttons in the prototype screens | The 24 px `icon-xs` used elsewhere | [`ui-hierarchy.md`](ui-hierarchy.md) — Icons |
| Underline tabs with Brand 950 selection | `apps/accura-prototype/components/accura-tabs.tsx` | The COSS segmented tab default | [`ui-hierarchy.md`](ui-hierarchy.md) — Tabs |
| Disabled inputs take the Zinc 100 recessed surface | `has-disabled:` classes on the affected `Input` | COSS signals disabled with `opacity-64` alone | [`ui-hierarchy.md`](ui-hierarchy.md) — Form fields |
| Every form field is marked required or optional | Label markup in the prototype forms | Marking only required fields | [`ui-hierarchy.md`](ui-hierarchy.md) — Form fields |
| User rows render as an avatar, name, and email cluster | `UserIdentity` in the Settings screens | A plain name and email stack | [`user-identity.md`](user-identity.md) |

## Notes

- `Input` applies its `className` to the wrapper span, not the inner `input`
  element, and styles the disabled state with `has-disabled:`. A `disabled:`
  class written on `Input` silently does nothing.
- The `endAddon` slot on `ComboboxChips` is **not** an override. It was added to
  the shared primitive in `packages/ui`, so it is available to every
  application and must be kept in sync through `bun run ui:sync` from
  `apps/ui`, never edited directly in `packages/ui`.
