// The Home map tile (app repo docs/home_map_plan_2026-10.md, "The tile
// kind"): `home_map.<floor id>`, a virtual kind named "Home map" that both
// devices draw; the Add tile dialog offers it once the home's map has a
// floor with a room; its settings pick the floor; and the page editor's
// picture draws the floor's plan small, a glow over each room with a light
// on, and how many lights are on.
//
// No DOM: each view is drawn to its Lit templates, read as text, and its
// controls are pressed by calling the handler the template holds for them.
// The hosts are real drafts, so every press is an edit.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { HomeMapDocument, HomeMapFloor } from "../src/home-map/model.js";
import pageKeys from "../src/watch-pages/page-keys.json";
import { SymbolBrowser } from "../src/symbols.js";
import { renderAddTile } from "../src/watch-pages/add-tile.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { type AddTileHost, NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { homeLengthText, homeTileArt, homeTileGround, homeTileLightsColor, homeTileTitleColor } from "../src/home-map/tile-art.js";
import {
  type WatchHomeMapDevices,
  type WatchHomeMapLook,
  WATCH_HOME_MAP_ADD_WORDS,
  WATCH_HOME_MAP_DEFAULT_TURN,
  WATCH_HOME_MAP_DEVICES_HINTS,
  WATCH_HOME_MAP_MISSING_TEXT,
  WATCH_HOME_MAP_NO_MAP_TEXT,
  WATCH_HOME_MAP_OPTION_HINTS,
  WATCH_HOME_MAP_TAP_LIGHTS_HINT,
  WATCH_HOME_MAP_LOOKS,
  WATCH_HOME_MAP_LOOK_HINTS,
  WATCH_HOME_MAP_ROOM_HINT,
  WATCH_HOME_MAP_WHOLE_FLOOR_TEXT,
  setWatchHomeMapDevices,
  setWatchHomeMapFloor,
  setWatchHomeMapFurniture,
  setWatchHomeMapGlow,
  setWatchHomeMapLook,
  setWatchHomeMapNames,
  setWatchHomeMapRoom,
  setWatchHomeMapTapLights,
  setWatchHomeMapTurn,
  watchHomeMapDevices,
  watchHomeMapDrawnFloor,
  watchHomeMapFloorSummary,
  watchHomeMapFurniture,
  watchHomeMapGlow,
  watchHomeMapLook,
  watchHomeMapNames,
  watchHomeMapTurn,
  watchHomeMapRoomId,
  watchHomeMapRoomMenu,
  watchHomeMapTileTitle,
  watchHomeMapAddFloors,
  watchHomeMapFloorId,
  watchHomeMapFloorMenu,
  watchHomeMapTileWords,
} from "../src/watch-pages/home-map-tile.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, VIRTUAL_TILE_KINDS, tileClass, tileDevices, tileKindLabel } from "../src/watch-pages/model.js";
import { renderWatchTileFace } from "../src/watch-pages/preview.js";
import { WATCH_TILE_APP, addNewWatchTile, newWatchTile, watchAddEntityId } from "../src/watch-pages/tile-new.js";
import { renderTileSettings, tileInspectorSections } from "../src/watch-pages/tile-settings.js";
import { watchTileSettingsSections } from "../src/watch-pages/tile-settings-options.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const UPSTAIRS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000002";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const PAGE = "C3A0E000-0000-4000-8000-0000000000A1";
const TILE = "C3A0E000-0000-4000-8000-0000000000A2";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

/** The fixture with an upstairs of one room, and an empty attic. */
function twoFloors(): HomeMapDocument {
  const doc = fixture();
  const room = { ...doc.floors[0]!.rooms[1]!, id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000020", name: "Bedroom" };
  const upstairs: HomeMapFloor = { id: UPSTAIRS, name: "Upstairs", story: 1, rooms: [room], pins: [] };
  const attic: HomeMapFloor = { id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000003", name: "Attic", story: 2, rooms: [], pins: [] };
  return { v: 1, floors: [...doc.floors, upstairs, attic] };
}

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and that binds the event itself. */
function handler(root: unknown, marker: string, event: string): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flatten(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e?: unknown) => void;
}

// ── hosts on a real draft ────────────────────────────────────────────────

function draftOf(items: WatchPageTile[]) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  return { draft, pageNow };
}

function baseHost(draft: WatchPagesDraft, pageNow: () => WatchPage, homeMap: HomeMapDocument | null | undefined) {
  return {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    homeMap,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    loadImageSize: async () => undefined,
    smartRuleId: undefined,
    selectSmartRule: () => undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
  };
}

function addHost(homeMap: HomeMapDocument | null | undefined) {
  const { draft, pageNow } = draftOf([]);
  const host = {} as Record<string, unknown>;
  Object.defineProperties(host, Object.getOwnPropertyDescriptors(baseHost(draft, pageNow, homeMap)));
  Object.defineProperty(host, "tileId", { value: undefined });
  Object.defineProperty(host, "tile", { value: undefined });
  Object.defineProperty(host, "close", { value: () => undefined });
  return { host: host as unknown as AddTileHost, tiles: () => (pageNow().items as WatchPageTile[] | undefined) ?? [] };
}

function tileHost(entityId: string, homeMap: HomeMapDocument | null | undefined, device?: "watch" | "iphone") {
  const { draft, pageNow } = draftOf([{ id: TILE, entityId, customLabel: "Home map", colSpan: 12, rowSpan: 6, gridCol: 0, gridRow: 0 }]);
  const host = {} as Record<string, unknown>;
  Object.defineProperties(host, Object.getOwnPropertyDescriptors(baseHost(draft, pageNow, homeMap)));
  Object.defineProperty(host, "tileId", { value: TILE });
  if (device !== undefined) Object.defineProperty(host, "device", { value: device });
  Object.defineProperty(host, "tile", { get: () => ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE) ?? ({} as WatchPageTile) });
  return { host: host as unknown as TileSettingsHost, tile: () => (host as unknown as TileSettingsHost).tile };
}

const draw = (host: TileSettingsHost) => renderTileSettings(host, { sections: tileInspectorSections(host) });

// ── the kind ─────────────────────────────────────────────────────────────

describe("the Home map kind", () => {
  it("is a virtual kind named Home map that both devices draw, in page-keys.json", () => {
    expect(VIRTUAL_TILE_KINDS.home_map).toBe("Home map");
    expect(tileKindLabel("home_map")).toBe("Home map");
    expect(tileDevices("home_map")).toEqual(["watch", "iphone"]);
    expect(tileClass(`home_map.${FLOOR}`)).toBe("virtual");
    const virtualKinds = (pageKeys as unknown as { notes: { virtualKinds: Record<string, string> } }).notes.virtualKinds;
    expect(virtualKinds.home_map).toMatch(/^home_map\.<floor id>/);
  });

  it("makes a new tile on the floor's id as the map stores it, with its fixed look and size", () => {
    let n = 0;
    const newId = () => `c3a0e000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
    const tile = newWatchTile({ kind: "homeMap", floor: { id: FLOOR.toLowerCase() } }, undefined, { newId });
    const spec = WATCH_TILE_APP.homeMap.add;
    expect(tile.entityId).toBe(`home_map.${FLOOR.toLowerCase()}`);
    expect(tile.id).toBe("C3A0E000-0000-4000-8000-000000000001");
    expect([tile.icon, tile.color, tile.customLabel, tile.colSpan, tile.rowSpan]).toEqual([spec.icon, spec.hex, "Home map", 12, 6]);
    expect(watchHomeMapFloorId(tile)).toBe(FLOOR.toLowerCase());
    expect(watchAddEntityId({ kind: "homeMap", floor: { id: FLOOR } })).toBe(`home_map.${FLOOR}`);
    // Every key it writes is a page-keys.json tile key.
    const keys = (pageKeys as unknown as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys;
    for (const key of Object.keys(tile)) expect(Object.hasOwn(keys, key), key).toBe(true);
  });

  it("puts one floor on a page once", () => {
    const { draft } = draftOf([]);
    const first = addNewWatchTile(draft.document, PAGE, { kind: "homeMap", floor: { id: FLOOR } });
    expect(first.tile?.entityId).toBe(`home_map.${FLOOR}`);
    expect(addNewWatchTile(first.document, PAGE, { kind: "homeMap", floor: { id: FLOOR } }).refusal).toBe("onPage");
    expect(addNewWatchTile(first.document, PAGE, { kind: "homeMap", floor: { id: UPSTAIRS } }).refusal).toBeUndefined();
  });
});

// ── the Add tile dialog ──────────────────────────────────────────────────

describe("the Add tile dialog", () => {
  // The name, then its BETA pill.
  const button = `<span class="at-kind-name">${WATCH_HOME_MAP_ADD_WORDS.label}<span class="beta-pill"`;

  it("offers nothing without a map, or with one whose floors have no room", () => {
    expect(flatten(renderAddTile(addHost(undefined).host))).not.toContain(button);
    expect(flatten(renderAddTile(addHost(null).host))).not.toContain(button);
    const empty = { v: 1 as const, floors: [{ ...fixture().floors[0]!, rooms: [], pins: [] }] };
    expect(watchHomeMapAddFloors(empty)).toEqual([]);
    expect(flatten(renderAddTile(addHost(empty).host))).not.toContain(button);
  });

  it("adds the one floor at once, under App tiles, and refuses it twice", () => {
    const { host, tiles } = addHost(fixture());
    const text = flatten(renderAddTile(host));
    expect(text).toContain(button);
    expect(text).toContain(WATCH_HOME_MAP_ADD_WORDS.hint);
    expect(text.indexOf(button)).toBeGreaterThan(text.indexOf("App tiles"));
    expect(text.indexOf(button)).toBeLessThan(text.indexOf("Library"));
    handler(renderAddTile(host), button, "@click=")();
    expect(tiles().map((t) => t.entityId)).toEqual([`home_map.${FLOOR}`]);
    expect(flatten(renderAddTile(host))).toContain("Added a Home map tile.");
    handler(renderAddTile(host), button, "@click=")();
    expect(tiles()).toHaveLength(1);
    expect(flatten(renderAddTile(host))).toContain("The Home map tile is already on this page.");
  });

  it("asks which floor when the map has several with rooms, and adds the one picked", () => {
    const { host, tiles } = addHost(twoFloors());
    expect(flatten(renderAddTile(host))).not.toContain(WATCH_HOME_MAP_ADD_WORDS.question);
    handler(renderAddTile(host), button, "@click=")();
    expect(tiles()).toHaveLength(0);
    const open = flatten(renderAddTile(host));
    expect(open).toContain(WATCH_HOME_MAP_ADD_WORDS.question);
    expect(open).toContain('<span class="at-page-name">Ground floor</span>');
    expect(open).toContain('<span class="at-page-name">Upstairs</span>');
    expect(open).not.toContain("Attic");
    expect(open).toContain('<span class="at-tag">2 rooms</span>');
    handler(renderAddTile(host), '<span class="at-page-name">Upstairs</span>', "@click=")();
    expect(tiles().map((t) => t.entityId)).toEqual([`home_map.${UPSTAIRS}`]);
    const after = flatten(renderAddTile(host));
    expect(after).toContain("Added a Home map tile for Upstairs.");
    expect(after).not.toContain(WATCH_HOME_MAP_ADD_WORDS.question);
  });
});

// ── settings ─────────────────────────────────────────────────────────────

describe("the Home map tile's settings", () => {
  it("are its Floor first, then the look and when it shows, with no Action", () => {
    expect(watchTileSettingsSections({ entityId: `home_map.${FLOOR}` })).toEqual(["target", "icon", "text", "border", "visibility", "background"]);
  });

  it("pick the floor from the map's floors with a room, and move the tile to it", () => {
    const { host, tile } = tileHost(`home_map.${FLOOR}`, twoFloors());
    const text = flatten(draw(host));
    expect(text).toContain("<h4>Map</h4>");
    expect(text).toContain("<span>Floor</span>");
    expect(text).toContain(">Ground floor</option>");
    expect(text).toContain(">Upstairs</option>");
    expect(text).not.toContain(">Attic</option>");
    handler(draw(host), "<span>Floor</span>", "@change=")({ target: { value: UPSTAIRS } });
    expect(tile().entityId).toBe(`home_map.${UPSTAIRS}`);
    expect(tile().customLabel).toBe("Home map");
  });

  it("keep a floor the map no longer has until another is picked, and say where a map comes from without one", () => {
    const gone = "7B1E0C2A-5D3F-4A8B-9C6D-0000000000FF";
    const menu = watchHomeMapFloorMenu({ entityId: `home_map.${gone}` }, fixture())!;
    expect(menu.selected).toBe(`stored:${gone}`);
    expect(menu.options[0]).toEqual({ value: `stored:${gone}`, label: WATCH_HOME_MAP_MISSING_TEXT, disabled: true });
    expect(watchHomeMapFloorMenu({ entityId: `home_map.${FLOOR.toLowerCase()}` }, fixture())!.selected).toBe(FLOOR);
    const { host } = tileHost(`home_map.${FLOOR}`, undefined);
    expect(flatten(draw(host))).toContain(WATCH_HOME_MAP_NO_MAP_TEXT);
    // A tile of another kind, or the same floor, changes nothing.
    const { draft } = draftOf([{ id: TILE, entityId: "light.kitchen" }]);
    expect(setWatchHomeMapFloor(draft.document, PAGE, TILE, UPSTAIRS)).toBe(draft.document);
    const own = draftOf([{ id: TILE, entityId: `home_map.${FLOOR}` }]);
    expect(setWatchHomeMapFloor(own.draft.document, PAGE, TILE, FLOOR)).toBe(own.draft.document);
  });

  it("offer Tap lights on the iPhone only, stored as homeMapTapLights true and removed when off", () => {
    expect(flatten(draw(tileHost(`home_map.${FLOOR}`, fixture()).host))).not.toContain("Tap lights");
    const { host, tile } = tileHost(`home_map.${FLOOR}`, fixture(), "iphone");
    const text = flatten(draw(host));
    expect(text).toContain("Tap lights");
    expect(text).toContain(WATCH_HOME_MAP_TAP_LIGHTS_HINT);
    expect((tile() as Record<string, unknown>).homeMapTapLights).toBeUndefined();
    handler(draw(host), "Tap lights", "@change=")({ target: { checked: true } });
    expect((tile() as Record<string, unknown>).homeMapTapLights).toBe(true);
    handler(draw(host), "Tap lights", "@change=")({ target: { checked: false } });
    expect(Object.hasOwn(tile(), "homeMapTapLights")).toBe(false);
    // Only a Home map tile takes it.
    const { draft } = draftOf([{ id: TILE, entityId: "light.kitchen" }]);
    expect(setWatchHomeMapTapLights(draft.document, PAGE, TILE, true)).toBe(draft.document);
    const keys = (pageKeys as unknown as { notes: { keys: Record<string, string> } }).notes.keys;
    expect(keys.homeMapTapLights).toMatch(/^A Home map tile on the iPhone/);
  });

  it("offer the Look on both devices as a picture of the tile's floor in each look, stored as homeMapLook and removed for Plan", () => {
    for (const device of [undefined, "iphone"] as const) {
      const { host, tile } = tileHost(`home_map.${FLOOR}`, fixture(), device);
      const text = flatten(draw(host));
      expect(text).toContain("Look");
      expect(text).toContain(WATCH_HOME_MAP_LOOK_HINTS.plan);
      // One picture button per look, in the picker's order, Plan picked.
      expect(text).toContain('role="radiogroup" aria-label=Look');
      expect(text.split('class="ts-hm-look"').length - 1).toBe(WATCH_HOME_MAP_LOOKS.length);
      for (const [look] of WATCH_HOME_MAP_LOOKS) expect(text).toContain(`data-look=${look}`);
      expect(text).toMatch(/class="pc-opt on" aria-checked=true\s+data-value=plan/);
      expect(watchHomeMapLook(tile() as Record<string, unknown>)).toBe("plan");
      handler(draw(host), ">Night<", "@click=")({ currentTarget: null });
      expect((tile() as Record<string, unknown>).homeMapLook).toBe("night");
      expect(flatten(draw(host))).toContain(WATCH_HOME_MAP_LOOK_HINTS.night);
      handler(draw(host), ">Plan<", "@click=")({ currentTarget: null });
      expect(Object.hasOwn(tile(), "homeMapLook")).toBe(false);
    }
    // Only a Home map tile takes one.
    const { draft } = draftOf([{ id: TILE, entityId: "light.kitchen" }]);
    expect(setWatchHomeMapLook(draft.document, PAGE, TILE, "dots")).toBe(draft.document);
    expect(WATCH_HOME_MAP_LOOKS).toEqual([["plan", "Plan"], ["night", "Night"], ["warm", "Warm"], ["lines", "Lines"], ["clay", "Clay"], ["blueprint", "Blueprint"], ["dots", "Dots"]]);
    for (const [look] of WATCH_HOME_MAP_LOOKS) expect(WATCH_HOME_MAP_LOOK_HINTS[look]).toBeTruthy();
    const keys = (pageKeys as unknown as { notes: { keys: Record<string, string> } }).notes.keys;
    expect(keys.homeMapLook).toMatch(/^A Home map tile's look/);
  });

  it("read the look: absent, plan or unknown is plan, the older glow is plan and dollhouse is warm", () => {
    expect(watchHomeMapLook({})).toBe("plan");
    expect(watchHomeMapLook({ homeMapLook: "plan" })).toBe("plan");
    expect(watchHomeMapLook({ homeMapLook: "glow" })).toBe("plan");
    expect(watchHomeMapLook({ homeMapLook: "dollhouse" })).toBe("warm");
    expect(watchHomeMapLook({ homeMapLook: "sparkle" })).toBe("plan");
    expect(watchHomeMapLook({ homeMapLook: 3 })).toBe("plan");
    expect(watchHomeMapLook({ homeMapLook: "toString" })).toBe("plan");
    for (const [look] of WATCH_HOME_MAP_LOOKS) expect(watchHomeMapLook({ homeMapLook: look })).toBe(look);
    // Setting a look writes over an older one; plan removes it.
    const stored = (tile: Record<string, unknown>, look: WatchHomeMapLook) => {
      const own = draftOf([{ id: TILE, entityId: `home_map.${FLOOR}`, ...tile } as WatchPageTile]);
      return ((setWatchHomeMapLook(own.draft.document, PAGE, TILE, look).pages as WatchPage[])[0]!.items as Record<string, unknown>[])[0]!;
    };
    expect(stored({ homeMapLook: "dollhouse" }, "warm").homeMapLook).toBe("warm");
    expect(Object.hasOwn(stored({ homeMapLook: "glow" }, "plan"), "homeMapLook")).toBe(false);
    expect(Object.hasOwn(stored({ homeMapLook: "plan" }, "plan"), "homeMapLook")).toBe(false);
    expect(stored({}, "blueprint").homeMapLook).toBe("blueprint");
    // The same look stored changes nothing.
    const own = draftOf([{ id: TILE, entityId: `home_map.${FLOOR}`, homeMapLook: "clay" } as WatchPageTile]);
    expect(setWatchHomeMapLook(own.draft.document, PAGE, TILE, "clay")).toBe(own.draft.document);
    expect(setWatchHomeMapLook(own.draft.document, PAGE, TILE, "glow" as WatchHomeMapLook)).toBe(own.draft.document);
  });

  it("store each map option only when it is not its default, and change nothing on another kind", () => {
    const after = (tile: Record<string, unknown>, edit: (d: WatchPagesDocument) => WatchPagesDocument) => {
      const own = draftOf([{ id: TILE, entityId: `home_map.${FLOOR}`, ...tile } as WatchPageTile]);
      const next = edit(own.draft.document);
      return { same: next === own.draft.document, tile: ((next.pages as WatchPage[])[0]!.items as Record<string, unknown>[])[0]! };
    };
    // Turn: whole degrees, -180 to 180, -28 removed.
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, 40)).tile.homeMapTurn).toBe(40);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, 12.6)).tile.homeMapTurn).toBe(13);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, 500)).tile.homeMapTurn).toBe(180);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, -900)).tile.homeMapTurn).toBe(-180);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, -0.2)).tile.homeMapTurn).toBe(0);
    expect(Object.hasOwn(after({ homeMapTurn: 40 }, (d) => setWatchHomeMapTurn(d, PAGE, TILE, -28)).tile, "homeMapTurn")).toBe(false);
    expect(Object.hasOwn(after({ homeMapTurn: 40 }, (d) => setWatchHomeMapTurn(d, PAGE, TILE, -28.4)).tile, "homeMapTurn")).toBe(false);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, -28)).same).toBe(true);
    expect(after({}, (d) => setWatchHomeMapTurn(d, PAGE, TILE, Number.NaN)).same).toBe(true);
    expect(after({ homeMapTurn: 40 }, (d) => setWatchHomeMapTurn(d, PAGE, TILE, 40)).same).toBe(true);
    expect(watchHomeMapTurn({})).toBe(WATCH_HOME_MAP_DEFAULT_TURN);
    expect(WATCH_HOME_MAP_DEFAULT_TURN).toBe(-28);
    expect(watchHomeMapTurn({ homeMapTurn: 999 })).toBe(180);
    expect(watchHomeMapTurn({ homeMapTurn: "40" })).toBe(-28);
    // Names, furniture and glow: only false is stored.
    for (const [key, set, read] of [
      ["homeMapNames", setWatchHomeMapNames, watchHomeMapNames],
      ["homeMapFurniture", setWatchHomeMapFurniture, watchHomeMapFurniture],
      ["homeMapGlow", setWatchHomeMapGlow, watchHomeMapGlow],
    ] as const) {
      expect(read({}), key).toBe(true);
      expect(read({ [key]: true }), key).toBe(true);
      expect(read({ [key]: false }), key).toBe(false);
      expect(after({}, (d) => set(d, PAGE, TILE, false)).tile[key], key).toBe(false);
      expect(Object.hasOwn(after({ [key]: false }, (d) => set(d, PAGE, TILE, true)).tile, key), key).toBe(false);
      expect(Object.hasOwn(after({ [key]: true }, (d) => set(d, PAGE, TILE, true)).tile, key), key).toBe(false);
      expect(after({}, (d) => set(d, PAGE, TILE, true)).same, key).toBe(true);
      expect(after({ [key]: false }, (d) => set(d, PAGE, TILE, false)).same, key).toBe(true);
    }
    // Devices: lights removed, all and none stored, anything else read as lights.
    expect(watchHomeMapDevices({})).toBe("lights");
    expect(watchHomeMapDevices({ homeMapDevices: "pins" })).toBe("lights");
    expect(watchHomeMapDevices({ homeMapDevices: "all" })).toBe("all");
    expect(after({}, (d) => setWatchHomeMapDevices(d, PAGE, TILE, "none")).tile.homeMapDevices).toBe("none");
    expect(Object.hasOwn(after({ homeMapDevices: "all" }, (d) => setWatchHomeMapDevices(d, PAGE, TILE, "lights")).tile, "homeMapDevices")).toBe(false);
    expect(after({}, (d) => setWatchHomeMapDevices(d, PAGE, TILE, "lights")).same).toBe(true);
    expect(after({}, (d) => setWatchHomeMapDevices(d, PAGE, TILE, "some" as WatchHomeMapDevices)).same).toBe(true);
    // Another kind takes none of them.
    const other = draftOf([{ id: TILE, entityId: "light.kitchen" }]).draft.document;
    expect(setWatchHomeMapTurn(other, PAGE, TILE, 10)).toBe(other);
    expect(setWatchHomeMapNames(other, PAGE, TILE, false)).toBe(other);
    expect(setWatchHomeMapDevices(other, PAGE, TILE, "all")).toBe(other);
    expect(setWatchHomeMapFurniture(other, PAGE, TILE, false)).toBe(other);
    expect(setWatchHomeMapGlow(other, PAGE, TILE, false)).toBe(other);
    // Every key is in page-keys.json with its type and its words.
    const types = (pageKeys as unknown as { types: { tile: { keys: Record<string, { type: string; required: boolean }> } } }).types.tile.keys;
    const notes = (pageKeys as unknown as { notes: { keys: Record<string, string> } }).notes.keys;
    for (const [key, type] of [["homeMapTurn", "int"], ["homeMapNames", "bool"], ["homeMapDevices", "string"], ["homeMapFurniture", "bool"], ["homeMapGlow", "bool"], ["homeMapLook", "string"]] as const) {
      expect(types[key], key).toEqual({ type, required: false });
      expect(notes[key], key).toMatch(/^A Home map tile's/);
    }
  });

  it("offer the Turn for the model looks only, then Room names, Devices, Furniture and Light glow, each written through its setter", () => {
    const { host, tile } = tileHost(`home_map.${FLOOR}`, fixture());
    const plan = flatten(draw(host));
    expect(plan).not.toContain(WATCH_HOME_MAP_OPTION_HINTS.turn);
    for (const label of ["Room names", "Devices", "Furniture", "Light glow"]) expect(plan).toContain(label);
    expect(plan.indexOf("Room names")).toBeGreaterThan(plan.indexOf(WATCH_HOME_MAP_LOOK_HINTS.plan));
    expect(plan).toContain(WATCH_HOME_MAP_DEVICES_HINTS.lights);
    handler(draw(host), ">Warm<", "@click=")({ currentTarget: null });
    const warm = flatten(draw(host));
    expect(warm).toContain(WATCH_HOME_MAP_OPTION_HINTS.turn);
    expect(warm).toContain("Turn");
    expect(warm.indexOf("Turn")).toBeLessThan(warm.indexOf("Room names"));
    const t = () => tile() as Record<string, unknown>;
    handler(draw(host), "Room names", "@change=")({ target: { checked: false } });
    expect(t().homeMapNames).toBe(false);
    handler(draw(host), "Furniture", "@change=")({ target: { checked: false } });
    expect(t().homeMapFurniture).toBe(false);
    handler(draw(host), "Light glow", "@change=")({ target: { checked: false } });
    expect(t().homeMapGlow).toBe(false);
    handler(draw(host), ">All<", "@click=")({ currentTarget: null });
    expect(t().homeMapDevices).toBe("all");
    expect(flatten(draw(host))).toContain(WATCH_HOME_MAP_DEVICES_HINTS.all);
    handler(draw(host), ">Lights<", "@click=")({ currentTarget: null });
    expect(Object.hasOwn(t(), "homeMapDevices")).toBe(false);
    handler(draw(host), "Room names", "@change=")({ target: { checked: true } });
    expect(Object.hasOwn(t(), "homeMapNames")).toBe(false);
  });

  it("offer the Room on both devices, right under the Floor, stored as homeMapRoomId and removed for Whole floor", () => {
    for (const device of [undefined, "iphone"] as const) {
      const { host, tile } = tileHost(`home_map.${FLOOR}`, fixture(), device);
      const text = flatten(draw(host));
      expect(text).toContain("<span>Room</span>");
      expect(text).toContain(WATCH_HOME_MAP_ROOM_HINT);
      expect(text.indexOf("<span>Room</span>")).toBeGreaterThan(text.indexOf("<span>Floor</span>"));
      expect(text.indexOf("<span>Room</span>")).toBeLessThan(text.indexOf("Look"));
      expect(text).toContain(`>${WATCH_HOME_MAP_WHOLE_FLOOR_TEXT}</option>`);
      expect(text).toContain(">Living room</option>");
      expect(text).toContain(">Kitchen</option>");
      expect(watchHomeMapRoomId(tile() as Record<string, unknown>)).toBeUndefined();
      handler(draw(host), "<span>Room</span>", "@change=")({ target: { value: KITCHEN } });
      expect((tile() as Record<string, unknown>).homeMapRoomId).toBe(KITCHEN);
      expect(watchHomeMapRoomMenu(tile(), fixture())!.selected).toBe(KITCHEN);
      expect(watchHomeMapFloorSummary(tile(), fixture())).toBe("Ground floor · Kitchen");
      handler(draw(host), "<span>Room</span>", "@change=")({ target: { value: "" } });
      expect(Object.hasOwn(tile(), "homeMapRoomId")).toBe(false);
    }
    // Only a Home map tile takes one.
    const { draft } = draftOf([{ id: TILE, entityId: "light.kitchen" }]);
    expect(setWatchHomeMapRoom(draft.document, PAGE, TILE, KITCHEN)).toBe(draft.document);
    const keys = (pageKeys as unknown as { notes: { keys: Record<string, string> } }).notes.keys;
    expect(keys.homeMapRoomId).toMatch(/^A Home map tile's one room/);
  });

  it("name an unnamed room by its place, keep a room the floor lost until another is picked, and drop the room with the floor", () => {
    const doc = fixture();
    delete doc.floors[0]!.rooms[1]!.name;
    const menu = watchHomeMapRoomMenu({ entityId: `home_map.${FLOOR}` }, doc)!;
    expect(menu.options).toEqual([
      { value: "", label: WATCH_HOME_MAP_WHOLE_FLOOR_TEXT },
      { value: LIVING, label: "Living room" },
      { value: KITCHEN, label: "Room 2" },
    ]);
    expect(menu.selected).toBe("");
    const gone = "7B1E0C2A-5D3F-4A8B-9C6D-0000000000EE";
    const lost = watchHomeMapRoomMenu({ entityId: `home_map.${FLOOR}`, homeMapRoomId: gone } as WatchPageTile, fixture())!;
    expect(lost.selected).toBe(`stored:${gone}`);
    expect(lost.options[0]).toEqual({ value: `stored:${gone}`, label: WATCH_HOME_MAP_MISSING_TEXT, disabled: true });
    // Ids compare ignoring case.
    expect(watchHomeMapRoomMenu({ entityId: `home_map.${FLOOR}`, homeMapRoomId: KITCHEN.toLowerCase() } as WatchPageTile, fixture())!.selected).toBe(KITCHEN);
    // No menu for a floor the map does not have.
    expect(watchHomeMapRoomMenu({ entityId: `home_map.${UPSTAIRS}` }, fixture())).toBeUndefined();
    // Moving the tile to another floor shows that whole floor.
    const own = draftOf([{ id: TILE, entityId: `home_map.${FLOOR}`, homeMapRoomId: KITCHEN, homeMapLook: "night" } as WatchPageTile]);
    const moved = setWatchHomeMapFloor(own.draft.document, PAGE, TILE, UPSTAIRS);
    const tile = ((moved.pages as WatchPage[])[0]!.items as WatchPageTile[])[0] as unknown as Record<string, unknown>;
    expect(tile.entityId).toBe(`home_map.${UPSTAIRS}`);
    expect(Object.hasOwn(tile, "homeMapRoomId")).toBe(false);
    expect(tile.homeMapLook).toBe("night");
  });
});

// ── the picture ──────────────────────────────────────────────────────────

describe("the Home map tile's picture", () => {
  const page: WatchPage = { id: PAGE, name: "Living", items: [] };
  const screen = { width: 198, height: 242 };
  const tile: WatchPageTile = { id: TILE, entityId: `home_map.${FLOOR}`, customLabel: "Home map", colSpan: 12, rowSpan: 6, color: "#FFB340" };
  const states = {
    "light.reading_lamp": { entity_id: "light.reading_lamp", state: "on", attributes: { brightness: 255 } },
    "light.ceiling": { entity_id: "light.ceiling", state: "off", attributes: {} },
    "light.pendants": { entity_id: "light.pendants", state: "off", attributes: {} },
  } as unknown as Record<string, HassEntityState>;

  const input = { page, pages: [page], screen, scale: 1, states, stateMode: "live" as const, homeMap: fixture() };
  const faceOf = (keys: Record<string, unknown> = {}, size = { width: 180, height: 110 }, given: Record<string, unknown> = input) =>
    flatten(renderWatchTileFace({ ...tile, ...keys } as WatchPageTile, size, given as never, 14));
  const count = (text: string, marker: string) => text.split(marker).length - 1;

  it("draws the floor as the plan from above, a pool round each light that is on, the title and how many lights are on", () => {
    const face = faceOf();
    expect(face).toContain("wp-hm-face");
    expect(face).toContain(`data-home-map=${FLOOR}`);
    expect(face).toContain("data-look=plan");
    // Drawn in the tile's points, inset as the apps inset it.
    expect(face).toContain("viewBox=0 0 163 57");
    expect(face).toContain("left:8px;top:26px;width:163px;height:57px");
    expect(face).toContain(`data-room=${LIVING}`);
    expect(face).toContain(`data-room=${KITCHEN}`);
    // Only the reading lamp is on: one pool and one dot.
    expect(count(face, 'class="hmt-pool"')).toBe(1);
    expect(count(face, "class=hmt-dot ")).toBe(1);
    expect(count(face, "hmt-dot-off")).toBe(0);
    // The furniture, the walls, the window and the door.
    expect(count(face, 'class="hmt-piece"')).toBe(6);
    expect(face).toContain('class="hmt-walls"');
    expect(face).toContain('stroke-dasharray="3 2.5"');
    expect(face).toContain(">1 light on</span>");
    expect(face).toContain('<span class="wp-hm-title"');
    expect(face).toContain(">Home map</span>");
    // No pins on the tile while it draws its lights only.
    expect(face).not.toContain('class="hmt-pin"');
    // The plan's own ground, not the old tilt.
    expect(face).toContain(`background:${homeTileGround("plan")}`);
    expect(face).not.toContain("rotateX");
  });

  it("draws every look without throwing, each with its own marks", () => {
    for (const [look] of WATCH_HOME_MAP_LOOKS) {
      const face = faceOf({ homeMapLook: look });
      expect(face, look).toContain(`data-look=${look}`);
      expect(face, look).toContain(`background:${homeTileGround(look)}`);
      expect(face, look).toContain(">1 light on</span>");
    }
    // The models stand their walls up, far to near, with furniture.
    for (const look of ["night", "warm", "lines", "clay", "blueprint"]) {
      const face = faceOf({ homeMapLook: look });
      expect(face, look).toContain("class=hmt-wall>");
      expect(face, look).toContain("class=hmt-glass>");
      expect(face, look).toContain("class=hmt-piece>");
    }
    // Night and warm: pools of light added to the dark, the lit room's wall
    // washed, furniture tops drawn from above.
    const night = faceOf({ homeMapLook: "night" }, { width: 360, height: 240 });
    expect(night).toContain("mix-blend-mode:screen");
    expect(night).toContain("url(#wa-hmt-wash)");
    expect(night).toContain("url(#wa-hmf-table)");
    // Lines glow; clay casts soft shadows and has no pools; blueprint draws
    // its grid.
    expect(faceOf({ homeMapLook: "lines" })).toContain("feDropShadow");
    const clay = faceOf({ homeMapLook: "clay" });
    expect(clay).toContain('class="hmt-shadows"');
    expect(clay).not.toContain('class="hmt-pool"');
    expect(clay).toContain(`color:${homeTileLightsColor("clay", true)}`);
    expect(clay).toContain(`color:${homeTileTitleColor("clay")}`);
    expect(homeTileTitleColor("clay")).not.toBe(homeTileTitleColor("night"));
    // Dots: every light a dot, the two that are off gray, and no pools or
    // furniture.
    const dots = faceOf({ homeMapLook: "dots" });
    expect(count(dots, "hmt-dot-off")).toBe(2);
    expect(count(dots, "class=hmt-dot ")).toBe(1);
    expect(dots).not.toContain('class="hmt-pool"');
    expect(dots).not.toContain('class="hmt-piece"');
    // The older looks read as plan and warm.
    expect(faceOf({ homeMapLook: "glow" })).toContain("data-look=plan");
    expect(faceOf({ homeMapLook: "dollhouse" })).toContain("data-look=warm");
  });

  it("follows the tile's options: turn, names, devices, furniture and glow", () => {
    // The turn moves the model, never the plan.
    expect(faceOf({ homeMapLook: "warm", homeMapTurn: 30 })).not.toBe(faceOf({ homeMapLook: "warm" }));
    expect(faceOf({ homeMapTurn: 30 })).toBe(faceOf());
    // Names show on a tile tall enough where the pill fits the room, and
    // never once switched off.
    const big = { width: 360, height: 240 };
    expect(faceOf({}, big)).toContain(">Living room</text>");
    expect(faceOf({ homeMapNames: false }, big)).not.toContain('class="hmt-name"');
    expect(faceOf({}, { width: 360, height: 88 })).not.toContain('class="hmt-name"');
    // Every pin as glass, with the thermostat's reading under it.
    const withClimate = { ...input, states: { ...states, "climate.thermostat": { entity_id: "climate.thermostat", state: "heat", attributes: { current_temperature: 21.46 } } } };
    const all = faceOf({ homeMapDevices: "all" }, big, withClimate);
    expect(count(all, 'class="hmt-pin"')).toBe(5);
    expect(all).toContain(">21.5°</text>");
    expect(all).not.toContain("class=hmt-dot ");
    const none = faceOf({ homeMapDevices: "none" });
    expect(none).not.toContain("class=hmt-dot ");
    expect(none).not.toContain('class="hmt-pin"');
    expect(none).toContain('class="hmt-pool"');
    expect(faceOf({ homeMapFurniture: false })).not.toContain('class="hmt-piece"');
    expect(faceOf({ homeMapLook: "night", homeMapFurniture: false })).not.toContain('class="hmt-piece"');
    expect(faceOf({ homeMapGlow: false })).not.toContain('class="hmt-pool"');
    const dark = faceOf({ homeMapLook: "night", homeMapGlow: false });
    expect(dark).not.toContain('class="hmt-pool"');
    expect(dark).not.toContain("url(#wa-hmt-wash)");
    // Tap lights shows the lights that are off only on the iPhone's tile.
    expect(faceOf({ homeMapTapLights: true })).not.toContain("hmt-dot-off");
    const floor = fixture().floors[0]!;
    const art = (o: Partial<Parameters<typeof homeTileArt>[0]>) => flatten(homeTileArt({ floor, states, look: "plan", width: 164, height: 58, ...o }));
    expect(count(art({ tapLights: true }), "hmt-dot-off")).toBe(2);
    expect(count(art({ look: "night", tapLights: true }), "hmt-dot-off")).toBe(2);
    // The blueprint measures a lone room.
    const one = faceOf({ homeMapLook: "blueprint", homeMapRoomId: LIVING }, big);
    expect(one).toContain('class="hmt-measures"');
    expect(one).toContain(">6.0 m</text>");
    expect(one).toContain(">5.0 m</text>");
    expect(faceOf({ homeMapLook: "blueprint" }, big)).not.toContain('class="hmt-measures"');
    expect(homeLengthText(3.5, false)).toBe("11′ 6″");
  });

  it("draws only the tile's room, filling the tile, with that room's pins and lights", () => {
    const face = (room?: string) => faceOf(room === undefined ? {} : { homeMapRoomId: room });
    // The living room alone: its lamp is the one lit.
    const living = face(LIVING);
    expect(living).toContain(`data-home-map-room=${LIVING}`);
    expect(living).toContain(`data-room=${LIVING}`);
    expect(living).not.toContain(`data-room=${KITCHEN}`);
    expect(count(living, 'class="hmt-pool"')).toBe(1);
    expect(living).toContain(">1 light on</span>");
    // The kitchen alone: its pendants are off, so nothing is lit.
    const kitchen = face(KITCHEN.toLowerCase());
    expect(kitchen).not.toContain(`data-room=${LIVING}`);
    expect(kitchen).toContain(`data-room=${KITCHEN}`);
    expect(kitchen).not.toContain('class="hmt-pool"');
    expect(kitchen).toContain(">No lights on</span>");
    // A room the floor no longer has draws the whole floor.
    const lost = face("7B1E0C2A-5D3F-4A8B-9C6D-0000000000EE");
    expect(lost).toContain(`data-room=${LIVING}`);
    expect(lost).toContain(`data-room=${KITCHEN}`);
    expect(lost).not.toMatch(/data-home-map-room=[0-9A-Fa-f]/);
  });

  it("puts a pin in the room it names, else the room under its point", () => {
    const doc = fixture();
    const floor = doc.floors[0]!;
    // The lamp names the kitchen though it stands in the living room; the
    // ceiling light names nothing and stands in the living room.
    floor.pins[0]!.roomId = KITCHEN;
    delete floor.pins[1]!.roomId;
    const drawn = (room: string) => watchHomeMapDrawnFloor({ entityId: `home_map.${FLOOR}`, homeMapRoomId: room }, doc)!;
    expect(drawn(LIVING).rooms.map((r) => r.id)).toEqual([LIVING]);
    expect(drawn(LIVING).pins.map((p) => p.entityId)).toEqual(["light.ceiling", "lock.side_door"]);
    expect(drawn(KITCHEN).pins.map((p) => p.entityId)).toEqual(["light.reading_lamp", "light.pendants", "climate.thermostat"]);
    expect(watchHomeMapDrawnFloor({ entityId: `home_map.${FLOOR}` }, doc)).toBe(floor);
  });

  it("titles the tile by its label, else its room, else its floor, else Home map", () => {
    const doc = fixture();
    const title = (t: Record<string, unknown>, d: HomeMapDocument | null = doc) => watchHomeMapTileTitle({ entityId: `home_map.${FLOOR}`, ...t }, d);
    expect(title({ customLabel: "Downstairs", homeMapRoomId: KITCHEN })).toBe("Downstairs");
    expect(title({ customLabel: " ", homeMapRoomId: KITCHEN })).toBe("Kitchen");
    expect(title({ homeMapRoomId: "7B1E0C2A-5D3F-4A8B-9C6D-0000000000EE" })).toBe("Ground floor");
    expect(title({})).toBe("Ground floor");
    expect(title({}, null)).toBe("Home map");
  });

  it("draws the house in place of the plan before the map is read, or for a floor it does not have", () => {
    const unread = flatten(renderWatchTileFace(tile, { width: 180, height: 110 }, { page, pages: [page], screen, scale: 1, states }, 14));
    expect(unread).toContain("wp-hm-face");
    expect(unread).not.toContain("wp-hm-plan\"");
    expect(unread).toContain(">Home map</span>");
    const other = flatten(renderWatchTileFace({ ...tile, entityId: `home_map.${UPSTAIRS}` }, { width: 180, height: 110 }, { page, pages: [page], screen, scale: 1, states, homeMap: fixture() }, 14));
    expect(other).toContain(`>${WATCH_HOME_MAP_MISSING_TEXT}</span>`);
    expect(watchHomeMapTileWords(undefined, undefined, false)).toBe("Home map");
    // A short tile drops the line.
    const short = flatten(renderWatchTileFace(tile, { width: 180, height: 30 }, { page, pages: [page], screen, scale: 1, states, homeMap: fixture() }, 14));
    expect(short).not.toContain("wp-hm-words");
  });
});
