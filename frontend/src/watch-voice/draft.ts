// The voice settings being edited in the panel, how they are saved, and the
// drafts kept per watch.
//
// The menu draft's shape (`watch-menus/draft.ts`): the document Home
// Assistant holds (`base`) at its revision, the document as edited now, and
// the undo and redo steps between. When Home Assistant moves on under an
// open draft (an iPhone save, or a save that met a conflict) every step is
// merged onto the newer document by `mergeWatchVoice`, so no edit is lost
// and an undo never takes the other side's change back.
//
// The drafts live here, one per watch, not in the element: the element is
// made anew each time the route opens, and a draft outlives that.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 3).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { mergeWatchVoice, watchVoiceClashes } from "./merge.js";
import { type VoiceDocument, checkWatchVoice, watchVoiceDefaults } from "./model.js";

export const WATCH_VOICE_UNDO_LIMIT = 100;
export const WATCH_VOICE_SAVE_ATTEMPTS = 3;

export class WatchVoiceDraft {
  private _base: VoiceDocument;
  private _revision: number;
  private _document: VoiceDocument;
  private _undo: VoiceDocument[] = [];
  private _redo: VoiceDocument[] = [];
  private _coalesceKey: string | undefined;
  private _dirty: { document: VoiceDocument; base: VoiceDocument; value: boolean } | undefined;
  private _replaced: string[] = [];

  constructor(document: VoiceDocument, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  get base(): VoiceDocument {
    return this._base;
  }

  get revision(): number {
    return this._revision;
  }

  get document(): VoiceDocument {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** The keys the last merge found changed on both sides: the draft's
   * version stayed. Empty when nothing clashed. */
  get replaced(): readonly string[] {
    return this._replaced;
  }

  get dirty(): boolean {
    const cached = this._dirty;
    if (cached !== undefined && cached.document === this._document && cached.base === this._base) return cached.value;
    const value = this._document !== this._base && !sameWatchPagesJson(this._document, this._base);
    this._dirty = { document: this._document, base: this._base, value };
    return value;
  }

  /** `next` as one undo step; with `coalesce`, edits with the same key one
   * after another are one step (typing, a slider's drag). Returns whether
   * the document changed. */
  apply(next: VoiceDocument, coalesce?: string): boolean {
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
  rebase(server: VoiceDocument, revision: number): boolean {
    if (revision < this._revision) {
      this._replaced = [];
      return false;
    }
    return this.mergeOnto(server, revision);
  }

  /** The store started over at a lower revision: merged as `rebase`, and the
   * lower revision taken, so the next save names one the store holds. */
  restart(server: VoiceDocument, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  private mergeOnto(server: VoiceDocument, revision: number): boolean {
    this._coalesceKey = undefined;
    const oldBase = this._base;
    this._replaced = this._document === oldBase ? [] : watchVoiceClashes(oldBase, this._document, server);
    const done = new Map<VoiceDocument, VoiceDocument>();
    const merged = (document: VoiceDocument): VoiceDocument => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out = document === oldBase ? server : mergeWatchVoice(oldBase, document, server);
      if (out !== server && sameWatchPagesJson(out, server)) out = server;
      done.set(document, out);
      return out;
    };
    const before = this._document;
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: VoiceDocument[] = [];
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
  saved(document: VoiceDocument, revision: number): void {
    if (revision < this._revision) return;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  get saving(): boolean {
    return saves.has(this);
  }

  get saveDone(): Promise<WatchVoiceSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: VoiceDocument): void {
    this._undo.push(document);
    if (this._undo.length > WATCH_VOICE_UNDO_LIMIT) this._undo.splice(0, this._undo.length - WATCH_VOICE_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

export interface WatchVoiceSaveIO {
  save(baseRevision: number, document: VoiceDocument): Promise<{ revision: number }>;
  fetch(): Promise<{ revision: number; document: unknown }>;
}

export interface WatchVoiceSaveResult {
  ok: boolean;
  revision: number;
  merged: boolean;
  alreadySaved?: boolean;
  /** The top-level keys the iPhone also changed while this save ran, which
   * the draft's version replaced. Only when there is one. */
  replaced?: string[];
  code?: string;
  message?: string;
  problems?: string[];
}

const saves = new WeakMap<WatchVoiceDraft, Promise<WatchVoiceSaveResult>>();

/**
 * Saves the draft: a document `checkWatchVoice` finds fault with is not sent
 * (`invalid`); a `conflict` reads the newest record, merges the draft onto it
 * and saves again, at most `WATCH_VOICE_SAVE_ATTEMPTS` sends in all. One save
 * per draft at a time (`busy`).
 */
export function saveWatchVoiceDraft(draft: WatchVoiceDraft, io: WatchVoiceSaveIO): Promise<WatchVoiceSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({ ok: false, revision: draft.revision, merged: false, code: "busy", message: "These voice settings are being saved already." });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

async function runSave(draft: WatchVoiceDraft, io: WatchVoiceSaveIO): Promise<WatchVoiceSaveResult> {
  let merged = false;
  const replaced = new Set<string>();
  const replacedList = (): { replaced?: string[] } => (replaced.size === 0 ? {} : { replaced: [...replaced].sort() });
  const failed = (code: string, message: string, problems?: string[]): WatchVoiceSaveResult => ({
    ok: false,
    revision: draft.revision,
    merged,
    code,
    message,
    ...(problems === undefined ? {} : { problems }),
  });
  for (let attempt = 1; ; attempt++) {
    const sent = draft.document;
    const problems = checkWatchVoice(sent);
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    try {
      ({ revision } = await io.save(draft.revision, sent));
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= WATCH_VOICE_SAVE_ATTEMPTS) return failed(code, message);
      let record: { revision: number; document: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return failed(e.code ?? "unknown", e.message);
      }
      if (!isJsonObject(record) || !(record.revision > 0) || !isJsonObject(record.document)) {
        return failed("no_record", "Home Assistant holds no voice settings for this watch.");
      }
      if (record.revision < draft.revision) draft.restart(record.document, record.revision);
      else draft.rebase(record.document, record.revision);
      for (const key of draft.replaced) replaced.add(key);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged, ...replacedList() };
  }
}

/** How "Start with the defaults" ended. */
export type WatchVoiceStartResult =
  | { ok: true; revision: number }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/**
 * Create the watch's voice record from the app's defaults: a save over
 * revision 0, which Home Assistant takes only while it holds no record for a
 * paired watch. `no_record` back means the watch is not paired; `conflict`
 * means a record came meanwhile (the caller reads it); `unknown_command`
 * means an integration too old to keep watch config at all. Any other
 * refusal is an error with Home Assistant's own words.
 */
export async function startWatchVoice(save: (baseRevision: number, document: VoiceDocument) => Promise<{ revision: number }>): Promise<WatchVoiceStartResult> {
  try {
    const { revision } = await save(0, watchVoiceDefaults());
    return { ok: true, revision };
  } catch (error) {
    const { code, message } = watchCommandError(error);
    if (code === "no_record" || code === "conflict") return { ok: false, code, message };
    if (code === "unknown_command") return { ok: false, code: "unsupported", message };
    return { ok: false, code: "error", message };
  }
}

// ── the kept drafts ──────────────────────────────────────────────────────

const drafts = new Map<string, WatchVoiceDraft>();

export function keptWatchVoiceDraft(watchId: string): WatchVoiceDraft | undefined {
  return drafts.get(watchId);
}

/**
 * A record of `watchId`'s voice settings was read: `document` at `revision`.
 * Nothing kept makes a new draft; an older draft is rebased; a draft at a
 * newer revision (the store started over) is replaced when clean and
 * restarted when dirty. Revision 0 leaves a kept draft as it is.
 */
export function takeWatchVoiceRecord(
  watchId: string,
  document: VoiceDocument,
  revision: number,
): { draft: WatchVoiceDraft; mergedIntoEdits: boolean; replaced: readonly string[] } {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false, replaced: [] };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
    const fresh = new WatchVoiceDraft(document, revision);
    drafts.set(watchId, fresh);
    return { draft: fresh, mergedIntoEdits: false, replaced: [] };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false, replaced: [] };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed, replaced: dirty ? held.replaced : [] };
}

export function forgetWatchVoiceDraft(watchId: string): void {
  drafts.delete(watchId);
}

export function anyWatchVoiceDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

export function dropAllWatchVoice(): void {
  drafts.clear();
}
