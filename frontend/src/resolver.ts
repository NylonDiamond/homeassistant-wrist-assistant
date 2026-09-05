// Port of Shared/CustomComplicationRendering.swift (ResolveContext, format,
// comparisons, rule precedence) and CustomComplicationConfig.elements(for:).
// See docs/custom_complication_schema_v4.md §7 for the semantics each
// function mirrors. Known tolerances vs Swift: `matchesRegex` uses the JS
// engine instead of ICU, and `%.Nf` uses toFixed.

import {
  type Comparison,
  type Condition,
  type CustomComplicationConfig,
  type Element,
  type FamilyKind,
  type FontWeight,
  type ChartBaseline,
  type ChartMarker,
  type ChartScale,
  type ChartStyle,
  type GaugeStyle,
  type ImageContentMode,
  type ImageTimestampCorner,
  type InlineLayout,
  type NamedValue,
  type NormalizedFrame,
  type Rule,
  type ShapeKind,
  type StyleChange,
  type StyleProperty,
  type TapAction,
  type Test,
  type Value,
  type ValueFormat,
  type ChartLabelPlacement,
  type ChartLabelStyle,
  type ChartLatestLabel,
  type CornerBodyShape,
  STYLE_PROPERTY,
  chartBandColor,
  chartHistoryKey,
  chartLabelFontSize,
  chartLabelHeight,
  chartLabelWidth,
  chartScaleLabelText,
  chartSortedBands,
  chartUsesBands,
  elementsFor,
  formatIsEmpty,
  hasFreeTimestamp,
} from "./model.js";
import { keyFor } from "./compiler.js";

export interface EntityState {
  entityId: string;
  state: string;
  unitOfMeasurement?: string;
  iconName: string;
  domain: string;
  /** timer.* entities only: "idle" | "active" | "paused". */
  timerState?: string;
  /** timer.* entities only: ISO timestamp of the finish instant (active timers). */
  finishesAt?: string;
  /** timer.* entities only: seconds remaining while paused. */
  remaining?: number;
  /** camera.* entities: HA's tokenized entity_picture URL, for the preview's
   * image elements (the watch fetches real snapshots through op=snapshot). */
  entityPicture?: string;
}

export interface ResolveContext {
  entityStates: Map<string, EntityState>;
  templateResults: Map<string, string>;
  /** Recorder series for the chart layers that draw history, keyed by
   * `chartHistoryKey`. A missing key draws an empty chart, which is what the
   * watch does too before its first fetch lands. */
  historySeries?: Map<string, string>;
  namedValues: NamedValue[];
  /** Seconds since the value cache was written; undefined = never synced. */
  dataAgeSeconds?: number;
  stalenessThresholdSeconds?: number;
  /** Injectable clock for countdown resolution (epoch ms); defaults to Date.now(). */
  nowMs?: number;
}

export interface ResolvedBase {
  id: string;
  isHidden: boolean;
  frame: NormalizedFrame;
  opacity: number;
}
export interface ResolvedText extends ResolvedBase {
  kind: "text";
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  colorHex: string;
  /** Live-countdown target (epoch ms). When set, the watch ticks toward it;
   * `text` is the static fallback the preview may also show. */
  countdownEnd?: number;
}
export interface ResolvedIcon extends ResolvedBase {
  kind: "icon";
  symbol: string;
  size: number;
  colorHex: string;
}
export interface ResolvedGauge extends ResolvedBase {
  kind: "gauge";
  fraction: number;
  style: GaugeStyle;
  lineWidth: number;
  colorHex: string;
  trackColorHex: string;
}
/** A chart with its series already parsed and its scale already decided.
 * Mirrors `CustomComplication.ResolvedChart` in the app repo. */
export interface ResolvedChart extends ResolvedBase {
  kind: "chart";
  values: number[];
  style: ChartStyle;
  domainMin: number;
  domainMax: number;
  baseline: ChartBaseline;
  barGap: number;
  lineWidth: number;
  colorHex: string;
  /** Index into `values`; absent when nothing is highlighted. */
  highIndex?: number;
  lowIndex?: number;
  highColorHex: string;
  lowColorHex: string;
  marker: ChartMarker;
  /** One colour per reading, parallel to `values`. Empty when the whole series
   * is one colour, which keeps the common case free of a second array. */
  pointColorHexes: string[];
  /** Whether an area's fill follows `pointColorHexes` too. */
  fillBands: boolean;
  /** The number printed at the top of the plot, absent when the labels are off
   * or there is nothing to draw. Text and look both settled here rather than in
   * the renderer, so the panel and the watch print and place the same thing. */
  topLabel?: ResolvedChartLabel;
  bottomLabel?: ResolvedChartLabel;
  scaleLabelPlacement: ChartLabelPlacement;
  /** The newest reading, formatted the same way, absent when not printed. */
  latestLabel?: ResolvedChartLabel;
  latestLabelPlacement: ChartLatestLabel;
}

/** One number printed on a chart, with the look it is drawn in.
 * Mirrors `CustomComplication.ResolvedChartLabel` in the app repo. */
export interface ResolvedChartLabel {
  text: string;
  fontSize: number;
  colorHex: string;
  /** Fill of the plate behind the text, absent for no plate. */
  pillColorHex?: string;
}

export function resolvedLabelWidth(l: ResolvedChartLabel): number {
  return chartLabelWidth(l.text, l.fontSize, l.pillColorHex !== undefined);
}

export function resolvedLabelHeight(l: ResolvedChartLabel): number {
  return chartLabelHeight(l.fontSize, l.pillColorHex !== undefined);
}
export interface ResolvedShape extends ResolvedBase {
  kind: "shape";
  shapeKind: ShapeKind;
  cornerRadius: number;
  fillColorHex: string;
  borderColorHex?: string;
  borderWidth: number;
}
export interface ResolvedImage extends ResolvedBase {
  kind: "image";
  entityId: string;
  /** Preview URL (HA's entity_picture). Absent = draw the camera placeholder. */
  url?: string;
  /** Whether the watch draws the fetched-at overlay. */
  showTimestamp: boolean;
  /** The picture and timestamp settings, straight off the payload: no rule
   * changes any of them, they are just carried here so the preview can draw
   * the same crop the watch does. */
  contentMode: ImageContentMode;
  zoom: number;
  panX: number;
  panY: number;
  cornerRadius: number;
  timestampCorner: ImageTimestampCorner;
  timestampSize: number;
  /** Free chip placement, both or neither. Absent leaves `timestampCorner` in
   * charge, exactly as before the pair existed. */
  timestampX?: number;
  timestampY?: number;
}
/** A tap area after rules ran. Draws nothing on the watch; the preview outlines
 * it in edit mode. Only visibility rules apply, so opacity is always 1. */
export interface ResolvedTap extends ResolvedBase {
  kind: "tap";
  action: TapAction;
  openPageId?: string;
  /** The layer this tap belongs to, if any. Carried only so the editor's
   * preview can leave an attached tap undrawn; the watch ignores it. */
  attachedTo?: string;
}
export type ResolvedElement = ResolvedText | ResolvedIcon | ResolvedGauge | ResolvedChart | ResolvedShape | ResolvedImage | ResolvedTap;

export interface ResolvedBezelGauge {
  value: number;
  minValue: number;
  maxValue: number;
  colorHexes: string[];
  minLabel?: string;
  maxLabel?: string;
}

export interface ResolvedLayout {
  family: FamilyKind;
  elements: ResolvedElement[];
  bezelText?: string;
  /** Live-countdown target for the bezel label (epoch ms). */
  bezelCountdownEnd?: number;
  /** Big curved main text (corner only); when set, the canvas is not drawn. */
  curvedText?: string;
  curvedColorHex?: string;
  /** Corner bezel gauge; wins over bezelText. */
  bezelGauge?: ResolvedBezelGauge;
  backgroundColorHex?: string;
  cornerBodyShape: CornerBodyShape;
  borderColorHex?: string;
  borderWidth: number;
}

/** Which rule branch the preview should force, per rule id. */
export type ForcedBranches = Map<string, { caseId: string } | "otherwise" | "live">;

// ── number helpers ────────────────────────────────────────────────────────

function swiftDouble(s: string): number | undefined {
  // Swift's Double(String) accepts decimal, exponent, inf/nan, leading sign.
  const t = s;
  if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return Number(t);
  const lower = t.toLowerCase();
  if (lower === "inf" || lower === "+inf" || lower === "infinity" || lower === "+infinity") return Infinity;
  if (lower === "-inf" || lower === "-infinity") return -Infinity;
  if (lower === "nan" || lower === "+nan" || lower === "-nan") return NaN;
  return undefined;
}

export function leadingNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  const direct = swiftDouble(trimmed);
  if (direct !== undefined) return direct;
  let collected = "";
  for (const ch of trimmed) {
    const numeric = /\p{N}/u.test(ch) || ch === "." || ch === "-" || ch === "+";
    if (numeric) collected += ch;
    else if (collected.length > 0) break;
  }
  if (collected.length === 0) return undefined;
  const n = swiftDouble(collected);
  return n;
}

function swiftStringOfDouble(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e16) return n.toFixed(1);
  return String(n);
}

function relativeTimeString(seconds: number): string {
  const s = Math.max(0, seconds);
  if (s < 60) return `${Math.trunc(s)}s`;
  if (s < 3600) return `${Math.trunc(s / 60)}m`;
  if (s < 86400) return `${Math.trunc(s / 3600)}h`;
  return `${Math.trunc(s / 86400)}d`;
}

function capitalized(s: string): string {
  return s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function formatValue(raw: string, format: ValueFormat | undefined, unit: string | undefined): string {
  if (formatIsEmpty(format)) return raw;
  const f = format!;
  let text = raw;
  const trimmedNumber = swiftDouble(raw.trim());
  if (f.relativeTime && trimmedNumber !== undefined) {
    text = relativeTimeString(trimmedNumber);
  } else {
    const n = leadingNumber(raw);
    if (n !== undefined) {
      const scaled = n * (f.multiply ?? 1) + (f.offset ?? 0);
      if (f.decimals !== undefined) {
        text = scaled.toFixed(Math.max(0, f.decimals));
      } else if (scaled !== n) {
        text = Number.isInteger(scaled) ? String(scaled) : swiftStringOfDouble(scaled);
      }
    }
  }
  if (f.useEntityUnit && unit) {
    text += unit.startsWith("°") || unit.startsWith("%") ? unit : ` ${unit}`;
  }
  if (f.prefix) text = f.prefix + text;
  if (f.suffix) text = text + f.suffix;
  switch (f.textCase) {
    case "upper": text = text.toUpperCase(); break;
    case "lower": text = text.toLowerCase(); break;
    case "capitalized": text = capitalized(text); break;
  }
  return text;
}

/** Clock-style remaining time for a paused timer: "4:30", "1:02:15". Mirrors
 * `CustomComplication.countdownRemainingString` in Swift. */
export function countdownRemainingString(seconds: number): string {
  const total = Math.trunc(Math.max(0, seconds));
  const h = Math.trunc(total / 3600);
  const m = Math.trunc((total % 3600) / 60);
  const s = total % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

/** Every number in a string, in the order they appear. What turns one resolved
 * value into a chart's series.
 *
 * Deliberately loose about what sits between the numbers: commas, spaces, square
 * brackets, units and currency signs are all just separators. A dot is a decimal
 * point and a comma never is, because a comma is the one separator every
 * integration already emits. A sign only counts as a sign when nothing numeric
 * precedes it, which keeps "2026-09-05" from reading as negative numbers.
 *
 * Mirrors `CustomComplication.numbers(in:)` in Swift; the two are held together
 * by `CustomComplicationChartTests`. */
export function chartNumbers(raw: string, limit = 240): number[] {
  const out: number[] = [];
  let token = "";
  let previousWasNumeric = false;

  const flush = () => {
    if (token !== "") {
      const parsed = Number(token);
      if (Number.isFinite(parsed)) out.push(parsed);
    }
    token = "";
  };

  for (const ch of raw) {
    if (out.length >= limit) break;
    if (ch >= "0" && ch <= "9") {
      token += ch;
      previousWasNumeric = true;
    } else if (ch === ".") {
      // A second dot ends the reading rather than making it unparseable.
      if (token.includes(".")) flush();
      token += ".";
      previousWasNumeric = true;
    } else if (ch === "-" || ch === "+") {
      const isSign = !previousWasNumeric;
      flush();
      if (isSign) token += ch;
      previousWasNumeric = false;
    } else {
      flush();
      previousWasNumeric = false;
    }
  }
  if (out.length < limit) flush();
  return out;
}

/** The value range a chart's plot covers. Mirrors `CustomComplication.chartDomain`. */
export function chartDomain(
  values: number[],
  opts: { scale: ChartScale; minValue: number; maxValue: number; baseline: ChartBaseline },
): { min: number; max: number } {
  let lo: number;
  let hi: number;

  if (opts.scale === "fixed") {
    lo = Math.min(opts.minValue, opts.maxValue);
    hi = Math.max(opts.minValue, opts.maxValue);
  } else {
    lo = values.length > 0 ? Math.min(...values) : 0;
    hi = values.length > 0 ? Math.max(...values) : 1;
  }

  if (opts.baseline === "zero") {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }

  if (!(hi > lo)) hi = lo + 1;
  return { min: lo, max: hi };
}

export function gaugeFraction(raw: string | undefined, min: number, max: number): number {
  if (raw === undefined) return 0;
  const n = leadingNumber(raw);
  if (n === undefined || Number.isNaN(n)) return 0;
  const span = max - min;
  if (span === 0) return 0;
  return Math.min(1, Math.max(0, (n - min) / span));
}

// ── value resolution ──────────────────────────────────────────────────────

export class Resolver {
  private readonly named: Map<string, Value>;

  constructor(private readonly ctx: ResolveContext) {
    this.named = new Map(ctx.namedValues.map((n) => [n.id.toUpperCase(), n.value]));
  }

  private dereference(value: Value): Value | undefined {
    let current = value;
    const seen = new Set<string>();
    let inheritedFormat = value.format;
    while (current.kind.kind === "named") {
      const id = current.kind.id.toUpperCase();
      if (seen.has(id)) return undefined;
      seen.add(id);
      const target = this.named.get(id);
      if (!target) return undefined;
      // A format on the reference wins over the named value's own format.
      inheritedFormat = inheritedFormat && !formatIsEmpty(inheritedFormat) ? inheritedFormat : target.format;
      current = target;
    }
    const out: Value = { kind: current.kind };
    if (inheritedFormat) out.format = inheritedFormat;
    return out;
  }

  private directEntityUnit(value: Value): string | undefined {
    const k = value.kind;
    if (k.kind === "entityState" || k.kind === "entityAttribute" || k.kind === "entityAge") {
      return this.ctx.entityStates.get(k.entityId)?.unitOfMeasurement;
    }
    return undefined;
  }

  resolve(value: Value | undefined): string | undefined {
    if (!value) return undefined;
    const deref = this.dereference(value);
    if (!deref) return undefined;
    let raw: string | undefined;
    switch (deref.kind.kind) {
      case "literal":
        raw = deref.kind.value;
        break;
      case "entityState":
        raw = this.ctx.entityStates.get(deref.kind.entityId)?.state;
        break;
      case "dataAge":
        raw = this.ctx.dataAgeSeconds === undefined ? undefined : String(Math.trunc(this.ctx.dataAgeSeconds));
        break;
      default: {
        // Keyed off the ORIGINAL (un-dereferenced) value.
        const key = keyFor(value, this.named);
        raw = key === undefined ? undefined : this.ctx.templateResults.get(key);
      }
    }
    if (raw === undefined) return undefined;
    return formatValue(raw, deref.format, this.directEntityUnit(deref));
  }

  private nowMs(): number {
    return this.ctx.nowMs ?? Date.now();
  }

  /** Live-countdown target for a countdown-enabled text or bezel value. Mirrors
   * `ResolveContext.countdownEnd(for:)` in Swift: an entity-state source pointing
   * at an HA timer counts down to its finish instant while active; any other
   * source is accepted when it resolves to a future ISO timestamp or unix
   * seconds. Tolerance vs Swift: `Date.parse` accepts a few more ISO shapes. */
  countdownEnd(value: Value | undefined): number | undefined {
    if (!value) return undefined;
    const deref = this.dereference(value);
    if (!deref) return undefined;
    const k = deref.kind;
    if (k.kind === "entityState") {
      const s = this.ctx.entityStates.get(k.entityId);
      if (s?.timerState !== undefined) {
        if (s.timerState !== "active" || !s.finishesAt) return undefined;
        const t = Date.parse(s.finishesAt);
        return Number.isFinite(t) && t > this.nowMs() ? t : undefined;
      }
    }
    const raw = this.resolve(value)?.trim();
    if (!raw) return undefined;
    let t = Date.parse(raw);
    if (!Number.isFinite(t)) {
      const n = swiftDouble(raw);
      t = n === undefined ? NaN : n * 1000;
    }
    return Number.isFinite(t) && t > this.nowMs() ? t : undefined;
  }

  /** Static stand-in behind a countdown when the source is a timer entity:
   * paused shows the remaining time, everything else "Idle" (the preset's
   * wording). Undefined for non-timer sources. */
  countdownFallbackText(value: Value | undefined): string | undefined {
    if (!value) return undefined;
    const deref = this.dereference(value);
    if (!deref || deref.kind.kind !== "entityState") return undefined;
    const s = this.ctx.entityStates.get(deref.kind.entityId);
    if (s?.timerState === undefined) return undefined;
    if (s.timerState === "paused") {
      if (s.remaining !== undefined && s.remaining > 0) return countdownRemainingString(s.remaining);
      return "Paused";
    }
    return "Idle";
  }

  entityIcon(symbol: Value): string | undefined {
    const deref = this.dereference(symbol);
    if (!deref || deref.kind.kind !== "entityState") return undefined;
    const cached = this.ctx.entityStates.get(deref.kind.entityId);
    return cached?.iconName ?? deref.kind.iconName;
  }

  // ── rules ─────────────────────────────────────────────────────────────

  private isStale(): boolean {
    const age = this.ctx.dataAgeSeconds ?? Infinity;
    return age > (this.ctx.stalenessThresholdSeconds ?? 20 * 60);
  }

  evaluateTest(test: Test): boolean {
    const c = test.comparison;
    if (c.kind === "isStale") return this.isStale();
    const lhs = this.resolve(test.value);
    if (lhs === undefined) return c.kind === "isUnavailable";
    const lhsNumber = leadingNumber(lhs);
    const rhsString = () => this.resolve(c.value);
    const rhsNumber = () => {
      const s = rhsString();
      return s === undefined ? undefined : leadingNumber(s);
    };
    const numeric = (op: (a: number, b: number) => boolean) => {
      const b = rhsNumber();
      if (lhsNumber === undefined || b === undefined) return false;
      return op(lhsNumber, b);
    };
    switch (c.kind) {
      case "equals": { const r = rhsString(); return r !== undefined && lhs === r; }
      case "notEquals": { const r = rhsString(); return r !== undefined && lhs !== r; }
      case "isOn": return lhs.toLowerCase() === "on";
      case "isOff": return lhs.toLowerCase() === "off";
      case "isUnavailable": { const l = lhs.toLowerCase(); return l === "unavailable" || l === "unknown"; }
      case "isEmpty": return lhs.trim().length === 0;
      case "greaterThan": return numeric((a, b) => a > b);
      case "greaterOrEqual": return numeric((a, b) => a >= b);
      case "lessThan": return numeric((a, b) => a < b);
      case "lessOrEqual": return numeric((a, b) => a <= b);
      case "between": {
        const lo = rhsNumber();
        const upS = this.resolve(c.upper);
        const hi = upS === undefined ? undefined : leadingNumber(upS);
        if (lhsNumber === undefined || lo === undefined || hi === undefined) return false;
        const [a, b] = lo <= hi ? [lo, hi] : [hi, lo];
        return lhsNumber >= a && lhsNumber <= b;
      }
      case "contains": {
        const r = rhsString();
        return !!r && lhs.toLowerCase().includes(r.toLowerCase());
      }
      case "startsWith": {
        const r = rhsString();
        return !!r && lhs.toLowerCase().startsWith(r.toLowerCase());
      }
      case "endsWith": {
        const r = rhsString();
        return !!r && lhs.toLowerCase().endsWith(r.toLowerCase());
      }
      case "matchesRegex": {
        if (!c.pattern) return false;
        try {
          return new RegExp(c.pattern).test(lhs);
        } catch {
          return false;
        }
      }
      case "isOneOf":
        return (c.options ?? []).some((o) => o.toLowerCase() === lhs.toLowerCase());
      default:
        return false;
    }
  }

  evaluateCondition(condition: Condition): boolean {
    if (condition.tests.length === 0) return true;
    return condition.join === "any"
      ? condition.tests.some((t) => this.evaluateTest(t))
      : condition.tests.every((t) => this.evaluateTest(t));
  }

  /** Applies rules in order; returns the winning change per property. */
  applyRules(rules: Rule[], forced?: ForcedBranches): Map<StyleProperty, StyleChange> {
    const result = new Map<StyleProperty, StyleChange>();
    for (const rule of rules) {
      const force = forced?.get(rule.id);
      let changes: StyleChange[] = [];
      if (force && force !== "live") {
        if (force === "otherwise") changes = rule.otherwise ?? [];
        else changes = rule.cases.find((c) => c.id === force.caseId)?.then ?? [];
      } else {
        const matched = rule.cases.find((c) => this.evaluateCondition(c.when));
        changes = matched ? matched.then : rule.otherwise ?? [];
      }
      for (const change of changes) result.set(STYLE_PROPERTY[change.kind], change);
    }
    return result;
  }

  /** Which branch each rule takes live (for the preview's branch indicator). */
  liveBranches(rules: Rule[]): Map<string, string> {
    const out = new Map<string, string>();
    for (const rule of rules) {
      const matched = rule.cases.find((c) => this.evaluateCondition(c.when));
      out.set(rule.id, matched ? matched.id : rule.otherwise ? "otherwise" : "none");
    }
    return out;
  }

  private styleColor(style: Map<StyleProperty, StyleChange>, prop: StyleProperty): string | undefined {
    const change = style.get(prop);
    if (!change) return undefined;
    const s = this.resolve(change.value);
    return s ? s : undefined;
  }
  private styleText(style: Map<StyleProperty, StyleChange>, prop: StyleProperty): string | undefined {
    const change = style.get(prop);
    return change ? this.resolve(change.value) : undefined;
  }
  private styleNumber(style: Map<StyleProperty, StyleChange>, prop: StyleProperty): number | undefined {
    return style.get(prop)?.number;
  }

  // ── elements and layouts ──────────────────────────────────────────────

  resolveElement(el: Element, forced?: ForcedBranches): ResolvedElement {
    const p = el.payload;
    const style = this.applyRules(p.rules, forced);
    const visibility = style.get("visibility");
    const isHidden = visibility ? visibility.kind === "hide" : p.isHidden;
    const rotation = this.styleNumber(style, "rotation");
    const frame = rotation === undefined ? p.frame : { ...p.frame, rotationDegrees: rotation };
    const opacity = this.styleNumber(style, "opacity") ?? 1;
    const base = { id: p.id, isHidden, frame, opacity };
    switch (el.kind) {
      case "text": {
        const countdownEnd = el.payload.countdown ? this.countdownEnd(el.payload.value) : undefined;
        const fallback = el.payload.countdown ? this.countdownFallbackText(el.payload.value) : undefined;
        const out: ResolvedText = {
          kind: "text",
          ...base,
          text: this.styleText(style, "text") ?? fallback ?? this.resolve(el.payload.value) ?? "--",
          fontSize: this.styleNumber(style, "fontSize") ?? el.payload.fontSize,
          fontWeight: style.get("fontWeight")?.weight ?? el.payload.fontWeight,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
        };
        if (countdownEnd !== undefined) out.countdownEnd = countdownEnd;
        return out;
      }
      case "icon": {
        const baseSymbol = this.entityIcon(el.payload.symbol) ?? this.resolve(el.payload.symbol) ?? "questionmark.circle";
        return {
          kind: "icon",
          ...base,
          symbol: this.styleText(style, "icon") ?? baseSymbol,
          size: this.styleNumber(style, "fontSize") ?? el.payload.size,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
        };
      }
      case "gauge": {
        const raw = this.styleText(style, "gaugeValue") ?? this.resolve(el.payload.value);
        const min = this.styleNumber(style, "gaugeMin") ?? el.payload.minValue;
        const max = this.styleNumber(style, "gaugeMax") ?? el.payload.maxValue;
        return {
          kind: "gauge",
          ...base,
          fraction: gaugeFraction(raw, min, max),
          style: el.payload.style,
          lineWidth: el.payload.lineWidth,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
          trackColorHex: el.payload.trackColorHex,
        };
      }
      case "chart": {
        const c = el.payload;
        // A history chart never reads its own value: the value only names the
        // entity, and the readings are whatever the last recorder fetch left
        // behind. Before that arrives the chart is empty rather than one bar of
        // the current state, which would draw a lie that looks like real data.
        const historyKey = chartHistoryKey(c);
        const raw = historyKey !== undefined
          ? (this.ctx.historySeries?.get(historyKey) ?? "")
          : (this.resolve(c.value) ?? "");
        let values = chartNumbers(raw);
        if (c.limit > 0 && values.length > c.limit) {
          values = c.takeFromEnd ? values.slice(values.length - c.limit) : values.slice(0, c.limit);
        }
        const domain = chartDomain(values, c);
        const baseColorHex = this.styleColor(style, "color") ?? c.colorSlot.baseColorHex;
        const sortedBands = chartSortedBands(c);
        const pointColorHexes = chartUsesBands(c)
          ? values.map((v) => chartBandColor(v, sortedBands, c.bandAboveColorHex))
          : [];
        const out: ResolvedChart = {
          kind: "chart",
          ...base,
          values,
          style: c.style,
          domainMin: domain.min,
          domainMax: domain.max,
          baseline: c.baseline,
          barGap: c.barGap,
          lineWidth: c.lineWidth,
          colorHex: baseColorHex,
          highColorHex: c.highColorHex,
          lowColorHex: c.lowColorHex,
          marker: c.marker,
          pointColorHexes,
          fillBands: c.fillBands,
          scaleLabelPlacement: c.scaleLabelPlacement,
          latestLabelPlacement: c.latestLabel,
        };
        const span = domain.max - domain.min;
        const label = (text: string, style: ChartLabelStyle, colorHex?: string): ResolvedChartLabel => {
          const l: ResolvedChartLabel = {
            text,
            fontSize: chartLabelFontSize(style),
            colorHex: colorHex ?? style.colorHex,
          };
          if (style.pillColorHex !== undefined) l.pillColorHex = style.pillColorHex;
          return l;
        };
        if (c.scaleLabels !== "none" && values.length > 0) {
          out.topLabel = label(chartScaleLabelText(domain.max, span), c.topLabelStyle);
          if (c.scaleLabels === "range") {
            out.bottomLabel = label(chartScaleLabelText(domain.min, span), c.bottomLabelStyle);
          }
        }
        if (c.latestLabel !== "none" && values.length > 0) {
          // A banded chart's newest number takes the mark's own colour by default,
          // so the two agree without anyone setting the same hex twice.
          const banded = c.latestLabelFollowsBand
            ? pointColorHexes[pointColorHexes.length - 1]
            : undefined;
          out.latestLabel = label(
            chartScaleLabelText(values[values.length - 1]!, span),
            c.latestLabelStyle,
            banded,
          );
        }
        if (values.length > 0) {
          const marksHigh = c.highlight === "highest" || c.highlight === "both";
          const marksLow = c.highlight === "lowest" || c.highlight === "both";
          const high = marksHigh ? values.indexOf(Math.max(...values)) : -1;
          const low = marksLow ? values.indexOf(Math.min(...values)) : -1;
          if (high >= 0) out.highIndex = high;
          // One reading cannot be both ends of the range; highest wins.
          if (low >= 0 && low !== high) out.lowIndex = low;
        }
        return out;
      }
      case "shape": {
        const out: ResolvedShape = {
          kind: "shape",
          ...base,
          shapeKind: el.payload.kind,
          cornerRadius: el.payload.cornerRadius,
          fillColorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
          borderWidth: this.styleNumber(style, "borderWidth") ?? el.payload.borderWidth,
        };
        const border = this.styleColor(style, "borderColor") ?? el.payload.borderColorHex;
        if (border !== undefined) out.borderColorHex = border;
        return out;
      }
      case "image": {
        const out: ResolvedImage = {
          kind: "image",
          ...base,
          entityId: el.payload.entity.entityId,
          showTimestamp: el.payload.timestamp === true,
          contentMode: el.payload.contentMode,
          zoom: el.payload.zoom,
          panX: el.payload.panX,
          panY: el.payload.panY,
          cornerRadius: el.payload.cornerRadius,
          timestampCorner: el.payload.timestampCorner,
          timestampSize: el.payload.timestampSize,
        };
        if (hasFreeTimestamp(el.payload)) {
          out.timestampX = el.payload.timestampX;
          out.timestampY = el.payload.timestampY;
        }
        const url = this.ctx.entityStates.get(el.payload.entity.entityId)?.entityPicture;
        if (url !== undefined) out.url = url;
        return out;
      }
      case "tap": {
        // Mirrors resolveTap in the app: visibility is the only rule that applies,
        // the frame's own rotation stays, opacity is always 1.
        const out: ResolvedTap = {
          kind: "tap",
          ...base,
          frame: el.payload.frame,
          opacity: 1,
          action: el.payload.action,
        };
        if (el.payload.openPageId !== undefined) out.openPageId = el.payload.openPageId;
        if (el.payload.attachedTo !== undefined) out.attachedTo = el.payload.attachedTo;
        return out;
      }
    }
  }

  resolveLayout(config: CustomComplicationConfig, family: FamilyKind, forced?: ForcedBranches): ResolvedLayout {
    const layout = config.perFamily[family];
    const elements = elementsFor(config, family).map((el) => this.resolveElement(el, forced));
    const style = layout ? this.applyRules(layout.rules, forced) : new Map<StyleProperty, StyleChange>();
    const out: ResolvedLayout = {
      family,
      elements,
      cornerBodyShape: layout?.cornerBodyShape ?? "wedge",
      borderWidth: this.styleNumber(style, "borderWidth") ?? layout?.borderWidth ?? 2,
    };
    const bezelStyled = this.styleText(style, "text");
    const bezelCountdownEnd = layout?.bezelCountdown && bezelStyled === undefined
      ? this.countdownEnd(layout.bezelText) : undefined;
    const bezelFallback = layout?.bezelCountdown
      ? this.countdownFallbackText(layout.bezelText) : undefined;
    const bezel = bezelStyled ?? bezelFallback ?? this.resolve(layout?.bezelText);
    if (bezel !== undefined) out.bezelText = bezel;
    if (bezelCountdownEnd !== undefined) out.bezelCountdownEnd = bezelCountdownEnd;
    const curved = this.resolve(layout?.curvedText);
    if (curved !== undefined) out.curvedText = curved;
    if (layout?.curvedColorHex !== undefined) out.curvedColorHex = layout.curvedColorHex;
    if (layout?.bezelGauge) {
      const g = layout.bezelGauge;
      const raw = this.resolve(g.value);
      const n = raw === undefined ? undefined : leadingNumber(raw);
      if (n !== undefined) {
        const lo = Math.min(g.minValue, g.maxValue);
        const hi = Math.max(g.minValue, g.maxValue);
        const gauge: ResolvedBezelGauge = {
          value: Math.min(hi, Math.max(lo, n)),
          minValue: lo,
          maxValue: hi === lo ? lo + 1 : hi,
          colorHexes: g.colorHexes,
        };
        const loLabel = this.resolve(g.minLabel);
        if (loLabel !== undefined) gauge.minLabel = loLabel;
        const hiLabel = this.resolve(g.maxLabel);
        if (hiLabel !== undefined) gauge.maxLabel = hiLabel;
        out.bezelGauge = gauge;
      }
    }
    const bg = this.styleColor(style, "backgroundColor") ?? layout?.backgroundColorHex;
    if (bg !== undefined) out.backgroundColorHex = bg;
    const border = this.styleColor(style, "borderColor") ?? layout?.borderColorHex;
    if (border !== undefined) out.borderColorHex = border;
    return out;
  }
}

/** The Inline shape, resolved. Mirrors `CustomComplication.resolveInline`:
 * the value through the same path as a text layer, empty label and symbol
 * read as absent, "--" when nothing resolves. */
export interface ResolvedInline {
  label?: string;
  text: string;
  symbol?: string;
  /** Live-countdown target (epoch ms), as on ResolvedText. */
  countdownEnd?: number;
}

export function resolveInline(inline: InlineLayout, ctx: ResolveContext): ResolvedInline {
  const r = new Resolver(ctx);
  const countdownEnd = inline.countdown ? r.countdownEnd(inline.value) : undefined;
  const fallback = inline.countdown ? r.countdownFallbackText(inline.value) : undefined;
  const out: ResolvedInline = { text: fallback ?? r.resolve(inline.value) ?? "--" };
  if (inline.label) out.label = inline.label;
  if (inline.symbol) out.symbol = inline.symbol;
  if (countdownEnd !== undefined) out.countdownEnd = countdownEnd;
  return out;
}

/** Every shape the document supports, resolved at once: the supported canvas
 * shapes as layouts, plus Inline when the document supports it and carries
 * one. A shape not in `supportedFamilies` is absent, the same as the watch
 * (app repo `CustomComplication.resolveDocument`), so a preview never shows a
 * shape the wrist would not draw. */
export type ResolvedAll = Partial<Record<"rectangular" | "circular" | "corner", ResolvedLayout>> & { inline?: ResolvedInline };

export function resolveAll(
  config: CustomComplicationConfig,
  ctx: ResolveContext,
  forced?: ForcedBranches,
): ResolvedAll {
  const r = new Resolver(ctx);
  const out: ResolvedAll = {};
  for (const family of ["rectangular", "circular", "corner"] as const) {
    if (config.supportedFamilies.includes(family)) out[family] = r.resolveLayout(config, family, forced);
  }
  if (config.supportedFamilies.includes("inline") && config.inline) out.inline = resolveInline(config.inline, ctx);
  return out;
}

export function comparisonNeedsValue(c: Comparison): boolean {
  return c.value !== undefined;
}
