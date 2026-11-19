// Tap areas on a template tile (`templateTaps`). The reader must match the
// app's `TemplateTileTaps`: both pass the samples in `tile-app.json`
// `template.taps`.

import { describe, expect, it } from "vitest";
import tileApp from "../src/watch-pages/tile-app.json";
import pageKeys from "../src/watch-pages/page-keys.json";
import { setWatchTemplateMapZoom, setWatchTemplateRefreshMinutes, setWatchTemplateTaps, watchTemplateHasMapsTap, watchTemplateMapZoom, watchTemplateRefreshMinutes, watchTemplateTaps } from "../src/watch-pages/app-model.js";
import { watchRefreshLabel, watchTemplateMapZoomMenu, watchTemplateRefreshMenu } from "../src/watch-pages/tile-settings-options.js";
import { keyDevices, type WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  TEMPLATE_TAPS,
  movedTemplateTapArea,
  newTemplateTapArea,
  normalizeTemplateTaps,
  resizedTemplateTapArea,
  spannedTemplateTapArea,
  templateTapAt,
  templateTapBoxAround,
  templateTapMarker,
  templateTapMarkerLoses,
  withTemplateTapAction,
  withTemplateTapConfirm,
  withTemplateTapItem,
  withTemplateTapServiceExtras,
} from "../src/watch-pages/template-taps.js";

const PAGE = "P";
const TILE = "T";
const TEMPLATE = "template.6F3A";
const document = (extra: Record<string, unknown> = {}, entityId = TEMPLATE) =>
  ({ schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [{ id: TILE, entityId, ...extra }] }] }) as unknown as WatchPagesDocument;
const stored = (doc: WatchPagesDocument) => (doc as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

describe("Tap areas", () => {
  it("reads every shared sample as the app does", () => {
    const samples = tileApp.template.taps.samples as { input: unknown; areas: unknown }[];
    expect(samples.length).toBeGreaterThan(0);
    for (const sample of samples) expect(normalizeTemplateTaps(sample.input)).toEqual(sample.areas);
    // The keys come out in the samples' order too.
    for (const sample of samples) expect(JSON.stringify(normalizeTemplateTaps(sample.input))).toBe(JSON.stringify(sample.areas));
  });

  it("takes its numbers from the shared table", () => {
    expect(TEMPLATE_TAPS).toEqual({ key: "templateTaps", max: 8, minSize: 0.05, maxText: 2000, actions: ["maps", "link", "refresh", "page", "toggle", "script", "scene", "service", "http", "control"] });
    // Every action has a label in the panel.
    for (const a of TEMPLATE_TAPS.actions) expect(tileApp.template.taps.actionLabels[a]).toBeTruthy();
    expect(keyDevices("templateTaps")).toEqual(["watch", "iphone"]);
    expect((pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys["templateTaps"]).toEqual({ type: "json", required: false });
  });

  it("writes only the areas the rule keeps, and an empty list removes the key", () => {
    const doc = setWatchTemplateTaps(document(), PAGE, TILE, [{ x: -1, y: 0, w: 2, h: 0.5, action: "refresh", extra: 1 }, { x: 0, y: 0, w: 1, h: 1, action: "maps" }]);
    expect(stored(doc)["templateTaps"]).toEqual([{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }]);
    expect(watchTemplateTaps(stored(doc) as never)).toEqual([{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }]);
    expect(Object.hasOwn(stored(setWatchTemplateTaps(doc, PAGE, TILE, [])), "templateTaps")).toBe(false);
    expect(Object.hasOwn(stored(setWatchTemplateTaps(document(), PAGE, TILE, [{ action: "dance" }])), "templateTaps")).toBe(false);
    // The same list again is no change; another kind of tile is never written.
    expect(setWatchTemplateTaps(doc, PAGE, TILE, [{ x: 0, y: 0, w: 1, h: 0.5, action: "refresh" }])).toBe(doc);
    const light = document({}, "light.kitchen");
    expect(setWatchTemplateTaps(light, PAGE, TILE, [newTemplateTapArea()])).toBe(light);
  });

  it("edits an area inside the face", () => {
    const area = newTemplateTapArea();
    expect(area).toEqual({ x: 0.25, y: 0.25, w: 0.5, h: 0.5, action: "refresh" });
    expect(movedTemplateTapArea(area, 0.9, -0.2)).toEqual({ ...area, x: 0.5, y: 0 });
    expect(resizedTemplateTapArea(area, 2, 0.26)).toEqual({ ...area, w: 0.75, h: 0.05 });
    expect(spannedTemplateTapArea({ x: 0.6, y: 0.8 }, { x: 0.2, y: 0.81 })).toEqual({ x: 0.2, y: 0.8, w: 0.4, h: 0.05, action: "refresh" });
    expect(withTemplateTapAction(area, "maps", " zone.home ")).toEqual({ ...area, action: "maps", place: "zone.home" });
    // No text for an action that needs it keeps the area as it was.
    expect(withTemplateTapAction(area, "link")).toBe(area);
    expect(withTemplateTapAction({ ...area, action: "maps", place: "a.b" }, "refresh")).toEqual(area);
  });

  it("keeps an entity and data only on a service area", () => {
    const area = newTemplateTapArea();
    expect(withTemplateTapAction(area, "toggle", " light.porch ")).toEqual({ ...area, action: "toggle", entity: "light.porch" });
    expect(withTemplateTapAction(area, "http", "ABC")).toEqual({ ...area, action: "http", http: "ABC" });
    expect(withTemplateTapAction(area, "control")).toBe(area);
    const service = withTemplateTapAction(area, "service", "light.turn_on");
    const full = withTemplateTapServiceExtras(service, { entity: " light.desk ", data: { brightness_pct: 40 } });
    expect(full).toEqual({ ...service, entity: "light.desk", data: { brightness_pct: 40 } });
    expect(normalizeTemplateTaps([full])).toEqual([full]);
    expect(withTemplateTapServiceExtras(full, { entity: "" })).toEqual({ ...service, data: { brightness_pct: 40 } });
    expect(withTemplateTapServiceExtras(full, { data: undefined })).toEqual({ ...service, entity: "light.desk" });
    // Another action keeps no entity or data, and is never given them.
    expect(withTemplateTapAction(full, "refresh")).toEqual(area);
    expect(withTemplateTapServiceExtras(area, { entity: "light.x" })).toBe(area);
    expect(normalizeTemplateTaps([{ ...area, action: "toggle", entity: "light.a", data: { a: 1 } }])).toEqual([{ ...area, action: "toggle", entity: "light.a" }]);
  });

  it("finds the last area under a point, as the devices do", () => {
    const areas = normalizeTemplateTaps([{ x: 0, y: 0, w: 1, h: 1, action: "refresh" }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5, action: "page", page: "p" }]);
    expect(templateTapAt(areas, 0.75, 0.75)).toBe(1);
    expect(templateTapAt(areas, 0.1, 0.1)).toBe(0);
    expect(templateTapAt([], 0.1, 0.1)).toBeUndefined();
  });
});

describe("Ask before running", () => {
  it("keeps confirm only when it is exactly true, last", () => {
    const [area] = normalizeTemplateTaps([{ confirm: true, x: 0, y: 0, w: 1, h: 1, action: "toggle", entity: "light.a" }]);
    expect(Object.keys(area!)).toEqual(["x", "y", "w", "h", "action", "entity", "confirm"]);
    for (const confirm of ["true", 1, false, null, {}]) {
      expect(normalizeTemplateTaps([{ x: 0, y: 0, w: 1, h: 1, action: "refresh", confirm }])).toEqual([{ x: 0, y: 0, w: 1, h: 1, action: "refresh" }]);
    }
    const [service] = normalizeTemplateTaps([{ x: 0, y: 0, w: 1, h: 1, action: "service", service: "a.b", confirm: true, entity: "light.a", data: { k: 1 } }]);
    expect(Object.keys(service!)).toEqual(["x", "y", "w", "h", "action", "service", "entity", "data", "confirm"]);
  });

  it("turns on and off, and survives an action change", () => {
    const area = newTemplateTapArea();
    const on = withTemplateTapConfirm(area, true);
    expect(on).toEqual({ ...area, confirm: true });
    expect(withTemplateTapConfirm(on, false)).toEqual(area);
    expect(Object.hasOwn(withTemplateTapConfirm(on, false), "confirm")).toBe(false);
    const toggle = withTemplateTapAction(on, "toggle", "light.a");
    expect(Object.keys(toggle)).toEqual(["x", "y", "w", "h", "action", "entity", "confirm"]);
    const service = withTemplateTapServiceExtras(withTemplateTapAction(on, "service", "a.b"), { entity: "light.a", data: { k: 1 } });
    expect(Object.keys(service).at(-1)).toBe("confirm");
    const doc = setWatchTemplateTaps(document(), PAGE, TILE, [toggle]);
    expect(stored(doc)["templateTaps"]).toEqual([{ x: 0.25, y: 0.25, w: 0.5, h: 0.5, action: "toggle", entity: "light.a", confirm: true }]);
  });
});

describe("Refresh every", () => {
  const refresh = (value: unknown) => watchTemplateRefreshMinutes({ id: TILE, entityId: TEMPLATE, templateRefreshMinutes: value } as never);

  it("takes its numbers from the shared table", () => {
    const table = tileApp.template.refresh;
    expect([table.key, table.min, table.max, table.menu]).toEqual(["templateRefreshMinutes", 1, 1440, [1, 5, 15, 30, 60]]);
    expect((pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys["templateRefreshMinutes"]).toEqual({ type: "number", required: false });
    expect(keyDevices("templateRefreshMinutes")).toEqual(["watch", "iphone"]);
  });

  it("reads a finite number, rounded and kept in range; anything else is off", () => {
    expect(refresh(5)).toBe(5);
    expect(refresh(4.6)).toBe(5);
    expect(refresh(0)).toBe(1);
    expect(refresh(-3)).toBe(1);
    expect(refresh(5000)).toBe(1440);
    for (const off of [undefined, null, "5", NaN, Infinity, true, [5]]) expect(refresh(off)).toBeUndefined();
  });

  it("writes whole minutes, and Off removes the key", () => {
    const doc = setWatchTemplateRefreshMinutes(document(), PAGE, TILE, 15);
    expect(stored(doc)["templateRefreshMinutes"]).toBe(15);
    expect(setWatchTemplateRefreshMinutes(doc, PAGE, TILE, 15)).toBe(doc);
    expect(Object.hasOwn(stored(setWatchTemplateRefreshMinutes(doc, PAGE, TILE, undefined)), "templateRefreshMinutes")).toBe(false);
    const off = document();
    expect(setWatchTemplateRefreshMinutes(off, PAGE, TILE, undefined)).toBe(off);
    expect(setWatchTemplateRefreshMinutes(off, PAGE, TILE, 0)).toBe(off);
    expect(setWatchTemplateRefreshMinutes(off, PAGE, TILE, 2.5)).toBe(off);
    const light = document({}, "light.kitchen");
    expect(setWatchTemplateRefreshMinutes(light, PAGE, TILE, 5)).toBe(light);
  });

  it("offers Off and the shared minutes, and keeps a stored value it does not offer", () => {
    const tile = (extra: Record<string, unknown>) => ({ id: TILE, entityId: TEMPLATE, ...extra }) as never;
    const menu = watchTemplateRefreshMenu(tile({}));
    expect(menu.options.map((o) => o.label)).toEqual(["Off", "1 min", "5 min", "15 min", "30 min", "1 hour"]);
    expect(menu.options.map((o) => o.value)).toEqual(["off", "1", "5", "15", "30", "60"]);
    expect(menu.selected).toBe("off");
    expect(watchTemplateRefreshMenu(tile({ templateRefreshMinutes: 30 })).selected).toBe("30");
    const odd = watchTemplateRefreshMenu(tile({ templateRefreshMinutes: 7 }));
    expect(odd.options[0]).toMatchObject({ label: "7 min", disabled: true });
    expect(odd.selected).toBe(odd.options[0]!.value);
    expect(watchRefreshLabel(120)).toBe("2 hours");
    expect(watchRefreshLabel(90)).toBe("1 h 30 min");
  });
});

describe("Maps zoom", () => {
  const tile = (extra: Record<string, unknown>) => ({ id: TILE, entityId: TEMPLATE, ...extra }) as never;

  it("takes its values from the shared table", () => {
    const table = tileApp.template.mapZoom;
    expect([table.key, table.values, table.meters]).toEqual(["templateMapZoom", ["street", "close"], { street: 500, close: 150 }]);
    expect((pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys["templateMapZoom"]).toEqual({ type: "string", required: false });
    expect(keyDevices("templateMapZoom")).toEqual(["watch", "iphone"]);
  });

  it("reads a listed value; anything else is Auto", () => {
    expect(watchTemplateMapZoom(tile({ templateMapZoom: "street" }))).toBe("street");
    expect(watchTemplateMapZoom(tile({ templateMapZoom: "close" }))).toBe("close");
    for (const auto of [undefined, null, "auto", "Street", 5, true]) expect(watchTemplateMapZoom(tile({ templateMapZoom: auto }))).toBeUndefined();
  });

  it("writes a value, and Auto removes the key", () => {
    const doc = setWatchTemplateMapZoom(document(), PAGE, TILE, "street");
    expect(stored(doc)["templateMapZoom"]).toBe("street");
    expect(setWatchTemplateMapZoom(doc, PAGE, TILE, "street")).toBe(doc);
    expect(Object.hasOwn(stored(setWatchTemplateMapZoom(doc, PAGE, TILE, undefined)), "templateMapZoom")).toBe(false);
    const off = document();
    expect(setWatchTemplateMapZoom(off, PAGE, TILE, undefined)).toBe(off);
    expect(setWatchTemplateMapZoom(off, PAGE, TILE, "far" as never)).toBe(off);
    const light = document({}, "light.kitchen");
    expect(setWatchTemplateMapZoom(light, PAGE, TILE, "street")).toBe(light);
  });

  it("offers Auto, Street and Close", () => {
    const menu = watchTemplateMapZoomMenu(tile({}));
    expect(menu.options.map((o) => [o.value, o.label])).toEqual([["auto", "Auto"], ["street", "Street"], ["close", "Close"]]);
    expect(menu.selected).toBe("auto");
    expect(watchTemplateMapZoomMenu(tile({ templateMapZoom: "close" })).selected).toBe("close");
  });

  it("is offered only while a tap on the tile can open Maps", () => {
    expect(watchTemplateHasMapsTap(tile({ templateString: "{{ x }}" }))).toBe(false);
    expect(watchTemplateHasMapsTap(tile({ templateString: "Shop [tap:maps 51.5,6.0,Shop]" }))).toBe(true);
    expect(watchTemplateHasMapsTap(tile({ templateString: "[tap:refresh]" }))).toBe(false);
    expect(watchTemplateHasMapsTap(tile({ templateTaps: [{ x: 0, y: 0, w: 1, h: 1, action: "maps", place: "zone.home" }] }))).toBe(true);
  });
});

describe("Taps that follow an item", () => {
  const area = newTemplateTapArea();

  it("keeps item only as ROW.CELL, after the action's fields and before confirm", () => {
    const [toggle] = normalizeTemplateTaps([{ confirm: true, item: "3.1", x: 0, y: 0, w: 1, h: 1, action: "toggle", entity: "light.a" }]);
    expect(Object.keys(toggle!)).toEqual(["x", "y", "w", "h", "action", "entity", "item", "confirm"]);
    const [service] = normalizeTemplateTaps([{ item: "0.0", x: 0, y: 0, w: 1, h: 1, action: "service", service: "a.b", entity: "light.a", data: { k: 1 } }]);
    expect(Object.keys(service!)).toEqual(["x", "y", "w", "h", "action", "service", "entity", "data", "item"]);
    for (const item of ["1", "1.", ".1", "1.2.3", " 1.2", "1.2 ", "a.b", "-1.0", "1.5e1", 1.2, null, true, ["1.2"]]) {
      expect(normalizeTemplateTaps([{ ...area, item }])).toEqual([area]);
    }
    expect(normalizeTemplateTaps([{ ...area, item: "12.40" }])).toEqual([{ ...area, item: "12.40" }]);
  });

  it("follows and stops following, keeping the action and Ask before running", () => {
    const toggle = withTemplateTapConfirm(withTemplateTapAction(area, "toggle", "light.a"), true);
    const follows = withTemplateTapItem(toggle, "2.0", { x: 0.1, y: 0.2, w: 0.3, h: 0.1 });
    expect(follows).toEqual({ x: 0.1, y: 0.2, w: 0.3, h: 0.1, action: "toggle", entity: "light.a", item: "2.0", confirm: true });
    expect(Object.keys(follows).at(-1)).toBe("confirm");
    // Another action keeps the cell it follows.
    expect(withTemplateTapAction(follows, "refresh")).toEqual({ x: 0.1, y: 0.2, w: 0.3, h: 0.1, action: "refresh", item: "2.0", confirm: true });
    expect(withTemplateTapServiceExtras(withTemplateTapAction(follows, "service", "a.b"), { data: { k: 1 } }).item).toBe("2.0");
    const plain = withTemplateTapItem(follows, undefined);
    expect(plain).toEqual({ x: 0.1, y: 0.2, w: 0.3, h: 0.1, action: "toggle", entity: "light.a", confirm: true });
    expect(withTemplateTapItem(area, "x")).toEqual(area);
    const doc = setWatchTemplateTaps(document(), PAGE, TILE, [follows]);
    expect(JSON.stringify(stored(doc)["templateTaps"])).toBe(JSON.stringify([follows]));
  });

  it("boxes a cell's parts, a little bigger, inside the face", () => {
    expect(templateTapBoxAround([])).toBeUndefined();
    expect(templateTapBoxAround([{ x: 0, y: 0, w: 0, h: 0.1 }])).toBeUndefined();
    expect(templateTapBoxAround([{ x: 0.2, y: 0.3, w: 0.1, h: 0.1 }, { x: 0.32, y: 0.31, w: 0.3, h: 0.08 }])).toEqual({ x: 0.18, y: 0.28, w: 0.46, h: 0.14 });
    // At an edge it stays inside, and a tiny part gets the smallest size.
    expect(templateTapBoxAround([{ x: 0.99, y: 0.99, w: 0.01, h: 0.01 }], 0)).toEqual({ x: 0.95, y: 0.95, w: 0.05, h: 0.05 });
    expect(templateTapBoxAround([{ x: 0, y: 0, w: 1, h: 1 }])).toEqual({ x: 0, y: 0, w: 1, h: 1 });
  });
});

describe("Row action examples", () => {
  const names = {
    pages: [{ id: "p1", name: "Kitchen" }, { id: "p2", name: "Hall" }, { id: "p3", name: "hall" }, { id: "p4", name: "A [b]" }],
    httpActions: [{ id: "6F9619FF-8B86-D011-B42D-00C04FC964FF", name: "Garage (shared)", plain: "Garage" }, { id: "AAAA", name: "Gate" }],
  };
  const at = { x: 0, y: 0, w: 1, h: 1 };
  const marker = (area: Record<string, unknown>) => templateTapMarker({ ...at, ...area } as never, names);

  it("writes each action as a row action", () => {
    expect(marker({ action: "toggle", entity: "light.desk" })).toBe("[tap:toggle light.desk]");
    expect(marker({ action: "script", entity: "script.a" })).toBe("[tap:script script.a]");
    expect(marker({ action: "scene", entity: "scene.b" })).toBe("[tap:scene scene.b]");
    expect(marker({ action: "control", entity: "climate.c" })).toBe("[tap:control climate.c]");
    expect(marker({ action: "maps", place: "52.37,4.89,Dam" })).toBe("[tap:maps 52.37,4.89,Dam]");
    expect(marker({ action: "maps", place: "device_tracker.phone" })).toBe("[tap:maps device_tracker.phone]");
    expect(marker({ action: "link", url: "https://example.com" })).toBe("[tap:link https://example.com]");
    expect(marker({ action: "refresh" })).toBe("[tap:refresh]");
    expect(marker({ action: "service", service: "light.turn_on", entity: "light.desk", data: { a: 1 } })).toBe("[tap:service light.turn_on light.desk]");
    expect(marker({ action: "service", service: "notify.notify" })).toBe("[tap:service notify.notify]");
  });

  it("names a page and an HTTP action, or uses the id when a name would not read", () => {
    expect(marker({ action: "page", page: "p1" })).toBe("[tap:page Kitchen]");
    // Two pages named alike in any case, a name with ], or a missing page.
    expect(marker({ action: "page", page: "p2" })).toBe("[tap:page p2]");
    expect(marker({ action: "page", page: "p4" })).toBe("[tap:page p4]");
    expect(marker({ action: "page", page: "gone" })).toBe("[tap:page gone]");
    expect(marker({ action: "http", http: "6f9619ff-8b86-d011-b42d-00c04fc964ff" })).toBe("[tap:http Garage]");
    expect(marker({ action: "http", http: "AAAA" })).toBe("[tap:http Gate]");
    expect(marker({ action: "http", http: "BBBB" })).toBe("[tap:http BBBB]");
  });

  it("keeps a marker on one line", () => {
    expect(marker({ action: "link", url: "https://a.com/{{\n x }}" })).toBe("[tap:link https://a.com/{{ x }}]");
  });

  it("says when the area holds what a marker cannot", () => {
    expect(templateTapMarkerLoses({ ...at, action: "toggle", entity: "light.a" })).toBe(false);
    expect(templateTapMarkerLoses({ ...at, action: "toggle", entity: "light.a", confirm: true })).toBe(true);
    expect(templateTapMarkerLoses({ ...at, action: "service", service: "a.b", data: { k: 1 } })).toBe(true);
    expect(templateTapMarkerLoses({ ...at, action: "service", service: "a.b", entity: "light.a" })).toBe(false);
  });
});
