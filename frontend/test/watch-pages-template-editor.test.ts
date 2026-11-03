import { describe, expect, it } from "vitest";
import { setWatchTemplateColumns, watchTemplateColumns } from "../src/watch-pages/app-model.js";
import { templateColumnRows, templateColumnsFontSize, templateRows } from "../src/watch-pages/template-rows.js";
import { alignTemplate, findTemplatePart, nearestName, namedEntityIds, scanTemplateSource, sourceRowAt, templateNameIssues, templateTokenValues } from "../src/watch-pages/template-source.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";

const TILE = "11111111-1111-4111-8111-111111111111";
const PAGE = "22222222-2222-4222-8222-222222222222";
const documentWith = (entityId: string): WatchPagesDocument => ({
  schemaVersion: 1,
  pages: [{ id: PAGE, name: "A", items: [{ id: TILE, entityId, colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 }] }],
} as unknown as WatchPagesDocument);
const tileOf = (d: WatchPagesDocument) => (d as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

describe("template rows", () => {
  it("starts a cell at each icon, the rule the app's TemplateRichTextTests pin", () => {
    expect(templateRows("[icon:sofa.fill] Woon [icon:thermometer.medium color:green] 22,1° [icon:drop.fill] 49%")).toEqual([[
      { icon: { symbol: "sofa.fill", color: undefined }, text: "Woon" },
      { icon: { symbol: "thermometer.medium", color: "green" }, text: "22,1°" },
      { icon: { symbol: "drop.fill", color: undefined }, text: "49%" },
    ]]);
  });

  it("makes words before the first icon a cell of their own", () => {
    expect(templateRows("Woon [icon:drop.fill] 49%")).toEqual([[
      { text: "Woon" },
      { icon: { symbol: "drop.fill", color: undefined }, text: "49%" },
    ]]);
  });

  it("drops lines of white space, and keeps a row of words as one cell", () => {
    expect(templateRows("a b\n  \n\nc")).toEqual([[{ text: "a b" }], [{ text: "c" }]]);
  });

  it("keeps an icon with nothing after it", () => {
    expect(templateRows("[icon:power]")).toEqual([[{ icon: { symbol: "power", color: undefined }, text: "" }]]);
  });

  it("stands in columns only with the key on, two rows and two columns", () => {
    const two = "[icon:a] 1 [icon:b] 2\n[icon:c] 3";
    expect(templateColumnRows(two, false)).toBeUndefined();
    expect(templateColumnRows(two, true)).toHaveLength(2);
    expect(templateColumnRows("[icon:a] 1 [icon:b] 2", true)).toBeUndefined();
    expect(templateColumnRows("one\ntwo", true)).toBeUndefined();
  });

  it("sizes columns by the widest cell of each, and stops at 40%", () => {
    const rows = templateRows("[icon:a] Woon [icon:b] 22,1°\n[icon:a] K [icon:b] 9°");
    expect(templateColumnsFontSize(rows, 500, 500, 16)).toBe(16);
    const tight = templateColumnsFontSize(rows, 100, 500, 16);
    expect(tight).toBeLessThan(16);
    expect(tight).toBeGreaterThanOrEqual(6.4);
    expect(templateColumnsFontSize(rows, 5, 5, 16)).toBe(6.4);
  });
});

describe("the columns key", () => {
  it("is on when absent, false only while off, and only on a template tile", () => {
    const template = documentWith(`template.${TILE}`);
    expect(watchTemplateColumns(tileOf(template) as never)).toBe(true);
    const off = setWatchTemplateColumns(template, PAGE, TILE, false);
    expect(tileOf(off)["templateColumns"]).toBe(false);
    expect(watchTemplateColumns(tileOf(off) as never)).toBe(false);
    const on = setWatchTemplateColumns(off, PAGE, TILE, true);
    expect(Object.hasOwn(tileOf(on), "templateColumns")).toBe(false);
    expect(Object.hasOwn(tileOf(setWatchTemplateColumns(documentWith("light.a"), PAGE, TILE, false)), "templateColumns")).toBe(false);
  });
});

describe("the source of a template", () => {
  const source = "[icon:sofa.fill] Woon [icon:thermometer.medium color:{{ 'cyan' if states('sensor.woon')|float(0) < 16 else 'green' }}] {{ states('sensor.woon') }}°\n[icon:fork.knife] Keuk";

  it("ends a row at a line break outside a marker or an expression", () => {
    const split = scanTemplateSource("{{ states(\n'a.b') }} x\ny");
    expect(split.rows).toHaveLength(2);
    expect(split.rows[0]!.tokens.map((t) => t.kind)).toEqual(["expr", "text"]);
    const scan = scanTemplateSource(source);
    expect(scan.rows).toHaveLength(2);
    expect(scan.rows[0]!.tokens.map((t) => t.kind)).toEqual(["icon", "text", "icon", "expr", "text"]);
    expect(scan.rows[0]!.tokens[4]!.glued).toBe(true);
    expect(scan.rows[0]!.tokens[1]!.glued).toBe(false);
    expect(sourceRowAt(scan.rows, source.length)).toBe(1);
  });

  it("says what never closes and offers the fix", () => {
    expect(scanTemplateSource("a {{ b").open?.fix).toEqual({ from: 6, to: 6, insert: " }}", words: "Add }}" });
    expect(scanTemplateSource("[icon:x").open?.fix?.insert).toBe("]");
    expect(scanTemplateSource("{% if").open?.fix?.insert).toBe(" %}");
    expect(scanTemplateSource("fine {{ a }}").open).toBeUndefined();
  });

  it("finds names that do not exist, skips what is being typed, and offers the nearest", () => {
    const scan = scanTemplateSource("[icon:lightbulb.fil] {{ states('sensor.woon_tmp') }}");
    const names = { entities: ["sensor.woon_temp", "light.a"], symbols: ["lightbulb.fill", "power"] };
    const found = templateNameIssues(scan, names, 0);
    expect(found.map((x) => x.kind)).toEqual(["icon", "entity"]);
    expect(found[0]!.fix?.insert).toBe("lightbulb.fill");
    expect(found[1]!.fix?.insert).toBe("sensor.woon_temp");
    expect(templateNameIssues(scan, names, 8).map((x) => x.kind)).toEqual(["entity"]);
    expect(templateNameIssues(scan, { ...names, symbols: undefined }, 0).map((x) => x.kind)).toEqual(["entity"]);
  });

  it("does not take a word with no such domain for an entity, nor check a symbol from an expression", () => {
    expect(namedEntityIds("selectattr('attributes.device_class','eq','door')", new Set(["sensor"]))).toEqual([]);
    const scan = scanTemplateSource("[icon:{{ 'a' }}] [icon:mdi:water]");
    expect(templateNameIssues(scan, { entities: [], symbols: ["power"] }, -1)).toEqual([]);
  });

  it("only suggests a name close enough to be a typo", () => {
    expect(nearestName("sensor.x", ["sensor.y"])).toBe("sensor.y");
    expect(nearestName("sensor.kitchen", ["light.something_else_entirely"])).toBeUndefined();
  });

  it("lines the rendered tile up with the source, part by part", () => {
    const scan = scanTemplateSource(source);
    const aligned = alignTemplate(scan, templateRows("[icon:sofa.fill] Woon [icon:thermometer.medium color:green] 22,3°\n[icon:fork.knife] Keuk"));
    expect(aligned).toHaveLength(2);
    const cell = aligned![0]!.cells[1]!;
    expect(source.slice(cell.icon!.from, cell.icon!.to).startsWith("[icon:thermometer")).toBe(true);
    expect(source.slice(cell.text!.from, cell.text!.to)).toBe("{{ states('sensor.woon') }}°");
    expect(templateTokenValues(aligned).get(cell.tokens[1]!.from)).toBe("22,3");
  });

  it("lines up a template whose set lines draw nothing, with icons from expressions", () => {
    const text = "{% set t = states('sensor.a') %}{% set ti = 'x' %}[icon:books.fill] Aanb [icon:{{ ti }} color:{{ tc }}] {{ t }}\\n{# note #}[icon:power] Kant [icon:{{ ti }}] {{ t }}".replace("\\n", "\n");
    const scan = scanTemplateSource(text);
    const aligned = alignTemplate(scan, templateRows("[icon:books.fill] Aanb [icon:thermometer.low color:#123] 1\n[icon:power] Kant [icon:thermometer.low] 2"));
    expect(aligned).toHaveLength(2);
    const cell = aligned![0]!.cells[1]!;
    expect(text.slice(cell.icon!.from, cell.icon!.to)).toBe("[icon:{{ ti }} color:{{ tc }}]");
    expect(text.slice(cell.text!.from, cell.text!.to)).toBe("{{ t }}");
  });

  it("finds the end of a marker past a ] inside an expression", () => {
    const scan = scanTemplateSource("[icon:a color:{{ x['b'] }}] c");
    expect(scan.rows[0]!.tokens.map((t) => t.src)).toEqual(["[icon:a color:{{ x['b'] }}]", "c"]);
    expect(scanTemplateSource("[icon:a\nb]").open).toBeDefined();
  });

  it("guesses at a part when logic stops the two lining up, and says nothing when no one place wrote it", () => {
    const scan = scanTemplateSource("{% if a %}[icon:power] On{% endif %}");
    expect(findTemplatePart(scan, { icon: { symbol: "power", color: undefined }, text: "On" }, "icon")).toEqual({ from: 10, to: 22 });
    expect(findTemplatePart(scan, { text: "On" }, "text")).toEqual({ from: 23, to: 25 });
    expect(findTemplatePart(scan, { text: "Sam" }, "text")).toBeUndefined();
  });

  it("says nothing when the two cannot be lined up with certainty", () => {
    const scan = scanTemplateSource(source);
    expect(alignTemplate(scan, templateRows("only one row"))).toBeUndefined();
    expect(alignTemplate(scan, templateRows("[icon:power] Woon [icon:thermometer.medium] 1\n[icon:fork.knife] Keuk"))).toBeUndefined();
    expect(alignTemplate(scanTemplateSource("{% if a %}x{% endif %}"), templateRows("x"))).toBeUndefined();
    expect(alignTemplate(scanTemplateSource("a {{ b"), templateRows("a"))).toBeUndefined();
  });
});
