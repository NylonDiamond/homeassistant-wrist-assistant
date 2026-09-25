// Port of Shared/CustomComplicationRendering.swift (ResolveContext, format,
// comparisons, rule precedence) and CustomComplicationConfig.elements(for:).
// See docs/custom_complication_schema_v4.md §7 for the semantics each
// function mirrors. Known tolerances vs Swift: `matchesRegex` uses the JS
// engine instead of ICU. `%.Nf` is `fixedDecimals` (rounds first, then toFixed).

import {
  type Comparison,
  type Condition,
  type CustomComplicationConfig,
  type Element,
  type FamilyKind,
  type FontWeight,
  type FontDesign,
  type FontWidth,
  type LayerShadow,
  type Level,
  type LevelDirection,
  LEVEL_TRACK_FADE,
  fadeHex,
  clampLayerOpacity,
  clampMinimumScale,
  TEXT_MAX_LINES,
  TEXT_MIN_SCALE,
  type ChartBaseline,
  chartEndMarkers,
  type ChartEndMarker,
  type ChartMarker,
  type ChartScale,
  type ChartStyle,
  type GaugeStyle,
  type ImageContentMode,
  type ImageSource,
  type ImageTimestampCorner,
  type InlineLayout,
  type ControlKind,
  type ControlSpec,
  controlEffectiveKind,
  controlIsOn,
  type NamedValue,
  type NormalizedFrame,
  type Rule,
  type ShapeKind,
  type StyleChange,
  type StyleProperty,
  type TapAction,
  type TextAlignment,
  type Test,
  type Value,
  type ValueFormat,
  type ChartElement,
  type ChartStat,
  type TimelineElement,
  type ChartTimesElement,
  chartTimesFontDesign,
  type TimelineHourCycle,
  type TimelineMinuteStyle,
  TIMELINE_HISTORY_POINTS,
  timeLabelPositions,
  timelineBandColor,
  timelineHistoryKey,
  timelineHistoryMinutes,
  type CornerBodyShape,
  type EntityRef,
  GAUGE_MAX_DOTS,
  STYLE_PROPERTY,
  chartBandColor,
  chartHistoryKey,
  chartStatisticsKey,
  chartShowsTimeLabels,
  clampTimeLabelCount,
  chartStatText,
  chartTrendGlyph,
  chartSortedBands,
  chartUsesBands,
  CHART_DEFAULT_BAND_HIGH_HEX,
  CHART_DEFAULT_HIGH_HEX,
  CHART_DEFAULT_LOW_HEX,
  type TextElement,
  type TextPart,
  ARC_SWEEP_DEFAULT,
  clampArcSpacing,
  clampArcSweep,
  familyAllowsArcText,
  textColorsByValue,
  textUsesParts,
  clockTime,
  elementsFor,
  elementsOnPage,
  formatIsEmpty,
  hasFreeTimestamp,
  DESIGN_BOX,
  type ChartAnchor,
  type ChartAnchorPoint,
  chartAnchorIsColumn,
  TIMELINE_MIN_LABEL_SIZE,
  TIMELINE_MAX_LABEL_SIZE,
  type Fill,
  GAUGE_DEFAULT_LABEL_HEX,
  GAUGE_DEFAULT_LABEL_SIZE,
  GAUGE_DEFAULT_TICK_HEX,
  GAUGE_DEFAULT_TICK_LENGTH,
  type ListElement,
  type ListSource,
  type TimestampStyle,
  clampListGap,
  clampListRows,
  ITEM_PLACEHOLDER_PREFIX,
  listGrid,
  withPlacement,
} from "./model.js";
import {
  type DrawableFamily,
  DRAWABLE_FAMILIES,
  CUSTOM_SVG_SYMBOL,
  inlineImageBytes,
  inlineImageUrl,
  chartBarBorderWidth,
  chartBarColors,
  chartBarCorners,
  chartBarRadius,
  type ChartBarCorners,
  type ChartDotsMode,
  chartDotsMode,
  chartFillStyle,
  chartGridColorHex,
  chartGridLayerLines,
  chartGridThickness,
  chartPointDotSize,
  chartSmoothing,
  chartSmoothingWindowSize,
  type ChartSmoothing,
  type ChartCurve,
  type ChartFillStyle,
} from "./model.js";
import { keyFor, listExpressionKey, listKey, normaliseScalar } from "./compiler.js";
import { CALENDAR_ITEM_ICON, TODO_ITEM_ICON, entityItemIcon, forecastItemIcon } from "./list-icons.js";

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
  /** Recorder series for the layers that draw history, keyed by
   * `chartHistoryKey` for a chart and `timelineHistoryKey` for a timeline. A
   * missing key draws an empty layer, which is what the watch does too before
   * its first fetch lands. */
  historySeries?: Map<string, string>;
  /** The items each list drew, as the JSON text of one reply, keyed the way
   * `historySeries` is. A Jinja-backed list is not here: its items arrive in
   * the value document under its `e_` key like any other computed value, and
   * the resolver reads them out of `templateResults`. A service-backed list is
   * keyed by its readable form (`listKey`), the same string the websocket
   * request and the reply are keyed by. A missing key draws no cells, which is
   * what the watch does before its first fetch lands. */
  listItems?: Map<string, string>;
  namedValues: NamedValue[];
  /** Seconds since the value cache was written; undefined = never synced. */
  dataAgeSeconds?: number;
  stalenessThresholdSeconds?: number;
  /** Injectable clock for countdown resolution (epoch ms); defaults to Date.now(). */
  nowMs?: number;
  /** Panel only, never the watch: entities whose state in `entityStates` is a
   * value typed in to test the preview. A history chart of one ends on that
   * value, so its last bar and every number read from it follow the test. */
  testedEntities?: ReadonlySet<string>;
  /** Which locale the `timestamp` format prints in. Undefined follows the
   * device, which is what every watch and every browser wants; a fixture that
   * has to pin the printed text names one so the answer is the same on every
   * machine that runs it. */
  locale?: string;
  /** Which zone the `timestamp` format prints in, as an IANA name ("UTC",
   * "Europe/London"). Undefined follows the device, as it does on the wrist. A
   * fixture pinning an hour names one as well as a locale: without it the same
   * unix second reads as a different hour on every machine. */
  timeZone?: string;
  /** Which page of a paged document to resolve, 1-based. Undefined is page 1,
   * which is every document with no pages. A layer pinned to another page is
   * dropped before it is resolved, so nothing reads its entities, exactly as
   * `elements(for:page:)` does on the watch. Inline has no pages and is fed
   * every layer whatever this says. See `PagesSpec` in model.ts. */
  page?: number;
  /** Gallery picture only, never the watch: every picture layer draws as a
   * stand-in with no address, so a timestamp on one reads this context's
   * clock as though the picture had just been fetched. Without it the
   * timestamp would print nothing and the preview would lose it. */
  pictureStandIns?: boolean;
  /** Panel only: the moment a picture's timestamp reads (epoch ms), held still
   * so the preview does not tick every second. The panel moves it on save and
   * on a demo tap. Undefined reads the clock, as the gallery picture does. */
  pictureTimeMs?: number;
}

export interface ResolvedBase {
  id: string;
  isHidden: boolean;
  frame: NormalizedFrame;
  opacity: number;
  /** The drop shadow behind this layer, straight off the element. Absent means
   * none, which is every layer that never asked for one. */
  shadow?: LayerShadow;
  /** The chart reading this layer follows, carried through so the renderer can
   * put it over that reading. The frame here is still the author's: the anchor
   * only ever decides where it lands, and the width and height stay theirs. */
  chartAnchor?: ChartAnchor;
  /** Set only on a layer the document put in the accent group, so the tinted
   * preview can paint it in the accent color. Absent is the default group. */
  accentGroup?: "accent";
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
  /** Fixed-width digits, straight off the element. No rule changes it. */
  monospacedDigits: boolean;
  /** 1 to 4. Straight off the element. */
  lineLimit: number;
  /** The typeface, after any `setFontDesign` rule. */
  fontDesign: FontDesign;
  /** How wide the letters are cut, after any `setFontWidth` rule. */
  fontWidth: FontWidth;
  /** Slanted text, after any `setItalic` rule. */
  italic: boolean;
  /** How far the text may shrink before it truncates. Straight off the element. */
  minimumScale: number;
  /** Which edge of the layer box the text sits against. Straight off the element. */
  alignment: TextAlignment;
  /** The text cut into runs of one color, when the layer colors its numbers by
   * value (`textColorsByValue`). Joined, the runs spell `text` exactly. Absent
   * when the whole text is `colorHex`, which is every layer that does not ask. */
  spans?: TextSpan[];
  /** Rich text: every visible part, in order, each in its own look. Absent when
   * the layer is not drawn as parts (it has none, it is a countdown, or a layer
   * rule set the text); empty when every part is hidden. With parts, `text` is
   * their texts joined, the layer's size, weight and color are what a part set
   * to the layer's look takes, and `spans` is absent. */
  parts?: ResolvedTextPart[];
  /** Curved text, already settled against the shape: `radius` is in design-box
   * points rather than the wire's fraction, so the renderers do no shape maths
   * of their own. Absent on every straight layer, on every shape outside
   * `ARC_TEXT_FAMILIES`, and on a countdown, which ticks as one system-drawn
   * string and cannot be cut into glyphs. Mirrors `ResolvedText.Arc` in the app
   * repo. */
  arc?: ResolvedTextArc;
}
/** A settled arc. `angle` is where the middle of the text sits and `sweep` how
 * far round it may spread, both in degrees, 0 at 12 o'clock and clockwise
 * positive; `spacing` is extra room between letters in design points; `flip`
 * turns the letters over for a line along the bottom. */
export interface ResolvedTextArc {
  /** Design-box points. */
  radius: number;
  angle: number;
  sweep: number;
  spacing: number;
  flip: boolean;
  /** How far from the frame's centre the middle of the text sits, in design-box
   * points: half the frame's shorter side, whatever the radius. The circle's
   * centre moves along `angle` by `anchor - radius`, so the radius bends the
   * text in place instead of pushing it away. */
  anchor: number;
}
/** One visible part of a rich text layer. Mirrors `ResolvedText.Part` in the
 * app repo, key for key. */
export interface ResolvedTextPart {
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontDesign: FontDesign;
  fontWidth: FontWidth;
  italic: boolean;
  colorHex: string;
  /** The part's text cut into runs by its own band table, with no highlight.
   * Absent when the part is one color. */
  spans?: TextSpan[];
}
/** One run of a text layer drawn in one color. Mirrors `ResolvedText.Span` in
 * the app repo. */
export interface TextSpan {
  text: string;
  colorHex: string;
}
/**
 * A level after its reading settled: how much of the layer is filled, from
 * which edge, and what the rest is painted in.
 *
 * The track color is settled here rather than at draw time, so both renderers
 * start from one hex and a fixture can pin it. Mirrors
 * `CustomComplication.ResolvedLevel` in the app repo.
 */
export interface ResolvedLevel {
  /** 0...1. 0 when the reading is missing or is not a number, which draws the
   * track alone. */
  fraction: number;
  direction: LevelDirection;
  /** The unfilled part's color, never absent: the level's own track color, or
   * the layer's color faded. */
  trackColorHex: string;
}

export interface ResolvedIcon extends ResolvedBase {
  kind: "icon";
  symbol: string;
  /** The SVG `d` to draw instead of an SF Symbol, when the layer's symbol is a
   * Material Design icon the author picked by hand. Absent for everything else,
   * including a symbol an entity or a rule supplied: those name SF Symbols, and
   * the layer's stored path describes a glyph that is no longer shown. A path
   * the author pasted is here too, under the same key. */
  path?: string;
  /** The box `path` is drawn in, "minX minY width height". Absent is the
   * catalogue's 24x24. Carried only while `path` is drawn. */
  viewBox?: string;
  size: number;
  colorHex: string;
  /** How far the glyph is filled. Absent draws it whole. */
  level?: ResolvedLevel;
}
export interface ResolvedGauge extends ResolvedBase {
  kind: "gauge";
  fraction: number;
  style: GaugeStyle;
  lineWidth: number;
  colorHex: string;
  trackColorHex: string;
  /** Where the threshold tick sits, as a 0...1 fraction of the scale. Absent when
   * there is no threshold or it falls outside the range: a value the gauge cannot
   * show is not drawn at an edge, where it would read as a threshold already met. */
  thresholdFraction?: number;
  thresholdColorHex: string;
  /** How many dots a `dots` gauge draws, and how many of them are filled. Settled
   * here so the renderer never parses a value. */
  dotCount: number;
  filledCount: number;
  /** The gradient along the track, absent when the gauge draws one flat color.
   * A band's color or a rule's color drops it: both are statements about this
   * reading, and a gradient is not. */
  fill?: Fill;
  /** The marks around the scale. `tickCount` 0 draws none. */
  tickCount: number;
  tickLength: number;
  tickColorHex: string;
  tickMajorEvery: number;
  /** The end text and, on a needle, the reading under the pointer. */
  showsLabels: boolean;
  labelSize: number;
  labelColorHex: string;
  /** The ends of the scale as resolved, so a label can print them without
   * repeating the range maths. */
  minValue: number;
  maxValue: number;
  /** The reading as text, for the label under a needle. Empty when the gauge's
   * value resolved to nothing. */
  valueText: string;
}
/** A chart with its series already parsed and its scale already decided.
 * Mirrors `CustomComplication.ResolvedChart` in the app repo. */
export interface ResolvedChart extends ResolvedBase {
  kind: "chart";
  values: number[];
  /** Parallel to `values`, true where the slot was unavailable; empty when
   * none is. A hole carries the reading before it, draws nothing, and is
   * skipped by highlights and stats. */
  holes: boolean[];
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
  /** The shared marker as stored. Nothing draws from it any more; it is kept
   * because the shared fixtures pin it. */
  marker: ChartMarker;
  /** The mark each end draws. "none" for an end the highlight does not cover,
   * whatever the layer stores for it, so a marker never shows without its
   * highlight. */
  highMarker: ChartEndMarker;
  lowMarker: ChartEndMarker;
  /** One color per reading, parallel to `values`. Empty when the whole series
   * is one color, which keeps the common case free of a second array. */
  pointColorHexes: string[];
  /** Whether an area's fill follows `pointColorHexes` too. */
  fillBands: boolean;
  /** How line and area join their readings; see `chartLegs`. Carried for bars
   * too, which ignore it. */
  curve: ChartCurve;
  /** The smoothing strength `values` was already run through, "off" for none. */
  smoothing: ChartSmoothing | "off";
  /** How an area fills under its line. Carried for every style. */
  fillStyle: ChartFillStyle;
  /** The fill's own color; absent fills in the series or band color. */
  fillColorHex?: string;
  /** The gradient under a line or area, beating `fillColorHex`. Bars ignore it. */
  areaFill?: Fill;
  /** A bar's corner radius as stored (default 1.2), clamped to the bar when drawn. */
  barRadius: number;
  /** Which corners of a bar are rounded. */
  barCorners: ChartBarCorners;
  /** The border drawn inside each bar's outline, clamped 0…6. 0 when off, and
   * always 0 for line and area. */
  barBorderWidth: number;
  /** Each bar's fill color, parallel to `values`. Empty for line and area. */
  barFillColorHexes: string[];
  /** Each bar's border color, parallel to `values`. Empty unless the chart is
   * bars with a border. */
  barBorderColorHexes: string[];
  /** Whether the border leaves out each bar's baseline end. Only true while a
   * border draws. */
  barBorderOpenBase: boolean;
  /** The largest diameter among this chart's `chartDots` layers that are shown
   * on this shape and actually draw. The plot's stroke inset grows to half of
   * it, so the dots at the edges are not clipped. Absent when none draws. Set by
   * `settleChartDots`. */
  dotDiameter?: number;
  /** Where the threshold line sits, as a fraction of the plot from the bottom.
   * Absent when the chart has no threshold, or when a fixed scale puts it off
   * the plot; the renderer then draws no line rather than one on an edge. */
  thresholdY?: number;
  thresholdColorHex: string;
  /** False when the threshold line is a layer. `thresholdY` is still set,
   * because that layer's anchor reads it. */
  drawsThreshold: boolean;
  /** Which reading the "now" line stands on, already rounded and clamped into
   * `values`. Absent when the chart has no `nowIndex` or nothing resolved. */
  nowIndex?: number;
  nowColorHex: string;
  /** False when the "now" line is a layer. `nowIndex` is still set. */
  drawsNowLine: boolean;
  /** The clock times printed along the span, already formatted: the timeline's
   * own row, drawn beside the plot. Empty when the layer asks for none, and
   * when the plot has no window to label or no evenly spaced slots to label it
   * against (`chartShowsTimeLabels`). */
  labels: TimelineLabel[];
  labelSize: number;
  labelColorHex: string;
  labelsAbove: boolean;
}

/** What a chart settled on before anything is drawn: the series it draws,
 * trimmed, and the range it is drawn against. A `chartStat` value reads its
 * number from here, so the number a text layer prints and the mark the chart
 * draws come from one calculation. Mirrors `CustomComplication.ChartReadings`. */
export interface ChartReadings {
  values: number[];
  /** Parallel to `values`: true where the server marked the slot unavailable.
   * A hole's value is the reading before it (or the first reading, for leading
   * holes), so ranges need no special case. Empty when there are none. */
  holes: boolean[];
  domainMin: number;
  domainMax: number;
  /** The entity the chart reads, when it names one, so a stat can carry the
   * entity's unit through `useEntityUnit`. */
  entity?: EntityRef;
}

/** The number one stat resolves to, or undefined when there is nothing to
 * read: an empty series has no newest reading and no average. Mirrors
 * `ChartReadings.value(of:)`. */
export function chartStatValue(r: ChartReadings, stat: ChartStat): number | undefined {
  // Holes carry a value only so the plot has somewhere to put them; no stat
  // counts one, so "latest" is the newest real reading and an average is not
  // weighted by an outage.
  const values = r.holes.length === 0 ? r.values : r.values.filter((_, i) => !r.holes[i]);
  if (values.length === 0) return undefined;
  switch (stat) {
    case "latest": return values[values.length - 1];
    case "highest": return Math.max(...values);
    case "lowest": return Math.min(...values);
    case "average": return values.reduce((a, b) => a + b, 0) / values.length;
    case "top": return r.domainMax;
    case "bottom": return r.domainMin;
    case "first": return values[0];
    case "delta": return values[values.length - 1]! - values[0]!;
    case "sum": return values.reduce((a, b) => a + b, 0);
    case "trend": {
      // The sign of the change, but only after the change has been rounded the
      // way every other number off this chart is rounded. Without that deadband
      // a series that wobbled in the last decimal place the chart does not even
      // print would still read as rising.
      const change = values[values.length - 1]! - values[0]!;
      const rounded = Number(chartStatText(change, r.domainMax - r.domainMin));
      if (rounded > 0) return 1;
      if (rounded < 0) return -1;
      return 0;
    }
  }
}
/** One stretch of a timeline in one color. `start` and `end` are fractions of
 * the frame's width, oldest at 0 and newest at 1. Mirrors
 * `CustomComplication.ResolvedTimeline.Run` in the app repo. */
export interface TimelineRun {
  start: number;
  end: number;
  colorHex: string;
}

/** A strip of recorded states, already cut into runs and already merged, so
 * the renderer draws one rectangle per run and decides nothing. Mirrors
 * `CustomComplication.ResolvedTimeline`. */
export interface ResolvedTimeline extends ResolvedBase {
  kind: "timeline";
  runs: TimelineRun[];
  /** Design-box points between runs, and the radius of each one. Carried
   * straight off the payload: no rule changes either. */
  gap: number;
  cornerRadius: number;
  /** The clock times printed along the span, already formatted. Empty when the
   * layer asks for none, or when it names no entity and so has no window. */
  labels: TimelineLabel[];
  labelSize: number;
  labelColorHex: string;
  labelsAbove: boolean;
}

/** A chart's clock times drawn as a layer of their own: the row the chart
 * would print, at fractions of this layer's width, centred in its height.
 * Empty when the linked chart is missing, is not a chart, or has no times to
 * print. Mirrors `CustomComplication.ResolvedChartTimes` in the app repo. */
export interface ResolvedChartTimes extends ResolvedBase {
  kind: "chartTimes";
  labels: TimelineLabel[];
  labelSize: number;
  labelColorHex: string;
  /** The layer's font, its absent keys settled to the row's own look. */
  fontWeight: FontWeight;
  fontDesign: FontDesign;
  fontWidth: FontWidth;
  italic: boolean;
  monospacedDigits: boolean;
}

/** A picture's timestamp as a layer of its own. `image` is the link as written.
 * The text size comes from the frame when drawn. The watch carries the
 * picture's fetched-at time here; the preview has no fetch of its own, so it
 * carries the picture's live URL instead, and draws the time now. Mirrors
 * `CustomComplication.ResolvedImageTime` in the app repo. */
export interface ResolvedImageTime extends ResolvedBase {
  kind: "imageTime";
  image: string;
  /** Whether the link names a picture in the document. False draws nothing. */
  linked: boolean;
  /** The linked picture's preview URL. Absent while it has none. */
  url?: string;
  /** Drawn for a gallery picture, where the picture is a stand-in: the chip
   * shows as fetched though there is no URL. */
  standIn?: boolean;
}

/** A chart's reading dots as a layer of their own. `frame` is the chart's own
 * frame on this shape, because the dots draw in the chart's box. Mirrors
 * `CustomComplication.ResolvedChartDots` in the app repo. */
export interface ResolvedChartDots extends ResolvedBase {
  kind: "chartDots";
  /** The chart layer's id. */
  chart: string;
  dots: ChartDotsMode;
  /** The size the layer stores, clamped into 1…12; absent when it stores none. */
  size?: number;
  /** The effective diameter: `size`, or the chart's line width times
   * `CHART_DOT_SCALE`. 0 when the chart is missing. */
  diameter: number;
  /** Every dot's color; absent paints each in the series color at its reading. */
  colorHex?: string;
  /** The readings that get a dot, oldest first: holes and the readings the chart
   * marks with its own highlight dot left out. Empty when the layer draws
   * nothing: no chart, bars, or `auto` finding the readings too close. */
  indices: number[];
}

/** A chart's grid lines as a layer of their own, drawn across the chart's plot
 * in the chart's box. Mirrors `CustomComplication.ResolvedChartGrid`. */
export interface ResolvedChartGrid extends ResolvedBase {
  kind: "chartGrid";
  chart: string;
  lines: number;
  colorHex: string;
  thickness: number;
  /** True when its chart is on this shape and has readings. */
  draws: boolean;
}

/** One clock time under (or over) a timeline. `position` is a fraction of the
 * frame's width, 0 at the window's start and 1 at now. Mirrors
 * `ResolvedTimeline.Label` in the app repo. */
export interface TimelineLabel {
  position: number;
  text: string;
}

/** Up to three hours the minute matters, past that it is noise: an eight hour
 * strip reading "9 PM, 11 PM, 1 AM, 3 AM" says more than the same row with
 * ":36" on every one of them. What `minutes: "auto"` decides on. */
const TIMELINE_LABEL_MINUTES_MAX_SECONDS = 3 * 60 * 60;

/** The `Intl` options a row of times is formatted with: the hour always, the
 * minute when the layer asks for it or the span is short enough to want it, and
 * a forced clock only when the layer names one. Mirrors the format style
 * `timelineLabelFormat` builds in the app repo. */
function timeLabelFormat(
  hourCycle: TimelineHourCycle,
  minutes: TimelineMinuteStyle,
  spanSeconds: number,
): Intl.DateTimeFormat {
  const showsMinutes = minutes === "always"
    || (minutes === "auto" && spanSeconds <= TIMELINE_LABEL_MINUTES_MAX_SECONDS);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    ...(showsMinutes ? { minute: "2-digit" as const } : {}),
    ...(hourCycle === "h12" ? { hourCycle: "h12" as const } : {}),
    ...(hourCycle === "h24" ? { hourCycle: "h23" as const } : {}),
  });
}

/**
 * One row of clock times, oldest first: a position and the time that falls
 * there.
 *
 * Built from the window and the clock alone, never from the data, so a layer
 * still waiting on its history still knows what times it will cover. The right
 * edge is always now and the left edge is `now - span`, whichever layer asked.
 * Shared by the timeline and the chart, and mirrors `timeLabels` in the app
 * repo.
 */
export function timeLabels(
  spanSeconds: number,
  positions: number[],
  hourCycle: TimelineHourCycle,
  minutes: TimelineMinuteStyle,
  nowMs: number,
): TimelineLabel[] {
  if (spanSeconds <= 0 || positions.length === 0) return [];
  const format = timeLabelFormat(hourCycle, minutes, spanSeconds);
  return positions.map((position) => ({
    position,
    text: format.format(new Date(nowMs - spanSeconds * 1000 * (1 - position))),
  }));
}

/** The clock times one timeline prints. A layer naming no entity has no window
 * at all and prints nothing. Mirrors `timelineLabels` in the app repo. */
export function timelineLabels(el: TimelineElement, nowMs: number): TimelineLabel[] {
  if (timelineHistoryKey(el) === undefined) return [];
  return timeLabels(
    timelineHistoryMinutes(el) * 60,
    timeLabelPositions(el.timeLabelCount),
    el.hourCycle,
    el.minutes,
    nowMs,
  );
}

/** The clock times one chart prints.
 *
 * Nothing outside history: a chart drawing the value it holds has no time axis
 * at all, and one asking for every recorded reading has an axis that jumps, so
 * the times would be right at the two edges and wrong everywhere between them.
 * Mirrors `chartLabels` in the app repo. */
export function chartLabels(el: ChartElement, nowMs: number): TimelineLabel[] {
  if (!chartShowsTimeLabels(el)) return [];
  // Clamped here as well as on the way in and out of the document, because a
  // count is also a number somebody can type: the watch clamps it where it
  // draws, so the preview has to draw the same row.
  return timeLabels(
    Math.round(el.historyMinutes) * 60,
    timeLabelPositions(clampTimeLabelCount(el.timeLabelCount)),
    el.hourCycle,
    el.minutes,
    nowMs,
  );
}

/** The clock times a `chartTimes` layer prints: its chart's or its timeline's
 * span, read the way that layer reads it, at the times layer's own count, clock
 * and minutes. Nothing when the link is neither, or has no times to give.
 * Mirrors `chartTimesLabels` in the app repo. */
export function chartTimesLabels(el: ChartTimesElement, chart: ChartElement | undefined, nowMs: number, timeline?: TimelineElement): TimelineLabel[] {
  if (chart === undefined && timeline !== undefined) {
    if (timelineHistoryKey(timeline) === undefined) return [];
    return timeLabels(
      timelineHistoryMinutes(timeline) * 60,
      timeLabelPositions(clampTimeLabelCount(el.timeLabelCount)),
      el.hourCycle,
      el.minutes,
      nowMs,
    );
  }
  if (chart === undefined || !chartShowsTimeLabels(chart)) return [];
  return timeLabels(
    Math.round(chart.historyMinutes) * 60,
    timeLabelPositions(clampTimeLabelCount(el.timeLabelCount)),
    el.hourCycle,
    el.minutes,
    nowMs,
  );
}

export interface ResolvedShape extends ResolvedBase {
  kind: "shape";
  shapeKind: ShapeKind;
  cornerRadius: number;
  /** Only read for the `line` kind. */
  thickness: number;
  fillColorHex: string;
  /** The gradient over the body, absent when the shape draws one flat color. A
   * rule that recolored the shape drops it: the rule is a statement about this
   * moment and the gradient is not. */
  fill?: Fill;
  borderColorHex?: string;
  borderWidth: number;
  /** How far the body is filled. Absent draws the whole shape. */
  level?: ResolvedLevel;
}
export interface ResolvedImage extends ResolvedBase {
  kind: "image";
  entityId: string;
  /** Where the pixels come from, so the placeholder can name the right kind of
   * missing picture. */
  source: ImageSource;
  /** Preview URL: HA's entity_picture, or the `data:` URL of an inline
   * picture's own bytes. Absent = draw the placeholder. */
  url?: string;
  /** The decoded size of an inline picture, in bytes. Absent for a fetched
   * one. The editor reads it for the size next to the Upload button, and the
   * shared fixtures pin it against the app's own decode. */
  imageBytes?: number;
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
/** One cell of a list, and the row layers drawn inside it.
 *
 * `frame` is normalised inside the list's own frame, not the canvas: the
 * renderer translates into the list's box and then draws each cell's layers
 * against the cell. Mirrors `CustomComplication.ResolvedList.Cell` in the app
 * repo. */
export interface ResolvedCell {
  frame: NormalizedFrame;
  elements: ResolvedElement[];
}

/** A row template already drawn once per item: one cell per item, each holding
 * the row's layers resolved against that item. Empty cells when the items have
 * not arrived or could not be read, which is the answer a chart gives before
 * its first fetch. Mirrors `CustomComplication.ResolvedList`. */
export interface ResolvedList extends ResolvedBase {
  kind: "list";
  cells: ResolvedCell[];
}

export interface ResolvedTap extends ResolvedBase {
  kind: "tap";
  action: TapAction;
  openPageId?: string;
  /** The layer this tap belongs to, if any. Carried only so the editor's
   * preview can leave an attached tap undrawn; the watch ignores it. */
  attachedTo?: string;
}
export type ResolvedElement = ResolvedText | ResolvedIcon | ResolvedGauge | ResolvedChart | ResolvedTimeline | ResolvedShape | ResolvedImage | ResolvedTap | ResolvedChartTimes | ResolvedChartDots | ResolvedChartGrid | ResolvedImageTime | ResolvedList;

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
  /** The gradient behind the whole shape, beating `backgroundColorHex`. A shape
   * rule that set the background color drops it. */
  backgroundFill?: Fill;
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

/** Seconds out of whatever a duration value arrives as: a plain number, or the
 * string Home Assistant prints a `timedelta` as, which is what a timer entity's
 * `remaining` and `duration` attributes carry ("0:23:15", "2 days, 3:04:05").
 * Anything else is undefined, and `formatValue` then leaves the string alone
 * rather than printing a wrong "0s".
 *
 * Mirrors `CustomComplication.durationSeconds(from:)` in Swift. `leadingNumber`
 * is deliberately not used: it would read 0 out of "0:23:15". */
export function durationSeconds(raw: string): number | undefined {
  let text = raw.trim();
  const plain = swiftDouble(text);
  if (plain !== undefined) return plain;

  let days = 0;
  const comma = text.indexOf(",");
  if (comma >= 0) {
    const words = text.slice(0, comma).trim().split(" ");
    const count = words.length === 2 ? swiftDouble(words[0]!) : undefined;
    if (count === undefined || (words[1] !== "day" && words[1] !== "days")) return undefined;
    days = count;
    text = text.slice(comma + 1).trim();
  }

  const parts = text.split(":");
  if (parts.length !== 2 && parts.length !== 3) return undefined;
  let seconds = 0;
  for (let i = 0; i < parts.length; i++) {
    const n = swiftDouble(parts[i]!);
    if (n === undefined) return undefined;
    // The last component is the seconds, the one before it minutes, and so on,
    // so "23:15" is 23 minutes and 15 seconds.
    seconds += n * Math.pow(60, parts.length - 1 - i);
  }
  return days * 86400 + seconds;
}

/** A length of time as its two largest non-zero units: "2d 3h", "1h 23m",
 * "23m 15s", "45s", "0s". Mirrors `CustomComplication.durationString` in Swift,
 * including its cap: the watch converts to a 32-bit `Int`, so a value that is
 * really a millisecond timestamp is clamped rather than left to trap. */
export function durationString(seconds: number): string {
  const total = Math.trunc(Math.min(Math.max(0, seconds) || 0, 9999 * 86400));
  const units: [number, string][] = [
    [Math.trunc(total / 86400), "d"],
    [Math.trunc((total % 86400) / 3600), "h"],
    [Math.trunc((total % 3600) / 60), "m"],
    [total % 60, "s"],
  ];
  const parts = units.filter(([v]) => v > 0).slice(0, 2).map(([v, s]) => `${v}${s}`);
  return parts.length === 0 ? "0s" : parts.join(" ");
}

function capitalized(s: string): string {
  return s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/** What a clock-bearing timestamp leaves out, and whether it adds seconds. All
 * default to false, which is the clock to the minute. Mirrors `hideMinutes`,
 * `hideDayPeriod` and `showSeconds` on `ValueFormat`. */
export interface TimestampTrim {
  minutes?: boolean;
  dayPeriod?: boolean;
  /** Add the seconds (`2:46:29 PM`). Ignored when `minutes` is set. */
  seconds?: boolean;
}

/** Unix seconds printed as a time, in one of the four styles.
 *
 * The hour cycle is the device's, so the same document reads `9:30 AM` on one
 * watch and `09:30` on the next, which is what the wearer set. The zone is the
 * device's too, unless one is named: a fixture pinning an hour has to fix both
 * or it would pass only on the machine that wrote it. A style this build does
 * not know prints the seconds unchanged, the way an unknown typeface draws in
 * the system one. Swift uses `Date.FormatStyle` with the same fields. */
export function timestampString(
  seconds: number,
  style: TimestampStyle,
  locale?: string,
  timeZone?: string,
  trim?: TimestampTrim,
): string {
  const date = new Date(seconds * 1000);
  if (!Number.isFinite(date.getTime())) return String(seconds);
  const zone = timeZone !== undefined ? { timeZone } : {};
  if (style === "date") return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", ...zone }).format(date);
  if (style === "weekday") return new Intl.DateTimeFormat(locale, { weekday: "short", ...zone }).format(date);
  const day = style === "dateTime" ? { weekday: "short" as const } : {};
  // Seconds only with minutes: `5 PM` with seconds and no minutes means nothing.
  const second = trim?.seconds && !trim.minutes ? { second: "2-digit" as const } : {};
  const numeric = new Intl.DateTimeFormat(locale, { ...day, hour: "numeric", minute: "2-digit", ...second, ...zone });
  // A 24-hour locale pads the hour ("09:30"), a 12-hour one does not ("9:30 AM").
  // `Intl` leaves both unpadded under `numeric`, where `Date.FormatStyle` pads
  // the 24-hour one, so the padding is asked for explicitly on that side.
  const fmt = numeric.resolvedOptions().hour12 !== false
    ? numeric
    : new Intl.DateTimeFormat(locale, { ...day, hour: "2-digit", minute: "2-digit", ...second, ...zone });
  if (!trim?.minutes && !trim?.dayPeriod) return fmt.format(date);
  return trimClockParts(fmt.formatToParts(date), trim);
}

/** The formatted clock with whole fields taken out of it.
 *
 * Neither `Intl.DateTimeFormat` nor `Date.FormatStyle` will print an hour with
 * no minutes that keeps the day period, or a 12-hour time with no AM at all: a
 * hour-only skeleton is a different pattern in every locale, and gives `17 Uhr`
 * in German and a padded `05` in en-US. So the full clock is formatted and the
 * unwanted fields are lifted out of it, which keeps the locale's own hour
 * digits, separator and word order. Swift does exactly this over the runs of
 * `Date.FormatStyle.attributedStyle`, and the two agree character for character.
 *
 * A field takes its separator with it: the one in front when it has one, so
 * `5:30 PM` loses `:30` and not the space before `PM`, otherwise the one behind,
 * which is what a locale that leads with the day period needs. */
function trimClockParts(parts: Intl.DateTimeFormatPart[], trim: TimestampTrim): string {
  const drop = new Set<string>([...(trim.minutes ? ["minute"] : []), ...(trim.dayPeriod ? ["dayPeriod"] : [])]);
  const keep = parts.map(() => true);
  parts.forEach((p, i) => {
    if (!drop.has(p.type)) return;
    keep[i] = false;
    const before = parts[i - 1];
    const after = parts[i + 1];
    if (before?.type === "literal" && keep[i - 1]) keep[i - 1] = false;
    else if (after?.type === "literal") keep[i + 1] = false;
  });
  return parts.filter((_, i) => keep[i]).map((p) => p.value).join("").trim();
}

/**
 * `value` printed with `decimals` places, ties rounded half away from zero and a
 * result that rounds to zero printed without its sign. Mirrors
 * `CustomComplication.fixedDecimals`: bare `toFixed` rounds -22.5 to "-22" and the
 * watch's printf rounds 22.5 to "22", so both sides round first, the same way
 * (22.5 → "23", -22.5 → "-23", -0.4 → "0"). Past 1e15 there is nothing to round.
 */
export function fixedDecimals(value: number, decimals: number): string {
  const places = Math.min(100, Math.max(0, Math.trunc(decimals)));
  let rounded = value;
  const factor = Math.pow(10, Math.min(places, 15));
  if (Number.isFinite(value) && places <= 15 && Math.abs(value * factor) < 1e15) {
    rounded = (Math.sign(value) * Math.round(Math.abs(value) * factor)) / factor;
  }
  if (rounded === 0) rounded = 0; // folds -0
  return rounded.toFixed(places);
}

export function formatValue(
  raw: string,
  format: ValueFormat | undefined,
  unit: string | undefined,
  locale?: string,
  timeZone?: string,
): string {
  if (formatIsEmpty(format)) return raw;
  const f = format!;
  let text = raw;
  const trimmedNumber = swiftDouble(raw.trim());
  const durationValue = f.duration ? durationSeconds(raw) : undefined;
  if (durationValue !== undefined) {
    text = durationString(durationValue);
  } else if (f.relativeTime && trimmedNumber !== undefined) {
    text = relativeTimeString(trimmedNumber);
  } else if (f.timestamp !== undefined && trimmedNumber !== undefined) {
    // After the two that also read a number, and only when the value is one: a
    // field holding a title rather than a time prints exactly what it says.
    text = timestampString(trimmedNumber, f.timestamp, locale, timeZone, {
      minutes: f.hideMinutes,
      dayPeriod: f.hideDayPeriod,
      seconds: f.showSeconds,
    });
  } else {
    const n = leadingNumber(raw);
    if (n !== undefined) {
      const scaled = n * (f.multiply ?? 1) + (f.offset ?? 0);
      if (f.decimals !== undefined) {
        text = fixedDecimals(scaled, f.decimals);
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
  return numberTokens(raw, limit).map((t) => t.value);
}

/** A fetched recorder series with its holes kept in place. */
export interface ChartSeries {
  values: number[];
  /** Parallel to `values`, or empty when nothing is a hole. */
  holes: boolean[];
}

/** A series the server fetched (history or statistics), read so that an empty
 * field is a hole rather than squashed out of the axis: `12.1,,13.0` is three
 * slots. Every other field is read with `chartNumbers`, so junk is skipped as
 * it always was. A hole takes the value of the reading before it, and leading
 * holes the first reading; a series with no readings at all is empty.
 *
 * Only for fetched series. Text layers and typed-in values keep `chartNumbers`,
 * which treats an empty field as a separator. Mirrors the watch's series parser. */
export function chartSeriesWithHoles(raw: string, limit = 240): ChartSeries {
  const slots: (number | undefined)[] = [];
  for (const field of raw.split(",")) {
    if (slots.length >= limit) break;
    if (field.trim() === "") {
      slots.push(undefined);
      continue;
    }
    for (const n of chartNumbers(field, limit - slots.length)) slots.push(n);
  }
  const firstReal = slots.find((v) => v !== undefined);
  if (firstReal === undefined) return { values: [], holes: [] };
  const values: number[] = [];
  const holes: boolean[] = [];
  let carried = firstReal;
  for (const slot of slots) {
    if (slot === undefined) {
      values.push(carried);
      holes.push(true);
    } else {
      carried = slot;
      values.push(slot);
      holes.push(false);
    }
  }
  return { values, holes: normaliseHoles(holes) };
}

/** `holes` as the resolved chart carries it: empty when none is set. */
export function normaliseHoles(holes: boolean[]): boolean[] {
  return holes.some((h) => h) ? holes : [];
}

/** One number read out of a string, and where it sits. `start` and `end` are
 * offsets into the string (UTF-16 code units, `end` exclusive), so
 * `raw.slice(start, end)` is the characters the number was read from. */
export interface NumberToken {
  value: number;
  start: number;
  end: number;
}

/** Every number in a string with its place in the string. The one tokenizer
 * behind both `chartNumbers` and a text layer's color by value, so a chart and
 * the text printed under it can never disagree about what counts as a number. */
export function numberTokens(raw: string, limit = 240): NumberToken[] {
  const out: NumberToken[] = [];
  let token = "";
  let start = 0;
  let previousWasNumeric = false;
  let at = 0;

  const flush = () => {
    if (token !== "") {
      const parsed = Number(token);
      // Every character a token can hold is one code unit, so its length is
      // its width in the string.
      if (Number.isFinite(parsed)) out.push({ value: parsed, start, end: start + token.length });
    }
    token = "";
  };

  for (const ch of raw) {
    if (out.length >= limit) break;
    if (ch >= "0" && ch <= "9") {
      if (token === "") start = at;
      token += ch;
      previousWasNumeric = true;
    } else if (ch === ".") {
      // A second dot ends the reading rather than making it unparseable.
      if (token.includes(".")) flush();
      if (token === "") start = at;
      token += ".";
      previousWasNumeric = true;
    } else if (ch === "-" || ch === "+") {
      const isSign = !previousWasNumeric;
      flush();
      if (isSign) {
        start = at;
        token = ch;
      }
      previousWasNumeric = false;
    } else {
      flush();
      previousWasNumeric = false;
    }
    at += ch.length;
  }
  if (out.length < limit) flush();
  return out;
}

/** The keys a run of text is colored by value from: a whole text layer's, or
 * one part's, which carries the table and never a highlight. */
export type TextValueColoring = Pick<TextElement, "coloring" | "bands" | "bandAboveColorHex" | "highlight" | "highColorHex" | "lowColorHex">;

/**
 * A text layer's color by value: the text cut into runs of one color.
 *
 * Numbers are read with `numberTokens`, exactly as a chart reads its series.
 * The highlight picks one number per end the way a chart picks its highIndex
 * and lowIndex: the first occurrence of the largest and of the smallest, and
 * when that is the same number the highest wins. A number then takes the
 * highest color, else the lowest color, else its band when the table is in
 * use, else the layer color. Everything that is not a number keeps the layer
 * color, a trailing dot included. Neighbouring runs of the same color are one
 * run, and no run is empty: text with no numbers is one run in the layer color,
 * and empty text is no runs at all.
 *
 * A part of a rich text layer is read the same way with its own table and no
 * highlight, since a part has none.
 *
 * Mirrors `CustomComplication.textSpans` in Swift.
 */
/**
 * The layer's arc settled against the shape it is being drawn in, or undefined
 * when it does not curve here.
 *
 * Three things drop it: no `arc` key, a shape that is not one of
 * `ARC_TEXT_FAMILIES`, and a countdown, whose ticking string is drawn by the
 * system as one run and cannot be cut into glyphs. The radius arrives as a
 * fraction of the layer frame's shorter side and leaves as design-box points,
 * so both renderers place glyphs from the same number and a drag on the frame's
 * handles grows the circle.
 *
 * Mirrors `CustomComplication.resolvedArc` in the app repo.
 */
export function resolvedTextArc(el: TextElement, family: FamilyKind): ResolvedTextArc | undefined {
  if (el.arc === undefined || el.countdown === true || !familyAllowsArcText(family)) return undefined;
  const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
  const side = Math.max(0, Math.min(el.frame.width * box.width, el.frame.height * box.height));
  return {
    radius: el.arc.radius * side,
    angle: el.arc.angle ?? 0,
    sweep: clampArcSweep(el.arc.sweep ?? ARC_SWEEP_DEFAULT),
    spacing: clampArcSpacing(el.arc.spacing ?? 0),
    flip: el.arc.flip === true,
    anchor: side / 2,
  };
}

export function textValueSpans(text: string, colorHex: string, el: TextValueColoring): TextSpan[] {
  const tokens = numberTokens(text);
  const values = tokens.map((t) => t.value);
  const highlight = el.highlight ?? "none";
  let high = -1;
  let low = -1;
  if (values.length > 0) {
    if (highlight === "highest" || highlight === "both") high = values.indexOf(Math.max(...values));
    if (highlight === "lowest" || highlight === "both") low = values.indexOf(Math.min(...values));
    if (low === high) low = -1;
  }
  const bands = el.coloring === "bands" ? chartSortedBands({ bands: el.bands ?? [] }) : [];
  const above = el.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX;
  const highHex = el.highColorHex ?? CHART_DEFAULT_HIGH_HEX;
  const lowHex = el.lowColorHex ?? CHART_DEFAULT_LOW_HEX;

  const spans: TextSpan[] = [];
  const push = (part: string, hex: string) => {
    if (part === "") return;
    const last = spans.at(-1);
    if (last && last.colorHex === hex) last.text += part;
    else spans.push({ text: part, colorHex: hex });
  };
  let at = 0;
  tokens.forEach((t, i) => {
    push(text.slice(at, t.start), colorHex);
    const hex = i === high ? highHex
      : i === low ? lowHex
      : bands.length > 0 ? chartBandColor(t.value, bands, above)
      : colorHex;
    // "costs 5." reads 5 with the full stop in its token, but the full stop is
    // punctuation, so the colored run ends at the last digit. A dot inside a
    // number ("5.5") is not trailing and stays in it.
    const end = text[t.end - 1] === "." ? t.end - 1 : t.end;
    push(text.slice(t.start, end), hex);
    at = end;
  });
  push(text.slice(at), colorHex);
  return spans;
}

/** The value range a chart's plot covers. Mirrors `CustomComplication.chartDomain`. */
export function chartDomain(
  values: number[],
  opts: { scale: ChartScale; minValue: number; maxValue: number; baseline: ChartBaseline; thresholdValue?: number },
): { min: number; max: number } {
  let lo: number;
  let hi: number;

  if (opts.scale === "fixed") {
    lo = Math.min(opts.minValue, opts.maxValue);
    hi = Math.max(opts.minValue, opts.maxValue);
  } else {
    lo = values.length > 0 ? Math.min(...values) : 0;
    hi = values.length > 0 ? Math.max(...values) : 1;
    // An auto scale exists to fit what is drawn, and the threshold line is drawn,
    // so it counts. A fixed scale is a range the author asked for on purpose, and
    // a threshold outside it draws nothing rather than moving the range.
    if (opts.thresholdValue !== undefined && Number.isFinite(opts.thresholdValue)) {
      lo = Math.min(lo, opts.thresholdValue);
      hi = Math.max(hi, opts.thresholdValue);
    }
  }

  if (opts.baseline === "zero") {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }

  if (!(hi > lo)) hi = lo + 1;
  return { min: lo, max: hi };
}

/** Where the threshold line lands, as a fraction of the plot from the bottom,
 * or undefined when there is no line to draw. A fixed scale that excludes the
 * threshold is the only way this comes back empty with a threshold set: an auto
 * scale has already grown to include it. Mirrors
 * `CustomComplication.chartThresholdFraction`. */
export function chartThresholdFraction(
  c: { thresholdValue?: number },
  lo: number,
  hi: number,
): number | undefined {
  const t = c.thresholdValue;
  if (t === undefined || !Number.isFinite(t) || !(hi > lo) || t < lo || t > hi) return undefined;
  return (t - lo) / (hi - lo);
}

/** One state and the instant it began, in seconds after the start of the span.
 * What one `offset:state` pair on the wire decodes to. */
export interface TimelineSample {
  offsetSeconds: number;
  state: string;
}

/**
 * The samples in a states series.
 *
 * The wire form is `offset:state` pairs joined by single spaces, oldest first,
 * the first pair at offset 0 carrying the state in force when the span began.
 * The state is percent-encoded, so a state holding a space or a colon travels
 * as one token and the split is unambiguous: the first colon is the separator
 * and every later one is inside the encoded state.
 *
 * Tolerant on the way in, because a series is a cached string that may have
 * been written by an older server: a pair with no colon, a non-numeric offset
 * or a negative one is skipped rather than fatal, and anything past the cap is
 * dropped. Mirrors `CustomComplication.timelineSamples(in:)` in Swift. */
export function timelineSamples(raw: string, limit = TIMELINE_HISTORY_POINTS): TimelineSample[] {
  const out: TimelineSample[] = [];
  for (const token of raw.split(" ")) {
    if (out.length >= limit) break;
    if (token === "") continue;
    const colon = token.indexOf(":");
    if (colon <= 0) continue;
    const offset = Number(token.slice(0, colon));
    if (!Number.isFinite(offset) || offset < 0) continue;
    out.push({ offsetSeconds: Math.round(offset), state: decodeState(token.slice(colon + 1)) });
  }
  return out;
}

/** A percent-encoded state, decoded. A malformed escape comes back as it was
 * written rather than throwing: one bad byte in a cached series should cost
 * that one run its name, not the whole strip. */
function decodeState(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * The samples cut into colored runs across the frame.
 *
 * Each sample runs until the next one starts, and the last runs to the right
 * edge, which is now. Neighbours of one color are merged into a single run:
 * two states that draw the same color are one thing to look at, and the watch
 * has a view budget that a hundred separate rectangles would spend on nothing.
 *
 * Offsets past the end of the span are pulled back to it rather than dropped,
 * so a series that disagrees with the span by a second still ends flush with
 * the right edge. Mirrors `CustomComplication.timelineRuns` in Swift. */
export function timelineRuns(
  samples: readonly TimelineSample[],
  spanSeconds: number,
  colorOf: (state: string) => string,
): TimelineRun[] {
  if (samples.length === 0 || !(spanSeconds > 0)) return [];
  const runs: TimelineRun[] = [];
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]!;
    const start = Math.min(1, Math.max(0, sample.offsetSeconds / spanSeconds));
    const next = samples[i + 1];
    const end = next === undefined ? 1 : Math.min(1, Math.max(start, next.offsetSeconds / spanSeconds));
    // A pair that repeats the previous offset has no width and nothing to say.
    if (!(end > start)) continue;
    const colorHex = colorOf(sample.state);
    const last = runs[runs.length - 1];
    if (last !== undefined && last.colorHex === colorHex) last.end = end;
    else runs.push({ start, end, colorHex });
  }
  // The last run always reaches the right edge: the newest state is still in
  // force, so a strip that stopped short would read as missing data.
  const last = runs[runs.length - 1];
  if (last !== undefined) last.end = 1;
  return runs;
}

/** A count rounded and held inside `lo...hi`, never NaN. Mirrors the clamping in
 * Swift's `dotCounts`, which has to do this before an `Int` conversion that would
 * otherwise trap on a watch. */
function clampCount(value: number, lo: number, hi: number): number {
  if (Number.isNaN(value)) return hi;
  // Half away from zero, the way Swift's `rounded()` does it, so a negative
  // half-step lands on the same integer on both sides.
  const rounded = value < 0 ? -Math.round(-value) : Math.round(value);
  return Math.min(hi, Math.max(lo, rounded));
}

export function gaugeFraction(raw: string | undefined, min: number, max: number): number {
  if (raw === undefined) return 0;
  const n = leadingNumber(raw);
  if (n === undefined || Number.isNaN(n)) return 0;
  const span = max - min;
  if (span === 0) return 0;
  return Math.min(1, Math.max(0, (n - min) / span));
}

// ── list items ────────────────────────────────────────────────────────────
// One reply, parsed into rows the resolver can read fields off. Both data
// paths end here: a Jinja source renders `{"items": [...], "total": N}` into
// the value document, and a service source's reply is the same object, so
// nothing past this point knows which door the items came through.

/** One item of a list, already printed.
 *
 * A field the reply left out is absent from the map, which resolves nil and
 * draws `--`; a field that arrived as `null` is present and empty, because
 * "this event has no location" is an answer and "there is no such field" is
 * not. */
export interface ListItem {
  fields: Map<string, string>;
  index: number;
}

/** What one list drew, and how many there were before the slice. */
export interface ListItems {
  items: ListItem[];
  total: number;
}

/** JSON with every object's keys in order, which is how a field holding an
 * object or an array prints. Sorted so the same reply always prints the same
 * text, whatever order the server happened to serialise it in. */
function sortedJSON(value: unknown): string {
  const norm = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(norm);
    if (v !== null && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(o).sort()) out[key] = norm(o[key]);
      return out;
    }
    return v;
  };
  return JSON.stringify(norm(value)) ?? "";
}

/** One field as text, by schema section 6.6's rules: a string stays as it is,
 * a bool prints `true` or `false`, a whole number under 1e15 prints as integer
 * text, `null` is the empty string, and anything structured is its
 * sorted-key JSON. */
function printItemField(raw: unknown): string {
  if (raw === null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "boolean" || typeof raw === "number") return normaliseScalar(raw);
  return sortedJSON(raw);
}

/** The fields one raw item carries. An item that is not an object is a scalar
 * list (a select's options, a template yielding strings), and its one field is
 * `value`. Objects are read one level deep. */
function itemFields(raw: unknown): Map<string, string> {
  const fields = new Map<string, string>();
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) fields.set(key, printItemField(value));
  } else {
    fields.set("value", printItemField(raw));
  }
  return fields;
}

/** Seconds out of a field that holds a unix time, or undefined when it holds
 * anything else (a to-do with no due date sends an empty string). */
function itemSeconds(fields: ReadonlyMap<string, string>, name: string): number | undefined {
  const raw = fields.get(name);
  if (raw === undefined) return undefined;
  const n = swiftDouble(raw.trim());
  return n === undefined || !Number.isFinite(n) ? undefined : n;
}

/**
 * The fields worked out at resolve rather than sent: the row's position, the
 * distances from now, and the glyph.
 *
 * None of these are stored, so a list cached between fetches still counts down
 * correctly and still draws the right icon for a state that changed under it.
 */
function addComputedFields(fields: Map<string, string>, source: ListSource, index: number, nowSeconds: number): void {
  fields.set("index", String(index));
  switch (source.kind) {
    case "entities": {
      const changed = itemSeconds(fields, "lastChanged");
      if (changed !== undefined) fields.set("age", String(Math.round(nowSeconds - changed)));
      fields.set("icon", entityItemIcon(fields.get("domain") ?? "", fields.get("deviceClass") ?? "", fields.get("state") ?? ""));
      return;
    }
    case "calendar": {
      // Clamped at zero: an event that started ten minutes ago starts in no
      // time at all, and "-600" on a face reads as a bug.
      const start = itemSeconds(fields, "start");
      if (start !== undefined) fields.set("startsIn", String(Math.max(0, Math.round(start - nowSeconds))));
      const end = itemSeconds(fields, "end");
      if (end !== undefined) fields.set("endsIn", String(Math.max(0, Math.round(end - nowSeconds))));
      fields.set("icon", CALENDAR_ITEM_ICON);
      return;
    }
    case "todo": {
      // Not clamped: an overdue item is the one worth coloring red, and a
      // negative number is how a rule finds it.
      const due = itemSeconds(fields, "due");
      if (due !== undefined) fields.set("dueIn", String(Math.round(due - nowSeconds)));
      fields.set("icon", TODO_ITEM_ICON);
      return;
    }
    case "forecast":
      fields.set("icon", forecastItemIcon(fields.get("condition") ?? ""));
      return;
    default:
      // An attribute or a template carries whatever the object holds, and
      // nothing here knows what its fields mean.
      return;
  }
}

/**
 * One reply, parsed.
 *
 * Either shape is accepted: the `{"items", "total"}` object both compilers
 * emit, and a bare JSON array, which is what a raw template usually yields.
 * An array's total is its own length and the slice happens here. Anything else
 * is no items at all, the same answer a chart gives before its first fetch.
 */
export function parseListItems(text: string, rows: number, source: ListSource, nowSeconds: number): ListItems {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { items: [], total: 0 };
  }
  let raw: unknown[];
  let total: number;
  if (Array.isArray(parsed)) {
    raw = parsed;
    total = parsed.length;
  } else if (parsed !== null && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown }).items)) {
    const o = parsed as { items: unknown[]; total?: unknown };
    raw = o.items;
    total = typeof o.total === "number" && Number.isFinite(o.total) ? Math.round(o.total) : o.items.length;
  } else {
    return { items: [], total: 0 };
  }
  const items = raw.slice(0, Math.max(0, rows)).map((entry, index) => {
    const fields = itemFields(entry);
    addComputedFields(fields, source, index, nowSeconds);
    return { fields, index };
  });
  return { items, total: Math.max(total, items.length) };
}

/**
 * Where each cell of a list sits inside the list's own frame.
 *
 * The frame is divided evenly into `rows` cells, or `rows / columns` lines of
 * `columns` cells, whatever the item count: a list never stretches two items
 * over four rows, so the design stays where the author put it. The gap is in
 * design points, so it is turned into a fraction through the list's own size
 * on this shape, and clamped so the cells never fold through each other on a
 * frame too small to hold them.
 */
export function listCellFrames(el: ListElement, box: { width: number; height: number }): NormalizedFrame[] {
  const rows = clampListRows(el.rows);
  const { lines, columns } = listGrid(el);
  const gap = clampListGap(el.gap);
  const span = (count: number, points: number) => {
    if (count <= 1) return { size: 1, step: 0 };
    const fraction = points > 0 ? gap / points : 0;
    const g = Math.min(fraction, 1 / (count - 1));
    const size = (1 - g * (count - 1)) / count;
    return { size, step: size + g };
  };
  const across = span(columns, Math.abs(el.frame.width) * box.width);
  const down = span(lines, Math.abs(el.frame.height) * box.height);
  const out: NormalizedFrame[] = [];
  for (let i = 0; i < rows; i++) {
    out.push({
      x: (i % columns) * across.step,
      y: Math.floor(i / columns) * down.step,
      width: across.size,
      height: down.size,
      rotationDegrees: 0,
    });
  }
  return out;
}

/** `{item.<field>}` wherever it stands in a row tap's action. The field name
 * may carry a dot (`attr.brightness`), so anything but a brace counts. */
const ITEM_FIELD_RE = /\{item\.([^{}]+)\}/g;

/** A reference built from a substituted id: the domain comes off the id, since
 * the domain stored beside a placeholder is the domain of nothing. */
function entityFrom(entityId: string, displayName: string): EntityRef {
  return { entityId, displayName, domain: entityId.split(".")[0] ?? "" };
}

// ── value resolution ──────────────────────────────────────────────────────

export class Resolver {
  private readonly named: Map<string, Value>;
  /** Every chart in the document, settled, by layer id. Filled from `config`
   * when the resolver is built, and again by `resolveLayout`, so a text layer
   * or a rule that reads a chart's number finds the chart already decided. */
  private readonly charts = new Map<string, ChartReadings>();
  /** The chart layers themselves, by id, settled with `charts`, so a
   * `chartTimes` layer reads its chart's span whatever order the two sit in. */
  private readonly chartElements = new Map<string, ChartElement>();
  /** Timelines and pictures by id, for the same reason: a times layer reads a
   * timeline, and a timestamp layer a picture, whatever order they sit in. */
  private readonly timelineElements = new Map<string, TimelineElement>();
  private readonly imageElements = new Map<string, Extract<Element, { kind: "image" }>["payload"]>();
  /** Every list in the document, settled, by layer id: what it drew and how
   * many there were. Filled before any layer resolves, so a `listStat` text or
   * a rule that tests one finds the list already decided, whichever order the
   * two sit in. The `chartStat` pattern. */
  private readonly lists = new Map<string, ListItems>();
  /** Each list's cells, with its row layers already resolved per item. Filled
   * by `resolveLayout`, which is the first moment the shape and so the cell
   * geometry are known. */
  private readonly listCells = new Map<string, ResolvedCell[]>();
  /** The item a row is being resolved against, or undefined outside a row: an
   * `item` value anywhere else is nil. */
  private currentItem: ListItem | undefined;

  constructor(private readonly ctx: ResolveContext, config?: CustomComplicationConfig) {
    this.named = new Map(ctx.namedValues.map((n) => [n.id.toUpperCase(), n.value]));
    if (config) {
      // Every layer, whatever page it is on: a value resolved on its own has no
      // canvas and so no page, and Inline reads the whole document. `resolveLayout`
      // settles both again from the page it is drawing.
      this.settleCharts(config.elements);
      // The counts, so a value resolved on its own (the editor's Now line, an
      // Inline text) can still read a `listStat`. The cells wait for a shape.
      this.settleListItems(config.elements);
    }
  }

  /** Parse every list's items. Independent of the shape, so it runs before
   * anything is drawn and a `listStat` inside a row reads a settled count. */
  private settleListItems(elements: readonly Element[]): void {
    this.lists.clear();
    const nowSeconds = this.nowMs() / 1000;
    for (const el of elements) {
      if (el.kind !== "list") continue;
      const text = this.listText(el.payload);
      this.lists.set(
        el.payload.id,
        text === undefined ? { items: [], total: 0 } : parseListItems(text, clampListRows(el.payload.rows), el.payload.source, nowSeconds),
      );
    }
  }

  /** The reply one list reads its items out of, whichever door they came
   * through, or undefined while nothing has arrived. */
  private listText(el: ListElement): string | undefined {
    const jinjaKey = listExpressionKey(el.source, el.rows);
    if (jinjaKey !== undefined) return this.ctx.templateResults.get(jinjaKey);
    const key = listKey(el.source);
    return key === undefined ? undefined : this.ctx.listItems?.get(key);
  }

  /** Draw every list's cells for one shape: the geometry from the list's own
   * frame, then the row template resolved once per item with that item set. */
  private settleListCells(config: CustomComplicationConfig, elements: readonly Element[], family: FamilyKind, forced?: ForcedBranches): void {
    this.listCells.clear();
    const layout = config.perFamily[family];
    const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
    for (const el of elements) {
      if (el.kind !== "list") continue;
      const items = this.lists.get(el.payload.id)?.items ?? [];
      const frames = listCellFrames(el.payload, box);
      const cells: ResolvedCell[] = [];
      for (let i = 0; i < items.length && i < frames.length; i++) {
        this.currentItem = items[i];
        // Row layers take part in the same per-shape `placements` map under
        // their own ids, so a row can be laid out differently on rectangular
        // and on large, and one of its layers hidden on one of them.
        const rowElements = el.payload.template.map((row) =>
          this.resolveElement(withPlacement(row, layout?.placements[row.payload.id]), forced, family));
        this.currentItem = undefined;
        cells.push({ frame: frames[i]!, elements: rowElements });
      }
      this.listCells.set(el.payload.id, cells);
    }
  }

  /** The series a chart draws and the range it draws it against. One function
   * for the chart itself and for the `chartStat` values that read it, so the
   * two cannot disagree about what "the newest reading" is. Mirrors
   * `CustomComplication.chartReadings(for:context:)`. */
  chartReadings(c: ChartElement): ChartReadings {
    const { values, holes } = this.chartSeries(c);
    const domain = chartDomain(values, c);
    const out: ChartReadings = { values, holes, domainMin: domain.min, domainMax: domain.max };
    const entity = this.chartEntity(c);
    if (entity) out.entity = entity;
    return out;
  }

  /** The numbers a chart draws, trimmed to its `limit`, before anything decides
   * what range to draw them against. Split out because `scaleFrom` settles the
   * series of every chart before it settles any range. Mirrors
   * `CustomComplication.chartSeries`. */
  private chartSeries(c: ChartElement): ChartSeries {
    // A history chart never reads its own value: the value only names the
    // entity, and the readings are whatever the last recorder fetch left
    // behind. Before that arrives the chart is empty rather than one bar of
    // the current state, which would draw a lie that looks like real data.
    // Long-term statistics are read out of the same Map under their own key.
    // The series arrives in the same shape, so everything below this is the
    // code a history chart has always run.
    const historyKey = chartHistoryKey(c);
    const statisticsKey = chartStatisticsKey(c);
    let raw: string;
    const fromRecorder = historyKey ?? statisticsKey;
    if (fromRecorder !== undefined) {
      raw = this.ctx.historySeries?.get(fromRecorder) ?? "";
    } else {
      raw = this.resolve(c.value) ?? "";
    }
    // A fetched series keeps its holes (empty fields); a value of the chart's
    // own reads every number in it, as it always has.
    let { values, holes } = fromRecorder !== undefined
      ? chartSeriesWithHoles(raw)
      : { values: chartNumbers(raw), holes: [] as boolean[] };
    // A test value stands in for the newest reading, the way it stands in for
    // the state everywhere else. A chart of its own value already reads it.
    const tested = fromRecorder === undefined ? undefined : this.testedReading(c);
    if (tested !== undefined) {
      values = [...values.slice(0, -1), tested];
      if (holes.length > 0) holes = [...holes.slice(0, -1), false];
    }
    if (c.limit > 0 && values.length > c.limit) {
      const trim = <T,>(a: T[]) => (c.takeFromEnd ? a.slice(a.length - c.limit) : a.slice(0, c.limit));
      values = trim(values);
      if (holes.length > 0) holes = trim(holes);
    }
    holes = normaliseHoles(holes);
    // The average runs after the trim, so its window never reaches a reading
    // that is not drawn, and before anything else reads the series: the range,
    // highlights, bands, anchors and `chartStat` numbers all agree with the line.
    return { values: chartSmoothed(values, chartSmoothing(c.smoothing), holes), holes };
  }

  /** The number a chart's entity is being tested at, when it is. */
  private testedReading(c: ChartElement): number | undefined {
    const entity = this.chartEntity(c);
    if (!entity || !this.ctx.testedEntities?.has(entity.entityId)) return undefined;
    const state = this.ctx.entityStates.get(entity.entityId)?.state;
    return state === undefined ? undefined : leadingNumber(state);
  }

  private chartEntity(c: ChartElement): EntityRef | undefined {
    const deref = this.dereference(c.value);
    if (!deref || !("entityId" in deref.kind)) return undefined;
    return { entityId: deref.kind.entityId, displayName: deref.kind.displayName, domain: deref.kind.domain };
  }

  /** Which reading the "now" line stands on. Rounded, then clamped into the
   * series, so an hour that has run past the end of a forecast marks its last
   * reading instead of disappearing. Mirrors
   * `CustomComplication.chartNowIndex`. */
  private chartNowIndex(c: ChartElement, count: number): number | undefined {
    if (c.nowIndex === undefined || count === 0) return undefined;
    const raw = this.resolve(c.nowIndex);
    if (raw === undefined) return undefined;
    const n = leadingNumber(raw);
    if (n === undefined || !Number.isFinite(n)) return undefined;
    return Math.min(Math.max(Math.round(n), 0), count - 1);
  }

  /** Every chart in the document settled, in two passes, because `scaleFrom`
   * lets one chart borrow another's range. The series come first, since nothing
   * about parsing a chart's own numbers depends on another chart; then the
   * ranges, following each link and memoising as it goes. A link to a missing
   * chart, to the chart itself, or one that closes a cycle falls back to that
   * chart's own scale. Mirrors `ResolveContext.withChartReadings(from:)`.
   *
   * Takes the layer list rather than the document because a page is a filter on
   * that list: a chart on another page is not settled, so a text that reads it
   * prints nothing, exactly as it would on the watch, where the filter runs
   * before `resolve(layout:elements:)` ever sees the layers. The maps are
   * cleared first for the same reason: this runs again per shape, and a chart
   * settled from a wider list must not survive into a narrower one. */
  private settleCharts(elements: readonly Element[]): void {
    this.charts.clear();
    this.chartElements.clear();
    this.timelineElements.clear();
    this.imageElements.clear();
    const charts = new Map<string, ChartElement>();
    const order: string[] = [];
    for (const el of elements) {
      if (el.kind === "timeline") this.timelineElements.set(el.payload.id, el.payload);
      if (el.kind === "image") this.imageElements.set(el.payload.id, el.payload);
      if (el.kind !== "chart" || charts.has(el.payload.id)) continue;
      charts.set(el.payload.id, el.payload);
      order.push(el.payload.id);
    }

    const series = new Map<string, ChartSeries>();
    for (const id of order) series.set(id, this.chartSeries(charts.get(id)!));

    const domains = new Map<string, { min: number; max: number }>();
    const domainOf = (id: string, visiting: Set<string>): { min: number; max: number } => {
      const known = domains.get(id);
      if (known) return known;
      const chart = charts.get(id);
      if (!chart) return { min: 0, max: 1 };
      const source = chart.scaleFrom;
      const result = source !== undefined && source !== id && charts.has(source) && !visiting.has(source)
        ? domainOf(source, new Set([...visiting, source]))
        : chartDomain(series.get(id)?.values ?? [], chart);
      domains.set(id, result);
      return result;
    };

    for (const id of order) {
      const chart = charts.get(id)!;
      const range = domainOf(id, new Set([id]));
      const out: ChartReadings = {
        values: series.get(id)?.values ?? [],
        holes: series.get(id)?.holes ?? [],
        domainMin: range.min,
        domainMax: range.max,
      };
      const entity = this.chartEntity(chart);
      if (entity) out.entity = entity;
      this.charts.set(id, out);
      this.chartElements.set(id, chart);
    }
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
    // A chart's number is in the chart's entity's unit, which is the unit a
    // reader wants after it ("119.6 V"), so the stat borrows it.
    if (k.kind === "chartStat") {
      // A trend reads as an arrow, and "↑ V" is nonsense, so the glyph never
      // borrows a unit however the layer is formatted.
      if (k.stat === "trend") return undefined;
      const entity = this.charts.get(k.layer.toUpperCase())?.entity;
      return entity ? this.ctx.entityStates.get(entity.entityId)?.unitOfMeasurement : undefined;
    }
    // An item's unit is a field of the item, which is where the entities
    // source puts `unit_of_measurement` and the forecast source the weather
    // entity's temperature unit.
    if (k.kind === "item") return this.currentItem?.fields.get("unit");
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
      case "chartStat": {
        // The chart has already decided its series and its scale; this only
        // reads the number back and prints it with the chart's own decimals,
        // so a "top of the scale" label and the tallest bar always agree.
        const r = this.charts.get(deref.kind.layer.toUpperCase());
        const n = r ? chartStatValue(r, deref.kind.stat) : undefined;
        if (r && n !== undefined) {
          raw = deref.kind.stat === "trend"
            ? chartTrendGlyph(n)
            : chartStatText(n, r.domainMax - r.domainMin);
        }
        break;
      }
      case "item":
        // Only while a row is being resolved, and only for a field the item
        // has: anywhere else, and for a name the source never sent, nil.
        raw = this.currentItem?.fields.get(deref.kind.field);
        break;
      case "listStat": {
        // The list has already parsed its reply; this reads the number back.
        const l = this.lists.get(deref.kind.layer.toUpperCase());
        if (l) raw = String(deref.kind.stat === "total" ? l.total : l.items.length);
        break;
      }
      case "imageTime": {
        // The preview picture is always live, so once it has a URL its time is
        // now. A picture with no URL yet stands for one the watch has not
        // fetched, and a picture that is gone, or inline and so never fetched,
        // has no time at all: the text draws nothing, as the watch does. The
        // capsule behind it still shows, so the timestamp stays visible to
        // edit. Empty, not undefined, so it is never "--".
        const image = this.imageElements.get(deref.kind.layer.toUpperCase());
        if (image === undefined || image.source === "inline") return "";
        if (!this.ctx.pictureStandIns && this.ctx.entityStates.get(image.entity.entityId)?.entityPicture === undefined) return "";
        raw = String(Math.floor((this.ctx.pictureTimeMs ?? this.nowMs()) / 1000));
        break;
      }
      default: {
        // Keyed off the ORIGINAL (un-dereferenced) value.
        const key = keyFor(value, this.named);
        raw = key === undefined ? undefined : this.ctx.templateResults.get(key);
      }
    }
    if (raw === undefined) return undefined;
    return formatValue(raw, deref.format, this.directEntityUnit(deref), this.ctx.locale, this.ctx.timeZone);
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

  /** Whether a countdown on this value has anything to count down to: a timer
   * entity in any state (idle now, running later), or a value that reads as a
   * future time right now. The editor offers its Count down switch only then,
   * since on any other value a countdown draws the plain text. */
  canCountDown(value: Value | undefined): boolean {
    if (!value) return false;
    const deref = this.dereference(value);
    if (deref?.kind.kind === "entityState") {
      const id = deref.kind.entityId;
      if (id.startsWith("timer.") || this.ctx.entityStates.get(id)?.timerState !== undefined) return true;
    }
    return this.countdownEnd(value) !== undefined;
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
      case "timeBetween": {
        const now = clockTime(lhs);
        const startRaw = rhsString();
        const endRaw = this.resolve(c.upper);
        const from = startRaw === undefined ? undefined : clockTime(startRaw);
        const to = endRaw === undefined ? undefined : clockTime(endRaw);
        if (now === undefined || from === undefined || to === undefined) return false;
        // Deliberately not sorted: the order the author wrote is the window. Equal
        // bounds are an empty window rather than a whole day, so a half-typed pair
        // never lights the rule up.
        if (from === to) return false;
        if (from < to) return now >= from && now < to;
        return now >= from || now < to;
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

  /**
   * A level's reading against its scale, and the color the unfilled part takes.
   *
   * Each end of the scale settles the way a gauge's does: the entity that end
   * follows when it holds a number, then the typed-in number. A reading that is
   * missing or is not a number is a fraction of 0, which draws the track alone;
   * that is the honest answer, because a fill has nothing to say about a value
   * it could not read. Mirrors `resolveLevel` in the app repo.
   */
  private resolveLevel(level: Level | undefined, colorHex: string): ResolvedLevel | undefined {
    if (!level) return undefined;
    const end = (source: Value | undefined, fixed: number): number =>
      (source ? leadingNumber(this.resolve(source) ?? "") : undefined) ?? fixed;
    const min = end(level.minSource, level.minValue);
    const max = end(level.maxSource, level.maxValue);
    return {
      fraction: gaugeFraction(this.resolve(level.value), min, max),
      direction: level.direction,
      trackColorHex: level.trackColorHex ?? fadeHex(colorHex, LEVEL_TRACK_FADE),
    };
  }

  /**
   * Every visible part of a rich text layer, in order, against the layer's
   * already resolved look.
   *
   * A part's rules can change only what a part has: its color, text, size,
   * weight and whether it shows. Anything else one sets is ignored rather than
   * leaking onto the layer. Each look falls back rule first, then the part's
   * own setting, then the layer, so a layer rule that recolors the text
   * reaches every part that has no color of its own.
   */
  private resolveTextParts(parts: readonly TextPart[], rules: readonly Rule[], layer: ResolvedText, forced?: ForcedBranches): ResolvedTextPart[] {
    const out: ResolvedTextPart[] = [];
    for (const part of parts) {
      const style = this.applyRules(rules.filter((r) => r.partId === part.id), forced);
      if (style.get("visibility")?.kind === "hide") continue;
      const resolved: ResolvedTextPart = {
        text: this.styleText(style, "text") ?? this.resolve(part.value) ?? "--",
        fontSize: this.styleNumber(style, "fontSize") ?? part.fontSize ?? layer.fontSize,
        fontWeight: style.get("fontWeight")?.weight ?? part.fontWeight ?? layer.fontWeight,
        fontDesign: style.get("fontDesign")?.design ?? part.fontDesign ?? layer.fontDesign,
        fontWidth: style.get("fontWidth")?.width ?? part.fontWidth ?? layer.fontWidth,
        italic: style.get("italic")?.italic ?? part.italic ?? layer.italic,
        colorHex: this.styleColor(style, "color") ?? part.colorHex ?? layer.colorHex,
      };
      if (part.coloring === "bands" && (part.bands?.length ?? 0) > 0) {
        resolved.spans = textValueSpans(resolved.text, resolved.colorHex, part);
      }
      out.push(resolved);
    }
    return out;
  }

  resolveElement(el: Element, forced?: ForcedBranches, family: FamilyKind = "rectangular"): ResolvedElement {
    const p = el.payload;
    // On a text layer a rule aimed at a part belongs to that part and never to
    // the layer, whether or not the layer is drawing parts right now, so a rule
    // aimed at a part nobody has does nothing. Every other kind has no parts
    // and reads the rule as if the key were not there, as Swift does.
    const layerRules = el.kind === "text" ? p.rules.filter((r) => r.partId === undefined) : p.rules;
    const style = this.applyRules(layerRules, forced);
    const visibility = style.get("visibility");
    const isHidden = visibility ? visibility.kind === "hide" : p.isHidden;
    const rotation = this.styleNumber(style, "rotation");
    const frame = rotation === undefined ? p.frame : { ...p.frame, rotationDegrees: rotation };
    // The layer's own opacity times whatever a rule asked for, so a rule reads
    // as "half as bright as this layer normally is".
    const opacity = clampLayerOpacity((p.opacity ?? 1) * (this.styleNumber(style, "opacity") ?? 1));
    const base: ResolvedBase = { id: p.id, isHidden, frame, opacity };
    if (p.shadow !== undefined) base.shadow = p.shadow;
    if (p.chartAnchor !== undefined) base.chartAnchor = p.chartAnchor;
    if (p.accentGroup === "accent") base.accentGroup = "accent";
    switch (el.kind) {
      case "text": {
        const countdownEnd = el.payload.countdown ? this.countdownEnd(el.payload.value) : undefined;
        const fallback = el.payload.countdown ? this.countdownFallbackText(el.payload.value) : undefined;
        // Drawn as parts unless a layer rule set the text: that rule names the
        // whole text, so it replaces the parts in the layer's own look.
        const rich = textUsesParts(el.payload) && !style.has("text");
        const out: ResolvedText = {
          kind: "text",
          ...base,
          text: rich ? "" : this.styleText(style, "text") ?? fallback ?? this.resolve(el.payload.value) ?? "--",
          fontSize: this.styleNumber(style, "fontSize") ?? el.payload.fontSize,
          fontWeight: style.get("fontWeight")?.weight ?? el.payload.fontWeight,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
          monospacedDigits: el.payload.monospacedDigits === true,
          lineLimit: Math.min(TEXT_MAX_LINES, Math.max(1, Math.round(el.payload.lineLimit ?? 1))),
          fontDesign: style.get("fontDesign")?.design ?? el.payload.fontDesign ?? "default",
          fontWidth: style.get("fontWidth")?.width ?? el.payload.fontWidth ?? "standard",
          italic: style.get("italic")?.italic ?? el.payload.italic === true,
          minimumScale: clampMinimumScale(el.payload.minimumScale ?? TEXT_MIN_SCALE),
          alignment: el.payload.alignment ?? "center",
        };
        if (countdownEnd !== undefined) out.countdownEnd = countdownEnd;
        const arc = resolvedTextArc(el.payload, family);
        if (arc !== undefined) out.arc = arc;
        if (rich) {
          // The layer's own color by value is ignored: each part carries its
          // own table, and the layer's would color numbers across parts.
          out.parts = this.resolveTextParts(el.payload.parts!, p.rules, out, forced);
          out.text = out.parts.map((part) => part.text).join("");
          return out;
        }
        // Read off the final text and color, so a rule that rewrites the text
        // or recolors the layer is what the numbers are read from and what the
        // rest of the text keeps.
        if (textColorsByValue(el.payload)) out.spans = textValueSpans(out.text, out.colorHex, el.payload);
        return out;
      }
      case "icon": {
        const baseSymbol = this.entityIcon(el.payload.symbol) ?? this.resolve(el.payload.symbol) ?? "questionmark.circle";
        const override = this.styleText(style, "icon");
        // A stored path belongs to the symbol it was picked with, so it
        // survives only while that symbol is what gets drawn: the layer's own
        // with no rule swapping it, or a rule's own swapped in.
        const swap = style.get("icon");
        const literalSymbol = el.payload.symbol.kind.kind === "literal";
        const path = override === undefined
          ? (literalSymbol && el.payload.path !== "" ? el.payload.path : undefined)
          : (swap?.value?.kind.kind === "literal" && swap.path ? swap.path : undefined);
        let symbol = override ?? baseSymbol;
        // A hand-typed `mdi:` name with no path is a name nothing can draw, and
        // the custom-drawing marker is not a symbol name at all. The
        // placeholder makes the mistake visible; blank would read as a bug.
        if (path === undefined && (symbol.startsWith("mdi:") || symbol === CUSTOM_SVG_SYMBOL)) {
          symbol = "questionmark.circle";
        }
        const out: ResolvedIcon = {
          kind: "icon",
          ...base,
          symbol,
          size: this.styleNumber(style, "fontSize") ?? el.payload.size,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
        };
        if (path !== undefined) out.path = path;
        // The box goes with the layer's own path: a layer drawing an SF Symbol
        // has no path for it to mean anything about, and a rule's Material
        // Design icon is drawn in that set's own box.
        if (path !== undefined && override === undefined && el.payload.viewBox !== undefined) out.viewBox = el.payload.viewBox;
        // The track follows the color the layer ended up in, so a rule that
        // recolors the icon recolors both halves of it.
        const level = this.resolveLevel(el.payload.level, out.colorHex);
        if (level !== undefined) out.level = level;
        return out;
      }
      case "gauge": {
        const g = el.payload;
        const raw = this.styleText(style, "gaugeValue") ?? this.resolve(g.value);
        // Each end of the range, first match wins: a rule, then the entity that
        // end follows when it holds a number, then the typed-in number. The
        // fill, the threshold tick and the dot count all read the result.
        const bound = (ruled: number | undefined, source: typeof g.minSource, fixed: number): number =>
          ruled ?? (source ? leadingNumber(this.resolve(source) ?? "") : undefined) ?? fixed;
        const min = bound(this.styleNumber(style, "gaugeMin"), g.minSource, g.minValue);
        const max = bound(this.styleNumber(style, "gaugeMax"), g.maxSource, g.maxValue);
        const reading = raw === undefined ? undefined : leadingNumber(raw);

        // A band names its own color, so it wins over a rule that recolors the
        // gauge: the rule says the layer is in an unusual state, the table says
        // where this reading sits, and the table is the more specific statement.
        const ruledColor = this.styleColor(style, "color");
        let colorHex = ruledColor ?? g.colorSlot.baseColorHex;
        const banded = g.coloring === "bands" && g.bands.length > 0 && reading !== undefined;
        if (banded) {
          colorHex = chartBandColor(reading!, chartSortedBands(g), g.bandAboveColorHex);
        }
        // A gradient says how the track looks, not what the reading is, so a
        // band's color or a rule's color is the more specific statement and
        // drops it. Mirrors `resolveGauge` in the app repo.
        const fill = banded || ruledColor !== undefined ? undefined : g.fill;

        // How many dots, and how many filled. M is `total` when it resolves to a
        // number, else the range itself; both are rounded, clamped and capped.
        let total = max - min;
        if (g.total) {
          const n = leadingNumber(this.resolve(g.total) ?? "");
          if (n !== undefined) total = n;
        }
        const dotCount = clampCount(total, 1, GAUGE_MAX_DOTS);
        const out: ResolvedGauge = {
          kind: "gauge",
          ...base,
          fraction: gaugeFraction(raw, min, max),
          style: g.style,
          lineWidth: g.lineWidth,
          colorHex,
          trackColorHex: g.trackColorHex,
          thresholdColorHex: g.thresholdColorHex,
          dotCount,
          filledCount: clampCount(reading ?? 0, 0, dotCount),
          tickCount: g.ticks?.count ?? 0,
          tickLength: g.ticks?.length ?? GAUGE_DEFAULT_TICK_LENGTH,
          tickColorHex: g.ticks?.colorHex ?? GAUGE_DEFAULT_TICK_HEX,
          tickMajorEvery: g.ticks?.majorEvery ?? 0,
          showsLabels: g.labels?.show === true,
          labelSize: g.labels?.size ?? GAUGE_DEFAULT_LABEL_SIZE,
          labelColorHex: g.labels?.colorHex ?? GAUGE_DEFAULT_LABEL_HEX,
          minValue: min,
          maxValue: max,
          valueText: raw ?? "",
        };
        if (fill !== undefined) out.fill = fill;
        // Out of range draws nothing rather than sticking to an end, where it
        // would read as a threshold the reading had already met.
        if (g.thresholdValue !== undefined && max !== min) {
          const placed = (g.thresholdValue - min) / (max - min);
          if (placed >= 0 && placed <= 1) out.thresholdFraction = placed;
        }
        return out;
      }
      case "chart": {
        const c = el.payload;
        const readings = this.charts.get(c.id) ?? this.chartReadings(c);
        const values = readings.values;
        const holes = readings.holes;
        const domain = { min: readings.domainMin, max: readings.domainMax };
        const baseColorHex = this.styleColor(style, "color") ?? c.colorSlot.baseColorHex;
        const sortedBands = chartSortedBands(c);
        const pointColorHexes = chartUsesBands(c)
          ? values.map((v) => chartBandColor(v, sortedBands, c.bandAboveColorHex))
          : [];
        const marksHigh = c.highlight === "highest" || c.highlight === "both";
        const marksLow = c.highlight === "lowest" || c.highlight === "both";
        const markers = chartEndMarkers(c);
        const out: ResolvedChart = {
          kind: "chart",
          ...base,
          values,
          holes,
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
          highMarker: marksHigh ? markers.high : "none",
          lowMarker: marksLow ? markers.low : "none",
          pointColorHexes,
          fillBands: c.fillBands,
          curve: c.curve ?? "straight",
          smoothing: chartSmoothing(c.smoothing) ?? "off",
          fillStyle: chartFillStyle(c.fillStyle),
          ...(c.fillColorHex !== undefined ? { fillColorHex: c.fillColorHex } : {}),
          // Carried as authored: a chart's own color rules recolor the line,
          // not the area under it, so nothing here drops the gradient.
          ...(c.areaFill !== undefined && c.style !== "bars" ? { areaFill: c.areaFill } : {}),
          barRadius: chartBarRadius(c.barRadius),
          barCorners: chartBarCorners(c.barCorners),
          barBorderWidth: chartBarBorderWidth(c),
          barFillColorHexes: [],
          barBorderColorHexes: [],
          barBorderOpenBase: chartBarBorderWidth(c) > 0 && c.barBorderOpenBase === true,
          thresholdColorHex: c.thresholdColorHex,
          drawsThreshold: c.drawsThreshold !== false,
          nowColorHex: c.nowColorHex,
          drawsNowLine: c.drawsNowLine !== false,
          // The times do not wait on the series: the window is known the moment
          // the layer names an entity and a span, so a plot still fetching
          // prints them. The size is carried as written and clamped where it is
          // drawn, exactly as the timeline carries its own.
          // A chart whose times are a layer prints none and keeps no row for them.
          labels: c.drawsTimeLabels === false ? [] : chartLabels(c, this.nowMs()),
          labelSize: c.labelSize,
          labelColorHex: c.labelColorHex,
          labelsAbove: c.labelsAbove,
        };
        // A hole is never an end of the range: the highlight picks among real
        // readings only, first occurrence winning as before.
        const real = holes.length === 0 ? values : values.filter((_, i) => !holes[i]);
        if (real.length > 0) {
          const pick = (target: number) => values.findIndex((v, i) => v === target && holes[i] !== true);
          const high = marksHigh ? pick(Math.max(...real)) : -1;
          const low = marksLow ? pick(Math.min(...real)) : -1;
          if (high >= 0) out.highIndex = high;
          // One reading cannot be both ends of the range; highest wins.
          if (low >= 0 && low !== high) out.lowIndex = low;
        }
        // Each bar's fill and border, once the highlight has picked its ends,
        // since a highlighted bar is filled and bordered in its highlight color.
        if (c.style === "bars") {
          const colors = values.map((v, i) => chartBarColors(c, v, sortedBands, baseColorHex,
            i === out.highIndex ? c.highColorHex : i === out.lowIndex ? c.lowColorHex : undefined));
          out.barFillColorHexes = colors.map((x) => x.fill);
          if (out.barBorderWidth > 0) out.barBorderColorHexes = colors.map((x) => x.border);
        }
        const thresholdY = chartThresholdFraction(c, domain.min, domain.max);
        if (thresholdY !== undefined) out.thresholdY = thresholdY;
        const now = this.chartNowIndex(c, values.length);
        if (now !== undefined) out.nowIndex = now;
        return out;
      }
      case "timeline": {
        const t = el.payload;
        // Only a named entity has a past to read. Anything else draws nothing,
        // which is what the watch does too, rather than a strip of the value.
        const historyKey = timelineHistoryKey(t);
        const raw = historyKey === undefined ? "" : (this.ctx.historySeries?.get(historyKey) ?? "");
        const samples = timelineSamples(raw, TIMELINE_HISTORY_POINTS);
        const runs = timelineRuns(samples, timelineHistoryMinutes(t) * 60,
          (state) => timelineBandColor(state, t.bands, t.otherColorHex));
        const out: ResolvedTimeline = {
          kind: "timeline",
          ...base,
          runs,
          gap: t.gap,
          cornerRadius: t.cornerRadius,
          // The times do not wait on the series: the window is known the moment
          // the layer names an entity, so a strip still fetching prints them.
          // None once the times are a layer of their own.
          labels: t.drawsTimeLabels === false ? [] : timelineLabels(t, this.nowMs()),
          labelSize: t.labelSize,
          labelColorHex: t.labelColorHex,
          labelsAbove: t.labelsAbove,
        };
        return out;
      }
      case "shape": {
        const ruledColor = this.styleColor(style, "color");
        const out: ResolvedShape = {
          kind: "shape",
          ...base,
          shapeKind: el.payload.kind,
          cornerRadius: el.payload.cornerRadius,
          thickness: el.payload.thickness,
          fillColorHex: ruledColor ?? el.payload.colorSlot.baseColorHex,
          borderWidth: this.styleNumber(style, "borderWidth") ?? el.payload.borderWidth,
        };
        // A rule that recolored the shape drops the gradient; otherwise the
        // rule would look like it did nothing. Mirrors `resolveShape` in Swift.
        if (ruledColor === undefined && el.payload.fill !== undefined) out.fill = el.payload.fill;
        const border = this.styleColor(style, "borderColor") ?? el.payload.borderColorHex;
        if (border !== undefined) out.borderColorHex = border;
        // A line has no body to fill: it is the whole of what the layer draws,
        // so filling part of it would only be a shorter line. The editor does
        // not offer one, and a hand-written document is dropped here rather
        // than drawn in a way the two renderers would have to agree about.
        if (el.payload.kind !== "line") {
          const level = this.resolveLevel(el.payload.level, out.fillColorHex);
          if (level !== undefined) out.level = level;
        }
        return out;
      }
      case "image": {
        const out: ResolvedImage = {
          kind: "image",
          ...base,
          entityId: el.payload.entity.entityId,
          source: el.payload.source,
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
        // An inline picture is its own source: the bytes are in the document,
        // so the preview draws them straight and nothing is ever fetched.
        if (el.payload.source === "inline") {
          const inline = inlineImageUrl(el.payload);
          if (inline !== undefined) out.url = inline;
          out.imageBytes = inlineImageBytes(el.payload);
          return out;
        }
        const url = this.ctx.entityStates.get(el.payload.entity.entityId)?.entityPicture;
        if (url !== undefined) out.url = url;
        return out;
      }
      case "tap": {
        // Mirrors resolveTap in the app: visibility is the only rule that applies,
        // the frame's own rotation stays, opacity is always 1 and there is no
        // shadow, because a tap area draws nothing to cast one.
        const out: ResolvedTap = {
          kind: "tap",
          ...base,
          shadow: undefined,
          frame: el.payload.frame,
          opacity: 1,
          action: this.itemAction(el.payload.action),
        };
        if (el.payload.openPageId !== undefined) out.openPageId = el.payload.openPageId;
        if (el.payload.attachedTo !== undefined) out.attachedTo = el.payload.attachedTo;
        return out;
      }
      case "chartTimes": {
        const t = el.payload;
        const out: ResolvedChartTimes = {
          kind: "chartTimes",
          ...base,
          labels: chartTimesLabels(t, this.chartElements.get(t.chart), this.nowMs(), this.timelineElements.get(t.chart)),
          labelSize: t.labelSize,
          labelColorHex: t.labelColorHex,
          fontWeight: t.fontWeight ?? "regular",
          fontDesign: chartTimesFontDesign(t),
          fontWidth: t.fontWidth ?? "standard",
          italic: t.italic === true,
          monospacedDigits: t.monospacedDigits === true,
        };
        return out;
      }
      case "imageTime": {
        const t = el.payload;
        const image = this.imageElements.get(t.image);
        const out: ResolvedImageTime = {
          kind: "imageTime",
          ...base,
          image: t.image,
          linked: image !== undefined,
        };
        const url = image === undefined ? undefined : this.ctx.entityStates.get(image.entity.entityId)?.entityPicture;
        if (url !== undefined) out.url = url;
        if (this.ctx.pictureStandIns) out.standIn = true;
        return out;
      }
      // Both settle against their chart in `settleChartDots`, once every layer
      // on the shape is resolved: the chart's frame and line width are only
      // known then.
      case "chartDots": {
        const d = el.payload;
        const size = chartPointDotSize(d.size);
        const out: ResolvedChartDots = {
          kind: "chartDots",
          ...base,
          chart: d.chart,
          dots: chartDotsMode(d.dots),
          diameter: 0,
          indices: [],
        };
        if (size !== undefined) out.size = size;
        if (d.colorHex !== undefined) out.colorHex = d.colorHex;
        return out;
      }
      case "chartGrid": {
        const g = el.payload;
        const out: ResolvedChartGrid = {
          kind: "chartGrid",
          ...base,
          chart: g.chart,
          lines: chartGridLayerLines(g.lines),
          colorHex: chartGridColorHex(g.colorHex),
          thickness: chartGridThickness(g.thickness),
          draws: false,
        };
        return out;
      }
      case "list": {
        // The cells were drawn by `settleListCells`, which is the only place
        // that knows the shape. A list resolved without one (a thumbnail, a
        // value editor) draws no cells rather than guessing at a geometry.
        const out: ResolvedList = {
          kind: "list",
          ...base,
          cells: this.listCells.get(el.payload.id) ?? [],
        };
        return out;
      }
    }
  }

  /**
   * A row tap's action with `{item.<field>}` filled in from the item being
   * drawn.
   *
   * `domain` is refilled from the substituted id, because a placeholder is not
   * an entity id and whatever domain the editor stored beside it is the
   * domain of nothing. A placeholder naming a field the item does not have
   * leaves the row's tap disabled: firing a service call with `{item.uid}`
   * still in it would complete the wrong to-do, or none, and say nothing.
   */
  private itemAction(action: TapAction): TapAction {
    const item = this.currentItem;
    if (item === undefined) return action;
    let missing = false;
    const fill = (text: string): string => text.replace(ITEM_FIELD_RE, (whole, field: string) => {
      const value = item.fields.get(field);
      if (value === undefined) {
        missing = true;
        return whole;
      }
      return value;
    });
    const has = (text: string | undefined) => text !== undefined && text.includes(ITEM_PLACEHOLDER_PREFIX);
    if (action.type === "callService") {
      const target = action.target;
      if (!has(action.serviceDataJSON) && !has(target?.entityId) && !has(target?.displayName)) return action;
      const data = action.serviceDataJSON === undefined ? undefined : fill(action.serviceDataJSON);
      const filled = target === undefined ? undefined : entityFrom(fill(target.entityId), fill(target.displayName));
      if (missing) return { type: "none" };
      return {
        ...action,
        ...(data !== undefined ? { serviceDataJSON: data } : {}),
        ...(filled !== undefined ? { target: filled } : {}),
      };
    }
    if (!("entityId" in action)) return action;
    if (!has(action.entityId) && !has(action.displayName)) return action;
    const ref = entityFrom(fill(action.entityId), fill(action.displayName));
    return missing ? { type: "none" } : { type: action.type, ...ref };
  }

  resolveLayout(config: CustomComplicationConfig, family: FamilyKind, forced?: ForcedBranches): ResolvedLayout {
    const layout = config.perFamily[family];
    // The markers move onto their charts here, not at draw time, so the preview,
    // the drag handles, the layer thumbnails and the app repo's own resolver all
    // read one set of frames. Mirrors `CustomComplication.resolve` in the app repo.
    // Dots settle before the anchors: the dots decide the chart's inset, and the
    // inset moves every reading an anchor sits on.
    const canvas = DESIGN_BOX[family === "inline" ? "rectangular" : family];
    // Pages are a filter on the layer list and nothing else, so every shape
    // draws the same page and nothing downstream has to know pages exist. A
    // layer on another page never reaches the resolver, which is why a document
    // of four pages costs about what the same layers cost on one.
    const placed = elementsOnPage(config, elementsFor(config, family), this.ctx.page ?? 1);
    // Charts go first, in effect: a text layer that prints a chart's newest
    // reading, or a rule that tests one, needs the chart settled before it
    // resolves, whatever order the two sit in the layer list. Settled from the
    // page's own layers, so a text on page 1 that reads a chart on page 2 reads
    // it as missing here exactly as the watch does. The preview cannot promise
    // something the watch has no way to draw.
    this.settleCharts(placed);
    // Then the lists, for the same reason and in the same order the app's
    // resolver settles them: a text outside a list that prints its count, or a
    // rule that tests one, needs the list parsed before it resolves. The cells
    // are drawn here too, because this is where the shape is known.
    this.settleListItems(placed);
    this.settleListCells(config, placed, family, forced);
    const elements = [...placeChartAnchors(
      settleChartDots(placed.map((el) => this.resolveElement(el, forced, family)), canvas),
      canvas,
    )];
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
    const ruledBackground = this.styleColor(style, "backgroundColor");
    const bg = ruledBackground ?? layout?.backgroundColorHex;
    if (bg !== undefined) out.backgroundColorHex = bg;
    // A shape rule that set the background drops the gradient, the same way a
    // layer rule drops a shape's own fill.
    if (ruledBackground === undefined && layout?.backgroundFill !== undefined) {
      out.backgroundFill = layout.backgroundFill;
    }
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

export function resolveInline(inline: InlineLayout, ctx: ResolveContext, config?: CustomComplicationConfig): ResolvedInline {
  // Inline text can print a chart's number too, and Inline has no layer list
  // of its own to settle the charts from, so the document's list stands in.
  const r = new Resolver(ctx, config);
  const countdownEnd = inline.countdown ? r.countdownEnd(inline.value) : undefined;
  const fallback = inline.countdown ? r.countdownFallbackText(inline.value) : undefined;
  const out: ResolvedInline = { text: fallback ?? r.resolve(inline.value) ?? "--" };
  if (inline.label) out.label = inline.label;
  if (inline.symbol) out.symbol = inline.symbol;
  if (countdownEnd !== undefined) out.countdownEnd = countdownEnd;
  return out;
}

/** A Control Center control, resolved. Mirrors `resolveControl` in the app
 * repo: the six values through the same path a layer's text takes, the symbol
 * for the state it settled on, and the tint after the band table. */
export interface ResolvedControl {
  kind: ControlKind;
  title: string;
  /** The smaller line under the title. Absent when the control has none, or
   * when its value settled on nothing. */
  valueLabel?: string;
  /** What Control Center flashes on a press, on the same rule. */
  status?: string;
  symbol: string;
  /** Absent means the control keeps the system tint, which is what Control
   * Center draws for an untinted control. */
  tintColorHex?: string;
  /** Whether a toggle reads as on right now. Always false for a button, which
   * has no state to read. */
  isOn: boolean;
}

/**
 * One control, settled against the cached data.
 *
 * `config` stands in as the layer list the same way `resolveInline` uses it: a
 * control has no canvas, so a title that prints a chart's number has to find
 * the chart through the document.
 */
export function resolveControl(spec: ControlSpec, ctx: ResolveContext, config?: CustomComplicationConfig): ResolvedControl {
  const r = new Resolver(ctx, config);
  const kind = controlEffectiveKind(spec);
  // A line the author asked for that settles on nothing is left out rather
  // than drawn as "--": Control Center gives the space back to the title.
  const line = (value: Value | undefined): string | undefined => {
    if (value === undefined) return undefined;
    const text = r.resolve(value);
    return text === undefined || text === "" ? undefined : text;
  };
  const title = r.resolve(spec.title) ?? "--";
  const valueLabel = line(spec.valueLabel);
  // A button has no state, so nothing reads it: its symbol and its tint are
  // the on ones, which is the only thing a fire-and-forget press can draw.
  const stateText = kind === "toggle" ? line(spec.state) : undefined;
  const isOn = kind === "toggle" ? controlIsOn(stateText) : false;
  const out: ResolvedControl = {
    kind,
    title,
    symbol: kind === "toggle" && !isOn && spec.symbolOff !== undefined && spec.symbolOff !== ""
      ? spec.symbolOff
      : spec.symbol,
    isOn,
  };
  if (valueLabel !== undefined) out.valueLabel = valueLabel;
  const status = line(spec.status);
  if (status !== undefined) out.status = status;
  // The band table, read exactly as a gauge or a text layer reads it: sorted
  // once, lowest first, first match wins, `bandAboveColorHex` past the end.
  // The number comes from the value line when there is one, since that is the
  // reading on screen, then the state, then the title.
  const banded = spec.coloring === "bands" && spec.bands.length > 0;
  const reading = banded ? leadingNumber(valueLabel ?? stateText ?? title) : undefined;
  const tint = reading !== undefined
    ? chartBandColor(reading, chartSortedBands(spec), spec.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX)
    : spec.tintColorHex;
  if (tint !== undefined) out.tintColorHex = tint;
  return out;
}

/** Every shape the document supports, resolved at once: the supported canvas
 * shapes as layouts, plus Inline when the document supports it and carries
 * one. A shape not in `supportedFamilies` is absent, the same as the watch
 * (app repo `CustomComplication.resolveDocument`), so a preview never shows a
 * shape the wrist would not draw. */
export type ResolvedAll = Partial<Record<DrawableFamily, ResolvedLayout>> & { inline?: ResolvedInline };

export function resolveAll(
  config: CustomComplicationConfig,
  ctx: ResolveContext,
  forced?: ForcedBranches,
): ResolvedAll {
  const r = new Resolver(ctx);
  const out: ResolvedAll = {};
  for (const family of DRAWABLE_FAMILIES) {
    if (config.supportedFamilies.includes(family)) out[family] = r.resolveLayout(config, family, forced);
  }
  if (config.supportedFamilies.includes("inline") && config.inline) out.inline = resolveInline(config.inline, ctx, config);
  return out;
}

// ── geometry ──────────────────────────────────────────────────────────────
// Where a resolved layer's marks land inside its frame. Pure arithmetic over
// resolved elements, with no SVG in it, and it lives here rather than in the
// renderer because the anchors have to be settled before anything reads a
// frame: the preview, the drag handles, the layer thumbnails and the app repo's
// own resolver all have to agree about where a marker is.

/** The face the design box is drawn into, in points. */
export interface CanvasSize {
  width: number;
  height: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export function frameBox(el: ResolvedElement, canvas: CanvasSize): Box {
  const w = Math.max(0, el.frame.width * canvas.width);
  const h = Math.max(0, el.frame.height * canvas.height);
  const cx = (el.frame.x + el.frame.width / 2) * canvas.width;
  const cy = (el.frame.y + el.frame.height / 2) * canvas.height;
  return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
}

/** Height of the band a chart reserves for a triangle marker, at the end that
 * draws one, in watch points. Mirrors `CustomComplicationChartGeometry.markerHeight`
 * in Swift. */
const CHART_MARKER_BAND = 5;
/** Radius of a highlight dot, the chart's own end-marker dot included. */
export const CHART_HIGHLIGHT_DOT_RADIUS = 1.7;

/** A reading's dot is this many line widths across. */
export const CHART_DOT_SCALE = 1.8;

/** Whether a `chartDots` layer draws on a line or area. `all` always does;
 * `auto` only when neighbouring readings sit at least three dots apart,
 * measured on the plot the stroke alone would leave (inset by half the line),
 * and always for a single reading. Bars and an empty chart never do.
 *
 * Mirrors `CustomComplicationChartGeometry` in the app repo. */
export function chartDrawsDots(
  style: ChartStyle,
  dots: ChartDotsMode,
  count: number,
  plotWidth: number,
  lineInset: number,
  diameter: number,
): boolean {
  if (style === "bars" || count === 0) return false;
  if (dots === "all" || count === 1) return true;
  const spacing = Math.max(plotWidth - lineInset * 2, 0) / (count - 1);
  return spacing >= 3 * diameter;
}

/**
 * Every `chartDots` and `chartGrid` layer settled against its chart on one
 * shape, and every chart given the inset its dots need.
 *
 * A dots or grid layer takes its chart's frame, because it draws in the chart's
 * box; one whose chart is missing keeps its own and draws nothing. A dots
 * layer's diameter is its own size or the chart's line width times
 * `CHART_DOT_SCALE`, whether it draws follows `chartDrawsDots`, and its
 * `indices` are the readings that get a dot. A chart then carries the largest
 * diameter among its dots layers that are shown and draw, as `dotDiameter`.
 * Mirrors `CustomComplication.settlingChartDots` in the app repo.
 */
export function settleChartDots(elements: readonly ResolvedElement[], canvas: CanvasSize): ResolvedElement[] {
  if (!elements.some((el) => el.kind === "chartDots" || el.kind === "chartGrid")) return [...elements];
  const charts = new Map<string, ResolvedChart>();
  for (const el of elements) if (el.kind === "chart") charts.set(el.id, el);
  const widest = new Map<string, number>();
  const settled = elements.map((el): ResolvedElement => {
    if (el.kind === "chartGrid") {
      const chart = charts.get(el.chart);
      return chart === undefined ? { ...el, draws: false } : { ...el, frame: chart.frame, draws: chart.values.length > 0 };
    }
    if (el.kind !== "chartDots") return el;
    const chart = charts.get(el.chart);
    if (chart === undefined) return { ...el, diameter: 0, indices: [] };
    const diameter = el.size ?? chart.lineWidth * CHART_DOT_SCALE;
    const plotWidth = Math.max(chart.frame.width * canvas.width, 0);
    const draws = chartDrawsDots(chart.style, el.dots, chart.values.length, plotWidth, chart.lineWidth / 2, diameter);
    if (draws && !el.isHidden) widest.set(chart.id, Math.max(widest.get(chart.id) ?? 0, diameter));
    // The chart's own highlight dot already marks its high and low reading on a
    // line or area, so a dot here would sit on it as a ring.
    const indices = draws
      ? chart.values.map((_, i) => i).filter((i) => chart.holes[i] !== true && i !== chart.highIndex && i !== chart.lowIndex)
      : [];
    return { ...el, frame: chart.frame, diameter, indices };
  });
  if (widest.size === 0) return settled;
  return settled.map((el) => {
    if (el.kind !== "chart") return el;
    const d = widest.get(el.id);
    return d === undefined ? el : { ...el, dotDiameter: d };
  });
}

/** Where zero sits on a chart's scale, as a fraction of the plot from the
 * bottom, or undefined unless zero is strictly inside the range: on an edge a
 * line at zero would read as the plot's own border. */
export function chartZeroFraction(chart: { domainMin: number; domainMax: number }): number | undefined {
  if (!(chart.domainMin < 0 && chart.domainMax > 0)) return undefined;
  return (0 - chart.domainMin) / (chart.domainMax - chart.domainMin);
}

/** Where each grid line of `lines` runs across a chart's plot, top first: equal
 * rows, never on the plot's top or bottom edge. */
export function chartGridYs(g: { plotTop: number; plotBottom: number }, lines: number): number[] {
  const n = Math.max(0, Math.min(4, Math.round(lines)));
  const height = g.plotBottom - g.plotTop;
  return Array.from({ length: n }, (_, k) => g.plotTop + (height * (k + 1)) / (n + 1));
}

/** Where every mark of a chart lands inside its frame.
 *
 * Pure geometry, no colors: mirrors `CustomComplicationChartGeometry` in the app
 * repo, at scale 1 because the panel already draws in watch points. */
export function chartGeometry(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  const values = el.values;
  const n = Math.max(values.length, 1);
  // What each end actually draws: nothing unless that end is highlighted.
  const highMark = el.highIndex !== undefined ? el.highMarker : "none";
  const lowMark = el.lowIndex !== undefined ? el.lowMarker : "none";

  // The plot takes the whole frame. A chart's numbers are text layers of their
  // own, so nothing here reserves room for them; the author resizes the chart.
  const plotX = box.x;
  const plotW = Math.max(box.w, 0);

  // Line and area are stroked on the value itself, so half the stroke would fall
  // outside a plot sized to the frame. Bars are filled inside theirs. Dots on
  // the readings are wider than the stroke, so while a dots layer draws the
  // inset grows to the widest dot's radius and the dots at the edges are not
  // clipped.
  const lineInset = el.style === "bars" ? 0 : el.lineWidth / 2;
  const inset = el.dotDiameter !== undefined && el.style !== "bars" ? Math.max(lineInset, el.dotDiameter / 2) : lineInset;

  // An end marker takes only the room it needs to stay inside the frame, at its
  // own end (highest along the top, lowest along the bottom). A dot sits on the
  // plot's edge, so it needs its radius, which the stroke or dot inset may
  // already give. A triangle keeps its own band beyond the inset.
  const endInset = (mark: ChartEndMarker) => mark === "triangle"
    ? CHART_MARKER_BAND + inset
    : mark === "dot" ? Math.max(inset, CHART_HIGHLIGHT_DOT_RADIUS) : inset;
  const topInset = endInset(highMark);
  const bottomInset = endInset(lowMark);

  const top = box.y + topInset;
  const height = Math.max(box.h - topInset - bottomInset, 1);
  const bottom = top + height;

  const span = Math.max(el.domainMax - el.domainMin, Number.EPSILON);
  const growsFromBottom = el.baseline === "lowest";
  const minimumBar = growsFromBottom ? height * 0.12 : 0;

  // Cap the gap so bars never starve, whatever the author typed.
  const gap = Math.min(Math.max(el.barGap, 0), plotW / (n * 2));
  const barWidth = Math.max((plotW - gap * (n - 1)) / n, 0.5);

  const fraction = (v: number) => Math.min(1, Math.max(0, (v - el.domainMin) / span));
  const y = (v: number) => bottom - fraction(v) * height;

  return {
    count: values.length,
    barWidth,
    plotTop: top,
    plotBottom: bottom,
    plotLeft: plotX,
    plotRight: plotX + plotW,
    baselineY: growsFromBottom ? bottom : y(0),
    /** How far line and area points sit in from the plot's sides. */
    inset,
    /** Where a 0…1 fraction of the domain lands, 1 being the top of the plot.
     * The resolver hands the threshold over as a fraction so the renderer never
     * has to know what the domain was. */
    yAtFraction(f: number) {
      return bottom - Math.min(Math.max(f, 0), 1) * height;
    },
    barRect(index: number) {
      const x = plotX + index * (barWidth + gap);
      const value = values[index]!;
      let hi: number;
      let lo: number;
      if (growsFromBottom) {
        // The lowest reading would otherwise be a zero-height sliver, and a run of
        // equal readings would vanish entirely. Every bar keeps a visible stub.
        const h = minimumBar + fraction(value) * (height - minimumBar);
        hi = bottom - h;
        lo = bottom;
      } else {
        hi = y(value);
        lo = growsFromBottom ? bottom : y(0);
        if (hi > lo) [hi, lo] = [lo, hi]; // negative reading, hanging below zero
      }
      return { x, y: hi, w: barWidth, h: Math.max(lo - hi, 0.5) };
    },
    point(index: number) {
      const usable = Math.max(plotW - inset * 2, 0);
      const x = values.length > 1
        ? plotX + inset + (usable * index) / (values.length - 1)
        : plotX + plotW / 2;
      return { x, y: y(values[index]!) };
    },
    /** Where an end's marker is centred: a dot on the plot's edge at that end, a
     * triangle in the middle of its band at that end. */
    markerCenter(index: number, bars: boolean, end: "high" | "low" = "high") {
      const r = bars ? this.barRect(index) : undefined;
      const x = r ? r.x + r.w / 2 : this.point(index).x;
      const mark = end === "high" ? highMark : lowMark;
      const y = end === "high"
        ? (mark === "triangle" ? box.y + CHART_MARKER_BAND / 2 : top)
        : (mark === "triangle" ? box.y + box.h - CHART_MARKER_BAND / 2 : bottom);
      return { x, y };
    },
  };
}

/** A point on a chart's plot, in drawing coordinates. */
export interface ChartPoint {
  x: number;
  y: number;
}

/** One leg of a line chart, from one reading to the next. Each leg is its own
 * curve, which is what lets a banded line or fill draw one path per leg. */
export type ChartLeg =
  | { kind: "straight"; start: ChartPoint; end: ChartPoint }
  | { kind: "smooth"; start: ChartPoint; c1: ChartPoint; c2: ChartPoint; end: ChartPoint }
  | { kind: "step"; start: ChartPoint; corner: ChartPoint; end: ChartPoint };

/** The legs joining a chart's points, already mapped to plot coordinates, on
 * the chosen curve. Fewer than two points have no legs.
 *
 * Smooth is a Fritsch-Carlson monotone cubic: unlike Catmull-Rom it never
 * passes either end reading of a leg, so the line cannot overshoot the plot or
 * show a value that never happened. Step is step after: each reading holds
 * flat until the next one, which is what a Home Assistant state means.
 *
 * Mirrors `CustomComplicationChartGeometry` in the app repo, which runs the
 * same maths in the same order; `chart.test.ts` pins the shared numbers. */
export function chartLegs(points: readonly ChartPoint[], curve: ChartCurve): ChartLeg[] {
  const n = points.length;
  if (n < 2) return [];
  const legs: ChartLeg[] = [];
  if (curve === "step") {
    for (let k = 0; k < n - 1; k++) {
      const start = points[k]!;
      const end = points[k + 1]!;
      legs.push({ kind: "step", start, corner: { x: end.x, y: start.y }, end });
    }
    return legs;
  }
  if (curve !== "smooth") {
    for (let k = 0; k < n - 1; k++) legs.push({ kind: "straight", start: points[k]!, end: points[k + 1]! });
    return legs;
  }
  // Secant slopes, then a tangent per point: the ends take their one secant,
  // an interior point the mean of its two unless the series turns there.
  // A leg with no width (a plot squeezed to nothing) reads as flat, as on the
  // watch, so the maths stays finite.
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) {
    const h = points[k + 1]!.x - points[k]!.x;
    d.push(h === 0 ? 0 : (points[k + 1]!.y - points[k]!.y) / h);
  }
  const m: number[] = new Array<number>(n).fill(0);
  m[0] = d[0]!;
  m[n - 1] = d[n - 2]!;
  for (let k = 1; k < n - 1; k++) {
    m[k] = d[k - 1]! * d[k]! <= 0 ? 0 : (d[k - 1]! + d[k]!) / 2;
  }
  // Pull back any tangent pair steep enough to overshoot its leg.
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) {
      m[k] = 0;
      m[k + 1] = 0;
      continue;
    }
    const a = m[k]! / d[k]!;
    const b = m[k + 1]! / d[k]!;
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[k] = t * a * d[k]!;
      m[k + 1] = t * b * d[k]!;
    }
  }
  for (let k = 0; k < n - 1; k++) {
    const start = points[k]!;
    const end = points[k + 1]!;
    const h = end.x - start.x;
    legs.push({
      kind: "smooth",
      start,
      c1: { x: start.x + h / 3, y: start.y + (m[k]! * h) / 3 },
      c2: { x: end.x - h / 3, y: end.y - (m[k + 1]! * h) / 3 },
      end,
    });
  }
  return legs;
}

/** A centred, Gaussian-weighted average at a smoothing strength, the window
 * scaling with the number of readings (`chartSmoothingWindowSize`) and shrinking
 * at the ends so no reading is dropped and every index still lines up. Sigma is
 * a quarter of the window. Mirrors the smoothing in `CustomComplication.chartSeries`,
 * down to summing left to right so the two agree to the last digit.
 *
 * Holes (gaps for unavailable) are left out of both the weighted sum and the
 * weights. */
export function chartSmoothed(values: number[], smoothing: ChartSmoothing | undefined, holes: readonly boolean[] = []): number[] {
  const n = values.length;
  const window = chartSmoothingWindowSize(n, smoothing);
  if (window === 0) return values;
  const half = Math.floor(window / 2);
  const sigma = half / 2;
  const isHole = (i: number) => holes[i] === true;
  const averaged = values.map((v, i) => {
    if (isHole(i)) return v;
    let sum = 0;
    let weights = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(n - 1, i + half); j++) {
      if (isHole(j)) continue;
      const d = j - i;
      const w = Math.exp(-(d * d) / (2 * sigma * sigma));
      sum += values[j]! * w;
      weights += w;
    }
    return sum / weights;
  });
  // A hole stays a hole, re-carried from the averaged series: the previous
  // real output, or the first real output for leading holes. So a hole never
  // holds a raw value the averaged line does not reach.
  const firstReal = averaged.find((_, i) => !isHole(i));
  if (firstReal === undefined) return averaged;
  let carried = firstReal;
  return averaged.map((v, i) => {
    if (isHole(i)) return carried;
    carried = v;
    return v;
  });
}

/** The stretches of a chart a line or area draws: runs of consecutive indices
 * with no hole in them, oldest first. A series without holes is one run. */
export function chartRuns(count: number, holes: readonly boolean[]): number[][] {
  const runs: number[][] = [];
  let current: number[] = [];
  for (let i = 0; i < count; i++) {
    if (holes[i] === true) {
      if (current.length > 0) runs.push(current);
      current = [];
    } else {
      current.push(i);
    }
  }
  if (current.length > 0) runs.push(current);
  return runs;
}

/** The point between the row of times and the drawing beside it, so a descender
 * never touches a run or a bar. Mirrors the same spacing in the app repo's
 * timeline and chart views. */
const TIMELINE_LABEL_ROW_GAP = 1;

/** How a layer's frame splits between its drawing and its row of times.
 *
 * A frame too short to carry both keeps the drawing whole: half a strip and
 * half a time reads as neither, and the drawing is the thing the layer is for.
 * Mirrors `TimelineBodyView` and `ChartBodyView` in the app repo. */
export function timeLabelRowSplit(
  el: { labels: TimelineLabel[]; labelSize: number; labelsAbove: boolean },
  box: Box,
): { labelSize: number; rowHeight: number; body: Box; showsLabels: boolean } {
  const labelSize = Math.max(TIMELINE_MIN_LABEL_SIZE, Math.min(TIMELINE_MAX_LABEL_SIZE, el.labelSize));
  const rowHeight = labelSize * 1.2;
  const showsLabels = el.labels.length > 0 && box.h - rowHeight - TIMELINE_LABEL_ROW_GAP >= 2;
  const body: Box = showsLabels
    ? {
      ...box,
      y: el.labelsAbove ? box.y + rowHeight + TIMELINE_LABEL_ROW_GAP : box.y,
      h: box.h - rowHeight - TIMELINE_LABEL_ROW_GAP,
      cy: (el.labelsAbove ? box.y + rowHeight + TIMELINE_LABEL_ROW_GAP : box.y)
        + (box.h - rowHeight - TIMELINE_LABEL_ROW_GAP) / 2,
    }
    : box;
  return { labelSize, rowHeight, body, showsLabels };
}

/**
 * Every layer with its anchored ones moved onto their chart.
 *
 * A chart marker is an ordinary layer with a `chartAnchor` on it, so this is the one
 * place that turns "over the lowest reading" into a frame. Only `x` and `y` are
 * rewritten: the author's width and height are the marker's size.
 *
 * Nothing is reserved along the top of the plot for it. The marker hangs in the empty
 * space above its own bar and is pushed back down when the bar is tall enough that it
 * would otherwise leave the chart, so the bars keep their full height. Mirrors
 * `CustomComplication.applyingChartAnchors` in the app repo.
 */
export function placeChartAnchors(
  elements: readonly ResolvedElement[],
  canvas: CanvasSize,
): readonly ResolvedElement[] {
  if (!elements.some((el) => el.chartAnchor !== undefined)) return elements;
  const charts = new Map<string, Extract<ResolvedElement, { kind: "chart" }>>();
  for (const el of elements) if (el.kind === "chart") charts.set(el.id, el);
  if (charts.size === 0) return elements;
  return elements.map((el) => {
    const anchor = el.chartAnchor;
    if (anchor === undefined) return el;
    const chart = charts.get(anchor.layer);
    if (chart === undefined) return el;
    // A layer at zero is not drawn at all while zero is outside the range or on
    // its edge: unlike a threshold, nothing the author typed put it there.
    if (anchor.at === "zero" && chartZeroFraction(chart) === undefined) return { ...el, isHidden: true };
    const frame = anchoredFrame(el.frame, anchor, chart, canvas);
    return frame === undefined ? el : { ...el, frame };
  });
}

/** Which column of the chart an anchor names, or undefined when this chart has no
 * such column. The highest and lowest are found here rather than read from the
 * chart's `highIndex`, because those are set only when the highlight asks for them
 * and a marker is worth having on a chart that highlights nothing. First occurrence
 * wins, matching the rule the highlight itself uses on a flat run. A hole is never
 * named: its value is a carried copy, and nothing is drawn there to sit on. */
function anchorIndex(
  at: ChartAnchorPoint,
  chart: Extract<ResolvedElement, { kind: "chart" }>,
): number | undefined {
  const values = chart.values;
  if (values.length === 0) return undefined;
  const real = values.map((_, i) => i).filter((i) => chart.holes.length === 0 || !chart.holes[i]);
  if (real.length === 0) return undefined;
  switch (at) {
    case "highest": return real.reduce((best, i) => (values[i]! > values[best]! ? i : best));
    case "lowest": return real.reduce((best, i) => (values[i]! < values[best]! ? i : best));
    case "first": return real[0];
    case "latest": return real[real.length - 1];
    case "now": return chart.nowIndex === undefined
      ? undefined
      : Math.min(Math.max(chart.nowIndex, 0), values.length - 1);
    case "threshold": return undefined;
    case "zero": return undefined;
  }
}

/** Where one anchored layer sits, in normalized coordinates. Mirrors
 * `CustomComplication.anchoredFrame` in the app repo, point for point. */
function anchoredFrame(
  frame: NormalizedFrame,
  anchor: ChartAnchor,
  chart: Extract<ResolvedElement, { kind: "chart" }>,
  canvas: CanvasSize,
): NormalizedFrame | undefined {
  if (canvas.width <= 0 || canvas.height <= 0) return undefined;

  const layer = frameBox(chart, canvas);
  if (layer.w <= 0 || layer.h <= 0) return undefined;
  // A chart drawing clock times gives the row its own band, and the plot is what is
  // left. A marker belongs to the plot, so it measures against that rect.
  const plot = timeLabelRowSplit(chart, layer).body;
  if (plot.w <= 0 || plot.h <= 0) return undefined;

  const g = chartGeometry(chart, plot);

  // What the anchor names, inside the plot. A column gives a centre across and the
  // top of its reading; the threshold gives a height and nothing across.
  let across: number | undefined;
  let level: number;
  if (chartAnchorIsColumn(anchor.at)) {
    const index = anchorIndex(anchor.at, chart);
    if (index === undefined) return undefined;
    // Bars are filled to their top edge; a line or an area passes through a point.
    // Either way the marker measures from the same place the eye does.
    if (chart.style === "bars") {
      const bar = g.barRect(index);
      across = bar.x + bar.w / 2;
      level = bar.y;
    } else {
      const p = g.point(index);
      across = p.x;
      level = p.y;
    }
  } else {
    // A height: the threshold's, or zero's on the chart's scale.
    const at = anchor.at === "zero" ? chartZeroFraction(chart) : chart.thresholdY;
    if (at === undefined) return undefined;
    level = g.yAtFraction(at);
  }

  const w = Math.max(frame.width, 0) * canvas.width;
  const h = Math.max(frame.height, 0) * canvas.height;
  // Enough daylight that a marker reads as sitting over the bar rather than welded
  // to it, and small enough that it never looks detached.
  const gap = 0.75;

  // Keep the marker inside the chart it belongs to. A marker that slid off the plot
  // is a marker pointing at nothing, and on the top edge this is exactly what stops
  // a large glyph from eating into the bars.
  const held = (v: number, lo: number, hi: number) =>
    lo > hi ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi);

  const out: NormalizedFrame = { ...frame };
  if (across !== undefined) {
    const x = held(across + (anchor.dx ?? 0), plot.x + w / 2, plot.x + plot.w - w / 2);
    out.x = (x - w / 2) / canvas.width;
  }

  // Through the plot: the plot owns the other axis outright, so the nudge along it
  // is ignored and nothing there is clamped.
  if (anchor.place === "through") {
    if (across !== undefined) {
      out.y = g.plotTop / canvas.height;
      out.height = (g.plotBottom - g.plotTop) / canvas.height;
    } else {
      out.x = g.plotLeft / canvas.width;
      out.width = (g.plotRight - g.plotLeft) / canvas.width;
      const y = held(level + (anchor.dy ?? 0), plot.y + h / 2, plot.y + plot.h - h / 2);
      out.y = (y - h / 2) / canvas.height;
    }
    return out;
  }

  const cy =
    anchor.place === "on" ? level
    : anchor.place === "below" ? level + gap + h / 2
    : anchor.place === "bottom" ? g.plotBottom - gap - h / 2
    : level - gap - h / 2;
  // The spot the anchor names stays inside the plot, so a tall bar pushes its
  // marker down rather than off the top. The nudge is the author's own choice and
  // may take the marker past the chart, as far as the edge of the face.
  const base = held(cy, plot.y + h / 2, plot.y + plot.h - h / 2);
  const y = held(base + (anchor.dy ?? 0), h / 2, canvas.height - h / 2);
  out.y = (y - h / 2) / canvas.height;
  return out;
}


export function comparisonNeedsValue(c: Comparison): boolean {
  return c.value !== undefined;
}
