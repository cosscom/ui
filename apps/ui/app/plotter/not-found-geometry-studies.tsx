import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function UnbuiltArch() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M154 128V350M190 128V350M280 128V350M370 128V350M406 128V350" />
        <path d="M128 154H432M128 190H432M128 280H432M128 332H432" />
      </g>
      <g opacity="0.26" strokeWidth="0.6">
        <path d="M280 102V356M112 280H448" strokeDasharray="5 5" />
        <path d="M145 332H415M154 280A126 126 0 0 1 406 280" />
        <path d="M280 280 207.7 176.8M280 280 352.3 176.8" />
        <path d="M258 141 280 280 302 141" strokeDasharray="3 5" />
        <path d="M272 280H288M280 272V288" />
      </g>

      <g fill="var(--color-sidebar)" strokeWidth="1">
        <path d="M154 332V280A126 126 0 0 1 260.3 155.6L265.9 191.1A90 90 0 0 0 190 280V332Z" />
        <path d="M370 332V280A90 90 0 0 0 294.1 191.1L299.7 155.6A126 126 0 0 1 406 280V332Z" />
        <path d="M145 332H199M361 332H415" />
      </g>
      <path
        d="M260.3 155.6A126 126 0 0 1 299.7 155.6M265.9 191.1A90 90 0 0 1 294.1 191.1"
        opacity="0.32"
        strokeDasharray="3 4"
        strokeWidth="0.65"
      />

      <g opacity="0.4" strokeWidth="0.65">
        <path d="M154 361H263M297 361H406M154 355V367M406 355V367" />
        <path d="m150 365 8-8m244 8 8-8" />
        <path d="M121 154V228M121 252V332M115 154H127M115 332H127" />
        <path d="m117 158 8-8m-8 186 8-8" />
        <path d="M280 143V106H322" />
        <path d="M208.303044749 176.437943637 188 146H155M345.990882349 218.790570189 397 198H432" />
        <path d="M276 171H284M280 167V175" />
        <path d="M272 280A8 8 0 0 1 274.3 274.3" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="326" y="109">
          Missing keystone
        </text>
        <text textAnchor="end" x="151" y="149">
          R126
        </text>
        <text x="437" y="201">
          R90
        </text>
        <text textAnchor="middle" x="280" y="365">
          7u
        </text>
        <text textAnchor="middle" x="121" y="243">
          h
        </text>
        <text x="154" y="402">
          Unbuilt / Section A
        </text>
        <text textAnchor="end" x="406" y="402">
          1 : 1
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const notFoundGeometryStudies: IllustrationStudy[] = [
  {
    id: "404-unbuilt-arch",
    code: "E06",
    title: "An unbuilt arch",
    description:
      "An arch awaits its central keystone, turning the missing page into an unfinished architectural connection.",
    category: "Empty states",
    illustration: <UnbuiltArch />,
  },
];
