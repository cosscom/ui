# Plotter source audit

Recorded 2026-10-25 against the working tree based on HEAD `f6da7e24`. **Revision status:** O06, W04, W05, O07, S10, S11, and the new S01-based M03 were re-read and recalculated after user feedback. Their older board, bore/insert sequence, involute-gear, wall-socket, and plug-animation findings are superseded. The file hashes below identify the inspected revisions; subsequent edits invalidate affected checks. This bounded source, geometry, and meaning review does not certify the gallery.

## Evidence and verdict scope

- **Source checks performed:** read TSX geometry, inherited stroke/fill roles, SVG path commands, labels, descriptions, and the drafting standard for P00, C02, B01–B04, S10, S11, O06, W04, W05, O07, and revised S01/M03. Two replacement coss concepts have separate coverage below; the former seven were rejected for visual quality.
- **Independent calculations performed:** recomputed distances, units, incidence, tangency, angles, RC arithmetic, gear pitch geometry, cradle trajectory intersections, and marker clearance with Python’s `math` functions. The new gear profiles also received a sampled static nonintersection check.
- **Implementation evidence:** this reviewer ran Biome and focused strict TypeScript checks on the earlier corrected sources. The authors report full UI TypeScript and scoped Biome passes after the new revisions. These are attributed build results, not independent re-runs by this reviewer. Showcase corrections are separate from production integration.
- **Render review performed:** independently viewed author-rendered PNGs of all four revised engineering studies and rasterized current S10/S11/S01 SVGs. The latter rasterizer used fallback fonts; it establishes shape visibility, not browser typography. Parent browser evidence is attributed below. Final guide-only cleanup was source-reviewed; saved images may precede it.
- **Mechanism limitation:** static profile separation does not prove conjugate motion, actual tooth contact, load capacity, or manufacturability. No older involute/collision-phase result applies to the new schematic gear profiles.

PASS below means the named claim was checked. NEEDS QUALIFICATION means a wider claim lacks evidence or a convention remains ambiguous. Legacy style findings are not silently converted into passes by a geometry result.

The [remaining-source audit](remaining-source-audit.md) covers the other 43 principal static constructions, including E01/E06 callout corrections and the gallery-wide fill inventory. Revised S01 is rechecked here without adding another registered study. Together these reports cover all 55 principal constructions; they do not establish exhaustive path correctness or complete style normalization. M03 motion and the coss concepts are separate from that count.

### Current integration render evidence

The parent confirmed inspecting revised S10/S11 in hero and 96-pixel compact presentations, and exercising new M03 movement, Pause/Resume, and Show static/Play animation. Saved parent evidence: revised gears (`plotter-gears-revised.png`, local capture), revised socket (`plotter-socket-revised.png`, local capture), S01-based M03 (`plotter-s01-animation.png`, local capture). The M03 capture precedes the final guide/leader cleanup. These observations do not constitute user approval.

The parent previously reviewed the nine-box O06 revision with contacts in light/dark themes, plus O06/W04/W05/O07 as dark gallery thumbnails beside approved references. The user subsequently called that O06 revision “bland” and also rejected its 5× compute-detail replacement. Those two render snapshots are historical; neither establishes approval of the current CPU-board direction. Saved evidence includes final GPU (`plotter-gpu-revised.png`, local capture) and dark object gallery (`plotter-objects-dark.png`, local capture). The parent reports final full reloads without the development-issue badge; transient edit-time hydration messages remain only in historical logs. This is attributed observation, not this reviewer’s independent console inspection. A complete theme/mobile pass across the whole collection was not reported.

### User-feedback criteria checked

| Study | Revised evidence |
| --- | --- |
| W05 | One conveyor carries identical open frames at constant pitch; a matching core descends at the center station and is seated in the right frame. |
| W04 | A 24-unit grid locates routing/terminals and is trimmed around wires, symbols, and labels. Topology and RC arithmetic remain consistent. |
| O06 | The user rejected the compute-array/detail studies and requested a recognizable board with a CPU. Latest feedback removes the enclosing card and mounting holes, asks for dashed lines, and calls the composition crowded. The revised open drawing retains the CPU and pins, reduces ten routes to four, removes the lower contact bank, spaces memory farther away, and adds dashed center axes. |
| O07 | A restrained fixed support replaces the surrounding frame; exact strings, tangent rest positions, release arc, and dimensions remain legible. |
| S11 | The female flange, recessed body, and contact pockets are separate from the hatched support; mouth gap and mating axes agree. |
| S10 | 10/8/6 broad, rounded schematic teeth replace 24/18/12 finely sampled teeth. Static geometry and pitch relationships agree. |
| M03 | The S01 route/page construction is shared by static and animated views. Its request follows the route centerline and leaves the missing address gap intact. |

## Corrected reference drawings

| Study / source function | Calculation and evidence | Current result |
| --- | --- | --- |
| P00 / `primitives-blueprint.tsx: PrimitivesBlueprint` | Square `240×240`; `u=40`; circle `(284,204), r=120=3u`; four side tangencies and the 45° diagonal agree. Radius endpoint is now `(284+120/√2,204−120/√2)`; angle arc endpoint is `(284+24/√2,204−24/√2)`. Incidence residuals are floating-point roundoff. Cap tip shares the radial endpoint. | **PASS geometry.** Original radial residual `0.20815` is corrected. Legacy style exceptions remain below. |
| C02 / `system-studies.tsx: ModularTrayStudy` | `u=22`; `412−148=264=12u`; widths `110=5u`, `132=6u`; gap `280−258=22`. Switch `30×18`, `R9`; thumb `R5.5`, right/top/bottom inset `3.5`. | **PASS geometry. NEEDS QUALIFICATION for convention:** the dashed layout-allocation box is not a physical hidden edge; document its conceptual role. |
| B01 / `service-studies.tsx: CloudflareEdgeStudy` | Edge `224×224=4u×4u`, `u=56`; cache `R44`; radius-leader residual `0.01796<0.05`. Hit path returns toward visitor; miss path goes toward origin. | **PASS scoped example:** a cache-eligible request with simple hit/miss outcomes. Other statuses, tiered cache, and the whole Cloudflare service are outside its scope. [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/) |
| B02 / `service-studies.tsx: VercelDeploymentStudy` | Frames `144×72`, `R12`; spacing `192−168=24`; index `02` identifies the same source version. Description allows a rebuilt production artifact. | **PASS scoped explanation.** Preview promotion rebuilds; staged production promotion is a different flow. [Vercel promotion](https://vercel.com/docs/deployments/promoting-a-deployment) |
| B03 / `service-studies.tsx: StripeSettlementStudy` | `4×64=256`; `4×$25=$100`; `u=64`. Label now says “Gross payments”; description excludes fees, refunds, and availability. Stable ID retains `settlement`; visible title is “Payments, combined.” | **PASS arithmetic and bounded meaning.** Gross aggregation does not depict actual net/available balance or full settlement/reconciliation. [Stripe balance transactions](https://docs.stripe.com/api/balance_transactions/object) |
| B04 / `service-studies.tsx: LinearCycleStudy` | `u=68`; `408−136=272=4u`; illustrative weeks each span `2u`; pills `R16`; rounded radius-leader residual `0.01939<0.05`. Marker now says “Cycle end”; release equivalence removed. | **PASS geometry and corrected scope.** Two weeks is this example, not a universal duration or release boundary. [Linear cycles](https://linear.app/docs/use-cycles) |

## Revised mechanical and missing-destination studies

### S10: `system-state-studies.tsx`, `gearOutline`, `MaintenanceStudy`

The new model uses common module `m=14` and `10/8/6` teeth. Pitch radii `70/56/42` satisfy `r=mz/2`; chosen schematic root radii are `60.9/46.9/32.9` and tips `76.3/62.3/48.3`. Those root/tip proportions and rounded trapezoidal profiles are house illustration choices, not standard involute geometry. Common module/pitch is a meaningful reference relationship; it does not make arbitrary profiles conjugate. [KHK gear-mesh explanation](https://www.khkgears.us/media/1256/gear-mesh-and-tooth-modifications.pdf)

Centers are `(176,192)`, `(350,192)`, `(408.8,270.4)`. The smaller pair’s distance is `hypot(58.8,78.4)=98=56+42`, with pitch contact `(383.6,236.8)`. A tooth faces a valley along that centerline. Main-drive pitch gap is `174−70−56=48`, matching the dimension witnesses at `x=246/294`. This is a pitch-circle gap, not the shortest outline clearance.

The reviewer independently rebuilt the same rounded outline equations and sampled each quadratic join at 20 subdivisions. In the static pose, segment intersections were zero; sampled minimum outline clearances were approximately `36.011` for the separated drive and `2.329` for the smaller pair. This bounded numerical check is not a proof for every point or other phases, and the visible clearance does not establish physical tooth contact.

**PASS:** tooth counts, pitch radii, center spacing, phase relation, labeled gap, and sampled static nonintersection. **NEEDS QUALIFICATION:** engagement is schematic. No pressure-angle, conjugate-motion, continuous-contact, strength, or manufacturing claim is supported. The old 25° involute and 25-phase checks are superseded.

### S11: `disconnected-plug.tsx`

The female socket is now a distinct section: flange `x=344…356`, recessed body to `x=400`, and two contact pockets ending at `x=388`. The support plane is `x=356`; it is separate from the mouth at `x=344`. Male pins end at `x=264`, so the depicted mouth gap is `344−264=80`. Pins/pockets share centers `y=196/244`, spacing `48`, and height `12`. Pocket depth `388−344=44` exceeds pin protrusion `40`.

S1 support hatch uses 16-unit strokes at −45° and `.65/.27`, only outside the body opening. It is a fixed-support convention, not material identification. Movement arrows use rounded `4.243` shoulder offsets, producing approximately `6.00051`-unit legs at 45°, within the house serialization threshold. Dashed shafts start at their tips. Duplicate horizontal-dimension witness segments found during review were removed; longer witnesses now meet the helper’s terminal segments at `y=146`.

**PASS:** separate socket/support geometry, pin/pocket alignment, gap and spacing labels, and the checked line-role corrections. **NEEDS QUALIFICATION:** nominal geometry does not establish electrical type, safe electrical construction, contact force, or a manufactured fit. S11 is static; M03 no longer animates this drawing.

### S01 and M03: `missing-destination.tsx`, `not-found-motion.tsx`

Static S01 and animated M03 share the same route/page component. The paired route remains `16` wide, with concentric `R24/R40` bends and an `R32` centerline. It ends at `x=272`; the absent-page reference plane at `x=304` gives `u=32`. The source preserves those primary shapes while splitting guides around them. The external R40 leader meets the outline at `(211.716,215.716)`; radial residual is approximately `−0.000384`, below the `0.05` house threshold. Its two open-cap legs are exactly six units and 45° to the diagonal shaft.

The hollow request marker has radius `3.5` and follows `M122,296 … H266`, length `54 + 32π + 20 + 26 = 200.530965`. Its maximum center is `x=266`; including its `.95` stroke, its right edge is `269.975`, leaving `2.025` units before the route end and the full 32-unit address gap unbridged. Both bends follow the true centerline; the moving outline stays within the route.

The `8.4s` loop has monotonic keyTimes and six matching keyPoints. It pauses at each end and returns on the same path, so the loop closes without a jump. Source retains Pause/Resume, Replay, static fallback, reduced-motion hiding/pausing, and offscreen pausing. Parent browser review observed movement, Pause/Resume, and Show static/Play animation. Replay, reduced-motion behavior, and offscreen behavior were source-read but not independently exercised here.

**PASS:** shared geometry, radius incidence, marker clearance, and source-level loop/control wiring. **NEEDS QUALIFICATION:** this is a request/absence metaphor, not a timing or network-behavior model. Browser evidence is scoped to the controls actually exercised; the last guide cleanup followed the saved M03 capture.

## Revised engineering studies

| Study / function in `engineering-studies.tsx` | Independent verification | Scope and verdict |
| --- | --- | --- |
| O06 / `ProcessorBoardStudy` | CPU package remains120 square with eight pins per side, pitch `p=12`, pin width4 and length12; first-to-last center span84=`7p`. The die56 square and RAM40×96 share center height204. Two routes per side at174/234 are symmetric about that center: left from I/O circle edges128 to CPU pin ends208; right from CPU pin ends352 to RAM pin ends404. The board enclosure, holes, lower bank, and six surplus routes are removed. Dashed axes use `8 3 1 3` at `.6/.24`; the grid omits its coincident x280 column. | **PASS named geometry and contact incidence.** This is a hypothetical processor layout, not a functional CPU/RAM circuit, vendor pinout, manufacturing layout, or electrical safety claim. |
| W04 / `RcFilterStudy` | Grid pitch `24`; terminal centers `112/448`, resistor endpoints `184/256`, and junction `328` have the same x phase. Wire `y=184` shares the row phase. Vin reaches R1, whose output and Vout share junction `(328,184)`; C1 connects that node to the lower reference. Plates at `y=256/268` stay separated; grid gaps avoid false electrical continuation. `R=1000Ω`, `C=100×10⁻⁹F`: `τ=100μs`, ideal `fc=1591.549Hz`. | **PASS topology, grid purpose, arithmetic** for an ideal unloaded low-pass referenced to the lower node. Individual IEC 60617 entries were not authenticated; no compliance claim. [TI passive-components lesson, p.13](https://www.ti.com/content/dam/videos/external-videos/zh-tw/4/3816841626001/6119035031001.mp4/subassets/passive_components_and_circuits_2.pdf) supports this topology. |
| W05 / `ProductionChainStudy` | Carrier centers `144/280/416` have pitch `136`. Each frame is `64×64`, with 8-unit walls and a `48×56` opening. The incoming `48×48` core seats at `y=208…256`, leaving 8-unit headroom; final core edges share the frame’s existing side/bottom segments rather than retracing them. Conveyor has `R16` ends and `R8` rollers. Arrow tips `(304,288)` and `(280,200)` meet starting dashes; cap legs are 6 at 45°. | **PASS assembly-line relationship and nominal geometry.** Carrier locations, loading direction, and seated state agree. Equal nominal core/opening widths do not prove a toleranced fit or a production-machine design. Guide/terminal overlaps identified in review were removed. |
| O07 / `NewtonsCradleStudy` | `u=r=22`, pivot-to-center `L=176=8u`, center spacing `44=2u`; rest centers at `y=296`. Released center `(128,272.420471)` is exactly 176 from `(216,120)` at 30°. Strings are trimmed to anchor radius 2.4 and bob radius 22, leaving exposed length 151.6. With `δ=2asin(22/(2·176))`, trajectory endpoints lie exactly 22 from the corresponding bob centers. Independent residuals are about `10⁻¹⁴`; tangent-cap legs are 6. Radius and 30° angle callouts derive from the same constants. | **PASS ideal construction and the checked line-role cleanup.** S1 hatching identifies a fixed support. This planar release diagram does not simulate collisions, damping, restitution, or subsequent motion. Refined support and dimensions were visually readable in the saved raster and parent enlarged preview. |

For the preceding revision, the reviewer inspected four author PNGs, including the now-superseded GPU contact-bank raster (`plotter-gpu-contacts-source-review.png`, local capture); parent independently reviewed W04/W05/O07 enlarged in the light theme. Later line-ownership cleanup changed only guide extents. Saved parent evidence: circuit (`plotter-circuit-revised.png`, local capture), assembly line (`plotter-assembly-line-revised.png`, local capture), cradle (`plotter-cradle-revised.png`, local capture). These are review observations, not approval as permanent style references.

The prior 5× O06 detail was checked mathematically and inspected in the browser, then explicitly rejected by the user in favor of a recognizable board with a CPU. The old `plotter-gpu-focal-detail.png` capture is a rejected revision, not current review evidence. The shared-coordinate scaling check does not apply to the replacement board.

The enclosed CPU-board capture `plotter-cpu-board.png` is superseded by the open processor revision. The new drawing was inspected in the enlarged light-theme preview and Objects gallery; current capture: `plotter-cpu-open.png`. Biome and the full UI typecheck pass. A separate read-only source review confirmed the four pad incidences, concentric CPU/die, shared CPU/RAM center, exact84-unit pin span, and nonduplicated axes; its suggested isolated-axis tick cleanup was applied. Its visual acceptance remains open; it has not joined the approved reference set. W04/W05/O07 source was verified byte-for-byte unchanged from the version immediately before this O06 edit.

## Remaining cross-cutting findings

1. **Legacy transparency:** P00 retains a `.035` area tint and background-colored point fills; C02 and B01–B04 retain background-colored shape fills. These conflict with newer transparent-form guidance. Only requested math/wording corrections were made to those approved compositions; no blanket restyling was performed.
2. **Legacy line roles:** approved sources retain historic dash sequences and opacities. Assign meaning before normalization; text replacement cannot identify centers, hidden features, allocation boxes, and hypothetical transfer.
3. **Coincident segments:** some older grids retrace construction/object segments. P00’s `x=164` and `x=404` occur in both grid and construction layers. These remain future cleanup, not a verified one-owner result.
4. **Symbols and behavior:** RC topology and gear pitch math pass their named checks. Individual IEC database symbols and manufacturing validity were not authenticated. Geometric consistency and physical completeness are separate claims.
5. **Rendering:** source results do not prove label clearance, optical hierarchy, responsive appearance, or user acceptance. Edits invalidate earlier render snapshots of affected drawings until rechecked.
6. **Separate production follow-up:** `apps/ui/components/primitives-blueprint.tsx` still has P00’s original rounded radius/angle endpoints. Its production integration belongs to a separate worktree/PR; synchronize the exact showcase correction there as a separate change. This audit does not claim that production duplicate is corrected.

## Replacement coss concepts: bounded review

The user rejected the original X01–X07 set for poor quality relative to the established drawings. The prior bus/catalog/comparison geometry checks are historical and do not apply to the replacements. That code was removed from the local showcase. New X01 and X07 remain proposals, outside the 55-study inventory and the approved reference set.

- **X01 / `common-interface-study.tsx`:** one central opening has radius `64 = 2u`, with `u = 32`. The upper-right piece is translated by exactly `(32, −32)`; its corresponding opening quadrant and projection witnesses use the same radius. The assembled three-quarter opening and the two internal seams each have one primary path owner. The selected lower-left profile band is analytically bounded by radii 64 and 80. Hatching identifies the common profile, not a physical material.
- **X07 / `shared-system-study.tsx`:** the `240×240` square uses `u = 60`. Two circle centers at `(280,148)` and `(280,268)` are `120 = 2u` apart; equal R60 arcs meet tangentially at `(280,208)`. Their complementary semicircles generate the shared S-profile. The outline/seam are separate single paths; the opposite half-circles and axes are construction references. The radial arrow endpoint is computed with `60/√2` offsets.
- **Meaning:** these are compatibility metaphors for a common SDK contract. They do not assert physical construction, infrastructure topology, or implemented Video/Scheduling API availability. The [product claim mapping](coss-product-concepts.md) retains primary-source evidence and those limits.

Parent browser review inspected the pair in the local two-column section in light and dark themes. Saved capture: `plotter-coss-interface-studies.png` (local capture). Source geometry and visible hierarchy are separate from user acceptance; no reference approval or coss.com publication is implied. Narrow-screen layouts were not independently exercised.

Checked SHA-256 prefixes under `app/plotter/coss-concepts/`:

| File | SHA-256 prefix |
| --- | --- |
| `common-interface-study.tsx` | `ecec2d1d7d62` |
| `index.tsx` | `9782beedc977` |
| `shared-system-study.tsx` | `0af177359ce1` |

## W05 and O07 motion experiments

These separate showcase animations retain the original static gallery drawings. They have not been selected as motion references.

- **W05, preceding revision:** the 2.25-second refinement shortened the former 3.0-second cycle. The rigid 48×48 core drops 80 units from 0.04–0.42s; a restrained 0.35-unit rebound settles at 0.470269s. Indexing starts 20ms later and finishes at 1.590269s. Feed finished at 2.16s, leaving 0.13s until the next drop. All core edges share one sampled displacement function and exact wall/floor ownership. Motor/feed interpolation uses cubic constant-jerk ramps with continuous position, velocity, and acceleration at joins. The author checked 9,001 serialized phases: rigid size, exact 136-unit pitch and 272-unit feed travel, no penetration, and gravity-curve approximation error below 0.01 unit. Calculated start/end rasters were identical. The current timing is recorded below. This remains an illustrative gravity/contact model with a driven conveyor, not a machine simulation.
- **O07, preceding revision:** the 1.8-second cadence used a restrained 26° release. Energy-derived cubic segments replaced linear angle chords, giving exactly zero endpoint speed at each turnaround and continuous flight velocity. Contact occurred at 0.45s/1.35s with matched speed magnitude 91.152327°/s and no dwell. The author checked 36,001 poses: no bob overlap, fixed 176-unit strings (residual below 6×10⁻¹⁴), complete disk bounds x116.847…491.153/y256.188…318, and a closed seam. Serialized velocity-continuity error was below 4.6×10⁻⁷°/s away from impacts. The current calibration is recorded below. Damping, compliance, finite contact duration, and interior dynamics remain omitted. A visually delayed wave through tangent rigid disks was rejected because it would require unmodeled deformation or gaps.
- **Presentation:** parent browser review confirmed active 2.25s/1.8s spline timelines and observed moving phases. The fixed support/grid, transparent forms, static gallery drawings, and annotations remain unchanged. Replay and Pause/Resume passed the preceding revision and their shared controls are unchanged. Offscreen pausing and reduced-motion static fallback remain source-reviewed rather than independently emulated. Capture from that revision: `plotter-w05-o07-rhythm.png` (local capture). The former `plotter-w05-o07-physics.png` and `plotter-w05-o07-animations.png` record superseded motion.
- **Checks:** scoped Biome and full UI TypeScript checks pass. Existing W05/O07 static functions were only exported for preview fallbacks; their geometry is unchanged.

**Current W05 cadence:** the fast 0.70s delivery is retained, now at 1.00–1.70s within a 1.8s cycle. Visible feed starts at 1.171471s, overlapping the last 0.418799s of indexing. The next drop starts at 1.84s, giving a 0.14s handoff. Drop, rebound, and belt trajectories are unchanged in absolute time. The author rechecked 9,001 serialized phases for rigid size, contact ownership, and penetration, and compared pixel-identical loop endpoints. A separate read-only review found no source-level handoff or loop defect. Parent added fixed reference guides at y=124/180, x=80…248: 4 units clear of the incoming core's y=128…176 bounds and 8 units short of its x=256 drop edge. They do not cross moving parts or cover lines. Biome and diff checks pass; browser review confirms the 1.8s timelines and revised guides in moving phases. Full TypeScript was not rerun for these timing constants and SVG path changes. Capture: `plotter-w05-overlapping-feed.png`. The prior `plotter-w05-faster-feed.png` records the superseded sequential feed.

**Superseded O07 timing calibration:** the same nonlinear quarter-flight integral K=1.591254382 now produces the duration as `4K√(0.30/9.80665) = 1.1132684299524582s`, rather than normalizing to a hardcoded 1.8s. The chosen 0.30 m length calibrates the motion; it is not a measurement of the drawn object. The earlier timing implied approximately 0.78427 m under the same model. Contacts occur at 0.2783171075/0.8349513225s, with matching incoming/outgoing speed magnitude 147.3806178°/s. Two source reviews confirm 385 serialized values/keyTimes, 384 valid spline segments, strictly increasing times, zero-speed turnarounds, and matching loop endpoints. The author rechecked 36,001 poses and agreement with the independent energy relation within 0.000006°/s. Geometry, bounds, annotations, and ideal collision assumptions are unchanged. Browser review confirms both 1.113268s timelines and moving phases; capture `plotter-o07-calibrated-swing.png`. Scoped Biome and full UI TypeScript checks pass. The governing nonlinear pendulum equation is described in [OpenStax, Pendulums](https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums); the 30 cm calibration is a house choice, not a value from that source.

**O07 video reference:** the user then supplied [this video](https://www.youtube.com/watch?v=09vzFodz4SI). Parent inspected opening playback and paused/stepped frames around 15–17.64s in the browser; this was not a full-hour viewing. The observed visual rhythm suggests roughly a 2.4s cycle and 30° release, superseding the arbitrary 30 cm calibration. These are approximate visual estimates, not motion-capture data. O07 uses those values with the same nonlinear pendulum flight and instantaneous contact model. Full swept disk bounds are x106…502, y250.420…318; the outer guide fragments retain at least 6/8 units of horizontal clearance. Browser confirms active 2.4s timelines and a 30° starting release. Read-only review confirms valid serialized splines, zero-speed turnarounds, matched contact speeds of 78.99743219°/s at 0.6/1.8s, and exact loop endpoints. Across 36,001 poses, no disk overlap or string-length drift above 5.7×10⁻¹⁴ was found. Biome passes. Capture: `plotter-o07-video-rhythm.png`. The previous `plotter-o07-calibrated-swing.png` records the superseded faster trial.

**O07 speed adjustment, before interior movement:** the user requested a slight speed-up with unchanged easing. The duration shortened from 2.4s to 2.2s, then to 2.0s after a further speed request (10% faster than the 2.2s trial). Browser comparison confirmed both animations retained byte-identical `values`, `keyTimes`, and `keySplines`; the 30° geometry, normalized motion, contact ordering, and loop were unchanged. Contact times scale to 0.5/1.5s. Biome passed. Capture: `plotter-o07-two-second-cycle.png`.

**O07 interior movement, before turnaround emphasis:** the user next requested subtle movement of the three middle balls, as in the reference. A shared secondary angle `β = 0.025θ` gives them a ±0.75° sway; the resting outer follows the same angle. Each bob still rotates about its own fixed pivot. Read-only review sampled 60,001 signed outer angles: the touching four-ball group keeps 44-unit center spacing within 2.9×10⁻¹⁴, and the active outer never overlaps it. Maximum interior drift is 2.303769 units horizontally and 0.015078 vertically; complete bounds and guide clearances remain unchanged. The central mark and radius-leader tip track the middle bob while the label stays fixed. Browser comparison confirms the active outer angles and spline strings remain byte-identical to the preceding version; all five pendulums share its 385 key times and 2s duration. Per-segment endpoint velocity scaling preserves the intended end-ball handoff without a delayed interior wave. This is a phase-locked motion approximation, not a solved five-body contact model. Scoped Biome and full UI TypeScript checks pass; the moving preview and Replay were inspected. Capture: `plotter-o07-middle-sway.png`.

**Current O07 turnaround emphasis:** the next request asks for more slowdown at the highest point and a faster departure/return at impact. Quarter-flight time is remapped with `F(q) = q + 0.25 sin(πq)/π`; its derivative stays in `[0.75, 1.25]`, with velocities adjusted by the chain rule. The 2s loop, 30° outer swing, and ±0.75° shared sway remain. Read-only review confirms 385 values, 384 valid monotone spline segments, strictly increasing key times, no overshoot or hold, and unchanged contacts at 0.5/1.5s. Main/contact speed is 126.3958915°/s, one-third above the previous curve; the shared speed is 3.1598974°/s. Turnaround speed remains zero, and the loop has no position/velocity seam. This deliberately accentuates the illustration’s timing rather than preserving the unmodified gravity trajectory. Browser comparison confirms unchanged angle values and updated timing for all five pendulums; the moving preview and Replay were inspected. Biome and full UI TypeScript checks pass. Capture: `plotter-o07-turnaround-emphasis.png`.

Checked source hashes under `apps/ui/app/plotter/`:

| File | SHA-256 prefix |
| --- | --- |
| `production-chain-motion-drawing.tsx` | `62af5a7164d8` |
| `newtons-cradle-motion-drawing.tsx` | `3930716d38c6` |
| `engineering-motion-preview.tsx` | `7e194f9de588` |
| `engineering-motion-preview.module.css` | `47531e974a1a` |

## Reproduction notes

Recompute from current source after edits. Preserve exact relationships and report residuals against house serialization thresholds (`0.05` SVG unit, `0.1°`), never as manufacturing tolerances. File hashes recorded below identify this source snapshot; unrelated working-tree edits may continue.

SHA-256 prefixes, all under `apps/ui/app/plotter/`:

| File | SHA-256 prefix |
| --- | --- |
| `primitives-blueprint.tsx` | `be989e00c285` |
| `service-studies.tsx` | `fb16277ad79c` |
| `system-studies.tsx` | `04de74c464c9` |
| `system-state-studies.tsx` | `0ba231cd9b10` |
| `disconnected-plug.tsx` | `7bd9b1e03e5d` |
| `engineering-studies.tsx` | `343bd2dc51c5` |
| `missing-destination.tsx` | `e3ba6a8f8bed` |
| `state-studies.tsx` | `c7190028b3fc` |
| `not-found-motion.tsx` | `01d467710cbd` |
| `not-found-motion.module.css` | `47531e974a1a` |

Local review captures are not bundled with this skill. Regenerate the named views from Plotter when reviewing another checkout; source hashes identify the inspected revisions.
