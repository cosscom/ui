# Accura Visual System Rules

## Brand Assets

- Use the official Accura SVG assets stored in `apps/accura-prototype/public/brand/` for the prototype.
- Use the horizontal logo in expanded navigation and the standalone mark in collapsed navigation.
- Cropping an SVG artboard through its `viewBox` is allowed when paths, fills, proportions, and aspect ratio remain unchanged.
- Do not redraw the Accura logo with an icon library or handcrafted SVG.
- In collapsed navigation, render one visual inside the logo/expand target. The standalone mark may itself be the expand control; do not cross-fade or layer a second expand icon over it.

## Icons

- Use `iconoir-react` for prototype-level interface icons.
- Use Iconoir’s native 1.5 px stroke and a consistent 24 × 24 grid.
- Let a receiving COSS component control icon size when it already defines one; otherwise use the appropriate explicit size class.
- Decorative icons use `aria-hidden="true"`; icon-only controls require an accessible name.
- COSS may retain its own internal icon dependencies. This rule applies to the Accura application layer.

## Color And Theme

- Use the generated Accura palette adapter after the COSS base theme, then apply the Accura prototype overrides in `apps/accura-prototype/app/globals.css`.
- Accura brand and Zinc primitives are the only active Accura token inputs.
- Preserve COSS semantic status colors, spacing, radius, density, motion, and component behavior unless a separate approved rule changes them.
- Use Zinc 100 for the recessed application canvas, Brand 950 for the navigation surface and principal action, Zinc 100 with Zinc 900 foreground for selected or hovered navigation, and white for principal content surfaces.
- Use Brand 950 for the main-content focus ring and Brand 150 for focus against the dark navigation surface.
- Follow [`ui-hierarchy.md`](ui-hierarchy.md) when assigning primary, secondary, neutral, status, and destructive emphasis.

Token generation and mapping mechanics are owned by [`../../brand-assets/README.md`](../../brand-assets/README.md).

## Typography

- Use the Cal Sans roles and implementation requirements owned by [`../../packages/ui/src/fonts/font-guide.md`](../../packages/ui/src/fonts/font-guide.md).
- Do not add letter spacing, synthesize bold or italic, or replace role-specific `GEOM` values.
- Use typeset punctuation in interface copy.
