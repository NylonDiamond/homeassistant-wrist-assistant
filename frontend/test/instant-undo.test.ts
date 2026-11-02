// Every write that saves at once offers Undo on the panel's toast, and Undo
// puts back the exact state from before: the toast itself, a tick either way
// (with the status pages a page brought along, its place in the device's
// order and its Hide here), a menu pick back to the device's old menu, and a
// Duplicate. A device's first menu has no way back, and says so.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DELETE_LATER_MS,
  LATER_SAID_MS,
  deleteLater,
  laterHidden,
  laterKey,
  laterToast,
  laterWaiting,
  offerUndo,
  resetLaterForTest,
  sayDone,
  sendLaterNow,
  undoLater,
} from "../src/delete-later.js";
import type { HassLike } from "../src/ha-api.js";
import type { LibrarySummary } from "../src/library/client.js";
import { hasItem, isHiddenOn, itemsFor, libraryOf, menuFor } from "../src/library/model.js";
import { LibraryStore, menuDoneText, menusMadeSince, placeBefore, tickDoneText } from "../src/library/store.js";
import { tickItem } from "../src/watch-pages/library-editing-io.js";
import { CAMERA, CHEN, CHEN_MENU, DOORS, HOME_MENU, JESSE, LIGHTS, PAGE1, PHONE, QUICK, SMART, STARTER, summary } from "./library-fixture.js";

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Until an Undo has run all the way: it says "Undoing…" until then, and it
 * can load a module on the way (`restorePlace`), which takes as long as it
 * takes on a busy machine, so no fixed count of ticks is enough. Then a few
 * ticks more for what follows it. */
const flush = async () => {
  await tick();
  while (laterToast()?.busy === true) await tick();
  for (let i = 0; i < 5; i++) await tick();
};

describe("the toast of a write that saved at once", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { resetLaterForTest(); vi.useRealTimers(); });

  it("says what it did, offers Undo, and just goes when its time is up", async () => {
    const undo = vi.fn(async () => undefined);
    offerUndo({ text: "Lights is on Chen Watch now.", undo });
    expect(laterToast()).toEqual({ text: "Lights is on Chen Watch now.", tone: "ok", undo: true, done: true });
    expect(laterWaiting()).toBe(true);
    expect(laterHidden().size).toBe(0);
    vi.advanceTimersByTime(DELETE_LATER_MS);
    await vi.runAllTimersAsync();
    expect(undo).not.toHaveBeenCalled();
    expect(laterToast()).toBeUndefined();
    expect(undoLater()).toBe(false);
  });

  it("runs the way back on Undo, says so meanwhile, and only once", async () => {
    let finish: (fail: string | undefined) => void = () => undefined;
    const undo = vi.fn(() => new Promise<string | undefined>((resolve) => { finish = resolve; }));
    offerUndo({ text: "Done.", undo });
    expect(undoLater()).toBe(true);
    expect(undo).toHaveBeenCalledOnce();
    expect(laterToast()).toEqual({ text: "Undoing…", tone: "ok", undo: false, busy: true });
    expect(undoLater()).toBe(false);
    finish(undefined);
    await vi.runAllTimersAsync();
    expect(laterToast()).toBeUndefined();
    expect(undo).toHaveBeenCalledOnce();
  });

  it("says why an Undo failed, in the error's tone", async () => {
    offerUndo({ text: "Done.", undo: async () => "Not undone. Home Assistant said no." });
    undoLater();
    await vi.advanceTimersByTimeAsync(0);
    expect(laterToast()).toEqual({ text: "Not undone. Home Assistant said no.", tone: "err", undo: false });
    vi.advanceTimersByTime(LATER_SAID_MS);
    expect(laterToast()).toBeUndefined();
  });

  it("says a way back that threw as a failure too", async () => {
    offerUndo({ text: "Done.", undo: async () => { throw new Error("Lost the connection."); } });
    undoLater();
    await vi.advanceTimersByTimeAsync(0);
    expect(laterToast()?.text).toBe("Lost the connection.");
  });

  it("is one toast at a time: a newer write ends the older one's Undo, and sends a waiting delete", async () => {
    const send = vi.fn(async () => undefined);
    deleteLater({ text: "Deleted Kitchen.", hide: [laterKey("pages", "p1")], send });
    const first = vi.fn(async () => undefined);
    offerUndo({ text: "First.", undo: first });
    expect(send).toHaveBeenCalledOnce();
    offerUndo({ text: "Second.", undo: async () => undefined });
    expect(laterToast()?.text).toBe("Second.");
    undoLater();
    expect(first).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();
  });

  it("is sent nowhere when the page goes", () => {
    const undo = vi.fn(async () => undefined);
    offerUndo({ text: "Done.", undo });
    sendLaterNow();
    expect(undo).not.toHaveBeenCalled();
    expect(laterToast()).toBeUndefined();
  });

  it("says a write with no way back, with a close button and no Undo", () => {
    sayDone("It has no way back.");
    expect(laterToast()).toEqual({ text: "It has no way back.", tone: "ok", undo: false, done: true });
    expect(laterWaiting()).toBe(false);
    vi.advanceTimersByTime(LATER_SAID_MS);
    expect(laterToast()).toBeUndefined();
  });
});

describe("placeBefore", () => {
  it("names what followed the item and is still there, ignoring case", () => {
    expect(placeBefore(["a", "b", "c"], "a", ["B", "c", "a"])).toBe("b");
    expect(placeBefore(["a", "b", "c"], "a", ["c", "a"])).toBe("c");
  });

  it("is nothing at the end of the list, where a tick puts it, or for an item it never held", () => {
    expect(placeBefore(["a", "b"], "b", ["a", "b"])).toBeUndefined();
    expect(placeBefore(["a", "b"], "a", ["a"])).toBeUndefined();
    expect(placeBefore(["a"], "x", ["a", "x"])).toBeUndefined();
  });
});

/** A home that answers the library's commands from one summary, as Home
 * Assistant would, and a device's record for a save of its order. */
function home(start: LibrarySummary = summary()) {
  let held = structuredClone(start);
  const sent: Record<string, unknown>[] = [];
  const reach: Record<string, string[]> = { [LIGHTS]: [DOORS] };
  const hass = {
    states: {},
    connection: {
      subscribeMessage: () => Promise.resolve(() => undefined),
      sendMessagePromise: (msg: Record<string, unknown>) => {
        sent.push(msg);
        const type = String(msg.type);
        if (type.endsWith("library/summary")) return Promise.resolve(structuredClone(held));
        if (type.endsWith("library/pick")) return Promise.resolve(pick(msg));
        if (type.endsWith("library/menus/copy")) return Promise.resolve(copy(msg));
        if (type.endsWith("library/delete")) {
          delete held.menus[msg.item_id as string];
          return Promise.resolve({ revisions: {}, link_failures: [] });
        }
        if (type.endsWith("watch_config/get")) {
          const list = (held.picks[msg.owner_watch_id as string] as Record<string, { id: string; isHidden?: boolean }[]>)[msg.kind as string] ?? [];
          const key = msg.kind === "pages" ? "pages" : "statusPages";
          return Promise.resolve({ revision: 5, document: { [key]: list.map((p) => ({ ...p })) } });
        }
        if (type.endsWith("watch_config/save")) {
          const key = msg.kind === "pages" ? "pages" : "statusPages";
          const list = (msg.document as Record<string, { id: string; isHidden?: boolean }[]>)[key]!;
          held = structuredClone(held);
          (held.picks[msg.owner_watch_id as string] as Record<string, unknown>)[msg.kind as string] = list;
          return Promise.resolve({ revision: 6 });
        }
        return Promise.resolve({});
      },
    },
  } as unknown as HassLike;

  const pick = (msg: Record<string, unknown>) => {
    held = structuredClone(held);
    const owner = msg.owner_id as string;
    const id = msg.item_id as string;
    const kind = msg.kind as "pages" | "status_pages" | "menus";
    held.picks[owner] ??= {};
    if (kind === "menus") {
      const unit = msg.unit as "anywhere" | "entity";
      const old = held.picks[owner]!.menus?.[unit];
      if (old !== undefined) held.menus[old]!.owners = held.menus[old]!.owners.filter((o) => o !== owner);
      held.picks[owner]!.menus = { ...held.picks[owner]!.menus, [unit]: id };
      held.menus[id]!.owners = [...held.menus[id]!.owners, owner];
      return { revisions: {} };
    }
    const entry = held[kind][id]!;
    const list = (held.picks[owner]![kind] ?? []) as { id: string }[];
    if (msg.on === true) {
      list.push({ id });
      entry.owners = [...entry.owners, owner];
      if (kind === "pages") {
        for (const brought of reach[id] ?? []) {
          const status = (held.picks[owner]!.status_pages ??= []);
          if (!status.some((p) => p.id === brought)) {
            status.push({ id: brought });
            held.status_pages[brought]!.owners = [...held.status_pages[brought]!.owners, owner];
          }
        }
      }
    } else {
      (held.picks[owner] as Record<string, unknown>)[kind] = list.filter((p) => p.id.toUpperCase() !== id.toUpperCase());
      entry.owners = entry.owners.filter((o) => o !== owner);
    }
    return { revisions: {} };
  };

  const copy = (msg: Record<string, unknown>) => {
    held = structuredClone(held);
    const owner = msg.owner_id as string;
    const unit = msg.unit as "anywhere" | "entity";
    const old = held.picks[owner]!.menus![unit]!;
    held.menus[old]!.owners = held.menus[old]!.owners.filter((o) => o !== owner);
    const id = "DDDD0000-0000-4000-8000-000000000001";
    held.menus[id] = { name: msg.name as string, kind: unit, sections: {}, owners: [owner] };
    held.picks[owner]!.menus![unit] = id;
    return { id };
  };

  return { hass, sent, held: () => held };
}

async function storeOn(h: ReturnType<typeof home>): Promise<LibraryStore> {
  const store = new LibraryStore(h.hass);
  await store.refresh();
  return store;
}

const types = (sent: readonly Record<string, unknown>[]) => sent.map((m) => String(m.type).split("/").slice(1).join("/"));

describe("a tick's Undo", () => {
  afterEach(() => { resetLaterForTest(); });

  it("names the item and the device, and goes back off", async () => {
    const h = home();
    const store = await storeOn(h);
    const names = { item: "New Page 1", device: "Chen Watch" };
    const result = await tickItem(undefined, store, CHEN, "pages", PAGE1, true, names);
    expect(result.ok).toBe(true);
    expect(laterToast()?.text).toBe(tickDoneText("New Page 1", "Chen Watch", true));
    expect(laterToast()?.text).toBe("New Page 1 is on Chen Watch now.");
    expect(hasItem(store.library!, CHEN, "pages", PAGE1)).toBe(true);
    undoLater();
    await flush();
    expect(hasItem(store.library!, CHEN, "pages", PAGE1)).toBe(false);
    expect(itemsFor(store.library!, CHEN, "pages").map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
  });

  it("takes off the status pages the page brought along, and only those", async () => {
    const h = home();
    const store = await storeOn(h);
    // Lights' tiles open Doors, which the iPhone did not have.
    await tickItem(undefined, store, PHONE, "pages", LIGHTS, true, { item: "Lights", device: "iPhone" });
    expect(itemsFor(store.library!, PHONE, "status_pages").map((p) => p.id)).toEqual([STARTER, DOORS]);
    undoLater();
    await flush();
    expect(itemsFor(store.library!, PHONE, "pages").map((p) => p.id)).toEqual([PAGE1]);
    expect(itemsFor(store.library!, PHONE, "status_pages").map((p) => p.id)).toEqual([STARTER]);
  });

  it("leaves a status page the device already had", async () => {
    const h = home();
    const store = await storeOn(h);
    await tickItem(undefined, store, JESSE, "pages", LIGHTS, true, { item: "Lights", device: "Jesse" });
    undoLater();
    await flush();
    expect(itemsFor(store.library!, JESSE, "status_pages").map((p) => p.id)).toEqual([DOORS, STARTER]);
  });

  it("puts an unticked item back at its old place, not last", async () => {
    const h = home();
    const store = await storeOn(h);
    await tickItem(undefined, store, CHEN, "pages", CAMERA, false, { item: "Camera", device: "Chen Watch" });
    expect(laterToast()?.text).toBe("Camera is off Chen Watch now.");
    expect(itemsFor(store.library!, CHEN, "pages").map((p) => p.id)).toEqual([LIGHTS]);
    undoLater();
    await flush();
    expect(itemsFor(store.library!, CHEN, "pages").map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
    expect(laterToast()).toBeUndefined();
  });

  it("hides again what was hidden there", async () => {
    const h = home();
    const store = await storeOn(h);
    expect(isHiddenOn(store.library!, JESSE, "pages", PAGE1)).toBe(true);
    await tickItem(undefined, store, JESSE, "pages", PAGE1, false, { item: "New Page 1", device: "Jesse" });
    undoLater();
    await flush();
    expect(hasItem(store.library!, JESSE, "pages", PAGE1)).toBe(true);
    expect(isHiddenOn(store.library!, JESSE, "pages", PAGE1)).toBe(true);
  });

  it("saves no record when the item was last and visible: the tick alone puts it back", async () => {
    const h = home();
    const store = await storeOn(h);
    await tickItem(undefined, store, CHEN, "pages", LIGHTS, false, { item: "Lights", device: "Chen Watch" });
    h.sent.length = 0;
    undoLater();
    await flush();
    expect(types(h.sent)).not.toContain("watch_config/save");
    expect(itemsFor(store.library!, CHEN, "pages").map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
  });

  it("offers nothing without names, or when the caller keeps its own way back", async () => {
    const h = home();
    const store = await storeOn(h);
    await tickItem(undefined, store, CHEN, "pages", PAGE1, true);
    expect(laterToast()).toBeUndefined();
    await tickItem(undefined, store, CHEN, "pages", SMART, true, { item: "Smart", device: "Chen" }, { undo: false });
    expect(laterToast()).toBeUndefined();
  });

  it("offers nothing after a refusal", async () => {
    const h = home();
    const store = await storeOn(h);
    const hass = h.hass as unknown as { connection: { sendMessagePromise: (m: Record<string, unknown>) => Promise<unknown> } };
    const real = hass.connection.sendMessagePromise;
    hass.connection.sendMessagePromise = (m) => (String(m.type).endsWith("library/pick") ? Promise.reject({ code: "unauthorized", message: "no" }) : real(m));
    const result = await tickItem(undefined, store, CHEN, "pages", PAGE1, true, { item: "x", device: "y" });
    expect(result.ok).toBe(false);
    expect(laterToast()).toBeUndefined();
  });

  it("says Undo's refusal in the toast", async () => {
    const h = home();
    const store = await storeOn(h);
    await tickItem(undefined, store, CHEN, "pages", PAGE1, true, { item: "x", device: "y" });
    const hass = h.hass as unknown as { connection: { sendMessagePromise: (m: Record<string, unknown>) => Promise<unknown> } };
    const real = hass.connection.sendMessagePromise;
    hass.connection.sendMessagePromise = (m) => (String(m.type).endsWith("library/pick") ? Promise.reject({ code: "unauthorized", message: "no way" }) : real(m));
    undoLater();
    await flush();
    expect(laterToast()?.tone).toBe("err");
    expect(laterToast()?.text).toMatch(/^Not undone\. /);
  });
});

describe("a menu pick's Undo", () => {
  afterEach(() => { resetLaterForTest(); });

  it("puts the device back on the menu it used", async () => {
    const h = home();
    const store = await storeOn(h);
    await store.pickMenu(CHEN, "anywhere", HOME_MENU, { device: "Chen Watch" });
    expect(laterToast()?.text).toBe(menuDoneText("Chen Watch", "Home menu"));
    expect(laterToast()?.undo).toBe(true);
    expect(menuFor(store.library!, CHEN, "anywhere")?.id).toBe(HOME_MENU);
    undoLater();
    await flush();
    expect(menuFor(store.library!, CHEN, "anywhere")?.id).toBe(CHEN_MENU);
    // The other unit was never touched.
    expect(menuFor(store.library!, CHEN, "entity")?.id).toBe(QUICK);
    expect(laterToast()).toBeUndefined();
  });

  it("says what a first menu did, with no Undo when the reply names no revision", async () => {
    const base = summary();
    delete base.picks[PHONE]!.menus;
    base.menus[HOME_MENU]!.owners = [JESSE];
    base.menus[QUICK]!.owners = [CHEN, JESSE];
    const h = home(base);
    const store = await storeOn(h);
    await store.pickMenu(PHONE, "anywhere", HOME_MENU, { device: "iPhone 15 Pro" });
    expect(laterToast()).toEqual({ text: menuDoneText("iPhone 15 Pro", "Home menu"), tone: "ok", undo: false, done: true });
    expect(laterWaiting()).toBe(false);
  });

  it("finds the menus a first pick made: new, and used by no device", () => {
    const before = libraryOf(summary());
    const later = summary();
    later.menus["MADE"] = { name: "iPhone's menu", kind: "entity", owners: [], revision: 1, sections: {} };
    later.menus["USED"] = { name: "In use", kind: "entity", owners: [CHEN], revision: 1, sections: {} };
    expect(menusMadeSince(before, libraryOf(later))).toEqual(["MADE"]);
    expect(menusMadeSince(before, before)).toEqual([]);
  });

  it("says nothing when the device already used the menu", async () => {
    const h = home();
    const store = await storeOn(h);
    await store.pickMenu(CHEN, "anywhere", CHEN_MENU, { device: "Chen Watch" });
    expect(laterToast()).toBeUndefined();
  });

  it("stays quiet without an offer, as the undo itself is", async () => {
    const h = home();
    const store = await storeOn(h);
    await store.pickMenu(CHEN, "anywhere", HOME_MENU);
    expect(laterToast()).toBeUndefined();
  });

  it("takes a Duplicate back: the old menu again, and the copy deleted", async () => {
    const h = home();
    const store = await storeOn(h);
    const made = await store.copyMenu(CHEN, "anywhere", "Chen Watch's menu", { device: "Chen Watch" });
    expect(made.ok).toBe(true);
    expect(laterToast()?.text).toBe("Chen Watch now uses Chen Watch's menu.");
    const copyId = menuFor(store.library!, CHEN, "anywhere")!.id;
    expect(copyId).not.toBe(CHEN_MENU);
    undoLater();
    await flush();
    expect(menuFor(store.library!, CHEN, "anywhere")?.id).toBe(CHEN_MENU);
    expect(h.held().menus[copyId]).toBeUndefined();
  });

  it("tells the caller a Duplicate was taken back, so its line can go", async () => {
    const store = await storeOn(home());
    const onUndone = vi.fn();
    await store.copyMenu(CHEN, "anywhere", "Chen Watch's menu", { device: "Chen Watch", onUndone });
    expect(onUndone).not.toHaveBeenCalled();
    undoLater();
    await flush();
    expect(onUndone).toHaveBeenCalledTimes(1);
  });
});

describe("the words a tick left behind", () => {
  afterEach(() => { resetLaterForTest(); });

  it("are told when Undo takes the tick back, and not before", async () => {
    const store = await storeOn(home());
    const onUndone = vi.fn();
    await tickItem(undefined, store, CHEN, "pages", PAGE1, true, { item: "New Page 1", device: "Chen Watch" }, { onUndone });
    expect(onUndone).not.toHaveBeenCalled();
    undoLater();
    await flush();
    expect(onUndone).toHaveBeenCalledTimes(1);
  });
});
