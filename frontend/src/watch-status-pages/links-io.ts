// The writes a status page's Devices menu and a delete on every device make
// beyond the status page editor's own draft, shared by that editor and the
// Pages tab: taking a status page off another device, and clearing the menu
// slots that showed one once it is gone there.

import { type HassLike, fetchWatchConfig, saveWatchConfig } from "../ha-api.js";
import type { ListRemoveIO, PagesRemoveResult } from "../watch-pages/links.js";
import { clearMenuRefs } from "../watch-pages/page-links-io.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";
import { keptStatusPagesDraft } from "./draft.js";
import { removeStatusPagesFrom } from "./links.js";
import type { StatusPagesDocument } from "./model.js";

/** Reading and saving a device's status pages record. */
export function statusPagesRemoveIO(hass: HassLike): ListRemoveIO<StatusPagesDocument> {
  return {
    read: (owner) => fetchWatchConfig(hass, owner, "status_pages"),
    save: (owner, base, document) => saveWatchConfig(hass, owner, "status_pages", base, document),
  };
}

/** Take status pages off one device in one save (`removeStatusPagesFrom`). */
export function removeStatusPagesOn(hass: HassLike, ownerId: string, pageIds: readonly string[]): Promise<PagesRemoveResult> {
  return removeStatusPagesFrom(statusPagesRemoveIO(hass), ownerId, pageIds);
}

/**
 * After status pages went from a device: take every Status page slot of its
 * menus that showed one of them out, in one save, as `clearPageRefs` does
 * for pages. A linked menu keeps its slots to `kept`, the status pages still
 * on another device. Page tiles that open them stay, as a page's do: a
 * linked page's tiles are shared. A note says what was cleared or could not
 * be.
 */
export async function clearStatusPageRefs(hass: HassLike, ownerId: string, pageIds: readonly string[], kept: readonly string[] = []): Promise<WatchPagesNote | undefined> {
  let slots: number;
  try {
    slots = await clearMenuRefs(hass, ownerId, pageIds, kept, true);
  } catch {
    return { kind: "warn", text: "Saved. Could not clear the deleted status page from the menus: change them by hand." };
  }
  if (slots === 0) return undefined;
  return { kind: "ok", text: `Saved. Cleared the deleted status page from ${slots} menu ${slots === 1 ? "slot" : "slots"}.` };
}

/**
 * Take one status page off a device at once, as `takePageOff` takes a page,
 * then clear the Status page slots there that showed it (`clearStatusPageRefs`).
 * A device whose status page editor holds unsaved edits in this tab is left
 * alone. Undefined when done, else what to say. `name` is the device's.
 */
export async function takeStatusPageOff(hass: HassLike | undefined, ownerId: string, pageId: string, name: string): Promise<string | undefined> {
  if (!hass) return `Not taken off ${name}.`;
  if (keptStatusPagesDraft(ownerId)?.dirty ?? false) {
    return `Not taken off ${name}: its status pages have unsaved edits. Save or discard them first.`;
  }
  const result = await removeStatusPagesOn(hass, ownerId, [pageId]);
  if (!result.ok) return `Not taken off ${name}: ${result.message}`;
  if (result.removed.length > 0) await clearStatusPageRefs(hass, ownerId, [pageId], [pageId]);
  return undefined;
}
