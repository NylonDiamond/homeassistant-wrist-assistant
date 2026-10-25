// A tile's layers (`design`): the key, its normal form, owned base layers,
// rebuilds after a simple edit, Reset and Reset all, the caps and problems,
// tap zones and their 40 pt rule, hit testing, the template key, the budget
// and the version gate. App repo docs/tile_layers_contract_2026-10.md.

import { describe, expect, it } from "vitest";
import { fnv1a64Hex } from "../src/compiler.js";
import type { HassEntityState } from "../src/ha-api.js";
import { type Element, type TextElement, encodeConfig, newElement, parseConfig } from "../src/model.js";
import { customTilesFor, customTilesUpdateNote, MIN_VERSION_FOR_CUSTOM_TILES } from "../src/version.js";
import { checkWatchPagesValues } from "../src/watch-pages/merge.js";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import {
  type BaseLayerContext,
  type TileDesign,
  BASE_LAYER_IDS,
  DELTA_MAX_TEMPLATES,
  TILE_DESIGN_FAMILY,
  TILE_DESIGN_KEY,
  TILE_DESIGN_MAX_BYTES,
  TILE_DESIGN_MAX_LAYERS,
  TILE_DESIGN_MAX_ZONES,
  TILE_DESIGN_SCREEN_WIDTH,
  TILE_DESIGN_VERSION,
  TILE_LAYER_KINDS,
  TILE_TEMPLATE_KEY_PREFIX,
  TILE_TEMPLATE_MAX_CHARS,
  TILE_ZONE_MIN_POINTS,
  addLayer,
  applyZonePreset,
  baseRoleOf,
  designForEdit,
  designSummary,
  documentTemplateCount,
  encodeTileDesign,
  layerStatus,
  moveLayer,
  normalizeDesignDoc,
  ownChangedBaseLayers,
  pageTemplateKeys,
  readTileDesign,
  rebuildBaseLayers,
  removeLayer,
  resetAllLayers,
  resetBaseLayer,
  setZoneAction,
  settingOwnerRole,
  syncTileDesigns,
  tileDesignBox,
  tileDesignProblems,
  tileHasLayers,
  tileTemplateKey,
  tileZoneHit,
  withDesign,
  writeDesignDoc,
  zonePresetAllowed,
  zonePresetOf,
  zonesOf,
} from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });

function entity(entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" };
}

const STATES = {
  "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 209 }),
  "sensor.chen_battery": entity("sensor.chen_battery", "64", { friendly_name: "Chen battery", unit_of_measurement: "%" }),
};
const CTX: BaseLayerContext = { states: STATES, measurer };

const TILE_ID = "1B6E1F4C-6E83-4B5E-9C5C-7F3A2D1E0A11";
const PAGE_ID = "0D9C6B3A-1F2E-4D5C-8B7A-695847362514";
const LIGHT: WatchPageTile = { id: TILE_ID, entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 };

function textOf(design: TileDesign, id: string): TextElement {
  const el = design.doc.elements.find((e) => e.payload.id === id);
  if (el?.kind !== "text") throw new Error(`no text ${id}`);
  return el.payload;
}

/** The light with its name layer moved and set to 12 pt bold. */
function ownedNameTile(): WatchPageTile {
  const before = designForEdit(LIGHT, CTX);
  const next = structuredClone(before.doc);
  const name = next.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!.payload as TextElement;
  name.fontSize = 12;
  name.fontWeight = "bold";
  name.frame = { ...name.frame, y: 0.6 };
  return writeDesignDoc(LIGHT, before, next, CTX);
}

describe("constants", () => {
  it("are the contract's", () => {
    expect(TILE_DESIGN_KEY).toBe("design");
    expect(TILE_DESIGN_VERSION).toBe(1);
    expect(TILE_DESIGN_MAX_BYTES).toBe(16384);
    expect(TILE_DESIGN_MAX_LAYERS).toBe(8);
    expect(TILE_DESIGN_MAX_ZONES).toBe(4);
    expect(TILE_TEMPLATE_MAX_CHARS).toBe(4096);
    expect(DELTA_MAX_TEMPLATES).toBe(100);
    expect(TILE_ZONE_MIN_POINTS).toBe(40);
    expect(TILE_DESIGN_SCREEN_WIDTH).toBe(208);
    expect(TILE_DESIGN_FAMILY).toBe("rectangular");
    expect(TILE_TEMPLATE_KEY_PREFIX).toBe("tile_");
    expect(TILE_LAYER_KINDS).toEqual(["text", "icon", "gauge", "shape", "image"]);
    expect(BASE_LAYER_IDS).toEqual({
      icon: "BA5E0000-0000-4000-8000-000000000001",
      photo: "BA5E0000-0000-4000-8000-000000000002",
      name: "BA5E0000-0000-4000-8000-000000000003",
      state: "BA5E0000-0000-4000-8000-000000000004",
    });
    expect(baseRoleOf("ba5e0000-0000-4000-8000-000000000003")).toBe("name");
    expect(baseRoleOf("6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A01")).toBeUndefined();
  });

  it("design box pins 6x4 to 100.5 by 66", () => {
    expect(tileDesignBox(6, 4)).toEqual({ width: 100.5, height: 66 });
    expect(tileDesignBox(3, 3)).toEqual({ width: 48.75, height: 48.75 });
  });
});

describe("tileHasLayers", () => {
  it("is true for entity tiles and false for kinds with content of their own", () => {
    for (const id of ["light.a", "switch.a", "sensor.a", "person.a", "climate.a", "scene.a", "script.a", "sun.sun", "foo.bar"]) {
      expect(tileHasLayers({ entityId: id })).toBe(true);
    }
    for (const id of ["camera.a", "media_player.a", "remote.a", "weather.a", "calendar.a", "todo.a", "image.a", "assist_satellite.a",
      "conversation.a", "stt.a", "tts.a", "wake_word.a", "macro.a", "http_action.X", "template.X", "page.X", "spacer.X", "music_hub.X"]) {
      expect(tileHasLayers({ entityId: id })).toBe(false);
    }
    expect(tileHasLayers({})).toBe(false);
  });
});

describe("reading and writing the key", () => {
  it("an untouched tile has no design, and reads none", () => {
    expect(readTileDesign(LIGHT)).toBeUndefined();
    const fresh = designForEdit(LIGHT, CTX);
    expect(fresh.owned).toEqual([]);
    expect(fresh.zones).toEqual({});
    expect(fresh.doc.elements.map((e) => e.payload.id)).toEqual([BASE_LAYER_IDS.icon, BASE_LAYER_IDS.state, BASE_LAYER_IDS.name]);
  });

  it("drops a design that is only the base layers as built now", () => {
    const fresh = designForEdit(LIGHT, CTX);
    expect(withDesign(LIGHT, fresh, CTX)).toEqual(LIGHT);
    expect(Object.hasOwn(withDesign({ ...LIGHT, design: { v: 1 } }, fresh, CTX), "design")).toBe(false);
  });

  it("writes the keys in order, owned as roles, the doc in normal form", () => {
    const tile = ownedNameTile();
    const raw = tile.design as Record<string, unknown>;
    expect(Object.keys(raw)).toEqual(["v", "owned", "zones", "doc"]);
    expect(raw.v).toBe(1);
    expect(raw.owned).toEqual(["base.name"]);
    expect(raw.zones).toEqual({});
    const doc = raw.doc as Record<string, unknown>;
    expect(doc.id).toBe(TILE_ID);
    expect(doc.name).toBe("Office");
    expect(doc.slotIndex).toBe(0);
    expect(doc.supportedFamilies).toEqual(["rectangular"]);
    expect(doc.dataSources).toEqual([]);
    expect(doc.tapAction).toEqual({ type: "none" });
    const read = readTileDesign(tile)!;
    expect(read.owned).toEqual(["name"]);
    expect(textOf(read, BASE_LAYER_IDS.name).fontSize).toBe(12);
    expect(read.template).toBeUndefined();
  });

  it("does not read another version, a document that does not parse, or a kind without layers", () => {
    const tile = ownedNameTile();
    const raw = tile.design as Record<string, unknown>;
    expect(readTileDesign({ ...tile, design: { ...raw, v: 2 } })).toBeUndefined();
    expect(readTileDesign({ ...tile, design: { ...raw, doc: { elements: [] } } })).toBeUndefined();
    expect(readTileDesign({ ...tile, design: "nope" })).toBeUndefined();
    expect(readTileDesign({ ...tile, entityId: "camera.door" })).toBeUndefined();
  });

  it("writes a template and its key when an added layer reads an attribute", () => {
    const before = designForEdit(LIGHT, CTX);
    const { design, id } = addLayer(before, "text");
    const t = design.doc.elements.find((e) => e.payload.id === id)!.payload as TextElement;
    t.value = { kind: { kind: "entityAttribute", entityId: "sensor.chen_battery", displayName: "Chen battery", domain: "sensor", attribute: "battery_level" } };
    const tile = writeDesignDoc(LIGHT, before, design.doc, CTX);
    const raw = tile.design as Record<string, unknown>;
    expect(Object.keys(raw)).toEqual(["v", "owned", "zones", "template", "doc"]);
    expect(typeof raw.template).toBe("string");
    expect(raw.template).toContain("state_attr('sensor.chen_battery', 'battery_level')");
    expect(raw.owned).toEqual([]);
  });

  it("normalises a document: placements folded, other families, groups and notes gone, taps inert", () => {
    const doc = parseConfig(encodeConfig(designForEdit(LIGHT, CTX).doc));
    doc.perFamily.circular = { placements: {}, rules: [] } as never;
    doc.perFamily.rectangular!.placements[BASE_LAYER_IDS.name] = { frame: { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 }, isHidden: true, size: 9 };
    doc.supportedFamilies = ["rectangular", "circular"];
    doc.notes = "hello";
    doc.groups = [{ id: "G", name: "G", locked: false }];
    const tap = newElement("tap");
    if (tap.kind === "tap") {
      tap.payload.action = { type: "refresh" };
      tap.payload.attachedTo = BASE_LAYER_IDS.icon;
      tap.payload.frame = { ...tap.payload.frame, rotationDegrees: 30 };
    }
    doc.elements.push(tap);
    const n = normalizeDesignDoc(doc);
    expect(n.supportedFamilies).toEqual(["rectangular"]);
    expect(Object.keys(n.perFamily)).toEqual(["rectangular"]);
    expect(n.perFamily.rectangular!.placements).toEqual({});
    expect(n.notes).toBeUndefined();
    expect(n.groups).toBeUndefined();
    const name = n.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!.payload as TextElement;
    expect(name.frame).toEqual({ x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 });
    expect(name.isHidden).toBe(true);
    expect(name.fontSize).toBe(9);
    const t = n.elements.find((e) => e.kind === "tap")!;
    expect(t.kind === "tap" && t.payload.action).toEqual({ type: "none" });
    expect(t.kind === "tap" && t.payload.attachedTo).toBeUndefined();
    expect(t.payload.frame.rotationDegrees).toBe(0);
    // The original is untouched.
    expect(doc.supportedFamilies).toEqual(["rectangular", "circular"]);
  });

  it("removes a tap layer with no zone entry and a zone entry with no tap layer", () => {
    const design = designForEdit(LIGHT, CTX);
    const tap = newElement("tap");
    const out = encodeTileDesign({
      ...design,
      doc: { ...design.doc, elements: [...design.doc.elements, tap] },
      owned: ["state", "name", "name"],
      zones: { "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A09": { action: "toggle" } },
    });
    expect(out.zones).toEqual({});
    expect(out.owned).toEqual(["base.name", "base.state"]);
    const doc = parseConfig(out.doc);
    expect(doc.elements.some((e) => e.kind === "tap")).toBe(false);
  });
});

describe("owned base layers", () => {
  it("an edit to a base layer owns it, and only it", () => {
    const tile = ownedNameTile();
    expect(readTileDesign(tile)!.owned).toEqual(["name"]);
  });

  it("deleting a base layer owns it, so a rebuild does not bring it back", () => {
    const before = designForEdit(LIGHT, CTX);
    const after = removeLayer(before, BASE_LAYER_IDS.state);
    expect(after.owned).toEqual(["state"]);
    expect(ownChangedBaseLayers(before, { ...before, doc: after.doc }).owned).toEqual(["state"]);
    const tile = withDesign(LIGHT, after, CTX);
    const rebuilt = rebuildBaseLayers(tile, readTileDesign(tile)!, CTX);
    expect(rebuilt.doc.elements.some((e) => e.payload.id === BASE_LAYER_IDS.state)).toBe(false);
  });

  it("an owned role survives a simple edit, and the followers are rebuilt", () => {
    const tile = ownedNameTile();
    const page = { id: "P1", items: [tile] };
    const before: WatchPagesDocument = { schemaVersion: 1, pages: [page] };
    const edited = { ...tile, labelFontSizeOverride: 16, badgeFontSizeOverride: 12 };
    const after: WatchPagesDocument = { schemaVersion: 1, pages: [{ ...page, items: [edited] }] };
    const synced = syncTileDesigns(before, after, CTX);
    expect(synced).not.toBe(after);
    const out = readTileDesign((synced.pages as { items: WatchPageTile[] }[])[0]!.items[0]!)!;
    expect(textOf(out, BASE_LAYER_IDS.name).fontSize).toBe(12);
    expect(textOf(out, BASE_LAYER_IDS.name).fontWeight).toBe("bold");
    const oldState = textOf(readTileDesign(tile)!, BASE_LAYER_IDS.state);
    expect(textOf(out, BASE_LAYER_IDS.state).fontSize).toBeGreaterThan(oldState.fontSize);
  });

  it("a simple edit that drops a follower removes it, and putting it back puts it at its rank", () => {
    const before = designForEdit(LIGHT, CTX);
    const added = addLayer(before, "shape").design;
    const design: TileDesign = { ...added, owned: [] };
    const off = rebuildBaseLayers({ ...LIGHT, showLabel: false }, design, CTX);
    expect(off.doc.elements.some((e) => e.payload.id === BASE_LAYER_IDS.name)).toBe(false);
    const back = rebuildBaseLayers(LIGHT, off, CTX);
    const ids = back.doc.elements.map((e) => e.payload.id);
    expect(ids.indexOf(BASE_LAYER_IDS.name)).toBe(ids.indexOf(BASE_LAYER_IDS.state) + 1);
  });

  it("syncTileDesigns hands back the same document when no design tile changed", () => {
    const tile = ownedNameTile();
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: "P1", items: [tile, { id: "T2", entityId: "switch.a" }] }] };
    const moved: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: "P1", items: [tile, { id: "T2", entityId: "switch.a", color: "#FF0000" }] }] };
    expect(syncTileDesigns(doc, doc, CTX)).toBe(doc);
    expect(syncTileDesigns(doc, moved, CTX)).toBe(moved);
  });

  it("Reset gives one layer back to the simple settings, and Reset all removes the design", () => {
    const tile = ownedNameTile();
    const reset = resetBaseLayer(tile, "name", CTX);
    // Nothing else was changed, so the design goes.
    expect(Object.hasOwn(reset, "design")).toBe(false);
    const withShape = writeDesignDoc(tile, readTileDesign(tile)!, addLayer(readTileDesign(tile)!, "shape").design.doc, CTX);
    const resetName = resetBaseLayer(withShape, "name", CTX);
    const d = readTileDesign(resetName)!;
    expect(d.owned).toEqual([]);
    expect(textOf(d, BASE_LAYER_IDS.name).fontSize).not.toBe(12);
    expect(d.doc.elements.some((e) => e.kind === "shape")).toBe(true);
    expect(Object.hasOwn(resetAllLayers(withShape), "design")).toBe(false);
    expect(resetBaseLayer(LIGHT, "name", CTX)).toBe(LIGHT);
  });

  it("layerStatus and designSummary", () => {
    const tile = ownedNameTile();
    const d = readTileDesign(tile)!;
    const { design, id } = addLayer(d, "text");
    expect(layerStatus(design, BASE_LAYER_IDS.name)).toBe("changed");
    expect(layerStatus(design, BASE_LAYER_IDS.state)).toBe("follows");
    expect(layerStatus(design, id)).toBe("added");
    const zoned = applyZonePreset(LIGHT, design, "leftRight");
    expect(layerStatus(zoned, zonesOf(zoned)[0]!.id)).toBe("zone");
    expect(layerStatus(undefined, BASE_LAYER_IDS.icon)).toBe("follows");
    expect(designSummary(zoned, tile)).toEqual({ layers: 4, changed: 1, added: 1, zones: 2 });
    expect(designSummary(undefined, LIGHT, CTX)).toEqual({ layers: 3, changed: 0, added: 0, zones: 0 });
  });

  it("settingOwnerRole points a simple key at its owned layer", () => {
    const d = readTileDesign(ownedNameTile())!;
    expect(settingOwnerRole(d, "labelFontSizeOverride")).toBe("name");
    expect(settingOwnerRole(d, "showLabel")).toBe("name");
    expect(settingOwnerRole(d, "customLabel")).toBeUndefined();
    expect(settingOwnerRole(d, "icon")).toBeUndefined();
    expect(settingOwnerRole(d, "decimalPlaces")).toBeUndefined();
    expect(settingOwnerRole({ ...d, owned: ["photo"] }, "icon")).toBe("photo");
    expect(settingOwnerRole({ ...d, owned: ["icon"] }, "usePersonPhoto")).toBe("icon");
    expect(settingOwnerRole({ ...d, owned: ["state"] }, "stateValueLabelStyle")).toBe("state");
    expect(settingOwnerRole(undefined, "icon")).toBeUndefined();
  });
});

describe("adding, removing and moving layers", () => {
  it("adds up to 8 layers and refuses kinds a tile cannot hold", () => {
    let d = designForEdit(LIGHT, CTX);
    for (let i = d.doc.elements.length; i < TILE_DESIGN_MAX_LAYERS; i++) {
      const r = addLayer(d, "text");
      expect(r.id).not.toBe("");
      d = r.design;
    }
    expect(addLayer(d, "icon")).toEqual({ design: d, id: "" });
    const fresh = designForEdit(LIGHT, CTX);
    expect(addLayer(fresh, "chart").id).toBe("");
    expect(addLayer(fresh, "list").id).toBe("");
  });

  it("adds tap zones on top, up to 4, each with an entry", () => {
    let d = designForEdit(LIGHT, CTX);
    const ids: string[] = [];
    for (let i = 0; i < TILE_DESIGN_MAX_ZONES; i++) {
      const r = addLayer(d, "tap");
      ids.push(r.id);
      d = r.design;
    }
    expect(addLayer(d, "tap").id).toBe("");
    expect(zonesOf(d).map((z) => z.id)).toEqual(ids);
    expect(d.doc.elements.filter((e) => e.kind === "tap").map((e) => e.payload.name)).toEqual(["Tap zone 1", "Tap zone 2", "Tap zone 3", "Tap zone 4"]);
    const shape = addLayer(d, "shape");
    const kinds = shape.design.doc.elements.map((e) => e.kind);
    expect(kinds.lastIndexOf("shape")).toBeLessThan(kinds.indexOf("tap"));
    const gone = removeLayer(shape.design, ids[1]!);
    expect(Object.keys(gone.zones)).not.toContain(ids[1]);
  });

  it("moves a layer a step and keeps tap zones above drawing layers", () => {
    const base = designForEdit(LIGHT, CTX);
    const zoned = addLayer(base, "tap").design;
    const up = moveLayer(zoned, BASE_LAYER_IDS.state, 1);
    expect(up.doc.elements.map((e) => e.payload.id).slice(0, 3)).toEqual([BASE_LAYER_IDS.icon, BASE_LAYER_IDS.name, BASE_LAYER_IDS.state]);
    expect(moveLayer(up, BASE_LAYER_IDS.state, 1)).toBe(up);
    expect(moveLayer(zoned, BASE_LAYER_IDS.icon, -1)).toBe(zoned);
  });
});

describe("tap zones", () => {
  it("presets split the tile, the first zone taking the tile's single tap", () => {
    const d = designForEdit(LIGHT, CTX);
    const lr = applyZonePreset(LIGHT, d, "leftRight");
    const zones = zonesOf(lr);
    expect(zones.map((z) => z.frame)).toEqual([
      { x: 0, y: 0, width: 0.5, height: 1, rotationDegrees: 0 },
      { x: 0.5, y: 0, width: 0.5, height: 1, rotationDegrees: 0 },
    ]);
    expect(zones[0]!.action.action).toBe("toggle");
    expect(zones[1]!.action).toEqual({ action: "none" });
    expect(zonePresetOf(lr)).toBe("leftRight");
    const set = setZoneAction(lr, zones[1]!.id, { action: "openControl", requiresConfirmation: true });
    const quad = applyZonePreset(LIGHT, set, "quad");
    const q = zonesOf(quad);
    expect(q).toHaveLength(4);
    expect(q[0]!.id).toBe(zones[0]!.id);
    expect(q[1]!.action).toEqual({ action: "openControl", requiresConfirmation: true });
    expect(q[2]!.action).toEqual({ action: "none" });
    expect(zonePresetOf(quad)).toBe("quad");
    const whole = applyZonePreset(LIGHT, quad, "whole");
    expect(zonesOf(whole)).toEqual([]);
    expect(whole.zones).toEqual({});
    expect(zonePresetOf(whole)).toBe("whole");
    expect(zonePresetOf(undefined)).toBe("whole");
    const custom = { ...lr, doc: { ...lr.doc, elements: lr.doc.elements.map((e) => (e.kind === "tap" ? { ...e, payload: { ...e.payload, frame: { ...e.payload.frame, width: 0.3 } } } as Element : e)) } };
    expect(zonePresetOf(custom)).toBe("custom");
  });

  it("a zone survives a write with its action", () => {
    const before = designForEdit(LIGHT, CTX);
    const lr = applyZonePreset(LIGHT, before, "leftRight");
    const z = zonesOf(lr);
    const d = setZoneAction(lr, z[1]!.id, {
      action: "triggerEntity",
      triggerTarget: { entityId: "script.ring_chen", mode: "run", friendlyName: "Ring Chen's phone" },
      requiresConfirmation: true,
    });
    const tile = withDesign(LIGHT, d, CTX);
    const raw = (tile.design as Record<string, Record<string, unknown>>).zones!;
    expect(Object.keys(raw)).toEqual(z.map((x) => x.id));
    expect(raw[z[1]!.id]).toEqual({
      action: "triggerEntity",
      triggerTarget: { entityId: "script.ring_chen", mode: "run", friendlyName: "Ring Chen's phone" },
      requiresConfirmation: true,
    });
    expect(zonesOf(readTileDesign(tile))).toEqual(zonesOf(d));
  });

  it("keeps every zone at least 40 pt on the smallest watch", () => {
    expect(zonePresetAllowed("whole", 1, 1, 162)).toBe(true);
    expect(zonePresetAllowed("leftRight", 6, 4, 208)).toBe(true);
    expect(zonePresetAllowed("topBottom", 6, 4, 208)).toBe(false);
    expect(zonePresetAllowed("quad", 6, 4, 208)).toBe(false);
    expect(zonePresetAllowed("leftRight", 6, 4, 162)).toBe(false);
    expect(zonePresetAllowed("topBottom", 6, 5, 208)).toBe(true);
    expect(zonePresetAllowed("quad", 6, 6, 208)).toBe(true);
    expect(zonePresetAllowed("topBottom", 12, 6, 162)).toBe(false);
    expect(zonePresetAllowed("topBottom", 12, 7, 162)).toBe(true);
  });

  it("hit testing takes the topmost zone and skips hidden ones", () => {
    const d = applyZonePreset(LIGHT, designForEdit(LIGHT, CTX), "leftRight");
    const [left, right] = zonesOf(d);
    const box = tileDesignBox(6, 4);
    expect(tileZoneHit(d, box, { x: 10, y: 30 })).toBe(left!.id);
    expect(tileZoneHit(d, box, { x: 90, y: 30 })).toBe(right!.id);
    expect(tileZoneHit(d, box, { x: 120, y: 30 })).toBeUndefined();
    const over = addLayer(d, "tap").design;
    const top = zonesOf(over)[2]!;
    expect(tileZoneHit(over, box, { x: 50.25, y: 33 })).toBe(top.id);
    const hidden = { ...over, doc: { ...over.doc, elements: over.doc.elements.map((e) => (e.payload.id === top.id ? { ...e, payload: { ...e.payload, isHidden: true } } as Element : e)) } };
    expect(tileZoneHit(hidden, box, { x: 60, y: 33 })).toBe(right!.id);
    expect(tileZoneHit(designForEdit(LIGHT, CTX), box, { x: 10, y: 10 })).toBeUndefined();
  });
});

describe("templates and the budget", () => {
  it("keys a template by its FNV-1a 64 hash", () => {
    expect(fnv1a64Hex("")).toBe("cbf29ce484222325");
    expect(fnv1a64Hex("a")).toBe("af63dc4c8601ec8c");
    expect(tileTemplateKey("a")).toBe("tile_af63dc4c8601ec8c");
  });

  it("counts show and tile templates per page and over the document, sharing equal texts", () => {
    const design = (template: string) => ({ v: 1, owned: [], zones: {}, template, doc: {} });
    const pageA = { id: "A", items: [
      { id: "1", entityId: "light.a", showWhenTemplate: "{{ true }}" },
      { id: "2", entityId: "light.b", showWhenTemplate: "{{ true }}" },
      { id: "3", entityId: "light.c", design: design("{{ 1 }}") },
      { id: "4", entityId: "light.d", design: design("{{ 1 }}") },
      { id: "5", entityId: "light.e", design: design("  "), showWhenTemplate: " " },
    ] };
    const pageB = { id: "B", items: [{ id: "6", entityId: "light.f", design: design("{{ 2 }}"), showWhenTemplate: "{{ 1 }}" }] };
    expect(pageTemplateKeys(pageA)).toEqual(new Set([`show_${fnv1a64Hex("{{ true }}")}`, tileTemplateKey("{{ 1 }}")]));
    expect(documentTemplateCount({ pages: [pageA, pageB] })).toBe(4);
    expect(documentTemplateCount({ pages: [{ id: "C", items: [{ showWhenTemplate: "x".repeat(4097) }] }] })).toBe(0);
  });
});

describe("problems", () => {
  const goodTile = () => ownedNameTile();

  it("a tile with no design or a good one has none", () => {
    expect(tileDesignProblems(LIGHT)).toEqual([]);
    expect(tileDesignProblems(goodTile())).toEqual([]);
  });

  it("names every cap and shape problem", () => {
    const tile = goodTile();
    const raw = tile.design as Record<string, unknown>;
    expect(tileDesignProblems({ ...tile, design: "x" })).toEqual(["design is not an object."]);
    expect(tileDesignProblems({ ...tile, design: { ...raw, v: 3 } })).toEqual(["design.v must be 1."]);
    expect(tileDesignProblems({ ...tile, design: { ...raw, doc: 4 } })).toEqual(["design.doc cannot be read."]);
    expect(tileDesignProblems({ ...tile, entityId: "camera.door" })).toEqual(["design is set on a tile whose kind has no layers."]);
    expect(tileDesignProblems({ ...tile, design: { ...raw, template: "x".repeat(4097) } })).toEqual(["design's values need 4097 of 4096 characters."]);
    const big = { ...raw, padding: "x".repeat(TILE_DESIGN_MAX_BYTES) };
    expect(tileDesignProblems({ ...tile, design: big })[0]).toMatch(/^design is \d+ bytes; the limit is 16384\.$/);
    const doc = parseConfig(raw.doc);
    for (let i = 0; i < 6; i++) doc.elements.push(newElement("text"));
    for (let i = 0; i < 5; i++) doc.elements.push(newElement("tap"));
    doc.elements.push(newElement("chart"));
    expect(tileDesignProblems({ ...tile, design: { ...raw, doc: encodeConfig(doc) } })).toEqual([
      "design has 10 layers; the limit is 8.",
      "design has 5 tap zones; the limit is 4.",
      "design has a chart layer, which a tile cannot draw.",
    ]);
  });

  it("the page draft's value check refuses a design over a cap, naming the tile", () => {
    const tile = goodTile();
    const raw = tile.design as Record<string, unknown>;
    const doc: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Home", items: [{ ...tile, design: { ...raw, v: 2 } }] }] };
    const problems = checkWatchPagesValues(doc);
    expect(problems, JSON.stringify(problems)).toHaveLength(1);
    expect(problems[0]).toContain("tile 1 (light.office): design.v must be 1.");
    expect(checkWatchPagesValues({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Home", items: [tile] }] })).toEqual([]);
  });
});

describe("the version gate", () => {
  it("draws tile layers from 3.2.0, and an unreported version reads as new enough", () => {
    expect(MIN_VERSION_FOR_CUSTOM_TILES).toBe("3.2.0");
    expect(customTilesFor("3.2.0")).toBe(true);
    expect(customTilesFor("3.10.1")).toBe(true);
    expect(customTilesFor("3.1.9")).toBe(false);
    expect(customTilesFor(undefined)).toBe(true);
    expect(customTilesFor(null)).toBe(true);
  });

  it("names the devices too old to draw them", () => {
    expect(customTilesUpdateNote([])).toBeUndefined();
    expect(customTilesUpdateNote(["Chen Watch"])).toBe("Chen Watch shows the plain tile until it updates to Wrist Assistant 3.2.");
    expect(customTilesUpdateNote(["A", "B"])).toBe("A and B show the plain tile until they update to Wrist Assistant 3.2.");
    expect(customTilesUpdateNote(["A", "B", "C"])).toBe("A, B and C show the plain tile until they update to Wrist Assistant 3.2.");
  });
});
