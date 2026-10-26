// A tile's base layers (app repo docs/tile_layers_contract_2026-10.md,
// section 2): each simple key of section 2.4 lands on its layer, the words
// the `tileState` and `tileName` kinds read, and the design document they
// make.

import { describe, expect, it } from "vitest";
import { html } from "lit";
import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
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
import { BASE_GLOW_ID, BASE_LAYER_IDS, BASE_LAYER_NAMES, BASE_STATE_PART_IDS, BASE_STATE_PILL_ID } from "../src/watch-pages/tile-design.js";

const measurer = oneLookMeasurer("watch", { estimate: true });

/** Symbols that draw: every name, filled variants included, but crossed out
 * forms only where SF Symbols has one. */
const ALL_ICONS: IconProvider = {
  render: (name) => (name.includes(".slash") && !name.startsWith("lightbulb.slash") ? undefined : html``),
  available: () => true,
  names: () => [],
};

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
    const { inks, ...light } = tileValuesFor(LIGHT, ctxFor(OFFICE));
    expect(light).toEqual({ state: "82%", name: "Office", stateParts: { figure: "82", unit: "%", tail: "", word: "" } });
    // With the reference face's live inks (round four).
    expect(Object.keys(inks ?? {})).toEqual(["ink", "ink2", "unit", "glyph", "hue", "hueClear"]);
    expect(tileValuesFor(SENSOR, ctxFor(TEMP))).toMatchObject({ state: "21.5°C", name: "Living room", stateParts: { figure: "21.5", unit: "°C", tail: "", word: "" } });
    expect(tileValuesFor(PERSON, ctxFor(CHEN))).toMatchObject({ state: "Home", name: "Chen", stateParts: { figure: "", unit: "", tail: "", word: "Home" } });
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
    expect(layers.map((el) => el.payload.id)).toEqual([BASE_GLOW_ID, BASE_LAYER_IDS.icon, BASE_LAYER_IDS.state, BASE_LAYER_IDS.name]);
    expect(layers.map((el) => el.payload.name)).toEqual(["Glow", BASE_LAYER_NAMES.icon, BASE_LAYER_NAMES.state, BASE_LAYER_NAMES.name]);
    expect(text(layers, "name").value).toEqual({ kind: { kind: "tileName" } });
    // Rich text: the value is the parts' fallback, the figure's.
    expect(text(layers, "state").value).toEqual({ kind: { kind: "tileState", part: "figure" } });
  });

  it("is empty for a kind without layers", () => {
    expect(baseLayers({ id: "X", entityId: "camera.door", colSpan: 6, rowSpan: 4 }, {})).toEqual([]);
    expect(baseLayers({ id: "X", entityId: "page.ABC", colSpan: 6, rowSpan: 4 }, {})).toEqual([]);
  });

  it("puts every frame inside the design box, as fractions rounded to 4 places (the glow may reach past it)", () => {
    for (const [tile, e] of [[LIGHT, OFFICE], [PERSON, CHEN], [SENSOR, TEMP]] as const) {
      for (const el of baseLayers(tile, ctxFor(e))) {
        const f = el.payload.frame;
        expect(f.rotationDegrees).toBe(0);
        if (el.payload.id === BASE_GLOW_ID) {
          for (const v of [f.x, f.y, f.width, f.height]) expect(Math.round(v * 10000) / 10000).toBe(v);
          continue;
        }
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
      // Center is the default, which a saved layer leaves out.
      expect(text(baseLayers(LIGHT, ctxFor(OFFICE)), "name").alignment ?? "center").toBe("center");
      expect(text(baseLayers({ ...LIGHT, rowSpan: 2 }, ctxFor(OFFICE)), "name").alignment).toBe("leading");
    });
  });

  describe("the state layer", () => {
    it("is One Look's state type: the layer in the number's type, four parts each in its piece's type", () => {
      for (const layer of [text(baseLayers(LIGHT, ctxFor(OFFICE)), "state"), text(baseLayers(PERSON, ctxFor(CHEN)), "state")]) {
        expect(layer.fontWeight).toBe("bold");
        expect(layer.fontDesign).toBe("rounded");
        expect(layer.monospacedDigits).toBe(true);
        expect(layer.lineLimit ?? 1).toBe(1);
        expect(layer.parts?.map((p) => p.id)).toEqual(Object.values(BASE_STATE_PART_IDS));
        expect(layer.parts?.map((p) => p.value.kind)).toEqual((["figure", "unit", "tail", "word"] as const).map((part) => ({ kind: "tileState", part })));
      }
      const number = text(baseLayers(LIGHT, ctxFor(OFFICE)), "state");
      const [figure, unit, tail, word] = number.parts!;
      // The figure takes the layer's look, with One Look's tracking.
      expect(figure).toEqual({ id: BASE_STATE_PART_IDS.figure, value: { kind: { kind: "tileState", part: "figure" } }, tracking: -0.01 });
      // One Look's unit: 0.66 of the figure (a 10 pt floor on the watch),
      // semibold, the main ink at 0.84.
      expect(unit!.fontSize).toBe(10);
      expect(unit!.fontWeight).toBe("semibold");
      expect(unit!.colorHex).toBe(`${number.colorSlot.baseColorHex.slice(0, 7)}D6`);
      expect(unit!.fontDesign).toBeUndefined();
      // The tail and the word: regular, the system face, the second ink.
      expect(tail).toMatchObject({ fontWeight: "regular", fontDesign: "default", fontSize: 11 });
      expect(word).toMatchObject({ fontWeight: "regular", fontDesign: "default" });
      expect(word!.fontSize).toBeUndefined();
      expect(tail!.colorHex).toBe(word!.colorHex);
      expect(text(baseLayers(PERSON, ctxFor(CHEN)), "state").alignment).toBe("leading");
    });

    it("sits in a pill shape layer with the Pill value style, the line centred in it", () => {
      const pillLight = { ...LIGHT, stateValueLabelStyle: "Pill" };
      const layers = baseLayers(pillLight, ctxFor(OFFICE));
      const pill = layers.find((el) => el.payload.id === BASE_STATE_PILL_ID);
      expect(pill?.kind).toBe("shape");
      if (pill?.kind !== "shape") return;
      expect(pill.payload.kind).toBe("capsule");
      expect(pill.payload.name).toBe("State pill");
      expect(pill.payload.colorSlot.baseColorHex).toBe("#00000038");
      const state = text(layers, "state");
      // Centre is the default, which a saved layer leaves out.
      expect(state.alignment ?? "center").toBe("center");
      expect(state.frame).toEqual(pill.payload.frame);
      // Just under the State layer.
      const ids = layers.map((el) => el.payload.id);
      expect(ids.indexOf(BASE_STATE_PILL_ID)).toBe(ids.indexOf(BASE_LAYER_IDS.state) - 1);
      // Plain draws no pill.
      expect(baseLayers(LIGHT, ctxFor(OFFICE)).some((el) => el.payload.id === BASE_STATE_PILL_ID)).toBe(false);
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

    it("may shrink far enough for the line shown now to fit beside the glyph", () => {
      // A wide face: the measurer's widths half again as wide, so "15.6°C"
      // at one size overflows the room left of the thermometer.
      const wide = { ...measurer, width: (...a: Parameters<typeof measurer.width>) => measurer.width(...a) * 1.5 };
      const outside = entity("sensor.outside", "15.6", { friendly_name: "Outside", unit_of_measurement: "°C", device_class: "temperature" });
      const tile: WatchPageTile = { id: "44444444-4444-4444-8444-444444444444", entityId: "sensor.outside", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 };
      const ctx: BaseLayerContext = { states: { "sensor.outside": outside }, measurer: wide };
      const state = text(baseLayers(tile, ctx), "state");
      const box = designBoxFor(6, 4);
      const drawn = wide.width(tileValuesFor(tile, ctx).state, state.fontSize, "bold", true, 0);
      expect(state.minimumScale).toBeGreaterThanOrEqual(0.5);
      expect(drawn * (state.minimumScale ?? 1)).toBeLessThanOrEqual(state.frame.width * box.width);

      // The iPhone's face is the wider one: the line is fitted to it too.
      const onPhone: BaseLayerContext = { states: { "sensor.outside": outside }, measurer, phoneMeasurer: wide };
      const phoneState = text(baseLayers(tile, onPhone), "state");
      const phoneDrawn = wide.width(tileValuesFor(tile, onPhone).state, phoneState.fontSize, "bold", true, 0);
      expect(phoneDrawn * (phoneState.minimumScale ?? 1)).toBeLessThanOrEqual(phoneState.frame.width * box.width);
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

    it("names the tile's live glyph ink, which follows on and off by itself, in place of a rule (round four)", () => {
      const light = icon(baseLayers(LIGHT, ctxFor(OFFICE)));
      expect(light.rules).toEqual([]);
      expect(light.colorSlot.tileInk).toBe("glyph");
      // The face's ink now beside it: the lit bare glyph while on.
      expect(light.colorSlot.baseColorHex).toBe(tileValuesFor(LIGHT, ctxFor(OFFICE)).inks!.glyph);
      const off = icon(baseLayers(LIGHT, ctxFor({ ...OFFICE, state: "off" })));
      expect(off.colorSlot.tileInk).toBe("glyph");
      expect(off.rules).toEqual([]);
      expect(icon(baseLayers(SENSOR, ctxFor(TEMP))).rules).toEqual([]);
    });

    it("fills its symbol when One Look would, by a rule that follows on and off", () => {
      const ctx = (e: HassEntityState): BaseLayerContext => ({ ...ctxFor(e), icons: ALL_ICONS });
      const light = icon(baseLayers(LIGHT, ctx(OFFICE)));
      // The outline while off, the filled bulb while on, crossed out while
      // unavailable, as the native tile draws them.
      expect(light.symbol).toEqual({ kind: { kind: "literal", value: "lightbulb" } });
      const fill = light.rules[0]!;
      expect(fill.cases.map((c) => c.when.tests[0]!.comparison)).toEqual([{ kind: "isUnavailable" }, { kind: "isOn" }]);
      expect(fill.cases.map((c) => c.then[0])).toEqual([
        { kind: "setIcon", value: { kind: { kind: "literal", value: "lightbulb.slash" } } },
        { kind: "setIcon", value: { kind: { kind: "literal", value: "lightbulb.fill" } } },
      ]);
      // No colour rule: the glyph names the live ink.
      expect(light.rules).toHaveLength(1);
      // The same symbol and rule whichever state the light is in when it is built.
      const off = icon(baseLayers(LIGHT, ctx({ ...OFFICE, state: "off" })));
      expect(off.symbol).toEqual(light.symbol);
      expect(off.rules).toEqual(light.rules);
      // A kind that always fills takes the filled symbol and needs no rule.
      const sensor = icon(baseLayers(SENSOR, ctx(TEMP)));
      expect((sensor.symbol.kind as { value: string }).value.endsWith(".fill")).toBe(true);
      expect(sensor.rules.some((r) => r.cases.some((c) => c.then.some((t) => t.kind === "setIcon")))).toBe(false);
    });

    it("follows a lock, a cover, a timer and a battery's level by a rule, as One Look swaps their symbols", () => {
      const ctx = (e: HassEntityState): BaseLayerContext => ({ ...ctxFor(e), icons: ALL_ICONS });
      const tileFor = (entityId: string): WatchPageTile => ({ ...LIGHT, entityId });
      const symbolsOf = (layer: IconElement) => {
        const rule = layer.rules[0];
        return {
          symbol: (layer.symbol.kind as { value: string }).value,
          cases: (rule?.cases ?? []).map((c) => [c.when.tests[0]!.comparison, (c.then[0]!.value!.kind as { value: string }).value]),
        };
      };
      const lit = (v: string) => ({ kind: { kind: "literal", value: v } });

      // A lock built while locked opens in every other state.
      const lock = symbolsOf(icon(baseLayers(tileFor("lock.front"), ctx(entity("lock.front", "locked", { friendly_name: "Front" })))));
      expect(lock.symbol).toBe("lock.fill");
      expect(lock.cases.at(-1)).toEqual([{ kind: "notEquals", value: lit("locked") }, "lock.open.fill"]);
      expect(icon(baseLayers(tileFor("lock.front"), ctx(entity("lock.front", "unlocked", { friendly_name: "Front" }))))).toEqual(
        icon(baseLayers(tileFor("lock.front"), ctx(entity("lock.front", "locked", { friendly_name: "Front" })))),
      );

      // A garage door draws its open form while open, and while closing when
      // it reports a position.
      const garage = (state: string, attributes: Record<string, unknown>) =>
        symbolsOf(icon(baseLayers(tileFor("cover.garage"), ctx(entity("cover.garage", state, { device_class: "garage", ...attributes })))));
      const closed = garage("closed", {});
      expect(closed.symbol).toBe("door.garage.closed.fill");
      expect(closed.cases.at(-1)).toEqual([{ kind: "isOneOf", options: ["open", "opening"] }, "door.garage.open.fill"]);
      const positioned = garage("open", { current_position: 40 });
      expect(positioned.symbol).toBe("door.garage.closed.fill");
      expect(positioned.cases.at(-1)).toEqual([{ kind: "isOneOf", options: ["open", "opening", "closing"] }, "door.garage.open.fill"]);

      // A timer pauses.
      const timer = symbolsOf(icon(baseLayers(tileFor("timer.tea"), ctx(entity("timer.tea", "active")))));
      expect(timer.cases.at(-1)).toEqual([{ kind: "equals", value: lit("paused") }, "pause.fill"]);

      // A battery draws its level at One Look's thresholds, lowest first.
      const battery = symbolsOf(icon(baseLayers(tileFor("sensor.phone_battery"), ctx(entity("sensor.phone_battery", "90", { device_class: "battery", unit_of_measurement: "%" })))));
      expect(battery.symbol).toBe("battery.100.fill");
      expect(battery.cases.filter(([c]) => (c as { kind: string }).kind === "lessThan")).toEqual([
        [{ kind: "lessThan", value: lit("10") }, "battery.0.fill"],
        [{ kind: "lessThan", value: lit("25") }, "battery.25.fill"],
        [{ kind: "lessThan", value: lit("50") }, "battery.50.fill"],
        [{ kind: "lessThan", value: lit("75") }, "battery.75.fill"],
      ]);
    });

    it("puts the per state icons after the fill rule, so a matching entry wins", () => {
      const tile = { ...LIGHT, usesStateIcons: true, stateIcons: { on: "lightbulb.max" } };
      const layer = icon(baseLayers(tile, { ...ctxFor(OFFICE), icons: ALL_ICONS }));
      const setsIcon = layer.rules.filter((r) => r.cases.some((c) => c.then[0]?.kind === "setIcon"));
      expect(setsIcon).toHaveLength(2);
      expect(setsIcon[1]!.cases[0]!.then[0]!.value).toEqual({ kind: { kind: "literal", value: "lightbulb.max" } });
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
