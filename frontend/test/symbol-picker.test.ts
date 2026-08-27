// The picker's two decisions that are pure enough to test without a DOM: which
// names the grid offers, and what the line under it claims about them.

import { describe, expect, it } from "vitest";
import { drawableCount, reachableCount, symbolChoices, symbolCount, symbolPool } from "../src/editors.js";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES } from "../src/symbols.js";

const CATEGORY = SYMBOL_CATEGORIES[0]!;
/** Stands in for an installed icon pack: everything curated, plus extras only
 * the pack knows about. */
const PACK = [...CURATED_SYMBOLS, "pack.only.one", "pack.only.two"];

describe("symbolPool", () => {
  const known = new Set(PACK);

  it("starts from the curated catalogue, not the pack", () => {
    const pool = symbolPool("", "", PACK, known);
    expect(pool.fromPack).toBe(false);
    expect(pool.names).toEqual(CURATED_SYMBOLS);
  });

  it("reaches the whole pack once something is typed", () => {
    const pool = symbolPool("", "bolt", PACK, known);
    expect(pool.fromPack).toBe(true);
    expect(pool.names).toEqual(PACK);
  });

  it("keeps a chosen category even while searching", () => {
    const pool = symbolPool(CATEGORY.name, "house", PACK, known);
    expect(pool.fromPack).toBe(false);
    expect(pool.names).toEqual(CATEGORY.symbols);
  });

  it("is empty for a category name it does not have", () => {
    expect(symbolPool("Nonsense", "", PACK, known).names).toEqual([]);
  });

  it("hides curated names the pack cannot draw", () => {
    const partial = new Set(CURATED_SYMBOLS.slice(0, 5));
    const pool = symbolPool("", "", [...partial], partial);
    expect(pool.names).toEqual(CURATED_SYMBOLS.slice(0, 5));
  });

  it("filters nothing when no pack is installed, so names still show", () => {
    const pool = symbolPool("", "", [], new Set());
    expect(pool.names).toEqual(CURATED_SYMBOLS);
  });

  it("stays on the curated set when searching without a pack", () => {
    const pool = symbolPool("", "bolt", [], new Set());
    expect(pool.fromPack).toBe(false);
    expect(pool.names).toEqual(CURATED_SYMBOLS);
  });

  it("does not hand back the caller's own arrays to mutate", () => {
    expect(symbolPool("", "bolt", PACK, known).names).not.toBe(PACK);
    expect(symbolPool(CATEGORY.name, "", PACK, known).names).not.toBe(CATEGORY.symbols);
  });
});

describe("drawableCount", () => {
  it("counts the whole list when no pack is installed", () => {
    expect(drawableCount(CURATED_SYMBOLS, new Set())).toBe(CURATED_SYMBOLS.length);
  });

  it("counts only what the pack can draw", () => {
    const known = new Set(CURATED_SYMBOLS.slice(0, 4));
    expect(drawableCount(CURATED_SYMBOLS, known)).toBe(4);
  });
});

describe("symbolChoices", () => {
  const known = new Set(PACK);

  it("offers the starter set first, sized by the whole catalogue", () => {
    expect(symbolChoices(known)[0]).toEqual({ value: "", label: `Starter set (${CURATED_SYMBOLS.length})` });
  });

  it("gives every category its own size", () => {
    const choices = symbolChoices(known);
    expect(choices).toHaveLength(SYMBOL_CATEGORIES.length + 1);
    expect(choices[1]).toEqual({ value: CATEGORY.name, label: `${CATEGORY.name} (${CATEGORY.symbols.length})` });
  });

  it("counts what the pack can draw, not what the catalogue lists", () => {
    const partial = new Set(CATEGORY.symbols.slice(0, 2));
    expect(symbolChoices(partial)[1]?.label).toBe(`${CATEGORY.name} (2)`);
  });
});

describe("reachableCount", () => {
  it("counts the installed pack, which search can reach in full", () => {
    expect(reachableCount(PACK)).toBe(PACK.length);
  });

  it("falls back to the curated catalogue with no pack installed", () => {
    expect(reachableCount([])).toBe(CURATED_SYMBOLS.length);
  });
});

describe("symbolCount", () => {
  it("reports everything reachable while browsing", () => {
    expect(symbolCount(282, 282, false, 6945)).toBe("6945 symbols available.");
  });

  it("reports the same total inside a category", () => {
    // The dropdown already says how big the category is, so this line keeps
    // pointing at everything there is to find.
    expect(symbolCount(18, 18, false, 6945)).toBe("6945 symbols available.");
  });

  it("reports a plain total for a search that fits", () => {
    expect(symbolCount(12, 12, true, 282)).toBe("12 symbols match.");
  });

  it("never says x of x", () => {
    expect(symbolCount(9, 9, false, 9)).not.toContain("of 9");
    expect(symbolCount(9, 9, true, 282)).not.toContain("of 9");
  });

  it("does the arithmetic only when something was left out", () => {
    expect(symbolCount(120, 843, true, 282)).toBe("Showing 120 of 843. Type more to narrow it down.");
  });

  it("counts one symbol in the singular", () => {
    expect(symbolCount(1, 1, false, 1)).toBe("1 symbol available.");
    expect(symbolCount(1, 1, true, 282)).toBe("1 symbol matches.");
  });
});
