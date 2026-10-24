import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

function RegistrationMarks() {
  return (
    <g opacity="0.28" strokeWidth="0.6">
      <path d="M100 86h12M106 80v12M448 354h12M454 348v12" />
      <path d="M262 392h36M280 386v12" />
    </g>
  );
}

function SharedAvailability() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="M140 112V324M196 112V324M252 112V324M308 112V324M364 112V324M420 112V324" />
        <path d="M100 160H460M100 200H460M100 240H460M100 280H460" />
        <path d="M100 220H460" strokeDasharray="5 5" />
      </g>

      <path
        d="M280 124H336V318H280Z"
        fill="currentColor"
        fillOpacity="0.025"
        opacity="0.45"
        strokeDasharray="3 5"
        strokeWidth="0.65"
      />
      <g opacity="0.25" strokeWidth="0.7">
        <path d="M140 180H420M140 260H420" />
        <path d="M140 174V186M420 174V186M140 254V266M420 254V266" />
      </g>

      <rect
        fill="var(--color-sidebar)"
        height="40"
        rx="6"
        strokeWidth="0.95"
        width="140"
        x="196"
        y="160"
      />
      <rect
        fill="var(--color-sidebar)"
        height="40"
        rx="6"
        strokeWidth="0.95"
        width="112"
        x="280"
        y="240"
      />
      <path
        d="M280 160H330Q336 160 336 166V194Q336 200 330 200H280Z"
        fill="currentColor"
        fillOpacity="0.055"
        stroke="none"
      />
      <path
        d="M286 240H336V280H286Q280 280 280 274V246Q280 240 286 240Z"
        fill="currentColor"
        fillOpacity="0.055"
        stroke="none"
      />
      <g opacity="0.43" strokeWidth="0.65">
        <path d="M280 136V304M336 136V304" strokeDasharray="3 4" />
        <path d="M308 200V240" />
        <path d="M303 215H313M303 225H313" />
      </g>
      <g fill="var(--color-sidebar)" strokeWidth="0.9">
        <circle cx="112" cy="180" r="10" />
        <circle cx="112" cy="260" r="10" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.7" stroke="none">
        <text textAnchor="middle" x="112" y="183.5">
          A
        </text>
        <text textAnchor="middle" x="112" y="263.5">
          B
        </text>
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M280 104H336M280 96V112M336 96V112" />
        <path d="m276 108 8-8m48 8 8-8" />
        <path d="M280 326V346M336 326V346M280 338H296M320 338H336" />
        <path d="m276 342 8-8m48 8 8-8" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        <text textAnchor="end" x="278" y="91">
          13:00
        </text>
        <text x="338" y="91">
          15:00
        </text>
        <text textAnchor="middle" x="308" y="341">
          2h
        </text>
        <text textAnchor="middle" x="280" y="367">
          Shared availability
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function ClockFace({ cx, hour }: { cx: number; hour: number }) {
  const hourAngle = (hour / 12) * Math.PI * 2;

  return (
    <g>
      <circle cx={cx} cy="220" opacity="0.18" r="82" strokeWidth="0.6" />
      <circle
        cx={cx}
        cy="220"
        fill="var(--color-sidebar)"
        r="74"
        strokeWidth="1"
      />
      <g opacity="0.52" strokeWidth="0.65">
        {Array.from({ length: 12 }, (_, index) => index).map((hourTick) => (
          <path
            d={`M${cx} 154V${hourTick % 3 === 0 ? 164 : 160}`}
            key={hourTick}
            transform={`rotate(${hourTick * 30} ${cx} 220)`}
          />
        ))}
      </g>
      <g opacity="0.18" strokeWidth="0.6">
        <path
          d={`M${cx - 48} 220H${cx + 48}M${cx} 172V268`}
          strokeDasharray="3 5"
        />
        <circle cx={cx} cy="220" r="44" strokeDasharray="3 5" />
      </g>
      <path
        d={`M${cx + Math.sin(hourAngle) * 44} ${220 - Math.cos(hourAngle) * 44}L${cx} 220V277`}
        strokeLinecap="round"
        strokeWidth="1.1"
      />
      <circle
        cx={cx}
        cy="220"
        fill="var(--color-sidebar)"
        r="3.5"
        strokeWidth="0.9"
      />
    </g>
  );
}

function TwoTimeZones() {
  return (
    <BlueprintDrawing>
      <g opacity="0.2" strokeWidth="0.6">
        <path d="M188 76V342M374 76V342M94 220H468" strokeDasharray="5 5" />
        <path d="M100 146H460M100 294H460" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M188 100H256M306 100H374M188 92V108M374 92V108" />
        <path d="m184 104 8-8m178 8 8-8" />
        <path d="M262 220H300" />
        <path d="M277 215V225M285 215V225" />
      </g>
      <ClockFace cx={188} hour={9.5} />
      <ClockFace cx={374} hour={3.5} />
      <g fill="currentColor" fontSize="10" opacity="0.55" stroke="none">
        <text textAnchor="middle" x="281" y="103">
          +6h
        </text>
        <text fontSize="12" textAnchor="middle" x="188" y="326">
          09:30
        </text>
        <text textAnchor="middle" x="188" y="344">
          UTC
        </text>
        <text fontSize="12" textAnchor="middle" x="374" y="326">
          15:30
        </text>
        <text textAnchor="middle" x="374" y="344">
          UTC+6
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

export const calStudies: IllustrationStudy[] = [
  {
    id: "cal-availability",
    code: "K02",
    title: "Common ground",
    description:
      "Two independent schedules share one precisely aligned window. The overlap becomes the composition’s central column.",
    category: "Scheduling",
    illustration: <SharedAvailability />,
  },
  {
    id: "cal-time-zones",
    code: "K03",
    title: "One moment, two places",
    description:
      "Two clock faces show the same instant six hours apart. Their shared minute hand and connecting datum make the time difference tangible.",
    category: "Scheduling",
    illustration: <TwoTimeZones />,
  },
];
