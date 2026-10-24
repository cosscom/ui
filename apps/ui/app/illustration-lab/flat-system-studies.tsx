import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function SpacingPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M132 100V336 M156 100V324 M188 100V324 M212 100V324 M292 100V324 M316 100V324 M396 100V324 M420 100V336" />
        <path d="M108 124H444 M108 156H444 M108 232H444 M108 252H444 M108 284H444 M108 304H444" />
      </g>
      <g opacity="0.27" strokeWidth="0.6">
        <path d="M108 140H444 M108 268H444" strokeDasharray="5 6" />
        <path d="M172 100V324 M356 100V324" strokeDasharray="3 6" />
        <rect height="32" width="32" x="156" y="124" />
        <circle cx="332" cy="140" r="16" strokeDasharray="2 4" />
        <path d="M332 116V164 M308 140H348" />
        <path d="M172 178V210 m-4-4 4 4 4-4 M252 178V210 m-4-4 4 4 4-4 M356 178V210 m-4-4 4 4 4-4" />
        <path d="M120 232h-8v8 M432 304h8v-8" />
      </g>
      <g strokeWidth="0.95">
        <circle cx="172" cy="140" r="16" />
        <path d="M212 133H292 M212 147H268" />
        <rect height="32" rx="16" width="80" x="316" y="124" />
        <path d="M340 140H372" opacity="0.6" />
        <rect height="72" rx="16" width="288" x="132" y="232" />
        <circle cx="172" cy="268" r="16" />
        <path d="M212 261H292 M212 275H268" />
        <rect height="32" rx="16" width="80" x="316" y="252" />
        <path d="M340 268H372" opacity="0.6" />
      </g>
      <g opacity="0.48" strokeWidth="0.65">
        <path d="M132 332H156 M188 332H212 M292 332H316 M396 332H420" />
        <path d="M132 326v12 M156 326v12 M188 326v12 M212 326v12 M292 326v12 M316 326v12 M396 326v12 M420 326v12" />
        <path d="M132 370H420 M132 362v16 M420 362v16 m-292-4 8-8 m280 8 8-8" />
        <path d="M332 124 354 94H382" />
        <path d="M172 140 183.3 128.7" />
        <path d="M112 232H92 M112 304H92 M100 232V304 m-4-68 8-8 m-8 80 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="388" y="97">
          R16
        </text>
        <text textAnchor="end" x="84" y="272">
          3u
        </text>
        <g textAnchor="middle">
          <text x="144" y="351">
            u
          </text>
          <text x="200" y="351">
            u
          </text>
          <text x="304" y="351">
            u
          </text>
          <text x="408" y="351">
            u
          </text>
          <text x="276" y="390">
            12u
          </text>
        </g>
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M100 80h12 M106 74v12 M448 354h12 M454 348v12" />
      </g>
    </BlueprintDrawing>
  );
}

const switchInputs = [148, 212, 276];
const switchOutputs = [216, 280, 344];

function SwitchPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M184 100V324 M248 100V324 M312 100V324 M376 100V324" />
        <path d="M168 116H392 M168 180H392 M168 244H392 M168 308H392" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M176 116h8v-8 M376 108v8h8 M176 308h8v8 M376 316v-8h8" />
        <path
          d="M280 88V112 M104 212H120 M400 212H424 M280 308V320"
          strokeDasharray="3 5"
        />
        <rect height="32" width="32" x="264" y="196" />
        <circle cx="280" cy="212" r="16" />
        <path d="M291.3 200.7 328 164H372" />
      </g>
      <g opacity="0.4" strokeWidth="0.75">
        {switchInputs.map((y) => (
          <path d={`M124 ${y}H392`} key={y} />
        ))}
        {switchOutputs.map((x) => (
          <path d={`M${x} 100V336`} key={x} />
        ))}
      </g>
      <path d="M124 212H280V336" strokeWidth="1.15" />
      <g fill="var(--color-sidebar)" strokeWidth="0.7">
        {switchOutputs.flatMap((x) =>
          switchInputs.map((y) => (
            <circle cx={x} cy={y} key={`${x}-${y}`} r="4" />
          )),
        )}
      </g>
      <circle cx="280" cy="212" fill="currentColor" r="3" stroke="none" />
      <g fill="var(--color-sidebar)" strokeWidth="0.85">
        {switchInputs.map((y) => (
          <circle cx="120" cy={y} key={y} r="4" />
        ))}
        {switchOutputs.map((x) => (
          <circle cx={x} cy="340" key={x} r="4" />
        ))}
      </g>
      <g opacity="0.48" strokeWidth="0.65">
        <path d="M216 76H344 M216 68v16 M280 68v16 M344 68v16 m-132-4 8-8 m56 8 8-8 m56 8 8-8" />
        <path d="M424 148V276 M416 148h16 M416 212h16 M416 276h16 m-12-124 8-8 m-8 72 8-8 m-8 72 8-8" />
        <path
          d="M216 92V64 M344 92V64 M400 148H440 M400 276H440"
          opacity="0.5"
        />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="248" y="61">
          u
        </text>
        <text textAnchor="middle" x="312" y="61">
          u
        </text>
        <text x="438" y="184">
          u
        </text>
        <text x="438" y="248">
          u
        </text>
        <text x="380" y="167">
          B / 02
        </text>
        <g textAnchor="end">
          <text x="100" y="152">
            A
          </text>
          <text x="100" y="216">
            B
          </text>
          <text x="100" y="280">
            C
          </text>
        </g>
        <g textAnchor="middle">
          <text x="216" y="365">
            01
          </text>
          <text x="280" y="365">
            02
          </text>
          <text x="344" y="365">
            03
          </text>
        </g>
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M100 96h12 M106 90v12 M448 354h12 M454 348v12" />
      </g>
    </BlueprintDrawing>
  );
}

const matrixColumns = [152, 184, 216, 248, 280, 312, 344, 376, 408];
const matrixRows = [104, 136, 168, 200, 232, 264, 296];
const distributionPoints = [
  [248, 168],
  [280, 168],
  [312, 168],
  [248, 200],
  [280, 200],
  [312, 200],
  [280, 232],
  [312, 232],
] as const;

function CoordinatePlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M152 88V312 M216 88V312 M280 88V312 M344 88V312 M408 88V312" />
        <path d="M136 104H424 M136 168H424 M136 232H424 M136 296H424" />
      </g>
      <g fill="currentColor" opacity="0.22" stroke="none">
        {matrixColumns.flatMap((x) =>
          matrixRows.map((y) => (
            <circle cx={x} cy={y} key={`${x}-${y}`} r="1" />
          )),
        )}
      </g>
      <g opacity="0.6" strokeWidth="0.9">
        <path d="M120 84V328H436" />
        <path d="M114 104h12 M114 168h12 M114 232h12 M114 296h12 M152 322v12 M216 322v12 M280 322v12 M344 322v12 M408 322v12" />
      </g>
      <g opacity="0.37" strokeWidth="0.6">
        <path d="M120 168H312V328" strokeDasharray="3 5" />
        <path d="M237 148v-7h14 M323 148v-7h-14 M237 252v7h14 M323 252v7h-14" />
        <path d="M328 156 357 127H388" />
        <path d="M120 354H312 M120 348v12 M312 348v12 m-196-2 8-8 m184 8 8-8" />
        <path d="M92 168V328 M86 168h12 M86 328h12 m-10-156 8-8 m-8 168 8-8" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.95">
        {distributionPoints.map(([x, y]) => (
          <circle cx={x} cy={y} key={`${x}-${y}`} r="4" />
        ))}
      </g>
      <circle cx="312" cy="168" r="9" strokeWidth="0.65" />
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="395" y="130">
          (6u, 5u)
        </text>
        <text textAnchor="middle" x="216" y="374">
          6u
        </text>
        <text textAnchor="end" x="81" y="252">
          5u
        </text>
        <text x="108" y="345">
          0
        </text>
        <text x="444" y="332">
          x
        </text>
        <text x="117" y="73">
          y
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const flatSystemStudies: IllustrationStudy[] = [
  {
    id: "interface-spacing-plan",
    code: "I03",
    title: "From parts to a whole",
    description:
      "Three separate elements project into one control. Equal gaps, a common centerline, and a shared radius make the assembly rule visible.",
    category: "Interfaces",
    illustration: <SpacingPlanStudy />,
    revision: true,
  },
  {
    id: "workflow-switch-plan",
    code: "W03",
    title: "A connection, located",
    description:
      "Three inputs meet three outputs on a regular switching grid. A single closed junction connects B to 02, turning an abstract matrix into a precise route.",
    category: "Workflows",
    illustration: <SwitchPlanStudy />,
    revision: true,
  },
  {
    id: "data-coordinate-plan",
    code: "A03",
    title: "A measured distribution",
    description:
      "A small cluster occupies a regular coordinate field. Two projected measurements locate one point and make the underlying rule visible.",
    category: "Data",
    illustration: <CoordinatePlanStudy />,
    revision: true,
  },
];
