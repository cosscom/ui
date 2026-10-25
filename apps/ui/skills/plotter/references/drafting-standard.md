# Plotter drafting standard

Research and house specification, 2026-10-25. Use for new drawings and deliberate revisions. Read the [approved references](approved-references.md) for composition and the [verification prompt](verification-prompt.md) before review. The [source audit](source-audit.md) records known exceptions in the inspected revisions; approval of an illustration’s appearance does not prove every annotation.

## Name and scope

**Monochrome orthographic construction diagrams** is the precise name for this house illustration language. “Blueprint illustrations” remains useful informal shorthand. The drawings present one flat geometric relationship through visible outlines, restrained construction lines, sparse dimensions, and occasional line hatching. P00 supplies the circle/square relationship, C02 the modular assembly and switch geometry, and B04 the alignment of work within a time grid.

“Blueprint” historically identifies a reproduction process: cyanotypes commonly reproduce designs as white lines on a blue ground. Black or theme-colored SVG linework is not a cyanotype reproduction. This distinction concerns medium, not drawing accuracy. [Te Papa collection terminology](https://collections.tepapa.govt.nz/category/421176)

Declare one mode in the drawing’s source note or review:

| Mode | What the drawing asserts | Required evidence |
| --- | --- | --- |
| Geometric construction | Coordinates, radii, tangencies, equal intervals, or proportions | Calculations from the actual SVG geometry |
| Physical technical view | The shape of a real or explicitly hypothetical object in a stated plan, elevation, or section | Defined projection, scale/units, cut plane where relevant, source/model, dimensional consistency |
| Functional schematic | Connectivity and behavior of a named system | Defined nodes, ports, edge meaning, state, authoritative symbol/behavior references |
| Conceptual diagram | A limited analogy explaining a service or UI relationship | Explicit mapping and limitations, current primary sources for product claims, correct depicted geometry |

Most Plotter drawings are geometric constructions or conceptual diagrams. A plug outline is not automatically an electrical schematic; a circle marked “Cache” is a conceptual node, not an IEC electrical component. Orthographic here describes the flat presentation, not a claim that every diagram is a projection of a buildable object.

## What the external standards establish

These are verified source facts, separate from the house choices below:

- **ISO 128-2:2022** concerns technical line types, configurations, leaders, and references, including discipline-specific applications. Its public abstract supports treating line roles consistently; it does not establish Plotter’s pixel values. [ISO catalogue](https://www.iso.org/standard/83355.html)
- **ISO 128-3:2022** concerns views, sections, and cuts using orthographic projection methods. A cut or section therefore needs a meaningful relationship to an object and view. [ISO catalogue](https://www.iso.org/standard/83356.html)
- **ISO 129-1:2018** concerns presentation of dimensions and associated tolerances. Its scope distinguishes presentation from the meaning/application of dimensional tolerancing. Decorative dimensions cannot establish fit or manufacturability. [ISO catalogue](https://www.iso.org/standard/64007.html)
- **IEC 60617 DB** is IEC’s maintained collection of graphical symbols for diagrams. **IEC 60417** addresses symbols on equipment, a different use. A claimed IEC symbol needs the actual symbol entry and application context. [IEC TC 3](https://tc3.iec.ch/standard-as-database/)
- **NPS HABS drawing guidelines** distinguish line weights by the represented feature and require scale-aware adjustment. They differentiate hidden/missing features and overhead features. Their hatch rules depend on the view and material: plan poché and section treatment differ, and standard CAD surface patterns must not substitute for measured conditions. This demonstrates why “architectural hatch” is not one universal texture. [HABS guidelines, §§4.2–4.7](https://www.nps.gov/subjects/heritagedocumentation/upload/HABS-Guidelines-Measured-Drawings_508.pdf)

Research used the public ISO catalogue abstracts and the cited IEC/NPS material. It did not review the full paid ISO standards or validate individual IEC symbol entries. This document defines an internally consistent illustration standard; it does not certify ISO/IEC/HABS compliance.

## House stroke palette

All lengths below are SVG user units in a `560 × 440` viewBox. Width and opacity are independent: width expresses drawing role, opacity establishes visual emphasis. The values intentionally stay close to the approved anchors; they are house choices, not physical pen widths or quotations from ISO.

| Role | Width | Opacity | Pattern | Use |
| --- | ---: | ---: | --- | --- |
| Primary form | 0.95 | 1 | Continuous | Main silhouette or selected functional route |
| Secondary form | 0.65 | 0.50 | Continuous | Subordinate real detail |
| Dimension / leader | 0.65 | 0.50 | Continuous | Measurement, extension, explanatory leader |
| Reference guides | 0.60 | 0.24 | Continuous | Subordinate alignment projections and reference scaffold |
| Grid | 0.60 | 0.10 | Continuous | A useful repeated coordinate/module field |
| Hatch | 0.65 | 0.27 | Continuous | One declared bounded region |
| Section cut, when needed | 1.30 | 1 | Continuous | Material actually intersected by a stated cut plane |

P00’s existing `1.0` primary width is an accepted anchor variation. Continuous secondary lines share the approved diagonal’s `0.65` width and `0.50` opacity, including dimensions and leaders; do not create per-drawing variants. C02’s switch is the reusable component reference: track `30 × 18`, corner radius `9`, thumb radius `5.5`, edge inset `3.5`, primary width `0.95` at full opacity. Preserve those proportions when scaling the component as a whole.

Assign patterned lines by meaning:

| Role | `stroke-dasharray` | Width / opacity | Meaning |
| --- | --- | --- | --- |
| Axis / centerline / pitch locus | `8 3 1 3` | 0.60 / 0.24 | A center, symmetry axis, or theoretical generating locus |
| Hidden or absent outline | `3 5` | 0.65 / 0.45 | Geometry not presently visible or present; explain which in context |
| Motion or transfer | `4 6` | 0.65 / 0.50 | Proposed movement or conceptual transfer, with solid open arrowhead |

These patterns are deliberately different. A continuous construction that directly explains the principal form, such as a generating radius or inset, uses the shared secondary style; the lighter reference-guide role is reserved for subordinate scaffold. Do not choose a dash merely because it looks technical. If a drawing includes both hidden and absent features, distinguish them with labels or remove one ambiguous role. A physical hidden edge and a hypothetical motion path must never be the same unlabeled mark.

Use butt caps on dashed shafts to retain predictable dash lengths; use consistent joins. The user-approved open arrowhead has two 6-unit legs, each at 45° to the shaft: axial offset and half-width are both `6 / √2 ≈ 4.242641`. Its two arms are solid, even when the shaft is dashed, and meet the shaft’s terminal dash at the tip. Set dash phase or start the dashed path at the tip to avoid a detached arrow. Dimension endpoints use the existing 8 × 8 diagonal slash; use a radius arrow/leader for a radius rather than a slash pretending to be a point. This explicit preference in [direction.md](direction.md) takes precedence over inferred house defaults.

Draw a coincident segment once. Do not stack a grid stroke, extension stroke, and object stroke on the same segment. Split subordinate geometry at the required boundary; preserve one owner for each shared segment. Plan label clearance by shortening/splitting lines, with at least 3 units around the actual text bounds. All forms are transparent; remove area tints and background-colored patches that erase guides. Text glyph fills are allowed. A filled junction marker belongs only to a declared symbol convention, never to a background patch.

## Hatch grammar

Hatching describes a region, not a lighting effect. For every hatch, record the region’s boundary and its meaning: for example “square minus circle in this quadrant,” “selected interval,” or “unspecified material cut by this section.” Only claim a material such as concrete or steel when its representation is sourced and appropriate to the stated discipline/view.

- **H1:** parallel lines at −45° in SVG screen coordinates, width `0.65`, opacity `0.27`, perpendicular pitch `12 / √2 ≈ 8.485`. This is P00’s 12-unit spacing measured along horizontal/vertical edges.
- **H2:** the same pitch and weight at +45°, reserved for distinguishing an adjacent region. Use one angle and one pitch throughout a single region.
- Clip each line analytically or with a unique SVG clip path to the declared region. Boundaries remain continuous; hatch endpoints terminate at them without extending beyond them. Do not invent a boundary to accommodate a convenient hatch tile.
- For a cut region, exclude voids and openings. The same object keeps a consistent hatch in the same view. A generic 45° hatch does not identify material or prove a compliant section.
- **S1, schematic support:** −45° marks with horizontal/vertical extent `16`, hence length `16√2`, at a `16`-unit boundary intercept pitch; width `0.65`, opacity `0.27`. Omit strokes intersecting openings. Compact versions may retain every fourth mark. This one-sided boundary convention identifies a fixed support or schematic wall only when named; it is not a fully specified material section or H1 region.

The anchor source may contain older opacity, spacing, or fill choices. Preserve its composition; apply this normalized palette when a revision is authorized. Do not silently reinterpret old graphics as standards-compliant.

## Geometry and dimensions

Each drawing has one coordinate system and one declared dimensional scale. A local unit `u` may differ between drawings, but all `u` labels within a drawing must resolve to one value. Raw numeric dimensions describe SVG construction units unless a real-world unit and scale are explicitly supplied. A `144` label on a conceptual deployment card measures its geometry, not a Vercel product property.

Derive points, paths, and labels from the same named parameters. Preserve full precision in calculations; round serialization, not the underlying construction. A circle of center `C` and radius `r` has point `P(θ) = C + r(cos θ, sin θ)`. In SVG, positive `y` points down. A labeled circular fillet uses a true circular arc with tangent straight segments. A quadratic Bézier that merely resembles a corner does not establish its radius.

Every dimension identifies its two witnesses: edges, centers, tangent points, or datums. State which. Dimension line and extension lines must agree with those witnesses. A radius leader terminates on the declared arc and is aligned with its generating radius when drawn as a radial dimension. An angle arc must be concentric with the angle’s vertex and meet the two rays. Use `R` for radius and `⌀` for diameter consistently; do not attach either to an arbitrary curve.

House numerical tolerances for generated SVG: intended equalities and incidences must be derived exactly; serialized coordinate checks allow `0.05` SVG unit and angle checks allow `0.1°`. These thresholds accommodate decimal serialization, not inaccurate construction. Report the residual, even when it passes. Tolerances for physical manufacturing require a separate engineering specification.

## Symbols, topology, and analogy

Before drawing a connector, specify its start, end, direction, and meaning. For functional schematics, construct an explicit node/edge list and identify each port. Choose a documented junction/crossing convention; a crossing must never accidentally create a connection. Check that each physical contact, pipe, or conductor actually reaches the intended port, and that a deliberately disconnected contact remains separated.

For literal electrical schematics, cite the precise IEC 60617 symbol entry or another explicitly chosen authoritative standard, including name, identifier, and relevant application notes. Keep terminal count and orientation consistent with that source. If the entry is unavailable, mark the symbol unverified; a resemblance is not evidence. A custom symbol is allowed in a conceptual diagram when defined in a local legend and not attributed to IEC.

For service illustrations, maintain a short mapping: depicted object → product concept; connecting line → relationship; omitted processes → limits of the claim. Verify product behavior against current official documentation. Geometric equality may encode “same source version” or “equal amounts,” but must not imply identical builds, zero fees, guaranteed availability, or timing that the service does not provide.

Mechanical symbols require the same discipline. Pitch-circle tangency and shared module are necessary geometric checks for a gear illustration, but do not prove conjugate tooth profiles, interference-free rotation, load capacity, or manufacturability. Call simplified profiles schematic and qualify engagement claims unless the relevant contact/kinematic checks have been performed.

## Completion gate

For an explicit technical verification request, complete the [verification report](verification-prompt.md) for the current source and rendered revision. For an ordinary refinement, check only affected claims and their dependencies, record the relevant calculation or visual check concisely, and disclose unverified behavior. Geometry, semantics, and visual fit remain separate verdicts. A beautiful reference can contain a factual defect; a mathematically correct drawing can still fail art direction. There is no “unquestionable” guarantee: there is a bounded claim, evidence, residual error, and a reviewable conclusion.
