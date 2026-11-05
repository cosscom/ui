export function HorizontalDimension({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
}) {
  return (
    <>
      <path
        d={`M${x1} ${y}H${x2} M${x1} ${y - 6}v12 M${x2} ${y - 6}v12 M${x1 - 4} ${y + 4}l8-8 M${x2 - 4} ${y + 4}l8-8`}
      />
      <text
        fill="currentColor"
        fontSize="10"
        stroke="none"
        textAnchor="middle"
        x={(x1 + x2) / 2}
        y={y - 6}
      >
        {label}
      </text>
    </>
  );
}

export function VerticalDimension({
  x,
  y1,
  y2,
  label,
  side = "end",
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  side?: "start" | "end";
}) {
  return (
    <>
      <path
        d={`M${x} ${y1}V${y2} M${x - 6} ${y1}h12 M${x - 6} ${y2}h12 M${x - 4} ${y1 + 4}l8-8 M${x - 4} ${y2 + 4}l8-8`}
      />
      <text
        fill="currentColor"
        fontSize="10"
        stroke="none"
        textAnchor={side === "start" ? "end" : "start"}
        x={side === "start" ? x - 8 : x + 8}
        y={(y1 + y2) / 2 + 3.5}
      >
        {label}
      </text>
    </>
  );
}
