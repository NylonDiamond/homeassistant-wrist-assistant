// The writes the editors make on the library beside their own saves:
// "Delete from the library", which Home Assistant does in one command and
// which leaves the complications' taps to the panel, and the delete of an
// item no device has any more once this device's save took it off.

import { type HassLike, fetchList, saveRecord } from "../ha-api.js";
import type { LibraryListKind } from "../library/client.js";
import { devicesFor } from "../library/model.js";
import type { LibraryStore } from "../library/store.js";
import { isJsonObject } from "./model.js";
import { clearPageFromComplication } from "./page-refs.js";
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

/** The ids among `deleted` that the library holds and that no device but
 * `here` has: once this device's save took them off, nothing has them. */
export function orphanedBy(store: LibraryStore | undefined, kind: LibraryListKind, here: string, deleted: readonly string[]): string[] {
  const lib = store?.library;
  if (lib === undefined) return [];
  return deleted.filter((id) => {
    const owners = devicesFor(lib, kind, id);
    return owners.length > 0 && owners.every((o) => o.toUpperCase() === here.toUpperCase());
  });
}

/**
 * After a save that took pages off this device: delete from the library the
 * ones no other device has, so a page deleted on its only device is gone
 * rather than left in the library with no device ticked. `orphans` is
 * `orphanedBy` as worked out before the save. A refusal is let go: the item
 * stays in the library, where the tab can delete it.
 */
export async function deleteOrphans(store: LibraryStore | undefined, kind: LibraryListKind, orphans: readonly string[]): Promise<void> {
  if (store === undefined) return;
  for (const id of orphans) await store.deleteItem(kind, id);
}
