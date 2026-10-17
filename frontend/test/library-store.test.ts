// The shared library store: one store per connection, a read when the first
// listener comes, a read after every write (taken or refused), a read 250 ms
// after a change event on a followed device, the asked state while a write
// is out, and a refusal kept as the item's note.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { LibraryController, LibraryStore, LIBRARY_RELOAD_DELAY_MS, libraryStore, pendingKey } from "../src/library/store.js";
import { CHEN, JESSE, LIGHTS, PAGE1, summary } from "./library-fixture.js";

type Msg = Record<string, unknown>;

function stand(refuse?: (msg: Msg) => unknown) {
  const sent: Msg[] = [];
  const events = new Map<string, (event: { kind: string; revision: number }) => void>();
  const ended: string[] = [];
  let reads = 0;
  let held = summary();
  const hass = {
    states: {},
    connection: {
      sendMessagePromise: (msg: Msg) => {
        sent.push(msg);
        const type = msg.type as string;
        const no = refuse?.(msg);
        if (no !== undefined) return Promise.reject(no);
        if (type.endsWith("library/summary")) {
          reads++;
          return Promise.resolve(structuredClone(held));
        }
        if (type.endsWith("library/pick")) {
          const owners = held.pages[msg.item_id as string]!.owners;
          held = structuredClone(held);
          held.pages[msg.item_id as string]!.owners = msg.on ? [...owners, msg.owner_id as string].sort() : owners.filter((o) => o !== msg.owner_id);
          return Promise.resolve({ revisions: { [msg.owner_id as string]: { pages: 9 } } });
        }
        return Promise.resolve({});
      },
      subscribeMessage: (cb: (event: { kind: string; revision: number }) => void, msg: Msg) => {
        const owner = msg.owner_watch_id as string;
        events.set(owner, cb);
        return Promise.resolve(() => {
          ended.push(owner);
        });
      },
    },
  } as unknown as HassLike;
  return { hass, sent, events, ended, reads: () => reads };
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  vi.useRealTimers();
});

describe("libraryStore", () => {
  it("is one store per connection, told the newest hass", () => {
    const { hass } = stand();
    const again = { ...hass, states: { a: {} } } as unknown as HassLike;
    expect(libraryStore(hass)).toBe(libraryStore(again));
    expect(libraryStore(stand().hass)).not.toBe(libraryStore(hass));
  });
});

describe("LibraryStore", () => {
  it("reads when the first listener comes, and again for a later first listener", async () => {
    const s = stand();
    const store = new LibraryStore(s.hass);
    let heard = 0;
    const one = store.listen(() => heard++, [CHEN]);
    expect(store.readState).toBe("loading");
    await flush();
    expect(store.readState).toBe("ready");
    expect(store.library?.pages.length).toBe(5);
    expect(heard).toBeGreaterThan(0);
    const two = store.listen(() => undefined, [CHEN]);
    await flush();
    expect(s.reads()).toBe(1);
    one.stop();
    two.stop();
    store.listen(() => undefined, []);
    await flush();
    expect(s.reads()).toBe(2);
  });

  it("subscribes to the union of the devices named, and ends the rest", async () => {
    const s = stand();
    const store = new LibraryStore(s.hass);
    const one = store.listen(() => undefined, [CHEN]);
    const two = store.listen(() => undefined, [CHEN, JESSE]);
    expect([...s.events.keys()].sort()).toEqual([CHEN, JESSE]);
    two.stop();
    await flush();
    expect(s.ended).toEqual([JESSE]);
    one.update([]);
    await flush();
    expect(s.ended).toEqual([JESSE, CHEN]);
  });

  it("reads again once, 250 ms after a burst of change events of a library kind", async () => {
    vi.useFakeTimers();
    const s = stand();
    const store = new LibraryStore(s.hass);
    store.listen(() => undefined, [CHEN]);
    await vi.runAllTimersAsync();
    expect(s.reads()).toBe(1);
    const cb = s.events.get(CHEN)!;
    cb({ kind: "pages", revision: 4 });
    cb({ kind: "menus", revision: 2 });
    cb({ kind: "settings", revision: 7 });
    await vi.advanceTimersByTimeAsync(LIBRARY_RELOAD_DELAY_MS - 10);
    expect(s.reads()).toBe(1);
    await vi.advanceTimersByTimeAsync(20);
    expect(s.reads()).toBe(2);
    cb({ kind: "settings", revision: 8 });
    await vi.advanceTimersByTimeAsync(LIBRARY_RELOAD_DELAY_MS * 2);
    expect(s.reads()).toBe(2);
  });

  it("shows a tick as asked while its write is out, then reads the library again", async () => {
    const s = stand();
    const store = new LibraryStore(s.hass);
    store.listen(() => undefined, []);
    await flush();
    const write = store.pick(CHEN, "pages", PAGE1, true);
    expect(store.pending.get(pendingKey("pages", CHEN, PAGE1))).toEqual({ on: true });
    const result = await write;
    expect(result).toEqual({ ok: true, reply: { revisions: { [CHEN]: { pages: 9 } } } });
    expect(store.pending.size).toBe(0);
    expect(s.reads()).toBe(2);
    expect(store.library?.index.pages.get(PAGE1)?.owners).toContain(CHEN);
    expect(s.sent.find((m) => (m.type as string).endsWith("library/pick"))).toEqual(
      { type: "wrist_assistant/library/pick", owner_id: CHEN, kind: "pages", item_id: PAGE1, on: true },
    );
  });

  it("keeps a refusal as the item's note until the next write on it, and still reads again", async () => {
    const s = stand((msg) => ((msg.type as string).endsWith("library/pick") && msg.item_id === LIGHTS ? { code: "awaiting_move", message: "wait" } : undefined));
    const store = new LibraryStore(s.hass);
    store.listen(() => undefined, []);
    await flush();
    const result = await store.pick(JESSE, "pages", LIGHTS, true);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.code).toBe("awaiting_move");
    expect(store.noteFor("pages", LIGHTS.toLowerCase())).toMatch(/Try again after that\.$/);
    expect(store.pending.size).toBe(0);
    expect(s.reads()).toBe(2);
    store.clearNote("pages", LIGHTS);
    expect(store.noteFor("pages", LIGHTS)).toBeUndefined();
  });

  it("reads again after a rename, which sends no change event", async () => {
    const s = stand();
    const store = new LibraryStore(s.hass);
    store.listen(() => undefined, []);
    await flush();
    await store.renameMenu("M1", "Home menu");
    expect(s.reads()).toBe(2);
  });

  it("never overlaps reads: one asked for during a read runs after it", async () => {
    const s = stand();
    const store = new LibraryStore(s.hass);
    const a = store.refresh();
    const b = store.refresh();
    const c = store.refresh();
    await Promise.all([a, b, c]);
    expect(s.reads()).toBe(2);
  });

  it("says unsupported on an integration older than the library, and keeps the last library on a failed read", async () => {
    let fail: unknown;
    const s = stand((msg) => ((msg.type as string).endsWith("library/summary") ? fail : undefined));
    const store = new LibraryStore(s.hass);
    await store.refresh();
    expect(store.readState).toBe("ready");
    fail = { code: "unavailable", message: "x" };
    await store.refresh();
    expect(store.readState).toBe("failed");
    expect(store.library?.pages.length).toBe(5);
    expect(store.readError).toBe("Home Assistant could not read the library. Try again in a moment.");
    fail = { code: "unknown_command", message: "x" };
    await store.refresh();
    expect(store.readState).toBe("unsupported");
  });
});

describe("LibraryController", () => {
  it("listens while its host is connected and follows its devices", async () => {
    const s = stand();
    let updates = 0;
    let owners = [CHEN];
    const controllers: { hostConnected?(): void; hostDisconnected?(): void; hostUpdate?(): void }[] = [];
    const host = { addController: (c: (typeof controllers)[number]) => controllers.push(c), requestUpdate: () => updates++ };
    const lib = new LibraryController(host, () => s.hass, () => owners);
    expect(controllers).toEqual([lib]);
    lib.hostConnected();
    await flush();
    expect(lib.readState).toBe("ready");
    expect(lib.library?.menus.length).toBe(4);
    expect(updates).toBeGreaterThan(0);
    owners = [CHEN, JESSE];
    lib.hostUpdate();
    expect([...s.events.keys()].sort()).toEqual([CHEN, JESSE]);
    lib.hostDisconnected();
    await flush();
    expect(s.ended.sort()).toEqual([CHEN, JESSE]);
  });
});
