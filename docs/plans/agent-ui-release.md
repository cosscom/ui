# Agent UI release plan

Status: Increment 10a (panel and action-bar foundation) implemented on `codex/agent-ui-approval`; awaiting review. Increment 9 (response feedback) is implemented and awaiting review. The rest of increment 10 remains pending. The increment 6 live-provider smoke test remains unverified.

Created: 2026-09-21

This is the reference for extracting Cal's agent interface into coss UI. Work proceeds in small increments. Update this document as decisions are made and increments are verified; do not treat proposed APIs or installation names as already available.

## Current audit — 2026-09-22

This table is the current status; the dated entries below are historical evidence, not a claim that every original completion criterion has been met. This audit compared the plan with registry source, documentation, integration files, and recorded verification. It did not rerun the earlier tests.

| Increment | Current implementation | Outstanding scope or verification |
| --- | --- | --- |
| 0 | Plan and mapping written | Keep scope changes reflected in this table |
| 1–4 | Approval, grouped approvals, messages/actions, and conversation viewport implemented, with recorded checks | Broader accessibility/device/browser validation remains part of release validation |
| 5 | Plain composer implemented | Optional queued-message presentation and queue opt-in scenario were deferred; not implemented by increment 6 either |
| 6 | Optional AI SDK integration, real HTTP sample streaming, cancellation/retry, and optional Markdown rendering implemented | Live-provider smoke test not performed; controlled-provider tests and sample HTTP streaming are the recorded evidence |
| 7 | Status and tool activity implemented, including mixed/unknown fixtures | Runtime mapping is demonstrated with fixtures; reduced-motion/forced-colors/RTL behavior was source-reviewed, not fully exercised |
| 8 | Reasoning implemented with controlled/uncontrolled disclosure | Reduced-motion CSS verified, but preference-enabled browser behavior not exercised; deliberate policy difference: no Cal-style automatic reopen/close |
| 9 | Response feedback implemented after user explicitly requested it | Awaiting review; local simulated submission and consumer contract tests, no service integration |
| 10a | Panel and action-bar launcher implemented | This is a local single-conversation recipe, not the complete embedded assistant |
| Rest of 10 | Not implemented | Session controls/switching, per-session drafts/messages, unread state, history, conversation menu, page context, and panel/page continuity |
| 11 | Not started | Structured mentions/slash-action composer; may ship later as experimental |
| 12 | Not started | Public installation, compatibility/release checklist, licensing resolution, validation in Cal and another application domain |

Additional evidence limits: most later behavioral harnesses are temporary clean-consumer files under `/private/tmp`, not durable repository regression tests. No screen-reader session, physical touch/IME check, or cross-browser matrix has been recorded. Several components have narrow-layout and keyboard evidence, but that is not full completion of the plan's collection-wide visual/accessibility contract.

Before calling the earlier increments fully verified, close the relevant verification gaps. Queue presentation remains an explicit deferred feature, not a completed composer capability. Feature expansion is paused while the existing set is made easier to compose. The next checkpoint is the composition guide, followed by an independent agent usability exercise. Session controls are not the next automatic increment.

## Objective

Release reusable agent interface components with the existing Cal visual style, distributed through coss's registry. Give consumers control over their runtime, application state, and backend.

The release should support both a minimal conversation and an assistant embedded in an existing application. The embedded assistant is the flagship example; the minimal conversation is the getting-started path.

Success means that an external developer can install the components, connect a working conversation, and understand which behavior belongs to their application without reading Cal's source.

## Working agreement

- Implement one bounded increment at a time. Finish its code, examples, documentation, and relevant verification before starting another.
- When asked to execute an increment, complete that increment and report the result. Stop at its review checkpoint unless the user explicitly authorizes a larger scope.
- Preserve the current visual design before making design improvements. Record intentional visual differences.
- Keep each increment independently reviewable. Avoid unrelated cleanup or speculative abstractions.
- Prefer existing coss primitives and conventions. Do not introduce a new runtime, CLI, or package architecture as part of extraction.
- Use focused behavioral tests for meaningful state and interaction contracts. Do not create tests that merely repeat styling or implementation details.
- Keep Cal's implementation available until a replacement is validated. Migration is separate work.
- Record what was actually checked. A documented scenario or an existing test is not evidence that verification passed.

## Boundaries

| Layer | Responsibility |
| --- | --- |
| Reusable UI | Markup, styling, accessibility, local disclosure, interaction feedback, and intent callbacks |
| Optional integrations | Map runtime messages and states into UI props; demonstrate connection to a real backend |
| Application | Conversation identity, messages, drafts, routing, persistence, authorization, tool execution, context resolution, and queue policy |

Installing presentation components must not require Cal localization, a Cal session store, AI SDK, or an account with a model provider. Runtime dependencies belong in explicitly selected integrations. Lexical belongs only in the structured composer installation. Rich-response rendering should also be independently selectable.

The initial release excludes voice, workflow canvases, terminal viewers, a general artifact system, hosted persistence, and a custom agent runtime. It also excludes a mobile session dock; the full-page conversation must still work at narrow widths.

## Proposed public surface

Retain the `Agent*` prefix initially. Final exports are decided incrementally, using the first component to establish conventions.

| Existing Cal module | Proposed coss treatment | Increment |
| --- | --- | --- |
| `agent-approval-card` | Single approval component and composable parts | 1 |
| Grouped exports in `agent-approval-card` | Grouped approval with explicit grouping and decision contract | 2 |
| Message exports in `agent-conversation` | Separate message family, including optional text disclosure | 3 |
| `agent-message-actions` | Composable message actions | 3 |
| Viewport exports in `agent-conversation` | Conversation viewport and jump-to-latest control | 4 |
| `agent-composer` | Plain composer; optional queued-message presentation | 5 |
| `agent-status-indicator` and `agent-tool-activity` | Status and activity families | 7 |
| `agent-reasoning` | Reasoning disclosure | 8 |
| `agent-response-feedback` | Optional feedback family | 9 |
| `agent-panel` and `agent-action-bar` | Reusable parts supporting an embedded-assistant recipe | 10 |
| `agent-history-popover` | History recipe initially | 10 |
| `agent-conversation-menu` | Recipe using Menu and AlertDialog | 10 |
| Page-context controls | Application-context recipe with explicit payload ownership | 10 |
| `agent-mention-composer` and supporting utilities | Separately installed structured composer | 11 |
| `agent-disclosure-trigger` | Shared implementation detail, not a documented consumer entry point | As needed |
| Cal runtime adapters | Reference material for optional integration examples; not copied wholesale | 6, 7, 12 |

Reusable components should have named registry entries. Demonstrations should follow the repository's particle conventions. Do not add the AI families to the default install-all-primitives bundle.

## Sequence and completion criteria

Each numbered increment is a separate unit of work and review. The sequence is deliberate; it is not authorization to implement everything in one run.

| Increment | Deliverable | Completion criteria |
| --- | --- | --- |
| 0. Release proposal | This plan, component mapping, and first-component specification | Scope and first extraction approach reviewed; unresolved decisions recorded |
| 1. Single approval | Installable approval component, focused examples, docs, and tests for its decision contract | Cal appearance preserved; caller-controlled disabling verified; clean consumer installation verified |
| 2. Grouped approvals | Grouped example and reusable API where justified | Grouping is caller-defined; pending, partial failure, and retry responsibilities explicit; no implied transactional execution |
| 3. Messages and actions | Message family with action slots and optional text disclosure | Long content, keyboard/touch access to actions, copy feedback, and disclosure behavior verified |
| 4. Conversation viewport | Scroll container and jump control | Initial position, following new content, preserving a reader's position, and content resizing verified in a browser |
| 5. Plain composer | Controlled input, Send/Stop, action slots, optional queue item | Mouse and keyboard follow one eligibility policy; multiline, IME, empty, disabled, busy, and queue opt-in behavior verified |
| 6. Minimal connected example | Working conversation using increments 3–5, plus optional rich-response rendering | Real streaming, cancellation, and recoverable failure work; installation has no undeclared Cal dependencies |
| 7. Status and tool activity | Compact activity display and example state mapping | Running, successful, declined, failed, mixed, and unknown-tool states remain understandable |
| 8. Reasoning | Disclosure with controlled and uncontrolled options | Streaming transitions respect user choice; automatic close policy documented; reduced-motion behavior checked |
| 9. Feedback | Positive/negative feedback with optional reasons and details | Async submission, duplicate prevention, failure recovery, controlled state, and focus restoration verified |
| 10. Embedded assistant | Action bar, panel, history, menu, and page-context recipe | Session identity, draft continuity, focus, unread state, and panel/page transitions verified together |
| 11. Structured composer | Optional mentions and slash-action installation | Generic reference model, stale queries, token editing, clipboard, undo/redo, IME, and keyboard behavior verified |
| 12. Release validation | Documentation collection, external-domain example, compatibility notes, and release checklist | Public installation paths and supported contracts verified; limitations accurately documented |

Increment 11 may remain experimental and ship after the core collection. Its dependencies and editor work must not block a useful core preview.

### Integration checkpoints

- After increment 1: evaluate whether the extraction method preserves the style and produces a usable public API. Apply lessons before extracting more components.
- After increment 6: use the minimal conversation to assess API fit and integration effort. Resolve problems before expanding into session management.
- After increment 10: review the complete embedded experience as a product, including awkward transitions and failure states.
- Before stable release: validate in Cal and at least one different application domain. Do not describe the family as production-proven based on mock demonstrations alone.

## First implementation: single approval

Implemented as the first extraction. Review the API and visual treatment before authorizing increment 2.

### Included

- Preserve the current framed card, spacing, typography, contextual details, and action treatment.
- Use existing coss Card and Button components.
- Supply visible labels and content through props or composition; no Cal localization dependency.
- Expose enough composition to render richer approval content while keeping the existing card convenient to use.
- Report approve/reject intent. The caller owns persistence and execution.
- Let the caller disable decisions while pending. Success/error feedback stays with the application and is not displayed in the approval footer.
- Include a scheduling example for visual fidelity and one non-scheduling example to challenge domain assumptions.
- Add registry metadata, a focused documentation preview, and clean-install verification.

### Excluded

- Group approvals, bulk execution, runtime adapters, conversation state, session hosting, backend permissions, and a new generic form framework.
- Changes to Cal's existing implementation or a visual redesign.

### Decisions from increment 1

1. Registry entry: `@coss/agent-approval`. Four exports: `AgentApproval` (frame), `AgentApprovalContent` (inner card/panel), `AgentApprovalActions` (decision footer), and `AgentApprovalCard` (convenience composition).
2. `onRespond(approved: boolean)` reports intent. The caller controls `disabled` to block both actions while processing a decision. There is no built-in request lifecycle.
3. Following user review, remove the proposed feedback/state API. The footer contains only actions. Any success/error feedback belongs to the surrounding application; whether to provide it is a product decision.
4. Rich content uses convenience-card children or the three composable parts. Labels are required; Cal's tool identity and grouped-label object are removed. Native props, refs, and Base UI render composition are forwarded.

These decisions apply to this card; they do not predetermine the API of every later family.

### Review package

Provide the proposed API, working preview, comparison with the Cal reference, registry installation result, behavioral verification, and any remaining limitation. Include exact commands and outcomes for checks performed. Stop here for review before grouped approvals.

## Visual contract

Keep assistant responses visually open, user prompts in compact muted bubbles, activity at a quieter level, approvals in framed surfaces, and composer actions compact. Match existing coss tokens and component sizing.

Capture references as each relevant increment starts: single/group approval, panel/page conversation, active/failed tools, queued prompt, mention suggestions, and negative feedback. Compare with equivalent content and viewport sizes in light and dark themes.

Visual preservation does not require preserving every DOM wrapper. It does require documenting changes to density, hierarchy, spacing, surface treatment, and interaction affordances.

Check contrast, focus visibility, narrow layouts, translated labels, RTL, touch targets, and reduced motion where applicable. Do not silently carry desktop-only assumptions into the full-page experience.

## Known extraction findings to recheck

These came from the initial source audit on 2026-09-21. Reconfirm against the current source before implementing; they are not a record of tests run.

| Finding | Planned treatment |
| --- | --- |
| Plain composer Enter reaches submission without enforcing its busy policy; Cal's runtime guards downstream | Centralize eligibility for mouse and keyboard in increment 5 |
| Group approval loops over callbacks without modeling asynchronous or partial completion | Define explicit caller-owned batch/individual outcomes in increment 2 |
| Group headings are inferred from matching question strings | Let callers supply grouping intent in increment 2 |
| Tool activity and approval APIs have fewer customization hooks than the composer; reasoning excludes controlled open state | Establish consistent props, refs, slots, and control conventions during each extraction |
| Mention values only recognize Cal's `event-type` semantics; clipboard uses a Cal-specific format | Separate identity, appearance, and serialization; define a versioned clipboard contract in increment 11 |
| Existing connected documentation relies on Cal's Markdown sanitizer | Provide a public rich-response integration in increment 6 |
| Unregistered tool renderers disappear; mixed summaries and some labels need improvement | Add fallbacks and localized state mapping in increment 7 |
| Attachment, context, and queue demos do not establish working backend capabilities | Distinguish UI examples from integrations throughout documentation |
| Cal uses icon and shared-avatar imports that are not directly portable to this registry | Resolve actual dependencies per increment using public coss conventions |
| Registry source and package metadata have different license declarations | Make intended distribution licensing explicit before release |

Other Cal product policies—first-turn-only page context, restrictions on editing context-bearing messages, transcript truncation, and locally filtered history—belong in examples unless independent usage justifies a reusable contract.

## Repository integration and verification

Use `apps/ui/registry/default/ui/` for reusable registry source and `apps/ui/registry/default/particles/` for focused examples, following the existing agent guidelines. Register dependencies explicitly. Locate supporting hooks and utilities according to existing conventions so generated installation files include them.

For each implementation increment:

1. Inspect the current source and relevant coss primitives before editing.
2. Implement the bounded component and its meaningful state examples.
3. Run appropriate type, lint, registry-dependency, and registry-build checks. Follow the commands required by `apps/ui/AGENTS.md`; inspect generated changes and avoid unrelated churn.
4. Run `ui:sync` when reusable UI changes require the package mirror to be updated.
5. Verify the installed result in a clean consumer, not only inside the documentation app.
6. Perform focused interaction and visual checks. Introduce test infrastructure only when needed for the behavior under review, as explicit scope.
7. Record evidence and limitations below, then present the increment for review.

Before establishing a second permanent copy, define the source ownership and synchronization path. The intended destination is coss as the canonical reusable implementation, with Cal migration handled separately after validation.

## Release documentation

Create a discoverable Agent UI collection within coss. Each component page should lead with a preview and installation, then minimal usage, state examples, ownership, and advanced composition.

The release should include three examples:

- Minimal connected conversation: the fastest path to useful integration.
- Embedded application assistant: the flagship session/panel/history experience.
- Application entities and approvals: a non-scheduling example showing portability, using structured mentions when ready.

Publish supported integration versions, known limitations, and API changes. Do not make mock attachments, queueing, or persistence look like completed product features.

## Tracking

Increments 1–5 were reviewed and the user authorized continuation. After reverting the first increment 6 attempt, the user authorized restarting it from the completed composer step. Increment 6 is implemented and verified with sample HTTP streaming and a controlled provider. The user authorized continuation through increment 8, then agreed to defer feedback and proceed with the panel/action-bar foundation as increment 10a. That bounded step is ready for review; session management and the rest of increment 10 remain pending. A live provider has not been exercised.

| Date | Increment | Status | Evidence / decision |
| --- | --- | --- | --- |
| 2026-09-21 | 0 | Execution authorized | User requested a new branch and the first increment |
| 2026-09-21 | 1 | Ready for review | Single approval, two examples, docs, generated registry, package mirror, tests, and clean installation verified |
| 2026-09-21 | 1 | Continuation authorized | User requested continuation after the demo refinements below |
| 2026-09-21 | 2 | Ready for review | Grouped approval, eligibility contract, example, documentation, tests, and fresh consumer installation verified |
| 2026-09-21 | 2 | Continuation authorized | User requested the next increment |
| 2026-09-21 | 3 | Ready for review | Message parts, optional actions, three examples, docs, registry, package mirrors, browser checks, and isolated consumer behavior checks verified |
| 2026-09-22 | 3 | Continuation authorized | User requested the next step |
| 2026-09-22 | 4 | Ready for review | Conversation viewport, jump control, example, docs, registry, package mirror, browser checks, and isolated consumer behavior checks verified |
| 2026-09-22 | 4 | Continuation authorized | User requested the next increment |
| 2026-09-22 | 5 | Ready for review | Controlled composer, Send/Stop, action slots, examples, docs, clean installation, browser checks, and isolated interaction tests verified |
| 2026-09-22 | 6 | Restart ready for review | Reference spacing verified before implementation; optional AI SDK recipe, HTTP demo, fresh installation, 19 focused tests, and responsive browser checks; live provider unverified |

For every completed increment, add: changed files or PR, verification commands and outcomes, visual review evidence, intentional deviations, unresolved issues, and the next bounded action. Update the mapping if an API decision changes scope.

### Initial increment 1 verification — 2026-09-21

Historical record for the first proposal. The revision below supersedes its feedback API and demo scenarios.

Branch: `codex/agent-ui-approval`. No commit, publication, or Cal migration performed.

- Source: `apps/ui/registry/default/ui/agent-approval.tsx`; generated mirror: `packages/ui/src/components/agent-approval.tsx`.
- Examples: `p-agent-approval-1` reproduces Cal's routing-form confirmation; `p-agent-approval-2` demonstrates a release summary, deliberate failure, retry, and rejection. Both simulate requests locally.
- Docs: `apps/ui/content/docs/agent-ui/agent-approval.mdx`, discoverable in the Agent UI navigation collection.
- Preview: `http://localhost:4000/ui/docs/agent-ui/agent-approval` while the local UI dev server is running.
- Tests: `packages/ui/test/components/agent-approval.test.tsx` covers approve/reject callbacks, pending/resolved guards, repeated handler calls while blocked, retry, external disabling, and explicit button type.
- Registry is separate from the default `@coss/ui` aggregate. Source ownership remains registry → `ui:sync` → package mirror.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; existing informational lint messages remain; no unrelated source changes retained |
| `cd apps/ui && bun run registry:validate-deps` | Passed for 510 particles and 55 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 580 items generated |
| `cd apps/ui && bun run ui:sync` | Passed; only the new approval file added to the package mirror |
| `cd apps/ui && bun run typecheck` | Passed |
| `cd apps/ui && bun run lint` | Passed with existing informational messages |
| `cd packages/ui && bun test` | 17 passed, including 5 new approval tests |
| `cd packages/ui && bun run typecheck` | Passed |
| `git diff --check` | Passed |
| Fresh temporary React 19 / Tailwind 4 consumer; local registry configured; `shadcn add @coss/agent-approval --yes` | Installed all six source files and npm dependencies without workspace links |
| Consumer: `bunx --no-install tsc --noEmit` and `bun build ./src/check.tsx --outdir ./dist --target browser` | Passed for convenience card, ref, custom frame render, and composed parts |

Clean installation initially exposed `class-variance-authority` missing from the dependency chain for Button/Badge. The new approval registry entry explicitly includes it and `@coss/utils`. A second fresh consumer at `/private/tmp/coss-approval-clean` installed only `@coss/agent-approval` successfully and passed type checking and bundling. The temporary consumer is verification material, not a repository dependency or release artifact.

Browser evidence:

- Compared the new card against the live Cal approval reference in dark theme. Both render the question at 14px / 20px, weight 500, with 16px content padding and a 6px summary gap. Existing coss surfaces and compact buttons preserve the treatment.
- Verified approve → pending → resolved, failure → retry → approved, and keyboard rejection → resolved. Pending disables both actions; resolved retains them disabled. Visible focus was checked on the rejection button.
- Inspected light and dark themes at 375px and 320px viewports. German labels and Arabic RTL composition wrapped without document or card horizontal overflow. The temporary verification route was removed afterward.
- A card nested inside a form reported approval with the form-submit counter remaining zero.
- Intentional visual differences: footer messages for non-ready states, wrapping action labels/chips at narrow widths, and wrapping long content. Ready-state density and hierarchy remain unchanged.

Limits: Browser checks were manual through automation in one browser engine. No screen-reader session, physical touch-device check, or cross-browser matrix was run. No new animation was introduced. Installation was verified against the local registry; the public registry name remains unavailable until deployment. Real persistence and tool execution remain outside this increment.

Next bounded action: review this card's appearance and controlled API. Only after approval, start increment 2 (grouped approvals).

### First revision after user review — 2026-09-21

The subsequent demo review below supersedes this revision’s sparse content and inline reset layout.

- Removed `AgentApprovalState`, `state`, and all built-in status/error messages. The existing `disabled` prop is sufficient for caller-controlled pending behavior.
- The footer now contains only approve/reject actions.
- Simplified the demos to “Send this email?” and “Create this event?” with a single context line. Removed simulated latency, deliberate failures, routing rules, release metadata, and rich summary tables.
- A demo choice replaces the entire card with a small choice receipt and reset control. This belongs to the demo, not the reusable card.
- Updated documentation and tests to match the smaller API.
- Verification: required formatting, registry dependency validation/build, and package sync passed. UI type checking and package type checking (`bun run typecheck --tsBuildInfoFile /private/tmp/coss-approval-revision.tsbuildinfo`) passed; 15 tests passed (3 approval tests). Reinstalled the revised entry into the isolated consumer and confirmed its type check and browser bundle passed. Browser checks confirmed both demo decisions and reset behavior; the card footer contains only actions.

### Demo refinement after further review — 2026-09-21

- Email: recipient, subject, and a short message preview give enough information to review the proposed send.
- Event: time, attendee, and meeting location show the practical scheduling details.
- Keep the full request visible after a decision, with both actions disabled. Show the demo response outside the card in a reserved line to avoid layout shifts.
- Place Reset demo on its own row below a divider, separate from both the response and the card’s action footer.
- No reusable API changes or built-in feedback were added.
- Verification: formatting, registry dependency validation/build, UI type checking, and diff checks passed. Browser inspection covered both decision states, resetting each demo, and email layout at a 375px viewport. Both demos were left reset for review.

### Increment 2: grouped approvals — 2026-09-21

Branch: `codex/agent-ui-approval`. No commit, publication, or Cal migration performed.

- Added `AgentApprovalGroupCard` and `AgentApprovalGroupActions` to the existing `@coss/agent-approval` entry. Source remains `apps/ui/registry/default/ui/agent-approval.tsx`, synchronized to `packages/ui/src/components/agent-approval.tsx`.
- The caller supplies the group question, labels, and stable unique item IDs. A decision calls `onRespond(ids, approved)` once with eligible IDs in display order. The component does not infer groups from matching question strings or execute individual operations.
- Group `disabled` blocks both actions. Item `disabled` excludes handled or pending items from both decisions while retaining their visible content. After partial success, the caller can disable completed items and leave only safe-to-retry items eligible. Empty groups render nothing; an all-disabled group retains its content with disabled actions.
- Added `p-agent-approval-3`: two event types, each with a name, duration, and location. The request stays visible after a decision, the demo response is outside the card, and Reset demo has a separate row below a divider. There is no built-in feedback API or simulated failure flow.
- Expanded `apps/ui/content/docs/agent-ui/agent-approval.mdx` with group usage, composition, API reference, and pending/partial-result responsibilities. The application owns execution, errors, and server-side deduplication; a batch callback does not promise transactional execution.
- Extended `packages/ui/test/components/agent-approval.test.tsx` with batch decisions, item eligibility, retry eligibility, pending/empty/all-disabled guards, duplicate-ID protection, and fresh callback ID snapshots.
- Rebuilt registry payloads and the particle index. No new runtime dependency or default aggregate entry was added.

Visual comparison with Cal's local grouped approval source preserves the framed surface, 16px panel padding and content gap, 12px list gap, secondary item badges, contextual information, and compact actions. Intentional differences are explicit caller-provided headings and labels, narrow-width wrapping, and the action-only footer requested during review.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; 11 existing informational lint messages remain, none for approval files |
| `cd apps/ui && bun run registry:validate-deps` | Passed for 511 particles and 55 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 581 items generated |
| `cd apps/ui && bun run ui:sync` | Passed |
| `cd apps/ui && bun run typecheck` | Passed |
| `cd packages/ui && bun test` | 23 passed, including 11 approval tests; 49 assertions |
| `cd packages/ui && bun run typecheck --tsBuildInfoFile /private/tmp/coss-group-ui.tsbuildinfo` | Passed |
| `git diff --check` | Passed |
| Fresh React 19 / Tailwind 4 consumer at `/private/tmp/coss-group-consumer`; `shadcn add @coss/agent-approval --yes` against the local registry | Installed all six source files and npm dependencies without workspace links |
| Consumer: `bunx --no-install tsc --noEmit` and `bun build ./src/check.tsx --outdir ./dist --target browser` | Passed for the group card, ref, custom frame render, and composed group actions |
| Consumer: `bun ./render-check.tsx` with real React server rendering | Passed: empty group output, all-disabled buttons, accessible group association, and retained item titles |

Browser checks covered approval, disabled actions after a decision, reset, keyboard rejection, dark desktop layout, and light layout at 375px. Item context wraps without document horizontal overflow. The preview was returned to its ready state, with the viewport override removed and original dark theme restored.

Limits: one browser engine, no screen-reader session or physical touch-device check. The public registry is not deployed. Real execution and failure recovery remain application responsibilities; the retry eligibility contract was tested independently of a backend.

Next bounded action: review grouped approvals. Increment 3 (messages and actions) is not started.

### Increment 3: messages and actions — 2026-09-21

Branch: `codex/agent-ui-approval`. No commit, publication, or Cal migration performed.

Public surface and decisions:

- `@coss/agent-message`: `AgentMessage`, `AgentMessageContent`, `AgentMessageText`, and `AgentMessageTimestamp`. Source: `apps/ui/registry/default/ui/agent-message.tsx`.
- `@coss/agent-message-actions`: `AgentMessageActions`, `AgentMessageAction`, and `AgentMessageCopyAction`. Source: `apps/ui/registry/default/ui/agent-message-actions.tsx`. Actions are independently installable; message content does not bring in Button or Tooltip.
- `author` determines user/assistant styling, leaving native `role` available. The root defaults to an article role. Native refs, attributes, and direction are forwarded.
- Content and actions are separate composable children. A generic labeled icon action covers application-owned edit, save, and retry behavior; a specialized edit API is unnecessary.
- Actions use a labeled group with ordinary Tab navigation. The row reserves its layout space, reveals on hover/focus, and stays visible for coarse pointers. `alwaysVisible` supports the latest response. Coarse-pointer controls are 44px to avoid overlapping compact hit areas.
- Copy owns a small clipboard lifecycle: guard empty/disabled/pending writes, announce success or failure, reset success after two seconds, allow retry, and invalidate pending feedback on payload changes or unmount. Required labels remain caller-provided. The existing general copy hook is unchanged because it does not expose the failure and pending behavior this action needs.
- Optional text disclosure accepts plain strings, measures a 240px preview, and supports controlled or uncontrolled expansion. Streaming exposes all content temporarily and preserves the expanded preference. Rich children remain in the untruncated content part, avoiding clipped focusable controls. There is no conversation-scroll context dependency.

Examples and documentation:

- `p-agent-message-1`: a brief user request and a two-paragraph email response with copy.
- `p-agent-message-2`: a longer workshop request with Show more / Show less.
- `p-agent-message-3`: a short suggestion with copy and a working local bookmark toggle. This demonstrates hover/focus actions without adding an edit form or fake backend.
- `apps/ui/content/docs/agent-ui/agent-message.mdx`: installation, composition, actions, copy ownership, disclosure/streaming policy, timestamps, and API reference.
- Generated registry entries, particle index, navigation, and package mirrors are updated. Both families remain outside the default UI aggregate.

Visual comparison with Cal's local message source preserves the open assistant content, end-aligned user bubble (85% / 48rem cap), 14px typography, 12px horizontal / 8px vertical bubble padding, 8px content gap, compact ghost actions, and 240px text preview. Intentional differences: in-flow action rows instead of absolute positioning, 44px controls for coarse pointers, and an explicit copy-error state. No avatars, message panels, or feedback menus were introduced.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; 11 existing informational messages, none for the new files |
| `cd apps/ui && bun run registry:validate-deps` | Passed for 514 particles and 57 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 586 items generated |
| `cd apps/ui && bun run ui:sync` | Passed; both message source bodies match their package mirrors |
| `cd apps/ui && bun run typecheck` | Passed |
| `cd packages/ui && bun run typecheck --tsBuildInfoFile /private/tmp/coss-message-ui.tsbuildinfo` | Passed |
| `cd packages/ui && bun test` | Existing suite: 23 passed, 49 assertions |
| `git diff --check` | Passed |
| Fresh consumer at `/private/tmp/coss-message-consumer`; local registry; `shadcn add @coss/agent-message @coss/agent-message-actions --yes` | Installed six source files and dependencies without workspace links; final generated files reinstalled with `--overwrite` |
| Consumer: `bunx --no-install tsc --noEmit` and `bun build ./src/check.tsx --outdir ./dist --target browser` | Passed for message composition, native refs/role/direction, timestamps, controlled disclosure, and both action types |
| Consumer: `bun test ./behavior.test.tsx` | 11 mounted React tests passed, 30 assertions, using Happy DOM only in the temporary consumer |

The isolated behavior tests cover short/overflowing content, resize notification, uncontrolled and controlled disclosure, form-submit prevention, streaming preference restoration, exact clipboard payload, success announcement/reset, failed and unavailable clipboard access, retry, pending duplicate prevention, stale completion after a text change, empty/disabled actions, and unmount cleanup. DOM layout height is supplied by the test fixture; real wrapping and clipping were checked in the browser. This test harness remains temporary validation material, not new repository test infrastructure.

Browser verification: desktop dark preview and 375px dark/light layouts; copy success feedback; Tab revealing a hidden action row; Space toggling bookmark state; Enter expanding text; collapse restoring focus with a 240px preview. Neither document nor message content overflowed horizontally at 375px. Generated coarse-pointer CSS was inspected for visible actions, pointer access, and 44px controls, including precedence over desktop button sizing. The viewport override was removed and dark theme restored.

Limits: one browser engine; coarse-pointer CSS inspection does not replace a physical touch-device test. No screen-reader session was run. Clipboard rejection/races were tested with a controlled clipboard implementation in the consumer. Public deployment, real AI streaming, and conversation scrolling remain outside this increment.

Next bounded action: review messages and actions. Increment 4 (conversation viewport and jump-to-latest) is not started.

### Increment 4: conversation viewport — 2026-09-22

Branch: `codex/agent-ui-approval`. No commit, publication, or Cal migration performed.

Public surface and decisions:

- Added `@coss/agent-conversation`, exporting `AgentConversation`, `AgentConversationScrollButton`, `AgentConversationTimestamp`, and the `AgentConversationHandle` type. Source: `apps/ui/registry/default/ui/agent-conversation.tsx`; mirror: `packages/ui/src/components/agent-conversation.tsx`.
- The conversation owns a labeled, keyboard-focusable scroll region using the existing Base UI scroll-area primitives and coss scrollbars. Direct viewport/content refs replace Cal's DOM queries. Native outer props and ref are forwarded.
- Starts at the latest content, follows parent-appended content, and observes descendant/viewport resizing. Scrolling away pauses following; scrolling within 24px of the bottom resumes it. The built-in arrow jumps immediately, resumes following, and restores focus to the viewport before the button disappears.
- `apiRef` exposes `scrollToLatest()` and `pauseFollowing()`. The API jump preserves focus. Call pause before user-initiated disclosure changes; message components remain independent of the conversation implementation.
- The scroll offset is preserved while reading. Prepending history, reordering content, virtualization, and identity-based message anchoring are explicitly outside this contract. Switching sessions uses a React key.
- No automatic live-region announcements or smooth scrolling. The application owns streaming announcements and message state.
- Added `p-agent-conversation-1`: a short scheduling exchange, one Add reply control, and a separate Reset demo control beneath a divider. A 288px conversation fits the standard 450px preview without introducing another scrolling container.
- Added `apps/ui/content/docs/agent-ui/agent-conversation.mdx`, navigation, registry metadata/payloads, and the particle index. The entry remains optional and does not install message components or join the default UI aggregate.

Visual comparison with Cal's local conversation source preserves its 32px message gap, scroll fades, quiet scrollbars, and end-aligned circular arrow 16px from the bottom and side. Intentional differences: explicit content padding (16px by default), direct viewport focus after a keyboard jump, and a 44px arrow on coarse-pointer devices. Cal's session-transition transform is omitted because it belongs to the surrounding application.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; 11 existing informational messages, none for the new component |
| `cd apps/ui && bun run registry:validate-deps` | Passed for 515 particles and 58 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 588 items generated |
| `cd apps/ui && bun run ui:sync` | Passed; package component body matches registry source |
| `cd apps/ui && bun run typecheck` | Passed |
| `cd packages/ui && bun run typecheck --tsBuildInfoFile /private/tmp/coss-conversation-ui.tsbuildinfo` | Passed |
| `cd packages/ui && bun test` | Existing suite: 23 passed, 49 assertions |
| `git diff --check` | Passed |
| Fresh React 19 / Tailwind 4 consumer at `/private/tmp/coss-conversation-consumer`; local registry; `shadcn add @coss/agent-conversation --yes` | Installed five source files and dependencies without workspace links |
| Consumer: `bunx --no-install tsc --noEmit` and `bun build ./src/check.tsx --outdir ./dist --target browser` | Passed for root/API/button refs, direction, timestamp, and standalone jump composition |
| Consumer: `bun test ./behavior.test.tsx` | 10 mounted React tests passed, 26 assertions |

Consumer tests cover initial/empty positioning, parent updates, descendant resizing, preserving a reading offset, the 24px threshold, viewport resizing, explicit pause surviving a delayed scroll event, API focus preservation, built-in jump focus, session reset, and observer cleanup. Happy DOM uses supplied scroll geometry and resize callbacks; native scrolling was separately verified in the browser. The temporary consumer harness is validation material, not new repository test infrastructure.

Browser evidence:

- Initial content and adding a reply at the bottom both measured a zero bottom gap. After Home scrolled to the start, appending a reply preserved `scrollTop: 0`; Enter on the arrow returned to a zero gap with focus on the viewport.
- A temporary route verified empty → loaded content, local child growth without a parent update, and height changes from 320px to 220px while following. Each remained at the bottom.
- Growing a child or resizing the viewport while reading preserved the offset. Calling pause before expansion preserved the previous offset instead of following the new bottom.
- `AgentMessageText` expansion with the pause callback retained the reading offset; a keyed session change reset to the latest content. The temporary route was removed afterward.
- Narrow checks at 375px covered following and reading in dark/light themes. The final preview measured 450px client/scroll height (no second scrollbar), and the conversation's client/scroll widths matched. Restored the viewport override and original dark theme after verification.

Limits: one browser engine, no screen-reader session or physical touch-device testing. Real streaming transport, history pagination, and composer behavior remain outside this increment.

Next bounded action: review conversation scrolling. Increment 5 (plain composer) is not started.

### Increment 5: plain composer — 2026-09-22

Branch: `codex/agent-ui-approval`. No commit, publication, or Cal migration performed.

Public surface and decisions:

- Added `@coss/agent-composer`, exporting `AgentComposer`, `AgentComposerRoot`, `AgentComposerTextarea`, `AgentComposerActions`, and `AgentComposerSubmit`. Source: `apps/ui/registry/default/ui/agent-composer.tsx`; mirror: `packages/ui/src/components/agent-composer.tsx`.
- The convenience component and composed parts share the same controlled draft and submission eligibility. A send requires non-whitespace text, enabled/idle state, and no active composition. Enter and the arrow use the same send callback; busy Enter cannot bypass the button policy.
- `onSubmit(value)` receives the exact controlled text. The caller owns draft clearing, synchronous busy state, request execution, cancellation, and feedback. No promise lifecycle or implicit queue is inferred.
- Busy replaces Send with Stop while permitting the next draft to be edited. Disabled blocks input and both built-in actions, including Stop. Shift/modified Enter retain native behavior; repeat Enter and IME candidate confirmation cannot send.
- Native composition flags, composition lifecycle, and legacy key code 229 are guarded. Blur or disabling cannot leave composition permanently latched. Custom key handlers may prevent the built-in Enter behavior.
- Input refs, native textarea attributes, custom action slots, and composition are supported. No autofocus by default. The input group retains its existing styling slot and adds `data-agent-composer` for targeting.
- Textarea autosizing handles controlled edits and width changes, capped by a 192px coss scroll viewport. An edit/paste at the end reveals the caret after resizing; external value changes do not force focus.
- The optional queue presentation is deferred until a connected example establishes its policy. Busy submissions are blocked, not implicitly queued. Attachments and structured input remain outside this increment.
- `p-agent-composer-1` demonstrates an editable scheduling request and four seconds of local busy/Stop state. `p-agent-composer-2` demonstrates a working Use example action and native 280-character limit. Feedback and reset rows remain outside the composer.
- Added `apps/ui/content/docs/agent-ui/agent-composer.mdx`, navigation, category, registry metadata/payloads, and particle index. The registry entry is optional and does not join the default UI aggregate.

Visual comparison with Cal's local composer source preserves the InputGroup surface, padded plain textarea, 192px scroll cap and fades, bottom action row, circular send arrow, and square Stop glyph. Intentional differences: empty sends are disabled, no default autofocus, matching keyboard/button eligibility, and 44px controls for coarse pointers. The extraction omits Cal's footer frame, header/hint helpers, and custom editor replacement API; native composition and action slots cover this bounded plain-text increment.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; 11 existing informational messages, none for the new component |
| `cd apps/ui && bun run registry:validate-deps` | Passed for 517 particles and 59 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 591 items generated |
| `cd apps/ui && bun run ui:sync` | Passed; package component body matches registry source |
| `cd apps/ui && bun run typecheck` | Passed |
| `cd packages/ui && bun run typecheck --tsBuildInfoFile /private/tmp/coss-composer-ui.tsbuildinfo` | Passed |
| `cd packages/ui && bun test` | Existing suite: 23 passed, 49 assertions |
| `git diff --check` | Passed |
| Fresh React 19 / Tailwind 4 consumer at `/private/tmp/coss-composer-clean`; local registry; `shadcn add @coss/agent-composer --yes` | Installed nine source files and declared dependencies without workspace links |
| Consumer: `bunx --no-install tsc --noEmit` and `bun build ./src/check.tsx --outdir ./dist --target browser` | Passed for convenience/composed APIs, input-group/textarea/button refs, direction, and native input props |
| Consumer: `bun test ./behavior.test.tsx` | 15 mounted React tests passed, 41 assertions |

The isolated tests cover exact submission text, keyboard/click parity, empty/whitespace drafts, disabled input/actions, busy send prevention, Stop, draft preservation across busy changes, modified Enter, repeat Enter, native and legacy IME signals, composition start/end, disabling during composition, custom key prevention, enclosing-form safety, compositional refs/policy, and native input props. The Happy DOM harness remains temporary validation material; IME checks use synthetic events rather than an operating-system input method.

Browser evidence: Enter → busy, typing a next draft during busy, blocked Enter without clearing that draft, Stop, Shift + Enter inserting a newline, disabled whitespace-only Send, custom example fill/send, and the character limit preventing further typed characters at 280. Long drafts grow past 500px inside the 192px viewport; after the caret correction a paste at the end measured a bottom gap below 1px. Native typing and scrolling remain usable. Programmatically assigned values can exceed native `maxLength`; application validation remains caller-owned.

Dark/light layouts at 375px showed matching composer client/scroll widths and 450px preview client/scroll heights, with no horizontal overflow or extra preview scrollbar. Both demos were reset, the viewport override removed, and the original dark theme restored.

Limits: one browser engine, no physical IME session, screen-reader session, or touch-device test. The demo's busy state is local; it does not establish working streaming or network cancellation.

Next bounded action: review the composer. Increment 6 (minimal connected conversation with real streaming, cancellation, and recoverable failure) is not started. Select its backend/integration explicitly when starting that increment.

### Increment 6 restart: minimal connected conversation — 2026-09-22

Scope: restart from the completed composer increment after the earlier implementation and layout revisions were reverted. This record describes the replacement only. No commit, publication, or Cal migration performed.

Reference and visual decisions:

- Re-read the Cal Agent UI documentation and local `apps/design-system/components/agent-ui-example.tsx`. Its full-page host shares `mx-auto w-full max-w-2xl px-3` between transcript and composer, uses `py-4 pb-8` on the transcript, and retains the 32px message gap. Also inspected the live message-actions composition and its source.
- The connected recipe uses one column, transcript `px-3 pt-4 pb-8`, and composer wrapper `px-3 pb-3`. Existing standalone primitives and particles are byte-for-byte unchanged from the pre-increment snapshot; no global padding removal.
- Demo content is one short meeting reminder plus an editable “Make it a little warmer.” follow-up. Open assistant text, muted user bubbles, compact copy action, and the existing Send/Stop composer are retained.
- Completion is only announced in a visually hidden status. Errors and Retry sit below the complete transcript/composer composition. Reset and the docs-only error trigger occupy a separate row beneath it.
- Intentional scope differences from Cal's complete experience: compact 480px host and two-row composer; no session header, page context, attachments, feedback, tools, timestamps, or queue. The docs wrapper grows to fit error and mobile control rows, avoiding a second scrollbar around the example.

Implementation:

- Optional `@coss/agent-chat` registry block: `apps/ui/registry/default/blocks/agent-chat/agent-chat.tsx` and `route.ts`. Installs the editable client at `components/agent-chat.tsx` and the Next App Router endpoint at `app/api/chat/route.ts`.
- AI SDK 7.0.109 and React integration 4.0.112 are explicit integration dependencies. Presentation primitives and the default UI aggregate acquire no SDK dependency. Added a blocks registry list and block import recognition in dependency validation.
- The recipe owns its in-memory draft and SDK controller. A synchronous request guard prevents duplicate sends; busy drafting is permitted. Stop aborts, preserves partial text and the next draft, and restores input focus. Retry regenerates the failed turn without duplicating the user message or discarding an unsent draft. Unmount aborts an active request.
- The model route uses server-only `AI_MODEL` and gateway credentials, validates text-only user/assistant messages, bounds history/text length, forwards cancellation, and sanitizes streamed errors. Application authentication, authorization, rate limits, and request budgets remain consumer responsibilities.
- The separate documentation endpoint streams deterministic text over real HTTP without credentials or model calls. It supports a one-request partial failure for Retry verification. Its sample nature is stated beneath the preview.
- `renderResponse` supports an optional rich renderer. The docs demonstrate separately installed `react-markdown` with raw HTML skipped and default URL filtering. No Cal sanitizer or rich-renderer dependency enters the primitives.
- Docs: `apps/ui/content/docs/agent-ui/connected-conversation.mdx`. Preview: `http://localhost:4000/ui/docs/agent-ui/connected-conversation`. The documentation app exposes its configured base path to the sample transport; consumers default to `/api/chat`.

Verification performed:

| Command / check | Outcome |
| --- | --- |
| `cd apps/ui && bun run format:all` | Passed; 11 existing informational lint messages |
| `cd apps/ui && bun run registry:validate-deps` | Passed; 518 particles and 59 UI components |
| `cd apps/ui && bun run registry:build` | Passed; 593 registry items |
| `cd apps/ui && bun run typecheck` and `bun run lint` | Passed |
| Fresh React 19 / Tailwind 4 consumer at `/private/tmp/coss-chat-restart`; `shadcn add @coss/agent-chat --yes` against local registry | Installed 14 files and declared dependencies, without workspace links |
| Consumer `bunx --no-install tsc --noEmit` and browser bundle | Passed |
| Consumer `bun test ./behavior.test.tsx` | 9 passed, 36 assertions: duplicate-send guard, exact text, busy drafting, Stop before/during streaming, retry before/after partial text, post-error send, empty send, unmount abort |
| Consumer `bun test ./route.test.ts` | 7 passed, 15 assertions: missing config, malformed/unsupported/bounded input, actual SDK stream pipeline with a controlled model, provider abort signal, sanitized streamed error |
| Consumer optional `react-markdown@10.1.0` and `bun test ./markdown.test.tsx` | 3 passed, 7 assertions: rendered formatting, skipped HTML/unsafe link filtering, escaped default text |
| Browser: HTTP streaming, busy Enter, Stop, partial error, Retry | Passed; partial text and next draft preserved; Retry retained two user messages in the seeded scenario rather than adding a duplicate |
| Browser: desktop and 375px layouts, dark/light | Message and composer edges matched. Desktop: both 488px wide. At 375px: both 254px wide. Mobile preview client/scroll widths both 326px; normal height/scroll height both 641px; error height/scroll height both 713px. Error was below the composer. Temporary viewport override removed and dark theme restored |
| Baseline comparison of earlier registry component/particle sources | No earlier files changed; `ui:sync` not needed |
| `git diff --check` | Passed |

Limits: browser checks used one engine, not physical touch/IME or a screen reader. The optional Markdown integration is basic CommonMark rendering, not a specialized streaming parser. Behavioral test harnesses remain temporary consumer validation material. The live-provider smoke test is still unverified; neither the deterministic preview nor the controlled model establishes production readiness.

Next bounded action: review the connected composition and integration API. Do not start increment 7 until continuation is authorized. A configured live-provider check remains part of integration validation before release.

### Increment 6 review: inset viewport and scrollbar clearance — 2026-09-22

User requested at least 4px more message padding on each side and asked whether the scroll area should sit within the content column with a padding prop. Rechecked both coss and Cal ScrollArea source: neither exposes `padding`; both already implement optional `scrollbarGutter` on the viewport.

- Moved the connected recipe's 12px horizontal inset to the shared transcript/composer parent. The scroll viewport itself now matches the composer width, bringing its scrollbar inside that column.
- Added 4px of message padding inside the viewport using `contentClassName="px-1 pt-4 pb-8"`. This gives a total 16px inset from the host before scrollbar clearance.
- Exposed `scrollbarGutter?: boolean` on `AgentConversation`, defaulting to false, using the same conditional logical end/bottom padding as ScrollArea. The connected recipe opts in; standalone conversation behavior remains unchanged. No new `padding` prop or change to the general ScrollArea API.
- On vertical overflow the viewport reserves another 10px at the inline end. This is scrollbar clearance, separate from the symmetric 4px message padding. Updated conversation API docs, connected-layout docs, generated registry, and package mirror.
- Desktop measurements: viewport and composer both 488px; messages inset 4px on both sides without overflow. With overflow, message end at 945px, scrollbar starts at 949px and ends at 955px, viewport/composer end at 959px.
- At 375px, viewport/composer both 254px, message insets 4px start / 14px end with the active gutter; viewport client/scroll widths both 254px and outer preview client/scroll widths both 326px. Streaming stayed at the bottom; keyboard scrolling and jump-to-latest returned within 1px of the bottom. Restored the initial demo and normal viewport.
- Verification: required `format:all`, `registry:validate-deps`, `registry:build`, `ui:sync`, and app typecheck passed. Updated the independent consumer through `shadcn add @coss/agent-chat --yes --overwrite` and checked TypeScript. No new tests added for this layout-only change. `git diff --check` passed.

Increment 6 remains at its review checkpoint. No later increment started.

### Increment 6 alignment clarification — 2026-09-22

The user clarified that transcript viewport and composer must have identical outer widths, messages must have exactly 4px extra padding on both sides, and the scrollbar should remain aligned to the parent viewport. Removed the connected recipe's `scrollbarGutter` opt-in, which previously added an asymmetric 10px end inset. The optional conversation prop remains available but defaults to false.

Browser verification with overflowing content: both containers measured 488px with identical edges; message padding measured 4px left and 4px right. Reset the demo afterward. Formatting, dependency validation, registry build, app typecheck, and `git diff --check` passed. This supersedes the previous gutter-enabled example layout.

### Increment 6 scrollbar overlap correction — 2026-09-22

User explicitly requested scrollbar clearance using the ScrollArea prop. Enabled `scrollbarGutter` on the connected conversation. The outer viewport and composer still share identical edges; the message content retains 4px padding on both sides, with a separate conditional 10px gutter at the scrollbar end. This supersedes the preceding gutter-disabled decision.

Browser verification with overflowing content: outer edges matched, message right edge was 945px, scrollbar started at 949px, leaving 4px clearance. Reset the preview. Formatting, dependency validation, registry build, typecheck, and `git diff --check` passed.

### Increment 6 long-transcript overflow fix — 2026-09-22

Reproduced the extra preview scrollbar by submitting four 20-line messages. Although the conversation viewport remained 340px tall, its outer container exposed 2753px of scrollable overflow, inflating the preview wrapper's scroll height to 2806px.

Made the conversation viewport `relative` so it establishes the containing block for positioned descendants and contains their scrollable overflow. No preview-level overflow suppression or changes to the agreed padding/gutter were needed. With the same transcript, the outer conversation's client/scroll height both became 340px and the preview's both became 640px.

At 375px, tested the long transcript alongside a 40-line unsent draft: preview client/scroll height both 641px, conversation viewport 231px with 5216px internal content, composer viewport 192px with 1949px internal content. No horizontal overflow; jump-to-latest reached a zero bottom gap and preserved all 40 draft lines. Reset the example and restored the viewport.

Required formatting, registry dependency validation/build, package sync, app typecheck, and `git diff --check` passed. This is a conversation viewport fix; no new public API or later increment.

## References

- [Cal Agent UI documentation](https://cal-design-system.vercel.app/docs/composites/agent-ui)
- [Cal embedded-agent playground](https://cal-design-system.vercel.app/playground/ai-agents/app-page)
- [Cal presentation source](https://github.com/calcom/cal/tree/main/packages/ai/src/react/ui)
- [AI Elements](https://elements.ai-sdk.dev/)
- [assistant-ui architecture](https://www.assistant-ui.com/docs/architecture)
- [prompt-kit](https://github.com/ibelick/prompt-kit)
- [coss agent guidelines](/Users/pasqualevitiello/Main/Job/Projects/Gits/coss/apps/ui/AGENTS.md)
- [coss contribution workflow](/Users/pasqualevitiello/Main/Job/Projects/Gits/coss/apps/ui/CONTRIBUTING.md)

The preceding conversation contains the detailed comparative audit. This document is the execution reference; later source verification and recorded implementation decisions take precedence over the initial audit.


### Increment 7 — status and tool activity — 2026-09-22

Ready for review. No commit, publication, or Cal migration performed.

- Added optional `@coss/agent-status-indicator` and `@coss/agent-tool-activity` entries, package mirrors, two particles, and documentation pages. Neither is included in the default UI aggregate or depends on AI SDK.
- Compared Cal's status, activity, disclosure, and adapter source with its design-system preview. Preserved 12px labels, 14px icons, 6px gaps, muted group summaries, 20px row indentation, and the active shimmer.
- `AgentToolActivityGroup` uses coss Collapsible and accepts its controlled/uncontrolled contract. State changes preserve the reader's disclosure choice. `AgentToolActivityRow` accepts arbitrary children and an optional icon; `null` removes the icon.
- The example maps running, completed, declined, failed, mixed, and unknown states explicitly. Mixed summaries include every outcome. Unknown tools retain a visible name and generic icon, including when their runtime state is recognized.
- Intentional improvements: wrapping summaries and long rows, coarse-pointer minimum target, reduced-motion and forced-color fallbacks, native props/refs, and no live region nested in the disclosure button. Standalone status uses one polite live region without deferring active announcements with aria-busy.
- The demos use short calendar fixtures. Their controls sit below the example. They perform no calendar access or tool execution.

Verification:

- From `apps/ui`: `bun run format:all`, `bun run registry:validate-deps` (520 particles, 61 primitives), `bun run registry:build` (597 entries), `bun run ui:sync`, `bun run typecheck`, and `bun run lint` passed. Lint reports informational notices only.
- Isolated consumer: `/private/tmp/coss-activity-consumer`; `bunx shadcn add @coss/agent-tool-activity --yes` installed both families and their declared dependencies. Consumer TypeScript, browser bundling, and eight mounted behavioral tests cover controlled/uncontrolled disclosure, updates preserving choice, disabling, native props/refs, and announcement semantics.
- Browser: all six status selections and six tool scenarios inspected; Enter and Space toggle disclosure; a collapsed group stays collapsed through updates. Light/dark presentation inspected. At 375px, activity content width and scroll width both measured 278px, without horizontal overflow.
- Limits: reduced-motion/forced-colors and RTL rules were source-reviewed, not exercised with browser preference emulation or a screen reader. Mounted tests emit asynchronous Base UI act warnings. The examples are deterministic fixtures, not a live tool integration.

Next bounded action after review: increment 8, reasoning disclosure. Preserve Cal's appearance, expose controlled/uncontrolled state, and verify streaming transitions respect user choice. Do not start feedback or embedded-assistant work in that increment.


### Increment 8 — reasoning disclosure — 2026-09-22

Ready for review. No commit, publication, or Cal migration performed.

- Added optional `@coss/agent-reasoning`, its registry-generated package mirror, `p-agent-reasoning-1`, and an Agent Reasoning documentation page. Installation depends on the existing status, collapsible, and utility entries; no AI runtime dependency and no inclusion in the default UI aggregate.
- Read Cal's reasoning and disclosure source. Preserved the compact status trigger, chevron, 20px content indentation, 8px top spacing, 12px relaxed text, preserved line breaks, and muted foreground. Reused the activity trigger's wrapping, logical direction, focus, and coarse-pointer treatment.
- Supports Base UI controlled `open` / `onOpenChange` and uncontrolled `defaultOpen`. The initial uncontrolled default is `defaultOpen ?? isStreaming`, captured once. Text updates, completion, and later streams preserve the reader's choice.
- Intentional policy change: removed Cal's automatic reopen and one-second completion close. The component never schedules an automatic close; applications needing that behavior own it through controlled state. This is explicit in the docs.
- Simple three-stage fixture: Add detail, Finish, Restart. Controls stay below the preview content. Restart changes the fixture without remounting the disclosure. No model request is implied.

Verification:

- From `apps/ui`: `bun run format:all`, `bun run registry:validate-deps` (521 particles, 62 primitives), `bun run registry:build` (599 entries), `bun run ui:sync`, `bun run typecheck`, and `bun run lint` passed. Lint has 11 informational notices and no errors. `git diff --check` passed.
- Fresh consumer `/private/tmp/coss-reasoning-consumer`: installed `@coss/agent-reasoning` through the local registry, then passed TypeScript and browser bundling.
- Ten mounted consumer tests passed: initial completed/streaming defaults, explicit open/closed defaults, reader choice through updates/completion/restart, no delayed close after completion, later streaming not reopening, controlled intent, disabling, refs/direction, and busy/live-region semantics.
- Browser: Enter closes, Space opens; completion leaves the chosen state intact; restarting preserves an expanded section. Inspected desktop dark and 375px light layouts. At 375px, component client/scroll widths both measured 278px. Content computed as 12px text, 19.5px line-height, and 20px start padding.
- Reduced-motion checks: verified emitted media rules disable shimmer animation and background gradient, restore readable text color, and disable panel/chevron transitions. No OS preference emulation or screen-reader session was performed.

Next bounded action: review reasoning. Increment 9 is optional response feedback; decide whether it belongs in the release before implementation. It is not automatically authorized by completing reasoning.


### Increment 10a — panel and action-bar foundation — 2026-09-22

The user accepted deferring optional feedback (increment 9) and splitting increment 10 into smaller reviewable steps. Only the panel and launcher foundation is implemented here. No commit, publication, or Cal migration performed.

- Added optional `@coss/agent-panel` and `@coss/agent-action-bar` entries, package mirrors, `p-agent-panel-1`, and the Agent Panel documentation page. Neither entry is in the default aggregate or depends on an AI runtime.
- Read Cal's panel and action-bar source. Preserved the header's 12px horizontal / 8px vertical padding, compact ghost icon actions, fixed composer slot with 12px horizontal/bottom spacing, and muted launcher treatment. Panel surfaces and positioning remain caller-owned.
- Panel forwards native section props and refs. Close/minimize are intent callbacks. Full-page navigation renders a link when a URL is provided, otherwise a button when a handler is provided; an unavailable action is omitted instead of displaying an inert control.
- Action bar uses coss Toolbar rather than a div with a toolbar role, giving composed controls roving focus. Only the launcher is extracted in this step. Session chips, menus, unread state, history, page context, and full-page continuity remain pending.
- The focused recipe keeps one local draft and message list outside the panel, preserving both when hidden. Hide returns focus to the launcher; launch focuses the composer. Send appends a local user message only; no assistant response, booking, or backend is simulated.
- Preserved the approved alignment: conversation viewport and composer share their edges, message content adds 4px inside each side, and scrollbar gutter is enabled. The panel does not introduce another scroll container.

Verification:

- `apps/ui`: `bun run format:all`, `bun run registry:validate-deps` (522 particles / 64 primitives), `bun run registry:build` (602 entries), `bun run ui:sync`, `bun run typecheck`, and `bun run lint` passed. Lint reports 11 informational notices. `git diff --check` passed.
- Fresh consumer `/private/tmp/coss-panel-consumer`: installed both entries from the local registry, passed TypeScript and browser bundling. Nine mounted tests passed for native props/ref, distinct intent callbacks, omitted unavailable actions, full-page callback/link precedence, optional composer, launcher form safety, disabling, and toolbar arrow-key focus.
- Browser: draft survives minimize/reopen; sent message survives close/reopen; focus returns to launcher and then composer. At desktop the transcript/composer edges both measured 397.5–819.5px; at 375px both measured 54–306px.
- A 25-line message produced internal transcript overflow (276px viewport / 1292px scroll height) while panel client/scroll height remained 478px and client/scroll width remained 276px. No panel overflow. Inspected desktop dark and narrow light presentation; restored theme and viewport afterward.
- Limits: this is a single local conversation shell, not the complete embedded-assistant integration. No session switching, routing continuity, persistence, mobile session dock, or live-provider verification was performed. Coarse-pointer styling is present but was not tested on physical touch hardware.

Next bounded action after review: increment 10b, session controls and switching with explicit per-session message/draft ownership. History, page context, and panel/page transitions should remain separate review checkpoints. Optional feedback stays deferred unless explicitly requested.

### Increment 10a review — panel scrollbar placement — 2026-09-22

User requested the scrollbar near the panel edge, matching Cal. Moved the example's horizontal inset from the conversation wrapper into its content: full-width viewport with `px-4` message content, while the composer retains its 12px inset. This supersedes the earlier viewport/composer edge alignment for the panel recipe; message positioning remains inset by 16px and scrollbar gutter remains enabled. Updated the panel documentation.

Verified with overflowing messages in the browser: panel and viewport right edge both 831.5px; scrollbar right edge 827.5px (4px inside the panel); content start padding 16px. Panel client/scroll heights remain 478px, with scrolling confined to the transcript. Format, dependency validation, registry build, and typecheck passed. Shared conversation/composer primitives are unchanged.


### Increment 9 — response feedback — 2026-09-22

User explicitly requested implementation. This supersedes the prior feedback deferral, which incorrectly generalized uncertainty about approval-demo feedback to response ratings.

- Added optional `@coss/agent-response-feedback`, package mirror, focused response demo, documentation, and generated registry. No automatic addition to approvals, messages, composer, or default aggregate.
- Preserved Cal's compact ghost thumbs, selected accent, dialog header, outlined reason toggles, details field, and Cancel/Submit arrangement. Native props/ref and an internal tooltip provider permit independent installation.
- Positive submits immediately; negative opens a dialog. Reasons and details are optional (`reasons=[]`, `showDetails=false` supported). Selecting the current rating submits null to clear it. Controlled `value` remains caller-owned; uncontrolled selection commits only after success.
- Synchronous in-flight guard prevents duplicate submissions. Pending state blocks rating/form controls and dialog dismissal. Failed saves retain the existing rating and negative draft for retry. Cancel resets unsaved fields; dialog close explicitly restores focus to the negative button.
- Replaced the global-toast dependency with inline localized errors and a polite success announcement. Callback resolves for success or rejects for failure; application owns persistence and request timeout/cancellation.
- Demo uses a short scheduling response and a local delayed save, with a separate Fail next save control. No feedback is transmitted externally.

Verification: required format, dependency validation (523 particles / 65 primitives), registry build (604 items), package sync, app typecheck, and lint passed. Fresh consumer installation, TypeScript and browser bundle passed. Eight mounted tests passed for selection/clearing, same-tick duplicate guards, failed-clear recovery, controlled value, disabled controls, omitted optional fields, negative failure/retry, and pending duplicate/dismissal guards. Browser verified failed negative save preserves reason/details, retry saves and restores focus, and Cancel clears the draft on reopening; narrow dialog inspected.

Retained the consumer test harness and reproduction instructions in `docs/plans/validation/agent-response-feedback/`. It runs against installed registry output; it is not wired into repository CI. Base UI emits asynchronous act warnings in the DOM harness. No screen-reader, physical touch, or real feedback service was tested. Earlier verification gaps remain as listed in the current audit.

Next: review response feedback. Resume increment 10b only after authorization; no session controls were implemented in this step.

### Feedback error treatment review — 2026-09-22

Reused `AgentStatusIndicator` with `status="error"` for both direct rating-save failures and dialog submission failures. Each sits inside one `role="alert"` with `announce={false}` to avoid nested live regions; long labels wrap. Added the registry dependency and updated docs/generated output/package mirror. Format, dependency validation, registry build, package sync, typecheck, and diff check passed. Browser confirmed the error indicator and absence of nested live regions in the direct-save alert.

### Shared status reuse in examples — 2026-09-22

Replaced plain status text in the three approval and two composer examples with AgentStatusIndicator. Approved/submitted uses complete; skipped/stopped uses neutral idle; pending composer uses working. Existing stable live-region wrappers and parent gap-4 layouts remain, with no nested announcements or new margins. Connected chat uses thinking while awaiting a response and an error indicator inside the existing alert; its error and Retry button now use a gap-3 column below the conversation, separated through the outer parent's gap-3. Completion stays screen-reader-only. Registry dependencies updated. Format, dependency validation, registry build, typecheck, and diff check passed; browser exercised the composer working indicator.

### Composer status placement correction — 2026-09-22

User identified the standalone composer status as out of context. Removed status messages and their reserved space from both composer examples, along with their indicator dependencies. The first demo demonstrates busy state through Send/Stop; the second demonstrates composition and character count. This supersedes the composer portion of the shared-status reuse entry. Other status placements are unchanged. Formatting, dependency validation, registry build, and typecheck passed.

### Composer demo scope correction — 2026-09-22

Removed the invented second composer demo (example-fill action and character counter), its registry entry and generated artifact. The remaining preview demonstrates appearance/text editing only, without fake processing, draft clearing, or a reset footer. Its height fits its content. Documentation directs users to the connected conversation for Send/Stop and streaming; composition APIs remain documented without an invented product flow. Formatting, registry dependency validation/build, and typecheck passed.

### Connected response-error placement — 2026-09-22

Moved the response failure indicator and Retry into the transcript after the interrupted answer (or user prompt when no answer exists). Their spacing uses a gap-3 column; no added horizontal inset inside the message content. This supersedes earlier below-composer error placement. Browser triggered a partial failure and confirmed both error and Retry inside the transcript, followed to the bottom within 0.5px. Formatting, dependency validation, registry build, typecheck, and diff check passed.

### Connected submission scroll flash — 2026-09-22

Reproduced by sampling browser scroll/content measurements during submission: transcript height changed 340 → 384 → 340 → 388px, with scrollTop 0 → 44.5 → 0 → 48.5px. The Thinking placeholder disappeared at stream start before the first text delta, temporarily shrinking the transcript. Kept it visible through submitted/streaming until the last assistant message has actual text. Repeated browser sampling showed 340 → 384 → 388px and scrollTop 0 → 44.5 → 48.5px with no intermediate reset. Format, dependency validation, registry build, and typecheck passed. No scroll timing hacks or shared primitive changes.

### Connected user-message actions — 2026-09-22

Compared Cal's PromptMessage and conversation edit reducer. Added Copy and Edit beneath user bubbles using the existing action primitives and their hover/focus/coarse-pointer behavior. Edit restores the prompt into the composer and removes that prompt and later turns, replacing the current draft; pending requests block edits. Clears prior request errors and restores composer focus without browser scrolling. Documented this application policy and declared the icon dependency. Browser keyboard activation confirmed restored prompt, removed subsequent turns, and textarea focus. Format, dependency validation/build, and typecheck passed.


### Composition guidance — 2026-09-22

Added Building an Agent UI as the first Agent UI documentation page and linked it from the connected recipe. It identifies the connected conversation as the starting point, distinguishes runtime and application ownership, explains the two approved scrollbar/padding layouts, and places optional status, tool, reasoning, approval, and feedback components in context. It explicitly distinguishes the panel's local demo from a model integration and documents the current text-only transport boundary.

This is a documentation increment, with no new component or runtime behavior. Next review checkpoint: inspect the guide, then run an independent coding-agent exercise using only consumer-facing documentation and registry output. That exercise has not yet been performed; release verification gaps remain open.

Verification: app TypeScript and `git diff --check` passed; the new documentation route returned HTTP 200 with the guide content, and all guide links to local documentation pages resolve to existing files.


### Design-engineering detail pass — 2026-09-22

Reviewed primitive source and focused examples for spacing, text rendering, status composition, and accessibility consistency. Fixed panel newline rendering and author labels, replaced demo margins with parent gaps, added status `wrap` to replace repeated internal selectors, aligned wrapped status icons to the first line, and corrected minor documentation/copy inconsistencies. See [the detail audit](agent-ui-detail-audit.md) for findings, retained design decisions, measured browser evidence, and outstanding coverage. Registry generation, package sync, app typecheck, and diff checks passed. No feature expansion or release claim.

### Long-content and RTL stress pass — 2026-09-22

A temporary, retained-source stress fixture exposed feedback reason and footer-label overflow at 375px. Controls now grow vertically and wrap bounded labels. Documented the explicit layout for combined Copy/Feedback so save errors preserve button-row alignment. Verified RTL bounds, disclosure keyboard activation, feedback Escape/focus restoration, and disabled semantics. Eight feedback consumer tests pass against regenerated source; registry checks, package sync, and app typecheck passed. The temporary app route was removed. See [fixture evidence](validation/agent-ui-stress/README.md) for measured results and remaining coverage.
