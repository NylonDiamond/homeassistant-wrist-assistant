// Round two of tile layers (app repo docs/tile_layers_contract_2026-10.md,
// section 13): each owned base layer placed by its anchor on the native part
// of the device's own layout, and the State layer's four parts.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import { type CustomComplicationConfig, type Element, type IconElement, type TextElement, encodeConfig, newConfig, newElement } from "../src/model.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import { resolveOneLookLayout } from "../src/watch-pages/one-look/layout.js";
import { oneLookStateFor } from "../src/watch-pages/one-look/state.js";
import { type TileNativeFrames, anchorOf, placeDesignDoc, tileNativeFrames } from "../src/watch-pages/tile-anchors.js";
import { baseAnchors, baseLayers, oneLookStateLineParts, tileNativeFramesOn } from "../src/watch-pages/tile-base-layers.js";
import {
  type BaseLayerContext,
  type TileAnchor,
  type TileDesign,
  BASE_LAYER_IDS,
  BASE_STATE_PILL_ID,
  designForEdit,
  encodeAnchors,
  parseAnchors,
  readTileDesign,
  resetBaseLayer,
  setLayerFrame,
  syncTileDesigns,
  tileDesignBox,
  withDesign,
  writeDesignDoc,
} from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });
const phoneMeasurer = oneLookMeasurer("phone", { estimate: true });

function entity(entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" };
}

const BED = { "light.bed": entity("light.bed", "on", { friendly_name: "Bed Light", brightness: 128 }) };
const CTX: BaseLayerContext = { states: BED, measurer, phoneMeasurer };
const TILE_ID = "5A1C2B3D-0001-4000-8000-000000000001";
const PAGE_ID = "5A1C2B3D-0000-4000-8000-000000000000";
const BED_TILE: WatchPageTile = { id: TILE_ID, entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" };
const PILL_TILE: WatchPageTile = { ...BED_TILE, stateValueLabelStyle: "Pill" };
const BOX = tileDesignBox(6, 4);

const close = (a: number, b: number, places = 2) => expect(a).toBeCloseTo(b, places);

function elementOf(doc: CustomComplicationConfig, id: string): Element {
  const el = doc.elements.find((e) => e.payload.id === id);
  if (el === undefined) throw new Error(`no ${id}`);
  return el;
}

/** Where a frame lands in a drawn tile `slot`, the box fitted in. */
function drawnRect(frame: { x: number; y: number; width: number; height: number }, slot: { width: number; height: number }) {
  const f = Math.min(slot.width / BOX.width, slot.height / BOX.height);
  const ox = (slot.width - BOX.width * f) / 2;
  const oy = (slot.height - BOX.height * f) / 2;
  return { x: ox + frame.x * BOX.width * f, y: oy + frame.y * BOX.height * f, width: frame.width * BOX.width * f, height: frame.height * BOX.height * f, f };
}

describe("the native frames", () => {
  it("reads the glyph, the name's room and the state box off a centred layout", () => {
    const on = tileNativeFramesOn(PILL_TILE, CTX, "watch")!;
    expect(on.drawnSize).toEqual({ width: 100.5, height: 66 });
    const n = on.native;
    // The worked example's reference watch (section 13.3).
    close(n.icon!.rect.x, 32.99);
    close(n.icon!.rect.y, 12.74);
    close(n.icon!.rect.width, 34.52);
    close(n.icon!.size, 32.88);
    close(n.photo!.size, 47.79);
    expect(n.name).toMatchObject({ rect: { x: 3, width: 94.5 }, size: 10 });
    close(n.state!.rect.x, 5.94);
    close(n.state!.rect.width, 24.81);
    expect(n.state).toMatchObject({ size: 14, textSize: 12.6, unitSize: 9, tailSize: 11 });
  });

  it("reads the name's lines then the state line off a stacked layout", () => {
    const layout = resolveOneLookLayout({
      device: "watch", size: { width: 100.5, height: 66 }, colSpan: 6, rowSpan: 4, name: "Office",
      state: { kind: "number", figure: "82", unit: "%" }, hasIcon: true, accessory: "none", isChart: false,
      centred: false, topBar: false, glyphAspect: 1, glyphExtent: 1.25, glyphIsPhoto: false,
      style: { iconOffset: 0, stateScale: 1, accessoryScale: 1, nameDesign: "standard", nameShadow: false, stateShadow: false, glyphShadow: false, statePill: false },
    }, measurer);
    expect(layout.mode).not.toBe("centred");
    const n = tileNativeFrames(layout, "watch");
    const lines = layout.name.lines.length;
    expect(n.name!.rect).toEqual({ x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: lines * layout.nameLineHeight });
    expect(n.state!.rect).toEqual({ x: layout.textOrigin.x, y: layout.textOrigin.y + lines * layout.nameLineHeight, width: layout.textWidth, height: layout.stateLineHeight });
    expect(n.state!.size).toBe(14);
    // A stacked glyph takes 1.25 as its extent.
    close(n.icon!.size, (layout.glyphSize * 0.86) / 1.25, 6);
  });

  it("leaves a part out when the layout has none", () => {
    const n = tileNativeFramesOn({ ...BED_TILE, showLabel: false }, CTX, "watch")!.native;
    expect(n.name).toBeUndefined();
    expect(n.icon).toBeDefined();
  });
});

describe("anchors", () => {
  it("equal the unmoved base layers' frames and sizes", () => {
    const anchors = baseAnchors(PILL_TILE, CTX);
    expect(Object.keys(anchors).sort()).toEqual(["icon", "name", "state"]);
    const layers = baseLayers(PILL_TILE, CTX);
    const frame = (id: string) => layers.find((e) => e.payload.id === id)!.payload.frame;
    for (const [role, id] of [["icon", BASE_LAYER_IDS.icon], ["name", BASE_LAYER_IDS.name], ["state", BASE_STATE_PILL_ID]] as const) {
      const a = anchors[role]!;
      const f = frame(id);
      expect({ x: a.x, y: a.y, width: a.width, height: a.height }, role).toEqual({ x: f.x, y: f.y, width: f.width, height: f.height });
    }
    const icon = layers.find((e) => e.payload.id === BASE_LAYER_IDS.icon)!.payload as IconElement;
    expect(anchors.icon!.size).toBe(icon.size);
    const state = layers.find((e) => e.payload.id === BASE_LAYER_IDS.state)!.payload as TextElement;
    expect(anchors.state!.textSize).toBe(state.fontSize);
    expect(anchors.state!.unitSize).toBe(state.parts![1]!.fontSize);
    expect(anchors.state!.tailSize).toBe(state.parts![2]!.fontSize);
    // Section 13.3's numbers.
    expect(anchors.icon).toEqual({ x: 0.3283, y: 0.193, width: 0.3435, height: 0.523, size: 32.88 });
    expect(anchors.state).toEqual({ x: 0.0591, y: 0.1439, width: 0.2469, height: 0.2424, size: 14, textSize: 12.6, unitSize: 9, tailSize: 11 });
  });

  it("read usable entries only and write the owned roles in order", () => {
    const good = { x: 0.1, y: 0.2, width: 0.3, height: 0.4, size: 10, extra: 1 };
    const read = parseAnchors({
      "base.icon": good,
      "base.name": { ...good, size: 0 },
      "base.state": { ...good, textSize: 12 },
      "base.photo": [1, 2],
      "other": good,
    });
    expect(read).toEqual({ icon: { x: 0.1, y: 0.2, width: 0.3, height: 0.4, size: 10 } });
    expect(parseAnchors([good])).toEqual({});
    const state: TileAnchor = { x: 0, y: 0, width: 1, height: 1, size: 14, textSize: 12, unitSize: 9, tailSize: 11 };
    const out = encodeAnchors({ icon: read.icon!, state, name: read.icon! }, ["state", "icon"])!;
    expect(Object.keys(out)).toEqual(["base.icon", "base.state"]);
    expect(Object.keys(out["base.state"] as object)).toEqual(["x", "y", "width", "height", "size", "textSize", "unitSize", "tailSize"]);
    expect(encodeAnchors({ name: read.icon! }, ["icon"])).toBeUndefined();
  });
});

describe("the anchor lifecycle", () => {
  const page = (tile: WatchPageTile) => ({ pages: [{ id: PAGE_ID, items: [tile] }] });
  const tileOf = (doc: { pages: unknown[] }) => (doc.pages[0] as { items: WatchPageTile[] }).items[0]!;

  /** The bed light with its icon dragged down a little on the stage. */
  function movedIcon(tile = BED_TILE): WatchPageTile {
    const before = designForEdit(tile, CTX);
    const icon = elementOf(before.doc, BASE_LAYER_IDS.icon).payload.frame;
    return withDesign(tile, setLayerFrame(before, BASE_LAYER_IDS.icon, { ...icon, y: icon.y + 0.05 }), CTX);
  }

  it("a fresh design holds every role's anchor, and the write that owns a role keeps only that one", () => {
    const fresh = designForEdit(BED_TILE, CTX);
    expect(Object.keys(fresh.anchors).sort()).toEqual(["icon", "name", "state"]);
    const tile = movedIcon();
    const raw = tile.design as { anchors: Record<string, unknown> };
    expect(Object.keys(raw)).toEqual(["v", "owned", "anchors", "zones", "doc"]);
    expect(raw.anchors).toEqual({ "base.icon": encodeAnchors(fresh.anchors, ["icon"])!["base.icon"] });
    expect(readTileDesign(tile)!.anchors).toEqual({ icon: fresh.anchors.icon });
  });

  it("an owned role's anchor stays frozen through a simple edit and a resize", () => {
    const tile = movedIcon();
    const anchor = readTileDesign(tile)!.anchors.icon;
    // A simple edit that moves the native glyph (a shorter tile).
    for (const edit of [{ customLabel: "Bedroom" }, { colSpan: 8 }, { rowSpan: 5 }]) {
      const after = syncTileDesigns(page(tile), page({ ...tile, ...edit }), CTX);
      expect(readTileDesign(tileOf(after as { pages: unknown[] }))!.anchors.icon, JSON.stringify(edit)).toEqual(anchor);
    }
    // And through another layer edit of the same tile.
    const before = designForEdit(tile, CTX);
    expect(before.anchors.icon).toEqual(anchor);
    const next = structuredClone(before.doc);
    (elementOf(next, BASE_LAYER_IDS.name).payload as TextElement).fontSize = 13;
    const written = readTileDesign(writeDesignDoc(tile, before, next, CTX))!;
    expect(written.owned).toEqual(["icon", "name"]);
    expect(written.anchors.icon).toEqual(anchor);
    expect(written.anchors.name).toEqual(before.anchors.name);
  });

  it("Reset removes the role's anchor with its ownership", () => {
    const tile = movedIcon();
    expect(resetBaseLayer(tile, "icon", CTX).design).toBeUndefined();
    const before = designForEdit(tile, CTX);
    const next = structuredClone(before.doc);
    (elementOf(next, BASE_LAYER_IDS.name).payload as TextElement).fontSize = 13;
    const both = writeDesignDoc(tile, before, next, CTX);
    const reset = readTileDesign(resetBaseLayer(both, "icon", CTX))!;
    expect(reset.owned).toEqual(["name"]);
    expect(Object.keys(reset.anchors)).toEqual(["name"]);
  });

  it("a design saved before anchors gets them on its next edit", () => {
    const tile = movedIcon();
    const old = structuredClone(tile);
    delete (old.design as { anchors?: unknown }).anchors;
    expect(readTileDesign(old)!.anchors).toEqual({});
    const before = designForEdit(old, CTX);
    expect(before.anchors.icon).toEqual(baseAnchors(BED_TILE, CTX).icon);
    const next = structuredClone(before.doc);
    (elementOf(next, BASE_LAYER_IDS.name).payload as TextElement).fontSize = 13;
    expect(Object.keys(readTileDesign(writeDesignDoc(old, before, next, CTX))!.anchors)).toEqual(["icon", "name"]);
  });
});

describe("placeDesignDoc", () => {
  /** The bed light's design with these roles owned, unmoved. */
  function owned(tile: WatchPageTile, roles: TileDesign["owned"]): TileDesign {
    const d = designForEdit(tile, CTX);
    return { ...d, owned: roles };
  }

  const phone = tileNativeFramesOn(PILL_TILE, CTX, "phone")!;

  it("lands an unmoved owned icon on the iPhone's native glyph at its point size (section 13.3)", () => {
    const d = owned(BED_TILE, ["icon"]);
    const on = tileNativeFramesOn(BED_TILE, CTX, "phone")!;
    expect(on.drawnSize.width).toBe(179);
    close(on.drawnSize.height, 115.33);
    const placed = placeDesignDoc(d.doc, d.anchors, on.native, on.drawnSize, BOX);
    const icon = elementOf(placed, BASE_LAYER_IDS.icon).payload as IconElement;
    expect(icon.frame.x).toBeCloseTo(0.3426, 4);
    expect(icon.frame.y).toBeCloseTo(0.2257, 4);
    expect(icon.frame.width).toBeCloseTo(0.3147, 4);
    expect(icon.frame.height).toBeCloseTo(0.4792, 4);
    close(icon.size, 30.12);
    const at = drawnRect(icon.frame, on.drawnSize);
    close(at.x, 61.86);
    close(at.y, 26.03);
    close(at.width, 55.27);
    close(icon.size * at.f, 52.64);
    // A move of 0.05 of the box is 9.6% of the glyph on both devices.
    const moved = structuredClone(d.doc);
    elementOf(moved, BASE_LAYER_IDS.icon).payload.frame.y += 0.05;
    for (const device of ["watch", "phone"] as const) {
      const native = tileNativeFramesOn(BED_TILE, CTX, device)!;
      const frame = elementOf(placeDesignDoc(moved, d.anchors, native.native, native.drawnSize, BOX), BASE_LAYER_IDS.icon).payload.frame;
      const r = drawnRect(frame, native.drawnSize);
      close((r.y - native.native.icon!.rect.y) / native.native.icon!.rect.height, 0.0956, 3);
    }
  });

  it("lands the pill and the State layer on the native state box and the state at the native sizes", () => {
    const d = owned(PILL_TILE, ["state"]);
    const placed = placeDesignDoc(d.doc, d.anchors, phone.native, phone.drawnSize, BOX);
    const pill = elementOf(placed, BASE_STATE_PILL_ID).payload.frame;
    expect([pill.x, pill.y, pill.width, pill.height].map((v) => Math.round(v * 10000) / 10000)).toEqual([0.0626, 0.1474, 0.2319, 0.235]);
    const state = elementOf(placed, BASE_LAYER_IDS.state).payload as TextElement;
    expect(state.frame).toEqual(pill);
    close(state.fontSize, 12.018);
    close(state.parts![1]!.fontSize!, 7.932);
    const f = drawnRect(state.frame, phone.drawnSize).f;
    close(state.fontSize * f, 21);
    close(state.parts![1]!.fontSize! * f, 13.86);
    close(state.parts![2]!.fontSize! * f, 15);
    // The figure and the word follow the layer.
    expect(state.parts![0]!.fontSize).toBeUndefined();
    expect(state.parts![3]!.fontSize).toBeUndefined();
    // Only a role with an anchor moves.
    const stateOnly = placeDesignDoc(d.doc, { state: d.anchors.state! }, phone.native, phone.drawnSize, BOX);
    expect(elementOf(stateOnly, BASE_LAYER_IDS.icon)).toBe(elementOf(d.doc, BASE_LAYER_IDS.icon));
  });

  it("scales a setFontSize rule by what it sets and a setBorderWidth by the part", () => {
    const d = owned(PILL_TILE, ["state"]);
    const doc = structuredClone(d.doc);
    const state = elementOf(doc, BASE_LAYER_IDS.state).payload as TextElement;
    const unitId = state.parts![1]!.id;
    const test = { id: "T", value: { kind: { kind: "literal" as const, value: "a" } }, comparison: { kind: "isOn" as const } };
    state.rules = [
      { id: "R1", cases: [{ id: "C1", when: { join: "all", tests: [test] }, then: [{ kind: "setFontSize", number: 12.6 }] }] },
      { id: "R2", partId: unitId, cases: [], otherwise: [{ kind: "setFontSize", number: 9 }] },
    ];
    const pill = elementOf(doc, BASE_STATE_PILL_ID);
    pill.payload.rules = [{ id: "R3", cases: [], otherwise: [{ kind: "setBorderWidth", number: 2 }] }];
    const placed = placeDesignDoc(doc, d.anchors, phone.native, phone.drawnSize, BOX);
    const f = drawnRect(elementOf(placed, BASE_LAYER_IDS.state).payload.frame, phone.drawnSize).f;
    const rules = elementOf(placed, BASE_LAYER_IDS.state).payload.rules;
    close(rules[0]!.cases[0]!.then[0]!.number! * f, 21);
    close(rules[1]!.otherwise![0]!.number! * f, 13.86);
    close(elementOf(placed, BASE_STATE_PILL_ID).payload.rules[0]!.otherwise![0]!.number! * f, 2 * (21 / 14));
  });

  it("falls back to the box fit role by role", () => {
    const d = owned(PILL_TILE, ["icon", "state"]);
    const text = newElement("text");
    const doc = { ...d.doc, elements: [...d.doc.elements, text] };
    const same = (placed: CustomComplicationConfig, id: string) => elementOf(placed, id) === elementOf(doc, id);
    // An added layer is never placed.
    const all = placeDesignDoc(doc, d.anchors, phone.native, phone.drawnSize, BOX);
    expect(same(all, text.payload.id)).toBe(true);
    expect(same(all, BASE_LAYER_IDS.icon)).toBe(false);
    // No anchor for the icon: only the state is placed.
    const noIcon = placeDesignDoc(doc, { state: d.anchors.state! }, phone.native, phone.drawnSize, BOX);
    expect(same(noIcon, BASE_LAYER_IDS.icon)).toBe(true);
    expect(same(noIcon, BASE_LAYER_IDS.state)).toBe(false);
    // No native part for the state.
    const native: TileNativeFrames = { ...phone.native };
    delete native.state;
    const noState = placeDesignDoc(doc, d.anchors, native, phone.drawnSize, BOX);
    expect(same(noState, BASE_STATE_PILL_ID)).toBe(true);
    expect(same(noState, BASE_LAYER_IDS.icon)).toBe(false);
    // A size not above 0.
    const zero = placeDesignDoc(doc, { ...d.anchors, state: { ...d.anchors.state!, unitSize: 0 } }, phone.native, phone.drawnSize, BOX);
    expect(same(zero, BASE_LAYER_IDS.state)).toBe(true);
    // No room at all: the document as it is.
    expect(placeDesignDoc(doc, d.anchors, phone.native, { width: 0, height: 0 }, BOX)).toBe(doc);
  });

  it("an anchor made at the native part is that part", () => {
    const part = phone.native.icon!;
    const a = anchorOf(part, BOX);
    expect(a.size).toBe(Math.round(part.size * 100) / 100);
    expect(anchorOf(phone.native.state!, BOX).textSize).toBe(21);
  });
});

describe("the state line's parts", () => {
  it("splits a number into its figure, unit and tail, and a word into the word", () => {
    expect(oneLookStateLineParts({ kind: "number", figure: "50", unit: "%" }, 6)).toEqual({ figure: "50", unit: "%", tail: "", word: "" });
    expect(oneLookStateLineParts({ kind: "number", figure: "21.5", unit: "°C", unitSpaced: true, tail: "Heating" }, 12))
      .toEqual({ figure: "21.5", unit: " °C", tail: " Heating", word: "" });
    expect(oneLookStateLineParts({ kind: "number", figure: "21.5", unit: "°C", tail: "Heating" }, 6)).toMatchObject({ tail: "" });
    expect(oneLookStateLineParts({ kind: "number", figure: "21", tail: "Heating", keepTail: true }, 4)).toEqual({ figure: "21", unit: "", tail: " Heating", word: "" });
    expect(oneLookStateLineParts({ kind: "word", word: "Off" }, 6)).toEqual({ figure: "", unit: "", tail: "", word: "Off" });
    expect(oneLookStateLineParts({ kind: "none" }, 6)).toEqual({ figure: "", unit: "", tail: "", word: "" });
  });

  it("reads them off One Look's own line, as the whole line reads it", () => {
    const line = oneLookStateFor({ state: { kind: "word", word: "Off" } } as unknown as Parameters<typeof oneLookStateFor>[0], false);
    expect(oneLookStateLineParts(line, 6).word).toBe(line.kind === "word" ? line.word : "");
  });
});

describe("the state layer through a resolve", () => {
  it("is still written with every part, on the wire", () => {
    const cfg = newConfig("", 0, "rectangular");
    cfg.elements = baseLayers(BED_TILE, CTX);
    const wire = JSON.stringify(encodeConfig(cfg));
    for (const part of ["figure", "unit", "tail", "word"]) expect(wire).toContain(`"part":"${part}"`);
  });
});
