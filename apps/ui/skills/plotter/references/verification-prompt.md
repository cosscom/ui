# Plotter verification prompt

Copy the prompt below when a technical verification or a full review is requested. Ordinary visual refinements need only concise checks of changed claims and their dependencies; they do not require the full report each time. Supply the actual SVG/TSX source and a rendered image; a screenshot alone cannot establish exact geometry. The reviewer reports findings before editing unless corrections are already authorized.

```text
Review this Plotter illustration as an independent technical and visual reviewer.

Inputs
- Study ID and intended subject:
- Current SVG/TSX source, dependencies, and revision:
- Rendered image at intended size; compact/thumbnail and theme variants where used:
- Intended mode: geometric construction / physical technical view / functional schematic / conceptual diagram:
- Nearest approved references and which relationship each supplies:
- Claimed units, scale, equations, behavior, and external sources:

Resolve the installed Plotter skill directory, then read its SKILL.md and
references/drafting-standard.md and references/approved-references.md. For an
existing study, also read its relevant entries in references/direction.md.
Treat appearance approval as art-direction evidence, not as proof of
mathematical or product accuracy.

1. Establish the claim boundary.
   State the one relationship this drawing communicates. List every visible
   numeric label, radius/diameter/angle claim, repeated spacing, connection,
   hatch region, technical symbol, and product-behavior claim. Classify each
   as geometry, technical convention, functional behavior, or analogy.
   Identify what the drawing intentionally does not claim.
   Done when every meaningful mark has a role and every claim has a row.

2. Recover the actual construction.
   Read source parameters, transforms, clipping, inherited styles, and path
   commands. Resolve all coordinates into one frame. Record centers, radii,
   endpoints, relevant bounds, and the value of u. Derive label values from
   those coordinates independently. Source comments are claims to test.
   Done when each claim can be traced to exact source locations and data.

3. Calculate geometry; do not judge it by resemblance.
   - Distance: d = hypot(x2-x1, y2-y1); verify which witnesses are measured.
   - Circle incidence: residual = abs(hypot(P-C)-r).
   - Point on a segment: cross-product residual plus parameter 0 <= t <= 1.
   - Tangency: radius perpendicular to tangent, and point on both objects.
   - Circle tangency: center distance equals r1+r2 (external) or |r1-r2|
     (internal), with the intended contact point checked.
   - Angles: atan2 or normalized dot product; check the actual rays, center
     and endpoints of any angle arc, SVG arc flags, and sweep direction.
   - Circular fillets: correct radius, center, endpoint incidence, tangent
     joins, and continuity; do not treat an arbitrary Bézier as circular.
   - Repetition: list successive differences and compare with declared u.
   - Hatches: angle, perpendicular pitch, clipping region, exclusions, and
     boundary intersections; check duplicate coincident strokes.
   - Layout labels: compute rendered text bounds where available; inspect
     clearance, collisions, clipping, and missing essential labels.
   Use exact parameter relationships and the house serialization thresholds
   (0.05 SVG unit and 0.1°). Report expected, actual, and residual values.
   A physical fit claim needs its own engineering tolerances.
   Done when all applicable geometric claims have calculations, or an
   explicit reason they could not be verified.

4. Verify topology and behavior separately.
   For a schematic, list nodes, ports, and directed/undirected edges. Check
   every intended junction and crossing. Verify terminal count, states,
   direction, and continuity. Trace at least one complete claimed path.
   For a mechanism, distinguish static placement from kinematics. Shared
   module and tangent pitch circles do not prove a valid gear mesh; actual
   tooth engagement requires profile, phase, and motion/contact evidence.
   For service diagrams, verify each claim against current first-party docs.
   State which dimensions represent only the illustration’s construction.
   Done when claimed behavior is supported or marked needs qualification.

5. Verify symbols and drafting roles.
   Inventory stroke widths, opacities, dash patterns, arrows, and hatch roles.
   Compare them with drafting-standard.md. Identify a precise source entry
   for any claimed standardized symbol. Separate sourced facts from house
   conventions. Check transparent geometry, one owner per shared segment,
   and solid arrow caps meeting dashed shafts. Never assert ISO/IEC
   compliance from a catalogue abstract or from visual similarity.
   Done when each role is consistent or has a specific reported exception.

6. Inspect the render against approved anchors.
   Check the actual hero size and thumbnail; inspect compact/mobile use and
   both themes when applicable. Assess flatness, one focal relationship,
   subject recognition, quiet space, line hierarchy, and readable labels.
   Name what was actually viewed. If rendering is unavailable, mark visual
   verification unperformed; source checks cannot substitute for it.
   Done when each used presentation has evidence or an explicit limitation.

Output
- Scope: study, revision/file hash, inspected modes/sizes, primary sources.
- Verdicts: geometry / behavior / conventions / visual fit, each PASS,
  FAIL, or NEEDS QUALIFICATION. “Not applicable” is allowed with a reason.
- Evidence table:
  Claim | Class | Source location | Expected | Actual/calculation |
  Residual/tolerance | Evidence URL or render | Verdict
- Findings, highest impact first: observable defect, why it matters,
  smallest adequate correction, and the exact check that would close it.
- Unverified items and limitations; do not silently promote them to passes.
- Overall result: FAIL if a required claim is contradicted; NEEDS
  QUALIFICATION if no contradiction is found but a required claim lacks
  evidence; PASS only for the explicitly inspected scope.

Use concise explanations. Produce reproducible evidence rather than
assurances. Do not call the drawing unquestionable, physically correct,
manufacturable, or standards-compliant without the corresponding proof.
```

## Minimal report example

| Claim | Calculation | Verdict |
| --- | --- | --- |
| P00 square is `6u`, with `u = 40` | `404 − 164 = 240 = 6 × 40` | PASS |
| P00 original radial endpoint lies on `R120` | `hypot(369 − 284, 119 − 204) = 120.20815`; residual `0.20815 > 0.05` | FAIL |
| A simplified gear pair is a functional mechanism | Shared pitch and center distance checked; tooth contact over rotation not established | NEEDS QUALIFICATION |

This example describes the original inspected P00 endpoint. Recalculate from the current source after correction. A report is evidence for a revision, not a permanent badge attached to a study ID.
