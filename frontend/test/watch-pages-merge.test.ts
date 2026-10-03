// The three-way merge of the watch's page config, its JSON equality, and the
// shape check that stops a save.
//
// The case files in `fixtures-pages/merge` are the specification the phone
// runs too (copied from the app repo, which is canonical, by
// `scripts/sync-complication-fixtures.sh`); every file in the folder is run.
// `phone` in a case file is the local side, which in the panel is the draft.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  WATCH_PAGES_SLIDE_MAP_KEYS,
  checkWatchPages,
  checkWatchPagesValues,
  mergeWatchPages,
  mergeWatchPagesByKey,
  sameWatchPagesJson,
} from "../src/watch-pages/merge.js";

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as object)) deepFreeze(child);
  }
  return value;
}

/** A smart page's config with all eight keys the decoder needs. */
const FULL_DYNAMIC_CONFIG = {
  liveUpdates: false,
  pullToRefresh: true,
  refreshOnAppear: false,
  rules: [] as unknown[],
  sortOrder: "domain",
  tileColSpan: 4,
  tileRowSpan: 3,
  tileShowLabel: true,
};

/** A structured copy, to check after a merge that nothing changed. */
function snapshot(value: unknown): unknown {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

/** Every value, at any depth, that is `null`, by path. */
function nullPaths(value: unknown, path = "$"): string[] {
  if (value === null) return [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => nullPaths(v, `${path}[${i}]`));
  if (typeof value === "object") return Object.entries(value as object).flatMap(([k, v]) => nullPaths(v, `${path}.${k}`));
  return [];
}

// ── the case files ───────────────────────────────────────────────────────

const casesDir = join(__dirname, "fixtures-pages", "merge");
const caseFiles = existsSync(casesDir)
  ? readdirSync(casesDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".json"))
      .map((e) => e.name)
      .sort()
  : [];

interface MergeCase {
  name: string;
  base?: WatchPagesDocument | null;
  phone: WatchPagesDocument;
  server: WatchPagesDocument;
  expected: WatchPagesDocument;
}

describe("merge case files", () => {
  it("are read from the folder", () => {
    // The count after the music hub cases, so a sync that drops some fails.
    expect(caseFiles.length).toBeGreaterThanOrEqual(55);
  });

  for (const file of caseFiles) {
    const c = JSON.parse(readFileSync(join(casesDir, file), "utf8")) as MergeCase;
    it(`${file}: ${c.name}`, () => {
      const before = { base: snapshot(c.base), phone: snapshot(c.phone), server: snapshot(c.server) };
      deepFreeze(c);
      const merged = mergeWatchPages(c.base ?? null, c.phone, c.server);
      expect(sameWatchPagesJson(merged, c.expected)).toBe(true);
      expect(merged).toEqual(c.expected);
      expect({ base: snapshot(c.base), phone: snapshot(c.phone), server: snapshot(c.server) }).toEqual(before);
    });
  }
});

// ── order ────────────────────────────────────────────────────────────────

/** A document of pages with the given ids and names, no tiles. */
function pages(...entries: Array<string | [string, string]>): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: entries.map((e) => (typeof e === "string" ? { id: e, name: e } : { id: e[0], name: e[1] })),
  };
}

function idsOf(document: WatchPagesDocument): string[] {
  return (document.pages as JsonObject[]).map((p) => p.id as string);
}

function namesOf(document: WatchPagesDocument): string[] {
  return (document.pages as JsonObject[]).map((p) => p.name as string);
}

function merge(base: WatchPagesDocument | null, local: WatchPagesDocument, server: WatchPagesDocument): WatchPagesDocument {
  return mergeWatchPages(deepFreeze(base), deepFreeze(local), deepFreeze(server));
}

describe("order of a merged list", () => {
  it("is the server's when local did not reorder", () => {
    const out = merge(pages("A", "B", "C"), pages("A", "B", "C"), pages("C", "A", "B"));
    expect(idsOf(out)).toEqual(["C", "A", "B"]);
  });

  it("puts what only local holds after the server's, in local's order", () => {
    const out = merge(pages("A", "B"), pages("Y", "A", "X", "B"), pages("B", "A", "S"));
    // Local added Y and X without moving A and B: no reorder.
    expect(idsOf(out)).toEqual(["B", "A", "S", "Y", "X"]);
  });

  it("does not count adding or deleting as a reorder", () => {
    const out = merge(pages("A", "B", "C"), pages("A", "C", "N"), pages("C", "B", "A"));
    // Local deleted B (unchanged on the server, so gone) and added N.
    expect(idsOf(out)).toEqual(["C", "A", "N"]);
  });

  it("is local's when local reordered, with what only the server holds after", () => {
    const out = merge(pages("A", "B", "C"), pages("C", "A", "B"), pages("A", "S", "B", "C"));
    expect(idsOf(out)).toEqual(["C", "A", "B", "S"]);
  });

  it("is local's when both sides reordered", () => {
    const out = merge(pages("A", "B", "C"), pages("B", "A", "C"), pages("C", "B", "A"));
    expect(idsOf(out)).toEqual(["B", "A", "C"]);
  });

  it("keeps a page local added in its place when local reordered", () => {
    const out = merge(pages("A", "B", "C"), pages("C", "N", "A", "B"), pages("A", "B", "C", "S"));
    expect(idsOf(out)).toEqual(["C", "N", "A", "B", "S"]);
  });

  it("merges the keys of a page in local's order", () => {
    const out = merge(pages("A", "B"), pages("B", "A"), pages("A", ["B", "Renamed"]));
    expect(idsOf(out)).toEqual(["B", "A"]);
    expect(namesOf(out)).toEqual(["Renamed", "A"]);
  });

  describe("when local reordered", () => {
    const base = pages("A", "B", "C");

    it("drops a page the server deleted and local left as it was", () => {
      const out = merge(base, pages("C", "B", "A"), pages("A", "C"));
      expect(idsOf(out)).toEqual(["C", "A"]);
    });

    it("keeps, in local's place, a page the server deleted and local changed", () => {
      const out = merge(base, pages("C", ["B", "Changed"], "A"), pages("A", "C"));
      expect(idsOf(out)).toEqual(["C", "B", "A"]);
      expect(namesOf(out)).toEqual(["C", "Changed", "A"]);
    });

    it("drops a page local deleted and the server left as it was", () => {
      const out = merge(base, pages("C", "A"), pages("A", "B", "C"));
      expect(idsOf(out)).toEqual(["C", "A"]);
    });

    it("puts last a page local deleted and the server changed", () => {
      const out = merge(base, pages("C", "A"), pages("A", ["B", "Changed"], "C"));
      expect(idsOf(out)).toEqual(["C", "A", "B"]);
      expect(namesOf(out)).toEqual(["C", "A", "Changed"]);
    });
  });

  describe("when local did not reorder", () => {
    const base = pages("A", "B", "C");

    it("drops a page local deleted and the server left as it was", () => {
      const out = merge(base, pages("A", "C"), pages("C", "B", "A"));
      expect(idsOf(out)).toEqual(["C", "A"]);
    });

    it("keeps, in the server's place, a page local deleted and the server changed", () => {
      const out = merge(base, pages("A", "C"), pages("C", ["B", "Changed"], "A"));
      expect(idsOf(out)).toEqual(["C", "B", "A"]);
    });

    it("drops a page the server deleted and local left as it was", () => {
      const out = merge(base, pages("A", "B", "C"), pages("C", "A"));
      expect(idsOf(out)).toEqual(["C", "A"]);
    });

    it("puts last a page the server deleted and local changed", () => {
      const out = merge(base, pages("A", ["B", "Changed"], "C"), pages("C", "A"));
      expect(idsOf(out)).toEqual(["C", "A", "B"]);
    });
  });

  it("uses the server's document as the base when there is none", () => {
    // Same relative order as the server: no reorder, so the server's order
    // with local's added page last, and every difference reads as local's.
    const same = merge(null, pages("A", ["B", "Mine"], "N"), pages("A", "B", "S"));
    expect(idsOf(same)).toEqual(["A", "B", "N"]);
    expect(namesOf(same)).toEqual(["A", "Mine", "N"]);
    // Another order than the server's: local's order.
    const moved = merge(null, pages("B", "A"), pages("A", "B", "S"));
    expect(idsOf(moved)).toEqual(["B", "A"]);
  });

  it("applies to the tiles of each page on their own", () => {
    const tile = (id: string) => ({ id, entityId: `light.${id.toLowerCase()}` });
    const doc = (pageOrder: string[], tileOrder: string[]): WatchPagesDocument => ({
      pages: pageOrder.map((id) => ({ id, items: id === "P" ? tileOrder.map(tile) : [] })),
    });
    const out = merge(doc(["P", "Q"], ["a", "b", "c"]), doc(["P", "Q"], ["c", "b", "a"]), doc(["Q", "P"], ["a", "b", "c", "d"]));
    expect(idsOf(out)).toEqual(["Q", "P"]);
    const p = (out.pages as JsonObject[])[1]!;
    expect((p.items as JsonObject[]).map((t) => t.id)).toEqual(["c", "b", "a", "d"]);
  });
});

// ── smart pages ──────────────────────────────────────────────────────────

describe("a smart page's dynamicConfig", () => {
  const PAGE = "C52206FB-F7ED-4FB7-95F4-E6519A2865FC";
  const R1 = "11111111-0000-4000-8000-000000000001";
  const R2 = "22222222-0000-4000-8000-000000000002";
  const R3 = "33333333-0000-4000-8000-000000000003";
  type Rule = Record<string, unknown>;
  const rule = (id: string, domain: string, extra: Rule = {}): Rule => ({
    domain,
    entityIds: [],
    header: "label",
    id,
    invertActive: false,
    mode: "all",
    tileStyle: { color: "#FFCC00", icon: "lightbulb.fill" },
    ...extra,
  });
  const doc = (rules: Rule[], config: Rule = {}, page: Rule = {}): WatchPagesDocument => ({
    pages: [{ id: PAGE, name: "Active", items: [], ...page, dynamicConfig: { ...FULL_DYNAMIC_CONFIG, ...config, rules } }],
  });
  const configOf = (d: WatchPagesDocument) => (d.pages as JsonObject[])[0]!.dynamicConfig as JsonObject;
  const rulesOf = (d: WatchPagesDocument) => configOf(d).rules as Rule[];

  it("keeps edits to different rules on each side", () => {
    const base = doc([rule(R1, "light"), rule(R2, "switch")]);
    const phone = doc([rule(R1, "light", { invertActive: true }), rule(R2, "switch")]);
    const server = doc([rule(R1, "light"), rule(R2, "switch", { header: "line" })]);
    expect(rulesOf(merge(base, phone, server))).toEqual([rule(R1, "light", { invertActive: true }), rule(R2, "switch", { header: "line" })]);
  });

  it("keeps a rule each side added, the phone's after the server's", () => {
    const base = doc([rule(R1, "light")]);
    const phone = doc([rule(R1, "light"), rule(R2, "switch")]);
    const server = doc([rule(R1, "light"), rule(R3, "fan")]);
    expect(rulesOf(merge(base, phone, server)).map((r) => r.id)).toEqual([R1, R3, R2]);
  });

  it("keeps a rule one side deleted when the other styled it", () => {
    const base = doc([rule(R1, "light"), rule(R2, "switch")]);
    const phone = doc([rule(R1, "light")]);
    const styled = rule(R2, "switch", { tileStyle: { color: "#FFCC00", icon: "switch.2", borderStyle: "line" } });
    const server = doc([rule(R1, "light"), styled]);
    expect(rulesOf(merge(base, phone, server))).toEqual([rule(R1, "light"), styled]);
    // Left alone on the other side, the delete stands.
    expect(rulesOf(merge(base, phone, base)).map((r) => r.id)).toEqual([R1]);
  });

  it("keeps the phone's order of the rules while the server edits one", () => {
    const base = doc([rule(R1, "light"), rule(R2, "switch"), rule(R3, "fan")]);
    const phone = doc([rule(R3, "fan"), rule(R1, "light"), rule(R2, "switch")]);
    const server = doc([rule(R1, "light"), rule(R2, "switch", { headerLabel: "Plugs" }), rule(R3, "fan")]);
    expect(rulesOf(merge(base, phone, server))).toEqual([rule(R3, "fan"), rule(R1, "light"), rule(R2, "switch", { headerLabel: "Plugs" })]);
  });

  it("merges a rule's tileStyle key by key", () => {
    const base = doc([rule(R1, "light")]);
    const phone = doc([rule(R1, "light", { tileStyle: { color: "#FF0000", icon: "lightbulb.fill" } })]);
    const server = doc([rule(R1, "light", { tileStyle: { color: "#FFCC00", icon: "lightbulb.fill", colSpan: 6, rowSpan: 4 } })]);
    expect(rulesOf(merge(base, phone, server))[0]!.tileStyle).toEqual({ color: "#FF0000", icon: "lightbulb.fill", colSpan: 6, rowSpan: 4 });
  });

  it("keeps a page key from one side and a rule edit from the other", () => {
    const base = doc([rule(R1, "light")]);
    const phone = doc([rule(R1, "light")], { liveUpdates: true }, { name: "Busy" });
    const server = doc([rule(R1, "light", { deviceClassFilter: ["door"] })]);
    const out = merge(base, phone, server);
    expect(configOf(out)).toEqual({ ...FULL_DYNAMIC_CONFIG, liveUpdates: true, rules: [rule(R1, "light", { deviceClassFilter: ["door"] })] });
    expect((out.pages as JsonObject[])[0]!.name).toBe("Busy");
  });

  it("gives the phone the resolved list when both resolved", () => {
    const base = doc([rule(R1, "light")]);
    const phone = doc([rule(R1, "light", { resolvedEntityIds: ["light.a", "light.b"] })]);
    const server = doc([rule(R1, "light", { resolvedEntityIds: ["light.a", "light.c", "light.d"] })]);
    expect(rulesOf(merge(base, phone, server))[0]!.resolvedEntityIds).toEqual(["light.a", "light.b"]);
  });

  it("takes a side whole when only that side changed, and one value when one side has none", () => {
    const base = doc([rule(R1, "light")]);
    const server = doc([rule(R1, "light", { header: "gap" })]);
    const out = merge(base, base, server);
    expect(out.pages).toBe(server.pages);
    // The phone turned the page back into a normal one; the server's rule edit does not bring it back.
    const off = { pages: [{ id: PAGE, name: "Active", items: [] }] };
    expect((merge(base, off, server).pages as JsonObject[])[0]).toEqual({ id: PAGE, name: "Active", items: [] });
    // Both converted the page: merged by key against nothing, so every key
    // the phone holds is the phone's, and the rules of both stay.
    const plain = { pages: [{ id: PAGE, name: "Active", items: [] }] };
    const both = merge(plain, doc([rule(R1, "light")], { tileColSpan: 6 }), doc([rule(R2, "switch")], { sortOrder: "alphabetical" }));
    expect(configOf(both)).toEqual({ ...FULL_DYNAMIC_CONFIG, tileColSpan: 6, rules: [rule(R2, "switch"), rule(R1, "light")] });
  });
});

// ── keys and lists ───────────────────────────────────────────────────────

describe("merge by key", () => {
  it("takes local's value for a key local changed, else the server's", () => {
    const out = mergeWatchPagesByKey(
      deepFreeze({ a: 1, b: 1, c: 1 }),
      deepFreeze({ a: 2, b: 1, c: 1 }),
      deepFreeze({ a: 3, b: 3, c: 1 }),
    );
    expect(out).toEqual({ a: 2, b: 3, c: 1 });
  });

  it("counts a removal as a change, and never writes null", () => {
    const out = mergeWatchPagesByKey({ a: 1, b: 1, c: 1 }, { b: 1, c: null }, { a: 1, b: null, c: 1, d: null });
    expect(out).toEqual({});
    expect(Object.keys(out)).toEqual([]);
  });

  it("with no base keeps every key local holds and adds the server's others", () => {
    const out = mergeWatchPagesByKey(null, { a: 2, n: null }, { a: 1, b: 1, n: 5 });
    expect(out).toEqual({ a: 2, b: 1 });
  });

  it("puts the server's keys first in the server's order, then local's own", () => {
    const out = mergeWatchPagesByKey({ x: 0 }, { z: 1, x: 0, y: 2 }, { b: 1, x: 5, a: 1 });
    expect(Object.keys(out)).toEqual(["b", "x", "a", "z", "y"]);
  });

  it("orders a merged tile's keys the same way", () => {
    const tile = (extra: JsonObject) => ({ pages: [{ id: "P", items: [{ id: "T", entityId: "light.a", ...extra }] }] });
    const out = merge(tile({ color: "a" }), tile({ local: 1, color: "b" }), tile({ server: 1, color: "a" }));
    const merged = ((out.pages as JsonObject[])[0]!.items as JsonObject[])[0]!;
    expect(Object.keys(merged)).toEqual(["id", "entityId", "server", "color", "local"]);
    expect(merged.color).toBe("b");
  });
});

describe("taking a side whole", () => {
  it("returns the server's very document when local changed nothing", () => {
    const base = pages("A", "B");
    const server = pages("B", ["A", "New"]);
    expect(merge(base, base, server)).toBe(server);
    expect(merge(base, pages("A", "B"), server)).toBe(server);
  });

  it("returns local's very document when the server changed nothing", () => {
    const base = pages("A", "B");
    const local = pages("B", ["A", "New"], "C");
    expect(merge(base, local, pages("A", "B"))).toBe(local);
  });

  it("keeps the other side's objects where only one side changed", () => {
    const base = pages("A", "B", "C");
    const local = pages(["A", "Mine"], "B", "C");
    const server = pages("A", "B", ["C", "Theirs"]);
    const out = merge(base, local, server);
    const [a, b, c] = out.pages as JsonObject[];
    expect(a).toBe((local.pages as JsonObject[])[0]);
    expect(b).toBe((server.pages as JsonObject[])[1]);
    expect(c).toBe((server.pages as JsonObject[])[2]);
  });

  it("keeps a page only one side holds as that object", () => {
    const base = pages("A");
    const local = pages("A", "L");
    const server = pages("A", "S");
    const out = merge(base, local, server);
    expect((out.pages as JsonObject[])[1]).toBe((server.pages as JsonObject[])[1]);
    expect((out.pages as JsonObject[])[2]).toBe((local.pages as JsonObject[])[1]);
  });

  it("keeps a key's value as the object it came from", () => {
    const groups = [{ id: "G", name: "group" }];
    const base = { pages: [{ id: "P", groups: [] as unknown[], name: "a" }] };
    const local = { pages: [{ id: "P", groups, name: "a" }] };
    const server = { pages: [{ id: "P", groups: [] as unknown[], name: "b" }] };
    const out = merge(base, local, server);
    expect((out.pages as JsonObject[])[0]!.groups).toBe(groups);
  });

  it("keeps a list that cannot be matched as the very list of the side it comes from", () => {
    const localItems = [{ entityId: "light.a" }];
    const base = { pages: [{ id: "P", items: [] as unknown[], name: "a" }] };
    const local = { pages: [{ id: "P", items: localItems, name: "a" }] };
    const server = { pages: [{ id: "P", items: [] as unknown[], name: "b" }] };
    const out = merge(base, local, server);
    const page = (out.pages as JsonObject[])[0]!;
    expect(page.items).toBe(localItems);
    expect(page.name).toBe("b");
  });

  it("merges a list one side lacks as one value", () => {
    const base = { pages: [{ id: "P", items: [{ id: "T", entityId: "a" }] }] };
    const local = { pages: [{ id: "P" }] };
    const server = { pages: [{ id: "P", items: [{ id: "T", entityId: "a" }, { id: "U", entityId: "b" }] }] };
    // Local removed the list, the server changed it: local's removal stands.
    expect(merge(base, local, server)).toEqual({ pages: [{ id: "P" }] });
  });

  it("never holds null where a merge picks keys", () => {
    const base = { a: 1, pages: [{ id: "P", x: 1, items: [{ id: "T", entityId: "e", y: 1 }] }] };
    const local = { a: null, pages: [{ id: "P", x: null, items: [{ id: "T", entityId: "e", y: null }] }] };
    const server = { a: 1, b: null, pages: [{ id: "P", x: 1, z: null, items: [{ id: "T", entityId: "e", y: 1, w: null }] }] };
    const out = merge(base, local, server);
    expect(nullPaths(out)).toEqual([]);
    expect(out).toEqual({ pages: [{ id: "P", items: [{ id: "T", entityId: "e" }] }] });
  });

  it("drops a null page list", () => {
    expect(merge({ pages: [] }, { pages: null }, { pages: [] })).toEqual({});
  });
});

// ── equality ─────────────────────────────────────────────────────────────

describe("JSON equality", () => {
  it("ignores object key order", () => {
    expect(sameWatchPagesJson({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 })).toBe(true);
  });

  it("is deep and minds array order", () => {
    expect(sameWatchPagesJson({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(sameWatchPagesJson({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })).toBe(false);
    expect(sameWatchPagesJson([1, 2], [2, 1])).toBe(false);
    expect(sameWatchPagesJson([1, 2], [1, 2, 3])).toBe(false);
  });

  it("reads null as absent, at every depth", () => {
    expect(sameWatchPagesJson(null, undefined)).toBe(true);
    expect(sameWatchPagesJson({ a: 1, b: null }, { a: 1 })).toBe(true);
    expect(sameWatchPagesJson({ a: 1 }, { a: 1, b: null })).toBe(true);
    expect(sameWatchPagesJson({ x: [{ b: null }] }, { x: [{}] })).toBe(true);
    expect(sameWatchPagesJson({ a: null }, { a: 0 })).toBe(false);
    expect(sameWatchPagesJson([null], [null])).toBe(true);
    expect(sameWatchPagesJson([null], [0])).toBe(false);
  });

  it("compares numbers by value", () => {
    expect(sameWatchPagesJson(JSON.parse("6.0"), 6)).toBe(true);
    expect(sameWatchPagesJson(6, 6.5)).toBe(false);
  });

  it("never takes a boolean for a number", () => {
    expect(sameWatchPagesJson(true, 1)).toBe(false);
    expect(sameWatchPagesJson(false, 0)).toBe(false);
    expect(sameWatchPagesJson({ a: true }, { a: 1 })).toBe(false);
    expect(sameWatchPagesJson(true, true)).toBe(true);
  });

  it("tells types apart", () => {
    expect(sameWatchPagesJson("1", 1)).toBe(false);
    expect(sameWatchPagesJson([], {})).toBe(false);
    expect(sameWatchPagesJson({}, [])).toBe(false);
    expect(sameWatchPagesJson("", undefined)).toBe(false);
  });

  it("reads keys only as the object's own", () => {
    expect(sameWatchPagesJson({}, { constructor: null })).toBe(true);
    expect(sameWatchPagesJson({ constructor: 1 }, {})).toBe(false);
    expect(sameWatchPagesJson(JSON.parse('{"__proto__": 1}'), {})).toBe(false);
  });

  describe("slide maps", () => {
    it("are the five holdSlide keys", () => {
      expect([...WATCH_PAGES_SLIDE_MAP_KEYS].sort()).toEqual([
        "holdSlideActions",
        "holdSlideHTTPActionBannerSeconds",
        "holdSlideHTTPActionShowBanner",
        "holdSlideHTTPActionTargets",
        "holdSlideTriggerTargets",
      ]);
    });

    it("compare as sets of pairs", () => {
      expect(sameWatchPagesJson({ holdSlideActions: ["up", "a", "down", "b"] }, { holdSlideActions: ["down", "b", "up", "a"] })).toBe(true);
      expect(sameWatchPagesJson({ holdSlideActions: ["up", "a", "down", "b"] }, { holdSlideActions: ["down", "a", "up", "b"] })).toBe(false);
      expect(sameWatchPagesJson({ holdSlideActions: ["up", "a"] }, { holdSlideActions: ["up", "a", "down", "b"] })).toBe(false);
      expect(
        sameWatchPagesJson(
          { holdSlideTriggerTargets: ["left", { id: 1, x: 2 }, "up", 1] },
          { holdSlideTriggerTargets: ["up", 1.0, "left", { x: 2, id: 1 }] },
        ),
      ).toBe(true);
    });

    it("compare as sets inside a tile in a document", () => {
      const doc = (actions: unknown[]) => ({ pages: [{ id: "P", items: [{ id: "T", holdSlideActions: actions }] }] });
      expect(sameWatchPagesJson(doc(["up", "a", "left", "b"]), doc(["left", "b", "up", "a"]))).toBe(true);
    });

    it("compare in order when either side is not a map of pairs", () => {
      // An odd length, a direction that is not a string, a direction twice.
      for (const broken of [["up", "a", "down"], [1, "a", 2, "b"], ["up", "a", "up", "b"]]) {
        expect(sameWatchPagesJson({ holdSlideActions: broken }, { holdSlideActions: [...broken] })).toBe(true);
        expect(sameWatchPagesJson({ holdSlideActions: broken }, { holdSlideActions: [...broken].reverse() })).toBe(false);
      }
    });

    it("compare in order under any other key", () => {
      expect(sameWatchPagesJson({ actions: ["up", "a", "down", "b"] }, { actions: ["down", "b", "up", "a"] })).toBe(false);
    });

    it("are no change in a merge when only their order moved", () => {
      const doc = (actions: unknown[], name: string) => ({ pages: [{ id: "P", name, items: [{ id: "T", entityId: "e", holdSlideActions: actions }] }] });
      const base = doc(["down", "b", "up", "a"], "x");
      const local = doc(["up", "a", "down", "b"], "x");
      const server = doc(["up", "c", "down", "b"], "y");
      expect(merge(base, local, server)).toBe(server);
    });
  });
});

// ── hold and slide ───────────────────────────────────────────────────────

describe("hold and slide directions", () => {
  const A = "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B";
  const B = "6A0B3C2D-1E4F-4A5B-9C8D-7E6F5A4B3C2D";
  const P = "C3A0E000-0000-4000-8000-0000000000AA";
  const T = "C3A0E000-0000-4000-8000-000000000001";
  const doc = (slides: JsonObject): WatchPagesDocument => ({
    pages: [{ id: P, name: "Living", items: [{ id: T, entityId: "light.desk_lamp", ...slides }] }],
  });
  const tileOf = (d: WatchPagesDocument) => ((d.pages as JsonObject[])[0]!.items as JsonObject[])[0]!;
  const slideKeys = (d: WatchPagesDocument) =>
    Object.fromEntries(Object.entries(tileOf(d)).filter(([k]) => WATCH_PAGES_SLIDE_MAP_KEYS.has(k)));

  it("the phone moves a direction away from Run HTTP Action while the panel changes another: no action without its target", () => {
    const base = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    const server = doc({ holdSlideActions: ["up", "toggle"] });
    const local = doc({ holdSlideActions: ["up", "httpAction", "down", "none"], holdSlideHTTPActionTargets: ["up", A] });
    expect(slideKeys(merge(base, local, server))).toEqual({ holdSlideActions: ["up", "toggle", "down", "none"] });
  });

  it("the side that changed a direction's action gives the whole direction, banner and all", () => {
    const base = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    // The panel only turned the banner off; the phone moved up to a trigger.
    const local = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A], holdSlideHTTPActionShowBanner: ["up", false] });
    const trigger = { entityId: "script.night", mode: "run" };
    const server = doc({ holdSlideActions: ["up", "triggerEntity"], holdSlideTriggerTargets: ["up", trigger] });
    expect(slideKeys(merge(base, local, server))).toEqual({ holdSlideActions: ["up", "triggerEntity"], holdSlideTriggerTargets: ["up", trigger] });
    // The other way round: the panel moved it, the phone changed its target.
    const moved = doc({ holdSlideActions: ["up", "toggle"] });
    const retargeted = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", B] });
    expect(slideKeys(merge(base, moved, retargeted))).toEqual({ holdSlideActions: ["up", "toggle"] });
  });

  it("a target change alone goes with its direction; another direction's change on the other side stays", () => {
    const base = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    const local = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", B], holdSlideHTTPActionBannerSeconds: ["up", 5] });
    const server = doc({ holdSlideActions: ["left", "openControl", "up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    expect(slideKeys(merge(base, local, server))).toEqual({
      // The actions come out as the server holds them: its very array.
      holdSlideActions: ["left", "openControl", "up", "httpAction"],
      holdSlideHTTPActionBannerSeconds: ["up", 5],
      holdSlideHTTPActionTargets: ["up", B],
    });
  });

  it("both sides changed one direction's action: local's whole direction", () => {
    const base = doc({ holdSlideActions: ["down", "toggle"] });
    const local = doc({ holdSlideActions: ["down", "httpAction"], holdSlideHTTPActionTargets: ["down", A] });
    const server = doc({ holdSlideActions: ["down", "httpAction"], holdSlideHTTPActionTargets: ["down", B], holdSlideHTTPActionShowBanner: ["down", false] });
    expect(slideKeys(merge(base, local, server))).toEqual({ holdSlideActions: ["down", "httpAction"], holdSlideHTTPActionTargets: ["down", A] });
  });

  it("a key that comes out as one side holds it is that side's very array", () => {
    const base = doc({ holdSlideActions: ["down", "none", "up", "toggle"] });
    const local = doc({ holdSlideActions: ["up", "toggle", "down", "none"] });
    const server = doc({ holdSlideActions: ["down", "none", "up", "openControl"] });
    const out = merge(base, local, server);
    expect(tileOf(out).holdSlideActions).toBe(tileOf(server).holdSlideActions);
    expect(out).toBe(server);
  });

  it("with neither side moving the action, each entry is local's when local changed it", () => {
    const base = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    const local = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A], holdSlideHTTPActionShowBanner: ["up", false] });
    const server = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", B] });
    expect(slideKeys(merge(base, local, server))).toEqual({
      holdSlideActions: ["up", "httpAction"],
      holdSlideHTTPActionShowBanner: ["up", false],
      holdSlideHTTPActionTargets: ["up", B],
    });
  });

  it("a slide map that does not parse leaves the key by key result alone", () => {
    const base = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A] });
    const local = doc({ holdSlideActions: ["up", "httpAction"], holdSlideHTTPActionTargets: ["up", A], holdSlideHTTPActionShowBanner: ["up"] });
    const server = doc({ holdSlideActions: ["up", "toggle"] });
    expect(slideKeys(merge(base, local, server))).toEqual({ holdSlideActions: ["up", "toggle"], holdSlideHTTPActionShowBanner: ["up"] });
  });

  it("an entry that is null is no entry, and a direction the phone does not know goes last by name", () => {
    const base = doc({ holdSlideActions: ["up", "toggle"] });
    const local = doc({ holdSlideActions: ["up", "toggle", "zed", "none", "north", "none"] });
    const server = doc({ holdSlideActions: ["down", "none", "up", null] });
    expect(tileOf(merge(base, local, server)).holdSlideActions).toEqual(["down", "none", "north", "none", "zed", "none"]);
  });

  it("never leaves Run HTTP Action without its target, nor a target beside another action, from any sound sides", () => {
    // Every direction value a side can hold, each sound on its own.
    const units: Array<JsonObject | undefined> = [
      undefined,
      { action: "toggle" },
      { action: "none" },
      { action: "httpAction", http: A },
      { action: "httpAction", http: B },
      { action: "httpAction", http: A, banner: false },
      { action: "triggerEntity", trigger: { entityId: "script.night", mode: "run" } },
    ];
    const build = (up: JsonObject | undefined, down: JsonObject | undefined): WatchPagesDocument => {
      const keys: Record<string, unknown[]> = {};
      const add = (key: string, dir: string, value: unknown) => {
        if (value !== undefined) (keys[key] ??= []).push(dir, value);
      };
      for (const [dir, unit] of [["up", up], ["down", down]] as const) {
        add("holdSlideActions", dir, unit?.action);
        add("holdSlideHTTPActionTargets", dir, unit?.http);
        add("holdSlideHTTPActionShowBanner", dir, unit?.banner);
        add("holdSlideTriggerTargets", dir, unit?.trigger);
      }
      return doc(keys);
    };
    const pairs = (value: unknown) => {
      const m = new Map<string, unknown>();
      const list = Array.isArray(value) ? value : [];
      for (let i = 0; i < list.length; i += 2) m.set(list[i] as string, list[i + 1]);
      return m;
    };
    let runs = 0;
    for (const b of units) for (const l of units) for (const s of units) {
      // `down` holds the other side's edit to another direction.
      const out = tileOf(merge(build(b, { action: "toggle" }), build(l, { action: "toggle" }), build(s, { action: "none" })));
      const actions = pairs(out.holdSlideActions);
      const http = pairs(out.holdSlideHTTPActionTargets);
      const triggers = pairs(out.holdSlideTriggerTargets);
      for (const dir of ["up", "down"]) {
        expect(actions.get(dir) === "httpAction", `${dir} ${JSON.stringify([b, l, s])}`).toBe(http.has(dir));
        expect(actions.get(dir) === "triggerEntity", `${dir} ${JSON.stringify([b, l, s])}`).toBe(triggers.has(dir));
      }
      // Local's direction when local changed it, else the server's.
      const want = JSON.stringify(l) !== JSON.stringify(b) && (l?.action !== b?.action || s?.action === b?.action) ? l : s;
      expect(actions.get("up"), JSON.stringify([b, l, s])).toBe(want?.action);
      expect(actions.get("down")).toBe("none");
      runs++;
    }
    expect(runs).toBe(units.length ** 3);
  });
});

// ── shape check ──────────────────────────────────────────────────────────

describe("checkWatchPages", () => {
  it("passes a sound document", () => {
    expect(
      checkWatchPages({
        schemaVersion: 1,
        pages: [
          { id: "A", items: [{ id: "T", entityId: "light.a" }, { id: "U", entityId: "light.b" }] },
          { id: "B" },
          { id: "C", items: [{ id: "T", entityId: "light.a" }] },
        ],
      }),
    ).toEqual([]);
  });

  it("passes every shared fixture document", () => {
    const dir = join(__dirname, "fixtures-pages");
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      expect(checkWatchPages(JSON.parse(readFileSync(join(dir, entry.name), "utf8"))), entry.name).toEqual([]);
    }
  });

  it("refuses a document that is not an object, or has no page list", () => {
    expect(checkWatchPages(null)).toHaveLength(1);
    expect(checkWatchPages([])).toHaveLength(1);
    expect(checkWatchPages({})).toHaveLength(1);
    expect(checkWatchPages({ pages: {} })).toHaveLength(1);
  });

  it("names pages that are not objects or have no id", () => {
    const problems = checkWatchPages({ pages: [1, { name: "Home" }, { id: "" }, { id: 5 }] });
    expect(problems).toEqual([
      "Page 1 is not an object.",
      'Page 2 ("Home") has no id.',
      "Page 3 has no id.",
      "Page 4 has no id.",
    ]);
  });

  it("finds two pages with one id, whatever the case", () => {
    expect(checkWatchPages({ pages: [{ id: "ab", name: "One" }, { id: "AB" }] })).toEqual([
      'Page 2 has the same id as Page 1 ("One").',
    ]);
  });

  it("finds tiles that are not a list", () => {
    expect(checkWatchPages({ pages: [{ id: "A", items: {} }] })).toEqual(["Page 1 has tiles that are not a list."]);
    expect(checkWatchPages({ pages: [{ id: "A", items: null }] })).toEqual(["Page 1 has tiles that are not a list."]);
  });

  it("finds tiles that are not objects or lack an id or an entity", () => {
    const problems = checkWatchPages({
      pages: [{ id: "A", items: ["x", { entityId: "light.a" }, { id: "T" }, { id: "U", entityId: 3 }, { id: "V", entityId: "" }] }],
    });
    expect(problems).toEqual([
      "Page 1, tile 1 is not an object.",
      "Page 1, tile 2 has no id.",
      "Page 1, tile 3 has no entity.",
      "Page 1, tile 4 has no entity.",
      "Page 1, tile 5 has no entity.",
    ]);
  });

  it("finds two tiles with one id in a page, whatever the case", () => {
    expect(
      checkWatchPages({ pages: [{ id: "A", items: [{ id: "t", entityId: "a" }, { id: "T", entityId: "b" }] }] }),
    ).toEqual(["Page 1, tile 2 has the same id as tile 1."]);
  });
});

// ── value check ──────────────────────────────────────────────────────────

const PAGE_UUID = "6F1C1E0A-0000-4000-8000-000000000001";

describe("checkWatchPagesValues", () => {
  const withTile = (tile: JsonObject, page: JsonObject = {}) => ({
    schemaVersion: 1,
    pages: [
      {
        id: PAGE_UUID,
        name: "Home",
        ...page,
        items: [
          { id: "6F1C1E0A-0000-4000-8000-000000000002", entityId: "light.a" },
          { id: "6F1C1E0A-0000-4000-8000-000000000003", entityId: "camera.door", ...tile },
        ],
      },
    ],
  });

  it("refuses a strict enum value the watch does not know, by page, tile and key", () => {
    expect(checkWatchPagesValues(withTile({ cameraDisplayMode: "big" }))).toEqual([
      'Page 1 ("Home"), tile 2 (camera.door): cameraDisplayMode holds "big", which is not one of its choices.',
    ]);
    expect(checkWatchPagesValues(withTile({ cameraFillModes: ["fill", "zoom"] }))).toEqual([
      'Page 1 ("Home"), tile 2 (camera.door): cameraFillModes, entry 2 holds "zoom", which is not one of its choices.',
    ]);
    // A key that is not strict keeps what it does not know.
    expect(checkWatchPagesValues(withTile({ remoteButtonLayout: ["bogus"], remoteEdgeVolumeSide: "top" }))).toEqual([]);
  });

  it("checks types, colors with their empty rule, maps, slide maps and nested objects", () => {
    expect(checkWatchPagesValues(withTile({ showLabel: "yes", colSpan: 1.5, cameraRowWeights: [1, "x"] })).sort()).toEqual([
      'Page 1 ("Home"), tile 2 (camera.door): cameraRowWeights, entry 2 is not a number.',
      'Page 1 ("Home"), tile 2 (camera.door): colSpan is not a whole number.',
      'Page 1 ("Home"), tile 2 (camera.door): showLabel is not true or false.',
    ]);
    expect(checkWatchPagesValues(withTile({ remoteLauncherColors: ["", "#FF0000"], color: "yellow", borderColor: "#THEME" }))).toEqual([]);
    expect(checkWatchPagesValues(withTile({ color: "" }))).toEqual(['Page 1 ("Home"), tile 2 (camera.door): color holds the color "".']);
    expect(checkWatchPagesValues(withTile({ stateIcons: { on: 3 } }))).toEqual(['Page 1 ("Home"), tile 2 (camera.door): stateIcons for "on" is not text.']);
    expect(checkWatchPagesValues(withTile({ holdSlideActions: ["sideways", "toggle"] }))).toEqual([
      'Page 1 ("Home"), tile 2 (camera.door): holdSlideActions holds the direction "sideways".',
    ]);
    expect(checkWatchPagesValues(withTile({}, { gridDensity: "huge" }))).toEqual(['Page 1 ("Home"): gridDensity holds "huge", which is not one of its choices.']);
    expect(checkWatchPagesValues(withTile({}, { dynamicConfig: { ...FULL_DYNAMIC_CONFIG, sortOrder: "name" } }))).toEqual([
      'Page 1 ("Home"): dynamicConfig: sortOrder holds "name", which is not one of its choices.',
    ]);
    // Absent and null are left alone, and so is a key the panel does not know.
    expect(checkWatchPagesValues(withTile({ cameraDisplayMode: null, futureKey: { any: 1 } }))).toEqual([]);
  });

  it("refuses a UUID key that is not a UUID, in any case accepted", () => {
    const where = 'Page 1 ("Home"), tile 2 (camera.door)';
    expect(checkWatchPagesValues(withTile({ groupId: "not-a-uuid" }))).toEqual([`${where}: groupId holds "not-a-uuid", which is not a UUID.`]);
    expect(checkWatchPagesValues(withTile({ groupId: "6f1c1e0a-0000-4000-8000-00000000000a" }))).toEqual([]);
    expect(checkWatchPagesValues(withTile({ groupId: "6F1C1E0A00004000800000000000000A" }))).toEqual([`${where}: groupId holds "6F1C1E0A00004000800000000000000A", which is not a UUID.`]);
    expect(checkWatchPagesValues({ pages: [{ id: "home", items: [] }] })).toEqual(['Page 1: id holds "home", which is not a UUID.']);
  });

  it("refuses a music hub preset missing a key the watch needs, or with a bad id", () => {
    const where = 'Page 1 ("Home"), tile 2 (camera.door): musicHubGroupPresets, entry';
    const good = { id: "6F1C1E0A-0000-4000-8000-00000000000B", name: "All", speakerIds: ["media_player.a"] };
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [good] }))).toEqual([]);
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [good, { ...good, id: "not-a-uuid" }] }))).toEqual([
      `${where} 2: id holds "not-a-uuid", which is not a UUID.`,
    ]);
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [{ ...good, name: null }] }))).toEqual([`${where} 1: name is missing.`]);
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [{ id: good.id }] }))).toEqual([
      `${where} 1: name is missing.`,
      `${where} 1: speakerIds is missing.`,
    ]);
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [{ ...good, name: 3 }] }))).toEqual([`${where} 1: name is not text.`]);
    expect(checkWatchPagesValues(withTile({ musicHubGroupPresets: [{ ...good, speakerIds: "media_player.a" }] }))).toEqual([`${where} 1: speakerIds is not a list.`]);
  });

  it("needs all eight keys of a smart page's dynamicConfig, defaults and all", () => {
    const where = 'Page 1 ("Home"): dynamicConfig';
    expect(checkWatchPagesValues(withTile({}, { dynamicConfig: FULL_DYNAMIC_CONFIG }))).toEqual([]);
    expect(checkWatchPagesValues(withTile({}, { dynamicConfig: {} })).sort()).toEqual(
      Object.keys(FULL_DYNAMIC_CONFIG).map((key) => `${where}: ${key} is missing.`),
    );
    const { tileRowSpan: _dropped, ...missingOne } = FULL_DYNAMIC_CONFIG;
    expect(checkWatchPagesValues(withTile({}, { dynamicConfig: missingOne }))).toEqual([`${where}: tileRowSpan is missing.`]);
  });

  it("checks a smart page's rules inside its dynamicConfig", () => {
    const where = 'Page 1 ("Home"): dynamicConfig: rules, entry';
    const rule = { id: "6F1C1E0A-0000-4000-8000-00000000000C", domain: "light", mode: "all", entityIds: [], invertActive: false, header: "label" };
    const config = (rules: unknown[], extra: Record<string, unknown> = {}) => ({ dynamicConfig: { ...FULL_DYNAMIC_CONFIG, ...extra, rules } });
    expect(checkWatchPagesValues(withTile({}, config([rule])))).toEqual([]);
    // A rule without a domain, or with one that is not text.
    expect(checkWatchPagesValues(withTile({}, config([rule, { ...rule, domain: undefined }])))).toEqual([`${where} 2: domain is missing.`]);
    expect(checkWatchPagesValues(withTile({}, config([{ ...rule, domain: 3 }])))).toEqual([`${where} 1: domain is not text.`]);
    // The batch 2 checks apply inside: an enum, a UUID, a tileStyle enum.
    expect(checkWatchPagesValues(withTile({}, config([rule], { sortOrder: "byName" })))).toEqual([
      'Page 1 ("Home"): dynamicConfig: sortOrder holds "byName", which is not one of its choices.',
    ]);
    expect(checkWatchPagesValues(withTile({}, config([{ ...rule, id: "rule-1" }])))).toEqual([`${where} 1: id holds "rule-1", which is not a UUID.`]);
    expect(checkWatchPagesValues(withTile({}, config([{ ...rule, tileStyle: { borderStyle: "wavy", colSpan: 2.5 } }]))).sort()).toEqual([
      `${where} 1: tileStyle: borderStyle holds "wavy", which is not one of its choices.`,
      `${where} 1: tileStyle: colSpan is not a whole number.`,
    ]);
    expect(checkWatchPagesValues(withTile({}, config([{ ...rule, mode: "some", headerColor: "teal" }]))).sort()).toEqual([
      `${where} 1: headerColor holds the color "teal".`,
      `${where} 1: mode holds "some", which is not one of its choices.`,
    ]);
    expect(checkWatchPagesValues(withTile({}, config([{ ...rule, tileStyle: "big" }])))).toEqual([`${where} 1: tileStyle is not an object.`]);
  });

  it("holds a whole number to the watch's 32 bit Int", () => {
    const where = 'Page 1 ("Home"), tile 2 (camera.door)';
    expect(checkWatchPagesValues(withTile({ assistSpeechVolumePercent: 2 ** 31 - 1, colSpan: -(2 ** 31) }))).toEqual([]);
    expect(checkWatchPagesValues(withTile({ assistSpeechVolumePercent: 2 ** 31 }))).toEqual([`${where}: assistSpeechVolumePercent is out of range for the watch.`]);
    expect(checkWatchPagesValues(withTile({ colSpan: -(2 ** 31) - 1 }))).toEqual([`${where}: colSpan is out of range for the watch.`]);
  });

  it("passes every page, tile and add the case files hold", () => {
    const root = join(__dirname, "fixtures-pages");
    const files = [
      ...readdirSync(root).filter((f) => f.endsWith(".json")).map((f) => join(root, f)),
      ...["settings", "add"].flatMap((d) => readdirSync(join(root, d)).filter((f) => f.endsWith(".json")).map((f) => join(root, d, f))),
    ];
    const documents: unknown[] = [];
    const collect = (v: unknown): void => {
      if (Array.isArray(v)) v.forEach(collect);
      else if (v !== null && typeof v === "object") {
        const o = v as JsonObject;
        if (Array.isArray(o.pages)) documents.push(o);
        else if (Array.isArray(o.items) && typeof o.id === "string") documents.push({ pages: [o] });
        else if (typeof o.entityId === "string" && typeof o.id === "string") documents.push({ pages: [{ id: PAGE_UUID, items: [o] }] });
        Object.values(o).forEach(collect);
      }
    };
    for (const file of files) collect(JSON.parse(readFileSync(file, "utf8")));
    expect(documents.length).toBeGreaterThan(500);
    for (const d of documents) expect(checkWatchPagesValues(d)).toEqual([]);
  });
});

// ── parallel lists ───────────────────────────────────────────────────────

describe("a tile's parallel lists", () => {
  const P = "P1";
  const doc = (tile: JsonObject): WatchPagesDocument => ({ pages: [{ id: P, name: "p", items: [{ id: "G", gridRow: 0, gridCol: 0, colSpan: 12, rowSpan: 6, ...tile }] }] });
  const tileOf = (d: WatchPagesDocument) => ((d.pages as JsonObject[])[0]!.items as JsonObject[])[0]!;
  const group = (extra: JsonObject = {}): WatchPagesDocument =>
    doc({ entityId: "multicam.X", cameraGroupIds: ["camera.a", "camera.b"], cameraRowWeights: [1, 1], customLabel: "A, B", ...extra });

  it("takes a camera group's lists and columns whole from the side that changed the cameras", () => {
    // The panel detected (weights, fills and columns), the phone added a camera.
    const base = group();
    const local = group({ cameraRowWeights: [0.5625, 0.5625], cameraFillModes: ["fill", "fill"], cameraGridColumns: 2 });
    const server = group({ cameraGroupIds: ["camera.a", "camera.b", "camera.c"], cameraRowWeights: [1, 1, 1], customLabel: "A, B, C" });
    const out = tileOf(merge(base, local, server));
    expect(out.cameraGroupIds).toEqual(["camera.a", "camera.b", "camera.c"]);
    expect(out.cameraRowWeights).toEqual([1, 1, 1]);
    expect(out).not.toHaveProperty("cameraFillModes");
    expect(out).not.toHaveProperty("cameraGridColumns");
  });

  it("gives the cameras to local when both sides changed them, as a slide direction", () => {
    // The panel swapped, the phone set the first camera to Fit.
    const base = group();
    const local = group({ cameraGroupIds: ["camera.b", "camera.a"] });
    const server = group({ cameraFillModes: ["fit", "fill"], cameraFillOffsetsX: [0, 0], cameraFillOffsetsY: [0, 0] });
    const out = tileOf(merge(base, local, server));
    expect(out.cameraGroupIds).toEqual(["camera.b", "camera.a"]);
    expect(out).not.toHaveProperty("cameraFillModes");
    expect(out).not.toHaveProperty("cameraFillOffsetsX");
    const both = tileOf(merge(base, local, group({ cameraGroupIds: ["camera.a", "camera.b", "camera.c"], cameraRowWeights: [1, 1, 1] })));
    expect(both.cameraGroupIds).toEqual(["camera.b", "camera.a"]);
    expect(both.cameraRowWeights).toEqual([1, 1]);
  });

  it("keeps a removed camera's fill from moving to the next camera", () => {
    const three = { cameraGroupIds: ["camera.a", "camera.b", "camera.c"], cameraRowWeights: [1, 1, 1] };
    const base = group(three);
    const local = group({ cameraGroupIds: ["camera.b", "camera.c"], cameraRowWeights: [1, 1], customLabel: "B + C" });
    const server = group({ ...three, cameraFillModes: ["fill", "fit", "fill"] });
    const out = tileOf(merge(base, local, server));
    expect(out.cameraGroupIds).toEqual(["camera.b", "camera.c"]);
    expect(out).not.toHaveProperty("cameraFillModes");
  });

  it("turns the tile with the cameras: a group the phone made one camera stays one camera", () => {
    const base = group();
    const server = doc({ entityId: "camera.a", cameraFillMode: "fill", cameraFillOffsetX: 0, cameraFillOffsetY: 0, multiCamBorderEnabled: false, customLabel: "A" });
    // The panel added a camera to the group the phone turned into a camera:
    // local changed the cameras, so the group stays, with its kind.
    const local = group({ cameraGroupIds: ["camera.a", "camera.b", "camera.c"], cameraRowWeights: [1, 1, 1], customLabel: "A, B, C" });
    const kept = tileOf(merge(base, local, server));
    expect(kept.entityId).toBe("multicam.X");
    expect(kept.cameraGroupIds).toEqual(["camera.a", "camera.b", "camera.c"]);
    // The other way round: the phone's single camera wins whole.
    const turned = tileOf(merge(base, server, local));
    expect(turned.entityId).toBe("camera.a");
    expect(turned).not.toHaveProperty("cameraGroupIds");
    expect(turned).not.toHaveProperty("cameraRowWeights");
    // A side that only edited a cell leaves the turn to the other.
    const cell = group({ cameraFillModes: ["fit", "fill"] });
    const out = tileOf(merge(base, cell, server));
    expect(out.entityId).toBe("camera.a");
    expect(out).not.toHaveProperty("cameraGroupIds");
    expect(out).not.toHaveProperty("cameraFillModes");
  });

  it("merges a list both sides changed camera by camera when the cameras stayed", () => {
    const base = group({ cameraFillModes: ["fill", "fill"], cameraRowWeights: [1, 1] });
    const local = group({ cameraFillModes: ["fit", "fill"], cameraRowWeights: [1.2, 1] });
    const server = group({ cameraFillModes: ["fill", "fit"], cameraRowWeights: [1, 1], cameraGridColumns: 2 });
    const out = tileOf(merge(base, local, server));
    expect(out.cameraFillModes).toEqual(["fit", "fit"]);
    expect(out.cameraRowWeights).toEqual([1.2, 1]);
    expect(out.cameraGridColumns).toBe(2);
    // Lists as long as the cameras: a short side is padded, a long one cut.
    const short = tileOf(merge(base, group({ cameraFillModes: ["fit"] }), group({ cameraFillModes: ["fill", "fill", "fit"] })));
    expect(short.cameraFillModes).toEqual(["fit", "fill"]);
  });

  it("takes the quick actions whole from the side that changed the scripts", () => {
    const remote = (extra: JsonObject) => doc({ entityId: "remote.tv", ...extra });
    const two = {
      remoteLauncherScriptIds: ["script.one", "script.two"],
      remoteLauncherLabels: ["One", "Two"],
      remoteLauncherIcons: ["app.fill", "app.fill"],
      remoteLauncherColors: ["", ""],
    };
    // The panel set the first icon, the phone removed the first action.
    const base = remote(two);
    const local = remote({ ...two, remoteLauncherIcons: ["star", "app.fill"] });
    const server = remote({ remoteLauncherScriptIds: ["script.two"], remoteLauncherLabels: ["Two"], remoteLauncherIcons: ["app.fill"], remoteLauncherColors: [""] });
    const out = tileOf(merge(base, local, server));
    expect(out.remoteLauncherScriptIds).toEqual(["script.two"]);
    expect(out.remoteLauncherIcons).toEqual(["app.fill"]);
    // The panel edited a label, the phone added an action: four lists of two.
    const one = { remoteLauncherScriptIds: ["script.one"], remoteLauncherLabels: ["One"], remoteLauncherIcons: ["app.fill"], remoteLauncherColors: [""] };
    const added = tileOf(merge(remote(one), remote({ ...one, remoteLauncherLabels: ["Uno"] }), remote(two)));
    expect(added.remoteLauncherScriptIds).toEqual(["script.one", "script.two"]);
    expect(added.remoteLauncherLabels).toEqual(["One", "Two"]);
    // Neither changed the scripts: labels and icons merge by action.
    const each = tileOf(merge(base, remote({ ...two, remoteLauncherLabels: ["Uno", "Two"] }), remote({ ...two, remoteLauncherLabels: ["One", "Dos"], remoteLauncherIcons: ["app.fill", "star"] })));
    expect(each.remoteLauncherLabels).toEqual(["Uno", "Dos"]);
    expect(each.remoteLauncherIcons).toEqual(["app.fill", "star"]);
  });

  describe("a music hub's speakers and presets", () => {
    const hub = (speakers: string[], presets: JsonObject[] | undefined) =>
      doc({ entityId: "music_hub.X", musicHubSpeakerIds: speakers, ...(presets === undefined ? {} : { musicHubGroupPresets: presets }) });
    const preset = (name: string, speakerIds: string[]): JsonObject => ({ id: "11111111-2222-4333-8444-555555555555", name, speakerIds });
    const speakersOf = (t: JsonObject) => t.musicHubSpeakerIds;
    const presetsOf = (t: JsonObject) => t.musicHubGroupPresets;

    it("gives the presets to the phone when it removed a speaker and the panel renamed a preset", () => {
      const base = hub(["a", "b", "c"], [preset("Downstairs", ["a", "b"])]);
      const local = hub(["a", "b", "c"], [preset("Ground floor", ["a", "b"])]);
      const server = hub(["b", "c"], [preset("Downstairs", ["b"])]);
      const out = tileOf(merge(base, local, server));
      expect(speakersOf(out)).toEqual(["b", "c"]);
      expect(presetsOf(out)).toEqual([preset("Downstairs", ["b"])]);
    });

    it("gives the presets to the phone when it removed a speaker and the panel toggled one in", () => {
      const base = hub(["a", "b", "c"], [preset("All", ["a", "b"])]);
      const local = hub(["a", "b", "c"], [preset("All", ["a", "b", "c"])]);
      const server = hub(["a", "c"], [preset("All", ["a"])]);
      const out = tileOf(merge(base, local, server));
      expect(speakersOf(out)).toEqual(["a", "c"]);
      expect(presetsOf(out)).toEqual([preset("All", ["a"])]);
    });

    it("gives the presets to the panel when it removed a speaker and the phone toggled that one in", () => {
      const base = hub(["a", "b", "c"], [preset("All", ["a", "b"])]);
      const local = hub(["a", "b"], [preset("All", ["a", "b"])]);
      const server = hub(["a", "b", "c"], [preset("All", ["a", "b", "c"])]);
      const out = tileOf(merge(base, local, server));
      expect(speakersOf(out)).toEqual(["a", "b"]);
      expect(presetsOf(out)).toEqual([preset("All", ["a", "b"])]);
    });

    it("gives the whole unit to the panel when both sides changed the speakers", () => {
      const base = hub(["a", "b", "c"], [preset("All", ["a", "b"])]);
      const local = hub(["b", "c"], [preset("All", ["b"])]);
      const server = hub(["a", "b", "c", "d"], [preset("All", ["a", "b", "d"])]);
      const out = tileOf(merge(base, local, server));
      expect(speakersOf(out)).toEqual(["b", "c"]);
      expect(presetsOf(out)).toEqual([preset("All", ["b"])]);
      // The side that removed the last preset removes the key with it.
      const gone = tileOf(merge(base, hub(["b", "c"], undefined), local));
      expect(speakersOf(gone)).toEqual(["b", "c"]);
      expect(out).toHaveProperty("musicHubGroupPresets");
      expect(gone).not.toHaveProperty("musicHubGroupPresets");
    });

    it("merges the presets by key as before when neither side changed the speakers", () => {
      const base = hub(["a", "b", "c"], [preset("All", ["a", "b"])]);
      const local = hub(["a", "b", "c"], [preset("Ground floor", ["a", "b"])]);
      const server = doc({ entityId: "music_hub.X", musicHubSpeakerIds: ["a", "b", "c"], musicHubGroupPresets: [preset("All", ["a", "b"])], showAlbumArt: false });
      const out = tileOf(merge(base, local, server));
      expect(presetsOf(out)).toEqual([preset("Ground floor", ["a", "b"])]);
      expect(out.showAlbumArt).toBe(false);
      const theirs = tileOf(merge(base, base, local));
      expect(presetsOf(theirs)).toEqual([preset("Ground floor", ["a", "b"])]);
    });
  });

  it("hands back a side's own list when the merged one is that list", () => {
    const base = group();
    const server = group({ cameraGroupIds: ["camera.a", "camera.b", "camera.c"], cameraRowWeights: [1, 1, 1] });
    const out = merge(base, group({ name: "x" }), server);
    expect(tileOf(out).cameraGroupIds).toBe(tileOf(server).cameraGroupIds);
  });
});
