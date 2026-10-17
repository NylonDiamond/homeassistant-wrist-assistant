// The Pages tab and the Status pages tab: every page, or every status page,
// on every watch and iPhone, one card per page.
//
// A linked page (the same `linkId` on several devices, `links.ts`) is one
// card with a chip per device it is on; any other page is a card of its own.
// Linked status pages are cards the same way, on the Status pages tab.
//
// The app's five starter status pages (`isSystemStatusPage`) link like any
// other status page, and each has the same fixed id on every device. So a
// starter is one card for every device that holds that id: its linked copies
// and its unlinked ones together. While some copies are not linked the card
// says so, and its Link button links them all (`starterLink`); Home
// Assistant then takes over each target's own copy.
//
// This module is the pure part both tabs draw from: the cards and the device
// tabs over them, the Device menu (watches or iPhones), which device a card
// opens on, and the switches of a card's Devices menu. The element is
// `all-pages.ts`, told by its `kind` which of the two it lists.

import type { WatchPagesLinkKind } from "../ha-api.js";
import { type StatusPagesDocument, isSystemStatusPage, statusPageId, statusPageRows, statusPagesOf } from "../watch-status-pages/model.js";
import { statusPageLinkId, statusPageTitle } from "../watch-status-pages/links.js";
import { listedWatchPages } from "./edit.js";
import { type LinkDevice, type PageDevicePlace, DEVICES_SYSTEM_TEXT, DEVICES_WAIT_TAG, DEVICES_WAIT_TEXT, joinWords, pageLinkId } from "./links.js";
import { type WatchPage, type WatchPagesDocument, isHiddenWatchPage, isSmartWatchPage, isSystemWatchPage, watchPageId, watchPageName, watchPageTiles } from "./model.js";

/** What a card is: a page, or a status page. */
export type CardKind = WatchPagesLinkKind;

/** The second half of the line under the tab's title. */
export const ALL_PAGES_LEAD = "A page on more than one device is the same page: an edit shows on all of them.";

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

/** The line under the tab's title: how many pages, then the one fact about
 * them a newcomer gets wrong, as the Complications tab's line does. */
export function allPagesLead(total: number, kind: CardKind = "pages"): string {
  return `${total} ${cardNoun(kind, total)} on your watches and iPhones. ${kind === "status_pages" ? STATUS_PAGES_LEAD : ALL_PAGES_LEAD}`;
}

/** A page's only device cannot be switched off: that is a delete. */
export const DEVICES_LAST_TEXT = "This is its only device. Delete it in the page editor instead.";

/** The same for a status page, whose editor is the status pages editor. */
export const STATUS_DEVICES_LAST_TEXT = "This is its only device. Delete it in the status pages editor instead.";

/** A link copies the page as saved, so not while its editor holds edits. */
export const DEVICES_DIRTY_TEXT = "Save or discard the edits to these pages first. A page goes on another device as it is saved.";

/** The same for a status page. */
export const STATUS_DEVICES_DIRTY_TEXT = "Save or discard the edits to these status pages first. A status page goes on another device as it is saved.";

/** `DEVICES_DIRTY_TEXT` for a card of `kind`. */
export function devicesDirtyText(kind: CardKind): string {
  return kind === "status_pages" ? STATUS_DEVICES_DIRTY_TEXT : DEVICES_DIRTY_TEXT;
}

/** One device's copy of a page. */
export interface PageCopy {
  device: LinkDevice;
  /** The page, or for a status page card the status page, as stored. */
  page: WatchPage;
  /** Hidden on this device (`isHidden` is each device's own). Never for a
   * status page, which has no Hidden. */
  hidden: boolean;
  /** Its place in that device's list of pages, or of status pages. */
  index: number;
}

/** One card: a page, on every device that holds it. */
export interface PageCard {
  /** Stable across reads: the link, or the device and the page id. */
  key: string;
  /** A page, or a status page. */
  kind: CardKind;
  linkId?: string;
  pageId: string;
  name: string;
  tiles: number;
  /** A status page's rows; 0 for a page. */
  rows: number;
  smart: boolean;
  /** One of the app's starter status pages: its copies on every device are
   * on this one card, linked or not (`unlinkedCopies`). */
  starter?: true;
  /** In device order, never empty. */
  copies: PageCopy[];
}

const upper = (id: string): string => id.toUpperCase();

/**
 * Every page of every device as cards, in device order and then each
 * device's own page order: a linked page where it first shows, once, with
 * every device that holds its link. Then every status page the same way, as
 * status page cards from `statusDocs`. System pages are left out, as the page
 * editor lists none. A starter status page is one card for every device that
 * holds its id without a link, and those copies join its linked card when
 * there is one (`joinStarters`). A device not in `docs` or `statusDocs` (not
 * read, or no record) brings nothing of that kind.
 */
export function pageCards(
  devices: readonly LinkDevice[],
  docs: ReadonlyMap<string, WatchPagesDocument>,
  statusDocs: ReadonlyMap<string, StatusPagesDocument> = new Map(),
): PageCard[] {
  const cards: PageCard[] = [];
  const byKey = new Map<string, PageCard>();
  /** One copy onto its card, or a new card for it. */
  const place = (key: string, copy: PageCopy, card: () => Omit<PageCard, "key" | "copies">) => {
    const held = byKey.get(key);
    if (held !== undefined) {
      if (!held.copies.some((c) => c.device.ownerId === copy.device.ownerId)) held.copies.push(copy);
      return;
    }
    const made: PageCard = { key, ...card(), copies: [copy] };
    byKey.set(key, made);
    cards.push(made);
  };
  for (const device of devices) {
    const doc = docs.get(device.ownerId);
    if (doc === undefined) continue;
    listedWatchPages(doc).forEach((page, index) => {
      const pageId = watchPageId(page);
      if (pageId === "") return;
      const linkId = pageLinkId(page);
      const key = linkId === undefined ? `page:${device.ownerId}:${upper(pageId)}` : `link:${linkId}`;
      place(key, { device, page, hidden: isHiddenWatchPage(page), index }, () => {
        const smart = isSmartWatchPage(page);
        return {
          kind: "pages",
          pageId,
          name: watchPageName(page),
          tiles: smart ? 0 : watchPageTiles(page).length,
          rows: 0,
          smart,
          ...(linkId === undefined ? {} : { linkId }),
        };
      });
    });
  }
  for (const device of devices) {
    const doc = statusDocs.get(device.ownerId);
    if (doc === undefined) continue;
    statusPagesOf(doc).forEach((page, index) => {
      const pageId = statusPageId(page);
      if (pageId === "") return;
      const linkId = statusPageLinkId(page);
      const starter = isSystemStatusPage(page);
      // A starter's unlinked copies share one card: the same id is the same
      // starter on every device. Any other unlinked page is its device's own.
      const key = linkId !== undefined ? `status-link:${linkId}`
        : starter ? `status-starter:${upper(pageId)}` : `status:${device.ownerId}:${upper(pageId)}`;
      place(key, { device, page, hidden: false, index }, () => ({
        kind: "status_pages",
        pageId,
        name: statusPageTitle(page),
        tiles: 0,
        rows: statusPageRows(page).length,
        smart: false,
        ...(starter ? { starter: true as const } : {}),
        ...(linkId === undefined ? {} : { linkId }),
      }));
    });
  }
  return joinStarters(cards, devices);
}

/**
 * A starter's unlinked copies onto its linked card, when some devices hold
 * it linked: one card per starter, the linked one's place in the list, its
 * copies in device order. A starter linked twice over (two links, one id) is
 * two cards, and the unlinked copies join the first.
 */
function joinStarters(cards: PageCard[], devices: readonly LinkDevice[]): PageCard[] {
  const linked = new Map<string, PageCard>();
  for (const card of cards) {
    if (card.starter && card.linkId !== undefined && !linked.has(upper(card.pageId))) linked.set(upper(card.pageId), card);
  }
  if (linked.size === 0) return cards;
  const order = new Map(devices.map((d, i) => [d.ownerId, i]));
  return cards.filter((card) => {
    const into = card.starter && card.linkId === undefined ? linked.get(upper(card.pageId)) : undefined;
    if (into === undefined) return true;
    for (const copy of card.copies) {
      if (!into.copies.some((c) => c.device.ownerId === copy.device.ownerId)) into.copies.push(copy);
    }
    into.copies.sort((a, b) => (order.get(a.device.ownerId) ?? 0) - (order.get(b.device.ownerId) ?? 0));
    return false;
  });
}

/** A starter card's copies that carry no link: each is its device's own
 * copy of the starter. None for any other card. */
export function unlinkedCopies(card: PageCard): PageCopy[] {
  return card.starter ? card.copies.filter((c) => statusPageLinkId(c.page) === undefined) : [];
}

/** The line on a starter card whose copies are all their devices' own. */
export const STARTER_UNLINKED_TEXT = "Not linked: each device has its own copy.";

/**
 * The line on a starter card while some of its copies are not linked, or
 * undefined: none for a card on one device, or one whose copies are all
 * linked. "Not linked: each device has its own copy." when none is linked,
 * else which devices still hold their own.
 */
export function starterUnlinkedText(card: PageCard): string | undefined {
  const loose = unlinkedCopies(card);
  if (card.copies.length < 2 || loose.length === 0) return undefined;
  if (card.linkId === undefined) return STARTER_UNLINKED_TEXT;
  const names = joinWords(loose.map((c) => c.device.name));
  return `Not linked on ${names}: ${loose.length === 1 ? "it has its own copy" : "each has its own copy"}.`;
}

/** What a starter card's Link sends: `linkWatchPages` from `source` with
 * `pageId`, onto `targets`, kind `status_pages`. */
export interface StarterLink {
  source: string;
  pageId: string;
  targets: string[];
}

/**
 * A starter card's Link: every copy linked into one. With none linked yet
 * the source is the device tab's copy, else the first device holding it,
 * and the targets the others. With some linked, the source is a linked copy
 * (the device tab's when it is one) and the targets the unlinked copies.
 * Undefined when there is nothing to link (`starterUnlinkedText`), and
 * "dirty" when the source or a target holds unsaved edits in its status
 * pages editor: the link writes them all as saved.
 */
export function starterLink(card: PageCard, filter: PagesFilter, dirty: (ownerId: string, kind: CardKind) => boolean): StarterLink | "dirty" | undefined {
  if (starterUnlinkedText(card) === undefined) return undefined;
  const loose = unlinkedCopies(card);
  const tab = filter === ALL_FILTER ? undefined : copyOn(card, filter);
  let source: PageCopy;
  let targets: PageCopy[];
  if (card.linkId === undefined) {
    source = tab ?? card.copies[0]!;
    targets = card.copies.filter((c) => c !== source);
  } else {
    const held = card.copies.filter((c) => statusPageLinkId(c.page) === card.linkId);
    source = (tab !== undefined && held.includes(tab) ? tab : undefined) ?? held[0]!;
    targets = loose;
  }
  if ([source, ...targets].some((c) => dirty(c.device.ownerId, card.kind))) return "dirty";
  return { source: source.device.ownerId, pageId: statusPageId(source.page), targets: targets.map((c) => c.device.ownerId) };
}

/** What a starter's Link said once it was done. */
export function starterLinkedText(names: readonly string[]): string {
  return `Linked on ${joinWords(names)}. An edit on one now shows on all of them.`;
}

/** The cards of one kind, in the order given. */
export function cardsOfKind(cards: readonly PageCard[], kind: CardKind): PageCard[] {
  return cards.filter((c) => c.kind === kind);
}

/** "all", or one device's owner id. */
export type PagesFilter = string;
export const ALL_FILTER: PagesFilter = "all";

/** One device tab over the cards: All, then one per device, each with how
 * many pages it shows. */
export interface FilterChip {
  id: PagesFilter;
  label: string;
  kind?: LinkDevice["kind"];
  /** The device's color (`device-colors.ts`); All has none. */
  color?: string;
  count: number;
}

export function filterChips(
  devices: readonly LinkDevice[],
  cards: readonly PageCard[],
  colorOf: (ownerId: string) => string | undefined = () => undefined,
): FilterChip[] {
  return [
    { id: ALL_FILTER, label: "All", count: cards.length },
    ...devices.map((d) => {
      const color = colorOf(d.ownerId);
      return {
        id: d.ownerId, label: d.name, kind: d.kind, ...(color === undefined ? {} : { color }),
        count: cards.filter((c) => copyOn(c, d.ownerId) !== undefined).length,
      };
    }),
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

/** The head's Device menu: every page, or only those on a watch, or only
 * those on an iPhone. */
export type PagesKind = "all" | "watch" | "iphone";

/** Whether a card is on a device of this kind. */
export function onKind(card: PageCard, kind: PagesKind): boolean {
  return kind === "all" || card.copies.some((c) => c.device.kind === kind);
}

/** Whether the home has both watches and iPhones: only then is there a
 * Device menu to pick from. */
export function hasBothKinds(devices: readonly LinkDevice[]): boolean {
  return devices.some((d) => d.kind === "watch") && devices.some((d) => d.kind === "iphone");
}

/** A kind kept from before, or All once the home has no menu for it. */
export function resolveKind(kind: PagesKind | undefined, devices: readonly LinkDevice[]): PagesKind {
  return kind !== undefined && kind !== "all" && hasBothKinds(devices) ? kind : "all";
}

/** One option of the Device menu, with how many of the cards it is given
 * (those the tab and the search left) it would show. */
export interface KindOption {
  key: PagesKind;
  label: string;
  count: number;
}

export function kindOptions(cards: readonly PageCard[]): KindOption[] {
  return [
    { key: "all", label: "All", count: cards.length },
    { key: "watch", label: "Watches", count: cards.filter((c) => onKind(c, "watch")).length },
    { key: "iphone", label: "iPhones", count: cards.filter((c) => onKind(c, "iphone")).length },
  ];
}

/**
 * The cards a device tab, a search and the Device menu show. On one device,
 * only its pages, in its own order. The search matches the name, in any
 * case. The Device menu keeps the pages on that kind of device.
 */
export function shownCards(cards: readonly PageCard[], filter: PagesFilter, search = "", kind: PagesKind = "all"): PageCard[] {
  const words = search.trim().toLowerCase();
  const matched = (words === "" ? [...cards] : cards.filter((c) => c.name.toLowerCase().includes(words)))
    .filter((c) => onKind(c, kind));
  if (filter === ALL_FILTER) return matched;
  return matched
    .filter((c) => copyOn(c, filter) !== undefined)
    .sort((a, b) => copyOn(a, filter)!.index - copyOn(b, filter)!.index);
}

/** The copy a card opens in the page editor and draws: the device tab's,
 * else the first of the Device menu's kind, else the first watch's, else
 * the first device's. */
export function openCopy(card: PageCard, filter: PagesFilter, kind: PagesKind = "all"): PageCopy {
  return (filter === ALL_FILTER ? undefined : copyOn(card, filter))
    ?? (kind === "all" ? undefined : card.copies.find((c) => c.device.kind === kind))
    ?? card.copies.find((c) => c.device.kind === "watch")
    ?? card.copies[0]!;
}

/**
 * A card's Devices menu: a switch per device, on where the page is. The
 * page's only device cannot be switched off (a delete does that), and a
 * system page never moves. Unlike the editor's, no device is "this one". A
 * watch in `waiting` (`awaitingMove`) cannot take the page yet.
 */
export function cardDevicePlaces(devices: readonly LinkDevice[], card: PageCard, waiting: ReadonlySet<string> = new Set()): PageDevicePlace[] {
  const status = card.kind === "status_pages";
  const system = !status && card.copies.some((c) => isSystemWatchPage(c.page));
  const last = card.copies.length <= 1;
  return devices.map((device) => {
    const on = copyOn(card, device.ownerId) !== undefined;
    if (!system && !on && waiting.has(device.ownerId)) return { device, on, here: false, stuck: DEVICES_WAIT_TEXT, tag: DEVICES_WAIT_TAG };
    const stuck = system ? DEVICES_SYSTEM_TEXT : on && last ? (status ? STATUS_DEVICES_LAST_TEXT : DEVICES_LAST_TEXT) : undefined;
    return { device, on, here: false, ...(stuck === undefined ? {} : { stuck }) };
  });
}

/** The device a link copies the page from: the first that holds it with no
 * unsaved edits in its editor (the page editor, or for a status page the
 * status pages editor: `dirty` is asked with the card's kind), else
 * undefined (`devicesDirtyText`). On a linked card only a copy with its link
 * counts, so a starter's unlinked copy never starts a second link. */
export function linkSource(card: PageCard, dirty: (ownerId: string, kind: CardKind) => boolean): string | undefined {
  return card.copies.find((c) => (card.linkId === undefined || pageLinkId(c.page) === card.linkId) && !dirty(c.device.ownerId, card.kind))?.device.ownerId;
}

/** The line under a card's name: its tile count, or "Smart page", or a
 * status page's row count. */
export function cardDetail(card: PageCard): string {
  if (card.kind === "status_pages") return `${card.rows} ${card.rows === 1 ? "row" : "rows"}`;
  if (card.smart) return "Smart page";
  return `${card.tiles} ${card.tiles === 1 ? "tile" : "tiles"}`;
}

/** What the tab says with no card to show. */
export function emptyText(filter: PagesFilter, devices: readonly LinkDevice[], search: string, kind: PagesKind = "all", cardKind: CardKind = "pages"): string {
  if (devices.length === 0) return "No watch or iPhone has connected yet. Pair one on the Home tab.";
  const one = cardNoun(cardKind);
  if (search.trim() !== "") return `No ${one} has that name.`;
  if (kind !== "all") return `No ${one} here is on ${kind === "watch" ? "a watch" : "an iPhone"}.`;
  const device = devices.find((d) => d.ownerId === filter);
  if (cardKind === "status_pages") {
    if (device !== undefined) return `No status pages on ${device.name} yet.`;
    return "No device has status pages yet. Use New status page to make one.";
  }
  if (device !== undefined) return `No pages on ${device.name} yet.`;
  return "No device has pages yet. Open a device's Pages to make one.";
}
