// The in-browser draft: one complication being edited, with undo/redo and a
// dirty flag against the record it was loaded from. Nothing here touches
// the server; the panel calls `saveRecord` with `encoded()` and
// `baseRevision` and then `commit()`s on success (plan §"Save and conflict
// rules").

import { type CustomComplicationConfig, type FamilyKind, type ValueKind, describeSite, encodeConfig, forEachValue, liftChartOwnMarks, normalizeOwnership, parseConfig, syncAttachedTaps } from "./model.js";
import { deriveDataSources } from "./compiler.js";
import { inlineToParts, syncInlineParts } from "./rich-text.js";

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

/**
 * Why this document cannot be saved, or undefined when it can.
 *
 * A complication is one shape on one kind of device, so a document with two
 * or more shapes is one an older panel wrote. Those still open, and every app
 * still draws them, but saving one back would write the old form again and
 * undo whatever the split did. So the editor reads it and refuses the write,
 * in the same words wherever the save was pressed.
 *
 * It also refuses a document with a value that points at nothing: see
 * `blankReferenceRefusal`.
 *
 * See docs/complication_one_shape_per_document.md in the app repo.
 */
export function saveRefusal(cfg: CustomComplicationConfig): string | undefined {
  const shapes = cfg.supportedFamilies.length;
  if (shapes >= 2) return `This complication has ${shapes} shapes, and a complication is one shape now. Split it into one complication per shape to edit it.`;
  return blankReferenceRefusal(cfg);
}

/** What a value that points at something reads, for a refusal's sentence, or
 * undefined for a value that points at nothing or has chosen what it reads. */
function blankReferenceWord(k: ValueKind): string | undefined {
  switch (k.kind) {
    case "named": return k.id.trim() === "" ? "a shared value" : undefined;
    case "chartStat": return k.layer.trim() === "" ? "a chart" : undefined;
    case "listStat": return k.layer.trim() === "" ? "a list" : undefined;
    case "imageTime": return k.layer.trim() === "" ? "a picture" : undefined;
    default: return undefined;
  }
}

/**
 * The first value that reads a shared value, chart, list or picture nobody
 * has chosen yet, as the sentence the footer shows.
 *
 * Picking one of those sources starts it on "(choose)", and a document saved
 * that way carries an empty string where the watch expects an id. The app
 * cannot read the id, so it throws the whole complication away rather than the
 * one value. Every value is walked, including a shape that is no longer drawn,
 * because those are on the wire too.
 */
export function blankReferenceRefusal(cfg: CustomComplicationConfig): string | undefined {
  let out: string | undefined;
  forEachValue(cfg, (v, site) => {
    if (out !== undefined) return;
    const what = blankReferenceWord(v.kind);
    if (what === undefined) return;
    out = `${describeSite(site)} reads ${what} that is not chosen. Choose one, or pick another source.`;
  });
  return out;
}

/** One undo step: the document, and the values typed in to test it. */
interface Step {
  config: CustomComplicationConfig;
  testValues: ReadonlyMap<string, string>;
}

export class Draft {
  /** Revision the draft was loaded from; null for a brand-new complication. */
  readonly baseRevision: number | null;
  /**
   * Values typed or slid in to test the preview, by entity id. Not part of the
   * document: never saved and never dirty. They live here only so undo and
   * redo walk them with everything else, since trying a value is an edit to
   * what the screen shows. Replaced, never changed in place, so a step can keep
   * the map it saw without copying it.
   */
  testValues: ReadonlyMap<string, string> = new Map();
  private baseline: string;
  private past: Step[] = [];
  private future: Step[] = [];
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
    // A chart's highlight, lines and times are always layers now; one saved
    // while the chart drew its own opens converted.
    liftChartOwnMarks(config);
    // An Inline line is always parts in the editor; one saved without them
    // opens converted, drawing exactly what it drew.
    inlineToParts(config);
    syncInlineParts(config);
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
    this.takeStep(coalesce);
    const next = structuredClone(this.config);
    mutate(next);
    // The invariants are kept in one place, so no call site has to know about
    // any of them. A layer the change added belongs to the shape being edited and
    // to no other; and whatever the edit was, an attached tap follows its
    // owner. Ownership settles first, because the tap follows its owner onto
    // the owner's shape.
    normalizeOwnership(next, home);
    syncAttachedTaps(next);
    // The Inline line is its parts joined, and a part may read a shared value
    // this edit changed. A line this edit added arrives with no parts.
    inlineToParts(next);
    syncInlineParts(next);
    this.config = next;
  }

  /** Try other values in the preview, as an undo step of its own. `coalesce`
   * merges a slider's run of values into one step, the way typing is merged. */
  setTestValues(next: ReadonlyMap<string, string>, coalesce?: string): void {
    this.takeStep(coalesce);
    this.testValues = next;
  }

  /** Save what is about to change for undo, unless this edit continues the
   * last one: the same control inside its coalescing window, or a held
   * gesture that has already saved its step. */
  private takeStep(coalesce: string | undefined): void {
    const now = Date.now();
    const merge = this.held
      ? this.heldStepTaken
      : coalesce !== undefined && coalesce === this.coalesceKey && now < this.coalesceUntil;
    if (!merge) {
      this.past.push({ config: structuredClone(this.config), testValues: this.testValues });
      if (this.past.length > HISTORY_LIMIT) this.past.shift();
      this.future = [];
    }
    this.heldStepTaken = this.held;
    this.coalesceKey = coalesce;
    this.coalesceUntil = coalesce === undefined ? 0 : now + 800;
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
    this.future.push({ config: this.config, testValues: this.testValues });
    this.config = prev.config;
    this.testValues = prev.testValues;
    this.endGesture();
  }

  redo(): void {
    const next = this.future.pop();
    if (!next) return;
    this.past.push({ config: this.config, testValues: this.testValues });
    this.config = next.config;
    this.testValues = next.testValues;
    this.endGesture();
  }

  /** The document to send: current config with `dataSources` re-derived. */
  encoded(): Record<string, unknown> {
    const cfg = structuredClone(this.config);
    cfg.dataSources = deriveDataSources(cfg);
    return encodeConfig(cfg);
  }

  /**
   * After a successful save: the stored copy is the new baseline.
   *
   * Undo and redo survive it. A save is a milestone, not a fresh start, and
   * throwing the stacks away meant Ctrl-Z did nothing at all right after the
   * one moment people reach for it. What changes is the baseline and the
   * revision, so the draft reads clean now and reads dirty again the moment
   * an undo walks off the saved document.
   *
   * The values being tried come along for the same reason they walk with the
   * undo stack: they are part of what is on screen, and saving does not
   * change what anyone was testing.
   */
  commit(revision: number, savedDocument?: Record<string, unknown>): Draft {
    const cfg = structuredClone(this.config);
    cfg.dataSources = deriveDataSources(cfg);
    const next = new Draft(cfg, revision);
    // A save can finish after another edit. The baseline is what the server
    // accepted, not the draft as it happens to look when the reply arrives.
    if (savedDocument !== undefined) next.baseline = JSON.stringify(savedDocument);
    next.past = this.past;
    next.future = this.future;
    next.testValues = this.testValues;
    return next;
  }
}
