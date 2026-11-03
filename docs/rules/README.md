# Accura Rules

This folder owns the current approved rules used to design and build Accura. Rules state what must be true now; their historical rationale belongs in the decision log.

## Rule Sets

- [`ui-hierarchy.md`](ui-hierarchy.md) — action priority, button variants, navigation selection, color hierarchy, and status treatment.
- [`visual-system.md`](visual-system.md) — brand assets, Iconoir, color/theme usage, and typography references.
- [Cal Sans font guide](../../packages/ui/src/fonts/font-guide.md) — typography implementation rules owned by COSS.
- [Accura palette adapter](../../brand-assets/README.md) — executable brand-token mapping owned by `brand-assets/`.

When a rule changes, update its owning rule file and record why in [`../change-log/DECISIONS.md`](../change-log/DECISIONS.md). Do not preserve old rules here; the decision log preserves history.
