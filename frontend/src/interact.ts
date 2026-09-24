// Pointer handling for the active family preview: drag a layer to move it,
// drag a corner handle to resize it. A selected group adds side handles too. Frames stay normalised (0..1 fractions
// of the canvas) so the maths is the same for every family. Rotation is a
// number field in the inspector, not a handle.

import type { NormalizedFrame } from "./model.js";
import type { CanvasSize } from "./renderer.js";

export type HandleCorner = "nw" | "ne" | "sw" | "se";
/** The middle of a side. Only a selected group's box has these. */
export type HandleEdge = "n" | "s" | "e" | "w";
export type ResizeHandle = HandleCorner | HandleEdge;

export function isCorner(handle: ResizeHandle): handle is HandleCorner {
  return handle.length === 2;
}

export interface GestureTarget {
  elementId: string;
  frame: NormalizedFrame;
  handle?: ResizeHandle;
  /**
   * A corner drag keeps the frame's proportions: a group scaled as one, so
   * what is inside it keeps its shape. The pointer's travel along the box's
   * diagonal sets the scale, and the opposite corner stays put. It does not
   * snap, since a grid line can only ever be met on one of the two sides.
   */
  keepAspect?: boolean;
  /**
   * The layer draws as a circle in the square at the middle of its frame, and
   * its handles sit on that square's corners. A corner drag then resizes that
   * square, pinned at the opposite corner, and leaves a square frame behind, so
   * the handle stays under the pointer instead of pulling on a side the circle
   * never reaches.
   */
  square?: boolean;
  /**
   * The layer draws as a line down the middle of its frame's long side, and its
   * handles sit on that bar. A corner drag then changes only the length, since
   * the frame's short side is slack the line never fills, and pulling on it
   * moved the handle half as far as the pointer.
   */
  line?: boolean;
  /** A bar gauge: always across its frame, so a corner drag changes only the width. */
  bar?: boolean;
  /**
   * The box around what the layer draws, when that is smaller than its frame
   * (a row of dots). A corner drag resizes from this box instead of the frame,
   * so the handle on its corner stays under the pointer.
   */
  outline?: NormalizedFrame;
  /**
   * Snap to grid: `step` is the grid as a fraction of the face (0.05 is a line
   * every 5%), `on` is whether the Snap to grid toggle is on. Snapping lands a
   * moved layer's nearest edge or middle on a line, and a corner drag's pulled
   * edge. Holding Alt flips it for as long as it is held: free with the grid
   * on, snapped with it off. Undefined never snaps.
   */
  snap?: { step: Grid; on: boolean };
  /**
   * The other layers' lines this drag can land on, and how near counts. Read
   * under the same switch as the grid, Alt included, so one key turns all
   * snapping off. Undefined never guides.
   */
  guides?: Guides;
}

/** The grid steps the preview offers, as fractions of the face. */
export const GRID_STEPS = [0.01, 0.025, 0.05, 0.1] as const;

/**
 * A snap grid: the spacing across and down, each as a fraction of the face.
 * A plain number is the same spacing both ways. Lines are counted out from the
 * middle of the face, so the middle is always a line whatever the spacing.
 */
export type Grid = number | { x: number; y: number };

/**
 * The grid for one face with square cells. The face's shorter side takes the
 * chosen percent, and the longer side takes the same distance in points, so a
 * 1% grid on the 181 x 65.5 pt wide face has lines 0.655 pt apart both ways
 * rather than 1.81 pt across and 0.655 pt down. A square face gets `step` both ways.
 */
export function gridFor(step: number, box: { width: number; height: number }): { x: number; y: number } {
  if (!(box.width > 0 && box.height > 0) || box.width === box.height) return { x: step, y: step };
  return box.width > box.height
    ? { x: (step * box.height) / box.width, y: step }
    : { x: step, y: (step * box.width) / box.height };
}

function gridAxes(grid: Grid): { x: number; y: number } {
  return typeof grid === "number" ? { x: grid, y: grid } : grid;
}

function validGrid(g: { x: number; y: number }): boolean {
  return g.x > 0 && g.y > 0;
}

/** A tiny margin so a value already on a line counts as on it despite float dust. */
const ON_LINE = 1e-6;

/** How far `n` is from the nearest line of a `step` grid counted from the middle, signed. */
function toLine(n: number, step: number): number {
  return Math.round((n - 0.5) / step) * step + 0.5 - n;
}

/** Move one axis so whichever of its start, middle or end is closest to a line lands on it. */
function snapSpan(start: number, size: number, step: number): number {
  const offsets = [start, start + size / 2, start + size].map((n) => toLine(n, step));
  const best = offsets.reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a));
  return round3(start + best);
}

/**
 * A moved frame put on the grid: on each axis the edge or middle nearest a
 * line lands on it, so a layer can sit left-aligned, centred or right-aligned
 * on the grid without the author choosing which. Size and turn stay.
 */
export function snapFrameMove(frame: NormalizedFrame, grid: Grid): NormalizedFrame {
  const g = gridAxes(grid);
  if (!validGrid(g)) return frame;
  return clampFrame({ ...frame, x: snapSpan(frame.x, frame.width, g.x), y: snapSpan(frame.y, frame.height, g.y) });
}

/**
 * A resized frame with the edges a corner drag pulled put on the grid. The
 * opposite edges stay where the drag pinned them. `axes` limits it to the
 * sides the resize actually changes, so a line keeps its thickness.
 */
export function snapFrameEdges(
  frame: NormalizedFrame,
  handle: ResizeHandle,
  grid: Grid,
  axes: { x: boolean; y: boolean } = { x: true, y: true },
): NormalizedFrame {
  const g = gridAxes(grid);
  if (!validGrid(g)) return frame;
  let { x, y, width, height } = frame;
  const right = x + width;
  const bottom = y + height;
  if (axes.x && handle.includes("e")) width = Math.max(MIN_SIZE, round3(right + toLine(right, g.x) - x));
  if (axes.x && handle.includes("w")) {
    const left = Math.min(round3(x + toLine(x, g.x)), right - MIN_SIZE);
    width = round3(right - left);
    x = round3(left);
  }
  if (axes.y && handle.includes("s")) height = Math.max(MIN_SIZE, round3(bottom + toLine(bottom, g.y) - y));
  if (axes.y && handle.includes("n")) {
    const top = Math.min(round3(y + toLine(y, g.y)), bottom - MIN_SIZE);
    height = round3(bottom - top);
    y = round3(top);
  }
  return { ...frame, x, y, width, height };
}

/**
 * What an arrow key does with the grid on: the frame's left (or top) edge
 * goes to the next grid line in that direction. A layer already on a line
 * moves one step; one between lines lands on the next line first.
 */
export function gridNudgeFrame(frame: NormalizedFrame, dx: number, dy: number, grid: Grid): NormalizedFrame {
  const g = gridAxes(grid);
  if (!validGrid(g)) return frame;
  const next = (n: number, dir: number, step: number) => {
    if (dir === 0) return n;
    const k = (n - 0.5) / step;
    let line = dir > 0 ? Math.floor(k + ON_LINE) + 1 : Math.ceil(k - ON_LINE) - 1;
    // A frame keeps three decimals, and a fine grid's next line can round back
    // to where the layer already is (0.30095 is 0.301 again), which left the
    // arrow doing nothing. Step on until the rounded value really moves.
    let v = round3(line * step + 0.5);
    for (let guard = 0; guard < 1000 && (dir > 0 ? v <= n : v >= n); guard++) {
      line += dir;
      v = round3(line * step + 0.5);
    }
    return v;
  };
  return clampFrame({ ...frame, x: next(frame.x, Math.sign(dx), g.x), y: next(frame.y, Math.sign(dy), g.y) });
}

// ── smart guides ────────────────────────────────────────────────────────
//
// The grid lines up a layer with the face. Guides line it up with the other
// layers: while a drag is near one of their edges or middles it lands on it
// exactly, and the line it landed on is drawn. Everything here works in the
// same 0..1 fractions a frame is stored in, so a guide is one number and an
// axis whatever the shape.

/** One line a drag can land on, across the face (`x`) or down it (`y`). */
export interface GuideLine {
  axis: "x" | "y";
  /** Where the line sits, as a fraction of the face. */
  at: number;
}

/** The lines a drag may land on, and how near counts, per axis. */
export interface Guides {
  lines: readonly GuideLine[];
  threshold: { x: number; y: number };
}

/** How near a guide has to be to catch a drag, in design points. Wide enough
 * to feel helpful at any zoom, small enough that a deliberate placement one
 * point off a neighbour still holds. */
export const GUIDE_POINTS = 3;

/**
 * `GUIDE_POINTS` as a fraction of the face, per axis. Points rather than a
 * flat fraction so the pull feels the same on the 181 pt wide rectangular face
 * and the 51 pt circular one, the way `gridFor` keeps grid cells square.
 */
export function guideThreshold(box: { width: number; height: number }, points = GUIDE_POINTS): { x: number; y: number } {
  return {
    x: box.width > 0 ? points / box.width : 0,
    y: box.height > 0 ? points / box.height : 0,
  };
}

/**
 * The lines `others` offer: each frame's two edges and its middle, on both
 * axes, plus the face's own middle lines. The caller decides what belongs in
 * `others`; the layers being dragged and the hidden ones are never in it.
 */
export function guideCandidates(others: readonly NormalizedFrame[]): GuideLine[] {
  const lines: GuideLine[] = [{ axis: "x", at: 0.5 }, { axis: "y", at: 0.5 }];
  // Three decimals, the same as a frame carries: a line a frame cannot land on
  // exactly would leave the layer a hair off the neighbour it lined up with.
  for (const f of others) {
    lines.push({ axis: "x", at: round3(f.x) }, { axis: "x", at: round3(f.x + f.width / 2) }, { axis: "x", at: round3(f.x + f.width) });
    lines.push({ axis: "y", at: round3(f.y) }, { axis: "y", at: round3(f.y + f.height / 2) }, { axis: "y", at: round3(f.y + f.height) });
  }
  // Layers that already line up hand in the same line several times over, and
  // a line drawn twice is a line drawn twice as bright.
  const seen = new Set<string>();
  return lines.filter((l) => {
    const key = `${l.axis}:${l.at}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** A guide a drag reached: the line, and how far to move to sit on it. */
export interface GuideHit {
  at: number;
  delta: number;
}

/**
 * The nearest line on one axis to any of `positions` (a frame's leading edge,
 * middle and trailing edge), or undefined when none is within `threshold`.
 * A tie goes to the earlier position, so an edge wins over a middle.
 */
export function nearestGuide(
  positions: readonly number[],
  lines: readonly GuideLine[],
  axis: "x" | "y",
  threshold: number,
): GuideHit | undefined {
  if (!(threshold > 0)) return undefined;
  let best: GuideHit | undefined;
  for (const p of positions) {
    for (const line of lines) {
      if (line.axis !== axis) continue;
      const delta = line.at - p;
      if (Math.abs(delta) > threshold) continue;
      // Clearly nearer, not nearer by float dust: two lines the same distance
      // away differ in their last bits, and without the margin which one won
      // would come down to arithmetic noise rather than the rule above.
      if (best === undefined || Math.abs(delta) < Math.abs(best.delta) - 1e-9) best = { at: line.at, delta };
    }
  }
  return best;
}

/** Whether a frame's edges or middle sit on `line`, to float dust. */
function onGuide(frame: NormalizedFrame, line: GuideLine): boolean {
  const start = line.axis === "x" ? frame.x : frame.y;
  const size = line.axis === "x" ? frame.width : frame.height;
  return [start, start + size / 2, start + size].some((p) => Math.abs(p - line.at) < 1e-4);
}

/**
 * A moved frame put on whatever it is near: a guide first, the grid on any
 * axis no guide reached. A guide wins because lining a layer up with another
 * layer is the stronger intent, and the two disagree by less than a point.
 *
 * Returns the lines the frame really ended on, which is what gets drawn: the
 * clamp that keeps a layer on the face can pull it back off a guide, and a
 * line drawn where the layer is not would be a lie.
 */
export function snapMoveFrame(
  frame: NormalizedFrame,
  grid: Grid | undefined,
  guides: Guides | undefined,
): { frame: NormalizedFrame; guides: GuideLine[] } {
  let { x, y } = frame;
  const hitX = guides && nearestGuide([frame.x, frame.x + frame.width / 2, frame.x + frame.width], guides.lines, "x", guides.threshold.x);
  const hitY = guides && nearestGuide([frame.y, frame.y + frame.height / 2, frame.y + frame.height], guides.lines, "y", guides.threshold.y);
  if (hitX) x = round3(frame.x + hitX.delta);
  if (hitY) y = round3(frame.y + hitY.delta);
  if (grid !== undefined) {
    const gridded = snapFrameMove(frame, grid);
    if (!hitX) x = gridded.x;
    if (!hitY) y = gridded.y;
  }
  const next = clampFrame({ ...frame, x, y });
  const landed: GuideLine[] = [];
  if (hitX) landed.push({ axis: "x", at: hitX.at });
  if (hitY) landed.push({ axis: "y", at: hitY.at });
  return { frame: next, guides: landed.filter((l) => onGuide(next, l)) };
}

/**
 * A resized frame with the edges a corner drag pulled put on a guide, and on
 * the grid where no guide reached. `axes` limits it to the sides the resize
 * changes, exactly as `snapFrameEdges` does.
 */
export function snapResizeFrame(
  frame: NormalizedFrame,
  handle: ResizeHandle,
  grid: Grid | undefined,
  guides: Guides | undefined,
  // A side handle moves one edge, so only its own axis can land on a line.
  axes: { x: boolean; y: boolean } = { x: /[ew]/.test(handle), y: /[ns]/.test(handle) },
): { frame: NormalizedFrame; guides: GuideLine[] } {
  let next = { ...frame };
  const landed: GuideLine[] = [];
  const free = { x: axes.x, y: axes.y };
  if (guides !== undefined) {
    if (axes.x) {
      const east = handle.includes("e");
      const hit = nearestGuide([east ? frame.x + frame.width : frame.x], guides.lines, "x", guides.threshold.x);
      if (hit) {
        if (east) next.width = Math.max(MIN_SIZE, round3(hit.at - next.x));
        else {
          const left = Math.min(round3(hit.at), frame.x + frame.width - MIN_SIZE);
          next.width = round3(frame.x + frame.width - left);
          next.x = left;
        }
        // The smallest size a drag allows can refuse the guide; then the edge
        // is not on the line and neither the line nor the grid should claim it.
        if (Math.abs((east ? next.x + next.width : next.x) - hit.at) < 1e-4) {
          landed.push({ axis: "x", at: hit.at });
          free.x = false;
        } else {
          next = { ...next, x: frame.x, width: frame.width };
        }
      }
    }
    if (axes.y) {
      const south = handle.includes("s");
      const hit = nearestGuide([south ? frame.y + frame.height : frame.y], guides.lines, "y", guides.threshold.y);
      if (hit) {
        if (south) next.height = Math.max(MIN_SIZE, round3(hit.at - next.y));
        else {
          const top = Math.min(round3(hit.at), frame.y + frame.height - MIN_SIZE);
          next.height = round3(frame.y + frame.height - top);
          next.y = top;
        }
        if (Math.abs((south ? next.y + next.height : next.y) - hit.at) < 1e-4) {
          landed.push({ axis: "y", at: hit.at });
          free.y = false;
        } else {
          next = { ...next, y: frame.y, height: frame.height };
        }
      }
    }
  }
  if (grid !== undefined) next = snapFrameEdges(next, handle, grid, free);
  return { frame: next, guides: landed };
}

export interface GestureCallbacks {
  /** Called with the new frame on every move, and `done` on pointer up. */
  onFrame(elementId: string, frame: NormalizedFrame, done: boolean): void;
  /** The guides the frame is sitting on right now, empty when it sits on none
   * and on release. Only the canvas overlay cares, so it is optional. */
  onGuides?(lines: readonly GuideLine[]): void;
}

const MIN_SIZE = 0.04;
/** Keep about 4% of the box on canvas, like the phone editor (schema §4.1). */
const KEEP_VISIBLE = 0.04;

/**
 * How far the pointer has moved since `start`, in the SVG's own units.
 *
 * Measured from screen movement and the SVG's scale alone, never from where the
 * SVG sits on screen. The press that starts a drag often selects the layer too,
 * and that re-render can shift the preview under a still pointer; mapping each
 * point through the live position read that shift as a huge drag and threw the
 * layer to the top or bottom of the face. A scale that cannot be read (the SVG
 * was re-rendered away mid-drag) keeps the last one that could.
 */
export function pointerTravel(svg: SVGSVGElement, start: PointerEvent): (ev: PointerEvent) => { x: number; y: number } {
  const scaleOf = () => {
    const ctm = svg.getScreenCTM();
    return ctm && ctm.a !== 0 && ctm.d !== 0 ? { x: ctm.a, y: ctm.d } : undefined;
  };
  let scale = scaleOf() ?? { x: 1, y: 1 };
  return (ev) => {
    scale = scaleOf() ?? scale;
    return { x: (ev.clientX - start.clientX) / scale.x, y: (ev.clientY - start.clientY) / scale.y };
  };
}

/**
 * A frame typed into the Position card, held to the rules a gesture already
 * obeys: no smaller than a corner drag allows, and never pushed so far that
 * nothing is left on the face.
 */
export function typedFrame(frame: NormalizedFrame, patch: Partial<NormalizedFrame>): NormalizedFrame {
  const next = { ...frame, ...patch };
  return clampFrame({
    ...next,
    x: round3(next.x),
    y: round3(next.y),
    width: Math.max(MIN_SIZE, round3(next.width)),
    height: Math.max(MIN_SIZE, round3(next.height)),
  });
}

/** Which way the Position card's line-up buttons centre a layer. */
export type CenterAxis = "across" | "down" | "both";

/**
 * A frame moved to the middle of the face: across, up and down, or both. Size
 * and turn stay. The frame's own middle is what lands on the face's middle,
 * which is also the middle of what every kind draws, since a circle, a line
 * and a row of dots all sit centred in their frame.
 */
export function centerFrame(frame: NormalizedFrame, axis: CenterAxis): NormalizedFrame {
  const x = axis === "down" ? frame.x : round3((1 - frame.width) / 2);
  const y = axis === "across" ? frame.y : round3((1 - frame.height) / 2);
  return clampFrame({ ...frame, x, y });
}

/** Whether a frame already sits in the middle of the face on that axis, to
 * the three decimals the wire carries. */
export function isCentered(frame: NormalizedFrame, axis: CenterAxis): boolean {
  const next = centerFrame(frame, axis);
  return next.x === frame.x && next.y === frame.y;
}

function clampFrame(f: NormalizedFrame): NormalizedFrame {
  const x = Math.min(1 - KEEP_VISIBLE, Math.max(-f.width + KEEP_VISIBLE, f.x));
  const y = Math.min(1 - KEEP_VISIBLE, Math.max(-f.height + KEEP_VISIBLE, f.y));
  return { ...f, x, y };
}

/** Frames carry three decimals on the wire, and every gesture rounds to them
 * so a move is reproducible rather than a long tail of float noise. */
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** How much further one arrow press moves with Shift held. */
export const NUDGE_COARSE = 10;

/**
 * Move a frame by whole design points: what an arrow key does to a layer.
 *
 * `dx`/`dy` are points in the family's design box, so one press moves the same
 * distance on the wrist in every shape, and the result is clamped exactly the
 * way a drag is (KEEP_VISIBLE), so the keyboard cannot put a layer somewhere a
 * pointer could not.
 */
export function nudgeFrame(
  frame: NormalizedFrame,
  dx: number,
  dy: number,
  box: { width: number; height: number },
): NormalizedFrame {
  const x = box.width > 0 ? frame.x + dx / box.width : frame.x;
  const y = box.height > 0 ? frame.y + dy / box.height : frame.y;
  return clampFrame({ ...frame, x: round3(x), y: round3(y) });
}

/**
 * Move a point inside a layer's box by whole design points: what an arrow key
 * does to the image timestamp chip. `box` is that layer's box in design points,
 * and the point stays inside it, as `beginPointDrag` keeps it.
 */
export function nudgePoint(
  base: { x: number; y: number },
  dx: number,
  dy: number,
  box: { w: number; h: number },
): { x: number; y: number } {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return {
    x: box.w > 0 ? round3(clamp(base.x + dx / box.w)) : base.x,
    y: box.h > 0 ? round3(clamp(base.y + dy / box.h)) : base.y,
  };
}

/**
 * Resize the square a circle draws in by a corner drag of `travel` design
 * points. The square starts as the frame's shorter side centred in the frame,
 * grows by the pointer's travel along the corner's diagonal, and keeps the
 * opposite corner where it was. Works in points, since a square in points is
 * not square in the canvas fractions a frame is stored in.
 */
export function squareResize(
  base: NormalizedFrame,
  canvas: CanvasSize,
  handle: HandleCorner,
  travel: { x: number; y: number },
): NormalizedFrame {
  const W = canvas.width;
  const H = canvas.height;
  const w = base.width * W;
  const h = base.height * H;
  const side0 = Math.min(w, h);
  const left0 = base.x * W + (w - side0) / 2;
  const top0 = base.y * H + (h - side0) / 2;
  const sx = handle.includes("e") ? 1 : -1;
  const sy = handle.includes("s") ? 1 : -1;
  const minSide = MIN_SIZE * Math.max(W, H);
  const side = Math.max(minSide, side0 + (sx * travel.x + sy * travel.y) / 2);
  const left = sx > 0 ? left0 : left0 + side0 - side;
  const top = sy > 0 ? top0 : top0 + side0 - side;
  return {
    ...base,
    x: round3(left / W),
    y: round3(top / H),
    width: round3(side / W),
    height: round3(side / H),
  };
}

/**
 * Resize a line by a corner drag of `travel` design points: only its length
 * changes, pinned at the far end. The length never drops below the frame's
 * short side, so the line keeps the direction it is drawn in. `horizontal` is
 * for a bar gauge, which runs across its frame whatever its shape, so only the
 * smallest drag size holds it.
 */
export function lineResize(
  base: NormalizedFrame,
  canvas: CanvasSize,
  handle: HandleCorner,
  travel: { x: number; y: number },
  horizontal = false,
): NormalizedFrame {
  const W = canvas.width;
  const H = canvas.height;
  const along = horizontal || base.width * W >= base.height * H;
  if (along) {
    const min = horizontal ? MIN_SIZE : Math.max(MIN_SIZE, (base.height * H) / W);
    const right = base.x + base.width;
    const width = handle.includes("e")
      ? Math.max(min, base.width + travel.x / W)
      : Math.max(min, base.width - travel.x / W);
    const x = handle.includes("e") ? base.x : right - width;
    return { ...base, x: round3(x), width: round3(width) };
  }
  const min = Math.max(MIN_SIZE, (base.width * W) / H);
  const bottom = base.y + base.height;
  const height = handle.includes("s")
    ? Math.max(min, base.height + travel.y / H)
    : Math.max(min, base.height - travel.y / H);
  const y = handle.includes("s") ? base.y : bottom - height;
  return { ...base, y: round3(y), height: round3(height) };
}

/**
 * Start a gesture on `pointerdown`. Captures the pointer on the SVG and
 * reports frames until release. Returns a cleanup that cancels the gesture.
 */
export function beginGesture(
  svg: SVGSVGElement,
  canvas: CanvasSize,
  start: PointerEvent,
  target: GestureTarget,
  cb: GestureCallbacks,
): () => void {
  const travel = pointerTravel(svg, start);
  const base = { ...(target.handle && target.outline ? target.outline : target.frame) };
  // A press on a handle that never moves leaves the frame as it was.
  let last = { ...target.frame };
  svg.setPointerCapture(start.pointerId);

  const round = (n: number) => Math.round(n * 1000) / 1000;

  // What the canvas is drawing guide lines for right now, so a move that
  // changes nothing sends nothing.
  let shown: readonly GuideLine[] = [];
  const showGuides = (lines: readonly GuideLine[]) => {
    if (lines.length === 0 && shown.length === 0) return;
    if (lines.length === shown.length && lines.every((l, i) => l.axis === shown[i]!.axis && l.at === shown[i]!.at)) return;
    shown = lines;
    cb.onGuides?.(lines);
  };

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const t = travel(ev);
    const dx = t.x / canvas.width;
    const dy = t.y / canvas.height;
    let next: NormalizedFrame;
    // Alt is read on every move, so it can be pressed or let go mid-drag. The
    // one switch covers the guides too: Alt is "leave it exactly where I put it".
    const snapping = target.snap !== undefined && target.snap.on !== ev.altKey;
    const snap = snapping ? target.snap?.step : undefined;
    const guides = snapping ? target.guides : undefined;
    let landed: readonly GuideLine[] = [];
    if (!target.handle) {
      next = clampFrame({ ...base, x: round(base.x + dx), y: round(base.y + dy) });
      if (snapping) {
        const snapped = snapMoveFrame(next, snap, guides);
        next = snapped.frame;
        landed = snapped.guides;
      }
    } else if (target.square && isCorner(target.handle)) {
      // A circle's square is square in points, which a grid in fractions of a
      // wide face cannot keep, so its corners drag freely.
      next = squareResize(base, canvas, target.handle, t);
    } else if ((target.line || target.bar) && isCorner(target.handle)) {
      next = lineResize(base, canvas, target.handle, t, target.bar === true);
      if (snapping) {
        const along = target.bar === true || next.width * canvas.width >= next.height * canvas.height;
        const snapped = snapResizeFrame(next, target.handle, snap, guides, { x: along, y: !along });
        next = snapped.frame;
        landed = snapped.guides;
      }
    } else {
      let { x, y, width, height } = base;
      const right = base.x + base.width;
      const bottom = base.y + base.height;
      if (target.handle.includes("e")) width = Math.max(MIN_SIZE, base.width + dx);
      if (target.handle.includes("s")) height = Math.max(MIN_SIZE, base.height + dy);
      if (target.handle.includes("w")) {
        width = Math.max(MIN_SIZE, base.width - dx);
        x = right - width;
      }
      if (target.handle.includes("n")) {
        height = Math.max(MIN_SIZE, base.height - dy);
        y = bottom - height;
      }
      if (target.keepAspect && isCorner(target.handle) && base.width > 0 && base.height > 0) {
        // The pointer's travel along the box's diagonal, in points, sets the
        // scale. Each axis then counts as much as the box is long on it: on a
        // wide, short box a sideways drag scales it, where letting whichever
        // side changed more by ratio win made a small slip down the short
        // side shrink the whole box.
        const w = base.width * canvas.width;
        const h = base.height * canvas.height;
        const sx = target.handle.includes("e") ? 1 : -1;
        const sy = target.handle.includes("s") ? 1 : -1;
        const along = 1 + (sx * t.x * w + sy * t.y * h) / (w * w + h * h);
        const k = Math.max(MIN_SIZE / Math.min(base.width, base.height), along);
        width = base.width * k;
        height = base.height * k;
        if (target.handle.includes("w")) x = right - width;
        if (target.handle.includes("n")) y = bottom - height;
      }
      next = { ...base, x: round(x), y: round(y), width: round(width), height: round(height) };
      if (snapping && !(target.keepAspect && isCorner(target.handle))) {
        const snapped = snapResizeFrame(next, target.handle, snap, guides);
        next = snapped.frame;
        landed = snapped.guides;
      }
    }
    last = next;
    showGuides(landed);
    cb.onFrame(target.elementId, next, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    cb.onFrame(target.elementId, last, true);
  };
  const cleanup = () => {
    showGuides([]);
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", finish);
    svg.removeEventListener("pointercancel", finish);
    try {
      svg.releasePointerCapture(start.pointerId);
    } catch {
      /* already released */
    }
  };
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
  return cleanup;
}

/**
 * Drag a point that lives inside one layer's box, reported as 0..1 fractions of
 * that box: the image timestamp chip is the only one so far.
 *
 * Deliberately not `beginGesture` with a tiny frame. The chip has no frame of
 * its own on the wire, it is not selectable, and it must not pick up the
 * KEEP_VISIBLE rule, which exists to stop a layer being dragged off the face and
 * would let the chip leave the picture it belongs to.
 */
export function beginPointDrag(
  svg: SVGSVGElement,
  box: { x: number; y: number; w: number; h: number },
  start: PointerEvent,
  base: { x: number; y: number },
  onPoint: (x: number, y: number, done: boolean) => void,
): () => void {
  const travel = pointerTravel(svg, start);
  let last = base;
  svg.setPointerCapture(start.pointerId);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const clamp = (n: number) => Math.min(1, Math.max(0, n));

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const t = travel(ev);
    // A zero-sized box would divide by zero; it cannot be dragged either.
    const x = box.w > 0 ? clamp(base.x + t.x / box.w) : base.x;
    const y = box.h > 0 ? clamp(base.y + t.y / box.h) : base.y;
    last = { x: round(x), y: round(y) };
    onPoint(last.x, last.y, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    onPoint(last.x, last.y, true);
  };
  const cleanup = () => {
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", finish);
    svg.removeEventListener("pointercancel", finish);
    try {
      svg.releasePointerCapture(start.pointerId);
    } catch {
      /* already released */
    }
  };
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
  return cleanup;
}

/**
 * Drag a corner of a box whose only variable is its scale: the image timestamp
 * chip, whose width and height both follow one text size. Reports the factor
 * the box should be multiplied by, taken from whichever axis the pointer has
 * pulled further, so a diagonal drag and a sideways one both do what they look
 * like they do. `size` is the box as drawn, in the SVG's own units.
 */
export function beginScaleDrag(
  svg: SVGSVGElement,
  start: PointerEvent,
  corner: HandleCorner,
  size: { w: number; h: number },
  onScale: (factor: number, done: boolean) => void,
): () => void {
  const travel = pointerTravel(svg, start);
  let last = 1;
  svg.setPointerCapture(start.pointerId);

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const t = travel(ev);
    const dx = t.x * (corner.includes("e") ? 1 : -1);
    const dy = t.y * (corner.includes("s") ? 1 : -1);
    const fx = size.w > 0 ? (size.w + dx) / size.w : 1;
    const fy = size.h > 0 ? (size.h + dy) / size.h : 1;
    const f = Math.abs(fx - 1) >= Math.abs(fy - 1) ? fx : fy;
    last = Math.max(0.05, f);
    onScale(last, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    onScale(last, true);
  };
  const cleanup = () => {
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", finish);
    svg.removeEventListener("pointercancel", finish);
    try {
      svg.releasePointerCapture(start.pointerId);
    } catch {
      /* already released */
    }
  };
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
  return cleanup;
}

/** The box around a set of frames: what a group or a pick moves and resizes. */
export function boxAround(frames: readonly NormalizedFrame[]): NormalizedFrame {
  const x0 = Math.min(...frames.map((f) => f.x));
  const y0 = Math.min(...frames.map((f) => f.y));
  const x1 = Math.max(...frames.map((f) => f.x + f.width));
  const y1 = Math.max(...frames.map((f) => f.y + f.height));
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rotationDegrees: 0 };
}

/**
 * Where a frame inside a box lands when the box goes from `from` to `to`: at
 * the same place inside it, stretched the way the box was. What a group's
 * resize does to each of its layers.
 */
export function frameInResizedBox(frame: NormalizedFrame, from: NormalizedFrame, to: NormalizedFrame): NormalizedFrame {
  const sx = from.width > 0 ? to.width / from.width : 1;
  const sy = from.height > 0 ? to.height / from.height : 1;
  return {
    ...frame,
    x: round3(to.x + (frame.x - from.x) * sx),
    y: round3(to.y + (frame.y - from.y) * sy),
    // Three decimals would round a sliver of a layer to nothing.
    width: Math.max(0.001, round3(frame.width * sx)),
    height: Math.max(0.001, round3(frame.height * sy)),
  };
}

/** Corner handle positions in canvas points for a frame. */
export function handlePoints(frame: NormalizedFrame, canvas: CanvasSize): { corner: HandleCorner; x: number; y: number }[] {
  const x0 = frame.x * canvas.width;
  const y0 = frame.y * canvas.height;
  const x1 = (frame.x + frame.width) * canvas.width;
  const y1 = (frame.y + frame.height) * canvas.height;
  return [
    { corner: "nw", x: x0, y: y0 },
    { corner: "ne", x: x1, y: y0 },
    { corner: "sw", x: x0, y: y1 },
    { corner: "se", x: x1, y: y1 },
  ];
}
