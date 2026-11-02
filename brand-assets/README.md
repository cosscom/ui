# Accura Palette Adapter

This folder contains the repository-local Accura color input and its small adapter for COSS.

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

The adapter targets `:root:not(.dark)`. Dark mode continues to use the native COSS theme until a dark Accura palette is designed and reviewed.

## Mapping Decisions

| COSS role | Source | Decision |
|---|---|---|
| Primary | `color/brand/800-base` | Main Accura action color |
| Primary foreground | COSS white | 4.52:1 contrast; `zinc/50` would reach only 4.32:1 |
| Focus ring | `color/brand/500` | Branded interaction cue |
| Main foregrounds | `color/zinc/800` | Replaces COSS neutral without changing hierarchy |
| Muted foreground | `color/zinc/600` | Remains readable on COSS muted alpha surfaces |
| Sidebar | `brand/950-darkshade`, `brand/900`, `brand/800-base` | Dark shell, selected state, and primary action |
| Sidebar foreground | `color/zinc/50` | High contrast on the dark brand shell |

## COSS Ownership Boundary

The adapter deliberately preserves these native COSS decisions:

- white backgrounds and card/popover surfaces;
- alpha-based secondary, muted, accent, border, and input colors;
- destructive, info, success, and warning palettes;
- chart colors;
- radius, spacing, density, motion, and component state behavior;
- Cal Sans loading and typography roles.

This boundary keeps Accura as a brand skin over COSS rather than introducing a second semantic system.
