import { BlueprintDrawing, CompactBlueprintDrawing } from "./blueprint-drawing";
import { HorizontalDimension, VerticalDimension } from "./dimensions";
import type { IllustrationStudy } from "./study-types";

// The cloud’s three generating circles share the y = 200 baseline. The route
// has a 40-unit centerline radius and stops 32 units before its continuation.
function CloudForm() {
  return (
    <>
      <path d="M220 200A30 30 0 1 1 232.87 142.9A48 48 0 0 1 323.61 131.94A36 36 0 1 1 340 200Z" />
      <path d="M136 328H240A32 32 0 0 0 272 296V268H288V296A48 48 0 0 1 240 344H136" />
    </>
  );
}

function CloudGap({ dash }: { dash: string }) {
  return (
    <>
      <path
        d="M272 236V200 M288 236V200 M272 236H288"
        opacity="0.38"
        strokeDasharray={dash}
        strokeWidth="0.75"
      />
      <path
        d="M267 273 293 263 M267 241 293 231"
        opacity="0.72"
        strokeWidth="0.8"
      />
    </>
  );
}

function OfflineStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M188 200H372 M240 280V360 M120 328H256 M120 344H256" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path
          d="M232.87 142.9A30 30 0 0 1 220 200 M323.61 131.94A48 48 0 1 1 232.87 142.9 M340 200A36 36 0 0 1 323.61 131.94"
          strokeDasharray="3 6"
        />
        <path
          d="M240 256A40 40 0 0 1 280 296 M200 296A40 40 0 0 1 240 256"
          strokeDasharray="3 6"
        />
        <path d="M214 170H226 M220 164V176 M274 152H286 M280 146V158 M334 164H346 M340 158V170 M234 296H246 M240 290V302" />
        <path d="M136 336H240A40 40 0 0 0 280 296V276" strokeDasharray="3 5" />
      </g>
      <g strokeWidth="0.95">
        <CloudForm />
      </g>
      <CloudGap dash="3 5" />
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M240 296 268.28 324.28m-6 0h6v-6" />
        <path d="M296 268H322 M296 236H322" />
        <VerticalDimension label="32" x={328} y1={236} y2={268} />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="136" y="314">
          This device
        </text>
        <text x="350" y="278">
          No connection
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="250" y="294">
          R40
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function OfflineCompact() {
  return (
    <CompactBlueprintDrawing center={[256, 224]} scale={0.36}>
      <CloudForm />
      <CloudGap dash="2 2" />
    </CompactBlueprintDrawing>
  );
}

function LockForm() {
  return (
    <>
      <path d="M248 224V176A40 40 0 0 1 328 176V224 M264 224V176A24 24 0 0 1 312 176V224" />
      <rect height="112" rx="16" width="128" x="224" y="224" />
      <path d="M284 279.17A10 10 0 1 1 292 279.17V300H284Z" />
    </>
  );
}

function AccessRoute({ dash }: { dash: string }) {
  return (
    <>
      <path d="M104 272H224 M104 288H224" />
      <path
        d="M352 272H448 M352 288H448"
        opacity="0.38"
        strokeDasharray={dash}
      />
    </>
  );
}

function LockInset() {
  return <rect height="80" width="96" x="240" y="240" />;
}

function AccessStudy() {
  return (
    <BlueprintDrawing>
      <g transform="translate(0 -24)">
        <g opacity="0.12" strokeWidth="0.6">
          <path d="M208 224H368 M208 336H368 M224 208V356 M352 208V356" />
          <path d="M272 252V308H304V252Z" />
        </g>
        <g opacity="0.3" strokeWidth="0.65">
          <path d="M288 116V204 M232 176H344" strokeDasharray="4 6" />
          <path d="M248 176A40 40 0 0 0 328 176" strokeDasharray="3 6" />
          <path d="M224 240A16 16 0 1 0 240 224" strokeDasharray="3 5" />
          <path
            d="M288 224V252 M288 308V336 M240 280H272 M304 280H336"
            strokeDasharray="3 5"
          />
          <path d="M272 270H278 M298 270H304 M284 252V258 M292 252V258 M284 304V308 M292 304V308" />
        </g>
        <g opacity="0.5" strokeWidth="0.65">
          <LockInset />
        </g>
        <g strokeWidth="0.95">
          <AccessRoute dash="3 5" />
          <LockForm />
        </g>
        <g opacity="0.5" strokeWidth="0.65">
          <path d="M208 280H160" strokeDasharray="4 6" />
          <path d="M203.76 275.76 208 280 203.76 284.24" />
          <path d="M288 176 316.28 147.72m-6 0h6v6" />
          <path d="M240 240 228.69 228.69m6 0h-6v6" />
          <path d="M224 344V366 M352 344V366" />
          <HorizontalDimension label="4u" x1={224} x2={352} y={360} />
          <path d="M248 208H264 M248 202v12 M264 202v12" />
          <path d="M284 306V316 M292 306V316 M284 312H292" />
        </g>
        <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
          <text x="104" y="258">
            Request
          </text>
          <text x="374" y="258">
            Protected
          </text>
        </g>
        <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
          <text x="328" y="143">
            R40
          </text>
          <text textAnchor="end" x="216" y="235">
            R16
          </text>
          <text textAnchor="end" x="240" y="211.5">
            16
          </text>
          <text x="308" y="271">
            Ø20
          </text>
          <text x="300" y="315">
            8
          </text>
          <text textAnchor="middle" x="288" y="388">
            Closed boundary
          </text>
        </g>
      </g>
    </BlueprintDrawing>
  );
}

function AccessCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 236]} scale={0.25}>
      <AccessRoute dash="2 2" />
      <g opacity="0.35">
        <LockInset />
      </g>
      <LockForm />
    </CompactBlueprintDrawing>
  );
}

function EnvelopeForm() {
  return (
    <>
      <path d="M160 168 280 88 400 168V312H160Z" />
      <path d="M160 312 280 264 400 312" opacity="0.65" />
    </>
  );
}

function EnvelopeFolds({ dash }: { dash: string }) {
  return (
    <g opacity="0.38" strokeDasharray={dash}>
      <path d="M160 168H400" />
      <path d="M160 168 280 248 400 168" />
    </g>
  );
}

function EmailStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M144 88H416 M160 72V160 M400 72V160 M144 168H152 M408 168H424" />
        <path d="M144 312H416" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M280 72V80 M280 96V240 M280 256V320" strokeDasharray="4 6" />
      </g>
      <g strokeWidth="0.95">
        <EnvelopeForm />
      </g>
      <g strokeWidth="0.65">
        <EnvelopeFolds dash="3 5" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M160 320V358 M400 320V358" />
        <HorizontalDimension label="3u" x1={160} x2={400} y={352} />
        <path d="M408 88H446 M408 168H446 M408 248H446" opacity="0.6" />
        <VerticalDimension label="u" x={440} y1={88} y2={168} />
        <VerticalDimension label="u" x={440} y1={168} y2={248} />
        <path d="M272 168V160H280" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="end" x="144" y="171.5">
          Fold
        </text>
        <text textAnchor="middle" x="280" y="388">
          One crease / two positions
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function EmailCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 200]} scale={0.32}>
      <EnvelopeForm />
      <EnvelopeFolds dash="2 2" />
    </CompactBlueprintDrawing>
  );
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
}

function gearOutline({
  cx,
  cy,
  teeth,
  root,
  tip,
  phase,
}: {
  cx: number;
  cy: number;
  teeth: number;
  root: number;
  tip: number;
  phase: number;
}) {
  const step = 360 / teeth;
  const tipHalf = step * 0.14;
  const rootHalf = step * 0.34;
  const at = (radius: number, degrees: number) =>
    polar(cx, cy, radius, degrees);
  const segments = Array.from({ length: teeth }, (_, index) => {
    const angle = phase + index * step;
    return `L${at(tip, angle - tipHalf)}A${tip} ${tip} 0 0 1 ${at(tip, angle + tipHalf)}L${at(root, angle + rootHalf)}A${root} ${root} 0 0 1 ${at(root, angle + step - rootHalf)}`;
  });
  return `M${at(root, phase - rootHalf)}${segments.join("")}Z`;
}

// A shared module gives pitch radii 72, 48 and 36 for 12, 8 and 6 teeth.
// The small pair’s pitch circles are tangent at (372, 172). The drive sits
// 40 units outside mesh; the schematic teeth have 2 units of tip clearance.
const gears = [
  {
    cx: 212,
    cy: 220,
    pitch: 72,
    teeth: 12,
    root: 64,
    tip: 78,
    phase: 0,
    hub: 18,
  },
  {
    cx: 372,
    cy: 220,
    pitch: 48,
    teeth: 8,
    root: 40,
    tip: 54,
    phase: 22.5,
    hub: 12,
  },
  {
    cx: 372,
    cy: 136,
    pitch: 36,
    teeth: 6,
    root: 28,
    tip: 42,
    phase: 30,
    hub: 9,
  },
];

function GearsForm() {
  return (
    <>
      {gears.map((gear) => (
        <g key={gear.teeth}>
          <path d={gearOutline(gear)} />
          <circle cx={gear.cx} cy={gear.cy} r={gear.hub} />
        </g>
      ))}
    </>
  );
}

function MaintenanceStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.3" strokeWidth="0.65">
        {gears.map((gear) => (
          <circle
            cx={gear.cx}
            cy={gear.cy}
            key={gear.teeth}
            r={gear.pitch}
            strokeDasharray="3 6"
          />
        ))}
        <path
          d="M112 220H194 M230 220H360 M384 220H444 M212 124V202 M212 238V316 M372 80V127 M372 145V208 M372 232V292 M320 136H363 M381 136H424"
          strokeDasharray="4 6"
        />
      </g>
      <g strokeWidth="0.95">
        <GearsForm />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M199.27 207.27 161.09 169.09m6 0h-6v6 M380.49 211.51 405.94 186.06m-6 0h6v6" />
        <path d="M284 228V330 M324 228V330" opacity="0.6" />
        <HorizontalDimension label="40" x1={284} x2={324} y={324} />
        <path d="M284 214v12 M324 214v12 M368 172h8" />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="304" y="356">
          Drive disengaged
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text textAnchor="end" x="152" y="160">
          R72
        </text>
        <text x="416" y="178">
          R48
        </text>
        <text textAnchor="middle" x="372" y="78">
          6 teeth
        </text>
        <text textAnchor="middle" x="304" y="378">
          One pitch / 12 : 8 : 6
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function MaintenanceCompact() {
  return (
    <CompactBlueprintDrawing center={[280, 200]} scale={0.3}>
      <GearsForm />
      <path d="M292 220H316" opacity="0.4" strokeDasharray="2 2" />
    </CompactBlueprintDrawing>
  );
}

const wallHatch = Array.from(
  { length: 11 },
  (_, index) => `M432 ${144 + index * 16}l16-16`,
).join(" ");

function PlugForm() {
  return (
    <>
      <rect height="96" rx="12" width="96" x="136" y="172" />
      <path d="M80 214H136 M80 226H136 M232 188H272V200H232 M232 240H272V252H232" />
      <path d="M432 172H348A12 12 0 0 0 336 184V188 M336 200V240 M336 252V256A12 12 0 0 0 348 268H432" />
      <path d="M432 128V312" />
    </>
  );
}

function SocketRecesses({ dash }: { dash: string }) {
  return (
    <path
      d="M336 188H376V200H336 M336 240H376V252H336"
      opacity="0.38"
      strokeDasharray={dash}
    />
  );
}

function DisconnectedStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M120 172H424 M120 268H424" />
      </g>
      <g opacity="0.28" strokeWidth="0.65">
        <path d="M56 214H80 M56 226H80" strokeDasharray="3 5" />
        <path d={wallHatch} />
      </g>
      <g strokeWidth="0.95">
        <PlugForm />
      </g>
      <g strokeWidth="0.75">
        <SocketRecesses dash="3 5" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M320 194H272 M320 246H272" strokeDasharray="4 6" />
        <path d="M315.76 189.76 320 194 315.76 198.24 M315.76 241.76 320 246 315.76 250.24" />
        <path d="M272 180V130 M336 164V130" opacity="0.6" />
        <HorizontalDimension label="64" x1={272} x2={336} y={136} />
        <path d="M380 194H406 M380 246H406" opacity="0.6" />
        <VerticalDimension label="52" x={400} y1={194} y2={246} />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text textAnchor="middle" x="304" y="110">
          Disconnected
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function DisconnectedCompact() {
  return (
    <CompactBlueprintDrawing center={[264, 220]} scale={0.24}>
      <PlugForm />
      <SocketRecesses dash="2 2" />
      <path d="M272 194H336 M272 246H336" opacity="0.4" strokeDasharray="2 2" />
      <path
        d="M432 160l12-12 M432 192l12-12 M432 224l12-12 M432 256l12-12 M432 288l12-12"
        opacity="0.3"
      />
    </CompactBlueprintDrawing>
  );
}

// R40 sides meet a tip 76 below the head center. The tangent points sit
// 21.0526 below that center and 34.0116 to either side.
function PinForm() {
  return (
    <>
      <path d="M304 252 269.99 197.05A40 40 0 1 1 338.01 197.05Z" />
      <circle cx="304" cy="176" r="14" />
    </>
  );
}

function CoordinateField({
  dash,
  arrowheads = false,
}: {
  dash: string;
  arrowheads?: boolean;
}) {
  return (
    <g opacity="0.4">
      <path d="M144 168V284H288 M320 284H448" />
      <circle cx="304" cy="284" r="16" strokeDasharray={dash} />
      <path d="M304 300V312" />
      {arrowheads && (
        <path d="M443.76 279.76 448 284 443.76 288.24 M139.76 172.24 144 168 148.24 172.24" />
      )}
    </g>
  );
}

function LocationStudy() {
  return (
    <BlueprintDrawing>
      <g opacity="0.12" strokeWidth="0.6">
        <path d="M144 176H256 M352 176H448 M264 120V224 M344 120V224" />
        <path d="M144 216H256 M352 216H448" />
      </g>
      <g opacity="0.3" strokeWidth="0.65">
        <path
          d="M269.99 197.05A40 40 0 0 0 338.01 197.05"
          strokeDasharray="3 6"
        />
        <path
          d="M304 120V162 M264 176H290 M318 176H344"
          strokeDasharray="4 6"
        />
      </g>
      <g strokeWidth="0.95">
        <PinForm />
      </g>
      <g strokeWidth="0.75">
        <CoordinateField arrowheads dash="3 5" />
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        <path d="M304 264V256" />
        <path d="M299.76 259.76 304 264 308.24 259.76" />
        <path d="M313.9 166.1 332.28 147.72m-6 0h6v6" />
        <path d="M144 292V338 M304 320V338" opacity="0.6" />
        <HorizontalDimension label="4u" x1={144} x2={304} y={332} />
      </g>
      <g fill="currentColor" fontSize="11" opacity="0.72" stroke="none">
        <text x="332" y="312">
          Not set
        </text>
      </g>
      <g fill="currentColor" fontSize="10" opacity="0.5" stroke="none">
        <text x="344" y="145">
          R40
        </text>
        <text x="460" y="287.5">
          x
        </text>
        <text textAnchor="end" x="132" y="171.5">
          y
        </text>
        <text textAnchor="end" x="136" y="301">
          0
        </text>
      </g>
    </BlueprintDrawing>
  );
}

function LocationCompact() {
  return (
    <CompactBlueprintDrawing center={[296, 234]} scale={0.28}>
      <PinForm />
      <CoordinateField dash="2 2" />
      <path d="M304 256V264" opacity="0.4" />
    </CompactBlueprintDrawing>
  );
}

export const systemStateStudies: IllustrationStudy[] = [
  {
    id: "state-offline",
    code: "S04",
    title: "A cloud, out of reach",
    description:
      "A curved connection stops before the cloud. Its separated continuation and measured gap make the missing route visible.",
    category: "Empty states",
    illustration: <OfflineStudy />,
    emptyState: {
      title: "You’re offline",
      description: "Changes will sync when your connection returns.",
      illustration: <OfflineCompact />,
    },
  },
  {
    id: "state-access",
    code: "S08",
    title: "A boundary, locked",
    description:
      "A closed lock interrupts the access route. Its corner radius sets the inset, while a separate construction field locates the keyhole without crossing it.",
    category: "Empty states",
    illustration: <AccessStudy />,
    emptyState: {
      title: "Access restricted",
      description: "Ask a workspace owner to grant you access.",
      illustration: <AccessCompact />,
    },
  },
  {
    id: "state-email",
    code: "S09",
    title: "An envelope, unfolded",
    description:
      "An open flap mirrors its folded position across one crease. Equal offsets and the pocket’s diagonals explain the envelope as a flat construction.",
    category: "Empty states",
    illustration: <EmailStudy />,
    emptyState: {
      title: "Check your email",
      description: "We sent a sign-in link to your inbox.",
      illustration: <EmailCompact />,
    },
  },
  {
    id: "state-maintenance",
    code: "S10",
    title: "A gear train, interrupted",
    description:
      "Three gears share one tooth pitch. The two smaller gears engage, while a 40-unit pitch-circle gap keeps the main drive disconnected.",
    category: "Empty states",
    illustration: <MaintenanceStudy />,
    emptyState: {
      title: "Under maintenance",
      description: "Settings are temporarily unavailable. Check back soon.",
      illustration: <MaintenanceCompact />,
    },
  },
  {
    id: "state-disconnected",
    code: "S11",
    title: "A connection, apart",
    description:
      "A mobile plug aligns with a fixed socket in a hatched wall section. Two projected contact axes cross the measured gap between them.",
    category: "Empty states",
    illustration: <DisconnectedStudy />,
    emptyState: {
      title: "Integration disconnected",
      description: "Reconnect your account to resume syncing.",
      illustration: <DisconnectedCompact />,
    },
  },
  {
    id: "state-location",
    code: "S12",
    title: "A pin, unplaced",
    description:
      "A compact pin sits just above an unresolved point in a broad coordinate field. The measured horizontal offset locates the proposed position.",
    category: "Empty states",
    illustration: <LocationStudy />,
    emptyState: {
      title: "No location set",
      description: "Add an address so attendees know where to meet.",
      illustration: <LocationCompact />,
    },
  },
];
