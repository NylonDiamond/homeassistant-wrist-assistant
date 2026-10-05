// The HTTP action library being edited in the panel, how it is saved, and
// the one draft kept for it.
//
// The Control Center draft's shape (`watch-control-center/draft.ts`): the
// document Home Assistant holds (`base`) at its revision, the document as
// edited now, and the undo and redo steps between. When Home Assistant moves
// on under an open draft (a phone handing its library over, or a save that
// met a conflict) every step is merged onto the newer document by
// `mergeHttpActions`, so no edit to an action or global the other side left
// alone is lost and an undo never takes the other side's change back. One
// both sides changed keeps the draft's copy.
//
// The library is the home's, not a watch's, so there is one draft, kept
// here rather than in the element: the element is made anew each time the
// route opens, and the draft outlives that. It lives in memory only: the
// library holds secrets, and nothing of it goes to the browser's storage.
//
// A home with no library yet (revision 0) gets a draft when "Add an action"
// is pressed: the empty library at revision 0, which the first save creates.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rules 10 and 11).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type HttpActionsClash, httpActionsClashes, mergeHttpActions } from "./merge.js";
import { type HttpActionsDoc, checkHttpActions, httpActionsBudget, httpActionsEmpty } from "./model.js";

export const HTTP_ACTIONS_UNDO_LIMIT = 100;
export const HTTP_ACTIONS_SAVE_ATTEMPTS = 3;

export class HttpActionsDraft {
  private _base: HttpActionsDoc;
  private _revision: number;
  private _document: HttpActionsDoc;
  private _undo: HttpActionsDoc[] = [];
  private _redo: HttpActionsDoc[] = [];
  private _coalesceKey: string | undefined;
  private _dirty: { document: HttpActionsDoc; base: HttpActionsDoc; value: boolean } | undefined;
  private _kept: HttpActionsClash[] = [];

  constructor(document: HttpActionsDoc, revision: number) {
    this._base = document;
    this._revision = revision;
    this._document = document;
  }

  get base(): HttpActionsDoc {
    return this._base;
  }

  get revision(): number {
    return this._revision;
  }

  get document(): HttpActionsDoc {
    return this._document;
  }

  get canUndo(): boolean {
    return this._undo.length > 0;
  }

  get canRedo(): boolean {
    return this._redo.length > 0;
  }

  /** What the last merge (`rebase`, `restart`) found changed on both sides:
   * the draft's copy stayed. Empty when nothing clashed. */
  get kept(): readonly HttpActionsClash[] {
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
  apply(next: HttpActionsDoc, coalesce?: string): boolean {
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
  rebase(server: HttpActionsDoc, revision: number): boolean {
    if (revision < this._revision) {
      this._kept = [];
      return false;
    }
    return this.mergeOnto(server, revision);
  }

  /** The store started over at a lower revision: merged as `rebase`, and the
   * lower revision taken, so the next save names one the store holds. */
  restart(server: HttpActionsDoc, revision: number): boolean {
    return this.mergeOnto(server, revision);
  }

  private mergeOnto(server: HttpActionsDoc, revision: number): boolean {
    this._coalesceKey = undefined;
    const oldBase = this._base;
    this._kept = this._document === oldBase ? [] : httpActionsClashes(oldBase, this._document, server);
    const done = new Map<HttpActionsDoc, HttpActionsDoc>();
    const merged = (document: HttpActionsDoc): HttpActionsDoc => {
      const known = done.get(document);
      if (known !== undefined) return known;
      let out = document === oldBase ? server : mergeHttpActions(oldBase, document, server);
      if (out !== server && sameWatchPagesJson(out, server)) out = server;
      done.set(document, out);
      return out;
    };
    const before = this._document;
    const timeline = [...this._undo, this._document, ...this._redo.slice().reverse()].map(merged);
    const current = this._undo.length;
    const kept: HttpActionsDoc[] = [];
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
  saved(document: HttpActionsDoc, revision: number): void {
    if (revision < this._revision) return;
    this._coalesceKey = undefined;
    this._base = document;
    this._revision = revision;
  }

  get saving(): boolean {
    return saves.has(this);
  }

  get saveDone(): Promise<HttpActionsSaveResult> | undefined {
    return saves.get(this);
  }

  private pushUndo(document: HttpActionsDoc): void {
    this._undo.push(document);
    if (this._undo.length > HTTP_ACTIONS_UNDO_LIMIT) this._undo.splice(0, this._undo.length - HTTP_ACTIONS_UNDO_LIMIT);
  }
}

// ── saving ───────────────────────────────────────────────────────────────

export interface HttpActionsSaveIO {
  save(baseRevision: number, document: HttpActionsDoc): Promise<{ revision: number }>;
  /** The library as Home Assistant holds it now; no document at revision 0. */
  fetch(): Promise<{ revision: number; document?: unknown }>;
}

export interface HttpActionsSaveResult {
  ok: boolean;
  revision: number;
  merged: boolean;
  alreadySaved?: boolean;
  /** What the other side also changed while this save ran, whose copy from
   * here stayed. Only when there is one. */
  kept?: HttpActionsClash[];
  code?: string;
  message?: string;
  problems?: string[];
}

const saves = new WeakMap<HttpActionsDraft, Promise<HttpActionsSaveResult>>();

/**
 * Saves the draft: a document `checkHttpActions` finds fault with, or one
 * past the size Home Assistant keeps, is not sent (`invalid`); a `conflict`
 * reads the newest library, merges the draft onto it and saves again, at
 * most `HTTP_ACTIONS_SAVE_ATTEMPTS` sends in all. One save at a time
 * (`busy`).
 */
export function saveHttpActionsDraft(draft: HttpActionsDraft, io: HttpActionsSaveIO): Promise<HttpActionsSaveResult> {
  if (saves.has(draft)) {
    return Promise.resolve({ ok: false, revision: draft.revision, merged: false, code: "busy", message: "The HTTP actions are being saved already." });
  }
  const running = runSave(draft, io).finally(() => saves.delete(draft));
  saves.set(draft, running);
  return running;
}

function sizeProblems(document: HttpActionsDoc): string[] {
  const budget = httpActionsBudget(document);
  if (budget.size <= budget.limit) return [];
  return [`The library is ${Math.ceil(budget.size / 1024)} KB, past the ${budget.limit / 1024} KB Home Assistant keeps.`];
}

async function runSave(draft: HttpActionsDraft, io: HttpActionsSaveIO): Promise<HttpActionsSaveResult> {
  let merged = false;
  const kept = new Map<string, HttpActionsClash>();
  const keptList = (): { kept?: HttpActionsClash[] } => (kept.size === 0 ? {} : { kept: [...kept.values()] });
  const failed = (code: string, message: string, problems?: string[]): HttpActionsSaveResult => ({
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
    const problems = [...checkHttpActions(sent), ...sizeProblems(sent)];
    if (problems.length > 0) return failed("invalid", problems.join(" "), problems);
    let revision: number;
    try {
      ({ revision } = await io.save(draft.revision, sent));
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= HTTP_ACTIONS_SAVE_ATTEMPTS) return failed(code, message);
      let record: { revision: number; document?: unknown };
      try {
        record = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return failed(e.code ?? "unknown", e.message);
      }
      const revisionNow = isJsonObject(record) && typeof record.revision === "number" ? record.revision : 0;
      const server = isJsonObject(record) && isJsonObject(record.document) ? record.document : httpActionsEmpty();
      if (revisionNow < draft.revision) draft.restart(server, revisionNow);
      else draft.rebase(server, revisionNow);
      for (const clash of draft.kept) kept.set(`${clash.list}:${clash.key}`, clash);
      merged = true;
      if (!draft.dirty) return { ok: true, revision: draft.revision, merged, alreadySaved: true, ...keptList() };
      continue;
    }
    draft.saved(sent, revision);
    return { ok: true, revision: draft.revision, merged, ...keptList() };
  }
}

// ── the kept draft ───────────────────────────────────────────────────────

let kept: HttpActionsDraft | undefined;

export function keptHttpActionsDraft(): HttpActionsDraft | undefined {
  return kept;
}

/**
 * The library was read: `document` at `revision`. Nothing kept makes a new
 * draft; an older draft is rebased; a draft at a newer revision (the store
 * started over) is replaced when clean and restarted when dirty. Revision 0
 * makes no draft and leaves a kept one as it is.
 */
export function takeHttpActionsRecord(
  document: HttpActionsDoc | undefined,
  revision: number,
): { draft?: HttpActionsDraft; mergedIntoEdits: boolean; kept: readonly HttpActionsClash[] } {
  const held = kept;
  if (revision <= 0 || document === undefined) return { ...(held === undefined ? {} : { draft: held }), mergedIntoEdits: false, kept: [] };
  if (held === undefined || (revision < held.revision && !held.dirty)) {
    const fresh = new HttpActionsDraft(document, revision);
    kept = fresh;
    return { draft: fresh, mergedIntoEdits: false, kept: [] };
  }
  if (revision === held.revision) return { draft: held, mergedIntoEdits: false, kept: [] };
  const dirty = held.dirty;
  const changed = revision < held.revision ? held.restart(document, revision) : held.rebase(document, revision);
  return { draft: held, mergedIntoEdits: dirty && changed, kept: dirty ? held.kept : [] };
}

/** A draft over the empty library at revision 0, for a home with none yet:
 * the kept one when there is one. */
export function startHttpActionsDraft(): HttpActionsDraft {
  kept ??= new HttpActionsDraft(httpActionsEmpty(), 0);
  return kept;
}

export function forgetHttpActionsDraft(): void {
  kept = undefined;
}

export function httpActionsDirty(): boolean {
  return kept?.dirty ?? false;
}

export function dropHttpActionsDraft(): void {
  kept = undefined;
}
