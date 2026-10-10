// The Rooms editor's thinking, without its drawing.
//
// The room settings of a watch are keys of its `behavior` record, the app's
// `BehaviorPreferences`: the room sensor, the page per room, how and when
// pages switch, the fallback page, the point control targets per room (one
// JSON string) and two point control switches. The Watch settings page
// leaves them out; this editor writes them, the way the phone's Rooms screen
// does (`rules.ts`, `room-rules.json`).
//
// The rules of the Watch settings page hold here too:
//
// - An edit is a key write: a value, or the key removed (`undefined`). The
//   saved document is the loaded one with only those keys changed, so a load
//   and a save with no edit send the very document that was read, and every
//   key this editor does not know goes back as it came.
// - Nothing is ever written as null: what the phone stores as nil is a key
//   left out.
// - An edit that puts a key back to what the document holds is no edit, so
//   the editor stops being dirty when a change is undone by hand.
//
// On a conflict the save reads the newer copy and lays the same key writes
// over it, key by key, as the Watch settings page does for the
// notification style.
//
// A home that is not the watch's main house (`main_house: false` on the
// owner row) keeps its rooms in a `rooms` record of their own instead: the
// six room keys under their `behavior` names and a `schemaVersion`. The four
// keys that stay with the main house's settings (Double-Tap Top, Double
// Pinch and the two point control switches) are neither shown nor written
// there, and the editor can start that record itself. An iPhone keeps its
// rooms the same way, on every home: its `behavior` record holds only the
// phone's own settings, so its room keys live in `rooms`.
//
// Plans: app repo docs/pages_in_home_assistant_step4.md, "4d batch 5", 5b,
// and docs/phone_watch_link_removal_2026-10.md, "Step 8 build contract".

import type { OwnerSummary, WatchConfigRecord } from "../ha-api.js";
import { type WatchPagesDocument, WATCH_CONFIG_LIMIT_BYTES, isHiddenWatchPage, isSystemWatchPage, watchPageId, watchPageName, watchPagesOf } from "../watch-pages/model.js";
import { NOT_FOR_IPHONE_TEXT, watchCommandError } from "../watch-pages/save-note.js";
import { WAIT_FOR_IPHONE_TEXT, takesSettingsFromAnotherHome } from "../watch-settings.js";
import {
  type PointRooms,
  type PointZone,
  type RoomTrigger,
  type ZonesRead,
  DOUBLE_TAP_DISABLED,
  DOUBLE_TAP_ROOM_JUMP,
  HAND_GESTURE_REFRESH,
  HAND_GESTURE_ROOM_JUMP,
  ROOM_KEYS,
  ROOM_RULES,
  STAY_ON_CURRENT_PAGE,
  cleanZones,
  decodeZones,
  encodeZones,
  isRoomValue,
  normalizedRoomKey,
  roomDisplayName,
  sameZones,
} from "./rules.js";

export type BehaviorDocument = Record<string, unknown>;

/** Key writes over the loaded document: a value, or `undefined` for the key
 * removed. */
export type RoomEdits = ReadonlyMap<string, unknown>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Two JSON values say the same thing. Object key order does not count. */
export function jsonEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => jsonEqual(x, b[i]));
  }
  if (isObject(a) && isObject(b)) {
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    return ka.every((k) => Object.hasOwn(b, k) && jsonEqual(a[k], b[k]));
  }
  return false;
}

/** The point control switches' values when absent: a switch turned back to
 * that on a document without the key is no edit. */
const ABSENT_SWITCHES: ReadonlyMap<string, boolean> = new Map(ROOM_RULES.pointControl.switches.map((s) => [s.key, s.absent]));

/** Whether a write leaves the key as `document` holds it. */
function writeIsNoOp(document: BehaviorDocument, key: string, value: unknown): boolean {
  if (!Object.hasOwn(document, key)) return value === undefined || (ABSENT_SWITCHES.has(key) && ABSENT_SWITCHES.get(key) === value);
  return value !== undefined && jsonEqual(document[key], value);
}

/** The document with the edits laid over it: a new object, the loaded one
 * untouched. No edit gives an equal copy. */
export function applyRoomEdits(document: BehaviorDocument, edits: RoomEdits): BehaviorDocument {
  const out: BehaviorDocument = structuredClone(document);
  for (const [key, value] of edits) {
    if (value === undefined) delete out[key];
    else out[key] = structuredClone(value);
  }
  return out;
}

/** The edits after more key writes, each judged against the loaded
 * document: a write back to what it holds drops the key's edit. */
export function withRoomWrites(document: BehaviorDocument, edits: RoomEdits, writes: RoomEdits): Map<string, unknown> {
  const next = new Map(edits);
  for (const [key, value] of writes) {
    if (writeIsNoOp(document, key, value)) next.delete(key);
    else next.set(key, value);
  }
  return next;
}

/** The keys whose edit changes the document. Empty means nothing to save. */
export function roomDirtyKeys(document: BehaviorDocument | undefined, edits: RoomEdits): string[] {
  if (document === undefined) return [];
  return [...edits.entries()].filter(([key, value]) => !writeIsNoOp(document, key, value)).map(([key]) => key);
}

/** One room record merged three ways: the newer copy, with each room the
 * edit changed since `before` set or removed as the edit has it. */
function mergeRooms<T>(before: ReadonlyMap<string, T>, mine: ReadonlyMap<string, T>, theirs: ReadonlyMap<string, T>): Map<string, T> {
  const out = new Map(theirs);
  for (const key of new Set([...before.keys(), ...mine.keys()])) {
    const was = before.get(key);
    const now = mine.get(key);
    if (jsonEqual(was, now)) continue;
    if (now === undefined) out.delete(key);
    else out.set(key, now);
  }
  return out;
}

function stringRecord(value: unknown): Map<string, unknown> {
  return new Map(isObject(value) ? Object.entries(value) : []);
}

/**
 * The edits made over `before`, carried onto `after`, a newer copy of the
 * same record (a conflict on save, or a save from elsewhere coming in under
 * open edits). A key the newer copy left as it was keeps its edit. A key
 * both sides changed keeps the edit too, as a merge by key does, with two
 * exceptions that would otherwise throw away what was done elsewhere:
 *
 * - The page per room and the point control rooms are one value each, so
 *   they merge room by room: rooms the edit did not touch come from the
 *   newer copy. A rooms string that does not decode keeps the edit whole.
 * - A gesture write that only turned Room Jump off yields to the newer
 *   copy when that has moved the gesture off Room Jump itself (the Watch
 *   settings page picked another action).
 */
export function carryRoomEdits(before: BehaviorDocument, after: BehaviorDocument, edits: RoomEdits): Map<string, unknown> {
  const out = new Map(edits);
  for (const [key, value] of edits) {
    if (jsonEqual(before[key], after[key])) continue;
    if (key === ROOM_KEYS.mappings) {
      const merged = mergeRooms(stringRecord(before[key]), stringRecord(value), stringRecord(after[key]));
      out.set(key, merged.size === 0 ? undefined : Object.fromEntries(merged));
    } else if (key === ROOM_KEYS.zones) {
      const was = decodeZones(before[key]);
      const now = decodeZones(value);
      const theirs = decodeZones(after[key]);
      if (!was.ok || !now.ok || !theirs.ok) continue;
      const merged = cleanZones([...mergeRooms(new Map(was.rooms), new Map(now.rooms), new Map(theirs.rooms))]);
      if (merged === undefined) out.set(key, undefined);
      else out.set(key, sameZones(merged, theirs.rooms) ? after[key] : encodeZones(merged));
    } else if (key === ROOM_KEYS.topSectionDoubleTap || key === ROOM_KEYS.handGesture) {
      const roomJump = key === ROOM_KEYS.topSectionDoubleTap ? DOUBLE_TAP_ROOM_JUMP : HAND_GESTURE_ROOM_JUMP;
      if (before[key] === roomJump && value !== roomJump && after[key] !== roomJump) out.delete(key);
    }
  }
  return out;
}

// ── reading ──────────────────────────────────────────────────────────────

function stringAt(doc: BehaviorDocument, key: string): string | undefined {
  const value = doc[key];
  return typeof value === "string" ? value : undefined;
}

function boolAt(doc: BehaviorDocument, key: string): boolean | undefined {
  const value = doc[key];
  return typeof value === "boolean" ? value : undefined;
}

/** What the editor shows, read from a document (edits laid over). */
export interface RoomsView {
  /** The room sensor's entity id, trimmed; "" for none. */
  sensor: string;
  /** "Switch pages by room": any room trigger on. */
  switching: boolean;
  /** "When to switch", Double-Tap Top when nothing is on. */
  trigger: RoomTrigger;
  /** The stored fallback, trimmed: "" for First available page, the stay
   * sentinel, or a page id. */
  fallback: string;
  /** The page per room as stored, every key as it is. */
  mappings: Record<string, string>;
  zones: ZonesRead;
  tapToToggle: boolean;
  liveTile: boolean;
}

/** The five keys the switching writes read and change, each read only when
 * it holds the type the app stores. */
interface SwitchingKeys {
  roomQuickJumpSourceEntityId?: string;
  roomQuickJumpEnabled?: boolean;
  roomAutoSwitchEnabled?: boolean;
  topSectionDoubleTapAction?: string;
  handGestureAction?: string;
}

function switchingKeysOf(doc: BehaviorDocument): SwitchingKeys {
  const out: SwitchingKeys = {};
  const sensor = stringAt(doc, ROOM_KEYS.sensor);
  if (sensor !== undefined) out.roomQuickJumpSourceEntityId = sensor;
  const legacy = boolAt(doc, ROOM_KEYS.legacyQuickJump);
  if (legacy !== undefined) out.roomQuickJumpEnabled = legacy;
  const auto = boolAt(doc, ROOM_KEYS.autoSwitch);
  if (auto !== undefined) out.roomAutoSwitchEnabled = auto;
  const top = stringAt(doc, ROOM_KEYS.topSectionDoubleTap);
  if (top !== undefined) out.topSectionDoubleTapAction = top;
  const hand = stringAt(doc, ROOM_KEYS.handGesture);
  if (hand !== undefined) out.handGestureAction = hand;
  return out;
}

/** "Switch Pages by Room" on the phone (`RoomConfig.roomSwitchingOn`). */
export function roomSwitchingOn(doc: BehaviorDocument): boolean {
  const p = switchingKeysOf(doc);
  const top = p.topSectionDoubleTapAction === DOUBLE_TAP_ROOM_JUMP || (p.roomQuickJumpEnabled ?? false);
  const hand = (p.handGestureAction ?? HAND_GESTURE_REFRESH) === HAND_GESTURE_ROOM_JUMP;
  return top || (p.roomAutoSwitchEnabled ?? false) || hand;
}

/** "When to Switch" on the phone (`RoomConfig.roomSwitchTrigger`). */
export function roomSwitchTrigger(doc: BehaviorDocument): RoomTrigger {
  const p = switchingKeysOf(doc);
  if (p.roomAutoSwitchEnabled ?? false) return "Automatic";
  if ((p.handGestureAction ?? HAND_GESTURE_REFRESH) === HAND_GESTURE_ROOM_JUMP) return "Double Pinch";
  return "Double-Tap Top";
}

export function readRooms(doc: BehaviorDocument): RoomsView {
  const mappings: Record<string, string> = {};
  const stored = doc[ROOM_KEYS.mappings];
  if (isObject(stored)) {
    for (const [key, value] of Object.entries(stored)) if (typeof value === "string") mappings[key] = value;
  }
  const switch_ = (key: string) => boolAt(doc, key) ?? ROOM_RULES.pointControl.switches.find((s) => s.key === key)?.absent ?? false;
  return {
    sensor: (stringAt(doc, ROOM_KEYS.sensor) ?? "").trim(),
    switching: roomSwitchingOn(doc),
    trigger: roomSwitchTrigger(doc),
    fallback: (stringAt(doc, ROOM_KEYS.fallback) ?? "").trim(),
    mappings,
    zones: decodeZones(doc[ROOM_KEYS.zones]),
    tapToToggle: switch_(ROOM_KEYS.tapToToggle),
    liveTile: switch_(ROOM_KEYS.liveTile),
  };
}

// ── the writes, as the phone makes them ──────────────────────────────────

/** A switching change of the five keys as key writes: only a key whose typed
 * value moved is written, so a key holding something of another type is
 * left as it was unless the phone's write sets it. */
function switchingWrites(before: SwitchingKeys, after: SwitchingKeys): Map<string, unknown> {
  const writes = new Map<string, unknown>();
  for (const key of ROOM_RULES.switching.keys as (keyof SwitchingKeys)[]) {
    if (before[key] !== after[key]) writes.set(key, after[key]);
  }
  return writes;
}

/** The phone's sensor clear (`RoomConfig.clearRoomSensor`). */
function clearSensor(p: SwitchingKeys): void {
  delete p.roomQuickJumpSourceEntityId;
  p.roomQuickJumpEnabled = false;
  p.roomAutoSwitchEnabled = false;
  if (p.handGestureAction === HAND_GESTURE_ROOM_JUMP) p.handGestureAction = HAND_GESTURE_REFRESH;
  if (p.topSectionDoubleTapAction === DOUBLE_TAP_ROOM_JUMP) p.topSectionDoubleTapAction = DOUBLE_TAP_DISABLED;
}

/** Picking a room sensor writes only its id; an empty one is the clear,
 * which turns every room trigger off. */
export function sensorWrites(doc: BehaviorDocument, entityId: string): Map<string, unknown> {
  const id = entityId.trim();
  if (id !== "") return new Map([[ROOM_KEYS.sensor, id]]);
  return clearSensorWrites(doc);
}

export function clearSensorWrites(doc: BehaviorDocument): Map<string, unknown> {
  const before = switchingKeysOf(doc);
  const after = { ...before };
  clearSensor(after);
  return switchingWrites(before, after);
}

/** "Switch Pages by Room" turned on (Double-Tap Top) or off
 * (`RoomConfig.setRoomSwitching`). */
export function switchingWritesFor(doc: BehaviorDocument, on: boolean): Map<string, unknown> {
  const before = switchingKeysOf(doc);
  const p = { ...before };
  if (on) {
    p.topSectionDoubleTapAction = DOUBLE_TAP_ROOM_JUMP;
    p.roomQuickJumpEnabled = false;
    p.roomAutoSwitchEnabled = false;
    // The double pinch is Watch settings' row: only a Room Jump of Rooms'
    // own is taken back, any other action is kept.
    if (p.handGestureAction === HAND_GESTURE_ROOM_JUMP) p.handGestureAction = HAND_GESTURE_REFRESH;
  } else {
    p.roomQuickJumpEnabled = false;
    p.roomAutoSwitchEnabled = false;
    if (p.handGestureAction === HAND_GESTURE_ROOM_JUMP) p.handGestureAction = HAND_GESTURE_REFRESH;
    if (p.topSectionDoubleTapAction === DOUBLE_TAP_ROOM_JUMP) p.topSectionDoubleTapAction = DOUBLE_TAP_DISABLED;
  }
  return switchingWrites(before, p);
}

/** One "When to Switch" picked (`RoomConfig.setRoomSwitchTrigger`). */
export function triggerWrites(doc: BehaviorDocument, trigger: RoomTrigger): Map<string, unknown> {
  const before = switchingKeysOf(doc);
  const p = { ...before };
  switch (trigger) {
    case "Automatic":
      p.roomAutoSwitchEnabled = true;
      p.roomQuickJumpEnabled = false;
      if (p.handGestureAction === HAND_GESTURE_ROOM_JUMP) p.handGestureAction = HAND_GESTURE_REFRESH;
      if (p.topSectionDoubleTapAction === DOUBLE_TAP_ROOM_JUMP) p.topSectionDoubleTapAction = DOUBLE_TAP_DISABLED;
      break;
    case "Double-Tap Top":
      p.roomAutoSwitchEnabled = false;
      p.roomQuickJumpEnabled = false;
      p.topSectionDoubleTapAction = DOUBLE_TAP_ROOM_JUMP;
      if (p.handGestureAction === HAND_GESTURE_ROOM_JUMP) p.handGestureAction = HAND_GESTURE_REFRESH;
      break;
    case "Double Pinch":
      p.roomAutoSwitchEnabled = false;
      p.roomQuickJumpEnabled = false;
      if (p.topSectionDoubleTapAction === DOUBLE_TAP_ROOM_JUMP) p.topSectionDoubleTapAction = DOUBLE_TAP_DISABLED;
      p.handGestureAction = HAND_GESTURE_ROOM_JUMP;
      break;
  }
  return switchingWrites(before, p);
}

/** The fallback page: "" (First available page) removes the key, the stay
 * sentinel or a page id is stored. */
export function fallbackWrites(value: string): Map<string, unknown> {
  const v = value.trim();
  return new Map([[ROOM_KEYS.fallback, v === "" ? undefined : v]]);
}

/** One point control switch. */
export function pointSwitchWrites(key: string, on: boolean): Map<string, unknown> {
  return new Map([[key, on]]);
}

/** The page a room switches to, as the watch finds it: any stored key that
 * normalizes to the room, the room's own key first. */
export function roomPage(view: Pick<RoomsView, "mappings">, roomKey: string): string {
  const own = view.mappings[roomKey];
  if (own !== undefined) return own.trim();
  for (const [key, value] of Object.entries(view.mappings)) {
    if (normalizedRoomKey(key) === roomKey) return value.trim();
  }
  return "";
}

/** A room's page set (or cleared with ""): every key that normalizes to the
 * room goes, and the page is stored under the normalized name, as the phone
 * stores it. An empty mapping is no key at all. */
export function roomPageWrites(doc: BehaviorDocument, roomKey: string, pageId: string): Map<string, unknown> {
  const stored = doc[ROOM_KEYS.mappings];
  const mapping: Record<string, unknown> = isObject(stored) ? structuredClone(stored) : {};
  for (const key of Object.keys(mapping)) if (normalizedRoomKey(key) === roomKey) delete mapping[key];
  const page = pageId.trim();
  if (page !== "") mapping[roomKey] = page;
  return new Map([[ROOM_KEYS.mappings, Object.keys(mapping).length === 0 ? undefined : mapping]]);
}

/** A room's point control targets as stored: every stored room that
 * normalizes to it, in order. */
export function roomZones(rooms: PointRooms, roomKey: string): PointZone[] {
  return rooms.filter(([key]) => normalizedRoomKey(key) === roomKey).flatMap(([, zones]) => zones);
}

/**
 * A room's targets replaced. Every stored room that normalizes to it is
 * folded into one under the normalized name, where the first of them stood,
 * and the rooms are cleaned as the phone cleans them. The string is written
 * again only when the rooms say something new; no room left removes the key.
 * Undefined when the stored string does not decode: nothing is written over
 * what cannot be read.
 */
export function roomZonesWrites(doc: BehaviorDocument, roomKey: string, zones: PointZone[]): Map<string, unknown> | undefined {
  const read = decodeZones(doc[ROOM_KEYS.zones]);
  if (!read.ok) return undefined;
  const next: PointRooms = [];
  let placed = false;
  for (const [key, list] of read.rooms) {
    if (normalizedRoomKey(key) !== roomKey) {
      next.push([key, list]);
    } else if (!placed) {
      next.push([roomKey, zones]);
      placed = true;
    }
  }
  if (!placed) next.push([roomKey, zones]);
  const cleaned = cleanZones(next);
  if (cleaned === undefined) return new Map([[ROOM_KEYS.zones, undefined]]);
  if (sameZones(cleaned, read.rooms)) return new Map();
  return new Map([[ROOM_KEYS.zones, encodeZones(cleaned)]]);
}

// ── pages ────────────────────────────────────────────────────────────────

export interface RoomPageChoice {
  id: string;
  name: string;
}

/** The pages a room or the fallback can point at, in watch order: neither
 * system nor hidden, as the phone offers them. */
export function roomPageChoices(pages: WatchPagesDocument | undefined): RoomPageChoice[] {
  return watchPagesOf(pages)
    .filter((p) => !isSystemWatchPage(p) && !isHiddenWatchPage(p) && watchPageId(p) !== "")
    .map((p) => ({ id: watchPageId(p), name: watchPageName(p) }));
}

/** The choice a stored page id is, without regard to case. */
export function findPageChoice(choices: readonly RoomPageChoice[], id: string): RoomPageChoice | undefined {
  const want = id.trim().toLowerCase();
  return want === "" ? undefined : choices.find((c) => c.id.toLowerCase() === want);
}

// ── the room list ────────────────────────────────────────────────────────

export interface AreaEntry {
  name: string;
  aliases?: readonly string[] | null;
}

/** One state the room sensor held, and when (ms since the epoch). */
export interface SensorHistoryEntry {
  state: string;
  at: number;
}

export interface RoomListEntry {
  /** The normalized name: the key the watch matches. */
  key: string;
  /** An area's name or alias, a state the sensor reported, else the key in
   * capitals. */
  name: string;
  /** When the sensor last reported it, in the history read. */
  lastSeen?: number;
  /** A Home Assistant area (or alias) has this name. */
  area: boolean;
}

/**
 * Every room the editor lists, one per normalized name, merged as the
 * phone's Rooms screen merges them: area names and aliases, the rooms with a
 * page, the rooms with targets, the sensor's states, and names added here.
 * Rooms the sensor reported come first, newest first, then the rest by name.
 */
export function mergeRoomList(input: {
  areas?: readonly AreaEntry[];
  mappingKeys?: readonly string[];
  zoneKeys?: readonly string[];
  history?: readonly SensorHistoryEntry[];
  added?: readonly string[];
}): RoomListEntry[] {
  const byKey = new Map<string, RoomListEntry>();
  const seen = new Map<string, { at: number; state: string }>();
  for (const h of input.history ?? []) {
    if (!isRoomValue(h.state)) continue;
    const key = normalizedRoomKey(h.state.trim());
    if (key === "") continue;
    const was = seen.get(key);
    if (was === undefined || h.at > was.at) seen.set(key, { at: h.at, state: h.state.trim() });
  }
  const put = (raw: string, area: boolean, name?: string) => {
    const key = normalizedRoomKey(raw);
    if (key === "" || byKey.has(key)) return;
    const lastSeen = seen.get(key)?.at;
    byKey.set(key, { key, name: name ?? roomDisplayName(key), area, ...(lastSeen === undefined ? {} : { lastSeen }) });
  };
  for (const area of input.areas ?? []) {
    for (const raw of [area.name, ...(area.aliases ?? [])]) {
      const trimmed = typeof raw === "string" ? raw.trim() : "";
      if (trimmed !== "") put(trimmed, true, trimmed);
    }
  }
  for (const key of input.mappingKeys ?? []) put(key, false);
  for (const key of input.zoneKeys ?? []) put(key, false);
  for (const [key, h] of seen) if (!byKey.has(key)) put(key, false, h.state);
  for (const name of input.added ?? []) put(name, false, name.trim());
  const all = [...byKey.values()];
  const detected = all.filter((r) => r.lastSeen !== undefined).sort((a, b) => b.lastSeen! - a.lastSeen!);
  const rest = all.filter((r) => r.lastSeen === undefined)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  return [...detected, ...rest];
}

// ── Home Assistant replies ───────────────────────────────────────────────

/** The area registry's list, or nothing usable. */
export function areasFromReply(reply: unknown): AreaEntry[] {
  if (!Array.isArray(reply)) return [];
  const out: AreaEntry[] = [];
  for (const item of reply) {
    if (!isObject(item) || typeof item.name !== "string") continue;
    const aliases = Array.isArray(item.aliases) ? item.aliases.filter((a): a is string => typeof a === "string") : [];
    out.push({ name: item.name, aliases });
  }
  return out;
}

/** One entity's states from `history/history_during_period`, compressed
 * (`s`, `lc`, `lu` in seconds) or full (`state`, `last_changed`). */
export function historyFromReply(reply: unknown, entityId: string): SensorHistoryEntry[] {
  if (!isObject(reply)) return [];
  const list = reply[entityId];
  if (!Array.isArray(list)) return [];
  const out: SensorHistoryEntry[] = [];
  for (const item of list) {
    if (!isObject(item)) continue;
    const state = typeof item.s === "string" ? item.s : typeof item.state === "string" ? item.state : undefined;
    if (state === undefined) continue;
    let at: number | undefined;
    const seconds = typeof item.lc === "number" ? item.lc : typeof item.lu === "number" ? item.lu : undefined;
    if (seconds !== undefined) at = seconds * 1000;
    else {
      const iso = typeof item.last_changed === "string" ? item.last_changed : typeof item.last_updated === "string" ? item.last_updated : undefined;
      const parsed = iso === undefined ? NaN : Date.parse(iso);
      if (!Number.isNaN(parsed)) at = parsed;
    }
    out.push({ state, at: at ?? 0 });
  }
  return out;
}

/** How far back the sensor's states are read: the phone's 24 hours. */
export const ROOM_HISTORY_HOURS = 24;

// ── the size ─────────────────────────────────────────────────────────────

/** What Home Assistant takes for a `rooms` record (64 KiB), its own cap. */
export const HOME_ROOMS_LIMIT_BYTES = 64 * 1024;

export function roomsBudget(document: BehaviorDocument, kind: RoomsKind = "behavior"): { size: number; limit: number } {
  return { size: new TextEncoder().encode(JSON.stringify(document)).length, limit: kind === "rooms" ? HOME_ROOMS_LIMIT_BYTES : WATCH_CONFIG_LIMIT_BYTES };
}

// ── saving ───────────────────────────────────────────────────────────────

/** Tries before a save that keeps meeting newer copies gives up. */
const ROOMS_SAVE_ATTEMPTS = 3;

export interface RoomsSaveIO {
  save(baseRevision: number, document: BehaviorDocument): Promise<{ revision: number }>;
  fetch(): Promise<WatchConfigRecord>;
}

export type RoomsSaveResult =
  | { ok: true; revision: number; document: BehaviorDocument; merged: boolean; alreadySaved: boolean; fresh?: WatchConfigRecord }
  | { ok: false; code: string; message: string; fresh?: WatchConfigRecord };

/**
 * Save the edits over `record`. A conflict reads the newer copy and lays
 * the edits over it (`carryRoomEdits`), then sends again; edits the newer
 * copy already holds leave nothing to save. Any other refusal ends it.
 */
export async function saveRooms(io: RoomsSaveIO, record: { revision: number; document: BehaviorDocument }, edits: RoomEdits): Promise<RoomsSaveResult> {
  let base = record;
  let fresh: WatchConfigRecord | undefined;
  for (let attempt = 1; ; attempt++) {
    if (attempt > 1 && roomDirtyKeys(base.document, edits).length === 0) {
      return { ok: true, revision: base.revision, document: base.document, merged: true, alreadySaved: true, ...(fresh ? { fresh } : {}) };
    }
    const document = applyRoomEdits(base.document, edits);
    try {
      const { revision } = await io.save(base.revision, document);
      return { ok: true, revision, document, merged: attempt > 1, alreadySaved: false, ...(fresh ? { fresh } : {}) };
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= ROOMS_SAVE_ATTEMPTS) return { ok: false, code, message, ...(fresh ? { fresh } : {}) };
      try {
        fresh = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return { ok: false, code: e.code ?? "unknown", message: e.message };
      }
      if (!(fresh.revision > 0) || !isObject(fresh.document)) {
        return { ok: false, code: "no_record", message: "Home Assistant holds no settings for this watch.", fresh };
      }
      edits = carryRoomEdits(base.document, fresh.document, edits);
      base = { revision: fresh.revision, document: fresh.document };
    }
  }
}

/** The behavior document of a record, when it has one to edit. */
export function roomsDocumentOf(record: WatchConfigRecord | undefined): BehaviorDocument | undefined {
  return record !== undefined && record.revision > 0 && isObject(record.document) ? record.document : undefined;
}

// ── words ────────────────────────────────────────────────────────────────

export const ROOMS_NO_RECORD_TITLE = "No watch settings from this watch yet.";
/** The no-record line when no iPhone will send the watch's settings. Rooms
 * have no Start of their own: they come with Watch settings' start. */
export const ROOMS_NO_RECORD_TEXT = "Rooms are part of the watch's settings. Start them under Watch app, Settings.";

/** The same while the iPhone's move may still bring the settings. */
export const ROOMS_WAIT_TEXT = `Rooms are part of the watch's settings. ${WAIT_FOR_IPHONE_TEXT}`;
export const ROOMS_UNREADABLE_TEXT = "Home Assistant holds settings for this watch that this panel cannot read. Update the integration.";
export const ZONES_UNREADABLE_TEXT = "The point control targets stored for this watch cannot be read, so they are shown as none and left as they are. Update the integration to change them here.";

export const FALLBACK_LABELS = {
  stay: "Stay on current page",
  first: "First available page",
} as const;

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. */
export function roomsSaveNote(result: RoomsSaveResult, kind: RoomsKind = "behavior"): { kind: "ok" | "warn" | "err"; text: string } | undefined {
  const home = kind === "rooms";
  if (result.ok) {
    if (result.alreadySaved) return { kind: "ok", text: `Nothing left to save. The ${home ? "rooms" : "settings"} already had these changes, as revision ${result.revision}.` };
    return result.merged ? { kind: "ok", text: home ? "Saved. Room changes made elsewhere meanwhile were kept." : "Saved. Settings changed elsewhere meanwhile were kept." } : undefined;
  }
  const message = result.message.trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: `Not saved. ${home ? "This home's rooms" : "The watch's settings"} kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.` };
    case "no_record":
      return { kind: "warn", text: home ? "Not saved. Home Assistant no longer holds rooms for this home." : "Not saved. Home Assistant no longer holds settings for this watch." };
    case "not_for_iphone":
      return { kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` };
    case "busy":
      return { kind: "warn", text: "Already saving. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: `Not saved. Home Assistant could not store the ${home ? "rooms" : "settings"} just now. Your edits are kept, so try again in a moment.` };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}

/** The fallback's choice for a stored value. */
export function fallbackChoice(stored: string): "stay" | "first" | "page" {
  if (stored === "") return "first";
  if (stored === STAY_ON_CURRENT_PAGE) return "stay";
  return "page";
}

// ── a home that is not the main house ────────────────────────────────────

/** The record a watch's rooms live in here: its `behavior` settings on the
 * main house, a `rooms` record of their own on any other home. */
export type RoomsKind = "behavior" | "rooms";

/** The kind for the device being edited. Only an explicit `main_house: false`
 * moves a watch's rooms out of `behavior`: an older integration, and a watch
 * with one home, keep them where they always were. An iPhone's are always in
 * `rooms`, since its `behavior` keeps none of the room keys. */
export function roomsKindFor(owner: Pick<OwnerSummary, "main_house" | "device_kind"> | undefined): RoomsKind {
  return owner?.device_kind === "iphone" || takesSettingsFromAnotherHome(owner) ? "rooms" : "behavior";
}

/** `schemaVersion` of a `rooms` record. */
export const HOME_ROOMS_SCHEMA_VERSION = 1;

/** The six keys a `rooms` record holds, under their `behavior` names. */
export const HOME_ROOM_KEYS: readonly string[] = [
  ROOM_KEYS.legacyQuickJump,
  ROOM_KEYS.sensor,
  ROOM_KEYS.fallback,
  ROOM_KEYS.mappings,
  ROOM_KEYS.autoSwitch,
  ROOM_KEYS.zones,
];

/** The four room keys that stay with the main house's settings. A `rooms`
 * record never shows or writes them. */
export const MAIN_HOUSE_ROOM_KEYS: readonly string[] = [
  ROOM_KEYS.topSectionDoubleTap,
  ROOM_KEYS.handGesture,
  ROOM_KEYS.tapToToggle,
  ROOM_KEYS.liveTile,
];

/** Key writes for a `rooms` record: the same writes with the four main house
 * keys left out. */
export function homeRoomWrites(writes: RoomEdits): Map<string, unknown> {
  return new Map([...writes].filter(([key]) => !MAIN_HOUSE_ROOM_KEYS.includes(key)));
}

/** Whether this home switches pages by itself (`roomAutoSwitchEnabled`). */
export function homeAutoSwitch(doc: BehaviorDocument): boolean {
  return boolAt(doc, ROOM_KEYS.autoSwitch) ?? false;
}

/** "Switch automatically" on a home that is not the main house. On is the
 * phone's Automatic, which also turns the old quick jump off; off turns only
 * the automatic switch off. The gestures are the main house's. */
export function homeAutoSwitchWrites(doc: BehaviorDocument, on: boolean): Map<string, unknown> {
  return homeRoomWrites(on ? triggerWrites(doc, "Automatic") : new Map([[ROOM_KEYS.autoSwitch, false]]));
}

/** The first `rooms` record a Start makes: no rooms yet. */
export function homeRoomsStart(): BehaviorDocument {
  return { schemaVersion: HOME_ROOMS_SCHEMA_VERSION };
}

/** How a start of a `rooms` record ended. */
export type HomeRoomsStartResult =
  | { ok: true; revision: number }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/**
 * Make this home's first `rooms` record: a save over revision 0, which Home
 * Assistant takes only while it holds none for a paired watch. `no_record`
 * back means the watch is not paired, `conflict` that a record came
 * meanwhile (the caller reads it), `unsupported` an integration older than
 * the kind. Any other refusal is an error with Home Assistant's words.
 */
export async function startHomeRooms(save: (baseRevision: number, document: BehaviorDocument) => Promise<{ revision: number }>): Promise<HomeRoomsStartResult> {
  try {
    const { revision } = await save(0, homeRoomsStart());
    return { ok: true, revision };
  } catch (error) {
    const { code, message } = watchCommandError(error);
    if (code === "no_record" || code === "conflict") return { ok: false, code, message };
    if (code === "unknown_command" || code === "invalid") return { ok: false, code: "unsupported", message };
    return { ok: false, code: "error", message };
  }
}

/** Whether a failed read of `rooms` means this integration does not keep the
 * kind: one older than it refuses it as `invalid`, one older than the store
 * does not know the command. */
export function homeRoomsReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}

/** The one line that stands for the four main house keys. */
export const HOME_ROOMS_MAIN_HOUSE_TEXT = "Double-Tap Top, Double Pinch and the point control switches come from your main house.";
/** The same place on an iPhone, which has no main house: its Double-Tap Top
 * is in its own settings, and it has no Double Pinch. */
export const HOME_ROOMS_PHONE_TEXT = "Double-Tap Top is in this iPhone's settings.";
export const HOME_ROOMS_NO_RECORD_TITLE = "No rooms for this home yet.";
/** The no-record line when no iPhone will send this home's rooms. */
export const HOME_ROOMS_NO_RECORD_TEXT = "Start with no rooms to begin.";
export const HOME_ROOMS_START_BUTTON = "Start with no rooms";
export const HOME_ROOMS_START_CONFLICT_TEXT = "Rooms for this home arrived meanwhile, so those are shown.";
export const HOME_ROOMS_STARTED_TEXT = "Started with no rooms. Pick a room sensor and give rooms a page, then save.";
export const HOME_ROOMS_UPDATE_TEXT = "Update the integration to edit this home's rooms here.";
export const HOME_ROOMS_UNREADABLE_TEXT = "Home Assistant holds rooms for this home that this panel cannot read. Update the integration.";
export const HOME_AUTO_SWITCH_LABEL = "Switch automatically";
