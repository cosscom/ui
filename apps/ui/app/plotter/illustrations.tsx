import { calStudies } from "./cal-studies";
import { contentStateStudies } from "./content-state-studies";
import { engineeringStudies } from "./engineering-studies";
import { expandedStudies } from "./expanded-studies";
import { flatCalStudies } from "./flat-cal-studies";
import { flatObjectStudies } from "./flat-object-studies";
import { flatSystemStudies } from "./flat-system-studies";
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
import type { IllustrationStudy } from "./study-types";
import { systemStateStudies } from "./system-state-studies";
import { systemStudies } from "./system-studies";

const collection: IllustrationStudy[] = [
  {
    id: "primitives-reference",
    code: "P00",
    title: "Circle, square, line",
    description:
      "Fundamental geometry, connected by radius, tangency, and a shared construction grid.",
    category: "Foundations",
    illustration: <PrimitivesBlueprint />,
  },
  {
    id: "particles-reference",
    code: "C00",
    title: "The exploded interface",
    description:
      "A pill, row, and toggle projected onto a shared frame. Separate elements follow a common set of rules.",
    category: "Interfaces",
    illustration: <OriginalParticlesBlueprint />,
  },
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
  ...contentStateStudies,
  ...systemStateStudies,
  ...engineeringStudies,
  ...notFoundArchitectureStudies,
  ...notFoundGeometryStudies,
  ...expandedStudies,
  {
    id: "404-reference",
    code: "E00",
    title: "The missing corner",
    description:
      "A vacant module in an otherwise complete construction. Absence, described by the edges around it.",
    category: "Empty states",
    illustration: <OriginalNotFoundBlueprint />,
  },
];

// Open the collection with a cross-section of its subjects. Codes and deep links
// stay stable as the drawings evolve.
const opening = ["P00", "C03", "B04", "K06", "I06", "E02"];

export const illustrations = [
  ...opening.flatMap((code) => collection.filter((item) => item.code === code)),
  ...collection.filter((item) => !opening.includes(item.code)),
];
