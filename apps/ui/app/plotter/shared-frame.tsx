import { BlueprintDrawing } from "./blueprint-drawing";

export function SharedFrameStudy() {
  return (
    <BlueprintDrawing>
      <g strokeWidth="0.6" opacity="0.24">
        <path d="M112 156V120H148 M412 120H448V156 M112 300V336H148 M412 336H448V300" />
        <path d="M88 144H108 M452 144H472 M88 312H108 M452 312H472" />
        <path d="M232 156H256 M232 300H256" />
      </g>
      <g strokeWidth="0.65" opacity="0.27">
        <path d="M232 168L244 156 M232 180L256 156 M232 192L256 168 M232 204L256 180 M232 216L256 192 M232 228L256 204 M232 240L256 216 M232 252L256 228 M232 264L256 240 M232 276L256 252 M232 288L256 264 M232 300L256 276 M244 300L256 288" />
      </g>
      <g strokeWidth="0.95">
        <rect x="112" y="120" width="336" height="216" rx="36" />
        <rect x="136" y="144" width="96" height="168" rx="12" />
        <rect x="256" y="144" width="168" height="168" rx="12" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M112 112V91 M448 112V91 M112 98H263 M297 98H448 M108 102l8 -8 M444 102l8 -8" />
        <path d="M112 342V371 M136 342V371 M232 342V371 M256 342V371 M424 342V371 M448 342V371 M112 364H136 M136 364H232 M232 364H256 M256 364H424 M424 364H448 M108 368l8 -8 M132 368l8 -8 M228 368l8 -8 M252 368l8 -8 M420 368l8 -8 M444 368l8 -8" />
      </g>
      <g fill="currentColor" stroke="none" textAnchor="middle">
        <g fontSize="11" opacity="0.72">
          <text x="280" y="73">
            Shared frame
          </text>
          <text x="184" y="232">
            A
          </text>
          <text x="340" y="232">
            B
          </text>
        </g>
        <g fontSize="10" opacity="0.5">
          <text x="280" y="101.5">
            14u
          </text>
          <text x="124" y="385">
            u
          </text>
          <text x="184" y="385">
            4u
          </text>
          <text x="244" y="385">
            u
          </text>
          <text x="340" y="385">
            7u
          </text>
          <text x="436" y="385">
            u
          </text>
        </g>
      </g>
    </BlueprintDrawing>
  );
}
