import { ButtonConstruction } from "./primitives-button";
import {
  ConstructionAnnotation,
  ConstructionMotion,
} from "./primitives-construction-motion";
import { secondaryLine } from "./primitives-morph-style";
import { SliderConstruction } from "./primitives-slider";
import { SwitchConstruction } from "./primitives-switch";

export const morphDetailIds = [
  "circle",
  "capsule",
  "switch",
  "button",
  "rounded",
  "slider",
] as const;

export function MorphDetails({
  hatchId,
  stage,
}: {
  hatchId: string;
  stage: (typeof morphDetailIds)[number];
}) {
  if (stage === "circle") {
    const clipId = `${hatchId}-sector`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect height="800" width="800" x="-116" y="204">
              <ConstructionMotion
                attributeName="transform"
                from="0 284 204"
                stage={0}
                to="-45 284 204"
                type="rotate"
              />
            </rect>
          </clipPath>
        </defs>
        <path
          clipPath={`url(#${clipId})`}
          d="M284 204H404A120 120 0 0 0 368.853 119.147Z"
          fill={`url(#${hatchId})`}
          stroke="none"
        />
        <g opacity="0.2" strokeDasharray="5 5" strokeWidth="0.65">
          <path d="M152 204H416 M284 72V336" />
        </g>
        <g {...secondaryLine}>
          <path d="M284 204H404" />
          <g>
            <ConstructionMotion
              attributeName="transform"
              from="0 284 204"
              stage={0}
              to="-45 284 204"
              type="rotate"
            />
            <path d="M284 204H404 M404 200V208" />
          </g>
          <path
            d="M312 204A28 28 0 0 0 303.799 184.201"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          >
            <ConstructionMotion
              attributeName="stroke-dashoffset"
              from={1}
              stage={0}
              to={0}
            />
          </path>
          <circle cx="284" cy="204" fill="none" r="3" />
        </g>
        <ConstructionAnnotation stage={0}>
          <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
            <text
              textAnchor="middle"
              transform="rotate(-45 326 150)"
              x="326"
              y="150"
            >
              r = 3u
            </text>
            <text x="325" y="191">
              45°
            </text>
            <text textAnchor="end" x="464" y="384">
              01 / Avatar
            </text>
          </g>
        </ConstructionAnnotation>
      </g>
    );
  }

  if (stage === "capsule") {
    return (
      <g>
        <g opacity="0.3" strokeDasharray="4 4" strokeWidth="0.65">
          {[204, 364].map((center) => (
            <g key={center}>
              <circle cx={center} cy="204" r="80" />
              <path d={`M${center} 112V296`} />
            </g>
          ))}
          <path d="M112 204H456" />
        </g>
        <g {...secondaryLine}>
          {[204, 364].map((center) => (
            <circle cx={center} cy="204" fill="none" key={center} r="3" />
          ))}
        </g>
        <ConstructionAnnotation stage={1}>
          <g transform="rotate(45 204 204)">
            <path {...secondaryLine} d="M124 204H201 M124 199V209" />
            <text
              fill="currentColor"
              fontSize="10"
              opacity="0.58"
              stroke="none"
              textAnchor="middle"
              x="164"
              y="193"
            >
              2u
            </text>
          </g>
          <g {...secondaryLine}>
            <path d="M204 300V318 M364 300V318 M204 310H270 M298 310H364" />
            <path d="m200 314 8-8 m152 8 8-8" />
          </g>
          <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
            <text textAnchor="middle" x="284" y="313">
              4u
            </text>
            <text textAnchor="end" x="464" y="384">
              02 / Pill
            </text>
          </g>
        </ConstructionAnnotation>
      </g>
    );
  }

  if (stage === "switch") return <SwitchConstruction />;

  if (stage === "button") return <ButtonConstruction />;

  if (stage === "slider") return <SliderConstruction />;

  if (stage === "rounded") {
    return (
      <g>
        {/* A 1u inset of the R1u outline produces a sharp 4u square. */}
        <rect
          {...secondaryLine}
          height="240"
          rx="40"
          width="240"
          x="164"
          y="84"
        >
          <ConstructionMotion attributeName="x" from={164} stage={4} to={204} />
          <ConstructionMotion attributeName="y" from={84} stage={4} to={124} />
          <ConstructionMotion
            attributeName="width"
            from={240}
            stage={4}
            to={160}
          />
          <ConstructionMotion
            attributeName="height"
            from={240}
            stage={4}
            to={160}
          />
          <ConstructionMotion attributeName="rx" from={40} stage={4} to={0} />
        </rect>
        <ConstructionAnnotation stage={4}>
          <g opacity="0.26" strokeDasharray="3 4" strokeWidth="0.65">
            <path d="M204 84V124H164 M364 324V284H404" />
          </g>
          <g {...secondaryLine}>
            <path d="M204 134H214V124 M354 284V274H364" />
            <path d="M364 224H404 m-44 4 8-8 m32 8 8-8" />
            <path d="M204 292V318 M364 292V318 M204 310H270 M298 310H364" />
            <path d="m200 314 8-8 m152 8 8-8" />
            <circle cx="204" cy="124" fill="none" r="2.5" />
            <circle cx="364" cy="284" fill="none" r="2.5" />
          </g>
          <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
            <text textAnchor="middle" x="384" y="215">
              1u
            </text>
            <text textAnchor="middle" x="284" y="313">
              4u
            </text>
            <text textAnchor="end" x="464" y="384">
              05 / Card
            </text>
          </g>
        </ConstructionAnnotation>
      </g>
    );
  }

  return null;
}
