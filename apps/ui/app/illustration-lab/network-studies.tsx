import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function RegistrationMarks() {
  return (
    <g opacity="0.28" strokeWidth="0.6">
      <path d="M96 88h16 M104 80v16 M448 352h16 M456 344v16" />
      <path d="M268 382h24 M280 376v12" />
    </g>
  );
}

function InterfaceLayersStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.22" strokeWidth="0.6">
        <path
          d="M202 58V210 M409 123V268 M128 140V282 M335 204V344"
          strokeDasharray="3 6"
        />
        <path d="M110 270 335 340 430 240 M184 68 421 142" />
      </g>
      <g transform="matrix(.9 .28 -.55 .58 202 184)">
        <rect
          fill="var(--color-sidebar)"
          height="134"
          rx="4"
          strokeWidth="1.1"
          width="230"
        />
        <g opacity="0.3" strokeWidth="0.7">
          <path d="M0 34H230 M0 67H230 M0 100H230 M57 0V134 M115 0V134 M172 0V134" />
          <path d="M0 0 230 134 M230 0 0 134" strokeDasharray="3 5" />
        </g>
      </g>
      <g transform="matrix(.9 .28 -.55 .58 202 130)">
        <rect
          fill="var(--color-sidebar)"
          height="134"
          rx="4"
          strokeWidth="1.1"
          width="230"
        />
        <g opacity="0.58" strokeWidth="0.85">
          <path d="M0 27H230 M65 27V134" />
          <rect height="45" rx="2" width="63" x="78" y="40" />
          <rect height="45" rx="2" width="63" x="154" y="40" />
          <path d="M78 102H217 M78 114H173 M16 47H48 M16 62H42 M16 77H45" />
        </g>
      </g>
      <g transform="matrix(.9 .28 -.55 .58 202 76)">
        <rect
          fill="var(--color-sidebar)"
          height="134"
          rx="4"
          strokeWidth="1.1"
          width="230"
        />
        <path d="M0 27H230 M65 27V134" strokeWidth="1" />
        <g opacity="0.66" strokeWidth="0.9">
          <circle cx="15" cy="14" r="2" />
          <circle cx="24" cy="14" r="2" />
          <circle cx="33" cy="14" r="2" />
          <path d="M174 14H214 M16 47H45 M16 62H38 M16 77H48" />
          <path d="M80 101H207 M80 113H159" />
          <rect height="44" rx="3" width="61" x="79" y="41" />
          <path d="m88 72 13-13 12 8 18-18 M159 49h47 M159 61h32 M159 73h39" />
        </g>
      </g>
      <g opacity="0.42" strokeWidth="0.65">
        <path d="M438 141V249 M432 141h12 M432 195h12 M432 249h12" />
        <path d="m434 145 8-8 m-8 62 8-8 m-8 62 8-8" />
        <path d="M142 310 324 366 M138 304l8 12 M320 360l8 12" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="450" y="172">
          u
        </text>
        <text x="450" y="226">
          u
        </text>
        <text transform="rotate(17.1 226 347)" x="226" y="347">
          assembly
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function AdaptiveLayoutStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="M99 83V337 M329 83V337 M368 83V337 M460 83V337" />
        <path d="M83 111H474 M83 283H474 M83 326H474" strokeDasharray="3 6" />
      </g>
      <g strokeWidth="1">
        <rect
          fill="var(--color-sidebar)"
          height="172"
          rx="5"
          width="230"
          x="99"
          y="111"
        />
        <path d="M99 145H329" />
        <circle cx="116" cy="128" r="4" />
        <path d="M128 128H157 M254 128H271 M283 128H311" opacity="0.65" />
        <path
          d="M119 172H181 M119 184H167 M119 211H182 M119 221H173"
          opacity="0.7"
        />
        <rect height="17" rx="8.5" width="47" x="119" y="240" />
        <path d="M131 248.5H153" opacity="0.62" />
        <rect height="97" rx="3" width="102" x="208" y="165" />
        <path d="M220 247V224H242V204H264V181H296" />
        <path d="M220 247H296V181 M242 224H296 M264 204H296" opacity="0.3" />
        <rect
          fill="var(--color-sidebar)"
          height="215"
          rx="5"
          width="92"
          x="368"
          y="111"
        />
        <path d="M368 145H460" />
        <circle cx="384" cy="128" r="4" />
        <path d="M396 128H418 M439 125h8 M439 131h8" opacity="0.65" />
        <path d="M381 165H440 M381 177H424" opacity="0.7" />
        <rect height="65" rx="3" width="66" x="381" y="193" />
        <path d="M389 247V232H403V220H418V204H439" />
        <path d="M389 247H439V204 M403 232H439 M418 220H439" opacity="0.3" />
        <path d="M381 276H441 M381 286H432" opacity="0.7" />
        <rect height="15" rx="7.5" width="43" x="381" y="299" />
        <path d="M392 306.5H413" opacity="0.62" />
      </g>
      <g opacity="0.5" strokeWidth="0.7">
        <path d="M337 210H359 m-5-5 5 5-5 5" />
        <path d="M99 89H329 M99 83v12 M329 83v12 m-234-2 8-8 m222 8 8-8" />
        <path d="M368 350H460 M368 344v12 M460 344v12 m-96-2 8-8 m84 8 8-8" />
        <path d="M119 300H310 M119 295v10 M208 295v10 M310 295v10" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="214" y="76">
          wide
        </text>
        <text textAnchor="middle" x="414" y="370">
          narrow
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function ConnectionBridgeStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.2" strokeWidth="0.6">
        <path d="M280 97V338 M93 303H470" strokeDasharray="4 6" />
        <path d="M175 244a105 105 0 0 1 210 0" strokeDasharray="3 6" />
        <path d="M158 237H402 M266 139h28 M280 125v28" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="1">
        <path d="M109 244 123 230H190V290L176 304H109Z" />
        <path d="M376 244 390 230H457V290L443 304H376Z" />
      </g>
      <g opacity="0.65" strokeWidth="0.85">
        <path d="M109 244H176V304 M176 244 190 230 M376 244H443V304 M443 244 457 230" />
        <path d="M123 252V290 M390 252V290" />
      </g>
      <path
        d="M184 242C212 110 358 110 398 242L385 255C345 123 199 123 171 255Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.05"
      />
      <path
        d="M171 255C199 123 345 123 385 255V266C345 145 199 145 171 266Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.05"
      />
      <g opacity="0.5" strokeWidth="0.7">
        <path d="m202 187 13-13 M270 156l13-13 M340 190l13-13" />
        <path d="M172 266H158 M385 266H399" />
        <path d="M176 334H385 M176 327v14 M385 327v14 m-213-3 8-8 m201 8 8-8" />
        <path d="M280 153V122H326" />
      </g>
      <g strokeWidth="0.95">
        <circle cx="145" cy="272" r="9" />
        <path d="M141 272h8 M145 268v8" />
        <circle cx="412" cy="272" r="9" />
        <path d="m408 272 3 3 5-6" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="280" y="355">
          span
        </text>
        <text x="332" y="125">
          joined
        </text>
        <text textAnchor="middle" x="145" y="322">
          01
        </text>
        <text textAnchor="middle" x="412" y="322">
          02
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function BranchingWorkflowStudy() {
  const routes =
    "M132 224H216A24 24 0 0 0 240 200V152A24 24 0 0 1 264 128H420 M132 224H420 M132 224H216A24 24 0 0 1 240 248V296A24 24 0 0 0 264 320H420";

  return (
    <BlueprintDrawing>
      <g opacity="0.08" strokeWidth="0.6">
        {[168, 192, 216, 240, 264, 288, 312, 336, 360, 384].map((x) => (
          <path d={`M${x} 104V344`} key={x} />
        ))}
        {[152, 176, 200, 248, 272, 296].map((y) => (
          <path d={`M108 ${y}H444`} key={y} />
        ))}
      </g>
      <g opacity="0.24" strokeWidth="0.6">
        <path
          d="M108 128H470 M108 224H470 M108 320H470"
          strokeDasharray="5 5"
        />
        <path d="M132 105V361 M420 105V361 M240 92V350" />
      </g>

      {/* Parallel outlines make the route itself the constructed form. */}
      <path d={routes} opacity="0.8" strokeWidth="13" />
      <path d={routes} stroke="var(--color-sidebar)" strokeWidth="11" />
      <g opacity="0.8" strokeWidth="1">
        <path d="M132 218V230 M420 122V134 M420 218V230 M420 314V326" />
      </g>
      <path d={routes} opacity="0.25" strokeDasharray="3 5" strokeWidth="0.6" />
      <path
        d="M132 224H216A24 24 0 0 0 240 200V152A24 24 0 0 1 264 128H420"
        opacity="0.6"
        strokeWidth="0.7"
      />

      <g opacity="0.37" strokeWidth="0.65">
        <circle cx="264" cy="152" r="24" strokeDasharray="2 4" />
        <path d="M264 119V162 M230 152H274 M258 152h12 M264 146v12" />
        <path d="M264 152 296 120 310 106H342" />
        <path d="M228 210H216V198" />
        <path d="M216 224A24 24 0 0 0 240 200" />
        <path d="M170 218V188H192 M170 230V248 M164 218h12 M164 230h12" />
        <path d="M460 128V164 M460 188V224 M460 224V260 M460 284V320" />
        <path d="M454 128h12 M454 224h12 M454 320h12" />
        <path d="m456 132 8-8 m-8 104 8-8 m-8 104 8-8" />
        <path d="M132 356H252 M300 356H420 M132 348V364 M420 348V364" />
        <path d="m128 360 8-8 m280 8 8-8" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.8">
        <circle cx="132" cy="224" r="2.5" />
        <circle cx="420" cy="128" r="2.5" />
        <circle cx="420" cy="224" r="2.5" />
        <circle cx="420" cy="320" r="2.5" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.55" stroke="none">
        <text x="348" y="109">
          R24
        </text>
        <text x="154" y="180">
          w = 12
        </text>
        <text textAnchor="middle" x="460" y="179">
          96
        </text>
        <text textAnchor="middle" x="460" y="275">
          96
        </text>
        <text textAnchor="middle" x="276" y="359">
          288
        </text>
        <text textAnchor="end" x="119" y="211">
          in
        </text>
        <text x="430" y="117">
          01
        </text>
        <text x="430" y="213">
          02
        </text>
        <text x="430" y="309">
          03
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function InformationTerrainStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="m100 306 171 39 187-63 M130 249l171 39 126-43 M170 209l171 39 51-18" />
        <path d="m157 319 186-63 M214 332l186-63 M203 213l170 39 M159 247l171 39" />
        <path d="M300 101V339" strokeDasharray="3 6" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.95">
        <path d="M113 288C99 268 125 248 164 246C188 244 199 222 231 221C264 220 276 242 311 235C350 227 373 232 395 251C411 265 446 265 444 286C441 314 389 330 345 326C310 323 292 340 252 333C220 328 205 314 175 315C144 316 124 305 113 288Z" />
        <path d="M143 261C132 244 154 224 183 221C211 218 216 201 242 199C270 197 284 216 314 212C346 208 362 213 380 229C397 244 422 242 419 261C416 282 375 299 338 295C311 292 291 307 258 300C231 295 218 286 192 285C170 285 151 276 143 261Z" />
        <path d="M174 235C164 219 182 203 207 197C230 193 236 180 255 178C279 176 291 191 317 190C341 188 351 197 365 209C382 223 397 225 392 241C386 260 355 271 326 267C302 264 288 279 261 273C237 267 227 260 207 258C189 257 177 246 174 235Z" />
        <path d="M206 211C197 198 212 183 231 179C251 174 257 161 272 160C289 160 302 173 321 173C338 173 344 183 354 193C365 205 374 211 368 224C360 240 336 246 316 241C295 237 282 248 262 243C244 238 240 231 227 229C214 226 209 218 206 211Z" />
        <path d="M237 187C231 177 244 163 258 158C271 153 278 144 288 145C303 146 310 156 324 158C337 160 340 169 347 178C354 191 348 204 335 210C321 217 305 211 290 214C275 217 263 210 254 205C244 199 241 194 237 187Z" />
        <path d="M267 165C263 156 270 144 283 139C297 133 307 141 315 148C324 154 329 163 323 172C317 181 306 180 296 183C285 185 272 177 267 165Z" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M295 158V112H342 M289 158h12 M295 152v12" />
        <path d="M110 148V307 M104 148h12 M104 307h12 m-10-155 8-8 m-8 167 8-8" />
        <path d="M363 294 413 315H446 M369 324 390 349H435" />
        <path d="M124 340 244 367 M124 334v12 M244 361v12" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="348" y="115">
          summit
        </text>
        <text x="92" y="232">
          h
        </text>
        <text x="451" y="318">
          02
        </text>
        <text x="440" y="352">
          01
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function OrderedCollectionStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.2" strokeWidth="0.6">
        <path
          d="M182 103V203 M390 137V237 M132 246V321 M339 279V353"
          strokeDasharray="3 6"
        />
        <path d="M115 321 340 355 414 305" />
        <path
          d="m182 133 38-22 M390 164l38-22 M132 234l38-22 M340 265l38-22"
          strokeDasharray="3 5"
        />
      </g>
      <g transform="matrix(1 .15 -.35 .7 182 181)">
        <path
          d="M0 0H25V-11H75V0H208V144H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.05"
        />
        <path
          d="M0 28H208 M15 124H63 M15 113H100"
          opacity="0.45"
          strokeWidth="0.85"
        />
      </g>
      <g transform="matrix(1 .15 -.35 .7 182 157)">
        <path
          d="M0 0H25V-11H75V0H208V144H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.05"
        />
        <path
          d="M0 28H208 M15 124H63 M15 113H100"
          opacity="0.45"
          strokeWidth="0.85"
        />
      </g>
      <g transform="matrix(1 .15 -.35 .7 182 133)">
        <path
          d="M0 0H25V-11H75V0H208V144H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.05"
        />
        <path
          d="M0 28H208 M15 124H63 M15 113H100"
          opacity="0.45"
          strokeWidth="0.85"
        />
      </g>
      <g transform="matrix(1 .15 -.35 .7 220 111)">
        <path
          d="M0 0H25V-11H75V0H208V144H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.1"
        />
        <path d="M0 28H208" strokeWidth="0.95" />
        <path d="M16 14H69 M162 14H191" opacity="0.62" strokeWidth="0.85" />
        <rect height="35" rx="3" strokeWidth="0.95" width="35" x="16" y="44" />
        <path
          d="m25 62 6 6 12-15 M66 49H143 M66 61H121 M66 73H134"
          opacity="0.76"
          strokeWidth="0.95"
        />
        <path
          d="M16 102H191 M16 115H165 M16 128H118"
          opacity="0.55"
          strokeWidth="0.9"
        />
        <text
          fill="currentColor"
          fontSize="9"
          opacity="0.6"
          stroke="none"
          x="34"
          y="-1"
        >
          01
        </text>
      </g>
      <g opacity="0.48" strokeWidth="0.65">
        <path d="m389 108 34-20 m-7-1 7 1-3 7 M392 108h-17" />
        <path d="M424 199V279 M418 199h12 M418 223h12 M418 247h12 M418 279h12" />
        <path d="M161 333 325 358 M161 327v12 M325 352v12" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="360" y="78">
          retrieve
        </text>
        <text x="437" y="240">
          index
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

export const networkStudies: IllustrationStudy[] = [
  {
    id: "interface-layers",
    code: "I01",
    title: "Layers of an interface",
    description:
      "A finished window lifts away from its layout and underlying grid, revealing the structure that holds it together.",
    category: "Interfaces",
    illustration: <InterfaceLayersStudy />,
  },
  {
    id: "interface-layout",
    code: "I02",
    title: "A layout that adapts",
    description:
      "The same composition changes its proportions, carrying one clear idea from a wide canvas into a narrow one.",
    category: "Interfaces",
    illustration: <AdaptiveLayoutStudy />,
  },
  {
    id: "workflow-bridge",
    code: "W01",
    title: "A connection, made",
    description:
      "A single slender bridge joins two endpoints, turning separate pieces into a continuous system.",
    category: "Workflows",
    illustration: <ConnectionBridgeStudy />,
  },
  {
    id: "workflow-branch",
    code: "W02",
    title: "A route, constructed",
    description:
      "One continuous route, three outlets. Parallel outlines reveal its width, repeated bend radius, and equal branch spacing.",
    category: "Workflows",
    illustration: <BranchingWorkflowStudy />,
    revision: true,
  },
  {
    id: "data-terrain",
    code: "A01",
    title: "A field of information",
    description:
      "Measured contours give a field of information a recognizable landscape, revealing its shape and its highest point.",
    category: "Data",
    illustration: <InformationTerrainStudy />,
  },
  {
    id: "data-stack",
    code: "A02",
    title: "An ordered collection",
    description:
      "An indexed collection opens around one selected record, keeping its place in the larger structure visible.",
    category: "Data",
    illustration: <OrderedCollectionStudy />,
  },
];
