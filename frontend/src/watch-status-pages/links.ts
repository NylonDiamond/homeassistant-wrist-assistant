// Linked status pages, the Status pages tab's cards: one status page on
// several devices, the same id in each device's `status_pages` record with a
// `linkId`, as a linked page is (`watch-pages/links.ts`). Home Assistant
// writes a save of one copy to the others itself.
//
// This module is the pure part the status page editor draws from: the
// switches of a status page's Devices menu, the status pages other devices
// hold that this one does not (its Not on this list), and taking status
// pages out of another device's record. The five system status pages are
// never linked (Home Assistant copies them), so they get no Devices menu and
// are never listed.

import type { WatchPagesPlaces } from "../ha-api.js";
import {
  DEVICES_HERE_TEXT,
  DEVICES_WAIT_TAG,
  DEVICES_WAIT_TEXT,
  type LinkDevice,
  type ListRemoveIO,
  type ListedRemoval,
  PAGE_LINK_KEY,
  type PageDevicePlace,
  type PagesRemoveResult,
  removeListedFrom,
  statusPageHolders,
} from "../watch-pages/links.js";
import type { JsonObject } from "../watch-pages/model.js";
import {
  type StatusPagesDocument,
  asStatusPagesDocument,
  findStatusPage,
  isSystemStatusPage,
  removeStatusPage,
  statusPageId,
  statusPageName,
  statusPagesOf,
} from "./model.js";

/** A status page's link id, or undefined for one on this device alone. */
export function statusPageLinkId(page: Readonly<JsonObject> | undefined): string | undefined {
  const link = page?.[PAGE_LINK_KEY];
  return typeof link === "string" && link !== "" ? link : undefined;
}

/** A status page's name as the lists show it. */
export function statusPageTitle(page: JsonObject): string {
  return statusPageName(page) || "Untitled page";
}

/** Whether a status page can have a Devices menu: any but a system page. */
export function statusPageMayLink(page: JsonObject): boolean {
  return !isSystemStatusPage(page);
}

/**
 * The Devices menu for one status page, the page editor's rules: a switch
 * per device, on where the page is. The device the editor is on cannot be
 * switched off (Delete does that). A watch in `waiting` (`awaitingMove`, from
 * the status pages records) cannot take the page yet.
 */
export function statusPageDevicePlaces(
  devices: readonly LinkDevice[],
  page: JsonObject,
  here: string,
  places: WatchPagesPlaces | undefined,
  waiting: ReadonlySet<string> = new Set(),
): PageDevicePlace[] {
  const holders = new Set(statusPageHolders(page, here, places));
  return devices.map((device) => {
    const isHere = device.ownerId === here;
    const on = holders.has(device.ownerId);
    if (!isHere && !on && waiting.has(device.ownerId)) {
      return { device, on, here: false, stuck: DEVICES_WAIT_TEXT, tag: DEVICES_WAIT_TAG };
    }
    return { device, on, here: isHere, ...(isHere ? { stuck: DEVICES_HERE_TEXT } : {}) };
  });
}

/** One status page another device holds and this one does not. */
export interface ElsewhereStatusPage {
  ownerId: string;
  pageId: string;
  linkId?: string;
  name: string;
  page: JsonObject;
}

/** The status pages one other device brings to the list. */
export interface ElsewhereStatusGroup {
  device: LinkDevice;
  pages: ElsewhereStatusPage[];
}

const key = (id: string): string => id.toUpperCase();

/**
 * The status page editor's Not on this list: every status page the other
 * devices hold that this one does not, grouped by the device it comes from,
 * in device order. A linked one is listed once, under the first device that
 * holds it. One whose id this device holds already is left out (adding it
 * could only be refused), and so are the system pages. `docs` is each other
 * device's status pages, as read; a device not in it lists nothing.
 */
export function elsewhereStatusPages(
  here: string,
  hereDoc: StatusPagesDocument | undefined,
  devices: readonly LinkDevice[],
  docs: ReadonlyMap<string, StatusPagesDocument>,
): ElsewhereStatusGroup[] {
  const herePages = statusPagesOf(hereDoc);
  const hereIds = new Set(herePages.map((p) => key(statusPageId(p))));
  const seenLinks = new Set(herePages.flatMap((p) => statusPageLinkId(p) ?? []));
  const groups: ElsewhereStatusGroup[] = [];
  for (const device of devices) {
    if (device.ownerId === here) continue;
    const doc = docs.get(device.ownerId);
    if (doc === undefined) continue;
    const pages: ElsewhereStatusPage[] = [];
    for (const page of statusPagesOf(doc)) {
      const pageId = statusPageId(page);
      if (pageId === "" || isSystemStatusPage(page) || hereIds.has(key(pageId))) continue;
      const linkId = statusPageLinkId(page);
      if (linkId !== undefined) {
        if (seenLinks.has(linkId)) continue;
        seenLinks.add(linkId);
      }
      pages.push({ ownerId: device.ownerId, pageId, name: statusPageTitle(page), page, ...(linkId === undefined ? {} : { linkId }) });
    }
    if (pages.length > 0) groups.push({ device, pages });
  }
  return groups;
}

/** A device's status pages, for `removeListedFrom`. */
const STATUS_LIST: ListedRemoval<StatusPagesDocument> = {
  document: asStatusPagesDocument,
  find: (document, id) => {
    const page = findStatusPage(document, id);
    return page === undefined ? undefined : statusPageId(page);
  },
  remove: removeStatusPage,
};

/**
 * Take several status pages off one device in one save, as
 * `removePagesFrom` takes pages: read its status pages, save them without
 * every one listed in `pageIds` over the revision read, and read again on a
 * conflict. `removed` names the ids that were there. Nothing else on the
 * device changes: a tile or a menu slot there that opened the page stays, as
 * the status page editor's own delete leaves them.
 */
export function removeStatusPagesFrom(io: ListRemoveIO<StatusPagesDocument>, owner: string, pageIds: readonly string[]): Promise<PagesRemoveResult> {
  return removeListedFrom(io, owner, pageIds, STATUS_LIST);
}
