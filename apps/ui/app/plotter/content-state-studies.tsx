import { BlueprintDrawing, CompactBlueprintDrawing } from "./blueprint-drawing";
import { HorizontalDimension, VerticalDimension } from "./dimensions";
import type { IllustrationStudy } from "./study-types";

const secondaryLine = {
  opacity: 0.5,
  strokeWidth: 0.65,
  strokeLinecap: "butt",
  strokeLinejoin: "miter",
} as const;

function Registration() {
  return (
    <g opacity="0.28" strokeWidth="0.6">
      <path d="M94 84h12 M100 78v12 M454 372h12 M460 366v12" />
    </g>
  );
}

const indexRecords = [
  { x: 108, label: "A" },
  { x: 180, label: "B" },
  { x: 324, label: "D" },
  { x: 396, label: "E" },
];

function SearchForm() {
  return (
    <>
      <rect height="40" rx="20" width="112" x="224" y="100" />
      <circle cx="244" cy="119" r="6" />
      <path d="m248.24 123.24 5 5" />
      {indexRecords.map(({ x }) => (
        <rect height="56" key={x} rx="6" width="56" x={x} y="240" />
      ))}
    </>
  );
}

function SearchGap({ dash = "4 5" }: { dash?: string }) {
  return (
    <g opacity="0.38" strokeWidth="0.65">
      <path d="M280 152V224" strokeDasharray={dash} />
      <path d="M252 250V240H262 M298 240H308V250 M252 286V296H262 M298 296H308V286" />
      <path d="M272 268h16 M280 260v16" strokeDasharray={dash} />
    </g>
  );
}

function SearchStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M92 240H464 M92 296H464 M108 220V320 M164 220V320 M180 220V320 M236 220V320 M324 220V320 M380 220V320 M396 220V320 M452 220V320" />
      </g>
      <SearchGap />
      <g strokeWidth="0.95">
        <SearchForm />
      </g>
      <g {...secondaryLine}>
        <path d="M252 306V330 M308 306V330" />
        <HorizontalDimension label="u" x1={252} x2={308} y={336} />
        <path d="M224 88V70 M336 88V70" />
        <HorizontalDimension label="Query" x1={224} x2={336} y={64} />
      </g>
      <g
        fill="currentColor"
        fontSize="12"
        opacity="0.72"
        stroke="none"
        textAnchor="middle"
      >
        <text x="286" y="124">
          C
        </text>
        {indexRecords.map(({ x, label }) => (
          <text key={label} x={x + 28} y="272">
            {label}
          </text>
        ))}
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="108" y="222">
          Index
        </text>
        <text textAnchor="middle" x="280" y="374">
          0 matches
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function SearchCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 200]} scale={0.24}>
      <SearchForm />
      <SearchGap dash="2 2" />
      {indexRecords.map(({ x }) => (
        <path d={`M${x + 16} 268h24`} key={x} opacity="0.45" />
      ))}
      <path d="M272 120h24" opacity="0.5" />
    </CompactBlueprintDrawing>
  );
}

const readNotifications = [132, 196, 260];

function NotificationStream({ dash = "3 5" }: { dash?: string }) {
  return (
    <>
      <path d="M160 100V124 M160 140V188 M160 204V252" />
      {readNotifications.map((y) => (
        <g key={y}>
          <circle cx="160" cy={y} r="8" />
          <path d={`M168 ${y}H192`} opacity="0.5" />
          <rect height="40" rx="8" width="208" x="192" y={y - 20} />
          <path d={`m372 ${y} 5 5 9-10`} opacity="0.65" />
          <path d={`M212 ${y - 4}h76 M212 ${y + 7}h48`} opacity="0.4" />
        </g>
      ))}
      <g opacity="0.38" strokeDasharray={dash}>
        <path d="M160 268V316" />
        <circle cx="160" cy="324" r="8" />
        <path d="M176 324H192" />
      </g>
    </>
  );
}

function NotificationsStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M192 92V296 M400 92V296 M176 112H424 M176 152H424 M176 176H424 M176 216H424 M176 240H424 M176 280H424" />
      </g>
      <g strokeWidth="0.95">
        <NotificationStream />
      </g>
      <g {...secondaryLine}>
        <VerticalDimension label="3u" side="start" x={120} y1={132} y2={324} />
        <path d="M114 196h12 M114 260h12 M136 132H148 M136 324H148" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="192" y="92">
          Read
        </text>
        <text x="208" y="328">
          0 unread
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="192" y="368">
          The stream is caught up.
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function NotificationsCompact() {
  return (
    <CompactBlueprintDrawing center={[276, 214]} scale={0.28}>
      <NotificationStream dash="2 2" />
    </CompactBlueprintDrawing>
  );
}

const pageHeight = 200 * Math.sqrt(2);
const pageBottom = 80 + pageHeight;
const writingTop = 80 + pageHeight * 0.2;
const writingBottom = 80 + pageHeight * 0.8;

function PageForm() {
  return (
    <>
      <path d={`M180 80H340L380 120V${pageBottom}H180Z`} />
      <path d="M340 80V120H380" opacity="0.5" />
      <path d="M232 156V176" />
    </>
  );
}

function WritingArea({ dash = "3 5" }: { dash?: string }) {
  return (
    <rect
      height={pageHeight * 0.6}
      opacity="0.38"
      strokeDasharray={dash}
      width="120"
      x="220"
      y={writingTop}
    />
  );
}

function FilesStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path
          d={`M164 80H396 M164 ${pageBottom}H396 M180 64V${pageBottom + 16} M380 128V${pageBottom + 16}`}
        />
      </g>
      <g opacity="0.24" strokeWidth="0.65">
        <path
          d={`M180 80 220 ${writingTop} M340 ${writingBottom} 380 ${pageBottom}`}
        />
        <path d="M328 80H352 M340 68V132 M368 120H392" />
      </g>
      <g strokeWidth="0.75">
        <WritingArea />
      </g>
      <g strokeWidth="1">
        <PageForm />
      </g>
      <g {...secondaryLine}>
        <path d="M180 64V42 M380 64V42" />
        <HorizontalDimension label="5u" x1={180} x2={380} y={36} />
        <path
          d={`M180 ${pageBottom + 8}V392 M220 ${writingBottom + 8}V392 M340 ${writingBottom + 8}V392 M380 ${pageBottom + 8}V392`}
        />
        <HorizontalDimension label="u" x1={180} x2={220} y={392} />
        <HorizontalDimension label="3u" x1={220} x2={340} y={392} />
        <HorizontalDimension label="u" x1={340} x2={380} y={392} />
        <path d="M224 166H156" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="end" x="150" y="169.5">
          Begin here
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="404" y="224">
          1 : √2
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function FilesCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 80 + pageHeight / 2]} scale={0.25}>
      <PageForm />
      <WritingArea dash="2 2" />
      <path
        d={`M180 80 220 ${writingTop} M340 ${writingBottom} 380 ${pageBottom}`}
        opacity="0.4"
      />
    </CompactBlueprintDrawing>
  );
}

const plotColumns = [196, 244, 292, 340, 388, 436];
const plotRows = [132, 180, 228, 276];

function EmptyPlot({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <g opacity={compact ? 0.24 : 0.12} strokeWidth="0.6">
        {plotRows.map((y) => (
          <path d={`M148 ${y}H436`} key={y} />
        ))}
        {plotColumns.map((x) => (
          <path
            d={
              !compact && x === 292
                ? "M292 108V202 M292 226V324"
                : `M${x} 108V324`
            }
            key={x}
          />
        ))}
      </g>
      <path d="M148 100V324H444" />
      <path
        d="M142 132h6 M142 180h6 M142 228h6 M142 276h6 M196 324v6 M244 324v6 M292 324v6 M340 324v6 M388 324v6 M436 324v6"
        opacity="0.5"
      />
    </>
  );
}

function DataStudy() {
  return (
    <BlueprintDrawing>
      <g strokeWidth="0.95">
        <EmptyPlot />
      </g>
      <g {...secondaryLine}>
        <path d="M196 340V358 M244 340V358" />
        <HorizontalDimension label="u" x1={196} x2={244} y={364} />
        <path d="M128 228H112 M128 276H112" />
        <VerticalDimension label="u" side="start" x={104} y1={228} y2={276} />
        <path
          d="M260 194v-8h16 M324 194v-8h-16 M260 238v8h16 M324 238v8h-16"
          opacity="0.5"
        />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="292" y="220">
          No observations
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="end" x="136" y="340">
          0
        </text>
        <text x="452" y="328">
          x
        </text>
        <text x="145" y="88">
          y
        </text>
        <text textAnchor="middle" x="348" y="364">
          An unoccupied coordinate field
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function DataCompact() {
  return (
    <CompactBlueprintDrawing center={[292, 216]} scale={0.26}>
      <EmptyPlot compact />
    </CompactBlueprintDrawing>
  );
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function EmptyWeek() {
  return (
    <>
      <g opacity="0.45" strokeWidth="0.85">
        <path d="M140 164H420V284H140Z M180 164V284 M300 164V284 M340 164V284 M380 164V284 M140 204H420 M140 244H420" />
      </g>
      <path d="M220 164V284 M260 164V284" />
      <path d="M228 152H252" />
    </>
  );
}

function BookingsStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M140 112V308 M420 112V308 M128 164H440 M128 284H440" />
      </g>
      <g strokeWidth="0.95">
        <EmptyWeek />
      </g>
      <g {...secondaryLine}>
        <path d="M140 112V90 M420 112V90" />
        <HorizontalDimension label="7 days" x1={140} x2={420} y={84} />
        <path d="M436 164H448 M436 284H448" />
        <VerticalDimension label="3 h" x={456} y1={164} y2={284} />
        <path d="M220 298V322 M260 298V322" />
        <HorizontalDimension label="Today" x1={220} x2={260} y={328} />
      </g>
      <g
        fill="currentColor"
        fontSize="11"
        opacity="0.72"
        stroke="none"
        textAnchor="middle"
      >
        {weekdays.map((day, index) => (
          <text key={day} x={160 + index * 40} y="144">
            {day}
          </text>
        ))}
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        {["09:00", "10:00", "11:00", "12:00"].map((time, index) => (
          <text key={time} textAnchor="end" x="124" y={168 + index * 40}>
            {time}
          </text>
        ))}
      </g>
      <text
        fill="currentColor"
        fontSize="11"
        opacity="0.72"
        stroke="none"
        textAnchor="middle"
        x="280"
        y="376"
      >
        0 bookings
      </text>
      <Registration />
    </BlueprintDrawing>
  );
}

function BookingsCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 208]} scale={0.28}>
      <EmptyWeek />
      {[160, 200, 280, 320, 360, 400].map((x) => (
        <path d={`M${x - 3} 140h6`} key={x} opacity="0.45" />
      ))}
    </CompactBlueprintDrawing>
  );
}

function ImageBounds({ dash = "4 6" }: { dash?: string }) {
  return (
    <>
      <path d="M160 168V120H208 M352 120H400V168 M400 252V300H352 M208 300H160V252" />
      <path
        d="M208 120H352 M400 168V252 M352 300H208 M160 252V168"
        opacity="0.38"
        strokeDasharray={dash}
        strokeWidth="0.65"
      />
      <path d="M160 300 400 120" opacity="0.5" strokeWidth="0.65" />
      <path d="M388 300V288H400" opacity="0.5" strokeWidth="0.65" />
    </>
  );
}

function ImageStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.1" strokeWidth="0.6">
        <path d="M160 104V316 M400 104V316 M144 120H416 M144 300H416" />
      </g>
      <g strokeWidth="1">
        <ImageBounds />
      </g>
      <g {...secondaryLine}>
        <path d="M160 104V78 M400 104V78" />
        <HorizontalDimension label="4u" x1={160} x2={400} y={72} />
        <path d="M416 120H440 M416 300H440" />
        <VerticalDimension label="3u" x={448} y1={120} y2={300} />
        <path d="M160 324V344 M220 324V344" />
        <HorizontalDimension label="u" x1={160} x2={220} y={350} />
        <path d="M272 210h16 M280 202v16" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="288" y="350">
          Image / 4 : 3
        </text>
      </g>
      <Registration />
    </BlueprintDrawing>
  );
}

function ImageCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 210]} scale={0.3}>
      <ImageBounds dash="2 2" />
    </CompactBlueprintDrawing>
  );
}

export const contentStateStudies: IllustrationStudy[] = [
  {
    id: "state-search",
    code: "S03",
    title: "A search, unanswered",
    description:
      "A query projects into the missing position of an ordered index. The surrounding records exist; the requested one does not.",
    category: "Empty states",
    illustration: <SearchStudy />,
    emptyState: {
      title: "No results found",
      description: "Try a different search term or remove a filter.",
      illustration: <SearchCompact />,
    },
  },
  {
    id: "state-notifications",
    code: "S05",
    title: "A stream, caught up",
    description:
      "Read entries occupy an evenly spaced notification stream. Its next position remains open, with no unread entry to continue it.",
    category: "Empty states",
    illustration: <NotificationsStudy />,
    emptyState: {
      title: "No notifications",
      description: "You’re all caught up. New activity will appear here.",
      illustration: <NotificationsCompact />,
    },
  },
  {
    id: "state-files",
    code: "S06",
    title: "A page, unwritten",
    description:
      "A blank writing area repeats the page’s 1 : √2 proportion. Equal side margins locate the cursor before the first line exists.",
    category: "Empty states",
    illustration: <FilesStudy />,
    emptyState: {
      title: "No documents yet",
      description: "Create a document to start writing.",
      illustration: <FilesCompact />,
    },
  },
  {
    id: "state-data",
    code: "S07",
    title: "A field without observations",
    description:
      "Calibrated axes establish a coordinate field. Its units are defined, but no observation occupies a coordinate.",
    category: "Empty states",
    illustration: <DataStudy />,
    emptyState: {
      title: "No data yet",
      description: "Data will appear once activity is recorded.",
      illustration: <DataCompact />,
    },
  },
  {
    id: "state-bookings",
    code: "S13",
    title: "A week, unbooked",
    description:
      "Seven days share a measured hour grid. Today has its place in the week; the time field contains no bookings.",
    category: "Empty states",
    illustration: <BookingsStudy />,
    emptyState: {
      title: "No upcoming bookings",
      description: "Share your booking link to start receiving meetings.",
      illustration: <BookingsCompact />,
    },
  },
  {
    id: "state-image",
    code: "S14",
    title: "An image, not yet placed",
    description:
      "Crop corners establish a 4 : 3 image area. The diagonal and unit measurements define its proportions while the image itself is absent.",
    category: "Empty states",
    illustration: <ImageStudy />,
    emptyState: {
      title: "No image",
      description: "Drop an image here or browse your files.",
      illustration: <ImageCompact />,
    },
  },
];
