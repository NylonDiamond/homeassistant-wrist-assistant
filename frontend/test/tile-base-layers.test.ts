// A tile's base layers (app repo docs/tile_layers_contract_2026-10.md,
// section 2): each simple key of section 2.4 lands on its layer, the words
// the `tileState` and `tileName` kinds read, and the design document they
// make.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import type { Element, IconElement, ImageElement, TextElement } from "../src/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import { oneLookPreviewModel } from "../src/watch-pages/one-look/render.js";
import { oneLookCellSize, oneLookGridUnit } from "../src/watch-pages/one-look/metrics.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import {
  type BaseLayerContext,
  baseLayers,
  baseLayersDocument,
  designBoxFor,
  oneLookStateLineText,
  tileValuesFor,
} from "../src/watch-pages/tile-base-layers.js";
import { BASE_LAYER_IDS, BASE_LAYER_NAMES } from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });

function entity(entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" };
}

function ctxFor(...entities: HassEntityState[]): BaseLayerContext {
  return { states: Object.fromEntries(entities.map((e) => [e.entity_id, e])), measurer };
}

const OFFICE = entity("light.office", "on", { friendly_name: "Office", brightness: 209 });
const LIGHT: WatchPageTile = { id: "11111111-1111-4111-8111-111111111111", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 };
const CHEN = entity("person.chen", "home", { friendly_name: "Chen", entity_picture: "/api/image/chen" });
const PERSON: WatchPageTile = { id: "22222222-2222-4222-8222-222222222222", entityId: "person.chen", colSpan: 4, rowSpan: 4, gridCol: 0, gridRow: 4, usePersonPhoto: true };
const TEMP = entity("sensor.living_temp", "21.5", { friendly_name: "Living room", unit_of_measurement: "°C", device_class: "temperature" });
const SENSOR: WatchPageTile = { id: "33333333-3333-4333-8333-333333333333", entityId: "sensor.living_temp", colSpan: 12, rowSpan: 4, gridCol: 0, gridRow: 8 };

function byRole(layers: Element[], role: keyof typeof BASE_LAYER_IDS): Element | undefined {
  return layers.find((el) => el.payload.id === BASE_LAYER_IDS[role]);
}

function text(layers: Element[], role: "name" | "state"): TextElement {
  const el = byRole(layers, role);
  if (el?.kind !== "text") throw new Error(`no ${role} layer`);
  return el.payload;
}

function icon(layers: Element[]): IconElement {
  const el = byRole(layers, "icon");
  if (el?.kind !== "icon") throw new Error("no icon layer");
  return el.payload;
}

describe("the design box", () => {
  it("is the tile's drawn size on the 46 mm watch", () => {
    expect(designBoxFor(3, 3)).toEqual({ width: 48.75, height: 48.75 });
    expect(designBoxFor(4, 4)).toEqual({ width: 66, height: 66 });
    expect(designBoxFor(6, 4)).toEqual({ width: 100.5, height: 66 });
    expect(designBoxFor(12, 4)).toEqual({ width: 204, height: 66 });
  });

  it("is never under one cell", () => {
    expect(designBoxFor(0, -2)).toEqual(designBoxFor(1, 1));
  });
});

describe("oneLookStateLineText", () => {
  it("writes a number with its unit, spaced or glued, and its tail on wide tiles", () => {
    expect(oneLookStateLineText({ kind: "number", figure: "82", unit: "%" }, 6)).toBe("82%");
    expect(oneLookStateLineText({ kind: "number", figure: "4.2", unit: "kWh", unitSpaced: true }, 6)).toBe("4.2 kWh");
    expect(oneLookStateLineText({ kind: "number", figure: "21", unit: "°", tail: "Heating" }, 6)).toBe("21°");
    expect(oneLookStateLineText({ kind: "number", figure: "21", unit: "°", tail: "Heating" }, 8)).toBe("21° Heating");
    expect(oneLookStateLineText({ kind: "number", figure: "21", unit: "°", tail: "Heating", keepTail: true }, 4)).toBe("21° Heating");
  });

  it("writes a word in full and nothing for none", () => {
    expect(oneLookStateLineText({ kind: "word", word: "Unavailable", short: "Offline", amber: true }, 3)).toBe("Unavailable");
    expect(oneLookStateLineText({ kind: "none" }, 6)).toBe("");
  });
});

describe("tileValuesFor", () => {
  it("gives the state line and the name One Look draws", () => {
    expect(tileValuesFor(LIGHT, ctxFor(OFFICE))).toEqual({ state: "82%", name: "Office" });
    expect(tileValuesFor(SENSOR, ctxFor(TEMP))).toEqual({ state: "21.5°C", name: "Living room" });
    expect(tileValuesFor(PERSON, ctxFor(CHEN))).toEqual({ state: "Home", name: "Chen" });
  });

  it("names the tile by its label whether or not the label shows", () => {
    expect(tileValuesFor({ ...LIGHT, customLabel: "Desk" }, ctxFor(OFFICE)).name).toBe("Desk");
    expect(tileValuesFor({ ...LIGHT, showLabel: false }, ctxFor(OFFICE)).name).toBe("Office");
  });

  it("gives no state while the entity has not loaded", () => {
    expect(tileValuesFor(LIGHT, { states: {}, measurer }).state).toBe("");
  });

  it("follows decimalPlaces and the climate switches", () => {
    expect(tileValuesFor({ ...SENSOR, decimalPlaces: 0 }, ctxFor(TEMP)).state).toBe("22°C");
    const climate = entity("climate.hall", "heat", { friendly_name: "Hall", current_temperature: 21, temperature: 22 });
    const tile: WatchPageTile = { id: "C", entityId: "climate.hall", colSpan: 8, rowSpan: 4 };
    const both = tileValuesFor(tile, ctxFor(climate)).state;
    const noTarget = tileValuesFor({ ...tile, showTargetTempOnTile: false }, ctxFor(climate)).state;
    const noCurrent = tileValuesFor({ ...tile, showCurrentTempOnTile: false }, ctxFor(climate)).state;
    expect(both).toContain("21");
    expect(both).toContain("22");
    expect(noTarget).not.toBe(both);
    expect(noCurrent).not.toBe(both);
  });

  it("follows showActivityStatus and showBatteryOnTile", () => {
    expect(tileValuesFor({ ...PERSON, showActivityStatus: false }, ctxFor(CHEN)).state).toBe("");
    const vacuum = entity("vacuum.rosie", "docked", { friendly_name: "Rosie", battery_level: 82 });
    const tile: WatchPageTile = { id: "V", entityId: "vacuum.rosie", colSpan: 6, rowSpan: 4 };
    expect(tileValuesFor(tile, ctxFor(vacuum)).state).toContain("82%");
    expect(tileValuesFor({ ...tile, showBatteryOnTile: false }, ctxFor(vacuum)).state).not.toContain("82%");
  });
});

describe("baseLayers", () => {
  it("builds the glyph, the state and the name, bottom to top, with fixed ids and names", () => {
    const layers = baseLayers(LIGHT, ctxFor(OFFICE));
    expect(layers.map((el) => el.payload.id)).toEqual([BASE_LAYER_IDS.icon, BASE_LAYER_IDS.state, BASE_LAYER_IDS.name]);
    expect(layers.map((el) => el.payload.name)).toEqual([BASE_LAYER_NAMES.icon, BASE_LAYER_NAMES.state, BASE_LAYER_NAMES.name]);
    expect(text(layers, "name").value).toEqual({ kind: { kind: "tileName" } });
    expect(text(layers, "state").value).toEqual({ kind: { kind: "tileState" } });
  });

  it("is empty for a kind without layers", () => {
    expect(baseLayers({ id: "X", entityId: "camera.door", colSpan: 6, rowSpan: 4 }, {})).toEqual([]);
    expect(baseLayers({ id: "X", entityId: "page.ABC", colSpan: 6, rowSpan: 4 }, {})).toEqual([]);
  });

  it("puts every frame inside the design box, as fractions rounded to 4 places", () => {
    for (const [tile, e] of [[LIGHT, OFFICE], [PERSON, CHEN], [SENSOR, TEMP]] as const) {
      for (const el of baseLayers(tile, ctxFor(e))) {
        const f = el.payload.frame;
        expect(f.rotationDegrees).toBe(0);
        for (const v of [f.x, f.y, f.width, f.height]) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1.0001);
          expect(Math.round(v * 10000) / 10000).toBe(v);
        }
      }
    }
  });

  it("puts the name where One Look's layout puts it", () => {
    const states = ctxFor(OFFICE).states!;
    const box = designBoxFor(6, 4);
    const unit = oneLookGridUnit(208, "watch");
    const input = { page: { id: "", items: [LIGHT] }, pages: [], screen: { width: 208, height: 208 }, states: states as Record<string, HassEntityState> };
    const model = oneLookPreviewModel({ tile: { ...LIGHT, color: "#FFFFFF" }, input, stub: false, device: "watch", look: undefined, width: box.width, height: box.height, cell: oneLookCellSize(6, 4, unit), unit, box: "", s: 1, measurer })!;
    const name = text(baseLayers(LIGHT, ctxFor(OFFICE)), "name");
    expect(name.frame.x * box.width).toBeCloseTo(model.layout.textOrigin.x, 1);
    expect(name.frame.y * box.height).toBeCloseTo(model.layout.textOrigin.y, 1);
    expect(name.fontSize).toBeCloseTo(model.layout.name.size, 1);
  });

  describe("the name layer", () => {
    it("goes with showLabel false", () => {
      expect(byRole(baseLayers({ ...LIGHT, showLabel: false }, ctxFor(OFFICE)), "name")).toBeUndefined();
    });

    it("takes the label size, weight, design and colour", () => {
      const plain = text(baseLayers(LIGHT, ctxFor(OFFICE)), "name");
      const styled = text(baseLayers({ ...LIGHT, labelFontSizeOverride: 14, labelFontWeight: "bold", labelFontDesign: "serif", labelColorHex: "#ff9500" }, ctxFor(OFFICE)), "name");
      expect(styled.fontSize).not.toBe(plain.fontSize);
      expect(styled.fontWeight).toBe("bold");
      expect(plain.fontWeight).toBe("medium");
      expect(styled.fontDesign).toBe("serif");
      expect(plain.fontDesign).toBeUndefined();
      expect(styled.colorSlot.baseColorHex).toBe("#FF9500");
    });

    it("carries a shadow on a coloured fill unless Text Shadow is off", () => {
      expect(text(baseLayers(LIGHT, ctxFor(OFFICE)), "name").shadow).toBeDefined();
      expect(text(baseLayers({ ...LIGHT, labelShadow: false }, ctxFor(OFFICE)), "name").shadow).toBeUndefined();
    });

    it("is centred in the centred layout and leading in a strip", () => {
      expect(text(baseLayers(LIGHT, ctxFor(OFFICE)), "name").alignment).toBe("center");
      expect(text(baseLayers({ ...LIGHT, rowSpan: 2 }, ctxFor(OFFICE)), "name").alignment).toBe("leading");
    });
  });

  describe("the state layer", () => {
    it("is bold rounded for a number and semibold for a word", () => {
      const number = text(baseLayers(LIGHT, ctxFor(OFFICE)), "state");
      expect(number.fontWeight).toBe("bold");
      expect(number.fontDesign).toBe("rounded");
      const word = text(baseLayers(PERSON, ctxFor(CHEN)), "state");
      expect(word.fontWeight).toBe("semibold");
      expect(word.fontDesign).toBeUndefined();
      expect(word.lineLimit).toBe(1);
      expect(word.alignment).toBe("leading");
    });

    it("goes with the value labels Off, and stays with Plain and Pill", () => {
      expect(byRole(baseLayers({ ...SENSOR, stateValueLabelStyle: "Off" }, ctxFor(TEMP)), "state")).toBeUndefined();
      expect(byRole(baseLayers({ ...SENSOR, stateValueLabelStyle: "Plain" }, ctxFor(TEMP)), "state")).toBeDefined();
      expect(byRole(baseLayers({ ...SENSOR, stateValueLabelStyle: "Pill" }, ctxFor(TEMP)), "state")).toBeDefined();
    });

    it("takes State Size and State Shadow", () => {
      const plain = text(baseLayers(SENSOR, ctxFor(TEMP)), "state");
      const big = text(baseLayers({ ...SENSOR, badgeFontSizeOverride: 12 }, ctxFor(TEMP)), "state");
      expect(big.fontSize).toBeGreaterThan(plain.fontSize);
      expect(plain.shadow).toBeDefined();
      expect(text(baseLayers({ ...SENSOR, statusTextShadow: false }, ctxFor(TEMP)), "state").shadow).toBeUndefined();
    });

    it("reaches to the glyph beside it, or to the tile's right inset", () => {
      const layers = baseLayers(LIGHT, ctxFor(OFFICE));
      const state = text(layers, "state").frame;
      const glyph = icon(layers).frame;
      expect(state.x + state.width).toBeLessThanOrEqual(glyph.x + 0.0002);
      const person = baseLayers(PERSON, ctxFor(CHEN));
      const word = text(person, "state").frame;
      expect(word.x + word.width).toBeGreaterThan(0.8);
    });
  });

  describe("the glyph layer", () => {
    it("draws the tile's icon at the size One Look draws it", () => {
      const plain = icon(baseLayers(LIGHT, ctxFor(OFFICE)));
      expect(plain.symbol).toEqual({ kind: { kind: "literal", value: "lightbulb" } });
      const own = icon(baseLayers({ ...LIGHT, icon: "lamp.desk" }, ctxFor(OFFICE)));
      expect(own.symbol).toEqual({ kind: { kind: "literal", value: "lamp.desk" } });
      const small = icon(baseLayers({ ...LIGHT, iconSizeOverride: 14 }, ctxFor(OFFICE)));
      expect(small.size).toBeLessThan(plain.size);
    });

    it("carries the Icon Shadow", () => {
      expect(icon(baseLayers(LIGHT, ctxFor(OFFICE))).shadow).toBeUndefined();
      expect(icon(baseLayers({ ...LIGHT, iconShadow: true }, ctxFor(OFFICE))).shadow).toEqual({ colorHex: "#00000080", radius: 2, dx: 0, dy: 1 });
    });

    it("follows on and off by a rule for a kind lit when on", () => {
      const light = icon(baseLayers(LIGHT, ctxFor(OFFICE)));
      expect(light.rules).toHaveLength(1);
      const rule = light.rules[0]!;
      expect(rule.cases[0]!.when.tests[0]!.comparison).toEqual({ kind: "isOn" });
      expect(rule.cases[0]!.then[0]!.kind).toBe("setColor");
      // The same rule whichever state the light is in now.
      const off = icon(baseLayers(LIGHT, ctxFor({ ...OFFICE, state: "off" })));
      expect(off.colorSlot).toEqual(light.colorSlot);
      expect(off.rules).toEqual(light.rules);
      expect(icon(baseLayers(SENSOR, ctxFor(TEMP))).rules).toEqual([]);
    });

    it("turns the per state icons into one rule, unavailable by its own test", () => {
      const tile = { ...LIGHT, usesStateIcons: true, stateIcons: { on: "lightbulb.max", unavailable: "exclamationmark.triangle" } };
      const layer = icon(baseLayers(tile, ctxFor(OFFICE)));
      expect(layer.symbol).toEqual({ kind: { kind: "literal", value: "lightbulb" } });
      const rule = layer.rules.find((r) => r.cases.some((c) => c.then[0]?.kind === "setIcon"))!;
      expect(rule.cases.map((c) => c.when.tests[0]!.comparison)).toEqual([
        { kind: "equals", value: { kind: { kind: "literal", value: "on" } } },
        { kind: "isUnavailable" },
      ]);
      expect(rule.cases.map((c) => c.then[0]!.value)).toEqual([
        { kind: { kind: "literal", value: "lightbulb.max" } },
        { kind: { kind: "literal", value: "exclamationmark.triangle" } },
      ]);
    });

    it("is the person's photo with Use Person Photo on, else the icon", () => {
      const photo = byRole(baseLayers(PERSON, ctxFor(CHEN)), "photo");
      expect(photo?.kind).toBe("image");
      const p = photo!.payload as ImageElement;
      expect(p.source).toBe("entityPicture");
      expect(p.entity.entityId).toBe("person.chen");
      expect(p.contentMode).toBe("fill");
      expect(p.cornerRadius).toBeCloseTo((p.frame.width * 66) / 2, 1);
      const noPhoto = baseLayers({ ...PERSON, usePersonPhoto: false }, ctxFor(CHEN));
      expect(byRole(noPhoto, "photo")).toBeUndefined();
      expect(byRole(noPhoto, "icon")?.kind).toBe("icon");
    });
  });

  it("moves every frame with the tile's size", () => {
    const medium = baseLayers(LIGHT, ctxFor(OFFICE));
    const large = baseLayers({ ...LIGHT, colSpan: 12 }, ctxFor(OFFICE));
    expect(text(large, "name").frame).not.toEqual(text(medium, "name").frame);
    expect(icon(large).frame).not.toEqual(icon(medium).frame);
  });
});

describe("baseLayersDocument", () => {
  it("is a rectangular document in normal form, named and identified after the tile", () => {
    const doc = baseLayersDocument(LIGHT, ctxFor(OFFICE));
    expect(doc.id).toBe(LIGHT.id);
    expect(doc.name).toBe("Office");
    expect(doc.slotIndex).toBe(0);
    expect(doc.supportedFamilies).toEqual(["rectangular"]);
    expect(Object.keys(doc.perFamily)).toEqual(["rectangular"]);
    expect(doc.perFamily.rectangular?.placements).toEqual({});
    expect(doc.dataSources).toEqual([]);
    expect(doc.tapAction).toEqual({ type: "none" });
    expect(doc.elements).toEqual(baseLayers(LIGHT, ctxFor(OFFICE)));
  });
});
