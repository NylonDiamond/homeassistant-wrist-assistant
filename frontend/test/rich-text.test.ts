// Turning a text layer's rich text on and off, the way the editor does it. The
// helpers are plain edits on a text payload, so each is checked by what it
// leaves behind: the value, the parts, the layer's look and the rules.

import { describe, expect, it } from "vitest";
import {
  literal,
  newConfig,
  newElement,
  type CustomComplicationConfig,
  type Element,
  type NamedValue,
  type Rule,
  type TextElement,
  type TextPart,
  type Value,
} from "../src/model.js";
import { compile } from "../src/compiler.js";
import { resolveAll, type ResolvedText } from "../src/resolver.js";
import { dropPartIds, joinTextParts, turnOffRichText, turnOnRichText } from "../src/rich-text.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";
const BAND = "B0000000-0000-4000-8000-000000000001";

const state = (entityId: string, format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId, displayName: entityId, domain: entityId.split(".")[0]! },
  ...(format ? { format } : {}),
});

function textConfig(tweak: (p: TextElement) => void): CustomComplicationConfig {
  const cfg = newConfig("Rich", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  tweak(el.payload);
  cfg.elements = [el];
  return cfg;
}

const textOf = (cfg: CustomComplicationConfig) => (cfg.elements[0] as Extract<Element, { kind: "text" }>).payload;

function resolved(cfg: CustomComplicationConfig, states: Record<string, string>): ResolvedText {
  const entityStates = new Map(Object.entries(states).map(([id, s]) => [id, { entityId: id, state: s, iconName: "", domain: id.split(".")[0]! }]));
  return resolveAll(cfg, { entityStates, templateResults: new Map(), historySeries: new Map(), namedValues: cfg.values }).rectangular!.elements[0] as ResolvedText;
}

function aimedRule(partId?: string): Rule {
  return {
    id: "D0000000-0000-4000-8000-000000000001",
    cases: [{ id: "C0000000-0000-4000-8000-000000000001", when: { join: "all", tests: [] }, then: [{ kind: "hide" }] }],
    ...(partId !== undefined ? { partId } : {}),
  };
}

/** The template one live part joins into, on its own. */
function template(value: Value, namedValues: NamedValue[] = []): string {
  const got = joinTextParts([{ id: PART_A, value: literal("") }, { id: PART_B, value }], namedValues);
  if (!got.ok || got.value.kind.kind !== "jinja") throw new Error(`no template: ${JSON.stringify(got)}`);
  return got.value.kind.value;
}

describe("turnOnRichText", () => {
  it("makes the value the only part, moving a band table in use onto it", () => {
    const value = state("sensor.power", { decimals: 1, suffix: " W" });
    const cfg = textConfig((p) => {
      p.value = value;
      p.coloring = "bands";
      p.bands = [{ id: BAND, upTo: 40, colorHex: "#30D158" }];
      p.bandAboveColorHex = "#FF9F0A";
    });
    const before = resolved(cfg, { "sensor.power": "42.5" });

    const p = textOf(cfg);
    expect(turnOnRichText(p, PART_A)).toBe(PART_A);
    expect(p.parts).toEqual([{
      id: PART_A,
      value,
      coloring: "bands",
      bands: [{ id: BAND, upTo: 40, colorHex: "#30D158" }],
      bandAboveColorHex: "#FF9F0A",
    }]);
    expect(p.value).toEqual(value);
    for (const key of ["coloring", "bands", "bandAboveColorHex", "highlight", "highColorHex", "lowColorHex"]) {
      expect(p, key).not.toHaveProperty(key);
    }
    // The numbers keep their colours: the part's runs are the layer's old runs.
    const after = resolved(cfg, { "sensor.power": "42.5" });
    expect(after.parts![0]!.spans).toEqual(before.spans);
    expect(after.text).toBe(before.text);
  });

  it("moves no table that is not in use, and drops a highlight", () => {
    const p = textOf(textConfig((t) => {
      t.bands = [{ id: BAND, upTo: 40, colorHex: "#30D158" }];
      t.highlight = "both";
      t.highColorHex = "#FF0000";
    }));
    turnOnRichText(p, PART_A);
    expect(p.parts).toEqual([{ id: PART_A, value: literal("Text") }]);
    expect(p).not.toHaveProperty("bands");
    expect(p).not.toHaveProperty("highlight");
    expect(p).not.toHaveProperty("highColorHex");
  });

  it("leaves a layer that already has parts alone", () => {
    const p = textOf(textConfig((t) => { t.parts = [{ id: PART_B, value: literal("x") }]; }));
    expect(turnOnRichText(p, PART_A)).toBe(PART_B);
    expect(p.parts).toEqual([{ id: PART_B, value: literal("x") }]);
  });
});

describe("turnOffRichText with one part", () => {
  it("moves the part's own look onto the layer and aims every rule at the whole text", () => {
    const value = state("sensor.price", { decimals: 2 });
    const p = textOf(textConfig((t) => {
      t.parts = [{
        id: PART_A,
        value,
        fontSize: 21,
        fontWeight: "bold",
        colorHex: "#FFD60A",
        coloring: "bands",
        bands: [{ id: BAND, upTo: 0.3, colorHex: "#30D158" }],
        bandAboveColorHex: "#FF9F0A",
      }];
      t.highlight = "lowest";
      t.rules = [aimedRule(PART_A), aimedRule()];
    }));
    expect(turnOffRichText(p)).toEqual({ ok: true, joined: false, moved: ["fontSize", "fontWeight", "color", "bands"] });
    expect(p.value).toEqual(value);
    expect([p.fontSize, p.fontWeight, p.colorSlot.baseColorHex]).toEqual([21, "bold", "#FFD60A"]);
    expect([p.coloring, p.bands, p.bandAboveColorHex]).toEqual(["bands", [{ id: BAND, upTo: 0.3, colorHex: "#30D158" }], "#FF9F0A"]);
    expect(p).not.toHaveProperty("highlight");
    expect(p).not.toHaveProperty("parts");
    expect(p.rules.map((r) => "partId" in r)).toEqual([false, false]);
  });

  it("moves nothing from a part with no look of its own", () => {
    const p = textOf(textConfig((t) => { t.parts = [{ id: PART_A, value: literal("x") }]; }));
    expect(turnOffRichText(p)).toEqual({ ok: true, joined: false, moved: [] });
    expect([p.value, p.fontSize, p.fontWeight, p.colorSlot.baseColorHex]).toEqual([literal("x"), 14, "regular", "#FFFFFF"]);
  });

  it("only drops the parts of a countdown, which never drew them", () => {
    const p = textOf(textConfig((t) => {
      t.value = state("timer.tea");
      t.countdown = true;
      t.parts = [{ id: PART_A, value: literal("x"), fontSize: 30 }, { id: PART_B, value: { kind: { kind: "dataAge" } } }];
    }));
    expect(turnOffRichText(p)).toEqual({ ok: true, joined: false, moved: [] });
    expect([p.value, p.fontSize]).toEqual([state("timer.tea"), 14]);
    expect(p).not.toHaveProperty("parts");
  });
});

describe("turnOffRichText with two or more parts", () => {
  it("joins typed words into one literal", () => {
    const p = textOf(textConfig((t) => {
      t.parts = [{ id: PART_A, value: literal("A"), colorHex: "#FF0000" }, { id: PART_B, value: literal(" B"), fontSize: 30 }];
      t.rules = [aimedRule(PART_B)];
    }));
    expect(turnOffRichText(p)).toEqual({ ok: true, joined: true });
    expect(p.value).toEqual(literal("A B"));
    expect([p.fontSize, p.colorSlot.baseColorHex]).toEqual([14, "#FFFFFF"]);
    expect(p).not.toHaveProperty("parts");
    expect(p.rules[0]).not.toHaveProperty("partId");
  });

  it("joins live parts into one template the compiler accepts", () => {
    const cfg = textConfig((t) => {
      t.parts = [
        { id: PART_A, value: literal("Now ") },
        { id: PART_B, value: state("sensor.price", { decimals: 2 }) },
        { id: PART_C, value: literal(" €/kWh {x}") },
        {
          id: "A0000000-0000-4000-8000-000000000004",
          value: { kind: { kind: "entityAttribute", entityId: "climate.hall", displayName: "Hall", domain: "climate", attribute: "current_temperature" } },
        },
      ];
    });
    const p = textOf(cfg);
    expect(turnOffRichText(p)).toEqual({ ok: true, joined: true });
    expect(p.value).toEqual({
      kind: {
        kind: "jinja",
        value: "Now {{ '%.2f' | format((states('sensor.price') | float(0))) }}{% raw %} €/kWh {x}{% endraw %}"
          + "{{ state_attr('climate.hall', 'current_temperature') }}",
      },
    });
    expect(compile(cfg).expressions.size).toBe(1);
  });

  it("lists every part with no template form and changes nothing", () => {
    const parts: TextPart[] = [
      { id: PART_A, value: { kind: { kind: "dataAge" } } },
      { id: PART_B, value: state("sensor.ok") },
      { id: PART_C, value: { kind: { kind: "chartStat", layer: "E0000000-0000-4000-8000-000000000001", stat: "latest" } } },
      { id: "A0000000-0000-4000-8000-000000000004", value: state("sensor.last_changed", { relativeTime: true }) },
      { id: "A0000000-0000-4000-8000-000000000005", value: { kind: { kind: "named", id: "E0000000-0000-4000-8000-000000000404" } } },
    ];
    const p = textOf(textConfig((t) => {
      t.value = literal("kept");
      t.parts = structuredClone(parts);
      t.rules = [aimedRule(PART_B)];
    }));
    expect(turnOffRichText(p)).toEqual({
      ok: false,
      blocked: [
        { index: 0, partId: PART_A, reason: "kind" },
        { index: 2, partId: PART_C, reason: "kind" },
        { index: 3, partId: "A0000000-0000-4000-8000-000000000004", reason: "format" },
        { index: 4, partId: "A0000000-0000-4000-8000-000000000005", reason: "kind" },
      ],
    });
    expect(p.value).toEqual(literal("kept"));
    expect(p.parts).toEqual(parts);
    expect(p.rules[0]!.partId).toBe(PART_B);
  });
});

describe("joinTextParts templates", () => {
  it("wraps a bare expression and keeps a template as written", () => {
    expect(template({ kind: { kind: "jinja", value: "states('sensor.a') | int" } })).toBe("{{ (states('sensor.a') | int) }}");
    expect(template({ kind: { kind: "jinja", value: "{{ 1 + 1 }} apples" }, format: { prefix: "<" } })).toBe("<{{ 1 + 1 }} apples");
    expect(template({ kind: { kind: "jinja", value: "{{ 2 }}" }, format: { decimals: 1 } }))
      .toBe("{% set wa_text %}{{ 2 }}{% endset %}{{ '%.1f' | format((wa_text | float(0))) }}");
    expect(template({ kind: { kind: "jinja", value: "  " } })).toBe("");
  });

  it("reads every other live kind through the compiler's expression", () => {
    expect(template({ kind: { kind: "time", timeField: "hour" } })).toBe("{{ now().hour }}");
    expect(template({ kind: { kind: "entityAge", entityId: "sensor.a", displayName: "A", domain: "sensor" } }))
      .toBe("{{ (((now() - states['sensor.a'].last_changed).total_seconds() if states['sensor.a'] is not none else 0) | round(0)) }}");
  });

  it("applies the format in the resolver's order", () => {
    expect(template(state("sensor.a", { multiply: 2, offset: 1 }))).toBe("{{ (((states('sensor.a') | float(0)) * 2) + 1) }}");
    expect(template(state("sensor.mode", { prefix: "Now ", textCase: "upper" }))).toBe("{{ ('Now ' ~ (states('sensor.mode'))) | upper }}");
    expect(template(state("sensor.t", { useEntityUnit: true, suffix: "!" }))).toBe(
      "{% set wa_unit = state_attr('sensor.t', 'unit_of_measurement') %}{{ states('sensor.t') }}"
        + "{{ ('' if not wa_unit else (wa_unit if wa_unit[:1] in ['°', '%'] else ' ' ~ wa_unit)) }}!",
    );
    expect(template(state("it's.odd"))).toBe("{{ states('it\\'s.odd') }}");
  });

  it("follows a shared value to what it names, keeping the nearest format", () => {
    const named: NamedValue[] = [
      { id: "E0000000-0000-4000-8000-000000000001", name: "Price", value: state("sensor.price", { decimals: 1 }) },
      { id: "E0000000-0000-4000-8000-000000000002", name: "Word", value: literal("hi") },
    ];
    expect(template({ kind: { kind: "named", id: named[0]!.id } }, named)).toBe("{{ '%.1f' | format((states('sensor.price') | float(0))) }}");
    expect(template({ kind: { kind: "named", id: named[0]!.id }, format: { suffix: " ct" } }, named)).toBe("{{ states('sensor.price') }} ct");
    expect(template({ kind: { kind: "named", id: named[1]!.id } }, named)).toBe("hi");
  });
});

describe("dropPartIds", () => {
  it("takes every rule off its part", () => {
    const rules = [aimedRule(PART_A), aimedRule()];
    dropPartIds(rules);
    expect(rules.map((r) => "partId" in r)).toEqual([false, false]);
  });
});
