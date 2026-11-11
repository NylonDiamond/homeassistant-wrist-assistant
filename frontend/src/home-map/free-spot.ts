// Free floor for what the editor puts down without a point: a new pin from
// the Add dialog, and a room's name on the plan. Both start at the room's
// label point (`homeLabelPoint`) and take the nearest spot that is clear, by
// a short spiral search outwards: rings a step apart, each walked round.
//
// A pin's spot is in plan meters: inside the room, a little in from its
// walls, at least `gap` (0.4 m) from every pin of the room and off the
// room's name. A name's spot is in stage pixels: its whole pill inside the
// room and clear of the furniture, the pins and the names placed before it;
// none when no spot is clear, and the name is then left out.

import { homeLabelPoint, homePolygonHolds } from "./geometry.js";
import type { HomeMapRoom, HomePoint } from "./model.js";

/** How far apart new pins stand at the least, in meters. */
export const HOME_MAP_PIN_GAP = 0.4;

/** How far in from the walls a new pin stands at the least, in meters. */
const WALL_MARGIN = 0.15;

/** The distance from `p` to the segment `a`-`b`. */
function toSegment(p: readonly number[], a: readonly number[], b: readonly number[]): number {
  const dx = b[0]! - a[0]!;
  const dy = b[1]! - a[1]!;
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / len));
  return Math.hypot(p[0]! - (a[0]! + t * dx), p[1]! - (a[1]! + t * dy));
}

/** The distance from `p` to the nearest edge of `polygon`. */
function toEdges(p: readonly number[], polygon: readonly HomePoint[]): number {
  let best = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) best = Math.min(best, toSegment(p, polygon[j]!, polygon[i]!));
  return best;
}

/** The points of a spiral round `start`: the start, then rings `step`
 * apart out to `reach`, each walked round in steps about `step` long. */
function* spiral(start: HomePoint, step: number, reach: number): Generator<HomePoint> {
  yield start;
  for (let ring = 1; ring * step <= reach; ring += 1) {
    const r = ring * step;
    const n = Math.min(64, Math.max(8, Math.ceil((2 * Math.PI * r) / step)));
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * 2 * Math.PI;
      yield [start[0] + r * Math.cos(a), start[1] + r * Math.sin(a)];
    }
  }
}

/** The room's reach from a point: the far corner of its box. */
function reachOf(polygon: readonly HomePoint[], from: HomePoint): number {
  return polygon.reduce((m, p) => Math.max(m, Math.hypot(p[0] - from[0], p[1] - from[1])), 0);
}

/** The room's name as a box round a point, in plan meters: half its width
 * and half its height. */
export interface HomeMapLabelBox {
  at: HomePoint;
  halfW: number;
  halfH: number;
}

/**
 * Where a new pin goes in a room, in plan meters: the spot nearest the
 * room's label point that is inside the room, `WALL_MARGIN` in from its
 * walls, at least `gap` from every one of `pins` and outside `label` (the
 * room's name). The label point itself when no spot is clear; undefined
 * for a room with no outline.
 */
export function homeMapFreePinSpot(
  room: Pick<HomeMapRoom, "outline">,
  pins: readonly { at: readonly number[] }[],
  label?: HomeMapLabelBox,
  gap = HOME_MAP_PIN_GAP,
): HomePoint | undefined {
  const start = homeLabelPoint(room);
  if (start === undefined) return undefined;
  const outline = room.outline;
  const clear = (p: HomePoint, margin: number) => homePolygonHolds(outline, p)
    && (outline.length < 3 || toEdges(p, outline) >= margin)
    && pins.every((pin) => Math.hypot(pin.at[0]! - p[0], pin.at[1]! - p[1]) >= gap)
    && (label === undefined || Math.abs(p[0] - label.at[0]) > label.halfW || Math.abs(p[1] - label.at[1]) > label.halfH);
  const reach = reachOf(outline, start);
  for (const margin of [WALL_MARGIN, 0]) {
    for (const p of spiral(start, 0.1, reach)) if (clear(p, margin)) return [round(p[0]), round(p[1])];
  }
  return start;
}

const round = (v: number) => Math.round(v * 1000) / 1000;

// ── a room's name on the plan ────────────────────────────────────────────

/** What a name on the plan must stay clear of, in stage pixels. */
export interface HomeMapLabelObstacles {
  /** The room's outline, which the whole pill stays inside. */
  room: readonly HomePoint[];
  /** The furniture's boxes, each a convex outline. */
  boxes: readonly (readonly HomePoint[])[];
  /** The pins, each a circle. */
  circles: readonly { c: HomePoint; r: number }[];
  /** The names placed already, each a box round its middle. */
  taken: readonly { c: HomePoint; half: readonly [number, number] }[];
}

/** Whether a convex outline and the box `c` ± `half` overlap, by their
 * separating axes. */
function boxMeetsConvex(c: HomePoint, half: readonly [number, number], poly: readonly HomePoint[]): boolean {
  if (poly.length === 0) return false;
  const corners: HomePoint[] = [
    [c[0] - half[0], c[1] - half[1]], [c[0] + half[0], c[1] - half[1]],
    [c[0] + half[0], c[1] + half[1]], [c[0] - half[0], c[1] + half[1]],
  ];
  const axes: HomePoint[] = [[1, 0], [0, 1]];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const ex = poly[i]![0] - poly[j]![0];
    const ey = poly[i]![1] - poly[j]![1];
    if (ex !== 0 || ey !== 0) axes.push([-ey, ex]);
  }
  for (const [ax, ay] of axes) {
    const span = (pts: readonly HomePoint[]) => {
      let lo = Infinity;
      let hi = -Infinity;
      for (const p of pts) {
        const v = p[0] * ax + p[1] * ay;
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
      return [lo, hi] as const;
    };
    const [a0, a1] = span(corners);
    const [b0, b1] = span(poly);
    if (a1 <= b0 || b1 <= a0) return false;
  }
  return true;
}

/** Whether the box `c` ± `half` and a circle overlap. */
function boxMeetsCircle(c: HomePoint, half: readonly [number, number], circle: { c: HomePoint; r: number }): boolean {
  const dx = Math.max(Math.abs(circle.c[0] - c[0]) - half[0], 0);
  const dy = Math.max(Math.abs(circle.c[1] - c[1]) - half[1], 0);
  return dx * dx + dy * dy < circle.r * circle.r;
}

/**
 * Where a room's name stands on the plan, in stage pixels: the middle of a
 * pill `half` wide and high, nearest `anchor` (the room's label point on
 * the stage), with the whole pill inside the room and clear of every
 * obstacle. Undefined when no spot within the room is clear.
 */
export function homeMapFreeLabelSpot(anchor: HomePoint, half: readonly [number, number], o: HomeMapLabelObstacles, step = 4): HomePoint | undefined {
  const inside = (p: HomePoint) => o.room.length < 3 || [
    [p[0] - half[0], p[1] - half[1]], [p[0] + half[0], p[1] - half[1]],
    [p[0] + half[0], p[1] + half[1]], [p[0] - half[0], p[1] + half[1]],
  ].every((q) => homePolygonHolds(o.room, q));
  const clear = (p: HomePoint) => inside(p)
    && o.boxes.every((b) => !boxMeetsConvex(p, half, b))
    && o.circles.every((ci) => !boxMeetsCircle(p, half, ci))
    && o.taken.every((t) => Math.abs(t.c[0] - p[0]) >= t.half[0] + half[0] || Math.abs(t.c[1] - p[1]) >= t.half[1] + half[1]);
  const reach = reachOf(o.room, anchor);
  for (const p of spiral(anchor, step, Math.min(reach, 600))) if (clear(p)) return p;
  return undefined;
}
