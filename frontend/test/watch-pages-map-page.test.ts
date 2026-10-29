// Map pages (app repo docs/home_map_plan_2026-10.md, "Map page"): the page
// key `mapPage`, the rule (`isMapWatchPage`: the key true and a Home map
// tile, the first one counting), a new map page, the Map page switch on and
// off, with and without other tiles, and the guards that keep a map page's
// tile where it is: no add, drag, resize, nudge or delete, while the tile's
// own keys still change through its setters.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { HomeMapDocument } from "../src/home-map/model.js";
import pageKeys from "../src/watch-pages/page-keys.json";
import { deleteWatchPage, deleteWatchTile, dropWatchTile, findWatchPage, nudgeWatchTile, resizeWatchTile } from "../src/watch-pages/edit.js";
import { setWatchHomeMapFloor, setWatchHomeMapLook, setWatchHomeMapRoom } from "../src/watch-pages/home-map-tile.js";
import {
  WATCH_MAP_PAGE_WORDS,
  makeWatchMapPage,
  newMapWatchPage,
  setWatchMapPage,
  watchMapPageAddRemovedCount,
  watchMapPageFloorId,
  watchMapPageRefusal,
  watchMapPageRemovedCount,
} from "../src/watch-pages/map-page.js";
import { type WatchPage, type WatchPagesDocument, WATCH_MAP_PAGE_KEY, isMapWatchPage, watchMapPageTile, watchPageTiles } from "../src/watch-pages/model.js";
import { encodeWatchPageKeys, setWatchPageFullScreen } from "../src/watch-pages/page-settings-model.js";
import { convertToSmartPage } from "../src/watch-pages/smart-model.js";
import { addNewWatchTile, watchAddRefusal } from "../src/watch-pages/tile-new.js";
import { deviceDifferenceText } from "../src/watch-pages/device-differences.js";
import { type WatchPagePreviewInput, renderMapPageArt, renderWatchPagePreview, watchPagePreviewScrolls } from "../src/watch-pages/preview.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";
import { itemDetail } from "../src/library/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
/** Any other floor id: the page's tile names what it is given. */
const LIVING_FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000002";
const PAGE = "C3A0E000-0000-4000-8000-0000000000A1";
const MAP_TILE = "C3A0E000-0000-4000-8000-0000000000A2";
const LAMP_TILE = "C3A0E000-0000-4000-8000-0000000000A3";

let n = 0;
const ids = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;

const mapTile = (extra: Record<string, unknown> = {}) => ({
  id: MAP_TILE, entityId: `home_map.${FLOOR}`, gridCol: 0, gridRow: 4, colSpan: 8, rowSpan: 6, ...extra,
});
const lampTile = (extra: Record<string, unknown> = {}) => ({
  id: LAMP_TILE, entityId: "light.lamp", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 4, ...extra,
});

function doc(page: Record<string, unknown>): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [], groups: [], ...page }] };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;

describe("the mapPage key", () => {
  it("is in page-keys.json as an optional bool, false when absent, written only while true", () => {
    const keys = (pageKeys as unknown as { types: { page: { keys: Record<string, Record<string, unknown>> } }; notes: { keys: Record<string, string> } });
    expect(keys.types.page.keys[WATCH_MAP_PAGE_KEY]).toEqual({ type: "bool", required: false, default: false, writeWhen: { key: "mapPage", not: false } });
    expect(keys.notes.keys.mapPage).toContain("Home map tile");
  });

  it("is never on a fresh page", () => {
    const fresh = newMapWatchPage(PAGE, "Home", FLOOR, { newId: ids });
    expect(Object.keys(fresh)).toContain("mapPage");
    const plain = findWatchPage(addNewWatchTile(doc({}), PAGE, { kind: "spacer" }).document, PAGE)!;
    expect(Object.hasOwn(plain, "mapPage")).toBe(false);
  });

  it("is dropped by the encoder while false and kept while true", () => {
    const off = { id: PAGE, mapPage: false } as WatchPage;
    expect(Object.hasOwn(encodeWatchPageKeys(off), "mapPage")).toBe(false);
    const on = { id: PAGE, mapPage: true } as WatchPage;
    expect(encodeWatchPageKeys(on)).toBe(on);
  });

  it("goes back as it came through a page setting", () => {
    const d = setWatchPageFullScreen(doc({ mapPage: true, items: [mapTile()] }), PAGE, true);
    expect(pageOf(d).mapPage).toBe(true);
  });
});

describe("isMapWatchPage", () => {
  it("needs the key true and a Home map tile", () => {
    expect(isMapWatchPage(pageOf(doc({ mapPage: true, items: [mapTile()] })))).toBe(true);
    expect(isMapWatchPage(pageOf(doc({ items: [mapTile()] })))).toBe(false);
    expect(isMapWatchPage(pageOf(doc({ mapPage: false, items: [mapTile()] })))).toBe(false);
    expect(isMapWatchPage(pageOf(doc({ mapPage: "true", items: [mapTile()] })))).toBe(false);
  });

  it("is a normal page with the key and no Home map tile", () => {
    expect(isMapWatchPage(pageOf(doc({ mapPage: true, items: [lampTile()] })))).toBe(false);
    expect(isMapWatchPage(pageOf(doc({ mapPage: true })))).toBe(false);
  });

  it("counts the first Home map tile when there are several", () => {
    const second = { ...mapTile(), id: "C3A0E000-0000-4000-8000-0000000000A9", entityId: "home_map.OTHER" };
    const page = pageOf(doc({ mapPage: true, items: [lampTile(), mapTile(), second] }));
    expect(isMapWatchPage(page)).toBe(true);
    expect(watchMapPageTile(page)?.id).toBe(MAP_TILE);
  });
});

describe("a new map page", () => {
  it("is a new page with mapPage true and one Home map tile on the floor, across the top", () => {
    n = 0;
    const page = newMapWatchPage("c3a0e000-0000-4000-8000-0000000000a1", "Home", FLOOR, { newId: ids });
    expect(page.id).toBe(PAGE);
    expect(page.name).toBe("Home");
    expect(page.mapPage).toBe(true);
    expect(isMapWatchPage(page)).toBe(true);
    const tiles = watchPageTiles(page);
    expect(tiles).toHaveLength(1);
    expect(tiles[0]).toMatchObject({ id: "00000000-0000-4000-8000-000000000001", entityId: `home_map.${FLOOR}`, gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 6 });
    // The page's keys stay in the phone's sorted order.
    const keys = Object.keys(page);
    expect(keys).toEqual([...keys].sort());
  });

  it("starts on the map's first floor with a room, and is refused without one", () => {
    expect(watchMapPageFloorId(fixture())).toBe(FLOOR);
    expect(watchMapPageRefusal(fixture())).toBeUndefined();
    expect(watchMapPageFloorId(undefined)).toBeUndefined();
    expect(watchMapPageRefusal(null)).toBe(WATCH_MAP_PAGE_WORDS.noMap);
    const empty: HomeMapDocument = { v: 1, floors: [{ id: "F", name: "Attic", story: 0, rooms: [], pins: [] }] };
    expect(watchMapPageRefusal(empty)).toBe("Scan a room in the iPhone app first.");
  });
});

describe("the Map page switch", () => {
  it("on a page with only its Home map tile keeps it, moved to the top across the width", () => {
    const d = doc({ items: [mapTile({ groupId: "G1" })], groups: [{ id: "G1" }] });
    expect(watchMapPageRemovedCount(d, PAGE)).toBe(0);
    const next = setWatchMapPage(d, PAGE, true, undefined);
    const page = pageOf(next);
    expect(page.mapPage).toBe(true);
    expect(page.groups).toEqual([]);
    expect(watchPageTiles(page)).toEqual([{ id: MAP_TILE, entityId: `home_map.${FLOOR}`, gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 6 }]);
  });

  it("on a page with other tiles removes them and says how many first", () => {
    const d = doc({ items: [lampTile(), mapTile(), { ...lampTile(), id: "X", entityId: "switch.fan" }] });
    expect(watchMapPageRemovedCount(d, PAGE)).toBe(2);
    const page = pageOf(setWatchMapPage(d, PAGE, true, FLOOR));
    expect(watchPageTiles(page).map((t) => t.id)).toEqual([MAP_TILE]);
    expect(isMapWatchPage(page)).toBe(true);
  });

  it("on a page with no Home map tile adds one on the floor given, and is refused without one", () => {
    const d = doc({ items: [lampTile()] });
    expect(watchMapPageRemovedCount(d, PAGE)).toBe(1);
    expect(setWatchMapPage(d, PAGE, true, undefined)).toBe(d);
    n = 10;
    const page = pageOf(setWatchMapPage(d, PAGE, true, FLOOR, { newId: ids }));
    expect(watchPageTiles(page)).toHaveLength(1);
    expect(watchPageTiles(page)[0]).toMatchObject({ id: "00000000-0000-4000-8000-000000000011", entityId: `home_map.${FLOOR}`, gridCol: 0, gridRow: 0, colSpan: 12 });
    expect(page.mapPage).toBe(true);
  });

  it("on an empty page adds the tile", () => {
    const page = pageOf(setWatchMapPage(doc({}), PAGE, true, FLOOR, { newId: ids }));
    expect(isMapWatchPage(page)).toBe(true);
  });

  it("off keeps the tile and drops the key", () => {
    const d = doc({ mapPage: true, items: [mapTile({ gridRow: 0, colSpan: 12 })] });
    expect(watchMapPageRemovedCount(d, PAGE)).toBeUndefined();
    const page = pageOf(setWatchMapPage(d, PAGE, false));
    expect(Object.hasOwn(page, "mapPage")).toBe(false);
    expect(watchPageTiles(page).map((t) => t.id)).toEqual([MAP_TILE]);
    expect(isMapWatchPage(page)).toBe(false);
  });

  it("changes nothing that is already so, and nothing on a smart or missing page", () => {
    const on = doc({ mapPage: true, items: [mapTile({ gridRow: 0, gridCol: 0, colSpan: 12 })] });
    expect(setWatchMapPage(on, PAGE, true, FLOOR)).toBe(on);
    const off = doc({ items: [mapTile()] });
    expect(setWatchMapPage(off, PAGE, false)).toBe(off);
    const smart = doc({ dynamicConfig: {}, items: [] });
    expect(setWatchMapPage(smart, PAGE, true, FLOOR)).toBe(smart);
    expect(watchMapPageRemovedCount(smart, PAGE)).toBeUndefined();
    expect(setWatchMapPage(off, "NOPE", true, FLOOR)).toBe(off);
  });

  it("is turned back into a page with the key over a stray mapPage and no tile", () => {
    const stray = doc({ mapPage: true, items: [lampTile()] });
    expect(watchMapPageRemovedCount(stray, PAGE)).toBe(1);
    expect(isMapWatchPage(pageOf(setWatchMapPage(stray, PAGE, true, FLOOR, { newId: ids })))).toBe(true);
  });

  it("goes when the page is made smart", () => {
    const page = pageOf(convertToSmartPage(doc({ mapPage: true, items: [mapTile()] }), PAGE));
    expect(Object.hasOwn(page, "mapPage")).toBe(false);
    expect(page.items).toEqual([]);
  });
});

describe("Add tile's Map page", () => {
  it("counts every tile it would remove, the Home map tile too", () => {
    expect(watchMapPageAddRemovedCount(doc({ items: [lampTile(), mapTile()] }), PAGE)).toBe(2);
    expect(watchMapPageAddRemovedCount(doc({}), PAGE)).toBe(0);
  });

  it("makes the page a map page with one new Home map tile on the floor picked, across the top", () => {
    n = 20;
    const d = doc({ items: [lampTile({ groupId: "G1" }), mapTile()], groups: [{ id: "G1" }] });
    const page = pageOf(makeWatchMapPage(d, PAGE, LIVING_FLOOR, { newId: ids }));
    expect(page.mapPage).toBe(true);
    expect(page.groups).toEqual([]);
    expect(watchPageTiles(page)).toHaveLength(1);
    expect(watchPageTiles(page)[0]).toMatchObject({ id: "00000000-0000-4000-8000-000000000021", entityId: `home_map.${LIVING_FLOOR}`, gridCol: 0, gridRow: 0, colSpan: 12 });
    expect(isMapWatchPage(page)).toBe(true);
  });

  it("changes nothing on a map page already, a smart or missing page, or without a floor", () => {
    const on = doc({ mapPage: true, items: [mapTile()] });
    expect(watchMapPageAddRemovedCount(on, PAGE)).toBeUndefined();
    expect(makeWatchMapPage(on, PAGE, FLOOR)).toBe(on);
    const smart = doc({ dynamicConfig: {}, items: [] });
    expect(watchMapPageAddRemovedCount(smart, PAGE)).toBeUndefined();
    expect(makeWatchMapPage(smart, PAGE, FLOOR)).toBe(smart);
    const plain = doc({ items: [lampTile()] });
    expect(makeWatchMapPage(plain, PAGE, "")).toBe(plain);
    expect(makeWatchMapPage(plain, "NOPE", FLOOR)).toBe(plain);
  });

  it("asks with how many tiles go", () => {
    expect(WATCH_MAP_PAGE_WORDS.addAsk(1)).toContain("the 1 tile");
    expect(WATCH_MAP_PAGE_WORDS.addAsk(3)).toContain("the 3 tiles");
  });
});

describe("the guards", () => {
  const map = () => doc({ mapPage: true, items: [mapTile({ gridRow: 0, colSpan: 12 })] });

  it("refuse an add, with its own reason", () => {
    const d = map();
    expect(watchAddRefusal(d, PAGE, "light.lamp")).toBe("mapPage");
    expect(addNewWatchTile(d, PAGE, { kind: "spacer" })).toEqual({ document: d, refusal: "mapPage" });
    expect(addNewWatchTile(d, PAGE, { kind: "homeMap", floor: { id: FLOOR } }).refusal).toBe("mapPage");
  });

  it("refuse moving, nudging, resizing and removing the map tile", () => {
    const d = map();
    expect(dropWatchTile(d, PAGE, MAP_TILE, { row: 3, col: 0 })).toBe(d);
    expect(nudgeWatchTile(d, PAGE, MAP_TILE, "down")).toBe(d);
    expect(resizeWatchTile(d, PAGE, MAP_TILE, { row: 0, col: 0, rowSpan: 3, colSpan: 6 })).toBe(d);
    expect(deleteWatchTile(d, PAGE, MAP_TILE)).toBe(d);
  });

  it("let the Map card change the tile's floor, room and look", () => {
    const d = map();
    const room = setWatchHomeMapRoom(d, PAGE, MAP_TILE, LIVING);
    expect(watchMapPageTile(pageOf(room))?.homeMapRoomId).toBe(LIVING);
    const look = setWatchHomeMapLook(d, PAGE, MAP_TILE, "night", fixture());
    expect(watchMapPageTile(pageOf(look))?.homeMapLook).toBe("night");
    const floor = setWatchHomeMapFloor(d, PAGE, MAP_TILE, "OTHER");
    expect(watchMapPageTile(pageOf(floor))?.entityId).toBe("home_map.OTHER");
  });

  it("let a normal page with a stray key edit its tiles", () => {
    const d = doc({ mapPage: true, items: [lampTile()] });
    expect(watchAddRefusal(d, PAGE, "light.other")).toBeUndefined();
    expect(deleteWatchTile(d, PAGE, LAMP_TILE)).not.toBe(d);
  });

  it("let the page be deleted", () => {
    const d = map();
    expect(findWatchPage(deleteWatchPage(d, PAGE), PAGE)).toBeUndefined();
  });
});

// ── the picture ──────────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in node && "values" in node) {
    const t = node as Tpl;
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

describe("the preview", () => {
  const page = () => pageOf(doc({ mapPage: true, items: [mapTile({ gridRow: 0, colSpan: 12, homeMapLook: "blueprint" })] }));
  const phone = phonePagesLayout(undefined, { look: "iphone" });
  const input = (p: WatchPage, onPhone: boolean, read = true): WatchPagePreviewInput => ({
    page: p, pages: [p], screen: onPhone ? phonePagesScreen(phone) : REFERENCE_CASE.screen, scale: 1, stateMode: "live",
    ...(onPhone ? { phone } : {}),
    ...(read ? { homeMap: fixture() } : {}),
  });

  it("draws the whole pages area as the map on the iPhone, warm, whatever the tile's own look", () => {
    const text = flatten(renderWatchPagePreview(input(page(), true)));
    expect(text).toContain(`data-map-page=${FLOOR}`);
    expect(text).toContain(`data-look=warm`);
    expect(text).not.toContain("blueprint");
    expect(text).not.toContain("wp-hm-face");
    expect(text).not.toContain("wp-fold");
    expect(watchPagePreviewScrolls(page(), phonePagesScreen(phone), true)).toBe(false);
  });

  it("draws the room the tile names", () => {
    const p = pageOf(doc({ mapPage: true, items: [mapTile({ homeMapRoomId: LIVING })] }));
    const art = flatten(renderMapPageArt(input(p, true), 300, 500, 1));
    expect(art).toContain(`data-map-page=${FLOOR}`);
    expect(art).toContain("Living");
    expect(art).not.toContain("Kitchen");
  });

  it("shows the house and why before the map is read", () => {
    const text = flatten(renderWatchPagePreview(input(page(), true, false)));
    expect(text).toContain("wp-map-page wp-hm-empty");
    expect(text).toContain("Home map");
  });

  it("draws the grid with the Home map tile on the watch, the fallback", () => {
    const text = flatten(renderWatchPagePreview(input(page(), false)));
    expect(text).toContain("wp-hm-face");
    expect(text).toContain("data-look=blueprint");
    expect(text).not.toContain("data-map-page");
  });

  it("draws a page with the key and no Home map tile as a normal page", () => {
    const p = pageOf(doc({ mapPage: true, items: [lampTile()] }));
    expect(flatten(renderWatchPagePreview(input(p, true)))).not.toContain("data-map-page");
  });

  it("draws a library row's iPhone picture as the map once the map is in, and the tile on a watch", () => {
    const withMap = flatten(renderPageRowPicture({ page: page(), iphone: true, homeMap: fixture() }));
    expect(withMap).toContain(`data-map-page=${FLOOR}`);
    expect(flatten(renderPageRowPicture({ page: page(), iphone: true }))).not.toContain("data-map-page");
    expect(flatten(renderPageRowPicture({ page: page(), homeMap: fixture() }))).not.toContain("data-map-page");
    expect(itemDetail("pages", page())).toBe("Map page");
    expect(itemDetail("pages", pageOf(doc({ items: [mapTile()] })))).toBe("1 tile");
  });

  it("says how each device draws it under Side by side", () => {
    expect(deviceDifferenceText(page(), "watch")).toBe("The watch shows the Home map tile.");
    expect(deviceDifferenceText(page(), "iphone")).toBe("The whole page is the live 3D map.");
    expect(deviceDifferenceText(pageOf(doc({ items: [mapTile()] })), "watch")).toBe("");
  });
});
