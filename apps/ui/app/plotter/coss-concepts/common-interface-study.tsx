import { BlueprintDrawing } from "../blueprint-drawing";

// Conceptual assembly, not a physical part or infrastructure diagram.
// Four outer profiles stand for the catalog services. Their common circular
// opening stands for the shared SDK contract. The lifted quadrant is a planar
// translation (u, −u), never a rotation or a perspective/extrusion operation.
const unit = 32;
const center = { x: 264, y: 224 };
const radius = 2 * unit;
const displaced = { x: center.x + unit, y: center.y - unit };
const arrow = 6 / Math.SQRT2;

type Interval = readonly [number, number];

function remaining(start: number, end: number, cuts: Interval[]) {
  const segments: Interval[] = [];
  let cursor = start;
  for (const [from, to] of cuts.sort((a, b) => a[0] - b[0])) {
    if (from > cursor) segments.push([cursor, Math.min(from, end)]);
    cursor = Math.max(cursor, to);
    if (cursor >= end) break;
  }
  if (cursor < end) segments.push([cursor, end]);
  return segments.filter(([from, to]) => to > from);
}

const labelBounds = [
  [162, 130, 216, 151],
  [348, 89, 390, 110],
  [164, 308, 237, 331],
  [300, 308, 347, 331],
] as const;

function ConstructionGrid() {
  const paths: string[] = [];
  // The grid measures the 32-unit profile steps. Clear the common opening,
  // selected interface strip, text, and segments already owned by an outline.
  for (const x of [168, 200, 232, 296, 328, 360]) {
    const cuts: Interval[] = [];
    const dx = x - center.x;
    if (Math.abs(dx) < radius) {
      const dy = Math.sqrt(radius ** 2 - dx ** 2);
      cuts.push([center.y - dy, center.y + dy]);
    }
    if (dx <= 0 && dx > -80) {
      cuts.push([center.y, center.y + Math.sqrt(80 ** 2 - dx ** 2)]);
    }
    const displacedX = x - displaced.x;
    if (displacedX >= 0 && displacedX < radius) {
      cuts.push([
        displaced.y - Math.sqrt(radius ** 2 - displacedX ** 2),
        displaced.y,
      ]);
    }
    for (const [left, top, right, bottom] of labelBounds) {
      if (x >= left && x <= right) cuts.push([top, bottom]);
    }
    if (x === 168) cuts.push([352, 368]);
    if (x === 296) cuts.push([64, 128]);
    if (x === 360) cuts.push([288, 352]);
    paths.push(...remaining(80, 368, cuts).map(([a, b]) => `M${x} ${a}V${b}`));
  }
  for (const y of [128, 160, 192, 256, 288, 320]) {
    const cuts: Interval[] = [];
    const dy = y - center.y;
    if (Math.abs(dy) < radius) {
      const dx = Math.sqrt(radius ** 2 - dy ** 2);
      cuts.push([center.x - dx, center.x + dx]);
    }
    if (dy >= 0 && dy < 80) {
      cuts.push([center.x - Math.sqrt(80 ** 2 - dy ** 2), center.x]);
    }
    const displacedY = y - displaced.y;
    if (displacedY <= 0 && displacedY > -radius) {
      cuts.push([
        displaced.x,
        displaced.x + Math.sqrt(radius ** 2 - displacedY ** 2),
      ]);
    }
    for (const [left, top, right, bottom] of labelBounds) {
      if (y >= top && y <= bottom) cuts.push([left, right]);
    }
    if (y === 192) cuts.push([360, 424]);
    if (y === 288) cuts.push([360, 392]);
    paths.push(...remaining(120, 440, cuts).map(([a, b]) => `M${a} ${y}H${b}`));
  }
  return <path d={paths.join(" ")} opacity="0.1" strokeWidth="0.6" />;
}

function InterfaceHatch() {
  const paths: string[] = [];
  // Selected common-profile strip: SW quadrant, 64 ≤ r ≤ 80. For x+y=k,
  // circle intersections are solved analytically and the inner disk removed.
  // This highlights the matching edge; it does not assert a cut material.
  for (let sum = 408; sum <= 564; sum += 12) {
    const offset = sum - center.x - center.y;
    const outerRoot = Math.sqrt(2 * 80 ** 2 - offset ** 2);
    const low = (offset - outerRoot) / 2;
    const high = Math.min((offset + outerRoot) / 2, 0, offset);
    const cuts: Interval[] = [];
    if (Math.abs(offset) < radius * Math.SQRT2) {
      const innerRoot = Math.sqrt(2 * radius ** 2 - offset ** 2);
      cuts.push([(offset - innerRoot) / 2, (offset + innerRoot) / 2]);
    }
    for (const [a, b] of remaining(low, high, cuts)) {
      paths.push(
        `M${center.x + a} ${sum - center.x - a}L${center.x + b} ${sum - center.x - b}`,
      );
    }
  }
  return <path d={paths.join(" ")} opacity="0.27" strokeWidth="0.65" />;
}

export function CommonInterfaceStudy() {
  return (
    <BlueprintDrawing>
      <ConstructionGrid />
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M136 80V88 M128 96H120 M400 224H440" />
        <path d="M264 96 296 64 M264 160 296 128 M328 224 360 192 M392 224 424 192" />
        <path d="M266.121 221.879 293.879 194.121" />
        <path
          d="M264 72V88 M264 168V210 M264 264V280 M264 360V372 M112 224H128 M208 224H250 M284 192H290 M296 176V186"
          strokeDasharray="8 3 1 3"
        />
      </g>
      {/* The unoccupied position is projected exactly, not a second part. */}
      <g opacity="0.45" strokeDasharray="3 5" strokeWidth="0.65">
        <path d="M264 96H360L392 128V224" />
        <path d="M264 160A64 64 0 0 1 328 224" />
      </g>
      <InterfaceHatch />
      <g strokeWidth="0.95">
        {/* One owner for every shared seam in the assembled three parts. */}
        <path d="M264 96H136V320A32 32 0 0 0 168 352H360V288H392V224H328A64 64 0 1 1 264 160Z" />
        <path d="M136 224H200 M264 288V352" />
        {/* The same NE quadrant translated by (32, −32). */}
        <path d="M296 64H392L424 96V192H360A64 64 0 0 0 296 128Z" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M184 224A80 80 0 0 0 264 304" />
        <circle cx={center.x} cy={center.y} r="3" />
        <circle cx={displaced.x} cy={displaced.y} r="3" />
        <path d="M267 224H328 M299 192H360" />
        <path
          d={`M${328 - arrow} ${224 - arrow}L328 224L${328 - arrow} ${224 + arrow} M${360 - arrow} ${192 - arrow}L360 192L${360 - arrow} ${192 + arrow}`}
        />
        <path d="M136 328V374 M168 360V374 M136 380H168 M136 374V386 M168 374V386 m-36-2 8-8 m24 8 8-8" />
        <path d="M128 96H136V88 M424 200V192H432" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="188" y="145">
          Email
        </text>
        <text textAnchor="middle" x="369" y="104">
          SMS
        </text>
        <text textAnchor="middle" x="200" y="324">
          Scheduling
        </text>
        <text textAnchor="middle" x="324" y="324">
          Video
        </text>
        <text textAnchor="middle" x="264" y="253">
          One interface
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="296" y="214">
          r
        </text>
        <text textAnchor="middle" x="328" y="182">
          r
        </text>
        <text textAnchor="middle" x="152" y="400">
          u
        </text>
        <text textAnchor="middle" x="328" y="400">
          One SDK · One key per environment
        </text>
      </g>
    </BlueprintDrawing>
  );
}
