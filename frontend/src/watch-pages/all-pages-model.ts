// The Pages tab and the Status pages tab: every page, or every status page,
// of the library, one card each, with a tick per device on the card.
//
// The library holds each page and status page once, and each device picks
// from it (`library/model.ts`, read from one `library/summary`). So a card
// is a library item, and its ticks are the devices that pick it: nothing is
// folded from the devices' records, and their `linkId` keys are never read.
// On a device's tab the list is that device's picks in its own order, each
// with Hide here, then "Not on this watch": the rest of the library, dimmed,
// each with an Add chip.
//
// This module is the pure part both tabs draw from: the words, the device
// tabs over the cards, the Device menu (watches or iPhones), the search,
// which device a card opens on, and a device tab's two lists. The element is
// `all-pages.ts`, told by its `kind` which of the two it lists.
// Plan: app repo docs/one_library_plan_2026-10.md, step 2.

import type { LibraryListKind } from "../library/client.js";
import { type Library, type LibraryItem, type LibraryPick, countFor, itemsFor, libraryItems, restFor, sameId } from "../library/model.js";
import { type LinkDevice, deviceWord } from "./links.js";

/** What a card is: a page, or a status page. */
export type CardKind = LibraryListKind;

/** The second half of the Pages tab's line under its title. */
export const ALL_PAGES_LEAD = "Tick a device and the page is on it.";

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

/** The tab's title: Pages, or Status pages. */
export function cardsTitle(kind: CardKind): string {
  return kind === "status_pages" ? "Status pages" : "Pages";
}

/** The line under the tab's title: how many there are in the home, then
 * the one fact a newcomer needs (mock frames 1a and 1d). */
export function allPagesLead(total: number, kind: CardKind = "pages"): string {
  return `${total} ${cardNoun(kind, total)} in your home. ${kind === "status_pages" ? STATUS_PAGES_LEAD : ALL_PAGES_LEAD}`;
}

/** The line in the surface's foot. */
export function footText(kind: CardKind, device: LinkDevice | undefined, selecting = false): string {
  const one = cardNoun(kind);
  if (selecting) return `Click ${cardNoun(kind, 2)} to pick them. Shift+click picks every ${one} between two.`;
  if (device !== undefined) {
    const word = deviceWord(device.kind);
    return kind === "status_pages"
      ? `Click a status page to edit it. Drag to order. The order is this ${word}'s own.`
      : `Click a page to edit it. Drag to order, and Hide here keeps a page on this ${word} without showing it.`;
  }
  return kind === "status_pages"
    ? "Click a status page to edit it. Tick a device to put it there."
    : "Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.";
}

/** The line under a card's name: "11 tiles", "Smart page", "1 row · starter". */
export function cardDetail(entry: LibraryItem): string {
  return entry.starter ? `${entry.detail} · starter` : entry.detail;
}

/** "all", or one device's owner id. */
export type PagesFilter = string;
export const ALL_FILTER: PagesFilter = "all";

/** One device tab over the cards: All, then one per device, each with how
 * many it shows. */
export interface FilterChip {
  id: PagesFilter;
  label: string;
  kind?: LinkDevice["kind"];
  /** The device's color (`device-colors.ts`); All has none. */
  color?: string;
  count: number;
}

/** All with every item of the library, then each device with how many of
 * the kind it picks. */
export function filterChips(
  devices: readonly LinkDevice[],
  library: Library | undefined,
  kind: CardKind,
  colorOf: (ownerId: string) => string | undefined = () => undefined,
): FilterChip[] {
  return [
    { id: ALL_FILTER, label: "All", count: library === undefined ? 0 : libraryItems(library, kind).length },
    ...devices.map((d) => {
      const color = colorOf(d.ownerId);
      return {
        id: d.ownerId, label: d.name, kind: d.kind, ...(color === undefined ? {} : { color }),
        count: library === undefined ? 0 : countFor(library, d.ownerId, kind),
      };
    }),
  ];
}

/** A filter kept from before, or All once its device is gone. */
export function resolveFilter(filter: PagesFilter | undefined, devices: readonly LinkDevice[]): PagesFilter {
  return filter !== undefined && devices.some((d) => d.ownerId === filter) ? filter : ALL_FILTER;
}

/** The head's Device menu: every item, or only those on a watch, or only
 * those on an iPhone. */
export type PagesKind = "all" | "watch" | "iphone";

/** Whether the home has both watches and iPhones: only then is there a
 * Device menu to pick from. */
export function hasBothKinds(devices: readonly LinkDevice[]): boolean {
  return devices.some((d) => d.kind === "watch") && devices.some((d) => d.kind === "iphone");
}

/** A kind kept from before, or All once the home has no menu for it. */
export function resolveKind(kind: PagesKind | undefined, devices: readonly LinkDevice[]): PagesKind {
  return kind !== undefined && kind !== "all" && hasBothKinds(devices) ? kind : "all";
}

/** Whether one of an item's devices is of this kind. */
export function ownersOnKind(owners: readonly string[], kind: PagesKind, devices: readonly LinkDevice[]): boolean {
  return kind === "all" || devices.some((d) => d.kind === kind && owners.some((o) => sameId(o, d.ownerId)));
}

/** One option of the Device menu, with how many of the items it is given
 * it would show. */
export interface KindOption {
  key: PagesKind;
  label: string;
  count: number;
}

export function kindOptions(entries: readonly { owners: readonly string[] }[], devices: readonly LinkDevice[]): KindOption[] {
  return [
    { key: "all", label: "All", count: entries.length },
    { key: "watch", label: "Watches", count: entries.filter((e) => ownersOnKind(e.owners, "watch", devices)).length },
    { key: "iphone", label: "iPhones", count: entries.filter((e) => ownersOnKind(e.owners, "iphone", devices)).length },
  ];
}

/** Whether a name matches the search, in any case. An empty search
 * matches everything. */
export function matchesSearch(name: string, search: string): boolean {
  const words = search.trim().toLowerCase();
  return words === "" || name.toLowerCase().includes(words);
}

/** The cards the All tab shows: the library's items of the kind, in its
 * order, under the search and the Device menu. */
export function shownItems(library: Library, kind: CardKind, search = "", deviceKind: PagesKind = "all", devices: readonly LinkDevice[] = []): LibraryItem[] {
  return libraryItems(library, kind).filter((e) => matchesSearch(e.name, search) && ownersOnKind(e.owners, deviceKind, devices));
}

/** A device's tab: its picks in its own order, then the rest of the
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

/** The device a card opens on: the device tab's when it has the item, else
 * the first of the Device menu's kind, else the first watch, else the first
 * device that has it. Undefined for an item no listed device has. */
export function openDevice(entry: { owners: readonly string[] }, filter: PagesFilter, deviceKind: PagesKind, devices: readonly LinkDevice[]): LinkDevice | undefined {
  const holders = devices.filter((d) => entry.owners.some((o) => sameId(o, d.ownerId)));
  return (filter === ALL_FILTER ? undefined : holders.find((d) => d.ownerId === filter))
    ?? (deviceKind === "all" ? undefined : holders.find((d) => d.kind === deviceKind))
    ?? holders.find((d) => d.kind === "watch")
    ?? holders[0];
}

/** What a click on a card no device has says: it has no editor to open in
 * until a device has it. */
export function noOwnerText(kind: CardKind): string {
  return `No device has this ${cardNoun(kind)}. Tick one to edit it there.`;
}

/** A device tab's first heading. */
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

export const REST_HINT = "The rest of your home. Add one here with a tick.";

/** What a device tab says with nothing on the device. */
export function noPicksText(device: LinkDevice, kind: CardKind, search: string): string {
  if (search.trim() !== "") return `No ${cardNoun(kind)} on ${device.name} has that name.`;
  return `No ${cardNoun(kind, 2)} on ${device.name} yet. Tick one below, or make a new one.`;
}

/** What the All tab says with no card to show. */
export function emptyText(devices: readonly LinkDevice[], search: string, kind: PagesKind = "all", cardKind: CardKind = "pages"): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  const one = cardNoun(cardKind);
  if (search.trim() !== "") return `No ${one} has that name.`;
  if (kind !== "all") return `No ${one} here is on ${kind === "watch" ? "a watch" : "an iPhone"}.`;
  return cardKind === "status_pages"
    ? "Your home has no status pages yet. Use New status page to make one."
    : "Your home has no pages yet. Use New page to make one.";
}
