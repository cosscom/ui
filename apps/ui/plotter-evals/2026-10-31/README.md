# Plotter evaluation · 2026-10-31

`cases.json` preserves the three original briefs, SVG hashes, catalog IDs, and user feedback. `modules.svg`, `buffers.svg`, and `search.svg` are the original self-contained outputs, including their embedded font. The user liked all three and preferred them without the additional background grids tried afterward.

Their catalog equivalents are C04, K09, and S15. Those components inherit the website’s font and theme colors; the shared-frame hatch is analytically clipped instead of using an SVG clip ID. The original geometry, measurements, and labels are retained.

These were three separate fresh sessions using the skill at `aeebda6b`. There was no without-skill control or repeat trial. The results demonstrate those particular outcomes and preferences, not a measured reliability rate or proof that the skill improved performance.

## Repeating an exercise

Copy the complete skill directory into a temporary location. Start a fresh agent session with only that copy, the brief, and an empty output directory. Preserve the resulting SVG, the exact prompt, the package’s file hashes, and the review outcome. Keep generated candidates outside the catalog until selected.

Review recognition, construction relationship, hierarchy, geometry, and readability at the intended size separately. A metadata or rendering check cannot decide visual quality. When an instruction changes, repeat the affected brief and an unrelated brief before drawing conclusions.

Run `bun run plotter:check` from `apps/ui` for package links, bundled reference hashes, catalog identifiers, and SVG rendering. The skill README describes the current experimental scope.

## Clean-install result

The consolidated package completed one fresh-session inscribed-circle exercise. `clean-install/` preserves the brief, exact package hashes, output, agent notes, and independent geometry residuals. No checkout or conversation context was supplied. This passed a bounded portability check; the new drawing has not been selected for the catalog or approved as a style reference.
