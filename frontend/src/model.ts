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
export type GaugeStyle = "ring" | "arc" | "bar" | "dots";
export type ChartStyle = "bars" | "line" | "area";
export type ChartScale = "auto" | "fixed";
export type ChartBaseline = "lowest" | "zero";
export type ChartHighlight = "none" | "highest" | "lowest" | "both";
export type ChartMarker = "none" | "dot" | "pointer";
export type ChartColoring = "uniform" | "bands";
/** Which number of a chart layer a `chartStat` value reads. The stats read the
 * series the chart draws, after `limit` has trimmed it; `top` and `bottom` are
 * the ends of the plot's range, which on a Fixed chart differ from the readings.
 * Mirrors `ChartStatSpec.Stat` in the app repo. */
export type ChartStat = "latest" | "highest" | "lowest" | "average" | "top" | "bottom";

export const CHART_STATS: readonly [ChartStat, string][] = [
  ["latest", "Newest reading"],
  ["highest", "Highest reading"],
  ["lowest", "Lowest reading"],
  ["average", "Average reading"],
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
   * Absent means `maxValue - minValue`. Ignored by every other style. */
  total?: Value;
}

export const GAUGE_DEFAULT_THRESHOLD_HEX = "#FFFFFF";
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
  /** Another chart layer whose range this one is drawn against, instead of its
   * own `scale`. Absent is the ordinary case and every chart before this.
   *
   * This is how two series share one plot: a second chart layer with the same
   * frame, its own value, colour, style and bands, borrowing the first one's
   * scale. A link to a chart that is not in the document, to this chart itself,
   * or one that closes a cycle falls back to this chart's own scale. */
  scaleFrom?: string;
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

export const CHART_HISTORY_MIN_POINTS = 2;
export const CHART_HISTORY_MAX_POINTS = 120;
/** `historyPoints` meaning "every recorded reading, no averaging". The server
 * returns the states themselves, newest `CHART_HISTORY_MAX_POINTS` kept. */
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
          ...(typeof p.thresholdValue === "number" && Number.isFinite(p.thresholdValue)
            ? { thresholdValue: p.thresholdValue }
            : {}),
          thresholdColorHex: str(p.thresholdColorHex, CHART_DEFAULT_THRESHOLD_HEX),
          ...(isObject(p.nowIndex) ? { nowIndex: parseValue(p.nowIndex) } : {}),
          nowColorHex: str(p.nowColorHex, CHART_DEFAULT_NOW_HEX),
          ...(optStr(p.scaleFrom) !== undefined ? { scaleFrom: optStr(p.scaleFrom)! } : {}),
        },
      };
    case "shape": {
      const el: ShapeElement = {
        ...parseElementBase(p, "#FFFFFF33"),
        kind: (optStr(p.kind) as ShapeKind | undefined) ?? "roundedRectangle",
        cornerRadius: num(p.cornerRadius, 6),
        thickness: num(p.thickness, 1),
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
 * default ("119.6 V"), because that is the number a glance wants whole; the
 * others sit beside a plot that already says what they are. Undefined when
 * `chartId` is not a chart. */
export function addChartLabel(cfg: CustomComplicationConfig, chartId: string, stat: ChartStat): string | undefined {
  const chart = cfg.elements.find((el) => el.payload.id === chartId);
  if (!chart || chart.kind !== "chart") return undefined;
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  const fontSize = stat === "latest" ? 10 : 8;
  const value: Value = { kind: { kind: "chartStat", layer: chartId, stat } };
  if (stat === "latest") value.format = { useEntityUnit: true };
  el.payload.value = value;
  el.payload.fontSize = fontSize;
  el.payload.fontWeight = "medium";
  el.payload.colorSlot = { baseColorHex: stat === "latest" ? "#FFFFFF" : "#FFFFFF99" };
  el.payload.frame = chartLabelFrame(chart.payload.frame, CHART_LABEL_SEATS[stat], fontSize, stat === "latest" ? 7 : 4);
  // Directly above the chart in z-order, so the number sits on the plot.
  const index = cfg.elements.findIndex((e) => e.payload.id === chartId);
  cfg.elements.splice(index + 1, 0, el);
  joinChartGroup(cfg, chart, el.payload.id);
  return el.payload.id;
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
        marker: c.marker,
        coloring: c.coloring,
        bands: c.bands.map((b) => ({ id: b.id, upTo: encNum(b.upTo), colorHex: b.colorHex })),
        bandAboveColorHex: c.bandAboveColorHex,
        fillBands: c.fillBands,
      };
      // The marks a chart can add over its plot, all omitted at their defaults so a
      // document that draws neither line is byte for byte what it always was. Same
      // order and same rule as the app's encoder.
      if (c.thresholdValue !== undefined) o.thresholdValue = encNum(c.thresholdValue);
      if (c.thresholdColorHex !== CHART_DEFAULT_THRESHOLD_HEX) o.thresholdColorHex = c.thresholdColorHex;
      if (c.nowIndex !== undefined) o.nowIndex = encodeValue(c.nowIndex);
      if (c.nowColorHex !== CHART_DEFAULT_NOW_HEX) o.nowColorHex = c.nowColorHex;
      if (c.scaleFrom !== undefined) o.scaleFrom = c.scaleFrom;
      return { kind: "chart", payload: o };
    }
    case "shape": {
      const o: J = { ...base(el.payload), kind: el.payload.kind, cornerRadius: encNum(el.payload.cornerRadius), borderWidth: encNum(el.payload.borderWidth) };
      if (el.payload.borderColorHex !== undefined) o.borderColorHex = el.payload.borderColorHex;
      // Same "only when it differs" rule as the app's encoder, so a shape that is
      // not a line writes exactly the bytes it always did.
      if (el.payload.thickness !== 1) o.thickness = encNum(el.payload.thickness);
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
  elementEnvelope: ["kind", "payload"],
  elementBase: ["id", "colorSlot", "rules", "frame", "isHidden", "groupId"],
  text: ["value", "fontSize", "fontWeight", "countdown"],
  icon: ["symbol", "size"],
  gauge: ["value", "minValue", "maxValue", "style", "lineWidth", "trackColorHex",
    "coloring", "bands", "bandAboveColorHex", "thresholdValue", "thresholdColorHex", "total"],
  chart: ["value", "historyMinutes", "historyPoints", "style", "limit", "takeFromEnd", "scale", "minValue", "maxValue",
    "baseline", "barGap", "lineWidth", "highlight", "highColorHex", "lowColorHex", "marker",
    "coloring", "bands", "bandAboveColorHex", "fillBands",
    "thresholdValue", "thresholdColorHex", "nowIndex", "nowColorHex", "scaleFrom",
    // Written only on 2026-09-05. The band bounds are read forward by
    // `parseChartBands`; the built-in numbers are read forward by
    // `migrateChartLabels` into text layers. All still listed so a document
    // saved that day does not read as carrying unknown keys.
    "bandLowColorHex", "bandHighColorHex", "bandLowerBound", "bandUpperBound",
    "scaleLabels", "scaleLabelPlacement", "latestLabel",
    "topLabelStyle", "bottomLabelStyle", "latestLabelStyle", "latestLabelFollowsBand",
    "scaleLabelColorHex"],
  shape: ["kind", "cornerRadius", "thickness", "borderColorHex", "borderWidth"],
  // `timestampStyle` is retired (the age style, built and removed 2026-09-04).
  // It stays listed so a document saved while it existed does not read as
  // corrupt; nothing decodes it, and it leaves the wire on that document's next
  // save.
  image: ["entity", "source", "timestamp", "contentMode", "zoom", "panX", "panY", "cornerRadius",
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
  // The last three belong to `callService` only; the entity four are its optional
  // target, the same keys every entity action uses.
  tapAction: ["type", "entityId", "displayName", "domain", "iconName",
    "serviceDomain", "serviceName", "serviceDataJSON"],
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
      rules(e.payload.rules, `${ep}.payload.rules`);
      for (const vk of ["value", "symbol", "nowIndex", "total"]) if (vk in e.payload) value(e.payload[vk], `${ep}.payload.${vk}`);
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
    case "gauge": return { kind, payload: { ...base("#FFFFFF"), value: literal("50"), minValue: 0, maxValue: 100, style: "arc", lineWidth: 4, trackColorHex: "#FFFFFF40", coloring: "uniform", bands: [], bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX, thresholdColorHex: GAUGE_DEFAULT_THRESHOLD_HEX } };
    // A new chart is set to draw history: nearly every chart is of a plain
    // sensor, and a plain sensor's own value is one bar. Until an entity is
    // named the sample list draws instead, so the layer is never blank.
    case "chart": return { kind, payload: { ...base("#FFFFFF"), value: literal("13,14,16,17,19,22,24,28,30"), historyMinutes: CHART_HISTORY_DEFAULT_MINUTES, historyPoints: 24, style: "bars", limit: 0, takeFromEnd: false, scale: "auto", minValue: 0, maxValue: 100, baseline: "lowest", barGap: 1.5, lineWidth: 2, highlight: "none", highColorHex: CHART_DEFAULT_HIGH_HEX, lowColorHex: CHART_DEFAULT_LOW_HEX, marker: "pointer", coloring: "uniform", bands: [], bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX, fillBands: false, thresholdColorHex: CHART_DEFAULT_THRESHOLD_HEX, nowColorHex: CHART_DEFAULT_NOW_HEX } };
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
    case "shape": return undefined;
    case "image": return undefined;
    case "tap": return undefined;
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
  // A chart's numbers name it by id, so without the chart they would print the
  // placeholder forever. They go with it, the way an attached tap does.
  for (const label of chartLabelsOf(cfg, id)) removeElement(cfg, label.payload.id);
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
 * Put copied layers on one shape, without copying the layers themselves.
 *
 * A layer belongs to the document and every shape may draw it, so a copy
 * taken on one shape and pasted on another is not a duplicate: it is "show
 * these here, laid out the way they are there". Ids the document no longer
 * holds are skipped. Returns the rows that landed, attached taps left out the
 * same way a paste leaves them out.
 */
export function placeElements(cfg: CustomComplicationConfig, clip: LayerClip, family: FamilyKind): string[] {
  if (!DRAWABLE_FAMILIES.includes(family)) return [];
  let layout = cfg.perFamily[family];
  if (!layout) {
    layout = defaultLayout();
    cfg.perFamily[family] = layout;
  }
  // The first placement in a shape freezes every other layer where it already
  // is, the same as the first drag does, so the layers not being copied do
  // not silently start following someone else's frames.
  if (Object.keys(layout.placements).length === 0) {
    for (const el of cfg.elements) {
      layout.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: el.payload.isHidden };
    }
  }
  const here = new Set(cfg.elements.map((el) => el.payload.id));
  const from = clip.family === undefined ? undefined : clip.placements[clip.family];
  const landed: string[] = [];
  for (const src of clip.elements) {
    const id = src.payload.id;
    if (!here.has(id)) continue;
    const p = from?.[id];
    // The size travels even when the source shape never set one, so the refit
    // has something to scale and the layer does not arrive at the size it
    // happened to be given on a canvas of another width.
    const size = p?.size ?? elementSize(src);
    const base: Placement = {
      frame: { ...(p?.frame ?? src.payload.frame) },
      isHidden: false,
      ...(size !== undefined ? { size } : {}),
    };
    layout.placements[id] = clip.family === undefined ? base : refitPlacement(base, clip.family, family, src.kind);
    landed.push(id);
  }
  return landed.filter((id) => {
    const el = cfg.elements.find((e) => e.payload.id === id);
    return el !== undefined && !isAttachedTap(cfg, el);
  });
}

/**
 * Put copied layers into a document on top of the draw order, under fresh ids.
 * Links between copied layers (a tap's owner, a number's chart, a shared group)
 * point at the copies. A number whose chart is neither copied nor in this
 * document is left out, since it could only ever print its placeholder. The
 * copies are nudged when their originals are still here, so a paste over the
 * original shows, the way a duplicate does. Returns the ids of the pasted
 * rows: every copy that is not an attached tap.
 */
export function pasteElements(cfg: CustomComplicationConfig, clip: LayerClip): string[] {
  const idMap = new Map<string, string>();
  for (const el of clip.elements) idMap.set(el.payload.id, newId());
  const here = new Set(cfg.elements.map((el) => el.payload.id));
  const nudge = clip.elements.some((el) => here.has(el.payload.id));
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
    if (copy.kind === "text" && copy.payload.value.kind.kind === "chartStat") {
      const chart = idMap.get(copy.payload.value.kind.layer);
      if (chart) copy.payload.value.kind.layer = chart;
      else if (!here.has(copy.payload.value.kind.layer)) continue;
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
