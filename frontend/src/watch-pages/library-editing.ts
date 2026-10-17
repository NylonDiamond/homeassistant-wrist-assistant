// The editors' side of the library: what the page, status page and menu
// editors say about the devices an item is on, worked out from the library
// summary (`library/model.ts`) and nothing else. The records' `linkId` and
// `linkIds` keys are never written here, and every save still carries them
// as loaded. The one read is the menus restore question's (`restoreMark`):
// Home Assistant still decides a menus restore by `linkIds` until step 4.
//
// The words: the tick row's locks, the badge on a row, the delete question
// ("Delete from the library (it is on 3 devices)" or "Remove from this watch
// only"), the line a restore adds when it changes other devices too, the
// rows of "Not on this watch", and the name a menu's copy starts with.
// Plan: app repo docs/one_library_plan_2026-10.md, step 3.

import type { LibraryListKind, MenuUnit } from "../library/client.js";
import {
  type Library,
  type LibraryItem,
  type LibraryMenu,
  MENU_UNIT_TITLES,
  devicesFor,
  libraryItem,
  libraryMenu,
  menuFor,
  restFor,
  sameId,
} from "../library/model.js";
import { type LinkDevice, deviceWord, joinWords, linkBadgeText } from "./links.js";

/** What a list item is called in a sentence. */
function noun(kind: LibraryListKind): string {
  return kind === "status_pages" ? "status page" : "page";
}

/** The devices other than `here` that have an item, as the summary lists
 * them. */
export function otherOwners(lib: Library, kind: LibraryListKind, id: string, here: string): string[] {
  return devicesFor(lib, kind, id).filter((o) => !sameId(o, here));
}

/** Owner ids by name, in device order; a device the editor does not list is
 * "another device" (or "N other devices"). */
export function ownerWords(owners: readonly string[], devices: readonly LinkDevice[]): string[] {
  const known = devices.filter((d) => owners.some((o) => sameId(o, d.ownerId))).map((d) => d.name);
  const unknown = owners.filter((o) => !devices.some((d) => sameId(d.ownerId, o))).length;
  if (unknown === 0) return known;
  return [...known, unknown === 1 ? "another device" : `${unknown} other devices`];
}

/** The badge on a row of an item other devices have too: "Also on Jesse's
 * iPhone", or "On 3 devices". Undefined for one on this device alone, or
 * not in the library yet. */
export function libraryBadgeText(lib: Library | undefined, kind: LibraryListKind, id: string, here: string, devices: readonly LinkDevice[]): string | undefined {
  if (lib === undefined) return undefined;
  const others = otherOwners(lib, kind, id, here);
  if (others.length === 0) return undefined;
  // `linkBadgeText` names a holder by exact id: hand it the ids as the
  // device list spells them.
  const spelled = others.map((o) => devices.find((d) => sameId(d.ownerId, o))?.ownerId ?? o);
  return linkBadgeText([here, ...spelled], here, devices);
}

/** Why the tick of the device on screen cannot be clicked: Delete takes the
 * item off it. */
export function hereTickText(kind: LibraryListKind, device: LinkDevice["kind"]): string {
  return `On this ${deviceWord(device)}. Delete takes the ${noun(kind)} off it.`;
}

/** Why another device's tick cannot be unticked: its editor in this tab
 * holds unsaved edits, whose next save would put the item back. */
export function dirtyElsewhereText(name: string): string {
  return `Save or discard the edits on ${name} first.`;
}

/** What the tick row says for an item not in the library yet (a new page
 * not saved). */
export function unsavedTicksText(kind: LibraryListKind): string {
  return `Save first, then tick a device to put the ${noun(kind)} there too.`;
}

/** The delete question's two answers, for an item other devices have too. */
export interface LibraryDeleteChoices {
  /** How many devices have it, this one with them. */
  count: number;
  /** The other devices, by name. */
  others: string[];
  /** "Remove from this watch only". */
  remove: string;
  /** "Delete from the library (it is on 3 devices)". */
  library: string;
  /** The question's line under its title. */
  body: string;
}

/**
 * The delete question's answers for an item other devices have too, or
 * undefined for one on this device alone (or not in the library yet), which
 * the editor deletes as it always did.
 */
export function libraryDeleteChoices(
  lib: Library | undefined,
  kind: LibraryListKind,
  id: string,
  here: string,
  device: LinkDevice["kind"],
  devices: readonly LinkDevice[],
): LibraryDeleteChoices | undefined {
  if (lib === undefined) return undefined;
  const others = otherOwners(lib, kind, id, here);
  if (others.length === 0) return undefined;
  const count = others.length + 1;
  const names = ownerWords(others, devices);
  const word = deviceWord(device);
  const remove = `Remove from this ${word} only`;
  const library = `Delete from the library (it is on ${count} devices)`;
  const them = others.length === 1 ? "that device keeps it" : "those devices keep it";
  return {
    count,
    others: names,
    remove,
    library,
    body: `It is also on ${joinWords(names)}. Remove takes it off this ${word} when you save, and ${them}. `
      + `Delete from the library takes it off every device at once, which undo here does not bring back.`,
  };
}

/** The keys a device's own pick holds, never the item's: left out when a
 * restored item is matched against the library's. */
const PICK_KEYS: ReadonlySet<string> = new Set(["isHidden", "linkId"]);

/** JSON with its keys sorted, so two objects with the same content compare
 * equal whatever order their keys were written in. */
function canonical(value: unknown, top = false): string {
  if (Array.isArray(value)) return `[${value.map((v) => canonical(v)).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([k, v]) => v !== undefined && !(top && PICK_KEYS.has(k)))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** A restored page holds the same as the library's item: its own Hide here
 * and the old link key aside. */
export function sameItemContent(a: unknown, b: unknown): boolean {
  return canonical(a, true) === canonical(b, true);
}

function idOf(item: unknown): string | undefined {
  const id = (item as { id?: unknown } | null)?.id;
  return typeof id === "string" && id !== "" ? id : undefined;
}

function nameOf(entry: LibraryItem): string {
  return `"${entry.name}"`;
}

/**
 * The line a restore question adds when the restore changes other devices
 * too: a restore of a device's pages (or status pages) is a save of them, so
 * every page in the restored save that differs from the library's and that
 * other devices have changes there too. "It also changes "Lights" on Chen
 * Watch, which has it too." Undefined when it changes only this device.
 */
export function restoreOthersText(
  lib: Library | undefined,
  kind: LibraryListKind,
  here: string,
  restored: readonly unknown[],
  devices: readonly LinkDevice[],
): string | undefined {
  if (lib === undefined) return undefined;
  const changed: LibraryItem[] = [];
  const owners = new Map<string, string>();
  for (const item of restored) {
    const id = idOf(item);
    const entry = id === undefined ? undefined : libraryItem(lib, kind, id);
    if (entry === undefined) continue;
    const others = entry.owners.filter((o) => !sameId(o, here));
    if (others.length === 0 || sameItemContent(item, entry.item)) continue;
    changed.push(entry);
    for (const o of others) owners.set(o.toUpperCase(), o);
  }
  if (changed.length === 0) return undefined;
  const shown = changed.slice(0, 3).map(nameOf);
  const more = changed.length - shown.length;
  const what = more > 0 ? `${shown.join(", ")} and ${more} more ${more === 1 ? noun(kind) : `${noun(kind)}s`}` : joinWords(shown);
  const names = ownerWords([...owners.values()], devices);
  const one = owners.size === 1;
  const it = changed.length === 1 ? "it" : "them";
  return `It also changes ${what} on ${joinWords(names)}, which ${one ? "has" : "have"} ${it} too.`;
}

/** The parts of a menus document each unit is made of. */
const UNIT_KEYS: Readonly<Record<MenuUnit, readonly string[]>> = {
  anywhere: ["quickAction", "pageSwitcher"],
  entity: ["entityRadial"],
};

function unitPart(document: unknown, unit: MenuUnit): Record<string, unknown> {
  const doc = document !== null && typeof document === "object" ? (document as Record<string, unknown>) : {};
  return Object.fromEntries(UNIT_KEYS[unit].flatMap((k) => (doc[k] === undefined ? [] : [[k, doc[k]]])));
}

/** "the Anywhere menu", or "the Anywhere menu "Home menu"" for one with a
 * name of its own. */
export function menuLabel(menu: LibraryMenu): string {
  const title = MENU_UNIT_TITLES[menu.unit];
  return menu.name === title ? `the ${title}` : `the ${title} "${menu.name}"`;
}

/**
 * The menu a menus document's old link mark names for a unit
 * (`linkIds[unit]`), or undefined for none. Read for the restore question
 * only, and only because Home Assistant still decides a menus restore by
 * these marks until the marks go (plan step 4): a restored save whose mark
 * names another menu moves this device back onto it, and one that lacks a
 * mark the record holds gives this device its own copy. Never written: every
 * save sends the marks as loaded.
 */
function restoreMark(document: unknown, unit: MenuUnit): string | undefined {
  const doc = document !== null && typeof document === "object" ? (document as Record<string, unknown>) : {};
  const marks = doc.linkIds;
  if (marks === null || typeof marks !== "object") return undefined;
  const mark = (marks as Record<string, unknown>)[unit];
  return typeof mark === "string" && mark !== "" ? mark : undefined;
}

function alsoChanges(menu: LibraryMenu, others: readonly string[], devices: readonly LinkDevice[]): string {
  return `It also changes ${menuLabel(menu)} on ${joinWords(ownerWords(others, devices))}, which ${others.length === 1 ? "uses" : "use"} it too.`;
}

/**
 * The lines a menus restore question adds, one per unit the restore does
 * more than change here. A restore is a save of this device's menus, so it
 * goes the way Home Assistant takes such a save:
 *
 * - The restored save names another menu of the unit (it was saved while
 *   this device used that one): this device moves back onto it, and the
 *   restored slots change it on the devices that use it. "This watch goes
 *   back to using the Anywhere menu "Chen's menu"."
 * - The record holds a mark for a menu other devices use and the restored
 *   save has none (saved before the menu was shared): this device gets its
 *   own copy, and the others keep the menu as it is. "This watch gets its
 *   own copy of the Anywhere menu "Home menu". iPhone 15 Pro keeps it as it
 *   is."
 * - Otherwise a unit whose slots differ changes the menu this device uses,
 *   on every device that uses it: "It also changes the Anywhere menu "Home
 *   menu" on iPhone 15 Pro, which uses it too."
 *
 * Empty when it changes only this device.
 */
export function menuRestoreLines(
  lib: Library | undefined,
  here: string,
  now: unknown,
  restored: unknown,
  devices: readonly LinkDevice[],
  device: LinkDevice["kind"] = "watch",
): string[] {
  if (lib === undefined) return [];
  const word = deviceWord(device);
  const lines: string[] = [];
  for (const unit of ["anywhere", "entity"] as const) {
    const menu = menuFor(lib, here, unit);
    const differs = canonical(unitPart(now, unit)) !== canonical(unitPart(restored, unit));
    const sent = restoreMark(restored, unit);
    const target = sent === undefined ? undefined : libraryMenu(lib, sent);
    if (target !== undefined && target.unit === unit && !sameId(target.id, menu?.id)) {
      lines.push(`This ${word} goes back to using ${menuLabel(target)}.`);
      const others = target.owners.filter((o) => !sameId(o, here));
      if (others.length > 0 && canonical(unitPart(restored, unit)) !== canonical(target.sections)) lines.push(alsoChanges(target, others, devices));
      continue;
    }
    if (menu === undefined) continue;
    const others = menu.owners.filter((o) => !sameId(o, here));
    if (others.length === 0) continue;
    if (sent === undefined && restoreMark(now, unit) !== undefined) {
      const names = ownerWords(others, devices);
      lines.push(`This ${word} gets its own copy of ${menuLabel(menu)}. ${joinWords(names)} ${others.length === 1 ? "keeps" : "keep"} it as it is.`);
      continue;
    }
    if (differs) lines.push(alsoChanges(menu, others, devices));
  }
  return lines;
}

/** The line under a device's status pages when some are on other devices
 * too: "These status pages are also on Jesse's iPhone. An edit here shows
 * there too." Undefined when none is. */
export function statusSharedText(lib: Library | undefined, here: string, ids: readonly string[], devices: readonly LinkDevice[]): string | undefined {
  if (lib === undefined) return undefined;
  const others = ids.map((id) => otherOwners(lib, "status_pages", id, here));
  const shared = others.filter((o) => o.length > 0).length;
  if (shared === 0) return undefined;
  const owners = new Map<string, string>();
  for (const o of others.flat()) owners.set(o.toUpperCase(), o);
  const which = shared === ids.length
    ? (shared === 1 ? "This status page is" : "These status pages are")
    : `${shared} of these status pages ${shared === 1 ? "is" : "are"}`;
  return `${which} also on ${joinWords(ownerWords([...owners.values()], devices))}. An edit here shows there too.`;
}

/** One row of "Not on this watch". */
export interface RestRow {
  entry: LibraryItem;
  /** "11 tiles · on Chen Watch", "1 row · on no device". */
  meta: string;
}

/** "Not on this watch": the library's pages, or status pages, this device
 * does not have, each with the devices that do. */
export function restRows(lib: Library | undefined, here: string, kind: LibraryListKind, devices: readonly LinkDevice[]): RestRow[] {
  if (lib === undefined) return [];
  return restFor(lib, here, kind).map((entry) => {
    const where = entry.owners.length === 0 ? "on no device" : `on ${joinWords(ownerWords(entry.owners, devices))}`;
    const starter = entry.starter ? " · starter" : "";
    return { entry, meta: `${entry.detail}${starter} · ${where}` };
  });
}

/** "Not on this watch", or iPhone. */
export function restTitle(device: LinkDevice["kind"]): string {
  return `Not on this ${deviceWord(device)}`;
}

/** The mock's line beside it. */
export const REST_HINT = "The rest of your home. Add one here with a tick.";

/** The name "Make a copy for this watch" gives the copy first. */
export function copyMenuName(deviceName: string): string {
  return `${deviceName}'s menu`;
}

/** What "Make a copy for this watch" says once the copy is in use. */
export function copiedMenuText(name: string, device: LinkDevice["kind"]): string {
  return `This ${deviceWord(device)} uses its own copy now, "${name}". Edits here change only this ${deviceWord(device)}.`;
}

/** Why "Make a copy for this watch" waits: it copies the menu as saved. */
export function copyBlockedText(device: LinkDevice["kind"]): string {
  return `Save or discard your edits first. The copy is made from the menu as saved on this ${deviceWord(device)}.`;
}
