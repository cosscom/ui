import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function LetterAnatomy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M111 132H449M111 308H449M170 89V354M364 89V354" />
        <path d="M266 76V361M108 220H452" strokeDasharray="5 6" />
        <circle cx="266" cy="220" r="96" strokeDasharray="3 5" />
        <path d="M111 124H449M111 316H449" strokeDasharray="3 6" />
      </g>
      <path
        d="M330 146V132H364V308H330V294C313 309 290 316 266 316C213 316 170 273 170 220C170 167 213 124 266 124C290 124 313 131 330 146ZM266 158C232 158 204 186 204 220C204 254 232 282 266 282C300 282 328 254 328 220C328 186 300 158 266 158Z"
        fill="currentColor"
        fillOpacity="0.025"
        fillRule="evenodd"
        strokeWidth="1.1"
      />
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M266 158H328V220M204 220V282H266" />
        <path d="M260 220h12M266 214v12" />
        <path d="M266 124H213M170 220V167M266 316H319" />
      </g>
      <g fill="var(--color-sidebar)" opacity="0.8" strokeWidth="0.65">
        <rect height="4" width="4" x="264" y="122" />
        <rect height="4" width="4" x="168" y="218" />
        <rect height="4" width="4" x="264" y="314" />
        <circle cx="213" cy="124" r="2" />
        <circle cx="170" cy="167" r="2" />
        <circle cx="319" cy="316" r="2" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M394 132V308M386 132H402M386 308H402" />
        <path d="m390 136 8-8m-8 184 8-8" />
        <path d="M330 333V361M364 333V361M330 352H364" />
        <path d="m326 356 8-8m26 8 8-8" />
        <path d="M266 220 222 176m0 6v-6h6" />
        <path d="M205 304H126L111 319" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text
          transform="rotate(-90 415 220)"
          textAnchor="middle"
          x="415"
          y="220"
        >
          x-height
        </text>
        <text textAnchor="middle" x="347" y="377">
          Stem
        </text>
        <text transform="rotate(45 233 192)" x="233" y="192">
          r
        </text>
        <text textAnchor="end" x="113" y="334">
          Overshoot
        </text>
        <text textAnchor="middle" x="266" y="402">
          Anatomy of a letter
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function MarkInMaking() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M280 63V377M116 220H444" strokeDasharray="5 6" />
        <path d="M166 84V356M394 84V356M146 106H414M146 334H414" />
        <circle cx="280" cy="220" r="114" strokeDasharray="3 6" />
        <circle cx="280" cy="220" r="78" strokeDasharray="3 6" />
        <path d="M280 220 404 96M280 220 404 344" />
        <path d="M158 98h16M166 90v16M386 342h16M394 334v16" />
      </g>
      <path
        d="M360.61 139.39A114 114 0 1 0 360.61 300.61L335.15 275.15A78 78 0 1 1 335.15 164.85Z"
        fill="currentColor"
        fillOpacity="0.025"
        strokeWidth="1.1"
      />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M315.36 184.64A50 50 0 0 1 315.36 255.36" />
        <path d="m315 190v-6h6m-6 65v6h6" />
        <path d="M280 220 199.39 139.39m0 6v-6h6" />
        <path d="M166 355V377M202 355V377M166 368H202" />
        <path d="m162 372 8-8m28 8 8-8" />
        <path d="M367 143H416L432 127" />
        <path d="M274 220h12M280 214v12" />
      </g>
      <g fill="var(--color-sidebar)" opacity="0.8" strokeWidth="0.65">
        <circle cx="280" cy="106" r="2.5" />
        <circle cx="166" cy="220" r="2.5" />
        <circle cx="280" cy="334" r="2.5" />
        <rect height="4" width="4" x="358.61" y="137.39" />
        <rect height="4" width="4" x="333.15" y="162.85" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="340" y="224">
          90°
        </text>
        <text transform="rotate(45 223 151)" x="223" y="151">
          R
        </text>
        <text textAnchor="middle" x="184" y="392">
          1u
        </text>
        <text x="435" y="121">
          Terminal
        </text>
        <text textAnchor="middle" x="302" y="399">
          A mark in the making
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const objectStudies: IllustrationStudy[] = [
  {
    id: "type-letter",
    code: "T01",
    title: "Anatomy of a letter",
    description:
      "A custom lowercase a exposes its circular bowl, counter, stem, and optical overshoot.",
    category: "Foundations",
    illustration: <LetterAnatomy />,
  },
  {
    id: "type-monogram",
    code: "T02",
    title: "A mark in the making",
    description:
      "Two concentric arcs and a deliberate opening establish the logic of a simple geometric C.",
    category: "Foundations",
    illustration: <MarkInMaking />,
  },
];
