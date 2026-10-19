// The device table: which device draws each tile kind and reads each tile
// key. One table in the panel (`tile-devices.json`), mirrored in const.py
// (`tests/test_tile_devices.py`) and in the app (`WatchPagesTablesTests`).
//
// Plan: app repo docs/phone_native_pages_plan_2026-10.md, phase 0, and the
// names in docs/phone_native_contract.md.

import { describe, expect, it } from "vitest";

import tileDevicesTable from "../src/watch-pages/tile-devices.json";
import tileDefaults from "../src/watch-pages/tile-defaults.json";
import pageKeys from "../src/watch-pages/page-keys.json";
import { checkWatchPagesValues } from "../src/watch-pages/merge.js";
import {
  VIRTUAL_TILE_KINDS,
  WATCH_GRID_COLUMNS,
  type WatchPage,
  type WatchPageTile,
  keyDevices,
  tileDevices,
  tileDrawsOn,
} from "../src/watch-pages/model.js";
import { watchReflowPage } from "../src/watch-pages/preview.js";

const TABLE = tileDevicesTable as unknown as {
  version: number;
  kinds: Record<string, string[]>;
  keys: Record<string, string[]>;
};

const BOTH = ["watch", "iphone"];
const PHONE = ["iphone"];
const PHONE_ONLY_KINDS = ["chart", "map", "text_field", "web"];
const PHONE_ONLY_KEYS = ["cameraTileLive", "mediaArtwork", "sensorChart", "templateLines"];

describe("tile-devices.json", () => {
  it("lists every virtual kind and every addable domain, and nothing else", () => {
    const addable = (tileDefaults.addable as { domain: string }[]).map((a) => a.domain);
    const expected = new Set([...Object.keys(VIRTUAL_TILE_KINDS), ...addable]);
    expect(TABLE.version).toBe(1);
    expect(Object.keys(TABLE.kinds).sort()).toEqual([...expected].sort());
    expect(Object.keys(TABLE.kinds)).toHaveLength(67);
  });

  it("gives each kind and key both devices or the iPhone only", () => {
    for (const [name, devices] of [...Object.entries(TABLE.kinds), ...Object.entries(TABLE.keys)]) {
      expect([BOTH, PHONE], name).toContainEqual(devices);
    }
  });

  it("makes map, chart, text field and web card the only iPhone only kinds", () => {
    const phoneOnly = Object.entries(TABLE.kinds).filter(([, d]) => d.length === 1).map(([k]) => k);
    expect(phoneOnly.sort()).toEqual(PHONE_ONLY_KINDS);
  });

  it("lists only iPhone only keys, each one a tile key page-keys.json knows", () => {
    const tileKeys = (pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys;
    expect(Object.keys(TABLE.keys).sort()).toEqual(PHONE_ONLY_KEYS);
    for (const [key, devices] of Object.entries(TABLE.keys)) {
      expect(devices, key).toEqual(PHONE);
      expect(Object.hasOwn(tileKeys, key), key).toBe(true);
    }
  });

  it("is read by tileDevices and keyDevices, and an unknown name reads as both", () => {
    expect(tileDevices("light")).toEqual(BOTH);
    expect(tileDevices("divider")).toEqual(BOTH);
    for (const kind of PHONE_ONLY_KINDS) expect(tileDevices(kind)).toEqual(PHONE);
    expect(tileDevices("macro")).toEqual(BOTH);
    expect(tileDevices("not_a_kind")).toEqual(BOTH);
    expect(tileDevices("")).toEqual(BOTH);
    for (const key of PHONE_ONLY_KEYS) expect(keyDevices(key)).toEqual(PHONE);
    expect(keyDevices("customLabel")).toEqual(BOTH);
    expect(keyDevices("not_a_key")).toEqual(BOTH);
    // A table lookup, not an object lookup: inherited names are unknown.
    expect(tileDevices("constructor")).toEqual(BOTH);
    expect(keyDevices("toString")).toEqual(BOTH);
  });

  it("answers tileDrawsOn by the kind in the entity id", () => {
    const id = "6F1C1E0A-0000-4000-8000-000000000009";
    expect(tileDrawsOn({ entityId: `map.${id}` }, "watch")).toBe(false);
    expect(tileDrawsOn({ entityId: `map.${id}` }, "iphone")).toBe(true);
    expect(tileDrawsOn({ entityId: `text_field.${id}` }, "watch")).toBe(false);
    expect(tileDrawsOn({ entityId: "light.kitchen" }, "watch")).toBe(true);
    expect(tileDrawsOn({ entityId: "light.kitchen" }, "iphone")).toBe(true);
    // A text entity is not a text field.
    expect(tileDrawsOn({ entityId: "text.note" }, "watch")).toBe(true);
    expect(tileDrawsOn({}, "watch")).toBe(true);
  });

  it("leaves an iPhone only tile out of the watch's reflow and keeps it on the iPhone's", () => {
    const id = "6F1C1E0A-0000-4000-8000-00000000000A";
    const map = { id: "M", entityId: `map.${id}`, gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 4 } as WatchPageTile;
    const lamp = { id: "L", entityId: "light.lamp", gridRow: 0, gridCol: 6, colSpan: 6, rowSpan: 4 } as WatchPageTile;
    const page = { id: "P", name: "Home", items: [map, lamp] } as WatchPage;
    // With states and without (the all-on picture), the watch packs the
    // lamp into the map's place.
    for (const states of [{}, undefined]) {
      const packed = watchReflowPage(page, states).items as WatchPageTile[];
      expect(packed.map((t) => t.id)).toEqual(["L"]);
      expect(packed[0]!.gridCol).toBe(0);
      expect(watchReflowPage(page, states, WATCH_GRID_COLUMNS, undefined, "iphone")).toBe(page);
    }
    const plain = { id: "P", name: "Home", items: [lamp] } as WatchPage;
    expect(watchReflowPage(plain, undefined)).toBe(plain);
  });

  it("names the four iPhone only kinds", () => {
    expect(VIRTUAL_TILE_KINDS.map).toBe("Map");
    expect(VIRTUAL_TILE_KINDS.chart).toBe("Chart");
    expect(VIRTUAL_TILE_KINDS.text_field).toBe("Text field");
    expect(VIRTUAL_TILE_KINDS.web).toBe("Web card");
  });
});

describe("checkWatchPagesValues and the iPhone only tiles", () => {
  const ids = (n: number) => `6F1C1E0A-0000-4000-8000-00000000000${n}`;
  const document = (items: Record<string, unknown>[]) => ({
    schemaVersion: 1,
    pages: [{ id: ids(1), name: "Home", items }],
  });

  it("finds nothing wrong with iPhone only keys and kinds on a page a watch shows", () => {
    const doc = document([
      { id: ids(2), entityId: "camera.door", cameraTileLive: false },
      { id: ids(3), entityId: "sensor.power", sensorChart: "6h" },
      { id: ids(4), entityId: "media_player.den", mediaArtwork: true },
      { id: ids(5), entityId: `template.${ids(5)}`, templateLines: 8 },
      { id: ids(6), entityId: `map.${ids(6)}`, mapEntityIds: ["person.ann", "zone.home"], mapZoom: "city", mapStyle: "satellite" },
      { id: ids(7), entityId: `chart.${ids(7)}`, chartEntityIds: ["sensor.power"], chartRange: "7d", chartStyle: "area" },
      {
        id: ids(8),
        entityId: `text_field.${ids(8)}`,
        textTargetKind: "script",
        textTargetId: "script.note",
        textTargetField: "message",
        textPlaceholder: "Say something",
        textSubmit: "button",
      },
      { id: ids(9), entityId: `web.${ids(9)}`, webURL: "https://example.com", webScroll: false, webInteractive: false },
    ]);
    expect(checkWatchPagesValues(doc)).toEqual([]);
  });

  it("keeps an enum value it does not know on the new keys, as the devices read it as the default", () => {
    const doc = document([
      { id: ids(2), entityId: "sensor.power", sensorChart: "30d" },
      { id: ids(3), entityId: `map.${ids(3)}`, mapZoom: "world", mapStyle: "hybrid" },
      { id: ids(4), entityId: `chart.${ids(4)}`, chartRange: "1y", chartStyle: "pie" },
      { id: ids(5), entityId: `text_field.${ids(5)}`, textTargetKind: "webhook", textSubmit: "swipe" },
    ]);
    expect(checkWatchPagesValues(doc)).toEqual([]);
    const page = { schemaVersion: 1, pages: [{ id: ids(1), name: "Home", gridDensity: "dense", items: [] }] };
    expect(checkWatchPagesValues(page)).toEqual([]);
  });

  it("still checks the new keys by type, as the watch decodes them", () => {
    const doc = document([
      { id: ids(2), entityId: "camera.door", cameraTileLive: "yes" },
      { id: ids(3), entityId: `template.${ids(3)}`, templateLines: 2.5 },
      { id: ids(4), entityId: `chart.${ids(4)}`, chartEntityIds: "sensor.power" },
    ]);
    expect(checkWatchPagesValues(doc).sort()).toEqual([
      'Page 1 ("Home"), tile 1 (camera.door): cameraTileLive is not true or false.',
      `Page 1 ("Home"), tile 2 (template.${ids(3)}): templateLines is not a whole number.`,
      `Page 1 ("Home"), tile 3 (chart.${ids(4)}): chartEntityIds is not a list.`,
    ]);
  });
});
