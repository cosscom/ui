# Accura Palette Adapter

This folder contains the repository-local Accura color input and its small adapter for COSS.

This folder owns token inputs and generation mechanics. Current UI usage rules live in [`../docs/rules/ui-hierarchy.md`](../docs/rules/ui-hierarchy.md); decision history lives in [`../docs/change-log/DECISIONS.md`](../docs/change-log/DECISIONS.md).

## Active Sources

- `Primitives.json`: source export; only `color/brand/*` and `color/zinc/*` are active.
- `coss-map.json`: explicit, partial overrides for the existing COSS theme contract.

`Semantics.json` remains in the repository for reference, but the generator does not read it. Typography, spacing, radius, shadow, opacity, motion, status, and chart values from the Accura exports are not part of this adapter.

Do not edit files in `generated/`. Regenerate and verify them with:

```bash
bun run tokens:generate
bun run tokens:check
```

The scripts use Node internally and can also be run directly:

```bash
node brand-assets/scripts/generate-tokens.mjs
node brand-assets/scripts/generate-tokens.mjs --check
```

## Generated Contract

Import the entry point after the COSS base styles:

```css
@import "@coss/ui/styles/globals.css";
@import "../../brand-assets/generated/index.css";
```

The generated files are:

- `palette.css`: 25 literal brand and Zinc variables under the `--accura-*` namespace.
- `coss-theme.css`: the intentionally small set of COSS role overrides.
- `index.css`: the stable entry point.

The adapter targets `:root:not(.dark)`. Dark mode continues to use the native COSS theme until a dark Accura palette is designed and reviewed. The generated adapter is the reusable baseline; the Accura prototype applies the product-specific overrides documented below after importing it.

## Active Accura Prototype Mapping

The executable prototype overrides selected generated roles in [`../apps/accura-prototype/app/globals.css`](../apps/accura-prototype/app/globals.css). These values describe the UI currently rendered at `http://localhost:4173/`.

| Role | Active source | Current use |
|---|---|---|
| Canvas | `color/zinc/100` | Recessed application background |
| Primary | `color/brand/950-darkshade` | Principal action and strong brand emphasis |
| Primary foreground | COSS white | 12.67:1 contrast on Brand 950 |
| Focus ring | `color/brand/950-darkshade` | Main-content interaction cue |
| Main foregrounds | Generated `color/zinc/800` | Default content text |
| Muted foreground | Generated `color/zinc/600` | Supporting content text |
| Sidebar surface | `color/brand/950-darkshade` | Persistent dark brand navigation |
| Sidebar foreground | `color/zinc/200` | Default navigation text and icons |
| Sidebar selected and hover surface | `color/zinc/100` | High-contrast navigation state |
| Sidebar selected and hover foreground | `color/zinc/900` | Text and icons on the light navigation state |
| Sidebar border | COSS white at 16% | Divider on the dark navigation surface |
| Sidebar focus ring | `color/brand/150-lightshade` | Visible focus against Brand 950 |

## Generated Base Adapter Mapping

This table describes `coss-map.json` and the generated COSS baseline before the prototype overrides above are applied.

| COSS role | Source | Decision |
|---|---|---|
| Primary | `color/brand/800-base` | Reusable Accura baseline action color |
| Primary foreground | COSS white | 4.52:1 contrast; `zinc/50` would reach only 4.32:1 |
| Focus ring | `color/brand/500` | Branded interaction cue |
| Main foregrounds | `color/zinc/800` | Replaces COSS neutral without changing hierarchy |
| Muted foreground | `color/zinc/600` | Remains readable on COSS muted alpha surfaces |
| Sidebar | `color/zinc/100`, COSS white, `brand/800-base` | Neutral reusable baseline before product-specific overrides |
| Sidebar foreground | `color/zinc/700` | Readable baseline navigation text |

## COSS Ownership Boundary

The adapter deliberately preserves these native COSS decisions:

- white backgrounds and card/popover surfaces;
- alpha-based secondary, muted, accent, border, and input colors;
- destructive, info, success, and warning palettes;
- chart colors;
- radius, spacing, density, motion, and component state behavior;
- Cal Sans loading and typography roles.

This boundary keeps Accura as a brand skin over COSS rather than introducing a second semantic system.
