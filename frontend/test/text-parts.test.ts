// Rich text parts: a text layer drawn as a row of parts, each in its own colour,
// weight, size and band table. The shared fixture (fixtures/text_parts.json)
// pins the resolved parts on both sides; this file pins the wire shape, the
// audit, the fallback value, the walks that must reach a part, the preview, and
// the rule edges the fixture does not spell out.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  auditUnknownKeys,
  CHART_DEFAULT_BAND_HIGH_HEX,
  describeSite,
  encodeConfig,
  forEachValue,
  literal,
  newConfig,
  newElement,
  parseConfig,
  richTextFallback,
  syncRichTextFallback,
  textUsesParts,
  type CustomComplicationConfig,
  type Element,
  type Rule,
  type StyleChange,
  type TextElement,
  type TextPart,
  type Value,
  type ValueSite,
} from "../src/model.js";
import { compile } from "../src/compiler.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ForcedBranches, type ResolvedLayout, type ResolvedText } from "../src/resolver.js";
import { remapEntities, scrubForShare, shareSlots } from "../src/transfer.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";
const BAND = "B0000000-0000-4000-8000-000000000001";
const RULE = "D0000000-0000-4000-8000-000000000001";
const CASE = "C0000000-0000-4000-8000-000000000001";

const state = (entityId: string, format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId, displayName: entityId, domain: entityId.split(".")[0]! },
  ...(format ? { format } : {}),
});

let ruleCounter = 0;

/** A rule whose one case always matches. */
function always(then: StyleChange[], partId?: string): Rule {
  ruleCounter += 1;
  const n = String(ruleCounter).padStart(12, "0");
  return {
    id: `D1000000-0000-4000-8000-${n}`,
    cases: [{ id: `C1000000-0000-4000-8000-${n}`, when: { join: "all", tests: [] }, then }],
    ...(partId !== undefined ? { partId } : {}),
  };
}

/** One text layer filling a rectangular face, 181 points wide. */
function textConfig(tweak: (p: TextElement) => void): CustomComplicationConfig {
  const cfg = newConfig("Parts", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  cfg.elements = [el];
  return cfg;
}

function payloadOf(encoded: unknown): Record<string, unknown> {
  return ((encoded as Record<string, unknown>).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
}

function textOf(cfg: CustomComplicationConfig): TextElement {
  return (cfg.elements[0] as Extract<Element, { kind: "text" }>).payload;
}

function layoutOf(cfg: CustomComplicationConfig, states: Record<string, string> = {}, forced?: ForcedBranches): ResolvedLayout {
  const entityStates = new Map<string, EntityState>(
    Object.entries(states).map(([id, s]) => [id, { entityId: id, state: s, iconName: "", domain: id.split(".")[0]! }]),
  );
  return resolveAll(cfg, { entityStates, templateResults: new Map(), historySeries: new Map(), namedValues: cfg.values }, forced).rectangular!;
}

const resolvedText = (cfg: CustomComplicationConfig, states: Record<string, string> = {}, forced?: ForcedBranches) =>
  layoutOf(cfg, states, forced).elements[0] as ResolvedText;

/** The price line from the shared fixture, small enough to reason about. */
function priceParts(): TextPart[] {
  return [
    { id: PART_A, value: literal("Now ") },
    {
      id: PART_B,
      value: state("sensor.price", { decimals: 2 }),
      fontWeight: "semibold",
      fontSize: 21,
      coloring: "bands",
      bands: [{ id: BAND, upTo: 0.3, colorHex: "#FFD60A" }],
    },
    { id: PART_C, value: literal(" €/kWh"), fontSize: 11 },
  ];
}

describe("text parts on the wire", () => {
  it("writes parts after lowColorHex, each part's keys in the app's order and only when set", () => {
    const cfg = textConfig((p) => {
      p.lowColorHex = "#34FF6A";
      p.parts = [
        { id: PART_A, value: literal("Now ") },
        {
          id: PART_B,
          value: state("sensor.price"),
          colorHex: "#FFFFFF",
          fontWeight: "semibold",
          fontSize: 21,
          coloring: "bands",
          bands: [{ id: BAND, upTo: 0.2, colorHex: "#30D158" }],
          bandAboveColorHex: "#FF9F0A",
        },
      ];
      p.rules = [always([{ kind: "setFontWeight", weight: "bold" }], PART_B)];
    });
    const payload = payloadOf(encodeConfig(cfg));
    const keys = Object.keys(payload);
    expect(keys.slice(keys.indexOf("lowColorHex"))).toEqual(["lowColorHex", "parts"]);
    expect((payload.parts as Record<string, unknown>[]).map((part) => Object.keys(part))).toEqual([
      ["id", "value"],
      ["id", "value", "colorHex", "fontWeight", "fontSize", "coloring", "bands", "bandAboveColorHex"],
    ]);
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
    const back = parseConfig(encodeConfig(cfg));
    expect(textOf(back).parts).toEqual(textOf(cfg).parts);
    expect(payloadOf(encodeConfig(back))).toEqual(payload);
  });

  it("writes the value from the parts, whatever the draft held, except on a countdown", () => {
    const stale = textConfig((p) => {
      p.value = literal("stale");
      p.parts = priceParts();
    });
    expect(payloadOf(encodeConfig(stale)).value).toEqual({
      kind: { kind: "entityState", entityId: "sensor.price", displayName: "sensor.price", domain: "sensor" },
      format: { decimals: 2, prefix: "Now ", suffix: " €/kWh" },
    });
    const countdown = textConfig((p) => {
      p.value = literal("stale");
      p.countdown = true;
      p.parts = priceParts();
    });
    const payload = payloadOf(encodeConfig(countdown));
    expect(payload.value).toEqual({ kind: { kind: "literal", value: "stale" } });
    expect(payload.parts).toHaveLength(3);
  });

  it("writes no parts key for a layer without parts or with an empty list", () => {
    for (const tweak of [() => {}, (p: TextElement) => { p.parts = []; }]) {
      const payload = payloadOf(encodeConfig(textConfig((p) => { p.value = literal("Hi"); tweak(p); })));
      expect(payload).not.toHaveProperty("parts");
      expect(payload.value).toEqual({ kind: { kind: "literal", value: "Hi" } });
    }
  });

  it("reads an unknown weight or colouring, an empty table and the default colour past it as absent", () => {
    const enc = encodeConfig(textConfig(() => {})) as Record<string, unknown>;
    payloadOf(enc).parts = [{
      id: PART_A.toLowerCase(),
      value: { kind: { kind: "literal", value: "x" } },
      fontWeight: "heavy",
      coloring: "gradient",
      bands: [],
      bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX,
    }];
    expect(textOf(parseConfig(enc)).parts).toEqual([{ id: PART_A, value: literal("x") }]);
  });

  it("round-trips a rule's partId last, and leaves it off a rule that has none", () => {
    const cfg = textConfig((p) => {
      p.parts = priceParts();
      p.rules = [
        { ...always([{ kind: "hide" }]), otherwise: [{ kind: "show" }], partId: PART_B },
        always([{ kind: "hide" }]),
      ];
    });
    const rules = payloadOf(encodeConfig(cfg)).rules as Record<string, unknown>[];
    expect(Object.keys(rules[0]!)).toEqual(["id", "cases", "otherwise", "partId"]);
    expect(rules[1]).not.toHaveProperty("partId");

    const enc = encodeConfig(cfg) as Record<string, unknown>;
    (payloadOf(enc).rules as Record<string, unknown>[])[0]!.partId = PART_B.toLowerCase();
    const back = textOf(parseConfig(enc)).rules;
    expect(back[0]!.partId).toBe(PART_B);
    expect(back[1]).not.toHaveProperty("partId");
  });
});

describe("text parts in the unknown-key audit", () => {
  it("flags an unknown key on a part and inside a part's value", () => {
    const enc = encodeConfig(textConfig((p) => {
      p.parts = priceParts();
      p.rules = [always([{ kind: "hide" }], PART_A)];
    })) as Record<string, unknown>;
    expect(auditUnknownKeys(enc)).toEqual([]);
    const parts = payloadOf(enc).parts as Record<string, Record<string, Record<string, unknown>>>[];
    (parts[0] as Record<string, unknown>).shadow = 1;
    parts[1]!.value!.format!.bold = true;
    expect(auditUnknownKeys(enc)).toEqual([
      "$.elements[0].payload.parts[0].shadow",
      "$.elements[0].payload.parts[1].value.format.bold",
    ]);
  });
});

describe("richTextFallback", () => {
  it("joins typed words, each with its own prefix and suffix, when no part is live", () => {
    expect(richTextFallback([
      { id: PART_A, value: literal("A") },
      { id: PART_B, value: { ...literal("B"), format: { prefix: "(", suffix: ")" } } },
    ])).toEqual(literal("A(B)"));
    expect(richTextFallback([])).toEqual(literal(""));
  });

  it("gives the first live part the words before it and the words up to the next live part", () => {
    const got = richTextFallback([
      { id: PART_A, value: literal("A ") },
      { id: PART_B, value: state("sensor.one", { decimals: 1, prefix: "[", suffix: "]" }) },
      { id: PART_C, value: literal(" B") },
      { id: "A0000000-0000-4000-8000-000000000004", value: state("sensor.two") },
      { id: "A0000000-0000-4000-8000-000000000005", value: literal(" C") },
    ]);
    expect(got).toEqual(state("sensor.one", { decimals: 1, prefix: "A [", suffix: "] B" }));
  });

  it("leaves off an empty prefix, an empty suffix and a format with nothing left in it", () => {
    const bare = richTextFallback([
      { id: PART_A, value: literal("") },
      { id: PART_B, value: state("sensor.one") },
      { id: PART_C, value: state("sensor.two") },
    ]);
    expect(bare).toEqual(state("sensor.one"));
    expect(bare).not.toHaveProperty("format");
  });

  it("copies the live part's kind rather than sharing it", () => {
    const parts: TextPart[] = [{ id: PART_A, value: { kind: { kind: "jinja", value: "{{ 1 }}" } } }];
    const got = richTextFallback(parts);
    expect(got.kind).toEqual(parts[0]!.value.kind);
    expect(got.kind).not.toBe(parts[0]!.value.kind);
  });

  it("is kept in the draft only for a layer that draws its parts", () => {
    const p = textOf(textConfig((t) => { t.value = literal("old"); t.parts = priceParts(); }));
    expect(textUsesParts(p)).toBe(true);
    syncRichTextFallback(p);
    expect(p.value).toEqual(richTextFallback(p.parts!));
    const countdown = textOf(textConfig((t) => { t.value = literal("old"); t.countdown = true; t.parts = priceParts(); }));
    expect(textUsesParts(countdown)).toBe(false);
    syncRichTextFallback(countdown);
    expect(countdown.value).toEqual(literal("old"));
  });
});

describe("text parts resolution", () => {
  it("draws plain text once a layer rule's text change fires, even when its value has not resolved", () => {
    const cfg = textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("Now ") }, { id: PART_B, value: state("sensor.a") }];
      syncRichTextFallback(p);
      p.rules = [always([{ kind: "setText", value: state("sensor.missing") }])];
    });
    const r = resolvedText(cfg, { "sensor.a": "5" });
    expect(r).not.toHaveProperty("parts");
    expect(r).not.toHaveProperty("spans");
    expect(r.text).toBe("Now 5");
  });

  it("never lets a part rule change a text layer's own look, drawing parts or not", () => {
    const partRules = () => [
      always([{ kind: "setColor", value: literal("#FF0000") }, { kind: "setFontSize", number: 30 }], PART_A),
      always([{ kind: "setFontWeight", weight: "bold" }, { kind: "hide" }], "A0000000-0000-4000-8000-00000000DEAD"),
    ];
    const countdown = resolvedText(textConfig((p) => {
      p.value = literal("Hi");
      p.countdown = true;
      p.parts = [{ id: PART_A, value: literal("X") }];
      p.rules = partRules();
    }));
    expect([countdown.colorHex, countdown.fontSize, countdown.fontWeight, countdown.isHidden]).toEqual(["#FFFFFF", 14, "regular", false]);
    expect(countdown).not.toHaveProperty("parts");

    const plain = resolvedText(textConfig((p) => { p.value = literal("Hi"); p.rules = partRules(); }));
    expect([plain.text, plain.colorHex, plain.fontSize, plain.isHidden]).toEqual(["Hi", "#FFFFFF", 14, false]);
  });

  it("reads a partId on any other layer, and on a shape's own rules, as if it were absent", () => {
    const cfg = newConfig("Parts", 0);
    const gauge = newElement("gauge");
    gauge.payload.rules = [always([{ kind: "setColor", value: literal("#FF0000") }], PART_A)];
    cfg.elements = [gauge];
    cfg.perFamily.rectangular!.rules = [always([{ kind: "setBorderWidth", number: 5 }], PART_A)];
    const layout = layoutOf(cfg);
    expect((layout.elements[0] as { colorHex: string }).colorHex).toBe("#FF0000");
    expect(layout.borderWidth).toBe(5);
  });

  it("honours only colour, text, size, weight and visibility in a part rule", () => {
    const cfg = textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("A") }, { id: PART_B, value: literal("B") }];
      p.rules = [always([
        { kind: "setOpacity", number: 0.2 },
        { kind: "setRotation", number: 45 },
        { kind: "setText", value: literal("Z") },
        { kind: "show" },
      ], PART_A)];
    });
    const r = resolvedText(cfg);
    expect([r.opacity, r.frame.rotationDegrees, r.text]).toEqual([1, 0, "ZB"]);
    expect(r.parts).toHaveLength(2);
  });

  it("ignores the layer's own colour by value while it draws parts", () => {
    const r = resolvedText(textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("12 34") }];
      p.coloring = "bands";
      p.bands = [{ id: BAND, upTo: 20, colorHex: "#30D158" }];
      p.highlight = "both";
    }));
    expect(r).not.toHaveProperty("spans");
    expect(r.parts).toEqual([{ text: "12 34", fontSize: 14, fontWeight: "regular", colorHex: "#FFFFFF" }]);
  });

  it("honours a forced branch of a part rule", () => {
    const cfg = textConfig((p) => {
      p.parts = priceParts();
      p.rules = [{
        id: RULE,
        cases: [{ id: CASE, when: { join: "all", tests: [] }, then: [{ kind: "setColor", value: literal("#00FF00") }] }],
        otherwise: [{ kind: "setColor", value: literal("#0000FF") }],
        partId: PART_C,
      }];
    });
    expect(resolvedText(cfg).parts![2]!.colorHex).toBe("#00FF00");
    expect(resolvedText(cfg, {}, new Map([[RULE, "otherwise"]])).parts![2]!.colorHex).toBe("#0000FF");
  });
});

describe("text parts in the document walks", () => {
  const cfg = () => textConfig((p) => {
    p.parts = [
      { id: PART_A, value: literal("Now ") },
      { id: PART_B, value: state("sensor.price") },
      { id: PART_C, value: state("sensor.only_part") },
    ];
    syncRichTextFallback(p);
  });

  it("visits every part after the layer's value, labelled as a part", () => {
    const seen: [string, ValueSite["part"]][] = [];
    forEachValue(cfg(), (v, site) => {
      if (site.kind !== "layer") return;
      const k = v.kind;
      seen.push([k.kind === "literal" ? k.value : "entityId" in k ? k.entityId : k.kind, site.part]);
    });
    expect(seen).toEqual([
      ["sensor.price", undefined],
      ["Now ", "textPart"],
      ["sensor.price", "textPart"],
      ["sensor.only_part", "textPart"],
    ]);
    expect(describeSite({ kind: "layer", layerKind: "text", layerName: "Price", part: "textPart" })).toBe('Part of text "Price"');
  });

  it("compiles every part, even under a countdown", () => {
    const compiled = compile(textConfig((p) => {
      p.value = state("timer.tea");
      p.countdown = true;
      p.parts = [{ id: PART_A, value: state("sensor.only_part") }, { id: PART_B, value: { kind: { kind: "jinja", value: "{{ 1 }}" } } }];
    }));
    expect([...compiled.entities.keys()].sort()).toEqual(["sensor.only_part", "timer.tea"]);
    expect(compiled.expressions.size).toBe(1);
  });

  it("swaps an entity only a part reads for a placeholder on share, and back on import", () => {
    const doc = cfg();
    const slots = shareSlots(doc, new Set(["sensor"]));
    const slot = slots.find((s) => s.originalId === "sensor.only_part");
    expect(slot).toBeDefined();
    const scrubbed = scrubForShare(doc, slots);
    expect(JSON.stringify(scrubbed)).not.toContain("only_part");
    expect(textOf(scrubbed).parts![2]!.value.kind).toMatchObject({ entityId: slot!.placeholderId });

    const mine = { entityId: "sensor.mine", displayName: "Mine", domain: "sensor" };
    const back = remapEntities(scrubbed, new Map([[slot!.placeholderId, mine]]));
    expect(textOf(back).parts![2]!.value.kind).toMatchObject({ entityId: "sensor.mine" });
  });
});

describe("text parts in the preview", () => {
  const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

  function flatten(node: unknown): string {
    if (node === undefined || node === null || node === nothing) return "";
    if (Array.isArray(node)) return node.map(flatten).join("");
    if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
      const t = node as { strings: readonly string[]; values: unknown[] };
      return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
    }
    return String(node);
  }

  const draw = (cfg: CustomComplicationConfig, states: Record<string, string> = {}) =>
    flatten(renderLayout(layoutOf(cfg, states), { icons: noIcons }));

  /** Each drawn run as [text, size, weight, fill]. */
  const runs = (svg: string) =>
    [...svg.matchAll(/<tspan font-size=([\d.]+) font-weight=(\d+) fill=(#[0-9A-Fa-f]{6}) fill-opacity=[\d.]+>([^<]*)<\/tspan>/g)]
      .map((m) => [m[4]!, Number(m[1]), Number(m[2]), m[3]!] as const);

  it("draws each run in its own size, weight and fill, and still spells the text", () => {
    const svg = draw(textConfig((p) => {
      p.fontSize = 15;
      p.colorSlot.baseColorHex = "#8E8E93";
      p.parts = priceParts();
    }), { "sensor.price": "0.28" });
    expect(runs(svg)).toEqual([
      ["Now ", 15, 400, "#8E8E93"],
      ["0.28", 21, 600, "#FFD60A"],
      [" €/kWh", 11, 400, "#8E8E93"],
    ]);
  });

  it("shrinks every run by the same factor", () => {
    const got = runs(draw(textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("x".repeat(20)), fontSize: 20 }, { id: PART_B, value: literal("y".repeat(20)), fontSize: 10 }];
    })));
    expect(got[0]![1]).toBeLessThan(20);
    expect(got[0]![1] / got[1]![1]).toBeCloseTo(2, 5);
  });

  it("wraps onto two lines measured at each run's own size", () => {
    const svg = draw(textConfig((p) => {
      p.lineLimit = 2;
      p.parts = [
        { id: PART_A, value: literal("Electricity price "), fontSize: 10 },
        { id: PART_B, value: literal("0.28"), fontSize: 30 },
        { id: PART_C, value: literal(" €/kWh"), fontSize: 10 },
      ];
    }));
    const lines = svg.split(/<tspan x=[-\d.]+ y=[-\d.]+>/).slice(1).map((chunk) => runs(chunk));
    expect(lines.map((line) => line.map(([t]) => t).join(""))).toEqual(["Electricity price 0.28", "€/kWh"]);
    expect(lines[0]!.at(-1)).toEqual(["0.28", 30, 400, "#FFFFFF"]);
  });

  it("cuts an overlong line short with an ellipsis in the look of what it follows", () => {
    const got = runs(draw(textConfig((p) => {
      p.fontSize = 16;
      p.parts = [{ id: PART_A, value: literal("9".repeat(40)), colorHex: "#FF0000" }, { id: PART_B, value: literal("8".repeat(40)) }];
    })));
    expect(got).toHaveLength(1);
    expect(got[0]![0].endsWith("9…")).toBe(true);
    expect(got[0]![3]).toBe("#FF0000");
  });

  it("draws no text when every part is hidden, and plain text when parts are off", () => {
    const hidden = draw(textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("X") }];
      p.rules = [always([{ kind: "hide" }], PART_A)];
    }));
    expect(hidden).not.toContain("<text");
    const replaced = draw(textConfig((p) => {
      p.parts = [{ id: PART_A, value: literal("X"), fontSize: 30 }];
      p.rules = [always([{ kind: "setText", value: literal("Plain") }])];
    }));
    expect(runs(replaced)).toEqual([]);
    expect(replaced).toContain("Plain");
  });
});
