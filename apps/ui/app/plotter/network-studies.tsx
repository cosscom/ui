import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function RegistrationMarks() {
  return (
    <g opacity="0.28" strokeWidth="0.6">
      <path d="M96 88h16 M104 80v16 M448 352h16 M456 344v16" />
      <path d="M268 382h24 M280 376v12" />
    </g>
  );
}

function BranchingWorkflowStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M132 104V208 M132 240V344 M240 104V120 M240 160V192 M240 256V344 M424 104V116 M424 140V212 M424 236V308 M424 332V344" />
        <path d="M108 128H224 M108 320H224 M280 176H444 M280 272H444" />
      </g>
      <g opacity="0.28" strokeDasharray="4 6" strokeWidth="0.65">
        <path d="M216 224H420 M216 224A24 24 0 0 1 240 248V296A24 24 0 0 0 264 320H420" />
        <path d="M240 152a24 24 0 1 0 24-24" />
      </g>
      <g strokeWidth="0.95">
        <path d="M136 224H216A24 24 0 0 0 240 200V152A24 24 0 0 1 264 128H420" />
        <circle cx="132" cy="224" r="4" />
        <circle cx="424" cy="128" r="4" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <circle cx="424" cy="224" r="4" />
        <circle cx="424" cy="320" r="4" />
        <path d="M258 152h12 M264 146v12 M268 148 280.97 135.03" />
        <path d="M460 128V164 M460 188V224 M460 224V260 M460 284V320" />
        <path d="M434 128H470 M434 224H470 M434 320H470" />
        <path d="m456 132 8-8 m-8 104 8-8 m-8 104 8-8" />
        <path d="M216 338V364 M240 350V364 M216 356H240 m-28 4 8-8 m16 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="296" y="158">
          r
        </text>
        <text textAnchor="middle" x="460" y="179">
          4r
        </text>
        <text textAnchor="middle" x="460" y="275">
          4r
        </text>
        <text textAnchor="middle" x="228" y="378">
          r
        </text>
        <text textAnchor="end" x="120" y="213">
          in
        </text>
        <text x="408" y="111">
          01
        </text>
        <text x="408" y="207">
          02
        </text>
        <text x="408" y="303">
          03
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

export const networkStudies: IllustrationStudy[] = [
  {
    id: "workflow-branch",
    code: "W02",
    title: "A route, constructed",
    description:
      "One selected route and two alternatives share a junction. A repeated bend radius establishes the spacing between the three outlets.",
    category: "Systems",
    illustration: <BranchingWorkflowStudy />,
  },
];
