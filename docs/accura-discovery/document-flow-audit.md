# Accura Document Flow - Combined UX And Accessibility Audit

Date: 2026-11-02  
Surface: Desktop Document lifecycle  
Evidence: Six user-provided screenshots, the Accura kickoff PDF, the Document Module Screen Design PDF, and the live Accura component catalog

## Audit Scope

This audit covers the visible journey from Document List through Create/Edit, Review, Approved state, and Audit Trail. It evaluates hierarchy, information architecture, workflow clarity, task safety, responsive desktop risk, and accessibility risks visible from screenshots.

It does not claim implementation-level accessibility compliance. Keyboard order, screen-reader output, focus management, validation behavior, upload behavior, permission enforcement, electronic-signature authentication, and actual reflow could not be tested from screenshots alone.

## User Goal And Accessibility Target

The user must be able to find the correct document version, understand its state and current owner, complete only the actions allowed for their role, and leave a defensible signed history. The recommended target is WCAG 2.2 AA with complete keyboard support and status communication that does not rely on color alone.

## What Works

- The left navigation is stable and keeps the user oriented within a large multi-module product.
- Primary page actions are generally visible and use consistent placement.
- Controlled versus External Document is explained before the create form begins.
- The record detail layout keeps the document preview next to metadata and workflow context.
- The four-stage workflow makes progression easier to scan than a status badge alone.
- Approval decisions remain visible in a fixed bottom action bar while reviewing long content.
- The audit drawer preserves page context and displays state transitions in a useful newest-first sequence.
- Approved records expose revision, download, audit, and retirement lifecycle actions.

## Numbered Flow Review

### Step 1 - Find a document in the repository

Evidence: [01-document-list.png](evidence/01-document-list.png)  
Health: **Fair - understandable, but weak for high-volume daily work**

- Search and three quick filters are easy to discover.
- Repeated IDs representing parallel versions look like duplicate rows because versions are not visually grouped.
- The current counter says `52 documents`, but it does not say which rows are being shown after filtering.
- There is no visible reset, active-filter summary, saved view, row action, selection model, or indication of records awaiting the current user.
- Document Type and Department options conflict with the Create specification.
- The `Current version` line adds row height without clarifying parallel version relationships.

Recommendation: add task-oriented saved views (`Pending my review`, `My drafts`), active filter chips with reset, `Showing 1-10 of 52`, a visible/hover open action, an overflow menu for secondary actions, and a version-family treatment.

### Step 2 - Create a new document

Evidence: [02-create-document.png](evidence/02-create-document.png)  
Health: **At risk - clear grouping, but readiness is hidden below the fold**

- Category cards explain the difference between Controlled and External documents well.
- The two-column layout uses desktop space effectively at this viewport.
- The primary upload area receives more emphasis than required metadata and approval routing.
- Required routing fields appear lower in the narrow right rail, so the user can reach `Submit for Review` before seeing what is still missing.
- Page scrolling, panel scrolling, and the sticky bottom bar compete for vertical space; the footer can obscure the last fields.
- The effect of switching Document Category after entering data is not explained.

Recommendation: keep one consistent editor shell, but add a visible readiness summary and section navigation. Make the main column hold file/content and the supporting rail hold record setup; move task-critical missing items into a sticky `Ready to submit` panel rather than discovering them only on submit.

### Step 3 - Edit a Draft

Evidence: [03-edit-draft.png](evidence/03-edit-draft.png)  
Health: **Fair - good continuity, but editable and locked states need stronger semantics**

- Layout continuity between Create and Draft reduces relearning.
- Attachment metadata is captured close to the file it describes.
- The disabled Document Type looks close to an editable field and does not visibly explain why it is locked.
- Optional attachment Name and Description fields are compressed into one row.
- `Remove` is visually subtle for an action with data-loss consequences.
- Approval setup is again below the fold without a completion indicator.

Recommendation: use an explicit read-only field treatment with a lock explanation, stack attachment metadata at narrower desktop widths, confirm removal, and expose Draft completeness/autosave state near the title or action bar.

### Step 4 - Review and sign a document

Evidence: [04-review-document.png](evidence/04-review-document.png)  
Health: **Fair - strong task framing, but the review workspace is visually crowded**

- The document, workflow, metadata, and current decision actions coexist on one screen.
- The footer clearly states that both approval and rejection require an electronic signature.
- Future workflow steps already show `by Amit Kothari`, which can read as completed history rather than assignment.
- The document viewer, comment area, metadata rail, page, and footer create several nested regions that may be difficult at 1280px or browser zoom.
- Comments are represented as faint instructional text inside the preview and may be missed.
- It is not visually explicit whether the logged-in user is the active reviewer or merely allowed to view the record.

Recommendation: add a compact task banner (`Your review is required`, due date, role), distinguish `Completed by` from `Assigned to`, give comments a dedicated count/panel, and preserve the preview as the dominant reading surface.

### Step 5 - Manage an Approved document

Evidence: [05-approved-document.png](evidence/05-approved-document.png)  
Health: **Fair - lifecycle coverage is strong, action hierarchy is not**

- Effective Date and Approved state are visible in the record context.
- Download variants are explained instead of appearing as unlabeled files.
- Five header actions compete at the same hierarchy level.
- `Mark as Obsolete` uses a trash icon, which implies deletion instead of regulated retirement.
- The download menu is long and does not identify the normal/recommended artifact.
- The four-stage approval stepper no longer communicates later lifecycle states such as Superseded or Obsolete.

Recommendation: retain `New Version` as the primary lifecycle action, group Print/Download as utilities, move Audit and Obsolete to a labeled overflow or lifecycle menu, use an archive/retire metaphor, and show the approved record’s relationship to newer/superseding versions.

### Step 6 - Inspect the audit trail

Evidence: [06-audit-trail.png](evidence/06-audit-trail.png)  
Health: **Good foundation - readable chronology, incomplete verification detail**

- The drawer keeps the document in context and provides a clear newest-first chronology.
- State transition pills make before/after values scannable.
- Actor, timestamp, signature role, reason, and effective date are grouped coherently.
- `Signed` repeats as a high-emphasis badge and competes with the event meaning.
- The visible drawer does not show the cryptographic hash or verification details described in the specification.
- Timezone is hard-coded as GMT+7 in the screenshot; the intended tenant/user timezone behavior is unclear.
- Focus trap, return focus, keyboard close, and screen-reader event labels cannot be verified.

Recommendation: make the event verb the strongest label, treat Signed/Verified as supporting evidence, expose verification details progressively, provide timezone context, and ensure each event reads as one semantic timeline item.

## Highest-Impact UX Risks

| Priority | Risk | Why it matters | Recommendation |
|---|---|---|---|
| P0 | Requirements and data taxonomy conflict across screens | Incorrect type/department values can invalidate IDs, filtering, and routing | Define one authoritative schema before prototype fixtures |
| P0 | Role/action rules are not visible or documented as a matrix | A regulated user may see or attempt an invalid action | Create a status x role x action permission table |
| P0 | Electronic-signature behavior is not fully specified | This is the compliance boundary for every state transition | Define authentication, signature meaning, reasons, failure, and expiry states |
| P1 | Required routing and readiness are hidden below the fold | Users learn about missing work too late | Add section readiness and proactive validation |
| P1 | Parallel versions are visually indistinguishable from duplicates | Users may open or act on the wrong version | Group versions or label current/in-flight relationships explicitly |
| P1 | Detail actions have weak hierarchy | Utility, lifecycle, and destructive actions compete | Use one primary action plus grouped secondary/lifecycle actions |
| P1 | Nested scrolling threatens desktop reflow and zoom | Users can lose controls or context at smaller widths | Set one primary page scroll and deliberate sticky regions |
| P2 | Filters do not support task-based daily views | Users spend time reconstructing common queries | Add My Drafts / Pending My Approval / Effective Soon saved views |

## Accessibility Risks

- Status meaning appears to be reinforced by text, which is good, but contrast must be measured and status must remain understandable in grayscale and print.
- Placeholder text must not replace persistent labels, especially in the attachment, search, relation, and assignee fields.
- Disabled and read-only fields need distinct semantics and explanatory text.
- Row navigation and overflow actions need a predictable keyboard order without duplicative announcements.
- The document viewer, comment panel, metadata rail, sticky footer, modal, and drawer must not create focus traps inside focus traps.
- The audit drawer must move focus on open, expose a useful accessible name, close with Escape, and return focus to `View Audit Trail`.
- Workflow steps need completed/current/future semantics and must not rely on connector color.
- Electronic-signature errors must be announced inline and programmatically without clearing the user’s stated reason.
- At 200% zoom, the primary action and current task context must remain reachable without horizontal page scrolling.

## Recommended Prototype Architecture

Build the Document slice from three reusable page shells:

1. **Record List** - saved views, search, filter chips, version family, row-open affordance, and status-aware overflow actions.
2. **Record Editor** - consistent sectioned form with a main work area, supporting setup rail, sticky readiness summary, and safe Draft/Submit actions.
3. **Record Review/Detail** - dominant preview, compact workflow and task context, metadata/versions/relations tabs, role-aware decision bar, and audit drawer.

Cross-cutting reusable patterns:

- Workflow status with current blocker and pending person
- Electronic signature modal
- Audit timeline/drawer
- Status transition pill
- File uploader and attachment item
- Related/referred document picker
- Assignee picker
- Version family/history
- Validation and readiness summary

## Evidence Limits And Verification Gaps

- Screenshots show only populated, successful states.
- No empty, loading, no-results, error, permission-denied, upload-failure, signature-failure, or offline state was available.
- The actual demo was not available for keyboard, focus, hover, validation, drawer, menu, or responsive testing.
- The live catalog is a useful reference, but only Spinner, Sidebar, and Stepper were marked Stable on 2026-11-02; all other relevant templates/patterns require design and behavior verification before adoption.

