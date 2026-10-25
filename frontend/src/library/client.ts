// The library's commands, typed: one of every page, status page and menu in
// the home, and each device's picks of them.
//
// Every page, status page and menu lives once in the library, and a device
// picks from it: which pages and status pages, in what order, which are
// hidden there, and one Anywhere menu and one Entity quick menu. Home
// Assistant still writes one `pages`, `status_pages` and `menus` record per
// device from the library and that device's picks, so the editors keep
// saving a device's record as before, and those saves are mapped back to the
// library. These commands are the rest: the summary the Pages, Status pages
// and Menus tabs draw from, a tick on a device, a new menu, a menu's copy,
// name and delete, and a delete from the library.
//
// The keys are the server's exactly (`watch_config_ws.py`): an item is named
// by `item_id`, never `id`, which is the message number. Home Assistant
// rejects an unknown key with `invalid_format`. An integration older than the
// library answers every one with `unknown_command`.
// Plan: app repo docs/one_library_plan_2026-10.md.

import type { HassLike, WatchConfigLinkFailure, WatchConfigTemplateBudget } from "../ha-api.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { WAIT_FOR_IPHONE_TEXT } from "../watch-settings.js";

const LIB = "wrist_assistant/library";

/** What the library holds. */
export type LibraryKind = "pages" | "status_pages" | "menus";

/** The kinds a device ticks on and off: pages and status pages. */
export type LibraryListKind = "pages" | "status_pages";

/** A menu's kind, which is also the unit of the device it fills: the
 * Anywhere menu (with the page switcher) or the Entity quick menu. */
export type MenuUnit = "anywhere" | "entity";

export const MENU_UNITS: readonly MenuUnit[] = ["anywhere", "entity"];

/** The keys of a menus document each unit's menu is made of, as the
 * server's `MENU_UNITS` names them: a menu's `sections` hold exactly these. */
export const MENU_UNIT_SECTIONS: Readonly<Record<MenuUnit, readonly string[]>> = {
  anywhere: ["quickAction", "pageSwitcher"],
  entity: ["entityRadial"],
};

/** A stored object, parsed JSON nothing has checked. */
export type LibraryObject = Record<string, unknown>;

/** One page or status page in the summary: the item as the library holds
 * it (a page never carries `isHidden` here), and the devices
 * that pick it, sorted. An item no device picks has no owners, and only an
 * administrator hears of it. */
export interface LibraryItemEntry {
  item: LibraryObject;
  owners: string[];
  /** The item's own revision, bumped on every change to its content.
   * Absent from an integration older than library editing. */
  revision?: number;
}

/** One menu in the summary. `sections` holds `quickAction` and
 * `pageSwitcher` for an Anywhere menu, `entityRadial` for an Entity quick
 * menu, each only when the menu has it. */
export interface LibraryMenuEntry {
  name: string;
  kind: MenuUnit;
  sections: LibraryObject;
  owners: string[];
  /** As `LibraryItemEntry.revision`; a rename bumps it too. */
  revision?: number;
}

/** One of a device's page picks: a library page (with `isHidden` when it is
 * hidden there), or a system page, which is the device's own and never a
 * library item, carried whole. */
export type LibraryPagePick = { id: string; isHidden?: boolean; page?: undefined } | { id: string; page: LibraryObject; isHidden?: undefined };

/** One of a device's status page picks. */
export interface LibraryStatusPick {
  id: string;
  isHidden?: boolean;
}

/** One device's picks. A kind's key is absent when the device holds no
 * record of that kind. */
export interface LibraryOwnerPicks {
  pages?: LibraryPagePick[];
  status_pages?: LibraryStatusPick[];
  menus?: Partial<Record<MenuUnit, string>>;
}

/** `library/summary`: every item with the devices that pick it, and every
 * device's picks. Anyone but an administrator hears only of the devices
 * they may manage, and of the items those devices pick. A device whose
 * stored file could not be read is left out. */
export interface LibrarySummary {
  pages: Record<string, LibraryItemEntry>;
  status_pages: Record<string, LibraryItemEntry>;
  menus: Record<string, LibraryMenuEntry>;
  picks: Record<string, LibraryOwnerPicks>;
}

/** Every record a library write changed: by device, then kind, the record's
 * revision now. Other devices' records are named too where an item they
 * share came or went. */
export type LibraryRevisions = Record<string, Record<string, number>>;

export interface LibraryPickReply {
  revisions: LibraryRevisions;
}

export interface LibraryMenuCopyReply {
  /** The new menu's id. */
  id: string;
  revisions: LibraryRevisions;
}

/** What `library/menus/create` answers: the new menu's id, and no record
 * changed (no device uses it yet), so `revisions` is empty. */
export type LibraryMenuCreateReply = LibraryMenuCopyReply;

export interface LibraryDeleteReply {
  revisions: LibraryRevisions;
  /** The devices whose record could not take the delete. */
  link_failures: WatchConfigLinkFailure[];
}

/** Every item and every device's picks, in one read. Refusals: `unavailable`
 * (the integration is not up, or the library file could not be read), and
 * `unknown_command` from an integration older than the library. */
export async function fetchLibrarySummary(hass: HassLike) {
  return hass.connection.sendMessagePromise<LibrarySummary>({ type: `${LIB}/summary` });
}

/** Tick a page or status page on a device (`on` true) or untick it. Ticked
 * on, it goes at the end of the device's order, visible, and a page brings
 * the status pages its tiles open. Ticked off, the device no longer has it;
 * the item stays in the library. Refusals: `invalid`, `unknown_device`,
 * `not_for_iphone`, `not_found` (no such item), `no_record`,
 * `awaiting_move`, and `unauthorized` (a device the caller may not manage,
 * or, putting one on, an item none of the caller's devices has, for anyone
 * but an administrator). */
export async function pickLibraryItem(hass: HassLike, ownerId: string, kind: LibraryListKind, itemId: string, on: boolean) {
  return hass.connection.sendMessagePromise<LibraryPickReply>({ type: `${LIB}/pick`, owner_id: ownerId, kind, item_id: itemId, on });
}

/** Make `menuId` the menu a device uses for `unit` from now on. A device
 * with no menus record starts from a device that uses the menu, keeping a
 * copy of that device's other menu as its own. When no device with menus
 * uses it (a menu just made with New menu), it starts from `start`, a whole
 * menus document (the app's defaults), whose other menu becomes a new menu
 * of the device's own; with no `start` that is refused `no_record`. Home
 * Assistant reads `start` only then. Other refusals as `pickLibraryItem`,
 * and `invalid` for a menu of the other kind or a bad `start`. */
export async function pickLibraryMenu(hass: HassLike, ownerId: string, unit: MenuUnit, menuId: string, start?: LibraryObject) {
  return hass.connection.sendMessagePromise<LibraryPickReply>({
    type: `${LIB}/pick`, owner_id: ownerId, kind: "menus", unit, item_id: menuId, ...(start === undefined ? {} : { start }),
  });
}

/** "Make a copy for this watch": a new library menu named `name` with the
 * slots of the menu the device uses for `unit`, which the device then uses
 * in its place. Refusals: `invalid` (an empty name, an unknown unit),
 * `unknown_device`, `not_found` (the device uses no menu for the unit),
 * `unauthorized`. */
export async function copyLibraryMenu(hass: HassLike, ownerId: string, unit: MenuUnit, name: string) {
  return hass.connection.sendMessagePromise<LibraryMenuCopyReply>({ type: `${LIB}/menus/copy`, owner_id: ownerId, unit, name });
}

/** New menu: a library menu named `name` that no device uses yet, made of
 * `sections`, which hold exactly the unit's keys (`MENU_UNIT_SECTIONS`) as a
 * menus document holds them. A tick then puts it on a device. Administrators
 * only. Refusals: `invalid` (an empty name, an unknown unit, sections of the
 * wrong shape), `unauthorized`, and `unknown_command` from an integration
 * older than it. */
export async function createLibraryMenu(hass: HassLike, unit: MenuUnit, name: string, sections: LibraryObject) {
  return hass.connection.sendMessagePromise<LibraryMenuCreateReply>({ type: `${LIB}/menus/create`, unit, name, sections });
}

/** Rename a library menu. No device's record holds a menu's name, so no
 * record changes and no `watch_config/subscribe` event follows: read the
 * summary again after it. Refusals: `not_found`, `invalid` (an empty
 * name), `unauthorized` (a menu used by a device the caller may not
 * manage, or used by none, for anyone but an administrator). */
export async function renameLibraryMenu(hass: HassLike, menuId: string, name: string) {
  return hass.connection.sendMessagePromise<Record<string, never>>({ type: `${LIB}/menus/rename`, item_id: menuId, name });
}

/** Delete a menu no device uses. Refusals: `in_use`, `not_found`,
 * `unauthorized`. */
export async function deleteLibraryMenu(hass: HassLike, menuId: string) {
  return hass.connection.sendMessagePromise<LibraryDeleteReply>({ type: `${LIB}/menus/delete`, item_id: menuId });
}

/** Delete a page, status page or menu from the library. A page or status
 * page goes from every device that has it, with every menu slot and tile
 * that opened it, everywhere; complication taps that opened it are not
 * touched (they are the complications' own store). A menu is refused
 * `in_use` while any device uses it. Other refusals: `invalid`,
 * `not_found`, `unauthorized`. */
export async function deleteLibraryItem(hass: HassLike, kind: LibraryKind, itemId: string) {
  return hass.connection.sendMessagePromise<LibraryDeleteReply>({ type: `${LIB}/delete`, kind, item_id: itemId });
}

/** `library/item`: one item as a whole document of its kind, in the shape a
 * device's record of that kind has, so the editors read it as they read a
 * record. A page or status page document holds that one page; a menus
 * document holds the menu's sections, the other unit's sections blank.
 * `revision` is the item's own (it starts at 1). A menu also has `name`. */
export interface LibraryItemReply {
  document: LibraryObject;
  revision: number;
  name?: string;
}

/** What `library/item/save` answers: the item's revision now. */
export interface LibraryItemSaveReply {
  revision: number;
  /** On a page's save, the templates that page alone asks for (`scope`
   * "page"). Absent from integrations older than tile layers. */
  template_budget?: WatchConfigTemplateBudget;
}

/** Read one item for its editor's library mode. Refusals: `not_found`,
 * `invalid` (an unknown kind), `unauthorized` (an item none of the caller's
 * devices picks, for anyone but an administrator), `unavailable`. */
export async function fetchLibraryItem(hass: HassLike, kind: LibraryKind, itemId: string) {
  return hass.connection.sendMessagePromise<LibraryItemReply>({ type: `${LIB}/item`, kind, item_id: itemId });
}

/** Save one item edited in the library: `document` is a whole document of
 * the kind holding only this item (for a menu, its unit's sections; the
 * other unit's are ignored). Every device that picks it is written again.
 * Refusals: `conflict` (the item moved past `baseRevision`; the message
 * says "stored revision is N", as a record save's does), `invalid` (a bad
 * document, another item's id in it), `not_found`, `unauthorized`. */
export async function saveLibraryItem(hass: HassLike, kind: LibraryKind, itemId: string, baseRevision: number, document: LibraryObject) {
  return hass.connection.sendMessagePromise<LibraryItemSaveReply>({
    type: `${LIB}/item/save`, kind, item_id: itemId, base_revision: baseRevision, document,
  });
}

/** What `library/item/create` answers: the new page's id and its revision,
 * which is 1. */
export interface LibraryItemCreateReply {
  id: string;
  revision: number;
}

/** New page, or New status page: a page in the library that no device has
 * yet. `document` is a whole document of the kind holding the one new page,
 * as `library/item` would give it back. No record is written, so no
 * `watch_config/subscribe` event follows: read the summary again after it.
 * Administrators only. Refusals: `invalid` (a menu, another shape, other
 * than one page, an id the library holds), `unauthorized`, and
 * `unknown_command` from an integration older than it. */
export async function createLibraryItem(hass: HassLike, kind: LibraryListKind, document: LibraryObject) {
  return hass.connection.sendMessagePromise<LibraryItemCreateReply>({ type: `${LIB}/item/create`, kind, document });
}

/** What the tabs say on an integration older than the library. */
export const LIBRARY_UNSUPPORTED_TEXT = "This version of the integration has no library yet. Update it first.";

/** A library refusal in plain words. */
export function libraryErrorText(err: unknown): string {
  const { code, message } = watchCommandError(err);
  switch (code) {
    case "unknown_command": return LIBRARY_UNSUPPORTED_TEXT;
    case "unknown_device": return "That device is not paired with this Home Assistant any more.";
    case "not_found": return "That is not in the library any more.";
    case "in_use": return "A device still uses this menu. Pick another menu for it first.";
    case "conflict": return "Someone else changed this in the meantime. It was read again.";
    case "no_record": return "No device uses this menu yet, so it cannot start this device's menus.";
    case "awaiting_move": return `${WAIT_FOR_IPHONE_TEXT} Try again after that.`;
    case "unauthorized": return "Your Home Assistant user is not allowed to change that device.";
    case "unavailable": return "Home Assistant could not read the library. Try again in a moment.";
    default: return message;
  }
}

/** The refusal's code alone, when it has one. */
export function libraryErrorCode(err: unknown): string | undefined {
  return watchCommandError(err).code;
}
