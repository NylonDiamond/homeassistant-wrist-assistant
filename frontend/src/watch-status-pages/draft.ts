// The status pages being edited in the panel, how they are saved, and the
// drafts kept per watch.
//
// The same shape as the menu draft (`watch-menus/draft.ts`): the document
// Home Assistant holds (`base`) at its revision, the document as edited now,
// and the undo and redo steps between. When Home Assistant moves on under an
// open draft (another save, or a save that met a conflict) every step is
// merged onto the newer document by `mergeStatusPages`, so no edit to a page
// the other side left alone is lost and an undo never takes the other side's
// change back. A page both sides changed keeps the other side's version.
//
// The drafts live here, one per watch, not in the element: the element is
// made anew each time the route opens, and a draft outlives that.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 17).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { isJsonObject } from "../watch-pages/model.js";
import type { WatchConfigLinkFailure } from "../ha-api.js";
import { linkFailuresOf, watchCommandError } from "../watch-pages/save-note.js";
import { mergeStatusPages, statusPagesClashes } from "./merge.js";
import { type StatusPagesDocument, checkStatusPages, statusPagesDefaults } from "./model.js";

export const STATUS_PAGES_UNDO_LIMIT = 100;
export const STATUS_PAGES_SAVE_ATTEMPTS = 3;

/** A page both sides changed: the server's version stayed. */
export interface StatusPageClash {
  id: string;
  name: string;
}

export class StatusPagesDraft {
  private _base: StatusPagesDocument;
  private _revision: number;
  private _document: StatusPagesDocument;
  private _undo: StatusPagesDocument[] = [];
  private _redo: StatusPagesDocument[] = [];
  private _coalesceKey: string | undefined;
  private _dirty: { document: StatusPagesDocument; base: StatusPagesDocument; value: boolean } | undefined;
  private _kept: StatusPageClash[] = [];

  constructor(document: StatusPagesDocument, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  get base(): StatusPagesDocument {
    return this._base;
  }

  get revision(): number {
    return this._revision;
  }

  get document(): StatusPagesDocument {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** The pages the last merge (`rebase`, `restart`) found changed on both
   * sides: the other side's version stayed and the draft's change there was
   * dropped. Empty when nothing clashed. */
  get kept(): readonly StatusPageClash[] {
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
   * after another are one step (typing, a slider's drag). Returns whether
   * the document changed. */
  apply(next: StatusPagesDocument, coalesce?: string): boolean {
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
  rebase(server: StatusPagesDocument, revision: number): boolean {
    if (revision < this._revision) {
      this._kept = [];
      return false;
    }
    return this.mergeOnto(server, revision);
  }

  /** The store started over at a lower revision: merged as `rebase`, and the
   * lower revision taken, so the next save names one the store holds. */
  restart(server: StatusPagesDocument, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  private mergeOnto(server: StatusPagesDocument, revision: number): boolean {
    this._coalesceKey = undefined;
    const oldBase = this._base;
    this._kept = this._document === oldBase ? [] : statusPagesClashes(oldBase, this._document, server);
    const done = new Map<StatusPagesDocument, StatusPagesDocument>();
    const merged = (document: StatusPagesDocument): StatusPagesDocument => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out = document === oldBase ? server : mergeStatusPages(oldBase, document, server);
      if (out !== server && sameWatchPagesJson(out, server)) out = server;
      done.set(document, out);
      return out;
    };
    const before = this._document;
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: StatusPagesDocument[] = [];
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
  saved(document: StatusPagesDocument, revision: number): void {
    if (revision < this._revision) return;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  get saving(): boolean {
    return saves.has(this);
  }

  get saveDone(): Promise<StatusPagesSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: StatusPagesDocument): void {
    this._undo.push(document);
    if (this._undo.length > STATUS_PAGES_UNDO_LIMIT) this._undo.splice(0, this._undo.length - STATUS_PAGES_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

export interface StatusPagesSaveIO {
  save(baseRevision: number, document: StatusPagesDocument): Promise<{ revision: number; link_failures?: unknown }>;
  fetch(): Promise<{ revision: number; document: unknown }>;
}

export interface StatusPagesSaveResult {
  ok: boolean;
  revision: number;
  merged: boolean;
  alreadySaved?: boolean;
  /** The pages another save also changed while this one ran, whose other
   * version stayed (the merge's grain is the page). Only when there is one. */
  kept?: StatusPageClash[];
  /** The devices whose linked copies the save could not update, as its
   * reply named them (`link_failures`). Only when there is one. */
  linkFailures?: WatchConfigLinkFailure[];
  code?: string;
  message?: string;
  problems?: string[];
}

const saves = new WeakMap<StatusPagesDraft, Promise<StatusPagesSaveResult>>();

/**
 * Saves the draft: a document `checkStatusPages` finds fault with is not
 * sent (`invalid`); a `conflict` reads the newest record, merges the draft
 * onto it and saves again, at most `STATUS_PAGES_SAVE_ATTEMPTS` sends in all.
 * One save per draft at a time (`busy`).
 */
export function saveStatusPagesDraft(draft: StatusPagesDraft, io: StatusPagesSaveIO): Promise<StatusPagesSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({ ok: false, revision: draft.revision, merged: false, code: "busy", message: "These status pages are being saved already." });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

async function runSave(draft: StatusPagesDraft, io: StatusPagesSaveIO): Promise<StatusPagesSaveResult> {
  let merged = false;
  const kept = new Map<string, StatusPageClash>();
  const keptList = (): { kept?: StatusPageClash[] } => (kept.size === 0 ? {} : { kept: [...kept.values()] });
  const failed = (code: string, message: string, problems?: string[]): StatusPagesSaveResult => ({
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
    const problems = checkStatusPages(sent);
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    let linkFailures: WatchConfigLinkFailure[];
    try {
      const reply = await io.save(draft.revision, sent);
      revision = reply.revision;
      linkFailures = linkFailuresOf(reply);
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= STATUS_PAGES_SAVE_ATTEMPTS) return failed(code, message);
      let record: { revision: number; document: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return failed(e.code ?? "unknown", e.message);
      }
      if (!isJsonObject(record) || !(record.revision > 0) || !isJsonObject(record.document)) {
        return failed("no_record", "Home Assistant holds no status pages for this watch.");
      }
      if (record.revision < draft.revision) draft.restart(record.document, record.revision);
      else draft.rebase(record.document, record.revision);
      for (const clash of draft.kept) kept.set(clash.id.toUpperCase(), clash);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true, ...keptList() };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged, ...keptList(), ...(linkFailures.length === 0 ? {} : { linkFailures }) };
  }
}

// ── the kept drafts ──────────────────────────────────────────────────────

const drafts = new Map<string, StatusPagesDraft>();

export function keptStatusPagesDraft(watchId: string): StatusPagesDraft | undefined {
  return drafts.get(watchId);
}

/**
 * A record of `watchId`'s status pages was read: `document` at `revision`.
 * Nothing kept makes a new draft; an older draft is rebased; a draft at a
 * newer revision (the store started over) is replaced when clean and
 * restarted when dirty. Revision 0 leaves a kept draft as it is.
 */
export function takeStatusPagesRecord(
  watchId: string,
  document: StatusPagesDocument,
  revision: number,
): { draft: StatusPagesDraft; mergedIntoEdits: boolean; kept: readonly StatusPageClash[] } {
  const held = drafts.get(watchId);
  if (held !== undefined && revision <= 0) return { draft: held, mergedIntoEdits: false, kept: [] };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
    const fresh = new StatusPagesDraft(document, revision);
    drafts.set(watchId, fresh);
    return { draft: fresh, mergedIntoEdits: false, kept: [] };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false, kept: [] };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed, kept: dirty ? held.kept : [] };
}

/**
 * The draft a new watch's status pages screen opens on while Home Assistant
 * holds none for it (`watch-menus/new-watch.ts`): the kept one, else a new
 * one on the app's five system pages at revision 0, unsaved and not dirty.
 * Nothing is written: its first save is a save over revision 0, which makes
 * the record. A kept draft from an earlier record (Home Assistant started
 * over) is moved onto the defaults at revision 0, its edits kept, unless it
 * is being saved.
 */
export function newWatchStatusPagesDraft(watchId: string): StatusPagesDraft {
  const held = drafts.get(watchId);
  if (held === undefined) {
    const fresh = new StatusPagesDraft(statusPagesDefaults(), 0);
    drafts.set(watchId, fresh);
    return fresh;
  }
  if (held.revision > 0 && !held.saving) held.restart(statusPagesDefaults(), 0);
  return held;
}

export function forgetStatusPagesDraft(watchId: string): void {
  drafts.delete(watchId);
}

export function anyStatusPagesDirty(): boolean {
  for (const draft of drafts.values()) if (draft.dirty) return true;
  return false;
}

export function dropAllStatusPages(): void {
  drafts.clear();
  pageAsks.clear();
  newPageAsks.clear();
}

/** The status page each device's editor should show as it opens: a card on
 * the Status pages tab asked for it. */
const pageAsks = new Map<string, string>();

/** Ask the editor to show `pageId` the next time it opens `watchId`. */
export function askStatusPage(watchId: string, pageId: string): void {
  pageAsks.set(watchId, pageId);
}

/** The status page asked for on `watchId`, forgetting the ask. */
export function takeStatusPageAsk(watchId: string): string | undefined {
  const pageId = pageAsks.get(watchId);
  pageAsks.delete(watchId);
  return pageId;
}

/** The devices whose status pages editor should add a page as it opens: the
 * Status pages tab's New status page asked for one there. */
const newPageAsks = new Set<string>();

/** Ask the editor to add a status page on `watchId` the next time it reads
 * them. */
export function askNewStatusPage(watchId: string): void {
  newPageAsks.add(watchId);
}

/** Whether a status page was asked for on `watchId`, forgetting the ask. */
export function takeNewStatusPageAsk(watchId: string): boolean {
  return newPageAsks.delete(watchId);
}
