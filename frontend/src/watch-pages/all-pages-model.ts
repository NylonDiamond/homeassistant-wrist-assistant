// The Pages tab: every page on every watch and iPhone, one card per page.
//
// A linked page (the same `linkId` on several devices, `links.ts`) is one
// card with a chip per device it is on; any other page is a card of its own.
// This module is the pure part the tab draws from: the cards, the filter
// chips over them, which device a card opens on, and the switches of a
// card's Devices menu. The element is `all-pages.ts`.

import { listedWatchPages } from "./edit.js";
import { type LinkDevice, type PageDevicePlace, DEVICES_SYSTEM_TEXT, pageLinkId } from "./links.js";
import { type WatchPage, type WatchPagesDocument, isHiddenWatchPage, isSmartWatchPage, isSystemWatchPage, watchPageId, watchPageName, watchPageTiles } from "./model.js";

/** The line under the tab's title. */
export const ALL_PAGES_LEAD = "Every page on your watches and iPhones. A page on more than one device is the same page: an edit shows on all of them.";

/** A page's only device cannot be switched off: that is a delete. */
export const DEVICES_LAST_TEXT = "This is its only device. Delete it in the page editor instead.";

/** A link copies the page as saved, so not while its editor holds edits. */
export const DEVICES_DIRTY_TEXT = "Save or discard the edits to these pages first. A page goes on another device as it is saved.";

/** One device's copy of a page. */
export interface PageCopy {
  device: LinkDevice;
  page: WatchPage;
  /** Hidden on this device (`isHidden` is each device's own). */
  hidden: boolean;
  /** Its place in that device's list of pages. */
  index: number;
}

/** One card: a page, on every device that holds it. */
export interface PageCard {
  /** Stable across reads: the link, or the device and the page id. */
  key: string;
  linkId?: string;
  pageId: string;
  name: string;
  tiles: number;
  smart: boolean;
  /** In device order, never empty. */
  copies: PageCopy[];
}

const upper = (id: string): string => id.toUpperCase();

/**
 * Every page of every device as cards, in device order and then each
 * device's own page order: a linked page where it first shows, once, with
 * every device that holds its link. System pages are left out, as the page
 * editor lists none. A device not in `docs` (not read, or no record) brings
 * nothing.
 */
export function pageCards(devices: readonly LinkDevice[], docs: ReadonlyMap<string, WatchPagesDocument>): PageCard[] {
  const cards: PageCard[] = [];
  const byKey = new Map<string, PageCard>();
  for (const device of devices) {
    const doc = docs.get(device.ownerId);
    if (doc === undefined) continue;
    listedWatchPages(doc).forEach((page, index) => {
      const pageId = watchPageId(page);
      if (pageId === "") return;
      const linkId = pageLinkId(page);
      const key = linkId === undefined ? `page:${device.ownerId}:${upper(pageId)}` : `link:${linkId}`;
      const copy: PageCopy = { device, page, hidden: isHiddenWatchPage(page), index };
      const held = byKey.get(key);
      if (held !== undefined) {
        if (!held.copies.some((c) => c.device.ownerId === device.ownerId)) held.copies.push(copy);
        return;
      }
      const smart = isSmartWatchPage(page);
      const card: PageCard = {
        key,
        pageId,
        name: watchPageName(page),
        tiles: smart ? 0 : watchPageTiles(page).length,
        smart,
        copies: [copy],
        ...(linkId === undefined ? {} : { linkId }),
      };
      byKey.set(key, card);
      cards.push(card);
    });
  }
  return cards;
}

/** "all", or one device's owner id. */
export type PagesFilter = string;
export const ALL_FILTER: PagesFilter = "all";

/** One chip over the cards: All, then one per device, each with how many
 * pages it shows. */
export interface FilterChip {
  id: PagesFilter;
  label: string;
  kind?: LinkDevice["kind"];
  count: number;
}

export function filterChips(devices: readonly LinkDevice[], cards: readonly PageCard[]): FilterChip[] {
  return [
    { id: ALL_FILTER, label: "All", count: cards.length },
    ...devices.map((d) => ({ id: d.ownerId, label: d.name, kind: d.kind, count: cards.filter((c) => copyOn(c, d.ownerId) !== undefined).length })),
  ];
}

/** A filter kept from before, or All once its device is gone. */
export function resolveFilter(filter: PagesFilter | undefined, devices: readonly LinkDevice[]): PagesFilter {
  return filter !== undefined && devices.some((d) => d.ownerId === filter) ? filter : ALL_FILTER;
}

/** A card's copy on one device, if it is there. */
export function copyOn(card: PageCard, ownerId: string): PageCopy | undefined {
  return card.copies.find((c) => c.device.ownerId === ownerId);
}

/**
 * The cards a filter and a search show. On one device, only its pages, in
 * its own order. The search matches the name, in any case.
 */
export function shownCards(cards: readonly PageCard[], filter: PagesFilter, search = ""): PageCard[] {
  const words = search.trim().toLowerCase();
  const matched = words === "" ? [...cards] : cards.filter((c) => c.name.toLowerCase().includes(words));
  if (filter === ALL_FILTER) return matched;
  return matched
    .filter((c) => copyOn(c, filter) !== undefined)
    .sort((a, b) => copyOn(a, filter)!.index - copyOn(b, filter)!.index);
}

/** The copy a card opens in the page editor: the filtered device's, else
 * the first watch's, else the first device's. */
export function openCopy(card: PageCard, filter: PagesFilter): PageCopy {
  return (filter === ALL_FILTER ? undefined : copyOn(card, filter))
    ?? card.copies.find((c) => c.device.kind === "watch")
    ?? card.copies[0]!;
}

/**
 * A card's Devices menu: a switch per device, on where the page is. The
 * page's only device cannot be switched off (a delete does that), and a
 * system page never moves. Unlike the editor's, no device is "this one".
 */
export function cardDevicePlaces(devices: readonly LinkDevice[], card: PageCard): PageDevicePlace[] {
  const system = card.copies.some((c) => isSystemWatchPage(c.page));
  const last = card.copies.length <= 1;
  return devices.map((device) => {
    const on = copyOn(card, device.ownerId) !== undefined;
    const stuck = system ? DEVICES_SYSTEM_TEXT : on && last ? DEVICES_LAST_TEXT : undefined;
    return { device, on, here: false, ...(stuck === undefined ? {} : { stuck }) };
  });
}

/** The device a link copies the page from: the first that holds it with no
 * unsaved edits in its editor, else undefined (`DEVICES_DIRTY_TEXT`). */
export function linkSource(card: PageCard, dirty: (ownerId: string) => boolean): string | undefined {
  return card.copies.find((c) => !dirty(c.device.ownerId))?.device.ownerId;
}

/** The line under a card's name: its tile count, or "Smart page". */
export function cardDetail(card: PageCard): string {
  if (card.smart) return "Smart page";
  return `${card.tiles} ${card.tiles === 1 ? "tile" : "tiles"}`;
}

/** What the tab says with no card to show. */
export function emptyText(filter: PagesFilter, devices: readonly LinkDevice[], search: string): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  if (search.trim() !== "") return "No page has that name.";
  const device = devices.find((d) => d.ownerId === filter);
  if (device !== undefined) return `No pages on ${device.name} yet.`;
  return "No device has pages yet. Open a device's Pages to make one.";
}
