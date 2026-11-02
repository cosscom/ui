# Accura Product Knowledge Base

Created: 2026-11-02  
Last updated: 2026-11-02  
Product: Accura  
Domain: Electronic Quality Management System (eQMS) for life-science laboratories and manufacturing organizations

## 1. What - Product Or Feature

Accura is a multi-tenant eQMS intended to replace paper, spreadsheets, and disconnected document repositories with controlled, traceable quality workflows. The product should make regulated work understandable and efficient without removing the controls that prevent mistakes and preserve accountability.

### Key Features

| Feature | What it does | Status | Evidence |
|---|---|---|---|
| Documents | Creates, reviews, approves, versions, retires, and audits controlled and external documents | Current prototype / first design slice | Document screenshots and module specification |
| CAPA | Manages corrective and preventive actions, ownership, evidence, approvals, and closure | Prototype discussed | Kickoff transcript |
| Deviations | Records unplanned departures from an expected process and their investigation | Core planned module | Kickoff transcript |
| Change Management | Controls intentional process changes and their impact | Core planned module | Kickoff transcript |
| Training | Assigns recurring or onboarding learning against procedures | Core planned module | Kickoff transcript |
| Audit trail | Preserves who did what, when, why, and under which signature | Cross-module requirement | Kickoff transcript and screenshots |
| Electronic signature | Re-authenticates the actor and records the legal meaning of a regulated action | Cross-module requirement | Kickoff transcript and Document flow specification |

## 2. Who - Users And Context

### User Segments

| Segment | Goal | Context of use | Key behavior | Evidence |
|---|---|---|---|---|
| Quality practitioner / document author | Create an accurate controlled record and route it correctly | Daily operational work in a lab or manufacturing organization | Uploads files, completes metadata, assigns reviewers, fixes rejected drafts | Kickoff transcript and screenshots |
| Technical reviewer | Verify content and either approve or request changes | Assigned task with compliance accountability | Reads the source, comments, signs approval or rejection | Document flow specification |
| QA approver / quality manager | Perform final quality approval and set the record effective | Final gate before controlled use | Checks signatures, dependencies, effective date, and signs the decision | Kickoff transcript and Document flow specification |
| Organization administrator | Configure tenant, users, departments, terminology, and oversight | Initial setup and ongoing administration | Monitors overdue work and organizational status | Kickoff transcript |
| Quality consultant | Configure and validate the system, train customer teams, and endorse the product | Implementation and customer onboarding | Provides templates and helps organizations move from paper | Kickoff transcript |
| Auditor / inspector | Verify a defensible history of regulated decisions | Periodic internal or external inspection | Examines immutable event history, signatures, exports, and versions | Kickoff transcript and audit trail screenshot |

### User Mindset

Users are risk-aware and accountable. They want to complete work efficiently, but avoiding an incorrect or unverifiable action is more important than reducing every click. They expect the system to remember history, expose the current blocker, and make irreversible consequences explicit.

## 3. How - Mechanics

### Core User Flows

#### Document lifecycle

1. Open the Documents repository and locate a record by search, filter, status, department, type, version, or ownership.
2. Create either a Controlled Document or an External Document.
3. Upload the primary file, add up to five attachments, complete metadata, link related/referred documents, and assign reviewers and a QA approver.
4. Save a Draft or submit for review. Submission requires validation and an author electronic signature.
5. Technical reviewer reads the generated preview, comments if needed, then signs approval or rejection.
6. Approved review advances the record to In QA Approval; rejection returns it to Draft with a traceable reason.
7. QA approver performs the final check and signs approval or rejection. Approval creates the controlled PDF and sets the effective date.
8. An Approved record can be printed, downloaded, revised into a new version, viewed in the audit trail, or marked Obsolete by an authorized user.
9. When a new version becomes Approved, the previously approved version becomes Superseded while remaining available in history.

### Data, Integrations, And System Rules

- Document IDs follow `[ORG]-[TYPE]-[YEAR]-[6-digit sequence]`.
- Initial version is `v1.0`; a revision creates the next Draft version while the current approved version remains active.
- Core statuses are Draft, In Review, In QA Approval, Approved, Superseded, and Obsolete.
- Effective Date means the date an approved process/document becomes active, not an approval due date.
- An approve or reject action cannot be a one-click action. It requires re-authentication, a stated signature meaning, actor role, timestamp, and audit record.
- Audit history must be immutable and retained for the organization’s required period, described in the kickoff as potentially 10-20 years.
- Controlled documents use the review and QA lifecycle. External Document behavior is not yet fully defined.
- Tenant branding and subdomains are expected. Authentication is planned through Auth0.
- Generative AI is intentionally not part of the core regulated workflows at this stage. Predefined document templates are preferred.

### Technical Constraints Relevant To UX

- Primary target is desktop; the prototype must still reflow across practical desktop widths.
- Multiple internal scroll regions are visible in the current prototype and should be reduced or deliberately controlled.
- Compliance controls are product requirements, not optional friction to be removed.
- Domain terminology such as Effective Date, Deviation, CAPA, Related Document, and Referred Document should not be renamed without quality-domain approval.
- The same record-list, record-form, workflow, signature, and audit patterns should be reusable across modules.
- Current screenshots and PDFs describe expected behavior but include mock data and AI-generated analysis; final regulatory and state rules require confirmation from Amit and Chau.

## 4. Why - Business Logic

### Business Model

Accura is a B2B SaaS product for life-science organizations moving away from paper and spreadsheets. Quality consultants are a secondary channel: they can configure, validate, train, and recommend the system, but the everyday product is primarily for people working inside customer organizations.

### Current Priorities

1. Make the core workflows consistent and understandable across modules.
2. Preserve signature, audit, and lifecycle compliance requirements.
3. Show status, the current responsibility, and the person blocking progress.
4. Deliver a usable Documents vertical slice before expanding patterns to other modules.
5. Favor fast, validated workflow prototypes over premature coverage of every edge case.

### Decisions And Reasoning

| Decision | Why it was made | Evidence | Confidence |
|---|---|---|---|
| Use Documents as the first full prototype slice | Six current screens already cover list, form, review, approval, lifecycle, and audit patterns | User-provided screenshots and specification | High |
| Preserve explicit e-signature friction | Non-repudiation and regulated accountability require re-authentication | Kickoff transcript | High, legal details still need validation |
| Treat the COSS library as an implementation/design reference | It provides executable primitives and composition patterns while allowing Frontend to use another library later | User direction and COSS repository | High |
| Treat the Accura catalog as reference, not final truth | Only Spinner, Sidebar, and Stepper are marked Stable; most templates and components are In review | Live catalog inspected 2026-11-02 | High |
| Build a palette-only Accura adapter before choosing a visual direction | Brand and Zinc colors should skin the existing COSS semantic contract without replacing its typography, spacing, radius, status, chart, or component behavior | User direction confirmed 2026-11-02 | High |
| Avoid redesigning around color alone | Status and signed state must remain understandable without color and in exported/printed contexts | Regulated context and screenshot audit | High |

## 5. Features - Detailed Notes

### Document Management

- What it does: Controls the creation, review, approval, use, revision, retirement, and auditability of documents.
- Who uses it: Authors, reviewers, QA approvers, administrators, consultants, and auditors.
- Trigger: A new controlled process is authored, an existing record is migrated, an external reference is added, or an approved record needs revision.
- User goal: Produce or find the correct document version and know exactly what action is required next.
- Business goal: Replace paper-based quality processes with a defensible digital record.
- How it works: List -> create/edit Draft -> review -> QA approval -> Approved -> Superseded or Obsolete, with signed rejection loops back to Draft.
- UI/UX implications:
  - Always show current state, pending actor, and next valid action together.
  - Separate primary task actions from lifecycle and utility actions.
  - Keep metadata, relationships, version history, signatures, and audit trail accessible without crowding the main reading task.
  - Validate readiness before the user reaches the final Submit or Sign action.
- Edge states: empty list, no search results, upload failure, unsupported/large file, incomplete routing, reviewer unavailable, invalid signature, expired session, rejected Draft, parallel versions, future effective date, superseded version, obsolete record, and insufficient permission.
- Open questions: See Sections 7 and 8.

## 6. Competitors

| Competitor | Strength | Pain point solved | Pattern to learn from | What to do differently |
|---|---|---|---|---|
| Q-Pulse | Established eQMS presence, especially in Australia | Broad regulated quality coverage | Domain completeness | Avoid information density that hides current responsibility and next action |
| Kaizo | Similar quality/ISO workflows and consultant-led model | Helps organizations structure compliance programs | Consultant-assisted onboarding | Avoid over-complication and compliance-risky AI dependence |
| Paper, spreadsheets, SharePoint folders | Familiar and flexible | Low initial adoption cost | Familiar record and folder concepts | Add linked history, controlled state, findability, and non-repudiation without recreating paper complexity |

## 7. Blind Spots

| Date | Layer / Topic | Gap | Owner to confirm | Status |
|---|---|---|---|---|
| 2026-11-02 | Requirements authority | Which statements in the PDFs are approved requirements versus meeting discussion or generated interpretation? | Amit / Chau | open |
| 2026-11-02 | Roles and permissions | Exact action matrix for Author, Reviewer, QA Approver, Admin, and read-only users | PO / Dev / QA SME | open |
| 2026-11-02 | External Documents | Whether they bypass approval entirely, require verification, or support optional review | QA SME / PO | open |
| 2026-11-02 | Electronic signature | Authentication method, legal statement, reason codes, retry/lockout, and session-expiry rules | CTO / QA SME / Compliance | open |
| 2026-11-02 | Taxonomy | Create and Listing use different document types and department sets | PO / Data | open |
| 2026-11-02 | Effective Date | Who sets it, allowed past/future dates, timezone, and activation behavior | QA SME / Dev | open |
| 2026-11-02 | Files | Allowed types, size limit, scanning, conversion, replacement, and failed upload behavior | Dev / Security | open |
| 2026-11-02 | Comments | Comment creation, resolution, visibility, and persistence across rejection/revision | PO / QA SME | open |
| 2026-11-02 | Responsive desktop | Minimum supported viewport and behavior below the two-column threshold | Product / Frontend | open |
| 2026-11-02 | Accessibility | Target standard and supported keyboard/screen-reader environments | Product / Frontend | open |

## 8. Open Questions

| Question | Ask who | Why it matters | Target date | Status |
|---|---|---|---|---|
| Is the prototype a new app inside this COSS repository or a separate Accura repository? | Product / Frontend | Determines scaffolding, routing, assets, and handoff | Before implementation | open |
| What is the minimum supported desktop width: 1024, 1280, or another value? | Product / Frontend | Determines the editor/detail reflow strategy | Before visual selection | open |
| Can the same person be Author, Reviewer, and QA Approver? | QA SME | Affects assignment validation and compliance | Before interaction build | open |
| Does Reject always return to Draft, or can QA return a record to In Review? | QA SME | Affects state model and action copy | Before interaction build | open |
| What is the authoritative list of document types and departments? | PO / Data | Current Create and Listing specs conflict | Before data fixtures | open |
| Which actions are available on a row for each status and role? | PO / QA SME | Required for list row actions and overflow menus | Before list prototype | open |
| Should saved views such as My Drafts and Pending My Approval be part of the first slice? | PO | Could substantially improve daily task findability | Before list prototype | open |

## 9. Design Implications

| Insight | UI/UX implication | Priority | Evidence |
|---|---|---|---|
| Users think in approval chains and accountability | Keep state, pending role/person, and next action visible together | High | Kickoff transcript |
| Users treat the product as a trusted system of record | Make versions, audit history, signature meaning, and timestamps easy to inspect | High | Kickoff transcript and screenshots |
| Preventing mistakes is more important than minimizing clicks | Use clear confirmations, readiness checks, and consequence copy at regulated transitions | High | Kickoff transcript |
| List, form, and detail views will recur in every module | Build three reusable page shells plus shared workflow/signature/audit patterns | High | Cross-module consistency requirement |
| Current forms hide required routing below the fold | Add section readiness and surface missing requirements before Submit | High | Create/Edit screenshots |
| Parallel document versions are valid | Visually connect versions so repeated IDs do not appear to be duplicates | High | Document specification and listing screenshot |
| The current catalog has limited verified coverage | Reuse stable patterns where possible and visually/behaviorally verify In-review items before adoption | Medium | Accura component catalog |

