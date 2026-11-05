import { BlueprintDrawing } from "./blueprint-drawing";

export function NoMatchingResultsStudy() {
  return (
    <BlueprintDrawing>
      <g strokeWidth="0.6" opacity="0.24">
        <path d="M280 100V110 M280 146V170 M280 206V230 M280 266V290 M280 326V344" />
        <path d="M448 100V110 M448 146V170 M448 206V230 M448 266V290 M448 326V344" />
        <path d="M320 100V110 M320 146V170 M320 206V216 M320 280V290 M320 326V344" />
      </g>
      <g strokeWidth="0.95">
        <rect x="280" y="110" width="168" height="36" rx="4" />
        <rect x="280" y="170" width="168" height="36" rx="4" />
        <rect x="280" y="290" width="168" height="36" rx="4" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M320 110V146 M320 170V206 M320 290V326" />
        <path d="M338 124H420 M338 132H390 M338 184H420 M338 192H402 M338 304H420 M338 312H384" />
      </g>
      <g strokeWidth="0.65" opacity="0.45" strokeDasharray="3 5">
        <rect x="280" y="230" width="168" height="36" rx="4" />
      </g>
      <g strokeWidth="0.95">
        <rect x="96" y="230" width="80" height="36" rx="18" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M268 248H184" strokeDasharray="4 6" />
        <path d="m263.757359 243.757359 4.242641 4.242641 -4.242641 4.242641" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M456 188H482 M456 248H482 M474 188V209 M474 227V248" />
        <path d="m470 192 8-8 m-8 68 8-8" />
      </g>
      <g fontSize="11" opacity="0.72" fill="currentColor" stroke="none">
        <text x="280" y="88">
          Index
        </text>
        <text x="96" y="211">
          Query
        </text>
        <text
          x="136"
          y="252"
          textAnchor="middle"
          className="[font-variation-settings:'GEOM'_0]"
        >
          03
        </text>
        <text
          x="300"
          y="132"
          textAnchor="middle"
          className="[font-variation-settings:'GEOM'_0]"
        >
          01
        </text>
        <text
          x="300"
          y="192"
          textAnchor="middle"
          className="[font-variation-settings:'GEOM'_0]"
        >
          02
        </text>
        <text
          x="300"
          y="312"
          textAnchor="middle"
          className="[font-variation-settings:'GEOM'_0]"
        >
          04
        </text>
        <text x="364" y="252" textAnchor="middle">
          0 matches
        </text>
      </g>
      <text
        x="474"
        y="222"
        textAnchor="middle"
        fontSize="10"
        opacity="0.5"
        fill="currentColor"
        stroke="none"
      >
        u
      </text>
    </BlueprintDrawing>
  );
}
