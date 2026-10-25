import {
  ConstructionAnnotation,
  ConstructionMotion,
} from "./primitives-construction-motion";
import { secondaryLine } from "./primitives-morph-style";

export function ButtonConstruction() {
  return (
    <g>
      <g opacity="0.22" strokeDasharray="3 4" strokeWidth="0.65">
        <path d="M184 112V176 M184 232V296 M384 112V176 M384 232V296" />
      </g>
      <rect
        {...secondaryLine}
        fill="none"
        height="40"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        width="200"
        x="184"
        y="184"
      >
        <ConstructionMotion
          attributeName="stroke-dashoffset"
          from={1}
          stage={3}
          to={0}
        />
      </rect>
      <ConstructionAnnotation stage={3}>
        <g {...secondaryLine}>
          <path d="M124 250H140 M168 250H184 m-64 4 8-8 m52 8 8-8" />
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
          <text textAnchor="middle" x="154" y="253">
            1.5u
          </text>
          <text textAnchor="end" x="464" y="384">
            04 / Button
          </text>
        </g>
      </ConstructionAnnotation>
    </g>
  );
}
