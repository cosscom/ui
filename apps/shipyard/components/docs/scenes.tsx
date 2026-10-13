"use client";

// A copy of the app's scenes (app/src/components/art/scenes.tsx), so the docs
// draw the same harbour as the app. Only the imports differ: keep the
// drawings in step with the app's when they change there.

import type * as React from "react";
import { useCallback, useId } from "react";

const cn = (...classes: unknown[]) => classes.filter(Boolean).join(" ");

// Scenes are Shipyard's small line drawings for quiet states, all in one
// drawing language: a 160 x 52 harbour, lines in currentColor (muted unless
// the caller says otherwise), and exactly one amber point, the logo's dot, as
// a buoy, a lamp or the sun. Motion is CSS only (transforms and opacity),
// slow, a pixel or two, and loops without a seam. It stops under reduced
// motion, pauses offscreen or while the window is hidden, rests after a few
// loops, and a scene behind an open dialog holds still so only one thing
// moves at a time.
//
//   ended        an empty berth: a slack line trails into the water. What ran here has left.
//   offline      fog, and the buoy's light turning slowly: the box is out of sight.
//   moored       a boat tied up at the jetty, riding the swell: ready to set off.
//   lighthouse   a beam sweeping open water: looking, and nothing found yet.
//   dawn         an empty harbour as the sun comes up: nothing here yet, a start.
//   setting-out  a boat under sail, leaving a wake: off to work.
//   rafted       boats tied alongside each other: many agents, together.
//   bottle       a message in a bottle, adrift: every message read.
//   calm         one buoy on still water, rings spreading: nothing needs you.
//   anchor       an anchor at rest on the seabed: switched off, waiting.
//   storm        rain and chop over the jetty, the buoy blinking: something broke.
//   chart        a chart with a dotted course to a lit mark: a route not yet sailed.
//   dock         a quay with a crane and an empty hook: nothing loaded yet.
export const SCENES = [
  "ended",
  "offline",
  "moored",
  "lighthouse",
  "dawn",
  "setting-out",
  "rafted",
  "bottle",
  "calm",
  "anchor",
  "storm",
  "chart",
  "dock",
] as const;
export type SceneName = (typeof SCENES)[number];

const W = 160;
const H = 52;
const TOP = 16;

// Scenes offscreen pause, from one shared observer. A window that is hidden
// pauses them all.
let observer: IntersectionObserver | undefined;
function watch(el: Element) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  observer ??= new IntersectionObserver((entries) => {
    for (const e of entries)
      e.target.toggleAttribute("data-off", !e.isIntersecting);
  });
  observer.observe(el);
  return () => observer?.unobserve(el);
}
if (typeof document !== "undefined") {
  const sync = () =>
    document.documentElement.toggleAttribute(
      "data-berth-hidden",
      document.hidden,
    );
  document.addEventListener("visibilitychange", sync);
}

// pivot turns about a point in the scene's own coordinates.
const pivot = (x: number, y: number, extra?: Record<string, string>) =>
  ({ transformOrigin: `${x}px ${y}px`, ...extra }) as React.CSSProperties;
const delay = (s: number) => ({ "--ba-delay": `${s}s` }) as React.CSSProperties;

// A scene moves for a few loops of its slowest parts, then rests where it
// is: an empty state left open all afternoon should not keep drawing. The
// pointer coming to it wakes it for another while.
const REST_AFTER = 30_000;
function rest(el: SVGSVGElement) {
  let timer = 0;
  const wake = () => {
    el.removeAttribute("data-rest");
    window.clearTimeout(timer);
    timer = window.setTimeout(
      () => el.setAttribute("data-rest", ""),
      REST_AFTER,
    );
  };
  wake();
  el.addEventListener("pointerenter", wake);
  return () => {
    window.clearTimeout(timer);
    el.removeEventListener("pointerenter", wake);
  };
}

export function Scene({
  name,
  width = 136,
  still,
  className,
}: {
  name: SceneName;
  width?: number;
  still?: boolean;
  className?: string;
}) {
  const id = `ba${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useCallback((el: SVGSVGElement | null) => {
    if (!el) return;
    const unwatch = watch(el);
    const unrest = rest(el);
    return () => {
      unwatch();
      unrest();
    };
  }, []);
  const Draw = DRAW[name];
  return (
    <svg
      ref={ref}
      aria-hidden
      data-scene={name}
      data-still={still || undefined}
      viewBox={`0 ${TOP} ${W} ${H}`}
      width={width}
      height={(width * H) / W}
      className={cn("berth-art shrink-0", className)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        {/* Water, fog and seabed fade out at both ends, so a scene has no edges. */}
        <linearGradient id={`${id}-fg`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" />
          <stop offset="0.82" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask
          id={`${id}-fade`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="-20"
          width={W}
          height="120"
        >
          <rect x="0" y="-20" width={W} height="120" fill={`url(#${id}-fg)`} />
        </mask>
      </defs>
      <Draw id={id} />
    </svg>
  );
}

type Draw = (p: { id: string }) => React.ReactElement;

// Wave is one line of water: a sine of period 12, drawn wider than the
// scene on the right so sliding it by `shift` (a whole number of periods, and
// of its dash pattern) loops without a seam.
function Wave({
  y,
  amp,
  dur,
  opacity,
  dash,
  shift = 12,
  reverse,
  width = 1.4,
}: {
  y: number;
  amp: number;
  dur: number;
  opacity: number;
  dash?: string;
  shift?: number;
  reverse?: boolean;
  width?: number;
}) {
  const P = 12;
  let d = `M${-P} ${y} q${P / 4} ${-amp} ${P / 2} 0`;
  for (let x = -P / 2; x < W + shift; x += P / 2) d += ` t${P / 2} 0`;
  return (
    <path
      d={d}
      opacity={opacity}
      strokeWidth={width}
      strokeDasharray={dash}
      className={dur ? cn("ba-wave", reverse && "ba-rev") : undefined}
      style={
        dur
          ? ({
              "--ba-d": `${dur}s`,
              "--ba-x": `${-shift}px`,
            } as React.CSSProperties)
          : undefined
      }
    />
  );
}

// Water is open water: one long swell, then broken lines further out.
// `mood` scales it: still water barely moves, a storm chops.
function Water({
  id,
  y = 49.4,
  mood = "open",
  lines = 3,
}: {
  id: string;
  y?: number;
  mood?: "open" | "still" | "calm" | "storm";
  lines?: number;
}) {
  const k = {
    open: { a: 1, t: 1 },
    still: { a: 1, t: 0 },
    calm: { a: 0.55, t: 1.6 },
    storm: { a: 1.9, t: 0.55 },
  }[mood];
  const t = (s: number) => (k.t ? s * k.t : 0);
  return (
    <g mask={`url(#${id}-fade)`} stroke="currentColor">
      <Wave y={y} amp={1.3 * k.a} dur={t(7)} opacity={0.72} />
      {lines > 1 && (
        <Wave
          y={y + 6.2}
          amp={1.1 * k.a}
          dur={t(11)}
          opacity={0.42}
          dash="16 8"
          shift={24}
          reverse
        />
      )}
      {lines > 2 && (
        <Wave
          y={y + 12.2}
          amp={1 * k.a}
          dur={t(15)}
          opacity={0.22}
          dash="6 10 14 6"
          shift={36}
        />
      )}
    </g>
  );
}

// Jetty is the deck, its pilings (fainter below the waterline) and, if
// asked, a cleat at the end.
function Jetty({
  to = 66,
  piles = [15, 33, 51],
  cleat = true,
}: {
  to?: number;
  piles?: number[];
  cleat?: boolean;
}) {
  const above = piles.map((x) => `M${x} 38 V48`).join(" ");
  const below = piles.map((x) => `M${x} 51.5 V60`).join(" ");
  return (
    <g stroke="currentColor">
      <path d={`M8 36 H${to}`} strokeWidth="2.8" />
      <path d={above} strokeWidth="2.4" />
      <path d={below} strokeWidth="2.4" opacity="0.26" />
      {cleat && (
        <path
          d={`M${to - 9.5} 31.2 H${to - 0.5} M${to - 5} 31.6 V34.4`}
          strokeWidth="2.3"
        />
      )}
    </g>
  );
}

function Fog({
  id,
  y = 21,
  opacity = 0.3,
}: {
  id: string;
  y?: number;
  opacity?: number;
}) {
  return (
    <g mask={`url(#${id}-fade)`} stroke="currentColor" strokeWidth="1.4">
      <path
        className="ba-fog"
        d={`M16 ${y} H144`}
        strokeDasharray="14 8"
        opacity={opacity}
      />
      <path
        className="ba-fog ba-rev"
        d={`M28 ${y + 6} H132`}
        strokeDasharray="8 9"
        opacity={opacity * 0.66}
      />
    </g>
  );
}

const Ended: Draw = ({ id }) => (
  <>
    <defs>
      <linearGradient
        id={`${id}-rope`}
        gradientUnits="userSpaceOnUse"
        x1="64"
        x2="104"
        y1="0"
        y2="0"
      >
        <stop offset="0" stopColor="currentColor" />
        <stop offset="0.65" stopColor="currentColor" stopOpacity="0.6" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <Jetty />
    {/* A slack line from the cleat, trailing off into the water. */}
    <path
      d="M63.5 32.2 C 69 45, 82 53.5, 104 50.5"
      stroke={`url(#${id}-rope)`}
      strokeWidth="1.4"
      strokeDasharray="2.4 1.5"
    />
    <g className="ba-buoy">
      <circle cx="124" cy="44.4" r="4.4" fill="var(--warning)" />
    </g>
    <path
      className="ba-glint"
      d="M120 53 H128"
      stroke="var(--warning)"
      strokeWidth="1.3"
    />
    <Water id={id} />
  </>
);

const Offline: Draw = ({ id }) => (
  <>
    <Fog id={id} />
    <Jetty />
    <g className="ba-beacon">
      <circle cx="124" cy="44.4" r="4.4" fill="var(--warning)" />
    </g>
    <Water id={id} mood="still" />
  </>
);

const Moored: Draw = ({ id }) => (
  <>
    <Jetty />
    {/* A taut line from the cleat to the bow. */}
    <path
      d="M64.5 32.6 Q 76 38.5 87.5 42.4"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <g className="ba-ride" stroke="currentColor">
      <path
        d="M86 42.2 H131 L125.5 49.6 H92 Z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="2.2"
      />
      <path d="M99 42 V37.2 H110.5 L114 42" strokeWidth="1.8" />
      <path d="M106 37 V24.6" strokeWidth="1.6" />
      <circle cx="106" cy="23" r="2.7" fill="var(--warning)" stroke="none" />
    </g>
    <path
      className="ba-glint"
      d="M102 53.4 H110"
      stroke="var(--warning)"
      strokeWidth="1.3"
    />
    <Water id={id} />
  </>
);

// Lighthouse: a beam sweeps the water from a lamp on a rock, turning toward
// you and away. Searching; nothing found yet.
const Lighthouse: Draw = ({ id }) => (
  <>
    <defs>
      <linearGradient
        id={`${id}-beam`}
        gradientUnits="userSpaceOnUse"
        x1="30"
        x2="150"
        y1="0"
        y2="0"
      >
        <stop offset="0" stopColor="var(--warning)" stopOpacity="0.5" />
        <stop offset="0.55" stopColor="var(--warning)" stopOpacity="0.16" />
        <stop offset="1" stopColor="var(--warning)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g className="ba-sweep" style={pivot(30, 24.6)}>
      <path d="M30 24.6 L152 17.2 L152 32 Z" fill={`url(#${id}-beam)`} />
    </g>
    <g stroke="currentColor">
      {/* The rock, the tapered tower, its gallery and lantern room. */}
      <path
        d="M8 50 C 14 44.5, 21 43, 30 43 C 39 43, 46 44.5, 54 50"
        strokeWidth="2.4"
        fill="currentColor"
        fillOpacity="0.06"
      />
      <path d="M24.6 43 L26.9 28.4 M35.4 43 L33.1 28.4" strokeWidth="2.4" />
      <path d="M24.4 28.2 H35.6" strokeWidth="2.2" />
      <path d="M26.2 36 H33.8" strokeWidth="1.4" opacity="0.45" />
      <path d="M27.2 27.6 V21.8 M32.8 27.6 V21.8" strokeWidth="1.4" />
      <path
        d="M25.8 21.4 H34.2 L30 17.6 Z"
        strokeWidth="1.8"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </g>
    <circle
      className="ba-lamp"
      cx="30"
      cy="24.6"
      r="2.3"
      fill="var(--warning)"
    />
    <path
      className="ba-glint ba-sync"
      d="M118 53 H128"
      stroke="var(--warning)"
      strokeWidth="1.3"
    />
    <Water id={id} />
  </>
);

// Dawn: an empty harbour as the sun comes up over the horizon, gulls about.
const Dawn: Draw = ({ id }) => (
  <>
    <defs>
      <clipPath id={`${id}-sky`}>
        <rect x="0" y="0" width={W} height="42.6" />
      </clipPath>
    </defs>
    <Fog id={id} y={22} opacity={0.22} />
    <g clipPath={`url(#${id}-sky)`}>
      <g className="ba-rise">
        <circle cx="114" cy="43" r="7.6" fill="var(--warning)" />
      </g>
    </g>
    <g mask={`url(#${id}-fade)`}>
      <path
        d="M0 42.6 H160"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
    </g>
    <g stroke="currentColor" strokeWidth="1.3">
      <path
        className="ba-gull"
        style={pivot(63.6, 26)}
        d="M60 26 q1.8 -1.9 3.6 0 q1.8 -1.9 3.6 0"
      />
      <path
        className="ba-gull"
        style={pivot(73.2, 31, { "--ba-delay": "-1.3s" })}
        d="M70.4 31 q1.4 -1.5 2.8 0 q1.4 -1.5 2.8 0"
        opacity="0.7"
      />
    </g>
    <Jetty to={50} piles={[15, 31, 45]} cleat={false} />
    <path
      className="ba-glint"
      d="M108 53 H120"
      stroke="var(--warning)"
      strokeWidth="1.3"
    />
    <path
      className="ba-glint"
      style={delay(-2.2)}
      d="M111 58.4 H117"
      stroke="var(--warning)"
      strokeWidth="1.2"
    />
    <Water id={id} />
  </>
);

// Setting out: a boat under sail leaves the jetty behind, a wake trailing.
const SettingOut: Draw = ({ id }) => (
  <>
    <defs>
      <linearGradient
        id={`${id}-wg`}
        gradientUnits="userSpaceOnUse"
        x1="34"
        x2="90"
        y1="0"
        y2="0"
      >
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.7" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask
        id={`${id}-wake`}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={W}
        height="80"
      >
        <rect x="0" y="0" width={W} height="80" fill={`url(#${id}-wg)`} />
      </mask>
    </defs>
    <g opacity="0.4">
      <Jetty to={26} piles={[11, 22]} cleat={false} />
    </g>
    {/* The wake: dashes stream back from the stern; the mask keeps their
        ends from showing. */}
    <g mask={`url(#${id}-wake)`} stroke="currentColor" strokeWidth="1.4">
      <path
        className="ba-wake"
        d="M30 51.6 Q 60 51.2 96 49.6"
        strokeDasharray="5 5"
        opacity="0.55"
      />
      <path
        className="ba-wake"
        style={delay(-0.8)}
        d="M30 56.4 Q 60 55.6 96 51"
        strokeDasharray="3 7"
        opacity="0.32"
      />
    </g>
    <g className="ba-sail" stroke="currentColor">
      <path
        d="M84 43 H126 L119.6 49.8 H88.4 Z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="2.2"
      />
      <path d="M100 43 V22.4" strokeWidth="1.6" />
      <path
        d="M98.4 23.6 V40.6 H85.4 Z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="1.6"
      />
      <path
        d="M101.8 24.6 L120.6 40.6 H101.8 Z"
        fill="currentColor"
        fillOpacity="0.05"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="20.4" r="2.5" fill="var(--warning)" stroke="none" />
    </g>
    <Water id={id} />
  </>
);

// Rafted: three boats tied alongside, riding the same swell a beat apart.
const Rafted: Draw = ({ id }) => {
  const boat = (x: number, mast: number, lit: boolean, d: number) => (
    <g className="ba-ride" style={delay(d)} stroke="currentColor">
      <path
        d={`M${x} 43 H${x + 32} L${x + 27.5} 49.6 H${x + 4.5} Z`}
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="2.1"
      />
      <path
        d={`M${x + 8} 42.8 V38.6 H${x + 17} L${x + 20} 42.8`}
        strokeWidth="1.6"
      />
      <path d={`M${x + 13} 38.4 V${mast + 2}`} strokeWidth="1.5" />
      {lit ? (
        <circle
          cx={x + 13}
          cy={mast}
          r="2.5"
          fill="var(--warning)"
          stroke="none"
        />
      ) : (
        <circle
          cx={x + 13}
          cy={mast}
          r="1.5"
          fill="currentColor"
          stroke="none"
          opacity="0.55"
        />
      )}
    </g>
  );
  return (
    <>
      {boat(30, 26.4, false, 0)}
      {boat(64, 22.6, true, -1.6)}
      {boat(98, 27.8, false, -3.2)}
      {/* Fenders where the hulls touch. */}
      <path
        d="M63 44.4 V47.6 M97 44.4 V47.6"
        stroke="currentColor"
        strokeWidth="2.6"
        opacity="0.6"
      />
      <path
        className="ba-glint"
        d="M73 53.4 H81"
        stroke="var(--warning)"
        strokeWidth="1.3"
      />
      <Water id={id} />
    </>
  );
};

// Bottle: a message in a bottle, corked with the amber dot, adrift. What is
// under the waterline is drawn fainter.
const Bottle: Draw = ({ id }) => {
  const bottle = (
    <g className="ba-float" style={pivot(100, 47)}>
      <g transform="rotate(-11 100 46)" stroke="currentColor">
        <path
          d="M88 40.5 H101.5 Q105.6 40.5 107.8 43.6 H114 V48.4 H107.8 Q105.6 51.5 101.5 51.5 H88 Q84 51.5 84 46 Q84 40.5 88 40.5 Z"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.08"
        />
        <rect
          x="89.4"
          y="43.6"
          width="10.6"
          height="4.8"
          rx="2.4"
          strokeWidth="1.2"
          opacity="0.6"
        />
        <rect
          x="114"
          y="43.6"
          width="3.8"
          height="4.8"
          rx="1.1"
          fill="var(--warning)"
          stroke="none"
        />
      </g>
    </g>
  );
  return (
    <>
      <defs>
        <clipPath id={`${id}-above`}>
          <rect x="0" y="0" width={W} height="48.8" />
        </clipPath>
        <clipPath id={`${id}-below`}>
          <rect x="0" y="48.8" width={W} height="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-above)`}>{bottle}</g>
      <g clipPath={`url(#${id}-below)`} opacity="0.3">
        {bottle}
      </g>
      <Ripples cx={100} cy={49.6} rx={16} />
      <Water id={id} />
    </>
  );
};

function Ripples({ cx, cy, rx }: { cx: number; cy: number; rx: number }) {
  return (
    <g stroke="currentColor" strokeWidth="1.2">
      <ellipse
        className="ba-ripple"
        style={pivot(cx, cy)}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={rx / 8}
      />
      <ellipse
        className="ba-ripple"
        style={pivot(cx, cy, { "--ba-delay": "-3s" })}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={rx / 8}
      />
    </g>
  );
}

// Calm: one buoy on still water, rings spreading slowly from it.
const Calm: Draw = ({ id }) => (
  <>
    <g mask={`url(#${id}-fade)`}>
      <path
        d="M0 36 H160"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.18"
      />
    </g>
    <g className="ba-buoy ba-slow">
      <circle cx="80" cy="44.4" r="4.6" fill="var(--warning)" />
    </g>
    <Ripples cx={80} cy={50} rx={13} />
    <Water id={id} mood="calm" />
  </>
);

// Anchor: below the surface, an anchor at rest on the seabed, its chain
// rising slack to a buoy. Weed sways; a small fish idles past.
const Anchor: Draw = ({ id }) => (
  <>
    <Water id={id} y={24.4} lines={2} />
    <g className="ba-buoy">
      <circle cx="116" cy="20.6" r="3.6" fill="var(--warning)" />
    </g>
    <g stroke="currentColor">
      <path
        d="M116 25.2 C 113 40, 96 52, 79 53.2"
        strokeWidth="1.6"
        strokeDasharray="2.2 1.8"
        opacity="0.7"
      />
      <g transform="translate(68 57.6) rotate(58)" strokeWidth="2.2">
        <circle cx="0" cy="-14.4" r="2" />
        <path d="M0 -12.4 V7.6 M-4.6 -8.6 H4.6" />
        <path d="M-8.4 1.4 Q -7.6 7.6 0 7.6 Q 7.6 7.6 8.4 1.4" />
        <path d="M-8.4 1.4 l-1.6 2.2 M8.4 1.4 l1.6 2.2" strokeWidth="1.8" />
      </g>
    </g>
    <g mask={`url(#${id}-fade)`} stroke="currentColor">
      <path
        d="M0 64.4 C 30 62.2, 60 63.4, 90 62.8 S 140 63.6, 160 62.4"
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M22 66.6 h3 M100 66.4 h4 M132 65.8 h2"
        strokeWidth="1.4"
        opacity="0.3"
      />
    </g>
    <g stroke="currentColor" strokeWidth="1.4" opacity="0.5">
      <path
        className="ba-weed"
        style={pivot(30, 63.6)}
        d="M30 63.6 C 27.6 58, 32.6 54, 29.6 47.6"
      />
      <path
        className="ba-weed"
        style={pivot(34, 63.4, { "--ba-delay": "-2.4s" })}
        d="M34 63.4 C 36 59, 32 56.4, 34.4 52.4"
      />
      <path
        className="ba-weed"
        style={pivot(136, 62.8, { "--ba-delay": "-1.2s" })}
        d="M136 62.8 C 133.6 57.6, 138.4 54, 135.6 49"
      />
    </g>
    <g
      className="ba-fish"
      stroke="currentColor"
      strokeWidth="1.3"
      opacity="0.6"
    >
      <path d="M100 39 q4 -2.6 8 0 q-4 2.6 -8 0 Z M100 39 l-2.6 -2 v4 Z" />
    </g>
  </>
);

// Storm: rain over the jetty, choppy water, and the buoy's light blinking.
const Storm: Draw = ({ id }) => {
  const rain = [];
  for (let x = 4; x < 186; x += 12.5) rain.push(`M${x} -6 l-14 60`);
  return (
    <>
      {/* Low cloud, and rain from under it to the water. */}
      <g mask={`url(#${id}-fade)`} stroke="currentColor">
        <path
          className="ba-fog"
          d="M14 18.6 H146"
          strokeWidth="2.2"
          strokeDasharray="22 6"
          opacity="0.4"
        />
      </g>
      <defs>
        <clipPath id={`${id}-air`}>
          <rect x="0" y="22.4" width={W} height="25.2" />
        </clipPath>
      </defs>
      {/* Rain falls one dash a loop, so it repeats without a seam; it stops
          at the water. */}
      <g mask={`url(#${id}-fade)`}>
        <g clipPath={`url(#${id}-air)`}>
          <g
            className="ba-rain"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.32"
          >
            <path d={rain.join(" ")} strokeDasharray="4 8.32" />
          </g>
        </g>
      </g>
      <Jetty />
      <g className="ba-toss">
        <circle
          cx="124"
          cy="44.4"
          r="4.4"
          fill="var(--warning)"
          className="ba-blink"
        />
      </g>
      <Water id={id} mood="storm" />
    </>
  );
};

// Chart: a chart of the coast, a dotted course from harbour to a lit mark,
// and a compass needle settling.
const Chart: Draw = () => (
  <>
    <g stroke="currentColor">
      <path
        d="M22 19 H130 L138 27 V65 H22 Z"
        strokeWidth="1.8"
        fill="currentColor"
        fillOpacity="0.04"
      />
      <path d="M130 19 V27 H138" strokeWidth="1.3" opacity="0.6" />
      {/* The coast, and depth lines following it out. */}
      <path
        d="M22 35 C 30 34, 34 29, 42 27.6 C 50 26.4, 53 22, 56 19 H22 Z"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M22 41 C 34 40, 42 35, 52 31 C 60 28, 64 23, 67 19"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity="0.4"
      />
      <path
        d="M22 48 C 40 47, 52 40, 64 35 C 74 31, 78 24, 81 19"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity="0.25"
      />
      {/* The harbour mark and the course out. */}
      <circle cx="40" cy="36.6" r="1.8" strokeWidth="1.4" />
      <path
        d="M41.6 37.8 C 54 50, 78 54, 94 46 S 112 35, 117 32.4"
        strokeWidth="1.8"
        strokeDasharray="0.1 3.6"
        opacity="0.85"
      />
      {/* Compass rose. */}
      <circle cx="122" cy="53" r="7" strokeWidth="1.2" opacity="0.45" />
      <path
        d="M122 44 V45.6 M122 60.4 V62 M113 53 H114.6 M129.4 53 H131"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <g className="ba-needle" style={pivot(122, 53)}>
        <path d="M122 47.2 L123.6 53 L122 58.8 L120.4 53 Z" strokeWidth="1.2" />
        <path
          d="M122 47.2 L123.6 53 H120.4 Z"
          fill="currentColor"
          stroke="none"
        />
      </g>
    </g>
    <circle
      className="ba-ping"
      style={pivot(117, 32.4)}
      cx="117"
      cy="32.4"
      r="2.6"
      stroke="var(--warning)"
      strokeWidth="1.2"
    />
    <circle cx="117" cy="32.4" r="2.6" fill="var(--warning)" />
  </>
);

// Dock: a quay with a crate, and a crane whose empty hook swings gently.
const Dock: Draw = ({ id }) => (
  <>
    <Jetty to={118} piles={[15, 40, 65, 90, 112]} cleat={false} />
    <g stroke="currentColor">
      <rect
        x="20"
        y="28.4"
        width="9.4"
        height="7.6"
        rx="0.8"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path d="M20.6 29 L28.8 35.4" strokeWidth="1.1" opacity="0.5" />
      <rect
        x="30.6"
        y="30.8"
        width="7"
        height="5.2"
        rx="0.8"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* The crane: mast, jib out over the water, a brace. */}
      <path d="M112 36 V21.4" strokeWidth="2.4" />
      <path d="M110 22.4 L141 24.6" strokeWidth="2.1" />
      <path d="M112 30 L124 23.4" strokeWidth="1.4" opacity="0.7" />
      <g className="ba-swing" style={pivot(138, 24.4)}>
        <path d="M138 24.4 V36.4" strokeWidth="1.3" />
        <path
          d="M138 36.4 V38.8 Q138 41.4 135.6 41.4 Q133.4 41.4 133.4 39.4"
          strokeWidth="1.7"
        />
      </g>
    </g>
    <circle
      className="ba-lamp"
      cx="112"
      cy="18.6"
      r="2.4"
      fill="var(--warning)"
    />
    <Water id={id} />
  </>
);

const DRAW: Record<SceneName, Draw> = {
  ended: Ended,
  offline: Offline,
  moored: Moored,
  lighthouse: Lighthouse,
  dawn: Dawn,
  "setting-out": SettingOut,
  rafted: Rafted,
  bottle: Bottle,
  calm: Calm,
  anchor: Anchor,
  storm: Storm,
  chart: Chart,
  dock: Dock,
};
