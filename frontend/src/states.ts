// The states table: one rule seen as rows instead of four levels of box.
//
// A rule whose cases each test the same value is a table. "is on" and
// "Otherwise" are rows; "Icon" and "Color" are columns; a cell is one style
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
  between: "is between", timeBetween: "is between times",
  contains: "contains", startsWith: "starts with", endsWith: "ends with",
  matchesRegex: "matches regex", isOneOf: "is one of",
};

/** Column headings. One per style property, because a column is a property:
 * "Visible" covers both hide and show, which is why the table has one column
 * for them and not two. */
export const PROPERTY_LABELS: Record<StyleProperty, string> = {
  icon: "Icon",
  text: "Text",
  color: "Color",
  visibility: "Visible",
  opacity: "Opacity",
  fontSize: "Size",
  fontWeight: "Weight",
  fontDesign: "Typeface",
  fontWidth: "Width",
  italic: "Italic",
  rotation: "Rotation",
  gaugeValue: "Gauge value",
  gaugeMin: "Gauge min",
  gaugeMax: "Gauge max",
  backgroundColor: "Background",
  borderColor: "Border color",
  borderWidth: "Border width",
};

/** Left to right, most useful first. The drawing in the plan is Icon then
 * Color, and everything else follows in the order a user would reach for it. */
export const COLUMN_ORDER: StyleProperty[] = [
  "icon", "text", "color", "visibility", "opacity", "fontSize", "fontWeight",
  "fontDesign", "fontWidth", "italic",
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
  fontDesign: "setFontDesign",
  fontWidth: "setFontWidth",
  italic: "setItalic",
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

/** The comparison menu in groups, so on/off, numbers, words and problems do
 * not sit in one list of fourteen. A number table lists its own group first;
 * everything else starts with on and off. */
export interface ComparisonGroup { label: string; kinds: ComparisonKind[] }
const ON_OFF_GROUP: ComparisonGroup = { label: "On or off", kinds: ["isOn", "isOff"] };
const NUMBER_GROUP: ComparisonGroup = { label: "Number", kinds: [...NUMERIC_COMPARISONS] };
const WORDS_GROUP: ComparisonGroup = { label: "Words", kinds: ["equals", "notEquals", "contains", "startsWith", "endsWith"] };
const PROBLEMS_GROUP: ComparisonGroup = { label: "Problems", kinds: ["isUnavailable", "isStale", "isEmpty"] };
export function comparisonGroups(numberMode: boolean): ComparisonGroup[] {
  return numberMode
    ? [NUMBER_GROUP, ON_OFF_GROUP, WORDS_GROUP, PROBLEMS_GROUP]
    : [ON_OFF_GROUP, NUMBER_GROUP, WORDS_GROUP, PROBLEMS_GROUP];
}

/** Whether a resolved reading is a number, which is what makes a fresh table
 * a set of bands rather than a set of states. */
export function isNumberish(resolved: string | undefined): boolean {
  const t = (resolved ?? "").trim();
  return t !== "" && Number.isFinite(Number(t));
}

// ── number bands ──────────────────────────────────────────────────────────
// A number table draws a color bar over its rows, the one a chart's "By value"
// draws: every threshold the rows name is an edge, and each stretch between
// two edges is painted in the color of the first row that would match a
// number inside it. That is exactly what the resolver does, so the bar can
// never disagree with the rows.

/** The numbers a comparison names, once resolved. A row comparing with an
 * entity that reads as words names nothing and leaves no edge. */
export function comparisonEdges(c: Comparison, num: (v: Value | undefined) => number | undefined): number[] {
  if (!isNumericComparison(c.kind)) return [];
  const out: number[] = [];
  const a = num(c.value);
  if (a !== undefined) out.push(a);
  if (c.kind === "between") {
    const b = num(c.upper);
    if (b !== undefined) out.push(b);
  }
  return out;
}

/** Whether a numeric comparison holds for one number. */
export function comparisonHolds(c: Comparison, probe: number, num: (v: Value | undefined) => number | undefined): boolean {
  const a = num(c.value);
  if (a === undefined) return false;
  switch (c.kind) {
    case "lessThan": return probe < a;
    case "lessOrEqual": return probe <= a;
    case "greaterThan": return probe > a;
    case "greaterOrEqual": return probe >= a;
    case "between": {
      const b = num(c.upper);
      return b !== undefined && probe >= a && probe <= b;
    }
    default: return false;
  }
}

/** The distinct edges of a number table, lowest first. */
export function tableEdges(rows: readonly { comparison: Comparison }[], num: (v: Value | undefined) => number | undefined): number[] {
  const set = new Set<number>();
  for (const r of rows) for (const n of comparisonEdges(r.comparison, num)) set.add(n);
  return [...set].sort((a, b) => a - b);
}

/**
 * Which row paints each stretch of the bar: for the stretch below the first
 * edge, each stretch between two edges, and the stretch above the last, the
 * index of the first row holding at its midpoint, `"otherwise"` when none
 * does and the table has that row, else `undefined` for a gap. `lo` and `hi`
 * are the bar's ends, which is what gives the two outer stretches a middle.
 */
export function bandOwners(
  rows: readonly { comparison: Comparison }[],
  edges: readonly number[],
  lo: number,
  hi: number,
  hasOtherwise: boolean,
  num: (v: Value | undefined) => number | undefined,
): (number | "otherwise" | undefined)[] {
  const bounds = [lo, ...edges, hi];
  return bounds.slice(1).map((next, i) => {
    const probe = (bounds[i]! + next) / 2;
    const row = rows.findIndex((r) => comparisonHolds(r.comparison, probe, num));
    if (row >= 0) return row;
    return hasOtherwise ? "otherwise" : undefined;
  });
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
    return { ok: false, reason: `There are ${rules.length} rules here. The simple editor shows one.` };
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
          : `State ${i + 1} checks ${tests.length} things at once. The simple editor checks one per state.`,
      };
    }
    const test = tests[0]!;
    if (!canShowComparison(test.comparison.kind)) {
      return { ok: false, reason: `State ${i + 1} uses "${COMPARISON_LABELS[test.comparison.kind]}", which the simple editor cannot show.` };
    }
    if (shared === undefined) shared = test.value;
    else if (!valuesEqual(shared, test.value)) {
      return { ok: false, reason: "The states test different values. The simple editor tests one value in every state." };
    }
    const twice = duplicateProperty(c.then);
    if (twice) return { ok: false, reason: `State ${i + 1} sets ${PROPERTY_LABELS[twice]} twice. The simple editor sets each thing once.` };
    rows.push({ caseId: c.id, testId: test.id, join: c.when.join, comparison: test.comparison, changes: c.then });
  }
  if (rule.otherwise) {
    const twice = duplicateProperty(rule.otherwise);
    if (twice) return { ok: false, reason: `Otherwise sets ${PROPERTY_LABELS[twice]} twice. The simple editor sets each thing once.` };
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

/** How many states a layer has, in words, for the badge on its row in the
 * Layers card. Rules the table cannot show say so rather than counting cases
 * that do not mean what a row means. */
export function statesSummary(rules: Rule[]): string {
  if (rules.length === 0) return "No states yet.";
  const shape = tableShape(rules);
  if (!shape.ok) return "Advanced rules.";
  const n = shape.table.rows.length + (shape.table.otherwise ? 1 : 0);
  // A table with no rows left (every state deleted, the rule kept) is no
  // states at all, not a "0 states" badge on the row.
  if (n === 0) return "No states yet.";
  return n === 1 ? "1 state." : `${n} states.`;
}

/** The table's empty state, for a layer or a layout's shape. */
export function statesEmptyText(target: string): string {
  return `No states yet. This ${target === "layout" ? "shape" : "layer"} looks the same whatever the value is.`;
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

/** The color a new row starts with when the table has a Color column, so a
 * table does something from its first row instead of showing a grid of empty
 * cells. Number bands run red, amber, green from the top; on and off read as
 * green and grey; Otherwise is green, the "all is well" of a band table. Any
 * of them is one click to change. */
const SEED_BAND_HEXES = ["#FF453A", "#FF9F0A", "#30D158"];
export function seedRowColor(comparison: Comparison, index: number): StyleChange {
  const hex = comparison.kind === "isOn" ? "#30D158"
    : comparison.kind === "isOff" ? "#8E8E93"
    : SEED_BAND_HEXES[Math.min(index, SEED_BAND_HEXES.length - 1)]!;
  return { kind: "setColor", value: literal(hex) };
}

/** Add a state below the last one, testing the same value. With `seedColor`
 * the row starts with a color (`seedRowColor`) rather than nothing. */
export function addStateRow(rules: Rule[], value: Value, numberMode: boolean, seedColor = false): void {
  const rule = tableRule(rules);
  const previous = rule.cases[rule.cases.length - 1]?.when.tests[0]?.comparison;
  const comparison = nextComparison(previous, numberMode, bandStep(rule.cases));
  rule.cases.push({
    id: newId(),
    when: { join: "all", tests: [{ id: newId(), value: structuredClone(value), comparison }] },
    then: seedColor ? [seedRowColor(comparison, rule.cases.length)] : [],
  });
}

/** How far apart the last two bands end, so a new band is as wide as the
 * one before it. Ten when there is no pair to read. */
function bandStep(cases: readonly RuleCase[]): number {
  const ends = cases.flatMap((c) => {
    const n = bandEnd(c.when.tests[0]?.comparison);
    return n === undefined ? [] : [n];
  });
  const step = ends.length >= 2 ? Math.abs(ends[ends.length - 1]! - ends[ends.length - 2]!) : 0;
  return step || 10;
}

/** The number a numeric row ends at, when it is typed in. */
function bandEnd(c: Comparison | undefined): number | undefined {
  if (!c || !isNumericComparison(c.kind)) return undefined;
  const v = c.kind === "between" ? c.upper : c.value;
  if (!v || v.kind.kind !== "literal") return undefined;
  const n = Number(v.kind.value);
  return v.kind.value.trim() !== "" && Number.isFinite(n) ? n : undefined;
}

/** A table's first rows, from the shape of what it tests: a light gets on and
 * off, a number gets bands, and words get one state equal to the reading. */
export type FreshShape = "onOff" | "bands" | "words";

export function freshShape(value: Value | undefined, resolved: string | undefined): FreshShape {
  if (looksBinary(value)) return "onOff";
  if (isNumberish(resolved)) return "bands";
  return "words";
}

/** Where a fresh number table's two bands end: two thirds and four thirds of
 * the reading, so the reading sits in the middle band and every band shows on
 * the bar from the first draw. With no reading to go by, 20 and 50. */
export function seedThresholds(now: number | undefined): [number, number] {
  if (now === undefined || !Number.isFinite(now) || now === 0) return [20, 50];
  const round = (n: number) => Math.abs(now) >= 10 ? Math.round(n) : Number(n.toFixed(2));
  const a = round(now * 2 / 3);
  const b = round(now * 4 / 3);
  return a < b ? [a, b] : [b, a];
}

/** A reading a fresh Words row can equal. Unknown and unavailable are not
 * states anyone designs for, so they leave the box empty. */
function usableReading(resolved: string | undefined): string {
  const t = (resolved ?? "").trim();
  return t === "unknown" || t === "unavailable" ? "" : t;
}

/**
 * Fill an empty table with its first rows: on and off, two bands around the
 * reading plus a row for everything else, or one row equal to the reading.
 * With `seedColor` every row starts with a color, the way `addStateRow` does.
 */
export function startStates(rules: Rule[], value: Value, shape: FreshShape, resolved: string | undefined, seedColor = false): void {
  const rule = tableRule(rules);
  const push = (comparison: Comparison) => {
    rule.cases.push({
      id: newId(),
      when: { join: "all", tests: [{ id: newId(), value: structuredClone(value), comparison }] },
      then: seedColor ? [seedRowColor(comparison, rule.cases.length)] : [],
    });
  };
  switch (shape) {
    case "onOff":
      push({ kind: "isOn" });
      push({ kind: "isOff" });
      break;
    case "bands": {
      const [a, b] = seedThresholds(Number(resolved));
      push({ kind: "lessThan", value: literal(String(a)) });
      push({ kind: "lessThan", value: literal(String(b)) });
      rule.otherwise = seedColor ? [{ kind: "setColor", value: literal("#30D158") }] : [];
      break;
    }
    case "words":
      push({ kind: "equals", value: literal(usableReading(resolved)) });
      break;
  }
}

/** What Add a state does to an empty table, in words, under the empty row. */
export function startText(shape: FreshShape, resolved: string | undefined): string {
  switch (shape) {
    case "onOff": return "Add a state starts with Is on and Is off.";
    case "bands": return `Add a state starts with three bands around ${(resolved ?? "").trim()}.`;
    case "words": {
      const reading = usableReading(resolved);
      return reading === "" ? "Add a state starts with one state." : `Add a state starts with Equals ${reading}.`;
    }
  }
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

/** Turn the Otherwise row on or off. With `seedColor` a new Otherwise starts
 * green, the color a band table shows when no band above matched. */
export function setOtherwise(rules: Rule[], on: boolean, seedColor = false): void {
  if (on) {
    tableRule(rules).otherwise = seedColor ? [{ kind: "setColor", value: literal("#30D158") }] : [];
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
    case "lessThan": return `less than ${lhs()}`;
    case "lessOrEqual": return `at most ${lhs()}`;
    case "greaterThan": return `greater than ${lhs()}`;
    case "greaterOrEqual": return `at least ${lhs()}`;
    case "between": return `${lhs()} to ${describe(c.upper ?? literal(""))}`;
    case "timeBetween": return `${lhs()} to ${describe(c.upper ?? literal(""))}`;
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
 * second state of a light is "is off", and the next band ends one `step`
 * past where the last one did, so "less than 20" is followed by "less than
 * 30" and the bar grows by one band. Rows are checked top to bottom, which is
 * what lets a band say only where it ends. A band whose end is not a typed
 * number (an entity) is followed by "at least" that same value, the one thing
 * that is certainly the next band. A first row falls back to the value's own
 * shape.
 */
export function nextComparison(previous: Comparison | undefined, numberMode: boolean, step = 10): Comparison {
  if (!previous) {
    return numberMode ? { kind: "lessThan", value: literal("20") } : { kind: "isOn" };
  }
  const end = bandEnd(previous);
  switch (previous.kind) {
    case "isOn": return { kind: "isOff" };
    case "isOff": return { kind: "isOn" };
    case "lessThan": case "lessOrEqual":
      return end === undefined
        ? { kind: "greaterOrEqual", value: previous.value ?? literal("0") }
        : { kind: previous.kind, value: literal(bandNumber(end + step)) };
    case "between":
      return end === undefined
        ? { kind: "greaterOrEqual", value: previous.upper ?? literal("0") }
        : { kind: "lessThan", value: literal(bandNumber(end + step)) };
    case "greaterThan": case "greaterOrEqual":
      return end === undefined
        ? { kind: "greaterOrEqual", value: previous.value ?? literal("0") }
        : { kind: previous.kind, value: literal(bandNumber(end + step)) };
    default:
      return { kind: previous.kind, ...(comparisonOperand(previous.kind) === "value" ? { value: literal("") } : {}) };
  }
}

/** A band end as typed text, without the drift of adding decimals. */
function bandNumber(n: number): string {
  return String(Number(n.toFixed(2)));
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
  chart: "color",
  // A timeline reads no color rule, so the one thing a state can do to it is
  // take it off the face.
  timeline: "visibility",
  shape: "color",
  image: "visibility",
  tap: "visibility",
  // Chart times carry their own color, like a timeline, so hiding is what a
  // state can do to them.
  chartTimes: "visibility",
  chartDots: "visibility",
  chartGrid: "visibility",
  // A timestamp's look is fixed, so hiding it is what a state can do.
  imageTime: "visibility",
  // Every color a list draws belongs to a row layer, so hiding the whole list
  // is what a state on the list itself can do. A state on a row layer is an
  // ordinary state on an ordinary layer.
  list: "visibility",
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
