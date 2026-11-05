# Animate a Plotter drawing

Use this workflow for an animated construction, a loop, or motion added to an existing Plotter illustration. The drawing and animation share [visual direction](direction.md), [visual grammar](visual-grammar.md), and the [drafting standard](drafting-standard.md). Read those before choosing moving parts. Read [foundation.md](foundation.md) when using role styles or shared geometry; it is also the contract for static export.

## 1. Establish the still and the change

For a new subject, complete the [drawing workflow](drawing.md) first. For an existing illustration, inspect its editable source and render, preserving its composition and authored exceptions. Choose a still that explains the subject when motion is unavailable; the first animation frame may be a poor fallback.

Name the relationship motion adds: a part seats, an aperture changes, an interval advances, or a route transfers something. Describe the initial state, significant event, and final state. Decide whether the result plays once, reverses, or loops. Use a loop only when its return has a coherent meaning.

**Done when:** an editable static fallback exists, the intended change is stated, and each moving part has an identifiable source group. If the brief needs a complete redesign, resolve its composition before adding a timeline.

## 2. Define the motion contract

Keep three responsibilities separate:

| Responsibility | Owns |
| --- | --- |
| Drawing | Geometry, semantic groups, line roles, labels, hatch regions, static fallback |
| Timeline | Drawing-specific transforms or path changes, timing, contact events, and loop/reset behavior |
| Playback | Start, pause/resume, replay, static mode, reduced motion, and visibility pausing |

Use shared geometry helpers for supported marks; keep the mechanism's timing local. List only invariants the drawing actually claims. Rigid parts keep their size; pivoted parts keep their attachment; a hatch stays on the same region; an indexing sequence retains its pitch. A conceptual transition is not proof of physical simulation.

For seating or contact, specify which shape owns each coincident edge before, during, and after contact. Transfer ownership or shorten the visible segment so the join has one stroke. Keep forms transparent. Place fixed guides outside swept regions where they would obscure moving parts; use geometric clipping for genuine openings or entry/exit apertures.

**Done when:** every moving group has its transform or path rule, every contact has an edge owner, and the end-to-start transition has an explicit treatment. A continuous loop has a continuous visible state; a reverse or reset is intentional and legible.

## 3. Implement the timeline and player

Preserve role styling and opacity grouping from the still. Transform a rigid part and its hatching together. Move explanatory guides only when they belong to the moving construction; keep page typography and fixed reference geometry stable. Native SVG animation, the host's existing animation system, or a small browser script are suitable; the portable foundation has no clock or playback dependency.

For repeating motion, provide pause/resume and replay. Pause while the drawing is outside the viewport or the page is hidden. Respect `prefers-reduced-motion` with the chosen still, including changes to that preference while the page is open. Show the still when JavaScript or the animation capability is unavailable. A paused animation and the chosen still are different states; keep that distinction in the controls and implementation.

**Done when:** the drawing, timeline, and playback can be identified separately in the source; motion retains the still's line hierarchy and hatch meaning; and each delivery context has a deliberate fallback.

## 4. Inspect and deliver

Within the user's permitted review scope, view the complete motion and its static fallback at their intended size. Inspect approach, contact, separation, and the loop boundary; look for doubled edges, hatch drift, unexpected occlusion, and labels cut by moving forms. Exercise the controls and reduced-motion/visibility behavior when permitted. Source inspection alone does not establish runtime behavior; name any unperformed review rather than calling it passed. Respect a request to skip automated checks and tests.

Deliver the editable animation source, its static fallback, and the files needed to open them. State the movement's purpose and any unverified behavior. For a standalone static SVG, export the chosen still with the packaged exporter; active animation is outside that exporter's contract. For animated HTML, include its actual stylesheet dependencies or inline the generated role stylesheet when packaging a single file. A file that depends on coss imports or an application stylesheet is not a portable delivery.

**Done when:** both moving and static deliverables are available with opening instructions, required local resources accompany them, and the review report distinguishes what was observed from what remains unverified.

## Portable example

Open [assembly-motion.html](../assets/examples/assembly-motion.html) directly in a modern browser after copying the complete `plotter` folder. It reads the adjacent packaged `../foundation/roles.css`; retain that relative path. No server, package installation, coss checkout, or external font is needed. If moving the HTML alone, inline the contents of that generated CSS file rather than maintaining another palette.

The small example seats a hatched core on a base and withdraws it. Its fixed base owns the shared contact edge; the core's bottom stroke hides while seated. Hatching travels with the core, and one static SVG state serves no-JavaScript and reduced-motion use. The player supplies pause/resume, replay, static mode, and visibility pausing.

This is an editable implementation example, not the exact W05 timeline, an approved visual reference, a physics simulation, or a resolved standalone SVG. Its durations and geometry demonstrate the relationship; choose the composition from the bundled approved references. Browser animation behavior still needs review in the eventual delivery environment.
