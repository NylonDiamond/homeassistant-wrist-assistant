// The room rules the Rooms editor shares with the app, read from
// `room-rules.json`, which the app's `RoomRulesTableTests` writes from its
// Swift code (`RoomConfig`, the phone's Rooms screen and its point control
// editor). The functions here are ports of those, checked case by case
// against the table's cases in `test/watch-rooms.test.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md, "4d batch 5", 5b.

import rulesJson from "./room-rules.json";

export type RoomTrigger = "Automatic" | "Double-Tap Top" | "Double Pinch";

export interface RoomRules {
  version: number;
  keys: {
    sensor: string;
    fallback: string;
    mappings: string;
    autoSwitch: string;
    legacyQuickJump: string;
    zones: string;
    topSectionDoubleTap: string;
    handGesture: string;
    tapToToggle: string;
    liveTile: string;
  };
  normalize: { rule: string; cases: { input: string; key: string }[] };
  roomValue: { notRoom: string[]; rule: string; source: string; attribute: string; cases: { input: string; room: boolean }[] };
  switching: {
    keys: string[];
    triggers: { value: RoomTrigger; label: string; help: string }[];
    absent: Record<string, string>;
    rule: string;
    cases: { op: { switch?: boolean; trigger?: RoomTrigger; clearSensor?: boolean }; before: Record<string, unknown>; after: Record<string, unknown> }[];
    readCases: { document: Record<string, unknown>; on: boolean; trigger: RoomTrigger }[];
  };
  fallback: { stay: string; firstAvailable: null; watchFallbackNames: string[]; rule: string };
  mappings: { rule: string };
  pointControl: {
    domains: { domain: string; label: string }[];
    heading: { min: number; max: number; rule: string };
    newTarget: string;
    switches: { key: string; label: string; onDetail: string; offDetail: string; absent: boolean }[];
  };
  zones: {
    cleanCases: { input: Record<string, PointZone[]>; output: Record<string, PointZone[]> | null }[];
    encodeCases: { rooms: Record<string, PointZone[]>; parsed: unknown; slashEscaped: boolean }[];
    decodeCases: { json: string; rooms: Record<string, PointZone[]> }[];
  };
}

export const ROOM_RULES = rulesJson as unknown as RoomRules;
export const ROOM_KEYS = ROOM_RULES.keys;

/** `roomQuickJumpFallbackPageId` for "Stay on current page". */
export const STAY_ON_CURRENT_PAGE = ROOM_RULES.fallback.stay;

/** `handGestureAction` for Room Jump, and the one the phone puts back. */
export const HAND_GESTURE_ROOM_JUMP = "Room Jump";
export const HAND_GESTURE_REFRESH = ROOM_RULES.switching.absent.handGestureAction ?? "Refresh";
/** `topSectionDoubleTapAction` for Room Jump, and the one the phone puts back. */
export const DOUBLE_TAP_ROOM_JUMP = "Room Jump";
export const DOUBLE_TAP_DISABLED = "Disabled";

/** The domains a point control target can be in, as the phone offers them. */
export const POINT_CONTROL_DOMAINS: readonly string[] = ROOM_RULES.pointControl.domains.map((d) => d.domain);

/**
 * A room name as the watch matches it (`RoomConfig.normalizedRoomKey`): lower
 * case, `_` and `-` as spaces, anything but `a-z`, `0-9` and space as a
 * space, runs of spaces as one, none at either end.
 */
export function normalizedRoomKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter((part) => part !== "")
    .join(" ");
}

/** What Swift's `Double(String)` reads as a number, lower case: decimals with
 * an exponent, hex floats, nan and inf. */
const SWIFT_DOUBLE = /^[+-]?(?:nan|inf|infinity|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|0x(?:[0-9a-f]+\.?[0-9a-f]*|\.[0-9a-f]+)(?:p[+-]?\d+)?)$/;

const NOT_ROOM = new Set(ROOM_RULES.roomValue.notRoom);

/**
 * Whether a sensor state can be a room (`RoomConfig.isPotentialRoomValue`):
 * not empty once trimmed, not one of the table's `notRoom` values, not a
 * number, and with a letter in it.
 */
export function isRoomValue(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return false;
  const lowered = trimmed.toLowerCase();
  if (NOT_ROOM.has(lowered)) return false;
  if (SWIFT_DOUBLE.test(lowered)) return false;
  return /[\p{L}\p{M}]/u.test(lowered);
}

/** The part of the state a room is read from, as the watch reads its room
 * sensor: a person's state only; any other entity's state, or else its
 * `location_name` attribute. Undefined when neither is a room. */
export function roomFromState(entityId: string, state: { state?: unknown; attributes?: Record<string, unknown> } | undefined): string | undefined {
  if (state === undefined) return undefined;
  const value = typeof state.state === "string" ? state.state.trim() : "";
  if (entityId.startsWith("person.")) return isRoomValue(value) ? value : undefined;
  if (isRoomValue(value)) return value;
  const located = state.attributes?.[ROOM_RULES.roomValue.attribute];
  if (typeof located === "string" && isRoomValue(located)) return located.trim();
  return undefined;
}

// ── point control rooms ──────────────────────────────────────────────────

/** One point control target (`PointZone`). */
export interface PointZone {
  entityId: string;
  /** Degrees clockwise from north. */
  centerHeading: number;
  label?: string;
}

/** The rooms in stored order, each with its targets. */
export type PointRooms = [string, PointZone[]][];

/** How a stored `pointControlRoomMappingsJSON` reads. `ok: false` is a string
 * that does not decode, which the phone and the watch both read as no rooms
 * at all. */
export type ZonesRead = { ok: true; rooms: PointRooms } | { ok: false };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** One target as Swift's decoder takes it: `entityId` a string,
 * `centerHeading` a number, `label` a string, null or absent. Other keys are
 * dropped, as a phone save drops them. */
function readZone(value: unknown): PointZone | undefined {
  if (!isObject(value)) return undefined;
  const { entityId, centerHeading, label } = value;
  if (typeof entityId !== "string" || typeof centerHeading !== "number" || !Number.isFinite(centerHeading)) return undefined;
  if (label !== undefined && label !== null && typeof label !== "string") return undefined;
  return typeof label === "string" ? { entityId, centerHeading, label } : { entityId, centerHeading };
}

/** The rooms in a stored string. Absent or empty is no rooms; anything that
 * does not decode whole is `ok: false`. */
export function decodeZones(raw: unknown): ZonesRead {
  if (raw === undefined || raw === null || raw === "") return { ok: true, rooms: [] };
  if (typeof raw !== "string") return { ok: false };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false };
  }
  if (!isObject(parsed)) return { ok: false };
  const rooms: PointRooms = [];
  for (const [key, list] of Object.entries(parsed)) {
    if (!Array.isArray(list)) return { ok: false };
    const zones: PointZone[] = [];
    for (const item of list) {
      const zone = readZone(item);
      if (zone === undefined) return { ok: false };
      zones.push(zone);
    }
    rooms.push([key, zones]);
  }
  return { ok: true, rooms };
}

/**
 * The rooms as the phone saves them (`RoomConfig.cleanedPointMappings`): a
 * room whose targets all lack an entity is dropped, a room with no targets
 * is kept. Undefined when no room has a target left: the phone then saves
 * no key at all.
 */
export function cleanZones(rooms: PointRooms): PointRooms | undefined {
  const cleaned = rooms.filter(([, zones]) => zones.length === 0 || zones.some((z) => z.entityId.trim() !== ""));
  if (cleaned.length === 0 || cleaned.every(([, zones]) => zones.length === 0)) return undefined;
  return cleaned;
}

/** The string for some rooms: plain JSON in the rooms' order, each target's
 * keys in Swift's declaration order, and `/` written `\/` as the phone's
 * encoder writes it. */
export function encodeZones(rooms: PointRooms): string {
  const out: Record<string, PointZone[]> = {};
  for (const [key, zones] of rooms) {
    out[key] = zones.map((z) => (z.label === undefined ? { entityId: z.entityId, centerHeading: z.centerHeading } : { entityId: z.entityId, centerHeading: z.centerHeading, label: z.label }));
  }
  return JSON.stringify(out).replace(/\//g, "\\/");
}

/** Whether two sets of rooms say the same: the same rooms, each with the same
 * targets in the same order. The rooms' order does not count, as the
 * phone's own encoder keeps none. */
export function sameZones(a: PointRooms, b: PointRooms): boolean {
  if (a.length !== b.length) return false;
  const byKey = new Map(b);
  if (byKey.size !== b.length) return false;
  return a.every(([key, zones]) => {
    const other = byKey.get(key);
    return other !== undefined && other.length === zones.length
      && zones.every((z, i) => z.entityId === other[i]!.entityId && z.centerHeading === other[i]!.centerHeading && z.label === other[i]!.label);
  });
}

/** A heading as the panel writes one: a whole degree from 0 to 359, going
 * round past either end. */
export function wrapHeading(degrees: number): number {
  if (!Number.isFinite(degrees)) return 0;
  return ((Math.round(degrees) % 360) + 360) % 360;
}

/** The compass point a heading is nearest, as the phone labels one. */
export function compassPoint(heading: number): string {
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return points[Math.floor((((heading + 22.5) % 360) + 360) % 360 / 45) % 8]!;
}

/** "light.tv_backlight" as "Tv Backlight", the phone's name for a new
 * target's label. */
export function friendlyNameFromId(entityId: string): string {
  const dot = entityId.indexOf(".");
  if (dot < 0) return entityId;
  return entityId.slice(dot + 1).split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** A normalized room name as words with capitals, for a room no area names. */
export function roomDisplayName(key: string): string {
  return key.split(" ").filter((w) => w !== "").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
