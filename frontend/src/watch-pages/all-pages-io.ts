// The calls the multi-select of the Pages and Status pages tabs makes
// (`all-pages-bulk.ts`), for pages and for status pages: linking, taking them off a
// device in one save, and clearing what opened them there. Kept
// apart from `page-links-io.ts` so the page editor does not load the
// status pages' half.

import { type HassLike, linkWatchPages } from "../ha-api.js";
import { clearStatusPageRefs, removeStatusPagesOn } from "../watch-status-pages/links-io.js";
import type { BulkIO } from "./all-pages-bulk.js";
import { removePagesFrom } from "./links.js";
import { clearPageRefs, pagesRemoveIO } from "./page-links-io.js";

export function pagesBulkIO(hass: HassLike): BulkIO {
  return {
    link: (source, pageIds, target, kind) => linkWatchPages(hass, source, pageIds, [target], kind),
    remove: (ownerId, pageIds, kind) => (kind === "status_pages"
      ? removeStatusPagesOn(hass, ownerId, pageIds)
      : removePagesFrom(pagesRemoveIO(hass), ownerId, pageIds)),
    clearRefs: (ownerId, pageIds, kind, kept) => (kind === "status_pages"
      ? clearStatusPageRefs(hass, ownerId, pageIds, kept)
      : clearPageRefs(hass, ownerId, pageIds, kept)),
  };
}
