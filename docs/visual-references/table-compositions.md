# Accura Table Composition Visual Reference

**Status: reference only — not an approved or automatically applicable pattern.**

This note records useful table-composition ideas for a future system-wide exploration. It does not authorize changing an existing table. Current approved hierarchy remains owned by [`../rules/ui-hierarchy.md`](../rules/ui-hierarchy.md).

Before implementation:

- confirm whether the scope is one explicitly named screen or all comparable tables;
- inventory the affected tables and states;
- confirm the migration plan with the user;
- keep existing table styling when no explicit implementation approval is present;
- promote an accepted direction into `docs/rules/` only after implementation and QA.

## Reference Patterns

- [`references/sectioned-content-table.png`](references/sectioned-content-table.png) — a table that belongs to a named section and may follow a small amount of contextual content.
- [`references/standalone-toolbar-table.png`](references/standalone-toolbar-table.png) — a table that is the page’s primary working surface, with tabs and a toolbar outside the table frame.

The references establish composition and hierarchy, not exact Clerk spacing, color, typography, or density. Accura keeps its Cal Sans typography, Zinc and Brand tokens, compact operational density, semantic statuses, and COSS components.

## Candidate Selection Notes

Use this matrix only after the user explicitly approves exploring or implementing one of these directions.

| Situation | Use | Reason |
|---|---|---|
| The table is one section among several on a Settings or detail screen | Sectioned content table | Keeps the section title, context, action, and dataset visibly related |
| Two or three short context or setting rows introduce the dataset | Sectioned content table | Lets the context lead naturally into the table without creating multiple cards |
| The table is the main task of the page | Standalone toolbar table | Gives search, filters, views, and creation actions the page-level hierarchy they need |
| Several unrelated datasets appear on one screen | Separate sectioned tables | Preserves a clear title and state for each dataset |
| More than three context rows precede a table | Split the content into its own subsection | Prevents a long form or description block from being mistaken for table chrome |

Do not choose the sectioned version only because a table needs rounded corners. Choose it when the surrounding content and table form one task context.

## Reference Direction A — Sectioned Content Table

This direction may suit Settings, record details, role assignments, linked entities, approval routing, or other subordinate datasets.

Compose the surface in this order:

1. **Section header:** Zinc 50; title and optional one-line description on the left, one section-level action on the right.
2. **Tabs, when present:** place them immediately below the header when they change the whole dataset.
3. **Context rows, when present:** place two or three compact white rows below the header or selected tab. Separate them with dividers.
4. **Toolbar, when needed:** search and filters on the left; result count or quiet utilities beside them. Do not repeat the header’s primary action.
5. **Column header:** use the existing subdued table-header surface.
6. **Data body or empty state:** white rows with dividers inside the same outer frame.

Use one outer border and radius for the complete section. Accura tables should not add a separate raised card around every ordinary row. Reserve an inset row, stronger border, or shadow for a genuinely selectable or editable object that must read as a control rather than a normal record.

## Reference Direction B — Standalone Toolbar Table

This direction may suit Documents, Users, Records, audit results, or another page where browsing and acting on a dataset is the principal task.

Compose the page in this order:

1. **Page title and description.**
2. **Dataset tabs or saved views.**
3. **Toolbar:** search first, then filters, column controls, and low-priority utilities; place the single primary creation action at the far end.
4. **Table frame:** subdued column header and white body under one border and radius.
5. **Pagination or result summary.**

Do not repeat the page title inside the table frame. Keep the toolbar visually connected to the dataset with a 16–24 px gap, but do not wrap it in another card unless it contains persistent configuration or a complex query builder.

## When Two Or Three Content Rows Come Before The Table

First determine what the rows mean:

| Content type | Treatment |
|---|---|
| Short facts such as owner, default role, scope, or effective date | Use a definition-list row: muted label, stronger value, optional trailing utility action |
| Interactive settings such as a toggle or select | Use compact setting rows with labels, supporting copy only when necessary, and one control aligned to the end |
| Search, filters, result count, or column controls | Treat them as the table toolbar, not content rows |
| Alerts, validation, or lifecycle notices | Place a semantic notice above the table section; do not make it look like neutral table context |
| Records that share the table’s column schema | Put them in the table body instead of creating a separate content band |

Content rows must stay concise:

- Prefer one line; allow a second line only for supporting text.
- Use a consistent 48–56 px minimum row height.
- Keep labels and controls aligned to a shared grid.
- Use dividers rather than separate cards.
- If the content needs more than three rows, long explanations, or multiple controls per row, make it a separate subsection before the table.

## Potential Accura Mapping

The following mapping is a proposal to evaluate if this direction is approved. It is not the current table contract.

| Layer | Accura treatment |
|---|---|
| Application canvas | Zinc 100 |
| Section header | Zinc 50 with one bottom divider |
| Tabs, context rows, toolbar, and table body | White |
| Table column header | COSS secondary or neutral surface, currently `bg-secondary/72` |
| Outer frame | `border`, `rounded-xl`, and at most `shadow-xs` |
| Row separation | One-pixel neutral divider; restrained neutral hover |
| Primary action | Brand 950; at most one per page or section task context |
| Utility actions | Outline or ghost |
| Metadata badges | Outline |
| Status and severity badges | Filled semantic variant |

Use the same horizontal inset across the section header, context rows, toolbar, column labels, and first data cell whenever the component structure allows it. In the current Settings density, 20 px is the reference inset.

## Content And Column Rules

- Put the identifying field first and give it the most width.
- Use a strong primary line and at most one muted secondary line in the identifying cell.
- Keep status, date, assignee, and categorical metadata in separate columns when users compare or sort them.
- Use `—` for unavailable values only when the column meaning is already explicit.
- Right-align numeric values; keep dates and text left-aligned unless a shared product convention says otherwise.
- Keep row actions in the final narrow column and give every icon-only menu an accessible name.
- Hide a column only when its information is available in the responsive row summary or detail view.

## Empty, Loading, And Error States

- An empty state occupies the table body under the same title, toolbar, and column context when those controls remain useful.
- Remove irrelevant column labels when there is no possible row schema yet; keep them when filters can restore results.
- Loading rows should preserve column widths to avoid layout shift.
- Error states must explain what failed and provide a recovery action; do not present them as an empty dataset.

## Responsive Behavior

- Allow the toolbar to wrap before compressing inputs below a usable width.
- Keep the primary action visible and move it to its own row when necessary.
- Preserve the identifying field, status, and row action longest; collapse lower-priority columns into the identifying cell or detail view.
- Use horizontal scrolling for regulated or comparison-heavy tables when hiding columns would remove essential evidence.
- Do not convert a dense desktop table into unrelated cards unless the mobile task genuinely changes from comparison to record-by-record browsing.

## Accessibility Checks

- Use semantic table, row, column-header, and cell elements for tabular data.
- Give sortable headers a real button, an accessible name, and announced sort direction.
- Keep keyboard focus visible for toolbar controls, row links, and action menus.
- Do not rely on background tone alone to communicate selected, status, or error state.
- Ensure menus remain associated with the correct row and return focus to their trigger when closed.
- Verify keyboard navigation, zoom/reflow, horizontal scrolling, and screen-reader reading order in the implementation; screenshots alone cannot confirm them.

## Current Settings Position

The current Users, Roles & Permissions, and Document Types tables intentionally retain their existing table treatment. Only the Zinc 50 section header above the white content body has been approved and implemented.

The inset card-table treatment visible in the references was evaluated but deferred because applying it only to Settings would create inconsistency with Documents, Records, and module tables. Do not apply it automatically.

If table styling is revisited, use this document as discussion material, confirm the affected surfaces, and then create a scoped implementation and QA plan.
