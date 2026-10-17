// The library, read once and shared: the Pages, Status pages and Menus tabs
// and the editors all draw from one `library/summary` read per connection
// (`libraryStore`), and every library write goes through here so the read
// after it lands for all of them.
//
// When it reads again:
// - when the first listener comes (a tab or editor opened), always, so
//   what was read while nothing listened is never trusted;
// - after every write made here (`pick`, `pickMenu`, `copyMenu`,
//   `renameMenu`, `deleteItem`), whether it was taken or refused: a rename,
//   or a delete of an item no device has, writes no record and so sends no
//   change event;
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
// Nothing here saves a device's record, so the records' `linkId` and
// `linkIds` are never touched; the editors' own saves keep them as loaded.
// Plan: app repo docs/one_library_plan_2026-10.md.

import { type HassLike, subscribeWatchConfig } from "../ha-api.js";
import {
  type LibraryDeleteReply,
  type LibraryKind,
  type LibraryListKind,
  type LibraryMenuCopyReply,
  type LibraryPickReply,
  type MenuUnit,
  copyLibraryMenu,
  deleteLibraryItem,
  fetchLibrarySummary,
  libraryErrorCode,
  libraryErrorText,
  pickLibraryItem,
  pickLibraryMenu,
  renameLibraryMenu,
} from "./client.js";
import { type Library, libraryOf } from "./model.js";

/** Where the read stands. `unsupported` is an integration older than the
 * library (`unknown_command`). */
export type LibraryReadState = "idle" | "loading" | "ready" | "failed" | "unsupported";

/** How a write ended: the reply, or the refusal's code and words. */
export type LibraryWrite<T> = { ok: true; reply: T } | { ok: false; code?: string; text: string };

/** A tick waiting for its write: a page or status page going on or off a
 * device, or a menu a device is moving to (`menuId`). */
export type PendingPick = { on: boolean } | { menuId: string };

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

export class LibraryStore {
  /** The newest summary read, kept through a failed read again. */
  library: Library | undefined;
  readState: LibraryReadState = "idle";
  /** Why the last read failed, in plain words; undefined after a good one. */
  readError: string | undefined;
  /** Bumped on every change listeners hear: cheap to compare in a memo. */
  version = 0;

  private hass: HassLike;
  private readonly listeners = new Set<Listener>();
  private readonly pendingTicks = new Map<string, PendingPick>();
  private readonly notes = new Map<string, string>();
  private reading: Promise<void> | undefined;
  private again = false;
  private reloadTimer: ReturnType<typeof setTimeout> | undefined;
  /** Upper-cased owner id to its subscription. */
  private readonly subscriptions = new Map<string, { ownerId: string; end: Promise<(() => unknown) | undefined> }>();

  constructor(hass: HassLike) {
    this.hass = hass;
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

  /** Have a device use `menuId` for `unit`. */
  pickMenu(ownerId: string, unit: MenuUnit, menuId: string): Promise<LibraryWrite<LibraryPickReply>> {
    return this.write(noteKey("menus", menuId), pendingKey("menus", ownerId, unit), { menuId },
      () => pickLibraryMenu(this.hass, ownerId, unit, menuId));
  }

  /** "Make a copy for this watch": a new menu from the one the device uses
   * for `unit`, named `name`, used there from now on. */
  copyMenu(ownerId: string, unit: MenuUnit, name: string): Promise<LibraryWrite<LibraryMenuCopyReply>> {
    return this.write(undefined, undefined, undefined, () => copyLibraryMenu(this.hass, ownerId, unit, name));
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
