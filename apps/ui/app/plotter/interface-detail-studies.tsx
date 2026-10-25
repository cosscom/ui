import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function BrowserPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M128 88V104 M152 88V104 M128 344V380 M152 344V380" />
        <path d="M104 112H120 M104 176H120" />
        <path d="M288 112V120 M396 112V120 M216 208H432" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M152 112A24 24 0 1 1 128 136" strokeDasharray="3 6" />
        <path d="M144 136H160 M152 128V144" />
        <path d="M152 208V336" strokeDasharray="3 6" />
        <path
          d="M432 112H480 M432 176H480 M128 328V376"
          strokeDasharray="3 6"
        />
      </g>
      <g strokeWidth="0.95">
        <path d="M128 328V136A24 24 0 0 1 152 112H432" />
        <path d="M128 176H264" />
        <path d="M264 176A12 12 0 0 0 276 164V140A12 12 0 0 1 288 128H396A12 12 0 0 1 408 140V164A12 12 0 0 0 420 176H432" />
      </g>
      <g opacity="0.65" strokeWidth="0.75">
        <circle cx="184" cy="152" r="6" />
        <circle cx="208" cy="152" r="6" />
        <circle cx="232" cy="152" r="6" />
        <path d="m389 148 8 8 m0-8-8 8" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M152 136 135.03 119.03 m0 6v-6h6" />
        <path d="M135.03 119.03 108 92H76" />
        <path d="M408 140 440 108H460" />
        <path d="M128 360H152 M128 352V368 M152 352V368 m-28-4 8-8 m16 8 8-8" />
        <path d="M208 208h-56v24" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="304" y="156">
          coss.com
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="68" y="95">
          R24
        </text>
        <text x="468" y="111">
          R12
        </text>
        <text x="164" y="232">
          Content inset
        </text>
        <text textAnchor="middle" x="140" y="389">
          24
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function PhonePlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M200 52V68 M360 52V68 M200 372V400 M360 372V400" />
        <path d="M168 76H192 M168 84H200 M168 108H192" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M200 108V76H232 M208 108V84H232" strokeDasharray="3 5" />
        <path d="M368 76H432 M368 124H432 M368 316H432 M368 364H432" />
        <path d="M224 324V380 M336 324V380" strokeDasharray="3 6" />
      </g>
      <g strokeWidth="0.95">
        <rect height="288" rx="32" width="160" x="200" y="76" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <rect height="272" rx="24" width="144" x="208" y="84" />
        <rect height="4" rx="2" width="24" x="268" y="102" />
        <path d="M264 344H296" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <rect height="192" width="112" x="224" y="124" strokeDasharray="4 6" />
        <path
          d="M232 76A32 32 0 0 1 264 108 M232 84A24 24 0 0 1 256 108"
          strokeDasharray="3 5"
        />
        <path d="M220 108H268 M232 96V120" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M232 108 209.37 85.37 184 60H152" />
        <path d="M200 164H208 M200 158V170 M208 158V170 M200 164H164" />
        <path d="M200 44H264 M296 44H360 M200 36V52 M360 36V52 m-164-4 8-8 m152 8 8-8" />
        <path d="M416 76V364 M408 76H424 M408 124H424 M408 316H424 M408 364H424" />
        <path d="m412 80 8-8 m-8 56 8-8 m-8 200 8-8 m-8 56 8-8" />
        <path d="M200 388H360 M200 380V396 M224 380V396 M336 380V396 M360 380V396" />
        <path d="m196 392 8-8 m16 8 8-8 m104 8 8-8 m16 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="280" y="224">
          Safe area
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="144" y="63">
          R32
        </text>
        <text textAnchor="end" x="156" y="168">
          Offset / 8
        </text>
        <text textAnchor="middle" x="280" y="47">
          10u
        </text>
        <text x="440" y="104">
          3u
        </text>
        <text x="440" y="224">
          12u
        </text>
        <text x="440" y="344">
          3u
        </text>
        <text textAnchor="middle" x="212" y="410">
          1.5u
        </text>
        <text textAnchor="middle" x="280" y="410">
          7u
        </text>
        <text textAnchor="middle" x="348" y="410">
          1.5u
        </text>
        <text textAnchor="middle" x="280" y="434">
          u = 16
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function ChatPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.55">
        <path d="M104 96V356M148 96V356M172 96V356M196 208V316M220 208V316M364 96V200M412 208V316M456 208V316" />
        <path d="M80 116H388M80 180H388M172 228H480M172 292H480" />
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path d="M72 148H388M172 260H488M128 332H248" strokeDasharray="4 6" />
        <path d="M148 104V92H160M364 104V92H352M196 304V316H208M412 304V316H400" />
        <circle cx="164" cy="132" r="16" strokeDasharray="3 5" />
        <path d="M140 132H188M164 108V156M164 132 132 100H112" />
      </g>

      <g fill="var(--color-sidebar)" strokeWidth="0.85">
        <rect height="64" rx="16" width="216" x="148" y="116" />
        <rect height="64" rx="16" width="216" x="196" y="228" />
        <rect height="32" rx="16" width="80" x="148" y="316" />
        <circle cx="104" cy="148" r="20" />
        <circle cx="456" cy="260" r="20" />
      </g>
      <g opacity="0.62" strokeWidth="0.7">
        <circle cx="104" cy="141" r="4" />
        <path d="M94 158A10 10 0 0 1 114 158" />
        <circle cx="456" cy="253" r="4" />
        <path d="M446 270A10 10 0 0 1 466 270" />
      </g>
      <g fill="currentColor" opacity="0.58" stroke="none">
        <circle cx="176" cy="332" r="1.5" />
        <circle cx="188" cy="332" r="1.5" />
        <circle cx="200" cy="332" r="1.5" />
      </g>
      <g opacity="0.4" strokeWidth="0.6">
        <path d="M148 76H240M272 76H364M148 68V84M364 68V84m-220-4 8-8m208 8 8-8" />
        <path d="M124 174V200M148 188V200M124 194H148m-28 4 8-8m16 8 8-8" />
        <path d="M412 306V332M436 286V332M412 324H436m-28 4 8-8m16 8 8-8" />
        <path d="M148 362V382M172 362V382M148 374H172m-28 4 8-8m16 8 8-8" />
        <path d="M388 180H404M388 228H404M396 180V196M396 212V228m-4-44 8-8m-8 56 8-8" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="172" y="152">
          Can we build it?
        </text>
        <text x="220" y="264">
          One part at a time.
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="256" y="79">
          216
        </text>
        <text textAnchor="end" x="108" y="103">
          R16
        </text>
        <text textAnchor="middle" x="136" y="215">
          24
        </text>
        <text textAnchor="middle" x="424" y="345">
          24
        </text>
        <text textAnchor="middle" x="160" y="395">
          Inset / 24
        </text>
        <text textAnchor="middle" x="396" y="208">
          48
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const interfaceDetailStudies: IllustrationStudy[] = [
  {
    id: "interface-browser-plan",
    code: "I04",
    title: "A browser, in detail",
    description:
      "An enlarged browser corner relates the window radius to its tab radius and content inset. Cropped edges leave the rest of the screen outside the drawing.",
    category: "Interfaces",
    illustration: <BrowserPlanStudy />,
  },
  {
    id: "interface-phone-plan",
    code: "I05",
    title: "The screen within the frame",
    description:
      "Shared corner centers and an eight-pixel offset construct the frame. Symmetric vertical and horizontal margins locate the safe area within it.",
    category: "Interfaces",
    illustration: <PhonePlanStudy />,
  },
  {
    id: "interface-chat-plan",
    code: "I06",
    title: "A conversation, constructed",
    description:
      "Two rounded message blocks pair with circular avatars. Shared radius, text inset, and avatar spacing construct the conversation without pointed tails.",
    category: "Interfaces",
    illustration: <ChatPlanStudy />,
  },
];
