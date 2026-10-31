import { secondaryLine } from "./primitives-morph-style";
import { morphCycleDuration as duration } from "./primitives-morph-timing";

type Timing = { start: number; end: number };

const circleToCapsule = { start: 2.4, end: 3.2 };
const buttonToCard = { start: 12, end: 12.8 };

function TransitionVisibility({ start, end }: Timing) {
  return (
    <animate
      attributeName="opacity"
      begin="0s"
      calcMode="linear"
      dur={`${duration}s`}
      keyTimes={[0, start - 0.18, start, end, end + 0.18, duration]
        .map((time) => time / duration)
        .join(";")}
      repeatCount="indefinite"
      values="0;0;1;1;0;0"
    />
  );
}

function TransitionMotion({
  attributeName,
  from,
  to,
  start,
  end,
}: Timing & {
  attributeName: string;
  from: string | number;
  to: string | number;
}) {
  return (
    <animate
      attributeName={attributeName}
      begin="0s"
      calcMode="spline"
      dur={`${duration}s`}
      keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0 0 1 1;0 0 1 1"
      keyTimes={[0, start, end, end + 0.2, end + 0.24, duration]
        .map((time) => time / duration)
        .join(";")}
      repeatCount="indefinite"
      values={[from, from, to, to, from, from].join(";")}
    />
  );
}

const corners = [
  { id: "top-right", x: 1, y: -1 },
  { id: "bottom-right", x: 1, y: 1 },
  { id: "bottom-left", x: -1, y: 1 },
  { id: "top-left", x: -1, y: -1 },
] as const;

export function PrimitivesMorphTransitions() {
  return (
    <g>
      <g data-transition="circle-to-capsule" opacity="0">
        <TransitionVisibility {...circleToCapsule} />
        <g opacity="0.3" strokeDasharray="4 4" strokeWidth="0.65">
          {[204, 364].map((center) => (
            <circle cx="284" cy="204" key={center} r="120">
              <TransitionMotion
                {...circleToCapsule}
                attributeName="cx"
                from={284}
                to={center}
              />
              <TransitionMotion
                {...circleToCapsule}
                attributeName="r"
                from={120}
                to={80}
              />
            </circle>
          ))}
        </g>
        <g {...secondaryLine}>
          {[204, 364].map((center) => (
            <circle cx="284" cy="204" key={center} r="3">
              <TransitionMotion
                {...circleToCapsule}
                attributeName="cx"
                from={284}
                to={center}
              />
            </circle>
          ))}
        </g>
      </g>
      <g data-transition="button-to-card" opacity="0">
        <TransitionVisibility {...buttonToCard} />
        <g opacity="0.3" strokeDasharray="4 4" strokeWidth="0.65">
          {corners.map(({ id, x, y }) => (
            <circle cx={284 + x * 136} cy={204 + y * 56} key={id} r="24">
              <TransitionMotion
                {...buttonToCard}
                attributeName="cx"
                from={284 + x * 136}
                to={284 + x * 80}
              />
              <TransitionMotion
                {...buttonToCard}
                attributeName="cy"
                from={204 + y * 56}
                to={204 + y * 80}
              />
              <TransitionMotion
                {...buttonToCard}
                attributeName="r"
                from={24}
                to={40}
              />
            </circle>
          ))}
        </g>
        <g {...secondaryLine}>
          {corners.map(({ id, x, y }) => (
            <circle cx={284 + x * 136} cy={204 + y * 56} key={id} r="2.5">
              <TransitionMotion
                {...buttonToCard}
                attributeName="cx"
                from={284 + x * 136}
                to={284 + x * 80}
              />
              <TransitionMotion
                {...buttonToCard}
                attributeName="cy"
                from={204 + y * 56}
                to={204 + y * 80}
              />
            </circle>
          ))}
        </g>
      </g>
    </g>
  );
}
