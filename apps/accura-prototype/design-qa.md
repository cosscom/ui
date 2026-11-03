# Accura Documents List – Design QA

This file owns implementation verification and visual evidence for the executable prototype. Product facts, reusable UI rules, and decision rationale are owned by `docs/product-knowledge/`, `docs/rules/`, and `docs/change-log/DECISIONS.md` respectively.

## Comparison Target

- Product baseline: `/Users/mac/Documents/GitHub/Coss/docs/product-knowledge/modules/documents/evidence/01-document-list.png`
- Structural direction: use Zinc 100 across the application canvas and open filter region; use Zinc 50 in the sidebar, with distinct white surfaces for the sticky top bar and table. Reserve solid Brand 800 for the selected navigation state and high-value actions.
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
- State: light theme, expanded sidebar, default filters, page 1, 10 rows.
- Latest captured viewport: 1265 × 712 CSS px in the in-app browser.
- Desktop implementation remains the primary target; the narrow capture was also used to verify that the shell does not introduce horizontal page overflow.

## Findings

No actionable P0, P1, or P2 differences remain in the redesigned shell.

The implementation now intentionally differs from the older Accura demo and the preceding neutral pass in these ways:

- Zinc 100 (`#F4F4F5`) forms a continuous true-neutral application shell and document canvas. The former full-page white workspace has been removed.
- The sidebar uses Zinc 50 (`#FAFAFA`) as its surface. Only the selected item receives solid Brand 800 (`#008852`) with white icon and label; hover states use Zinc 100.
- Filter controls, result count, title, description, primary action, and pagination sit directly on Zinc. The sticky top bar and table are the two white, rounded, bordered surfaces.
- Mint is limited to the table header and subtle table hover states; coral remains limited to the unread badge.
- The official Accura SVG lockup and mark replace the generated raster placeholder.
- The sidebar collapses from 248 px to exactly 64 px. In the collapsed state the mark is shown alone and changes to the expand icon on hover or keyboard focus.
- The notification count has its own ring and visible overflow, so it no longer clips into the bell control or header edge.
- The old section label in the top bar is replaced by a functional global search with a visible `⌘ K` shortcut.
- All product-interface icons now use Iconoir on a consistent 24 × 24 grid and 1.5 px stroke; the Accura logo remains the supplied brand SVG.

## Required Fidelity Surfaces

- Fonts and typography: passed. Cal Sans is loaded through COSS; UI uses `GEOM 25`, headings use `GEOM 50`, identifiers use `GEOM 0`, optical sizing is automatic, and no letter-spacing was introduced.
- Spacing and layout rhythm: passed. The 64 px sidebar state, 248 px expanded state, 64 px white top bar with 12 px padding on every side, open filter region, and white table surface form one consistent frame.
- Colors and visual tokens: passed. Zinc 100 defines the application background, Zinc 50 defines the sidebar, and Brand 800 with white foreground defines the selected state and primary action. Native COSS status colors remain unchanged.
- Image quality and asset fidelity: passed. `accura-logo.svg` and `accura-mark.svg` come from the user-authorized official asset folder. The mark changes only the SVG `viewBox` to remove unused artboard space; its paths and fills are untouched.
- Copy and content: passed. App-specific labels use Documents terminology and typeset punctuation.

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

## Validation

- Accura token generator: passed.
- Accura token drift check: passed.
- TypeScript (`tsc --noEmit`): passed.
- Next.js production build: passed.
- Biome lint: passed with no warnings.

## Comparison History

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
- [x] Neutral sidebar and recessed shell.
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
- [x] Zinc 50 sidebar with solid Brand 800 selected item.
- [x] Filter controls directly on Zinc; table retained as the white content container.
- [x] White sticky top bar containing global search, notifications, and profile.
- [x] Uniform 12 px top-bar padding verified from computed browser styles.
- [x] Accessible names retained in collapsed navigation.
- [x] No horizontal page overflow in the available responsive capture.
- [x] TypeScript and production build.
- [x] Primary reserved for principal actions; supporting interaction states use secondary or neutral roles.

final result: passed
