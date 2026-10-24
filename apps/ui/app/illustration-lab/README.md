# Plotter illustration lab

Direct route: `/ui/illustration-lab`. This page is intentionally absent from site navigation and the sitemap, and its metadata disables indexing. The old prototype URL redirects here with its query parameters.

The lab preserves all 54 remaining experiments, their stable codes, critique notes, and earlier rejected directions. E04 was removed at the user’s request. The current-direction filter hides earlier rejected studies; All experiments reveals them. Drawing/hero previews and the in-memory shortlist remain available.

## Production selections

| Study | Selected page | Lab source |
| --- | --- | --- |
| P00 | Main | `./primitives-blueprint.tsx` |
| C03 | Particles | `./particles-blueprint.tsx` |
| E02 | 404 | `./not-found-blueprint.tsx` |

The lab owns these drawing snapshots and its `BlueprintDrawing` wrapper. It can ship independently of the production illustration integration in PR #912. Original C00 and E00 remain separate historical studies. When a selected production drawing changes, update its lab snapshot explicitly if that revision should also appear in the gallery.

## Plotter skill

The reusable style instructions, visual anchors, and feedback ledger live in [`../../skills/plotter`](../../skills/plotter). Keep specific user feedback separate from interpretations; a new experiment is unreviewed until the user responds. Add studies to their subject collection and preserve existing IDs when revising them.
