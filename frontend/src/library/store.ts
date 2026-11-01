// The library, read once and shared: the Pages, Status pages and Menus tabs
// and the editors all draw from one `library/summary` read per connection
// (`libraryStore`), and every library write goes through here so the read
// after it lands for all of them.
//
// When it reads again:
// - when the first listener comes (a tab or editor opened), always, so
//   what was read while nothing listened is never trusted;
// - after every write made here (`pick`, `pickMenu`, `createMenu`,
//   `copyMenu`, `renameMenu`, `deleteItem`), whether it was taken or
//   refused: a new menu, a rename, or a delete of an item no device has,
//   writes no record and so sends no change event;
// - 250 ms after a `watch_config/subscribe` event of kind `pages`,
//   `status_pages` or `menus` on any device a listener named, so a burst of
//   saves (an editor's save, another panel's tick, a device's own upload)
//   reads once;
// - when `refresh()` is called.
// Reads never overlap: one asked for while one is out runs right after it,
// and every caller's promise settles once a read started after its call has
// landed. A read that fails keeps the library last read and says why
// (`readError`).
//
// A write is pending from the call until the read after it lands. Its tick
// shows the state asked for meanwhile (`pending`), and a refusal is kept as
// a note on the item (`noteFor`) until the next write on that item.
//
// Nothing here saves a device's record: the editors' own saves do that. The
// one exception is Undo of an untick, below, which puts the item back at the
// place and with the Hide here it had.
//
// Every instant write can offer Undo on the panel's toast (`delete-later.ts`):
// `offerPickUndo` for a tick, `UndoOffer` on `pickMenu` and `copyMenu`. Undo
// restores the state from before the write, not just the opposite write:
//
// - a tick on: the item comes off, and so do the status pages it brought
//   along that the device did not have;
// - an untick: the item goes back at its old place, hidden if it was, and
//   status pages it brings along that the device did not have come off;
// - a menu pick: the device goes back to the menu it used;
// - a Duplicate: the device goes back to the menu it used, and the copy made
//   for it is deleted.
//
// - a first menu pick: the device goes back to no menus (`library/menus/clear`),
//   and a menu the pick made for it is deleted. Home Assistant refuses that
//   once the device's menus have changed again, so a later edit is never lost.
//
// Plan: app repo docs/one_library_plan_2026-10.md.

import { type HassLike, fetchWatchConfig, saveWatchConfig, subscribeWatchConfig } from "../ha-api.js";
import {
  type LibraryDeleteReply,
  type LibraryItemCreateReply,
  type LibraryKind,
  type LibraryListKind,
  type LibraryMenuCopyReply,
  type LibraryItemSaveReply,
  type LibraryMenuCreateReply,
  type LibraryObject,
  type LibraryOwnerPicks,
  type LibraryPickReply,
  type LibrarySummary,
  type MenuUnit,
  clearLibraryMenus,
  copyLibraryMenu,
  createLibraryItem,
  createLibraryMenu,
  deleteLibraryItem,
  fetchLibrarySummary,
  libraryErrorCode,
  libraryErrorText,
  pickLibraryItem,
  pickLibraryMenu,
  renameLibraryMenu,
  saveLibraryItem,
} from "./client.js";
import { type Library, holdsRecord, isHiddenOn, itemsFor, libraryItem, libraryMenu, libraryOf, menuFor, sameId } from "./model.js";
import { watchMenusDefaults } from "../watch-menus/model.js";
import { deleteLater, laterHidden, laterKey, laterVersion, offerUndo, onLaterChange, sayDone } from "../delete-later.js";

/** Where the read stands. `unsupported` is an integration older than the
 * library (`unknown_command`). */
export type LibraryReadState = "idle" | "loading" | "ready" | "failed" | "unsupported";

/** How a write ended: the reply, or the refusal's code and words. */
export type LibraryWrite<T> = { ok: true; reply: T } | { ok: false; code?: string; text: string };

/** A tick waiting for its write: a page or status page going on or off a
 * device, or a menu a device is moving to (`menuId`). */
export type PendingPick = { on: boolean } | { menuId: string };

/** What an instant write's Undo toast names. */
export interface UndoOffer {
  /** The device's name: "iPhone 17 Pro now uses Kitchen." */
  device: string;
  /** Runs when Undo has moved the device back, for any words that said
   * otherwise. */
  onUndone?: () => void;
}

/** The toast after a tick: "Kitchen is on Apple Watch now." */
export function tickDoneText(item: string, device: string, on: boolean): string {
  return `${item} is ${on ? "on" : "off"} ${device} now.`;
}

/** The toast after a menu pick: "iPhone 17 Pro now uses Kitchen." */
export function menuDoneText(device: string, menu: string): string {
  return `${device} now uses ${menu}.`;
}

/** The menus record's revision a pick wrote for a device. */
function revisionIn(reply: LibraryPickReply, ownerId: string): number | undefined {
  const owner = Object.keys(reply.revisions).find((id) => sameId(id, ownerId));
  return owner === undefined ? undefined : reply.revisions[owner]?.menus;
}

/** The menus in `now` that `before` did not hold and no device uses: what a
 * first menu pick made, once the device is back to no menus. */
export function menusMadeSince(before: Library, now: Library): string[] {
  return now.menus
    .filter((menu) => menu.owners.length === 0 && libraryMenu(before, menu.id) === undefined)
    .map((menu) => menu.id);
}

/** Why an Undo did not finish, in the toast. */
export function notUndoneText(why: string): string {
  return `Not undone. ${why}`;
}

/** The place an item goes back to: in front of the first pick that followed
 * it and is still on the device, or undefined when nothing that followed it
 * is left, which is the end of the list, where a tick puts it. */
export function placeBefore(order: readonly string[], itemId: string, present: readonly string[]): string | undefined {
  const at = order.findIndex((id) => sameId(id, itemId));
  if (at < 0) return undefined;
  return order.slice(at + 1).find((id) => present.some((p) => sameId(p, id)));
}

/** The record kinds whose change can move the library. */
const LIBRARY_EVENT_KINDS: ReadonlySet<string> = new Set(["pages", "status_pages", "menus"]);

/** How long after a change event the summary is read again. */
export const LIBRARY_RELOAD_DELAY_MS = 250;

const up = (id: string): string => id.toUpperCase();

/** The key of one pending tick: a page or status page on one device, or a
 * unit's menu on one device (whichever menu it moves to). */
export function pendingKey(kind: LibraryKind, ownerId: string, itemIdOrUnit: string): string {
  return `${kind}|${up(ownerId)}|${kind === "menus" ? itemIdOrUnit : up(itemIdOrUnit)}`;
}

/** The key a note is kept under: one item. */
function noteKey(kind: LibraryKind, itemId: string): string {
  return `${kind}|${up(itemId)}`;
}

/** One listener's hold on the store. */
export interface LibraryListening {
  /** The devices whose change events this listener wants heard. */
  update(ownerIds: readonly string[]): void;
  /** Stop listening. The last one to stop ends every subscription. */
  stop(): void;
}

interface Listener {
  fn: () => void;
  owners: readonly string[];
}

/** The summary with the items a delete with Undo hides left out
 * (`delete-later.ts`): from the items, and from every device's picks. A
 * system page pick is the device's own and stays. */
export function summaryWithout(summary: LibrarySummary, hidden: ReadonlySet<string>): LibrarySummary {
  const gone = (kind: LibraryKind, id: string) => hidden.has(laterKey(kind, id));
  const keep = <T>(kind: LibraryKind, items: Record<string, T> | undefined) =>
    Object.fromEntries(Object.entries(items ?? {}).filter(([id]) => !gone(kind, id)));
  const picks: Record<string, LibraryOwnerPicks> = {};
  for (const [owner, held] of Object.entries(summary.picks ?? {})) {
    picks[owner] = {
      ...held,
      ...(held.pages === undefined ? {} : { pages: held.pages.filter((p) => p.page !== undefined || !gone("pages", p.id)) }),
      ...(held.status_pages === undefined ? {} : { status_pages: held.status_pages.filter((p) => !gone("status_pages", p.id)) }),
    };
  }
  return { pages: keep("pages", summary.pages), status_pages: keep("status_pages", summary.status_pages), menus: keep("menus", summary.menus), picks };
}

export class LibraryStore {
  /** The newest summary read, kept through a failed read again. */
  private read: Library | undefined;
  /** `read` with what waits to be deleted left out, for one `read` and one
   * `laterVersion`. */
  private shown: { read: Library; version: number; library: Library } | undefined;
  readState: LibraryReadState = "idle";
  /** Why the last read failed, in plain words; undefined after a good one. */
  readError: string | undefined;
  /** Bumped on every change listeners hear: cheap to compare in a memo. */
  version = 0;

  private hass: HassLike;
  private readonly listeners = new Set<Listener>();
  private readonly pendingTicks = new Map<string, PendingPick>();
  private readonly notes = new Map<string, string>();
  /** When each item's last write landed, by its note key, in ms. */
  private readonly savedAt = new Map<string, number>();
  private reading: Promise<void> | undefined;
  private again = false;
  private reloadTimer: ReturnType<typeof setTimeout> | undefined;
  /** Upper-cased owner id to its subscription. */
  private readonly subscriptions = new Map<string, { ownerId: string; end: Promise<(() => unknown) | undefined> }>();

  constructor(hass: HassLike) {
    this.hass = hass;
    // A delete waiting, undone or landed changes what the library shows.
    onLaterChange(() => this.changed());
  }

  /** The library last read, less what a delete with Undo hides now. */
  get library(): Library | undefined {
    const read = this.read;
    if (read === undefined) return undefined;
    const hidden = laterHidden();
    if (![...hidden].some((k) => !k.startsWith("complications|"))) return read;
    const version = laterVersion();
    if (this.shown?.read !== read || this.shown.version !== version) {
      this.shown = { read, version, library: libraryOf(summaryWithout(read.summary, hidden)) };
    }
    return this.shown.library;
  }

  /** Set by a read; a test may set it too. */
  set library(value: Library | undefined) {
    this.read = value;
  }

  /** The newest `hass` for the commands (the connection stays the same). */
  setHass(hass: HassLike): void {
    this.hass = hass;
  }

  /** The ticks waiting for their writes, by `pendingKey`. */
  get pending(): ReadonlyMap<string, PendingPick> {
    return this.pendingTicks;
  }

  /** The words of the last refused write on an item, until the next write
   * on it. */
  noteFor(kind: LibraryKind, itemId: string): string | undefined {
    return this.notes.get(noteKey(kind, itemId));
  }

  /** When the last write on an item landed (ms since the epoch), so an
   * editor's device strip can flash "Saved" beside it. */
  savedStamp(kind: LibraryKind, itemId: string): number | undefined {
    return this.savedAt.get(noteKey(kind, itemId));
  }

  /** Forget an item's note, once its words were shown and dismissed. */
  clearNote(kind: LibraryKind, itemId: string): void {
    if (this.notes.delete(noteKey(kind, itemId))) this.changed();
  }

  /**
   * Hear every change of the library (a read landing, a tick going pending
   * or settling, a note), and have the change events of `ownerIds` heard.
   * The first listener reads the summary at once.
   */
  listen(fn: () => void, ownerIds: readonly string[] = []): LibraryListening {
    const listener: Listener = { fn, owners: [...ownerIds] };
    const first = this.listeners.size === 0;
    this.listeners.add(listener);
    this.follow();
    if (first) void this.refresh();
    return {
      update: (owners) => {
        if (!this.listeners.has(listener)) return;
        listener.owners = [...owners];
        this.follow();
      },
      stop: () => {
        if (!this.listeners.delete(listener)) return;
        this.follow();
        if (this.listeners.size === 0 && this.reloadTimer !== undefined) {
          clearTimeout(this.reloadTimer);
          this.reloadTimer = undefined;
        }
      },
    };
  }

  /** Read the summary again. Settles once a read started after this call
   * has landed. */
  refresh(): Promise<void> {
    if (this.reading !== undefined) {
      this.again = true;
      return this.reading;
    }
    const run = async () => {
      do {
        this.again = false;
        await this.readOnce();
      } while (this.again);
    };
    this.reading = run().finally(() => {
      this.reading = undefined;
    });
    return this.reading;
  }

  /** Tick a page or status page on a device, or untick it. */
  pick(ownerId: string, kind: LibraryListKind, itemId: string, on: boolean): Promise<LibraryWrite<LibraryPickReply>> {
    return this.write(noteKey(kind, itemId), pendingKey(kind, ownerId, itemId), { on },
      () => pickLibraryItem(this.hass, ownerId, kind, itemId, on));
  }

  /** The library as last read, for `offerPickUndo` to compare with: take it
   * before the write. */
  get lastRead(): Library | undefined {
    return this.read;
  }

  /**
   * Show the Undo toast for a tick that has landed. `before` is the library
   * from before the tick (`lastRead`). Undo puts back the state from before
   * (this file's head). `extra` is said after the toast's words, for what
   * Undo will not bring back. `onUndone` runs once the tick is taken back, for
   * any words that said otherwise.
   */
  offerPickUndo(before: Library | undefined, ownerId: string, kind: LibraryListKind, itemId: string, on: boolean, device: string, extra?: string, onUndone?: () => void): void {
    if (before === undefined) return;
    const name = libraryItem(before, kind, itemId)?.name ?? (this.read === undefined ? undefined : libraryItem(this.read, kind, itemId)?.name) ?? "It";
    const text = tickDoneText(name, device, on);
    offerUndo({
      text: extra === undefined || extra === "" ? text : `${text} ${extra}`,
      undo: () => this.undoPick(before, ownerId, kind, itemId, on, onUndone),
    });
  }

  /** Take a tick back. Words for what went wrong, or undefined. */
  private async undoPick(before: Library, ownerId: string, kind: LibraryListKind, itemId: string, on: boolean, onUndone?: () => void): Promise<string | undefined> {
    const back = await this.pick(ownerId, kind, itemId, !on);
    if (!back.ok) return notUndoneText(back.text);
    onUndone?.();
    // A page brings the status pages its tiles open, going on: whichever way
    // this went, those the device did not have before come off again.
    if (kind === "pages" && this.read !== undefined) {
      const had = itemsFor(before, ownerId, "status_pages").map((p) => p.id);
      const extras = itemsFor(this.read, ownerId, "status_pages").filter((p) => !had.some((id) => sameId(id, p.id)));
      for (const extra of extras) {
        const off = await this.pick(ownerId, "status_pages", extra.id, false);
        if (!off.ok) return notUndoneText(off.text);
      }
    }
    return on ? undefined : this.restorePlace(before, ownerId, kind, itemId);
  }

  /** An item back on a device goes last and visible: move it to where it
   * was, and hide it if it was hidden. Each is a save of the device's own
   * record (`changeDevicePicks`), with the app's page code loaded only now. */
  private async restorePlace(before: Library, ownerId: string, kind: LibraryListKind, itemId: string): Promise<string | undefined> {
    const present = this.read === undefined ? [] : itemsFor(this.read, ownerId, kind).map((p) => p.id);
    const next = placeBefore(itemsFor(before, ownerId, kind).map((p) => p.id), itemId, present);
    const hidden = isHiddenOn(before, ownerId, kind, itemId);
    if (next === undefined && !hidden) return undefined;
    const { changeDevicePicks } = await import("../watch-pages/all-pages-picks.js");
    const io = {
      read: (owner: string, k: LibraryListKind) => fetchWatchConfig(this.hass, owner, k),
      save: (owner: string, k: LibraryListKind, base: number, document: LibraryObject) => saveWatchConfig(this.hass, owner, k, base, document),
    };
    const words: string[] = [];
    if (next !== undefined) {
      const moved = await changeDevicePicks(io, ownerId, kind, { id: itemId, before: next });
      if (!moved.ok) words.push(moved.message);
    }
    if (hidden) {
      const hid = await changeDevicePicks(io, ownerId, kind, { id: itemId, hidden: true });
      if (!hid.ok) words.push(hid.message);
    }
    await this.refresh();
    return words.length === 0 ? undefined : `Put back, but not in its old place. ${words.join(" ")}`;
  }

  /** Have a device use `menuId` for `unit`. A device that holds no menus
   * record yet is sent the app's defaults to start from, which Home
   * Assistant reads only when no device with menus uses the menu (a menu
   * just made with New menu). With `offer`, the toast says what it did and
   * offers Undo, back to the menu the device used (this file's head). */
  async pickMenu(ownerId: string, unit: MenuUnit, menuId: string, offer?: UndoOffer): Promise<LibraryWrite<LibraryPickReply>> {
    const before = this.read;
    const start = this.library !== undefined && !holdsRecord(this.library, ownerId, "menus") ? watchMenusDefaults() : undefined;
    const result = await this.write(noteKey("menus", menuId), pendingKey("menus", ownerId, unit), { menuId },
      () => pickLibraryMenu(this.hass, ownerId, unit, menuId, start));
    if (result.ok && offer !== undefined) {
      const name = this.read === undefined ? undefined : libraryMenu(this.read, menuId)?.name;
      const used = before === undefined ? undefined : menuFor(before, ownerId, unit);
      if (used === undefined) this.offerFirstMenuUndo(before, ownerId, result.reply, name ?? "this menu", offer);
      else this.offerMenuUndo(ownerId, unit, used.id, name ?? "this menu", offer.device, menuId, undefined, offer.onUndone);
    }
    return result;
  }

  /** The toast after a device's first menu: Undo takes it back to no menus
   * and deletes the menus the pick made for it, the ones the library did not
   * hold before. With no way to tell either, it only says what it did. */
  private offerFirstMenuUndo(before: Library | undefined, ownerId: string, reply: LibraryPickReply, name: string, offer: UndoOffer): void {
    const text = menuDoneText(offer.device, name);
    const revision = revisionIn(reply, ownerId);
    if (before === undefined || revision === undefined) {
      sayDone(text);
      return;
    }
    offerUndo({
      text,
      undo: async () => {
        const back = await this.write(undefined, undefined, undefined, () => clearLibraryMenus(this.hass, ownerId, revision));
        if (!back.ok) return notUndoneText(back.text);
        offer.onUndone?.();
        const made = this.read === undefined ? [] : menusMadeSince(before, this.read);
        for (const id of made) {
          const gone = await this.deleteItem("menus", id);
          if (!gone.ok) return `Moved back, but the copy stays. ${gone.text}`;
        }
        return undefined;
      },
    });
  }

  /** The toast after a device moved to a menu: Undo moves it back to
   * `used`. The same menu asked again has nothing to undo, so it says
   * nothing. */
  private offerMenuUndo(ownerId: string, unit: MenuUnit, used: string, name: string, device: string, menuId: string, drop?: string, onUndone?: () => void): void {
    if (sameId(used, menuId)) return;
    offerUndo({
      text: menuDoneText(device, name),
      undo: async () => {
        const back = await this.pickMenu(ownerId, unit, used);
        if (!back.ok) return notUndoneText(back.text);
        onUndone?.();
        if (drop === undefined) return undefined;
        const gone = await this.deleteItem("menus", drop);
        return gone.ok ? undefined : `Moved back, but the copy stays. ${gone.text}`;
      },
    });
  }

  /** New menu: a library menu of `unit` named `name`, made of `sections`,
   * that no device uses until one is ticked. */
  createMenu(unit: MenuUnit, name: string, sections: LibraryObject): Promise<LibraryWrite<LibraryMenuCreateReply>> {
    return this.write(undefined, undefined, undefined, () => createLibraryMenu(this.hass, unit, name, sections));
  }

  /** New page, or New status page: a page in the library, from `document`
   * (a whole document of the kind holding the one new page), that no
   * device has until one is ticked. */
  createItem(kind: LibraryListKind, document: LibraryObject): Promise<LibraryWrite<LibraryItemCreateReply>> {
    return this.write(undefined, undefined, undefined, () => createLibraryItem(this.hass, kind, document));
  }

  /** "Make a copy for this watch": a new menu from the one the device uses
   * for `unit`, named `name`, used there from now on. With `offer`, Undo
   * moves the device back to the menu it used and deletes the copy. */
  async copyMenu(ownerId: string, unit: MenuUnit, name: string, offer?: UndoOffer): Promise<LibraryWrite<LibraryMenuCopyReply>> {
    const before = this.read;
    const result = await this.write(undefined, undefined, undefined, () => copyLibraryMenu(this.hass, ownerId, unit, name));
    if (result.ok && offer !== undefined) {
      const used = before === undefined ? undefined : menuFor(before, ownerId, unit);
      if (used !== undefined) this.offerMenuUndo(ownerId, unit, used.id, name, offer.device, result.reply.id, result.reply.id, offer.onUndone);
    }
    return result;
  }

  /** Rename a menu. */
  renameMenu(menuId: string, name: string): Promise<LibraryWrite<Record<string, never>>> {
    return this.write(noteKey("menus", menuId), undefined, undefined, () => renameLibraryMenu(this.hass, menuId, name));
  }

  /** Delete a page, status page or menu from the library (`library/delete`;
   * a menu in use is refused `in_use`). Complication taps that opened a
   * page are the caller's to clear. */
  deleteItem(kind: LibraryKind, itemId: string): Promise<LibraryWrite<LibraryDeleteReply>> {
    return this.write(noteKey(kind, itemId), undefined, undefined, () => deleteLibraryItem(this.hass, kind, itemId));
  }

  /** Delete with Undo (`delete-later.ts`): the item hides at once and
   * `library/delete` is sent when the toast goes. `after` runs once the
   * delete landed (a page's complication taps), and says what it could not
   * do. */
  deleteItemLater(kind: LibraryKind, itemId: string, text: string, after?: () => Promise<string | undefined>): void {
    deleteLater({
      text,
      hide: [laterKey(kind, itemId)],
      send: async () => {
        const result = await this.deleteItem(kind, itemId);
        if (!result.ok) return `Not deleted. ${result.text}`;
        const stuck = result.reply.link_failures?.length ?? 0;
        const more = await after?.();
        const parts = [
          stuck > 0 ? `Could not take it off ${stuck === 1 ? "1 device" : `${stuck} devices`}.` : undefined,
          more,
        ].filter((p): p is string => p !== undefined && p !== "");
        return parts.length === 0 ? undefined : parts.join(" ");
      },
    });
  }

  /** Save one item edited in the library (`library/item/save`). Unlike the
   * other writes this throws a refusal as it came, so an editor's save loop
   * can read a `conflict`. The summary is read again either way: an item no
   * device picks writes no record, so no change event would tell the tabs. */
  async saveItem(kind: LibraryKind, itemId: string, baseRevision: number, document: LibraryObject): Promise<LibraryItemSaveReply> {
    try {
      return await saveLibraryItem(this.hass, kind, itemId, baseRevision, document);
    } finally {
      void this.refresh();
    }
  }

  // ── inside ─────────────────────────────────────────────────────────────

  private changed(): void {
    this.version++;
    for (const listener of [...this.listeners]) listener.fn();
  }

  private async readOnce(): Promise<void> {
    if (this.readState === "idle") {
      this.readState = "loading";
      this.changed();
    }
    try {
      const summary = await fetchLibrarySummary(this.hass);
      this.library = libraryOf(summary);
      this.readState = "ready";
      this.readError = undefined;
    } catch (err) {
      const code = libraryErrorCode(err);
      this.readState = code === "unknown_command" ? "unsupported" : "failed";
      this.readError = libraryErrorText(err);
    }
    this.changed();
  }

  private async write<T>(
    note: string | undefined,
    pending: string | undefined,
    asked: PendingPick | undefined,
    run: () => Promise<T>,
  ): Promise<LibraryWrite<T>> {
    if (note !== undefined) this.notes.delete(note);
    if (pending !== undefined && asked !== undefined) this.pendingTicks.set(pending, asked);
    this.changed();
    let result: LibraryWrite<T>;
    try {
      result = { ok: true, reply: await run() };
      if (note !== undefined) this.savedAt.set(note, Date.now());
    } catch (err) {
      const code = libraryErrorCode(err);
      const text = libraryErrorText(err);
      result = code === undefined ? { ok: false, text } : { ok: false, code, text };
      if (note !== undefined) this.notes.set(note, text);
    }
    await this.refresh();
    if (pending !== undefined && this.pendingTicks.get(pending) === asked) this.pendingTicks.delete(pending);
    this.changed();
    return result;
  }

  /** A change event on one device: read again shortly. */
  private heard(kind: string): void {
    if (!LIBRARY_EVENT_KINDS.has(kind) || this.listeners.size === 0) return;
    if (this.reloadTimer !== undefined) clearTimeout(this.reloadTimer);
    this.reloadTimer = setTimeout(() => {
      this.reloadTimer = undefined;
      if (this.listeners.size > 0) void this.refresh();
    }, LIBRARY_RELOAD_DELAY_MS);
  }

  /** Subscribe to every device a listener names, and end the rest. */
  private follow(): void {
    const wanted = new Map<string, string>();
    for (const listener of this.listeners) for (const owner of listener.owners) wanted.set(up(owner), owner);
    for (const [key, held] of [...this.subscriptions]) {
      if (wanted.has(key)) continue;
      this.subscriptions.delete(key);
      void held.end.then((end) => end?.()).catch(() => undefined);
    }
    for (const [key, ownerId] of wanted) {
      if (this.subscriptions.has(key)) continue;
      const end = subscribeWatchConfig(this.hass, ownerId, (event) => {
        if (this.subscriptions.get(key)?.end === end) this.heard(event.kind);
      }).then(
        (unsubscribe) => unsubscribe as () => unknown,
        // No live line (an older integration, or a device whose file failed):
        // the library is read again when a tab or editor opens.
        () => undefined,
      );
      this.subscriptions.set(key, { ownerId, end });
    }
  }
}

/** The part of a Lit element the controller needs. */
export interface LibraryHost {
  addController(controller: { hostConnected?(): void; hostDisconnected?(): void; hostUpdate?(): void }): void;
  requestUpdate(): void;
}

/**
 * The store for a Lit element: listening while the element is connected,
 * drawing it again on every change, and following the devices it names.
 * `hass` and `ownerIds` are asked before each update, so a `hass` that
 * comes late or a device list that changes is picked up.
 *
 *   private readonly lib = new LibraryController(this, () => this.hass,
 *     () => this.devices.map((d) => d.ownerId));
 *   ... this.lib.library, this.lib.store?.pick(...)
 */
export class LibraryController {
  store: LibraryStore | undefined;
  private listening: LibraryListening | undefined;
  private connected = false;
  private ownersSig = "";

  constructor(
    private readonly host: LibraryHost,
    private readonly hassOf: () => HassLike | undefined,
    private readonly ownersOf: () => readonly string[] = () => [],
  ) {
    host.addController(this);
  }

  /** The library last read, or undefined before the first read lands. */
  get library(): Library | undefined {
    return this.store?.library;
  }

  get readState(): LibraryReadState {
    return this.store?.readState ?? "idle";
  }

  hostConnected(): void {
    this.connected = true;
    this.attach();
  }

  hostDisconnected(): void {
    this.connected = false;
    this.listening?.stop();
    this.listening = undefined;
  }

  hostUpdate(): void {
    this.attach();
  }

  private attach(): void {
    if (!this.connected) return;
    const hass = this.hassOf();
    if (hass === undefined) return;
    const store = libraryStore(hass);
    const owners = this.ownersOf();
    const sig = owners.map(up).join(",");
    if (store !== this.store || this.listening === undefined) {
      this.listening?.stop();
      this.store = store;
      this.ownersSig = sig;
      this.listening = store.listen(() => this.host.requestUpdate(), owners);
      return;
    }
    if (sig !== this.ownersSig) {
      this.ownersSig = sig;
      this.listening.update(owners);
    }
  }
}

const stores = new WeakMap<object, LibraryStore>();

/** The one store for this Home Assistant connection, shared by every tab
 * and editor, told the newest `hass`. */
export function libraryStore(hass: HassLike): LibraryStore {
  const key = hass.connection as object;
  let store = stores.get(key);
  if (store === undefined) {
    store = new LibraryStore(hass);
    stores.set(key, store);
  } else store.setHass(hass);
  return store;
}
