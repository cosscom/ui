# SVG and coss integration

Read this file when integrating into coss, adapting an existing host component, or working on the showcase’s motion examples. Standalone drawing uses the bundled references and drafting standard without a repository checkout.

## Geometry and rendering

The established examples use a `560 × 440` SVG viewBox. Use the [drafting standard](drafting-standard.md) for current line roles, dash patterns, hatch spacing, and geometry tolerances. Preserve transparent forms and adapt the complete composition to its intended display size; historical fills and per-study stroke variations are not new defaults.

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
| Shared viewBox, typography, strokes | `apps/ui/app/plotter/blueprint-drawing.tsx` |
| Primary geometry reference | `apps/ui/app/plotter/primitives-blueprint.tsx` |
| Selected Particles composition (C03) | `apps/ui/app/plotter/particles-blueprint.tsx` |
| Selected 404 composition (E02) | `apps/ui/app/plotter/not-found-blueprint.tsx` |
| Historical original Particles drawing (C00) | `apps/ui/app/plotter/original-particles-blueprint.tsx` |
| Main integration target | `apps/ui/app/page.tsx` |
| Particles integration target | `apps/ui/app/particles/page.tsx` |
| 404 integration target | `apps/ui/app/not-found.tsx` |
| Showcase and illustration IDs | `apps/ui/app/plotter/` |
| Feedback evidence | `apps/ui/skills/plotter/references/direction.md` |
| Typography rules | `packages/ui/src/fonts/font-guide.md` |

The showcase owns its drawings and wrapper independently of the production integration in PR #912. Use its `BlueprintDrawing` wrapper for compatible illustrations. It supplies monochrome foreground, Cal Sans, automatic optical sizing, and GEOM25. Follow the current transparency and grid-construction feedback in [direction.md](direction.md) when revising these drawings. Static illustration components do not need client-side state.

Choose style references from [the approved set](approved-references.md); production placement and bundled historical screenshots are separate from reference approval.

Keep production page layouts local, as explicitly requested by the user. Main and Particles use left-aligned headline/description with one drawing on the right; main has CTAs and Particles has its search/filter beneath the copy, retaining existing filtering behavior. The 404 uses a centered stack with the illustration above its heading, description, and CTA. Do not recreate a shared page-hero component. The showcase displays each standalone drawing at its native 560×440 size in the gallery, with no enlargement dialog. Grid columns accommodate the full canvas; narrow screens scroll within the drawing rather than scaling it down. Keep the illustration captions inline. Do not add the extra compact empty-state application cards (such as “Page not found” or “No results found”); the user explicitly removed those from the gallery.

The selected production drawings are P00 for Main, C03 for Particles, and E02 for the 404. Placement is separate from style-reference approval; C03 and historical C00 are outside the approved 27.

The selected production integration for Main, Particles, and Chat uses the heading treatment from [PR #895](https://github.com/cosscom/ui/pull/895): `clamp(2.25rem, 1.5rem + 2.6vw, 4rem)`, line-height 1, and GEOM50, with normal letter spacing and automatic optical sizing. These settings are scoped to those pages. Particles keeps C03 on the right and its search/filter directly beneath the left-aligned description, rather than adding hero CTAs.

Keep the project’s typography: no added letter-spacing, no synthesized bold/italic, one GEOM value per role, and typeset punctuation. Read the current guide for details instead of copying font configuration into every drawing.

The unlinked showcase route is `/ui/plotter`; `?variant=<study-id>` selects the drawing’s category and scrolls to its inline card for compatibility with existing preview links. Category filters organize the collection. Original IDs are `primitives-reference` and `particles-reference`; recent IDs include `cal-week-grid`, `cal-availability-plan`, `interface-spacing-plan`, `workflow-switch-plan`, and `workflow-branch`. The old lab and prototype routes redirect here with their query parameters. Inspect current app configuration for the running address. Use bundled references when this checkout is unavailable; do not assume localhost is running. The showcase has no navigation or sitemap link and opts out of indexing.

Use focused repository formatting/type checks appropriate to the edited files, plus browser inspection. Keep standalone illustrations in the showcase until the user chooses a production integration. Removed drawings remain documented in the feedback ledger rather than retained as hidden gallery entries. When revising a production drawing, inspect its current source and update the corresponding showcase snapshot explicitly when both should show the same revision. Keep showcase imports local so either addition can ship independently. This skill does not authorize publishing, pushing, or creating a PR by itself.

## Engineering animation previews

W05 and O07 keep their static gallery drawings in `engineering-studies.tsx`. Their motion experiments live separately in `production-chain-motion-drawing.tsx` and `newtons-cradle-motion-drawing.tsx`, inside the showcase’s Animations section. `engineering-motion-preview.tsx` owns playback, replay, static fallback, reduced-motion handling, and pausing when the drawing leaves view; its child SVG owns the timeline. This separation is a showcase choice, not a shared production page hero.

Keep construction guides fixed and outside swept regions when they would otherwise cut through moving parts. Do not hide guides with opaque object fills. W05’s rigid carriers preserve their pitch and hand coincident edge ownership over at seating; O07’s bobs rotate about fixed pivots with constant string lengths. Animation does not turn either illustration into a manufacturing design or a complete physics simulation. Review the full loop, contacts, restart boundary, and controls separately from the static source.
