# SVG and coss integration

## Geometry and rendering

The established examples use a `560 × 440` SVG viewBox. Typical main outlines are about `0.85–1.1` units, with `0.55–0.7` unit guides at lower opacity. Guides range from barely visible grid lines to readable dimensions; fills are sparse. These are starting proportions, not fixed requirements for every output size.

- Use true circle/ellipse arc commands for radius-labeled bends. A quadratic curve across a square corner is not a circular fillet; an `R24` annotation must describe an actual radius-24 arc. Check arc direction and tangency as well as endpoints.
- Derive repeated spacing, centers, and dimensions from the same coordinates. A dimension should measure the indicated edges or centerlines, consistently. In a scheduling grid, verify that the selected interval matches the day and time labels.
- Keep annotations outside the principal silhouette where possible. Check collisions with guides, leader endpoints, and neighboring text at actual display size.
- Separate main outlines from grid, centerlines, dimensions, and text so later animation can target meaningful groups. Do not add animation machinery during a static drawing task.
- Repeated renderings in a gallery need unique SVG IDs if using defs, masks, or clips. Prefer simple geometry when those mechanisms add no benefit.
- Decorative website illustrations can inherit `currentColor` and be hidden from accessibility APIs when adjacent copy carries the meaning. A meaningful standalone diagram needs an accessible title/description appropriate to its use.

## In the coss repository

Find the checkout from the current workspace; the skill does not require a particular absolute checkout path. Read its applicable `AGENTS.md` before editing.

| Purpose | Repository-relative source |
| --- | --- |
| Shared viewBox, typography, strokes | `apps/ui/app/illustration-lab/blueprint-drawing.tsx` |
| Primary geometry reference | `apps/ui/app/illustration-lab/primitives-blueprint.tsx` |
| Selected Particles composition (C03) | `apps/ui/app/illustration-lab/particles-blueprint.tsx` |
| Selected 404 composition (E02) | `apps/ui/app/illustration-lab/not-found-blueprint.tsx` |
| Original Particles style anchor (C00) | `apps/ui/app/illustration-lab/original-particles-blueprint.tsx` |
| Main integration target | `apps/ui/app/page.tsx` |
| Particles integration target | `apps/ui/app/particles/page.tsx` |
| 404 integration target | `apps/ui/app/not-found.tsx` |
| Review gallery and study IDs | `apps/ui/app/illustration-lab/` |
| Revision feedback metadata | `apps/ui/app/illustration-lab/study-direction.ts` |
| Typography rules | `packages/ui/src/fonts/font-guide.md` |

The lab owns its drawings and wrapper independently of the production integration in PR #912. Use the lab’s `BlueprintDrawing` wrapper for compatible studies. It supplies monochrome foreground, Cal Sans, automatic optical sizing, and GEOM25. Preserve semantic surface masks such as `var(--color-sidebar)` and inspect them against the actual host background. Static illustration components do not need client-side state.

Keep page layouts local, as explicitly requested by the user. Do not recreate a shared page-hero component. The lab’s hero mode should use the centered illustration-first arrangement for 404 studies and the split layout for other categories.

The selected production integration for Main, Particles, and Chat uses the heading treatment from [PR #895](https://github.com/cosscom/ui/pull/895): `clamp(2.25rem, 1.5rem + 2.6vw, 4rem)`, line-height 1, and GEOM50, with normal letter spacing and automatic optical sizing. These settings are scoped to those pages. Particles keeps C03 on the right and its search/filter directly beneath the left-aligned description, rather than adding hero CTAs.

Keep the project’s typography: no added letter-spacing, no synthesized bold/italic, one GEOM value per role, and typeset punctuation. Read the current guide for details instead of copying font configuration into every drawing.

The unlinked comparison route is `/ui/illustration-lab?variant=<study-id>&view=drawing` (or `view=hero`). Original IDs are `primitives-reference` and `particles-reference`; recent IDs include `cal-week-grid`, `cal-availability-plan`, `interface-spacing-plan`, `workflow-switch-plan`, and `workflow-branch`. Inspect current app configuration for the running address. Use bundled references when this checkout is unavailable; do not assume localhost is running. The lab has no navigation or sitemap link and opts out of indexing.

Use focused repository formatting/type checks appropriate to the edited files, plus browser inspection. Keep unselected drawings on the lab page until the user chooses a production integration. When revising a production drawing, inspect its current source and update the corresponding lab snapshot explicitly when both should show the same revision. Keep lab imports local so either addition can ship independently. This skill does not authorize publishing, pushing, or creating a PR by itself.
