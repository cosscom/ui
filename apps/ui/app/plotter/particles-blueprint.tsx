import { BlueprintDrawing } from "./blueprint-drawing";

function Registration() {
  return (
    <g opacity="0.32" strokeWidth="0.6">
      <path d="M68 82h12 M74 76v12 M480 374h12 M486 368v12" />
    </g>
  );
}

export function ParticlesBlueprint() {
  return (
    <BlueprintDrawing>
      <g transform="translate(0 -24)">
        <g opacity="0.12" strokeWidth="0.6">
          <path d="M72 132H488 M72 176H488 M72 232H488 M72 276H488 M72 320H488 M72 364H488" />
          <path d="M88 112V380 M176 112V380 M200 112V380 M224 112V380 M336 112V380 M360 112V380 M384 112V380 M472 112V380" />
        </g>
        <g opacity="0.07" strokeWidth="0.6">
          <path d="M72 154H488 M72 254H488 M72 298H488 M72 342H488" />
        </g>
        <g opacity="0.19" strokeDasharray="4 6" strokeWidth="0.6">
          <path d="M144 112V176 M144 232V380 M280 112V176 M280 232V380 M416 112V176 M416 232V380" />
        </g>
        <g opacity="0.37" strokeWidth="0.65">
          <path
            d="M144 187V198L224 218 M280 187V218 M416 187V198L336 218"
            strokeDasharray="3 5"
          />
          <path d="M220 215 224 218 219 219 M277 214 280 218 283 214 M341 215 336 218 341 219" />
          <path d="M88 120v-8h18 M182 112h18v8 M224 120v-8h18 M318 112h18v8 M360 120v-8h18 M454 112h18v8" />
          <path d="M176 388H384 M176 382v12 M384 382v12 m-212-2 8-8 m200 8 8-8" />
        </g>
        <g strokeWidth="0.95">
          <rect
            fill="var(--color-sidebar)"
            height="44"
            rx="8"
            width="112"
            x="88"
            y="132"
          />
          <circle cx="110" cy="154" r="10" />
          <path d="M106 154h8 M110 150v8" opacity="0.7" />
          <rect
            fill="var(--color-sidebar)"
            height="44"
            rx="8"
            width="112"
            x="224"
            y="132"
          />
          <rect height="18" rx="9" width="30" x="291" y="145" />
          <circle cx="312" cy="154" r="5.5" />
          <rect
            fill="var(--color-sidebar)"
            height="44"
            rx="8"
            width="112"
            x="360"
            y="132"
          />
          <path d="m453 151 3 3-3 3" opacity="0.55" />
          <rect
            fill="var(--color-sidebar)"
            height="132"
            rx="11"
            width="208"
            x="176"
            y="232"
          />
          <path d="M176 276H384 M176 320H384" opacity="0.32" />
          <circle cx="200" cy="254" r="10" />
          <path d="M196 254h8 M200 250v8" opacity="0.7" />
          <rect height="18" rx="9" width="30" x="340" y="289" />
          <circle cx="361" cy="298" r="5.5" />
          <path d="m365 339 3 3-3 3" opacity="0.55" />
        </g>
        <g opacity="0.34" strokeWidth="0.6">
          <path d="M190 222v20 M180 232h20 M370 354v20 M360 364h20" />
          <path d="M156 232V364 M151 232h10 M151 276h10 M151 320h10 M151 364h10" />
          <path d="M187 232a11 11 0 0 0-11 11 M373 364a11 11 0 0 0 11-11" />
        </g>
        <g fill="currentColor" fontSize="11" opacity="0.76" stroke="none">
          <text x="128" y="158">
            Studio
          </text>
          <text x="237" y="158">
            Public
          </text>
          <text x="374" y="158">
            Open
          </text>
          <text x="220" y="258">
            Studio
          </text>
          <text x="190" y="302">
            Public
          </text>
          <text x="190" y="346">
            Open
          </text>
        </g>
        <rect
          fill="var(--color-sidebar)"
          height="16"
          stroke="none"
          width="24"
          x="126"
          y="290"
        />
        <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
          <text textAnchor="middle" x="144" y="97">
            A / Identity
          </text>
          <text textAnchor="middle" x="280" y="97">
            B / Visibility
          </text>
          <text textAnchor="middle" x="416" y="97">
            C / Action
          </text>
          <text textAnchor="middle" x="280" y="408">
            A + B + C
          </text>
          <text textAnchor="end" x="145" y="302">
            3u
          </text>
        </g>
        <Registration />
      </g>
    </BlueprintDrawing>
  );
}
