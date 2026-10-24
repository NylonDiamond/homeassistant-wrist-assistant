// The Pages tab and the Status pages tab: every page, or every status page,
// of the library, one card each, with a tick per device on the card.
//
// The library holds each page and status page once, and each device picks
// from it (`library/model.ts`, read from one `library/summary`). So a card
// is a library item, and its ticks are the devices that pick it: nothing is
// folded from the devices' records.
// A focused device lists its picks in its own order, each with Hide here,
// then "Not on this watch": the rest of the library, dimmed.
//
// This module is the pure part both tabs draw from: the words, the search,
// which device a row opens on, and a focused device's two lists. The element is
// `all-pages.ts`, told by its `kind` which of the two it lists.
// Plan: app repo docs/one_library_plan_2026-10.md, step 2.

import type { LibraryListKind } from "../library/client.js";
import { type Library, type LibraryItem, type LibraryPick, itemsFor, libraryItems, restFor, sameId } from "../library/model.js";
import { type LinkDevice, deviceWord } from "./devices.js";

/** What a card is: a page, or a status page. */
export type CardKind = LibraryListKind;

/** The second half of the Pages tab's line under its title: what the
 * library is, so the word means something where the delete and edit lines
 * use it. */
export const ALL_PAGES_LEAD = "Each watch and iPhone shows the pages ticked for it, and an edit shows everywhere.";

/** The same on the Status pages tab: what a status page is. */
export const STATUS_PAGES_LEAD = "A status page is a read-only screen of rows that a tile or a menu slot opens.";

/** "page" or "status page", as the tab's lines name a card of `kind`. */
export function cardNoun(kind: CardKind, n = 1): string {
  const one = kind === "status_pages" ? "status page" : "page";
  return n === 1 ? one : `${one}s`;
}

/** "a page" or "a status page". */
export function aCard(kind: CardKind): string {
  return kind === "status_pages" ? "a status page" : "a page";
}

/** Why New page is greyed for anyone who is not an administrator: a page no
 * device has is an administrator's. */
export function newCardAdminText(kind: CardKind): string {
  return `Only a Home Assistant administrator can make a new ${cardNoun(kind)}.`;
}

/** The tab's title: Pages, or Status pages. */
export function cardsTitle(kind: CardKind): string {
  return kind === "status_pages" ? "Status pages" : "Pages";
}

/** The line under the tab's title: how many the library holds, then the
 * one fact a newcomer needs (mock frames 1a and 1d). An empty library says
 * only that: the empty block under it says what to do. */
export function allPagesLead(total: number, kind: CardKind = "pages"): string {
  if (total === 0) return `No ${cardNoun(kind, 2)} yet.`;
  return `${total} ${cardNoun(kind, total)} in your home. ${kind === "status_pages" ? STATUS_PAGES_LEAD : ALL_PAGES_LEAD}`;
}

/** The All tab's block when the library holds none of the kind: how a page
 * works, for whoever may make one, or who to ask. */
export function emptyLibraryText(kind: CardKind, admin: boolean): string {
  if (!admin) return `Ask a Home Assistant administrator to make the first ${cardNoun(kind)}.`;
  return `Make ${aCard(kind)} once, then tick each watch or iPhone that should show it.`;
}

/** The line in the surface's foot. On the board (`view`) a click on a
 * device's name focuses it; Cards has no column to click. */
export function footText(kind: CardKind, device: LinkDevice | undefined, selecting = false, view: "board" | "cards" = "board"): string {
  const one = cardNoun(kind);
  if (selecting) return `Click ${cardNoun(kind, 2)} to pick them. Shift+click picks every ${one} between two.`;
  if (device !== undefined) {
    const word = deviceWord(device.kind);
    return kind === "status_pages"
      ? `Click a status page to edit it. Drag to order. The order is this ${word}'s own.`
      : `Click a page to edit it. Drag to order, and Hide here (the eye) keeps a page on this ${word} without showing it.`;
  }
  if (view === "board") {
    return kind === "status_pages"
      ? "Click a status page to edit it. Tick a box to put it on that device. Click a device's name to order its status pages."
      : "Click a page to edit it. Tick a box to show the page on that device. Click a device's name to order its pages.";
  }
  return kind === "status_pages"
    ? "Click a status page to edit it. Tick a device to put it there."
    : "Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.";
}

/** The line under a card's name: "11 tiles", "Smart page", "1 row · starter". */
export function cardDetail(entry: LibraryItem): string {
  return entry.starter ? `${entry.detail} · starter` : entry.detail;
}

/** "all", or one device's owner id: the device the board focuses. */
export type PagesFilter = string;
export const ALL_FILTER: PagesFilter = "all";

/** A filter kept from before, or All once its device is gone. */
export function resolveFilter(filter: PagesFilter | undefined, devices: readonly LinkDevice[]): PagesFilter {
  return filter !== undefined && devices.some((d) => d.ownerId === filter) ? filter : ALL_FILTER;
}

/** Whether a name matches the search, in any case. An empty search
 * matches everything. */
export function matchesSearch(name: string, search: string): boolean {
  const words = search.trim().toLowerCase();
  return words === "" || name.toLowerCase().includes(words);
}

/** The rows the board shows: the library's items of the kind, in its
 * order, under the search. */
export function shownItems(library: Library, kind: CardKind, search = ""): LibraryItem[] {
  return libraryItems(library, kind).filter((e) => matchesSearch(e.name, search));
}

/** A focused device: its picks in its own order, then the rest of the
 * library, each under the search. */
export interface DeviceView {
  device: LinkDevice;
  picks: LibraryPick[];
  rest: LibraryItem[];
}

export function deviceView(library: Library, device: LinkDevice, kind: CardKind, search = ""): DeviceView {
  return {
    device,
    picks: itemsFor(library, device.ownerId, kind).filter((p) => matchesSearch(p.entry.name, search)),
    rest: restFor(library, device.ownerId, kind).filter((e) => matchesSearch(e.name, search)),
  };
}

/** A device's picks in the order a drag asked for while its save is out:
 * `order` first (those still picked), then any pick it does not name. */
export function inOrder(picks: readonly LibraryPick[], order: readonly string[] | undefined): LibraryPick[] {
  if (order === undefined) return [...picks];
  const placed = order.flatMap((id) => picks.filter((p) => sameId(p.id, id)));
  return [...placed, ...picks.filter((p) => !placed.includes(p))];
}

/** Where a pick lands when it is dropped on `target`: before it when
 * dragged up, after it when dragged down, as a list does. Undefined for a
 * drop that changes nothing. The result is the id to put it before, or
 * null for the end. */
export function dropBefore(order: readonly string[], dragged: string, target: string): string | null | undefined {
  const from = order.findIndex((id) => sameId(id, dragged));
  const to = order.findIndex((id) => sameId(id, target));
  if (from < 0 || to < 0 || from === to) return undefined;
  if (to < from) return order[to]!;
  return to + 1 < order.length ? order[to + 1]! : null;
}

/** The change a drop makes: the dragged pick, and what it lands before.
 * Undefined for a drop that changes nothing. */
export function dropChange(order: readonly string[], dragged: string, target: string): { id: string; before: string | null } | undefined {
  const before = dropBefore(order, dragged, target);
  return before === undefined ? undefined : { id: dragged, before };
}

/** `order` with `id` moved before `before` (null: to the end). */
export function movedOrder(order: readonly string[], id: string, before: string | null): string[] {
  const rest = order.filter((o) => !sameId(o, id));
  const at = before === null ? -1 : rest.findIndex((o) => sameId(o, before));
  const held = order.find((o) => sameId(o, id)) ?? id;
  if (at < 0) return [...rest, held];
  return [...rest.slice(0, at), held, ...rest.slice(at)];
}

/** The device a card's picture is drawn for: the first watch that has the
 * item, else the first device that has it. Undefined for an item no listed
 * device has. */
export function openDevice(entry: { owners: readonly string[] }, devices: readonly LinkDevice[]): LinkDevice | undefined {
  const holders = devices.filter((d) => entry.owners.some((o) => sameId(o, d.ownerId)));
  return holders.find((d) => d.kind === "watch") ?? holders[0];
}

/** The title of a card or a row: a click opens it in the one editor, the
 * library's (`library/item-mode.ts`), whichever devices have it. */
export function libraryEditTitle(name: string): string {
  return `Edit ${name}`;
}

/** A focused device's first heading. */
export function onDeviceTitle(device: LinkDevice): string {
  return `On ${device.name}`;
}

/** Its line at the right: the order is the device's own. */
export function orderHint(device: LinkDevice): string {
  return `Drag to order. The order is this ${deviceWord(device.kind)}'s own.`;
}

/** The second heading: the rest of the library. */
export function restTitle(device: LinkDevice): string {
  return `Not on this ${deviceWord(device.kind)}`;
}

/** Whether a focused device shows its "Not on this watch" list. With no
 * search, a home with nothing at all (none on the device, none left over)
 * has no rest to list, and "every page is on it" would be an empty claim. */
export function showsRest(total: number, rest: number, search: string): boolean {
  return search.trim() !== "" || total > 0 || rest > 0;
}

/** What a focused device says with nothing on it. `rest` is how many
 * the library has that this device does not: with none there is nothing to
 * tick below. `admin` false is a user who cannot make one (New is off). */
export function noPicksText(device: LinkDevice, kind: CardKind, search: string, rest?: number, admin = true): string {
  if (search.trim() !== "") return `No ${cardNoun(kind)} on ${device.name} has that name.`;
  if (rest === 0) {
    return admin
      ? `No ${cardNoun(kind, 2)} on ${device.name} yet. Use New ${cardNoun(kind)} to make one.`
      : `No ${cardNoun(kind, 2)} on ${device.name} yet. Ask a Home Assistant administrator to make the first one.`;
  }
  if (!admin) return `No ${cardNoun(kind, 2)} on ${device.name} yet. Tick one below.`;
  return `No ${cardNoun(kind, 2)} on ${device.name} yet. Tick one below, or make a new one.`;
}

/** What the board says with no row to show. */
export function emptyText(devices: readonly LinkDevice[], search: string, cardKind: CardKind = "pages"): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  if (search.trim() !== "") return `No ${cardNoun(cardKind)} has that name.`;
  return cardKind === "status_pages"
    ? "Your home has no status pages yet. Use New status page to make one."
    : "Your home has no pages yet. Use New page to make one.";
}
