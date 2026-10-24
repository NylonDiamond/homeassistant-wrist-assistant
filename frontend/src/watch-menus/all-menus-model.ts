// The Menus tab: every menu of the home's library, one card each, in two
// sections, Anywhere menus then Entity quick menus.
//
// A menu lives once in the library, has a name ("Home menu", "Chen's
// menu"), and each device uses one Anywhere menu and one Entity quick menu
// (`library/model.ts`). So a card is a library menu, and its round ticks are
// the devices that use it: tick another device and it uses this menu from
// now on. Nothing is folded from the devices' records. The page switcher has
// no card: it is only the Anywhere menu's look, and goes with it. New menu
// makes a menu no device uses yet; a tick then puts it on one.
//
// A focused device lists the two menus it uses, then "Not on this watch":
// the rest of the library's menus, dimmed. This module is the pure part the tab draws from;
// the element is `all-menus.ts`, and the head and the tabs are the Pages
// tab's (`watch-pages/all-pages-model.ts`).
// Plan: app repo docs/one_library_plan_2026-10.md, step 2.

import { MENU_UNITS, MENU_UNIT_SECTIONS, type MenuUnit } from "../library/client.js";
import { type Library, type LibraryMenu, MENU_UNIT_TITLES, libraryMenus, menuDocument, otherMenus, sameId } from "../library/model.js";
import { matchesSearch } from "../watch-pages/all-pages-model.js";
import { type LinkDevice, deviceWord, joinWords, waitingEmptyText, waitingLibraryText } from "../watch-pages/devices.js";
import { WAIT_FOR_IPHONE_TEXT } from "../watch-settings.js";
import { menuRowCount } from "./menu-view.js";
import { type MenusDocument, watchMenusDefaults } from "./model.js";

/** The second half of the line under the tab's title. */
export const ALL_MENUS_LEAD = "Each device uses one Anywhere menu and one Entity quick menu.";

/** The line under the tab's title (mock frame 1c). */
export function allMenusLead(total: number): string {
  return `${total} ${total === 1 ? "menu" : "menus"} in your home. ${ALL_MENUS_LEAD}`;
}

/** The surface's foot on Cards. */
export const MENUS_FOOT = "Click a menu to edit it. Tick a device on a card and that device uses this menu from now on. New menu starts on no device yet.";

/** The foot on the board. */
export const MENUS_BOARD_FOOT = "Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.";

/** The words at each board section's right: the rule a dot follows. */
export const MENUS_BOARD_HINT = "Each device uses one of each kind. Pick a dot to switch.";

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

/** Whether a menu matches the search: its name, or the name of a device
 * that uses it. */
export function menuMatches(menu: LibraryMenu, search: string, devices: readonly LinkDevice[]): boolean {
  if (matchesSearch(menu.name, search)) return true;
  return devices.some((d) => menu.owners.some((o) => sameId(o, d.ownerId)) && matchesSearch(d.name, search) && search.trim() !== "");
}

/** The menus the board shows, in the library's order, under the search. */
export function shownMenus(library: Library, search = "", devices: readonly LinkDevice[] = []): LibraryMenu[] {
  return libraryMenus(library).filter((m) => menuMatches(m, search, devices));
}

/** The shown menus split into the two sections, Anywhere menus first. Both
 * sections are always there, an empty one with its line. */
export function menuSections(shown: readonly LibraryMenu[]): { unit: MenuUnit; menus: LibraryMenu[] }[] {
  return MENU_UNITS.map((unit) => ({ unit, menus: shown.filter((m) => m.unit === unit) }));
}

/** The device a card's picture is drawn for: the first watch that uses
 * the menu, else the first device that uses it. Undefined for a menu no
 * device uses. */
export function openMenuDevice(menu: LibraryMenu, devices: readonly LinkDevice[]): LinkDevice | undefined {
  const users = devices.filter((d) => menu.owners.some((o) => sameId(o, d.ownerId)));
  return users.find((d) => d.kind === "watch") ?? users[0];
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

/** The line in New menu's form: what it starts as, and that no device uses
 * it until one is ticked. */
export function newMenuText(unit: MenuUnit): string {
  return `It starts as the app's own ${MENU_UNIT_TITLES[unit]}, on no device yet.`;
}

/** Why a menu in use cannot be deleted, and how to free it. */
export function menuInUseText(users: readonly string[]): string {
  const one = users.length === 1;
  return `${joinWords(users)} ${one ? "uses" : "use"} it. To delete it, pick another menu for ${one ? "that device" : "each of them"} first.`;
}

/** What New menu says once the menu is made. */
export function newMenuMadeText(name: string): string {
  return `Made ${name}, on no device yet. Pick a device for it any time.`;
}

/** Why New menu is not offered to someone who is not an administrator. */
export const NEW_MENU_ADMIN_TEXT = "Only a Home Assistant administrator can make a new menu.";

/** A new menu's sections: the app's own menu for the unit
 * (`menu-defaults.json`), exactly the keys a menus document holds for it. */
export function newMenuSections(unit: MenuUnit, defaults: MenusDocument = watchMenusDefaults()): Record<string, unknown> {
  return Object.fromEntries(MENU_UNIT_SECTIONS[unit].flatMap((k) => (Object.hasOwn(defaults, k) ? [[k, structuredClone(defaults[k])]] : [])));
}

/** What the tab says with no menu to show. `waiting`: a watch waits for its
 * iPhone to move its menus here (`awaitingMove`), so they are on their way. */
export function menusEmptyText(devices: readonly LinkDevice[], search: string, waiting = false): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  if (search.trim() !== "") return "No menu or device has that name.";
  return waiting ? `None yet. ${waitingLibraryText("menus")}` : "None yet.";
}

/** What a focused device says while it uses no menu: that its iPhone's
 * move is still to come when it waits for one, else that it uses none. */
export function noMenuText(device: LinkDevice, search: string, waiting: boolean): string {
  if (search.trim() !== "") return `No menu ${device.name} uses has that name.`;
  return waiting ? waitingEmptyText("menus", device.name) : `${device.name} uses no menu yet.`;
}

/** The Duplicate button's tooltip on a focused device's shared menu. */
export function duplicateMenuTitle(menu: string, device: string): string {
  return `Duplicate ${menu} for ${device}. The other devices keep this one.`;
}

/** What Duplicate says once the copy is in use. */
export function duplicatedMenuText(name: string, device: string): string {
  return `${device} uses its own copy now, "${name}". Edits to it change only ${device}.`;
}
