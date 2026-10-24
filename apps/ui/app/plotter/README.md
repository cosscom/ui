# Plotter illustrations

Direct route: `/ui/plotter`. This showcase is intentionally absent from site navigation and the sitemap, and its metadata disables indexing. The former `/ui/illustration-lab` and `/ui/illustration-lab-prototype` URLs redirect here with their query parameters.

The gallery presents 39 flat monochrome illustrations, organized by subject with category filters and enlarged previews. Stable illustration IDs preserve links and feedback history. Discarded drawings have been removed from the collection; their critique remains in the Plotter skill’s feedback ledger. Inclusion in this curated collection does not make every drawing an approved visual anchor.

## Production selections

| Illustration | Selected page | Showcase source |
| --- | --- | --- |
| P00 | Main | `./primitives-blueprint.tsx` |
| C03 | Particles | `./particles-blueprint.tsx` |
| E02 | 404 | `./not-found-blueprint.tsx` |

The showcase owns these drawing snapshots and its `BlueprintDrawing` wrapper. It can ship independently of the production illustration integration in PR #912. Original C00 and E00 remain separate examples. When a selected production drawing changes, update its showcase snapshot explicitly if that revision should also appear in the gallery.

## Plotter skill

The reusable style instructions, visual anchors, and feedback ledger live in [`../../skills/plotter`](../../skills/plotter). Keep specific user feedback separate from interpretations; a new revision is unreviewed until the user responds. Add illustrations to their subject collection and preserve existing IDs when revising them.
