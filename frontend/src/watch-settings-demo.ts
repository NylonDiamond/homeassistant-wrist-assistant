// Small looping pictures of the movements the Watch settings page names, for
// the rows whose words alone do not show one: the quick menu gesture, the
// hold time, the double pinch, the double-tap on a page title, the pull down,
// the wrist twists, the page animation, the bottom edge swipes for pages and
// cameras, and the bounce while waiting.
//
// Each is a 32 by 32 box drawn in `currentColor`, so a tile's own color
// (muted at rest, ink when picked) carries into it, as the small pictures in
// `watch-settings-look.ts` do. The movement is SMIL (`<animate>` inside the
// picture), so a picture needs no stylesheet of its own and every picture on
// the page runs on one clock. While the system asks for reduced motion each
// picture is drawn still: the path of the movement, the finger at rest on it.
//
// The movements follow the watch's own detection (`QuickRadialGestureDetector`
// in the app's `WatchConfigMessages.swift`): "Up/Down x2" turns three times in
// the middle lane, "Swipe Up/Down" starts below the middle, crosses above it
// and comes back, and "Clockwise" goes 300 degrees around the middle. The
// loop runs slower than the watch asks for, so the eye can follow it.
//
// The bottom edge swipes are a scrub, as `bottomEdgeDragGesture` in the app's
// `WatchHomeView.swift` and `bottomCameraSwitcher` in `CameraFullScreenView`
// read them: each `threshold` points of sliding turns one page or camera. So
// every level draws the same slide, with a notch on the edge per step, and a
// higher level turns more pages on the way.

import { type SVGTemplateResult, html, nothing, svg } from "lit";

/** A setting whose row or tiles draw a moving picture. */
export type DemoKind =
  | "quickGesture"
  | "holdTime"
  | "doublePinch"
  | "doubleTap"
  | "pullDown"
  | "twist"
  | "pageTransition"
  | "pageSwipe"
  | "cameraSwipe"
  | "bounce";

/** One loop, in seconds: the movement, then a rest. */
export const DEMO_LOOP = 2.4;

/** How long each hold time waits, in seconds: the watch's `LongPressDuration`. */
export const HOLD_SECONDS: Readonly<Record<string, number>> = {
  "Super Fast": 0.075,
  "Short": 0.15,
  "Normal": 0.2,
  "Long": 0.3,
  "Extra Long": 1,
};

/** How far each edge swipe level slides per page or camera, in points: the
 * watch's `BottomEdgePageSwipeSensitivity` and `CameraSwipeSensitivity`. */
export const SWIPE_POINTS: Readonly<Record<string, number>> = {
  Off: 0,
  Low: 60,
  Medium: 40,
  High: 25,
  Max: 15,
};

/** Whether the system asks for reduced motion. */
export function reducedMotion(): boolean {
  try {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** A time and the value there. The first is at 0, the last at `DEMO_LOOP`. */
type Frame = readonly [number, number | string];

const ease = "0.45 0 0.55 1";

/** Eased between frames, straight between them, or jumping at each. */
type Mode = "spline" | "linear" | "discrete";

function times(frames: readonly Frame[]): { keyTimes: string; values: string; keySplines: string } {
  return {
    keyTimes: frames.map(([t]) => String(Math.round((t / DEMO_LOOP) * 10000) / 10000)).join(";"),
    values: frames.map(([, v]) => String(v)).join(";"),
    keySplines: frames.slice(1).map(() => ease).join(";"),
  };
}

/** One attribute moving through `frames` over the loop. */
function anim(attr: string, frames: readonly Frame[], mode: Mode = "spline"): SVGTemplateResult {
  const t = times(frames);
  return svg`<animate attributeName=${attr} dur=${`${DEMO_LOOP}s`} repeatCount="indefinite" calcMode=${mode}
    keyTimes=${t.keyTimes} keySplines=${mode === "spline" ? t.keySplines : nothing} values=${t.values} />`;
}

/** A group turning about (cx, cy) through `frames` of degrees. */
function turn(frames: readonly (readonly [number, number])[], cx: number, cy: number): SVGTemplateResult {
  const t = times(frames.map(([at, deg]) => [at, `${deg} ${cx} ${cy}`] as const));
  return svg`<animateTransform attributeName="transform" type="rotate" dur=${`${DEMO_LOOP}s`} repeatCount="indefinite"
    calcMode="spline" keyTimes=${t.keyTimes} keySplines=${t.keySplines} values=${t.values} />`;
}

/** A group moving through `frames` of [dx, dy]. */
function shift(frames: readonly (readonly [number, number, number])[], mode: Mode = "spline"): SVGTemplateResult {
  const t = times(frames.map(([at, dx, dy]) => [at, `${dx} ${dy}`] as const));
  return svg`<animateTransform attributeName="transform" type="translate" dur=${`${DEMO_LOOP}s`} repeatCount="indefinite"
    calcMode=${mode} keyTimes=${t.keyTimes} keySplines=${mode === "spline" ? t.keySplines : nothing} values=${t.values} />`;
}

/** A group growing or shrinking about (16, 16) through `frames` of scales. */
function grow(frames: readonly (readonly [number, number])[], body: SVGTemplateResult): SVGTemplateResult {
  const t = times(frames);
  return svg`<g transform="translate(16 16)"><g>
    <animateTransform attributeName="transform" type="scale" dur=${`${DEMO_LOOP}s`} repeatCount="indefinite"
      calcMode="spline" keyTimes=${t.keyTimes} keySplines=${t.keySplines} values=${t.values} />
    <g transform="translate(-16 -16)">${body}</g></g></g>`;
}

/** Shown from `from` to `to`, fading in and out over 0.15 s. */
function shown(from: number, to: number, peak = 1): SVGTemplateResult {
  return anim("opacity", [[0, 0], [from - 0.15, 0], [from, peak], [to, peak], [to + 0.15, 0], [DEMO_LOOP, 0]]);
}

/** A ring that grows and fades at `at`: the watch did the thing. */
function ripple(cx: number, cy: number, at: number, from = 2.5, to = 9): SVGTemplateResult {
  return svg`<circle cx=${cx} cy=${cy} r=${from} fill="none" stroke="currentColor" stroke-width="1.2" opacity="0">
    ${anim("r", [[0, from], [at, from], [at + 0.4, to], [DEMO_LOOP, to]])}
    ${anim("opacity", [[0, 0], [at - 0.01, 0], [at, 0.9], [at + 0.4, 0], [DEMO_LOOP, 0]])}
  </circle>`;
}

/** A fingertip, with a soft edge so it reads as a touch. */
function finger(cx: number, cy: number, r = 2.6): SVGTemplateResult {
  return svg`<circle cx=${cx} cy=${cy} r=${r + 1.8} fill="currentColor" fill-opacity="0.2" />
    <circle cx=${cx} cy=${cy} r=${r} fill="currentColor" />`;
}

/** The watch's screen, front on. */
const screen = svg`<rect x="5" y="2" width="22" height="28" rx="7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-opacity="0.45" />`;

/** The middle of the ring menu, which the quick menu gesture is drawn around. */
const middle = svg`<circle cx="16" cy="16" r="1.5" fill="currentColor" fill-opacity="0.45" />`;

/** A page: its title on top, two rows of tiles under it. */
const page = svg`<rect x="10" y="6.5" width="12" height="2.6" rx="1.3" fill="currentColor" fill-opacity="0.7" />
  <rect x="9" y="12" width="14" height="5" rx="1.6" fill="currentColor" fill-opacity="0.25" />
  <rect x="9" y="19" width="14" height="5" rx="1.6" fill="currentColor" fill-opacity="0.25" />`;

function quickGesture(value: string, still: boolean): SVGTemplateResult {
  const trace = (d: string) => svg`<path d=${d} fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
    stroke-opacity="0.35" stroke-dasharray="1.6 2" />`;
  switch (value) {
    case "Swipe Up/Down":
      // Below the middle, above it, and back below.
      return svg`${screen}${trace("M9 16H23")}${middle}
        <g transform=${still ? "translate(0 7)" : nothing}>${still ? nothing : shift([[0, 0, 7], [0.4, 0, 7], [0.8, 0, -7], [1.2, 0, 7], [DEMO_LOOP, 0, 7]])}
          <g opacity=${still ? 1 : 0}>${still ? nothing : shown(0.35, 1.4)}${finger(16, 16)}</g></g>
        ${still ? nothing : ripple(16, 16, 1.25)}`;
    case "Clockwise": {
      // 300 degrees around the middle, starting at the top.
      return svg`${screen}${trace("M16 9A7 7 0 1 1 9.94 12.5")}${middle}
        <g>${still ? nothing : turn([[0, 0], [0.4, 0], [1.3, 300], [DEMO_LOOP, 300]], 16, 16)}
          <g opacity=${still ? 1 : 0}>${still ? nothing : shown(0.35, 1.45)}${finger(16, 9)}</g></g>
        ${still ? nothing : ripple(16, 16, 1.35)}`;
    }
    default:
      // "Up/Down x2": up, down, up, down in the middle lane.
      return svg`${screen}${trace("M16 9V23")}${middle}
        <g transform=${still ? "translate(0 -6)" : nothing}>${still ? nothing : shift([
          [0, 0, 0], [0.35, 0, 0], [0.55, 0, -6], [0.8, 0, 6], [1.05, 0, -6], [1.3, 0, 6], [1.9, 0, 6], [1.95, 0, 0], [DEMO_LOOP, 0, 0],
        ])}
          <g opacity=${still ? 1 : 0}>${still ? nothing : shown(0.3, 1.45)}${finger(16, 16)}</g></g>
        ${still ? nothing : ripple(16, 16, 1.35)}`;
  }
}

function holdTime(value: string, still: boolean): SVGTemplateResult {
  const hold = HOLD_SECONDS[value] ?? 0.2;
  const press = 0.4;
  const done = press + hold;
  const ring = svg`<circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    pathLength="100" stroke-dasharray="100" transform="rotate(-90 16 16)"
    stroke-dashoffset=${still ? Math.round(100 - Math.max(0.08, hold) * 100) : 100} opacity=${still ? 1 : 0}>
    ${still ? nothing : svg`${anim("stroke-dashoffset", [[0, 100], [press, 100], [done, 0], [done + 0.6, 0], [done + 0.61, 100], [DEMO_LOOP, 100]])}
      ${anim("opacity", [[0, 0], [press - 0.01, 0], [press, 1], [done + 0.45, 1], [done + 0.6, 0], [DEMO_LOOP, 0]])}`}
  </circle>`;
  // The tile under the finger, which lights when its extra options open.
  return svg`<rect x="9" y="9" width="14" height="14" rx="4" fill="currentColor" fill-opacity="0.25">
      ${still ? nothing : anim("fill-opacity", [[0, 0.25], [done - 0.01, 0.25], [done, 0.6], [done + 0.5, 0.6], [done + 0.65, 0.25], [DEMO_LOOP, 0.25]])}
    </rect>
    ${ring}
    <g opacity=${still ? 1 : 0}>${still ? nothing : shown(press, done + 0.45)}${finger(16, 16, 2.4)}</g>
    ${still ? nothing : ripple(16, 16, done, 7, 14)}`;
}

function doublePinch(still: boolean): SVGTemplateResult {
  // A hand from the left: the finger on top, the thumb under it, their tips
  // meeting twice at the right.
  const pinch = (deg: number, cy: number) => turn([[0, 0], [0.4, 0], [0.55, deg], [0.7, 0], [0.85, deg], [1, 0], [DEMO_LOOP, 0]], 8, cy);
  const digit = (d: string, tipX: number, tipY: number) => svg`<path d=${d} fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" />
    <circle cx=${tipX} cy=${tipY} r="2.4" fill="currentColor" />`;
  return svg`<circle cx="6" cy="16" r="6.5" fill="currentColor" fill-opacity="0.3" />
    <g>${still ? nothing : pinch(14, 11)}${digit("M8 11Q16 7 23 11", 23.5, 11.3)}</g>
    <g>${still ? nothing : pinch(-14, 21)}${digit("M8 21Q15 25 22 21", 22.5, 20.7)}</g>
    ${still ? nothing : svg`${ripple(24, 16, 0.55, 1.5, 6)}${ripple(24, 16, 0.85, 1.5, 6)}`}`;
}

function doubleTap(still: boolean): SVGTemplateResult {
  // Two taps on the page title.
  const tap = anim("r", [[0, 2.8], [0.45, 2.8], [0.55, 2], [0.65, 2.8], [0.75, 2.8], [0.85, 2], [0.95, 2.8], [DEMO_LOOP, 2.8]]);
  return svg`${screen}${page}
    <g opacity=${still ? 1 : 0}>${still ? nothing : shown(0.3, 1.2, 0.9)}
      <circle cx="16" cy="7.8" r="4.6" fill="currentColor" fill-opacity="0.2" />
      <circle cx="16" cy="7.8" r="2.8" fill="currentColor">${still ? nothing : tap}</circle></g>
    ${still ? nothing : svg`${ripple(16, 7.8, 0.55, 2, 7)}${ripple(16, 7.8, 0.85, 2, 7)}`}`;
}

function pullDown(still: boolean): SVGTemplateResult {
  // The finger drags the page down from the top; it springs back.
  const arrow = svg`<path d="M16 3.5V8.5M13.8 6.4L16 8.6L18.2 6.4" fill="none" stroke="currentColor" stroke-width="1.3"
    stroke-linecap="round" stroke-linejoin="round" opacity=${still ? 0.8 : 0}>
    ${still ? nothing : anim("opacity", [[0, 0], [0.7, 0], [1.1, 0.8], [1.5, 0.8], [1.7, 0], [DEMO_LOOP, 0]])}</path>`;
  return svg`${screen}${arrow}
    <g transform=${still ? "translate(0 6)" : nothing}>${still ? nothing : shift([[0, 0, 0], [0.4, 0, 0], [1.1, 0, 6], [1.4, 0, 6], [1.75, 0, 0], [DEMO_LOOP, 0, 0]])}${page}</g>
    <g transform=${still ? "translate(0 12)" : nothing}>${still ? nothing : shift([[0, 0, 0], [0.4, 0, 0], [1.1, 0, 12], [DEMO_LOOP, 0, 12]])}
      <g opacity=${still ? 1 : 0}>${still ? nothing : shown(0.4, 1.2, 0.9)}${finger(16, 5)}</g></g>`;
}

function twist(value: string, still: boolean): SVGTemplateResult {
  // The watch on the wrist turns one way and back. Clockwise is the way the
  // hands of a clock go, seen on the watch face.
  const way = value === "Twist Counter-Clockwise" ? -1 : 1;
  // The arrow over the watch, ending in its head.
  const arc = way > 0 ? "M9 3.9A14 14 0 0 1 23 3.9" : "M23 3.9A14 14 0 0 0 9 3.9";
  const head = way > 0 ? "M21.7 1.2L23 3.9L20 4.2" : "M10.3 1.2L9 3.9L12 4.2";
  return svg`<path d=${arc} fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.6" />
    <path d=${head} fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.6" />
    <g transform=${still ? `rotate(${way * 20} 16 17)` : nothing}>${still ? nothing : turn([[0, 0], [0.4, 0], [0.8, way * 35], [1.25, 0], [DEMO_LOOP, 0]], 16, 17)}
      <rect x="11.5" y="5" width="9" height="5" rx="1.5" fill="currentColor" fill-opacity="0.3" />
      <rect x="11.5" y="24" width="9" height="5" rx="1.5" fill="currentColor" fill-opacity="0.3" />
      <rect x="23" y="15" width="2" height="4" rx="1" fill="currentColor" fill-opacity="0.6" />
      <rect x="9" y="9" width="14" height="16" rx="4.5" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.3" />
      <path d="M16 13V17L18.5 18.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    </g>`;
}

// Two pages that the page pictures turn between: four tiles, and a dial.
const pageA = svg`<rect x="9" y="9" width="6.5" height="6.5" rx="1.8" fill="currentColor" fill-opacity="0.55" />
  <rect x="16.5" y="9" width="6.5" height="6.5" rx="1.8" fill="currentColor" fill-opacity="0.55" />
  <rect x="9" y="16.5" width="6.5" height="6.5" rx="1.8" fill="currentColor" fill-opacity="0.55" />
  <rect x="16.5" y="16.5" width="6.5" height="6.5" rx="1.8" fill="currentColor" fill-opacity="0.55" />`;
const pageB = svg`<circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-opacity="0.7" />
  <circle cx="16" cy="16" r="1.8" fill="currentColor" fill-opacity="0.7" />`;

// Two camera pictures that the camera swipe turns between.
const cameraA = svg`<rect x="7" y="5" width="18" height="17" rx="2" fill="currentColor" fill-opacity="0.2" />
  <path d="M7 22L12.5 13.5L16.5 18L19.5 15L25 22Z" fill="currentColor" fill-opacity="0.55" />
  <circle cx="20.5" cy="9.5" r="2" fill="currentColor" fill-opacity="0.75" />`;
const cameraB = svg`<rect x="7" y="5" width="18" height="17" rx="2" fill="currentColor" fill-opacity="0.2" />
  <rect x="10" y="12" width="8" height="10" fill="currentColor" fill-opacity="0.55" />
  <path d="M9 12.5L14 8.5L19 12.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-opacity="0.75" />
  <circle cx="21.5" cy="17" r="2.5" fill="currentColor" fill-opacity="0.4" />`;

/** The screen's own area: what slides out of it is cut off at its edge. */
function inScreen(body: SVGTemplateResult): SVGTemplateResult {
  return svg`<svg x="5" y="2" width="22" height="28" viewBox="5 2 22 28" overflow="hidden">${body}</svg>`;
}

function pageTransition(value: string, still: boolean): SVGTemplateResult {
  // The page turns to the next one at 0.6 s and back at 1.5 s, so the loop
  // ends where it starts. Each turn takes 0.25 s, slower than the watch's.
  const go = 0.6;
  const back = 1.5;
  const turnTime = 0.25;
  if (still) {
    // The middle of the first turn.
    switch (value) {
      case "Slide":
        return svg`${screen}${inScreen(svg`<g transform="translate(-11 0)">${pageA}</g><g transform="translate(11 0)">${pageB}</g>`)}`;
      case "Fade":
        return svg`${screen}<g opacity="0.5">${pageA}</g><g opacity="0.5">${pageB}</g>`;
      case "None":
        return svg`${screen}${pageB}`;
      default:
        return svg`${screen}${inScreen(svg`<g opacity="0.5" transform="translate(1.6 1.6) scale(0.9)">${pageA}</g><g transform="translate(11 0)">${pageB}</g>`)}`;
    }
  }
  const swap = (out: number, inn: number): Frame[] => [[0, out], [go, out], [go + turnTime, inn], [back, inn], [back + turnTime, out], [DEMO_LOOP, out]];
  switch (value) {
    case "Slide":
      // Both pages move together: out to the left, in from the right.
      return svg`${screen}${inScreen(svg`
        <g>${shift(swap(0, -22).map(([t, x]) => [t, Number(x), 0] as const))}${pageA}</g>
        <g>${shift(swap(22, 0).map(([t, x]) => [t, Number(x), 0] as const))}${pageB}</g>`)}`;
    case "Fade":
      return svg`${screen}<g>${anim("opacity", swap(1, 0))}${pageA}</g><g opacity="0">${anim("opacity", swap(0, 1))}${pageB}</g>`;
    case "None":
      return svg`${screen}<g>${anim("opacity", [[0, 1], [go, 0], [back, 1]], "discrete")}${pageA}</g>
        <g opacity="0">${anim("opacity", [[0, 0], [go, 1], [back, 0]], "discrete")}${pageB}</g>`;
    default:
      // The watch's own paging: the old page shrinks back and fades while the
      // next one slides in over it.
      return svg`${screen}${inScreen(svg`
        <g>${anim("opacity", swap(1, 0))}${grow(swap(1, 0.82).map(([t, k]) => [t, Number(k)] as const), pageA)}</g>
        <g>${shift(swap(22, 0).map(([t, x]) => [t, Number(x), 0] as const))}${pageB}</g>`)}`;
  }
}

function edgeSwipe(value: string, camera: boolean, still: boolean): SVGTemplateResult {
  const a = camera ? cameraA : pageA;
  const b = camera ? cameraB : pageB;
  const points = SWIPE_POINTS[value] ?? 0;
  // The edge, along the bottom of the screen.
  const from = 8;
  const to = 24;
  const track = svg`<path d=${`M${from} 27H${to}`} fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
    stroke-opacity="0.35" stroke-dasharray=${points === 0 ? "1.2 1.8" : nothing} />`;
  // Off: the edge does nothing, so nothing moves.
  if (points === 0) return svg`${screen}${a}${track}`;
  // One step on the drawing is the swipe's own length at 8 points a unit.
  const step = points / 8;
  const turns = Math.floor((to - from) / step + 1e-9);
  const notches = Array.from({ length: turns }, (_, i) => from + (i + 1) * step);
  const notchMarks = svg`${notches.map((x) => svg`<path d=${`M${x} 25.6V28.4`} stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-opacity="0.6" />`)}`;
  if (still) return svg`${screen}${a}${track}${notchMarks}${finger(from, 27, 2.2)}`;
  const start = 0.5;
  const end = 1.7;
  const at = (x: number) => start + ((x - from) / (to - from)) * (end - start);
  // The page or camera turns at each notch the finger passes; it is back on
  // the first one after the finger lifts.
  const flips: Frame[] = notches.map((x, i) => [at(x), i % 2 === 0 ? 0 : 1] as const);
  const showA: Frame[] = [[0, 1], ...flips, [2.1, 1]];
  const showB: Frame[] = showA.map(([t, v]) => [t, 1 - Number(v)] as const);
  return svg`${screen}
    <g>${anim("opacity", showA, "discrete")}${a}</g>
    <g opacity="0">${anim("opacity", showB, "discrete")}${b}</g>
    ${track}${notchMarks}
    <g>${shift([[0, 0, 0], [start, 0, 0], [end, to - from, 0], [DEMO_LOOP, to - from, 0]], "linear")}
      <g opacity="0">${shown(start - 0.05, end + 0.05, 0.9)}${finger(from, 27, 2.2)}</g></g>`;
}

function bounce(still: boolean): SVGTemplateResult {
  // A tap on a tile; its icon bounces until Home Assistant says the change
  // is done, then the tile lights.
  const bulb = svg`<circle cx="16" cy="14.5" r="3.2" fill="currentColor" fill-opacity="0.85" />
    <rect x="14.6" y="18.2" width="2.8" height="2.2" rx="0.8" fill="currentColor" fill-opacity="0.85" />`;
  if (still) {
    return svg`<rect x="8" y="8" width="16" height="16" rx="4.5" fill="currentColor" fill-opacity="0.25" />
      <g transform="translate(0 -2.5)">${bulb}</g>
      <path d="M13.5 26.5Q16 25.5 18.5 26.5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-opacity="0.5" />`;
  }
  const done = 1.45;
  return svg`<rect x="8" y="8" width="16" height="16" rx="4.5" fill="currentColor" fill-opacity="0.25">
      ${anim("fill-opacity", [[0, 0.25], [done - 0.01, 0.25], [done, 0.6], [2.1, 0.6], [2.25, 0.25], [DEMO_LOOP, 0.25]])}
    </rect>
    <g>${shift([[0, 0, 0], [0.45, 0, 0], [0.6, 0, -2.5], [0.75, 0, 0], [0.9, 0, -2.5], [1.05, 0, 0], [1.2, 0, -2.5], [1.35, 0, 0], [DEMO_LOOP, 0, 0]])}${bulb}</g>
    <g opacity="0">${shown(0.25, 0.4, 0.9)}${finger(19, 20, 2.4)}</g>
    ${ripple(19, 20, 0.35, 2, 6)}
    ${ripple(16, 16, done, 8, 13)}`;
}

function demoShape(kind: DemoKind, value: string, still: boolean): SVGTemplateResult {
  switch (kind) {
    case "quickGesture": return quickGesture(value, still);
    case "holdTime": return holdTime(value, still);
    case "doublePinch": return doublePinch(still);
    case "doubleTap": return doubleTap(still);
    case "pullDown": return pullDown(still);
    case "twist": return twist(value, still);
    case "pageTransition": return pageTransition(value, still);
    case "pageSwipe": return edgeSwipe(value, false, still);
    case "cameraSwipe": return edgeSwipe(value, true, still);
    case "bounce": return bounce(still);
  }
}

/** One moving picture. `value` is the choice or the gesture it shows, where
 * the kind has more than one. */
export function demoPicture(kind: DemoKind, value = "", still = reducedMotion()) {
  return html`<svg class="ws-demo" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" data-demo=${kind}>${demoShape(kind, value, still)}</svg>`;
}
