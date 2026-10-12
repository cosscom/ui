# Agent UI detail audit — 2026-09-22

Scope: source review of all eleven Agent UI primitive files, their examples, and related documentation. Targeted browser verification of composer, panel, feedback, tool activity, and approval bounds. This is not a complete accessibility or cross-browser certification.

## Findings and changes

| Detail | Finding | Resolution |
| --- | --- | --- |
| Multiline panel messages | User input retained newlines in state but rendered with normal whitespace. A three-line submission rendered as one 36px bubble. | Preserve whitespace in the panel's submitted-text composition, matching the connected recipe. Browser result: 76px bubble with three lines. The generic content primitive remains suitable for rich children. |
| Author identification | Panel and feedback examples omitted the accessible author labels used in other examples. | Added You/Assistant labels to those message articles. |
| Feedback spacing | The example still combined the message gap with `mt-1`, and its demo controls used `mt-6`. | Message parent owns gap-2; example parent owns gap-6. Visual spacing is preserved. |
| Demo control spacing | Conversation, connected conversation, status, activity, reasoning, and panel examples used margins on trailing controls. | Parents now own gap-4 or gap-3 as appropriate. Removed the activity and empty-state space-y utilities in favor of flex gaps. |
| Status wrapping | Five consumer locations reached into the label slot with selectors to undo truncation. Long unbroken labels lacked an explicit wrapping strategy. | Added optional `wrap` (default false). Errors and disclosure summaries opt in. It handles whitespace and overflow wrapping centrally, while existing concise standalone status labels retain truncation. |
| Multiline icon alignment | Error icons were vertically centered against two-line labels. | Wrapped status uses start alignment, with an icon box matching one text line. Verified 14px icon starts 1px below the first 16px line. |
| Copy error text | Connected recipe omitted the final punctuation used by message examples and docs. | Standardized “Could not copy. Try again.” |
| Composer documentation | Text suggested queues were deferred to a connected example, although that example exists without queue support. | Explicitly documents that the connected recipe does not implement queues. |
| Copy/Edit documentation | User-message snippet did not preserve multiline prompt formatting. | Added whitespace preservation to that composition. |

## Reviewed decisions retained

- Cal's message spacing uses a 4px message gap plus 4px action-row top padding. This was confirmed in its conversation source; it is not an accidental extra gap introduced by coss. No visual change made.
- Connected conversation and panel intentionally use different viewport insets. Both keep message padding inside the scrolling content. No padding or scrollbar position changes made.
- Composer uses its existing textarea padding to clear the scrollbar. Desktop long-draft measurement: text area's right content boundary at 852.5px, scrollbar starts at 853.5px. No overlap reproduced, so no new gutter or padding was added. Physical touch/other browsers still need checking.
- Compact typography, semantic colors, icon sizing through coss Button, disclosure indentation, reduced-motion classes, and logical start/end spacing were source-reviewed. This pass does not claim an exhaustive token-by-token visual match across every state.
- Message actions remain a labeled group of independently tabbable controls, while the launcher uses Toolbar's roving focus. These represent different interaction contracts and need not share a role.
- Reasoning preserves disclosure choice; feedback commits selection after successful save and keeps retryable errors contextual. Those contracts were retained.
- The standalone composer remains an explicitly described appearance/editing preview. Send/Stop behavior belongs in the connected demo, per the user's earlier decision.

## Verification

- Browser reproduced and verified the panel newline fix; author labels appear in the accessibility snapshot.
- At 375px, mixed tool activity measured 278px client and scroll width. Its summary uses normal whitespace and overflow-wrap:anywhere.
- At 375px, failed feedback measured 278px client and scroll width; buttons-to-error gap remained 8px. One alert, no nested status/live region in the error. Screenshot and DOM measurements confirmed first-line icon alignment.
- Approval card bounds inspected at 375px; no material widening observed (1px rounded/border measurement difference).
- App formatting/check command passed with one exports-order warning and informational notices. Registry dependency validation (522 particles / 65 primitives), registry generation (603 items), package sync, TypeScript, and diff whitespace checks passed.
- An initial formatting command accidentally ran from the repository root and reported existing check failures. No additional tracked files outside the pre-existing change set were modified; subsequent formatting and validation used apps/ui as required.

## Remaining review work

The next useful pass is an isolated consumer stress fixture: long translated labels, long unbroken tool names, disabled controls, combined Copy/Feedback placement, RTL, reduced motion, forced colors, and keyboard focus at narrow widths. Follow with physical touch/IME, screen-reader, and cross-browser checks. Those are not covered by the targeted browser checks above.

The independent coding-agent usability exercise and live-provider smoke test remain unperformed. No new session/history features or deployment are included in this audit.

## Stress follow-up — 2026-09-22

Added a retained [manual stress fixture](validation/agent-ui-stress/README.md) for long labels, combined actions, disabling, and RTL. The temporary app route was removed after use. Fixed feedback reason and footer-button overflow by allowing bounded labels to wrap and controls to grow vertically. Added a documented full-width/top-aligned Copy + Feedback composition so an inline error does not displace the rating controls to another row.

Recorded 375px LTR dialog measurements and RTL error-state bounds, keyboard disclosure/escape behavior, disabled semantics, and eight passing feedback regression tests. Required generation/type checks passed. See the fixture README for exact evidence and limitations; reduced-motion/forced-colors browser emulation and physical accessibility testing remain open.
