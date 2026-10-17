// The writes a status page's Devices menu and a delete on every device make
// beyond the status page editor's own draft, shared by that editor and the
// Pages tab: taking a status page off another device.

import { type HassLike, fetchWatchConfig, saveWatchConfig } from "../ha-api.js";
import type { ListRemoveIO, PagesRemoveResult } from "../watch-pages/links.js";
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
 * Take one status page off a device at once, as `takePageOff` takes a page.
 * A device whose status page editor holds unsaved edits in this tab is left
 * alone. Undefined when done, else what to say. `name` is the device's.
 */
export async function takeStatusPageOff(hass: HassLike | undefined, ownerId: string, pageId: string, name: string): Promise<string | undefined> {
  if (!hass) return `Not taken off ${name}.`;
  if (keptStatusPagesDraft(ownerId)?.dirty ?? false) {
    return `Not taken off ${name}: its status pages have unsaved edits. Save or discard them first.`;
  }
  const result = await removeStatusPagesOn(hass, ownerId, [pageId]);
  return result.ok ? undefined : `Not taken off ${name}: ${result.message}`;
}
