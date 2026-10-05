// The Watch app's one shared watch: which watch is on screen, when the
// address's watch is remembered, and the remembering itself.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import {
  WATCH_PICK_KEY,
  adoptRouteWatch,
  loadWatchPick,
  resolveWatchPick,
  saveWatchPick,
  watchRouteOwner,
} from "../src/watch-pick.js";
import { settingsWatches } from "../src/watch-settings.js";

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x",
  device_name: null,
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.0.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...o,
} as OwnerSummary);

const OWNERS = [
  owner({ owner_watch_id: "w1" }),
  owner({ owner_watch_id: "p1", device_kind: "iphone" }),
  owner({ owner_watch_id: "old", is_orphan: true }),
  owner({ owner_watch_id: "w2" }),
];
const WATCHES = settingsWatches(OWNERS);

const route = (path: string) => ({ prefix: "/wrist-assistant", path });

describe("the watch an address names", () => {
  it("is read on every watch screen, the way each screen reads it", () => {
    expect(watchRouteOwner(route("/pages/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/menus/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/voice/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/status-pages/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/control-center/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/rooms/w2"))).toBe("w2");
    expect(watchRouteOwner(route("/pages/a%2Fb"))).toBe("a/b");
  });

  it("is none on a screen with no watch in its address, off the Watch app, or with no route", () => {
    expect(watchRouteOwner(route("/pages"))).toBeUndefined();
    expect(watchRouteOwner(route(""))).toBeUndefined();
    expect(watchRouteOwner(route("/complications"))).toBeUndefined();
    expect(watchRouteOwner(undefined)).toBeUndefined();
  });
});

describe("which watch the Watch app shows", () => {
  it("takes the address's watch first, then the remembered one, then today's fallback", () => {
    expect(resolveWatchPick(WATCHES, { route: "w2", saved: "w1", fallback: "w1" })).toBe("w2");
    expect(resolveWatchPick(WATCHES, { route: undefined, saved: "w2", fallback: "w1" })).toBe("w2");
    expect(resolveWatchPick(WATCHES, { route: undefined, saved: undefined, fallback: "w2" })).toBe("w2");
  });

  it("falls back past an address or a memory naming no listed watch", () => {
    expect(resolveWatchPick(WATCHES, { route: "gone", saved: "w2", fallback: "w1" })).toBe("w2");
    expect(resolveWatchPick(WATCHES, { route: "p1", saved: "old", fallback: "w2" })).toBe("w2");
    // A phone as the complications device: the first watch, as today.
    expect(resolveWatchPick(WATCHES, { route: undefined, saved: "gone", fallback: "p1" })).toBe("w1");
  });

  it("hands on the address's watch, else the remembered one, while the list is not in", () => {
    expect(resolveWatchPick([], { route: "w2", saved: "w1", fallback: "p1" })).toBe("w2");
    expect(resolveWatchPick([], { route: undefined, saved: "w1", fallback: "p1" })).toBe("w1");
    expect(resolveWatchPick([], { route: undefined, saved: undefined, fallback: "p1" })).toBeUndefined();
  });

  it("is none in a home with no watch", () => {
    const phones = settingsWatches([owner({ owner_watch_id: "p1", device_kind: "iphone" })]);
    expect(phones).toEqual([]);
    expect(resolveWatchPick(phones, { route: undefined, saved: undefined, fallback: "p1" })).toBeUndefined();
  });
});

describe("remembering the address's watch", () => {
  it("makes a watch the address names the pick", () => {
    expect(adoptRouteWatch("w1", "w2", WATCHES)).toBe("w2");
    expect(adoptRouteWatch(undefined, "w2", WATCHES)).toBe("w2");
  });

  it("keeps the pick for an address with no watch, the same watch, or one the list does not have", () => {
    expect(adoptRouteWatch("w1", undefined, WATCHES)).toBe("w1");
    expect(adoptRouteWatch("w1", "w1", WATCHES)).toBe("w1");
    expect(adoptRouteWatch("w1", "gone", WATCHES)).toBe("w1");
    expect(adoptRouteWatch("w1", "p1", WATCHES)).toBe("w1");
  });

  it("takes the address's watch on trust while the list is not in", () => {
    expect(adoptRouteWatch("w1", "w2", [])).toBe("w2");
  });
});

describe("the remembered pick", () => {
  function memory() {
    const held = new Map<string, string>();
    return {
      held,
      storage: () => ({
        getItem: (k: string) => held.get(k) ?? null,
        setItem: (k: string, v: string) => { held.set(k, v); },
      }),
    };
  }

  it("is kept under its own key and read back", () => {
    const m = memory();
    expect(loadWatchPick(m.storage)).toBeUndefined();
    saveWatchPick(m.storage, "w2");
    expect(WATCH_PICK_KEY).toBe("wrist-assistant-panel.watch.v1");
    expect(JSON.parse(m.held.get(WATCH_PICK_KEY)!)).toEqual({ watch: "w2" });
    expect(loadWatchPick(m.storage)).toBe("w2");
  });

  it("reads as none when it is garbage, the wrong shape or empty", () => {
    for (const raw of ["{", "null", "[]", `{"watch": 3}`, `{"watch": ""}`, `"w2"`]) {
      const m = memory();
      m.held.set(WATCH_PICK_KEY, raw);
      expect(loadWatchPick(m.storage), raw).toBeUndefined();
    }
  });

  it("survives storage that is off or throws, even when merely reached", () => {
    const throwing = () => { throw new Error("denied"); };
    expect(loadWatchPick(throwing)).toBeUndefined();
    expect(() => saveWatchPick(throwing, "w1")).not.toThrow();
    const broken = () => ({ getItem: throwing, setItem: throwing });
    expect(loadWatchPick(broken)).toBeUndefined();
    expect(() => saveWatchPick(broken, "w1")).not.toThrow();
    expect(loadWatchPick(() => undefined)).toBeUndefined();
  });
});
