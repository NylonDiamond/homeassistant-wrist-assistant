// The watch's status page rules, ported by hand from watch-only Swift
// (`StatusPageSnippetView`, `StatusRowConfig`), against the case files the
// app writes from Swift (`fixtures-status-pages/rules`), and the preview fill
// of each of the five system pages against one fixed set of states.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject } from "../src/watch-pages/model.js";
import { statusPagesDefaults, statusPagesOf } from "../src/watch-status-pages/model.js";
import {
  type StatusEntityState,
  STATUS_PAGE_RULES,
  activeLabel,
  climateTemperatureText,
  coverValue,
  effectiveFilterState,
  fetchedStatusStates,
  formatStatusValue,
  groupCountValue,
  matchesFilterState,
  maxValueLabel,
  parseSwiftDouble,
  readStatusRow,
  roundHalfAway,
  roundedNumericText,
  stateOptions,
  statusColorName,
  statusFetchPlan,
  statusPageFill,
  statusPreviewRows,
  statusTwoColumnItems,
  swiftCapitalized,
} from "../src/watch-status-pages/rules.js";

const RULES_DIR = join(__dirname, "fixtures-status-pages", "rules");

function cases<T>(file: string): T[] {
  return (JSON.parse(readFileSync(join(RULES_DIR, file), "utf8")) as { cases: T[] }).cases;
}

describe("the case files", () => {
  it("are the five the rules table names", () => {
    expect((STATUS_PAGE_RULES as unknown as { cases: string[] }).cases).toEqual([
      "rules/match-filter-state.json",
      "rules/cover-value.json",
      "rules/capitalized.json",
      "rules/numeric-rounding.json",
      "rules/fetch-plan.json",
    ]);
  });
});

describe("matchesFilterState (match-filter-state.json)", () => {
  const all = cases<{ domain: string; filterState: string | null; token: string; matching: string[]; notMatching: string[] }>("match-filter-state.json");

  it("has cases", () => {
    expect(all.length).toBeGreaterThan(100);
  });

  for (const c of all) {
    it(`${c.domain}, filter ${c.filterState ?? "default"}`, () => {
      const row = { domain: c.domain, ...(c.filterState === null ? {} : { filterState: c.filterState }) };
      expect(effectiveFilterState(row)).toBe(c.token);
      for (const state of c.matching) expect(matchesFilterState(row, state), `${state} should match`).toBe(true);
      for (const state of c.notMatching) expect(matchesFilterState(row, state), `${state} should not match`).toBe(false);
    });
  }
});

describe("coverValue (cover-value.json)", () => {
  for (const c of cases<{ state: string; position: number | null; value: string }>("cover-value.json")) {
    it(`${JSON.stringify(c.state)} at ${String(c.position)} is ${c.value}`, () => {
      expect(coverValue(c.state, c.position)).toBe(c.value);
    });
  }
});

describe("String.capitalized (capitalized.json)", () => {
  for (const c of cases<{ input: string; value: string }>("capitalized.json")) {
    it(`${JSON.stringify(c.input)} is ${JSON.stringify(c.value)}`, () => {
      expect(swiftCapitalized(c.input)).toBe(c.value);
    });
  }
});

describe("numeric rounding (numeric-rounding.json)", () => {
  for (const c of cases<{ state: string; value: string; parses: boolean }>("numeric-rounding.json")) {
    it(`${JSON.stringify(c.state)} reads ${JSON.stringify(c.value)}`, () => {
      expect(parseSwiftDouble(c.state) !== undefined).toBe(c.parses);
      expect(roundedNumericText(c.state, true)).toBe(c.value);
      // Round Numbers off: the state as written.
      expect(roundedNumericText(c.state, false)).toBe(c.state);
    });
  }

  it("rounds halves away from zero, unlike Math.round", () => {
    expect(roundHalfAway(2.5)).toBe(3);
    expect(roundHalfAway(-2.5)).toBe(-3);
    expect(roundHalfAway(0.49999999999999994)).toBe(0);
    expect(Math.round(-2.5)).toBe(-2);
  });

  it("shows inf, nan and numbers past Int as written, where the watch would trap", () => {
    for (const s of ["inf", "-inf", "infinity", "nan", "NaN", "1e300", "-9.3e18"]) expect(roundedNumericText(s, true)).toBe(s);
    expect(roundedNumericText("9e18", true)).toBe("9000000000000000000");
  });

  it("parses Swift's other forms", () => {
    expect(parseSwiftDouble("0x1.8p1")).toBe(3);
    expect(parseSwiftDouble("-0x10")).toBe(-16);
    expect(parseSwiftDouble("1e")).toBeUndefined();
    expect(parseSwiftDouble("0x")).toBeUndefined();
    expect(parseSwiftDouble(".")).toBeUndefined();
  });
});

describe("statusFetchPlan (fetch-plan.json)", () => {
  for (const c of cases<{ name: string; rows: JsonObject[]; customEntityIds: string[]; fetchDomains: Record<string, string[] | null> }>("fetch-plan.json")) {
    it(c.name, () => {
      const plan = statusFetchPlan(c.rows.map(readStatusRow));
      expect(plan.customEntityIds).toEqual(c.customEntityIds);
      expect(plan.fetchDomains).toEqual(c.fetchDomains);
    });
  }
});

describe("the values a row shows", () => {
  const s = (state: string, attributes: Record<string, unknown> = {}): StatusEntityState => ({ state, attributes });

  it("says N/A with no state", () => {
    expect(formatStatusValue(undefined, "light", true)).toBe("N/A");
  });

  it("names locks, alarm panels and the on/off domains in the table's words", () => {
    expect(formatStatusValue(s("locked"), "lock", true)).toBe("Locked");
    expect(formatStatusValue(s("jammed"), "lock", true)).toBe("Unlocked");
    expect(formatStatusValue(s("armed_custom_bypass"), "alarm_control_panel", true)).toBe("Custom Bypass");
    expect(formatStatusValue(s("triggered"), "alarm_control_panel", true)).toBe("Triggered!");
    expect(formatStatusValue(s("weird"), "alarm_control_panel", true)).toBe("Disarmed");
    expect(formatStatusValue(s("on"), "fan", true)).toBe("On");
    expect(formatStatusValue(s("unavailable"), "switch", true)).toBe("Off");
  });

  it("writes a climate entity's current temperature, rounded or to one decimal", () => {
    expect(formatStatusValue(s("heat", { current_temperature: 21.5 }), "climate", true)).toBe("22°");
    expect(formatStatusValue(s("heat", { current_temperature: 21.5, unit_of_measurement: "°C" }), "climate", false)).toBe("21.5°C");
    expect(formatStatusValue(s("heat", { current_temperature: 21 }), "climate", false)).toBe("21°");
    expect(formatStatusValue(s("heat_cool"), "climate", true)).toBe("Heat_Cool");
    // %.1f takes the even digit on an exact tie, toFixed the larger one.
    expect(climateTemperatureText(20.25, false)).toBe("20.2");
    expect(climateTemperatureText(20.75, false)).toBe("20.8");
    expect(climateTemperatureText(-20.25, false)).toBe("-20.2");
    expect(climateTemperatureText(-2.5, true)).toBe("-3");
  });

  it("writes covers and valves from their position", () => {
    expect(formatStatusValue(s("open", { current_position: 52 }), "cover", true)).toBe("52%");
    expect(formatStatusValue(s("open", { current_position: 52.5 }), "valve", true)).toBe("Open");
  });

  it("writes other states with their unit, else in words, else rounded", () => {
    expect(formatStatusValue(s("21.6", { unit_of_measurement: "°C" }), "sensor", true)).toBe("22°C");
    expect(formatStatusValue(s("45.5", { unit_of_measurement: "%" }), "sensor", true)).toBe("46%");
    expect(formatStatusValue(s("1200.4", { unit_of_measurement: "W" }), "sensor", false)).toBe("1200.4 W");
    expect(formatStatusValue(s("on", { unit_of_measurement: "" }), "binary_sensor", true)).toBe("On");
    expect(formatStatusValue(s("not_home"), "person", true)).toBe("Away");
    expect(formatStatusValue(s("Unknown"), "sensor", true)).toBe("N/A");
    expect(formatStatusValue(s("3.5"), "input_number", true)).toBe("4");
    expect(formatStatusValue(s("zone_a"), "person", true)).toBe("zone_a");
  });

  it("colors by domain and state", () => {
    expect(statusColorName("lock", "locked")).toBe("green");
    expect(statusColorName("lock", undefined)).toBe("orange");
    expect(statusColorName("alarm_control_panel", "disarmed")).toBe("orange");
    expect(statusColorName("alarm_control_panel", "armed_away")).toBe("green");
    expect(statusColorName("light", "on")).toBe("yellow");
    expect(statusColorName("light", undefined)).toBe("gray");
    expect(statusColorName("cover", "opening")).toBe("orange");
    expect(statusColorName("cover", "stopped")).toBe("secondary");
    expect(statusColorName("climate", "off")).toBe("cyan");
    expect(statusColorName("sensor", "on")).toBe("secondary");
  });

  it("offers each domain's Show State choices, a single binary sensor class in its own words", () => {
    expect(stateOptions("lock").map((o) => o.value)).toEqual(["locked", "unlocked"]);
    expect(stateOptions("binary_sensor", ["door"])).toEqual([{ value: "on", label: "Open" }, { value: "off", label: "Closed" }]);
    expect(stateOptions("binary_sensor", ["door", "window"]).map((o) => o.label)).toEqual(["On", "Off"]);
    expect(stateOptions("media_player").map((o) => o.label)).toEqual(["On", "Off"]);
    expect(maxValueLabel(["battery"])).toBe("Max value (%)");
    expect(maxValueLabel(["energy"])).toBe("Max value");
    expect(maxValueLabel(undefined)).toBe("Max value");
    expect(activeLabel("person")).toBe("home");
  });
});

describe("group counts", () => {
  const states: Record<string, StatusEntityState> = {
    "light.a": { state: "on" },
    "light.b": { state: "off" },
    "light.c": { state: "ON" },
    "sensor.x": { state: "12" },
    "sensor.y": { state: "40" },
    "sensor.z": { state: "unavailable" },
  };

  it("counts the entities whose state matches, with the domain's word", () => {
    const row = readStatusRow({ rowType: "groupCount", domain: "light", groupEntityIds: ["light.a", "light.b", "light.c", "light.gone"] });
    expect(groupCountValue(row, states)).toBe("2 on");
    expect(groupCountValue({ ...row, filterState: "off" }, states)).toBe("1 off");
  });

  it("counts sensors at or below the max value as low", () => {
    const row = readStatusRow({ rowType: "groupCount", domain: "sensor", maxNumericValue: 20, groupEntityIds: ["sensor.x", "sensor.y", "sensor.z"] });
    expect(groupCountValue(row, states)).toBe("1 low");
  });
});

/** One fixed set of states, as `hass.states` holds them. */
const STATES: Record<string, StatusEntityState> = {
  "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen" } },
  "light.porch": { state: "off", attributes: { friendly_name: "Porch" } },
  "light.office": { state: "on", attributes: {} },
  "person.jesse": { state: "home", attributes: { friendly_name: "Jesse" } },
  "person.chen": { state: "not_home", attributes: { friendly_name: "Chen" } },
  "sensor.living_temperature": { state: "21.56", attributes: { friendly_name: "Living Room", device_class: "temperature", unit_of_measurement: "°C" } },
  "sensor.attic_temperature": { state: "unavailable", attributes: { friendly_name: "Attic", device_class: "temperature", unit_of_measurement: "°C" } },
  "sensor.living_humidity": { state: "40", attributes: { friendly_name: "Living Humidity", device_class: "humidity", unit_of_measurement: "%" } },
  "sensor.door_battery": { state: "15", attributes: { friendly_name: "Door Battery", device_class: "battery", unit_of_measurement: "%" } },
  "sensor.remote_battery": { state: "80", attributes: { friendly_name: "Remote Battery", device_class: "battery", unit_of_measurement: "%" } },
  "sensor.phone_battery": { state: "19.5", attributes: { friendly_name: "Phone Battery", device_class: "battery", unit_of_measurement: "%" } },
  "binary_sensor.front_door": { state: "on", attributes: { friendly_name: "Front Door", device_class: "door" } },
  "binary_sensor.back_door": { state: "off", attributes: { friendly_name: "Back Door", device_class: "door" } },
  "binary_sensor.bedroom_window": { state: "on", attributes: { friendly_name: "Bedroom Window", device_class: "window" } },
  "binary_sensor.hall_motion": { state: "on", attributes: { friendly_name: "Hall Motion", device_class: "motion" } },
  "binary_sensor.garage": { state: "on", attributes: { device_class: "garage_door" } },
};

describe("the preview fill of the five system pages", () => {
  const pages = statusPagesOf(statusPagesDefaults());
  const fill = (name: string) => {
    const page = pages.find((p) => p.name === name)!;
    return statusPageFill(page, STATES).map((r) => [r.label, r.value, r.color]);
  };

  it("are the five", () => {
    expect(pages.map((p) => p.name)).toEqual(["Lights", "Who's Home", "Room Temps", "Doors & Windows", "Low Battery"]);
  });

  it("Lights: the lights that are on, by id, named by friendly name else id", () => {
    expect(fill("Lights")).toEqual([["Kitchen", "On", "yellow"], ["office", "On", "yellow"]]);
  });

  it("Who's Home: the people home", () => {
    expect(fill("Who's Home")).toEqual([["Jesse", "Home", "secondary"]]);
  });

  it("Room Temps: every temperature sensor whatever its state, rounded with its unit (the unit comes before the words, so unavailable keeps it)", () => {
    expect(fill("Room Temps")).toEqual([["Attic", "unavailable°C", "secondary"], ["Living Room", "22°C", "secondary"]]);
  });

  it("Doors & Windows: the openings that are open, of the four classes", () => {
    expect(fill("Doors & Windows")).toEqual([
      ["Bedroom Window", "On", "secondary"],
      ["Front Door", "On", "secondary"],
      ["garage", "On", "secondary"],
    ]);
  });

  it("Low Battery: batteries at or below 20, whatever their state otherwise", () => {
    expect(fill("Low Battery")).toEqual([["Door Battery", "15%", "secondary"], ["Phone Battery", "20%", "secondary"]]);
  });
});

describe("the rows the watch draws", () => {
  const rows = [
    { id: "H1", rowType: "sectionHeader", displayName: "Security", domain: "", entityId: "", iconName: "line.horizontal.3", headerAlignment: "center" },
    { id: "E1", rowType: "entity", displayName: "Kitchen light", domain: "light", entityId: "light.kitchen", iconName: "lightbulb.fill" },
    { id: "E2", rowType: "entity", displayName: "Hidden", domain: "light", entityId: "light.porch", iconName: "lightbulb.fill", isHidden: true },
    { id: "G1", rowType: "groupCount", displayName: "Lights", domain: "light", entityId: "", iconName: "lightbulb.fill", groupEntityIds: ["light.kitchen", "light.porch", "light.office"] },
    { id: "D1", rowType: "dynamicList", displayName: "Picked", domain: "binary_sensor", entityId: "", iconName: "door.left.hand.open", dynamicMode: "specific", groupEntityIds: ["binary_sensor.back_door", "binary_sensor.front_door", "binary_sensor.none"], showAllStates: true },
    { id: "H2", rowType: "sectionHeader", displayName: "gone", domain: "", entityId: "", iconName: "", isHidden: true },
    { id: "E3", rowType: "entity", displayName: "Nobody", domain: "light", entityId: "light.none", iconName: "lightbulb.fill" },
  ].map((r) => readStatusRow(r));

  it("skips hidden rows, uppercases headers and turns a list into entity rows in its order", () => {
    const out = statusPreviewRows(rows, STATES, true);
    expect(out.map((r) => [r.kind, r.rowId, r.label, r.value, r.align])).toEqual([
      ["sectionHeader", "H1", "SECURITY", "", "center"],
      ["entity", "E1", "Kitchen light", "On", undefined],
      ["groupCount", "G1", "Lights", "2 on", undefined],
      ["entity", "D1", "Back Door", "Off", undefined],
      ["entity", "D1", "Front Door", "On", undefined],
      ["entity", "E3", "Nobody", "N/A", undefined],
    ]);
  });

  it("pairs rows in two columns, a lone row before a header or at the end on the left", () => {
    const out = statusPreviewRows(rows, STATES, true);
    const items = statusTwoColumnItems(out);
    expect(items.map((i) => (i.kind === "header" ? `H:${i.row.rowId}` : `P:${i.first.rowId}+${i.second?.rowId ?? "-"}`))).toEqual([
      "H:H1",
      "P:E1+G1",
      "P:D1+D1",
      "P:E3+-",
    ]);
    const lone = statusTwoColumnItems([out[1]!, out[0]!, out[2]!]);
    expect(lone.map((i) => i.kind)).toEqual(["pair", "header", "pair"]);
  });

  it("fetches as the watch does: a list of all matching sees only its domain's classes asked", () => {
    const plan = statusFetchPlan([readStatusRow({ rowType: "dynamicList", domain: "binary_sensor", dynamicMode: "all", deviceClassFilter: ["door"] })]);
    expect(Object.keys(fetchedStatusStates(plan, STATES)).sort()).toEqual(["binary_sensor.back_door", "binary_sensor.front_door"]);
    const whole = statusFetchPlan([readStatusRow({ rowType: "dynamicList", domain: "binary_sensor", dynamicMode: "all", deviceClassFilter: [] })]);
    expect(Object.keys(fetchedStatusStates(whole, STATES)).length).toBe(5);
  });

  it("reads Round Numbers off from the page", () => {
    const page = { roundNumericValues: false, rows: [{ id: "S", rowType: "entity", domain: "sensor", entityId: "sensor.living_temperature", displayName: "T", iconName: "" }] };
    expect(statusPageFill(page, STATES)[0]!.value).toBe("21.56°C");
  });
});
