// The page drafts the editor keeps, one per watch, for as long as the panel's
// page is open.
//
// A draft lives here and not in the element, so it survives leaving the
// editor for the complications and coming back, and switching watch tabs:
// the element is made anew each time the route opens. The entry file asks
// through `hook.ts` whether any of them holds edits, without importing this
// chunk.

import { WatchPagesDraft } from "./draft.js";
import type { WatchPagesDocument } from "./model.js";

/** The page and tile selected when the editor last showed a watch. */
export interface WatchPagesSelection {
  pageId?: string;
  tileId?: string;
}

const drafts = new Map<string, WatchPagesDraft>();
const selections = new Map<string, WatchPagesSelection>();

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
 */
export function takeWatchPagesRecord(
  watchId: string,
  document: WatchPagesDocument,
  revision: number,
): TakenWatchPagesRecord {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
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
}
