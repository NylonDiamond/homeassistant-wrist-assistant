// Several tiles picked together (Shift or Cmd-click on the stage), edited at
// once in the tile inspector. Two small rules, kept apart from the drawing so
// they can be tested:
//
// - What a setting shows: the value the picked tiles share, or Mixed when
//   they differ (`pickedValue`).
// - What a pick writes: the same edit the setting makes on one tile, made on
//   each picked tile in turn, as one document and so one undo step
//   (`editPickedTiles`). The settings' edits are written for one tile and read
//   the host's `tileId` and `tile` when they run; `acrossPicked` runs each
//   with the host pointed at one picked tile (`TilePick.as`).
//
// An edit that reaches past its own tile on any step (it wrote another tile,
// the page, or started from a document other than the one it was handed) is
// refused whole: the document comes back as it was. That keeps an edit that
// cannot be made per tile from writing the primary tile's value over the
// others; the inspector hides such settings while several tiles are picked.

import type { TileSettingsHost } from "./editor-host.js";
import { findWatchPage, sameWatchId } from "./edit.js";
import type { WatchPageTile, WatchPagesDocument } from "./model.js";

/** What a setting shows for the picked tiles: the one value they share, or
 * Mixed. */
export type PickedValue<V> = { mixed: false; value: V } | { mixed: true };

/** Two values the same as the inspector reads them: the same, or the same
 * JSON (a glow, a list of rows). */
function sameReading(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * The value `read` gives every tile, or Mixed when two tiles read
 * differently. No tiles reads as Mixed: there is nothing to show.
 */
export function pickedValue<V>(tiles: readonly WatchPageTile[], read: (tile: WatchPageTile) => V, same: (a: V, b: V) => boolean = sameReading): PickedValue<V> {
  if (tiles.length === 0) return { mixed: true };
  const value = read(tiles[0]!);
  for (let i = 1; i < tiles.length; i += 1) if (!same(value, read(tiles[i]!))) return { mixed: true };
  return { mixed: false, value };
}

/**
 * Whether `after` is `before` with nothing changed but the tile `tileId` on
 * page `pageId`: every other key of the document, every other page, every
 * other key of that page and every other tile on it the same object.
 */
export function onlyTileChanged(before: WatchPagesDocument, after: WatchPagesDocument, pageId: string, tileId: string): boolean {
  if (after === before) return true;
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of keys) if (key !== "pages" && before[key] !== after[key]) return false;
  const a = Array.isArray(before.pages) ? before.pages : [];
  const b = Array.isArray(after.pages) ? after.pages : [];
  if (a.length !== b.length) return false;
  const page = findWatchPage(before, pageId);
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] === b[i]) continue;
    if (a[i] !== page) return false;
    const was = a[i] as Record<string, unknown>;
    const now = b[i] as Record<string, unknown>;
    for (const key of new Set([...Object.keys(was), ...Object.keys(now)])) if (key !== "items" && was[key] !== now[key]) return false;
    const items = Array.isArray(was.items) ? was.items : [];
    const next = Array.isArray(now.items) ? now.items : [];
    if (items.length !== next.length) return false;
    for (let j = 0; j < items.length; j += 1) {
      if (items[j] === next[j]) continue;
      const id = (items[j] as { id?: unknown } | null)?.id;
      if (!sameWatchId(id, tileId) || !sameWatchId((next[j] as { id?: unknown } | null)?.id, tileId)) return false;
    }
  }
  return true;
}

/**
 * `editOne` made on each tile of `ids` in turn, each starting from what the
 * one before left: one document, so the draft takes it as one undo step. A
 * step that changes anything but its own tile refuses the whole edit, and the
 * document comes back unchanged (`onlyTileChanged`).
 */
export function editPickedTiles(
  document: WatchPagesDocument,
  pageId: string,
  ids: readonly string[],
  editOne: (document: WatchPagesDocument, tileId: string) => WatchPagesDocument,
): WatchPagesDocument {
  let next = document;
  for (const id of ids) {
    const step = editOne(next, id);
    if (!onlyTileChanged(next, step, pageId, id)) return document;
    next = step;
  }
  return next;
}

/**
 * An edit written for the host's tile, made on every picked tile while
 * several are picked (`editPickedTiles`, each step run with the host pointed
 * at that tile), else the edit itself.
 */
export function acrossPicked(
  host: Pick<TileSettingsHost, "picked" | "pageId">,
  make: (document: WatchPagesDocument) => WatchPagesDocument,
): (document: WatchPagesDocument) => WatchPagesDocument {
  const pick = host.picked;
  if (pick === undefined) return make;
  return (document) => editPickedTiles(document, host.pageId, pick.ids, (d, id) => pick.as(id, () => make(d)));
}

/** Whether the picked tiles read differently through `read`; never with one
 * tile. */
export function pickedMixed(host: Pick<TileSettingsHost, "picked">, read: (tile: WatchPageTile) => unknown): boolean {
  const pick = host.picked;
  return pick !== undefined && pickedValue(pick.tiles, read).mixed;
}

/** Whether `test` holds with the host pointed at every picked tile in turn,
 * or at its one tile. */
export function everyPicked(host: Pick<TileSettingsHost, "picked">, test: () => boolean): boolean {
  const pick = host.picked;
  if (pick === undefined) return test();
  return pick.ids.every((id) => pick.as(id, test));
}

/** Whether `test` holds with the host pointed at any picked tile, or at its
 * one tile. */
export function somePicked(host: Pick<TileSettingsHost, "picked">, test: () => boolean): boolean {
  const pick = host.picked;
  if (pick === undefined) return test();
  return pick.ids.some((id) => pick.as(id, test));
}

/** The first answer `ask` gives with the host pointed at each picked tile in
 * turn (a refusal, a reason), or its one tile's. */
export function firstPicked<T>(host: Pick<TileSettingsHost, "picked">, ask: () => T | undefined): T | undefined {
  const pick = host.picked;
  if (pick === undefined) return ask();
  for (const id of pick.ids) {
    const answer = pick.as(id, ask);
    if (answer !== undefined) return answer;
  }
  return undefined;
}

/** The word a setting shows while the picked tiles differ. */
export const MIXED_WORD = "Mixed";
