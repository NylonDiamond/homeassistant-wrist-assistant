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
export type GaugeStyle = "ring" | "arc" | "bar";
export type ChartStyle = "bars" | "line" | "area";
export type ChartScale = "auto" | "fixed";
export type ChartBaseline = "lowest" | "zero";
export type ChartHighlight = "none" | "highest" | "lowest" | "both";
export type ChartMarker = "none" | "dot" | "pointer";
export type ChartColoring = "uniform" | "bands";
export type ChartScaleLabels = "none" | "top" | "range";
export type ChartLabelPlacement = "gutter" | "overlay";
export type ChartLatestLabel = "none" | "corner" | "end";
export type ShapeKind = "rectangle" | "roundedRectangle" | "capsule" | "circle";
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
  | { kind: "named"; id: string };

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

export interface ColorSlot {
  baseColorHex: string;
}

export type ComparisonKind =
  | "equals" | "notEquals" | "isOn" | "isOff" | "isUnavailable" | "isStale" | "isEmpty"
  | "greaterThan" | "greaterOrEqual" | "lessThan" | "lessOrEqual" | "between"
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
}

export interface IconElement extends ElementBase {
  symbol: Value;
  size: number;
}

export interface GaugeElement extends ElementBase {
  value: Value;
  minValue: number;
  maxValue: number;
  style: GaugeStyle;
  lineWidth: number;
  trackColorHex: string;
}

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
  marker: ChartMarker;
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
  /** Which end of the plot's range is printed as a number beside it. Without
   * this a chart is a shape with no units: a reader can see that the line went
   * up but not what it went up to. */
  scaleLabels: ChartScaleLabels;
  /** Whether the scale labels take a strip of their own or sit over the marks. */
  scaleLabelPlacement: ChartLabelPlacement;
  /** How each printed number looks. Three separate styles rather than one
   * shared one: the top of a range and the reading happening right now are
   * different statements, and a chart that wants the newest number loud and the
   * scale quiet is the normal case rather than the odd one. */
  topLabelStyle: ChartLabelStyle;
  bottomLabelStyle: ChartLabelStyle;
  latestLabelStyle: ChartLabelStyle;
  /** Whether the newest reading's number takes its own band colour instead of
   * `latestLabelStyle`'s. On by default, so a banded chart's number and the mark
   * it names agree without anyone setting two colours to match. */
  latestLabelFollowsBand: boolean;
  /** Where the newest reading is printed, if at all. The scale says what the
   * chart covers; this says where the entity is right now. */
  latestLabel: ChartLatestLabel;
}

/** How one of a chart's printed numbers looks.
 *
 * The pill is an optional colour rather than a flag plus a colour: a pill with
 * no colour is not a thing, and one field cannot get into a state the other
 * contradicts. Mirrors `ChartElement.ChartLabelStyle` in the app repo. */
export interface ChartLabelStyle {
  fontSize: number;
  colorHex: string;
  /** Fill of the rounded plate behind the text. Absent draws the number
   * straight onto whatever is behind it. */
  pillColorHex?: string;
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
export const CHART_DEFAULT_SCALE_LABEL_HEX = "#FFFFFF99";

/** Point size a chart's numbers start at, and the range they may be set to.
 * Mirrors `defaultLabelFontSize` and friends in Swift. */
export const CHART_LABEL_SIZE = 8;
export const CHART_LABEL_MIN_SIZE = 5;
export const CHART_LABEL_MAX_SIZE = 24;

/** Padding between a label's text and the edge of its pill, in design-box
 * points. Shared with the app so both reserve the same room. */
export const CHART_LABEL_PILL_PAD_X = 2.5;
export const CHART_LABEL_PILL_PAD_Y = 1.5;

/** Point size actually drawn. Below the floor a number stops being readable on
 * the wrist; above the ceiling one label eats a tile 65 points tall. */
export function chartLabelFontSize(style: ChartLabelStyle): number {
  const raw = Number(style.fontSize);
  if (!Number.isFinite(raw)) return CHART_LABEL_SIZE;
  return Math.min(CHART_LABEL_MAX_SIZE, Math.max(CHART_LABEL_MIN_SIZE, raw));
}

/** How wide one printed number is, in design-box points.
 *
 * Estimated from the character count rather than measured, because the widget,
 * the watch and this panel all have to reserve the same room and only one of
 * them can measure text. Mirrors `labelWidth` in Swift. */
export function chartLabelWidth(text: string, fontSize: number, pill: boolean): number {
  if (text.length === 0) return 0;
  return text.length * fontSize * 0.62 + (pill ? CHART_LABEL_PILL_PAD_X * 2 : 2);
}

/** How tall one printed number is, pill included. Mirrors `labelHeight`. */
export function chartLabelHeight(fontSize: number, pill: boolean): number {
  return fontSize + (pill ? CHART_LABEL_PILL_PAD_Y * 2 : 0);
}

/** The colour table in reading order, whatever order the author typed it in.
 * Mirrors `sortedBands` in Swift. */
export function chartSortedBands(el: ChartElement): ChartBand[] {
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

/** How one end of the scale reads.
 *
 * Decimal places come from the span, not from the number, so both ends carry
 * the same shape: a half-degree spread printing "21" twice would look broken,
 * and a 3000 mV reading with two decimals would not fit. Mirrors
 * `scaleLabelText` in Swift. */
export function chartScaleLabelText(value: number, span: number): string {
  const magnitude = Math.abs(span);
  const places = magnitude >= 10 ? 0 : magnitude >= 1 ? 1 : 2;
  return value.toFixed(places);
}


/** History spans the editor offers, in minutes. Free entry is deliberately not
 * offered: every distinct span is another recorder query shape for the server
 * to answer and for the watch to cache. Mirrors `historySpanChoices` in Swift. */
export const CHART_HISTORY_SPANS: readonly { minutes: number; label: string }[] = [
  { minutes: 60, label: "Last hour" },
  { minutes: 180, label: "Last 3 hours" },
  { minutes: 360, label: "Last 6 hours" },
  { minutes: 720, label: "Last 12 hours" },
  { minutes: 1440, label: "Last 24 hours" },
  { minutes: 4320, label: "Last 3 days" },
  { minutes: 10_080, label: "Last 7 days" },
];

export const CHART_HISTORY_MIN_POINTS = 2;
export const CHART_HISTORY_MAX_POINTS = 120;

/** Clamped point count. Mirrors `resolvedHistoryPoints` in Swift, and the
 * server clamps to the same range, so all three agree on the cache key. */
export function chartHistoryPoints(el: ChartElement): number {
  const raw = Math.round(el.historyPoints);
  if (!Number.isFinite(raw)) return 24;
  return Math.max(CHART_HISTORY_MIN_POINTS, Math.min(CHART_HISTORY_MAX_POINTS, raw));
}

/** The entity whose history a chart draws, when it draws history at all.
 *
 * Only a directly named entity counts. A `.named` reference or a template is
 * not followed, because the fetch happens in the watch's widget extension long
 * before any resolver exists to dereference it. Mirrors `usesHistory` and
 * `historyEntity` in Swift. */
export function chartHistoryEntity(el: ChartElement): string | undefined {
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
  return `${entityId}|${Math.round(el.historyMinutes)}|${chartHistoryPoints(el)}`;
}

/** One string standing for every history query a config asks for.
 *
 * The panel compares this between edits to know when a refetch is owed. It
 * cannot use the compiled Jinja document for that: a history chart contributes
 * no Jinja at all, so a document that did not change says nothing about whether
 * a chart was retargeted or its span widened. */
export function chartHistorySignature(config: CustomComplicationConfig): string {
  return chartHistoryRequests(config).map((r) => r.key).sort().join(";");
}

/** Every distinct history query a config needs, deduped. What the panel sends
 * to the `history_series` websocket command. */
export function chartHistoryRequests(
  config: CustomComplicationConfig
): { key: string; entityId: string; minutes: number; points: number }[] {
  const seen = new Map<string, { key: string; entityId: string; minutes: number; points: number }>();
  for (const el of config.elements) {
    if (el.kind !== "chart") continue;
    const key = chartHistoryKey(el.payload);
    const entityId = chartHistoryEntity(el.payload);
    if (key === undefined || entityId === undefined || seen.has(key)) continue;
    seen.set(key, {
      key,
      entityId,
      minutes: Math.round(el.payload.historyMinutes),
      points: chartHistoryPoints(el.payload),
    });
  }
  return [...seen.values()];
}

export interface ShapeElement extends ElementBase {
  kind: ShapeKind;
  cornerRadius: number;
  borderColorHex?: string;
  borderWidth: number;
}

/** A camera snapshot, aspect-filled into its frame. No colorSlot: photos have no
 * tint. The watch fetches the pixels through op=snapshot; the panel previews the
 * camera's own entity_picture URL. */
/** How a snapshot meets its frame: `fill` crops it, `fit` shows all of it. */
export type ImageContentMode = "fill" | "fit";
export type ImageTimestampCorner = "topLeading" | "topTrailing" | "bottomLeading" | "bottomTrailing";

export const IMAGE_DEFAULT_CORNER_RADIUS = 6;
export const IMAGE_DEFAULT_TIMESTAMP_SIZE = 9;
export const IMAGE_TIMESTAMP_CORNERS: ImageTimestampCorner[] = ["topLeading", "topTrailing", "bottomLeading", "bottomTrailing"];

export interface ImageElement extends Omit<ElementBase, "colorSlot"> {
  entity: EntityRef;
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

export type Element =
  | { kind: "text"; payload: TextElement }
  | { kind: "icon"; payload: IconElement }
  | { kind: "gauge"; payload: GaugeElement }
  | { kind: "chart"; payload: ChartElement }
  | { kind: "shape"; payload: ShapeElement }
  | { kind: "image"; payload: ImageElement }
  | { kind: "tap"; payload: TapElement };

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

export type TapAction =
  | { type: "none" | "refresh" | "openApp" | "openPage" | "openRoomPage" | "timerStartPause" | "timerCancel" }
  | ({ type: "toggleEntity" | "runScene" | "runScript" | "addTodo" | "runHTTPAction" } & EntityRef);

/** The human name of every tap action, in the order the pickers offer them.
 * It lives here rather than beside the picker because the preview labels tap
 * boxes with the same words in review mode, and the renderer cannot import the
 * editors (they already import it). */
export const TAP_ACTION_LABELS: [TapAction["type"], string][] = [
  ["refresh", "Refresh"], ["none", "Nothing"], ["openApp", "Open the app"], ["openPage", "Open the page"], ["openRoomPage", "Open the room page"],
  ["timerStartPause", "Timer start / pause"], ["timerCancel", "Timer cancel"],
  ["toggleEntity", "Toggle an entity"], ["runScene", "Run a scene"], ["runScript", "Run a script"], ["addTodo", "Add a to-do"], ["runHTTPAction", "Run an HTTP action"],
];

/** One-line description of a tap action, for hints and for the review-mode
 * labels in the preview. */
export function describeTapAction(action: TapAction): string {
  const label = TAP_ACTION_LABELS.find(([t]) => t === action.type)?.[1] ?? action.type;
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
    case "between":
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
    return rule;
  });
}

function parseColorSlot(o: unknown, fallback: string): ColorSlot {
  return { baseColorHex: isObject(o) ? str(o.baseColorHex, fallback) : fallback };
}

/** One label's look, falling back to the single colour the first cut of scale
 * labels wrote (2026-09-05) when the payload has no style of its own. Nothing
 * back then had a size or a plate to lose, so both start at the default. */
function parseChartLabelStyle(raw: unknown, payload: J): ChartLabelStyle {
  const inherited = str(payload.scaleLabelColorHex, CHART_DEFAULT_SCALE_LABEL_HEX);
  if (!isObject(raw)) return { fontSize: CHART_LABEL_SIZE, colorHex: inherited };
  const out: ChartLabelStyle = {
    fontSize: num(raw.fontSize, CHART_LABEL_SIZE),
    colorHex: str(raw.colorHex, inherited),
  };
  if (typeof raw.pillColorHex === "string") out.pillColorHex = raw.pillColorHex;
  return out;
}

/** A chart's colour table, reading the two-bound shape forward when that is all
 * the payload has.
 *
 * The first cut of banded colour (2026-09-05) had exactly two bounds and painted
 * the middle with the layer's own colour. "Under lower" and "between the bounds"
 * become two rows; "over upper" is what the table falls through to. A reading
 * sitting exactly on the lower bound moves from the middle colour to the low
 * one, which is the single value the two spellings disagree on. */
function parseChartBands(p: J): ChartBand[] {
  if (Array.isArray(p.bands)) {
    return p.bands.filter(isObject).map((b) => ({
      id: str(b.id, newId()),
      upTo: num(b.upTo, 0),
      colorHex: str(b.colorHex, "#FFFFFF"),
    }));
  }
  if (typeof p.bandLowerBound !== "number") return [];
  const slot = isObject(p.colorSlot) ? str(p.colorSlot.baseColorHex, "#FFFFFF") : "#FFFFFF";
  return [
    { id: newId(), upTo: p.bandLowerBound, colorHex: str(p.bandLowColorHex, CHART_DEFAULT_BAND_LOW_HEX) },
    { id: newId(), upTo: num(p.bandUpperBound, 100), colorHex: slot },
  ];
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
      return { kind: "text", payload };
    }
    case "icon":
      return {
        kind: "icon",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          symbol: isObject(p.symbol) ? parseValue(p.symbol) : literal("lightbulb"),
          size: num(p.size, 14),
        },
      };
    case "gauge":
      return {
        kind: "gauge",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          value: isObject(p.value) ? parseValue(p.value) : literal("50"),
          minValue: num(p.minValue, 0),
          maxValue: num(p.maxValue, 100),
          style: (optStr(p.style) as GaugeStyle | undefined) ?? "arc",
          lineWidth: num(p.lineWidth, 4),
          trackColorHex: str(p.trackColorHex, "#FFFFFF40"),
        },
      };
    case "chart":
      return {
        kind: "chart",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          value: isObject(p.value) ? parseValue(p.value) : literal("13,14,16,17,19,22,24,28,30"),
          historyMinutes: Math.max(0, Math.round(num(p.historyMinutes, 0))),
          historyPoints: Math.round(num(p.historyPoints, 24)),
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
          coloring: (optStr(p.coloring) as ChartColoring | undefined) ?? "uniform",
          bands: parseChartBands(p),
          bandAboveColorHex: str(p.bandHighColorHex, str(p.bandAboveColorHex, CHART_DEFAULT_BAND_HIGH_HEX)),
          fillBands: p.fillBands === true,
          scaleLabels: (optStr(p.scaleLabels) as ChartScaleLabels | undefined) ?? "none",
          scaleLabelPlacement: (optStr(p.scaleLabelPlacement) as ChartLabelPlacement | undefined) ?? "gutter",
          topLabelStyle: parseChartLabelStyle(p.topLabelStyle, p),
          bottomLabelStyle: parseChartLabelStyle(p.bottomLabelStyle, p),
          latestLabelStyle: parseChartLabelStyle(p.latestLabelStyle, p),
          latestLabelFollowsBand: p.latestLabelFollowsBand !== false,
          latestLabel: (optStr(p.latestLabel) as ChartLatestLabel | undefined) ?? "none",
        },
      };
    case "shape": {
      const el: ShapeElement = {
        ...parseElementBase(p, "#FFFFFF33"),
        kind: (optStr(p.kind) as ShapeKind | undefined) ?? "roundedRectangle",
        cornerRadius: num(p.cornerRadius, 6),
        borderWidth: num(p.borderWidth, 1),
      };
      if (typeof p.borderColorHex === "string") el.borderColorHex = p.borderColorHex;
      return { kind: "shape", payload: el };
    }
    case "image": {
      const { colorSlot: _unused, ...base } = parseElementBase(p, "#FFFFFF");
      const el: ImageElement = {
        ...base,
        entity: parseEntityRef(isObject(p.entity) ? p.entity : {}),
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
  pruneGroups(cfg);
  return cfg;
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

function encodeChartLabelStyle(s: ChartLabelStyle): J {
  const o: J = { fontSize: encNum(s.fontSize), colorHex: s.colorHex };
  if (s.pillColorHex !== undefined) o.pillColorHex = s.pillColorHex;
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
    case "between":
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
    return o;
  });
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
      return { kind: "text", payload: o };
    }
    case "icon":
      return { kind: "icon", payload: { ...base(el.payload), symbol: encodeValue(el.payload.symbol), size: encNum(el.payload.size) } };
    case "gauge":
      return {
        kind: "gauge",
        payload: {
          ...base(el.payload),
          value: encodeValue(el.payload.value),
          minValue: encNum(el.payload.minValue),
          maxValue: encNum(el.payload.maxValue),
          style: el.payload.style,
          lineWidth: encNum(el.payload.lineWidth),
          trackColorHex: el.payload.trackColorHex,
        },
      };
    case "chart":
      return {
        kind: "chart",
        payload: {
          ...base(el.payload),
          value: encodeValue(el.payload.value),
          historyMinutes: Math.max(0, Math.round(el.payload.historyMinutes)),
          historyPoints: Math.round(el.payload.historyPoints),
          style: el.payload.style,
          limit: Math.max(0, Math.round(el.payload.limit)),
          takeFromEnd: el.payload.takeFromEnd,
          scale: el.payload.scale,
          minValue: encNum(el.payload.minValue),
          maxValue: encNum(el.payload.maxValue),
          baseline: el.payload.baseline,
          barGap: encNum(el.payload.barGap),
          lineWidth: encNum(el.payload.lineWidth),
          highlight: el.payload.highlight,
          highColorHex: el.payload.highColorHex,
          lowColorHex: el.payload.lowColorHex,
          marker: el.payload.marker,
          coloring: el.payload.coloring,
          bands: el.payload.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex })),
          bandAboveColorHex: el.payload.bandAboveColorHex,
          fillBands: el.payload.fillBands,
          scaleLabels: el.payload.scaleLabels,
          scaleLabelPlacement: el.payload.scaleLabelPlacement,
          topLabelStyle: encodeChartLabelStyle(el.payload.topLabelStyle),
          bottomLabelStyle: encodeChartLabelStyle(el.payload.bottomLabelStyle),
          latestLabelStyle: encodeChartLabelStyle(el.payload.latestLabelStyle),
          latestLabelFollowsBand: el.payload.latestLabelFollowsBand,
          latestLabel: el.payload.latestLabel,
        },
      };
    case "shape": {
      const o: J = { ...base(el.payload), kind: el.payload.kind, cornerRadius: encNum(el.payload.cornerRadius), borderWidth: encNum(el.payload.borderWidth) };
      if (el.payload.borderColorHex !== undefined) o.borderColorHex = el.payload.borderColorHex;
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
  format: ["decimals", "multiply", "offset", "prefix", "suffix", "useEntityUnit", "relativeTime", "textCase"],
  entityRef: ["entityId", "displayName", "domain", "iconName"],
  aggregate: ["function", "scope", "stateFilter", "attribute"],
  scope: ["kind", "entities", "domains", "areaIds", "labelIds", "floorIds"],
  stateFilter: ["kind", "value"],
  frame: ["x", "y", "width", "height", "rotationDegrees"],
  elementEnvelope: ["kind", "payload"],
  elementBase: ["id", "colorSlot", "rules", "frame", "isHidden", "groupId"],
  text: ["value", "fontSize", "fontWeight", "countdown"],
  icon: ["symbol", "size"],
  gauge: ["value", "minValue", "maxValue", "style", "lineWidth", "trackColorHex"],
  chart: ["value", "historyMinutes", "historyPoints", "style", "limit", "takeFromEnd", "scale", "minValue", "maxValue",
    "baseline", "barGap", "lineWidth", "highlight", "highColorHex", "lowColorHex", "marker",
    "coloring", "bands", "bandAboveColorHex", "fillBands",
    "scaleLabels", "scaleLabelPlacement", "latestLabel",
    "topLabelStyle", "bottomLabelStyle", "latestLabelStyle", "latestLabelFollowsBand",
    // Written only on 2026-09-05 and read forward by `parseChartBands` and
    // `parseChartLabelStyle`. Still listed so a document saved that morning does
    // not read as carrying unknown keys.
    "bandLowColorHex", "bandHighColorHex", "bandLowerBound", "bandUpperBound",
    "scaleLabelColorHex"],
  shape: ["kind", "cornerRadius", "borderColorHex", "borderWidth"],
  // `timestampStyle` is retired (the age style, built and removed 2026-09-04).
  // It stays listed so a document saved while it existed does not read as
  // corrupt; nothing decodes it, and it leaves the wire on that document's next
  // save.
  image: ["entity", "timestamp", "contentMode", "zoom", "panX", "panY", "cornerRadius",
    "timestampCorner", "timestampSize", "timestampStyle", "timestampX", "timestampY"],
  // `grow` is retired (the uniform tap inflation, replaced by a resizable tap
  // box on 2026-09-04). Listed so a document saved while it existed still
  // opens; nothing decodes it, and it leaves the wire on that document's next
  // save. The tap's frames already carry what it did.
  tap: ["action", "openPageId", "openPageName", "attachedTo", "grow"],
  colorSlot: ["baseColorHex"],
  rule: ["id", "cases", "otherwise"],
  case: ["id", "when", "then"],
  condition: ["join", "tests"],
  test: ["id", "value", "comparison"],
  comparison: ["kind", "value", "upper", "pattern", "options"],
  styleChange: ["kind", "value", "number", "weight"],
  layout: ["placements", "bezelText", "bezelCountdown", "curvedText", "curvedColorHex", "bezelGauge", "backgroundColorHex", "cornerBodyShape", "borderColorHex", "borderWidth", "rules"],
  bezelGauge: ["value", "minValue", "maxValue", "colorHexes", "minLabel", "maxLabel"],
  placement: ["frame", "isHidden", "size"],
  tapAction: ["type", "entityId", "displayName", "domain", "iconName"],
  dataSource: ["kind", "entityId", "displayName", "domain", "iconName", "value"],
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
      rules(e.payload.rules, `${ep}.payload.rules`);
      for (const vk of ["value", "symbol"]) if (vk in e.payload) value(e.payload[vk], `${ep}.payload.${vk}`);
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
  if (Array.isArray(raw.dataSources)) raw.dataSources.forEach((d, i) => check(d, K.dataSource, `$.dataSources[${i}]`));
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
    case "gauge": return { kind, payload: { ...base("#FFFFFF"), value: literal("50"), minValue: 0, maxValue: 100, style: "arc", lineWidth: 4, trackColorHex: "#FFFFFF40" } };
    case "chart": return { kind, payload: { ...base("#FFFFFF"), value: literal("13,14,16,17,19,22,24,28,30"), historyMinutes: 0, historyPoints: 24, style: "bars", limit: 0, takeFromEnd: false, scale: "auto", minValue: 0, maxValue: 100, baseline: "lowest", barGap: 1.5, lineWidth: 2, highlight: "none", highColorHex: CHART_DEFAULT_HIGH_HEX, lowColorHex: CHART_DEFAULT_LOW_HEX, marker: "pointer", coloring: "uniform", bands: [], bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX, fillBands: false, scaleLabels: "none", scaleLabelPlacement: "gutter", topLabelStyle: { fontSize: CHART_LABEL_SIZE, colorHex: CHART_DEFAULT_SCALE_LABEL_HEX }, bottomLabelStyle: { fontSize: CHART_LABEL_SIZE, colorHex: CHART_DEFAULT_SCALE_LABEL_HEX }, latestLabelStyle: { fontSize: CHART_LABEL_SIZE, colorHex: CHART_DEFAULT_SCALE_LABEL_HEX }, latestLabelFollowsBand: true, latestLabel: "none" } };
    case "shape": return { kind, payload: { ...base("#FFFFFF33"), kind: "roundedRectangle", cornerRadius: 6, borderWidth: 1 } };
    case "image": {
      const { colorSlot: _unused, ...b } = base("#FFFFFF");
      return {
        kind,
        payload: {
          ...b,
          entity: { entityId: "", displayName: "", domain: "camera" },
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
    case "shape": return undefined;
    case "image": return { kind: { kind: "entityState", ...el.payload.entity } };
    case "tap": return undefined;
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
      for (const family of DRAWABLE_FAMILIES) {
        const layout = cfg.perFamily[family];
        if (!layout) continue;
        const box = DESIGN_BOX[family as "rectangular" | "circular" | "corner"];
        const p = layout.placements[ownerId];
        if (pushed) {
          // Pushed out, the shared frame is inflated by the wrong ratio for
          // this shape, so the tap needs a placement here even where the owner
          // has none: it is the only way to say the right fraction.
          const base = p?.frame ?? owner.payload.frame;
          const isHidden = p?.isHidden ?? owner.payload.isHidden;
          layout.placements[tap.payload.id] = { frame: outsetFrame(base, outset, box), isHidden };
        } else if (p) {
          layout.placements[tap.payload.id] = { frame: { ...p.frame }, isHidden: p.isHidden };
        } else {
          // No placement for the owner means it uses the shared frame here, and
          // so must the tap: an override left behind would strand it.
          delete layout.placements[tap.payload.id];
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
  detachTaps(cfg, id);
  cfg.elements = cfg.elements.filter((el) => el.payload.id !== id);
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
      return kind === "text" || kind === "gauge" || kind === "chart" ? { ...value, kind: { kind: "entityState", ...ref } } : undefined;
    default:
      return undefined;
  }
}

/**
 * Point a layer at an entity: its own content where that is safe (see
 * `rebindValue`), and the target of the tap attached to it. Rule tests are
 * deliberately left alone; the states table owns those.
 */
export function setLayerEntity(cfg: CustomComplicationConfig, layerId: string, ref: EntityRef): void {
  const el = cfg.elements.find((e) => e.payload.id === layerId);
  // An empty reference is not an edit. The field is derived, so there is no
  // "no entity" to store: clearing it would only blank the layer's content,
  // and deleting the layer is what someone means by that.
  if (!el || ref.entityId === "") return;
  const full: EntityRef = { ...ref, domain: ref.domain || ref.entityId.split(".")[0] || "" };
  if (el.kind === "image") {
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
  shape: ["color", "opacity", "borderColor", "borderWidth", "rotation", "visibility"],
  image: ["opacity", "rotation", "visibility"],
  tap: ["visibility"],
  layout: ["backgroundColor", "borderColor", "borderWidth", "text"],
};

export const COMPARISON_KINDS: ComparisonKind[] = [
  "isOn", "isOff", "equals", "notEquals", "isUnavailable", "isStale", "isEmpty",
  "greaterThan", "greaterOrEqual", "lessThan", "lessOrEqual", "between",
  "contains", "startsWith", "endsWith", "matchesRegex", "isOneOf",
];

export function comparisonOperand(kind: ComparisonKind): "none" | "value" | "between" | "pattern" | "options" {
  switch (kind) {
    case "isOn": case "isOff": case "isUnavailable": case "isStale": case "isEmpty": return "none";
    case "between": return "between";
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

/** Change the comparison kind, keeping an operand the new kind can still use. */
export function switchComparison(c: Comparison, kind: ComparisonKind): Comparison {
  const next: Comparison = { kind };
  switch (comparisonOperand(kind)) {
    case "value": next.value = c.value ?? literal(""); break;
    case "between": next.value = c.value ?? literal(""); next.upper = c.upper ?? literal(""); break;
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
