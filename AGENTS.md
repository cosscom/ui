# AGENTS.md

Guidelines for AI agents working on this codebase.

## Main Documentation

The comprehensive agent guidelines for this repository are located in:

**[apps/ui/AGENTS.md](apps/ui/AGENTS.md)**

## Typography

Set type per the [Cal Sans font guide](packages/ui/src/fonts/font-guide.md): no added letter-spacing, `font-optical-sizing: auto` instead of a hard-coded `opsz`, one `GEOM` value per role, no synthesized bold or italic, and typeset punctuation (’ – − “ ”) in UI strings.

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles, recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
