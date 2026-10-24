import { BlueprintDrawing } from "./blueprint-drawing";

function Registration() {
  return (
    <g opacity="0.32" strokeWidth="0.6">
      <path d="M100 82h12 M106 76v12 M448 342h12 M454 336v12" />
      <path d="M266 382h28 M280 376v12" />
    </g>
  );
}

export function ParticlesBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M120 132H440 M120 176H440 M176 244H384 M176 288H384 M176 332H384" />
        <path d="M176 100V352 M224 100V352 M336 100V352 M384 100V352" />
      </g>
      <g opacity="0.37" strokeWidth="0.65">
        <path
          d="M176 187V202L232 230 M384 187V202L328 230"
          strokeDasharray="3 5"
        />
        <path d="M230 226 232 230 227 230 M330 226 328 230 333 230" />
        <path d="M120 120v-8h18 M214 112h18v8 M328 120v-8h18 M422 112h18v8" />
        <path d="M176 355H384 M176 349v12 M384 349v12 m-212-2 8-8 m200 8 8-8" />
      </g>
      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="8"
          width="112"
          x="120"
          y="132"
        />
        <circle cx="142" cy="154" r="10" />
        <path d="M138 154h8 M142 150v8" opacity="0.7" />
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="8"
          width="112"
          x="328"
          y="132"
        />
        <rect height="18" rx="9" width="30" x="395" y="145" />
        <circle cx="416" cy="154" r="5.5" />
        <rect
          fill="var(--color-sidebar)"
          height="88"
          rx="11"
          width="208"
          x="176"
          y="244"
        />
        <path d="M176 288H384" opacity="0.32" />
        <circle cx="200" cy="266" r="10" />
        <path d="M196 266h8 M200 262v8" opacity="0.7" />
        <path d="m365 263 3 3-3 3" opacity="0.55" />
        <rect height="18" rx="9" width="30" x="340" y="301" />
        <circle cx="361" cy="310" r="5.5" />
      </g>
      <g opacity="0.34" strokeWidth="0.6">
        <path d="M190 234v20 M180 244h20 M370 322v20 M360 332h20" />
        <path d="M156 244V332 M151 244h10 M151 332h10" />
        <path d="M187 244a11 11 0 0 0-11 11 M373 332a11 11 0 0 0 11-11" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.76" stroke="none">
        <text x="160" y="158">
          Studio
        </text>
        <text x="341" y="158">
          Public
        </text>
        <text x="220" y="270">
          Studio
        </text>
        <text x="190" y="314">
          Public
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="176" y="97">
          A / Identity
        </text>
        <text textAnchor="middle" x="384" y="97">
          B / Visibility
        </text>
        <text textAnchor="middle" x="280" y="374">
          A + B
        </text>
        <text textAnchor="end" x="145" y="292">
          2u
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}
