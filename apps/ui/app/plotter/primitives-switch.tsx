import { ConstructionAnnotation } from "./primitives-construction-motion";
import { secondaryLine } from "./primitives-morph-style";
import {
  morphCycleDuration as duration,
  morphKeyTimes as keyTimes,
} from "./primitives-morph-timing";

const radiusEndpoint = -60 / Math.sqrt(2);

export function SwitchConstruction() {
  return (
    <g>
      <path
        d="M112 204H456"
        opacity="0.24"
        strokeDasharray="4 4"
        strokeWidth="0.65"
      />
      <circle
        cx="204"
        cy="204"
        fill="none"
        opacity="0.14"
        r="60"
        strokeWidth="0.65"
      />
      <ConstructionAnnotation stage={2}>
        <g {...secondaryLine}>
          <path d="M204 300V318 M364 300V318 M204 310H270 M298 310H364" />
          <path d="m200 314 8-8 m152 8 8-8" />
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
          <text textAnchor="middle" x="284" y="313">
            4u
          </text>
          <text textAnchor="end" x="464" y="384">
            03 / Switch
          </text>
        </g>
      </ConstructionAnnotation>
    </g>
  );
}

export function SwitchThumb() {
  return (
    <g data-construction="switch-thumb" opacity="0">
      <animate
        attributeName="opacity"
        begin="0s"
        calcMode="linear"
        dur={`${duration}s`}
        keyTimes={keyTimes(0, 5.42, 5.6, 8.6, 8.8, duration)}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
      />
      <g transform="translate(204 204)">
        {/* Geometry resets after the whole thumb is hidden. */}
        <animateTransform
          attributeName="transform"
          begin="0s"
          calcMode="spline"
          dur={`${duration}s`}
          keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0 0 1 1;0 0 1 1"
          keyTimes={keyTimes(0, 6.9, 7.4, 8.82, 8.86, duration)}
          repeatCount="indefinite"
          type="translate"
          values="204 204;204 204;364 204;364 204;204 204;204 204"
        />
        <circle fill="none" r="80" strokeWidth="0.85">
          <animate
            attributeName="r"
            begin="0s"
            calcMode="spline"
            dur={`${duration}s`}
            keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0 0 1 1;0 0 1 1"
            keyTimes={keyTimes(0, 5.6, 6.4, 8.82, 8.86, duration)}
            repeatCount="indefinite"
            values="80;80;60;60;80;80"
          />
        </circle>
        <g opacity="0">
          <animate
            attributeName="opacity"
            begin="0s"
            calcMode="linear"
            dur={`${duration}s`}
            keyTimes={keyTimes(0, 7.4, 7.58, 8.82, 8.86, duration)}
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
          <path
            {...secondaryLine}
            d={`M0 0L${radiusEndpoint} ${radiusEndpoint} M${radiusEndpoint - 3} ${radiusEndpoint + 3}l6-6`}
          />
          <text
            fill="currentColor"
            fontSize="10"
            opacity="0.58"
            stroke="none"
            textAnchor="middle"
            transform="rotate(45 -23 -34)"
            x="-23"
            y="-34"
          >
            1.5u
          </text>
        </g>
      </g>
    </g>
  );
}
