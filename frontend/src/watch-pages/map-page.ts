// Map pages (app repo docs/home_map_plan_2026-10.md, "Map page"), without
// any drawing: a page whose `mapPage` is true and that holds one Home map
// tile and nothing else. The iPhone draws the whole page as that tile's floor
// (or room) as a live 3D map; the watch, and an app that does not know the
// key, draw the page's grid with that one tile, so the tile is the fallback.
//
// What the panel needs of it: a new map page for the New page dialog, the
// Map page switch of the page's On the iPhone card (on keeps the first Home
// map tile, or adds one on the map's first floor, and removes every other
// tile; off keeps the tile and drops the key), how many tiles a switch on
// would remove, and the words. The rule itself (`isMapWatchPage`) and the
// key are in `model.ts`, beside the smart page's. A map page's tile is never
// moved, resized or removed on the stage (`edit.ts` refuses it) and nothing
// is added to it (`watchAddRefusal`); its keys change only through the
// page's Map card.

import { homeMapFloorsWithRooms, type HomeMapDocument } from "../home-map/model.js";
import { type WatchEditOptions, findWatchPage, newWatchPage, randomWatchId } from "./edit.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_GRID_COLUMNS,
  WATCH_MAP_PAGE_KEY,
  isMapWatchPage,
  isSmartWatchPage,
  isSystemWatchPage,
  watchMapPageTile,
  watchPageTiles,
} from "./model.js";
import { newWatchHomeMapTile } from "./tile-new.js";
import { withField } from "./tile-settings-model.js";

/** The words a map page is shown with, in one place. */
export const WATCH_MAP_PAGE_WORDS = {
  /** The breadcrumb chip, the page picker's line and the library's. */
  kind: "Map page",
  /** The New page dialog's card. */
  newNote: "The whole page is your home's live map on the iPhone.",
  plainNote: "Tiles you place yourself.",
  /** Why the New page dialog's card, and the switch, cannot be picked. */
  noMap: "Scan a room in the iPhone app first.",
  /** The line under the Map page switch. */
  switchDetail: "On the iPhone the whole page is your home's live 3D map. The watch shows the Home map tile.",
  /** The switch's question on a page with other tiles. */
  askTitle: "Make this a map page?",
  ask: (n: number) => `This removes ${n === 1 ? "1 tile" : `${n} tiles`}. A map page holds only its Home map tile. Undo brings ${n === 1 ? "it" : "them"} back.`,
  askConfirm: "Make map page",
  /** The stage's status line and the inspector's line on a map page. */
  stage: "A map page holds only its Home map tile. Its floor, room and look are in the Map card.",
  /** The Map card's note over the tile's look keys. */
  watchNote: "The watch, and an iPhone app before map pages, draw the Home map tile in this look.",
  /** The Map card's line on the iPhone. */
  phoneNote: "The iPhone draws this floor or room as a live 3D map over the whole page: tap a device to run it, hold it for its controls, tap a room for its devices, two fingers to move and turn.",
  /** The lines under each preview with Side by side. */
  watchDifference: "The watch shows the Home map tile.",
  phoneDifference: "The whole page is the live 3D map.",
} as const;

/** The floor a new map page, or a map page made from a page with no Home
 * map tile, shows: the map's first floor with a room. Undefined without a
 * map, or with no floor that has one. */
export function watchMapPageFloorId(doc: HomeMapDocument | null | undefined): string | undefined {
  return homeMapFloorsWithRooms(doc)[0]?.id;
}

/** Why the map has nothing a map page can show, or undefined when it has. */
export function watchMapPageRefusal(doc: HomeMapDocument | null | undefined): string | undefined {
  return watchMapPageFloorId(doc) === undefined ? WATCH_MAP_PAGE_WORDS.noMap : undefined;
}

/** The kept Home map tile as a map page holds it: at the grid's top left,
 * across the whole width, out of any group. Its height and every other key
 * stay. */
function placedMapTile(tile: WatchPageTile): WatchPageTile {
  let next: WatchPageTile = tile;
  const set = (key: string, value: unknown) => {
    if (next[key] !== value) next = withField(next, key, value);
  };
  set("gridCol", 0);
  set("gridRow", 0);
  set("colSpan", WATCH_GRID_COLUMNS);
  if (Object.hasOwn(next, "groupId")) {
    const { groupId: _dropped, ...rest } = next;
    next = rest;
  }
  return next;
}

/**
 * A new map page: `newWatchPage` with `mapPage` true and one Home map tile
 * on the floor, across the whole width at the top (the tile's own height).
 * The tile's id comes from `options`, as every new id does.
 */
export function newMapWatchPage(id: string, name: string, floorId: string, options?: WatchEditOptions): WatchPage {
  const tile = newWatchHomeMapTile({ id: floorId }, { newId: options?.newId ?? randomWatchId });
  const page = withField(newWatchPage(id, name), WATCH_MAP_PAGE_KEY, true);
  return { ...page, items: [placedMapTile(tile)] };
}

/** The listed page with this id that may be made a map page or a normal
 * one again: found, and no system page or smart page. */
function switchablePage(document: WatchPagesDocument, pageId: string): WatchPage | undefined {
  const page = findWatchPage(document, pageId);
  return page === undefined || isSystemWatchPage(page) || isSmartWatchPage(page) ? undefined : page;
}

/** How many tiles the Map page switch would remove: every tile but the
 * first Home map tile. Undefined for a page that cannot be switched, or one
 * that is a map page already. */
export function watchMapPageRemovedCount(document: WatchPagesDocument, pageId: string): number | undefined {
  const page = switchablePage(document, pageId);
  if (page === undefined || isMapWatchPage(page)) return undefined;
  const kept = watchMapPageTile(page);
  return watchPageTiles(page).filter((t) => t !== kept).length;
}

/** The document with one page replaced. */
function replacePage(document: WatchPagesDocument, page: WatchPage, next: WatchPage): WatchPagesDocument {
  if (next === page || !Array.isArray(document.pages)) return document;
  const pages = document.pages.slice();
  pages[pages.indexOf(page)] = next;
  return { ...document, pages };
}

/**
 * The Map page switch. On: the page keeps its first Home map tile (or gets
 * a new one on `floorId`, refused without it), placed at the top across the
 * whole width and out of any group, every other tile and every group goes,
 * and `mapPage` is written true. Off: `mapPage` goes and the tile stays, so
 * the page is a normal page with that one tile. A system page, a smart page,
 * a page that is already what was asked, or a page with no Home map tile
 * and no floor to add one on changes nothing.
 */
export function setWatchMapPage(
  document: WatchPagesDocument,
  pageId: string,
  on: boolean,
  floorId?: string,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const page = switchablePage(document, pageId);
  if (page === undefined || typeof on !== "boolean") return document;
  if (!on) {
    if (!Object.hasOwn(page, WATCH_MAP_PAGE_KEY)) return document;
    const { [WATCH_MAP_PAGE_KEY]: _dropped, ...rest } = page;
    return replacePage(document, page, rest);
  }
  const found = watchMapPageTile(page);
  if (found === undefined && (typeof floorId !== "string" || floorId === "")) return document;
  const tile = found ?? newWatchHomeMapTile({ id: floorId! }, { newId: options?.newId ?? randomWatchId });
  const placed = placedMapTile(tile);
  const items = watchPageTiles(page);
  let next: JsonObject = page;
  if (!(items.length === 1 && items[0] === placed && Array.isArray(page.items) && page.items.length === 1)) {
    next = { ...next, items: [placed] };
  }
  if (Array.isArray(page.groups) && page.groups.length > 0) next = { ...next, groups: [] };
  if (next[WATCH_MAP_PAGE_KEY] !== true) next = withField(next, WATCH_MAP_PAGE_KEY, true);
  return next === page ? document : replacePage(document, page, next as WatchPage);
}
