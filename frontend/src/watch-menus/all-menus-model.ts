// The Menus tab: every menu of the home's library, one card each, in two
// sections, Anywhere menus then Entity quick menus.
//
// A menu lives once in the library, has a name ("Home menu", "Chen's
// menu"), and each device uses one Anywhere menu and one Entity quick menu
// (`library/model.ts`). So a card is a library menu, and its round ticks are
// the devices that use it: tick another device and it uses this menu from
// now on. Nothing is folded from the devices' records, and their `linkIds`
// are never read. The page switcher has no card: it is only the Anywhere
// menu's look, and goes with it.
//
// On a device's tab the list is that device's two menus, each with a menu
// to pick another (mock frame 2b), then "Not on this watch": the rest of the
// library's menus, dimmed. This module is the pure part the tab draws from;
// the element is `all-menus.ts`, and the head and the tabs are the Pages
// tab's (`watch-pages/all-pages-model.ts`).
// Plan: app repo docs/one_library_plan_2026-10.md, step 2.

import { MENU_UNITS, type MenuUnit } from "../library/client.js";
import { type Library, type LibraryMenu, MENU_UNIT_TITLES, alsoOnText, libraryMenus, menuDocument, menuFor, otherMenus, sameId } from "../library/model.js";
import {
  ALL_FILTER,
  type FilterChip,
  type KindOption,
  type PagesFilter,
  type PagesKind,
  matchesSearch,
  ownersOnKind,
} from "../watch-pages/all-pages-model.js";
import { type LinkDevice, deviceWord } from "../watch-pages/links.js";
import { WAIT_FOR_IPHONE_TEXT } from "../watch-settings.js";
import { menuRowCount } from "./menu-view.js";

/** The second half of the line under the tab's title. */
export const ALL_MENUS_LEAD = "Each device uses one Anywhere menu and one Entity quick menu.";

/** The line under the tab's title (mock frame 1c). */
export function allMenusLead(total: number): string {
  return `${total} ${total === 1 ? "menu" : "menus"} in your home. ${ALL_MENUS_LEAD}`;
}

/** The surface's foot on All. */
export const MENUS_FOOT = "Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. Give a menu a name so you can tell them apart.";

/** The foot on a device's tab. */
export function menusDeviceFoot(device: LinkDevice): string {
  return `Pick which menu this ${deviceWord(device.kind)} uses. Click a menu to edit it.`;
}

/** The heading over each section. */
export const MENU_SECTION_TITLES: Readonly<Record<MenuUnit, string>> = {
  anywhere: "Anywhere menus",
  entity: "Entity quick menus",
};

/** A device whose menus cannot move yet: its iPhone may still move them
 * here, and Home Assistant holds none for it. */
export const MENUS_WAIT_TEXT = `${WAIT_FOR_IPHONE_TEXT} Its menus can change after that.`;

/** A device whose menu editor holds unsaved edits: moving it to another
 * menu would land those edits on that menu. */
export function menusDirtyText(name: string): string {
  return `${name}'s menus have unsaved edits. Save or discard them first.`;
}

/** The line under a card's name, the menu editor's Menus row count: the
 * Anywhere menu's slots, the Entity quick menu's as it first opens. */
export function menuDetail(menu: LibraryMenu): string {
  return menuRowCount({ uiState: new Map(), document: menuDocument(menu), switcherPages: [] }, menu.unit);
}

/** The device tabs over the cards: All with every menu, then each device
 * with how many it uses (two, once it has menus). */
export function menuFilterChips(
  devices: readonly LinkDevice[],
  library: Library | undefined,
  colorOf: (ownerId: string) => string | undefined = () => undefined,
): FilterChip[] {
  return [
    { id: ALL_FILTER, label: "All", count: library === undefined ? 0 : libraryMenus(library).length },
    ...devices.map((d) => {
      const color = colorOf(d.ownerId);
      return {
        id: d.ownerId, label: d.name, kind: d.kind, ...(color === undefined ? {} : { color }),
        count: library === undefined ? 0 : MENU_UNITS.filter((u) => menuFor(library, d.ownerId, u) !== undefined).length,
      };
    }),
  ];
}

/** The Device menu's options, with how many of the menus given each shows. */
export function menuKindOptions(menus: readonly LibraryMenu[], devices: readonly LinkDevice[]): KindOption[] {
  return [
    { key: "all", label: "All", count: menus.length },
    { key: "watch", label: "Watches", count: menus.filter((m) => ownersOnKind(m.owners, "watch", devices)).length },
    { key: "iphone", label: "iPhones", count: menus.filter((m) => ownersOnKind(m.owners, "iphone", devices)).length },
  ];
}

/** Whether a menu matches the search: its name, or the name of a device
 * that uses it. */
export function menuMatches(menu: LibraryMenu, search: string, devices: readonly LinkDevice[]): boolean {
  if (matchesSearch(menu.name, search)) return true;
  return devices.some((d) => menu.owners.some((o) => sameId(o, d.ownerId)) && matchesSearch(d.name, search) && search.trim() !== "");
}

/** The menus All shows, in the library's order, under the search and the
 * Device menu. */
export function shownMenus(library: Library, search = "", kind: PagesKind = "all", devices: readonly LinkDevice[] = []): LibraryMenu[] {
  return libraryMenus(library).filter((m) => menuMatches(m, search, devices) && ownersOnKind(m.owners, kind, devices));
}

/** The shown menus split into the two sections, Anywhere menus first. Both
 * sections are always there: each holds its New menu. */
export function menuSections(shown: readonly LibraryMenu[]): { unit: MenuUnit; menus: LibraryMenu[] }[] {
  return MENU_UNITS.map((unit) => ({ unit, menus: shown.filter((m) => m.unit === unit) }));
}

/** The device a card opens on: the device tab's when it uses the menu,
 * else the first of the Device menu's kind, else the first watch, else the
 * first device that uses it. Undefined for a menu no device uses. */
export function openMenuDevice(menu: LibraryMenu, filter: PagesFilter, kind: PagesKind, devices: readonly LinkDevice[]): LinkDevice | undefined {
  const users = devices.filter((d) => menu.owners.some((o) => sameId(o, d.ownerId)));
  return (filter === ALL_FILTER ? undefined : users.find((d) => d.ownerId === filter))
    ?? (kind === "all" ? undefined : users.find((d) => d.kind === kind))
    ?? users.find((d) => d.kind === "watch")
    ?? users[0];
}

/** What a click on a menu no device uses says. */
export const MENU_NO_USER_TEXT = "No device uses this menu. Pick one to edit it there.";

/** One of a device's two menus on its tab. */
export interface DeviceMenuRow {
  unit: MenuUnit;
  /** "Anywhere menu" or "Entity quick menu". */
  title: string;
  menu: LibraryMenu | undefined;
  /** The other menus of the unit it could use instead. */
  others: LibraryMenu[];
}

/** A device's two menus, Anywhere first. */
export function deviceMenuRows(library: Library, ownerId: string): DeviceMenuRow[] {
  return MENU_UNITS.map((unit) => ({
    unit,
    title: MENU_UNIT_TITLES[unit],
    menu: menuFor(library, ownerId, unit),
    others: otherMenus(library, ownerId, unit),
  }));
}

/** The line under a device's menu: "Home menu · 8 slots · also on iPhone
 * 15 Pro" (mock frame 2b). */
export function deviceMenuMeta(menu: LibraryMenu, here: string, devices: readonly LinkDevice[]): string {
  return `${menu.name} · ${menuDetail(menu)} · ${alsoOnText(menu.owners, here, devices)}`;
}

/** "Not on this watch": the library's menus a device does not use, under
 * the search, Anywhere menus first. */
export function restMenus(library: Library, ownerId: string, search: string, devices: readonly LinkDevice[]): LibraryMenu[] {
  return MENU_UNITS.flatMap((unit) => otherMenus(library, ownerId, unit)).filter((m) => menuMatches(m, search, devices));
}

/** The name New menu offers: "New menu", or for the Entity quick menu "New
 * quick menu", with a number after it when the library has one so named. */
export function newMenuName(library: Library | undefined, unit: MenuUnit): string {
  const base = unit === "entity" ? "New quick menu" : "New menu";
  const taken = new Set((library === undefined ? [] : libraryMenus(library)).map((m) => m.name.trim().toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base} ${n}`.toLowerCase())) return `${base} ${n}`;
}

/** The devices a new menu can start on: those that use a menu of the unit
 * (Home Assistant makes a new menu as a copy of one), in device order. */
export function newMenuDevices(library: Library | undefined, unit: MenuUnit, devices: readonly LinkDevice[]): LinkDevice[] {
  if (library === undefined) return [];
  return devices.filter((d) => menuFor(library, d.ownerId, unit) !== undefined);
}

/** The line in New menu's form: what it starts as and who uses it. */
export function newMenuText(unit: MenuUnit, device: LinkDevice | undefined): string {
  const start = `It starts as the app's own ${MENU_UNIT_TITLES[unit]}`;
  return device === undefined ? `${start}.` : `${start}, and ${device.name} uses it from now on.`;
}

/** What New menu says with no device to start on. */
export const NEW_MENU_NONE_TEXT = "No device has its menus in Home Assistant yet. Open a device's Menus first.";

/** What the tab says with no menu to show. */
export function menusEmptyText(devices: readonly LinkDevice[], search: string, kind: PagesKind = "all"): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  if (search.trim() !== "") return "No menu or device has that name.";
  if (kind !== "all") return `No menu here is used on ${kind === "watch" ? "a watch" : "an iPhone"}.`;
  return "None yet.";
}
