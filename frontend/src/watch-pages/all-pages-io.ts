// The calls the Pages tab's multi-select makes (`all-pages-bulk.ts`), for
// pages and for info pages (status pages): linking, taking them off a
// device in one save, and for pages clearing what opened them there. Kept
// apart from `page-links-io.ts` so the page editor does not load the
// status pages' half.

import { type HassLike, linkWatchPages } from "../ha-api.js";
import { removeStatusPagesOn } from "../watch-status-pages/links-io.js";
import type { BulkIO } from "./all-pages-bulk.js";
import { removePagesFrom } from "./links.js";
import { clearPageRefs, pagesRemoveIO } from "./page-links-io.js";

export function pagesBulkIO(hass: HassLike): BulkIO {
  return {
    link: (source, pageIds, target, kind) => linkWatchPages(hass, source, pageIds, [target], kind),
    remove: (ownerId, pageIds, kind) => (kind === "status_pages"
      ? removeStatusPagesOn(hass, ownerId, pageIds)
      : removePagesFrom(pagesRemoveIO(hass), ownerId, pageIds)),
    // A status page's delete leaves the tiles and menu slots that open it,
    // as the status pages editor's own delete does.
    clearRefs: (ownerId, pageIds, kind) => (kind === "status_pages" ? Promise.resolve(undefined) : clearPageRefs(hass, ownerId, pageIds)),
  };
}
