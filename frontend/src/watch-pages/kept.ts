// The page drafts the editor keeps, one per watch, for as long as the panel's
// page is open.
//
// A draft lives here and not in the element, so it survives leaving the
// editor for the complications and coming back, and switching watch tabs:
// the element is made anew each time the route opens. The entry file asks
// through `hook.ts` whether any of them holds edits, without importing this
// chunk.

import { WatchPagesDraft, startWatchPages } from "./draft.js";
import type { WatchEditOptions } from "./edit.js";
import type { WatchPagesDocument } from "./model.js";

/** The page and tile selected when the editor last showed a watch. */
export interface WatchPagesSelection {
  pageId?: string;
  tileId?: string;
}

const drafts = new Map<string, WatchPagesDraft>();
const selections = new Map<string, WatchPagesSelection>();
/** The watches whose kept draft began with no record in Home Assistant, on
 * the ready page (`readyWatchPagesDraft`), until a record is taken. */
const ready = new Set<string>();

/** The draft kept for a watch, if any. */
export function keptWatchPagesDraft(watchId: string): WatchPagesDraft | undefined {
  return drafts.get(watchId);
}

export function keptWatchPagesSelection(watchId: string): WatchPagesSelection {
  return selections.get(watchId) ?? {};
}

export function keepWatchPagesSelection(watchId: string, selection: WatchPagesSelection): void {
  selections.set(watchId, { ...selection });
}

/** The devices whose page editor should add a page as it opens: the Pages
 * tab's New page asked for one there. */
const newPageAsks = new Set<string>();

/** Ask the editor to add a page on `watchId` the next time it reads them. */
export function askNewWatchPage(watchId: string): void {
  newPageAsks.add(watchId);
}

/** Whether a page was asked for on `watchId`, forgetting the ask. */
export function takeNewWatchPageAsk(watchId: string): boolean {
  return newPageAsks.delete(watchId);
}

export interface TakenWatchPagesRecord {
  draft: WatchPagesDraft;
  /** The draft held edits and the record changed the document on screen:
   * the person is told their edits were kept. */
  mergedIntoEdits: boolean;
}

/**
 * A record of `watchId`'s pages was read: `document` at `revision`.
 *
 * - Nothing kept: a new draft of it.
 * - A draft at an older revision: rebased onto it, so its edits stay.
 * - A draft at the same revision: kept as it is.
 * - A draft at a newer revision than the record: the store started over (the
 *   record was removed and uploaded again). A clean draft is replaced by a
 *   new one. A dirty one is restarted on the record (`restart`): its edits
 *   are merged onto it and it takes the record's revision, so its next save
 *   names a revision the store holds. Kept at its old revision, every save
 *   would meet a conflict and the edits could never be saved.
 *
 * Revision 0 is no record at all, never a document: the draft is left as it
 * is (the view says a dirty one is kept) until a record comes.
 *
 * A draft on the ready page (`readyWatchPagesDraft`) is no copy of a record:
 * the first record taken replaces it when it holds no edits, and is merged
 * under its edits when it does, as any other newer record is.
 */
export function takeWatchPagesRecord(
  watchId: string,
  document: WatchPagesDocument,
  revision: number,
): TakenWatchPagesRecord {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false };
  ready.delete(watchId);
  if (held === undefined || (revision < held.revision && !held.dirty) || (held.revision <= 0 && !held.dirty)) {
    const fresh = new WatchPagesDraft(document, revision);
    drafts.set(watchId, fresh);
    return { draft: fresh, mergedIntoEdits: false };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed };
}

/** Forget a watch's draft, as after a restore: the next record read starts a
 * new one, with no undo step that could take the restore back. */
export function forgetWatchPagesDraft(watchId: string): void {
  drafts.delete(watchId);
  ready.delete(watchId);
}

/**
 * The draft a watch with no pages in Home Assistant opens on: one empty page
 * (`startWatchPages`), held at revision 0 and only in memory. It holds no
 * edits, so nothing asks before leaving, and its first save, over revision
 * 0, creates the record. Discard comes back to the empty page.
 *
 * A draft that began this way is handed back as it is, its first save
 * included, until a record is taken (`takeWatchPagesRecord`). `open` says
 * whether a new one may be made now: false while the editor waits for the
 * iPhone's move, so only the start fresh link makes one. Never over edits
 * kept from a record Home Assistant no longer holds: those wait for a
 * record, as before. A clean draft of a record that went away is replaced.
 */
export function readyWatchPagesDraft(watchId: string, open: boolean, options?: WatchEditOptions): WatchPagesDraft | undefined {
  const held = drafts.get(watchId);
  if (held !== undefined && ready.has(watchId)) return held;
  if (!open || held?.dirty === true) return undefined;
  const fresh = new WatchPagesDraft(startWatchPages(options), 0);
  drafts.set(watchId, fresh);
  ready.add(watchId);
  return fresh;
}

/** Whether the watch's kept draft is still on the ready page: it began with
 * no record and no save of it has landed yet. */
export function watchPagesDraftIsNew(watchId: string): boolean {
  return ready.has(watchId) && (drafts.get(watchId)?.revision ?? 1) <= 0;
}

/** Whether any kept draft holds edits. */
export function anyWatchPagesDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

/** Drop every kept draft, as when the person agreed to leave the panel. */
export function dropAllWatchPages(): void {
  drafts.clear();
  selections.clear();
  ready.clear();
}
