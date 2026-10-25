# Direction and feedback

Evidence captured from the coss UI illustration reviews on 2026-10-24–25. This is a living art-direction record, not a claim that every study has been approved.

## Current references

The user explicitly selected the [27 approved references](approved-references.md) on 2026-10-25. Use that exact set for future drawing and critique. It supersedes the earlier blanket emphasis on original Primitives/Particles and the historical pending-review labels below. Other current examples need refinement or a clearer fit; the user did not yet specify a reason for each and did not ask to remove them.

Original Primitives/P00 and Linear/B04 remain approved. Original Particles/C00 is now a historical reference. Earlier endorsements of a particular detail, such as C00’s arrow caps, remain evidence about that detail rather than approval of the whole composition.

## Reference-led refinement pass

The user next asked to improve the remaining drawings using the selected references. All 24 candidates were revised in place: C00, C03, P01, K03, I04, I05, W02, O03, O04, O05, B08, S01, and S03–S14. Their IDs and subjects remain stable; the 27 approved SVGs are unchanged. These new revisions await user review and are not additional style references.

The implementation response concentrates each drawing on one relationship:

- P01 shares a tangent between two radii; K03 aligns one booking across two hour scales; W02 selects one route through a measured junction.
- C00 repeats an inset across fragments; C03 recombines equal-width parts into three equal rows; B08 inserts a reusable block into a matching page slot.
- O03 shows quarter-pitch stagger, I04 an enlarged browser corner, I05 a concentric frame and safe area, O04 a semicircle on its support axis, and O05 a tab shared by two folder widths.
- The empty states give absence a structural role: a missing index entry, an ended notification stream, an unwritten page, an empty coordinate field or week, an unoccupied image frame, an interrupted route, a locked boundary, a pending message, separated pitch circles, disconnected contacts, or an unresolved location.

The revised forms are transparent. Grid paths are omitted or split where they would add noise or cross labels; no background patches hide them. Hero and compact empty-state versions were checked separately. This pass changes the showcase’s static studies, not the production heroes or the animation sequences.

### Follow-up on the revised set

The user reviewed ten studies and gave these corrections. This is specific feedback on the reference-led pass, not approval or rejection of the other revisions:

- **C00/C03:** the user clarified that C02 is the switch reference. Use its 30 × 18 track, R9 corners, R5.5 thumb, 3.5 inset, and primary 0.95 stroke at full opacity. Matching C00 to C03’s muted secondary stroke did not resolve the inconsistency; geometry and stroke treatment must both match C02. The animated switch already follows this treatment.
- **I04:** the browser’s upper-left radius is excessive and its three chrome circles are undersized. Reduce the corner and enlarge/re-align the controls within the same detail crop.
- **I05:** the external lines feel bland. Use exterior dimensions and extensions to explain the frame and safe-area insets; extra lines need a geometric purpose.
- **B08:** the insertion route and arrow should be dashed. Treat it as movement, with a solid open cap meeting the first dash at its tip.
- **S13:** the circle around Wednesday feels inconsistent. Use a restrained weekday underline while retaining the column alignment.
- **S08:** the lock body lacks construction geometry. Explain the rounded body, keyhole axis, and their relationship, not just the shackle.
- **S09:** the separated letter/envelope result is not liked. The response uses one open envelope with its folded flap projected across the crease.
- **S10:** the two-gear result is not liked; the user suggests a third, smaller gear. The response uses a 12/8/6-tooth train: the smaller pair engages while the main drive remains separated. Keep tooth pitch and construction circles coherent across the mechanism.
- **S11:** the symmetric plug/socket revision is worse; the user preferred the former wall section on the right. Restore the fixed wall/socket relationship and its section hatching.
- **S12:** the composition is too vertical. Broaden the coordinate field and shorten the pin-to-target relationship without rotating the represented object.

These responses remain subject to review. Preserve the other studies, the approved reference set, and the animation work.

## Production selections

The user explicitly selected **P00** for the main page, [**C03** for Particles](particles-recombination.png), and [**E02** for the 404](not-found-interrupted-path.png). These are current implementation decisions. Use the current approved reference set for the broader style; C03’s production selection does not make it a reference. The Plotter showcase owns independent snapshots of the selected drawings, so it can ship separately from the production integration. Original C00 and E00 remain separate examples.

## Historical review evidence

These entries record earlier feedback and its implementation response. Current reference status comes from the explicit selection above.

| Evidence | Status and implication |
| --- | --- |
| C03: requests a third element so the composition becomes “A + B + C” | Revise C03 in place. Added an Open action alongside identity and visibility, repeated as the third row of the assembled panel; three equal rows measure 3u. This is a requested experiment, awaiting review. |
| C03 A + B + C: “it’s not vertical aligned” and the underlying grid “looks bad or it’s sparse” | Optically center the composition within its SVG and use continuous construction guides aligned to component edges and row boundaries. This is the implementation response to the critique, awaiting review. |
| User asks to hide the home and Particles illustrations on smaller screens | Show those two hero drawings only from the existing desktop split-layout breakpoint (`lg`, 1024px). This does not change the 404 or standalone showcase illustrations. |
| User rejects a shared page-hero component and asks for the 404 heading to stay centered with the illustration above | Keep main and Particles split layouts in their pages. Use an illustration-first centered stack for the production 404 page. The showcase presents the drawing on its own. |
| User asks to restore the previous Particles page, then explicitly confirms “Keep C03; restore search beneath heading” and references PR #895 for headings | Keep C03 on the right, restore search beneath the left-aligned heading/description, and remove the added hero CTAs. Use PR #895’s fluid 36–64px heading scale, leading-none, and GEOM50 on the main and Particles pages. |
| User rejected K01, K04, K05, I01, I02, D01, D02, W01, O01, O02, A01, A02, S02; W02 partly | Explicit group feedback: these went beyond the desired set. The stated general boundary was flat 2D electrical/architectural blueprints, with no 3D or skewed views. |
| K06: not clear it is a week | Revised with Mon–Sun, hourly rows, and a labeled Thursday interval. A seven-column grid alone did not establish the subject. |
| K08: good concept, meaning unclear; more labeling suggested | Preserved crossing availability bands and added named people plus a shared-meeting callout. |
| I03: good, not an excellent example | Revised from a single generic row to separate elements projecting into a shared control. |
| W03: a bit weak | Replaced the isolated switch with a switching matrix and one selected junction. |
| W02: does not really seem a blueprint; user could not say why | Replaced rounded endpoint cards and checkmarks with a continuous route whose width, bend radius, and branch spacing are measured. |
| Response to those five revisions: “much better” | Initially collective positive feedback. K06, K08, I03, and W03 were later explicitly selected as references; W02 was omitted. |
| E03/E05 set aside by the assistant | Inferred conflict with the no-tilt rule; not individually rejected by the user. |
| O03 keyboard: “doesn’t look good”; asks to show a portion and use more subtle/dashed lines | Revised as a deliberate keyboard detail with credible staggered rows and modifiers, quiet outlines, and dashed continuation. O03 is outside the current approved reference set. |
| I04 browser: “same problem as keyboard before” | Interpreted as a request for a deliberate enlarged browser detail, with subdued strokes and dashed continuation. I04 is outside the current approved reference set. |
| I06 chat: asks to add an avatar and remove the triangle on the bubble | Pair rounded, tail-free message blocks with circular avatars. I06 was later explicitly selected as a reference. |
| O05 folder: asks for two or three instead of one | Revised as three separate flat outlines sharing tab geometry and alignment. O05 is outside the current approved reference set. |
| E04: “remove” | Explicitly removed. This is a choice about E04, not a blanket rejection of all absence metaphors. |
| E02: good idea but bland/weak | Preserve the idea while strengthening its composition. Selected for the 404 page after revision. |
| B02 Vercel: not loved; wants more conceptual/metaphoric, then asks whether it is accurate and requests improvement | Replaced the broadcast-like aperture with separate preview frames and one selected preview promoted to an identical production frame. “Preview” / “Production” replaces “Draft” / “Live” because previews are already reachable deployments. Matching outlines identify the same source version, not the same build: preview promotion rebuilds for the production environment. The revised B02 drawing was later explicitly selected as a reference. |
| B03 Stripe: “ok”; wants an alternative focused on what it does | Kept B03 and added B05 as an alternative. Both were later explicitly selected as references. |
| B01 Cloudflare: asks whether the representation is accurate | Initially a request for factual review. Scope the concept clearly; B01 was later explicitly selected as a reference. |
| B09 Supabase: points to the crowded connector at owner_id and says it does not look good | Replaced the branching endpoint with a circular port and a short straight approach after the bend. This critiques that junction, not all relationship notation. Revised B09 was later explicitly selected as a reference. |
| B04 Linear: “love the Linear example” | Explicit positive reference for service concepts; preserve it. |
| Request for more popular-service examples | B05, B06, B07, and B09 were later explicitly selected as references; B08 was omitted. |

The earlier K06/K08/I03/W02/W03 revision pass is captured in coss commit `285493c9` on `codex/blueprint-illustration-studies`. The preceding flat-direction pass is `e9077a93`. Preserve this evidence if gallery metadata later changes.

## Showcase curation

The user subsequently asked to remove unwanted and discarded examples and turn the lab into a showcase named **Plotter illustrations**. The gallery at `/ui/plotter` has category filters and enlarged previews. Shortlists, review controls, and page-hero mockups have been removed.

The 13 explicitly rejected entries (K01, K04, K05, I01, I02, D01, D02, W01, O01, O02, A01, A02, S02) and the assistant-set-aside E03/E05 were removed from the drawing code. E04 was already absent. W02 stays because its revised planar route received the later collective “much better” response. Retained revisions of other critiqued examples remain subject to the evidence above: curation is not individual approval or promotion to a style anchor.

## Motion studies

For the P00 experiment, the user requested continuous shape changes, changing measurements, faster morphs, and longer holds. They then clarified that “every shape has its own characteristics”: carrying the same diagonal and bottom-left shaded area through every form felt repetitive. Give each stage a construction relationship specific to its geometry; let its guides and shaded regions enter and leave with that relationship. The user subsequently said “love” about the sector, tangency, inset, and chamfer sequence and requested more visual impact. This endorses that sequence, not mandatory motifs for future drawings. The next experiment animates each construction and carries generating geometry between stages, then rests; that motion refinement is awaiting review.

The user later rejected both dotted-guide animation experiments (marching dashes and progressive drawing); both were removed. They also disliked the rounded square’s inset breaking apart into chamfer cuts. That bridge was removed while retaining the inset construction within its own stage. The circle’s requested 45° radius must coincide exactly with the first hatch line, rather than run beside it.

The user flagged gaps and overlapping strokes where measurement extensions meet construction guides, allowing caps or continuous lines. The response uses continuous shared guides, joins the unit-scale extensions, and excludes coincident grid strokes. Give each shared segment one stroke; avoid opacity changes caused by retracing it in separate layers.

For the capsule, the user requested a 45° upper-left 2u radius and removal of the continuous line connecting the generating-circle centers. Keep that shared axis dashed, including during the circle-to-capsule transition.

The user then said “love it” and requested a separate animation section. The refined loop is now the first example, M01 / Changing geometry, under Animations on `/ui/plotter`. P00 remains a static illustration in the gallery. Preserve manual pause and reduced-motion behavior; inline examples also pause while offscreen.

When relating the forms to UI elements, the user questioned the chamfer’s role, was unconvinced by a tag metaphor, and then explicitly discarded a play-triangle trial. They requested a switch derived from the pill, or placed before it, then a rounded rectangle between the switch and square. The current sequence is Avatar → Pill → Switch → Button → Card, using those UI names in the drawing. One of the pill’s generating circles becomes the sliding switch thumb; its track then becomes the rounded rectangular button before turning into the square card. This revision is awaiting review.

The user explicitly said “never a solid bg” after seeing the filled switch thumb. Keep illustrated forms transparent: no opaque fills to hide guides, no solid background patches, and no area tint. Construction lines remain visible through the thumb; line hatching can still describe a measured region.

The user asked for consistent continuous secondary lines, using the pill’s diagonal radius as the reference after noticing that the card’s inner square looked different. In M01, use the shared secondary-line style (0.65 SVG units, 50% opacity, butt caps and miter joins) for continuous construction geometry, inset frames, dimensions, and their marks. Keep primary outlines and the faint grid/reference scaffolding in their separate visual roles.

After committing the five-stage version, the user requested a slider at the end of the sequence. The new experiment compresses Card into a thin track, then moves a transparent thumb from 25% to 75%, before returning to Avatar. The six-stage sequence and slider treatment are awaiting review.

The first Slider trial was weak: the user could barely see its dotted line and was not happy with the overall result. The revision makes the displacement the subject: a larger transparent thumb, a dashed starting circle, tangent guides between the start/end positions, a 4u travel dimension, and a measured percentage scale. Dashed guides use 38% opacity; coincident grid segments are excluded along their strokes so the gaps remain visible. This revised treatment is awaiting review.

The user questioned whether the sector animation suited an avatar but said they liked it. After a suggestion to rename the stage Circle, they explicitly chose to leave it as is and commit. Preserve both the Avatar label and its sector construction.

The user next requested an animation for the Particles page, specifically C03. They liked the top-to-bottom assembly concept but criticized the first trial’s unstable grid, vacant destination, and stretching elements. They found the subsequent centered exploded stack boring and explicitly asked to restore the original concept, suggesting two isolated grids like B03 and a lower block that starts with only a dashed border. Build bottom-up and separate top-down using clear side lanes, with one owner for each joined seam. Both grids remain stationary.

The next feedback explicitly requests fully rounded A, B, and C in their initial positions and dashed outlines left behind when they depart. Keep fragments rigid at 3u × 1u during travel; flatten their shared corners only at contact. Reveal the 3u × 3u dimensions and A + B + C only after assembly, then widen the completed block, and toggle the switch later. This post-assembly enlargement is explicitly requested; it does not endorse stretching separate fragments in transit. The current trial expands to 6u × 3u around its center, preserving stroke widths, corner radii, text, and control sizes. Update the width annotation with the geometry; shrink before separation. Preserve pause, offscreen pause, and reduced-motion behavior in the Particles hero and Plotter preview. This revision is awaiting review.

The user then asked to improve C03’s grid by avoiding lines that cut through the elements. They explicitly rejected masking or covering the existing lines: rework the grid geometry itself. The lower field’s half-cell vertical offset put horizontal strokes through row centers, making it look misplaced. Use fixed, intentional edge and row-alignment guides, aligned to the actual row boundaries and the composition’s common center. Leave unnecessary interior strokes out of the paths entirely; no animated grid masks or background patches. This grid revision is awaiting review.

For C03’s three-assembly animation, the user wants the parts to become a new common shape. They rejected withdrawing whole borders and retaining independent boxes inside a new container. Exterior paths must form the silhouette themselves, with one owner for each shared divider. They then asked to improve the colliding-edge morph and explicitly rejected changing the movement: “i just wanted the colliding edge morph be better.” Preserve the original straight eased trajectories, travel-time resizing, stagger, receiver guides, and chapter pacing. Do not add curved docking paths or early enlargement to solve this detail. The current response separates straight edges from exterior corner arcs: paired corners retain their radius until contact, then flatten together over 0.22 seconds while the surviving edge becomes the secondary divider. Only the duplicate facing line feathers out over the last 0.08 seconds before contact; no whole fragment outline disappears. Keep the 0.9-second flights, 5.4-second chapters, 16.2-second loop, source ghosts, fixed grids, and later switch toggle. This edge-only revision awaits review and stays separate from the production hero.

## Expanded subject brief

The user explicitly requested a keyboard, browser window, table lamp, folder, smartphone, chat, and service concepts for Cloudflare, Vercel, Stripe, and Linear, then asked for more popular-service examples. These are requested exploration areas; only the specific feedback above establishes preference or approval. The expansion does not rehabilitate earlier rejected object drawings. Render familiar objects as flat plans or elevations with meaningful construction relationships. Preserve the established no-perspective rule.

## Empty-state set

The user asked for concepts, states, or objects that fit this style and are in high demand, and wanted advice. They chose all twelve suggested object-for-state pairings, static, at both hero and compact empty-state sizes:

- search (no results)
- offline
- notifications
- files
- data
- access
- email
- maintenance
- disconnected integration
- location
- bookings
- image

These are S03–S14 under Empty states. Each one adds a 96px version, shown in the coss `Empty` component in its preview dialog. The compact version reuses the hero geometry with non-scaling 1px strokes and no labels. All twelve remain outside the current approved reference set.

When the user asked for an honest assessment, the assistant judged most of the set to be annotated pictograms. In those, the state lived in a caption rather than the geometry, and the compact versions read as generic outline icons. The user replied “ok improve them”. The four strongest were reworked using E02’s grammar:

- **S04:** a route from this device, cut by break slashes, with a dashed ghost reaching a cloud of tangent circles.
- **S06:** an empty text area scaled on the page diagonal, holding only a cursor.
- **S11:** the measured gap is labeled as the state.
- **S12:** the pin is held above an empty dashed target.

The reworked studies use two label tiers: semantic labels at 11 / 72% and measurements at 10 / 50%. Each compact version keeps one construction cue that survives at 96px: the break, the empty text area, the gap, or the target. Asked whether to cut, rework, or keep the remaining eight, the user chose to rework them one or two at a time for review. Two more have been reworked so far:

- **S03:** a typed query above a dashed four-row results list, in the style of C03’s interface fragments.
- **S10:** two gears with matching teeth, their pitch circles 40 apart instead of tangent.

At that point S05, S07–S09, S13, and S14 remained to be reworked; the reference-led refinement pass above now covers them.

On S11, the user noted that drawings like these often use tiny arrows to show direction. They expected one pointing right along the dashed prong lines. Use small open arrowheads in the secondary-line style on a path or axis that implies movement. Place them within the gap or route, pointing toward the destination. Hero only: they vanish at 96px.

The user then pointed to E02, C00, and P02 as well-executed arrow caps, and to C03 and S11 as inconsistent. Draw every cap the way those three do: an open 90° chevron, each leg about 6 long at 45° to its shaft. Put it in the same group and opacity as the shaft, with the tip exactly on the end of a drawn line. On a 45° shaft the legs are axis-aligned (`m-6 0h6v-6`). On an axis-aligned shaft they offset ±4.24 on both axes. On other angles, rotate the reversed shaft direction by ±45°. On a dashed shaft, start the path at the tip so a dash, not a gap, meets the cap, or place the tip at the end of a dash.

## Working interpretations

These diagnoses come from examining the drawings, not from more specific user quotations:

- W02’s cards, checkmark, and arrows gave it the grammar of a flowchart. Constructing the route itself made the drafting language more coherent.
- Flatness alone is insufficient: I02’s complete screen and S02’s oversized success pictogram also fell outside the requested set.
- The main geometry should carry the idea; adding technical marks to a weak subject does not make it fit.
- Perspective belongs to the represented object, not every diagonal mark. Radius lines and annotation leaders remain useful.
- For O03, interpreting “show a portion” as an intentional detail crop resolves the earlier ambiguous miniature keyboard. The user asked for a portion and subdued/dashed lines; credible stagger and modifier widths are our implementation response.
- Service metaphors can be conceptually clear without illustrating every product. Accuracy concerns the relationship depicted and its stated scope. In the Vercel study, we diagnosed the expanding arcs as too suggestive of broadcasting; the user requested improvement after that explanation. The selected-preview construction was our response and was later explicitly included in the approved reference set.

## Subject guidance

Use these as starting points, not approved concepts or mandatory motifs:

- **Primitives:** fundamental shape relationships, tangency, radius, spacing, repeated units.
- **Particles/interfaces:** a small family of reusable fragments with visible composition rules. Keep the construction relationship legible without building an entire application screen. The current browser response uses an enlarged chrome detail instead of a miniature complete window; this is our interpretation of the keyboard comparison. For the chat study, the user specifically requested avatars and removal of triangular tails.
- **Cal.com:** a labeled weekly grid, interval composition, or named availability intersection. Distinguish abstract intersection from a literal time plot; only assign time values to an axis when the geometry supports that interpretation.
- **Workflows:** measured planar routes or switching/connection structures. The routing itself should be the visual subject.
- **Objects:** when showing a detail, preserve the object’s identifying geometry and make the crop deliberate with open edges or quiet dashed continuation. A keyboard detail should have credible key rows and modifiers. Use subdued construction lines; a crop should read as part of a larger system. Multiple folders can share a flat construction rule without implying stacked depth.
- **Services:** begin with one accurate product role or relationship, then translate it into a conceptual construction. Use B04 Linear as a reference for this balance. Check the chosen role against official product documentation and identify the scope when a service is broad. Depicting one real capability is sufficient; the drawing need not cover every company feature. Keep metaphoric geometry distinct from a literal architecture claim.
- **404/empty states:** an interrupted alignment or unresolved planar route can communicate absence. The revised E02 interrupted path is explicitly selected for the 404 page; E04 was removed. A currently open doorway URL is not approval evidence.

Other categories remain open. Translate their subject into a flat construction relationship, then review the result against the anchors rather than assuming every object works in this style.
