// The symbol catalogue and search behind the picker.
//
// The names themselves were checked against `NSImage(systemSymbolName:)` when
// the catalogue was written; that check needs a Mac and cannot run here, so
// these tests guard the things that can drift silently instead: name shape,
// duplicates inside a category, and what search and recents actually return.

import { describe, expect, it } from "vitest";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES, SymbolBrowser, searchSymbols } from "../src/symbols.js";
import { cupertinoToSF, sfToCupertino } from "../src/icons.js";

/** Apple's names are lowercase words joined by dots. A hyphen or capital here
 * would survive the round trip through the icon pack as a different name. */
const SF_NAME = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

describe("catalogue", () => {
  it("holds only well formed SF Symbol names", () => {
    const bad = CURATED_SYMBOLS.filter((s) => !SF_NAME.test(s));
    expect(bad).toEqual([]);
  });

  it("never repeats a symbol inside one category", () => {
    for (const category of SYMBOL_CATEGORIES) {
      const seen = new Set(category.symbols);
      expect(seen.size, `${category.name} repeats a symbol`).toBe(category.symbols.length);
    }
  });

  it("names every category exactly once", () => {
    const names = SYMBOL_CATEGORIES.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("flattens to every category's symbols, deduplicated", () => {
    const flat = new Set(SYMBOL_CATEGORIES.flatMap((c) => c.symbols));
    expect(new Set(CURATED_SYMBOLS)).toEqual(flat);
    expect(CURATED_SYMBOLS.length).toBe(flat.size);
  });

  it("keeps category order when flattening", () => {
    expect(CURATED_SYMBOLS[0]).toBe(SYMBOL_CATEGORIES[0]!.symbols[0]);
  });
});

describe("name conversion", () => {
  it("round trips every catalogue name through the icon pack's spelling", () => {
    for (const symbol of CURATED_SYMBOLS) {
      expect(cupertinoToSF(sfToCupertino(symbol))).toBe(symbol);
    }
  });
});

describe("searchSymbols", () => {
  const names = ["lightbulb.fill", "lightbulb", "house.fill", "thermometer.medium", "drop.fill"];

  it("returns the list unchanged for an empty query", () => {
    expect(searchSymbols(names, "")).toEqual(names);
    expect(searchSymbols(names, "   ")).toEqual(names);
  });

  it("matches on any word of the name", () => {
    expect(searchSymbols(names, "fill")).toEqual(["lightbulb.fill", "house.fill", "drop.fill"]);
  });

  it("matches part of a word, so a half typed name still finds it", () => {
    expect(searchSymbols(names, "light")).toEqual(["lightbulb.fill", "lightbulb"]);
    expect(searchSymbols(names, "therm")).toEqual(["thermometer.medium"]);
  });

  it("requires every word of the query", () => {
    expect(searchSymbols(names, "lightbulb house")).toEqual([]);
    expect(searchSymbols(names, "lightbulb fill")).toEqual(["lightbulb.fill"]);
  });

  it("treats dots in the query as word breaks", () => {
    expect(searchSymbols(names, "lightbulb.fill")).toEqual(["lightbulb.fill"]);
  });

  it("puts an exact name first, then prefixes", () => {
    expect(searchSymbols(names, "lightbulb")).toEqual(["lightbulb", "lightbulb.fill"]);
  });

  it("finds symbols through their aliases", () => {
    expect(searchSymbols(names, "temperature")).toEqual(["thermometer.medium"]);
    expect(searchSymbols(names, "humidity")).toEqual(["drop.fill"]);
  });

  it("ignores case", () => {
    expect(searchSymbols(names, "HOUSE")).toEqual(["house.fill"]);
  });

  it("does not mutate the list it was given", () => {
    const original = [...names];
    searchSymbols(names, "fill");
    expect(names).toEqual(original);
  });
});

describe("SymbolBrowser", () => {
  /** Storage is unavailable under vitest, which the browser swallows, so every
   * instance here starts with an empty recents list. */
  const make = () => {
    let changes = 0;
    const browser = new SymbolBrowser(() => { changes += 1; });
    return { browser, changed: () => changes };
  };

  it("opens for one editor at a time and closes on a second press", () => {
    const { browser, changed } = make();
    browser.toggle("a");
    expect(browser.openFor).toBe("a");
    browser.toggle("b");
    expect(browser.openFor).toBe("b");
    browser.toggle("b");
    expect(browser.openFor).toBeUndefined();
    expect(changed()).toBe(3);
  });

  it("clears the search when it opens", () => {
    const { browser } = make();
    browser.setQuery("bolt");
    browser.toggle("a");
    expect(browser.query).toBe("");
  });

  it("keeps recents most recent first, without duplicates", () => {
    const { browser } = make();
    browser.noteUsed("house.fill");
    browser.noteUsed("bolt.fill");
    browser.noteUsed("house.fill");
    expect(browser.recent).toEqual(["house.fill", "bolt.fill"]);
  });

  it("caps recents at twelve", () => {
    const { browser } = make();
    for (let i = 0; i < 20; i += 1) browser.noteUsed(`${i}.circle`);
    expect(browser.recent).toHaveLength(12);
    expect(browser.recent[0]).toBe("19.circle");
  });

  it("ignores a blank pick", () => {
    const { browser, changed } = make();
    browser.noteUsed("   ");
    expect(browser.recent).toEqual([]);
    expect(changed()).toBe(0);
  });
});
