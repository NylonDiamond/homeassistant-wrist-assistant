import { describe, expect, it } from "vitest";
import {
  canSeedStates,
  seedEntityOf,
  seedStates,
  seedStatesRows,
} from "../src/states-seeds.js";
import { CURATED_SYMBOLS } from "../src/symbols.js";
import { literal, timelineStateColor } from "../src/model.js";

const DOMAINS = [
  "light", "switch", "fan", "input_boolean", "binary_sensor", "cover", "lock",
  "media_player", "climate", "vacuum", "alarm_control_panel", "person",
  "device_tracker", "weather",
];

const both = { icon: true, color: true };

describe("the states seed table", () => {
  it("covers every domain the plan names", () => {
    for (const domain of DOMAINS) {
      expect(canSeedStates(domain), domain).toBe(true);
    }
  });

  it("says nothing for a domain whose states are not a fixed list", () => {
    for (const domain of ["sensor", "number", "input_number", "camera", "", "not_a_domain"]) {
      expect(seedStates(domain), domain).toEqual([]);
      expect(canSeedStates(domain), domain).toBe(false);
    }
  });

  // An invented name is a placeholder box on the watch with no warning, so the
  // whole table is pinned to the list that was checked against the real set.
  it("only ever names a symbol the picker knows", () => {
    for (const domain of DOMAINS) {
      for (const dc of ["", "door", "motion", "smoke", "battery", "connectivity", "plug"]) {
        for (const seed of seedStates(domain, dc)) {
          expect(CURATED_SYMBOLS, `${domain}/${dc} ${seed.state}`).toContain(seed.symbol);
        }
      }
    }
  });

  it("writes every color as a plain hex", () => {
    for (const domain of DOMAINS) {
      for (const seed of seedStates(domain)) {
        expect(seed.colorHex, `${domain} ${seed.state}`).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  it("ends every table with the no-reading row", () => {
    for (const domain of DOMAINS) {
      const rows = seedStates(domain);
      expect(rows[rows.length - 1]!.state, domain).toBe("unavailable");
      expect(rows[rows.length - 1]!.colorHex, domain).toBe(timelineStateColor("unavailable"));
    }
  });

  it("keeps the timeline's colors wherever it names the same state", () => {
    const cover = seedStates("cover");
    expect(cover.map((s) => s.state)).toEqual(["open", "closed", "opening", "closing", "unavailable"]);
    expect(cover[0]!.colorHex).toBe(timelineStateColor("open"));
    expect(cover[1]!.colorHex).toBe(timelineStateColor("closed"));
  });

  it("names the states the recorder holds, not the ones the frontend prints", () => {
    // A door-shaped binary sensor is `on` while it stands open. A table seeded
    // with `open` would match nothing at all.
    const door = seedStates("binary_sensor", "door");
    expect(door.map((s) => s.state)).toEqual(["on", "off", "unavailable"]);
    expect(door[0]!.colorHex).toBe(timelineStateColor("open"));
    expect(door[1]!.colorHex).toBe(timelineStateColor("closed"));
    expect(door[0]!.symbol).toBe("door.left.hand.open");
  });

  it("gives an unknown device class the plain on and off pair", () => {
    expect(seedStates("binary_sensor", "nonsense").map((s) => s.symbol))
      .toEqual(["circle.fill", "circle", "questionmark.circle.fill"]);
  });

  it("flips the colors where on is the good news", () => {
    const wifi = seedStates("binary_sensor", "connectivity");
    expect(wifi[0]!.colorHex).toBe(timelineStateColor("closed"));
    expect(wifi[1]!.colorHex).toBe(timelineStateColor("open"));
  });

  it("takes an on/off domain's symbols from the pair a toggle already draws", () => {
    expect(seedStates("light").map((s) => s.symbol))
      .toEqual(["lightbulb.fill", "lightbulb", "questionmark.circle.fill"]);
  });

  it("lists the climate modes and the alarm states", () => {
    expect(seedStates("climate").map((s) => s.state))
      .toEqual(["heat", "cool", "heat_cool", "dry", "fan_only", "auto", "off", "unavailable"]);
    expect(seedStates("alarm_control_panel").map((s) => s.state)).toContain("triggered");
    expect(seedStates("media_player").map((s) => s.state)).toContain("playing");
    expect(seedStates("vacuum").map((s) => s.state)).toContain("docked");
    expect(seedStates("person").map((s) => s.state)).toEqual(["home", "not_home", "unavailable"]);
  });

  it("lists the weather conditions Home Assistant writes", () => {
    const states = seedStates("weather").map((s) => s.state);
    for (const word of ["sunny", "clear-night", "partlycloudy", "cloudy", "fog", "rainy",
      "pouring", "lightning", "lightning-rainy", "snowy", "snowy-rainy", "hail", "windy",
      "windy-variant", "exceptional"]) {
      expect(states, word).toContain(word);
    }
  });

  it("is case and space insensitive about the domain and the class", () => {
    expect(seedStates("  Cover ")).toEqual(seedStates("cover"));
    expect(seedStates("binary_sensor", " DOOR ")).toEqual(seedStates("binary_sensor", "door"));
  });
});

describe("the rows a fill writes", () => {
  it("matches each state by the word itself", () => {
    const rows = seedStatesRows(seedStates("cover"), both);
    expect(rows[0]!.comparison).toEqual({ kind: "equals", value: literal("open") });
  });

  it("catches unknown as well as unavailable in the last row", () => {
    const rows = seedStatesRows(seedStates("lock"), both);
    expect(rows[rows.length - 1]!.comparison).toEqual({ kind: "isUnavailable" });
  });

  it("writes an icon and a color cell per row", () => {
    const rows = seedStatesRows(seedStates("lock"), both);
    expect(rows[0]!.changes).toEqual([
      { kind: "setIcon", value: literal("lock.fill") },
      { kind: "setColor", value: literal(timelineStateColor("locked")) },
    ]);
  });

  it("writes only the cells this kind of layer reads", () => {
    const shape = seedStatesRows(seedStates("lock"), { icon: false, color: true });
    expect(shape[0]!.changes.map((c) => c.kind)).toEqual(["setColor"]);
    const icons = seedStatesRows(seedStates("lock"), { icon: true, color: false });
    expect(icons[0]!.changes.map((c) => c.kind)).toEqual(["setIcon"]);
  });

  it("mints no ids, so the table gives every row its own", () => {
    for (const row of seedStatesRows(seedStates("cover"), both)) {
      expect(row.caseId).toBeUndefined();
      expect(row.testId).toBeUndefined();
    }
  });
});

describe("the entity a fill reads", () => {
  it("takes the domain off an entity state value", () => {
    expect(seedEntityOf({ kind: { kind: "entityState", entityId: "cover.garage", displayName: "Garage", domain: "cover" } }))
      .toEqual({ entityId: "cover.garage", domain: "cover" });
  });

  it("falls back to the half before the dot", () => {
    expect(seedEntityOf({ kind: { kind: "entityState", entityId: "lock.front", displayName: "Front", domain: "" } }))
      .toEqual({ entityId: "lock.front", domain: "lock" });
  });

  it("has nothing to say about a template, an attribute or a literal", () => {
    expect(seedEntityOf(literal("21"))).toBeUndefined();
    expect(seedEntityOf({ kind: { kind: "jinja", value: "{{ 1 }}" } })).toBeUndefined();
    expect(seedEntityOf({ kind: { kind: "entityAttribute", entityId: "climate.hall", displayName: "Hall", domain: "climate", attribute: "temperature" } }))
      .toBeUndefined();
    expect(seedEntityOf(undefined)).toBeUndefined();
  });
});
