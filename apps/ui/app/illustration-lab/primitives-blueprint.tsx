import { BlueprintDrawing } from "./blueprint-drawing";

const gridCoordinates = [164, 204, 244, 284, 324, 364, 404];

export function PrimitivesBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        {gridCoordinates.map((coordinate) => (
          <path
            d={`M${coordinate} 68V348 M124 ${coordinate - 80}H444`}
            key={coordinate}
          />
        ))}
      </g>

      <g opacity="0.24" strokeWidth="0.65">
        <path d="M164 54V368 M404 54V368 M104 84H464 M104 324H464" />
        <path d="M116 372 452 36" opacity="0.48" />
        <path d="M284 42V372 M90 204H478" strokeDasharray="5 5" />
        <path d="M148 68H164V84 M404 68H420V84 M148 324H164V340 M404 324H420V340" />
      </g>

      <path
        d="M164 204A120 120 0 0 0 284 324H164Z"
        fill="currentColor"
        fillOpacity="0.035"
        stroke="none"
      />
      <g opacity="0.27" strokeWidth="0.65">
        <path d="M164 228 166.03 225.97 M164 240 168.27 235.73 M164 252 171.16 244.84 M164 264 174.63 253.37 M164 276 178.61 261.39 M164 288 183.08 268.92 M164 300 188 276 M164 312 193.36 282.64 M164 324 199.15 288.85 M176 324 205.36 294.64 M188 324 212 300 M200 324 219.08 304.92 M212 324 226.61 309.39 M224 324 234.63 313.37 M236 324 243.16 316.84 M248 324 252.27 319.73 M260 324 262.03 321.97" />
      </g>

      <g strokeWidth="1">
        <path d="M164 204V84H404V324H284" />
        <circle cx="284" cy="204" r="120" />
        <path d="M164 204V324H284" opacity="0.45" />
        <path d="M164 324 404 84" opacity="0.65" />
      </g>

      <g opacity="0.5" strokeWidth="0.65">
        <path d="M284 204H404 M284 204 369 119" />
        <path d="M308 204A24 24 0 0 0 301 187" />
        <path d="M284 216H296V204" />
        <path d="m364 119 5 0 0 5" />
        <path d="M164 46H264 M304 46H404 M164 38V54 M404 38V54" />
        <path d="m160 50 8-8 m232 8 8-8" />
        <path d="M442 84V190 M442 218V324 M434 84H450 M434 324H450" />
        <path d="m438 88 8-8 m-8 248 8-8" />
        <path d="M164 352V372 M204 352V372 M164 364H204 m-44 4 8-8 m32 8 8-8" />
        <path d="M164 270H106L90 286 M404 124H455L471 108" />
      </g>

      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <circle cx="284" cy="204" r="3" />
        <circle cx="164" cy="204" r="2.5" />
        <circle cx="284" cy="324" r="2.5" />
        <path d="M161.5 81.5h5v5h-5z M401.5 81.5h5v5h-5z M401.5 321.5h5v5h-5z M161.5 321.5h5v5h-5z" />
      </g>

      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="284" y="49">
          6u
        </text>
        <text textAnchor="middle" x="442" y="207">
          6u
        </text>
        <text textAnchor="middle" x="184" y="384">
          u
        </text>
        <text transform="rotate(-45 329 151)" x="329" y="151">
          r = 3u
        </text>
        <text x="315" y="193">
          45°
        </text>
        <text x="73" y="302">
          01
        </text>
        <text x="475" y="105">
          02
        </text>
      </g>

      <g opacity="0.4" strokeWidth="0.65">
        <path d="M76 82h12 M82 76v12 M470 340h12 M476 334v12" />
        <path d="M266 401h36 M284 395v12" />
      </g>
    </BlueprintDrawing>
  );
}
