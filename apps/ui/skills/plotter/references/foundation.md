# Portable drafting foundation

Use the foundation when implementing straight transfer arrows, horizontal/vertical dimensions, or rectangular hatching. Compose the illustration with ordinary SVG; use native paths for constructions these helpers do not cover. The helpers do not choose a composition or establish a mark's meaning.

The complete skill folder contains the implementation. Resolve paths from the installed `plotter` directory, not a repository root. The ESM entrypoint is `assets/foundation/index.mjs`; it runs in a JavaScript authoring script or a host such as React without coss imports. It exports `arrow`, `dimension`, `hatch`, read-only `standard`, and `roleCss`. Its adjacent declaration file documents inputs and outputs. The import below assumes an authoring file at the skill root; examples in subdirectories use their own relative paths.

```js
import { arrow, dimension, hatch } from "./assets/foundation/index.mjs";

const transfer = arrow({ kind: "line", from: [268, 186], to: [268, 212] });
// Separate shaftD and headD. Apply transfer styling once to their group;
// set stroke-dasharray="none" on the head. The shaft starts at its tip.

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
// witnessD, lineD and slashD can retain separate drawing roles.
// label contains the supplied text and anchor; actual font bounds are your responsibility.

const core = hatch({
  region: { kind: "rect", x: 0, y: 0, width: 48, height: 48 },
  pattern: "H1",
});
// core.d contains seven clipped segments. It draws no boundary or fill.
```

Coordinates use SVG's positive-down y axis. Dimension witnesses are ordered increasingly along the selected axis. The label clearance box already includes the space around the actual text; use `standard.geometry.dimension.labelClearance` as the minimum margin. The helper does not measure text or add that margin for you. Derive numeric labels from the same coordinates and local unit as their witnesses. Hatch phase uses local edge intercept units; H2 reflects H1 vertically. Invalid or unsupported inputs throw explicit errors. Curved arrows, radius dimensions, and curved/holed hatch regions remain native SVG work in this slice.

## Roles and CSS overrides

`assets/foundation/standard.json` owns numeric role values and geometry constants. `scripts/build-standard.py` generates `standard.mjs`, `roles.css`, and the numeric tables in the [drafting standard](drafting-standard.md). Edit the JSON for defaults; retain the standard's prose for semantic guidance.

For themeable SVG, put `data-plotter=""` on its root and embed `roleCss` in `<style data-plotter-styles="true">`. Mark strokes or existing groups with `data-plotter-role`, such as `primary`, `secondary`, `dimension`, `guide`, `grid`, `hatch`, or `transfer`. Existing unclassified marks keep their attributes. A transfer group needs a solid-head override on the head path. Do not move opacity between groups and leaves: overlapping strokes can change even when the numeric opacity is identical.

CSS variables inherit from the host. Examples:

```css
.illustration {
  --plotter-ink: currentColor;
  --plotter-stroke-primary: 0.95;
  --plotter-opacity-guide: 0.24;
}
```

The generated rules contain default fallbacks rather than declaring variables on each SVG. Local inline styles can preserve an intentional exception. Keep opacity between zero and one and stroke widths non-negative. Geometry constants, hatch pitch, and dash meanings are not arbitrary CSS presets. Changing their source requires regenerating the affected geometry.

Text remains filled, editable text with its own opacity and typography. Focus/isolation markers in the visual grammar are independent of drawing roles; they never boost color or opacity.

## Standalone static export

From the copied skill directory, with Python 3 available:

```sh
python3 scripts/export-svg.py drawing.svg exported.svg \
  --id-prefix example --title 'Example construction' \
  --description 'A concise explanation of the relationship.'
```

Existing SVG titles/descriptions are used when those arguments are omitted. Optional `--ink '#171717'` selects the output ink; `--token=--plotter-opacity-guide=0.24` supplies an explicit token value. The exporter resolves generated roles at their original grouping level, embeds no application dependency, and prefixes local IDs and their references. It preserves authored inline overrides. Supply the token values needed for an export; a detached SVG cannot read the host's computed theme.

The output has literal appearance values, local defs, editable labels, native dimensions, and accessible meaning. Cal Sans uses a sans-serif fallback when the font is unavailable. Exact typography needs the same font; no font download is required. The exporter accepts Plotter's generated stylesheet and supported inline styles, and reports unsupported classes, external resources, or stylesheets rather than silently dropping them.

Export the selected static drawing. Active animation is intentionally unsupported by this static exporter; time zero is not necessarily the intended static fallback. Animation timelines and playback remain separate from the drafting helpers.

## Portable examples

- [Registration authoring](../assets/examples/registration.mjs) reads the adjacent [editable template](../assets/examples/registration.svg), regenerates its shared arrow/dimension fragments and embedded role styles, and emits SVG. The [drawing workflow](drawing.md#portable-starting-example) gives Node.js and Python commands. It reads no coss files.
- [Seat and withdraw](../assets/examples/assembly-motion.html) opens directly in a browser and uses the package's generated `roles.css`. It demonstrates hatch attachment, contact ownership, and playback separately from geometry. Read the [animation workflow](motion.md#portable-example) for its delivery boundary. If delivering one HTML file, inline that generated CSS rather than copying role numbers into a new stylesheet.

These are implementation examples, not composition references. Regenerate registration output when the shared standard changes; keep example geometry and text intentional. Helpers centralize construction arithmetic, not the semantic decision to add a mark.
