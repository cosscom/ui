export type Point = readonly [number, number];
export type Rect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;
export type Role =
  | "primary"
  | "secondary"
  | "dimension"
  | "leader"
  | "guide"
  | "grid"
  | "hatch"
  | "section"
  | "centerline"
  | "hidden"
  | "absent"
  | "proposed"
  | "transfer";

export const standard: Readonly<{
  tokens: Readonly<Record<`--plotter-${string}`, number>>;
  roles: Readonly<
    Record<
      Role,
      Readonly<{
        width: `--plotter-${string}`;
        opacity: `--plotter-${string}`;
        dash: string;
        label?: string;
        use?: string;
      }>
    >
  >;
  geometry: Readonly<{
    arrow: Readonly<{ legLength: number; angle: number }>;
    dimension: Readonly<{ slashExtent: number; labelClearance: number }>;
    hatch: Readonly<{ edgePitch: number }>;
  }>;
}>;
export const roleCss: string;

/** A tip-first shaft and separate solid open head, in SVG coordinates. */
export function arrow(input: { kind: "line"; from: Point; to: Point }): {
  shaftD: string;
  headD: string;
};

/** Clearance already includes the intended space around the actual label bounds. */
export function dimension(input: {
  axis: "x" | "y";
  witnesses: readonly [Point, Point];
  position: number;
  extensions: { gap: number; overshoot: number };
  label: { text: string; anchor: Point; clearance?: Rect };
}): {
  witnessD: string;
  lineD: string;
  slashD: string;
  label: { text: string; anchor: Point };
};

/** Phase offsets local edge intercepts in SVG units; H2 mirrors H1 vertically. */
export function hatch(input: {
  region: Rect & { kind: "rect" };
  pattern: "H1" | "H2";
  phase?: number;
}): { d: string };
