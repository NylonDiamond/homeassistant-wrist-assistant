// The writes a page leaving a device makes beyond the page editor's own
// draft: clearing the menu slots and complication taps there that opened it.
// The page editor runs it after a save that took pages off, and an untick of
// a device runs it after `library/pick` took the page off
// (`library-editing-io.ts`). The Pages tab's multi-select calls are
// `all-pages-io.ts`.

import { type HassLike, fetchList, fetchWatchConfig, saveRecord, saveWatchConfig } from "../ha-api.js";
import { isJsonObject } from "./model.js";
import { KEEP_NO_SLOT, type KeepSlot, clearPageFromComplication, clearPageFromMenus, clearStatusPageFromMenus, countMenuRefs } from "./page-refs.js";
import type { WatchPagesNote } from "./save-note.js";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Take the slots of a device's menus that open one of `pageIds` (Status page
 * slots with `status`) out of its menus record, in one save on the revision
 * just read. A slot `keep` says a shared menu still needs stays
 * (`clearPageFromMenus`). How many went; a failure rejects.
 */
export async function clearMenuRefs(hass: HassLike, ownerId: string, pageIds: readonly string[], keep: KeepSlot = KEEP_NO_SLOT, status = false): Promise<number> {
  const record = await fetchWatchConfig(hass, ownerId, "menus");
  if (record.revision <= 0 || !isJsonObject(record.document)) return 0;
  const before = record.document;
  const next = status ? clearStatusPageFromMenus(before, pageIds, keep) : clearPageFromMenus(before, pageIds, keep);
  if (next === before) return 0;
  await saveWatchConfig(hass, ownerId, "menus", record.revision, next);
  return countMenuRefs(before, pageIds, status) - countMenuRefs(next, pageIds, status);
}

/**
 * After pages went from a device: take every menu slot there that went to
 * one of them out of its menus record, and make every complication tap that
 * opened one do nothing, each in its own save on the revision just read. A
 * shared menu keeps the slots `keep` names (`keepSlotsOf`). A note says what
 * was cleared, or what could not be (the page is gone either way; a slot
 * left behind only fails on the device, as before).
 */
export async function clearPageRefs(hass: HassLike, ownerId: string, pageIds: string[], keep: KeepSlot = KEEP_NO_SLOT): Promise<WatchPagesNote | undefined> {
  let slots = 0;
  let taps = 0;
  const failed: string[] = [];
  try {
    slots = await clearMenuRefs(hass, ownerId, pageIds, keep);
  } catch {
    failed.push("the menus");
    slots = 0;
  }
  try {
    const list = await fetchList(hass, ownerId);
    for (const record of list.records) {
      if (record.deleted || !isJsonObject(record.document)) continue;
      const next = clearPageFromComplication(record.document, pageIds);
      if (next === undefined) continue;
      try {
        await saveRecord(hass, ownerId, next, record.revision);
        taps++;
      } catch {
        failed.push(`"${typeof record.document.name === "string" ? record.document.name : "a complication"}"`);
      }
    }
  } catch {
    failed.push("the complications");
  }
  const done = [
    slots > 0 ? plural(slots, "menu slot", "menu slots") : undefined,
    taps > 0 ? `the tap of ${plural(taps, "complication", "complications")}` : undefined,
  ].filter((w): w is string => w !== undefined);
  if (failed.length > 0) {
    return { kind: "warn", text: `Saved. Could not clear the deleted page from ${failed.join(", ")}: change ${failed.length === 1 ? "it" : "them"} by hand.` };
  }
  if (done.length === 0) return undefined;
  return { kind: "ok", text: `Saved. Cleared the deleted page from ${done.join(" and ")}.` };
}
