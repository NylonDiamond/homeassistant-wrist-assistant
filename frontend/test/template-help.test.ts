// Help for people who write templates. A complication's templates render as
// one document, so one broken template used to blank every value with a single
// "Template error" line at the bottom. Now the panel renders the values one by
// one to find the broken one, shows its error under its own box and badges its
// layer. Every template box also offers recipes, a search that puts an entity
// in at the caret, and words on what the result can be.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  buildDocument,
  compile,
  elementKeys,
  keyFor,
  mergeSplitRenders,
  splitDocuments,
} from "../src/compiler.js";
import {
  literal,
  newConfig,
  newElement,
  type CustomComplicationConfig,
  type Element,
  type Value,
} from "../src/model.js";
import { STARTER_TEMPLATE, valueEditor, type EditorHost } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import {
  TEMPLATE_RECIPES,
  applyRecipe,
  insertAt,
  insertEntity,
  insideBlock,
  isReplaceable,
  namedEntity,
  recipeBlocked,
  recipesFor,
  templateHint,
} from "../src/template-help.js";
import { footerStatus } from "../src/panel.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

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

const jinja = (source: string): Value => ({ kind: { kind: "jinja", value: source } });

const STATES: Record<string, unknown> = {
  "sensor.power": { state: "412" },
  "light.kitchen": { state: "on" },
  "calendar.home": { state: "off" },
};

function host(cfg: CustomComplicationConfig, over: Partial<EditorHost> = {}): EditorHost {
  const base = {
    hass: { states: STATES } as unknown as HassLike,
    config: cfg,
    icons: noIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "rectangular" as const,
    setActiveFamily: () => {},
    openSections: new Set<string>(),
    toggleSection: () => {},
    helpSections: new Set<string>(),
    toggleHelp: () => {},
    selectLayer: () => {},
    selectValue: () => {},
  };
  return { ...base, ...over } as unknown as EditorHost;
}

function textLayer(value: Value): Extract<Element, { kind: "text" }> {
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.value = value;
  return el;
}

describe("finding the template that breaks the document", () => {
  it("splits the expressions into one document each, keyed like the whole one", () => {
    const expressions = new Map([["e_a", "now().hour"], ["e_b", "{{ states('sensor.power') }}"]]);
    const split = splitDocuments(expressions);
    expect(Object.keys(split)).toEqual(["e_a", "e_b"]);
    expect(split.e_a).toBe(buildDocument(new Map([["e_a", "now().hour"]])));
    expect(split.e_b).toContain(`{{ { "e_b": v_e_b } | to_json }}`);
  });

  it("keeps the values that rendered and files each error under its key", () => {
    const merged = mergeSplitRenders({
      e_b: { ok: false, error: "UndefinedError: 'foo' is undefined" },
      e_a: { ok: true, value: `{"e_a": 7}` },
      e_c: { ok: true, value: "not json" },
      e_d: { ok: true, value: `{"e_d": null}` },
    });
    expect([...merged.values]).toEqual([["e_a", "7"]]);
    expect([...merged.errors]).toEqual([
      ["e_b", "UndefinedError: 'foo' is undefined"],
      ["e_c", "Did not render to a value"],
    ]);
  });

  it("names the keys one layer reads, and only that layer", () => {
    const cfg = newConfig("Keys", 0);
    const broken = jinja("{{ foo( }}");
    const fine = jinja("{{ now().minute }}");
    const a = textLayer(broken);
    const b = textLayer(fine);
    cfg.elements = [a, b];
    const brokenKey = keyFor(broken, cfg.values)!;
    expect(elementKeys(a, cfg.values)).toEqual(new Set([brokenKey]));
    expect(elementKeys(b, cfg.values).has(brokenKey)).toBe(false);
    // The whole document still holds both, as before the split.
    expect([...compile(cfg).expressions.keys()].sort()).toEqual([brokenKey, keyFor(fine, cfg.values)!].sort());
  });

  it("finds a shared value's key on the layer that reads it", () => {
    const cfg = newConfig("Shared", 0);
    cfg.values = [{ id: "AAAAAAAA-0000-4000-8000-000000000001", name: "Broken", value: jinja("{{ foo( }}") }];
    const reader = textLayer({ kind: { kind: "named", id: "AAAAAAAA-0000-4000-8000-000000000001" } });
    const other = textLayer(literal("Hi"));
    cfg.elements = [reader, other];
    expect([...elementKeys(reader, cfg.values)]).toEqual(["n_aaaaaaaa000040008000000000000001"]);
    expect(elementKeys(other, cfg.values).size).toBe(0);
  });
});

describe("the error under the template box", () => {
  it("says the template does not work, gives Home Assistant's words, and warns about the watch", () => {
    const cfg = newConfig("Err", 0);
    const value = jinja("{{ foo( }}");
    const h = host(cfg, { templateError: (v) => (v === value ? "TemplateSyntaxError: unexpected '}'" : undefined) });
    const out = flatten(valueEditor(h, value, () => {}, { key: "v", inline: true, showResolved: true }));
    expect(out).toContain("This template does not work.");
    expect(out).toContain("TemplateSyntaxError: unexpected '}'");
    expect(out).toContain("the watch shows no values for the whole complication");
  });

  it("shows the reading as before when there is no error", () => {
    const cfg = newConfig("Fine", 0);
    const out = flatten(valueEditor(host(cfg, { resolve: () => "42" }), jinja("{{ 42 }}"), () => {}, { key: "v", inline: true, showResolved: true }));
    expect(out).not.toContain("does not work");
    expect(out).toContain("42");
  });

  it("explains in the footer's tooltip what the error costs", () => {
    const status = footerStatus({ revision: 3, dirty: false, updatedBy: "", templateError: "boom" });
    expect(status.text).toBe("Template error: boom");
    expect(status.title).toContain("the watch shows no values");
  });
});

describe("the template box", () => {
  it("offers recipes, an entity search and the hint in a complication value", () => {
    const cfg = newConfig("Box", 0);
    const out = flatten(valueEditor(host(cfg), jinja("{{ states('sensor.power') }}"), () => {}, { key: "v", inline: true }));
    expect(out).toContain("Recipes");
    expect(out).toContain("With unit");
    expect(out).toContain("Insert entity");
    expect(out).toContain("write one expression on its own");
    expect(out).not.toContain("MDI icon by state");
  });

  it("offers icon recipes for an icon, and the MDI one only where a template can draw MDI", () => {
    const cfg = newConfig("Icons", 0);
    const plain = flatten(valueEditor(host(cfg), jinja(""), () => {}, { key: "v", inline: true, symbol: true }));
    expect(plain).toContain("Symbol by state");
    expect(plain).not.toContain("MDI icon by state");
    expect(plain).not.toContain("With unit");
    const part = flatten(valueEditor(host(cfg), jinja(""), () => {}, { key: "v", inline: true, symbol: true, mdiTemplates: true }));
    expect(part).toContain("MDI icon by state");
    expect(part).toContain("written out in full");
  });
});

describe("recipes", () => {
  it("each recipe belongs to at least one use, with unique ids", () => {
    expect(new Set(TEMPLATE_RECIPES.map((r) => r.id)).size).toBe(TEMPLATE_RECIPES.length);
    for (const r of TEMPLATE_RECIPES) expect(r.uses.length).toBeGreaterThan(0);
    expect(recipesFor("text").map((r) => r.id)).toEqual(["unit", "round", "words", "since", "event", "lights", "doors"]);
    expect(recipesFor("symbol").map((r) => r.id)).toEqual(["sf"]);
    expect(recipesFor("symbolMdi").map((r) => r.id)).toEqual(["mdi", "sf"]);
  });

  it("reads the last entity the template names that Home Assistant has", () => {
    expect(namedEntity("{{ states('sensor.power') }} and {{ states('light.kitchen') }}", STATES)).toBe("light.kitchen");
    expect(namedEntity("{{ states('sensor.gone') }}", STATES)).toBeUndefined();
    expect(namedEntity("{{ now().hour }}", STATES)).toBeUndefined();
  });

  it("asks for an entity, or the right kind of one, before a recipe that reads one", () => {
    const unit = TEMPLATE_RECIPES.find((r) => r.id === "unit")!;
    const event = TEMPLATE_RECIPES.find((r) => r.id === "event")!;
    const lights = TEMPLATE_RECIPES.find((r) => r.id === "lights")!;
    expect(recipeBlocked(unit, undefined)).toBe("Insert an entity first");
    expect(recipeBlocked(unit, "sensor.power")).toBeUndefined();
    expect(recipeBlocked(event, "sensor.power")).toBe("Insert a calendar entity first");
    expect(recipeBlocked(event, "calendar.home")).toBeUndefined();
    expect(recipeBlocked(lights, undefined)).toBeUndefined();
  });

  it("replaces a box that is only a start, and goes in at the caret otherwise", () => {
    const unit = TEMPLATE_RECIPES.find((r) => r.id === "unit")!;
    const round = TEMPLATE_RECIPES.find((r) => r.id === "round")!;
    expect(isReplaceable("", STARTER_TEMPLATE, STATES)).toBe(true);
    expect(isReplaceable(STARTER_TEMPLATE, STARTER_TEMPLATE, STATES)).toBe(true);
    expect(isReplaceable("{{ states('sensor.power') }}", STARTER_TEMPLATE, STATES)).toBe(true);
    // One recipe's output is a start for the next, so trying them in turn swaps.
    const first = applyRecipe("{{ states('sensor.power') }}", 0, unit, "sensor.power", STARTER_TEMPLATE, STATES);
    expect(first.text).toBe("{{ states('sensor.power', with_unit=True) }}");
    const second = applyRecipe(first.text, 3, round, "sensor.power", STARTER_TEMPLATE, STATES);
    expect(second.text).toBe("{{ states('sensor.power') | float(0) | round(0) | int }}");
    // Words of the author's own are kept: the recipe goes in at the caret.
    const own = "Power: ";
    const kept = applyRecipe(own, own.length, unit, "sensor.power", STARTER_TEMPLATE, STATES);
    expect(kept.text).toBe("Power: {{ states('sensor.power', with_unit=True) }}");
    expect(kept.cursor).toBe(kept.text.length);
  });
});

describe("putting an entity in", () => {
  it("wraps it in braces outside a block and not inside one", () => {
    expect(insideBlock("{{ 1 + ", 7)).toBe(true);
    expect(insideBlock("{{ 1 }} ", 8)).toBe(false);
    expect(insideBlock("{% if ", 6)).toBe(true);
    expect(insertEntity("", undefined, "sensor.power")).toEqual({ text: "{{ states('sensor.power') }}", cursor: 28 });
    expect(insertEntity("Power:", undefined, "sensor.power").text).toBe("Power: {{ states('sensor.power') }}");
    expect(insertEntity("{{  | float }}", 3, "sensor.power").text).toBe("{{ states('sensor.power') | float }}");
  });

  it("clamps the caret into the text", () => {
    expect(insertAt("abc", 99, "X")).toEqual({ text: "abcX", cursor: 4 });
    expect(insertAt("abc", -1, "X")).toEqual({ text: "Xabc", cursor: 1 });
  });
});

describe("the hint", () => {
  it("offers the bare expression only where it works", () => {
    expect(templateHint("text", true)[0]).toContain("write one expression on its own");
    expect(templateHint("text", false)[0]).not.toContain("on its own");
    expect(templateHint("symbol", true)[1]).toContain("SF Symbol name");
    expect(templateHint("symbolMdi", true)[1]).toContain("'mdi:water-' ~ level, does not draw");
  });
});
