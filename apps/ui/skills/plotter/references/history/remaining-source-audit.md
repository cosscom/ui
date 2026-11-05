# Remaining Plotter source audit

Historical evidence for the named revisions. Use the [current instructions](../../SKILL.md) for new work; these findings and product claims need fresh evidence before being applied to a later revision.

Bounded source pass on 2026-10-25. This supplements [source-audit.md](source-audit.md); it is not rendered acceptance, a mechanical certification, or approval of every inspected drawing. The 43 studies below received a source reading focused on their principal dimensions, circle/arc relationships, interval alignment, and annotation meaning. Together with the separate audit’s 12 studies, this covered the principal static construction of all 55 registered studies at that snapshot. Later revisions require fresh checks of affected claims. The revised shared S01/M03 component has since received fresh source, geometry, marker-clearance, and limited browser checks in [source-audit.md](source-audit.md). Those named checks supersede the earlier S01 source snapshot; the broader static inventory does not verify other animations. Individual successful checks do not certify every path in a drawing.

## Concrete findings and corrections

| Study | Evidence | Outcome |
| --- | --- | --- |
| **E01 / `404-doorway`** | In `app/plotter/not-found-architecture-studies.tsx`, the radius leader formerly ran from `(208,248)` to `(296,160)`: length `124.45079349`, despite the swing arc having `R128` and the label `r = 4u`. It missed the arc by `3.54920651`. | **Corrected only the leader endpoint.** It now derives `(208 + 128/√2, 248 − 128/√2) = (298.50966799,157.49033201)`. The represented doorway, swing arc, label, and cap geometry are unchanged. |
| **E06 / `404-unbuilt-arch`** | In `app/plotter/not-found-geometry-studies.tsx`, the R126 leader started at `(208,176)` and the R90 leader at `(349,216)`. Their nominal-center radius residuals were `+0.49110641` and `+4.11163584`. Because the approved arch endpoints are rounded, its serialized SVG arcs have centers `(279.99998991,280.05043350)` and `(280.00000072,279.98863831)`, rather than precisely `(280,280)`. Residuals against those actual arcs were `+0.53256995` and `+4.10390924`. | **Corrected only the two leader attachment points.** They are now `(208.303044749,176.437943637)` and `(345.990882349,218.790570189)`, projected onto the existing SVG arcs. Incidence error is below `10⁻⁹` units. The approved arch paths are unchanged; these corrections do not claim that their rounded endpoints have become an exact concentric construction. |
| **T01 / `type-letter`** | In `app/plotter/object-studies.tsx`, the counter is drawn with cubic Béziers. Its upper-left quarter meets the 45° ray at `(222.25,176.25)` with radius `61.87184335` about `(266,220)`. The `r` leader ends at `(222,176)`, missing the actual outline by `0.35355339`. The counter’s cardinal radius is `62`, so it is also an approximation to a circle. | **Unchanged; needs a deliberate choice.** Preserve the letterform and call the annotation a construction radius/approximation, or replace the intended circular counter with true `R62` arcs and derive the leader endpoint. Do not silently rewrite an approved type drawing. |

The E01/E06 edits are narrow incidence corrections, not a restyle. Browser inspection of those annotations remains part of the parent review.

For T01, the smallest proposed wording change is `r ≈ 62`, which acknowledges an approximate nominal radius while preserving the approved cubic letterform. Re-anchoring its leader to the actual curve at `(222.25,176.25)` would be a separate small incidence correction. Neither change was applied as part of this audit.

## Selected checks that passed

- **P01:** the common tangent is within `0.00183` units of the R80 circle and `0.000007` units of the R40 circle. Both circles share the baseline at `y=324`.
- **P02/P03:** the corner’s offset is `104 − 80 = 24`; the proportion study uses widths `36,54,81,121.5`, each multiplied by `1.5`, on a shared baseline. Its indicated slope is `1/2`.
- **K02/K03/K06/K07/K08:** the selected overlap, one-hour UTC/UTC+03 booking, Thursday 10:00–11:00 cell, 15 + 15 = 30 minute construction, and `6u × 4u` availability extents agree with the displayed geometry. K07’s R28 leader rounding residual is approximately `0.00143`.
- **I03/I04/I05/I06:** the inspected insets, browser R24/R12 fillets, phone’s concentric R32/R24 corners and eight-unit offset, safe-area margins, and conversation spacing agree with the dimensions. The phone has `u=16`, total width `10u`, and horizontal margins `1.5u + 7u + 1.5u`.
- **W02/W03/A03:** branch bends are R24 with outlets separated by `4r`; the switch matrix uses 64-unit pitch; the coordinate datum at `(120,328)` and selected point `(312,168)` give `(6u,5u)` with `u=32`.
- **O03/O04/O05:** keyboard pitch is 72 and stagger is 18 (`¼u`); the lamp’s generating circle is R96; both folder tabs measure 64 while the bodies measure 216 and 136.
- **B06/B07/B09:** the inspected branch fillets, 176-to-264 resize with constant 56 height, and 132-wide relation tables with 32-unit rows agree with their labels. This checks diagram geometry, not every claim about the external products.
- **S01/S03/S05/S06/S07/S08/S09/S12/S13/S14:** checked relationships include 16-wide paired routes, the missing 56-wide index record, 64-pitch notification positions, a `200 × 200√2` page and `u + 3u + u` writing margins, 48-unit plot intervals, concentric R40/R24 lock arcs, the flap reflected from `y=88` to `y=248` about `y=168`, the pin’s near-tangent serialized sides, seven 40-wide day columns, and the 240:180 image frame ratio.
- **E00/E02/T02:** the missing-corner dimensions use `u=40`; the interrupted route uses concentric R52/R60/R68 bends with a 16-unit band; the C mark uses R114/R78 arcs and a 90° opening. These checks retain the qualified rounding tolerance; they are not symbolic proofs for every serialized coordinate.

## Final five static studies

This follow-up closes the five source-reading gaps from the first addendum. It does not change the C03 animation or other motion sources.

| Study and source | Principal checks | Qualification / outcome |
| --- | --- | --- |
| **C00 / `particles-reference`**, `app/plotter/original-particles-blueprint.tsx` | Shared inset `188 − 164 = 24 = u`; row width `404 − 164 = 240 = 10u`; R16 leader residual `−0.005245`; switch track `30 × 18`, R9, thumb R5.5, right/top/bottom insets `3.5`. | Checked geometry passes. Historical line opacity/dash choices remain outside the newer normalized house roles; this pass does not restyle them. |
| **C03 / `particles-recombination`**, static `app/plotter/particles-blueprint.tsx` | Three fragments are `144 × 48`; the assembled panel is `144 × 144 = 3u × 3u` with `u=48`. Dividers at `y=208,256` split `y=160…304` into three equal rows. Source and target content share relative coordinates. R16 transfer bends are tangent to their straight segments. Arrow tips `(320,184/232/280)` meet the starting dash; 4.24-offset shoulders produce approximately 6-unit, 45° legs. Switch geometry matches C00/C02. | Static construction passes the inspected relationships. The distinct animation and its sampled cubic transitions were not audited or edited here. The static arrows retain legacy `4 5` dashes and `0.36` opacity; that is a future semantic-style normalization item, not a dimensional failure. |
| **B05 / `service-stripe-payment`**, `app/plotter/service-studies.tsx` | Input pills are 112 wide (`2u`); checkout pill is 56 wide (`u`); all have 32 height/R16 ends. Selected route’s two R16 bends meet straight segments tangentially. Radius leader residual `−0.019387`. Wallet/bank alternatives join the shared route at its final horizontal segment. | Geometry passes. Keep the illustrated Card → `$24 · Paid` outcome scoped to a completed successful payment. Do not imply all bank methods settle immediately or that checkout completion itself proves payment success. Stripe distinguishes session `complete` from `payment_status=paid`, and states that processing may continue after completion. [Checkout Session reference](https://docs.stripe.com/api/checkout/sessions/object). |
| **B08 / `service-notion-blocks`**, `app/plotter/popular-service-studies.tsx` | Incoming block and absent slot both measure `200 × 40`; width `5u` gives `u=40`. Page has 20-unit horizontal margins, 16-unit top/bottom margins, and 8-unit gaps between rows. Both R24 route bends are tangent; arrow tip `(386,300)` meets the first dash and points toward the matching slot. | Checked geometry passes. This is a block-composition analogy, not a claim about an exact Notion screen, fixed block size, or API move operation. Notion identifies headings, paragraphs, and to-do content as block types, which supports this scoped analogy. [Notion block reference](https://developers.notion.com/reference/block). |
| **S04 / `state-offline`**, `CloudForm`, `CloudGap`, and `OfflineStudy` in `app/plotter/system-state-studies.tsx` | Paired route uses concentric R32/R48 bends around `(240,296)`, giving a 16-unit band and R40 centerline. Gap `268 − 236 = 32`. R40 leader residual `−0.006040`. Cloud lobe seam residuals against the intended R30/R48/R36 generating circles are all below `0.006607`; their nominal bottom tangencies share `y=200`. | Checked construction passes the serialization tolerance. Adjacent cloud lobes intentionally intersect; they are not mutually tangent fillets. Offline/sync wording is illustrative empty-state copy, not verification of application connectivity or storage behavior. |

## Coverage inventory

These 43 codes and IDs were included in this bounded source reading:

| Codes | Study IDs |
| --- | --- |
| P01, P02, P03 | `primitives-tangency`, `primitives-radius`, `primitives-proportion` |
| C00, C01, C03 | `particles-reference`, `particles-assembly`, `particles-recombination` |
| K02, K03, K06, K07, K08 | `cal-availability`, `cal-time-zones`, `cal-week-grid`, `cal-time-modules`, `cal-availability-plan` |
| I03, I04, I05, I06 | `interface-spacing-plan`, `interface-browser-plan`, `interface-phone-plan`, `interface-chat-plan` |
| W02, W03, A03 | `workflow-branch`, `workflow-switch-plan`, `data-coordinate-plan` |
| O03, O04, O05 | `object-keyboard-plan`, `object-lamp-elevation`, `object-folder-plan` |
| B05, B06, B07, B08, B09 | `service-stripe-payment`, `service-github-merge`, `service-figma-constraints`, `service-notion-blocks`, `service-supabase-relations` |
| T01, T02 | `type-letter`, `type-monogram` |
| S01, S03, S04, S05, S06, S07 | `state-missing-page`, `state-search`, `state-offline`, `state-notifications`, `state-files`, `state-data` |
| S08, S09, S12, S13, S14 | `state-access`, `state-email`, `state-location`, `state-bookings`, `state-image` |
| E00, E01, E02, E06 | `404-reference`, `404-doorway`, `404-interrupted-path`, `404-unbuilt-arch` |

The separate audit covers **P00, C02, B01, B02, B03, B04, S10, S11, O06, W04, W05, O07**. Its own findings and limitations still apply.

No registered static study remains outside the combined source-reading inventory. This means coverage of each principal construction, not exhaustive proof of all serialized paths, a pass on every legacy fill/line role, or visual approval. Compact variants were read when they shared the inspected geometry, but were not independently rendered here. Motion sequences remain outside this static addendum; the main audit separately records the bounded M03 checks.

## Transparency scan across all 55 studies

At the original source snapshot, all 55 registered hero drawings successfully rendered to SVG for an automated inherited-fill scan. The later S01/S10/S11/engineering revisions were source-read for fills; they add no area patch or background fill (the RC junction retains its semantic foreground dot). The full 55-drawing automated scan was not repeated after those revisions. The scan excluded text and did not flag ordinary `currentColor` semantic dots. It identified background-token fills or translucent area tints in **26 studies**:

`P00, P02, P03, C01, C02, K02, K06, K07, K08, I06, W03, A03, B01, B02, B03, B04, B05, B06, B07, B09, T01, T02, E00, E01, E02, E06`.

Those surviving fills conflict with the newer transparent-form direction. The count is a mechanical inventory, not permission for a blanket deletion: some currently conceal continuous guides or wires, so each affected composition needs its paths inspected when the fill is removed. This pass did not replace fills with another patch, normalize historical line roles, or change approved composition geometry.

## Checked source snapshots

SHA-256 after the narrow E01/E06 corrections; the S10-containing source and engineering source hashes below were refreshed after their separately documented re-review. The new shared S01 and M03 hashes are in the main audit.

| File | Hash |
| --- | --- |
| `app/plotter/not-found-architecture-studies.tsx` | `cddb10767627b6d07aab10548b1b51cdbd1b0540bb5cb33d697a8df013f51fe7` |
| `app/plotter/not-found-geometry-studies.tsx` | `f9760542d6d79088bd33aa64af1d14ac60abc1a7b735dd4bae1f8fea87207e71` |
| `app/plotter/object-studies.tsx` | `c59c5a103b7c1e399d5c1c94003acd6e3a29b56ebe5ee5a8989ce0bb200a7e30` |
| `app/plotter/engineering-studies.tsx` | `0c2ef29222c874e1777fb62fc0dd3059b683deebbbf2caf1e50420ba30b922b2` |
| `app/plotter/original-particles-blueprint.tsx` | `085026c3b3843bb2ab144e1fe147533e5af48587673e1f94cc4e8d1c0bd31cdc` |
| `app/plotter/particles-blueprint.tsx` | `3f6da32aac516cbf8ac987277ec3f69b242a8453cf16de663b7b71b62297ec51` |
| `app/plotter/service-studies.tsx` | `fb16277ad79c6aacb3734d9e34b09816d29cc7ec8615260329a3cd8541d5f912` |
| `app/plotter/popular-service-studies.tsx` | `1331a3236bca39518600580d0aaf696dbd452ec79505fc1ea66fdcc6c3d5c12e` |
| `app/plotter/system-state-studies.tsx` | `0ba231cd9b1069e28c6a5bea028758c39812fcd5c45f313f1eab2f0d86008f30` |

Re-run source checks and update these hashes after further edits. No source reading or attribute scan establishes thumbnail readability, narrow-layout quality, or user approval.

Local review captures are not bundled with this skill. Regenerate the named views from Plotter when reviewing another checkout; source hashes identify the inspected revisions.
