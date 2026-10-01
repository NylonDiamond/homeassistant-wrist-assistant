// Icon parts in rich text: a part with an `icon` value draws an SF Symbol in
// the line instead of words. Its `value` is always the empty literal, so a
// watch app from before icon parts drops the icon and keeps the rest of the
// line. The shared fixture pins the resolved parts on both sides; this file
// pins the wire shape, the fallback, how the symbol settles, the curve, the
// walks, the way out of rich text, the rule menus and the preview.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  auditUnknownKeys,
  encodeConfig,
  forEachValue,
  literal,
  newConfig,
  newElement,
  parseConfig,
  richTextFallback,
  syncRichTextFallback,
  type CustomComplicationConfig,
  type Element,
  type Rule,
  type StyleChange,
  type TextElement,
  type TextPart,
  type Value,
} from "../src/model.js";
import { compile, keyFor } from "../src/compiler.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ResolvedText } from "../src/resolver.js";
import { joinTextParts, turnOffRichText } from "../src/rich-text.js";
import { changeKindsFor, partAim, richTextBlockedHint, rulePartLabel } from "../src/editors.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";

const state = (entityId: string, format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId, displayName: entityId, domain: entityId.split(".")[0]! },
  ...(format ? { format } : {}),
});

const jinja = (source: string): Value => ({ kind: { kind: "jinja", value: source } });

const iconPart = (id: string, icon: Value, extra: Partial<TextPart> = {}): TextPart => ({ id, value: literal(""), icon, ...extra });

let ruleCounter = 0;

/** A rule whose one case always matches. */
function always(then: StyleChange[], partId?: string): Rule {
  ruleCounter += 1;
  const n = String(ruleCounter).padStart(12, "0");
  return {
    id: `D2000000-0000-4000-8000-${n}`,
    cases: [{ id: `C2000000-0000-4000-8000-${n}`, when: { join: "all", tests: [] }, then }],
    ...(partId !== undefined ? { partId } : {}),
  };
}

/** One text layer filling a rectangular face. */
function textConfig(tweak: (p: TextElement) => void): CustomComplicationConfig {
  const cfg = newConfig("Icons", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  syncRichTextFallback(el.payload);
  cfg.elements = [el];
  return cfg;
}

const textOf = (cfg: CustomComplicationConfig) => (cfg.elements[0] as Extract<Element, { kind: "text" }>).payload;

function payloadOf(encoded: unknown): Record<string, unknown> {
  return ((encoded as Record<string, unknown>).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
}

function resolvedText(
  cfg: CustomComplicationConfig,
  o: { states?: Record<string, { state: string; iconName?: string }>; templates?: [Value, string][] } = {},
): ResolvedText {
  const entityStates = new Map<string, EntityState>(Object.entries(o.states ?? {}).map(([id, s]) =>
    [id, { entityId: id, state: s.state, iconName: s.iconName ?? "", domain: id.split(".")[0]! }]));
  const templateResults = new Map((o.templates ?? []).map(([v, r]) => [keyFor(v, cfg.values)!, r]));
  return resolveAll(cfg, { entityStates, templateResults, historySeries: new Map(), namedValues: cfg.values }).rectangular!.elements[0] as ResolvedText;
}

/** The price line with a house in front: `[house.fill] Net 1.2`. */
const houseLine = (icon: Value = literal("house.fill"), extra: Partial<TextPart> = {}): TextPart[] => [
  iconPart(PART_A, icon, extra),
  { id: PART_B, value: literal(" Net ") },
  { id: PART_C, value: state("sensor.net") },
];

describe("icon parts on the wire", () => {
  it("writes icon right after value, with the value always the empty literal", () => {
    const cfg = textConfig((p) => { p.parts = houseLine(literal("house.fill"), { colorHex: "#FFD60A", fontSize: 14 }); });
    const part = (payloadOf(encodeConfig(cfg)).parts as Record<string, unknown>[])[0]!;
    expect(Object.keys(part)).toEqual(["id", "value", "icon", "colorHex", "fontSize"]);
    expect(part.value).toEqual({ kind: { kind: "literal", value: "" } });
    expect(part.icon).toEqual({ kind: { kind: "literal", value: "house.fill" } });
  });

  it("round-trips a template icon, and writes no icon key on a part of words", () => {
    const cfg = textConfig((p) => { p.parts = houseLine(jinja("{{ 'sun.max.fill' if is_state('sun.sun', 'above_horizon') else '' }}")); });
    const back = parseConfig(JSON.parse(JSON.stringify(encodeConfig(cfg))));
    expect(textOf(back).parts).toEqual(textOf(cfg).parts);
    const parts = payloadOf(encodeConfig(back)).parts as Record<string, unknown>[];
    expect("icon" in parts[1]!).toBe(false);
  });

  it("is a known key to the audit, and an unknown key inside the icon value is still flagged", () => {
    const encoded = encodeConfig(textConfig((p) => { p.parts = houseLine(); })) as Record<string, unknown>;
    expect(auditUnknownKeys(encoded)).toEqual([]);
    const icon = (payloadOf(encoded).parts as Record<string, Record<string, unknown>>[])[0]!.icon!;
    icon.stray = 1;
    expect(auditUnknownKeys(encoded)).toEqual(["$.elements[0].payload.parts[0].icon.stray"]);
  });
});

describe("richTextFallback with icon parts", () => {
  it("leaves an icon part out, so an older watch shows the rest of the line", () => {
    const fallback = richTextFallback(houseLine());
    expect(fallback.kind).toMatchObject({ kind: "entityState", entityId: "sensor.net" });
    expect(fallback.format).toEqual({ prefix: " Net " });
  });

  it("ignores words a hand-edited document put in an icon part's value", () => {
    const parts = [iconPart(PART_A, literal("star.fill"), { value: literal("stray ") }), { id: PART_B, value: literal("Hi") }];
    expect(richTextFallback(parts)).toEqual(literal("Hi"));
    expect(richTextFallback([iconPart(PART_A, literal("star.fill"))])).toEqual(literal(""));
  });
});

describe("icon part resolution", () => {
  it("draws a typed symbol, trimmed, as a part with no text in the part's look", () => {
    const cfg = textConfig((p) => {
      p.colorSlot.baseColorHex = "#8E8E93";
      p.parts = houseLine(literal("  house.fill \n"), { fontWeight: "bold", fontSize: 18 });
    });
    const got = resolvedText(cfg, { states: { "sensor.net": { state: "1.2" } } });
    expect(got.parts![0]).toMatchObject({ text: "", symbol: "house.fill", fontSize: 18, fontWeight: "bold", colorHex: "#8E8E93" });
    expect(got.parts![1]!.symbol).toBeUndefined();
    expect(got.text).toBe(" Net 1.2");
  });

  it("takes the symbol a template renders, and leaves the part out when it renders empty", () => {
    const tpl = jinja("{{ states('sensor.mode') }}");
    const cfg = textConfig((p) => { p.parts = houseLine(tpl); });
    expect(resolvedText(cfg, { templates: [[tpl, "bolt.fill"]] }).parts![0]!.symbol).toBe("bolt.fill");
    expect(resolvedText(cfg, { templates: [[tpl, "  "]] }).parts!.map((x) => x.text)).toEqual([" Net ", "--"]);
    // A template not yet rendered is a reading that is missing: no placeholder.
    expect(resolvedText(cfg).parts!.some((x) => x.symbol !== undefined)).toBe(false);
  });

  it("draws an entity's own icon", () => {
    const cfg = textConfig((p) => { p.parts = houseLine(state("light.porch")); });
    const got = resolvedText(cfg, { states: { "light.porch": { state: "on", iconName: "lightbulb.fill" } } });
    expect(got.parts![0]!.symbol).toBe("lightbulb.fill");
  });

  it("lets an icon change aimed at the part win, and ignores a text change there", () => {
    const cfg = textConfig((p) => {
      p.parts = houseLine();
      p.rules = [always([{ kind: "setIcon", value: literal("bolt.fill") }, { kind: "setText", value: literal("words") }], PART_A)];
    });
    expect(resolvedText(cfg).parts![0]).toMatchObject({ text: "", symbol: "bolt.fill" });
  });

  it("leaves a Material Design name and the custom drawing marker out rather than drawing a question mark", () => {
    for (const name of ["mdi:home", "svg:custom"]) {
      const got = resolvedText(textConfig((p) => { p.parts = houseLine(literal(name)); }));
      expect(got.parts!.some((x) => x.symbol !== undefined), name).toBe(false);
    }
    const ruled = textConfig((p) => {
      p.parts = houseLine();
      p.rules = [always([{ kind: "setIcon", value: literal("mdi:flash") }], PART_A)];
    });
    expect(resolvedText(ruled).parts!.some((x) => x.symbol !== undefined)).toBe(false);
  });

  it("leaves the part out when a rule hides it, and colors it rule first, then the part, then the layer", () => {
    const hidden = textConfig((p) => {
      p.parts = houseLine();
      p.rules = [always([{ kind: "hide" }], PART_A)];
    });
    expect(resolvedText(hidden).parts!.some((x) => x.symbol !== undefined)).toBe(false);
    const colored = textConfig((p) => {
      p.parts = houseLine(literal("house.fill"), { colorHex: "#30D158" });
      p.rules = [always([{ kind: "setColor", value: literal("#FF453A") }], PART_A)];
    });
    expect(resolvedText(colored).parts![0]!.colorHex).toBe("#FF453A");
  });

  it("never colors an icon part by value", () => {
    const cfg = textConfig((p) => {
      p.parts = houseLine(literal("house.fill"), { coloring: "bands", bands: [{ id: "B0000000-0000-4000-8000-000000000001", upTo: 1, colorHex: "#FF0000" }] });
    });
    expect(resolvedText(cfg).parts![0]!.spans).toBeUndefined();
  });

  it("leaves icon parts off a curve and keeps the words", () => {
    const cfg = textConfig((p) => {
      p.parts = houseLine();
      p.arc = { radius: 0.6 };
    });
    const got = resolvedText(cfg, { states: { "sensor.net": { state: "1.2" } } });
    expect(got.arc).toBeDefined();
    expect(got.parts!.map((x) => x.text)).toEqual([" Net ", "1.2"]);
    expect(got.parts!.some((x) => x.symbol !== undefined)).toBe(false);
  });

  it("goes with every other part under a layer rule that sets the text", () => {
    const cfg = textConfig((p) => {
      p.parts = houseLine();
      p.rules = [always([{ kind: "setText", value: literal("Off") }])];
    });
    const got = resolvedText(cfg);
    expect(got.parts).toBeUndefined();
    expect(got.text).toBe("Off");
  });
});

describe("icon parts in the document walks", () => {
  it("visits the icon after its part's value, so a template in it is compiled", () => {
    const tpl = jinja("{{ 'sun.max.fill' }}");
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, tpl), { id: PART_B, value: literal("Day") }]; });
    const seen: Value[] = [];
    forEachValue(cfg, (v, site) => { if (site.part === "textPart") seen.push(v); });
    expect(seen).toEqual([literal(""), tpl, literal("Day")]);
    const compiled = compile(cfg);
    expect([...compiled.expressions.keys()]).toContain(keyFor(tpl, cfg.values));
  });

  it("fetches an entity only an icon part reads", () => {
    const compiled = compile(textConfig((p) => { p.parts = [iconPart(PART_A, state("light.porch")), { id: PART_B, value: literal("Porch") }]; }));
    expect([...compiled.entities.keys()]).toEqual(["light.porch"]);
  });
});

describe("leaving rich text with icon parts", () => {
  it("is blocked by a lone icon part, and leaves the layer as it was", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, literal("star.fill"))]; });
    const before = structuredClone(textOf(cfg));
    const result = turnOffRichText(textOf(cfg));
    expect(result).toEqual({ ok: false, blocked: [{ index: 0, partId: PART_A, reason: "icon" }] });
    expect(textOf(cfg)).toEqual(before);
  });

  it("is blocked by an icon among words, even where the words alone would join", () => {
    const parts = [{ id: PART_A, value: literal("Hi ") }, iconPart(PART_B, literal("star.fill"))];
    expect(joinTextParts(parts)).toEqual({ ok: false, blocked: [{ index: 1, partId: PART_B, reason: "icon" }] });
    const cfg = textConfig((p) => { p.parts = parts; });
    expect(turnOffRichText(textOf(cfg)).ok).toBe(false);
    expect(textOf(cfg).parts).toHaveLength(2);
  });

  it("names every part in the way, icons and values together", () => {
    const blocked = joinTextParts([iconPart(PART_A, literal("star.fill")), { id: PART_B, value: { kind: { kind: "dataAge" } } }]);
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    const hint = richTextBlockedHint(blocked.blocked);
    expect(hint).toContain("Part 1 is an icon, and icons only show in Rich text.");
    expect(hint).toContain("Part 2 shows a value a template cannot read");
    expect(hint).toContain("Change or remove those parts first.");
    expect(richTextBlockedHint([{ index: 0, partId: PART_A, reason: "icon" }]))
      .toBe("Rich text stays on, because plain text cannot show an icon. Part 1 is an icon, and icons only show in Rich text. Remove that part first.");
  });

  it("lets a countdown drop its icon parts with the rest", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, literal("timer"))]; p.countdown = true; });
    expect(turnOffRichText(textOf(cfg)).ok).toBe(true);
    expect(textOf(cfg).parts).toBeUndefined();
  });
});

describe("icon parts in the editors", () => {
  it("offers Change icon, color, size, weight and visibility on an icon part, and no text", () => {
    const parts = houseLine();
    expect(partAim(parts, PART_A)).toBe("icon");
    expect(partAim(parts, PART_B)).toBe("text");
    expect(partAim(parts, undefined)).toBe(false);
    expect(changeKindsFor("text", partAim(parts, PART_A)).sort())
      .toEqual(["hide", "setColor", "setFontSize", "setFontWeight", "setIcon", "show"]);
    expect(changeKindsFor("text", "text")).toContain("setText");
    expect(changeKindsFor("text", "text")).not.toContain("setIcon");
  });

  it("labels an icon part by its symbol, or by what picks it", () => {
    expect(rulePartLabel(iconPart(PART_A, literal("house.fill")), 0)).toBe("Part 1: icon house.fill");
    expect(rulePartLabel(iconPart(PART_A, jinja("{{ x }}")), 1)).toBe("Part 2: icon from a template");
    expect(rulePartLabel(iconPart(PART_A, state("light.porch")), 2)).toBe("Part 3: icon light.porch");
  });
});

describe("icon parts in the preview", () => {
  const drawn: { symbol: string; size: number; colorHex: string }[] = [];
  const icons: IconProvider = {
    render: (symbol, size, colorHex) => {
      drawn.push({ symbol, size, colorHex });
      return { strings: [`<g data-symbol="${symbol}"></g>`], values: [] } as never;
    },
    available: () => true,
    names: () => undefined,
  };

  function flatten(node: unknown): string {
    if (node === undefined || node === null || node === nothing) return "";
    if (Array.isArray(node)) return node.map(flatten).join("");
    if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
      const t = node as { strings: readonly string[]; values: unknown[] };
      return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
    }
    return String(node);
  }

  const draw = (cfg: CustomComplicationConfig, states: Record<string, string> = {}) => {
    const entityStates = new Map<string, EntityState>(Object.entries(states).map(([id, s]) => [id, { entityId: id, state: s, iconName: "", domain: id.split(".")[0]! }]));
    const layout = resolveAll(cfg, { entityStates, templateResults: new Map(), historySeries: new Map(), namedValues: cfg.values }).rectangular!;
    return flatten(renderLayout(layout, { icons }));
  };

  it("draws the symbol between the words, at the part's size and color", () => {
    drawn.length = 0;
    const svg = draw(textConfig((p) => {
      p.parts = houseLine(literal("house.fill"), { fontSize: 16, colorHex: "#FFD60A" });
    }), { "sensor.net": "1.2" });
    expect(drawn).toEqual([{ symbol: "house.fill", size: 16, colorHex: "#FFD60A" }]);
    expect(svg).toContain('data-symbol="house.fill"');
    expect(svg.indexOf("house.fill")).toBeLessThan(svg.indexOf(" Net "));
    expect(svg).toContain("1.2");
  });

  it("draws a line of nothing but an icon", () => {
    drawn.length = 0;
    const svg = draw(textConfig((p) => { p.parts = [iconPart(PART_A, literal("star.fill"))]; }));
    expect(svg).toContain('data-symbol="star.fill"');
  });

  it("draws plain rich text exactly as before when no part is an icon", () => {
    const svg = draw(textConfig((p) => { p.parts = [{ id: PART_A, value: literal("Hi") }]; }));
    expect(svg).toContain("<tspan");
    expect(svg).not.toContain("textLength");
  });
});
