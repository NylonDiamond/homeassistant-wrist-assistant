// Delete with Undo. A delete of a page, status page, menu or complication
// hides it at once and shows a toast with Undo; the real delete is sent only
// when the toast goes (`DELETE_LATER_MS`). Undo, from the toast or with ⌘Z
// or Ctrl+Z outside a text field (`undoKeyTakesDelete`), takes the hide away
// and nothing else: nothing was sent, so every device, order, menu slot and
// complication tap is as it was.
//
// One delete waits at a time. A second one sends the first at once, so Undo
// is always the newest. The wait is also sent at once when the panel goes
// (`sendLaterNow`) and on `pagehide`. A tab closed in the wait may keep what
// it was deleting, which loses nothing.
//
// What hides is named by keys (`laterKey`): the library store leaves those
// items out of the library it gives, and the complication lists leave out
// those records. A key stays hidden until its delete has landed and the lists
// were read again, so nothing flashes back. A delete that fails shows again,
// and the toast says why.
//
// The same toast takes back a write that saved at once (`offerUndo`): a board
// tick, a device chip, a menu pick. Nothing waits to be sent there: the write
// has landed, the toast says what it did, and Undo runs the way back the
// caller gave, which restores the exact state from before. One toast at a
// time: a new one sends a waiting delete, and ends the chance to undo the
// write before it. `sayDone` is for a write with no way back: the same words,
// with a close button and no Undo.

/** How long Undo shows before the delete is sent. */
export const DELETE_LATER_MS = 10_000;

/** What a delete question says in place of "This cannot be undone". */
export const UNDO_AFTER_TEXT = "You can undo it for 10 seconds after.";

/** How long a failure's words stay, unless closed first. */
export const LATER_SAID_MS = 8_000;

/** The least a toast left after a hover keeps, so Undo is still reachable. */
const LATER_AFTER_HOLD_MS = 3_000;

/** What a delete can hide. */
export type LaterKind = "pages" | "status_pages" | "menus" | "complications";

/** The key one hidden thing goes by: a library item by its id, a
 * complication by its device and record id. Ids are compared ignoring case,
 * as the server compares them. */
export function laterKey(kind: LaterKind, id: string, ownerId = ""): string {
  return `${kind}|${ownerId.toUpperCase()}|${id.toUpperCase()}`;
}

/** One delete waiting for its toast to go. */
export interface LaterDelete {
  /** What the toast says: "Deleted Kitchen." */
  text: string;
  /** What hides meanwhile (`laterKey`). */
  hide: readonly string[];
  /** Send the delete, then read the lists again. Words for anything that
   * went wrong, or undefined. */
  send: () => Promise<string | undefined>;
}

/** A write that saved at once, and the way back from it. */
export interface DoneWrite {
  /** What the toast says: "Kitchen is on Chen Watch now." */
  text: string;
  /** Restore the exact state from before. Words for anything that went
   * wrong, or undefined. */
  undo: () => Promise<string | undefined>;
}

/** What the toast draws. `undo` while the delete waits or a write can be
 * taken back; after a failure there is nothing left to undo, only words to
 * close. `done` is a write that saved (a tick leads its words), `busy` an
 * Undo on its way, with nothing to press. */
export interface LaterToast {
  text: string;
  tone: "ok" | "err";
  undo: boolean;
  done?: true;
  busy?: true;
}

interface Waiting {
  job: LaterDelete;
  /** Set for a write that saved at once: Undo runs this, and `job` sends
   * nothing. */
  done?: DoneWrite;
  timer: ReturnType<typeof setTimeout> | undefined;
  /** When it is sent, in ms; undefined while a hover holds it. */
  due: number | undefined;
  /** The time left when a hover took hold. */
  left: number;
}

let waiting: Waiting | undefined;
const sending = new Set<LaterDelete>();
let said: { text: string; timer: ReturnType<typeof setTimeout>; done?: true } | undefined;
/** Whether an Undo of a saved write is out. */
let undoing = false;
const listeners = new Set<() => void>();
let hiddenNow: ReadonlySet<string> = new Set();
let version = 0;

function changed(): void {
  const keys = new Set<string>();
  for (const job of [...(waiting === undefined ? [] : [waiting.job]), ...sending]) for (const key of job.hide) keys.add(key);
  hiddenNow = keys;
  version++;
  for (const fn of [...listeners]) fn();
}

function say(text: string, done = false): void {
  if (said !== undefined) clearTimeout(said.timer);
  said = { text, timer: setTimeout(() => { said = undefined; changed(); }, LATER_SAID_MS), ...(done ? { done: true as const } : {}) };
}

function arm(w: Waiting, ms: number): void {
  w.due = Date.now() + ms;
  w.timer = setTimeout(sendLaterNow, ms);
}

/** Hide what `job` deletes and show its toast; the delete is sent when the
 * toast goes. One already waiting is sent at once. */
export function deleteLater(job: LaterDelete): void {
  sendLaterNow();
  if (said !== undefined) {
    clearTimeout(said.timer);
    said = undefined;
  }
  waiting = { job, timer: undefined, due: undefined, left: DELETE_LATER_MS };
  arm(waiting, DELETE_LATER_MS);
  changed();
}

/**
 * Show a toast for a write that has already saved, with Undo for as long as a
 * delete's would show (`DELETE_LATER_MS`). A delete waiting is sent at once,
 * and a write before this one can no longer be undone, so Undo is always the
 * newest.
 */
export function offerUndo(write: DoneWrite): void {
  sendLaterNow();
  if (said !== undefined) {
    clearTimeout(said.timer);
    said = undefined;
  }
  // Nothing is sent when its time is up: the toast just goes.
  const job: LaterDelete = { text: write.text, hide: [], send: async () => undefined };
  waiting = { job, done: write, timer: undefined, due: undefined, left: DELETE_LATER_MS };
  arm(waiting, DELETE_LATER_MS);
  changed();
}

/** Say what a write did when there is no way back from it: the toast's words
 * with a close button, for a moment. A delete waiting is sent at once. */
export function sayDone(text: string): void {
  sendLaterNow();
  say(text, true);
  changed();
}

/** Send the waiting delete now, if there is one. A saved write's toast just
 * goes: it has nothing to send. */
export function sendLaterNow(): void {
  const w = waiting;
  if (w === undefined) return;
  if (w.timer !== undefined) clearTimeout(w.timer);
  waiting = undefined;
  if (w.done !== undefined) {
    changed();
    return;
  }
  sending.add(w.job);
  changed();
  void w.job.send()
    .catch((err: unknown) => (err instanceof Error ? err.message : "The delete failed."))
    .then((fail) => {
      sending.delete(w.job);
      if (fail !== undefined && fail !== "") say(fail);
      changed();
    });
}

/** Undo the waiting delete: it shows again and nothing is sent. For a write
 * that saved at once, run its way back: the toast says so meanwhile, and
 * says why if it failed. False when there was nothing to undo. */
export function undoLater(): boolean {
  const w = waiting;
  if (w === undefined) return false;
  if (w.timer !== undefined) clearTimeout(w.timer);
  waiting = undefined;
  if (w.done !== undefined) {
    undoing = true;
    void w.done.undo()
      .catch((err: unknown) => (err instanceof Error ? err.message : "The undo failed."))
      .then((fail) => {
        undoing = false;
        if (fail !== undefined && fail !== "") say(fail);
        changed();
      });
  }
  changed();
  return true;
}

/** A pointer over the toast holds it; leaving lets it run out again, with
 * at least a few seconds left. */
export function holdLater(on: boolean): void {
  const w = waiting;
  if (w === undefined) return;
  if (on) {
    if (w.due === undefined) return;
    if (w.timer !== undefined) clearTimeout(w.timer);
    w.timer = undefined;
    w.left = Math.max(0, w.due - Date.now());
    w.due = undefined;
  } else if (w.due === undefined) {
    arm(w, Math.max(w.left, LATER_AFTER_HOLD_MS));
  }
}

/** Close a failure's words. */
export function dismissLater(): void {
  if (said === undefined) return;
  clearTimeout(said.timer);
  said = undefined;
  changed();
}

/** Every key hidden now: the waiting delete's, and those being sent. */
export function laterHidden(): ReadonlySet<string> {
  return hiddenNow;
}

/** Bumped on every change, cheap to compare in a memo. */
export function laterVersion(): number {
  return version;
}

/** Whether a delete waits, so ⌘Z has something to undo. */
export function laterWaiting(): boolean {
  return waiting !== undefined;
}

/** What the toast shows now, or undefined for no toast. */
export function laterToast(): LaterToast | undefined {
  if (waiting !== undefined) return { text: waiting.job.text, tone: "ok", undo: true, ...(waiting.done === undefined ? {} : { done: true as const }) };
  if (undoing) return { text: "Undoing…", tone: "ok", undo: false, busy: true };
  if (said !== undefined) return said.done === true ? { text: said.text, tone: "ok", undo: false, done: true } : { text: said.text, tone: "err", undo: false };
  return undefined;
}

/** Hear every change: a delete waiting, undone, sent or landed. */
export function onLaterChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** ⌘Z or Ctrl+Z (no Shift, which is Redo), pressed outside a text field:
 * the key that undoes a waiting delete. In a field it undoes the typing. */
export function undoKeyTakesDelete(e: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "composedPath">): boolean {
  if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== "z") return false;
  // Read as a plain object: the element the key went to, in whatever shadow
  // root it sits.
  const target = e.composedPath()[0] as { tagName?: unknown; type?: unknown; isContentEditable?: unknown } | undefined;
  if (target === undefined || target === null) return true;
  if (target.isContentEditable === true) return false;
  if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") return false;
  if (target.tagName === "INPUT") {
    return ["checkbox", "radio", "button", "submit", "reset", "range", "color"].includes(String(target.type));
  }
  return true;
}

/** Back to nothing waiting, for tests. */
export function resetLaterForTest(): void {
  if (waiting?.timer !== undefined) clearTimeout(waiting.timer);
  if (said !== undefined) clearTimeout(said.timer);
  waiting = undefined;
  said = undefined;
  undoing = false;
  sending.clear();
  changed();
}

if (typeof window !== "undefined") window.addEventListener("pagehide", sendLaterNow);
