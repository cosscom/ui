# Plotter

Editable flat monochrome construction illustrations, with distinct drawing and animation workflows.

## Install and invoke

Copy this **complete `plotter` directory** into the agent's skills directory, keeping its name and relative paths. Invoke `$plotter`; automatic discovery also covers requests to draw, critique, refine, or animate illustrations in this style. Standalone work needs no coss checkout, conversation history, package manager, or external font download.

Example briefs:

- “Use $plotter to show a 20-minute appointment between two 5-minute buffers as a standalone 560 × 440 SVG.”
- “Use $plotter to illustrate agent registration as fragments becoming one record. Keep the forms transparent and use a grid only if it explains the construction.”
- “Use $plotter to animate this SVG so the selected core seats in the carrier. Preserve its static appearance and include pause/replay and a reduced-motion still.”
- “Use $plotter to critique this loop's contact and hatch behavior without editing it.”

Keep one entrypoint: users ask to draw or animate a Plotter illustration, so the same name routes both intentions. The [drawing workflow](references/drawing.md) and [animation workflow](references/motion.md) have separate completion criteria while sharing direction, grammar, tokens, and references. A separate animation skill would only be useful if an independently invoked capability emerged beyond this illustration language.

## What is portable

Seven bundled SVG anchors are sufficient for choosing a construction reference. The [visual grammar](references/visual-grammar.md) includes its teaching SVGs; the [foundation](references/foundation.md) contains dependency-free geometry helpers and generated role styles. Optional coss integration and dated feedback are loaded only for their explicit branches.

| Example | Open or generate it from the copied skill directory |
| --- | --- |
| Static registration, using the working arrow/dimension helpers | `node assets/examples/registration.mjs > registration.svg` |
| Resolved static SVG with editable labels | `python3 scripts/export-svg.py registration.svg registration-export.svg --id-prefix registration` |
| Animation and static fallback, with shared role CSS | Open `assets/examples/assembly-motion.html` in a modern browser; keep `assets/foundation/roles.css` in place. |

Node.js is needed for the authoring example; Python 3 is needed for the static exporter; recipients opening a resolved SVG need neither. The motion example uses browser SVG animation and a small player without a build or server. Exact Cal Sans typography depends on that font being available; the fallback is sans-serif.

The examples illustrate implementation and are not additional approved style references. In this instruction revision they were source-reviewed only; they were not executed, rendered, or evaluated in a fresh session. No automated checks or tests were run.

## Maintain the package

The canonical source is `apps/ui/skills/plotter` in the coss repository. Update installed copies as complete folders. [`standard.json`](assets/foundation/standard.json) owns shared numeric defaults; `scripts/build-standard.py` generates the runtime data, CSS, and marked drafting tables. Generated or example-embedded styles are outputs, not separate palettes to edit. Regenerate an example's SVG before export when the standard changes.

Current instructions live outside [history](references/history/index.md). Preserve the seven reference snapshots and their revision manifest; update general guidance from specific evidence rather than extending every past preference to all drawings. The repository's older evaluation records establish only their original tasks and revisions.
