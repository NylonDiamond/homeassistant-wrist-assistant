// The three-way merge of the watch's page config, and the JSON equality it
// judges changes by.
//
// The iPhone app edits the same document and merges it the same way when both
// sides changed (`WatchConfigMirrorRule.mergePages` in the app's `Shared/`).
// The panel runs this copy when its save meets a conflict, or when a change
// from elsewhere lands while a draft is open. "Local" here is the panel's
// draft, as it is the phone there. The case files in
// `frontend/test/fixtures-pages/merge` are the specification both sides run.
//
// Nothing here changes its inputs. Where the merge takes a value whole from
// one side, the result holds that very object, and a merged page, tile, list
// or document that came out exactly as one side has it is that side's object.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("The sync rule for
// pages changes to a three-way merge", and "The merge keeps a reorder").

import pageKeys from "./page-keys.json";
import { type JsonObject, type WatchPagesDocument, isJsonObject } from "./model.js";

/** The key of the page list at the top of the document. */
const PAGES_KEY = "pages";
/** The key of the tile list inside a page. */
const ITEMS_KEY = "items";
/** The key pages and tiles are matched by. */
const ID_KEY = "id";

/**
 * The tile keys that hold a map keyed by slide direction, written as a flat
 * array `[direction, value, direction, value]`. The phone writes the pairs in
 * the order up, down, left, right, but older copies hold them in any order, so
 * their order is never a change.
 */
export const WATCH_PAGES_SLIDE_MAP_KEYS: ReadonlySet<string> = new Set([
  "holdSlideActions",
  "holdSlideTriggerTargets",
  "holdSlideHTTPActionTargets",
  "holdSlideHTTPActionShowBanner",
  "holdSlideHTTPActionBannerSeconds",
]);

// ── equality ─────────────────────────────────────────────────────────────

/** undefined for absent and for `null`, which mean the same here. */
function present(value: unknown): unknown {
  return value === null ? undefined : value;
}

/** An object's own value for a key, so a key such as `constructor` never
 * reads through to the prototype. */
function own(object: JsonObject, key: string): unknown {
  return Object.hasOwn(object, key) ? object[key] : undefined;
}

/** Sets one key, `__proto__` included, as a plain own property. */
function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") {
    Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  } else {
    object[key] = value;
  }
}

/**
 * Whether two parsed JSON values are the same document, as the phone judges
 * a change:
 *
 * - Deep. Objects compare key by key whatever their key order, arrays element
 *   by element in order.
 * - `null` and an absent key are the same, at every depth.
 * - Numbers compare by value, so 6 and 6.0 are one value. A boolean equals
 *   only the same boolean, never 1 or 0.
 * - The slide map keys (`WATCH_PAGES_SLIDE_MAP_KEYS`), wherever they appear,
 *   compare as sets of (direction, value) pairs when both sides are such a
 *   map, so their pair order alone is no change.
 */
export function sameWatchPagesJson(lhs: unknown, rhs: unknown): boolean {
  const a = present(lhs);
  const b = present(rhs);
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!sameWatchPagesJson(a[i], b[i])) return false;
    }
    return true;
  }
  if (isJsonObject(a)) {
    if (!isJsonObject(b)) return false;
    for (const key of Object.keys(a)) {
      if (!sameKeyValue(key, a[key], own(b, key))) return false;
    }
    for (const key of Object.keys(b)) {
      if (!Object.hasOwn(a, key) && present(b[key]) !== undefined) return false;
    }
    return true;
  }
  // Strings, numbers and booleans that are not `===`.
  return false;
}

/** Equality of one key's two values: `sameWatchPagesJson`, except that a
 * slide map compares as a set of pairs. */
function sameKeyValue(key: string, lhs: unknown, rhs: unknown): boolean {
  if (WATCH_PAGES_SLIDE_MAP_KEYS.has(key)) {
    const a = slidePairs(lhs);
    const b = slidePairs(rhs);
    if (a !== undefined && b !== undefined) {
      if (a.size !== b.size) return false;
      for (const [direction, value] of a) {
        if (!b.has(direction) || !sameWatchPagesJson(value, b.get(direction))) return false;
      }
      return true;
    }
  }
  return sameWatchPagesJson(lhs, rhs);
}

/** A slide map's pairs by direction, or undefined when the value is not a
 * flat array of distinct string directions each followed by a value. */
function slidePairs(value: unknown): Map<string, unknown> | undefined {
  const list = present(value);
  if (!Array.isArray(list) || list.length % 2 !== 0) return undefined;
  const pairs = new Map<string, unknown>();
  for (let i = 0; i < list.length; i += 2) {
    const direction: unknown = list[i];
    if (typeof direction !== "string" || pairs.has(direction)) return undefined;
    pairs.set(direction, list[i + 1]);
  }
  return pairs;
}

// ── merge by key ─────────────────────────────────────────────────────────

/** Whether `merged` holds exactly the keys of `side`, each the very same
 * value, so `side` itself can stand for it. */
function sameReferences(merged: JsonObject, side: JsonObject): boolean {
  const keys = Object.keys(merged);
  if (keys.length !== Object.keys(side).length) return false;
  for (const key of keys) {
    if (!Object.hasOwn(side, key) || side[key] !== merged[key]) return false;
  }
  return true;
}

/** `merged`, or one of the two sides when it came out exactly as that side
 * holds it. */
function shareWhole(merged: JsonObject, server: JsonObject, local: JsonObject): JsonObject {
  if (sameReferences(merged, server)) return server;
  if (sameReferences(merged, local)) return local;
  return merged;
}

/** Each key as `mergeWatchPagesByKey` picks it against a base, judged by
 * `same`. Keys come in the server's order, then the keys only local has, in
 * local's order. A key absent or `null` in the pick is left out. */
function pickByKey(
  base: JsonObject,
  local: JsonObject,
  server: JsonObject,
  same: (key: string, lhs: unknown, rhs: unknown) => boolean,
): JsonObject {
  const merged: JsonObject = {};
  const take = (key: string): void => {
    const localValue = own(local, key);
    const localChanged = !same(key, localValue, own(base, key));
    const value = localChanged ? localValue : own(server, key);
    if (value !== undefined && value !== null) put(merged, key, value);
  };
  for (const key of Object.keys(server)) take(key);
  for (const key of Object.keys(local)) {
    if (!Object.hasOwn(server, key)) take(key);
  }
  // A key only the base holds was removed on both sides, or on one side and
  // left alone on the other: either way it stays out.
  return merged;
}

/**
 * The merge for a document that is one JSON object (the watch behavior
 * settings): for each top-level key, local's value when local changed that
 * key since `base`, the server's otherwise. "Changed" includes added and
 * removed, by `sameWatchPagesJson`. A `null` from either side reads as
 * absent, so the result never holds one at the top.
 *
 * With no `base` local cannot tell its own edits from the values it already
 * had, so every key it holds counts as its own, and the server's value is
 * taken only for the keys local does not hold.
 */
export function mergeWatchPagesByKey(
  base: JsonObject | null | undefined,
  local: JsonObject,
  server: JsonObject,
): JsonObject {
  if (base !== null && base !== undefined) {
    return shareWhole(pickByKey(base, local, server, (_key, a, b) => sameWatchPagesJson(a, b)), server, local);
  }
  const merged: JsonObject = {};
  for (const key of Object.keys(server)) {
    const value = Object.hasOwn(local, key) ? local[key] : server[key];
    if (value !== undefined && value !== null) put(merged, key, value);
  }
  for (const key of Object.keys(local)) {
    const value = local[key];
    if (!Object.hasOwn(server, key) && value !== undefined && value !== null) put(merged, key, value);
  }
  return shareWhole(merged, server, local);
}

// ── merge pages ──────────────────────────────────────────────────────────

/**
 * The three-way merge of the page config: `mergeWatchPagesByKey` one level
 * deeper. `local` is the panel's draft, `base` the document it was made from,
 * `server` the newer document Home Assistant holds.
 *
 * - Every top-level key but `pages` merges by key.
 * - Pages are matched by `id`, and inside a page the tiles under `items` are
 *   matched by `id`. Inside a page or a tile each key keeps local's value when
 *   local changed it since `base`, and takes the server's otherwise. A key one
 *   side removed counts as changed by that side.
 * - A smart page's `dynamicConfig`, when both sides hold one, merges by key
 *   the same way, its `rules` are matched by `id` like tiles, each rule
 *   merges by key, and a rule's `tileStyle`, when both sides hold one, by
 *   key again (`mergeDynamicConfig`); a `tileStyle` left with no key is
 *   removed, as the phone's encoder removes it. A `dynamicConfig` both
 *   sides added over a base without one merges against an empty one. A
 *   rule's lists (`entityIds`,
 *   `resolvedEntityIds`, `deviceClassFilter`) are one value each.
 * - Every other value is one value, however deep: a page's `groups`, a
 *   tile's arrays, a `dynamicConfig` or `tileStyle` only one side holds.
 * - A tile's hold and slide keys merge one direction at a time, each
 *   direction's action, targets and banner settings as one unit
 *   (`mergeSlideDirections`).
 * - A camera group's cameras with their per-camera lists and columns, a
 *   remote's four quick action lists, a calendar tile's calendars with their
 *   colors, and a music hub's speakers with its presets merge as one unit
 *   each, keyed on the list the others follow (`mergeListUnit`), so the
 *   lists never come apart.
 * - A page, tile or rule one side deleted is gone when the other side left it
 *   as it was in `base`, and stays, as the other side has it, when that side
 *   changed it.
 * - Order, for the pages, for the tiles of each page and for the rules of
 *   each smart page on their own: local reordered a list when the elements
 *   it shares with `base` (same `id` in both) come in another order than in
 *   `base`; adding and deleting alone is no reorder. When it did not, the
 *   order is the server's, and what only local holds (added there, or kept
 *   because local changed what the server deleted) follows in local's
 *   order. When it did, the order is local's, and what only the server
 *   holds follows in the server's order. Order never decides which elements
 *   stay or how their keys merge.
 * - A page, tile or rule both sides added under one id merges key by key
 *   against nothing, so local's keys win and the server's others stay.
 * - A list cannot be matched, and is one value again, when local or the
 *   server has none, or when on any side its elements are not all objects
 *   with a distinct, non-empty string `id` (compared exactly, case and all).
 *   A list the base has none of counts as empty.
 *
 * `null` reads as absent everywhere, and the result holds none at the top of
 * the document, of a page or of a tile.
 *
 * With no `base` the server's document is the base, so every difference reads
 * as local's.
 */
export function mergeWatchPages(
  base: WatchPagesDocument | null | undefined,
  local: WatchPagesDocument,
  server: WatchPagesDocument,
): WatchPagesDocument {
  const from = base ?? server;
  const merged = pickByKey(from, local, server, (_key, a, b) => sameWatchPagesJson(a, b));
  setOrRemove(merged, PAGES_KEY, mergeList(own(from, PAGES_KEY), own(local, PAGES_KEY), own(server, PAGES_KEY), mergePage));
  return shareWhole(merged, server, local);
}

/** Sets a key, or removes it for undefined, keeping its place when it is
 * already there. */
function setOrRemove(object: JsonObject, key: string, value: unknown): void {
  if (value === undefined) delete object[key];
  else put(object, key, value);
}

/** The elements of a list by `id`, in order, or undefined when the value is
 * not a list of objects with distinct, non-empty string ids. */
function identified(value: unknown): Array<[string, JsonObject]> | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const elements: Array<[string, JsonObject]> = [];
  for (const item of value) {
    if (!isJsonObject(item)) return undefined;
    const id = own(item, ID_KEY);
    if (typeof id !== "string" || id === "" || seen.has(id)) return undefined;
    seen.add(id);
    elements.push([id, item]);
  }
  return elements;
}

/** Whether two id lists hold the same ids in the same order. */
function sameOrder(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

/** How one element both sides of a list hold is merged (a page, a tile, a
 * rule), against its base element or `{}`. */
type MergeElement = (base: JsonObject, local: JsonObject, server: JsonObject) => JsonObject;

/**
 * One list of id'd objects, three ways, each element both sides hold merged
 * by `mergeOne`. Undefined back means the key is absent.
 */
function mergeList(base: unknown, local: unknown, server: unknown, mergeOne: MergeElement): unknown {
  const b = present(base);
  const l = present(local);
  const s = present(server);
  const baseElements = b === undefined ? [] : identified(b);
  const localElements = l === undefined ? undefined : identified(l);
  const serverElements = s === undefined ? undefined : identified(s);
  if (localElements === undefined || serverElements === undefined || baseElements === undefined) {
    // One value: local's when local changed it, else the server's.
    return sameWatchPagesJson(l, b) ? s : l;
  }
  const baseById = new Map(baseElements);
  const localById = new Map(localElements);
  const serverById = new Map(serverElements);

  // One element held by both sides, merged.
  const both = (id: string, localElement: JsonObject, serverElement: JsonObject): JsonObject =>
    mergeOne(baseById.get(id) ?? {}, localElement, serverElement);
  // An element only one side holds: added there, or deleted on the other
  // side and changed on this one, and then this side's. Deleted on the other
  // side and left as it was in the base on this one: gone.
  const onlyOn = (id: string, element: JsonObject): JsonObject | undefined => {
    const baseElement = baseById.get(id);
    return baseElement !== undefined && sameWatchPagesJson(element, baseElement) ? undefined : element;
  };

  const localShared = localElements.map(([id]) => id).filter((id) => baseById.has(id));
  const baseShared = baseElements.map(([id]) => id).filter((id) => localById.has(id));
  const localReordered = !sameOrder(localShared, baseShared);

  const [lead, leadOthers, follow, followOthers] = localReordered
    ? [localElements, serverById, serverElements, localById]
    : [serverElements, localById, localElements, serverById];
  const result: JsonObject[] = [];
  for (const [id, element] of lead) {
    const other = leadOthers.get(id);
    if (other !== undefined) {
      result.push(localReordered ? both(id, element, other) : both(id, other, element));
    } else {
      const kept = onlyOn(id, element);
      if (kept !== undefined) result.push(kept);
    }
  }
  for (const [id, element] of follow) {
    if (followOthers.has(id)) continue;
    const kept = onlyOn(id, element);
    if (kept !== undefined) result.push(kept);
  }
  // The very list of a side when the result is that list, element for element.
  if (sameElements(result, s as unknown[])) return s;
  if (sameElements(result, l as unknown[])) return l;
  return result;
}

/** Whether a merged list is a side's list: element for element the same
 * object, or an object whose every key holds the very same value (an element
 * both sides hold alike, merged to one side's object). */
function sameElements(merged: readonly JsonObject[], side: readonly unknown[]): boolean {
  if (merged.length !== side.length) return false;
  return merged.every((element, i) => {
    const other = side[i];
    return element === other || (isJsonObject(other) && sameReferences(element, other));
  });
}

/** One page held by both sides: each key as `mergeWatchPagesByKey` picks it,
 * with slide maps compared as sets, except its tiles, which are matched
 * again, and a smart page's `dynamicConfig` (`mergeDynamicConfig`). */
function mergePage(base: JsonObject, local: JsonObject, server: JsonObject): JsonObject {
  const merged = pickByKey(base, local, server, sameKeyValue);
  setOrRemove(merged, ITEMS_KEY, mergeList(own(base, ITEMS_KEY), own(local, ITEMS_KEY), own(server, ITEMS_KEY), mergeTile));
  mergeDynamicConfig(merged, base, local, server);
  return shareWhole(merged, server, local);
}

/** One tile held by both sides: each key as `mergeWatchPagesByKey` picks it,
 * with slide maps compared as sets, then its slide directions and list
 * units. */
function mergeTile(base: JsonObject, local: JsonObject, server: JsonObject): JsonObject {
  const merged = pickByKey(base, local, server, sameKeyValue);
  mergeSlideDirections(merged, base, local, server);
  for (const unit of WATCH_PAGES_LIST_UNITS) mergeListUnit(unit, merged, base, local, server);
  return shareWhole(merged, server, local);
}

/** The key of a smart page's config, of its rules, and of a rule's style. */
const DYNAMIC_CONFIG_KEY = "dynamicConfig";
const RULES_KEY = "rules";
const TILE_STYLE_KEY = "tileStyle";

/**
 * An object key both sides hold as an object, merged by key against the
 * base's object (`{}` when the base has none), over the key by key result
 * in `merged`; `inside` merges deeper keys of the merged object. A key one
 * side does not hold as an object keeps the key by key result.
 */
function mergeObjectKey(
  key: string,
  merged: JsonObject,
  base: JsonObject,
  local: JsonObject,
  server: JsonObject,
  inside?: (merged: JsonObject, base: JsonObject, local: JsonObject, server: JsonObject) => void,
  dropEmpty = false,
): void {
  const l = present(own(local, key));
  const s = present(own(server, key));
  if (!isJsonObject(l) || !isJsonObject(s)) return;
  const b = present(own(base, key));
  const from = isJsonObject(b) ? b : {};
  const out = pickByKey(from, l, s, sameKeyValue);
  inside?.(out, from, l, s);
  // An object the merge left with no key is removed when the phone's
  // encoder leaves it out (a rule's `tileStyle`).
  setOrRemove(merged, key, dropEmpty && Object.keys(out).length === 0 ? undefined : shareWhole(out, s, l));
}

/** A smart page's `dynamicConfig` by key, its rules by id (`mergeRule`), in
 * the order rule of `mergeList`. */
function mergeDynamicConfig(merged: JsonObject, base: JsonObject, local: JsonObject, server: JsonObject): void {
  mergeObjectKey(DYNAMIC_CONFIG_KEY, merged, base, local, server, (out, b, l, s) => {
    setOrRemove(out, RULES_KEY, mergeList(own(b, RULES_KEY), own(l, RULES_KEY), own(s, RULES_KEY), mergeRule));
  });
}

/** One rule held by both sides: each key by `mergeWatchPagesByKey`'s pick
 * (its lists one value each), and its `tileStyle` by key; a `tileStyle`
 * that merge leaves empty is removed, as the phone removes it. */
function mergeRule(base: JsonObject, local: JsonObject, server: JsonObject): JsonObject {
  const merged = pickByKey(base, local, server, sameKeyValue);
  mergeObjectKey(TILE_STYLE_KEY, merged, base, local, server, undefined, true);
  return shareWhole(merged, server, local);
}

// ── parallel lists ───────────────────────────────────────────────────────

/**
 * A tile's lists that hold one entry per id of a key list, merged as one
 * unit (the app's `WatchConfigMirrorRule.listUnits`).
 */
export interface WatchPagesListUnit {
  /** The key list. A side that changed it since `base` moved the unit. */
  ids: string;
  /** Lists with one entry per id, at the same index, each with the value a
   * missing entry reads as (what the editors pad with). */
  parallel: readonly (readonly [string, unknown])[];
  /** Maps with one entry per id, keyed by the id. */
  keyed: readonly string[];
  /** Further keys the side that moved the unit decides. */
  with: readonly string[];
}

/**
 * The camera group (the four per camera lists, the grid's columns, and
 * `entityId`, which turns from `multicam.` to `camera.` when a remove leaves
 * one camera), the quick actions, the calendars (the primary moves when it
 * is removed, and each calendar's color), and the music hub's speakers (a
 * removed speaker also leaves every preset, so the side that changed the
 * speaker list decides the presets as one value; with the list unchanged the
 * presets merge by key as before).
 */
export const WATCH_PAGES_LIST_UNITS: readonly WatchPagesListUnit[] = [
  {
    ids: "cameraGroupIds",
    parallel: [["cameraRowWeights", 1], ["cameraFillModes", "fill"], ["cameraFillOffsetsX", 0], ["cameraFillOffsetsY", 0]],
    keyed: [],
    with: ["cameraGridColumns", "entityId"],
  },
  {
    ids: "remoteLauncherScriptIds",
    parallel: [["remoteLauncherLabels", ""], ["remoteLauncherIcons", "app.fill"], ["remoteLauncherColors", ""]],
    keyed: [],
    with: [],
  },
  {
    ids: "additionalCalendarEntityIds",
    parallel: [],
    keyed: ["calendarSourceColors"],
    with: ["entityId"],
  },
  {
    ids: "musicHubSpeakerIds",
    parallel: [],
    keyed: [],
    with: ["musicHubGroupPresets"],
  },
];

/** A keyed map's entries: none for an absent map, undefined when the value
 * is not an object. */
function keyedEntries(value: unknown): JsonObject | undefined {
  const map = present(value);
  if (map === undefined) return {};
  return isJsonObject(map) ? map : undefined;
}

/**
 * The list units of a tile both sides hold, over the key by key result in
 * `merged`, local first as for a slide direction:
 *
 * - Local changed the unit's key list since `base`: every key of the unit is
 *   local's, a key local has none of removed.
 * - Else the server changed it: every key is the server's.
 * - Else neither did. A parallel list both sides changed, both holding a
 *   list, merges index by index: local's entry where local has one that
 *   differs from the base's (a missing base entry reads as the pad), else the
 *   server's, else local's; as long as the longer side's list, never past the
 *   key list. A keyed map both sides changed, both (and the base) holding an
 *   object or nothing, merges entry by entry: local's where it differs from
 *   the base's, else the server's; an empty map is removed. Every other key
 *   stays as the key by key rule left it.
 */
function mergeListUnit(unit: WatchPagesListUnit, merged: JsonObject, base: JsonObject, local: JsonObject, server: JsonObject): void {
  const localMoved = !sameWatchPagesJson(own(local, unit.ids), own(base, unit.ids));
  const serverMoved = !sameWatchPagesJson(own(server, unit.ids), own(base, unit.ids));
  if (localMoved || serverMoved) {
    const winner = localMoved ? local : server;
    for (const key of [unit.ids, ...unit.parallel.map(([k]) => k), ...unit.keyed, ...unit.with]) {
      setOrRemove(merged, key, present(own(winner, key)));
    }
    return;
  }
  const bothChanged = (key: string) =>
    !sameWatchPagesJson(own(local, key), own(base, key)) && !sameWatchPagesJson(own(server, key), own(base, key));
  const ids = present(own(local, unit.ids));
  if (Array.isArray(ids)) {
    for (const [key, pad] of unit.parallel) {
      if (!bothChanged(key)) continue;
      const mine = present(own(local, key));
      const theirs = present(own(server, key));
      if (!Array.isArray(mine) || !Array.isArray(theirs)) continue;
      const old = present(own(base, key));
      const before = Array.isArray(old) ? old : [];
      const count = Math.min(ids.length, Math.max(mine.length, theirs.length));
      const entries = Array.from({ length: count }, (_, i) => {
        const was = i < before.length ? before[i] : pad;
        if (i < mine.length && !sameWatchPagesJson(mine[i], was)) return mine[i];
        return i < theirs.length ? theirs[i] : mine[i];
      });
      setOrRemove(merged, key, sameWatchPagesJson(entries, theirs) ? theirs : sameWatchPagesJson(entries, mine) ? mine : entries);
    }
  }
  for (const key of unit.keyed) {
    if (!bothChanged(key)) continue;
    const mine = keyedEntries(own(local, key));
    const theirs = keyedEntries(own(server, key));
    const old = keyedEntries(own(base, key));
    if (mine === undefined || theirs === undefined || old === undefined) continue;
    const entries: JsonObject = {};
    const names = new Set([...Object.keys(old), ...Object.keys(mine), ...Object.keys(theirs)]);
    for (const name of names) {
      const picked = sameWatchPagesJson(own(mine, name), own(old, name)) ? own(theirs, name) : own(mine, name);
      if (present(picked) !== undefined) put(entries, name, picked);
    }
    setOrRemove(merged, key, Object.keys(entries).length === 0 ? undefined : entries);
  }
}

// ── hold and slide ───────────────────────────────────────────────────────

/** The slide map that says what each direction does; the others hang off
 * it (a trigger's target, an HTTP action's target, banner and seconds). */
const SLIDE_ACTIONS_KEY = "holdSlideActions";

/** The order the phone writes a slide map's pairs in. */
const SLIDE_DIRECTION_ORDER = ["up", "down", "left", "right"];

/** A slide map's entries by direction: none for an absent or `null` map,
 * and a `null` value is no entry. Undefined when the value is not a flat
 * array of distinct string directions each followed by a value. */
function slideEntries(value: unknown): Map<string, unknown> | undefined {
  if (present(value) === undefined) return new Map();
  const pairs = slidePairs(value);
  if (pairs === undefined) return undefined;
  const entries = new Map<string, unknown>();
  for (const [direction, entry] of pairs) {
    if (present(entry) !== undefined) entries.set(direction, entry);
  }
  return entries;
}

/** Whether two slide maps hold the same entries. */
function sameEntries(a: ReadonlyMap<string, unknown>, b: ReadonlyMap<string, unknown>): boolean {
  return a.size === b.size && [...a].every(([d, v]) => b.has(d) && sameWatchPagesJson(v, b.get(d)));
}

/**
 * The five slide maps of a tile both sides hold, merged by direction over
 * the key by key result in `merged`. One direction's entries in all five
 * maps (its action, trigger target, HTTP action target, banner switch and
 * banner seconds) are one unit, so a merge never pairs one side's
 * `httpAction` with the other side's missing target:
 *
 * - Local changed the direction's action since `base`: all five entries are
 *   local's, an entry local has none of included.
 * - Else the server changed it: all five are the server's.
 * - Else neither did, and each entry is local's when local changed it, the
 *   server's otherwise.
 *
 * Each map is then the server's value as it stands when it holds exactly the
 * merged entries, else local's when that one does, else absent when no entry
 * is left, else the entries written up, down, left, right (any other
 * direction after, by name). A map on any side that is not a flat array of
 * distinct directions and values leaves the key by key result alone.
 */
function mergeSlideDirections(merged: JsonObject, base: JsonObject, local: JsonObject, server: JsonObject): void {
  const keys = [...WATCH_PAGES_SLIDE_MAP_KEYS];
  const maps = (side: JsonObject): Map<string, unknown>[] | undefined => {
    const out: Map<string, unknown>[] = [];
    for (const key of keys) {
      const m = slideEntries(own(side, key));
      if (m === undefined) return undefined;
      out.push(m);
    }
    return out;
  };
  const bm = maps(base);
  const lm = maps(local);
  const sm = maps(server);
  if (bm === undefined || lm === undefined || sm === undefined) return;
  const directions = new Set<string>();
  for (const m of [...bm, ...lm, ...sm]) for (const d of m.keys()) directions.add(d);
  if (directions.size === 0) return;

  const actions = keys.indexOf(SLIDE_ACTIONS_KEY);
  const result = keys.map(() => new Map<string, unknown>());
  for (const d of directions) {
    const localMoved = !sameWatchPagesJson(lm[actions]!.get(d), bm[actions]!.get(d));
    const serverMoved = !sameWatchPagesJson(sm[actions]!.get(d), bm[actions]!.get(d));
    keys.forEach((_, i) => {
      const mine = lm[i]!.get(d);
      const picked = localMoved
        ? mine
        : serverMoved
          ? sm[i]!.get(d)
          : sameWatchPagesJson(mine, bm[i]!.get(d)) ? sm[i]!.get(d) : mine;
      if (present(picked) !== undefined) result[i]!.set(d, picked);
    });
  }
  keys.forEach((key, i) => {
    const entries = result[i]!;
    if (sameEntries(entries, sm[i]!)) setOrRemove(merged, key, present(own(server, key)));
    else if (sameEntries(entries, lm[i]!)) setOrRemove(merged, key, present(own(local, key)));
    else setOrRemove(merged, key, entries.size === 0 ? undefined : writeSlidePairs(entries));
  });
}

/** Entries as the flat array the phone writes: up, down, left, right, then
 * any other direction by name. */
function writeSlidePairs(pairs: Map<string, unknown>): unknown[] {
  const order = [...SLIDE_DIRECTION_ORDER.filter((d) => pairs.has(d)), ...[...pairs.keys()].filter((d) => !SLIDE_DIRECTION_ORDER.includes(d)).sort()];
  return order.flatMap((d) => [d, pairs.get(d)]);
}

// ── shape check ──────────────────────────────────────────────────────────

/** A page as a problem names it: its place, counted from 1, and its name
 * when it has one. */
function pageLabel(index: number, page: unknown): string {
  const name = isJsonObject(page) && typeof page.name === "string" ? page.name.trim() : "";
  return name === "" ? `Page ${index + 1}` : `Page ${index + 1} ("${name}")`;
}

/**
 * The problems that must stop a save, in plain words, or an empty list when
 * there are none. These are the things Home Assistant refuses from the panel:
 *
 * - the document is not an object, or `pages` is not a list;
 * - a page is not an object, or has no non-empty string `id`;
 * - two pages share an id;
 * - a page's `items` is present and not a list;
 * - a tile is not an object, or lacks a non-empty string `id` or `entityId`;
 * - two tiles in one page share an id.
 *
 * Ids are compared without regard to case, as the server compares them: the
 * watch reads them as UUIDs, and "ab" and "AB" are one UUID.
 */
export function checkWatchPages(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The page config is not a JSON object."];
  const pages = own(document, PAGES_KEY);
  if (!Array.isArray(pages)) return ["The page config has no list of pages."];
  const problems: string[] = [];
  const pageIds = new Map<string, number>();
  pages.forEach((page: unknown, index) => {
    const label = pageLabel(index, page);
    if (!isJsonObject(page)) {
      problems.push(`${label} is not an object.`);
      return;
    }
    const id = own(page, ID_KEY);
    if (typeof id !== "string" || id === "") {
      problems.push(`${label} has no id.`);
    } else {
      const folded = id.toUpperCase();
      const first = pageIds.get(folded);
      if (first !== undefined) problems.push(`${label} has the same id as ${pageLabel(first, pages[first])}.`);
      else pageIds.set(folded, index);
    }
    if (!Object.hasOwn(page, ITEMS_KEY)) return;
    const items = page[ITEMS_KEY];
    if (!Array.isArray(items)) {
      problems.push(`${label} has tiles that are not a list.`);
      return;
    }
    const tileIds = new Map<string, number>();
    items.forEach((tile: unknown, tileIndex) => {
      const where = `${label}, tile ${tileIndex + 1}`;
      if (!isJsonObject(tile)) {
        problems.push(`${where} is not an object.`);
        return;
      }
      const tileId = own(tile, ID_KEY);
      if (typeof tileId !== "string" || tileId === "") {
        problems.push(`${where} has no id.`);
      } else {
        const folded = tileId.toUpperCase();
        const first = tileIds.get(folded);
        if (first !== undefined) problems.push(`${where} has the same id as tile ${first + 1}.`);
        else tileIds.set(folded, tileIndex);
      }
      const entityId = own(tile, "entityId");
      if (typeof entityId !== "string" || entityId === "") problems.push(`${where} has no entity.`);
    });
  });
  return problems;
}

// ── value check ──────────────────────────────────────────────────────────

/** A key's spec in `page-keys.json`, as far as the value check reads it. */
interface ValueSpec {
  type: string;
  of?: string;
  enum?: string;
  strict?: boolean;
  empty?: boolean;
  ref?: string;
  required?: boolean;
  default?: unknown;
}

const VALUE_TYPES = pageKeys as unknown as {
  enums: Record<string, string[]>;
  types: Record<string, { keys: Record<string, ValueSpec> }>;
};

const HEX = /^#?[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;

/** A UUID as Swift's `UUID(uuidString:)` reads it: 8-4-4-4-12 hex digits,
 * any case. */
const UUID_FORM = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

/** The range of the watch's `Int`, which is 32 bits there (arm64_32). */
const WATCH_INT_MIN = -(2 ** 31);
const WATCH_INT_MAX = 2 ** 31 - 1;

/** The types whose required keys must all be present, even those with a
 * default (`DynamicPageConfig`'s eight keys). */
const EVERY_REQUIRED_KEY_TYPES: ReadonlySet<string> = new Set(["dynamicPage"]);

/** What to do about a smart page rule the panel cannot show (no domain as
 * text, or no object at all), which the Rules card skips and so cannot
 * delete. */
const SKIPPED_RULE_HINT = "Turn Smart page off and on, or delete the rule on the iPhone.";

/** Whether a problem with `key` of a `typeName` object (an element of it
 * when `element`) is one with a rule the Rules card skips. */
function skippedRule(typeName: string, key: string, element: boolean): boolean {
  return (typeName === "domainRule" && key === "domain") || (typeName === "dynamicPage" && key === "rules" && element);
}

/** The color names older documents can hold (`page-keys.json` notes). */
const COLOR_NAMES: ReadonlySet<string> = new Set(["yellow", "blue", "red", "green", "purple", "orange", "white"]);

/** Whether a color is one the phone writes or has written: `#RRGGBB` or
 * `#RRGGBBAA` with or without `#`, a two color gradient, `#RAINBOW`,
 * `#THEME`, an old color name, and `""` only where the key allows empty. */
function colorReadable(value: string, empty: boolean): boolean {
  if (value === "") return empty;
  if (HEX.test(value) || value === "#RAINBOW" || value === "#THEME" || COLOR_NAMES.has(value)) return true;
  const parts = value.split("|");
  return parts.length === 3 && parts[0] === "GRADIENT" && HEX.test(parts[1]!) && HEX.test(parts[2]!);
}

/** What is wrong with one value of a type (`type` is the spec's own type,
 * or its `of` for an element), as words after the key; undefined when the
 * phone reads it. An object of a known kind is checked key by key into
 * `problems`. */
function valueProblem(type: string, spec: ValueSpec, value: unknown, where: string, problems: string[]): string | undefined {
  switch (type) {
    case "bool":
      return typeof value === "boolean" ? undefined : "is not true or false";
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? undefined : "is not a number";
    case "int":
      if (!Number.isInteger(value)) return "is not a whole number";
      return (value as number) >= WATCH_INT_MIN && (value as number) <= WATCH_INT_MAX ? undefined : "is out of range for the watch";
    case "uuid":
      if (typeof value !== "string") return "is not text";
      return UUID_FORM.test(value) ? undefined : `holds ${JSON.stringify(value)}, which is not a UUID`;
    case "string":
    case "symbol":
    case "entity":
      return typeof value === "string" ? undefined : "is not text";
    case "color":
      if (typeof value !== "string") return "is not a color";
      return colorReadable(value, spec.empty === true) ? undefined : `holds the color ${JSON.stringify(value)}`;
    case "enum": {
      if (typeof value !== "string") return "is not text";
      if (spec.strict === false) return undefined;
      const allowed = VALUE_TYPES.enums[spec.enum ?? ""];
      return allowed === undefined || allowed.includes(value) ? undefined : `holds ${JSON.stringify(value)}, which is not one of its choices`;
    }
    case "object":
      if (!isJsonObject(value)) return "is not an object";
      if (spec.ref !== undefined) checkObjectValues(spec.ref, value, where, problems, true);
      return undefined;
    default:
      return undefined;
  }
}

/** Every known key of an object of a `page-keys.json` type, into
 * `problems`. `where` names the object. Lists of pages and tiles are left to
 * `checkWatchPagesValues`, which names their elements. `nested` marks an
 * object reached through a key's `ref` (a music hub preset, a color rule):
 * there a required key with no `default` must be present, as the watch's
 * synthesized decoder needs it. In a smart page's `dynamicConfig` every
 * required key must be present, defaults and all: its decoder is
 * synthesized too, and reads none of them as absent. */
function checkObjectValues(typeName: string, object: JsonObject, where: string, problems: string[], nested = false): void {
  const keys = VALUE_TYPES.types[typeName]?.keys;
  if (keys === undefined) return;
  const everyRequired = EVERY_REQUIRED_KEY_TYPES.has(typeName);
  for (const [key, spec] of Object.entries(keys)) {
    if (key === PAGES_KEY && typeName === "document") continue;
    if (key === ITEMS_KEY && typeName === "page") continue;
    const value = present(own(object, key));
    if (value === undefined) {
      if (nested && spec.required === true && (everyRequired || !Object.hasOwn(spec, "default"))) {
        problems.push(`${where}: ${key} is missing.${skippedRule(typeName, key, false) ? ` ${SKIPPED_RULE_HINT}` : ""}`);
      }
      continue;
    }
    // `part` names an element after the key: ", entry 2".
    const check = (type: string, element: unknown, part: string): boolean => {
      const at = `${where}: ${key}${part}`;
      const problem = valueProblem(type, spec, element, at, problems);
      if (problem !== undefined) problems.push(`${at} ${problem}.${skippedRule(typeName, key, part !== "") ? ` ${SKIPPED_RULE_HINT}` : ""}`);
      return problem === undefined;
    };
    const fail = (problem: string) => problems.push(`${where}: ${key} ${problem}.`);
    if (spec.type === "array") {
      if (!Array.isArray(value)) fail("is not a list");
      else value.every((element, i) => check(spec.of ?? "", element, `, entry ${i + 1}`));
    } else if (spec.type === "map") {
      if (!isJsonObject(value)) fail("is not an object");
      else Object.entries(value).every(([name, element]) => check(spec.of ?? "", element, ` for ${JSON.stringify(name)}`));
    } else if (spec.type === "slideMap") {
      const directions = VALUE_TYPES.enums.SlideDirection ?? [];
      if (!Array.isArray(value) || value.length % 2 !== 0) fail("is not a list of directions and values");
      else for (let i = 0; i < value.length; i += 2) {
        const direction: unknown = value[i];
        if (typeof direction !== "string" || !directions.includes(direction)) {
          fail(`holds the direction ${JSON.stringify(direction)}`);
          break;
        }
        if (!check(spec.of ?? "", value[i + 1], ` for ${direction}`)) break;
      }
    } else {
      check(spec.type, value, "");
    }
  }
}

/** A tile as a problem names it: its place, counted from 1, and its entity. */
function tileLabel(index: number, tile: JsonObject): string {
  const entityId = own(tile, "entityId");
  return typeof entityId === "string" && entityId !== "" ? `tile ${index + 1} (${entityId})` : `tile ${index + 1}`;
}

/**
 * The values that would make the document unreadable on the phone and the
 * watch, in plain words naming the page, the tile and the key, or an empty
 * list. Every key `page-keys.json` knows is checked, at every depth, by its
 * type: a strict enum holds one of its choices, a bool, number or text the
 * same in JSON, a whole number within the watch's 32 bit `Int`, a UUID key
 * in the 8-4-4-4-12 hex form, a color one the phone writes (`""` only where
 * the key says `empty`), each element of a list or map, each direction of a
 * slide map, and inside an object entry (a music hub preset, a smart page's
 * rule) every required key that has no default. A smart page's
 * `dynamicConfig` must hold all eight of its keys, and its rules, their
 * `tileStyle` included, are checked key by key like a tile; a rule the
 * Rules card cannot show says how to get rid of it. Keys it does not
 * know, and `null`, are left alone, as the phone leaves them. Run over the
 * whole document before a save, after `checkWatchPages`.
 */
export function checkWatchPagesValues(document: unknown): string[] {
  if (!isJsonObject(document)) return [];
  const problems: string[] = [];
  checkObjectValues("document", document, "The page config", problems);
  const pages = own(document, PAGES_KEY);
  if (!Array.isArray(pages)) return problems;
  pages.forEach((page: unknown, index) => {
    if (!isJsonObject(page)) return;
    const label = pageLabel(index, page);
    checkObjectValues("page", page, label, problems);
    const items = own(page, ITEMS_KEY);
    if (!Array.isArray(items)) return;
    items.forEach((tile: unknown, tileIndex) => {
      if (isJsonObject(tile)) checkObjectValues("tile", tile, `${label}, ${tileLabel(tileIndex, tile)}`, problems);
    });
  });
  return problems;
}
