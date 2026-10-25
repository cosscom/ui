import {
  ConstructionAnnotation,
  ConstructionMotion,
} from "./primitives-construction-motion";

export const morphDetailIds = [
  "circle",
  "capsule",
  "rounded",
  "chamfer",
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
        <g opacity="0.55" strokeWidth="0.65">
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
          <circle cx="284" cy="204" fill="var(--color-sidebar)" r="3" />
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
              01 / Sector
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
        <g opacity="0.6" strokeWidth="0.85">
          {[204, 364].map((center) => (
            <circle
              cx={center}
              cy="204"
              fill="var(--color-sidebar)"
              key={center}
              r="3"
            />
          ))}
        </g>
        <ConstructionAnnotation stage={1}>
          <g transform="rotate(45 204 204)">
            <path
              d="M124 204H201 M124 199V209"
              opacity="0.5"
              strokeWidth="0.65"
            />
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
          <g opacity="0.5" strokeWidth="0.65">
            <path d="M204 300V318 M364 300V318 M204 310H270 M298 310H364" />
            <path d="m200 314 8-8 m152 8 8-8" />
          </g>
          <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
            <text textAnchor="middle" x="284" y="313">
              4u
            </text>
            <text textAnchor="end" x="464" y="384">
              02 / Tangency
            </text>
          </g>
        </ConstructionAnnotation>
      </g>
    );
  }

  if (stage === "rounded") {
    return (
      <g>
        {/* A 1u inset of the R1u outline produces a sharp 4u square. */}
        <rect
          height="240"
          opacity="0.55"
          rx="40"
          strokeWidth="0.85"
          width="240"
          x="164"
          y="84"
        >
          <ConstructionMotion attributeName="x" from={164} stage={2} to={204} />
          <ConstructionMotion attributeName="y" from={84} stage={2} to={124} />
          <ConstructionMotion
            attributeName="width"
            from={240}
            stage={2}
            to={160}
          />
          <ConstructionMotion
            attributeName="height"
            from={240}
            stage={2}
            to={160}
          />
          <ConstructionMotion attributeName="rx" from={40} stage={2} to={0} />
        </rect>
        <ConstructionAnnotation stage={2}>
          <g opacity="0.26" strokeDasharray="3 4" strokeWidth="0.65">
            <path d="M204 84V124H164 M364 324V284H404" />
          </g>
          <g opacity="0.5" strokeWidth="0.65">
            <path d="M204 134H214V124 M354 284V274H364" />
            <path d="M364 224H404 m-44 4 8-8 m32 8 8-8" />
            <path d="M204 292V318 M364 292V318 M204 310H270 M298 310H364" />
            <path d="m200 314 8-8 m152 8 8-8" />
            <circle cx="204" cy="124" fill="var(--color-sidebar)" r="2.5" />
            <circle cx="364" cy="284" fill="var(--color-sidebar)" r="2.5" />
          </g>
          <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
            <text textAnchor="middle" x="384" y="215">
              1u
            </text>
            <text textAnchor="middle" x="284" y="313">
              4u
            </text>
            <text textAnchor="end" x="464" y="384">
              03 / Offset
            </text>
          </g>
        </ConstructionAnnotation>
      </g>
    );
  }

  return (
    <g>
      {[
        { area: "M164 144V84H224Z", cut: "M152 156L236 72" },
        { area: "M344 84H404V144Z", cut: "M332 72L416 156" },
        { area: "M404 264V324H344Z", cut: "M416 252L332 336" },
        { area: "M224 324H164V264Z", cut: "M236 336L152 252" },
      ].map(({ area, cut }, index) => (
        <g key={area}>
          <path
            d={cut}
            opacity="0.5"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            strokeWidth="0.65"
          >
            <ConstructionMotion
              attributeName="stroke-dashoffset"
              delay={0.1 + index * 0.14}
              duration={0.22}
              from={1}
              stage={3}
              to={0}
            />
          </path>
          <path d={area} fill="currentColor" fillOpacity="0" stroke="none">
            <ConstructionMotion
              attributeName="fill-opacity"
              delay={0.3 + index * 0.14}
              duration={0.16}
              from={0}
              stage={3}
              to={0.065}
            />
          </path>
        </g>
      ))}
      <ConstructionAnnotation stage={3}>
        <g opacity="0.5" strokeWidth="0.65">
          <path d="M344 68V78 M344 72H358 M390 72H404" />
          <path d="m340 76 8-8 m52 8 8-8" />
          <path d="M412 144H436 M428 84V100 M428 128V144" />
          <path d="m424 88 8-8 m-8 68 8-8" />
          <path d="M394 84V94H404" />
          <path d="M224 332V350 M344 332V350 M224 342H270 M298 342H344" />
          <path d="m220 346 8-8 m112 8 8-8" />
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
          <text textAnchor="middle" x="374" y="75">
            1.5u
          </text>
          <text textAnchor="middle" x="428" y="117">
            1.5u
          </text>
          <text textAnchor="middle" x="284" y="345">
            3u
          </text>
          <text textAnchor="end" x="464" y="384">
            04 / Chamfer
          </text>
        </g>
      </ConstructionAnnotation>
    </g>
  );
}
