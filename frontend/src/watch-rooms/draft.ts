// A watch's room edits, kept while the editor is closed: the key writes over
// the `behavior` revision they were made on, with undo and redo. One per
// watch, held by the module, so leaving the Rooms route and coming back finds
// them, and the panel's leave guards can ask whether any are unsaved.
//
// A newer revision (the iPhone saved, or a save here came back) moves the
// base under the edits. The edits are key writes, so they stay on top of it
// (room by room for the two room records, see `carryRoomEdits`), and an
// edit the newer copy already holds stops counting.

import type { WatchConfigRecord } from "../ha-api.js";
import {
  type BehaviorDocument,
  type RoomEdits,
  type RoomsSaveIO,
  type RoomsSaveResult,
  applyRoomEdits,
  carryRoomEdits,
  roomDirtyKeys,
  saveRooms,
  withRoomWrites,
} from "./model.js";

const UNDO_LIMIT = 100;

export class RoomsDraft {
  /** The loaded document and its revision. */
  document: BehaviorDocument;
  revision: number;
  private edits: Map<string, unknown> = new Map();
  private undoStack: Map<string, unknown>[] = [];
  private redoStack: Map<string, unknown>[] = [];
  private coalesceKey?: string;
  saving = false;
  /** Settles when the save running now ends. */
  saveDone?: Promise<unknown>;

  constructor(document: BehaviorDocument, revision: number) {
    this.document = document;
    this.revision = revision;
  }

  /** The document as a save would send it. */
  get effective(): BehaviorDocument {
    return applyRoomEdits(this.document, this.edits);
  }

  get pending(): RoomEdits {
    return this.edits;
  }

  get dirty(): boolean {
    return roomDirtyKeys(this.document, this.edits).length > 0;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Lay key writes over the edits. Writes with the same `coalesce` key in a
   * row are one undo step (a dial dragged round). False when nothing moved. */
  apply(writes: RoomEdits, coalesce?: string): boolean {
    if (this.saving) return false;
    const next = withRoomWrites(this.document, this.edits, writes);
    if (sameEdits(next, this.edits)) return false;
    if (coalesce === undefined || coalesce !== this.coalesceKey) {
      this.undoStack.push(new Map(this.edits));
      if (this.undoStack.length > UNDO_LIMIT) this.undoStack.shift();
    }
    this.coalesceKey = coalesce;
    this.redoStack = [];
    this.edits = next;
    return true;
  }

  endCoalesce(): void {
    this.coalesceKey = undefined;
  }

  undo(): boolean {
    if (this.saving) return false;
    const prev = this.undoStack.pop();
    if (prev === undefined) return false;
    this.redoStack.push(this.edits);
    this.edits = prev;
    this.coalesceKey = undefined;
    return true;
  }

  redo(): boolean {
    if (this.saving) return false;
    const next = this.redoStack.pop();
    if (next === undefined) return false;
    this.undoStack.push(this.edits);
    this.edits = next;
    this.coalesceKey = undefined;
    return true;
  }

  /** Back to the stored copy; undo brings the edits back. */
  discard(): boolean {
    if (this.edits.size === 0 || this.saving) return false;
    this.undoStack.push(this.edits);
    this.redoStack = [];
    this.edits = new Map();
    this.coalesceKey = undefined;
    return true;
  }

  /** A newer copy under the edits. Edits it already holds are dropped.
   * True when edits that still change something remain. */
  rebase(document: BehaviorDocument, revision: number): boolean {
    const carried = carryRoomEdits(this.document, document, this.edits);
    this.document = document;
    this.revision = revision;
    this.edits = withRoomWrites(document, new Map(), carried);
    this.undoStack = [];
    this.redoStack = [];
    this.coalesceKey = undefined;
    return this.edits.size > 0;
  }
}

function sameEdits(a: ReadonlyMap<string, unknown>, b: ReadonlyMap<string, unknown>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (!b.has(key)) return false;
    if (JSON.stringify(value) !== JSON.stringify(b.get(key))) return false;
  }
  return true;
}

const drafts = new Map<string, RoomsDraft>();

export function keptRoomsDraft(watchId: string): RoomsDraft | undefined {
  return drafts.get(watchId);
}

export function forgetRoomsDraft(watchId: string): void {
  drafts.delete(watchId);
}

/** The draft for a record just read: a new one, or the kept one moved onto
 * the record when it is newer. `mergedIntoEdits` is a newer copy that came
 * in under edits that still change something. */
export function takeRoomsRecord(watchId: string, document: BehaviorDocument, revision: number): { draft: RoomsDraft; mergedIntoEdits: boolean } {
  const kept = drafts.get(watchId);
  if (kept === undefined) {
    const draft = new RoomsDraft(document, revision);
    drafts.set(watchId, draft);
    return { draft, mergedIntoEdits: false };
  }
  if (kept.saving || revision === kept.revision) return { draft: kept, mergedIntoEdits: false };
  const hadEdits = kept.dirty;
  const remain = kept.rebase(document, revision);
  return { draft: kept, mergedIntoEdits: hadEdits && remain };
}

export function anyRoomsDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

export function dropAllRooms(): void {
  for (const [id, draft] of drafts) if (!draft.saving) drafts.delete(id);
}

/** Save a draft: its edits over its revision, merged by key on a conflict.
 * The draft takes the saved copy as its new base when the save ends well. */
export async function saveRoomsDraft(draft: RoomsDraft, io: RoomsSaveIO): Promise<RoomsSaveResult> {
  if (draft.saving) return { ok: false, code: "busy", message: "A save is running." };
  const edits = new Map(draft.pending);
  draft.saving = true;
  const running = saveRooms(io, { revision: draft.revision, document: draft.document }, edits);
  draft.saveDone = running;
  try {
    const result = await running;
    draft.saving = false;
    if (result.ok) {
      draft.rebase(result.document, result.revision);
    } else if (result.fresh !== undefined && result.fresh.revision > 0) {
      const doc = result.fresh.document;
      if (doc !== undefined && typeof doc === "object" && !Array.isArray(doc)) draft.rebase(doc, result.fresh.revision);
    }
    return result;
  } finally {
    draft.saving = false;
  }
}

/** The record as it stands after a save that went through. */
export function savedRecord(record: WatchConfigRecord, result: Extract<RoomsSaveResult, { ok: true }>): WatchConfigRecord {
  const base = result.fresh ?? record;
  if (result.alreadySaved) return base;
  return { ...base, revision: result.revision, updated_at: new Date().toISOString(), updated_by: "panel", document: result.document };
}
