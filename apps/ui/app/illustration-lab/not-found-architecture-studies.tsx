import { BlueprintDrawing } from "./blueprint-drawing";
import { NotFoundBlueprint } from "./not-found-blueprint";
import type { IllustrationStudy } from "./study-types";

function UnopenedDoor() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M168 92V340M248 92V340M288 92V340M368 92V340" />
        <path d="M112 128H448M112 168H448M112 208H448M112 288H448" />
      </g>

      <g opacity="0.25" strokeWidth="0.65">
        <path d="M208 70V356M336 70V356M96 248H464" strokeDasharray="5 5" />
        <path d="M208 96H336V248" strokeDasharray="3 6" />
        <path d="M196 84H208V96M336 84H348V96" />
      </g>

      <path
        d="M128 248H208V264H128ZM336 248H432V264H336Z"
        fill="currentColor"
        fillOpacity="0.035"
        strokeWidth="1"
      />
      <g opacity="0.25" strokeWidth="0.6">
        <path d="m136 248-8 8m24-8-16 16m32-16-16 16m32-16-16 16m32-16-16 16m24-8-8 8" />
        <path d="m344 248-8 8m24-8-16 16m32-16-16 16m32-16-16 16m32-16-16 16m32-16-16 16m24-8-8 8" />
      </g>

      <path d="M208 248V120H214V248" strokeWidth="1" />
      <path d="M208 120A128 128 0 0 1 336 248" strokeWidth="0.9" />
      <path
        d="M218 248H326"
        opacity="0.3"
        strokeDasharray="3 5"
        strokeWidth="0.65"
      />
      <path d="M208 226H230V248" opacity="0.45" strokeWidth="0.65" />

      <g opacity="0.5" strokeWidth="0.65">
        <path d="M208 302V322M336 302V322M208 314H252M292 314H336" />
        <path d="m204 318 8-8m120 8 8-8" />
        <path d="M208 248 296 160m-6 0h6v6" />
        <path d="M152 248V120M144 120H160M144 248H160" />
        <path d="m148 124 8-8m-8 136 8-8" />
        <path d="M332 218H388L404 202" />
      </g>

      <circle
        cx="208"
        cy="248"
        fill="var(--color-sidebar)"
        r="3.5"
        strokeWidth="0.8"
      />
      <circle
        cx="336"
        cy="248"
        fill="var(--color-sidebar)"
        r="2.5"
        strokeWidth="0.8"
      />

      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="272" y="317">
          4u
        </text>
        <text transform="rotate(-45 253 190)" x="253" y="190">
          r = 4u
        </text>
        <text x="237" y="235">
          90°
        </text>
        <text x="408" y="200">
          01
        </text>
        <text textAnchor="middle" x="272" y="374">
          Threshold / plan
        </text>
      </g>

      <g opacity="0.35" strokeWidth="0.65">
        <path d="M100 86h12M106 80v12M448 332h12M454 326v12" />
        <path d="M254 397h36M272 391v12" />
      </g>
    </BlueprintDrawing>
  );
}

function VacantSheet() {
  return (
    <BlueprintDrawing>
      <g opacity="0.17" strokeWidth="0.6">
        <path d="M124 104H438M124 344H438M168 62V374M392 62V374" />
        <path d="M280 54V390M100 224H460" strokeDasharray="5 5" />
        <path d="M156 92H168V104M392 92H404V104M156 344H168V356M392 344H404V356" />
      </g>

      <g transform="rotate(-8 280 220)">
        <path
          d="M184 82H326L376 132V350H184Z"
          fill="var(--color-sidebar)"
          strokeWidth="1"
        />
        <path d="M326 82V132H376" strokeWidth="0.9" />
        <path d="M326 82 376 132" opacity="0.5" strokeWidth="0.65" />
        <path
          d="M326 132 351 107"
          opacity="0.28"
          strokeDasharray="3 4"
          strokeWidth="0.65"
        />
        <path
          d="M198 140V98H312M198 290V334H362V146"
          opacity="0.27"
          strokeWidth="0.65"
        />

        <g opacity="0.32" strokeWidth="0.65">
          <path d="M220 162h18M220 162v18M340 162h-18M340 162v18" />
          <path d="M220 274h18M220 274v-18M340 274h-18M340 274v-18" />
          <path d="M272 218H288M280 210V226" />
        </g>
        <path d="M198 306H362M312 306V334" opacity="0.45" strokeWidth="0.65" />
        <path d="M208 318H246M208 324H230" opacity="0.24" strokeWidth="0.65" />
        <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
          <text textAnchor="middle" x="337" y="324">
            404
          </text>
        </g>

        <g opacity="0.5" strokeWidth="0.65">
          <path d="M184 56H326M184 48V64M326 48V64" />
          <path d="m180 60 8-8m134 8 8-8" />
          <path d="M404 132V350M396 132H412M396 350H412" />
          <path d="m400 136 8-8m-8 226 8-8" />
        </g>
      </g>

      <g opacity="0.45" strokeWidth="0.65">
        <path d="M205 230H136L120 246" />
        <path d="M326 99H426L442 83" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="91" y="264">
          No content
        </text>
        <text x="447" y="81">
          01
        </text>
      </g>

      <g opacity="0.35" strokeWidth="0.65">
        <path d="M100 86h12M106 80v12M448 354h12M454 348v12" />
        <path d="M262 406h36M280 400v12" />
      </g>
    </BlueprintDrawing>
  );
}

export const notFoundArchitectureStudies: IllustrationStudy[] = [
  {
    id: "404-doorway",
    code: "E01",
    title: "An empty threshold",
    description:
      "A precise architectural threshold opens onto empty space, suggesting a destination that was never built.",
    category: "404",
    illustration: <UnopenedDoor />,
  },
  {
    id: "404-interrupted-path",
    code: "E02",
    title: "An interrupted path",
    description:
      "A measured route stops at a missing link. Its paired outlines and unresolved destination make the interruption the central gesture.",
    category: "404",
    illustration: <NotFoundBlueprint />,
    revision: true,
  },
  {
    id: "404-vacant-sheet",
    code: "E03",
    title: "A vacant sheet",
    description:
      "A carefully measured document preserves its frame and registration marks while the page itself remains absent.",
    category: "404",
    illustration: <VacantSheet />,
  },
];
