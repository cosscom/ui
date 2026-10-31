---
name: plotter
description: Create, critique, refine, or animate editable flat monochrome blueprint illustrations. Use for construction studies, conceptual diagrams, technical heroes, and empty states in this visual language, including requests to animate an existing Plotter drawing. Not general interface animation or engineering certification.
---

# Plotter

Make one construction relationship carry the idea: alignment, proportion, assembly, routing, tangency, or intersection. Deliver editable vectors; animation adds behavior to a readable static composition.

## Choose the workflow

Resolve this skill's installed directory first. All links below are relative to it. The complete folder includes the visual references, helper implementation, examples, and export tools; standalone work needs no coss checkout or prior conversation.

| Request | Read and follow |
| --- | --- |
| Create or refine a static drawing; critique an illustration | [Drawing workflow](references/drawing.md). For critique, report findings and proposed corrections without editing unless requested. |
| Animate an illustration; refine timing, transitions, or a loop | [Animation workflow](references/motion.md). If no usable static composition exists, complete the drawing workflow first. |
| Deliver only a static drawing from an animation | Use the selected static composition and the [foundation's static export](references/foundation.md#standalone-static-export). Time zero is not automatically the right drawing. |

One `$plotter` entrypoint serves both workflows. “Animate this illustration” should reach the animation workflow directly while retaining the same grammar and tokens. Motion does not need a second copy of the skill's visual rules.

## Load the shared references

For drawing, critique, or animation:

1. Read [current direction](references/direction.md) and the [approved reference index](references/approved-references.md). Select and inspect the closest **bundled SVG** by its construction relationship; the wider repository catalogue is optional.
2. Read the [visual grammar](references/visual-grammar.md) to choose meaningful marks. Inspect the linked teaching SVG for each mark you add or revise. Existing unchanged marks do not require loading every teaching example.
3. Read the [drafting standard](references/drafting-standard.md): scope, stroke palette, and geometry/dimensions; include hatch grammar when hatching is involved and symbols/topology when making connectivity or product-behavior claims.

Current direction governs composition, the grammar explains marks, and the drafting standard defines their treatment. [`standard.json`](assets/foundation/standard.json) is the editable source for shared numerical role defaults and helper constants; generated runtime data, CSS, and marked reference tables derive from it. Historical snapshots demonstrate composition and may retain documented exceptions. Preserve an existing illustration's appearance during implementation refactors.

Load additional material only for its branch:

| When | Reference |
| --- | --- |
| Writing role-based SVG, using arrow/dimension/hatch helpers, overriding tokens, or exporting | [Portable foundation](references/foundation.md), including its supported cases and examples |
| Editing the coss gallery or its components | [coss integration](references/implementation.md), then the checkout's applicable instructions |
| Revisiting a named study's feedback or investigating a past failure | [History index](references/history/index.md); read only the relevant entry/revision |
| Explicitly asked for technical verification | [Verification prompt](references/verification-prompt.md), supplied with current source and renders |

## Finish the requested artifact

Use the selected workflow's completion criteria. Deliver the editable source, the requested preview/export, and a concise account of the relationship, relevant limitations, and what was actually inspected. If rendering or interaction was unavailable, identify that gap instead of claiming visual or motion verification. Honor the requested verification scope; automated checks and tests are not prerequisites when the user excludes them.

Keep revision IDs stable unless alternatives are requested. Appearance approval applies to a particular revision; gallery inclusion, production placement, and style-reference selection are separate decisions. When maintaining this skill, put new dated feedback in [history](references/history/index.md#maintaining-the-record) and update current instructions only where the evidence changes a reusable decision.
