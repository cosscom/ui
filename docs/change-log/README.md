# Accura Change And Decision Records

This folder owns detailed decision history.

- [`DECISIONS.md`](DECISIONS.md) records context, decisions, rationale, consequences, and superseded directions.
- Root [`CHANGELOG.md`](../../CHANGELOG.md) is only a concise chronological index and links here or to implementation QA.

There is intentionally no synchronization between duplicated prose because the same detail must not exist twice. The root index summarizes; this folder explains.

When adding a decision:

1. Add or update the canonical entry in `DECISIONS.md`.
2. Mark the earlier direction as superseded instead of deleting history.
3. Add one short root `CHANGELOG.md` entry only when the change is notable to the project.
4. Link to implementation QA when the decision has been built and verified.
