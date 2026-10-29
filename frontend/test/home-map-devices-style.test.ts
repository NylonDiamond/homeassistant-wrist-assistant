// The map editor's Devices and Style modes without the page, and the tile
// side of the home style: the home's devices as the rail lists them (each
// in its own area, else its device's; hidden and on-the-map ones left out;
// grouped by area with this floor's first), the kinds the pins are filtered
// by and their words; a pin's own icon, pill, glow reach and colour as the
// tiles draw them; the tile rule (a tile key, else the home style, else the
// default) in the Map card's readers and setters and on a tile's face; and
// the Home map tiles of the library's pages with Use the home style.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  homeMapCanToggle,
  homeMapDeviceKind,
  homeMapDevices,
  homeMapEntityAreaId,
  homeMapFindDevices,
  homeMapKindCounts,
  homeMapStateText,
  homeMapToggleWords,
  homeMapTray,
} from "../src/home-map/devices-model.js";
import { setHomeStyle } from "../src/home-map/edit-ops.js";
import type { HomeMapDocument, HomeMapStates } from "../src/home-map/model.js";
import { homeMapAutoPinIcon, homeMapGlowHex, homeMapPinGlowRadius, homeMapPinPill, homeMapPinSymbol } from "../src/home-map/pin-look.js";
import { homeMapOwnLookWords, homeMapPagesWithoutTileStyle, homeMapTileUses } from "../src/home-map/style-model.js";
import { homeTileArt } from "../src/home-map/tile-art.js";
import {
  setWatchHomeMapLook,
  setWatchHomeMapNames,
  setWatchHomeMapTurn,
  useWatchHomeMapHomeStyle,
  watchHomeMapArtOptions,
  watchHomeMapFollowsHomeStyle,
  watchHomeMapLook,
  watchHomeMapNames,
  watchHomeMapTurn,
} from "../src/watch-pages/home-map-tile.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";

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

const S = (state: string, attributes: Record<string, unknown> = {}) => ({ state, attributes });

/** Home Assistant with a few devices: one on the map, one hidden, one
 * diagnostic, one living in its device's area, one with no area. */
function hass() {
  return {
    states: {
      "light.reading_lamp": S("on", { friendly_name: "Reading lamp", brightness: 200 }),
      "light.ceiling_light": S("off", { friendly_name: "Ceiling Light" }),
      "media_player.soundbar": S("idle", { friendly_name: "Soundbar", device_class: "speaker" }),
      "switch.dishwasher": S("on", { friendly_name: "Dishwasher Plug" }),
      "sensor.wifi": S("-60", { friendly_name: "Wifi", unit_of_measurement: "dBm" }),
      "light.secret": S("off", { friendly_name: "Secret" }),
      "binary_sensor.hall_motion": S("off", { friendly_name: "Hall Motion", device_class: "motion" }),
      "automation.morning": S("on", { friendly_name: "Morning" }),
      "light.loose": S("off", { friendly_name: "Loose" }),
    },
    entities: {
      "light.ceiling_light": { area_id: "living_room", device_id: "d2" },
      "media_player.soundbar": { device_id: "d1" },
      "switch.dishwasher": { area_id: "kitchen" },
      "sensor.wifi": { area_id: "kitchen", entity_category: "diagnostic" },
      "light.secret": { area_id: "kitchen", hidden: true },
      "binary_sensor.hall_motion": { area_id: "hall" },
      "automation.morning": { area_id: "kitchen" },
      "light.reading_lamp": { area_id: "living_room" },
    },
    devices: { d1: { area_id: "living_room" }, d2: { area_id: "kitchen" } },
    areas: { living_room: { name: "Living room" }, kitchen: { name: "Kitchen" }, hall: { name: "Hall" } },
  } as never;
}

// ── the home's devices ───────────────────────────────────────────────────

describe("the Devices rail's lists", () => {
  it("takes an entity's own area over its device's, and its device's when it has none", () => {
    const h = hass();
    expect(homeMapEntityAreaId(h, "light.ceiling_light")).toBe("living_room");
    expect(homeMapEntityAreaId(h, "media_player.soundbar")).toBe("living_room");
    expect(homeMapEntityAreaId(h, "light.loose")).toBeUndefined();
    expect(homeMapEntityAreaId(undefined, "light.loose")).toBeUndefined();
  });

  it("lists every device by name, a hidden one left out", () => {
    const devices = homeMapDevices(hass());
    expect(devices.map((d) => d.entityId)).not.toContain("light.secret");
    expect(devices.map((d) => d.name)).toEqual([...devices.map((d) => d.name)].sort((a, b) => a.localeCompare(b)));
    expect(devices.find((d) => d.entityId === "media_player.soundbar")).toMatchObject({ areaId: "living_room", areaName: "Living room", deviceClass: "speaker", domain: "media_player" });
    expect(devices.find((d) => d.entityId === "sensor.wifi")?.category).toBe("diagnostic");
  });

  it("groups what is not on the map by area, the floor's rooms' areas first, leaving out the map's, diagnostics, other kinds and the arealess", () => {
    const doc = fixture();
    const groups = homeMapTray(doc, doc.floors[0]!, homeMapDevices(hass()));
    expect(groups.map((g) => [g.name, g.here, g.devices.map((d) => d.entityId)])).toEqual([
      ["Living room", true, ["light.ceiling_light", "media_player.soundbar"]],
      ["Kitchen", true, ["switch.dishwasher"]],
      ["Hall", false, ["binary_sensor.hall_motion"]],
    ]);
  });

  it("finds devices by every word typed, a name starting with them first", () => {
    const devices = homeMapDevices(hass());
    expect(homeMapFindDevices(devices, "")).toEqual([]);
    expect(homeMapFindDevices(devices, "light").map((d) => d.entityId)).toEqual(["light.ceiling_light", "light.loose", "light.reading_lamp"]);
    expect(homeMapFindDevices(devices, "kitchen plug").map((d) => d.entityId)).toEqual(["switch.dishwasher"]);
    expect(homeMapFindDevices(devices, "sound").map((d) => d.entityId)).toEqual(["media_player.soundbar"]);
  });

  it("filters pins by kind and counts the floor's", () => {
    expect(homeMapDeviceKind("light.x")).toBe("lights");
    expect(homeMapDeviceKind("climate.x")).toBe("climate");
    expect(homeMapDeviceKind("binary_sensor.x")).toBe("sensors");
    expect(homeMapDeviceKind("switch.x")).toBe("power");
    expect(homeMapDeviceKind("media_player.x")).toBe("media");
    expect(homeMapDeviceKind("lock.x")).toBe("security");
    expect(homeMapDeviceKind("cover.x")).toBe("covers");
    expect(homeMapDeviceKind("scene.x")).toBe("other");
    expect(homeMapKindCounts(fixture().floors[0]!)).toEqual([
      { kind: "lights", label: "Lights", count: 3 },
      { kind: "climate", label: "Climate", count: 1 },
      { kind: "security", label: "Security", count: 1 },
    ]);
  });

  it("says what a device is doing in a few words, and which can be turned on or off", () => {
    const states: HomeMapStates = {
      "light.a": S("on", { brightness: 204 }),
      "light.b": S("off"),
      "sensor.t": S("21.5", { unit_of_measurement: "°C" }),
      "sensor.p": S("627", { unit_of_measurement: "W" }),
      "climate.c": S("heat", { current_temperature: 21.5 }),
      "cover.d": S("open"),
    };
    expect(homeMapStateText("light.a", states)).toBe("on · 80%");
    expect(homeMapStateText("light.b", states)).toBe("off");
    expect(homeMapStateText("sensor.t", states)).toBe("21.5°C");
    expect(homeMapStateText("sensor.p", states)).toBe("627 W");
    expect(homeMapStateText("climate.c", states)).toBe("heat · 21.5°");
    expect(homeMapStateText("light.gone", states)).toBe("gone");
    expect(homeMapCanToggle("light.a")).toBe(true);
    expect(homeMapCanToggle("lock.a")).toBe(false);
    expect(homeMapToggleWords("light.a", states)).toBe("Turn off");
    expect(homeMapToggleWords("light.b", states)).toBe("Turn on");
    expect(homeMapToggleWords("cover.d", states)).toBe("Close");
  });
});

// ── a pin's own look ─────────────────────────────────────────────────────

describe("a pin's own keys", () => {
  it("picks an icon by kind, class and name when the pin has none", () => {
    expect(homeMapAutoPinIcon("light.kitchen")).toBe("bulb");
    expect(homeMapAutoPinIcon("light.floor_lamp")).toBe("lamp");
    expect(homeMapAutoPinIcon("light.tv_strip")).toBe("strip");
    expect(homeMapAutoPinIcon("switch.dishwasher")).toBe("plug");
    expect(homeMapAutoPinIcon("media_player.kitchen", "speaker")).toBe("speaker");
    expect(homeMapAutoPinIcon("media_player.living")).toBe("tv");
    expect(homeMapAutoPinIcon("binary_sensor.x", "motion")).toBe("motion");
    expect(homeMapAutoPinIcon("binary_sensor.x", "door")).toBe("door");
    expect(homeMapAutoPinIcon("cover.garage", "garage")).toBe("door");
    expect(homeMapAutoPinIcon("cover.blinds")).toBe("blinds");
    expect(homeMapAutoPinIcon("climate.x")).toBe("thermostat");
    expect(homeMapAutoPinIcon("vacuum.x")).toBe("vacuum");
  });

  it("draws its own icon's symbol as the apps do, a lock open while unlocked", () => {
    expect(homeMapPinSymbol({ entityId: "light.a", icon: "lamp" })).toBe("lamp.floor.fill");
    expect(homeMapPinSymbol({ entityId: "lock.a", icon: "lock" }, { "lock.a": S("unlocked") })).toBe("lock.open.fill");
    expect(homeMapPinSymbol({ entityId: "lock.a", icon: "lock" }, { "lock.a": S("locked") })).toBe("lock.fill");
  });

  it("reaches as far as its glow, else by brightness, and tints only with a #RRGGBB", () => {
    expect(homeMapPinGlowRadius({ glow: 1.7 }, 0.1)).toBe(1.7);
    expect(homeMapPinGlowRadius({}, 1)).toBeCloseTo(2.4, 5);
    expect(homeMapGlowHex({ glowColor: "#7FC0FF" })).toBe("#7fc0ff");
    expect(homeMapGlowHex({ glowColor: "warm" })).toBeUndefined();
    expect(homeMapGlowHex({})).toBeUndefined();
  });

  it("puts its reading, its name or nothing in its pill", () => {
    const states: HomeMapStates = { "sensor.h": S("52", { unit_of_measurement: "%", friendly_name: "Bath humidity" }) };
    expect(homeMapPinPill({ entityId: "sensor.h" }, states)).toBe("52%");
    expect(homeMapPinPill({ entityId: "sensor.h", reading: "name" }, states)).toBe("Bath humidity");
    expect(homeMapPinPill({ entityId: "sensor.h", reading: "name", name: "Humidity" }, states)).toBe("Humidity");
    expect(homeMapPinPill({ entityId: "sensor.h", reading: "none" }, states)).toBeUndefined();
  });

  it("is drawn on the tiles: the pool's reach and colour, the dot's colour and the pill", () => {
    const doc = fixture();
    const floor = doc.floors[0]!;
    const states: HomeMapStates = { "light.reading_lamp": S("on", { brightness: 255, friendly_name: "Reading lamp" }), "climate.thermostat": S("heat", { current_temperature: 21.5 }) };
    const plain = flatten(homeTileArt({ floor, states, look: "plan", width: 1000, height: 500, frame: { scale: 100, ox: 0, oy: 0 } }));
    // Full brightness reaches 2.4 m: 240 units at 100 a meter.
    expect(plain).toContain("r=240 ");
    expect(plain).not.toContain("wa-hmt-r-plan-");
    const own = structuredClone(floor);
    own.pins[0] = { ...own.pins[0]!, glow: 1.2, glowColor: "#7FC0FF" };
    own.pins[4] = { ...own.pins[4]!, reading: "name", name: "Heat" };
    const dressed = flatten(homeTileArt({ floor: own, states, look: "plan", devices: "all", width: 1000, height: 500, frame: { scale: 100, ox: 0, oy: 0 } }));
    expect(dressed).toContain("r=120 ");
    expect(dressed).toContain("wa-hmt-r-plan-7fc0ff");
    expect(dressed).toContain("rgba(127,192,255,0.55)");
    expect(dressed).toContain(">Heat</text>");
    expect(dressed).not.toContain(">21.5°</text>");
    // The model looks tint the halo and the wash too.
    const night = flatten(homeTileArt({ floor: own, states, look: "night", width: 600, height: 400 }));
    expect(night).toContain("wa-hmt-r-halo-night-7fc0ff");
    const dots = flatten(homeTileArt({ floor: own, states, look: "dots", width: 600, height: 400 }));
    expect(dots).toContain("fill=#7fc0ff");
  });
});

// ── the tile rule ────────────────────────────────────────────────────────

function pagesDoc(tile: Record<string, unknown>): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: "P1", name: "Home", items: [{ id: "T1", entityId: `home_map.${FLOOR}`, colSpan: 6, rowSpan: 6, ...tile }] }] };
}
const tileOf = (d: WatchPagesDocument) => ((d.pages as Record<string, any>[])[0]!.items as Record<string, unknown>[])[0]!;

describe("a Home map tile's look keys by the tile rule", () => {
  const home = setHomeStyle(fixture(), { look: "night", turn: 40, names: false })!;

  it("reads a tile key, else the home style, else the default", () => {
    expect(watchHomeMapLook({}, home)).toBe("night");
    expect(watchHomeMapLook({ homeMapLook: "clay" }, home)).toBe("clay");
    expect(watchHomeMapLook({ homeMapLook: "dollhouse" }, home)).toBe("warm");
    expect(watchHomeMapLook({})).toBe("plan");
    expect(watchHomeMapTurn({}, home)).toBe(40);
    expect(watchHomeMapNames({}, home)).toBe(false);
    expect(watchHomeMapNames({ homeMapNames: true }, home)).toBe(true);
    expect(watchHomeMapArtOptions({ homeMapTapLights: true }, home)).toEqual({ look: "night", turn: 40, names: false, devices: "lights", furniture: true, glow: true, tapLights: true });
  });

  it("writes a key only where the choice differs from the home style", () => {
    let d = setWatchHomeMapLook(pagesDoc({}), "P1", "T1", "night", home);
    expect(tileOf(d)).not.toHaveProperty("homeMapLook");
    d = setWatchHomeMapLook(d, "P1", "T1", "plan", home);
    expect(tileOf(d).homeMapLook).toBe("plan");
    d = setWatchHomeMapTurn(d, "P1", "T1", 40, home);
    expect(tileOf(d)).not.toHaveProperty("homeMapTurn");
    d = setWatchHomeMapTurn(d, "P1", "T1", -28, home);
    expect(tileOf(d).homeMapTurn).toBe(-28);
    d = setWatchHomeMapNames(d, "P1", "T1", true, home);
    expect(tileOf(d).homeMapNames).toBe(true);
    // Without the map the defaults are the home style, as before.
    expect(tileOf(setWatchHomeMapLook(pagesDoc({ homeMapLook: "night" }), "P1", "T1", "plan"))).not.toHaveProperty("homeMapLook");
  });

  it("uses the home style: all six keys taken away, the rest kept", () => {
    const own = pagesDoc({ homeMapLook: "clay", homeMapTurn: 10, homeMapNames: false, homeMapDevices: "all", homeMapFurniture: false, homeMapGlow: false, homeMapRoomId: KITCHEN });
    expect(watchHomeMapFollowsHomeStyle(tileOf(own))).toBe(false);
    const back = useWatchHomeMapHomeStyle(own, "P1", "T1");
    expect(tileOf(back)).toEqual({ id: "T1", entityId: `home_map.${FLOOR}`, colSpan: 6, rowSpan: 6, homeMapRoomId: KITCHEN });
    expect(watchHomeMapFollowsHomeStyle(tileOf(back))).toBe(true);
    expect(useWatchHomeMapHomeStyle(back, "P1", "T1")).toBe(back);
  });
});

// ── Used on ──────────────────────────────────────────────────────────────

describe("the Home map tiles of the library's pages", () => {
  const summary = {
    pages: {
      B: { item: { id: "B", name: "iPhone Home", items: [
        { id: "T2", entityId: `home_map.${FLOOR}`, colSpan: 12, rowSpan: 6, homeMapLook: "night", homeMapTurn: 40 },
        { id: "T3", entityId: `home_map.${FLOOR}`, colSpan: 6, rowSpan: 6, homeMapRoomId: KITCHEN },
        { id: "T4", entityId: "light.kitchen", colSpan: 3, rowSpan: 3 },
      ] }, owners: [] },
      A: { item: { id: "A", name: "Living", items: [{ id: "T1", entityId: `home_map.${FLOOR}`, colSpan: 6, rowSpan: 6, customLabel: "Downstairs" }] }, owners: [] },
    },
  };

  it("lists each by page in name order, with its size and whether it follows the home style", () => {
    const uses = homeMapTileUses(summary as never, fixture());
    expect(uses.map((u) => [u.pageName, u.what, u.size, u.own, u.words, u.look])).toEqual([
      ["iPhone Home", "Home map", "12×6", true, "Own look: Night, turned 40°", "night"],
      ["iPhone Home", "Kitchen only", "6×6", false, "Home style", "plan"],
      ["Living", "Downstairs", "6×6", false, "Home style", "plan"],
    ]);
    expect(homeMapOwnLookWords({ homeMapDevices: "all", homeMapGlow: false }, fixture())).toBe("Own look: every device, no glow");
  });

  it("takes every tile's own look away on a page, or says nothing changed", () => {
    const doc = { schemaVersion: 1, pages: [summary.pages.B.item] } as WatchPagesDocument;
    const next = homeMapPagesWithoutTileStyle(doc)!;
    const items = (next.pages as Record<string, any>[])[0]!.items as Record<string, unknown>[];
    expect(items[0]).toEqual({ id: "T2", entityId: `home_map.${FLOOR}`, colSpan: 12, rowSpan: 6 });
    expect(items[1]).toBe(summary.pages.B.item.items[1]);
    expect(items[2]).toBe(summary.pages.B.item.items[2]);
    expect(homeMapPagesWithoutTileStyle(next)).toBeUndefined();
  });
});
