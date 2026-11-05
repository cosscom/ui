import { BlueprintDrawing } from "../blueprint-drawing";

const unit = 60;
const frame = { left: 160, top: 88, size: 4 * unit };
const seamX = frame.left + 2 * unit;
const upperCenterY = frame.top + unit;
const lowerCenterY = frame.top + 3 * unit;
const middleY = frame.top + 2 * unit;
const bottomY = frame.top + frame.size;
const rightX = frame.left + frame.size;
const radialOffset = unit / Math.SQRT2;
const radiusTip = {
  x: seamX + radialOffset,
  y: upperCenterY - radialOffset,
};

// A conceptual compatibility diagram, not a physical joint or API topology.
// The two regions are complementary: their common interface is owned once.
// Two equal tangent generating circles give a C1-continuous pair of arcs.
const interfaceProfile = `M${seamX} ${frame.top}A${unit} ${unit} 0 0 1 ${seamX} ${middleY}A${unit} ${unit} 0 0 0 ${seamX} ${bottomY}`;
const complementaryLoci = `M${seamX} ${frame.top}A${unit} ${unit} 0 0 0 ${seamX} ${middleY} M${seamX} ${middleY}A${unit} ${unit} 0 0 1 ${seamX} ${bottomY}`;

// The half-unit field locates the circle centers, radii, and square edges.
// Shared axes/boundaries own their strokes; text zones are omitted in geometry.
const grid = [
  "M160 330V352 M400 330V352",
  "M190 64V198 M190 218V352",
  "M220 64V198 M220 218V352",
  "M250 64V352",
  "M310 64V102 M310 134V352",
  "M340 64V198 M340 218V352",
  "M370 64V198 M370 218V352",
  "M136 88H158 M402 88H424",
  "M136 118H284 M318 118H424",
  "M136 178H424",
  "M136 208H178 M230 208H330 M382 208H424",
  "M136 238H424",
  "M136 298H424",
  "M136 328H158 M402 328H424",
].join(" ");

export function SharedSystemStudy() {
  return (
    <BlueprintDrawing>
      <path d={grid} opacity="0.1" strokeWidth="0.6" />
      <g opacity="0.24" strokeDasharray="8 3 1 3" strokeWidth="0.6">
        <path
          d={`M${seamX} 64V352 M136 ${upperCenterY}H434 M136 ${lowerCenterY}H434`}
        />
        <path d={complementaryLoci} />
      </g>
      <g strokeWidth="0.95">
        <rect
          height={frame.size}
          width={frame.size}
          x={frame.left}
          y={frame.top}
        />
        <path d={interfaceProfile} />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d={`M${seamX} ${upperCenterY} ${radiusTip.x} ${radiusTip.y}`} />
        <path
          d={`M${radiusTip.x - 6} ${radiusTip.y}H${radiusTip.x}V${radiusTip.y + 6}`}
        />
        <path
          d={`M${frame.left} 40V86 M${rightX} 40V86 M${frame.left} 56H258 M302 56H${rightX} m-244 4 8-8 m232 8 8-8`}
        />
        <path
          d={`M440 ${upperCenterY}V198 M440 218V${lowerCenterY} M434 ${upperCenterY}h12 M434 ${lowerCenterY}h12 m-10-116 8-8 m-8 128 8-8`}
        />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="280" y="60">
          4u
        </text>
        <text textAnchor="middle" x="440" y="212">
          2u
        </text>
        <text
          textAnchor="middle"
          transform="rotate(-45 302 120)"
          x="302"
          y="120"
        >
          r = u
        </text>
        <text textAnchor="middle" x="204" y="212">
          App
        </text>
        <text textAnchor="middle" x="356" y="212">
          coss
        </text>
        <text textAnchor="middle" x="280" y="391">
          One shared interface
        </text>
      </g>
    </BlueprintDrawing>
  );
}
