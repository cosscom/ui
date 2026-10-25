import { BlueprintDrawing } from "./blueprint-drawing";

const cradle = {
  pivots: [216, 260, 304, 348, 392],
  pivotY: 120,
  length: 176,
  radius: 22,
  pivotRadius: 2.4,
  amplitude: 30,
  duration: 2,
} as const;
const restY = cradle.pivotY + cradle.length;

// Dimensionless pendulum flight: θ″ + sin(θ) = 0. Substituting
// θ = 2 asin(k cos φ), k = sin(θmax/2), gives dt/dφ below. Simpson sampling
// supplies one descent; reflection supplies the remaining three quarters.
// The user’s video reference suggests a roughly 2.4 s cycle and 30° release.
// The requested speed refinements use 2 s with the same pendulum curve.
// Contacts at ¼ and ¾ of each cycle transfer velocity without dwell.
// The complete bob sweep remains inside x = 106…502, clear of the witnesses.
// This idealization omits collision compliance, damping, and interior motion.
function swingSamples() {
  const count = 96;
  const step = Math.PI / (2 * count);
  const k = Math.sin((cradle.amplitude * Math.PI) / 360);
  const rate = (phase: number) => 1 / Math.sqrt(1 - (k * Math.cos(phase)) ** 2);
  let elapsed = 0;
  const descent = Array.from({ length: count + 1 }, (_, i) => {
    const phase = i * step;
    if (i) {
      elapsed +=
        (step *
          (rate(phase - step) + 4 * rate(phase - step / 2) + rate(phase))) /
        6;
    }
    return {
      time: elapsed,
      angle: i === count ? 0 : (360 * Math.asin(k * Math.cos(phase))) / Math.PI,
      speed: Math.sin(phase),
    };
  });
  const samples = [0, 1, 2, 3].flatMap((quarter) => {
    const reverse = quarter % 2 === 1;
    return (reverse ? [...descent].reverse() : descent)
      .slice(quarter ? 1 : 0)
      .map(({ time, angle, speed }) => ({
        time: (quarter + (reverse ? 1 - time / elapsed : time / elapsed)) / 4,
        angle: (quarter === 1 || quarter === 2 ? -1 : 1) * angle,
        // Angular velocity per normalized cycle, from the same energy integral.
        velocity:
          ((quarter < 2 ? -1 : 1) * 1440 * elapsed * k * speed) / Math.PI,
      }));
  });
  return {
    samples,
    duration: cradle.duration,
  };
}

const { samples, duration } = swingSamples();
const keyTimes = samples.map(({ time }) => time).join(";");

function swingMotion(side: "left" | "right", pivotX: number) {
  const frames = samples.map((sample) => ({
    ...sample,
    angle:
      side === "left" ? Math.max(0, sample.angle) : Math.min(0, sample.angle),
  }));
  return {
    values: frames
      .map(({ angle }) => `${angle.toFixed(9)} ${pivotX} ${cradle.pivotY}`)
      .join(";"),
    // Cubic Hermite segments preserve the calculated endpoint velocities:
    // zero at each turnaround, continuous in flight, handed off at contact.
    // Fixed x controls make spline time linear; only the angle is interpolated.
    keySplines: frames
      .flatMap((current, i) => {
        const next = frames[i + 1];
        if (!next) return [];
        const angle = next.angle - current.angle;
        if (!angle) return ["0 0 1 1"];
        const scale = (next.time - current.time) / (3 * angle);
        return [
          `0.333333333 ${(current.velocity * scale).toFixed(9)} 0.666666667 ${(1 - next.velocity * scale).toFixed(9)}`,
        ];
      })
      .join(";"),
  };
}

function Pendulum({ x }: { x: number }) {
  return (
    <>
      <path
        d={`M${x} ${cradle.pivotY + cradle.pivotRadius}V${restY - cradle.radius}`}
      />
      <circle cx={x} cy={restY} r={cradle.radius} />
    </>
  );
}

function SwingingPendulum({ side, x }: { side: "left" | "right"; x: number }) {
  const motion = swingMotion(side, x);
  return (
    <g
      data-cradle-end={side}
      transform={`rotate(${side === "left" ? cradle.amplitude : 0} ${x} ${cradle.pivotY})`}
    >
      <animateTransform
        attributeName="transform"
        begin="0s"
        calcMode="spline"
        dur={`${duration}s`}
        keySplines={motion.keySplines}
        keyTimes={keyTimes}
        repeatCount="indefinite"
        type="rotate"
        values={motion.values}
      />
      <Pendulum x={x} />
    </g>
  );
}

const radiusOffset = cradle.radius / Math.SQRT2;
const radiusPoint = { x: 304 - radiusOffset, y: restY + radiusOffset };

export function NewtonsCradleMotionDrawing() {
  return (
    <BlueprintDrawing>
      {/* S1 support marks stay fixed. No moving guide or ghost bob is needed. */}
      <g opacity="0.27" strokeWidth="0.65">
        {Array.from({ length: 15 }, (_, i) => 176 + i * 16).map((x) => (
          <path d={`M${x} 112l16-16`} key={x} />
        ))}
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M304 322V340 M348 322V340 M396 120H524" />
        <path d="M84 296H100 M510 296H524" strokeDasharray="8 3 1 3" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        {cradle.pivots.map((x) => (
          <g key={x}>
            <path d={`M${x} 112V${cradle.pivotY - cradle.pivotRadius}`} />
            <circle cx={x} cy={cradle.pivotY} r={cradle.pivotRadius} />
          </g>
        ))}
      </g>
      <path d="M172 112H424" strokeWidth="0.95" />
      <g strokeWidth="0.95">
        {cradle.pivots.slice(1, -1).map((x) => (
          <Pendulum key={x} x={x} />
        ))}
        <SwingingPendulum side="left" x={216} />
        <SwingingPendulum side="right" x={392} />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        {/* Both length witnesses lie beyond the complete swept bob envelope. */}
        <path d="M530 120V194 M530 218V296 M524 120h12 M524 296h12 m-10-172 8-8 m-8 184 8-8" />
        <path d="M304 346H348 M304 340v12 M348 340v12 m-48-2 8-8 m36 8 8-8" />
        {/* Radius leader belongs to the stationary middle bob, below the sweep. */}
        <path
          d={`M${radiusPoint.x} ${radiusPoint.y} 272 328H248 M${radiusPoint.x} ${radiusPoint.y + 6}V${radiusPoint.y}H${radiusPoint.x - 6}`}
        />
        <path d="M300 296h8 M304 292v8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text textAnchor="middle" x="530" y="210">
          8u
        </text>
        <text textAnchor="middle" x="326" y="369">
          2u
        </text>
        <text textAnchor="end" x="240" y="331">
          r = u
        </text>
        <text textAnchor="middle" x="280" y="405">
          Equal lengths · Tangent at rest
        </text>
      </g>
    </BlueprintDrawing>
  );
}
