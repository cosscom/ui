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
      "One rigid part turns around a shared pivot. The movement arrow names the direction from its current position to the proposed one.",
    omit: "Use an arrow only when a change or direction matters; alignment and equal size need different marks.",
    caption: "The arrow carries the quarter turn toward the proposed position.",
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
    caption: "One center and one pitch circle locate all six repeated slots.",
  },
  {
    id: "states",
    title: "Absent, hidden, and proposed outlines",
    description:
      "The dashed channel lies behind a visible front face. Its label explains why the geometry is not shown as a solid outline.",
    omit: "The same dashed outline may mean hidden, absent, or proposed geometry. Name the state when the form alone cannot distinguish it.",
    caption: "The view and callout make the hidden channel unambiguous.",
  },
] as const;
