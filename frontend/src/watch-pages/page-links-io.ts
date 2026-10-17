// The writes a page's Devices menu and a delete make beyond the page
// editor's own draft, shared by the page editor and the Pages tab
// (`all-pages.ts`): taking a page off one device, and clearing the menu
// slots and complication taps that opened a page once it is gone there.
// The Pages tab's multi-select calls are `all-pages-io.ts`.

import { type HassLike, fetchList, fetchWatchConfig, saveRecord, saveWatchConfig } from "../ha-api.js";
import { keptWatchPagesDraft } from "./kept.js";
import { type PageRemoveIO, removePageFrom } from "./links.js";
import { isJsonObject } from "./model.js";
import { clearPageFromComplication, clearPageFromMenus, menuSlotsOpeningPage } from "./page-refs.js";
import type { WatchPagesNote } from "./save-note.js";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * After pages went from a device: take every menu slot there that went to
 * one of them out of its menus record, and make every complication tap that
 * opened one do nothing, each in its own save on the revision just read. A
 * note says what was cleared, or what could not be (the page is gone either
 * way; a slot left behind only fails on the device, as before).
 */
export async function clearPageRefs(hass: HassLike, ownerId: string, pageIds: string[]): Promise<WatchPagesNote | undefined> {
  let slots = 0;
  let taps = 0;
  const failed: string[] = [];
  try {
    const record = await fetchWatchConfig(hass, ownerId, "menus");
    if (record.revision > 0 && isJsonObject(record.document)) {
      const next = clearPageFromMenus(record.document, pageIds);
      if (next !== record.document) {
        slots = pageIds.reduce((n, id) => n + menuSlotsOpeningPage(record.document as Record<string, unknown>, id).length, 0);
        await saveWatchConfig(hass, ownerId, "menus", record.revision, next);
      }
    }
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

/** Reading and saving a device's pages record. */
export function pagesRemoveIO(hass: HassLike): PageRemoveIO {
  return {
    read: (o) => fetchWatchConfig(hass, o, "pages"),
    save: (o, base, document) => saveWatchConfig(hass, o, "pages", base, document),
  };
}

/**
 * Take one page off a device at once (`removePageFrom`): its pages saved
 * without it, over the revision read. The tiles there that open it stay,
 * since a linked page's tiles are shared. Then that device's menu slots and
 * complication taps that opened it are cleared, as after a delete. A device
 * whose page editor holds unsaved edits in this tab is left alone.
 * Undefined when done, else what to say. `name` is the device's.
 */
export async function takePageOff(hass: HassLike | undefined, ownerId: string, pageId: string, name: string): Promise<string | undefined> {
  if (!hass) return `Not taken off ${name}.`;
  if (keptWatchPagesDraft(ownerId)?.dirty ?? false) {
    return `Not taken off ${name}: its pages have unsaved edits. Save or discard them first.`;
  }
  const result = await removePageFrom(pagesRemoveIO(hass), ownerId, pageId);
  if (!result.ok) return `Not taken off ${name}: ${result.message}`;
  if (result.removed) await clearPageRefs(hass, ownerId, [pageId]);
  return undefined;
}
