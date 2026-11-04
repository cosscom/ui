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

## Icons

- Accura renders Iconoir icons at stroke width 2, not the library default of 1.5. The 1.5 default is too light against Accura's type weight and disappears in dense tables.
- An icon inside a button that also has a visible label stays at the inherited 80% emphasis so it does not compete with the label. An icon-only button has no label, so its icon carries full strength: the icon is the entire affordance.
- A table row action uses the 28 px icon button, not the 24 px one. At 24 px the target is below a comfortable pointer size and a three-dot glyph renders too small to read as a control.

## Form fields

- Mark a required field with a red asterisk immediately after the label text. Mark an optional field with a muted "(Optional)" beside the label. Every field in a form carries one marker or the other, so absence is never ambiguous.
- Do not add helper text that only repeats what the label, marker, or control already says. Reserve supporting text for rules the user cannot infer.
- A disabled control must change surface, not only dim. Use the Zinc 100 recessed plane with muted text and keep the border at full strength; opacity alone makes a disabled field read as an empty editable one.

## Tabs

- Tabs must read as available navigation, not as passive labels. Give the tab row enough vertical space to separate it from nearby headings, controls, and data.
- Across Accura, use the shared `AccuraTabs` wrapper for underline tabs. Keep tab backgrounds transparent in default, selected, and hover states, and use Brand 950 for the selected underline, selected text, and hover text.
- Keep unselected tabs neutral and preserve hover and keyboard-focus feedback. Do not turn tabs into primary actions.

## Color Hierarchy

- Reserve solid Accura primary green for principal actions and intentionally strong brand anchors.
- Use COSS secondary or neutral surfaces for table headers, row hover, pagination selection, notices, and supporting selection states.
- In structured Settings or detail containers, use a Zinc 50 header for the title, description, and primary section action; keep tabs, controls, and data on the white body below one divider. Do not repeat gray bands for nested content.
- Keep document names neutral at rest; reveal primary color on interaction when useful.
- Do not use primary color as the only indication of state.

## Semantic Actions And Status

- Status colors communicate lifecycle meaning and must not be replaced by primary or secondary styling.
- Use outline badges for categorical metadata such as roles, modules, and document-type abbreviations. Reserve filled semantic badges for actual status, severity, or lifecycle meaning.
- Reject and other negative actions must not look like ordinary primary progression.
- Approve or Reject requires the regulated confirmation and electronic-signature behavior defined in product knowledge; button styling does not remove that friction.

## Accessibility

- Every icon-only button requires an accessible name.
- Focus indication must remain visible regardless of hover, selection, or status color.
- Text and icons must retain sufficient contrast in default, hover, pressed, selected, disabled, and focus states.
- Color must be supported by text, iconography, position, or another non-color cue.
