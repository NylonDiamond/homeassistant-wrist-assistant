// The line the value chip shows. It stands in for the whole form, so it has to
// name things the way the user named them: friendly names, not entity ids, and
// a named value's own name rather than the eight characters of its id.

import { describe, expect, it } from "vitest";
import { describeFormat, describeValue } from "../src/editors.js";
import type { NamedValue, Value } from "../src/model.js";
import type { HassLike } from "../src/ha-api.js";

function hassWith(states: Record<string, { state: string; friendly?: string }>): HassLike {
  const out: HassLike["states"] = {};
  for (const [id, s] of Object.entries(states)) {
    out[id] = {
      entity_id: id,
      state: s.state,
      attributes: s.friendly === undefined ? {} : { friendly_name: s.friendly },
      last_changed: "",
      last_updated: "",
    };
  }
  return { states: out } as HassLike;
}

const HASS = hassWith({ "light.kitchen": { state: "on", friendly: "Kitchen light" } });

const named: NamedValue[] = [{ id: "a1b2c3d4e5", name: "Front door", value: { kind: { kind: "literal", value: "x" } } }];

const entity = (entityId: string, displayName = ""): Value => ({
  kind: { kind: "entityState", entityId, displayName, domain: entityId.split(".")[0] ?? "" },
});

describe("describeValue", () => {
  it("quotes fixed text and marks an empty one", () => {
    expect(describeValue({ kind: { kind: "literal", value: "lightbulb" } })).toBe('"lightbulb"');
    expect(describeValue({ kind: { kind: "literal", value: "" } })).toBe("(empty)");
  });

  it("shortens a long piece of fixed text", () => {
    const long = "x".repeat(80);
    expect(describeValue({ kind: { kind: "literal", value: long } })).toHaveLength(42);
  });

  it("prefers the name stored with the entity", () => {
    expect(describeValue(entity("light.kitchen", "Kitchen light"))).toBe("Kitchen light");
  });

  it("falls back to the live friendly name when the document has none", () => {
    expect(describeValue(entity("light.kitchen"), { hass: HASS })).toBe("Kitchen light");
  });

  it("falls back to the id when nothing knows a name", () => {
    expect(describeValue(entity("light.spare"))).toBe("light.spare");
  });

  it("says so when no entity is chosen", () => {
    expect(describeValue(entity(""))).toBe("(no entity)");
  });

  it("names an attribute after its entity", () => {
    expect(describeValue({ kind: { kind: "entityAttribute", entityId: "light.kitchen", displayName: "Kitchen light", domain: "light", attribute: "brightness" } }))
      .toBe("Kitchen light · brightness");
  });

  it("drops the separator while the attribute is still blank", () => {
    expect(describeValue({ kind: { kind: "entityAttribute", entityId: "light.kitchen", displayName: "Kitchen light", domain: "light", attribute: "" } }))
      .toBe("Kitchen light");
  });

  it("reads an entity age as an age", () => {
    expect(describeValue({ kind: { kind: "entityAge", entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" } }))
      .toBe("age of Kitchen light");
  });

  it("says what an aggregate counts", () => {
    expect(describeValue({ kind: { kind: "aggregate", aggregate: { function: "count", scope: { kind: "filter", domains: ["light", "switch"], areaIds: [], labelIds: [], floorIds: [] } } } }))
      .toBe("count of light + switch");
    expect(describeValue({ kind: { kind: "aggregate", aggregate: { function: "sum", scope: { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] } } } }))
      .toBe("sum of matching entities");
    expect(describeValue({ kind: { kind: "aggregate", aggregate: { function: "average", scope: { kind: "entities", entities: [{ entityId: "a.b", displayName: "", domain: "a" }] } } } }))
      .toBe("average of 1 entity");
  });

  it("writes time fields in words", () => {
    expect(describeValue({ kind: { kind: "time", timeField: "now" } })).toBe("the time");
    expect(describeValue({ kind: { kind: "time", timeField: "weekday" } })).toBe("the weekday");
  });

  it("shows the start of a template rather than the word jinja", () => {
    expect(describeValue({ kind: { kind: "jinja", value: "{{ states('sensor.x') }}" } })).toBe("template {{ states('sensor.x') }}");
  });

  it("gives a named value its name", () => {
    expect(describeValue({ kind: { kind: "named", id: "a1b2c3d4e5" } }, { values: named })).toBe("Front door");
  });

  it("falls back to the id when the named value is gone", () => {
    expect(describeValue({ kind: { kind: "named", id: "deadbeef99" } }, { values: named })).toBe("named deadbeef");
  });

  it("says nothing is chosen for an empty named value", () => {
    expect(describeValue({ kind: { kind: "named", id: "" } }, { values: named })).toBe("(no value chosen)");
  });

  it("still works with no context at all, which is how the layer list calls it", () => {
    expect(describeValue({ kind: { kind: "named", id: "a1b2c3d4e5" } })).toBe("named a1b2c3d4");
  });

  it("appends the formatting", () => {
    expect(describeValue({ kind: { kind: "entityState", entityId: "sensor.t", displayName: "Temp", domain: "sensor" }, format: { decimals: 1, suffix: "°C" } }))
      .toBe('Temp (1 dp, "°C" after)');
  });
});

describe("describeFormat", () => {
  it("is empty when nothing is set", () => {
    expect(describeFormat(undefined)).toBe("");
    expect(describeFormat({})).toBe("");
  });

  it("keeps a negative offset readable", () => {
    expect(describeFormat({ offset: -3 })).toBe(" (-3)");
    expect(describeFormat({ offset: 3 })).toBe(" (+3)");
  });

  it("names a duration format", () => {
    expect(describeFormat({ duration: true })).toBe(" (as a duration)");
  });

  it("lists every part it was given", () => {
    expect(describeFormat({ decimals: 0, multiply: 2, prefix: "~", useEntityUnit: true, relativeTime: true, textCase: "upper" }))
      .toBe(' (0 dp, ×2, "~" first, with unit, as relative time, UPPER)');
  });
});
