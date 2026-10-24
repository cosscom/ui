import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function OpenVolume() {
  return (
    <BlueprintDrawing>
      <g opacity="0.2" strokeWidth="0.6">
        <path d="M280 76V366M94 302H466" strokeDasharray="5 6" />
        <path d="M120 106V334M440 106V334M106 130H454" />
        <path d="M112 122h16M120 114v16M432 122h16M440 114v16" />
      </g>

      <path
        d="M115 145C166 123 224 126 280 158C336 126 394 123 445 145L435 309C381 290 330 296 280 329C230 296 179 290 125 309Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M122 296C178 277 230 284 280 317C330 284 382 277 438 296" />
        <path d="M124 301C178 282 230 289 280 322C330 289 382 282 436 301" />
        <path d="M126 306C179 288 230 294 280 327C330 294 381 288 434 306" />
      </g>
      <path
        d="M126 130C176 113 228 127 280 159C332 127 384 113 434 130L424 294C372 276 324 287 280 312C236 287 188 276 136 294Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.05"
      />
      <path d="M280 159V312" strokeWidth="1" />
      <path
        d="M272 156C268 201 268 254 272 307M288 156C292 201 292 254 288 307"
        opacity="0.35"
        strokeWidth="0.65"
      />
      <g opacity="0.26" strokeWidth="0.65">
        <path d="M148 151C185 141 218 148 252 165L247 278C213 263 184 262 157 269Z" />
        <path d="M308 165C342 148 375 141 412 151L403 269C376 262 347 263 313 278Z" />
      </g>
      <g opacity="0.48" strokeWidth="0.7">
        <path d="M164 178C188 174 210 178 234 187M164 191C188 187 210 191 234 200M165 204C189 200 211 204 235 213M166 217C188 214 209 216 229 223" />
        <path d="M326 185C350 176 372 173 396 177M326 198C350 189 372 186 396 190M326 211C350 202 372 199 395 203M326 224C345 217 362 214 380 216" />
      </g>
      <path
        d="M304 144L310 248L320 240L329 244L321 136"
        fill="var(--color-sidebar)"
        strokeWidth="0.8"
      />

      <g opacity="0.5" strokeWidth="0.65">
        <path d="M126 344V364M434 344V364M126 356H246M314 356H434" />
        <path d="m122 360 8-8m300 8 8-8" />
        <path d="M280 329V344M337 238H456L468 226" />
        <path d="M109 138 95 138 83 126" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="middle" x="280" y="359">
          2 × folio
        </text>
        <text x="443" y="216">
          Index
        </text>
        <text x="61" y="119">
          01
        </text>
        <text textAnchor="middle" x="280" y="395">
          The open volume
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function IndexedArchive() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M130 104V374M390 65V345M96 355H453" />
        <path d="M98 207 452 136M98 305 452 234" strokeDasharray="5 6" />
        <path d="M122 96h16M130 88v16M382 349h16M390 341v16" />
      </g>
      <g transform="matrix(1 -0.2 0 1 130 175)">
        <path
          d="M0 0H84L100 17H260V180H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1"
        />
        <path
          d="M18 11V-16H96V-29H140V-16H232V151H18Z"
          fill="var(--color-sidebar)"
          strokeWidth="0.85"
        />
        <path
          d="M34 23V-27H150V-40H194V-27H248V152H34Z"
          fill="var(--color-sidebar)"
          strokeWidth="0.85"
        />
        <path
          d="M50 30V-49H198V-62H242V-49H264V140H50Z"
          fill="var(--color-sidebar)"
          strokeWidth="1"
        />
        <g opacity="0.3" strokeWidth="0.65">
          <path d="M64-32V92H250V-32Z" />
          <path d="M82-13H158M82 3H212M82 14H212M82 25H190" />
          <path d="M82 47H144V74H82ZM158 47H230M158 58H230M158 69H210" />
        </g>
        <g opacity="0.5" strokeWidth="0.65">
          <path d="M108-22h20M162-33h20M210-55h20" />
        </g>
        <path
          d="M0 65H84L100 81H260V180H0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.05"
        />
        <path d="M0 174H260" opacity="0.4" strokeWidth="0.65" />
        <rect height="26" opacity="0.65" rx="2" width="72" x="94" y="112" />
        <g opacity="0.4" strokeWidth="0.65">
          <path d="M106 121H154M106 129H135" />
        </g>
        <path d="M260 81 269 77V175L260 180" strokeWidth="0.85" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M130 376 390 324M130 367V385M390 315V333" />
        <path d="m126 381 8-10m252-42 8-10" />
        <path d="M408 67V279M400 67H416M400 279H416" />
        <path d="m404 71 8-8m-8 220 8-8" />
        <path d="M243 135V78L227 62" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text
          transform="rotate(-11.3 260 364)"
          textAnchor="middle"
          x="260"
          y="364"
        >
          A series
        </text>
        <text x="424" y="165">
          3 leaves
        </text>
        <text textAnchor="end" x="222" y="57">
          Index
        </text>
        <text textAnchor="middle" x="280" y="395">
          An indexed archive
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function AdjustableLight() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M98 340H461M245 72V365M113 118H422" />
        <path d="M183 81V268M123 220H419" strokeDasharray="5 6" />
        <circle cx="183" cy="220" r="42" strokeDasharray="3 5" />
        <path d="M175 220h16M183 212v16M278 118h16M286 110v16" />
      </g>
      <path
        d="M180 329C180 318 310 318 310 329V335C310 346 180 346 180 335Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <ellipse
        cx="245"
        cy="329"
        opacity="0.5"
        rx="65"
        ry="9"
        strokeWidth="0.65"
      />
      <path
        d="M237 327V307H253V327"
        fill="var(--color-sidebar)"
        strokeWidth="0.9"
      />
      <path
        d="m239 308-62-87 11-7 63 87ZM178 215 281 113l9 9-102 102Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <path
        d="M191 219 253 306M188 229 248 316M190 206 278 119"
        opacity="0.4"
        strokeWidth="0.65"
      />
      <path d="M286 118 310 135" strokeWidth="1" />
      <path d="M289 113 314 130" strokeWidth="0.7" />
      <g transform="translate(310 130) rotate(-35)">
        <path
          d="M-8-13H8V1H-8Z"
          fill="var(--color-sidebar)"
          strokeWidth="0.9"
        />
        <path
          d="M-11 0C-14 24-31 40-42 65Q0 80 42 65C31 40 14 24 11 0Z"
          fill="var(--color-sidebar)"
          strokeWidth="1.05"
        />
        <ellipse cx="0" cy="65" rx="42" ry="7" strokeWidth="0.85" />
        <path d="M-10 65Q0 80 10 65" opacity="0.55" strokeWidth="0.7" />
        <path
          d="M0 83V128M-32 80-43 122M32 80 43 122"
          opacity="0.16"
          strokeDasharray="3 6"
          strokeWidth="0.6"
        />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.9">
        <circle cx="245" cy="307" r="8" />
        <circle cx="183" cy="220" r="10" />
        <circle cx="286" cy="118" r="8" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="245" cy="307" r="1.6" />
        <circle cx="183" cy="220" r="1.8" />
        <circle cx="286" cy="118" r="1.6" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M213 190A42 42 0 0 1 208 254" />
        <path d="m208 251 1 5 5-2" />
        <path d="M132 118V329M124 118H140M124 329H140" />
        <path d="m128 122 8-8m-8 219 8-8" />
        <path d="M180 359V377M310 359V377M180 369H229M261 369H310" />
        <path d="m176 373 8-8m122 8 8-8" />
        <path d="M377 163H421L436 148" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="227" y="225">
          θ
        </text>
        <text textAnchor="middle" x="245" y="372">
          Ø
        </text>
        <text x="438" y="141">
          01
        </text>
        <text
          transform="rotate(-90 117 224)"
          textAnchor="middle"
          x="117"
          y="224"
        >
          Working height
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function SheetToVolume() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path
          d="M280 59V373M98 230 420 60M122 72 460 250"
          strokeDasharray="5 6"
        />
        <path d="M107 315 280 224 453 315" strokeDasharray="3 5" />
        <path d="M166 190h16M174 182v16M378 190h16M386 182v16" />
      </g>
      <path
        d="M174 190 280 134 230 72 124 128Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <path
        d="M181 183 275 134"
        opacity="0.4"
        strokeDasharray="3 4"
        strokeWidth="0.65"
      />
      <path
        d="M280 134 386 190 429 126 323 70Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <path
        d="M286 135 380 185"
        opacity="0.4"
        strokeDasharray="3 4"
        strokeWidth="0.65"
      />
      <path d="M174 190 280 134 386 190 280 246Z" strokeWidth="0.9" />
      <path
        d="M280 134V224L174 280M280 224 386 280"
        opacity="0.3"
        strokeWidth="0.65"
      />
      <path
        d="M174 190 280 246V336L174 280Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.05"
      />
      <path
        d="M280 246 386 190V280L280 336Z"
        fill="var(--color-sidebar)"
        strokeWidth="1.05"
      />
      <path
        d="M182 204 272 251V324M288 251 378 204"
        opacity="0.23"
        strokeWidth="0.65"
      />
      <path
        d="M211 235 249 255V278L211 258Z"
        opacity="0.6"
        strokeWidth="0.75"
      />
      <path d="m218 246 24 13m-24-5 15 8" opacity="0.4" strokeWidth="0.65" />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M175 138A52 52 0 0 1 218 164" />
        <path d="m212 162 7 3-1-7" />
        <path d="M407 195V280M399 195H415M399 280H415" />
        <path d="m403 199 8-8m-8 93 8-8" />
        <path d="M174 301V323M280 357V379M174 313 215 335M240 348 280 369" />
        <path d="m170 316 8-6m98 62 8-6" />
        <path d="M342 164 365 111M365 111H409" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="192" y="132">
          Fold
        </text>
        <text x="421" y="240">
          h
        </text>
        <text
          transform="rotate(28 228 344)"
          textAnchor="middle"
          x="228"
          y="344"
        >
          u
        </text>
        <text x="416" y="114">
          01
        </text>
        <text textAnchor="middle" x="280" y="403">
          From sheet to volume
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function LetterAnatomy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M111 132H449M111 308H449M170 89V354M364 89V354" />
        <path d="M266 76V361M108 220H452" strokeDasharray="5 6" />
        <circle cx="266" cy="220" r="96" strokeDasharray="3 5" />
        <path d="M111 124H449M111 316H449" strokeDasharray="3 6" />
      </g>
      <path
        d="M330 146V132H364V308H330V294C313 309 290 316 266 316C213 316 170 273 170 220C170 167 213 124 266 124C290 124 313 131 330 146ZM266 158C232 158 204 186 204 220C204 254 232 282 266 282C300 282 328 254 328 220C328 186 300 158 266 158Z"
        fill="currentColor"
        fillOpacity="0.025"
        fillRule="evenodd"
        strokeWidth="1.1"
      />
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M266 158H328V220M204 220V282H266" />
        <path d="M260 220h12M266 214v12" />
        <path d="M266 124H213M170 220V167M266 316H319" />
      </g>
      <g fill="var(--color-sidebar)" opacity="0.8" strokeWidth="0.65">
        <rect height="4" width="4" x="264" y="122" />
        <rect height="4" width="4" x="168" y="218" />
        <rect height="4" width="4" x="264" y="314" />
        <circle cx="213" cy="124" r="2" />
        <circle cx="170" cy="167" r="2" />
        <circle cx="319" cy="316" r="2" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M394 132V308M386 132H402M386 308H402" />
        <path d="m390 136 8-8m-8 184 8-8" />
        <path d="M330 333V361M364 333V361M330 352H364" />
        <path d="m326 356 8-8m26 8 8-8" />
        <path d="M266 220 222 176m0 6v-6h6" />
        <path d="M205 304H126L111 319" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text
          transform="rotate(-90 415 220)"
          textAnchor="middle"
          x="415"
          y="220"
        >
          x-height
        </text>
        <text textAnchor="middle" x="347" y="377">
          Stem
        </text>
        <text transform="rotate(45 233 192)" x="233" y="192">
          r
        </text>
        <text textAnchor="end" x="113" y="334">
          Overshoot
        </text>
        <text textAnchor="middle" x="266" y="402">
          Anatomy of a letter
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function MarkInMaking() {
  return (
    <BlueprintDrawing>
      <g opacity="0.18" strokeWidth="0.6">
        <path d="M280 63V377M116 220H444" strokeDasharray="5 6" />
        <path d="M166 84V356M394 84V356M146 106H414M146 334H414" />
        <circle cx="280" cy="220" r="114" strokeDasharray="3 6" />
        <circle cx="280" cy="220" r="78" strokeDasharray="3 6" />
        <path d="M280 220 404 96M280 220 404 344" />
        <path d="M158 98h16M166 90v16M386 342h16M394 334v16" />
      </g>
      <path
        d="M360.61 139.39A114 114 0 1 0 360.61 300.61L335.15 275.15A78 78 0 1 1 335.15 164.85Z"
        fill="currentColor"
        fillOpacity="0.025"
        strokeWidth="1.1"
      />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M315.36 184.64A50 50 0 0 1 315.36 255.36" />
        <path d="m315 190v-6h6m-6 65v6h6" />
        <path d="M280 220 199.39 139.39m0 6v-6h6" />
        <path d="M166 355V377M202 355V377M166 368H202" />
        <path d="m162 372 8-8m28 8 8-8" />
        <path d="M367 143H416L432 127" />
        <path d="M274 220h12M280 214v12" />
      </g>
      <g fill="var(--color-sidebar)" opacity="0.8" strokeWidth="0.65">
        <circle cx="280" cy="106" r="2.5" />
        <circle cx="166" cy="220" r="2.5" />
        <circle cx="280" cy="334" r="2.5" />
        <rect height="4" width="4" x="358.61" y="137.39" />
        <rect height="4" width="4" x="333.15" y="162.85" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="340" y="224">
          90°
        </text>
        <text transform="rotate(45 223 151)" x="223" y="151">
          R
        </text>
        <text textAnchor="middle" x="184" y="392">
          1u
        </text>
        <text x="435" y="121">
          Terminal
        </text>
        <text textAnchor="middle" x="302" y="399">
          A mark in the making
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const objectStudies: IllustrationStudy[] = [
  {
    id: "document-book",
    code: "D01",
    title: "The open volume",
    description:
      "A curved spread, a bound spine, and a ribbon index turn documentation into a tangible object.",
    category: "Documents",
    illustration: <OpenVolume />,
  },
  {
    id: "document-index",
    code: "D02",
    title: "An indexed archive",
    description:
      "Three indexed leaves emerge from an oblique folder: a small architecture for keeping knowledge in order.",
    category: "Documents",
    illustration: <IndexedArchive />,
  },
  {
    id: "object-lamp",
    code: "O01",
    title: "An adjustable light",
    description:
      "An articulated desk lamp with measured joints and a quiet cone of light makes adaptability physical.",
    category: "Objects",
    illustration: <AdjustableLight />,
  },
  {
    id: "object-fold",
    code: "O02",
    title: "From sheet to volume",
    description:
      "An open carton reveals the hinges and folds that transform one flat material into a useful volume.",
    category: "Objects",
    illustration: <SheetToVolume />,
  },
  {
    id: "type-letter",
    code: "T01",
    title: "Anatomy of a letter",
    description:
      "A custom lowercase a exposes its circular bowl, counter, stem, and optical overshoot.",
    category: "Typography",
    illustration: <LetterAnatomy />,
  },
  {
    id: "type-monogram",
    code: "T02",
    title: "A mark in the making",
    description:
      "Two concentric arcs and a deliberate opening establish the logic of a simple geometric C.",
    category: "Typography",
    illustration: <MarkInMaking />,
  },
];
