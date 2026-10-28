// Plan geometry for the Home map tile's pictures, ported from the app's
// `HomeMapGeometry.swift` so the panel draws what the iPhone and the watch
// draw: which stretches of wall are solid once doors, openings and windows
// are cut out, where the windows and doorways are, how each door swings,
// each piece of furniture's turned box and which way its back faces, where a
// room's name goes, which way a room's boards run, what its floor is laid
// with and where the boards' or tiles' lines lie, how far a lit lamp's glow
// reaches, and the reading a sensor shows under its pin. The last section
// holds the plain plane geometry the map editor's edits need (`edit-ops.ts`):
// areas, turns, projections, crossings and cuts.
//
// Pure, with no drawing: `tile-art.ts` draws with these. Units are meters on
// the plan, x to the right and y down, as the map stores them (`model.ts`).

import type { HomeMapFloor, HomeMapObject, HomeMapOpening, HomeMapRoom, HomeMapStates, HomePoint } from "./model.js";

/** A stretch of wall or window from `a` to `b`, `t` thick. */
export interface HomeSegment {
  a: HomePoint;
  b: HomePoint;
  t: number;
}

/** A segment's length. */
export function segmentLength(s: Pick<HomeSegment, "a" | "b">): number {
  return Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
}

/** Stretches shorter than this are dropped, and openings closer to a wall
 * line than its half thickness plus this count as in it. */
export const HOME_TOLERANCE = 0.05;

/** A wall with no thickness of its own, or an outline edge drawn as a wall. */
export const HOME_WALL_THICKNESS = 0.1;

/** An opening a person walks through: a door or an opening, not a window. */
export function isGap(opening: Pick<HomeMapOpening, "kind">): boolean {
  return opening.kind !== "window";
}

/** The walls of a room as drawn: its `walls`, or the edges of its outline
 * when it has none. */
export function homeWallsOf(room: HomeMapRoom): HomeSegment[] {
  if (room.walls.length > 0) return room.walls.map((w) => ({ a: w.a, b: w.b, t: w.t }));
  const o = room.outline;
  if (o.length < 2) return [];
  return o.map((p, i) => ({ a: p, b: o[(i + 1) % o.length]!, t: HOME_WALL_THICKNESS }));
}

/** Whether both ends of `opening` lie on the line through `wall`, within
 * half the wall's thickness and the tolerance. */
export function onWallLine(opening: Pick<HomeMapOpening, "a" | "b">, wall: HomeSegment): boolean {
  const length = segmentLength(wall);
  if (length <= 0) return false;
  const reach = wall.t / 2 + HOME_TOLERANCE;
  const distance = (p: HomePoint) => Math.abs((wall.b[0] - wall.a[0]) * (wall.a[1] - p[1]) - (wall.a[0] - p[0]) * (wall.b[1] - wall.a[1])) / length;
  return distance(opening.a) <= reach && distance(opening.b) <= reach;
}

/** `wall` less every opening that lies along it. */
export function cutWall(wall: HomeSegment, openings: readonly HomeMapOpening[]): HomeSegment[] {
  const length = segmentLength(wall);
  if (length <= HOME_TOLERANCE) return [];
  const ux = (wall.b[0] - wall.a[0]) / length;
  const uy = (wall.b[1] - wall.a[1]) / length;
  const along = (p: HomePoint) => (p[0] - wall.a[0]) * ux + (p[1] - wall.a[1]) * uy;
  const gaps: [number, number][] = [];
  for (const opening of openings) {
    if (!onWallLine(opening, wall)) continue;
    const s0 = Math.max(0, Math.min(along(opening.a), along(opening.b)));
    const s1 = Math.min(length, Math.max(along(opening.a), along(opening.b)));
    if (s1 - s0 > HOME_TOLERANCE / 5) gaps.push([s0, s1]);
  }
  gaps.sort((p, q) => p[0] - q[0]);
  const point = (s: number): HomePoint => [wall.a[0] + ux * s, wall.a[1] + uy * s];
  const pieces: HomeSegment[] = [];
  let start = 0;
  for (const [g0, g1] of gaps) {
    if (g0 - start > HOME_TOLERANCE) pieces.push({ a: point(start), b: point(g0), t: wall.t });
    start = Math.max(start, g1);
  }
  if (length - start > HOME_TOLERANCE) pieces.push({ a: start === 0 ? wall.a : point(start), b: wall.b, t: wall.t });
  return pieces;
}

/** The solid stretches of every wall on the floor: each room's walls with
 * every door, opening and window on the floor cut out, so a door one room
 * recorded opens the wall its neighbour holds too. */
export function homeWallSegments(floor: HomeMapFloor): HomeSegment[] {
  const openings = floor.rooms.flatMap((r) => r.openings);
  return floor.rooms.flatMap((room) => homeWallsOf(room).flatMap((w) => cutWall(w, openings)));
}

/** The openings of one kind on the floor, each as thick as the wall it
 * lies in. */
function openingSegments(floor: HomeMapFloor, keep: (o: HomeMapOpening) => boolean): HomeSegment[] {
  return floor.rooms.flatMap((room) => {
    const walls = homeWallsOf(room);
    return room.openings.filter(keep).map((o) => ({ a: o.a, b: o.b, t: walls.find((w) => onWallLine(o, w))?.t ?? HOME_WALL_THICKNESS }));
  });
}

/** The windows on the floor, each as it lies along its wall. */
export function homeWindowSegments(floor: HomeMapFloor): HomeSegment[] {
  return openingSegments(floor, (o) => o.kind === "window");
}

/** The doors and openings on the floor, so the plan can lay a threshold of
 * floor across each gap. */
export function homeGapSegments(floor: HomeMapFloor): HomeSegment[] {
  return openingSegments(floor, isGap);
}

// ── door swings ─────────────────────────────────────────────────────────

/** A door drawn as on a builder's plan: its leaf standing open, square to
 * the wall, from the hinge into the room that holds it, and the quarter
 * circle its free end sweeps back to the wall. */
export interface HomeDoorSwing {
  hinge: HomePoint;
  /** The leaf's free end when the door is shut: on the wall. */
  shut: HomePoint;
  /** The leaf's free end when the door is open: square to the wall. */
  open: HomePoint;
}

/** A door wider than this opens as two leaves meeting in its middle. */
const DOUBLE_DOOR_WIDTH = 1.3;

/** One door's swings: one leaf hung at `a`, or two meeting in the middle
 * for a `double` door, or a wide door with no style; none for a `sliding`
 * door, which has no swing. The leaves open into `room`, towards where its
 * name goes. */
export function homeDoorSwingsOf(door: HomeMapOpening, room: HomeMapRoom): HomeDoorSwing[] {
  const width = Math.hypot(door.b[0] - door.a[0], door.b[1] - door.a[1]);
  if (width <= HOME_TOLERANCE || door.style === "sliding") return [];
  const ux = (door.b[0] - door.a[0]) / width;
  const uy = (door.b[1] - door.a[1]) / width;
  let nx = -uy;
  let ny = ux;
  const inside = homeLabelPoint(room);
  if (inside !== undefined) {
    const mid = [(door.a[0] + door.b[0]) / 2, (door.a[1] + door.b[1]) / 2];
    if ((inside[0] - mid[0]!) * nx + (inside[1] - mid[1]!) * ny < 0) {
      nx = -nx;
      ny = -ny;
    }
  }
  const swing = (hinge: HomePoint, shut: HomePoint): HomeDoorSwing => {
    const leaf = Math.hypot(shut[0] - hinge[0], shut[1] - hinge[1]);
    return { hinge, shut, open: [hinge[0] + nx * leaf, hinge[1] + ny * leaf] };
  };
  if (door.style !== "double" && width <= DOUBLE_DOOR_WIDTH) return [swing(door.a, door.b)];
  const mid: HomePoint = [(door.a[0] + door.b[0]) / 2, (door.a[1] + door.b[1]) / 2];
  return [swing(door.a, mid), swing(door.b, mid)];
}

/** Every door on the floor as its swings. */
export function homeDoorSwings(floor: HomeMapFloor): HomeDoorSwing[] {
  return floor.rooms.flatMap((room) => room.openings.filter((o) => o.kind === "door").flatMap((d) => homeDoorSwingsOf(d, room)));
}

// ── a room's run, size, middle ──────────────────────────────────────────

/** The way a room runs: the angle of its longest wall on the plan, in
 * radians, y down. The floor's boards run this way. 0 for a room with no
 * walls. */
export function homeRoomDirection(room: HomeMapRoom): number {
  let longest: HomeSegment | undefined;
  for (const w of homeWallsOf(room)) if (longest === undefined || segmentLength(w) > segmentLength(longest)) longest = w;
  return longest === undefined ? 0 : Math.atan2(longest.b[1] - longest.a[1], longest.b[0] - longest.a[0]);
}

/** The plan area some points cover, undefined for none. */
export function homePointBounds(points: readonly HomePoint[]): { minX: number; minY: number; maxX: number; maxY: number } | undefined {
  if (points.length === 0) return undefined;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** The area centroid of a polygon, undefined when its area is zero. */
export function homePolygonCentroid(polygon: readonly HomePoint[]): HomePoint | undefined {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const p = polygon[i]!;
    const q = polygon[(i + 1) % polygon.length]!;
    const cross = p[0] * q[1] - q[0] * p[1];
    area += cross;
    cx += (p[0] + q[0]) * cross;
    cy += (p[1] + q[1]) * cross;
  }
  if (Math.abs(area) <= 1e-9) return undefined;
  area /= 2;
  return [cx / (6 * area), cy / (6 * area)];
}

/** Whether `point` is inside `polygon` (even-odd). */
export function homePolygonHolds(polygon: readonly HomePoint[], point: readonly number[]): boolean {
  if (polygon.length < 3) return false;
  const x = point[0]!;
  const y = point[1]!;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

/** Where a room's name goes: the middle of its outline when that lies
 * inside it, else the middle of the widest stretch inside the room along
 * that row, so an L-shaped room still gets its name on its floor. */
export function homeLabelPoint(room: Pick<HomeMapRoom, "outline">): HomePoint | undefined {
  const outline = room.outline;
  if (outline.length === 0) return undefined;
  const middle = outline.length >= 3 ? homePolygonCentroid(outline) : undefined;
  if (middle === undefined) {
    const n = outline.length;
    return [outline.reduce((s, p) => s + p[0], 0) / n, outline.reduce((s, p) => s + p[1], 0) / n];
  }
  if (homePolygonHolds(outline, middle)) return middle;
  const xs: number[] = [];
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
    const a = outline[i]!;
    const b = outline[j]!;
    if (a[1] > middle[1] !== b[1] > middle[1]) xs.push(((b[0] - a[0]) * (middle[1] - a[1])) / (b[1] - a[1]) + a[0]);
  }
  xs.sort((p, q) => p - q);
  let best: [number, number] | undefined;
  for (let i = 0; i + 1 < xs.length; i += 2) {
    if (best === undefined || xs[i + 1]! - xs[i]! > best[1] - best[0]) best = [xs[i]!, xs[i + 1]!];
  }
  return best === undefined ? middle : [(best[0] + best[1]) / 2, middle[1]];
}

/** The room under a plan point, the last one drawn winning where rooms
 * overlap. */
export function homeRoomUnder(floor: HomeMapFloor, point: readonly number[]): HomeMapRoom | undefined {
  for (let i = floor.rooms.length - 1; i >= 0; i -= 1) if (homePolygonHolds(floor.rooms[i]!.outline, point)) return floor.rooms[i];
  return undefined;
}

// ── furniture ───────────────────────────────────────────────────────────

/** A piece of furniture as a turned box on the plan. `angle` is the
 * rotation a y-down drawing turns it by, in radians: minus the object's
 * `turn`, since a positive turn is counterclockwise on the plan. */
export interface HomeBox {
  centre: HomePoint;
  width: number;
  depth: number;
  angle: number;
}

export function homeBoxOf(object: HomeMapObject): HomeBox {
  return { centre: object.c, width: Math.max(object.size[0], 0), depth: Math.max(object.size[1], 0), angle: (-object.turn * Math.PI) / 180 };
}

/** A box's four corners, going round from the one at minus half the width
 * and minus half the depth before the turn. */
export function homeBoxCorners(box: HomeBox): HomePoint[] {
  const c = Math.cos(box.angle);
  const s = Math.sin(box.angle);
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => {
    const x = (sx! * box.width) / 2;
    const y = (sy! * box.depth) / 2;
    return [box.centre[0] + x * c - y * s, box.centre[1] + x * s + y * c] as HomePoint;
  });
}

/** How far a table can be from a chair that faces it, centre to centre. */
const CHAIR_REACH = 1.4;

/** How far `p` is from the nearest point of `segment`. */
export function homeDistanceToSegment(p: readonly number[], segment: Pick<HomeSegment, "a" | "b">): number {
  const dx = segment.b[0] - segment.a[0];
  const dy = segment.b[1] - segment.a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 <= 0) return Math.hypot(p[0]! - segment.a[0], p[1]! - segment.a[1]);
  const t = Math.min(Math.max(((p[0]! - segment.a[0]) * dx + (p[1]! - segment.a[1]) * dy) / len2, 0), 1);
  return Math.hypot(p[0]! - (segment.a[0] + t * dx), p[1]! - (segment.a[1] + t * dy));
}

/** Which end of a piece's depth is its back: +1 for the end at plus half
 * its depth, -1 for the other. A bed's head and a sofa's back stand against
 * the nearest wall; a chair faces the table nearest it, so its back is the
 * end away from that table, and with no table near it backs onto the
 * nearest wall too. */
export function homeBackSign(object: HomeMapObject, among: readonly HomeMapObject[], walls: readonly HomeSegment[]): number {
  const box = homeBoxOf(object);
  const c = Math.cos(box.angle);
  const s = Math.sin(box.angle);
  const plus: HomePoint = [box.centre[0] - (box.depth / 2) * s, box.centre[1] + (box.depth / 2) * c];
  const minus: HomePoint = [box.centre[0] + (box.depth / 2) * s, box.centre[1] - (box.depth / 2) * c];
  if (object.kind === "chair") {
    let table: HomePoint | undefined;
    for (const o of among) {
      if (o.kind !== "table") continue;
      if (table === undefined || Math.hypot(o.c[0] - object.c[0], o.c[1] - object.c[1]) < Math.hypot(table[0] - object.c[0], table[1] - object.c[1])) table = o.c;
    }
    if (table !== undefined && Math.hypot(table[0] - object.c[0], table[1] - object.c[1]) < CHAIR_REACH) {
      return Math.hypot(plus[0] - table[0], plus[1] - table[1]) >= Math.hypot(minus[0] - table[0], minus[1] - table[1]) ? 1 : -1;
    }
  }
  const nearest = (p: HomePoint) => walls.reduce((m, w) => Math.min(m, homeDistanceToSegment(p, w)), Infinity);
  return nearest(plus) <= nearest(minus) ? 1 : -1;
}

// ── what a room's floor is ──────────────────────────────────────────────

/** What a room's floor is laid with: boards, large tiles, small stone
 * tiles, carpet, or a plain floor with no lines. The room's `finish` when it
 * names one, else a good guess from the room's name and furniture, not the
 * room's real floor. */
export type HomeFloorKind = "wood" | "tile" | "stone" | "carpet" | "plain";

/** The words in a room's name that say what it is, each with its floor.
 * Earlier words win, so "Bathroom" is stone though it holds "room". */
const FLOOR_WORDS: readonly [string, HomeFloorKind][] = [
  ["bath", "stone"], ["shower", "stone"], ["toilet", "stone"], ["wc", "stone"],
  ["powder", "stone"], ["ensuite", "stone"], ["en suite", "stone"], ["washroom", "stone"],
  ["kitchen", "tile"], ["laundry", "tile"], ["utility", "tile"], ["pantry", "tile"],
  ["scullery", "tile"], ["mudroom", "tile"], ["garage", "tile"],
  ["bedroom", "carpet"], ["nursery", "carpet"], ["guest", "carpet"], ["kids", "carpet"],
  ["master", "carpet"], ["bed", "carpet"],
];

/** A room's floor: its `finish` when it has one, else from its name, then
 * from what the scan found in it (a toilet or a bath is a bathroom, a hob,
 * fridge, dishwasher or washer a kitchen or utility room, a bed a bedroom),
 * else boards. */
export function homeFloorKind(room: Pick<HomeMapRoom, "name" | "objects" | "finish">): HomeFloorKind {
  if (room.finish !== undefined) return room.finish;
  return homeFloorGuess(room);
}

/** The floor a room's name and furniture suggest, whatever its `finish`:
 * what an editor shows as "Auto". */
export function homeFloorGuess(room: Pick<HomeMapRoom, "name" | "objects">): HomeFloorKind {
  const name = room.name?.toLowerCase() ?? "";
  if (name !== "") {
    const words = new Set(name.split(/[^\p{L}]+/u).filter((w) => w !== ""));
    for (const [word, kind] of FLOOR_WORDS) {
      // A short word must stand alone ("wc", "bed"); a longer one may sit
      // inside another ("Bathroom", "Kitchenette").
      if (word.length <= 3 ? words.has(word) : name.includes(word)) return kind;
    }
  }
  const kinds = new Set(room.objects.filter((o) => o.hidden !== true).map((o) => o.kind));
  const any = (list: string[]) => list.some((k) => kinds.has(k));
  if (any(["toilet", "bathtub"])) return "stone";
  if (any(["oven", "stove", "refrigerator", "dishwasher", "washerDryer"])) return "tile";
  if (kinds.has("bed")) return "carpet";
  return "wood";
}

/** How far apart a floor's lines lie, in meters: a board's width, a tile's
 * side. Undefined for carpet and a plain floor, which have none. */
export function homeFloorSpacing(kind: HomeFloorKind): number | undefined {
  switch (kind) {
    case "wood": return 0.18;
    case "tile": return 0.6;
    case "stone": return 0.3;
    case "carpet":
    case "plain": return undefined;
  }
}

/** A board's length, so the boards' ends can be staggered. */
const BOARD_LENGTH = 1.2;

/** A room's outline measured along `direction` and across it. */
function reachOf(room: Pick<HomeMapRoom, "outline">, direction: number) {
  const ux = Math.cos(direction);
  const uy = Math.sin(direction);
  const along = room.outline.map(([x, y]) => x * ux + y * uy);
  const across = room.outline.map(([x, y]) => -x * uy + y * ux);
  return {
    a0: Math.min(...along), a1: Math.max(...along), c0: Math.min(...across), c1: Math.max(...across),
    point: (a: number, c: number): HomePoint => [a * ux - c * uy, a * uy + c * ux],
  };
}

/** The lines of a room's floor, running along `direction` and covering the
 * room's outline; the caller clips them to it. Boards: a line between each
 * row and the rows' ends a third of a board apart from row to row. Tiles
 * and stone: a square grid. Carpet: none. */
export function homeFloorLines(room: Pick<HomeMapRoom, "outline">, kind: HomeFloorKind, direction: number): [HomePoint, HomePoint][] {
  const spacing = homeFloorSpacing(kind);
  if (spacing === undefined || room.outline.length < 3) return [];
  const { a0, a1, c0, c1, point } = reachOf(room, direction);
  const lines: [HomePoint, HomePoint][] = [];
  for (let c = c0 + spacing; c < c1; c += spacing) lines.push([point(a0, c), point(a1, c)]);
  if (kind === "wood") {
    let row = 0;
    for (let c = c0; c < c1; c += spacing, row += 1) {
      for (let a = a0 + ((row % 3) * BOARD_LENGTH) / 3 + BOARD_LENGTH; a < a1; a += BOARD_LENGTH) {
        lines.push([point(a, c), point(a, Math.min(c + spacing, c1))]);
      }
    }
  } else {
    for (let a = a0 + spacing; a < a1; a += spacing) lines.push([point(a, c0), point(a, c1)]);
  }
  return lines;
}

/** A square grid over a room, `spacing` apart, along `direction`: the
 * blueprint's measuring grid. */
export function homeGridLines(room: Pick<HomeMapRoom, "outline">, spacing: number, direction: number): [HomePoint, HomePoint][] {
  if (room.outline.length < 3) return [];
  const { a0, a1, c0, c1, point } = reachOf(room, direction);
  const lines: [HomePoint, HomePoint][] = [];
  for (let c = c0 + spacing; c < c1; c += spacing) lines.push([point(a0, c), point(a1, c)]);
  for (let a = a0 + spacing; a < a1; a += spacing) lines.push([point(a, c0), point(a, c1)]);
  return lines;
}

/** A room's length and width along its own walls, for the blueprint's
 * measures: the reach along `direction` and across it, with the outline's
 * ends along each. */
export function homeRoomReach(room: Pick<HomeMapRoom, "outline">, direction: number) {
  return reachOf(room, direction);
}

// ── lamps and readings ──────────────────────────────────────────────────

/** The glow on the floor round a lit light, in meters: 0.6 m at the lowest
 * brightness to 2.4 m at full. `brightness` is 0 to 1; undefined is full. */
export function homeGlowRadius(brightness: number | undefined): number {
  const level = Math.min(Math.max(brightness ?? 1, 0), 1);
  return 0.6 + 1.8 * level;
}

/** A number and its unit as the map shows it under a pin: "21.5°" for a
 * temperature, "52%" for a percentage, "627 W" for anything else with a
 * unit. At most one decimal, none for a value of 100 or more. Undefined for
 * a state that is not a number, or a number with no unit. */
export function homeReadingText(state: unknown, unit: unknown): string | undefined {
  const u = typeof unit === "string" ? unit.trim() : "";
  const raw = typeof state === "number" ? state : typeof state === "string" && state.trim() !== "" ? Number(state.trim()) : NaN;
  if (u === "" || !Number.isFinite(raw)) return undefined;
  const number = Math.abs(raw) >= 100 || raw === Math.round(raw) ? raw.toFixed(0) : raw.toFixed(1);
  if (["°C", "°F", "℃", "℉", "°"].includes(u)) return `${number}°`;
  if (u === "%") return `${number}%`;
  return `${number} ${u}`;
}

/** The reading a pin shows under it: a thermostat's room temperature, or a
 * sensor's value with its unit. Undefined for anything else. */
export function homePinReading(entityId: string, states: HomeMapStates | undefined): string | undefined {
  const entity = states?.[entityId];
  if (entity === undefined) return undefined;
  const domain = entityId.slice(0, entityId.indexOf("."));
  if (domain === "climate") return homeReadingText(entity.attributes?.current_temperature, "°");
  if (domain === "sensor") return homeReadingText(entity.state, entity.attributes?.unit_of_measurement);
  return undefined;
}

// ── for the editor ──────────────────────────────────────────────────────

/** A polygon's area by the shoelace sum, signed: positive when its points
 * go clockwise on the y-down plan. */
export function homePolygonArea(polygon: readonly HomePoint[]): number {
  let sum = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const p = polygon[i]!;
    const q = polygon[(i + 1) % polygon.length]!;
    sum += p[0] * q[1] - q[0] * p[1];
  }
  return sum / 2;
}

/** The plan box a room covers: its outline and its walls. */
export function homeRoomBounds(room: Pick<HomeMapRoom, "outline" | "walls">): { minX: number; minY: number; maxX: number; maxY: number } | undefined {
  return homePointBounds([...room.outline, ...room.walls.flatMap((w) => [w.a, w.b])]);
}

/** `p` turned `degrees` round `pivot`, clockwise on the y-down plan. */
export function homeTurnPoint(p: readonly number[], pivot: readonly number[], degrees: number): HomePoint {
  const angle = (degrees * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const x = p[0]! - pivot[0]!;
  const y = p[1]! - pivot[1]!;
  return [pivot[0]! + x * c - y * s, pivot[1]! + x * s + y * c];
}

/** Degrees folded into (-180, 180]. */
export function homeNormalDegrees(degrees: number): number {
  let value = degrees % 360;
  if (value <= -180) value += 360;
  if (value > 180) value -= 360;
  return value === 0 ? 0 : value;
}

/** An angle less whole quarter turns, between -45 and 45 degrees' worth,
 * in radians. */
export function homeQuarterTurnRemainder(angle: number): number {
  const quarter = Math.PI / 2;
  let value = angle % quarter;
  if (value > quarter / 2) value -= quarter;
  if (value < -quarter / 2) value += quarter;
  return value;
}

/** The way most of some walls run, in radians, as the app finds it
 * (`HomeMapScanConverter.mainDirection`): each wall's angle times four
 * summed by length, so walls at right angles count as one direction. 0 for
 * none. */
export function homeMainDirection(walls: readonly Pick<HomeSegment, "a" | "b">[]): number {
  let c = 0;
  let s = 0;
  for (const w of walls) {
    const angle = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]);
    const length = segmentLength(w);
    c += length * Math.cos(4 * angle);
    s += length * Math.sin(4 * angle);
  }
  return Math.hypot(c, s) > 1e-9 ? Math.atan2(s, c) / 4 : 0;
}

/** Where `p` falls on the line through `a` and `b`: the meters along it
 * from `a`, the fraction of the way to `b`, the foot of the square from
 * `p`, and how far `p` is from the line, positive when it lies on the right
 * of a to b as seen on the y-down plan. */
export function homeProject(p: readonly number[], a: HomePoint, b: HomePoint): { along: number; t: number; point: HomePoint; offset: number } {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (length <= 1e-12) return { along: 0, t: 0, point: a, offset: Math.hypot(p[0]! - a[0], p[1]! - a[1]) };
  const ux = (b[0] - a[0]) / length;
  const uy = (b[1] - a[1]) / length;
  const along = (p[0]! - a[0]) * ux + (p[1]! - a[1]) * uy;
  const offset = (p[1]! - a[1]) * ux - (p[0]! - a[0]) * uy;
  return { along, t: along / length, point: [a[0] + ux * along, a[1] + uy * along], offset };
}

/** Which side of the line from `a` to `b` a point lies: the cross product,
 * positive on one side, negative on the other, 0 on it. */
export function homeSide(p: readonly number[], a: HomePoint, b: HomePoint): number {
  return (b[0] - a[0]) * (p[1]! - a[1]) - (b[1] - a[1]) * (p[0]! - a[0]);
}

/** Where the lines through `p` along `d` and through `q` along `e` cross;
 * undefined for parallel lines. */
export function homeLineCrossing(p: HomePoint, d: HomePoint, q: HomePoint, e: HomePoint): HomePoint | undefined {
  const den = d[0] * e[1] - d[1] * e[0];
  if (Math.abs(den) < 1e-9) return undefined;
  const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den;
  return [p[0] + d[0] * t, p[1] + d[1] * t];
}

/** Where two segments cross, their ends included; undefined when they do
 * not, or lie along one line. */
export function homeSegmentCrossing(a1: HomePoint, a2: HomePoint, b1: HomePoint, b2: HomePoint): HomePoint | undefined {
  const d: HomePoint = [a2[0] - a1[0], a2[1] - a1[1]];
  const e: HomePoint = [b2[0] - b1[0], b2[1] - b1[1]];
  const den = d[0] * e[1] - d[1] * e[0];
  if (Math.abs(den) < 1e-12) return undefined;
  const t = ((b1[0] - a1[0]) * e[1] - (b1[1] - a1[1]) * e[0]) / den;
  const u = ((b1[0] - a1[0]) * d[1] - (b1[1] - a1[1]) * d[0]) / den;
  const eps = 1e-9;
  if (t < -eps || t > 1 + eps || u < -eps || u > 1 + eps) return undefined;
  return [a1[0] + d[0] * t, a1[1] + d[1] * t];
}

/** The part of a polygon on one side of the line from `a` to `b`: where
 * `homeSide` is at least 0 (`keep` 1) or at most 0 (`keep` -1). A concave
 * polygon cut into two pieces on one side comes back as one ring joined
 * along the line. */
export function homeClipPolygon(polygon: readonly HomePoint[], a: HomePoint, b: HomePoint, keep: 1 | -1): HomePoint[] {
  const out: HomePoint[] = [];
  const side = (p: HomePoint) => keep * homeSide(p, a, b);
  for (let i = 0; i < polygon.length; i += 1) {
    const p = polygon[i]!;
    const q = polygon[(i + 1) % polygon.length]!;
    const sp = side(p);
    const sq = side(q);
    if (sp >= 0) out.push(p);
    if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

/** The part of a segment on one side of the line from `a` to `b`, as
 * `homeClipPolygon` keeps it; undefined when none of it is. */
export function homeClipSegment(p: HomePoint, q: HomePoint, a: HomePoint, b: HomePoint, keep: 1 | -1): [HomePoint, HomePoint] | undefined {
  const sp = keep * homeSide(p, a, b);
  const sq = keep * homeSide(q, a, b);
  if (sp < 0 && sq < 0) return undefined;
  if (sp >= 0 && sq >= 0) return [p, q];
  const t = sp / (sp - sq);
  const cut: HomePoint = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  return sp >= 0 ? [p, cut] : [cut, q];
}
