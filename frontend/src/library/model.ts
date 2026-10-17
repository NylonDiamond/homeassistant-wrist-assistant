// The library as the tabs and the editors read it, worked out from one
// `library/summary` reply and nothing else: every page, status page and menu
// once, with the devices that pick it, and each device's picks in its own
// order with what it hides.
//
// Pure: no element, no Home Assistant. The summary is the one source of
// which device has what. Ids are compared ignoring case, as the server
// compares them; owner ids too, as the device colors do.
// Plan: app repo docs/one_library_plan_2026-10.md, steps 2 to 4.

import type { LinkDevice } from "../watch-pages/devices.js";
import { joinWords } from "../watch-pages/devices.js";
import type { MenusDocument } from "../watch-menus/model.js";
import { type WatchPage, type WatchPagesDocument, isSmartWatchPage, watchPageName, watchPageTiles } from "../watch-pages/model.js";
import { isSystemStatusPage, statusPageName, statusPageRows } from "../watch-status-pages/model.js";
import type { LibraryKind, LibraryListKind, LibraryObject, LibraryOwnerPicks, LibrarySummary, MenuUnit } from "./client.js";

/** One page or one status page of the library. */
export interface LibraryItem {
  kind: LibraryListKind;
  /** The id as the library keys it. */
  id: string;
  /** The page or status page as the library holds it: what its picture
   * draws and its editor edits. */
  item: LibraryObject;
  /** "Untitled page" for one with no name. */
  name: string;
  /** The devices that pick it, in the summary's order (sorted by id).
   * Empty for an item no device picks. */
  owners: readonly string[];
  /** The line under its name: "11 tiles", "Smart page", "1 row". */
  detail: string;
  /** A page the watch fills itself. */
  smart: boolean;
  /** One of the app's starter status pages. */
  starter: boolean;
}

/** One menu of the library. */
export interface LibraryMenu {
  id: string;
  name: string;
  /** The unit it fills on a device. */
  unit: MenuUnit;
  /** `quickAction` and `pageSwitcher`, or `entityRadial`. */
  sections: LibraryObject;
  owners: readonly string[];
}

/** One of a device's picks of a page or status page, in its order. */
export interface LibraryPick {
  id: string;
  /** Hidden on this device (Hide here). */
  hidden: boolean;
  /** The library item it picks. */
  entry: LibraryItem;
}

/** The library, read. Build it with `libraryOf`. */
export interface Library {
  readonly summary: LibrarySummary;
  readonly pages: readonly LibraryItem[];
  readonly statusPages: readonly LibraryItem[];
  readonly menus: readonly LibraryMenu[];
  /** By upper-cased id, per kind. */
  readonly index: {
    readonly pages: ReadonlyMap<string, LibraryItem>;
    readonly status_pages: ReadonlyMap<string, LibraryItem>;
    readonly menus: ReadonlyMap<string, LibraryMenu>;
  };
  /** Each device's picks, by upper-cased owner id. */
  readonly picks: ReadonlyMap<string, LibraryOwnerPicks>;
}

const up = (id: string): string => id.toUpperCase();

/** Two ids that name the same thing (ignoring case). */
export function sameId(a: string | undefined, b: string | undefined): boolean {
  return a !== undefined && b !== undefined && up(a) === up(b);
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function isObject(value: unknown): value is LibraryObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The line under a page's or status page's name. */
export function itemDetail(kind: LibraryListKind, item: LibraryObject): string {
  if (kind === "status_pages") return plural(statusPageRows(item).length, "row", "rows");
  if (isSmartWatchPage(item as WatchPage)) return "Smart page";
  return plural(watchPageTiles(item as WatchPage).length, "tile", "tiles");
}

function entries(kind: LibraryListKind, raw: unknown): LibraryItem[] {
  if (!isObject(raw)) return [];
  return Object.entries(raw).flatMap(([id, entry]): LibraryItem[] => {
    if (!isObject(entry) || !isObject(entry.item)) return [];
    const item = entry.item;
    const name = kind === "status_pages" ? statusPageName(item) || "Untitled page" : watchPageName(item as WatchPage);
    return [{
      kind,
      id,
      item,
      name,
      owners: strings(entry.owners),
      detail: itemDetail(kind, item),
      smart: kind === "pages" && isSmartWatchPage(item as WatchPage),
      starter: kind === "status_pages" && isSystemStatusPage(item),
    }];
  });
}

function menuEntries(raw: unknown): LibraryMenu[] {
  if (!isObject(raw)) return [];
  return Object.entries(raw).flatMap(([id, entry]): LibraryMenu[] => {
    if (!isObject(entry)) return [];
    const unit = entry.kind === "entity" ? "entity" : entry.kind === "anywhere" ? "anywhere" : undefined;
    if (unit === undefined) return [];
    const name = typeof entry.name === "string" && entry.name.trim() !== "" ? entry.name.trim() : MENU_UNIT_TITLES[unit];
    return [{ id, name, unit, sections: isObject(entry.sections) ? entry.sections : {}, owners: strings(entry.owners) }];
  });
}

/** What a unit is called on screen. */
export const MENU_UNIT_TITLES: Readonly<Record<MenuUnit, string>> = {
  anywhere: "Anywhere menu",
  entity: "Entity quick menu",
};

/** The library from one summary reply, in the summary's order. Anything
 * malformed in it is left out rather than thrown on. */
export function libraryOf(summary: LibrarySummary): Library {
  const pages = entries("pages", summary?.pages);
  const statusPages = entries("status_pages", summary?.status_pages);
  const menus = menuEntries(summary?.menus);
  const picks = new Map<string, LibraryOwnerPicks>();
  if (isObject(summary?.picks)) {
    for (const [owner, held] of Object.entries(summary.picks)) if (isObject(held)) picks.set(up(owner), held as LibraryOwnerPicks);
  }
  const byId = <T extends { id: string }>(list: readonly T[]) => new Map(list.map((x) => [up(x.id), x] as const));
  return {
    summary,
    pages,
    statusPages,
    menus,
    index: { pages: byId(pages), status_pages: byId(statusPages), menus: byId(menus) },
    picks,
  };
}

/** The pages, or the status pages, of the library. */
export function libraryItems(lib: Library, kind: LibraryListKind): readonly LibraryItem[] {
  return kind === "status_pages" ? lib.statusPages : lib.pages;
}

/** One page or status page, or undefined when the library has none of
 * that id. */
export function libraryItem(lib: Library, kind: LibraryListKind, id: string): LibraryItem | undefined {
  return lib.index[kind].get(up(id));
}

/** One menu, or undefined. */
export function libraryMenu(lib: Library, id: string | undefined): LibraryMenu | undefined {
  return id === undefined ? undefined : lib.index.menus.get(up(id));
}

/** The menus of one unit, or every menu. */
export function libraryMenus(lib: Library, unit?: MenuUnit): readonly LibraryMenu[] {
  return unit === undefined ? lib.menus : lib.menus.filter((m) => m.unit === unit);
}

/** A menu's name, or undefined for a menu the library does not hold. */
export function menuName(lib: Library, id: string | undefined): string | undefined {
  return libraryMenu(lib, id)?.name;
}

/** The devices that pick an item (a menu: that use it), in the summary's
 * order. Empty for an unknown id. */
export function devicesFor(lib: Library, kind: LibraryKind, id: string): readonly string[] {
  return (kind === "menus" ? libraryMenu(lib, id) : libraryItem(lib, kind, id))?.owners ?? [];
}

/** Picked by two or more devices: an edit on one shows on the others. */
export function isShared(lib: Library, kind: LibraryKind, id: string): boolean {
  return devicesFor(lib, kind, id).length >= 2;
}

/** The device picks the item (a menu: uses it, for its unit). */
export function hasItem(lib: Library, ownerId: string, kind: LibraryKind, id: string): boolean {
  return devicesFor(lib, kind, id).some((o) => sameId(o, ownerId));
}

/** One device's picks as the summary has them, or undefined for a device
 * the summary does not list (no picks at all, a file that failed, or a
 * device the caller may not manage). */
export function picksOf(lib: Library, ownerId: string): LibraryOwnerPicks | undefined {
  return lib.picks.get(up(ownerId));
}

/** The device holds a record of the kind: the summary lists its key. */
export function holdsRecord(lib: Library, ownerId: string, kind: LibraryKind): boolean {
  const held = picksOf(lib, ownerId);
  return held !== undefined && Object.hasOwn(held, kind);
}

/** One device's pages, or status pages, in its order, each with its Hide
 * here. A system page (the device's own, never a library item) and a pick
 * whose item the summary does not hold are left out. */
export function itemsFor(lib: Library, ownerId: string, kind: LibraryListKind): LibraryPick[] {
  const list = picksOf(lib, ownerId)?.[kind];
  if (!Array.isArray(list)) return [];
  return list.flatMap((pick): LibraryPick[] => {
    if (!isObject(pick) || typeof pick.id !== "string" || isObject((pick as { page?: unknown }).page)) return [];
    const entry = libraryItem(lib, kind, pick.id);
    return entry === undefined ? [] : [{ id: entry.id, hidden: pick.isHidden === true, entry }];
  });
}

/** The device hides the item there. */
export function isHiddenOn(lib: Library, ownerId: string, kind: LibraryListKind, id: string): boolean {
  return itemsFor(lib, ownerId, kind).some((p) => sameId(p.id, id) && p.hidden);
}

/** "Not on this device": the library's pages, or status pages, the device
 * does not pick, in library order. */
export function restFor(lib: Library, ownerId: string, kind: LibraryListKind): LibraryItem[] {
  return libraryItems(lib, kind).filter((entry) => !entry.owners.some((o) => sameId(o, ownerId)));
}

/** The menu a device uses for a unit, or undefined when it uses none (no
 * menus record, or a menu the summary does not hold). */
export function menuFor(lib: Library, ownerId: string, unit: MenuUnit): LibraryMenu | undefined {
  return libraryMenu(lib, picksOf(lib, ownerId)?.menus?.[unit]);
}

/** The menus of a unit a device does not use. */
export function otherMenus(lib: Library, ownerId: string, unit: MenuUnit): LibraryMenu[] {
  const using = menuFor(lib, ownerId, unit)?.id;
  return libraryMenus(lib, unit).filter((m) => !sameId(m.id, using));
}

/** A menu as a menus document, for its picture (`wa-menu-thumbs`) and its
 * slot count (`menuRowCount`). Never saved: a menus save is always the
 * device's own record as loaded. */
export function menuDocument(menu: LibraryMenu): MenusDocument {
  return { schemaVersion: 1, ...structuredClone(menu.sections) };
}

/** A device's pages as a pages document, in its order, for pictures that
 * name other pages (a page link's label, the page switcher's rows): its
 * system pages whole, each library page with its Hide here. Never saved. */
export function pagesDocumentFor(lib: Library, ownerId: string): WatchPagesDocument {
  const list = picksOf(lib, ownerId)?.pages;
  const pages = (Array.isArray(list) ? list : []).flatMap((pick): LibraryObject[] => {
    if (!isObject(pick) || typeof pick.id !== "string") return [];
    const own = (pick as { page?: unknown }).page;
    if (isObject(own)) return [own];
    const entry = libraryItem(lib, "pages", pick.id);
    if (entry === undefined) return [];
    return [pick.isHidden === true ? { ...entry.item, isHidden: true } : entry.item];
  });
  return { schemaVersion: 1, pages };
}

/** Every device the summary lists picks for. */
export function libraryOwners(lib: Library): string[] {
  return Object.keys(lib.summary?.picks ?? {});
}

/** How many of a device's things the tabs count: its library pages, or
 * status pages (system pages not counted), or the menus it uses. */
export function countFor(lib: Library, ownerId: string, kind: LibraryKind): number {
  if (kind === "menus") return libraryMenus(lib).filter((m) => m.owners.some((o) => sameId(o, ownerId))).length;
  return itemsFor(lib, ownerId, kind).length;
}

/** The other devices that have an item, by name: "also on Jesse's iPhone",
 * "also on Chen Watch and Jesse's iPhone", or "only here". A device not in
 * `devices` is "another device". */
export function alsoOnText(owners: readonly string[], here: string, devices: readonly LinkDevice[]): string {
  const others = owners.filter((o) => !sameId(o, here));
  if (others.length === 0) return "only here";
  const known = devices.filter((d) => others.some((o) => sameId(o, d.ownerId))).map((d) => d.name);
  const unknown = others.length - known.length;
  const names = unknown <= 0 ? known : [...known, unknown === 1 ? "another device" : `${unknown} other devices`];
  return `also on ${joinWords(names)}`;
}

/** A device's row under its name: "23 tiles · also on iPhone 15 Pro",
 * "5 tiles · only here", "1 tile · hidden here". */
export function pickMetaText(pick: LibraryPick, here: string, devices: readonly LinkDevice[]): string {
  return `${pick.entry.detail} · ${pick.hidden ? "hidden here" : alsoOnText(pick.entry.owners, here, devices)}`;
}

/** The devices that use or pick an item, by name, in device order, for a
 * "Used by" line. Devices not in `devices` are left out. */
export function ownerNames(owners: readonly string[], devices: readonly LinkDevice[]): string[] {
  return devices.filter((d) => owners.some((o) => sameId(o, d.ownerId))).map((d) => d.name);
}
