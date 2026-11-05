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

function TwoTimeZones() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M104 124V316 M176 124V316 M392 124V316 M464 124V316" />
        <path d="M88 136H232 M336 136H480 M88 248H232 M336 248H480" />
      </g>
      <g opacity="0.28" strokeDasharray="4 6" strokeWidth="0.6">
        <path d="M248 212V240 M320 212V240 M248 324V332 M320 324V332" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M104 184H464 M104 296H464" />
        {[104, 176, 248, 320, 392, 464].map((x) => (
          <path d={`M${x} 180v8 M${x} 292v8`} key={x} />
        ))}
        <path d="M248 104H270 M298 104H320 M248 96V120 M320 96V120" />
        <path d="m244 108 8-8 m64 8 8-8" />
        <path d="M274 220h20 M274 228h20" />
        <path d="M248 328H320 M248 324v8 M320 324v8" />
      </g>
      <g strokeWidth="0.95">
        <rect height="40" rx="6" width="72" x="248" y="136" />
        <rect height="40" rx="6" width="72" x="248" y="248" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.75" stroke="none">
        <text x="104" y="160">
          UTC
        </text>
        <text x="104" y="272">
          UTC+03
        </text>
        <text textAnchor="middle" x="284" y="160">
          09:00
        </text>
        <text textAnchor="middle" x="284" y="272">
          12:00
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.52" stroke="none">
        {["07", "08", "09", "10", "11", "12"].map((hour, index) => (
          <text key={hour} textAnchor="middle" x={104 + index * 72} y="204">
            {hour}
          </text>
        ))}
        {["10", "11", "12", "13", "14", "15"].map((hour, index) => (
          <text key={hour} textAnchor="middle" x={104 + index * 72} y="316">
            {hour}
          </text>
        ))}
        <text textAnchor="middle" x="284" y="107">
          1h
        </text>
        <text textAnchor="middle" x="284" y="354">
          Same booking
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
      "Two hour scales describe the same booking. An aligned one-hour interval stays fixed while the local time changes by three hours.",
    category: "Scheduling",
    illustration: <TwoTimeZones />,
  },
];
