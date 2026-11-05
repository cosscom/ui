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
- When navigation collapses to icons, every item names itself on hover and on keyboard focus. An icon alone is a guess, and expanding the sidebar to find out what an item is defeats collapsing it. Expanded, the label is already visible, so no tooltip appears.
- A brand mark that doubles as the expand control must reveal the expand icon on hover and focus; a logo that acts as a button without announcing it gives no reason to click. Swap the two by hiding one, never by cross-fading, so both are never visible at once.

## Icons

- Accura renders Iconoir icons at stroke width 2, not the library default of 1.5. The 1.5 default is too light against Accura's type weight and disappears in dense tables.
- An icon inside a button that also has a visible label stays at the inherited 80% emphasis so it does not compete with the label. An icon-only button has no label, so its icon carries full strength: the icon is the entire affordance.
- A table row action uses the 28 px icon button, not the 24 px one. At 24 px the target is below a comfortable pointer size and a three-dot glyph renders too small to read as a control.

## Form fields

- Mark a required field with a red asterisk immediately after the label text. Mark an optional field with a muted "(Optional)" beside the label. Every field in a form carries one marker or the other, so absence is never ambiguous.
- Do not add helper text that only repeats what the label, marker, or control already says. Reserve supporting text for rules the user cannot infer.
- A disabled control must change surface, not only dim. Use the Zinc 100 recessed plane with muted text and keep the border at full strength; opacity alone makes a disabled field read as an empty editable one.

## Selection controls

- In listbox and combobox options, place the option content at the inline start and the selected check or state indicator at the inline end.
- Unselected options must not reserve an empty indicator gutter before their content. Every option label begins on the same leading alignment, whether it is selected or not.
- Apply this behavior in the shared COSS `ComboboxItem` primitive so single-select and multi-select consumers inherit it without screen-level overrides.

## System feedback

- Use a bottom-right toast for brief, non-blocking confirmation after a completed action such as saving Settings or sending an invitation.
- Give each toast semantic text and an icon, include a dismiss control, and auto-dismiss it after a short interval. Color supports the message but never carries the meaning alone.
- Keep inline alerts for persistent, contextual, blocking, or actionable information that must remain beside the affected content. Do not replace validation errors or required next steps with an ephemeral toast.
- Use the Accura-level `AccuraInformationPanel` for persistent explanatory content that helps a user understand a nearby task but does not report validation, warning, or success. It uses the semantic information-blue surface, a uniform thin border, icon, title, and description so it remains distinct from selectable cards.
- A persistent information panel has no close or collapse control by default. Do not imply that required task context can be dismissed; add a visibility control only when hiding the content is a real user setting.

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
