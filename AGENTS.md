# AGENTS.md

Guidelines for AI agents working on this codebase.

## Main Documentation

The comprehensive agent guidelines for this repository are located in:

**[apps/ui/AGENTS.md](apps/ui/AGENTS.md)**

## Workspace Source Boundary

Use only files located inside `/Users/mac/Documents/GitHub/Coss` as project sources.

- Do not read, search, copy, cite, or use files from Downloads, Desktop, temporary folders, other repositories, or any other path outside this repository unless the user explicitly authorizes that exact external path in the current session.
- Do not carry external-file permission forward from an earlier session.
- If a required attachment or token export is outside the repository, ask the user to place it in this repository before using it.
- Save any artifact that must remain available to future sessions inside this repository.

## Accura Startup Protocol

Before working on Accura, read these files in order:

1. [`ACCURA.md`](ACCURA.md) for the repository map and documentation ownership.
2. [`docs/product-knowledge/README.md`](docs/product-knowledge/README.md) and the product/module files relevant to the task.
3. [`docs/rules/README.md`](docs/rules/README.md) and the applicable rule set.
4. The latest relevant entries in [`CHANGELOG.md`](CHANGELOG.md).
5. The relevant rationale in [`docs/change-log/DECISIONS.md`](docs/change-log/DECISIONS.md).

Do not duplicate product facts, rules, decisions, or implementation QA across files. Update the owning source and link to it from indexes or evidence files.

## Typography

Set type per the [Cal Sans font guide](packages/ui/src/fonts/font-guide.md): no added letter-spacing, `font-optical-sizing: auto` instead of a hard-coded `opsz`, one `GEOM` value per role, no synthesized bold or italic, and typeset punctuation (’ – − “ ”) in UI strings.
