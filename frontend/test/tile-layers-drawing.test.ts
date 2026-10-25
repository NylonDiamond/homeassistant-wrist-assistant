// How a design tile draws (app repo docs/tile_layers_contract_2026-10.md,
// section 2.6): the native tile less the parts its owned roles hide, and
// only its owned base layers and added layers drawn from the document; the
// template compiled from those layers alone; and a layer dragged on the
// stage, which owns it and keeps it inside the tile, the State layer taking
// its pill along.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import { type Element, newElement } from "../src/model.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import {
  type BaseLayerContext,
  type TileDesign,
  BASE_LAYER_IDS,
  BASE_STATE_PILL_ID,
  LAYER_MIN_FRACTION,
  baseLayerName,
  baseRoleOf,
  designDrawsElement,
  designForEdit,
  designHiddenParts,
  dragLayerFrame,
  drawnDesignDoc,
  encodeTileDesign,
  layerDraggable,
  layerStatus,
  readTileDesign,
  rebuildBaseLayers,
  removeLayer,
  resetBaseLayer,
  setLayerFrame,
  withDesign,
  withLayerFrame,
} from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });

const entity = (id: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: id, state, attributes, last_changed: "", last_updated: "" });

const STATES = { "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 255 }) };
const CTX: BaseLayerContext = { states: STATES, measurer };
const LIGHT: WatchPageTile = { id: "7A1E0000-0000-4000-8000-0000000000B1", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 };
const PILL_LIGHT: WatchPageTile = { ...LIGHT, stateValueLabelStyle: "Pill" };

const ids = (els: readonly Element[]) => els.map((el) => el.payload.id);
const frameOf = (design: TileDesign, id: string) => design.doc.elements.find((el) => el.payload.id === id)!.payload.frame;

describe("which parts a design draws", () => {
  it("draws nothing of its own and hides nothing while it owns nothing and adds nothing", () => {
    const design = designForEdit(LIGHT, CTX);
    expect(design.owned).toEqual([]);
    expect(designHiddenParts(design)).toEqual({ glyph: false, name: false, state: false });
    expect(drawnDesignDoc(design.doc, design.owned).elements).toEqual([]);
  });

  it("draws exactly the owned base layers and the added ones, and hides the owned parts natively", () => {
    const moved = readTileDesign(withLayerFrame(LIGHT, BASE_LAYER_IDS.icon, { x: 0.5, y: 0.2, width: 0.3, height: 0.5, rotationDegrees: 0 }, CTX))!;
    expect(moved.owned).toEqual(["icon"]);
    expect(designHiddenParts(moved)).toEqual({ glyph: true, name: false, state: false });
    expect(ids(drawnDesignDoc(moved.doc, moved.owned).elements)).toEqual([BASE_LAYER_IDS.icon]);
    // The untouched State and Name layers stay in the document for the
    // layer list, but are never drawn from it.
    expect(ids(moved.doc.elements)).toEqual([BASE_LAYER_IDS.icon, BASE_LAYER_IDS.state, BASE_LAYER_IDS.name]);
    const added = newElement("text");
    expect(designDrawsElement([], added)).toBe(true);
    expect(designDrawsElement([], moved.doc.elements[1]!)).toBe(false);
  });

  it("treats the icon and the photo as one glyph slot", () => {
    expect(designHiddenParts({ owned: ["photo"] }).glyph).toBe(true);
    const icon = designForEdit(LIGHT, CTX).doc.elements[0]!;
    expect(designDrawsElement(["photo"], icon)).toBe(true);
  });

  it("hides a part whose owned layer was deleted, and draws nothing for it", () => {
    const gone = removeLayer(designForEdit(LIGHT, CTX), BASE_LAYER_IDS.name);
    expect(designHiddenParts(gone).name).toBe(true);
    expect(drawnDesignDoc(gone.doc, gone.owned).elements).toEqual([]);
  });
});

describe("the template", () => {
  it("is compiled from the drawn layers only: a base layer that follows reads nothing", () => {
    const design = designForEdit(LIGHT, CTX);
    // A base Name layer that, unowned, would need a template.
    const doc = structuredClone(design.doc);
    const name = doc.elements.find((el) => el.payload.id === BASE_LAYER_IDS.name)!;
    if (name.kind !== "text") throw new Error("no name");
    name.payload.value = { kind: { kind: "entityAttribute", entityId: "light.office", displayName: "Office", domain: "light", attribute: "brightness" } };
    expect(encodeTileDesign({ ...design, doc, owned: [] }).template).toBeUndefined();
    expect(encodeTileDesign({ ...design, doc, owned: ["name"] }).template).toContain("state_attr('light.office', 'brightness')");
  });
});

describe("dragLayerFrame", () => {
  const frame = { x: 0.2, y: 0.3, width: 0.4, height: 0.2, rotationDegrees: 0 };

  it("moves the frame and stops it at the tile's edges", () => {
    expect(dragLayerFrame(frame, "move", 0.1, -0.1)).toEqual({ ...frame, x: 0.3, y: 0.2 });
    expect(dragLayerFrame(frame, "move", 5, 5)).toEqual({ ...frame, x: 0.6, y: 0.8 });
    expect(dragLayerFrame(frame, "move", -5, -5)).toEqual({ ...frame, x: 0, y: 0 });
  });

  it("keeps a frame larger than the tile at its top left", () => {
    expect(dragLayerFrame({ ...frame, width: 1.2 }, "move", 0.3, 0)).toMatchObject({ x: 0 });
  });

  it("pulls a corner, the opposite one staying put, within the tile and above the smallest size", () => {
    expect(dragLayerFrame(frame, "se", 0.1, 0.1)).toEqual({ ...frame, width: 0.5, height: 0.3 });
    expect(dragLayerFrame(frame, "nw", -0.1, -0.1)).toEqual({ ...frame, x: 0.1, y: 0.2, width: 0.5, height: 0.3 });
    expect(dragLayerFrame(frame, "ne", 5, -5)).toEqual({ ...frame, y: 0, width: 0.8, height: 0.5 });
    const tiny = dragLayerFrame(frame, "sw", 5, -5);
    expect(tiny.width).toBeCloseTo(LAYER_MIN_FRACTION, 4);
    expect(tiny.height).toBeCloseTo(LAYER_MIN_FRACTION, 4);
    expect(tiny.x + tiny.width).toBeCloseTo(0.6, 4);
    expect(tiny.y).toBeCloseTo(0.3, 4);
  });
});

describe("a layer dragged on the stage", () => {
  it("owns a base layer it moves and leaves every other one following", () => {
    const tile = withLayerFrame(LIGHT, BASE_LAYER_IDS.name, { x: 0.1, y: 0.6, width: 0.8, height: 0.2, rotationDegrees: 0 }, CTX);
    const design = readTileDesign(tile)!;
    expect(design.owned).toEqual(["name"]);
    expect(layerStatus(design, BASE_LAYER_IDS.name)).toBe("changed");
    expect(layerStatus(design, BASE_LAYER_IDS.icon)).toBe("follows");
    expect(frameOf(design, BASE_LAYER_IDS.name)).toEqual({ x: 0.1, y: 0.6, width: 0.8, height: 0.2, rotationDegrees: 0 });
  });

  it("gives the design back as it is when the frame does not change", () => {
    const design = designForEdit(LIGHT, CTX);
    expect(setLayerFrame(design, BASE_LAYER_IDS.icon, frameOf(design, BASE_LAYER_IDS.icon))).toBe(design);
    expect(withLayerFrame(LIGHT, BASE_LAYER_IDS.icon, frameOf(design, BASE_LAYER_IDS.icon), CTX)).toBe(LIGHT);
  });

  it("takes the State layer's pill along, the two owned together", () => {
    const before = designForEdit(PILL_LIGHT, CTX);
    const state = frameOf(before, BASE_LAYER_IDS.state);
    expect(frameOf(before, BASE_STATE_PILL_ID)).toEqual(state);
    const moved = setLayerFrame(before, BASE_LAYER_IDS.state, dragLayerFrame(state, "move", 0.1, 0.05));
    expect(moved.owned).toEqual(["state"]);
    expect(frameOf(moved, BASE_STATE_PILL_ID)).toEqual(frameOf(moved, BASE_LAYER_IDS.state));
    expect(ids(drawnDesignDoc(moved.doc, moved.owned).elements)).toEqual([BASE_STATE_PILL_ID, BASE_LAYER_IDS.state]);
    // Dragging the pill alone owns the state too, and leaves the text be.
    const pill = setLayerFrame(before, BASE_STATE_PILL_ID, dragLayerFrame(state, "move", 0, 0.1));
    expect(pill.owned).toEqual(["state"]);
    expect(frameOf(pill, BASE_LAYER_IDS.state)).toEqual(state);
  });

  it("does not drag a tap zone", () => {
    const design = designForEdit(LIGHT, CTX);
    expect(layerDraggable(design, BASE_LAYER_IDS.icon)).toBe(true);
    const zone = newElement("tap");
    expect(layerDraggable({ ...design, doc: { ...design.doc, elements: [...design.doc.elements, zone] } }, zone.payload.id)).toBe(false);
  });
});

describe("the state's pill", () => {
  it("is part of the state role, named on its own", () => {
    expect(baseRoleOf(BASE_STATE_PILL_ID)).toBe("state");
    expect(baseLayerName(BASE_STATE_PILL_ID)).toBe("State pill");
    expect(baseLayerName(BASE_LAYER_IDS.state)).toBe("State");
  });

  it("comes and goes with the Pill value style while the state follows the simple settings", () => {
    const owned = readTileDesign(withLayerFrame(LIGHT, BASE_LAYER_IDS.name, { x: 0.1, y: 0.6, width: 0.8, height: 0.2, rotationDegrees: 0 }, CTX))!;
    expect(ids(owned.doc.elements)).not.toContain(BASE_STATE_PILL_ID);
    const pilled = rebuildBaseLayers(PILL_LIGHT, owned, CTX);
    expect(ids(pilled.doc.elements)).toEqual([BASE_LAYER_IDS.icon, BASE_STATE_PILL_ID, BASE_LAYER_IDS.state, BASE_LAYER_IDS.name]);
    expect(ids(rebuildBaseLayers(LIGHT, pilled, CTX).doc.elements)).not.toContain(BASE_STATE_PILL_ID);
  });

  it("goes with the State layer when it is deleted, and comes back with Reset", () => {
    const before = designForEdit(PILL_LIGHT, CTX);
    const gone = removeLayer(before, BASE_LAYER_IDS.state);
    expect(ids(gone.doc.elements)).toEqual([BASE_LAYER_IDS.icon, BASE_LAYER_IDS.name]);
    const tile = withDesign(PILL_LIGHT, gone, CTX);
    const reset = resetBaseLayer(tile, "state", CTX);
    // Back to the plain tile: nothing owned and nothing added.
    expect(readTileDesign(reset)).toBeUndefined();
  });
});

describe("designForEdit", () => {
  it("builds a stored design's following base layers again, so a layer owned next starts as the native part", () => {
    const tile = withLayerFrame(LIGHT, BASE_LAYER_IDS.name, { x: 0.1, y: 0.6, width: 0.8, height: 0.2, rotationDegrees: 0 }, CTX);
    const stored = readTileDesign(tile)!;
    // The state's words changed width since: 100% to 5%.
    const dim = { ...CTX, states: { "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 13 }) } };
    const fresh = designForEdit(tile, dim);
    expect(fresh.owned).toEqual(["name"]);
    expect(frameOf(fresh, BASE_LAYER_IDS.name)).toEqual(frameOf(stored, BASE_LAYER_IDS.name));
    expect(fresh.doc.elements.find((el) => el.payload.id === BASE_LAYER_IDS.state)).toEqual(
      designForEdit({ ...LIGHT }, dim).doc.elements.find((el) => el.payload.id === BASE_LAYER_IDS.state),
    );
    // With no state for the entity the stored layers are kept.
    expect(designForEdit(tile, { measurer })).toEqual(stored);
  });
});
