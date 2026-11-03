# Accura Documents List – Design QA

## Comparison Target

- Product baseline: `/Users/mac/Documents/GitHub/Coss/docs/accura-discovery/evidence/01-document-list.png`
- Structural direction: the user-provided Square reference (neutral application shell with a brighter, rounded workspace) and the user-provided Mercury reference (global search in the top application bar).
- Palette target: the user-provided Zinc scale from `#FAFAFA` through `#09090B`.
- Implementation: `http://localhost:4173/`
- Current redesign evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-neutral-search-632.png`
- Expanded logo evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-logo-cropped-632.png`
- Collapsed alignment evidence: `/Users/mac/Documents/GitHub/Coss/apps/accura-prototype/implementation-sidebar-aligned-632.png`
- State: light theme, expanded sidebar, default filters, page 1, 10 rows.
- Captured viewport: 632 × 692 CSS px in the in-app browser.
- Desktop implementation remains the primary target; the narrow capture was also used to verify that the shell does not introduce horizontal page overflow.

## Findings

No actionable P0, P1, or P2 differences remain in the redesigned shell.

The implementation now intentionally differs from the older Accura demo in these ways:

- The revised neutral Zinc 100 (`#F4F4F5`) forms a quiet application shell while the document workspace is white, rounded, bordered, and lightly elevated.
- The sidebar is neutral rather than dark brand green; brand green is reserved for actions, links, focus, and the official logo.
- The official Accura SVG lockup and mark replace the generated raster placeholder.
- The sidebar collapses from 248 px to exactly 64 px. In the collapsed state the mark is shown alone and changes to the expand icon on hover or keyboard focus.
- The notification count has its own ring and visible overflow, so it no longer clips into the bell control or header edge.
- The old section label in the top bar is replaced by a functional global search with a visible `⌘ K` shortcut.

## Required Fidelity Surfaces

- Fonts and typography: passed. Cal Sans is loaded through COSS; UI uses `GEOM 25`, headings use `GEOM 50`, identifiers use `GEOM 0`, optical sizing is automatic, and no letter-spacing was introduced.
- Spacing and layout rhythm: passed. The 64 px sidebar state, 248 px expanded state, 64 px header, shell gap, and rounded main workspace form one consistent frame.
- Colors and visual tokens: passed. All 11 Zinc primitives match the supplied hex values exactly; sidebar roles map to Zinc 100/700/900 and white; brand 800 remains the primary action; native COSS status colors remain unchanged.
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

## Validation

- Accura token generator: passed.
- Accura token drift check: passed.
- TypeScript (`tsc --noEmit`): passed.
- Next.js production build: passed.
- Biome was not available in the installed workspace binaries; this is an environment dependency gap, not a suppressed lint failure.

## Comparison History

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
- [x] White rounded main workspace.
- [x] 248 px → 64 px collapse behavior.
- [x] Hover/focus mark → expand icon behavior.
- [x] Notification badge correction.
- [x] Supplied true-neutral Zinc primitive scale.
- [x] Functional global search and keyboard shortcut.
- [x] Cropped official horizontal logo artboard.
- [x] Measured center alignment for every collapsed navigation item.
- [x] No horizontal page overflow in the available responsive capture.
- [x] TypeScript and production build.

final result: passed
