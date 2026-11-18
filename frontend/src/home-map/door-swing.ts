// Which doors of a floor swing into something: another door's swing, or a
// piece of furniture. The swing is the one the plan draws (`homeDoorSwingsOf`
// in `geometry.ts`): the leaf hung at the door's `a`, opening square to the
// wall into the room that holds it, and the quarter circle its free end
// sweeps. Two swings or a swing and a box clash when they overlap by more
// than `HOME_MAP_SWING_CLASH_DEPTH`.
//
// A door between two rooms is scanned once from each room and drawn with a
// swing on each side; the two are one door (`door-pairs.ts`), so a door is
// never checked against its own partner. Only reads the map. The editor
// draws a clashing swing in amber on the plan and says what it hits on the
// door's card (`mode-doors.ts`). The devices never draw it.

import { homeMapDoorPairs, homeMapDoorPartner } from "./door-pairs.js";
import { homeMapObjectName } from "./editor-view.js";
import { homeMapPiece } from "./furniture.js";
import { type HomeDoorSwing, homeBoxCorners, homeBoxOf, homeClipPolygon, homeDoorSwingsOf } from "./geometry.js";
import { type HomeMapDocument, type HomeMapFloor, type HomeMapObject, type HomePoint, homeMapRoomName, orderedDocument, sameHomeMapId } from "./model.js";

/** How deep an overlap must be to count, in meters: across its narrowest
 * way. A scan places doors and furniture to within a few centimetres, and a
 * leaf that brushes a thing by less than this still opens in the house, so
 * a thinner sliver is scan noise, not a clash. */
export const HOME_MAP_SWING_CLASH_DEPTH = 0.05;

/** A thing this low or lower is a rug or a mat, which a door passes over,
 * in meters from the floor to its top. */
const FLAT_TOP = 0.03;

/** How many straight steps a swing's quarter circle is drawn and measured
 * with. */
const ARC_STEPS = 16;

/** A door of a room, by its place in `openings`. */
export interface HomeMapDoorRef {
  roomId: string;
  index: number;
}

/** One thing a door's swing runs into. */
export type HomeMapSwingHit =
  | { kind: "door"; door: HomeMapDoorRef; depth: number }
  | { kind: "object"; roomId: string; object: number; depth: number };

/** A door whose swing runs into something, and every thing it runs into. */
export interface HomeMapSwingClash {
  door: HomeMapDoorRef;
  hits: HomeMapSwingHit[];
}

interface Swing {
  door: HomeMapDoorRef;
  polygon: HomePoint[];
}

/** The quarter circle a leaf sweeps, as a convex polygon: the hinge, then
 * the free end from open to shut. */
export function homeMapSwingPolygon(swing: HomeDoorSwing): HomePoint[] {
  const { hinge, shut, open } = swing;
  const start = Math.atan2(open[1] - hinge[1], open[0] - hinge[0]);
  let sweep = Math.atan2(shut[1] - hinge[1], shut[0] - hinge[0]) - start;
  if (sweep > Math.PI) sweep -= 2 * Math.PI;
  if (sweep < -Math.PI) sweep += 2 * Math.PI;
  const radius = Math.hypot(shut[0] - hinge[0], shut[1] - hinge[1]);
  const out: HomePoint[] = [hinge];
  for (let i = 0; i <= ARC_STEPS; i += 1) {
    const angle = start + (sweep * i) / ARC_STEPS;
    out.push([hinge[0] + Math.cos(angle) * radius, hinge[1] + Math.sin(angle) * radius]);
  }
  return out;
}

/** A polygon turned to go round counter-clockwise (positive area), which
 * `homeClipPolygon` needs of the one it clips by. */
function counterClockwise(polygon: HomePoint[]): HomePoint[] {
  let twice = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const p = polygon[i]!;
    const q = polygon[(i + 1) % polygon.length]!;
    twice += p[0] * q[1] - q[0] * p[1];
  }
  return twice < 0 ? [...polygon].reverse() : polygon;
}

/** The overlap of two convex polygons. */
function overlapOf(p: HomePoint[], q: HomePoint[]): HomePoint[] {
  const clip = counterClockwise(q);
  let out = p;
  for (let i = 0; i < clip.length && out.length > 0; i += 1) {
    const a = clip[i]!;
    const b = clip[(i + 1) % clip.length]!;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-9) continue;
    out = homeClipPolygon(out, a, b, 1);
  }
  return out;
}

/** How deep a convex polygon is across its narrowest way, in meters: the
 * least, over its edges, of how far its furthest corner stands from that
 * edge. 0 for less than a triangle. */
export function homeMapPolygonDepth(polygon: readonly HomePoint[]): number {
  if (polygon.length < 3) return 0;
  let least = Infinity;
  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i]!;
    const b = polygon[(i + 1) % polygon.length]!;
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (length < 1e-6) continue;
    let far = 0;
    for (const p of polygon) far = Math.max(far, Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) / length);
    least = Math.min(least, far);
  }
  return least === Infinity ? 0 : least;
}

/** How deep two convex shapes overlap, in meters; 0 when they do not. */
export function homeMapOverlapDepth(p: HomePoint[], q: HomePoint[]): number {
  return homeMapPolygonDepth(overlapOf(p, q));
}

/** Whether a door's swing can run into this thing: one shown, standing on
 * the floor or hung lower than the door's top, and not flat as a rug. */
function standsInSwing(object: HomeMapObject, doorTop: number): boolean {
  if (object.hidden === true || object.kind === "rug") return false;
  const lift = object.lift ?? 0;
  if (lift >= doorTop) return false;
  return lift + object.size[2] > FLAT_TOP;
}

const refKey = (door: HomeMapDoorRef) => `${door.roomId.toUpperCase()}:${door.index}`;

const clashMemo = new WeakMap<object, HomeMapSwingClash[]>();

/** Every door of the floor whose swing runs into another door's swing or a
 * piece of furniture, in the order of the floor's rooms and their doors.
 * Each pair of doors is found from both sides. A floor's answer is kept for
 * that floor object, as the plan asks for it on every draw. */
export function homeMapSwingClashes(floor: Pick<HomeMapFloor, "rooms">): HomeMapSwingClash[] {
  const held = clashMemo.get(floor);
  if (held !== undefined) return held;
  const pairs = homeMapDoorPairs(floor);
  const swings: Swing[] = [];
  const tops = new Map<string, number>();
  for (const room of floor.rooms) {
    room.openings.forEach((o, index) => {
      if (o.kind !== "door") return;
      const door = { roomId: room.id, index };
      tops.set(refKey(door), o.z1);
      for (const s of homeDoorSwingsOf(o, room)) swings.push({ door, polygon: homeMapSwingPolygon(s) });
    });
  }
  const sameDoor = (x: HomeMapDoorRef, y: HomeMapDoorRef) => sameHomeMapId(x.roomId, y.roomId) && x.index === y.index;
  const partners = (x: HomeMapDoorRef, y: HomeMapDoorRef) => {
    const p = homeMapDoorPartner(pairs, x.roomId, x.index);
    const q = homeMapDoorPartner(pairs, y.roomId, y.index);
    return (p !== undefined && sameDoor(p, y)) || (q !== undefined && sameDoor(q, x));
  };
  const boxes = floor.rooms.flatMap((room) => room.objects.map((object, i) => ({ roomId: room.id, index: i, object, polygon: homeBoxCorners(homeBoxOf(object)) })));

  const found = new Map<string, HomeMapSwingClash>();
  const add = (door: HomeMapDoorRef, hit: HomeMapSwingHit, same: (h: HomeMapSwingHit) => boolean) => {
    const key = refKey(door);
    let clash = found.get(key);
    if (clash === undefined) {
      clash = { door, hits: [] };
      found.set(key, clash);
    }
    const had = clash.hits.find(same);
    if (had === undefined) clash.hits.push(hit);
    else had.depth = Math.max(had.depth, hit.depth);
  };
  for (const [i, x] of swings.entries()) {
    for (const y of swings.slice(i + 1)) {
      if (sameDoor(x.door, y.door) || partners(x.door, y.door)) continue;
      const depth = homeMapOverlapDepth(x.polygon, y.polygon);
      if (depth <= HOME_MAP_SWING_CLASH_DEPTH) continue;
      add(x.door, { kind: "door", door: y.door, depth }, (h) => h.kind === "door" && sameDoor(h.door, y.door));
      add(y.door, { kind: "door", door: x.door, depth }, (h) => h.kind === "door" && sameDoor(h.door, x.door));
    }
    const top = tops.get(refKey(x.door)) ?? Infinity;
    for (const box of boxes) {
      if (!standsInSwing(box.object, top)) continue;
      const depth = homeMapOverlapDepth(x.polygon, box.polygon);
      if (depth <= HOME_MAP_SWING_CLASH_DEPTH) continue;
      add(x.door, { kind: "object", roomId: box.roomId, object: box.index, depth }, (h) => h.kind === "object" && sameHomeMapId(h.roomId, box.roomId) && h.object === box.index);
    }
  }
  // In the floor's order, whatever order the swings were met in.
  const order = (d: HomeMapDoorRef) => floor.rooms.findIndex((r) => sameHomeMapId(r.id, d.roomId)) * 1000 + d.index;
  const out = [...found.values()].sort((p, q) => order(p.door) - order(q.door));
  clashMemo.set(floor, out);
  return out;
}

/** What one door's swing runs into, if anything. */
export function homeMapSwingClashOf(floor: Pick<HomeMapFloor, "rooms">, roomId: string, index: number): HomeMapSwingClash | undefined {
  return homeMapSwingClashes(floor).find((c) => sameHomeMapId(c.door.roomId, roomId) && c.door.index === index);
}

/** A door in words, as seen from `from`'s room: "the door to Chens Office"
 * (the room it opens to), else "the door of Bedroom", else "another door". */
export function homeMapDoorWords(floor: Pick<HomeMapFloor, "rooms">, door: HomeMapDoorRef, from: HomeMapDoorRef): string {
  const name = (id: string) => {
    const room = floor.rooms.find((r) => sameHomeMapId(r.id, id));
    return room === undefined ? undefined : homeMapRoomName(room);
  };
  const partner = homeMapDoorPartner(homeMapDoorPairs(floor), door.roomId, door.index);
  if (partner !== undefined && !sameHomeMapId(partner.roomId, from.roomId)) {
    const to = name(partner.roomId);
    if (to !== undefined) return `the door to ${to}`;
  }
  if (!sameHomeMapId(door.roomId, from.roomId)) {
    const of = name(door.roomId);
    if (of !== undefined) return `the door of ${of}`;
  }
  return "another door";
}

/** One hit in words: "Swings into the door to Chens Office", "Swings into
 * the desk". */
export function homeMapSwingHitWords(floor: Pick<HomeMapFloor, "rooms">, from: HomeMapDoorRef, hit: HomeMapSwingHit): string {
  if (hit.kind === "door") return `Swings into ${homeMapDoorWords(floor, hit.door, from)}`;
  const object = floor.rooms.find((r) => sameHomeMapId(r.id, hit.roomId))?.objects[hit.object];
  const thing = object === undefined ? "something" : (homeMapPiece(object.model)?.name ?? homeMapObjectName(object.kind)).toLowerCase();
  return `Swings into the ${thing}`;
}

/** How many doors of the floor swing into something. */
export function homeMapSwingClashCount(floor: Pick<HomeMapFloor, "rooms">): number {
  return homeMapSwingClashes(floor).length;
}

/** The door hung from its other side: its ends swapped, so the leaf hangs
 * at the other end and sweeps the other way into its room. Undefined for no
 * such door. */
export function swingDoorOtherWay(doc: HomeMapDocument, roomId: string, index: number): HomeMapDocument | undefined {
  let done = false;
  const floors = doc.floors.map((floor) => {
    const ri = floor.rooms.findIndex((r) => sameHomeMapId(r.id, roomId));
    const room = floor.rooms[ri];
    const o = room?.openings[index];
    if (room === undefined || o === undefined || o.kind !== "door") return floor;
    done = true;
    const openings = room.openings.slice();
    openings[index] = { ...o, a: o.b, b: o.a };
    const rooms = floor.rooms.slice();
    rooms[ri] = { ...room, openings };
    return { ...floor, rooms };
  });
  return done ? orderedDocument({ ...doc, floors }) : undefined;
}

/** Whether hanging this door from its other side leaves its swing running
 * into nothing: the editor then offers Swing the other way. Never for a
 * door of two leaves, which looks the same either way. */
export function homeMapSwingFlipClears(doc: HomeMapDocument, floorId: string, roomId: string, index: number): boolean {
  const room = doc.floors.find((f) => sameHomeMapId(f.id, floorId))?.rooms.find((r) => sameHomeMapId(r.id, roomId));
  const o = room?.openings[index];
  if (room === undefined || o === undefined || homeDoorSwingsOf(o, room).length !== 1) return false;
  const flipped = swingDoorOtherWay(doc, roomId, index);
  const floor = flipped?.floors.find((f) => sameHomeMapId(f.id, floorId));
  return floor !== undefined && homeMapSwingClashOf(floor, roomId, index) === undefined;
}

/** How badly a floor's doors swing into things: how many doors clash, and
 * how deep all their hits go. */
function clashScore(floor: Pick<HomeMapFloor, "rooms">): { doors: number; depth: number } {
  const clashes = homeMapSwingClashes(floor);
  return { doors: clashes.length, depth: clashes.reduce((t, c) => t + c.hits.reduce((s, h) => s + h.depth, 0), 0) };
}

const better = (p: { doors: number; depth: number }, q: { doors: number; depth: number }) => p.doors < q.doors;

/** Fix swings: each door that swings into something is hung from its other
 * side when that leaves fewer of the floor's doors running into something,
 * door by door in the floor's
 * order, twice round, so one door's new swing can free the next. A door of
 * two leaves looks the same either way and is left. Undefined when no door
 * is better the other way. */
export function fixDoorSwings(doc: HomeMapDocument, floorId: string): HomeMapDocument | undefined {
  const floorOf = (d: HomeMapDocument) => d.floors.find((f) => sameHomeMapId(f.id, floorId));
  let current = doc;
  let changed = false;
  for (let pass = 0; pass < 2; pass += 1) {
    const start = floorOf(current);
    if (start === undefined) return undefined;
    const clashes = homeMapSwingClashes(start);
    if (clashes.length === 0) break;
    let moved = false;
    for (const clash of clashes) {
      const floor = floorOf(current)!;
      if (homeMapSwingClashOf(floor, clash.door.roomId, clash.door.index) === undefined) continue;
      const room = floor.rooms.find((r) => sameHomeMapId(r.id, clash.door.roomId));
      const o = room?.openings[clash.door.index];
      if (room === undefined || o === undefined || homeDoorSwingsOf(o, room).length !== 1) continue;
      const flipped = swingDoorOtherWay(current, clash.door.roomId, clash.door.index);
      const next = flipped === undefined ? undefined : floorOf(flipped);
      if (next === undefined || !better(clashScore(next), clashScore(floor))) continue;
      current = flipped!;
      changed = moved = true;
    }
    if (!moved) break;
  }
  return changed ? current : undefined;
}
