# Accura UI Hierarchy Rules

## Action Priority

Use at most one solid primary action in the same task context. A page and an open dialog may each have their own primary action because they are separate contexts.

| Variant | Use for | Current examples |
|---|---|---|
| Primary | The principal action that advances the current task | Create Document, Continue, Submit for Review, Approve & Sign |
| Secondary | Supporting actions and selected controls that need clear but quieter emphasis | Current selection, active pagination, Save as Draft, medium-priority utility actions |
| Outline | Utilities and lifecycle actions that must remain discoverable without competing with the task | Download, Export, Filter, View Audit Trail |
| Ghost | Low-emphasis, reversible, or compact controls | Cancel, Close, icon utilities, row action menu |
| Destructive | Actions with harmful, irreversible, or lifecycle-ending consequences | Reject, Delete, Mark as Obsolete when the consequence is confirmed |

## Navigation Selection

- Navigation selection communicates location; it is not a call to action.
- Do not let selected navigation compete with the page’s principal action.
- Prefer a secondary or brand-soft selected surface when a solid brand selection makes the shell visually heavy.
- Keep visible focus independent from selected state.

## Color Hierarchy

- Reserve solid Accura primary green for principal actions and intentionally strong brand anchors.
- Use COSS secondary or neutral surfaces for table headers, row hover, pagination selection, notices, and supporting selection states.
- Keep document names neutral at rest; reveal primary color on interaction when useful.
- Do not use primary color as the only indication of state.

## Semantic Actions And Status

- Status colors communicate lifecycle meaning and must not be replaced by primary or secondary styling.
- Reject and other negative actions must not look like ordinary primary progression.
- Approve or Reject requires the regulated confirmation and electronic-signature behavior defined in product knowledge; button styling does not remove that friction.

## Accessibility

- Every icon-only button requires an accessible name.
- Focus indication must remain visible regardless of hover, selection, or status color.
- Text and icons must retain sufficient contrast in default, hover, pressed, selected, disabled, and focus states.
- Color must be supported by text, iconography, position, or another non-color cue.
