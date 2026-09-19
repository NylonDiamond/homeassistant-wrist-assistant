// The words under a states table: its empty state, and the colors a new row
// starts with so a table works from its first row.

import { describe, expect, it } from "vitest";
import { type Rule, literal } from "../src/model.js";
import { addStateRow, seedRowColor, setOtherwise, statesEmptyText } from "../src/states.js";

describe("states table wording", () => {
  it("says layer, or shape for a layout", () => {
    expect(statesEmptyText("icon")).toContain("layer");
    expect(statesEmptyText("layout")).toContain("shape");
  });

  it("writes one short sentence per line, with no dashes", () => {
    for (const target of ["text", "chart", "layout"]) {
      const line = statesEmptyText(target);
      expect(line).toMatch(/^[A-Z][^.]*\.( [A-Z][^.]*\.)?$/);
      expect(line).not.toMatch(/[—–]| - /);
    }
  });
});

describe("seeded colors", () => {
  const colorOf = (rules: Rule[], i: number) => {
    const ch = rules[0]!.cases[i]!.then[0];
    return ch?.kind === "setColor" && ch.value?.kind.kind === "literal" ? ch.value.kind.value : undefined;
  };

  it("runs a band table red, amber, green from the top", () => {
    const rules: Rule[] = [];
    addStateRow(rules, literal("50"), true, true);
    addStateRow(rules, literal("50"), true, true);
    addStateRow(rules, literal("50"), true, true);
    addStateRow(rules, literal("50"), true, true);
    expect([0, 1, 2, 3].map((i) => colorOf(rules, i))).toEqual(["#FF453A", "#FF9F0A", "#30D158", "#30D158"]);
  });

  it("reads on as green and off as grey", () => {
    const rules: Rule[] = [];
    addStateRow(rules, literal("on"), false, true);
    addStateRow(rules, literal("on"), false, true);
    expect([0, 1].map((i) => colorOf(rules, i))).toEqual(["#30D158", "#8E8E93"]);
    expect(seedRowColor({ kind: "isOff" }, 0).value?.kind).toEqual({ kind: "literal", value: "#8E8E93" });
  });

  it("starts a seeded Otherwise green and leaves an unseeded one empty", () => {
    const seeded: Rule[] = [];
    setOtherwise(seeded, true, true);
    expect(seeded[0]!.otherwise).toEqual([{ kind: "setColor", value: literal("#30D158") }]);
    const plain: Rule[] = [];
    setOtherwise(plain, true);
    expect(plain[0]!.otherwise).toEqual([]);
  });

  it("leaves a row empty unless asked to seed it", () => {
    const rules: Rule[] = [];
    addStateRow(rules, literal("50"), true);
    expect(rules[0]!.cases[0]!.then).toEqual([]);
  });
});
