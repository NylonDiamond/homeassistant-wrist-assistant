import { describe, expect, it } from "vitest";
import { setWatchTemplateColumns, watchTemplateColumns } from "../src/watch-pages/app-model.js";
import { templateColumnRows, templateColumnsFontSize, templateRowSpans, templateRows } from "../src/watch-pages/template-rows.js";
import { templateRichTextSegments, templateStyledSegments } from "../src/watch-pages/rich-text.js";
import { templateTextFit } from "../src/watch-pages/template-fit.js";
import { alignTemplate, findTemplatePart, nearestName, namedEntityIds, scanTemplateSource, sourceRowAt, templateNameIssues, templateTokenValues } from "../src/watch-pages/template-source.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";

const TILE = "11111111-1111-4111-8111-111111111111";
const PAGE = "22222222-2222-4222-8222-222222222222";
const documentWith = (entityId: string): WatchPagesDocument => ({
  schemaVersion: 1,
  pages: [{ id: PAGE, name: "A", items: [{ id: TILE, entityId, colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0 }] }],
} as unknown as WatchPagesDocument);
const tileOf = (d: WatchPagesDocument) => (d as unknown as { pages: { items: Record<string, unknown>[] }[] }).pages[0]!.items[0]!;

// The app's `TemplateRichTextTests`, "Coloured text": the same inputs and
// what the app reads from them (`TemplateRichText.styledSegments`, `segments`,
// `rows`, `columnRows`).
describe("coloured text: [color:SPEC] ... [/color]", () => {
  const t = (text: string, color: string | undefined = undefined) => ({ kind: "text", text, color });
  const cell = (symbol: string | undefined, color: string | undefined, text: string, runs: { text: string; color: string | undefined }[] = []) =>
    ({ ...(symbol === undefined ? {} : { icon: { symbol, color } }), text, runs });

  it("starts a run at a colour marker and ends it at the close", () => {
    expect(templateStyledSegments("[color:red]Hot[/color] 21°")).toEqual([t("Hot", "red"), t(" 21°")]);
    // The markers draw nothing and take no width: the words alone.
    expect(templateRichTextSegments("[color:red]Hot[/color] 21°")).toEqual([{ kind: "text", text: "Hot 21°" }]);
    expect(templateRows("[color:red]Hot[/color] 21°")).toEqual([[cell(undefined, undefined, "Hot 21°", [{ text: "Hot", color: "red" }, { text: " 21°", color: undefined }])]]);
  });

  it("lets a template pick the colour", () => {
    expect(templateStyledSegments("[color:red]80°")).toEqual([t("80°", "red")]);
    expect(templateStyledSegments("70°")).toEqual([t("70°")]);
  });

  it("replaces the run with a new colour, and reads hex and case as an icon's own", () => {
    expect(templateStyledSegments("[color:Red]a[color:#36C]b[color: 3366CCFF ]c[/color]d")).toEqual([
      t("a", "Red"), t("b", "#36C"), t("c", "3366CCFF"), t("d"),
    ]);
  });

  it("drops an unknown colour, and the text after it is the ink", () => {
    expect(templateStyledSegments("[color:nope]Warm")).toEqual([t("Warm")]);
    expect(templateStyledSegments("[color:red]a[color:nope]b")).toEqual([t("a", "red"), t("b")]);
    expect(templateStyledSegments("[color:]x")).toEqual([t("x")]);
    // A close with nothing open is dropped too.
    expect(templateStyledSegments("a[/color]b")).toEqual([t("ab")]);
  });

  it("ends an unclosed run at the line break", () => {
    expect(templateStyledSegments("[color:orange]a b\nc")).toEqual([t("a b", "orange"), t("\nc")]);
    expect(templateRows("[color:orange]a b\nc")).toEqual([
      [cell(undefined, undefined, "a b", [{ text: "a b", color: "orange" }])],
      [cell(undefined, undefined, "c")],
    ]);
  });

  it("gives an icon in a run its colour unless it has its own", () => {
    expect(templateStyledSegments("[color:green][icon:leaf] 3 [icon:drop color:blue] 4")).toEqual([
      { kind: "icon", symbol: "leaf", color: undefined, run: "green" },
      t(" 3 ", "green"),
      { kind: "icon", symbol: "drop", color: "blue", run: "green" },
      t(" 4", "green"),
    ]);
    // The plain segments keep each icon's own colour only.
    expect(templateRichTextSegments("[color:green][icon:leaf] 3")).toEqual([{ kind: "icon", symbol: "leaf", color: undefined }, { kind: "text", text: " 3" }]);
    expect(templateRows("[color:green][icon:leaf] 3 [icon:drop color:blue] 4")[0]?.map((c) => c.icon?.color)).toEqual(["green", "blue"]);
  });

  it("carries a run across the cells of a line in Line up columns", () => {
    const rows = templateColumnRows("[icon:a] [color:red]1 [icon:b] 2[/color] x\n[icon:c] 3", true);
    expect(rows).toEqual([
      [
        // The run starts after the first icon, so that icon is ink.
        cell("a", undefined, "1", [{ text: "1", color: "red" }]),
        cell("b", "red", "2 x", [{ text: "2", color: "red" }, { text: " x", color: undefined }]),
      ],
      [cell("c", undefined, "3")],
    ]);
    // The markers change no row or column: the same as without them.
    const plain = templateColumnRows("[icon:a] 1 [icon:b] 2 x\n[icon:c] 3", true);
    expect(rows?.map((r) => r.map((c) => c.text))).toEqual(plain?.map((r) => r.map((c) => c.text)));
    expect(rows?.map((r) => r.map((c) => c.icon?.symbol))).toEqual(plain?.map((r) => r.map((c) => c.icon?.symbol)));
  });

  it("reads the markers in the code as taking no room, so the editor still finds each part's code", () => {
    const scan = scanTemplateSource("[color:red]Hot[/color] 21°");
    expect(scan.rows[0]!.tokens.map((t) => [t.kind, t.src, t.silent === true])).toEqual([
      ["logic", "[color:red]", true], ["text", "Hot", false], ["logic", "[/color]", true], ["text", "21°", false],
    ]);
    const [cell] = templateRows("[color:red]Hot[/color] 21°")[0]!;
    expect(findTemplatePart(scan, cell!, "text")).toEqual({ from: 11, to: 14 });
  });

  it("makes no row of a line of only markers", () => {
    expect(templateRows("a\n[color:red][/color]\nb")).toHaveLength(2);
  });

  it("reads only a lower case marker, as the app does, and keeps the markers out of the fit", () => {
    expect(templateStyledSegments("[Color:red]a")).toEqual([t("[Color:red]a")]);
    const plain = templateTextFit("Hot 21°", 92, 66, 5, "watch");
    const marked = templateTextFit("[color:red]Hot[/color] 21°", 92, 66, 5, "watch");
    expect(marked.size).toBe(plain.size);
    expect(marked.lines.map((l) => l.pieces.map((p) => (p.kind === "text" ? p.text : "")).join(""))).toEqual(plain.lines.map((l) => l.pieces.map((p) => (p.kind === "text" ? p.text : "")).join("")));
  });
});

describe("template rows", () => {
  it("starts a cell at each icon, the rule the app's TemplateRichTextTests pin", () => {
    expect(templateRows("[icon:sofa.fill] Woon [icon:thermometer.medium color:green] 22,1° [icon:drop.fill] 49%")).toEqual([[
      { icon: { symbol: "sofa.fill", color: undefined }, text: "Woon", runs: [] },
      { icon: { symbol: "thermometer.medium", color: "green" }, text: "22,1°", runs: [] },
      { icon: { symbol: "drop.fill", color: undefined }, text: "49%", runs: [] },
    ]]);
  });

  it("makes words before the first icon a cell of their own", () => {
    expect(templateRows("Woon [icon:drop.fill] 49%")).toEqual([[
      { text: "Woon", runs: [] },
      { icon: { symbol: "drop.fill", color: undefined }, text: "49%", runs: [] },
    ]]);
  });

  it("drops lines of white space, and keeps a row of words as one cell", () => {
    expect(templateRows("a b\n  \n\nc")).toEqual([[{ text: "a b", runs: [] }], [{ text: "c", runs: [] }]]);
  });

  it("keeps an icon with nothing after it", () => {
    expect(templateRows("[icon:power]")).toEqual([[{ icon: { symbol: "power", color: undefined }, text: "", runs: [] }]]);
  });

  it("stands in columns only with the key on, two rows and two columns", () => {
    const two = "[icon:a] 1 [icon:b] 2\n[icon:c] 3";
    expect(templateColumnRows(two, false)).toBeUndefined();
    expect(templateColumnRows(two, true)).toHaveLength(2);
    expect(templateColumnRows("[icon:a] 1 [icon:b] 2", true)).toBeUndefined();
    expect(templateColumnRows("one\ntwo", true)).toBeUndefined();
  });

  it("lines up a single column from two rows that start with an icon", () => {
    const rows = templateColumnRows("[icon:heater] Woonkamer 20°\n[icon:power] Aanbouw uit\n[icon:power] Zolder uit", true);
    expect(rows).toHaveLength(3);
    expect(rows?.every(templateRowSpans)).toBe(true);
    expect(templateColumnRows("Rooms\n[icon:a] One\n[icon:b] Two", true)).toHaveLength(3);
    expect(templateColumnRows("[icon:a] One\n[icon:b] Two", false)).toBeUndefined();
    expect(templateColumnRows("[icon:a] One\nTwo", true)).toBeUndefined();
    expect(templateColumnRows("One [icon:a]\nTwo [icon:b]", true)).toHaveLength(2);
  });

  it("runs a row of one cell across the columns", () => {
    const rows = templateColumnRows("[icon:a] Aanb [icon:b] 1\n2026-04-08T21:24:11\n[icon:c] Kant", true) ?? [];
    expect(rows.map(templateRowSpans)).toEqual([false, true, true]);
  });

  it("keeps a long row of one cell out of the columns' widths", () => {
    const short = templateRows("[icon:a] A [icon:b] 1");
    const withLong = templateRows("[icon:a] A [icon:b] 1\nabcdefghij");
    expect(templateColumnsFontSize(withLong, 500, 500, 16, "watch")).toBe(templateColumnsFontSize(short, 500, 500, 16, "watch"));
    // It still has to fit, so it can shrink them all, but no more than its own width asks.
    const room = 130;
    expect(templateColumnsFontSize(templateRows("[icon:a] A [icon:b] 1\n2026-04-08T21:24:11.382181+00:00"), room, 500, 16, "watch")).toBeCloseTo(room / 17.27, 0);
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
    expect(findTemplatePart(scan, { icon: { symbol: "power", color: undefined }, text: "On", runs: [] }, "icon")).toEqual({ from: 10, to: 22 });
    expect(findTemplatePart(scan, { text: "On", runs: [] }, "text")).toEqual({ from: 23, to: 25 });
    expect(findTemplatePart(scan, { text: "Sam", runs: [] }, "text")).toBeUndefined();
  });

  it("says nothing when the two cannot be lined up with certainty", () => {
    const scan = scanTemplateSource(source);
    expect(alignTemplate(scan, templateRows("only one row"))).toBeUndefined();
    expect(alignTemplate(scan, templateRows("[icon:power] Woon [icon:thermometer.medium] 1\n[icon:fork.knife] Keuk"))).toBeUndefined();
    expect(alignTemplate(scanTemplateSource("{% if a %}x{% endif %}"), templateRows("x"))).toBeUndefined();
    expect(alignTemplate(scanTemplateSource("a {{ b"), templateRows("a"))).toBeUndefined();
  });
});
