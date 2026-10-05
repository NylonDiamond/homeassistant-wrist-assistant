// A watch's unsaved Watch settings, kept while the Settings page shows
// another watch or is not on screen: the behavior edits and the notification
// style edits, each with the copy they were made on. One per watch, held by
// the module the way every other watch screen keeps its drafts
// (`watch-rooms/draft.ts`), so moving to another watch, another screen or
// another tab loses nothing and asks nothing, and the panel's leave guards can
// ask whether any are unsaved.
//
// The page reads both records again whenever it comes back to a watch. A
// newer copy (the iPhone sent one, or Rooms saved the same `behavior`
// record) moves under the edits: they are key writes, so they stay on top of
// it, and an edit the newer copy already holds stops counting.

import type { WatchConfigRecord } from "./ha-api.js";
import { type BehaviorDocument, type SettingEdits, type SettingValue, dirtyKeys } from "./watch-settings.js";
import { type StyleDocument, type StyleEdits, type StyleValue, readStyleDocument, styleDirtyKeys } from "./watch-notification-style/model.js";

/** One watch's kept edits and the copies they were made on. */
export interface KeptSettings {
  behaviorRevision: number;
  behaviorDocument: BehaviorDocument | undefined;
  edits: SettingEdits;
  styleRevision: number;
  styleDocument: StyleDocument | undefined;
  styleEdits: StyleEdits;
}

const kept = new Map<string, KeptSettings>();

/** The unsaved changes in a kept draft, both records together. */
export function keptChanges(draft: KeptSettings): number {
  return dirtyKeys(draft.behaviorDocument, draft.edits).length + styleDirtyKeys(draft.styleDocument, draft.styleEdits).length;
}

/** Keep a watch's form as it stands. A form with nothing unsaved is
 * forgotten, so the store only ever holds work to lose. */
export function keepSettingsDraft(watchId: string, draft: KeptSettings): void {
  if (keptChanges(draft) > 0) kept.set(watchId, draft);
  else kept.delete(watchId);
}

export function keptSettingsDraft(watchId: string): KeptSettings | undefined {
  return kept.get(watchId);
}

/** Whether any watch's settings hold unsaved changes, for the panel's leave
 * guards. */
export function anyWatchSettingsDirty(): boolean {
  for (const draft of kept.values()) if (keptChanges(draft) > 0) return true;
  return false;
}

/** The person agreed to leave with settings unsaved: drop every watch's. */
export function dropWatchSettingsDrafts(): void {
  kept.clear();
}

/** What the form starts from after reading a watch's records. */
export interface RestoredSettings {
  edits: Map<string, SettingValue>;
  styleEdits: Map<string, StyleValue>;
  /** Kept edits that still change something now sit on a newer copy than
   * the one they were made on. The page says so. */
  moved: boolean;
}

type Read = Pick<WatchConfigRecord, "revision" | "document"> | undefined;

/**
 * Lay a kept draft over the records just read. Only edits the copy now held
 * does not already say are kept, and only for a record there is to save
 * over: a record that has gone (or that this panel cannot read) takes its
 * edits with it.
 */
export function restoreSettingsDraft(draft: KeptSettings | undefined, behavior: Read, style: Read): RestoredSettings {
  if (draft === undefined) return { edits: new Map(), styleEdits: new Map(), moved: false };
  const behaviorDocument = behavior !== undefined && behavior.revision > 0 ? behavior.document : undefined;
  const styleDocument = style !== undefined && style.revision > 0 ? readStyleDocument(style.document) : undefined;
  const edits = behaviorDocument === undefined ? new Map<string, SettingValue>() : only(draft.edits, dirtyKeys(behaviorDocument, draft.edits));
  const styleEdits = styleDocument === undefined ? new Map<string, StyleValue>() : only(draft.styleEdits, styleDirtyKeys(styleDocument, draft.styleEdits));
  const moved = (edits.size > 0 && behavior?.revision !== draft.behaviorRevision)
    || (styleEdits.size > 0 && style?.revision !== draft.styleRevision);
  return { edits, styleEdits, moved };
}

function only<V>(edits: ReadonlyMap<string, V>, keys: readonly string[]): Map<string, V> {
  const out = new Map<string, V>();
  for (const key of keys) out.set(key, edits.get(key)!);
  return out;
}

/** The page's line when kept edits moved onto a newer copy. */
export const SETTINGS_MOVED_TEXT =
  "These settings changed somewhere else since your edits. Your unsaved changes are kept on top of the newer copy, so check them and Save.";
