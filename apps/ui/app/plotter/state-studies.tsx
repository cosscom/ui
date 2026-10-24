import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function MissingDestination() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M124 104V338M196 104V338M268 104V338M340 104V338M412 104V338" />
        <path d="M100 138H458M100 210H458M100 282H458" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M100 282H454M340 72V352" strokeDasharray="5 6" />
        <path d="M118 94h12M124 88v12M446 336h12M452 330v12" />
        <path d="M306 350H444M306 343v14M444 343v14m-142-3 8-8m130 8 8-8" />
        <path d="M282 165H306M282 159v12M306 159v12" />
      </g>
      <path
        d="M124 282H196a24 24 0 0 0 24-24V234a24 24 0 0 1 24-24H282"
        strokeWidth="1.15"
      />
      <path d="m278 205 8 10" strokeWidth="0.9" />
      <circle cx="124" cy="282" fill="var(--color-sidebar)" r="5" />
      <circle cx="124" cy="282" fill="currentColor" r="1.5" stroke="none" />
      <g opacity="0.48" strokeWidth="0.75">
        <path d="M306 318V100H406L444 138V318Z" strokeDasharray="4 5" />
        <path d="M406 100V138H444" />
      </g>
      <g strokeWidth="0.95">
        <path d="M306 116V100H322M428 318H444V302M306 302V318H322" />
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M328 174h14M328 174v14M422 174h-14M422 174v14M328 268h14M328 268v-14M422 268h-14M422 268v-14" />
        <path d="M368 210h14M375 203v14" />
        <path d="M282 210H306" strokeDasharray="2 4" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="111" y="310">
          Start
        </text>
        <text textAnchor="middle" x="294" y="153">
          ∅
        </text>
        <text textAnchor="middle" x="375" y="298">
          404 / Not found
        </text>
        <text textAnchor="middle" x="375" y="371">
          An absent destination
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const stateStudies: IllustrationStudy[] = [
  {
    id: "state-missing-page",
    code: "S01",
    title: "The missing destination",
    description:
      "A clear route reaches the outline of a page that isn’t there. The absence belongs to the destination.",
    category: "Empty states",
    illustration: <MissingDestination />,
  },
];
