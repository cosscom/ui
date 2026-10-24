---
name: plotter
description: Create, critique, and refine flat monochrome blueprint illustrations in the established coss UI style, using Primitives and Particles as visual anchors. Use for technical hero illustrations, service concepts, interface construction studies, scheduling diagrams, and empty states in this style; not general architectural drafting or generic line art.
---

# Plotter

Build a precise planar composition that communicates a construction relationship: radius, alignment, spacing, assembly, routing, or intersection. The result should feel like a refined architectural or electrical drawing, with one readable gesture and generous empty space.

## Establish the reference

Before drawing, inspect [Primitives](references/primitives.png) and [Particles](references/particles.png). These are the strongest user-named visual anchors. Match their composition, hierarchy, and restraint; the screenshots include page context, which is not a template to copy wholesale. For service concepts, also inspect [Linear](references/linear.png), which the user explicitly loved.

The current coss selections are P00 for the main page, [C03 for Particles](references/particles-recombination.png), and [E02 for the 404](references/not-found-interrupted-path.png). The lab keeps independent snapshots of these drawings. Inspect the host page’s component when refining a production integration; the original Particles drawing remains a style anchor.

Read [direction and feedback](references/direction.md) for the current evidence, relevant subject guidance, and unresolved choices. User feedback in the current conversation takes precedence. A study’s presence in the gallery does not make it an approved reference.

## Compose

- Use one flat plane. The user explicitly excludes perspective, isometric views, skewed or tilted objects, physical depth, glossy 3D, colorful gradients, and science-class atom diagrams. Diagonal radius lines and callout leaders can explain geometry without tilting the represented form.
- Keep the palette black, off-white, and soft gray. Adapt those values to the host’s theme while preserving the monochrome hierarchy.
- Make the main form read first, meaningful construction guides second, sparse dimensions and labels third. Hairline outlines should remain visible at the intended display size.
- Start from a small geometric vocabulary: circles, rectangles, lines, arcs, slots, and modest UI fragments. Choose one central relationship before adding detail. A complete screen mockup or a large pictogram with technical marks is a poor starting point for this direction.
- Give every guide a job. Show actual tangency, radius, equal intervals, alignment, a shared baseline, or a connection. Let grids fade where they stop explaining the form. Avoid filling empty areas with arbitrary drafting marks.
- Name what geometry alone cannot communicate. A week needs weekday or time cues; overlapping availability needs a clear association with people or schedules. Prefer short integrated labels over extra icons or a caption that must explain the whole image.
- For the coss main and Particles pages, preserve the split layout: left-aligned headline and description; a single composition on the right. The main page has CTAs beneath its copy; Particles has its search/filter directly beneath the copy, with its original filtering behavior. Treat the 404 separately: illustration above the centered heading, description, and CTA. Keep these layouts in their pages; do not introduce a shared page-hero component. Elsewhere, fit the host layout unless the user asks to restructure it. When revising a standalone study, keep the existing comparison surface.

## Implement and inspect

Use editable SVG or the host’s existing vector components for this geometric work. Read [SVG and coss integration](references/implementation.md) when implementing or checking geometry. Animation is optional future work; first make the static drawing succeed.

Inspect the rendered result at its intended hero size and as a thumbnail, then check the narrow layout when embedding it in a page. At narrow sizes, preserve labels that identify the subject; simplify secondary guides or dimensions before shrinking all annotations into illegibility. Compare it with the relevant anchors. Resolve these questions before delivering:

1. Does one central gesture survive at a glance?
2. Can the intended subject be identified from the form and restrained labels?
3. Do the guides explain how the form is constructed, and do their measurements agree with the geometry?
4. Is there enough quiet space, with clear separation between outlines, guides, and annotations?
5. Does the requested subject remain a flat construction, with no perspective, simulated depth, or ornamental clutter taking over?

If the subject is unclear, clarify the structural cue or labeling before adding detail. If the drawing feels weak, strengthen the arrangement or relationship before adding more grid lines. A passing code check does not answer either design question.

## Refine from feedback

When the user critiques a study, preserve its identifier and revise it in place unless they want separate alternatives. Record the exact preference, the relevant study/revision, and the response in `references/direction.md` when that feedback changes future decisions. Separate explicit user feedback from your interpretation. Keep the record compact by consolidating superseded guidance.

Treat broad praise as evidence of improvement, not approval of every example as a permanent rule. Promote a new visual anchor when the user identifies it as a reference. Keep unresolved concepts open. Change this skill narrowly as evidence accumulates; do not add a new skill for each subject unless its workflow genuinely diverges.
