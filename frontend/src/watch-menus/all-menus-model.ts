// The Menus tab: every device's Anywhere menu and Entity quick menu, one
// card each.
//
// A linked menu (the same link id under `linkIds` on several devices,
// `menu-links.ts`) is one card with a chip per device that shares it; any
// other menu is a card of its own, so two unlinked watches show two Anywhere
// menus. The page switcher has no card: it is only the Anywhere menu's look,
// and goes with it. This module is the pure part the tab draws from: the
// cards and the device tabs over them, the Device menu (watches or iPhones),
// the search, which device a card opens on, and the switches of a card's
// Devices menu. The element is `all-menus.ts`; the head and the tabs are the
// Pages tab's (`all-pages-model.ts`).
//
// Two unlinked cards of one unit can hold the very same menu (most often
// both still the app's own). Each then says whose it is the same as
// (`sameMenuDevices`), and its Link links them with no question
// (`sameMenuLink`): replacing a menu with one just like it loses nothing.

import type { WatchPagesPlaces } from "../ha-api.js";
import {
  ALL_FILTER,
  type FilterChip,
  type KindOption,
  type PagesFilter,
  type PagesKind,
} from "../watch-pages/all-pages-model.js";
import { type LinkDevice, type PageDevicePlace, joinWords } from "../watch-pages/links.js";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import {
  MENU_DEVICES_SWITCHER_TEXT,
  MENU_DEVICES_WAIT_TAG,
  MENU_DEVICES_WAIT_TEXT,
  MENU_LINK_UNITS,
  MENU_LINKS_UPDATE_TEXT,
  MENU_PHRASE_GAP_TEXT,
  MENU_UNIT_NAMES,
  MENU_UNIT_SECTIONS,
  type MenuDevicesGroup,
  type MenuLinkUnit,
  menuAlsoAddsText,
  menuHasSpeakPhrase,
  menuLinksKnown,
  menuUnitLinkId,
} from "./menu-links.js";
import { menuRowCount } from "./menu-view.js";
import type { MenusDocument } from "./model.js";

/** The second half of the line under the tab's title. */
export const ALL_MENUS_LEAD = "A menu on more than one device is the same menu: an edit shows on all of them. The page switcher goes with the Anywhere menu.";

/** The line under the tab's title: how many menus, then what a newcomer
 * gets wrong about them, as the Pages tab's line does. */
export function allMenusLead(total: number): string {
  return `${total} ${total === 1 ? "menu" : "menus"} on your watches and iPhones. ${ALL_MENUS_LEAD}`;
}

/** A menu on one device alone cannot be switched off there: every device
 * keeps a menu of its own, and unticking only stops sharing. */
export const MENU_CARD_ONLY_TEXT = "Every device has a menu of its own. Tick another device to share this one with it.";

/** A link copies the menu as saved, so not while an editor holds edits to
 * it. */
export const MENU_CARD_DIRTY_TEXT = "Save or discard the edits to this menu first. A menu goes on another device as it is saved.";

/** One device's copy of a menu. */
export interface MenuCopy {
  device: LinkDevice;
  /** The device's whole menus document, as stored. */
  document: MenusDocument;
}

/** One card: a menu, on every device that shares it. */
export interface MenuCard {
  /** Stable across reads: the link, or the device and the menu. */
  key: string;
  unit: MenuLinkUnit;
  linkId?: string;
  /** "Anywhere menu" or "Entity quick menu". */
  name: string;
  /** In device order, never empty. */
  copies: MenuCopy[];
}

/**
 * Every menu of every device as cards, in device order and then the
 * Anywhere menu before the Entity quick menu: a linked menu where it first
 * shows, once, with every device that holds its link. A device not in `docs`
 * (not read, or no menus saved yet) brings nothing.
 */
export function menuCards(devices: readonly LinkDevice[], docs: ReadonlyMap<string, MenusDocument>): MenuCard[] {
  const cards: MenuCard[] = [];
  const byKey = new Map<string, MenuCard>();
  for (const device of devices) {
    const document = docs.get(device.ownerId);
    if (document === undefined) continue;
    for (const unit of MENU_LINK_UNITS) {
      const linkId = menuUnitLinkId(document, unit);
      const key = linkId === undefined ? `menu:${device.ownerId}:${unit}` : `menu-link:${unit}:${linkId}`;
      const copy: MenuCopy = { device, document };
      const held = byKey.get(key);
      if (held !== undefined) {
        if (!held.copies.some((c) => c.device.ownerId === device.ownerId)) held.copies.push(copy);
        continue;
      }
      const card: MenuCard = { key, unit, name: MENU_UNIT_NAMES[unit], copies: [copy], ...(linkId === undefined ? {} : { linkId }) };
      byKey.set(key, card);
      cards.push(card);
    }
  }
  return cards;
}

/** A card's copy on one device, if it is there. */
export function menuCopyOn(card: MenuCard, ownerId: string): MenuCopy | undefined {
  return card.copies.find((c) => c.device.ownerId === ownerId);
}

/** The line under a card's name, the menu editor's Menus row count: the
 * Anywhere menu's slots, the Entity quick menu's as it first opens (the
 * Light menu). Every copy of a linked menu is the same. */
export function menuCardDetail(card: MenuCard): string {
  return menuRowCount({ uiState: new Map(), document: card.copies[0]!.document, switcherPages: [] }, card.unit);
}

/** The device tabs over the cards: All, then one per device, each with how
 * many menus it shows. */
export function menuFilterChips(
  devices: readonly LinkDevice[],
  cards: readonly MenuCard[],
  colorOf: (ownerId: string) => string | undefined = () => undefined,
): FilterChip[] {
  return [
    { id: ALL_FILTER, label: "All", count: cards.length },
    ...devices.map((d) => {
      const color = colorOf(d.ownerId);
      return {
        id: d.ownerId, label: d.name, kind: d.kind, ...(color === undefined ? {} : { color }),
        count: cards.filter((c) => menuCopyOn(c, d.ownerId) !== undefined).length,
      };
    }),
  ];
}

/** Whether a card is on a device of this kind. */
function onKind(card: MenuCard, kind: PagesKind): boolean {
  return kind === "all" || card.copies.some((c) => c.device.kind === kind);
}

/** The Device menu's options, with how many of the cards given each shows. */
export function menuKindOptions(cards: readonly MenuCard[]): KindOption[] {
  return [
    { key: "all", label: "All", count: cards.length },
    { key: "watch", label: "Watches", count: cards.filter((c) => onKind(c, "watch")).length },
    { key: "iphone", label: "iPhones", count: cards.filter((c) => onKind(c, "iphone")).length },
  ];
}

/**
 * The cards a device tab, a search and the Device menu show, in the order
 * given. The search matches the menu's name or the name of a device it is
 * on, in any case, since every device has menus of the same two names.
 */
export function shownMenuCards(cards: readonly MenuCard[], filter: PagesFilter, search = "", kind: PagesKind = "all"): MenuCard[] {
  const words = search.trim().toLowerCase();
  const matches = (c: MenuCard) => words === "" || c.name.toLowerCase().includes(words)
    || c.copies.some((copy) => copy.device.name.toLowerCase().includes(words));
  return cards.filter((c) => matches(c) && onKind(c, kind) && (filter === ALL_FILTER || menuCopyOn(c, filter) !== undefined));
}

/** The heading over each section of the tab's cards. */
export const MENU_SECTION_TITLES: Readonly<Record<MenuLinkUnit, string>> = {
  anywhere: "Anywhere menus",
  entity: "Entity quick menus",
};

/** The shown cards split into one section per unit, Anywhere menus first,
 * each in the cards' own order. A unit with no card has no section. */
export function menuSections(shown: readonly MenuCard[]): { unit: MenuLinkUnit; cards: MenuCard[] }[] {
  return MENU_LINK_UNITS
    .map((unit) => ({ unit, cards: shown.filter((c) => c.unit === unit) }))
    .filter((s) => s.cards.length > 0);
}

/** The copy a card opens in the menu editor: the device tab's, else the
 * first of the Device menu's kind, else the first watch's, else the first
 * device's. */
export function openMenuCopy(card: MenuCard, filter: PagesFilter, kind: PagesKind = "all"): MenuCopy {
  return (filter === ALL_FILTER ? undefined : menuCopyOn(card, filter))
    ?? (kind === "all" ? undefined : card.copies.find((c) => c.device.kind === kind))
    ?? card.copies.find((c) => c.device.kind === "watch")
    ?? card.copies[0]!;
}

/** The device a link copies the menu from: the first that holds it with no
 * unsaved edits in its menu editor, else undefined (`MENU_CARD_DIRTY_TEXT`). */
export function menuCardSource(card: MenuCard, dirty: (ownerId: string) => boolean): string | undefined {
  return card.copies.find((c) => !dirty(c.device.ownerId))?.device.ownerId;
}

/**
 * A card's Devices menu switches: one per device, on where the menu is.
 * Unlike the editor's, no device is "this one". A menu on one device alone
 * stays on (there is nothing to stop sharing); a device that waits for its
 * iPhone cannot take the menu yet; and with `places` read from an
 * integration older than linked menus, every switch is greyed with the
 * update text.
 */
export function menuCardPlaces(
  devices: readonly LinkDevice[],
  card: MenuCard,
  places: WatchPagesPlaces | undefined,
  waiting: ReadonlySet<string> = new Set(),
): PageDevicePlace[] {
  const outdated = places !== undefined && !menuLinksKnown(places);
  const alone = card.copies.length <= 1;
  return devices.map((device) => {
    const on = menuCopyOn(card, device.ownerId) !== undefined;
    if (outdated) return { device, on, here: false, stuck: MENU_LINKS_UPDATE_TEXT };
    if (on && alone) return { device, on, here: false, stuck: MENU_CARD_ONLY_TEXT };
    if (!on && waiting.has(device.ownerId)) return { device, on, here: false, stuck: MENU_DEVICES_WAIT_TEXT, tag: MENU_DEVICES_WAIT_TAG };
    return { device, on, here: false };
  });
}

/** What `menuCardGroup` reads. */
export interface MenuCardFacts {
  card: MenuCard;
  devices: readonly LinkDevice[];
  places: WatchPagesPlaces | undefined;
  waiting?: ReadonlySet<string>;
  /** The device a link copies from (`menuCardSource`); its copy's slots say
   * what a link brings. The first copy when undefined. */
  source?: string;
  /** The source device's pages, for the names of those a link brings. */
  pages: readonly { id: string; name: string }[];
  /** Its status pages, when known. */
  statusPages?: readonly { id: string }[];
}

/**
 * A card's one group of the Devices menu (`menu-devices.ts`): its switches
 * (`menuCardPlaces`), then the lines the editor's group has: for the
 * Anywhere menu that the page switcher's look goes with it, the pages its
 * slots open ("Also adds: Lights."), and while one of its slots speaks a
 * phrase, the phrase gap. Never "Unlink this watch": the tab has no "this".
 */
export function menuCardGroup(facts: MenuCardFacts): MenuDevicesGroup {
  const { card } = facts;
  const document = (facts.source === undefined ? undefined : menuCopyOn(card, facts.source)?.document) ?? card.copies[0]!.document;
  const lines: string[] = [];
  if (card.unit === "anywhere") lines.push(MENU_DEVICES_SWITCHER_TEXT);
  const adds = menuAlsoAddsText(document, card.unit, facts.pages, facts.statusPages);
  if (adds !== undefined) lines.push(adds);
  if (card.unit === "anywhere" && menuHasSpeakPhrase(document)) lines.push(MENU_PHRASE_GAP_TEXT);
  return {
    unit: card.unit,
    head: `The ${MENU_UNIT_NAMES[card.unit]} is on`,
    places: menuCardPlaces(facts.devices, card, facts.places, facts.waiting),
    lines,
    linked: false,
  };
}

/**
 * Whether two devices' menus are the same for `unit`: each of the unit's
 * sections (`MENU_UNIT_SECTIONS`, so the Anywhere menu with the page
 * switcher) alike as JSON, whatever the order of its keys. The link ids sit
 * outside the sections, so they never count.
 */
export function sameMenuUnit(a: MenusDocument, b: MenusDocument, unit: MenuLinkUnit): boolean {
  return MENU_UNIT_SECTIONS[unit].every((s) => sameWatchPagesJson(a[s], b[s]));
}

/**
 * For each unlinked card, the devices whose unlinked card of the same unit
 * holds the same menu (`sameMenuUnit`), in device order. A card with no such
 * twin, and every linked card, is missing. Read from every card, not only
 * those shown, so a device tab still names the twin on another device.
 */
export function sameMenuDevices(cards: readonly MenuCard[]): Map<string, LinkDevice[]> {
  const loose = cards.filter((c) => c.linkId === undefined);
  const same = new Map<string, LinkDevice[]>();
  for (const card of loose) {
    const mine = card.copies[0]!;
    const twins = loose.filter((other) => other !== card && other.unit === card.unit
      && other.copies[0]!.device.ownerId !== mine.device.ownerId
      && sameMenuUnit(mine.document, other.copies[0]!.document, card.unit));
    if (twins.length > 0) same.set(card.key, twins.map((t) => t.copies[0]!.device));
  }
  return same;
}

/** The line on a card that holds the same menu as other devices: "Same as
 * Jesse's iPhone's." */
export function sameMenuText(devices: readonly LinkDevice[]): string {
  return `Same as ${joinWords(devices.map((d) => `${d.name}'s`))}.`;
}

/** What a card's Link sends: `linkWatchMenus` from `source` for `unit` onto
 * `targets`, with `replace`, since their menus are the same. */
export interface SameMenuLink {
  source: string;
  unit: MenuLinkUnit;
  targets: string[];
}

/**
 * A card's Link onto the devices that hold the same menu: from the card's
 * own device to those in `same` (`sameMenuDevices`). Undefined for a card
 * with no twin. "dirty" while the source or a target holds unsaved edits in
 * its menu editor: those could differ from what was read.
 */
export function sameMenuLink(card: MenuCard, same: ReadonlyMap<string, readonly LinkDevice[]>, dirty: (ownerId: string) => boolean): SameMenuLink | "dirty" | undefined {
  const twins = same.get(card.key);
  if (twins === undefined || twins.length === 0) return undefined;
  const source = card.copies[0]!.device.ownerId;
  const targets = twins.map((d) => d.ownerId);
  if ([source, ...targets].some(dirty)) return "dirty";
  return { source, unit: card.unit, targets };
}

/** What a card's Link said once it was done. */
export function sameMenuLinkedText(unit: MenuLinkUnit, names: readonly string[]): string {
  return `The ${MENU_UNIT_NAMES[unit]} is linked with ${joinWords(names)} now. An edit on one shows on all of them.`;
}

/** What the tab says with no card to show. */
export function menusEmptyText(filter: PagesFilter, devices: readonly LinkDevice[], search: string, kind: PagesKind = "all"): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  if (search.trim() !== "") return "No menu or device has that name.";
  if (kind !== "all") return `No menu here is on ${kind === "watch" ? "a watch" : "an iPhone"}.`;
  const device = devices.find((d) => d.ownerId === filter);
  if (device !== undefined) return `No menus saved on ${device.name} yet. Open its Menus to set them up.`;
  return "No device has saved its menus yet. Open a device's Menus to set them up.";
}
