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

function CompleteAssembly() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M160 88V352M220 88V352M280 88V352M340 88V352M400 88V352" />
        <path d="M132 100H430M132 160H430M132 220H430M132 280H430M132 340H430" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M280 76V364M120 220H440" strokeDasharray="5 6" />
        <path d="M154 94h12M160 88v12M394 346h12M400 340v12" />
        <path d="M160 370H400M160 363v14M400 363v14m-244-3 8-8m232 8 8-8" />
        <path d="M126 100V340M120 100h12M120 340h12" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.9">
        <path d="M174 100H268V208H160V114a14 14 0 0 1 14-14Z" />
        <path d="M292 100H386a14 14 0 0 1 14 14V208H292Z" />
        <path d="M160 232H400V326a14 14 0 0 1-14 14H174a14 14 0 0 1-14-14Z" />
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="m204 220 48 48 108-108" strokeDasharray="4 5" />
        <path d="M198 214H210M204 208V220M354 166H366M360 160V172" />
        <path d="M252 268V296M240 284H268" />
        <path d="M276 244a34 34 0 0 0-48 0" />
      </g>
      <path
        d="m196 220 17-17 39 39 99-99 17 17-116 116Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.1"
      />
      <path
        d="m204.5 211.5 47.5 47.5 107.5-107.5"
        opacity="0.18"
        strokeWidth="0.6"
      />
      <g opacity="0.4" strokeWidth="0.6">
        <path d="M292 118H316L334 87H370" />
        <path d="M268 120H292M268 114v12M292 114v12" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="375" y="90">
          Aligned
        </text>
        <text textAnchor="end" x="113" y="224">
          1 : 1
        </text>
        <text textAnchor="middle" x="280" y="391">
          All in place
        </text>
        <text textAnchor="middle" x="252" y="303">
          90°
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
    category: "States",
    illustration: <MissingDestination />,
  },
  {
    id: "state-complete",
    code: "S02",
    title: "Everything in place",
    description:
      "Three fitted panels become one complete assembly, with a precisely constructed check marking the finished work.",
    category: "States",
    illustration: <CompleteAssembly />,
  },
];
