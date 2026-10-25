import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

type GridBoundary = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// Trim the actual guide geometry around forms and labels. No cover or mask.
function gridSegments(
  start: number,
  end: number,
  omissions: [number, number][],
) {
  const segments: [number, number][] = [];
  let cursor = start;
  for (const [from, to] of omissions.sort((a, b) => a[0] - b[0])) {
    if (from > cursor) segments.push([cursor, Math.min(from, end)]);
    cursor = Math.max(cursor, to);
    if (cursor >= end) break;
  }
  if (cursor < end) segments.push([cursor, end]);
  return segments;
}

function constructionGrid(
  boundary: GridBoundary,
  columns: readonly number[],
  rows: readonly number[],
  omissions: GridBoundary[],
) {
  return [
    ...columns.flatMap((x) =>
      gridSegments(
        boundary.top,
        boundary.bottom,
        omissions
          .filter(({ left, right }) => x >= left && x <= right)
          .map(({ top, bottom }) => [top, bottom]),
      ).map(([from, to]) => `M${x} ${from}V${to}`),
    ),
    ...rows.flatMap((y) =>
      gridSegments(
        boundary.left,
        boundary.right,
        omissions
          .filter(({ top, bottom }) => y >= top && y <= bottom)
          .map(({ left, right }) => [left, right]),
      ).map(([from, to]) => `M${from} ${y}H${to}`),
    ),
  ].join(" ");
}

const arrowOffset = 6 / Math.SQRT2;
const cpu = { x: 220, y: 144, size: 120, pinPitch: 12, pinLength: 12 };
const cpuPinOffsets = Array.from(
  { length: 8 },
  (_, i) => 18 + i * cpu.pinPitch,
);
const processorRoutes = [174, 234];
const boardGrid = constructionGrid(
  { left: 88, right: 472, top: 96, bottom: 336 },
  Array.from({ length: 15 }, (_, i) => 112 + i * 24).filter((x) => x !== 280),
  Array.from({ length: 9 }, (_, i) => 120 + i * 24),
  [
    { left: 206, right: 354, top: 130, bottom: 278 },
    { left: 400, right: 460, top: 150, bottom: 258 },
    ...processorRoutes.flatMap((y) => [
      { left: 118, right: 210, top: y - 6, bottom: y + 6 },
      { left: 350, right: 418, top: y - 6, bottom: y + 6 },
    ]),
    { left: 112, right: 136, top: 139, bottom: 157 },
    { left: 236, right: 324, top: 108, bottom: 130 },
  ],
);

// A hypothetical processor-board plan. Pads and trace endpoints agree, but
// the routes do not assert a functional CPU/RAM circuit or a vendor pinout.
function ProcessorBoardStudy() {
  return (
    <BlueprintDrawing>
      <path d={boardGrid} opacity="0.1" strokeWidth="0.6" />
      <g opacity="0.5" strokeWidth="0.65">
        {cpuPinOffsets.map((offset) => (
          <g key={offset}>
            <path
              d={`M${cpu.x + offset - 2} ${cpu.y}v-12h4v12 M${cpu.x + offset - 2} ${cpu.y + cpu.size}v12h4v-12`}
            />
            <path
              d={`M${cpu.x} ${cpu.y + offset - 2}h-12v4h12 M${cpu.x + cpu.size} ${cpu.y + offset - 2}h12v4h-12`}
            />
          </g>
        ))}
        {processorRoutes.map((y) => (
          <path d={`M416 ${y - 2}h-12v4h12`} key={y} />
        ))}
        <rect height="96" width="40" x="416" y="156" />
      </g>
      <g strokeWidth="0.95">
        <path d="M228 144H340V264H220V152Z" />
        <rect height="56" width="56" x="252" y="176" />
        {processorRoutes.map((y) => (
          <circle cx="124" cy={y} key={y} r="4" />
        ))}
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <circle cx="232" cy="156" r="2.4" />
        {processorRoutes.map((y) => (
          <path d={`M128 ${y}H208 M352 ${y}H404`} key={y} />
        ))}
        <path d="M238 110V130 M322 110V130 M238 116H264 M296 116H322 m-88 4 8-8 m76 8 8-8" />
      </g>
      <g opacity="0.24" strokeDasharray="8 3 1 3" strokeWidth="0.6">
        {/* Center axes stop at the package envelope and never cross the die. */}
        <path d="M280 88V102 M280 268V344" />
        <path d="M88 204H204 M356 204H412 M460 204H480" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="280" y="120">
          7p
        </text>
        <text textAnchor="middle" x="280" y="208">
          CPU
        </text>
        <text textAnchor="middle" x="436" y="208">
          RAM
        </text>
        <text textAnchor="middle" x="124" y="152">
          I/O
        </text>
        <text textAnchor="middle" x="280" y="390">
          Processor · planar construction
        </text>
      </g>
    </BlueprintDrawing>
  );
}

// The 24-unit field locates routing and terminal centers, not physical sizes.
const rcGrid = constructionGrid(
  { left: 88, right: 472, top: 112, bottom: 352 },
  Array.from({ length: 15 }, (_, i) => 112 + i * 24),
  Array.from({ length: 10 }, (_, i) => 112 + i * 24),
  [
    { left: 104, right: 456, top: 178, bottom: 190 },
    { left: 181, right: 259, top: 169, bottom: 199 },
    { left: 323, right: 333, top: 178, bottom: 346 },
    { left: 301, right: 355, top: 253, bottom: 271 },
    { left: 301, right: 355, top: 325, bottom: 346 },
    { left: 97, right: 128, top: 147, bottom: 165 },
    { left: 429, right: 468, top: 147, bottom: 165 },
    { left: 191, right: 249, top: 133, bottom: 150 },
    { left: 340, right: 360, top: 158, bottom: 176 },
    { left: 365, right: 414, top: 247, bottom: 283 },
    { left: 142, right: 260, top: 312, bottom: 330 },
  ],
);

function RcFilterStudy() {
  return (
    <BlueprintDrawing>
      <path d={rcGrid} opacity="0.1" strokeWidth="0.6" />
      <g strokeWidth="0.95">
        <circle cx="112" cy="184" r="4" />
        <circle cx="448" cy="184" r="4" />
        <path d="M116 184H184 M256 184H444 M328 184V256 M328 268V328" />
        <rect height="24" width="72" x="184" y="172" />
        <path d="M304 256H352 M304 268H352 M304 328H352 M311 335H345 M318 342H338" />
        <circle cx="328" cy="184" fill="currentColor" r="2.4" stroke="none" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="112" y="160">
          Vin
        </text>
        <text textAnchor="middle" x="448" y="160">
          Vout
        </text>
        <text textAnchor="middle" x="220" y="145">
          R1 · 1 kΩ
        </text>
        <text x="344" y="172">
          n₁
        </text>
        <text x="368" y="260">
          C1
        </text>
        <text x="368" y="278">
          100 nF
        </text>
        <text x="148" y="325">
          τ = RC = 100 μs
        </text>
        <text textAnchor="middle" x="280" y="391">
          RC low-pass · one shared node
        </text>
      </g>
    </BlueprintDrawing>
  );
}

const assemblyStations = [144, 280, 416];
const assemblyGrid = constructionGrid(
  { left: 88, right: 472, top: 184, bottom: 320 },
  assemblyStations.flatMap((x) => [x - 40, x - 32, x, x + 32, x + 40]),
  [200, 248, 264, 272, 304],
  [
    ...assemblyStations.map((x) => ({
      left: x - 42,
      right: x + 42,
      top: 198,
      bottom: 274,
    })),
    { left: 86, right: 474, top: 270, bottom: 306 },
    { left: 250, right: 310, top: 184, bottom: 196 },
    ...assemblyStations.map((x) => ({
      left: x - 2,
      right: x + 2,
      top: 312,
      bottom: 320,
    })),
  ],
);

export function ProductionChainStudy() {
  return (
    <BlueprintDrawing>
      <path d={assemblyGrid} opacity="0.1" strokeWidth="0.6" />
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M256 118V124 M304 118V124 M256 176V198 M304 176V198" />
        <path d="M144 312V358 M280 312V358 M416 312V330" />
      </g>
      <g strokeWidth="0.95">
        {assemblyStations.map((x) => (
          <g key={x}>
            {/* An open frame. The core shares its eventual side and bottom edges. */}
            <path d={`M${x - 32} 200V264H${x + 32}V200h-8v56h-48v-56Z`} />
            <path d={`M${x - 40} 272v-8h8 M${x + 32} 264h8v8`} />
          </g>
        ))}
        <rect height="48" width="48" x="256" y="128" />
        <path d="M392 208H440" />
        <path d="M104 272H456A16 16 0 0 1 456 304H104A16 16 0 0 1 104 272Z" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <circle cx="104" cy="288" r="8" />
        <circle cx="456" cy="288" r="8" />
        <path d="M304 288H256 M280 200V182" strokeDasharray="4 6" />
        <path
          d={`M${304 - arrowOffset} ${288 - arrowOffset} 304 288 ${304 - arrowOffset} ${288 + arrowOffset}`}
        />
        <path
          d={`M${280 - arrowOffset} ${200 - arrowOffset} 280 200 ${280 + arrowOffset} ${200 - arrowOffset}`}
        />
        <path d="M256 112H270 M290 112H304 M256 106v12 M304 106v12 m-52-2 8-8 m40 8 8-8" />
        <path d="M144 350H194 M230 350H280 m-140 4 8-8 m128 8 8-8" />
      </g>
      <path
        d="M256 208H304"
        opacity="0.45"
        strokeDasharray="3 5"
        strokeWidth="0.65"
      />
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
        <text textAnchor="middle" x="144" y="184">
          Load
        </text>
        <text textAnchor="middle" x="416" y="184">
          Assembled
        </text>
        <text textAnchor="middle" x="280" y="394">
          One line · equal carrier pitch
        </text>
      </g>
    </BlueprintDrawing>
  );
}

const cradle = {
  centers: [216, 260, 304, 348, 392],
  pivotY: 120,
  length: 176,
  radius: 22,
  pivotRadius: 2.4,
  angle: Math.PI / 6,
} as const;
const cradleRestY = cradle.pivotY + cradle.length;
const cradlePivotX = cradle.centers[0];
const displacedBob = {
  x: cradlePivotX - cradle.length * Math.sin(cradle.angle),
  y: cradle.pivotY + cradle.length * Math.cos(cradle.angle),
};
const displacedStringStart = {
  x: cradlePivotX - cradle.pivotRadius * Math.sin(cradle.angle),
  y: cradle.pivotY + cradle.pivotRadius * Math.cos(cradle.angle),
};
const displacedStringEnd = {
  x: cradlePivotX - (cradle.length - cradle.radius) * Math.sin(cradle.angle),
  y: cradle.pivotY + (cradle.length - cradle.radius) * Math.cos(cradle.angle),
};
// Trim the center trajectory exactly where it meets the two bob outlines.
const cradleArcInset = 2 * Math.asin(cradle.radius / (2 * cradle.length));
const cradleArcStart = {
  x: cradlePivotX - cradle.length * Math.sin(cradle.angle - cradleArcInset),
  y: cradle.pivotY + cradle.length * Math.cos(cradle.angle - cradleArcInset),
};
const cradleArcEnd = {
  x: cradlePivotX - cradle.length * Math.sin(cradleArcInset),
  y: cradle.pivotY + cradle.length * Math.cos(cradleArcInset),
};
const cradleArcArrow = [-Math.PI / 4, Math.PI / 4]
  .map(
    (angle) =>
      `${cradleArcEnd.x - 6 * Math.cos(cradleArcInset + angle)} ${cradleArcEnd.y - 6 * Math.sin(cradleArcInset + angle)}`,
  )
  .join(` ${cradleArcEnd.x} ${cradleArcEnd.y} `);
const cradleAngleRadius = 48;
const cradleRadiusOffset = cradle.radius / Math.SQRT2;

export function NewtonsCradleStudy() {
  return (
    <BlueprintDrawing>
      {/* S1 marks identify the fixed support, not a material cross-section. */}
      <g opacity="0.27" strokeWidth="0.65">
        {Array.from({ length: 15 }, (_, i) => 176 + i * 16).map((x) => (
          <path d={`M${x} 112l16-16`} key={x} />
        ))}
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M304 322V340 M348 322V340 M396 120H458" />
        <path d="M96 296H190 M414 296H458" strokeDasharray="8 3 1 3" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        {cradle.centers.map((x) => (
          <g key={x}>
            <path d={`M${x} 112V${cradle.pivotY - cradle.pivotRadius}`} />
            <circle cx={x} cy={cradle.pivotY} r={cradle.pivotRadius} />
          </g>
        ))}
      </g>
      <path d="M172 112H424" strokeWidth="0.95" />
      <g opacity="0.45" strokeDasharray="3 5" strokeWidth="0.65">
        <path
          d={`M${cradlePivotX} ${cradle.pivotY + cradle.pivotRadius}V${cradleRestY - cradle.radius}`}
        />
        <circle cx={cradlePivotX} cy={cradleRestY} r={cradle.radius} />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path
          d={`M${cradleArcEnd.x} ${cradleArcEnd.y}A${cradle.length} ${cradle.length} 0 0 1 ${cradleArcStart.x} ${cradleArcStart.y}`}
          strokeDasharray="4 6"
        />
        <path d={`M${cradleArcArrow}`} />
      </g>
      <g strokeWidth="0.95">
        {cradle.centers.slice(1).map((x) => (
          <g key={x}>
            <path
              d={`M${x} ${cradle.pivotY + cradle.pivotRadius}V${cradleRestY - cradle.radius}`}
            />
            <circle cx={x} cy={cradleRestY} r={cradle.radius} />
          </g>
        ))}
        <path
          d={`M${displacedStringStart.x} ${displacedStringStart.y} ${displacedStringEnd.x} ${displacedStringEnd.y}`}
        />
        <circle cx={displacedBob.x} cy={displacedBob.y} r={cradle.radius} />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path
          d={`M${cradlePivotX} ${cradle.pivotY + cradleAngleRadius}A${cradleAngleRadius} ${cradleAngleRadius} 0 0 1 ${cradlePivotX - cradleAngleRadius * Math.sin(cradle.angle)} ${cradle.pivotY + cradleAngleRadius * Math.cos(cradle.angle)}`}
        />
        <path d="M464 120V194 M464 218V296 M458 120h12 M458 296h12 m-10-172 8-8 m-8 184 8-8" />
        <path d="M304 346H348 M304 340v12 M348 340v12 m-48-2 8-8 m36 8 8-8" />
        <path
          d={`M${392 + cradleRadiusOffset} ${296 - cradleRadiusOffset} 440 248H456 M${398 + cradleRadiusOffset} ${296 - cradleRadiusOffset} ${392 + cradleRadiusOffset} ${296 - cradleRadiusOffset} ${392 + cradleRadiusOffset} ${290 - cradleRadiusOffset}`}
        />
        <path d="M388 296h8 M392 292v8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="203" y="187">
          30°
        </text>
        <text textAnchor="middle" x="464" y="210">
          8u
        </text>
        <text textAnchor="middle" x="326" y="369">
          2u
        </text>
        <text textAnchor="end" x="456" y="239">
          r = u
        </text>
        <text textAnchor="middle" x="280" y="405">
          Equal lengths · tangent at rest
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const engineeringStudies: IllustrationStudy[] = [
  {
    id: "object-gpu-plan",
    code: "O06",
    title: "A processor, constructed",
    description:
      "Regular contacts connect a central CPU to I/O and memory. Dashed centerlines locate the package on an open construction grid. The layout is conceptual.",
    category: "Objects",
    illustration: <ProcessorBoardStudy />,
  },
  {
    id: "workflow-rc-filter",
    code: "W04",
    title: "One node, two paths",
    description:
      "A first-order RC low-pass joins a series resistor and a shunt capacitor at one explicit junction.",
    category: "Systems",
    illustration: <RcFilterStudy />,
  },
  {
    id: "workflow-production-chain",
    code: "W05",
    title: "A part, made in sequence",
    description:
      "Equal carriers advance along one assembly line while a matching core enters an open frame at the central station.",
    category: "Systems",
    illustration: <ProductionChainStudy />,
  },
  {
    id: "object-newtons-cradle",
    code: "O07",
    title: "Newton’s cradle, at release",
    description:
      "Five equal pendulums share a tangent rest position; one follows a true arc from a 30° release.",
    category: "Objects",
    illustration: <NewtonsCradleStudy />,
  },
];
