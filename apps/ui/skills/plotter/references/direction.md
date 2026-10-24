# Direction and feedback

Evidence captured from the coss UI illustration reviews on 2026-10-24. This is a living art-direction record, not a claim that every study has been approved.

## Anchors

The user explicitly called the original Primitives and Particles illustrations the better work and asked that they guide further experiments. Their screenshots are bundled beside this file. Primitives centers a circle/square relationship with radius, tangency, alignment, and restrained hatching. Particles composes a pill, label row, and toggle fragment on a common planar construction frame.

The user also explicitly said they “love the Linear example” (B04). Use [Linear](linear.png) as a service-concept reference: issue units aligned to a cycle and release. This endorses that example, not every service drawing.

The gallery gives the entire Primitives/Particles categories reference status. That metadata is broader than the user’s clearest endorsement of the original two drawings.

## Production selections

The user explicitly selected **P00** for the main page, [**C03** for Particles](particles-recombination.png), and [**E02** for the 404](not-found-interrupted-path.png). These are current implementation decisions. The original Primitives/Particles references and loved Linear study still guide the broader style. The lab owns independent snapshots of the selected drawings, so it can ship separately from the production integration. Original C00 and E00 remain separate historical studies.

## Review evidence

| Evidence | Status and implication |
| --- | --- |
| C03: requests a third element so the composition becomes “A + B + C” | Revise C03 in place. Added an Open action alongside identity and visibility, repeated as the third row of the assembled panel; three equal rows measure 3u. This is a requested experiment, awaiting review. |
| User asks to hide the home and Particles illustrations on smaller screens | Show those two hero drawings only from the existing desktop split-layout breakpoint (`lg`, 1024px). This does not change the 404 or standalone lab studies. |
| User rejects a shared page-hero component and asks for the 404 heading to stay centered with the illustration above | Keep main and Particles split layouts in their pages. Use an illustration-first centered stack for the 404, including its lab hero previews. |
| User asks to restore the previous Particles page, then explicitly confirms “Keep C03; restore search beneath heading” and references PR #895 for headings | Keep C03 on the right, restore search beneath the left-aligned heading/description, and remove the added hero CTAs. Use PR #895’s fluid 36–64px heading scale, leading-none, and GEOM50 on the main and Particles pages. |
| User rejected K01, K04, K05, I01, I02, D01, D02, W01, O01, O02, A01, A02, S02; W02 partly | Explicit group feedback: these went beyond the desired set. The stated general boundary was flat 2D electrical/architectural blueprints, with no 3D or skewed views. |
| K06: not clear it is a week | Revised with Mon–Sun, hourly rows, and a labeled Thursday interval. A seven-column grid alone did not establish the subject. |
| K08: good concept, meaning unclear; more labeling suggested | Preserved crossing availability bands and added named people plus a shared-meeting callout. |
| I03: good, not an excellent example | Revised from a single generic row to separate elements projecting into a shared control. |
| W03: a bit weak | Replaced the isolated switch with a switching matrix and one selected junction. |
| W02: does not really seem a blueprint; user could not say why | Replaced rounded endpoint cards and checkmarks with a continuous route whose width, bend radius, and branch spacing are measured. |
| Response to those five revisions: “much better” | Collective positive feedback. Promising revised examples, not five individually designated canonical anchors. |
| E03/E05 set aside by the assistant | Inferred conflict with the no-tilt rule; not individually rejected by the user. |
| O03 keyboard: “doesn’t look good”; asks to show a portion and use more subtle/dashed lines | Revised as a deliberate keyboard detail with credible staggered rows and modifiers, quiet outlines, and dashed continuation. Revision unreviewed. |
| I04 browser: “same problem as keyboard before” | Interpreted as a request for a deliberate enlarged browser detail, with subdued strokes and dashed continuation. Latest revision unreviewed. |
| I06 chat: asks to add an avatar and remove the triangle on the bubble | Pair rounded, tail-free message blocks with circular avatars. Latest revision unreviewed. |
| O05 folder: asks for two or three instead of one | Revised as three separate flat outlines sharing tab geometry and alignment. Revision unreviewed. |
| E04: “remove” | Explicitly removed. This is a choice about E04, not a blanket rejection of all absence metaphors. |
| E02: good idea but bland/weak | Preserve the idea while strengthening its composition. Selected for the 404 page after revision. |
| B02 Vercel: not loved; wants more conceptual/metaphoric, then asks whether it is accurate and requests improvement | Replaced the broadcast-like aperture with separate preview frames and one selected preview promoted to an identical production frame. “Preview” / “Production” replaces “Draft” / “Live” because previews are already reachable deployments. Matching outlines identify the same source version, not the same build: preview promotion rebuilds for the production environment. User approved this direction of work; the resulting drawing is still unreviewed. |
| B03 Stripe: “ok”; wants an alternative focused on what it does | Keep B03 and add B05 as an alternative. “Ok” is not a request to replace it or make it a canonical anchor. |
| B01 Cloudflare: asks whether the representation is accurate | A request for factual review, not approval or rejection. Scope the concept clearly; latest revision unreviewed. |
| B09 Supabase: points to the crowded connector at owner_id and says it does not look good | Replaced the branching endpoint with a circular port and a short straight approach after the bend. This is a critique of that junction, not rejection of the study or all relationship notation. Revision unreviewed. |
| B04 Linear: “love the Linear example” | Explicit positive reference for service concepts; preserve it. |
| Request for more popular-service examples | New B05–B09 are exploration, awaiting user review. |

The earlier K06/K08/I03/W02/W03 revision pass is captured in coss commit `285493c9` on `codex/blueprint-illustration-studies`. The preceding flat-direction pass is `e9077a93`. Preserve this evidence if gallery metadata later changes.

## Expanded subject brief

The user explicitly requested a keyboard, browser window, table lamp, folder, smartphone, chat, and service concepts for Cloudflare, Vercel, Stripe, and Linear, then asked for more popular-service examples. These are requested exploration areas; only the specific feedback above establishes preference or approval. The expansion does not rehabilitate earlier rejected object drawings. Render familiar objects as flat plans or elevations with meaningful construction relationships. Preserve the established no-perspective rule.

## Working interpretations

These diagnoses come from examining the drawings, not from more specific user quotations:

- W02’s cards, checkmark, and arrows gave it the grammar of a flowchart. Constructing the route itself made the drafting language more coherent.
- Flatness alone is insufficient: I02’s complete screen and S02’s oversized success pictogram also fell outside the requested set.
- The main geometry should carry the idea; adding technical marks to a weak subject does not make it fit.
- Perspective belongs to the represented object, not every diagonal mark. Radius lines and annotation leaders remain useful.
- For O03, interpreting “show a portion” as an intentional detail crop resolves the earlier ambiguous miniature keyboard. The user asked for a portion and subdued/dashed lines; credible stagger and modifier widths are our implementation response.
- Service metaphors can be conceptually clear without illustrating every product. Accuracy concerns the relationship depicted and its stated scope. In the Vercel study, we diagnosed the expanding arcs as too suggestive of broadcasting; the user requested improvement after that explanation. The selected-preview construction is our response, not a newly approved anchor.

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
