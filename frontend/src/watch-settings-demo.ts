// Small looping pictures of the hand movements the Watch settings page
// names, for the rows whose words alone do not show one: the quick menu
// gesture, the hold time, the double pinch, the double-tap on a page title,
// the pull down and the wrist twists.
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

import { type SVGTemplateResult, html, nothing, svg } from "lit";

/** A setting whose row or tiles draw a moving picture. */
export type DemoKind = "quickGesture" | "holdTime" | "doublePinch" | "doubleTap" | "pullDown" | "twist";

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

function times(frames: readonly Frame[]): { keyTimes: string; values: string; keySplines: string } {
  return {
    keyTimes: frames.map(([t]) => String(Math.round((t / DEMO_LOOP) * 10000) / 10000)).join(";"),
    values: frames.map(([, v]) => String(v)).join(";"),
    keySplines: frames.slice(1).map(() => ease).join(";"),
  };
}

/** One attribute moving through `frames`, eased, over the loop. */
function anim(attr: string, frames: readonly Frame[]): SVGTemplateResult {
  const t = times(frames);
  return svg`<animate attributeName=${attr} dur=${`${DEMO_LOOP}s`} repeatCount="indefinite" calcMode="spline"
    keyTimes=${t.keyTimes} keySplines=${t.keySplines} values=${t.values} />`;
}

/** A group turning about (cx, cy) through `frames` of degrees. */
function turn(frames: readonly (readonly [number, number])[], cx: number, cy: number): SVGTemplateResult {
  const t = times(frames.map(([at, deg]) => [at, `${deg} ${cx} ${cy}`] as const));
  return svg`<animateTransform attributeName="transform" type="rotate" dur=${`${DEMO_LOOP}s`} repeatCount="indefinite"
    calcMode="spline" keyTimes=${t.keyTimes} keySplines=${t.keySplines} values=${t.values} />`;
}

/** A group moving through `frames` of [dx, dy]. */
function shift(frames: readonly (readonly [number, number, number])[]): SVGTemplateResult {
  const t = times(frames.map(([at, dx, dy]) => [at, `${dx} ${dy}`] as const));
  return svg`<animateTransform attributeName="transform" type="translate" dur=${`${DEMO_LOOP}s`} repeatCount="indefinite"
    calcMode="spline" keyTimes=${t.keyTimes} keySplines=${t.keySplines} values=${t.values} />`;
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
  const pinch = (deg: number) => turn([[0, 0], [0.4, 0], [0.55, deg], [0.7, 0], [0.85, deg], [1, 0], [DEMO_LOOP, 0]], 6, deg > 0 ? 10 : 22);
  const digit = (d: string) => svg`<path d=${d} fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />`;
  return svg`<rect x="1" y="7" width="7" height="18" rx="3.5" fill="currentColor" fill-opacity="0.3" />
    <g>${still ? nothing : pinch(13)}${digit("M6 10Q15 6 23 11")}</g>
    <g>${still ? nothing : pinch(-13)}${digit("M6 22Q14 26 22 21")}</g>
    ${still ? nothing : svg`${ripple(23, 16, 0.55, 1.5, 6)}${ripple(23, 16, 0.85, 1.5, 6)}`}`;
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

function demoShape(kind: DemoKind, value: string, still: boolean): SVGTemplateResult {
  switch (kind) {
    case "quickGesture": return quickGesture(value, still);
    case "holdTime": return holdTime(value, still);
    case "doublePinch": return doublePinch(still);
    case "doubleTap": return doubleTap(still);
    case "pullDown": return pullDown(still);
    case "twist": return twist(value, still);
  }
}

/** One moving picture. `value` is the choice or the gesture it shows, where
 * the kind has more than one. */
export function demoPicture(kind: DemoKind, value = "", still = reducedMotion()) {
  return html`<svg class="ws-demo" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" data-demo=${kind}>${demoShape(kind, value, still)}</svg>`;
}
