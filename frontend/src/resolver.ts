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
  textColorsByValue,
  textUsesParts,
  clockTime,
  elementsFor,
  formatIsEmpty,
  hasFreeTimestamp,
  DESIGN_BOX,
  type ChartAnchor,
  type ChartAnchorPoint,
  chartAnchorIsColumn,
  TIMELINE_MIN_LABEL_SIZE,
  TIMELINE_MAX_LABEL_SIZE,
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
  /** Recorder series for the layers that draw history, keyed by
   * `chartHistoryKey` for a chart and `timelineHistoryKey` for a timeline. A
   * missing key draws an empty layer, which is what the watch does too before
   * its first fetch lands. */
  historySeries?: Map<string, string>;
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
}

export interface ResolvedBase {
  id: string;
  isHidden: boolean;
  frame: NormalizedFrame;
  opacity: number;
  /** The chart reading this layer follows, carried through so the renderer can
   * put it over that reading. The frame here is still the author's: the anchor
   * only ever decides where it lands, and the width and height stay theirs. */
  chartAnchor?: ChartAnchor;
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
  /** 1 or 2. Straight off the element. */
  lineLimit: number;
  /** Which edge of the layer box the text sits against. Straight off the element. */
  alignment: TextAlignment;
  /** The text cut into runs of one colour, when the layer colours its numbers by
   * value (`textColorsByValue`). Joined, the runs spell `text` exactly. Absent
   * when the whole text is `colorHex`, which is every layer that does not ask. */
  spans?: TextSpan[];
  /** Rich text: every visible part, in order, each in its own look. Absent when
   * the layer is not drawn as parts (it has none, it is a countdown, or a layer
   * rule set the text); empty when every part is hidden. With parts, `text` is
   * their texts joined, the layer's size, weight and colour are what a part set
   * to the layer's look takes, and `spans` is absent. */
  parts?: ResolvedTextPart[];
}
/** One visible part of a rich text layer. Mirrors `ResolvedText.Part` in the
 * app repo, key for key. */
export interface ResolvedTextPart {
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  colorHex: string;
  /** The part's text cut into runs by its own band table, with no highlight.
   * Absent when the part is one colour. */
  spans?: TextSpan[];
}
/** One run of a text layer drawn in one colour. Mirrors `ResolvedText.Span` in
 * the app repo. */
export interface TextSpan {
  text: string;
  colorHex: string;
}
export interface ResolvedIcon extends ResolvedBase {
  kind: "icon";
  symbol: string;
  /** The SVG `d` to draw instead of an SF Symbol, when the layer's symbol is a
   * Material Design icon the author picked by hand. Absent for everything else,
   * including a symbol an entity or a rule supplied: those name SF Symbols, and
   * the layer's stored path describes a glyph that is no longer shown. */
  path?: string;
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
  /** Where the threshold tick sits, as a 0...1 fraction of the scale. Absent when
   * there is no threshold or it falls outside the range: a value the gauge cannot
   * show is not drawn at an edge, where it would read as a threshold already met. */
  thresholdFraction?: number;
  thresholdColorHex: string;
  /** How many dots a `dots` gauge draws, and how many of them are filled. Settled
   * here so the renderer never parses a value. */
  dotCount: number;
  filledCount: number;
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
  /** The shared marker as stored. Nothing draws from it any more; it is kept
   * because the shared fixtures pin it. */
  marker: ChartMarker;
  /** The mark each end draws. "none" for an end the highlight does not cover,
   * whatever the layer stores for it, so a marker never shows without its
   * highlight. */
  highMarker: ChartEndMarker;
  lowMarker: ChartEndMarker;
  /** One colour per reading, parallel to `values`. Empty when the whole series
   * is one colour, which keeps the common case free of a second array. */
  pointColorHexes: string[];
  /** Whether an area's fill follows `pointColorHexes` too. */
  fillBands: boolean;
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
  if (r.values.length === 0) return undefined;
  switch (stat) {
    case "latest": return r.values[r.values.length - 1];
    case "highest": return Math.max(...r.values);
    case "lowest": return Math.min(...r.values);
    case "average": return r.values.reduce((a, b) => a + b, 0) / r.values.length;
    case "top": return r.domainMax;
    case "bottom": return r.domainMin;
    case "first": return r.values[0];
    case "delta": return r.values[r.values.length - 1]! - r.values[0]!;
    case "sum": return r.values.reduce((a, b) => a + b, 0);
    case "trend": {
      // The sign of the change, but only after the change has been rounded the
      // way every other number off this chart is rounded. Without that deadband
      // a series that wobbled in the last decimal place the chart does not even
      // print would still read as rising.
      const change = r.values[r.values.length - 1]! - r.values[0]!;
      const rounded = Number(chartStatText(change, r.domainMax - r.domainMin));
      if (rounded > 0) return 1;
      if (rounded < 0) return -1;
      return 0;
    }
  }
}
/** One stretch of a timeline in one colour. `start` and `end` are fractions of
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

export interface ResolvedShape extends ResolvedBase {
  kind: "shape";
  shapeKind: ShapeKind;
  cornerRadius: number;
  /** Only read for the `line` kind. */
  thickness: number;
  fillColorHex: string;
  borderColorHex?: string;
  borderWidth: number;
}
export interface ResolvedImage extends ResolvedBase {
  kind: "image";
  entityId: string;
  /** Where the pixels come from, so the placeholder can name the right kind of
   * missing picture. */
  source: ImageSource;
  /** Preview URL (HA's entity_picture). Absent = draw the placeholder. */
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
export type ResolvedElement = ResolvedText | ResolvedIcon | ResolvedGauge | ResolvedChart | ResolvedTimeline | ResolvedShape | ResolvedImage | ResolvedTap;

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

export function formatValue(raw: string, format: ValueFormat | undefined, unit: string | undefined): string {
  if (formatIsEmpty(format)) return raw;
  const f = format!;
  let text = raw;
  const trimmedNumber = swiftDouble(raw.trim());
  const durationValue = f.duration ? durationSeconds(raw) : undefined;
  if (durationValue !== undefined) {
    text = durationString(durationValue);
  } else if (f.relativeTime && trimmedNumber !== undefined) {
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
  return numberTokens(raw, limit).map((t) => t.value);
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
 * behind both `chartNumbers` and a text layer's colour by value, so a chart and
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

/** The keys a run of text is coloured by value from: a whole text layer's, or
 * one part's, which carries the table and never a highlight. */
export type TextValueColoring = Pick<TextElement, "coloring" | "bands" | "bandAboveColorHex" | "highlight" | "highColorHex" | "lowColorHex">;

/**
 * A text layer's colour by value: the text cut into runs of one colour.
 *
 * Numbers are read with `numberTokens`, exactly as a chart reads its series.
 * The highlight picks one number per end the way a chart picks its highIndex
 * and lowIndex: the first occurrence of the largest and of the smallest, and
 * when that is the same number the highest wins. A number then takes the
 * highest colour, else the lowest colour, else its band when the table is in
 * use, else the layer colour. Everything that is not a number keeps the layer
 * colour, a trailing dot included. Neighbouring runs of the same colour are one
 * run, and no run is empty: text with no numbers is one run in the layer colour,
 * and empty text is no runs at all.
 *
 * A part of a rich text layer is read the same way with its own table and no
 * highlight, since a part has none.
 *
 * Mirrors `CustomComplication.textSpans` in Swift.
 */
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
    // punctuation, so the coloured run ends at the last digit. A dot inside a
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
 * The samples cut into coloured runs across the frame.
 *
 * Each sample runs until the next one starts, and the last runs to the right
 * edge, which is now. Neighbours of one colour are merged into a single run:
 * two states that draw the same colour are one thing to look at, and the watch
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

// ── value resolution ──────────────────────────────────────────────────────

export class Resolver {
  private readonly named: Map<string, Value>;
  /** Every chart in the document, settled, by layer id. Filled from `config`
   * when the resolver is built, and again by `resolveLayout`, so a text layer
   * or a rule that reads a chart's number finds the chart already decided. */
  private readonly charts = new Map<string, ChartReadings>();

  constructor(private readonly ctx: ResolveContext, config?: CustomComplicationConfig) {
    this.named = new Map(ctx.namedValues.map((n) => [n.id.toUpperCase(), n.value]));
    if (config) this.settleCharts(config);
  }

  /** The series a chart draws and the range it draws it against. One function
   * for the chart itself and for the `chartStat` values that read it, so the
   * two cannot disagree about what "the newest reading" is. Mirrors
   * `CustomComplication.chartReadings(for:context:)`. */
  chartReadings(c: ChartElement): ChartReadings {
    const values = this.chartSeries(c);
    const domain = chartDomain(values, c);
    const out: ChartReadings = { values, domainMin: domain.min, domainMax: domain.max };
    const entity = this.chartEntity(c);
    if (entity) out.entity = entity;
    return out;
  }

  /** The numbers a chart draws, trimmed to its `limit`, before anything decides
   * what range to draw them against. Split out because `scaleFrom` settles the
   * series of every chart before it settles any range. Mirrors
   * `CustomComplication.chartSeries`. */
  private chartSeries(c: ChartElement): number[] {
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
    let values = chartNumbers(raw);
    // A test value stands in for the newest reading, the way it stands in for
    // the state everywhere else. A chart of its own value already reads it.
    const tested = fromRecorder === undefined ? undefined : this.testedReading(c);
    if (tested !== undefined) values = [...values.slice(0, -1), tested];
    if (c.limit > 0 && values.length > c.limit) {
      return c.takeFromEnd ? values.slice(values.length - c.limit) : values.slice(0, c.limit);
    }
    return values;
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
   * chart's own scale. Mirrors `ResolveContext.withChartReadings(from:)`. */
  private settleCharts(config: CustomComplicationConfig): void {
    const charts = new Map<string, ChartElement>();
    const order: string[] = [];
    for (const el of config.elements) {
      if (el.kind !== "chart" || charts.has(el.payload.id)) continue;
      charts.set(el.payload.id, el.payload);
      order.push(el.payload.id);
    }

    const series = new Map<string, number[]>();
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
        : chartDomain(series.get(id) ?? [], chart);
      domains.set(id, result);
      return result;
    };

    for (const id of order) {
      const chart = charts.get(id)!;
      const range = domainOf(id, new Set([id]));
      const out: ChartReadings = {
        values: series.get(id) ?? [],
        domainMin: range.min,
        domainMax: range.max,
      };
      const entity = this.chartEntity(chart);
      if (entity) out.entity = entity;
      this.charts.set(id, out);
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
   * Every visible part of a rich text layer, in order, against the layer's
   * already resolved look.
   *
   * A part's rules can change only what a part has: its colour, text, size,
   * weight and whether it shows. Anything else one sets is ignored rather than
   * leaking onto the layer. Each look falls back rule first, then the part's
   * own setting, then the layer, so a layer rule that recolours the text
   * reaches every part that has no colour of its own.
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
        colorHex: this.styleColor(style, "color") ?? part.colorHex ?? layer.colorHex,
      };
      if (part.coloring === "bands" && (part.bands?.length ?? 0) > 0) {
        resolved.spans = textValueSpans(resolved.text, resolved.colorHex, part);
      }
      out.push(resolved);
    }
    return out;
  }

  resolveElement(el: Element, forced?: ForcedBranches): ResolvedElement {
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
    const opacity = this.styleNumber(style, "opacity") ?? 1;
    const base: ResolvedBase = { id: p.id, isHidden, frame, opacity };
    if (p.chartAnchor !== undefined) base.chartAnchor = p.chartAnchor;
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
          lineLimit: el.payload.lineLimit === 2 ? 2 : 1,
          alignment: el.payload.alignment ?? "center",
        };
        if (countdownEnd !== undefined) out.countdownEnd = countdownEnd;
        if (rich) {
          // The layer's own colour by value is ignored: each part carries its
          // own table, and the layer's would colour numbers across parts.
          out.parts = this.resolveTextParts(el.payload.parts!, p.rules, out, forced);
          out.text = out.parts.map((part) => part.text).join("");
          return out;
        }
        // Read off the final text and colour, so a rule that rewrites the text
        // or recolours the layer is what the numbers are read from and what the
        // rest of the text keeps.
        if (textColorsByValue(el.payload)) out.spans = textValueSpans(out.text, out.colorHex, el.payload);
        return out;
      }
      case "icon": {
        const baseSymbol = this.entityIcon(el.payload.symbol) ?? this.resolve(el.payload.symbol) ?? "questionmark.circle";
        const override = this.styleText(style, "icon");
        // The stored path belongs to the symbol the author picked, so it
        // survives only while that symbol is what gets drawn.
        const literalSymbol = el.payload.symbol.kind.kind === "literal";
        const path = override === undefined && literalSymbol && el.payload.path !== ""
          ? el.payload.path
          : undefined;
        let symbol = override ?? baseSymbol;
        // A hand-typed `mdi:` name with no path is a name nothing can draw. The
        // placeholder makes the mistake visible; blank would read as a bug.
        if (path === undefined && symbol.startsWith("mdi:")) symbol = "questionmark.circle";
        const out: ResolvedIcon = {
          kind: "icon",
          ...base,
          symbol,
          size: this.styleNumber(style, "fontSize") ?? el.payload.size,
          colorHex: this.styleColor(style, "color") ?? el.payload.colorSlot.baseColorHex,
        };
        if (path !== undefined) out.path = path;
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

        // A band names its own colour, so it wins over a rule that recolours the
        // gauge: the rule says the layer is in an unusual state, the table says
        // where this reading sits, and the table is the more specific statement.
        let colorHex = this.styleColor(style, "color") ?? g.colorSlot.baseColorHex;
        if (g.coloring === "bands" && g.bands.length > 0 && reading !== undefined) {
          colorHex = chartBandColor(reading, chartSortedBands(g), g.bandAboveColorHex);
        }

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
        };
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
          thresholdColorHex: c.thresholdColorHex,
          drawsThreshold: c.drawsThreshold !== false,
          nowColorHex: c.nowColorHex,
          drawsNowLine: c.drawsNowLine !== false,
          // The times do not wait on the series: the window is known the moment
          // the layer names an entity and a span, so a plot still fetching
          // prints them. The size is carried as written and clamped where it is
          // drawn, exactly as the timeline carries its own.
          labels: chartLabels(c, this.nowMs()),
          labelSize: c.labelSize,
          labelColorHex: c.labelColorHex,
          labelsAbove: c.labelsAbove,
        };
        if (values.length > 0) {
          const high = marksHigh ? values.indexOf(Math.max(...values)) : -1;
          const low = marksLow ? values.indexOf(Math.min(...values)) : -1;
          if (high >= 0) out.highIndex = high;
          // One reading cannot be both ends of the range; highest wins.
          if (low >= 0 && low !== high) out.lowIndex = low;
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
          labels: timelineLabels(t, this.nowMs()),
          labelSize: t.labelSize,
          labelColorHex: t.labelColorHex,
          labelsAbove: t.labelsAbove,
        };
        return out;
      }
      case "shape": {
        const out: ResolvedShape = {
          kind: "shape",
          ...base,
          shapeKind: el.payload.kind,
          cornerRadius: el.payload.cornerRadius,
          thickness: el.payload.thickness,
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
    // Charts go first, in effect: a text layer that prints a chart's newest
    // reading, or a rule that tests one, needs the chart settled before it
    // resolves, whatever order the two sit in the layer list.
    this.settleCharts(config);
    // The markers move onto their charts here, not at draw time, so the preview,
    // the drag handles, the layer thumbnails and the app repo's own resolver all
    // read one set of frames. Mirrors `CustomComplication.resolve` in the app repo.
    const elements = [...placeChartAnchors(
      elementsFor(config, family).map((el) => this.resolveElement(el, forced)),
      DESIGN_BOX[family === "inline" ? "rectangular" : family],
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

/** Height of the band a chart reserves along its top for markers, in watch points.
 * Mirrors `CustomComplicationChartGeometry.markerHeight` in Swift. */
const CHART_MARKER_BAND = 5;

/** Where every mark of a chart lands inside its frame.
 *
 * Pure geometry, no colours: mirrors `CustomComplicationChartGeometry` in the app
 * repo, at scale 1 because the panel already draws in watch points. */
export function chartGeometry(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  const values = el.values;
  const n = Math.max(values.length, 1);
  // Room along the top only when a highlighted end actually draws a mark there.
  const marks = (el.highIndex !== undefined && el.highMarker !== "none")
    || (el.lowIndex !== undefined && el.lowMarker !== "none");
  const band = marks ? CHART_MARKER_BAND : 0;
  // Line and area are stroked on the value itself, so half the stroke would fall
  // outside a plot sized to the frame. Bars are filled inside theirs.
  const inset = el.style === "bars" ? 0 : el.lineWidth / 2;

  // The plot takes the whole frame. A chart's numbers are text layers of their
  // own, so nothing here reserves room for them; the author resizes the chart.
  const plotX = box.x;
  const plotW = Math.max(box.w, 0);

  const top = box.y + band + inset;
  const height = Math.max(box.h - band - inset * 2, 1);
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
    markerCenter(index: number, bars: boolean) {
      const r = bars ? this.barRect(index) : undefined;
      return { x: r ? r.x + r.w / 2 : this.point(index).x, y: box.y + band / 2 };
    },
  };
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
    const frame = anchoredFrame(el.frame, anchor, chart, canvas);
    return frame === undefined ? el : { ...el, frame };
  });
}

/** Which column of the chart an anchor names, or undefined when this chart has no
 * such column. The highest and lowest are found here rather than read from the
 * chart's `highIndex`, because those are set only when the highlight asks for them
 * and a marker is worth having on a chart that highlights nothing. First occurrence
 * wins, matching the rule the highlight itself uses on a flat run. */
function anchorIndex(
  at: ChartAnchorPoint,
  chart: Extract<ResolvedElement, { kind: "chart" }>,
): number | undefined {
  const values = chart.values;
  if (values.length === 0) return undefined;
  switch (at) {
    case "highest": return values.indexOf(Math.max(...values));
    case "lowest": return values.indexOf(Math.min(...values));
    case "first": return 0;
    case "latest": return values.length - 1;
    case "now": return chart.nowIndex === undefined
      ? undefined
      : Math.min(Math.max(chart.nowIndex, 0), values.length - 1);
    case "threshold": return undefined;
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
    if (chart.thresholdY === undefined) return undefined;
    level = g.yAtFraction(chart.thresholdY);
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
  const y = held(cy + (anchor.dy ?? 0), plot.y + h / 2, plot.y + plot.h - h / 2);
  out.y = (y - h / 2) / canvas.height;
  return out;
}


export function comparisonNeedsValue(c: Comparison): boolean {
  return c.value !== undefined;
}
