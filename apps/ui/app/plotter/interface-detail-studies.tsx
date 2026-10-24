import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function BrowserPlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeDasharray="3 6" strokeWidth="0.55">
        <path d="M92 112H488 M92 172H488 M92 232H488" />
        <path d="M112 88V368 M144 244V344 M256 168V244" />
        <path d="M136 150H212 M136 202H480 M144 256H480" />
      </g>
      <g strokeOpacity="0.65" strokeWidth="0.8">
        <path d="M112 324V136A24 24 0 0 1 136 112H448" />
        <path d="M112 172H224 M380 172H448 M112 232H448" />
        <path d="M224 172A12 12 0 0 0 236 160V140A12 12 0 0 1 248 128H356A12 12 0 0 1 368 140V160A12 12 0 0 0 380 172" />
      </g>
      <g opacity="0.23" strokeDasharray="3 6" strokeWidth="0.6">
        <path d="M448 112H488 M448 172H488 M448 232H488 M112 324V368" />
        <path d="M448 184H488 M448 220H488" />
      </g>
      <g strokeOpacity="0.57" strokeWidth="0.7">
        <circle cx="156" cy="150" r="4" />
        <circle cx="174" cy="150" r="4" />
        <circle cx="192" cy="150" r="4" />
        <path d="M344 146 352 154 M352 146 344 154 M420 150h12 M426 144v12" />
        <path d="M158 202H146l5-5 M146 202l5 5" />
        <path d="M178 202H190l-5-5 M190 202l-5 5" opacity="0.55" />
        <path d="M221.66 196.34A8 8 0 1 0 221.66 207.66 M222 192V198H216" />
        <path d="M448 184H274A18 18 0 0 0 256 202A18 18 0 0 0 274 220H448" />
        <circle cx="274" cy="202" r="3.5" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.62" stroke="none">
        <text x="252" y="154">
          coss.com
        </text>
        <text x="288" y="206">
          coss.com/ui
        </text>
      </g>
      <g opacity="0.24" strokeWidth="0.55">
        <path d="M124 136H148 M136 124V148 M136 136 119.03 119.03 146 92H206" />
        <path d="M156 134V82 M174 134V82 M156 90H174 M156 85v10 M174 85v10" />
        <path d="M100 112H76 M100 232H76 M84 112V232 M79 112h10 M79 232h10" />
        <path d="m80 116 8-8 m-8 128 8-8" />
        <path d="M136 256h16 M144 248v16" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.45" stroke="none">
        <text textAnchor="middle" x="165" y="78">
          18
        </text>
        <text x="211" y="98">
          R24
        </text>
        <text textAnchor="end" x="69" y="176">
          120
        </text>
        <text x="152" y="278">
          Viewport
        </text>
        <text x="332" y="384">
          Browser / detail
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function PhonePlanStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M232 60V380 M248 116V324 M264 116V324 M296 116V324 M312 116V324 M328 60V380" />
        <path d="M192 124H368 M192 172H368 M192 220H368 M192 268H368 M192 316H368" />
      </g>
      <g opacity="0.26" strokeWidth="0.6">
        <path d="M208 60V404 M352 60V404 M192 76H408 M192 364H408" />
        <path d="M280 48V384 M188 220H372" strokeDasharray="5 6" />
        <rect height="192" width="96" x="232" y="124" strokeDasharray="4 5" />
        <circle cx="232" cy="100" r="24" />
        <circle cx="328" cy="340" r="16" />
        <path d="M200 100H264 M232 68V132 M304 340H352 M328 316V364" />
      </g>
      <g strokeWidth="0.95">
        <rect height="288" rx="24" width="144" x="208" y="76" />
        <rect height="272" opacity="0.7" rx="16" width="128" x="216" y="84" />
        <rect height="6" opacity="0.72" rx="3" width="32" x="264" y="96" />
        <path d="M264 344H296" opacity="0.7" />
        <path d="M232 172H328 M232 268H328" opacity="0.5" />
      </g>
      <g opacity="0.46" strokeWidth="0.65">
        <path d="M232 100 196 64H156 M328 340 372 384H404" />
        <path d="M232 124H168L152 140" />
        <path d="M208 396H352 M208 388v16 M352 388v16 m-148-4 8-8 m136 8 8-8" />
        <path d="M392 76V364 M384 76h16 M384 364h16 m-12-284 8-8 m-8 296 8-8" />
        <path d="M176 172V268 M170 172h12 M170 268h12 m-10-92 8-8 m-8 104 8-8" />
        <path d="M232 294H328 M232 288v12 M328 288v12" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="148" y="67">
          R24
        </text>
        <text x="410" y="387">
          R16
        </text>
        <text textAnchor="end" x="154" y="154">
          Safe area
        </text>
        <text textAnchor="middle" x="280" y="416">
          9u
        </text>
        <text x="406" y="224">
          18u
        </text>
        <text textAnchor="end" x="164" y="224">
          6u
        </text>
        <text textAnchor="middle" x="280" y="309">
          6u
        </text>
      </g>
      <g opacity="0.4" strokeWidth="0.65">
        <circle cx="232" cy="100" fill="var(--color-sidebar)" r="2.5" />
        <circle cx="328" cy="340" fill="var(--color-sidebar)" r="2.5" />
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
      "An enlarged corner of browser chrome. A tab, navigation controls, and an open address field reveal the window’s construction while dashed edges continue beyond the drawing.",
    category: "Interfaces",
    illustration: <BrowserPlanStudy />,
  },
  {
    id: "interface-phone-plan",
    code: "I05",
    title: "The screen within the frame",
    description:
      "A smartphone in front elevation. Concentric corner radii and a measured safe area explain the relationship between the frame and its content.",
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
