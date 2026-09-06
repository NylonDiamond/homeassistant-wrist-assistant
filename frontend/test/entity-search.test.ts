// The entity field's three decisions that do not need a browser: what the pool
// is, how a search over it is ranked, and what a typed line should store.

import { describe, expect, it } from "vitest";
import { areaLookup, commitTypedEntity, entityChoices, looksLikeEntityId, looksNumeric, searchEntities } from "../src/editors.js";
import type { HassEntityState, HassLike } from "../src/ha-api.js";
import type { EntityRef } from "../src/model.js";

function states(rows: [id: string, friendly: string | undefined, state: string][]): Record<string, HassEntityState> {
  const out: Record<string, HassEntityState> = {};
  for (const [id, friendly, state] of rows) {
    out[id] = {
      entity_id: id,
      state,
      attributes: friendly === undefined ? {} : { friendly_name: friendly },
      last_changed: "",
      last_updated: "",
    };
  }
  return out;
}

const STATES = states([
  ["light.kitchen", "Kitchen light", "on"],
  ["light.kitchen_counter", "Kitchen counter", "off"],
  ["switch.kettle", "Kitchen kettle", "off"],
  ["sensor.outside_temp", "Outside temperature", "12.4"],
  ["camera.porch", "Porch camera", "streaming"],
  ["camera.garage", undefined, "idle"],
]);

const CHOICES = entityChoices(STATES);

describe("entityChoices", () => {
  it("names each entity by its friendly name and carries its state", () => {
    const kitchen = CHOICES.find((c) => c.entityId === "light.kitchen");
    expect(kitchen).toEqual({ entityId: "light.kitchen", name: "Kitchen light", state: "on", domain: "light" });
  });

  it("falls back to the id when Home Assistant has no friendly name", () => {
    expect(CHOICES.find((c) => c.entityId === "camera.garage")?.name).toBe("camera.garage");
  });

  it("is in name order, so an empty search reads alphabetically", () => {
    expect(CHOICES.map((c) => c.name)).toEqual([...CHOICES.map((c) => c.name)].sort((a, b) => a.localeCompare(b)));
  });

  it("keeps only one domain when the field asks for one", () => {
    expect(entityChoices(STATES, "camera").map((c) => c.entityId)).toEqual(["camera.garage", "camera.porch"]);
  });

  it("keeps every domain a preset asks for", () => {
    expect(entityChoices(STATES, ["light", "switch"]).map((c) => c.entityId).sort()).toEqual([
      "light.kitchen", "light.kitchen_counter", "switch.kettle",
    ]);
  });
});

describe("looksNumeric", () => {
  it("accepts a reading a gauge could draw, with or without its unit", () => {
    expect(looksNumeric({ entityId: "sensor.a", name: "A", state: "12.4", domain: "sensor" })).toBe(true);
    expect(looksNumeric({ entityId: "sensor.b", name: "B", state: "40 %", domain: "sensor" })).toBe(true);
  });

  it("rejects a word and an empty state", () => {
    expect(looksNumeric({ entityId: "light.a", name: "A", state: "on", domain: "light" })).toBe(false);
    expect(looksNumeric({ entityId: "light.b", name: "B", state: "", domain: "light" })).toBe(false);
  });
});

describe("searchEntities", () => {
  it("returns everything, in order, for an empty search", () => {
    expect(searchEntities(CHOICES, "  ")).toEqual(CHOICES);
  });

  it("matches friendly names, which is the point of the field", () => {
    expect(searchEntities(CHOICES, "kitchen").map((c) => c.entityId)).toContain("switch.kettle");
  });

  it("puts an exact id first", () => {
    expect(searchEntities(CHOICES, "light.kitchen")[0]?.entityId).toBe("light.kitchen");
  });

  it("prefers a matching id prefix over a matching name", () => {
    const hits = searchEntities(CHOICES, "light.kitchen_c");
    expect(hits[0]?.entityId).toBe("light.kitchen_counter");
  });

  it("is case insensitive", () => {
    expect(searchEntities(CHOICES, "KITCHEN LIGHT")[0]?.entityId).toBe("light.kitchen");
  });

  it("takes several words in any order", () => {
    expect(searchEntities(CHOICES, "temp outside")[0]?.entityId).toBe("sensor.outside_temp");
  });

  it("finds nothing rather than everything for nonsense", () => {
    expect(searchEntities(CHOICES, "zzzz")).toEqual([]);
  });

  it("caps how much it hands back", () => {
    expect(searchEntities(CHOICES, "", 2)).toHaveLength(2);
  });

  it("floats the entities a boost likes without dropping the rest", () => {
    const hits = searchEntities(CHOICES, "", 10, looksNumeric);
    expect(hits[0]?.entityId).toBe("sensor.outside_temp");
    expect(hits).toHaveLength(CHOICES.length);
  });

  it("still lets the better match win over the boost", () => {
    const pool = entityChoices(states([
      ["sensor.kitchen_humidity", "Kitchen humidity", "48"],
      ["light.kitchen", "Kitchen light", "on"],
    ]));
    // A typed id is meant literally, so it wins even against a number.
    expect(searchEntities(pool, "light.kitchen", 10, looksNumeric)[0]?.entityId).toBe("light.kitchen");
    // With only a name to go on, the reading a gauge could draw comes first.
    expect(searchEntities(pool, "kitchen", 10, looksNumeric)[0]?.entityId).toBe("sensor.kitchen_humidity");
  });
});

describe("looksLikeEntityId", () => {
  it("accepts a plain domain and object id", () => {
    expect(looksLikeEntityId("light.kitchen")).toBe(true);
    expect(looksLikeEntityId(" binary_sensor.front_door_2 ")).toBe(true);
  });

  it("rejects half a search", () => {
    expect(looksLikeEntityId("kitchen")).toBe(false);
    expect(looksLikeEntityId("light.")).toBe(false);
    expect(looksLikeEntityId("Kitchen light")).toBe(false);
  });
});

describe("commitTypedEntity", () => {
  const ref: EntityRef = { entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" };

  it("changes nothing when the text is what is already stored", () => {
    expect(commitTypedEntity("light.kitchen", ref, STATES)).toBeUndefined();
  });

  it("keeps a working entity when the text was only a half typed search", () => {
    expect(commitTypedEntity("kitch", ref, STATES)).toBeUndefined();
  });

  it("takes a known id with its friendly name and domain", () => {
    expect(commitTypedEntity("switch.kettle", ref, STATES)).toEqual({ entityId: "switch.kettle", displayName: "Kitchen kettle", domain: "switch" });
  });

  it("still accepts an id Home Assistant does not have", () => {
    expect(commitTypedEntity("light.not_here_yet", ref, STATES)).toEqual({ entityId: "light.not_here_yet", displayName: "Kitchen light", domain: "light" });
  });

  it("clears the entity when the field is emptied", () => {
    expect(commitTypedEntity("   ", ref, STATES)).toEqual({ entityId: "", displayName: "", domain: "" });
  });
});

describe("areaLookup", () => {
  const hass = {
    states: STATES,
    entities: {
      "light.kitchen": { area_id: "kitchen" },
      "light.kitchen_counter": { device_id: "dev1" },
      "switch.kettle": { device_id: "dev_no_area" },
      "camera.porch": {},
    },
    devices: { dev1: { area_id: "kitchen" }, dev_no_area: {} },
    areas: { kitchen: { name: "Kitchen" } },
  } as unknown as HassLike;

  it("reads the entity's own area", () => {
    expect(areaLookup(hass)?.("light.kitchen")).toBe("Kitchen");
  });

  it("falls back to the area of the entity's device", () => {
    expect(areaLookup(hass)?.("light.kitchen_counter")).toBe("Kitchen");
  });

  it("has no area for an entity whose device has none", () => {
    expect(areaLookup(hass)?.("switch.kettle")).toBeUndefined();
    expect(areaLookup(hass)?.("camera.porch")).toBeUndefined();
    expect(areaLookup(hass)?.("sensor.outside_temp")).toBeUndefined();
  });

  it("is absent when the frontend carries no registries", () => {
    expect(areaLookup({ states: STATES } as unknown as HassLike)).toBeUndefined();
  });
});

describe("searching by room", () => {
  const inLounge = entityChoices(STATES, undefined, (id) => (id === "sensor.outside_temp" ? "Lounge" : undefined));

  it("finds an entity by the room it sits in", () => {
    expect(searchEntities(inLounge, "lounge").map((c) => c.entityId)).toEqual(["sensor.outside_temp"]);
  });

  it("ranks a name match above a room match", () => {
    const rooms = entityChoices(STATES, undefined, (id) => (id === "camera.garage" ? "Kitchen" : undefined));
    const ids = searchEntities(rooms, "kitchen").map((c) => c.entityId);
    expect(ids[ids.length - 1]).toBe("camera.garage");
    expect(ids).toContain("light.kitchen");
  });

  it("leaves the choice without an area key when no room is known", () => {
    expect(entityChoices(STATES)[0]).not.toHaveProperty("area");
  });
});
