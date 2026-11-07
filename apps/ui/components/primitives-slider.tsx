import {
  ConstructionAnnotation,
  ConstructionMotion,
} from "./primitives-construction-motion";
import { secondaryLine } from "./primitives-morph-style";
import {
  morphCycleDuration,
  morphHoldDuration,
  morphKeyTimes,
  morphStageDuration,
} from "./primitives-morph-timing";

const travelGuides = "M204 116V292 M364 116V292 M204 164H364 M204 244H364";
const scalePositions = [124, 164, 204, 244, 284, 324, 364, 404, 444];

// Remove only coincident grid strokes, so the construction dashes retain gaps.
export function SliderGridMask() {
  return (
    <g opacity="0">
      <animate
        attributeName="opacity"
        begin={`${5 * morphStageDuration}s`}
        dur={`${morphCycleDuration}s`}
        keyTimes={morphKeyTimes(
          0,
          0.18,
          2.2,
          morphHoldDuration,
          morphCycleDuration,
        )}
        repeatCount="indefinite"
        values="0;1;1;0;0"
      />
      <path d={travelGuides} stroke="black" strokeWidth="1.3" />
    </g>
  );
}

export function SliderConstruction() {
  return (
    <g>
      <g opacity="0.38" strokeDasharray="4 4" strokeWidth="0.65">
        <path d={travelGuides} />
        <circle cx="204" cy="204" r="40" />
      </g>
      <circle cx="204" cy="204" fill="none" r="40" strokeWidth="1">
        <ConstructionMotion
          attributeName="cx"
          delay={0.3}
          duration={0.55}
          from={204}
          stage={5}
          to={364}
        />
      </circle>
      <g {...secondaryLine}>
        <path d="M124 292H444" />
        {scalePositions.map((x, index) => {
          const halfTick = index % 2 === 0 ? 4 : 2;
          return <path d={`M${x} ${292 - halfTick}v${2 * halfTick}`} key={x} />;
        })}
      </g>
      <ConstructionAnnotation stage={5}>
        <g {...secondaryLine}>
          <path d="M204 132H270 M298 132H364 m-164 4 8-8 m152 8 8-8" />
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
          <text textAnchor="middle" x="284" y="135">
            4u
          </text>
          <text textAnchor="middle" x="124" y="312">
            0%
          </text>
          <text textAnchor="middle" x="284" y="312">
            50%
          </text>
          <text textAnchor="middle" x="444" y="312">
            100%
          </text>
          <text textAnchor="end" x="464" y="384">
            06 / Slider
          </text>
        </g>
      </ConstructionAnnotation>
    </g>
  );
}
