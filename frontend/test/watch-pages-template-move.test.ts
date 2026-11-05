import { describe, expect, it } from "vitest";
import { moveTemplateRow, templateRowDropIndex, templateRowShifts } from "../src/watch-pages/template-move.js";
import { templateRows } from "../src/watch-pages/template-rows.js";
import { alignTemplate, scanTemplateSource } from "../src/watch-pages/template-source.js";

/** The text after moving a row, with the rendered text the same as the source
 * unless a test gives its own. */
function moved(doc: string, from: number, to: number, rendered = doc) {
  const scan = scanTemplateSource(doc);
  const aligned = alignTemplate(scan, templateRows(rendered));
  expect(aligned).toBeDefined();
  const move = moveTemplateRow(doc, scan, aligned!, from, to);
  if (move === undefined || !move.ok) return move;
  return doc.slice(0, move.change.from) + move.change.insert + doc.slice(move.change.to);
}

const THREE = "[icon:a] One\n[icon:b] Two\n[icon:c] Three";

describe("moving a template's rows", () => {
  it("moves a row down and up, and changes only the lines it passes", () => {
    expect(moved(THREE, 0, 2)).toBe("[icon:b] Two\n[icon:c] Three\n[icon:a] One");
    expect(moved(THREE, 2, 0)).toBe("[icon:c] Three\n[icon:a] One\n[icon:b] Two");
    expect(moved(THREE, 0, 1)).toBe("[icon:b] Two\n[icon:a] One\n[icon:c] Three");
    const scan = scanTemplateSource(THREE);
    const move = moveTemplateRow(THREE, scan, alignTemplate(scan, templateRows(THREE))!, 1, 2);
    expect(move).toEqual({ ok: true, change: { from: 13, to: THREE.length, insert: "[icon:c] Three\n[icon:b] Two" } });
  });

  it("does nothing for a row that stays, or a row the tile does not draw", () => {
    const scan = scanTemplateSource(THREE);
    const aligned = alignTemplate(scan, templateRows(THREE))!;
    expect(moveTemplateRow(THREE, scan, aligned, 1, 1)).toBeUndefined();
    expect(moveTemplateRow(THREE, scan, aligned, 1, 9)).toBeUndefined();
  });

  it("keeps a line break at the end, and a row's own expressions and comments", () => {
    expect(moved("[icon:a] 1\n[icon:b] 2\n", 1, 0, "[icon:a] 1\n[icon:b] 2\n")).toBe("[icon:b] 2\n[icon:a] 1\n");
    expect(moved("{# first #}[icon:a] {{ x | list\n | count }}\n[icon:b] 2", 0, 1, "[icon:a] 3\n[icon:b] 2")).toBe("[icon:b] 2\n{# first #}[icon:a] {{ x | list\n | count }}");
  });

  it("moves past a line that draws nothing and leaves it in the order it had", () => {
    expect(moved("[icon:a] 1\n\n{# note #}\n[icon:b] 2", 0, 1, "[icon:a] 1\n[icon:b] 2")).toBe("\n{# note #}\n[icon:b] 2\n[icon:a] 1");
  });

  it("moves a row with its own set, when each row sets its own values", () => {
    const doc = "{% set t = states('sensor.a') %}[icon:a] {{ t }}\n{% set t = states('sensor.b') %}[icon:b] {{ t }}";
    expect(moved(doc, 0, 1, "[icon:a] 1\n[icon:b] 2")).toBe("{% set t = states('sensor.b') %}[icon:b] {{ t }}\n{% set t = states('sensor.a') %}[icon:a] {{ t }}");
  });

  it("moves freely under a line of sets, which the move does not pass", () => {
    const doc = "{% set t = 1 %}\n[icon:a] {{ t }}\n[icon:b] {{ t }}";
    expect(moved(doc, 0, 1, "[icon:a] 1\n[icon:b] 1")).toBe("{% set t = 1 %}\n[icon:b] {{ t }}\n[icon:a] {{ t }}");
  });

  it("refuses a move that puts a read before its set", () => {
    expect(moved("{% set t = 1 %}[icon:a] {{ t }}\n[icon:b] {{ t }}", 0, 1, "[icon:a] 1\n[icon:b] 1")).toEqual({ ok: false, reason: "shared" });
    expect(moved("[icon:a] 1\n{% set t = 1 %}\n[icon:b] {{ t }}", 1, 0, "[icon:a] 1\n[icon:b] 1")).toEqual({ ok: false, reason: "shared" });
    expect(moved("{% set ns = namespace(n=1) %}[icon:a] 1\n{% set ns.n = 2 %}[icon:b] 2", 0, 1, "[icon:a] 1\n[icon:b] 2")).toEqual({ ok: false, reason: "shared" });
    expect(moved("{% set a = 1 %}[icon:a] 1\n{% set b = a + 1 %}[icon:b] {{ b }}", 1, 0, "[icon:a] 1\n[icon:b] 2")).toEqual({ ok: false, reason: "shared" });
  });

  it("refuses a move that changes which set a later row reads", () => {
    const doc = "{% set t = 1 %}[icon:a] 1\n{% set t = 2 %}[icon:b] 2\n[icon:c] {{ t }}";
    expect(moved(doc, 0, 1, "[icon:a] 1\n[icon:b] 2\n[icon:c] 2")).toEqual({ ok: false, reason: "shared" });
  });

  it("does not take a word in quotes or a row's words for a read", () => {
    const doc = "{% set t = 1 %}[icon:a] {{ t }}\n[icon:b] t {{ states('sensor.t') }}";
    expect(moved(doc, 0, 1, "[icon:a] 1\n[icon:b] t 2")).toBe("[icon:b] t {{ states('sensor.t') }}\n{% set t = 1 %}[icon:a] {{ t }}");
  });

  it("refuses when a trim mark would join rows", () => {
    expect(moved("[icon:a] 1 {{ 'x' -}}\n[icon:b] 2\n[icon:c] 3", 1, 2, "[icon:a] 1 x\n[icon:b] 2\n[icon:c] 3")).toBe("[icon:a] 1 {{ 'x' -}}\n[icon:c] 3\n[icon:b] 2");
    expect(moved("[icon:a] 1 {{ 'x' -}}\n[icon:b] 2", 0, 1, "[icon:a] 1 x\n[icon:b] 2")).toEqual({ ok: false, reason: "trim" });
  });

  it("refuses a set block, whose reach is not read", () => {
    expect(moved("{% set x %}{% endset %}[icon:a] 1\n[icon:b] 2", 0, 1, "[icon:a] 1\n[icon:b] 2")).toEqual({ ok: false, reason: "shared" });
  });
});

describe("a dragged row's place on the picture", () => {
  const rows = [{ top: 100, height: 20 }, { top: 124, height: 30 }, { top: 158, height: 20 }];

  it("takes a place once its leading edge passes that row's middle", () => {
    expect(templateRowDropIndex(rows, 0, 100)).toBe(0);
    expect(templateRowDropIndex(rows, 0, 118)).toBe(0);
    expect(templateRowDropIndex(rows, 0, 120)).toBe(1);
    expect(templateRowDropIndex(rows, 0, 149)).toBe(2);
    expect(templateRowDropIndex(rows, 2, 158)).toBe(2);
    expect(templateRowDropIndex(rows, 2, 139)).toBe(2);
    expect(templateRowDropIndex(rows, 2, 138)).toBe(1);
    expect(templateRowDropIndex(rows, 2, 100)).toBe(0);
  });

  it("reaches both ends from where the drag stops at the edges", () => {
    const even = [{ top: 0, height: 20 }, { top: 24, height: 20 }, { top: 48, height: 20 }];
    expect(templateRowDropIndex(even, 0, 48)).toBe(2);
    expect(templateRowDropIndex(even, 2, 0)).toBe(0);
    const two = [{ top: 0, height: 20 }, { top: 24, height: 20 }];
    expect(templateRowDropIndex(two, 0, 24)).toBe(1);
    expect(templateRowDropIndex(two, 1, 0)).toBe(0);
  });

  it("stacks the rows in their new order with the same gap, whatever their heights", () => {
    expect(templateRowShifts(rows, 0, 0)).toEqual([0, 0, 0]);
    expect(templateRowShifts(rows, 0, 2)).toEqual([58, -24, -24]);
    expect(templateRowShifts(rows, 2, 0)).toEqual([24, 24, -58]);
    expect(templateRowShifts(rows, 0, 1)).toEqual([34, -24, 0]);
  });
});
