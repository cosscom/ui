import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

const keyboardKeys = [
  { x: 144, y: 140, label: "Q" },
  { x: 216, y: 140, label: "W" },
  { x: 288, y: 140, label: "E" },
  { x: 162, y: 212, label: "A" },
  { x: 234, y: 212, label: "S" },
  { x: 306, y: 212, label: "D" },
];

function KeyboardPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M144 72V132 M216 72V132 M288 72V132 M360 72V132" />
        <path d="M104 140H136 M104 204H136 M104 212H154 M104 276H154" />
        <path d="M162 284V304 M234 284V304 M306 284V304 M378 284V304" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M416 116H136A16 16 0 0 0 120 132V292" />
        <path d="M416 116H464 M120 292V340" strokeDasharray="3 6" />
        <path d="M144 212V336 M162 284V336" strokeDasharray="3 6" />
        <path d="M144 204V212 M162 204V212" />
      </g>
      <g strokeWidth="0.95">
        {keyboardKeys.map(({ x, y, label }) => (
          <rect height="64" key={label} rx="8" width="64" x={x} y={y} />
        ))}
        <path d="M410 140H368A8 8 0 0 0 360 148V196A8 8 0 0 0 368 204H410" />
        <path d="M410 212H386A8 8 0 0 0 378 220V268A8 8 0 0 0 386 276H410" />
      </g>
      <g opacity="0.28" strokeDasharray="3 6" strokeWidth="0.65">
        <path d="M410 140H464 M410 204H464 M410 212H464 M410 276H464" />
        <path d="M180 304H420 M180 368H420" />
        <path d="M180 320V352 M244 320V352 M252 320V352 M316 320V352" />
      </g>
      <g
        fill="currentColor"
        fontSize="12"
        opacity="0.72"
        stroke="none"
        textAnchor="middle"
      >
        {keyboardKeys.map(({ x, y, label }) => (
          <text key={label} x={x + 32} y={y + 36}>
            {label}
          </text>
        ))}
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M144 100H216 M144 92V108 M216 92V108 m-76-4 8-8 m64 8 8-8" />
        <path d="M144 328H162 M144 320V336 M162 320V336 m-22-4 8-8 m10 8 8-8" />
        <path d="M96 140V204 M88 140H104 M88 204H104 m-12-60 8-8 m-8 72 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="180" y="85">
          Pitch / u
        </text>
        <text textAnchor="end" x="80" y="176">
          64
        </text>
        <text textAnchor="middle" x="153" y="354">
          ¼u
        </text>
        <text x="338" y="394">
          Stagger / ¼u
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function LampElevationStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M184 92V228 M376 92V228 M160 108H264 M296 108H400" />
        <path d="M160 300H264 M296 300H400 M208 316V372 M352 316V372" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path
          d="M280 76V196 M280 212V372 M152 204H176 M384 204H408"
          strokeDasharray="5 6"
        />
        <path
          d="M184 204A96 96 0 0 0 264 298.66 M296 298.66A96 96 0 0 0 376 204"
          strokeDasharray="3 6"
        />
        <path d="M184 84V60 M376 84V60" />
      </g>
      <g strokeWidth="1">
        <path d="M184 204A96 96 0 0 1 376 204Z" />
        <path d="M274 204V332 M286 204V332" />
        <rect height="12" rx="6" width="144" x="208" y="332" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M280 204 347.88 136.12 m-6 0h6v6" />
        <path d="M270 204H290 M280 194V214 M280 220H296V204" />
        <path d="M184 72H260 M300 72H376 M184 64V80 M376 64V80 m-196-4 8-8 m184 8 8-8" />
        <path d="M208 360H264 M296 360H352 M208 352V368 M280 352V368 M352 352V368" />
        <path d="m204 364 8-8 m64 8 8-8 m64 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="280" y="75">
          2r
        </text>
        <text transform="rotate(-45 316 158)" x="316" y="158">
          r
        </text>
        <text textAnchor="middle" x="244" y="383">
          a
        </text>
        <text textAnchor="middle" x="316" y="383">
          a
        </text>
        <text textAnchor="end" x="172" y="308">
          Generating circle
        </text>
      </g>
    </BlueprintDrawing>
  );
}

const folders = [
  { x: 104, width: 216, height: 176, opacity: 1 },
  { x: 352, width: 136, height: 104, opacity: 0.62 },
];

function FolderPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M104 64V112 M168 64V112 M352 64V112 M416 64V112" />
        <path d="M80 120H96 M176 120H344 M424 120H512" />
        <path d="M80 144H96 M328 144H344 M496 144H512" />
        <path d="M104 304V344 M320 304V344 M352 232V272 M488 232V272" />
      </g>
      <g strokeWidth="0.95">
        {folders.map(({ x, width, height, opacity }) => (
          <path
            d={`M${x} ${120 + height - 8}V128a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8a8 8 0 0 0 8 8h${width - 80}a8 8 0 0 1 8 8v${height - 40}a8 8 0 0 1-8 8H${x + 8}a8 8 0 0 1-8-8Z`}
            key={x}
            opacity={opacity}
          />
        ))}
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <circle cx="160" cy="128" r="8" strokeDasharray="2 4" />
        <circle cx="176" cy="136" r="8" strokeDasharray="2 4" />
        <path d="M148 128H172 M160 116V140 M164 136H188 M176 124V148" />
        <path d="M168 128 204 92H248" />
        <path d="M320 144H352 M328 120H344" strokeDasharray="3 6" />
        <path d="M416 116V148 M408 128H424 M416 136H432" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M104 80H168 M104 72V88 M168 72V88 m-68-4 8-8 m56 8 8-8" />
        <path d="M352 80H416 M352 72V88 M416 72V88 m-68-4 8-8 m56 8 8-8" />
        <path d="M104 332H196 M228 332H320 M104 324V340 M320 324V340 m-220-4 8-8 m208 8 8-8" />
        <path d="M352 260H404 M436 260H488 M352 252V268 M488 252V268 m-140-4 8-8 m128 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="136" y="65">
          Tab / 64
        </text>
        <text textAnchor="middle" x="384" y="65">
          Tab / 64
        </text>
        <text x="256" y="95">
          R8
        </text>
        <text textAnchor="middle" x="212" y="335">
          w₁
        </text>
        <text textAnchor="middle" x="420" y="263">
          w₂
        </text>
        <text textAnchor="middle" x="280" y="392">
          One tab / two widths
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const flatObjectStudies: IllustrationStudy[] = [
  {
    id: "object-keyboard-plan",
    code: "O03",
    title: "A keyboard, in detail",
    description:
      "Two cropped rows reveal the keyboard’s construction: one key pitch and a quarter-unit stagger. Dashed continuations keep the focus on the spacing rule.",
    category: "Objects",
    illustration: <KeyboardPlanStudy />,
  },
  {
    id: "object-lamp-elevation",
    code: "O04",
    title: "A lamp, drawn in elevation",
    description:
      "Half a circle becomes the shade. Its center establishes the support axis and divides the base into equal halves.",
    category: "Objects",
    illustration: <LampElevationStudy />,
  },
  {
    id: "object-folder-plan",
    code: "O05",
    title: "A family of folders",
    description:
      "One tab construction belongs to two folder widths. Paired corner radii and a shared tab dimension hold the family together.",
    category: "Objects",
    illustration: <FolderPlanStudy />,
  },
];
