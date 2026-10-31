const coreHatch =
  "M0 12 12 0 M0 24 24 0 M0 36 36 0 M0 48 48 0 M12 48 48 12 M24 48 48 24 M36 48 48 36";

// H1 identifies only the square core face.
// Endpoints are clipped to the existing boundaries; no material is implied.
export function ProductionChainHatching({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={coreHatch}
      opacity="0.27"
      strokeLinecap="butt"
      strokeWidth="0.65"
      transform={`translate(${x} ${y})`}
    />
  );
}
