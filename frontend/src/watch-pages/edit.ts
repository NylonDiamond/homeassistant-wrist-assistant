// Every page and tile edit of the watch page editor, without any drawing.
//
// Each edit takes the raw document and returns a new one. Only the objects on
// the path to the change are new (the document, `pages`, the page, its
// `items` or `groups`, the tiles that moved); every other object is the very
// one that came in, and every key the panel does not know goes back exactly
// as it was read. An edit that changes nothing returns the document it was
// given, so a caller can tell by reference.
//
// The tile rules are the phone's (`PageEditorView` in the app), ported loop
// for loop with their quirks: `itemAt` takes the first tile in `items` order,
// `findNonOverlappingPosition` scans only rows 0 to 11 in its last step, the
// push down never moves a tile up or sideways. Where the panel does more than
// the phone, the doc comment says so.
//
// System pages are never listed, counted, moved or edited, and keep their
// place in `pages`. Smart pages have no tile edits. Ids are compared without
// regard to case and written in upper case.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3b build contract".

import pageKeys from "./page-keys.json";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_GRID_COLUMNS,
  isJsonObject,
  isSmartWatchPage,
  isSystemWatchPage,
  tileEntityId,
  tileGeometry,
  tileKind,
  tileTarget,
  watchPageName,
  watchPagesOf,
} from "./model.js";

const COLUMNS = WATCH_GRID_COLUMNS;

/** No edit puts a tile's bottom past this row, and the editor draws no more
 * rows than this: the phone's editor stops here too (`maxRenderableRows`),
 * and a bigger number would soon pass the phone's `Int` and hang every loop
 * over cells. A tile stored deeper is read, drawn clamped, resized back and
 * deleted; an edit that would leave any tile it moves past this row is
 * refused, never clamped. */
export const WATCH_EDITOR_MAX_ROWS = 200;

/** Whether a rectangle ends on or above the last row an edit may write. */
function withinPage(rect: WatchRect): boolean {
  return rect.row + rect.rowSpan <= WATCH_EDITOR_MAX_ROWS;
}

/** The phone's four size presets, columns by rows. */
export const WATCH_TILE_SIZE_PRESETS: readonly { name: string; colSpan: number; rowSpan: number }[] = [
  { name: "XSmall", colSpan: 3, rowSpan: 3 },
  { name: "Small", colSpan: 4, rowSpan: 4 },
  { name: "Medium", colSpan: 6, rowSpan: 4 },
  { name: "Large", colSpan: 12, rowSpan: 4 },
];

// ── ids ──────────────────────────────────────────────────────────────────

/** Makes a new id. Whatever it returns is written in upper case. */
export type WatchIdGenerator = () => string;

export interface WatchEditOptions {
  /** Where new ids come from. Defaults to `randomWatchId`. */
  newId?: WatchIdGenerator;
}

/**
 * A random version 4 UUID. `crypto.randomUUID` exists only in a secure
 * context, and a Home Assistant reached over plain http is not one, so there
 * the id is built from `crypto.getRandomValues`, which every context has.
 */
export function randomWatchId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function newIdFrom(options: WatchEditOptions | undefined): string {
  const make = options?.newId ?? randomWatchId;
  return make().toUpperCase();
}

/** An id as it is compared: upper case, or undefined when it is not a
 * string or is empty. */
function idKey(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value.toUpperCase() : undefined;
}

/** Whether two ids are the same id, without regard to case. Two missing ids
 * are not the same id. */
export function sameWatchId(a: unknown, b: unknown): boolean {
  const ka = idKey(a);
  return ka !== undefined && ka === idKey(b);
}

// ── pages ────────────────────────────────────────────────────────────────

interface PageSlot {
  pages: unknown[];
  index: number;
  page: WatchPage;
}

/** The first page with this id, system pages included, with its place. */
function pageSlot(document: WatchPagesDocument, pageId: string): PageSlot | undefined {
  const pages = document.pages;
  const want = idKey(pageId);
  if (!Array.isArray(pages) || want === undefined) return undefined;
  const index = pages.findIndex((p) => isJsonObject(p) && idKey(p.id) === want);
  return index < 0 ? undefined : { pages, index, page: pages[index] as WatchPage };
}

/** A page the page list may edit: found, and not a system page. */
function listedSlot(document: WatchPagesDocument, pageId: string): PageSlot | undefined {
  const slot = pageSlot(document, pageId);
  return slot === undefined || isSystemWatchPage(slot.page) ? undefined : slot;
}

/** A page whose tiles may be edited: listed, and not a smart page. */
function tileSlot(document: WatchPagesDocument, pageId: string): PageSlot | undefined {
  const slot = listedSlot(document, pageId);
  return slot === undefined || isSmartWatchPage(slot.page) ? undefined : slot;
}

/** The document with one page replaced, or the document itself when the
 * page is the one already there. */
function withPage(document: WatchPagesDocument, slot: PageSlot, page: WatchPage): WatchPagesDocument {
  if (page === slot.page) return document;
  const pages = slot.pages.slice();
  pages[slot.index] = page;
  return { ...document, pages };
}

/** The pages a person sees and edits, in watch order: every page but the
 * system pages. Indexes into this list are what the page list shows. */
export function listedWatchPages(document: WatchPagesDocument): WatchPage[] {
  return watchPagesOf(document).filter((p) => !isSystemWatchPage(p));
}

/** The listed page with this id, without regard to case. */
export function findWatchPage(document: WatchPagesDocument, pageId: string): WatchPage | undefined {
  return listedSlot(document, pageId)?.page;
}

const SWIFT_INT_MIN = -(2n ** 63n);
const SWIFT_INT_MAX = 2n ** 63n - 1n;

/** Swift's `Int(text)` on the phone, a 64 bit integer: ASCII digits after an
 * optional sign, nothing else, and nothing outside the 64 bit range. A
 * `bigint`, so a number past 2^53 keeps every digit. */
function swiftInt(text: string): bigint | undefined {
  if (!/^[+-]?[0-9]+$/.test(text)) return undefined;
  const n = BigInt(text);
  return n < SWIFT_INT_MIN || n > SWIFT_INT_MAX ? undefined : n;
}

/**
 * The name a new page gets: `New Page N`, N one more than the highest N among
 * listed pages named exactly `New Page` (which counts as 1) or `New Page `
 * and a number Swift's `Int` reads, else 1. As on the phone, the number may
 * carry a sign (`New Page -3` counts as -3, `New Page +7` as 7). Past the
 * largest 64 bit number the phone would stop with an overflow; the panel
 * writes the next number in full, which the phone then reads as no number.
 */
export function newWatchPageName(document: WatchPagesDocument): string {
  let highest: bigint | undefined;
  for (const page of listedWatchPages(document)) {
    const name = page.name;
    if (typeof name !== "string") continue;
    let n: bigint | undefined;
    if (name === "New Page") n = 1n;
    else if (name.startsWith("New Page ")) n = swiftInt(name.slice("New Page ".length));
    if (n !== undefined && (highest === undefined || n > highest)) highest = n;
  }
  return `New Page ${(highest ?? 0n) + 1n}`;
}

interface PageKeySpec {
  fresh?: boolean;
  new?: unknown;
  default?: unknown;
}

const PAGE_KEYS: Readonly<Record<string, PageKeySpec>> = (
  pageKeys as unknown as { types: { page: { keys: Record<string, PageKeySpec> } } }
).types.page.keys;

/**
 * A new, empty page as the phone writes one: every key marked `fresh` in the
 * `page` type of `page-keys.json`, each with its `new` value, else its
 * `default`, plus `id` (upper case) and `name`. Keys come in sorted order, as
 * the phone encodes them, so the JSON is the phone's to the byte.
 */
export function newWatchPage(id: string, name: string): WatchPage {
  const fields: JsonObject = { id: id.toUpperCase(), name };
  for (const [key, spec] of Object.entries(PAGE_KEYS)) {
    if (spec.fresh !== true || key === "id" || key === "name") continue;
    if (Object.hasOwn(spec, "new")) fields[key] = structuredClone(spec.new);
    else if (Object.hasOwn(spec, "default")) fields[key] = structuredClone(spec.default);
  }
  const sorted: JsonObject = {};
  for (const key of Object.keys(fields).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) sorted[key] = fields[key];
  return sorted;
}

/** Append a new page (`newWatchPage`, named by `newWatchPageName`) after
 * every page, system pages included, as the phone does. It is then the last
 * listed page. */
export function addWatchPage(document: WatchPagesDocument, options?: WatchEditOptions): WatchPagesDocument {
  const page = newWatchPage(newIdFrom(options), newWatchPageName(document));
  const pages = Array.isArray(document.pages) ? document.pages : [];
  return { ...document, pages: [...pages, page] };
}

export interface WatchPageDeleteOptions extends WatchEditOptions {
  /** Also remove every `page.<id>` and `show_page.<id>` tile on the other
   * listed pages (smart pages aside), then repair the groups those tiles
   * were in. The phone removes nothing; the panel offers it. */
  removeLinks?: boolean;
}

/** Remove a listed page. Nothing else changes unless `removeLinks` is set;
 * the behavior document is never written. */
export function deleteWatchPage(
  document: WatchPagesDocument,
  pageId: string,
  options?: WatchPageDeleteOptions,
): WatchPagesDocument {
  const slot = listedSlot(document, pageId);
  if (slot === undefined) return document;
  const target = idKey(slot.page.id)!;
  let pages = slot.pages.filter((_, i) => i !== slot.index);
  if (options?.removeLinks === true) {
    pages = pages.map((p) => {
      if (!isJsonObject(p) || isSystemWatchPage(p) || isSmartWatchPage(p)) return p;
      const work = openWork(p);
      const removed = removeTiles(work, (t) => linkTarget(t.tile) === target);
      if (removed.length === 0) return p;
      repairGroups(work, groupKeysOf(removed), options);
      return closeWork(work);
    });
  }
  return { ...document, pages };
}

/** Rename a listed page to the trimmed name. A blank name, or the name it
 * already has, changes nothing. (The phone does not trim.) */
export function setWatchPageName(document: WatchPagesDocument, pageId: string, name: string): WatchPagesDocument {
  const clean = name.trim();
  const slot = listedSlot(document, pageId);
  if (slot === undefined || clean === "" || slot.page.name === clean) return document;
  return withPage(document, slot, { ...slot.page, name: clean });
}

/**
 * Move a listed page to `toIndex` among the listed pages (clamped to the
 * list). The listed pages take one another's places in `pages`; a system page,
 * or anything in `pages` that is not a page, keeps its own place.
 */
export function moveWatchPage(document: WatchPagesDocument, pageId: string, toIndex: number): WatchPagesDocument {
  const pages = document.pages;
  const want = idKey(pageId);
  if (!Array.isArray(pages) || want === undefined || !Number.isFinite(toIndex)) return document;
  const slots: number[] = [];
  pages.forEach((p, i) => {
    if (isJsonObject(p) && !isSystemWatchPage(p)) slots.push(i);
  });
  const from = slots.findIndex((i) => idKey((pages[i] as JsonObject).id) === want);
  if (from < 0) return document;
  const to = Math.max(0, Math.min(slots.length - 1, Math.trunc(toIndex)));
  if (to === from) return document;
  const listed = slots.map((i) => pages[i]);
  const [moved] = listed.splice(from, 1);
  listed.splice(to, 0, moved);
  const next = pages.slice();
  slots.forEach((slot, k) => {
    next[slot] = listed[k];
  });
  return { ...document, pages: next };
}

/** Hide or show a listed page (`isHidden`). An absent key reads as shown. */
export function setWatchPageHidden(document: WatchPagesDocument, pageId: string, hidden: boolean): WatchPagesDocument {
  const slot = listedSlot(document, pageId);
  if (slot === undefined || (slot.page.isHidden === true) === hidden) return document;
  return withPage(document, slot, { ...slot.page, isHidden: hidden });
}

export interface WatchPageLinkTile {
  /** The page the tile is on, its id as stored, and its name. */
  pageId: string;
  pageName: string;
  tileId: string;
  kind: "page" | "show_page";
}

export interface WatchPageLinks {
  /** `page.<id>` and `show_page.<id>` tiles on the other listed pages (smart
   * pages aside), in page and tile order. */
  tiles: WatchPageLinkTile[];
  /** The behavior document's `roomQuickJumpFallbackPageId` is this page. */
  roomFallback: boolean;
  /** The keys of `roomQuickJumpMappings` whose value is this page. */
  roomMappingKeys: string[];
}

/** The page a `page.` or `show_page.` tile points at, as an id key. */
function linkTarget(tile: WatchPageTile): string | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  return kind === "page" || kind === "show_page" ? idKey(tileTarget(entityId)) : undefined;
}

/**
 * What points at a page: the tiles that open it, and, given the separate
 * `behavior` document, the room quick jump fallback and mappings. The tiles
 * listed are exactly the ones `deleteWatchPage` removes with `removeLinks`.
 * Ids are compared without regard to case; the behavior values are trimmed
 * first, as the watch reads them.
 */
export function watchPageLinks(
  document: WatchPagesDocument,
  pageId: string,
  behavior?: Readonly<Record<string, unknown>>,
): WatchPageLinks {
  const target = idKey(pageId);
  const out: WatchPageLinks = { tiles: [], roomFallback: false, roomMappingKeys: [] };
  if (target === undefined) return out;
  for (const page of listedWatchPages(document)) {
    if (idKey(page.id) === target || isSmartWatchPage(page)) continue;
    for (const tile of workTilesOf(page)) {
      if (linkTarget(tile) !== target) continue;
      out.tiles.push({
        pageId: typeof page.id === "string" ? page.id : "",
        pageName: watchPageName(page),
        tileId: typeof tile.id === "string" ? tile.id : "",
        kind: tileKind(tileEntityId(tile)) as "page" | "show_page",
      });
    }
  }
  if (behavior !== undefined) {
    const fallback = behavior.roomQuickJumpFallbackPageId;
    out.roomFallback = typeof fallback === "string" && idKey(fallback.trim()) === target;
    const mappings = behavior.roomQuickJumpMappings;
    if (isJsonObject(mappings)) {
      for (const [key, value] of Object.entries(mappings)) {
        if (typeof value === "string" && idKey(value.trim()) === target) out.roomMappingKeys.push(key);
      }
    }
  }
  return out;
}

// ── tile geometry ────────────────────────────────────────────────────────

/** A grid cell. */
export interface WatchCell {
  row: number;
  col: number;
}

/** A tile's place and size in grid units. */
export interface WatchRect {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

/**
 * Where the editor takes a tile to be: `tileGeometry`, then clamped the way
 * the phone clamps every tile when it loads a document (`colSpan` 1 to 12,
 * `gridCol` 0 to `12 - colSpan`, `rowSpan` and `gridRow` from 1 and 0).
 */
export function watchTileRect(tile: WatchPageTile): WatchRect {
  const g = tileGeometry(tile);
  const colSpan = Math.min(COLUMNS, g.colSpan);
  return { col: Math.min(g.col, COLUMNS - colSpan), row: g.row, colSpan, rowSpan: g.rowSpan };
}

function overlaps(a: WatchRect, b: WatchRect): boolean {
  return a.row < b.row + b.rowSpan && a.row + a.rowSpan > b.row && a.col < b.col + b.colSpan && a.col + a.colSpan > b.col;
}

/** One tile while an edit works on it. `key` is its id key, or a key of its
 * own for a tile with no id, so it never equals another tile's. */
interface WorkTile extends WatchRect {
  key: string;
  /** Its place in the page's `items`. */
  index: number;
  tile: WatchPageTile;
  read: WatchRect;
  groupId: string | undefined;
  groupIdChanged: boolean;
}

interface Work {
  page: WatchPage;
  items: unknown[];
  tiles: WorkTile[];
  removed: Set<number>;
  groups: unknown[] | undefined;
  groupsChanged: boolean;
}

function workTilesOf(page: WatchPage): WatchPageTile[] {
  return Array.isArray(page.items) ? page.items.filter(isJsonObject) : [];
}

function openWork(page: WatchPage): Work {
  const items = Array.isArray(page.items) ? page.items : [];
  const tiles: WorkTile[] = [];
  items.forEach((raw, index) => {
    if (!isJsonObject(raw)) return;
    const read = watchTileRect(raw);
    tiles.push({
      ...read,
      read,
      key: idKey(raw.id) ?? `\u0000${index}`,
      index,
      tile: raw,
      groupId: idKey(raw.groupId),
      groupIdChanged: false,
    });
  });
  return {
    page,
    items,
    tiles,
    removed: new Set(),
    groups: Array.isArray(page.groups) ? page.groups.slice() : undefined,
    groupsChanged: false,
  };
}

function moved(t: WorkTile): boolean {
  return t.col !== t.read.col || t.row !== t.read.row || t.colSpan !== t.read.colSpan || t.rowSpan !== t.read.rowSpan;
}

/** Whether the edit moved or sized any tile to end past row 200. Such an
 * edit is refused as a whole. A tile stored that deep and left where it is
 * does not count. */
function movedPastEnd(work: Work): boolean {
  return work.tiles.some((t) => moved(t) && !withinPage(t));
}

/** The page with the work written back: a tile that moved gets all four
 * geometry keys, a tile whose group changed gets `groupId` set or removed.
 * The page itself when nothing changed. */
function closeWork(work: Work): WatchPage {
  const byIndex = new Map(work.tiles.map((t) => [t.index, t]));
  let itemsChanged = work.removed.size > 0;
  const items: unknown[] = [];
  work.items.forEach((raw, index) => {
    if (work.removed.has(index)) return;
    const t = byIndex.get(index);
    const geometry = t !== undefined && moved(t);
    if (t === undefined || (!geometry && !t.groupIdChanged)) {
      items.push(raw);
      return;
    }
    itemsChanged = true;
    let next: JsonObject = geometry
      ? { ...t.tile, gridCol: t.col, gridRow: t.row, colSpan: t.colSpan, rowSpan: t.rowSpan }
      : { ...t.tile };
    if (t.groupIdChanged) {
      if (t.groupId === undefined) {
        const { groupId: _dropped, ...rest } = next;
        next = rest;
      } else {
        next.groupId = t.groupId;
      }
    }
    items.push(next);
  });
  if (!itemsChanged && !work.groupsChanged) return work.page;
  const page: WatchPage = { ...work.page };
  if (itemsChanged) page.items = items;
  if (work.groupsChanged) page.groups = work.groups;
  return page;
}

/** Take out every tile the test picks; returns them. */
function removeTiles(work: Work, pick: (t: WorkTile) => boolean): WorkTile[] {
  const removed = work.tiles.filter(pick);
  if (removed.length === 0) return removed;
  for (const t of removed) work.removed.add(t.index);
  work.tiles = work.tiles.filter((t) => !pick(t));
  return removed;
}

function findTile(work: Work, tileId: string): number {
  const key = idKey(tileId);
  return key === undefined ? -1 : work.tiles.findIndex((t) => t.key === key);
}

// ── the phone's placement rules ──────────────────────────────────────────

/** `itemAt`: the first tile in `items` order that covers the cell. */
function itemAt(tiles: readonly WorkTile[], row: number, col: number): number {
  return tiles.findIndex((t) => row >= t.row && row < t.row + t.rowSpan && col >= t.col && col < t.col + t.colSpan);
}

/** The cells two rectangles share, or undefined when they share none. */
function intersection(a: WatchRect, b: WatchRect): WatchRect | undefined {
  const row = Math.max(a.row, b.row);
  const col = Math.max(a.col, b.col);
  const rowEnd = Math.min(a.row + a.rowSpan, b.row + b.rowSpan);
  const colEnd = Math.min(a.col + a.colSpan, b.col + b.colSpan);
  return row < rowEnd && col < colEnd ? { row, col, rowSpan: rowEnd - row, colSpan: colEnd - col } : undefined;
}

/** The sorted distinct values, for cutting rectangles into blocks whose
 * cells all lie under the same rectangles. */
function cuts(values: readonly number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

/** Whether every cell of `rect` is under one of `covers`. The rectangle is
 * cut at every cover's edges; each block is then wholly under a cover or
 * wholly outside all of them, so one corner per block tells. */
function coveredBy(rect: WatchRect, covers: readonly WatchRect[]): boolean {
  if (covers.length === 0) return false;
  const rows = cuts([rect.row, rect.row + rect.rowSpan, ...covers.flatMap((c) => [c.row, c.row + c.rowSpan])]).filter(
    (r) => r >= rect.row && r <= rect.row + rect.rowSpan,
  );
  const cols = cuts([rect.col, rect.col + rect.colSpan, ...covers.flatMap((c) => [c.col, c.col + c.colSpan])]).filter(
    (c) => c >= rect.col && c <= rect.col + rect.colSpan,
  );
  for (let i = 0; i + 1 < rows.length; i++) {
    for (let j = 0; j + 1 < cols.length; j++) {
      const r = rows[i]!;
      const c = cols[j]!;
      if (!covers.some((k) => r >= k.row && r < k.row + k.rowSpan && c >= k.col && c < k.col + k.colSpan)) return false;
    }
  }
  return true;
}

/**
 * `canPlaceIgnoring` (and `canPlace`, its one id form): inside columns 0 to
 * 12 and row 0 down, and no cell whose first covering tile is another one.
 *
 * The phone asks `itemAt` cell by cell, which costs a step per cell: a tile
 * stored a million rows tall would hang it. This asks the same question of
 * rectangles. A cell's first covering tile is one not excluded exactly when
 * some tile not excluded covers it and no excluded tile before that one in
 * `items` does; so each tile not excluded is checked against the excluded
 * tiles before it, and the answer is the phone's for any page.
 */
function canPlaceIgnoring(
  tiles: readonly WorkTile[],
  colSpan: number,
  rowSpan: number,
  row: number,
  col: number,
  excluding: readonly string[],
): boolean {
  if (col < 0 || row < 0 || col + colSpan > COLUMNS) return false;
  const rect = { row, col, rowSpan, colSpan };
  const covers: WatchRect[] = [];
  for (const t of tiles) {
    const shared = intersection(rect, t);
    if (shared === undefined) continue;
    if (excluding.includes(t.key)) covers.push(shared);
    else if (!coveredBy(shared, covers)) return false;
  }
  return true;
}

/** `findNonOverlappingPosition`: a place for a tile of this size that misses
 * the avoided rectangle and every other tile: right under it, then right
 * above it, then rows 0 to 11 only. In each row the columns go out from the
 * preferred one, left first. A place whose bottom would pass row 200 is
 * passed over (the phone would take it), so the search goes on to the next. */
function findNonOverlappingPosition(
  tiles: readonly WorkTile[],
  rowSpan: number,
  colSpan: number,
  avoid: WatchRect,
  preferredCol: number,
  excluding: readonly string[],
): WatchCell | undefined {
  const valid = (row: number, col: number): boolean => {
    if (!(col >= 0 && col + colSpan <= COLUMNS && row >= 0)) return false;
    if (!withinPage({ row, col, rowSpan, colSpan })) return false;
    return !overlaps(avoid, { row, col, rowSpan, colSpan }) && canPlaceIgnoring(tiles, colSpan, rowSpan, row, col, excluding);
  };
  const colOrder: number[] = [];
  if (colSpan >= COLUMNS) {
    colOrder.push(0);
  } else {
    const pref = Math.max(0, Math.min(preferredCol, COLUMNS - colSpan));
    colOrder.push(pref);
    for (let offset = 1; offset < COLUMNS; offset++) {
      const left = pref - offset;
      const right = pref + offset;
      if (left >= 0 && left + colSpan <= COLUMNS && !colOrder.includes(left)) colOrder.push(left);
      if (right >= 0 && right + colSpan <= COLUMNS && !colOrder.includes(right)) colOrder.push(right);
    }
  }
  const below = avoid.row + avoid.rowSpan;
  for (const col of colOrder) if (valid(below, col)) return { row: below, col };
  const above = avoid.row - rowSpan;
  if (above >= 0) {
    for (const col of colOrder) if (valid(above, col)) return { row: above, col };
  }
  for (let row = 0; row < 12; row++) {
    for (const col of colOrder) if (valid(row, col)) return { row, col };
  }
  return undefined;
}

/** The swap of `finishDrag` (and `performSwapNudge`): the source takes the
 * target's origin, its column pulled in to fit; the target takes the
 * source's old origin when it fits there and misses the source, else the
 * first `findNonOverlappingPosition`. Undefined when the swap is refused,
 * which is when `canSwapTiles` says no, and when either tile would end past
 * row 200. */
function swapPlan(
  tiles: readonly WorkTile[],
  s: WorkTile,
  t: WorkTile,
): { source: WatchCell; target: WatchCell } | undefined {
  const source = { row: Math.max(0, t.row), col: Math.max(0, Math.min(t.col, COLUMNS - s.colSpan)) };
  let target = { row: s.row, col: s.col };
  const excluding = [s.key, t.key];
  const fits = canPlaceIgnoring(tiles, t.colSpan, t.rowSpan, target.row, target.col, excluding);
  const clash = overlaps(
    { ...source, colSpan: s.colSpan, rowSpan: s.rowSpan },
    { ...target, colSpan: t.colSpan, rowSpan: t.rowSpan },
  );
  if (!fits || clash) {
    const found = findNonOverlappingPosition(
      tiles,
      t.rowSpan,
      t.colSpan,
      { ...source, colSpan: s.colSpan, rowSpan: s.rowSpan },
      s.col,
      excluding,
    );
    if (found === undefined) return undefined;
    target = found;
  }
  if (!withinPage({ ...source, colSpan: s.colSpan, rowSpan: s.rowSpan })) return undefined;
  if (!withinPage({ ...target, colSpan: t.colSpan, rowSpan: t.rowSpan })) return undefined;
  if (!canPlaceIgnoring(tiles, s.colSpan, s.rowSpan, source.row, source.col, excluding)) return undefined;
  if (!canPlaceIgnoring(tiles, t.colSpan, t.rowSpan, target.row, target.col, excluding)) return undefined;
  return { source, target };
}

// ── groups ───────────────────────────────────────────────────────────────

/**
 * `findConnectedComponents`: the 4-connected regions of a group's cells,
 * each a list of tile keys, flooded from each tile's origin in `items`
 * order. A cell belongs to the last tile in `items` order that covers it.
 *
 * The phone floods cell by cell, a map entry per cell, which a tile stored a
 * million rows tall would hang. Here the group's area is cut at every tile
 * edge into blocks: every cell of a block has the same owner, and two blocks
 * side by side touch along a whole edge, so flooding the blocks reaches the
 * same owners in the same regions, with the phone's quirks (a tile wholly
 * under later ones owns no cell). The cost depends on the number of tiles,
 * never on their size.
 */
function groupComponents(work: Work, groupKey: string): string[][] {
  const groupTiles = work.tiles.filter((t) => t.groupId === groupKey);
  if (groupTiles.length === 0) return [];
  const rows = cuts(groupTiles.flatMap((t) => [t.row, t.row + t.rowSpan]));
  const cols = cuts(groupTiles.flatMap((t) => [t.col, t.col + t.colSpan]));
  const rowAt = new Map(rows.map((r, i) => [r, i]));
  const colAt = new Map(cols.map((c, i) => [c, i]));
  const width = cols.length - 1;
  const owner: (string | undefined)[] = new Array((rows.length - 1) * width).fill(undefined);
  for (const t of groupTiles) {
    const r1 = rowAt.get(t.row + t.rowSpan)!;
    const c1 = colAt.get(t.col + t.colSpan)!;
    for (let r = rowAt.get(t.row)!; r < r1; r++) {
      for (let c = colAt.get(t.col)!; c < c1; c++) owner[r * width + c] = t.key;
    }
  }
  const components: string[][] = [];
  const visitedTiles = new Set<string>();
  for (const t of groupTiles) {
    if (visitedTiles.has(t.key)) continue;
    const component = new Set<string>();
    const visited = new Set<number>();
    const queue: number[] = [rowAt.get(t.row)! * width + colAt.get(t.col)!];
    for (let head = 0; head < queue.length; head++) {
      const block = queue[head]!;
      if (visited.has(block)) continue;
      const who = owner[block];
      if (who === undefined) continue;
      visited.add(block);
      component.add(who);
      const r = Math.floor(block / width);
      const c = block % width;
      const next: number[] = [];
      if (r > 0) next.push(block - width);
      if (r + 2 < rows.length) next.push(block + width);
      if (c > 0) next.push(block - 1);
      if (c + 1 < width) next.push(block + 1);
      for (const n of next) if (owner[n] !== undefined && !visited.has(n)) queue.push(n);
    }
    for (const key of component) visitedTiles.add(key);
    components.push([...component]);
  }
  return components;
}

function setGroupId(t: WorkTile, groupId: string | undefined): void {
  if (t.groupId === groupId) return;
  t.groupId = groupId;
  t.groupIdChanged = true;
}

function removeGroupEntries(work: Work, groupKey: string): void {
  if (work.groups === undefined) return;
  const kept = work.groups.filter((g) => !(isJsonObject(g) && idKey(g.id) === groupKey));
  if (kept.length === work.groups.length) return;
  work.groups = kept;
  work.groupsChanged = true;
}

/** `dissolveGroup`: every tile leaves the group and the group is removed. */
function dissolveGroup(work: Work, groupKey: string): void {
  for (const t of work.tiles) if (t.groupId === groupKey) setGroupId(t, undefined);
  removeGroupEntries(work, groupKey);
}

function ungroupFirst(work: Work, tileKey: string): void {
  const t = work.tiles.find((x) => x.key === tileKey);
  if (t !== undefined) setGroupId(t, undefined);
}

/** `validateAndRepairGroup`, with one addition: a group no tile is in any
 * more is removed from `groups` (the phone leaves it). */
function repairGroup(work: Work, groupKey: string, options: WatchEditOptions | undefined): void {
  const components = groupComponents(work, groupKey);
  if (components.length === 0) {
    removeGroupEntries(work, groupKey);
    return;
  }
  if (components.length === 1 && components[0]!.length >= 2) return;
  if (components.length === 1 && components[0]!.length === 1) {
    dissolveGroup(work, groupKey);
    return;
  }
  const valid = components.filter((c) => c.length >= 2);
  const singles = components.filter((c) => c.length === 1).flat();
  if (valid.length === 0) {
    dissolveGroup(work, groupKey);
    return;
  }
  if (valid.length === 1) {
    for (const key of singles) ungroupFirst(work, key);
    return;
  }
  // `splitGroup`: the first region keeps the group, each other region gets a
  // copy of it with a new id, single tiles leave. Nothing happens when the
  // group itself is missing from `groups`, as on the phone.
  const original = work.groups?.find((g) => isJsonObject(g) && idKey(g.id) === groupKey);
  if (work.groups === undefined || !isJsonObject(original)) return;
  for (const component of valid.slice(1)) {
    const id = newIdFrom(options);
    work.groups.push({ ...original, id });
    work.groupsChanged = true;
    for (const key of component) {
      const t = work.tiles.find((x) => x.key === key);
      if (t !== undefined) setGroupId(t, id);
    }
  }
  for (const key of singles) ungroupFirst(work, key);
}

function groupKeysOf(tiles: readonly WorkTile[]): string[] {
  const keys: string[] = [];
  for (const t of tiles) if (t.groupId !== undefined && !keys.includes(t.groupId)) keys.push(t.groupId);
  return keys;
}

function repairGroups(work: Work, groupKeys: readonly string[], options: WatchEditOptions | undefined): void {
  for (const key of groupKeys) repairGroup(work, key, options);
}

/** Repair the groups of every tile that moved, before any repair runs. */
function repairMovedGroups(work: Work, options: WatchEditOptions | undefined): void {
  repairGroups(work, groupKeysOf(work.tiles.filter(moved)), options);
}

/**
 * Repair groups on a page by the phone's rule (`validateAndRepairGroup`):
 * one 4-connected region of 2 or more tiles is a valid group; a lone tile
 * leaves its group (the `groupId` key is removed); a second region of 2 or
 * more gets a copy of the group with a new id; a group left with one tile is
 * dissolved, and one with no tile is removed from `groups`. Every tile edit
 * here already runs this for the groups it touched.
 */
export function repairWatchTileGroups(
  document: WatchPagesDocument,
  pageId: string,
  groupIds: readonly string[],
  options?: WatchEditOptions,
): WatchPagesDocument {
  const slot = tileSlot(document, pageId);
  if (slot === undefined) return document;
  const work = openWork(slot.page);
  const keys: string[] = [];
  for (const id of groupIds) {
    const key = idKey(id);
    if (key !== undefined && !keys.includes(key)) keys.push(key);
  }
  repairGroups(work, keys, options);
  return withPage(document, slot, closeWork(work));
}

/** The regions of one group on a page as the repair sees them
 * (`findConnectedComponents`): one list of tile ids (upper case) per
 * region, in the order the repair takes them. For tests and tools. */
export function watchGroupRegions(page: WatchPage, groupId: string): string[][] {
  const key = idKey(groupId);
  return key === undefined ? [] : groupComponents(openWork(page), key);
}

// ── tile queries ─────────────────────────────────────────────────────────

/** The first tile in `items` order that covers the cell, as the phone's
 * `itemAt` finds it. */
export function watchTileAtCell(page: WatchPage, cell: WatchCell): WatchPageTile | undefined {
  const work = openWork(page);
  const at = itemAt(work.tiles, cell.row, cell.col);
  return at < 0 ? undefined : work.tiles[at]!.tile;
}

/**
 * Whether a rectangle may hold a tile (`canPlace` / `canPlaceIgnoring`): whole
 * numbers inside columns 0 to 12 and from row 0 down, spans of 1 or more, and
 * no cell whose first covering tile is one other than `excludingTileIds`.
 * Overlaps already in the page beyond that first tile are not seen, as on
 * the phone.
 */
export function canPlaceWatchTile(page: WatchPage, rect: WatchRect, excludingTileIds: readonly string[] = []): boolean {
  if (![rect.col, rect.row, rect.colSpan, rect.rowSpan].every(Number.isInteger)) return false;
  if (rect.colSpan < 1 || rect.rowSpan < 1) return false;
  const excluding = excludingTileIds.map((id) => idKey(id)).filter((k): k is string => k !== undefined);
  return canPlaceIgnoring(openWork(page).tiles, rect.colSpan, rect.rowSpan, rect.row, rect.col, excluding);
}

/**
 * The first free place for a tile of this size (`findNextAvailablePosition`):
 * rows from 0 down, and in each row columns from 0, the first origin whose
 * every cell is empty. There is always one. Spans are taken as whole numbers,
 * `colSpan` 1 to 12 and `rowSpan` 1 or more.
 *
 * The phone walks every row; only row 0 and the rows just under a tile can
 * be the first free one (a free place one row lower would be free one row
 * higher too, unless a tile ends right there), so only those are tried, and
 * a page with a tile stored far down costs no more than any other.
 */
export function firstFreeWatchCell(page: WatchPage, colSpan: number, rowSpan: number): WatchCell {
  const cs = Math.max(1, Math.min(COLUMNS, Number.isFinite(colSpan) ? Math.trunc(colSpan) : 1));
  const rs = Math.max(1, Number.isFinite(rowSpan) ? Math.trunc(rowSpan) : 1);
  const tiles = openWork(page).tiles;
  for (const row of cuts([0, ...tiles.map((t) => t.row + t.rowSpan)])) {
    for (let col = 0; col + cs <= COLUMNS; col++) {
      const rect = { row, col, rowSpan: rs, colSpan: cs };
      if (!tiles.some((t) => overlaps(rect, t))) return { row, col };
    }
  }
  // The row under the lowest tile is always free; this is never reached.
  return { row: Math.max(0, ...tiles.map((t) => t.row + t.rowSpan)), col: 0 };
}

// ── drop ─────────────────────────────────────────────────────────────────

/**
 * What a drop does.
 *
 * - `move`: the dragged tile goes to `cell`.
 * - `swap`: the dragged tile goes to `cell` and the tile `targetId` to
 *   `targetCell`.
 * - `same`: the target is the tile's own place; nothing changes.
 * - `none`: refused; `cell` is where the tile was aimed (clamped).
 */
export type WatchDropOutcome =
  | { kind: "none"; cell: WatchCell }
  | { kind: "same"; cell: WatchCell }
  | { kind: "move"; cell: WatchCell }
  | { kind: "swap"; cell: WatchCell; targetId: string; targetCell: WatchCell };

type DropPlan = WatchDropOutcome & { target?: number };

function planDrop(tiles: readonly WorkTile[], si: number, cell: WatchCell, pointerTileId: string | undefined): DropPlan {
  const s = tiles[si]!;
  const swapWith = (ti: number): DropPlan | undefined => {
    const t = tiles[ti]!;
    const plan = swapPlan(tiles, s, t);
    if (plan === undefined) return undefined;
    const targetId = typeof t.tile.id === "string" ? t.tile.id : "";
    return { kind: "swap", cell: plan.source, targetId, targetCell: plan.target, target: ti };
  };
  const pointerKey = pointerTileId === undefined ? undefined : idKey(pointerTileId);
  if (pointerKey !== undefined && pointerKey !== s.key) {
    const ti = tiles.findIndex((t) => t.key === pointerKey);
    const swap = ti < 0 ? undefined : swapWith(ti);
    if (swap !== undefined) return swap;
  }
  let row = Number.isFinite(cell.row) ? Math.trunc(cell.row) : s.row;
  let col = Number.isFinite(cell.col) ? Math.trunc(cell.col) : s.col;
  row = Math.max(0, row);
  col = Math.max(0, col);
  col = Math.min(col, COLUMNS - s.colSpan);
  const aimed = { row, col };
  // Below the last row an edit may write: refused, whatever is there.
  if (!withinPage({ ...aimed, colSpan: s.colSpan, rowSpan: s.rowSpan })) return { kind: "none", cell: aimed };
  const at = itemAt(tiles, row, col);
  if (at >= 0 && tiles[at]!.key !== s.key) return swapWith(at) ?? { kind: "none", cell: aimed };
  if (at >= 0 && row === s.row && col === s.col) return { kind: "same", cell: aimed };
  return canPlaceIgnoring(tiles, s.colSpan, s.rowSpan, row, col, [s.key])
    ? { kind: "move", cell: aimed }
    : { kind: "none", cell: aimed };
}

/**
 * What dropping a tile would do, cheap enough for every pointer move. The
 * phone's order (`updateDropTarget`): a tile under the pointer that
 * `canSwapTiles` allows is swapped with. Else the target cell (the dragged
 * tile's top left, clamped to row 0 down and columns 0 to `12 - colSpan`):
 * held by another tile, a swap when allowed, else nothing; the tile's own
 * origin, nothing changes; free for the whole tile, a move; else nothing.
 * Nothing else ever moves on a drop. `none` for a smart or system page or an
 * unknown tile, and for any place that would leave a tile ending past row
 * 200 (the phone does not check).
 */
export function watchDropOutcome(
  page: WatchPage,
  tileId: string,
  cell: WatchCell,
  pointerTileId?: string,
): WatchDropOutcome {
  const work = openWork(page);
  const si = isSystemWatchPage(page) || isSmartWatchPage(page) ? -1 : findTile(work, tileId);
  if (si < 0) return { kind: "none", cell: { row: cell.row, col: cell.col } };
  const { target: _target, ...outcome } = planDrop(work.tiles, si, cell, pointerTileId);
  return outcome;
}

/** Drop a tile: the outcome of `watchDropOutcome`, committed, then the
 * groups of the moved tiles repaired. */
export function dropWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  cell: WatchCell,
  pointerTileId?: string,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const slot = tileSlot(document, pageId);
  if (slot === undefined) return document;
  const work = openWork(slot.page);
  const si = findTile(work, tileId);
  if (si < 0) return document;
  const plan = planDrop(work.tiles, si, cell, pointerTileId);
  const s = work.tiles[si]!;
  if (plan.kind === "move") {
    s.row = plan.cell.row;
    s.col = plan.cell.col;
  } else if (plan.kind === "swap" && plan.target !== undefined) {
    const t = work.tiles[plan.target]!;
    s.row = plan.cell.row;
    s.col = plan.cell.col;
    t.row = plan.targetCell.row;
    t.col = plan.targetCell.col;
  } else {
    return document;
  }
  if (movedPastEnd(work)) return document;
  repairMovedGroups(work, options);
  return withPage(document, slot, closeWork(work));
}

// ── nudge ────────────────────────────────────────────────────────────────

export type WatchNudgeDirection = "up" | "down" | "left" | "right";

function isDivider(t: WorkTile): boolean {
  return tileEntityId(t.tile).startsWith("divider.");
}

/** `performDividerPushInsert`, behind `canDividerPushInsert`. */
function dividerPushInsert(tiles: WorkTile[], di: number, direction: "up" | "down"): void {
  const d = tiles[di]!;
  if (direction === "up") {
    if (!tiles.some((t) => t.key !== d.key && t.row < d.row)) return;
    const dividerRow = d.row;
    const above = tiles.filter((t, i) => i !== di && t.row < dividerRow);
    if (above.length === 0) return;
    const maxTop = Math.max(...above.map((t) => t.row));
    for (const t of above) if (t.row >= maxTop && t.row < dividerRow) t.row += 1;
    d.row = maxTop;
  } else {
    const bottom = d.row + d.rowSpan;
    if (!tiles.some((t) => t.key !== d.key && t.row >= bottom)) return;
    const below = tiles.filter((t, i) => i !== di && t.row >= bottom);
    if (below.length === 0) return;
    const minTop = Math.min(...below.map((t) => t.row));
    const atMinTop = below.filter((t) => t.row === minTop);
    const maxBottom = Math.max(...atMinTop.map((t) => t.row + t.rowSpan));
    for (const t of atMinTop) t.row -= 1;
    d.row = maxBottom - d.rowSpan;
  }
}

function applyNudge(tiles: WorkTile[], si: number, direction: WatchNudgeDirection): void {
  const s = tiles[si]!;
  if (isDivider(s) && s.colSpan === COLUMNS && (direction === "up" || direction === "down")) {
    dividerPushInsert(tiles, si, direction);
    return;
  }
  const row = s.row + (direction === "up" ? -1 : direction === "down" ? 1 : 0);
  const col = s.col + (direction === "left" ? -1 : direction === "right" ? 1 : 0);
  const inBounds = row >= 0 && col >= 0 && col + s.colSpan <= COLUMNS && row + s.rowSpan <= WATCH_EDITOR_MAX_ROWS;
  if (!inBounds) return;
  const candidate = { row, col, colSpan: s.colSpan, rowSpan: s.rowSpan };
  const blockers = tiles.filter((t) => t.key !== s.key && overlaps(candidate, t));
  if (blockers.length === 0) {
    s.row = row;
    s.col = col;
    return;
  }
  if (blockers.length !== 1) return;
  // As on the phone: `canSwapTiles` is asked about the tile in the way, but
  // the swap moves the first tile in `items` with its id, which is another
  // tile when two share an id; that one's own place is what the swap uses.
  const blocker = blockers[0]!;
  if (swapPlan(tiles, s, blocker) === undefined) return;
  const bi = tiles.findIndex((t) => t.key === blocker.key);
  const plan = swapPlan(tiles, s, tiles[bi]!);
  if (plan === undefined) return;
  s.row = plan.source.row;
  s.col = plan.source.col;
  tiles[bi]!.row = plan.target.row;
  tiles[bi]!.col = plan.target.col;
}

/**
 * Move a tile one cell (`nudgeSelectedTile`). A free cell: move. Exactly one
 * tile in the way that `canSwapTiles` allows: the two swap, as a drop swaps.
 * Two or more in the way, outside columns 0 to 12 or row 0, or a bottom past
 * row 200: nothing. A full width header (`divider.`, 12 columns) goes up or
 * down by the phone's push insert instead: up, the tiles that start on the
 * nearest row above move down one and the header takes that row; down, the
 * tiles that start on the nearest row below move up one and the header goes
 * under them. The panel then repairs the groups of every tile that moved
 * (the phone does not).
 */
export function nudgeWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchNudgeDirection,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const slot = tileSlot(document, pageId);
  if (slot === undefined) return document;
  const work = openWork(slot.page);
  const si = findTile(work, tileId);
  if (si < 0) return document;
  applyNudge(work.tiles, si, direction);
  if (movedPastEnd(work)) return document;
  repairMovedGroups(work, options);
  return withPage(document, slot, closeWork(work));
}

/** Whether `nudgeWatchTile` would change anything, for the arrow buttons. */
export function canNudgeWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchNudgeDirection,
): boolean {
  const slot = tileSlot(document, pageId);
  if (slot === undefined) return false;
  const work = openWork(slot.page);
  const si = findTile(work, tileId);
  if (si < 0) return false;
  applyNudge(work.tiles, si, direction);
  return work.tiles.some(moved) && !movedPastEnd(work);
}

// ── resize ───────────────────────────────────────────────────────────────

export type WatchResizeHandle = "left" | "right" | "top" | "bottom" | "bottomRight";

/** Swift's `round`: halves away from zero. */
function roundCells(value: number): number {
  return Number.isFinite(value) ? Math.sign(value) * Math.round(Math.abs(value)) : 0;
}

/**
 * The rectangle a resize handle asks for (`continueResize`), from the
 * rectangle the drag began with and the drag in cells (rounded, halves away
 * from zero). Right and bottom change the span, never below 1. Left and top
 * move the origin and change the span the other way, stopping at column or
 * row 0; pulled past the far edge the span stays 1 and the tile slides, as
 * on the phone. The corner is right and bottom together. Undefined when the
 * result leaves the grid or ends past row 200 (the phone then keeps the last
 * good rectangle).
 */
export function watchResizeHandleRect(
  start: WatchRect,
  handle: WatchResizeHandle,
  delta: { cols: number; rows: number },
): WatchRect | undefined {
  const dx = roundCells(delta.cols);
  const dy = roundCells(delta.rows);
  let { col, row, colSpan, rowSpan } = start;
  if (handle === "right" || handle === "bottomRight") colSpan = Math.max(1, start.colSpan + dx);
  if (handle === "left") {
    col = start.col + dx;
    colSpan = Math.max(1, start.colSpan - dx);
    if (col < 0) {
      colSpan += col;
      col = 0;
    }
  }
  if (handle === "bottom" || handle === "bottomRight") rowSpan = Math.max(1, start.rowSpan + dy);
  if (handle === "top") {
    row = start.row + dy;
    rowSpan = Math.max(1, start.rowSpan - dy);
    if (row < 0) {
      rowSpan += row;
      row = 0;
    }
  }
  const valid = col >= 0 && row >= 0 && col + colSpan <= COLUMNS && colSpan >= 1 && rowSpan >= 1;
  return valid && withinPage({ col, row, colSpan, rowSpan }) ? { col, row, colSpan, rowSpan } : undefined;
}

/** Why a resize was refused before it was tried: a part that is not a
 * number, a span under 1, or a bottom past row 200. */
export type WatchRectRefusal = "number" | "span" | "end";

/** A rectangle made whole: origin 0 or more, at most 12 columns wide (a
 * wider one moves left to fit, as on the phone). Refused, not clamped, when
 * any part is not a number, a span is under 1, or the bottom passes row
 * 200. */
function wholeRect(rect: WatchRect): { rect: WatchRect } | { refused: WatchRectRefusal } {
  if (![rect.col, rect.row, rect.colSpan, rect.rowSpan].every(Number.isFinite)) return { refused: "number" };
  const whole = {
    col: Math.max(0, Math.trunc(rect.col)),
    row: Math.max(0, Math.trunc(rect.row)),
    colSpan: Math.min(COLUMNS, Math.trunc(rect.colSpan)),
    rowSpan: Math.trunc(rect.rowSpan),
  };
  if (whole.colSpan < 1 || whole.rowSpan < 1) return { refused: "span" };
  if (!withinPage(whole)) return { refused: "end" };
  return { rect: whole };
}

/** `resizeItemPushingTilesDown`, from `finishResize` on: the tile takes the
 * rectangle's origin, moves left if it would pass the right edge, every other
 * tile goes back to its baseline place, the tile takes the new size, then
 * the cascading push down. */
function applyResize(tiles: WorkTile[], si: number, rect: WatchRect, baseline: Map<string, WatchCell> | undefined): void {
  const item = tiles[si]!;
  item.col = rect.col;
  item.row = rect.row;
  const cols = Math.min(rect.colSpan, COLUMNS);
  const maxCol = COLUMNS - cols;
  if (item.col > maxCol) item.col = Math.max(0, maxCol);
  if (baseline !== undefined && baseline.size > 0) {
    for (const t of tiles) {
      const original = baseline.get(t.key);
      if (original !== undefined && t.key !== item.key) {
        t.row = original.row;
        t.col = original.col;
      }
    }
  }
  item.colSpan = cols;
  item.rowSpan = rect.rowSpan;

  // Pass after pass until nothing moves (at most n * n passes). Each pass
  // sorts by row once (a stable sort, ties in `items` order); each pusher is
  // read once, each pushed tile afresh. Only a tile starting at or below the
  // pusher is pushed, only down, and never the resized tile.
  const maxIterations = tiles.length * tiles.length;
  for (let iterations = 0; iterations < maxIterations; iterations++) {
    let madeChange = false;
    const order = tiles.map((_, i) => i).sort((a, b) => tiles[a]!.row - tiles[b]!.row);
    for (const pi of order) {
      const p = tiles[pi]!;
      const pusher = { col: p.col, row: p.row, colSpan: p.colSpan, rowSpan: p.rowSpan };
      for (const qi of order) {
        if (pi === qi || qi === si) continue;
        const pushed = tiles[qi]!;
        if (pushed.row < pusher.row) continue;
        if (overlaps(pusher, pushed)) {
          const amount = Math.max(0, pusher.row + pusher.rowSpan - pushed.row);
          if (amount > 0) {
            pushed.row += amount;
            madeChange = true;
          }
        }
      }
    }
    if (!madeChange) break;
  }
}

/** Each tile's place by id, as the phone fills `resizeOriginalPositions`: in
 * `items` order, so of two tiles with one id the later one's place wins, and
 * both go back to it. */
function baselineOf(page: WatchPage | undefined): Map<string, WatchCell> | undefined {
  if (page === undefined) return undefined;
  const map = new Map<string, WatchCell>();
  for (const t of openWork(page).tiles) map.set(t.key, { row: t.row, col: t.col });
  return map;
}

export interface WatchResizePreview {
  /** The page as the resize would leave it, groups untouched. */
  page: WatchPage;
  /** Where the resized tile ends up (moved left when it passed the edge). */
  rect: WatchRect;
  /** The resized tile still overlaps another tile: the push down never moves
   * a tile that starts above it. The panel refuses such a resize. */
  overlaps: boolean;
  /** Why the resize is refused before anything moves (`page` is then the
   * page as it was), or `end` when the push down would leave a tile ending
   * past row 200. Undefined for a resize that may be made. */
  refused?: WatchRectRefusal;
}

/**
 * A resize, without committing it: cheap enough for every pointer move. The
 * tile takes `rect` (made whole, moved left if it passes the right edge);
 * every other tile goes back to where it is in `baseline` (the page when the
 * gesture, or the size card, began), so shrinking again brings pushed tiles
 * back; then every tile it now overlaps that starts at or below another is
 * pushed down, cascading. Without a baseline the tiles start where `page`
 * has them. A smart or system page, or an unknown tile, comes back as it is.
 */
export function previewWatchTileResize(
  page: WatchPage,
  tileId: string,
  rect: WatchRect,
  baseline?: WatchPage,
): WatchResizePreview {
  const work = openWork(page);
  const si = isSystemWatchPage(page) || isSmartWatchPage(page) ? -1 : findTile(work, tileId);
  const whole = wholeRect(rect);
  if (si < 0 || "refused" in whole) {
    const t = si < 0 ? undefined : work.tiles[si]!;
    const refused = "refused" in whole ? whole.refused : undefined;
    return { page, rect: t === undefined ? { ...rect } : { ...t.read }, overlaps: false, ...(refused === undefined ? {} : { refused }) };
  }
  applyResize(work.tiles, si, whole.rect, baselineOf(baseline));
  const item = work.tiles[si]!;
  const result: WatchRect = { col: item.col, row: item.row, colSpan: item.colSpan, rowSpan: item.rowSpan };
  return {
    page: closeWork(work),
    rect: result,
    overlaps: work.tiles.some((t, i) => i !== si && overlaps(result, t)),
    ...(movedPastEnd(work) ? { refused: "end" as const } : {}),
  };
}

export interface WatchResizeOptions extends WatchEditOptions {
  /** The page when the gesture, or the size card, began. */
  baseline?: WatchPage;
  /** Tiles the resized tile may still overlap: ones it overlapped before the
   * edit, which the edit did not cause. */
  keepOverlapsWith?: readonly string[];
}

/** Commit a resize as `previewWatchTileResize` computes it, then repair the
 * groups of every tile that moved or changed size. Refused (the document
 * comes back as it is) when the preview says `refused`, and when the resized
 * tile would still overlap another (one of `keepOverlapsWith` aside). */
export function resizeWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  rect: WatchRect,
  options?: WatchResizeOptions,
): WatchPagesDocument {
  const slot = tileSlot(document, pageId);
  const whole = wholeRect(rect);
  if (slot === undefined || "refused" in whole) return document;
  const work = openWork(slot.page);
  const si = findTile(work, tileId);
  if (si < 0) return document;
  applyResize(work.tiles, si, whole.rect, baselineOf(options?.baseline));
  const item = work.tiles[si]!;
  const kept = new Set((options?.keepOverlapsWith ?? []).map((id) => idKey(id)).filter((k): k is string => k !== undefined));
  if (work.tiles.some((t, i) => i !== si && !kept.has(t.key) && overlaps(item, t))) return document;
  if (movedPastEnd(work)) return document;
  repairMovedGroups(work, options);
  return withPage(document, slot, closeWork(work));
}

// ── delete ───────────────────────────────────────────────────────────────

/** Remove a tile (every tile with that id, as the phone's `removeAll`).
 * Nothing closes the gap. The groups it was in are repaired. */
export function deleteWatchTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const slot = tileSlot(document, pageId);
  const key = idKey(tileId);
  if (slot === undefined || key === undefined) return document;
  const work = openWork(slot.page);
  const removed = removeTiles(work, (t) => t.key === key);
  if (removed.length === 0) return document;
  repairGroups(work, groupKeysOf(removed), options);
  return withPage(document, slot, closeWork(work));
}
