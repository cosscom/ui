import { BlueprintDrawing, CompactBlueprintDrawing } from "./blueprint-drawing";
import { HorizontalDimension } from "./dimensions";

function RequestRoute() {
  return (
    <>
      <path d="M112 288H176A24 24 0 0 0 200 264V244A40 40 0 0 1 240 204H272 M112 304H176A40 40 0 0 0 216 264V244A24 24 0 0 1 240 220H272" />
      <path d="M112 288V304 M272 204V220" />
    </>
  );
}

function AbsentPage({ dash = "3 5" }: { dash?: string }) {
  return (
    <g opacity="0.45" strokeDasharray={dash} strokeWidth="0.65">
      <path d="M304 196V116H404L440 152V308H304V228 M404 116V152H440" />
      <circle cx="304" cy="212" r="8" />
      <path d="M280 204H296 M280 220H296" />
    </g>
  );
}

// S01 is shared by the gallery and M03. The marker follows the true R32
// centerline inside the 16-unit route; its 3.5-unit radius stays clear of the
// closed end at x272. No part of the request crosses the 32-unit address gap.
export function MissingDestinationBlueprint({
  animated = false,
}: {
  animated?: boolean;
}) {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M112 256V280 M112 312V328 M176 312V328 M200 224V236 M216 272V284 M240 188V196 M304 100V108 M304 316V328 M404 100V108 M404 160V172 M440 100V144 M440 316V328" />
        <path d="M96 288H104 M96 304H104 M288 116H296 M412 116H456 M288 308H296 M448 308H456" />
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path
          d="M296 212H348 M396 212H448 M372 100V196 M372 228V324"
          strokeDasharray="8 3 1 3"
        />
        <path d="M240 204V196 M272 196V168 M304 196V168" />
        <path d="M176 250V278 M162 264H190 M226 244H254 M240 230V258" />
      </g>
      <AbsentPage />
      <g strokeWidth="0.95">
        <RequestRoute />
        {animated && (
          <circle r="3.5">
            <animateMotion
              calcMode="spline"
              dur="8.4s"
              keyPoints="0;0;1;1;0;0"
              keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1"
              keyTimes="0;0.1;0.48;0.58;0.9;1"
              path="M122 296H176A32 32 0 0 0 208 264V244A32 32 0 0 1 240 212H266"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
      <g
        opacity="0.5"
        strokeWidth="0.65"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <HorizontalDimension label="u" x1={272} x2={304} y={160} />
        <path d="M304 104V116H316 M428 308H440V296 M304 296V308H316" />
        <path d="M304 328V348 M440 328V348" />
        <HorizontalDimension label="Destination" x1={304} x2={440} y={354} />
        <path d="M211.716 215.716 188 192H156 M205.716 215.716H211.716V209.716" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="112" y="336">
          Request
        </text>
        <text textAnchor="middle" x="372" y="216">
          404
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="end" x="150" y="195">
          R40
        </text>
        <text textAnchor="middle" x="372" y="386">
          No page at this address
        </text>
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M94 84h12 M100 78v12 M454 372h12 M460 366v12" />
      </g>
    </BlueprintDrawing>
  );
}

export function MissingDestinationCompact() {
  return (
    <CompactBlueprintDrawing center={[276, 212]} scale={0.23}>
      <RequestRoute />
      <AbsentPage dash="2 2" />
    </CompactBlueprintDrawing>
  );
}
