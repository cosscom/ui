export function HorizontalDimension({
  x1,
  x2,
  y,
  label,
  labelOffset = 8,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  labelOffset?: number;
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
        y={y - labelOffset}
      >
        {label}
      </text>
    </>
  );
}
