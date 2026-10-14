// Material Design icons in rich text icon parts. The watch has no MDI
// catalogue, so an icon part carries the drawing of every `mdi:` name it can
// draw (`iconPaths`), found where the author wrote it out: the part's own
// value, typed or a template's source, and the icon changes aimed at the part.
// This file pins the wire shape, how the editor keeps the drawings in step,
// how the resolver picks one, and the preview.

import { afterEach, describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  auditUnknownKeys,
  encodeConfig,
  literal,
  newConfig,
  newElement,
  parseConfig,
  syncRichTextFallback,
  type CustomComplicationConfig,
  type Element,
  type Rule,
  type StyleChange,
  type TextElement,
  type TextPart,
  type Value,
} from "../src/model.js";
import { keyFor } from "../src/compiler.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type ResolvedText } from "../src/resolver.js";
import { Draft } from "../src/draft.js";
import { PART_ICON_PATHS_MAX, documentNamesPartMdi, mdiNamesIn, syncPartIconPaths } from "../src/part-icons.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";

const WATER = "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";
const ALERT = "M8,2C8,2 2,8.75 2,12.5A6,6 0 0,0 8,18.5Z";
const CATALOGUE: Record<string, string> = { "mdi:water": WATER, "mdi:water-alert": ALERT, "mdi:flash": "M7,2V13H10V22L17,10H13L17,2H7Z" };
const lookup = (name: string) => CATALOGUE[name];

const jinja = (source: string): Value => ({ kind: { kind: "jinja", value: source } });
const iconPart = (id: string, icon: Value, extra: Partial<TextPart> = {}): TextPart => ({ id, value: literal(""), icon, ...extra });
const FLOW = jinja("{{ 'mdi:water-alert' if states('sensor.flow') | float(0) > 0 else 'mdi:water' }}");

function always(then: StyleChange[], partId?: string): Rule {
  return {
    id: "D2000000-0000-4000-8000-000000000001",
    cases: [{ id: "C2000000-0000-4000-8000-000000000001", when: { join: "all", tests: [] }, then }],
    ...(partId !== undefined ? { partId } : {}),
  };
}

function textConfig(tweak: (p: TextElement) => void): CustomComplicationConfig {
  const cfg = newConfig("Water", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  syncRichTextFallback(el.payload);
  cfg.elements = [el];
  return cfg;
}

const textOf = (cfg: CustomComplicationConfig) => (cfg.elements[0] as Extract<Element, { kind: "text" }>).payload;
const firstPart = (cfg: CustomComplicationConfig) => textOf(cfg).parts![0]!;

function resolvedText(cfg: CustomComplicationConfig, templates: [Value, string][] = []): ResolvedText {
  const templateResults = new Map(templates.map(([v, r]) => [keyFor(v, cfg.values)!, r]));
  return resolveAll(cfg, { entityStates: new Map(), templateResults, historySeries: new Map(), namedValues: cfg.values })
    .rectangular!.elements[0] as ResolvedText;
}

describe("the names an icon value writes out", () => {
  it("finds every mdi: name in a template, in order, and a typed one", () => {
    expect(mdiNamesIn(FLOW, [])).toEqual(["mdi:water-alert", "mdi:water"]);
    expect(mdiNamesIn(literal(" mdi:flash "), [])).toEqual(["mdi:flash"]);
    expect(mdiNamesIn(literal("drop.fill"), [])).toEqual([]);
  });

  it("follows a shared value, and stops on a loop", () => {
    const values = [
      { id: "AAAAAAA1-0000-4000-8000-000000000001", name: "Flow icon", value: FLOW },
      { id: "AAAAAAA2-0000-4000-8000-000000000002", name: "Loop", value: { kind: { kind: "named", id: "AAAAAAA2-0000-4000-8000-000000000002" } } as Value },
    ];
    expect(mdiNamesIn({ kind: { kind: "named", id: "aaaaaaa1-0000-4000-8000-000000000001" } }, values)).toEqual(["mdi:water-alert", "mdi:water"]);
    expect(mdiNamesIn(values[1]!.value, values)).toEqual([]);
  });

  it("reads a name built at run time as no name at all", () => {
    // `mdi:water-` is not a whole name; the catalogue does not know it, so
    // nothing is carried for it.
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, jinja("{{ 'mdi:water-' ~ level }}"))]; });
    syncPartIconPaths(cfg, lookup);
    expect(firstPart(cfg).iconPaths).toBeUndefined();
  });
});

describe("keeping an icon part's drawings in step", () => {
  it("carries the drawing of each name the template writes out", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, FLOW), { id: PART_B, value: literal(" 3 L") }]; });
    expect(syncPartIconPaths(cfg, lookup)).toBe(true);
    expect(firstPart(cfg).iconPaths).toEqual({ "mdi:water-alert": ALERT, "mdi:water": WATER });
    expect(textOf(cfg).parts![1]!.iconPaths).toBeUndefined();
    // Nothing to change the second time round.
    expect(syncPartIconPaths(cfg, lookup)).toBe(false);
  });

  it("adds the names an icon change aimed at the part writes out, and no other part's", () => {
    const cfg = textConfig((p) => {
      p.parts = [iconPart(PART_A, literal("drop.fill")), iconPart(PART_B, literal("star.fill"))];
      p.rules = [always([{ kind: "setIcon", value: literal("mdi:flash") }], PART_A)];
    });
    syncPartIconPaths(cfg, lookup);
    expect(firstPart(cfg).iconPaths).toEqual({ "mdi:flash": CATALOGUE["mdi:flash"] });
    expect(textOf(cfg).parts![1]!.iconPaths).toBeUndefined();
  });

  it("keeps a drawing it already carries while the catalogue cannot answer, and drops a name no longer written", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, FLOW, { iconPaths: { "mdi:water": WATER, "mdi:gone": "M0,0Z" } })]; });
    syncPartIconPaths(cfg, () => undefined);
    expect(firstPart(cfg).iconPaths).toEqual({ "mdi:water": WATER });
  });

  it("takes the key off a part that names no Material Design icon any more", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, literal("drop.fill"), { iconPaths: { "mdi:water": WATER } })]; });
    syncPartIconPaths(cfg, lookup);
    expect("iconPaths" in firstPart(cfg)).toBe(false);
  });

  it("keeps at most the first names written", () => {
    const names = Array.from({ length: PART_ICON_PATHS_MAX + 4 }, (_, i) => `mdi:n${i}`);
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, jinja(names.map((n) => `'${n}'`).join(" ")))]; });
    syncPartIconPaths(cfg, () => "M0,0Z");
    expect(Object.keys(firstPart(cfg).iconPaths!)).toEqual(names.slice(0, PART_ICON_PATHS_MAX));
  });

  it("walks a list's row layers too", () => {
    const cfg = newConfig("List", 0);
    const list = newElement("list") as Extract<Element, { kind: "list" }>;
    const row = newElement("text") as Extract<Element, { kind: "text" }>;
    row.payload.parts = [iconPart(PART_A, FLOW)];
    list.payload.template = [row];
    cfg.elements = [list];
    expect(documentNamesPartMdi(cfg)).toBe(true);
    syncPartIconPaths(cfg, lookup);
    expect(row.payload.parts[0]!.iconPaths).toEqual({ "mdi:water-alert": ALERT, "mdi:water": WATER });
  });

  describe("on every edit", () => {
    afterEach(() => { Draft.mdiPath = undefined; });

    it("fills the drawings in as the template is typed", () => {
      Draft.mdiPath = lookup;
      const draft = new Draft(textConfig((p) => { p.parts = [iconPart(PART_A, literal("drop.fill"))]; }), null);
      draft.update((c) => { firstPart(c).icon = FLOW; });
      expect(firstPart(draft.config).iconPaths).toEqual({ "mdi:water-alert": ALERT, "mdi:water": WATER });
    });

    it("finishes an edit made before the catalogue arrived", () => {
      let ready = false;
      Draft.mdiPath = (n) => (ready ? lookup(n) : undefined);
      const draft = new Draft(textConfig((p) => { p.parts = [iconPart(PART_A, literal("drop.fill"))]; }), null);
      draft.update((c) => { firstPart(c).icon = FLOW; });
      expect(firstPart(draft.config).iconPaths).toBeUndefined();
      ready = true;
      expect(draft.refreshIconPaths()).toBe(true);
      expect(Object.keys(firstPart(draft.config).iconPaths!)).toEqual(["mdi:water-alert", "mdi:water"]);
    });
  });
});

describe("icon part drawings on the wire", () => {
  it("writes iconPaths right after icon, sorted by name, and reads it back", () => {
    const cfg = textConfig((p) => {
      p.parts = [iconPart(PART_A, FLOW, { iconPaths: { "mdi:water-alert": ALERT, "mdi:water": WATER }, colorHex: "#64D2FF" })];
    });
    const encoded = encodeConfig(cfg) as Record<string, unknown>;
    const part = (((encoded.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>).parts as Record<string, unknown>[])[0]!;
    expect(Object.keys(part)).toEqual(["id", "value", "icon", "iconPaths", "colorHex"]);
    expect(Object.keys(part.iconPaths as object)).toEqual(["mdi:water", "mdi:water-alert"]);
    expect(auditUnknownKeys(encoded)).toEqual([]);
    const back = parseConfig(JSON.parse(JSON.stringify(encoded)));
    expect(firstPart(back).iconPaths).toEqual({ "mdi:water": WATER, "mdi:water-alert": ALERT });
  });

  it("drops an entry that is not a drawing", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, FLOW)]; });
    const encoded = encodeConfig(cfg) as Record<string, unknown>;
    const part = (((encoded.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>).parts as Record<string, unknown>[])[0]!;
    part.iconPaths = { "mdi:water": WATER, "mdi:bad": 3, "mdi:empty": "" };
    expect(firstPart(parseConfig(encoded)).iconPaths).toEqual({ "mdi:water": WATER });
  });
});

describe("resolving a Material Design icon part", () => {
  const carried = { iconPaths: { "mdi:water-alert": ALERT, "mdi:water": WATER } };

  it("draws the name a template renders with the drawing the part carries", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, FLOW, carried), { id: PART_B, value: literal(" 3 L") }]; });
    expect(resolvedText(cfg, [[FLOW, "mdi:water-alert"]]).parts![0]).toMatchObject({ text: "", symbol: "mdi:water-alert", path: ALERT });
    expect(resolvedText(cfg, [[FLOW, " mdi:water\n"]]).parts![0]).toMatchObject({ symbol: "mdi:water", path: WATER });
  });

  it("leaves the part out for a name it carries no drawing of", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, FLOW, carried), { id: PART_B, value: literal(" 3 L") }]; });
    expect(resolvedText(cfg, [[FLOW, "mdi:fire"]]).parts!.map((x) => x.text)).toEqual([" 3 L"]);
  });

  it("takes an icon change aimed at the part, with the part's drawing", () => {
    const cfg = textConfig((p) => {
      p.parts = [iconPart(PART_A, literal("drop.fill"), { iconPaths: { "mdi:flash": CATALOGUE["mdi:flash"]! } })];
      p.rules = [always([{ kind: "setIcon", value: literal("mdi:flash") }], PART_A)];
    });
    expect(resolvedText(cfg).parts![0]).toMatchObject({ symbol: "mdi:flash", path: CATALOGUE["mdi:flash"] });
  });

  it("leaves an SF Symbol part as it was, with no path", () => {
    const cfg = textConfig((p) => { p.parts = [iconPart(PART_A, literal("drop.fill"), carried)]; });
    const part = resolvedText(cfg).parts![0]!;
    expect(part.symbol).toBe("drop.fill");
    expect("path" in part).toBe(false);
  });
});

describe("a Material Design icon part in the preview", () => {
  const drawn: string[] = [];
  const icons: IconProvider = {
    render: (symbol) => {
      drawn.push(symbol);
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

  it("draws the carried drawing, not the catalogue", () => {
    drawn.length = 0;
    const cfg = textConfig((p) => {
      p.parts = [iconPart(PART_A, literal("mdi:water"), { iconPaths: { "mdi:water": WATER } }), { id: PART_B, value: literal(" 3 L") }];
    });
    const layout = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), historySeries: new Map(), namedValues: cfg.values }).rectangular!;
    const svg = flatten(renderLayout(layout, { icons }));
    expect(drawn).toEqual([]);
    expect(svg).toContain(WATER);
    expect(svg.indexOf(WATER)).toBeLessThan(svg.indexOf(" 3 L"));
  });
});
