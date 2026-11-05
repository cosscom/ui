import { BlueprintDrawing, CompactBlueprintDrawing } from "./blueprint-drawing";
import { HorizontalDimension, VerticalDimension } from "./dimensions";

function PlugBody() {
  return (
    <>
      <rect height="88" rx="12" width="96" x="128" y="176" />
      <path d="M224 190H264V202H224 M224 238H264V250H224" />
    </>
  );
}

// Conceptual section: the fixed support lies behind x356. A separate socket
// has a 12-unit flange in front of that plane and a body recessed to x400.
// Contact pockets enter at x344 and stop at x388, inside the socket body.
// The one-sided hatch denotes a support; it is not a material specification.
function SocketSection({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <path d="M356 128V168 M356 272V312" />
      <path d="M344 190V168H356V180H400V260H356V272H344V250 M344 202V238" />
      <path d="M344 190H388V202H344 M344 238H388V250H344" />
      <path
        d={
          compact
            ? "M356 144l16-16 M356 304l16-16"
            : "M356 144l16-16 M356 160l16-16 M356 288l16-16 M356 304l16-16"
        }
        opacity="0.27"
        strokeWidth="0.65"
      />
    </>
  );
}

export function DisconnectedBlueprint() {
  return (
    <BlueprintDrawing>
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M112 176H248 M112 264H248 M128 160V172 M128 268V280 M224 160V172 M224 268V280" />
      </g>
      <path
        d="M56 214H72 M56 226H72"
        opacity="0.45"
        strokeDasharray="3 5"
        strokeWidth="0.65"
      />
      <g strokeWidth="0.95">
        <path d="M72 214H128 M72 226H128" />
        <PlugBody />
        <SocketSection />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M328 196H272 M328 244H272" strokeDasharray="4 6" />
        <path d="M323.757 191.757 328 196 323.757 200.243 M323.757 239.757 328 244 323.757 248.243" />
        {/* Gap witnesses: the pin ends at x264 and socket mouth at x344. */}
        <path d="M264 182V146 M344 160V146" />
        <HorizontalDimension label="80" x1={264} x2={344} y={140} />
        {/* Both pin and pocket centerlines are y196 and y244. */}
        <path d="M396 196H426 M396 244H426" />
        <VerticalDimension label="48" x={432} y1={196} y2={244} />
        <path d="M376 172V162" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="304" y="110">
          Disconnected
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="376" y="154">
          Socket
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export function DisconnectedCompact() {
  return (
    <CompactBlueprintDrawing center={[238, 220]} scale={0.25}>
      <PlugBody />
      <path d="M72 214H128 M72 226H128" />
      <SocketSection compact />
      <path
        d="M272 196H336 M272 244H336"
        opacity="0.24"
        strokeDasharray="8 3 1 3"
        strokeWidth="0.6"
      />
    </CompactBlueprintDrawing>
  );
}
