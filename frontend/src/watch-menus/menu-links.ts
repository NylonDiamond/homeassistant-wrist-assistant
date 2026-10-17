// Menus linked across devices: one Anywhere menu or Entity quick menu on
// several devices.
//
// The menus link by unit, not as a whole: the Anywhere menu (`quickAction`
// with `pageSwitcher`, which is only its look) and the Entity quick menu
// (`entityRadial`). A linked unit carries the same link id under the
// document's top-level `linkIds` on each device that holds it, and Home
// Assistant writes every save of one copy to the others itself, so the
// editor saves its own device as always. Nothing about a unit stays per
// device: a device that wants its own menu unlinks, and keeps the menu as it
// was.
//
// This module is the pure part the menu editor's Devices menu draws from:
// which devices hold a unit, its switches, the lines under them, the replace
// question, and the one write the panel makes on a device's `linkIds`
// (unlinking its copy). A link is made by `watch_pages/link`, never here.
// Plan: app repo docs/shared_things_plan_2026-10.md, step 2.

import type { WatchConfigRecord, WatchMenusLinkUnit, WatchPagesPlaces } from "../ha-api.js";
import { type LinkDevice, type PageDevicePlace, deviceWord, joinWords, linkBadgeText } from "../watch-pages/links.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { WAIT_FOR_IPHONE_TEXT } from "../watch-settings.js";
import type { MenusSection } from "./menu-view.js";
import { type MenusDocument, type WatchMenusSection, asWatchMenusDocument, withMenuKey, withoutMenuKey } from "./model.js";

export type MenuLinkUnit = WatchMenusLinkUnit;

/** The top-level key a linked menu's link ids sit under, by unit. */
export const MENU_LINK_KEY = "linkIds";

/** The units, in the Devices menu's order. */
export const MENU_LINK_UNITS: readonly MenuLinkUnit[] = ["anywhere", "entity"];

/** Each unit's name, as the Menus card names its menu. */
export const MENU_UNIT_NAMES: Readonly<Record<MenuLinkUnit, string>> = {
  anywhere: "Anywhere menu",
  entity: "Entity quick menu",
};

/** The sections each unit links, as Home Assistant's `LINK_UNITS` has them. */
export const MENU_UNIT_SECTIONS: Readonly<Record<MenuLinkUnit, readonly WatchMenusSection[]>> = {
  anywhere: ["quickAction", "pageSwitcher"],
  entity: ["entityRadial"],
};

/** The unit a menu of the Menus card belongs to: the page switcher goes with
 * the Anywhere menu. */
export function menuLinkUnitOf(menu: MenusSection): MenuLinkUnit {
  return menu === "entity" ? "entity" : "anywhere";
}

/** The unit's link id in `document`, or undefined while it is on this
 * device alone. */
export function menuUnitLinkId(document: MenusDocument | undefined, unit: MenuLinkUnit): string | undefined {
  const links = document?.[MENU_LINK_KEY];
  const link = isJsonObject(links) ? links[unit] : undefined;
  return typeof link === "string" && link !== "" ? link : undefined;
}

/** Whether this integration links menus: its `places` reply has a `menus`
 * part. False while `places` was not read. */
export function menuLinksKnown(places: WatchPagesPlaces | undefined): boolean {
  return isJsonObject(places?.menus);
}

/**
 * The devices that hold a unit, `here` first: for a linked unit every device
 * `places` lists for its link, for any other only `here`.
 */
export function menuUnitHolders(document: MenusDocument | undefined, unit: MenuLinkUnit, here: string, places: WatchPagesPlaces | undefined): string[] {
  const link = menuUnitLinkId(document, unit);
  const place = link === undefined ? undefined : places?.menus?.[link];
  const listed = place === undefined || place.unit !== unit || !Array.isArray(place.owners) ? [] : place.owners;
  return [here, ...listed.filter((id) => id !== here)];
}

/** The small badge on a linked menu: "Also on Jesse's iPhone", or "On 3
 * devices". Undefined for a menu on this device alone. */
export function menuLinkBadgeText(document: MenusDocument | undefined, unit: MenuLinkUnit, here: string, places: WatchPagesPlaces | undefined, devices: readonly LinkDevice[]): string | undefined {
  return linkBadgeText(menuUnitHolders(document, unit, here, places), here, devices);
}

/** Why no switch moves while the integration is older than linked menus. */
export const MENU_LINKS_UPDATE_TEXT = "Update the integration to share menus between devices.";
/** The device the editor is on: its menu is always here. */
export const MENU_DEVICES_HERE_TEXT = "The menu is always on this device. Untick another device to stop sharing with it.";
/** The row's title for a watch that waits for its iPhone. */
export const MENU_DEVICES_WAIT_TEXT = `${WAIT_FOR_IPHONE_TEXT} Menus can go on this watch after that.`;
/** And its few words. */
export const MENU_DEVICES_WAIT_TAG = "waiting for iPhone";

/**
 * A unit's switches: one per device, on where the unit is linked. The device
 * the editor is on is always on and never flips. A device that waits for its
 * iPhone (`waiting`) cannot take the menu yet. With `outdated` (an
 * integration older than linked menus) every switch is greyed with the
 * update text. Unlike a page, the last copy has no rule: unticking a device
 * only unlinks it, and its menu stays as it is.
 */
export function menuDevicePlaces(
  devices: readonly LinkDevice[],
  document: MenusDocument | undefined,
  unit: MenuLinkUnit,
  here: string,
  places: WatchPagesPlaces | undefined,
  waiting: ReadonlySet<string> = new Set(),
): PageDevicePlace[] {
  const holders = new Set(menuUnitHolders(document, unit, here, places));
  const outdated = places !== undefined && !menuLinksKnown(places);
  return devices.map((device) => {
    const isHere = device.ownerId === here;
    const on = holders.has(device.ownerId);
    if (outdated) return { device, on, here: isHere, stuck: MENU_LINKS_UPDATE_TEXT };
    if (isHere) return { device, on: true, here: true, stuck: MENU_DEVICES_HERE_TEXT };
    if (!on && waiting.has(device.ownerId)) return { device, on, here: false, stuck: MENU_DEVICES_WAIT_TEXT, tag: MENU_DEVICES_WAIT_TAG };
    return { device, on, here: false };
  });
}

/** A switch's title: what flipping it does. */
export function menuDeviceTitle(unit: MenuLinkUnit, place: PageDevicePlace): string {
  if (place.stuck !== undefined) return place.stuck;
  const label = place.device.name;
  return place.on
    ? `Unlink ${label}. It keeps this ${MENU_UNIT_NAMES[unit]} as it is, and an edit then stays on its own device.`
    : `Put this ${MENU_UNIT_NAMES[unit]} on ${label}. An edit on one device then shows on both.`;
}

/** The question before a tick replaces a device's own menu. */
export function menuReplaceAsk(unit: MenuLinkUnit, deviceName: string): { title: string; body: string } {
  return { title: `Replace the ${MENU_UNIT_NAMES[unit]} on ${deviceName}?`, body: "Its own is lost." };
}

/** The question in one line, as a test or a title reads it. */
export function menuReplaceAskText(unit: MenuLinkUnit, deviceName: string): string {
  const ask = menuReplaceAsk(unit, deviceName);
  return `${ask.title} ${ask.body}`;
}

/** The note at the Devices menu's foot. */
export const MENU_DEVICES_NOTE = "On means that device shares this menu, and an edit on one device shows on all of them. Unticking a device keeps its menu as it is.";

/** The Anywhere menu's line: the switcher's look goes with it. */
export const MENU_DEVICES_SWITCHER_TEXT = "The page switcher's look goes with it.";

/** The line under the Anywhere menu's switches while one of its slots
 * speaks a phrase: a phrase is the watch's own (its voice settings), so a
 * watch without it shows the slot's fallback. */
export const MENU_PHRASE_GAP_TEXT = "Speak phrase slots need the phrases on that watch too.";

// ── what a unit's slots open ─────────────────────────────────────────────

/** The menu actions whose payload opens a page or a status page, and the
 * key holding its id: Home Assistant's `_MENU_PAGE_ACTIONS`. */
const MENU_PAGE_ACTIONS: Readonly<Record<string, { key: string; target: "page" | "statusPage" }>> = {
  navigateToPage: { key: "pageId", target: "page" },
  showStatusPage: { key: "pageId", target: "statusPage" },
};

/** Every slot list of one section: the Anywhere menu's `slots`, the Entity
 * quick menu's `*Slots` lists and each `entityOverrides` list. */
function slotLists(section: unknown): unknown[][] {
  if (!isJsonObject(section)) return [];
  const lists: unknown[][] = Array.isArray(section.slots) ? [section.slots] : [];
  for (const [k, v] of Object.entries(section)) if (k.endsWith("Slots") && Array.isArray(v)) lists.push(v);
  const overrides = section.entityOverrides;
  if (isJsonObject(overrides)) for (const v of Object.values(overrides)) if (Array.isArray(v)) lists.push(v);
  return lists;
}

/** Every slot of a unit, in its lists' order. */
function unitSlots(document: MenusDocument, unit: MenuLinkUnit): Record<string, unknown>[] {
  return MENU_UNIT_SECTIONS[unit].flatMap((s) => slotLists(document[s])).flat().filter(isJsonObject);
}

function actionOf(slot: Record<string, unknown>): Record<string, unknown> | undefined {
  return isJsonObject(slot.action) ? slot.action : undefined;
}

/**
 * The page ids and status page ids a unit's slots open, each once in the
 * order first met, as stored: Home Assistant's `menu_targets`, the pages a
 * link of the unit brings along.
 */
export function menuUnitTargets(document: MenusDocument | undefined, unit: MenuLinkUnit): { pageIds: string[]; statusPageIds: string[] } {
  const pages = new Map<string, string>();
  const status = new Map<string, string>();
  for (const slot of document === undefined ? [] : unitSlots(document, unit)) {
    const action = actionOf(slot);
    const spec = typeof action?.type === "string" ? MENU_PAGE_ACTIONS[action.type] : undefined;
    const id = spec === undefined ? undefined : action?.[spec.key];
    if (spec === undefined || typeof id !== "string" || id === "") continue;
    const into = spec.target === "page" ? pages : status;
    if (!into.has(id.toUpperCase())) into.set(id.toUpperCase(), id);
  }
  return { pageIds: [...pages.values()], statusPageIds: [...status.values()] };
}

/**
 * The line under a unit's switches when its slots open pages: "Also adds:
 * Lights and Garage." `pages` are the pages this device lists and
 * `statusPages` the status pages it holds: a slot's page or status page it
 * does not hold brings nothing, so with no status pages known none is
 * counted. Undefined when the slots open none.
 */
export function menuAlsoAddsText(
  document: MenusDocument | undefined,
  unit: MenuLinkUnit,
  pages: readonly { id: string; name: string }[],
  statusPages: readonly { id: string }[] = [],
): string | undefined {
  const { pageIds, statusPageIds } = menuUnitTargets(document, unit);
  const held = (list: readonly { id: string }[], id: string) => list.some((p) => p.id.toUpperCase() === id.toUpperCase());
  const names = pageIds.flatMap((id) => pages.find((p) => p.id.toUpperCase() === id.toUpperCase())?.name ?? []);
  const status = statusPageIds.filter((id) => held(statusPages, id)).length;
  const words = [...names];
  if (status > 0) words.push(status === 1 ? "1 status page" : `${status} status pages`);
  return words.length === 0 ? undefined : `Also adds: ${joinWords(words)}.`;
}

/** Whether the Anywhere menu holds a Speak Phrase slot. */
export function menuHasSpeakPhrase(document: MenusDocument | undefined): boolean {
  return document !== undefined && unitSlots(document, "anywhere").some((s) => actionOf(s)?.type === "speakPhrase");
}

// ── the Devices menu's groups ────────────────────────────────────────────

/** One unit's part of the Devices menu: its switches and the lines under
 * them. */
export interface MenuDevicesGroup {
  unit: MenuLinkUnit;
  /** "The Anywhere menu is on". */
  head: string;
  places: PageDevicePlace[];
  /** What goes with the unit, what a link brings, the phrase gap. */
  lines: string[];
  /** This device's copy is linked, so it can be unlinked here. */
  linked: boolean;
}

/** What `menuDevicesGroups` reads. */
export interface MenuDevicesFacts {
  devices: readonly LinkDevice[];
  document: MenusDocument | undefined;
  here: string;
  places: WatchPagesPlaces | undefined;
  waiting?: ReadonlySet<string>;
  /** The pages this device lists, for the names of those a link brings. */
  pages: readonly { id: string; name: string }[];
  /** Its status pages, when known. */
  statusPages?: readonly { id: string }[];
}

/**
 * The Devices menu's groups for `units`: each unit's switches
 * (`menuDevicePlaces`), then its lines: for the Anywhere menu that the page
 * switcher's look goes with it; the pages its slots open ("Also adds:
 * Lights."); and for the Anywhere menu, while one of its slots speaks a
 * phrase, the phrase gap.
 */
export function menuDevicesGroups(facts: MenuDevicesFacts, units: readonly MenuLinkUnit[] = MENU_LINK_UNITS): MenuDevicesGroup[] {
  return units.map((unit) => {
    const lines: string[] = [];
    if (unit === "anywhere") lines.push(MENU_DEVICES_SWITCHER_TEXT);
    const adds = menuAlsoAddsText(facts.document, unit, facts.pages, facts.statusPages);
    if (adds !== undefined) lines.push(adds);
    if (unit === "anywhere" && menuHasSpeakPhrase(facts.document)) lines.push(MENU_PHRASE_GAP_TEXT);
    return {
      unit,
      head: `The ${MENU_UNIT_NAMES[unit]} is on`,
      places: menuDevicePlaces(facts.devices, facts.document, unit, facts.here, facts.places, facts.waiting),
      lines,
      linked: menuUnitHolders(facts.document, unit, facts.here, facts.places).length > 1,
    };
  });
}

/** A menus link refusal in the editor's words. */
export function menuLinkErrorText(err: unknown): string {
  const { code, message } = watchCommandError(err);
  switch (code) {
    case "unknown_device": return "That device is not paired with this Home Assistant any more.";
    case "not_found": return "The menus are not saved here yet. Save first, then try again.";
    case "unit_taken": return "That device has a menu of its own there.";
    case "not_for_iphone": return "An iPhone cannot hold that menu.";
    case "id_taken": return "That device has a page of its own with the same id as a page this menu opens, so nothing was added.";
    case "awaiting_move": return `${WAIT_FOR_IPHONE_TEXT} Try again after that.`;
    case "unknown_command":
    case "invalid_format": return MENU_LINKS_UPDATE_TEXT;
    default: return message;
  }
}

/** The line for "Unlink this watch" in the Devices menu. */
export function menuUnlinkHereLabel(kind: LinkDevice["kind"]): string {
  return `Unlink this ${deviceWord(kind)}`;
}

// ── unlinking a device's copy ────────────────────────────────────────────

/** `document` without the unit's link id; without `linkIds` at all once
 * nothing is left in it. The document itself when the unit was not linked. */
export function withoutMenuUnitLink(document: MenusDocument, unit: MenuLinkUnit): MenusDocument {
  const links = document[MENU_LINK_KEY];
  if (!isJsonObject(links) || !Object.hasOwn(links, unit)) return document;
  const rest = withoutMenuKey(links, unit);
  return Object.keys(rest).length === 0 ? withoutMenuKey(document, MENU_LINK_KEY) : withMenuKey(document, MENU_LINK_KEY, rest);
}

/** The calls `unlinkMenuUnit` needs: a device's menus record, and a save of
 * it over a revision. */
export interface MenuUnlinkIO {
  read(owner: string): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(owner: string, baseRevision: number, document: MenusDocument): Promise<unknown>;
}

/** The most times one unlink is sent before conflicts end it. */
export const MENU_UNLINK_ATTEMPTS = 3;

export type MenuUnlinkResult = { ok: true; unlinked: boolean } | { ok: false; code: string; message: string };

/**
 * Unlink one device's copy of a unit: read its menus, save them without the
 * unit's link id over the revision read, and read again on a conflict. The
 * menu itself stays as it is. Home Assistant then drops the link on the last
 * other copy too, if only one is left. `unlinked` false: it was not linked.
 */
export async function unlinkMenuUnit(io: MenuUnlinkIO, owner: string, unit: MenuLinkUnit): Promise<MenuUnlinkResult> {
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(owner);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const document = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    const next = document === undefined ? undefined : withoutMenuUnitLink(document, unit);
    if (document === undefined || next === document) return { ok: true, unlinked: false };
    try {
      await io.save(owner, record.revision, next!);
      return { ok: true, unlinked: true };
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      if (code !== "conflict" || attempt >= MENU_UNLINK_ATTEMPTS) return { ok: false, code, message };
    }
  }
}
