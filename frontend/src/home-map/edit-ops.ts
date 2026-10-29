// The map editor's edits, as pure functions of the map document: each takes
// a document and returns a new one with the change made, never changing the
// one it was given, or undefined when the change no longer fits (its room,
// pin or opening is gone, or a value the store would refuse). Nothing here
// draws or touches the page; the editor's modes (`mode-*.ts`) hand these to
// the shell (`home-map-editor.ts`), which makes and saves them.
//
// The editor has four modes, each with its own edits:
//
// - Arrange: move and turn a room with everything in it and the pins that
//   belong to it, snap a dragged room to its neighbours' wall lines, resize
//   it along its own walls as a stretch (its sides snapping the same way),
//   line it up with the floor (Level, Snap to Walls, as the iPhone's), move
//   it to another floor, delete it, draw a room by hand, and set a room's
//   name, area, page, floor finish and wall height and the things in it.
// - Shape: move a corner (a corner another room shares moves with it), type
//   a wall's length, straighten a wall, square a room's corners, add or
//   take away a corner, split a room in two, inner walls, doors, windows and
//   ways through, and stairs. Then the scan check: rooms that overlap,
//   corners a little off square, small gaps between rooms that should touch
//   and rooms with no way into their neighbours, each with its fix. And
//   the scan as it was: each room's scan as Home Assistant kept it, drawn
//   over the plan, and Back to the scan, which puts a room's shape back.
// - Devices: add, move, raise and remove pins, one or several picked at
//   once, set what a pin shows and does (on several pins as one edit),
//   and place every device of an area into its room at once.
// - Style: the home style every Home map tile starts with, and a tile's
//   options as the tile rule reads them.
//
// And an undo and redo stack of documents.
//
// Every edit names rooms and pins by their ids, so the same call made on a
// newer document (a save refused `conflict`, `save.ts`) makes the same
// change there. Numbers the edits write are kept to 2 decimals (1 cm), as
// the store keeps them, so the document the editor holds is the one Home
// Assistant stores. A drag should edit from the document it started on, not
// add up many small rounded moves.
//
// Units are meters on the plan, x to the right and y down; a turn in
// degrees is clockwise on screen, as the iPhone's "Move room" turns.

import {
  type HomeSegment,
  HOME_TOLERANCE,
  HOME_WALL_THICKNESS,
  homeBoxCorners,
  homeBoxOf,
  homeClipPolygon,
  homeClipSegment,
  homeLabelPoint,
  homeLineCrossing,
  homeMainDirection,
  homeNormalDegrees,
  homePointBounds,
  homePolygonArea,
  homePolygonHolds,
  homeProject,
  homeQuarterTurnRemainder,
  homeRoomDirection,
  homeRoomReach,
  homeSide,
  homeTurnPoint,
  homeWallsOf,
  isGap,
  onWallLine,
  segmentLength,
} from "./geometry.js";
import { type HomeMapFurniturePiece, homeMapPieceLift } from "./furniture-rules.js";
import {
  type HomeMapDevicesShown,
  type HomeMapDocument,
  type HomeMapFinish,
  type HomeMapFloor,
  type HomeMapLook,
  type HomeMapObject,
  type HomeMapOpening,
  type HomeMapOpeningKind,
  type HomeMapOpeningStyle,
  type HomeMapPin,
  type HomeMapPinIcon,
  type HomeMapPinReading,
  type HomeMapPinTap,
  type HomeMapRoom,
  type HomeMapScan,
  type HomeMapScans,
  type HomeMapStyle,
  type HomeMapWall,
  type HomePoint,
  HOME_MAP_DEVICES_SHOWN,
  HOME_MAP_FINISHES,
  HOME_MAP_GLOW_HIGH,
  HOME_MAP_GLOW_LOW,
  HOME_MAP_LOOKS,
  HOME_MAP_MAX_FLOORS,
  HOME_MAP_MAX_NAME,
  HOME_MAP_MAX_PINS,
  HOME_MAP_MAX_ROOMS,
  HOME_MAP_PIN_ICONS,
  HOME_MAP_PIN_READINGS,
  HOME_MAP_PIN_TAPS,
  HOME_MAP_STYLE_DEFAULTS,
  homeMapRoomCenter,
  homeMapRoomName,
  homeMapRound,
  homeMapScanOf,
  isHomeMapAreaId,
  isHomeMapEntityId,
  isHomeMapGlowColor,
  isHomeMapId,
  isHomeMapModelName,
  isHomeMapPartColor,
  orderedDocument,
  orderedObject,
  orderedOpening,
  orderedPin,
  orderedRoom,
  sameHomeMapId,
} from "./model.js";

/** An edit that can be made again on a newer document. */
export type HomeMapOp = (doc: HomeMapDocument) => HomeMapDocument | undefined;

// ── finding and replacing ────────────────────────────────────────────────

const r = homeMapRound;
const roundPoint = (p: readonly number[]): HomePoint => [r(p[0]!), r(p[1]!)];
const distance = (p: readonly number[], q: readonly number[]) => Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!);
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const finite = (...values: number[]) => values.every((v) => typeof v === "number" && Number.isFinite(v));

interface RoomAt {
  fi: number;
  ri: number;
  floor: HomeMapFloor;
  room: HomeMapRoom;
}

function roomAt(doc: HomeMapDocument, roomId: string): RoomAt | undefined {
  for (const [fi, floor] of doc.floors.entries()) {
    const ri = floor.rooms.findIndex((room) => sameHomeMapId(room.id, roomId));
    if (ri >= 0) return { fi, ri, floor, room: floor.rooms[ri]! };
  }
  return undefined;
}

interface PinAt {
  fi: number;
  pi: number;
  floor: HomeMapFloor;
  pin: HomeMapPin;
}

function pinAt(doc: HomeMapDocument, pinId: string): PinAt | undefined {
  for (const [fi, floor] of doc.floors.entries()) {
    const pi = floor.pins.findIndex((pin) => sameHomeMapId(pin.id, pinId));
    if (pi >= 0) return { fi, pi, floor, pin: floor.pins[pi]! };
  }
  return undefined;
}

function floorIndex(doc: HomeMapDocument, floorId: string): number {
  return doc.floors.findIndex((f) => sameHomeMapId(f.id, floorId));
}

function withFloor(doc: HomeMapDocument, fi: number, floor: HomeMapFloor): HomeMapDocument {
  const floors = doc.floors.slice();
  floors[fi] = floor;
  return orderedDocument({ ...doc, floors });
}

function withRoom(doc: HomeMapDocument, at: RoomAt, room: HomeMapRoom): HomeMapDocument {
  const rooms = at.floor.rooms.slice();
  rooms[at.ri] = orderedRoom(room);
  return withFloor(doc, at.fi, { ...at.floor, rooms });
}

function editRoom(doc: HomeMapDocument, roomId: string, change: (room: HomeMapRoom, at: RoomAt) => HomeMapRoom | undefined): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  const next = change(at.room, at);
  return next === undefined ? undefined : withRoom(doc, at, next);
}

function editPin(doc: HomeMapDocument, pinId: string, change: (pin: HomeMapPin, at: PinAt) => HomeMapPin | undefined): HomeMapDocument | undefined {
  const at = pinAt(doc, pinId);
  if (at === undefined) return undefined;
  const next = change(at.pin, at);
  if (next === undefined) return undefined;
  const pins = at.floor.pins.slice();
  pins[at.pi] = orderedPin(next);
  return withFloor(doc, at.fi, { ...at.floor, pins });
}

/** Whether an id is taken anywhere on the map: a floor, room or pin. */
function idTaken(doc: HomeMapDocument, id: string): boolean {
  return doc.floors.some((f) => sameHomeMapId(f.id, id) || f.rooms.some((x) => sameHomeMapId(x.id, id)) || f.pins.some((p) => sameHomeMapId(p.id, id)));
}

function roomCount(doc: HomeMapDocument): number {
  return doc.floors.reduce((n, f) => n + f.rooms.length, 0);
}

function pinCount(doc: HomeMapDocument): number {
  return doc.floors.reduce((n, f) => n + f.pins.length, 0);
}

/** Text as the map keeps a name: trimmed, at most 100 characters, none
 * when blank. */
function nameOf(name: string | undefined): string | undefined {
  const trimmed = (name ?? "").trim().slice(0, HOME_MAP_MAX_NAME);
  return trimmed === "" ? undefined : trimmed;
}

/** The pins that belong to a room: the ones that name it, and the ones that
 * name no room of the floor and stand inside it. */
export function homeMapPinsOfRoom(floor: HomeMapFloor, roomId: string): HomeMapPin[] {
  const room = floor.rooms.find((x) => sameHomeMapId(x.id, roomId));
  if (room === undefined) return [];
  return floor.pins.filter((p) => {
    if (sameHomeMapId(p.roomId, room.id)) return true;
    const named = p.roomId !== undefined && floor.rooms.some((x) => sameHomeMapId(x.id, p.roomId));
    return !named && homePolygonHolds(room.outline, p.at);
  });
}

/** A room's walls as drawn and as the edits number them: its `walls`, or
 * the edges of its outline when it has none (edge i from corner i to
 * corner i + 1). */
export function homeMapRoomWalls(room: HomeMapRoom): HomeSegment[] {
  return homeWallsOf(room);
}

/** A room whose walls are its outline's edges, with those written out as
 * walls, so one wall can change without the others vanishing. */
function withOwnWalls(room: HomeMapRoom): HomeMapRoom {
  if (room.walls.length > 0) return room;
  return { ...room, walls: homeWallsOf(room).map((w) => ({ a: w.a, b: w.b, t: w.t })) };
}

// ── turning and moving a room ────────────────────────────────────────────

/** A turn and a move on the plan, as the iPhone's `HomeMapPlacement`: turn
 * `angle` degrees clockwise on screen round `pivot`, then move by
 * `offset`. */
export interface HomeMapPlacement {
  angle: number;
  pivot: HomePoint;
  offset: HomePoint;
}

/** Where a placement puts a point, unrounded. */
export function homePlace(placement: HomeMapPlacement, p: readonly number[]): HomePoint {
  const turned = placement.angle === 0 ? [p[0]!, p[1]!] : homeTurnPoint(p, placement.pivot, placement.angle);
  return [turned[0]! + placement.offset[0], turned[1]! + placement.offset[1]];
}

function placedRoom(room: HomeMapRoom, placement: HomeMapPlacement): HomeMapRoom {
  const at = (p: readonly number[]) => roundPoint(homePlace(placement, p));
  return orderedRoom({
    ...room,
    outline: room.outline.map(at),
    walls: room.walls.map((w) => ({ a: at(w.a), b: at(w.b), t: w.t })),
    openings: room.openings.map((o) => orderedOpening({ ...o, a: at(o.a), b: at(o.b) })),
    objects: room.objects.map((o) => orderedObject({ ...o, c: at(o.c), turn: r(homeNormalDegrees(o.turn - placement.angle)) })),
  });
}

function placedPin(pin: HomeMapPin, placement: HomeMapPlacement): HomeMapPin {
  const [x, y] = roundPoint(homePlace(placement, pin.at));
  return orderedPin({ ...pin, at: [x, y, pin.at[2]] });
}

/** The room turned and moved by `placement`, with everything in it (walls,
 * doors, windows, furniture, each piece's turn too) and, unless `pins` is
 * false, the pins that belong to it (`homeMapPinsOfRoom`). */
export function placeRoom(doc: HomeMapDocument, roomId: string, placement: HomeMapPlacement, pins = true): HomeMapDocument | undefined {
  if (!finite(placement.angle, ...placement.pivot, ...placement.offset)) return undefined;
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  const moving = new Set(pins ? homeMapPinsOfRoom(at.floor, at.room.id).map((p) => p.id) : []);
  const rooms = at.floor.rooms.slice();
  rooms[at.ri] = placedRoom(at.room, placement);
  return withFloor(doc, at.fi, { ...at.floor, rooms, pins: at.floor.pins.map((p) => (moving.has(p.id) ? placedPin(p, placement) : p)) });
}

/** The room and its pins moved by `dx`, `dy`. */
export function moveRoom(doc: HomeMapDocument, roomId: string, dx: number, dy: number): HomeMapDocument | undefined {
  return placeRoom(doc, roomId, { angle: 0, pivot: [0, 0], offset: [dx, dy] });
}

/** The room and its pins turned `degrees` clockwise on screen round
 * `pivot`, by default the middle of its outline. */
export function turnRoom(doc: HomeMapDocument, roomId: string, degrees: number, pivot?: HomePoint): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  return placeRoom(doc, roomId, { angle: degrees, pivot: pivot ?? homeMapRoomCenter(at.room), offset: [0, 0] });
}

/** The turn, in degrees clockwise, that lines a room's longest wall up with
 * the plan's x or y: at most 45 either way. */
export function homeMapLevelTurn(room: HomeMapRoom): number {
  let longest: HomeSegment | undefined;
  for (const w of homeWallsOf(room)) if (longest === undefined || segmentLength(w) > segmentLength(longest)) longest = w;
  if (longest === undefined) return 0;
  const angle = Math.atan2(longest.b[1] - longest.a[1], longest.b[0] - longest.a[0]);
  return (-homeQuarterTurnRemainder(angle) * 180) / Math.PI;
}

/** The room turned round its middle so its longest wall runs along x or y. */
export function levelRoom(doc: HomeMapDocument, roomId: string): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  return turnRoom(doc, roomId, homeMapLevelTurn(at.room));
}

// ── snapping a room to its neighbours ────────────────────────────────────

/** The gap a snapped room leaves to a neighbour's wall: one wall's
 * thickness, as RoomPlan measures rooms to their walls' inner faces. */
export const HOME_MAP_SNAP_GAP = HOME_WALL_THICKNESS;
/** How far a dragged room jumps to line up with a wall, in meters. */
export const HOME_MAP_SNAP_TOLERANCE = 0.15;
/** How far along its line a neighbour's wall may end and still count. */
const SNAP_NEAR = 1.0;
/** Snap to Walls moves a room at most this far along each direction. */
const SNAP_REACH = 1.0;

/** A wall running across an axis: where it crosses the axis, which side of
 * it its room lies (1 along the axis, -1 against it), and where it starts
 * and ends along the wall's own direction. */
interface WallLine {
  at: number;
  side: number;
  lo: number;
  hi: number;
  roomId: string;
  t: number;
}

/** A room's walls longer than 30 cm that run within 5 degrees of square to
 * `axis`, each moved by `offset`. */
function linesAcross(room: HomeMapRoom, axis: HomePoint, offset: HomePoint = [0, 0]): WallLine[] {
  const middle = homeMapRoomCenter(room);
  const centre = middle[0] * axis[0] + middle[1] * axis[1];
  const along: HomePoint = [-axis[1], axis[0]];
  const shiftAt = offset[0] * axis[0] + offset[1] * axis[1];
  const shiftAlong = offset[0] * along[0] + offset[1] * along[1];
  const out: WallLine[] = [];
  for (const w of homeWallsOf(room)) {
    const length = segmentLength(w);
    if (length <= 0.3) continue;
    const dx = (w.b[0] - w.a[0]) / length;
    const dy = (w.b[1] - w.a[1]) / length;
    if (Math.abs(dx * axis[0] + dy * axis[1]) >= Math.sin((5 * Math.PI) / 180)) continue;
    const at = ((w.a[0] + w.b[0]) / 2) * axis[0] + ((w.a[1] + w.b[1]) / 2) * axis[1];
    const sa = w.a[0] * along[0] + w.a[1] * along[1];
    const sb = w.b[0] * along[0] + w.b[1] * along[1];
    out.push({ at: at + shiftAt, side: centre >= at ? 1 : -1, lo: Math.min(sa, sb) + shiftAlong, hi: Math.max(sa, sb) + shiftAlong, roomId: room.id, t: w.t });
  }
  return out;
}

/** Where a wall of one room may sit against a wall of another: in line with
 * it when both rooms lie on the same side (two tops), on it or one wall's
 * thickness past it when they face each other. */
function snapGaps(own: WallLine, theirs: WallLine): number[] {
  if (own.side === theirs.side) return [0];
  return own.side > 0 ? [0, HOME_MAP_SNAP_GAP] : [0, -HOME_MAP_SNAP_GAP];
}

/** The floor's two wall directions: the way most of `rooms`' walls run, and
 * square to it. */
function floorAxes(rooms: readonly HomeMapRoom[]): [HomePoint, HomePoint] {
  const direction = homeMainDirection(rooms.flatMap((x) => homeWallsOf(x)));
  return [
    [Math.cos(direction), Math.sin(direction)],
    [-Math.sin(direction), Math.cos(direction)],
  ];
}

/** A line to draw while a room snaps: the neighbour's wall it lined up
 * with, drawn long enough to reach both walls. */
export interface HomeMapSnapGuide {
  a: HomePoint;
  b: HomePoint;
  /** The neighbour. */
  roomId: string;
}

/** A dragged room's move once snapped, and the lines to draw. */
export interface HomeMapSnap {
  dx: number;
  dy: number;
  guides: HomeMapSnapGuide[];
}

/**
 * Where a room dragged by `dx`, `dy` snaps: along each of the floor's two
 * wall directions, the nearest of its walls that lies within `tolerance` of
 * a neighbour's wall line (in line with it, on it, or one wall's thickness
 * past it when the two face each other), within a meter of that wall along
 * its line. The move comes back with that pull added (unchanged when
 * nothing is near), and a guide along each neighbour wall it lined up with.
 * Undefined when the floor has no such room.
 */
export function snapRoom(doc: HomeMapDocument, roomId: string, dx: number, dy: number, tolerance = HOME_MAP_SNAP_TOLERANCE): HomeMapSnap | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined || !finite(dx, dy)) return undefined;
  const others = at.floor.rooms.filter((x) => x !== at.room);
  if (others.length === 0) return { dx, dy, guides: [] };
  const axes = floorAxes(others);
  let offset: HomePoint = [dx, dy];
  const guides: HomeMapSnapGuide[] = [];
  for (const axis of axes) {
    const own = linesAcross(at.room, axis, offset);
    const theirs = others.flatMap((x) => linesAcross(x, axis));
    let best: number | undefined;
    for (const a of own) {
      for (const b of theirs) {
        if (Math.max(a.lo, b.lo) - Math.min(a.hi, b.hi) > SNAP_NEAR) continue;
        for (const gap of snapGaps(a, b)) {
          const delta = b.at + gap - a.at;
          if (Math.abs(delta) <= tolerance && (best === undefined || Math.abs(delta) < Math.abs(best))) best = delta;
        }
      }
    }
    if (best === undefined) continue;
    offset = [offset[0] + axis[0] * best, offset[1] + axis[1] * best];
    const along: HomePoint = [-axis[1], axis[0]];
    const point = (at2: number, s: number): HomePoint => [axis[0] * at2 + along[0] * s, axis[1] * at2 + along[1] * s];
    for (const a of own) {
      for (const b of theirs) {
        if (Math.max(a.lo, b.lo) - Math.min(a.hi, b.hi) > SNAP_NEAR) continue;
        if (!snapGaps(a, b).some((gap) => Math.abs(a.at + best! - (b.at + gap)) < 2e-3)) continue;
        const lo = Math.min(a.lo, b.lo);
        const hi = Math.max(a.hi, b.hi);
        guides.push({ a: point(b.at, lo), b: point(b.at, hi), roomId: b.roomId });
      }
    }
  }
  return { dx: offset[0], dy: offset[1], guides };
}

/** The grid step, in meters, an overlap is measured on. */
const SAMPLE_STEP = 0.12;

/** The share of `outline`'s floor that lies inside any of `others`,
 * measured on a grid, as the iPhone measures it. */
function overlapShare(outline: readonly HomePoint[], others: readonly (readonly HomePoint[])[]): number {
  const b = homePointBounds(outline);
  if (b === undefined || others.length === 0) return 0;
  let inside = 0;
  let shared = 0;
  for (let y = b.minY + SAMPLE_STEP / 2; y < b.maxY; y += SAMPLE_STEP) {
    for (let x = b.minX + SAMPLE_STEP / 2; x < b.maxX; x += SAMPLE_STEP) {
      if (!homePolygonHolds(outline, [x, y])) continue;
      inside += 1;
      if (others.some((o) => homePolygonHolds(o, [x, y]))) shared += 1;
    }
  }
  return inside === 0 ? 0 : shared / inside;
}

/**
 * The placement Snap to Walls gives a room among its neighbours, as the
 * iPhone's (`HomeMapScanQuality.snapPlacement`): turned round its middle to
 * the floor's walls, then moved along the floor's two wall directions by
 * the offsets (at most a meter) that put one of its walls on a neighbour's
 * wall or a wall's thickness from it. The move leaving the least overlap
 * wins, then the one lining up the most walls, then the smaller move.
 */
export function homeMapSnapPlacement(room: HomeMapRoom, others: readonly HomeMapRoom[]): HomeMapPlacement {
  const direction = homeMainDirection((others.length === 0 ? [room] : others).flatMap((x) => homeWallsOf(x)));
  const pivot = homeMapRoomCenter(room);
  const own = homeMainDirection(homeWallsOf(room));
  const turn = (-homeQuarterTurnRemainder(own - direction) * 180) / Math.PI;
  const turned = placedRoomExact(room, { angle: turn, pivot, offset: [0, 0] });
  const u: HomePoint = [Math.cos(direction), Math.sin(direction)];
  const v: HomePoint = [-Math.sin(direction), Math.cos(direction)];
  const along = (axis: HomePoint): { offset: number; lined: number }[] => {
    const mine = linesAcross(turned, axis);
    const theirs = others.flatMap((x) => linesAcross(x, axis));
    const offsets = new Set<number>([0]);
    for (const a of mine) for (const b of theirs) for (const gap of snapGaps(a, b)) {
      const offset = b.at + gap - a.at;
      if (Math.abs(offset) <= SNAP_REACH) offsets.add(Math.round(offset * 1000) / 1000);
    }
    return [...offsets].map((offset) => ({
      offset,
      lined: mine.filter((a) => theirs.some((b) => snapGaps(a, b).some((gap) => Math.abs(a.at + offset - (b.at + gap)) < 2e-3))).length,
    }));
  };
  const otherOutlines = others.map((x) => x.outline);
  let best: { offset: HomePoint; overlap: number; lined: number; move: number } | undefined;
  for (const du of along(u)) {
    for (const dv of along(v)) {
      const offset: HomePoint = [u[0] * du.offset + v[0] * dv.offset, u[1] * du.offset + v[1] * dv.offset];
      const moved = turned.outline.map((p): HomePoint => [p[0] + offset[0], p[1] + offset[1]]);
      const share = overlapShare(moved, otherOutlines);
      const lined = du.lined + dv.lined;
      const move = Math.abs(du.offset) + Math.abs(dv.offset);
      let better: boolean;
      if (best === undefined) better = true;
      else if (share < best.overlap - 0.005) better = true;
      else if (share > best.overlap + 0.005) better = false;
      else if (lined !== best.lined) better = lined > best.lined;
      else better = move < best.move - 1e-6;
      if (better) best = { offset, overlap: share, lined, move };
    }
  }
  return { angle: turn, pivot, offset: best?.offset ?? [0, 0] };
}

/** A room placed without rounding, for measuring. */
function placedRoomExact(room: HomeMapRoom, placement: HomeMapPlacement): HomeMapRoom {
  const at = (p: readonly number[]) => homePlace(placement, p);
  return { ...room, outline: room.outline.map(at), walls: room.walls.map((w) => ({ a: at(w.a), b: at(w.b), t: w.t })) };
}

/** Snap to Walls: the room and its pins set against its neighbours by
 * `homeMapSnapPlacement`. */
export function snapRoomToWalls(doc: HomeMapDocument, roomId: string): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  return placeRoom(doc, roomId, homeMapSnapPlacement(at.room, at.floor.rooms.filter((x) => x !== at.room)));
}

// ── resizing a room ──────────────────────────────────────────────────────
//
// A resize is a stretch of the room along its own two ways: the way its
// longest wall runs (as `homeMapLevelTurn` and the box round a picked room
// measure it) and square to that, so a turned scanned room resizes along its
// walls. Every point of the room moves by the same stretch: its outline, its
// walls (each keeping its thickness) and the pins that belong to it (their
// height kept). A door or window keeps its width, its middle moving with
// the stretch along its wall and kept inside it; a piece of furniture keeps
// its size and turn, its middle moving with the stretch and kept inside the
// room's box along a way the room shrank. Ids never change.

/** The least a resized room measures along each of its ways, in meters. */
export const HOME_MAP_MIN_ROOM_SIZE = 0.5;
/** The most, in meters. */
export const HOME_MAP_MAX_ROOM_SIZE = 100;

/** A room's box along its own walls: `u` the way its longest wall runs and
 * `v` square to it (both unit vectors on the plan), `a0` to `a1` its reach
 * along `u` and `c0` to `c1` along `v`. The box's corners, going round, are
 * (a0, c0), (a1, c0), (a1, c1), (a0, c1), as `homeMapRoomBox` draws it; the
 * plan point at `a`, `c` is `a * u + c * v`. */
export interface HomeMapRoomFrame {
  u: HomePoint;
  v: HomePoint;
  a0: number;
  a1: number;
  c0: number;
  c1: number;
}

/** A room's box along its own walls, undefined for a room with fewer than
 * three corners. */
export function homeMapRoomFrame(room: HomeMapRoom): HomeMapRoomFrame | undefined {
  if (room.outline.length < 3) return undefined;
  const direction = homeRoomDirection(room);
  const { a0, a1, c0, c1 } = homeRoomReach(room, direction);
  const u: HomePoint = [Math.cos(direction), Math.sin(direction)];
  return { u, v: [-u[1], u[0]], a0, a1, c0, c1 };
}

/** A room's new size: `width` along its frame's `u` and `depth` along `v`
 * (`homeMapRoomSize`'s two), either left out staying as it is, each 0.5 to
 * 100 m; and `anchor`, the point of its box that stays put, as shares of the
 * box along `u` and `v`: 0 the a0 or c0 side, 1 the far side, 0.5 (the
 * default) its middle. */
export interface HomeMapResize {
  width?: number;
  depth?: number;
  anchor?: readonly [number, number];
}

/** A resize as the stretch it makes: the plan point a point of the room
 * goes to (unrounded), the factors along `u` and `v`, and the box after. */
interface HomeMapStretch {
  map: (p: readonly number[]) => HomePoint;
  su: number;
  sv: number;
  a0: number;
  a1: number;
  c0: number;
  c1: number;
}

function stretchOf(frame: HomeMapRoomFrame, resize: HomeMapResize): HomeMapStretch | undefined {
  const w0 = frame.a1 - frame.a0;
  const d0 = frame.c1 - frame.c0;
  if (w0 <= 1e-6 || d0 <= 1e-6) return undefined;
  const size = (value: number | undefined, now: number) => (value === undefined ? now : clamp(value, HOME_MAP_MIN_ROOM_SIZE, HOME_MAP_MAX_ROOM_SIZE));
  if (!finite(resize.width ?? 0, resize.depth ?? 0, ...(resize.anchor ?? [0.5, 0.5]))) return undefined;
  const width = size(resize.width, w0);
  const depth = size(resize.depth, d0);
  const [ka, kc] = resize.anchor ?? [0.5, 0.5];
  const fa = frame.a0 + ka * w0;
  const fc = frame.c0 + kc * d0;
  const su = width / w0;
  const sv = depth / d0;
  const { u, v } = frame;
  const map = (p: readonly number[]): HomePoint => {
    const a = fa + (p[0]! * u[0] + p[1]! * u[1] - fa) * su;
    const c = fc + (p[0]! * v[0] + p[1]! * v[1] - fc) * sv;
    return [a * u[0] + c * v[0], a * u[1] + c * v[1]];
  };
  const a0 = fa + (frame.a0 - fa) * su;
  const c0 = fc + (frame.c0 - fc) * sv;
  return { map, su, sv, a0, a1: a0 + width, c0, c1: c0 + depth };
}

/** A door or window of `room` set in its stretched room `after`: its
 * middle moved by the stretch onto the same wall, its width kept (cut to
 * the wall's length if the wall got shorter) and kept inside the wall. One
 * in no wall keeps its width along its stretched direction. */
function openingStretched(room: HomeMapRoom, after: HomeMapRoom, opening: HomeMapOpening, stretch: HomeMapStretch): HomeMapOpening {
  const width = distance(opening.a, opening.b);
  const middle = stretch.map([(opening.a[0] + opening.b[0]) / 2, (opening.a[1] + opening.b[1]) / 2]);
  const i = homeMapOpeningWall(room, opening);
  const wall = i < 0 ? undefined : homeWallsOf(after)[i];
  if (wall === undefined || segmentLength(wall) <= 0) {
    const a = stretch.map(opening.a);
    const b = stretch.map(opening.b);
    const length = Math.max(distance(a, b), 1e-9);
    const d: HomePoint = [((b[0] - a[0]) / length) * (width / 2), ((b[1] - a[1]) / length) * (width / 2)];
    return orderedOpening({ ...opening, a: roundPoint([middle[0] - d[0], middle[1] - d[1]]), b: roundPoint([middle[0] + d[0], middle[1] + d[1]]) });
  }
  const before = homeWallsOf(room)[i]!;
  const length = segmentLength(wall);
  const w = Math.min(width, length);
  const centre = clamp(homeProject(middle, wall.a, wall.b).along, w / 2, length - w / 2);
  // The same way round along the wall as it was: a stretch never reverses
  // a wall, so the side of `a` along it is kept.
  const forward = homeProject(opening.b, before.a, before.b).along >= homeProject(opening.a, before.a, before.b).along;
  const [s0, s1] = forward ? [centre - w / 2, centre + w / 2] : [centre + w / 2, centre - w / 2];
  return orderedOpening({ ...opening, a: roundPoint(alongWall(wall, s0)), b: roundPoint(alongWall(wall, s1)) });
}

/** A piece of furniture's middle moved by the stretch; along a way the room
 * shrank it is kept inside the new box by its own reach (or set in the
 * box's middle when it no longer fits). Its size and turn stay. */
function objectStretched(object: HomeMapObject, frame: HomeMapRoomFrame, stretch: HomeMapStretch): HomeMapObject {
  let [x, y] = stretch.map(object.c);
  const corners = homeBoxCorners({ ...homeBoxOf(object), centre: [0, 0] });
  const keep = (axis: HomePoint, lo: number, hi: number, shrank: boolean) => {
    if (!shrank) return;
    const reach = Math.max(...corners.map((p) => Math.abs(p[0] * axis[0] + p[1] * axis[1])));
    const at = x * axis[0] + y * axis[1];
    const to = hi - lo <= reach * 2 ? (lo + hi) / 2 : clamp(at, lo + reach, hi - reach);
    x += axis[0] * (to - at);
    y += axis[1] * (to - at);
  };
  keep(frame.u, stretch.a0, stretch.a1, stretch.su < 1);
  keep(frame.v, stretch.c0, stretch.c1, stretch.sv < 1);
  return orderedObject({ ...object, c: roundPoint([x, y]) });
}

/**
 * The room resized along its own walls (`HomeMapResize`), as a stretch of
 * everything in it and the pins that belong to it (`homeMapPinsOfRoom`).
 * Undefined when the room is gone, has no area, or a number is not finite.
 */
export function resizeRoom(doc: HomeMapDocument, roomId: string, resize: HomeMapResize): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  const frame = at === undefined ? undefined : homeMapRoomFrame(at.room);
  const stretch = frame === undefined ? undefined : stretchOf(frame, resize);
  if (at === undefined || frame === undefined || stretch === undefined) return undefined;
  const room = at.room;
  const to = (p: readonly number[]) => roundPoint(stretch.map(p));
  const shaped: HomeMapRoom = {
    ...room,
    outline: room.outline.map(to),
    walls: room.walls.map((w) => ({ a: to(w.a), b: to(w.b), t: w.t })),
  };
  const stretched: HomeMapRoom = {
    ...shaped,
    openings: room.openings.map((o) => openingStretched(room, shaped, o, stretch)),
    objects: room.objects.map((o) => objectStretched(o, frame, stretch)),
  };
  const moving = new Set(homeMapPinsOfRoom(at.floor, room.id).map((p) => p.id));
  const rooms = at.floor.rooms.slice();
  rooms[at.ri] = orderedRoom(stretched);
  const pins = at.floor.pins.map((p) => {
    if (!moving.has(p.id)) return p;
    const [x, y] = to(p.at);
    return orderedPin({ ...p, at: [x, y, p.at[2]] });
  });
  return withFloor(doc, at.fi, { ...at.floor, rooms, pins });
}

/** Which sides of a room's box a resize drags: along `u` (`a`) and along
 * `v` (`c`), 0 the low side (a0, c0), 1 the high side, absent for neither. */
export interface HomeMapResizeSides {
  a?: 0 | 1;
  c?: 0 | 1;
}

/** A resize once its dragged sides snapped, and the lines to draw. */
export interface HomeMapResizeSnap {
  resize: HomeMapResize;
  guides: HomeMapSnapGuide[];
}

/**
 * Where the dragged `sides` of a room being resized snap, by `snapRoom`'s
 * rules: a dragged side within `tolerance` of a neighbour's wall that runs
 * the same way (within 5 degrees), within a meter of it along its line,
 * goes in line with it, or onto it or a wall's thickness past it when the
 * two rooms face each other; the nearest wins. With `proportional`, only
 * the nearest of the dragged sides snaps and the other way follows it, so
 * the room keeps its proportions. A snap that would make the room smaller
 * than 0.5 m is not taken. The resize comes back with the snapped sizes (as
 * it was when nothing is near) and a guide along each wall it lined up with.
 * Undefined when the room is gone or has no area.
 */
export function snapRoomResize(
  doc: HomeMapDocument,
  roomId: string,
  resize: HomeMapResize,
  sides: HomeMapResizeSides,
  options: { proportional?: boolean; tolerance?: number } = {},
): HomeMapResizeSnap | undefined {
  const at = roomAt(doc, roomId);
  const frame = at === undefined ? undefined : homeMapRoomFrame(at.room);
  const stretch = frame === undefined ? undefined : stretchOf(frame, resize);
  if (at === undefined || frame === undefined || stretch === undefined) return undefined;
  const others = at.floor.rooms.filter((x) => x !== at.room);
  const tolerance = options.tolerance ?? HOME_MAP_SNAP_TOLERANCE;
  const w0 = frame.a1 - frame.a0;
  const d0 = frame.c1 - frame.c0;
  // One dragged side as a wall line across its axis: `along` runs the way
  // `linesAcross` measures a line's ends for that axis.
  const lineOf = (key: "a" | "c", side: 0 | 1) => {
    const axis = key === "a" ? frame.u : frame.v;
    const along: HomePoint = [-axis[1], axis[0]];
    const ends = key === "a" ? [stretch.c0, stretch.c1] : [-stretch.a1, -stretch.a0];
    const own: WallLine = {
      at: key === "a" ? (side === 1 ? stretch.a1 : stretch.a0) : (side === 1 ? stretch.c1 : stretch.c0),
      side: side === 1 ? -1 : 1,
      lo: ends[0]!,
      hi: ends[1]!,
      roomId: at.room.id,
      t: HOME_WALL_THICKNESS,
    };
    return { key, side, axis, along, own, theirs: others.flatMap((x) => linesAcross(x, axis)) };
  };
  const lines = [
    ...(sides.a === undefined ? [] : [lineOf("a", sides.a)]),
    ...(sides.c === undefined ? [] : [lineOf("c", sides.c)]),
  ];
  const size = { a: stretch.a1 - stretch.a0, c: stretch.c1 - stretch.c0 };
  const found: { line: (typeof lines)[number]; delta: number; size: number }[] = [];
  for (const line of lines) {
    let best: number | undefined;
    for (const b of line.theirs) {
      if (Math.max(line.own.lo, b.lo) - Math.min(line.own.hi, b.hi) > SNAP_NEAR) continue;
      for (const gap of snapGaps(line.own, b)) {
        const delta = b.at + gap - line.own.at;
        if (Math.abs(delta) > tolerance || (best !== undefined && Math.abs(delta) >= Math.abs(best))) continue;
        const next = size[line.key] + (line.side === 1 ? delta : -delta);
        if (next >= HOME_MAP_MIN_ROOM_SIZE && next <= HOME_MAP_MAX_ROOM_SIZE) best = delta;
      }
    }
    if (best !== undefined) found.push({ line, delta: best, size: size[line.key] + (line.side === 1 ? best : -best) });
  }
  if (options.proportional === true && found.length > 1) found.splice(0, found.length, found.reduce((x, y) => (Math.abs(y.delta) < Math.abs(x.delta) ? y : x)));
  if (found.length === 0) return { resize, guides: [] };
  let width = size.a;
  let depth = size.c;
  for (const f of found) {
    if (f.line.key === "a") width = f.size;
    else depth = f.size;
  }
  if (options.proportional === true) {
    const k = found[0]!.line.key === "a" ? width / w0 : depth / d0;
    width = w0 * k;
    depth = d0 * k;
  }
  const guides: HomeMapSnapGuide[] = [];
  for (const f of found) {
    const { own, theirs, axis, along } = f.line;
    const point = (at2: number, s: number): HomePoint => [axis[0] * at2 + along[0] * s, axis[1] * at2 + along[1] * s];
    for (const b of theirs) {
      if (Math.max(own.lo, b.lo) - Math.min(own.hi, b.hi) > SNAP_NEAR) continue;
      if (!snapGaps(own, b).some((gap) => Math.abs(own.at + f.delta - (b.at + gap)) < 2e-3)) continue;
      guides.push({ a: point(b.at, Math.min(own.lo, b.lo)), b: point(b.at, Math.max(own.hi, b.hi)), roomId: b.roomId });
    }
  }
  return { resize: { ...resize, width, depth }, guides };
}

// ── floors ───────────────────────────────────────────────────────────────

/** The gap left between a floor and a room set beside it. */
const BESIDE_GAP = 1.0;

/** Where rooms go on a floor, as the iPhone sets a scan's rooms
 * (`HomeMapRoomEdits.besidePlacement`): with no other rooms, moved so the
 * corner of their bounds is at 0, 0; beside others, turned so their walls
 * run as the floor's do and set a meter to the right of the floor, tops
 * lined up. */
export function homeMapBesidePlacement(rooms: readonly HomeMapRoom[], others: readonly HomeMapRoom[]): HomeMapPlacement {
  const bounds = homePointBounds(rooms.flatMap((x) => x.outline));
  if (bounds === undefined) return { angle: 0, pivot: [0, 0], offset: [0, 0] };
  const pivot: HomePoint = [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2];
  const floor = homePointBounds(others.flatMap((x) => x.outline));
  if (floor === undefined) return { angle: 0, pivot: [0, 0], offset: [-bounds.minX, -bounds.minY] };
  const floorDirection = homeMainDirection(others.flatMap((x) => homeWallsOf(x)));
  const roomsDirection = homeMainDirection(rooms.flatMap((x) => homeWallsOf(x)));
  const angle = (homeQuarterTurnRemainder(floorDirection - roomsDirection) * 180) / Math.PI;
  const turned = homePointBounds(rooms.flatMap((x) => x.outline).map((p) => homePlace({ angle, pivot, offset: [0, 0] }, p)));
  if (turned === undefined) return { angle, pivot, offset: [0, 0] };
  return { angle, pivot, offset: [floor.maxX + BESIDE_GAP - turned.minX, floor.minY - turned.minY] };
}

/** A floor to make: its id, name and story. */
export interface HomeMapNewFloor {
  id: string;
  name: string;
  story: number;
}

function checkedNewFloor(doc: HomeMapDocument, floor: HomeMapNewFloor): HomeMapFloor | undefined {
  if (!isHomeMapId(floor.id) || idTaken(doc, floor.id) || doc.floors.length >= HOME_MAP_MAX_FLOORS) return undefined;
  if (!Number.isInteger(floor.story) || floor.story < -100 || floor.story > 100) return undefined;
  return { id: floor.id, name: floor.name.trim().slice(0, HOME_MAP_MAX_NAME), story: floor.story, rooms: [], pins: [] };
}

/** A new empty floor at the end of the map. */
export function addFloor(doc: HomeMapDocument, floor: HomeMapNewFloor): HomeMapDocument | undefined {
  const made = checkedNewFloor(doc, floor);
  return made === undefined ? undefined : orderedDocument({ ...doc, floors: [...doc.floors, made] });
}

/** A floor renamed (trimmed, at most 100 characters), its story too when
 * given. */
export function renameFloor(doc: HomeMapDocument, floorId: string, name: string, story?: number): HomeMapDocument | undefined {
  const fi = floorIndex(doc, floorId);
  if (fi < 0) return undefined;
  if (story !== undefined && (!Number.isInteger(story) || story < -100 || story > 100)) return undefined;
  const floor = doc.floors[fi]!;
  return withFloor(doc, fi, { ...floor, name: name.trim().slice(0, HOME_MAP_MAX_NAME), story: story ?? floor.story });
}

/** The map without a floor, its rooms and its pins. */
export function deleteFloor(doc: HomeMapDocument, floorId: string): HomeMapDocument | undefined {
  const fi = floorIndex(doc, floorId);
  if (fi < 0) return undefined;
  return orderedDocument({ ...doc, floors: doc.floors.filter((_, i) => i !== fi) });
}

/** Where `moveRoomToFloor` takes a room: a floor the map has, or a new one
 * it makes. */
export type HomeMapFloorTarget = { floorId: string } | { newFloor: HomeMapNewFloor };

/**
 * The room and the pins that belong to it moved off its floor onto another,
 * as the iPhone moves one (`HomeMapRoomEdits.movingToFloor`): set at 0, 0 on
 * an empty floor, else turned to the floor's walls and set to the right of
 * its rooms (`homeMapBesidePlacement`), every pin naming the room. A floor
 * left with no rooms and no pins is taken off the map. A room already on the
 * target floor stays as it is, so the change made twice moves it once.
 */
export function moveRoomToFloor(doc: HomeMapDocument, roomId: string, target: HomeMapFloorTarget): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  const targetId = "floorId" in target ? target.floorId : target.newFloor.id;
  if (sameHomeMapId(at.floor.id, targetId)) return doc;
  let floors = doc.floors.slice();
  if ("newFloor" in target && floorIndex(doc, targetId) < 0) {
    const made = checkedNewFloor(doc, target.newFloor);
    if (made === undefined) return undefined;
    floors.push(made);
  }
  const to = floors.findIndex((f) => sameHomeMapId(f.id, targetId));
  if (to < 0) return undefined;
  const moving = homeMapPinsOfRoom(at.floor, at.room.id);
  const movingIds = new Set(moving.map((p) => p.id));
  const source: HomeMapFloor = { ...at.floor, rooms: at.floor.rooms.filter((x) => x !== at.room), pins: at.floor.pins.filter((p) => !movingIds.has(p.id)) };
  const destination = floors[to]!;
  const placement = homeMapBesidePlacement([at.room], destination.rooms);
  floors[to] = {
    ...destination,
    rooms: [...destination.rooms, placedRoom(at.room, placement)],
    pins: [...destination.pins, ...moving.map((p) => placedPin({ ...p, roomId: at.room.id }, placement))],
  };
  floors[at.fi] = source;
  if (source.rooms.length === 0 && source.pins.length === 0) floors = floors.filter((f) => f !== source);
  return orderedDocument({ ...doc, floors });
}

// ── a room's own settings ────────────────────────────────────────────────

/**
 * The map without a room and the pins that belong to it (the room a pin
 * names, else the room it stands in), as the iPhone deletes one. A floor
 * left with no rooms and no pins is taken off the map.
 */
export function deleteRoom(doc: HomeMapDocument, roomId: string): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  const gone = new Set(homeMapPinsOfRoom(at.floor, at.room.id).map((p) => p.id));
  const floor: HomeMapFloor = { ...at.floor, rooms: at.floor.rooms.filter((x) => x !== at.room), pins: at.floor.pins.filter((p) => !gone.has(p.id)) };
  if (floor.rooms.length === 0 && floor.pins.length === 0) return orderedDocument({ ...doc, floors: doc.floors.filter((_, i) => i !== at.fi) });
  return withFloor(doc, at.fi, floor);
}

/** A room renamed: trimmed, at most 100 characters; blank removes the
 * name. */
export function renameRoom(doc: HomeMapDocument, roomId: string, name: string): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const { name: _old, ...rest } = room;
    const kept = nameOf(name);
    return kept === undefined ? rest : { ...rest, name: kept };
  });
}

/** A room's Home Assistant area; undefined removes it. */
export function setRoomArea(doc: HomeMapDocument, roomId: string, areaId: string | undefined): HomeMapDocument | undefined {
  if (areaId !== undefined && !isHomeMapAreaId(areaId)) return undefined;
  return editRoom(doc, roomId, (room) => {
    const { areaId: _old, ...rest } = room;
    return areaId === undefined ? rest : { ...rest, areaId };
  });
}

/** The page a tap on a room opens; undefined removes it. */
export function setRoomPage(doc: HomeMapDocument, roomId: string, pageId: string | undefined): HomeMapDocument | undefined {
  if (pageId !== undefined && !isHomeMapId(pageId)) return undefined;
  return editRoom(doc, roomId, (room) => {
    const { pageId: _old, ...rest } = room;
    return pageId === undefined ? rest : { ...rest, pageId };
  });
}

/** What a room's floor is laid with; undefined is Auto, picked from its
 * name and furniture. */
export function setRoomFinish(doc: HomeMapDocument, roomId: string, finish: HomeMapFinish | undefined): HomeMapDocument | undefined {
  if (finish !== undefined && !HOME_MAP_FINISHES.includes(finish)) return undefined;
  return editRoom(doc, roomId, (room) => {
    const { finish: _old, ...rest } = room;
    return finish === undefined ? rest : { ...rest, finish };
  });
}

/** A room's wall height, 0.01 to 100 meters. */
export function setWallHeight(doc: HomeMapDocument, roomId: string, meters: number): HomeMapDocument | undefined {
  if (!finite(meters)) return undefined;
  return editRoom(doc, roomId, (room) => ({ ...room, height: r(clamp(meters, 0.01, 100)) }));
}

// ── things in a room ─────────────────────────────────────────────────────

/** A new thing's width, depth and height by its kind, in meters. */
export const HOME_MAP_OBJECT_SIZES: Readonly<Record<string, [number, number, number]>> = {
  sofa: [2.0, 0.9, 0.8],
  table: [1.4, 0.8, 0.75],
  chair: [0.5, 0.5, 0.9],
  bed: [1.6, 2.0, 0.6],
  storage: [1.0, 0.5, 1.0],
  television: [1.2, 0.1, 0.7],
  bathtub: [1.7, 0.75, 0.6],
  sink: [0.6, 0.45, 0.9],
  toilet: [0.4, 0.7, 0.8],
  stove: [0.6, 0.6, 0.9],
  oven: [0.6, 0.6, 0.9],
  refrigerator: [0.7, 0.7, 1.8],
  dishwasher: [0.6, 0.6, 0.85],
  washerDryer: [0.6, 0.6, 0.85],
  fireplace: [1.2, 0.4, 1.0],
  stairs: [1.0, 2.6, 2.5],
};

/** The kinds the editor offers to add, in its order. */
export const HOME_MAP_OBJECT_KINDS: readonly string[] = [
  "sofa", "table", "chair", "bed", "storage", "television", "bathtub", "sink", "toilet", "stove", "washerDryer", "fireplace", "stairs",
];

const OBJECT_KIND_RE = /^[a-z][A-Za-z0-9]{0,39}$/;

function editObject(doc: HomeMapDocument, roomId: string, index: number, change: (o: HomeMapObject) => HomeMapObject | undefined): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const object = room.objects[index];
    if (object === undefined) return undefined;
    const next = change(object);
    if (next === undefined) return undefined;
    const objects = room.objects.slice();
    objects[index] = orderedObject(next);
    return { ...room, objects };
  });
}

/** A new thing at the end of the room's list: `kind` (a RoomPlan category
 * in lower camel case) centred at `at`, its size its kind's
 * (`HOME_MAP_OBJECT_SIZES`, 1 by 1 by 1 for another kind) unless given. */
export function addObject(doc: HomeMapDocument, roomId: string, kind: string, at: HomePoint, options: { size?: [number, number, number]; turn?: number } = {}): HomeMapDocument | undefined {
  if (!OBJECT_KIND_RE.test(kind) || !finite(...at)) return undefined;
  const size = options.size ?? HOME_MAP_OBJECT_SIZES[kind] ?? [1, 1, 1];
  const turn = options.turn ?? 0;
  if (!finite(...size, turn) || size.some((v) => v < 0 || v > 1000)) return undefined;
  return editRoom(doc, roomId, (room) => {
    if (room.objects.length >= 256) return undefined;
    const object: HomeMapObject = { kind, c: roundPoint(at), size: size.map(r) as [number, number, number], turn: r(homeNormalDegrees(turn)) };
    return { ...room, objects: [...room.objects, object] };
  });
}

/** Stairs: a thing of kind `stairs`. */
export function addStairs(doc: HomeMapDocument, roomId: string, at: HomePoint, options: { size?: [number, number, number]; turn?: number } = {}): HomeMapDocument | undefined {
  return addObject(doc, roomId, "stairs", at, options);
}

/** A thing moved so its centre is at `at`. */
export function moveObject(doc: HomeMapDocument, roomId: string, index: number, at: HomePoint): HomeMapDocument | undefined {
  if (!finite(...at)) return undefined;
  return editObject(doc, roomId, index, (o) => ({ ...o, c: roundPoint(at) }));
}

/** A thing's centre, size, turn (degrees counterclockwise on the plan, as
 * the map stores it) or lift (meters from the floor to its bottom, 0 to
 * 100, 0 putting it back on the floor). */
export function setObject(doc: HomeMapDocument, roomId: string, index: number, change: { c?: HomePoint; size?: [number, number, number]; turn?: number; lift?: number }): HomeMapDocument | undefined {
  if (change.c !== undefined && !finite(...change.c)) return undefined;
  if (change.size !== undefined && (!finite(...change.size) || change.size.some((v) => v < 0 || v > 1000))) return undefined;
  if (change.turn !== undefined && !finite(change.turn)) return undefined;
  if (change.lift !== undefined && !finite(change.lift)) return undefined;
  return editObject(doc, roomId, index, (o) => {
    const { lift: _old, ...rest } = o;
    const lift = change.lift === undefined ? o.lift : r(clamp(change.lift, 0, 100));
    return {
      ...rest,
      c: change.c === undefined ? o.c : roundPoint(change.c),
      size: change.size === undefined ? o.size : (change.size.map(r) as [number, number, number]),
      turn: change.turn === undefined ? o.turn : r(homeNormalDegrees(change.turn)),
      ...(lift !== undefined && lift > 0 ? { lift } : {}),
    };
  });
}

/** Hide a thing (drawn nowhere, kept) or show it again. */
export function setObjectHidden(doc: HomeMapDocument, roomId: string, index: number, hidden: boolean): HomeMapDocument | undefined {
  return editObject(doc, roomId, index, (o) => {
    const { hidden: _old, ...rest } = o;
    return hidden ? { ...rest, hidden: true } : rest;
  });
}

/** Where a thing `size` wide and deep, square with the plan, stands with its
 * middle as near `at` as it can while its box stays inside the room's box
 * along its own walls, off the walls' inner faces; the room's middle when
 * that lands outside the room (an L shaped room) or the room has no box. */
export function homeMapInsideRoom(room: HomeMapRoom, at: HomePoint, size: readonly [number, number, number]): HomePoint {
  const frame = homeMapRoomFrame(room);
  const middle = homeLabelPoint(room) ?? homeMapRoomCenter(room);
  if (frame === undefined) return middle;
  const inset = HOME_WALL_THICKNESS / 2;
  const fit = (along: number, axis: HomePoint, lo: number, hi: number) => {
    const half = (Math.abs(axis[0]) * size[0] + Math.abs(axis[1]) * size[1]) / 2;
    const min = lo + inset + half;
    const max = hi - inset - half;
    return min > max ? (lo + hi) / 2 : clamp(along, min, max);
  };
  const a = fit(at[0] * frame.u[0] + at[1] * frame.u[1], frame.u, frame.a0, frame.a1);
  const c = fit(at[0] * frame.v[0] + at[1] * frame.v[1], frame.v, frame.c0, frame.c1);
  const p: HomePoint = [a * frame.u[0] + c * frame.v[0], a * frame.u[1] + c * frame.v[1]];
  return homePolygonHolds(room.outline, p) ? p : middle;
}

/** Whether a catalog piece can go on a thing: its id and kind names the
 * store keeps, and a size that is numbers. */
function pieceFits(piece: HomeMapFurniturePiece): boolean {
  return isHomeMapModelName(piece.id) && OBJECT_KIND_RE.test(piece.kind) && finite(...piece.size) && piece.size.every((v) => v >= 0 && v <= 1000);
}

/** A new thing made from the furniture catalog's `piece` (`furniture.ts`
 * looks it up, so the catalog never comes along with these edits), at the
 * end of the room's list: the piece's kind and its id as the thing's
 * `model`, its default size, square with the plan, centred at `at` kept
 * inside the room (`homeMapInsideRoom`), and off the floor as the piece
 * starts (`homeMapPieceLift`, by the room's height). */
export function addPiece(doc: HomeMapDocument, roomId: string, piece: HomeMapFurniturePiece, at: HomePoint): HomeMapDocument | undefined {
  if (!pieceFits(piece) || !finite(...at)) return undefined;
  return editRoom(doc, roomId, (room) => {
    if (room.objects.length >= 256) return undefined;
    const size = piece.size.map(r) as [number, number, number];
    const lift = r(clamp(homeMapPieceLift(piece, room.height), 0, 100));
    const object: HomeMapObject = { kind: piece.kind, model: piece.id, c: roundPoint(homeMapInsideRoom(room, at, size)), size, turn: 0 };
    if (lift > 0) object.lift = lift;
    return { ...room, objects: [...room.objects, orderedObject(object)] };
  });
}

/** A thing drawn as another catalog piece: its `model` and `kind` the
 * piece's, its middle, size, turn, lift and whether it is shown kept. */
export function setObjectPiece(doc: HomeMapDocument, roomId: string, index: number, piece: HomeMapFurniturePiece): HomeMapDocument | undefined {
  if (!pieceFits(piece)) return undefined;
  return editObject(doc, roomId, index, (o) => ({ ...o, kind: piece.kind, model: piece.id }));
}

/** A part of a thing's 3D model that takes a colour of its own. */
export type HomeMapPart = "fabric" | "wood";

/** A thing's fabric or wood in `color` (`#RRGGBB`, written upper case), or
 * back to its model's own colour when `color` is undefined, the key then
 * left out. Unchanged is no edit. */
export function setObjectPart(doc: HomeMapDocument, roomId: string, index: number, part: HomeMapPart, color: string | undefined): HomeMapDocument | undefined {
  if (part !== "fabric" && part !== "wood") return undefined;
  if (color !== undefined && !isHomeMapPartColor(color)) return undefined;
  const next = color?.toUpperCase();
  return editObject(doc, roomId, index, (o) => {
    if (o[part] === next) return undefined;
    const out = { ...o };
    if (next === undefined) delete out[part];
    else out[part] = next;
    return out;
  });
}

/** The room without one of its things. */
export function removeObject(doc: HomeMapDocument, roomId: string, index: number): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => (room.objects[index] === undefined ? undefined : { ...room, objects: room.objects.filter((_, i) => i !== index) }));
}

/** The smallest and largest width or depth a resize gives a thing, in
 * meters. */
export const HOME_MAP_MIN_OBJECT_SIZE = 0.05;
export const HOME_MAP_MAX_OBJECT_SIZE = 20;

/** How near, in meters, a dragged thing's side comes to a wall of its room
 * before it snaps flush against it. */
export const HOME_MAP_OBJECT_SNAP = 0.15;

/** A thing's two ways on the plan, as unit vectors: `u` along its width and
 * `v` along its depth (`homeBoxOf`'s corners). */
export function homeMapObjectAxes(object: HomeMapObject): { u: HomePoint; v: HomePoint } {
  const angle = homeBoxOf(object).angle;
  const u: HomePoint = [Math.cos(angle), Math.sin(angle)];
  return { u, v: [-u[1], u[0]] };
}

/** A thing's new size: `width` along its `u` and `depth` along its `v`,
 * either left out staying as it is, each made 0.05 to 20 m; and `anchor`,
 * the point of its box that stays put, as shares of the box along `u` and
 * `v` (0 the minus side, 1 the plus side, 0.5, the default, its middle). Its
 * height never changes here. */
export interface HomeMapObjectResize {
  width?: number;
  depth?: number;
  anchor?: [number, number];
}

/** `object` resized (`HomeMapObjectResize`), its centre moved so the anchor
 * stays put; undefined for a size that is not a number. */
export function homeMapObjectResized(object: HomeMapObject, resize: HomeMapObjectResize): HomeMapObject | undefined {
  const [w0, d0] = object.size;
  const fit = (v: number) => clamp(v, HOME_MAP_MIN_OBJECT_SIZE, HOME_MAP_MAX_OBJECT_SIZE);
  if ((resize.width !== undefined && !finite(resize.width)) || (resize.depth !== undefined && !finite(resize.depth))) return undefined;
  const width = resize.width === undefined ? w0 : fit(resize.width);
  const depth = resize.depth === undefined ? d0 : fit(resize.depth);
  const [ka, kc] = resize.anchor ?? [0.5, 0.5];
  if (!finite(ka, kc)) return undefined;
  // The anchor's place from the middle stays where it was.
  const sa = (ka - 0.5) * (w0 - width);
  const sc = (kc - 0.5) * (d0 - depth);
  const { u, v } = homeMapObjectAxes(object);
  const c: HomePoint = [object.c[0] + u[0] * sa + v[0] * sc, object.c[1] + u[1] * sa + v[1] * sc];
  return { ...object, c: roundPoint(c), size: [r(width), r(depth), object.size[2]] };
}

/** A thing resized (`homeMapObjectResized`). */
export function resizeObject(doc: HomeMapDocument, roomId: string, index: number, resize: HomeMapObjectResize): HomeMapDocument | undefined {
  return editObject(doc, roomId, index, (o) => homeMapObjectResized(o, resize));
}

/** A thing turned by `degrees` (counterclockwise on the plan, as the map
 * stores a turn) about its middle. */
export function turnObject(doc: HomeMapDocument, roomId: string, index: number, degrees: number): HomeMapDocument | undefined {
  if (!finite(degrees)) return undefined;
  return editObject(doc, roomId, index, (o) => ({ ...o, turn: r(homeNormalDegrees(o.turn + degrees)) }));
}

/** A thing turned the least it takes to run square with its room's longest
 * wall. */
export function levelObject(doc: HomeMapDocument, roomId: string, index: number): HomeMapDocument | undefined {
  const room = roomAt(doc, roomId)?.room;
  if (room === undefined) return undefined;
  const wall = (-homeRoomDirection(room) * 180) / Math.PI;
  return editObject(doc, roomId, index, (o) => {
    const off = homeNormalDegrees(o.turn - wall);
    const turn = o.turn - (off - Math.round(off / 90) * 90);
    return { ...o, turn: r(homeNormalDegrees(turn)) };
  });
}

/** A thing dragged so its centre is at `at`, slid so a side that runs along
 * one of its room's walls, and comes within `HOME_MAP_OBJECT_SNAP` of that
 * wall's face, lies flush against it on the side the thing is on: one wall
 * at most for each of its two ways. The lines to draw name its own room. */
export function snapObject(room: HomeMapRoom, object: HomeMapObject, at: HomePoint): { c: HomePoint; guides: HomeMapSnapGuide[] } {
  const { u, v } = homeMapObjectAxes(object);
  const half = [object.size[0] / 2, object.size[1] / 2] as const;
  // A wall counts as running along a side within 5 degrees.
  const square = Math.cos((5 * Math.PI) / 180);
  let c: HomePoint = [at[0], at[1]];
  const guides: HomeMapSnapGuide[] = [];
  // Along v (the thing's front or back) first, then along u (its ends).
  for (const [axis, h, other] of [[v, half[1], half[0]], [u, half[0], half[1]]] as const) {
    let best: { shift: number; n: HomePoint; wall: HomeSegment } | undefined;
    for (const wall of homeWallsOf(room)) {
      const dx = wall.b[0] - wall.a[0];
      const dy = wall.b[1] - wall.a[1];
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) continue;
      const n: HomePoint = [-dy / len, dx / len];
      if (Math.abs(n[0] * axis[0] + n[1] * axis[1]) < square) continue;
      const along = ((c[0] - wall.a[0]) * dx + (c[1] - wall.a[1]) * dy) / len;
      if (along < -other || along > len + other) continue;
      const dist = (c[0] - wall.a[0]) * n[0] + (c[1] - wall.a[1]) * n[1];
      const side = dist >= 0 ? 1 : -1;
      const shift = side * (h + Math.max(wall.t, 0) / 2) - dist;
      if (Math.abs(shift) > HOME_MAP_OBJECT_SNAP) continue;
      if (best === undefined || Math.abs(shift) < Math.abs(best.shift)) best = { shift, n, wall };
    }
    if (best === undefined) continue;
    c = [c[0] + best.n[0] * best.shift, c[1] + best.n[1] * best.shift];
    guides.push({ a: best.wall.a, b: best.wall.b, roomId: room.id });
  }
  return { c, guides };
}

// ── drawing a room ───────────────────────────────────────────────────────

/** A new room's wall height. */
export const HOME_MAP_DRAWN_HEIGHT = 2.5;

/**
 * A room drawn by hand on a floor, with the id `roomId`: its outline (3
 * points or more, enclosing some floor; a last point on the first is
 * dropped), a wall along each edge 10 cm thick, 2.5 m high, no doors,
 * windows or things. Undefined for an outline with no floor to it, a taken
 * id, or a map with 40 rooms already.
 */
export function drawRoom(doc: HomeMapDocument, floorId: string, roomId: string, outline: readonly HomePoint[], name?: string): HomeMapDocument | undefined {
  const fi = floorIndex(doc, floorId);
  if (fi < 0 || !isHomeMapId(roomId) || idTaken(doc, roomId) || roomCount(doc) >= HOME_MAP_MAX_ROOMS) return undefined;
  if (!outline.every((p) => finite(...p))) return undefined;
  const points = outline.map(roundPoint).filter((p, i, all) => i === 0 || distance(p, all[i - 1]!) >= 0.01);
  if (points.length > 1 && distance(points[0]!, points[points.length - 1]!) < 0.01) points.pop();
  if (points.length < 3 || points.length > 256 || Math.abs(homePolygonArea(points)) < 0.05) return undefined;
  const kept = nameOf(name);
  const room: HomeMapRoom = {
    id: roomId,
    ...(kept === undefined ? {} : { name: kept }),
    outline: points,
    height: HOME_MAP_DRAWN_HEIGHT,
    walls: points.map((p, i) => ({ a: p, b: points[(i + 1) % points.length]!, t: HOME_WALL_THICKNESS })),
    openings: [],
    objects: [],
  };
  const floor = doc.floors[fi]!;
  return withFloor(doc, fi, { ...floor, rooms: [...floor.rooms, orderedRoom(room)] });
}

// ── corners and walls ────────────────────────────────────────────────────

/** Corners of two rooms this close are one corner, and move together. */
export const HOME_MAP_SHARED_CORNER = 0.02;
/** A wall's end this close to a corner ends there, so it moves with it. */
const WALL_END_REACH = 0.15;

/** Which of a room's walls (`homeMapRoomWalls`) an opening lies in, or -1. */
export function homeMapOpeningWall(room: HomeMapRoom, opening: Pick<HomeMapOpening, "a" | "b">): number {
  const walls = homeWallsOf(room);
  let best = -1;
  let bestOff = Infinity;
  for (const [i, w] of walls.entries()) {
    if (!onWallLine(opening, w)) continue;
    const length = segmentLength(w);
    const sa = homeProject(opening.a, w.a, w.b).along;
    const sb = homeProject(opening.b, w.a, w.b).along;
    if (Math.max(sa, sb) < -HOME_TOLERANCE || Math.min(sa, sb) > length + HOME_TOLERANCE) continue;
    const off = Math.abs(homeProject([(opening.a[0] + opening.b[0]) / 2, (opening.a[1] + opening.b[1]) / 2], w.a, w.b).offset);
    if (off < bestOff) {
      best = i;
      bestOff = off;
    }
  }
  return best;
}

/** The point `s` meters along a wall from its `a` end. */
function alongWall(w: Pick<HomeSegment, "a" | "b">, s: number): HomePoint {
  const length = segmentLength(w);
  if (length <= 0) return w.a;
  return [w.a[0] + ((w.b[0] - w.a[0]) / length) * s, w.a[1] + ((w.b[1] - w.a[1]) / length) * s];
}

/** An opening that lay in `before` set in `after`, the same wall moved: as
 * far from the end that stayed put as it was, or the same share of the way
 * along when both ends moved, and kept inside the wall. */
function openingOnMovedWall(opening: HomeMapOpening, before: HomeSegment, after: HomeSegment): HomeMapOpening {
  const l0 = segmentLength(before);
  const l1 = segmentLength(after);
  const aStays = distance(before.a, after.a) < 1e-6;
  const bStays = distance(before.b, after.b) < 1e-6;
  const map = (s: number) => (aStays ? s : bStays ? l1 - (l0 - s) : l0 > 0 ? (s / l0) * l1 : s);
  const sa = map(homeProject(opening.a, before.a, before.b).along);
  const sb = map(homeProject(opening.b, before.a, before.b).along);
  const width = Math.min(Math.abs(sb - sa), l1);
  const centre = clamp((sa + sb) / 2, width / 2, l1 - width / 2);
  const [s0, s1] = sa <= sb ? [centre - width / 2, centre + width / 2] : [centre + width / 2, centre - width / 2];
  return orderedOpening({ ...opening, a: roundPoint(alongWall(after, s0)), b: roundPoint(alongWall(after, s1)) });
}

/** The openings of a room whose walls changed from `before` to `after`
 * (the same walls in the same order), each kept in its wall. */
function openingsFollow(room: HomeMapRoom, before: HomeSegment[], after: HomeSegment[]): HomeMapOpening[] {
  return room.openings.map((o) => {
    const i = homeMapOpeningWall({ ...room, walls: before.map((w) => ({ a: w.a, b: w.b, t: w.t })) }, o);
    if (i < 0) return o;
    const b0 = before[i]!;
    const a0 = after[i];
    if (a0 === undefined || (distance(b0.a, a0.a) < 1e-6 && distance(b0.b, a0.b) < 1e-6)) return o;
    return openingOnMovedWall(o, b0, a0);
  });
}

/** A room with some of its outline's corners moved (by index), the ends of
 * its walls at those corners following (a wall end keeps its own small
 * offset from the corner), and the openings in the walls that moved kept in
 * them. */
function cornersMoved(room: HomeMapRoom, moves: ReadonlyMap<number, HomePoint>): HomeMapRoom {
  if (moves.size === 0) return room;
  const from = [...moves].map(([i, to]) => ({ from: room.outline[i]!, to }));
  const outline = room.outline.map((p, i) => (moves.has(i) ? roundPoint(moves.get(i)!) : p));
  const before = homeWallsOf(room);
  const endMoved = (p: HomePoint, reach: number): HomePoint => {
    let best: { from: HomePoint; to: HomePoint } | undefined;
    for (const m of from) if (distance(m.from, p) <= reach && (best === undefined || distance(m.from, p) < distance(best.from, p))) best = m;
    return best === undefined ? p : roundPoint([p[0] + best.to[0] - best.from[0], p[1] + best.to[1] - best.from[1]]);
  };
  const walls = room.walls.map((w) => {
    const reach = Math.min(WALL_END_REACH, segmentLength(w) / 3);
    return { a: endMoved(w.a, reach), b: endMoved(w.b, reach), t: w.t };
  });
  const moved: HomeMapRoom = { ...room, outline, walls };
  return { ...moved, openings: openingsFollow(room, before, homeWallsOf(moved)) };
}

/** One corner to move: a room's outline point by its index, and where to. */
export interface HomeMapCornerMove {
  roomId: string;
  index: number;
  to: HomePoint;
}

/**
 * Corners moved, each with every corner of another room on the same floor
 * within 2 cm of it (a shared corner) moving to the same place, and the
 * walls ending at each and the doors and windows in those walls following.
 * Undefined when a room or corner is gone, or the moves name rooms of two
 * floors.
 */
export function moveCorners(doc: HomeMapDocument, moves: readonly HomeMapCornerMove[]): HomeMapDocument | undefined {
  if (moves.length === 0) return doc;
  const first = roomAt(doc, moves[0]!.roomId);
  if (first === undefined) return undefined;
  const floor = first.floor;
  const byRoom = new Map<number, Map<number, HomePoint>>();
  const explicit = new Set<string>();
  for (const move of moves) {
    const ri = floor.rooms.findIndex((x) => sameHomeMapId(x.id, move.roomId));
    const corner = floor.rooms[ri]?.outline[move.index];
    if (corner === undefined || !finite(...move.to)) return undefined;
    if (!byRoom.has(ri)) byRoom.set(ri, new Map());
    byRoom.get(ri)!.set(move.index, move.to);
    explicit.add(`${ri}:${move.index}`);
  }
  for (const move of moves) {
    const ri = floor.rooms.findIndex((x) => sameHomeMapId(x.id, move.roomId));
    const corner = floor.rooms[ri]!.outline[move.index]!;
    for (const [rj, other] of floor.rooms.entries()) {
      if (rj === ri) continue;
      for (const [k, p] of other.outline.entries()) {
        if (distance(p, corner) > HOME_MAP_SHARED_CORNER || explicit.has(`${rj}:${k}`)) continue;
        if (!byRoom.has(rj)) byRoom.set(rj, new Map());
        byRoom.get(rj)!.set(k, move.to);
      }
    }
  }
  const rooms = floor.rooms.map((room, i) => (byRoom.has(i) ? orderedRoom(cornersMoved(room, byRoom.get(i)!)) : room));
  return withFloor(doc, first.fi, { ...floor, rooms });
}

/** One corner moved to `to`, with any corner it shares (`moveCorners`). */
export function moveCorner(doc: HomeMapDocument, roomId: string, index: number, to: HomePoint): HomeMapDocument | undefined {
  return moveCorners(doc, [{ roomId, index, to }]);
}

/** The outline corner of a room nearest `point`, within `reach`, or -1. */
export function homeMapCornerNear(room: HomeMapRoom, point: readonly number[], reach = WALL_END_REACH): number {
  let best = -1;
  for (const [i, p] of room.outline.entries()) if (distance(p, point) <= reach && (best < 0 || distance(p, point) < distance(room.outline[best]!, point))) best = i;
  return best;
}

/** A wall's ends moved to `a` and `b`: through the corners at its ends when
 * it has them (so the walls beside it and any shared corner follow), else
 * the wall alone with its openings. */
function moveWallEnds(doc: HomeMapDocument, at: RoomAt, wallIndex: number, a: HomePoint, b: HomePoint): HomeMapDocument | undefined {
  const walls = homeWallsOf(at.room);
  const wall = walls[wallIndex];
  if (wall === undefined || !finite(...a, ...b)) return undefined;
  const reach = Math.min(WALL_END_REACH, segmentLength(wall) / 3);
  const moves: HomeMapCornerMove[] = [];
  const ca = homeMapCornerNear(at.room, wall.a, reach);
  const cb = homeMapCornerNear(at.room, wall.b, reach);
  const shift = (corner: HomePoint, end: HomePoint, to: HomePoint): HomePoint => [corner[0] + to[0] - end[0], corner[1] + to[1] - end[1]];
  if (ca >= 0 && distance(wall.a, a) > 1e-9) moves.push({ roomId: at.room.id, index: ca, to: shift(at.room.outline[ca]!, wall.a, a) });
  if (cb >= 0 && cb !== ca && distance(wall.b, b) > 1e-9) moves.push({ roomId: at.room.id, index: cb, to: shift(at.room.outline[cb]!, wall.b, b) });
  const cornered = moveCorners(doc, moves);
  if (cornered === undefined || (ca >= 0 && cb >= 0)) return cornered;
  // An inner wall, or one an end of which no corner holds: once any corner
  // has moved, the wall itself is set to its new ends.
  const now = roomAt(cornered, at.room.id);
  if (now === undefined || now.room.walls[wallIndex] === undefined) return undefined;
  const before = homeWallsOf(now.room);
  const nextWalls = now.room.walls.slice();
  nextWalls[wallIndex] = { a: roundPoint(a), b: roundPoint(b), t: wall.t };
  const moved = { ...now.room, walls: nextWalls };
  return withRoom(cornered, now, { ...moved, openings: openingsFollow(now.room, before, homeWallsOf(moved)) });
}

/** A wall made `meters` long by moving its far (`b`) end along it, the
 * corner there and any corner it shares going with it. At least 10 cm. */
export function setWallLength(doc: HomeMapDocument, roomId: string, wallIndex: number, meters: number): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  const wall = at === undefined ? undefined : homeWallsOf(at.room)[wallIndex];
  if (at === undefined || wall === undefined || !finite(meters) || meters < 0.1) return undefined;
  return moveWallEnds(doc, at, wallIndex, wall.a, alongWall(wall, meters));
}

/** A wall's thickness, 1 cm to 1 m. A room drawn from its outline gets its
 * walls written out first. */
export function setWallThickness(doc: HomeMapDocument, roomId: string, wallIndex: number, meters: number): HomeMapDocument | undefined {
  if (!finite(meters)) return undefined;
  return editRoom(doc, roomId, (room) => {
    const own = withOwnWalls(room);
    if (own.walls[wallIndex] === undefined) return undefined;
    const walls = own.walls.slice();
    walls[wallIndex] = { ...walls[wallIndex]!, t: r(clamp(meters, 0.01, 1)) };
    return { ...own, walls };
  });
}

/** A wall turned round its middle to the nearest of the floor's two wall
 * directions (the way most of the floor's other walls run, or square to
 * it), its corners and the walls beside them following. */
export function straightenWall(doc: HomeMapDocument, roomId: string, wallIndex: number): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  const wall = at === undefined ? undefined : homeWallsOf(at.room)[wallIndex];
  if (at === undefined || wall === undefined || segmentLength(wall) <= 0) return undefined;
  // The floor's directions without this wall, so its own slant does not
  // pull them.
  const others = at.floor.rooms.flatMap((x) => homeWallsOf(x).filter((_, i) => x !== at.room || i !== wallIndex));
  const direction = homeMainDirection(others.length > 0 ? others : [wall]);
  const angle = Math.atan2(wall.b[1] - wall.a[1], wall.b[0] - wall.a[0]);
  const turn = (-homeQuarterTurnRemainder(angle - direction) * 180) / Math.PI;
  if (Math.abs(turn) < 1e-6) return doc;
  const middle: HomePoint = [(wall.a[0] + wall.b[0]) / 2, (wall.a[1] + wall.b[1]) / 2];
  return moveWallEnds(doc, at, wallIndex, homeTurnPoint(wall.a, middle, turn), homeTurnPoint(wall.b, middle, turn));
}

/** Corners within this many degrees of square are made square. */
export const HOME_MAP_SQUARE_LIMIT = 10;

/** Where a room's corners go once squared (`squareCorners`), by index. */
export function homeMapSquaredOutline(room: HomeMapRoom, limit = HOME_MAP_SQUARE_LIMIT): HomePoint[] {
  const pts = room.outline;
  const n = pts.length;
  if (n < 3) return pts.slice();
  let longest = 0;
  for (let i = 1; i < n; i += 1) if (distance(pts[i]!, pts[(i + 1) % n]!) > distance(pts[longest]!, pts[(longest + 1) % n]!)) longest = i;
  const base = Math.atan2(pts[(longest + 1) % n]![1] - pts[longest]![1], pts[(longest + 1) % n]![0] - pts[longest]![0]);
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n]!;
    const angle = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const off = homeQuarterTurnRemainder(angle - base);
    const snapped = Math.abs(off) <= (limit * Math.PI) / 180 ? angle - off : angle;
    // The longest edge keeps its line; the others turn round their middle.
    const through: HomePoint = i === longest ? p : [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return { through, d: [Math.cos(snapped), Math.sin(snapped)] as HomePoint };
  });
  return pts.map((p, i) => {
    const prev = lines[(i - 1 + n) % n]!;
    const next = lines[i]!;
    return homeLineCrossing(prev.through, prev.d, next.through, next.d) ?? homeProject(p, next.through, [next.through[0] + next.d[0], next.through[1] + next.d[1]]).point;
  });
}

/** A room's corners made square where they are within 10 degrees of it, the
 * longest wall keeping its line; corners further off stay as they are. The
 * walls, doors and any shared corners follow (`moveCorners`). */
export function squareCorners(doc: HomeMapDocument, roomId: string): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined) return undefined;
  const squared = homeMapSquaredOutline(at.room);
  const moves = squared.flatMap((to, index) => (distance(to, at.room.outline[index]!) > 1e-4 ? [{ roomId, index, to }] : []));
  return moves.length === 0 ? doc : moveCorners(doc, moves);
}

/** A corner added in a wall at the point of it nearest `at` (its middle by
 * default), splitting the wall in two, so the new corner can be dragged.
 * It becomes the outline point after the wall's first corner. */
export function addCorner(doc: HomeMapDocument, roomId: string, wallIndex: number, at?: HomePoint): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const wall = homeWallsOf(room)[wallIndex];
    if (wall === undefined || room.outline.length >= 256) return undefined;
    const length = segmentLength(wall);
    if (length < 0.2) return undefined;
    const s = clamp(at === undefined ? length / 2 : homeProject(at, wall.a, wall.b).along, 0.1, length - 0.1);
    const p = roundPoint(alongWall(wall, s));
    if (room.walls.length === 0) {
      const outline = room.outline.slice();
      outline.splice(wallIndex + 1, 0, p);
      return { ...room, outline };
    }
    const walls = room.walls.slice();
    walls.splice(wallIndex, 1, { a: wall.a, b: p, t: wall.t }, { a: p, b: wall.b, t: wall.t });
    const reach = Math.min(WALL_END_REACH, length / 3);
    const n = room.outline.length;
    const k = room.outline.findIndex((q, i) => {
      const next = room.outline[(i + 1) % n]!;
      return (distance(q, wall.a) <= reach && distance(next, wall.b) <= reach) || (distance(q, wall.b) <= reach && distance(next, wall.a) <= reach);
    });
    const outline = room.outline.slice();
    if (k >= 0) outline.splice(k + 1, 0, roundPoint(homeProject(p, room.outline[k]!, room.outline[(k + 1) % n]!).point));
    return { ...room, outline, walls };
  });
}

/** A corner taken away: the outline goes straight from the corner before it
 * to the one after (3 corners at least stay), and two walls meeting there
 * become one. */
export function removeCorner(doc: HomeMapDocument, roomId: string, index: number): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const corner = room.outline[index];
    if (corner === undefined || room.outline.length <= 3) return undefined;
    const outline = room.outline.filter((_, i) => i !== index);
    const ending = room.walls.findIndex((w) => distance(w.b, corner) <= Math.min(WALL_END_REACH, segmentLength(w) / 3));
    const starting = room.walls.findIndex((w, i) => i !== ending && distance(w.a, corner) <= Math.min(WALL_END_REACH, segmentLength(w) / 3));
    if (ending < 0 || starting < 0) return { ...room, outline };
    const merged: HomeMapWall = { a: room.walls[ending]!.a, b: room.walls[starting]!.b, t: Math.max(room.walls[ending]!.t, room.walls[starting]!.t) };
    const walls = room.walls.flatMap((w, i) => (i === ending ? [merged] : i === starting ? [] : [w]));
    return { ...room, outline, walls };
  });
}

/** An inner wall from `a` to `b` (10 cm thick unless given), at least 10 cm
 * long. A room drawn from its outline gets its outline's walls written out
 * first, so they still show. */
export function addInnerWall(doc: HomeMapDocument, roomId: string, a: HomePoint, b: HomePoint, thickness = HOME_WALL_THICKNESS): HomeMapDocument | undefined {
  if (!finite(...a, ...b, thickness) || distance(a, b) < 0.1) return undefined;
  return editRoom(doc, roomId, (room) => {
    const own = withOwnWalls(room);
    if (own.walls.length >= 256) return undefined;
    return { ...own, walls: [...own.walls, { a: roundPoint(a), b: roundPoint(b), t: r(clamp(thickness, 0.01, 1)) }] };
  });
}

/** The room without one of its walls (an inner wall, say). A room drawn
 * from its outline gets its walls written out first. */
export function removeWall(doc: HomeMapDocument, roomId: string, wallIndex: number): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const own = withOwnWalls(room);
    if (own.walls[wallIndex] === undefined) return undefined;
    return { ...own, walls: own.walls.filter((_, i) => i !== wallIndex) };
  });
}

// ── splitting a room ─────────────────────────────────────────────────────

/**
 * A room split in two by the line through `a` and `b`. The piece on the
 * line's right as seen on screen keeps the room's id, name, area, page and
 * finish; the other becomes the room `newRoomId`, named `name` when given,
 * with the same height and finish. Walls are cut where they cross the line,
 * a wall along the cut goes into both, and doors, windows, things and the
 * room's pins go to the side they are on. Undefined when the line leaves a
 * piece under 0.1 m², or the id is taken.
 */
export function splitRoom(doc: HomeMapDocument, roomId: string, a: HomePoint, b: HomePoint, newRoomId: string, name?: string): HomeMapDocument | undefined {
  const at = roomAt(doc, roomId);
  if (at === undefined || !finite(...a, ...b) || distance(a, b) < 0.01) return undefined;
  if (!isHomeMapId(newRoomId) || idTaken(doc, newRoomId) || roomCount(doc) >= HOME_MAP_MAX_ROOMS) return undefined;
  const room = at.room;
  const keep = homeClipPolygon(room.outline, a, b, 1).map(roundPoint);
  const give = homeClipPolygon(room.outline, a, b, -1).map(roundPoint);
  if (Math.abs(homePolygonArea(keep)) < 0.1 || Math.abs(homePolygonArea(give)) < 0.1) return undefined;
  // The cut: the stretch of the line the kept piece runs along.
  const onLine = keep.filter((p) => Math.abs(homeProject(p, a, b).offset) < 0.01);
  let cut: HomeMapWall | undefined;
  if (onLine.length >= 2) {
    const sorted = onLine.slice().sort((p, q) => homeProject(p, a, b).along - homeProject(q, a, b).along);
    cut = { a: sorted[0]!, b: sorted[sorted.length - 1]!, t: HOME_WALL_THICKNESS };
  }
  const side = (p: readonly number[]) => (homeSide(p, a, b) >= 0 ? 1 : -1);
  const walls = (k: 1 | -1): HomeMapWall[] => [
    ...homeWallsOf(room).flatMap((w) => {
      const piece = homeClipSegment(w.a, w.b, a, b, k);
      return piece === undefined || distance(piece[0], piece[1]) < 0.05 ? [] : [{ a: roundPoint(piece[0]), b: roundPoint(piece[1]), t: w.t }];
    }),
    ...(cut === undefined ? [] : [cut]),
  ];
  const middle = (o: HomeMapOpening) => [(o.a[0] + o.b[0]) / 2, (o.a[1] + o.b[1]) / 2];
  const kept: HomeMapRoom = orderedRoom({
    ...room,
    outline: keep,
    walls: walls(1),
    openings: room.openings.filter((o) => side(middle(o)) > 0),
    objects: room.objects.filter((o) => side(o.c) > 0),
  });
  const newName = nameOf(name);
  const given: HomeMapRoom = orderedRoom({
    id: newRoomId,
    ...(newName === undefined ? {} : { name: newName }),
    ...(room.finish === undefined ? {} : { finish: room.finish }),
    outline: give,
    height: room.height,
    walls: walls(-1),
    openings: room.openings.filter((o) => side(middle(o)) < 0),
    objects: room.objects.filter((o) => side(o.c) < 0),
  });
  const moving = new Set(homeMapPinsOfRoom(at.floor, room.id).map((p) => p.id));
  const rooms = at.floor.rooms.slice();
  rooms.splice(at.ri, 1, kept, given);
  const pins = at.floor.pins.map((p) => (moving.has(p.id) ? orderedPin({ ...p, roomId: side(p.at) > 0 ? room.id : newRoomId }) : p));
  return withFloor(doc, at.fi, { ...at.floor, rooms, pins });
}

// ── doors, windows and ways through ──────────────────────────────────────

/** A new opening's width and height by its kind: a door 0.9 m from the
 * floor to 2.0 m, a window 1.2 m from 0.9 m to 2.0 m, a way through 0.9 m
 * from the floor to 2.1 m. */
export const HOME_MAP_OPENING_DEFAULTS: Readonly<Record<HomeMapOpeningKind, { width: number; z0: number; z1: number }>> = {
  door: { width: 0.9, z0: 0, z1: 2.0 },
  window: { width: 1.2, z0: 0.9, z1: 2.0 },
  opening: { width: 0.9, z0: 0, z1: 2.1 },
};

/** Whether a style fits a kind: none for a way through, no double window. */
export function homeMapStyleFits(kind: HomeMapOpeningKind, style: HomeMapOpeningStyle | undefined): boolean {
  if (style === undefined) return true;
  if (kind === "opening") return false;
  return !(kind === "window" && style === "double");
}

/** An opening `width` wide centred `centre` meters along a wall, kept
 * inside it. */
function openingIn(wall: HomeSegment, centre: number, width: number): [HomePoint, HomePoint] {
  const length = segmentLength(wall);
  const w = Math.min(width, length);
  const c = clamp(centre, w / 2, length - w / 2);
  return [roundPoint(alongWall(wall, c - w / 2)), roundPoint(alongWall(wall, c + w / 2))];
}

/** What a new opening is: its kind, style, where along the wall (a plan
 * point, set on the wall, or meters from the wall's first end), width and
 * bottom and top. Each left out takes its kind's default, the middle of the
 * wall for where. */
export interface HomeMapNewOpening {
  kind: HomeMapOpeningKind;
  style?: HomeMapOpeningStyle;
  at?: HomePoint | number;
  width?: number;
  z0?: number;
  z1?: number;
}

/** A door, window or way through added in one of a room's walls
 * (`homeMapRoomWalls`), kept inside the wall. Undefined for a style the kind
 * cannot have. */
export function addOpening(doc: HomeMapDocument, roomId: string, wallIndex: number, opening: HomeMapNewOpening): HomeMapDocument | undefined {
  const defaults = HOME_MAP_OPENING_DEFAULTS[opening.kind];
  if (defaults === undefined || !homeMapStyleFits(opening.kind, opening.style)) return undefined;
  const width = opening.width ?? defaults.width;
  const z0 = opening.z0 ?? defaults.z0;
  const z1 = opening.z1 ?? defaults.z1;
  if (!finite(width, z0, z1) || width < 0.1 || z1 < z0) return undefined;
  return editRoom(doc, roomId, (room) => {
    const wall = homeWallsOf(room)[wallIndex];
    if (wall === undefined || room.openings.length >= 128 || segmentLength(wall) < 0.1) return undefined;
    const where = opening.at;
    const centre = where === undefined ? segmentLength(wall) / 2 : typeof where === "number" ? where : homeProject(where, wall.a, wall.b).along;
    if (!finite(centre)) return undefined;
    const [pa, pb] = openingIn(wall, centre, width);
    const made: HomeMapOpening = orderedOpening({ kind: opening.kind, ...(opening.style === undefined ? {} : { style: opening.style }), a: pa, b: pb, z0: r(z0), z1: r(z1) });
    return { ...room, openings: [...room.openings, made] };
  });
}

function editOpening(doc: HomeMapDocument, roomId: string, index: number, change: (o: HomeMapOpening, room: HomeMapRoom) => HomeMapOpening | undefined): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => {
    const opening = room.openings[index];
    if (opening === undefined) return undefined;
    const next = change(opening, room);
    if (next === undefined) return undefined;
    const openings = room.openings.slice();
    openings[index] = orderedOpening(next);
    return { ...room, openings };
  });
}

/** An opening slid along its wall so its middle is at the point of the
 * wall nearest `to` (or `to` meters from the wall's first end), kept inside
 * the wall; its width stays. One in no wall slides along its own line. */
export function moveOpening(doc: HomeMapDocument, roomId: string, index: number, to: HomePoint | number): HomeMapDocument | undefined {
  return editOpening(doc, roomId, index, (o, room) => {
    const wi = homeMapOpeningWall(room, o);
    const width = distance(o.a, o.b);
    const line: HomeSegment = wi >= 0 ? homeWallsOf(room)[wi]! : { a: o.a, b: o.b, t: 0 };
    const centre = typeof to === "number" ? to : homeProject(to, line.a, line.b).along;
    if (!finite(centre)) return undefined;
    const forward = homeProject(o.b, line.a, line.b).along >= homeProject(o.a, line.a, line.b).along;
    let ends: [HomePoint, HomePoint];
    if (wi >= 0) ends = openingIn(line, centre, width);
    else ends = [roundPoint(alongWall(line, centre - width / 2)), roundPoint(alongWall(line, centre + width / 2))];
    const [pa, pb] = forward ? ends : [ends[1], ends[0]];
    return { ...o, a: pa, b: pb };
  });
}

/** What `setOpening` changes: width (round its middle, kept inside its
 * wall), bottom, top, kind and style (null takes the style away). */
export interface HomeMapOpeningChange {
  width?: number;
  z0?: number;
  z1?: number;
  kind?: HomeMapOpeningKind;
  style?: HomeMapOpeningStyle | null;
}

/** An opening changed. A kind its style no longer fits drops the style;
 * a style named that the kind cannot have, or a top below the bottom, is
 * refused (undefined). */
export function setOpening(doc: HomeMapDocument, roomId: string, index: number, change: HomeMapOpeningChange): HomeMapDocument | undefined {
  return editOpening(doc, roomId, index, (o, room) => {
    const kind = change.kind ?? o.kind;
    if (HOME_MAP_OPENING_DEFAULTS[kind] === undefined) return undefined;
    let style: HomeMapOpeningStyle | undefined = change.style === null ? undefined : (change.style ?? o.style);
    if (change.style !== undefined && change.style !== null && !homeMapStyleFits(kind, change.style)) return undefined;
    if (!homeMapStyleFits(kind, style)) style = undefined;
    const z0 = change.z0 ?? o.z0;
    const z1 = change.z1 ?? o.z1;
    if (!finite(z0, z1) || z1 < z0) return undefined;
    let a = o.a;
    let b = o.b;
    if (change.width !== undefined) {
      if (!finite(change.width) || change.width < 0.1) return undefined;
      const wi = homeMapOpeningWall(room, o);
      const line: HomeSegment = wi >= 0 ? homeWallsOf(room)[wi]! : { a: o.a, b: o.b, t: 0 };
      const sa = homeProject(o.a, line.a, line.b).along;
      const sb = homeProject(o.b, line.a, line.b).along;
      const centre = (sa + sb) / 2;
      const ends = wi >= 0 ? openingIn(line, centre, change.width) : ([roundPoint(alongWall(line, centre - change.width / 2)), roundPoint(alongWall(line, centre + change.width / 2))] as [HomePoint, HomePoint]);
      [a, b] = sb >= sa ? ends : [ends[1], ends[0]];
    }
    const { style: _old, ...rest } = o;
    return { ...rest, kind, ...(style === undefined ? {} : { style }), a, b, z0: r(z0), z1: r(z1) };
  });
}

/** The room without one of its openings. */
export function removeOpening(doc: HomeMapDocument, roomId: string, index: number): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => (room.openings[index] === undefined ? undefined : { ...room, openings: room.openings.filter((_, i) => i !== index) }));
}

// ── the scan check ───────────────────────────────────────────────────────

/** What the scan check found: two rooms lying across each other, a corner a
 * little off square, a small gap between two rooms that should touch, or a
 * room with no door or way through to any room beside it. */
export type HomeMapIssueKind = "overlap" | "offSquare" | "gap" | "missingDoor";

export interface HomeMapIssue {
  /** Stable while the problem lasts: its kind and its rooms. */
  id: string;
  kind: HomeMapIssueKind;
  /** The rooms it is about, the one the fix changes first. */
  roomIds: string[];
  /** Where to point at it on the plan. */
  where: HomePoint;
  /** Meters for an overlap or gap, the corner's degrees off square, 0 for
   * a missing door. */
  amount: number;
  /** The line the editor shows ("Bath and Closet overlap 4 cm."). */
  title: string;
  /** The line under it. */
  detail: string;
  /** The fix's button ("Fix", "Square", "Close", "Add"). */
  fixLabel: string;
  /** The fix, by ids, so it can be made on a newer map too. */
  fix: HomeMapOp;
}

/** Overlaps and gaps are counted from 1 cm; gaps up to 15 cm. */
const ISSUE_LEAST = 0.01;
const GAP_MOST = 0.15;
/** Corners off square by 1 to 10 degrees. */
const SQUARE_LEAST = 1;
/** Rooms count as side by side when facing walls are this close and run
 * beside each other at least this far. */
const NEIGHBOUR_GAP = 0.35;
const NEIGHBOUR_RUN = 0.5;

const cm = (meters: number) => `${Math.max(1, Math.round(meters * 100))} cm`;

/** The overlap of two rooms: how deep it is (its smaller extent along the
 * floor's two directions), along which, and its middle; undefined for
 * none. Measured on a fine grid over where their boxes meet. */
function overlapOf(a: HomeMapRoom, b: HomeMapRoom, axes: [HomePoint, HomePoint]): { depth: number; axis: HomePoint; where: HomePoint } | undefined {
  const [u, v] = axes;
  const toUV = (p: HomePoint): HomePoint => [p[0] * u[0] + p[1] * u[1], p[0] * v[0] + p[1] * v[1]];
  const fromUV = (q: HomePoint): HomePoint => [q[0] * u[0] + q[1] * v[0], q[0] * u[1] + q[1] * v[1]];
  const ba = homePointBounds(a.outline.map(toUV));
  const bb = homePointBounds(b.outline.map(toUV));
  if (ba === undefined || bb === undefined) return undefined;
  const minX = Math.max(ba.minX, bb.minX);
  const maxX = Math.min(ba.maxX, bb.maxX);
  const minY = Math.max(ba.minY, bb.minY);
  const maxY = Math.min(ba.maxY, bb.maxY);
  if (maxX - minX <= ISSUE_LEAST / 2 || maxY - minY <= ISSUE_LEAST / 2) return undefined;
  const step = clamp(Math.sqrt(((maxX - minX) * (maxY - minY)) / 4000), 0.004, 0.05);
  let lo: HomePoint = [Infinity, Infinity];
  let hi: HomePoint = [-Infinity, -Infinity];
  let sum: HomePoint = [0, 0];
  let count = 0;
  for (let y = minY + step / 2; y < maxY; y += step) {
    for (let x = minX + step / 2; x < maxX; x += step) {
      const p = fromUV([x, y]);
      if (!homePolygonHolds(a.outline, p) || !homePolygonHolds(b.outline, p)) continue;
      lo = [Math.min(lo[0], x), Math.min(lo[1], y)];
      hi = [Math.max(hi[0], x), Math.max(hi[1], y)];
      sum = [sum[0] + p[0], sum[1] + p[1]];
      count += 1;
    }
  }
  if (count === 0) return undefined;
  const du = hi[0] - lo[0] + step;
  const dv = hi[1] - lo[1] + step;
  const depth = Math.min(du, dv);
  if (depth <= ISSUE_LEAST) return undefined;
  return { depth, axis: du <= dv ? u : v, where: [sum[0] / count, sum[1] / count] };
}

/** Two facing walls of two rooms along one of the floor's directions: how
 * far apart they are (minus when they cross), how far they run beside each
 * other, the middle of that run, and which of the first room's walls. */
interface Facing {
  gap: number;
  run: number;
  where: HomePoint;
  axis: HomePoint;
  /** +1 when the second room lies along `axis` from the first. */
  sign: number;
  wallIndex: number;
  t: number;
}

function facings(a: HomeMapRoom, b: HomeMapRoom, axes: [HomePoint, HomePoint]): Facing[] {
  const out: Facing[] = [];
  const wallsA = homeWallsOf(a);
  for (const axis of axes) {
    const along: HomePoint = [-axis[1], axis[0]];
    const own = linesAcross(a, axis);
    const theirs = linesAcross(b, axis);
    for (const la of own) {
      for (const lb of theirs) {
        if (la.side === lb.side) continue;
        // The first room's wall faces out along -side; the gap runs that way.
        const gap = (lb.at - la.at) * -la.side;
        const run = Math.min(la.hi, lb.hi) - Math.max(la.lo, lb.lo);
        if (run <= 0) continue;
        const s = (Math.max(la.lo, lb.lo) + Math.min(la.hi, lb.hi)) / 2;
        const where: HomePoint = [axis[0] * la.at + along[0] * s, axis[1] * la.at + along[1] * s];
        const wallIndex = wallsA.findIndex((w) => {
          const at = ((w.a[0] + w.b[0]) / 2) * axis[0] + ((w.a[1] + w.b[1]) / 2) * axis[1];
          return Math.abs(at - la.at) < 1e-6 && w.t === la.t;
        });
        out.push({ gap, run, where, axis, sign: -la.side, wallIndex, t: Math.max(la.t, lb.t) });
      }
    }
  }
  return out;
}

/** The corner of a room furthest off square within 1 to 10 degrees: its
 * index, its angle inside the room and how far off it is. */
function worstCorner(room: HomeMapRoom): { index: number; angle: number; off: number } | undefined {
  const pts = room.outline;
  const n = pts.length;
  const clockwise = homePolygonArea(pts) > 0;
  let worst: { index: number; angle: number; off: number } | undefined;
  for (let i = 0; i < n; i += 1) {
    const p = pts[i]!;
    const prev = pts[(i - 1 + n) % n]!;
    const next = pts[(i + 1) % n]!;
    const d1: HomePoint = [prev[0] - p[0], prev[1] - p[1]];
    const d2: HomePoint = [next[0] - p[0], next[1] - p[1]];
    if (Math.hypot(...d1) < 0.05 || Math.hypot(...d2) < 0.05) continue;
    const between = (Math.acos(clamp((d1[0] * d2[0] + d1[1] * d2[1]) / (Math.hypot(...d1) * Math.hypot(...d2)), -1, 1)) * 180) / Math.PI;
    const turn = (p[0] - prev[0]) * (next[1] - p[1]) - (p[1] - prev[1]) * (next[0] - p[0]);
    const convex = clockwise ? turn > 0 : turn < 0;
    const angle = convex ? between : 360 - between;
    const off = Math.abs(between - 90);
    if (off < SQUARE_LEAST || off > HOME_MAP_SQUARE_LIMIT) continue;
    if (worst === undefined || off > worst.off) worst = { index: i, angle, off };
  }
  return worst;
}

/** The door the scan check offers: a door 0.9 m wide (narrower to fit) in
 * the first room's wall at `where`. */
function doorAt(roomId: string, wallIndex: number, where: HomePoint, run: number): HomeMapOp {
  return (doc) => {
    const at = roomAt(doc, roomId);
    if (at === undefined) return undefined;
    const walls = homeWallsOf(at.room);
    // The wall by its index when it still lies there, else the nearest.
    let index = wallIndex;
    const near = (w: HomeSegment | undefined) => w !== undefined && Math.abs(homeProject(where, w.a, w.b).offset) <= w.t / 2 + HOME_TOLERANCE;
    if (!near(walls[index])) index = walls.findIndex((w) => near(w));
    if (index < 0) return undefined;
    return addOpening(doc, roomId, index, { kind: "door", at: where, width: clamp(run - 0.1, 0.6, 0.9) });
  };
}

/**
 * What the scan check finds on a floor, in a steady order: corners a
 * little off square (1 to 10 degrees, the worst per room; fixed by
 * `squareCorners`), rooms overlapping more than 1 cm (fixed by moving the
 * smaller one clear along the shallower direction), facing walls of two
 * rooms 1 to 15 cm from meeting or from a wall's thickness apart (fixed by
 * moving the smaller one to meet), and rooms with rooms beside them (facing
 * walls within 35 cm, running beside each other 50 cm or more) but no door
 * or way through to any of them (fixed by a door where they meet longest).
 */
export function scanIssues(floor: HomeMapFloor): HomeMapIssue[] {
  const rooms = floor.rooms;
  const axes = floorAxes(rooms);
  const name = (room: HomeMapRoom) => homeMapRoomName(room);
  const area = (room: HomeMapRoom) => Math.abs(homePolygonArea(room.outline));
  const out: HomeMapIssue[] = [];
  for (const room of rooms) {
    const corner = worstCorner(room);
    if (corner === undefined) continue;
    out.push({
      id: `offSquare:${room.id}`,
      kind: "offSquare",
      roomIds: [room.id],
      where: room.outline[corner.index]!,
      amount: Math.round(corner.off * 10) / 10,
      title: `${name(room)} corner is ${Math.round(corner.angle)}°.`,
      detail: "Walls meet a little off square.",
      fixLabel: "Square",
      fix: (doc) => squareCorners(doc, room.id),
    });
  }
  const touching: { a: HomeMapRoom; b: HomeMapRoom; facing: Facing }[] = [];
  for (let i = 0; i < rooms.length; i += 1) {
    for (let j = i + 1; j < rooms.length; j += 1) {
      const a = rooms[i]!;
      const b = rooms[j]!;
      const [small, big] = area(a) <= area(b) ? [a, b] : [b, a];
      const overlap = overlapOf(a, b, axes);
      if (overlap !== undefined) {
        const cs = homeMapRoomCenter(small);
        const cb = homeMapRoomCenter(big);
        const sign = (cs[0] - cb[0]) * overlap.axis[0] + (cs[1] - cb[1]) * overlap.axis[1] >= 0 ? 1 : -1;
        const move: HomePoint = [overlap.axis[0] * overlap.depth * sign, overlap.axis[1] * overlap.depth * sign];
        out.push({
          id: `overlap:${small.id}:${big.id}`,
          kind: "overlap",
          roomIds: [small.id, big.id],
          where: overlap.where,
          amount: r(overlap.depth),
          title: `${name(small)} and ${name(big)} overlap ${cm(overlap.depth)}.`,
          detail: "One wall was scanned twice.",
          fixLabel: "Fix",
          fix: (doc) => moveRoom(doc, small.id, move[0], move[1]),
        });
        continue;
      }
      const near = facings(small, big, axes).filter((f) => f.gap > -ISSUE_LEAST && f.gap <= NEIGHBOUR_GAP && f.run >= NEIGHBOUR_RUN);
      if (near.length === 0) continue;
      const longest = near.reduce((m, f) => (f.run > m.run ? f : m));
      touching.push({ a: small, b: big, facing: longest });
      let gapIssue: { residual: number; move: number; facing: Facing } | undefined;
      for (const f of near) {
        const toTouch = f.gap;
        const toWall = f.gap - f.t;
        const move = Math.abs(toTouch) <= Math.abs(toWall) ? toTouch : toWall;
        const residual = Math.abs(move);
        if (residual < ISSUE_LEAST || residual > GAP_MOST) continue;
        if (gapIssue === undefined || f.run > gapIssue.facing.run) gapIssue = { residual, move, facing: f };
      }
      if (gapIssue !== undefined) {
        const g = gapIssue;
        const shift: HomePoint = [g.facing.axis[0] * g.move * g.facing.sign, g.facing.axis[1] * g.move * g.facing.sign];
        out.push({
          id: `gap:${small.id}:${big.id}`,
          kind: "gap",
          roomIds: [small.id, big.id],
          where: g.facing.where,
          amount: r(g.residual),
          title: `${name(small)} and ${name(big)} are ${cm(g.residual)} apart.`,
          detail: "Their walls should meet.",
          fixLabel: "Close",
          fix: (doc) => moveRoom(doc, small.id, shift[0], shift[1]),
        });
      }
    }
  }
  const reported = new Set<string>();
  for (const room of rooms) {
    const pairs = touching.filter((t) => t.a === room || t.b === room);
    if (pairs.length === 0) continue;
    const connected = pairs.some(({ a, b, facing }) => {
      const span = facing.run / 2;
      const along: HomePoint = [-facing.axis[1], facing.axis[0]];
      return [...a.openings, ...b.openings].some((o) => {
        if (!isGap(o)) return false;
        const m: HomePoint = [(o.a[0] + o.b[0]) / 2, (o.a[1] + o.b[1]) / 2];
        const across = Math.abs((m[0] - facing.where[0]) * facing.axis[0] + (m[1] - facing.where[1]) * facing.axis[1]);
        const sideways = Math.abs((m[0] - facing.where[0]) * along[0] + (m[1] - facing.where[1]) * along[1]);
        return across <= Math.abs(facing.gap) + 0.2 && sideways <= span + 0.05;
      });
    });
    if (connected) continue;
    const best = pairs.reduce((m, p) => (p.facing.run > m.facing.run ? p : m));
    const other = best.a === room ? best.b : best.a;
    const key = [room.id, other.id].sort().join(":");
    if (reported.has(key)) continue;
    reported.add(key);
    // The door goes in the smaller room's wall, where the walls meet.
    const doorRoom = best.a;
    out.push({
      id: `missingDoor:${room.id}`,
      kind: "missingDoor",
      roomIds: [room.id, other.id],
      where: best.facing.where,
      amount: 0,
      title: `${name(room)} has no door to ${name(other)}.`,
      detail: "The scan found a gap in the wall.",
      fixLabel: "Add",
      fix: doorAt(doorRoom.id, best.facing.wallIndex, best.facing.where, best.facing.run),
    });
  }
  return out;
}

/** One issue's fix made. */
export function fixIssue(doc: HomeMapDocument, issue: Pick<HomeMapIssue, "fix">): HomeMapDocument | undefined {
  return issue.fix(doc);
}

const FIX_ORDER: readonly HomeMapIssueKind[] = ["offSquare", "overlap", "gap", "missingDoor"];

/** Every issue on a floor fixed, squares first, then overlaps, gaps and
 * doors, the floor checked again after each fix, each issue tried once.
 * The same map when there is nothing to fix; undefined when the floor is
 * gone. */
export function fixAllIssues(doc: HomeMapDocument, floorId: string): HomeMapDocument | undefined {
  if (floorIndex(doc, floorId) < 0) return undefined;
  const tried = new Set<string>();
  let current = doc;
  for (let round = 0; round < 200; round += 1) {
    const floor = current.floors[floorIndex(current, floorId)];
    if (floor === undefined) break;
    const next = scanIssues(floor)
      .filter((i) => !tried.has(i.id))
      .sort((p, q) => FIX_ORDER.indexOf(p.kind) - FIX_ORDER.indexOf(q.kind))[0];
    if (next === undefined) break;
    tried.add(next.id);
    current = next.fix(current) ?? current;
  }
  return current;
}

// ── the scan as it was ───────────────────────────────────────────────────

/** How near a scanned door's or window's middle must lie to one of the
 * room's own of its kind to take that one's style, and a scanned thing's
 * middle to a hidden one of its kind to stay hidden, in meters: the reach
 * the iPhone's Scan Again keeps them by. */
export const HOME_MAP_SCAN_MATCH_REACH = 0.5;

const middleOf = (o: Pick<HomeMapOpening, "a" | "b">): HomePoint => [(o.a[0] + o.b[0]) / 2, (o.a[1] + o.b[1]) / 2];

/**
 * `room` with its outline, walls, openings and things as `scan` has them,
 * everything else (its id, name, area, page, finish and wall height) its
 * own. As Scan Again does on the iPhone, a scanned door or window with no
 * style takes the style of the room's own door or window of its kind
 * within `HOME_MAP_SCAN_MATCH_REACH`, and a scanned thing is hidden when the
 * room has a hidden thing of its kind within that reach, else shown.
 */
export function homeMapScanRoom(room: HomeMapRoom, scan: HomeMapScan): HomeMapRoom {
  const styled = room.openings.filter((o) => o.style !== undefined);
  const openings = scan.openings.map((o) => {
    const opening: HomeMapOpening = { ...o, a: roundPoint(o.a), b: roundPoint(o.b), z0: r(o.z0), z1: r(o.z1) };
    if (opening.style === undefined) {
      const m = middleOf(opening);
      const style = styled.find((old) => old.kind === opening.kind && distance(middleOf(old), m) <= HOME_MAP_SCAN_MATCH_REACH)?.style;
      if (style !== undefined) opening.style = style;
    }
    return orderedOpening(opening);
  });
  const hidden = room.objects.filter((o) => o.hidden === true);
  const objects = scan.objects.map((o) => {
    const { hidden: _old, ...rest } = o;
    const thing: HomeMapObject = { ...rest, c: roundPoint(o.c), size: [r(o.size[0]), r(o.size[1]), r(o.size[2])], turn: r(o.turn) };
    if (hidden.some((old) => old.kind === o.kind && distance(old.c, o.c) <= HOME_MAP_SCAN_MATCH_REACH)) thing.hidden = true;
    return orderedObject(thing);
  });
  return orderedRoom({
    ...room,
    outline: scan.outline.map(roundPoint),
    walls: scan.walls.map((w) => ({ a: roundPoint(w.a), b: roundPoint(w.b), t: r(w.t) })),
    openings,
    objects,
  });
}

/** A room's outline, walls, openings and things as text, each number
 * rounded to 1 cm and keys in one order, so two shapes compare by what
 * they hold. */
function shapeText(room: Pick<HomeMapRoom, "outline" | "walls" | "openings" | "objects">): string {
  return JSON.stringify([
    room.outline.map(roundPoint),
    room.walls.map((w) => [roundPoint(w.a), roundPoint(w.b), r(w.t)]),
    room.openings.map((o) => [o.kind, o.style ?? "", roundPoint(o.a), roundPoint(o.b), r(o.z0), r(o.z1)]),
    room.objects.map((o) => [o.kind, roundPoint(o.c), o.size.map(r), r(o.turn), r(o.lift ?? 0), o.hidden === true]),
  ]);
}

/** Whether Back to the scan would change `room`: its shape, once rounded,
 * is not the one `scan` would give it. */
export function homeMapScanDiffers(room: HomeMapRoom, scan: HomeMapScan): boolean {
  return shapeText(room) !== shapeText(homeMapScanRoom(room, scan));
}

/** The room put back as it was scanned (`homeMapScanRoom`), its pins left
 * where they are. Undefined when the room is gone or is already as
 * scanned. */
export function backToScan(doc: HomeMapDocument, roomId: string, scan: HomeMapScan): HomeMapDocument | undefined {
  return editRoom(doc, roomId, (room) => (homeMapScanDiffers(room, scan) ? homeMapScanRoom(room, scan) : undefined));
}

/** A room's scan as Shape draws it over the plan: its outline, its walls
 * (the outline's edges when it kept none) and its doors and windows. */
export interface HomeMapScanMark {
  roomId: string;
  outline: HomePoint[];
  walls: HomeSegment[];
  openings: Pick<HomeMapOpening, "kind" | "a" | "b">[];
}

/** The scan of each room of `floor` that has one, in the floor's order. */
export function homeMapScanMarks(floor: HomeMapFloor, scans: HomeMapScans | undefined): HomeMapScanMark[] {
  const marks: HomeMapScanMark[] = [];
  for (const room of floor.rooms) {
    const scan = homeMapScanOf(scans, room.id);
    if (scan === undefined || scan.outline.length < 3) continue;
    marks.push({
      roomId: room.id,
      outline: scan.outline,
      walls: homeWallsOf({ ...room, outline: scan.outline, walls: scan.walls }),
      openings: scan.openings.filter((o) => o.kind !== "opening").map((o) => ({ kind: o.kind, a: o.a, b: o.b })),
    });
  }
  return marks;
}

// ── devices ──────────────────────────────────────────────────────────────

/** The height a device's pin starts at, by its kind, in meters: a light at
 * the ceiling (2.4), unless its name says lamp (a table, desk or bedside
 * lamp 0.8, any other lamp a floor lamp's 1.6); a switch or plug 0.3; a
 * sensor or thermostat 1.5; a speaker or TV 1.0; blinds 2.0; a lock or door
 * 1.0; a fan 2.4, a camera 2.2; anything else 1.2. */
export function homeMapPlaceHeight(entityId: string, name?: string, deviceClass?: string): number {
  const domain = entityId.slice(0, entityId.indexOf("."));
  const words = `${name ?? ""} ${entityId}`.toLowerCase();
  switch (domain) {
    case "light":
      if (!words.includes("lamp")) return 2.4;
      return /table|desk|bedside|night/.test(words) ? 0.8 : 1.6;
    case "switch":
      return 0.3;
    case "sensor":
    case "climate":
      return 1.5;
    case "binary_sensor":
      return deviceClass === "door" || deviceClass === "garage_door" || /\bdoor\b|door_/.test(words) ? 1.0 : 1.5;
    case "media_player":
      return 1.0;
    case "cover":
      return 2.0;
    case "lock":
      return 1.0;
    case "fan":
      return 2.4;
    case "camera":
      return 2.2;
    default:
      return /plug|outlet|socket/.test(words) ? 0.3 : 1.2;
  }
}

/** The new pin `addPin` makes. */
export interface HomeMapNewPin {
  /** A UUID; the phone writes them upper case. */
  id: string;
  entityId: string;
  /** x, y, and z when given, else its kind's height. */
  at: HomePoint | [number, number, number];
  /** A room of the floor; else the room it stands in, or none. */
  roomId?: string;
  /** The entity's name, for its kind's height. */
  name?: string;
}

/** A pin added at the end of a floor's pins. Undefined for a taken id, a
 * room the floor lacks, or a map with 400 pins. */
export function addPin(doc: HomeMapDocument, floorId: string, pin: HomeMapNewPin): HomeMapDocument | undefined {
  const fi = floorIndex(doc, floorId);
  if (fi < 0 || !isHomeMapId(pin.id) || !isHomeMapEntityId(pin.entityId) || idTaken(doc, pin.id) || pinCount(doc) >= HOME_MAP_MAX_PINS) return undefined;
  const floor = doc.floors[fi]!;
  const z = (pin.at as readonly number[])[2] ?? homeMapPlaceHeight(pin.entityId, pin.name);
  if (!finite(pin.at[0], pin.at[1], z)) return undefined;
  let roomId: string | undefined;
  if (pin.roomId !== undefined) {
    roomId = floor.rooms.find((x) => sameHomeMapId(x.id, pin.roomId))?.id;
    if (roomId === undefined) return undefined;
  } else roomId = floor.rooms.find((x) => homePolygonHolds(x.outline, pin.at))?.id;
  const made = orderedPin({ id: pin.id, entityId: pin.entityId, ...(roomId === undefined ? {} : { roomId }), at: [r(pin.at[0]), r(pin.at[1]), r(clamp(z, 0, 100))] });
  return withFloor(doc, fi, { ...floor, pins: [...floor.pins, made] });
}

/** A pin moved to `at` (its height stays), into the room it now stands in,
 * none outside every room. */
export function movePin(doc: HomeMapDocument, pinId: string, at: HomePoint): HomeMapDocument | undefined {
  if (!finite(...at)) return undefined;
  return editPin(doc, pinId, (pin, where) => {
    const room = where.floor.rooms.find((x) => homePolygonHolds(x.outline, at));
    const { roomId: _old, ...rest } = pin;
    return { ...rest, ...(room === undefined ? {} : { roomId: room.id }), at: [r(at[0]), r(at[1]), pin.at[2]] };
  });
}

/** A pin's height, 0 to 100 meters. */
export function setPinHeight(doc: HomeMapDocument, pinId: string, z: number): HomeMapDocument | undefined {
  if (!finite(z)) return undefined;
  return editPin(doc, pinId, (pin) => ({ ...pin, at: [pin.at[0], pin.at[1], r(clamp(z, 0, 100))] }));
}

/** Several pins at one height; the ones the map no longer has are passed
 * over. */
export function setPinsHeight(doc: HomeMapDocument, pinIds: readonly string[], z: number): HomeMapDocument | undefined {
  if (!finite(z)) return undefined;
  let out = doc;
  for (const id of pinIds) out = setPinHeight(out, id, z) ?? out;
  return out;
}

/** Same height for all lights: every light on the pin's floor at this
 * pin's height. */
export function sameHeightForLights(doc: HomeMapDocument, pinId: string): HomeMapDocument | undefined {
  const at = pinAt(doc, pinId);
  if (at === undefined) return undefined;
  const lights = at.floor.pins.filter((p) => p.entityId.startsWith("light.")).map((p) => p.id);
  return setPinsHeight(doc, lights, at.pin.at[2]);
}

/** A pin moved to the middle of its room (where its name goes). */
export function centerPinInRoom(doc: HomeMapDocument, pinId: string): HomeMapDocument | undefined {
  const at = pinAt(doc, pinId);
  if (at === undefined) return undefined;
  const room = at.floor.rooms.find((x) => sameHomeMapId(x.id, at.pin.roomId)) ?? at.floor.rooms.find((x) => homePolygonHolds(x.outline, at.pin.at));
  const middle = room === undefined ? undefined : homeLabelPoint(room);
  if (room === undefined || middle === undefined) return undefined;
  return editPin(doc, pinId, (pin) => ({ ...pin, roomId: room.id, at: [r(middle[0]), r(middle[1]), pin.at[2]] }));
}

/** The map without a pin. */
export function removePin(doc: HomeMapDocument, pinId: string): HomeMapDocument | undefined {
  const at = pinAt(doc, pinId);
  if (at === undefined) return undefined;
  return withFloor(doc, at.fi, { ...at.floor, pins: at.floor.pins.filter((_, i) => i !== at.pi) });
}

/** What `setPinFields` changes; null (or a blank name) takes a key away, so
 * the pin goes back to its default. */
export interface HomeMapPinFields {
  name?: string | null;
  icon?: HomeMapPinIcon | null;
  reading?: HomeMapPinReading | null;
  glow?: number | null;
  glowColor?: string | null;
  /** True lets the pool of light past the walls; false or null keeps it in
   * its room, the default, so the key is taken away. */
  glowSpill?: boolean | null;
  tap?: HomeMapPinTap | null;
  pageId?: string | null;
}

/**
 * What a pin shows and does. A name is trimmed to 100 characters, and the
 * entity's own name (`friendlyName`) or a blank one is not stored. A glow is
 * kept within 0.2 to 10 m, a colour is `warm` or `#RRGGBB` (stored lower
 * case), and a glow spill is only ever stored true. A tap other than page
 * drops the pin's page; tap page needs a page, given here or already on the
 * pin. Undefined for a value the store would refuse.
 */
export function setPinFields(doc: HomeMapDocument, pinId: string, fields: HomeMapPinFields, friendlyName?: string): HomeMapDocument | undefined {
  return editPin(doc, pinId, (pin) => {
    const next: HomeMapPin = { ...pin };
    if (fields.name !== undefined) {
      const name = nameOf(fields.name ?? undefined);
      if (name === undefined || name === friendlyName?.trim()) delete next.name;
      else next.name = name;
    }
    if (fields.icon !== undefined) {
      if (fields.icon === null) delete next.icon;
      else if (HOME_MAP_PIN_ICONS.includes(fields.icon)) next.icon = fields.icon;
      else return undefined;
    }
    if (fields.reading !== undefined) {
      if (fields.reading === null) delete next.reading;
      else if (HOME_MAP_PIN_READINGS.includes(fields.reading)) next.reading = fields.reading;
      else return undefined;
    }
    if (fields.glow !== undefined) {
      if (fields.glow === null) delete next.glow;
      else if (finite(fields.glow)) next.glow = r(clamp(fields.glow, HOME_MAP_GLOW_LOW, HOME_MAP_GLOW_HIGH));
      else return undefined;
    }
    if (fields.glowColor !== undefined) {
      if (fields.glowColor === null) delete next.glowColor;
      else if (isHomeMapGlowColor(fields.glowColor)) next.glowColor = fields.glowColor.toLowerCase();
      else return undefined;
    }
    if (fields.glowSpill !== undefined) {
      if (fields.glowSpill === true) next.glowSpill = true;
      else if (fields.glowSpill === null || fields.glowSpill === false) delete next.glowSpill;
      else return undefined;
    }
    if (fields.pageId !== undefined) {
      if (fields.pageId === null) delete next.pageId;
      else if (isHomeMapId(fields.pageId)) next.pageId = fields.pageId;
      else return undefined;
    }
    if (fields.tap !== undefined) {
      if (fields.tap === null) delete next.tap;
      else if (HOME_MAP_PIN_TAPS.includes(fields.tap)) next.tap = fields.tap;
      else return undefined;
    }
    if (next.tap !== "page") delete next.pageId;
    else if (next.pageId === undefined) return undefined;
    return next;
  });
}

// Several picked pins at once, as one edit, so one undo takes the whole
// change back and one save stores it. A pin the map no longer has is passed
// over, so the same edit made on a newer map (`save.ts`) changes the rest;
// with none of them left the edit no longer fits.

/** The ids of `pinIds` the map still has, each once. */
function pinsStill(doc: HomeMapDocument, pinIds: readonly string[]): string[] {
  const out: string[] = [];
  for (const id of pinIds) {
    const at = pinAt(doc, id);
    if (at !== undefined && !out.some((x) => sameHomeMapId(x, at.pin.id))) out.push(at.pin.id);
  }
  return out;
}

/** Several pins moved by the same step, each from where it stands (its
 * height stays) into the room it now stands in, none outside every room. */
export function movePins(doc: HomeMapDocument, pinIds: readonly string[], dx: number, dy: number): HomeMapDocument | undefined {
  if (!finite(dx, dy)) return undefined;
  const ids = pinsStill(doc, pinIds);
  if (ids.length === 0) return undefined;
  let out = doc;
  for (const id of ids) {
    const pin = pinAt(out, id)!.pin;
    out = movePin(out, id, [pin.at[0] + dx, pin.at[1] + dy]) ?? out;
  }
  return out;
}

/** The same fields on several pins (`setPinFields` on each, never a name,
 * which is one pin's own). Undefined when any of them would refuse it, so
 * the picked pins never end up half changed. */
export function setPinsFields(doc: HomeMapDocument, pinIds: readonly string[], fields: Omit<HomeMapPinFields, "name">): HomeMapDocument | undefined {
  const ids = pinsStill(doc, pinIds);
  if (ids.length === 0) return undefined;
  const { name: _name, ...shared } = fields as HomeMapPinFields;
  let out = doc;
  for (const id of ids) {
    const next = setPinFields(out, id, shared);
    if (next === undefined) return undefined;
    out = next;
  }
  return out;
}

/** The map without several pins. */
export function removePins(doc: HomeMapDocument, pinIds: readonly string[]): HomeMapDocument | undefined {
  const ids = pinsStill(doc, pinIds);
  if (ids.length === 0) return undefined;
  let out = doc;
  for (const id of ids) out = removePin(out, id) ?? out;
  return out;
}

/** A device the home has, for `placeAllByArea`: its entity, its area, and
 * its name and device class for its height. */
export interface HomeMapDeviceInfo {
  entityId: string;
  areaId?: string | undefined;
  name?: string | undefined;
  deviceClass?: string | undefined;
}

/** Spots for new pins are kept this far from the walls, and laid on a grid
 * this fine. */
const PLACE_INSET = 0.3;
const PLACE_STEP = 0.2;

/** Where `count` new pins go in a room: the spot of a grid over the room
 * (kept off the walls) furthest from every pin already there and each spot
 * picked before, so they spread out; the middle of the room first. A lock
 * or door goes by the room's first door when it has one. */
function spotsIn(room: HomeMapRoom, taken: readonly HomePoint[], devices: readonly HomeMapDeviceInfo[]): HomePoint[] {
  const middle = homeLabelPoint(room) ?? homeMapRoomCenter(room);
  const edges = room.outline.map((p, i) => ({ a: p, b: room.outline[(i + 1) % room.outline.length]! }));
  const clear = (p: HomePoint) => homePolygonHolds(room.outline, p) && edges.every((e) => homeProjectDistance(p, e.a, e.b) >= PLACE_INSET);
  const bounds = homePointBounds(room.outline);
  const grid: HomePoint[] = [];
  if (bounds !== undefined) {
    for (let y = bounds.minY + PLACE_INSET; y <= bounds.maxY - PLACE_INSET + 1e-9; y += PLACE_STEP) {
      for (let x = bounds.minX + PLACE_INSET; x <= bounds.maxX - PLACE_INSET + 1e-9; x += PLACE_STEP) if (clear([x, y])) grid.push([x, y]);
    }
  }
  const door = room.openings.find((o) => o.kind === "door");
  const used = taken.slice();
  return devices.map((device) => {
    const domain = device.entityId.slice(0, device.entityId.indexOf("."));
    const doorish = domain === "lock" || device.deviceClass === "door" || /\bdoor\b/.test((device.name ?? "").toLowerCase());
    let spot: HomePoint | undefined;
    if (doorish && door !== undefined) {
      const m: HomePoint = [(door.a[0] + door.b[0]) / 2, (door.a[1] + door.b[1]) / 2];
      const inward = Math.hypot(middle[0] - m[0], middle[1] - m[1]);
      const step = Math.min(0.3, inward);
      spot = inward > 0 ? [m[0] + ((middle[0] - m[0]) / inward) * step, m[1] + ((middle[1] - m[1]) / inward) * step] : m;
      if (used.some((u) => distance(u, spot!) < 0.15)) spot = undefined;
    }
    if (spot === undefined) {
      if (grid.length === 0) spot = used.some((u) => distance(u, middle) < 0.05) ? [middle[0] + 0.2 * used.length, middle[1]] : middle;
      else if (used.length === 0) spot = grid.reduce((m, p) => (distance(p, middle) < distance(m, middle) ? p : m));
      else {
        let best = grid[0]!;
        let bestScore = -Infinity;
        for (const p of grid) {
          // Furthest from every pin, then nearest the middle.
          const score = Math.min(...used.map((u) => distance(u, p))) - 0.01 * distance(p, middle);
          if (score > bestScore) {
            best = p;
            bestScore = score;
          }
        }
        spot = best;
      }
    }
    used.push(spot);
    return spot;
  });
}

function homeProjectDistance(p: HomePoint, a: HomePoint, b: HomePoint): number {
  const { t, point } = homeProject(p, a, b);
  if (t <= 0) return distance(p, a);
  if (t >= 1) return distance(p, b);
  return distance(p, point);
}

/**
 * Place all by area: each device not yet on the map (on any floor) whose
 * area is a room's on this floor gets a pin in that room, the room's new
 * pins spread out and away from its pins already there, each at its kind's
 * height (`homeMapPlaceHeight`). New ids from `newId`, upper case as the
 * phone writes them. Stops at 400 pins. The map and the entities placed;
 * undefined when the floor is gone.
 */
export function placeAllByArea(doc: HomeMapDocument, floorId: string, devices: readonly HomeMapDeviceInfo[], newId: () => string): { doc: HomeMapDocument; placed: string[] } | undefined {
  const fi = floorIndex(doc, floorId);
  if (fi < 0) return undefined;
  const floor = doc.floors[fi]!;
  const onMap = new Set(doc.floors.flatMap((f) => f.pins.map((p) => p.entityId)));
  const byRoom = new Map<HomeMapRoom, HomeMapDeviceInfo[]>();
  const seen = new Set<string>();
  for (const device of devices) {
    if (onMap.has(device.entityId) || seen.has(device.entityId) || !isHomeMapEntityId(device.entityId) || device.areaId === undefined) continue;
    const room = floor.rooms.find((x) => x.areaId === device.areaId);
    if (room === undefined) continue;
    seen.add(device.entityId);
    if (!byRoom.has(room)) byRoom.set(room, []);
    byRoom.get(room)!.push(device);
  }
  let total = pinCount(doc);
  const pins = floor.pins.slice();
  const placed: string[] = [];
  for (const [target, list] of byRoom) {
    const already = homeMapPinsOfRoom(floor, target.id).map((p): HomePoint => [p.at[0], p.at[1]]);
    const spots = spotsIn(target, already, list);
    for (const [i, device] of list.entries()) {
      if (total >= HOME_MAP_MAX_PINS) break;
      let id = newId().toUpperCase();
      while (idTaken(doc, id) || pins.some((p) => sameHomeMapId(p.id, id))) id = newId().toUpperCase();
      const spot = spots[i]!;
      pins.push(orderedPin({ id, entityId: device.entityId, roomId: target.id, at: [r(spot[0]), r(spot[1]), homeMapPlaceHeight(device.entityId, device.name, device.deviceClass)] }));
      placed.push(device.entityId);
      total += 1;
    }
  }
  if (placed.length === 0) return { doc, placed };
  return { doc: withFloor(doc, fi, { ...floor, pins }), placed };
}

// ── style ────────────────────────────────────────────────────────────────

/** The tile keys that hold a Home map tile's own choice of each home style
 * key. */
export const HOME_MAP_TILE_STYLE_KEYS: Readonly<Record<keyof HomeMapStyle, string>> = {
  look: "homeMapLook",
  turn: "homeMapTurn",
  names: "homeMapNames",
  devices: "homeMapDevices",
  furniture: "homeMapFurniture",
  glow: "homeMapGlow",
};

/** What `setHomeStyle` changes: null takes a key away (its default). */
export type HomeMapStyleChange = { [K in keyof HomeMapStyle]?: HomeMapStyle[K] | null };

/** A turn as the style keeps it: whole degrees from -180 to 180; undefined
 * for a value that is not a finite number. */
function turnOf(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const turn = Math.round(clamp(value, -180, 180));
  return turn === 0 ? 0 : turn;
}

/** The home style changed: a default (or null) takes the key away, and a
 * style left empty goes. Undefined for a value the store would refuse. */
export function setHomeStyle(doc: HomeMapDocument, change: HomeMapStyleChange): HomeMapDocument | undefined {
  const next: Record<string, unknown> = { ...(doc.style ?? {}) };
  for (const key of Object.keys(change) as (keyof HomeMapStyle)[]) {
    const value = change[key];
    if (value === undefined) continue;
    if (value === null) {
      delete next[key];
      continue;
    }
    let kept: unknown;
    switch (key) {
      case "look":
        kept = HOME_MAP_LOOKS.includes(value as HomeMapLook) ? value : undefined;
        break;
      case "turn":
        kept = turnOf(value);
        break;
      case "devices":
        kept = HOME_MAP_DEVICES_SHOWN.includes(value as HomeMapDevicesShown) ? value : undefined;
        break;
      default:
        kept = typeof value === "boolean" ? value : undefined;
    }
    if (kept === undefined) return undefined;
    if (kept === HOME_MAP_STYLE_DEFAULTS[key]) delete next[key];
    else next[key] = kept;
  }
  const style: HomeMapStyle = {};
  for (const key of Object.keys(HOME_MAP_STYLE_DEFAULTS) as (keyof HomeMapStyle)[]) if (Object.hasOwn(next, key)) (style as Record<string, unknown>)[key] = next[key];
  const { style: _old, ...rest } = doc;
  return orderedDocument(Object.keys(style).length > 0 ? { ...rest, style } : rest);
}

/** The home style with every key filled in from its default. */
export function homeStyleOf(doc: HomeMapDocument | null | undefined): Required<HomeMapStyle> {
  return { ...HOME_MAP_STYLE_DEFAULTS, ...(doc?.style ?? {}) };
}

/** Looks an older panel or app stored on a tile, and the look each reads
 * as now. */
const OLD_LOOKS: Readonly<Record<string, HomeMapLook>> = { glow: "plan", dollhouse: "warm" };

/** A tile's own value for one style key, or undefined when it has none it
 * could use (absent, or not a value of that key). */
function tileValue<K extends keyof HomeMapStyle>(tile: Readonly<Record<string, unknown>>, key: K): HomeMapStyle[K] | undefined {
  const raw = tile[HOME_MAP_TILE_STYLE_KEYS[key]];
  switch (key) {
    case "look":
      if (typeof raw !== "string") return undefined;
      if (HOME_MAP_LOOKS.includes(raw as HomeMapLook)) return raw as HomeMapStyle[K];
      return (Object.hasOwn(OLD_LOOKS, raw) ? OLD_LOOKS[raw] : undefined) as HomeMapStyle[K];
    case "turn":
      return turnOf(raw) as HomeMapStyle[K];
    case "devices":
      return (HOME_MAP_DEVICES_SHOWN.includes(raw as HomeMapDevicesShown) ? raw : undefined) as HomeMapStyle[K];
    default:
      return (typeof raw === "boolean" ? raw : undefined) as HomeMapStyle[K];
  }
}

/**
 * A Home map tile's options by the tile rule, as every device reads them: a
 * tile key (`homeMapLook`, `homeMapTurn`, `homeMapNames`, `homeMapDevices`,
 * `homeMapFurniture`, `homeMapGlow`) when present wins, else the home
 * style's value, else the default. An older look (glow, dollhouse) reads as
 * the look it became.
 */
export function tileOptionsResolved(tile: Readonly<Record<string, unknown>>, doc: HomeMapDocument | null | undefined): Required<HomeMapStyle> {
  const home = homeStyleOf(doc);
  const out = { ...home };
  for (const key of Object.keys(HOME_MAP_TILE_STYLE_KEYS) as (keyof HomeMapStyle)[]) {
    const own = tileValue(tile, key);
    if (own !== undefined) (out as Record<string, unknown>)[key] = own;
  }
  return out;
}

/** Whether a tile has any key of its own over the home style. */
export function tileHasOwnStyle(tile: Readonly<Record<string, unknown>>): boolean {
  return Object.values(HOME_MAP_TILE_STYLE_KEYS).some((key) => Object.hasOwn(tile, key));
}

/**
 * The tile keys the Map card writes for a choice: the tile key and the
 * value to store, or undefined to take the key away because the value is
 * the home style's (so the tile follows the home style when it changes).
 */
export function tileStyleKey<K extends keyof HomeMapStyle>(key: K, value: Required<HomeMapStyle>[K], doc: HomeMapDocument | null | undefined): { key: string; value: Required<HomeMapStyle>[K] | undefined } {
  const home = homeStyleOf(doc)[key];
  const kept = key === "turn" ? turnOf(value) : value;
  return { key: HOME_MAP_TILE_STYLE_KEYS[key], value: kept === home ? undefined : (kept as Required<HomeMapStyle>[K]) };
}

/** A tile with every one of its style keys taken away: Use the home style. */
export function withoutTileStyle<T extends Record<string, unknown>>(tile: T): T {
  const out: Record<string, unknown> = { ...tile };
  for (const key of Object.values(HOME_MAP_TILE_STYLE_KEYS)) delete out[key];
  return out as T;
}

// ── undo and redo ────────────────────────────────────────────────────────

/** How many steps back the editor keeps. */
export const HOME_MAP_HISTORY_CAP = 100;

/**
 * The editor's undo and redo: the documents before each edit, and those
 * undone since. `push` the document an edit started from (it clears what
 * could be redone); `undo` hands back the one before, given the one now;
 * `redo` the reverse. Holds at most 100 steps back, dropping the oldest.
 */
export class HomeMapHistory {
  private past: HomeMapDocument[] = [];
  private future: HomeMapDocument[] = [];

  constructor(private readonly cap = HOME_MAP_HISTORY_CAP) {}

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  /** Record the document an edit was made on. */
  push(before: HomeMapDocument): void {
    this.past.push(before);
    if (this.past.length > this.cap) this.past.splice(0, this.past.length - this.cap);
    this.future = [];
  }

  /** The document before the last edit, `current` kept for redo; undefined
   * when there is none. */
  undo(current: HomeMapDocument): HomeMapDocument | undefined {
    const before = this.past.pop();
    if (before === undefined) return undefined;
    this.future.push(current);
    return before;
  }

  /** The document the last undo left, `current` kept for undo; undefined
   * when there is none. */
  redo(current: HomeMapDocument): HomeMapDocument | undefined {
    const next = this.future.pop();
    if (next === undefined) return undefined;
    this.past.push(current);
    return next;
  }

  /** Forget everything, as when the map is read again. */
  clear(): void {
    this.past = [];
    this.future = [];
  }
}
