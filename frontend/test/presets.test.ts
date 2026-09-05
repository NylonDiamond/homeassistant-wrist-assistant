// Layer presets. A preset is the whole point of the authoring layer: one
// button and one entity have to produce a layer that already works, so what is
// worth testing is the shape of what comes out, not that it renders.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type TapElement,
  DRAWABLE_FAMILIES,
  attachedTapsOf,
  auditUnknownKeys,
  chartHistoryEntity,
  chartHistoryRequests,
  encodeConfig,
  newConfig,
  parseConfig,
} from "../src/model.js";
import {
  ALARM_LOW_RAMP,
  LAYER_PRESETS,
  NEUTRAL_RAMP,
  addCameraLayer,
  addSensorGauge,
  addStatusText,
  addToggleButton,
  applyPreset,
  bandColors,
  bandThreshold,
  centredFrame,
  gaugeBandRule,
  gaugeRange,
  onComparison,
  presetSpec,
  toggleSymbols,
} from "../src/presets.js";
import { tableShape } from "../src/states.js";
import { colorWords } from "../src/editors.js";
import { CURATED_SYMBOLS } from "../src/symbols.js";
import type { HassEntityState } from "../src/ha-api.js";

const KITCHEN = { entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" };

function config(): CustomComplicationConfig {
  return newConfig("Test", 0);
}

function layer(cfg: CustomComplicationConfig, id: string): CElement {
  const el = cfg.elements.find((e) => e.payload.id === id);
  if (!el) throw new Error(`no layer ${id}`);
  return el;
}

function state(attributes: Record<string, unknown>, value = "42"): HassEntityState {
  return { entity_id: "sensor.x", state: value, attributes, last_changed: "", last_updated: "" };
}

describe("toggleSymbols", () => {
  it("gives a light an outline and a filled bulb", () => {
    expect(toggleSymbols(KITCHEN)).toEqual({ off: "lightbulb", on: "lightbulb.fill" });
  });

  it("falls back to a plain dot for a domain it has no picture for", () => {
    expect(toggleSymbols({ entityId: "vacuum.robot", displayName: "", domain: "vacuum" })).toEqual({ off: "circle", on: "circle.fill" });
  });

  it("reads the domain out of the id when the reference has none", () => {
    expect(toggleSymbols({ entityId: "fan.office", displayName: "", domain: "" }).off).toBe("fan.fill");
  });

  it("prefers a symbol name the app already worked out for the entity", () => {
    expect(toggleSymbols({ ...KITCHEN, iconName: "lamp.table.fill" })).toEqual({ off: "lamp.table.fill", on: "lamp.table.fill" });
  });

  it("only ever names a symbol the picker's own catalogue has", () => {
    const domains = ["light", "switch", "fan", "input_boolean", "cover", "lock", "media_player", "siren", "humidifier", "valve", "automation", "group", "unknown_domain"];
    for (const domain of domains) {
      const pair = toggleSymbols({ entityId: `${domain}.thing`, displayName: "", domain });
      expect(CURATED_SYMBOLS, `${domain} off`).toContain(pair.off);
      expect(CURATED_SYMBOLS, `${domain} on`).toContain(pair.on);
    }
  });
});

describe("onComparison", () => {
  it("uses the watch's own on test for a light", () => {
    expect(onComparison(KITCHEN)).toEqual({ kind: "isOn" });
  });

  it("uses the word a lock, a cover and a media player actually report", () => {
    expect(onComparison({ entityId: "lock.front", displayName: "", domain: "lock" })).toEqual({ kind: "equals", value: { kind: { kind: "literal", value: "locked" } } });
    expect(onComparison({ entityId: "cover.blind", displayName: "", domain: "cover" })).toEqual({ kind: "equals", value: { kind: { kind: "literal", value: "open" } } });
    expect(onComparison({ entityId: "media_player.tv", displayName: "", domain: "media_player" })).toEqual({ kind: "equals", value: { kind: { kind: "literal", value: "playing" } } });
  });
});

describe("gaugeRange", () => {
  it("takes the entity's own bounds when it states them", () => {
    expect(gaugeRange(state({ min: 5, max: 35 }))).toEqual({ min: 5, max: 35 });
  });

  it("ignores bounds that are the wrong way round", () => {
    expect(gaugeRange(state({ min: 90, max: 10 }))).toEqual({ min: 0, max: 100 });
  });

  it("knows a percentage is a percentage", () => {
    expect(gaugeRange(state({ device_class: "battery" }))).toEqual({ min: 0, max: 100 });
    expect(gaugeRange(state({ device_class: "humidity" }))).toEqual({ min: 0, max: 100 });
  });

  it("scales a temperature to the unit it is reported in", () => {
    expect(gaugeRange(state({ device_class: "temperature", unit_of_measurement: "°C" }))).toEqual({ min: -10, max: 40 });
    expect(gaugeRange(state({ device_class: "temperature", unit_of_measurement: "°F" }))).toEqual({ min: 0, max: 100 });
  });

  it("still gives an arc that moves when it knows nothing", () => {
    expect(gaugeRange(undefined)).toEqual({ min: 0, max: 100 });
  });
});

describe("centredFrame", () => {
  it("puts a box of that many points in the middle of the shape's canvas", () => {
    const frame = centredFrame("circular", 25.5, 25.5);
    expect(frame).toEqual({ x: 0.25, y: 0.25, width: 0.5, height: 0.5, rotationDegrees: 0 });
  });

  it("keeps a square square by sizing each shape from its own canvas", () => {
    // Rectangular is 181x65.5 points, so an equal fraction would be a letterbox.
    const wide = centredFrame("rectangular", 30, 30);
    expect(wide.width).toBeLessThan(wide.height);
  });

  it("never asks for more than the whole canvas", () => {
    expect(centredFrame("corner", 500, 500)).toEqual({ x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
  });
});

describe("the toggle button preset", () => {
  it("is an icon layer with a tap that toggles the entity", () => {
    const cfg = config();
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    const el = layer(cfg, id);
    expect(el.kind).toBe("icon");
    if (el.kind !== "icon") return;
    expect(el.payload.symbol).toEqual({ kind: { kind: "literal", value: "lightbulb" } });
    const tap = attachedTapsOf(cfg, id)[0]?.payload as TapElement | undefined;
    expect(tap?.action).toEqual({ type: "toggleEntity", ...KITCHEN });
    expect(tap?.attachedTo).toBe(id);
  });

  it("writes one rule, one case, one test, all on the entity's state", () => {
    const cfg = config();
    const el = layer(cfg, addToggleButton(cfg, KITCHEN, { family: "rectangular" }));
    expect(el.payload.rules).toHaveLength(1);
    const rule = el.payload.rules[0]!;
    expect(rule.cases).toHaveLength(1);
    const only = rule.cases[0]!;
    expect(only.when.tests).toHaveLength(1);
    expect(only.when.tests[0]!.value).toEqual({ kind: { kind: "entityState", ...KITCHEN } });
    expect(only.when.tests[0]!.comparison).toEqual({ kind: "isOn" });
    expect(only.then.map((c) => c.kind)).toEqual(["setIcon", "setColor"]);
    expect(rule.otherwise?.map((c) => c.kind)).toEqual(["setIcon", "setColor"]);
  });

  it("changes the icon on for on and off for off", () => {
    const cfg = config();
    const el = layer(cfg, addToggleButton(cfg, KITCHEN, { family: "rectangular" }));
    const rule = el.payload.rules[0]!;
    expect(rule.cases[0]!.then[0]!.value).toEqual({ kind: { kind: "literal", value: "lightbulb.fill" } });
    expect(rule.otherwise?.[0]!.value).toEqual({ kind: { kind: "literal", value: "lightbulb" } });
  });

  it("leaves the icon alone when the domain has only one picture, so the colour carries the state", () => {
    const cfg = config();
    const el = layer(cfg, addToggleButton(cfg, { entityId: "switch.kettle", displayName: "Kettle", domain: "switch" }, { family: "rectangular" }));
    const rule = el.payload.rules[0]!;
    expect(rule.cases[0]!.then.map((c) => c.kind)).toEqual(["setColor"]);
    expect(rule.otherwise?.map((c) => c.kind)).toEqual(["setColor"]);
  });

  it("frames the icon and its tap the same in every shape the document has", () => {
    const cfg = config();
    const id = addToggleButton(cfg, KITCHEN, { family: "rectangular" });
    const tapId = attachedTapsOf(cfg, id)[0]!.payload.id;
    for (const family of DRAWABLE_FAMILIES) {
      const placements = cfg.perFamily[family]!.placements;
      if (family === "rectangular") continue;
      expect(placements[id], family).toBeDefined();
      expect(placements[tapId]?.frame, family).toEqual(placements[id]?.frame);
    }
  });
});

describe("the status text preset", () => {
  it("shows the entity's state, with its unit when it has one", () => {
    const cfg = config();
    const el = layer(cfg, addStatusText(cfg, KITCHEN, { family: "rectangular", state: state({ unit_of_measurement: "°C" }) }));
    expect(el.kind).toBe("text");
    if (el.kind !== "text") return;
    expect(el.payload.value.kind).toEqual({ kind: "entityState", ...KITCHEN });
    expect(el.payload.value.format).toEqual({ useEntityUnit: true });
  });

  it("asks for no unit when the entity has none", () => {
    const cfg = config();
    const el = layer(cfg, addStatusText(cfg, KITCHEN, { family: "rectangular" }));
    if (el.kind !== "text") throw new Error("not a text layer");
    expect(el.payload.value.format).toBeUndefined();
  });

  it("dims itself while the entity is unavailable", () => {
    const cfg = config();
    const el = layer(cfg, addStatusText(cfg, KITCHEN, { family: "rectangular" }));
    const rule = el.payload.rules[0]!;
    expect(rule.cases[0]!.when.tests[0]!.comparison).toEqual({ kind: "isUnavailable" });
    expect(rule.cases[0]!.then).toEqual([{ kind: "setOpacity", number: 0.35 }]);
  });
});

describe("the sensor gauge preset", () => {
  it("binds the reading and seeds the range from the entity", () => {
    const cfg = config();
    const ref = { entityId: "sensor.battery", displayName: "Battery", domain: "sensor" };
    const el = layer(cfg, addSensorGauge(cfg, ref, { family: "circular", state: state({ device_class: "battery" }, "62") }));
    expect(el.kind).toBe("gauge");
    if (el.kind !== "gauge") return;
    expect(el.payload.value.kind).toEqual({ kind: "entityState", ...ref });
    expect(el.payload.minValue).toBe(0);
    expect(el.payload.maxValue).toBe(100);
  });

  it("writes one rule the states table can draw, with a band per third", () => {
    const cfg = config();
    const el = layer(cfg, addSensorGauge(cfg, KITCHEN, { family: "circular" }));
    expect(el.payload.rules).toHaveLength(1);
    const shape = tableShape(el.payload.rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.rows).toHaveLength(3);
    expect(shape.table.numberMode).toBe(true);
    expect(shape.table.columns).toEqual(["color"]);
    expect(shape.table.otherwise).toBeUndefined();
  });

  it("tests the same value the gauge itself reads, so the header chip agrees with the rows", () => {
    const cfg = config();
    const ref = { entityId: "sensor.battery", displayName: "Battery", domain: "sensor" };
    const el = layer(cfg, addSensorGauge(cfg, ref, { family: "circular", state: state({ device_class: "battery" }, "62") }));
    if (el.kind !== "gauge") throw new Error("not a gauge layer");
    const shape = tableShape(el.payload.rules);
    if (!shape.ok) throw new Error("not table shaped");
    expect(shape.table.value).toEqual(el.payload.value);
  });
});

describe("gaugeBandRule", () => {
  const REF = { entityId: "sensor.battery", displayName: "Battery", domain: "sensor" };

  function bands(rule: ReturnType<typeof gaugeBandRule>) {
    return rule.cases.map((c) => ({
      comparison: c.when.tests[0]!.comparison,
      color: c.then[0]!.value?.kind.kind === "literal" ? c.then[0]!.value.kind.value : "",
    }));
  }

  it("puts its thresholds on the thirds of the range", () => {
    const rows = bands(gaugeBandRule(REF, { min: 0, max: 100 }));
    expect(rows[0]!.comparison).toEqual({ kind: "lessThan", value: { kind: { kind: "literal", value: "33" } } });
    expect(rows[1]!.comparison).toEqual({
      kind: "between",
      value: { kind: { kind: "literal", value: "33" } },
      upper: { kind: { kind: "literal", value: "67" } },
    });
    expect(rows[2]!.comparison).toEqual({ kind: "greaterThan", value: { kind: { kind: "literal", value: "67" } } });
  });

  it("keeps a decimal where rounding would move a narrow band", () => {
    const rows = bands(gaugeBandRule(REF, { min: 0, max: 3 }));
    expect(rows[0]!.comparison.value).toEqual({ kind: { kind: "literal", value: "1" } });
    expect(rows[1]!.comparison.upper).toEqual({ kind: { kind: "literal", value: "2" } });
    expect(bandThreshold(6.666)).toBe("6.7");
    expect(bandThreshold(-3.333)).toBe("-3.3");
    expect(bandThreshold(23.333)).toBe("23");
  });

  it("runs red to green for a battery, where low is the alarming end", () => {
    const rows = bands(gaugeBandRule(REF, { min: 0, max: 100 }, bandColors(state({ device_class: "battery" }))));
    expect(rows.map((r) => r.color)).toEqual([...ALARM_LOW_RAMP]);
  });

  it("runs cool to warm for a temperature, which has no bad end", () => {
    const rows = bands(gaugeBandRule(REF, { min: -10, max: 40 }, bandColors(state({ device_class: "temperature", unit_of_measurement: "°C" }))));
    expect(rows.map((r) => r.color)).toEqual([...NEUTRAL_RAMP]);
    expect(bandColors(undefined)).toEqual(NEUTRAL_RAMP);
  });

  it("names only colours a cell can put a word to", () => {
    for (const ramp of [ALARM_LOW_RAMP, NEUTRAL_RAMP]) {
      for (const hex of ramp) expect(colorWords(hex), hex).not.toBe(hex);
    }
  });
});

describe("the camera preset", () => {
  it("is an image layer on that camera, filling the face", () => {
    const cfg = config();
    const ref = { entityId: "camera.porch", displayName: "Porch", domain: "camera" };
    const el = layer(cfg, addCameraLayer(cfg, ref, { family: "rectangular" }));
    expect(el.kind).toBe("image");
    if (el.kind !== "image") return;
    expect(el.payload.entity).toEqual(ref);
    expect(el.payload.frame).toEqual({ x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
  });
});

describe("the history chart preset", () => {
  it("asks the recorder for the entity's last six hours", () => {
    const cfg = config();
    const id = applyPreset(cfg, "history", KITCHEN, { family: "rectangular" });
    const el = layer(cfg, id);
    expect(el.kind).toBe("chart");
    if (el.kind !== "chart") throw new Error("unreachable");
    expect(el.payload.historyMinutes).toBe(360);
    expect(chartHistoryEntity(el.payload)).toBe(KITCHEN.entityId);
    expect(chartHistoryRequests(cfg)).toHaveLength(1);
  });

  it("is a line with both ends marked, unlike the forecast preset's bars", () => {
    const cfg = config();
    const history = layer(cfg, applyPreset(cfg, "history", KITCHEN, { family: "rectangular" }));
    if (history.kind !== "chart") throw new Error("unreachable");
    expect(history.payload.style).toBe("line");
    expect(history.payload.highlight).toBe("both");

    const other = config();
    const forecast = layer(other, applyPreset(other, "chart", KITCHEN, { family: "rectangular" }));
    if (forecast.kind !== "chart") throw new Error("unreachable");
    expect(forecast.payload.style).toBe("bars");
    // And the forecast preset asks the recorder for nothing.
    expect(chartHistoryRequests(other)).toEqual([]);
  });
});

describe("every preset", () => {
  it("adds exactly the number of layers its button promised", () => {
    for (const spec of LAYER_PRESETS) {
      const cfg = config();
      applyPreset(cfg, spec.kind, KITCHEN, { family: "rectangular" });
      expect(cfg.elements, spec.kind).toHaveLength(spec.layerCount);
    }
  });

  it("returns the layer to select, never the tap hiding behind it", () => {
    for (const spec of LAYER_PRESETS) {
      const cfg = config();
      const id = applyPreset(cfg, spec.kind, KITCHEN, { family: "rectangular" });
      expect(layer(cfg, id).kind, spec.kind).not.toBe("tap");
    }
  });

  it("produces a document the wire format understands", () => {
    for (const spec of LAYER_PRESETS) {
      const cfg = config();
      applyPreset(cfg, spec.kind, KITCHEN, { family: "rectangular" });
      const encoded = encodeConfig(cfg);
      expect(auditUnknownKeys(encoded), spec.kind).toEqual([]);
      expect(encodeConfig(parseConfig(encoded)), spec.kind).toEqual(encoded);
    }
  });

  it("has a spec behind every kind", () => {
    for (const spec of LAYER_PRESETS) expect(presetSpec(spec.kind)).toBe(spec);
  });
});
