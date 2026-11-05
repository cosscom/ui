export type AssemblyPart = 0 | 1 | 2;
export type Edge = "top" | "right" | "bottom" | "left";
export type Corner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
export type AssemblyAxis = "vertical" | "horizontal";
export type ModuleGeometry = {
  width: number;
  height: number;
  radius: number;
  x: number;
  y: number;
  targetWidth?: number;
  targetHeight?: number;
};

const circleControl = 0.5522847498;
const samplingRate = 60;
export const jointDuration = 0.22;

export function travel(part: AssemblyPart) {
  const start = 0.45 + (2 - part) * 0.32;
  return { start, end: start + 0.9 };
}

export function easing(progress: number) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 32; iteration++) {
    const position = (low + high) / 2;
    const inverse = 1 - position;
    const x =
      3 * inverse * inverse * position * 0.4 +
      3 * inverse * position * position * 0.2 +
      position * position * position;
    if (x < progress) low = position;
    else high = position;
  }

  const position = (low + high) / 2;
  return 3 * (1 - position) * position * position + position ** 3;
}

export function jointNeighbor(
  axis: AssemblyAxis,
  part: AssemblyPart,
  edge: Edge,
): AssemblyPart | undefined {
  const previous = axis === "vertical" ? "top" : "left";
  const next = axis === "vertical" ? "bottom" : "right";
  if (edge === previous && part > 0) return (part - 1) as AssemblyPart;
  if (edge === next && part < 2) return (part + 1) as AssemblyPart;
  return undefined;
}

export function jointTime(part: AssemblyPart, neighbor: AssemblyPart) {
  return Math.max(travel(part).end, travel(neighbor).end);
}

function flightProgress(part: AssemblyPart, time: number) {
  const { start, end } = travel(part);
  return easing((time - start) / (end - start));
}

export function sizeAt(
  module: ModuleGeometry,
  part: AssemblyPart,
  time: number,
) {
  const progress = flightProgress(part, time);
  return {
    width:
      module.width +
      ((module.targetWidth ?? module.width) - module.width) * progress,
    height:
      module.height +
      ((module.targetHeight ?? module.height) - module.height) * progress,
    radius: module.radius + (8 - module.radius) * progress,
    progress,
  };
}

export function positionAt(
  modules: readonly ModuleGeometry[],
  _axis: AssemblyAxis,
  part: AssemblyPart,
  time: number,
) {
  const module = modules[part];
  if (!module) throw new Error(`Missing assembly module ${part}`);
  const progress = flightProgress(part, time);
  const sourceX = 140 + part * 140 - module.width / 2;
  const sourceY = 124 - module.height / 2;
  return {
    x: sourceX + (module.x - sourceX) * progress,
    y: sourceY + (module.y - sourceY) * progress,
  };
}

function coordinate(value: number) {
  return Number(value.toFixed(4));
}

export function outlineAt(
  modules: readonly ModuleGeometry[],
  axis: AssemblyAxis,
  part: AssemblyPart,
  time: number,
): Record<Edge | Corner, string> {
  const module = modules[part];
  if (!module) throw new Error(`Missing assembly module ${part}`);
  const { width, height, radius } = sizeAt(module, part, time);

  function corner(edge: Edge) {
    const neighbor = jointNeighbor(axis, part, edge);
    if (neighbor === undefined) return radius;
    const contact = jointTime(part, neighbor);
    return radius * (1 - easing((time - contact) / jointDuration));
  }

  const topLeft = corner(axis === "vertical" ? "top" : "left");
  const topRight = corner(axis === "vertical" ? "top" : "right");
  const bottomRight = corner(axis === "vertical" ? "bottom" : "right");
  const bottomLeft = corner(axis === "vertical" ? "bottom" : "left");
  const point = (x: number, y: number) => `${coordinate(x)} ${coordinate(y)}`;

  // Separate arcs stay primary while only the straight mating edges become dividers.
  return {
    top: `M${point(topLeft, 0)} L${point(width - topRight, 0)}`,
    right: `M${point(width, topRight)} L${point(width, height - bottomRight)}`,
    bottom: `M${point(width - bottomRight, height)} L${point(bottomLeft, height)}`,
    left: `M${point(0, height - bottomLeft)} L${point(0, topLeft)}`,
    topLeft: `M${point(0, topLeft)} C${point(0, topLeft * (1 - circleControl))} ${point(topLeft * (1 - circleControl), 0)} ${point(topLeft, 0)}`,
    topRight: `M${point(width - topRight, 0)} C${point(width - topRight * (1 - circleControl), 0)} ${point(width, topRight * (1 - circleControl))} ${point(width, topRight)}`,
    bottomRight: `M${point(width, height - bottomRight)} C${point(width, height - bottomRight * (1 - circleControl))} ${point(width - bottomRight * (1 - circleControl), height)} ${point(width - bottomRight, height)}`,
    bottomLeft: `M${point(bottomLeft, height)} C${point(bottomLeft * (1 - circleControl), height)} ${point(0, height - bottomLeft * (1 - circleControl))} ${point(0, height - bottomLeft)}`,
  };
}

function addSamples(times: Set<number>, start: number, end: number) {
  times.add(Number(start.toFixed(9)));
  for (let sample = 1; start + sample / samplingRate < end; sample++) {
    times.add(Number((start + sample / samplingRate).toFixed(9)));
  }
  times.add(Number(end.toFixed(9)));
}

export function sampleTimes(parts: readonly AssemblyPart[]) {
  const times = new Set([0, 5.4]);
  for (const part of parts) {
    const { start, end } = travel(part);
    addSamples(times, start, end);
  }
  return [...times].sort((a, b) => a - b);
}

export function outlineTimes(
  _modules: readonly ModuleGeometry[],
  axis: AssemblyAxis,
  part: AssemblyPart,
): number[] {
  const participating: AssemblyPart[] = [part];
  const edges: Edge[] =
    axis === "vertical" ? ["top", "bottom"] : ["left", "right"];
  for (const edge of edges) {
    const neighbor = jointNeighbor(axis, part, edge);
    if (neighbor !== undefined) participating.push(neighbor);
  }
  const times = new Set(sampleTimes(participating));
  for (const edge of edges) {
    const neighbor = jointNeighbor(axis, part, edge);
    if (neighbor === undefined) continue;
    const contact = jointTime(part, neighbor);
    addSamples(times, contact, contact + jointDuration);
  }
  return [...times].sort((a, b) => a - b);
}
