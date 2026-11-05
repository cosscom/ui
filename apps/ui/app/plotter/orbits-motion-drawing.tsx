import { BlueprintDrawing } from "./blueprint-drawing";

// One cycle holds 4, 2 and 1 orbits. Radii follow Kepler’s third law,
// T² ∝ r³, so the orbit spacing agrees with the periods rather than being
// chosen by eye. Planet sizes only help the eye keep the three apart.
const center = { x: 280, y: 212 } as const;
const cycle = 12;
const unit = 52;
const sunRadius = 22;
const planets = [
  { orbits: 4, radius: 6 },
  { orbits: 2, radius: 8 },
  { orbits: 1, radius: 10 },
].map((planet) => {
  const period = cycle / planet.orbits;
  return {
    ...planet,
    period,
    orbit: unit * (period / (cycle / 4)) ** (2 / 3),
  };
});
const outerOrbit = Math.max(...planets.map((p) => p.orbit));
// The angular scale sits just outside the swept envelope of the outermost planet.
const scaleRadius = 152;
const arrowRadius = 172;
const labelRadius = 184;

// Counter-clockwise angle in degrees from the start axis; SVG y points down.
function polar(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y - radius * Math.sin(angle),
  };
}

function ray(from: number, to: number, degrees: number) {
  const a = polar(from, degrees);
  const b = polar(to, degrees);
  return `M${a.x.toFixed(3)} ${a.y.toFixed(3)}L${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}

// 24 divisions: long at quarter turns, medium at 30°, short at 15°.
const scaleTicks = Array.from({ length: 24 }, (_, i) => i * 15).reduce(
  (groups, degrees) => {
    const length = degrees % 90 === 0 ? 12 : degrees % 30 === 0 ? 8 : 4;
    const group = length === 12 ? "quarter" : length === 8 ? "third" : "step";
    groups[group] += `${ray(scaleRadius, scaleRadius + length, degrees)} `;
    return groups;
  },
  { quarter: "", third: "", step: "" },
);

// Dashed travel arrow ahead of the planets, drawn from its tip so the open
// head meets the first dash. It follows the same counter-clockwise direction.
const arrowTip = polar(arrowRadius, 72);
const arrowTail = polar(arrowRadius, 24);
const arrowTangent = {
  x: -Math.sin((72 * Math.PI) / 180),
  y: -Math.cos((72 * Math.PI) / 180),
};
const arrowHead = [-1, 1]
  .map((side) => {
    const turn = (side * Math.PI) / 4;
    const x = arrowTangent.x * Math.cos(turn) - arrowTangent.y * Math.sin(turn);
    const y = arrowTangent.x * Math.sin(turn) + arrowTangent.y * Math.cos(turn);
    return `${(arrowTip.x - 6 * x).toFixed(3)} ${(arrowTip.y - 6 * y).toFixed(3)}`;
  })
  .join(` ${arrowTip.x.toFixed(3)} ${arrowTip.y.toFixed(3)} `);

const quarterLabels = [
  { degrees: 0, text: "0° · Start", anchor: "start" },
  { degrees: 90, text: "90°", anchor: "middle" },
] as const;

function Sun() {
  return (
    <>
      <circle
        cx={center.x}
        cy={center.y}
        opacity="0.5"
        r="12"
        strokeWidth="0.65"
      />
      <circle
        cx={center.x}
        cy={center.y}
        opacity="0.5"
        r="2.5"
        strokeWidth="0.65"
      />
      <circle cx={center.x} cy={center.y} r={sunRadius} strokeWidth="0.95" />
    </>
  );
}

// An orbit is a theoretical generating path, so it takes the house centerline
// pattern for loci. Like the pitch circle in the grammar’s centerline study, it
// passes through the transparent body that travels on it.
function Orbits() {
  return (
    <g opacity="0.24" strokeDasharray="8 3 1 3" strokeWidth="0.6">
      {planets.map(({ orbit }) => (
        <circle cx={center.x} cy={center.y} key={orbit} r={orbit} />
      ))}
    </g>
  );
}

function AngularScale() {
  return (
    <>
      <circle
        cx={center.x}
        cy={center.y}
        opacity="0.24"
        r={scaleRadius}
        strokeWidth="0.6"
      />
      <path d={scaleTicks.step} opacity="0.4" strokeWidth="0.6" />
      <path d={scaleTicks.third} opacity="0.5" strokeWidth="0.65" />
      <path d={scaleTicks.quarter} opacity="0.5" strokeWidth="0.65" />
      <g opacity="0.5" strokeWidth="0.65">
        <path
          d={`M${arrowTip.x} ${arrowTip.y}A${arrowRadius} ${arrowRadius} 0 0 1 ${arrowTail.x} ${arrowTail.y}`}
          strokeDasharray="4 6"
        />
        <path d={`M${arrowHead}`} />
      </g>
    </>
  );
}

// Planets leave dashed outlines on the start axis and return into them once
// per cycle. The state is named by the “Start” label at 0°.
function StartPositions() {
  return (
    <g opacity="0.45" strokeDasharray="3 5" strokeWidth="0.65">
      {planets.map(({ orbit, radius }) => (
        <circle cx={center.x + orbit} cy={center.y} key={orbit} r={radius} />
      ))}
    </g>
  );
}

// The outer orbit’s diameter, measured between its top and bottom tangents.
// Witnesses start beyond the planet’s swept band and the dimension line breaks
// around its label, so nothing crosses a moving part.
const dimension = { x: 84, from: 196 } as const;
const dimensionTop = center.y - outerOrbit;
const dimensionBottom = center.y + outerOrbit;

function Dimension() {
  return (
    <>
      <path
        d={`M${dimension.from} ${dimensionTop}H${dimension.x - 8} M${dimension.from} ${dimensionBottom}H${dimension.x - 8}`}
        opacity="0.24"
        strokeWidth="0.6"
      />
      <path
        d={`M${dimension.x} ${dimensionTop}V${center.y - 10} M${dimension.x} ${center.y + 10}V${dimensionBottom} M${dimension.x - 4} ${dimensionTop + 4}l8 -8 M${dimension.x - 4} ${dimensionBottom + 4}l8 -8`}
        opacity="0.5"
        strokeWidth="0.65"
      />
    </>
  );
}

function Labels() {
  const labelFont = { fontSize: 10, opacity: 0.58 } as const;
  return (
    <g fill="currentColor" stroke="none">
      {quarterLabels.map(({ degrees, text, anchor }) => {
        const { x, y } = polar(labelRadius, degrees);
        return (
          <text
            key={text}
            textAnchor={anchor}
            x={x}
            y={y + (degrees === 90 ? 0 : 3.5)}
            {...labelFont}
          >
            {text}
          </text>
        );
      })}
      <text {...labelFont} textAnchor="end" x="496" y="64">
        T² ∝ r³
      </text>
      <text
        {...labelFont}
        textAnchor="middle"
        x={dimension.x}
        y={center.y + 3.5}
      >
        {`⌀${Math.round(2 * outerOrbit)}`}
      </text>
    </g>
  );
}

const keyEntries = [
  { left: 92, planet: planets[0], text: "4 orbits · 3 s" },
  { left: 232, planet: planets[1], text: "2 orbits · 6 s" },
  { left: 372, planet: planets[2], text: "1 orbit · 12 s" },
] as const;

function Key() {
  return (
    <>
      <g strokeWidth="0.95">
        {keyEntries.map(({ left, planet }) => (
          <circle cx={left + 10} cy="422" key={left} r={planet?.radius} />
        ))}
      </g>
      <g fill="currentColor" stroke="none">
        {keyEntries.map(({ left, text }) => (
          <text fontSize="10" key={left} opacity="0.58" x={left + 28} y="425.5">
            {text}
          </text>
        ))}
      </g>
    </>
  );
}

function Planet({
  animated,
  orbit,
  period,
  radius,
}: {
  animated: boolean;
  orbit: number;
  period: number;
  radius: number;
}) {
  const start = polar(orbit - radius, 0);
  return (
    <g>
      {animated && (
        <animateTransform
          attributeName="transform"
          begin="0s"
          dur={`${period}s`}
          from={`0 ${center.x} ${center.y}`}
          repeatCount="indefinite"
          to={`-360 ${center.x} ${center.y}`}
          type="rotate"
        />
      )}
      <path
        d={`M${center.x + sunRadius + 6} ${center.y}H${start.x}`}
        opacity="0.5"
        strokeWidth="0.65"
      />
      <circle
        cx={center.x + orbit}
        cy={center.y}
        r={radius}
        strokeWidth="0.95"
      />
    </g>
  );
}

function OrbitDrawing({ animated }: { animated: boolean }) {
  return (
    <BlueprintDrawing>
      <AngularScale />
      <Orbits />
      <StartPositions />
      <Sun />
      {planets.map((planet) => (
        <Planet animated={animated} key={planet.orbit} {...planet} />
      ))}
      <Dimension />
      <Labels />
      <Key />
    </BlueprintDrawing>
  );
}

export function OrbitsStudy() {
  return <OrbitDrawing animated={false} />;
}

export function OrbitsMotionDrawing() {
  return <OrbitDrawing animated />;
}
