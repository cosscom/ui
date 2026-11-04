# Accura Decision Log

This is the canonical history of Accura product, design-system, and prototype decisions. It records why a direction was chosen and preserves superseded directions. Current product facts live in `docs/product-knowledge/`; current rules live in `docs/rules/`; implemented changes are indexed in root `CHANGELOG.md`.

## 2026-11-04 - Metadata badges use outline hierarchy

### Decision

Use outline badges for categorical metadata, including roles, modules, and document-type abbreviations. Keep filled semantic variants for actual status, severity, and lifecycle meaning. The current enforceable rule is owned by [`../rules/ui-hierarchy.md`](../rules/ui-hierarchy.md).

### Reasoning

Roles and modules describe classification or access scope rather than state. Giving them the same filled treatment as status made neutral metadata appear actionable or semantic; an outline preserves scanability while keeping status visually distinct.

## 2026-11-04 - Brand 950 navigation and primary treatment

### Decision

- Keep Zinc 100 as the recessed application canvas and white as the principal content surface.
- Use Brand 950 for the prototype navigation surface, principal action, and main-content focus ring.
- Use Zinc 200 for default navigation content and Zinc 100 with Zinc 900 foreground for selected or hovered navigation.
- Use Brand 150 for focus indication against the dark navigation surface.
- Apply these product-specific roles in `apps/accura-prototype/app/globals.css` after the reusable generated adapter.

### Reasoning

The darker brand anchor gives the expanding Accura prototype a stable navigation frame and stronger product identity while retaining the neutral Zinc content canvas. Keeping the override at the application layer preserves the reusable COSS adapter boundary.

### Supersedes

This replaces the light Zinc navigation portion of the 2026-11-03 application-shell decision. The Zinc canvas and white content-surface portions remain current.

## 2026-11-02 - Documents selected as the first vertical slice

### Decision

Use Documents as the first complete prototype slice, covering List, Create, Edit Draft, Review, Approved, and Audit Trail states.

### Reasoning

The available screens and specification cover enough of the regulated lifecycle to establish reusable list, form, workflow, signature, version, and audit patterns before expanding to other modules.

## 2026-11-02 - Token mapping prioritized

### Decision

Visual direction selection is intentionally deferred. The next workstream is to map the Accura token system into COSS so every later prototype direction uses the same visual and component contract.

### Source Boundary

- Only files inside `/Users/mac/Documents/GitHub/Coss` may be used as project sources.
- Files previously observed outside the repository are out of scope and must not be read or reused.
- Token counts and contents must be re-established from exports that the user places inside the repository.

No external token file is an implementation source of truth.

## 2026-11-02 - Repository token boundary established

### Context

- `brand-assets/Primitives.json` contains 229 literal tokens.
- `brand-assets/Semantics.json` contains 115 aliases in Light mode, but is not an active theme input.
- The Primitive collection contains 25 colors under `color/brand/*` and `color/zinc/*`.
- The source has no web code syntax, so approved palette names are generated deterministically.
- Accura typography, spacing, radius, shadow, opacity, motion, status, and chart tokens are outside the integration boundary.

### Decision

- Added an explicit palette-only Accura-to-COSS mapping contract.
- Added deterministic generation for brand and Zinc colors only.
- Added a partial COSS theme override and a single CSS entry point.
- Added source-boundary, collision, mapping, drift, and direct-pair contrast validation.
- Added root scripts for generation and drift checking.

### Superseded Direction

The initial full Semantic-to-COSS bridge was rejected because it introduced a second semantic system and made the prototype feel too heavy. `Semantics.json` remains reference material only and is not read by the generator.

## 2026-11-02 - Palette-only COSS adapter confirmed

### Decision

- Treat Accura as a brand skin over the current COSS theme.
- Import only `color/brand/*` and `color/zinc/*` from `Primitives.json`.
- Use `brand/800-base` for primary, `brand/500` for focus, and the dark brand tones for the sidebar.
- Keep COSS white surfaces, alpha border/input/muted roles, status colors, charts, radius, spacing, density, component behavior, and Cal Sans typography.
- Keep COSS white for primary foreground because it reaches 4.52:1 on `brand/800-base`; `zinc/50` reaches only 4.32:1.
- Scope the current adapter to light mode. Native COSS dark mode remains unchanged until an Accura dark palette is intentionally designed.

### Historical Next Action

Prove the palette adapter against a small COSS component specimen before creating the Accura prototype app. This action was subsequently completed.

## 2026-11-03 - Primary and secondary hierarchy refined

### Decision

Adopt a quieter primary/secondary hierarchy for the prototype. The current enforceable rule is owned by [`../rules/ui-hierarchy.md`](../rules/ui-hierarchy.md).

### Reasoning

Repeating primary green across navigation, links, table chrome, pagination, and calls to action flattened the hierarchy and made the Documents workspace feel visually heavy. A neutral secondary layer keeps the interface calm while allowing the primary action to remain obvious.

## 2026-11-03 - Light Zinc application shell

**Status:** Partially superseded by [Brand 950 navigation and primary treatment](#2026-11-04---brand-950-navigation-and-primary-treatment). Zinc remains the application canvas, but the navigation surface is no longer light Zinc.

### Decision

- Use Zinc for the recessed application canvas and light navigation rail.
- Reserve white for the sticky global header and principal content containers.
- Keep brand color focused on selected navigation, primary actions, focus, and intentional interaction accents.

### Reasoning

The earlier dark and brand-tinted shells competed with the regulated document workspace. A neutral shell gives the content clearer hierarchy and keeps Accura recognizable without covering the interface in green.

## 2026-11-03 - Official logo and sidebar collapse behavior

### Decision

- Use the official Accura SVG logo and mark stored in the prototype.
- Use a 248 px expanded sidebar and a 64 px collapsed sidebar.
- In collapsed state, show only the Accura mark; hovering or focusing the mark reveals the expand icon in the same centered position.

### Reasoning

The official asset preserves brand fidelity, while a single centered mark/expand target prevents duplicate controls and keeps the collapsed rail aligned.

## 2026-11-03 - Global search replaced repeated page context

### Decision

Use the top bar for cross-product search rather than repeating the current page title and subtitle. Keep the page-specific title in the content area and expose the `⌘ K` shortcut.

### Reasoning

Repeating “Documents” in both the header and page content spent high-value space without adding orientation. Global search gives the shell a reusable product-level function.

## 2026-11-03 - Iconoir adopted for the Accura prototype

### Decision

Adopt Iconoir for prototype-level interface icons while retaining official Accura SVGs as brand assets. The current enforceable rule is owned by [`../rules/visual-system.md`](../rules/visual-system.md).

### Reasoning

Iconoir’s lighter geometry fits the neutral shell and Cal Sans better than the prior prototype-level Lucide set. COSS may retain its internal icon dependencies; this decision applies to the Accura application layer.

## 2026-11-03 - Documentation ownership model established

### Decision

- Use root `ACCURA.md` as the human and AI entry point without replacing the upstream COSS README.
- Use root `CHANGELOG.md` only as a concise chronological index.
- Use this file as the canonical detailed decision history.
- Use `docs/product-knowledge/` for current product truth and `docs/rules/` for current enforceable rules.
- Keep implementation verification in the owning app’s `design-qa.md` and token mechanics in `brand-assets/`.

### Reasoning

The previous discovery, implementation, and token documents each contained useful information but did not define ownership. Separating current truth, current rules, historical rationale, implementation evidence, and change indexing prevents competing sources of truth. The root change index links to canonical detail instead of synchronizing duplicated prose.

