import { BlueprintDrawing } from "./blueprint-drawing";

export function NotFoundBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M112 116H448M112 176H448M112 244H328M112 304H328M172 80V340M232 80V340M292 80V340M416 80V200" />
      </g>
      <g opacity="0.25" strokeWidth="0.6">
        <path d="M100 304H292M232 84V350M272 116H464" strokeDasharray="4 6" />
        <circle cx="172" cy="244" r="60" strokeDasharray="3 6" />
        <circle cx="292" cy="176" r="60" strokeDasharray="3 6" />
        <path d="M164 244H180M172 236V252M284 176H300M292 168V184" />
      </g>

      <path
        d="M124 296H172A52 52 0 0 0 224 244V176A68 68 0 0 1 292 108H308V124H292A52 52 0 0 0 240 176V244A68 68 0 0 1 172 312H124Z"
        fill="currentColor"
        fillOpacity="0.025"
        strokeWidth="0.95"
      />
      <path
        d="M124 304H172A60 60 0 0 0 232 244V176A60 60 0 0 1 292 116H308"
        opacity="0.27"
        strokeDasharray="3 5"
        strokeWidth="0.6"
      />
      <g opacity="0.38" strokeWidth="0.75">
        <path d="M364 108H389.17M364 124H389.17M364 108V124" />
        <circle cx="416" cy="116" r="28" strokeDasharray="3 5" />
        <path d="M408 116H424M416 108V124" />
      </g>
      <g opacity="0.72" strokeWidth="0.8">
        <path d="m303 103 10 26m46-26 10 26" />
      </g>
      <g opacity="0.45" strokeWidth="0.6">
        <path d="M308 140V161M364 140V161M308 153H364m-60 4 8-8m48 8 8-8" />
        <path d="M172 244 214.4 286.4m-6 0h6v-6" />
        <path d="M124 332V356M172 332V356M124 348H140M156 348H172m-52 4 8-8m40 8 8-8" />
        <path d="M224 184V212M240 184V212M224 200H240m-20 4 8-8m8 8 8-8M248 200H258" />
        <path d="M416 156V188H440" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="336" y="180">
          Missing link
        </text>
        <text x="392" y="207">
          Unresolved
        </text>
        <text x="124" y="282">
          Request
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="148" y="351">
          u
        </text>
        <text x="180" y="270">
          R60
        </text>
        <text x="264" y="204">
          16
        </text>
      </g>
    </BlueprintDrawing>
  );
}
