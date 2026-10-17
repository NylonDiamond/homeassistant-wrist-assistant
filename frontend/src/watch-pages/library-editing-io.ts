// The writes the editors and the tabs make on the library beside their own
// saves: "Delete from the library", which Home Assistant does in one command
// and which leaves the complications' taps to the panel, and a tick, whose
// untick leaves that device's menu slots and taps to the panel too. An item
// nobody picks any more stays in the library (plan: map back), where the
// tab's Delete removes it.

import { type HassLike, fetchList, saveRecord } from "../ha-api.js";
import type { LibraryListKind, LibraryPickReply } from "../library/client.js";
import type { LibraryStore, LibraryWrite } from "../library/store.js";
import { clearStatusPageRefs } from "../watch-status-pages/links-io.js";
import { isJsonObject } from "./model.js";
import { clearPageRefs } from "./page-links-io.js";
import { clearPageFromComplication, keepSlotsOf } from "./page-refs.js";
import type { WatchPagesNote } from "./save-note.js";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Make every complication tap on `owners` that opened one of `pageIds` do
 * nothing, each complication in its own save on the revision just read.
 * `library/delete` takes the page out of every device's pages, tiles and
 * menus, but complications live in their own store. A note says what was
 * cleared, or what could not be; undefined when nothing opened the page.
 */
export async function clearComplicationTaps(hass: HassLike, owners: readonly string[], pageIds: readonly string[]): Promise<WatchPagesNote | undefined> {
  let taps = 0;
  const failed: string[] = [];
  for (const owner of owners) {
    try {
      const list = await fetchList(hass, owner);
      for (const record of list.records) {
        if (record.deleted || !isJsonObject(record.document)) continue;
        const next = clearPageFromComplication(record.document, pageIds);
        if (next === undefined) continue;
        try {
          await saveRecord(hass, owner, next, record.revision);
          taps++;
        } catch {
          failed.push(`"${typeof record.document.name === "string" ? record.document.name : "a complication"}"`);
        }
      }
    } catch {
      failed.push("the complications");
    }
  }
  if (failed.length > 0) return { kind: "warn", text: `Could not clear the deleted page from ${failed.join(", ")}: change ${failed.length === 1 ? "it" : "them"} by hand.` };
  if (taps === 0) return undefined;
  return { kind: "ok", text: `Cleared the deleted page from the tap of ${plural(taps, "complication", "complications")}.` };
}

/**
 * A tick on a page's or status page's device row: put it on the device
 * (`library/pick` on), or take it off. Taking it off is the pick alone on
 * the server, which leaves the device's menu slots and complication taps
 * that opened it; so once the untick lands, those are cleared there, as
 * after a delete on that device (`clearPageRefs`, `clearStatusPageRefs`). A
 * shared menu keeps a slot another device using it still needs
 * (`keepSlotsOf`). The pick's own answer comes back; a slot or tap that
 * could not be cleared only fails on the device, so it is let go.
 */
export async function tickItem(
  hass: HassLike | undefined,
  store: LibraryStore,
  ownerId: string,
  kind: LibraryListKind,
  itemId: string,
  on: boolean,
): Promise<LibraryWrite<LibraryPickReply>> {
  const result = await store.pick(ownerId, kind, itemId, on);
  if (on || !result.ok || hass === undefined) return result;
  // The store read the library again before the pick settled: this device
  // is off the item now, and the other devices are as they are.
  const keep = keepSlotsOf(store.library, ownerId, kind);
  if (kind === "pages") await clearPageRefs(hass, ownerId, [itemId], keep);
  else await clearStatusPageRefs(hass, ownerId, [itemId], keep);
  return result;
}
