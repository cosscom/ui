import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

const keyboardKeys = [
  { x: 136, y: 124, width: 68, label: "Tab" },
  { x: 212, y: 124, width: 44, label: "Q" },
  { x: 264, y: 124, width: 44, label: "W" },
  { x: 316, y: 124, width: 44, label: "E" },
  { x: 368, y: 124, width: 44, label: "R" },
  { x: 136, y: 176, width: 80, label: "Caps" },
  { x: 224, y: 176, width: 44, label: "A" },
  { x: 276, y: 176, width: 44, label: "S" },
  { x: 328, y: 176, width: 44, label: "D" },
  { x: 380, y: 176, width: 44, label: "F" },
  { x: 136, y: 228, width: 104, label: "Shift" },
  { x: 248, y: 228, width: 44, label: "Z" },
  { x: 300, y: 228, width: 44, label: "X" },
  { x: 352, y: 228, width: 44, label: "C" },
  { x: 136, y: 280, width: 44, label: "Ctrl" },
  { x: 188, y: 280, width: 44, label: "Fn" },
  { x: 240, y: 280, width: 44, label: "Alt" },
];

function KeyboardPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.13" strokeDasharray="3 6" strokeWidth="0.55">
        <path d="M136 100V344 M212 104V176 M224 160V232 M248 212V284" />
        <path d="M92 146H476 M92 198H476 M92 250H476 M92 302H476" />
        <path d="M234 108V174 M286 108V174 M246 160V234" />
      </g>
      <g opacity="0.38" strokeWidth="0.65">
        <path d="M428 104H132A20 20 0 0 0 112 124V324A20 20 0 0 0 132 344H428" />
        <path d="M428 104H480 M428 344H480" strokeDasharray="3 6" />
      </g>
      <g strokeOpacity="0.65" strokeWidth="0.75">
        {keyboardKeys.map((key) => (
          <rect
            fill="var(--color-sidebar)"
            height="44"
            key={key.label}
            rx="6"
            width={key.width}
            x={key.x}
            y={key.y}
          />
        ))}
        <path d="M446 124H426A6 6 0 0 0 420 130V162A6 6 0 0 0 426 168H446" />
        <path d="M446 176H438A6 6 0 0 0 432 182V214A6 6 0 0 0 438 220H446" />
        <path d="M446 228H410A6 6 0 0 0 404 234V266A6 6 0 0 0 410 272H446" />
        <path d="M446 280H298A6 6 0 0 0 292 286V318A6 6 0 0 0 298 324H446" />
      </g>
      <g opacity="0.23" strokeDasharray="3 6" strokeWidth="0.6">
        <path d="M446 124H480 M446 168H480 M446 176H480 M446 220H480" />
        <path d="M446 228H480 M446 272H480 M446 280H480 M446 324H480" />
      </g>
      <g fill="currentColor" opacity="0.61" stroke="none" textAnchor="middle">
        {keyboardKeys.map((key) => (
          <text
            fontSize={key.label.length > 1 ? "9" : "11"}
            key={key.label}
            x={key.x + key.width / 2}
            y={key.y + 26}
          >
            {key.label}
          </text>
        ))}
        <text fontSize="11" x="426" y="254">
          V
        </text>
        <text fontSize="9" x="348" y="306">
          Space
        </text>
      </g>
      <g opacity="0.28" strokeWidth="0.55">
        <path d="M234 108V80 M286 108V80 M234 88H286 M234 83v10 M286 83v10" />
        <path d="m230 92 8-8 m44 8 8-8" />
        <path d="M92 124V168 M87 124h10 M87 168h10 M104 124H80 M104 168H80" />
        <circle cx="230" cy="182" r="6" strokeDasharray="2 4" />
        <path d="M220 182H240 M230 172V192" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.46" stroke="none">
        <text textAnchor="middle" x="260" y="76">
          Pitch / 52
        </text>
        <text textAnchor="end" x="76" y="150">
          44
        </text>
        <text x="332" y="384">
          Keyboard / detail
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function LampElevationStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M164 116H396 M164 208H396 M164 324H396 M164 336H396" />
        <path d="M188 100V228 M372 100V228 M200 308V370 M360 308V370" />
        <path d="M274 196V344 M286 196V344" />
      </g>
      <g opacity="0.26" strokeWidth="0.65">
        <path d="M280 78V370 M156 208H404" strokeDasharray="5 6" />
        <path d="M188 208A92 92 0 0 0 372 208" strokeDasharray="3 6" />
        <path d="M280 208 345.05 142.95" />
        <path d="M280 220H292V208 M268 116h24 M188 196v24 M372 196v24" />
        <path d="M345.05 142.95 369 119H400" />
        <path d="M188 92V76 M372 92V76 M390 116H428 M390 336H428" />
      </g>
      <g strokeWidth="0.95">
        <path d="M188 208A92 92 0 0 1 372 208Z" />
        <path d="M274 208V324 M286 208V324" />
        <rect height="12" rx="6" width="160" x="200" y="324" />
      </g>
      <g opacity="0.48" strokeWidth="0.65">
        <path d="M188 84H372 M188 78v12 M372 78v12 m-188-2 8-8 m176 8 8-8" />
        <path d="M420 116V336 M414 116h12 M414 336h12 m-10-216 8-8 m-8 228 8-8" />
        <path d="M200 360H360 M200 354v12 M360 354v12 m-164-2 8-8 m152 8 8-8" />
        <path d="M324 208V324 M318 208h12 M318 324h12 m-10-112 8-8 m-8 124 8-8" />
        <path d="M294 324H340" opacity="0.45" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.75">
        <circle cx="280" cy="208" r="3" />
        <circle cx="188" cy="208" r="2.5" />
        <circle cx="372" cy="208" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="280" y="70">
          184
        </text>
        <text x="378" y="110">
          R92
        </text>
        <text x="433" y="230">
          220
        </text>
        <text x="336" y="270">
          116
        </text>
        <text textAnchor="middle" x="280" y="381">
          160
        </text>
        <text x="112" y="345">
          Elevation
        </text>
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M120 114h12 M126 108v12 M444 354h12 M450 348v12" />
      </g>
    </BlueprintDrawing>
  );
}

const folderPositions = [
  { x: 104, y: 112 },
  { x: 312, y: 112 },
  { x: 208, y: 256 },
];

function FolderPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M80 112H496 M80 136H496 M80 216H496 M184 256H392 M184 280H392 M184 360H392" />
        <path d="M104 96V236 M264 96V236 M312 96V236 M472 96V236 M208 240V380 M368 240V380" />
      </g>
      <g opacity="0.21" strokeDasharray="3 6" strokeWidth="0.6">
        <path d="M184 96V236 M392 96V236 M288 96V380" />
        <path d="M160 96V154 M368 96V154 M264 240V298" />
      </g>
      <g strokeWidth="0.85">
        {folderPositions.map(({ x, y }) => (
          <path
            d={`M${x} ${y + 96}V${y + 8}a8 8 0 0 1 8-8h40a8 8 0 0 1 8 8v8a8 8 0 0 0 8 8h88a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H${x + 8}a8 8 0 0 1-8-8Z`}
            key={x}
          />
        ))}
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <circle cx="152" cy="120" r="8" strokeDasharray="2 4" />
        <circle cx="168" cy="128" r="8" strokeDasharray="2 4" />
        <path d="M140 120H180 M152 108V136 M156 128H180 M168 116V144" />
        <path d="M160 120 188 92H216" />
        <path d="M104 90V70 M160 90V70 M264 232V250 M312 232V250" />
        <path d="M208 376V402 M368 376V402 M384 256H424 M384 360H424" />
        <path d="M344 352H384 M360 336V376" />
        <circle cx="360" cy="352" r="8" strokeDasharray="2 4" />
      </g>
      <g opacity="0.43" strokeWidth="0.6">
        <path d="M104 80H160 M104 75v10 M160 75v10 m-60-1 8-8 m48 8 8-8" />
        <path d="M264 240H312 M264 235v10 M312 235v10 m-52-1 8-8 m40 8 8-8" />
        <path d="M208 392H368 M208 387v10 M368 387v10 m-164-1 8-8 m152 8 8-8" />
        <path d="M412 256V360 M407 256h10 M407 360h10 m-9-100 8-8 m-8 112 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="132" y="65">
          Tab / 56
        </text>
        <text x="220" y="95">
          R8
        </text>
        <text textAnchor="middle" x="288" y="232">
          48
        </text>
        <text x="428" y="312">
          104
        </text>
        <text textAnchor="middle" x="288" y="411">
          Module / 160
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
      "An enlarged portion of a keyboard, with staggered letter rows and wider modifiers. Open edges and dashed continuation reveal a detail within a larger system.",
    category: "Objects",
    illustration: <KeyboardPlanStudy />,
    revision: true,
  },
  {
    id: "object-lamp-elevation",
    code: "O04",
    title: "A lamp, drawn in elevation",
    description:
      "A semicircular shade, a centered stem, and a measured base. One radius establishes the profile, with every part held to the same vertical axis.",
    category: "Objects",
    illustration: <LampElevationStudy />,
  },
  {
    id: "object-folder-plan",
    code: "O05",
    title: "A family of folders",
    description:
      "Three independent folders share one tab, radius, and outline. Equal spacing and a common centerline turn a familiar shape into a small construction system.",
    category: "Objects",
    illustration: <FolderPlanStudy />,
    revision: true,
  },
];
