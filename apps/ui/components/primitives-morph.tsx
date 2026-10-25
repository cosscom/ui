"use client";

import { useEffect, useId, useRef } from "react";
import { BlueprintDrawing } from "./blueprint-drawing";
import { MorphDetails, morphDetailIds } from "./primitives-morph-details";
import { secondaryLine } from "./primitives-morph-style";
import {
  morphCycleDuration,
  morphHoldDuration,
  morphKeyTimes,
  morphStageDuration,
} from "./primitives-morph-timing";
import { PrimitivesMorphTransitions } from "./primitives-morph-transitions";
import { SliderGridMask } from "./primitives-slider";
import { SwitchThumb } from "./primitives-switch";

type Shape = { width: number; height: number; corner: number };

// All stages share four straight edges and four cubic corners, including the
// circle’s zero-length edges. Matching topology keeps every point continuous.
function construct({ width, height, corner: r }: Shape) {
  const left = 284 - width / 2;
  const right = 284 + width / 2;
  const top = 204 - height / 2;
  const bottom = 204 + height / 2;
  const a = r * 0.55228475;
  const points = {
    "top-left": [left + r, top],
    "top-right": [right - r, top],
    "right-top": [right, top + r],
    "right-bottom": [right, bottom - r],
    "bottom-right": [right - r, bottom],
    "bottom-left": [left + r, bottom],
    "left-bottom": [left, bottom - r],
    "left-top": [left, top + r],
  } as const;
  return {
    points,
    showHeight: height >= 40 ? 1 : 0,
    outline: `M${left + r} ${top} L${right - r} ${top}
      C${right - r + a} ${top} ${right} ${top + r - a} ${right} ${top + r}
      L${right} ${bottom - r}
      C${right} ${bottom - r + a} ${right - r + a} ${bottom} ${right - r} ${bottom}
      L${left + r} ${bottom}
      C${left + r - a} ${bottom} ${left} ${bottom - r + a} ${left} ${bottom - r}
      L${left} ${top + r}
      C${left} ${top + r - a} ${left + r - a} ${top} ${left + r} ${top} Z`,
    // One continuous guide owns each extension; measurement marks never retrace it.
    guides: `M${left} 38V348 M${right} 38V348
      M${left - 24} ${top}H490 M${left - 24} ${bottom}H490
      M164 348V372 M204 348V372`,
    dimensions: `M${left} 46H264 M304 46H${right}
      M${left - 4} 50l8-8 M${right - 4} 50l8-8`,
    heightDimension: `M482 ${top}V190 M482 218V${bottom}
      M478 ${top + 4}l8-8 M478 ${bottom + 4}l8-8`,
  };
}

const circle = construct({ width: 240, height: 240, corner: 120 });
const pill = construct({ width: 320, height: 160, corner: 80 });
const stages = [
  circle,
  pill,
  pill,
  construct({ width: 320, height: 160, corner: 24 }),
  construct({ width: 240, height: 240, corner: 40 }),
  construct({ width: 320, height: 12, corner: 6 }),
  circle,
];

// Every 3.2s: hold the finished form for 2.4s, then morph over 0.8s.
// Repeated frames share the same SVG clock with their construction details.
function Morph({
  attributeName,
  values,
}: {
  attributeName: string;
  values: (string | number)[];
}) {
  return (
    <animate
      attributeName={attributeName}
      calcMode="spline"
      dur={`${morphCycleDuration}s`}
      keySplines={values
        .slice(0, -1)
        .flatMap(() => ["0 0 1 1", "0.4 0 0.2 1"])
        .join(";")}
      keyTimes={morphKeyTimes(
        ...values.flatMap((_, index) =>
          index === values.length - 1
            ? [morphCycleDuration]
            : [
                index * morphStageDuration,
                index * morphStageDuration + morphHoldDuration,
              ],
        ),
      )}
      repeatCount="indefinite"
      values={values
        .flatMap((value, index) =>
          index === values.length - 1 ? [value] : [value, value],
        )
        .join(";")}
    />
  );
}

const tangentIds = [
  "top-left",
  "top-right",
  "right-top",
  "right-bottom",
  "bottom-right",
  "bottom-left",
  "left-bottom",
  "left-top",
] as const;

const gridX = [124, 164, 204, 244, 284, 324, 364, 404, 444];
const gridY = [84, 124, 164, 204, 244, 284, 324];

export function PrimitivesMorph({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const widthLabel = useRef<SVGTextElement>(null);
  const heightLabel = useRef<SVGTextElement>(null);
  const hatchId = useId();
  const guideId = useId();
  const gridMaskId = useId();

  useEffect(() => {
    const svg = root.current?.querySelector("svg");
    if (!svg) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();

    const left = svg.querySelector<SVGCircleElement>(
      '[data-anchor="left-bottom"]',
    );
    const right = svg.querySelector<SVGCircleElement>(
      '[data-anchor="right-top"]',
    );
    const top = svg.querySelector<SVGCircleElement>('[data-anchor="top-left"]');
    const bottom = svg.querySelector<SVGCircleElement>(
      '[data-anchor="bottom-right"]',
    );
    let frame = 0;

    function updateMeasurements() {
      if (left && right && top && bottom) {
        // Read the animated anchor coordinates, so numerical labels use exactly
        // the same eased geometry as the SVG, including after pause/resume.
        const width = `${Number(((right.cx.animVal.value - left.cx.animVal.value) / 40).toFixed(1))}u`;
        const height = `${Number(((bottom.cy.animVal.value - top.cy.animVal.value) / 40).toFixed(1))}u`;
        if (widthLabel.current && widthLabel.current.textContent !== width)
          widthLabel.current.textContent = width;
        if (heightLabel.current && heightLabel.current.textContent !== height)
          heightLabel.current.textContent = height;
      }
      if (!paused) frame = requestAnimationFrame(updateMeasurements);
    }

    updateMeasurements();
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  return (
    <div className="absolute inset-0" ref={root}>
      <BlueprintDrawing>
        <defs>
          <path d={circle.guides} id={guideId}>
            <Morph
              attributeName="d"
              values={stages.map((stage) => stage.guides)}
            />
          </path>
          {/* Keep coincident grid lines from darkening the continuous guides. */}
          <mask
            height="440"
            id={gridMaskId}
            maskUnits="userSpaceOnUse"
            style={{ maskType: "luminance" }}
            width="560"
            x="0"
            y="0"
          >
            <rect fill="white" height="440" stroke="none" width="560" />
            <use href={`#${guideId}`} stroke="black" strokeWidth="1.3" />
            <SliderGridMask />
          </mask>
          {/* Origin at the circle center aligns a hatch line with its 45° radius. */}
          <pattern
            height="10"
            id={hatchId}
            patternTransform="translate(284 204)"
            patternUnits="userSpaceOnUse"
            width="10"
          >
            <path d="M0 10 10 0" opacity="0.27" strokeWidth="0.65" />
          </pattern>
        </defs>
        <g mask={`url(#${gridMaskId})`} opacity="0.08" strokeWidth="0.6">
          {gridX.map((x) => (
            <path d={`M${x} 68V348`} key={x} />
          ))}
          {gridY.map((y) => (
            <path d={`M104 ${y}H464`} key={y} />
          ))}
        </g>
        <use href={`#${guideId}`} opacity="0.24" strokeWidth="0.65" />
        <path {...secondaryLine} d={circle.dimensions}>
          <Morph
            attributeName="d"
            values={stages.map((stage) => stage.dimensions)}
          />
        </path>
        <g>
          <Morph
            attributeName="opacity"
            values={stages.map((stage) => stage.showHeight)}
          />
          <path {...secondaryLine} d={circle.heightDimension}>
            <Morph
              attributeName="d"
              values={stages.map((stage) => stage.heightDimension)}
            />
          </path>
        </g>
        <path d={circle.outline} strokeWidth="1">
          <Morph
            attributeName="d"
            values={stages.map((stage) => stage.outline)}
          />
        </path>
        <g strokeWidth="0.8">
          <Morph
            attributeName="opacity"
            values={stages.map((stage) => stage.showHeight)}
          />
          {tangentIds.map((id) => (
            <circle
              data-anchor={id}
              cx={circle.points[id][0]}
              cy={circle.points[id][1]}
              key={id}
              r="2.5"
            >
              <Morph
                attributeName="cx"
                values={stages.map((stage) => stage.points[id][0])}
              />
              <Morph
                attributeName="cy"
                values={stages.map((stage) => stage.points[id][1])}
              />
            </circle>
          ))}
        </g>
        <PrimitivesMorphTransitions />
        {morphDetailIds.map((stage, index) => (
          <g data-construction={stage} key={stage} opacity="0">
            <animate
              attributeName="opacity"
              begin={`${index * morphStageDuration}s`}
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
            <MorphDetails hatchId={hatchId} stage={stage} />
          </g>
        ))}
        <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
          <text ref={widthLabel} textAnchor="middle" x="284" y="49">
            6u
          </text>
          <g>
            <Morph
              attributeName="opacity"
              values={stages.map((stage) => stage.showHeight)}
            />
            <text ref={heightLabel} textAnchor="middle" x="482" y="207">
              6u
            </text>
          </g>
          <text textAnchor="middle" x="184" y="384">
            u
          </text>
        </g>
        <g {...secondaryLine}>
          <path d="M164 364H204 m-44 4 8-8 m32 8 8-8" />
          <path d="M76 82h12 M82 76v12 M470 340h12 M476 334v12 M278 204h12 M284 198v12" />
          <path d="M266 401h36 M284 395v12" />
        </g>
        <SwitchThumb />
      </BlueprintDrawing>
    </div>
  );
}
