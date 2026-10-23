// The writes the editors and the tabs make on the library beside their own
// saves: "Delete from the library", which Home Assistant does in one command
// and which leaves the complications' taps to the panel, and a tick, whose
// untick leaves that device's menu slots and taps to the panel too, and so
// asks first when there are any (`askUntick`). An item nobody picks any
// more stays in the library (plan: map back), where the tab's Delete
// removes it.

import { type HassLike, fetchList, saveRecord } from "../ha-api.js";
import type { LibraryListKind, LibraryPickReply } from "../library/client.js";
import type { LibraryStore, LibraryWrite } from "../library/store.js";
import { clearStatusPageRefCounts } from "../watch-status-pages/links-io.js";
import { untickAskText, untickNote } from "./library-editing.js";
import { isJsonObject } from "./model.js";
import { clearPageRefCounts, countPageRefs } from "./page-links-io.js";
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

/** What an untick's question and note call the item and the device. */
export interface TickNames {
  item: string;
  device: string;
}

/** A tick's answer: the pick's own, and after an untick given `TickNames`
 * the note on what it cleared there (`untickNote`). */
export type TickResult = LibraryWrite<LibraryPickReply> & { note?: WatchPagesNote };

/**
 * A tick on a page's or status page's device row: put it on the device
 * (`library/pick` on), or take it off. Taking it off is the pick alone on
 * the server, which leaves the device's menu slots and complication taps
 * that opened it; so once the untick lands, those are cleared there, as
 * after a delete on that device (`clearPageRefCounts`,
 * `clearStatusPageRefCounts`). A shared menu keeps a slot another device
 * using it still needs (`keepSlotsOf`). The pick's own answer comes back,
 * with a note on what was cleared when `names` are given; a slot or tap
 * that could not be cleared only fails on the device, so the note says so
 * and the untick stands. An untick that would clear something asks first
 * (`askUntick`).
 */
export async function tickItem(
  hass: HassLike | undefined,
  store: LibraryStore,
  ownerId: string,
  kind: LibraryListKind,
  itemId: string,
  on: boolean,
  names?: TickNames,
): Promise<TickResult> {
  const result = await store.pick(ownerId, kind, itemId, on);
  if (on || !result.ok || hass === undefined) return result;
  // The store read the library again before the pick settled: this device
  // is off the item now, and the other devices are as they are.
  const keep = keepSlotsOf(store.library, ownerId, kind);
  const cleared = kind === "pages"
    ? await clearPageRefCounts(hass, ownerId, [itemId], keep)
    : await clearStatusPageRefCounts(hass, ownerId, [itemId], keep);
  const note = names === undefined ? undefined : untickNote(names.item, names.device, cleared, cleared.failed);
  return note === undefined ? result : { ...result, note };
}

/** An untick waiting on its question, shown under the tick row
 * (`TicksInput.ask`) until Remove or Cancel. */
export interface UntickAsk {
  kind: LibraryListKind;
  itemId: string;
  ownerId: string;
  names: TickNames;
  text: string;
}

/**
 * A click on a ticked chip. One click used to take the item off at once,
 * and with it every menu slot and complication tap there that opened it,
 * which ticking again does not bring back. So this counts them first, as
 * the untick would clear them (`countPageRefs`, with the same `keepSlotsOf`;
 * this device's own pick does not change what it keeps): with none, it
 * unticks at once and settles undefined; with some, or when they could not
 * be read, it settles the question for the caller to show, whose Remove is
 * `tickItem` with the same names. Without Home Assistant nothing would be
 * cleared, so it unticks at once.
 */
export async function askUntick(
  hass: HassLike | undefined,
  store: LibraryStore,
  ownerId: string,
  kind: LibraryListKind,
  itemId: string,
  names: TickNames,
): Promise<UntickAsk | undefined> {
  const count = hass === undefined
    ? { slots: 0, taps: 0 }
    : await countPageRefs(hass, ownerId, [itemId], keepSlotsOf(store.library, ownerId, kind), kind === "status_pages");
  if (count !== undefined && count.slots + count.taps === 0) {
    await tickItem(hass, store, ownerId, kind, itemId, false);
    return undefined;
  }
  return { kind, itemId, ownerId, names, text: untickAskText(kind, names.item, names.device, count) };
}
