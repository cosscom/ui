import { BlueprintDrawing } from "./blueprint-drawing";
import { ParticlesBlueprint } from "./particles-blueprint";
import type { IllustrationStudy } from "./study-types";

function Registration() {
  return (
    <g opacity="0.32" strokeWidth="0.6">
      <path d="M100 82h12 M106 76v12 M448 342h12 M454 336v12" />
      <path d="M266 382h28 M280 376v12" />
    </g>
  );
}

function TangencyStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M124 148V340 M284 148V340 M332 236V340 M412 236V340" />
        <path d="M108 164H296 M320 244H428 M108 324H444" />
      </g>
      <g opacity="0.28" strokeDasharray="4 6" strokeWidth="0.6">
        <path d="M204 148V232 M204 256V340 M112 244H192 M216 244H298" />
        <path d="M372 232V272 M372 296V340 M320 284H360 M384 284H428" />
      </g>
      <g strokeWidth="0.95">
        <circle cx="204" cy="244" r="80" />
        <circle cx="372" cy="284" r="40" />
        <path d="M125.79 114.9 440.02 273.53 M108 324H444" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M206.25 239.54 240.05 172.58 M374.25 279.54 390.03 248.29" />
        <path d="m235.55 181.51 8.92 4.51 4.51-8.93" />
        <path d="M204 312h12v12 M372 314h10v10" />
        <path d="M198 244h12 M204 238v12 M366 284h12 M372 278v12" />
        <path d="M204 342V368 M372 342V368 M204 356H268 M308 356H372" />
        <path d="m200 360 8-8 m160 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="207" y="201">
          2r
        </text>
        <text x="360" y="263">
          r
        </text>
        <text textAnchor="middle" x="288" y="359">
          d
        </text>
        <text x="314" y="178">
          Common tangent
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function CornerRuleStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.09" strokeWidth="0.6">
        <path d="M130 108H414 M130 160H414 M130 212H414 M130 264H414 M130 316H414" />
        <path d="M178 90V328 M230 90V328 M282 90V328 M334 90V328 M386 90V328" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path
          d="M128 108H386V328 M282 88V331 M123 212H426"
          strokeDasharray="4 6"
        />
        <path d="M178 212a104 104 0 0 0 208 0 M282 108a104 104 0 0 0-104 104" />
        <path
          d="M282 132a80 80 0 0 0-80 80 M202 212a80 80 0 0 0 160 0"
          opacity="0.6"
        />
        <path d="M386 94v28 M372 108h28 M272 212h20 M282 202v20" />
      </g>
      <path
        d="M140 108H282a104 104 0 0 1 104 104V318H362V212a80 80 0 0 0-80-80H140Z"
        fill="currentColor"
        fillOpacity="0.035"
        stroke="none"
      />
      <g strokeWidth="1">
        <path d="M140 108H282a104 104 0 0 1 104 104V318" />
        <path d="M140 132H282a80 80 0 0 1 80 80V318" />
        <path d="M140 104v32 M358 318h32" opacity="0.65" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M282 212 355.54 138.46 m-7 0h7v7" />
        <path d="M282 212H306V188 M306 212a24 24 0 0 0-7-17" />
        <path d="M282 78H386 M282 71v14 M386 71v14 m-108-3 8-8 m96 8 8-8" />
        <path d="M417 108V212 M411 108h12 M411 212h12 m-10-100 8-8 m-8 112 8-8" />
        <path d="M362 345H386 M362 335v17 M386 335v17 m-28-3 8-8 m16 8 8-8" />
        <path d="M140 120H113L101 132" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <circle cx="282" cy="212" r="2.5" />
        <circle cx="282" cy="108" r="2.5" />
        <circle cx="386" cy="212" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="334" y="67">
          r
        </text>
        <text x="430" y="164">
          r
        </text>
        <text textAnchor="middle" x="374" y="367">
          u
        </text>
        <text transform="rotate(-45 323 160)" x="323" y="160">
          R104
        </text>
        <text x="91" y="147">
          offset
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function ProportionStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M128 112V333 M164 112V333 M218 112V333 M299 112V333 M420.5 112V333" />
        <path d="M111 185.5H440 M111 226H440 M111 253H440 M111 271H440 M111 307H440" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M110 307H445 M111 279.5 449 110.5" />
        <path d="M128 271V259 M164 253V241 M218 226V214 M299 185.5V173.5" />
        <path d="M299 185.5 420.5 307 M299 307 420.5 185.5" opacity="0.55" />
        <path d="M420.5 115V326" strokeDasharray="4 6" />
      </g>
      <g strokeWidth="0.95">
        <rect height="36" width="36" x="128" y="271" />
        <rect height="54" width="54" x="164" y="253" />
        <rect height="81" width="81" x="218" y="226" />
        <rect
          fill="currentColor"
          fillOpacity="0.025"
          height="121.5"
          width="121.5"
          x="299"
          y="185.5"
        />
      </g>
      <path d="M128 271 420.5 124.75" opacity="0.74" strokeWidth="0.9" />
      <g opacity="0.48" strokeWidth="0.65">
        <path d="M128 341H420.5 M128 334v14 M164 334v14 M218 334v14 M299 334v14 M420.5 334v14" />
        <path d="m124 345 8-8 m28 8 8-8 m46 8 8-8 m73 8 8-8 m113.5 8 8-8" />
        <path d="M442 185.5V307 M436 185.5h12 M436 307h12" />
        <path d="M359.75 124.75H420.5V155.125 M408.5 124.75v12h12" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <circle cx="128" cy="271" r="2.5" />
        <circle cx="164" cy="253" r="2.5" />
        <circle cx="218" cy="226" r="2.5" />
        <circle cx="299" cy="185.5" r="2.5" />
        <circle cx="420.5" cy="124.75" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="146" y="364">
          u
        </text>
        <text textAnchor="middle" x="191" y="364">
          1.5u
        </text>
        <text textAnchor="middle" x="258.5" y="364">
          2.25u
        </text>
        <text textAnchor="middle" x="359.75" y="364">
          3.375u
        </text>
        <text transform="rotate(-26.565 265 190)" x="265" y="190">
          × 1.5
        </text>
        <text textAnchor="middle" x="391" y="113">
          2
        </text>
        <text x="433" y="144">
          1
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function AssemblyStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M128 112H432 M128 144H432 M128 248H432 M128 281H432 M128 314H432" />
        <path d="M148 100V334 M180 100V334 M204 100V334 M334 100V334 M412 100V334" />
      </g>
      <g opacity="0.34" strokeWidth="0.6">
        <path
          d="M164 172V261 M252 164V263 M373 166V264"
          strokeDasharray="3 6"
        />
        <path d="m160 207 4 5 4-5 m80 0 4 5 4-5 m113 0 4 5 4-5" />
        <path d="M128 239v-10h20 M412 229h20v10 M118 248h20 M128 238v20" />
        <path d="M422 314h20 M432 304v20" />
      </g>
      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="6"
          width="32"
          x="148"
          y="128"
        />
        <path
          d="M156 136h6v6h-6z M166 136h6v6h-6z M156 146h6v6h-6z M166 146h6v6h-6z"
          opacity="0.7"
        />
        <rect
          fill="var(--color-sidebar)"
          height="28"
          rx="14"
          width="78"
          x="334"
          y="130"
        />
        <path d="m346 144 3 3 5-6" opacity="0.7" />
        <rect
          fill="var(--color-sidebar)"
          height="66"
          rx="12"
          width="304"
          x="128"
          y="248"
        />
        <rect height="32" rx="6" width="32" x="148" y="265" />
        <path
          d="M156 273h6v6h-6z M166 273h6v6h-6z M156 283h6v6h-6z M166 283h6v6h-6z"
          opacity="0.7"
        />
        <rect height="28" rx="14" width="78" x="334" y="267" />
        <path d="m346 281 3 3 5-6" opacity="0.7" />
      </g>
      <g opacity="0.45" strokeWidth="0.65">
        <path d="M204 156H298 M204 152v8 M298 152v8" />
        <path d="M128 344H432 M128 337v14 M432 337v14 m-308-3 8-8 m296 8 8-8" />
        <path d="M180 326H204 M180 322v8 M204 322v8" />
      </g>
      <g fill="currentColor" fontSize="12" opacity="0.78" stroke="none">
        <text x="215" y="148">
          Workspace
        </text>
        <text x="204" y="285">
          Workspace
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.58" stroke="none">
        <text x="363" y="148">
          Ready
        </text>
        <text x="363" y="285">
          Ready
        </text>
        <text textAnchor="middle" x="164" y="104">
          01
        </text>
        <text textAnchor="middle" x="252" y="104">
          02
        </text>
        <text textAnchor="middle" x="373" y="104">
          03
        </text>
        <text textAnchor="middle" x="280" y="364">
          3 parts / 1 composition
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function ModularTrayStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.14" strokeWidth="0.6">
        <path d="M128 120H432V328H128Z" />
        <path d="M148 100V348 M258 100V348 M280 100V348 M332 100V348 M412 100V348" />
        <path d="M108 140H452 M108 184H452 M108 208H452 M108 244H452 M108 264H452 M108 300H452" />
      </g>
      <g opacity="0.4" strokeWidth="0.65">
        <path d="M128 136v-16h16 M416 120h16v16 M128 312v16h16 M416 328h16v-16" />
        <path d="M148 82H412 M148 76v12 M412 76v12 m-268-2 8-8 m256 8 8-8" />
        <path d="M148 353H258 M148 347v12 M258 347v12 M280 353H412 M280 347v12 M412 347v12" />
        <path d="M258 318h22 M258 313v10 M280 313v10" />
      </g>
      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="160"
          x="148"
          y="146"
        />
        <circle cx="165" cy="162" r="3" />
        <path d="m291 158 4 4-4 4" opacity="0.6" />
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="9"
          width="44"
          x="352"
          y="140"
        />
        <path d="M366 162h16 M374 154v16" opacity="0.7" />
        <rect
          fill="var(--color-sidebar)"
          height="92"
          rx="9"
          width="110"
          x="148"
          y="208"
        />
        <rect height="24" opacity="0.7" rx="5" width="24" x="162" y="222" />
        <path d="M168 234h12 M174 228v12" opacity="0.55" />
        <path d="M162 263h54 M162 275h78" opacity="0.36" />
        <rect
          fill="var(--color-sidebar)"
          height="36"
          rx="7"
          width="132"
          x="280"
          y="208"
        />
        <circle cx="297" cy="226" opacity="0.75" r="4" />
        <rect
          fill="var(--color-sidebar)"
          height="36"
          rx="7"
          width="132"
          x="280"
          y="264"
        />
        <rect height="18" rx="9" width="30" x="369" y="273" />
        <circle cx="390" cy="282" r="5.5" />
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M332 140h80v44h-80Z" strokeDasharray="3 5" />
        <path d="M352 162H340 M408 162H396 M374 128v12 M374 184v12" />
        <path d="M139 291h18 M148 282v18" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="178" y="166">
          Design system
        </text>
        <text x="310" y="230">
          Preview
        </text>
        <text x="294" y="286">
          Active
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="280" y="71">
          12u
        </text>
        <text textAnchor="middle" x="204" y="373">
          5u
        </text>
        <text textAnchor="middle" x="346" y="373">
          6u
        </text>
        <text textAnchor="middle" x="270" y="333">
          u
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

export const systemStudies: IllustrationStudy[] = [
  {
    id: "primitives-tangency",
    code: "P01",
    title: "Tangency",
    description:
      "Two radii share a baseline and an inclined tangent. The contact geometry connects unequal circles through one construction rule.",
    category: "Foundations",
    illustration: <TangencyStudy />,
  },
  {
    id: "primitives-radius",
    code: "P02",
    title: "The corner rule",
    description:
      "One enlarged corner reveals the radius, offset, and tangent points behind a familiar interface shape.",
    category: "Foundations",
    illustration: <CornerRuleStudy />,
  },
  {
    id: "primitives-proportion",
    code: "P03",
    title: "A system of proportions",
    description:
      "Four squares grow from one shared unit. A single diagonal connects the scale into a structural rhythm.",
    category: "Foundations",
    illustration: <ProportionStudy />,
  },
  {
    id: "particles-assembly",
    code: "C01",
    title: "An assembly of parts",
    description:
      "An icon, a label, and a status pill align into one row, shown as an exploded technical drawing.",
    category: "Interfaces",
    illustration: <AssemblyStudy />,
  },
  {
    id: "particles-slots",
    code: "C02",
    title: "A modular tray",
    description:
      "Different interface fragments occupy a shared grid, like precisely fitted pieces in an architectural plan.",
    category: "Interfaces",
    illustration: <ModularTrayStudy />,
  },
  {
    id: "particles-recombination",
    code: "C03",
    title: "Recombination",
    description:
      "Identity, visibility, and action combine into one compact panel. Each of the three fragments keeps its role in the assembled result.",
    category: "Interfaces",
    illustration: <ParticlesBlueprint />,
  },
];
