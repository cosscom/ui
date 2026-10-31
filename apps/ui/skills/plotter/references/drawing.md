# Drawing workflow

Use for a new static illustration, a visual refinement, or critique. Complete the shared reference loading in [SKILL.md](../SKILL.md#load-the-shared-references). For critique, apply the same criteria to the supplied source/render and return findings; implement corrections only within the requested scope.

## Establish the relationship

Identify the subject, intended placement/size, deliverable, and the one relationship that should survive at a glance. For an existing drawing, inspect its current source and render before deciding what changes. Resolve missing details from the brief and host; ask only when the answer changes the meaning or deliverable.

Choose the nearest bundled construction reference. Write a short mapping in the working notes: what supplies the focal form, how parts relate, and what its guides explain. Borrow those decisions, rather than its subject alone. For service concepts, state the limited metaphor; verify any actual product-behavior claim against current primary evidence.

**Complete when:** the intended relationship, reference, output format/size, and scope of any factual claims are explicit. A generic subject such as “agents” is not yet a composition.

## Compose the static drawing

Arrange the main forms and essential labels before adding supporting marks. Relate actual boundaries, centers, intervals, or repeated parts. Give absence a structural consequence. For assembly, make the connection between fragments and result visible through consistent geometry or allocation.

Add guides only where they explain that arrangement. Choose each arrow, hatch, grid, or dimension through the shared grammar. Derive numeric labels and their witnesses from the same geometry and local unit. Keep descriptive labels distinct from measurements.

For a collection, establish this reference comparison on one representative composition before expanding. Continue through the requested subjects in manageable groups, revising weak compositions before multiplying them. This is a refinement order, not an extra permission gate.

**Complete when:** the forms and essential labels carry the idea, every supporting mark has a named purpose, and removing decorative detail does not destroy the subject.

## Implement the editable source

Read [foundation.md](foundation.md) for shared roles, helpers, and export. Use native SVG for the composition and for unsupported constructions such as curved arrows or curved hatch regions. The helper API covers straight arrows, axis-aligned dimensions, and rectangular H1/H2 hatching; it does not choose the composition.

Separate geometry from presentation and file writing. Derive paths from named parameters; retain calculation precision until serialization. Preserve opacity grouping, solid arrowheads, transparent forms, and single ownership of shared strokes. Keep IDs local and unique when drawings repeat in one document.

Use an accessible title and description for meaningful standalone output. In a host where adjacent copy supplies all meaning, decorative SVG may be hidden from accessibility APIs. Typography follows [current direction](direction.md#typography-and-presentation).

**Complete when:** the source remains editable, every dimension agrees with its witnesses, and role adoption has preserved the intended hierarchy and exceptions.

## Inspect and deliver

Render the candidate beside the selected reference at a common intended size, then inspect the thumbnail. For a revision, also compare with its own previous render. Inspect both themes when the host uses them and the actual narrow layout when embedding it.

Resolve these concrete questions:

- Does one focal relationship survive at a glance, with recognizable subject cues?
- Do construction marks explain exact relationships and remain subordinate?
- Are essential labels readable, with clear gaps and no accidental clipping?
- Are forms transparent and flat, with no duplicated shared edges?
- Does each numeric or behavioral claim have evidence appropriate to the drawing's stated scope?

Improve arrangement or recognition before adding detail. If rendering is unavailable, deliver the source with the visual review explicitly pending; a source reading cannot establish visual quality.

For standalone SVG, use the packaged static exporter. Resolve ink and tokens, retain editable labels, and disclose font fallback differences. A themeable source that references packaged CSS and a resolved standalone SVG are different deliverables.

**Complete when:** the requested source and export/preview exist; the applicable visual questions have an observed answer or a named limitation; and the handoff states the relationship, intentional exceptions, and inspections actually performed. Source generation is not visual approval.

## Portable starting example

[`registration.mjs`](../assets/examples/registration.mjs) reads the adjacent editable [registration.svg](../assets/examples/registration.svg) and writes the result to standard output without changing the template. Its drawing-specific [renderRegistration recipe](../assets/examples/render-registration.mjs) fills the marked arrow/dimension fragments and generated styles using the shared foundation. Edit that recipe to change placement or label clearance. The example uses only Node's standard library and this package's foundation. It is an implementation example, not an additional approved anchor or a template for every agent concept.

From the copied `plotter` directory, with Node.js and Python 3 available:

```sh
node assets/examples/registration.mjs > registration.svg
python3 scripts/export-svg.py registration.svg registration-export.svg --id-prefix registration
```

The first file is editable, themeable SVG with embedded generated role CSS. The second has resolved appearance and no coss, JavaScript, or external CSS dependency. Opening it does not require Node or Python. Adapt the example's parameters and labels to a new brief; preserve the relationship only if it fits that brief. The width witnesses come from the record rectangle; the label clearance and surrounding composition are authored explicitly and need adjustment when text or layout changes.
