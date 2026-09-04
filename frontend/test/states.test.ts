// The states table's predicate and its round trip. The table is only allowed
// to exist when it can show a rule truthfully, and it must write back exactly
// the rule it read: everything else in the panel, and both Apple clients, keep
// reading the same ordinary Rule.

import { describe, expect, it } from "vitest";
import { colorWords } from "../src/editors.js";
import {
  type Comparison,
  type Rule,
  type RuleTarget,
  type StyleChange,
  type Value,
  RULE_TARGET_PROPERTIES,
  encodeConfig,
  encodeRules,
  literal,
  newCase,
  newConfig,
  newElement,
  newId,
  newRule,
  newStyleChange,
  newTest,
} from "../src/model.js";
import {
  type StatesRowInput,
  DEFAULT_COLUMN,
  addStateRow,
  buildStatesRule,
  cellChange,
  compileTable,
  looksBinary,
  moveStateRow,
  nextComparison,
  removeColumn,
  removeStateRow,
  setOtherwise,
  setTestedValue,
  shownColumns,
  statesSummary,
  tableShape,
  usedColumns,
  valuesEqual,
  whenText,
} from "../src/states.js";

const kitchen = (): Value => ({ kind: { kind: "entityState", entityId: "light.kitchen", displayName: "Kitchen light", domain: "light" } });
const hall = (): Value => ({ kind: { kind: "entityState", entityId: "light.hall", displayName: "Hall light", domain: "light" } });
const temp = (): Value => ({ kind: { kind: "entityState", entityId: "sensor.temp", displayName: "Temperature", domain: "sensor" } });

function icon(name: string): StyleChange {
  return { kind: "setIcon", value: literal(name) };
}
function colour(hex: string): StyleChange {
  return { kind: "setColor", value: literal(hex) };
}

/** A two-state light: on, then Otherwise. */
function lightRule(): Rule {
  return buildStatesRule(
    kitchen(),
    [{ comparison: { kind: "isOn" }, changes: [icon("lightbulb.fill"), colour("#FFD60A")] }],
    [icon("lightbulb"), colour("#8E8E93")],
  );
}

describe("tableShape", () => {
  it("calls no rules an empty table", () => {
    const shape = tableShape([]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.rows).toEqual([]);
    expect(shape.table.columns).toEqual([]);
    expect(shape.table.value).toBeUndefined();
    expect(shape.table.ruleId).toBe("");
  });

  it("reads one rule with two cases as two rows sharing a value", () => {
    const rule = buildStatesRule(kitchen(), [
      { comparison: { kind: "isOn" }, changes: [icon("lightbulb.fill")] },
      { comparison: { kind: "isUnavailable" }, changes: [colour("#FF453A")] },
    ]);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.rows).toHaveLength(2);
    expect(shape.table.rows[0]!.comparison.kind).toBe("isOn");
    expect(shape.table.value && valuesEqual(shape.table.value, kitchen())).toBe(true);
    expect(shape.table.columns).toEqual(["icon", "color"]);
    expect(shape.table.numberMode).toBe(false);
  });

  it("carries the otherwise row and its columns", () => {
    const shape = tableShape([lightRule()]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.otherwise).toHaveLength(2);
    expect(shape.table.columns).toEqual(["icon", "color"]);
  });

  it("refuses two rules", () => {
    const shape = tableShape([lightRule(), lightRule()]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("2 rules");
  });

  it("refuses cases that test different values", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [] }]);
    const second = newCase();
    second.when.tests[0]!.value = hall();
    rule.cases.push(second);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("different values");
  });

  it("refuses a case with two tests", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [] }]);
    rule.cases[0]!.when.tests.push({ ...newTest(), value: kitchen() });
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("2 things at once");
  });

  it("refuses a case with no tests at all", () => {
    const rule = newRule();
    rule.cases[0]!.when.tests = [];
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("checks nothing");
  });

  it("refuses a comparison a row cannot show", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "matchesRegex", pattern: "^on$" }, changes: [] }]);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("matches regex");
  });

  it("refuses a state that sets one property twice", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [colour("#FF453A"), colour("#FFD60A")] }]);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(false);
    if (shape.ok) return;
    expect(shape.reason).toContain("Colour twice");
  });

  it("sees a numeric band rule as a table in number mode", () => {
    const rule = bandRule();
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.numberMode).toBe(true);
    expect(shape.table.rows.map((r) => whenText(r.comparison))).toEqual(["below 20", "20 to 50", "above 50"]);
  });

  it("treats hide and show as one Visible column", () => {
    const rule = buildStatesRule(temp(), [
      { comparison: { kind: "greaterThan", value: literal("50") }, changes: [{ kind: "hide" }] },
      { comparison: { kind: "lessOrEqual", value: literal("50") }, changes: [{ kind: "show" }] },
    ]);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.columns).toEqual(["visibility"]);
  });
});

/** low, mid, high: exactly what the gauge preset builds. */
function bandRule(): Rule {
  const rows: StatesRowInput[] = [
    { comparison: { kind: "lessThan", value: literal("20") }, changes: [colour("#34C759")] },
    { comparison: { kind: "between", value: literal("20"), upper: literal("50") }, changes: [colour("#FFD60A")] },
    { comparison: { kind: "greaterThan", value: literal("50") }, changes: [colour("#FF453A")] },
  ];
  return buildStatesRule(temp(), rows);
}

describe("compileTable", () => {
  it("writes back exactly the rule it read", () => {
    for (const rule of [lightRule(), bandRule()]) {
      const shape = tableShape([rule]);
      expect(shape.ok).toBe(true);
      if (!shape.ok) return;
      expect(encodeRules(compileTable(shape.table))).toEqual(encodeRules([rule]));
    }
  });

  it("matches a hand-built rule change for change", () => {
    const built = buildStatesRule(
      kitchen(),
      [{ comparison: { kind: "isOn" }, changes: [icon("lightbulb.fill")] }],
      [icon("lightbulb")],
      "RULE",
    );
    const hand: Rule = {
      id: "RULE",
      cases: [{
        id: built.cases[0]!.id,
        when: { join: "all", tests: [{ id: built.cases[0]!.when.tests[0]!.id, value: kitchen(), comparison: { kind: "isOn" } }] },
        then: [icon("lightbulb.fill")],
      }],
      otherwise: [icon("lightbulb")],
    };
    expect(encodeRules([built])).toEqual(encodeRules([hand]));
  });

  it("stores nothing for a table with no rows and no otherwise", () => {
    expect(compileTable({ ruleId: "", rows: [], columns: [], numberMode: false })).toEqual([]);
  });

  it("keeps an otherwise-only table as one rule with no cases", () => {
    const rules = compileTable({ ruleId: "R", rows: [], columns: ["color"], numberMode: false, otherwise: [colour("#FFFFFF")] });
    expect(rules).toHaveLength(1);
    expect(rules[0]!.cases).toEqual([]);
    expect(rules[0]!.otherwise).toHaveLength(1);
  });

  it("keeps a case's join when it was not the default", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [], join: "any" }]);
    const shape = tableShape([rule]);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(encodeRules(compileTable(shape.table))).toEqual(encodeRules([rule]));
  });
});

describe("whenText", () => {
  it("reads numeric rows as thresholds", () => {
    const cases: [Comparison, string][] = [
      [{ kind: "lessThan", value: literal("20") }, "below 20"],
      [{ kind: "lessOrEqual", value: literal("20") }, "20 or below"],
      [{ kind: "between", value: literal("20"), upper: literal("50") }, "20 to 50"],
      [{ kind: "greaterOrEqual", value: literal("50") }, "50 or above"],
      [{ kind: "greaterThan", value: literal("50") }, "above 50"],
    ];
    for (const [c, text] of cases) expect(whenText(c)).toBe(text);
  });

  it("keeps the plain wording for everything else", () => {
    expect(whenText({ kind: "isOn" })).toBe("is on");
    expect(whenText({ kind: "equals", value: literal("heat") })).toBe("equals heat");
    expect(whenText({ kind: "isUnavailable" })).toBe("is unavailable or unknown");
  });

  it("uses the caller's own words for a value it cannot read", () => {
    expect(whenText({ kind: "greaterThan", value: kitchen() }, () => "Kitchen light")).toBe("above Kitchen light");
  });
});

describe("columns", () => {
  it("orders used columns the way the header reads", () => {
    const rows = [{ caseId: "C", testId: "T", join: "all" as const, comparison: { kind: "isOn" } as Comparison, changes: [colour("#fff"), icon("bolt")] }];
    expect(usedColumns(rows)).toEqual(["icon", "color"]);
  });

  it("adds picked columns and drops anything this layer ignores", () => {
    const allowed = ["color", "opacity", "icon", "fontSize", "rotation", "visibility"] as const;
    expect(shownColumns(["color"], ["fontSize", "gaugeMin"], allowed)).toEqual(["color", "fontSize"]);
  });

  it("finds the change a cell shows", () => {
    const changes = [icon("bolt"), colour("#fff")];
    expect(cellChange(changes, "color")).toBe(changes[1]);
    expect(cellChange(changes, "opacity")).toBeUndefined();
  });
});

describe("new row defaults", () => {
  it("answers an on row with an off row", () => {
    expect(nextComparison({ kind: "isOn" }, false)).toEqual({ kind: "isOff" });
  });

  it("starts the next band where the last one stopped", () => {
    expect(nextComparison({ kind: "lessThan", value: literal("20") }, true)).toEqual({ kind: "greaterOrEqual", value: literal("20") });
    expect(nextComparison({ kind: "between", value: literal("20"), upper: literal("50") }, true)).toEqual({ kind: "greaterOrEqual", value: literal("50") });
  });

  it("starts a first row from the kind of table it is", () => {
    expect(nextComparison(undefined, false)).toEqual({ kind: "isOn" });
    expect(nextComparison(undefined, true).kind).toBe("lessThan");
  });

  it("knows which entities read as on or off", () => {
    expect(looksBinary(kitchen())).toBe(true);
    expect(looksBinary(temp())).toBe(false);
    expect(looksBinary(literal("50"))).toBe(false);
    expect(looksBinary(undefined)).toBe(false);
  });
});

describe("editing", () => {
  it("adds the first state and mints one rule for it", () => {
    const rules: Rule[] = [];
    addStateRow(rules, kitchen(), false);
    expect(rules).toHaveLength(1);
    expect(rules[0]!.cases).toHaveLength(1);
    const shape = tableShape(rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.rows[0]!.comparison).toEqual({ kind: "isOn" });
    expect(valuesEqual(shape.table.value!, kitchen())).toBe(true);
  });

  it("answers the first state with its opposite", () => {
    const rules: Rule[] = [];
    addStateRow(rules, kitchen(), false);
    addStateRow(rules, kitchen(), false);
    expect(rules[0]!.cases.map((c) => c.when.tests[0]!.comparison.kind)).toEqual(["isOn", "isOff"]);
  });

  it("stores nothing again once the last state and otherwise are gone", () => {
    const rules: Rule[] = [];
    addStateRow(rules, temp(), true);
    setOtherwise(rules, true);
    removeStateRow(rules, rules[0]!.cases[0]!.id);
    expect(rules).toHaveLength(1);
    setOtherwise(rules, false);
    expect(rules).toEqual([]);
  });

  it("moves a row without disturbing what it tests", () => {
    const rules = [bandRule()];
    moveStateRow(rules, 2, 0);
    const shape = tableShape(rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.rows.map((r) => whenText(r.comparison))).toEqual(["above 50", "below 20", "20 to 50"]);
  });

  it("points every row at a new value in one edit", () => {
    const rules = [lightRule()];
    setTestedValue(rules, hall());
    const shape = tableShape(rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(valuesEqual(shape.table.value!, hall())).toBe(true);
  });

  it("deletes a column from every state, otherwise included", () => {
    const rules = [lightRule()];
    removeColumn(rules, "color");
    const shape = tableShape(rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.table.columns).toEqual(["icon"]);
    expect(shape.table.otherwise).toHaveLength(1);
  });

  it("leaves an edited table still table-shaped and byte-stable", () => {
    const rules: Rule[] = [];
    addStateRow(rules, kitchen(), false);
    setOtherwise(rules, true);
    rules[0]!.cases[0]!.then.push(icon("lightbulb.fill"));
    rules[0]!.otherwise!.push(icon("lightbulb"));
    const shape = tableShape(rules);
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(encodeRules(compileTable(shape.table))).toEqual(encodeRules(rules));
  });

  it("encodes a whole document the same as one built rule for rule", () => {
    const built = newConfig("Light", 0);
    const layer = newElement("icon");
    built.elements.push(layer);
    addStateRow(layer.payload.rules, kitchen(), false);
    setOtherwise(layer.payload.rules, true);
    layer.payload.rules[0]!.cases[0]!.then.push(icon("lightbulb.fill"), colour("#FFD60A"));
    layer.payload.rules[0]!.otherwise!.push(icon("lightbulb"), colour("#8E8E93"));

    const hand = structuredClone(built);
    const rule = layer.payload.rules[0]!;
    hand.elements[0]!.payload.rules = [buildStatesRule(
      kitchen(),
      [{
        comparison: { kind: "isOn" },
        changes: [icon("lightbulb.fill"), colour("#FFD60A")],
        caseId: rule.cases[0]!.id,
        testId: rule.cases[0]!.when.tests[0]!.id,
      }],
      [icon("lightbulb"), colour("#8E8E93")],
      rule.id,
    )];
    expect(encodeConfig(hand)).toEqual(encodeConfig(built));
  });
});

describe("first column", () => {
  it("offers every kind of layer a column that kind actually reads", () => {
    for (const [target, property] of Object.entries(DEFAULT_COLUMN)) {
      const allowed = RULE_TARGET_PROPERTIES[target as RuleTarget];
      expect(allowed, target).toBeDefined();
      expect(allowed.includes(property), `${target} ignores ${property}`).toBe(true);
    }
  });

  it("covers every rule target", () => {
    for (const target of Object.keys(RULE_TARGET_PROPERTIES)) expect(DEFAULT_COLUMN[target], target).toBeDefined();
  });
});

describe("statesSummary", () => {
  it("counts rows the way the table shows them", () => {
    expect(statesSummary([])).toBe("No states yet.");
    expect(statesSummary([lightRule()])).toBe("2 states.");
    expect(statesSummary([buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [] }])])).toBe("1 state.");
  });

  it("does not count cases it cannot show as rows", () => {
    expect(statesSummary([lightRule(), lightRule()])).toBe("Advanced rules.");
  });
});

describe("cell wording", () => {
  it("names the colours the rest of the editor offers", () => {
    expect(colorWords("#ff453a")).toBe("red");
    expect(colorWords("#34C759")).toBe("green");
    expect(colorWords("#123456")).toBe("#123456");
  });
});

describe("ids", () => {
  it("mints its own when a preset does not supply them", () => {
    const rule = buildStatesRule(kitchen(), [{ comparison: { kind: "isOn" }, changes: [newStyleChange("setColor")] }]);
    expect(rule.id).toMatch(/^[0-9A-F-]{36}$/);
    expect(rule.cases[0]!.id).not.toBe(rule.id);
    expect(rule.cases[0]!.when.tests[0]!.id).not.toBe(rule.cases[0]!.id);
  });

  it("copies the value into every row rather than sharing one object", () => {
    const value = kitchen();
    const rule = buildStatesRule(value, [
      { comparison: { kind: "isOn" }, changes: [] },
      { comparison: { kind: "isOff" }, changes: [] },
    ]);
    const first = rule.cases[0]!.when.tests[0]!.value;
    const second = rule.cases[1]!.when.tests[0]!.value;
    expect(first).not.toBe(second);
    expect(valuesEqual(first, second)).toBe(true);
    expect(newId()).not.toBe(newId());
  });
});
