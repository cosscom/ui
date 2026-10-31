import { AppointmentBuffersStudy } from "./appointment-buffers";
import { BlueprintDrawing } from "./blueprint-drawing";
import type { IllustrationStudy } from "./study-types";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekHours = ["09:00", "10:00", "11:00", "12:00", "13:00"];

function WeekConstruction() {
  return (
    <BlueprintDrawing>
      <g opacity="0.14" strokeWidth="0.6">
        <path d="M140 80V344M420 80V344M132 140H452M132 300H452" />
        <path d="M280 130V326M132 200H436" strokeDasharray="4 5" />
      </g>

      <g opacity="0.5" strokeWidth="0.9">
        <path d="M140 140H420V300H140Z" />
        <path d="M180 140V300M220 140V300M260 140V300M300 140V300M340 140V300M380 140V300" />
        <path d="M140 180H420M140 220H420M140 260H420" />
      </g>

      <path
        d="M260 180H300V220H260Z"
        fill="currentColor"
        fillOpacity="0.035"
        strokeWidth="0.95"
      />
      <circle cx="280" cy="200" r="16" strokeWidth="1" />
      <g opacity="0.45" strokeWidth="0.65">
        <path d="M256 200H304M280 176V224" strokeDasharray="2 4" />
        <path d="M280 200 291.3 188.7" />
        <path d="M287.3 188.7h4v4" />
      </g>
      <circle
        cx="280"
        cy="200"
        fill="var(--color-sidebar)"
        r="2"
        strokeWidth="0.8"
      />

      <g opacity="0.42" strokeWidth="0.65">
        <path d="M140 88H256M304 88H420M140 80V96M420 80V96" />
        <path d="m136 92 8-8m272 8 8-8" />
        <path d="M140 316V340M180 316V340M140 332H180" />
        <path d="m136 336 8-8m32 8 8-8" />
        <path d="M448 140V207M448 233V300M440 140H456M440 300H456" />
        <path d="m444 144 8-8m-8 168 8-8" />
        <path d="M128 128H140V140M420 300H432V312" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        {weekDays.map((day, index) => (
          <text key={day} textAnchor="middle" x={160 + index * 40} y="122">
            {day}
          </text>
        ))}
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        {weekHours.map((hour, index) => (
          <text key={hour} textAnchor="end" x="124" y={143 + index * 40}>
            {hour}
          </text>
        ))}
        <text textAnchor="middle" x="280" y="91">
          7 days
        </text>
        <text textAnchor="middle" x="448" y="223">
          4 h
        </text>
        <text textAnchor="middle" x="160" y="354">
          1 day
        </text>
        <text textAnchor="middle" x="280" y="342">
          Thu · 10:00–11:00
        </text>
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M99 96h12M105 90v12M443 356h12M449 350v12" />
      </g>
    </BlueprintDrawing>
  );
}

function TimeSlotConstruction() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M156 104V344M216 104V344M276 104V344M336 104V344M396 104V344" />
        <path d="M124 128H424M124 168H424M124 224H424M124 280H424" />
      </g>
      <g opacity="0.26" strokeWidth="0.6">
        <path d="M132 148H420M132 252H436M276 92V352" strokeDasharray="4 5" />
        <path d="M156 180V212M396 180V212" strokeDasharray="3 5" />
      </g>

      <g strokeWidth="0.95">
        <rect height="40" rx="20" width="120" x="156" y="128" />
        <rect height="40" rx="20" width="120" x="276" y="128" />
        <rect
          fill="var(--color-sidebar)"
          height="56"
          rx="28"
          width="240"
          x="156"
          y="224"
        />
      </g>

      <g opacity="0.38" strokeWidth="0.65">
        <path d="M216 180V212M336 180V212" />
        <path d="m212 208 4 4 4-4m112 0 4 4 4-4" />
        <path d="M156 100H207M225 100H276M156 94V106M276 94V106" />
        <path d="m152 104 8-8m112 8 8-8" />
        <path d="M156 304V328M276 304V328M396 304V328" />
        <path d="M156 320H207M225 320H327M345 320H396" />
        <path d="m152 324 8-8m112 8 8-8m112 8 8-8" />
        <path d="M368 214V290M358 252H406" />
        <path d="M368 252 387.8 232.2 420 200H444" />
        <path d="M383.8 232.2h4v4" />
      </g>

      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="216" y="152">
          15 min
        </text>
        <text textAnchor="middle" x="336" y="152">
          15 min
        </text>
        <text textAnchor="middle" x="276" y="256">
          30 min
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="216" y="103">
          u
        </text>
        <text textAnchor="middle" x="216" y="323">
          u
        </text>
        <text textAnchor="middle" x="336" y="323">
          u
        </text>
        <text x="426" y="192">
          R28
        </text>
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M118 104h12M124 98v12M422 352h12M428 346v12" />
      </g>
    </BlueprintDrawing>
  );
}

function AvailabilityConstruction() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M160 84V324M208 84V324M256 84V324M304 84V324M352 84V324M400 84V324" />
        <path d="M112 108H448M112 156H448M112 204H448M112 252H448M112 300H448" />
      </g>
      <g opacity="0.26" strokeWidth="0.6">
        <path d="M280 112V344M100 204H460" strokeDasharray="5 5" />
      </g>

      <g opacity="0.62" strokeWidth="0.95">
        <path d="M136 180H424V228H136Z" />
        <path d="M256 108H304V300H256Z" />
      </g>
      <rect
        fill="currentColor"
        fillOpacity="0.045"
        height="48"
        strokeWidth="1"
        width="48"
        x="256"
        y="180"
      />
      <circle cx="280" cy="204" r="16" strokeWidth="1" />
      <circle
        cx="280"
        cy="204"
        fill="var(--color-sidebar)"
        r="2"
        strokeWidth="0.8"
      />

      <g opacity="0.42" strokeWidth="0.65">
        <path d="M136 336V360M424 336V360M136 352H266M294 352H424" />
        <path d="m132 356 8-8m280 8 8-8" />
        <path d="M444 108H464M444 300H464M456 108V191M456 217V300" />
        <path d="m452 112 8-8m-8 200 8-8" />
        <path d="M256 64V88M304 64V88M256 76H304" />
        <path d="m252 80 8-8m40 8 8-8" />
        <path d="M304 228 360 284H452" />
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="middle" x="280" y="58">
          u
        </text>
        <text textAnchor="middle" x="280" y="355">
          6u
        </text>
        <text textAnchor="middle" x="456" y="207">
          4u
        </text>
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="136" y="169">
          Alex’s availability
        </text>
        <text textAnchor="middle" x="280" y="96">
          Sam’s availability
        </text>
        <text x="360" y="276">
          Shared slot
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="360" y="301">
          30 min meeting
        </text>
      </g>
      <g opacity="0.3" strokeWidth="0.6">
        <path d="M106 86h12M112 80v12M442 330h12M448 324v12" />
      </g>
    </BlueprintDrawing>
  );
}

export const flatCalStudies: IllustrationStudy[] = [
  {
    id: "cal-week-grid",
    code: "K06",
    title: "A week, constructed",
    description:
      "Monday through Sunday on a measured hourly grid. One constructed circle locates a meeting on Thursday, from 10:00 to 11:00.",
    category: "Scheduling",
    illustration: <WeekConstruction />,
  },
  {
    id: "cal-time-modules",
    code: "K07",
    title: "The shape of a time slot",
    description:
      "Two measured intervals combine into one reusable time slot. Duration becomes a rule of composition.",
    category: "Scheduling",
    illustration: <TimeSlotConstruction />,
  },
  {
    id: "cal-availability-plan",
    code: "K08",
    title: "Where schedules meet",
    description:
      "Alex’s and Sam’s availability meet in one shared slot. Named bands and a meeting callout make the overlap explicit.",
    category: "Scheduling",
    illustration: <AvailabilityConstruction />,
  },
  {
    id: "cal-appointment-buffers",
    code: "K09",
    title: "Appointment buffers",
    description:
      "A 30-minute appointment sits between two 10-minute buffers. The proportional intervals reserve 50 minutes in total.",
    category: "Scheduling",
    illustration: <AppointmentBuffersStudy />,
  },
];
