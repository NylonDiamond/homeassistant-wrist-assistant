// The calls the Pages and Status pages tabs make beyond the library store:
// the multi-select's Delete (`all-pages-bulk.ts`), with the complication taps
// that opened a deleted page, and a device tab's Hide here and order, which
// are a save of that device's own record (`all-pages-picks.ts`).

import { type HassLike, fetchList, fetchWatchConfig, saveRecord, saveWatchConfig } from "../ha-api.js";
import { deleteLibraryItem, libraryErrorCode, libraryErrorText } from "../library/client.js";
import type { BulkIO } from "./all-pages-bulk.js";
import type { PicksIO } from "./all-pages-picks.js";
import { isJsonObject } from "./model.js";
import { clearPageFromComplication } from "./page-refs.js";

/**
 * Make every complication tap of one device that opened one of `pageIds` do
 * nothing, each in its own save over the revision just read: the half of
 * clearing a page's references that `library/delete` leaves, since the
 * complications are a store of their own. False when some could not be.
 */
export async function clearPageTaps(hass: HassLike, ownerId: string, pageIds: readonly string[]): Promise<boolean> {
  let ok = true;
  const list = await fetchList(hass, ownerId);
  for (const record of list.records) {
    if (record.deleted || !isJsonObject(record.document)) continue;
    const next = clearPageFromComplication(record.document, pageIds);
    if (next === undefined) continue;
    try {
      await saveRecord(hass, ownerId, next, record.revision);
    } catch {
      ok = false;
    }
  }
  return ok;
}

/** The delete's calls, against Home Assistant. The deletes go straight to
 * `library/delete`; the tab reads the library once after them all. */
export function pagesBulkIO(hass: HassLike): BulkIO {
  return {
    delete: async (kind, itemId) => {
      try {
        return { ok: true, reply: await deleteLibraryItem(hass, kind, itemId) };
      } catch (err) {
        const code = libraryErrorCode(err);
        const text = libraryErrorText(err);
        return code === undefined ? { ok: false, text } : { ok: false, code, text };
      }
    },
    clearTaps: (ownerId, pageIds) => clearPageTaps(hass, ownerId, pageIds),
  };
}

/** Reading and saving a device's pages or status pages record. */
export function picksIO(hass: HassLike): PicksIO {
  return {
    read: (ownerId, kind) => fetchWatchConfig(hass, ownerId, kind),
    save: (ownerId, kind, base, document) => saveWatchConfig(hass, ownerId, kind, base, document),
  };
}
