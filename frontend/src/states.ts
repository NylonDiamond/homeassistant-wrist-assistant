// The states table: one rule seen as rows instead of four levels of box.
//
// A rule whose cases each test the same value is a table. "is on" and
// "Otherwise" are rows; "Icon" and "Colour" are columns; a cell is one style
// change. Nothing new is stored: `tableShape` reads an ordinary `Rule[]` and
// `buildStatesRule` writes one back, so a document authored here opens the
// same in the Advanced editor and encodes byte for byte the same on the wire.
//
// Everything in this file is pure. The rendering lives in editors.ts, and the
// one thing this module deliberately does not do is describe a value in words:
// that belongs to `describeValue`, which is passed in where it is needed.

import {
  type Comparison,
  type ComparisonKind,
  type Rule,
  type RuleCase,
  type StyleChange,
  type StyleChangeKind,
  type StyleProperty,
  type Value,
  STYLE_PROPERTY,
  comparisonOperand,
  encodeValue,
  literal,
  newId,
} from "./model.js";

// ── words ─────────────────────────────────────────────────────────────────

export const COMPARISON_LABELS: Record<ComparisonKind, string> = {
  isOn: "is on", isOff: "is off", equals: "equals", notEquals: "does not equal",
  isUnavailable: "is unavailable or unknown", isStale: "data is stale", isEmpty: "is empty",
  greaterThan: "is greater than", greaterOrEqual: "is at least", lessThan: "is less than", lessOrEqual: "is at most",
  between: "is between", contains: "contains", startsWith: "starts with", endsWith: "ends with",
  matchesRegex: "matches regex", isOneOf: "is one of",
};

/** Column headings. One per style property, because a column is a property:
 * "Visible" covers both hide and show, which is why the table has one column
 * for them and not two. */
export const PROPERTY_LABELS: Record<StyleProperty, string> = {
  icon: "Icon",
  text: "Text",
  color: "Colour",
  visibility: "Visible",
  opacity: "Opacity",
  fontSize: "Size",
  fontWeight: "Weight",
  rotation: "Rotation",
  gaugeValue: "Gauge value",
  gaugeMin: "Gauge min",
  gaugeMax: "Gauge max",
  backgroundColor: "Background",
  borderColor: "Border colour",
  borderWidth: "Border width",
};

/** Left to right, most useful first. The drawing in the plan is Icon then
 * Colour, and everything else follows in the order a user would reach for it. */
export const COLUMN_ORDER: StyleProperty[] = [
  "icon", "text", "color", "visibility", "opacity", "fontSize", "fontWeight",
  "rotation", "gaugeValue", "gaugeMin", "gaugeMax", "backgroundColor",
  "borderColor", "borderWidth",
];

/** The change a column writes when a cell is first filled in. Visibility has
 * two kinds for one property; a new cell starts by hiding, because a layer is
 * already shown and "Show" would be a change that changes nothing. */
export const PROPERTY_CHANGE_KIND: Record<StyleProperty, StyleChangeKind> = {
  color: "setColor",
  opacity: "setOpacity",
  text: "setText",
  icon: "setIcon",
  fontSize: "setFontSize",
  fontWeight: "setFontWeight",
  rotation: "setRotation",
  visibility: "hide",
  gaugeValue: "setGaugeValue",
  gaugeMin: "setGaugeMin",
  gaugeMax: "setGaugeMax",
  borderColor: "setBorderColor",
  borderWidth: "setBorderWidth",
  backgroundColor: "setBackgroundColor",
};

// ── comparisons ───────────────────────────────────────────────────────────

/** Comparisons a row can show. Everything except the two whose operand is a
 * list or a regular expression: those need a form of their own, and a table
 * cell is not one. A layer using them keeps the Advanced editor. */
export const TABLE_COMPARISONS: ComparisonKind[] = [
  "isOn", "isOff", "equals", "notEquals", "isUnavailable", "isStale", "isEmpty",
  "lessThan", "lessOrEqual", "between", "greaterOrEqual", "greaterThan",
  "contains", "startsWith", "endsWith",
];

/** Comparisons that read as a threshold, which is what puts a table in number
 * mode: rows then say "below 20", "20 to 50", "above 50". */
export const NUMERIC_COMPARISONS: ComparisonKind[] = [
  "lessThan", "lessOrEqual", "between", "greaterOrEqual", "greaterThan",
];

export function isNumericComparison(kind: ComparisonKind): boolean {
  return NUMERIC_COMPARISONS.includes(kind);
}

export function canShowComparison(kind: ComparisonKind): boolean {
  return TABLE_COMPARISONS.includes(kind);
}

/** Structural equality of two values, through the encoder so key order and
 * absent-versus-empty formats cannot make two identical values look different. */
export function valuesEqual(a: Value, b: Value): boolean {
  return JSON.stringify(encodeValue(a)) === JSON.stringify(encodeValue(b));
}

// ── the table ─────────────────────────────────────────────────────────────

export interface StatesRow {
  caseId: string;
  testId: string;
  /** Kept so a rebuilt rule encodes exactly as it was read. With one test the
   * join changes nothing, but it is still part of the document. */
  join: "all" | "any";
  comparison: Comparison;
  changes: StyleChange[];
}

export interface StatesTable {
  /** The rule the rows came from. Empty when the layer has no rules yet, in
   * which case the first edit mints one. */
  ruleId: string;
  /** The left-hand side every row tests. Absent only for an empty table. */
  value?: Value;
  rows: StatesRow[];
  /** The Otherwise row's changes, when the rule has one. */
  otherwise?: StyleChange[];
  /** Properties some change already sets, in column order. */
  columns: StyleProperty[];
  /** Every row reads as a threshold, so the table shows numbers. */
  numberMode: boolean;
}

export type TableShape =
  | { ok: true; table: StatesTable }
  | { ok: false; reason: string };

/**
 * Whether a layer's rules are one states table, and if so what is in it.
 *
 * The table can show one rule whose cases each check one thing, all against
 * the same value. That covers on/off, thresholds and enumerated states, which
 * is close to everything an author builds. Anything else gets a reason, which
 * the editor shows beside the Advanced link so the user knows why the short
 * road is closed rather than guessing.
 */
export function tableShape(rules: Rule[]): TableShape {
  if (rules.length > 1) {
    return { ok: false, reason: `There are ${rules.length} rules here. A table shows one.` };
  }
  const rule = rules[0];
  if (!rule) {
    return { ok: true, table: { ruleId: "", rows: [], columns: [], numberMode: false } };
  }

  let shared: Value | undefined;
  const rows: StatesRow[] = [];
  for (const [i, c] of rule.cases.entries()) {
    const tests = c.when.tests;
    if (tests.length !== 1) {
      return {
        ok: false,
        reason: tests.length === 0
          ? `State ${i + 1} checks nothing, so it always matches.`
          : `State ${i + 1} checks ${tests.length} things at once. A table row checks one.`,
      };
    }
    const test = tests[0]!;
    if (!canShowComparison(test.comparison.kind)) {
      return { ok: false, reason: `State ${i + 1} uses "${COMPARISON_LABELS[test.comparison.kind]}", which a table row cannot show.` };
    }
    if (shared === undefined) shared = test.value;
    else if (!valuesEqual(shared, test.value)) {
      return { ok: false, reason: "The states test different values. A table tests one value in every row." };
    }
    const twice = duplicateProperty(c.then);
    if (twice) return { ok: false, reason: `State ${i + 1} sets ${PROPERTY_LABELS[twice]} twice. A table has one cell per column.` };
    rows.push({ caseId: c.id, testId: test.id, join: c.when.join, comparison: test.comparison, changes: c.then });
  }
  if (rule.otherwise) {
    const twice = duplicateProperty(rule.otherwise);
    if (twice) return { ok: false, reason: `Otherwise sets ${PROPERTY_LABELS[twice]} twice. A table has one cell per column.` };
  }

  const table: StatesTable = {
    ruleId: rule.id,
    rows,
    columns: usedColumns(rows, rule.otherwise),
    numberMode: rows.length > 0 && rows.every((r) => isNumericComparison(r.comparison.kind)),
  };
  if (shared !== undefined) table.value = shared;
  if (rule.otherwise) table.otherwise = rule.otherwise;
  return { ok: true, table };
}

/** The first property a list of changes sets more than once, if any. The
 * resolver would keep only the last of them, so the table would be lying
 * about what the state does. */
function duplicateProperty(changes: StyleChange[]): StyleProperty | undefined {
  const seen = new Set<StyleProperty>();
  for (const ch of changes) {
    const prop = STYLE_PROPERTY[ch.kind];
    if (seen.has(prop)) return prop;
    seen.add(prop);
  }
  return undefined;
}

/** Every property some change already sets, in column order. These are shown
 * whether or not the column picker was ever used, because a column that is
 * hidden while it still drives the watch would be a trap. */
export function usedColumns(rows: StatesRow[], otherwise?: StyleChange[]): StyleProperty[] {
  const used = new Set<StyleProperty>();
  for (const row of rows) for (const ch of row.changes) used.add(STYLE_PROPERTY[ch.kind]);
  for (const ch of otherwise ?? []) used.add(STYLE_PROPERTY[ch.kind]);
  return COLUMN_ORDER.filter((p) => used.has(p));
}

/** The used columns plus the ones the picker added, restricted to what this
 * kind of layer actually reads. */
export function shownColumns(used: StyleProperty[], picked: Iterable<StyleProperty>, allowed: readonly StyleProperty[]): StyleProperty[] {
  const set = new Set<StyleProperty>(used);
  for (const p of picked) set.add(p);
  return COLUMN_ORDER.filter((p) => set.has(p) && allowed.includes(p));
}

/** The change in one row for one column, if the row sets it. */
export function cellChange(changes: StyleChange[], property: StyleProperty): StyleChange | undefined {
  return changes.find((ch) => STYLE_PROPERTY[ch.kind] === property);
}

// ── building a rule ───────────────────────────────────────────────────────

export interface StatesRowInput {
  comparison: Comparison;
  changes: StyleChange[];
  /** Reuse the ids of a row that already exists, so an untouched document
   * encodes byte for byte the same. New rows leave them out. */
  caseId?: string;
  testId?: string;
  join?: "all" | "any";
}

/**
 * One rule from a value and a list of rows, which is the only shape the table
 * ever stores. Rows are checked top to bottom and the first match wins, the
 * same order the resolver applies (`Resolver.applyRules` takes the first case
 * whose condition holds), so a band table needs no overlapping guards.
 *
 * This is what a preset calls: a three-band gauge is three rows plus,
 * optionally, an Otherwise.
 */
export function buildStatesRule(value: Value, rows: StatesRowInput[], otherwise?: StyleChange[], ruleId?: string): Rule {
  const cases: RuleCase[] = rows.map((row) => ({
    id: row.caseId ?? newId(),
    when: {
      join: row.join ?? "all",
      tests: [{ id: row.testId ?? newId(), value: structuredClone(value), comparison: row.comparison }],
    },
    then: row.changes,
  }));
  const rule: Rule = { id: ruleId ?? newId(), cases };
  if (otherwise) rule.otherwise = otherwise;
  return rule;
}

/** The table back as the rules a layer stores. An empty table stores nothing
 * rather than an empty rule, so turning the last row off leaves the document
 * exactly as it was before the first one was added. */
export function compileTable(table: StatesTable): Rule[] {
  if (table.rows.length === 0 && table.otherwise === undefined) return [];
  const value = table.value ?? literal("");
  const rows: StatesRowInput[] = table.rows.map((r) => ({
    comparison: r.comparison,
    changes: r.changes,
    caseId: r.caseId,
    testId: r.testId,
    join: r.join,
  }));
  return [buildStatesRule(value, rows, table.otherwise, table.ruleId || undefined)];
}

/** How many states a layer has, in words, for the line that points at the
 * States tab. Rules the table cannot show say so rather than counting cases
 * that do not mean what a row means. */
export function statesSummary(rules: Rule[]): string {
  if (rules.length === 0) return "No states yet.";
  const shape = tableShape(rules);
  if (!shape.ok) return "Advanced rules.";
  const n = shape.table.rows.length + (shape.table.otherwise ? 1 : 0);
  return n === 1 ? "1 state." : `${n} states.`;
}

// ── editing ───────────────────────────────────────────────────────────────
// The table edits the live `Rule[]` a layer already holds rather than
// recompiling one from a model, so ids stay put, undo sees one step per edit,
// and the parts nobody touched encode exactly as they were read.

/** The rule the table is a view of, created on first use. */
function tableRule(rules: Rule[]): Rule {
  let rule = rules[0];
  if (!rule) {
    rule = { id: newId(), cases: [] };
    rules.push(rule);
  }
  return rule;
}

/** Drop a rule that has nothing left in it. A table emptied back out leaves
 * the document exactly as it was before the first row was added, rather than
 * shipping an empty rule to the watch. */
function pruneEmpty(rules: Rule[]): void {
  const rule = rules[0];
  if (rule && rule.cases.length === 0 && rule.otherwise === undefined) rules.length = 0;
}

/** Add a state below the last one, testing the same value. */
export function addStateRow(rules: Rule[], value: Value, numberMode: boolean): void {
  const rule = tableRule(rules);
  const previous = rule.cases[rule.cases.length - 1]?.when.tests[0]?.comparison;
  rule.cases.push({
    id: newId(),
    when: { join: "all", tests: [{ id: newId(), value: structuredClone(value), comparison: nextComparison(previous, numberMode) }] },
    then: [],
  });
}

export function removeStateRow(rules: Rule[], caseId: string): void {
  const rule = rules[0];
  if (!rule) return;
  rule.cases = rule.cases.filter((c) => c.id !== caseId);
  pruneEmpty(rules);
}

export function moveStateRow(rules: Rule[], from: number, to: number): void {
  const cases = rules[0]?.cases;
  if (!cases || to < 0 || to >= cases.length) return;
  const [row] = cases.splice(from, 1);
  if (row) cases.splice(to, 0, row);
}

export function setOtherwise(rules: Rule[], on: boolean): void {
  if (on) {
    tableRule(rules).otherwise = [];
    return;
  }
  const rule = rules[0];
  if (!rule) return;
  delete rule.otherwise;
  pruneEmpty(rules);
}

/** Point every row at a different value. This is the header chip: one edit
 * changes what the whole table is about, which is the duplication the old
 * per-test entity fields caused. */
export function setTestedValue(rules: Rule[], value: Value): void {
  for (const c of rules[0]?.cases ?? []) {
    const test = c.when.tests[0];
    if (test) test.value = structuredClone(value);
  }
}

/** Delete a column: the change for that property leaves every row. This is the
 * one destructive thing the table does, which is why the button confirms. */
export function removeColumn(rules: Rule[], property: StyleProperty): void {
  const rule = rules[0];
  if (!rule) return;
  const without = (list: StyleChange[]) => list.filter((ch) => STYLE_PROPERTY[ch.kind] !== property);
  for (const c of rule.cases) c.then = without(c.then);
  if (rule.otherwise) rule.otherwise = without(rule.otherwise);
}

// ── row wording ───────────────────────────────────────────────────────────

/** How a value reads inside a row when nothing better is available. The real
 * one is `describeValue` in editors.ts, passed in by the caller. */
function plainValue(v: Value | undefined): string {
  if (!v) return "?";
  return v.kind.kind === "literal" ? (v.kind.value === "" ? "?" : v.kind.value) : "a value";
}

/**
 * The row's "When" in words.
 *
 * A numeric row reads as a threshold ("below 20", "20 to 50", "above 50")
 * because that is how a person describes a band, and the comparison name
 * ("is less than") reads like a schema. Everything else keeps the plain
 * comparison wording.
 */
export function whenText(c: Comparison, describe: (v: Value) => string = plainValue): string {
  const lhs = () => describe(c.value ?? literal(""));
  switch (c.kind) {
    case "lessThan": return `below ${lhs()}`;
    case "lessOrEqual": return `${lhs()} or below`;
    case "greaterThan": return `above ${lhs()}`;
    case "greaterOrEqual": return `${lhs()} or above`;
    case "between": return `${lhs()} to ${describe(c.upper ?? literal(""))}`;
    case "matchesRegex": return `matches ${c.pattern || "?"}`;
    case "isOneOf": return `is one of ${(c.options ?? []).join(", ") || "?"}`;
    default:
      return comparisonOperand(c.kind) === "value"
        ? `${COMPARISON_LABELS[c.kind]} ${lhs()}`
        : COMPARISON_LABELS[c.kind];
  }
}

// ── defaults ──────────────────────────────────────────────────────────────

/**
 * The comparison a new row starts with.
 *
 * It reads the row above it, because that is where the answer usually is: the
 * second state of a light is "is off", and the next band starts where the last
 * one stopped. A first row falls back to the value's own shape.
 */
export function nextComparison(previous: Comparison | undefined, numberMode: boolean): Comparison {
  if (!previous) {
    return numberMode ? { kind: "lessThan", value: literal("20") } : { kind: "isOn" };
  }
  switch (previous.kind) {
    case "isOn": return { kind: "isOff" };
    case "isOff": return { kind: "isOn" };
    case "lessThan": case "lessOrEqual":
      return { kind: "greaterOrEqual", value: previous.value ?? literal("0") };
    case "between":
      return { kind: "greaterOrEqual", value: previous.upper ?? literal("0") };
    case "greaterThan": case "greaterOrEqual":
      return { kind: "greaterOrEqual", value: previous.value ?? literal("0") };
    default:
      return { kind: previous.kind, ...(comparisonOperand(previous.kind) === "value" ? { value: literal("") } : {}) };
  }
}

/**
 * The column a brand-new table starts with, per kind of layer.
 *
 * An empty table with no columns at all is a row of nothing: the point of the
 * first state is usually "make the icon different", so the column that says
 * what this kind of layer draws is already there to be filled in.
 */
export const DEFAULT_COLUMN: Record<string, StyleProperty> = {
  text: "text",
  icon: "icon",
  gauge: "color",
  shape: "color",
  image: "visibility",
  tap: "visibility",
  layout: "backgroundColor",
};

/** Whether a value is an entity whose state reads as on or off, which is what
 * decides between an on/off table and a threshold table for a brand-new one. */
export function looksBinary(value: Value | undefined): boolean {
  if (!value) return false;
  const k = value.kind;
  if (k.kind !== "entityState") return false;
  const domain = k.domain || k.entityId.split(".")[0] || "";
  return ["light", "switch", "fan", "input_boolean", "binary_sensor", "automation", "siren", "humidifier", "group"].includes(domain);
}
