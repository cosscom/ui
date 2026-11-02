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

## Typography

Set type per the [Cal Sans font guide](packages/ui/src/fonts/font-guide.md): no added letter-spacing, `font-optical-sizing: auto` instead of a hard-coded `opsz`, one `GEOM` value per role, no synthesized bold or italic, and typeset punctuation (’ – − “ ”) in UI strings.
