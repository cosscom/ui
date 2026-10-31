# Plotter illustrations

Direct route: `/ui/plotter`. This showcase is intentionally absent from site navigation and the sitemap, and its metadata disables indexing. The former `/ui/illustration-lab` and `/ui/illustration-lab-prototype` URLs redirect here with their query parameters.

The gallery presents flat monochrome illustrations, organized by subject with category filters and native-size inline drawings. Stable illustration IDs preserve links and feedback history; `?variant=<study-id>` selects the category and scrolls to the drawing. Discarded drawings have been removed from the collection; their critique remains in the Plotter skill’s feedback ledger. Inclusion in this curated collection does not make every drawing an approved visual anchor.

## Fresh-session examples

The user selected the original versions without added background grids from the 2026-10-31 evaluation:

| Code | Illustration | Study ID |
| --- | --- | --- |
| C04 | Shared frame | `particles-shared-frame` |
| K09 | Appointment buffers | `cal-appointment-buffers` |
| S15 | No matching results | `state-no-matching-results` |

The original SVGs, prompts, and feedback are preserved in [`../../plotter-evals/2026-10-31`](../../plotter-evals/2026-10-31). These catalog additions retain their own review history; they do not change the skill’s earlier approved reference set.

## Production selections

| Illustration | Selected page | Showcase source |
| --- | --- | --- |
| P00 | Main | `./primitives-blueprint.tsx` |
| C03 | Particles | `./particles-blueprint.tsx` |
| E02 | 404 | `./not-found-blueprint.tsx` |

The showcase owns these drawing snapshots and its `BlueprintDrawing` wrapper. It can ship independently of the production illustration integration in PR #912. Original C00 and E00 remain separate examples. When a selected production drawing changes, update its showcase snapshot explicitly if that revision should also appear in the gallery.

## Plotter skill

The reusable style instructions, visual anchors, and feedback ledger live in [`../../skills/plotter`](../../skills/plotter). Keep specific user feedback separate from interpretations; a new revision is unreviewed until the user responds. Add illustrations to their subject collection and preserve existing IDs when revising them.
