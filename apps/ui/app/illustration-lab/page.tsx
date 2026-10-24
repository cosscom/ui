import type { Metadata } from "next";
import { Suspense } from "react";
import { calStudies } from "./cal-studies";
import { flatCalStudies } from "./flat-cal-studies";
import { flatObjectStudies } from "./flat-object-studies";
import { flatSystemStudies } from "./flat-system-studies";
import { IllustrationLab } from "./illustration-lab";
import { interfaceDetailStudies } from "./interface-detail-studies";
import { networkStudies } from "./network-studies";
import { notFoundArchitectureStudies } from "./not-found-architecture-studies";
import { notFoundGeometryStudies } from "./not-found-geometry-studies";
import { objectStudies } from "./object-studies";
import { OriginalNotFoundBlueprint } from "./original-not-found-blueprint";
import { OriginalParticlesBlueprint } from "./original-particles-blueprint";
import { popularServiceStudies } from "./popular-service-studies";
import { PrimitivesBlueprint } from "./primitives-blueprint";
import { serviceStudies } from "./service-studies";
import { stateStudies } from "./state-studies";
import { applyStudyDirection } from "./study-direction";
import type { IllustrationStudy } from "./study-types";
import { systemStudies } from "./system-studies";

export const metadata: Metadata = {
  title: "Plotter · Illustration lab",
  description:
    "Flat monochrome construction studies and the evolving Plotter illustration direction.",
  robots: { index: false, follow: false },
};

const references: IllustrationStudy[] = [
  {
    id: "404-reference",
    code: "E00",
    title: "The missing corner",
    description:
      "A vacant module in an otherwise complete construction. The original 404 experiment, retained for comparison.",
    category: "404",
    illustration: <OriginalNotFoundBlueprint />,
    baseline: true,
  },
  {
    id: "primitives-reference",
    code: "P00",
    title: "Circle, square, line",
    description:
      "Fundamental geometry and its construction rules. The current Primitives illustration.",
    category: "Primitives",
    illustration: <PrimitivesBlueprint />,
    baseline: true,
  },
  {
    id: "particles-reference",
    code: "C00",
    title: "The exploded interface",
    description:
      "A pill, row and toggle projected onto a shared frame. The original Particles illustration, retained as a style reference.",
    category: "Particles",
    illustration: <OriginalParticlesBlueprint />,
    baseline: true,
  },
];

// Direct-link review page. Intentionally absent from navigation and the sitemap.
export default function Page() {
  return (
    <Suspense
      fallback={<div className="container py-16">Loading studies…</div>}
    >
      <IllustrationLab
        studies={[
          ...references.filter((study) => study.category !== "404"),
          ...systemStudies,
          ...flatCalStudies,
          ...interfaceDetailStudies,
          ...flatSystemStudies,
          ...flatObjectStudies,
          ...serviceStudies,
          ...popularServiceStudies,
          ...calStudies,
          ...networkStudies,
          ...objectStudies,
          ...stateStudies,
          ...notFoundArchitectureStudies,
          ...notFoundGeometryStudies,
          ...references.filter((study) => study.category === "404"),
        ].map(applyStudyDirection)}
      />
    </Suspense>
  );
}
