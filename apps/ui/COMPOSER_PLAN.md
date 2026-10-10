# Composer and drawer implementation plan

Build a reusable coss Composer for chat and agent interfaces. The agreed default is a contenteditable input with full-width text and a permanent bottom action row. Prototype editing without adding an editor dependency, and expose opt-in drawer keyboard handling through the existing Base UI integration. Release in coss before migrating Cal.

This is the implementation handoff from the analysis discussion on 10 October 2026. Component and prop names below are provisional; the behavior and scope are the agreed direction.

**Accepted component boundaries**

| Piece | Responsibility |
| --- | --- |
| `Composer` | Styled form; activates managed contenteditable editing when given a structured draft or triggers, and remains a plain form for a textarea |
| `ComposerInput` | Styled input and internal ScrollArea; defaults to contenteditable, accepts a textarea or external editor through `render` |
| `ComposerPopup`, `ComposerList`, `ComposerItem`, `ComposerStatus` | Styled suggestion parts connected to the managed Composer context |
| `ComposerActions`, `ComposerActionGroup`, `ComposerSubmit` | Permanent controls row and submit button |
| `lib/composer-editor.ts` | Internal headless context for native editing, suggestions, keyboard navigation, ARIA, and anchoring |
| `useComposerEditor` | Native contenteditable document model, query detection, token insertion, history, and submission policy |
| Drawer integration | Host geometry, keyboard avoidance, and gesture handling |

The public component names are the same for textarea and managed contenteditable examples: `Composer`, `ComposerInput`, and the optional popup and action parts. The styled UI module depends on a small headless controller, much as other coss wrappers depend on Base UI. Installing `@coss/composer` includes that controller; there is no separate editor component family or installation step. No public viewport or separate textarea wrapper is required.

The managed Composer supports controlled and uncontrolled drafts. Plain `Composer` uses native form submission events, while managed `Composer.onSubmit` receives the structured draft. Supplying `value`, `defaultValue`, or `triggers` activates managed editing; there is no separate mode prop. Custom editors use the same UI surfaces with `render`; the headless `ComposerSuggestions` provider remains available for controlled suggestion integration. Such integrations own their document, selection, queries, and insertion and explicitly pass the popup anchor.

Base UI Autocomplete is suitable for Command's native input contract. Its installed input implementation relies on native `.value` and selection APIs; rendering it as contenteditable does not provide the range-based editing contract needed here. Reuse Base UI positioning and filtering without pretending this custom editing behavior is a Base UI primitive. Lexical is optional and no concrete Lexical integration is shipped.

**Layout and sizing**

The input always occupies the full available width above the actions. The leading group can contain an attachment button and other controls; the trailing group can contain microphone, submit, or stop controls. All controls appear inside the shared visual frame but outside the editable DOM.

- Start with one visible row below `md` and two rows from `md` upward. Expose `minRows` and `maxRows` on `ComposerInput` (and the helper input) to set row limits. Default to eight maximum rows. Use `text-base` below `md` and `text-sm` from `md` upward; measure both limits in their actual line-height units, including vertical padding. Keep the scroll cap within half the viewport height.
- Let contenteditable grow naturally to a configurable CSS maximum height, expressed in line-height units where useful and constrained by the host's available height.
- At the limit, scroll the coss ScrollArea viewport around the editing area. Keep the actions visible in their own row.
- Give the placeholder the same typography and inset as the entered text, and handle the empty state after deletion and clearing.
- Use CSS Grid or Flexbox for the frame and action groups. Preserve usable control sizes at narrow widths.

The empty composer is deliberately a little taller because the actions already occupy their own row. The submit button aligns with the other actions, rather than the first or last text line.

Do not implement a Gemini-style switch between inline and stacked layouts. There is no line-count measurement, text-width mirror, canvas measurement, ResizeObserver, hysteresis, or layout-mode state for that purpose. The earlier `layout="auto"` proposal and fixed side columns are superseded. Positioning and keyboard infrastructure may still use measurements internally.

**Suggestions and selected content**

Use autocomplete-style interaction in a non-modal coss Popover, with listbox results and focus remaining in the editor. Anchor it above the whole composer frame, match the frame width, and constrain its height to available space. The result list scrolls independently. Caret-coordinate positioning is unnecessary; the insertion range still follows the active query in the text.

Configure triggers as zero or more entries. Consumers can enable `@` alone, `/` alone, both, or neither; there is no mandatory trigger. Each enabled trigger has its own result source and selection behavior. With no triggers configured, the input remains an ordinary composer and never opens suggestions. Keep the API open to other single-character triggers without building trigger-specific behavior into `ComposerInput`.

Recognize only configured triggers at appropriate text boundaries, including when editing in the middle of a draft. Allow multi-word queries, normalize ordinary/nonbreaking spaces for matching, and end queries at newlines, punctuation outside supported name characters, another trigger, or token boundaries. Replace through the current word at the caret without consuming subsequent prose. Do not treat email addresses, ordinary URL slashes, selected ranges, or token interiors as new queries. Keep trigger rules explicit and testable.

Applications supply result data and own fetching. Show ready results, loading feedback, and error feedback; hide the popup when a completed query has no matches. Results from an outdated query must not be selectable. Keep the default API simple enough for a local array of results.

Arrow keys navigate results, Enter selects an available result, Escape dismisses the popup before affecting the host drawer, and Tab follows normal focus navigation. A loading or stale result must not cause accidental submission. Send on Enter by default on all devices, keep this policy configurable, preserve Shift+Enter for newlines, and do not select or submit during IME composition. Pointer and touch selection should preserve editor focus and the mobile keyboard without disabling list scrolling.

Selected references must retain stable IDs where the application needs them. Keep any structured value independent of Lexical and Cal-specific membership or scope types, with a readable plain-text representation. Pasted display names alone must not acquire reference IDs.

The prototype uses indivisible mention and action tokens. Treat that as provisional until whole-token deletion, selection, clipboard behavior, and undo are verified in browsers. Cal migration must explicitly preserve or map its existing token semantics.

Selecting an item inserts a token into the draft, retaining its type, ID, label, trigger, and optional application-defined kind in `ComposerValue`. The trigger controls when suggestions open; kind distinguishes results such as people and teams within the same `@` menu. `ComposerInput.renderToken` can render each selected part with `ComposerToken`, including a different icon or variant per kind. Mentions and actions share insertion and editing behavior. Selection does not submit the message or execute an action; the application handles action parts through `onSubmit` when the user sends the message.

**Dependency-free editing prototype**

Use the browser's native editing capabilities and add the minimum behavior needed for the agreed reference model. Keep DOM ownership deliberate: rewriting contenteditable children from React on every keystroke can disrupt selection, composition, and native undo.

Prove insertion, deletion, undo/redo, paste, and composition before expanding the public API. Preserve selection during suggestion selection and external draft updates; define clearing, restoring drafts, disabled/read-only behavior, and accessible labeling. Define a plain-text external paste policy and a deliberate serialization/form-submission contract instead of treating arbitrary HTML as the value.

If reliable editing requires substantial editor infrastructure, present the specific failures and tradeoff before changing the dependency-free direction. An optional future engine integration remains possible; it is not an assumption for this prototype.

**Drawer keyboard behavior**

Promote the chat demo's existing Base UI `VirtualKeyboardProvider` composition into an opt-in coss API. The installed Base UI version already exposes the provider. Proposed conveniences are `DrawerPopup keyboardAware` and a keyboard-avoiding footer; settle the smallest useful API during implementation.

Keep the drawer frame/header stable, place the conversation in a shrinking scroll region, and keep the composer outside that region above the keyboard. Apply keyboard and safe-area spacing once, with a zero fallback for the keyboard inset. The input's own growth limit must leave room for its actions in a short viewport.

The host owns keyboard avoidance; Composer does not reposition the entire page. Reuse Base UI's focus, viewport, and gesture handling before adding custom listeners. Verify that editing, selecting text, and scrolling suggestions do not trigger drawer dismissal. Preserve nested-drawer focus return and make keyboard behavior opt-in for existing consumers.

**Implementation sequence**

1. Build a focused coss prototype with the permanent action row, contenteditable input, highlighted selection, and frame-anchored suggestions. Establish the mention editing contract and verify the difficult editing interactions first.
2. Extract the reusable Composer pieces and the minimal suggestion controller. Demonstrate all four configurations: no triggers, `@` only, `/` only, and both. Also demonstrate multiple action buttons, empty/loading results, and long drafts with CSS growth limits.
3. Extract the drawer keyboard convenience and compose the same Composer inside it. Remove the need for consumers to repeat the demo's provider wrapper and keyboard-padding details.
4. Validate meaningful behavior across desktop and mobile before release. Test caret insertion, reference deletion and history, external paste, Unicode/IME, stale results, keyboard navigation, screen-reader announcements, and selection across highlighted content. Test real iOS Safari and Android Chrome for keyboard opening/dismissal, long drafts, landscape, suggestion taps, and nested drawers; browser emulation alone is insufficient.
5. Add coss documentation and particles, then run the applicable type/lint checks and required registry dependency validation, registry build, and UI synchronization. Keep the registry source authoritative for generated/package copies.
6. Migrate Cal chat and agent consumers after coss behavior is validated. Adapt existing drafts and reference payloads explicitly, preserve application callbacks and runtime ownership, and remove obsolete implementations or dependencies only after their consumers have migrated.

**Current prototype status**

The public `Composer*` parts now serve both native contenteditable and textarea examples. Structured `value` or `defaultValue`, or a `triggers` prop, activates the internal editor controller; textarea examples keep ordinary string state and native form handling. Documentation and particles use one composition throughout.

Earlier Chrome checks covered mention/action selection, multi-word queries, insertion into a sentence, deletion, undo/redo, plain-text paste, trigger configuration, async loading/empty/error states, submission, long-draft scrolling, and drawer dismissal. After this separation, Chrome checks pass for surface-only textarea submission/clearing/ref focus, multi-word mentions, keyboard and pointer token insertion, mixed-token submission, empty results, async results, drawer selection and popup-only Escape, and 24-line draft scrolling capped at 192px with the action row outside it. The popup matches the form at 576px wide and remains 4px above it. App/package TypeScript, focused Biome, four query tests, registry validation/build, package synchronization, generated parity, and the optional dependency boundary checks pass.

Real iOS Safari and Android Chrome keyboard behavior, IME composition, screen-reader behavior, and nested drawers still need device validation before release or Cal migration. The editing prototype uses `document.execCommand` where available to retain browser undo history, with a Range fallback. An actual Lexical integration has not been validated. A previous full Next production build did not finish; type, registry, and interactive checks are used during this refactor.

**Source references for implementation**

- [Drawer primitive](registry/default/ui/drawer.tsx) and the [new Composer prototype](registry/default/ui/composer.tsx). The older coss chat composer and demo files discussed during analysis are absent from this branch of `main`; inspect their original revision if their behavior is needed for migration.
- Cal's `packages/ai/src/react/ui/agent-mention-composer.tsx`, `composer-value.ts`, `composer-editor-state.ts`, `composer-keyboard.ts`, and `composer-clipboard.ts` for migration behavior. Use these as references rather than copying Cal domain rules into coss.
- [Base UI drawer keyboard guidance](https://base-ui.com/react/components/drawer#virtual-keyboard-aware) and [WAI autocomplete interaction guidance](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Validate the final multiline editor and listbox association with assistive technology.
