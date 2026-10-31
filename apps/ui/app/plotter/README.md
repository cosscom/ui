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

## Expanded collection

The initial expansion added 78 studies. After the user removed 36 entries during visual review, 42 additions remain alongside the earlier 58: **100 illustrations** in total. The user explicitly liked the revised registration, delegation, and iris drawings. Retaining the other additions does not approve them individually or change the 27 approved visual references. Existing codes and IDs are preserved without renumbering; removed sources remain in the [review archive](../../plotter-evals/2026-10-31/catalog-expansion/removed/).

Editable sources and metadata live in [`drawings/`](drawings/). Preserve the IDs in [`drawings/manifest.json`](drawings/manifest.json); they also drive category filters and `?variant=` links. Construction and reference choices are recorded in the manifest and SVG metadata. Edit the SVG source, then regenerate the React components from the repository root:

```sh
python3 apps/ui/scripts/build-plotter-drawings.py
```

The generated `expanded-studies.tsx` uses the existing drawing wrapper and gives every rendered instance unique definition IDs. Format the generated file with the repository formatter. Do not edit it directly. The [expansion notes](../../plotter-evals/2026-10-31/catalog-expansion/notes.md) record the feedback and visual review scope.

The visual grammar uses the skill’s editable SVGs as its source. Hover, keyboard focus, or the touch toggle isolates the topic’s marks; `data-grammar-focus` identifies those elements in the source. After editing `skills/plotter/references/grammar/*.svg`, run `python3 apps/ui/scripts/build-plotter-grammar.py` from the repository root and format `visual-grammar-drawings.tsx`. The page explanations live in `visual-grammar-content.ts`.

Isolation preserves the original stroke treatment. The grid’s missing shared segments use `data-grammar-isolation-only` and are hidden in the complete drawing, then revealed at the same grid weight when the surrounding geometry disappears. Callouts are not part of a focused element unless that topic explains callouts.

## Plotter skill

The visible Visual grammar section precedes the illustrations and is reachable from the top navigation at `/ui/plotter#visual-grammar`.

The reusable style instructions, visual anchors, and feedback ledger live in [`../../skills/plotter`](../../skills/plotter). Keep specific user feedback separate from interpretations; a new revision is unreviewed until the user responds. Add illustrations to their subject collection and preserve existing IDs when revising them.
