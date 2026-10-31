import { hatch } from "../../skills/plotter/assets/foundation/index.mjs";

const coreHatch = hatch({
  region: { kind: "rect", x: 0, y: 0, width: 48, height: 48 },
  pattern: "H1",
});

// H1 identifies only the square core face.
// Endpoints are clipped to the existing boundaries; no material is implied.
export function ProductionChainHatching({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={coreHatch.d}
      data-plotter-role="hatch"
      strokeLinecap="butt"
      transform={`translate(${x} ${y})`}
    />
  );
}
