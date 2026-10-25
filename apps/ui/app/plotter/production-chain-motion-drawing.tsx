"use client";

import { useId } from "react";
import { BlueprintDrawing } from "./blueprint-drawing";

const cycle = 1.8;
const duration = `${cycle}s`;
const pitch = 136;
const carrierCenters = [8, 144, 280, 416];
const stations = [144, 280, 416];
const arrowOffset = 6 / Math.SQRT2;

// Quarter-pitch references sit below every swept part. Station witnesses
// own their verticals; the field ends above the dimension and its text.
const grid = Array.from({ length: 11 }, (_, i) => 110 + (i * pitch) / 4)
  .filter((x) => !stations.includes(x))
  .map((x) => `M${x} 312V336`)
  .join(" ");

const dropStart = 0.04;
const dropTime = 0.38;
const dropDistance = 80;
const impact = dropStart + dropTime;
const gravity = (2 * dropDistance) / dropTime ** 2;
const reboundHeight = 0.35;
const reboundSpeed = Math.sqrt(2 * gravity * reboundHeight);
const settled = impact + (2 * reboundSpeed) / gravity;

function coreDisplacement(time: number) {
  if (time <= dropStart) return 0;
  if (time < impact) return (gravity * (time - dropStart) ** 2) / 2;
  if (time >= settled) return dropDistance;
  const elapsed = time - impact;
  return dropDistance - reboundSpeed * elapsed + (gravity * elapsed ** 2) / 2;
}

const number = (value: number) => Number(value.toFixed(9));
// Insert wall-crossing times exactly. Linear samples between them approximate
// constant acceleration within 0.01 SVG unit; every edge uses this same curve.
const coreTimes = [
  ...new Set([
    0,
    dropStart,
    dropStart + Math.sqrt((2 * 24) / gravity),
    dropStart + Math.sqrt((2 * 72) / gravity),
    impact,
    impact + 0.000001,
    impact + reboundSpeed / gravity,
    settled,
    cycle,
    ...Array.from(
      { length: Math.ceil((settled - dropStart) * 120) },
      (_, i) => dropStart + i / 120,
    ).filter((time) => time < settled),
  ]),
].sort((a, b) => a - b);
const coreFrames = coreTimes.map((time) => {
  const displacement = coreDisplacement(time);
  const top = number(128 + displacement);
  const exposedSideEnd = number(Math.max(top, Math.min(top + 48, 200)));
  return {
    bottom: `0 ${number(displacement)}`,
    outline: `M256 ${top}H304 M256 ${top}V${exposedSideEnd} M304 ${top}V${exposedSideEnd}`,
    visibility: displacement === dropDistance ? "hidden" : "visible",
  };
});
const coreKeyTimes = coreTimes.map((time) => number(time / cycle)).join(";");

// A motor index: jerk ramps acceleration up/down, cruises, then brakes.
// Each ramp is an exact cubic; position, speed, and acceleration join smoothly.
const indexSplines =
  "0 0 1 1;0.333333333333 0 0.666666666667 0;0.333333333333 0.2 0.666666666667 0.6;0 0 1 1;0.333333333333 0.4 0.666666666667 0.8;0.333333333333 1 0.666666666667 1;0 0 1 1";

function indexMotion(
  start: number,
  travelTime: number,
  accelerate: number,
  brake: number,
  distance: number,
  origin = 0,
) {
  const speed = distance / (travelTime - (accelerate + brake) / 2);
  return {
    keyTimes: [
      0,
      start,
      start + accelerate / 2,
      start + accelerate,
      start + travelTime - brake,
      start + travelTime - brake / 2,
      start + travelTime,
      cycle,
    ]
      .map((time) => number(time / cycle))
      .join(";"),
    values: [
      origin,
      origin,
      origin + (speed * accelerate) / 12,
      origin + (speed * accelerate) / 2,
      origin + distance - (speed * brake) / 2,
      origin + distance - (speed * brake) / 12,
      origin + distance,
      origin + distance,
    ]
      .map((position) => `${number(position)} 0`)
      .join(";"),
  };
}

const belt = indexMotion(settled + 0.02, 1.1, 0.16, 0.2, pitch);
const feedTravelTime = 0.7;
const feedToDrop = 0.14;
const feedArrival = cycle + dropStart - feedToDrop;
// Feed overlaps indexing; its arrival is tied to the next drop, not the reset.
const feed = indexMotion(
  feedArrival - feedTravelTime,
  feedTravelTime,
  0.1,
  0.12,
  pitch * 2,
  -pitch * 2,
);

export function ProductionChainMotionDrawing() {
  const id = useId();
  const carrierClip = `${id}-carrier-entry-exit`;
  const feedClip = `${id}-core-feed`;

  return (
    <BlueprintDrawing>
      <defs>
        {/* Only moving objects are clipped, at their entry/exit apertures. */}
        <clipPath id={carrierClip}>
          <rect height="156" width="384" x="88" y="120" />
        </clipPath>
        <clipPath id={feedClip}>
          <rect height="56" width="240" x="88" y="124" />
        </clipPath>
      </defs>

      <g opacity="0.1" strokeWidth="0.6">
        <path d={grid} />
        <path d="M88 312H472 M88 324H472 M88 336H472" />
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        {/* Feed guides clear the moving core by 4 units and end before the drop. */}
        <path d="M256 118V124 M304 118V124 M80 124H248 M80 180H248" />
        <path d="M144 312V358 M280 312V358 M416 312V336" />
      </g>

      <g clipPath={`url(#${carrierClip})`} strokeWidth="0.95">
        <g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            dur={duration}
            keySplines={indexSplines}
            keyTimes={belt.keyTimes}
            repeatCount="indefinite"
            type="translate"
            values={belt.values}
          />
          {carrierCenters.map((x) => (
            <g key={x}>
              <path d={`M${x - 32} 200V264H${x + 32}V200h-8v56h-48v-56Z`} />
              <path d={`M${x - 40} 272v-8h8 M${x + 32} 264h8v8`} />
            </g>
          ))}
          <path d="M392 208H440" />

          {/* Core sides transfer to the carrier walls at y=200. Each
              remaining segment stays on the rigid 48×48 core boundary. */}
          <path d="M256 128H304 M256 128V176 M304 128V176">
            <animate
              attributeName="d"
              calcMode="linear"
              dur={duration}
              keyTimes={coreKeyTimes}
              repeatCount="indefinite"
              values={coreFrames.map((frame) => frame.outline).join(";")}
            />
          </path>
          <path d="M256 176H304">
            <animateTransform
              attributeName="transform"
              dur={duration}
              keyTimes={coreKeyTimes}
              repeatCount="indefinite"
              type="translate"
              values={coreFrames.map((frame) => frame.bottom).join(";")}
            />
            {/* Contact transfers the bottom to the carrier. The rebound
                restores it after 1µs, within 0.00005 unit of the seat. */}
            <animate
              attributeName="visibility"
              calcMode="discrete"
              dur={duration}
              keyTimes={coreKeyTimes}
              repeatCount="indefinite"
              values={coreFrames.map((frame) => frame.visibility).join(";")}
            />
          </path>
        </g>
      </g>

      <g clipPath={`url(#${feedClip})`} strokeWidth="0.95">
        <path
          d="M256 128H304 M256 128V176 M304 128V176 M256 176H304"
          transform="translate(-272 0)"
        >
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            dur={duration}
            keySplines={indexSplines}
            keyTimes={feed.keyTimes}
            repeatCount="indefinite"
            type="translate"
            values={feed.values}
          />
        </path>
      </g>

      <path
        d="M104 272H456A16 16 0 0 1 456 304H104A16 16 0 0 1 104 272Z"
        strokeWidth="0.95"
      />
      <g opacity="0.5" strokeWidth="0.65">
        <circle cx="104" cy="288" r="8" />
        <circle cx="456" cy="288" r="8" />
        <path d="M304 288H256" strokeDasharray="4 6" />
        <path
          d={`M${304 - arrowOffset} ${288 - arrowOffset} 304 288 ${304 - arrowOffset} ${288 + arrowOffset}`}
        />
        <path d="M256 112H270 M290 112H304 M256 106v12 M304 106v12 m-52-2 8-8 m40 8 8-8" />
        <path d="M144 350H194 M230 350H280 m-140 4 8-8 m128 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="280" y="92">
          Core
        </text>
        <text textAnchor="middle" x="280" y="116">
          3u
        </text>
        <text textAnchor="middle" x="212" y="354">
          Pitch
        </text>
        <text textAnchor="middle" x="144" y="190">
          Load
        </text>
        <text textAnchor="middle" x="416" y="190">
          Assembled
        </text>
        <text textAnchor="middle" x="280" y="394">
          One line · equal carrier pitch
        </text>
      </g>
    </BlueprintDrawing>
  );
}
