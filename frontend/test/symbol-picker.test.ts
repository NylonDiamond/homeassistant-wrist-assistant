// The picker's two decisions that are pure enough to test without a DOM: which
// names the grid offers, and what the line under it claims about them.

import { describe, expect, it } from "vitest";
import { symbolCount, symbolPool } from "../src/editors.js";
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

describe("symbolCount", () => {
  it("reports a plain total while browsing", () => {
    expect(symbolCount(282, 282, false)).toBe("282 symbols available.");
  });

  it("reports a plain total for a search that fits", () => {
    expect(symbolCount(12, 12, true)).toBe("12 symbols match.");
  });

  it("never says x of x", () => {
    expect(symbolCount(9, 9, false)).not.toContain("of 9");
    expect(symbolCount(9, 9, true)).not.toContain("of 9");
  });

  it("does the arithmetic only when something was left out", () => {
    expect(symbolCount(120, 843, true)).toBe("Showing 120 of 843. Type more to narrow it down.");
  });

  it("counts one symbol in the singular", () => {
    expect(symbolCount(1, 1, false)).toBe("1 symbol available.");
    expect(symbolCount(1, 1, true)).toBe("1 symbol matches.");
  });
});
