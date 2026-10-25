import { BlueprintDrawing, CompactBlueprintDrawing } from "./blueprint-drawing";
import { HorizontalDimension } from "./dimensions";
import type { IllustrationStudy } from "./study-types";

function RequestRoute() {
  return (
    <>
      <path d="M112 288H176A24 24 0 0 0 200 264V244A40 40 0 0 1 240 204H272 M112 304H176A40 40 0 0 0 216 264V244A24 24 0 0 1 240 220H272" />
      <path d="M112 288V304 M272 204V220" />
    </>
  );
}

function AbsentPage({ dash = "4 5" }: { dash?: string }) {
  return (
    <g opacity="0.38" strokeDasharray={dash} strokeWidth="0.75">
      <path d="M304 196V116H404L440 152V308H304V228 M404 116V152H440" />
      <circle cx="304" cy="212" r="8" />
      <path d="M280 204H296 M280 220H296" />
    </g>
  );
}

function MissingDestination() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M112 256V328 M176 256V328 M200 232V280 M216 232V280 M240 188V260 M304 100V188 M304 236V328 M404 100V172 M440 100V328" />
        <path d="M96 288H184 M96 304H184 M288 116H456 M288 308H456" />
      </g>
      <g opacity="0.24" strokeWidth="0.65">
        <path
          d="M96 296H176A32 32 0 0 0 208 264V244A32 32 0 0 1 240 212H264"
          strokeDasharray="4 6"
        />
        <path
          d="M296 212H348 M396 212H448 M372 100V196 M372 228V324"
          strokeDasharray="4 6"
        />
        <path d="M240 204V196 M272 196V168 M304 196V168" />
        <path d="M176 250V278 M162 264H190 M226 244H254 M240 230V258" />
      </g>
      <AbsentPage />
      <g strokeWidth="1">
        <RequestRoute />
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
        <path d="M240 244 211.72 215.72 188 192H156" />
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
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M94 84h12 M100 78v12 M454 372h12 M460 366v12" />
      </g>
    </BlueprintDrawing>
  );
}

function MissingDestinationCompact() {
  return (
    <CompactBlueprintDrawing center={[276, 212]} scale={0.23}>
      <RequestRoute />
      <AbsentPage dash="2 2" />
    </CompactBlueprintDrawing>
  );
}

export const stateStudies: IllustrationStudy[] = [
  {
    id: "state-missing-page",
    code: "S01",
    title: "The missing destination",
    description:
      "A paired route reaches a closed end one unit before an unbuilt page. The address remains projected, but the connection is absent.",
    category: "Empty states",
    illustration: <MissingDestination />,
    emptyState: {
      title: "Page not found",
      description: "The page may have moved or no longer exists.",
      illustration: <MissingDestinationCompact />,
    },
  },
];
