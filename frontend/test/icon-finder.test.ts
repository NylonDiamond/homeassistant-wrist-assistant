// Home's Icon names card: which names it offers for a category and a search,
// and how the recently copied list grows and survives a reload.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ICON_FINDER_RECENT_KEY,
  ICON_FINDER_RECENT_LIMIT,
  IconFinderState,
  iconFinderMatches,
  rememberRecent,
} from "../src/icon-finder.js";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES } from "../src/symbols.js";

function memoryStorage() {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
  };
}

const lighting = SYMBOL_CATEGORIES.find((c) => c.name === "Lighting")!;

describe("iconFinderMatches", () => {
  it("offers the curated catalogue when no pack lists its names", () => {
    expect(iconFinderMatches([], "", "")).toEqual({ matches: CURATED_SYMBOLS, fromPack: false });
  });

  it("searches the curated catalogue when no pack lists its names", () => {
    const { matches, fromPack } = iconFinderMatches([], "", "lightbulb");
    expect(fromPack).toBe(false);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((n) => n.includes("lightbulb"))).toBe(true);
  });

  it("finds a name by an alias it does not contain", () => {
    expect(iconFinderMatches([], "", "laundry").matches).toEqual(expect.arrayContaining(["washer.fill", "dryer.fill"]));
  });

  it("keeps a category to its own names", () => {
    expect(iconFinderMatches([], "Lighting", "").matches).toEqual(lighting.symbols);
    expect(iconFinderMatches([], "Lighting", "lamp").matches.every((n) => lighting.symbols.includes(n))).toBe(true);
  });

  it("searches the whole pack once something is typed under All", () => {
    const pack = ["lightbulb.fill", "lightbulb.2.fill", "zzz", "house.fill"];
    expect(iconFinderMatches(pack, "", "lightbulb")).toEqual({ matches: ["lightbulb.fill", "lightbulb.2.fill"], fromPack: true });
  });

  it("puts a whole name match first", () => {
    const pack = ["lightbulb.fill.extra", "lightbulb.fill"];
    expect(iconFinderMatches(pack, "", "lightbulb.fill").matches[0]).toBe("lightbulb.fill");
  });

  it("browses only what the pack can draw", () => {
    const pack = ["lightbulb", "lightbulb.fill", "something.else"];
    expect(iconFinderMatches(pack, "", "")).toEqual({ matches: ["lightbulb", "lightbulb.fill"], fromPack: false });
    expect(iconFinderMatches(pack, "Lighting", "").matches).toEqual(["lightbulb", "lightbulb.fill"]);
  });

  it("finds nothing for a word no name has", () => {
    expect(iconFinderMatches([], "", "qqqq").matches).toEqual([]);
  });
});

describe("rememberRecent", () => {
  it("puts the newest name first without repeating it", () => {
    expect(rememberRecent(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("trims the name and ignores a blank one", () => {
    expect(rememberRecent(["a"], "  house.fill ")).toEqual(["house.fill", "a"]);
    expect(rememberRecent(["a"], "   ")).toEqual(["a"]);
  });

  it("keeps the last twelve", () => {
    let list: string[] = [];
    for (let i = 0; i < 20; i++) list = rememberRecent(list, `n${i}`);
    expect(list).toHaveLength(ICON_FINDER_RECENT_LIMIT);
    expect(list[0]).toBe("n19");
    expect(list.at(-1)).toBe("n8");
  });

  it("leaves the list it was given alone", () => {
    const before = ["a", "b"];
    rememberRecent(before, "c");
    expect(before).toEqual(["a", "b"]);
  });
});

describe("IconFinderState", () => {
  let storage: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps recent names across a reload", () => {
    const first = new IconFinderState();
    expect(first.recent).toEqual([]);
    first.noteRecent("lightbulb.fill");
    first.noteRecent("house.fill");
    expect(JSON.parse(storage.data[ICON_FINDER_RECENT_KEY]!)).toEqual(["house.fill", "lightbulb.fill"]);
    expect(new IconFinderState().recent).toEqual(["house.fill", "lightbulb.fill"]);
  });

  it("reads a damaged store as an empty list", () => {
    storage.data[ICON_FINDER_RECENT_KEY] = "{not json";
    expect(new IconFinderState().recent).toEqual([]);
    storage.data[ICON_FINDER_RECENT_KEY] = JSON.stringify({ a: 1 });
    expect(new IconFinderState().recent).toEqual([]);
    storage.data[ICON_FINDER_RECENT_KEY] = JSON.stringify(["ok", 3, "", "fine"]);
    expect(new IconFinderState().recent).toEqual(["ok", "fine"]);
  });

  it("works with no storage at all", () => {
    vi.stubGlobal("localStorage", undefined);
    const state = new IconFinderState();
    expect(state.recent).toEqual([]);
    state.noteRecent("house.fill");
    expect(state.recent).toEqual(["house.fill"]);
  });

  it("asks the pack for its names until it answers, then keeps the answer", () => {
    const state = new IconFinderState();
    let answer: string[] | undefined;
    let asked = 0;
    const icons = { names: () => { asked++; return answer; } };
    expect(state.names(icons)).toEqual([]);
    answer = ["house.fill"];
    expect(state.names(icons)).toEqual(["house.fill"]);
    expect(state.names(icons)).toEqual(["house.fill"]);
    expect(asked).toBe(2);
  });

  it("gives the same matches back while nothing they read has changed", () => {
    // The card draws with every Home Assistant state change; the search must not.
    const state = new IconFinderState();
    const pack = ["house.fill", "lightbulb.fill"];
    const a = state.matches(pack);
    expect(state.matches(pack)).toBe(a);
    state.query = "house";
    expect(state.matches(pack).matches).toEqual(["house.fill"]);
  });
});
