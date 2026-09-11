// The in-browser draft: one complication being edited, with undo/redo and a
// dirty flag against the record it was loaded from. Nothing here touches
// the server; the panel calls `saveRecord` with `encoded()` and
// `baseRevision` and then `commit()`s on success (plan §"Save and conflict
// rules").

import { type CustomComplicationConfig, type FamilyKind, encodeConfig, normalizeOwnership, parseConfig, syncAttachedTaps } from "./model.js";
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
  /** A gesture held open by `beginGesture`: every update until `endGesture`
   * is one undo step, whatever coalescing key each one carries. */
  private held = false;
  private heldStepTaken = false;

  constructor(public config: CustomComplicationConfig, baseRevision: number | null) {
    this.baseRevision = baseRevision;
    // A document can arrive with an attached tap whose owner is gone, or out of
    // step with it, from a hand-edit or an older panel. It can also arrive from
    // an older panel with one layer drawn by two shapes at once, which this
    // editor no longer has a way to show. Heal both here, before the baseline
    // is taken, so the draft opens clean and the corrections ride along with
    // the next real save instead of nagging about unsaved changes. Neither
    // changes what the watch draws.
    normalizeOwnership(config);
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
   * dragging) into one undo step. `home` is the shape being edited, which is
   * where a layer the change added belongs. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string, home?: FamilyKind): void {
    const now = Date.now();
    const merge = this.held
      ? this.heldStepTaken
      : coalesce !== undefined && coalesce === this.coalesceKey && now < this.coalesceUntil;
    if (!merge) {
      this.past.push(structuredClone(this.config));
      if (this.past.length > HISTORY_LIMIT) this.past.shift();
      this.future = [];
    }
    this.heldStepTaken = this.held;
    this.coalesceKey = coalesce;
    this.coalesceUntil = coalesce === undefined ? 0 : now + 800;
    const next = structuredClone(this.config);
    mutate(next);
    // Two invariants are kept in one place, so no call site has to know about
    // either. A layer the change added belongs to the shape being edited and
    // to no other; and whatever the edit was, an attached tap follows its
    // owner. Ownership settles first, because the tap follows its owner onto
    // the owner's shape.
    normalizeOwnership(next, home);
    syncAttachedTaps(next);
    this.config = next;
  }

  /**
   * Count a brand-new draft as unsaved work straight away.
   *
   * A draft opens clean, because its baseline is the document it was built
   * from. That is right for a record loaded off the server and wrong for one
   * that arrived by paste: none of it is stored anywhere yet, so Save has to be
   * live before the first edit rather than after it. Clearing the baseline is
   * the whole of it, since no encoded document is the empty string, and the
   * undo and redo stacks are untouched.
   */
  markDirty(): void {
    this.baseline = "";
  }

  /** Hold one gesture open, such as a drag on a number's title: every update
   * until `endGesture` lands in a single undo step, even when the edits carry
   * no coalescing key or different ones. */
  beginGesture(): void {
    this.endGesture();
    this.held = true;
  }

  /** Close the current coalescing window (pointer up, blur), and any held
   * gesture. */
  endGesture(): void {
    this.coalesceKey = undefined;
    this.coalesceUntil = 0;
    this.held = false;
    this.heldStepTaken = false;
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
