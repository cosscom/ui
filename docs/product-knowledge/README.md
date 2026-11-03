# Accura Product Knowledge

This folder owns the current understanding of Accura: what the product is, who uses it, how its workflows behave, and what each module requires. Historical decisions and UI rules live elsewhere.

## Contents

- [`overview.md`](overview.md) — product purpose, users, business logic, shared lifecycle behavior, known constraints, blind spots, and open questions.
- [`modules/documents/README.md`](modules/documents/README.md) — Documents module entry point.
- [`sources/`](sources/) — original source PDFs retained as evidence, not automatically treated as approved requirements.

## Knowledge Status

- Statements in `overview.md` describe the best current product understanding.
- Module folders describe current module-specific behavior and link to their sources and audits.
- Open questions remain open until an authorized product or quality owner confirms them.
- When a fact changes, update the owning knowledge file and add the reason to [`../change-log/DECISIONS.md`](../change-log/DECISIONS.md).

Do not place visual implementation history, component styling rules, or session notes in this folder.
