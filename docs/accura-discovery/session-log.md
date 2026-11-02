# Accura Discovery Session Log

## 2026-11-02 - Documents intake and baseline audit

### Learned

- Accura is a regulated, multi-tenant eQMS for life-science organizations moving from paper and spreadsheets.
- The first prototype slice is the complete desktop Documents lifecycle: List, Create, Edit Draft, Review, Approved, and Audit Trail.
- The primary UX principle is to make the workflow simple and clear while retaining restrictive controls that prevent mistakes.
- Status, the pending actor, electronic signatures, immutable audit history, and version relationships are core product behavior.
- Domain terminology should be preserved unless a quality expert approves a change.
- The Accura component catalog contains 1 layout, 5 templates, 10 patterns, and 39 components; only Spinner, Sidebar, and Stepper are currently marked Stable.

### Blind Spots

- Source PDFs mix direct stakeholder statements, mock data, and AI-generated interpretation.
- Role/permission rules and signature behavior are not yet an implementation-ready contract.
- Controlled versus External Document behavior is incomplete.
- Document Type and Department data are inconsistent between Create and Listing.
- Minimum responsive desktop width and prototype repository/location are not settled.

### Next Actions

1. Maintain the approved palette-only adapter from Accura brand and Zinc colors into COSS.
2. Prove the adapter against the Document slice component set before choosing a visual direction.
3. Confirm where the coded prototype should live.
4. Build the selected direction with COSS primitives and Accura patterns as references.
5. Verify the coded prototype at desktop breakpoints and compare it against the selected visual target.

## 2026-11-02 - Token mapping prioritized

### Decision

Visual direction selection is intentionally deferred. The next workstream is to map the Accura token system into COSS so every later prototype direction uses the same visual and component contract.

### Source Boundary

- Only files inside `/Users/mac/Documents/GitHub/Coss` may be used as project sources.
- Files previously observed outside the repository are out of scope and must not be read or reused.
- Token counts and contents must be re-established from exports that the user places inside the repository.

No external token file is an implementation source of truth.

## 2026-11-02 - Repository token audit completed

### Learned

- `brand-assets/Primitives.json` contains 229 literal tokens.
- `brand-assets/Semantics.json` contains 115 aliases in Light mode, but is not an active theme input.
- The Primitive collection contains 25 colors under `color/brand/*` and `color/zinc/*`.
- The source has no web code syntax, so approved palette names are generated deterministically.
- Accura typography, spacing, radius, shadow, opacity, motion, status, and chart tokens are outside the integration boundary.

### Completed

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

### Next Action

Prove the palette adapter against a small COSS component specimen before creating the Accura prototype app.

