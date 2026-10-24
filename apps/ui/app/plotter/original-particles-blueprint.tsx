import { BlueprintDrawing } from "./blueprint-drawing";

export function OriginalParticlesBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.065" strokeWidth="0.6">
        <path d="M180 160H444M180 184H444M180 208H444M180 232H444M180 256H444M180 280H444M180 304H444M180 328H444" />
        <path d="M204 136V352M228 136V352M252 136V352M276 136V352M300 136V352M324 136V352M348 136V352M372 136V352M396 136V352M420 136V352" />
      </g>

      <g opacity="0.27" strokeWidth="0.6">
        <path d="M104 160H453M104 324H453M204 140V363M428 140V363" />
        <path d="M320 88V155M428 88V155" />
        <path d="M320 137V184M428 137V184" strokeDasharray="3 5" />
        <path d="M302 188H443M302 232H443" strokeDasharray="3 5" />
        <path d="M122 178V244M302 178V244" />
        <path d="M195 151L213 169M419 315L437 333" />
        <path d="M113 160H131M122 151V169M419 160H437M428 151V169" />
      </g>

      <g opacity="0.37" strokeWidth="0.7">
        <path
          d="M204 182V176A16 16 0 0 1 220 160H412A16 16 0 0 1 428 176V248M204 240V308A16 16 0 0 0 220 324H228"
          strokeDasharray="4 5"
        />
        <path d="M320 184H428M320 180V188M428 180V188" />
        <path d="M327 210H360M355 205L360 210L355 215" />
        <path d="M374 141V168M369 163L374 168L379 163" />
      </g>

      <g opacity="0.48" strokeWidth="0.65">
        <path d="M204 354H428M204 349V359M428 349V359" />
        <path d="M201 357L207 351M425 357L431 351" />
        <path d="M320 87H428M320 83V91M428 83V91" />
        <path d="M99 188V232M95 188H103M95 232H103" />
        <path d="M96 191L102 185M96 235L102 229" />
      </g>

      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="9"
          strokeOpacity="0.85"
          width="180"
          x="122"
          y="188"
        />
        <rect height="20" opacity="0.78" rx="4" width="20" x="136" y="200" />
        <path d="M142 204V216M150 204V216M140 210H152" opacity="0.68" />
        <path d="M280 206L284 210L280 214" opacity="0.65" />

        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          strokeOpacity="0.85"
          width="108"
          x="320"
          y="104"
        />
        <path d="M334 120L337 123L343 117" opacity="0.8" />
        <path d="M409 117L415 123M415 117L409 123" opacity="0.5" />

        <path
          d="M244 264H412A16 16 0 0 1 428 280V308A16 16 0 0 1 412 324H244A16 16 0 0 1 228 308V280A16 16 0 0 1 244 264Z"
          fill="var(--color-sidebar)"
          strokeOpacity="0.85"
        />
        <rect height="22" opacity="0.8" rx="11" width="38" x="370" y="283" />
        <circle cx="397" cy="294" opacity="0.8" r="7" />
      </g>

      <g opacity="0.35" strokeWidth="0.6">
        <path d="M412 300V332M404 308H436" />
        <path d="M412 324A16 16 0 0 0 428 308" />
        <path d="M412 308L448 344H472" />
        <path d="M244 254V274M234 264H254" />
        <path d="M228 274A10 10 0 0 1 238 264" />
      </g>

      <g fill="currentColor" fontSize="11" stroke="none">
        <text opacity="0.7" x="168" y="214">
          Workspace
        </text>
        <text opacity="0.7" x="352" y="124">
          Ready
        </text>
        <text opacity="0.7" x="248" y="298">
          Available
        </text>
      </g>

      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="374" y="78">
          108
        </text>
        <text textAnchor="middle" x="316" y="371">
          224
        </text>
        <text textAnchor="end" x="89" y="214">
          44
        </text>
        <text x="448" y="338">
          R16
        </text>
        <text x="112" y="391">
          02 / Composition
        </text>
        <text textAnchor="end" x="449" y="391">
          1 : 1
        </text>
      </g>

      <g opacity="0.3" strokeWidth="0.6">
        <path d="M112 373V381M108 377H116M449 373V381M445 377H453" />
      </g>
    </BlueprintDrawing>
  );
}
