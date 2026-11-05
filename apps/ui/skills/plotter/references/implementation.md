# coss integration

Read only when editing the coss gallery, its React components, or a production integration. Portable composition, geometry, and motion instructions live in the [drawing](drawing.md), [animation](motion.md), and [foundation](foundation.md) references. This file is a host adapter, not a dependency of the installed skill.

## Locate the host sources

Use the current checkout and read its applicable `AGENTS.md`. Paths below are repository-relative; neither a fixed absolute path nor a running local server is assumed.

| Responsibility | Source |
| --- | --- |
| Portable token/geometry source | `apps/ui/skills/plotter/assets/foundation/` |
| Gallery SVG wrapper and role-style opt-in | `apps/ui/app/plotter/blueprint-drawing.tsx` |
| Editable catalogue SVGs | `apps/ui/app/plotter/drawings/` |
| Catalogue compiler and shared SVG serializer | `apps/ui/scripts/build-plotter-drawings.py`, `apps/ui/scripts/plotter_svg.py` |
| AG01 helper-fragment recipe | `apps/ui/skills/plotter/assets/examples/render-registration.mjs` |
| AG01 host file adapter | `apps/ui/scripts/build-plotter-registration.mjs` |
| Static W05 and O07 | `apps/ui/app/plotter/engineering-studies.tsx` |
| W05 shared core hatching | `apps/ui/app/plotter/production-chain-hatching.tsx` |
| W05 and O07 timelines | `apps/ui/app/plotter/production-chain-motion-drawing.tsx`, `apps/ui/app/plotter/newtons-cradle-motion-drawing.tsx` |
| Engineering playback, fallback, and visibility | `apps/ui/app/plotter/engineering-motion-preview.tsx` |
| Host adapter for resolved pilot exports | `apps/ui/scripts/export-plotter-pilots.tsx` |
| Font configuration | `packages/ui/src/fonts/font-guide.md` |

`BlueprintDrawing` opts into shared roles with `roles`. Legacy unmarked drawings keep their original inherited stroke defaults. The SVG-to-JSX builder preserves supported root styles, removes standalone fixed ink and the root font family so the gallery inherits the host theme and loaded font, and gives repeated definitions local IDs. Font weight, optical sizing, and GEOM settings remain authored. Standalone SVGs retain their own font stack. Edit the SVG source and regenerate its React output; avoid hand-editing generated catalogue or grammar components.

When standard or AG01 source changes require regeneration, the repository-root sequence is:

```sh
python3 apps/ui/skills/plotter/scripts/build-standard.py
node apps/ui/scripts/build-plotter-registration.mjs
python3 apps/ui/scripts/build-plotter-drawings.py
```

Generation updates source artifacts; it does not establish visual correctness. Inspect the affected composition and scope any automated verification to the user's instructions. The optional repository integrity command is documented in the app's scripts; installed users do not need it.

## Preserve the integration boundary

The gallery and production pages own their layout independently. Keep current layouts and scope changes to the requested drawing. Existing production selections are P00 for Main, C03 for Particles, and E02 for the 404; production selection is separate from style-reference approval. Inspect current page source before changing a selected hero rather than reconstructing it from historical feedback.

The unlinked `/ui/plotter` showcase uses category filters and stable `?variant=<study-id>` links. It presents native `560 × 440` drawings inline with captions; narrow cards scroll locally. Preserve IDs, keep removed studies out of active metadata, and retain the existing grammar isolation behavior. Focused grammar marks keep their original style; supplemental grid segments restore only the portions hidden with a form.

Static drawings and animation timelines remain separate. W05's static and animated core faces share a hatch component; its carrier frames stay unhatched. The engineering preview owns pause/resume, replay, static fallback, reduced motion, and visibility. A timeline edit should not silently redesign its still or replace unrelated playback controls. Current source owns exact timing; [historical feedback](history/direction.md) explains specific revisions and must not supply stale constants.

## Portable delivery from the host

From the repository root:

```sh
bun apps/ui/scripts/export-plotter-pilots.tsx /tmp/plotter-exports
```

This coss-only adapter renders the selected static W05 drawing and sends it, along with AG01, through the packaged exporter. Recipients need neither React nor Bun. General standalone authoring uses the [portable examples](foundation.md#portable-examples) and Python exporter directly.
