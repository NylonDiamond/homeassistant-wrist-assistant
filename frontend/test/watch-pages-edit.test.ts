// The watch page editor's edits: pages (add, delete, rename, move, hide,
// what points at a page) and tiles (drop, nudge, resize, delete, first free
// place, group repair), by the phone's rules. Every edit keeps unknown keys
// and key order, replaces only the objects on the path to the change, and
// returns the very document it was given when nothing changes.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  type WatchRect,
  WATCH_TILE_SIZE_PRESETS,
  addWatchPage,
  canNudgeWatchTile,
  canPlaceWatchTile,
  deleteWatchPage,
  deleteWatchTile,
  dropWatchTile,
  findWatchPage,
  firstFreeWatchCell,
  listedWatchPages,
  moveWatchPage,
  newWatchPage,
  newWatchPageName,
  nudgeWatchTile,
  previewWatchTileResize,
  randomWatchId,
  repairWatchTileGroups,
  resizeWatchTile,
  sameWatchId,
  setWatchPageHidden,
  setWatchPageName,
  watchDropOutcome,
  watchGroupRegions,
  watchPageLinks,
  watchResizeHandleRect,
  watchTileAtCell,
  watchTileRect,
} from "../src/watch-pages/edit.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  isSmartWatchPage,
  isSystemWatchPage,
  watchPageTiles,
  watchPagesOf,
} from "../src/watch-pages/model.js";

// ── helpers ──────────────────────────────────────────────────────────────

const P1 = "AAAAAAAA-0000-4000-8000-000000000001";
const P2 = "AAAAAAAA-0000-4000-8000-000000000002";
const P3 = "AAAAAAAA-0000-4000-8000-000000000003";
const SYS = "AAAAAAAA-0000-4000-8000-0000000000FF";
const SMART = "AAAAAAAA-0000-4000-8000-0000000000EE";
const G = "6666AAAA-0000-4000-8000-000000000001";
const H = "6666AAAA-0000-4000-8000-000000000002";

/** Ids a test can predict: NEW-0001, NEW-0002, ... in lower case, so the
 * upper casing shows. */
function counter(): () => string {
  let n = 0;
  return () => `new-${String(++n).padStart(4, "0")}`;
}

/** A tile with keys no reader knows, before and after the geometry. */
function tile(id: string, col: number, row: number, colSpan: number, rowSpan: number, extra: JsonObject = {}): JsonObject {
  return {
    zFirst: { nested: [1, { deep: true }] },
    id,
    entityId: `light.${id.toLowerCase()}`,
    gridCol: col,
    gridRow: row,
    colSpan,
    rowSpan,
    aLast: "kept",
    ...extra,
  };
}

function header(id: string, row: number): JsonObject {
  return tile(id, 0, row, 12, 1, { entityId: "divider.line.custom" });
}

function group(id: string): JsonObject {
  return {
    backgroundPattern: "hexagons",
    id,
    overlayColor: "#7CC4E8",
    overlayIntensity: 1.5,
    overlaySize: 1.25,
    overlaySpeed: 0.5,
    overlayStyle: "aurora",
    zUnknown: [1, 2],
  };
}

function page(id: string, items: JsonObject[], extra: JsonObject = {}): JsonObject {
  return { id, name: `Page ${id.slice(-1)}`, unknownPageKey: { a: 1 }, items, groups: [], isHidden: false, ...extra };
}

function doc(...pages: unknown[]): WatchPagesDocument {
  return { schemaVersion: 1, futureTopKey: [1, 2], pages };
}

function pageOf(d: WatchPagesDocument, id: string): WatchPage {
  return watchPagesOf(d).find((p) => sameWatchId(p.id, id))!;
}

function tileOf(d: WatchPagesDocument, pageId: string, tileId: string): WatchPageTile {
  return watchPageTiles(pageOf(d, pageId)).find((t) => sameWatchId(t.id, tileId))!;
}

/** Each tile as "ID col,row colSpanxrowSpan", in items order. */
function layout(d: WatchPagesDocument, pageId: string): string[] {
  return watchPageTiles(pageOf(d, pageId)).map((t) => `${String(t.id)} ${t.gridCol},${t.gridRow} ${t.colSpan}x${t.rowSpan}`);
}

/** Every tile not named, and every other page, is the very object it was;
 * a named tile that changed keeps its keys in their order. */
function onlyChanged(before: WatchPagesDocument, after: WatchPagesDocument, pageId: string, changed: string[]): void {
  expect(after).not.toBe(before);
  expect(after.futureTopKey).toBe(before.futureTopKey);
  for (const p of watchPagesOf(before)) {
    if (sameWatchId(p.id, pageId)) continue;
    expect(watchPagesOf(after)).toContain(p);
  }
  const was = watchPageTiles(pageOf(before, pageId));
  const now = watchPageTiles(pageOf(after, pageId));
  expect(pageOf(after, pageId).unknownPageKey).toBe(pageOf(before, pageId).unknownPageKey);
  for (const t of was) {
    const n = now.find((x) => sameWatchId(x.id, t.id));
    if (n === undefined) continue;
    if (changed.includes(String(t.id))) {
      expect(Object.keys(n).filter((k) => k !== "groupId")).toEqual(Object.keys(t).filter((k) => k !== "groupId"));
      expect(n.zFirst).toBe(t.zFirst);
    } else {
      expect(n).toBe(t);
      expect(JSON.stringify(n)).toBe(JSON.stringify(t));
    }
  }
}

// ── pages ────────────────────────────────────────────────────────────────

describe("new page", () => {
  const expected = {
    backgroundBrightness: 0.6,
    backgroundColor: "#000000",
    complicationDisplayMode: "text",
    fullScreen: false,
    gridDensity: "standard",
    groups: [],
    hideFromSwitcher: false,
    id: "5A17E000-0000-4000-8000-00000000000F",
    isDeletable: true,
    isHidden: false,
    isSystemPage: false,
    items: [],
    name: "New Page 1",
    pageTitleDisplayStyle: "none",
    pageTitleIcon: "house",
    pageTitleTextSize: "size10",
    themeOverride: "neonLagoon",
    useGradientColors: false,
  };

  it("carries the 18 keys the phone writes, in sorted order", () => {
    const made = newWatchPage("5a17e000-0000-4000-8000-00000000000f", "New Page 1");
    expect(made).toEqual(expected);
    expect(Object.keys(made)).toEqual(Object.keys(expected));
    expect(Object.keys(made)).toHaveLength(18);
  });

  it("does not share its arrays between pages", () => {
    const a = newWatchPage(P1, "a");
    const b = newWatchPage(P2, "b");
    expect(a.items).not.toBe(b.items);
    expect(a.groups).not.toBe(b.groups);
  });

  const fixture = join(__dirname, "fixtures-pages", "06-new-page.json");
  it.runIf(existsSync(fixture))("is the phone's own encoding of a new page, to the byte", () => {
    const phone = (JSON.parse(readFileSync(fixture, "utf8")) as { pages: JsonObject[] }).pages[0]!;
    const made = newWatchPage(String(phone.id), String(phone.name));
    expect(made).toEqual(phone);
    expect(JSON.stringify(made)).toBe(JSON.stringify(phone));
  });
});

describe("add page", () => {
  it("numbers the name after the highest New Page among listed pages", () => {
    expect(newWatchPageName(doc())).toBe("New Page 1");
    expect(newWatchPageName(doc(page(P1, [], { name: "New Page" })))).toBe("New Page 2");
    expect(
      newWatchPageName(
        doc(
          page(P1, [], { name: "New Page 4" }),
          page(P2, [], { name: "New Page x" }),
          page(P3, [], { name: "New Page" }),
          page(SYS, [], { name: "New Page 9", isSystemPage: true }),
          page(SMART, [], { name: "new page 7" }),
        ),
      ),
    ).toBe("New Page 5");
    expect(newWatchPageName(doc(page(P1, [], { name: "New Page 3 " }), page(P2, [], { name: "Kitchen" })))).toBe(
      "New Page 1",
    );
  });

  it("makes ids without crypto.randomUUID, which plain http does not have", () => {
    const real = Object.getOwnPropertyDescriptor(globalThis, "crypto")!;
    const secure = globalThis.crypto;
    const plain = { getRandomValues: (a: Uint8Array<ArrayBuffer>) => secure.getRandomValues(a) };
    Object.defineProperty(globalThis, "crypto", { value: plain, configurable: true });
    try {
      const v4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      const a = randomWatchId();
      const b = randomWatchId();
      expect(a).toMatch(v4);
      expect(b).toMatch(v4);
      expect(a).not.toBe(b);
      const pages = addWatchPage(doc(page(P1, [])), {}).pages as JsonObject[];
      expect(pages[1]!.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
    } finally {
      Object.defineProperty(globalThis, "crypto", real);
    }
  });

  it("appends after every page, system pages included, with an upper case id", () => {
    const before = doc(page(P1, []), page(SYS, [], { isSystemPage: true }));
    const after = addWatchPage(before, { newId: counter() });
    const pages = after.pages as JsonObject[];
    expect(pages).toHaveLength(3);
    expect(pages[0]).toBe((before.pages as unknown[])[0]);
    expect(pages[1]).toBe((before.pages as unknown[])[1]);
    expect(pages[2]!.id).toBe("NEW-0001");
    expect(pages[2]!.name).toBe("New Page 1");
    expect(after.futureTopKey).toBe(before.futureTopKey);
    expect(listedWatchPages(after).at(-1)).toBe(pages[2]);
  });

  it("uses an upper case random id by default", () => {
    const after = addWatchPage(doc());
    const id = String((after.pages as JsonObject[])[0]!.id);
    expect(id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/);
  });
});

describe("delete page", () => {
  function linked(): WatchPagesDocument {
    return doc(
      page(P1, [tile("T1", 0, 0, 4, 2)]),
      page(P2, [
        tile("L1", 0, 0, 4, 2, { entityId: `page.${P1.toLowerCase()}`, groupId: G }),
        tile("L2", 4, 0, 4, 2, { groupId: G }),
        tile("L3", 0, 2, 4, 2, { entityId: `show_page.${P1}` }),
        tile("K", 4, 2, 4, 2, { entityId: `status_page.${P1}` }),
      ], { groups: [group(G)] }),
      page(P3, [tile("M", 0, 0, 4, 2)]),
      page(SYS, [tile("S", 0, 0, 4, 2, { entityId: `page.${P1}` })], { isSystemPage: true }),
      page(SMART, [tile("Q", 0, 0, 4, 2, { entityId: `page.${P1}` })], { dynamicConfig: { rules: [] } }),
    );
  }

  it("removes only the page by default", () => {
    const before = linked();
    const after = deleteWatchPage(before, P1.toLowerCase());
    const pages = after.pages as unknown[];
    expect(pages).toHaveLength(4);
    expect(pages).toEqual((before.pages as unknown[]).slice(1));
    for (const p of pages) expect((before.pages as unknown[]).includes(p)).toBe(true);
  });

  it("can also remove the tiles that open it, then repair their groups", () => {
    const before = linked();
    const after = deleteWatchPage(before, P1, { removeLinks: true });
    expect(layout(after, P2)).toEqual(["L2 4,0 4x2", "K 4,2 4x2"]);
    const p2 = pageOf(after, P2);
    expect(p2.groups).toEqual([]);
    expect("groupId" in tileOf(after, P2, "L2")).toBe(false);
    expect(tileOf(after, P2, "K")).toBe(tileOf(before, P2, "K"));
    expect(pageOf(after, P3)).toBe(pageOf(before, P3));
    expect(pageOf(after, SYS)).toBe(pageOf(before, SYS));
    expect(pageOf(after, SMART)).toBe(pageOf(before, SMART));
  });

  it("never deletes a system page, and an unknown id changes nothing", () => {
    const before = linked();
    expect(deleteWatchPage(before, SYS)).toBe(before);
    expect(deleteWatchPage(before, "nope")).toBe(before);
  });
});

describe("rename, hide, move", () => {
  const before = doc(
    page(P1, []),
    page(SYS, [], { isSystemPage: true }),
    page(P2, [], { isHidden: undefined }),
    page(P3, []),
  );

  it("renames to the trimmed name and refuses a blank one", () => {
    const after = setWatchPageName(before, P1.toLowerCase(), "  Kitchen ");
    expect(pageOf(after, P1).name).toBe("Kitchen");
    expect(Object.keys(pageOf(after, P1))).toEqual(Object.keys(pageOf(before, P1)));
    expect(pageOf(after, P1).items).toBe(pageOf(before, P1).items);
    expect(setWatchPageName(before, P1, "   ")).toBe(before);
    expect(setWatchPageName(before, P1, "Page 1")).toBe(before);
    expect(setWatchPageName(before, SYS, "Nope")).toBe(before);
  });

  it("hides and shows; the same state changes nothing", () => {
    const hidden = setWatchPageHidden(before, P1, true);
    expect(pageOf(hidden, P1).isHidden).toBe(true);
    expect(setWatchPageHidden(hidden, P1, true)).toBe(hidden);
    expect(setWatchPageHidden(before, P1, false)).toBe(before);
    const noKey = doc({ id: P1, name: "x" });
    expect(setWatchPageHidden(noKey, P1, false)).toBe(noKey);
    expect(Object.keys(pageOf(setWatchPageHidden(noKey, P1, true), P1))).toEqual(["id", "name", "isHidden"]);
    expect(setWatchPageHidden(before, SYS, true)).toBe(before);
  });

  it("moves among listed pages while a system page keeps its slot", () => {
    const order = (d: WatchPagesDocument) => watchPagesOf(d).map((p) => String(p.id).slice(-2));
    expect(order(moveWatchPage(before, P3, 0))).toEqual(["03", "FF", "01", "02"]);
    expect(order(moveWatchPage(before, P1, 2))).toEqual(["02", "FF", "03", "01"]);
    expect(order(moveWatchPage(before, P1, 99))).toEqual(["02", "FF", "03", "01"]);
    expect(order(moveWatchPage(before, P2, 0))).toEqual(["02", "FF", "01", "03"]);
    expect(moveWatchPage(before, P2, 1)).toBe(before);
    expect(moveWatchPage(before, SYS, 0)).toBe(before);
    const moved = moveWatchPage(before, P3, 0);
    for (const p of watchPagesOf(moved)) expect(watchPagesOf(before)).toContain(p);
    expect(listedWatchPages(moved).map((p) => p.id)).toEqual([P3, P1, P2]);
    expect(findWatchPage(moved, SYS)).toBeUndefined();
  });
});

describe("what points at a page", () => {
  it("lists the link tiles on other pages and the room settings", () => {
    const d = doc(
      page(P1, [tile("SELF", 0, 0, 2, 2, { entityId: `page.${P1}` })], { name: "Target" }),
      page(P2, [
        tile("A", 0, 0, 2, 2, { entityId: `page.${P1.toLowerCase()}` }),
        tile("B", 2, 0, 2, 2, { entityId: `show_page.${P1}` }),
        tile("C", 4, 0, 2, 2, { entityId: `status_page.${P1}` }),
        tile("D", 6, 0, 2, 2, { entityId: `page.${P3}` }),
      ], { name: "Hub" }),
    );
    const links = watchPageLinks(d, P1, {
      roomQuickJumpFallbackPageId: ` ${P1.toLowerCase()} `,
      roomQuickJumpMappings: { kitchen: P1, office: P3, garage: P1.toLowerCase() },
      unrelated: P1,
    });
    expect(links).toEqual({
      tiles: [
        { pageId: P2, pageName: "Hub", tileId: "A", kind: "page" },
        { pageId: P2, pageName: "Hub", tileId: "B", kind: "show_page" },
      ],
      roomFallback: true,
      roomMappingKeys: ["kitchen", "garage"],
    });
    expect(watchPageLinks(d, P3, {})).toEqual({
      tiles: [{ pageId: P2, pageName: "Hub", tileId: "D", kind: "page" }],
      roomFallback: false,
      roomMappingKeys: [],
    });
  });
});

// ── tile queries ─────────────────────────────────────────────────────────

describe("placement", () => {
  const p = page(P1, [tile("A", 0, 0, 4, 3), tile("B", 4, 0, 4, 3)]);

  it("checks bounds and every cell", () => {
    expect(canPlaceWatchTile(p, { col: 8, row: 0, colSpan: 4, rowSpan: 3 })).toBe(true);
    expect(canPlaceWatchTile(p, { col: 9, row: 0, colSpan: 4, rowSpan: 3 })).toBe(false);
    expect(canPlaceWatchTile(p, { col: 3, row: 0, colSpan: 2, rowSpan: 1 })).toBe(false);
    expect(canPlaceWatchTile(p, { col: 3, row: 0, colSpan: 2, rowSpan: 1 }, ["a", "b"])).toBe(true);
    expect(canPlaceWatchTile(p, { col: 0, row: -1, colSpan: 2, rowSpan: 1 })).toBe(false);
    expect(canPlaceWatchTile(p, { col: 0, row: 3, colSpan: 12, rowSpan: 500 })).toBe(true);
    expect(canPlaceWatchTile(p, { col: 0.5, row: 3, colSpan: 2, rowSpan: 1 })).toBe(false);
  });

  it("finds the tile on a cell and the first free place", () => {
    expect(watchTileAtCell(p, { row: 2, col: 5 })?.id).toBe("B");
    expect(watchTileAtCell(p, { row: 3, col: 5 })).toBeUndefined();
    const q = page(P1, [tile("A", 0, 0, 6, 2), tile("B", 6, 0, 6, 1)]);
    expect(firstFreeWatchCell(q, 4, 1)).toEqual({ row: 1, col: 6 });
    expect(firstFreeWatchCell(q, 12, 1)).toEqual({ row: 2, col: 0 });
    expect(firstFreeWatchCell(q, 99, 0)).toEqual({ row: 2, col: 0 });
    expect(firstFreeWatchCell(page(P1, []), 6, 4)).toEqual({ row: 0, col: 0 });
  });

  it("reads stored geometry the way the phone loads it", () => {
    expect(watchTileRect({ gridCol: 11, gridRow: -2, colSpan: 14, rowSpan: 0 })).toEqual({
      col: 0,
      row: 0,
      colSpan: 12,
      rowSpan: 1,
    });
    expect(watchTileRect({ gridCol: 2.7, colSpan: 3 })).toEqual({ col: 2, row: 0, colSpan: 3, rowSpan: 1 });
  });
});

// ── drop ─────────────────────────────────────────────────────────────────

describe("drop", () => {
  const base = doc(page(P1, [tile("A", 0, 0, 4, 3), tile("B", 4, 0, 4, 3), tile("C", 0, 3, 12, 1)]), page(P2, []));
  const p1 = () => pageOf(base, P1);

  it("moves to a free cell and nothing else moves", () => {
    expect(watchDropOutcome(p1(), "A", { row: 4, col: 0 })).toEqual({ kind: "move", cell: { row: 4, col: 0 } });
    const after = dropWatchTile(base, P1, "a", { row: 4, col: 0 });
    expect(layout(after, P1)).toEqual(["A 0,4 4x3", "B 4,0 4x3", "C 0,3 12x1"]);
    onlyChanged(base, after, P1, ["A"]);
  });

  it("clamps the target cell into the grid", () => {
    expect(watchDropOutcome(p1(), "A", { row: -3, col: 11 })).toEqual({ kind: "move", cell: { row: 0, col: 8 } });
  });

  it("refuses a cell the tile does not fit", () => {
    expect(watchDropOutcome(p1(), "A", { row: 2, col: 0 })).toEqual({ kind: "none", cell: { row: 2, col: 0 } });
    expect(dropWatchTile(base, P1, "A", { row: 2, col: 0 })).toBe(base);
  });

  it("does nothing on its own place", () => {
    expect(watchDropOutcome(p1(), "A", { row: 0, col: 0 }).kind).toBe("same");
    expect(dropWatchTile(base, P1, "A", { row: 0, col: 0 })).toBe(base);
  });

  it("swaps with the tile under the pointer, both ways", () => {
    expect(watchDropOutcome(p1(), "A", { row: 9, col: 9 }, "b")).toEqual({
      kind: "swap",
      cell: { row: 0, col: 4 },
      targetId: "B",
      targetCell: { row: 0, col: 0 },
    });
    const ab = dropWatchTile(base, P1, "A", { row: 9, col: 9 }, "B");
    expect(layout(ab, P1)).toEqual(["A 4,0 4x3", "B 0,0 4x3", "C 0,3 12x1"]);
    onlyChanged(base, ab, P1, ["A", "B"]);
    const ba = dropWatchTile(base, P1, "B", { row: 0, col: 0 });
    expect(layout(ba, P1)).toEqual(["A 4,0 4x3", "B 0,0 4x3", "C 0,3 12x1"]);
  });

  it("swaps with the tile that holds the target cell", () => {
    expect(watchDropOutcome(p1(), "A", { row: 1, col: 5 })).toMatchObject({ kind: "swap", cell: { row: 0, col: 4 } });
  });

  it("finds the target a new place when it does not fit the source's old one", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 3), tile("W", 4, 0, 8, 3)]));
    expect(watchDropOutcome(pageOf(d, P1), "A", { row: 0, col: 4 }, "W")).toEqual({
      kind: "swap",
      cell: { row: 0, col: 4 },
      targetId: "W",
      targetCell: { row: 3, col: 0 },
    });
    expect(layout(dropWatchTile(d, P1, "A", { row: 0, col: 4 }, "W"), P1)).toEqual(["A 4,0 4x3", "W 0,3 8x3"]);
  });

  it("refuses a swap the source does not fit, and moves nothing", () => {
    const d = doc(page(P1, [tile("X", 0, 0, 6, 3), tile("Y", 6, 0, 4, 3), tile("Z", 10, 0, 2, 3)]));
    expect(watchDropOutcome(pageOf(d, P1), "X", { row: 0, col: 6 }, "Y")).toEqual({
      kind: "none",
      cell: { row: 0, col: 6 },
    });
    expect(dropWatchTile(d, P1, "X", { row: 0, col: 6 }, "Y")).toBe(d);
  });

  it("writes all four keys for a tile whose stored geometry was not whole", () => {
    const odd = { id: "N", entityId: "light.n", gridCol: 2.7, colSpan: 3, rowSpan: 2, extra: true };
    const d = doc(page(P1, [odd]));
    const after = dropWatchTile(d, P1, "N", { row: 1, col: 5 });
    expect(tileOf(after, P1, "N")).toEqual({ ...odd, gridCol: 5, gridRow: 1 });
    expect(Object.keys(tileOf(after, P1, "N"))).toEqual(["id", "entityId", "gridCol", "colSpan", "rowSpan", "extra", "gridRow"]);
  });
});

// ── nudge ────────────────────────────────────────────────────────────────

describe("nudge", () => {
  it("moves one cell when free", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 3), tile("B", 8, 0, 4, 3)]));
    const after = nudgeWatchTile(d, P1, "A", "right");
    expect(layout(after, P1)).toEqual(["A 1,0 4x3", "B 8,0 4x3"]);
    onlyChanged(d, after, P1, ["A"]);
    expect(nudgeWatchTile(d, P1, "A", "left")).toBe(d);
    expect(nudgeWatchTile(d, P1, "A", "up")).toBe(d);
    expect(canNudgeWatchTile(d, P1, "A", "up")).toBe(false);
    expect(canNudgeWatchTile(d, P1, "A", "down")).toBe(true);
  });

  it("swaps with the one tile in the way", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 3), tile("B", 4, 0, 4, 3)]));
    expect(layout(nudgeWatchTile(d, P1, "A", "right"), P1)).toEqual(["A 4,0 4x3", "B 0,0 4x3"]);
  });

  it("refuses when two tiles are in the way", () => {
    const d = doc(page(P1, [tile("T", 2, 0, 4, 1), tile("B1", 0, 1, 3, 2), tile("B2", 3, 1, 3, 2)]));
    expect(nudgeWatchTile(d, P1, "T", "down")).toBe(d);
  });

  it("stops at row 200", () => {
    const at = (row: number) => doc(page(P1, [tile("A", 0, row, 4, 4)]));
    const d = at(196);
    expect(nudgeWatchTile(d, P1, "A", "down")).toBe(d);
    expect(layout(nudgeWatchTile(at(195), P1, "A", "down"), P1)).toEqual(["A 0,196 4x4"]);
  });

  it("pushes a full width header in above the tiles over it", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 6, 2), tile("B", 6, 0, 6, 3), header("H", 3), tile("C", 0, 4, 6, 2)]));
    const after = nudgeWatchTile(d, P1, "H", "up");
    expect(layout(after, P1)).toEqual(["A 0,1 6x2", "B 6,1 6x3", "H 0,0 12x1", "C 0,4 6x2"]);
    onlyChanged(d, after, P1, ["A", "B", "H"]);
    const top = doc(page(P1, [header("H", 0), tile("A", 0, 1, 6, 2)]));
    expect(nudgeWatchTile(top, P1, "H", "up")).toBe(top);
    expect(nudgeWatchTile(top, P1, "H", "left")).toBe(top);
  });

  it("pushes a full width header in below the tiles under it", () => {
    const d = doc(page(P1, [header("H", 0), tile("A", 0, 1, 6, 2), tile("B", 6, 1, 6, 3), tile("C", 0, 5, 6, 2)]));
    const after = nudgeWatchTile(d, P1, "H", "down");
    expect(layout(after, P1)).toEqual(["H 0,3 12x1", "A 0,0 6x2", "B 6,0 6x3", "C 0,5 6x2"]);
    const bottom = doc(page(P1, [tile("A", 0, 0, 6, 2), header("H", 2)]));
    expect(nudgeWatchTile(bottom, P1, "H", "down")).toBe(bottom);
  });

  it("moves a header that is not full width one cell, like any tile", () => {
    const d = doc(page(P1, [tile("H", 0, 2, 6, 1, { entityId: "divider.line.custom" }), tile("A", 0, 0, 6, 2)]));
    expect(layout(nudgeWatchTile(d, P1, "H", "down"), P1)).toEqual(["H 0,3 6x1", "A 0,0 6x2"]);
  });
});

// ── resize ───────────────────────────────────────────────────────────────

describe("resize", () => {
  const base = doc(
    page(P1, [tile("A", 0, 0, 6, 2), tile("B", 0, 2, 6, 2), tile("C", 0, 4, 6, 2), tile("D", 6, 0, 6, 2)]),
    page(P2, []),
  );

  it("pushes the tiles below down, cascading", () => {
    const preview = previewWatchTileResize(pageOf(base, P1), "A", { col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    expect(preview.overlaps).toBe(false);
    expect(preview.rect).toEqual({ col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    const after = resizeWatchTile(base, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    expect(layout(after, P1)).toEqual(["A 0,0 6x4", "B 0,4 6x2", "C 0,6 6x2", "D 6,0 6x2"]);
    expect(pageOf(after, P1)).toEqual(preview.page);
    onlyChanged(base, after, P1, ["A", "B", "C"]);
  });

  it("brings the pushed tiles back when shrinking from the same baseline", () => {
    const baseline = pageOf(base, P1);
    const grown = resizeWatchTile(base, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    const preview = previewWatchTileResize(pageOf(grown, P1), "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, baseline);
    expect(JSON.stringify(preview.page)).toBe(JSON.stringify(baseline));
    const shrunk = resizeWatchTile(grown, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, { baseline });
    expect(JSON.stringify(shrunk)).toBe(JSON.stringify(base));
    const noBaseline = resizeWatchTile(grown, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 });
    expect(layout(noBaseline, P1)).toEqual(["A 0,0 6x2", "B 0,4 6x2", "C 0,6 6x2", "D 6,0 6x2"]);
  });

  it("shifts a tile left when it would pass the right edge", () => {
    const d = doc(page(P1, [tile("T", 8, 0, 4, 2)]));
    const after = resizeWatchTile(d, P1, "T", { col: 8, row: 0, colSpan: 6, rowSpan: 2 });
    expect(layout(after, P1)).toEqual(["T 6,0 6x2"]);
    expect(layout(resizeWatchTile(d, P1, "T", { col: 8, row: 0, colSpan: 40, rowSpan: 2 }), P1)).toEqual(["T 0,0 12x2"]);
  });

  it("never pushes a tile that starts above, and flags and refuses the overlap", () => {
    const d = doc(page(P1, [tile("U", 0, 0, 4, 4), tile("V", 4, 2, 4, 2)]));
    const rect = { col: 2, row: 2, colSpan: 6, rowSpan: 2 };
    const preview = previewWatchTileResize(pageOf(d, P1), "V", rect);
    expect(preview.overlaps).toBe(true);
    expect(watchPageTiles(preview.page).map((t) => t.gridRow)).toEqual([0, 2]);
    expect(resizeWatchTile(d, P1, "V", rect)).toBe(d);
  });

  it("changes nothing for the size a tile already has", () => {
    expect(resizeWatchTile(base, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 })).toBe(base);
    expect(resizeWatchTile(base, P1, "A", { col: Number.NaN, row: 0, colSpan: 6, rowSpan: 2 })).toBe(base);
  });

  it("takes the phone's presets", () => {
    expect(WATCH_TILE_SIZE_PRESETS.map((p) => `${p.colSpan}x${p.rowSpan}`)).toEqual(["3x3", "4x4", "6x4", "12x4"]);
  });

  describe("handles", () => {
    const start: WatchRect = { col: 2, row: 3, colSpan: 4, rowSpan: 2 };
    const at = (handle: Parameters<typeof watchResizeHandleRect>[1], cols: number, rows: number) =>
      watchResizeHandleRect(start, handle, { cols, rows });

    it("right and bottom change the span, never below 1", () => {
      expect(at("right", 2, 9)).toEqual({ col: 2, row: 3, colSpan: 6, rowSpan: 2 });
      expect(at("right", -10, 0)).toEqual({ col: 2, row: 3, colSpan: 1, rowSpan: 2 });
      expect(at("right", 7, 0)).toBeUndefined();
      expect(at("bottom", 9, 3)).toEqual({ col: 2, row: 3, colSpan: 4, rowSpan: 5 });
      expect(at("bottom", 0, -5)).toEqual({ col: 2, row: 3, colSpan: 4, rowSpan: 1 });
    });

    it("left and top move the origin, stop at 0, and slide past the far edge", () => {
      expect(at("left", -1, 0)).toEqual({ col: 1, row: 3, colSpan: 5, rowSpan: 2 });
      expect(at("left", -5, 0)).toEqual({ col: 0, row: 3, colSpan: 6, rowSpan: 2 });
      expect(at("left", 3, 0)).toEqual({ col: 5, row: 3, colSpan: 1, rowSpan: 2 });
      expect(at("left", 6, 0)).toEqual({ col: 8, row: 3, colSpan: 1, rowSpan: 2 });
      expect(at("left", 10, 0)).toBeUndefined();
      expect(at("top", 0, -1)).toEqual({ col: 2, row: 2, colSpan: 4, rowSpan: 3 });
      expect(at("top", 0, -5)).toEqual({ col: 2, row: 0, colSpan: 4, rowSpan: 5 });
      expect(at("top", 0, 4)).toEqual({ col: 2, row: 7, colSpan: 4, rowSpan: 1 });
    });

    it("the corner is right and bottom together, rounding halves away from zero", () => {
      expect(at("bottomRight", 2, 1)).toEqual({ col: 2, row: 3, colSpan: 6, rowSpan: 3 });
      expect(at("bottomRight", 0.5, -0.5)).toEqual({ col: 2, row: 3, colSpan: 5, rowSpan: 1 });
      expect(at("bottomRight", 0.4, 0.4)).toEqual(start);
    });
  });
});

// ── delete and groups ────────────────────────────────────────────────────

describe("delete tile and groups", () => {
  /** Tiles of 2 by 2 in one row, each in group G. */
  function row(count: number, groups: JsonObject[] = [group(G)]): WatchPagesDocument {
    const items = Array.from({ length: count }, (_, i) => tile(`T${i + 1}`, i * 2, 0, 2, 2, { groupId: i === 0 ? G.toLowerCase() : G }));
    return doc(page(P1, items, { groups }), page(P2, []));
  }
  const groupIds = (d: WatchPagesDocument) => watchPageTiles(pageOf(d, P1)).map((t) => (t.groupId as string | undefined) ?? "-");

  it("removes the tile and closes no gap", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 2), tile("B", 0, 2, 4, 2), tile("C", 0, 4, 4, 2)]));
    const after = deleteWatchTile(d, P1, "b");
    expect(layout(after, P1)).toEqual(["A 0,0 4x2", "C 0,4 4x2"]);
    onlyChanged(d, after, P1, []);
    expect(pageOf(after, P1).groups).toBe(pageOf(d, P1).groups);
    expect(deleteWatchTile(d, P1, "nope")).toBe(d);
  });

  it("keeps a group that is still one region", () => {
    const d = row(3);
    const after = nudgeWatchTile(d, P1, "T3", "down");
    expect(layout(after, P1)[2]).toBe("T3 4,1 2x2");
    expect(groupIds(after)).toEqual([G.toLowerCase(), G, G]);
    expect(pageOf(after, P1).groups).toBe(pageOf(d, P1).groups);
  });

  it("dissolves a group left with one tile", () => {
    const after = deleteWatchTile(row(2), P1, "T2");
    expect("groupId" in tileOf(after, P1, "T1")).toBe(false);
    expect(Object.keys(tileOf(after, P1, "T1"))).toEqual(Object.keys(tile("x", 0, 0, 1, 1)));
    expect(pageOf(after, P1).groups).toEqual([]);
  });

  it("dissolves a group whose tiles no longer touch", () => {
    const after = deleteWatchTile(row(3), P1, "T2");
    expect(groupIds(after)).toEqual(["-", "-"]);
    expect(pageOf(after, P1).groups).toEqual([]);
  });

  it("drops a lone tile from a group that keeps one region", () => {
    const d = row(4);
    const after = deleteWatchTile(d, P1, "T2");
    expect(groupIds(after)).toEqual(["-", G, G]);
    expect(pageOf(after, P1).groups).toBe(pageOf(d, P1).groups);
    expect(tileOf(after, P1, "T3")).toBe(tileOf(d, P1, "T3"));
  });

  it("splits a group into two, the second a copy with a new id", () => {
    const d = row(5);
    const after = deleteWatchTile(d, P1, "T3", { newId: counter() });
    expect(groupIds(after)).toEqual([G.toLowerCase(), G, "NEW-0001", "NEW-0001"]);
    const groups = pageOf(after, P1).groups as JsonObject[];
    expect(groups).toHaveLength(2);
    expect(groups[0]).toBe((pageOf(d, P1).groups as JsonObject[])[0]);
    expect(groups[1]).toEqual({ ...group(G), id: "NEW-0001" });
    expect(Object.keys(groups[1]!)).toEqual(Object.keys(group(G)));
    expect(Object.keys(tileOf(after, P1, "T4"))).toEqual(Object.keys(tileOf(d, P1, "T4")));
  });

  it("removes a group no tile is in any more", () => {
    const d = doc(page(P1, [tile("X", 0, 0, 2, 2, { groupId: H }), tile("Y", 4, 0, 2, 2)], { groups: [group(G), group(H)] }));
    const after = deleteWatchTile(d, P1, "X");
    expect((pageOf(after, P1).groups as JsonObject[]).map((g) => g.id)).toEqual([G]);
    const repaired = repairWatchTileGroups(d, P1, [G.toLowerCase()]);
    expect((pageOf(repaired, P1).groups as JsonObject[]).map((g) => g.id)).toEqual([H]);
    expect(repairWatchTileGroups(row(3), P1, [G])).toEqual(row(3));
    const valid = row(3);
    expect(repairWatchTileGroups(valid, P1, [G])).toBe(valid);
  });

  it("repairs groups after a drop and a swap", () => {
    const d = row(3);
    const moved = dropWatchTile(d, P1, "T3", { row: 5, col: 0 });
    expect(groupIds(moved)).toEqual([G.toLowerCase(), G, "-"]);
    const swapped = dropWatchTile(d, P1, "T1", { row: 0, col: 4 }, "T3");
    expect(layout(swapped, P1)).toEqual(["T1 4,0 2x2", "T2 2,0 2x2", "T3 0,0 2x2"]);
    expect(pageOf(swapped, P1).groups).toBe(pageOf(d, P1).groups);
  });
});

// ── smart and system pages ───────────────────────────────────────────────

describe("pages without tile edits", () => {
  const d = doc(
    page(SMART, [tile("A", 0, 0, 4, 2), tile("B", 4, 0, 4, 2)], { dynamicConfig: { rules: [] } }),
    page(SYS, [tile("C", 0, 0, 4, 2)], { isSystemPage: true }),
  );

  it("return the document unchanged", () => {
    for (const [pageId, tileId] of [
      [SMART, "A"],
      [SYS, "C"],
    ] as const) {
      expect(dropWatchTile(d, pageId, tileId, { row: 5, col: 0 })).toBe(d);
      expect(nudgeWatchTile(d, pageId, tileId, "down")).toBe(d);
      expect(resizeWatchTile(d, pageId, tileId, { col: 0, row: 0, colSpan: 4, rowSpan: 6 })).toBe(d);
      expect(deleteWatchTile(d, pageId, tileId)).toBe(d);
      expect(canNudgeWatchTile(d, pageId, tileId, "down")).toBe(false);
      expect(watchDropOutcome(pageOf(d, pageId), tileId, { row: 5, col: 0 }).kind).toBe("none");
      const p = pageOf(d, pageId);
      expect(previewWatchTileResize(p, tileId, { col: 0, row: 0, colSpan: 4, rowSpan: 6 }).page).toBe(p);
    }
    expect(listedWatchPages(d).map((p) => p.id)).toEqual([SMART]);
  });
});

// ── the real documents ───────────────────────────────────────────────────

describe("every edit on the shared fixtures", () => {
  const dir = join(__dirname, "fixtures-pages");
  const files = existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name).sort()
    : [];

  /** Every tile still has every key it had (a cleared `groupId` aside), its
   * geometry is whole and inside the grid when it changed, and the document
   * is plain JSON. */
  function decodable(before: WatchPagesDocument, after: WatchPagesDocument, pageId: string): void {
    expect(JSON.parse(JSON.stringify(after))).toEqual(after);
    const was = watchPageTiles(pageOf(before, pageId));
    for (const t of watchPageTiles(pageOf(after, pageId))) {
      const old = was.find((x) => x.id === t.id)!;
      expect(old).toBeDefined();
      for (const key of Object.keys(old)) if (key !== "groupId") expect(key in t).toBe(true);
      if (t === old) continue;
      const g = [t.gridCol, t.gridRow, t.colSpan, t.rowSpan] as number[];
      expect(g.every(Number.isInteger)).toBe(true);
      expect(g[2]! >= 1 && g[2]! <= 12 && g[0]! >= 0 && g[0]! <= 12 - g[2]! && g[3]! >= 1 && g[1]! >= 0).toBe(true);
    }
    for (const p of watchPagesOf(before)) if (!sameWatchId(p.id, pageId)) expect(watchPagesOf(after)).toContain(p);
  }

  for (const file of files) {
    it(file, () => {
      const d = JSON.parse(readFileSync(join(dir, file), "utf8")) as WatchPagesDocument;
      let edits = 0;
      for (const p of watchPagesOf(d)) {
        const pageId = String(p.id);
        if (isSystemWatchPage(p) || isSmartWatchPage(p)) {
          const first = watchPageTiles(p)[0];
          if (first !== undefined) expect(deleteWatchTile(d, pageId, String(first.id))).toBe(d);
          continue;
        }
        for (const t of watchPageTiles(p)) {
          const tileId = String(t.id);
          const r = watchTileRect(t);
          const free = firstFreeWatchCell(p, r.colSpan, r.rowSpan);
          const results = [
            nudgeWatchTile(d, pageId, tileId, "up"),
            nudgeWatchTile(d, pageId, tileId, "down"),
            nudgeWatchTile(d, pageId, tileId, "left"),
            nudgeWatchTile(d, pageId, tileId, "right"),
            dropWatchTile(d, pageId, tileId, free),
            resizeWatchTile(d, pageId, tileId, { ...r, colSpan: 12, rowSpan: 4 }),
            resizeWatchTile(d, pageId, tileId, watchResizeHandleRect(r, "bottomRight", { cols: 1, rows: 2 }) ?? r),
            deleteWatchTile(d, pageId, tileId),
          ];
          for (const after of results) {
            if (after === d) continue;
            edits += 1;
            decodable(d, after, pageId);
          }
          expect(JSON.stringify(dropWatchTile(d, pageId, tileId, { row: r.row, col: r.col }))).toBe(JSON.stringify(d));
        }
        for (const after of [setWatchPageName(d, pageId, "Renamed"), setWatchPageHidden(d, pageId, true), deleteWatchPage(d, pageId, { removeLinks: true })]) {
          expect(JSON.parse(JSON.stringify(after))).toEqual(after);
        }
      }
      const added = addWatchPage(d);
      expect(Object.keys(listedWatchPages(added).at(-1)!)).toHaveLength(18);
      const hasTiles = watchPagesOf(d).some((p) => !isSmartWatchPage(p) && watchPageTiles(p).length > 0);
      expect(edits > 0).toBe(hasTiles);
    });
  }
});

// ── the last row ─────────────────────────────────────────────────────────

describe("the page ends at row 200", () => {
  it("refuses a resize, a drop or a handle that would end past it", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 2), tile("B", 4, 0, 4, 2)]));
    expect(resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 4, rowSpan: 1e20 })).toBe(d);
    expect(resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 4, rowSpan: 201 })).toBe(d);
    expect(resizeWatchTile(d, P1, "A", { col: 0, row: 199, colSpan: 4, rowSpan: 2 })).toBe(d);
    expect(layout(resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 4, rowSpan: 200 }), P1)[0]).toBe("A 0,0 4x200");
    expect(previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 4, rowSpan: 1e20 }).refused).toBe("end");
    expect(previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 4, rowSpan: 0 }).refused).toBe("span");
    expect(previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 0, rowSpan: 2 }).refused).toBe("span");
    expect(previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 4, rowSpan: Number.NaN }).refused).toBe("number");
    expect(previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 4, rowSpan: 3 }).refused).toBeUndefined();

    expect(dropWatchTile(d, P1, "A", { row: 1e19, col: 0 })).toBe(d);
    expect(watchDropOutcome(pageOf(d, P1), "A", { row: 1e19, col: 0 }).kind).toBe("none");
    expect(watchDropOutcome(pageOf(d, P1), "A", { row: 199, col: 0 }).kind).toBe("none");
    expect(layout(dropWatchTile(d, P1, "A", { row: 198, col: 0 }), P1)[0]).toBe("A 0,198 4x2");

    const start: WatchRect = { col: 0, row: 190, colSpan: 4, rowSpan: 4 };
    expect(watchResizeHandleRect(start, "bottom", { cols: 0, rows: 6 })).toEqual({ ...start, rowSpan: 10 });
    expect(watchResizeHandleRect(start, "bottom", { cols: 0, rows: 7 })).toBeUndefined();
    expect(watchResizeHandleRect(start, "top", { cols: 0, rows: 1e19 })).toBeUndefined();
  });

  it("refuses a resize whose push down would take a tile past it", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 4, 2), tile("B", 0, 2, 4, 197)]));
    const rect = { col: 0, row: 0, colSpan: 4, rowSpan: 4 };
    expect(previewWatchTileResize(pageOf(d, P1), "A", rect).refused).toBe("end");
    expect(resizeWatchTile(d, P1, "A", rect)).toBe(d);
    expect(layout(resizeWatchTile(d, P1, "A", { ...rect, rowSpan: 3 }), P1)).toEqual(["A 0,0 4x3", "B 0,3 4x197"]);
  });

  it("refuses a header push that would take a tile past it", () => {
    const d = doc(page(P1, [tile("A", 0, 196, 6, 4), header("H", 199)]));
    expect(nudgeWatchTile(d, P1, "H", "up")).toBe(d);
    expect(canNudgeWatchTile(d, P1, "H", "up")).toBe(false);
  });

  it("passes over a swap place past it and takes the next", () => {
    // T cannot go back to S's place (X is there) and the place under S's
    // new place ends past row 200, so it goes above.
    const d = doc(page(P1, [tile("S", 0, 196, 2, 2), tile("X", 2, 196, 2, 2), tile("T", 4, 196, 4, 4)]));
    const after = dropWatchTile(d, P1, "S", { row: 196, col: 4 }, "T");
    expect(layout(after, P1)).toEqual(["S 4,196 2x2", "X 2,196 2x2", "T 0,192 4x4"]);
  });

  describe("a tile stored past it", () => {
    const HUGE = 1_500_000;
    const groups = [group(G)];
    const d = doc(
      page(P1, [tile("A", 0, 0, 6, 2, { groupId: G }), tile("H", 0, 2, 12, HUGE, { groupId: G }), tile("B", 6, 0, 6, 2)], { groups }),
    );
    const within = (ms: number, run: () => void) => {
      const t0 = performance.now();
      run();
      expect(performance.now() - t0).toBeLessThan(ms);
    };

    it("is read as stored and found on its cells", () => {
      within(50, () => {
        expect(watchTileRect(tileOf(d, P1, "H"))).toEqual({ col: 0, row: 2, colSpan: 12, rowSpan: HUGE });
        expect(watchTileAtCell(pageOf(d, P1), { row: HUGE, col: 11 })?.id).toBe("H");
        expect(firstFreeWatchCell(pageOf(d, P1), 12, 1)).toEqual({ row: HUGE + 2, col: 0 });
        expect(canPlaceWatchTile(pageOf(d, P1), { col: 0, row: 2, colSpan: 12, rowSpan: HUGE }, ["H"])).toBe(true);
        expect(canPlaceWatchTile(pageOf(d, P1), { col: 0, row: 2, colSpan: 12, rowSpan: HUGE })).toBe(false);
        expect(watchGroupRegions(pageOf(d, P1), G).map((r) => [...r].sort())).toEqual([["A", "H"]]);
      });
    });

    it("is deleted, nudged and resized back in quickly", () => {
      within(50, () => {
        const deleted = deleteWatchTile(d, P1, "H");
        expect(layout(deleted, P1)).toEqual(["A 0,0 6x2", "B 6,0 6x2"]);
        expect("groupId" in tileOf(deleted, P1, "A")).toBe(false);
        expect(pageOf(deleted, P1).groups).toEqual([]);

        expect(nudgeWatchTile(d, P1, "H", "down")).toBe(d);
        expect(nudgeWatchTile(d, P1, "H", "up")).toBe(d);
        expect(canNudgeWatchTile(d, P1, "H", "left")).toBe(false);
        expect(dropWatchTile(d, P1, "H", { row: 3, col: 0 })).toBe(d);

        const back = resizeWatchTile(d, P1, "H", { col: 0, row: 2, colSpan: 12, rowSpan: 3 });
        expect(layout(back, P1)).toEqual(["A 0,0 6x2", "H 0,2 12x3", "B 6,0 6x2"]);
        expect(tileOf(back, P1, "H").groupId).toBe(G);
        expect(tileOf(back, P1, "A")).toBe(tileOf(d, P1, "A"));

        // The other tiles still move, around it.
        expect(layout(nudgeWatchTile(d, P1, "A", "right"), P1)).toEqual(["A 6,0 6x2", `H 0,2 12x${HUGE}`, "B 0,0 6x2"]);
      });
    });

    it("blocks a resize that would push it further", () => {
      within(50, () => {
        expect(resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 3 })).toBe(d);
      });
    });
  });
});

// ── tiles that share an id ───────────────────────────────────────────────

describe("two tiles with one id", () => {
  it("both go back to the later one's baseline place, as the phone's map keeps the last", () => {
    // The baseline has D twice; the page being resized has them moved.
    const baselineDoc = doc(page(P1, [tile("A", 0, 0, 6, 2), tile("D", 6, 0, 6, 2), tile("D", 6, 6, 6, 2)]));
    const now = doc(page(P1, [tile("A", 0, 0, 6, 2), tile("D", 6, 3, 6, 2), tile("D", 6, 9, 6, 2)]));
    const after = resizeWatchTile(now, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, { baseline: pageOf(baselineDoc, P1) });
    // Both take row 6, so the first then pushes the second under it.
    expect(layout(after, P1)).toEqual(["A 0,0 6x2", "D 6,6 6x2", "D 6,8 6x2"]);
    const preview = previewWatchTileResize(pageOf(now, P1), "A", { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, pageOf(baselineDoc, P1));
    expect(watchPageTiles(preview.page).map((t) => t.gridRow)).toEqual([0, 6, 8]);
  });

  it("resizes the first of them and pushes the other", () => {
    const d = doc(page(P1, [tile("D", 0, 0, 6, 2), tile("D", 0, 2, 6, 2)]));
    expect(layout(resizeWatchTile(d, P1, "d", { col: 0, row: 0, colSpan: 6, rowSpan: 3 }), P1)).toEqual(["D 0,0 6x3", "D 0,3 6x2"]);
  });

  it("a nudge asks about the tile in the way but swaps the first tile with its id", () => {
    // S moves right into the second "B"; the phone checks the swap with
    // that tile, then swaps S with the first "B", six rows down: S takes
    // its place and it takes S's.
    const d = doc(page(P1, [tile("B", 0, 6, 2, 2), tile("S", 0, 0, 2, 2), tile("B", 2, 0, 2, 2)]));
    const after = nudgeWatchTile(d, P1, "S", "right");
    expect(layout(after, P1)).toEqual(["B 0,0 2x2", "S 0,6 2x2", "B 2,0 2x2"]);
    expect(canNudgeWatchTile(d, P1, "S", "right")).toBe(true);
  });

  it("a nudge refused for the tile in the way is not made with the first one", () => {
    // The second "B" is 12 wide and finds no place once S takes its row
    // (X and W fill the rest); the first "B" would fit S's place, but the
    // phone never asks about it.
    const d = doc(
      page(P1, [
        tile("B", 10, 30, 2, 2),
        tile("S", 0, 0, 2, 2),
        tile("B", 0, 2, 12, 2),
        tile("X", 2, 0, 10, 2),
        tile("W", 0, 4, 12, 20),
      ]),
    );
    expect(nudgeWatchTile(d, P1, "S", "down")).toBe(d);
  });

  it("ids that differ only in case are one id", () => {
    const d = doc(page(P1, [tile("abc", 0, 0, 2, 2), tile("ABC", 4, 0, 2, 2), tile("Z", 8, 0, 2, 2)]));
    expect(layout(nudgeWatchTile(d, P1, "Abc", "down"), P1)).toEqual(["abc 0,1 2x2", "ABC 4,0 2x2", "Z 8,0 2x2"]);
    expect(layout(deleteWatchTile(d, P1, "aBC"), P1)).toEqual(["Z 8,0 2x2"]);
    // Each counts as the other when a cell is checked.
    expect(canPlaceWatchTile(pageOf(d, P1), { col: 4, row: 0, colSpan: 2, rowSpan: 2 }, ["abc"])).toBe(true);
    expect(watchDropOutcome(pageOf(d, P1), "abc", { row: 0, col: 4 }).kind).toBe("move");
  });
});

// ── names ────────────────────────────────────────────────────────────────

describe("new page names, as Swift's Int reads them", () => {
  const named = (...names: string[]) => doc(...names.map((name, i) => ({ id: `N${i}`, name })));

  it("reads a sign, leading zeros and numbers past 2^53 in full", () => {
    expect(newWatchPageName(named("New Page +7"))).toBe("New Page 8");
    expect(newWatchPageName(named("New Page 007"))).toBe("New Page 8");
    expect(newWatchPageName(named("New Page -3"))).toBe("New Page -2");
    expect(newWatchPageName(named("New Page 9007199254740993"))).toBe("New Page 9007199254740994");
    expect(newWatchPageName(named("New Page 9223372036854775806", "New Page 3"))).toBe("New Page 9223372036854775807");
  });

  it("skips exactly what Swift refuses", () => {
    expect(newWatchPageName(named("New Page 9223372036854775808", "New Page 2"))).toBe("New Page 3");
    expect(newWatchPageName(named("New Page -9223372036854775808"))).toBe("New Page -9223372036854775807");
    expect(newWatchPageName(named("New Page -9223372036854775809"))).toBe("New Page 1");
    expect(newWatchPageName(named("New Page 1e3", "New Page 0x10", "New Page 4 ", "New Page  4", "New Page ", "New Page ٣"))).toBe("New Page 1");
    expect(newWatchPageName(named("New Page +", "New Page -", "New Page 1.5"))).toBe("New Page 1");
  });

  it("writes the number after the largest 64 bit one in full", () => {
    expect(newWatchPageName(named("New Page 9223372036854775807"))).toBe("New Page 9223372036854775808");
  });
});

// ── what the reviewer asked to see ───────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

describe("purity", () => {
  it("never writes into the document it was given", () => {
    const d = deepFreeze(
      doc(
        page(P1, [tile("A", 0, 0, 4, 2, { groupId: G }), tile("B", 4, 0, 4, 2, { groupId: G }), header("H", 2), tile("C", 0, 3, 4, 2)], { groups: [group(G)] }),
        page(SYS, [], { isSystemPage: true }),
        page(P2, [tile("L", 0, 0, 4, 2, { entityId: `page.${P1}` })]),
      ),
    );
    const json = JSON.stringify(d);
    const ids = counter();
    const results = [
      addWatchPage(d, { newId: ids }),
      deleteWatchPage(d, P1, { removeLinks: true }),
      deleteWatchPage(d, P2),
      setWatchPageName(d, P1, "X"),
      setWatchPageHidden(d, P1, true),
      moveWatchPage(d, P2, 0),
      dropWatchTile(d, P1, "A", { row: 6, col: 0 }),
      dropWatchTile(d, P1, "A", { row: 0, col: 4 }, "B"),
      nudgeWatchTile(d, P1, "A", "down"),
      nudgeWatchTile(d, P1, "H", "up"),
      nudgeWatchTile(d, P1, "H", "down"),
      resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 4, rowSpan: 4 }, { baseline: pageOf(d, P1) }),
      deleteWatchTile(d, P1, "B", { newId: ids }),
      repairWatchTileGroups(d, P1, [G], { newId: ids }),
    ];
    previewWatchTileResize(pageOf(d, P1), "A", { col: 0, row: 0, colSpan: 8, rowSpan: 4 }, pageOf(d, P1));
    watchDropOutcome(pageOf(d, P1), "A", { row: 0, col: 4 }, "B");
    firstFreeWatchCell(pageOf(d, P1), 4, 2);
    expect(JSON.stringify(d)).toBe(json);
    // Every edit changed something but two the rules refuse: A down (its
    // swap with the header would put A on C) and the repair of a group that
    // needs none.
    expect(results.map((r, i) => (r === d ? i : -1)).filter((i) => i >= 0)).toEqual([8, 13]);
  });
});

describe("tiles that already overlap", () => {
  // A and B both cover row 1, columns 2 and 3; A comes first in items.
  const p = page(P1, [tile("A", 0, 0, 4, 2), tile("B", 2, 1, 4, 2)]);

  it("the first in items order owns the shared cells", () => {
    expect(watchTileAtCell(p, { row: 1, col: 2 })?.id).toBe("A");
    expect(watchTileAtCell(p, { row: 1, col: 4 })?.id).toBe("B");
  });

  it("a cell B covers under A counts as A's", () => {
    // Without A, the shared cells are A's (first) and so free; B's own cells
    // are not.
    expect(canPlaceWatchTile(p, { col: 2, row: 1, colSpan: 2, rowSpan: 1 }, ["A"])).toBe(true);
    expect(canPlaceWatchTile(p, { col: 2, row: 1, colSpan: 3, rowSpan: 1 }, ["A"])).toBe(false);
    expect(canPlaceWatchTile(p, { col: 2, row: 1, colSpan: 2, rowSpan: 1 }, ["B"])).toBe(false);
    // Turned around, B comes first and owns them.
    const q = page(P1, [tile("B", 2, 1, 4, 2), tile("A", 0, 0, 4, 2)]);
    expect(canPlaceWatchTile(q, { col: 2, row: 1, colSpan: 2, rowSpan: 1 }, ["A"])).toBe(false);
    expect(canPlaceWatchTile(q, { col: 2, row: 1, colSpan: 2, rowSpan: 1 }, ["B"])).toBe(true);
  });

  it("a group region follows the last tile on each cell", () => {
    // C lies wholly under D, which comes later: C owns no cell, so the flood
    // from C's corner finds D and E, and C is in no region at all. A repair
    // leaves it in the group, as on the phone.
    const g = page(
      P1,
      [tile("C", 0, 0, 2, 2, { groupId: G }), tile("D", 0, 0, 4, 2, { groupId: G }), tile("E", 4, 0, 2, 2, { groupId: G })],
      { groups: [group(G)] },
    );
    expect(watchGroupRegions(g, G).map((r) => [...r].sort())).toEqual([["D", "E"]]);
    expect(repairWatchTileGroups(doc(g), P1, [G])).toEqual(doc(g));
  });
});

describe("the swap's search for the other tile's place", () => {
  // S is dragged onto T. T cannot take S's old place, because X sits in it.
  it("tries right under S's new place first", () => {
    const d = doc(page(P1, [tile("S", 0, 0, 2, 2), tile("X", 2, 0, 2, 2), tile("T", 4, 0, 4, 2)]));
    expect(layout(dropWatchTile(d, P1, "S", { row: 0, col: 4 }, "T"), P1)).toEqual(["S 4,0 2x2", "X 2,0 2x2", "T 0,2 4x2"]);
  });

  it("then right above it", () => {
    const d = doc(page(P1, [tile("S", 0, 4, 2, 2), tile("X", 2, 4, 2, 2), tile("T", 4, 4, 4, 2), tile("W", 0, 6, 12, 2)]));
    expect(layout(dropWatchTile(d, P1, "S", { row: 4, col: 4 }, "T"), P1)).toEqual([
      "S 4,4 2x2",
      "X 2,4 2x2",
      "T 0,2 4x2",
      "W 0,6 12x2",
    ]);
  });

  it("then rows 0 to 11, top down", () => {
    const d = doc(
      page(P1, [tile("V", 0, 0, 12, 2), tile("S", 0, 2, 2, 2), tile("X", 2, 2, 2, 2), tile("T", 4, 2, 4, 2), tile("W", 0, 4, 12, 2)]),
    );
    // Row 2: column 0 has X, columns 1 to 5 reach S's new place; 6 is free.
    expect(layout(dropWatchTile(d, P1, "S", { row: 2, col: 4 }, "T"), P1)).toEqual([
      "V 0,0 12x2",
      "S 4,2 2x2",
      "X 2,2 2x2",
      "T 6,2 4x2",
      "W 0,4 12x2",
    ]);
  });

  it("goes out from S's old column, left before right", () => {
    // S was at column 5. Under its new place, column 5 is taken by Y; 4
    // (left) is free, and so is 6, so 4 wins.
    const d = doc(page(P1, [tile("S", 5, 0, 2, 2), tile("X", 7, 0, 2, 2), tile("T", 0, 0, 3, 2), tile("Y", 7, 2, 1, 2)]));
    const after = dropWatchTile(d, P1, "S", { row: 0, col: 0 }, "T");
    expect(layout(after, P1)).toEqual(["S 0,0 2x2", "X 7,0 2x2", "T 4,2 3x2", "Y 7,2 1x2"]);
  });

  it("refuses the swap when no place is found", () => {
    const d = doc(
      page(P1, [tile("V", 0, 0, 12, 14), tile("S", 0, 20, 2, 2), tile("X", 2, 20, 2, 2), tile("T", 4, 20, 4, 2), tile("W", 0, 22, 12, 2), tile("U", 0, 16, 12, 4)]),
    );
    expect(watchDropOutcome(pageOf(d, P1), "S", { row: 20, col: 4 }, "T").kind).toBe("none");
    expect(dropWatchTile(d, P1, "S", { row: 20, col: 4 }, "T")).toBe(d);
  });
});

describe("the push down", () => {
  it("pushes two tiles on one row by the same rule", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 12, 2), tile("B", 0, 2, 6, 2), tile("C", 6, 2, 6, 3), tile("D", 0, 5, 12, 1)]));
    const after = resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 12, rowSpan: 3 });
    expect(layout(after, P1)).toEqual(["A 0,0 12x3", "B 0,3 6x2", "C 6,3 6x3", "D 0,6 12x1"]);
  });

  it("goes by rows, not by items order", () => {
    const d = doc(page(P1, [tile("D", 0, 5, 12, 1), tile("C", 6, 2, 6, 3), tile("A", 0, 0, 12, 2), tile("B", 0, 2, 6, 2)]));
    const after = resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 12, rowSpan: 3 });
    expect(layout(after, P1)).toEqual(["D 0,6 12x1", "C 6,3 6x3", "A 0,0 12x3", "B 0,3 6x2"]);
  });
});

describe("group repair after every kind of move", () => {
  const groupIds = (d: WatchPagesDocument) => watchPageTiles(pageOf(d, P1)).map((t) => (t.groupId as string | undefined) ?? "-");

  it("after a nudge swap", () => {
    // A and B are a group; C is not. A swaps with C and so leaves B.
    const d = doc(page(P1, [tile("A", 2, 0, 2, 2, { groupId: G }), tile("B", 0, 0, 2, 2, { groupId: G }), tile("C", 4, 0, 2, 2)], { groups: [group(G)] }));
    const after = nudgeWatchTile(d, P1, "A", "right");
    expect(layout(after, P1)).toEqual(["A 4,0 2x2", "B 0,0 2x2", "C 2,0 2x2"]);
    expect(groupIds(after)).toEqual(["-", "-", "-"]);
    expect(pageOf(after, P1).groups).toEqual([]);
  });

  it("after a resize push", () => {
    // B and C are a group side by side; A grows into B only, which is
    // pushed down away from C.
    const d = doc(
      page(P1, [tile("A", 0, 0, 6, 2), tile("B", 0, 2, 6, 2, { groupId: G }), tile("C", 6, 2, 6, 2, { groupId: G })], { groups: [group(G)] }),
    );
    const after = resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 3 });
    expect(layout(after, P1)).toEqual(["A 0,0 6x3", "B 0,3 6x2", "C 6,2 6x2"]);
    // B at rows 3 to 4 still touches C at rows 2 to 3 along row 3.
    expect(groupIds(after)).toEqual(["-", G, G]);
    const further = resizeWatchTile(d, P1, "A", { col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    expect(layout(further, P1)).toEqual(["A 0,0 6x4", "B 0,4 6x2", "C 6,2 6x2"]);
    expect(groupIds(further)).toEqual(["-", "-", "-"]);
  });

  it("after a header push", () => {
    // A and B are stacked in a group; the header pushes in between them.
    const d = doc(
      page(P1, [tile("A", 0, 0, 12, 2, { groupId: G }), tile("B", 0, 2, 12, 2, { groupId: G }), header("H", 4)], { groups: [group(G)] }),
    );
    const after = nudgeWatchTile(d, P1, "H", "up");
    expect(layout(after, P1)).toEqual(["A 0,0 12x2", "B 0,3 12x2", "H 0,2 12x1"]);
    expect(groupIds(after)).toEqual(["-", "-", "-"]);
  });

  it("corners that only touch are not one region", () => {
    const d = doc(page(P1, [tile("A", 0, 0, 2, 2, { groupId: G }), tile("B", 2, 2, 2, 2, { groupId: G })], { groups: [group(G)] }));
    expect(watchGroupRegions(pageOf(d, P1), G)).toEqual([["A"], ["B"]]);
    const after = repairWatchTileGroups(d, P1, [G]);
    expect(groupIds(after)).toEqual(["-", "-"]);
  });

  it("splits into three", () => {
    // Three pairs, a row apart: the first keeps the group, each other pair
    // gets a copy with a new id.
    const spaced = [tile("A", 0, 0, 2, 2), tile("B", 2, 0, 2, 2), tile("C", 0, 3, 2, 2), tile("D", 2, 3, 2, 2), tile("E", 0, 6, 2, 2), tile("F", 2, 6, 2, 2)].map(
      (t) => ({ ...t, groupId: G }),
    );
    const d = doc(page(P1, spaced, { groups: [group(G)] }));
    const after = repairWatchTileGroups(d, P1, [G], { newId: counter() });
    expect(groupIds(after)).toEqual([G, G, "NEW-0001", "NEW-0001", "NEW-0002", "NEW-0002"]);
    expect((pageOf(after, P1).groups as JsonObject[]).map((g) => g.id)).toEqual([G, "NEW-0001", "NEW-0002"]);
  });

  it("does not split a group missing from groups, or a page with no groups key", () => {
    const spaced = [tile("A", 0, 0, 2, 2), tile("B", 2, 0, 2, 2), tile("C", 0, 3, 2, 2), tile("D", 2, 3, 2, 2), tile("E", 6, 6, 2, 2)].map(
      (t) => ({ ...t, groupId: G }),
    );
    for (const extra of [{ groups: [group(H)] }, { groups: undefined }]) {
      const p = page(P1, spaced, extra);
      if (extra.groups === undefined) delete p.groups;
      const d = doc(p);
      const after = repairWatchTileGroups(d, P1, [G], { newId: counter() });
      // Nothing is split and the lone tile keeps its group too, as on the
      // phone, whose split stops before anything when the group is missing.
      expect(groupIds(after)).toEqual([G, G, G, G, G]);
      expect("groups" in pageOf(after, P1)).toBe(extra.groups !== undefined);
    }
  });
});

describe("a header more than one row high", () => {
  it("moves up and down by the push insert, its own height kept", () => {
    const tall = (id: string, row: number) => tile(id, 0, row, 12, 2, { entityId: "divider.line.custom" });
    const d = doc(page(P1, [tile("A", 0, 0, 6, 2), tall("H", 2), tile("C", 0, 4, 6, 3)]));
    expect(layout(nudgeWatchTile(d, P1, "H", "up"), P1)).toEqual(["A 0,1 6x2", "H 0,0 12x2", "C 0,4 6x3"]);
    expect(layout(nudgeWatchTile(d, P1, "H", "down"), P1)).toEqual(["A 0,0 6x2", "H 0,5 12x2", "C 0,3 6x3"]);
  });
});

describe("system pages and odd entries", () => {
  it("never renames or hides a system page", () => {
    const d = doc(page(SYS, [], { isSystemPage: true }));
    expect(setWatchPageName(d, SYS, "Mine")).toBe(d);
    expect(setWatchPageHidden(d, SYS, true)).toBe(d);
  });

  it("moves pages around entries that are not pages, which keep their slots", () => {
    const d = doc(page(P1, []), "not a page", page(P2, []), null, page(P3, []), 7);
    const after = moveWatchPage(d, P3, 0);
    expect((after.pages as unknown[]).map((p) => (typeof p === "object" && p !== null ? String((p as JsonObject).id).slice(-1) : p))).toEqual([
      "3",
      "not a page",
      "1",
      null,
      "2",
      7,
    ]);
    expect(listedWatchPages(after).map((p) => p.id)).toEqual([P3, P1, P2]);
  });
});

describe("a page of 200 tiles", () => {
  // Ten rows of twenty: 200 tiles of 1 by 1 in a 12 column grid is too wide,
  // so 200 tiles of 3 by 1, four to a row, fifty rows.
  const items = Array.from({ length: 200 }, (_, i) => tile(`T${i}`, (i % 4) * 3, Math.floor(i / 4), 3, 1, i < 8 ? { groupId: G } : {}));
  const d = doc(page(P1, items, { groups: [group(G)] }));

  it("edits fast and right", () => {
    const t0 = performance.now();
    expect(firstFreeWatchCell(pageOf(d, P1), 3, 1)).toEqual({ row: 50, col: 0 });
    expect(layout(nudgeWatchTile(d, P1, "T199", "down"), P1)[199]).toBe("T199 9,50 3x1");
    expect(layout(nudgeWatchTile(d, P1, "T0", "right"), P1).slice(0, 2)).toEqual(["T0 3,0 3x1", "T1 0,0 3x1"]);
    const grown = resizeWatchTile(d, P1, "T0", { col: 0, row: 0, colSpan: 3, rowSpan: 2 });
    expect(layout(grown, P1)[4]).toBe("T4 0,2 3x1");
    expect(layout(grown, P1)[196]).toBe("T196 0,50 3x1");
    expect(deleteWatchTile(d, P1, "T5")).not.toBe(d);
    expect(performance.now() - t0).toBeLessThan(2000);
  });
});

// ── the same answers as the phone's cell by cell loops ───────────────────

describe("rectangles give the phone's cell by cell answers", () => {
  /** A tiny seeded random source, so a failure can be replayed. */
  function random(seed: number): () => number {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 2 ** 32;
    };
  }
  const int = (r: () => number, n: number) => Math.floor(r() * n);

  function itemAtRef(rects: { key: string; r: WatchRect }[], row: number, col: number): number {
    return rects.findIndex(({ r }) => row >= r.row && row < r.row + r.rowSpan && col >= r.col && col < r.col + r.colSpan);
  }
  function canPlaceRef(rects: { key: string; r: WatchRect }[], rect: WatchRect, excluding: string[]): boolean {
    if (rect.col < 0 || rect.row < 0 || rect.col + rect.colSpan > 12) return false;
    for (let dr = 0; dr < rect.rowSpan; dr++) {
      for (let dc = 0; dc < rect.colSpan; dc++) {
        const at = itemAtRef(rects, rect.row + dr, rect.col + dc);
        if (at >= 0 && !excluding.includes(rects[at]!.key)) return false;
      }
    }
    return true;
  }
  function firstFreeRef(rects: { key: string; r: WatchRect }[], cs: number, rs: number): { row: number; col: number } {
    for (let row = 0; ; row++) {
      for (let col = 0; col + cs <= 12; col++) {
        let free = true;
        for (let dr = 0; dr < rs && free; dr++) for (let dc = 0; dc < cs && free; dc++) if (itemAtRef(rects, row + dr, col + dc) >= 0) free = false;
        if (free) return { row, col };
      }
    }
  }
  function regionsRef(rects: { key: string; r: WatchRect; group: boolean }[]): string[][] {
    const groupTiles = rects.filter((t) => t.group);
    const owner = new Map<string, string>();
    for (const { key, r } of groupTiles) for (let y = r.row; y < r.row + r.rowSpan; y++) for (let x = r.col; x < r.col + r.colSpan; x++) owner.set(`${y}-${x}`, key);
    const out: string[][] = [];
    const seen = new Set<string>();
    for (const { key, r } of groupTiles) {
      if (seen.has(key)) continue;
      const component = new Set<string>();
      const visited = new Set<string>();
      const queue: [number, number][] = [[r.row, r.col]];
      while (queue.length > 0) {
        const [y, x] = queue.shift()!;
        const k = `${y}-${x}`;
        if (visited.has(k)) continue;
        const o = owner.get(k);
        if (o === undefined) continue;
        visited.add(k);
        component.add(o);
        for (const [ny, nx] of [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]] as const) if (owner.has(`${ny}-${nx}`) && !visited.has(`${ny}-${nx}`)) queue.push([ny, nx]);
      }
      for (const k of component) seen.add(k);
      out.push([...component].sort());
    }
    return out;
  }

  it("on 400 random pages, overlaps and shared ids included", () => {
    const r = random(20261002);
    for (let n = 0; n < 400; n++) {
      const count = 1 + int(r, 9);
      const rects = Array.from({ length: count }, () => {
        const colSpan = 1 + int(r, 6);
        return {
          key: `K${int(r, count + 2)}`,
          r: { col: int(r, 13 - colSpan), row: int(r, 10), colSpan, rowSpan: 1 + int(r, 4) },
          group: r() < 0.7,
        };
      });
      const p = page(P1, rects.map(({ key, r: g, group: inGroup }) => tile(key, g.col, g.row, g.colSpan, g.rowSpan, inGroup ? { groupId: G } : {})));
      for (let k = 0; k < 10; k++) {
        const colSpan = 1 + int(r, 6);
        const rect = { col: int(r, 14) - 1, row: int(r, 12) - 1, colSpan, rowSpan: 1 + int(r, 4) };
        const excluding = Array.from({ length: int(r, 3) }, () => `K${int(r, count + 2)}`);
        expect(canPlaceWatchTile(p, rect, excluding)).toBe(canPlaceRef(rects, rect, excluding));
      }
      const cs = 1 + int(r, 12);
      const rs = 1 + int(r, 4);
      expect(firstFreeWatchCell(p, cs, rs)).toEqual(firstFreeRef(rects, cs, rs));
      expect(watchGroupRegions(p, G).map((x) => [...x].sort())).toEqual(regionsRef(rects));
    }
  });
});
