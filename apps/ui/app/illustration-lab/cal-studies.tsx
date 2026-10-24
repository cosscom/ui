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

function BoundCalendar() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="M138 108H430M138 330H430M168 72V362M392 72V362" />
        <path d="M280 64V370M112 220H448" strokeDasharray="5 5" />
        <path d="M156 96h12v12M392 96h12v12M156 330h12v12M392 330h12v12" />
      </g>

      <g transform="rotate(-5 280 220)">
        <path
          d="M173 112H398V334H173Z"
          fill="var(--color-sidebar)"
          opacity="0.45"
          strokeWidth="0.75"
        />
        <path
          d="M168 108H392V308L370 330H168Z"
          fill="var(--color-sidebar)"
          strokeWidth="1"
        />
        <path d="M370 330V308H392" strokeWidth="0.85" />
        <path d="M168 156H392" strokeWidth="0.9" />

        <g fill="var(--color-sidebar)" strokeWidth="1">
          <rect height="29" rx="5" width="10" x="209" y="91" />
          <rect height="29" rx="5" width="10" x="341" y="91" />
        </g>
        <g opacity="0.22" strokeWidth="0.6">
          <path d="M182 170H378V310H182ZM182 198H378M182 226H378M182 254H378M182 282H378" />
          <path d="M210 170V310M238 170V310M266 170V310M294 170V310M322 170V310M350 170V310" />
        </g>
        <g fill="currentColor" opacity="0.33" stroke="none">
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => {
            const position = day + 2;
            return day === 24 ? null : (
              <circle
                cx={196 + (position % 7) * 28}
                cy={184 + Math.floor(position / 7) * 28}
                key={day}
                r="1.15"
              />
            );
          })}
        </g>
        <circle
          cx="336"
          cy="268"
          fill="var(--color-sidebar)"
          r="11"
          strokeWidth="1.05"
        />
        <g fill="currentColor" stroke="none">
          <text fontSize="12" x="184" y="141">
            October
          </text>
          <text fontSize="10" opacity="0.5" textAnchor="end" x="376" y="141">
            2026
          </text>
          <text fontSize="10" textAnchor="middle" x="336" y="271.5">
            24
          </text>
        </g>

        <g opacity="0.42" strokeWidth="0.65">
          <path d="M182 346V362M378 346V362M182 354H254M306 354H378" />
          <path d="m178 358 8-8m188 8 8-8" />
          <path d="M347 268H422L434 256" />
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
          <text textAnchor="middle" x="280" y="357">
            7 days
          </text>
          <text x="426" y="247">
            Yours
          </text>
        </g>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
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

function BookingTicket() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="M128 72V342M296 72V342M444 188V352" />
        <path d="M102 112H320M102 286H462M226 214H462M226 326H462" />
        <path d="M212 72V352M100 220H464" strokeDasharray="5 5" />
      </g>

      <path
        d="M133 117H301V291H133Z"
        fill="var(--color-sidebar)"
        opacity="0.35"
        strokeWidth="0.7"
      />
      <rect
        fill="var(--color-sidebar)"
        height="174"
        strokeWidth="1"
        width="168"
        x="128"
        y="112"
      />
      <path d="M128 152H296" strokeWidth="0.9" />
      <g fill="var(--color-sidebar)" strokeWidth="0.95">
        <rect height="25" rx="4" width="8" x="160" y="98" />
        <rect height="25" rx="4" width="8" x="256" y="98" />
      </g>
      <g fill="currentColor" stroke="none">
        <text fontSize="11" opacity="0.65" textAnchor="middle" x="212" y="140">
          October
        </text>
        <text
          fontSize="60"
          fontWeight="400"
          textAnchor="middle"
          x="212"
          y="226"
        >
          24
        </text>
      </g>
      <path d="M174 249H232M174 255H214" opacity="0.25" strokeWidth="0.65" />

      <g opacity="0.5" strokeWidth="0.7">
        <path d="M296 174H324Q340 174 340 190V214" />
        <path d="m335 207 5 7 5-7" />
        <path d="M252 344V360M444 344V360M252 352H324M372 352H444" />
        <path d="m248 356 8-8m184 8 8-8" />
      </g>
      <path
        d="M258 214H438Q444 214 444 220V260A8 8 0 0 0 444 276V320Q444 326 438 326H258Q252 326 252 320V276A8 8 0 0 0 252 260V220Q252 214 258 214Z"
        fill="var(--color-sidebar)"
        strokeWidth="1"
      />
      <path
        d="M388 224V316"
        opacity="0.4"
        strokeDasharray="2 4"
        strokeWidth="0.65"
      />
      <path d="M268 298H370" opacity="0.2" strokeWidth="0.65" />
      <circle cx="416" cy="268" opacity="0.5" r="14" strokeWidth="0.8" />
      <path d="m410 268 4 4 8-9" strokeLinecap="round" strokeWidth="1" />
      <g fill="currentColor" stroke="none">
        <text fontSize="10" opacity="0.55" x="269" y="238">
          Booked
        </text>
        <text fontSize="28" x="268" y="281">
          14:30
        </text>
        <text fontSize="9" opacity="0.45" x="269" y="313">
          Confirmed
        </text>
        <text fontSize="10" opacity="0.5" textAnchor="middle" x="348" y="355">
          30 min
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

function HostPortrait({ cy }: { cy: number }) {
  return (
    <g strokeWidth="0.85">
      <circle cx="330" cy={cy} r="18" />
      <circle cx="330" cy={cy - 5} r="5" />
      <path d={`M320 ${cy + 9}C320 ${cy - 1} 340 ${cy - 1} 340 ${cy + 9}`} />
    </g>
  );
}

function RoutedBooking() {
  return (
    <BlueprintDrawing>
      <g opacity="0.16" strokeWidth="0.6">
        <path d="M106 132H460M106 220H460M106 308H460" />
        <path d="M150 96V344M238 96V344M330 96V344" strokeDasharray="5 5" />
        <path d="M302 96V344M444 96V344" />
      </g>

      <g opacity="0.3" strokeWidth="0.85">
        <path d="M238 220V152Q238 132 258 132H302" />
        <path d="M238 220V288Q238 308 258 308H302" />
        <rect height="64" rx="32" width="142" x="302" y="100" />
        <rect height="64" rx="32" width="142" x="302" y="276" />
        <HostPortrait cy={132} />
        <HostPortrait cy={308} />
        <path d="M360 143H412M360 319H394" strokeWidth="0.65" />
      </g>

      <path d="M190 220H302" strokeWidth="1.05" />
      <path d="m291 215 7 5-7 5" strokeWidth="0.9" />
      <circle cx="238" cy="220" fill="currentColor" r="2.5" stroke="none" />
      <rect
        fill="var(--color-sidebar)"
        height="64"
        rx="32"
        strokeWidth="1"
        width="142"
        x="302"
        y="188"
      />
      <HostPortrait cy={220} />
      <path d="M360 231H412" opacity="0.3" strokeWidth="0.65" />

      <rect
        fill="var(--color-sidebar)"
        height="82"
        strokeWidth="1"
        width="80"
        x="110"
        y="178"
      />
      <path d="M110 200H190" strokeWidth="0.8" />
      <g fill="var(--color-sidebar)" strokeWidth="0.9">
        <rect height="15" rx="3" width="6" x="126" y="170" />
        <rect height="15" rx="3" width="6" x="168" y="170" />
      </g>
      <g opacity="0.24" strokeWidth="0.65">
        <path d="M124 212H176V246H124ZM141.3 212V246M158.7 212V246M124 229H176" />
      </g>
      <circle cx="150" cy="220.5" r="5.5" strokeWidth="0.85" />

      <g opacity="0.4" strokeWidth="0.65">
        <path d="M238 352H302M238 344V360M302 344V360" />
        <path d="m234 356 8-8m56 8 8-8" />
        <path d="M238 280H262L276 294" />
      </g>
      <g fill="currentColor" fontSize="10" stroke="none">
        <text opacity="0.5" textAnchor="middle" x="150" y="283">
          Request
        </text>
        <text opacity="0.35" x="360" y="132">
          Design
        </text>
        <text opacity="0.8" x="360" y="220">
          Support
        </text>
        <text opacity="0.35" x="360" y="308">
          Sales
        </text>
        <text opacity="0.5" textAnchor="middle" x="270" y="376">
          One match
        </text>
      </g>
      <RegistrationMarks />
    </BlueprintDrawing>
  );
}

export const calStudies: IllustrationStudy[] = [
  {
    id: "cal-calendar",
    code: "K01",
    title: "A day worth keeping",
    description:
      "A bound calendar isolates one date within a measured month. A lifted corner and fine page edges give the familiar object a quiet physical presence.",
    category: "Cal.com",
    illustration: <BoundCalendar />,
  },
  {
    id: "cal-availability",
    code: "K02",
    title: "Common ground",
    description:
      "Two independent schedules share one precisely aligned window. The overlap becomes the composition’s central column.",
    category: "Cal.com",
    illustration: <SharedAvailability />,
  },
  {
    id: "cal-time-zones",
    code: "K03",
    title: "One moment, two places",
    description:
      "Two clock faces show the same instant six hours apart. Their shared minute hand and connecting datum make the time difference tangible.",
    category: "Cal.com",
    illustration: <TwoTimeZones />,
  },
  {
    id: "cal-booking",
    code: "K04",
    title: "Time, reserved",
    description:
      "A day on the calendar becomes a perforated confirmation ticket, turning available time into a definite appointment.",
    category: "Cal.com",
    illustration: <BookingTicket />,
  },
  {
    id: "cal-routing",
    code: "K05",
    title: "The right person",
    description:
      "One booking follows a clear route to its matching host. The other lanes recede, leaving the selected connection unmistakable.",
    category: "Cal.com",
    illustration: <RoutedBooking />,
  },
];
