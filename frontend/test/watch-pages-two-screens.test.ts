// Two screens on one page (app repo docs/pages_two_screens_plan_2026-11.md):
// the page key `screens` keeps the watch's and the iPhone's place for each
// tile, a page without it reads both from the tile fields, and every tile
// edit arranges one screen and leaves the other as it was. The fixture
// `fixtures-pages/08-two-screens.json` holds a page the two screens arrange
// apart.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  addWatchPage,
  canMoveWatchTilesBy,
  canPlaceWatchTile,
  deleteTile,
  deleteWatchTile,
  dropWatchTile,
  firstFreeWatchCell,
  giveWatchTileId,
  lastFreeWatchCell,
  leaveWatchTileGroup,
  makeWatchTileGroup,
  moveWatchTilesBy,
  nearestScreenSize,
  nudgeWatchTile,
  placeNewWatchTile,
  previewWatchTileResize,
  renameWatchScreenTiles,
  resizeWatchTile,
  setTileOnScreen,
  tileOnlyOnScreen,
  ungroupWatchTileGroup,
  useOtherScreensOrder,
  watchScreenTileRect,
  watchTileAtCell,
} from "../src/watch-pages/edit.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  type WatchScreen,
  WATCH_SCREENS_KEY,
  asWatchPagesDocument,
  encodeWatchPages,
  hasWatchPageScreens,
  openWatchPages,
  otherWatchScreen,
  screenGeometry,
  tileOnScreen,
  watchPageExtent,
  watchPageTiles,
  watchPagesOf,
  watchScreenMap,
  watchScreenPage,
  watchScreenTiles,
  watchScreensAlike,
  watchScreensDiffer,
  watchTilesOffScreen,
} from "../src/watch-pages/model.js";
import { watchReflowPage, watchSkippedTilesLayout } from "../src/watch-pages/preview.js";
import { addNewWatchTile, addWatchTile } from "../src/watch-pages/tile-new.js";
import pageKeys from "../src/watch-pages/page-keys.json";

// ── helpers ──────────────────────────────────────────────────────────────

const P = "BBBBBBBB-0000-4000-8000-000000000001";
const A = "A0000000-0000-4000-8000-000000000001";
const B = "A0000000-0000-4000-8000-000000000002";
const C = "A0000000-0000-4000-8000-000000000003";
const D = "A0000000-0000-4000-8000-000000000004";

function tile(id: string, col: number, row: number, colSpan: number, rowSpan: number, extra: JsonObject = {}): JsonObject {
  return { id, entityId: `light.${id.slice(-4).toLowerCase()}`, gridCol: col, gridRow: row, colSpan, rowSpan, ...extra };
}

function doc(...items: JsonObject[]): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: P, name: "Lights", items }] };
}

function pageOf(d: WatchPagesDocument): WatchPage {
  return watchPagesOf(d)[0]!;
}

function tileOf(d: WatchPagesDocument, id: string): WatchPageTile {
  return watchPageTiles(pageOf(d)).find((t) => t.id === id)!;
}

/** Each tile on a screen as "id col,row colSpanxrowSpan", in items order,
 * by the last four characters of its id. */
function places(d: WatchPagesDocument, screen: WatchScreen): string[] {
  const page = pageOf(d);
  return watchPageTiles(page).flatMap((t) => {
    const g = screenGeometry(page, t, screen);
    return g === undefined ? [] : [`${String(t.id).slice(-4)} ${g.col},${g.row} ${g.colSpan}x${g.rowSpan}`];
  });
}

function fields(d: WatchPagesDocument, id: string): string {
  const t = tileOf(d, id);
  return `${t.gridCol},${t.gridRow} ${t.colSpan}x${t.rowSpan}`;
}

const FIXTURE_TEXT = readFileSync(join(__dirname, "fixtures-pages", "08-two-screens.json"), "utf8");
const fixture = (): WatchPagesDocument => asWatchPagesDocument(JSON.parse(FIXTURE_TEXT))!;
const F = "5A17E000-0000-4000-8000-0000000008";
const SENSOR = `${F}01`;
const MEDIA = `${F}02`;
const TEMPLATE = `${F}03`;
const CAMERA = `${F}04`;
const MAP = `${F}05`;
const FP = "5A17E000-0000-4000-8000-000000000080";

// ── reading ──────────────────────────────────────────────────────────────

describe("a page without screens", () => {
  const d = doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4), { ...tile(C, 0, 4, 12, 8), entityId: "map.C0000000" });

  it("reads both screens from the tile fields, with a kind the watch cannot draw Off on the watch", () => {
    const page = pageOf(d);
    expect(hasWatchPageScreens(page)).toBe(false);
    expect(watchScreenMap(page, "watch")).toBeUndefined();
    expect(places(d, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4"]);
    expect(places(d, "iphone")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 12x8"]);
    expect(tileOnScreen(page, tileOf(d, C), "watch")).toBe(false);
    expect(tileOnScreen(page, tileOf(d, C), "iphone")).toBe(true);
    expect(watchTilesOffScreen(page, "watch").map((t) => t.id)).toEqual([C]);
    expect(watchTilesOffScreen(page, "iphone")).toEqual([]);
  });

  it("is its own page on each screen, and its extent is per screen only when asked", () => {
    const page = pageOf(d);
    expect(watchScreenPage(page, "watch")).toBe(page);
    expect(watchScreenPage(page, "iphone")).toBe(page);
    expect(watchPageExtent(page)).toBe(12);
    expect(watchPageExtent(page, "watch")).toBe(4);
    expect(watchPageExtent(page, "iphone")).toBe(12);
  });

  it("is arranged alike on both, and differs only by the map the watch skips", () => {
    expect(watchScreensAlike(pageOf(d))).toBe(true);
    expect(watchScreensDiffer(pageOf(d))).toBe(true);
    const plain = doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4));
    expect(watchScreensDiffer(pageOf(plain))).toBe(false);
  });

  it("round trips unchanged when nothing is edited", () => {
    const model = openWatchPages(d);
    expect(encodeWatchPages(model)).toBe(d);
    expect(moveWatchTilesBy(d, P, [A], 0, 0)).toBe(d);
    expect(resizeWatchTile(d, P, A, { col: 0, row: 0, colSpan: 6, rowSpan: 4 })).toBe(d);
    expect(resizeWatchTile(d, P, A, { col: 0, row: 0, colSpan: 6, rowSpan: 4 }, { screen: "iphone" })).toBe(d);
    expect(setTileOnScreen(d, P, A, "watch", true)).toBe(d);
    expect(setTileOnScreen(d, P, C, "watch", false)).toBe(d);
    expect(useOtherScreensOrder(d, P, "watch")).toBe(d);
    expect(useOtherScreensOrder(d, P, "iphone")).toBe(d);
    expect(dropWatchTile(d, P, A, { row: 0, col: 0 }, undefined, { screen: "iphone" })).toBe(d);
  });

  it("knows screens as an optional page key in page-keys.json, of any JSON", () => {
    const keys = (pageKeys as unknown as { types: { page: { keys: Record<string, JsonObject> } } }).types.page.keys;
    expect(keys[WATCH_SCREENS_KEY]).toEqual({ type: "json", required: false });
    expect(otherWatchScreen("watch")).toBe("iphone");
    expect(otherWatchScreen("iphone")).toBe("watch");
  });
});

describe("the two screens fixture", () => {
  it("saves back unchanged", () => {
    const d = fixture();
    expect(encodeWatchPages(openWatchPages(d))).toBe(d);
    expect(JSON.stringify(d)).toBe(FIXTURE_TEXT);
  });

  it("has a 2 by 2 sensor on the iPhone that is 1 by 1 on the watch, a camera and a map Off on the watch", () => {
    const d = fixture();
    const page = pageOf(d);
    expect(screenGeometry(page, tileOf(d, SENSOR), "watch")).toEqual({ col: 0, row: 0, colSpan: 6, rowSpan: 4 });
    expect(screenGeometry(page, tileOf(d, SENSOR), "iphone")).toEqual({ col: 0, row: 0, colSpan: 6, rowSpan: 6 });
    expect(tileOnScreen(page, tileOf(d, CAMERA), "watch")).toBe(false);
    expect(tileOnScreen(page, tileOf(d, CAMERA), "iphone")).toBe(true);
    expect(tileOnScreen(page, tileOf(d, MAP), "watch")).toBe(false);
    expect(watchTilesOffScreen(page, "watch").map((t) => t.id)).toEqual([CAMERA, MAP]);
    expect(watchTilesOffScreen(page, "iphone")).toEqual([]);
  });

  it("reads the media and template tiles in another order on each screen, at the same size", () => {
    const page = pageOf(fixture());
    expect(watchScreenTiles(page, "watch").map((t) => t.id)).toEqual([SENSOR, MEDIA, TEMPLATE]);
    expect(watchScreenTiles(page, "iphone").map((t) => t.id)).toEqual([SENSOR, TEMPLATE, MEDIA, CAMERA, MAP]);
    expect(watchScreensAlike(page)).toBe(false);
    expect(watchScreensDiffer(page)).toBe(true);
  });

  it("draws each screen as Home Assistant stamps it: that screen's places, its Off tiles left out, no screens key", () => {
    const page = pageOf(fixture());
    const watch = watchScreenPage(page, "watch");
    const iphone = watchScreenPage(page, "iphone");
    expect(Object.hasOwn(watch, WATCH_SCREENS_KEY)).toBe(false);
    expect(Object.hasOwn(iphone, WATCH_SCREENS_KEY)).toBe(false);
    expect(watchPageTiles(watch).map((t) => t.id)).toEqual([SENSOR, MEDIA, TEMPLATE]);
    // A tile at its own place is the page's own object.
    expect(watchPageTiles(watch)[0]).toBe(watchPageTiles(page)[0]);
    expect(watchPageTiles(iphone).map((t) => `${t.gridCol},${t.gridRow} ${t.colSpan}x${t.rowSpan}`)).toEqual([
      "0,0 6x6", "6,4 6x4", "6,0 6x4", "0,6 6x4", "0,10 12x8",
    ]);
    expect(watchPageExtent(page, "iphone")).toBe(18);
    expect(watchPageExtent(page, "watch")).toBe(8);
  });

  it("lays out each preview frame from its own screen", () => {
    const page = pageOf(fixture());
    expect(watchPageTiles(watchReflowPage(page, undefined, 12, undefined, "watch")).map((t) => t.id)).toEqual([SENSOR, MEDIA, TEMPLATE]);
    const phone = watchReflowPage(page, undefined, 12, undefined, "iphone");
    expect(watchPageTiles(phone)[0]!.rowSpan).toBe(6);
    expect(watchPageTiles(phone).length).toBe(5);
    // No dashed outlines for a screen's Off tiles: they have no watch place.
    expect(watchSkippedTilesLayout(page, { width: 208, height: 248 }, {})).toEqual([]);
  });
});

// ── edits on one screen ──────────────────────────────────────────────────

describe("an edit on one screen", () => {
  const base = doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4), tile(C, 0, 4, 6, 4));

  it("on the watch writes screens on the first move, keeps the iPhone where it was, and mirrors the tile fields", () => {
    const moved = moveWatchTilesBy(base, P, [C], 6, 0)!;
    expect(moved).not.toBe(base);
    expect(hasWatchPageScreens(pageOf(moved))).toBe(true);
    expect(places(moved, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 6,4 6x4"]);
    expect(places(moved, "iphone")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 6x4"]);
    expect(fields(moved, C)).toBe("6,4 6x4");
    // The screens key sits at the phone's sorted place, after `name`.
    expect(Object.keys(pageOf(moved))).toEqual(["id", "name", "items", WATCH_SCREENS_KEY]);
  });

  it("on the iPhone leaves the tile fields and the watch alone", () => {
    const moved = moveWatchTilesBy(base, P, [C], 6, 0, { screen: "iphone" })!;
    expect(places(moved, "iphone")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 6,4 6x4"]);
    expect(places(moved, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 6x4"]);
    expect(fields(moved, C)).toBe("0,4 6x4");
    expect(pageOf(moved).items).toBe(pageOf(base).items);
  });

  it("drops the screens key again once both screens read as the tile fields", () => {
    const apart = moveWatchTilesBy(base, P, [C], 6, 0, { screen: "iphone" })!;
    const back = moveWatchTilesBy(apart, P, [C], -6, 0, { screen: "iphone" })!;
    expect(JSON.stringify(back)).toBe(JSON.stringify(base));
  });

  it("resizes on one screen only, pushing that screen's tiles down", () => {
    const grown = resizeWatchTile(base, P, A, { col: 0, row: 0, colSpan: 6, rowSpan: 6 }, { screen: "iphone" });
    expect(places(grown, "iphone")).toEqual(["0001 0,0 6x6", "0002 6,0 6x4", "0003 0,6 6x4"]);
    expect(places(grown, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 6x4"]);
    expect(fields(grown, A)).toBe("0,0 6x4");
    const preview = previewWatchTileResize(pageOf(base), A, { col: 0, row: 0, colSpan: 6, rowSpan: 6 }, undefined, "iphone");
    expect(preview.rect).toEqual({ col: 0, row: 0, colSpan: 6, rowSpan: 6 });
    expect(screenGeometry(preview.page, tileOf(base, C), "iphone")).toEqual({ col: 0, row: 6, colSpan: 6, rowSpan: 4 });
  });

  it("drops, nudges and asks for places on the screen it is told", () => {
    const apart = resizeWatchTile(base, P, A, { col: 0, row: 0, colSpan: 6, rowSpan: 6 }, { screen: "iphone" });
    expect(watchTileAtCell(pageOf(apart), { row: 5, col: 0 }, "iphone")?.id).toBe(A);
    expect(watchTileAtCell(pageOf(apart), { row: 5, col: 0 })?.id).toBe(C);
    expect(canPlaceWatchTile(pageOf(apart), { col: 0, row: 4, colSpan: 6, rowSpan: 2 }, [], "iphone")).toBe(false);
    expect(canPlaceWatchTile(pageOf(apart), { col: 6, row: 4, colSpan: 6, rowSpan: 2 }, [], "iphone")).toBe(true);
    expect(firstFreeWatchCell(pageOf(apart), 6, 4, "iphone")).toEqual({ row: 4, col: 6 });
    expect(canMoveWatchTilesBy(apart, P, [B], 0, 4, "iphone")).toBe(true);
    const dropped = dropWatchTile(apart, P, B, { row: 4, col: 6 }, undefined, { screen: "iphone" });
    expect(places(dropped, "iphone")).toContain("0002 6,4 6x4");
    expect(places(dropped, "watch")).toContain("0002 6,0 6x4");
    const nudged = nudgeWatchTile(apart, P, B, "down", { screen: "iphone" });
    expect(places(nudged, "iphone")).toContain("0002 6,1 6x4");
    expect(fields(nudged, B)).toBe("6,0 6x4");
  });

  it("deletes a tile from the list and from both screens, Off or not", () => {
    const off = setTileOnScreen(base, P, C, "watch", false);
    expect(places(off, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4"]);
    const gone = deleteTile(off, P, C);
    expect(watchPageTiles(pageOf(gone)).map((t) => t.id)).toEqual([A, B]);
    // Off on one screen and then gone from both, the page needs no screens.
    expect(JSON.stringify(gone)).toBe(JSON.stringify(doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4))));
    expect(deleteTile).toBe(deleteWatchTile);
    const apart = moveWatchTilesBy(base, P, [C], 6, 0, { screen: "iphone" })!;
    const goneApart = deleteTile(apart, P, B);
    expect(Object.keys(watchScreenMap(pageOf(goneApart), "watch")!)).toEqual([A, C]);
    expect(Object.keys(watchScreenMap(pageOf(goneApart), "iphone")!)).toEqual([A, C]);
  });
});

// ── on and off ───────────────────────────────────────────────────────────

describe("setTileOnScreen", () => {
  const base = doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4), tile(C, 0, 4, 6, 4));

  it("switches a tile Off on one screen, leaving its place empty and the other screen as it was", () => {
    const off = setTileOnScreen(base, P, B, "watch", false);
    expect(places(off, "watch")).toEqual(["0001 0,0 6x4", "0003 0,4 6x4"]);
    expect(places(off, "iphone")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 6x4"]);
    expect(tileOnlyOnScreen(pageOf(off), tileOf(off, B), "iphone")).toBe(true);
    expect(tileOnlyOnScreen(pageOf(off), tileOf(off, A), "iphone")).toBe(false);
  });

  it("refuses to switch the last screen off: the panel asks to delete instead", () => {
    const off = setTileOnScreen(base, P, B, "watch", false);
    expect(setTileOnScreen(off, P, B, "iphone", false)).toBe(off);
  });

  it("switches a tile back on at the screen's first free place, at its size on the other screen", () => {
    const off = setTileOnScreen(base, P, C, "iphone", false);
    const grown = resizeWatchTile(off, P, C, { col: 0, row: 4, colSpan: 12, rowSpan: 2 });
    const on = setTileOnScreen(grown, P, C, "iphone", true);
    expect(places(on, "iphone")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4", "0003 0,4 12x2"]);
    // Back on the watch it also writes the tile fields: here at its old
    // place, which leaves the page as it was, screens key and all.
    const offWatch = setTileOnScreen(base, P, A, "watch", false);
    const onWatch = setTileOnScreen(offWatch, P, A, "watch", true);
    expect(JSON.stringify(onWatch)).toBe(JSON.stringify(base));
    // With its old place taken, at the first free one.
    const taken = moveWatchTilesBy(offWatch, P, [C], 0, -4)!;
    const onElsewhere = setTileOnScreen(taken, P, A, "watch", true);
    expect(places(onElsewhere, "watch")).toEqual(["0001 0,4 6x4", "0002 6,0 6x4", "0003 0,0 6x4"]);
    expect(fields(onElsewhere, A)).toBe("0,4 6x4");
  });

  it("never puts a kind the watch cannot draw on the watch", () => {
    const d = doc(tile(A, 0, 0, 6, 4), { ...tile(D, 0, 4, 12, 8), entityId: "map.D0000000" });
    expect(setTileOnScreen(d, P, D, "watch", true)).toBe(d);
    expect(setTileOnScreen(d, P, D, "iphone", false)).toBe(d);
    expect(tileOnlyOnScreen(pageOf(d), tileOf(d, D), "iphone")).toBe(true);
  });

  it("takes a tile switched Off out of its group, which keeps the same members on both screens", () => {
    const grouped = makeWatchTileGroup(base, P, [A, B], { newId: () => "group-1" });
    expect(tileOf(grouped.document, A).groupId).toBe("GROUP-1");
    const off = setTileOnScreen(grouped.document, P, B, "watch", false);
    expect(tileOf(off, B).groupId).toBeUndefined();
    // A group of one is dissolved, and the tile left takes the group's look.
    expect(tileOf(off, A).groupId).toBeUndefined();
    expect(pageOf(off).groups).toEqual([]);
  });
});

// ── groups ───────────────────────────────────────────────────────────────

describe("groups on two screens", () => {
  it("are made by the adjacency of the screen the edit is on", () => {
    const apart = moveWatchTilesBy(doc(tile(A, 0, 0, 6, 4), tile(B, 6, 0, 6, 4)), P, [B], 0, 4, { screen: "iphone" })!;
    expect(makeWatchTileGroup(apart, P, [A, B], { screen: "iphone" }).groupId).toBeUndefined();
    expect(makeWatchTileGroup(apart, P, [A, B], { newId: () => "g" }).groupId).toBe("G");
  });

  it("are left and ungrouped on every screen, a member Off on the edited one included", () => {
    const d: WatchPagesDocument = {
      schemaVersion: 1,
      pages: [{
        id: P,
        name: "Lights",
        groups: [{ id: "G" }],
        items: [tile(A, 0, 0, 6, 4, { groupId: "G" }), tile(B, 6, 0, 6, 4, { groupId: "G" })],
        screens: {
          watch: { [A]: { col: 0, row: 0, colSpan: 6, rowSpan: 4 } },
          iphone: { [A]: { col: 0, row: 0, colSpan: 6, rowSpan: 4 }, [B]: { col: 6, row: 0, colSpan: 6, rowSpan: 4 } },
        },
      }],
    };
    const ungrouped = ungroupWatchTileGroup(d, P, "G");
    expect(tileOf(ungrouped, A).groupId).toBeUndefined();
    expect(tileOf(ungrouped, B).groupId).toBeUndefined();
    const left = leaveWatchTileGroup(d, P, B);
    expect(tileOf(left, B).groupId).toBeUndefined();
    expect(tileOf(left, A).groupId).toBeUndefined();
  });
});

// ── one screen's order from the other ────────────────────────────────────

describe("useOtherScreensOrder", () => {
  it("gives the watch the iPhone's order and sizes, packed from the top, its Off tiles kept Off", () => {
    const d = fixture();
    const next = useOtherScreensOrder(d, FP, "watch");
    expect(places(next, "watch")).toEqual([
      "0801 0,0 6x6",
      "0802 6,4 6x4",
      "0803 6,0 6x4",
    ]);
    expect(watchScreenTiles(pageOf(next), "watch").map((t) => t.id)).toEqual([SENSOR, TEMPLATE, MEDIA]);
    expect(places(next, "iphone")).toEqual(places(d, "iphone"));
    expect(fields(next, SENSOR)).toBe("0,0 6x6");
    expect(watchScreensAlike(pageOf(next))).toBe(true);
    expect(useOtherScreensOrder(next, FP, "watch")).toBe(next);
  });

  it("gives the iPhone the watch's order and sizes, then the tiles only the iPhone shows", () => {
    const d = fixture();
    const next = useOtherScreensOrder(d, FP, "iphone");
    expect(watchScreenTiles(pageOf(next), "iphone").map((t) => t.id)).toEqual([SENSOR, MEDIA, TEMPLATE, CAMERA, MAP]);
    expect(places(next, "iphone")).toEqual([
      "0801 0,0 6x4",
      "0802 6,0 6x4",
      "0803 0,4 6x4",
      "0804 6,4 6x4",
      "0805 0,8 12x8",
    ]);
    expect(places(next, "watch")).toEqual(places(d, "watch"));
    expect(pageOf(next).items).toBe(pageOf(d).items);
  });

  it("keeps sizes inside the 12 columns", () => {
    expect(nearestScreenSize({ colSpan: 3, rowSpan: 3 }, "watch")).toEqual({ colSpan: 3, rowSpan: 3 });
    expect(nearestScreenSize({ colSpan: 40, rowSpan: 0 }, "iphone")).toEqual({ colSpan: 12, rowSpan: 1 });
  });
});

// ── adding ───────────────────────────────────────────────────────────────

describe("adding a tile", () => {
  it("to a page without screens places it as before and writes no screens", () => {
    const d = doc(tile(A, 0, 0, 6, 4));
    const next = addWatchTile(d, P, { id: B, entityId: "light.b", colSpan: 6, rowSpan: 4 });
    expect(hasWatchPageScreens(pageOf(next))).toBe(false);
    expect(fields(next, B)).toBe("6,0 6x4");
  });

  it("to a page with screens lands at each screen's first free place", () => {
    const apart = resizeWatchTile(doc(tile(A, 0, 0, 6, 4)), P, A, { col: 0, row: 0, colSpan: 12, rowSpan: 4 }, { screen: "iphone" });
    const next = addWatchTile(apart, P, { id: B, entityId: "light.b", colSpan: 6, rowSpan: 4 });
    expect(places(next, "watch")).toEqual(["0001 0,0 6x4", "0002 6,0 6x4"]);
    expect(places(next, "iphone")).toEqual(["0001 0,0 12x4", "0002 0,4 6x4"]);
    expect(fields(next, B)).toBe("6,0 6x4");
  });

  it("from the editor's Add tile lands last on each screen, never in a gap above", () => {
    // A gap at the top right of the watch; the iPhone has A across.
    const gapped = doc(tile(A, 0, 0, 6, 4), tile(C, 0, 4, 6, 4));
    expect(firstFreeWatchCell(pageOf(gapped), 6, 4)).toEqual({ row: 0, col: 6 });
    expect(lastFreeWatchCell(pageOf(gapped), 6, 4)).toEqual({ row: 4, col: 6 });
    expect(lastFreeWatchCell(pageOf(gapped), 12, 4)).toEqual({ row: 8, col: 0 });
    expect(lastFreeWatchCell({ id: P, name: "Empty", items: [] }, 6, 4)).toEqual({ row: 0, col: 0 });
    const apart = resizeWatchTile(gapped, P, A, { col: 0, row: 0, colSpan: 12, rowSpan: 4 }, { screen: "iphone" });
    const next = addNewWatchTile(apart, P, { kind: "entity", entityId: "light.b" }, { last: true, newId: () => B }).document;
    expect(places(next, "watch").at(-1)).toMatch(/^0002 6,4 /);
    expect(places(next, "iphone").at(-1)).toMatch(/^0002 6,4 /);
    // Without `last` the dialog's old rule: the first free place.
    const first = addNewWatchTile(apart, P, { kind: "entity", entityId: "light.b" }, { newId: () => B }).document;
    expect(places(first, "watch").at(-1)).toMatch(/^0002 6,0 /);
  });

  it("of a kind the watch cannot draw lands on the iPhone only", () => {
    const apart = resizeWatchTile(doc(tile(A, 0, 0, 6, 4)), P, A, { col: 0, row: 0, colSpan: 12, rowSpan: 4 }, { screen: "iphone" });
    const page = placeNewWatchTile(pageOf(apart), { id: D, entityId: "map.D0000000", colSpan: 12, rowSpan: 8 });
    expect(Object.keys(watchScreenMap(page, "watch")!)).toEqual([A]);
    expect(screenGeometry(page, watchPageTiles(page)[1]!, "iphone")).toEqual({ col: 0, row: 4, colSpan: 12, rowSpan: 8 });
  });

  it("names a tile with no id on both screens when it gets one", () => {
    const apart = resizeWatchTile(doc(tile(A, 0, 0, 6, 4), { entityId: "light.x", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 4 }), P, A,
      { col: 0, row: 0, colSpan: 6, rowSpan: 6 }, { screen: "iphone" });
    const idless = watchPageTiles(pageOf(apart))[1]!;
    expect(tileOnScreen(pageOf(apart), idless, "watch")).toBe(true);
    const given = giveWatchTileId(apart, P, idless, { newId: () => "named" });
    const named = tileOf(given.document, "NAMED");
    expect(screenGeometry(pageOf(given.document), named, "watch")).toEqual({ col: 6, row: 0, colSpan: 6, rowSpan: 4 });
    expect(screenGeometry(pageOf(given.document), named, "iphone")).toEqual({ col: 6, row: 0, colSpan: 6, rowSpan: 4 });
  });

  it("keeps both screens when a page copy gives every tile a new id", () => {
    const page = pageOf(fixture());
    const renamed = renameWatchScreenTiles(page, new Map([[SENSOR, "NEW-1"]]));
    expect(Object.keys(watchScreenMap(renamed, "iphone")!)[0]).toBe("NEW-1");
    expect(Object.keys(watchScreenMap(renamed, "watch")!)[0]).toBe("NEW-1");
    expect(renameWatchScreenTiles(pageOf(doc(tile(A, 0, 0, 1, 1))), new Map())).toEqual(pageOf(doc(tile(A, 0, 0, 1, 1))));
  });

  it("reads a tile Off on a screen as having no place there", () => {
    const d = fixture();
    expect(watchScreenTileRect(pageOf(d), tileOf(d, CAMERA), "watch")).toBeUndefined();
    expect(watchScreenTileRect(pageOf(d), tileOf(d, CAMERA), "iphone")).toEqual({ col: 0, row: 6, colSpan: 6, rowSpan: 4 });
    // A new page has no screens.
    const added = addWatchPage(doc(), { newId: () => "p2" });
    expect(hasWatchPageScreens(watchPagesOf(added)[1]!)).toBe(false);
  });
});
