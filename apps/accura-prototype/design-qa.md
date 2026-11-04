# Accura Prototype – Design QA

This file owns implementation verification and visual evidence for the executable prototype. Product facts, reusable UI rules, and decision rationale are owned by `docs/product-knowledge/`, `docs/rules/`, and `docs/change-log/DECISIONS.md` respectively.

## Comparison Target

- Product baseline: `/Users/mac/Documents/GitHub/Coss/docs/product-knowledge/modules/documents/evidence/01-document-list.png`
- Structural direction: use Zinc 100 across the application canvas and open filter region; use Brand 950 for the sidebar, with distinct white surfaces for the sticky top bar and table. Use Zinc 100 with Zinc 900 foreground for selected navigation and Brand 950 for high-value actions.
- Palette target: Accura’s existing brand green system, a warm canvas, and a small set of high-energy accents rather than saturation across every surface.
- Implementation: `http://localhost:4173/`
- Current redesign evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-neutral-search-632.png`
- Expanded logo evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-logo-cropped-632.png`
- Collapsed alignment evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-sidebar-aligned-632.png`
- Iconoir system evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-iconoir-632.png`
- Vibrant implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-vibrant-632.png`
- Before/after comparison: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/design-qa-vibrant-comparison.png`
- Light-sidebar implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-light-sidebar.png`
- Light-sidebar comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/design-qa-light-sidebar-comparison.png`
- Brand 50 sidebar implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-brand50-sidebar.png`
- Brand 50 comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/design-qa-brand50-sidebar-comparison.png`
- Zinc shell implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-zinc-brand-selected.png`
- Zinc/reference comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/design-qa-zinc-brand-selected-comparison.png`
- Zinc-islands implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-zinc-islands.png`
- Zinc-islands comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-zinc-islands.png`
- Open-filter implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-open-filter.png`
- Open-filter comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-open-filter.png`
- White-topbar implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-white-topbar.png`
- White-topbar comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-white-topbar.png`
- Even-padding implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-even-topbar-padding.png`
- Even-padding comparison evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-even-topbar-padding.png`
- Create screen evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-create.png`
- Review screen evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-review.png`
- Electronic-signature evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-signature.png`
- QA Approval screen evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-qa.png`
- Approved screen evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-approved.png`
- Audit Trail evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-flow-audit.png`
- Full lifecycle comparison: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-document-flow.png`
- Dashboard banner reference: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/reference-dashboard-banner.png`
- Existing Accura dashboard reference: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/reference-accura-dashboard.png`
- Dashboard implementation evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-dashboard.png`
- Dashboard combined comparison: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-dashboard.png`
- Divider top-bar reference: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/reference-vercel-divider-topbar.png`
- Divider top-bar implementation: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-divider-topbar.png`
- Divider top-bar comparison: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/qa-comparison-divider-topbar.png`
- Outline role-badge evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-outline-role-badges.jpg`
- Outline module-badge evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-outline-module-badges.jpg`
- State: light theme, expanded sidebar, default filters, page 1, 10 rows.
- Latest captured viewport: 1265 × 712 CSS px in the in-app browser.
- Desktop implementation remains the primary target; the narrow capture was also used to verify that the shell does not introduce horizontal page overflow.

## Findings

No actionable P0, P1, or P2 differences remain in the redesigned Documents flow. The unresolved role matrix, External Document lifecycle, taxonomy conflicts, and production e-signature rules remain product-verification gaps rather than hidden implementation assumptions.

The implementation now intentionally differs from the older Accura demo and the preceding neutral pass in these ways:

- Zinc 100 (`#F4F4F5`) forms a continuous true-neutral application shell and document canvas. The former full-page white workspace has been removed.
- The sidebar uses Brand 950 (`#00393F`) as its surface with Zinc 200 content. Selected and hovered navigation use Zinc 100 with Zinc 900 icon and label.
- Filter controls, result count, title, description, primary action, and pagination sit directly on Zinc. The sticky top bar and table are the two white, rounded, bordered surfaces.
- Mint is limited to the table header and subtle table hover states; coral remains limited to the unread badge.
- The official Accura SVG lockup and mark replace the generated raster placeholder.
- The sidebar collapses from 248 px to exactly 64 px. In the collapsed state the mark is shown alone and changes to the expand icon on hover or keyboard focus.
- The notification count has its own ring and visible overflow, so it no longer clips into the bell control or header edge.
- The old section label in the top bar is replaced by a functional global search with a visible `⌘ K` shortcut.
- All product-interface icons now use Iconoir on a consistent 24 × 24 grid and 1.5 px stroke; the Accura logo remains the supplied brand SVG.
- The Document list now opens status-aware record screens directly; secondary row actions retain the quick-view dialog.
- Create/Edit uses a sectioned Record Editor with readiness, uploads, metadata, references, routing, and sticky Draft/Submit actions.
- Review, QA Approval, and Approved use one Record Detail shell with a dominant preview, workflow stepper, metadata rail, signature chain, role-aware decisions, and Audit Trail drawer.
- Dashboard combines the existing Accura overview and action-record structure with the supplied mint quality-workspace illustration. The banner keeps the requested eyebrow and headline in the open left region while the remaining workspace stays Zinc with white cards.
- Dashboard navigation is now functional. Dashboard and Documents share the same shell, selected navigation treatment, global search, notification, and profile controls.
- Dashboard module cards use restrained semantic color plus a branded selected state; Records retains the existing Accura tabs, priority filter, statuses, due dates, and realistic action data.

## Required Fidelity Surfaces

- Fonts and typography: passed. Cal Sans is loaded through COSS; UI uses `GEOM 25`, headings use `GEOM 50`, identifiers use `GEOM 0`, optical sizing is automatic, and no letter-spacing was introduced.
- Spacing and layout rhythm: passed. The 64 px sidebar state, 248 px expanded state, 64 px white top bar with 12 px padding on every side, open filter region, and white table surface form one consistent frame.
- Colors and visual tokens: passed. Zinc 100 defines the application background, Brand 950 defines the sidebar and primary action, and Zinc 100 with Zinc 900 foreground defines selected navigation. Native COSS status colors remain unchanged.
- Image quality and asset fidelity: passed. `accura-logo.svg` and `accura-mark.svg` come from the user-authorized official asset folder. `quality-workspace-banner.png` is the exact 2578 × 432 px image supplied by the user in this session; Next Image preserves it as a decorative raster background without redrawing the illustration.
- Copy and content: passed. App-specific labels use Documents terminology and typeset punctuation.
- Lifecycle coverage: passed for prototype scope. Draft, In Review, In QA Approval, Approved, signed rejection back to Draft, New Version, and Audit Trail are represented with realistic mock data.
- Dashboard composition: passed. The supplied illustration replaces the previous dark metrics hero, the two requested text lines remain readable in the left negative space, and the alert plus workload content continue immediately below it.

## Focused Interaction Evidence

- Expanded sidebar computed width: 248 px.
- Collapsed sidebar computed width after transition: 64 px.
- Collapsed mark was verified visually; keyboard focus swaps it to the expand icon and exposes a visible branded focus ring.
- Collapsed geometry was measured after the transition: sidebar center, navigation button center, and icon center all resolve to x = 40 px inside the 64 px rail.
- Activating the expand control restores 248 px and the full Accura lockup.
- At 632 px, `body.scrollWidth` equals `body.clientWidth`; the shell adds no horizontal page overflow.
- Notification control exposes the accessible label “Notifications, 3 unread”; the button has visible overflow and the badge is visually separated by a 2 px shell-colored ring.
- `⌘ K` focuses the global search. Enter with “Equipment” copies the query into the Documents search and reduces the result summary from 18 to 4 documents; Escape clears and blurs the global field.
- Runtime token inspection returned Zinc 50 `#fafafa`, Zinc 100 `#f4f4f5`, and Zinc 950 `#09090b`.
- Search, filters, pagination, creation dialog, row actions, and document quick view remain interactive from the previous prototype iteration.
- Runtime inspection confirmed the first navigation SVG uses `stroke-width="1.5"`; row actions retain View details, Version history, and View owner with the new icon set.
- Collapsed navigation items now retain explicit accessible names while their visible labels are hidden.
- Browser verification opened the document quick view after filtering for “Equipment”; document metadata and actions remained readable over the dark rail.
- Browser console check returned no errors.
- Browser verification completed the status-aware list-to-record path for In Review, In QA Approval, and Approved records.
- Review approval requires the electronic-signature dialog; confirming a prototype password advances the record to In QA Approval.
- Approved records expose Print, Download, New Version, View Audit Trail, and Mark as Obsolete; the audit drawer opened with four chronological verified events.
- The 1265 px lifecycle capture reported `body.scrollWidth === body.clientWidth`; no horizontal page overflow was introduced.
- Screen transitions reset page scroll to zero so record titles and primary actions are not hidden below the sticky top bar.
- Dashboard and Documents navigation was exercised in both directions; each destination exposed its expected heading and preserved the shared shell.
- Dashboard CTA scrolls to Records, Records tabs switch between five action rows and two upcoming rows, and the priority Select filters the current view.
- At a 647 × 708 CSS px in-app viewport, the sidebar automatically collapses to 64 px; the dashboard remains readable without horizontal page overflow.
- Dashboard browser capture is 632 × 692 px. The in-app browser reports device-pixel ratio 2 and returns a normalized 1× screenshot.
- Dashboard runtime logs contained only Next.js development/HMR messages; no application errors were present.

## Validation

- Accura token generator: passed.
- Accura token drift check: passed.
- TypeScript (`tsc --noEmit`): passed.
- Next.js production build: passed.
- Biome lint: passed with no warnings.
- Changed-file Biome lint (`components/dashboard-screen.tsx`): passed. The current app-wide lint command also scans existing generated `.vercel/output` files and fails there; no diagnostic points to the changed dashboard component.

## Comparison History

### Iteration 20 – outline metadata badges

- User feedback: roles and modules are descriptive metadata, not statuses, so filled badge surfaces gave them too much semantic weight.
- Fix: changed role, module, and document-type abbreviation badges to the outline variant. “Invitation pending” remains a warning badge because it communicates an actual account state.
- Browser evidence: `implementation-outline-role-badges.jpg` and `implementation-outline-module-badges.jpg` show the Users and Roles & Permissions tables with the updated hierarchy.
- Validation: TypeScript, changed-file Biome checks, and browser-console verification passed.

### Iteration 19 – Brand 300 banner border

- User feedback: the illustrated quality-workspace banner needed a defined 1 px outline.
- Fix: added a solid 1 px border using `--accura-brand-300` while preserving the existing 16 px radius, crop, text, and spacing. Brand 950 was tested first and then replaced because it looked too heavy against the pale mint artwork.
- Browser evidence: `implementation-quality-workspace-banner-border.jpg`; computed styles report `border-top-width: 1px`, `border-top-style: solid`, and `border-top-color: rgb(112, 209, 160)`.
- Result: the border follows the rounded hero edge evenly with no clipping or layout shift.

### Iteration 18 – supplied quality-workspace banner

- Source visual truth: `public/brand/quality-workspace-banner.png`, the exact user-supplied 2578 × 432 px RGBA image.
- Implementation evidence: `implementation-quality-workspace-banner.jpg`, a 1421 × 768 browser-rendered Dashboard capture at a 1436 × 776 CSS viewport; focused hero evidence is `implementation-quality-workspace-banner-crop.jpg` at 1085 × 208 px.
- State: light theme, Dashboard selected, page at top, default desktop navigation, no interaction overlay.
- Full-view comparison evidence: the implementation capture shows the new banner in context between the greeting and action-required notice, with the rest of the Dashboard unchanged.
- Focused comparison evidence: `qa-comparison-quality-workspace-banner.png` places the normalized source crop above the browser-rendered hero. The source was scaled to 1242 × 208 and center-cropped to 1085 × 208 to match the CSS `object-cover` frame; both comparison inputs are therefore equal-size 1× evidence.
- Fonts and typography: Cal Sans remains active, no letter-spacing was added, and the requested eyebrow plus headline retain the prior hierarchy and exact copy.
- Spacing and layout rhythm: the 208 px hero keeps 32 px desktop inset, centers the two-line text block vertically, and preserves the existing 20 px Dashboard section rhythm.
- Colors and visual tokens: the mint asset supplies the background color; the eyebrow uses Accura primary and the headline uses Brand 950 for clear contrast without modifying the supplied art.
- Image quality and asset fidelity: the source PNG loads through Next Image at its native 5.97:1 art direction; browser inspection confirmed a complete image load and no generated substitute, SVG redraw, gradient, or placeholder.
- Copy and content: exactly “Your quality workspace” and “Keep quality moving, without losing sight of risk.” remain in the banner; the old description, CTA, and metric tiles were removed so they do not obscure the illustration.
- Responsive evidence: visual checks at 1024 × 768 and 768 × 768 keep the complete headline readable; the decorative right-side artwork crops progressively rather than colliding with text.
- Browser verification: the Dashboard rendered at `http://localhost:4173/`; the banner asset completed successfully, the expected heading was present in the accessibility tree, and browser error/warning logs were empty.
- Earlier findings: none. The first normalized comparison found no actionable P0/P1/P2 mismatch.
- Result: no actionable P0/P1/P2 findings remain.

### Iteration 17 – border-only top bar

- User feedback: the white rounded top-bar container felt too detached from the Zinc application canvas.
- Source truth: `reference-vercel-divider-topbar.png` (2392 × 218 px) defines a background-free navigation region separated from content by one horizontal rule.
- Fix: removed the top bar’s white fill, surrounding border, 16 px radius, and shadow; matched its fill to the Zinc canvas and retained only the bottom border.
- Preserved: sticky behavior, 64 px height, 12 px internal padding, search input, notification, profile, and all interactions.
- Post-fix evidence: `qa-comparison-divider-topbar.png` normalizes the reference to 632 px wide and compares it with the top 80 px of the 647 × 708 CSS implementation capture. The divider, open background, and control alignment are legible at the comparison scale.
- Result: no actionable P0/P1/P2 findings remain.

### Iteration 16 – branded Dashboard

- Source truth: `reference-dashboard-banner.png` and `reference-accura-dashboard.png`, both 1914 × 956 px. The first defines banner hierarchy and restrained accent usage; the second defines Accura’s module overview, alerts, tabs, action table, and record content.
- Implementation evidence: `implementation-dashboard.png`, 632 × 692 px, captured from the in-app browser at a 647 × 708 CSS viewport and normalized to 1× output. `qa-comparison-dashboard.png` places both references and the rendered implementation in one visual comparison.
- State: light theme, Dashboard selected, My actions selected, All priorities, page at top, responsive sidebar collapsed.
- Intentional adaptation: this is a hybrid redesign rather than a pixel clone, so QA compares hierarchy, content coverage, token use, density, and responsive behavior. The banner is Brand 950 rather than the PAV mint, matching the user’s requested dark-brand treatment.
- Earlier P2: at the available narrow browser viewport, the 248 px sidebar left too little room for the banner and caused the header content to feel compressed.
- Fix: automatically initialize the existing 64 px collapsed rail below 960 px while preserving manual expansion and the full desktop 248 px state.
- Post-fix evidence: the implementation now exposes the full heading, banner CTA, three banner metrics, and alert without horizontal overflow. The screenshot itself is the focused hero-region evidence; a separate crop was unnecessary because banner typography, spacing, CTA, and metrics remain legible at 632 px.
- Required surfaces: typography uses Cal Sans roles with no tracking; spacing follows the existing 8/12/16/24/32 rhythm; colors use Zinc, Brand 950/800, Pop, and existing semantic badges; no raster or decorative source asset was approximated; copy preserves Accura’s current workload data while improving hierarchy.
- Result: no actionable P0/P1/P2 findings remain.

### Iteration 15 – complete Documents lifecycle

- Scope: implemented Create, Edit Draft, In Review, In QA Approval, Approved, electronic-signature, and Audit Trail states from the five remaining evidence screens and the 13-page module specification.
- Architecture: added a reusable Record Editor and Record Review/Detail shell, plus shared workflow stepper, assignee, e-signature, document preview, and audit timeline patterns.
- Interaction coverage: document rows open the correct screen by status; Create routes through category selection; signed approval advances Review → QA → Approved; Reject returns to Draft; New Version opens Draft; Audit opens a right-side drawer.
- Earlier P2: switching from a scrolled list or detail screen could preserve the previous scroll offset and hide the new record title below the sticky top bar.
- Fix: reset scroll to the page origin whenever the active Documents view changes; browser verification returned `scrollTop: 0` with the Approved title visible.
- Post-fix evidence: `qa-comparison-document-flow.png` places the five source screens above the normalized browser-rendered Create, Review, QA, Approved, and Audit states. Source captures are 1918 × 991; implementation captures are 1265 × 712 (Audit 1280 × 720) and were top-cropped to the same 1.934:1 comparison ratio.

### Iteration 14 – even top-bar padding

- User feedback: the white top bar’s padding looked uneven because vertical spacing came from the fixed height while horizontal spacing used separate responsive values.
- Fix: replaced the horizontal-only padding rules with one uniform `p-3` declaration, giving the top, right, bottom, and left edges exactly 12 px.
- Browser measurement: the header remains 64 px tall; computed padding is 12 px on all four sides, the global search remains 40 px tall, and the profile cluster remains vertically centered.
- Post-fix evidence: `qa-comparison-even-topbar-padding.png` shows the annotated state above and the browser-rendered equal-padding top bar below.

### Iteration 13 – white top bar container

- User feedback: the global search, notification, and profile area needed its own white container instead of floating directly on Zinc.
- Fix: changed the sticky top bar to a white rounded surface with a quiet border and shadow, preserved the 64 px height, and kept an 8 px sticky offset consistent with the shell padding.
- Fix: changed the unread badge separation ring from the Zinc canvas token to the white background token.
- Post-fix evidence: `qa-comparison-white-topbar.png` shows the annotated Zinc top bar above and the browser-rendered white container below; the comparison is scoped to the top-bar region.

### Iteration 12 – open filters on Zinc

- User feedback: the filter container still created an unnecessary white card above the table.
- Fix: removed the filter wrapper’s white background, border, radius, padding, and shadow while preserving the control grid, responsive stacking, and result count.
- Post-fix evidence: `qa-comparison-open-filter.png` shows the annotated white filter container above and the browser-rendered open Zinc treatment below. The implementation capture uses the available 632 × 692 responsive viewport; the comparison is scoped to the filter region rather than claiming full-page pixel parity.

### Iteration 11 – Zinc canvas with white content islands

- User feedback: the large rounded white workspace still made the page feel like one oversized card; the desired hierarchy was a fully Zinc background with white reserved for filters and the table.
- Fix: removed the background, border, radius, and shadow from `main`; the page heading, description, primary action, and pagination now sit directly on the Zinc canvas.
- Fix: wrapped the filters in their own white rounded container with a quiet border and shadow; retained the existing white table container as the second surface.
- Post-fix evidence: the source and implementation are shown together in `qa-comparison-zinc-islands.png`; the implementation intentionally isolates the two requested white surfaces while preserving the source’s navigation, density, and green accents.

### Iteration 11 – primary and secondary hierarchy

- User feedback: primary green appeared across too many simultaneous surfaces, making the Documents workspace feel heavy and flattening action hierarchy.
- Fix: reserved solid primary for the main task action and contained workflow confirmation; moved table chrome, selected pagination, notices, row hover, and selected document-kind surfaces to the COSS secondary role.
- Fix: document names now use neutral foreground at rest and reveal primary color on hover.
- Preserved semantic status colors, focus rings, and the palette-only Accura adapter.
- Post-fix evidence: `implementation-secondary-hierarchy-632.png` shows only the selected module and main create action using solid brand green in the default Documents view.

### Iteration 10 – Zinc shell with brand-only selection

- User feedback: the Brand 50 sidebar still cast too much green across the shell; the supplied neutral reference was the intended base.
- Fix: returned the sidebar surface and border to Zinc tokens, returned unselected hover states to Zinc, and preserved the solid Brand 800 selected item with white icon and label.
- Post-fix evidence: the source and implementation captures are both 1265 × 712. The shell, spacing, content density, and sidebar surface match; the selected item intentionally changes from the source mint tint to the requested solid brand state.

### Iteration 9 – neutral shell, Brand 50 rail, solid selection

- User feedback: the application background still carried too much teal tint, and the selected navigation state needed the solid base brand color.
- Fix: remapped the shell from the warm green-leaning neutral to Zinc 100, remapped the sidebar to Brand 50, and remapped the selected item to Brand 800 with white icon and label.
- Fix: changed unselected hover states to translucent white so they remain quiet on the Brand 50 rail.
- Post-fix evidence: the equal-size comparison shows a visibly neutral outer shell, a distinct Brand 50 sidebar, and a high-contrast solid selected state without changing document density or hierarchy.

### Iteration 8 – light sidebar and neutral filter toolbar

- User feedback: the dark teal sidebar felt too heavy, while the captured filter toolbar did not need a green container.
- Fix: returned the sidebar to Zinc 50, removed the lime selection rail, and gave the selected navigation item a Brand 50 container with Brand 900 icon and label.
- Fix: removed the mint background, padding, and extra radius from the filter toolbar while retaining the table-header tint for hierarchy.
- Post-fix evidence: the full browser capture shows the light rail, green selected state, and filter controls directly on the white workspace; collapsed navigation retains accessible names.

### Iteration 7 – vibrant, human color architecture

- Earlier P2: the all-neutral rail and open white filter area made the brand green feel isolated to links and primary actions.
- Fix: changed the rail to Accura deep teal, placed the official dark logo on a white tile, introduced a lime active marker, and grouped filters on a soft mint surface.
- Earlier accessibility issue: collapsed icon-only navigation controls lost their accessible names when the visible labels were hidden.
- Fix: added conditional `aria-label` values to primary and support navigation controls in the collapsed state.
- Post-fix evidence: the 632 × 692 before/after comparison shows the same content hierarchy with a stronger visual anchor and no lost document functionality.

### Iteration 6 – Iconoir system

- Earlier P3: Lucide’s heavier visual language felt less refined against the neutral shell and Cal Sans typography.
- Fix: replaced every prototype-level Lucide icon with the closest Iconoir equivalent at the library’s native 1.5 px stroke.
- Dependency boundary: `iconoir-react` 7.12.1 is the sole icon dependency of the Accura prototype; Lucide was removed from this app while COSS retains its own internal dependencies.
- Verified surfaces: expanded and collapsed navigation, global search, notification, filters, table actions, empty state, pagination, dialog feedback, and metadata actions.

### Iteration 5 – logo crop and collapsed alignment

- Earlier P2: the official horizontal logo retained too much empty SVG artboard, making the visible lockup feel undersized.
- Fix: cropped only the SVG `viewBox` from the original artboard to `18 5 128 49`; paths, fills, and aspect ratio remain intact.
- Earlier P2: collapsed navigation labels were hidden but their former gap and padding still offset the icons.
- Fix: collapsed navigation items now use explicit center justification and zero horizontal padding.

### Iteration 4 – true-neutral palette and global search

- Earlier P2: the imported Zinc scale carried a blue-gray undertone that felt disconnected from the brand palette.
- Fix: replaced all 11 Zinc primitive values with the supplied true-neutral scale and regenerated the COSS adapter.
- Earlier P2: the top bar repeated page context instead of supporting a cross-product action.
- Fix: replaced “Documents / Controlled content workspace” with a global search matching the reference hierarchy, including `⌘ K`, Enter, and Escape behavior.
- Icon-system replacement remains a deliberate follow-up because the target icon library has not yet been selected.

### Iteration 3 – light application shell

- Earlier P2: the dark sidebar competed with the document workspace.
- Fix: remapped the COSS sidebar roles to Zinc and placed the white main content on a recessed neutral shell.
- Earlier P2: the generated raster logo was no longer appropriate after official brand masters were supplied.
- Fix: copied the official horizontal and mark SVGs into the prototype; cropped only the mark artboard through its `viewBox`.
- Earlier P2: the notification badge sat too close to the bell and could appear clipped.
- Fix: enabled visible overflow, moved the badge to the control corner, and added a shell-colored separation ring.
- Earlier P2: the collapsed navigation was 72 px and used a separate toggle.
- Fix: made it exactly 64 px and turned the logo position itself into the expand interaction.

## Implementation Checklist

- [x] Official SVG logo and mark.
- [x] Brand 950 sidebar and recessed Zinc shell.
- [x] Continuous Zinc application and content canvas.
- [x] 248 px → 64 px collapse behavior.
- [x] Hover/focus mark → expand icon behavior.
- [x] Notification badge correction.
- [x] Supplied true-neutral Zinc primitive scale.
- [x] Functional global search and keyboard shortcut.
- [x] Cropped official horizontal logo artboard.
- [x] Measured center alignment for every collapsed navigation item.
- [x] Iconoir across all prototype-level UI surfaces.
- [x] Light navigation rail with a green selected-item state.
- [x] Zinc 100 neutral application background.
- [x] Brand 950 sidebar with a Zinc 100 selected item and Zinc 900 foreground.
- [x] Filter controls directly on Zinc; table retained as the white content container.
- [x] White sticky top bar containing global search, notifications, and profile.
- [x] Uniform 12 px top-bar padding verified from computed browser styles.
- [x] Accessible names retained in collapsed navigation.
- [x] No horizontal page overflow in the available responsive capture.
- [x] TypeScript and production build.
- [x] Primary reserved for principal actions; supporting interaction states use secondary or neutral roles.
- [x] Create and Edit Draft editor states with readiness and routing.
- [x] In Review and In QA Approval decision states.
- [x] Approved lifecycle actions and signature chain.
- [x] Electronic-signature confirmation for regulated transitions.
- [x] Audit Trail drawer with verified chronological events.
- [x] Status-aware row-to-record navigation and scroll reset.
- [x] Dashboard with the supplied illustrated quality-workspace banner and retained text.
- [x] Existing Accura module overview, alert, tabs, Records table, and workload data retained.
- [x] Functional Dashboard/Documents navigation, record tabs, and priority filter.
- [x] Branded active states with semantic status colors.
- [x] Responsive 64 px sidebar initialization below 960 px.
- [x] Border-only Zinc top bar with no card container styling.
- [x] Outline treatment for categorical metadata badges; filled semantic treatment retained for status.

final result: passed
