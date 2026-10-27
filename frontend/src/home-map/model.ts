// The home's map as the panel reads, draws and edits it, without any
// drawing: the document's types, the checks a save must pass, where things
// are on the plan, what each pin's entity is doing, and the edits the Home
// map page makes.
//
// The document is the contract of app repo docs/home_map_plan_2026-10.md
// ("Contract"), kept by the integration (`home_map_store.py`) and read by the
// iPhone and the watch too. Units are meters; the plan is seen from above, x
// to the right, y down the screen, z up. The checks here are the store's
// (`check_document`), so the page can say what is wrong before a save is
// refused; the store checks again and has the last word. The shared fixture
// (`tests/fixtures/home_map/basic.json`, a byte copy of the app's) pins the
// shape.
//
// Every edit is a plain value (`HomeMapEdit`) applied to a document
// (`applyHomeMapEdit`), so a save refused `conflict` can put the same edit
// on the map Home Assistant holds now and save again (`save.ts`).

/** A point on the plan: x, y. */
export type HomePoint = [number, number];

export interface HomeMapWall {
  a: HomePoint;
  b: HomePoint;
  /** Thickness. */
  t: number;
}

export type HomeMapOpeningKind = "door" | "window" | "opening";

export interface HomeMapOpening {
  kind: HomeMapOpeningKind;
  a: HomePoint;
  b: HomePoint;
  /** Bottom and top. */
  z0: number;
  z1: number;
}

export interface HomeMapObject {
  /** The RoomPlan category in lower camel case (`sofa`, `television`). A
   * kind nothing knows is drawn as a plain box. */
  kind: string;
  /** Its centre on the plan. */
  c: HomePoint;
  /** Width, depth, height. */
  size: [number, number, number];
  /** The turn around z, in degrees. */
  turn: number;
}

export interface HomeMapRoom {
  id: string;
  name?: string;
  /** The Home Assistant area it is. */
  areaId?: string;
  /** The page a tap on the room opens on the watch. */
  pageId?: string;
  outline: HomePoint[];
  height: number;
  walls: HomeMapWall[];
  openings: HomeMapOpening[];
  objects: HomeMapObject[];
}

export interface HomeMapPin {
  id: string;
  entityId: string;
  /** A room of the same floor. */
  roomId?: string;
  /** x, y, z. */
  at: [number, number, number];
}

export interface HomeMapFloor {
  id: string;
  name: string;
  story: number;
  rooms: HomeMapRoom[];
  pins: HomeMapPin[];
}

export interface HomeMapDocument {
  v: 1;
  floors: HomeMapFloor[];
}

/** What `home_map/get` answers: the map, null before the first save, and
 * its rev, 0 before the first save. */
export interface HomeMapRead {
  doc: HomeMapDocument | null;
  rev: number;
}

// ── the checks ───────────────────────────────────────────────────────────

export const HOME_MAP_VERSION = 1;
export const HOME_MAP_MAX_BYTES = 256 * 1024;
export const HOME_MAP_MAX_FLOORS = 8;
export const HOME_MAP_MAX_ROOMS = 40;
export const HOME_MAP_MAX_PINS = 400;
// Per room, as the store keeps them.
const MAX_OUTLINE_POINTS = 256;
const MAX_WALLS = 256;
const MAX_OPENINGS = 128;
const MAX_OBJECTS = 256;
export const HOME_MAP_MAX_NAME = 100;
const MAX_COORDINATE = 10_000;
const OPENING_KINDS: readonly HomeMapOpeningKind[] = ["door", "window", "opening"];

const UUID_RE = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
const ENTITY_ID_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const AREA_ID_RE = /^[A-Za-z0-9_-]{1,255}$/;
const OBJECT_KIND_RE = /^[a-z][A-Za-z0-9]{0,39}$/;

/** Whether a value is shaped like a UUID, in either case. */
export function isHomeMapId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Whether a value is shaped like an entity id, as the store reads one. */
export function isHomeMapEntityId(value: unknown): value is string {
  return typeof value === "string" && ENTITY_ID_RE.test(value);
}

/** Whether a value is shaped like a Home Assistant area id. */
export function isHomeMapAreaId(value: unknown): value is string {
  return typeof value === "string" && AREA_ID_RE.test(value);
}

/** Why a map cannot be saved: `invalid` with where it leaves the contract,
 * or `too_large`, in the store's own words. */
export type HomeMapCheck = { ok: true; doc: HomeMapDocument } | { ok: false; code: "invalid" | "too_large"; message: string };

class CheckError extends Error {
  constructor(readonly code: "invalid" | "too_large", message: string) {
    super(message);
  }
}

function fail(path: string, what: string): never {
  throw new CheckError("invalid", `${path} ${what}`);
}

type Raw = Record<string, unknown>;

function object(raw: unknown, path: string, required: readonly string[], optional: readonly string[] = []): Raw {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) fail(path, "must be an object");
  const o = raw as Raw;
  for (const key of required) if (!Object.hasOwn(o, key)) fail(`${path}.${key}`, "is missing");
  const known = new Set([...required, ...optional]);
  const unknown = Object.keys(o).filter((k) => !known.has(k)).sort();
  if (unknown.length > 0) fail(`${path}.${unknown[0]}`, "is not a key the home map has");
  return o;
}

function list(raw: unknown, path: string, most: number, least = 0): unknown[] {
  if (!Array.isArray(raw)) fail(path, "must be a list");
  if (raw.length > most) fail(path, `holds at most ${most}`);
  if (raw.length < least) fail(path, `needs at least ${least}`);
  return raw;
}

/** A number kept to 2 decimals (1 cm), minus zero as zero. */
export function homeMapRound(value: number): number {
  const out = Math.round(value * 100) / 100;
  return out === 0 ? 0 : out;
}

function number(raw: unknown, path: string, low = -MAX_COORDINATE, high = MAX_COORDINATE): number {
  if (typeof raw !== "number") fail(path, "must be a number");
  if (!Number.isFinite(raw)) fail(path, "must be a finite number");
  const value = homeMapRound(raw);
  if (value < low || value > high) fail(path, `must be between ${low} and ${high}`);
  return value;
}

function point<N extends 2 | 3>(raw: unknown, path: string, size: N): N extends 2 ? HomePoint : [number, number, number] {
  if (!Array.isArray(raw) || raw.length !== size) fail(path, `must be a list of ${size} numbers`);
  return raw.map((v, i) => number(v, `${path}[${i}]`)) as N extends 2 ? HomePoint : [number, number, number];
}

function text(raw: unknown, path: string): string {
  if (typeof raw !== "string") fail(path, "must be text");
  if (raw.length > HOME_MAP_MAX_NAME) fail(path, `is at most ${HOME_MAP_MAX_NAME} characters`);
  return raw;
}

function uuid(raw: unknown, path: string): string {
  if (!isHomeMapId(raw)) fail(path, "must be a UUID");
  return raw;
}

/** The floor, room and pin ids seen so far: unique across the document,
 * whatever their case. */
class Ids {
  private readonly seen = new Set<string>();

  take(raw: unknown, path: string): string {
    const value = uuid(raw, path);
    const folded = value.toUpperCase();
    if (this.seen.has(folded)) fail(path, `repeats the id ${value}`);
    this.seen.add(folded);
    return value;
  }
}

function checkRoom(raw: unknown, path: string, ids: Ids): HomeMapRoom {
  const room = object(raw, path, ["id", "outline", "height", "walls", "openings", "objects"], ["name", "areaId", "pageId"]);
  const out: Partial<HomeMapRoom> = { id: ids.take(room.id, `${path}.id`) };
  if (Object.hasOwn(room, "name")) out.name = text(room.name, `${path}.name`);
  if (Object.hasOwn(room, "areaId")) {
    if (!isHomeMapAreaId(room.areaId)) fail(`${path}.areaId`, "must be a Home Assistant area id");
    out.areaId = room.areaId;
  }
  if (Object.hasOwn(room, "pageId")) out.pageId = uuid(room.pageId, `${path}.pageId`);
  out.outline = list(room.outline, `${path}.outline`, MAX_OUTLINE_POINTS, 3).map((p, i) => point(p, `${path}.outline[${i}]`, 2));
  out.height = number(room.height, `${path}.height`, 0.01, 100);
  out.walls = list(room.walls, `${path}.walls`, MAX_WALLS).map((w, i) => {
    const where = `${path}.walls[${i}]`;
    const wall = object(w, where, ["a", "b", "t"]);
    return { a: point(wall.a, `${where}.a`, 2), b: point(wall.b, `${where}.b`, 2), t: number(wall.t, `${where}.t`, 0, 10) };
  });
  out.openings = list(room.openings, `${path}.openings`, MAX_OPENINGS).map((o, i) => {
    const where = `${path}.openings[${i}]`;
    const opening = object(o, where, ["kind", "a", "b", "z0", "z1"]);
    if (!OPENING_KINDS.includes(opening.kind as HomeMapOpeningKind)) fail(`${where}.kind`, "must be door, window or opening");
    const z0 = number(opening.z0, `${where}.z0`);
    const z1 = number(opening.z1, `${where}.z1`);
    if (z1 < z0) fail(`${where}.z1`, "must not be below z0");
    return { kind: opening.kind as HomeMapOpeningKind, a: point(opening.a, `${where}.a`, 2), b: point(opening.b, `${where}.b`, 2), z0, z1 };
  });
  out.objects = list(room.objects, `${path}.objects`, MAX_OBJECTS).map((o, i) => {
    const where = `${path}.objects[${i}]`;
    const item = object(o, where, ["kind", "c", "size", "turn"]);
    if (typeof item.kind !== "string" || !OBJECT_KIND_RE.test(item.kind)) fail(`${where}.kind`, "must be a RoomPlan category in lower camel case");
    if (!Array.isArray(item.size) || item.size.length !== 3) fail(`${where}.size`, "must be a list of 3 numbers");
    return {
      kind: item.kind,
      c: point(item.c, `${where}.c`, 2),
      size: item.size.map((v, j) => number(v, `${where}.size[${j}]`, 0, 1000)) as [number, number, number],
      turn: number(item.turn, `${where}.turn`),
    };
  });
  return out as HomeMapRoom;
}

function checkPin(raw: unknown, path: string, ids: Ids, roomIds: ReadonlySet<string>): HomeMapPin {
  const pin = object(raw, path, ["id", "entityId", "at"], ["roomId"]);
  const out: Partial<HomeMapPin> = { id: ids.take(pin.id, `${path}.id`) };
  if (!isHomeMapEntityId(pin.entityId)) fail(`${path}.entityId`, "must be an entity id, like light.reading_lamp");
  out.entityId = pin.entityId;
  if (Object.hasOwn(pin, "roomId")) {
    const roomId = uuid(pin.roomId, `${path}.roomId`);
    if (!roomIds.has(roomId)) fail(`${path}.roomId`, "names no room of this floor");
    out.roomId = roomId;
  }
  out.at = point(pin.at, `${path}.at`, 3);
  return out as HomeMapPin;
}

/** The size of a map as stored and sent: compact JSON in UTF-8. */
export function homeMapBytes(doc: unknown): number {
  return new TextEncoder().encode(JSON.stringify(doc)).length;
}

/**
 * The map as the store would keep it: `raw` checked against the contract,
 * its numbers rounded to 2 decimals and its keys in the contract's order,
 * as a new object. Refused `invalid` (the message says where, in the store's
 * words) or `too_large`.
 */
export function checkHomeMap(raw: unknown): HomeMapCheck {
  try {
    const doc = object(raw, "doc", ["v", "floors"]);
    if (doc.v !== HOME_MAP_VERSION) fail("doc.v", `must be ${HOME_MAP_VERSION}`);
    const ids = new Ids();
    let rooms = 0;
    let pins = 0;
    const floors = list(doc.floors, "doc.floors", HOME_MAP_MAX_FLOORS).map((f, i): HomeMapFloor => {
      const path = `doc.floors[${i}]`;
      const floor = object(f, path, ["id", "name", "story", "rooms", "pins"]);
      const id = ids.take(floor.id, `${path}.id`);
      const name = text(floor.name, `${path}.name`);
      const story = floor.story;
      if (typeof story !== "number" || !Number.isInteger(story) || story < -100 || story > 100) {
        fail(`${path}.story`, "must be a whole number between -100 and 100");
      }
      const rawRooms = list(floor.rooms, `${path}.rooms`, HOME_MAP_MAX_ROOMS);
      rooms += rawRooms.length;
      if (rooms > HOME_MAP_MAX_ROOMS) throw new CheckError("invalid", `the home map holds at most ${HOME_MAP_MAX_ROOMS} rooms`);
      const checkedRooms = rawRooms.map((r, j) => checkRoom(r, `${path}.rooms[${j}]`, ids));
      const rawPins = list(floor.pins, `${path}.pins`, HOME_MAP_MAX_PINS);
      pins += rawPins.length;
      if (pins > HOME_MAP_MAX_PINS) throw new CheckError("invalid", `the home map holds at most ${HOME_MAP_MAX_PINS} pins`);
      const roomIds = new Set(checkedRooms.map((r) => r.id));
      const checkedPins = rawPins.map((p, j) => checkPin(p, `${path}.pins[${j}]`, ids, roomIds));
      return { id, name, story, rooms: checkedRooms, pins: checkedPins };
    });
    const checked: HomeMapDocument = { v: HOME_MAP_VERSION, floors };
    const size = homeMapBytes(checked);
    if (size > HOME_MAP_MAX_BYTES) {
      throw new CheckError("too_large", `a home map is at most ${HOME_MAP_MAX_BYTES / 1024} KiB; this one is ${Math.ceil(size / 1024)} KiB`);
    }
    return { ok: true, doc: checked };
  } catch (err) {
    if (err instanceof CheckError) return { ok: false, code: err.code, message: err.message };
    throw err;
  }
}

/** The map when `raw` is one the store would keep, else undefined: how a
 * read is taken in, so a damaged reply draws nothing rather than throwing. */
export function readHomeMap(raw: unknown): HomeMapDocument | undefined {
  const checked = checkHomeMap(raw);
  return checked.ok ? checked.doc : undefined;
}

// ── finding things ───────────────────────────────────────────────────────

/** Ids compared as the store compares them: whatever their case. */
export function sameHomeMapId(a: string | undefined, b: string | undefined): boolean {
  return a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase();
}

/** The floors that have at least one room, in the map's order: the ones a
 * Home map tile can show. */
export function homeMapFloorsWithRooms(doc: HomeMapDocument | null | undefined): HomeMapFloor[] {
  return (doc?.floors ?? []).filter((f) => f.rooms.length > 0);
}

export function homeMapFloor(doc: HomeMapDocument | null | undefined, floorId: string | undefined): HomeMapFloor | undefined {
  return doc?.floors.find((f) => sameHomeMapId(f.id, floorId));
}

/** A floor's name, or "Floor N" (its story, the ground floor 1) for one
 * with a blank name. */
export function homeMapFloorName(floor: Pick<HomeMapFloor, "name" | "story">): string {
  const name = floor.name.trim();
  return name !== "" ? name : `Floor ${floor.story + 1}`;
}

/** A room's name, or "Room" for one with none. */
export function homeMapRoomName(room: Pick<HomeMapRoom, "name">): string {
  const name = room.name?.trim() ?? "";
  return name !== "" ? name : "Room";
}

/** The plan's box: every outline, wall and pin of the floor. */
export interface HomeMapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function homeMapBounds(floor: HomeMapFloor): HomeMapBounds {
  const xs: number[] = [];
  const ys: number[] = [];
  const add = (p: readonly number[]) => {
    xs.push(p[0]!);
    ys.push(p[1]!);
  };
  for (const room of floor.rooms) {
    room.outline.forEach(add);
    for (const w of room.walls) {
      add(w.a);
      add(w.b);
    }
  }
  for (const pin of floor.pins) add(pin.at);
  if (xs.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/** The middle of a room: its outline's centroid, or the mean of its corners
 * for an outline with no area. */
export function homeMapRoomCenter(room: Pick<HomeMapRoom, "outline">): HomePoint {
  const pts = room.outline;
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[(i + 1) % pts.length]!;
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (Math.abs(area) < 1e-9) {
    const n = Math.max(1, pts.length);
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * area), cy / (3 * area)];
}

/** Whether a point is inside a room's outline. */
export function homeMapRoomHolds(room: Pick<HomeMapRoom, "outline">, at: readonly number[]): boolean {
  const [x, y] = at as [number, number];
  const pts = room.outline;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 1) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** The room of the floor a point is in, the first one when rooms overlap. */
export function homeMapRoomAt(floor: HomeMapFloor, at: readonly number[]): HomeMapRoom | undefined {
  return floor.rooms.find((r) => homeMapRoomHolds(r, at));
}

/** The room a pin belongs to: the one it names, else the one it stands in. */
export function homeMapPinRoom(floor: HomeMapFloor, pin: HomeMapPin): HomeMapRoom | undefined {
  if (pin.roomId !== undefined) {
    const named = floor.rooms.find((r) => sameHomeMapId(r.id, pin.roomId));
    if (named !== undefined) return named;
  }
  return homeMapRoomAt(floor, pin.at);
}

/** The floor that holds a pin, or a room, by id. */
export function homeMapFloorOf(doc: HomeMapDocument, id: string): HomeMapFloor | undefined {
  return doc.floors.find((f) => f.pins.some((p) => sameHomeMapId(p.id, id)) || f.rooms.some((r) => sameHomeMapId(r.id, id)));
}

// ── what each pin is doing ───────────────────────────────────────────────

/** The states the map reads: Home Assistant's, by entity id. */
export type HomeMapStates = Readonly<Record<string, { state?: unknown; attributes?: Readonly<Record<string, unknown>> } | undefined>>;

/**
 * How a pin draws (plan, "Drawing"): a light that is on is lit, with its
 * brightness from 0 to 1 when Home Assistant gives one; a lock locked or not;
 * every other kind on or off in its own colour; an entity the home no longer
 * has is gone, and drawn gray.
 */
export type HomeMapPinLook =
  | { kind: "light"; on: true; brightness: number | undefined }
  | { kind: "light"; on: false }
  | { kind: "lock"; locked: boolean }
  | { kind: "other"; on: boolean }
  | { kind: "gone" };

const OFF_STATES: ReadonlySet<string> = new Set(["off", "closed", "idle", "standby", "paused", "unavailable", "unknown", "not_home", "docked", "disarmed", "locked"]);

export function homeMapPinLook(entityId: string, states: HomeMapStates | undefined): HomeMapPinLook {
  const entity = states === undefined || !Object.hasOwn(states, entityId) ? undefined : states[entityId];
  if (entity === undefined) return { kind: "gone" };
  const state = String(entity.state ?? "").toLowerCase();
  const domain = entityId.slice(0, entityId.indexOf("."));
  if (domain === "light") {
    if (state !== "on") return { kind: "light", on: false };
    const raw = entity.attributes?.brightness;
    const brightness = typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.min(1, raw / 255)) : undefined;
    return { kind: "light", on: true, brightness };
  }
  if (domain === "lock") return { kind: "lock", locked: state === "locked" };
  return { kind: "other", on: state !== "" && !OFF_STATES.has(state) };
}

/** Whether a pin is a light that is on. */
function lit(pin: HomeMapPin, states: HomeMapStates | undefined): boolean {
  const look = homeMapPinLook(pin.entityId, states);
  return look.kind === "light" && look.on;
}

/** The rooms of the floor with a light on, by id. */
export function homeMapLitRooms(floor: HomeMapFloor, states: HomeMapStates | undefined): Set<string> {
  const out = new Set<string>();
  for (const pin of floor.pins) {
    if (!lit(pin, states)) continue;
    const room = homeMapPinRoom(floor, pin);
    if (room !== undefined) out.add(room.id);
  }
  return out;
}

/** How many lights on the floor are on, each light once however many pins
 * it has. */
export function homeMapLightsOn(floor: HomeMapFloor, states: HomeMapStates | undefined): number {
  return new Set(floor.pins.filter((p) => lit(p, states)).map((p) => p.entityId)).size;
}

/** "No lights on", "1 light on", "3 lights on". */
export function homeMapLightsOnWords(n: number): string {
  return n === 0 ? "No lights on" : n === 1 ? "1 light on" : `${n} lights on`;
}

// ── edits ────────────────────────────────────────────────────────────────

/** One change the Home map page makes. Pins and rooms are named by their
 * ids alone, which are unique across the whole map. */
export type HomeMapEdit =
  | { kind: "movePin"; pinId: string; at: HomePoint }
  | { kind: "addPin"; floorId: string; pin: HomeMapPin }
  | { kind: "removePin"; pinId: string }
  | { kind: "renameRoom"; roomId: string; name: string }
  | { kind: "setRoomArea"; roomId: string; areaId: string | undefined }
  | { kind: "setRoomPage"; roomId: string; pageId: string | undefined }
  | { kind: "deleteRoom"; roomId: string };

/** A room with its keys in the contract's order, the optional ones only
 * when set. */
function orderedRoom(room: HomeMapRoom): HomeMapRoom {
  const out: HomeMapRoom = { id: room.id } as HomeMapRoom;
  if (room.name !== undefined) out.name = room.name;
  if (room.areaId !== undefined) out.areaId = room.areaId;
  if (room.pageId !== undefined) out.pageId = room.pageId;
  out.outline = room.outline;
  out.height = room.height;
  out.walls = room.walls;
  out.openings = room.openings;
  out.objects = room.objects;
  return out;
}

function orderedPin(pin: HomeMapPin): HomeMapPin {
  const out = { id: pin.id, entityId: pin.entityId } as HomeMapPin;
  if (pin.roomId !== undefined) out.roomId = pin.roomId;
  out.at = pin.at;
  return out;
}

/** The pin with its room set to the one it now stands in, or none. */
function placed(floor: HomeMapFloor, pin: HomeMapPin): HomeMapPin {
  const room = homeMapRoomAt(floor, pin.at);
  const { roomId: _old, ...rest } = pin;
  return orderedPin(room === undefined ? rest : { ...rest, roomId: room.id });
}

function withFloor(doc: HomeMapDocument, index: number, floor: HomeMapFloor): HomeMapDocument {
  const floors = doc.floors.slice();
  floors[index] = floor;
  return { ...doc, floors };
}

function editRoom(doc: HomeMapDocument, roomId: string, change: (room: HomeMapRoom) => HomeMapRoom): HomeMapDocument | undefined {
  for (const [i, floor] of doc.floors.entries()) {
    const at = floor.rooms.findIndex((r) => sameHomeMapId(r.id, roomId));
    if (at < 0) continue;
    const rooms = floor.rooms.slice();
    rooms[at] = orderedRoom(change(floor.rooms[at]!));
    return withFloor(doc, i, { ...floor, rooms });
  }
  return undefined;
}

function editPin(doc: HomeMapDocument, pinId: string, change: (pin: HomeMapPin, floor: HomeMapFloor) => HomeMapPin | undefined): HomeMapDocument | undefined {
  for (const [i, floor] of doc.floors.entries()) {
    const at = floor.pins.findIndex((p) => sameHomeMapId(p.id, pinId));
    if (at < 0) continue;
    const next = change(floor.pins[at]!, floor);
    const pins = floor.pins.slice();
    if (next === undefined) pins.splice(at, 1);
    else pins[at] = next;
    return withFloor(doc, i, { ...floor, pins });
  }
  return undefined;
}

/** A name as a room keeps it: trimmed, at most 100 characters, and none
 * when blank. */
function roomNameOf(name: string): string | undefined {
  const trimmed = name.trim().slice(0, HOME_MAP_MAX_NAME);
  return trimmed === "" ? undefined : trimmed;
}

/**
 * The map with one edit made, as a new document in which only the path to
 * what changed is new; undefined when the edit no longer fits the map (its
 * pin or room is gone, a new pin's id is taken, a value the store would
 * refuse). That is how a save refused `conflict` learns that the edit
 * cannot go on top of the map Home Assistant holds now.
 *
 * - `movePin`: to a new x and y (its height stays), rounded to 1 cm, and
 *   into the room it now stands in (none outside every room).
 * - `addPin`: at the end of its floor's pins, in the room it stands in.
 * - `removePin`.
 * - `renameRoom`: trimmed; a blank name removes it.
 * - `setRoomArea`, `setRoomPage`: undefined removes it.
 * - `deleteRoom`: the room goes; its pins stay where they are, in no room.
 */
export function applyHomeMapEdit(doc: HomeMapDocument, edit: HomeMapEdit): HomeMapDocument | undefined {
  switch (edit.kind) {
    case "movePin": {
      const [x, y] = edit.at;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
      return editPin(doc, edit.pinId, (pin, floor) => placed(floor, { ...pin, at: [homeMapRound(x), homeMapRound(y), pin.at[2]] }));
    }
    case "addPin": {
      const index = doc.floors.findIndex((f) => sameHomeMapId(f.id, edit.floorId));
      const pin = edit.pin;
      if (index < 0 || !isHomeMapId(pin.id) || !isHomeMapEntityId(pin.entityId)) return undefined;
      if (homeMapFloorOf(doc, pin.id) !== undefined || doc.floors.some((f) => sameHomeMapId(f.id, pin.id))) return undefined;
      const floor = doc.floors[index]!;
      const at: [number, number, number] = [homeMapRound(pin.at[0]), homeMapRound(pin.at[1]), homeMapRound(pin.at[2])];
      return withFloor(doc, index, { ...floor, pins: [...floor.pins, placed(floor, { ...pin, at })] });
    }
    case "removePin":
      return editPin(doc, edit.pinId, () => undefined);
    case "renameRoom":
      return editRoom(doc, edit.roomId, (room) => {
        const { name: _old, ...rest } = room;
        const name = roomNameOf(edit.name);
        return name === undefined ? rest : { ...rest, name };
      });
    case "setRoomArea":
      if (edit.areaId !== undefined && !isHomeMapAreaId(edit.areaId)) return undefined;
      return editRoom(doc, edit.roomId, (room) => {
        const { areaId: _old, ...rest } = room;
        return edit.areaId === undefined ? rest : { ...rest, areaId: edit.areaId };
      });
    case "setRoomPage":
      if (edit.pageId !== undefined && !isHomeMapId(edit.pageId)) return undefined;
      return editRoom(doc, edit.roomId, (room) => {
        const { pageId: _old, ...rest } = room;
        return edit.pageId === undefined ? rest : { ...rest, pageId: edit.pageId };
      });
    case "deleteRoom":
      for (const [i, floor] of doc.floors.entries()) {
        const room = floor.rooms.find((r) => sameHomeMapId(r.id, edit.roomId));
        if (room === undefined) continue;
        const pins = floor.pins.map((p) => {
          if (!sameHomeMapId(p.roomId, room.id)) return p;
          const { roomId: _gone, ...rest } = p;
          return orderedPin(rest);
        });
        return withFloor(doc, i, { ...floor, rooms: floor.rooms.filter((r) => r !== room), pins });
      }
      return undefined;
  }
}

/** The height a new pin starts at, by its kind (plan, "Place devices"): a
 * lamp's 1.5 m for a light (the panel cannot tell a ceiling light from a
 * lamp), 1.0 m for a lock, 1.2 m for any other kind. */
export function homeMapPinHeight(entityId: string): number {
  const domain = entityId.slice(0, entityId.indexOf("."));
  return domain === "light" ? 1.5 : domain === "lock" ? 1.0 : 1.2;
}

/** A new pin for an entity: in the middle of `room` when one is given,
 * else of the floor, at its kind's height, with an upper case id as the
 * phone writes them. */
export function newHomeMapPin(floor: HomeMapFloor, entityId: string, room: HomeMapRoom | undefined, newId: () => string): HomeMapPin {
  let x: number;
  let y: number;
  if (room !== undefined) [x, y] = homeMapRoomCenter(room);
  else {
    const b = homeMapBounds(floor);
    [x, y] = [(b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2];
  }
  return { id: newId().toUpperCase(), entityId, at: [homeMapRound(x), homeMapRound(y), homeMapPinHeight(entityId)] };
}

/** How many pins stand in a room by its id, for the words before a delete. */
export function homeMapRoomPinCount(floor: HomeMapFloor, roomId: string): number {
  return floor.pins.filter((p) => sameHomeMapId(homeMapPinRoom(floor, p)?.id, roomId)).length;
}

// ── the page's words ─────────────────────────────────────────────────────

/** The home's areas by name, for a room's Area menu. */
export function homeMapAreaChoices(hass: { areas?: Readonly<Record<string, { name?: string | null } | undefined>> } | undefined): { id: string; name: string }[] {
  return Object.entries(hass?.areas ?? {})
    .map(([id, a]) => ({ id, name: typeof a?.name === "string" && a.name.trim() !== "" ? a.name.trim() : id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** A pin's name: its entity's friendly name, else its id. */
export function homeMapPinName(pin: Pick<HomeMapPin, "entityId">, hass: { states?: HomeMapStates } | undefined): string {
  const friendly = hass?.states?.[pin.entityId]?.attributes?.friendly_name;
  return typeof friendly === "string" && friendly.trim() !== "" ? friendly.trim() : pin.entityId;
}

/** The words before a room is deleted. */
export function homeMapDeleteRoomQuestion(room: Pick<HomeMapRoom, "name">, pins: number): string {
  const name = homeMapRoomName(room);
  if (pins === 0) return `Delete ${name} from the map? Scan it again on the iPhone to bring it back.`;
  return `Delete ${name} from the map? ${pins === 1 ? "Its pin stays" : `Its ${pins} pins stay`} on the plan, in no room. Scan it again on the iPhone to bring it back.`;
}
