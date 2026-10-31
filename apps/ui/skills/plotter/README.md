# Plotter

Flat monochrome blueprint illustrations: precise geometry, quiet construction guides, and generous white space.

The experimental v0.1 scope is **static, editable illustrations**. The skill supports creation, critique, and refinement; existing coss animation guidance is an optional advanced workflow. It is a house illustration language, not an engineering certification.

## Use

Copy this complete `plotter` directory into your agent’s skills directory, preserving its name and relative paths. Invoke `$plotter` with the subject and intended placement. No coss checkout is required for standalone work.

Example: “Use $plotter to show a 20-minute appointment between two 5-minute buffers, as a standalone 560 × 440 SVG.”

`SKILL.md` contains the workflow. The [reference index](references/approved-references.md) maps seven bundled SVG snapshots to construction relationships and preserves the wider approved set. The [illustrated visual grammar](references/visual-grammar.md) explains when each kind of mark helps, with full-size SVG studies. The [drafting standard](references/drafting-standard.md) defines current linework; historical visual examples may contain documented exceptions. Outside coss, use the host font or the documented sans-serif fallback.

The [registration case](references/examples/agent-registration.md) preserves a drawing from a rejected batch and a reference-led revision the user explicitly liked. It explains the generation failure and the focused workflow correction; it is not an additional approved style reference or evidence of broader reliability.

## Source and maintenance

The canonical source is `apps/ui/skills/plotter` in the coss repository. Make changes there, then replace installed copies with the complete updated directory. Installed copies are snapshots; do not maintain a second set of Plotter rules under another name.

The coss showcase is at `/ui/plotter`. Category filters and stable `?variant=<study-id>` links locate native-size inline drawings. Narrow screens scroll within each drawing. The page is available by direct URL and is not linked from site navigation.

The three initial fresh-session experiments, prompts, and feedback are preserved in the repository at `apps/ui/plotter-evals/2026-10-31/`. They are evaluation evidence and catalog additions, separate from the 27 approved style references. A later instruction change should identify the observed failure and compare actual outputs on the affected brief and an unrelated one. Clean-install results establish only the tasks and revisions actually tested.

Maintainers can run `bun run plotter:check` from `apps/ui` to check skill metadata and links, bundled snapshot hashes, catalog IDs, and SVG rendering. This checks package integrity and rendering, not visual quality. Review the actual drawings and record a fresh-session exercise before declaring a candidate ready; ordinary installed users do not need the repository check command.
