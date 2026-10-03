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
 * - Every other value is one value, however deep: a page's `groups` and
 *   `dynamicConfig`, a tile's arrays.
 * - A tile's hold and slide keys merge one direction at a time, each
 *   direction's action, targets and banner settings as one unit
 *   (`mergeSlideDirections`).
 * - A page or tile one side deleted is gone when the other side left it as it
 *   was in `base`, and stays, as the other side has it, when that side
 *   changed it.
 * - Order, for the pages and for the tiles of each page on their own: local
 *   reordered a list when the elements it shares with `base` (same `id` in
 *   both) come in another order than in `base`; adding and deleting alone is
 *   no reorder. When it did not, the order is the server's, and what only
 *   local holds (added there, or kept because local changed what the server
 *   deleted) follows in local's order. When it did, the order is local's, and
 *   what only the server holds follows in the server's order. Order never
 *   decides which elements stay or how their keys merge.
 * - A page or tile both sides added under one id merges key by key against
 *   nothing, so local's keys win and the server's others stay.
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
  setOrRemove(merged, PAGES_KEY, mergeList(own(from, PAGES_KEY), own(local, PAGES_KEY), own(server, PAGES_KEY), ITEMS_KEY));
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

/**
 * One list of id'd objects, three ways. `childListKey` names the list inside
 * each element that is matched the same way (the tiles of a page); undefined
 * for the innermost list. Undefined back means the key is absent.
 */
function mergeList(base: unknown, local: unknown, server: unknown, childListKey: string | undefined): unknown {
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
    mergeElement(baseById.get(id) ?? {}, localElement, serverElement, childListKey);
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

/** One page or tile held by both sides: each key as `mergeWatchPagesByKey`
 * picks it, with slide maps compared as sets, except `childListKey`, which is
 * matched again. */
function mergeElement(
  base: JsonObject,
  local: JsonObject,
  server: JsonObject,
  childListKey: string | undefined,
): JsonObject {
  const merged = pickByKey(base, local, server, sameKeyValue);
  if (childListKey !== undefined) {
    setOrRemove(
      merged,
      childListKey,
      mergeList(own(base, childListKey), own(local, childListKey), own(server, childListKey), undefined),
    );
  } else {
    mergeSlideDirections(merged, base, local, server);
  }
  return shareWhole(merged, server, local);
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
