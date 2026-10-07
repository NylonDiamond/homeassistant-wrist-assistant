// The three-way merge of the watch's menus.
//
// The grain is the document's top-level keys: the Anywhere menu
// (`quickAction`), the Entity quick menu (`entityRadial`) and the page
// switcher (`pageSwitcher`), each one value. A key the local side changed
// since the base keeps the local value; every other key takes the server's.
// The iPhone used to run the same rule (`WatchConfigMirror`, `.mergeByKey`)
// with itself as the local side; in the panel the local side is the draft. The
// case files in `frontend/test/fixtures-menus/merge` are the specification
// both sides run.
//
// This is the behavior settings' merge (`mergeWatchPagesByKey`), which judges
// a change by the phone's JSON equality and keeps the inputs as they are.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", items 5 and 10).

import { mergeWatchPagesByKey, sameWatchPagesJson } from "../watch-pages/merge.js";
import { type MenusDocument, WATCH_MENUS_SECTIONS, type WatchMenusSection } from "./model.js";

function sectionOf(document: MenusDocument | null | undefined, section: WatchMenusSection): unknown {
  return document !== null && document !== undefined && Object.hasOwn(document, section) ? document[section] : undefined;
}

/**
 * The sections both sides changed since `base`, each to something else: the
 * merge keeps `local`'s and drops `server`'s change there. In the phone's
 * order. With no base, every section the two hold differently.
 */
export function watchMenusClashes(base: MenusDocument | null | undefined, local: MenusDocument, server: MenusDocument): WatchMenusSection[] {
  return WATCH_MENUS_SECTIONS.filter((section) => {
    const b = sectionOf(base, section);
    const l = sectionOf(local, section);
    const s = sectionOf(server, section);
    const changed = (x: unknown) => base === null || base === undefined || !sameWatchPagesJson(x, b);
    return changed(l) && changed(s) && !sameWatchPagesJson(l, s);
  });
}

/**
 * The merge of `local` (the draft) and `server` (the newer document Home
 * Assistant holds) against `base` (what the draft was made from). With no
 * base every key local holds counts as its own. A `null` at the top reads as
 * absent and is left out.
 */
export function mergeWatchMenus(base: MenusDocument | null | undefined, local: MenusDocument, server: MenusDocument): MenusDocument {
  return mergeWatchPagesByKey(base, local, server);
}
