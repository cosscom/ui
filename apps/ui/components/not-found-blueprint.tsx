import { BlueprintDrawing } from "./blueprint-drawing";

export function NotFoundBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.075" strokeWidth="0.6">
        <path d="M200 72V352M240 72V352M320 212V352M360 212V352" />
        <path d="M140 132H280M140 172H280M140 252H420M140 292H420" />
      </g>

      <g opacity="0.23" strokeWidth="0.65">
        <path d="M160 64V354M400 64V354M132 92H428M132 332H428" />
        <path d="M280 66V356M132 212H426" strokeDasharray="5 5" />
        <path d="M144 76H160V92M400 76H416V92M144 332H160V348M400 332H416V348" />
      </g>

      <path
        d="M160 92H280V212H400V332H160Z"
        fill="currentColor"
        fillOpacity="0.025"
        stroke="none"
      />

      <g opacity="0.27" strokeWidth="0.65">
        <path d="M160 292 200 332M160 304 188 332M160 316 176 332M160 328 164 332" />
        <path d="M160 280V332H212" />
      </g>

      <g strokeWidth="1">
        <path d="M160 92H280V212H400V332H160Z" />
        <path d="M160 212H280V332" opacity="0.42" />
      </g>

      <g opacity="0.36" strokeWidth="0.7">
        <path d="M292 92H400V200" strokeDasharray="4 5" />
        <path d="M280 104V92H292M388 212H400V200" />
        <path d="M292 104H306M292 104V118M374 104H388V118M388 186V200H374" />
        <path d="M304 152H316M364 152H376M340 116V128M340 176V188" />
      </g>

      <g opacity="0.5" strokeWidth="0.65">
        <path d="M160 54H262M298 54H400M160 46V62M400 46V62" />
        <path d="m156 58 8-8 m232 8 8-8" />
        <path d="M442 92V196M442 228V332M434 92H450M434 332H450" />
        <path d="m438 96 8-8 m-8 248 8-8" />
        <path d="M160 360V380M280 360V380M160 372H205M235 372H280" />
        <path d="m156 376 8-8 m112 8 8-8" />
        <path d="M280 212 310 182M280 196H264V212" />
        <path d="M160 272H110L94 288" />
      </g>

      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <path d="M157.5 89.5h5v5h-5zM277.5 89.5h5v5h-5zM397.5 209.5h5v5h-5zM397.5 329.5h5v5h-5zM157.5 329.5h5v5h-5z" />
        <circle cx="280" cy="212" r="3" />
      </g>

      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="280" y="57">
          6u
        </text>
        <text textAnchor="middle" x="442" y="216">
          6u
        </text>
        <text textAnchor="middle" x="220" y="375">
          3u
        </text>
        <text x="77" y="304">
          03
        </text>
      </g>

      <text
        fill="currentColor"
        fontSize="12"
        opacity="0.6"
        stroke="none"
        textAnchor="middle"
        x="340"
        y="156"
      >
        404
      </text>

      <g opacity="0.35" strokeWidth="0.65">
        <path d="M78 92h12M84 86v12M468 332h12M474 326v12" />
        <path d="M262 408h36M280 402v12" />
      </g>
    </BlueprintDrawing>
  );
}
