// CustomComplicationConfig schemaVersion 4/5/6, as the Apple clients encode it.
// Wire-format reference: docs/custom_complication_schema_v4.md in the app
// repo. `parseConfig` normalises the two shapes Swift can emit (perFamily as
// an alternating array, `Value` in flat v2 or nested v3 form) into one typed
// object; `encodeConfig` writes back exactly the shape the phone expects.
// v5 is shape-identical to v4 and only marks slotIndex > 7; v6 adds the
// optional `inline` object and marks a document that lacks a canvas shape or
// carries Inline (see schemaVersionFor).

export type FamilyKind = "rectangular" | "circular" | "corner" | "inline";
export const DRAWABLE_FAMILIES: FamilyKind[] = ["rectangular", "circular", "corner"];

/** The design box each shape is drawn in, in points: the real WidgetKit slot on
 * a 46 mm watch. Frames are fractions of these, so the same point value is a
 * different fraction in each shape, which is why growing a tap area has to be
 * done per shape. `renderer.ts` re-exports this as CANVAS; mirrors
 * `CustomComplication.DesignBox` in Swift. */
export const DESIGN_BOX: Record<"rectangular" | "circular" | "corner", { width: number; height: number }> = {
  rectangular: { width: 181, height: 65.5 },
  circular: { width: 51, height: 51 },
  corner: { width: 34, height: 34 },
};
/** Every shape, in the order the schema lists them. `layouts.ts` re-exports it
 * as ALL_FAMILIES for the panel; it lives here so newConfig can order a set. */
const ALL_FAMILY_ORDER: FamilyKind[] = ["rectangular", "circular", "corner", "inline"];

// The watch face picker always shows the first BASE_SLOTS slots and grows past
// them only when a higher slot is occupied; MAX_SLOTS is the hard ceiling both
// the app and the integration enforce.
export const BASE_SLOTS = 8;
export const MAX_SLOTS = 64;

/** One watch-face slot something other than this server's records holds,
 * per the watch's last sync report: an iPhone preset (any home) or a custom
 * complication that lives on another Home Assistant. `home` is that home's
 * display name, empty when the watch did not say. */
export interface OccupiedSlot {
  slot: number;
  name: string;
  kind: "preset" | "custom";
  home: string;
  /** A custom document's `supportedFamilies`, sorted. Absent for presets and
   * from a watch that predates per-shape documents. */
  families?: FamilyKind[];
}

/** First slot neither a stored record nor an occupied entry uses, or -1 when
 * every slot is taken. A custom written under a preset would be masked at
 * render, and one written under another home's custom would collide on the
 * face, so both count as taken. */
export function freeSlotFrom(recordSlots: Iterable<number>, occupied: Iterable<{ slot: number }>): number {
  const used = new Set<number>(recordSlots);
  for (const o of occupied) used.add(o.slot);
  for (let i = 0; i < MAX_SLOTS; i++) if (!used.has(i)) return i;
  return -1;
}

/** The occupied entries the picker still draws as locked rows. A preset whose
 * slot a stored record now holds has already moved into Home Assistant: the
 * watch keeps reporting the preset until its next sync, and drawing both would
 * show one slot twice. Customs on another home always stay. */
export function lockedOccupied(recordSlots: Iterable<number>, occupied: readonly OccupiedSlot[]): OccupiedSlot[] {
  const held = new Set<number>(recordSlots);
  return occupied.filter((o) => o.kind !== "preset" || !held.has(o.slot));
}

/** The schema a document must carry for its content. Mirrors
 * `CustomComplicationConfig.schemaVersion(for:)` in the app.
 *
 * 6 when the document lacks one of the three canvas shapes, lists Inline, or
 * carries an `inline` object: an app that predates per-shape support would
 * draw the missing shapes from the shared layers, or "Custom" for Inline, so
 * it must skip the document ("needs app update") instead. Otherwise 5 above
 * slot 7 (an old app's slot-id parser rejects ids past 8) and 4 below, so an
 * unchanged document stays byte-stable for old apps. */
export function schemaVersionFor(cfg: Pick<CustomComplicationConfig, "slotIndex" | "supportedFamilies" | "inline">): number {
  const missesCanvasShape = DRAWABLE_FAMILIES.some((f) => !cfg.supportedFamilies.includes(f));
  if (missesCanvasShape || cfg.supportedFamilies.includes("inline") || cfg.inline !== undefined) return 6;
  return cfg.slotIndex > 7 ? 5 : 4;
}

export type FontWeight = "regular" | "medium" | "semibold" | "bold";
export type TextCase = "upper" | "lower" | "capitalized";
export type TimeField = "now" | "hour" | "minute" | "weekday" | "day" | "month" | "timestamp";
export type GaugeStyle = "ring" | "arc" | "bar" | "dots";
export type ChartStyle = "bars" | "line" | "area";
export type ChartScale = "auto" | "fixed";
export type ChartBaseline = "lowest" | "zero";
export type ChartHighlight = "none" | "highest" | "lowest" | "both";
export type ChartMarker = "none" | "dot" | "pointer";
/** The mark over one highlighted end of a chart. */
export type ChartEndMarker = "none" | "dot" | "triangle";
export const CHART_END_MARKERS: readonly ChartEndMarker[] = ["none", "dot", "triangle"];
export type ChartColoring = "uniform" | "bands";
/** How a line or area chart joins its readings. `straight` is a ruler line
 * from reading to reading, `smooth` a monotone cubic that never passes either
 * end reading of a leg, `step` holds each reading flat until the next one.
 * Ignored by bars. A new key rather than new `style` cases, because an older
 * watch fails a layer whose `style` it does not know but ignores this key. */
export type ChartCurve = "straight" | "smooth" | "step";
export const CHART_CURVES: readonly ChartCurve[] = ["straight", "smooth", "step"];
/** How strongly a chart smooths its readings. Off is the key being absent. */
export type ChartSmoothing = "light" | "medium" | "strong";
export const CHART_SMOOTHINGS: readonly ChartSmoothing[] = ["light", "medium", "strong"];
/** The share of the drawn readings each strength averages over. */
export const CHART_SMOOTHING_SHARES: Readonly<Record<ChartSmoothing, number>> = { light: 0.05, medium: 0.10, strong: 0.20 };

/** A decoded `curve`, with any spelling this build does not know read as straight. */
export function chartCurve(raw: unknown): ChartCurve {
  return typeof raw === "string" && (CHART_CURVES as readonly string[]).includes(raw) ? raw as ChartCurve : "straight";
}

/** How an area chart washes the space under its line: `flat` one even wash,
 * `fade` the same strength at the top of the plot fading to clear at the
 * baseline. Ignored by bars and line. */
export type ChartFillStyle = "flat" | "fade";
export const CHART_FILL_STYLES: readonly ChartFillStyle[] = ["flat", "fade"];
/** Which readings of a line or area get a dot. `auto` draws every dot only
 * while the readings sit far enough apart to tell the dots apart. */
export type ChartPointDots = "none" | "all" | "auto";
export const CHART_POINT_DOTS: readonly ChartPointDots[] = ["none", "all", "auto"];
/** The most horizontal grid lines a chart draws. */
export const CHART_MAX_GRID_LINES = 4;
/** Grid line colour when the layer stores none: white at 20 %. */
export const CHART_DEFAULT_GRID_HEX = "#FFFFFF33";

/** A decoded `fillStyle`, with any spelling this build does not know read as flat. */
export function chartFillStyle(raw: unknown): ChartFillStyle {
  return typeof raw === "string" && (CHART_FILL_STYLES as readonly string[]).includes(raw) ? raw as ChartFillStyle : "flat";
}

/** A decoded `pointDots`, with any spelling this build does not know read as none. */
export function chartPointDots(raw: unknown): ChartPointDots {
  return typeof raw === "string" && (CHART_POINT_DOTS as readonly string[]).includes(raw) ? raw as ChartPointDots : "none";
}

/** A decoded `gridLines`: a whole number clamped into 0…4, anything else 0. */
export function chartGridLines(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(CHART_MAX_GRID_LINES, Math.round(raw)));
}

/** Two stored colours that spell the same hex, whatever the case of the digits. */
export function sameHex(a: string, b: string): boolean {
  return a.replace(/^#/, "").toUpperCase() === b.replace(/^#/, "").toUpperCase();
}

/** A decoded `gridColorHex`: the stored colour, or the default when none is. */
export function chartGridColorHex(raw: unknown): string {
  return typeof raw === "string" && raw !== "" ? raw : CHART_DEFAULT_GRID_HEX;
}

/** The smallest and largest reading dot a chart draws, across, in design points. */
export const CHART_MIN_POINT_DOT_SIZE = 1;
export const CHART_MAX_POINT_DOT_SIZE = 12;

/** A decoded `pointDotSize`: a finite number clamped into 1…12, anything else
 * absent, which draws the automatic size. Also a `chartDots` layer's `size`. */
export function chartPointDotSize(raw: unknown): number | undefined {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return undefined;
  return Math.max(CHART_MIN_POINT_DOT_SIZE, Math.min(CHART_MAX_POINT_DOT_SIZE, raw));
}

/** Which readings a `chartDots` layer marks: `all` of them, or `auto`, every one
 * only while they sit far enough apart to tell the dots apart. */
export type ChartDotsMode = "all" | "auto";

/** A decoded `chartDots` `dots`: any spelling but `all` reads as auto. */
export function chartDotsMode(raw: unknown): ChartDotsMode {
  return raw === "all" ? "all" : "auto";
}

/** The stroke a grid line is drawn with, in design points, when a `chartGrid`
 * layer stores no thickness. The same 1 pt the chart's own grid used. */
export const CHART_GRID_LINE_WIDTH = 1;
/** How many lines a new `chartGrid` layer draws, and what an absent `lines` reads as. */
export const CHART_DEFAULT_GRID_LINES = 3;
export const CHART_MIN_GRID_THICKNESS = 0.25;
export const CHART_MAX_GRID_THICKNESS = 4;

/** A decoded `chartGrid` `lines`: a finite number rounded and clamped into 1…4,
 * anything else the default 3. */
export function chartGridLayerLines(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return CHART_DEFAULT_GRID_LINES;
  return Math.max(1, Math.min(CHART_MAX_GRID_LINES, Math.round(raw)));
}

/** A decoded `chartGrid` `thickness`: a finite number clamped into 0.25…4,
 * anything else the default 1 pt. */
export function chartGridThickness(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return CHART_GRID_LINE_WIDTH;
  return Math.max(CHART_MIN_GRID_THICKNESS, Math.min(CHART_MAX_GRID_THICKNESS, raw));
}

/** Which corners of a bar are rounded: `all` four, or only the `top`, meaning
 * the end away from the baseline (the bottom end of a bar hanging below zero). */
export type ChartBarCorners = "all" | "top";
export const CHART_BAR_CORNERS: readonly ChartBarCorners[] = ["all", "top"];
/** A bar's corner radius when the layer stores none, in design-box points. */
export const CHART_DEFAULT_BAR_RADIUS = 1.2;

/** A decoded `barRadius`: a finite number, negative read as 0, anything else
 * the default. */
export function chartBarRadius(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return CHART_DEFAULT_BAR_RADIUS;
  return Math.max(0, raw);
}

/** A decoded `barCorners`, with any spelling this build does not know read as all. */
export function chartBarCorners(raw: unknown): ChartBarCorners {
  return typeof raw === "string" && (CHART_BAR_CORNERS as readonly string[]).includes(raw) ? raw as ChartBarCorners : "all";
}

/** A decoded `smoothing`, undefined for off. A strength this build does not
 * know reads as off. The key held a moving-average window before it shipped,
 * so a stored number still maps: 3 or 5 light, 7 medium, 9 strong. */
export function chartSmoothing(raw: unknown): ChartSmoothing | undefined {
  if (typeof raw === "string") return (CHART_SMOOTHINGS as readonly string[]).includes(raw) ? raw as ChartSmoothing : undefined;
  if (raw === 3 || raw === 5) return "light";
  if (raw === 7) return "medium";
  if (raw === 9) return "strong";
  return undefined;
}

/** How many readings a smoothing strength averages over a series of `count`:
 * its share of the readings, at least 3 and always odd. 0 when off or when there
 * are fewer than two readings. Mirrors the watch. */
export function chartSmoothingWindowSize(count: number, smoothing: ChartSmoothing | undefined): number {
  if (smoothing === undefined || count < 2) return 0;
  const w = Math.max(3, Math.floor(count * CHART_SMOOTHING_SHARES[smoothing] + 0.5));
  return w % 2 === 0 ? w + 1 : w;
}
/** Where a chart's past comes from.
 *
 * The recorder keeps two different things. State history is every reported
 * reading and it is purged (ten days by default), which is why a history chart
 * stops at a week. Long-term statistics are the rows the recorder
 * pre-aggregates per period and never purges, so a year of hourly energy is one
 * cheap query. Both arrive as the same comma-joined series, so nothing after
 * the fetch knows which one produced it.
 *
 * Mirrors `ChartElement.ChartSource` in the app repo. */
export type ChartSource = "history" | "statistics";
/** How long one statistics row covers. The recorder's own set, which is what
 * makes the query cheap: it reads rows it already wrote. "5minute" rows are
 * compacted into hourly ones after about ten days, so a long span asked for in
 * five-minute steps quietly returns only its recent tail. */
export type StatPeriod = "5minute" | "hour" | "day" | "week" | "month";
/** Which column of a statistics row is drawn. "change" is the amount used
 * during the period, which is the energy question; "sum" is the running total
 * the meter reads. */
export type StatType = "mean" | "min" | "max" | "change" | "sum";

export const CHART_SOURCES: [ChartSource, string][] = [
  ["history", "Recorded history"],
  ["statistics", "Long-term statistics"],
];

export const STAT_PERIODS: [StatPeriod, string][] = [
  ["5minute", "5 min"],
  ["hour", "Hour"],
  ["day", "Day"],
  ["week", "Week"],
  ["month", "Month"],
];

export const STAT_TYPES: [StatType, string][] = [
  ["mean", "Mean"],
  ["min", "Min"],
  ["max", "Max"],
  ["change", "Change"],
  ["sum", "Total"],
];

export const CHART_DEFAULT_SOURCE: ChartSource = "history";
export const CHART_DEFAULT_STAT_PERIOD: StatPeriod = "hour";
export const CHART_DEFAULT_STAT_TYPE: StatType = "mean";
/** Which number of a chart layer a `chartStat` value reads. The stats read the
 * series the chart draws, after `limit` has trimmed it; `top` and `bottom` are
 * the ends of the plot's range, which on a Fixed chart differ from the readings.
 * Mirrors `ChartStatSpec.Stat` in the app repo. */
export type ChartStat =
  | "latest" | "highest" | "lowest" | "average" | "top" | "bottom"
  | "first" | "delta" | "sum" | "trend";

export const CHART_STATS: readonly [ChartStat, string][] = [
  ["latest", "Newest reading"],
  ["first", "First reading"],
  ["highest", "Highest reading"],
  ["lowest", "Lowest reading"],
  ["average", "Average reading"],
  ["delta", "Change"],
  ["sum", "Total"],
  ["trend", "Trend arrow"],
  ["top", "Top of the scale"],
  ["bottom", "Bottom of the scale"],
];
export type ShapeKind = "rectangle" | "roundedRectangle" | "capsule" | "circle" | "line";
export type CornerBodyShape = "circle" | "wedge";
export type AggregateFunction = "count" | "sum" | "average" | "min" | "max";

export interface EntityRef {
  entityId: string;
  displayName: string;
  domain: string;
  iconName?: string;
}

export interface ValueFormat {
  decimals?: number;
  multiply?: number;
  offset?: number;
  prefix?: string;
  suffix?: string;
  useEntityUnit?: boolean;
  relativeTime?: boolean;
  /** Read the value as a length of time and print its two largest non-zero units
   * ("1h 23m"). Exclusive with `relativeTime`, and applied first if a document
   * somehow carries both. */
  duration?: boolean;
  textCase?: TextCase;
}

export type AggregateScope =
  | { kind: "entities"; entities: EntityRef[] }
  | { kind: "filter"; domains: string[]; areaIds: string[]; labelIds: string[]; floorIds: string[] };

export type AggregateStateFilter =
  | { kind: "isOn" }
  | { kind: "isOff" }
  | { kind: "equals"; value: string }
  | { kind: "notEquals"; value: string };

export interface AggregateSpec {
  function: AggregateFunction;
  scope: AggregateScope;
  stateFilter?: AggregateStateFilter;
  attribute?: string;
}

export type ValueKind =
  | { kind: "literal"; value: string }
  | ({ kind: "entityState" } & EntityRef)
  | ({ kind: "entityAttribute"; attribute: string } & EntityRef)
  | ({ kind: "entityAge" } & EntityRef)
  | { kind: "aggregate"; aggregate: AggregateSpec }
  | { kind: "time"; timeField: TimeField }
  | { kind: "dataAge" }
  | { kind: "jinja"; value: string }
  | { kind: "named"; id: string }
  /** One number read off a chart layer in the same document, by the chart's
   * id. Local: the resolver settles the chart first and reads the number back.
   * This is how a chart's numbers are ordinary text layers rather than a
   * feature of the chart, so they sit anywhere and take every text style. */
  | { kind: "chartStat"; layer: string; stat: ChartStat };

export interface Value {
  kind: ValueKind;
  format?: ValueFormat;
}

export interface NamedValue {
  id: string;
  name: string;
  value: Value;
}

export interface NormalizedFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDegrees: number;
}

export const CENTERED_FRAME: NormalizedFrame = { x: 0.25, y: 0.25, width: 0.5, height: 0.5, rotationDegrees: 0 };

/** Which reading on a chart an anchored layer follows. Mirrors
 * `CustomComplication.ChartAnchor.Point` in the app repo. */
export type ChartAnchorPoint = "highest" | "lowest" | "now" | "first" | "latest" | "threshold" | "zero";

export const CHART_ANCHOR_POINTS: readonly [ChartAnchorPoint, string][] = [
  ["highest", "Highest reading"],
  ["lowest", "Lowest reading"],
  ["now", "Now"],
  ["first", "First reading"],
  ["latest", "Newest reading"],
  ["threshold", "Threshold"],
  ["zero", "Zero"],
];

/** True when the point names a column of readings, which is every point but the
 * two heights: the threshold and zero. A column anchor owns the layer's x; a
 * height owns its y. Mirrors `ChartAnchor.Point.isColumn` in the app repo. */
export function chartAnchorIsColumn(at: ChartAnchorPoint): boolean {
  return at !== "threshold" && at !== "zero";
}

/** Where an anchored layer sits against the reading it follows. Mirrors
 * `CustomComplication.ChartAnchor.Place` in the app repo. `through` runs the layer
 * right across the plot on the axis the anchor does not settle, which is what a
 * "now" line and a threshold line are made of. */
export type ChartAnchorPlace = "above" | "on" | "below" | "bottom" | "through";

export const CHART_ANCHOR_PLACES: readonly [ChartAnchorPlace, string][] = [
  ["above", "Above"],
  ["on", "On"],
  ["below", "Inside"],
  ["bottom", "At the bottom"],
  ["through", "Through"],
];

/**
 * Pins a layer to a reading on a chart in the same document, so it follows that
 * reading instead of sitting where it was dropped.
 *
 * This is what a chart's high and low markers are made of. A marker used to be a
 * setting on the chart, which meant one shape from a list of three, at one size, in
 * one colour. As a layer it is an ordinary text, icon, shape or image: any glyph or
 * emoji, any size, any colour, its own rules, dragged and deleted like everything
 * else. The chart only has to say where the reading is.
 *
 * The layer's `frame` still gives its size. Its `x` and `y` are worked out at render
 * time, and `dx`/`dy` nudge it from there in design-box points, which is what a drag
 * writes while a layer is anchored.
 */
export interface ChartAnchor {
  /** The chart layer this follows, by element id. */
  layer: string;
  at: ChartAnchorPoint;
  place: ChartAnchorPlace;
  /** Nudge in design-box points, `+y` down. Absent means zero. */
  dx?: number;
  dy?: number;
}

function isChartAnchorPoint(v: unknown): v is ChartAnchorPoint {
  return CHART_ANCHOR_POINTS.some(([k]) => k === v);
}

function isChartAnchorPlace(v: unknown): v is ChartAnchorPlace {
  return CHART_ANCHOR_PLACES.some(([k]) => k === v);
}

/** An anchor written by a newer panel falls back rather than throwing, matching the
 * Swift decoder: a marker in the wrong spot beats a complication that will not open. */
function parseChartAnchor(o: unknown): ChartAnchor | undefined {
  if (!isObject(o) || typeof o.layer !== "string" || o.layer === "") return undefined;
  const anchor: ChartAnchor = {
    layer: o.layer.toUpperCase(),
    at: isChartAnchorPoint(o.at) ? o.at : "highest",
    place: isChartAnchorPlace(o.place) ? o.place : "above",
  };
  const dx = num(o.dx, 0);
  const dy = num(o.dy, 0);
  if (dx !== 0) anchor.dx = dx;
  if (dy !== 0) anchor.dy = dy;
  return anchor;
}

/** Read an anchor onto a layer that can carry one. Called from the four kinds the
 * app repo decodes it on, and nowhere else, so a hand-written anchor on a gauge is
 * dropped here rather than round-tripping into a document the watch disagrees with. */
function readChartAnchor(p: J, payload: { chartAnchor?: ChartAnchor }): void {
  const anchor = parseChartAnchor(p.chartAnchor);
  if (anchor !== undefined) payload.chartAnchor = anchor;
}

/** The matching write. A layer that follows nothing writes no key, so every document
 * that predates markers-as-layers keeps the bytes it always had. */
function writeChartAnchor(payload: { chartAnchor?: ChartAnchor }, o: J): void {
  if (payload.chartAnchor !== undefined) o.chartAnchor = encodeChartAnchor(payload.chartAnchor);
}

/** The nudges are omitted at zero, matching the app's encoder byte for byte. */
function encodeChartAnchor(a: ChartAnchor): J {
  const o: J = { layer: a.layer, at: a.at, place: a.place };
  if (a.dx !== undefined && a.dx !== 0) o.dx = encNum(a.dx);
  if (a.dy !== undefined && a.dy !== 0) o.dy = encNum(a.dy);
  return o;
}

export interface ColorSlot {
  baseColorHex: string;
}

export type ComparisonKind =
  | "equals" | "notEquals" | "isOn" | "isOff" | "isUnavailable" | "isStale" | "isEmpty"
  | "greaterThan" | "greaterOrEqual" | "lessThan" | "lessOrEqual" | "between" | "timeBetween"
  | "contains" | "startsWith" | "endsWith" | "matchesRegex" | "isOneOf";

export interface Comparison {
  kind: ComparisonKind;
  value?: Value;
  upper?: Value;
  pattern?: string;
  options?: string[];
}

export type StyleProperty =
  | "color" | "opacity" | "text" | "icon" | "fontSize" | "fontWeight" | "rotation"
  | "visibility" | "gaugeValue" | "gaugeMin" | "gaugeMax" | "borderColor" | "borderWidth"
  | "backgroundColor";

export type StyleChangeKind =
  | "setColor" | "setOpacity" | "setText" | "setIcon" | "setFontSize" | "setFontWeight"
  | "setRotation" | "hide" | "show" | "setGaugeValue" | "setGaugeMin" | "setGaugeMax"
  | "setBorderColor" | "setBorderWidth" | "setBackgroundColor";

export interface StyleChange {
  kind: StyleChangeKind;
  value?: Value;
  number?: number;
  weight?: FontWeight;
}

export const STYLE_PROPERTY: Record<StyleChangeKind, StyleProperty> = {
  setColor: "color",
  setOpacity: "opacity",
  setText: "text",
  setIcon: "icon",
  setFontSize: "fontSize",
  setFontWeight: "fontWeight",
  setRotation: "rotation",
  hide: "visibility",
  show: "visibility",
  setGaugeValue: "gaugeValue",
  setGaugeMin: "gaugeMin",
  setGaugeMax: "gaugeMax",
  setBorderColor: "borderColor",
  setBorderWidth: "borderWidth",
  setBackgroundColor: "backgroundColor",
};

export interface Test {
  id: string;
  value: Value;
  comparison: Comparison;
}

export interface Condition {
  join: "all" | "any";
  tests: Test[];
}

export interface RuleCase {
  id: string;
  when: Condition;
  then: StyleChange[];
}

export interface Rule {
  id: string;
  cases: RuleCase[];
  otherwise?: StyleChange[];
  /** The part of a rich text layer this rule changes, by the part's id. Absent
   * means the whole layer. On a text layer a rule aimed at a part the layer
   * does not have does nothing; any other layer, and a shape's own rules, read
   * the rule as if this were absent. A watch app that predates parts applies it
   * to the whole layer, which is the closest it can come. */
  partId?: string;
}

interface ElementBase {
  id: string;
  colorSlot: ColorSlot;
  rules: Rule[];
  frame: NormalizedFrame;
  isHidden: boolean;
  /** The layer group this belongs to (see `LayerGroup`). Editor-only: the
   * watch draws the layer exactly as it would without it. */
  groupId?: string;
  /** Pins this layer to a reading on a chart, so it follows that reading. Only
   * text, icon, shape and image layers carry one: a gauge, a chart, a timeline
   * or a tap area pinned to a reading is not something anyone wants, and the
   * app repo gives those four kinds alone a field to decode. See `ChartAnchor`. */
  chartAnchor?: ChartAnchor;
}

/**
 * A folder in the Layers list. Its members sit together in `elements` (the
 * group is one block in the draw order) and carry its id. Locked, the group
 * moves as one on the preview; unlocked, each member moves alone. The watch
 * never reads this: it is how the editor keeps a finished part together.
 */
export interface LayerGroup {
  id: string;
  name: string;
  locked: boolean;
}

export interface TextElement extends ElementBase {
  value: Value;
  fontSize: number;
  fontWeight: FontWeight;
  /** Live countdown mode: the watch ticks toward the value's target instant (an
   * active HA timer's finishes_at, or any future ISO/unix timestamp). */
  countdown?: boolean;
  /** Fixed-width digits, so a number that ticks does not shuffle the characters
   * beside it. Absent means off. */
  monospacedDigits?: boolean;
  /** How many lines the text may wrap onto, 1 or 2. Absent means 1. */
  lineLimit?: number;
  /** Which edge of the layer box the text sits against. Absent means center. */
  alignment?: TextAlignment;
  /** Whether the numbers inside the text take the colour of the band they fall
   * in. Absent means one colour. Same table, same defaults and same lookup as a
   * chart's, so a price line under a banded chart can match it number for number. */
  coloring?: ChartColoring;
  /** The colour table, checked lowest first. Absent means empty. */
  bands?: ChartBand[];
  /** Colour of a number past the last band. Absent means the chart's default. */
  bandAboveColorHex?: string;
  /** Which end of the numbers in the text takes its own colour. Absent means none. */
  highlight?: ChartHighlight;
  /** Absent means the chart's default highest colour. */
  highColorHex?: string;
  /** Absent means the chart's default lowest colour. */
  lowColorHex?: string;
  /** Rich text: the text drawn as a row of parts, each in its own look. Absent
   * or empty means one run of `value`, as a text layer always was. With parts,
   * `value` is written as `richTextFallback(parts)`, which is what a watch app
   * that predates parts shows instead. A countdown ignores parts, and so does a
   * layer rule that sets the text. */
  parts?: TextPart[];
}

/**
 * One part of a rich text layer: a value of its own, and optionally a colour,
 * weight, size and band table of its own.
 *
 * Every style key is absent until the author gives the part its own, and absent
 * means the layer's resolved look, so a part only says how it differs and a
 * change to the layer reaches every part that never asked for anything else.
 * The band table has the layer's shape and the chart's defaults, but belongs to
 * this part alone: two numbers in one line can read two different tables.
 * Mirrors `TextElement.Part` in the app repo.
 */
export interface TextPart {
  /** What rules aim at with `Rule.partId`. Uppercase, like every id here. */
  id: string;
  value: Value;
  /** Absent means the layer's resolved colour. */
  colorHex?: string;
  /** Absent means the layer's resolved weight. */
  fontWeight?: FontWeight;
  /** Absent means the layer's resolved size. */
  fontSize?: number;
  /** Absent means one colour. */
  coloring?: ChartColoring;
  /** Absent means empty. */
  bands?: ChartBand[];
  /** Absent means the chart's default colour past the last band. */
  bandAboveColorHex?: string;
}

/** True when a text layer colours its numbers one by one: a non-empty band
 * table or a highlight, and not a countdown, whose text ticks on the watch and
 * has no numbers to colour until it is drawn. */
export function textColorsByValue(el: TextElement): boolean {
  if (el.countdown === true) return false;
  const banded = el.coloring === "bands" && (el.bands?.length ?? 0) > 0;
  return banded || (el.highlight !== undefined && el.highlight !== "none");
}

/** True when a text layer's `value` is the fallback for its parts rather than
 * something the author picked: it has parts and is not a countdown, whose value
 * is the instant the watch ticks toward. */
export function textUsesParts(el: Pick<TextElement, "parts" | "countdown">): boolean {
  return el.countdown !== true && (el.parts?.length ?? 0) > 0;
}

/** What typed words contribute when parts are joined: the literal with its own
 * prefix and suffix. A number format on typed words is not carried, since a
 * word rarely has one and the join is not the place to evaluate it. */
export function literalPartText(value: Value): string | undefined {
  if (value.kind.kind !== "literal") return undefined;
  return (value.format?.prefix ?? "") + value.kind.value + (value.format?.suffix ?? "");
}

/**
 * The single value a watch app that predates parts shows for a rich text layer.
 *
 * No template on purpose: it reuses the first live part's own value, so it adds
 * nothing to the compiled document. Typed words before that part become its
 * prefix, and typed words after it, up to the next live part, its suffix. Every
 * later live part is left out, because one value can only show one reading.
 * With no live part at all it is the typed words joined.
 */
export function richTextFallback(parts: readonly TextPart[]): Value {
  const isLive = (p: TextPart) => p.value.kind.kind !== "literal";
  const words = (from: number, to: number) =>
    parts.slice(from, to).map((p) => literalPartText(p.value) ?? "").join("");
  const first = parts.findIndex(isLive);
  if (first < 0) return literal(words(0, parts.length));
  const next = parts.findIndex((p, i) => i > first && isLive(p));
  const live = parts[first]!.value;
  const format: ValueFormat = { ...live.format };
  const prefix = words(0, first) + (format.prefix ?? "");
  const suffix = (format.suffix ?? "") + words(first + 1, next < 0 ? parts.length : next);
  delete format.prefix;
  delete format.suffix;
  if (prefix !== "") format.prefix = prefix;
  if (suffix !== "") format.suffix = suffix;
  // A copy of the kind, never the part's own object: the document walkers
  // rewrite a template in place, and a shared object would be rewritten twice.
  const out: Value = { kind: structuredClone(live.kind) };
  if (!formatIsEmpty(format)) out.format = format;
  return out;
}

/** Bring a rich text layer's `value` back in line with its parts, so the draft
 * in memory says what the encoder will write. Call after every parts edit. A
 * layer without parts, or a countdown, keeps the value it has. */
export function syncRichTextFallback(el: TextElement): void {
  if (textUsesParts(el)) el.value = richTextFallback(el.parts!);
}

/** Horizontal placement inside a text layer's box. */
export type TextAlignment = "leading" | "center" | "trailing";

export interface IconElement extends ElementBase {
  symbol: Value;
  /** The SVG `d` string of a Material Design icon, against MDI's invariant
   * 24x24 viewBox. Set only when `symbol` is the literal name of an MDI icon
   * (`mdi:flash`), and carried in the document so the watch draws MDI without
   * shipping a catalogue. Absent means the layer draws an SF Symbol. */
  path?: string;
  size: number;
}

export interface GaugeElement extends ElementBase {
  value: Value;
  minValue: number;
  maxValue: number;
  style: GaugeStyle;
  lineWidth: number;
  trackColorHex: string;
  /** Whether the gauge draws in one colour or takes the colour of the band its
   * reading falls in. Shares the chart's table type, because a gauge asks the
   * same question of one reading that a chart asks of each of a hundred. */
  coloring: ChartColoring;
  /** The colour table, lowest step first. Empty means there is nothing to say
   * and the gauge stays one colour. */
  bands: ChartBand[];
  /** Colour of a reading past the last band. */
  bandAboveColorHex: string;
  /** A value to mark on the scale, or absent for no mark. */
  thresholdValue?: number;
  thresholdColorHex: string;
  /** How many dots a `dots` gauge draws, when the count is not the range itself.
   * Absent means the range, max minus min as resolved. Ignored by every other
   * style. */
  total?: Value;
  /** Where the low end of the scale comes from when it follows an entity
   * instead of the typed-in `minValue`. A rule's `setGaugeMin` still wins, and
   * a source that resolves to no number falls back to `minValue`. Absent means
   * the typed-in number, and is left off the wire. */
  minSource?: Value;
  /** The high end of the scale, read the same way as `minSource`, with
   * `setGaugeMax` and `maxValue` on either side of it. */
  maxSource?: Value;
}

export const GAUGE_DEFAULT_THRESHOLD_HEX = "#FFFFFF";

export function isChartEndMarker(raw: unknown): raw is ChartEndMarker {
  return typeof raw === "string" && (CHART_END_MARKERS as readonly string[]).includes(raw);
}

/** The marker each end of a chart draws. */
export interface ChartEndMarkers {
  high: ChartEndMarker;
  low: ChartEndMarker;
}

/** What the one shared `marker` draws at each end. The old "pointer" was a
 * triangle over the highest and a dot under the lowest. */
export function chartMarkersFromLegacy(marker: ChartMarker): ChartEndMarkers {
  if (marker === "none") return { high: "none", low: "none" };
  if (marker === "pointer") return { high: "triangle", low: "dot" };
  return { high: "dot", low: "dot" };
}

/** Each end's marker: its own key when it has one, else what `marker` implies. */
export function chartEndMarkers(c: Pick<ChartElement, "marker" | "highMarker" | "lowMarker">): ChartEndMarkers {
  const derived = chartMarkersFromLegacy(c.marker);
  return { high: c.highMarker ?? derived.high, low: c.lowMarker ?? derived.low };
}

/** The single `marker` nearest a pair, for a watch that reads nothing else: a
 * triangle over the highest keeps the pointer, any other mark keeps a dot. */
export function chartLegacyMarker(m: ChartEndMarkers): ChartMarker {
  if (m.high === "triangle") return "pointer";
  if (m.high !== "none" || m.low !== "none") return "dot";
  return "none";
}

/** Whether `marker` alone says this pair, so the two per-end keys stay off. */
export function chartMarkersAreLegacy(m: ChartEndMarkers): boolean {
  return (m.high === "none" && m.low === "none")
    || (m.high === "dot" && m.low === "dot")
    || (m.high === "triangle" && m.low === "dot");
}

/** Store a pair the way it is written: `marker` always, the two keys only when
 * `marker` cannot say the pair by itself. */
export function setChartEndMarkers(c: ChartElement, m: ChartEndMarkers): void {
  c.marker = chartLegacyMarker(m);
  if (chartMarkersAreLegacy(m)) {
    delete c.highMarker;
    delete c.lowMarker;
  } else {
    c.highMarker = m.high;
    c.lowMarker = m.low;
  }
}
/** More dots than this stop being countable at complication size. Mirrors
 * `GaugeElement.maximumDots` in Swift. */
export const GAUGE_MAX_DOTS = 24;

/** A miniature chart of several readings.
 *
 * Takes the same single `Value` every other layer takes; every number in what it
 * resolves to becomes one point (`chartNumbers`). So a text sensor holding
 * "13,14,16", a list attribute serialised as "[13, 14, 16]", and a Jinja template
 * that joins a forecast all work with no second data path.
 *
 * Mirrors `CustomComplication.ChartElement` in the app repo. */
export interface ChartElement extends ElementBase {
  value: Value;
  /** Which of the recorder's two stores the past comes from. Only read when
   * `historyMinutes` is non-zero: a chart drawing its own value asks the
   * recorder nothing at all. */
  source: ChartSource;
  /** How long one statistics row covers. Ignored unless `source` is
   * "statistics". */
  statPeriod: StatPeriod;
  /** Which of a statistics row's columns is drawn. Ignored unless `source` is
   * "statistics". */
  statType: StatType;
  /** How far back to read the entity's recorded history, in minutes. 0 draws
   * `value` as it stands, which is what a forecast sensor wants.
   *
   * The knob exists because a plain sensor holds one number, so a chart pointed
   * at one draws one bar. Nothing in the value can say "and the last six hours",
   * and no template can say it either: HA's template engine cannot reach the
   * recorder. The series is a separate request, and this is what asks for it. */
  historyMinutes: number;
  /** How many readings to average the history down to. */
  historyPoints: number;
  style: ChartStyle;
  /** How many readings to draw. 0 means all of them. */
  limit: number;
  /** Which end `limit` counts from: false = the first N, true = the last N. */
  takeFromEnd: boolean;
  scale: ChartScale;
  /** Only read when `scale` is "fixed". */
  minValue: number;
  maxValue: number;
  baseline: ChartBaseline;
  /** Space between bars, in design-box points. Ignored by line and area. */
  barGap: number;
  /** Stroke thickness for line and area. This is the element's `size`, so a
   * Placement can thin it down per shape. */
  lineWidth: number;
  highlight: ChartHighlight;
  highColorHex: string;
  lowColorHex: string;
  /** The one marker setting both ends shared before each end had its own, and
   * the one an older watch still reads. Written as the nearest single setting
   * to the pair (`chartLegacyMarker`). */
  marker: ChartMarker;
  /** The mark over the highest reading, set only when the pair is one `marker`
   * cannot say on its own. Absent means `chartEndMarkers` derives it. */
  highMarker?: ChartEndMarker;
  /** The mark over the lowest reading, on the same rule as `highMarker`. */
  lowMarker?: ChartEndMarker;
  /** Whether every reading shares one colour or takes the colour of the band it
   * falls in. */
  coloring: ChartColoring;
  /** The colour table, lowest step first. A reading takes the colour of the
   * first band it is at or below, so each row only has to say where it ends.
   * Empty means there is nothing to say and the chart stays one colour. */
  bands: ChartBand[];
  /** Colour of a reading past the last band. Every table needs an "and the
   * rest", and on a chart that is usually the interesting end. */
  bandAboveColorHex: string;
  /** Whether an area chart's fill follows the bands too. */
  fillBands: boolean;
  /** How a line or area joins its readings. Absent reads as `straight`, which
   * is how it is written: omitted at the default. Ignored by bars. */
  curve?: ChartCurve;
  /** How an area fills under its line. Absent reads as `flat`. Area only. */
  fillStyle?: ChartFillStyle;
  /** The fill's own colour. Absent fills in the series colour, or each band's
   * colour when `fillBands` is on. Area only. */
  fillColorHex?: string;
  /** A bar's corner radius in design-box points. Absent reads as
   * `CHART_DEFAULT_BAR_RADIUS`, which is also never written. Bars only. */
  barRadius?: number;
  /** Which corners of a bar are rounded. Absent reads as `all`. Bars only. */
  barCorners?: ChartBarCorners;
  /** Legacy, read only. The six keys below were chart settings for one day
   * (2026-09-12) and never shipped. They are read so a document saved that day
   * opens without unknown keys, `liftChartOwnMarks` turns them into a
   * `chartDots` layer, a `chartGrid` layer and a zero line, and nothing writes
   * or draws them. Dots on the readings: absent reads as `none`. */
  pointDots?: ChartPointDots;
  /** Legacy, read only: the reading dot's diameter, 1…12. */
  pointDotSize?: number;
  /** Legacy, read only: every reading dot's colour. */
  pointDotColorHex?: string;
  /** Legacy, read only: grid lines, 0…4. */
  gridLines?: number;
  /** Legacy, read only: the grid and zero line colour. */
  gridColorHex?: string;
  /** Legacy, read only: a line where zero falls. */
  zeroLine?: boolean;
  /** How strongly the drawn readings are smoothed: a centred, Gaussian-weighted
   * average whose window scales with the number of readings (see
   * `chartSmoothingWindowSize`). Applied after `limit`, and everything downstream
   * (the range, highlights, bands, anchors and `chartStat` numbers) reads the
   * smoothed series. Absent is off. */
  smoothing?: ChartSmoothing;
  /** Ask the server to leave a slot empty where the entity was unavailable,
   * so the line breaks there instead of carrying the last value across.
   * History and statistics sources only. Absent reads as false. */
  gaps?: boolean;
  /** A dashed horizontal line across the plot at this value. Absent draws
   * nothing. On an auto scale the domain grows to include it, so the line is
   * always on the plot; on a fixed scale a threshold outside `minValue`…
   * `maxValue` draws nothing, because that range was asked for on purpose. */
  thresholdValue?: number;
  thresholdColorHex: string;
  /** Which reading "now" sits at, resolved to a number like any other value.
   * That reading gets a vertical line. The obvious source is the built-in Hour
   * on a 24-reading price or forecast chart; a Jinja value works for anything
   * else. Rounded, then clamped into the series. */
  nowIndex?: Value;
  nowColorHex: string;
  /** Whether the chart draws its own threshold line. False once the line is a
   * layer anchored to `threshold` `through`: `thresholdValue` stays, because it
   * still stretches the scale and tells the layer where to sit. Omitted at true. */
  drawsThreshold?: boolean;
  /** The same for the "now" line, once it is a layer anchored to `now` `through`.
   * `nowIndex` stays, because the layer reads it. Omitted at true. */
  drawsNowLine?: boolean;
  /** The same for the clock times, once they are a `chartTimes` layer. False
   * draws no times and gives up no room for them; the label keys below stay,
   * because they are what the layer was copied from. Omitted at true. */
  drawsTimeLabels?: boolean;
  /** Another chart layer whose range this one is drawn against, instead of its
   * own `scale`. Absent is the ordinary case and every chart before this.
   *
   * This is how two series share one plot: a second chart layer with the same
   * frame, its own value, colour, style and bands, borrowing the first one's
   * scale. A link to a chart that is not in the document, to this chart itself,
   * or one that closes a cycle falls back to this chart's own scale. */
  scaleFrom?: string;
  /** How many clock times to draw beside the plot, 0…12. 0 draws none. The same
   * row a timeline draws, on the same keys and with the same defaults, because
   * it answers the same question: a plot with no times cannot say whether its
   * left edge is an hour ago or a day ago. Only a chart with a known span and
   * evenly spaced slots can carry them; see `chartShowsTimeLabels`. */
  timeLabelCount: number;
  /** Font size of the times, in design-box points. Clamped 1…20 when drawn. */
  labelSize: number;
  /** Colour of the times. */
  labelColorHex: string;
  /** false puts the row under the plot, true over it. */
  labelsAbove: boolean;
  /** Whose clock the times are read on. */
  hourCycle: TimelineHourCycle;
  /** Whether the times carry their minutes. */
  minutes: TimelineMinuteStyle;
  /* The chart draws marks and nothing else. Its numbers (the newest reading,
   * the ends of its range) are text layers with a `chartStat` value, kept in
   * the chart's layer group; see `addChartLabel`. The plot fills the whole
   * frame, and the author makes room for a number by resizing the chart. */
}

/** One step of a chart's colour table.
 *
 * A band says where it *ends*, not where it starts, so a table reads the way
 * people describe one: "up to 10 red, up to 20 orange, and the rest green".
 * Nothing names a lower bound twice, and there is no gap to leave open between
 * two rows by accident. Mirrors `ChartElement.ChartBand` in the app repo. */
export interface ChartBand {
  id: string;
  /** Readings at or below this take `colorHex`. */
  upTo: number;
  colorHex: string;
}

export const CHART_DEFAULT_HIGH_HEX = "#FF6B35";
export const CHART_DEFAULT_LOW_HEX = "#32D74B";
export const CHART_DEFAULT_BAND_LOW_HEX = "#32D74B";
export const CHART_DEFAULT_BAND_HIGH_HEX = "#FF453A";
/** Red, the colour a line worth crossing is drawn in everywhere else here. */
export const CHART_DEFAULT_THRESHOLD_HEX = "#FF453A";
/** White at 60% opacity: present enough to place "now" on the plot, faint
 * enough that the readings stay the thing being read. */
export const CHART_DEFAULT_NOW_HEX = "#FFFFFF99";

/** The colour table in reading order, whatever order the author typed it in.
 * Mirrors `sortedBands` in Swift. */
export function chartSortedBands(el: { bands: readonly ChartBand[] }): ChartBand[] {
  return [...el.bands].sort((a, b) => a.upTo - b.upTo);
}

/** True when the chart has an actual table to paint from. An empty table says
 * nothing, so it draws as one colour rather than as one flat "and the rest".
 * Mirrors `usesBands` in Swift. */
export function chartUsesBands(el: ChartElement): boolean {
  return el.coloring === "bands" && el.bands.length > 0;
}

/** Which band a reading falls in, as a colour. Sort once, then call this per
 * reading; the table is walked lowest first and the first match wins. Mirrors
 * `bandColorHex` in Swift. */
export function chartBandColor(value: number, sorted: readonly ChartBand[], above: string): string {
  for (const band of sorted) if (value <= band.upTo) return band.colorHex;
  return above;
}

/** How one of a chart's numbers reads before any format is applied.
 *
 * Decimal places come from the span of the plot, not from the number, so every
 * number read off one chart carries the same shape: a half-degree spread
 * printing "21" twice would look broken, and a 3000 mV reading with two
 * decimals would not fit. A `decimals` format on the text layer overrides it.
 * Mirrors `ChartElement.statText` in Swift. */
export function chartStatText(value: number, span: number): string {
  const magnitude = Math.abs(span);
  const places = magnitude >= 10 ? 0 : magnitude >= 1 ? 1 : 2;
  return value.toFixed(places);
}

/** The arrow a `trend` stat prints, from the sign the readings settled on. A
 * glyph rather than a number, so it never goes through the number formatting:
 * rounding or a unit on an arrow means nothing. Mirrors
 * `ChartElement.trendGlyph` in Swift. */
export function chartTrendGlyph(sign: number): string {
  if (sign > 0) return "↑";
  if (sign < 0) return "↓";
  return "→";
}


/** History spans the picker offers, in minutes. A span typed as days, hours
 * and minutes is also accepted, up to `CHART_HISTORY_MAX_MINUTES`; these are
 * the ones a click reaches. Mirrors `historySpanChoices` in Swift. */
export const CHART_HISTORY_SPANS: readonly { minutes: number; label: string }[] = [
  { minutes: 60, label: "Last hour" },
  { minutes: 180, label: "Last 3 hours" },
  { minutes: 360, label: "Last 6 hours" },
  { minutes: 720, label: "Last 12 hours" },
  { minutes: 1440, label: "Last 24 hours" },
  { minutes: 4320, label: "Last 3 days" },
  { minutes: 10_080, label: "Last 7 days" },
];

/** The span a new history chart starts with. */
export const CHART_HISTORY_DEFAULT_MINUTES = 360;
/** The longest span the server answers: the recorder's default purge keeps
 * ten days, and a week stays clear of it. Mirrors `MAX_MINUTES` in Python. */
export const CHART_HISTORY_MAX_MINUTES = 7 * 24 * 60;

/** The spans a statistics chart offers: the history list plus a month, a
 * quarter and a year, which only the never-purged store can answer. */
export const CHART_STATISTICS_SPANS: readonly { minutes: number; label: string }[] = [
  ...CHART_HISTORY_SPANS,
  { minutes: 43_200, label: "Last 30 days" },
  { minutes: 129_600, label: "Last 90 days" },
  { minutes: 527_040, label: "Last year" },
];

/** The longest statistics span the server answers: 366 days. Statistics are
 * never purged, so the cap is about what a complication can usefully draw.
 * Mirrors `MAX_MINUTES` in `statistics_series.py`. */
export const CHART_STATISTICS_MAX_MINUTES = 366 * 24 * 60;

export const CHART_HISTORY_MIN_POINTS = 2;
export const CHART_HISTORY_MAX_POINTS = 120;
/** `historyPoints` meaning "every recorded reading, no averaging". The server
 * returns the states themselves while they fit in `CHART_HISTORY_MAX_POINTS`,
 * and averages the whole span into that many slots when there are more. */
export const CHART_HISTORY_EVERY_READING = 0;

/** Clamped point count. Mirrors `resolvedHistoryPoints` in Swift, and the
 * server clamps to the same range, so all three agree on the cache key. Zero
 * or less is `CHART_HISTORY_EVERY_READING` and passes through as 0. */
export function chartHistoryPoints(el: ChartElement): number {
  const raw = Math.round(el.historyPoints);
  if (!Number.isFinite(raw)) return 24;
  if (raw < 1) return CHART_HISTORY_EVERY_READING;
  return Math.max(CHART_HISTORY_MIN_POINTS, Math.min(CHART_HISTORY_MAX_POINTS, raw));
}

/** True when a chart's clock times mean anything.
 *
 * Two conditions, both about the x axis. The chart needs a known span, which is
 * what a history query gives it, and its readings have to be evenly spaced
 * across that span, which averaged slots give and "every one" does not: one
 * reading per recorded change puts a quiet hour and a busy one side by side at
 * the same width, so a clock printed under them would be wrong everywhere but
 * the edges. Mirrors `showsTimeLabels` in the app repo. */
export function chartShowsTimeLabels(el: ChartElement): boolean {
  if (chartStatisticsEntity(el) !== undefined) return true;
  return chartHistoryEntity(el) !== undefined && chartHistoryPoints(el) > 0;
}

/** The entity whose history a chart draws, when it draws history at all.
 *
 * Only a directly named entity counts. A `.named` reference or a template is
 * not followed, because the fetch happens in the watch's widget extension long
 * before any resolver exists to dereference it. Mirrors `usesHistory` and
 * `historyEntity` in Swift. */
export function chartHistoryEntity(el: ChartElement): string | undefined {
  if (el.source !== "history") return undefined;
  return chartRecorderEntity(el);
}

/** The entity whose long-term statistics a chart draws, when it draws them.
 *
 * The other side of `source`, on the same rule as `chartHistoryEntity`, so
 * exactly one of the two ever answers. Mirrors `usesStatistics` in Swift. */
export function chartStatisticsEntity(el: ChartElement): string | undefined {
  if (el.source !== "statistics") return undefined;
  return chartRecorderEntity(el);
}

/** The gate both stores share: a span, and an entity named directly. */
function chartRecorderEntity(el: ChartElement): string | undefined {
  if (el.historyMinutes <= 0) return undefined;
  return el.value.kind.kind === "entityState" ? el.value.kind.entityId : undefined;
}

/** The cache key for one chart's recorder query, or undefined when the chart
 * draws its own value instead.
 *
 * Two charts asking the same question share a key and so share one fetch. The
 * span and the point count are in it because widening a chart's window is a
 * different question, not a stale answer to the old one.
 *
 * Readable rather than hashed. The watch hashes the same three parts into an
 * `h_...` string because its cache is a flat dictionary shared with the
 * template values; here it is a plain Map, so there is nothing to avoid
 * colliding with and every reason to keep it debuggable. */
export function chartHistoryKey(el: ChartElement): string | undefined {
  const entityId = chartHistoryEntity(el);
  if (entityId === undefined) return undefined;
  // `|gaps` last, and only when asked, so every key a plain chart has ever
  // used is unchanged. The watch hashes the same readable string.
  return `${entityId}|${Math.round(el.historyMinutes)}|${chartHistoryPoints(el)}${el.gaps === true ? "|gaps" : ""}`;
}

/** The cache key for one chart's long-term statistics query, or undefined when
 * the chart reads history or its own value instead.
 *
 * Every parameter that changes the answer is in it, so a chart switched from
 * mean to change is a new question rather than a stale answer to the old one.
 * Readable here and hashed into an `s_...` string on the watch, exactly as the
 * history key is; the fixtures write this form. */
export function chartStatisticsKey(el: ChartElement): string | undefined {
  const entityId = chartStatisticsEntity(el);
  if (entityId === undefined) return undefined;
  return `${entityId}|${Math.round(el.historyMinutes)}|${el.statPeriod}|${el.statType}${el.gaps === true ? "|gaps" : ""}`;
}

/** What a recorder query asks for: numbers averaged into slots, or the states
 * themselves with the instant each one began. A chart asks the first, a
 * timeline the second. Mirrors `HistorySpec.Mode` in the app repo. */
export type HistoryMode = "numeric" | "states";

/** One string standing for every history query a config asks for.
 *
 * The panel compares this between edits to know when a refetch is owed. It
 * cannot use the compiled Jinja document for that: a history chart contributes
 * no Jinja at all, so a document that did not change says nothing about whether
 * a chart was retargeted or its span widened. */
export function chartHistorySignature(config: CustomComplicationConfig): string {
  const keys = [
    ...chartHistoryRequests(config).map((r) => r.key),
    ...chartStatisticsRequests(config).map((r) => r.key),
  ];
  return keys.sort().join(";");
}

/** One recorder query, as the panel sends it and as the resolver keys its
 * answer. `mode` is `numeric` for every chart and `states` for every timeline. */
export interface HistoryRequest {
  key: string;
  entityId: string;
  minutes: number;
  points: number;
  mode: HistoryMode;
  /** Holes where the entity was unavailable. True only for a chart that asks. */
  gaps: boolean;
}

/** Every distinct history query a config needs, deduped. What the panel sends
 * to the `history_series` websocket command.
 *
 * Charts and timelines both land here: the two ask the same question of the
 * same recorder and differ only in what comes back, so one fetch loop and one
 * cache serve both. The mode is in the key, so a chart and a timeline on one
 * entity and one span stay two separate answers. */
export function chartHistoryRequests(config: CustomComplicationConfig): HistoryRequest[] {
  const seen = new Map<string, HistoryRequest>();
  const add = (r: HistoryRequest) => {
    if (!seen.has(r.key)) seen.set(r.key, r);
  };
  for (const el of config.elements) {
    if (el.kind === "chart") {
      const key = chartHistoryKey(el.payload);
      const entityId = chartHistoryEntity(el.payload);
      if (key === undefined || entityId === undefined) continue;
      add({
        key,
        entityId,
        minutes: Math.round(el.payload.historyMinutes),
        points: chartHistoryPoints(el.payload),
        mode: "numeric",
        gaps: el.payload.gaps === true,
      });
    } else if (el.kind === "timeline") {
      const key = timelineHistoryKey(el.payload);
      const entityId = timelineHistoryEntity(el.payload);
      if (key === undefined || entityId === undefined) continue;
      add({
        key,
        entityId,
        minutes: timelineHistoryMinutes(el.payload),
        points: TIMELINE_HISTORY_POINTS,
        mode: "states",
        gaps: false,
      });
    }
  }
  return [...seen.values()];
}

/** One long-term statistics query, as the panel sends it and as the resolver
 * keys its answer. */
export interface StatisticsRequest {
  key: string;
  entityId: string;
  minutes: number;
  period: StatPeriod;
  type: StatType;
  /** Holes where the entity was unavailable. True only for a chart that asks. */
  gaps: boolean;
}

/** Every distinct statistics query a config needs, deduped. What the panel
 * sends to the `statistics_series` websocket command.
 *
 * Separate from `chartHistoryRequests` because it is a separate command with
 * different parameters, even though both answers land in the same Map: the
 * keys cannot collide, since a period is never a point count. */
export function chartStatisticsRequests(config: CustomComplicationConfig): StatisticsRequest[] {
  const seen = new Map<string, StatisticsRequest>();
  for (const el of config.elements) {
    if (el.kind !== "chart") continue;
    const key = chartStatisticsKey(el.payload);
    const entityId = chartStatisticsEntity(el.payload);
    if (key === undefined || entityId === undefined) continue;
    if (seen.has(key)) continue;
    seen.set(key, {
      key,
      entityId,
      minutes: Math.round(el.payload.historyMinutes),
      period: el.payload.statPeriod,
      type: el.payload.statType,
      gaps: el.payload.gaps === true,
    });
  }
  return [...seen.values()];
}

/** A strip of an entity's recorded states, oldest at the left.
 *
 * The chart's question is "what number was it"; this one's is "which state was
 * it in, and for how long". Every run of one state is a coloured rectangle as
 * wide as the time it lasted, so "was the door open in the last hour" is one
 * glance rather than a reading to interpret.
 *
 * No colorSlot: every colour a timeline draws comes from its table or from
 * `otherColorHex`, so a layer colour would be a control that changes nothing.
 * Mirrors `CustomComplication.TimelineElement` in the app repo. */
export interface TimelineElement extends Omit<ElementBase, "colorSlot"> {
  /** The entity whose past is drawn. Only a directly named entity yields a
   * history request, the same rule the chart follows; anything else draws
   * nothing rather than a made-up strip. */
  value: Value;
  /** How far back to read, in minutes. Same choices as a chart's span. */
  historyMinutes: number;
  /** The colour table, checked in order. A run takes the colour of the first
   * row whose `match` equals its state; anything unmatched takes
   * `otherColorHex`. Empty means every run is that one colour. */
  bands: TimelineBand[];
  /** The colour of a run no row named. */
  otherColorHex: string;
  /** Space between runs, in design-box points. 0 draws the strip as one
   * continuous bar, which is what a door or a light usually wants. */
  gap: number;
  /** Corner radius of each run, in points. */
  cornerRadius: number;
  /** How many clock times to draw along the strip, 0...12. 0 draws none, 1
   * draws now alone, 2 the window's start and now, and 4 the watch history
   * page's own row. `n` times sit at `i / (n - 1)`. */
  timeLabelCount: number;
  /** Font size of the times, in design-box points. Clamped 1...20 when drawn. */
  labelSize: number;
  /** Colour of the times. */
  labelColorHex: string;
  /** false puts the row under the strip, true over it. */
  labelsAbove: boolean;
  /** Whose clock the times are read on: the device's own, or 12 or 24 hours
   * forced on every device. */
  hourCycle: TimelineHourCycle;
  /** Whether the times carry their minutes. `auto` keeps them up to a three
   * hour span and drops them past it. */
  minutes: TimelineMinuteStyle;
}

/** The clock a timeline's times are printed on. Mirrors
 * `TimelineElement.HourCycle` in the app repo. */
export type TimelineHourCycle = "auto" | "h12" | "h24";
/** Whether a timeline's times carry their minutes. Mirrors
 * `TimelineElement.MinuteStyle` in the app repo. */
export type TimelineMinuteStyle = "auto" | "always" | "never";

export const TIMELINE_HOUR_CYCLES: [TimelineHourCycle, string][] = [
  ["auto", "Auto"],
  ["h12", "12 hour"],
  ["h24", "24 hour"],
];
export const TIMELINE_MINUTE_STYLES: [TimelineMinuteStyle, string][] = [
  ["auto", "Auto"],
  ["always", "Always"],
  ["never", "Never"],
];

function parseHourCycle(raw: unknown): TimelineHourCycle {
  // An unknown word is the same answer as no word at all: follow the device
  // rather than refusing the whole document.
  return raw === "h12" || raw === "h24" ? raw : TIMELINE_DEFAULT_HOUR_CYCLE;
}

function parseMinuteStyle(raw: unknown): TimelineMinuteStyle {
  return raw === "always" || raw === "never" ? raw : TIMELINE_DEFAULT_MINUTE_STYLE;
}

/**
 * How many times a timeline prints, from either key.
 *
 * `timeLabelCount` is the answer when it is there. When it is not, the retired
 * `timeLabels` word is read in its place: `none`, `ends` and `four` were the
 * only three this ever offered, and a document saved the evening they existed
 * still means them. Anything else, in either key, is no times at all.
 */
export function parseTimeLabelCount(p: Record<string, unknown>): number {
  if (p.timeLabelCount !== undefined) return clampTimeLabelCount(p.timeLabelCount);
  if (p.timeLabels === "ends") return 2;
  if (p.timeLabels === "four") return 4;
  return TIMELINE_DEFAULT_LABEL_COUNT;
}

/** One `timeLabelCount` value squeezed into the range the editor offers, with
 * anything unreadable reading as no times at all. A chart reads its count with
 * this rather than through `parseTimeLabelCount`: the retired `timeLabels` word
 * is a timeline key, and a chart carrying one would mean two different counts
 * on the two sides. */
export function clampTimeLabelCount(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return TIMELINE_DEFAULT_LABEL_COUNT;
  return Math.max(0, Math.min(TIMELINE_MAX_LABEL_COUNT, Math.round(n)));
}

/** The fractions of the frame's width `n` times sit at: evenly spaced from the
 * window's start to now, and the right edge alone when there is only one, since
 * the one time worth printing on its own is the newest. */
export function timeLabelPositions(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [1];
  return Array.from({ length: count }, (_, i) => i / (count - 1));
}

/** One row of a timeline's colour table.
 *
 * A row names a state rather than a bound, because states are words: "open",
 * "not_home", "heat". The comparison is case-insensitive and ignores
 * surrounding space, so a table written in lower case still matches a
 * `Home`-capitalised integration. Mirrors `TimelineElement.StateBand` in the
 * app repo. */
export interface TimelineBand {
  id: string;
  /** The state this row is about. */
  match: string;
  colorHex: string;
}

/** Grey: the system's secondary label colour, and what a state nobody named
 * should look like. */
export const TIMELINE_DEFAULT_OTHER_HEX = "#8E8E93";
export const TIMELINE_DEFAULT_CORNER_RADIUS = 1;
/** What a timeline added in the panel starts with, as distinct from the wire
 * defaults above, which the watch falls back to when a key is absent. Black
 * for a state nobody named, so on a watch face it reads as nothing rather
 * than as a grey state, and 2 pt corners. Both are written to the document
 * because they differ from the wire default. */
export const TIMELINE_NEW_OTHER_HEX = "#000000";
export const TIMELINE_NEW_CORNER_RADIUS = 2;
/** A day: long enough that a door opened this morning is still on the strip. */
export const TIMELINE_NEW_MINUTES = 1440;
export const TIMELINE_DEFAULT_MINUTES = 60;
/** The wire defaults for the clock times: a watch that predates the keys draws
 * the strip alone, so absent has to mean "no times". */
export const TIMELINE_DEFAULT_LABEL_COUNT = 0;
export const TIMELINE_DEFAULT_LABEL_SIZE = 9;
export const TIMELINE_DEFAULT_LABEL_HEX = "#8E8E93";
export const TIMELINE_DEFAULT_HOUR_CYCLE: TimelineHourCycle = "auto";
export const TIMELINE_DEFAULT_MINUTE_STYLE: TimelineMinuteStyle = "auto";
/** A timeline added in the panel starts with the watch history page's own row
 * of four times, which is the reading this layer was missing. */
export const TIMELINE_NEW_LABEL_COUNT = 4;
/** Twelve times is one every fifteen minutes on a three hour strip, and already
 * more than a 181 point face can print without them touching. */
export const TIMELINE_MAX_LABEL_COUNT = 12;
/** The times are readable between these two sizes and nowhere else: a size of
 * nothing draws nothing, and over 20 pt the row eats the strip. */
export const TIMELINE_MIN_LABEL_SIZE = 1;
export const TIMELINE_MAX_LABEL_SIZE = 20;
/** The widest gap worth offering: past four points the runs of a busy hour
 * stop touching at all and the strip reads as a dotted line. */
export const TIMELINE_MAX_GAP = 4;
/** How many state changes a timeline asks for. Fixed rather than editable: the
 * strip is read as a shape, and 120 runs on a 181 point face is already finer
 * than the screen resolves. Matches `CHART_HISTORY_MAX_POINTS`. */
export const TIMELINE_HISTORY_POINTS = 120;

/** The colour a run takes, first matching row wins. Case-insensitive after
 * trimming, so the table matches what a person typed rather than what an
 * integration capitalised. Mirrors `TimelineElement.colorHex(for:)` in Swift. */
export function timelineBandColor(state: string, bands: readonly TimelineBand[], other: string): string {
  const wanted = state.trim().toLowerCase();
  for (const band of bands) if (band.match.trim().toLowerCase() === wanted) return band.colorHex;
  return other;
}

/** The span a timeline reads, clamped the way the chart's is: at least a
 * minute, never past what the recorder is asked to keep. */
export function timelineHistoryMinutes(el: TimelineElement): number {
  const raw = Math.round(el.historyMinutes);
  if (!Number.isFinite(raw)) return TIMELINE_DEFAULT_MINUTES;
  return Math.max(1, Math.min(CHART_HISTORY_MAX_MINUTES, raw));
}

/** The entity whose past a timeline draws, or undefined when it names none.
 * Same rule as `chartHistoryEntity`: only a directly named entity counts,
 * because the watch fetches long before any resolver exists to follow a
 * reference. */
export function timelineHistoryEntity(el: TimelineElement): string | undefined {
  return el.value.kind.kind === "entityState" ? el.value.kind.entityId : undefined;
}

/** The cache key for one timeline's recorder query, or undefined when it names
 * no entity. `states` is the fourth part, which is what keeps it apart from a
 * chart asking the same entity for the same span. */
export function timelineHistoryKey(el: TimelineElement): string | undefined {
  const entityId = timelineHistoryEntity(el);
  if (entityId === undefined) return undefined;
  return `${entityId}|${timelineHistoryMinutes(el)}|${TIMELINE_HISTORY_POINTS}|states`;
}

/** The colour a timeline reaches for on its own when a state has a well known
 * name. Every real state gets a real colour: amber for on, blue for off,
 * green for home, closed, locked or docked, red for a door standing open, a
 * lock left open or an alarm going off, yellow for a state on its way
 * somewhere. Only the two no-reading states are grey, so "the recorder had
 * nothing" reads as a gap and never as a state. A word not in the table gets
 * `TIMELINE_DEFAULT_OTHER_HEX` when a row is added for it. */
export const TIMELINE_STATE_COLORS: Record<string, string> = {
  on: "#FF9F0A", off: "#0A84FF",
  open: "#FF453A", closed: "#32D74B", opening: "#FFD60A", closing: "#FFD60A",
  home: "#32D74B", not_home: "#0A84FF",
  locked: "#32D74B", unlocked: "#FF453A", jammed: "#BF5AF2",
  playing: "#32D74B", paused: "#FF9F0A", idle: "#0A84FF", standby: "#5E5CE6",
  heat: "#FF9F0A", cool: "#64D2FF", heat_cool: "#BF5AF2", dry: "#FFD60A", fan_only: "#5E5CE6", auto: "#BF5AF2",
  cleaning: "#32D74B", docked: "#0A84FF", returning: "#64D2FF", error: "#FF453A",
  disarmed: "#32D74B", armed_home: "#0A84FF", armed_away: "#FF9F0A", armed_night: "#5E5CE6",
  arming: "#FFD60A", pending: "#FFD60A", triggered: "#FF453A",
  unavailable: "#48484A", unknown: "#48484A",
};

/** The states each domain is known to write to the recorder, in the order a
 * colour table should list them. These are the recorder's words, not the
 * frontend's: a binary sensor is `on` and `off` whatever its device class. */
export const TIMELINE_DOMAIN_STATES: Record<string, string[]> = {
  binary_sensor: ["on", "off"], switch: ["on", "off"], light: ["on", "off"], input_boolean: ["on", "off"],
  fan: ["on", "off"], humidifier: ["on", "off"], siren: ["on", "off"],
  cover: ["open", "closed", "opening", "closing"],
  lock: ["locked", "unlocked", "jammed"],
  person: ["home", "not_home"], device_tracker: ["home", "not_home"],
  media_player: ["playing", "paused", "idle", "off"],
  climate: ["heat", "cool", "heat_cool", "dry", "fan_only", "auto", "off"],
  vacuum: ["cleaning", "docked", "returning", "idle", "error"],
  alarm_control_panel: ["disarmed", "armed_home", "armed_away", "armed_night", "arming", "pending", "triggered"],
};

/** The colour for a state word, from the table above, else the grey a state
 * nobody named draws in. Case and surrounding space are ignored. */
export function timelineStateColor(state: string): string {
  return TIMELINE_STATE_COLORS[state.trim().toLowerCase()] ?? TIMELINE_DEFAULT_OTHER_HEX;
}

/** Device classes whose binary sensor is about something being open. */
const OPENING_DEVICE_CLASSES = ["door", "garage_door", "window", "opening"];

/**
 * The table a timeline starts with once its entity is known.
 *
 * A colour table with nothing in it is a strip in one colour, which answers
 * none of the questions a timeline is added to answer. The domain already says
 * what the two interesting states are called in almost every case, so the rows
 * are written for the author and left there to edit.
 *
 * The words are the ones the recorder actually holds, which is not always the
 * words the frontend prints: a `cover` really is `open` and `closed`, but a
 * binary sensor with a door device class is `on` and `off` and only reads as a
 * door in the UI. A table seeded with `open` on one of those would match
 * nothing, so a door-shaped binary sensor gets `on` and `off` in the colours a
 * door wants instead.
 *
 * `unavailable` is on every table: a run of it means the entity stopped
 * reporting, and reading that as "off" is the one wrong answer the strip can
 * give.
 */
export function seedTimelineBands(domain: string, deviceClass?: string): TimelineBand[] {
  const dc = (deviceClass ?? "").trim().toLowerCase();
  // A door-shaped binary sensor is "on" while it stands open, so its on row
  // takes the colour a cover's open row has.
  const openish = domain === "binary_sensor" && OPENING_DEVICE_CLASSES.includes(dc);
  const colour = (state: string) => (openish && state === "on" ? timelineStateColor("open") : timelineStateColor(state));
  const words = TIMELINE_DOMAIN_STATES[domain] ?? [];
  // Both of the states Home Assistant uses for "no reading" come last: a
  // sensor that drops out reports unavailable, one that has not reported yet
  // says unknown.
  return [...words, "unavailable", "unknown"].map((state) => ({ id: newId(), match: state, colorHex: colour(state) }));
}

export interface ShapeElement extends ElementBase {
  kind: ShapeKind;
  cornerRadius: number;
  /** Line thickness in watch points. Only read for the `line` kind, and encoded
   * only when it is away from 1, so every other shape's bytes are unchanged. */
  thickness: number;
  borderColorHex?: string;
  borderWidth: number;
}

/** A picture, aspect-filled into its frame. No colorSlot: photos have no tint.
 * The watch fetches the pixels through op=snapshot or op=entity_picture; the
 * panel previews the entity's own entity_picture URL either way. */
/** Where an image layer's pixels come from. `camera` is a `camera.*` entity
 * grabbed through op=snapshot; `entityPicture` is any entity that carries an
 * `entity_picture` attribute (a person's avatar, a media player's cover art). */
export type ImageSource = "camera" | "entityPicture";
/** How a snapshot meets its frame: `fill` crops it, `fit` shows all of it. */
export type ImageContentMode = "fill" | "fit";
export type ImageTimestampCorner = "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";

export const IMAGE_DEFAULT_CORNER_RADIUS = 6;
export const IMAGE_DEFAULT_TIMESTAMP_SIZE = 9;
export const IMAGE_TIMESTAMP_CORNERS: ImageTimestampCorner[] = ["topLeading", "topTrailing", "bottomLeading", "bottomTrailing"];

export interface ImageElement extends Omit<ElementBase, "colorSlot"> {
  entity: EntityRef;
  /** Where the pixels come from. Encoded only when it is not `camera`, so a
   * document written before the key existed keeps its exact bytes. */
  source: ImageSource;
  /** Draw the fetched-at time in the picture's corner. Encoded only when true. */
  timestamp?: boolean;
  /** Every field below matches `CustomComplication.ImageElement` in the app and
   * is encoded only when it differs from the look an image layer has always
   * had, so a document nobody has touched stays byte-identical and an older
   * watch, which ignores keys it does not know, draws it exactly as before. */
  contentMode: ImageContentMode;
  zoom: number;
  /** -1..1, 0 centred. Which part of an over-large picture is kept. */
  panX: number;
  panY: number;
  cornerRadius: number;
  timestampCorner: ImageTimestampCorner;
  timestampSize: number;
  /** Free placement of the timestamp chip: its centre as 0..1 fractions of the
   * layer's own box. Both set means free, either missing means the four-corner
   * `timestampCorner` behaviour the element has always had. Encoded only when
   * free, so a document that never left the corners keeps its exact bytes.
   *
   * `timestampCorner` is still written alongside them, set to whichever corner
   * the free point is nearest, so a watch that predates these keys lands the
   * chip near the mark instead of defaulting to the top left. */
  timestampX?: number;
  timestampY?: number;
}

/** Whether an image's timestamp is freely placed rather than cornered. Both
 * coordinates have to be there: half a point is not a position. */
export function hasFreeTimestamp(img: ImageElement): boolean {
  return Number.isFinite(img.timestampX) && Number.isFinite(img.timestampY);
}

/** The corner a free timestamp point is nearest, for the compatibility copy an
 * older watch reads. Exactly on a midline picks the leading/top side, which is
 * arbitrary but has to be the same arbitrary answer in the tests. */
export function nearestTimestampCorner(x: number, y: number): ImageTimestampCorner {
  const top = y <= 0.5;
  const leading = x <= 0.5;
  if (top) return leading ? "topLeading" : "topTrailing";
  return leading ? "bottomLeading" : "bottomTrailing";
}

/** An invisible tap area. Draws nothing on the watch; its frame becomes its own
 * tap target laid over everything else, so a complication can carry as many taps
 * as it has tap layers. Inside the frame `action` wins; outside it the document's
 * whole-complication tapAction still applies. The page pair mirrors the
 * document-level one and is encoded only when set. No colorSlot. */
export interface TapElement extends Omit<ElementBase, "colorSlot"> {
  action: TapAction;
  openPageId?: string;
  openPageName?: string;
  /** Id of the drawing layer this tap belongs to (the editor's Tappable
   * checkbox). The tap then copies that layer's frame and per-shape
   * placements and sits directly above it, so the author never lines a
   * rectangle up by hand. Encoded only when set; the watch ignores it and
   * draws the frame exactly as it does for a free-standing tap. */
  attachedTo?: string;
  /** How far an attached tap's area reaches past its layer on each side, in
   * design-box points (negative pulls it inside the layer). Editor state, not
   * on the wire: the frames already carry the result, and `syncAttachedTaps`
   * reads it back from them when a document arrives, so a round trip through
   * the watch loses nothing. Applied per shape, because the three design
   * boxes turn the same point value into different fractions. Undefined means
   * "adopt whatever frame the document has for this tap". */
  outset?: TapOutset;
}

/** Points past the owner's edge on each side of an attached tap. */
export interface TapOutset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export const ZERO_OUTSET: TapOutset = { top: 0, left: 0, bottom: 0, right: 0 };

export function isZeroOutset(o: TapOutset | undefined): boolean {
  return o === undefined || (o.top === 0 && o.left === 0 && o.bottom === 0 && o.right === 0);
}

/** A chart's clock times as a layer of their own. It draws the times its chart
 * would print, at `timeLabelPositions(timeLabelCount)` across its own width and
 * centred in its own height, so the row can sit anywhere and be sized like any
 * layer. The chart then carries `drawsTimeLabels: false`. A link to a layer
 * that is not a chart, or to nothing, draws nothing.
 *
 * No colorSlot, for the timeline's reason: the times' colour is
 * `labelColorHex`. No `labelsAbove`: the layer's frame says where the row is.
 * Mirrors `CustomComplication.ChartTimesElement` in the app repo. */
export interface ChartTimesElement extends Omit<ElementBase, "colorSlot"> {
  /** The chart layer whose span the times are read from. */
  chart: string;
  timeLabelCount: number;
  labelSize: number;
  labelColorHex: string;
  hourCycle: TimelineHourCycle;
  minutes: TimelineMinuteStyle;
}

/** A dot on each reading of a chart, as a layer of its own. It draws in its
 * chart's box, not its own frame, and puts a dot on every reading the chart
 * draws, skipping holes and the readings the chart already marks with its own
 * highlight dot. Nothing on a bars chart or without a chart.
 *
 * No colorSlot: `colorHex` is the one colour, and absent paints each dot in the
 * colour the series has at that reading. Mirrors
 * `CustomComplication.ChartDotsElement` in the app repo. */
export interface ChartDotsElement extends Omit<ElementBase, "colorSlot"> {
  /** The chart layer whose readings get the dots. */
  chart: string;
  dots: ChartDotsMode;
  /** Diameter in design points, 1…12. Absent is the chart's `lineWidth * 1.8`. */
  size?: number;
  colorHex?: string;
}

/** Horizontal grid lines across a chart's plot, as a layer of their own, in
 * the chart's box. Equal rows, never on the plot's top or bottom edge. The
 * panel puts it directly below its chart so the lines sit behind the series.
 * No colorSlot, for `chartDots`' reason. Mirrors
 * `CustomComplication.ChartGridElement` in the app repo. */
export interface ChartGridElement extends Omit<ElementBase, "colorSlot"> {
  chart: string;
  /** 1…4. */
  lines: number;
  colorHex: string;
  /** Stroke width in design points, 0.25…4. */
  thickness: number;
}

export type Element =
  | { kind: "text"; payload: TextElement }
  | { kind: "icon"; payload: IconElement }
  | { kind: "gauge"; payload: GaugeElement }
  | { kind: "chart"; payload: ChartElement }
  | { kind: "timeline"; payload: TimelineElement }
  | { kind: "shape"; payload: ShapeElement }
  | { kind: "image"; payload: ImageElement }
  | { kind: "tap"; payload: TapElement }
  | { kind: "chartTimes"; payload: ChartTimesElement }
  | { kind: "chartDots"; payload: ChartDotsElement }
  | { kind: "chartGrid"; payload: ChartGridElement };

export interface Placement {
  frame: NormalizedFrame;
  isHidden: boolean;
  size?: number;
}

/** Colored arc gauge in the corner's bezel (the stock Weather temperature look).
 * `colorHexes` are gradient stops from the min end to the max end; the optional
 * labels are the small numbers the system draws at the two ends of the arc. */
export interface BezelGauge {
  value: Value;
  minValue: number;
  maxValue: number;
  colorHexes: string[];
  minLabel?: Value;
  maxLabel?: Value;
}

export interface FamilyLayout {
  placements: Record<string, Placement>;
  bezelText?: Value;
  /** Live countdown mode for bezelText, same semantics as TextElement.countdown. */
  bezelCountdown?: boolean;
  /** Big curved main text (corner only). When set, the corner ignores the
   * element canvas: the system curves only plain text. */
  curvedText?: Value;
  curvedColorHex?: string;
  /** Corner bezel gauge; wins over bezelText when set. */
  bezelGauge?: BezelGauge;
  backgroundColorHex?: string;
  cornerBodyShape: CornerBodyShape;
  borderColorHex?: string;
  borderWidth: number;
  rules: Rule[];
}

/** A raw service call: `domain.service`, an optional target entity, and service
 * data as the string the author typed. The target is nested rather than spread
 * flat like the entity actions, so nothing that asks `"entityId" in action`
 * mistakes an optional target for a required one; `encodeTapAction` flattens it
 * onto the wire, where it uses the same four keys as every other action. */
export interface CallServiceAction {
  type: "callService";
  serviceDomain: string;
  serviceName: string;
  /** Raw JSON object string. Omitted when blank; the watch parses it at fire
   * time and refuses to fire when it is not an object. */
  serviceDataJSON?: string;
  target?: EntityRef;
}

export type TapAction =
  | { type: "none" | "refresh" | "openApp" | "openPage" | "openRoomPage" | "timerStartPause" | "timerCancel" }
  | ({ type: "toggleEntity" | "runScene" | "runScript" | "addTodo" | "runHTTPAction" } & EntityRef)
  | CallServiceAction;

/** The actions that cannot be finished without an entity, so the editor shows a
 * picker the moment one is chosen. `callService` is deliberately absent: its
 * target is optional, because a service can address an area, a device or
 * nothing at all. Shared by the document's tap picker and every layer's. */
const ENTITY_TAP_TYPES: readonly string[] =
  ["toggleEntity", "runScene", "runScript", "addTodo", "runHTTPAction"];

export function tapNeedsEntity(t: TapAction["type"]): boolean {
  return ENTITY_TAP_TYPES.includes(t);
}

/** Whether a service data string is usable: blank counts as "no data", and
 * anything that is not a JSON object is a mistake worth showing. Mirrors
 * `CallServiceSpec.parseData` in the app. */
export function serviceDataIsValid(json: string | undefined): boolean {
  const trimmed = (json ?? "").trim();
  if (trimmed === "") return true;
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

/** The human name of every tap action, in the order the pickers offer them.
 * It lives here rather than beside the picker because the preview labels tap
 * boxes with the same words in review mode, and the renderer cannot import the
 * editors (they already import it). */
export const TAP_ACTION_LABELS: [TapAction["type"], string][] = [
  ["refresh", "Refresh"], ["none", "Nothing"], ["openApp", "Open the app"], ["openPage", "Open the page"], ["openRoomPage", "Open the room page"],
  ["timerStartPause", "Timer start / pause"], ["timerCancel", "Timer cancel"],
  ["toggleEntity", "Toggle an entity"], ["runScene", "Run a scene"], ["runScript", "Run a script"], ["addTodo", "Add a to-do"], ["runHTTPAction", "Run an HTTP action"],
  ["callService", "Call a service"],
];

/** One-line description of a tap action, for hints and for the review-mode
 * labels in the preview. */
export function describeTapAction(action: TapAction): string {
  const label = TAP_ACTION_LABELS.find(([t]) => t === action.type)?.[1] ?? action.type;
  if (action.type === "callService") {
    // The service is the subject; the target entity is not, because most of these
    // calls carry their meaning in the service name alone.
    const call = [action.serviceDomain, action.serviceName].filter((s) => s !== "").join(".");
    return call === "" ? label : `${label}: ${call}`;
  }
  if (!("entityId" in action)) return label;
  const target = action.displayName || action.entityId;
  return target ? `${label}: ${target}` : label;
}

export type DataSource =
  | ({ kind: "entity" } & EntityRef)
  | { kind: "template"; value: string };

/** The Inline shape's whole layout: one line of text and an optional symbol.
 * The watch draws `symbol label: value`, value alone when the face is narrow.
 * Lives beside perFamily because it has no canvas. Present exactly when
 * supportedFamilies includes "inline". */
export interface InlineLayout {
  label?: string;
  value: Value;
  symbol?: string;
  /** Live countdown mode, same semantics as TextElement.countdown. */
  countdown?: boolean;
}

export interface CustomComplicationConfig {
  schemaVersion: number;
  id: string;
  name: string;
  values: NamedValue[];
  slotIndex: number;
  elements: Element[];
  /** The shapes this complication has. Authoritative since schema 6: the
   * watch draws only these and each shape's picker lists the document only
   * when its shape is here. One is enough; never empty. */
  supportedFamilies: FamilyKind[];
  perFamily: Partial<Record<FamilyKind, FamilyLayout>>;
  inline?: InlineLayout;
  dataSources: DataSource[];
  refreshMinutes?: number;
  tapAction: TapAction;
  /** Page an openPage tap opens (watch page UUID); the id is authoritative. */
  openPageId?: string;
  /** Display name of that page when chosen; cosmetic label for the picker. */
  openPageName?: string;
  showSuccessFlash?: boolean;
  successFlashColorHex?: string;
  /** Layer groups (editor-only). Encoded only when there is at least one. */
  groups?: LayerGroup[];
}

// ── parsing ───────────────────────────────────────────────────────────────

type J = Record<string, unknown>;

function isObject(v: unknown): v is J {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function num(v: unknown, fallback: number): number {
  if (typeof v === "number") return v;
  if (v === "+inf") return Infinity;
  if (v === "-inf") return -Infinity;
  if (v === "nan") return NaN;
  return fallback;
}
/** Squeeze a fraction back into 0..1. Infinities and NaN read as 0, so a
 * corrupt coordinate parks the chip at the top left rather than off the face. */
export function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
function optNum(v: unknown): number | undefined {
  return v === undefined || v === null ? undefined : num(v, 0);
}
function optStr(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
/** One spelling out of a label table, or the fallback when it is not in it.
 *
 * The rest of this parser casts a string straight to its union and trusts the
 * document, which is fine for the enums that have never grown. These three are
 * expected to grow, so a value a newer panel wrote has to read as the default
 * here rather than becoming a request the server cannot serve. */
function pickEnum<T extends string>(
  raw: string | undefined,
  table: readonly (readonly [T, string])[],
  fallback: T,
): T {
  return table.some(([value]) => value === raw) ? (raw as T) : fallback;
}

export class ConfigParseError extends Error {}

function parseEntityRef(o: J): EntityRef {
  if (typeof o.entityId !== "string") throw new ConfigParseError("entityId is required");
  const ref: EntityRef = { entityId: o.entityId, displayName: str(o.displayName), domain: str(o.domain) };
  if (typeof o.iconName === "string") ref.iconName = o.iconName;
  return ref;
}

function parseFormat(o: unknown): ValueFormat | undefined {
  if (!isObject(o)) return undefined;
  const f: ValueFormat = {};
  if (o.decimals !== undefined && o.decimals !== null) f.decimals = num(o.decimals, 0);
  if (o.multiply !== undefined && o.multiply !== null) f.multiply = num(o.multiply, 1);
  if (o.offset !== undefined && o.offset !== null) f.offset = num(o.offset, 0);
  if (typeof o.prefix === "string") f.prefix = o.prefix;
  if (typeof o.suffix === "string") f.suffix = o.suffix;
  if (o.useEntityUnit === true) f.useEntityUnit = true;
  if (o.relativeTime === true) f.relativeTime = true;
  if (o.duration === true) f.duration = true;
  if (o.textCase === "upper" || o.textCase === "lower" || o.textCase === "capitalized") f.textCase = o.textCase;
  return formatIsEmpty(f) ? undefined : f;
}

export function formatIsEmpty(f: ValueFormat | undefined): boolean {
  if (!f) return true;
  return (
    f.decimals === undefined &&
    f.multiply === undefined &&
    f.offset === undefined &&
    !f.prefix &&
    !f.suffix &&
    !f.useEntityUnit &&
    !f.relativeTime &&
    !f.duration &&
    f.textCase === undefined
  );
}

function parseAggregate(o: J): AggregateSpec {
  const fn = str(o.function, "count") as AggregateFunction;
  const scopeRaw = isObject(o.scope) ? o.scope : {};
  let scope: AggregateScope;
  if (scopeRaw.kind === "entities") {
    const list = Array.isArray(scopeRaw.entities) ? scopeRaw.entities : [];
    scope = { kind: "entities", entities: list.filter(isObject).map(parseEntityRef) };
  } else {
    const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    scope = {
      kind: "filter",
      domains: strings(scopeRaw.domains),
      areaIds: strings(scopeRaw.areaIds),
      labelIds: strings(scopeRaw.labelIds),
      floorIds: strings(scopeRaw.floorIds),
    };
  }
  const spec: AggregateSpec = { function: fn, scope };
  if (isObject(o.stateFilter)) {
    const k = o.stateFilter.kind;
    if (k === "isOn" || k === "isOff") spec.stateFilter = { kind: k };
    else if (k === "equals" || k === "notEquals") spec.stateFilter = { kind: k, value: str(o.stateFilter.value) };
  }
  if (typeof o.attribute === "string") spec.attribute = o.attribute;
  return spec;
}

function parseValueKind(o: J): ValueKind {
  switch (o.kind) {
    case "literal":
      return { kind: "literal", value: str(o.value) };
    case "entityState":
      return { kind: "entityState", ...parseEntityRef(o) };
    case "entityAttribute":
      return { kind: "entityAttribute", ...parseEntityRef(o), attribute: str(o.attribute) };
    case "entityAge":
      return { kind: "entityAge", ...parseEntityRef(o) };
    case "aggregate":
      return { kind: "aggregate", aggregate: parseAggregate(isObject(o.aggregate) ? o.aggregate : {}) };
    case "time":
      return { kind: "time", timeField: (optStr(o.timeField) as TimeField | undefined) ?? "now" };
    case "dataAge":
      return { kind: "dataAge" };
    case "jinja":
      return { kind: "jinja", value: str(o.value) };
    case "named":
      return { kind: "named", id: str(o.id).toUpperCase() };
    case "chartStat":
      return {
        kind: "chartStat",
        layer: str(o.layer).toUpperCase(),
        stat: CHART_STATS.some(([s]) => s === o.stat) ? (o.stat as ChartStat) : "latest",
      };
    default:
      throw new ConfigParseError(`unknown value kind ${String(o.kind)}`);
  }
}

export function parseValue(raw: unknown): Value {
  if (!isObject(raw)) throw new ConfigParseError("value must be an object");
  // Nested v3 form: {"kind": {...}, "format": {...}}. Flat v2 form: kind is a string.
  if (isObject(raw.kind)) {
    const v: Value = { kind: parseValueKind(raw.kind) };
    const f = parseFormat(raw.format);
    if (f) v.format = f;
    return v;
  }
  const v: Value = { kind: parseValueKind(raw) };
  const f = parseFormat(raw.format);
  if (f) v.format = f;
  return v;
}

function parseFrame(o: unknown): NormalizedFrame {
  if (!isObject(o)) return { ...CENTERED_FRAME };
  return {
    x: num(o.x, 0.25),
    y: num(o.y, 0.25),
    width: num(o.width, 0.5),
    height: num(o.height, 0.5),
    rotationDegrees: num(o.rotationDegrees, 0),
  };
}

function parseComparison(o: unknown): Comparison {
  if (!isObject(o)) return { kind: "isOn" };
  const kind = str(o.kind, "isOn") as ComparisonKind;
  const c: Comparison = { kind };
  switch (kind) {
    case "equals": case "notEquals": case "greaterThan": case "greaterOrEqual":
    case "lessThan": case "lessOrEqual": case "contains": case "startsWith": case "endsWith":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      break;
    case "between": case "timeBetween":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      c.upper = isObject(o.upper) ? parseValue(o.upper) : literal("");
      break;
    case "matchesRegex":
      c.pattern = str(o.pattern);
      break;
    case "isOneOf":
      c.options = Array.isArray(o.options) ? o.options.filter((x): x is string => typeof x === "string") : [];
      break;
    default:
      break;
  }
  return c;
}

function parseStyleChange(o: unknown): StyleChange {
  if (!isObject(o)) return { kind: "show" };
  const kind = str(o.kind, "show") as StyleChangeKind;
  const c: StyleChange = { kind };
  switch (kind) {
    case "setColor": case "setText": case "setIcon": case "setGaugeValue":
    case "setBorderColor": case "setBackgroundColor":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      break;
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin":
    case "setGaugeMax": case "setBorderWidth":
      c.number = num(o.number, 0);
      break;
    case "setFontWeight":
      c.weight = (optStr(o.weight) as FontWeight | undefined) ?? "regular";
      break;
    default:
      break;
  }
  return c;
}

function parseRules(raw: unknown): Rule[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isObject).map((r) => {
    const rule: Rule = {
      id: str(r.id).toUpperCase(),
      cases: (Array.isArray(r.cases) ? r.cases : []).filter(isObject).map((c) => {
        const when = isObject(c.when) ? c.when : {};
        return {
          id: str(c.id).toUpperCase(),
          when: {
            join: when.join === "any" ? "any" : "all",
            tests: (Array.isArray(when.tests) ? when.tests : []).filter(isObject).map((t) => ({
              id: str(t.id).toUpperCase(),
              value: isObject(t.value) ? parseValue(t.value) : literal(""),
              comparison: parseComparison(t.comparison),
            })),
          },
          then: (Array.isArray(c.then) ? c.then : []).map(parseStyleChange),
        };
      }),
    };
    if (Array.isArray(r.otherwise)) rule.otherwise = r.otherwise.map(parseStyleChange);
    if (typeof r.partId === "string" && r.partId !== "") rule.partId = r.partId.toUpperCase();
    return rule;
  });
}

function parseColorSlot(o: unknown, fallback: string): ColorSlot {
  return { baseColorHex: isObject(o) ? str(o.baseColorHex, fallback) : fallback };
}

/** A chart's colour table, reading the two-bound shape forward when that is all
 * the payload has.
 *
 * The first cut of banded colour (2026-09-05) had exactly two bounds and painted
 * the middle with the layer's own colour. "Under lower" and "between the bounds"
 * become two rows; "over upper" is what the table falls through to. A reading
 * sitting exactly on the lower bound moves from the middle colour to the low
 * one, which is the single value the two spellings disagree on. */
function parseColorBands(raw: unknown): ChartBand[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isObject).map((b) => ({
    id: str(b.id, newId()),
    upTo: num(b.upTo, 0),
    colorHex: str(b.colorHex, "#FFFFFF"),
  }));
}

/** A rich text layer's parts. Each style key is kept only when the document
 * says something other than its default, and a weight or colouring this build
 * does not know reads as absent, the way the app's decoder reads them. */
function parseTextParts(raw: unknown): TextPart[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isObject).map((o) => {
    const part: TextPart = {
      id: str(o.id, newId()).toUpperCase(),
      value: isObject(o.value) ? parseValue(o.value) : literal(""),
    };
    if (typeof o.colorHex === "string") part.colorHex = o.colorHex;
    const weight = optStr(o.fontWeight);
    if (weight === "regular" || weight === "medium" || weight === "semibold" || weight === "bold") part.fontWeight = weight;
    if (typeof o.fontSize === "number") part.fontSize = o.fontSize;
    if (optStr(o.coloring) === "bands") part.coloring = "bands";
    const bands = parseColorBands(o.bands);
    if (bands.length > 0) part.bands = bands;
    const above = str(o.bandAboveColorHex, CHART_DEFAULT_BAND_HIGH_HEX);
    if (above !== CHART_DEFAULT_BAND_HIGH_HEX) part.bandAboveColorHex = above;
    return part;
  });
}

function parseChartBands(p: J): ChartBand[] {
  if (Array.isArray(p.bands)) {
    return parseColorBands(p.bands);
  }
  if (typeof p.bandLowerBound !== "number") return [];
  const slot = isObject(p.colorSlot) ? str(p.colorSlot.baseColorHex, "#FFFFFF") : "#FFFFFF";
  return [
    { id: newId(), upTo: p.bandLowerBound, colorHex: str(p.bandLowColorHex, CHART_DEFAULT_BAND_LOW_HEX) },
    { id: newId(), upTo: num(p.bandUpperBound, 100), colorHex: slot },
  ];
}

/** A timeline's colour table. A row with a blank `match` is kept rather than
 * dropped: it matches no state a recorder returns, so it draws nothing, and an
 * author part-way through typing one would be surprised to lose it. */
function parseTimelineBands(raw: unknown): TimelineBand[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isObject).map((b) => ({
    id: str(b.id, newId()).toUpperCase(),
    match: str(b.match, ""),
    colorHex: str(b.colorHex, TIMELINE_DEFAULT_OTHER_HEX),
  }));
}

function parseElementBase(p: J, defaultColor: string): ElementBase {
  if (typeof p.id !== "string") throw new ConfigParseError("element id is required");
  return {
    id: p.id.toUpperCase(),
    colorSlot: parseColorSlot(p.colorSlot, defaultColor),
    rules: parseRules(p.rules),
    frame: parseFrame(p.frame),
    isHidden: p.isHidden === true,
  };
}

export function parseElement(raw: unknown): Element {
  const el = parseElementKind(raw);
  const p = (raw as J).payload as J;
  if (typeof p.groupId === "string" && p.groupId !== "") el.payload.groupId = p.groupId.toUpperCase();
  return el;
}

function parseElementKind(raw: unknown): Element {
  if (!isObject(raw) || !isObject(raw.payload)) throw new ConfigParseError("element must have a payload");
  const p = raw.payload;
  switch (raw.kind) {
    case "text": {
      const payload: TextElement = {
        ...parseElementBase(p, "#FFFFFF"),
        value: isObject(p.value) ? parseValue(p.value) : literal(""),
        fontSize: num(p.fontSize, 14),
        fontWeight: (optStr(p.fontWeight) as FontWeight | undefined) ?? "regular",
      };
      if (p.countdown === true) payload.countdown = true;
      if (p.monospacedDigits === true) payload.monospacedDigits = true;
      // Clamped, not rejected: a count outside 1...2 is a document asking for a
      // look this build does not have, not a document this build cannot read.
      const lines = typeof p.lineLimit === "number" ? Math.round(p.lineLimit) : 1;
      if (Math.min(2, Math.max(1, lines)) === 2) payload.lineLimit = 2;
      // An unknown spelling falls back to center, matching the Swift decoder.
      const align = optStr(p.alignment);
      if (align === "leading" || align === "trailing") payload.alignment = align;
      // Colour by value. Each key is kept only when it says something other
      // than its default, so a layer that never used it round-trips unchanged.
      if (optStr(p.coloring) === "bands") payload.coloring = "bands";
      const bands = parseColorBands(p.bands);
      if (bands.length > 0) payload.bands = bands;
      const above = str(p.bandAboveColorHex, CHART_DEFAULT_BAND_HIGH_HEX);
      if (above !== CHART_DEFAULT_BAND_HIGH_HEX) payload.bandAboveColorHex = above;
      const highlight = optStr(p.highlight);
      if (highlight === "highest" || highlight === "lowest" || highlight === "both") payload.highlight = highlight;
      const high = str(p.highColorHex, CHART_DEFAULT_HIGH_HEX);
      if (high !== CHART_DEFAULT_HIGH_HEX) payload.highColorHex = high;
      const low = str(p.lowColorHex, CHART_DEFAULT_LOW_HEX);
      if (low !== CHART_DEFAULT_LOW_HEX) payload.lowColorHex = low;
      const parts = parseTextParts(p.parts);
      if (parts.length > 0) payload.parts = parts;
      readChartAnchor(p, payload);
      return { kind: "text", payload };
    }
    case "icon": {
      const payload: IconElement = {
        ...parseElementBase(p, "#FFFFFF"),
        symbol: isObject(p.symbol) ? parseValue(p.symbol) : literal("lightbulb"),
        size: num(p.size, 14),
      };
      const path = optStr(p.path);
      if (path !== undefined && path !== "") payload.path = path;
      readChartAnchor(p, payload);
      return { kind: "icon", payload };
    }
    case "gauge": {
      const el: GaugeElement = {
        ...parseElementBase(p, "#FFFFFF"),
        value: isObject(p.value) ? parseValue(p.value) : literal("50"),
        minValue: num(p.minValue, 0),
        maxValue: num(p.maxValue, 100),
        style: (optStr(p.style) as GaugeStyle | undefined) ?? "arc",
        lineWidth: num(p.lineWidth, 4),
        trackColorHex: str(p.trackColorHex, "#FFFFFF40"),
        coloring: (optStr(p.coloring) as ChartColoring | undefined) ?? "uniform",
        bands: parseColorBands(p.bands),
        bandAboveColorHex: str(p.bandAboveColorHex, CHART_DEFAULT_BAND_HIGH_HEX),
        thresholdColorHex: str(p.thresholdColorHex, GAUGE_DEFAULT_THRESHOLD_HEX),
      };
      const threshold = optNum(p.thresholdValue);
      if (threshold !== undefined) el.thresholdValue = threshold;
      if (isObject(p.total)) el.total = parseValue(p.total);
      if (isObject(p.minSource)) el.minSource = parseValue(p.minSource);
      if (isObject(p.maxSource)) el.maxSource = parseValue(p.maxSource);
      return { kind: "gauge", payload: el };
    }
    case "chart":
      return {
        kind: "chart",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          value: isObject(p.value) ? parseValue(p.value) : literal("13,14,16,17,19,22,24,28,30"),
          historyMinutes: Math.max(0, Math.round(num(p.historyMinutes, 0))),
          historyPoints: Math.round(num(p.historyPoints, 24)),
          // A source, period or type this build does not serve reads as the
          // default rather than failing the layer, the same forgiving rule the
          // app's decoder applies with `try?`.
          source: pickEnum(optStr(p.source), CHART_SOURCES, CHART_DEFAULT_SOURCE),
          statPeriod: pickEnum(optStr(p.statPeriod), STAT_PERIODS, CHART_DEFAULT_STAT_PERIOD),
          statType: pickEnum(optStr(p.statType), STAT_TYPES, CHART_DEFAULT_STAT_TYPE),
          style: (optStr(p.style) as ChartStyle | undefined) ?? "bars",
          limit: Math.max(0, Math.round(num(p.limit, 0))),
          takeFromEnd: p.takeFromEnd === true,
          scale: (optStr(p.scale) as ChartScale | undefined) ?? "auto",
          minValue: num(p.minValue, 0),
          maxValue: num(p.maxValue, 100),
          baseline: (optStr(p.baseline) as ChartBaseline | undefined) ?? "lowest",
          barGap: num(p.barGap, 1.5),
          lineWidth: num(p.lineWidth, 2),
          highlight: (optStr(p.highlight) as ChartHighlight | undefined) ?? "none",
          highColorHex: str(p.highColorHex, CHART_DEFAULT_HIGH_HEX),
          lowColorHex: str(p.lowColorHex, CHART_DEFAULT_LOW_HEX),
          marker: (optStr(p.marker) as ChartMarker | undefined) ?? "pointer",
          // A word this build does not know is left off, so that end reads as
          // whatever `marker` implies.
          ...(isChartEndMarker(p.highMarker) ? { highMarker: p.highMarker } : {}),
          ...(isChartEndMarker(p.lowMarker) ? { lowMarker: p.lowMarker } : {}),
          coloring: (optStr(p.coloring) as ChartColoring | undefined) ?? "uniform",
          bands: parseChartBands(p),
          bandAboveColorHex: str(p.bandHighColorHex, str(p.bandAboveColorHex, CHART_DEFAULT_BAND_HIGH_HEX)),
          fillBands: p.fillBands === true,
          // Both lenient: a curve this build does not know draws straight, and a
          // window it does not offer draws the readings as they are. Kept off the
          // payload at their defaults, so a chart that uses neither round-trips as is.
          ...(chartCurve(p.curve) !== "straight" ? { curve: chartCurve(p.curve) } : {}),
          // The looks keys after it, on the same rule: a spelling this build does
          // not know reads as the default, and a default stays off the payload.
          ...(chartFillStyle(p.fillStyle) !== "flat" ? { fillStyle: chartFillStyle(p.fillStyle) } : {}),
          ...(typeof p.fillColorHex === "string" ? { fillColorHex: p.fillColorHex } : {}),
          ...(chartBarRadius(p.barRadius) !== CHART_DEFAULT_BAR_RADIUS ? { barRadius: chartBarRadius(p.barRadius) } : {}),
          ...(chartBarCorners(p.barCorners) !== "all" ? { barCorners: chartBarCorners(p.barCorners) } : {}),
          ...(chartPointDots(p.pointDots) !== "none" ? { pointDots: chartPointDots(p.pointDots) } : {}),
          ...(chartPointDotSize(p.pointDotSize) !== undefined ? { pointDotSize: chartPointDotSize(p.pointDotSize) } : {}),
          ...(typeof p.pointDotColorHex === "string" ? { pointDotColorHex: p.pointDotColorHex } : {}),
          ...(chartGridLines(p.gridLines) !== 0 ? { gridLines: chartGridLines(p.gridLines) } : {}),
          ...(!sameHex(chartGridColorHex(p.gridColorHex), CHART_DEFAULT_GRID_HEX) ? { gridColorHex: chartGridColorHex(p.gridColorHex) } : {}),
          ...(p.zeroLine === true ? { zeroLine: true } : {}),
          ...(chartSmoothing(p.smoothing) !== undefined ? { smoothing: chartSmoothing(p.smoothing) } : {}),
          ...(p.gaps === true ? { gaps: true } : {}),
          ...(typeof p.thresholdValue === "number" && Number.isFinite(p.thresholdValue)
            ? { thresholdValue: p.thresholdValue }
            : {}),
          thresholdColorHex: str(p.thresholdColorHex, CHART_DEFAULT_THRESHOLD_HEX),
          ...(isObject(p.nowIndex) ? { nowIndex: parseValue(p.nowIndex) } : {}),
          nowColorHex: str(p.nowColorHex, CHART_DEFAULT_NOW_HEX),
          ...(p.drawsThreshold === false ? { drawsThreshold: false } : {}),
          ...(p.drawsNowLine === false ? { drawsNowLine: false } : {}),
          ...(p.drawsTimeLabels === false ? { drawsTimeLabels: false } : {}),
          ...(optStr(p.scaleFrom) !== undefined ? { scaleFrom: optStr(p.scaleFrom)! } : {}),
          // The clock times, read exactly the way a timeline reads them: same
          // keys, same defaults, same forgiveness for a word this build does
          // not know.
          timeLabelCount: clampTimeLabelCount(p.timeLabelCount),
          labelSize: num(p.labelSize, TIMELINE_DEFAULT_LABEL_SIZE),
          labelColorHex: str(p.labelColorHex, TIMELINE_DEFAULT_LABEL_HEX),
          labelsAbove: p.labelsAbove === true,
          hourCycle: parseHourCycle(p.hourCycle),
          minutes: parseMinuteStyle(p.minutes),
        },
      };
    case "timeline": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      return {
        kind: "timeline",
        payload: {
          ...base,
          value: isObject(p.value) ? parseValue(p.value) : literal(""),
          historyMinutes: Math.max(1, Math.round(num(p.historyMinutes, TIMELINE_DEFAULT_MINUTES))),
          bands: parseTimelineBands(p.bands),
          otherColorHex: str(p.otherColorHex, TIMELINE_DEFAULT_OTHER_HEX),
          gap: Math.min(TIMELINE_MAX_GAP, Math.max(0, num(p.gap, 0))),
          cornerRadius: Math.max(0, num(p.cornerRadius, TIMELINE_DEFAULT_CORNER_RADIUS)),
          timeLabelCount: parseTimeLabelCount(p),
          labelSize: num(p.labelSize, TIMELINE_DEFAULT_LABEL_SIZE),
          labelColorHex: str(p.labelColorHex, TIMELINE_DEFAULT_LABEL_HEX),
          labelsAbove: p.labelsAbove === true,
          hourCycle: parseHourCycle(p.hourCycle),
          minutes: parseMinuteStyle(p.minutes),
        },
      };
    }
    case "shape": {
      const el: ShapeElement = {
        ...parseElementBase(p, "#FFFFFF33"),
        kind: (optStr(p.kind) as ShapeKind | undefined) ?? "roundedRectangle",
        cornerRadius: num(p.cornerRadius, 6),
        thickness: num(p.thickness, 1),
        borderWidth: num(p.borderWidth, 1),
      };
      if (typeof p.borderColorHex === "string") el.borderColorHex = p.borderColorHex;
      readChartAnchor(p, el);
      return { kind: "shape", payload: el };
    }
    case "image": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      const el: ImageElement = {
        ...base,
        entity: parseEntityRef(isObject(p.entity) ? p.entity : {}),
        source: p.source === "entityPicture" ? "entityPicture" : "camera",
        contentMode: p.contentMode === "fit" ? "fit" : "fill",
        zoom: num(p.zoom, 1),
        panX: num(p.panX, 0),
        panY: num(p.panY, 0),
        cornerRadius: num(p.cornerRadius, IMAGE_DEFAULT_CORNER_RADIUS),
        timestampCorner: IMAGE_TIMESTAMP_CORNERS.includes(p.timestampCorner as ImageTimestampCorner)
          ? (p.timestampCorner as ImageTimestampCorner)
          : "topLeading",
        timestampSize: num(p.timestampSize, IMAGE_DEFAULT_TIMESTAMP_SIZE),
      };
      if (p.timestamp === true) el.timestamp = true;
      // Both or neither: a lone coordinate is not a position, and treating it as
      // one would move the chip somewhere the author never put it. A half-written
      // pair falls back to the corner, which is what the watch does too.
      const tsx = optNum(p.timestampX);
      const tsy = optNum(p.timestampY);
      if (tsx !== undefined && tsy !== undefined && Number.isFinite(tsx) && Number.isFinite(tsy)) {
        el.timestampX = clamp01(tsx);
        el.timestampY = clamp01(tsy);
      }
      readChartAnchor(p, el);
      return { kind: "image", payload: el };
    }
    case "tap": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      const el: TapElement = {
        ...base,
        // A layer with no action yet reads as refresh, the same default the watch
        // decoder applies, so both sides agree on a half-written document.
        action: isObject(p.action) ? parseTapAction(p.action) : { type: "refresh" },
      };
      if (typeof p.openPageId === "string") el.openPageId = p.openPageId;
      if (typeof p.openPageName === "string") el.openPageName = p.openPageName;
      // Element ids are uppercased on the way in, so the owner id has to be
      // too or nothing would ever match it.
      if (typeof p.attachedTo === "string") el.attachedTo = p.attachedTo.toUpperCase();
      // `grow` (a uniform inflation, retired 2026-09-04) is not read: the frames
      // already carry its result, and syncAttachedTaps recovers the outset from
      // them. It stays in the key audit so an older document still opens.
      return { kind: "tap", payload: el };
    }
    case "chartTimes": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      return {
        kind: "chartTimes",
        payload: {
          ...base,
          // Ids are uppercased on the way in, so the link has to be too.
          chart: str(p.chart).toUpperCase(),
          // Read exactly the way the chart reads its own times.
          timeLabelCount: clampTimeLabelCount(p.timeLabelCount),
          labelSize: num(p.labelSize, TIMELINE_DEFAULT_LABEL_SIZE),
          labelColorHex: str(p.labelColorHex, TIMELINE_DEFAULT_LABEL_HEX),
          hourCycle: parseHourCycle(p.hourCycle),
          minutes: parseMinuteStyle(p.minutes),
        },
      };
    }
    case "chartDots": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      const size = chartPointDotSize(p.size);
      return {
        kind: "chartDots",
        payload: {
          ...base,
          chart: str(p.chart).toUpperCase(),
          dots: chartDotsMode(p.dots),
          ...(size !== undefined ? { size } : {}),
          ...(typeof p.colorHex === "string" ? { colorHex: p.colorHex } : {}),
        },
      };
    }
    case "chartGrid": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      return {
        kind: "chartGrid",
        payload: {
          ...base,
          chart: str(p.chart).toUpperCase(),
          lines: chartGridLayerLines(p.lines),
          colorHex: chartGridColorHex(p.colorHex),
          thickness: chartGridThickness(p.thickness),
        },
      };
    }
    default:
      throw new ConfigParseError(`unknown element kind ${String(raw.kind)}`);
  }
}

function parseLayout(o: unknown): FamilyLayout {
  const l = isObject(o) ? o : {};
  const placements: Record<string, Placement> = {};
  if (isObject(l.placements)) {
    for (const [id, p] of Object.entries(l.placements)) {
      if (!isObject(p)) continue;
      const pl: Placement = { frame: parseFrame(p.frame), isHidden: p.isHidden === true };
      const size = optNum(p.size);
      if (size !== undefined) pl.size = size;
      placements[id.toUpperCase()] = pl;
    }
  }
  const layout: FamilyLayout = {
    placements,
    cornerBodyShape: l.cornerBodyShape === "circle" ? "circle" : "wedge",
    borderWidth: num(l.borderWidth, 2),
    rules: parseRules(l.rules),
  };
  if (isObject(l.bezelText)) layout.bezelText = parseValue(l.bezelText);
  if (l.bezelCountdown === true) layout.bezelCountdown = true;
  if (isObject(l.curvedText)) layout.curvedText = parseValue(l.curvedText);
  if (typeof l.curvedColorHex === "string") layout.curvedColorHex = l.curvedColorHex;
  if (isObject(l.bezelGauge)) {
    const g = l.bezelGauge;
    const gauge: BezelGauge = {
      value: isObject(g.value) ? parseValue(g.value) : literal("50"),
      minValue: num(g.minValue, 0),
      maxValue: num(g.maxValue, 100),
      colorHexes: Array.isArray(g.colorHexes) && g.colorHexes.length > 0
        ? g.colorHexes.filter((c): c is string => typeof c === "string")
        : ["#34C759", "#FFCC00", "#FF3B30"],
    };
    if (isObject(g.minLabel)) gauge.minLabel = parseValue(g.minLabel);
    if (isObject(g.maxLabel)) gauge.maxLabel = parseValue(g.maxLabel);
    layout.bezelGauge = gauge;
  }
  if (typeof l.backgroundColorHex === "string") layout.backgroundColorHex = l.backgroundColorHex;
  if (typeof l.borderColorHex === "string") layout.borderColorHex = l.borderColorHex;
  return layout;
}

function parsePerFamily(raw: unknown): Partial<Record<FamilyKind, FamilyLayout>> {
  const out: Partial<Record<FamilyKind, FamilyLayout>> = {};
  if (Array.isArray(raw)) {
    // Swift encodes [FamilyKind: FamilyLayout] as a flat alternating array.
    for (let i = 0; i + 1 < raw.length; i += 2) {
      const k = raw[i];
      if (typeof k === "string") out[k as FamilyKind] = parseLayout(raw[i + 1]);
    }
  } else if (isObject(raw)) {
    for (const [k, v] of Object.entries(raw)) out[k as FamilyKind] = parseLayout(v);
  }
  return out;
}

function parseInline(raw: J): InlineLayout {
  const out: InlineLayout = { value: isObject(raw.value) ? parseValue(raw.value) : literal("") };
  if (typeof raw.label === "string") out.label = raw.label;
  if (typeof raw.symbol === "string") out.symbol = raw.symbol;
  if (raw.countdown === true) out.countdown = true;
  return out;
}

function parseTapAction(raw: unknown): TapAction {
  if (!isObject(raw) || typeof raw.type !== "string") return { type: "none" };
  switch (raw.type) {
    case "none": case "refresh": case "openApp": case "openPage": case "openRoomPage":
    case "timerStartPause": case "timerCancel":
      return { type: raw.type };
    case "toggleEntity": case "runScene": case "runScript": case "addTodo": case "runHTTPAction":
      return { type: raw.type, ...parseEntityRef(raw) };
    case "callService": {
      // Every field is optional, so a document saved while the form was half
      // filled in still opens instead of reading as corrupt.
      const out: CallServiceAction = {
        type: "callService",
        serviceDomain: typeof raw.serviceDomain === "string" ? raw.serviceDomain : "",
        serviceName: typeof raw.serviceName === "string" ? raw.serviceName : "",
      };
      if (typeof raw.serviceDataJSON === "string" && raw.serviceDataJSON.trim() !== "") {
        out.serviceDataJSON = raw.serviceDataJSON;
      }
      // The target is optional here, so it is read only when it is really there;
      // `parseEntityRef` refuses a missing `entityId` on purpose everywhere else.
      if (typeof raw.entityId === "string" && raw.entityId !== "") out.target = parseEntityRef(raw);
      return out;
    }
    default:
      return { type: "none" };
  }
}

export function parseConfig(raw: unknown): CustomComplicationConfig {
  if (!isObject(raw)) throw new ConfigParseError("config must be an object");
  for (const key of ["id", "name", "slotIndex", "supportedFamilies", "perFamily", "tapAction"]) {
    if (!(key in raw)) throw new ConfigParseError(`${key} is required`);
  }
  const values = (Array.isArray(raw.values) ? raw.values : []).filter(isObject).map((v) => ({
    id: str(v.id).toUpperCase(),
    name: str(v.name),
    value: isObject(v.value) ? parseValue(v.value) : literal(""),
  }));
  const dataSources: DataSource[] = (Array.isArray(raw.dataSources) ? raw.dataSources : [])
    .filter(isObject)
    .map((d): DataSource | null => {
      if (d.kind === "template") return { kind: "template", value: str(d.value) };
      if (d.kind === "entity") return { kind: "entity", ...parseEntityRef(d) };
      return null;
    })
    .filter((d): d is DataSource => d !== null);
  const cfg: CustomComplicationConfig = {
    schemaVersion: num(raw.schemaVersion, 1),
    id: str(raw.id).toUpperCase(),
    name: str(raw.name, "Custom"),
    values,
    slotIndex: num(raw.slotIndex, 0),
    elements: (Array.isArray(raw.elements) ? raw.elements : []).map(parseElement),
    supportedFamilies: (Array.isArray(raw.supportedFamilies) ? raw.supportedFamilies : []).filter(
      (f): f is FamilyKind => typeof f === "string",
    ),
    perFamily: parsePerFamily(raw.perFamily),
    dataSources,
    tapAction: parseTapAction(raw.tapAction),
  };
  if (isObject(raw.inline)) cfg.inline = parseInline(raw.inline);
  const rm = optNum(raw.refreshMinutes);
  if (rm !== undefined) cfg.refreshMinutes = rm;
  if (typeof raw.openPageId === "string") cfg.openPageId = raw.openPageId;
  if (typeof raw.openPageName === "string") cfg.openPageName = raw.openPageName;
  if (typeof raw.showSuccessFlash === "boolean") cfg.showSuccessFlash = raw.showSuccessFlash;
  if (typeof raw.successFlashColorHex === "string") cfg.successFlashColorHex = raw.successFlashColorHex;
  if (Array.isArray(raw.groups)) {
    const groups = raw.groups.filter(isObject).filter((g) => typeof g.id === "string").map((g): LayerGroup => ({
      id: str(g.id).toUpperCase(),
      name: str(g.name, "Group"),
      locked: g.locked !== false,
    }));
    if (groups.length > 0) cfg.groups = groups;
  }
  migrateChartLabels(cfg, Array.isArray(raw.elements) ? raw.elements : []);
  pruneGroups(cfg);
  return cfg;
}

// ── chart numbers ─────────────────────────────────────────────────────────
// A chart's numbers are text layers whose value is a `chartStat` naming the
// chart. They live in the chart's layer group, so the Layers list shows them
// under the chart and a drag on the chart takes them along.

/** The chart layer a value reads, when it is a `chartStat` and the chart is
 * still in the document. */
export function chartOfValue(cfg: CustomComplicationConfig, value: Value | undefined): Extract<Element, { kind: "chart" }> | undefined {
  const k = value?.kind;
  if (!k || k.kind !== "chartStat") return undefined;
  const el = cfg.elements.find((e) => e.payload.id === k.layer);
  return el?.kind === "chart" ? el : undefined;
}

/** The text layers that print one chart's numbers, in document order. */
export function chartLabelsOf(cfg: CustomComplicationConfig, chartId: string): Extract<Element, { kind: "text" }>[] {
  return cfg.elements.filter((el): el is Extract<Element, { kind: "text" }> =>
    el.kind === "text" && el.payload.value.kind.kind === "chartStat" && el.payload.value.kind.layer === chartId);
}

/** What a chart's group is called when one is made for it: the entity's name
 * when the chart reads one, else plain "Chart". */
function chartGroupName(cfg: CustomComplicationConfig, chart: Element): string {
  const ref = valueEntity(cfg, primaryValue(chart))?.ref;
  return ref?.displayName || ref?.entityId || "Chart";
}

/** Put a layer into the chart's group, making the group when the chart has
 * none. The group starts unlocked: a number is added to be dragged into
 * place, and a locked group would drag the chart along with it. Selecting
 * the group row moves everything as one whenever that is wanted. */
function joinChartGroup(cfg: CustomComplicationConfig, chart: Element, memberId: string): void {
  const existing = groupOf(cfg, chart.payload.id);
  if (existing) {
    setGroup(cfg, memberId, existing.id);
    return;
  }
  const gid = createGroup(cfg, [chart.payload.id, memberId], chartGroupName(cfg, chart));
  const group = cfg.groups?.find((g) => g.id === gid);
  if (group) group.locked = false;
}

/** Where a new number sits, as a fraction of the chart's own frame: the ends of
 * the scale at the left edge, the newest reading at the right, the rest along
 * the top. A starting place rather than a rule; the author drags it from here. */
const CHART_LABEL_SEATS: Record<ChartStat, { x: number; y: number }> = {
  top: { x: 0, y: 0 },
  highest: { x: 0.35, y: 0 },
  average: { x: 0.65, y: 0 },
  latest: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  lowest: { x: 0.35, y: 1 },
  // The arrow reads as a suffix to the newest reading, so it seats beside it.
  trend: { x: 0.85, y: 0 },
  // The change and the total belong with the numbers along the top; the first
  // reading is the oldest, so it sits at the left where the series starts.
  delta: { x: 0.5, y: 0 },
  sum: { x: 0.2, y: 0 },
  first: { x: 0.65, y: 1 },
};

/** A frame for a number of `fontSize` points, `chars` glyphs wide, seated at a
 * corner or edge of `chart`'s frame in the rectangular design box and held
 * inside the face. */
function chartLabelFrame(chart: NormalizedFrame, seat: { x: number; y: number }, fontSize: number, chars: number): NormalizedFrame {
  const box = DESIGN_BOX.rectangular;
  const width = Math.min(1, (chars * fontSize * 0.62 + 4) / box.width);
  const height = Math.min(1, (fontSize * 1.3) / box.height);
  const x = chart.x + seat.x * chart.width - seat.x * width;
  const y = chart.y + seat.y * chart.height - seat.y * height;
  return {
    x: Math.max(0, Math.min(1 - width, x)),
    y: Math.max(0, Math.min(1 - height, y)),
    width,
    height,
    rotationDegrees: 0,
  };
}

/** Add a text layer that prints one of the chart's numbers, in the chart's
 * group, and return its id. The newest reading carries the entity's unit by
 * default ("119.6 V"), because that is the number a glance wants whole, and so
 * do the change and the total, which are quantities in their own right rather
 * than a reading off a plot that already says what it is. The trend is an
 * arrow, so it takes no unit whatever the format says. Undefined when `chartId`
 * is not a chart. */
export function addChartLabel(cfg: CustomComplicationConfig, chartId: string, stat: ChartStat): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  const fontSize = stat === "latest" ? 10 : 8;
  const value: Value = { kind: { kind: "chartStat", layer: chartId, stat } };
  if (stat === "latest" || stat === "delta" || stat === "sum") value.format = { useEntityUnit: true };
  el.payload.value = value;
  el.payload.fontSize = fontSize;
  el.payload.fontWeight = "medium";
  el.payload.colorSlot = { baseColorHex: stat === "latest" ? "#FFFFFF" : "#FFFFFF99" };
  // Width is a seat, not a rule: the arrow needs room for one glyph, a number
  // carrying a unit needs room for the unit.
  const chars = stat === "trend" ? 2 : value.format?.useEntityUnit ? 7 : 4;
  el.payload.frame = chartLabelFrame(chart.payload.frame, CHART_LABEL_SEATS[stat], fontSize, chars);
  // Directly above the chart in z-order, so the number sits on the plot.
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
}

// ── chart markers ─────────────────────────────────────────────────────────
// A marker is a layer with a `ChartAnchor` naming the chart, exactly as a
// number is a layer with a `chartStat` naming it. Both live in the chart's
// group, and both are listed and added from the chart's Extras card.

/** The SF Symbol a new marker starts as. The old built-in markers were a
 * triangle over the highest reading and a dot over the lowest, so a marker added
 * today starts looking like the one it replaces. An icon rather than a character
 * in a text layer: a font glyph draws differently in a browser and on the watch,
 * and the symbol picker offers every other shape without typing one. */
const CHART_MARKER_SYMBOLS: Record<ChartAnchorPoint, string> = {
  highest: "arrowtriangle.up.fill",
  lowest: "circle.fill",
  now: "arrowtriangle.down.fill",
  first: "circle.fill",
  latest: "circle.fill",
  threshold: "circle.fill",
  zero: "circle.fill",
};

/** The size a new marker starts at, in points. */
const CHART_MARKER_SIZE = 6;

/** The symbol for each glyph the panel used to start a text marker as, so a
 * marker made before icons becomes the same shape. */
const CHART_MARKER_GLYPH_SYMBOLS: Record<string, string> = {
  "▲": "arrowtriangle.up.fill",
  "▼": "arrowtriangle.down.fill",
  "●": "circle.fill",
  "◆": "diamond.fill",
};

/** The colour a new marker starts in: the chart's own highest and lowest
 * colours where the author set them, so a marker matches the bar it sits over,
 * and yellow over the highest and red over the lowest otherwise. */
function chartMarkerColor(chart: Extract<Element, { kind: "chart" }>, at: ChartAnchorPoint): string {
  // A new chart carries the default colours written out, so only a colour that
  // differs from the default counts as one the author chose.
  const chosen = (hex: string | undefined, def: string) => (hex !== undefined && hex !== def ? hex : undefined);
  if (at === "highest") return chosen(chart.payload.highColorHex, CHART_DEFAULT_HIGH_HEX) ?? "#FFD60A";
  if (at === "lowest") return chosen(chart.payload.lowColorHex, CHART_DEFAULT_LOW_HEX) ?? "#FF453A";
  return "#FFFFFF";
}

/** "Now" means nothing until the chart knows which reading is now. The hour is
 * the one obvious answer and what the Look toggle seeds too, so a now marker or
 * line added first lands on a reading instead of in the corner of the face. */
function seedChartNow(c: ChartElement): void {
  if (c.nowIndex !== undefined) return;
  c.nowIndex = { kind: { kind: "time", timeField: "hour" } };
  // A chart's now line is always a layer now, so a now it had to seed never
  // draws a line of its own on top of whatever layer asked for it.
  c.drawsNowLine = false;
}

/** The layers pinned to one chart, in document order. */
export function chartMarkersOf(cfg: CustomComplicationConfig, chartId: string): Element[] {
  return cfg.elements.filter((el) => el.payload.chartAnchor?.layer === chartId);
}

/** Add a marker over one of the chart's readings, in the chart's group, and
 * return its id. An icon layer, so the author picks any symbol for it and gets
 * size, colour and states with it. Undefined when `chartId` is not a chart. */
export function addChartMarker(
  cfg: CustomComplicationConfig,
  chartId: string,
  at: ChartAnchorPoint,
  place: ChartAnchorPlace = "above",
): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  if (at === "now") seedChartNow(chart.payload);
  const el = newElement("icon") as Extract<Element, { kind: "icon" }>;
  el.payload.symbol = literal(CHART_MARKER_SYMBOLS[at]);
  el.payload.size = CHART_MARKER_SIZE;
  el.payload.colorSlot = { baseColorHex: chartMarkerColor(chart, at) };
  // A box one glyph wide. The renderer pins its centre over the reading, so
  // only the size here matters; x and y are worked out every render.
  el.payload.frame = chartMarkerFrame(CHART_MARKER_SIZE);
  el.payload.chartAnchor = { layer: chartId, at, place };
  // Directly above the chart in z-order, so the marker sits on the plot.
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
}

/** Turn a text marker into an icon marker in place, keeping its id, so its tap,
 * its group, its anchor and its place in Layers all stay. The glyph picks the
 * symbol: ▲ becomes a filled up triangle, and a character with no match (an
 * emoji, say) takes the symbol a new marker over that reading starts as. States
 * carry over where an icon reads them; a state that set the text becomes one
 * that sets the icon when its text was a glyph with a match, and is dropped
 * otherwise, as are font weight changes. Does nothing to any other layer. */
export function chartMarkerToIcon(cfg: CustomComplicationConfig, id: string): void {
  const index = cfg.elements.findIndex((e) => e.payload.id === id);
  const old = cfg.elements[index];
  if (!old || old.kind !== "text" || old.payload.chartAnchor === undefined) return;
  const t = old.payload;
  const anchor = t.chartAnchor!;
  const symbolFor = (v: Value): string | undefined => {
    const text = literalPartText(v);
    return text === undefined ? undefined : CHART_MARKER_GLYPH_SYMBOLS[text.trim()];
  };
  const allowed = new Set(RULE_TARGET_PROPERTIES.icon);
  const changes = (list: StyleChange[]): StyleChange[] => list.flatMap((ch): StyleChange[] => {
    if (ch.kind === "setText") {
      const symbol = ch.value === undefined ? undefined : symbolFor(ch.value);
      return symbol === undefined ? [] : [{ kind: "setIcon", value: literal(symbol) }];
    }
    return allowed.has(STYLE_PROPERTY[ch.kind]) ? [ch] : [];
  });
  const rules = t.rules
    .filter((r) => r.partId === undefined)
    .map((r): Rule => ({
      ...r,
      cases: r.cases.map((c) => ({ ...c, then: changes(c.then) })),
      ...(r.otherwise !== undefined ? { otherwise: changes(r.otherwise) } : {}),
    }));
  const icon = newElement("icon") as Extract<Element, { kind: "icon" }>;
  icon.payload = {
    ...icon.payload,
    id: t.id,
    colorSlot: t.colorSlot,
    rules,
    frame: t.frame,
    isHidden: t.isHidden,
    ...(t.groupId !== undefined ? { groupId: t.groupId } : {}),
    chartAnchor: anchor,
    symbol: literal(symbolFor(t.value) ?? CHART_MARKER_SYMBOLS[anchor.at]),
    size: t.fontSize,
  };
  cfg.elements[index] = icon;
}

/** A box just big enough for one glyph of `fontSize` points, in the
 * rectangular design box. Position is the anchor's business. */
function chartMarkerFrame(fontSize: number): NormalizedFrame {
  const box = DESIGN_BOX.rectangular;
  return {
    x: 0,
    y: 0,
    width: Math.min(1, (fontSize * 1.2) / box.width),
    height: Math.min(1, (fontSize * 1.3) / box.height),
    rotationDegrees: 0,
  };
}

/** Whether this chart still draws its own end marks rather than carrying marker
 * layers. What the Extras card offers to convert. */
export function chartDrawsBuiltInMarkers(chart: Extract<Element, { kind: "chart" }>): boolean {
  const c = chart.payload;
  if (c.highlight === "none" || c.highlight === undefined) return false;
  const markers = chartEndMarkers(c);
  const marksHigh = c.highlight === "highest" || c.highlight === "both";
  const marksLow = c.highlight === "lowest" || c.highlight === "both";
  return (marksHigh && markers.high !== "none") || (marksLow && markers.low !== "none");
}

/** Turn a chart's built-in end marks into marker layers, and stop the chart
 * drawing its own.
 *
 * Until 2026-09-12 this was the only way to mark an end: `marker` chose one of
 * three looks for both ends, and `highMarker`/`lowMarker` overrode one end each.
 * That bought one shape from a list of three, at a size nobody could change, and
 * it cost every bar five points of height, because the mark sat in a band
 * reserved along the top of the plot whether or not a tall bar needed it.
 *
 * Deliberately not run when a document is opened. A conversion rewrites the
 * chart and shifts its marks from a drawn path to a glyph, and doing that to
 * every saved complication the moment someone opens the panel would change
 * faces nobody asked to change. The author presses the button. */
export function convertChartMarkers(cfg: CustomComplicationConfig, chartId: string): void {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return;
  const c = chart.payload;
  const markers = chartEndMarkers(c);
  // The highlight decides which ends were marked at all: a chart highlighting
  // only its highest never drew a low mark, whatever `marker` said.
  const marksHigh = c.highlight === "highest" || c.highlight === "both";
  const marksLow = c.highlight === "lowest" || c.highlight === "both";
  const wanted: [ChartAnchorPoint, ChartEndMarker][] = [];
  if (marksHigh && markers.high !== "none") wanted.push(["highest", markers.high]);
  if (marksLow && markers.low !== "none") wanted.push(["lowest", markers.low]);
  for (const [at, shape] of wanted) {
    const id = addChartMarker(cfg, chartId, at);
    const el = cfg.elements.find((e) => e.payload.id === id);
    // A dot where the chart drew a dot, a triangle where it drew a triangle,
    // whichever end each was on. The built-in triangle pointed up at both ends.
    if (el?.kind === "icon") el.payload.symbol = literal(shape === "triangle" ? "arrowtriangle.up.fill" : "circle.fill");
  }
  // The chart stops drawing its own, so the band along the top goes with it and
  // the bars get their height back.
  setChartEndMarkers(c, { high: "none", low: "none" });
}

/** The two lines a chart can draw across its plot rather than over one reading. */
export type ChartLine = "now" | "threshold";

export const CHART_LINES: readonly [ChartLine, string][] = [
  ["now", "Now line"],
  ["threshold", "Threshold line"],
];

/** Hand one of a chart's own lines to a layer, and return the layer's id.
 *
 * A line shape anchored `through`: the anchor settles where it sits and how long it
 * runs, and the author's frame keeps only the thickness of the box. It starts in
 * the colour the chart drew the line in, one point thick, so the face looks the
 * same the moment the button is pressed.
 *
 * The chart's own number stays (`nowIndex`, `thresholdValue`): the scale and the
 * layer both still read it. Only the chart's drawing stops. A chart without that
 * number yet gets the layer anyway, which follows nothing and stays where its
 * frame put it until the number is set. Undefined when `chartId` is not a chart. */
export function addChartLine(cfg: CustomComplicationConfig, chartId: string, line: ChartLine): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const c = chart.payload;
  if (line === "now") seedChartNow(c);
  const el = newElement("shape") as Extract<Element, { kind: "shape" }>;
  el.payload.kind = "line";
  el.payload.thickness = 1;
  el.payload.borderWidth = 0;
  el.payload.colorSlot = { baseColorHex: line === "now" ? c.nowColorHex : c.thresholdColorHex };
  el.payload.frame = chartLineFrame(c.frame, line);
  el.payload.chartAnchor = { layer: chartId, at: line, place: "through" };
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  if (line === "now") c.drawsNowLine = false;
  else c.drawsThreshold = false;
  return el.payload.id;
}

/** The chart's own frame, cut down to a box a few points thick across the line.
 * A line shape runs along the long side of its box, so a tall thin box stands up
 * and a wide flat one lies down. The anchor replaces the rest every render. */
function chartLineFrame(chart: NormalizedFrame, line: ChartLine): NormalizedFrame {
  const box = DESIGN_BOX.rectangular;
  const thick = 3;
  return line === "now"
    ? { ...chart, width: Math.min(chart.width, thick / box.width), rotationDegrees: 0 }
    : { ...chart, height: Math.min(chart.height, thick / box.height), rotationDegrees: 0 };
}

/** The `chartTimes` layers reading one chart, in document order. */
export function chartTimesOf(cfg: CustomComplicationConfig, chartId: string): Extract<Element, { kind: "chartTimes" }>[] {
  return cfg.elements.filter((el): el is Extract<Element, { kind: "chartTimes" }> =>
    el.kind === "chartTimes" && el.payload.chart === chartId);
}

/** Hand a chart's clock times to a layer of their own, and return its id.
 *
 * The layer copies the chart's label keys, so the face reads the same the moment
 * the button is pressed, and sits in the chart's group directly above it in
 * z-order. Its frame is the chart's width, one line of `labelSize` tall, just
 * under the chart (over it when the chart printed its times above), held inside
 * the face. The chart stops drawing its own row and gets that height back.
 * Undefined when `chartId` is not a chart. */
export function convertChartTimes(cfg: CustomComplicationConfig, chartId: string): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const c = chart.payload;
  const el = newElement("chartTimes") as Extract<Element, { kind: "chartTimes" }>;
  el.payload.chart = chartId;
  // A chart that never printed its times has a count of 0, and a layer of no
  // times would look like a broken switch.
  el.payload.timeLabelCount = c.timeLabelCount > 0 ? clampTimeLabelCount(c.timeLabelCount) : TIMELINE_NEW_LABEL_COUNT;
  el.payload.labelSize = c.labelSize;
  el.payload.labelColorHex = c.labelColorHex;
  el.payload.hourCycle = c.hourCycle;
  el.payload.minutes = c.minutes;
  el.payload.frame = chartTimesFrame(c.frame, c.labelSize, c.labelsAbove);
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  c.drawsTimeLabels = false;
  return el.payload.id;
}

/** The `chartDots` layers on one chart, in document order. */
export function chartDotsOf(cfg: CustomComplicationConfig, chartId: string): Extract<Element, { kind: "chartDots" }>[] {
  return cfg.elements.filter((el): el is Extract<Element, { kind: "chartDots" }> =>
    el.kind === "chartDots" && el.payload.chart === chartId);
}

/** The `chartGrid` layers behind one chart, in document order. */
export function chartGridsOf(cfg: CustomComplicationConfig, chartId: string): Extract<Element, { kind: "chartGrid" }>[] {
  return cfg.elements.filter((el): el is Extract<Element, { kind: "chartGrid" }> =>
    el.kind === "chartGrid" && el.payload.chart === chartId);
}

/** The line shapes anchored at a chart's zero, in document order. */
export function chartZeroLinesOf(cfg: CustomComplicationConfig, chartId: string): Element[] {
  return chartMarkersOf(cfg, chartId).filter((m) => m.payload.chartAnchor?.at === "zero");
}

/** Add a dot on each of a chart's readings, as a layer directly above the chart
 * in its group, and return its id. Its frame is the chart's, though it always
 * draws in the chart's box. Auto, unless the chart still carries the one-day
 * `pointDots: "all"`. Undefined when `chartId` is not a chart. */
export function addChartDots(cfg: CustomComplicationConfig, chartId: string): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const el = newElement("chartDots") as Extract<Element, { kind: "chartDots" }>;
  el.payload.chart = chartId;
  el.payload.dots = chart.payload.pointDots === "all" ? "all" : "auto";
  el.payload.frame = { ...chart.payload.frame };
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
}

/** Add grid lines to a chart, as a layer directly below the chart in its group,
 * so the lines sit behind the series, and return its id. Undefined when
 * `chartId` is not a chart. */
export function addChartGrid(cfg: CustomComplicationConfig, chartId: string): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const el = newElement("chartGrid") as Extract<Element, { kind: "chartGrid" }>;
  el.payload.chart = chartId;
  el.payload.frame = { ...chart.payload.frame };
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
}

/** The colour a new line at zero starts in: white at 40 %. */
export const CHART_ZERO_LINE_HEX = "#FFFFFF66";

/** Add a line where zero falls on a chart, and return its id. A line shape
 * anchored `through` at `zero`, one point thick, directly above the chart in its
 * group. It draws only while zero is strictly inside the chart's range.
 * Undefined when `chartId` is not a chart. */
export function addChartZeroLine(cfg: CustomComplicationConfig, chartId: string): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const el = newElement("shape") as Extract<Element, { kind: "shape" }>;
  el.payload.kind = "line";
  el.payload.thickness = 1;
  el.payload.borderWidth = 0;
  el.payload.colorSlot = { baseColorHex: CHART_ZERO_LINE_HEX };
  el.payload.frame = chartLineFrame(chart.payload.frame, "threshold");
  el.payload.chartAnchor = { layer: chartId, at: "zero", place: "through" };
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
}

/** Turn a chart's threshold on at `value`, or off with undefined.
 *
 * On, the chart keeps the number (the scale stretches to it) and a line layer
 * draws it, added unless one is already anchored there. Off, the number goes and
 * so does every layer anchored to it, since they would follow nothing. */
export function setChartThreshold(cfg: CustomComplicationConfig, chartId: string, value: number | undefined): void {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return;
  const c = chart.payload;
  if (value === undefined) {
    delete c.thresholdValue;
    delete c.drawsThreshold;
    for (const m of chartMarkersOf(cfg, chartId)) if (m.payload.chartAnchor?.at === "threshold") removeElement(cfg, m.payload.id);
    return;
  }
  c.thresholdValue = value;
  c.drawsThreshold = false;
  if (!chartMarkersOf(cfg, chartId).some((m) => m.payload.chartAnchor?.at === "threshold")) addChartLine(cfg, chartId, "threshold");
}

/** Turn a chart's "now" on or off, the same way as its threshold: on seeds the
 * hour and adds a now line layer unless something already follows now; off drops
 * the number and every layer anchored to it. */
export function setChartNow(cfg: CustomComplicationConfig, chartId: string, on: boolean): void {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return;
  const c = chart.payload;
  if (!on) {
    delete c.nowIndex;
    delete c.drawsNowLine;
    for (const m of chartMarkersOf(cfg, chartId)) if (m.payload.chartAnchor?.at === "now") removeElement(cfg, m.payload.id);
    return;
  }
  seedChartNow(c);
  c.drawsNowLine = false;
  if (!chartMarkersOf(cfg, chartId).some((m) => m.payload.chartAnchor?.at === "now")) addChartLine(cfg, chartId, "now");
}

/**
 * Hand every mark a chart still draws itself to layers: its highlighted ends,
 * its threshold and now lines, and its clock times.
 *
 * Decided 2026-09-12: those are always layers. The panel has no controls for a
 * chart drawing its own any more, so a document that still does is converted when
 * it is opened, before the draft takes its baseline, and the change rides along
 * with the next save. Each conversion copies what the chart drew (colour, shape,
 * count, clock), so the face reads the same.
 *
 * A highlight that only tinted its reading, with no marker, becomes the marker a
 * new one starts as, in the highlight's colour. That is the one visible change.
 */
export function liftChartOwnMarks(cfg: CustomComplicationConfig): void {
  const charts = cfg.elements.filter((el): el is Extract<Element, { kind: "chart" }> => el.kind === "chart");
  for (const chart of charts) {
    const c = chart.payload;
    const before = new Set(cfg.elements.map((e) => e.payload.id));
    // Opened documents are in canonical form: the chart's real frame is its one
    // placement, and the frame on the payload can be stale. The helpers below
    // size their layers from the payload, so lend it the placement for the length
    // of the conversion, then seat every new layer on the chart's own shape.
    const seat = DRAWABLE_FAMILIES.find((f) => cfg.perFamily[f]?.placements[c.id] !== undefined);
    const ownFrame = c.frame;
    const placed = seat === undefined ? undefined : cfg.perFamily[seat]!.placements[c.id]!;
    if (placed) c.frame = { ...placed.frame };
    liftOneChart(cfg, c);
    c.frame = ownFrame;
    if (seat === undefined || placed === undefined) continue;
    for (const el of cfg.elements) {
      if (before.has(el.payload.id)) continue;
      cfg.perFamily[seat]!.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: placed.isHidden };
      el.payload.isHidden = true;
    }
  }
}

function liftOneChart(cfg: CustomComplicationConfig, c: ChartElement): void {
  {
    if (c.highlight !== undefined && c.highlight !== "none") {
      const markers = chartEndMarkers(c);
      const ends: [ChartAnchorPoint, ChartEndMarker][] = [];
      if (c.highlight === "highest" || c.highlight === "both") ends.push(["highest", markers.high]);
      if (c.highlight === "lowest" || c.highlight === "both") ends.push(["lowest", markers.low]);
      for (const [at, shape] of ends) {
        const id = addChartMarker(cfg, c.id, at);
        const el = cfg.elements.find((e) => e.payload.id === id);
        if (el?.kind === "icon" && shape !== "none") {
          el.payload.symbol = literal(shape === "triangle" ? "arrowtriangle.up.fill" : "circle.fill");
        }
      }
      setChartEndMarkers(c, { high: "none", low: "none" });
      c.highlight = "none";
    }
    if (c.thresholdValue !== undefined && c.drawsThreshold !== false) addChartLine(cfg, c.id, "threshold");
    if (c.nowIndex !== undefined && c.drawsNowLine !== false) addChartLine(cfg, c.id, "now");
    if (c.drawsTimeLabels !== false && chartShowsTimeLabels(c) && c.timeLabelCount > 0) convertChartTimes(cfg, c.id);
    // The dots, grid and line at zero, which were chart settings for one day
    // (2026-09-12) before they became layers too.
    const pointDots = chartPointDots(c.pointDots);
    if (pointDots !== "none") {
      const id = addChartDots(cfg, c.id);
      const el = cfg.elements.find((e) => e.payload.id === id);
      if (el?.kind === "chartDots") {
        el.payload.dots = pointDots;
        const size = chartPointDotSize(c.pointDotSize);
        if (size !== undefined) el.payload.size = size;
        if (typeof c.pointDotColorHex === "string") el.payload.colorHex = c.pointDotColorHex;
      }
    }
    const gridLines = chartGridLines(c.gridLines);
    if (gridLines > 0) {
      const id = addChartGrid(cfg, c.id);
      const el = cfg.elements.find((e) => e.payload.id === id);
      if (el?.kind === "chartGrid") {
        el.payload.lines = gridLines;
        el.payload.colorHex = chartGridColorHex(c.gridColorHex);
      }
    }
    if (c.zeroLine === true) {
      const id = addChartZeroLine(cfg, c.id);
      const el = cfg.elements.find((e) => e.payload.id === id);
      // The chart drew its zero line in the grid colour, so the layer does too.
      if (el?.kind === "shape") el.payload.colorSlot = { baseColorHex: chartGridColorHex(c.gridColorHex) };
    }
    delete c.pointDots;
    delete c.pointDotSize;
    delete c.pointDotColorHex;
    delete c.gridLines;
    delete c.gridColorHex;
    delete c.zeroLine;
  }
}

/** One line of `labelSize` points across the chart's width, below it or above
 * it, in the rectangular design box and held inside the face. */
function chartTimesFrame(chart: NormalizedFrame, labelSize: number, above: boolean): NormalizedFrame {
  const box = DESIGN_BOX.rectangular;
  const size = Math.max(TIMELINE_MIN_LABEL_SIZE, Math.min(TIMELINE_MAX_LABEL_SIZE, labelSize));
  const height = Math.min(1, (size * 1.2) / box.height);
  const width = Math.min(1, Math.max(0, chart.width));
  const y = above ? chart.y - height : chart.y + chart.height;
  return {
    x: Math.max(0, Math.min(1 - width, chart.x)),
    y: Math.max(0, Math.min(1 - height, y)),
    width,
    height,
    rotationDegrees: 0,
  };
}

/** Read the first cut of a chart's built-in numbers (2026-09-05) forward into
 * text layers.
 *
 * That cut printed the top and bottom of the scale beside the plot and the
 * newest reading at its right edge, each with a size, a colour and an
 * optional plate, from keys on the chart itself. A document saved that day
 * opens with the same numbers as text layers in the chart's group: the plate
 * becomes a capsule shape under the text. The chart's keys are dropped on the
 * next save; the watch never read them. */
function migrateChartLabels(cfg: CustomComplicationConfig, rawElements: unknown[]): void {
  for (const raw of rawElements) {
    if (!isObject(raw) || raw.kind !== "chart" || !isObject(raw.payload)) continue;
    const p = raw.payload;
    const chartId = str(p.id).toUpperCase();
    const chart = cfg.elements.find((el) => el.payload.id === chartId);
    if (!chart || chart.kind !== "chart") continue;
    const inherited = str(p.scaleLabelColorHex, "#FFFFFF99");
    const style = (raw: unknown) => {
      const o = isObject(raw) ? raw : {};
      return {
        fontSize: num(o.fontSize, 8),
        colorHex: str(o.colorHex, inherited),
        pillColorHex: typeof o.pillColorHex === "string" ? o.pillColorHex : undefined,
      };
    };
    const wanted: [ChartStat, ReturnType<typeof style>][] = [];
    const scale = optStr(p.scaleLabels);
    if (scale === "top" || scale === "range") wanted.push(["top", style(p.topLabelStyle)]);
    if (scale === "range") wanted.push(["bottom", style(p.bottomLabelStyle)]);
    const latest = optStr(p.latestLabel);
    if (latest === "corner" || latest === "end") wanted.push(["latest", style(p.latestLabelStyle)]);
    if (wanted.length === 0) continue;

    let at = cfg.elements.findIndex((el) => el.payload.id === chartId) + 1;
    for (const [stat, s] of wanted) {
      const frame = chartLabelFrame(chart.payload.frame, CHART_LABEL_SEATS[stat], s.fontSize, stat === "latest" ? 5 : 4);
      const added: Element[] = [];
      if (s.pillColorHex !== undefined) {
        const pill = newElement("shape") as Extract<Element, { kind: "shape" }>;
        pill.payload.kind = "capsule";
        pill.payload.colorSlot = { baseColorHex: s.pillColorHex };
        pill.payload.frame = { ...frame };
        added.push(pill);
      }
      const text = newElement("text") as Extract<Element, { kind: "text" }>;
      text.payload.value = { kind: { kind: "chartStat", layer: chartId, stat } };
      text.payload.fontSize = s.fontSize;
      text.payload.fontWeight = "medium";
      text.payload.colorSlot = { baseColorHex: s.colorHex };
      text.payload.frame = frame;
      added.push(text);
      cfg.elements.splice(at, 0, ...added);
      at += added.length;
      for (const el of added) joinChartGroup(cfg, chart, el.payload.id);
    }
  }
}

// ── encoding ──────────────────────────────────────────────────────────────
// Writes exactly what the Swift synthesised/custom encoders write
// (docs/custom_complication_schema_v4.md §0-§5, §8): nested Value with
// `format` omitted when empty, perFamily as the alternating array, Placement
// with `isHidden` only when true and `size` only when set, FamilyLayout with
// `placements`/`rules` only when non-empty and optionals only when present.

function encNum(n: number): number | string {
  if (Number.isNaN(n)) return "nan";
  if (n === Infinity) return "+inf";
  if (n === -Infinity) return "-inf";
  return n;
}

function encodeEntityRef(r: EntityRef): J {
  const o: J = { entityId: r.entityId, displayName: r.displayName, domain: r.domain };
  if (r.iconName !== undefined) o.iconName = r.iconName;
  return o;
}

function encodeFormat(f: ValueFormat): J {
  const o: J = {};
  if (f.decimals !== undefined) o.decimals = encNum(f.decimals);
  if (f.multiply !== undefined) o.multiply = encNum(f.multiply);
  if (f.offset !== undefined) o.offset = encNum(f.offset);
  if (f.prefix) o.prefix = f.prefix;
  if (f.suffix) o.suffix = f.suffix;
  if (f.useEntityUnit) o.useEntityUnit = true;
  if (f.relativeTime) o.relativeTime = true;
  if (f.duration) o.duration = true;
  if (f.textCase !== undefined) o.textCase = f.textCase;
  return o;
}

function encodeAggregate(a: AggregateSpec): J {
  const scope: J =
    a.scope.kind === "entities"
      ? { kind: "entities", entities: a.scope.entities.map(encodeEntityRef) }
      : { kind: "filter", domains: a.scope.domains, areaIds: a.scope.areaIds, labelIds: a.scope.labelIds, floorIds: a.scope.floorIds };
  const o: J = { function: a.function, scope };
  if (a.stateFilter) {
    o.stateFilter = a.stateFilter.kind === "equals" || a.stateFilter.kind === "notEquals"
      ? { kind: a.stateFilter.kind, value: a.stateFilter.value }
      : { kind: a.stateFilter.kind };
  }
  if (a.attribute !== undefined) o.attribute = a.attribute;
  return o;
}

function encodeValueKind(k: ValueKind): J {
  switch (k.kind) {
    case "literal": return { kind: "literal", value: k.value };
    case "entityState": return { kind: "entityState", ...encodeEntityRef(k) };
    case "entityAttribute": return { kind: "entityAttribute", ...encodeEntityRef(k), attribute: k.attribute };
    case "entityAge": return { kind: "entityAge", ...encodeEntityRef(k) };
    case "aggregate": return { kind: "aggregate", aggregate: encodeAggregate(k.aggregate) };
    case "time": return { kind: "time", timeField: k.timeField };
    case "dataAge": return { kind: "dataAge" };
    case "jinja": return { kind: "jinja", value: k.value };
    case "named": return { kind: "named", id: k.id };
    case "chartStat": return { kind: "chartStat", layer: k.layer, stat: k.stat };
  }
}

export function encodeValue(v: Value): J {
  const o: J = { kind: encodeValueKind(v.kind) };
  if (!formatIsEmpty(v.format)) o.format = encodeFormat(v.format!);
  return o;
}

function encodeFrame(f: NormalizedFrame): J {
  return { x: encNum(f.x), y: encNum(f.y), width: encNum(f.width), height: encNum(f.height), rotationDegrees: encNum(f.rotationDegrees) };
}

function encodeComparison(c: Comparison): J {
  const o: J = { kind: c.kind };
  switch (c.kind) {
    case "equals": case "notEquals": case "greaterThan": case "greaterOrEqual":
    case "lessThan": case "lessOrEqual": case "contains": case "startsWith": case "endsWith":
      o.value = encodeValue(c.value ?? literal(""));
      break;
    case "between": case "timeBetween":
      o.value = encodeValue(c.value ?? literal(""));
      o.upper = encodeValue(c.upper ?? literal(""));
      break;
    case "matchesRegex":
      o.pattern = c.pattern ?? "";
      break;
    case "isOneOf":
      o.options = c.options ?? [];
      break;
    default:
      break;
  }
  return o;
}

function encodeStyleChange(c: StyleChange): J {
  const o: J = { kind: c.kind };
  switch (c.kind) {
    case "setColor": case "setText": case "setIcon": case "setGaugeValue":
    case "setBorderColor": case "setBackgroundColor":
      o.value = encodeValue(c.value ?? literal(""));
      break;
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin":
    case "setGaugeMax": case "setBorderWidth":
      o.number = encNum(c.number ?? 0);
      break;
    case "setFontWeight":
      o.weight = c.weight ?? "regular";
      break;
    default:
      break;
  }
  return o;
}

export function encodeRules(rules: Rule[]): J[] {
  return rules.map((r) => {
    const o: J = {
      id: r.id,
      cases: r.cases.map((c) => ({
        id: c.id,
        when: {
          join: c.when.join,
          tests: c.when.tests.map((t) => ({ id: t.id, value: encodeValue(t.value), comparison: encodeComparison(t.comparison) })),
        },
        then: c.then.map(encodeStyleChange),
      })),
    };
    if (r.otherwise) o.otherwise = r.otherwise.map(encodeStyleChange);
    // Last, and only when set, so every rule written before parts existed is
    // byte for byte what it was.
    if (r.partId !== undefined) o.partId = r.partId;
    return o;
  });
}

/** One part of a rich text layer, in the app encoder's key order, each style key
 * only when set, so a part round-trips exactly as it was written. */
function encodeTextPart(p: TextPart): J {
  const o: J = { id: p.id, value: encodeValue(p.value) };
  if (p.colorHex !== undefined) o.colorHex = p.colorHex;
  if (p.fontWeight !== undefined) o.fontWeight = p.fontWeight;
  if (p.fontSize !== undefined) o.fontSize = encNum(p.fontSize);
  if (p.coloring !== undefined && p.coloring !== "uniform") o.coloring = p.coloring;
  if (p.bands !== undefined && p.bands.length > 0) o.bands = p.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex }));
  if (p.bandAboveColorHex !== undefined && p.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) o.bandAboveColorHex = p.bandAboveColorHex;
  return o;
}

function encodeElement(el: Element): J {
  const o = encodeElementKind(el);
  if (el.payload.groupId !== undefined) (o.payload as J).groupId = el.payload.groupId;
  return o;
}

function encodeElementKind(el: Element): J {
  const base = (p: ElementBase): J => ({
    id: p.id,
    colorSlot: { baseColorHex: p.colorSlot.baseColorHex },
    rules: encodeRules(p.rules),
    frame: encodeFrame(p.frame),
    isHidden: p.isHidden,
  });
  switch (el.kind) {
    case "text": {
      const o: J = { ...base(el.payload), value: encodeValue(el.payload.value), fontSize: encNum(el.payload.fontSize), fontWeight: el.payload.fontWeight };
      if (el.payload.countdown === true) o.countdown = true;
      if (el.payload.monospacedDigits === true) o.monospacedDigits = true;
      if (el.payload.lineLimit === 2) o.lineLimit = 2;
      if (el.payload.alignment !== undefined && el.payload.alignment !== "center") o.alignment = el.payload.alignment;
      // After `alignment`, in the key table's order, and only when away from the
      // default, so a text layer without colour by value writes what it always did.
      const t = el.payload;
      if (t.coloring !== undefined && t.coloring !== "uniform") o.coloring = t.coloring;
      if (t.bands !== undefined && t.bands.length > 0) o.bands = t.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex }));
      if (t.bandAboveColorHex !== undefined && t.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) o.bandAboveColorHex = t.bandAboveColorHex;
      if (t.highlight !== undefined && t.highlight !== "none") o.highlight = t.highlight;
      if (t.highColorHex !== undefined && t.highColorHex !== CHART_DEFAULT_HIGH_HEX) o.highColorHex = t.highColorHex;
      if (t.lowColorHex !== undefined && t.lowColorHex !== CHART_DEFAULT_LOW_HEX) o.lowColorHex = t.lowColorHex;
      // After `lowColorHex`, and only with at least one part. The value is
      // written from the parts rather than trusted from the draft, so what an
      // older watch shows can never go stale against them.
      if (t.parts !== undefined && t.parts.length > 0) {
        o.parts = t.parts.map(encodeTextPart);
        if (textUsesParts(t)) o.value = encodeValue(richTextFallback(t.parts));
      }
      writeChartAnchor(t, o);
      return { kind: "text", payload: o };
    }
    case "icon": {
      const o: J = { ...base(el.payload), symbol: encodeValue(el.payload.symbol) };
      // Between `symbol` and `size`, matching the app's encoder, and only when
      // set: an SF Symbol layer writes the bytes it always did.
      if (el.payload.path !== undefined && el.payload.path !== "") o.path = el.payload.path;
      o.size = encNum(el.payload.size);
      writeChartAnchor(el.payload, o);
      return { kind: "icon", payload: o };
    }
    case "gauge": {
      const g = el.payload;
      const o: J = {
        ...base(g),
        value: encodeValue(g.value),
        minValue: encNum(g.minValue),
        maxValue: encNum(g.maxValue),
        style: g.style,
        lineWidth: encNum(g.lineWidth),
        trackColorHex: g.trackColorHex,
      };
      // Same order and same "only when it differs" rule as the app's encoder, so
      // a gauge authored before the colour table writes the bytes it always did.
      if (g.coloring !== "uniform") o.coloring = g.coloring;
      if (g.bands.length > 0) o.bands = g.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex }));
      if (g.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) o.bandAboveColorHex = g.bandAboveColorHex;
      if (g.thresholdValue !== undefined) o.thresholdValue = encNum(g.thresholdValue);
      if (g.thresholdColorHex !== GAUGE_DEFAULT_THRESHOLD_HEX) o.thresholdColorHex = g.thresholdColorHex;
      if (g.total !== undefined) o.total = encodeValue(g.total);
      if (g.minSource !== undefined) o.minSource = encodeValue(g.minSource);
      if (g.maxSource !== undefined) o.maxSource = encodeValue(g.maxSource);
      return { kind: "gauge", payload: o };
    }
    case "chart": {
      const c = el.payload;
      const o: J = {
        ...base(c),
        value: encodeValue(c.value),
        historyMinutes: Math.max(0, Math.round(c.historyMinutes)),
        historyPoints: Math.round(c.historyPoints),
        style: c.style,
        limit: Math.max(0, Math.round(c.limit)),
        takeFromEnd: c.takeFromEnd,
        scale: c.scale,
        minValue: encNum(c.minValue),
        maxValue: encNum(c.maxValue),
        baseline: c.baseline,
        barGap: encNum(c.barGap),
        lineWidth: encNum(c.lineWidth),
        highlight: c.highlight,
        highColorHex: c.highColorHex,
        lowColorHex: c.lowColorHex,
        marker: chartLegacyMarker(chartEndMarkers(c)),
        coloring: c.coloring,
        bands: c.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex })),
        bandAboveColorHex: c.bandAboveColorHex,
        fillBands: c.fillBands,
      };
      // Where the past comes from, and how a statistics row is read. All three
      // omitted at their defaults, so a history chart is byte for byte what it
      // always was, and a statistics chart writes only what it actually asks for.
      if (c.source !== CHART_DEFAULT_SOURCE) o.source = c.source;
      if (c.statPeriod !== CHART_DEFAULT_STAT_PERIOD) o.statPeriod = c.statPeriod;
      if (c.statType !== CHART_DEFAULT_STAT_TYPE) o.statType = c.statType;
      // The marks a chart can add over its plot, all omitted at their defaults so a
      // document that draws neither line is byte for byte what it always was. Same
      // order and same rule as the app's encoder.
      if (c.thresholdValue !== undefined) o.thresholdValue = encNum(c.thresholdValue);
      if (c.thresholdColorHex !== CHART_DEFAULT_THRESHOLD_HEX) o.thresholdColorHex = c.thresholdColorHex;
      if (c.nowIndex !== undefined) o.nowIndex = encodeValue(c.nowIndex);
      if (c.nowColorHex !== CHART_DEFAULT_NOW_HEX) o.nowColorHex = c.nowColorHex;
      if (c.drawsThreshold === false) o.drawsThreshold = false;
      if (c.drawsNowLine === false) o.drawsNowLine = false;
      if (c.drawsTimeLabels === false) o.drawsTimeLabels = false;
      if (c.scaleFrom !== undefined) o.scaleFrom = c.scaleFrom;
      // The clock times, in the order and on the rule the app's encoder uses, so
      // a chart drawing none writes exactly the bytes it always did.
      if (c.labelSize !== TIMELINE_DEFAULT_LABEL_SIZE) o.labelSize = encNum(c.labelSize);
      if (c.labelColorHex !== TIMELINE_DEFAULT_LABEL_HEX) o.labelColorHex = c.labelColorHex;
      if (c.labelsAbove) o.labelsAbove = true;
      if (c.timeLabelCount !== TIMELINE_DEFAULT_LABEL_COUNT) {
        o.timeLabelCount = clampTimeLabelCount(c.timeLabelCount);
      }
      if (c.hourCycle !== TIMELINE_DEFAULT_HOUR_CYCLE) o.hourCycle = c.hourCycle;
      if (c.minutes !== TIMELINE_DEFAULT_MINUTE_STYLE) o.minutes = c.minutes;
      // Each end's own marker, written only when `marker` above cannot say the
      // pair by itself, so every chart the one setting could draw writes the
      // bytes it always did.
      const markers = chartEndMarkers(c);
      if (!chartMarkersAreLegacy(markers)) {
        o.highMarker = markers.high;
        o.lowMarker = markers.low;
      }
      // The chart looks keys, each omitted at its default, in the order both
      // encoders share: curve, fillStyle, fillColorHex, barRadius, barCorners,
      // smoothing, gaps.
      const curve = c.curve ?? "straight";
      if (curve !== "straight") o.curve = curve;
      const fillStyle = chartFillStyle(c.fillStyle);
      if (fillStyle !== "flat") o.fillStyle = fillStyle;
      if (c.fillColorHex !== undefined) o.fillColorHex = c.fillColorHex;
      const barRadius = chartBarRadius(c.barRadius);
      if (barRadius !== CHART_DEFAULT_BAR_RADIUS) o.barRadius = encNum(barRadius);
      const barCorners = chartBarCorners(c.barCorners);
      if (barCorners !== "all") o.barCorners = barCorners;
      // The dots, grid and zero line keys are never written: those are layers.
      const smoothing = chartSmoothing(c.smoothing);
      if (smoothing !== undefined) o.smoothing = smoothing;
      if (c.gaps === true) o.gaps = true;
      return { kind: "chart", payload: o };
    }
    case "timeline": {
      const t = el.payload;
      const o: J = {
        id: t.id,
        rules: encodeRules(t.rules),
        frame: encodeFrame(t.frame),
        isHidden: t.isHidden,
        value: encodeValue(t.value),
      };
      // Same order and same "only when it differs" rule as the app's encoder, so
      // a timeline left as it was created writes the shortest payload it can.
      if (t.historyMinutes !== TIMELINE_DEFAULT_MINUTES) o.historyMinutes = Math.max(1, Math.round(t.historyMinutes));
      if (t.bands.length > 0) o.bands = t.bands.map((b) => ({ id: b.id, match: b.match, colorHex: b.colorHex }));
      if (t.otherColorHex !== TIMELINE_DEFAULT_OTHER_HEX) o.otherColorHex = t.otherColorHex;
      if (t.gap !== 0) o.gap = encNum(t.gap);
      if (t.cornerRadius !== TIMELINE_DEFAULT_CORNER_RADIUS) o.cornerRadius = encNum(t.cornerRadius);
      // `timeLabels`, the word this key started as, is never written again: a
      // document saved that evening still reads, and everything written since
      // carries the count instead.
      if (t.labelSize !== TIMELINE_DEFAULT_LABEL_SIZE) o.labelSize = encNum(t.labelSize);
      if (t.labelColorHex !== TIMELINE_DEFAULT_LABEL_HEX) o.labelColorHex = t.labelColorHex;
      if (t.labelsAbove) o.labelsAbove = true;
      if (t.timeLabelCount !== TIMELINE_DEFAULT_LABEL_COUNT) {
        o.timeLabelCount = Math.max(0, Math.min(TIMELINE_MAX_LABEL_COUNT, Math.round(t.timeLabelCount)));
      }
      if (t.hourCycle !== TIMELINE_DEFAULT_HOUR_CYCLE) o.hourCycle = t.hourCycle;
      if (t.minutes !== TIMELINE_DEFAULT_MINUTE_STYLE) o.minutes = t.minutes;
      return { kind: "timeline", payload: o };
    }
    case "shape": {
      const o: J = { ...base(el.payload), kind: el.payload.kind, cornerRadius: encNum(el.payload.cornerRadius), borderWidth: encNum(el.payload.borderWidth) };
      if (el.payload.borderColorHex !== undefined) o.borderColorHex = el.payload.borderColorHex;
      // Same "only when it differs" rule as the app's encoder, so a shape that is
      // not a line writes exactly the bytes it always did.
      if (el.payload.thickness !== 1) o.thickness = encNum(el.payload.thickness);
      writeChartAnchor(el.payload, o);
      return { kind: "shape", payload: o };
    }
    case "image": {
      const p = el.payload;
      const o: J = {
        id: p.id,
        entity: encodeEntityRef(p.entity),
        rules: encodeRules(p.rules),
        frame: encodeFrame(p.frame),
        isHidden: p.isHidden,
      };
      if (p.source !== "camera") o.source = p.source;
      if (p.timestamp === true) o.timestamp = true;
      // Same order and same "only when it differs" rule as the app's encoder,
      // so the two write the same bytes for the same document.
      if (p.contentMode !== "fill") o.contentMode = p.contentMode;
      if (p.zoom !== 1) o.zoom = encNum(p.zoom);
      if (p.panX !== 0) o.panX = encNum(p.panX);
      if (p.panY !== 0) o.panY = encNum(p.panY);
      if (p.cornerRadius !== IMAGE_DEFAULT_CORNER_RADIUS) o.cornerRadius = encNum(p.cornerRadius);
      // A free timestamp still writes the corner it is nearest, so a watch that
      // predates the two coordinates puts the chip near the mark rather than
      // defaulting to the top left. That copy is derived, never authored, so it
      // overrides whatever the corner field happens to hold.
      const free = hasFreeTimestamp(p);
      const corner = free ? nearestTimestampCorner(p.timestampX!, p.timestampY!) : p.timestampCorner;
      if (corner !== "topLeading") o.timestampCorner = corner;
      if (p.timestampSize !== IMAGE_DEFAULT_TIMESTAMP_SIZE) o.timestampSize = encNum(p.timestampSize);
      if (free) {
        o.timestampX = encNum(p.timestampX!);
        o.timestampY = encNum(p.timestampY!);
      }
      writeChartAnchor(p, o);
      return { kind: "image", payload: o };
    }
    case "tap": {
      const p = el.payload;
      const o: J = { id: p.id, action: encodeTapAction(p.action) };
      if (p.openPageId !== undefined) o.openPageId = p.openPageId;
      if (p.openPageName !== undefined) o.openPageName = p.openPageName;
      if (p.attachedTo !== undefined) o.attachedTo = p.attachedTo;
      o.rules = encodeRules(p.rules);
      o.frame = encodeFrame(p.frame);
      o.isHidden = p.isHidden;
      return { kind: "tap", payload: o };
    }
    case "chartTimes": {
      const t = el.payload;
      const o: J = {
        id: t.id,
        rules: encodeRules(t.rules),
        frame: encodeFrame(t.frame),
        isHidden: t.isHidden,
        chart: t.chart,
      };
      // The chart's own order and "only when it differs" rule for the same keys.
      if (t.labelSize !== TIMELINE_DEFAULT_LABEL_SIZE) o.labelSize = encNum(t.labelSize);
      if (t.labelColorHex !== TIMELINE_DEFAULT_LABEL_HEX) o.labelColorHex = t.labelColorHex;
      if (t.timeLabelCount !== TIMELINE_DEFAULT_LABEL_COUNT) o.timeLabelCount = clampTimeLabelCount(t.timeLabelCount);
      if (t.hourCycle !== TIMELINE_DEFAULT_HOUR_CYCLE) o.hourCycle = t.hourCycle;
      if (t.minutes !== TIMELINE_DEFAULT_MINUTE_STYLE) o.minutes = t.minutes;
      return { kind: "chartTimes", payload: o };
    }
    case "chartDots": {
      const d = el.payload;
      const o: J = {
        id: d.id,
        rules: encodeRules(d.rules),
        frame: encodeFrame(d.frame),
        isHidden: d.isHidden,
        chart: d.chart,
      };
      // Same order and "only when it differs" rule as the app's encoder.
      if (chartDotsMode(d.dots) !== "auto") o.dots = "all";
      const size = chartPointDotSize(d.size);
      if (size !== undefined) o.size = encNum(size);
      if (d.colorHex !== undefined) o.colorHex = d.colorHex;
      return { kind: "chartDots", payload: o };
    }
    case "chartGrid": {
      const g = el.payload;
      const o: J = {
        id: g.id,
        rules: encodeRules(g.rules),
        frame: encodeFrame(g.frame),
        isHidden: g.isHidden,
        chart: g.chart,
      };
      const lines = chartGridLayerLines(g.lines);
      if (lines !== CHART_DEFAULT_GRID_LINES) o.lines = lines;
      const colorHex = chartGridColorHex(g.colorHex);
      if (!sameHex(colorHex, CHART_DEFAULT_GRID_HEX)) o.colorHex = colorHex;
      const thickness = chartGridThickness(g.thickness);
      if (thickness !== CHART_GRID_LINE_WIDTH) o.thickness = encNum(thickness);
      return { kind: "chartGrid", payload: o };
    }
  }
}

function encodeLayout(l: FamilyLayout): J {
  const o: J = {};
  const ids = Object.keys(l.placements);
  if (ids.length > 0) {
    const placements: J = {};
    for (const id of ids) {
      const p = l.placements[id]!;
      const po: J = { frame: encodeFrame(p.frame) };
      if (p.isHidden) po.isHidden = true;
      if (p.size !== undefined) po.size = encNum(p.size);
      placements[id] = po;
    }
    o.placements = placements;
  }
  if (l.bezelText) o.bezelText = encodeValue(l.bezelText);
  if (l.bezelCountdown === true) o.bezelCountdown = true;
  if (l.curvedText) o.curvedText = encodeValue(l.curvedText);
  if (l.curvedColorHex !== undefined) o.curvedColorHex = l.curvedColorHex;
  if (l.bezelGauge) {
    const g = l.bezelGauge;
    const go: J = {
      value: encodeValue(g.value),
      minValue: encNum(g.minValue),
      maxValue: encNum(g.maxValue),
      colorHexes: g.colorHexes,
    };
    if (g.minLabel) go.minLabel = encodeValue(g.minLabel);
    if (g.maxLabel) go.maxLabel = encodeValue(g.maxLabel);
    o.bezelGauge = go;
  }
  if (l.backgroundColorHex !== undefined) o.backgroundColorHex = l.backgroundColorHex;
  o.cornerBodyShape = l.cornerBodyShape;
  if (l.borderColorHex !== undefined) o.borderColorHex = l.borderColorHex;
  o.borderWidth = encNum(l.borderWidth);
  if (l.rules.length > 0) o.rules = encodeRules(l.rules);
  return o;
}

function encodeTapAction(t: TapAction): J {
  if (t.type === "callService") {
    // The target flattens onto the same four keys every other action uses, and
    // blank data never reaches the wire, so a call without one is byte-identical
    // to a call that never had one.
    const o: J = { type: t.type, serviceDomain: t.serviceDomain, serviceName: t.serviceName };
    if (t.serviceDataJSON !== undefined && t.serviceDataJSON.trim() !== "") o.serviceDataJSON = t.serviceDataJSON;
    if (t.target !== undefined && t.target.entityId !== "") Object.assign(o, encodeEntityRef(t.target));
    return o;
  }
  if ("entityId" in t) return { type: t.type, ...encodeEntityRef(t) };
  return { type: t.type };
}

function encodeInline(i: InlineLayout): J {
  const o: J = {};
  if (i.label !== undefined) o.label = i.label;
  o.value = encodeValue(i.value);
  if (i.symbol !== undefined) o.symbol = i.symbol;
  if (i.countdown) o.countdown = true;
  return o;
}

export function encodeConfig(cfg: CustomComplicationConfig): J {
  const perFamily: unknown[] = [];
  // Inline has no canvas layout, so it never appears in perFamily.
  for (const family of DRAWABLE_FAMILIES) {
    const l = cfg.perFamily[family];
    if (l) perFamily.push(family, encodeLayout(l));
  }
  const o: J = {
    schemaVersion: schemaVersionFor(cfg),
    id: cfg.id,
    name: cfg.name,
    values: cfg.values.map((v) => ({ id: v.id, name: v.name, value: encodeValue(v.value) })),
    slotIndex: cfg.slotIndex,
    elements: cfg.elements.map(encodeElement),
    supportedFamilies: cfg.supportedFamilies,
    perFamily,
    dataSources: cfg.dataSources.map((d) => (d.kind === "template" ? { kind: "template", value: d.value } : { kind: "entity", ...encodeEntityRef(d) })),
    tapAction: encodeTapAction(cfg.tapAction),
  };
  if (cfg.inline !== undefined) o.inline = encodeInline(cfg.inline);
  if (cfg.refreshMinutes !== undefined) o.refreshMinutes = cfg.refreshMinutes;
  if (cfg.openPageId !== undefined) o.openPageId = cfg.openPageId;
  if (cfg.openPageName !== undefined) o.openPageName = cfg.openPageName;
  if (cfg.showSuccessFlash !== undefined) o.showSuccessFlash = cfg.showSuccessFlash;
  if (cfg.successFlashColorHex !== undefined) o.successFlashColorHex = cfg.successFlashColorHex;
  if (cfg.groups !== undefined && cfg.groups.length > 0) {
    o.groups = cfg.groups.map((g) => ({ id: g.id, name: g.name, locked: g.locked }));
  }
  return o;
}

// ── layer groups ──────────────────────────────────────────────────────────
// A group is one block in the draw order: its members sit together in
// `elements`, so "move the group" is "move the block" and the picture keeps
// the stacking the author built. Attached taps are not members; they follow
// their owner as they always have.

export function groupOf(cfg: CustomComplicationConfig, elementId: string): LayerGroup | undefined {
  const el = cfg.elements.find((e) => e.payload.id === elementId);
  const gid = el?.payload.groupId;
  return gid === undefined ? undefined : cfg.groups?.find((g) => g.id === gid);
}

/** Members in draw order (first drawn first). Attached taps are never members. */
export function groupMembers(cfg: CustomComplicationConfig, groupId: string): Element[] {
  return cfg.elements.filter((e) => e.payload.groupId === groupId && !isAttachedTap(cfg, e));
}

/** Drop a group nothing belongs to any more, and a membership that names no
 * group, so the two lists never disagree after a delete or an old document. */
export function pruneGroups(cfg: CustomComplicationConfig): void {
  const ids = new Set((cfg.groups ?? []).map((g) => g.id));
  for (const el of cfg.elements) {
    if (el.payload.groupId !== undefined && !ids.has(el.payload.groupId)) delete el.payload.groupId;
  }
  const used = new Set(cfg.elements.map((e) => e.payload.groupId).filter((g): g is string => g !== undefined));
  const kept = (cfg.groups ?? []).filter((g) => used.has(g.id));
  if (kept.length === 0) delete cfg.groups;
  else cfg.groups = kept;
}

/**
 * Put the members of every group next to each other, keeping each block where
 * its topmost member was. Called after any reorder, so a block can never be
 * split by a layer that is not in it.
 */
export function packGroups(cfg: CustomComplicationConfig): void {
  if (!cfg.groups?.length) return;
  const rows = cfg.elements.filter((e) => !isAttachedTap(cfg, e));
  const taps = cfg.elements.filter((e) => isAttachedTap(cfg, e));
  const out: Element[] = [];
  const placed = new Set<string>();
  // Walk from the top of the stack (the end of the array) so a block lands
  // where its topmost member was.
  for (let i = rows.length - 1; i >= 0; i--) {
    const el = rows[i]!;
    if (placed.has(el.payload.id)) continue;
    const gid = el.payload.groupId;
    if (gid === undefined) {
      out.unshift(el);
      placed.add(el.payload.id);
      continue;
    }
    const block = rows.filter((e) => e.payload.groupId === gid);
    for (let j = block.length - 1; j >= 0; j--) {
      out.unshift(block[j]!);
      placed.add(block[j]!.payload.id);
    }
  }
  cfg.elements = [...out, ...taps];
  syncAttachedTaps(cfg);
}

/** Make a group of these layers. Members already in another group leave it.
 * Returns the new group's id, or undefined when fewer than two layers qualify. */
export function createGroup(cfg: CustomComplicationConfig, ids: readonly string[], name = "Group"): string | undefined {
  const members = cfg.elements.filter((e) => ids.includes(e.payload.id) && !isAttachedTap(cfg, e));
  if (members.length < 2) return undefined;
  const group: LayerGroup = { id: newId(), name, locked: true };
  cfg.groups = [...(cfg.groups ?? []), group];
  for (const el of members) el.payload.groupId = group.id;
  pruneGroups(cfg);
  packGroups(cfg);
  return group.id;
}

/** Dissolve a group. Its layers keep their places and their order. */
export function ungroup(cfg: CustomComplicationConfig, groupId: string): void {
  for (const el of cfg.elements) if (el.payload.groupId === groupId) delete el.payload.groupId;
  pruneGroups(cfg);
}

/** Move one layer into a group (or out of every group with `undefined`). */
export function setGroup(cfg: CustomComplicationConfig, elementId: string, groupId: string | undefined): void {
  const el = cfg.elements.find((e) => e.payload.id === elementId);
  if (!el || isAttachedTap(cfg, el)) return;
  if (groupId === undefined) delete el.payload.groupId;
  else el.payload.groupId = groupId;
  pruneGroups(cfg);
  packGroups(cfg);
}

// ── unknown-key audit ─────────────────────────────────────────────────────
// The parser drops keys it does not know, so a save after editing would
// silently lose them. The panel refuses to edit a document whose audit is
// non-empty and tells the user which paths it does not understand.

const K = {
  config: ["schemaVersion", "id", "name", "values", "slotIndex", "elements", "supportedFamilies", "perFamily", "inline", "dataSources", "refreshMinutes", "tapAction", "openPageId", "openPageName", "showSuccessFlash", "successFlashColorHex", "groups"],
  group: ["id", "name", "locked"],
  inline: ["label", "value", "symbol", "countdown"],
  named: ["id", "name", "value"],
  value: ["kind", "format"],
  format: ["decimals", "multiply", "offset", "prefix", "suffix", "useEntityUnit", "relativeTime", "duration", "textCase"],
  entityRef: ["entityId", "displayName", "domain", "iconName"],
  aggregate: ["function", "scope", "stateFilter", "attribute"],
  scope: ["kind", "entities", "domains", "areaIds", "labelIds", "floorIds"],
  stateFilter: ["kind", "value"],
  frame: ["x", "y", "width", "height", "rotationDegrees"],
  chartAnchor: ["layer", "at", "place", "dx", "dy"],
  elementEnvelope: ["kind", "payload"],
  elementBase: ["id", "colorSlot", "rules", "frame", "isHidden", "groupId"],
  text: ["value", "fontSize", "fontWeight", "countdown", "monospacedDigits", "lineLimit", "alignment",
    "coloring", "bands", "bandAboveColorHex", "highlight", "highColorHex", "lowColorHex", "parts",
    "chartAnchor"],
  textPart: ["id", "value", "colorHex", "fontWeight", "fontSize", "coloring", "bands", "bandAboveColorHex"],
  icon: ["symbol", "path", "size", "chartAnchor"],
  gauge: ["value", "minValue", "maxValue", "style", "lineWidth", "trackColorHex",
    "coloring", "bands", "bandAboveColorHex", "thresholdValue", "thresholdColorHex", "total", "minSource", "maxSource"],
  chart: ["value", "historyMinutes", "historyPoints", "source", "statPeriod", "statType",
    "style", "limit", "takeFromEnd", "scale", "minValue", "maxValue",
    "baseline", "barGap", "lineWidth", "highlight", "highColorHex", "lowColorHex", "marker",
    "coloring", "bands", "bandAboveColorHex", "fillBands",
    "thresholdValue", "thresholdColorHex", "nowIndex", "nowColorHex", "scaleFrom",
    "drawsThreshold", "drawsNowLine", "drawsTimeLabels",
    "timeLabelCount", "labelSize", "labelColorHex", "labelsAbove", "hourCycle", "minutes",
    "highMarker", "lowMarker",
    "curve", "fillStyle", "fillColorHex", "barRadius", "barCorners", "smoothing", "gaps",
    // Written only on 2026-09-12, before dots, grid and the zero line became
    // layers. `liftChartOwnMarks` reads them forward.
    "pointDots", "pointDotSize", "pointDotColorHex", "gridLines", "gridColorHex", "zeroLine",
    // Written only on 2026-09-05. The band bounds are read forward by
    // `parseChartBands`; the built-in numbers are read forward by
    // `migrateChartLabels` into text layers. All still listed so a document
    // saved that day does not read as carrying unknown keys.
    "bandLowColorHex", "bandHighColorHex", "bandLowerBound", "bandUpperBound",
    "scaleLabels", "scaleLabelPlacement", "latestLabel",
    "topLabelStyle", "bottomLabelStyle", "latestLabelStyle", "latestLabelFollowsBand",
    "scaleLabelColorHex"],
  // `timeLabels` is retired and never written, but a document saved the evening
  // it existed still carries it, and dropping it from this list would make that
  // document read as carrying a key nothing decodes.
  timeline: ["value", "historyMinutes", "bands", "otherColorHex", "gap", "cornerRadius", "timeLabels", "labelSize", "labelColorHex", "labelsAbove", "timeLabelCount", "hourCycle", "minutes"],
  shape: ["kind", "cornerRadius", "thickness", "borderColorHex", "borderWidth", "chartAnchor"],
  // `timestampStyle` is retired (the age style, built and removed 2026-09-04).
  // It stays listed so a document saved while it existed does not read as
  // corrupt; nothing decodes it, and it leaves the wire on that document's next
  // save.
  image: ["entity", "source", "timestamp", "contentMode", "zoom", "panX", "panY", "cornerRadius",
    "timestampCorner", "timestampSize", "timestampStyle", "timestampX", "timestampY",
    "chartAnchor"],
  // `grow` is retired (the uniform tap inflation, replaced by a resizable tap
  // box on 2026-09-04). Listed so a document saved while it existed still
  // opens; nothing decodes it, and it leaves the wire on that document's next
  // save. The tap's frames already carry what it did.
  tap: ["action", "openPageId", "openPageName", "attachedTo", "grow"],
  chartTimes: ["chart", "timeLabelCount", "labelSize", "labelColorHex", "hourCycle", "minutes"],
  chartDots: ["chart", "dots", "size", "colorHex"],
  chartGrid: ["chart", "lines", "colorHex", "thickness"],
  colorSlot: ["baseColorHex"],
  rule: ["id", "cases", "otherwise", "partId"],
  case: ["id", "when", "then"],
  condition: ["join", "tests"],
  test: ["id", "value", "comparison"],
  comparison: ["kind", "value", "upper", "pattern", "options"],
  styleChange: ["kind", "value", "number", "weight"],
  layout: ["placements", "bezelText", "bezelCountdown", "curvedText", "curvedColorHex", "bezelGauge", "backgroundColorHex", "cornerBodyShape", "borderColorHex", "borderWidth", "rules"],
  bezelGauge: ["value", "minValue", "maxValue", "colorHexes", "minLabel", "maxLabel"],
  placement: ["frame", "isHidden", "size"],
  // The last three belong to `callService` only; the entity four are its optional
  // target, the same keys every entity action uses.
  tapAction: ["type", "entityId", "displayName", "domain", "iconName",
    "serviceDomain", "serviceName", "serviceDataJSON"],
  // No `dataSource` list: `auditUnknownKeys` deliberately does not look at
  // `dataSources` at all. See the note at the end of that function.
};

const VALUE_KIND_KEYS: Record<string, string[]> = {
  literal: ["kind", "value"],
  entityState: ["kind", ...K.entityRef],
  entityAttribute: ["kind", ...K.entityRef, "attribute"],
  entityAge: ["kind", ...K.entityRef],
  aggregate: ["kind", "aggregate"],
  time: ["kind", "timeField"],
  dataAge: ["kind"],
  jinja: ["kind", "value"],
  named: ["kind", "id"],
  chartStat: ["kind", "layer", "stat"],
};

export function auditUnknownKeys(raw: unknown): string[] {
  const out: string[] = [];
  const check = (o: unknown, allowed: string[], path: string) => {
    if (!isObject(o)) return;
    for (const key of Object.keys(o)) if (!allowed.includes(key)) out.push(`${path}.${key}`);
  };
  const valueKind = (o: unknown, path: string) => {
    if (!isObject(o)) return;
    const kind = typeof o.kind === "string" ? o.kind : "";
    check(o, VALUE_KIND_KEYS[kind] ?? ["kind"], path);
    if (kind === "aggregate" && isObject(o.aggregate)) {
      check(o.aggregate, K.aggregate, `${path}.aggregate`);
      check(o.aggregate.scope, K.scope, `${path}.aggregate.scope`);
      if (isObject(o.aggregate.scope) && Array.isArray(o.aggregate.scope.entities)) {
        o.aggregate.scope.entities.forEach((e, i) => check(e, K.entityRef, `${path}.aggregate.scope.entities[${i}]`));
      }
      check(o.aggregate.stateFilter, K.stateFilter, `${path}.aggregate.stateFilter`);
    }
  };
  const value = (o: unknown, path: string) => {
    if (!isObject(o)) return;
    if (isObject(o.kind)) {
      check(o, K.value, path);
      valueKind(o.kind, `${path}.kind`);
    } else {
      const kind = typeof o.kind === "string" ? o.kind : "";
      check(o, [...(VALUE_KIND_KEYS[kind] ?? ["kind"]), "format"], path);
      if (kind === "aggregate") valueKind(o, path);
    }
    check(o.format, K.format, `${path}.format`);
  };
  const changes = (list: unknown, path: string) => {
    if (!Array.isArray(list)) return;
    list.forEach((c, i) => {
      check(c, K.styleChange, `${path}[${i}]`);
      if (isObject(c)) value(c.value, `${path}[${i}].value`);
    });
  };
  const rules = (list: unknown, path: string) => {
    if (!Array.isArray(list)) return;
    list.forEach((r, i) => {
      const rp = `${path}[${i}]`;
      check(r, K.rule, rp);
      if (!isObject(r)) return;
      if (Array.isArray(r.cases)) {
        r.cases.forEach((c, j) => {
          const cp = `${rp}.cases[${j}]`;
          check(c, K.case, cp);
          if (!isObject(c)) return;
          check(c.when, K.condition, `${cp}.when`);
          if (isObject(c.when) && Array.isArray(c.when.tests)) {
            c.when.tests.forEach((t, k) => {
              const tp = `${cp}.when.tests[${k}]`;
              check(t, K.test, tp);
              if (!isObject(t)) return;
              value(t.value, `${tp}.value`);
              check(t.comparison, K.comparison, `${tp}.comparison`);
              if (isObject(t.comparison)) {
                value(t.comparison.value, `${tp}.comparison.value`);
                value(t.comparison.upper, `${tp}.comparison.upper`);
              }
            });
          }
          changes(c.then, `${cp}.then`);
        });
      }
      changes(r.otherwise, `${rp}.otherwise`);
    });
  };
  if (!isObject(raw)) return out;
  check(raw, K.config, "$");
  if (Array.isArray(raw.groups)) raw.groups.forEach((g, i) => check(g, K.group, `$.groups[${i}]`));
  if (Array.isArray(raw.values)) {
    raw.values.forEach((v, i) => {
      check(v, K.named, `$.values[${i}]`);
      if (isObject(v)) value(v.value, `$.values[${i}].value`);
    });
  }
  if (Array.isArray(raw.elements)) {
    raw.elements.forEach((e, i) => {
      const ep = `$.elements[${i}]`;
      check(e, K.elementEnvelope, ep);
      if (!isObject(e) || !isObject(e.payload)) return;
      const kind = typeof e.kind === "string" ? e.kind : "";
      const extra = (K as Record<string, string[]>)[kind] ?? [];
      check(e.payload, [...K.elementBase, ...extra], `${ep}.payload`);
      check(e.payload.colorSlot, K.colorSlot, `${ep}.payload.colorSlot`);
      check(e.payload.frame, K.frame, `${ep}.payload.frame`);
      if ("chartAnchor" in e.payload) check(e.payload.chartAnchor, K.chartAnchor, `${ep}.payload.chartAnchor`);
      rules(e.payload.rules, `${ep}.payload.rules`);
      for (const vk of ["value", "symbol", "nowIndex", "total", "minSource", "maxSource"]) if (vk in e.payload) value(e.payload[vk], `${ep}.payload.${vk}`);
      if (kind === "text" && Array.isArray(e.payload.parts)) {
        e.payload.parts.forEach((part, j) => {
          check(part, K.textPart, `${ep}.payload.parts[${j}]`);
          if (isObject(part)) value(part.value, `${ep}.payload.parts[${j}].value`);
        });
      }
      if (kind === "image") check(e.payload.entity, K.entityRef, `${ep}.payload.entity`);
      if (kind === "tap") check(e.payload.action, K.tapAction, `${ep}.payload.action`);
    });
  }
  const layouts: [string, unknown][] = [];
  if (Array.isArray(raw.perFamily)) {
    for (let i = 0; i + 1 < raw.perFamily.length; i += 2) layouts.push([String(raw.perFamily[i]), raw.perFamily[i + 1]]);
  } else if (isObject(raw.perFamily)) {
    layouts.push(...Object.entries(raw.perFamily));
  }
  for (const [family, l] of layouts) {
    const lp = `$.perFamily.${family}`;
    check(l, K.layout, lp);
    if (!isObject(l)) continue;
    if (isObject(l.placements)) {
      for (const [id, p] of Object.entries(l.placements)) {
        check(p, K.placement, `${lp}.placements.${id}`);
        if (isObject(p)) check(p.frame, K.frame, `${lp}.placements.${id}.frame`);
      }
    }
    value(l.bezelText, `${lp}.bezelText`);
    value(l.curvedText, `${lp}.curvedText`);
    if (isObject(l.bezelGauge)) {
      const gp = `${lp}.bezelGauge`;
      check(l.bezelGauge, K.bezelGauge, gp);
      value(l.bezelGauge.value, `${gp}.value`);
      value(l.bezelGauge.minLabel, `${gp}.minLabel`);
      value(l.bezelGauge.maxLabel, `${gp}.maxLabel`);
    }
    rules(l.rules, `${lp}.rules`);
  }
  if (isObject(raw.inline)) {
    check(raw.inline, K.inline, "$.inline");
    value(raw.inline.value, "$.inline.value");
  }
  // `dataSources` is deliberately not audited. It is the one derived part of
  // the document: `Draft.encoded()` throws away whatever was there and
  // recomputes it from the layers on every save, so an unfamiliar key in it
  // cannot be lost by saving, which is the only thing this audit is for.
  // Auditing it was actively wrong: Swift writes `minutes`, `points` and
  // `mode` on a history source, the panel never derives one, and so every
  // document with a chart or a timeline on it opened read-only.
  check(raw.tapAction, K.tapAction, "$.tapAction");
  return out;
}

// ── construction helpers ──────────────────────────────────────────────────

export function newId(): string {
  const c = globalThis.crypto;
  if (c && "randomUUID" in c) return c.randomUUID().toUpperCase();
  // Plain-http Home Assistant is not a secure context, so randomUUID is
  // missing there. Build a real v4: version nibble 4, variant nibble 8..B.
  const hex = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, "0");
  const variant = (8 + Math.floor(Math.random() * 4)).toString(16) + hex().slice(1);
  return `${hex()}${hex()}-${hex()}-4${hex().slice(1)}-${variant}-${hex()}${hex()}${hex()}`.toUpperCase();
}

export function defaultLayout(): FamilyLayout {
  // cornerBodyShape is legacy: renderers always draw the circle body since
  // 2026-08-30 (the wedge could never match the wrist). New documents say so.
  return { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
}

/** A fresh document with the given shapes. The default is the three canvas
 * shapes, which is what a watch that predates per-shape support needs and
 * what every document had before schema 6; the panel's create dialog passes
 * one shape. Inline starts with a literal since there is no text layer yet. */
export function newConfig(name: string, slotIndex: number, families: FamilyKind[] = [...DRAWABLE_FAMILIES]): CustomComplicationConfig {
  const perFamily: Partial<Record<FamilyKind, FamilyLayout>> = {};
  for (const f of DRAWABLE_FAMILIES) if (families.includes(f)) perFamily[f] = defaultLayout();
  const cfg: CustomComplicationConfig = {
    schemaVersion: 4,
    id: newId(),
    name,
    values: [],
    slotIndex,
    elements: [],
    supportedFamilies: ALL_FAMILY_ORDER.filter((f) => families.includes(f)),
    perFamily,
    dataSources: [],
    refreshMinutes: 0,
    tapAction: { type: "refresh" },
  };
  if (families.includes("inline")) cfg.inline = { value: literal("Text") };
  cfg.schemaVersion = schemaVersionFor(cfg);
  return cfg;
}

export function newElement(kind: Element["kind"]): Element {
  const base = (color: string): ElementBase => ({ id: newId(), colorSlot: { baseColorHex: color }, rules: [], frame: { ...CENTERED_FRAME }, isHidden: false });
  switch (kind) {
    case "text": return { kind, payload: { ...base("#FFFFFF"), value: literal("Text"), fontSize: 14, fontWeight: "regular" } };
    case "icon": return { kind, payload: { ...base("#FFFFFF"), symbol: literal("lightbulb"), size: 14 } };
    case "gauge": return { kind, payload: { ...base("#FFFFFF"), value: literal("50"), minValue: 0, maxValue: 100, style: "arc", lineWidth: 4, trackColorHex: "#FFFFFF40", coloring: "uniform", bands: [], bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX, thresholdColorHex: GAUGE_DEFAULT_THRESHOLD_HEX } };
    // A new chart is set to draw history: nearly every chart is of a plain
    // sensor, and a plain sensor's own value is one bar. Until an entity is
    // named the sample list draws instead, so the layer is never blank.
    //
    // `marker: "none"` because a chart drawn today marks its ends with marker
    // layers, added from its Extras card. A chart drawing its own is a document
    // from before 2026-09-12; it keeps doing so until its author converts it.
    //
    // `curve: "smooth"` and `fillStyle: "fade"` are written on purpose (decided
    // 2026-09-12): a new chart switched to line or area draws smooth with a
    // fading fill, while an existing chart, which omits both keys, stays
    // straight and flat.
    case "chart": return { kind, payload: { ...base("#FFFFFF"), value: literal("13,14,16,17,19,22,24,28,30"), historyMinutes: CHART_HISTORY_DEFAULT_MINUTES, historyPoints: 24, source: CHART_DEFAULT_SOURCE, statPeriod: CHART_DEFAULT_STAT_PERIOD, statType: CHART_DEFAULT_STAT_TYPE, style: "bars", curve: "smooth", fillStyle: "fade", limit: 0, takeFromEnd: false, scale: "auto", minValue: 0, maxValue: 100, baseline: "lowest", barGap: 1.5, lineWidth: 2, highlight: "none", highColorHex: CHART_DEFAULT_HIGH_HEX, lowColorHex: CHART_DEFAULT_LOW_HEX, marker: "none", coloring: "uniform", bands: [], bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX, fillBands: false, thresholdColorHex: CHART_DEFAULT_THRESHOLD_HEX, nowColorHex: CHART_DEFAULT_NOW_HEX, timeLabelCount: TIMELINE_DEFAULT_LABEL_COUNT, labelSize: TIMELINE_DEFAULT_LABEL_SIZE, labelColorHex: TIMELINE_DEFAULT_LABEL_HEX, labelsAbove: false, hourCycle: TIMELINE_DEFAULT_HOUR_CYCLE, minutes: TIMELINE_DEFAULT_MINUTE_STYLE } };
    // No sample states: a timeline of a made-up string would draw a strip that
    // looks like data. Empty until an entity is picked, which is also when the
    // colour table can be seeded from its domain.
    case "timeline": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return {
        kind,
        payload: {
          ...b,
          value: literal(""),
          historyMinutes: TIMELINE_NEW_MINUTES,
          bands: [],
          otherColorHex: TIMELINE_NEW_OTHER_HEX,
          gap: 0,
          cornerRadius: TIMELINE_NEW_CORNER_RADIUS,
          timeLabelCount: TIMELINE_NEW_LABEL_COUNT,
          labelSize: TIMELINE_DEFAULT_LABEL_SIZE,
          labelColorHex: TIMELINE_DEFAULT_LABEL_HEX,
          labelsAbove: false,
          hourCycle: TIMELINE_DEFAULT_HOUR_CYCLE,
          minutes: TIMELINE_DEFAULT_MINUTE_STYLE,
        },
      };
    }
    case "shape": return { kind, payload: { ...base("#FFFFFF33"), kind: "roundedRectangle", cornerRadius: 6, thickness: 1, borderWidth: 1 } };
    case "image": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return {
        kind,
        payload: {
          ...b,
          entity: { entityId: "", displayName: "", domain: "camera" },
          source: "camera",
          contentMode: "fill",
          zoom: 1,
          panX: 0,
          panY: 0,
          cornerRadius: IMAGE_DEFAULT_CORNER_RADIUS,
          timestampCorner: "topLeading",
          timestampSize: IMAGE_DEFAULT_TIMESTAMP_SIZE,
        },
      };
    }
    case "tap": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return { kind, payload: { ...b, action: { type: "refresh" } } };
    }
    // Linked to no chart: `convertChartTimes` is the way one is made, and it
    // fills the link and copies the chart's own keys over these.
    case "chartTimes": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return {
        kind,
        payload: {
          ...b,
          chart: "",
          timeLabelCount: TIMELINE_DEFAULT_LABEL_COUNT,
          labelSize: TIMELINE_DEFAULT_LABEL_SIZE,
          labelColorHex: TIMELINE_DEFAULT_LABEL_HEX,
          hourCycle: TIMELINE_DEFAULT_HOUR_CYCLE,
          minutes: TIMELINE_DEFAULT_MINUTE_STYLE,
        },
      };
    }
    // Linked to no chart, like chart times: `addChartDots` and `addChartGrid`
    // are the way one is made.
    case "chartDots": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return { kind, payload: { ...b, chart: "", dots: "auto" } };
    }
    case "chartGrid": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return {
        kind,
        payload: { ...b, chart: "", lines: CHART_DEFAULT_GRID_LINES, colorHex: CHART_DEFAULT_GRID_HEX, thickness: CHART_GRID_LINE_WIDTH },
      };
    }
  }
}

// ── helpers ───────────────────────────────────────────────────────────────

export function literal(value: string): Value {
  return { kind: { kind: "literal", value } };
}

export function elementBase(el: Element): Omit<ElementBase, "colorSlot"> {
  return el.payload;
}

/** Per-family layer list: shared elements with the family's placements applied. */
/** The size a layer draws at, for the kinds that have one. A placement's
 * `size` overrides it for one shape. */
export function elementSize(el: Element): number | undefined {
  switch (el.kind) {
    case "text": return el.payload.fontSize;
    case "icon": return el.payload.size;
    case "gauge": return el.payload.lineWidth;
    case "chart": return el.payload.lineWidth;
    // A timeline's runs fill the frame, so its size is the frame and nothing else.
    case "timeline": return undefined;
    case "shape": return undefined;
    case "image": return undefined;
    case "tap": return undefined;
    case "chartTimes": return undefined;
    case "chartDots": return undefined;
    case "chartGrid": return undefined;
  }
}

/** The shapes whose design box is the square around a circle, so the corners
 * of a full-width layout are off the face. */
const ROUND_FAMILIES: FamilyKind[] = ["circular", "corner"];

/** The square that fits inside a circle, as a fraction of the square around
 * it. A layout pulled onto this cannot be clipped by the rim. */
const INSCRIBED = Math.SQRT1_2;

/** The smallest each kind of size may be, matching the editor's own fields, so
 * a refit that scales a long way down still leaves something drawable. */
function smallestSize(kind: Element["kind"]): number {
  return kind === "text" || kind === "icon" ? 4 : 0.5;
}

/**
 * One shape's placement, refitted for another shape's canvas.
 *
 * Frames are fractions, so they carry across on their own. A point is not: 8 pt
 * text on the 181 pt wide rectangular canvas is a caption, and the same 8 pt on
 * the 51 pt circular one is a headline. Sizes scale by whichever of the two
 * canvas ratios is the smaller, which is the one that decides whether the thing
 * fits at all.
 *
 * A round target takes a second step. Its design box is the square around the
 * circle, so a layout that runs the full width has its ends off the face.
 * Frames are pulled towards the centre onto the square that fits inside the
 * circle, and their sizes come down with them. Going the other way undoes it.
 *
 * The result is often very small, and that is honest: three lines of
 * rectangular text do not fit on a 51 pt circle at a readable size. Nothing
 * goes below the size the editor's own fields allow, so a layout that scaled
 * to the floor says at a glance that it wants laying out by hand.
 */
export function refitPlacement(p: Placement, from: FamilyKind, to: FamilyKind, kind: Element["kind"]): Placement {
  const next = structuredClone(p);
  const a = DESIGN_BOX[from as keyof typeof DESIGN_BOX];
  const b = DESIGN_BOX[to as keyof typeof DESIGN_BOX];
  if (from === to || !a || !b) return next;
  const wasRound = ROUND_FAMILIES.includes(from);
  const isRound = ROUND_FAMILIES.includes(to);
  const inset = wasRound === isRound ? 1 : isRound ? INSCRIBED : 1 / INSCRIBED;
  const scale = Math.min(b.width / a.width, b.height / a.height) * inset;
  if (inset !== 1) {
    const f = next.frame;
    // Around the middle of the canvas, so a layout keeps its shape and its
    // centre rather than sliding towards a corner.
    const cx = f.x + f.width / 2;
    const cy = f.y + f.height / 2;
    next.frame = {
      ...f,
      width: f.width * inset,
      height: f.height * inset,
      x: 0.5 + (cx - 0.5) * inset - (f.width * inset) / 2,
      y: 0.5 + (cy - 0.5) * inset - (f.height * inset) / 2,
    };
  }
  if (next.size !== undefined) {
    next.size = Math.max(smallestSize(kind), Math.round(next.size * scale * 10) / 10);
  }
  return next;
}

export function elementsFor(config: CustomComplicationConfig, family: FamilyKind): Element[] {
  const layout = config.perFamily[family];
  if (!layout || Object.keys(layout.placements).length === 0) return config.elements;
  return config.elements.map((el) => {
    const placement = layout.placements[el.payload.id];
    if (!placement) return el;
    const payload = { ...el.payload, frame: placement.frame, isHidden: placement.isHidden };
    if (placement.size !== undefined) {
      if (el.kind === "text") (payload as TextElement).fontSize = placement.size;
      else if (el.kind === "icon") (payload as IconElement).size = placement.size;
      else if (el.kind === "gauge") (payload as GaugeElement).lineWidth = placement.size;
      else if (el.kind === "chart") (payload as ChartElement).lineWidth = placement.size;
    }
    return { kind: el.kind, payload } as Element;
  });
}

/** The value a layer shows (shapes have none). An image reads its camera's state,
 * so the compiler registers the entity and rules can test it. */
export function primaryValue(el: Element): Value | undefined {
  switch (el.kind) {
    case "text": return el.payload.value;
    case "icon": return el.payload.symbol;
    case "gauge": return el.payload.value;
    case "chart": return el.payload.value;
    case "timeline": return el.payload.value;
    case "shape": return undefined;
    case "image": return { kind: { kind: "entityState", ...el.payload.entity } };
    case "tap": return undefined;
    case "chartTimes": return undefined;
    case "chartDots": return undefined;
    case "chartGrid": return undefined;
  }
}

/** Every Value a rule can read, in walk order. */
export function ruleValues(rules: Rule[]): Value[] {
  const out: Value[] = [];
  const fromChanges = (changes: StyleChange[]) => {
    for (const c of changes) if (c.value) out.push(c.value);
  };
  for (const rule of rules) {
    for (const c of rule.cases) {
      for (const t of c.when.tests) {
        out.push(t.value);
        if (t.comparison.value) out.push(t.comparison.value);
        if (t.comparison.upper) out.push(t.comparison.upper);
      }
      fromChanges(c.then);
    }
    if (rule.otherwise) fromChanges(rule.otherwise);
  }
  return out;
}

// ── attached taps ─────────────────────────────────────────────────────────
// A tap layer with `attachedTo` belongs to a drawing layer instead of standing
// on its own: it copies that layer's frame and per-shape placements and sits
// directly above it in z-order. Everything here is pure, so the editor never
// has to remember to keep the two in step; `syncAttachedTaps` runs once after
// every draft mutation and fixes whatever the edit disturbed.

/** Domains whose entities a tap can sensibly toggle. Starts from the list the
 * iPhone preset converter uses (PresetCustomConverter) and adds the rest of
 * what Home Assistant's own toggle service handles. Read only to pick a
 * default action, so a domain missing here costs the user one dropdown. */
export const TOGGLEABLE_DOMAINS = [
  "light", "switch", "fan", "input_boolean", "cover", "lock", "media_player",
  "siren", "humidifier", "valve", "automation", "group",
];

/** The entity a value reads, followed through named values, and the id of the
 * last named value it went through when it took that road. */
export function valueEntity(
  cfg: CustomComplicationConfig,
  value: Value | undefined,
): { ref: EntityRef; namedId?: string } | undefined {
  let namedId: string | undefined;
  let current = value;
  for (let hop = 0; current !== undefined && hop < 4; hop++) {
    const kind = current.kind;
    // A chart's number is about whatever the chart is about.
    if (kind.kind === "chartStat") {
      current = chartOfValue(cfg, current)?.payload.value;
      continue;
    }
    if ("entityId" in kind) {
      if (kind.entityId === "") return undefined;
      const ref: EntityRef = { entityId: kind.entityId, displayName: kind.displayName, domain: kind.domain };
      return namedId === undefined ? { ref } : { ref, namedId };
    }
    if (kind.kind !== "named") return undefined;
    namedId = kind.id.toUpperCase();
    current = cfg.values.find((n) => n.id.toUpperCase() === namedId)?.value;
  }
  return undefined;
}

/** The entity a drawing layer is about, when it has one: whatever its value or
 * symbol reads, followed through named values, or a camera's own entity. */
export function elementEntity(cfg: CustomComplicationConfig, el: Element): EntityRef | undefined {
  return valueEntity(cfg, primaryValue(el))?.ref;
}

/** The action a newly attached tap starts with: toggle the layer's own entity
 * when that entity is something a toggle makes sense for, else the same
 * default a free-standing tap layer gets. */
export function defaultAttachedTapAction(cfg: CustomComplicationConfig, owner: Element): TapAction {
  const ref = elementEntity(cfg, owner);
  const domain = ref ? (ref.domain || ref.entityId.split(".")[0] || "") : "";
  if (ref && TOGGLEABLE_DOMAINS.includes(domain)) return { type: "toggleEntity", ...ref, domain };
  return { type: "refresh" };
}

/**
 * One frame pushed out by `outset` points on each side, inside the given
 * design box, then held inside the face. The box matters: 8 pt is 4.4% of a
 * rectangular width and 23.5% of a corner one, so the same points have to be
 * turned into a fraction shape by shape.
 *
 * An edge that would leave the face stops at the edge instead, because a tap
 * target outside the slot is area nobody can reach. An outset that would turn
 * the box inside out collapses it to a line at the owner's centre instead.
 */
export function outsetFrame(frame: NormalizedFrame, outset: TapOutset | undefined, box: { width: number; height: number }): NormalizedFrame {
  if (isZeroOutset(outset) || box.width <= 0 || box.height <= 0) return { ...frame };
  const o = outset!;
  let left = frame.x - o.left / box.width;
  let right = frame.x + frame.width + o.right / box.width;
  let top = frame.y - o.top / box.height;
  let bottom = frame.y + frame.height + o.bottom / box.height;
  if (right < left) left = right = (left + right) / 2;
  if (bottom < top) top = bottom = (top + bottom) / 2;
  left = clamp01(left);
  right = clamp01(right);
  top = clamp01(top);
  bottom = clamp01(bottom);
  return {
    ...frame,
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

/** The outset, in points of `box`, that takes `owner` to `tap`. The inverse of
 * `outsetFrame` short of the face clamp: an edge that was held at the face
 * reads as reaching exactly the face, which draws the same. */
export function outsetBetween(owner: NormalizedFrame, tap: NormalizedFrame, box: { width: number; height: number }): TapOutset {
  // `|| 0` turns the -0 a tiny negative rounds to into a plain 0, so two
  // outsets that draw the same also compare the same.
  const r = (n: number) => Math.round(n * 100) / 100 || 0;
  return {
    left: r((owner.x - tap.x) * box.width),
    right: r((tap.x + tap.width - owner.x - owner.width) * box.width),
    top: r((owner.y - tap.y) * box.height),
    bottom: r((tap.y + tap.height - owner.y - owner.height) * box.height),
  };
}

/**
 * Set an attached tap's outset from a frame the author dragged out in one
 * shape. The frame is measured against the owner's frame in that shape and
 * kept to the face, and the resulting points then apply to every shape, so
 * one drag sizes the target everywhere. Does nothing for a tap that is not
 * attached. The caller's `syncAttachedTaps` (every draft update runs it)
 * writes the frames.
 */
export function setTapOutsetFromFrame(
  cfg: CustomComplicationConfig,
  tapId: string,
  family: "rectangular" | "circular" | "corner",
  frame: NormalizedFrame,
): void {
  const tap = cfg.elements.find((el) => el.payload.id === tapId);
  if (!tap || tap.kind !== "tap" || tap.payload.attachedTo === undefined) return;
  const owner = cfg.elements.find((el) => el.payload.id === tap.payload.attachedTo);
  if (!owner) return;
  const base = cfg.perFamily[family]?.placements[owner.payload.id]?.frame ?? owner.payload.frame;
  const left = clamp01(frame.x);
  const top = clamp01(frame.y);
  const right = clamp01(frame.x + frame.width);
  const bottom = clamp01(frame.y + frame.height);
  const held = { ...frame, x: left, y: top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
  tap.payload.outset = outsetBetween(base, held, DESIGN_BOX[family]);
}

/**
 * The size of an attached tap's area in one shape, in design-box points. Read
 * by the editor to say how big the target actually is, which is the number the
 * author cares about and the one no fraction shows them.
 */
export function tapPointSize(
  cfg: CustomComplicationConfig,
  tapId: string,
  family: "rectangular" | "circular" | "corner",
): { width: number; height: number } | undefined {
  const tap = cfg.elements.find((el) => el.payload.id === tapId);
  if (!tap) return undefined;
  const layout = cfg.perFamily[family];
  if (!layout) return undefined;
  const frame = layout.placements[tapId]?.frame ?? tap.payload.frame;
  const box = DESIGN_BOX[family];
  return { width: frame.width * box.width, height: frame.height * box.height };
}

/** The tap layers attached to one drawing layer, in document order. */
export function attachedTapsOf(cfg: CustomComplicationConfig, ownerId: string): Element[] {
  return cfg.elements.filter((el) => el.kind === "tap" && el.payload.attachedTo === ownerId);
}

/** Whether this layer is a tap that follows an owner the document still has.
 * The Layers card hides these rows, and the preview sends their hits to the
 * owner, so an attached tap is never selected or dragged on its own. */
export function isAttachedTap(cfg: CustomComplicationConfig, el: Element): boolean {
  if (el.kind !== "tap" || el.payload.attachedTo === undefined) return false;
  return cfg.elements.some((o) => o.payload.id === el.payload.attachedTo && o.kind !== "tap");
}

/**
 * The layer a preview hit belongs to. An attached tap sits exactly over its
 * owner and is never a row or a selection of its own, so a hit on one answers
 * with the owner. An id the document no longer has answers undefined.
 */
export function selectableLayerId(cfg: CustomComplicationConfig, hitId: string): string | undefined {
  const hit = cfg.elements.find((x) => x.payload.id === hitId);
  if (!hit) return undefined;
  if (hit.kind === "tap" && hit.payload.attachedTo !== undefined) {
    const owner = cfg.elements.find((x) => x.payload.id === hit.payload.attachedTo);
    if (owner) return owner.payload.id;
  }
  return hit.payload.id;
}

/**
 * Glue every attached tap back to its owner: same frame, same per-shape
 * placements, same hidden state, sitting directly above it in `elements`.
 * A tap whose owner is gone (or is another tap) loses `attachedTo` and goes
 * back to being an ordinary free-standing tap rather than disappearing.
 *
 * Idempotent, and cheap enough to run after every single edit, which is the
 * point: drags, resizes, nudges, field edits, per-shape overrides and reorders
 * all keep the tap aligned without any of them knowing it exists.
 */
export function syncAttachedTaps(cfg: CustomComplicationConfig): void {
  const byId = new Map(cfg.elements.map((el) => [el.payload.id, el] as const));
  const taps = new Map<string, Element[]>();
  for (const el of cfg.elements) {
    if (el.kind !== "tap") continue;
    const ownerId = el.payload.attachedTo;
    if (ownerId === undefined) continue;
    const owner = byId.get(ownerId);
    if (!owner || owner.kind === "tap" || ownerId === el.payload.id) {
      delete el.payload.attachedTo;
      continue;
    }
    const list = taps.get(ownerId);
    if (list) list.push(el);
    else taps.set(ownerId, [el]);
  }
  if (taps.size === 0) return;

  for (const [ownerId, list] of taps) {
    const owner = byId.get(ownerId)!;
    for (const tap of list) {
      const payload = tap.payload as TapElement;
      // A tap that just arrived carries no outset, only the frames the last
      // save wrote. Read the outset back from the shared frame, so the target
      // the author sized keeps its size and keeps following its layer.
      if (payload.outset === undefined) {
        payload.outset = outsetBetween(owner.payload.frame, payload.frame, DESIGN_BOX.rectangular);
      }
      const outset = payload.outset;
      const pushed = !isZeroOutset(outset);
      // The shared frame has no shape of its own, so it is pushed out in the
      // rectangular box. Every supported shape gets its own placement below,
      // so this fallback is only reached by a shape the document does not have.
      tap.payload.frame = outsetFrame(owner.payload.frame, outset, DESIGN_BOX.rectangular);
      // A hidden layer with a live tap area would be a button nobody can see,
      // so the tap follows the owner's visibility too.
      tap.payload.isHidden = owner.payload.isHidden;
      // A tap sits on its owner's shape and on no other, so the placement is
      // written there and cleared everywhere else. Left in another shape it
      // would be a second owner, and the layer would be split in two.
      const home = ownerFamily(cfg, ownerId);
      for (const family of DRAWABLE_FAMILIES) {
        const layout = cfg.perFamily[family];
        if (!layout) continue;
        const box = DESIGN_BOX[family as "rectangular" | "circular" | "corner"];
        const p = layout.placements[ownerId];
        if (family !== home || !p) {
          delete layout.placements[tap.payload.id];
        } else if (pushed) {
          // Pushed out, the shared frame is inflated by the wrong ratio for
          // this shape, so the tap needs a placement of its own: it is the
          // only way to say the right fraction.
          layout.placements[tap.payload.id] = { frame: outsetFrame(p.frame, outset, box), isHidden: p.isHidden };
        } else {
          layout.placements[tap.payload.id] = { frame: { ...p.frame }, isHidden: p.isHidden };
        }
      }
    }
  }

  const ordered: Element[] = [];
  for (const el of cfg.elements) {
    if (el.kind === "tap" && el.payload.attachedTo !== undefined) continue;
    ordered.push(el);
    const list = taps.get(el.payload.id);
    if (list) ordered.push(...list);
  }
  cfg.elements = ordered;
}

/**
 * Make a drawing layer tappable and return the tap that now belongs to it.
 * This is the one way to create an attached tap: the Tappable checkbox calls
 * it, and so should anything else that builds one (a preset, say). Already
 * tappable layers are left alone and their existing tap comes back.
 * Undefined for a missing layer, or for a tap layer (a tap has no tap).
 */
export function attachTap(cfg: CustomComplicationConfig, ownerId: string, action?: TapAction): TapElement | undefined {
  const owner = cfg.elements.find((el) => el.payload.id === ownerId);
  if (!owner || owner.kind === "tap") return undefined;
  const existing = attachedTapsOf(cfg, ownerId)[0];
  if (existing) return existing.payload as TapElement;
  const el = newElement("tap");
  const tap = el.payload as TapElement;
  tap.attachedTo = ownerId;
  // A fresh tap starts flush with its layer. Left undefined, the sync would
  // read an outset back from the new element's default frame instead.
  tap.outset = { ...ZERO_OUTSET };
  tap.action = action ?? defaultAttachedTapAction(cfg, owner);
  cfg.elements.push(el);
  syncAttachedTaps(cfg);
  return tap;
}

/** Drop the taps attached to a layer, leaving the layer itself alone. */
export function detachTaps(cfg: CustomComplicationConfig, ownerId: string): void {
  const doomed = attachedTapsOf(cfg, ownerId).map((el) => el.payload.id);
  if (doomed.length === 0) return;
  cfg.elements = cfg.elements.filter((el) => !doomed.includes(el.payload.id));
  for (const family of DRAWABLE_FAMILIES) {
    for (const id of doomed) delete cfg.perFamily[family]?.placements[id];
  }
}

/** Delete a layer, the taps attached to it, and every per-shape placement any
 * of them had. Deleting an owner takes its tap with it: the tap was never a
 * layer of its own in the editor, so leaving it behind would be a mystery. */
export function removeElement(cfg: CustomComplicationConfig, id: string): void {
  // A chart's numbers name it by id, so without the chart they would print the
  // placeholder forever. They go with it, the way an attached tap does.
  for (const label of chartLabelsOf(cfg, id)) removeElement(cfg, label.payload.id);
  // A times layer has nothing to read without its chart and would sit in the
  // list drawing nothing, so it goes too.
  for (const times of chartTimesOf(cfg, id)) removeElement(cfg, times.payload.id);
  // Dots and grid lines draw in their chart's box, so without it they are
  // nothing at all.
  for (const dots of chartDotsOf(cfg, id)) removeElement(cfg, dots.payload.id);
  for (const grid of chartGridsOf(cfg, id)) removeElement(cfg, grid.payload.id);
  // A marker names its chart by id too. Unlike a number it still has something
  // to show, so it stays and goes back to sitting where its frame puts it,
  // rather than disappearing along with a chart the author may be replacing.
  for (const marker of chartMarkersOf(cfg, id)) delete marker.payload.chartAnchor;
  detachTaps(cfg, id);
  cfg.elements = cfg.elements.filter((el) => el.payload.id !== id);
  // A chart that borrowed the deleted one's scale goes back to its own. The
  // resolver falls back anyway, but a link to nothing left in the document would
  // sit in the picker as a name nobody can see.
  for (const el of cfg.elements) {
    if (el.kind === "chart" && el.payload.scaleFrom === id) delete el.payload.scaleFrom;
  }
  for (const family of DRAWABLE_FAMILIES) delete cfg.perFamily[family]?.placements[id];
  syncAttachedTaps(cfg);
  pruneGroups(cfg);
}

/** Copy a layer (and any tap attached to it) directly above the original,
 * nudged so the copy is visible. Returns the copy's id. */
export function duplicateElement(cfg: CustomComplicationConfig, id: string): string | undefined {
  const index = cfg.elements.findIndex((el) => el.payload.id === id);
  const src = cfg.elements[index];
  if (!src) return undefined;
  const copyId = newId();
  const copy = structuredClone(src);
  copy.payload.id = copyId;
  copy.payload.frame = {
    ...copy.payload.frame,
    x: Math.min(0.9, copy.payload.frame.x + 0.05),
    y: Math.min(0.9, copy.payload.frame.y + 0.05),
  };
  const clones: Element[] = [copy];
  const placementSources: [string, string][] = [[id, copyId]];
  for (const tap of attachedTapsOf(cfg, id)) {
    const tapCopy = structuredClone(tap);
    tapCopy.payload.id = newId();
    (tapCopy.payload as TapElement).attachedTo = copyId;
    clones.push(tapCopy);
    placementSources.push([tap.payload.id, tapCopy.payload.id]);
  }
  cfg.elements.splice(index + 1, 0, ...clones);
  for (const family of DRAWABLE_FAMILIES) {
    const layout = cfg.perFamily[family];
    if (!layout) continue;
    for (const [from, to] of placementSources) {
      const p = layout.placements[from];
      if (p) layout.placements[to] = structuredClone(p);
    }
  }
  syncAttachedTaps(cfg);
  return copyId;
}

/**
 * A second series over an existing chart: a copy of it directly above, on the
 * exact same frame and every per-shape placement, drawn against the original's
 * scale. Returns the copy's id.
 *
 * Not `duplicateElement`. A duplicate nudges the copy so it is visible and
 * keeps its own scale, which is right for every other layer and wrong here:
 * two series only read as one plot when they sit on the same rectangle and
 * share one range. The copy keeps its own colour, style, bands and stats, and
 * its numbers are not copied, because a second set of numbers on the same spot
 * is noise the author has to move before reading either.
 */
export function addChartSeries(cfg: CustomComplicationConfig, chartId: string): string | undefined {
  const index = cfg.elements.findIndex((el) => el.payload.id === chartId);
  const src = cfg.elements[index];
  if (!src || src.kind !== "chart") return undefined;
  const copyId = newId();
  const copy = structuredClone(src);
  copy.payload.id = copyId;
  copy.payload.scaleFrom = chartId;
  cfg.elements.splice(index + 1, 0, copy);
  for (const family of DRAWABLE_FAMILIES) {
    const layout = cfg.perFamily[family];
    const p = layout?.placements[chartId];
    if (layout && p) layout.placements[copyId] = structuredClone(p);
  }
  return copyId;
}

// ── copy and paste ────────────────────────────────────────────────────────
// What ⌘C lifts out of a document and ⌘V puts back, in this complication or
// another one. A layer travels with everything a duplicate takes along: its
// attached tap, a chart's numbers, every shape's placement, and the group it
// shares with another copied layer.

export interface LayerClip {
  /** The copied layers in document order, attached taps and chart numbers included. */
  elements: Element[];
  /** Each shape's placement for every copied id. */
  placements: Partial<Record<FamilyKind, Record<string, Placement>>>;
  /** The groups the copied layers belonged to, so a whole group pastes as one. */
  groups: LayerGroup[];
  /** The shape the copy was taken on, when there was one. A paste on a
   * different shape of the same document means "put these here", not "make
   * second copies of them", and this is how the paste can tell. */
  family?: FamilyKind;
}

export function copyElements(cfg: CustomComplicationConfig, ids: readonly string[], from?: FamilyKind): LayerClip {
  const wanted = new Set<string>();
  const take = (id: string) => {
    wanted.add(id);
    for (const tap of attachedTapsOf(cfg, id)) wanted.add(tap.payload.id);
  };
  for (const id of ids) {
    take(id);
    for (const label of chartLabelsOf(cfg, id)) take(label.payload.id);
  }
  const elements = cfg.elements.filter((el) => wanted.has(el.payload.id)).map((el) => structuredClone(el));
  const placements: LayerClip["placements"] = {};
  for (const family of DRAWABLE_FAMILIES) {
    const layout = cfg.perFamily[family];
    if (!layout) continue;
    const out: Record<string, Placement> = {};
    for (const el of elements) {
      const p = layout.placements[el.payload.id];
      if (p) out[el.payload.id] = structuredClone(p);
    }
    if (Object.keys(out).length > 0) placements[family] = out;
  }
  const groupIds = new Set(elements.map((el) => el.payload.groupId).filter((g): g is string => g !== undefined));
  const groups = (cfg.groups ?? []).filter((g) => groupIds.has(g.id)).map((g) => structuredClone(g));
  return { elements, placements, groups, ...(from !== undefined ? { family: from } : {}) };
}

/**
 * Paste copied layers onto one shape.
 *
 * Copies, always. A layer belongs to one shape, so rows copied on the
 * Rectangular face and pasted on the Circular one become second layers of
 * their own: editing one of them afterwards leaves the originals alone. They
 * land where their originals sit, scaled for this canvas when they came off a
 * shape of another size, and they land on the exact spot rather than nudged,
 * because "put these here too" is a placement, not a duplicate.
 *
 * Returns the rows that landed, attached taps left out the same way a paste
 * leaves them out.
 */
export function pasteElementsOnto(cfg: CustomComplicationConfig, clip: LayerClip, family: FamilyKind): string[] {
  const from = clip.family;
  const across = from !== undefined && from !== family && DRAWABLE_FAMILIES.includes(from);
  if (!DRAWABLE_FAMILIES.includes(family)) return pasteElements(cfg, clip);
  const landed = pasteElements(cfg, clip, across ? { nudge: false } : {});
  const layout = cfg.perFamily[family] ?? (cfg.perFamily[family] = defaultLayout());
  for (const id of landed) {
    const el = cfg.elements.find((e) => e.payload.id === id);
    if (!el) continue;
    // The copies arrived carrying the placement the originals have on the
    // shape they were taken from. Move that onto this shape, refitting when
    // the two canvases differ.
    const src = (from !== undefined ? cfg.perFamily[from]?.placements[id] : undefined)
      ?? DRAWABLE_FAMILIES.map((f) => cfg.perFamily[f]?.placements[id]).find((p) => p !== undefined);
    // The size travels even when the source shape never set one, so the refit
    // has something to scale and the layer does not arrive at the size it
    // happened to be given on a canvas of another width.
    const size = src?.size ?? elementSize(el);
    const base: Placement = {
      frame: { ...(src?.frame ?? el.payload.frame) },
      isHidden: false,
      ...(size !== undefined ? { size } : {}),
    };
    // The copies came in carrying the source shape's placement under their new
    // ids. Left there it would be a second owner, and settling the document
    // would split each copy in two, so it goes.
    for (const f of DRAWABLE_FAMILIES) if (f !== family) delete cfg.perFamily[f]?.placements[id];
    layout.placements[id] = across ? refitPlacement(base, from, family, el.kind) : base;
  }
  normalizeOwnership(cfg, family);
  return landed;
}

/**
 * Put copied layers into a document on top of the draw order, under fresh ids.
 * Links between copied layers (a tap's owner, a number's chart, a shared group)
 * point at the copies. A number whose chart is neither copied nor in this
 * document is left out, since it could only ever print its placeholder. The
 * copies are nudged when their originals are still here, so a paste over the
 * original shows, the way a duplicate does. Returns the ids of the pasted
 * rows: every copy that is not an attached tap.
 *
 * `nudge: false` turns that offset off, for the one caller that wants the copy
 * on the exact same spot: giving a second shape its own set of layers, where
 * the point is that the picture does not move.
 */
export function pasteElements(cfg: CustomComplicationConfig, clip: LayerClip, opts: { nudge?: boolean } = {}): string[] {
  const idMap = new Map<string, string>();
  for (const el of clip.elements) idMap.set(el.payload.id, newId());
  const here = new Set(cfg.elements.map((el) => el.payload.id));
  const nudge = opts.nudge !== false && clip.elements.some((el) => here.has(el.payload.id));
  const shift = (f: NormalizedFrame): NormalizedFrame => nudge
    ? { ...f, x: Math.min(0.9, f.x + 0.05), y: Math.min(0.9, f.y + 0.05) }
    : f;
  const clones: Element[] = [];
  for (const src of clip.elements) {
    const copy = structuredClone(src);
    copy.payload.id = idMap.get(src.payload.id)!;
    if (copy.kind === "tap" && copy.payload.attachedTo !== undefined) {
      const owner = idMap.get(copy.payload.attachedTo);
      if (owner) copy.payload.attachedTo = owner;
      else delete copy.payload.attachedTo;
    }
    // A borrowed scale follows the copy when the chart it borrowed from came
    // along, stays pointed at the original when that original is still here,
    // and is dropped when it is neither.
    if (copy.kind === "chart" && copy.payload.scaleFrom !== undefined) {
      const source = idMap.get(copy.payload.scaleFrom);
      if (source) copy.payload.scaleFrom = source;
      else if (!here.has(copy.payload.scaleFrom)) delete copy.payload.scaleFrom;
    }
    // A part reading a copied chart reads the copy. One reading a chart that
    // is not coming along is left pointed where it was: the layer still has
    // its other parts to show, so it is not dropped the way a lone number is.
    if (copy.kind === "text") {
      for (const part of copy.payload.parts ?? []) {
        const k = part.value.kind;
        const chart = k.kind === "chartStat" ? idMap.get(k.layer) : undefined;
        if (k.kind === "chartStat" && chart) k.layer = chart;
      }
    }
    if (copy.kind === "text" && copy.payload.value.kind.kind === "chartStat") {
      const chart = idMap.get(copy.payload.value.kind.layer);
      if (chart) copy.payload.value.kind.layer = chart;
      else if (!here.has(copy.payload.value.kind.layer)) continue;
    }
    // A times layer reads its chart the way a number does, and is dropped the
    // same way when it would paste reading nothing.
    if (copy.kind === "chartTimes" || copy.kind === "chartDots" || copy.kind === "chartGrid") {
      const chart = idMap.get(copy.payload.chart);
      if (chart) copy.payload.chart = chart;
      else if (!here.has(copy.payload.chart)) continue;
    }
    // A marker follows a copied chart onto the copy, stays on the original when
    // that original is still here, and stops being a marker when it is neither:
    // the layer is kept, because a glyph the author styled is worth keeping, but
    // it goes back to sitting where its frame puts it.
    if (copy.payload.chartAnchor !== undefined) {
      const chart = idMap.get(copy.payload.chartAnchor.layer);
      if (chart) copy.payload.chartAnchor.layer = chart;
      else if (!here.has(copy.payload.chartAnchor.layer)) delete copy.payload.chartAnchor;
    }
    copy.payload.frame = shift(copy.payload.frame);
    clones.push(copy);
  }
  // A group pastes as a group when at least two of its members came along;
  // a lone member is just a layer again.
  const groupMap = new Map<string, string>();
  for (const g of clip.groups) {
    const members = clones.filter((el) => el.payload.groupId === g.id && !(el.kind === "tap" && el.payload.attachedTo !== undefined));
    if (members.length < 2) continue;
    const gid = newId();
    groupMap.set(g.id, gid);
    (cfg.groups ??= []).push({ ...structuredClone(g), id: gid });
  }
  for (const el of clones) {
    if (el.payload.groupId === undefined) continue;
    const gid = groupMap.get(el.payload.groupId);
    if (gid) el.payload.groupId = gid;
    else delete el.payload.groupId;
  }
  cfg.elements.push(...clones);
  for (const family of DRAWABLE_FAMILIES) {
    const from = clip.placements[family];
    const layout = cfg.perFamily[family];
    if (!from || !layout) continue;
    for (const [oldId, p] of Object.entries(from)) {
      const id = idMap.get(oldId);
      if (id && clones.some((el) => el.payload.id === id)) layout.placements[id] = { ...structuredClone(p), frame: shift(p.frame) };
    }
  }
  syncAttachedTaps(cfg);
  pruneGroups(cfg);
  packGroups(cfg);
  return clones.filter((el) => !isAttachedTap(cfg, el)).map((el) => el.payload.id);
}

// ── which shape a layer belongs to ────────────────────────────────────────
//
// Every layer belongs to exactly one shape. Two shapes never point at the
// same layer, so renaming the text on the circular face cannot reach the
// rectangular one, and a shape added to a finished complication starts with
// nothing on it and an empty layer list.
//
// Nothing new is stored to say so. Two rules the watch already follows carry
// it, so no document has to be migrated and no watch has to be updated:
//
//   1. Every layer's own `isHidden` is `true`. `elements(for:)` on the watch
//      falls back to a layer's own drawing whenever the shape has no
//      placement for it, so this is what keeps a shape from drawing a layer
//      that is not its own.
//   2. The one shape that owns the layer holds a placement for it, and no
//      other shape does. That placement's `isHidden` is the author's own hide
//      toggle, and its frame and size are the layer's drawing.
//
// `normalizeOwnership` puts a document into that form and keeps it there. It
// runs on open and after every edit, so no other function has to remember the
// rules: a layer added anywhere lands on the shape being edited, and a
// document written before this all existed is split on the way in, drawing
// exactly what it drew before.

/** Whether a shape draws a layer, under whatever rules the document carries.
 * Same fallback as `elementsFor` and the watch's `elements(for:)`. */
function drawsElement(cfg: CustomComplicationConfig, family: FamilyKind, el: Element): boolean {
  const layout = cfg.perFamily[family];
  const p = layout?.placements[el.payload.id];
  if (layout && Object.keys(layout.placements).length > 0 && p) return !p.isHidden;
  return !el.payload.isHidden;
}

/** The shape a layer belongs to, or undefined for an id the document has lost.
 * An attached tap reports its owner's shape, since it is not a row of its own. */
export function ownerFamily(cfg: CustomComplicationConfig, id: string): FamilyKind | undefined {
  const el = cfg.elements.find((e) => e.payload.id === id);
  const ownerId = el && el.kind === "tap" ? el.payload.attachedTo : undefined;
  const key = ownerId ?? id;
  return DRAWABLE_FAMILIES.find((f) => cfg.supportedFamilies.includes(f) && cfg.perFamily[f]?.placements[key] !== undefined);
}

/** The layers on one shape, in draw order. What the Layers card lists, and
 * what a shape's own copy, delete and paste work on. */
export function ownedElements(cfg: CustomComplicationConfig, family: FamilyKind): Element[] {
  const layout = cfg.perFamily[family];
  if (!layout) return [];
  return cfg.elements.filter((el) => {
    const ownerId = el.kind === "tap" ? el.payload.attachedTo : undefined;
    return layout.placements[ownerId ?? el.payload.id] !== undefined;
  });
}

/** How many layers a shape draws: its own, minus the ones hidden on it. */
export function ownedShownCount(cfg: CustomComplicationConfig, family: FamilyKind): number {
  const layout = cfg.perFamily[family];
  if (!layout) return 0;
  return ownedElements(cfg, family).filter((el) => !isAttachedTap(cfg, el) && !layout.placements[el.payload.id]?.isHidden).length;
}

/**
 * Put the document into the one-shape-per-layer form and keep it there.
 *
 * `home` is the shape being edited. Pass it for an edit: a layer no shape has
 * a placement for is the layer the edit just added, and it lands there.
 *
 * Leave it out for a document being opened, and only then. That is the one
 * moment a layer can arrive drawn by two shapes at once, from a panel written
 * before this rule existed, and the only moment splitting one in two is the
 * right answer. Doing it on an edit as well would turn every layer added to a
 * three-shape complication into three layers.
 *
 * Idempotent. Cheap enough to run after every edit.
 */
export function normalizeOwnership(cfg: CustomComplicationConfig, home?: FamilyKind): void {
  const families = DRAWABLE_FAMILIES.filter((f) => cfg.supportedFamilies.includes(f));
  if (families.length === 0) return;
  const fallback = home !== undefined && families.includes(home) ? home : families[0]!;
  for (const f of families) if (!cfg.perFamily[f]) cfg.perFamily[f] = defaultLayout();
  // Attached taps are left out throughout: they are not rows, they follow
  // their owner, and `syncAttachedTaps` puts them right afterwards.
  const tops = () => cfg.elements.filter((el) => !isAttachedTap(cfg, el));

  const seated = new Map<string, FamilyKind>();
  const drawnNowhere = new Set<string>();
  if (home === undefined) {
    // Opening. Read what each shape draws, then give the first shape that
    // draws a shared layer the original and every later one its own copy,
    // taken as a whole set so groups, attached taps and chart links come along.
    // The copies land on the same spot: splitting must not move anything,
    // because the complication has to draw exactly what it drew before.
    const drawnBy = new Map(tops().map((el) => [el.payload.id, families.filter((f) => drawsElement(cfg, f, el))] as const));
    for (const [id, on] of drawnBy) if (on[0]) seated.set(id, on[0]);
    // Where each layer sat in the stack, so the copies can be put back in the
    // same order. A copy is appended, so without this a shape whose first
    // layer was borrowed would end up drawing it last, on top of everything.
    const rank = new Map([...tops().entries()].map(([i, el]) => [el.payload.id, i] as const));
    for (const family of families) {
      const borrowed = tops()
        .filter((el) => (drawnBy.get(el.payload.id) ?? []).includes(family) && seated.get(el.payload.id) !== family)
        .map((el) => el.payload.id);
      if (borrowed.length === 0) continue;
      const clip = copyElements(cfg, borrowed, family);
      const landed = pasteElements(cfg, clip, { nudge: false });
      landed.forEach((id, i) => {
        seated.set(id, family);
        const source = landed.length === borrowed.length ? borrowed[i] : undefined;
        rank.set(id, source !== undefined ? rank.get(source) ?? 0 : rank.size);
      });
    }
    for (const el of tops()) if (!seated.has(el.payload.id)) drawnNowhere.add(el.payload.id);

    // Restack: each shape's layers back into the order that shape had them in,
    // its own block. Blocks keep every group's members together, and the order
    // between blocks does not matter, because no two shapes share a layer.
    const seat = (id: string) => families.indexOf(seated.get(id) ?? fallback);
    const sorted = tops().sort((a, b) =>
      seat(a.payload.id) - seat(b.payload.id)
      || (rank.get(a.payload.id) ?? 0) - (rank.get(b.payload.id) ?? 0));
    const restacked: Element[] = [];
    for (const el of sorted) {
      restacked.push(el);
      restacked.push(...attachedTapsOf(cfg, el.payload.id));
    }
    cfg.elements = restacked;
  }

  // Settle every layer on one shape and write the canonical form: the layer's
  // own `isHidden` true, one placement, on the shape that owns it.
  for (const el of tops()) {
    const id = el.payload.id;
    const keyed = families.filter((f) => cfg.perFamily[f]!.placements[id] !== undefined);
    const seat = seated.get(id)
      ?? keyed.find((f) => !cfg.perFamily[f]!.placements[id]!.isHidden)
      ?? keyed[0]
      ?? fallback;
    const src = cfg.perFamily[seat]?.placements[id];
    const placement: Placement = {
      frame: { ...(src?.frame ?? el.payload.frame) },
      isHidden: drawnNowhere.has(id) || src?.isHidden === true,
      ...(src?.size !== undefined ? { size: src.size } : {}),
    };
    el.payload.isHidden = true;
    for (const f of DRAWABLE_FAMILIES) {
      const layout = cfg.perFamily[f];
      if (!layout) continue;
      if (f === seat) layout.placements[id] = placement;
      else delete layout.placements[id];
    }
  }
}

// ── layer entity ──────────────────────────────────────────────────────────
// What a layer is *about* is nowhere in the schema. It is read back from the
// places the layer already names an entity: its own value or symbol, the tap
// attached to it, and the left-hand side of its rule tests. Keeping it derived
// means a document written by any other route still opens with the right
// entity in the field, and nothing new has to be stored or migrated.

export interface LayerEntityUse {
  /** Which part of the layer holds the reference. */
  where: "value" | "symbol" | "camera" | "tap" | "test";
  ref: EntityRef;
  /** Set when the reference is reached through a named value rather than
   * written on the layer itself. */
  namedId?: string;
  tapId?: string;
  ruleId?: string;
  caseId?: string;
  testId?: string;
}

/**
 * Every place one layer names an entity, in the order the editor trusts them:
 * the layer's own content first, then its tap, then its rule tests.
 *
 * The states table reads this to default the left-hand side of a new test to
 * the entity the layer is already about, which is the whole reason a user
 * never types an entity id twice.
 */
export function layerEntityUses(cfg: CustomComplicationConfig, layerId: string): LayerEntityUse[] {
  const el = cfg.elements.find((e) => e.payload.id === layerId);
  if (!el) return [];
  const out: LayerEntityUse[] = [];
  const own = valueEntity(cfg, primaryValue(el));
  if (own) {
    const where = el.kind === "icon" ? "symbol" : el.kind === "image" ? "camera" : "value";
    out.push(own.namedId === undefined ? { where, ref: own.ref } : { where, ref: own.ref, namedId: own.namedId });
  }
  for (const tap of attachedTapsOf(cfg, layerId)) {
    const action = (tap.payload as TapElement).action;
    if (!("entityId" in action) || action.entityId === "") continue;
    out.push({
      where: "tap",
      ref: { entityId: action.entityId, displayName: action.displayName, domain: action.domain },
      tapId: tap.payload.id,
    });
  }
  for (const rule of el.payload.rules) {
    for (const c of rule.cases) {
      for (const t of c.when.tests) {
        const found = valueEntity(cfg, t.value);
        if (!found) continue;
        const use: LayerEntityUse = { where: "test", ref: found.ref, ruleId: rule.id, caseId: c.id, testId: t.id };
        if (found.namedId !== undefined) use.namedId = found.namedId;
        out.push(use);
      }
    }
  }
  return out;
}

/** The one entity a layer is about, or undefined when it is about none. */
export function layerEntity(cfg: CustomComplicationConfig, layerId: string): EntityRef | undefined {
  return layerEntityUses(cfg, layerId)[0]?.ref;
}

/**
 * What the layer's own value becomes when its entity changes.
 *
 * An entity-shaped value is retargeted and keeps its kind, so an attribute
 * layer stays an attribute layer. A placeholder literal on a text or gauge
 * layer becomes that entity's state, because a literal there is content
 * nobody chose. Everything else is left exactly as it is: a template, an
 * aggregate or a named value is work somebody typed, and an icon's symbol is
 * the name of a picture rather than a reading, so neither is something an
 * entity pick should overwrite.
 */
function rebindValue(value: Value | undefined, ref: EntityRef, kind: Element["kind"]): Value | undefined {
  if (!value) return undefined;
  const k = value.kind;
  switch (k.kind) {
    case "entityState": return { ...value, kind: { kind: "entityState", ...ref } };
    case "entityAge": return { ...value, kind: { kind: "entityAge", ...ref } };
    case "entityAttribute": return { ...value, kind: { kind: "entityAttribute", ...ref, attribute: k.attribute } };
    case "literal":
      return kind === "text" || kind === "gauge" || kind === "chart" || kind === "timeline"
        ? { ...value, kind: { kind: "entityState", ...ref } }
        : undefined;
    default:
      return undefined;
  }
}

/**
 * Point a layer at an entity: its own content where that is safe (see
 * `rebindValue`), and the target of the tap attached to it. Rule tests are
 * deliberately left alone; the states table owns those.
 *
 * `deviceClass` is only read by a timeline, whose seeded colour table needs to
 * know whether a binary sensor is a door before it can name its two states.
 * The caller has it because it has `hass`; nothing in the document does.
 */
export function setLayerEntity(
  cfg: CustomComplicationConfig,
  layerId: string,
  ref: EntityRef,
  deviceClass?: string,
): void {
  const el = cfg.elements.find((e) => e.payload.id === layerId);
  // An empty reference is not an edit. The field is derived, so there is no
  // "no entity" to store: clearing it would only blank the layer's content,
  // and deleting the layer is what someone means by that.
  if (!el || ref.entityId === "") return;
  const full: EntityRef = { ...ref, domain: ref.domain || ref.entityId.split(".")[0] || "" };
  if (el.kind === "timeline") {
    const before = el.payload.value.kind.kind === "entityState" ? el.payload.value.kind.entityId : undefined;
    const next = rebindValue(el.payload.value, full, el.kind);
    if (next) el.payload.value = next;
    // A different entity reports different states, so the colour table is
    // written fresh for it. Picking the same entity again keeps any edits.
    if (el.payload.bands.length === 0 || before !== full.entityId) {
      el.payload.bands = seedTimelineBands(full.domain, deviceClass);
    }
  } else if (el.kind === "image") {
    el.payload.entity = full;
  } else if (el.kind === "text" || el.kind === "gauge" || el.kind === "chart") {
    const next = rebindValue(el.payload.value, full, el.kind);
    if (next) el.payload.value = next;
  } else if (el.kind === "icon") {
    const next = rebindValue(el.payload.symbol, full, el.kind);
    if (next) el.payload.symbol = next;
  }
  for (const tap of attachedTapsOf(cfg, layerId)) {
    const p = tap.payload as TapElement;
    if ("entityId" in p.action) p.action = { type: p.action.type, ...full };
  }
}

// ── document-wide walks ───────────────────────────────────────────────────
// Two narrower walks already exist. `compile()` visits the values a supported
// shape draws, and `layerEntityUses` visits one layer. Sharing a document needs
// the widest one: every `Value`, every `EntityRef` and every piece of free text
// anywhere in the document, including the parts nothing draws today. A layout
// left behind by a removed shape still names the author's entities, and a share
// that skipped it would post them in public.
//
// One walker underneath, three public shapes on top, so a new `Value` slot has
// to be added in exactly one place.

/** Which slot inside its owner a value or reference sits in, for the owners
 * that hold more than one. */
export type SitePart =
  | "total" | "nowIndex" | "gaugeMin" | "gaugeMax"
  | "bezelText" | "curvedText" | "bezelGauge" | "bezelGaugeMin" | "bezelGaugeMax"
  | "template" | "serviceData" | "textPart";

/** Where in the document a `Value` sits, in enough detail to name it in words. */
export interface ValueSite {
  kind: "named" | "layer" | "rule" | "layout" | "inline";
  /** Named value, for kind "named". */
  valueId?: string;
  valueName?: string;
  layerId?: string;
  layerKind?: Element["kind"];
  /** What the layer goes by: its entity's name, its literal, or its shape. */
  layerName?: string;
  family?: FamilyKind;
  part?: SitePart;
}

/** Where an `EntityRef` sits: every `ValueSite`, plus the three places that
 * hold a bare reference rather than one wrapped in a `Value`. */
export interface EntitySite extends Omit<ValueSite, "kind"> {
  kind: ValueSite["kind"] | "image" | "tap" | "documentTap";
}

const SITE_KIND_WORD: Record<Element["kind"], string> = {
  text: "text",
  icon: "icon",
  gauge: "gauge",
  chart: "chart",
  timeline: "timeline",
  shape: "shape",
  image: "picture",
  tap: "tap area",
  chartTimes: "chart times",
  chartDots: "chart dots",
  chartGrid: "chart grid",
};

function upperFirst(s: string): string {
  return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

/** One site as a short phrase, for the share and import tables. */
export function describeSite(site: EntitySite): string {
  if (site.part === "template") return "Template text";
  if (site.part === "serviceData") return "Service data";
  const word = site.layerKind === undefined ? "" : SITE_KIND_WORD[site.layerKind];
  const named = site.layerName ? `${word} "${site.layerName}"` : word;
  switch (site.kind) {
    case "named":
      return site.valueName ? `Shared value "${site.valueName}"` : "Shared value";
    case "layer":
    case "image":
      if (site.part === "total") return `Total on ${named}`;
      if (site.part === "gaugeMin") return `Min on ${named}`;
      if (site.part === "gaugeMax") return `Max on ${named}`;
      if (site.part === "nowIndex") return `Now marker on ${named}`;
      if (site.part === "textPart") return `Part of ${named}`;
      return `${upperFirst(word)} layer${site.layerName ? ` "${site.layerName}"` : ""}`;
    case "tap":
      return "Tap area";
    case "documentTap":
      return "Tap action";
    case "rule":
      return named === "" ? `Rule on the ${site.family ?? "shared"} shape` : `Rule on ${named}`;
    case "layout": {
      const family = upperFirst(site.family ?? "");
      switch (site.part) {
        case "curvedText": return `${family} curved text`;
        case "bezelGauge": return `${family} bezel gauge`;
        case "bezelGaugeMin": return `${family} bezel gauge low label`;
        case "bezelGaugeMax": return `${family} bezel gauge high label`;
        default: return `${family} bezel`;
      }
    }
    case "inline":
      return "Inline";
  }
}

/** A quoted entity id in free text: `'sensor.energy'` or `"sensor.energy"`.
 *
 * Free text is substituted rather than parsed, because a Jinja template is a
 * program and rewriting one properly would mean shipping a parser. Quotes are
 * what separates an id from the rest: `states('sensor.energy')` is a reference
 * and `value.attr` is not. The caller still decides which hits count, because
 * `'3.5'` fits this shape too. */
const QUOTED_ENTITY_RE = /(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;

/** Every quoted entity id in one string, in order, with repeats kept. */
export function quotedEntityIds(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(QUOTED_ENTITY_RE)) if (m[2] !== undefined) out.push(m[2]);
  return out;
}

/** Rewrite the quoted ids the map names, leaving the quotes and everything
 * else exactly as they were. */
export function replaceQuotedEntityIds(text: string, map: ReadonlyMap<string, string>): string {
  if (map.size === 0) return text;
  return text.replace(QUOTED_ENTITY_RE, (whole, quote: string, id: string) => {
    const next = map.get(id);
    return next === undefined ? whole : `${quote}${next}${quote}`;
  });
}

function entityRefCopy(r: EntityRef): EntityRef {
  const out: EntityRef = { entityId: r.entityId, displayName: r.displayName, domain: r.domain };
  if (r.iconName !== undefined) out.iconName = r.iconName;
  return out;
}

/** What a layer goes by in a site description. Derived, like `layerTitle` in
 * the editors, but without the describe machinery: this one only has to be
 * recognisable in a table of entity slots. */
function layerNameOf(cfg: CustomComplicationConfig, el: Element): string {
  if (el.kind === "shape") return el.payload.kind === "roundedRectangle" ? "rounded rectangle" : el.payload.kind;
  if (el.kind === "tap") return "";
  if (el.kind === "image") return el.payload.entity.displayName || el.payload.entity.entityId;
  const kind = primaryValue(el)?.kind;
  if (kind === undefined) return "";
  if (kind.kind === "literal") return kind.value;
  if ("entityId" in kind) return kind.displayName || kind.entityId;
  if (kind.kind === "named") {
    const id = kind.id.toUpperCase();
    return cfg.values.find((n) => n.id.toUpperCase() === id)?.name ?? "";
  }
  return "";
}

interface DocumentVisitor {
  value?: (v: Value, site: ValueSite) => void;
  /** Return a reference to replace this one whole, or undefined to leave it. */
  ref?: (ref: EntityRef, site: EntitySite) => EntityRef | undefined;
  text?: (text: string, site: EntitySite) => string;
}

function walkDocument(cfg: CustomComplicationConfig, visit: DocumentVisitor): void {
  const onValue = (v: Value, site: ValueSite): void => {
    visit.value?.(v, site);
    const k = v.kind;
    if (k.kind === "jinja") {
      if (visit.text) {
        const next = visit.text(k.value, { ...site, part: "template" });
        if (next !== k.value) k.value = next;
      }
      return;
    }
    if (k.kind === "aggregate") {
      const scope = k.aggregate.scope;
      if (visit.ref && scope.kind === "entities") {
        for (let i = 0; i < scope.entities.length; i++) {
          const next = visit.ref(entityRefCopy(scope.entities[i]!), site);
          if (next) scope.entities[i] = next;
        }
      }
      return;
    }
    if (!visit.ref || !("entityId" in k)) return;
    const next = visit.ref(entityRefCopy(k), site);
    if (!next) return;
    if (k.kind === "entityAttribute") v.kind = { kind: "entityAttribute", ...next, attribute: k.attribute };
    else if (k.kind === "entityState") v.kind = { kind: "entityState", ...next };
    else v.kind = { kind: "entityAge", ...next };
  };

  const onTapAction = (action: TapAction, site: EntitySite, set: (a: TapAction) => void): void => {
    if (action.type === "callService") {
      if (visit.ref && action.target !== undefined && action.target.entityId !== "") {
        const next = visit.ref(entityRefCopy(action.target), site);
        if (next) action.target = next;
      }
      if (visit.text && action.serviceDataJSON !== undefined) {
        const next = visit.text(action.serviceDataJSON, { ...site, part: "serviceData" });
        if (next !== action.serviceDataJSON) action.serviceDataJSON = next;
      }
      return;
    }
    if (!visit.ref || !("entityId" in action) || action.entityId === "") return;
    const next = visit.ref(entityRefCopy(action), site);
    if (next) set({ type: action.type, ...next });
  };

  for (const named of cfg.values) {
    onValue(named.value, { kind: "named", valueId: named.id, valueName: named.name });
  }

  for (const el of cfg.elements) {
    const base: ValueSite = {
      kind: "layer",
      layerId: el.payload.id,
      layerKind: el.kind,
      layerName: layerNameOf(cfg, el),
    };
    if (el.kind === "image") {
      if (visit.ref) {
        const next = visit.ref(entityRefCopy(el.payload.entity), { ...base, kind: "image" });
        if (next) el.payload.entity = next;
      }
    } else if (el.kind === "tap") {
      const tap = el.payload;
      onTapAction(tap.action, { ...base, kind: "tap" }, (a) => { tap.action = a; });
    } else {
      const primary = primaryValue(el);
      if (primary) onValue(primary, base);
      // A rich text layer's parts, after its value and in order, as the
      // compiler walks them. The value is only the first live part's fallback,
      // so an entity a later part reads would otherwise stay in a share.
      if (el.kind === "text") for (const part of el.payload.parts ?? []) onValue(part.value, { ...base, part: "textPart" });
      if (el.kind === "gauge" && el.payload.total) onValue(el.payload.total, { ...base, part: "total" });
      if (el.kind === "gauge" && el.payload.minSource) onValue(el.payload.minSource, { ...base, part: "gaugeMin" });
      if (el.kind === "gauge" && el.payload.maxSource) onValue(el.payload.maxSource, { ...base, part: "gaugeMax" });
      if (el.kind === "chart" && el.payload.nowIndex) onValue(el.payload.nowIndex, { ...base, part: "nowIndex" });
    }
    const ruleSite: ValueSite = { ...base, kind: "rule" };
    for (const v of ruleValues(el.payload.rules)) onValue(v, ruleSite);
  }

  // Every layout, not only the supported ones. `compile()` skips a layout whose
  // shape was removed because nothing draws it; a share has to visit it anyway,
  // because the entity ids in it are still on the wire.
  const families = (Object.keys(cfg.perFamily) as FamilyKind[]).sort((a, b) => {
    const ia = ALL_FAMILY_ORDER.indexOf(a);
    const ib = ALL_FAMILY_ORDER.indexOf(b);
    return (ia < 0 ? ALL_FAMILY_ORDER.length : ia) - (ib < 0 ? ALL_FAMILY_ORDER.length : ib);
  });
  for (const family of families) {
    const layout = cfg.perFamily[family];
    if (!layout) continue;
    const site: ValueSite = { kind: "layout", family };
    if (layout.bezelText) onValue(layout.bezelText, { ...site, part: "bezelText" });
    if (layout.curvedText) onValue(layout.curvedText, { ...site, part: "curvedText" });
    const gauge = layout.bezelGauge;
    if (gauge) {
      onValue(gauge.value, { ...site, part: "bezelGauge" });
      if (gauge.minLabel) onValue(gauge.minLabel, { ...site, part: "bezelGaugeMin" });
      if (gauge.maxLabel) onValue(gauge.maxLabel, { ...site, part: "bezelGaugeMax" });
    }
    const ruleSite: ValueSite = { kind: "rule", family };
    for (const v of ruleValues(layout.rules)) onValue(v, ruleSite);
  }

  if (cfg.inline) onValue(cfg.inline.value, { kind: "inline" });
  onTapAction(cfg.tapAction, { kind: "documentTap" }, (a) => { cfg.tapAction = a; });
}

/** Every `Value` in the document, in walk order. */
export function forEachValue(cfg: CustomComplicationConfig, fn: (v: Value, site: ValueSite) => void): void {
  walkDocument(cfg, { value: fn });
}

/** Whether a value reads the shared value with this id. */
function readsShared(v: Value, id: string): boolean {
  return v.kind.kind === "named" && v.kind.id.toUpperCase() === id.toUpperCase();
}

/**
 * How many places read one shared value. A layer counts once however many of
 * its values do (its text, a state test, a colour); anything else that reads
 * it, such as a bezel, the inline line or another shared value, counts alone.
 */
export function sharedValueUses(cfg: CustomComplicationConfig, id: string): number {
  const places = new Set<string>();
  forEachValue(cfg, (v, site) => {
    if (!readsShared(v, id)) return;
    places.add(site.layerId ?? `${site.kind}:${site.valueId ?? ""}:${site.family ?? ""}:${site.part ?? ""}`);
  });
  return places.size;
}

/** A name no other shared value in the document has, ignoring case. */
function freeSharedName(cfg: CustomComplicationConfig, wanted: string): string {
  const taken = new Set(cfg.values.map((n) => n.name.trim().toLowerCase()));
  const base = wanted.trim() || "Value";
  if (!taken.has(base.toLowerCase())) return base;
  for (let i = 2; ; i++) {
    const next = `${base} ${i}`;
    if (!taken.has(next.toLowerCase())) return next;
  }
}

/**
 * Share a value. The new shared value takes over what the value holds, and the
 * reference that replaces it keeps only the value's format, so a layer that
 * printed "with unit" still does. Nothing is written: the caller adds `named`
 * to the document and puts `ref` where the value was.
 */
export function shareValue(cfg: CustomComplicationConfig, v: Value, name: string): { named: NamedValue; ref: Value } {
  const named: NamedValue = { id: newId(), name: freeSharedName(cfg, name), value: { kind: structuredClone(v.kind) } };
  const ref: Value = { kind: { kind: "named", id: named.id } };
  if (v.format && !formatIsEmpty(v.format)) ref.format = structuredClone(v.format);
  return { named, ref };
}

/**
 * A reference to a shared value, turned back into its own copy of what that
 * value holds. The format follows the resolver: the reference's own wins, and
 * without one the shared value's comes along. Undefined when the value is not a
 * reference, or names a shared value that is gone.
 */
export function unsharedCopy(cfg: CustomComplicationConfig, v: Value): Value | undefined {
  if (v.kind.kind !== "named") return undefined;
  const id = v.kind.id;
  const named = cfg.values.find((n) => n.id.toUpperCase() === id.toUpperCase());
  if (!named) return undefined;
  const format = v.format && !formatIsEmpty(v.format) ? v.format : named.value.format;
  const out: Value = { kind: structuredClone(named.value.kind) };
  if (format && !formatIsEmpty(format)) out.format = structuredClone(format);
  return out;
}

/** Delete a shared value without breaking what read it: every reference is
 * given its own copy first. */
export function deleteSharedValue(cfg: CustomComplicationConfig, id: string): void {
  forEachValue(cfg, (v) => {
    if (!readsShared(v, id)) return;
    const copy = unsharedCopy(cfg, v);
    if (!copy) return;
    v.kind = copy.kind;
    if (copy.format) v.format = copy.format;
    else delete v.format;
  });
  cfg.values = cfg.values.filter((n) => n.id.toUpperCase() !== id.toUpperCase());
}

/**
 * Every `EntityRef` in the document, rewritten in place.
 *
 * Return a reference to replace the one you were given, whole: the kind, the
 * attribute and the action type are kept, everything else comes from the new
 * reference. Returning undefined leaves it alone. Replacing whole rather than
 * by id is deliberate, because `deriveDataSources` copies `displayName` off the
 * document, so a swapped id with the old name attached leaks that name straight
 * back into the next save.
 */
export function mapEntityRefs(
  cfg: CustomComplicationConfig,
  fn: (ref: EntityRef, site: EntitySite) => EntityRef | undefined,
): void {
  walkDocument(cfg, { ref: fn });
}

/** Every piece of author-written free text: Jinja values and service data. */
export function mapFreeText(cfg: CustomComplicationConfig, fn: (text: string, site: EntitySite) => string): void {
  walkDocument(cfg, { text: fn });
}

/** One place the document names an entity. */
export interface EntityUse {
  entityId: string;
  ref: EntityRef;
  /** The site in words, for a table the user reads. */
  where: string;
}

/**
 * Every entity the document names, in first-use order, one entry per use.
 *
 * `freeTextId` decides whether a quoted id inside a template or a service-data
 * blob counts. Leave it out to walk references only; pass a predicate to
 * include free text, which the caller gates by domain so that `'3.5'` is not
 * read as an entity.
 */
export function documentEntityUses(
  cfg: CustomComplicationConfig,
  freeTextId?: (entityId: string, domain: string) => boolean,
): EntityUse[] {
  const out: EntityUse[] = [];
  const visitor: DocumentVisitor = {
    ref: (ref, site) => {
      if (ref.entityId !== "") out.push({ entityId: ref.entityId, ref, where: describeSite(site) });
      return undefined;
    },
  };
  if (freeTextId) {
    visitor.text = (text, site) => {
      for (const id of quotedEntityIds(text)) {
        const domain = id.split(".")[0] ?? "";
        if (!freeTextId(id, domain)) continue;
        out.push({ entityId: id, ref: { entityId: id, displayName: "", domain }, where: describeSite(site) });
      }
      return text;
    };
  }
  walkDocument(cfg, visitor);
  return out;
}

// ── rule construction ─────────────────────────────────────────────────────

export type RuleTarget = Element["kind"] | "layout";

/** Properties each target actually reads (schema §5.3). Others are stored but ignored. */
export const RULE_TARGET_PROPERTIES: Record<RuleTarget, StyleProperty[]> = {
  text: ["color", "opacity", "text", "fontSize", "fontWeight", "rotation", "visibility"],
  icon: ["color", "opacity", "icon", "fontSize", "rotation", "visibility"],
  gauge: ["color", "opacity", "gaugeValue", "gaugeMin", "gaugeMax", "rotation", "visibility"],
  // No text or size effects: a chart's content is a whole series, and swapping that
  // from a rule would need a second series source.
  chart: ["color", "opacity", "rotation", "visibility"],
  // No colour either: every colour a timeline draws is in its own table, so a
  // rule that recoloured the layer would have nothing to recolour.
  timeline: ["opacity", "rotation", "visibility"],
  shape: ["color", "opacity", "borderColor", "borderWidth", "rotation", "visibility"],
  image: ["opacity", "rotation", "visibility"],
  tap: ["visibility"],
  // No colour, for the timeline's reason: the times carry their own.
  chartTimes: ["opacity", "rotation", "visibility"],
  // No colour and no rotation: the colour is the layer's own, and the layer
  // draws in its chart's box, turned the way the chart is.
  chartDots: ["opacity", "visibility"],
  chartGrid: ["opacity", "visibility"],
  layout: ["backgroundColor", "borderColor", "borderWidth", "text"],
};

export const COMPARISON_KINDS: ComparisonKind[] = [
  "isOn", "isOff", "equals", "notEquals", "isUnavailable", "isStale", "isEmpty",
  "greaterThan", "greaterOrEqual", "lessThan", "lessOrEqual", "between", "timeBetween",
  "contains", "startsWith", "endsWith", "matchesRegex", "isOneOf",
];

/**
 * A zero-padded 24-hour `HH:MM`, or undefined for anything else. Mirrors
 * `CustomComplication.clockTime` in the app.
 *
 * Strict on purpose. `time(now)` compiles to `now().strftime('%H:%M')`, so the left side
 * of a `timeBetween` is always this shape; a bound typed as "7:00" is a mistake, and a
 * false test is a clearer answer than a guess. The padding is what lets the comparison
 * itself be plain string ordering.
 */
export function clockTime(raw: string): string | undefined {
  const s = raw.trim();
  return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(s) ? s : undefined;
}

export function comparisonOperand(kind: ComparisonKind): "none" | "value" | "between" | "times" | "pattern" | "options" {
  switch (kind) {
    case "isOn": case "isOff": case "isUnavailable": case "isStale": case "isEmpty": return "none";
    case "between": return "between";
    case "timeBetween": return "times";
    case "matchesRegex": return "pattern";
    case "isOneOf": return "options";
    default: return "value";
  }
}

export function styleChangePayload(kind: StyleChangeKind): "none" | "value" | "number" | "weight" {
  switch (kind) {
    case "hide": case "show": return "none";
    case "setFontWeight": return "weight";
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin": case "setGaugeMax": case "setBorderWidth": return "number";
    default: return "value";
  }
}

export function newTest(): Test {
  return { id: newId(), value: literal(""), comparison: { kind: "isOn" } };
}

export function newCase(): RuleCase {
  return { id: newId(), when: { join: "all", tests: [newTest()] }, then: [] };
}

export function newRule(): Rule {
  return { id: newId(), cases: [newCase()] };
}

/** The value when it already reads as a clock time, else a literal fallback. */
function keptClock(v: Value | undefined, fallback: string): Value {
  if (v && (v.kind.kind !== "literal" || clockTime(v.kind.value) !== undefined)) return v;
  return literal(fallback);
}

/** Change the comparison kind, keeping an operand the new kind can still use. */
export function switchComparison(c: Comparison, kind: ComparisonKind): Comparison {
  const next: Comparison = { kind };
  switch (comparisonOperand(kind)) {
    case "value": next.value = c.value ?? literal(""); break;
    case "between": next.value = c.value ?? literal(""); next.upper = c.upper ?? literal(""); break;
    // A bound carried over from a numeric comparison ("20") is not a time, so the
    // window starts at the usual night hours rather than at something unreadable.
    case "times": next.value = keptClock(c.value, "22:00"); next.upper = keptClock(c.upper, "06:00"); break;
    case "pattern": next.pattern = c.pattern ?? ""; break;
    case "options": next.options = c.options ?? []; break;
    case "none": break;
  }
  return next;
}

export function newStyleChange(kind: StyleChangeKind): StyleChange {
  const c: StyleChange = { kind };
  switch (styleChangePayload(kind)) {
    case "value":
      c.value = literal(kind === "setColor" || kind === "setBorderColor" || kind === "setBackgroundColor" ? "#FF453A" : kind === "setIcon" ? "exclamationmark.triangle" : kind === "setGaugeValue" ? "50" : "Text");
      break;
    case "number":
      c.number = kind === "setOpacity" ? 0.5 : kind === "setFontSize" ? 14 : kind === "setBorderWidth" ? 2 : kind === "setGaugeMax" ? 100 : 0;
      break;
    case "weight": c.weight = "bold"; break;
    case "none": break;
  }
  return c;
}
