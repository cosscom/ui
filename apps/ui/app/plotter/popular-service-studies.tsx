import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function GitHubMergeStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M156 100V328M204 100V328M256 112V316M308 100V328M356 112V316M404 100V328M108 148H448M108 196H448M108 244H448" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M96 244H460M156 88V344M404 88V344" strokeDasharray="4 6" />
        <path
          d="M156 196H224M204 128V216M356 196H288M308 128V216"
          strokeDasharray="3 5"
        />
        <path d="M156 88H262M298 88H404M156 80V96M404 80V96m-252-4 8-8m240 8 8-8" />
        <path d="M256 292V308M308 292V308M256 300H308m-56 4 8-8m44 8 8-8" />
      </g>

      <g strokeWidth="1">
        <path d="M108 244H448" />
        <path d="M156 244V196A48 48 0 0 1 204 148H308A48 48 0 0 1 356 196V212A32 32 0 0 0 388 244" />
        {[156, 260, 404].map((x) => (
          <circle cx={x} cy="244" fill="var(--color-sidebar)" key={x} r="6" />
        ))}
        {[204, 256, 308].map((x) => (
          <circle cx={x} cy="148" fill="var(--color-sidebar)" key={x} r="6" />
        ))}
      </g>
      <g opacity="0.45" strokeWidth="0.65">
        <path d="M204 196 170.06 162.06M198 196H210M204 190V202" />
        <path d="M236 180V190H332V180M284 190V204" />
        <path d="M388 212H368M388 212V254M388 212 365.37 234.63" />
        <path d="M404 228V260M388 244H420" />
        <path d="M430 240 434 244 430 248" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="108" y="272">
          main
        </text>
        <text x="204" y="128">
          Proposed change
        </text>
        <text textAnchor="middle" x="284" y="221">
          Review
        </text>
        <text textAnchor="middle" x="404" y="272">
          Merge
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="280" y="91">
          Pull request
        </text>
        <text x="178" y="216">
          R48
        </text>
        <text textAnchor="middle" x="282" y="324">
          u
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function FigmaConstraintsStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M148 92V350M176 120V326M204 120V326M296 120V214M324 92V350M384 232V350M412 232V350M120 142H348M120 198H348M120 254H440M120 310H440" />
      </g>
      <g opacity="0.27" strokeWidth="0.6">
        <path
          d="M120 170H348M120 282H440M148 92V356M324 202V322"
          strokeDasharray="4 5"
        />
        <path d="M148 92H218M254 92H324M148 84V100M324 84V100m-180-4 8-8m168 8 8-8" />
        <path d="M148 346H262M298 346H412M148 338V354M412 338V354m-268-4 8-8m256 8 8-8" />
        <path d="M108 254V274M108 290V310M100 254H116M100 310H116" />
        <path d="M324 226H412m-6-4 6 4-6 4M324 222V230" />
      </g>

      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="56"
          rx="28"
          width="176"
          x="148"
          y="142"
        />
        <rect
          fill="var(--color-sidebar)"
          height="56"
          rx="28"
          width="264"
          x="148"
          y="254"
        />
        <path d="m176 164 6 6-6 6-6-6Zm0 112 6 6-6 6-6-6Z" opacity="0.65" />
        <path d="m294 166 4 4-4 4m88 104 4 4-4 4" opacity="0.65" />
      </g>
      <g opacity="0.4" strokeWidth="0.6">
        <path d="M136 242H424V322H136Z" strokeDasharray="3 5" />
        <path d="M148 234H176M148 230V238M176 230V238M384 234H412M384 230V238M412 230V238" />
        <path d="M384 248V324M368 282H424M384 282 403.8 301.8 432 330H456" />
        <path d="M404 282A20 20 0 0 1 398.14 296.14" />
        <g fill="var(--color-sidebar)">
          <path d="M133 239h6v6h-6ZM421 239h6v6h-6ZM133 319h6v6h-6ZM421 319h6v6h-6Z" />
        </g>
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="148" y="126">
          Component
        </text>
        <text x="148" y="218">
          Instance · fill
        </text>
        <text x="200" y="174">
          Button
        </text>
        <text x="200" y="286">
          Button
        </text>
        <text textAnchor="middle" x="368" y="215">
          Resize
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="236" y="95">
          176
        </text>
        <text textAnchor="middle" x="280" y="349">
          264
        </text>
        <text textAnchor="middle" x="108" y="286">
          56
        </text>
        <text x="432" y="345">
          R28
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function NotionBlocksStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M156 96V348M204 96V348M252 120V348M300 120V348M360 96V348M408 96V348M128 132H436M128 176H436M128 204H436M128 248H436M128 276H436M128 320H436" />
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path
          d="M204 100V352M408 100V352M144 154H424M188 226H424M188 298H424"
          strokeDasharray="3 5"
        />
        <path d="M204 88H290M322 88H408M204 80V96M408 80V96m-208-4 8-8m196 8 8-8" />
        <path d="M440 204V248M434 204H446M434 248H446M440 276V320M434 276H446M434 320H446" />
        <path d="M204 132H408V176H204Z" strokeDasharray="4 5" />
        <path d="M192 120V108H420V332H192V320" strokeDasharray="5 6" />
      </g>

      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="6"
          width="204"
          x="156"
          y="132"
        />
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="6"
          width="204"
          x="204"
          y="204"
        />
        <rect
          fill="var(--color-sidebar)"
          height="44"
          rx="6"
          width="204"
          x="204"
          y="276"
        />
        <path d="M174 146V162M184 146V162M174 154H184" opacity="0.65" />
        <path d="M222 220H236M222 226H233M222 232H236" opacity="0.65" />
        <path
          d="M222 290H238V306H222ZM222 295H238M230 295V306"
          opacity="0.65"
        />
      </g>
      <g opacity="0.43" strokeWidth="0.65">
        <path d="M372 154H396m-5-5 5 5-5 5" />
        <path d="M156 190H204M156 186V194M204 186V194" />
        <path d="M184 204V248M180 204H188M180 248H188M184 248V276M180 276H188" />
        <path d="M204 356H408M204 350V362M408 350V362m-208-2 8-8m196 8 8-8" />
        <path d="M204 132h12v12M396 308h12v12" opacity="0.5" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="200" y="158">
          Heading
        </text>
        <text x="252" y="230">
          Text
        </text>
        <text x="252" y="302">
          Database
        </text>
        <text x="426" y="112">
          Page
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="306" y="91">
          204
        </text>
        <text textAnchor="middle" x="306" y="376">
          Shared width
        </text>
        <text textAnchor="end" x="174" y="266">
          28
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function SupabaseRelationsStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M120 96V348M168 108V272M204 108V272M252 96V348M328 168V348M376 180V348M412 180V348M460 168V348M104 124H272M104 160H272M104 192H480M104 224H272M104 256H480M312 288H480M312 320H480" />
      </g>
      <g opacity="0.27" strokeWidth="0.6">
        <path d="M104 176H280M312 272H480" strokeDasharray="4 5" />
        <path
          d="M272 168V224M264 200H308M296 248H344M320 232V280"
          strokeDasharray="3 5"
        />
        <path d="M120 92H172M200 92H252M120 84V100M252 84V100m-136-4 8-8m124 8 8-8" />
        <path d="M328 352H380M408 352H460M328 344V360M460 344V360m-136-4 8-8m124 8 8-8" />
        <path d="M96 160V192M90 160H102M90 192H102" />
      </g>

      <g strokeWidth="0.95">
        <path d="M252 176H272A24 24 0 0 1 296 200V248A24 24 0 0 0 320 272H328" />
        <rect
          fill="var(--color-sidebar)"
          height="132"
          rx="6"
          width="132"
          x="120"
          y="124"
        />
        <rect
          fill="var(--color-sidebar)"
          height="132"
          rx="6"
          width="132"
          x="328"
          y="188"
        />
        <path d="M120 160H252M328 224H460" opacity="0.72" />
        <path
          d="M120 192H252M120 224H252M328 256H460M328 288H460"
          opacity="0.35"
        />
        <circle cx="252" cy="176" fill="var(--color-sidebar)" r="4" />
        <circle cx="328" cy="272" fill="var(--color-sidebar)" r="4" />
      </g>
      <g opacity="0.4" strokeWidth="0.65">
        <path d="M272 200 288.97 183.03M266 200H278M272 194V206" />
        <path d="M204 170V182M200 176H208M412 266V278M408 272H416" />
        <path d="M280 220H312M292 216V224M300 216V224" />
        <path d="M120 280H252M120 276V284M252 276V284" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="136" y="147">
          Users
        </text>
        <text x="136" y="180">
          id
        </text>
        <text x="136" y="212">
          name
        </text>
        <text x="136" y="244">
          email
        </text>
        <text x="344" y="211">
          Projects
        </text>
        <text x="344" y="244">
          id
        </text>
        <text x="344" y="276">
          owner_id
        </text>
        <text x="344" y="308">
          title
        </text>
        <text textAnchor="middle" x="186" y="304">
          Postgres
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="186" y="95">
          132
        </text>
        <text textAnchor="middle" x="394" y="355">
          132
        </text>
        <text x="270" y="150">
          R24
        </text>
        <text textAnchor="end" x="84" y="180">
          32
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const popularServiceStudies: IllustrationStudy[] = [
  {
    id: "service-github-merge",
    code: "B06",
    title: "GitHub · A change, brought together",
    description:
      "A proposed change branches from main, passes through review, and returns to one shared line. Circular bends and commit spacing make collaboration a measured construction.",
    category: "Services",
    illustration: <GitHubMergeStudy />,
  },
  {
    id: "service-figma-constraints",
    code: "B07",
    title: "Figma · Rules that resize",
    description:
      "A component grows into a wider instance while its height, radius, and end spacing remain fixed. A study of reusable design and layout constraints.",
    category: "Services",
    illustration: <FigmaConstraintsStudy />,
  },
  {
    id: "service-notion-blocks",
    code: "B08",
    title: "Notion · Knowledge, assembled",
    description:
      "Heading, text, and database blocks share one width and a repeatable gap. An offset block moves into the page’s common alignment frame.",
    category: "Services",
    illustration: <NotionBlocksStudy />,
  },
  {
    id: "service-supabase-relations",
    code: "B09",
    title: "Supabase · A shared relation",
    description:
      "Two Postgres table fragments connect a user’s primary key to project ownership. A single measured route expresses the relational foundation beneath an application.",
    category: "Services",
    illustration: <SupabaseRelationsStudy />,
  },
];
