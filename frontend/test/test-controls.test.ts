// The control each entity's test value gets under the preview.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import { type Element, literal, newConfig, newElement } from "../src/model.js";
import { sharedTestKey, testableSharedValues, testControlFor, testedNamedValues } from "../src/test-controls.js";

function st(state: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: "x", state, attributes, last_changed: "", last_updated: "" };
}

describe("testControlFor", () => {
  it("gives a switch its two words, then the states any entity can fall into", () => {
    expect(testControlFor("switch.tv", st("on"))).toEqual({ kind: "choice", options: ["on", "off", "unavailable", "unknown"] });
  });

  it("reads a select's own options and keeps a state the list lacks", () => {
    expect(testControlFor("input_select.mode", st("away", { options: ["home", "night"] })))
      .toEqual({ kind: "choice", options: ["home", "night", "away", "unavailable", "unknown"] });
  });

  it("reads a climate entity's own modes", () => {
    expect(testControlFor("climate.hall", st("heat", { hvac_modes: ["off", "heat"] })))
      .toEqual({ kind: "choice", options: ["off", "heat", "unavailable", "unknown"] });
  });

  it("keeps the value being tried in the list", () => {
    expect(testControlFor("media_player.tv", st("idle"), "buffering")).toMatchObject({ options: expect.arrayContaining(["buffering"]) });
  });

  it("uses a number entity's own range and step", () => {
    expect(testControlFor("input_number.x", st("3", { min: 1, max: 9, step: 0.5 }))).toEqual({ kind: "number", min: 1, max: 9, step: 0.5 });
  });

  it("puts a percentage on 0 to 100", () => {
    expect(testControlFor("sensor.fuel", st("42", { unit_of_measurement: "%" }))).toEqual({ kind: "number", min: 0, max: 100, step: 1 });
  });

  it("gives a plain reading room to double, in the reading's own precision", () => {
    expect(testControlFor("sensor.volts", st("121.5", { unit_of_measurement: "V" }))).toEqual({ kind: "number", min: 0, max: 250, step: 0.1 });
  });

  it("lets a temperature go below zero", () => {
    expect(testControlFor("sensor.out", st("21.5", { unit_of_measurement: "°C" }))).toEqual({ kind: "number", min: -50, max: 50, step: 0.1 });
  });

  it("still slides a numeric sensor that has dropped off", () => {
    expect(testControlFor("sensor.volts", st("unavailable", { unit_of_measurement: "V" }))).toEqual({ kind: "number", min: 0, max: 10, step: 1 });
  });

  it("stretches the range to reach a typed test value", () => {
    expect(testControlFor("sensor.fuel", st("42", { unit_of_measurement: "%" }), "130")).toMatchObject({ min: 0, max: 130 });
    expect(testControlFor("sensor.fuel", st("42", { unit_of_measurement: "%" }), "-5")).toMatchObject({ min: -5, max: 100 });
  });

  it("falls back to a text box for words", () => {
    expect(testControlFor("sensor.moon", st("waxing_crescent"))).toEqual({ kind: "text" });
  });

  it("slides a shared value that holds a number", () => {
    expect(testControlFor(sharedTestKey("a"), st("66"))).toEqual({ kind: "number", min: 0, max: 200, step: 1 });
  });
});

describe("shared values under the preview", () => {
  function doc() {
    const cfg = newConfig("T", 0);
    cfg.values.push(
      { id: "A", name: "read", value: { kind: { kind: "literal", value: "66" }, format: { decimals: 2 } } },
      { id: "B", name: "unused", value: literal("1") },
      { id: "C", name: "entity", value: { kind: { kind: "entityState", entityId: "sensor.v", displayName: "", domain: "sensor" } } },
    );
    for (const id of ["A", "C"]) {
      const el = newElement("text") as Extract<Element, { kind: "text" }>;
      el.payload.value = { kind: { kind: "named", id } };
      cfg.elements.push(el);
    }
    return cfg;
  }

  it("lists the ones a layer reads, but not one that is an entity's own row", () => {
    expect(testableSharedValues(doc()).map((n) => n.id)).toEqual(["A"]);
  });

  it("stands a tried value in for the source and keeps the shared value's format", () => {
    const cfg = doc();
    const tried = testedNamedValues(cfg.values, new Map([[sharedTestKey("a"), "90"]]));
    expect(tried[0]!.value).toEqual({ kind: { kind: "literal", value: "90" }, format: { decimals: 2 } });
    expect(tried[1]).toBe(cfg.values[1]);
    expect(testedNamedValues(cfg.values, new Map())).toBe(cfg.values);
  });
});
