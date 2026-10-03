// The page config being edited in the panel, and how it is saved.
//
// A draft holds the document Home Assistant holds (`base`) at its revision,
// the document as edited now, and the undo and redo steps between. It draws
// nothing and talks to nothing: the view applies edits to it, and
// `saveWatchPagesDraft` saves it through whatever calls it is handed.
//
// When Home Assistant moves on under an open draft (a phone save, or a save
// that met a conflict), the draft is rebased: the edits, and every undo and
// redo step, are merged onto the newer document by the same three-way merge
// the phone runs (`mergeWatchPages`), so no edit is lost and an undo never
// takes the other side's change back.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3b build contract").

import { type WatchPagesDocument, isJsonObject } from "./model.js";
import { checkWatchPages, checkWatchPagesValues, mergeWatchPages, sameWatchPagesJson } from "./merge.js";
import { settleMergedWatchPages } from "./page-settings-model.js";

/** The most undo steps a draft keeps. The oldest goes first. */
export const WATCH_PAGES_UNDO_LIMIT = 100;

/** The most saves `saveWatchPagesDraft` sends before it gives up on
 * conflicts. */
export const WATCH_PAGES_SAVE_ATTEMPTS = 3;

export interface WatchPagesApplyOptions {
  /**
   * Edits that carry the same key one after another are one undo step: the
   * first makes the step, the rest replace the document in it. For a drag or
   * typing. The run ends at `endCoalesce()`, at an apply with another key or
   * none, and at undo, redo, discard, rebase and save.
   */
  coalesce?: string;
}

export class WatchPagesDraft {
  private _base: WatchPagesDocument;
  private _revision: number;
  private _document: WatchPagesDocument;
  /** Oldest first; the last entry is what undo brings back. */
  private _undo: WatchPagesDocument[] = [];
  /** The last entry is what redo brings back. */
  private _redo: WatchPagesDocument[] = [];
  private _coalesceKey: string | undefined;
  private _baseVersion = 0;
  private _dirty: { document: WatchPagesDocument; base: WatchPagesDocument; value: boolean } | undefined;

  /** A draft of `document`, which Home Assistant holds at `revision`. */
  constructor(document: WatchPagesDocument, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  /** The document Home Assistant holds at `revision`, as last read or saved. */
  get base(): WatchPagesDocument {
    return this._base;
  }

  /** The revision of `base`, which a save names as its base revision. */
  get revision(): number {
    return this._revision;
  }

  /** The document as edited now. */
  get document(): WatchPagesDocument {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** How many steps undo and redo can take. */
  get undoDepth(): number {
    return this._undo.length;
  }

  get redoDepth(): number {
    return this._redo.length;
  }

  /**
   * Whether the document differs from `base` by JSON equality, so an edit
   * undone by hand is no edit. Worked out once per pair of documents: it is
   * read on every render.
   */
  get dirty(): boolean {
    const cached = this._dirty;
    if (cached !== undefined && cached.document === this._document && cached.base === this._base) return cached.value;
    const value = this._document !== this._base && !sameWatchPagesJson(this._document, this._base);
    this._dirty = { document: this._document, base: this._base, value };
    return value;
  }

  /**
   * Makes `next` the document, as one undo step, and clears redo. `next` that
   * is the document itself, or the same JSON, changes nothing. With
   * `options.coalesce`, see `WatchPagesApplyOptions`; an edit in such a run
   * that brings the document back to where the run began takes its step away
   * again. Returns whether the document changed.
   */
  apply(next: WatchPagesDocument, options?: WatchPagesApplyOptions): boolean {
    const key = options?.coalesce;
    if (next === this._document || sameWatchPagesJson(next, this._document)) {
      if (key === undefined || key !== this._coalesceKey) this._coalesceKey = undefined;
      return false;
    }
    if (key !== undefined && key === this._coalesceKey && this._undo.length > 0) {
      const start = this._undo[this._undo.length - 1]!;
      if (sameWatchPagesJson(next, start)) {
        // Back where the run began: no step at all. A further edit in the
        // run makes a new one.
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
    this._coalesceKey = key;
    return true;
  }

  /** Ends a run of coalesced edits, so the next edit is a step of its own. */
  endCoalesce(): void {
    this._coalesceKey = undefined;
  }

  /** Takes the last step back. Returns whether there was one. */
  undo(): boolean {
    this._coalesceKey = undefined;
    const previous = this._undo.pop();
    if (previous === undefined) return false;
    this._redo.push(this._document);
    this._document = previous;
    return true;
  }

  /** Takes the last undone step again. Returns whether there was one. */
  redo(): boolean {
    this._coalesceKey = undefined;
    const next = this._redo.pop();
    if (next === undefined) return false;
    this.pushUndo(this._document);
    this._document = next;
    return true;
  }

  /** Makes `base` the document again, as one step that undo takes back.
   * Returns whether the document changed. */
  discard(): boolean {
    this._coalesceKey = undefined;
    return this.apply(this._base);
  }

  /**
   * Home Assistant holds a newer document, `server` at `revision`. Every
   * document the draft holds (the current one and each undo and redo step)
   * becomes the three-way merge of itself onto `server` against the old
   * `base` (each page then made whole by `settleMergedWatchPages`), and
   * `server` becomes the base. So the edits stay, the other side's
   * changes come in, and an undo after the rebase keeps the other side's
   * change. A merged document that is the same JSON as `server` is `server`
   * itself, so a clean draft stays clean and holds the server's very object.
   * Steps that come out the same as their neighbour are one step.
   *
   * A revision older than the draft's is stale and changes nothing (a store
   * that started over is `restart`'s case). Returns whether the current
   * document changed.
   */
  rebase(server: WatchPagesDocument, revision: number): boolean {
    if (revision < this._revision) return false;
    return this.mergeOnto(server, revision);
  }

  /**
   * Home Assistant's store started over: the record was removed and uploaded
   * again, so it holds `server` at a revision lower than the draft's. A plain
   * `rebase` would take that for a stale read and keep the draft at a
   * revision the store no longer has, so every save would meet a conflict.
   * This merges the same way as `rebase` (the edits onto `server`, against the
   * old base, which is the best guess at what the edits started from) and
   * takes the lower revision. Returns whether the current document changed.
   */
  restart(server: WatchPagesDocument, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  /** Bumped whenever `base` moves (`rebase`, `restart`, `saved`), so a
   * gesture that began on one base can tell the base moved under it. */
  get baseVersion(): number {
    return this._baseVersion;
  }

  private mergeOnto(server: WatchPagesDocument, revision: number): boolean {
    this._baseVersion++;
    this._coalesceKey = undefined;
    const oldBase = this._base;
    const done = new Map<WatchPagesDocument, WatchPagesDocument>();
    const merged = (document: WatchPagesDocument): WatchPagesDocument => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out: WatchPagesDocument;
      if (document === oldBase) out = server;
      else {
        // The key by key merge, then each page made whole again: a theme
        // change or the gradient switch rewrites every tile, which a merge
        // key by key can leave half done.
        out = settleMergedWatchPages(oldBase, document, server, mergeWatchPages(oldBase, document, server));
        if (out !== server && sameWatchPagesJson(out, server)) out = server;
      }
      done.set(document, out);
      return out;
    };

    const before = this._document;
    // The whole history in time order, oldest first, with the current
    // document at `current`.
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: WatchPagesDocument[] = [];
    let keptCurrent = 0;
    timeline.forEach((document, index) => {
      const last = kept[kept.length - 1];
      if (last !== undefined && (last === document || sameWatchPagesJson(last, document))) {
        // One step with its neighbour. The current document keeps its own
        // object in the run it falls in.
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

  /**
   * A save of `document` succeeded and Home Assistant now holds it at
   * `revision`. `document` is what was sent, which is not the current
   * document when editing went on during the save; the edits made since stay
   * dirty. Undo and redo stay, so an undo after a save makes the draft dirty
   * again. A revision older than the draft's (a newer one already came in
   * from elsewhere) changes nothing.
   */
  saved(document: WatchPagesDocument, revision: number): void {
    if (revision < this._revision) return;
    this._baseVersion++;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  /** Whether `saveWatchPagesDraft` is saving this draft now. */
  get saving(): boolean {
    return saves.has(this);
  }

  /** The save out now, which settles when it ends; undefined when none is.
   * A view made while the save is out learns of its end this way. */
  get saveDone(): Promise<WatchPagesSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: WatchPagesDocument): void {
    this._undo.push(document);
    if (this._undo.length > WATCH_PAGES_UNDO_LIMIT) this._undo.splice(0, this._undo.length - WATCH_PAGES_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

/** The calls a save needs, so the save itself has no network of its own. */
export interface WatchPagesSaveIO {
  /** Saves `document` over `baseRevision`. Rejects with an error whose `code`
   * is `conflict` when Home Assistant holds a newer revision. */
  save(baseRevision: number, document: WatchPagesDocument): Promise<{ revision: number }>;
  /** Reads the record Home Assistant holds now. */
  fetch(): Promise<{ revision: number; document: unknown }>;
  /** What the document is turned into before each send, as the phone's own
   * save tidies a page before it writes it. The result, when it differs, is
   * applied to the draft as a step of its own, so the draft holds what was
   * sent and is clean after the save. Return the document itself for no
   * change. */
  prepare?(document: WatchPagesDocument): WatchPagesDocument;
}

/**
 * How a save ended. `code` and `message` are there when it failed. The codes
 * are the server's (`conflict`, `no_record`, `invalid`, `unavailable`), any
 * other code an error carried, `unknown` for an error with none, and `busy`
 * when the draft was already being saved (nothing is sent then).
 * `problems` lists what `checkWatchPages` or `checkWatchPagesValues` found
 * when the draft was not sent.
 */
export interface WatchPagesSaveResult {
  ok: boolean;
  /** The revision the draft is based on when the save ended. */
  revision: number;
  /** A newer document was merged into the draft on the way. */
  merged: boolean;
  /** After the merge the draft was the very copy Home Assistant holds, so
   * nothing more was sent: the edits were already there. */
  alreadySaved?: boolean;
  code?: string;
  message?: string;
  problems?: string[];
}

/** The drafts being saved now, each with its save. A draft is shared by every
 * element made for its watch, so the guard lives here and not in one view. */
const saves = new WeakMap<WatchPagesDraft, Promise<WatchPagesSaveResult>>();

function errorCode(error: unknown): string {
  const code = isJsonObject(error) || error instanceof Error ? (error as { code?: unknown }).code : undefined;
  return typeof code === "string" && code !== "" ? code : "unknown";
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  const message = isJsonObject(error) ? error.message : undefined;
  return typeof message === "string" ? message : String(error);
}

/**
 * Saves the draft. A document `checkWatchPages` finds fault with, or then
 * `checkWatchPagesValues` (a value the phone and the watch cannot read), is
 * not sent (`invalid`). A save that meets `conflict` reads the newest record, rebases
 * the draft onto it and saves again, sending at most
 * `WATCH_PAGES_SAVE_ATTEMPTS` saves in all. A record that cannot be read back
 * (revision 0, or no document object) fails with `no_record`. Every other
 * error ends the save with its own code.
 *
 * The draft may change while a call is out: what is recorded as saved is the
 * document that was sent, so edits made meanwhile stay dirty.
 *
 * After a merge the draft may be the very copy Home Assistant holds (the
 * iPhone saved the same edits): then nothing more is sent, and the save is ok
 * at the server's revision with `alreadySaved`. A draft runs one save at a
 * time; a call while one is out sends nothing and ends `busy`.
 */
export function saveWatchPagesDraft(draft: WatchPagesDraft, io: WatchPagesSaveIO): Promise<WatchPagesSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: "busy",
      message: "This draft is being saved already.",
    });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

async function runSave(draft: WatchPagesDraft, io: WatchPagesSaveIO): Promise<WatchPagesSaveResult> {
  let merged = false;
  const failed = (code: string, message: string, problems?: string[]): WatchPagesSaveResult => ({
    ok: false,
    revision: draft.revision,
    merged,
    code,
    message,
    ...(problems === undefined ? {} : { problems }),
  });

  for (let attempt = 1; ; attempt++) {
    const prepared = io.prepare?.(draft.document);
    if (prepared !== undefined && prepared !== draft.document) draft.apply(prepared);
    const sent = draft.document;
    const shape = checkWatchPages(sent);
    const problems = shape.length > 0 ? shape : checkWatchPagesValues(sent);
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    try {
      ({ revision } = await io.save(draft.revision, sent));
    } catch (error) {
      const code = errorCode(error);
      if (code !== "conflict" || attempt >= WATCH_PAGES_SAVE_ATTEMPTS) return failed(code, errorMessage(error));
      let record: { revision: number; document: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        return failed(errorCode(fetchError), errorMessage(fetchError));
      }
      const usable =
        isJsonObject(record) &&
        typeof record.revision === "number" &&
        record.revision > 0 &&
        isJsonObject(record.document);
      if (!usable) return failed("no_record", "Home Assistant holds no page config for this watch.");
      // A store that started over is a restart; a newer record a rebase.
      if (record.revision < draft.revision) draft.restart(record.document as WatchPagesDocument, record.revision);
      else draft.rebase(record.document as WatchPagesDocument, record.revision);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged };
  }
}
