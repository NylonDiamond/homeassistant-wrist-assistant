// The map editor's document between Home Assistant and the page: what the
// page shows, what Home Assistant last confirmed, the undo and redo stack,
// and the saves still to make. Kept apart from the element so the editing
// rules can be tested without a browser.
//
// An edit (`apply`) is an `edit-ops.ts` function of the map. It is made on
// the shown map at once, so the plan never waits on the network, recorded
// for undo, and queued. One save runs at a time: everything queued while a
// save is out goes in the next one, made as a single change on the map Home
// Assistant confirmed (`save.ts`), which reads the map again and makes the
// change once more after a `conflict`. When that happens (`merged`) the page
// shows the merged map with the edits still queued made on top, and the
// undo stack is cleared, since its maps lack the other device's change. A
// save that fails drops the queue, shows the map as Home Assistant holds it
// and says why.
//
// Undo and redo hand back a whole earlier map; saved as "this map, if Home
// Assistant still holds the one I undid from", so an undo made after
// another device saved never throws that device's change away.

import type { HomeMapOp } from "./edit-ops.js";
import { HomeMapHistory } from "./edit-ops.js";
import { type HomeMapDocument, type HomeMapRead, checkHomeMap } from "./model.js";
import { type HomeMapApi, HOME_MAP_MERGED_TEXT, saveHomeMapEdit } from "./save.js";

/** Where the saves stand, for the bar's Saved / Saving / Not saved. */
export type HomeMapSaveState = { kind: "saved" } | { kind: "saving" } | { kind: "error"; text: string };

/** A line the page shows over the editor until dismissed. */
export interface HomeMapNote {
  kind: "warn" | "err";
  text: string;
}

/** The text of a map with its keys in one order, so two maps are compared
 * by what they hold. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Whether two maps hold the same. */
export function sameHomeMapDocument(a: HomeMapDocument | null | undefined, b: HomeMapDocument | null | undefined): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return canonical(a) === canonical(b);
}

/** The change an undo or redo saves: `to`, when the map is still `from`. */
function swap(from: HomeMapDocument, to: HomeMapDocument): HomeMapOp {
  return (doc) => (sameHomeMapDocument(doc, from) ? to : undefined);
}

export class HomeMapSession {
  /** The map as Home Assistant last confirmed it. */
  confirmed: HomeMapRead;
  /** The map the page shows: the confirmed one with the queued edits. */
  doc: HomeMapDocument | null;
  readonly history: HomeMapHistory;
  state: HomeMapSaveState = { kind: "saved" };
  note: HomeMapNote | undefined;
  private queue: HomeMapOp[] = [];
  private running: Promise<void> | undefined;

  /**
   * `api` saves and reads; `changed` is called after anything the page
   * draws changed; `saved` with each map Home Assistant now holds (the
   * page hands it to `store.ts`).
   */
  constructor(
    private readonly api: HomeMapApi,
    read: HomeMapRead,
    private readonly changed: () => void = () => undefined,
    private readonly saved: (read: HomeMapRead) => void = () => undefined,
    cap?: number,
  ) {
    this.confirmed = read;
    this.doc = read.doc;
    this.history = new HomeMapHistory(cap);
  }

  /** Whether an edit is still to be saved or a save is out. */
  get busy(): boolean {
    return this.queue.length > 0 || this.running !== undefined;
  }

  get canUndo(): boolean {
    return this.doc !== null && this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.doc !== null && this.history.canRedo;
  }

  /** A map read afresh (the page opened again). Ignored while a save is
   * out or queued, which will bring a newer one; else it replaces the map
   * and forgets the undo stack. */
  load(read: HomeMapRead): boolean {
    if (this.busy) return false;
    this.confirmed = read;
    this.doc = read.doc;
    this.history.clear();
    this.changed();
    return true;
  }

  /**
   * Make an edit: on the shown map now, recorded for undo, saved soon.
   * False, and nothing changes, when there is no map, the edit no longer
   * fits it (it returned undefined) or the result is a map the store would
   * refuse (then `note` says why).
   */
  apply(op: HomeMapOp): boolean {
    const from = this.doc;
    if (from === null) return false;
    const next = op(from);
    if (next === undefined) return false;
    const checked = checkHomeMap(next);
    if (!checked.ok) {
      this.note = { kind: "err", text: `That cannot be saved. ${checked.message}.` };
      this.changed();
      return false;
    }
    this.history.push(from);
    this.doc = checked.doc;
    this.enqueue(op);
    return true;
  }

  /** Go back one edit. False when there is none. */
  undo(): boolean {
    const current = this.doc;
    if (current === null) return false;
    const before = this.history.undo(current);
    if (before === undefined) return false;
    this.doc = before;
    this.enqueue(swap(current, before));
    return true;
  }

  /** Make the last undone edit again. False when there is none. */
  redo(): boolean {
    const current = this.doc;
    if (current === null) return false;
    const next = this.history.redo(current);
    if (next === undefined) return false;
    this.doc = next;
    this.enqueue(swap(current, next));
    return true;
  }

  /** Waits for every queued save. */
  async idle(): Promise<void> {
    while (this.running !== undefined) await this.running;
  }

  dismissNote(): void {
    this.note = undefined;
    if (this.state.kind === "error") this.state = { kind: "saved" };
    this.changed();
  }

  private enqueue(op: HomeMapOp): void {
    this.queue.push(op);
    if (this.state.kind === "error") this.state = { kind: "saved" };
    this.changed();
    this.kick();
  }

  /** Start the saves unless they are running. An edit queued just as the
   * last save finished starts them again. */
  private kick(): void {
    if (this.running !== undefined) return;
    this.running = this.run().finally(() => {
      this.running = undefined;
      if (this.queue.length > 0) this.kick();
      else this.changed();
    });
  }

  private async run(): Promise<void> {
    while (this.queue.length > 0) {
      const ops = this.queue.splice(0);
      const change: HomeMapOp = ops.length === 1 ? ops[0]! : (doc) => ops.reduce<HomeMapDocument | undefined>((d, f) => (d === undefined ? undefined : f(d)), doc);
      this.state = { kind: "saving" };
      this.changed();
      const outcome = await saveHomeMapEdit(this.api, this.confirmed, change);
      if (outcome.ok) {
        this.confirmed = outcome.read;
        this.saved(outcome.read);
        if (outcome.merged) {
          this.note = { kind: "warn", text: HOME_MAP_MERGED_TEXT };
          this.history.clear();
          this.doc = this.rebased();
        } else if (this.queue.length === 0) {
          this.doc = outcome.read.doc;
        }
        continue;
      }
      // Nothing of this save landed, and what is queued was made on top of
      // it: show the map Home Assistant holds and say why.
      this.queue = [];
      this.history.clear();
      if (outcome.read !== undefined) {
        this.confirmed = outcome.read;
        this.saved(outcome.read);
      }
      this.doc = this.confirmed.doc;
      this.note = { kind: "err", text: outcome.text };
      this.state = { kind: "error", text: outcome.text };
      this.changed();
      return;
    }
    this.state = { kind: "saved" };
  }

  /** The confirmed map with the queued edits made on it, dropping any that
   * no longer fit. */
  private rebased(): HomeMapDocument | null {
    let doc = this.confirmed.doc;
    if (doc === null) return null;
    const kept: HomeMapOp[] = [];
    for (const op of this.queue) {
      const next = op(doc);
      if (next === undefined) continue;
      const checked = checkHomeMap(next);
      if (!checked.ok) continue;
      doc = checked.doc;
      kept.push(op);
    }
    this.queue = kept;
    return doc;
  }
}
