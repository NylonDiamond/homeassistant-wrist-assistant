// The settings sections of the page editor start open, and a fold is
// remembered: for this visit in the editor's `uiState`, and across a reload in
// localStorage, where only the folded sections are kept.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FOLD_STORE_KEY, sectionOpen, setSectionOpen } from "../src/watch-pages/fold-memory.js";

function memoryStorage() {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
  };
}

describe("fold memory", () => {
  let storage: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts every section open", () => {
    const ui = new Map<string, unknown>();
    for (const section of ["opens", "state", "text", "border", "action", "background"]) {
      expect(sectionOpen(ui, "tile-settings", section), section).toBe(true);
    }
    expect(sectionOpen(ui, "page-settings", "switcher")).toBe(true);
    expect(sectionOpen(ui, "smart-settings", "header")).toBe(true);
  });

  it("keeps a fold across a reload, and only the folded sections", () => {
    const ui = new Map<string, unknown>();
    setSectionOpen(ui, "tile-settings", "text", false);
    setSectionOpen(ui, "page-settings", "theme", false);
    setSectionOpen(ui, "tile-settings", "icon", true);
    expect(JSON.parse(storage.data[FOLD_STORE_KEY]!)).toEqual({ "page-settings:theme": true, "tile-settings:text": true });
    // A reload: a fresh uiState reads the stored folds.
    const fresh = new Map<string, unknown>();
    expect(sectionOpen(fresh, "tile-settings", "text")).toBe(false);
    expect(sectionOpen(fresh, "page-settings", "theme")).toBe(false);
    expect(sectionOpen(fresh, "tile-settings", "icon")).toBe(true);
    // The same section of another module is its own.
    expect(sectionOpen(fresh, "page-settings", "text")).toBe(true);
  });

  it("drops a section from storage when it is opened again, and the key with the last one", () => {
    const ui = new Map<string, unknown>();
    setSectionOpen(ui, "smart-settings", "page", false);
    setSectionOpen(ui, "smart-settings", "header", false);
    setSectionOpen(ui, "smart-settings", "page", true);
    expect(JSON.parse(storage.data[FOLD_STORE_KEY]!)).toEqual({ "smart-settings:header": true });
    setSectionOpen(ui, "smart-settings", "header", true);
    expect(Object.hasOwn(storage.data, FOLD_STORE_KEY)).toBe(false);
    expect(sectionOpen(new Map(), "smart-settings", "header")).toBe(true);
  });

  it("lets this visit's choice win over the stored one", () => {
    storage.setItem(FOLD_STORE_KEY, JSON.stringify({ "tile-settings:text": true }));
    const ui = new Map<string, unknown>([["tile-settings:open:text", true]]);
    expect(sectionOpen(ui, "tile-settings", "text")).toBe(true);
    ui.set("tile-settings:open:border", false);
    expect(sectionOpen(ui, "tile-settings", "border")).toBe(false);
  });

  it("reads a stored value that does not parse as nothing folded", () => {
    storage.setItem(FOLD_STORE_KEY, "{oops");
    expect(sectionOpen(new Map(), "tile-settings", "text")).toBe(true);
    storage.setItem(FOLD_STORE_KEY, JSON.stringify(["tile-settings:text"]));
    expect(sectionOpen(new Map(), "tile-settings", "text")).toBe(true);
  });

  it("still folds for this visit with no storage at all", () => {
    vi.stubGlobal("localStorage", undefined);
    const ui = new Map<string, unknown>();
    setSectionOpen(ui, "tile-settings", "action", false);
    expect(sectionOpen(ui, "tile-settings", "action")).toBe(false);
    expect(sectionOpen(new Map(), "tile-settings", "action")).toBe(true);
  });
});
