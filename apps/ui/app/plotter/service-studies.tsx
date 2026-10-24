import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function CloudflareEdgeStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M144 88V360M200 96V352M256 96V352M312 96V352M368 88V360M120 112H392M120 168H392M120 280H392M120 336H392" />
      </g>
      <g opacity="0.25" strokeWidth="0.6">
        <path d="M72 224H488M256 88V360" strokeDasharray="4 5" />
        <path d="M144 76H240M272 76H368M144 68V84M368 68V84m-228-4 8-8m216 8 8-8" />
        <path d="M144 360V380M368 360V380M144 372H240M272 372H368m-228 4 8-8m216 8 8-8" />
      </g>
      <path
        d="M144 218V112H368V218M368 230V336H144V310M144 298V230"
        strokeWidth="0.95"
      />
      <path
        d="M156 204V124H356V204M156 244V324H356V244"
        opacity="0.25"
        strokeDasharray="3 5"
        strokeWidth="0.6"
      />
      <g strokeWidth="0.9">
        <path d="M80 224H138M150 224H212" />
        <circle cx="144" cy="224" fill="var(--color-sidebar)" r="6" />
        <circle cx="256" cy="224" fill="var(--color-sidebar)" r="44" />
        <circle cx="448" cy="224" fill="var(--color-sidebar)" r="28" />
        <path d="M256 268V280A24 24 0 0 1 232 304H80m6-4-6 4 6 4" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M300 224H420" strokeDasharray="4 5" />
        <path d="m414 220 6 4-6 4M200 220l4 4-4 4" />
        <circle cx="368" cy="224" fill="var(--color-sidebar)" r="3" />
        <path d="M232 280H264M232 280V312M232 280 249 297" />
        <path d="M287.1 192.9 312 168H328" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="80" y="207">
          Visitor
        </text>
        <text textAnchor="middle" x="256" y="228">
          Cache
        </text>
        <text textAnchor="middle" x="448" y="228">
          Origin
        </text>
        <text textAnchor="middle" x="256" y="143">
          Cloudflare edge
        </text>
        <text x="306" y="207">
          Miss
        </text>
        <text x="84" y="291">
          Hit
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="256" y="79">
          4u
        </text>
        <text textAnchor="middle" x="256" y="375">
          4u
        </text>
        <text x="312" y="158">
          R44
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function VercelDeploymentStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.55">
        <path d="M112 84V372M136 88V368M232 88V368M256 84V372M328 164V292M352 176V288M448 176V288M472 164V292" />
        <path d="M88 96H280M88 168H280M88 192H488M88 264H488M88 288H280M88 360H280" />
      </g>
      <g opacity="0.22" strokeWidth="0.6">
        <path d="M96 228H488M184 84V376M400 176V292" strokeDasharray="4 6" />
        <path d="M100 96H112V84M256 372V360H268M316 192H328V180M472 276V264H484" />
        <path
          d="M112 96H256M112 168H256M112 288H256M112 360H256"
          strokeDasharray="3 5"
        />
      </g>

      <g opacity="0.38" strokeDasharray="3 5" strokeWidth="0.7">
        <rect height="72" rx="12" width="144" x="112" y="96" />
        <rect height="72" rx="12" width="144" x="112" y="288" />
      </g>
      <rect
        fill="var(--color-sidebar)"
        height="72"
        rx="12"
        strokeDasharray="4 4"
        strokeOpacity="0.72"
        strokeWidth="0.85"
        width="144"
        x="112"
        y="192"
      />
      <rect
        fill="var(--color-sidebar)"
        height="72"
        rx="12"
        strokeWidth="0.95"
        width="144"
        x="328"
        y="192"
      />

      <g opacity="0.52" strokeWidth="0.65">
        <path d="M256 228H328m-6-4 6 4-6 4" />
        <path d="M148 204V252M364 204V252" strokeDasharray="3 5" />
        <path
          d="M160 216H232M160 228H208M376 216H448M376 228H424"
          opacity="0.72"
        />
        <path d="M160 240H184M376 240H400" />
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M148 108V156M148 300V348" strokeDasharray="3 5" />
        <path d="M160 120H208M160 132H232M160 144H184M160 312H232M160 324H184M160 336H208" />
      </g>
      <g opacity="0.42" strokeWidth="0.6">
        <path d="M84 168H100M84 192H100M92 168V192m-4-20 8-8m-8 32 8-8" />
        <path d="M328 292V312M472 292V312M328 304H384M416 304H472m-148 4 8-8m136 8 8-8" />
        <path d="M448 252H484M460 240V276M460 252 484 276H500" />
        <path d="M400 264V292M400 316V344" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="112" y="76">
          Preview
        </text>
        <text x="328" y="172">
          Production
        </text>
        <text textAnchor="middle" x="292" y="213">
          Promote
        </text>
        <text textAnchor="middle" x="400" y="365">
          Production URL
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text x="124" y="136">
          01
        </text>
        <text x="124" y="232">
          02
        </text>
        <text x="124" y="328">
          03
        </text>
        <text x="340" y="232">
          02
        </text>
        <text textAnchor="end" x="78" y="184">
          24
        </text>
        <text textAnchor="middle" x="400" y="307">
          144
        </text>
        <text x="486" y="291">
          R12
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function StripeSettlementStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.13" strokeWidth="0.6">
        <path d="M128 104V188M192 104V188M208 104V188M272 104V188M288 104V188M352 104V188M368 104V188M432 104V188" />
        <path d="M112 128H448M112 176H448M128 272H432M128 328H432" />
        <path d="M152 244V364M216 244V364M280 244V364M344 244V364M408 244V364" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M112 152H448M128 300H432" strokeDasharray="4 5" />
        <path
          d="M160 188V212H184V260M240 188V228H248V260M320 188V228H312V260M400 188V212H376V260"
          strokeDasharray="3 5"
        />
        <path d="M128 92H150M170 92H192M128 86V98M192 86V98m-68 0 8-8m56 8 8-8" />
        <path d="M152 352H264M296 352H408M152 344V360M408 344V360m-260-4 8-8m248 8 8-8" />
      </g>
      <g strokeWidth="0.95">
        {[128, 208, 288, 368].map((x) => (
          <rect
            fill="var(--color-sidebar)"
            height="48"
            key={x}
            rx="8"
            width="64"
            x={x}
            y="128"
          />
        ))}
        <rect
          fill="var(--color-sidebar)"
          height="56"
          rx="8"
          width="256"
          x="152"
          y="272"
        />
        <path
          d="M216 272V284M280 272V284M344 272V284M216 316V328M280 316V328M344 316V328"
          opacity="0.45"
        />
      </g>
      <g opacity="0.4" strokeWidth="0.65">
        <path d="M184 252V264m-4-4 4 4 4-4M248 252V264m-4-4 4 4 4-4M312 252V264m-4-4 4 4 4-4M376 252V264m-4-4 4 4 4-4" />
        <path d="M412 320H388M400 332V308M400 320 424 344H448" />
        <path d="M128 188H192M128 184V192M192 184V192" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        {[160, 240, 320, 400].map((x) => (
          <text key={x} textAnchor="middle" x={x} y="156">
            $25
          </text>
        ))}
        <text textAnchor="middle" x="280" y="306">
          $100 · Gross balance
        </text>
        <text x="128" y="117">
          Payments
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="160" y="95">
          u
        </text>
        <text textAnchor="middle" x="280" y="355">
          4u
        </text>
        <text x="424" y="358">
          R8
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function StripePaymentStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M112 100V332M224 112V332M280 100V332M336 100V332M448 112V332M88 140H464M88 172H464M88 204H464M88 236H464M88 268H464M88 300H464" />
      </g>
      <g opacity="0.28" strokeWidth="0.6">
        <path d="M96 220H468M308 100V340" strokeDasharray="4 5" />
        <path d="M112 100H152M184 100H224M112 92V108M224 92V108m-116-4 8-8m104 8 8-8" />
        <path d="M280 340H298M318 340H336M280 332V348M336 332V348m-60-4 8-8m48 8 8-8" />
        <path d="M88 156V284M80 156H96M80 220H96M80 284H96" />
      </g>

      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="112"
          x="112"
          y="140"
        />
        <path d="M224 156H236A16 16 0 0 1 252 172V204A16 16 0 0 0 268 220H280" />
        <path d="M280 124V204M280 236V316M336 124V204M336 236V316" />
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="56"
          x="280"
          y="204"
        />
        <path d="M336 220H448" />
        <circle cx="448" cy="220" fill="var(--color-sidebar)" r="5" />
      </g>
      <g opacity="0.45" strokeWidth="0.7">
        <rect height="32" rx="16" width="112" x="112" y="204" />
        <rect height="32" rx="16" width="112" x="112" y="268" />
        <path
          d="M224 220H272M224 284H236A16 16 0 0 0 252 268V236A16 16 0 0 1 268 220"
          strokeDasharray="3 5"
        />
        <path d="M272 124H288M328 124H344M272 316H288M328 316H344" />
      </g>
      <g opacity="0.34" strokeWidth="0.6">
        <path d="M236 156V180M228 172H260M236 172 247.3 160.7 264 144" />
        <path d="M128 132V180M104 156H144M208 132V180M192 156H232" />
        <path d="M308 244V268H360" strokeDasharray="3 5" />
        <path d="M448 232V268H420" />
        <path d="M264 124H352M264 316H352" strokeDasharray="3 5" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="168" y="160">
          Card
        </text>
        <text textAnchor="middle" x="168" y="224">
          Wallet
        </text>
        <text textAnchor="middle" x="168" y="288">
          Bank
        </text>
        <text textAnchor="middle" x="308" y="224">
          Pay
        </text>
        <text textAnchor="middle" x="308" y="110">
          Checkout
        </text>
        <text textAnchor="middle" x="392" y="208">
          $24 · Paid
        </text>
        <text textAnchor="end" x="420" y="272">
          Business
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="168" y="103">
          2u
        </text>
        <text textAnchor="middle" x="308" y="343">
          u
        </text>
        <text textAnchor="end" x="264" y="140">
          R16
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function LinearCycleStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M136 92V348M204 100V340M272 92V348M340 100V340M408 92V348" />
        <path d="M112 156H432M112 188H432M112 212H432M112 244H432M112 268H432M112 300H432" />
      </g>
      <g opacity="0.32" strokeWidth="0.65">
        <path d="M136 80H244M300 80H408M136 72V88M408 72V88m-276-4 8-8m264 8 8-8" />
        <path d="M136 120H402M136 114V126M272 114V126" />
        <path d="M408 126V332" strokeDasharray="3 5" />
        <path d="M136 328H204M136 322V334M204 322V334m-72-2 8-8m60 8 8-8" />
        <path d="M116 172V284M110 172H122M110 228H122M110 284H122" />
      </g>
      <g strokeWidth="0.95">
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="136"
          x="136"
          y="156"
        />
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="204"
          x="204"
          y="212"
        />
        <rect
          fill="var(--color-sidebar)"
          height="32"
          rx="16"
          width="136"
          x="272"
          y="268"
        />
        <circle cx="408" cy="120" fill="var(--color-sidebar)" r="6" />
        <circle cx="152" cy="172" opacity="0.55" r="4" />
        <circle cx="220" cy="228" opacity="0.55" r="4" />
        <circle cx="288" cy="284" opacity="0.55" r="4" />
      </g>
      <g opacity="0.38" strokeWidth="0.6">
        <path d="M256 144V200M244 172H284M256 172 267.3 160.7 292 136H312" />
        <path d="M264 172A8 8 0 0 0 261.7 166.3" />
        <path d="M392 200V256M380 228H420M392 256V312M380 284H420" />
        <path d="M400 120H416M408 112V128" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="204" y="176">
          Issue 01
        </text>
        <text textAnchor="middle" x="306" y="232">
          Issue 02
        </text>
        <text textAnchor="middle" x="340" y="288">
          Issue 03
        </text>
        <text textAnchor="middle" x="204" y="108">
          Week 1
        </text>
        <text textAnchor="middle" x="340" y="108">
          Week 2
        </text>
        <text x="424" y="124">
          Release
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="272" y="83">
          Cycle
        </text>
        <text textAnchor="middle" x="170" y="347">
          u
        </text>
        <text x="292" y="151">
          R16
        </text>
      </g>
    </BlueprintDrawing>
  );
}

export const serviceStudies: IllustrationStudy[] = [
  {
    id: "service-cloudflare-edge",
    code: "B01",
    title: "Cloudflare · Between visitor and origin",
    description:
      "An edge cache between visitor and origin: a hit returns locally, while a miss continues outward. A study of Cloudflare’s CDN role.",
    category: "Services",
    illustration: <CloudflareEdgeStudy />,
  },
  {
    id: "service-vercel-deploy",
    code: "B02",
    title: "Vercel · From preview to production",
    description:
      "Preview 02 is selected for production. Matching outlines identify the same source version; promotion rebuilds it for the production environment.",
    category: "Services",
    illustration: <VercelDeploymentStudy />,
  },
  {
    id: "service-stripe-settlement",
    code: "B03",
    title: "Stripe · A balance, assembled",
    description:
      "Four equal payment units combine into one gross balance. Their conserved width makes collection and reconciliation a visible construction rule.",
    category: "Services",
    illustration: <StripeSettlementStudy />,
  },
  {
    id: "service-linear-cycle",
    code: "B04",
    title: "Linear · Work aligned to a cycle",
    description:
      "Issue modules share a two-week construction grid. Their measured spans align the work toward a common release milestone.",
    category: "Services",
    illustration: <LinearCycleStudy />,
  },
  {
    id: "service-stripe-payment",
    code: "B05",
    title: "Stripe · Many ways to pay",
    description:
      "Card, wallet, and bank payments share one checkout aperture. A selected route carries a customer payment through to a paid purchase for the business.",
    category: "Services",
    illustration: <StripePaymentStudy />,
  },
];
