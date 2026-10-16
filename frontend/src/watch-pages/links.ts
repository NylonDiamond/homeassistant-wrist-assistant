// Linked pages: one page on several devices.
//
// A page on more than one device is the same page `id` in each device's own
// `pages` record, with a `linkId` key on the page. Everything on the page is
// shared but its place in the list and `isHidden`, which stay each device's.
// Home Assistant writes every save of a linked page to the other copies
// itself, so the editor saves its own device as always. System pages are
// never linked, nor are menus and rooms.
//
// This module is the pure part the page editor draws from: which devices
// hold a page, the switches of its Devices menu, the badge on its row, the
// pages other devices hold that this one does not, the delete choices, and
// the one write the panel makes on another device (taking a page off it).
// Plan: app repo docs/linked_pages_plan_2026-10.md, step 3.

import type { OwnerSummary, WatchConfigRecord, WatchPagesLinkReply, WatchPagesPlaces } from "../ha-api.js";
import { deviceKindOf } from "../version.js";
import { watchAppDevices, watchName } from "../watch-settings.js";
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
}

/** The text for the device the editor is on, whose switch never goes off. */
export const DEVICES_HERE_TEXT = "Delete takes it off this device.";
/** A system page's switches, all greyed. */
export const DEVICES_SYSTEM_TEXT = "A system page stays on its own device.";

/**
 * The Devices menu for one page: a switch per device, on where the page is.
 * The device the editor is on cannot be switched off (Delete does that), and
 * nothing moves for a system page.
 */
export function pageDevicePlaces(
  devices: readonly LinkDevice[],
  page: WatchPage,
  here: string,
  places: WatchPagesPlaces | undefined,
): PageDevicePlace[] {
  const holders = new Set(pageHolders(page, here, places));
  const system = isSystemWatchPage(page);
  return devices.map((device) => {
    const isHere = device.ownerId === here;
    const stuck = system ? DEVICES_SYSTEM_TEXT : isHere ? DEVICES_HERE_TEXT : undefined;
    return { device, on: holders.has(device.ownerId), here: isHere, ...(stuck === undefined ? {} : { stuck }) };
  });
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
    default: return message;
  }
}

// ── taking a page off another device ──────────────────────────────────────

/** The calls `removePageFrom` needs. */
export interface PageRemoveIO {
  read(owner: string): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(owner: string, baseRevision: number, document: WatchPagesDocument): Promise<{ revision: number }>;
}

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
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(owner);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const doc = record.revision > 0 ? asWatchPagesDocument(record.document) : undefined;
    if (doc === undefined) return { ok: true, removed: [] };
    let next = doc;
    const removed: string[] = [];
    for (const pageId of pageIds) {
      const page = findWatchPage(next, pageId);
      if (page === undefined) continue;
      removed.push(watchPageId(page));
      next = deleteWatchPage(next, pageId);
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
