// Complications hidden from the header picker: a list of ids per watch in
// this browser's storage, read leniently and never on the wire.

import { describe, expect, it } from "vitest";

import { hiddenStoreKey, loadHidden, parseHidden, saveHidden, splitHidden, toggleHidden } from "../src/picker-hidden.js";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
  };
}

const throwing = {
  getItem: () => { throw new Error("blocked"); },
  setItem: () => { throw new Error("blocked"); },
  removeItem: () => { throw new Error("blocked"); },
};

describe("hidden picker rows", () => {
  it("reads a stored list leniently", () => {
    expect([...parseHidden('["a","b"]')]).toEqual(["a", "b"]);
    expect(parseHidden(null).size).toBe(0);
    expect(parseHidden("not json").size).toBe(0);
    expect(parseHidden('{"a":1}').size).toBe(0);
    expect([...parseHidden('["a",3,null]')]).toEqual(["a"]);
  });

  it("keeps one list per watch and removes the key when empty", () => {
    const s = memoryStorage();
    saveHidden(s, "watch-1", new Set(["b", "a"]));
    expect(s.map.get(hiddenStoreKey("watch-1"))).toBe('["a","b"]');
    expect([...loadHidden(s, "watch-1")].sort()).toEqual(["a", "b"]);
    expect(loadHidden(s, "watch-2").size).toBe(0);
    saveHidden(s, "watch-1", new Set());
    expect(s.map.has(hiddenStoreKey("watch-1"))).toBe(false);
  });

  it("survives storage that throws or is missing", () => {
    expect(loadHidden(throwing, "w").size).toBe(0);
    expect(() => saveHidden(throwing, "w", new Set(["a"]))).not.toThrow();
    expect(loadHidden(undefined, "w").size).toBe(0);
    expect(() => saveHidden(undefined, "w", new Set(["a"]))).not.toThrow();
  });

  it("toggles an id, and drops ids no longer on the watch", () => {
    const once = toggleHidden(new Set(), "a");
    expect([...once]).toEqual(["a"]);
    expect(toggleHidden(once, "a").size).toBe(0);
    expect([...toggleHidden(new Set(["gone", "a"]), "b", ["a", "b"])].sort()).toEqual(["a", "b"]);
  });

  it("splits rows in order, never hiding the open one or a row without an id", () => {
    const rows = [{ id: "a" }, { id: undefined }, { id: "b" }, { id: "c" }];
    const { shown, hidden } = splitHidden(rows, (r) => r.id, new Set(["a", "b", "c"]), "b");
    expect(shown.map((r) => r.id)).toEqual([undefined, "b"]);
    expect(hidden.map((r) => r.id)).toEqual(["a", "c"]);
  });
});
