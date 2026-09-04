// The in-browser draft: one complication being edited, with undo/redo and a
// dirty flag against the record it was loaded from. Nothing here touches
// the server; the panel calls `saveRecord` with `encoded()` and
// `baseRevision` and then `commit()`s on success (plan §"Save and conflict
// rules").

import { type CustomComplicationConfig, encodeConfig, parseConfig, syncAttachedTaps } from "./model.js";
import { deriveDataSources } from "./compiler.js";

const HISTORY_LIMIT = 100;

/** What a draft's saved state is, for the one line the panel's footer shows
 * while it is collapsed. */
export interface DraftStatusInput {
  /** Revision on the server, or null for a complication never saved. */
  revision: number | null;
  dirty: boolean;
  /** A failed save, which outranks everything else here. */
  error?: string;
  /** A template that did not render, which is a live document that is wrong
   * rather than a document that failed to store. */
  templateError?: string;
}

export interface DraftStatus {
  tone: "ok" | "warn" | "err";
  text: string;
}

/**
 * The footer's summary line.
 *
 * Worst news first: a save that failed is the only thing worth reading, then a
 * template that will not render, then work that is not on the server yet.
 * Everything fine is the only case that names the revision, because that is
 * the only case where the number is the whole story.
 */
export function draftStatus(i: DraftStatusInput): DraftStatus {
  if (i.error !== undefined && i.error !== "") return { tone: "err", text: `Not saved: ${i.error}` };
  if (i.templateError !== undefined && i.templateError !== "") return { tone: "err", text: `Template error: ${i.templateError}` };
  if (i.dirty) return { tone: "warn", text: "Unsaved changes" };
  if (i.revision === null) return { tone: "warn", text: "Not saved yet" };
  return { tone: "ok", text: `Saved, revision ${i.revision}` };
}

export class Draft {
  /** Revision the draft was loaded from; null for a brand-new complication. */
  readonly baseRevision: number | null;
  private baseline: string;
  private past: CustomComplicationConfig[] = [];
  private future: CustomComplicationConfig[] = [];
  private coalesceKey?: string;
  private coalesceUntil = 0;

  constructor(public config: CustomComplicationConfig, baseRevision: number | null) {
    this.baseRevision = baseRevision;
    // A document can arrive with an attached tap whose owner is gone, or out of
    // step with it, from a hand-edit or an older panel. Heal it here, before
    // the baseline is taken, so the draft opens clean and the correction rides
    // along with the next real save instead of nagging about unsaved changes.
    syncAttachedTaps(config);
    this.baseline = JSON.stringify(encodeConfig(config));
  }

  static fromDocument(document: unknown, revision: number): Draft {
    return new Draft(parseConfig(document), revision);
  }

  get dirty(): boolean {
    return JSON.stringify(encodeConfig(this.config)) !== this.baseline;
  }
  get canUndo(): boolean {
    return this.past.length > 0;
  }
  get canRedo(): boolean {
    return this.future.length > 0;
  }

  /** Apply a change. `coalesce` merges rapid edits of the same control (typing,
   * dragging) into one undo step. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string): void {
    const now = Date.now();
    const merge = coalesce !== undefined && coalesce === this.coalesceKey && now < this.coalesceUntil;
    if (!merge) {
      this.past.push(structuredClone(this.config));
      if (this.past.length > HISTORY_LIMIT) this.past.shift();
      this.future = [];
    }
    this.coalesceKey = coalesce;
    this.coalesceUntil = coalesce === undefined ? 0 : now + 800;
    const next = structuredClone(this.config);
    mutate(next);
    // One place keeps attached taps glued to their owners, so no call site has
    // to know about them: whatever the edit was, the tap follows.
    syncAttachedTaps(next);
    this.config = next;
  }

  /** Close the current coalescing window (pointer up, blur). */
  endGesture(): void {
    this.coalesceKey = undefined;
    this.coalesceUntil = 0;
  }

  undo(): void {
    const prev = this.past.pop();
    if (!prev) return;
    this.future.push(this.config);
    this.config = prev;
    this.endGesture();
  }

  redo(): void {
    const next = this.future.pop();
    if (!next) return;
    this.past.push(this.config);
    this.config = next;
    this.endGesture();
  }

  /** The document to send: current config with `dataSources` re-derived. */
  encoded(): Record<string, unknown> {
    const cfg = structuredClone(this.config);
    cfg.dataSources = deriveDataSources(cfg);
    return encodeConfig(cfg);
  }

  /** After a successful save: the server copy is now the baseline. */
  commit(): Draft {
    const cfg = structuredClone(this.config);
    cfg.dataSources = deriveDataSources(cfg);
    return new Draft(cfg, null);
  }
}
