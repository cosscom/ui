# Approved references

On 2026-10-25, the user explicitly identified these 27 drawings as the best illustrations and asked that they be used as references. This list supersedes earlier broad endorsements and pending-review labels. Keep reference selection separate from revision identity: a later edit to a drawing does not silently inherit approval.

## Bundled starting points

Choose by construction relationship, then render and inspect the linked SVG. These six snapshots are available in a standalone installation:

| Relationship | Reference | What to borrow |
| --- | --- | --- |
| Circle, square, radius, and tangency | [P00](drawings/P00.svg) | A shared geometric construction with one focal relationship |
| Modules following one allocation rule | [C02](drawings/C02.svg) | Repeated units, spacing, and a coherent component family |
| Time intervals combining into a whole | [K07](drawings/K07.svg) | Proportional lengths and restrained duration labels |
| Work aligned to a cycle | [B04](drawings/B04.svg) | A scoped service concept organized by a shared time field |
| Conversation expressed with a few UI fragments | [I06](drawings/I06.svg) | Recognition through avatars, tail-free messages, and spacing |
| Absence interrupting a structure | [E02](drawings/E02.svg) | A missing connection that affects the construction itself |

[The manifest](drawings/manifest.json) records source revision and snapshot hashes. These are source snapshots of selected compositions, not newly normalized or technically certified drawings. Historical background fills and line-role variations may remain; use the [drafting standard](drafting-standard.md) for new work. Render the snapshots on a light surface to inspect their original presentation.

## Full reference set

The following selection remains unchanged. When the coss checkout is available, inspect these in `/ui/plotter?variant=<study-id>` and find source by code in `apps/ui/app/plotter/`. Without it, choose the nearest bundled relationship above instead of assuming the gallery or other source files are accessible. A familiar subject alone is not a sufficient reference match.

| Code | Drawing | Study ID |
| --- | --- | --- |
| P00 | Circle, square, line | `primitives-reference` |
| B04 | Linear · Work aligned to a cycle | `service-linear-cycle` |
| K06 | A week, constructed | `cal-week-grid` |
| I06 | A conversation, constructed | `interface-chat-plan` |
| E02 | An interrupted path | `404-interrupted-path` |
| P02 | The corner rule | `primitives-radius` |
| P03 | A system of proportions | `primitives-proportion` |
| C01 | An assembly of parts | `particles-assembly` |
| C02 | A modular tray | `particles-slots` |
| K07 | The shape of a time slot | `cal-time-modules` |
| K08 | Where schedules meet | `cal-availability-plan` |
| I03 | From parts to a whole | `interface-spacing-plan` |
| W03 | A connection, located | `workflow-switch-plan` |
| A03 | A measured distribution | `data-coordinate-plan` |
| B01 | Cloudflare · Between visitor and origin | `service-cloudflare-edge` |
| B02 | Vercel · From preview to production | `service-vercel-deploy` |
| B03 | Stripe · A balance, assembled | `service-stripe-settlement` |
| B05 | Stripe · Many ways to pay | `service-stripe-payment` |
| B06 | GitHub · A change, brought together | `service-github-merge` |
| B07 | Figma · Rules that resize | `service-figma-constraints` |
| B09 | Supabase · A shared relation | `service-supabase-relations` |
| K02 | Common ground | `cal-availability` |
| T01 | Anatomy of a letter | `type-letter` |
| T02 | A mark in the making | `type-monogram` |
| E01 | An empty threshold | `404-doorway` |
| E06 | An unbuilt arch | `404-unbuilt-arch` |
| E00 | The missing corner | `404-reference` |

## Scope of the decision

The user said the remaining illustrations do not look perfect or do not fit the style for different reasons, and could not yet identify those reasons. Treat them as revision candidates, not style references. This feedback does not request their deletion or establish a specific diagnosis for each drawing.

At the time of the selection, the omitted static drawings were C00, C03, P01, K03, I04, I05, W02, O03, O04, O05, B08, S01, and S03–S14. In particular, original Particles/C00 is now a historical reference; C03’s production placement is a separate implementation decision. Preserve the user’s specific earlier feedback on details without promoting the whole drawing. This static selection does not revoke the separately reviewed animation work. The later C04, K09, and S15 experiments were liked and requested for the catalog; they are not additions to this 27-reference selection.

## Working interpretation

These are hypotheses from comparing the selected drawings with the remaining studies, not additional user-stated rules:

- **Make a construction relationship the subject.** P00 relates circle and square; C01/I03 assemble parts; B04 aligns work to a cycle; B07 demonstrates constraints. Recognizability and technical annotations alone have been less reliable, as in the lamp, phone, and browser studies.
- **Give the composition a focal point.** K06 selects an interval, W03 selects a junction, and E00 leaves one quadrant unresolved. O05’s equally weighted folders and B08’s repeated blocks offer a less distinct central event.
- **Use measurements to explain the main idea.** P03’s progression and K07’s interval lengths support their composition. Multiple unrelated product dimensions can scatter attention, as in O04’s shade, stem, base, and overall height.
- **Spend detail on the organizing rule.** I06 reduces conversation to avatars, tail-free message blocks, and spacing. O03/I04 devote more attention to keyboard legends and browser chrome. A keyboard or browser remains a possible subject; simplify the representation around one useful relationship.
- **Make absence affect the structure.** E00’s missing corner, E02’s interrupted route, and E06’s absent keystone visibly change the construction. This is a more dependable starting point than selecting an empty-state icon and surrounding it with measurements.

Do not force every omission into one explanation. P01 is close to the established geometric language; its weaker fit may concern composition or distinctiveness. Some newer empty-state drawings already contain structural ideas. T01/T02 and E01 show that recognizable forms can be successful. Evaluate the specific drawing against the closest approved reference instead of banning a subject category.
