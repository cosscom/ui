# Accura Change Index

This root file is the concise chronological index for notable Accura changes. It does not duplicate rationale. Follow each link to the owning decision or QA record.

## 2026-11-04

- Separated categorical metadata from status by rendering role, module, and document-type badges as outlines while preserving filled semantic status badges. [Decision](docs/change-log/DECISIONS.md#2026-11-04---metadata-badges-use-outline-hierarchy) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-20--outline-metadata-badges)
- Documented the active Brand 950 navigation, primary, and focus treatment separately from the reusable generated adapter baseline. [Decision](docs/change-log/DECISIONS.md#2026-11-04---brand-950-navigation-and-primary-treatment) · [Mapping contract](brand-assets/README.md#active-accura-prototype-mapping)

## 2026-11-03

- Simplified Accura documentation so `ACCURA.md` is the only navigation entry point; removed redundant folder-level READMEs and renamed the Documents module entry to `overview.md`. [Workspace guide](ACCURA.md)
- Established a non-overlapping documentation ownership model and mandatory Accura startup protocol for AI agents. [Workspace guide](ACCURA.md) · [Decision](docs/change-log/DECISIONS.md#2026-11-03---documentation-ownership-model-established)
- Refined primary and secondary hierarchy so solid brand green is reserved for principal actions. [Decision](docs/change-log/DECISIONS.md#2026-11-03---primary-and-secondary-hierarchy-refined) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-11--primary-and-secondary-hierarchy)
- Adopted Iconoir as the prototype-level icon system with a consistent 24 × 24 grid and 1.5 px stroke. [Decision](docs/change-log/DECISIONS.md#2026-11-03---iconoir-adopted-for-the-accura-prototype) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-6--iconoir-system)
- Replaced repeated page context in the top bar with global search and keyboard behavior. [Decision](docs/change-log/DECISIONS.md#2026-11-03---global-search-replaced-repeated-page-context) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-4--true-neutral-palette-and-global-search)
- Adopted the official Accura logo assets, a 248 px → 64 px collapsible sidebar, and logo-to-expand interaction. [Decision](docs/change-log/DECISIONS.md#2026-11-03---official-logo-and-sidebar-collapse-behavior) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-5--logo-crop-and-collapsed-alignment)
- Settled on a light Zinc application shell with white content surfaces and brand-led selected navigation. [Decision](docs/change-log/DECISIONS.md#2026-11-03---light-zinc-application-shell) · [QA evidence](apps/accura-prototype/design-qa.md#iteration-10--zinc-shell-with-brand-only-selection)

## 2026-11-02

- Established Documents as the first complete Accura prototype slice. [Decision](docs/change-log/DECISIONS.md#2026-11-02---documents-selected-as-the-first-vertical-slice) · [Product context](docs/product-knowledge/overview.md#document-management)
- Rejected a full Accura semantic bridge and adopted a palette-only Accura skin over COSS. [Decision](docs/change-log/DECISIONS.md#2026-11-02---palette-only-coss-adapter-confirmed) · [Adapter contract](brand-assets/README.md)
- Added deterministic token generation and drift validation for Accura brand and Zinc primitives. [Decision](docs/change-log/DECISIONS.md#2026-11-02---repository-token-boundary-established)
