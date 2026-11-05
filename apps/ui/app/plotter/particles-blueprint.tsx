import { BlueprintDrawing } from "./blueprint-drawing";

function ParticleContent({
  kind,
  x,
  y,
}: {
  kind: "identity" | "visibility" | "action";
  x: number;
  y: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g opacity="0.7" strokeWidth="0.65">
        {kind === "identity" && (
          <>
            <circle cx="26" cy="24" r="10" />
            <path d="M22 24h8 M26 20v8" />
          </>
        )}
        {kind === "action" && <path d="m120 20 4 4-4 4" />}
      </g>
      {kind === "visibility" && (
        <g strokeWidth="0.95">
          <rect height="18" rx="9" width="30" x="98" y="15" />
          <circle cx="119" cy="24" r="5.5" />
        </g>
      )}
      <g fill="currentColor" fontSize="11" opacity="0.76" stroke="none">
        <text x={kind === "identity" ? 46 : 16} y="28">
          {kind === "identity"
            ? "Studio"
            : kind === "visibility"
              ? "Public"
              : "Open"}
        </text>
      </g>
    </g>
  );
}

export function ParticlesBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M72 96V104 M72 168V200 M72 264V296 M72 360V376 M216 96V104 M216 168V200 M216 264V296 M216 360V376" />
        <path d="M64 112H224 M64 160H224 M64 208H224 M64 256H224 M64 304H224 M64 352H224" />
        <path d="M328 140V152 M472 140V152 M328 312V352 M472 312V352" />
        <path d="M316 160H484 M316 304H484" />
      </g>
      <g opacity="0.36" strokeDasharray="4 5" strokeWidth="0.65">
        <path d="M320 184H284A16 16 0 0 1 268 168V152A16 16 0 0 0 252 136H224" />
        <path d="M320 232H224" />
        <path d="M320 280H284A16 16 0 0 0 268 296V312A16 16 0 0 1 252 328H224" />
      </g>
      <g opacity="0.36" strokeWidth="0.65">
        <path d="m315.76 179.76 4.24 4.24-4.24 4.24 M315.76 227.76 320 232l-4.24 4.24 M315.76 275.76 320 280l-4.24 4.24" />
      </g>
      <g strokeWidth="0.95">
        <rect height="48" rx="8" width="144" x="72" y="112" />
        <rect height="48" rx="8" width="144" x="72" y="208" />
        <rect height="48" rx="8" width="144" x="72" y="304" />
        <rect height="144" rx="8" width="144" x="328" y="160" />
      </g>
      <path d="M328 208H472 M328 256H472" opacity="0.5" strokeWidth="0.65" />
      <ParticleContent kind="identity" x={72} y={112} />
      <ParticleContent kind="visibility" x={72} y={208} />
      <ParticleContent kind="action" x={72} y={304} />
      <ParticleContent kind="identity" x={328} y={160} />
      <ParticleContent kind="visibility" x={328} y={208} />
      <ParticleContent kind="action" x={328} y={256} />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M328 336H386 M414 336H472 M328 328V344 M472 328V344" />
        <path d="m324 340 8-8 m136 8 8-8" />
        <path d="M484 160H508 M484 304H508 M500 160V218 M500 246V304" />
        <path d="m496 164 8-8 m-8 152 8-8" />
        <path d="M40 208V224 M40 240V256 M34 208H64 M34 256H64" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="58" y="140">
          A
        </text>
        <text textAnchor="end" x="58" y="236">
          B
        </text>
        <text textAnchor="end" x="58" y="332">
          C
        </text>
        <text textAnchor="middle" x="144" y="86">
          Parts
        </text>
        <text textAnchor="middle" x="400" y="134">
          Composition
        </text>
        <text textAnchor="middle" x="400" y="339">
          3u
        </text>
        <text textAnchor="middle" x="500" y="236">
          3u
        </text>
        <text textAnchor="middle" x="40" y="236">
          u
        </text>
        <text textAnchor="middle" x="400" y="376">
          A + B + C
        </text>
      </g>
      <g opacity="0.32" strokeWidth="0.6">
        <path d="M48 82h12 M54 76v12 M480 374h12 M486 368v12" />
      </g>
    </BlueprintDrawing>
  );
}
