// Which doors of a floor meet. A door between two rooms is scanned once from
// each room, so a floor put together well has its doors in pairs: two doors
// on one line, about one width, with their rooms on either side. A door with
// no partner is the plainest sign a room stands in the wrong place, which is
// what the editor's Fit rooms card and its amber and green door marks say.
//
// Only reads the map. The edits that make doors meet are in `edit-ops.ts`.

import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapRoomCenter, sameHomeMapId } from "./model.js";

/** How near two doors must be to count as one, in meters: square to the
 * door's wall, and along it. */
export const HOME_MAP_DOOR_ACROSS = 0.25;
export const HOME_MAP_DOOR_ALONG = 0.35;
/** Two doors further apart in width than this are not one door, in meters. */
export const HOME_MAP_DOOR_WIDTH_GAP = 0.5;
/** Two doors further from parallel than this are not one door, in degrees. */
export const HOME_MAP_DOOR_PARALLEL = 5;

/** A door or way through of a room (never a window). */
export interface HomeMapDoor {
  roomId: string;
  /** Its place in its room's `openings`. */
  index: number;
  a: HomePoint;
  b: HomePoint;
  mid: HomePoint;
  width: number;
  /** The way it runs, from `a` to `b`. */
  ux: number;
  uy: number;
  /** The middle of its room. */
  centre: HomePoint;
}

/** A room's doors, each at least 5 cm wide, with `offset` added. */
export function homeMapDoorsOf(room: HomeMapRoom, offset: readonly [number, number] = [0, 0]): HomeMapDoor[] {
  const middle = homeMapRoomCenter(room);
  const centre: HomePoint = [middle[0] + offset[0], middle[1] + offset[1]];
  return room.openings.flatMap((o, index) => {
    if (o.kind === "window") return [];
    const width = Math.hypot(o.b[0] - o.a[0], o.b[1] - o.a[1]);
    if (width < 0.05) return [];
    const a: HomePoint = [o.a[0] + offset[0], o.a[1] + offset[1]];
    const b: HomePoint = [o.b[0] + offset[0], o.b[1] + offset[1]];
    return [{ roomId: room.id, index, a, b, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as HomePoint, width, ux: (b[0] - a[0]) / width, uy: (b[1] - a[1]) / width, centre }];
  });
}

/** Whether two doors could be one door: nearly parallel and about one
 * width, in two rooms. */
export function homeMapDoorsCouldMeet(x: HomeMapDoor, y: HomeMapDoor): boolean {
  if (sameHomeMapId(x.roomId, y.roomId)) return false;
  if (Math.abs(x.ux * y.uy - x.uy * y.ux) > Math.sin((HOME_MAP_DOOR_PARALLEL * Math.PI) / 180)) return false;
  return Math.abs(x.width - y.width) <= HOME_MAP_DOOR_WIDTH_GAP;
}

/** Whether two doors stand where they read as one, their rooms on either
 * side of them. */
export function homeMapDoorsMeet(x: HomeMapDoor, y: HomeMapDoor): boolean {
  if (!homeMapDoorsCouldMeet(x, y)) return false;
  const dx = y.mid[0] - x.mid[0];
  const dy = y.mid[1] - x.mid[1];
  if (Math.abs(dx * y.ux + dy * y.uy) > HOME_MAP_DOOR_ALONG) return false;
  if (Math.abs(dx * -y.uy + dy * y.ux) > HOME_MAP_DOOR_ACROSS) return false;
  const side = (p: HomePoint) => (p[0] - y.mid[0]) * -y.uy + (p[1] - y.mid[1]) * y.ux;
  return side(x.centre) * side(y.centre) < 0;
}

const doorKey = (roomId: string, index: number) => `${roomId.toUpperCase()}:${index}`;

/** Every door of a floor, and each one's nearest partner. */
export interface HomeMapDoorPairs {
  doors: HomeMapDoor[];
  /** The partner of a door, by `homeMapDoorPartner`. */
  partners: Map<string, HomeMapDoor>;
  /** How many doors have a partner. */
  met: number;
}

const pairMemo = new WeakMap<object, HomeMapDoorPairs>();

/** The doors of these rooms and who meets who. A floor's answer is kept for
 * that floor object, as the page asks for it on every draw. */
export function homeMapDoorPairs(floor: Pick<HomeMapFloor, "rooms">): HomeMapDoorPairs {
  const held = pairMemo.get(floor);
  if (held !== undefined) return held;
  const doors = floor.rooms.flatMap((room) => homeMapDoorsOf(room));
  const partners = new Map<string, HomeMapDoor>();
  for (const door of doors) {
    let best: HomeMapDoor | undefined;
    let bestD = Infinity;
    for (const other of doors) {
      if (!homeMapDoorsMeet(door, other)) continue;
      const d = Math.hypot(other.mid[0] - door.mid[0], other.mid[1] - door.mid[1]);
      if (d < bestD) {
        best = other;
        bestD = d;
      }
    }
    if (best !== undefined) partners.set(doorKey(door.roomId, door.index), best);
  }
  const pairs = { doors, partners, met: partners.size };
  pairMemo.set(floor, pairs);
  return pairs;
}

/** The door a room's opening meets, if any. */
export function homeMapDoorPartner(pairs: HomeMapDoorPairs, roomId: string, index: number): HomeMapDoor | undefined {
  return pairs.partners.get(doorKey(roomId, index));
}

/** The doors with no partner. */
export function homeMapOpenDoors(pairs: HomeMapDoorPairs): HomeMapDoor[] {
  return pairs.doors.filter((d) => homeMapDoorPartner(pairs, d.roomId, d.index) === undefined);
}

/** The doors a door with no partner could be connected to: every door of
 * another room with no partner, nearest first, or with none like that every
 * door of another room. A room can be turned to fit, so any way they run. */
export function homeMapDoorChoices(pairs: HomeMapDoorPairs, door: Pick<HomeMapDoor, "roomId" | "index" | "mid">): HomeMapDoor[] {
  const others = pairs.doors.filter((d) => !sameHomeMapId(d.roomId, door.roomId));
  const open = others.filter((d) => homeMapDoorPartner(pairs, d.roomId, d.index) === undefined);
  const list = open.length > 0 ? open : others;
  const far = (d: HomeMapDoor) => Math.hypot(d.mid[0] - door.mid[0], d.mid[1] - door.mid[1]);
  return [...list].sort((p, q) => far(p) - far(q));
}
