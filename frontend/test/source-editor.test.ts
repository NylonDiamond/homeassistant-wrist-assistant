// The inline source editor: a text's value as Text, Entity, Clock and More
// buttons in its own card, in place of the chip and popover form.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import { type CustomComplicationConfig, type Value, literal, newConfig } from "../src/model.js";
import { type EditorHost, sourceEditor, sourceTab, starterTemplate, STARTER_TEMPLATE } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function") return "";
  return String(node);
}

function host(cfg: CustomComplicationConfig, states: HassLike["states"] = {}): EditorHost {
  return {
    hass: { states } as HassLike,
    config: cfg,
    resolve: () => undefined,
  } as unknown as EditorHost;
}

function draw(value: Value, cfg = newConfig("Test", 0), states: HassLike["states"] = {}): string {
  return flatten(sourceEditor(host(cfg, states), value, () => {}, { key: "t" }));
}

const lamp = { entityId: "light.lamp", displayName: "Lamp", domain: "light" };

describe("sourceTab", () => {
  it("files each source behind its button", () => {
    expect(sourceTab("literal")).toBe("text");
    expect(sourceTab("entityState")).toBe("entity");
    expect(sourceTab("entityAttribute")).toBe("entity");
    expect(sourceTab("entityAge")).toBe("entity");
    expect(sourceTab("jinja")).toBe("template");
    for (const k of ["time", "aggregate", "chartStat", "dataAge", "named", "item", "listStat", "imageTime"] as const) {
      expect(sourceTab(k), k).toBe("more");
    }
  });
});

describe("sourceEditor", () => {
  it("shows four buttons and a box to type in for typed words", () => {
    const markup = draw(literal("Hello"));
    for (const word of ["Text", "Entity", "Template", "More", "Type what to show"]) expect(markup, word).toContain(word);
    // Typed words print as typed, so there is no reading to repeat them.
    expect(markup).not.toContain("now-field");
    // The sources are buttons, not the browser's Source menu.
    expect(markup).not.toContain("<span>Source</span>");
  });

  it("brings the reading back once a format changes the words", () => {
    expect(draw({ kind: { kind: "literal", value: "hi" }, format: { textCase: "upper" } })).toContain("now-field");
  });

  it("asks what an entity value reads, as buttons", () => {
    const markup = draw({ kind: { kind: "entityState", ...lamp } }, newConfig("Test", 0), {
      "light.lamp": { entity_id: "light.lamp", state: "on", attributes: { brightness: 200 } },
    } as unknown as HassLike["states"]);
    for (const word of ["Reads", "State", "Attribute", "Last changed"]) expect(markup, word).toContain(word);
    expect(markup).not.toContain("Type what to show");
  });

  it("lists the entity's attributes with their values", () => {
    const markup = draw({ kind: { kind: "entityAttribute", ...lamp, attribute: "" } }, newConfig("Test", 0), {
      "light.lamp": { entity_id: "light.lamp", state: "on", attributes: { brightness: 200 } },
    } as unknown as HassLike["states"]);
    expect(markup).toContain("brightness · 200");
  });

  it("keeps an attribute the entity lacks right now, marked", () => {
    const markup = draw({ kind: { kind: "entityAttribute", ...lamp, attribute: "brightness" } }, newConfig("Test", 0), {
      "light.lamp": { entity_id: "light.lamp", state: "off", attributes: {} },
    } as unknown as HassLike["states"]);
    expect(markup).toContain("brightness (not there right now)");
  });

  it("files the rarer sources behind More, each with a line", () => {
    const markup = draw(literal("x"));
    expect(markup).toContain("Number from a chart");
    expect(markup).toContain("Clock and date");
    expect(markup).toContain("The time or the date, read on the watch.");
    // Only offered where they mean something.
    expect(markup).not.toContain("Picture time");
    expect(markup).not.toContain("Item field");
    expect(markup).not.toContain("List count");
  });

  it("names the source picked behind More on its button", () => {
    const markup = draw({ kind: { kind: "time", timeField: "now" } });
    expect(markup).toMatch(/<span>Clock<\/span>/);
    expect(markup).not.toMatch(/<span>More<\/span>/);
  });

  it("never lists Picture time, but still names it on a layer that holds it", () => {
    const cfg = newConfig("Test", 0);
    const markup = draw({ kind: { kind: "imageTime", layer: "" } }, cfg);
    expect(markup).toMatch(/<span>Picture time<\/span>/);
    expect(markup).not.toContain("When the watch last fetched a picture layer.");
  });

  it("offers Make shared only for a value worth sharing", () => {
    expect(draw(literal("Hello"))).toContain("Make shared");
    expect(draw(literal(""))).not.toContain("Make shared");
  });
});

describe("starterTemplate", () => {
  it("reads the entity the value already names", () => {
    expect(starterTemplate({ kind: "entityState", ...lamp })).toBe("{{ states('light.lamp') }}");
  });

  it("then the entity it is told to prefer", () => {
    expect(starterTemplate({ kind: "literal", value: "" }, lamp)).toBe("{{ states('light.lamp') }}");
  });

  it("otherwise counts the lights that are on, which every house can render", () => {
    expect(starterTemplate({ kind: "literal", value: "" })).toBe(STARTER_TEMPLATE);
    expect(STARTER_TEMPLATE).toBe("{{ states.light | selectattr('state', 'eq', 'on') | list | count }} Lights On");
  });
});
