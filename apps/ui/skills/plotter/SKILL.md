---
name: plotter
description: Create, critique, and refine flat monochrome blueprint illustrations in the established coss UI style, using the user-approved construction studies as visual references. Use for technical hero illustrations, service concepts, interface construction studies, scheduling diagrams, and empty states in this style; not general architectural drafting or generic line art.
---

# Plotter

Build an editable, flat monochrome illustration around one construction relationship: radius, alignment, spacing, assembly, routing, or intersection. The result should have one readable gesture and generous empty space. Establish the static drawing before considering motion.

## Establish the reference

Read the [approved reference index](references/approved-references.md), choose the nearest construction relationship, and inspect its bundled SVG. Six snapshots cover geometric construction, modular assembly, time intervals, service concepts, conversation, and absence. They work without the coss checkout; the wider 27-drawing reference set is available when the repository is present. A familiar subject alone is not a sufficient match.

The snapshots establish composition and hierarchy. Some retain historical fills or line treatments; use the [drafting standard](references/drafting-standard.md) for new linework, transparent forms, hatching, and geometric tolerances. Source revisions are recorded in the snapshot manifest. Appearance approval does not certify technical accuracy or every subsequent revision.

## Compose

- Use one flat plane. Exclude perspective, isometric views, skewed or tilted objects, physical depth, glossy 3D, colorful gradients, and science-class atom diagrams. Diagonal radius lines and callout leaders can explain geometry without tilting the form.
- Keep the palette black, off-white, and soft gray. Adapt those values to the host’s theme while preserving the monochrome hierarchy.
- Make the main form read first, meaningful construction guides second, sparse dimensions and labels third. Hairline outlines must remain visible at the intended display size.
- Start from circles, rectangles, lines, arcs, slots, or modest UI fragments. Choose the central relationship before adding detail. A complete screen mockup or a large pictogram surrounded by technical marks is a poor starting point.
- Give every guide a job: tangency, radius, equal intervals, alignment, a shared baseline, or a connection. Consider a background grid when geometric construction is the subject; keep it when it helps reveal that construction. If removing it leaves the relationships equally clear, omit it. Preserve grids that carry the subject itself, such as calendar cells, or were explicitly requested for a particular drawing.
- Name what geometry alone cannot communicate. A week needs weekday or time cues; overlapping availability needs an association with people or schedules. Prefer short integrated labels over extra icons or a caption that must explain the entire image.

## Implement and inspect

Deliver editable SVG or the host’s existing vector components. The references use a `560 × 440` viewBox; fit the requested placement. Use unique IDs for repeated SVG defs, masks, or clips. A meaningful standalone diagram needs an accessible title and description; a decorative illustration can be hidden from accessibility APIs when adjacent copy supplies its meaning.

Inherit the host font, or use `Cal Sans, sans-serif` with a sans-serif fallback when Cal Sans is unavailable. Keep automatic optical sizing, no added letter-spacing, no synthesized styles, and one GEOM value per text role. Use typeset punctuation. A standalone task does not require the coss checkout or its font files.

Inspect the rendered drawing at its intended size and as a thumbnail; check narrow layouts when embedding it. Preserve identifying labels before secondary dimensions. Resolve these questions:

1. Does one central gesture survive at a glance?
2. Can the subject be identified from the form and restrained labels?
3. Do the guides explain construction, and do their measurements agree with the geometry?
4. Is there enough quiet space and separation between outlines, guides, and annotations?
5. Does the subject remain flat, without simulated depth or ornamental clutter?

If meaning is unclear, improve the structural cue or labeling before adding detail. If the composition is weak, improve its arrangement before adding guides. A passing code check does not answer either design question.

## Task-specific guidance

- **Integrating into coss or revising its motion examples:** read [SVG and coss integration](references/implementation.md), then the applicable repository instructions. Preserve the host page’s layout unless a change was requested.
- **Revising a particular existing study:** read its entries in [direction and feedback](references/direction.md). Current explicit user feedback takes precedence; gallery inclusion and production placement are separate from reference approval.
- **Technical verification:** use the [verification prompt](references/verification-prompt.md) with current source and rendered output. The [source audit](references/source-audit.md) is historical evidence for named revisions, not a requirement for every drawing or a gallery-wide certification.

## Refine from feedback

Preserve a study’s identifier when revising it unless separate alternatives were requested. Record feedback that changes future decisions in `references/direction.md`, naming the study/revision and separating the user’s preference from your interpretation. Keep this history compact.

Broad praise does not promote every example to a permanent reference. Add a visual anchor when the user identifies it as one. Improve instructions narrowly from observed failures; keep unresolved concepts open.
