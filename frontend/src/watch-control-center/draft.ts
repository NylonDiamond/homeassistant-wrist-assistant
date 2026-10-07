// The Control Center list being edited in the panel, how it is saved, and
// the drafts kept per watch.
//
// The status pages draft's shape (`watch-status-pages/draft.ts`): the
// document Home Assistant holds (`base`) at its revision, the document as
// edited now, and the undo and redo steps between. When Home Assistant moves
// on under an open draft (another save, or a save that met a conflict)
// every step is merged onto the newer document by `mergeControlCenter`, so
// no edit to an entry the other side left alone is lost and an undo never
// takes the other side's change back. An entry both sides changed keeps the
// draft's copy.
//
// The drafts live here, one per watch, not in the element: the element is
// made anew each time the route opens, and a draft outlives that.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 5 build
// contract", item 2).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type ControlCenterClash, controlCenterClashes, mergeControlCenter } from "./merge.js";
import { type ControlCenterDocument, checkControlCenter } from "./model.js";

export const CONTROL_CENTER_UNDO_LIMIT = 100;
export const CONTROL_CENTER_SAVE_ATTEMPTS = 3;

export class ControlCenterDraft {
  private _base: ControlCenterDocument;
  private _revision: number;
  private _document: ControlCenterDocument;
  private _undo: ControlCenterDocument[] = [];
  private _redo: ControlCenterDocument[] = [];
  private _coalesceKey: string | undefined;
  private _dirty: { document: ControlCenterDocument; base: ControlCenterDocument; value: boolean } | undefined;
  private _kept: ControlCenterClash[] = [];

  constructor(document: ControlCenterDocument, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  get base(): ControlCenterDocument {
    return this._base;
  }

  get revision(): number {
    return this._revision;
  }

  get document(): ControlCenterDocument {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** The entries the last merge (`rebase`, `restart`) found changed on both
   * sides: the draft's copy stayed and the other side's change there was
   * dropped. Empty when nothing clashed. */
  get kept(): readonly ControlCenterClash[] {
    return this._kept;
  }

  /** Whether the document differs from `base` by the phone's JSON equality. */
  get dirty(): boolean {
    const cached = this._dirty;
    if (cached !== undefined && cached.document === this._document && cached.base === this._base) return cached.value;
    const value = this._document !== this._base && !sameWatchPagesJson(this._document, this._base);
    this._dirty = { document: this._document, base: this._base, value };
    return value;
  }

  /** `next` as one undo step; with `coalesce`, edits with the same key one
   * after another are one step (typing). Returns whether the document
   * changed. */
  apply(next: ControlCenterDocument, coalesce?: string): boolean {
    if (next === this._document || sameWatchPagesJson(next, this._document)) {
      if (coalesce === undefined || coalesce !== this._coalesceKey) this._coalesceKey = undefined;
      return false;
    }
    if (coalesce !== undefined && coalesce === this._coalesceKey && this._undo.length > 0) {
      const start = this._undo[this._undo.length - 1]!;
      if (sameWatchPagesJson(next, start)) {
        this._undo.pop();
        this._document = start;
        this._coalesceKey = undefined;
      } else {
        this._document = next;
      }
      this._redo = [];
      return true;
    }
    this.pushUndo(this._document);
    this._redo = [];
    this._document = next;
    this._coalesceKey = coalesce;
    return true;
  }

  endCoalesce(): void {
    this._coalesceKey = undefined;
  }

  undo(): boolean {
    this._coalesceKey = undefined;
    const previous = this._undo.pop();
    if (previous === undefined) return false;
    this._redo.push(this._document);
    this._document = previous;
    return true;
  }

  redo(): boolean {
    this._coalesceKey = undefined;
    const next = this._redo.pop();
    if (next === undefined) return false;
    this.pushUndo(this._document);
    this._document = next;
    return true;
  }

  /** `base` again, as one step undo takes back. */
  discard(): boolean {
    this._coalesceKey = undefined;
    return this.apply(this._base);
  }

  /** Home Assistant holds `server` at `revision`, newer than the draft's:
   * every step merged onto it, and it becomes the base. A stale revision
   * changes nothing. Returns whether the current document changed. */
  rebase(server: ControlCenterDocument, revision: number): boolean {
    if (revision < this._revision) {
      this._kept = [];
      return false;
    }
    return this.mergeOnto(server, revision);
  }

  /** The store started over at a lower revision: merged as `rebase`, and the
   * lower revision taken, so the next save names one the store holds. */
  restart(server: ControlCenterDocument, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  private mergeOnto(server: ControlCenterDocument, revision: number): boolean {
    this._coalesceKey = undefined;
    const oldBase = this._base;
    this._kept = this._document === oldBase ? [] : controlCenterClashes(oldBase, this._document, server);
    const done = new Map<ControlCenterDocument, ControlCenterDocument>();
    const merged = (document: ControlCenterDocument): ControlCenterDocument => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out = document === oldBase ? server : mergeControlCenter(oldBase, document, server);
      if (out !== server && sameWatchPagesJson(out, server)) out = server;
      done.set(document, out);
      return out;
    };
    const before = this._document;
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: ControlCenterDocument[] = [];
    let keptCurrent = 0;
    timeline.forEach((document, index) => {
      const last = kept[kept.length - 1];
      if (last !== undefined && (last === document || sameWatchPagesJson(last, document))) {
        if (index === current) kept[kept.length - 1] = document;
      } else {
        kept.push(document);
      }
      if (index === current) keptCurrent = kept.length - 1;
    });
    this._undo = kept.slice(0, keptCurrent);
    this._document = kept[keptCurrent]!;
    this._redo = kept.slice(keptCurrent + 1).reverse();
    this._base = server;
    this._revision = revision;
    return this._document !== before && !sameWatchPagesJson(this._document, before);
  }

  /** A save of `document` landed as `revision`. Edits made since stay dirty. */
  saved(document: ControlCenterDocument, revision: number): void {
    if (revision < this._revision) return;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  get saving(): boolean {
    return saves.has(this);
  }

  get saveDone(): Promise<ControlCenterSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: ControlCenterDocument): void {
    this._undo.push(document);
    if (this._undo.length > CONTROL_CENTER_UNDO_LIMIT) this._undo.splice(0, this._undo.length - CONTROL_CENTER_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

export interface ControlCenterSaveIO {
  save(baseRevision: number, document: ControlCenterDocument): Promise<{ revision: number }>;
  fetch(): Promise<{ revision: number; document: unknown }>;
}

export interface ControlCenterSaveResult {
  ok: boolean;
  revision: number;
  merged: boolean;
  alreadySaved?: boolean;
  /** The entries another save also changed while this one ran, whose copy
   * from here stayed. Only when there is one. */
  kept?: ControlCenterClash[];
  code?: string;
  message?: string;
  problems?: string[];
}

const saves = new WeakMap<ControlCenterDraft, Promise<ControlCenterSaveResult>>();

/**
 * Saves the draft: a document `checkControlCenter` finds fault with is not
 * sent (`invalid`); a `conflict` reads the newest record, merges the draft
 * onto it and saves again, at most `CONTROL_CENTER_SAVE_ATTEMPTS` sends in
 * all. One save per draft at a time (`busy`).
 */
export function saveControlCenterDraft(draft: ControlCenterDraft, io: ControlCenterSaveIO): Promise<ControlCenterSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({ ok: false, revision: draft.revision, merged: false, code: "busy", message: "This Control Center list is being saved already." });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

async function runSave(draft: ControlCenterDraft, io: ControlCenterSaveIO): Promise<ControlCenterSaveResult> {
  let merged = false;
  const kept = new Map<string, ControlCenterClash>();
  const keptList = (): { kept?: ControlCenterClash[] } => (kept.size === 0 ? {} : { kept: [...kept.values()] });
  const failed = (code: string, message: string, problems?: string[]): ControlCenterSaveResult => ({
    ok: false,
    revision: draft.revision,
    merged,
    code,
    message,
    ...keptList(),
    ...(problems === undefined ? {} : { problems }),
  });
  for (let attempt = 1; ; attempt++) {
    const sent = draft.document;
    const problems = checkControlCenter(sent);
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    try {
      ({ revision } = await io.save(draft.revision, sent));
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= CONTROL_CENTER_SAVE_ATTEMPTS) return failed(code, message);
      let record: { revision: number; document: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return failed(e.code ?? "unknown", e.message);
      }
      if (!isJsonObject(record) || !(record.revision > 0) || !isJsonObject(record.document)) {
        return failed("no_record", "Home Assistant holds no Control Center list for this watch.");
      }
      if (record.revision < draft.revision) draft.restart(record.document, record.revision);
      else draft.rebase(record.document, record.revision);
      for (const clash of draft.kept) kept.set(clash.entityId, clash);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true, ...keptList() };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged, ...keptList() };
  }
}

/** How a start ended. */
export type ControlCenterStartResult =
  | { ok: true; revision: number }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/**
 * Create the watch's Control Center record from `document` (an empty list):
 * a save over revision 0, which Home Assistant takes only while it holds no
 * record for a paired watch. `no_record` back means the watch is not paired;
 * `conflict` means a record came meanwhile (the caller reads it);
 * `unknown_command` means an integration too old to keep watch config at
 * all. Any other refusal is an error with Home Assistant's words.
 */
export async function startControlCenter(
  document: ControlCenterDocument,
  save: (baseRevision: number, document: ControlCenterDocument) => Promise<{ revision: number }>,
): Promise<ControlCenterStartResult> {
  try {
    const { revision } = await save(0, document);
    return { ok: true, revision };
  } catch (error) {
    const { code, message } = watchCommandError(error);
    if (code === "no_record" || code === "conflict") return { ok: false, code, message };
    if (code === "unknown_command" || code === "invalid") return { ok: false, code: "unsupported", message };
    return { ok: false, code: "error", message };
  }
}

// ── the kept drafts ──────────────────────────────────────────────────────

const drafts = new Map<string, ControlCenterDraft>();

export function keptControlCenterDraft(watchId: string): ControlCenterDraft | undefined {
  return drafts.get(watchId);
}

/**
 * A record of `watchId`'s Control Center list was read: `document` at
 * `revision`. Nothing kept makes a new draft; an older draft is rebased; a
 * draft at a newer revision (the store started over) is replaced when clean
 * and restarted when dirty. Revision 0 leaves a kept draft as it is.
 */
export function takeControlCenterRecord(
  watchId: string,
  document: ControlCenterDocument,
  revision: number,
): { draft: ControlCenterDraft; mergedIntoEdits: boolean; kept: readonly ControlCenterClash[] } {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false, kept: [] };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
    const fresh = new ControlCenterDraft(document, revision);
    drafts.set(watchId, fresh);
    return { draft: fresh, mergedIntoEdits: false, kept: [] };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false, kept: [] };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed, kept: dirty ? held.kept : [] };
}

export function forgetControlCenterDraft(watchId: string): void {
  drafts.delete(watchId);
}

export function anyControlCenterDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

export function dropAllControlCenter(): void {
  drafts.clear();
}
