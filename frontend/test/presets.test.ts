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
  groupChain,
  legacyConfig,
  newConfig,
  parseConfig,
  setLayerEntity,
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
  planCells,
  pickSceneLights,
  planRooms,
  presetSpec,
  thermostatTargetTemplate,
  toggleSymbols,
  type PresetEnv,
} from "../src/presets.js";
import type { DrawableFamily } from "../src/renderer.js";
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
      if (spec.layerCountIsMost) continue;
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
      if (preset.layerCountIsMost) expect(cfg.elements.length, preset.kind).toBeLessThanOrEqual(preset.layerCount);
      else expect(cfg.elements.length, preset.kind).toBe(preset.layerCount);
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

// ── card presets ──────────────────────────────────────────────────────────
// The pill, the bar, the photo and the art: presets whose look is a card.
// What matters is that each one is made of the layers its card promised,
// that every rule stays inside the states table, and that the rows of a list
// of cards start with the card so it draws underneath.

describe("the card presets", () => {
  const CARD_HEX = "#FFFFFF1F";
  const PLAYER = { entityId: "media_player.lounge", displayName: "Lounge", domain: "media_player" };
  const WEATHER = { entityId: "weather.home", displayName: "Home", domain: "weather" };
  const CAL = { entityId: "calendar.family", displayName: "Family", domain: "calendar" };
  const SAM = { entityId: "person.sam", displayName: "Sam", domain: "person" };
  const HUMIDITY = { entityId: "sensor.hall_humidity", displayName: "Hall humidity", domain: "sensor" };

  function build(kind: Parameters<typeof applyPreset>[1], ref: { entityId: string; displayName: string; domain: string },
    env: Partial<Parameters<typeof applyPreset>[3]> = {}): { cfg: CustomComplicationConfig; id: string } {
    const cfg = config();
    const id = applyPreset(cfg, kind, ref, { family: "rectangular", ...env });
    return { cfg, id };
  }

  function tableOf(rules: readonly Rule[]): StatesTable {
    const shape = tableShape([...rules]);
    if (!shape.ok) throw new Error(shape.reason);
    return shape.table;
  }

  function hexOf(row: StatesRow | undefined): string | undefined {
    const change = row?.changes.find((c) => c.kind === "setColor");
    return change?.value?.kind.kind === "literal" ? change.value.kind.value : undefined;
  }

  it("draws the home summary as three cards, each under its symbol and count", () => {
    const { cfg, id } = build("summary", KITCHEN);
    expect(cfg.elements.map((e) => e.kind)).toEqual([
      "shape", "icon", "text", "shape", "icon", "text", "shape", "icon", "text",
    ]);
    for (const el of cfg.elements) {
      if (el.kind === "shape") {
        expect(el.payload.kind).toBe("capsule");
        expect(el.payload.borderWidth).toBe(0);
        expect(el.payload.colorSlot.baseColorHex).toBe(CARD_HEX);
      }
      if (el.kind === "text") {
        expect(el.payload.alignment).toBe("trailing");
        expect(el.payload.fontWeight).toBe("semibold");
      }
    }
    expect(layer(cfg, id).kind).toBe("text");
    // Each row's card sits above the next row's, and the three fill the face.
    const cards = cfg.elements.filter((e) => e.kind === "shape").map((e) => e.payload.frame);
    expect(cards[0]!.y).toBeLessThan(cards[1]!.y);
    expect(cards[1]!.y).toBeLessThan(cards[2]!.y);
    expect(cards[2]!.y + cards[2]!.height).toBeLessThanOrEqual(1);
  });

  it("builds a toggle pill whose tap is on the pill and whose ink flips while it is on", () => {
    const { cfg, id } = build("togglePill", KITCHEN);
    const pill = layer(cfg, id);
    if (pill.kind !== "shape") throw new Error("wrong kind");
    expect(pill.payload.kind).toBe("capsule");
    const tap = attachedTapsOf(cfg, id)[0]?.payload as TapElement | undefined;
    expect(tap?.action).toEqual({ type: "toggleEntity", ...KITCHEN });
    // The pill lights amber; the icon and the name go dark on it.
    const on = tableOf(pill.payload.rules).rows[0]!;
    expect(on.comparison.kind).toBe("isOn");
    expect(hexOf(on)).toBe("#FF9F0A");
    const icon = cfg.elements.find((e) => e.kind === "icon")!;
    const name = cfg.elements.find((e) => e.kind === "text")!;
    expect(hexOf(tableOf(icon.payload.rules).rows[0])).toBe("#1C1C1E");
    expect(hexOf(tableOf(name.payload.rules).rows[0])).toBe("#1C1C1E");
    expect(name.payload.value).toEqual({ kind: { kind: "literal", value: "Kitchen light" } });
    // The pill is wide-shape only: it carries a name, and a corner cannot.
    expect(presetSpec("togglePill").families).toEqual(["rectangular", "small", "medium", "large", "xlarge"]);
  });

  it("uses the entity's own on test for the pill, so a lock's pill lights on locked", () => {
    const { cfg, id } = build("togglePill", { entityId: "lock.front", displayName: "Front", domain: "lock" });
    const pill = layer(cfg, id);
    const row = tableOf(pill.payload.rules).rows[0]!;
    expect(row.comparison).toEqual({ kind: "equals", value: { kind: { kind: "literal", value: "locked" } } });
  });

  it("puts a bar under a reading, on the entity's own range and ramp", () => {
    const st = state({ device_class: "battery", unit_of_measurement: "%" }, "64");
    const { cfg, id } = build("levelBar", HUMIDITY, { state: st });
    expect(cfg.elements.map((e) => e.kind)).toEqual(["text", "text", "shape"]);
    expect(layer(cfg, id).kind).toBe("text");
    const bar = cfg.elements[2]!;
    if (bar.kind !== "shape") throw new Error("wrong kind");
    expect(bar.payload.kind).toBe("capsule");
    expect(bar.payload.level).toMatchObject({ minValue: 0, maxValue: 100, direction: "right" });
    expect(bar.payload.level?.value.kind).toMatchObject({ kind: "entityState", entityId: HUMIDITY.entityId });
    // A battery runs red to green, the same ramp the ring uses.
    const rows = tableOf(bar.payload.rules).rows;
    expect(rows.map(hexOf)).toEqual([...ALARM_LOW_RAMP]);
    // The bar is a thin strip along the bottom, in points rather than a
    // fraction, so it stays thin on a tall Home Screen tile.
    expect(bar.payload.frame.height).toBeLessThan(0.1);
    expect(bar.payload.frame.y + bar.payload.frame.height).toBeCloseTo(0.9, 2);
    expect(presetSpec("levelBar").preferNumeric).toBe(true);
  });

  it("lays the weather card out beside the symbol on a wide face and under it on a round one", () => {
    const wide = build("weatherCard", WEATHER).cfg;
    expect(wide.elements.map((e) => e.kind)).toEqual(["icon", "text", "text"]);
    const [icon, temp, details] = wide.elements;
    expect(icon!.payload.frame.x + icon!.payload.frame.width).toBeLessThanOrEqual(temp!.payload.frame.x);
    if (temp!.kind !== "text" || details!.kind !== "text") throw new Error("wrong kind");
    expect(temp!.payload.alignment).toBe("leading");
    expect(temp!.payload.value.kind).toMatchObject({ kind: "entityAttribute", attribute: "temperature" });
    expect(details!.payload.value.kind).toMatchObject({ kind: "jinja" });
    if (details!.payload.value.kind.kind !== "jinja") throw new Error("wrong kind");
    expect(details!.payload.value.kind.value).toContain("'humidity'");
    expect(details!.payload.value.kind.value).toContain("'wind_speed'");

    const round = config();
    applyPreset(round, "weatherCard", WEATHER, { family: "circular" });
    const [rIcon, rTemp] = round.elements;
    expect(rIcon!.payload.frame.y + rIcon!.payload.frame.height).toBeLessThanOrEqual(rTemp!.payload.frame.y + 0.001);
    if (rTemp!.kind !== "text") throw new Error("wrong kind");
    expect(rTemp!.payload.alignment).toBeUndefined();
  });

  it("counts down to the calendar's next event from seconds the server works out", () => {
    const { cfg, id } = build("eventCountdown", CAL);
    expect(cfg.elements.map((e) => e.kind)).toEqual(["text", "text", "text"]);
    const countdown = layer(cfg, id);
    if (countdown.kind !== "text") throw new Error("wrong kind");
    expect(countdown.payload.countdown).toBe(true);
    expect(countdown.payload.monospacedDigits).toBe(true);
    if (countdown.payload.value.kind.kind !== "jinja") throw new Error("wrong kind");
    // `start_time` is a local date string, which the countdown cannot read,
    // so the template hands it unix seconds and says Now for an event under way.
    expect(countdown.payload.value.kind.value).toContain("as_timestamp(s) | int");
    expect(countdown.payload.value.kind.value).toContain("now().timestamp()");
    expect(countdown.payload.value.kind.value).toContain("Now");
    const title = cfg.elements[0]!;
    if (title.kind !== "text" || title.payload.value.kind.kind !== "jinja") throw new Error("wrong kind");
    expect(title.payload.value.kind.value).toContain("'message'");
    expect(title.payload.value.kind.value).toContain("No events");
    const at = cfg.elements[2]!;
    if (at.kind !== "text") throw new Error("wrong kind");
    expect(at.payload.value.format).toEqual({ timestamp: "clock" });
  });

  it("rings a person's picture with a disc that goes green at home", () => {
    const { cfg, id } = build("personPhoto", SAM);
    expect(cfg.elements.map((e) => e.kind)).toEqual(["shape", "image", "text"]);
    const [disc, photo, word] = cfg.elements;
    if (disc!.kind !== "shape" || photo!.kind !== "image" || word!.kind !== "text") throw new Error("wrong kind");
    expect(layer(cfg, id).kind).toBe("image");
    expect(disc!.payload.kind).toBe("circle");
    expect(hexOf(tableOf(disc!.payload.rules).rows[0])).toBe(ALARM_LOW_RAMP[2]);
    expect(photo!.payload.source).toBe("entityPicture");
    expect(photo!.payload.entity).toEqual(SAM);
    // The picture is square and clipped to a circle: the radius is half its
    // side in points, on the shape it was built for.
    const side = photo!.payload.frame.width * 181;
    expect(photo!.payload.frame.height * 65.5).toBeCloseTo(side, 1);
    expect(photo!.payload.cornerRadius).toBeCloseTo(side / 2, 1);
    // The disc is bigger than the picture all round, and that margin is the ring.
    expect(disc!.payload.frame.x).toBeLessThan(photo!.payload.frame.x);
    expect(disc!.payload.frame.y).toBeLessThan(photo!.payload.frame.y);
    const words = tableOf(word!.payload.rules).rows.map((r) =>
      r.changes.find((c) => c.kind === "setText")?.value?.kind.kind === "literal"
        ? (r.changes.find((c) => c.kind === "setText")!.value!.kind as { value: string }).value : "");
    expect(words).toEqual(["Home", "Away"]);
  });

  it("fills the face with the cover art and a dark band the song sits on, tap to play or pause", () => {
    const { cfg, id } = build("nowPlayingArt", PLAYER);
    // The tap lands beside the picture it is attached to; the band and the
    // song draw after both, on top.
    expect(cfg.elements.map((e) => e.kind)).toEqual(["image", "tap", "shape", "text"]);
    const [art, , band, title] = cfg.elements;
    if (art!.kind !== "image" || band!.kind !== "shape" || title!.kind !== "text") throw new Error("wrong kind");
    expect(art!.payload.source).toBe("entityPicture");
    expect(art!.payload.frame).toEqual({ x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
    expect(band!.payload.colorSlot.baseColorHex).toBe("#0000008C");
    expect(band!.payload.frame.y).toBeGreaterThan(0.6);
    expect(layer(cfg, id)).toBe(title);
    expect(title!.payload.value.kind).toMatchObject({ kind: "entityAttribute", attribute: "media_title" });
    const tap = attachedTapsOf(cfg, art!.payload.id)[0]?.payload as TapElement | undefined;
    expect(tap?.action).toEqual({
      type: "callService", serviceDomain: "media_player", serviceName: "media_play_pause", target: { ...PLAYER },
    });
  });

  it("adds a bar to the thermostat that reads the thermostat's own range live", () => {
    const climate = { entityId: "climate.hall", displayName: "Hall", domain: "climate" };
    const st = { ...state({ min_temp: 7, max_temp: 30 }, "heat"), entity_id: climate.entityId };
    const { cfg } = build("thermostat", climate, { state: st });
    expect(cfg.elements.map((e) => e.kind)).toEqual(["icon", "text", "text", "shape"]);
    const bar = cfg.elements[3]!;
    if (bar.kind !== "shape") throw new Error("wrong kind");
    expect(bar.payload.level).toMatchObject({
      minValue: 7, maxValue: 30, direction: "right",
      minSource: { kind: { kind: "entityAttribute", entityId: climate.entityId, attribute: "min_temp" } },
      maxSource: { kind: { kind: "entityAttribute", entityId: climate.entityId, attribute: "max_temp" } },
    });
    expect(bar.payload.level?.value.kind).toMatchObject({ kind: "entityAttribute", attribute: "current_temperature" });
    // Without a stated range the bar spans a room in either scale.
    const bare = build("thermostat", climate).cfg.elements[3]!;
    if (bare.kind !== "shape") throw new Error("wrong kind");
    expect(bare.payload.level).toMatchObject({ minValue: 5, maxValue: 35 });
    // Orange while heating, blue while cooling, like the number above it.
    const rows = tableOf(bar.payload.rules).rows;
    expect(rows.map(hexOf)).toEqual(["#FF9F0A", NEUTRAL_RAMP[0]]);
  });

  it("starts every card list's row with the card, so it draws underneath", () => {
    const cardLists: Parameters<typeof applyPreset>[1][] =
      ["listEntities", "listEvents", "listTodo", "listLightsOn", "listBatteries", "listRecent", "listScenes", "listToggles"];
    for (const kind of cardLists) {
      const { cfg, id } = build(kind, KITCHEN);
      const list = layer(cfg, id);
      if (list.kind !== "list") throw new Error(`${kind}: wrong kind`);
      const first = list.payload.template[0]!;
      expect(first.kind, kind).toBe("shape");
      if (first.kind !== "shape") continue;
      expect(first.payload.frame, kind).toEqual({ x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
      expect(first.payload.borderWidth, kind).toBe(0);
      expect(first.payload.colorSlot.baseColorHex, kind).toBe(CARD_HEX);
      expect(first.payload.level, kind).toBeUndefined();
      // The rows keep a hair apart so they read as cards rather than one slab.
      expect(list.payload.gap, kind).toBeGreaterThanOrEqual(2);
      // The list keeps less margin than a plain one: each card has its own edge.
      expect(list.payload.frame.width, kind).toBeGreaterThan(0.92);
    }
    // The forecasts and Who is home run across the face and stay bare.
    for (const kind of ["listHourly", "listDaily", "listWhoHome"] as const) {
      const { cfg, id } = build(kind, WEATHER);
      const list = layer(cfg, id);
      if (list.kind !== "list") throw new Error(`${kind}: wrong kind`);
      expect(list.payload.template[0]!.kind, kind).not.toBe("shape");
    }
  });

  it("builds the toggle grid as four pills that light on `on`, from the on/off domains only", () => {
    const st = (id: string, name: string, value = "on"): HassEntityState => ({
      entity_id: id, state: value, last_changed: "", last_updated: "", attributes: { friendly_name: name },
    });
    const states: Record<string, HassEntityState> = {};
    for (const s of [
      st("light.hall", "Hall"), st("switch.fan", "Fan"), st("lock.front", "Front", "locked"),
      st("cover.garage", "Garage", "open"), st("input_boolean.guest", "Guest"), st("fan.office", "Office"),
    ]) states[s.entity_id] = s;
    const { cfg, id } = build("listToggles", KITCHEN, { states });
    const list = layer(cfg, id);
    if (list.kind !== "list" || list.payload.source.kind !== "entities" || list.payload.source.scope.kind !== "entities") {
      throw new Error("wrong kind");
    }
    // The picked light, then the other light, then the glance domains in
    // order; never the lock or the cover, whose on is not the word on.
    expect(list.payload.source.scope.entities.map((r) => r.entityId))
      .toEqual(["light.kitchen", "light.hall", "switch.fan", "fan.office"]);
    expect(list.payload.columns).toBe(2);
    expect(list.payload.rows).toBe(4);
    expect(list.payload.template.map((r) => r.kind)).toEqual(["shape", "icon", "text", "tap"]);
    const [pill, icon, name, tap] = list.payload.template;
    if (pill!.kind !== "shape" || icon!.kind !== "icon" || name!.kind !== "text" || tap!.kind !== "tap") throw new Error("wrong kind");
    for (const el of [pill!, icon!, name!]) {
      const row = tableOf(el.payload.rules).rows[0]!;
      expect(row.comparison).toEqual({ kind: "isOn" });
      expect(tableOf(el.payload.rules).value?.kind).toEqual({ kind: "item", field: "state" });
    }
    expect(hexOf(tableOf(pill!.payload.rules).rows[0])).toBe("#FF9F0A");
    expect(hexOf(tableOf(icon!.payload.rules).rows[0])).toBe("#1C1C1E");
    expect(hexOf(tableOf(name!.payload.rules).rows[0])).toBe("#1C1C1E");
    expect(tap!.payload.action).toEqual({ type: "toggleEntity", entityId: "{item.entityId}", displayName: "", domain: "" });
    expect(presetSpec("listToggles").domains).not.toContain("lock");
    expect(presetSpec("listToggles").domains).not.toContain("cover");
    expect(presetSpec("listToggles").domains).toContain("light");
  });

  it("keeps every card preset inside the states table and on the wire", () => {
    const cases: [Parameters<typeof applyPreset>[1], { entityId: string; displayName: string; domain: string }][] = [
      ["summary", KITCHEN], ["togglePill", KITCHEN], ["levelBar", HUMIDITY], ["weatherCard", WEATHER],
      ["eventCountdown", CAL], ["personPhoto", SAM], ["nowPlayingArt", PLAYER], ["listToggles", KITCHEN],
      ["thermostat", { entityId: "climate.hall", displayName: "Hall", domain: "climate" }],
    ];
    for (const [kind, ref] of cases) {
      const { cfg } = build(kind, ref);
      const layers = cfg.elements.flatMap((e) => e.kind === "list" ? [e, ...e.payload.template] : [e]);
      for (const el of layers) {
        for (const rule of el.payload.rules) expect(tableShape([rule]).ok, `${kind}: ${el.kind}`).toBe(true);
      }
      const encoded = encodeConfig(cfg);
      expect(auditUnknownKeys(encoded), kind).toEqual([]);
      expect(encodeConfig(parseConfig(encoded)), kind).toEqual(encoded);
    }
  });
});

// ── every preset is a group ───────────────────────────────────────────────

describe("presets as groups", () => {
  it("puts every layer a preset adds into one group named after the preset", () => {
    for (const preset of LAYER_PRESETS) {
      if (preset.families !== undefined && !preset.families.includes("rectangular")) continue;
      const cfg = config();
      const ref = preset.domains
        ? { entityId: `${preset.domains[0]}.thing`, displayName: "Thing", domain: preset.domains[0]! }
        : { entityId: "sensor.thing", displayName: "Thing", domain: "sensor" };
      applyPreset(cfg, preset.kind, ref, { family: "rectangular" });
      const layers = cfg.elements.filter((e) => !(e.kind === "tap" && e.payload.attachedTo !== undefined));
      if (layers.length < 2) {
        // One layer is not a group: a list or a status line stays loose.
        expect(cfg.groups ?? [], preset.kind).toHaveLength(0);
        continue;
      }
      const top = (cfg.groups ?? []).filter((g) => g.parentId === undefined);
      expect(top, preset.kind).toHaveLength(1);
      const group = top[0]!;
      expect(group.name, preset.kind).toBe(preset.title);
      // Every layer is in the group, directly or through a row sub-group.
      for (const el of layers) {
        const chain = groupChain(cfg, el.payload.groupId).map((g) => g.id);
        expect(chain, `${preset.kind}: ${el.kind}`).toContain(group.id);
      }
    }
  });

  it("gives a preset with rows a sub-group per row, inside the preset's group", () => {
    const cfg = config();
    applyPreset(cfg, "summary", KITCHEN, { family: "rectangular" });
    const top = cfg.groups!.find((g) => g.parentId === undefined)!;
    expect(top.name).toBe("Home summary");
    const rows = cfg.groups!.filter((g) => g.parentId === top.id);
    expect(rows.map((g) => g.name)).toEqual(["Lights", "People", "Doors"]);
    for (const row of rows) {
      expect(cfg.elements.filter((e) => e.payload.groupId === row.id).map((e) => e.kind)).toEqual(["shape", "icon", "text"]);
    }
    expect(cfg.elements.every((e) => rows.some((r) => r.id === e.payload.groupId))).toBe(true);

    const sun = config();
    applyPreset(sun, "sunTimes", { entityId: "sun.sun", displayName: "Sun", domain: "sun" }, { family: "rectangular" });
    const sunTop = sun.groups!.find((g) => g.parentId === undefined)!;
    expect(sun.groups!.filter((g) => g.parentId === sunTop.id).map((g) => g.name)).toEqual(["Sunrise", "Sunset"]);
  });

  it("keeps two presets on one face as two groups, and the second inside no group", () => {
    const cfg = config();
    applyPreset(cfg, "summary", KITCHEN, { family: "rectangular" });
    applyPreset(cfg, "weatherNow", { entityId: "weather.home", displayName: "Home", domain: "weather" }, { family: "rectangular" });
    const top = cfg.groups!.filter((g) => g.parentId === undefined);
    expect(top.map((g) => g.name)).toEqual(["Home summary", "Weather now"]);
    // The summary's rows are its own sub-groups and nothing else's.
    for (const g of cfg.groups!) if (g.parentId !== undefined) expect(g.parentId).toBe(top[0]!.id);
    const encoded = encodeConfig(cfg);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    expect(encodeConfig(parseConfig(encoded))).toEqual(encoded);
  });
});

// ── the scene presets ─────────────────────────────────────────────────────
// Tiny house and Floor plan fill a whole tile and read the home to fill
// themselves in, so what is worth pinning is what they pick from a home and
// that the result stays an ordinary, editable, encodable document.

describe("the scene presets", () => {
  function entity(id: string, stateValue: string, attributes: Record<string, unknown> = {}): HassEntityState {
    return { entity_id: id, state: stateValue, attributes, last_changed: "", last_updated: "" };
  }

  /** A small home: three areas with lights (living has two, one through its
   * device), a light in no area, the sun, the weather, a thermostat, a kitchen
   * thermometer, motion in the living room and a front door lock. */
  function home(): PresetEnv {
    const list = [
      entity("light.bedroom", "off", { friendly_name: "Bedroom" }),
      entity("light.kitchen", "on", { friendly_name: "Kitchen" }),
      entity("light.living_ceiling", "on", { friendly_name: "Living ceiling" }),
      entity("light.living_lamp", "off", { friendly_name: "Living lamp" }),
      entity("light.porch", "off", { friendly_name: "Porch" }),
      entity("sun.sun", "below_horizon"),
      entity("weather.home", "rainy", { temperature: 54 }),
      entity("climate.hall", "heat", { current_temperature: 71 }),
      entity("sensor.kitchen_temperature", "72.4", { device_class: "temperature" }),
      entity("binary_sensor.living_motion", "on", { device_class: "motion" }),
      entity("lock.front_door", "locked", { friendly_name: "Front door" }),
    ];
    return {
      family: "large",
      states: Object.fromEntries(list.map((s) => [s.entity_id, s])),
      registry: {
        entities: {
          "light.bedroom": { area_id: "bedroom" },
          "light.kitchen": { area_id: "kitchen" },
          "light.living_ceiling": { area_id: "living" },
          "light.living_lamp": { device_id: "lamp" },
          "sensor.kitchen_temperature": { area_id: "kitchen" },
          "binary_sensor.living_motion": { area_id: "living" },
        },
        devices: { lamp: { area_id: "living" } },
        areas: { bedroom: { name: "Bedroom" }, kitchen: { name: "Kitchen" }, living: { name: "Living room" } },
      },
    };
  }

  function build(kind: "houseScene" | "floorPlan", env: PresetEnv): CustomComplicationConfig {
    const cfg = newConfig("Scene", 0, env.family);
    applyPreset(cfg, kind, { entityId: "", displayName: "", domain: "" }, env);
    return cfg;
  }

  function named(cfg: CustomComplicationConfig, name: string): CElement | undefined {
    return cfg.elements.find((e) => e.payload.name === name);
  }

  function checkDocument(cfg: CustomComplicationConfig, kind: "houseScene" | "floorPlan", family: DrawableFamily): void {
    expect(cfg.elements.length, `${kind} ${family}`).toBeLessThanOrEqual(presetSpec(kind).layerCount);
    const top = (cfg.groups ?? []).filter((g) => g.parentId === undefined);
    expect(top.map((g) => g.name)).toEqual([presetSpec(kind).title]);
    for (const el of cfg.elements) {
      for (const rule of el.payload.rules) expect(tableShape([rule]).ok, `${kind}: ${el.payload.name}`).toBe(true);
      const f = cfg.perFamily[family]!.placements[el.payload.id]!.frame;
      expect(f.x, el.payload.name).toBeGreaterThanOrEqual(0);
      expect(f.y, el.payload.name).toBeGreaterThanOrEqual(0);
      expect(f.x + f.width, el.payload.name).toBeLessThanOrEqual(1.0001);
      expect(f.y + f.height, el.payload.name).toBeLessThanOrEqual(1.0001);
    }
    const encoded = encodeConfig(cfg);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    expect(encodeConfig(parseConfig(encoded))).toEqual(encoded);
  }

  it("leaves every group it makes unlocked, so each part drags on its own", () => {
    for (const kind of ["houseScene", "floorPlan"] as const) {
      const cfg = build(kind, home());
      expect(cfg.groups!.length, kind).toBeGreaterThan(1);
      expect(cfg.groups!.filter((g) => g.locked).map((g) => g.name), kind).toEqual([]);
    }
    // Every other preset still hands back one locked part.
    const toggle = newConfig("Toggle", 0, "large");
    applyPreset(toggle, "togglePill", { entityId: "light.kitchen", displayName: "Kitchen", domain: "light" }, { family: "large" });
    expect(toggle.groups ?? []).not.toEqual([]);
    expect(toggle.groups!.every((g) => g.locked)).toBe(true);
  });

  it("offers both on the Home Screen tiles only, and asks for no entity", () => {
    expect(presetSpec("houseScene").families).toEqual(["medium", "large"]);
    expect(presetSpec("floorPlan").families).toEqual(["medium", "large", "xlarge"]);
    expect(presetSpec("houseScene").needsEntity).toBe(false);
    expect(presetSpec("floorPlan").needsEntity).toBe(false);
  });

  it("builds a house on medium and large that encodes and stays in the tile", () => {
    for (const family of ["medium", "large"] as const) {
      checkDocument(build("houseScene", { ...home(), family }), "houseScene", family);
    }
  });

  it("hands out one light per area first, then the rest, to the four windows", () => {
    const cfg = build("houseScene", home());
    // One row per window: the tap is attached, so the Layers list hides it.
    expect(cfg.elements.some((e) => e.kind === "tap" && e.payload.attachedTo === undefined)).toBe(false);
    const windows = cfg.elements.filter((e) => e.payload.name?.endsWith(" window"));
    expect(windows).toHaveLength(4);
    const taps = windows.map((w) => attachedTapsOf(cfg, w.payload.id)[0]!.payload as TapElement);
    expect(taps.map((t) => (t.action as { entityId: string }).entityId))
      .toEqual(["light.bedroom", "light.kitchen", "light.living_ceiling", "light.living_lamp"]);
    for (const tap of taps) expect(tap.action.type).toBe("toggleEntity");
    for (const el of windows) {
      expect(el.payload.shadow).toBeDefined();
      const table = tableShape(el.payload.rules);
      if (!table.ok) throw new Error(table.reason);
      expect(table.table.rows[0]!.changes[0]!.kind).toBe("show");
      expect(table.table.otherwise?.[0]?.kind).toBe("hide");
    }
    // The tap sits over the window, not over the whole house.
    const frame = cfg.perFamily.large!.placements[windows[0]!.payload.id]!.frame;
    expect(frame.width).toBeLessThan(0.2);
    expect(cfg.perFamily.large!.placements[taps[0]!.id]!.frame).toEqual(frame);
  });

  it("moves a window to another light with one pick: its glow and its tap", () => {
    const cfg = build("houseScene", home());
    const win = cfg.elements.find((e) => e.payload.name === "Downstairs left window")!;
    setLayerEntity(cfg, win.payload.id, { entityId: "light.porch", displayName: "Porch", domain: "light" });
    expect((attachedTapsOf(cfg, win.payload.id)[0]!.payload as TapElement).action).toMatchObject({ entityId: "light.porch" });
    expect(win.payload.rules[0]!.cases[0]!.when.tests[0]!.value.kind).toMatchObject({ entityId: "light.porch" });
  });

  it("skips light groups, unavailable lights, and a lock that is not the house's", () => {
    const env = home();
    const add = (s: HassEntityState) => { env.states![s.entity_id] = s; };
    add(entity("light.all", "on", { friendly_name: "All", entity_id: ["light.kitchen", "light.bedroom"] }));
    add(entity("light.attic", "unavailable", { friendly_name: "Attic" }));
    add(entity("lock.car_doors", "unlocked", { friendly_name: "Car doors" }));
    delete env.states!["lock.front_door"];
    env.registry!.entities!["light.all"] = { area_id: "attic_area" };
    env.registry!.areas!["attic_area"] = { name: "Attic" };
    expect(pickSceneLights(env, 8).map((l) => l.entityId)).not.toContain("light.all");
    expect(pickSceneLights(env, 8).map((l) => l.entityId)).not.toContain("light.attic");
    expect(planRooms(env, 8).map((r) => r.name)).not.toContain("Attic");
    const large = build("houseScene", env);
    expect(large.elements.some((e) => e.payload.name?.startsWith("Car doors"))).toBe(false);
    expect(named(large, "Inside card")).toBeDefined();
    const medium = build("houseScene", { ...env, family: "medium" });
    expect(named(medium, "Lock")).toBeUndefined();
  });

  it("puts the large tile's cards in one Readings folder", () => {
    const cfg = build("houseScene", home());
    const readings = cfg.groups!.find((g) => g.name === "Readings")!;
    expect(cfg.groups!.filter((g) => g.parentId === readings.id).map((g) => g.name)).toEqual(["Inside", "Outside", "Front door"]);
    expect(presetSpec("houseScene").foldSubGroups).toBe(true);
    expect(presetSpec("floorPlan").foldSubGroups).toBe(true);
  });

  it("follows the sun and the rain when the home has them, and is always night without", () => {
    const withSun = build("houseScene", home());
    expect(named(withSun, "Day sky")).toBeDefined();
    expect(named(withSun, "Night")!.payload.rules).toHaveLength(1);
    expect(named(withSun, "Rain")).toBeDefined();

    const bare = home();
    delete bare.states!["sun.sun"];
    delete bare.states!["weather.home"];
    const noSun = build("houseScene", bare);
    expect(named(noSun, "Day sky")).toBeUndefined();
    expect(named(noSun, "Sun")).toBeUndefined();
    expect(named(noSun, "Night")!.payload.rules).toEqual([]);
    expect(named(noSun, "Rain")).toBeUndefined();
  });

  it("puts readings along the bottom: three cards on large, two lines on medium", () => {
    const large = build("houseScene", home());
    expect(["Inside card", "Outside card", "Front door card"].every((n) => named(large, n))).toBe(true);
    const medium = build("houseScene", { ...home(), family: "medium" });
    const temps = named(medium, "Temperatures");
    expect(temps?.kind).toBe("text");
    if (temps?.kind !== "text") return;
    // Rich text, not a template: each reading is a part picked from a list.
    expect(temps.payload.parts!.map((p) => p.value.kind)).toEqual([
      expect.objectContaining({ kind: "entityState", entityId: "sensor.kitchen_temperature" }),
      { kind: "literal", value: " in" },
      { kind: "literal", value: " · " },
      expect.objectContaining({ kind: "entityAttribute", entityId: "weather.home", attribute: "temperature" }),
      { kind: "literal", value: " out" },
    ]);
    expect(temps.payload.value.kind).toMatchObject({ kind: "entityState", entityId: "sensor.kitchen_temperature" });
    const door = named(medium, "Lock");
    if (door?.kind !== "text") throw new Error("no door line");
    expect(door.payload.parts!.map((p) => p.value.kind)).toEqual([
      { kind: "literal", value: "Front door " },
      expect.objectContaining({ kind: "entityState", entityId: "lock.front_door" }),
    ]);
    const all = [large, medium].flatMap((c) => c.elements);
    expect(all.some((e) => e.kind === "text" && e.payload.value.kind.kind === "jinja")).toBe(false);
  });

  it("shows the house's lock before a car's, and a front door before either", () => {
    const env = home();
    env.states!["lock.car_doors"] = entity("lock.car_doors", "unlocked", { friendly_name: "Car doors" });
    env.states!["lock.back_door"] = entity("lock.back_door", "locked", { friendly_name: "Back door" });
    env.registry!.entities!["lock.back_door"] = { area_id: "kitchen" };
    const withFront = build("houseScene", env);
    expect(named(withFront, "Front door card")).toBeDefined();
    delete env.states!["lock.front_door"];
    const backOnly = build("houseScene", env);
    expect(named(backOnly, "Back door card")).toBeDefined();
    expect(named(backOnly, "Car doors card")).toBeUndefined();
  });

  it("draws a house with dark, untappable windows in a home with no lights", () => {
    const cfg = build("houseScene", { family: "large" });
    expect(cfg.elements.some((e) => e.kind === "tap" && e.payload.attachedTo === undefined)).toBe(false);
    checkDocument(cfg, "houseScene", "large");
  });

  it("builds a floor plan on every tile it is offered that encodes and stays in the tile", () => {
    for (const family of ["medium", "large", "xlarge"] as const) {
      checkDocument(build("floorPlan", { ...home(), family }), "floorPlan", family);
    }
  });

  it("makes a room of every area with a light, busiest first, lit rooms turning off and dark ones on", () => {
    const env = home();
    expect(planRooms(env, 8).map((r) => r.name)).toEqual(["Living room", "Bedroom", "Kitchen"]);
    const cfg = build("floorPlan", env);
    for (const [room, area] of [["Living room", "living"], ["Bedroom", "bedroom"], ["Kitchen", "kitchen"]] as const) {
      const card = named(cfg, `${room} room`)!;
      // Never light.toggle, which flips each light alone and swaps a mixed room.
      expect(attachedTapsOf(cfg, card.payload.id)).toEqual([]);
      const cardFrame = cfg.perFamily.large!.placements[card.payload.id]!.frame;
      for (const [suffix, service, shown] of [["turn off", "turn_off", "show"], ["turn on", "turn_on", "hide"]] as const) {
        const tap = named(cfg, `${room} ${suffix}`)!;
        expect(tap.kind).toBe("tap");
        expect((tap.payload as TapElement).action).toEqual({ type: "callService", serviceDomain: "light", serviceName: service, serviceDataJSON: JSON.stringify({ area_id: area }) });
        expect(cfg.perFamily.large!.placements[tap.payload.id]!.frame).toEqual(cardFrame);
        const table = tableShape(tap.payload.rules);
        if (!table.ok) throw new Error(table.reason);
        expect(table.table.rows[0]!.comparison).toEqual({ kind: "greaterThan", value: { kind: { kind: "literal", value: "0" } } });
        expect(table.table.rows[0]!.changes[0]!.kind).toBe(shown);
      }
    }
    expect(named(cfg, "Living room motion")).toBeDefined();
    expect(named(cfg, "Kitchen motion")).toBeUndefined();
    const temp = named(cfg, "Kitchen temperature");
    expect(temp?.kind === "text" && temp.payload.value.kind).toEqual({ kind: "entityState", entityId: "sensor.kitchen_temperature", displayName: "sensor.kitchen_temperature", domain: "sensor" });
  });

  it("falls back to a room per light, then to four placeholder rooms", () => {
    const noAreas = { ...home(), registry: {} };
    expect(planRooms(noAreas, 6).map((r) => r.light?.entityId))
      .toEqual(["light.bedroom", "light.kitchen", "light.living_ceiling", "light.living_lamp", "light.porch"]);
    const empty = build("floorPlan", { family: "medium" });
    expect(empty.elements.filter((e) => e.payload.name?.endsWith(" room")).map((e) => e.payload.name))
      .toEqual(["Living room", "Kitchen room", "Bedroom room", "Office room"]);
    expect(empty.elements.some((e) => e.kind === "tap" && e.payload.attachedTo !== undefined && e.payload.action.type !== "refresh")).toBe(false);
  });

  it("tiles the plan with cells that never overlap and never leave it", () => {
    const plan = { x: 10, y: 40, w: 320, h: 110 };
    for (let n = 1; n <= 8; n++) {
      const cells = planCells(n, plan);
      expect(cells).toHaveLength(n);
      for (const c of cells) {
        expect(c.x).toBeGreaterThanOrEqual(plan.x);
        expect(c.y).toBeGreaterThanOrEqual(plan.y);
        expect(c.x + c.w).toBeLessThanOrEqual(plan.x + plan.w + 0.01);
        expect(c.y + c.h).toBeLessThanOrEqual(plan.y + plan.h + 0.01);
      }
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = cells[i]!;
          const b = cells[j]!;
          const apart = a.x + a.w <= b.x + 0.01 || b.x + b.w <= a.x + 0.01 || a.y + a.h <= b.y + 0.01 || b.y + b.h <= a.y + 0.01;
          expect(apart, `${n} rooms: ${i} and ${j}`).toBe(true);
        }
      }
    }
  });

  it("stays under the layer cap with the most rooms, each with a thermometer and motion", () => {
    const states: Record<string, HassEntityState> = {};
    const entities: Record<string, { area_id?: string | null }> = {};
    const areas: Record<string, { name?: string | null }> = {};
    for (let i = 0; i < 10; i++) {
      areas[`a${i}`] = { name: `Room ${i}` };
      for (const [id, attrs] of [[`light.l${i}`, {}], [`sensor.t${i}`, { device_class: "temperature" }], [`binary_sensor.m${i}`, { device_class: "motion" }]] as const) {
        states[id] = entity(id, "on", attrs);
        entities[id] = { area_id: `a${i}` };
      }
    }
    for (const family of ["medium", "large", "xlarge"] as const) {
      const cfg = build("floorPlan", { family, states, registry: { entities, areas } });
      expect(cfg.elements.length, family).toBeLessThanOrEqual(presetSpec("floorPlan").layerCount);
      expect(cfg.elements.length, family).toBeLessThanOrEqual(64);
    }
  });
});
