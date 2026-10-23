// The write a status page leaving a device makes beyond the status page
// editor's own draft: clearing the menu slots there that showed it. The
// editor runs it after a save that took status pages off, and an untick of a
// device runs it after `library/pick` took the status page off
// (`library-editing-io.ts`).

import type { HassLike } from "../ha-api.js";
import { type ClearedPageRefs, clearMenuRefs } from "../watch-pages/page-links-io.js";
import { KEEP_NO_SLOT, type KeepSlot } from "../watch-pages/page-refs.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";

/**
 * After status pages went from a device: take every Status page slot of its
 * menus that showed one of them out, in one save, as `clearPageRefCounts`
 * does for pages. A shared menu keeps the slots `keep` names
 * (`keepSlotsOf`). Page tiles that open them stay, as a page's do: a library
 * page's tiles are shared. Says how many went, or that the menus could not
 * be cleared.
 */
export async function clearStatusPageRefCounts(hass: HassLike, ownerId: string, pageIds: readonly string[], keep: KeepSlot = KEEP_NO_SLOT): Promise<ClearedPageRefs> {
  try {
    return { slots: await clearMenuRefs(hass, ownerId, pageIds, keep, true), taps: 0, complications: 0, failed: [] };
  } catch {
    return { slots: 0, taps: 0, complications: 0, failed: ["the menus"] };
  }
}

/** `clearStatusPageRefCounts` after a save, with a note that says what was
 * cleared or could not be. */
export async function clearStatusPageRefs(hass: HassLike, ownerId: string, pageIds: readonly string[], keep: KeepSlot = KEEP_NO_SLOT): Promise<WatchPagesNote | undefined> {
  const { slots, failed } = await clearStatusPageRefCounts(hass, ownerId, pageIds, keep);
  if (failed.length > 0) return { kind: "warn", text: "Saved. Could not clear the deleted status page from the menus: change them by hand." };
  if (slots === 0) return undefined;
  return { kind: "ok", text: `Saved. Cleared the deleted status page from ${slots} menu ${slots === 1 ? "slot" : "slots"}.` };
}
