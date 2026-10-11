# Composer and drawer implementation

Build a reusable coss Composer for chat and agent interfaces: a contenteditable input, optional configurable suggestions, full-width text, and a permanent bottom action row. Release in coss before migrating Cal. External editor integrations are out of scope for this pass.

## Component boundaries

| Piece | Responsibility |
| --- | --- |
| `Composer` | Styled frame and provider; form by default, div through `render` for embedding |
| `ComposerInput` | Styled native contenteditable or rendered textarea, internal coss ScrollArea, token presentation |
| `ComposerPopup`, `ComposerList`, `ComposerItem`, `ComposerStatus` | Styled Base UI popover and headless suggestion behavior |
| `ComposerActions`, `ComposerActionGroup`, `ComposerSubmit` | Permanent controls row and composable submit control |
| `lib/composer-editor.ts` | Context, item registration, navigation, announcements, anchoring, frame focus, input measurement |
| `hooks/use-composer-editor.ts` | Controlled editing, history, composition, clipboard, query state, submission policy |
| `lib/composer-document.ts` | Document types, DOM serialization, selection offsets, query extraction, token insertion |
| `lib/composer-query.ts` | Pure trigger/query parsing |
| Drawer | Opt-in keyboard and safe-area handling through Base UI |

Registry files are authoritative. Package copies and registry JSON must match them. The Composer is a custom headless controller with Base UI composition utilities and positioning; Base UI does not provide a contenteditable autocomplete primitive.

## Public contract

- One API for both inputs. `Composer` manages an empty draft without activation props. `value`/`onValueChange` controls it; `defaultValue` initializes it. `onSubmit` always receives `ComposerValue`.
- `ComposerInput` defaults to contenteditable; `render={<textarea />}` chooses native plain text. Detection uses the mounted element, including render callbacks and custom components that forward props and ref. A textarea uses text parts and has no token suggestions. Keep state on the Composer, not on the rendered textarea.
- Configure zero or more triggers. `@`, `/`, another character, both, or none are application choices. Multiword matching remains supported. Async results identify their query through `itemsFor`.
- Suggestion identity is the item's stable `id`, unique within a trigger. Registered items provide disabled state and DOM refs. Navigation skips disabled items and preserves input focus. Empty ready results hide the popup; loading feedback is composed with `ComposerStatus`.
- Use `ComposerInput.renderToken` to customize each token, including icons or styles by `kind`. `ComposerToken` supplies plain and chip variants. Chips wrap as inline text, with normal weight and decorative icons at opacity 80.
- Enter submits and Shift+Enter inserts a newline by default. `submitOnEnter` can select desktop-only or newline behavior. User handlers run before the internal handlers.
- `submitDisabled` is the shared submission gate; `allowEmpty` supports attachment-only messages. `disabled` prevents editing and submitting. `readOnly` preserves selection and copy while blocking edits and submit.
- `ComposerSubmit` delegates submission while consumers provide the button's appearance through `render`. Its local `disabled` controls the button; the root gate covers keyboard submission too.
- Standalone submission uses the native form's constraint validation. A div frame calls the same callback without submitting a containing form. `name` serializes canonical text to a hidden field. A native form reset or `useComposerContext().reset()` restores the initial draft; controlled owners receive a reset request.
- `useComposerContext` exposes the draft, submission and disabled state, active source status, and submit/reset actions for custom controls.

## Editing lifecycle

- Preserve native DOM during accepted typing. Reconcile rejected controlled changes and external values before paint, preserving/clamping selection offsets.
- Defer external document writes during IME composition. If the controlled document changes during composition, apply it after composition ends.
- Contenteditable undo/redo stores document and selection snapshots, groups adjacent typing, and includes token insertion, paste, and cut. External replacements and reset clear this local history. Native textareas retain browser editing history.
- Canonical serialization includes token triggers even when chips hide them. Copy/cut writes plain text. Pasted/dropped strings never acquire reference IDs. Native rich-text formatting is prevented.
- Editing and serialization do not depend on `document.execCommand`.

## Layout and drawer

Use CSS for a permanent bottom action row. Do not add a one-line versus multiline layout state machine. Defaults are one input row below `md`, two from `md`, and eight maximum rows. `minRows`/`maxRows` set fixed limits; inherited CSS variables provide breakpoint-specific limits. The scroll cap also respects half the viewport height. A small measurement synchronizes the cap with the editable element's actual typography and padding; it does not choose layout modes.

The popup anchors to the frame, uses its width, and defaults to a 4px offset. Actions remain outside the input scroll region. Empty frame space focuses the input without stealing clicks from interactive controls.

`DrawerPopup keyboardAware` adds Base UI keyboard handling and safe-area spacing only. The example owns its drawer height. The conversation scrolls in `DrawerPanel`; the Composer stays outside it. In constrained layouts the frame and input ScrollArea can shrink, while the action row does not. Avoid `shrink-0` on the frame in a keyboard-aware drawer.

## Verification status

Checkpoint before this stabilization pass: `fb145489` (`Use default arrow cursor for composer tokens`).

Per the user's instruction, this pass adds and runs no tests. Type checking, focused lint/format checks, registry dependency validation, registry generation, and package synchronization provide static verification. Targeted Chrome checks previously verified token wrapping; they do not validate the revised editing behavior or other browsers.

Real iOS Safari and Android Chrome keyboard behavior, IME, screen readers, nested drawers, and the revised editing/history interactions still need runtime validation before release or Cal migration. External editor adapters are deferred.

## Stabilization changes

- Detect native textareas from the mounted ref, including render callbacks and custom components. Refresh token portal hosts when an input is replaced.
- Keep suggestions and submission inactive during IME composition, and avoid reopening suggestions from an unfocused input.
- Ignore duplicate document notifications when an input event leaves the value unchanged.
- Preserve token markup when dropping text over a token; normalize pasted/dropped line endings and require both selection endpoints to stay inside the input.
- Reference the rendered list and option IDs for accessibility, including consumer-supplied IDs.

Before a stable release, validate undo/redo, multiline selection, token deletion, clipboard behavior, controlled updates, and textarea render variants across supported browsers. Verify IME/autocorrect/dictation, screen-reader navigation and announcements, and real mobile keyboard/drawer interactions separately. These remain release checks, not claims of verified support.

## iPhone simulator check — 2026-10-10

Device Hub: iPhone 17, iOS 27.0, Safari, software keyboard enabled for the check. This is simulator evidence, not a physical-device sign-off. No automated tests were added or run.

Verified manually:
- Plain textarea Return submits; Shift+Return creates a new line.
- Native @ opens suggestions; an immediate space closes them; deleting the space reopens them.
- Tapping a mention or slash action inserts the appropriate token and keeps the keyboard open.
- A 12-line contenteditable draft caps at eight visible rows and scrolls to the caret with Send reachable.
- In portrait, keyboard dismissal/reopening restores the drawer layout.

Found and corrected:
- The keyboard provider added bottom padding to the composer ScrollArea viewport, inflating an empty input and hiding the conversation. The viewport now prevents this extra padding, since the drawer already reserves the keyboard inset. Verified the compact input and visible conversation in portrait after the change.

Outstanding findings:
- Landscape rotation with the software keyboard open collapses the drawer composer to a thin strip; input and Send are not accessible. Reproduce by opening the drawer, focusing its empty input, then rotating left.
- After Select All and Delete on the multiline contenteditable draft, the input became visually empty and Send disabled, but the placeholder was absent. Typing and deleting one character with the software keyboard restored it. The underlying cause is not yet established.

Limits: token chip wrapping, multiword query matching, paste, undo/redo, IME, dictation, and VoiceOver have not been validated on this simulator. Host text injection of @ opened Safari Find, and host clipboard paste did not populate the field, so neither is counted as a component failure or a passing clipboard check.
