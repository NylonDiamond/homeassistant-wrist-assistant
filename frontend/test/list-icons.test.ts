// The item glyph tables, pinned against the modules they were copied from.
//
// `list-icons.ts` writes the panel's states vocabulary and the presets' toggle
// symbols out longhand, because importing them into the resolver would close a
// loop through the renderer. Copied data drifts, so every row is checked here
// against the module it came from: change one and this test names it.

import { describe, expect, it } from "vitest";
import { CALENDAR_ITEM_ICON, TODO_ITEM_ICON, UNKNOWN_ITEM_ICON, entityItemIcon, forecastItemIcon } from "../src/list-icons.js";
import { seedStates } from "../src/states-seeds.js";
import { toggleSymbols } from "../src/presets.js";
import { CURATED_SYMBOLS } from "../src/symbols.js";

/** The symbol the seeded states table holds for one state, or undefined when
 * the table does not name that state. */
function seeded(domain: string, deviceClass: string, state: string): string | undefined {
  return seedStates(domain, deviceClass).find((s) => s.state === state)?.symbol;
}

const WEATHER_CONDITIONS = seedStates("weather").map((s) => s.state).filter((s) => s !== "unavailable");

const BINARY_CLASSES = [
  "door", "garage_door", "opening", "window", "motion", "occupancy", "presence", "moisture",
  "smoke", "gas", "carbon_monoxide", "problem", "safety", "battery", "lock", "plug", "power",
  "connectivity", "sound", "running", "update",
];

const STATE_DOMAINS: [string, string[]][] = [
  ["cover", ["open", "closed", "opening", "closing"]],
  ["lock", ["locked", "unlocked", "jammed"]],
  ["media_player", ["playing", "paused", "idle", "standby", "off"]],
  ["climate", ["heat", "cool", "heat_cool", "dry", "fan_only", "auto", "off"]],
  ["vacuum", ["cleaning", "returning", "docked", "idle", "error"]],
  ["alarm_control_panel", ["disarmed", "armed_home", "armed_away", "armed_night", "armed_vacation", "arming", "pending", "triggered"]],
  ["person", ["home", "not_home"]],
  ["device_tracker", ["home", "not_home"]],
];

describe("the forecast table", () => {
  it("has a row for every condition the states seeds name", () => {
    expect(WEATHER_CONDITIONS.length).toBeGreaterThan(10);
    for (const condition of WEATHER_CONDITIONS) {
      expect(forecastItemIcon(condition), condition).toBe(seeded("weather", "", condition));
    }
  });

  it("falls back for a condition nothing names", () => {
    expect(forecastItemIcon("meteor-shower")).toBe(UNKNOWN_ITEM_ICON);
  });
});

describe("the entity table", () => {
  it("agrees with the toggle symbols on the plainly on-and-off domains", () => {
    for (const domain of ["light", "switch", "fan", "input_boolean"]) {
      const pair = toggleSymbols({ entityId: `${domain}.seed`, displayName: "", domain });
      expect(entityItemIcon(domain, "", "on"), domain).toBe(pair.on);
      expect(entityItemIcon(domain, "", "off"), domain).toBe(pair.off);
    }
  });

  it("agrees with the states seeds on every binary sensor class", () => {
    for (const deviceClass of [...BINARY_CLASSES, "", "nonesuch"]) {
      expect(entityItemIcon("binary_sensor", deviceClass, "on"), deviceClass).toBe(seeded("binary_sensor", deviceClass, "on"));
      expect(entityItemIcon("binary_sensor", deviceClass, "off"), deviceClass).toBe(seeded("binary_sensor", deviceClass, "off"));
    }
  });

  it("agrees with the states seeds on every domain that names its states", () => {
    for (const [domain, states] of STATE_DOMAINS) {
      for (const state of states) {
        expect(entityItemIcon(domain, "", state), `${domain}.${state}`).toBe(seeded(domain, "", state));
      }
    }
  });

  it("reads a weather entity's state as a condition", () => {
    expect(entityItemIcon("weather", "", "partlycloudy")).toBe("cloud.sun.fill");
  });

  it("falls back to the domain for a state the domain does not name", () => {
    expect(entityItemIcon("scene", "", "2026-09-15T09:00:00+00:00")).toBe("sparkles");
    expect(entityItemIcon("script", "", "on")).toBe("play.fill");
  });

  it("falls back to a dot for a domain nothing names", () => {
    expect(entityItemIcon("sensor", "", "21.5")).toBe("circle");
    expect(entityItemIcon("nonesuch", "", "active")).toBe("circle.fill");
  });

  it("says so when an entity is not reporting", () => {
    for (const state of ["unavailable", "unknown", ""]) {
      expect(entityItemIcon("light", "", state), state).toBe(UNKNOWN_ITEM_ICON);
    }
  });
});

describe("every glyph a list can draw", () => {
  it("is a symbol the watch and the panel both have", () => {
    // `checklist` is the wire contract's glyph for a to-do item and a real SF
    // Symbol, but it is not in the picker's curated catalogue: the catalogue is
    // what the symbol picker offers, not what the panel can draw, and the
    // Cupertino icon set resolves any SF name. So it is named here rather than
    // checked against the catalogue.
    expect(TODO_ITEM_ICON).toBe("checklist");
    const names = new Set<string>([CALENDAR_ITEM_ICON, UNKNOWN_ITEM_ICON]);
    for (const condition of WEATHER_CONDITIONS) names.add(forecastItemIcon(condition));
    for (const deviceClass of BINARY_CLASSES) {
      names.add(entityItemIcon("binary_sensor", deviceClass, "on"));
      names.add(entityItemIcon("binary_sensor", deviceClass, "off"));
    }
    for (const [domain, states] of STATE_DOMAINS) for (const state of states) names.add(entityItemIcon(domain, "", state));
    for (const domain of ["light", "switch", "fan", "input_boolean", "siren", "humidifier", "valve", "automation", "script", "scene", "group", "sensor"]) {
      names.add(entityItemIcon(domain, "", "on"));
      names.add(entityItemIcon(domain, "", "off"));
    }
    const curated = new Set(CURATED_SYMBOLS);
    expect([...names].filter((n) => !curated.has(n))).toEqual([]);
  });
});
