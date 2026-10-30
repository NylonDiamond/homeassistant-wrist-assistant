// A map page in the page editor (app repo docs/home_map_plan_2026-10.md,
// "Map page"), against a stand-in Home Assistant: the breadcrumb, the page's
// Map card with the tile's floor and room and its look keys under "On the
// watch", the Map page switch in iPhone view (on with and without other
// tiles, the question, off), the guards that keep the tile out of reach on
// the stage, and the stage drawing the map over the whole iPhone page.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import type { HomeMapDocument } from "../src/home-map/model.js";
import { forgetHomeMap, keepHomeMap, setHomeMapCapable } from "../src/home-map/store.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import { WATCH_MAP_PAGE_WORDS } from "../src/watch-pages/map-page.js";
import { type JsonObject, type WatchPage, type WatchPagesDocument, isMapWatchPage, watchPageTiles } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return items.map((item, i) => flat((draw as (x: unknown, i: number) => unknown)(item, i))).join("");
    return flat(items);
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

// The settings ask for the focused field (`document.activeElement`), and a
// selection that goes ends a drag's window listeners; Node has neither.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { window?: unknown }).window ??= { addEventListener: () => undefined, removeEventListener: () => undefined };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

const FIXTURE_TEXT =readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const U = (n: number) => `3A9E0000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const PAGE = U(1);
const MAP_TILE = U(2);
const LAMP_TILE = U(3);
const mapTile = (extra: JsonObject = {}): JsonObject => ({ id: MAP_TILE, entityId: `home_map.${FLOOR}`, gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 6, ...extra });
const lampTile = (): JsonObject => ({ id: LAMP_TILE, entityId: "light.lamp", gridCol: 0, gridRow: 6, colSpan: 4, rowSpan: 4 });

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

let made = 0;

function hassStandIn(): HassLike {
  return {
    user: { is_admin: true },
    states: {},
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        const type = msg.type as string;
        if (type.endsWith("watch_config/get")) return Promise.resolve({ kind: msg.kind, revision: 0, document: null });
        if (type.endsWith("watch_config/history")) return Promise.resolve({ entries: [] });
        if (type.endsWith("/list")) return Promise.resolve({ records: [] });
        return Promise.reject({ code: "unknown_command", message: type });
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
  } as unknown as HassLike;
}

/** The page editor on a library page holding `page`, previewed on the
 * home's iPhone (or its watch), with the fixture's map read unless `map` is
 * false. */
function editor(page: JsonObject, opts: { preview?: "iphone" | "watch"; map?: boolean } = {}) {
  const n = ++made;
  const watch = `mp-w1-${n}`;
  const phone = `mp-p1-${n}`;
  const owners = [
    owner({ owner_watch_id: watch, device_name: "Jesse's Watch", main_house: true }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true }),
  ];
  const pages: WatchPagesDocument = { schemaVersion: 1, pages: [{ name: "House", items: [], ...page, id: PAGE }] };
  const hass = hassStandIn();
  if (opts.map !== false) {
    setHomeMapCapable(true);
    keepHomeMap(hass, { doc: JSON.parse(FIXTURE_TEXT) as HomeMapDocument, rev: 1 });
  }
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = hass;
  el.owners = owners;
  el.phones = true;
  const ref = { kind: "pages" as const, id: PAGE };
  el.libraryItem = ref;
  el.openedItem = ref;
  const iphone = opts.preview !== "watch";
  el.previewKind = iphone ? "iphone" : "watch";
  el.watchId = iphone ? phone : watch;
  const key = libraryDraftKey(ref);
  forgetWatchPagesDraft(key);
  el.record = { kind: "pages", revision: 4, hash: null, updated_at: null, updated_by: null, delivered_revision: 0, delivered_at: null, document: pages } as unknown as WatchConfigRecord;
  takeWatchPagesRecord(key, pages, 4);
  el.selectedPageId = PAGE;
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.leaveTile = () => undefined;
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  const pageNow = (): WatchPage => ((el.draft as { document: WatchPagesDocument }).document.pages as WatchPage[])[0]!;
  const cards = () => flat(call("renderPageCards", pageNow(), call("editorHost", pageNow())));
  const inspector = () => flat(call("renderInspector", pageNow(), undefined, [pageNow()]));
  return { el, call, pageNow, cards, inspector, body: () => flat(call("renderBody", owners)) };
}

afterEach(() => forgetHomeMap());

describe("a map page in the inspector", () => {
  it("is named Map page in the breadcrumb and the page picker", () => {
    const t = editor({ mapPage: true, items: [mapTile()] });
    expect(t.inspector()).toContain(`>${WATCH_MAP_PAGE_WORDS.kind}</span>`);
    expect(flat(t.call("renderPagePicker", t.pageNow(), [t.pageNow()], undefined))).toContain("Map page ·");
  });

  it("has a Map card with the tile's floor and room, and its look keys under On the watch, without Tap lights", () => {
    const text = editor({ mapPage: true, items: [mapTile()] }).cards();
    expect(text).toContain(">Map<");
    expect(text).toContain("Floor");
    expect(text).toContain("Room");
    expect(text).toContain("Whole floor");
    expect(text).toContain("On the watch");
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.watchNote);
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.phoneNote);
    expect(text).toContain("Look");
    expect(text).toContain("Room names");
    expect(text).not.toContain("Tap lights");
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.stage);
  });

  it("has no Map card on a normal page", () => {
    expect(editor({ items: [mapTile()] }).cards()).not.toContain("On the watch</div>");
  });

  it("offers the Map page switch in iPhone view only, with no Smart page switch on a map page", () => {
    const map = editor({ mapPage: true, items: [mapTile()] }).cards();
    expect(map).toContain("pe-map-switch");
    expect(map).toContain("ALPHA");
    expect(map).toContain(WATCH_MAP_PAGE_WORDS.switchDetail);
    expect(map).not.toContain("Fills itself from its rules");
    const plain = editor({ items: [lampTile()] }).cards();
    expect(plain).toContain("pe-map-switch");
    expect(plain).toContain("Fills itself from its rules");
    expect(editor({ items: [lampTile()] }, { preview: "watch" }).cards()).not.toContain("pe-map-switch");
  });

  it("greys the switch with the reason while the page has no Home map tile and the home no map", () => {
    const text = editor({ items: [lampTile()] }, { map: false }).cards();
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.noMap);
  });
});

describe("the Map page switch", () => {
  it("on a page with other tiles asks first, then keeps the Home map tile alone", () => {
    const t = editor({ items: [lampTile(), mapTile({ gridRow: 4, colSpan: 6 })] });
    t.call("mapSwitchPressed", t.pageNow(), true);
    expect(t.el.mapAsk).toBe(PAGE);
    expect(isMapWatchPage(t.pageNow())).toBe(false);
    const ask = t.cards();
    expect(ask).toContain(WATCH_MAP_PAGE_WORDS.askTitle);
    expect(ask).toContain("This removes 1 tile.");
    t.call("applyMapPage", PAGE, true);
    expect(isMapWatchPage(t.pageNow())).toBe(true);
    expect(watchPageTiles(t.pageNow()).map((x) => x.id)).toEqual([MAP_TILE]);
    expect(watchPageTiles(t.pageNow())[0]).toMatchObject({ gridRow: 0, colSpan: 12 });
    // One undo step brings the lamp back.
    (t.el.draft as { undo(): boolean }).undo();
    expect(watchPageTiles(t.pageNow()).map((x) => x.id)).toEqual([LAMP_TILE, MAP_TILE]);
  });

  it("on an empty page adds a Home map tile on the map's first floor at once", () => {
    const t = editor({});
    t.call("mapSwitchPressed", t.pageNow(), true);
    expect(t.el.mapAsk).toBeUndefined();
    expect(isMapWatchPage(t.pageNow())).toBe(true);
    expect(watchPageTiles(t.pageNow())[0]!.entityId).toBe(`home_map.${FLOOR}`);
  });

  it("off makes a normal page that keeps its tile", () => {
    const t = editor({ mapPage: true, items: [mapTile()] });
    t.call("mapSwitchPressed", t.pageNow(), false);
    expect(Object.hasOwn(t.pageNow(), "mapPage")).toBe(false);
    expect(watchPageTiles(t.pageNow()).map((x) => x.id)).toEqual([MAP_TILE]);
  });
});

describe("the guards on the stage", () => {
  it("never select the map tile, and refuse Add tile with the reason", () => {
    const t = editor({ mapPage: true, items: [mapTile()] });
    t.el.selectedTileId = MAP_TILE;
    t.call("reconcileSelection");
    expect(t.el.selectedTileId).toBeUndefined();
    t.call("openAddTile");
    expect(t.el.addTileOpen).toBe(false);
    t.call("selectAll");
    expect((t.el.multi as Set<string>).size).toBe(0);
    const add = flat(t.call("renderStageAddTile", t.pageNow()));
    expect(add).toContain("disabled");
    expect(add).toContain("This is a map page");
  });

  it("draw the map over the whole iPhone page, with the reason line, and nothing to drag", () => {
    const text = editor({ mapPage: true, items: [mapTile()] }).body();
    expect(text).toContain(`data-map-page=${FLOOR}`);
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.stage);
    expect(text).not.toContain("pe-resize");
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.phoneDifference);
  });

  it("draw the watch's grid with the tile in Watch view, saying so", () => {
    const text = editor({ mapPage: true, items: [mapTile()] }, { preview: "watch" }).body();
    expect(text).not.toContain("data-map-page");
    expect(text).toContain("wp-hm-face");
    expect(text).toContain(WATCH_MAP_PAGE_WORDS.watchDifference);
  });
});
