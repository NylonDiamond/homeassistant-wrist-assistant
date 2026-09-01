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
  type GaugeStyle,
  type NamedValue,
  type NormalizedFrame,
  type Rule,
  type ShapeKind,
  type StyleChange,
  type StyleProperty,
  type Test,
  type Value,
  type ValueFormat,
  type CornerBodyShape,
  STYLE_PROPERTY,
  elementsFor,
  formatIsEmpty,
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
}
export type ResolvedElement = ResolvedText | ResolvedIcon | ResolvedGauge | ResolvedShape | ResolvedImage;

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
        };
        const url = this.ctx.entityStates.get(el.payload.entity.entityId)?.entityPicture;
        if (url !== undefined) out.url = url;
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

/** Convenience: resolve every drawable family at once. */
export function resolveAll(
  config: CustomComplicationConfig,
  ctx: ResolveContext,
  forced?: ForcedBranches,
): Record<"rectangular" | "circular" | "corner", ResolvedLayout> {
  const r = new Resolver(ctx);
  return {
    rectangular: r.resolveLayout(config, "rectangular", forced),
    circular: r.resolveLayout(config, "circular", forced),
    corner: r.resolveLayout(config, "corner", forced),
  };
}

export function comparisonNeedsValue(c: Comparison): boolean {
  return c.value !== undefined;
}
