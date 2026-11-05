import { BlueprintDrawing } from "./blueprint-drawing";

export function AppointmentBuffersStudy() {
  return (
    <BlueprintDrawing>
      <g strokeWidth="0.6" opacity="0.24">
        <path d="M76 180H96M464 180H484M76 260H96M464 260H484" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M100 120V150M100 170V176M172 120V150M172 170V176M388 120V150M388 170V176M460 120V150M460 170V176" />
        <path d="M100 132H113M159 132H172M172 132H255M305 132H388M388 132H401M447 132H460" />
        <path d="M96 136l8-8M168 136l8-8M384 136l8-8M456 136l8-8" />
      </g>
      <g
        fill="currentColor"
        stroke="none"
        fontSize="10"
        textAnchor="middle"
        opacity="0.5"
      >
        <text x="136" y="135">
          10 min
        </text>
        <text x="280" y="135">
          30 min
        </text>
        <text x="424" y="135">
          10 min
        </text>
      </g>
      <g strokeWidth="0.65" opacity="0.27">
        <path d="M100 188L108 180 M100 200L120 180 M100 212L132 180 M100 224L144 180 M100 236L156 180 M100 248L168 180 M100 260L172 188 M172 200L112 260 M172 212L124 260 M172 224L136 260 M172 236L148 260 M172 248L160 260 M388 188L396 180 M388 200L408 180 M388 212L420 180 M388 224L432 180 M388 236L444 180 M388 248L456 180 M388 260L460 188 M460 200L400 260 M460 212L412 260 M460 224L424 260 M460 236L436 260 M460 248L448 260" />
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M172 180H100V260H172M388 180H460V260H388" />
      </g>
      <g strokeWidth="0.95">
        <path d="M172 180H388V260H172Z" />
      </g>
      <g
        fill="currentColor"
        stroke="none"
        fontSize="11"
        textAnchor="middle"
        opacity="0.72"
      >
        <text x="136" y="164">
          Buffer before
        </text>
        <text x="280" y="224">
          Appointment
        </text>
        <text x="424" y="164">
          Buffer after
        </text>
      </g>
      <g strokeWidth="0.6" opacity="0.24">
        <path d="M100 264V274M172 264V274M388 264V274M460 264V274" />
      </g>
      <g
        fill="currentColor"
        stroke="none"
        fontSize="10"
        textAnchor="middle"
        opacity="0.5"
      >
        <text x="100" y="287">
          09:50
        </text>
        <text x="172" y="287">
          10:00
        </text>
        <text x="388" y="287">
          10:30
        </text>
        <text x="460" y="287">
          10:40
        </text>
      </g>
      <g strokeWidth="0.65" opacity="0.5">
        <path d="M100 300V336M460 300V336M100 328H230M330 328H460" />
        <path d="M96 332l8-8M456 332l8-8" />
      </g>
      <text
        x="280"
        y="331"
        fill="currentColor"
        stroke="none"
        fontSize="10"
        textAnchor="middle"
        opacity="0.5"
      >
        50 min reserved
      </text>
    </BlueprintDrawing>
  );
}
