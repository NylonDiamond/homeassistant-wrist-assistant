// Layer presets. A preset is the whole point of the authoring layer: one
// button and one entity have to produce a layer that already works, so what is
// worth testing is the shape of what comes out, not that it renders.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type Rule,
  type TapElement,
  DRAWABLE_FAMILIES,
  attachedTapsOf,
  auditUnknownKeys,
  chartHistoryEntity,
  chartHistoryRequests,
  encodeConfig,
  legacyConfig,
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
  companionEntities,
  gaugeBandRule,
  gaugeRange,
  onComparison,
  presetSpec,
  thermostatTargetTemplate,
  toggleSymbols,
} from "../src/presets.js";
import { presetColor, presetPreview } from "../src/preset-previews.js";
import { addPreview } from "../src/add-previews.js";
import { KIND_ORDER } from "../src/kinds.js";
import { type StatesRow, type StatesTable, tableShape } from "../src/states.js";
import { colorWords } from "../src/editors.js";
import { CURATED_SYMBOLS } from "../src/symbols.js";
import type { HassEntityState } from "../src/ha-api.js";

const KITCHEN = { entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" };

function config(): CustomComplicationConfig {
  return legacyConfig("Test", 0);
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

  it("leaves the icon alone when the domain has only one picture, so the color carries the state", () => {
    const cfg = config();
    const el = layer(cfg, addToggleButton(cfg, { entityId: "switch.kettle", displayName: "Kettle", domain: "switch" }, { family: "rectangular" }));
    const rule = el.payload.rules[0]!;
    expect(rule.cases[0]!.then.map((c) => c.kind)).toEqual(["setColor"]);
    expect(rule.otherwise?.map((c) => c.kind)).toEqual(["setColor"]);
  });

  it("puts the icon and its tap on the shape being edited, and on no other", () => {
    const cfg = config();
    const id = addToggleButton(cfg, KITCHEN, { family: "circular" });
    const tapId = attachedTapsOf(cfg, id)[0]!.payload.id;
    const here = cfg.perFamily.circular!.placements;
    expect(here[id]).toBeDefined();
    expect(here[tapId]?.frame).toEqual(here[id]?.frame);
    for (const family of DRAWABLE_FAMILIES) {
      if (family === "circular") continue;
      expect(cfg.perFamily[family]?.placements[id], family).toBeUndefined();
      expect(cfg.perFamily[family]?.placements[tapId], family).toBeUndefined();
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

  it("names only colors a cell can put a word to", () => {
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

// ── the stacked presets ───────────────────────────────────────────────────
// Nine presets that each build a small finished thing from one entity. What is
// worth checking is the part a later edit cannot recover: the value each layer
// reads, and the rule that makes it change.

describe("the stacked presets", () => {
  const SENSOR = { entityId: "sensor.phone_battery", displayName: "Phone battery", domain: "sensor" };

  function build(kind: Parameters<typeof applyPreset>[1], ref = SENSOR): { cfg: CustomComplicationConfig; id: string } {
    const cfg = config();
    const id = applyPreset(cfg, kind, ref, { family: "rectangular" });
    return { cfg, id };
  }

  /** The rows a rule reads as, or a throw with the reason it does not. Every
   * preset here is built through `buildStatesRule`, so a rule that will not
   * shape into a table is a preset the states editor cannot show. */
  function tableOf(rules: readonly Rule[]): StatesTable {
    const shape = tableShape([...rules]);
    if (!shape.ok) throw new Error(shape.reason);
    return shape.table;
  }

  /** The literal text a row's first change writes. */
  function wrote(row: StatesRow): string {
    const kind = row.changes[0]!.value!.kind;
    return kind.kind === "literal" ? kind.value : "";
  }

  it("gives every preset a card color and a sample", () => {
    for (const preset of LAYER_PRESETS) {
      expect(presetColor(preset.kind), preset.kind).toMatch(/^#[0-9a-f]{6}$/i);
      expect(() => presetPreview(preset.kind), preset.kind).not.toThrow();
    }
  });

  it("gives every blank layer kind a sample too", () => {
    for (const kind of KIND_ORDER) {
      expect(() => addPreview(kind), kind).not.toThrow();
    }
  });

  it("names a layer count that matches what each preset actually adds", () => {
    for (const preset of LAYER_PRESETS) {
      if (preset.families !== undefined && !preset.families.includes("rectangular")) continue;
      const cfg = config();
      const ref = preset.domains
        ? { entityId: `${preset.domains[0]}.thing`, displayName: "Thing", domain: preset.domains[0]! }
        : SENSOR;
      applyPreset(cfg, preset.kind, ref, { family: "rectangular" });
      expect(cfg.elements.length, preset.kind).toBe(preset.layerCount);
    }
  });

  it("pins a battery ring to 0-100 on the red-to-green ramp whatever the entity says", () => {
    const { cfg, id } = build("battery");
    const gauge = layer(cfg, id);
    if (gauge.kind !== "gauge") throw new Error("wrong kind");
    expect(gauge.payload.minValue).toBe(0);
    expect(gauge.payload.maxValue).toBe(100);
    expect(tableOf(gauge.payload.rules).rows.map(wrote)).toEqual([...ALARM_LOW_RAMP]);
    // The number in the middle is its own layer, so it can be moved or deleted.
    const text = cfg.elements.find((e) => e.kind === "text");
    expect(text?.payload.value.format).toEqual({ decimals: 0, suffix: "%" });
  });

  it("draws a sparkline under the reading, muted and unmarked", () => {
    const { cfg } = build("sparkline");
    const chart = cfg.elements.find((e) => e.kind === "chart");
    if (chart?.kind !== "chart") throw new Error("no chart");
    expect(chart.payload.historyMinutes).toBe(360);
    expect(chart.payload.style).toBe("line");
    expect(chart.payload.highlight).toBe("none");
    // The chart is pushed first, so the number draws over it.
    expect(cfg.elements[0]!.kind).toBe("chart");
    expect(cfg.elements[1]!.kind).toBe("text");
  });

  it("reads an age in seconds and prints it as a relative time", () => {
    const { cfg, id } = build("lastChanged");
    const el = layer(cfg, id);
    if (el.kind !== "text") throw new Error("wrong kind");
    expect(el.payload.value.kind).toEqual({ kind: "entityAge", ...SENSOR });
    expect(el.payload.value.format).toEqual({ relativeTime: true });
  });

  it("writes Home and Away rather than printing not_home", () => {
    const person = { entityId: "person.sam", displayName: "Sam", domain: "person" };
    const { cfg } = build("person", person);
    const word = cfg.elements.find((e) => e.kind === "text");
    expect(tableOf(word!.payload.rules).rows.map(wrote)).toEqual(["Home", "Away"]);
  });

  it("makes a countdown that ticks and a tap that starts it", () => {
    const timer = { entityId: "timer.pasta", displayName: "Pasta", domain: "timer" };
    const { cfg, id } = build("timer", timer);
    const el = layer(cfg, id);
    if (el.kind !== "text") throw new Error("wrong kind");
    expect(el.payload.countdown).toBe(true);
    expect(el.payload.monospacedDigits).toBe(true);
    const taps = cfg.elements.filter((e): e is CElement & { kind: "tap"; payload: TapElement } => e.kind === "tap");
    expect(taps.map((t) => t.payload.action)).toEqual([{ type: "timerStartPause" }]);
  });

  it("covers every alarm mode with one startsWith, and stays inside the states table", () => {
    const alarm = { entityId: "alarm_control_panel.house", displayName: "House", domain: "alarm_control_panel" };
    const { cfg, id } = build("alarm", alarm);
    const table = tableOf(layer(cfg, id).payload.rules);
    expect(table.rows.map((r) => r.comparison.kind)).toEqual(["equals", "equals", "equals", "startsWith", "equals"]);
    expect(table.rows.map(wrote)).toEqual(["Triggered", "Arming", "Arming", "Armed", "Off"]);
  });

  it("reads the weather's temperature off the attribute, not the state", () => {
    const weather = { entityId: "weather.home", displayName: "Home", domain: "weather" };
    const { cfg, id } = build("weatherNow", weather);
    const temp = layer(cfg, id);
    if (temp.kind !== "text") throw new Error("wrong kind");
    expect(temp.payload.value.kind).toEqual({ kind: "entityAttribute", ...weather, attribute: "temperature" });
    const icon = cfg.elements.find((e) => e.kind === "icon");
    // Every symbol the condition table can reach is one the picker draws.
    for (const row of tableOf(icon!.payload.rules).rows) expect(CURATED_SYMBOLS).toContain(wrote(row));
  });

  it("templates the sun times, because the clock format only reads a number", () => {
    const sun = { entityId: "sun.sun", displayName: "Sun", domain: "sun" };
    const { cfg } = build("sunTimes", sun);
    const times = cfg.elements.filter((e) => e.kind === "text");
    expect(times).toHaveLength(2);
    for (const t of times) {
      expect(t.payload.value.kind).toMatchObject({ kind: "jinja" });
      expect(t.payload.value.format).toEqual({ timestamp: "clock" });
    }
    expect((times[0]!.payload.value.kind as { value: string }).value).toContain("next_rising");
    expect((times[1]!.payload.value.kind as { value: string }).value).toContain("next_setting");
  });

  it("counts what is on without being given an entity", () => {
    const cfg = config();
    const id = applyPreset(cfg, "openCount", { entityId: "", displayName: "", domain: "" }, { family: "rectangular" });
    const count = layer(cfg, id);
    if (count.kind !== "text") throw new Error("wrong kind");
    expect(count.payload.value.kind).toEqual({
      kind: "aggregate",
      aggregate: {
        function: "count",
        scope: { kind: "filter", domains: ["binary_sensor"], areaIds: [], labelIds: [], floorIds: [] },
        stateFilter: { kind: "isOn" },
      },
    });
    expect(presetSpec("openCount").needsEntity).toBe(false);
  });

  it("colors the Who is home rows off the item, so one rule covers everybody", () => {
    const cfg = config();
    const id = applyPreset(cfg, "listWhoHome", { entityId: "", displayName: "", domain: "" }, { family: "rectangular" });
    const list = layer(cfg, id);
    if (list.kind !== "list") throw new Error("wrong kind");
    expect(list.payload.direction).toBe("across");
    for (const row of list.payload.template) {
      expect(tableOf(row.payload.rules).value?.kind).toEqual({ kind: "item", field: "state" });
    }
  });

  it("survives a round trip through the encoder with no unknown keys", () => {
    for (const preset of LAYER_PRESETS) {
      if (preset.families !== undefined && !preset.families.includes("rectangular")) continue;
      const cfg = config();
      const ref = preset.domains
        ? { entityId: `${preset.domains[0]}.thing`, displayName: "Thing", domain: preset.domains[0]! }
        : SENSOR;
      applyPreset(cfg, preset.kind, ref, { family: "rectangular" });
      const encoded = encodeConfig(cfg);
      expect(auditUnknownKeys(encoded), preset.kind).toEqual([]);
      expect(() => parseConfig(encoded), preset.kind).not.toThrow();
    }
  });
});

// ── presets carried over from the iPhone editor ───────────────────────────

describe("the iPhone-era presets", () => {
  function build(kind: Parameters<typeof applyPreset>[1], ref: { entityId: string; displayName: string; domain: string },
    st?: HassEntityState): CustomComplicationConfig {
    const cfg = config();
    applyPreset(cfg, kind, ref, st ? { family: "rectangular", state: st } : { family: "rectangular" });
    return cfg;
  }

  function tableOf(rules: readonly Rule[]): StatesTable {
    const shape = tableShape([...rules]);
    if (!shape.ok) throw new Error(shape.reason);
    return shape.table;
  }

  /** Every symbol a document can put on the face: layer symbols and rule icons. */
  function symbolsOf(cfg: CustomComplicationConfig): string[] {
    const out: string[] = [];
    for (const el of cfg.elements) {
      if (el.kind === "icon" && el.payload.symbol.kind.kind === "literal") out.push(el.payload.symbol.kind.value);
      for (const rule of el.payload.rules) {
        const changes = [...rule.cases.flatMap((c) => c.then), ...(rule.otherwise ?? [])];
        for (const ch of changes) {
          if (ch.kind === "setIcon" && ch.value?.kind.kind === "literal") out.push(ch.value.kind.value);
        }
      }
    }
    return out;
  }

  const CLIMATE = { entityId: "climate.hall", displayName: "Hall", domain: "climate" };
  const PLAYER = { entityId: "media_player.lounge", displayName: "Lounge", domain: "media_player" };
  const COVER = { entityId: "cover.garage", displayName: "Garage", domain: "cover" };

  it("uses only symbols the watch and the panel can both draw", () => {
    const cases: [Parameters<typeof applyPreset>[1], typeof KITCHEN][] = [
      ["stateIcon", COVER], ["stateIcon", KITCHEN], ["runButton", { entityId: "script.go", displayName: "Go", domain: "script" }],
      ["runButton", { entityId: "scene.movie", displayName: "Movie", domain: "scene" }],
      ["thermostat", CLIMATE], ["nowPlaying", PLAYER], ["summary", KITCHEN], ["listEntities", KITCHEN],
    ];
    for (const [kind, ref] of cases) {
      for (const s of symbolsOf(build(kind, ref))) expect(CURATED_SYMBOLS, `${kind}: ${s}`).toContain(s);
    }
  });

  it("seeds a state icon with every state the domain knows, and stays inside the states table", () => {
    const cfg = build("stateIcon", COVER);
    const icon = cfg.elements.find((e) => e.kind === "icon")!;
    const words = tableOf(icon.payload.rules).rows.map((r) => r.comparison.kind === "equals" && r.comparison.value?.kind.kind === "literal"
      ? r.comparison.value.kind.value : r.comparison.kind);
    expect(words).toEqual(expect.arrayContaining(["open", "closed", "isUnavailable"]));
    expect(cfg.elements.some((e) => e.kind === "tap")).toBe(false);
  });

  it("runs a script as a script and a scene as a scene", () => {
    const script = build("runButton", { entityId: "script.go", displayName: "Go", domain: "script" });
    const scene = build("runButton", { entityId: "scene.movie", displayName: "Movie", domain: "scene" });
    const tapOf = (cfg: CustomComplicationConfig) => (cfg.elements.find((e) => e.kind === "tap")!.payload as TapElement).action;
    expect(tapOf(script)).toMatchObject({ type: "runScript", entityId: "script.go" });
    expect(tapOf(scene)).toMatchObject({ type: "runScene", entityId: "scene.movie" });
  });

  it("reads a thermostat's attributes and colors it by what it is doing", () => {
    const cfg = build("thermostat", CLIMATE, state({}, "heat_cool"));
    const texts = cfg.elements.filter((e) => e.kind === "text");
    expect(texts[0]!.payload.value.kind).toMatchObject({ kind: "entityAttribute", attribute: "current_temperature" });
    // The target is a template: heat/cool mode keeps its targets in low and high.
    const target = texts[1]!.payload.value.kind as { kind: string; value: string };
    expect(target.kind).toBe("jinja");
    expect(target.value).toBe(thermostatTargetTemplate("climate.hall"));
    for (const attr of ["'temperature'", "'target_temp_low'", "'target_temp_high'"]) expect(target.value).toContain(attr);
    const icon = cfg.elements.find((e) => e.kind === "icon")!;
    expect(tableOf(icon.payload.rules).value?.kind).toMatchObject({ kind: "entityAttribute", attribute: "hvac_action" });
  });

  it("plays and pauses the player it shows", () => {
    const cfg = build("nowPlaying", PLAYER);
    const tap = cfg.elements.find((e) => e.kind === "tap")!.payload as TapElement;
    expect(tap.action).toEqual({
      type: "callService", serviceDomain: "media_player", serviceName: "media_play_pause",
      target: { ...PLAYER },
    });
    const title = cfg.elements.find((e) => e.kind === "text")!;
    expect(title.payload.value.kind).toMatchObject({ kind: "entityAttribute", attribute: "media_title" });
  });

  it("counts lights, people and doors, and rewrites the counts that read badly", () => {
    const cfg = config();
    const id = applyPreset(cfg, "summary", { entityId: "", displayName: "", domain: "" }, { family: "rectangular" });
    expect(layer(cfg, id).kind).toBe("text");
    const texts = cfg.elements.filter((e) => e.kind === "text");
    expect(texts.map((t) => t.payload.value.format?.suffix)).toEqual([" lights on", " home", " open"]);
    expect(texts[2]!.payload.value.kind).toMatchObject({ kind: "jinja" });
    const firstWords = texts.map((t) => {
      const change = tableOf(t.payload.rules).rows[0]!.changes[0]!;
      return change.value?.kind.kind === "literal" ? change.value.kind.value : "";
    });
    expect(firstWords).toEqual(["All off", "Nobody home", "All closed"]);
    expect(presetSpec("summary").needsEntity).toBe(false);
  });

  it("starts an entity list on the one entity picked", () => {
    const cfg = config();
    const id = applyPreset(cfg, "listEntities", CLIMATE, { family: "rectangular" });
    const list = layer(cfg, id);
    if (list.kind !== "list") throw new Error("wrong kind");
    expect(list.payload.source).toMatchObject({ kind: "entities", scope: { kind: "entities", entities: [CLIMATE] } });
  });

  it("fills three more rows, nearest kind first, skipping the dead and the nameless", () => {
    const st = (id: string, name: string | undefined, value = "on", deviceClass?: string): HassEntityState => ({
      entity_id: id, state: value, last_changed: "", last_updated: "",
      attributes: { ...(name !== undefined ? { friendly_name: name } : {}), ...(deviceClass ? { device_class: deviceClass } : {}) },
    });
    const states: Record<string, HassEntityState> = {};
    for (const s of [
      st("sensor.hall_temp", "Hall temp", "21", "temperature"),
      st("sensor.bed_temp", "Bed temp", "19", "temperature"),
      st("sensor.power", "Power", "300", "power"),
      st("sensor.gone", "Gone", "unavailable", "temperature"),
      st("sensor.noname", undefined, "20", "temperature"),
      st("light.kitchen", "Kitchen"),
      st("update.core", "Core update"),
      { ...st("light.all", "All"), attributes: { friendly_name: "All", entity_id: ["light.kitchen"] } },
    ]) states[s.entity_id] = s;
    const picked = { entityId: "sensor.hall_temp", displayName: "Hall temp", domain: "sensor" };
    expect(companionEntities(picked, states, 3).map((r) => r.entityId))
      .toEqual(["sensor.bed_temp", "sensor.power", "light.kitchen"]);

    const cfg = config();
    const id = applyPreset(cfg, "listEntities", picked, { family: "rectangular", states, state: states["sensor.hall_temp"]! });
    const list = layer(cfg, id);
    if (list.kind !== "list" || list.payload.source.kind !== "entities" || list.payload.source.scope.kind !== "entities") {
      throw new Error("wrong kind");
    }
    expect(list.payload.source.scope.entities.map((r) => r.entityId))
      .toEqual(["sensor.hall_temp", "sensor.bed_temp", "sensor.power", "light.kitchen"]);
  });
});
