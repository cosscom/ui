import { standard } from "./standard.mjs";

export { roleCss, standard } from "./standard.mjs";

function finite(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function point(value, name) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError(`${name} must be an [x, y] point.`);
  }
  return value.map((coordinate, axis) =>
    finite(coordinate, `${name}[${axis}]`),
  );
}

function nonnegative(value, name) {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} cannot be negative.`);
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive.`);
  return value;
}

function number(value) {
  return String(Number(finite(value, "Computed coordinate").toFixed(6)));
}

function coordinates([x, y]) {
  return `${number(x)} ${number(y)}`;
}

function segment(from, to) {
  return `M${coordinates(from)}L${coordinates(to)}`;
}

export function arrow({ kind, from, to }) {
  if (kind !== "line")
    throw new RangeError("Only straight line arrows are supported.");
  const start = point(from, "from");
  const tip = point(to, "to");
  const dx = tip[0] - start[0];
  const dy = tip[1] - start[1];
  const length = positive(Math.hypot(dx, dy), "Arrow length");
  const unit = [dx / length, dy / length];
  const { legLength, angle } = standard.geometry.arrow;
  const along = legLength * Math.cos((angle * Math.PI) / 180);
  const across = legLength * Math.sin((angle * Math.PI) / 180);
  const corners = [-1, 1].map((side) => [
    tip[0] - along * unit[0] + side * across * unit[1],
    tip[1] - along * unit[1] - side * across * unit[0],
  ]);
  return {
    shaftD: segment(tip, start),
    headD: `M${coordinates(corners[0])}L${coordinates(tip)}L${coordinates(corners[1])}`,
  };
}

export function dimension({ axis, witnesses, position, extensions, label }) {
  if (axis !== "x" && axis !== "y") {
    throw new RangeError('Dimension axis must be "x" or "y".');
  }
  if (!Array.isArray(witnesses) || witnesses.length !== 2) {
    throw new TypeError("A dimension needs two feature witnesses.");
  }
  const ends = witnesses.map((witness, i) => point(witness, `witnesses[${i}]`));
  const along = axis === "x" ? 0 : 1;
  const across = 1 - along;
  const start = ends[0][along];
  const end = ends[1][along];
  if (start >= end)
    throw new RangeError(
      "Dimension witnesses must be in increasing axis order.",
    );
  finite(position, "position");
  const gap = nonnegative(extensions.gap, "extensions.gap");
  const overshoot = nonnegative(extensions.overshoot, "extensions.overshoot");
  if (typeof label.text !== "string")
    throw new TypeError("Dimension label text must be a string.");
  const anchor = point(label.anchor, "label.anchor");
  const onLine = (value) =>
    axis === "x" ? [value, position] : [position, value];
  const witnessD = ends
    .map((witness) => {
      const distance = position - witness[across];
      if (Math.abs(distance) < gap || distance === 0) {
        throw new RangeError(
          "A dimension line must leave room for its witness gap.",
        );
      }
      const direction = Math.sign(distance);
      const from = [...witness];
      const to = [...witness];
      from[across] += direction * gap;
      to[across] = position + direction * overshoot;
      return segment(from, to);
    })
    .join(" ");

  let spans = [[start, end]];
  if (label.clearance) {
    const { x, y, width, height } = label.clearance;
    finite(x, "label.clearance.x");
    finite(y, "label.clearance.y");
    positive(width, "label.clearance.width");
    positive(height, "label.clearance.height");
    const low = [x, y];
    const high = [x + width, y + height];
    if (position >= low[across] && position <= high[across]) {
      const cutStart = Math.max(start, low[along]);
      const cutEnd = Math.min(end, high[along]);
      if (cutStart < cutEnd) {
        spans = [
          [start, cutStart],
          [cutEnd, end],
        ].filter(([a, b]) => a < b);
        if (!spans.length) {
          throw new RangeError(
            "The label clearance consumes the dimension; move the label outside it.",
          );
        }
      }
    }
  }

  const halfSlash = standard.geometry.dimension.slashExtent / 2;
  const slashD = [onLine(start), onLine(end)]
    .map(([x, y]) =>
      segment([x - halfSlash, y + halfSlash], [x + halfSlash, y - halfSlash]),
    )
    .join(" ");
  return {
    witnessD,
    lineD: spans.map(([a, b]) => segment(onLine(a), onLine(b))).join(" "),
    slashD,
    label: { text: label.text, anchor },
  };
}

export function hatch({ region, pattern, phase = 0 }) {
  if (region.kind !== "rect")
    throw new RangeError("Only rectangular hatch regions are supported.");
  if (pattern !== "H1" && pattern !== "H2")
    throw new RangeError('Hatch pattern must be "H1" or "H2".');
  const x = finite(region.x, "region.x");
  const y = finite(region.y, "region.y");
  const width = positive(region.width, "region.width");
  const height = positive(region.height, "region.height");
  finite(phase, "phase");
  const pitch = positive(standard.geometry.hatch.edgePitch, "Hatch edge pitch");
  const offset = ((phase % pitch) + pitch) % pitch;
  const segments = [];
  // Intercepts are local to the rectangle. H2 reflects H1 about its horizontal midpoint.
  for (let intercept = offset; intercept < width + height; intercept += pitch) {
    const left = [Math.max(0, intercept - height), Math.min(height, intercept)];
    const right = [Math.min(width, intercept), Math.max(0, intercept - width)];
    if (left[0] === right[0] && left[1] === right[1]) continue;
    const translate = ([a, b]) => [
      x + a,
      y + (pattern === "H1" ? b : height - b),
    ];
    segments.push(segment(translate(left), translate(right)));
  }
  return { d: segments.join(" ") };
}
