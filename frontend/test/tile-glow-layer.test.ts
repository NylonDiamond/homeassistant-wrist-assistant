// The glyph's Glow base layer (tile layers round three): built from the glow
// setting so it is the native glow, owned with the glyph slot, dragged,
// deleted and reset with it, kept out of a full design, and placed by its own
// anchor onto the native glow on every device. App repo
// docs/tile_layers_contract_2026-10.md, sections 14.4 to 14.7 and 14.9.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import { type ShapeElement, newElement } from "../src/model.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import { placeDesignDoc } from "../src/watch-pages/tile-anchors.js";
import { baseAnchors, baseLayers, glowReference, tileNativeFramesOn } from "../src/watch-pages/tile-base-layers.js";
import {
  type BaseLayerContext,
  type TileDesign,
  BASE_GLOW_ID,
  BASE_LAYER_IDS,
  TILE_DESIGN_MAX_LAYERS,
  anchorKeyOf,
  baseLayerName,
  baseRoleOf,
  designForEdit,
  drawnDesignDoc,
  dragLayerFrame,
  glyphSlotRole,
  layerStatus,
  moveLayer,
  parseAnchors,
  readTileDesign,
  rebuildBaseLayers,
  removeLayer,
  resetBaseLayer,
  setLayerFrame,
  settingOwnerRole,
  tileDesignBox,
  withDesign,
} from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });
const phoneMeasurer = oneLookMeasurer("phone", { estimate: true });
const entity = (entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: entityId, state, attributes, last_changed: "", last_updated: "" });

const BED_ON = { "light.bed": entity("light.bed", "on", { friendly_name: "Bed Light", brightness: 128 }) };
const CTX: BaseLayerContext = { states: BED_ON, measurer, phoneMeasurer };
const BED: WatchPageTile = { id: "6A1C2B3D-0001-4000-8000-000000000001", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" };
const SENSOR: WatchPageTile = { id: "6A1C2B3D-0002-4000-8000-000000000002", entityId: "sensor.temp", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 };
const SENSOR_CTX: BaseLayerContext = { states: { "sensor.temp": entity("sensor.temp", "21", { unit_of_measurement: "°C" }) }, measurer, phoneMeasurer };
const PERSON: WatchPageTile = { id: "6A1C2B3D-0003-4000-8000-000000000003", entityId: "person.chen", colSpan: 4, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#5E8FD0", usePersonPhoto: true };
const PERSON_CTX: BaseLayerContext = { states: { "person.chen": entity("person.chen", "home", { friendly_name: "Chen", entity_picture: "/x.png" }) }, measurer, phoneMeasurer };

const glowIn = (els: readonly { kind: string; payload: { id: string } }[]) => els.find((e) => e.payload.id === BASE_GLOW_ID) as { kind: "shape"; payload: ShapeElement } | undefined;
const ids = (design: TileDesign) => design.doc.elements.map((e) => e.payload.id);
const frameOf = (design: TileDesign, id: string) => design.doc.elements.find((e) => e.payload.id === id)!.payload.frame;

describe("the Glow base layer is the native glow", () => {
  it("is built under the icon for the light of section 14.4: white at 0.32, on by rule, off at 0", () => {
    const layers = baseLayers(BED, CTX);
    expect(layers.map((e) => e.payload.id).slice(0, 2)).toEqual([BASE_GLOW_ID, BASE_LAYER_IDS.icon]);
    const glow = glowIn(layers)!.payload;
    expect(glow.name).toBe("Glow");
    expect(glow.kind).toBe("circle");
    expect(glow.opacity).toBe(0.32);
    expect(glow.colorSlot.baseColorHex).toBe("#FFFFFF");
    expect(glow.fill).toEqual({ kind: "radial", stops: [{ at: 0, colorHex: "#FFFFFF" }, { at: 1, colorHex: "#FFFFFF00" }] });
    // The worked example: the halo square 1.5 times the 47.79 glyph box on its centre.
    expect(glow.frame).toEqual({ x: 0.1434, y: -0.0885, width: 0.7132, height: 1.086, rotationDegrees: 0 });
    expect(glow.rules).toHaveLength(1);
    const rule = glow.rules[0]!;
    expect(rule.cases.map((c) => [c.when.tests[0]!.comparison.kind, c.then[0]!.kind, c.then[0]!.number])).toEqual([["isOn", "setOpacity", 1]]);
    expect(rule.otherwise).toEqual([{ kind: "setOpacity", number: 0 }]);
    expect(rule.cases[0]!.when.tests[0]!.value).toMatchObject({ kind: { kind: "entityState", entityId: "light.bed" } });
  });

  it("matches the native glow's rect, colour and opacity on and off", () => {
    const tile = { ...BED, iconGlow: { mode: "on", size: 200, brightness: 150, color: "#3366FF" } };
    const glow = glowIn(baseLayers(tile, CTX))!.payload;
    const anchor = baseAnchors(tile, CTX).glow!;
    // Twice the glyph box, on its centre.
    expect(glow.frame.width).toBeCloseTo(anchor.width * 2, 3);
    expect(glow.frame.x + glow.frame.width / 2).toBeCloseTo(anchor.x + anchor.width / 2, 3);
    expect(glow.frame.y + glow.frame.height / 2).toBeCloseTo(anchor.y + anchor.height / 2, 3);
    expect(glow.colorSlot.baseColorHex).toBe("#3366FF");
    // On 0.32 x 1.5, off (graphite, the mode on) 0.14 x 1.5.
    expect(glow.opacity).toBe(0.48);
    expect(glow.rules[0]!.otherwise).toEqual([{ kind: "setOpacity", number: 0.4375 }]);
  });

  it("is not built with the mode off, nor for a gray sensor under auto, but is with the mode on", () => {
    expect(glowIn(baseLayers({ ...BED, iconGlow: { mode: "off" } }, CTX))).toBeUndefined();
    // A sensor the watch colours glows at rest, and goes out while unavailable.
    const coloured = glowIn(baseLayers(SENSOR, SENSOR_CTX))!.payload;
    expect(coloured.opacity).toBe(0.14);
    expect(coloured.rules[0]!.cases.map((c) => [c.when.tests[0]!.comparison.kind, c.then[0]!.number])).toEqual([["isUnavailable", 0]]);
    expect(coloured.rules[0]!.otherwise).toBeUndefined();
    // Gray (unavailable now, under auto): none.
    const gone: BaseLayerContext = { ...SENSOR_CTX, states: { "sensor.temp": entity("sensor.temp", "unavailable") } };
    expect(glowIn(baseLayers(SENSOR, gone))).toBeUndefined();
    const on = glowIn(baseLayers({ ...SENSOR, iconGlow: { mode: "on" } }, gone))!.payload;
    expect(on.opacity).toBe(0.14);
    // Not an on/off kind, and the mode on keeps the gray glow: no rule.
    expect(on.rules).toEqual([]);
  });

  it("names the glow, reads it as the glyph's and gives it its own anchor key", () => {
    expect(baseLayerName(BASE_GLOW_ID)).toBe("Glow");
    expect(baseRoleOf(BASE_GLOW_ID)).toBe("icon");
    expect(anchorKeyOf(BASE_GLOW_ID)).toBe("glow");
    expect(anchorKeyOf(BASE_LAYER_IDS.icon)).toBe("icon");
    expect(parseAnchors({ "base.glow": { x: 0, y: 0, width: 0.5, height: 0.5, size: 40 } })).toEqual({ glow: { x: 0, y: 0, width: 0.5, height: 0.5, size: 40 } });
  });

  it("gives the glow editor its reference: the glyph box, the opacity at 100% and the tile's colour", () => {
    const ref = glowReference({ ...BED, iconGlow: { brightness: 250 } }, CTX)!;
    expect(ref.box).toEqual({ ...baseAnchors(BED, CTX).glow!, size: undefined, rotationDegrees: 0 } as never);
    expect(ref.opacity).toBe(0.32);
    expect(ref.tileHex).toBe("#F2AE4E");
    // The mode off measures against the mode on.
    expect(glowReference({ ...SENSOR, iconGlow: { mode: "off" } }, SENSOR_CTX)!.opacity).toBe(0.14);
    expect(glowReference({ ...SENSOR, color: "#3366FF" }, SENSOR_CTX)!.tileHex).toBe("#3366FF");
  });
});

describe("owning the glow with the glyph", () => {
  it("drags the glow along with the icon by the change of its centre, owning the icon", () => {
    const before = designForEdit(BED, CTX);
    const icon = frameOf(before, BASE_LAYER_IDS.icon);
    const glow = frameOf(before, BASE_GLOW_ID);
    const after = setLayerFrame(before, BASE_LAYER_IDS.icon, dragLayerFrame(icon, "move", 0.05, 0.02));
    expect(after.owned).toEqual(["icon"]);
    const moved = frameOf(after, BASE_GLOW_ID);
    expect(moved.x).toBeCloseTo(glow.x + 0.05, 4);
    expect(moved.y).toBeCloseTo(glow.y + 0.02, 4);
    expect(moved.width).toBe(glow.width);
    // Both drawn from the document, the glow under the icon.
    expect(drawnDesignDoc(after.doc, after.owned).elements.map((e) => e.payload.id)).toEqual([BASE_GLOW_ID, BASE_LAYER_IDS.icon]);
    expect(layerStatus(after, BASE_GLOW_ID)).toBe("changed");
  });

  it("drags the glow alone, owning the slot and leaving the icon where it is, past the tile's edge", () => {
    const before = designForEdit(BED, CTX);
    const glow = frameOf(before, BASE_GLOW_ID);
    const after = setLayerFrame(before, BASE_GLOW_ID, dragLayerFrame(glow, "move", 0, 0.05, true));
    expect(after.owned).toEqual(["icon"]);
    expect(frameOf(after, BASE_GLOW_ID).y).toBeCloseTo(glow.y + 0.05, 4);
    expect(frameOf(after, BASE_LAYER_IDS.icon)).toEqual(frameOf(before, BASE_LAYER_IDS.icon));
    // Held to the tile, the same drag would snap it to the top.
    expect(dragLayerFrame(glow, "move", 0, 0.05).y).toBe(0);
  });

  it("owns the photo, not the icon, for a glow on a photo tile", () => {
    const before = designForEdit(PERSON, PERSON_CTX);
    expect(glyphSlotRole(before.doc)).toBe("photo");
    expect(glyphSlotRole(designForEdit(BED, CTX).doc)).toBe("icon");
    expect(glowIn(before.doc.elements)).toBeDefined();
    const glow = frameOf(before, BASE_GLOW_ID);
    expect(setLayerFrame(before, BASE_GLOW_ID, { ...glow, x: glow.x + 0.05 }).owned).toEqual(["photo"]);
    expect(removeLayer(before, BASE_GLOW_ID).owned).toEqual(["photo"]);
    expect(moveLayer(before, BASE_GLOW_ID, 1).owned).toEqual(["photo"]);
    expect(layerStatus({ ...before, owned: ["photo"] }, BASE_GLOW_ID)).toBe("changed");
  });

  it("deletes the glow with the icon, and the glow alone without it", () => {
    const before = designForEdit(BED, CTX);
    const noIcon = removeLayer(before, BASE_LAYER_IDS.icon);
    expect(ids(noIcon)).not.toContain(BASE_GLOW_ID);
    expect(noIcon.owned).toEqual(["icon"]);
    const noGlow = removeLayer(before, BASE_GLOW_ID);
    expect(ids(noGlow)).toContain(BASE_LAYER_IDS.icon);
    expect(ids(noGlow)).not.toContain(BASE_GLOW_ID);
    expect(noGlow.owned).toEqual(["icon"]);
  });

  it("moving the glow up the order owns the slot", () => {
    const before = designForEdit(BED, CTX);
    const up = moveLayer(before, BASE_GLOW_ID, 1);
    expect(ids(up).slice(0, 2)).toEqual([BASE_LAYER_IDS.icon, BASE_GLOW_ID]);
    expect(up.owned).toEqual(["icon"]);
  });

  it("writes the glow's anchor with the icon's, and Reset gives the icon, the glow and the anchor back", () => {
    const before = designForEdit(BED, CTX);
    const glow = frameOf(before, BASE_GLOW_ID);
    const tile = withDesign(BED, setLayerFrame(before, BASE_GLOW_ID, { ...glow, y: glow.y + 0.05 }), CTX);
    const raw = tile.design as { anchors: Record<string, unknown>; owned: string[] };
    expect(raw.owned).toEqual(["base.icon"]);
    expect(Object.keys(raw.anchors)).toEqual(["base.glow", "base.icon"]);
    expect(readTileDesign(tile)!.anchors.glow).toEqual(baseAnchors(BED, CTX).glow);
    // Moved out of rank too: Reset puts it back at the bottom.
    const moved = withDesign(BED, moveLayer(readTileDesign(tile)!, BASE_GLOW_ID, 1), CTX);
    expect(resetBaseLayer(moved, "icon", CTX).design).toBeUndefined();
    expect(resetBaseLayer(tile, "icon", CTX).design).toBeUndefined();
  });

  it("takes the glow's simple setting away into the owned glyph", () => {
    const owned = readTileDesign(withDesign(BED, { ...designForEdit(BED, CTX), owned: ["icon"] }, CTX))!;
    expect(settingOwnerRole(owned, "iconGlow")).toBe("icon");
    expect(settingOwnerRole({ ...owned, owned: ["photo"] }, "iconGlow")).toBe("photo");
    expect(settingOwnerRole({ ...owned, owned: ["name"] }, "iconGlow")).toBeUndefined();
  });

  it("never puts the glow into a design that already holds the layer cap", () => {
    const off = { ...BED, iconGlow: { mode: "off" } };
    let design = designForEdit(off, CTX);
    expect(glowIn(design.doc.elements)).toBeUndefined();
    const filler = Array.from({ length: TILE_DESIGN_MAX_LAYERS - design.doc.elements.length }, () => newElement("text"));
    design = { ...design, doc: { ...design.doc, elements: [...design.doc.elements, ...filler] } };
    expect(design.doc.elements).toHaveLength(TILE_DESIGN_MAX_LAYERS);
    expect(glowIn(rebuildBaseLayers(BED, design, CTX).doc.elements)).toBeUndefined();
    // With room it comes back at the bottom.
    const room = { ...design, doc: { ...design.doc, elements: design.doc.elements.slice(0, -1) } };
    expect(ids(rebuildBaseLayers(BED, room, CTX))[0]).toBe(BASE_GLOW_ID);
  });
});

describe("the glow's anchor places it on the native glow", () => {
  it("lands an unmoved owned glow exactly on the native glow on the watch and the iPhone", () => {
    const design = readTileDesign(withDesign(BED, { ...designForEdit(BED, CTX), owned: ["icon"] }, CTX))!;
    const drawn = drawnDesignDoc(design.doc, design.owned);
    const box = tileDesignBox(6, 4);
    for (const device of ["watch", "phone"] as const) {
      const on = tileNativeFramesOn(BED, CTX, device)!;
      const native = on.native.glow!;
      const placed = glowIn(placeDesignDoc(drawn, design.anchors, on.native, on.drawnSize, box).elements)!.payload.frame;
      const f = Math.min(on.drawnSize.width / box.width, on.drawnSize.height / box.height);
      const ox = (on.drawnSize.width - box.width * f) / 2;
      const oy = (on.drawnSize.height - box.height * f) / 2;
      const w = placed.width * box.width * f;
      const cx = ox + (placed.x + placed.width / 2) * box.width * f;
      const cy = oy + (placed.y + placed.height / 2) * box.height * f;
      expect(w, device).toBeCloseTo(native.size * 1.5, 1);
      expect(cx, device).toBeCloseTo(native.rect.x + native.rect.width / 2, 1);
      expect(cy, device).toBeCloseTo(native.rect.y + native.rect.height / 2, 1);
    }
    expect(tileNativeFramesOn(BED, CTX, "phone")!.native.glow!.size * 1.5).toBeCloseTo(114.77, 1);
  });
});
