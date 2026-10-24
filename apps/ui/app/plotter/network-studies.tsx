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
  const routes =
    "M132 224H216A24 24 0 0 0 240 200V152A24 24 0 0 1 264 128H420 M132 224H420 M132 224H216A24 24 0 0 1 240 248V296A24 24 0 0 0 264 320H420";

  return (
    <BlueprintDrawing>
      <g opacity="0.08" strokeWidth="0.6">
        {[168, 192, 216, 240, 264, 288, 312, 336, 360, 384].map((x) => (
          <path d={`M${x} 104V344`} key={x} />
        ))}
        {[152, 176, 200, 248, 272, 296].map((y) => (
          <path d={`M108 ${y}H444`} key={y} />
        ))}
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path
          d="M108 128H470 M108 224H470 M108 320H470"
          strokeDasharray="5 5"
        />
        <path d="M132 105V361 M420 105V361 M240 92V350" />
      </g>

      {/* Parallel outlines make the route itself the constructed form. */}
      <path d={routes} opacity="0.8" strokeWidth="13" />
      <path d={routes} stroke="var(--color-sidebar)" strokeWidth="11" />
      <g opacity="0.8" strokeWidth="1">
        <path d="M132 218V230 M420 122V134 M420 218V230 M420 314V326" />
      </g>
      <path d={routes} opacity="0.25" strokeDasharray="3 5" strokeWidth="0.6" />
      <path
        d="M132 224H216A24 24 0 0 0 240 200V152A24 24 0 0 1 264 128H420"
        opacity="0.6"
        strokeWidth="0.7"
      />

      <g opacity="0.37" strokeWidth="0.65">
        <circle cx="264" cy="152" r="24" strokeDasharray="2 4" />
        <path d="M264 119V162 M230 152H274 M258 152h12 M264 146v12" />
        <path d="M264 152 296 120 310 106H342" />
        <path d="M228 210H216V198" />
        <path d="M216 224A24 24 0 0 0 240 200" />
        <path d="M170 218V188H192 M170 230V248 M164 218h12 M164 230h12" />
        <path d="M460 128V164 M460 188V224 M460 224V260 M460 284V320" />
        <path d="M454 128h12 M454 224h12 M454 320h12" />
        <path d="m456 132 8-8 m-8 104 8-8 m-8 104 8-8" />
        <path d="M132 356H252 M300 356H420 M132 348V364 M420 348V364" />
        <path d="m128 360 8-8 m280 8 8-8" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <circle cx="132" cy="224" r="2.5" />
        <circle cx="420" cy="128" r="2.5" />
        <circle cx="420" cy="224" r="2.5" />
        <circle cx="420" cy="320" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.55" stroke="none">
        <text x="348" y="109">
          R24
        </text>
        <text x="154" y="180">
          w = 12
        </text>
        <text textAnchor="middle" x="460" y="179">
          96
        </text>
        <text textAnchor="middle" x="460" y="275">
          96
        </text>
        <text textAnchor="middle" x="276" y="359">
          288
        </text>
        <text textAnchor="end" x="119" y="211">
          in
        </text>
        <text x="430" y="117">
          01
        </text>
        <text x="430" y="213">
          02
        </text>
        <text x="430" y="309">
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
      "One continuous route, three outlets. Parallel outlines reveal its width, repeated bend radius, and equal branch spacing.",
    category: "Systems",
    illustration: <BranchingWorkflowStudy />,
  },
];
