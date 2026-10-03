// The menus being edited in the panel, how they are saved, and the drafts
// kept per watch.
//
// The same shape as the page draft (`watch-pages/draft.ts`): the document
// Home Assistant holds (`base`) at its revision, the document as edited now,
// and the undo and redo steps between. When Home Assistant moves on under an
// open draft (an iPhone save, or a save that met a conflict) every step is
// merged onto the newer document by `mergeWatchMenus`, so no edit is lost and
// an undo never takes the other side's change back.
//
// The drafts live here, one per watch, not in the element: the element is
// made anew each time the route opens, and a draft outlives that.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract").

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { mergeWatchMenus, watchMenusClashes } from "./merge.js";
import { type MenusDocument, WATCH_MENUS_SECTIONS, type WatchMenusSection, checkWatchMenus, watchMenusDefaults } from "./model.js";

export const WATCH_MENUS_UNDO_LIMIT = 100;
export const WATCH_MENUS_SAVE_ATTEMPTS = 3;

export class WatchMenusDraft {
  private _base: MenusDocument;
  private _revision: number;
  private _document: MenusDocument;
  private _undo: MenusDocument[] = [];
  private _redo: MenusDocument[] = [];
  private _coalesceKey: string | undefined;
  private _dirty: { document: MenusDocument; base: MenusDocument; value: boolean } | undefined;
  private _replaced: WatchMenusSection[] = [];

  constructor(document: MenusDocument, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  get base(): MenusDocument {
    return this._base;
  }

  get revision(): number {
    return this._revision;
  }

  get document(): MenusDocument {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** The sections the last merge (`rebase`, `restart`) found changed on both
   * sides: the draft's version stayed and the other side's change there was
   * dropped. Empty when nothing clashed. */
  get replaced(): readonly WatchMenusSection[] {
    return this._replaced;
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
   * after another are one step (typing, a slider's drag). Returns whether
   * the document changed. */
  apply(next: MenusDocument, coalesce?: string): boolean {
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

  /** `next` with no undo step of its own, for what a save sends in place of
   * the document (`WatchMenusSaveIO.prepare`). */
  amend(next: MenusDocument): boolean {
    this._coalesceKey = undefined;
    if (next === this._document || sameWatchPagesJson(next, this._document)) return false;
    this._document = next;
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
  rebase(server: MenusDocument, revision: number): boolean {
    if (revision < this._revision) {
      this._replaced = [];
      return false;
    }
    return this.mergeOnto(server, revision);
  }

  /** The store started over at a lower revision: merged as `rebase`, and the
   * lower revision taken, so the next save names one the store holds. */
  restart(server: MenusDocument, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  private mergeOnto(server: MenusDocument, revision: number): boolean {
    this._coalesceKey = undefined;
    const oldBase = this._base;
    this._replaced = this._document === oldBase ? [] : watchMenusClashes(oldBase, this._document, server);
    const done = new Map<MenusDocument, MenusDocument>();
    const merged = (document: MenusDocument): MenusDocument => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out = document === oldBase ? server : mergeWatchMenus(oldBase, document, server);
      if (out !== server && sameWatchPagesJson(out, server)) out = server;
      done.set(document, out);
      return out;
    };
    const before = this._document;
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: MenusDocument[] = [];
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
  saved(document: MenusDocument, revision: number): void {
    if (revision < this._revision) return;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  get saving(): boolean {
    return saves.has(this);
  }

  get saveDone(): Promise<WatchMenusSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: MenusDocument): void {
    this._undo.push(document);
    if (this._undo.length > WATCH_MENUS_UNDO_LIMIT) this._undo.splice(0, this._undo.length - WATCH_MENUS_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

export interface WatchMenusSaveIO {
  save(baseRevision: number, document: MenusDocument): Promise<{ revision: number }>;
  fetch(): Promise<{ revision: number; document: unknown }>;
  /** What the document becomes before each send (the phone's save drops a
   * trigger slot with nothing picked). */
  prepare?(document: MenusDocument): MenusDocument;
}

export interface WatchMenusSaveResult {
  ok: boolean;
  revision: number;
  merged: boolean;
  alreadySaved?: boolean;
  /** The sections the iPhone also changed while this save ran, which the
   * draft's version replaced (the merge's grain is the section). Only when
   * there is one. */
  replaced?: WatchMenusSection[];
  code?: string;
  message?: string;
  problems?: string[];
}

const saves = new WeakMap<WatchMenusDraft, Promise<WatchMenusSaveResult>>();

/**
 * Saves the draft: a document `checkWatchMenus` finds fault with is not sent
 * (`invalid`); a `conflict` reads the newest record, merges the draft onto it
 * and saves again, at most `WATCH_MENUS_SAVE_ATTEMPTS` sends in all. One save
 * per draft at a time (`busy`).
 */
export function saveWatchMenusDraft(draft: WatchMenusDraft, io: WatchMenusSaveIO): Promise<WatchMenusSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({ ok: false, revision: draft.revision, merged: false, code: "busy", message: "These menus are being saved already." });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

async function runSave(draft: WatchMenusDraft, io: WatchMenusSaveIO): Promise<WatchMenusSaveResult> {
  let merged = false;
  const replaced = new Set<WatchMenusSection>();
  const replacedList = (): { replaced?: WatchMenusSection[] } => {
    const list = WATCH_MENUS_SECTIONS.filter((s) => replaced.has(s));
    return list.length === 0 ? {} : { replaced: list };
  };
  const failed = (code: string, message: string, problems?: string[]): WatchMenusSaveResult => ({
    ok: false,
    revision: draft.revision,
    merged,
    code,
    message,
    ...(problems === undefined ? {} : { problems }),
  });
  for (let attempt = 1; ; attempt++) {
    const prepared = io.prepare?.(draft.document);
    if (prepared !== undefined && prepared !== draft.document) draft.amend(prepared);
    const sent = draft.document;
    const problems = checkWatchMenus(sent);
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    try {
      ({ revision } = await io.save(draft.revision, sent));
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= WATCH_MENUS_SAVE_ATTEMPTS) return failed(code, message);
      let record: { revision: number; document: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return failed(e.code ?? "unknown", e.message);
      }
      if (!isJsonObject(record) || !(record.revision > 0) || !isJsonObject(record.document)) {
        return failed("no_record", "Home Assistant holds no menus for this watch.");
      }
      if (record.revision < draft.revision) draft.restart(record.document, record.revision);
      else draft.rebase(record.document, record.revision);
      for (const section of draft.replaced) replaced.add(section);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged, ...replacedList() };
  }
}

/** How "Start with the defaults" ended. */
export type WatchMenusStartResult =
  | { ok: true; revision: number }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/**
 * Create the watch's menus record from the app's defaults: a save over
 * revision 0, which Home Assistant takes only while it holds no record for a
 * paired watch. `no_record` back means the watch is not paired; `conflict`
 * means a record came meanwhile (the caller reads it); `unknown_command`
 * means an integration too old to keep watch config at all. Any other
 * refusal, `invalid` included (the defaults' shape or size refused), is an
 * error with Home Assistant's own words. An integration too old for the
 * `menus` kind is found earlier, by the read (`watchMenusReadMeansUnsupported`).
 */
export async function startWatchMenus(save: (baseRevision: number, document: MenusDocument) => Promise<{ revision: number }>): Promise<WatchMenusStartResult> {
  try {
    const { revision } = await save(0, watchMenusDefaults());
    return { ok: true, revision };
  } catch (error) {
    const { code, message } = watchCommandError(error);
    if (code === "no_record" || code === "conflict") return { ok: false, code, message };
    if (code === "unknown_command") return { ok: false, code: "unsupported", message };
    return { ok: false, code: "error", message };
  }
}

// ── the kept drafts ──────────────────────────────────────────────────────

const drafts = new Map<string, WatchMenusDraft>();

export function keptWatchMenusDraft(watchId: string): WatchMenusDraft | undefined {
  return drafts.get(watchId);
}

/**
 * A record of `watchId`'s menus was read: `document` at `revision`. Nothing
 * kept makes a new draft; an older draft is rebased; a draft at a newer
 * revision (the store started over) is replaced when clean and restarted
 * when dirty. Revision 0 leaves a kept draft as it is.
 */
export function takeWatchMenusRecord(
  watchId: string,
  document: MenusDocument,
  revision: number,
): { draft: WatchMenusDraft; mergedIntoEdits: boolean; replaced: readonly WatchMenusSection[] } {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false, replaced: [] };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
    const fresh = new WatchMenusDraft(document, revision);
    drafts.set(watchId, fresh);
    return { draft: fresh, mergedIntoEdits: false, replaced: [] };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false, replaced: [] };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed, replaced: dirty ? held.replaced : [] };
}

export function forgetWatchMenusDraft(watchId: string): void {
  drafts.delete(watchId);
}

export function anyWatchMenusDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

export function dropAllWatchMenus(): void {
  drafts.clear();
}
