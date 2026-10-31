export const visualGrammarEntries = [
  {
    id: "outlines",
    title: "Primary and secondary outlines",
    description:
      "Identity, name, and tools assemble into one record. Primary outlines hold the loose fragments and finished form together; quieter face details and construction lines support them.",
    omit: "Keep supporting marks subordinate. Giving every stroke equal weight makes the construction compete with the subject.",
    caption: "The fragments and completed record read first.",
  },
  {
    id: "hatching",
    title: "Diagonal hatching",
    description:
      "Hatching singles out one bounded region. Here it identifies a visible iris blade while the aperture remains clear. Its direction and spacing stay consistent across that region.",
    omit: "Omit hatching when no region needs distinguishing. It is not a lighting effect or a material label.",
    caption:
      "One blade is selected; its boundaries and the central opening stay clear.",
  },
  {
    id: "grids",
    title: "Background grids",
    description:
      "A grid makes a shared construction module visible. This letter’s stem, counter, and bowl radii all follow the same 32-unit field.",
    omit: "Omit a background grid when local guides already explain the relationship. Geometric subject matter alone is not a reason to add one.",
    caption: "The grid reveals one module across the stem, counter, and bowl.",
  },
  {
    id: "arrows",
    title: "Movement and transfer arrows",
    description:
      "The curved dashed line and its solid open arrowhead show a rigid part turning from its current position to the proposed one. The nearby “Quarter turn” text is a callout, not part of the arrow.",
    omit: "Use an arrow only when a change or direction matters; alignment and equal size need different marks.",
    caption: "On hover, only the dashed shaft and solid arrowhead remain.",
  },
  {
    id: "projections",
    title: "Projection guides",
    description:
      "A whole task separates into two assigned scopes. Each projection connects the same width witness before and after separation, so the parts retain a visible relationship to the whole.",
    omit: "Omit guides that cannot name both corresponding features. Nearby endpoints are not enough: the alignment must be exact.",
    caption: "Four quiet guides preserve the same two allocations.",
  },
  {
    id: "dimensions",
    title: "Dimensions and radius leaders",
    description:
      "Dimensions reveal the proportions that construct a form. Here a concentric bend keeps a constant offset, while its width and radius use the same unit.",
    omit: "Omit measurements that do not explain the construction. Every witness and radius leader must reach the feature it measures.",
    caption:
      "One unit system connects the width, offset, and actual circular radius.",
  },
  {
    id: "centerlines",
    title: "Centerlines and loci",
    description:
      "Centerlines and a pitch circle reveal how repeated features share one center. Six curved slots follow the same circle at equal angular intervals.",
    omit: "Omit axes and loci that do not explain symmetry, rotation, or placement. A dashed guide must pass through the geometry it claims to organize.",
    caption:
      "On hover, the center mark, radial axes, and pitch circle remain; the slots and callout disappear.",
  },
  {
    id: "states",
    title: "Hidden, absent, and proposed outlines",
    description:
      "The dashed C-shaped boundary represents a channel behind the plate’s visible front face. The channel exists, but this view cannot see it directly. Only that hidden boundary remains on hover.",
    omit: "Hidden means present but concealed; absent means missing; proposed means a possible future form. Label the intended state. The solid line pointing to “Hidden rear channel” is a callout leader, a separate annotation that disappears on hover.",
    caption:
      "This example shows hidden geometry: the channel’s boundary behind the face.",
  },
] as const;
