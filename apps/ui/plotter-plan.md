# Plotter shared foundation

Status: the first complete AG01/W05 foundation slice is implemented in the working tree. It includes the shared standard, three geometry helpers, opt-in role styles, compiler integration, portable static export, and usage notes. Before/after renders and exported SVGs were inspected visually; no automated checks or tests were run. The original planning pass changed only this document.

## Review baseline and scope

- Repository: `cosscom/ui`.
- Branch: `codex/blueprint-illustration-studies`.
- Baseline commit: **`093067a29cfd48bce213b3fe6627ac1154447a20`** (`feat(ui): add three-speed orbit animation to Plotter`).
- The working tree was clean when the baseline was recorded.
- Later implementation review should use `git diff 093067a29cfd48bce213b3fe6627ac1154447a20...HEAD` and this document as its specification. That command covers committed work; include staged and unstaged diffs separately when reviewing work in progress.

The requested outcome is one source for drawing roles and CSS tokens, reusable arrows/dimensions/hatching, a clear drawing–animation separation, and editable SVG output that works outside coss. Preserve existing visual rules and illustrations. Release planning, publication, a catalogue redesign, and a catalogue-wide migration are outside this work.

Use the codebase-design vocabulary: a **module** owns an implementation behind an **interface**; an interface includes inputs, invariants, errors, and ordering requirements. A **seam** is where that interface lives. An **adapter** connects it to a concrete caller. **Depth** means useful capability with little interface knowledge, rather than a large implementation or many abstractions.

## What exists and what it implies

| Current source | Finding | Design consequence |
| --- | --- | --- |
| [Drafting standard](skills/plotter/references/drafting-standard.md) | Precise role values, dash meanings, arrow geometry, hatch pitch, and clearance rules already exist. | Encode those values; retain the explanatory prose and its exceptions. |
| [Drawing wrapper](app/plotter/blueprint-drawing.tsx) | Provides canvas, host foreground, and typography; its inherited stroke width is `0.8`. | Do not globally change that default to the standard's `0.95`: unclassified legacy paths could change. Adopt roles explicitly. |
| [Editable catalogue](app/plotter/drawings/), [catalogue builder](scripts/build-plotter-drawings.py), and [grammar builder](scripts/build-plotter-grammar.py) | Editable SVG is compiled into React, alongside hand-written JSX drawings. The catalogue builder currently supplies a `0.95` fallback. | Preserve both authoring paths and their existing source ownership. |
| [Dimensions](app/plotter/dimensions.tsx) | Reusable horizontal/vertical dimensions already serve several drawings, but do not accept actual feature witnesses or an inline label gap. Some labels are descriptive words. | Add the richer geometry helper without silently changing existing callers or interpreting every label as a measurement. |
| [W05 hatching](app/plotter/production-chain-hatching.tsx) | The same seven clipped segments serve the static and animated core faces. | This is an existing, useful seam; retain it while replacing its repeated drafting knowledge. |
| [SVG serializer](scripts/plotter_svg.py) | Rewrites defs IDs and strips metadata/title/description for decorative JSX output. CSS property conversion does not preserve `--*` names; stylesheet ID replacement does not distinguish selector IDs from fragment URLs. | Extend the supported conversion contract deliberately. Standalone output needs a different accessibility treatment. |
| [Engineering preview](app/plotter/engineering-motion-preview.tsx) | Owns playback controls, visibility pausing, reduced motion, and static fallback, separate from the child SVG timeline. | Preserve that division; geometry helpers need no playback state. |
| [W05 timeline](app/plotter/production-chain-motion-drawing.tsx), [O07 timeline](app/plotter/newtons-cradle-motion-drawing.tsx), and [P00 morph](app/plotter/primitives-morph.tsx) | Motion includes different mechanisms: sampled displacement/contact, pendulum motion, and matching path topology with changing labels. | A universal physics or animation-track model is not justified by this task. |
| [Skill package](skills/plotter/README.md) | Complete-directory installation already works without the coss checkout. | Keep new portable resources inside that directory. |
| [Grammar isolation](app/plotter/grammar-comparison.module.css) | Focus markers and supplemental grid segments preserve the original element's treatment during isolation. | Drawing roles must remain independent from teaching/focus annotations. |

The existing [integrity script](scripts/check-plotter.tsx) checks catalogue rendering, IDs, links, and reference hashes. It does not establish visual quality, correct animation, or complete export portability. It was read, not run.

## Design choice

Keep ordinary SVG as the editable document. Add a portable drafting module, generated role styles, and narrowly scoped export tooling. The agent continues to compose paths, groups, text, and native SVG shapes. Helpers concentrate the calculations and conventions that would otherwise recur in each drawing.

Three alternatives were considered:

| Design | Depth and locality | Cost | Decision |
| --- | --- | --- | --- |
| Pure mark helpers plus native SVG/JSX | Arrow, dimension, and hatch knowledge has one implementation; composition remains editable. | Authors still arrange geometry and choose meaningful marks. | Use this foundation. |
| A declarative scene document compiled into React/SVG/motion | Could connect constraints, semantic parts, and multiple renderers. | Introduces a second authoring format, extensive schema knowledge, and migration of existing SVGs and motion details. | Defer until concrete callers need those capabilities. |
| Python-only fragment generation | Fits existing SVG builders and file-based authoring with little infrastructure. | Live JSX calculations would need generated fragments or another implementation of the same geometry. | Retain Python for document/build tooling; use portable JavaScript for shared geometry. |

The geometry module will be dependency-free ESM JavaScript with type declarations. It can run in a standalone authoring script or be imported by the existing React drawings. Python's existing XML tooling remains useful for local document preparation and SVG-to-JSX conversion. Do not port all generators or duplicate the geometry algorithms in Python.

Dependencies are in-process for geometry and role resolution, local filesystem I/O for authoring/export tools, and React/browser facilities for host rendering and playback. There are no remote dependencies requiring ports or network adapters. Runtime calculation and file writing stay separate; do not introduce an injectable filesystem framework.

## Ownership and proposed files

All paths below are relative to `apps/ui`. New files are proposed, not created by this plan.

| Source | Responsibility |
| --- | --- |
| `skills/plotter/assets/foundation/standard.json` | Sole editable source of numeric role defaults, token names, dash patterns, and shared drafting constants. |
| `skills/plotter/assets/foundation/index.mjs` and `index.d.mts` | Pure `arrow`, `dimension`, and `hatch` helpers; public role data re-export; no React, DOM, filesystem, or clocks. Keep private calculations local until actual complexity warrants splitting them. |
| `skills/plotter/assets/foundation/standard.mjs` and `roles.css` | Generated runtime values and scoped role styles, derived from `standard.json`. Never maintain these independently. |
| `skills/plotter/scripts/build-standard.py` | Generate the runtime values, CSS, and marked numeric tables in the drafting standard. Preserve authored explanatory prose. |
| `skills/plotter/scripts/export-svg.py` | Prepare supported authored SVG as a self-contained static document, using the same standard. Python standard library; no coss imports. |
| `skills/plotter/references/foundation.md` | Document the small interface, examples, override rules, and export limitations. |
| `skills/plotter/references/motion.md` | Separate motion workflow and its invariants; route here only for animation work. |
| Existing `scripts/plotter_svg.py` and `build-plotter-*.py` | coss adapters from native SVG to JSX. Consume shared defaults and preserve the supported document semantics. |
| Existing `app/plotter/*` sources | Own compositions, catalogue metadata, host integration, and drawing-specific timelines. |

The skill folder is the portable source, rather than a snapshot of a new workspace package. coss imports those resources directly or consumes their generated output. Generated files carry their source/generation notice. Do not add an npm package, duplicate source tree, or network installation requirement for the foundation.

## One standard, with explicit adoption

The JSON stores two related kinds of data:

1. **Appearance:** named stroke roles, widths, opacity, caps/joins, and meaningful dash patterns.
2. **Geometry constants:** arrow leg length/angle, dimension slash extent, hatch pitch/orientation, and label clearance. These are consumed by geometry functions, not presented as CSS controls that magically regenerate paths.

Preserve the current defaults:

| Role | Width | Opacity | Dash |
| --- | ---: | ---: | --- |
| Primary | 0.95 | 1 | none |
| Secondary; dimension; callout leader | 0.65 | 0.50 | none |
| Guide | 0.60 | 0.24 | none |
| Grid | 0.60 | 0.10 | none |
| Hatch | 0.65 | 0.27 | none |
| Section cut | 1.30 | 1 | none |
| Centerline / locus | 0.60 | 0.24 | `8 3 1 3` |
| Hidden / absent / proposed outline | 0.65 | 0.45 | `3 5` |
| Movement / transfer shaft | 0.65 | 0.50 | `4 6` |

Different semantic roles may reference the same underlying token values. Labels still distinguish hidden, absent, and proposed geometry. A matching number does not establish a role: assign roles from the mark's meaning, never by automated numeric inference.

Use a scoped `data-plotter-role` vocabulary for native SVG and JSX. Generate CSS with fallbacks, for example:

```css
[data-plotter] [data-plotter-role="guide"] {
  stroke-width: var(--plotter-stroke-guide, 0.6);
  opacity: var(--plotter-opacity-guide, 0.24);
  stroke-dasharray: none;
}
```

Public overrides initially cover monochrome ink, stroke widths, and role opacities. Examples are `--plotter-ink`, `--plotter-stroke-primary`, `--plotter-stroke-secondary`, `--plotter-opacity-guide`, `--plotter-opacity-grid`, and `--plotter-opacity-hatch`. Keep dash meanings and geometry constants in the standard rather than offering arbitrary style presets. The default ink remains host `currentColor`; resolved standalone output chooses an explicit ink.

Important interface invariants:

- Scope styles to opted-in drawings and named marks; native unclassified paths retain their existing treatment. Avoid broad `svg path` selectors.
- Use variable fallbacks in consuming declarations. Declaring public defaults on every SVG root would mask values inherited from a host ancestor.
- CSS declarations outrank SVG presentation attributes. Historical exceptions must remain unclassified or use an explicit documented override; adding a role is not visually neutral by itself.
- Preserve the grouping level of `opacity`, and distinguish it from `stroke-opacity`. Moving opacity from a group to its children changes overlap compositing; nesting styled opacity groups multiplies it. New helpers should avoid accidental double application.
- Continuous mark roles clear inherited dash patterns. An arrowhead is solid even inside a transfer construction. Join/cap choices must preserve the baseline; do not normalize legacy miter/round choices through a broad rule.
- SVG user units remain the basis of widths and geometry. Do not add `non-scaling-stroke` globally or change the native 560 × 440 gallery presentation.
- Text retains its own filled-glyph treatment, font sizes, opacity, and role-specific GEOM values. Stroke-role CSS must not erase labels or apply line opacity twice to them.
- `data-grammar-focus` and `data-grammar-isolation-only` remain teaching annotations. Isolation hides unrelated marks; it does not recolor or amplify focused marks. Supplemental grid segments remain supported.

Keep historical approved SVG snapshots and their manifest hashes unchanged. They remain composition references with documented exceptions. The standard owns current numeric defaults; the visual grammar and feedback explain meaning and intent.

## Drafting interface

Expose three geometry helpers and read-only standard data. Their outputs are ordinary SVG path strings, attribute records, and optional defs descriptions. They are not a general scene model. JSX authors render them with native elements; file-based authors serialize them into editable SVG. Rendering adapters translate attribute spelling and escape text, without reimplementing geometry.

Illustrative calls:

```ts
const transfer = arrow({ kind: "line", from: [268, 186], to: [268, 212] });
// { shaftD, headD }; shaft begins at the tip for dash attachment.

const width = dimension({
  axis: "x",
  witnesses: [[112, 340], [448, 340]],
  position: 390,
  extensions: { gap: 8, overshoot: 8 },
  label: {
    text: "14u",
    anchor: [280, 393],
    clearance: { x: 264, y: 380, width: 32, height: 20 },
  },
});
// Separate witness, dimension-line, and slash paths; positioned label.

const face = hatch({
  region: { kind: "rect", x: 0, y: 0, width: 48, height: 48 },
  pattern: "H1",
});
// Exact seven non-zero diagonal segments used by W05; no boundary stroke.
```

These are the intended interface shapes; the implementation may refine names without widening scope. An extension requires a real drawing that cannot use the existing interface.

### Arrows

Start with straight transfer arrows used by AG01 and W05. A circular-arc variant can follow when migrating a current curved-arrow caller; it should take a center, radius, start angle, and signed sweep, not parse arbitrary path strings. Use SVG coordinates with positive y downward and document the angular convention.

The implementation owns six-unit legs at 45°, orientation, butt-capped `4 6` shafts, and a solid head attached to the terminal dash. Geometry remains separate from the caller's decision that a movement or transfer is meaningful. Reject non-finite inputs and zero-length arrows; never fabricate a direction. A future arc variant rejects ambiguous/unsupported sweeps explicitly.

### Dimensions

Horizontal and vertical dimensions use actual feature witnesses, the dimension-line position, extension gap/overshoot, and the supplied label placement. They return witnesses separately so the drawing can retain the appropriate role and shared-segment ownership. The helper derives the 8 × 8 slash geometry and splits the dimension line around a supplied clearance box where necessary.

The caller supplies verified text bounds/clearance: pure geometry cannot measure the host font accurately. Preserve existing hand-tuned label positions and larger gaps. New label clearances must allow at least three units around actual text bounds. Reject invalid witness order, non-finite geometry, and a clearance box that consumes the usable dimension without an explicit alternative placement.

Labels may be words, local units, or measurements. Keep their text editable. Numeric labels must derive from the same drawing parameters and declared unit as the witnesses; the helper must not infer real-world units or turn an arbitrary label into a technical claim. Radius dimensions and existing special constructions remain authored SVG until a concrete migration warrants another helper.

### Hatching

H1/H2 use the standard's ±45° direction and perpendicular pitch `12 / √2`; a 48 × 48 H1 face must reproduce W05's existing seven segments. The rectangle case returns analytically clipped segments without defs or IDs.

For a later curved or holed region, accept an authored native path, bounds, fill/clip rule, and an explicit unique clip ID. Generate a line field and use SVG clipping to the declared region. Do not introduce a general Bézier intersection solver. Bounds control line coverage; they do not replace the region or fill its holes. Phase/origin is explicit when multiple regions must align.

Hatching does not draw a region boundary, fill an area, shade an object, or imply a material. The caller names its meaning. W05 continues to hatch only cube/core faces, never carriers or machinery.

## Drawing and animation seams

The drawing module contains geometry and stable semantic groups. It has no timers, React hooks, pointer listeners, playback flags, or visibility policy. Ordinary SVG remains valid without any animation module.

The motion workflow consumes an established drawing and records:

- Which named parts change and which remain fixed.
- Pivots, constraints, contact/edge ownership, and label attachments.
- Timing phases, easing or physical approximation, and loop/restart behavior.
- A deliberately selected static fallback, plus reduced-motion and offscreen behavior.

Keep W05's displacement sampling, feed/index timing, clip apertures, and coincident-edge handoff private to that drawing. Keep O07's trajectory and P00's topology decisions local as well. Their calculations should consume shared drawing parameters where appropriate, not a new universal timeline schema.

`EngineeringMotionPreview` remains the browser/React playback adapter for the pilot. Other previews repeat some visibility/reduced-motion behavior, but extracting a shared controller is a subsequent change only if their concrete requirements align. Do not merge their page layouts or make a new shared production hero.

Route static requests through the existing `plotter` entrypoint and motion requests to the dedicated motion reference. A companion skill can later expose that workflow independently; this foundation does not require a second installation or duplicated rules. Both workflows use the same packaged standard and helpers.

## Self-contained SVG output

The portable output is a complete static SVG document with editable paths and text. The export tool accepts native SVG plus explicit appearance/accessibility options. It supports Plotter-authored markup and generated role styles; it is not a general browser CSS engine or an arbitrary website-to-SVG converter.

Default resolved export:

1. Preserve the viewBox, dimensions, document order, groups, geometry, clipping, and semantic metadata.
2. Resolve role values and an explicitly supplied theme/token set into presentation attributes at the same grouping level. Preserve local overrides. Do not guess the active coss theme from a detached SVG.
3. Resolve ink/currentColor and supported inline styles so no Tailwind class, CSS module, external stylesheet, or coss import is required. Preserve the source's explicit standalone ink when no override is requested.
4. Keep defs local. Prefix IDs and rewrite supported fragment references together, including `url(#…)`, `href`/`xlink:href`, and `aria-labelledby`/`aria-describedby` token lists. Document unsupported reference forms and report them rather than emitting broken references.
5. Preserve or supply an accessible title and description for meaningful output. Decorative React rendering may intentionally use `aria-hidden`; standalone export must not inherit that decision blindly.
6. Keep text editable, with a declared font stack, automatic optical sizing, no added tracking or synthetic styles, GEOM25 for ordinary illustration text and GEOM0 for identifiers. Preserve other deliberately authored text roles. A sans-serif fallback removes a required font download, but exact typography requires the same font; supplied embedded-font support can follow separately.

An optional themeable export can retain the generated, scoped role stylesheet with literal fallbacks. Embed it in the document; do not leave a dependency on the application stylesheet. The default resolved artifact is simpler for external SVG consumers.

File writing and XML handling live in the export script; the geometry module remains pure. Export reports unsupported stylesheet constructs, unresolved external resources, missing IDs, and unsupported active animation dependencies. It must not silently drop them. The initial export path is static: export the selected static source rather than treating animation time zero as equivalent or removing tracks from an arbitrary frame. Standalone animated HTML/player packaging is subsequent work.

For hand-written JSX, a coss-only authoring adapter may render the selected static drawing to SVG before passing it to the same exporter. That adapter can use the existing React/Bun environment; a recipient opening the resulting SVG needs neither.

## Compiler changes required before role adoption

The two existing Python builders remain the adapters for catalogue and grammar output. Fix only the document handling required by the pilot:

- Preserve `--custom-property` names verbatim when serializing inline styles.
- Treat CSS selector IDs and fragment URLs separately; the existing broad `#id` substitution cannot safely serve both.
- Carry required root attributes, styles, and role scope into generated drawings. Explicitly distinguish standalone ink from host foreground so AG01's source color does not accidentally lock the coss gallery to light mode.
- Prefix defs and accessibility references consistently, with React `useId` for repeated instances. Keep titles/descriptions only for meaningful renderings; preserve their original source for export.
- Ensure generated CSS cannot affect neighboring SVGs. Prefer simple generated role selectors; do not add a general CSS rewriting subsystem for unsupported authored styles.
- Keep `expanded-studies.tsx` and `visual-grammar-drawings.tsx` generated. Their editable SVG sources remain authoritative.

Do not rewrite unchanged catalogue entries merely to normalize formatting or numeric defaults.

## Implementation sequence and the first pilot

Each stage should produce a reviewable diff. This sequence is an implementation proposal, not permission to run tests during the present planning pass.

1. **Standard and opt-in roles.** Add the portable numeric source, generation script, generated CSS/runtime values, and concise interface documentation. Preserve the wrapper's legacy default and all unmarked artwork. Generate only the numeric portions of the drafting standard; keep this plan's baseline values as review evidence, not another live source.
2. **Helpers and static SVG pilot.** Implement straight arrows, axis-aligned dimensions, and rectangular H1/H2. Migrate only AG01's [agent-registration.svg](app/plotter/drawings/agent-registration.svg) initially. Preserve its composition, labels, gaps, fragment locations, and standalone ink. Its transfer arrow and width dimension exercise two helpers; keep descriptive annotations untouched. Regenerate its catalogue output through the existing builder with the necessary compiler fixes.
3. **Animation caller.** Replace W05's shared `coreHatch` calculation through the hatch helper, and adopt exact-matching roles/straight arrows in [its motion drawing](app/plotter/production-chain-motion-drawing.tsx). The static W05 consumer necessarily shares the hatch change and belongs in the review scope. Keep the existing 1.8-second timeline, movement, edge ownership, and controls unchanged.
4. **Standalone artifact.** Produce a resolved AG01 SVG and a static W05 SVG through the export seam. Include enough packaged usage information to generate another standalone drawing without the coss checkout. Do not make the reference snapshots generated outputs.
5. **Workflow documentation.** Point the drawing skill at the foundation when implementing marks, and move portable animation guidance into its own reference. Keep host integration details in `implementation.md`. Document supported helper cases and the native-SVG path for everything else.

This exercises both authoring paths: SVG compiled into React, and hand-written React using a shared geometric calculation. It does not migrate every dimension caller, add curved clipping prematurely, change the grammar examples, or redesign a drawing.

## Acceptance criteria for later implementation review

No tests or automated checks are requested now. These are observable criteria for reviewing subsequent work; any automated verification can be scoped separately when requested.

- A numeric role change has one editable home; runtime values, CSS, and documented defaults derive from it. Installed skill resources include everything they reference.
- AG01 and W05 retain their baseline appearance at native size in the relevant host themes. Geometry equivalence, grouping/opacity, label clearance, arrowhead solidity, and W05's cube-only hatching are inspected explicitly. Equivalent path serialization is acceptable; changed composition is not.
- Geometry calculations retain full precision until serialization. Any later numerical verification uses the existing `0.05`-unit and `0.1°` tolerances and states what was actually checked; matching the palette does not prove geometric meaning.
- W05's timing, contact transitions, full-loop seam, pause/resume, replay, reduced-motion fallback, and offscreen behavior remain unchanged. A static picture alone cannot establish this.
- The pilot's standalone artifacts retain editable labels, local defs, explicit appearance, and accessible meaning, with no required coss styles, scripts, imports, or font download. Font fallback differences are stated rather than mistaken for exact visual parity.
- Repeated React instances do not collide in IDs or leak role styles. Supported references survive export and compilation.
- Existing catalogue IDs, approved snapshots, gallery layout, grammar isolation, and untouched drawings remain intact. The work does not promote a revised drawing into the approved reference set automatically.
- The skills explain when to use each helper and when native SVG is appropriate. They do not promise that helpers solve composition, semantic clarity, or physical accuracy.

Review the implemented pilot against the recorded baseline before widening adoption. The packaged skill now routes to separate drawing and animation workflows, with shared direction, grammar, and tokens, and portable implementation examples. Those new examples received source review only; no automated checks, tests, or fresh-session evaluation were run. Further catalogue migration remains subsequent work.
