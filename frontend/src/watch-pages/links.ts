// Linked pages: one page on several devices.
//
// A page on more than one device is the same page `id` in each device's own
// `pages` record, with a `linkId` key on the page. Everything on the page is
// shared but its place in the list and `isHidden`, which stay each device's.
// Home Assistant writes every save of a linked page to the other copies
// itself, so the editor saves its own device as always. System pages are
// never linked, nor are rooms.
//
// This module is the pure part the page editor draws from: which devices
// hold a page, the switches of its Devices menu, the badge on its row, the
// pages other devices hold that this one does not, the delete choices, and
// the one write the panel makes on another device (taking a page off it).
// Plan: app repo docs/linked_pages_plan_2026-10.md, step 3.

import type { OwnerSummary, WatchConfigRecord, WatchPagesLinkReply, WatchPagesPlaces } from "../ha-api.js";
import { deviceKindOf } from "../version.js";
import { WAIT_FOR_IPHONE_TEXT, noRecordStart, watchAppDevices, watchName } from "../watch-settings.js";
import { deleteWatchPage, findWatchPage, listedWatchPages } from "./edit.js";
import { type WatchPage, type WatchPagesDocument, asWatchPagesDocument, isSystemWatchPage, watchPageId, watchPageName, watchPagesOf } from "./model.js";
import { watchCommandError } from "./save-note.js";

/** The key a linked page carries. */
export const PAGE_LINK_KEY = "linkId";

/** One device as these rules read it. */
export interface LinkDevice {
  ownerId: string;
  /** The name the editor shows for it, "Jesse's iPhone". */
  name: string;
  kind: "watch" | "iphone";
}

/** Every device a page can be on: the Watch app's devices (the watches
 * and, on a home that keeps phone pages, the iPhones), named as the editor
 * names them. */
export function linkDevicesOf(owners: readonly OwnerSummary[], phones: boolean): LinkDevice[] {
  const devices = watchAppDevices(owners, phones);
  return devices.map((o) => ({ ownerId: o.owner_watch_id, name: watchName(o, devices), kind: deviceKindOf(o) === "iphone" ? "iphone" : "watch" }));
}

/** "iPhone" or "watch", as the lines name the device on screen. */
export function deviceWord(kind: LinkDevice["kind"]): string {
  return kind === "iphone" ? "iPhone" : "watch";
}

const key = (id: string): string => id.toUpperCase();

/** The page's link id, or undefined for a page on one device only. */
export function pageLinkId(page: WatchPage | undefined): string | undefined {
  const link = page?.[PAGE_LINK_KEY];
  return typeof link === "string" && link !== "" ? link : undefined;
}

/**
 * The devices that hold a page, `here` first: for a linked page every
 * device `places` lists for its link, for any other only `here`. `places`
 * undefined (not read yet, or an integration without linked pages) knows of
 * no other device.
 */
export function pageHolders(page: WatchPage | undefined, here: string, places: WatchPagesPlaces | undefined): string[] {
  const link = pageLinkId(page);
  const listed = link === undefined ? [] : (places?.pages[link] ?? []);
  return [here, ...listed.filter((id) => id !== here)];
}

/** One switch of a page's Devices menu. */
export interface PageDevicePlace {
  device: LinkDevice;
  /** The page is on this device. */
  on: boolean;
  /** This is the device the editor is on. */
  here: boolean;
  /** Why the switch cannot be flipped, or undefined when it can. */
  stuck?: string;
  /** A few words drawn on the switch's row for why, when its title alone
   * would hide them: "waiting for iPhone". */
  tag?: string;
}

/** The text for the device the editor is on, whose switch never goes off. */
export const DEVICES_HERE_TEXT = "Delete takes it off this device.";
/** A system page's switches, all greyed. */
export const DEVICES_SYSTEM_TEXT = "A system page stays on its own device.";

/**
 * The Devices menu for one page: a switch per device, on where the page is.
 * The device the editor is on cannot be switched off (Delete does that), and
 * nothing moves for a system page. A watch in `waiting` (`awaitingMove`)
 * cannot take the page yet.
 */
export function pageDevicePlaces(
  devices: readonly LinkDevice[],
  page: WatchPage,
  here: string,
  places: WatchPagesPlaces | undefined,
  waiting: ReadonlySet<string> = new Set(),
): PageDevicePlace[] {
  const holders = new Set(pageHolders(page, here, places));
  const system = isSystemWatchPage(page);
  return devices.map((device) => {
    const isHere = device.ownerId === here;
    const on = holders.has(device.ownerId);
    if (!system && !isHere && !on && waiting.has(device.ownerId)) {
      return { device, on, here: false, stuck: DEVICES_WAIT_TEXT, tag: DEVICES_WAIT_TAG };
    }
    const stuck = system ? DEVICES_SYSTEM_TEXT : isHere ? DEVICES_HERE_TEXT : undefined;
    return { device, on, here: isHere, ...(stuck === undefined ? {} : { stuck }) };
  });
}

// ── what a device's own pages record says ─────────────────────────────────
//
// A watch whose iPhone may still move its pages here (`noRecordStart` is
// `wait`) while Home Assistant holds no pages for it cannot take a page from
// another device yet: its page editor waits for that move, and a page put
// there first would make the move skip its pages for good. Home Assistant
// refuses such a link too (`awaiting_move`). A watch that told Home
// Assistant it is on the free plan (`multiple_pages` false) shows only its
// first page, so a page added there says so.

/** What the panel read of one device's pages record. */
export interface PagesRecordFacts {
  /** Home Assistant holds a pages record for it (revision above 0). */
  held: boolean;
  /** The device said it is on the free plan. */
  free: boolean;
}

/** The facts of one pages record as read. */
export function pagesRecordFacts(record: Pick<WatchConfigRecord, "revision" | "multiple_pages">): PagesRecordFacts {
  return { held: record.revision > 0, free: record.multiple_pages === false };
}

/** The row's few words for a watch that waits for its iPhone. */
export const DEVICES_WAIT_TAG = "waiting for iPhone";
/** Its title, in the page editor's own wait words. */
export const DEVICES_WAIT_TEXT = `${WAIT_FOR_IPHONE_TEXT} Pages can go on this watch after that.`;

/**
 * The watches that wait for their iPhone to move their pages here: the page
 * editor's rule (`noRecordStart` is `wait`) while Home Assistant holds no
 * pages record for them. A device whose record was not read does not wait
 * here; Home Assistant still refuses it if it should.
 */
export function awaitingMove(owners: readonly OwnerSummary[], facts: ReadonlyMap<string, PagesRecordFacts>): Set<string> {
  return new Set(owners
    .filter((o) => facts.get(o.owner_watch_id)?.held === false && noRecordStart(o) === "wait")
    .map((o) => o.owner_watch_id));
}

/** The line after pages went on devices on the free plan: "On the free
 * plan, Jesse's Watch shows only its first page." Undefined for none. */
export function freePlanText(names: readonly string[]): string | undefined {
  if (names.length === 0) return undefined;
  return `On the free plan, ${joinWords(names)} ${names.length === 1 ? "shows only its" : "show only their"} first page.`;
}

// ── linked status pages ──────────────────────────────────────────────────
//
// Status pages link the same way: the same id in each device's
// `status_pages` record, with a `linkId`, and Home Assistant writes a save of
// one to its other copies. A link brings them along with the pages whose
// tiles open them, and one can be linked on its own (`kind` `status_pages`).
// The status page editor's Devices menu and its Not on this list are
// `watch-status-pages/links.ts`.

/** The devices that hold a status page, `here` first: for a linked one
 * every device `places` lists for its link, for any other only `here`. */
export function statusPageHolders(page: Readonly<Record<string, unknown>> | undefined, here: string, places: WatchPagesPlaces | undefined): string[] {
  const link = page?.[PAGE_LINK_KEY];
  const listed = typeof link === "string" && link !== "" ? (places?.status_pages[link] ?? []) : [];
  return [here, ...listed.filter((id) => id !== here)];
}

/**
 * The line over a device's status pages when some are on other devices too:
 * "These status pages are also on Jesse's iPhone. An edit here shows there
 * too." Undefined when none is.
 */
export function statusPagesSharedText(
  pages: readonly Readonly<Record<string, unknown>>[],
  here: string,
  places: WatchPagesPlaces | undefined,
  devices: readonly LinkDevice[],
): string | undefined {
  const holders = pages.map((p) => statusPageHolders(p, here, places).filter((id) => id !== here));
  const linked = holders.filter((h) => h.length > 0).length;
  if (linked === 0) return undefined;
  const others = new Set(holders.flat());
  const known = devices.filter((d) => others.has(d.ownerId)).map((d) => d.name);
  const unknown = [...others].filter((id) => !devices.some((d) => d.ownerId === id)).length;
  const names = unknown === 0 ? known : [...known, unknown === 1 ? "another device" : `${unknown} other devices`];
  const which = linked === pages.length
    ? (linked === 1 ? "This status page is" : "These status pages are")
    : `${linked} of these status pages ${linked === 1 ? "is" : "are"}`;
  return `${which} also on ${joinWords(names)}. An edit here shows there too.`;
}

/** The small badge on a linked page's row: "Also on Jesse's iPhone", or
 * "On 3 devices" once there are more than two. Undefined for a page on this
 * device alone. */
export function linkBadgeText(holders: readonly string[], here: string, devices: readonly LinkDevice[]): string | undefined {
  const others = holders.filter((id) => id !== here);
  if (others.length === 0) return undefined;
  if (others.length === 1) {
    const name = devices.find((d) => d.ownerId === others[0])?.name;
    return name === undefined ? "On 2 devices" : `Also on ${name}`;
  }
  return `On ${holders.length} devices`;
}

/** One page another device holds and this one does not. */
export interface ElsewherePage {
  ownerId: string;
  pageId: string;
  linkId?: string;
  name: string;
  page: WatchPage;
}

/** The pages one other device brings to the list. */
export interface ElsewhereGroup {
  device: LinkDevice;
  pages: ElsewherePage[];
}

/**
 * The pages the page editor's other devices line counts (it used to list
 * them, as "Not on this iPhone"): every page the other devices hold that this
 * one does not, grouped by the device it comes from, in device order. A
 * linked page is listed once, under the first device that holds it. A page
 * whose id this device holds already is not listed: adding it here could
 * only be refused. System pages never are. `docs` is each other device's
 * pages, as read; a device not in it lists nothing.
 */
export function elsewherePages(
  here: string,
  hereDoc: WatchPagesDocument | undefined,
  devices: readonly LinkDevice[],
  docs: ReadonlyMap<string, WatchPagesDocument>,
): ElsewhereGroup[] {
  const herePages = hereDoc === undefined ? [] : watchPagesOf(hereDoc);
  const hereIds = new Set(herePages.map((p) => key(watchPageId(p))));
  const seenLinks = new Set(herePages.flatMap((p) => pageLinkId(p) ?? []));
  const groups: ElsewhereGroup[] = [];
  for (const device of devices) {
    if (device.ownerId === here) continue;
    const doc = docs.get(device.ownerId);
    if (doc === undefined) continue;
    const pages: ElsewherePage[] = [];
    for (const page of listedWatchPages(doc)) {
      const pageId = watchPageId(page);
      if (pageId === "" || hereIds.has(key(pageId))) continue;
      const linkId = pageLinkId(page);
      if (linkId !== undefined) {
        if (seenLinks.has(linkId)) continue;
        seenLinks.add(linkId);
      }
      pages.push({ ownerId: device.ownerId, pageId, name: watchPageName(page), page, ...(linkId === undefined ? {} : { linkId }) });
    }
    if (pages.length > 0) groups.push({ device, pages });
  }
  return groups;
}

/** The heading over that list. */
export function elsewhereTitle(kind: LinkDevice["kind"]): string {
  return `Not on this ${deviceWord(kind)}`;
}

/** The page editor's one line under its page list in place of that list:
 * "3 pages on other devices.", or undefined when there are none. */
export function elsewhereLine(groups: readonly ElsewhereGroup[]): string | undefined {
  const n = groups.reduce((sum, g) => sum + g.pages.length, 0);
  if (n === 0) return undefined;
  return `${n} ${n === 1 ? "page" : "pages"} on other devices.`;
}

/** The delete question's two answers for a page on several devices, or
 * undefined for a page on this device alone. */
export function deleteChoices(holders: readonly string[], kind: LinkDevice["kind"]): { here: string; all: string; count: number } | undefined {
  if (holders.length < 2) return undefined;
  return { here: `Delete on this ${deviceWord(kind)}`, all: `Delete on all ${holders.length} devices`, count: holders.length };
}

/** "A, B and C". */
export function joinWords(words: readonly string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]!}`;
}

/**
 * What else a link put on `target`, beside the pages asked for: "Also added:
 * Lights and 1 status page". Undefined when it added nothing more. Page names
 * come from `source`, the device the pages came from.
 */
export function linkAlsoAddedText(
  reply: WatchPagesLinkReply,
  target: string,
  asked: readonly string[],
  source: WatchPagesDocument | undefined,
): string | undefined {
  const added = reply.targets?.[target];
  if (added === undefined) return undefined;
  const askedKeys = new Set(asked.map(key));
  const names = (added.pages ?? []).filter((id) => !askedKeys.has(key(id))).map((id) => {
    const page = source === undefined ? undefined : findWatchPage(source, id);
    return page === undefined ? "a page" : watchPageName(page);
  });
  const status = (added.status_pages ?? []).length;
  const words = [...names];
  if (status > 0) words.push(status === 1 ? "1 status page" : `${status} status pages`);
  return words.length === 0 ? undefined : `Also added: ${joinWords(words)}.`;
}

/** A link refusal in the editor's words. */
export function linkErrorText(err: unknown): string {
  const { code, message } = watchCommandError(err);
  switch (code) {
    case "unknown_device": return "That device is not paired with this Home Assistant any more.";
    case "not_found": return "That page is not saved there yet. Save first, then try again.";
    case "system_page": return DEVICES_SYSTEM_TEXT;
    case "id_taken": return "That device already has a page of its own with the same id, so it was not added.";
    case "unknown_command": return "This version of the integration cannot share pages between devices. Update it first.";
    case "awaiting_move": return `${WAIT_FOR_IPHONE_TEXT} Try again after that.`;
    default: return message;
  }
}

// ── taking a page off another device ──────────────────────────────────────

/** The calls `removePageFrom` needs, and `removeListedFrom` for a document
 * of another kind. */
export interface ListRemoveIO<D> {
  read(owner: string): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(owner: string, baseRevision: number, document: D): Promise<{ revision: number }>;
}

export type PageRemoveIO = ListRemoveIO<WatchPagesDocument>;

/** How `removeListedFrom` reads one kind of document and takes an entry
 * out of its list. */
export interface ListedRemoval<D> {
  /** The record's document, or undefined for one there is nothing to take
   * out of. */
  document(value: unknown): D | undefined;
  /** The id of the listed entry `id` names, as the document spells it, or
   * undefined when it lists none. */
  find(document: D, id: string): string | undefined;
  remove(document: D, id: string): D;
}

/** A watch's pages, for `removeListedFrom`. */
const PAGES_LIST: ListedRemoval<WatchPagesDocument> = {
  document: asWatchPagesDocument,
  find: (document, id) => {
    const page = findWatchPage(document, id);
    return page === undefined ? undefined : watchPageId(page);
  },
  remove: (document, id) => deleteWatchPage(document, id),
};

/** The most times one removal is sent before conflicts end it. */
export const PAGE_REMOVE_ATTEMPTS = 3;

export type PageRemoveResult = { ok: true; removed: boolean } | { ok: false; code: string; message: string };

/**
 * Take one page off another device: read its pages, save them without the
 * page over the revision read, and read again on a conflict. The tiles there
 * that open the page stay, as a delete that keeps them does: a linked page's
 * tiles are shared, and taking them away here would take them off every
 * device. `removed` false: the page was not there.
 */
export async function removePageFrom(io: PageRemoveIO, owner: string, pageId: string): Promise<PageRemoveResult> {
  const result = await removePagesFrom(io, owner, [pageId]);
  return result.ok ? { ok: true, removed: result.removed.length > 0 } : result;
}

export type PagesRemoveResult = { ok: true; removed: string[] } | { ok: false; code: string; message: string };

/**
 * Take several pages off one device in one save, as `removePageFrom` takes
 * one: read its pages, save them without every listed page among `pageIds`
 * over the revision read, and read again on a conflict. `removed` names the
 * ids that were there (as the document spells them); empty when none was,
 * and then nothing is saved.
 */
export async function removePagesFrom(io: PageRemoveIO, owner: string, pageIds: readonly string[]): Promise<PagesRemoveResult> {
  return removeListedFrom(io, owner, pageIds, PAGES_LIST);
}

/** `removePagesFrom` for any kind whose document lists entries by id: the
 * status pages too (`watch-status-pages/links.ts`). */
export async function removeListedFrom<D extends object>(io: ListRemoveIO<D>, owner: string, pageIds: readonly string[], list: ListedRemoval<D>): Promise<PagesRemoveResult> {
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(owner);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const doc = record.revision > 0 ? list.document(record.document) : undefined;
    if (doc === undefined) return { ok: true, removed: [] };
    let next: D = doc;
    const removed: string[] = [];
    for (const pageId of pageIds) {
      const held = list.find(next, pageId);
      if (held === undefined) continue;
      removed.push(held);
      next = list.remove(next, pageId);
    }
    if (removed.length === 0) return { ok: true, removed };
    try {
      await io.save(owner, record.revision, next);
      return { ok: true, removed };
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      if (code !== "conflict" || attempt >= PAGE_REMOVE_ATTEMPTS) return { ok: false, code, message };
    }
  }
}
