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
// save Home Assistant refuses (a conflict that cannot be put right, a map it
// will not take) drops the queue, shows the map as Home Assistant holds it
// and says why.
//
// A save that never got an answer (the socket dropped, Home Assistant is
// restarting, the answer took too long) is not a refusal: the edits, the
// shown map and the undo stack all stay, the bar says "Not saved yet.
// Trying again.", and the same save is sent again after a pause that grows
// with each failure (`homeMapRetryDelay`), or at once when the page says
// the socket is back or the tab is shown again (`retryNow`). Edits made
// meanwhile queue behind it as usual. Every session with something not yet
// saved is listed (`homeMapUnsaved`), for the page's warning on leaving.
//
// The home's first map starts here too: `begin` makes a map with no floors
// into one with a floor, saved from rev 0 like any edit.
//
// Undo and redo hand back a whole earlier map; saved as "this map, if Home
// Assistant still holds the one I undid from", so an undo made after
// another device saved never throws that device's change away.

import type { HomeMapOp } from "./edit-ops.js";
import { HomeMapHistory } from "./edit-ops.js";
import { type HomeMapDocument, type HomeMapRead, checkHomeMap } from "./model.js";
import { type HomeMapApi, HOME_MAP_MERGED_TEXT, HOME_MAP_RETRY_TEXT, homeMapEmpty, sameHomeMapDocument, saveHomeMapEdit } from "./save.js";

export { sameHomeMapDocument } from "./save.js";

/** Where the saves stand, for the bar's Saved / Saving / Not saved. `waiting`
 * is a save that could not reach Home Assistant, to be sent again. */
export type HomeMapSaveState = { kind: "saved" } | { kind: "saving" } | { kind: "waiting"; text: string } | { kind: "error"; text: string };

/** A line the page shows over the editor until dismissed. */
export interface HomeMapNote {
  kind: "warn" | "err";
  text: string;
}

/** How long to wait before sending a save again after `failures` tries in
 * a row went unanswered: one second, doubling, at most half a minute. */
export function homeMapRetryDelay(failures: number): number {
  return Math.min(30_000, 1000 * 2 ** Math.max(0, failures - 1));
}

/** The sessions with an edit not yet saved, for the warning on leaving the
 * page. A session leaves the list once all it holds is saved or refused. */
const unsaved = new Set<HomeMapSession>();

/** Whether any map editor has an edit Home Assistant does not hold yet. */
export function homeMapUnsaved(): boolean {
  for (const session of unsaved) if (session.busy) return true;
  return false;
}

/** The change an undo or redo saves: `to`, when the map is still `from`. */
function swap(from: HomeMapDocument, to: HomeMapDocument): HomeMapOp {
  return (doc) => (sameHomeMapDocument(doc, from) ? to : undefined);
}

/** Several edits as one change, made in order. */
function together(ops: readonly HomeMapOp[]): HomeMapOp {
  return ops.length === 1 ? ops[0]! : (doc) => ops.reduce<HomeMapDocument | undefined>((d, f) => (d === undefined ? undefined : f(d)), doc);
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
  /** A save that went unanswered, to be sent again as it was: its edits,
   * and the map it sent, by which a try that did land is known. */
  private pending: { ops: HomeMapOp[]; sent: HomeMapDocument | undefined } | undefined;
  /** Unanswered tries in a row. */
  private failures = 0;
  /** Ends the pause before the next try. */
  private wake: (() => void) | undefined;
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
    return this.queue.length > 0 || this.pending !== undefined || this.running !== undefined;
  }

  get canUndo(): boolean {
    return this.doc !== null && this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.doc !== null && this.history.canRedo;
  }

  /** A map read afresh (the page opened again, or another device saved).
   * Ignored while a save is out or queued, which will bring a newer one;
   * else it replaces the map and forgets the undo stack. */
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
    const next = this.checked(op(from));
    if (next === undefined) return false;
    this.history.push(from);
    this.doc = next;
    this.enqueue(op);
    return true;
  }

  /**
   * Start a map: `op` made on the map shown, the empty map while Home
   * Assistant holds none, and saved like any edit (the first save names rev
   * 0). Only while the map has no floor, since a start never stands on
   * top of a map someone made; not recorded for undo, as there is nothing
   * before it to go back to. False, as `apply`, when it changes nothing.
   */
  begin(op: HomeMapOp): boolean {
    const from = this.doc ?? homeMapEmpty();
    if (from.floors.length > 0) return false;
    const next = this.checked(op(from));
    if (next === undefined) return false;
    this.doc = next;
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

  /** Send a save that is waiting to be tried again now, rather than at the
   * end of its pause: the socket is back, or the tab was shown again. */
  retryNow(): void {
    this.wake?.();
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

  /** `next` checked as the store checks it, or undefined (with `note`
   * saying why when the store would refuse it). */
  private checked(next: HomeMapDocument | undefined): HomeMapDocument | undefined {
    if (next === undefined) return undefined;
    const checked = checkHomeMap(next);
    if (!checked.ok) {
      this.note = { kind: "err", text: `That cannot be saved. ${checked.message}.` };
      this.changed();
      return undefined;
    }
    return checked.doc;
  }

  private enqueue(op: HomeMapOp): void {
    this.queue.push(op);
    unsaved.add(this);
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
      if (this.queue.length > 0 || this.pending !== undefined) this.kick();
      else {
        unsaved.delete(this);
        this.changed();
      }
    });
  }

  /** Wait `ms`, or less when `retryNow` is called. */
  private pause(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(done, ms);
      const self = this;
      function done(): void {
        clearTimeout(timer);
        if (self.wake === done) self.wake = undefined;
        resolve();
      }
      this.wake = done;
    });
  }

  private async run(): Promise<void> {
    while (this.pending !== undefined || this.queue.length > 0) {
      const batch = this.pending ?? { ops: this.queue.splice(0), sent: undefined };
      this.pending = undefined;
      if (this.state.kind !== "waiting") this.state = { kind: "saving" };
      this.changed();
      const outcome = await saveHomeMapEdit(this.api, this.confirmed, together(batch.ops), batch.sent);
      if (outcome.ok) {
        this.failures = 0;
        this.state = { kind: "saving" };
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
      if (outcome.retry === true) {
        // Nothing is known to have changed: keep every edit, the shown map
        // and the undo stack, and send the same save again after a pause.
        this.pending = { ops: batch.ops, sent: outcome.sent ?? batch.sent };
        this.failures += 1;
        this.state = { kind: "waiting", text: HOME_MAP_RETRY_TEXT };
        this.changed();
        await this.pause(homeMapRetryDelay(this.failures));
        continue;
      }
      // Nothing of this save landed, and what is queued was made on top of
      // it: show the map Home Assistant holds and say why.
      this.failures = 0;
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
