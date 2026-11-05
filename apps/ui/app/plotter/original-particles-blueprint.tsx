import { BlueprintDrawing } from "./blueprint-drawing";

export function OriginalParticlesBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M140 108H156 M316 108H428 M140 140H156 M316 140H428" />
        <path d="M140 196H156 M412 196H428 M140 244H156 M412 244H428" />
        <path d="M140 292H156 M412 292H428 M140 340H156 M412 340H428" />
        <path d="M212 84V100 M260 84V100 M356 84V148 M356 176V188 M404 84V148 M404 176V188" />
        <path d="M212 148V188 M260 148V188 M308 148V188" />
        <path d="M212 252V284 M260 252V284 M308 252V284 M356 252V284" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M164 76V100 M164 148V188 M164 252V284 M164 348V400" />
        <path
          d="M188 76V100 M188 148V188 M188 252V284 M188 348V376"
          strokeDasharray="3 6"
        />
        <path d="M404 252V284 M404 348V400" />
        <path d="M140 100V84H156 M412 84H428V100 M140 348V364H156 M412 364H428V348" />
        <path d="M180 108A16 16 0 0 0 164 124 M172 124H184 M180 116V132" />
      </g>
      <g strokeWidth="0.95">
        <rect height="32" rx="16" width="144" x="164" y="108" />
        <rect height="48" rx="16" width="240" x="164" y="196" />
        <rect height="48" rx="16" width="240" x="164" y="292" />
      </g>
      <g opacity="0.72" strokeWidth="0.75">
        <path d="m188 124 4 4 7-8" />
        <path d="m288 120 8 8 m0-8-8 8" />
        <rect height="16" rx="3" width="16" x="188" y="212" />
        <path d="M192 220H200 M196 216V224" />
        <path d="m380 216 4 4-4 4" />
      </g>
      <g strokeWidth="0.95">
        <rect height="18" rx="9" width="30" x="350" y="307" />
        <circle cx="371" cy="316" r="5.5" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M180 124 168.69 112.69 144 88H112" />
        <path d="M164 164H188 M164 158V170 M188 158V170 m-28-2 8-8 m16 8 8-8" />
        <path d="M164 268H188 M164 262V274 M188 262V274 m-28-2 8-8 m16 8 8-8" />
        <path d="M164 364H188 M164 358V370 M188 358V370 m-28-2 8-8 m16 8 8-8" />
        <path d="M164 392H264 M304 392H404 M164 384V400 M404 384V400 m-244-4 8-8 m232 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="212" y="128">
          Ready
        </text>
        <text x="220" y="224">
          Workspace
        </text>
        <text x="188" y="320">
          Available
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="104" y="91">
          R16
        </text>
        <text x="200" y="168">
          u
        </text>
        <text x="200" y="272">
          u
        </text>
        <text x="200" y="368">
          u
        </text>
        <text textAnchor="middle" x="284" y="395">
          10u
        </text>
        <text x="324" y="164">
          Shared inset / 24
        </text>
      </g>
    </BlueprintDrawing>
  );
}
