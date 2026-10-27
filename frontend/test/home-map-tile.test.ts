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
import {
  WATCH_HOME_MAP_ADD_WORDS,
  WATCH_HOME_MAP_MISSING_TEXT,
  WATCH_HOME_MAP_NO_MAP_TEXT,
  WATCH_HOME_MAP_TAP_LIGHTS_HINT,
  setWatchHomeMapFloor,
  setWatchHomeMapTapLights,
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
    expect(text).toContain("<h4>Floor</h4>");
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

  it("draws the floor's plan small, a glow over each room with a light on, and how many lights are on", () => {
    const face = flatten(renderWatchTileFace(tile, { width: 180, height: 110 }, { page, pages: [page], screen, scale: 1, states, stateMode: "live", homeMap: fixture() }, 14));
    expect(face).toContain("wp-hm-face");
    expect(face).toContain(`data-home-map=${FLOOR}`);
    expect(face).toContain("viewBox=-0.4 -0.4 10.8 5.8");
    expect(face).toContain("data-room=7B1E0C2A-5D3F-4A8B-9C6D-000000000010");
    // Only the living room is lit, so one room glows and one light is dotted.
    expect(face.split("hm-room-glow").length - 1).toBe(1);
    expect(face.split("hm-dot").length - 1).toBe(1);
    expect(face).toContain("url(#wa-hm-glow)");
    expect(face).toContain(">1 light on</span>");
    // No buttons and no names on the tile.
    expect(face).not.toContain('class="hm-pin"');
    expect(face).not.toContain("hm-name");
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
