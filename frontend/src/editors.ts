// Inspector controls. Every function renders a form for one part of the
// draft and reports edits through `EditorHost.update`, which the panel wires
// to the Draft's undo history. Controls are plain HTML inputs styled to HA
// so the bundle stays free of HA's internal component library.

import { html, nothing, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import {
  type AccentGroup,
  type AggregateSpec,
  type BezelGauge,
  type CallServiceAction,
  type ChartBaseline,
  type ChartBand,
  type ChartColoring,
  type ChartElement,
  type ChartHighlight,
  type ChartScale,
  type ChartStat,
  type ChartStyle,
  type Comparison,
  type ComparisonKind,
  type CustomComplicationConfig,
  type Element as CElement,
  type EntityRef,
  type FamilyKind,
  type FamilyLayout,
  type FontWeight,
  type FontDesign,
  type FontWidth,
  type LayerShadow,
  SHADOW_DEFAULT,
  SHADOW_DEFAULT_HEX,
  SHADOW_MAX_OFFSET,
  SHADOW_MAX_RADIUS,
  TEXT_MIN_SCALE,
  clampLayerOpacity,
  clampMinimumScale,
  clampShadowOffset,
  clampShadowRadius,
  type TextAlignment,
  type GaugeElement,
  type GaugeStyle,
  type ImageElement,
  type LayerEntityUse,
  type LayerGroup,
  type NamedValue,
  type NormalizedFrame,
  type Placement,
  type Rule,
  type RuleCase,
  type RuleTarget,
  type StyleChange,
  type StyleChangeKind,
  type StyleProperty,
  type RefreshAllAction,
  type ShowPageAction,
  type TapAction,
  type RefreshAction,
  type TapElement,
  type TextArc,
  type TextElement,
  type TextPart,
  type TimeField,
  type TimelineBand,
  type TimelineElement,
  type Value,
  type ValueFormat,
  type ValueKind,
  CHART_DEFAULT_BAND_HIGH_HEX,
  GAUGE_DEFAULT_THRESHOLD_HEX,
  GAUGE_MAX_DOTS,
  chartSortedBands,
  chartStatText,
  CHART_DEFAULT_BAND_LOW_HEX,
  CHART_DEFAULT_HIGH_HEX,
  CHART_HISTORY_DEFAULT_MINUTES,
  CHART_HISTORY_EVERY_READING,
  CHART_HISTORY_MAX_MINUTES,
  CHART_HISTORY_MAX_POINTS,
  CHART_HISTORY_MIN_POINTS,
  CHART_HISTORY_SPANS,
  CHART_STATISTICS_MAX_MINUTES,
  CHART_STATISTICS_SPANS,
  CHART_DEFAULT_STAT_PERIOD,
  CHART_DEFAULT_STAT_TYPE,
  STAT_PERIODS,
  STAT_TYPES,
  chartHistoryKey,
  chartStatisticsKey,
  chartShowsTimeLabels,
  TIMELINE_DEFAULT_OTHER_HEX,
  TIMELINE_DOMAIN_STATES,
  timelineStateColor,
  TIMELINE_HISTORY_POINTS,
  TIMELINE_MAX_GAP,
  TIMELINE_DEFAULT_LABEL_HEX,
  TIMELINE_DEFAULT_LABEL_SIZE,
  TIMELINE_HOUR_CYCLES,
  TIMELINE_MAX_LABEL_COUNT,
  TIMELINE_MAX_LABEL_SIZE,
  TIMELINE_MIN_LABEL_SIZE,
  TIMELINE_MINUTE_STYLES,
  type TimelineHourCycle,
  type TimelineMinuteStyle,
  timelineHistoryKey,
  timelineHistoryMinutes,
  TIMELINE_AGGREGATE_SEED_DOMAIN,
  TIMELINE_COMBINES,
  TIMELINE_DEFAULT_COMBINE,
  TIMELINE_MAX_AGGREGATE_ENTITIES,
  TIMELINE_MIN_AGGREGATE_ENTITIES,
  type TimelineCombine,
  seedTimelineBands,
  timelineAggregateEntities,
  timelineAggregateRows,
  timelineAggregateOverCap,
  timelineCombineHint,
  CHART_STATS,
  addChartLabel,
  addChartSeries,
  chartLabelsOf,
  chartOfValue,
  CHART_DEFAULT_LOW_HEX,
  COMPARISON_KINDS,
  DRAWABLE_FAMILIES,
  elementSize,
  refitPlacement,
  IMAGE_NEW_CORNER_RADIUS,
  ZERO_OUTSET,
  hasFreeTimestamp,
  isZeroOutset,
  nearestTimestampCorner,
  CUSTOM_FLASH_DEFAULT,
  RULE_TARGET_PROPERTIES,
  STYLE_PROPERTY,
  TAP_ACTION_LABELS,
  TAP_ACTION_GROUPS,
  tapActionInfo,
  tapActionLabel,
  describeTapAction,
  refreshTargetsWith,
  refreshTargetAllLayersWith,
  refreshTargetLayersWith,
  refreshLayersWith,
  serviceDataIsValid,
  tapActionNote,
  tapNeedsEntity,
  tapPointSize,
  attachTap,
  attachedTapsOf,
  clockTime,
  comparisonOperand,
  defaultAttachedTapAction,
  detachTaps,
  removeElement,
  elementEntity,
  formatIsEmpty,
  childGroups,
  groupAncestors,
  groupLayers,
  groupMembers,
  layerEntityUses,
  ungroup,
  setGroup,
  setGroupParent,
  literal,
  defaultCurvedText,
  defaultBezelGauge,
  inlineUsesParts,
  type InlinePart,
  literalPartText,
  inlineRuns,
  syncRichTextFallback,
  textUsesParts,
  ARC_RADIUS_DEFAULT,
  ARC_RADIUS_MAX,
  ARC_RADIUS_MIN,
  ARC_SPACING_MAX,
  ARC_SPACING_MIN,
  ARC_SWEEP_DEFAULT,
  ARC_SWEEP_MAX,
  ARC_SWEEP_MIN,
  clampArcSpacing,
  clampArcSweep,
  familyAllowsArcText,
  CENTERED_FRAME,
  newCase,
  newElement,
  newId,
  newRule,
  newStyleChange,
  newTest,
  setLayerEntity,
  styleChangePayload,
  switchComparison,
  copyShapeLayers,
  isAttachedTap,
  listOwningRowLayer,
  ownedElements,
  ownedShownCount,
  shareValue,
  sharedValueUses,
  unsharedCopy,
  CHART_ANCHOR_POINTS,
  CHART_ANCHOR_PLACES,
  type ChartAnchor,
  type ChartAnchorPlace,
  type ChartAnchorPoint,
  addChartMarker,
  chartMarkersOf,
  convertChartTimes,
  chartTimesOf,
  chartTimesFontDesign,
  type ChartTimesElement,
  addImageTime,
  imageTimeTextsOf,
  imageTimestampLayersOf,
  removeImageTimestamp,
  addChartDots,
  addChartGrid,
  addChartZeroLine,
  chartDotsOf,
  chartGridsOf,
  type ChartDotsElement,
  type ChartGridElement,
  CHART_DEFAULT_GRID_LINES,
  CHART_GRID_LINE_WIDTH,
  CHART_MIN_GRID_THICKNESS,
  CHART_MAX_GRID_THICKNESS,
  chartGridLayerLines,
  chartGridThickness,
  type AggregateScope,
  type AggregateStateFilter,
  type ListElement,
  type ListSource,
  type CalendarLookAheadUnit,
  CALENDAR_LOOK_AHEAD_UNITS,
  calendarHoursFrom,
  calendarLookAhead,
  calendarLookAheadIn,
  calendarLookAheadMax,
  calendarLookAheadShown,
  clampListColumns,
  clampListGap,
  clampListRows,
  listGrid,
  FORECAST_TYPES,
  LIST_DEFAULT_CALENDAR_HOURS,
  LIST_DEFAULT_COLUMNS,
  LIST_DEFAULT_GAP,
  LIST_DEFAULT_ROWS,
  LIST_DIRECTIONS,
  LIST_MAX_COLUMNS,
  LIST_MAX_GAP,
  LIST_MAX_ROWS,
  LIST_MAX_SOURCE_ENTITIES,
  LIST_MAX_TEMPLATE,
  LIST_MIN_COLUMNS,
  LIST_MIN_ROWS,
  LIST_SORTS,
  LIST_SOURCE_KINDS,
  LIST_STATS,
  TIMESTAMP_STYLES,
  timestampHasClock,
  TODO_SORTS,
  TODO_STATUSES,
  chartPointDotSize,
  chartMarkerToIcon,
  addChartLine,
  chartAnchorIsColumn,
  setChartNow,
  setChartThreshold,
  type Fill,
  type FillKind,
  type FillStop,
  type Level,
  type LevelDirection,
  LEVEL_DIRECTIONS,
  LEVEL_DEFAULT_DIRECTION,
  LEVEL_DEFAULT_MIN,
  LEVEL_DEFAULT_MAX,
  defaultLevel,
  type GaugeTicks,
  type GaugeLabels,
  FILL_KINDS,
  FILL_MIN_STOPS,
  FILL_MAX_STOPS,
  fillColorAt,
  defaultGaugeTicks,
  defaultGaugeLabels,
  gaugeTicksAreDefault,
  gaugeLabelsAreDefault,
  GAUGE_DEFAULT_TICK_HEX,
  GAUGE_DEFAULT_TICK_LENGTH,
  GAUGE_MAX_TICKS,
  GAUGE_MAX_TICK_LENGTH,
  GAUGE_DEFAULT_LABEL_HEX,
  GAUGE_DEFAULT_LABEL_SIZE,
  GAUGE_MIN_LABEL_SIZE,
  GAUGE_MAX_LABEL_SIZE,
  PAGES_MAX_COUNT,
  PAGE_DEFAULT_DWELL,
  PAGE_DWELL_RANGE,
  addPageTurnTap,
  pageMoverExists,
  pageNumbers,
  pagesSpecOf,
  setAllPageDwells,
  setPageDwell,
  sharedDwell,
  playTourTapCount,
  tourDuration,
  usesPages,
  writtenDwell,
  type ShapeKind,
} from "./model.js";
import {
  type FreshShape,
  type StatesTable,
  type TableShape,
  COLUMN_ORDER,
  COMPARISON_LABELS,
  DEFAULT_COLUMN,
  PROPERTY_CHANGE_KIND,
  PROPERTY_LABELS,
  addStateRow,
  bandOwners,
  buildStatesRule,
  cellChange,
  comparisonGroups,
  freshShape,
  isNumberish,
  isNumericComparison,
  moveStateRow,
  removeStateRow,
  seedThresholds,
  setOtherwise,
  setTestedValue,
  startStates,
  startText,
  statesEmptyText,
  tableEdges,
  tableShape,
  whenText,
} from "./states.js";
import { seedEntityOf, seedStates, seedStatesRows } from "./states-seeds.js";
import { seedControlFromEntity } from "./presets.js";
import {
  type RulePresetKind,
  RULE_PRESETS,
  WEEKDAY_LABELS,
  rulePresetTests,
  sunRef,
  weekdayNumbers,
  weekdayOptions,
} from "./rule-presets.js";
import { chartNumbers, leadingNumber, listCellFrames, timelineSamples, type ForcedBranches, type TimelineSample } from "./resolver.js";
import { listItemFields } from "./list-seeds.js";
import {
  type RichTextBlocked,
  type RichTextMoved,
  dropPartIds,
  inlineCountdownPart,
  joinTextParts,
  syncInlineParts,
  turnOffRichText,
  turnOnRichText,
} from "./rich-text.js";
import type { HassEntityState, HassLike } from "./ha-api.js";
import { MIN_ZOOM, familyTitle, type IconProvider } from "./renderer.js";
import { IMAGE_UPLOAD_ACCEPT, encodeInlinePicture, formatKiB } from "./inline-image.js";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES, SymbolBrowser, searchSymbols, type SymbolPack } from "./symbols.js";
import { MDI_PREFIX } from "./icons.js";
import { centerFrame, isCentered, typedFrame, type CenterAxis } from "./interact.js";
import {
  DESIGN_BOX,
  CUSTOM_SVG_SYMBOL,
  IMAGE_INLINE_MAX_BYTES,
  type IconElement,
  type ImageSource,
  inlineImageBytes,
  isCustomSvgIcon,
  parseSvgPaste,
  CHART_DEFAULT_BAR_RADIUS,
  CHART_DEFAULT_GRID_HEX,
  CHART_MAX_GRID_LINES,
  CHART_MAX_BAR_BORDER_WIDTH,
  CHART_DEFAULT_BAR_BORDER_HEX,
  chartBarCorners,
  chartBarRadius,
  chartFillStyle,
  chartSmoothing,
  type ChartCurve,
  type ChartDotsMode,
  type ChartFillStyle,
  type ControlKind,
  type ControlSpec,
  CONTROL_ACTION_TYPES,
  controlEffectiveKind,
} from "./model.js";
import { chartSmoothed, chartSeriesWithHoles, resolveControl, type ResolveContext, type ResolvedControl } from "./resolver.js";
import { familyNote, isHomeFamily } from "./layouts.js";
import { type DeviceKind, deviceSupportsControls, watchVersionNote } from "./version.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import {
  CHART_DRAW_EXTRAS, CHART_READINGS, type ChartDrawExtra, type ChartSample, type ExtraKey, type ExtraOwner,
  extraInfo, extraName, extraOwner, extraPreview,
} from "./extra-previews.js";
import { type ChartColorRow, chartColorRows } from "./chart-colors.js";
import { KIND_LABEL, SECTION_COLOR } from "./kinds.js";
import { domainIcon, domainLabel, isActiveState } from "./domain-icons.js";

export interface EditorHost {
  hass: HassLike;
  config: CustomComplicationConfig;
  /** Draws and enumerates SF Symbols for the symbol picker. */
  icons: IconProvider;
  /** Search text, category and recents for the symbol picker. */
  symbols: SymbolBrowser;
  /** Watch-app pages (id + name, watch order) from the watch's last sync
   * report; feeds the "Open a watch app page" tap-action picker. */
  pages: { id: string; name: string }[];
  /** Every complication this watch has on this server, id and name, for the
   * "Refresh multiple complications" tap's picker. Ids are uppercase, the way a document
   * stores its own. Absent in a test host, which the picker reads as empty.
   *
   * `layers` is that complication's own layers, for the per-complication layer
   * boxes inside the picker. It is a thunk because this list is rebuilt on every
   * host build and parsing every document each time would be waste: the layers
   * are only read for a row that is ticked and narrowed.
   *
   * `refreshMinutes` is that complication's timed refresh, 0 when it has none,
   * for the redraw budget hint under the tap. Absent reads as 0. */
  documents?: { id: string; name: string; layers: () => readonly CElement[]; refreshMinutes?: number }[];
  /** The Wrist Assistant version the edited watch last reported, for the
   * "Needs Wrist Assistant X.Y" notes under newer controls. Absent or null when
   * it has not reported, which shows no note. */
  watchAppVersion?: string | null;
  /** Which device the document is edited for. The Control Center mock draws
   * the shapes that device has. Absent in a test host, which draws the watch. */
  deviceKind?: DeviceKind;
  /** Mutate the draft. `coalesce` groups rapid edits of one control into one undo step. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string): void;
  endGesture(): void;
  /** Resolved text for a value, for the "current value" line. */
  resolve(value: Value): string | undefined;
  /** The whole context behind `resolve`, for the one card that settles
   * something bigger than a string: the Control Center tile goes through
   * `resolveControl`, so the mock cannot drift from what the device draws.
   * Absent in a test host, which then draws no tile. */
  resolveContext?(): ResolveContext;
  /** Whether a countdown on this value would tick: a timer, or a future time. */
  canCountDown(value: Value): boolean;
  /** The fetched recorder series for one chart's history query, by
   * `chartHistoryKey`. Undefined while the fetch is still out. */
  historySeries(key: string): string | undefined;
  /** What the latest every-reading fetch for that key reported: how many
   * readings the span held and whether the server averaged them. Undefined
   * for any other fetch, or while it is still out. */
  historyReadings?(key: string): import("./ha-api.js").HistoryReadings | undefined;
  /** Live result of one rule test. */
  evaluateTest(test: import("./model.js").Test): boolean;
  /** Which branch a rule takes live: a case id, "otherwise", or "none". */
  liveBranch(rule: Rule): string;
  forced: ForcedBranches;
  setForced(ruleId: string, branch: { caseId: string } | "otherwise" | "live"): void;
  /** The shape being edited; the Layouts row and the layout tab follow it. */
  activeFamily: FamilyKind;
  setActiveFamily(family: FamilyKind): void;
  /** Give a document that lists Inline but carries no Inline text one. */
  addInlineText(): void;
  /** The complication's name when this edit session opened, for the rename
   * note. Undefined for a brand-new complication (nothing on the watch yet). */
  savedName?: string;
  /** Whether the preview's Show taps view is on. With this layer selected it
   * shows only this layer's tap area, with corners to drag. */
  tapAreaShown: boolean;
  /** Turn that view on or off. */
  showTapArea(on: boolean): void;
  /** The inspector cards that are open, by card id. A new selection starts
   * from `DEFAULT_SECTIONS`. */
  openSections: ReadonlySet<string>;
  /** A card to light for a moment, by id: where the panel has just sent the
   * eye, such as the tap action of a tap zone it made from the Pages card. */
  litSection?: string;
  toggleSection(id: string): void;
  /** The cards whose "?" is on. A card's plain hints are hidden until then;
   * warnings, errors, empty states and hints marked `keep` always show. */
  helpSections: ReadonlySet<string>;
  toggleHelp(id: string): void;
  /** Plays the tour on the canvas, for the button under a Play all pages tap.
   * Absent where there is no canvas to play it on. */
  tour?: { playing: boolean; toggle(): void };
  /** Make a layer the selection, the way a click on its Layers row does. */
  selectLayer(id: string): void;
  /** Draw a layer on the preview as the one selection while the pointer is on
   * its row inside the inspector, without changing the selection. */
  peekLayer(id: string, on: boolean): void;
  /** Open one shared value for editing, in its card under the preview. */
  selectValue(id: string): void;
  /** Hold every update until `endGesture` in one undo step. */
  beginGesture(): void;
  /** The position last copied from a Position card, with the shape it was
   * copied on. Held on the panel, so it pastes onto any layer, on any shape,
   * in any complication opened in this tab. */
  copiedPosition?: CopiedPosition;
  copyPosition(position: CopiedPosition): void;
  /**
   * The list whose row is being designed right now, or undefined for the
   * ordinary face.
   *
   * In that mode the preview draws one cell of that list, scaled up to the
   * whole canvas, so the row's layers are dragged and resized with the same
   * code every other layer uses. It is also what makes the value picker offer
   * Item field and the tap editor offer the item placeholders: those mean
   * nothing outside a row, and offering them everywhere would be offering a
   * value that always draws `--`.
   */
  rowEditListId?: string;
  /** Enter the mode for one list, or leave it with undefined. */
  setRowEdit(listId: string | undefined): void;
}

/** A layer's frame lifted by Copy position, and the shape it sat on. */
export interface CopiedPosition {
  frame: NormalizedFrame;
  family: FamilyKind;
}

/**
 * The frame Paste position gives a layer on `to`. The same shape, or another
 * round one, takes the copied numbers as they are, since a percent of a square
 * face is the same spot on any square face. Between the wide face and a round
 * one it is scaled around the middle, the way copying a whole layout is, so a
 * centred layer stays centred.
 */
export function pastedFrame(copied: CopiedPosition, to: FamilyKind, kind: CElement["kind"]): NormalizedFrame {
  const fitted = refitPlacement({ frame: { ...copied.frame }, isHidden: false }, copied.family, to, kind).frame;
  return typedFrame(fitted, {});
}

/** Every card id the inspector can show, for "Open all". */
export const ALL_SECTIONS = ["content", "look", "numbers", "row", "level", "timestamp", "tappable", "states", "placement", "corner", "home", "placements", "shape", "symbol"] as const;

/**
 * The cards Collapse all leaves open: what a layer shows and how it looks.
 * A picture's Look card is its Picture card, and a shape's own card is its
 * Look, so the same two ids serve every selection. Every other card folds to
 * its one-line summary in the header.
 */
export const DEFAULT_SECTIONS: readonly string[] = ["content", "look"];

/** The open set a new selection starts from: every card, so nothing is hidden
 * until the reader folds it. */
export function defaultOpenSections(): Set<string> {
  return new Set(ALL_SECTIONS);
}

/** The open set Collapse all goes back to. */
export function collapsedSections(): Set<string> {
  return new Set(DEFAULT_SECTIONS);
}

/** Whether any card beyond Content and Look is open, which is when the
 * inspector's header offers Collapse all rather than Open all. An id with a
 * colon is not a card (an old More line's entry) and does not count. */
export function moreThanDefaultOpen(open: ReadonlySet<string>): boolean {
  return [...open].some((id) => !id.includes(":") && !DEFAULT_SECTIONS.includes(id));
}

// ── small controls ────────────────────────────────────────────────────────

function onInput(handler: (v: string) => void) {
  return (e: Event) => handler((e.target as HTMLInputElement).value);
}

/** The one line under a control whose setting the edited watch is too old to
 * draw: "Needs Wrist Assistant X.Y or later on your watch." Nothing when the
 * minimum is not set yet, the watch is new enough, or its version is unknown.
 * The control still works either way. Defaults to the chart looks minimum;
 * a later control with its own release passes that one. */
function watchNote(host: EditorHost, minimum?: string | null) {
  const note = minimum === undefined
    ? watchVersionNote(host.watchAppVersion)
    : watchVersionNote(host.watchAppVersion, minimum);
  return note === undefined ? nothing : html`<div class="hint keep">${note}</div>`;
}

/**
 * What a setting needs to offer a way back: whether it is already at the
 * default, what to call that default, and how to return to it. Field helpers
 * build one from their `def` option with `backTo`.
 */
interface ResetTo {
  atDefault: boolean;
  title: string;
  reset: () => void;
}

/**
 * The one reset control every setting shares: a small accent dot in the
 * gutter at the left of the setting's row. It is drawn only while the value is
 * away from its default, so the dots down an open card are the list of what
 * someone changed, and a card with none is a card at its defaults. The dot is
 * placed by CSS, so nothing in the row shifts when it appears.
 */
function resetButton(back: ResetTo | undefined) {
  if (back === undefined || back.atDefault) return nothing;
  const label = `Changed. Click to reset. ${back.title.replace(/\.$/, "")}.`;
  return html`<button type="button" class="reset-dot" title=${label} aria-label=${label}
    @pointerdown=${(e: Event) => e.stopPropagation()}
    @click=${(e: Event) => { e.preventDefault(); e.stopPropagation(); back.reset(); }}></button>`;
}

/** A setting's title, with its reset dot when there is something to reset. A
 * changed title reads in ink rather than muted. `scrub` makes the title a drag
 * handle for a number (see `scrubber`). */
function fieldLabel(label: string, back?: ResetTo, scrub?: (e: PointerEvent) => void) {
  const btn = resetButton(back);
  const cls = [btn === nothing ? "" : "changed", scrub ? "scrub" : ""].filter((c) => c !== "").join(" ");
  return html`<span class=${cls === "" ? nothing : cls} title=${scrub ? "Drag left or right to change" : nothing}
    @pointerdown=${scrub ?? nothing}>${label}${btn}</span>`;
}

/** Sent by a number field's title as a drag starts and ends, so the panel can
 * hold the whole drag as one undo step however many edits it makes. */
export const SCRUB_START = "wa-scrub-start";
export const SCRUB_END = "wa-scrub-end";

/** How far a press has to travel sideways before it is a drag, in px. */
const SCRUB_SLOP = 3;
/** Pointer travel per step while dragging a number, in px. */
const SCRUB_PX_PER_STEP = 3;

interface ScrubRange {
  step?: number;
  min?: number;
  max?: number;
}

/** Where a dragged number starts: its value, or the bottom of its range (and
 * never below 0) for a box still empty. */
export function scrubStart(value: number | undefined, opts: ScrubRange): number {
  return value !== undefined && Number.isFinite(value) ? value : Math.max(0, opts.min ?? 0);
}

/** One step of a dragged number. The field's own step when it has one;
 * otherwise as fine as the number's own decimals (1 for a whole number, 0.1
 * or 0.01 for one written with decimals), so a drag never rounds away what
 * was typed. Shift makes it ten times coarser, Alt ten times finer. */
export function scrubUnit(start: number, step: number | undefined, mods: { coarse?: boolean; fine?: boolean } = {}): number {
  const base = step !== undefined && step > 0 ? step : 10 ** -Math.min(2, decimalsOf(start));
  return mods.coarse ? base * 10 : mods.fine ? base / 10 : base;
}

/** The number a drag lands on: `raw`, the unrounded running total, snapped to
 * whole units counted from `start` (so 23.47 stepped by 1 goes to 24.47, not
 * 24), clamped to the range and cleared of float dust. */
export function scrubValue(start: number, raw: number, unit: number, opts: ScrubRange): number {
  let v = start + Math.round((raw - start) / unit) * unit;
  if (opts.min !== undefined) v = Math.max(opts.min, v);
  if (opts.max !== undefined) v = Math.min(opts.max, v);
  return Number(v.toFixed(Math.min(10, Math.max(decimalsOf(unit), decimalsOf(start)))));
}

function decimalsOf(n: number): number {
  if (!Number.isFinite(n) || Number.isInteger(n)) return 0;
  const s = String(n);
  const exp = /e-(\d+)$/.exec(s);
  if (exp) return Number(exp[1]) + ((s.split("e")[0]!.split(".")[1] ?? "").length);
  return (s.split(".")[1] ?? "").length;
}

/**
 * Follows one press on a number's drag handle: nothing until it has moved
 * `SCRUB_SLOP` sideways, then a step every `SCRUB_PX_PER_STEP`, with Shift and
 * Alt read on every move so a modifier can change mid-drag without the number
 * jumping. The drag is sent as `SCRUB_START` and `SCRUB_END`, so the panel
 * keeps all of it as one undo step. `release` hears how the press ended.
 */
function trackScrub(handle: HTMLElement, e: PointerEvent, value: number | undefined, set: (v: number) => void,
  opts: ScrubRange, release: (dragged: boolean, ev: PointerEvent) => void) {
  const start = scrubStart(value, opts);
  const x0 = e.clientX;
  let lastX = x0;
  let raw = start;
  let last = start;
  let dragging = false;
  const move = (ev: PointerEvent) => {
    if (!dragging) {
      if (Math.abs(ev.clientX - x0) < SCRUB_SLOP) return;
      dragging = true;
      lastX = ev.clientX;
      handle.classList.add("scrubbing");
      handle.dispatchEvent(new CustomEvent(SCRUB_START, { bubbles: true, composed: true }));
    }
    const unit = scrubUnit(start, opts.step, { coarse: ev.shiftKey, fine: ev.altKey });
    raw += ((ev.clientX - lastX) / SCRUB_PX_PER_STEP) * unit;
    lastX = ev.clientX;
    // Held to the range, so turning back past an end answers at once.
    if (opts.min !== undefined) raw = Math.max(opts.min, raw);
    if (opts.max !== undefined) raw = Math.min(opts.max, raw);
    const v = scrubValue(start, raw, unit, opts);
    if (v !== last) { last = v; set(v); }
  };
  const end = (ev: PointerEvent) => {
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", end);
    handle.removeEventListener("pointercancel", end);
    if (dragging) {
      handle.classList.remove("scrubbing");
      handle.dispatchEvent(new CustomEvent(SCRUB_END, { bubbles: true, composed: true }));
      // A drag is not a click: without this a label would pass the release on
      // to its box and focus it.
      const swallow = (c: Event) => { c.preventDefault(); c.stopPropagation(); };
      handle.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => handle.removeEventListener("click", swallow, { capture: true }), 0);
    }
    release(dragging, ev);
  };
  handle.setPointerCapture(e.pointerId);
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
}

/**
 * Drag a number's title left or right to change it (see `trackScrub`). A press
 * that never moves is left to the label, which focuses the box as it always
 * did.
 */
function scrubber(value: number | undefined, set: (v: number) => void, opts: ScrubRange) {
  return (e: PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary) return;
    const handle = e.currentTarget as HTMLElement;
    if (handle.closest(".field")?.querySelector<HTMLInputElement>("input[type=number]")?.disabled) return;
    // Keeps the press from selecting the title's text. The click after a press
    // that did not move still reaches the label and focuses the box.
    e.preventDefault();
    trackScrub(handle, e, value, set, opts, () => {});
  };
}

/**
 * The same drag on the number box itself, the way a design tool's number
 * fields work. Only while the box is not being typed in: a focused box keeps
 * its caret, selection and text drag. On an idle box the press is held back
 * from the browser, so moving it selects nothing and focuses nothing; a press
 * that never moved then focuses the box with its number selected, ready to be
 * typed over, and a drag leaves the box unfocused. The box wants `data-scrub`,
 * which gives it the ew-resize cursor while idle and keeps a sideways touch
 * from scrolling the card.
 */
function boxScrubber(value: number | undefined, set: (v: number) => void, opts: ScrubRange) {
  return (e: PointerEvent) => {
    const box = e.currentTarget as HTMLInputElement;
    if (e.button !== 0 || !e.isPrimary || box.disabled || box.matches(":focus")) return;
    e.preventDefault();
    trackScrub(box, e, value, set, opts, (dragged, ev) => {
      if (dragged || ev.type !== "pointerup") return;
      box.focus();
      box.select();
    });
  };
}

/** The reset a field with a plain default offers. `def` left undefined means
 * the setting has no default worth naming, and no button is drawn. `show`
 * names the default in the button's tooltip. */
function backTo<T>(value: T, def: T | undefined, set: (v: T) => void, show: (v: T) => string = (v) => String(v)): ResetTo | undefined {
  if (def === undefined) return undefined;
  const d = def;
  return { atDefault: value === d, title: `Back to ${show(d)}`, reset: () => set(d) };
}

export function textField(label: string, value: string, set: (v: string) => void, opts: { placeholder?: string; list?: string; mono?: boolean; def?: string } = {}) {
  return html`<label class="field">${fieldLabel(label, backTo(value, opts.def, set, (v) => (v === "" ? "empty" : v)))}
    <input type="text" .value=${value} placeholder=${opts.placeholder ?? ""} list=${opts.list ?? nothing}
      class=${opts.mono ? "mono" : ""} @input=${onInput(set)} /></label>`;
}

export function textArea(label: string, value: string, set: (v: string) => void, rows = 3) {
  return html`<label class="field"><span>${label}</span>
    <textarea rows=${rows} .value=${value} class="mono" @input=${onInput(set)}></textarea></label>`;
}

/** `def` adds a reset dot, drawn only while the value is away from that
 * default; `null` is the default of an optional number left empty. The title
 * and the box both drag the number. */
export function numberField(label: string, value: number | undefined, set: (v: number | undefined) => void, opts: NumberInputOptions & { def?: number | null } = {}) {
  const back: ResetTo | undefined = opts.def === null
    ? { atDefault: value === undefined, title: "Back to none", reset: () => set(undefined) }
    : backTo<number | undefined>(value, opts.def, set);
  return html`<label class="field num">${fieldLabel(label, back, scrubber(value, set, opts))}${numberInput(value, set, opts)}</label>`;
}

interface NumberInputOptions {
  step?: number;
  min?: number;
  max?: number;
  optional?: boolean;
  ariaLabel?: string;
  /** A short unit drawn faint inside the box after the number, such as "pt",
   * "%" or "°", so the title does not have to carry it. */
  unit?: string;
  /** Faint text while the box is empty. */
  placeholder?: string;
  /** A small glyph inside the box before the number, such as the link that
   * says a part's size still follows the layer. */
  lead?: TemplateResult;
}

/** The input half of `numberField`, for a field that draws its own title line. */
function numberInput(value: number | undefined, set: (v: number | undefined) => void, opts: NumberInputOptions) {
  const shown = value === undefined || Number.isNaN(value) ? "" : String(value);
  const input = html`<input type="number" .value=${shown} step=${opts.step ?? "any"} min=${opts.min ?? nothing} max=${opts.max ?? nothing}
      aria-label=${opts.ariaLabel ?? nothing} placeholder=${opts.placeholder ?? nothing}
      data-scrub @pointerdown=${boxScrubber(value, set, opts)}
      @input=${onInput((v) => {
        if (v.trim() === "") {
          if (opts.optional) set(undefined);
          return;
        }
        const n = Number(v);
        if (!Number.isNaN(n)) set(n);
      })} />`;
  if (opts.unit === undefined && opts.lead === undefined) return input;
  return html`<span class=${opts.lead === undefined ? "num-box" : "num-box lead"} style=${`--wa-unit:${opts.unit?.length ?? 0}`}>${opts.lead === undefined
    ? nothing
    : html`<span class="lead" aria-hidden="true">${opts.lead}</span>`}${input}${opts.unit === undefined
    ? nothing
    : html`<span class="unit" aria-hidden="true">${opts.unit}</span>`}</span>`;
}

export function selectField<T extends string>(label: string, value: T, options: [T, string][], set: (v: T) => void, opts: { def?: T } = {}) {
  const name = (v: T) => options.find(([o]) => o === v)?.[1] ?? v;
  return html`<label class="field">${fieldLabel(label, backTo(value, opts.def, set, name))}
    <select @change=${onInput((v) => set(v as T))}>
      ${options.map(([v, text]) => html`<option value=${v} ?selected=${v === value}>${text}</option>`)}
    </select></label>`;
}

/** A select whose options sit under headings, for a list long enough that a
 * flat one reads as a wall. An empty group is left out. */
export function groupedSelectField<T extends string>(label: string, value: T, groups: { label: string; options: [T, string][] }[], set: (v: T) => void) {
  return html`<label class="field"><span>${label}</span>
    <select @change=${onInput((v) => set(v as T))}>
      ${groups.filter((g) => g.options.length > 0).map((g) => html`<optgroup label=${g.label}>
        ${g.options.map(([v, text]) => html`<option value=${v} ?selected=${v === value}>${text}</option>`)}
      </optgroup>`)}
    </select></label>`;
}

/**
 * A choice of two to four, drawn as a row of buttons with the current one
 * lit. Every option is on screen at once, so the reader knows what the setting
 * can be without opening anything. Lists longer than four, or lists that
 * change length, stay a `selectField`: a row of seven buttons is a menu that
 * forgot to fold.
 */
export function segField<T extends string>(label: string, value: T, options: [T, string][], set: (v: T, node: EventTarget | null) => void, opts: { titles?: Partial<Record<T, string>>; def?: T; disabled?: Partial<Record<T, boolean>> } = {}) {
  const name = (v: T) => options.find(([o]) => o === v)?.[1] ?? v;
  return html`<div class="field seg-field">${fieldLabel(label, backTo(value, opts.def, (v) => set(v, null), name))}
    ${segButtons(label, value, options, set, opts)}</div>`;
}

/** The row of buttons of a `segField`, without its title. `set` also gets the
 * button pressed, for a choice that may ask before it changes anything. With
 * no value picked, `inherited` is the choice the setting falls back to: it is
 * drawn with a dashed outline, and pressing it sets it for real. */
function segButtons<T extends string>(label: string, value: T | undefined, options: [T, string][], set: (v: T, node: EventTarget | null) => void, opts: { titles?: Partial<Record<T, string>>; disabled?: Partial<Record<T, boolean>>; inherited?: T } = {}) {
  return html`<div class="seg wide" role="radiogroup" aria-label=${label}>
      ${options.map(([v, text]) => {
        const inherited = value === undefined && v === opts.inherited;
        const title = inherited ? `${opts.titles?.[v] ?? text} (from the layer)` : opts.titles?.[v];
        return html`<button type="button" role="radio" aria-checked=${v === value ? "true" : "false"}
        class=${v === value ? "on" : inherited ? "inh" : ""} title=${title ?? nothing} ?disabled=${opts.disabled?.[v] === true}
        @click=${(e: Event) => { if (v !== value) set(v, e.currentTarget); }}>${text}</button>`;
      })}
    </div>`;
}

/** One of the two choices a `segPairField` puts on a row. */
interface SegChoice<T extends string> {
  label: string;
  value: T;
  options: [T, string][];
  set: (v: T) => void;
  def?: T;
  titles?: Partial<Record<T, string>>;
}

/** Two short choices on one row, the second titled in line: for a pair whose
 * controls are only a few buttons each, such as Align and Lines. Each keeps
 * its own reset dot. */
function segPairField<A extends string, B extends string>(a: SegChoice<A>, b: SegChoice<B>) {
  const back = <T extends string>(c: SegChoice<T>) =>
    backTo(c.value, c.def, c.set, (v) => c.options.find(([o]) => o === v)?.[1] ?? v);
  return html`<div class="field seg-field pair">${fieldLabel(a.label, back(a))}
    <div class="pair-row">
      ${segButtons(a.label, a.value, a.options, a.set, a)}
      ${fieldLabel(b.label, back(b))}
      ${segButtons(b.label, b.value, b.options, b.set, b)}
    </div></div>`;
}

/**
 * One reset dot for a row that holds two settings, such as a color and its
 * One color / By value choice. It shows while either is away from its default
 * and puts back only the ones that are. Undefined when neither setting has a
 * default to go back to.
 */
function bothBack(...backs: (ResetTo | undefined)[]): ResetTo | undefined {
  const known = backs.filter((b): b is ResetTo => b !== undefined);
  if (known.length === 0) return undefined;
  const away = known.filter((b) => !b.atDefault);
  const what = away.map((b) => b.title.replace(/^Back to /, "").replace(/\.$/, ""));
  return {
    atDefault: away.length === 0,
    title: `Back to ${what.join(" and ")}`,
    reset: () => { for (const b of away) b.reset(); },
  };
}

/**
 * A layer's color and how it is chosen, on one row: the swatch and hex on the
 * left, the One color / By value choice on the right. They are one question
 * ("what color is this"), so two rows made the answer look like two settings.
 */
function colorModeField<T extends string>(
  label: string,
  value: string | undefined,
  set: (v: string | undefined) => void,
  def: string,
  mode: SegChoice<T>,
): TemplateResult {
  const colorBack: ResetTo = { atDefault: sameColor(value, def), title: `Back to ${def}`, reset: () => set(def) };
  const modeBack = backTo(mode.value, mode.def, mode.set, (v) => (mode.options.find(([o]) => o === v)?.[1] ?? v).toLowerCase());
  return html`<div class="field color color-mode">${fieldLabel(label, bothBack(colorBack, modeBack))}
    <div class="color-mode-row">
      <div class="color-row">${colorBox(label, value, set)}</div>
      ${segButtons(mode.label, mode.value, mode.options, mode.set, mode)}
    </div></div>`;
}

/**
 * A bounded number found by eye rather than typed: the number box with its
 * unit, a title that drags it, and a slim slider in front where the slider is
 * the quicker control (a turn, a crop). `range: false` leaves the slider out.
 * A typed number outside the range is ignored rather than clamped, so typing
 * 12 can pass through 1 without the box jumping.
 */
export function sliderField(
  label: string,
  value: number,
  set: (v: number) => void,
  opts: { min: number; max: number; step: number; def: number; format?: (v: number) => string; unit?: string; range?: boolean },
) {
  const show = opts.format ?? ((v: number) => String(Math.round(v * 100) / 100));
  const typed = (n: number | undefined) => { if (n !== undefined && n >= opts.min && n <= opts.max) set(n); };
  return html`<div class="field slider num">${fieldLabel(label, backTo(value, opts.def, set, show), scrubber(value, set, opts))}
    <div class="slider-row">
      ${opts.range === false ? nothing : html`<input type="range" min=${opts.min} max=${opts.max} step=${opts.step} .value=${String(value)} aria-label=${label}
        @input=${onInput((v) => { const n = Number(v); if (!Number.isNaN(n)) set(n); })} />`}
      ${numberInput(value, typed, { step: opts.step, min: opts.min, max: opts.max, ariaLabel: label, ...(opts.unit === undefined ? {} : { unit: opts.unit }) })}
    </div></div>`;
}

/** A switch as a row like any other: its title in the label column, the switch
 * in the control column. `def` adds a reset beside the title, drawn only while
 * the box is away from it. The button sits inside the `<label>`, so its click
 * is stopped there or the label would forward it to the checkbox and toggle it
 * back. `disabled` greys the switch out, for a setting another setting rules
 * out. */
export function checkField(label: string, value: boolean, set: (v: boolean) => void, def?: boolean, opts: { disabled?: boolean } = {}) {
  return html`<label class="field check">${fieldLabel(label, backTo(value, def, set, (v) => (v ? "on" : "off")))}<input type="checkbox" .checked=${value} ?disabled=${opts.disabled === true} @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /></label>`;
}

/** `#RRGGBB` or `#RRGGBBAA`, as one row: a swatch that opens the system picker,
 * the hex, and the opacity in percent. The hex box takes eight digits too, so
 * alpha can be typed either way. `def` adds a reset dot back to that color
 * (or, for an optional color, `null` clears it). */
export function colorField(label: string, value: string | undefined, set: (v: string | undefined) => void, optional = false, def?: string | null) {
  const { rgb, alpha } = colorParts(value);
  const back: ResetTo | undefined = def === undefined ? undefined : {
    atDefault: sameColor(value, def ?? undefined),
    title: def === null ? "Back to none" : `Back to ${def}`,
    reset: () => set(def ?? undefined),
  };
  const off = optional && value === undefined;
  return html`<div class="field color">${fieldLabel(label, back)}
    <div class="color-row">
      ${optional ? html`<input type="checkbox" title="Enabled" aria-label=${`${label} on`} .checked=${value !== undefined} @change=${(e: Event) => set((e.target as HTMLInputElement).checked ? composeColor(rgb, alpha) : undefined)} />` : nothing}
      ${colorBox(label, value, set, off)}
    </div></div>`;
}

/** The CSS a gradient's preview bar paints itself with, so the bar shows the
 * same thing the drawing does. Radial reads as a soft centre rather than as the
 * circle it draws, which is enough to tell the two apart at bar size. */
function fillPreviewCss(fill: Fill): string {
  const stops = [...fill.stops].sort((a, b) => a.at - b.at)
    .map((s) => `${s.colorHex} ${Math.round(Math.max(0, Math.min(1, s.at)) * 100)}%`).join(", ");
  return fill.kind === "radial"
    ? `radial-gradient(circle at 50% 50%, ${stops})`
    : `linear-gradient(90deg, ${stops})`;
}

/** A gradient with its stops in reading order and no two on top of each other,
 * which is what every control below edits and what the renderer draws. */
function sortedFill(fill: Fill): Fill {
  return { ...fill, stops: [...fill.stops].sort((a, b) => a.at - b.at) };
}

/**
 * The gradient row: a switch, the bar with one draggable chip per stop, the
 * kind, the angle, and each stop's own color.
 *
 * `seed` is what the gradient starts from when it is switched on, which is
 * always the flat color the layer already draws: switching it on should change
 * nothing until a stop is moved. `set` is handed the whole gradient, or
 * `undefined` when it is switched off; the caller keeps the flat color beside
 * it written as the first stop, so an older watch app draws that instead.
 */
export function fillField(
  label: string,
  value: Fill | undefined,
  set: (v: Fill | undefined) => void,
  seed: () => Fill,
): TemplateResult {
  const on = value !== undefined;
  const fill = value;
  const row = html`<div class="field color">${fieldLabel(label, {
      atDefault: !on, title: "Back to one flat color", reset: () => set(undefined),
    })}
    <div class="color-row">
      <input type="checkbox" title="Enabled" aria-label=${`${label} on`} .checked=${on}
        @change=${(e: Event) => set((e.target as HTMLInputElement).checked ? sortedFill(seed()) : undefined)} />
      ${fill === undefined
        ? html`<span class="hint">One flat color</span>`
        : html`<span class="fill-bar" style=${`--g:${fillPreviewCss(fill)}`} title="Drag a chip to move that color">
            ${fill.stops.map((s, i) => html`<span class="fill-chip" style=${`left:${Math.round(Math.max(0, Math.min(1, s.at)) * 100)}%;--sw:${s.colorHex}`}
              @pointerdown=${fillChipDrag(fill, i, set)}></span>`)}
          </span>`}
    </div></div>`;
  if (fill === undefined) return row;
  const stops = fill.stops;
  const withStops = (next: FillStop[]) => set(sortedFill({ ...fill, stops: next }));
  return html`${row}
    <div class="grid2">
      ${segField("Gradient", fill.kind, FILL_KINDS as [FillKind, string][], (v) => {
        const next: Fill = { ...fill, kind: v };
        // A radial fill has no direction, so its angle leaves the wire with it.
        if (v === "radial") delete next.angle;
        set(sortedFill(next));
      }, { def: "linear" })}
      ${fill.kind === "linear"
        ? numberField("Angle", fill.angle ?? 0, (v) => {
            const next: Fill = { ...fill };
            const a = v ?? 0;
            if (a === 0) delete next.angle; else next.angle = a;
            set(sortedFill(next));
          }, { step: 5, def: 0, unit: "°" })
        : nothing}
    </div>
    ${stops.map((s, i) => html`<div class="field color band-row">
      <span class="fill-stop-n">${i + 1}</span>
      <div class="color-row">
        ${colorBox(`Stop ${i + 1}`, s.colorHex, (v) => withStops(stops.map((x, j) => (j === i ? { ...x, colorHex: v ?? "#FFFFFF" } : x))))}
        ${numberInput(Math.round(s.at * 100), (v) => withStops(stops.map((x, j) => (j === i ? { ...x, at: Math.max(0, Math.min(1, (v ?? 0) / 100)) } : x))),
          { step: 1, min: 0, max: 100, unit: "%", ariaLabel: `Stop ${i + 1} position` })}
        <button class="small" title="Remove this color" ?disabled=${stops.length <= FILL_MIN_STOPS}
          @click=${() => withStops(stops.filter((_, j) => j !== i))}>−</button>
      </div></div>`)}
    ${stops.length < FILL_MAX_STOPS
      ? html`<button class="small" @click=${() => {
          // A new stop lands halfway along the widest gap and takes the color
          // already showing there, so adding one changes nothing on its own.
          const sorted = [...stops].sort((a, b) => a.at - b.at);
          let at = 0.5;
          let widest = -1;
          for (let i = 1; i < sorted.length; i++) {
            const gap = sorted[i]!.at - sorted[i - 1]!.at;
            if (gap > widest) { widest = gap; at = (sorted[i]!.at + sorted[i - 1]!.at) / 2; }
          }
          withStops([...stops, { at, colorHex: fillColorAt(fill, at) }]);
        }}>Add a color</button>`
      : html`<div class="hint">A gradient takes at most ${FILL_MAX_STOPS} colors.</div>`}`;
}

/** Dragging one chip along the bar: the pointer's place across the bar is the
 * stop's new position. Pointer capture keeps the drag alive past the bar's
 * edges, the way every other drag in the panel does. */
function fillChipDrag(fill: Fill, index: number, set: (v: Fill) => void) {
  return (e: PointerEvent) => {
    const chip = e.currentTarget as HTMLElement;
    const bar = chip.parentElement;
    if (!bar) return;
    e.preventDefault();
    chip.setPointerCapture(e.pointerId);
    let latest = fill;
    const move = (ev: PointerEvent) => {
      const box = bar.getBoundingClientRect();
      if (box.width <= 0) return;
      const at = Math.max(0, Math.min(1, (ev.clientX - box.left) / box.width));
      latest = { ...fill, stops: fill.stops.map((s, j) => (j === index ? { ...s, at } : s)) };
      set(latest);
    };
    const up = () => {
      chip.removeEventListener("pointermove", move);
      chip.removeEventListener("pointerup", up);
      chip.removeEventListener("pointercancel", up);
      // Sorted only when the drag ends, so a chip dragged past its neighbour
      // does not swap rows under the pointer mid-drag.
      set(sortedFill(latest));
    };
    chip.addEventListener("pointermove", move);
    chip.addEventListener("pointerup", up);
    chip.addEventListener("pointercancel", up);
  };
}

/** A stored color as its controls show it: the swatch, the six digits the
 * system picker takes, and the opacity in percent. */
function colorParts(value: string | undefined): { valid: boolean; swatch: string; rgb: string; alpha: number } {
  const h = (value ?? "").replace(/^#/, "");
  const valid = /^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h);
  return {
    valid,
    swatch: valid ? `#${h}` : "transparent",
    rgb: valid ? `#${h.slice(0, 6)}` : "#ffffff",
    alpha: valid && h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 100) : 100,
  };
}

/** Six hex digits and an opacity in percent, back as `#RRGGBB` or `#RRGGBBAA`. */
function composeColor(rgbHex: string, alpha: number): string {
  const base = rgbHex.replace(/^#/, "").toUpperCase();
  return alpha >= 100 ? `#${base}` : `#${base}${Math.round((alpha / 100) * 255).toString(16).padStart(2, "0").toUpperCase()}`;
}

/** The box of a `colorField` without its title: swatch, hex and opacity. For
 * a row that names its color some other way, such as a band table's. */
function colorBox(label: string, value: string | undefined, set: (v: string | undefined) => void, off = false, placeholder = "#RRGGBB"): TemplateResult {
  const { valid, swatch, rgb, alpha } = colorParts(value);
  return html`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${off || !valid ? "transparent" : swatch}`} title="Pick a color">
        <input type="color" .value=${rgb} ?disabled=${off} aria-label=${`${label}: pick a color`} @input=${onInput((v) => set(composeColor(v, alpha)))} />
      </span>
      <input type="text" class="mono hex" .value=${value ?? ""} placeholder=${placeholder} spellcheck="false" aria-label=${`${label}: hex`} ?disabled=${off}
        @input=${onInput((v) => { const t = v.trim(); if (/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t)) set(t.startsWith("#") ? t.toUpperCase() : `#${t.toUpperCase()}`); })} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(alpha)} title="Opacity" aria-label=${`${label}: opacity`} ?disabled=${off}
          data-scrub @pointerdown=${boxScrubber(alpha, (n) => set(composeColor(rgb, n)), { step: 1, min: 0, max: 100 })}
          @input=${onInput((v) => { const n = Number(v); if (v.trim() !== "" && n >= 0 && n <= 100) set(composeColor(rgb, Math.round(n))); })} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`;
}

/** A color that may be left empty, where empty means another color stands in
 * (named by `empty`, shown in the hex box). Picking a color sets one; the
 * reset dot clears it again. */
function fallbackColorField(label: string, value: string | undefined, empty: string, set: (v: string | undefined) => void) {
  const back: ResetTo = { atDefault: value === undefined, title: `Back to ${empty.toLowerCase()}`, reset: () => set(undefined) };
  return html`<div class="field color">${fieldLabel(label, back)}
    <div class="color-row">${colorBox(label, value, set, false, empty)}</div></div>`;
}

/** One of a chart's own color rows, as `chartColorRows` names it, with its
 * line of what it does under it. A warning always shows; a plain note waits for
 * the card's help. */
function chartColorField(row: ChartColorRow, value: string | undefined, set: (v: string | undefined) => void): TemplateResult {
  return html`${fallbackColorField(row.label, value, row.empty, set)}${row.note === undefined
    ? nothing
    : html`<div class=${row.warn ? "hint warn" : "hint"}>${row.note}</div>`}`;
}

function sameColor(a: string | undefined, b: string | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return a.replace(/^#/, "").toUpperCase() === b.replace(/^#/, "").toUpperCase();
}

// ── entity helpers ────────────────────────────────────────────────────────

export function entityRefFrom(states: Record<string, HassEntityState>, entityId: string): EntityRef {
  const s = states[entityId];
  const friendly = s && typeof s.attributes.friendly_name === "string" ? s.attributes.friendly_name : entityId;
  return { entityId, displayName: friendly, domain: entityId.split(".")[0] ?? "" };
}

export function entityRefFor(hass: HassLike, entityId: string): EntityRef {
  return entityRefFrom(hass.states, entityId);
}

// ── entity search ─────────────────────────────────────────────────────────

/** One row of the entity search list: what the user reads, plus what gets
 * stored when they pick it. */
export interface EntityChoice {
  entityId: string;
  /** friendly_name when Home Assistant has one, else the id. */
  name: string;
  state: string;
  domain: string;
  /** The room, when the frontend told us one. Shown beside the id and matched
   * by the search, because "kitchen" is how a room is usually looked for. */
  area?: string;
}

/** Everything the search can offer, name first. `domain` restricts the pool to
 * one domain or a list of them (a camera layer only wants `camera.*`, a toggle
 * button wants everything a toggle makes sense for); a name typed by hand is
 * still accepted whatever the restriction. */
export function entityChoices(
  states: Record<string, HassEntityState>,
  domain?: string | readonly string[],
  areaOf?: (entityId: string) => string | undefined,
): EntityChoice[] {
  const allowed = domain === undefined ? undefined : typeof domain === "string" ? [domain] : domain;
  const out: EntityChoice[] = [];
  for (const [entityId, s] of Object.entries(states)) {
    const dom = entityId.split(".")[0] ?? "";
    if (allowed !== undefined && !allowed.includes(dom)) continue;
    const friendly = typeof s?.attributes?.friendly_name === "string" ? s.attributes.friendly_name.trim() : "";
    const area = areaOf?.(entityId);
    out.push({ entityId, name: friendly || entityId, state: s?.state ?? "", domain: dom, ...(area ? { area } : {}) });
  }
  out.sort((a, b) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId));
  return out;
}

/**
 * Where each entity lives, read from the registry snapshots the Home Assistant
 * frontend already keeps on `hass`. An entity's own area wins; otherwise it
 * inherits the area of the device it belongs to, which is how Home Assistant
 * itself resolves it.
 *
 * Returns undefined when the frontend has no registries to read, so the search
 * simply shows no rooms rather than failing.
 */
export function areaLookup(hass: HassLike): ((entityId: string) => string | undefined) | undefined {
  const { entities, devices, areas } = hass;
  if (!entities || !areas) return undefined;
  const nameOf = (id: string | null | undefined): string | undefined => {
    if (!id) return undefined;
    const n = areas[id]?.name;
    return typeof n === "string" && n.trim() !== "" ? n.trim() : undefined;
  };
  return (entityId) => {
    const reg = entities[entityId];
    if (!reg) return undefined;
    return nameOf(reg.area_id) ?? nameOf(reg.device_id ? devices?.[reg.device_id]?.area_id : undefined);
  };
}

export const ENTITY_RESULT_LIMIT = 50;

/** Whether an entity's state reads as a number, which is all a gauge can draw.
 * Used to float the plausible answers to the top of the gauge preset's search
 * rather than to hide anything: a template sensor's state can be anything. */
export function looksNumeric(c: EntityChoice): boolean {
  const head = c.state.trim().split(/\s+/)[0] ?? "";
  return head !== "" && Number.isFinite(Number(head));
}

/**
 * Rank the pool against what has been typed, over both the friendly name and
 * the id, because a user knows one or the other and rarely both.
 *
 * The order is: the exact id, then anything starting with the text (id before
 * name, since a typed id is usually meant literally), then anything containing
 * it, and last a multi word search where every word appears somewhere. Ties
 * keep the pool's own alphabetical order.
 *
 * `boost` is a second, weaker key: entities it likes come first among equally
 * good matches. It never removes anything, so a field can prefer numbers
 * without pretending the others do not exist.
 */
export function searchEntities(
  choices: readonly EntityChoice[],
  query: string,
  limit = ENTITY_RESULT_LIMIT,
  boost?: (c: EntityChoice) => boolean,
): EntityChoice[] {
  const q = query.trim().toLowerCase();
  const rate = (c: EntityChoice) => (boost === undefined || boost(c) ? 0 : 1);
  // Sort is stable, so the pool's alphabetical order survives inside each group.
  if (q === "") return (boost === undefined ? choices.slice() : [...choices].sort((a, b) => rate(a) - rate(b))).slice(0, limit);
  const words = q.split(/\s+/);
  const scored: { c: EntityChoice; rank: number }[] = [];
  for (const c of choices) {
    const id = c.entityId.toLowerCase();
    const name = c.name.toLowerCase();
    const area = (c.area ?? "").toLowerCase();
    let rank = -1;
    if (id === q) rank = 0;
    else if (id.startsWith(q)) rank = 1;
    else if (name.startsWith(q)) rank = 2;
    else if (id.includes(q)) rank = 3;
    else if (name.includes(q)) rank = 4;
    else if (words.length > 1 && words.every((w) => id.includes(w) || name.includes(w))) rank = 5;
    // The room is the weakest key on purpose: "kitchen" should find the light
    // called Kitchen before it lists everything that happens to sit in it.
    else if (area !== "" && (area.includes(q) || (words.length > 1 && words.every((w) => id.includes(w) || name.includes(w) || area.includes(w))))) rank = 6;
    if (rank >= 0) scored.push({ c, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || rate(a.c) - rate(b.c) || a.c.name.localeCompare(b.c.name) || a.c.entityId.localeCompare(b.c.entityId));
  return scored.slice(0, limit).map((s) => s.c);
}

const ENTITY_ID_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/i;

/** Whether text is shaped like an entity id, which is what lets an id Home
 * Assistant has never heard of still be stored by hand. */
export function looksLikeEntityId(text: string): boolean {
  return ENTITY_ID_RE.test(text.trim());
}

/**
 * What a typed entity field should store when it is left.
 *
 * `undefined` means keep what is already there: the text was a half finished
 * search rather than an id, so nothing should be written over a working entity.
 * Empty text keeps it too. Editing opens on an empty search, so leaving without
 * typing is a cancel; clearing is the field's own Remove button.
 */
export function commitTypedEntity(text: string, ref: EntityRef, states: Record<string, HassEntityState>): EntityRef | undefined {
  const t = text.trim();
  if (t === ref.entityId || t === "") return undefined;
  if (t in states) return entityRefFrom(states, t);
  if (looksLikeEntityId(t)) return { ...ref, entityId: t, domain: t.split(".")[0] ?? "" };
  return undefined;
}

/**
 * Transient search state, keyed by field. It is deliberately not part of the
 * draft: a half typed search is not an edit, and putting it in the document
 * would fill the undo history with keystrokes. A field with no entry here is
 * closed and shows its stored id.
 */
interface EntitySearchState { query: string; index: number }
const entitySearches = new Map<string, EntitySearchState>();

/**
 * Ask the panel to draw again after transient state changed.
 *
 * These controls are plain templates rendered by the panel rather than
 * elements of their own, so there is no reactive property to set. Walking out
 * of the shadow root reaches the panel element, whose `requestUpdate` is the
 * same thing a `@state` change would have called.
 */
function requestRerender(node: EventTarget | null): void {
  let el: Node | null = node instanceof Node ? node : null;
  for (let hops = 0; el && hops < 8; hops += 1) {
    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot)) return;
    const shadowHost = root.host as HTMLElement & { requestUpdate?: () => void };
    if (typeof shadowHost.requestUpdate === "function") {
      shadowHost.requestUpdate();
      return;
    }
    el = shadowHost;
  }
}

export interface EntityFieldOptions {
  /** Only offer this domain, or these domains, in the list (the id can still
   * be typed). */
  domain?: string | readonly string[];
  /** For rows that are already tight. Kept so callers need not change; the
   * field has no extra controls to drop any more. */
  compact?: boolean;
  /** Float entities whose state reads as a number to the top of the results. */
  preferNumeric?: boolean;
  /** The layer draws nothing at all until this box holds an entity. The box
   * takes a ring in the entity color, and pulses once when it becomes the
   * thing to fill in, so the answer to "why is my layer blank?" is marked
   * where the answer gets typed rather than only in a line of prose. */
  needed?: boolean;
  /** Offer an x that removes the chosen entity. Off where the row beside the
   * field already has its own remove button, so two x's never sit together. */
  clearable?: boolean;
}

/** Whether a field's result list is open right now. The preset dialog asks so
 * that its own Enter shortcut waits until the search has been answered. */
export function entitySearchOpen(key: string): boolean {
  return entitySearches.has(key);
}

/**
 * How an entity reached the field, for the callers that care.
 *
 * `pick` and `typed` are the two ways a person answers the question: a click
 * or Enter on a result, and Enter on an id typed in full. `blur` is the same
 * commit made by leaving the box, which is not an answer: the preset dialog
 * builds on an answer, and a blur is what a click on Cancel does first.
 * `clear` is the x, which empties the field.
 */
export type EntityPickSource = "pick" | "typed" | "blur" | "clear";

/**
 * A search field over every entity: type part of a friendly name or part of an
 * id, arrow keys to move, Enter to take the highlighted row. Picking writes the
 * id, the friendly name and the domain together, which is what every caller
 * used to have to get right by hand.
 *
 * It reads nothing but `hass`, and says so in its type, because the import
 * dialog asks for entities while no complication is open and so has no draft
 * to build a whole host from.
 */
export function entityField(host: Pick<EditorHost, "hass">, label: string, ref: EntityRef, set: (ref: EntityRef, source?: EntityPickSource) => void, key: string, opts: EntityFieldOptions = {}): TemplateResult {
  const states = host.hass.states;
  const search = entitySearches.get(key);
  const results = search
    ? searchEntities(entityChoices(states, opts.domain, areaLookup(host.hass)), search.query, ENTITY_RESULT_LIMIT, opts.preferNumeric ? looksNumeric : undefined)
    : [];
  const index = search ? Math.max(0, Math.min(search.index, results.length - 1)) : 0;
  const live = ref.entityId ? states[ref.entityId] : undefined;

  const open = (target: EventTarget | null, query: string, at = 0) => {
    entitySearches.set(key, { query, index: at });
    requestRerender(target);
  };
  const close = (target: EventTarget | null) => {
    entitySearches.delete(key);
    requestRerender(target);
  };
  const commitText = (text: string, source: EntityPickSource) => {
    const next = commitTypedEntity(text, ref, states);
    if (next) set(next, source);
  };
  const pick = (choice: EntityChoice, target: EventTarget | null) => {
    set(entityRefFrom(states, choice.entityId), "pick");
    close(target);
  };

  // Read back rather than closing over `index`: a second key can arrive before
  // the redraw that the first one asked for.
  const liveIndex = () => Math.max(0, Math.min(entitySearches.get(key)?.index ?? 0, results.length - 1));

  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLInputElement;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const st = entitySearches.get(key);
      if (!st) { open(el, el.value); return; }
      const next = e.key === "ArrowDown" ? liveIndex() + 1 : liveIndex() - 1;
      open(el, st.query, Math.max(0, Math.min(results.length - 1, next)));
      revealHighlight(el);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const choice = results[liveIndex()];
      if (search && choice) pick(choice, el);
      else { commitText(el.value, "typed"); close(el); }
      return;
    }
    if (e.key === "Escape") {
      if (!search) return;
      // Swallowed so it closes the list and not the popover around it.
      e.preventDefault();
      e.stopPropagation();
      close(el);
    }
  };

  // A chosen entity is one row the height of a text box: glyph, name, id, live
  // state, and an x. The search box only shows while nothing is chosen or while
  // the row is being changed, so the id is never printed twice.
  const caption = ref.entityId === ""
    ? html`<div class="hint">Type part of a name, a room, or an id.</div>`
    : live ? nothing : html`<div class="hint warn">Not in Home Assistant right now.</div>`;

  const focusSearch = (fieldEl: Element | null) =>
    requestAnimationFrame(() => fieldEl?.querySelector<HTMLInputElement>(".ent-box input")?.focus());

  // Editing starts on an empty search with the old id as the placeholder, so the
  // whole list is one keystroke away and leaving without typing changes nothing.
  const edit = (e: Event) => {
    const fieldEl = (e.currentTarget as HTMLElement).closest(".entity-field");
    open(fieldEl, "");
    focusSearch(fieldEl);
  };

  const clearable = opts.clearable ?? true;
  const name = live && typeof live.attributes.friendly_name === "string" ? live.attributes.friendly_name : ref.displayName || ref.entityId;
  const chosen = html`<div class="ent-chosen">
      <button type="button" class="ent-pick" title=${`${name}\n${ref.entityId}\nClick to change`} @click=${edit}>
        <span class="ent-ico ${live && isActiveState(live.state) ? "on" : ""}">${domainIcon(ref.domain || ref.entityId.split(".")[0] || "")}</span>
        <span class="ent-name">${name}</span>
        ${name === ref.entityId ? nothing : html`<span class="ent-id mono">${ref.entityId}</span>`}
        ${live ? html`<span class="ent-state">${live.state}</span>` : nothing}
      </button>
      ${clearable ? html`<button type="button" class="ent-clear" title="Remove entity" aria-label="Remove entity"
        @click=${(e: MouseEvent) => {
          const fieldEl = (e.currentTarget as HTMLElement).closest(".entity-field");
          set({ entityId: "", displayName: "", domain: "" }, "clear");
          requestRerender(fieldEl);
        }}>${uiIcon("close")}</button>` : nothing}
    </div>`;

  const box = html`<div class="ent-box ${search ? "open" : ""} ${opts.needed && ref.entityId === "" ? "needs" : ""}">
      <span class="ent-glass">${uiIcon("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${search ? "true" : "false"} autocomplete="off" spellcheck="false"
        .value=${search ? search.query : ""}
        placeholder=${ref.entityId || "Search by name, room, or id"}
        @focus=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; open(el, entitySearches.get(key)?.query ?? ""); }}
        @input=${(e: Event) => { const el = e.target as HTMLInputElement; open(el, el.value); }}
        @keydown=${onKey}
        @blur=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; if (search) commitText(el.value, "blur"); close(el); }} />
    </div>`;

  // The anchor holds the control and its result list, so the list can float
  // under the box, at the box's width, instead of pushing the card down.
  return html`<div class="field entity-field">
    <span>${label}</span>
    <div class="ent-anchor">
    ${!search && ref.entityId !== "" ? chosen : box}
    ${search
      ? html`<div class="entity-results" role="listbox">
          ${results.length === 0
            ? html`<div class="hint keep" style="padding:6px 8px">${looksLikeEntityId(search.query) ? "Nothing here has that id. Press Enter to use it anyway." : "Nothing matches that search."}</div>`
            : results.map((c, i) => html`<button type="button" role="option" aria-selected=${i === index ? "true" : "false"} class="ent ${i === index ? "hl" : ""}"
                @mousedown=${(e: MouseEvent) => e.preventDefault()} @click=${(e: MouseEvent) => pick(c, e.target)}>
                <span class="ent-ico ${isActiveState(c.state) ? "on" : ""}">${domainIcon(c.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${c.name}</span>
                  <span class="ent-sub">
                    ${c.area ? html`<span class="ent-area">${c.area}</span>` : nothing}
                    <span class="ent-id mono">${c.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${domainLabel(c.domain)}</span>
                  <span class="ent-state">${c.state}</span>
                </span>
              </button>`)}
        </div>`
      : nothing}
    </div>
    ${search ? nothing : caption}
  </div>`;
}

/** Keep the arrow-key selection visible when the result list scrolls. */
function revealHighlight(input: HTMLElement): void {
  requestAnimationFrame(() => {
    const hl = input.closest(".entity-field")?.querySelector<HTMLElement>("button.ent.hl");
    hl?.scrollIntoView({ block: "nearest" });
  });
}

// ── Symbol picker ─────────────────────────────────────────────────────────

/**
 * How many tiles the grid draws when the pool is the whole icon pack. Every tile
 * is an inline SVG fetched on demand, and a one letter search can match
 * thousands, so that case is capped and the search box is how the rest is
 * reached. The curated pools are at most a few hundred names and always draw in
 * full, which keeps browsing free of "showing some of" arithmetic.
 */
const SYMBOL_GRID_LIMIT = 120;

/**
 * Which names the grid offers, and whether they came from the icon pack rather
 * than the curated catalogue.
 *
 * The installed pack is the authority on what will actually draw, so when one is
 * present every curated list is filtered down to it. A picker tile with no
 * picture in it helps nobody, and a name the pack lacks can still be typed into
 * the field. With no pack at all (`known` empty) nothing is filtered and the
 * tiles show names only.
 */
export function symbolPool(
  category: string,
  query: string,
  pack: readonly string[],
  known: Set<string>
): { names: string[]; fromPack: boolean } {
  const drawable = (list: readonly string[]) => (known.size === 0 ? [...list] : list.filter((s) => known.has(s)));
  if (category !== "") {
    return { names: drawable(SYMBOL_CATEGORIES.find((c) => c.name === category)?.symbols ?? []), fromPack: false };
  }
  // Searching reaches the whole pack; browsing starts from the curated set,
  // which is short enough to skim and ordered by category.
  if (query.trim() !== "" && pack.length > 0) return { names: [...pack], fromPack: true };
  return { names: drawable(CURATED_SYMBOLS), fromPack: false };
}

/** How many of a list the installed pack can actually draw, which is what both
 * the grid and every count in the picker is measured in. */
export function drawableCount(list: readonly string[], known: Set<string>): number {
  return known.size === 0 ? list.length : list.filter((s) => known.has(s)).length;
}

/** The category dropdown. Each label carries its own size, so choosing one is a
 * decision made before the grid redraws rather than after. */
export function symbolChoices(known: Set<string>): { value: string; label: string }[] {
  return [
    { value: "", label: `Starter set (${drawableCount(CURATED_SYMBOLS, known)})` },
    ...SYMBOL_CATEGORIES.map((c) => ({ value: c.name, label: `${c.name} (${drawableCount(c.symbols, known)})` })),
  ];
}

/** Everything a search can reach: the whole installed pack, or the curated
 * catalogue when no pack answers with its names. Both the starter set and each
 * category are a window onto this, and the dropdown already sizes those, so this
 * is the one number the picker cannot show anywhere else. */
export function reachableCount(pack: readonly string[]): number {
  return pack.length > 0 ? pack.length : CURATED_SYMBOLS.length;
}

/**
 * The line under the grid.
 *
 * With nothing typed it reports everything reachable, whatever set is chosen.
 * The dropdown already says how big each set is, so repeating that here would
 * waste the one line that can say how much more there is to find. Once a search
 * is running it counts matches, and never says "x of x", because a count is a
 * total when nothing was left out and only truncation needs the arithmetic.
 */
export function symbolCount(shown: number, matches: number, searching: boolean, reachable: number): string {
  if (!searching) return reachable === 1 ? "1 symbol available." : `${reachable} symbols available.`;
  if (matches > shown) return `Showing ${shown} of ${matches}. Type more to narrow it down.`;
  return matches === 1 ? "1 symbol matches." : `${matches} symbols match.`;
}

function symbolTile(host: EditorHost, name: string, selected: boolean, pick: (n: string) => void): TemplateResult {
  // The color passed here is overridden by CSS `currentColor`, which wins over
  // the presentation attribute the provider writes, so tiles follow the theme.
  const glyph = host.icons.render(name, 22, "#FFFFFF");
  return html`<button type="button" class="sym ${selected ? "on" : ""}" title=${name} @click=${() => pick(name)}>
    <span class="sym-glyph">${glyph ?? html`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${name}</span>
  </button>`;
}

/**
 * A name field plus a searchable grid of glyphs. Stores the canonical Apple
 * name, never the Home Assistant asset name.
 *
 * With `setPath` given, the field also offers Material Design icons. Those are
 * stored as the literal name `mdi:flash` in the symbol, and the glyph's own SVG
 * path alongside it, because the watch has no MDI catalogue to look a name up
 * in. Only the icon layer takes one: a rule's `setIcon` and the inline symbol
 * have nowhere to keep a path, so they stay SF Symbols.
 *
 * `defaultOpen` is whether the grid shows before anyone has touched this
 * field. A layer's symbol is most of what the layer is, so its grid starts
 * open; a symbol that is one row of a long properties sheet passes false.
 */
function symbolField(
  host: EditorHost,
  symbol: string,
  set: (v: string) => void,
  key: string,
  setPath?: (d: string | undefined) => void,
  label = "Symbol",
  defaultOpen = true,
): TemplateResult {
  const browser = host.symbols;
  const open = browser.isOpen(key, defaultOpen);
  const query = browser.query(key);
  const listed = host.icons.names();
  const pack = listed ?? [];
  const known = new Set(pack);
  const current = symbol.trim();
  const isMdiName = current.startsWith(MDI_PREFIX);
  const offersMdi = setPath !== undefined;
  const showing: SymbolPack = offersMdi ? (browser.pack(key) ?? (isMdiName ? "mdi" : "sf")) : "sf";
  const missing = symbolIsMissing(current, known);
  const pick = (name: string) => {
    set(name);
    // A picked SF Symbol drops any path the layer was carrying; a picked MDI
    // icon brings its own. Same undo key as the symbol itself, so the pair is
    // one step.
    setPath?.(name.startsWith(MDI_PREFIX) ? host.icons.mdiPath?.(name) : undefined);
    browser.noteUsed(name);
  };
  // A name typed by hand: an `mdi:` one gets its path filled in when the
  // catalogue knows it, and is left without one when it does not, which the
  // resolver draws as a question mark rather than as nothing.
  const typed = (v: string) => {
    set(v);
    if (!offersMdi) return;
    const name = v.trim();
    setPath?.(name.startsWith(MDI_PREFIX) ? host.icons.mdiPath?.(name) : undefined);
  };

  let browsePane: TemplateResult | typeof nothing = nothing;
  if (open && showing === "mdi") {
    const names = host.icons.mdiNames?.();
    const matches = searchMdi(names ?? [], query);
    const shown = matches.slice(0, SYMBOL_GRID_LIMIT);
    const recent = browser.recent.filter((s) => s.startsWith(MDI_PREFIX));
    browsePane = html`<div class="sym-browse">
      ${packToggle(browser, key, showing)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${query} @input=${onInput((v) => browser.setQuery(key, v))} />
      </div>
      ${recent.length === 0 ? nothing : html`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${recent.map((n) => symbolTile(host, n, n === current, pick))}</div>`}
      <div class="sym-grid">${shown.map((n) => symbolTile(host, n, n === current, pick))}</div>
      ${names === undefined
        ? html`<div class="hint keep">Loading the Material Design catalogue.</div>`
        : matches.length === 0
          ? html`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`
          // Always the searching wording: the MDI set is thousands of names
          // deep and the grid never shows all of them, so "N available" would
          // claim more than is on screen even with the box empty.
          : html`<div class="hint keep">${symbolCount(shown.length, matches.length, true, names.length)}</div>`}
      ${names !== undefined && isMdiName && !names.includes(current)
        ? html`<div class="hint warn">There is no <code>${current}</code> in this build's Material Design set, so the watch draws a question mark.</div>`
        : nothing}
    </div>`;
  } else if (open) {
    const category = browser.category(key);
    const pool = symbolPool(category, query, pack, known);
    const matches = searchSymbols(pool.names, query);
    const shown = pool.fromPack ? matches.slice(0, SYMBOL_GRID_LIMIT) : matches;
    const sfRecent = browser.recent.filter((s) => !s.startsWith(MDI_PREFIX));
    const recent = known.size === 0 ? sfRecent : sfRecent.filter((s) => known.has(s));
    browsePane = html`<div class="sym-browse">
      ${offersMdi ? packToggle(browser, key, showing) : nothing}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${query} @input=${onInput((v) => browser.setQuery(key, v))} />
        <select @change=${onInput((v) => browser.setCategory(key, v))}>
          ${symbolChoices(known).map(
            (c) => html`<option value=${c.value} ?selected=${c.value === category}>${c.label}</option>`
          )}
        </select>
      </div>
      ${recent.length === 0 ? nothing : html`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${recent.map((n) => symbolTile(host, n, n === current, pick))}</div>`}
      <div class="sym-grid">${shown.map((n) => symbolTile(host, n, n === current, pick))}</div>
      ${matches.length === 0
        ? html`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`
        : html`<div class="hint keep">
            ${symbolCount(shown.length, matches.length, query.trim() !== "", reachableCount(pack))}
          </div>`}
      ${!host.icons.available()
        ? html`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`
        : listed !== undefined && listed.length === 0
          ? html`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`
          : nothing}
    </div>`;
  }

  return html`
    <label class="field"><span>${label}</span>
      <input type="text" class="mono" .value=${symbol} placeholder="lightbulb.fill"
        @input=${onInput(typed)} @change=${onInput((v) => {
          // A typed name only joins the recents list once it is known to be
          // real, so a half finished name never sticks around as a tile.
          const name = v.trim();
          if (name.startsWith(MDI_PREFIX)) {
            if (host.icons.mdiPath?.(name) !== undefined) browser.noteUsed(v);
          } else if (known.size === 0 || known.has(name)) {
            browser.noteUsed(v);
          }
        })} /></label>
    ${missing ? html`<div class="hint warn">The installed icon pack has no <code>${current}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>` : nothing}
    <button type="button" class="link" @click=${() => browser.toggle(key, defaultOpen)}>${open ? "Hide symbols" : "Browse symbols"}</button>
    ${browsePane}`;
}

/** What the last paste into a layer's Custom SVG box did, by layer id. Not
 * part of the document and not part of undo, like the other editor notes. */
const svgPasteNotes = new Map<string, { text: string; warn: boolean }>();

/**
 * Switch an icon layer between a catalogue symbol and a pasted drawing.
 *
 * Going to a drawing keeps whatever path the layer already had, so a Material
 * Design icon is a starting point someone can edit rather than a blank box.
 * Going back to a symbol drops the path and its box: the symbol is what draws
 * from then on, and a stale path under it would come back on the next switch.
 */
function setIconDrawing(p: IconElement, to: "symbol" | "svg"): void {
  if (to === "svg") {
    p.symbol = literal(CUSTOM_SVG_SYMBOL);
    return;
  }
  p.symbol = literal("lightbulb");
  delete p.path;
  delete p.viewBox;
}

/**
 * The Custom SVG box: paste a path or whole markup, and see what landed.
 *
 * The box shows the `d` the document carries, so after markup goes in it says
 * what was kept rather than what was pasted. A paste that cannot be used
 * leaves the document alone and says why, which is the only way to tell the
 * difference between "nothing happened" and "that is not a path".
 */
function customSvgFields(
  p: IconElement,
  set: (mutate: (p: IconElement) => void, key?: string) => void,
): TemplateResult {
  const note = svgPasteNotes.get(p.id);
  const bytes = new TextEncoder().encode(p.path ?? "").length;
  const paste = (raw: string, node: EventTarget | null) => {
    if (raw.trim() === "") {
      svgPasteNotes.delete(p.id);
      set((q) => { delete q.path; delete q.viewBox; }, "svg-path");
      return;
    }
    const result = parseSvgPaste(raw);
    if (!result.ok) {
      svgPasteNotes.set(p.id, { text: result.error, warn: true });
      requestRerender(node);
      return;
    }
    const box = result.viewBox;
    svgPasteNotes.set(p.id, {
      text: box === undefined
        ? "Path taken. It draws in the standard 24 by 24 box."
        : `Path taken, in the box ${box} the markup names.`,
      warn: false,
    });
    set((q) => {
      q.path = result.path;
      if (box === undefined) delete q.viewBox; else q.viewBox = box;
    }, "svg-path");
  };
  return html`
    <label class="field"><span>SVG</span>
      <textarea rows="4" class="mono ${(p.path ?? "") === "" ? "needs" : ""}" .value=${p.path ?? ""}
        placeholder="M7 2v11h3v9l7-12h-4l4-8z  or a whole <svg …> tag"
        @input=${(e: Event) => paste((e.target as HTMLTextAreaElement).value, e.target)}></textarea></label>
    ${note ? html`<div class="hint ${note.warn ? "warn" : "keep"}">${note.text}</div>` : nothing}
    ${p.path === undefined || p.path === ""
      ? html`<div class="hint keep">Paste an SVG path's <code>d</code>, or the whole <code>&lt;svg&gt;</code> markup and the paths in it are taken. The drawing takes the layer's color, so a flat single-color shape is what reads on a watch face.</div>`
      : html`<div class="field readout"><span>Size</span><span class="readout-v">${bytes} bytes${p.viewBox === undefined ? "" : ` · ${p.viewBox}`}</span></div>`}
    <div class="hint">Only <code>&lt;path&gt;</code> elements are drawn: a circle, a rectangle or a group transform in the markup is ignored. Convert those to paths in a vector editor first.</div>`;
}

/** What the last upload into a picture layer did, by layer id. Editor state,
 * not document state, like the Custom SVG note above. */
const inlineImageNotes = new Map<string, { text: string; warn: boolean }>();

/**
 * Switch a picture layer between the two fetched sources and an upload.
 *
 * Leaving the upload drops its bytes: they are the biggest thing a layer can
 * carry and keeping them "in case" would sit in every save of a document that
 * no longer draws them. Going to the upload drops the entity for the same
 * reason and one more: a layer that draws its own bytes but still names a
 * camera would put that camera into every share and every gallery upload, for
 * nothing. Switching between the two fetched sources keeps the entity, as it
 * always has.
 */
function setImageSource(p: ImageElement, to: ImageSource): void {
  p.source = to;
  if (to === "inline") {
    p.entity = { entityId: "", displayName: "", domain: "" };
    return;
  }
  delete p.data;
  delete p.format;
}

/**
 * The Upload row of a picture layer: pick a file, see how big it ended up, or
 * take it out again.
 *
 * The file is resized here, to the pixel box this layer fills, and never
 * reaches the document at its original size: the watch draws these bytes
 * forever, and an oversized bitmap fails a WidgetKit render whole.
 */
function inlineImageFields(
  host: EditorHost,
  img: ImageElement,
  family: FamilyKind,
  set: (mutate: (p: ImageElement) => void, key?: string) => void,
): TemplateResult {
  const note = inlineImageNotes.get(img.id);
  const bytes = inlineImageBytes(img);
  const pick = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // The same file picked twice in a row has to fire a change event both
    // times, which it only does if the input is emptied after each pick.
    input.value = "";
    if (!file) return;
    const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
    const place = effectivePlacement(host.config, family, { kind: "image", payload: img });
    const result = await encodeInlinePicture(file, {
      width: place.frame.width * box.width,
      height: place.frame.height * box.height,
    });
    if ("error" in result) {
      inlineImageNotes.set(img.id, { text: result.error, warn: true });
      requestRerender(input);
      return;
    }
    inlineImageNotes.set(img.id, {
      text: `${file.name} is in the complication at ${result.width} by ${result.height} pixels, ${formatKiB(result.bytes)}.`,
      warn: false,
    });
    set((p) => {
      p.data = result.data;
      if (result.format === "jpeg") p.format = "jpeg"; else delete p.format;
    }, "inline-image");
  };
  // A real button, not a styled `<label>`. The label carried the button's
  // class and none of its rules (every one of them names `button.small`), so
  // it drew as bare text with the plus sign wrapping onto its own line. The
  // button opens the hidden input beside it, the same way the import card's
  // "Choose a file" does.
  return html`
    <div class="field list-field"><span>Picture</span>
      <div class="adders">
        <button type="button" class="small" title="Choose a picture from this device"
          @click=${(e: Event) => (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLInputElement>("input[type=file]")?.click()}>
          ${uiIcon("plus")}<span>${bytes > 0 ? "Replace" : "Upload"}</span>
        </button>
        <input type="file" accept=${IMAGE_UPLOAD_ACCEPT} hidden @change=${pick} />
        ${bytes > 0
          ? html`<button type="button" class="small" title="Take the picture out of this complication"
              @click=${() => {
                inlineImageNotes.delete(img.id);
                set((p) => { delete p.data; delete p.format; }, "inline-image");
              }}>Remove</button>`
          : nothing}
        ${bytes > 0 ? html`<span class="readout-v">${formatKiB(bytes)}</span>` : nothing}
      </div>
    </div>
    ${note ? html`<div class="hint ${note.warn ? "warn" : "keep"}">${note.text}</div>` : nothing}
    ${bytes === 0 ? html`<div class="hint warn">This layer has no picture yet, so it draws a placeholder.</div>` : nothing}
    <div class="hint">The picture travels inside the complication, so nothing is fetched and it works with no entity at all. It is resized to the layer's own size on the way in, and each one may be at most ${IMAGE_INLINE_MAX_BYTES / 1024} KB.</div>`;
}

/**
 * Whether to warn that the installed icon pack has no such symbol.
 *
 * A Material Design name is not in the SF pack and never will be, so the pack's
 * silence about one says nothing. An empty pack has not loaded yet, and an
 * empty name is not a mistake, only an unfinished one.
 */
export function symbolIsMissing(symbol: string, known: ReadonlySet<string>): boolean {
  const name = symbol.trim();
  return name !== "" && !name.startsWith(MDI_PREFIX) && known.size > 0 && !known.has(name);
}

/**
 * The Material Design names matching a search, best first.
 *
 * The `mdi:` prefix is on every name, so searching for it would match
 * everything and rank nothing. It comes off both sides, `searchSymbols` does
 * the work it does for SF Symbols, and it goes back on the way out so callers
 * only ever handle names as a document spells them.
 */
export function searchMdi(names: readonly string[], query: string): string[] {
  const q = query.trim();
  const bare = q.startsWith(MDI_PREFIX) ? q.slice(MDI_PREFIX.length) : q;
  const stripped = names.map((n) => (n.startsWith(MDI_PREFIX) ? n.slice(MDI_PREFIX.length) : n));
  return searchSymbols(stripped, bare).map((n) => MDI_PREFIX + n);
}

/** Which of the two catalogues the grid below is showing. */
function packToggle(browser: EditorHost["symbols"], key: string, showing: SymbolPack): TemplateResult {
  const options: [SymbolPack, string][] = [["sf", "SF Symbols"], ["mdi", "Material Design Icons"]];
  return html`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${options.map(([v, text]) => html`<button type="button" role="radio" aria-checked=${v === showing ? "true" : "false"}
      class=${v === showing ? "on" : ""}
      @click=${() => { if (v !== showing) browser.setPack(key, v); }}>${text}</button>`)}
  </div>`;
}

// ── Value editor ──────────────────────────────────────────────────────────

/** Every source, named for what it gives rather than how it is computed, in
 * the order people reach for them: a typed value, one entity, several, the
 * clock, then the specialist ones. */
const VALUE_KINDS: [ValueKind["kind"], string][] = [
  ["literal", "Fixed text"],
  ["entityState", "Entity state"],
  ["entityAttribute", "Entity attribute"],
  ["entityAge", "Time since entity changed"],
  ["aggregate", "Several entities combined"],
  ["chartStat", "Number from a chart"],
  ["time", "Clock and date"],
  ["dataAge", "Time since last refresh"],
  ["jinja", "Template (Jinja)"],
  ["named", "Shared value"],
];

/** The Source menu in four groups, so ten sources do not read as one wall:
 * what you type, what an entity gives, the clock, and what this complication
 * already has. */
const VALUE_KIND_GROUPS: { label: string; kinds: ValueKind["kind"][] }[] = [
  { label: "Typed in", kinds: ["literal", "jinja"] },
  { label: "From an entity", kinds: ["entityState", "entityAttribute", "entityAge", "aggregate"] },
  { label: "Time", kinds: ["time", "dataAge"] },
  { label: "From this complication", kinds: ["chartStat", "listStat", "item", "imageTime", "named"] },
];

/** `valueKindsFor`, under its group headings. A source in no group (there
 * is none today) lands at the end under Other. */
export function valueKindGroups(host: EditorHost, kind: ValueKind, opts: ValueEditorOptions): { label: string; options: [ValueKind["kind"], string][] }[] {
  const kinds = valueKindsFor(host, kind, opts);
  const placed = new Set<ValueKind["kind"]>();
  const groups = VALUE_KIND_GROUPS.map((g) => ({
    label: g.label,
    options: g.kinds.flatMap((k) => {
      const found = kinds.find(([kk]) => kk === k);
      if (!found) return [];
      placed.add(k);
      return [found];
    }),
  }));
  const other = kinds.filter(([k]) => !placed.has(k));
  return other.length === 0 ? groups : [...groups, { label: "Other", options: other }];
}

/** One line under Source that says what the chosen source gives. Sources
 * whose own fields already explain them (a chart's number, a template, a
 * shared value) are left out. */
const VALUE_KIND_HINTS: Partial<Record<ValueKind["kind"], string>> = {
  literal: "Words or a number you type. It never changes.",
  entityState: "What Home Assistant shows for the entity, like 21.5 or on.",
  entityAttribute: "One detail the entity carries besides its state, like a light's brightness.",
  entityAge: "Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",
  aggregate: "Count several entities, or take the sum, average, lowest or highest of their states.",
  time: "The time or date, read each time the complication refreshes.",
  dataAge: "Seconds since the watch last fetched values.",
};

const CHART_CURVE_OPTIONS: [ChartCurve, string][] = [
  ["straight", "Straight"],
  ["smooth", "Smooth"],
  ["step", "Step"],
];
const CHART_FILL_STYLE_OPTIONS: [ChartFillStyle, string][] = [
  ["flat", "Flat"],
  ["fade", "Fade"],
];
const CHART_DOTS_MODE_OPTIONS: [ChartDotsMode, string][] = [
  ["auto", "Auto"],
  ["all", "All"],
];
const CHART_SMOOTHING_OPTIONS: [string, string][] = [
  ["off", "Off"], ["light", "Light"], ["medium", "Medium"], ["strong", "Strong"],
];
const CHART_STYLES: [ChartStyle, string][] = [
  ["bars", "Bars"], ["line", "Line"], ["area", "Area"],
];
const CHART_SCALES: [ChartScale, string][] = [
  ["auto", "Auto"], ["fixed", "Fixed range"],
];
const CHART_BASELINES: [ChartBaseline, string][] = [
  ["lowest", "Lowest value"], ["zero", "Zero"],
];
const CHART_HIGHLIGHTS: [ChartHighlight, string][] = [
  ["none", "None"], ["highest", "Highest"], ["lowest", "Lowest"], ["both", "Both"],
];
const CHART_COLORINGS: [ChartColoring, string][] = [
  ["uniform", "One color"], ["bands", "By value"],
];
/** The color table a chart starts with when the author first switches it to
 * banded color.
 *
 * Seeded from the readings on screen rather than left empty, because a new
 * setting that visibly does nothing reads as broken. Thirds of the current
 * spread is the same split the gauge preset uses, and it always paints all
 * three colors on the data in front of the author. */
function seedBands(values: readonly number[]): ChartBand[] {
  const colors: [string, string] = [CHART_DEFAULT_BAND_LOW_HEX, "#FFD60A"];
  if (values.length < 2) {
    return colors.map((colorHex, i) => ({ id: newId(), upTo: (i + 1) * 33, colorHex }));
  }
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo;
  const round = (n: number) => Number(n.toFixed(span >= 10 ? 0 : 2));
  return colors.map((colorHex, i) => ({ id: newId(), upTo: round(lo + (span * (i + 1)) / 3), colorHex }));
}

/** Where a threshold line starts when the author first turns one on: the middle
 * of the readings on screen, for the same reason the band table is seeded. A
 * line at the top of an empty chart would read as a broken setting. */
function seedThreshold(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo;
  return Number(((lo + hi) / 2).toFixed(span >= 10 ? 0 : 2));
}

/** A new row for the end of an existing table: one step past the last one, in
 * the layer's own color so it is visible before the author picks one. Takes the
 * table rather than a layer, so the chart and the gauge share it. */
function nextBand(bands: readonly ChartBand[], ownColorHex: string): ChartBand {
  const sorted = chartSortedBands({ bands });
  const last = sorted.at(-1);
  const step = bands.length > 1 ? Math.abs(sorted[1]!.upTo - sorted[0]!.upTo) : 10;
  return { id: newId(), upTo: (last?.upTo ?? 0) + (step || 10), colorHex: ownColorHex };
}

/** A layer that carries a color table: the chart and the gauge. */
interface BandedLayer {
  bands: ChartBand[];
  bandAboveColorHex: string;
  /** A bars chart's colors for a bar above the last band. */
  bandAboveFillColorHex?: string;
  bandAboveBorderColorHex?: string;
}

/** What a bars chart adds to its band table. While the border is on, every row
 * shows a Fill and a Border color box side by side in place of its one color.
 * `fillHex` and `borderHex` are the chart's own fill and border colors, which
 * come before a band's color when the band sets none. */
interface BarBandOptions {
  fillHex?: string;
  borderHex?: string;
  border: boolean;
}

/** One of a band row's Fill or Border boxes, with a reset dot at its corner
 * while `back` says the color is the band's own. */
function bandColorCell(label: string, value: string, set: (v: string | undefined) => void, back?: ResetTo): TemplateResult {
  return html`<span class="band-cell">${colorBox(label, value, set)}${resetButton(back)}</span>`;
}

/** Where a band table's color bar starts and ends: the band ends and every
 * number the layer reads, with a little room past both ends. With nothing to
 * span, a band end alone gets half its size either side. */
export function bandScale(upTos: readonly number[], values?: number | readonly number[]): { lo: number; hi: number } {
  const seen = (typeof values === "number" ? [values] : values ?? []).filter((n) => Number.isFinite(n));
  const all = [...upTos, ...seen];
  if (all.length === 0) return { lo: -1, hi: 1 };
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = hi > lo ? (hi - lo) * 0.12 : Math.abs(lo) / 2 || 1;
  return { lo: lo - pad, hi: hi + pad };
}

/** Least share of the bar one band gets, so a band covering a sliver of the
 * numbers is still a color you can see and not a hairline. */
const BAND_MIN_SHARE = 0.1;

/**
 * How the color bar divides: each band's share of the width, and a function
 * placing a number on it in percent. Shares follow the stretch of numbers a
 * band covers, except that none falls under `minShare` (the rest give up room
 * in proportion), and a number is placed inside its own band's piece, so the
 * marks still land in the right color after the stretch.
 */
export function bandLayout(upTos: readonly number[], lo: number, hi: number, minShare = BAND_MIN_SHARE): { shares: number[]; at: (n: number) => number } {
  const sorted = [...upTos].sort((a, b) => a - b);
  const clamp = (n: number) => Math.max(lo, Math.min(hi, n));
  const edges = [lo, ...sorted.map(clamp), hi];
  const span = hi - lo || 1;
  const raw = edges.slice(1).map((e, i) => Math.max(0, e - edges[i]!) / span);
  const floor = Math.min(minShare, 1 / raw.length);
  const small = raw.map((w) => w < floor);
  const smallCount = small.filter(Boolean).length;
  const rest = raw.reduce((sum, w, i) => sum + (small[i] ? 0 : w), 0);
  const left = 1 - smallCount * floor;
  const bigCount = raw.length - smallCount;
  const shares = raw.map((w, i) => small[i] ? floor : rest > 0 ? (w / rest) * left : left / bigCount);
  const starts = shares.map((_, i) => shares.slice(0, i).reduce((a, b) => a + b, 0));
  const at = (n: number) => {
    const v = clamp(n);
    let i = edges.length - 2;
    for (let k = 0; k < edges.length - 1; k++) {
      if (v <= edges[k + 1]!) { i = k; break; }
    }
    const width = edges[i + 1]! - edges[i]!;
    const into = width > 0 ? (v - edges[i]!) / width : 0;
    return Math.max(0, Math.min(100, (starts[i]! + into * shares[i]!) * 100));
  };
  return { shares, at };
}

/** A band end as a short label under the bar. */
function bandTick(n: number): string {
  return Math.abs(n) >= 1000 || Number.isInteger(n) ? String(Math.round(n * 100) / 100) : String(Number(n.toPrecision(4)));
}

/**
 * The bar over a band table: each band's color in a piece as wide as the
 * numbers it covers, never too thin to see; each band end labelled under it;
 * a mark where the current value falls, or a bracket over the stretch a chart
 * reads. With `bordered` pieces the bar shows each band's fill inside its
 * border, the way a bar draws.
 */
function bandBar(
  pieces: readonly { upTo?: number; fill: string; border?: string; label?: string; pick?: () => void }[],
  values: number | readonly number[] | undefined,
): TemplateResult {
  const upTos = pieces.flatMap((p) => p.upTo === undefined ? [] : [p.upTo]);
  const { lo, hi } = bandScale(upTos, values);
  const { shares, at } = bandLayout(upTos, lo, hi);
  const now = typeof values === "number" && Number.isFinite(values) ? values : undefined;
  const seen = typeof values === "object" ? values.filter((n) => Number.isFinite(n)) : [];
  const low = seen.length > 0 ? Math.min(...seen) : undefined;
  const high = seen.length > 0 ? Math.max(...seen) : undefined;
  // Band ends crowd when bands are narrow: a label too close to the one
  // before it is left out, and its number is still in the rows below.
  let lastTick = -Infinity;
  const ticks = [...upTos].sort((a, b) => a - b).flatMap((n) => {
    const x = at(n);
    if (x - lastTick < 12) return [];
    lastTick = x;
    return [html`<span style=${`left:${x}%`}>${bandTick(n)}</span>`];
  });
  return html`<div class="band-bar">
    <div class="bb" aria-hidden="true">${pieces.map((p, i) => html`<i class="${p.border === undefined ? "" : "bordered"} ${p.pick === undefined ? "" : "pick"}"
      title=${p.label ?? ""} @click=${p.pick}
      style=${`flex-grow:${shares[i] ?? 0};--f:${p.fill}${p.border === undefined ? "" : `;--b:${p.border}`}`}></i>`)}</div>
    ${low === undefined || high === undefined ? nothing : html`<span class="span" style=${`left:${at(low)}%;width:${at(high) - at(low)}%`}
      title=${low === high ? `Reads ${bandTick(low)}` : `Reads ${bandTick(low)} to ${bandTick(high)}`}></span>`}
    ${now === undefined ? nothing : html`<span class="now" style=${`left:${at(now)}%`} title=${`Now ${now}`}></span>`}
    ${ticks.length === 0 ? nothing : html`<div class="ticks" aria-hidden="true">${ticks}</div>`}
  </div>`;
}

/**
 * A color table as compact rows, lowest first the way they are checked: up to
 * which number, in which color, then the color for anything above the last
 * row, then the button that adds a row. Shared by the gauge's and the chart's
 * Look cards, a text layer's color by value and a rich text part, so a change
 * to how a table is edited lands in all of them at once.
 *
 * `value` is what the layer reads right now, when there is one number to name:
 * the bar marks it and its row lights up. A row's number is committed when the
 * box is left, not on every key, because the rows re-sort by it and a row that
 * moved under the caret mid-number would take the typing somewhere else.
 */
function bandTableFields(
  layer: BandedLayer,
  ownColorHex: string,
  set: (mutate: (p: BandedLayer) => void, k?: string) => void,
  value?: number | readonly number[],
  bars?: BarBandOptions,
): TemplateResult {
  const sorted = chartSortedBands({ bands: layer.bands });
  const now = typeof value === "number" && Number.isFinite(value) ? value : undefined;
  const hit = now === undefined ? undefined : (sorted.find((b) => now <= b.upTo)?.id ?? "above");
  const band = (id: string, mutate: (b: ChartBand) => void) => (p: BandedLayer) => {
    const b = p.bands.find((x) => x.id === id);
    if (b) mutate(b);
  };
  const above = layer.bandAboveColorHex;
  const aboveBack: ResetTo = {
    atDefault: sameColor(above, CHART_DEFAULT_BAND_HIGH_HEX),
    title: `Back to ${CHART_DEFAULT_BAND_HIGH_HEX}`,
    reset: () => set((p) => { p.bandAboveColorHex = CHART_DEFAULT_BAND_HIGH_HEX; }),
  };
  const split = bars?.border === true;
  // A row's colors. With the border off it is the one color box it always
  // was. With it on, a Fill box and a Border box. Fill writes the band color,
  // which is what the band bar above shows and what a bar fills in, and also the
  // band's own fill only while the chart has a fill color that would otherwise
  // win. Border writes the band's own border; its reset dot goes back to the
  // chart's border color, or white.
  const colors = (label: string, row: { colorHex: string; fillColorHex?: string; borderColorHex?: string },
    setColor: (v: string) => void, setFill: (v: string | undefined) => void, setBorder: (v: string | undefined) => void) => {
    if (!split) return colorBox(label, row.colorHex, (v) => setColor(v ?? "#FFFFFF"));
    const chartFill = bars?.fillHex;
    const chartBorder = bars?.borderHex;
    const fillBack: ResetTo | undefined = row.fillColorHex === undefined ? undefined : {
      atDefault: false, title: "Back to the chart fill color", reset: () => setFill(undefined),
    };
    const borderBack: ResetTo | undefined = row.borderColorHex === undefined ? undefined : {
      atDefault: false, title: `Back to ${chartBorder === undefined ? "white" : "the chart border color"}`, reset: () => setBorder(undefined),
    };
    return html`
      ${bandColorCell(`${label} fill`, row.fillColorHex ?? chartFill ?? row.colorHex, (v) => {
        if (v === undefined) return;
        setColor(v);
        setFill(chartFill === undefined ? undefined : v);
      }, fillBack)}
      ${bandColorCell(`${label} border`, row.borderColorHex ?? chartBorder ?? CHART_DEFAULT_BAR_BORDER_HEX, (v) => setBorder(v), borderBack)}`;
  };
  // The box for where band `i` ends. A middle row shows two: its own end, and
  // the end of the band under it as its start, so a row reads "122 – 231".
  // Both edit the same number, held between its neighbours, so the rows never
  // re-sort under the pointer mid-drag.
  const endBox = (i: number, label: string) => {
    const b = sorted[i]!;
    return html`<input type="number" class="band-up" step="any" .value=${String(b.upTo)} aria-label=${label}
      title=${`Band ${i + 1} runs up to and including this number`}
      data-scrub @pointerdown=${boxScrubber(b.upTo, (n) => set(band(b.id, (x) => { x.upTo = n; })), {
        ...(i > 0 ? { min: sorted[i - 1]!.upTo } : {}),
        ...(i < sorted.length - 1 ? { max: sorted[i + 1]!.upTo } : {}),
      })}
      @change=${onInput((v) => {
        const n = Number(v);
        if (v.trim() !== "" && Number.isFinite(n)) set(band(b.id, (x) => { x.upTo = n; }));
      })} />`;
  };
  // The range cell is four slots: a sign, a start box, "to", an end box. The
  // first row and Above put their sign and one box at the front and leave the
  // rest blank, so every row's first box lines up.
  // The bar shows what a bar would draw: with the border on, each band's fill
  // inside its border, each color taken the same way its row's boxes take it.
  const piece = (upTo: number | undefined, row: { colorHex: string; fillColorHex?: string; borderColorHex?: string }) => ({
    ...(upTo === undefined ? {} : { upTo }),
    fill: split ? row.fillColorHex ?? bars?.fillHex ?? row.colorHex : row.colorHex,
    ...(split ? { border: row.borderColorHex ?? bars?.borderHex ?? CHART_DEFAULT_BAR_BORDER_HEX } : {}),
  });
  const pieces = [
    ...sorted.map((b) => piece(b.upTo, b)),
    piece(undefined, {
      colorHex: above,
      ...(layer.bandAboveFillColorHex === undefined ? {} : { fillColorHex: layer.bandAboveFillColorHex }),
      ...(layer.bandAboveBorderColorHex === undefined ? {} : { borderColorHex: layer.bandAboveBorderColorHex }),
    }),
  ];
  return html`<div class=${split ? "bands split" : "bands"}>
    ${bandBar(pieces, now ?? (typeof value === "object" ? value : undefined))}
    ${!split || sorted.length === 0 ? nothing : html`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${sorted.map((b, i) => html`
      <div class="band-row ${hit === b.id ? "hit" : ""}">
        <span class="range">${i === 0
          ? html`<span class="le">Less than</span>${endBox(i, "Less than")}`
          : html`${endBox(i - 1, "From")}<span class="to">to</span>${endBox(i, "Up to")}`}</span>
        ${colors(`Up to ${b.upTo}`, b,
          (v) => set(band(b.id, (x) => { x.colorHex = v; }), `bcol${b.id}`),
          (v) => set(band(b.id, (x) => { if (v === undefined) delete x.fillColorHex; else x.fillColorHex = v; }), `bfill${b.id}`),
          (v) => set(band(b.id, (x) => { if (v === undefined) delete x.borderColorHex; else x.borderColorHex = v; }), `bborder${b.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${() => set((p) => { p.bands = p.bands.filter((x) => x.id !== b.id); })}>${uiIcon("close")}</button>
      </div>`)}
    <div class="band-row ${hit === "above" ? "hit" : ""}">${resetButton(aboveBack)}
      <span class="range">${sorted.length === 0
        ? html`<span class="else">Every value</span>`
        : html`<span class="le">Greater than</span>${endBox(sorted.length - 1, "Greater than")}`}</span>
      ${colors("Above the last band",
        { colorHex: above,
          ...(layer.bandAboveFillColorHex === undefined ? {} : { fillColorHex: layer.bandAboveFillColorHex }),
          ...(layer.bandAboveBorderColorHex === undefined ? {} : { borderColorHex: layer.bandAboveBorderColorHex }) },
        (v) => set((p) => { p.bandAboveColorHex = v; }, "babove"),
        (v) => set((p) => { if (v === undefined) delete p.bandAboveFillColorHex; else p.bandAboveFillColorHex = v; }, "bafill"),
        (v) => set((p) => { if (v === undefined) delete p.bandAboveBorderColorHex; else p.bandAboveBorderColorHex = v; }, "baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${() => set((p) => { p.bands = [...p.bands, nextBand(p.bands, ownColorHex)]; })}>+ Band</button>
  </div>`;
}

/** A layer that colors by state rather than by value: the timeline. */
interface StateBandedLayer {
  bands: TimelineBand[];
  otherColorHex: string;
}

/**
 * The rows of a timeline's color table, the button that adds one, and the
 * color a state no row named takes.
 *
 * A sibling of `bandTableFields` rather than the same function: a chart's row
 * says where a number stops and a timeline's says which word it is, so the two
 * share their shape and nothing else.
 */
/** The states a timeline's color table can offer instead of a blank box: what
 * the recorder saw in the span (longest first), the entity's state right now,
 * then the words its domain is known to report. Case-insensitive, first
 * spelling wins, and the two no-reading states always come last. */
function timelineKnownStates(samples: readonly TimelineSample[], spanSeconds: number, live: string | undefined, domain: string | undefined): string[] {
  const time = new Map<string, number>();
  const spelling = new Map<string, string>();
  const note = (state: string, seconds: number) => {
    const s = state.trim();
    if (s === "") return;
    const k = s.toLowerCase();
    if (!spelling.has(k)) spelling.set(k, s);
    time.set(k, (time.get(k) ?? 0) + seconds);
  };
  samples.forEach((s, i) => {
    const next = samples[i + 1];
    const end = next === undefined ? spanSeconds : next.offsetSeconds;
    note(s.state, Math.max(0, end - s.offsetSeconds));
  });
  if (live !== undefined) note(live, 0);
  (TIMELINE_DOMAIN_STATES[domain ?? ""] ?? []).forEach((w) => note(w, 0));
  const noReading = ["unavailable", "unknown"];
  const seen = [...time.entries()]
    .filter(([k]) => !noReading.includes(k))
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => spelling.get(k) ?? k);
  return [...seen, ...noReading];
}

/** The switch that turns one strip into a merged one.
 *
 * Turning it on seeds the list with whatever entity the layer already names,
 * plus a blank row for the second, and rewrites the color table for the two
 * states a merge answers in: the server sends `on` and `off` whatever the
 * entities are, so a table of `open` and `closed` would match nothing. A table
 * that already names `on` is left alone, edits and all.
 *
 * Turning it off drops the list and leaves everything else where it is. The
 * layer's `value` still names the first entity, so the strip goes back to
 * being that one entity's own.
 */
function timelineGroupSwitch(
  t: TimelineElement,
  set: (mutate: (p: TimelineElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  return checkField("Combine several entities", t.aggregate !== undefined, (on) => set((p) => {
    if (!on) {
      delete p.aggregate;
      return;
    }
    const first = p.value.kind.kind === "entityState" ? p.value.kind.entityId : "";
    const entities = first === "" ? [] : [first];
    p.aggregate = { entities, combine: TIMELINE_DEFAULT_COMBINE };
    if (!p.bands.some((b) => b.match.trim().toLowerCase() === "on")) {
      p.bands = seedTimelineBands(TIMELINE_AGGREGATE_SEED_DOMAIN);
    }
  }, `tagg${key}`));
}

/** The entity list, the Any / All control and what the two of them mean.
 *
 * The first row is the layer's `value` as well as the group's first entity:
 * the two are written together on every edit, so an app that predates the
 * `aggregate` key draws that one entity's strip rather than nothing.
 */
function timelineGroupFields(
  host: EditorHost,
  t: TimelineElement,
  set: (mutate: (p: TimelineElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const rows = timelineAggregateRows(t);
  const named = timelineAggregateEntities(t);
  const combine = t.aggregate?.combine ?? TIMELINE_DEFAULT_COMBINE;
  const full = rows.length >= TIMELINE_MAX_AGGREGATE_ENTITIES;

  /** Write the list back, and the first entity into `value` with it. */
  const writeRows = (p: TimelineElement, next: string[]) => {
    p.aggregate = { entities: next, combine: p.aggregate?.combine ?? TIMELINE_DEFAULT_COMBINE };
    const first = next.find((id) => id.trim() !== "") ?? "";
    if (first !== "") {
      p.value = { ...p.value, kind: { kind: "entityState", ...entityRefFrom(host.hass.states, first) } };
    }
  };

  return html`
    ${rows.map((entityId, i) => html`
      <div class="row-inline">
        ${entityField(host, `Entity ${i + 1}`, entityRefFrom(host.hass.states, entityId),
          (ref) => set((p) => {
            const next = timelineAggregateRows(p);
            next[i] = ref.entityId;
            writeRows(p, next);
          }, `tagge${key}-${i}`), `${key}-agg-${i}`, { needed: entityId === "", clearable: rows.length <= TIMELINE_MIN_AGGREGATE_ENTITIES })}
        ${rows.length > TIMELINE_MIN_AGGREGATE_ENTITIES
          ? html`<button class="icon" title="Remove this entity" aria-label="Remove this entity"
              @click=${() => set((p) => {
                writeRows(p, timelineAggregateRows(p).filter((_, j) => j !== i));
              })}>${uiIcon("close")}</button>`
          : nothing}
      </div>`)}
    <button class="small" ?disabled=${full}
      title=${full
        ? `A timeline merges at most ${TIMELINE_MAX_AGGREGATE_ENTITIES} entities`
        : "Add another entity to this strip"}
      @click=${() => set((p) => { writeRows(p, [...timelineAggregateRows(p), ""]); })}>Add entity</button>
    ${segField("Combine", combine, TIMELINE_COMBINES, (v: TimelineCombine) => set((p) => {
      p.aggregate = { entities: timelineAggregateRows(p), combine: v };
    }), { titles: {
        any: "On while at least one of them is active",
        all: "On only while every one of them is active",
      }, def: TIMELINE_DEFAULT_COMBINE })}
    <div class="hint">${timelineCombineHint(combine)}. Home Assistant reads a door as open, a
      person as home, a lock as unlocked and a washer as running, so one switch answers all of
      them.</div>
    ${named.length < TIMELINE_MIN_AGGREGATE_ENTITIES
      ? html`<div class="hint warn">Name at least ${TIMELINE_MIN_AGGREGATE_ENTITIES} entities, or turn
        the switch off and draw the one entity's own states.</div>`
      : nothing}
    ${timelineAggregateOverCap(t)
      ? html`<div class="hint warn">A timeline merges at most ${TIMELINE_MAX_AGGREGATE_ENTITIES}
        entities, and this one names ${named.length}. Remove ${named.length - TIMELINE_MAX_AGGREGATE_ENTITIES}
        of them: until then the strip asks the recorder nothing and draws nothing.</div>`
      : nothing}
    <div class="hint">One strip for all of them: Home Assistant merges their recorded pasts into a
      single run of on and off. The color table below reads those two words, whatever domain the
      entities are from.</div>`;
}

function timelineBandFields(
  layer: StateBandedLayer,
  set: (mutate: (p: StateBandedLayer) => void, k?: string) => void,
  knownStates: readonly string[] = [],
  listId = "wa-timeline-states",
): TemplateResult {
  const taken = new Set(layer.bands.map((b) => b.match.trim().toLowerCase()));
  const nextState = knownStates.find((s) => !taken.has(s.toLowerCase())) ?? "";
  return html`
    ${layer.bands.map((band, i) => html`
      <div class="row-inline">
        ${textField("State", band.match,
          (v) => set((p) => { const b = p.bands[i]; if (b) b.match = v; }, `tmatch${band.id}`), { placeholder: "on", list: listId })}
        ${colorField("Color", band.colorHex,
          (v) => set((p) => { const b = p.bands[i]; if (b) b.colorHex = v ?? TIMELINE_DEFAULT_OTHER_HEX; }, `tcol${band.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${() => set((p) => { p.bands = p.bands.filter((_, j) => j !== i); })}>${uiIcon("close")}</button>
      </div>`)}
    <datalist id=${listId}>${knownStates.map((s) => html`<option value=${s}></option>`)}</datalist>
    <button class="small" @click=${() => set((p) => {
      p.bands = [...p.bands, { id: newId(), match: nextState, colorHex: timelineStateColor(nextState) }];
    })}>${nextState === "" ? "Add state" : `Add ${nextState}`}</button>
    ${colorField("Otherwise", layer.otherColorHex,
      (v) => set((p) => { p.otherColorHex = v ?? TIMELINE_DEFAULT_OTHER_HEX; }, "tother"), false, TIMELINE_DEFAULT_OTHER_HEX)}`;
}

/** The line width a gauge takes when it becomes a needle dial: the pointer's
 * width, thin enough to point. */
const NEEDLE_LINE_WIDTH = 2;

const GAUGE_STYLES: [GaugeStyle, string][] = [
  ["arc", "Arc"], ["ring", "Ring"], ["bar", "Bar"], ["dots", "Dots"], ["needle", "Needle"],
];
const GAUGE_STYLE_TITLES: Record<string, string> = {
  arc: "A 270° arc, open at the bottom",
  ring: "A full circle",
  bar: "A straight bar",
  dots: "One dot per unit, the first few filled",
  needle: "A dial with a pointer at the reading",
};

/** The Total a dot gauge starts with.
 *
 * "3 of 8 lights on" is two counts over one scope, so the useful total is the
 * reading's own aggregate with its state filter dropped. The compiler dedupes by
 * expression, so the pair costs one extra line of the template and no extra
 * request. Anything that is not an aggregate falls back to the range it had. */
function seedGaugeTotal(g: GaugeElement): Value {
  const kind = g.value.kind;
  if (kind.kind === "aggregate") {
    const { stateFilter: _dropped, ...rest } = kind.aggregate;
    return { kind: { kind: "aggregate", aggregate: { ...rest, function: "count" } } };
  }
  return literal(String(Math.max(1, Math.round(g.maxValue - g.minValue))));
}

const TIME_FIELDS: [TimeField, string][] = [
  ["now", "Time (14:05)"], ["hour", "Hour"], ["minute", "Minute"], ["weekday", "Day of the week (0 is Monday)"], ["day", "Day of the month"], ["month", "Month number"], ["timestamp", "Unix timestamp (seconds)"],
];

/** A template every house can render: how many lights are on, said in words
 * behind a bulb. With no lights at all it prints "💡 0 Lights On" rather than
 * failing. The bulb is an emoji because a text layer's template is one string
 * and has no symbol slot of its own. */
export const STARTER_TEMPLATE = "💡 {{ states.light | selectattr('state', 'eq', 'on') | list | count }} Lights On";

/**
 * A template to start from that renders on any Home Assistant, so a new
 * Template reads something on its first draw instead of the `unknown` a
 * made-up `sensor.example` gives.
 *
 * It reads the entity the value already names, then `prefer` (an entity
 * picked earlier, or the layer's tap), and otherwise counts the lights that
 * are on (Jesse, 2026-09-23).
 */
export function starterTemplate(current: ValueKind, prefer?: EntityRef): string {
  const own = "entityId" in current && current.entityId !== "" ? current.entityId : undefined;
  const id = own ?? (prefer?.entityId || undefined);
  return id === undefined ? STARTER_TEMPLATE : `{{ states('${id}') }}`;
}

function switchKind(current: ValueKind, kind: ValueKind["kind"]): ValueKind {
  const ref: EntityRef = "entityId" in current ? { entityId: current.entityId, displayName: current.displayName, domain: current.domain } : { entityId: "", displayName: "", domain: "" };
  switch (kind) {
    case "literal": return { kind, value: current.kind === "literal" ? current.value : "" };
    case "entityState": return { kind, ...ref };
    case "entityAttribute": return { kind, ...ref, attribute: "" };
    case "entityAge": return { kind, ...ref };
    case "aggregate": return { kind, aggregate: { function: "count", scope: { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] }, stateFilter: { kind: "isOn" } } };
    case "time": return { kind, timeField: "now" };
    case "dataAge": return { kind };
    case "jinja": return { kind, value: current.kind === "jinja" ? current.value : starterTemplate(current) };
    case "named": return { kind, id: "" };
    case "chartStat": return { kind, layer: "", stat: "latest" };
    case "item": return { kind, field: current.kind === "item" ? current.field : "" };
    case "listStat": return { kind, layer: "", stat: "count" };
    case "imageTime": return { kind, layer: "" };
  }
}

export interface ValueEditorOptions {
  /** Named values are not offered inside a named value (no self reference). */
  allowNamed?: boolean;
  /** Leave out Make shared, for a value that has to name an entity itself
   * (a chart's readings, a timeline's states). */
  noShare?: boolean;
  /** Hide the format section (icon symbols, colors). */
  noFormat?: boolean;
  /** Show the live resolved value. */
  showResolved?: boolean;
  /** Resolve this instead of the edited value for Now. A shared value's editor
   * passes a reference to itself, which is how every layer reads it. */
  resolveAs?: Value;
  /** Fixed text is an SF Symbol name, so offer the picker instead of a plain field. */
  symbol?: boolean;
  /** Where the picker puts a Material Design icon's SVG path, and undefined
   * when the pick was an SF Symbol. Given only by the icon layer: it is the one
   * place with a `path` key to write. Without it the picker stays SF-only. */
  setSymbolPath?: (d: string | undefined) => void;
  /** Undo coalescing key prefix. */
  key: string;
  /** What this value is for, shown beside the chip. */
  label?: string;
  /** Draw the whole form in place instead of behind a chip. For the one screen
   * where the value is the entire subject (a named value's own editor). */
  inline?: boolean;
  /** Drop the label line and tighten the chip, for a states table cell where
   * the column heading has already said what the value is for. */
  compact?: boolean;
  /** Drop the label line but keep the full-size chip, for a field whose own
   * title line already names the value. The label still titles the popover. */
  noLabel?: boolean;
}

/**
 * A value, as one line that says what it is, with the full form a click away.
 *
 * The form underneath is unchanged: a source, a body for that source and a
 * format panel. What changed is that it no longer costs a screen of space to
 * say "the kitchen light". Six of these can sit in one rule and still be read
 * at a glance.
 */
export function valueEditor(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  if (opts.inline || !popoverSupported()) return html`<div class="value-editor">${valueForm(host, value, set, opts)}</div>`;

  const id = popoverId(opts.key);
  const label = opts.label ?? "Value";
  const resolved = opts.showResolved ? host.resolve(value) : undefined;
  const summary = describeValue(value, describeContext(host));
  // A chip whose summary is an entity's name says so in the entity color. A
  // typed-in number or a template is the author's own words and stays ink.
  const namesEntity = "entityId" in value.kind;
  return html`<div class="field value-chip-field ${opts.compact ? "compact" : ""}">
    ${opts.compact || opts.noLabel ? nothing : html`<span>${label}</span>`}
    <button type="button" class="value-chip ${opts.compact ? "chip-cell" : ""}" popovertarget=${id} aria-haspopup="dialog" title=${`${label}: ${summary}. Click to change it.`}>
      <span class="chip-text ${namesEntity ? "ent-tok" : ""}">${summary}</span>
      ${resolved === undefined ? nothing : html`<span class="chip-now mono" title="Value right now">${resolved}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${valuePopover(host, id, label, value, set, opts)}
  </div>`;
}

/** The popover half of a value chip, on its own so a states table can hang one
 * off a plain number input's "…" button without also drawing a chip. */
function valuePopover(host: EditorHost, id: string, label: string, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  return html`<div class="value-pop" id=${id} popover role="dialog" aria-label=${label} @toggle=${onValuePopoverToggle}>
    <div class="pop-head">
      <b>${label}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${id} popovertargetaction="hide">Done</button>
    </div>
    ${openedPopovers.has(id) ? valueForm(host, value, set, opts) : nothing}
  </div>`;
}

/** The named values and live states `describeValue` reads to put names where
 * ids would otherwise be. */
export function describeContext(host: EditorHost): DescribeContext {
  return { values: host.config.values, hass: host.hass, elements: host.config.elements };
}

function popoverId(key: string): string {
  return `wa-pop-${key.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * The popover is what lets the form escape the inspector's scrolling card, and
 * it brings Escape, click-outside and focus return with it for free. A browser
 * old enough to lack it falls back to the form drawn in place, which is what
 * the editor did before: more scrolling, nothing broken.
 */
function popoverSupported(): boolean {
  return typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";
}

/**
 * Which popovers are open right now.
 *
 * The body of a closed popover is never built. It saves the inspector from
 * laying out a dozen full value forms (and, for icons, a dozen symbol grids)
 * that nobody has asked to see, and it is why the chip is cheaper than the
 * inline form it replaced rather than merely tidier.
 */
const openedPopovers = new Set<string>();

/** Popovers being kept under their chip while the page scrolls. */
const popoverTrackers = new WeakMap<HTMLElement, () => void>();

/**
 * The control a popover belongs under.
 *
 * Found by the `popovertarget` that opened it rather than by the class of the
 * chip, so a table cell, a row's "…" button and the original value chip all
 * position the same way. Where two controls share one popover (a plain number
 * input beside its "…" button) the first in document order wins, which is the
 * one the user is looking at.
 */
function anchorFor(pop: HTMLElement): HTMLElement | null {
  const root = pop.getRootNode();
  const scope = root instanceof ShadowRoot || root instanceof Document ? root : pop.ownerDocument;
  return scope.querySelector<HTMLElement>(`[popovertarget="${pop.id}"]`);
}

/**
 * Open a popover that does not exist yet.
 *
 * Filling an empty cell writes the change and then wants the form for it, but
 * the button carrying the popover is only built by the redraw that the edit
 * causes. Two frames is enough for lit to have rendered it; failing to find it
 * simply leaves the cell filled with its default, which is still a step
 * forward rather than an error.
 *
 * `focus` also puts the caret in the form's first text box, for a new rich
 * text part whose first job is to be typed into or pointed at an entity.
 */
function openPopoverSoon(node: EventTarget | null, id: string, focus = false): void {
  const start = node instanceof Node ? node : null;
  if (!start) return;
  const root = start.getRootNode();
  if (!(root instanceof ShadowRoot) && !(root instanceof Document)) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (el && typeof el.showPopover === "function" && !el.matches(":popover-open")) el.showPopover();
    // The form is only drawn by the redraw that opening the popover causes,
    // so the box to type into is looked for a little later still.
    if (el && focus) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.querySelector<HTMLElement>("textarea, input[type=text], input[type=search], input:not([type])")?.focus();
      }));
    }
  }));
}

function onValuePopoverToggle(e: Event): void {
  const pop = e.currentTarget as HTMLElement;
  const opening = (e as Event & { newState?: string }).newState === "open";
  const stop = popoverTrackers.get(pop);
  if (stop) { stop(); popoverTrackers.delete(pop); }
  if (!opening) {
    if (openedPopovers.delete(pop.id)) requestRerender(pop);
    return;
  }

  const anchor = anchorFor(pop);
  if (!anchor) return;
  const track = () => {
    if (!pop.isConnected || !pop.matches(":popover-open")) { popoverTrackers.get(pop)?.(); popoverTrackers.delete(pop); return; }
    // Following a chip that has scrolled out of the card would leave the form
    // floating over unrelated content, so it closes with it instead.
    const a = anchor.getBoundingClientRect();
    if (a.bottom < 0 || a.top > window.innerHeight) { pop.hidePopover(); return; }
    positionPopover(pop, a);
  };
  window.addEventListener("scroll", track, true);
  window.addEventListener("resize", track);
  popoverTrackers.set(pop, () => {
    window.removeEventListener("scroll", track, true);
    window.removeEventListener("resize", track);
  });

  positionPopover(pop, anchor.getBoundingClientRect());
  if (!openedPopovers.has(pop.id)) {
    openedPopovers.add(pop.id);
    requestRerender(pop);
    // The form only exists after that redraw, so measure once it does.
    requestAnimationFrame(() => { if (pop.isConnected) positionPopover(pop, anchor.getBoundingClientRect()); });
  }
}

function positionPopover(pop: HTMLElement, anchor: DOMRect): void {
  // Measured without the last placement's ceiling, so a form that was squeezed
  // once is not treated as short for ever.
  pop.style.maxHeight = "";
  const box = pop.getBoundingClientRect();
  const at = placePopover(
    { left: anchor.left, top: anchor.top, bottom: anchor.bottom, width: anchor.width },
    { width: box.width, height: box.height },
    { width: window.innerWidth, height: window.innerHeight },
  );
  pop.style.left = `${at.left}px`;
  pop.style.top = `${at.top}px`;
  pop.style.maxHeight = `${at.maxHeight}px`;
}

export interface AnchorBox { left: number; top: number; bottom: number; width: number }
export interface PopoverPlacement { left: number; top: number; maxHeight: number; above: boolean }

/** How far a popover stays from the edge of the window. */
const POPOVER_MARGIN = 8;
/** Gap between the chip and its popover. */
const POPOVER_GAP = 6;
/** The least height a popover is given, even where the window leaves less. */
const POPOVER_MIN_HEIGHT = 140;

/**
 * Where a popover goes under its chip.
 *
 * Under the chip by default, above it whenever it does not fit below and there
 * is more room above, and always inside the window: a chip near the right edge
 * of a narrow inspector would otherwise open a form half off screen.
 *
 * It used to flip only once the room below fell under `POPOVER_MIN_HEIGHT`, so
 * a tall menu under a chip near the bottom opened as a sliver two rows high
 * with a page of empty window above it (the tap menu, 2026-09-23). The popover
 * itself sits in the top layer, so nothing an ancestor does with `overflow`
 * can clip it, which is the reason these are window coordinates.
 */
export function placePopover(anchor: AnchorBox, size: { width: number; height: number }, viewport: { width: number; height: number }): PopoverPlacement {
  const below = viewport.height - anchor.bottom - POPOVER_GAP - POPOVER_MARGIN;
  const above = anchor.top - POPOVER_GAP - POPOVER_MARGIN;
  const flip = size.height > below && above > below;
  const room = Math.max(POPOVER_MIN_HEIGHT, flip ? above : below);
  const height = Math.min(size.height, room);
  const left = Math.max(POPOVER_MARGIN, Math.min(anchor.left, viewport.width - size.width - POPOVER_MARGIN));
  const top = flip
    ? Math.max(POPOVER_MARGIN, anchor.top - POPOVER_GAP - height)
    : Math.max(POPOVER_MARGIN, Math.min(anchor.bottom + POPOVER_GAP, viewport.height - height - POPOVER_MARGIN));
  return { left, top, maxHeight: room, above: flip };
}

/**
 * The sources this value may read, for the Source picker.
 *
 * Two of them only exist in a place: Item field means nothing outside a row
 * being drawn, and List count means nothing in a document with no list. Both
 * still show while the value already holds one, so a value that came in from a
 * shared document is never a picker with a blank selection.
 *
 * Picture time is never offered: a picture's Timestamp button makes the one
 * layer that needs it, and picked by hand it read as a strange choice among
 * the others (Jesse, 2026-09-23). It stays listed only on a value that holds it.
 */
export function valueKindsFor(host: EditorHost, kind: ValueKind, opts: ValueEditorOptions): [ValueKind["kind"], string][] {
  const out = VALUE_KINDS.filter(([k]) => opts.allowNamed !== false || k !== "named");
  if (host.rowEditListId !== undefined || kind.kind === "item") out.push(["item", "Item field"]);
  const lists = host.config.elements.some((e) => e.kind === "list");
  if (lists || kind.kind === "listStat") out.push(["listStat", "List count"]);
  if (kind.kind === "imageTime") out.push(["imageTime", "Picture time"]);
  return out;
}

/** The pictures a Picture time value can read: every camera or entity picture
 * layer, which the watch fetches and so has a time for. An uploaded picture
 * never is. */
export function timedPictures(elements: readonly CElement[]): Extract<CElement, { kind: "image" }>[] {
  return elements.filter((e): e is Extract<CElement, { kind: "image" }> => e.kind === "image" && e.payload.source !== "inline");
}

function valueForm(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  const k = value.kind;
  const setKind = (kind: ValueKind) => set({ ...value, kind });
  const body = valueBody(host, value, set, opts);
  const kindHint = VALUE_KIND_HINTS[k.kind];
  return html`
    ${groupedSelectField("Source", k.kind, valueKindGroups(host, k, opts), (kind) => setKind(switchKind(k, kind)))}
    ${kindHint ? html`<div class="hint">${kindHint}</div>` : nothing}
    ${body}
    ${canShare(value, opts) ? html`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${() => makeShared(host, value, set)}>Make shared</button>
      so other layers can read this too.</div>` : nothing}
    ${opts.noFormat ? nothing : formatEditor(value.format, (f) => set(formatIsEmpty(f) ? { kind: value.kind } : { ...value, format: f }), formatFits(sourceKind(host, value)))}
    ${opts.showResolved ? nowReadout(host, value, host.resolve(opts.resolveAs ?? value)) : nothing}`;
}

/** The rows one source needs under the Source picker: a box to type in, an
 * entity, a chart to read. Shared by the value form and the inline source
 * editor, so a source is edited the same way wherever it is picked. */
function valueBody(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult | typeof nothing {
  const k = value.kind;
  const setKind = (kind: ValueKind) => set({ ...value, kind });
  const key = opts.key;
  let body: TemplateResult | typeof nothing = nothing;
  switch (k.kind) {
    case "literal":
      body = opts.symbol
        ? symbolField(host, k.value, (v) => setKind({ ...k, value: v }), key, opts.setSymbolPath)
        : textField("Text", k.value, (v) => setKind({ ...k, value: v }));
      break;
    case "entityState":
    case "entityAge":
      body = entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), `${key}-entity`);
      break;
    case "entityAttribute": {
      const attrs = Object.keys(host.hass.states[k.entityId]?.attributes ?? {}).sort();
      const listId = `wa-attrs-${key.replace(/[^a-z0-9]/gi, "")}`;
      body = html`${entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), `${key}-entity`)}
        ${textField("Attribute", k.attribute, (v) => setKind({ ...k, attribute: v }), { list: listId, mono: true })}
        <datalist id=${listId}>${attrs.map((a) => html`<option value=${a}></option>`)}</datalist>`;
      break;
    }
    case "aggregate":
      body = aggregateEditor(host, k.aggregate, (a) => setKind({ ...k, aggregate: a }), key);
      break;
    case "time":
      body = selectField("Field", k.timeField, TIME_FIELDS, (v) => setKind({ ...k, timeField: v }));
      break;
    case "dataAge":
      break;
    case "jinja":
      body = html`${textArea("Template", k.value, (v) => setKind({ ...k, value: v }), 4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;
      break;
    case "named": {
      const named = host.config.values.find((n) => n.id === k.id);
      const uses = named ? sharedValueUses(host.config, named.id) : 0;
      body = host.config.values.length === 0
        ? html`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${() => startShared(host, value, set)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`
        : html`${selectField("Value", k.id, [["", "(choose)"], ...host.config.values.map((n): [string, string] => [n.id, n.name || n.id.slice(0, 8)])], (v) => setKind({ ...k, id: v }))}
          ${named ? html`<div class="hint keep">Read by ${uses} ${uses === 1 ? "layer" : "layers"}.
            <button type="button" class="link" @click=${() => host.selectValue(named.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${() => { const copy = unsharedCopy(host.config, value); if (copy) set(copy); }}>stop sharing</button>
            to give this one its own copy.</div>` : nothing}`;
      break;
    }
    case "chartStat": {
      const ctx = describeContext(host);
      const charts = host.config.elements.filter((e): e is Extract<CElement, { kind: "chart" }> => e.kind === "chart");
      body = charts.length === 0
        ? html`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`
        : html`
          ${selectField("Chart", k.layer, [["", "(choose)"], ...charts.map((c): [string, string] => [c.payload.id, layerTitle(c, ctx)])], (v) => setKind({ ...k, layer: v }))}
          ${selectField("Number", k.stat, [...CHART_STATS], (v) => setKind({ ...k, stat: v }))}
          <div class="hint">${k.stat === "top" || k.stat === "bottom"
            ? "One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given."
            : "Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;
      break;
    }
    case "item":
      body = itemFieldFields(host, k, (next) => setKind(next), key);
      break;
    case "listStat": {
      const ctx = describeContext(host);
      const lists = host.config.elements.filter((e): e is Extract<CElement, { kind: "list" }> => e.kind === "list");
      body = lists.length === 0
        ? html`<div class="hint warn">There is no list layer yet. Add one first, then this can print how many rows it drew.</div>`
        : html`
          ${selectField("List", k.layer, [["", "(choose)"], ...lists.map((l): [string, string] => [l.payload.id, layerTitle(l, ctx)])], (v) => setKind({ ...k, layer: v }))}
          ${selectField("Number", k.stat, [...LIST_STATS], (v) => setKind({ ...k, stat: v }))}
          <div class="hint">${k.stat === "total"
            ? "How many items there were before the list took the first few. Use it for \"4 of 12\"."
            : "How many rows the list actually drew. Use it for a header above the list, or a rule that shows an empty state when it is 0."}</div>`;
      break;
    }
    case "imageTime": {
      const ctx = describeContext(host);
      const pictures = timedPictures(host.config.elements);
      body = pictures.length === 0
        ? html`<div class="hint warn">There is no camera or entity picture layer yet. Add one first, then this can print when it was fetched.</div>`
        : html`
          ${selectField("Picture", k.layer, [["", "(choose)"], ...pictures.map((p): [string, string] => [p.payload.id, layerTitle(p, ctx)])], (v) => setKind({ ...k, layer: v }))}
          <div class="hint">When the watch last fetched the picture, as unix seconds. Set Timestamp, under Format, to print it as a time. The watch draws nothing until the picture has been fetched.</div>`;
      break;
    }
  }
  return body;
}

// ── Inline source editor ─────────────────────────────────────────────────
//
// A text's value drawn in its own card instead of behind a chip. Text is the
// whole job of a text layer, so the three ways people fill one nearly every
// time sit on a row of buttons, and what each needs sits right under it: a box
// to type in, an entity search, a clock field. The rarer sources wait behind
// More, in the same menu the tap actions use, each with a line saying what it
// gives. The popover form it replaces cost a click to type one word, and its
// Source list was the browser's own grey menu.

/** The four buttons of an inline value. Template got the third button over
 * the clock: it is the one people reach for when Entity is not enough, and
 * the clock is a quick pick from More (Jesse, 2026-09-23). */
export type SourceTab = "text" | "entity" | "template" | "more";

/** Which button a source sits behind. */
export function sourceTab(kind: ValueKind["kind"]): SourceTab {
  switch (kind) {
    case "literal": return "text";
    case "entityState":
    case "entityAttribute":
    case "entityAge": return "entity";
    case "jinja": return "template";
    default: return "more";
  }
}

const SOURCE_TABS: [Exclude<SourceTab, "more">, string, UiIconName, string][] = [
  ["text", "Text", "text", "Words or a number you type. It never changes."],
  ["entity", "Entity", "home", "A live reading from one Home Assistant entity"],
  ["template", "Template", "braces", "A Jinja template Home Assistant renders, for anything one entity cannot give"],
];

/** Everything behind More, in the order people reach for them. `short` is what
 * the More button says while one of them is picked. */
const MORE_SOURCES: { kind: ValueKind["kind"]; name: string; short: string; icon: UiIconName; info: string }[] = [
  { kind: "time", name: "Clock and date", short: "Clock", icon: "clock", info: "The time or the date, read on the watch." },
  { kind: "aggregate", name: "Several entities combined", short: "Combined", icon: "layers", info: "Count them, or take the sum, average, lowest or highest." },
  { kind: "chartStat", name: "Number from a chart", short: "Chart number", icon: "chart", info: "The latest, lowest, highest or average reading of a chart layer." },
  { kind: "dataAge", name: "Time since last refresh", short: "Refresh age", icon: "reset", info: "Seconds since the watch last fetched values." },
  { kind: "named", name: "Shared value", short: "Shared", icon: "link", info: "One value several layers read, changed in one place." },
  { kind: "listStat", name: "List count", short: "List count", icon: "list", info: "How many rows a list layer drew." },
  { kind: "item", name: "Item field", short: "Item field", icon: "list", info: "One field of the list row being drawn." },
  { kind: "imageTime", name: "Picture time", short: "Picture time", icon: "imageTime", info: "When the watch last fetched a picture layer." },
];

const ENTITY_READS: [Extract<ValueKind["kind"], "entityState" | "entityAttribute" | "entityAge">, string][] = [
  ["entityState", "State"],
  ["entityAttribute", "Attribute"],
  ["entityAge", "Last changed"],
];
const ENTITY_READ_TITLES: Partial<Record<ValueKind["kind"], string>> = {
  entityState: "What Home Assistant shows for it, like 21.5 or on",
  entityAttribute: "One detail it carries besides its state, like a light's brightness",
  entityAge: "Time since its state last changed",
};

const EMPTY_REF: EntityRef = { entityId: "", displayName: "", domain: "" };

/**
 * What each button last held, per value, so a trip from Text to Entity and
 * back brings the typed words back. Kept for the session only; undo covers
 * everything past that. Keyed by button for the first three and by source
 * behind More, so each of those remembers its own setup too.
 */
const sourceMemory = new Map<string, Partial<Record<string, ValueKind>>>();

function memorySlot(kind: ValueKind["kind"]): string {
  const tab = sourceTab(kind);
  return tab === "more" ? kind : tab;
}

export interface SourceEditorOptions {
  /** Undo coalescing key prefix, and the name the memory and focus go by. */
  key: string;
  /** Title of the row of buttons. */
  label?: string;
  /** Where a picked entity goes. A plain text layer passes one that points
   * its tap at the entity too; without it only this value changes. */
  onEntity?: (ref: EntityRef) => void;
  /** The entity the Entity button starts on, such as the one the layer's tap
   * already names, so switching to it is not always an empty search. */
  defaultEntity?: EntityRef;
}

/**
 * A value as a row of buttons (Text, Entity, Clock, More) with the rows the
 * chosen one needs under it, then the live reading and the Format fold.
 *
 * Moving between buttons remembers what each held (see `sourceMemory`), and
 * lands the caret where the next thing to do is: the words box for Text, the
 * search for an Entity not yet picked.
 */
export function sourceEditor(host: EditorHost, value: Value, set: (v: Value) => void, opts: SourceEditorOptions): TemplateResult {
  const k = value.kind;
  const key = opts.key;
  const tab = sourceTab(k.kind);
  const setKind = (kind: ValueKind) => set({ ...value, kind });
  const valueOpts: ValueEditorOptions = { key, showResolved: true };
  const allowed = new Set(valueKindsFor(host, k, valueOpts).map(([kind]) => kind));
  // Picture time stays off the menu even on the layer that holds it; the
  // More button still names it there. See `valueKindsFor`.
  const more = MORE_SOURCES.filter((m) => allowed.has(m.kind) && m.kind !== "imageTime");
  const picked = MORE_SOURCES.find((m) => m.kind === k.kind);

  const go = (next: ValueKind, node: EventTarget | null) => {
    sourceMemory.set(key, { ...sourceMemory.get(key), [memorySlot(k.kind)]: k });
    setKind(next);
    if (next.kind === "literal") focusSourceSoon(node, key, "input[type=text]");
    else if (next.kind === "jinja") focusSourceSoon(node, key, "textarea");
    else if ("entityId" in next && next.entityId === "") focusSourceSoon(node, key, ".ent-box input");
  };
  const toTab = (to: Exclude<SourceTab, "more">, node: EventTarget | null) => {
    if (to === tab) return;
    const kept = sourceMemory.get(key)?.[to];
    if (kept) go(kept, node);
    else if (to === "text") go({ kind: "literal", value: "" }, node);
    else if (to === "entity") go({ kind: "entityState", ...(opts.defaultEntity ?? EMPTY_REF) }, node);
    else {
      // An entity picked earlier under Entity is the one this value is about.
      const earlier = sourceMemory.get(key)?.entity;
      const prefer = earlier && "entityId" in earlier && earlier.entityId !== "" ? earlier : opts.defaultEntity;
      go({ kind: "jinja", value: starterTemplate(k, prefer) }, node);
    }
  };
  const pickMore = (kind: ValueKind["kind"], node: EventTarget | null) => {
    if (kind === k.kind) return;
    go(sourceMemory.get(key)?.[kind] ?? switchKind(k, kind), node);
  };

  const moreId = popoverId(`${key}-more`);
  const label = opts.label ?? "Shows";
  const tabs = html`<div class="field seg-field src-field"><span>${label}</span>
    <div class="seg wide src-tabs" role="radiogroup" aria-label=${label}>
      ${SOURCE_TABS.map(([t, name, icon, title]) => html`<button type="button" role="radio" aria-checked=${t === tab ? "true" : "false"}
        class=${t === tab ? "on" : ""} title=${title} @click=${(e: Event) => toTab(t, e.currentTarget)}>${uiIcon(icon)}<span>${name}</span></button>`)}
      <button type="button" role="radio" aria-checked=${tab === "more" ? "true" : "false"} class=${tab === "more" ? "on" : ""}
        popovertarget=${moreId} aria-haspopup="menu"
        title=${picked ? `${picked.name}. Click to pick another source.` : "The clock, charts, shared values and more"}>
        ${uiIcon(picked?.icon ?? "more")}<span>${tab === "more" && picked ? picked.short : "More"}</span><span class="caret" aria-hidden="true">▾</span>
      </button>
    </div>
    <div class="tap-menu src-menu" id=${moreId} popover role="menu" aria-label="More sources" @toggle=${onValuePopoverToggle}>
      <div class="tap-menu-group" role="group" aria-label="More sources" data-group="sources">
        ${more.map((m) => html`<button type="button" role="menuitemradio" aria-checked=${m.kind === k.kind ? "true" : "false"}
          class="src-item ${m.kind === k.kind ? "on" : ""}" popovertarget=${moreId} popovertargetaction="hide"
          @click=${(e: Event) => pickMore(m.kind, e.currentTarget)}>
          <span class="src-ico" aria-hidden="true">${uiIcon(m.icon)}</span>
          <span class="src-txt"><span class="tap-menu-name">${m.name}</span><span class="tap-menu-info">${m.info}</span></span>
        </button>`)}
      </div>
      ${canShare(value, valueOpts) ? html`<div class="tap-menu-group" role="group" aria-label="Share" data-group="share">
        <button type="button" role="menuitem" class="src-item" popovertarget=${moreId} popovertargetaction="hide"
          @click=${() => makeShared(host, value, set)}>
          <span class="src-ico" aria-hidden="true">${uiIcon("plus")}</span>
          <span class="src-txt"><span class="tap-menu-name">Make shared</span><span class="tap-menu-info">Move what this shows into a shared value, so other layers can read it too.</span></span>
        </button>
      </div>` : nothing}
    </div>
  </div>`;

  let body: TemplateResult | typeof nothing;
  switch (k.kind) {
    case "literal":
      body = textField("Words", k.value, (v) => setKind({ kind: "literal", value: v }), { placeholder: "Type what to show" });
      break;
    case "entityState":
    case "entityAttribute":
    case "entityAge": {
      const ref: EntityRef = { entityId: k.entityId, displayName: k.displayName, domain: k.domain };
      // Clearing always lands on this value: a layer-wide pick has no "none"
      // to write, so the x would otherwise do nothing.
      const pick = (next: EntityRef) => {
        if (next.entityId !== "" && opts.onEntity) opts.onEntity(next);
        else setKind({ ...k, ...next });
      };
      body = html`${entityField(host, "Entity", ref, pick, `${key}-entity`)}
        ${opts.onEntity ? html`<div class="hint">The layer's tap, when it has one, follows the entity picked here.</div>` : nothing}
        ${segField("Reads", k.kind, ENTITY_READS, (to) => setKind(switchKind(k, to)), { titles: ENTITY_READ_TITLES })}
        ${k.kind === "entityAttribute" ? attributeField(host, k, (attribute) => setKind({ ...k, attribute })) : nothing}
        ${k.kind === "entityAge" ? html`<div class="hint">Set Seconds as, under Format, to read 5m instead of 300.</div>` : nothing}`;
      break;
    }
    case "time":
      body = selectField("Reads", k.timeField, TIME_FIELDS, (v) => setKind({ ...k, timeField: v }));
      break;
    default: {
      const hint = VALUE_KIND_HINTS[k.kind];
      body = html`${hint ? html`<div class="hint">${hint}</div>` : nothing}${valueBody(host, value, set, valueOpts)}`;
    }
  }

  // Typed words print as typed, so the reading would only repeat the box
  // above it. It comes back once a format changes what they print.
  const showNow = !(k.kind === "literal" && formatIsEmpty(value.format));
  return html`<div class="src-editor" data-src=${key}>
    ${tabs}
    ${body}
    ${showNow ? nowReadout(host, value, host.resolve(value)) : nothing}
    ${formatEditor(value.format, (f) => set(formatIsEmpty(f) ? { kind: value.kind } : { ...value, format: f }), formatFits(sourceKind(host, value)))}
  </div>`;
}

/**
 * Which attribute an entity value reads, as a menu of the ones the entity has
 * right now, each with its current value, so nobody types `brightness` from
 * memory. An attribute the entity does not carry at the moment (a light that
 * is off has no brightness) stays in the list, marked, rather than vanishing.
 */
function attributeField(host: EditorHost, k: { entityId: string; attribute: string }, set: (attribute: string) => void): TemplateResult {
  const attrs = host.hass.states[k.entityId]?.attributes ?? {};
  const show = (v: unknown) => truncate(typeof v === "string" ? v : JSON.stringify(v) ?? "", 24);
  const options: [string, string][] = [
    ["", "(choose)"],
    ...Object.keys(attrs).sort().map((a): [string, string] => [a, `${a} · ${show(attrs[a])}`]),
  ];
  if (k.attribute !== "" && !(k.attribute in attrs)) options.push([k.attribute, `${k.attribute} (not there right now)`]);
  return selectField("Attribute", k.attribute, options, set);
}

/** Put the caret in a source editor's box once the redraw an edit causes has
 * drawn it. */
function focusSourceSoon(node: EventTarget | null, key: string, selector: string): void {
  if (!(node instanceof Node)) return;
  const root = node.getRootNode();
  if (!(root instanceof ShadowRoot) && !(root instanceof Document)) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.querySelector<HTMLElement>(`[data-src="${CSS.escape(key)}"] ${selector}`)?.focus();
  }));
}

/** The source a value really reads: a shared value's own source, followed
 * through any chain, or undefined while no shared value is chosen. */
function sourceKind(host: EditorHost, value: Value): ValueKind | undefined {
  let kind: ValueKind = value.kind;
  for (let depth = 0; kind.kind === "named" && depth < 8; depth++) {
    const id = kind.id.toUpperCase();
    const target = host.config.values.find((n) => n.id.toUpperCase() === id);
    if (!target) return undefined;
    kind = target.value.kind;
  }
  return kind.kind === "named" ? undefined : kind;
}

/** Which format controls mean something for a source. */
export interface FormatFits {
  /** Decimals, Multiply and Offset: the source can read as a number. */
  numbers: boolean;
  /** Case: the source can read as words. */
  textCase: boolean;
  /** Add unit: the source has an entity unit to add. */
  unit: boolean;
  /** Seconds as: the source can be a count of seconds or a duration. */
  seconds: boolean;
}

/**
 * The format controls worth showing for a source. Decimals on "ABC" or a unit
 * on the clock does nothing, and a control that does nothing reads as broken.
 * Unknown (a shared value not yet chosen) shows everything, and the editor
 * still shows any control that is already set, so nothing hidden stays on.
 */
export function formatFits(kind: ValueKind | undefined): FormatFits {
  if (!kind) return { numbers: true, textCase: true, unit: true, seconds: true };
  switch (kind.kind) {
    case "literal": {
      const isNumber = leadingNumber(kind.value) !== undefined;
      return { numbers: isNumber, textCase: !isNumber, unit: false, seconds: isNumber };
    }
    case "entityState":
    case "entityAttribute":
    case "jinja":
    case "named":
      return { numbers: true, textCase: true, unit: kind.kind !== "jinja" && kind.kind !== "named", seconds: true };
    case "entityAge":
    case "dataAge":
      return { numbers: true, textCase: false, unit: false, seconds: true };
    case "aggregate":
      return { numbers: true, textCase: false, unit: false, seconds: false };
    case "chartStat": {
      const arrow = kind.stat === "trend";
      return { numbers: !arrow, textCase: false, unit: !arrow, seconds: false };
    }
    case "time":
      return { numbers: kind.timeField !== "now", textCase: false, unit: false, seconds: false };
    // An item field can be anything the source holds: a name, a temperature, a
    // unix time. So every control fits, the way it does for a template.
    case "item":
      return { numbers: true, textCase: true, unit: true, seconds: true };
    // A count is a whole number of things, so a unit and a text case have
    // nothing to say about it.
    case "listStat":
      return { numbers: true, textCase: false, unit: false, seconds: false };
    // A moment in unix seconds, printed by the Timestamp formats only. Not
    // "Seconds as": the watch reads that as an age in seconds, and a unix time
    // read as an age prints 9999d.
    case "imageTime":
      return { numbers: false, textCase: false, unit: false, seconds: false };
  }
}

/** The Now line: what the value prints right now, spaces and all, or in
 * plain words why it prints nothing yet. */
function nowReadout(host: EditorHost, value: Value, resolved: string | undefined): TemplateResult {
  const body = resolved === undefined
    ? html`<span class="readout-v now-v none">${whyUnresolved(host, value)}</span>`
    : resolved.trim() === ""
      ? html`<span class="readout-v now-v none">Empty</span>`
      : html`<span class="readout-v now-v"><span class="now-tok">${resolved}</span></span>`;
  return html`<div class="field readout now-field"><span>Now</span>${body}</div>`;
}

/** Why a value has no reading, in the words of the step that is missing. */
export function whyUnresolved(host: EditorHost, value: Value): string {
  const k = value.kind;
  switch (k.kind) {
    case "entityState":
    case "entityAttribute":
    case "entityAge":
      if (k.entityId === "") return "Pick an entity";
      if (!host.hass.states[k.entityId]) return "No such entity";
      if (k.kind === "entityAttribute" && k.attribute.trim() === "") return "Pick an attribute";
      return k.kind === "entityState" ? "No reading" : "Waiting for Home Assistant";
    case "chartStat":
      return k.layer === "" ? "Pick a chart" : "The chart has no readings yet";
    case "item":
      return k.field === "" ? "Pick a field" : "Only while a row is drawn";
    case "listStat":
      return k.layer === "" ? "Pick a list" : "That list has drawn nothing yet";
    case "imageTime":
      return k.layer === "" ? "Pick a picture" : "That picture is gone or uploaded";
    case "named": {
      if (k.id === "") return "Pick a shared value";
      const id = k.id.toUpperCase();
      const target = host.config.values.find((n) => n.id.toUpperCase() === id);
      return target ? whyUnresolved(host, target.value) : "That shared value is gone";
    }
    case "jinja":
      return k.value.trim() === "" ? "Type a template" : "Waiting for Home Assistant";
    default:
      return "Waiting for Home Assistant";
  }
}

/** Whether a value holds something worth sharing: it is not already shared,
 * sharing is allowed here, and it is not still blank. */
function canShare(value: Value, opts: ValueEditorOptions): boolean {
  if (opts.allowNamed === false || opts.noShare) return false;
  const k = value.kind;
  if (k.kind === "named") return false;
  if (k.kind === "literal" || k.kind === "jinja") return k.value.trim() !== "";
  if ("entityId" in k) return k.entityId !== "";
  if (k.kind === "chartStat" || k.kind === "imageTime") return k.layer !== "";
  return true;
}

/** Move what a value holds into a new shared value named after it, and point
 * the value there, in one undo step. */
function makeShared(host: EditorHost, value: Value, set: (v: Value) => void): void {
  const words = describeValueBody(value, describeContext(host)).replace(/^"(.*)"$/, "$1");
  const { named, ref } = shareValue(host.config, value, truncate(words, 24));
  host.beginGesture();
  host.update((c) => { c.values.push(named); });
  set(ref);
  host.endGesture();
}

/** Point a value at a new, empty shared value and open that value to fill in.
 * It starts without a name, so opening it puts the caret in the Name box. */
function startShared(host: EditorHost, value: Value, set: (v: Value) => void): void {
  const { named, ref } = shareValue(host.config, { ...value, kind: { kind: "literal", value: "" } }, "");
  named.name = "";
  host.beginGesture();
  host.update((c) => { c.values.push(named); });
  set(ref);
  host.endGesture();
  host.selectValue(named.id);
}

/**
 * How a value is printed. Only the controls that do something for this source
 * are drawn (see `formatFits`), plus any that are already set, so a format
 * carried over from another source can still be seen and cleared. The summary
 * says what is on, so a closed section is not a mystery.
 */
function formatEditor(format: ValueFormat | undefined, set: (f: ValueFormat) => void, fits: FormatFits) {
  const f = format ?? {};
  const upd = (patch: Partial<ValueFormat>) => {
    const next: ValueFormat = { ...f, ...patch };
    for (const key of Object.keys(next) as (keyof ValueFormat)[]) if (next[key] === undefined || next[key] === false || next[key] === "") delete next[key];
    set(next);
  };
  const empty = formatIsEmpty(format);
  const show = {
    decimals: fits.numbers || f.decimals !== undefined,
    multiply: fits.numbers || f.multiply !== undefined,
    offset: fits.numbers || f.offset !== undefined,
    textCase: fits.textCase || f.textCase !== undefined,
    unit: fits.unit || !!f.useEntityUnit,
    seconds: fits.seconds || !!f.relativeTime || !!f.duration,
  };
  return html`<details class="sub format" ?open=${!empty}>
    <summary>Format${empty ? html`<span class="sum-note">as it comes</span>` : html`<span class="sum-note">${describeFormat(format).replace(/^ \((.*)\)$/, "$1")}</span>`}</summary>
    <div class="grid2">
      ${show.decimals ? numberField("Decimals", f.decimals, (v) => upd({ decimals: v }), { step: 1, min: 0, max: 6, optional: true, placeholder: "as is" }) : nothing}
      ${show.multiply ? numberField("Multiply", f.multiply, (v) => upd({ multiply: v }), { optional: true, placeholder: "1" }) : nothing}
      ${show.offset ? numberField("Plus", f.offset, (v) => upd({ offset: v }), { optional: true, placeholder: "0" }) : nothing}
      ${show.textCase ? segField("Case", f.textCase ?? "", [["", "As is"], ["upper", "ABC"], ["lower", "abc"], ["capitalized", "Abc"]],
        (v) => upd({ textCase: (v || undefined) as ValueFormat["textCase"] }),
        { titles: { "": "Leave the letters as they are", upper: "UPPER CASE", lower: "lower case", capitalized: "Capital First Letters" } }) : nothing}
      ${textField("Before", f.prefix ?? "", (v) => upd({ prefix: v }), { placeholder: "text in front" })}
      ${textField("After", f.suffix ?? "", (v) => upd({ suffix: v }), { placeholder: "text after" })}
    </div>
    ${show.unit ? checkField("Add unit", !!f.useEntityUnit, (v) => upd({ useEntityUnit: v })) : nothing}
    ${show.seconds ? segField("Seconds as", f.duration ? "duration" : f.relativeTime ? "relativeTime" : "",
      [["", "Number"], ["relativeTime", "Short"], ["duration", "Duration"]],
      (v) => upd({ relativeTime: v === "relativeTime", duration: v === "duration" }),
      { titles: { "": "300", relativeTime: "One unit: 45s, 5m, 3h", duration: "Two units: 1h 23m, 5m 0s" } }) : nothing}
    ${selectField("Timestamp", f.timestamp ?? "", [["", "None"], ...TIMESTAMP_STYLES], (v) =>
      upd({ timestamp: (v || undefined) as ValueFormat["timestamp"] }))}
    ${timestampHasClock(f.timestamp)
      ? html`<div class="grid2">
          ${checkField("Minutes", !f.hideMinutes, (v) => upd({ hideMinutes: !v }))}
          ${checkField("AM/PM", !f.hideDayPeriod, (v) => upd({ hideDayPeriod: !v }))}
          ${checkField("Seconds", !!f.showSeconds, (v) => upd({ showSeconds: v }))}
        </div>
        <div class="hint">Turn both off and 5:30 PM reads 5. AM/PM does nothing on a watch set to a 24-hour clock, which never shows one. Seconds reads 5:30:12 PM, and does nothing while Minutes is off.</div>`
      : nothing}
    ${f.timestamp === undefined
      ? nothing
      : html`<div class="hint">Read as a moment in time (unix seconds) and printed by the watch's own clock and locale. A value that is not a number prints exactly as it did.</div>`}
  </details>`;
}

/**
 * Which entities a scope covers: a filter, or a fixed list of them.
 *
 * Split out of `aggregateEditor` so a list's `entities` source is edited by
 * exactly the same control. That is the whole reason the source carries the
 * aggregate's own scope object: "3 lights on" and the list of those three
 * lights are the same question, and two editors for it would be two answers.
 */
function scopeFields(host: EditorHost, scope: AggregateScope, set: (s: AggregateScope) => void, key: string): TemplateResult {
  const csv = (list: string[]) => list.join(", ");
  const parse = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  return html`
    ${segField("Over", scope.kind, [["filter", "Entities matching a filter"], ["entities", "A fixed list"]], (v) =>
      set(v === "entities" ? { kind: "entities", entities: [] } : { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] }))}
    ${scope.kind === "filter"
      ? html`<div class="grid2">
          ${textField("Domains", csv(scope.domains), (v) => set({ ...scope, domains: parse(v) }), { placeholder: "light, switch" })}
          ${textField("Area ids", csv(scope.areaIds), (v) => set({ ...scope, areaIds: parse(v) }))}
          ${textField("Label ids", csv(scope.labelIds), (v) => set({ ...scope, labelIds: parse(v) }))}
          ${textField("Floor ids", csv(scope.floorIds), (v) => set({ ...scope, floorIds: parse(v) }))}
        </div>`
      : html`${scope.entities.map((e, i) => html`<div class="row-inline">
            ${entityField(host, `Entity ${i + 1}`, e, (ref) => { const list = [...scope.entities]; list[i] = ref; set({ ...scope, entities: list }); }, `${key}-agg-${i}`, { compact: true })}
            <button class="icon" title="Remove" @click=${() => set({ ...scope, entities: scope.entities.filter((_, j) => j !== i) })}>${uiIcon("close")}</button>
          </div>`)}
          <button class="small" @click=${() => set({ ...scope, entities: [...scope.entities, { entityId: "", displayName: "", domain: "" }] })}>Add entity</button>`}`;
}

/** The state filter of an aggregate or of a list's `entities` source, worded
 * by what the caller does with it. */
function stateFilterFields(
  label: string,
  filter: AggregateStateFilter | undefined,
  set: (f: AggregateStateFilter | undefined) => void,
): TemplateResult {
  return html`
    ${selectField(label, filter?.kind ?? "", [["", "Any state"], ["isOn", "On"], ["isOff", "Off"], ["equals", "State equals"], ["notEquals", "State does not equal"]], (v) => {
      if (v === "") set(undefined);
      else if (v === "equals" || v === "notEquals") set({ kind: v, value: filter && "value" in filter ? filter.value : "" });
      else set({ kind: v as "isOn" | "isOff" });
    })}
    ${filter && "value" in filter ? textField("State", filter.value, (v) => set({ kind: filter.kind as "equals", value: v })) : nothing}`;
}

function aggregateEditor(host: EditorHost, a: AggregateSpec, set: (a: AggregateSpec) => void, key: string) {
  return html`
    ${selectField("Function", a.function, [["count", "Count"], ["sum", "Sum"], ["average", "Average"], ["min", "Min"], ["max", "Max"]], (v) => set({ ...a, function: v }))}
    ${scopeFields(host, a.scope, (scope) => set({ ...a, scope }), key)}
    ${stateFilterFields("Only count when", a.stateFilter, (f) => {
      const next = { ...a };
      if (f === undefined) delete next.stateFilter; else next.stateFilter = f;
      set(next);
    })}
    ${a.function === "count" ? nothing : textField("Attribute (blank = state)", a.attribute ?? "", (v) => { const next = { ...a }; if (v) next.attribute = v; else delete next.attribute; set(next); })}`;
}

// ── lists ─────────────────────────────────────────────────────────────────
// A list is three cards: where the items come from, how the cells are laid out
// on the face, and the row that is drawn once per item. The row is designed on
// the canvas rather than in the inspector, because a row is a picture and a
// form is not; "Design the row" swaps the preview for one cell of the list,
// scaled up, and everything that already drags and resizes a layer works there
// unchanged.

/** The source of the list whose row is being designed, or undefined outside
 * that mode. */
function rowEditSource(host: EditorHost): ListSource | undefined {
  const id = host.rowEditListId;
  if (id === undefined) return undefined;
  const el = host.config.elements.find((e) => e.kind === "list" && e.payload.id === id);
  return el?.kind === "list" ? el.payload.source : undefined;
}

/** The select's stand-in for "a field the picker does not list". */
const ITEM_FIELD_OTHER = "__other";

/**
 * Which field of the item this value reads.
 *
 * A picker of the source's own fields, because a name is the one thing a row
 * layer nearly always wants and typing `entityId` from memory is how a row
 * ends up drawing `--`. The free box under it is for the two cases the panel
 * cannot know: an attribute of an entities source, and whatever keys an
 * attribute or a template happens to yield.
 */
function itemFieldFields(
  host: EditorHost,
  k: { kind: "item"; field: string },
  set: (next: ValueKind) => void,
  _key: string,
): TemplateResult {
  const source = rowEditSource(host);
  const fields = source ? listItemFields(source) : [];
  const listed = fields.some(([f]) => f === k.field);
  const free = k.field !== "" && !listed;
  const options: [string, string][] = [
    ["", "(choose)"],
    ...fields.map(([f, label]): [string, string] => [f, label]),
    [ITEM_FIELD_OTHER, "Something else…"],
  ];
  const attrs = source?.kind === "entities";
  return html`
    ${source === undefined
      ? html`<div class="hint warn">An item field only reads something while a row is being drawn. Open the list's Row card and click Design the row.</div>`
      : nothing}
    ${selectField("Field", free ? ITEM_FIELD_OTHER : k.field, options, (v) => {
      if (v === ITEM_FIELD_OTHER) set({ ...k, field: attrs ? "attr." : "" });
      else set({ ...k, field: v });
    })}
    ${free || (attrs && k.field.startsWith("attr."))
      ? html`${textField(attrs ? "Attribute" : "Field name", k.field, (v) => set({ ...k, field: v.trim() }), { mono: true, placeholder: attrs ? "attr.brightness" : "title" })}
        ${attrs ? html`<div class="hint">Write it as <code>attr.</code> and the attribute's name. The list asks Home Assistant for exactly the attributes its row reads, so adding one here adds it to the fetch.</div>` : nothing}`
      : nothing}
    <div class="hint">An unknown field draws <code>--</code>. A time field takes a Timestamp style under Format, and a count of seconds takes Seconds as.</div>`;
}

/** Every value a row layer holds, for the attribute sweep. Row templates may
 * only hold text, icons, shapes, gauges, pictures and taps, so this is the
 * whole surface. */
function rowLayerValues(el: CElement): Value[] {
  const out: Value[] = [];
  const push = (v: Value | undefined) => { if (v) out.push(v); };
  switch (el.kind) {
    case "text":
      push(el.payload.value);
      for (const part of el.payload.parts ?? []) push(part.value);
      break;
    case "icon":
      push(el.payload.symbol);
      push(el.payload.level?.value);
      push(el.payload.level?.minSource);
      push(el.payload.level?.maxSource);
      break;
    case "shape":
      push(el.payload.level?.value);
      push(el.payload.level?.minSource);
      push(el.payload.level?.maxSource);
      break;
    case "gauge":
      push(el.payload.value);
      push(el.payload.total);
      push(el.payload.minSource);
      push(el.payload.maxSource);
      break;
    default:
      break;
  }
  for (const rule of el.payload.rules) {
    for (const c of rule.cases) {
      for (const t of c.when.tests) {
        push(t.value);
        push(t.comparison && "value" in t.comparison ? t.comparison.value : undefined);
        push(t.comparison && "upper" in t.comparison ? t.comparison.upper : undefined);
      }
      for (const ch of c.then) push(ch.value);
    }
    for (const ch of rule.otherwise ?? []) push(ch.value);
  }
  return out;
}

/** `{item.attr.<name>}` wherever a row tap writes one. */
const TAP_ATTR_RE = /\{item\.attr\.([^{}]+)\}/g;

/**
 * The attribute names a row reads, in the order they are met.
 *
 * `source.attributes` is not something anybody should have to keep in step by
 * hand: it exists so the Jinja dict carries the attributes the row uses and
 * nothing else, which is a fact about the row. So it is derived here and
 * written on every change to the row.
 */
export function listAttributeNames(template: readonly CElement[]): string[] {
  const out: string[] = [];
  const take = (name: string) => {
    const trimmed = name.trim();
    if (trimmed !== "" && !out.includes(trimmed)) out.push(trimmed);
  };
  for (const el of template) {
    for (const v of rowLayerValues(el)) {
      if (v.kind.kind === "item" && v.kind.field.startsWith("attr.")) take(v.kind.field.slice(5));
    }
    if (el.kind !== "tap") continue;
    const action = el.payload.action;
    const texts = [
      "entityId" in action ? action.entityId : "",
      "displayName" in action ? action.displayName : "",
      action.type === "callService" ? action.serviceDataJSON ?? "" : "",
      action.type === "callService" ? action.target?.entityId ?? "" : "",
    ];
    for (const text of texts) for (const m of text.matchAll(TAP_ATTR_RE)) take(m[1] ?? "");
  }
  return out;
}

/** Put `source.attributes` back in step with the row. Cheap, and run after
 * every row edit, so the two can never drift. */
export function syncListAttributes(list: ListElement): void {
  if (list.source.kind !== "entities") return;
  const wanted = listAttributeNames(list.template);
  const same = wanted.length === list.source.attributes.length
    && wanted.every((name, i) => list.source.kind === "entities" && list.source.attributes[i] === name);
  if (!same) list.source = { ...list.source, attributes: wanted };
}

/** What a source turns into when the kind picker changes: the entity carries
 * over wherever both sides have one, so switching between a calendar and a
 * to-do list never asks for the same pick twice. */
export function switchListSource(current: ListSource, kind: ListSource["kind"]): ListSource {
  const refs: EntityRef[] = current.kind === "calendar" || current.kind === "todo"
    ? current.entities.filter((e) => e.entityId !== "")
    : "entityId" in current && current.entityId !== ""
      ? [{ entityId: current.entityId, displayName: current.displayName, domain: current.domain }]
      : [];
  const one: EntityRef = refs[0] ?? { entityId: "", displayName: "", domain: "" };
  switch (kind) {
    case "entities":
      return current.kind === "entities" ? current : {
        kind: "entities",
        scope: refs.length > 0 ? { kind: "entities", entities: refs } : { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] },
        sort: "name",
        descending: false,
        attributes: [],
      };
    case "attribute":
      return { kind: "attribute", ...one, attribute: current.kind === "attribute" ? current.attribute : "" };
    case "template":
      return { kind: "template", value: current.kind === "template" ? current.value : "" };
    case "calendar":
      return { kind: "calendar", entities: refs.slice(0, LIST_MAX_SOURCE_ENTITIES), hours: LIST_DEFAULT_CALENDAR_HOURS };
    case "todo":
      return { kind: "todo", entities: refs.slice(0, LIST_MAX_SOURCE_ENTITIES), status: "open", sort: "list" };
    case "forecast":
      return { kind: "forecast", ...one, type: "hourly" };
  }
}

/** A short standard vocabulary per domain, offered only when Home Assistant
 * has nothing to say: a scope whose domain holds no entity yet, or a panel
 * opened before the states arrive. What the home really reports always wins. */
const DEVICE_CLASS_SEEDS: Record<string, readonly string[]> = {
  sensor: ["battery", "energy", "humidity", "illuminance", "power", "pressure", "signal_strength", "temperature"],
  binary_sensor: ["battery", "connectivity", "door", "gas", "moisture", "motion", "occupancy", "problem", "smoke", "window"],
  cover: ["door", "garage", "shade", "window"],
};

/** The domains a scope covers, as plain words: the filter's own list, or the
 * domain of each entity a fixed list names. Empty means every domain. */
function scopeDomains(scope: AggregateScope): string[] {
  const names = scope.kind === "filter"
    ? scope.domains
    : scope.entities.map((e) => e.entityId.split(".")[0] ?? "");
  return names.map((d) => d.trim().toLowerCase()).filter((d) => d !== "");
}

/**
 * The device classes the Device class box offers under a scope.
 *
 * Whatever this home actually reports on the entities that scope could cover,
 * so the list is the author's own vocabulary rather than a guess. A scope that
 * matches nothing yet falls back to the standard names for its domains, and
 * the box stays free text either way: a class nobody has reported can still be
 * typed.
 */
export function scopeDeviceClasses(states: Record<string, HassEntityState>, scope: AggregateScope): string[] {
  const domains = scopeDomains(scope);
  const live = new Set<string>();
  for (const [entityId, state] of Object.entries(states ?? {})) {
    const domain = entityId.split(".")[0] ?? "";
    if (domains.length > 0 && !domains.includes(domain)) continue;
    const found = state?.attributes?.device_class;
    if (typeof found === "string" && found.trim() !== "") live.add(found.trim());
  }
  if (live.size > 0) return [...live].sort();
  const seeded = new Set<string>();
  for (const domain of domains.length > 0 ? domains : Object.keys(DEVICE_CLASS_SEEDS)) {
    for (const name of DEVICE_CLASS_SEEDS[domain] ?? []) seeded.add(name);
  }
  return [...seeded].sort();
}

/** What the Device class box writes. Blank means any, so the key goes away
 * rather than sitting on the wire as an empty string nothing filters on. */
export function withListDeviceClass(source: Extract<ListSource, { kind: "entities" }>, typed: string): ListSource {
  const next = { ...source };
  const value = typed.trim();
  if (value === "") delete next.deviceClass; else next.deviceClass = value;
  return next;
}

/** A list of entity pickers with an Add button, capped. Calendars and to-do
 * lists are merged into one list, and the server takes at most five. */
function refListField(
  host: EditorHost,
  label: string,
  refs: readonly EntityRef[],
  set: (next: EntityRef[]) => void,
  key: string,
  domain: string,
): TemplateResult {
  const full = refs.length >= LIST_MAX_SOURCE_ENTITIES;
  return html`
    ${refs.map((e, i) => html`<div class="row-inline">
      ${entityField(host, `${label} ${i + 1}`, e, (ref) => { const list = [...refs]; list[i] = ref; set(list); }, `${key}-ref-${i}`, { compact: true, domain })}
      <button class="icon" title="Remove" @click=${() => set(refs.filter((_, j) => j !== i))}>${uiIcon("close")}</button>
    </div>`)}
    <button class="small" ?disabled=${full} @click=${() => set([...refs, { entityId: "", displayName: "", domain: "" }])}>Add ${label.toLowerCase()}</button>
    ${refs.length === 0 ? html`<div class="hint warn">Nothing is picked yet, so this list has nothing to draw.</div>` : nothing}
    ${full ? html`<div class="hint">Five is the most one list may merge.</div>` : nothing}`;
}

/** The look-ahead unit picked for each calendar list, by the list's id, for as
 * long as the page is open. Editor state, never on the wire: the document
 * carries hours, and a reload shows them in the biggest unit that divides
 * them again. Without this the switch could not stay on Hours for a span of
 * exactly one week, since the hours alone say "weeks". */
const LOOK_AHEAD_UNIT_PICKED = new Map<string, CalendarLookAheadUnit>();

/** The Source card of a list: which items, and everything the chosen kind of
 * source needs to name them. */
function listSourceFields(
  host: EditorHost,
  l: ListElement,
  set: (m: (p: ListElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const source = l.source;
  const setSource = (next: ListSource, k?: string) => set((p) => { p.source = next; syncListAttributes(p); }, k);
  let body: TemplateResult | typeof nothing = nothing;
  switch (source.kind) {
    case "entities": {
      const attrs = source.attributes;
      const classes = scopeDeviceClasses(host.hass.states, source.scope);
      const classListId = `wa-list-classes-${key.replace(/[^a-z0-9]/gi, "")}`;
      body = html`
        ${scopeFields(host, source.scope, (scope) => setSource({ ...source, scope }), `${key}-scope`)}
        ${textField("Device class", source.deviceClass ?? "",
          (v) => setSource(withListDeviceClass(source, v), "list-device-class"),
          { list: classListId, placeholder: "any", mono: true, def: "" })}
        <datalist id=${classListId}>${classes.map((c) => html`<option value=${c}></option>`)}</datalist>
        <div class="hint">Keeps only the entities whose device class is exactly this, so a scope of sensors becomes your battery sensors. Leave it empty for any.</div>
        ${stateFilterFields("Only when", source.stateFilter, (f) => {
          const next = { ...source };
          if (f === undefined) delete next.stateFilter; else next.stateFilter = f;
          setSource(next);
        })}
        ${segPairField(
          { label: "Sort by", value: source.sort, options: [...LIST_SORTS], def: "name", set: (v) => setSource({ ...source, sort: v }) },
          { label: "Order", value: source.descending ? "down" : "up", options: [["up", "A to Z"], ["down", "Z to A"]], def: "up",
            set: (v) => setSource({ ...source, descending: v === "down" }) })}
        <div class="hint">Entities that are unavailable are left out, unless Only when asks for exactly that state. Sorting by state compares numbers as numbers, and puts the text ones after them.</div>
        ${attrs.length > 0
          ? html`<div class="field readout"><span>Attributes</span><span class="readout-v mono">${attrs.join(", ")}</span></div>
            <div class="hint">Asked for because the row reads them. Remove the layer that reads one and it stops being fetched.</div>`
          : nothing}`;
      break;
    }
    case "attribute": {
      const all = Object.entries(host.hass.states[source.entityId]?.attributes ?? {});
      const listy = all.filter(([, v]) => Array.isArray(v)).map(([name]) => name).sort();
      const listId = `wa-list-attrs-${key.replace(/[^a-z0-9]/gi, "")}`;
      body = html`
        ${entityField(host, "Entity", source, (ref) => setSource({ ...source, ...ref }), `${key}-attr-entity`)}
        ${textField("Attribute", source.attribute, (v) => setSource({ ...source, attribute: v }, "list-attr"), { list: listId, mono: true })}
        <datalist id=${listId}>${listy.map((a) => html`<option value=${a}></option>`)}</datalist>
        <div class="hint">An attribute that holds a list: a group's members, a select's options, a media player's sources, or any sensor that carries an array. Each entry becomes a row.</div>
        ${source.entityId !== "" && listy.length === 0
          ? html`<div class="hint warn">None of that entity's attributes holds a list right now. The name can still be typed above.</div>`
          : nothing}`;
      break;
    }
    case "template":
      body = html`
        ${textArea("Template", source.value, (v) => setSource({ ...source, value: v }, "list-template"), 4)}
        <div class="hint">Rendered by Home Assistant, the same way a template value is. It should yield a JSON array: a list of objects becomes a row each, with one field per key, and a list of plain values gives each row one field called <code>value</code>.</div>`;
      break;
    case "calendar": {
      // The wire carries hours. The box shows them in the unit the author
      // picked, remembered per list while the editor is open, and until one
      // is picked in the biggest unit that divides them. The switch re-counts
      // the same span rather than keeping the number, so "2 weeks" turned to
      // days reads 14, not 2.
      const unit = LOOK_AHEAD_UNIT_PICKED.get(l.id) ?? calendarLookAhead(source.hours).unit;
      const shown = calendarLookAheadShown(source.hours, unit);
      const defaultAhead = calendarLookAhead(LIST_DEFAULT_CALENDAR_HOURS);
      const unitShort: Record<CalendarLookAheadUnit, string> = { hours: "h", days: "d", weeks: "w", months: "mo" };
      body = html`
        ${refListField(host, "Calendar", source.entities, (entities) => setSource({ ...source, entities }), `${key}-cal`, "calendar")}
        ${numberField("Look ahead", shown, (v) => setSource({ ...source, hours: calendarHoursFrom(v ?? 1, unit) }, "list-hours"),
          { step: 1, min: 1, max: calendarLookAheadMax(unit), unit: unitShort[unit],
            ...(defaultAhead.unit === unit ? { def: defaultAhead.value } : {}) })}
        ${segField("Counted in", unit, CALENDAR_LOOK_AHEAD_UNITS.map((u): [CalendarLookAheadUnit, string] => [u, u[0]!.toUpperCase() + u.slice(1)]),
          (u) => {
            LOOK_AHEAD_UNIT_PICKED.set(l.id, u);
            setSource({ ...source, hours: calendarHoursFrom(calendarLookAheadIn(source.hours, u), u) });
          },
          { def: defaultAhead.unit })}
        <div class="hint">Events from now to that far ahead, up to a year, merged across the calendars and sorted by when they start. A month counts as thirty days. An event already under way is included. How many of them show is Items shown, in the Look card.</div>`;
      break;
    }
    case "todo":
      body = html`
        ${refListField(host, "List", source.entities, (entities) => setSource({ ...source, entities }), `${key}-todo`, "todo")}
        ${segPairField(
          { label: "Show", value: source.status, options: [...TODO_STATUSES], def: "open", set: (v) => setSource({ ...source, status: v }) },
          { label: "Sort by", value: source.sort, options: [...TODO_SORTS], def: "list", set: (v) => setSource({ ...source, sort: v }) })}`;
      break;
    case "forecast":
      body = html`
        ${entityField(host, "Weather", source, (ref) => setSource({ ...source, ...ref }), `${key}-fc-entity`, { domain: "weather" })}
        ${segField("Forecast", source.type, [...FORECAST_TYPES], (v) => setSource({ ...source, type: v }), { def: "hourly" })}
        <div class="hint">Whatever that weather entity supports. An entity with no forecast of the chosen kind draws nothing.</div>`;
      break;
  }
  return html`
    ${selectField("Items", source.kind, [...LIST_SOURCE_KINDS], (v) => setSource(switchListSource(source, v), "list-kind"))}
    ${body}`;
}

/** How many points tall one cell is on the shape being edited. */
export function listCellHeightPoints(l: ListElement, frame: NormalizedFrame, family: FamilyKind): number {
  const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
  const cell = listCellFrames({ ...l, frame }, box)[0];
  return cell === undefined ? 0 : cell.height * Math.abs(frame.height) * box.height;
}

/** Under this a cell has no room for a line of text, which is what nearly
 * every row starts with. */
export const LIST_MIN_CELL_POINTS = 10;

/** The Layout card of a list: how many cells, which way they run, and the gap
 * between them. */
function listLayoutFields(
  host: EditorHost,
  el: Extract<CElement, { kind: "list" }>,
  family: FamilyKind,
  set: (m: (p: ListElement) => void, k?: string) => void,
): TemplateResult {
  const l = el.payload;
  const frame = effectivePlacement(host.config, family, el).frame;
  const grid = listGrid(l);
  const tall = listCellHeightPoints(l, frame, family);
  const down = l.direction === "down";
  return html`
    ${numberField("Items shown", l.rows, (v) => set((p) => { p.rows = clampListRows(v); syncListAttributes(p); }, "list-rows"),
      { step: 1, min: LIST_MIN_ROWS, max: LIST_MAX_ROWS, def: LIST_DEFAULT_ROWS })}
    ${segField("Direction", l.direction, [...LIST_DIRECTIONS], (v) => set((p) => { p.direction = v; }), { def: "down" })}
    ${down
      ? numberField("Columns", l.columns, (v) => set((p) => { p.columns = clampListColumns(v); }, "list-cols"),
          { step: 1, min: LIST_MIN_COLUMNS, max: LIST_MAX_COLUMNS, def: LIST_DEFAULT_COLUMNS })
      : nothing}
    ${numberField("Gap", l.gap, (v) => set((p) => { p.gap = clampListGap(v); }, "list-gap"),
      { step: 0.5, min: 0, max: LIST_MAX_GAP, def: LIST_DEFAULT_GAP, unit: "pt" })}
    <div class="field readout"><span>Grid</span><span class="readout-v">${down
      ? `${grid.lines} ${grid.lines === 1 ? "line" : "lines"} of ${grid.columns}`
      : `${grid.columns} across`} · ${tall.toFixed(1)} pt tall</span></div>
    ${tall > 0 && tall < LIST_MIN_CELL_POINTS
      ? html`<div class="hint warn">A cell is ${tall.toFixed(1)} points tall on this shape, which is too short for a line of text. Draw fewer cells, or make the list taller.</div>`
      : nothing}
    <div class="hint">The frame is split into this many cells whatever the item count, so a short list leaves the design where you put it rather than stretching two items over four rows.</div>`;
}

/** The row kinds the Add buttons offer, in the order they are offered. A row
 * holds no list, no history layer and no chart helper: those draw in a box of
 * their own that a cell cannot give them. */
export const LIST_ROW_KINDS: readonly CElement["kind"][] = ["text", "icon", "shape", "gauge", "image", "tap"];

/**
 * The Row card: the layers of the row, the buttons that add one, and the way
 * into designing it on the canvas.
 *
 * The rows here are a list of their own rather than `layerRowList`, because
 * that one reaches into `cfg.elements` for the layer it opens and a row layer
 * is not there. What it offers instead is what a row needs: rename, hide,
 * reorder, remove, and select, which in row mode puts the layer's ordinary
 * cards in the inspector.
 */
function listRowCard(
  host: EditorHost,
  el: Extract<CElement, { kind: "list" }>,
  set: (m: (p: ListElement) => void, k?: string) => void,
): TemplateResult {
  const l = el.payload;
  const ctx = describeContext(host);
  const designing = host.rowEditListId === l.id;
  const full = l.template.length >= LIST_MAX_TEMPLATE;
  const move = (i: number, by: number) => set((p) => { moveItem(p.template, i, i + by); });
  return html`
    <div class="chips">
      <button class="small ${designing ? "on" : ""}" title=${designing
        ? "Go back to the whole face"
        : "Fill the preview with one cell of this list, so the row can be dragged and sized like any other layer"}
        @click=${() => host.setRowEdit(designing ? undefined : l.id)}>${designing ? "Done designing" : "Design the row"}</button>
    </div>
    ${designing
      ? html`<div class="hint keep">The preview is one cell of this list, scaled up. Drag and resize the row's layers there. Values can read Item field, and a tap can aim at the item it is drawn for.</div>`
      : nothing}
    ${l.template.length === 0
      ? html`<div class="hint warn">The row is empty, so the list draws nothing. Add a layer below.</div>`
      : html`<div class="chart-numbers">${repeat(l.template, (row) => row.payload.id, (row, i) => html`
        <div class="num-row">
          <button class="num-pick" title="Show this layer's settings"
            @click=${() => { host.setRowEdit(l.id); host.selectLayer(row.payload.id); }}>
            <span class="num-lead">${uiIcon(rowKindIcon(row.kind))}</span>
            <span class="num-text"><span class="num-title">${layerTitle(row, ctx)}</span><span class="num-kind">${KIND_LABEL[row.kind]}</span></span>
          </button>
          <button class="icon" title=${row.payload.isHidden ? "Show this layer" : "Hide this layer"}
            aria-label=${row.payload.isHidden ? "Show this layer" : "Hide this layer"}
            @click=${() => set((p) => { const t = p.template[i]; if (t) t.payload.isHidden = !t.payload.isHidden; })}
            >${uiIcon(row.payload.isHidden ? "hide" : "show")}</button>
          <button class="icon" title="Move up" aria-label="Move up" ?disabled=${i === 0} @click=${() => move(i, -1)}>${uiIcon("up")}</button>
          <button class="icon" title="Move down" aria-label="Move down" ?disabled=${i === l.template.length - 1} @click=${() => move(i, 1)}>${uiIcon("down")}</button>
          <button class="icon danger" title="Remove this layer" aria-label="Remove this layer"
            @click=${() => set((p) => { p.template.splice(i, 1); syncListAttributes(p); })}>${uiIcon("delete")}</button>
        </div>`)}</div>`}
    <div class="chips">
      ${LIST_ROW_KINDS.map((kind) => html`<button class="small" ?disabled=${full}
        title=${`Add a ${KIND_LABEL[kind].toLowerCase()} to the row`}
        @click=${() => {
          const row = newRowLayer(kind);
          set((p) => { if (p.template.length < LIST_MAX_TEMPLATE) p.template.push(row); });
          host.setRowEdit(l.id);
          host.selectLayer(row.payload.id);
        }}>${KIND_LABEL[kind]}</button>`)}
    </div>
    <div class="hint">Every row draws these layers with its own item. Change them once and every row follows. Double click a row on the face, or click a layer here, to design them.</div>
    <div class="hint">${full
      ? `Eight layers is the most a row may hold.`
      : `${l.template.length} of ${LIST_MAX_TEMPLATE} layers. A row holds text, icons, shapes, gauges, uploaded pictures and taps.`}</div>`;
}

/** Which glyph stands for a row layer's kind in the row list, and in the Layers
 * panel where a list's rows hang under it. */
export function rowKindIcon(kind: CElement["kind"]): UiIconName {
  return kind === "image" ? "image" : kind === "tap" ? "tap" : kind === "gauge" ? "gauge" : kind === "icon" ? "icon" : kind === "shape" ? "shape" : "text";
}

/**
 * A fresh layer for a row.
 *
 * Framed to the whole cell rather than to the middle of it: a cell is already
 * small, and a new layer that fills it is a thing the author can see and then
 * pull in, where one sized for a face would arrive as a speck. A picture is
 * inline only, because the row has no per-row fetch to hang a camera off.
 */
export function newRowLayer(kind: CElement["kind"]): CElement {
  const el = newElement(kind);
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  if (el.kind === "text") {
    el.payload.value = { kind: { kind: "item", field: "" } };
    el.payload.fontSize = 11;
  }
  if (el.kind === "icon") {
    el.payload.symbol = { kind: { kind: "item", field: "icon" } };
    el.payload.size = 11;
    el.payload.frame = { x: 0.3, y: 0.1, width: 0.4, height: 0.8, rotationDegrees: 0 };
  }
  if (el.kind === "image") el.payload.source = "inline";
  if (el.kind === "gauge") el.payload.value = { kind: { kind: "item", field: "" } };
  return el;
}

/**
 * The document the canvas draws while a row is being designed.
 *
 * One cell, scaled up to the whole face: the row's layers become the layers of
 * a throwaway document whose shape is the shape being edited, so every frame
 * in it is already a fraction of the cell and a drag measured against the
 * canvas writes exactly the fraction the cell wants. Nothing here is ever
 * saved or compiled. Edits go to the real row through `elementIn`, which finds
 * a layer inside a list's template as readily as one of the document's own.
 *
 * `sample` is the item the row is drawn for, live or seeded. Its fields are
 * pasted into the copies in place of the `item` values they read, because a
 * value only resolves to an item field while the resolver is drawing a cell
 * and here there is no cell: the stage is one item, so the item is what the
 * stage shows.
 */
export function rowStageConfig(
  cfg: CustomComplicationConfig,
  listId: string,
  family: FamilyKind,
  sample: ReadonlyMap<string, string> | undefined,
): CustomComplicationConfig | undefined {
  const list = cfg.elements.find((e) => e.kind === "list" && e.payload.id === listId);
  if (list?.kind !== "list") return undefined;
  const rows: CElement[] = structuredClone(list.payload.template) as CElement[];
  if (sample !== undefined) for (const row of rows) fillItemValues(row, sample);
  const ids = new Set(rows.map((r) => r.payload.id));
  const stage: CustomComplicationConfig = {
    ...cfg,
    elements: rows,
    groups: [],
    perFamily: {},
  };
  // Only the row's own placements travel. The document's layers are not on the
  // stage, and a placement for one of them would make `elementsFor` reach for
  // a layer that is not there.
  for (const f of DRAWABLE_FAMILIES) {
    const layout = cfg.perFamily[f];
    if (!layout) continue;
    const placements: Record<string, Placement> = {};
    for (const id of ids) {
      const p = layout.placements[id];
      if (p) placements[id] = structuredClone(p);
    }
    stage.perFamily[f] = { ...layout, placements, rules: [] };
  }
  // Every row layer belongs to the shape on screen, whatever the document's
  // own layout says, so a row with no placement anywhere still draws.
  const here = stage.perFamily[family as (typeof DRAWABLE_FAMILIES)[number]];
  if (here) {
    for (const row of rows) {
      if (here.placements[row.payload.id]) continue;
      here.placements[row.payload.id] = { frame: { ...row.payload.frame }, isHidden: row.payload.isHidden };
    }
  }
  return stage;
}

/** Paste one item's fields into the copies of a row layer's values. Only the
 * stage does this; the face resolves them properly, once per cell. */
function fillItemValues(el: CElement, sample: ReadonlyMap<string, string>): void {
  for (const v of rowLayerValues(el)) {
    if (v.kind.kind !== "item") continue;
    v.kind = { kind: "literal", value: sample.get(v.kind.field) ?? "--" };
  }
}

/**
 * The item placeholders a row tap may aim at, as buttons.
 *
 * A row tap targets the item its row was drawn for, not an entity, and
 * `{item.entityId}` is not something anyone should have to remember the
 * spelling of. Drawn only while a row is being designed: outside one the
 * placeholder would never be filled in and the tap would simply not fire.
 */
function itemPlaceholders(host: EditorHost, insert: (text: string) => void, what: string): TemplateResult | typeof nothing {
  const source = rowEditSource(host);
  if (source === undefined) return nothing;
  const fields = listItemFields(source).filter(([f]) => f !== "index" && f !== "icon");
  if (fields.length === 0) return nothing;
  return html`
    <div class="chips">
      ${fields.map(([field, label]) => html`<button class="small" title=${`Put {item.${field}} into ${what}`}
        @click=${() => insert(`{item.${field}}`)}>${label}</button>`)}
    </div>
    <div class="hint">Each one is filled in per row when the tap fires. A placeholder naming a field the item does not have leaves that row's tap doing nothing.</div>`;
}

/** The words an empty state says, by what the list is of. */
function emptyStateText(source: ListSource): string {
  switch (source.kind) {
    case "calendar": return "No events";
    case "todo": return "All done";
    case "forecast": return "No forecast";
    default: return "Nothing to show";
  }
}

/**
 * Add the text that shows when a list draws nothing.
 *
 * A layer of the document rather than of the row: a row is drawn once per
 * item, so a row layer cannot say "there are no items". It sits over the
 * list's own frame, hidden, with one rule that shows it when the list's count
 * is 0, which is exactly the shape the States table draws.
 */
export function addEmptyState(cfg: CustomComplicationConfig, listId: string, family: FamilyKind): string | undefined {
  const list = cfg.elements.find((e) => e.kind === "list" && e.payload.id === listId);
  if (list?.kind !== "list") return undefined;
  const frame = { ...effectivePlacement(cfg, family, list).frame };
  const el = newElement("text");
  el.payload.frame = frame;
  el.payload.isHidden = true;
  if (el.kind === "text") {
    el.payload.value = literal(emptyStateText(list.payload.source));
    el.payload.fontSize = 12;
    el.payload.colorSlot.baseColorHex = "#8E8E93";
  }
  el.payload.name = "Empty state";
  const rule = newRule();
  const only = rule.cases[0]!;
  const test = only.when.tests[0]!;
  test.value = { kind: { kind: "listStat", layer: listId, stat: "count" } };
  test.comparison = { kind: "equals", value: literal("0") };
  only.then = [newStyleChange("show")];
  el.payload.rules = [rule];
  cfg.elements.push(el);
  setPlacement(cfg, family, el.payload.id, { frame, isHidden: true });
  return el.payload.id;
}

// ── General ───────────────────────────────────────────────────────────────

/** The picker rows. "(beta)" rides on the refreshAll row here only, not in
 * `TAP_ACTION_LABELS`, because the badges and the review labels share those
 * words and have no room for it. Beta because watchOS's redraw budget decides
 * whether the other tiles redraw (see `refreshAllBudgetHint`). */
const TAP_TYPES: [TapAction["type"], string][] = TAP_ACTION_LABELS.map(([t, label]) =>
  [t, t === "refreshAll" ? `${label} (beta)` : label]);

/** A tap layer offers everything but "Nothing": a layer that does nothing would
 * just let the tap fall through to the whole-complication action, which is what
 * deleting the layer does. "Cancel a timer" is gone from every picker because
 * the watch runs the start / pause intent for it; a stored one stays
 * selectable through `tapActionMenu`. */
const LAYER_TAP_TYPES: [TapAction["type"], string][] =
  TAP_TYPES.filter(([t]) => t !== "none" && t !== "timerCancel");

/** The whole complication does not offer "Nothing" either, for a different
 * reason: the watch cannot deliver it. A widget with no button and no
 * `widgetURL` still opens the app when it is tapped, and WidgetKit gives no way
 * out of that, so "Nothing" was "Open the app" wearing the wrong name. Measured
 * on a Series 10, 2026-09-16. It differed from the real "Open the app" only by
 * skipping that action's timeline reload, which is not worth a choice of its
 * own. A document that already stores it keeps it (`generalEditor` puts it back
 * in the list), because opening the editor must never change a setting. */
const DOC_TAP_TYPES: [TapAction["type"], string][] = LAYER_TAP_TYPES;

/** The document's tap choices, with whatever it already stores kept selectable.
 * Same rule the Auto refresh timer row follows: a value the list no longer
 * offers stays in it, so opening the editor never silently changes what the
 * watch is doing. */
function tapTypesFor(tap: TapAction): [TapAction["type"], string][] {
  if (DOC_TAP_TYPES.some(([t]) => t === tap.type)) return DOC_TAP_TYPES;
  return [...DOC_TAP_TYPES, [tap.type, tapActionLabel(tap)]];
}

/** The entity a tap action is aimed at, wherever it keeps it: spread flat on an
 * entity action, nested on a service call. */
function tapTarget(action: TapAction): EntityRef | undefined {
  if ("entityId" in action) return { entityId: action.entityId, displayName: action.displayName, domain: action.domain };
  if (action.type === "callService") return action.target;
  return undefined;
}

/**
 * What a tap picker stores when the type changes. Whatever entity the previous
 * action was aimed at carries over, so switching between a toggle, a scene and a
 * service call never makes the author pick the same entity twice, and switching
 * back to a service call keeps the domain, service and data it already had.
 *
 * One function for both pickers: the document's tap and every layer's used to
 * hold their own copies of this and of the "does this type need an entity"
 * predicate.
 */
export function tapActionForType(type: TapAction["type"], current: TapAction): TapAction {
  const ref = tapTarget(current) ?? { entityId: "", displayName: "", domain: "" };
  if (type === "refresh") {
    // What the tap fetches is the author's work, not a side effect of the type,
    // so switching away and back inside the picker keeps the layer list. The
    // "All layers" box under the row is what clears it.
    if (current.type !== "refresh" || current.layerIds === undefined) return { type: "refresh" };
    return { type: "refresh", layerIds: [...current.layerIds] };
  }
  if (type === "callService") {
    const out: CallServiceAction = current.type === "callService"
      ? { ...current }
      : { type: "callService", serviceDomain: "", serviceName: "" };
    if (ref.entityId !== "") out.target = ref;
    return out;
  }
  if (type === "refreshAll") {
    // What this tap refreshes is the author's work, not a side effect of the
    // type, so switching away and back inside the picker keeps it.
    if (current.type !== "refreshAll") return { type: "refreshAll" };
    const out: RefreshAllAction = { type: "refreshAll" };
    if (current.allPlaced === true) return { ...out, allPlaced: true };
    if (current.targets !== undefined && current.targets.length > 0) out.targets = [...current.targets];
    // The per-complication narrowing is the author's work too, so it comes back
    // with the picks rather than being rebuilt box by box.
    if (current.targetLayers !== undefined) out.targetLayers = { ...current.targetLayers };
    return out;
  }
  if (type === "showPage") {
    // The picked page is the author's work, so switching away and back keeps it.
    return { type: "showPage", page: current.type === "showPage" ? current.page : 1 };
  }
  if (tapNeedsEntity(type)) return { type: type as "toggleEntity", ...ref };
  // Everything left carries nothing at all.
  return { type: type as "openApp" };
}

/**
 * The tap action picker: a button naming the current action, and a menu that
 * files every action under a heading with one line saying what it does.
 *
 * Not a `<select>`: a native menu on a Mac shows no text but the names, and a
 * hover tooltip would be lost on a phone anyway, so the line is drawn under
 * each name where a touch screen can read it too. The rows are always built,
 * not only while the menu is open: seventeen buttons cost nothing, and it keeps
 * every name in the markup for the tests that read it.
 *
 * A type the surface no longer offers but the action already stores stays in
 * the list, last, so opening the editor never changes what the watch does.
 */
function tapActionMenu(
  label: string,
  value: TapAction["type"],
  options: [TapAction["type"], string][],
  set: (v: TapAction["type"]) => void,
  key: string,
  onPhone = false,
): TemplateResult {
  const offered: [TapAction["type"], string][] = options.some(([t]) => t === value)
    ? options
    : [...options, [value, tapActionLabel({ type: value } as TapAction)]];
  const name = (t: TapAction["type"]) => offered.find(([o]) => o === t)?.[1] ?? t;
  const grouped = new Set(TAP_ACTION_GROUPS.flatMap(([, types]) => types));
  const sections: [string | undefined, TapAction["type"][]][] = [
    ...TAP_ACTION_GROUPS.map(([title, types]): [string, TapAction["type"][]] =>
      [title, types.filter((t) => offered.some(([o]) => o === t))]),
    [undefined, offered.map(([t]) => t).filter((t) => !grouped.has(t))],
  ];
  // Without popovers (an old browser) the plain select still works; it only
  // loses the lines.
  if (!popoverSupported()) return selectField(label, value, offered, set);
  const id = popoverId(`${key}-tapmenu`);
  return html`<div class="field value-chip-field tap-menu-field">
    <span>${label}</span>
    <button type="button" class="value-chip" popovertarget=${id} aria-haspopup="menu"
      title=${`${label}: ${name(value)}. ${tapActionInfo(value, onPhone)}`}>
      <span class="chip-text">${name(value)}</span>
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    <div class="tap-menu" id=${id} popover role="menu" aria-label=${label} @toggle=${onValuePopoverToggle}>
      ${sections.filter(([, types]) => types.length > 0).map(([title, types]) => html`
        <div class="tap-menu-group" role="group" aria-label=${title ?? "Other"}
          data-group=${(title ?? "other").toLowerCase().replace(/[^a-z]+/g, "-")}>
          ${title === undefined ? nothing : html`<div class="tap-menu-head" role="presentation">${title}</div>`}
          ${types.map((t) => html`<button type="button" role="menuitemradio" aria-checked=${t === value ? "true" : "false"}
            class=${t === value ? "on" : ""} popovertarget=${id} popovertargetaction="hide"
            @click=${() => { if (t !== value) set(t); }}>
            <span class="tap-menu-name">${name(t)}</span>
            <span class="tap-menu-info">${tapActionInfo(t, onPhone)}</span>
          </button>`)}
        </div>`)}
    </div>
  </div>`;
}

/**
 * The page a "Show one page" tap lands on, one row per page the document has.
 *
 * Nothing on a document without pages: the note under the tap already says to
 * add one. A stored page past the last one stays in the list, so opening the
 * editor never changes it; the watch shows the last page for it meanwhile.
 */
function showPageField(host: EditorHost, action: ShowPageAction, set: (next: ShowPageAction) => void): TemplateResult | typeof nothing {
  if (!usesPages(host.config)) return nothing;
  const count = pagesSpecOf(host.config).count;
  const options: [string, string][] = Array.from({ length: count }, (_, i) => [String(i + 1), `Page ${i + 1}`]);
  if (action.page > count) options.push([String(action.page), `Page ${action.page} (not there yet)`]);
  return selectField("Page", String(action.page), options, (v) => set({ type: "showPage", page: Number(v) || 1 }));
}

/**
 * How long each page shows while Play all pages plays, under that tap.
 *
 * Here and not in the Pages card, because nothing else reads these times:
 * stepping taps and Show one page ignore them. One "Same for every page" field
 * sets them all at once, and each page can still differ below it. The times
 * belong to the document, so every Play all pages tap shares them; with more
 * than one, a line says so, because editing them under one tap changes the
 * others too.
 */
function tourHoldFields(host: EditorHost): TemplateResult | typeof nothing {
  const cfg = host.config;
  if (!usesPages(cfg)) return nothing;
  const spec = pagesSpecOf(cfg);
  const range = { step: 0.5, min: PAGE_DWELL_RANGE.min, max: PAGE_DWELL_RANGE.max, optional: true, unit: "s",
    placeholder: String(PAGE_DEFAULT_DWELL), def: null };
  const taps = playTourTapCount(cfg);
  return html`
    ${numberField("Same for every page", sharedDwell(spec),
      (v) => host.update((c) => { setAllPageDwells(c, v); }, "pages-dwell-all"), range)}
    <div class="grid2">
      ${pageNumbers(spec).map((n) => numberField(`Page ${n} hold`, writtenDwell(spec, n),
        (v) => host.update((c) => { setPageDwell(c, n, v); }, `pages-dwell-${n}`), range))}
    </div>
    <div class="hint">Tour lasts ${dwellSeconds(tourDuration(spec))}.${taps > 1
      ? " These times are shared by every Play all pages tap." : ""}</div>
    ${host.tour ? html`<button class="small" aria-pressed=${host.tour.playing ? "true" : "false"}
      title=${host.tour.playing
        ? "Stop the tour. The page stays where it got to, the way a tap on the watch takes over from a tour."
        : "Play every page once on the canvas with these times, then back to page 1, the way the watch plays it."}
      @click=${() => host.tour?.toggle()}>${host.tour.playing ? "Stop" : "Test on canvas"}</button>` : nothing}`;
}

/** The line under a tap picker for an action that needs one, or nothing. Every
 * picker renders this, so the sentence is written once, in the model, beside
 * the labels themselves. */
function tapNote(action: TapAction, pages = false): TemplateResult | typeof nothing {
  const note = tapActionNote(action, pages);
  return note === undefined ? nothing : html`<div class="hint">${note}</div>`;
}

/**
 * WidgetKit's daily redraw budget, per placed complication, as Apple's
 * "Keeping a widget up to date" states it. The two hints below quote it.
 */
const REDRAW_BUDGET = "40 to 70";

/**
 * The redraw budget under a "Refresh multiple complications" tap.
 *
 * A tap is free only for the tile that was tapped. Every other tile it
 * refreshes spends one of its own redraws, and a tile that has none left gets
 * the new data but keeps drawing the old until watchOS allows another. Found
 * from support logs WA-425074 and WA-3002B8: the data landed for every target
 * in under a second, and only the tapped tile redrew.
 *
 * Always amber: this is the one thing a reader must know before trusting the
 * tap (Jesse, 2026-09-23). A timed refresh on this complication or on any it
 * reaches adds a sentence, because that is when the others run dry.
 */
function refreshAllBudgetHint(host: EditorHost, action: RefreshAllAction): TemplateResult {
  const docs = host.documents ?? [];
  const selfId = host.config.id.toUpperCase();
  const reached = action.allPlaced === true
    ? docs
    : docs.filter((d) => (action.targets ?? []).includes(d.id.toUpperCase()));
  const timed = (host.config.refreshMinutes ?? 0) > 0
    || reached.some((d) => d.id.toUpperCase() !== selfId && (d.refreshMinutes ?? 0) > 0);
  return html`<div class="hint keep budget">watchOS gives each complication
    ${REDRAW_BUDGET} redraws a day. The one you tap always redraws, because a tap is free. Every
    other complication this tap refreshes spends one of its own. When one has none left, it gets
    the new data but keeps showing the old until watchOS allows another redraw, or until you open
    Wrist Assistant on the watch.${timed
      ? html` An Auto refresh timer is on here or on a complication this tap reaches, and it spends the
        same budget. Every 15 minutes is 96 a day, more than the whole budget.`
      : nothing}</div>`;
}

/**
 * The redraw budget under a plain Refresh tap. The tap itself never spends it,
 * so this is reassurance, never amber. What an Auto refresh timer does to the
 * budget is said once, under the Auto refresh timer row, not again here.
 */
function refreshBudgetHint(): TemplateResult {
  return html`<div class="hint keep">A tap always redraws this complication. watchOS does not
    count it against the ${REDRAW_BUDGET} redraws a day each complication gets.</div>`;
}

/**
 * The warning under the Auto refresh timer row once a timer is picked. Every timed
 * refresh spends one of the complication's daily redraws, so it says how many
 * this choice spends and points at the free alternative: a tap, for the reader
 * who wants the value at one moment rather than all day.
 */
function timedRefreshBudgetHint(minutes: number): TemplateResult {
  const perDay = Math.round((24 * 60) / minutes);
  const every = refreshLabel(minutes);
  const verdict = perDay > 70
    ? `${every} is ${perDay} a day, more than the whole budget, so refreshes stop later in the day.`
    : perDay >= 40
      ? `${every} is ${perDay} a day, which can use up the whole budget.`
      : `${every} is ${perDay} a day, which fits, but leaves fewer for a Refresh multiple complications tap.`;
  return html`<div class="hint keep budget">watchOS gives each complication ${REDRAW_BUDGET}
    redraws a day, and every timed refresh spends one. ${verdict} When the budget runs out, the
    complication keeps showing old data until watchOS allows more. If you want the value at one
    moment rather than all day, set Tap action to "Refresh this complication" instead: a tap is
    free and always redraws.</div>`;
}

/**
 * Which complications a "Refresh multiple complications" tap reaches: all the
 * ones placed on the watch, or the ones ticked below.
 *
 * The document being edited heads the list, marked "(current)", ticked and
 * disabled: it always refreshes itself whatever is picked, so the row is there
 * to say so rather than to be changed. A picked id this watch does not have
 * stays in the list as "Not on this watch" so it can be unticked; dropping it
 * silently would edit the author's choice on their behalf.
 *
 * That row is worded for arrival, not for deletion, because arrival is the
 * common way to get one. A tap carries its picks as raw document ids and a
 * share copies them across untouched, so every imported complication whose tap
 * reached its neighbours lands here with picks that name nothing on this watch.
 * Saying "deleted" sent the reader looking for something they had removed.
 *
 * A ticked complication carries its own "All layers" box, so one tap can fetch
 * two cameras from the kitchen face and everything from the hall one. The
 * current complication carries the same box: it always refreshes, but how much
 * of it is still the author's to say. A deleted id gets no box, because nothing
 * here knows what layers it had.
 */
function refreshTargetsField(
  host: EditorHost,
  action: RefreshAllAction,
  set: (next: RefreshAllAction) => void,
): TemplateResult {
  const all = action.allPlaced === true;
  const picked = action.targets ?? [];
  const selfId = host.config.id.toUpperCase();
  const others = (host.documents ?? [])
    .map((d) => ({ id: d.id.toUpperCase(), name: d.name, layers: d.layers }))
    .filter((d) => d.id !== selfId)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  const missing = picked.filter((id) => !others.some((d) => d.id === id));

  const pick = (id: string, on: boolean) => set(refreshTargetsWith(action, id, on));
  const pickAll = (on: boolean) => set(on ? { type: "refreshAll", allPlaced: true } : { type: "refreshAll" });

  if (all) {
    return html`
      ${checkField("All placed complications", true, pickAll)}
      <div class="hint warn">Every placed complication is redrawn from one tap. With a lot of them,
        or ones that draw pictures or charts, the whole round can take a while and the last ones
        update late. Pick the few you need instead when the wait shows.</div>`;
  }
  // The layers of a complication the tap reaches hang off its own row, one
  // indent further in, the way the layers of this complication hang off the
  // "All layers" box in the card above.
  const nested = (id: string, layers: () => readonly CElement[], own: boolean) => {
    const box = refreshTargetLayersField(host, action, id, layers, own, set);
    return box === nothing ? nothing : html`<div class="sub-checks">${box}</div>`;
  };
  const selfName = host.config.name.trim();
  const rows = [
    html`
      ${checkField(`${selfName === "" ? "Unnamed" : selfName} (current)`, true, () => {}, undefined, { disabled: true })}
      ${nested(selfId, () => host.config.elements, true)}`,
    ...others.map((d) => html`
      ${checkField(d.name || "Unnamed", picked.includes(d.id), (on) => pick(d.id, on))}
      ${picked.includes(d.id) ? nested(d.id, d.layers, false) : nothing}`),
    ...missing.map((id) => checkField("Not on this watch", true, (on) => pick(id, on))),
  ];
  return html`
    ${checkField("All placed complications", false, pickAll)}
    ${rows}
    ${others.length === 0 && missing.length === 0
      ? html`<div class="hint keep">No other complications on this watch yet.</div>`
      : nothing}
    <div class="hint keep">This complication always refreshes itself, so its box stays on.</div>`;
}

/**
 * The "All layers" box for one complication inside the multi-complication
 * picker, and that complication's fetching layers once the box is off.
 *
 * The rules are `refreshLayersField`'s, applied per complication: only the
 * layers that cost a fetch of their own are worth narrowing, so only those are
 * listed, and a complication with none of them gets no box at all rather than a
 * box that could not change anything.
 *
 * `own` is the complication being edited. Only its layers are on the preview,
 * so only its rows peek: a pointer over another complication's layer has
 * nothing to draw and does nothing.
 */
function refreshTargetLayersField(
  host: EditorHost,
  action: RefreshAllAction,
  docId: string,
  layers: () => readonly CElement[],
  own: boolean,
  set: (next: RefreshAllAction) => void,
): TemplateResult | typeof nothing {
  const narrowed = action.targetLayers?.[docId];
  const all = narrowed === undefined;
  const picked = narrowed ?? [];
  // The edited document is described with its own named values and the live
  // states. Another document is described with the states alone: its named
  // values are not carried into the picker, and every layer listed here names
  // itself by its entity or its own value, so the only label this costs is one
  // built on a shared value, which reads as "named" and its id instead.
  const ctx: DescribeContext = own
    ? describeContext(host)
    : { hass: host.hass, elements: layers() };
  const fetches = layers()
    .filter(layerCostsAFetch)
    .map((el) => ({ id: el.payload.id, label: `${layerTitle(el, ctx)} (${KIND_LABEL[el.kind]})` }));
  const missing = picked.filter((id) => !fetches.some((f) => f.id === id));

  const pick = (id: string, on: boolean) => set(refreshTargetLayersWith(action, docId, id, on));
  const pickAll = (on: boolean) => set(refreshTargetAllLayersWith(action, docId, on));

  // Nothing to narrow, so the box is not offered at all rather than offered and
  // then explained away. Same rule the card above follows.
  if (all && fetches.length === 0) return nothing;
  if (all) return checkField("All layers", true, pickAll);
  if (fetches.length === 0 && missing.length === 0) {
    return html`
      ${checkField("All layers", false, pickAll)}
      <div class="hint keep">Nothing on this one fetches anything of its own, so there is
        nothing to narrow.</div>`;
  }
  // The edited complication is the one on the preview, so only its rows light a
  // layer up under the pointer. Another complication's rows are plain.
  const layerRow = (id: string, label: string, on: boolean) => {
    const box = checkField(label, on, (v) => pick(id, v));
    if (!own) return html`<div>${box}</div>`;
    return html`
      <div class="peek-row"
        @pointerenter=${() => host.peekLayer(id, true)}
        @pointerleave=${() => host.peekLayer(id, false)}>
        ${box}
      </div>`;
  };
  return html`
    ${checkField("All layers", false, pickAll)}
    <div class="sub-checks">
      ${fetches.map((f) => layerRow(f.id, f.label, picked.includes(f.id)))}
      ${missing.map((id) => layerRow(id, "Deleted layer", true))}
      <div class="hint keep">Nothing ticked still refreshes this whole complication.</div>
    </div>`;
}

/**
 * Whether a layer costs a fetch of its own, which is the only kind worth
 * offering in the scoped-refresh picker.
 *
 * A picture is one signed request per layer, a chart and a timeline one recorder
 * query each, and a calendar, to-do or forecast list one service call. Text,
 * icons, gauges, shapes and the chart extras all ride on the single rendered
 * document the refresh fetches anyway, so ticking one of those would save
 * nothing and only make the list longer. An uploaded picture carries its own
 * bytes and fetches nothing at all.
 */
function layerCostsAFetch(el: CElement): boolean {
  if (el.kind === "image") return el.payload.source !== "inline";
  if (el.kind === "chart" || el.kind === "timeline") return true;
  if (el.kind === "list") {
    const kind = el.payload.source.kind;
    return kind === "calendar" || kind === "todo" || kind === "forecast";
  }
  return false;
}

/**
 * How much of this complication a "Refresh this complication" tap fetches: all
 * of it, or the layers ticked below.
 *
 * "All layers" is the same gesture "All placed complications" uses in the card
 * above, and it is the whole difference between the two shapes of the action: on
 * means no layer list at all, off means a list that starts empty.
 *
 * Only the layers that cost a fetch are listed, because those are the only ones
 * narrowing can help: ten cameras cannot all come back inside one tap's budget,
 * and a face that draws ten and cares about one has to be able to say so.
 *
 * Nothing ticked still refreshes the whole complication rather than nothing, so
 * the empty state is safe rather than broken, and the note under the picker says
 * so. A ticked id the document no longer has stays in the list under a plain
 * name so it can be unticked; dropping it silently would edit the author's
 * choice on their behalf.
 */
function refreshLayersField(
  host: EditorHost,
  action: RefreshAction,
  set: (next: RefreshAction) => void,
): TemplateResult | typeof nothing {
  const all = action.layerIds === undefined;
  const picked = action.layerIds ?? [];
  const ctx = describeContext(host);
  const fetches = host.config.elements
    .filter(layerCostsAFetch)
    .map((el) => ({ id: el.payload.id, label: `${layerTitle(el, ctx)} (${KIND_LABEL[el.kind]})` }));
  const missing = picked.filter((id) => !fetches.some((f) => f.id === id));

  const pick = (id: string, on: boolean) => set(refreshLayersWith(action, id, on));
  const pickAll = (on: boolean) => set(on ? { type: "refresh" } : { type: "refresh", layerIds: [] });

  // A complication whose layers all ride on the one rendered document has
  // nothing to narrow, so the box is not offered at all rather than offered and
  // then explained away.
  if (all && fetches.length === 0) return nothing;
  if (all) {
    return html`
      ${checkField("All layers", true, pickAll)}
      <div class="hint keep">Untick this to fetch only some of them. Pictures, charts, timelines
        and calendar or to-do lists are the ones that cost a request each.</div>`;
  }
  if (fetches.length === 0 && missing.length === 0) {
    return html`
      ${checkField("All layers", false, pickAll)}
      <div class="hint keep">No layer on this complication fetches anything of its own,
        so there is nothing to narrow. Pictures, charts, timelines and calendar or to-do lists are
        the ones that cost a request each.</div>`;
  }
  // The pointer on a row draws that layer selected on the preview, the same as
  // a pointer on its Layers row. Several pictures on one face are told apart by
  // where they sit, not by their names, so the picture is the label that works.
  const layerRow = (id: string, label: string, on: boolean) => html`
    <div class="peek-row"
      @pointerenter=${() => host.peekLayer(id, true)}
      @pointerleave=${() => host.peekLayer(id, false)}>
      ${checkField(label, on, (v) => pick(id, v))}
    </div>`;
  return html`
    ${checkField("All layers", false, pickAll)}
    <div class="sub-checks">
      ${fetches.map((f) => layerRow(f.id, f.label, picked.includes(f.id)))}
      ${missing.map((id) => layerRow(id, "Deleted layer", true))}
      <div class="hint keep">Only the layers that fetch something of their own are listed. Text,
        icons and gauges all arrive in one request, so narrowing them saves nothing.</div>
    </div>`;
}

/** Domain, service and data for the common calls, so the usual ones are one
 * click rather than two fields of typing. The list mirrors the app's control
 * action catalogue: the same services the Control a Device step offers. */
const SERVICE_QUICK_PICKS: [label: string, domain: string, service: string, data: string][] = [
  ["Open a cover", "cover", "open_cover", ""],
  ["Close a cover", "cover", "close_cover", ""],
  ["Stop a cover", "cover", "stop_cover", ""],
  ["Lock", "lock", "lock", ""],
  ["Unlock", "lock", "unlock", ""],
  ["Light brightness", "light", "turn_on", `{"brightness_pct": 50}`],
  ["Climate target", "climate", "set_temperature", `{"temperature": 21}`],
  ["Play / pause", "media_player", "media_play_pause", ""],
  ["Start a vacuum", "vacuum", "start", ""],
  ["Send a vacuum home", "vacuum", "return_to_base", ""],
];

/**
 * The form behind "Call a service": the service to call, the entity to call it
 * on (optional, any domain), and the data as JSON. Shared by the document's tap
 * card and every tap layer's.
 *
 * The data is stored as the string the author typed, so a half-written object
 * survives a redraw; it is checked here and again on the watch, which drops the
 * tap rather than sending something Home Assistant would reject.
 */
function callServiceFields(
  host: EditorHost,
  action: CallServiceAction,
  set: (next: CallServiceAction, k?: string) => void,
  key: string,
): TemplateResult {
  const data = action.serviceDataJSON ?? "";
  const dataOK = serviceDataIsValid(data);
  const target = action.target ?? { entityId: "", displayName: "", domain: "" };
  return html`
    <div class="gen-row">
      ${textField("Domain", action.serviceDomain, (v) => set({ ...action, serviceDomain: v.trim() }, "svc-domain"), { placeholder: "light" })}
      ${textField("Service", action.serviceName, (v) => set({ ...action, serviceName: v.trim() }, "svc-name"), { placeholder: "turn_on" })}
    </div>
    <div class="chips">
      ${SERVICE_QUICK_PICKS.map(([label, domain, service, seed]) => html`
        <button class="small" title=${`Fill in ${domain}.${service}`}
          @click=${() => {
            const next: CallServiceAction = { ...action, serviceDomain: domain, serviceName: service };
            if (seed === "") delete next.serviceDataJSON; else next.serviceDataJSON = seed;
            set(next);
          }}>${label}</button>`)}
    </div>
    ${entityField(host, "Target entity (optional)", target, (ref) => {
      const next: CallServiceAction = { ...action };
      if (ref.entityId === "") delete next.target; else next.target = ref;
      set(next, "svc-entity");
    }, `${key}-svc-entity`)}
    ${itemPlaceholders(host, (text) => {
      const next: CallServiceAction = { ...action };
      next.target = { entityId: text, displayName: "", domain: "" };
      set(next, "svc-entity");
    }, "the target entity")}
    ${textArea("Data (JSON)", data, (v) => {
      const next: CallServiceAction = { ...action };
      if (v.trim() === "") delete next.serviceDataJSON; else next.serviceDataJSON = v;
      set(next, "svc-data");
    }, 3)}
    ${itemPlaceholders(host, (text) => {
      const next: CallServiceAction = { ...action };
      next.serviceDataJSON = `${data}${text}`;
      set(next, "svc-data");
    }, "the data")}
    ${dataOK
      ? html`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`
      : html`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`;
}

// There is no slot picker. The slot index is plumbing: the panel assigns the
// first free one at create/duplicate time and it never changes afterwards,
// because moving a complication to another slot blanks its placement on the
// watch face. The face picker lists complications by name, so the number
// means nothing to the user.

/** Whether the current name differs from the one the watch last had, ignoring
 * surrounding whitespace and blanks. Undefined `savedName` means a brand-new
 * complication with nothing on the watch yet, so there is nothing to warn about. */
export function nameChangedFromWatch(savedName: string | undefined, name: string): boolean {
  return savedName !== undefined && name.trim() !== "" && name.trim() !== savedName.trim();
}

/**
 * The Complication card: the settings that belong to the whole document.
 *
 * `nameOnly` is for the Control Center tab, where three of the four rows would
 * be about something the view is not showing. Refresh, the tap action and the
 * flash are what a shape does on the face; a control has its own action row and
 * is drawn from the last sync whatever Refresh says. The name is shared, and it
 * is the title a new control borrows, so it stays.
 */
export function generalEditor(host: EditorHost, opts: { nameOnly?: boolean; shape?: { line: string; note?: string } } = {}): TemplateResult {
  const cfg = host.config;
  // The watch face picker caches each complication's name per widget kind and
  // does not refresh it after a rename. Warn once the name actually differs
  // from what the watch last had, so the user knows to re-pick it there.
  const renamed = nameChangedFromWatch(host.savedName, cfg.name);
  const refresh = cfg.refreshMinutes ?? 0;
  const refreshOptions: [string, string][] = REFRESH_CHOICES.map((m) => [String(m), refreshLabel(m)]);
  // A stored value that is not one of the choices stays selectable, so
  // opening the editor never silently changes it.
  if (!REFRESH_CHOICES.includes(refresh)) refreshOptions.push([String(refresh), refreshLabel(refresh)]);
  const flashOn = cfg.showSuccessFlash ?? true;
  const renamedNote = renamed
    ? html`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`
    : nothing;
  // What this complication is and where it lives, as a line to read rather
  // than a setting: one shape on one device is fixed once it is made.
  const shapeLine = opts.shape === undefined ? nothing
    : html`<div class="field readout shape-line" title=${opts.shape.note ?? nothing}><span>Shape</span>
        <span class="readout-v">${opts.shape.line}</span></div>`;
  if (opts.nameOnly === true) {
    return html`
      <div class="gen-row">
        ${textField("Name", cfg.name, (v) => host.update((c) => { c.name = v; }, "name"))}
        ${shapeLine}
      </div>
      ${renamedNote}`;
  }
  // One row each: name, shape, tap action, refresh, flash. Anything a tap
  // action needs beyond its type (an entity, a page, a service) follows the
  // tap row.
  return html`
    <div class="gen-row">
      ${textField("Name", cfg.name, (v) => host.update((c) => { c.name = v; }, "name"))}
      ${shapeLine}
    </div>
    ${renamedNote}
    ${docTapFields(host)}
    <div class="gen-row">
      ${selectField("Auto refresh", String(refresh), refreshOptions, (v) => host.update((c) => { c.refreshMinutes = Number(v) || 0; }, "refresh"))}
      ${refresh > 0 ? timedRefreshBudgetHint(refresh) : nothing}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${flashOn} title="Flash when a tap works"
            @change=${(e: Event) => host.update((c) => { c.showSuccessFlash = (e.target as HTMLInputElement).checked; })} />
          ${flashOn
            ? html`<input type="color" class="flash-color" title="Flash color. Click to change it." .value=${(cfg.successFlashColorHex ?? FLASH_DEFAULT).slice(0, 7)}
                @input=${onInput((v) => host.update((c) => { c.successFlashColorHex = v.toUpperCase(); }, "flash"))} />`
            : html`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>`;
}

/**
 * The whole complication's tap: the picker and whatever the action needs
 * beyond its type. The Complication card shows it, and so does the Tap card of
 * the shape's own Background, since a tap on the background and a tap on the
 * complication are the same tap.
 */
function docTapFields(host: EditorHost): TemplateResult {
  const cfg = host.config;
  const tap = cfg.tapAction;
  return html`
    ${tapActionMenu("Tap action", tap.type, tapTypesFor(tap), (v) => host.update((c) => {
      c.tapAction = tapActionForType(v, c.tapAction);
      // Mirrors the iPhone preset editor: the chosen page belongs to the
      // openPage type; leaving it clears the choice.
      if (v !== "openPage") { delete c.openPageId; delete c.openPageName; }
    }), "doc-tap", host.deviceKind === "iphone")}
    ${tapNote(tap, usesPages(cfg))}
    ${tap.type === "refreshAll"
      ? refreshTargetsField(host, tap, (next) => host.update((c) => { c.tapAction = next; }))
      : nothing}
    ${tap.type === "refreshAll" ? refreshAllBudgetHint(host, tap) : nothing}
    ${tap.type === "refresh"
      ? refreshLayersField(host, tap, (next) => host.update((c) => { c.tapAction = next; }))
      : nothing}
    ${tap.type === "refresh" ? refreshBudgetHint() : nothing}
    ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => host.update((c) => { c.tapAction = { type: tap.type, ...ref }; }, "tap-entity"), "general-tap") : nothing}
    ${tap.type === "callService"
      ? callServiceFields(host, tap, (next, k) => host.update((c) => { c.tapAction = next; }, k), "general-tap")
      : nothing}
    ${tap.type === "showPage" ? showPageField(host, tap, (next) => host.update((c) => { c.tapAction = next; }, "tap-page")) : nothing}
    ${tap.type === "playTour" ? tourHoldFields(host) : nothing}
    ${tap.type === "openPage" ? openPageField(host) : nothing}`;
}

/** The Tap card at the top of the shape's cards: the whole complication's
 * tap, folded to its summary like a layer's Tap card. */
export function docTapCard(host: EditorHost): TemplateResult {
  return card(host, "tappable", "Tap", docTapFields(host),
    { color: SECTION_COLOR.tap, icon: "tap", summary: tapSummary(host.config, host.config.tapAction) });
}

/** Seconds as the tour line prints them: whole where it can be, one decimal
 * where the dwells do not add up to one. */
function dwellSeconds(seconds: number): string {
  return `${Math.round(seconds * 10) / 10} s`;
}

/** What the swatch shows while no color is stored: the watch's own fallback
 * for a custom complication. Nothing is written until the user picks a
 * color. */
const FLASH_DEFAULT = CUSTOM_FLASH_DEFAULT;

/** Refresh choices, in minutes. 0 means the watch never refreshes on a timer.
 * watchOS wakes a complication at most every 15 minutes, and the watch rounds
 * anything shorter up to that, so nothing under 15 is offered. */
const REFRESH_CHOICES = [0, 15, 30, 60, 120];

function refreshLabel(m: number): string {
  if (m === 0) return "None";
  if (m % 60 === 0) return m === 60 ? "Every hour" : `Every ${m / 60} hours`;
  return m === 1 ? "Every minute" : `Every ${m} minutes`;
}

/** Page picker for the openPage tap action. Options come from the watch's
 * page report; a stored id the report no longer lists stays selectable under
 * its stored name so opening the editor never silently drops the choice. */
function openPageField(host: EditorHost): TemplateResult {
  const cfg = host.config;
  return pageChoiceField(host, cfg.openPageId, cfg.openPageName, (id, name) => host.update((c) => {
    if (id === undefined) { delete c.openPageId; delete c.openPageName; return; }
    c.openPageId = id;
    if (name) c.openPageName = name; else delete c.openPageName;
  }));
}

/** The page picker behind an openPage action, for the document and for a tap
 * layer alike. `set` gets undefined when the choice is cleared, else the page
 * id and its name when the watch reported one. */
function pageChoiceField(host: EditorHost, pageId: string | undefined, pageName: string | undefined, set: (id: string | undefined, name: string | undefined) => void): TemplateResult {
  const current = pageId ?? "";
  const options: [string, string][] = host.pages.map((p) => [p.id, p.name || "Unnamed page"]);
  if (current && !host.pages.some((p) => p.id.toUpperCase() === current.toUpperCase())) {
    options.unshift([current, `${pageName || "Unknown page"} (not on the watch)`]);
  }
  if (!current) options.unshift(["", "Choose a page…"]);
  if (options.length <= 1 && !current) {
    return html`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`;
  }
  return html`${selectField("Page", current, options, (v) => {
    if (!v) { set(undefined, undefined); return; }
    set(v, host.pages.find((p) => p.id === v)?.name);
  })}
  ${current ? nothing : html`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`;
}

// ── Control Center ────────────────────────────────────────────────────────
// One control per document, edited as a properties sheet rather than as a
// face. Control Center draws a title, a value line, a symbol and a tint, and
// the OS gives us nothing else to draw into: there is no layer list here and
// there never can be. The mock tile at the top of the card goes through the
// same `resolveControl` the device uses, so it cannot drift from the wrist.

const CONTROL_KINDS: [ControlKind, string][] = [["toggle", "Toggle"], ["button", "Button"]];

/** The actions a control may run, in the order and under the names every
 * other tap picker uses. */
const CONTROL_TAP_TYPES: [TapAction["type"], string][] =
  TAP_ACTION_LABELS.filter(([t]) => CONTROL_ACTION_TYPES.includes(t));

/** The height of the mock tile in the card, in CSS pixels. Every shape a
 * control takes is sized off its height (a watch pill, an iPhone circle, an
 * iPhone wide pill), so one number says the whole drawing. */
export const CONTROL_TILE_SIDE = 82;

/** Under this height a tile draws its glyph alone. Everything on a control is
 * sized off the tile, so a shape-tab-sized copy would carry a title two pixels
 * tall: a smear that says less than the empty space does. */
const CONTROL_TILE_TEXT_FROM = 40;

/** What the mock paints a control that names no color: the system blue an
 * untinted control draws with. Never written to the document. */
const CONTROL_MOCK_TINT = "#0A84FF";

/**
 * The shapes a control takes in Control Center, one drawing each.
 *
 * Checked against the devices 2026-09-16, not guessed. The watch draws a wide
 * pill with the symbol alone, and prints the title and value line above the
 * grid of tiles. The iPhone draws a circle in the grid, or a wide pill when the
 * control is given two columns, and puts the title and value line inside the
 * wide one. Neither device draws a rounded square, which is what the first
 * version of this mock guessed at.
 */
export type ControlTileShape = "watchPill" | "phoneCircle" | "phoneWide";

/** The shapes a device draws, in the order the card shows them. */
export function controlTileShapes(device: DeviceKind): ControlTileShape[] {
  return device === "iphone" ? ["phoneCircle", "phoneWide"] : ["watchPill"];
}

/** The device the host edits for; a test host that names none is a watch. */
export function controlDevice(host: EditorHost): DeviceKind {
  return host.deviceKind ?? "watch";
}

/**
 * The line the watch prints above its tiles for this control: the title, then
 * the value line after a colon. A toggle with no value line gets On or Off,
 * which is what the app's toggle draws in that slot; a button with none gets
 * the title alone.
 */
export function controlHeadline(control: ResolvedControl): string {
  const value = controlValueLine(control);
  return value === undefined ? control.title : `${control.title}: ${value}`;
}

/** The line under the title as the device draws it: the value line, or for a
 * toggle with none the On or Off the app's toggle prints in that slot. A
 * button with none has no line. */
export function controlValueLine(control: ResolvedControl): string | undefined {
  return control.valueLabel ?? (control.kind === "toggle" ? (control.isOn ? "On" : "Off") : undefined);
}

/**
 * Whether the device prints this control's status on a press. The iPhone
 * prints it for a toggle and a button alike. The watch prints it for a toggle
 * only: a button's never shows, however the app attaches it (checked on a
 * watch 2026-09-16, after a restart). So the rows that write and preview the
 * status hide for a watch button, and the key stays in the document untouched.
 */
export function controlStatusShows(host: EditorHost, spec: ControlSpec): boolean {
  return controlDevice(host) === "iphone" || controlEffectiveKind(spec) === "toggle";
}

/** The word for a toggle's state, for the rows and lines that say it. Nothing
 * for a button, which has none. */
export function controlStateWord(control: ResolvedControl): string | undefined {
  return control.kind === "toggle" ? (control.isOn ? "On" : "Off") : undefined;
}

/** `hex` moved `amount` of the way to white, as `#RRGGBB`. The watch draws a
 * lit tile's symbol in a pale cast of the tint rather than in white. */
function towardWhite(hex: string, amount: number): string {
  const { valid, rgb } = colorParts(hex);
  if (!valid) return "#FFFFFF";
  const h = rgb.slice(1);
  const part = (at: number) => parseInt(h.slice(at, at + 2), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, "0");
  return `#${mix(part(0))}${mix(part(2))}${mix(part(4))}`.toUpperCase();
}

/** How a tile paints, settled once per drawing: the ground, its edge, the
 * symbol's color, and the two text colors the wide phone tile needs. */
interface TilePaint {
  background: string;
  border: string;
  glyph: string;
  title: string;
  value: string;
}

function tilePaint(shape: ControlTileShape, control: ResolvedControl): TilePaint {
  const tint = control.tintColorHex ?? CONTROL_MOCK_TINT;
  const dark = "rgba(120,120,128,0.36)";
  const darkEdge = "1px solid rgba(255,255,255,0.12)";
  if (shape === "watchPill") {
    // A lit toggle fills with the tint. A button sits on a dark ground washed
    // with the tint and rimmed in it, the way the watch's own buttons do.
    if (control.kind === "toggle" && control.isOn) {
      return { background: tint, border: "1px solid transparent", glyph: towardWhite(tint, 0.72), title: "", value: "" };
    }
    if (control.kind === "button") {
      return {
        background: `color-mix(in srgb, ${tint} 30%, #2c2c2e)`,
        border: `1px solid color-mix(in srgb, ${tint} 55%, transparent)`,
        glyph: towardWhite(tint, 0.72), title: "", value: "",
      };
    }
    return { background: dark, border: darkEdge, glyph: "#E5E5EA", title: "", value: "" };
  }
  // The iPhone: a lit toggle goes white and paints the tint on the symbol
  // only. Off, and a button, keep the dark ground; the button's symbol still
  // takes the tint.
  if (control.kind === "toggle" && control.isOn) {
    return { background: "#FFFFFF", border: "1px solid transparent", glyph: tint, title: "#000000", value: "rgba(60,60,67,0.6)" };
  }
  return {
    background: dark, border: darkEdge,
    glyph: control.kind === "button" ? tint : "#FFFFFF",
    title: "#FFFFFF", value: "rgba(235,235,245,0.6)",
  };
}

/**
 * The mock Control Center tile: the resolved symbol, and on the wide iPhone
 * tile the title and value line too, in the resolved tint, at the proportion
 * the device draws.
 *
 * `side` is the tile's height in CSS pixels and every measurement inside it is
 * a fraction of that, so one function draws the shape tab's thumbnail, the
 * card's preview and the stage's big copy. They cannot drift, which matters
 * more here than anywhere else in the panel: a control has no renderer to
 * check it against, so this drawing is the only picture of it there is.
 *
 * Nothing at all until there is a context to resolve in, the same as a face
 * preview before the first template answer lands.
 */
/**
 * The little a tile needs from its host: the document it belongs to, symbols to
 * draw with, and a context to resolve in. An `EditorHost` has all three, and so
 * does the throwaway the picker builds for a complication it is only listing,
 * which has no draft behind it and never will unless it is opened.
 */
export type ControlTileHost = Pick<EditorHost, "config" | "icons"> & Pick<EditorHost, "resolveContext">;

export function controlTile(host: ControlTileHost, spec: ControlSpec, shape: ControlTileShape, side = CONTROL_TILE_SIDE): TemplateResult | typeof nothing {
  const context = host.resolveContext?.();
  if (context === undefined) return nothing;
  const control = resolveControl(spec, context, host.config);
  const paint = tilePaint(shape, control);
  const px = (fraction: number) => Math.round(side * fraction);
  const wide = shape === "phoneWide" && side >= CONTROL_TILE_TEXT_FROM;
  const width = shape === "watchPill" ? px(1.6) : shape === "phoneWide" ? px(2.35) : side;
  const glyphSize = shape === "watchPill" ? px(0.46) : shape === "phoneCircle" ? px(0.44) : px(0.5);
  const glyph = host.icons.render(control.symbol || "questionmark", glyphSize, paint.glyph);
  const box = `width:${width}px;height:${side}px;box-sizing:border-box;`
    + `border-radius:${Math.ceil(side / 2)}px;display:flex;align-items:center;overflow:hidden;`
    + (wide ? `justify-content:flex-start;gap:${px(0.14)}px;padding:0 ${px(0.16)}px 0 ${px(0.2)}px;` : "justify-content:center;")
    + `background:${paint.background};border:${paint.border};color:${paint.glyph};`;
  const clamp = "display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere";
  return html`<span style=${box} data-shape=${shape}>
      <span style=${`display:block;flex:none;height:${glyphSize}px;line-height:0`}>${glyph ?? nothing}</span>
      ${wide
        ? html`<span style="display:block;min-width:0;flex:1 1 auto">
            <span style=${`${clamp};font-size:${px(0.17)}px;font-weight:600;line-height:1.1;color:${paint.title}`}>${control.title}</span>
            ${controlValueLine(control) === undefined
              ? nothing
              : html`<span style=${`display:block;font-size:${px(0.15)}px;line-height:1.2;color:${paint.value};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`}>${controlValueLine(control)}</span>`}
          </span>`
        : nothing}
    </span>`;
}

/** Every shape the edited device draws, side by side at one height. */
export function controlTiles(host: EditorHost, spec: ControlSpec, side = CONTROL_TILE_SIDE): TemplateResult {
  const tiles = controlTileShapes(controlDevice(host)).map((shape) => controlTile(host, spec, shape, side));
  return html`<span style=${`display:inline-flex;align-items:center;gap:${Math.round(side * 0.15)}px;flex-wrap:wrap`}>${tiles}</span>`;
}

/**
 * The tiles as rows of the card, with what the watch prints above them and
 * what a press flashes.
 *
 * Small and plain on purpose. A control is not a canvas, so a big preview in
 * the card would promise a layout that cannot be authored. The Control Center
 * tab on the canvas is where the big copy lives.
 */
function controlPreview(host: EditorHost, spec: ControlSpec): TemplateResult | typeof nothing {
  const context = host.resolveContext?.();
  if (context === undefined) return nothing;
  const control = resolveControl(spec, context, host.config);
  const watch = controlDevice(host) === "watch";
  const state = controlStateWord(control);
  return html`<div class="field readout"><span>In Control Center</span>
    <span class="readout-v">${controlTiles(host, spec)}</span></div>
    ${state === undefined
      ? nothing
      : html`<div class="field readout"><span>Reads</span><span class="readout-v">${state}${control.isOn ? ", so the tile is lit" : ", so the tile is dark"}</span></div>`}
    ${watch
      ? html`<div class="field readout"><span>Above the tiles</span><span class="readout-v">${controlHeadline(control)}</span></div>`
      : nothing}
    ${control.status === undefined || !controlStatusShows(host, spec)
      ? nothing
      : html`<div class="field readout"><span>On a press</span><span class="readout-v">${control.status}</span></div>`}`;
}

/** The one line the card shows while it is shut: what the control is, or that
 * there is none. */
function controlSummary(host: EditorHost, spec: ControlSpec | undefined): string {
  if (spec === undefined) return "Off";
  const kind = controlEffectiveKind(spec) === "toggle" ? "Toggle" : "Button";
  return `${kind} · ${truncate(describeValue(spec.title, describeContext(host)), 32)}`;
}

/**
 * One edit from the control's action form, seed included.
 *
 * A pick that moves the control to another entity fills in the rows under it
 * that nobody has typed in, which is what makes the entity worth asking for
 * first. The seed hangs here rather than inside `tapActionEditor` because the
 * control is the only surface with rows to seed: a tap layer has none.
 *
 * Nothing is seeded when the entity did not change (switching the action type
 * carries the target over), and nothing when the target is cleared: an author
 * emptying the row is not asking for a fresh guess.
 */
export function controlTapEdit(cfg: CustomComplicationConfig, mutate: (p: TapActionHolder) => void): void {
  const control = cfg.control;
  if (control === undefined) return;
  const before = tapTarget(control.action);
  mutate(control);
  const after = tapTarget(control.action);
  if (after === undefined || after.entityId.trim() === "") return;
  if (before !== undefined && before.entityId === after.entityId) return;
  cfg.control = seedControlFromEntity(control, after, before, cfg.name);
}

/**
 * The Control Center card's body: the mock tile, then the ten rows that write
 * the control.
 *
 * There is no switch. The control is added and removed in the shape bar, the
 * way a shape is (decided 2026-09-16), so this card only ever draws a control
 * that is already there and the body starts at Kind.
 *
 * The rows run entity first: Kind, then the action and its target, then
 * everything the target can fill in. Picking the target seeds the title, the
 * state, the symbols and the tint (`seedControlFromEntity`), so a control is
 * usually finished by the third row and the rest is there to adjust.
 */
function controlSection(host: EditorHost, spec: ControlSpec): TemplateResult {
  const set = (mutate: (c: ControlSpec) => void, k?: string) => host.update((cfg) => {
    if (cfg.control) mutate(cfg.control);
  }, k ? `control-${k}` : undefined);
  const effective = controlEffectiveKind(spec);
  const forcedToButton = spec.kind === "toggle" && effective === "button";
  // The number the band table is read against, and the row the table marks:
  // the value line when there is one, since that is the reading on screen,
  // then the state, then the title.
  const matched = spec.valueLabel ?? spec.state ?? spec.title;
  const numbers = spec.coloring === "bands" ? chartNumbers(host.resolve(matched) ?? "") : [];
  // The shared table editor wants a table that is always there; this holds the
  // control's optional color keys for the length of one edit, the way a text
  // layer's color by value does.
  const setBands = (mutate: (p: BandedLayer) => void, k?: string) => set((c) => {
    const table: BandedLayer = { bands: c.bands, bandAboveColorHex: c.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX };
    mutate(table);
    c.bands = table.bands;
    if (table.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) c.bandAboveColorHex = table.bandAboveColorHex;
    else delete c.bandAboveColorHex;
  }, k);
  const setTap = (mutate: (p: TapActionHolder) => void, k?: string) =>
    host.update((cfg) => { controlTapEdit(cfg, mutate); }, k ? `control-${k}` : undefined);
  return html`
    ${controlPreview(host, spec)}
    <div class="hint keep">Shows the last synced value.</div>
    <div class="fgroup">
    ${segField("Kind", spec.kind, CONTROL_KINDS, (v) => set((c) => { c.kind = v; }), { def: "toggle" })}
    <div class="hint">A toggle shows on or off and flips it. A button runs the action and shows nothing.</div>
    </div>
    <div class="fgroup">
    ${tapActionEditor(host, spec, setTap, "control", CONTROL_TAP_TYPES, "On press")}
    ${forcedToButton
      ? html`<div class="hint warn">${describeTapAction(spec.action)} cannot be switched off again, so this control acts as a button however the Kind row is set.</div>`
      : nothing}
    <div class="hint">A control is one press in Control Center, so it runs the same actions a tap does minus the ones that need the app open on a page.</div>
    </div>
    <div class="fgroup">
    ${valueEditor(host, spec.title, (v) => set((c) => { c.title = v; }, "title"),
      { showResolved: true, label: "Title", key: "control-title" })}
    <div class="hint">The name on the tile. Reads a value, so it can show a sensor or a template.</div>
    ${checkField("Value line", spec.valueLabel !== undefined, (v) => set((c) => {
      if (v) c.valueLabel = literal("--"); else delete c.valueLabel;
    }))}
    ${spec.valueLabel === undefined ? nothing : valueEditor(host, spec.valueLabel,
      (v) => set((c) => { c.valueLabel = v; }, "valueline"),
      { showResolved: true, label: "Value line", key: "control-valueline" })}
    <div class="hint">A second, smaller line under the title. A reading, a unit, or anything the title does not say.</div>
    </div>
    ${spec.kind === "button" ? nothing : html`
    <div class="fgroup">
    ${checkField("State", spec.state !== undefined, (v) => set((c) => {
      if (v) c.state = literal("on"); else delete c.state;
    }))}
    ${spec.state === undefined ? nothing : valueEditor(host, spec.state, (v) => set((c) => { c.state = v; }, "state"),
      { showResolved: true, label: "State", key: "control-state" })}
    ${spec.state === undefined
      ? html`<div class="hint warn">A toggle with no state cannot tell on from off, so it always draws as off. Give it the entity whose state it follows.</div>`
      : html`<div class="hint">What the toggle reads to know if it is on. One of <code>on</code>, <code>open</code>, <code>unlocked</code>, <code>home</code>, <code>playing</code>, <code>heat</code> or <code>cool</code> counts as on.</div>`}
    </div>`}
    <div class="fgroup">
    ${symbolField(host, spec.symbol, (v) => set((c) => { c.symbol = v; }, "symbol"), "control-symbol",
      undefined, "Symbol", false)}
    ${effective === "button"
      ? html`<div class="hint">The icon on the tile.</div>`
      : html`
      ${symbolField(host, spec.symbolOff ?? "", (v) => set((c) => {
        if (v) c.symbolOff = v; else delete c.symbolOff;
      }, "symboloff"), "control-symbol-off", undefined, "Symbol when off", false)}
      <div class="hint">The icon on the tile. Symbol when off is drawn while a toggle reads off. Leave it blank to keep the one symbol on both faces.</div>`}
    </div>
    <div class="fgroup">
    ${segField("Color", spec.coloring, CHART_COLORINGS, (v) => set((c) => {
      c.coloring = v;
      // Seeded from whatever the control reads right now, as a chart's table
      // is, so the switch paints something the moment it is flipped.
      if (v === "bands" && c.bands.length === 0) c.bands = seedBands(chartNumbers(host.resolve(matched) ?? ""));
    }), { def: "uniform" })}
    <div class="hint">One color paints the tint you pick. By value picks a color from the reading, band by band.</div>
    ${colorField("Tint", spec.tintColorHex, (v) => set((c) => {
      if (v === undefined) delete c.tintColorHex; else c.tintColorHex = v;
    }, "tint"), true, null)}
    <div class="hint">Off uses the system color. A toggle paints the tint only while it reads on. A button always paints it.</div>
    ${spec.coloring === "bands" ? html`
      ${bandTableFields({ bands: spec.bands, bandAboveColorHex: spec.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX },
        spec.tintColorHex ?? CONTROL_MOCK_TINT, setBands, numbers.length === 1 ? numbers[0] : undefined)}
      <div class="hint">The tint takes the color of the band the reading falls in. Without a number to read, the flat color above stands.</div>`
      : nothing}
    </div>
    ${controlStatusShows(host, spec) ? html`<div class="fgroup">
    ${checkField("Status text", spec.status !== undefined, (v) => set((c) => {
      if (v) c.status = literal("Done"); else delete c.status;
    }))}
    ${spec.status === undefined ? nothing : valueEditor(host, spec.status, (v) => set((c) => { c.status = v; }, "status"),
      { showResolved: true, label: "Status text", key: "control-status" })}
    <div class="hint">What Control Center flashes over the tile after a press. Off means no flash.</div>
    </div>` : html`<div class="fgroup">
    <div class="hint keep">The watch prints no status text for a button, only for a toggle. Switch the kind to Toggle to set one.</div>
    </div>`}`;
}

/**
 * The document's Control Center control, as the card on its own tab. Hidden
 * for an app too old to draw one: the key would save and simply never appear
 * anywhere.
 *
 * Nothing at all on a document with no control, because the card has no way to
 * make one: "+ Control Center" in the shape bar is what adds it and the tab's
 * x is what takes it away, exactly as a shape is added and removed. That is
 * also why there is no reset dot here, which used to be a second way out.
 *
 * `alwaysOpen` is for the Control Center tab on the canvas, where this card is
 * the whole subject of the view and folding it away would leave the column
 * empty.
 */
export function controlCard(host: EditorHost, opts: { alwaysOpen?: boolean } = {}): TemplateResult | typeof nothing {
  // The host carries a version, not an owner, which is enough for the one
  // owner that has no version at all: the home's Library reports null, and a
  // version that has not been reported reads as new enough. So a design on the
  // shelf keeps its control card and takes the control with it onto whichever
  // device it is later ticked for.
  if (!deviceSupportsControls(host.watchAppVersion)) return nothing;
  const spec = host.config.control;
  if (spec === undefined) return nothing;
  return card(host, "control", "Control Center", controlSection(host, spec),
    { color: SECTION_COLOR.tap, icon: "tap", summary: controlSummary(host, spec),
      ...(opts.alwaysOpen === true ? { alwaysOpen: true } : {}) });
}

// ── Shared values (named values in the document) ─────────────────────────

export function namedValueEditor(host: EditorHost, nv: NamedValue): TemplateResult {
  const idx = host.config.values.findIndex((v) => v.id === nv.id);
  const key = `nv-${nv.id}`;
  const uses = sharedValueUses(host.config, nv.id);
  // Now reads the shared value the way a layer does, by reference: Home
  // Assistant renders a shared template under the shared value's own key, so
  // asking for the bare source would never find its answer.
  const asRead: Value = { kind: { kind: "named", id: nv.id } };
  return html`
    ${textField("Name", nv.name, (v) => host.update((c) => { c.values[idx]!.name = v; }, `${key}-name`), { placeholder: "Name it, like Outside temp" })}
    ${valueEditor(host, nv.value, (v) => host.update((c) => { c.values[idx]!.value = v; }, key), { allowNamed: false, showResolved: true, resolveAs: asRead, inline: true, key })}
    <div class="field readout"><span>Used by</span><span class="readout-v">${uses === 0 ? "No layers yet" : `${uses} ${uses === 1 ? "layer" : "layers"}`}</span></div>`;
}

/** A new shared value starts blank, name included: the panel puts the caret
 * in its Name box, and a placeholder name would only have to be deleted. */
export function newNamedValue(): NamedValue {
  return { id: newId(), name: "", value: literal("") };
}

// ── Layers ────────────────────────────────────────────────────────────────

export interface EffectivePlacement {
  frame: NormalizedFrame;
  isHidden: boolean;
  size?: number;
  fromPlacement: boolean;
}

/** What a layer actually uses in one family (schema §4.3). */
export function effectivePlacement(cfg: CustomComplicationConfig, family: FamilyKind, el: CElement): EffectivePlacement {
  const layout = cfg.perFamily[family];
  const p = layout?.placements[el.payload.id];
  if (layout && Object.keys(layout.placements).length > 0 && p) {
    return { frame: p.frame, isHidden: p.isHidden, size: p.size, fromPlacement: true };
  }
  return { frame: el.payload.frame, isHidden: el.payload.isHidden, fromPlacement: false };
}

/**
 * One layer of a document by id, whether it is a layer of the document or a
 * layer of a list's row.
 *
 * Row layers are not in `cfg.elements`: they live inside their list's
 * `template`. They take part in the same per-shape `placements` map under their
 * own ids all the same, so every editor path that finds a layer to write to
 * has to be able to find one of those too. Top level first, because that is
 * what nearly every id is.
 */
export function elementIn(cfg: CustomComplicationConfig, id: string): CElement | undefined {
  for (const el of cfg.elements) {
    if (el.payload.id === id) return el;
    if (el.kind !== "list") continue;
    const row = el.payload.template.find((r) => r.payload.id === id);
    if (row) return row;
  }
  return undefined;
}

/** The list a row layer belongs to, or undefined for a layer of the document. */
export function listOwning(cfg: CustomComplicationConfig, rowId: string): Extract<CElement, { kind: "list" }> | undefined {
  return listOwningRowLayer(cfg, rowId);
}

/** Write a per-family placement for a layer, creating it from the effective values. */
export function setPlacement(cfg: CustomComplicationConfig, family: FamilyKind, id: string, patch: Partial<Placement>, clearSize = false): void {
  const el = elementIn(cfg, id);
  if (!el) return;
  let layout = cfg.perFamily[family];
  if (!layout) {
    layout = { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    cfg.perFamily[family] = layout;
  }
  const eff = effectivePlacement(cfg, family, el);
  const existing: Placement = layout.placements[id] ?? { frame: { ...eff.frame }, isHidden: eff.isHidden, ...(eff.size !== undefined ? { size: eff.size } : {}) };
  const next: Placement = { ...existing, ...patch };
  if (clearSize) delete next.size;
  // No freezing of the other layers here any more. A placement is what says a
  // layer belongs to this shape, so writing one for a layer the shape does not
  // own would hand it a second owner. `normalizeOwnership` clears any that
  // slip through.
  layout.placements[id] = next;
}

/**
 * A layer's size in the shape being edited.
 *
 * Size is per shape, the same way a frame is. A 12 pt label on the rectangular
 * face has no business setting the size of the same layer on a corner one,
 * where the canvas is a fifth of the width, so this control writes the
 * placement for the shape on screen and nothing else. A shape that has never
 * been given a placement falls back to the layer's own value, which is what a
 * freshly added layer uses everywhere until it is moved or resized.
 */
export function shapeSizeField(
  host: EditorHost,
  el: CElement,
  family: FamilyKind,
  label: string,
  opts: { step: number; min: number; def?: number },
): TemplateResult {
  const { value, set } = shapeSize(host, el, family, opts.min);
  return numberField(label, value, set,
    { step: opts.step, min: opts.min, unit: "pt", ...(opts.def === undefined ? {} : { def: opts.def }) });
}

/** The size `shapeSizeField` shows and the setter it writes through. */
function shapeSize(host: EditorHost, el: CElement, family: FamilyKind, min: number): { value: number; set: (v: number | undefined) => void } {
  const id = el.payload.id;
  const shared = elementSize(el) ?? min;
  const value = effectivePlacement(host.config, family, el).size ?? shared;
  return {
    value,
    set: (v) => host.update(
      (c) => setPlacement(c, family, id, { size: Math.max(min, v ?? shared) }),
      `el-${id}-size-${family}`,
    ),
  };
}

/**
 * A text layer's size and alignment on one row: the size box, then Left,
 * Center and Right. The two are read together (how big, and where in the box),
 * and a row each cost the Look card a line for three buttons. The one reset dot
 * takes back whichever of the two is changed.
 */
function sizeAlignField<T extends string>(
  host: EditorHost,
  el: CElement,
  family: FamilyKind,
  label: string,
  opts: { step: number; min: number; def?: number },
  align: SegChoice<T>,
): TemplateResult {
  const { value, set } = shapeSize(host, el, family, opts.min);
  const sizeBack = backTo<number | undefined>(value, opts.def, set, (v) => `${v} pt`);
  const alignBack = backTo(align.value, align.def, align.set, (v) => (align.options.find(([o]) => o === v)?.[1] ?? v).toLowerCase());
  const numOpts = { step: opts.step, min: opts.min, unit: "pt", ariaLabel: label };
  return html`<div class="field size-align">${fieldLabel(label, bothBack(sizeBack, alignBack), scrubber(value, set, numOpts))}
    <div class="size-align-row">
      ${numberInput(value, set, numOpts)}
      ${segButtons(align.label, align.value, align.options, align.set, align)}
    </div></div>`;
}

/** `elementSize` lives beside the design boxes now, because the refit that
 * scales it for another canvas has to read both. Re-exported here so the
 * inspector's own callers do not have to know that. */
export { elementSize };

/**
 * "Copy the Rectangular layout", clicked: one shape given its own copy of
 * another shape's layers.
 *
 * The copy itself lives in `model.ts` as `copyShapeLayers`, because adding a
 * shape starts from the same copy now and the rule about which layer belongs
 * to which shape is written there. This is the editor's name for it.
 */
export function copyShapeLayout(cfg: CustomComplicationConfig, from: FamilyKind, to: FamilyKind): void {
  copyShapeLayers(cfg, from, to);
}

/**
 * The line under a shape that arrived as a copy of another one.
 *
 * Circular layers sit inside a round mask, so a Small tile copied from it has
 * empty corners and the line says so. Every other pair is the same shape of
 * box at another size, where there is nothing to warn about and the only
 * question is where it came from.
 */
export function seedHintText(source: FamilyKind, target: FamilyKind): string {
  return target === "small" && source === "circular"
    ? "Copied from your circular design. The corners are free."
    : `Copied from your ${familyTitle(source)} design.`;
}

/** How many layers a shape actually draws: what the Layers card counts to
 * decide whether the shape is still blank. */
export function shownCount(cfg: CustomComplicationConfig, family: FamilyKind): number {
  return ownedShownCount(cfg, family);
}


// ── Several layers at once ────────────────────────────────────────────────

/**
 * One yes/no setting read across several picked layers: they are all on, all
 * off, or they disagree. A mixed setting shows as an indeterminate tick, so
 * the click that follows means "make them all this" rather than "flip each".
 */
export type PickedFlag = "all" | "none" | "mixed";

export function flagAcross(values: readonly boolean[]): PickedFlag {
  if (values.length === 0) return "none";
  if (values.every((v) => v)) return "all";
  if (values.every((v) => !v)) return "none";
  return "mixed";
}

/** A layer's own color, or undefined for the kinds that have none: a picture
 * draws a photo, a tap area draws nothing, and every color on a timeline
 * comes out of its own table. */
export function elementColor(el: CElement): string | undefined {
  return el.kind === "image" || el.kind === "tap" || el.kind === "timeline" || el.kind === "chartTimes"
    || el.kind === "chartDots" || el.kind === "chartGrid" || el.kind === "imageTime" || el.kind === "list"
    ? undefined
    : el.payload.colorSlot.baseColorHex;
}

export interface PickedCommon {
  /** Hidden on the shape they are on. A layer is on one shape only, so there
   * is nowhere else for it to be hidden. */
  hiddenHere: PickedFlag;
  /** Whether every picked layer has a color to set at all. */
  colorable: boolean;
  /** The color they already share, or undefined when they differ or one of
   * them has none. Blank in the field is what "they differ" looks like. */
  color: string | undefined;
}

/**
 * What the picked layers agree on, for the inspector's multi-pick panel.
 *
 * Only settings every kind of layer has are read here. Anything narrower
 * belongs to the one-layer editor, where the form can match the kind.
 */
export function pickedCommon(cfg: CustomComplicationConfig, family: FamilyKind, els: readonly CElement[]): PickedCommon {
  const hiddenHere = flagAcross(els.map((el) => effectivePlacement(cfg, family, el).isHidden));
  const colors = els.map(elementColor);
  const colorable = els.length > 0 && colors.every((c) => c !== undefined);
  const first = colors[0];
  const shared = colorable && first !== undefined
    && colors.every((c) => c !== undefined && c.toUpperCase() === first.toUpperCase());
  return { hiddenHere, colorable, color: shared ? first : undefined };
}

const FONT_WEIGHTS: [FontWeight, string][] = [["regular", "Regular"], ["medium", "Medium"], ["semibold", "Semibold"], ["bold", "Bold"]];

const TEXT_ALIGNMENTS: [TextAlignment, string][] = [["leading", "Left"], ["center", "Center"], ["trailing", "Right"]];

const FONT_DESIGNS: [FontDesign, string][] = [
  ["default", "System"], ["rounded", "Rounded"], ["monospaced", "Mono"], ["serif", "Serif"],
];

const FONT_WIDTHS: [FontWidth, string][] = [
  ["standard", "Standard"], ["condensed", "Condensed"], ["compressed", "Compressed"], ["expanded", "Expanded"],
];

/** Said wherever the letter width is picked. The watch has the system face's own
 * narrow and wide cuts; the preview only has whatever stretch the browser can
 * synthesise, so the shapes are close rather than the same. */
const FONT_WIDTH_HINT = html`<div class="hint">The watch draws the system face's own narrow and wide cuts.
  The preview stretches the letters instead, so judge the shapes on the watch, not here.</div>`;

/** A part's slant, as two buttons, so "follows the layer" is a state the row can
 * show the way its weight and typeface rows do. */
const PART_ITALICS: ["off" | "on", string][] = [["off", "Upright"], ["on", "Italic"]];

/** Said wherever the typeface is picked. Only the system face and the mono one
 * have real twins in a browser, so the preview is honest about the other two
 * rather than letting someone lay a face out against the wrong shapes. */
const FONT_DESIGN_HINT = html`<div class="hint">The watch draws SF Rounded and New York.
  The preview has no web copy of either, so it shows the closest match: judge the shapes on the watch, not here.</div>`;

/** The line counts a text layer offers. Kept as strings because the segmented
 * control is a string control; the payload stores the number. */
const TEXT_LINE_LIMITS: ["1" | "2" | "3" | "4", string][] = [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]];

/** An entity's device class, which nothing in the document holds. A timeline
 * reads it to know whether a binary sensor is a door before it seeds its color
 * table, and a states table reads it for the same reason. */
function deviceClassOf(host: EditorHost, entityId: string): string | undefined {
  const dc = host.hass.states[entityId]?.attributes?.device_class;
  return typeof dc === "string" ? dc : undefined;
}

/**
 * The one Entity field at the top of a drawing layer.
 *
 * Nothing stores it. It is read back from wherever the layer already names an
 * entity (`layerEntityUses`), and setting it writes that entity into the
 * layer's own content and into the tap attached to it. A layer whose content
 * is a template, a named value or a chosen symbol keeps that content: the note
 * under the field says where the entity did land, so the field is never a
 * control that quietly did nothing.
 */
function layerEntityField(host: EditorHost, el: CElement, key: string): TemplateResult {
  const id = el.payload.id;
  const uses = layerEntityUses(host.config, id);
  const ref = uses[0]?.ref ?? { entityId: "", displayName: "", domain: "" };
  // A camera layer keeps the camera-only picker it has always had. An entity
  // picture can come from any domain, so that one is unrestricted.
  const cameraOnly = el.kind === "image" && el.payload.source === "camera";
  const opts: EntityFieldOptions = { ...(cameraOnly ? { domain: "camera" } : {}), needed: layerNeedsEntity(el) };
  return html`
    ${entityField(host, cameraOnly ? "Camera" : "Entity", ref,
      (next) => host.update((c) => setLayerEntity(c, id, next, deviceClassOf(host, next.entityId)), `${key}-entity`), `${key}-layer-entity`, opts)}
    <div class="hint ${layerNeedsEntity(el) ? "warn" : ""}">${layerEntityNote(el, uses)}</div>`;
}

/**
 * Whether this layer draws nothing at all until it names an entity.
 *
 * Exactly the three cases the content editors already warn about further down
 * the card: a chart set to recorded history, a timeline (which is only ever
 * history), and a picture. A tap pointing at something does not count, because
 * it is the drawing that is blocked, not the tap.
 */
function layerNeedsEntity(el: CElement): boolean {
  if (el.kind === "timeline") return el.payload.value.kind.kind !== "entityState";
  if (el.kind === "chart") return el.payload.historyMinutes > 0 && el.payload.value.kind.kind !== "entityState";
  // An uploaded picture carries its own bytes, so it needs no entity at all.
  if (el.kind === "image") return el.payload.source !== "inline" && el.payload.entity.entityId === "";
  return false;
}

/** Whether this layer's Content card shows the entity field at all. A picture
 * that carries its own bytes has nothing to name. */
function layerShowsEntity(el: CElement): boolean {
  if (el.kind === "tap" || el.kind === "text") return false;
  // A merged timeline names its entities in its own list, whose first row is
  // this same entity, so a field above it would only repeat Entity 1.
  if (el.kind === "timeline" && el.payload.aggregate !== undefined) return false;
  if (el.kind === "chartTimes" || el.kind === "chartDots" || el.kind === "chartGrid" || el.kind === "imageTime") return false;
  // A list names its entities in its Source card, where the kind of source
  // decides how many there are and which domains they may come from. One
  // field above that would ask the same question in a way the source cannot use.
  if (el.kind === "list") return false;
  return !(el.kind === "image" && el.payload.source === "inline");
}

/** The layer's own content value, which is the part an entity pick may rewrite. */
function contentValue(el: CElement): Value | undefined {
  if (el.kind === "text" || el.kind === "gauge" || el.kind === "chart" || el.kind === "timeline") return el.payload.value;
  if (el.kind === "icon") return el.payload.symbol;
  return undefined;
}

function joinWords(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** Where the entity actually lives on this layer, in words. */
export function layerEntityNote(el: CElement, uses: readonly LayerEntityUse[]): string {
  const content = contentValue(el);
  const contentKind = content?.kind.kind;
  // A literal on a text or gauge layer is a placeholder an entity pick replaces;
  // everywhere else the content is something the author chose, and it stays.
  const contentKept = content !== undefined
    && !("entityId" in content.kind)
    && !(contentKind === "literal"
      && (el.kind === "text" || el.kind === "gauge" || el.kind === "chart" || el.kind === "timeline"));
  const keptNote = !contentKept
    ? ""
    : contentKind === "named"
      ? " Its content comes through a shared value, so change that shared value to point it somewhere else."
      : contentKind === "chartStat"
        ? " Its number comes from a chart, so point the chart somewhere else to change it."
      : contentKind === "imageTime"
        ? " It prints when a picture was fetched, so point the picture somewhere else to change it."
      : el.kind === "icon" && contentKind === "literal"
        ? " The symbol above is a fixed name and stays as it is."
        : " The value above was written by hand and stays as it is.";
  if (uses.length === 0) {
    if (el.kind === "shape") return "A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.";
    return `Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${keptNote}`;
  }
  const parts: string[] = [];
  const own = uses.find((u) => u.where === "value" || u.where === "symbol" || u.where === "camera");
  if (own) parts.push(own.where === "symbol" ? "the symbol" : own.where === "camera" ? "the picture" : el.kind === "gauge" ? "the reading" : el.kind === "chart" ? "the readings" : el.kind === "timeline" ? "the states" : "the text");
  if (uses.some((u) => u.where === "tap")) parts.push("the tap");
  const tests = uses.filter((u) => u.where === "test").length;
  if (tests > 0) parts.push(tests === 1 ? "1 state test" : `${tests} state tests`);
  return `Used by ${joinWords(parts)}.${keptNote}`;
}

/**
 * One titled band of the inspector's single scroll.
 *
 * Deliberately light: a small uppercase title over a hairline, never a
 * bordered card, because a card inside the inspector's own card is two boxes
 * saying the same thing. `note` carries what the old tab strip used to say in
 * its label, such as which shape a placement belongs to.
 */
/** What the pan sliders can actually do right now, said in words: an axis with
 * nothing spilling off the frame has nothing to move, and that is the first
 * thing anyone drags a dead slider over. */
function imagePanHint(img: ImageElement): string {
  if (img.zoom < 1) {
    return "Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.";
  }
  if (img.contentMode === "fit" && img.zoom === 1) {
    return "The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.";
  }
  return "Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move.";
}


interface CardOptions {
  /** Tint of the header band and the edge; one of SECTION_COLOR, so a card
   * wears the same color on every kind of layer. */
  color?: string;
  icon?: UiIconName;
  /** One line under the title saying what the card holds, so a shut card
   * still answers most questions. */
  summary?: string;
  /** Put everything the card owns back to its defaults. Supplied only while
   * something in the card is away from one, so the button in the header is
   * also what says "someone set something here" on a shut card. Undo takes a
   * card reset back in one step. */
  reset?: () => void;
  /** What that button says it will do, when "back to its defaults" is too
   * vague to be safe. The Position card resets a layer's whole frame, so it says
   * so rather than letting the reader find out by watching the layer jump. */
  resetTitle?: string;
  /** Never folds: the body is always drawn and the header is not a control.
   * For a card that is the inspector's only one, such as the complication's or
   * a shared value's, which has no business reading (or writing) openSections. */
  alwaysOpen?: boolean;
  /** The card's less used rows, folded behind a "More" line at its foot. */
  more?: MoreOptions;
  /** A small button in the header of a shut card, such as States' "Add": a
   * click opens the card and runs it, so the common first step needs no
   * unfolding first. */
  action?: { label: string; title: string; run: () => void };
}

/** One group of rows behind a card's More line, and its name in that line.
 * A group whose rows are `nothing` is left out of both. */
export type MoreRow = readonly [name: string, rows: unknown];

export interface MoreOptions {
  rows: readonly MoreRow[];
}

/**
 * The less used rows at the foot of a card, under a thin rule. They used to
 * fold behind a "More" line, but people missed settings they needed (a
 * shape's gradient, any layer's opacity), so they are always shown now.
 */
function moreFold(more: MoreOptions): TemplateResult | typeof nothing {
  const rows = more.rows.filter(([, r]) => r !== nothing && r !== undefined && r !== "");
  if (rows.length === 0) return nothing;
  return html`<div class="more-fold"><div class="more-body">${rows.map(([, r]) => r)}</div></div>`;
}

/** Structural equality for the plain data the config is made of: objects,
 * arrays, strings, numbers, booleans. Key order does not matter, which is
 * what makes a decoded document comparable to a freshly built default. */
function same(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === (b as unknown[]).length && a.every((v, i) => same(v, (b as unknown[])[i]));
  const ka = Object.keys(a as object).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
  const kb = Object.keys(b as object).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/** True when any of `keys` differs between a payload and the default one of
 * its kind. */
function anyDiffers(actual: object, base: object, keys: readonly string[]): boolean {
  return keys.some((k) => !same((actual as Record<string, unknown>)[k], (base as Record<string, unknown>)[k]));
}

/** Put a payload's `keys` back to what a fresh layer of its kind holds. A key
 * the default leaves out is deleted rather than set to undefined, so an
 * optional setting goes back to absent and the saved document stays clean.
 * The copy is deep, or two layers would end up sharing one color slot. */
function restoreKeys(actual: object, base: object, keys: readonly string[]): void {
  const a = actual as Record<string, unknown>;
  const b = base as Record<string, unknown>;
  for (const k of keys) {
    if (b[k] === undefined) delete a[k];
    else a[k] = structuredClone(b[k]);
  }
}

/**
 * One inspector card. The header is always drawn; the body only while the
 * card is open, so a long States table costs nothing while it is shut. Which
 * cards are open belongs to the panel (host.openSections), because it resets
 * when a different thing is selected.
 *
 * The "?" in the header shows the card's help. Plain hints in the body stay
 * hidden until it is on (the CSS keys off `data-help`); a hint that reports a
 * problem, a status or a required action carries `warn`, `err` or `keep` and
 * always shows.
 */
export function card(host: EditorHost, id: string, title: string, body: unknown, opts: CardOptions = {}): TemplateResult {
  const pinned = opts.alwaysOpen === true;
  const open = pinned || host.openSections.has(id);
  const help = host.helpSections.has(id);
  const toggle = () => host.toggleSection(id);
  // Help lives in the body, so asking for it opens a shut card. A pinned card
  // is always open and has no place in openSections.
  const toggleHelp = () => {
    if (!help && !open) host.toggleSection(id);
    host.toggleHelp(id);
  };
  const helpLabel = help ? `Hide the help in ${title}` : `Show help for ${title}`;
  const head = html`<span class="swatch">${uiIcon(opts.icon ?? "content")}</span>
      <span class="tt"><h4>${title}${resetButton(opts.reset === undefined ? undefined
        : { atDefault: false, title: opts.resetTitle ?? `Put ${title} back to its defaults`, reset: opts.reset })}</h4>${opts.summary ? html`<span class="sum">${opts.summary}</span>` : nothing}</span>
      ${opts.action === undefined || open ? nothing : html`<button type="button" class="small sec-act" title=${opts.action.title}
        @click=${(e: Event) => { e.stopPropagation(); if (!open) host.toggleSection(id); opts.action?.run(); }}>${uiIcon("plus")}<span>${opts.action.label}</span></button>`}
      <button type="button" class="sec-help ${help ? "on" : ""}" aria-pressed=${help ? "true" : "false"} title=${helpLabel} aria-label=${helpLabel}
        @click=${(e: Event) => { e.stopPropagation(); toggleHelp(); }}>?</button>`;
  return html`<section class="sec ${host.litSection === id ? "lit" : ""}" data-open=${open ? "true" : "false"} data-help=${help ? "on" : "off"} style=${opts.color ? `--c:${opts.color}` : ""}>
    ${pinned
      ? html`<div class="sec-h pinned">${head}</div>`
      : html`<div class="sec-h" role="button" tabindex="0" aria-expanded=${open ? "true" : "false"} @click=${toggle}
          @keydown=${(e: KeyboardEvent) => {
            // Keys pressed on the reset dot or the "?" are theirs, not the header's.
            if (e.target !== e.currentTarget) return;
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
          }}>
          ${head}
          <span class="chev">${uiIcon("chevron")}</span>
        </div>`}
    ${open ? html`<div class="sec-b">${body}${opts.more === undefined ? nothing : moreFold(opts.more)}</div>` : nothing}
  </section>`;
}

/** The parsed series as a short line of numbers, with the ends called out. Long
 * series are elided in the middle, because the point is "did it read what I
 * meant", not the whole list. */
function chartReadout(values: number[]): string {
  if (values.length === 0) return "nothing";
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100));
  if (values.length <= 12) return values.map(fmt).join(" ");
  return `${values.slice(0, 6).map(fmt).join(" ")} … ${values.slice(-3).map(fmt).join(" ")}`;
}

/** A length of time in one short token, for a readout that has to fit several
 * of them on a line. */
function shortDuration(seconds: number): string {
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/**
 * What a timeline has just read, as a line somebody can check against the
 * house: "off 12m, on 3m, off 45m", oldest first.
 *
 * Neighbouring samples of one state are joined, because the recorder writes a
 * row for an attribute change too and a strip that says "on, on, on" answers
 * nothing. Only the newest few are printed: the question this line settles is
 * "is it reading the right entity", not what happened all hour.
 */
/** Whether a line drawn along this frame's long side stands up on the watch.
 * The frame is a fraction of the shape's design box, so a 0.5 by 0.5 frame is
 * wide on a rectangular face and square on a circular one; the box aspect
 * decides which side is long, and a quarter turn flips it. */
function lineIsVertical(family: FamilyKind, f: NormalizedFrame): boolean {
  const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
  const tall = f.height * box.height > f.width * box.width;
  const turned = Math.round(((f.rotationDegrees % 180) + 180) % 180) === 90;
  return tall !== turned;
}

/** Horizontal or Vertical for a line, written as the frame's rotation so the
 * wire carries nothing new: a quarter turn is the whole difference. */
function lineOrientationField(family: FamilyKind, f: NormalizedFrame, setFrame: (patch: Partial<NormalizedFrame>, k: string) => void) {
  const vertical = lineIsVertical(family, f);
  const box = DESIGN_BOX[family === "inline" ? "rectangular" : family];
  const tall = f.height * box.height > f.width * box.width;
  return html`<div class="grid2">
    ${segField("Direction", vertical ? "vertical" : "horizontal", [["horizontal", "Horizontal"], ["vertical", "Vertical"]], (v) => {
      // Zero when the frame's own long side already points that way, a quarter
      // turn when it does not; the Position card's rotation field shows the result.
      const wantTall = v === "vertical";
      setFrame({ rotationDegrees: wantTall === tall ? 0 : 90 }, "line-dir");
    }, { titles: { horizontal: "Lying along the frame", vertical: "Standing up, as a divider" } })}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`;
}

/** True when the recorded states are mostly numbers: a sensor's readings, not
 * the words a timeline is for. `unavailable` and `unknown` are left out of the
 * count, so a number sensor that drops out now and then still reads as numeric. */
function timelineIsNumeric(samples: readonly TimelineSample[]): boolean {
  const words = samples.filter((s) => s.state !== "unavailable" && s.state !== "unknown");
  if (words.length === 0) return false;
  const numeric = words.filter((s) => s.state.trim() !== "" && Number.isFinite(Number(s.state))).length;
  return numeric * 2 > words.length;
}

function timelineReadout(samples: readonly TimelineSample[], spanSeconds: number, limit = 4): string {
  if (samples.length === 0) return "nothing";
  const runs: { state: string; seconds: number }[] = [];
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]!;
    const end = samples[i + 1]?.offsetSeconds ?? spanSeconds;
    const seconds = Math.max(0, end - sample.offsetSeconds);
    const last = runs[runs.length - 1];
    if (last !== undefined && last.state.trim().toLowerCase() === sample.state.trim().toLowerCase()) last.seconds += seconds;
    else runs.push({ state: sample.state, seconds });
  }
  const shown = runs.slice(-limit);
  const line = shown.map((r) => `${r.state || "(blank)"} ${shortDuration(r.seconds)}`).join(", ");
  return runs.length > shown.length ? `… ${line}` : line;
}

/** A history span in words: a listed span by its label, any other as days,
 * hours and minutes ("Last 2d 4h"). */
function historySpanLabel(
  minutes: number,
  spans: readonly { minutes: number; label: string }[] = CHART_HISTORY_SPANS,
): string {
  const listed = spans.find((s) => s.minutes === minutes);
  if (listed) return listed.label;
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length === 0) parts.push(`${m}m`);
  return `Last ${parts.join(" ")}`;
}

/** The note under Points when an every-reading chart's span held more
 * readings than the server keeps, so it averaged the whole span instead.
 * Undefined when the chart averages anyway, the fetch has not reported, or
 * every reading fit. `spanLabel` is the picker's own ("Last 6 hours"). */
export function everyReadingAveragedHint(
  everyReading: boolean,
  info: { readings: number; averaged: boolean } | undefined,
  spanLabel: string,
): string | undefined {
  if (!everyReading || info === undefined || !info.averaged) return undefined;
  const rest = spanLabel.replace(/^Last\s+/, "");
  const cover = /^\d/.test(rest) ? `all ${rest}` : `the whole ${rest}`;
  return `This span has ${info.readings} readings, more than ${CHART_HISTORY_MAX_POINTS}, so they are averaged into ${CHART_HISTORY_MAX_POINTS} even slots to cover ${cover}.`;
}

/** Layers whose Span picker is on "Custom…" right now. Picking Custom is not
 * a change to the document, so it lives here rather than in the config; a
 * stored span the picker does not list counts as custom on its own. */
const customSpans = new Set<string>();

/** Whether one layer's Span picker is on Custom… right now: either it was
 * picked, or the stored span is not one the picker lists. */
function spanIsCustom(
  layerId: string,
  minutes: number,
  spans: readonly { minutes: number; label: string }[] = CHART_HISTORY_SPANS,
): boolean {
  return customSpans.has(layerId) || !spans.some((s) => s.minutes === minutes);
}

/** The Span picker: every listed span plus Custom…. Shared by the chart and the
 * timeline, so how far back to read is asked the same way wherever it is
 * asked. */
function historySpanPicker(
  layerId: string,
  minutes: number,
  baseMinutes: number,
  set: (minutes: number) => void,
  spans: readonly { minutes: number; label: string }[] = CHART_HISTORY_SPANS,
): TemplateResult {
  const custom = spanIsCustom(layerId, minutes, spans);
  return html`<label class="field">${fieldLabel("Span", {
      atDefault: minutes === baseMinutes && !custom,
      title: `Back to ${historySpanLabel(baseMinutes, spans)}`,
      reset: () => { customSpans.delete(layerId); set(baseMinutes); },
    })}
      <select @change=${(e: Event) => {
        const v = (e.target as HTMLSelectElement).value;
        if (v === "custom") {
          customSpans.add(layerId);
          requestRerender(e.target);
        } else {
          customSpans.delete(layerId);
          set(Number(v) || CHART_HISTORY_DEFAULT_MINUTES);
        }
      }}>
        ${spans.map(({ minutes: listed, label }) => html`<option value=${String(listed)} ?selected=${!custom && listed === minutes}>${label}</option>`)}
        <option value="custom" ?selected=${custom}>Custom…</option>
      </select></label>`;
}

/** The three boxes Custom… reveals, and the line saying what they add up to.
 *
 * `statistics` swaps in the other store's ceiling and its own explanation: a
 * year is a fair ask of rows that are never purged. */
function historySpanCustomFields(
  minutes: number,
  set: (minutes: number) => void,
  statistics = false,
): TemplateResult {
  const maxMinutes = statistics ? CHART_STATISTICS_MAX_MINUTES : CHART_HISTORY_MAX_MINUTES;
  const maxDays = Math.floor(maxMinutes / 1440);
  const spans = statistics ? CHART_STATISTICS_SPANS : CHART_HISTORY_SPANS;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  const parts = (d: number, h: number, m: number) =>
    set(Math.min(maxMinutes, Math.max(1, Math.round(d) * 1440 + Math.round(h) * 60 + Math.round(m))));
  return html`<div class="grid3 span-parts">
      ${numberField("Days", days, (v) => parts(v ?? 0, hours, mins), { step: 1, min: 0, max: maxDays })}
      ${numberField("Hours", hours, (v) => parts(days, v ?? 0, mins), { step: 1, min: 0, max: 23 })}
      ${numberField("Minutes", mins, (v) => parts(days, hours, v ?? 0), { step: 1, min: 0, max: 59 })}
    </div>
    <div class="hint">${statistics
      ? html`${historySpanLabel(minutes, spans)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`
      : html`${historySpanLabel(minutes, spans)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`;
}

/** The span half of a chart's summary line: nothing when it draws its own
 * value, the span alone for history, and the span plus what one row covers for
 * statistics ("Last 24 hours · per hour"). */
function chartSpanSummary(c: ChartElement): string {
  if (c.historyMinutes <= 0) return "";
  if (c.source !== "statistics") return ` · ${historySpanLabel(c.historyMinutes)}`;
  const period = STAT_PERIODS.find(([value]) => value === c.statPeriod)?.[1] ?? c.statPeriod;
  return ` · ${historySpanLabel(c.historyMinutes, CHART_STATISTICS_SPANS)} · per ${period.toLowerCase()}`;
}

/** What a layer shows, in a few words, for the Content card's summary line. */

export function contentSummary(host: EditorHost, el: CElement): string {
  const ctx = describeContext(host);
  switch (el.kind) {
    case "text": {
      // A rich text layer's value is only its fallback, so it would name one
      // part and hide the rest.
      const n = el.payload.parts?.length ?? 0;
      if (textUsesParts(el.payload)) return `Rich text, ${n} part${n === 1 ? "" : "s"}`;
      return truncate(describeValue(el.payload.value, ctx), 48);
    }
    // A pasted drawing's symbol is the marker, which is not a name anyone
    // typed, so the summary says what the layer is instead.
    case "icon": return isCustomSvgIcon(el.payload)
      ? (el.payload.path ? "Custom SVG" : "No drawing yet")
      : truncate(describeValue(el.payload.symbol, ctx), 48);
    case "gauge": return truncate(describeValue(el.payload.value, ctx), 48);
    // Charts drawing a past say so: the value names the entity either way, so
    // without the span the kinds of chart read identically in the list. A
    // statistics chart adds what one bar covers, because a day of hourly rows
    // and a day of daily ones are the same span and different plots.
    case "chart": return truncate(
      `${describeValue(el.payload.value, ctx)}${chartSpanSummary(el.payload)}`,
      48
    );
    case "timeline": {
      // A merged strip says how many it merges: its value names only the first of
      // them, so "Front door" alone would read as a strip of one door.
      const merged = timelineAggregateEntities(el.payload).length;
      const what = merged > 1
        ? `${merged} entities, ${el.payload.aggregate?.combine === "all" ? "all" : "any"}`
        : describeValue(el.payload.value, ctx);
      return truncate(`${what} · ${historySpanLabel(timelineHistoryMinutes(el.payload))}`, 48);
    }
    case "shape": return el.payload.kind === "roundedRectangle" ? "Rounded rectangle" : el.payload.kind;
    case "image": {
      // An uploaded picture names no entity, so the summary says how big it is
      // instead: that is the only thing about it worth a line here.
      if (el.payload.source === "inline") {
        const bytes = inlineImageBytes(el.payload);
        return bytes > 0 ? `Uploaded picture · ${formatKiB(bytes)}` : "No picture yet";
      }
      return el.payload.entity.displayName || el.payload.entity.entityId
        || (el.payload.source === "camera" ? "No camera yet" : "No entity yet");
    }
    case "tap": return describeTapAction(el.payload.action);
    case "list": {
      const kindWord = LIST_SOURCE_KINDS.find(([k]) => k === el.payload.source.kind)?.[1] ?? el.payload.source.kind;
      return `${kindWord} · ${clampListRows(el.payload.rows)} cells`;
    }
    case "chartTimes": {
      const chart = host.config.elements.find((e) => e.payload.id === el.payload.chart);
      return chart?.kind === "chart" || chart?.kind === "timeline"
        ? truncate(`Times of ${describeValue(chart.payload.value, ctx)}`, 48) : "No chart or timeline";
    }
    case "imageTime": {
      const image = host.config.elements.find((e) => e.payload.id === el.payload.image);
      return image?.kind === "image" ? truncate(`Time of ${layerTitle(image, ctx)}`, 48) : "No picture";
    }
    case "chartDots":
    case "chartGrid": {
      const chart = host.config.elements.find((e) => e.payload.id === el.payload.chart);
      const what = el.kind === "chartDots" ? "Dots on" : "Grid behind";
      return chart?.kind === "chart" ? truncate(`${what} ${describeValue(chart.payload.value, ctx)}`, 48) : "No chart";
    }
  }
}

export function lookSummary(el: CElement): string | undefined {
  switch (el.kind) {
    case "text": return `${el.payload.fontSize} pt ${el.payload.fontWeight.toLowerCase()} · ${colorWords(el.payload.colorSlot.baseColorHex)}`;
    case "icon": return `${el.payload.size} pt · ${colorWords(el.payload.colorSlot.baseColorHex)}`;
    case "gauge": {
      const g = el.payload;
      const size = g.style === "dots" ? `${g.bands.length > 0 && g.coloring === "bands" ? "banded" : colorWords(g.colorSlot.baseColorHex)} dots` : `${g.lineWidth} pt line · ${g.coloring === "bands" && g.bands.length > 0 ? `${g.bands.length + 1} color bands` : colorWords(g.colorSlot.baseColorHex)}`;
      return `${g.style} · ${size}${g.thresholdValue === undefined ? "" : ` · threshold ${g.thresholdValue}`}`;
    }
    // The highlight is an Extras setting now, so it is that card's summary.
    case "chart": return `${el.payload.style} · ${el.payload.scale === "auto" ? "auto scale" : `${el.payload.minValue} to ${el.payload.maxValue}`}`;
    case "timeline": {
      const t = el.payload;
      const colors = t.bands.length === 0
        ? `one color (${colorWords(t.otherColorHex)})`
        : `${t.bands.length} ${t.bands.length === 1 ? "state" : "states"} colored`;
      return `${colors}${t.gap > 0 ? ` · ${t.gap} pt gap` : ""} · corners ${t.cornerRadius} pt`;
    }
    case "shape": return el.payload.kind === "line"
      ? `${colorWords(el.payload.colorSlot.baseColorHex)} · ${el.payload.thickness} pt thick`
      : `${colorWords(el.payload.colorSlot.baseColorHex)}${el.payload.borderColorHex ? ` · ${el.payload.borderWidth} pt border` : ""}`;
    case "image": return `${el.payload.contentMode === "fill" ? "Fill the frame" : "Fit inside"} · ${el.payload.zoom.toFixed(2)}x · corners ${el.payload.cornerRadius} pt`;
    case "tap": return undefined;
    case "chartTimes": return `${el.payload.timeLabelCount <= 0 ? "no" : el.payload.timeLabelCount} times · ${el.payload.labelSize} pt · ${colorWords(el.payload.labelColorHex)}`;
    case "imageTime": return undefined;
    case "list": return `${clampListRows(el.payload.rows)} cells · gap ${clampListGap(el.payload.gap)} pt`;
    case "chartDots": {
      const d = el.payload;
      return `${d.dots === "all" ? "all" : "auto"} · ${d.size === undefined ? "automatic size" : `${d.size} pt`} · ${d.colorHex === undefined ? "series color" : colorWords(d.colorHex)}`;
    }
    case "chartGrid": {
      const g = el.payload;
      return `${g.lines} ${g.lines === 1 ? "line" : "lines"} · ${g.thickness} pt · ${colorWords(g.colorHex)}`;
    }
  }
}

/**
 * One of a frame's four numbers, as a compact box with a letter in front: X,
 * Y, W or H, as a percentage of the face. The frame is stored 0-1, which reads
 * as nothing on screen, and the card's summary already speaks percent ("23%
 * wide"). The letter drags the number, the way a number row's title does.
 */
function frameLetterField(letter: string, name: string, value: number, set: (v: number) => void, min: number, max: number): TemplateResult {
  const pct = Math.round(value * 1000) / 10;
  const setPct = (n: number) => set(n / 100);
  return html`<label class="pf">
    <span class="pl" title=${`${name}. Drag left or right to change it.`}
      @pointerdown=${scrubber(pct, setPct, { step: 0.5, min, max })}>${letter}</span>
    <input type="number" step="0.5" min=${min} max=${max} .value=${String(pct)} aria-label=${`${name} in percent`}
      data-scrub @pointerdown=${boxScrubber(pct, setPct, { step: 0.5, min, max })}
      @input=${onInput((v) => { const n = Number(v); if (v.trim() !== "" && Number.isFinite(n)) setPct(n); })} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`;
}

/**
 * Which page of a paged document this layer belongs to, or every page.
 *
 * Nothing at all on a document with no pages, which is almost every document,
 * and nothing for a row layer inside a list: a row belongs to its list, and the
 * list is what carries the page. It sits in the Position card because it is the
 * other half of where a layer is, but it is the one setting in that card that
 * is not per shape: a layer is on the same page on Circular and on Rectangular.
 */
function layerPageField(host: EditorHost, el: CElement): TemplateResult | typeof nothing {
  const cfg = host.config;
  if (!usesPages(cfg)) return nothing;
  const id = el.payload.id;
  if (!cfg.elements.some((e) => e.payload.id === id)) return nothing;
  const spec = pagesSpecOf(cfg);
  const current = el.payload.page;
  const options: [string, string][] = [
    ["", "Every page"],
    ...pageNumbers(spec).map((page) => [String(page), `Page ${page}`] as [string, string]),
  ];
  return html`${selectField("Page", current === undefined ? "" : String(current), options, (v) => {
      host.update((c) => {
        const target = c.elements.find((e) => e.payload.id === id);
        if (!target) return;
        if (v === "") delete target.payload.page; else target.payload.page = Number(v);
      }, `el-${id}-page`);
      // Follow the layer to the page it was just put on. The canvas and the
      // Layers list both show one page, so without this the layer the author
      // is editing leaves both the moment they pick, while its card stays open.
      host.selectLayer(id);
    }, { def: "" })}
    <div class="hint">Every page keeps this layer on all of them, which is what a background, a border or a
      shared label wants. The page is the same on every shape.</div>`;
}

/** A percent of the face as the Position card's letter boxes print it. */
function framePercent(n: number): number {
  return Math.round(n * 1000) / 10;
}

/**
 * The Position card's line while it is folded: the page, where the layer sits,
 * its size and its turn, as the boxes inside print them. "Page 1 · X 25% Y 25%
 * · 50 × 50". The page is left out on a document without pages, and the turn
 * while there is none.
 */
export function positionSummary(cfg: CustomComplicationConfig, el: CElement, family: FamilyKind): string {
  const eff = effectivePlacement(cfg, family, el);
  const f = eff.frame;
  const parts: string[] = [];
  // A row layer belongs to its list, which carries the page.
  if (usesPages(cfg) && cfg.elements.some((e) => e.payload.id === el.payload.id)) {
    parts.push(el.payload.page === undefined ? "Every page" : `Page ${el.payload.page}`);
  }
  parts.push(`X ${framePercent(f.x)}% Y ${framePercent(f.y)}%`);
  parts.push(`${framePercent(f.width)} × ${framePercent(f.height)}`);
  const turn = Math.round(f.rotationDegrees);
  if (turn !== 0) parts.push(`${turn}°`);
  if (eff.isHidden) parts.push("hidden");
  return parts.join(" · ");
}

/**
 * The Tap card's line while it is folded: "off", or "on" and what a tap does.
 * A Play all pages tap adds how long each page is held, when every page holds
 * for the same time, since that is the number the reader tunes it by.
 */
export function tapSummary(cfg: CustomComplicationConfig, action: TapAction | undefined): string {
  if (action === undefined || action.type === "none") return "off";
  const on = `on · ${tapActionLabel(action)}`;
  if (action.type !== "playTour" || !usesPages(cfg)) return on;
  const spec = pagesSpecOf(cfg);
  const holds = pageNumbers(spec).map((n) => writtenDwell(spec, n) ?? PAGE_DEFAULT_DWELL);
  const first = holds[0];
  return first !== undefined && holds.every((h) => h === first) ? `${on} · ${dwellSeconds(first)} each` : on;
}

/**
 * The States card's line while it is folded: "none" and what that means, or
 * how many states there are and whether an Otherwise row catches the rest.
 */
export function statesCardSummary(rules: Rule[]): string {
  const none = "none · looks the same for every value";
  if (rules.length === 0) return none;
  const shape = tableShape(rules);
  if (!shape.ok) return "advanced rules";
  const n = shape.table.rows.length;
  const otherwise = shape.table.otherwise !== undefined;
  if (n === 0 && !otherwise) return none;
  const count = n === 1 ? "1 state" : `${n} states`;
  return otherwise ? `${count} · otherwise` : count;
}

/**
 * Where one layer sits on one shape: the frame, the turn, and whether it is
 * drawn at all. The four numbers are there so the card shows what its header
 * reset will take back; a reset that also re-centred and resized the layer
 * looked like a bug while the card held only Rotation.
 */
export function placementCard(host: EditorHost, el: CElement, family: FamilyKind): TemplateResult {
  const id = el.payload.id;
  const key = `el-${id}`;
  const eff = effectivePlacement(host.config, family, el);
  const f = eff.frame;
  const setFrame = (patch: Partial<NormalizedFrame>, k: string) => host.update((c) => setPlacement(c, family, id, { frame: typedFrame(f, patch) }), `${key}-${k}-${family}`);
  const placeChanged = !same(f, CENTERED_FRAME) || eff.isHidden;
  const anchor = el.payload.chartAnchor;
  // Dots and grid lines are drawn in their chart's box whatever their own frame
  // says, so a frame to edit would be numbers that change nothing. Only Hidden
  // means anything for them.
  if (el.kind === "chartDots" || el.kind === "chartGrid") {
    const chart = host.config.elements.find((e) => e.payload.id === el.payload.chart);
    return card(host, "placement", "Position", html`
      ${layerPageField(host, el)}
      <div class="hint keep">${el.kind === "chartDots" ? "Dots sit" : "Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${chart ? html`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${() => host.selectLayer(chart.payload.id)}>Select the chart</button></div>
      </div>` : nothing}
      ${checkField("Hidden", eff.isHidden, (v) => host.update((c) => setPlacement(c, family, id, { isHidden: v })), false)}`,
      { color: SECTION_COLOR.position, icon: "place", summary: `On the chart · ${familyTitle(family)}` });
  }
  // A line through the plot takes its place, length and angle from the chart:
  // it runs the plot's width (or height) at the reading it follows, and its
  // thickness is set in Look. Moving, sizing or turning it by hand would only
  // make it stop marking that reading, so none of that is offered. Rotation
  // shows only while an old document still carries one, so it can be cleared.
  if (anchor?.place === "through") {
    return card(host, "placement", "Position", html`
      ${layerPageField(host, el)}
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and color are in Look.</div>
      ${anchorFields(host, el, family)}
      ${f.rotationDegrees !== 0
        ? sliderField("Rotation", f.rotationDegrees, (v) => setFrame({ rotationDegrees: v }, "rot"),
          { min: -180, max: 180, step: 1, def: 0, format: (v) => `${Math.round(v)}°`, unit: "°", range: false })
        : nothing}
      ${checkField("Hidden", eff.isHidden, (v) => host.update((c) => setPlacement(c, family, id, { isHidden: v })), false)}`,
      { color: SECTION_COLOR.position, icon: "place", summary: `On the chart · ${familyTitle(family)}` });
  }
  // The section id stays "placement": it is a stored key (openSections, and
  // the browser's own memory of which cards were open), not a label.
  return card(host, "placement", "Position", html`
    ${layerPageField(host, el)}
    ${anchorFields(host, el, family)}
    ${anchor === undefined ? html`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${frameLetterField("X", "Left", f.x, (v) => setFrame({ x: v }, "x"), -100, 100)}
        ${frameLetterField("Y", "Top", f.y, (v) => setFrame({ y: v }, "y"), -100, 100)}
      </div>
    </div>
    ${lineUpField(host, el, family, f, ["across", "down", "both"])}
    </div>`
    // The threshold settles only the height, so a label beside it keeps its own X.
    : !chartAnchorIsColumn(anchor.at) ? html`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${frameLetterField("X", "Left", f.x, (v) => setFrame({ x: v }, "x"), -100, 100)}
      </div>
    </div>
    ${lineUpField(host, el, family, f, ["across"])}
    </div>`
    : nothing}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${frameLetterField("W", "Width", f.width, (v) => setFrame({ width: v }, "w"), 4, 200)}
        ${frameLetterField("H", "Height", f.height, (v) => setFrame({ height: v }, "h"), 4, 200)}
      </div>
    </div>
    ${sliderField("Rotation", f.rotationDegrees, (v) => setFrame({ rotationDegrees: v }, "rot"),
      { min: -180, max: 180, step: 1, def: 0, format: (v) => `${Math.round(v)}°`, unit: "°", range: false })}
    ${checkField("Hidden", eff.isHidden, (v) => host.update((c) => setPlacement(c, family, id, { isHidden: v })), false)}
    <div class="hint">${anchor === undefined ? "X, Y, W and H are" : "W and H are"} a percent of the face, on the ${familyTitle(family)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${anchor === undefined ? " Copy position and Paste position repeat a spot on another layer, on any shape." : ""}</div>`,
    { color: SECTION_COLOR.position, icon: "place", summary: positionSummary(host.config, el, family),
      ...(placeChanged ? {
        resetTitle: `Put this layer back to the middle of the ${familyTitle(family)} face at half size, unrotated and shown`,
        reset: () => host.update((c) => setPlacement(c, family, id, { frame: { ...CENTERED_FRAME }, isHidden: false })),
      } : {}) });
}

const CENTER_LABELS: Record<CenterAxis, { label: string; title: string }> = {
  across: { label: "Center across", title: "Move this layer to the middle of the face, left to right" },
  down: { label: "Center up and down", title: "Move this layer to the middle of the face, top to bottom" },
  both: { label: "Center", title: "Move this layer to the middle of the face" },
};

/**
 * The Position card's shortcuts: centre the layer on the face, and copy its
 * position onto another layer. Copy and paste carry X, Y, W, H and rotation,
 * on the shape on screen only, and reach a layer on another shape or in
 * another complication, which is how the same spot is repeated on Circular and
 * Corner without typing the numbers twice. An anchored layer takes only the
 * axes its anchor leaves free, so it gets centring across and no paste.
 */
function lineUpField(host: EditorHost, el: CElement, family: FamilyKind, f: NormalizedFrame, axes: CenterAxis[]): TemplateResult {
  const id = el.payload.id;
  const setWhole = (frame: NormalizedFrame, k: string) => host.update((c) => setPlacement(c, family, id, { frame }), `el-${id}-${k}-${family}`);
  const copied = host.copiedPosition;
  const anchored = el.payload.chartAnchor !== undefined;
  const copiedHere = copied !== undefined && copied.family === family && same(copied.frame, f);
  return html`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${axes.map((axis) => html`<button class="small" title=${CENTER_LABELS[axis].title}
        ?disabled=${isCentered(f, axis)}
        @click=${() => setWhole(centerFrame(f, axis), `center-${axis}`)}>${CENTER_LABELS[axis].label}</button>`)}
    </div>
  </div>
  ${anchored ? nothing : html`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${() => host.copyPosition({ frame: { ...f }, family })}>${copiedHere ? "Copied" : "Copy position"}</button>
      <button class="small" ?disabled=${copied === undefined || copiedHere}
        title=${copied === undefined
          ? "Copy a position from a layer first"
          : copied.family === family || (family !== "rectangular" && copied.family !== "rectangular")
            ? `Put this layer where the copied one sits on the ${familyTitle(copied.family)} face`
            : `Put this layer where the copied one sits on the ${familyTitle(copied.family)} face, scaled for this shape`}
        @click=${() => copied && setWhole(pastedFrame(copied, family, el.kind), "paste")}>Paste position</button>
    </div>
  </div>`}`;
}

/**
 * The chart a layer follows, where it sits against the reading, and the nudge
 * from there. Only for a layer that has an anchor, which is how a chart marker
 * is made; every other layer sees none of this.
 *
 * X and Y are hidden while a layer is anchored, because the anchor decides both
 * every time the chart refreshes. The nudge is what moves it from there, and it
 * is in points rather than a percent, because it is an offset from a spot on the
 * plot and not a place on the face.
 */
function anchorFields(host: EditorHost, el: CElement, family: FamilyKind): TemplateResult | typeof nothing {
  const anchor = el.payload.chartAnchor;
  if (anchor === undefined) return nothing;
  const id = el.payload.id;
  const key = `el-${id}-anchor`;
  const charts = host.config.elements.filter((e) => e.kind === "chart");
  const setAnchor = (m: (a: ChartAnchor) => void, k?: string) => host.update((c) => {
    const target = c.elements.find((e) => e.payload.id === id);
    if (target?.payload.chartAnchor) m(target.payload.chartAnchor);
  }, k ? `${key}-${k}` : undefined);
  const ctx = describeContext(host);
  const gone = !charts.some((e) => e.payload.id === anchor.layer);
  return html`
    <div class="fgroup">
    ${charts.length < 2 ? nothing : selectField("Follows", anchor.layer,
      charts.map((e): [string, string] => [e.payload.id, layerTitle(e, ctx)]),
      (v) => setAnchor((a) => { a.layer = v; }))}
    ${selectField("Reading", anchor.at, CHART_ANCHOR_POINTS as unknown as [ChartAnchorPoint, string][],
      (v) => host.update((c) => {
        const target = c.elements.find((e) => e.payload.id === id);
        if (!target?.payload.chartAnchor) return;
        target.payload.chartAnchor.at = v;
        // Threshold and now are numbers on the chart. A layer moved onto one the
        // chart does not have yet seeds it, so the layer lands on a reading.
        const ch = c.elements.find((e) => e.payload.id === anchor.layer);
        if (ch?.kind !== "chart") return;
        if (v === "threshold" && ch.payload.thresholdValue === undefined) {
          ch.payload.thresholdValue = seedThreshold(chartNumbers(host.resolve(ch.payload.value) ?? ""));
          ch.payload.drawsThreshold = false;
        }
        if (v === "now" && ch.payload.nowIndex === undefined) {
          ch.payload.nowIndex = { kind: { kind: "time", timeField: "hour" } };
          ch.payload.drawsNowLine = false;
        }
      }), { def: "highest" as ChartAnchorPoint })}
    ${chartPointFields(host, anchor, key)}
    ${/* A line runs through the plot by definition, so it has no side to sit on,
       * and a marker is never turned into a line from here. */
      anchor.place === "through" ? nothing
      : selectField("Sits", anchor.place, CHART_ANCHOR_PLACES.filter(([p]) => p !== "through") as [ChartAnchorPlace, string][],
      (v) => setAnchor((a) => { a.place = v; }), { def: "above" as ChartAnchorPlace })}
    </div>
    <div class="grid2">
      ${/* A marker belongs to its column, so it only moves up and down. Nudge X
         * is shown only to clear a sideways nudge written before that rule. */
        !anchor.dx ? nothing : numberField("Nudge X", anchor.dx, (v) => setAnchor((a) => {
        if (v) a.dx = v; else delete a.dx;
      }, "dx"), { step: 0.5, def: 0, unit: "pt" })}
      ${/* A line nudged off its reading no longer marks it, so a line shows Nudge Y
         * only to clear one written before that rule. */
        anchor.place === "through" && !anchor.dy ? nothing
        : numberField("Nudge Y", anchor.dy ?? 0, (v) => setAnchor((a) => {
        if (v) a.dy = v; else delete a.dy;
      }, "dy"), { step: 0.5, def: 0, unit: "pt" })}
    </div>
    ${anchor.place === "through" ? nothing : html`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${() => host.update((c) => {
            const target = c.elements.find((e) => e.payload.id === id);
            if (target) delete target.payload.chartAnchor;
          })}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${el.kind === "text"
          ? html`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${() => host.update((c) => { chartMarkerToIcon(c, id); })}><span>Use an icon</span></button>`
          : nothing}
      </div>
    </div>`}
    ${gone
      ? html`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${anchor.place === "through" ? ", or delete the line" : ", or unpin it"}.</div>`
      : anchor.place === "through" ? nothing
      : html`<div class="hint">This layer follows that reading on the ${familyTitle(family)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`;
}

/**
 * The number behind a threshold or now reading, edited from the layer that
 * follows it. The number itself lives on the chart, so every layer on the same
 * reading moves together; the hint says so when there is more than one.
 */
function chartPointFields(host: EditorHost, anchor: ChartAnchor, key: string): TemplateResult | typeof nothing {
  const chart = host.config.elements.find((e) => e.payload.id === anchor.layer);
  if (chart?.kind !== "chart") return nothing;
  const c = chart.payload;
  const setChart = (m: (p: typeof c) => void, k: string) => host.update((cfg) => {
    const ch = cfg.elements.find((e) => e.payload.id === anchor.layer);
    if (ch?.kind === "chart") m(ch.payload);
  }, `${key}-${k}`);
  const sharing = chartMarkersOf(host.config, anchor.layer).filter((m) => m.payload.chartAnchor?.at === anchor.at).length;
  const shared = sharing > 1
    ? ` ${sharing} layers follow this ${anchor.at === "now" ? "reading" : "threshold"}, and they all move with this number.`
    : "";
  if (anchor.at === "threshold") {
    // The default is where a new threshold starts, the middle of the readings
    // (see `seedThreshold`), the way a new line's thickness and color reset to
    // what the line was drawn with. The chart never draws its own line once a
    // layer follows the threshold, so every edit keeps `drawsThreshold` off.
    const seed = seedThreshold(chartNumbers(host.resolve(c.value) ?? ""));
    return html`
      <div class="grid2">
        ${numberField("Threshold at", c.thresholdValue ?? seed, (v) => setChart((p) => { p.thresholdValue = v ?? seed; p.drawsThreshold = false; }, "thval"),
          { def: seed })}
      </div>
      <div class="hint">${c.scale === "fixed"
        ? "A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for."
        : "The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${shared}</div>`;
  }
  if (anchor.at === "now") {
    return html`
      ${valueEditor(host, c.nowIndex ?? { kind: { kind: "time", timeField: "hour" } },
        (v) => setChart((p) => { p.nowIndex = v; p.drawsNowLine = false; }, "nowidx"),
        { showResolved: true, label: "Now is reading", key: `${key}-nowindex` })}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${shared}</div>`;
  }
  if (anchor.at === "zero") {
    return html`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`;
  }
  return nothing;
}

/** What a tap on this layer does. A tap-area layer has no card, since the
 * layer is the tap. */
export function tapCard(host: EditorHost, el: CElement): TemplateResult | typeof nothing {
  if (el.kind === "tap") return nothing;
  // A row layer has no attached tap: an attached tap is a layer of the
  // document sitting over its owner, and a row is drawn once per item. A row
  // is made tappable by adding a tap to the row itself.
  if (listOwning(host.config, el.payload.id)) return nothing;
  const id = el.payload.id;
  const attached = attachedTapsOf(host.config, id)[0];
  return card(host, "tappable", "Tap", tappableSection(host, el, `el-${id}`),
    { color: SECTION_COLOR.tap, icon: "tap", summary: tapSummary(host.config, attached ? (attached.payload as TapElement).action : undefined),
      ...(attached ? { reset: () => host.update((c) => detachTaps(c, id)) } : {}) });
}

/** What a layer needs to draw a row of clock times. Both the timeline and the
 * chart carry exactly these six keys, on the same names and with the same
 * defaults, so one set of controls serves both. */
interface TimeLabelled {
  timeLabelCount: number;
  labelSize: number;
  labelColorHex: string;
  /** Absent on a chart times layer, whose frame says where the row is, so the
   * Row control is not offered there. */
  labelsAbove?: boolean;
  hourCycle: TimelineHourCycle;
  minutes: TimelineMinuteStyle;
}

/**
 * The six controls behind a row of clock times: how many, how big, what color,
 * which side, which clock, and whether they carry their minutes.
 *
 * Shared by the timeline and the chart. Everything below the count only appears
 * once there is a count, so a layer drawing no times shows one slider and
 * nothing else.
 */
function timeLabelFields<T extends TimeLabelled>(
  el: T,
  set: (mutate: (p: T) => void, k?: string) => void,
  base: Record<string, unknown>,
  keyPrefix: string,
  hint: TemplateResult,
): TemplateResult {
  return html`
    ${sliderField("Times", el.timeLabelCount, (v) => set((p) => {
      p.timeLabelCount = Math.max(0, Math.min(TIMELINE_MAX_LABEL_COUNT, Math.round(v)));
    }, `${keyPrefix}count`), {
      min: 0,
      max: TIMELINE_MAX_LABEL_COUNT,
      step: 1,
      def: base.timeLabelCount as number,
      format: (v) => (v <= 0 ? "None" : String(Math.round(v))),
      range: false,
    })}
    ${el.timeLabelCount <= 0 ? nothing : html`
      <div class="fgroup">
      <div class="grid2">
        ${numberField("Time size", el.labelSize, (v) => set((p) => {
          p.labelSize = Math.min(TIMELINE_MAX_LABEL_SIZE, Math.max(TIMELINE_MIN_LABEL_SIZE, v ?? TIMELINE_DEFAULT_LABEL_SIZE));
        }, `${keyPrefix}size`), { step: 0.5, min: TIMELINE_MIN_LABEL_SIZE, max: TIMELINE_MAX_LABEL_SIZE, def: base.labelSize as number, unit: "pt" })}
        ${colorField("Time color", el.labelColorHex, (v) => set((p) => {
          p.labelColorHex = v ?? TIMELINE_DEFAULT_LABEL_HEX;
        }, `${keyPrefix}color`), false, base.labelColorHex as string)}
      </div>
      ${el.labelsAbove === undefined ? nothing : segField("Row", el.labelsAbove ? "above" : "below", [["below", "Below"], ["above", "Above"]],
        (v) => set((p) => { p.labelsAbove = v === "above"; }),
        { def: base.labelsAbove === true ? "above" : "below" })}
      </div>
      <div class="fgroup">
      ${segField("Clock", el.hourCycle, TIMELINE_HOUR_CYCLES,
        (v) => set((p) => { p.hourCycle = v; }),
        { titles: { auto: "Whatever clock the watch is set to" }, def: base.hourCycle as TimelineHourCycle })}
      ${segField("Minutes", el.minutes, TIMELINE_MINUTE_STYLES,
        (v) => set((p) => { p.minutes = v; }),
        { titles: { auto: "Kept up to a three hour span, dropped past it" }, def: base.minutes as TimelineMinuteStyle })}
      ${hint}
      </div>`}`;
}

/** One end of a gauge's range. */
export type GaugeEnd = "min" | "max";
export type GaugeEndMode = "number" | "entity";

const GAUGE_END_MODES: [GaugeEndMode, string][] = [["number", "Number"], ["entity", "Entity"]];

/** The four fields a scale's two ends are made of. A gauge has them, and so
 * does a level, so the Min and Max rows below are written once. */
interface RangeEnds {
  minValue: number;
  maxValue: number;
  minSource?: Value;
  maxSource?: Value;
}

/** What one end of a gauge's range reads, as the stored layer says: an end with
 * a source is an entity end, and any other end is its number. */
export function gaugeEndMode(g: RangeEnds, end: GaugeEnd): GaugeEndMode {
  return (end === "min" ? g.minSource : g.maxSource) === undefined ? "number" : "entity";
}

/**
 * Switch one end between its number and an entity. Only the source key moves:
 * the number stays stored, as the entity's fallback, so switching back to
 * Number brings the old number back.
 */
export function setGaugeEndMode(p: RangeEnds, end: GaugeEnd, mode: GaugeEndMode): void {
  const key = end === "min" ? "minSource" : "maxSource";
  if (mode === "number") delete p[key];
  else if (p[key] === undefined) p[key] = { kind: { kind: "entityState", entityId: "", displayName: "", domain: "" } };
}

/**
 * A gauge's Min and Max. Each end is a fixed number or an entity, and only
 * that one control is on screen: the Number and Entity switch on the title
 * line picks it. An entity end still keeps its number for when the entity has
 * no number to give, and the hint under the picker names it, so there is no
 * second box to explain.
 *
 * Two number ends share a row as they always have. An entity picker needs the
 * width for its name and live value, so once either end is an entity both
 * ends stack.
 */
function gaugeRangeFields(
  host: EditorHost,
  g: RangeEnds,
  defaults: Record<GaugeEnd, number>,
  key: string,
  setGauge: (mutate: (p: RangeEnds) => void, k?: string) => void,
  what = "gauge",
): TemplateResult {
  const end = (which: GaugeEnd) => {
    const isMin = which === "min";
    const label = isMin ? "Min" : "Max";
    const mode = gaugeEndMode(g, which);
    const stored = isMin ? g.minValue : g.maxValue;
    const setNumber = (v: number | undefined) => setGauge((p) => {
      if (isMin) p.minValue = v ?? 0; else p.maxValue = v ?? 100;
    }, which);
    const titles: Record<GaugeEndMode, string> = {
      number: `${label} is a fixed number`,
      entity: `${label} reads a number from an entity`,
    };
    const head = html`<div class="gauge-end-head">
      ${fieldLabel(label, mode === "number" ? backTo<number | undefined>(stored, defaults[which], setNumber) : undefined)}
      <span class="seg" role="radiogroup" aria-label=${`${label} comes from`}>
        ${GAUGE_END_MODES.map(([m, text]) => html`<button type="button" role="radio" aria-checked=${m === mode ? "true" : "false"}
          class=${m === mode ? "on" : ""} title=${titles[m]}
          @click=${() => { if (m !== mode) setGauge((p) => setGaugeEndMode(p, which, m)); }}>${text}</button>`)}
      </span>
    </div>`;
    const source = isMin ? g.minSource : g.maxSource;
    if (mode === "number" || source === undefined) {
      return html`<div class="field gauge-end">${head}${numberInput(stored, setNumber, { ariaLabel: label })}</div>`;
    }
    return html`<div class="field gauge-end">${head}${valueEditor(host, source, (v) => setGauge((p) => {
        if (isMin) p.minSource = v; else p.maxSource = v;
      }, `${which}src`), { showResolved: true, noLabel: true, label, key: `${key}-${which}source` })}</div>
      <div class="hint">If the entity has no number, the ${what} uses ${String(stored)}.</div>`;
  };
  return g.minSource === undefined && g.maxSource === undefined
    ? html`<div class="grid2 gauge-ends">${end("min")}${end("max")}</div>`
    : html`${end("min")}${end("max")}`;
}

/** The payload field the Fill by value card owns. */
const LEVEL_KEYS = ["level"] as const;

/** The Fill by value card's one-line summary: on or off. Which way it fills
 * and across what is the card's first two rows once it is open. */
export function levelSummary(el: Extract<CElement, { kind: "icon" | "shape" }>): string {
  return el.payload.level === undefined ? "off" : "on";
}

/** The layer kinds that can fill by value. A line is a shape with no body to
 * fill, so it is left out here as well as in both renderers. */
function layerTakesLevel(el: CElement): el is Extract<CElement, { kind: "icon" | "shape" }> {
  if (el.kind === "icon") return true;
  return el.kind === "shape" && el.payload.kind !== "line";
}

/**
 * Fill by value: the switch, the reading behind it, the scale's two ends, which
 * way the fill grows and what the empty part is painted in.
 *
 * The layer is drawn twice on the watch and in the preview, so everything else
 * about it (its color, its gradient, its rules) is still one setting and stays
 * on its own cards. This card only says how much of the layer is colored in.
 */
function levelFields(
  host: EditorHost,
  el: Extract<CElement, { kind: "icon" | "shape" }>,
  key: string,
  upd: (mutate: (e: CElement) => void, k?: string) => void,
): TemplateResult {
  const level = el.payload.level;
  const setLevel = (mutate: (l: Level) => void, k?: string) => upd((e) => {
    const p = e.payload as { level?: Level };
    if (p.level !== undefined) mutate(p.level);
  }, k);
  // Switched on, a fill starts by reading whatever the layer already reads, so
  // an icon bound to a battery sensor fills by that battery without a second
  // entity being picked.
  const ref = elementEntity(host.config, el);
  const seed = () => defaultLevel(ref ? { kind: { kind: "entityState", ...ref } } : literal("50"));
  const what = el.kind === "icon" ? "icon" : "shape";
  return html`
    ${checkField("Fill by value", level !== undefined, (v) => upd((e) => {
      const p = e.payload as { level?: Level };
      if (v) p.level = seed(); else delete p.level;
    }, "level-on"), false)}
    ${level === undefined
      ? html`<div class="hint">Draws the ${what} twice: all of it in a faint track color, then as much of it as
          the reading fills, in its own color. A battery icon that fills to 60%, or a tank that empties.</div>`
      : html`
        ${valueEditor(host, level.value, (v) => setLevel((l) => { l.value = v; }, "level-value"),
          { showResolved: true, label: "Reading", key: `${key}-level-value` })}
        <div class="fgroup">
        ${gaugeRangeFields(host, level, { min: LEVEL_DEFAULT_MIN, max: LEVEL_DEFAULT_MAX },
          `${key}-level`, (m, k) => setLevel(m, k ? `level-${k}` : "level-range"), "fill")}
        </div>
        <div class="fgroup">
        ${segField("Direction", level.direction, [...LEVEL_DIRECTIONS] as [LevelDirection, string][],
          (v) => setLevel((l) => { l.direction = v; }, "level-dir"),
          { titles: {
              up: "Fills from the bottom edge upward",
              down: "Fills from the top edge downward",
              left: "Fills from the right edge leftward",
              right: "Fills from the left edge rightward",
            }, def: LEVEL_DEFAULT_DIRECTION })}
        ${colorField("Track color", level.trackColorHex, (v) => setLevel((l) => {
          if (v === undefined) delete l.trackColorHex; else l.trackColorHex = v;
        }, "level-track"), true, null)}
        <div class="hint">Off, the empty part takes the layer's own color at a quarter strength.
          A tinted face keeps only how see-through a color is, so a track at full strength reads
          there as the same color as the fill.</div>
        </div>`}`;
}

/**
 * Curved text: the Curve switch, the four numbers behind it, and which way it reads.
 *
 * Every shape with a canvas offers it (`familyAllowsArcText`); inline has no
 * canvas, so there the whole group is absent rather than greyed out: a row that
 * can never be switched on is a row that only asks a question. A countdown keeps the row
 * but greys the switch, because the watch draws a ticking timer as one
 * system-owned string and there are no glyphs to bend.
 */
function textArcFields(
  t: TextElement,
  family: FamilyKind,
  set: (mutate: (p: TextElement) => void, k?: string) => void,
): TemplateResult | typeof nothing {
  if (!familyAllowsArcText(family)) return nothing;
  const arc = t.arc;
  const countdown = t.countdown === true;
  const setArc = (mutate: (a: TextArc) => void, k?: string) => set((p) => {
    if (p.arc !== undefined) mutate(p.arc);
  }, k);
  return html`
    <div class="fgroup">
      ${checkField("Curve", arc !== undefined, (v) => set((p) => {
        if (v) p.arc = { radius: ARC_RADIUS_DEFAULT };
        else delete p.arc;
      }, "arc"), false, { disabled: countdown })}
      ${countdown
        ? html`<div class="hint">A countdown ticks as one piece of system text, which cannot be bent around a circle. Turn the countdown off to curve this layer.</div>`
        : nothing}
      ${arc === undefined || countdown ? nothing : html`
        ${numberField("Radius", arc.radius, (v) => setArc((a) => {
          a.radius = Math.min(ARC_RADIUS_MAX, Math.max(ARC_RADIUS_MIN, v ?? ARC_RADIUS_DEFAULT));
        }, "arc-radius"), { step: 0.05, min: ARC_RADIUS_MIN, max: ARC_RADIUS_MAX, unit: "of box", def: ARC_RADIUS_DEFAULT })}
        ${numberField("Position", arc.angle ?? 0, (v) => setArc((a) => {
          const deg = v ?? 0;
          if (deg === 0) delete a.angle; else a.angle = deg;
        }, "arc-angle"), { step: 5, min: -360, max: 360, unit: "°", def: 0 })}
        ${numberField("Spacing", arc.spacing ?? 0, (v) => setArc((a) => {
          const pt = clampArcSpacing(v ?? 0);
          if (pt === 0) delete a.spacing; else a.spacing = pt;
        }, "arc-spacing"), { step: 0.5, min: ARC_SPACING_MIN, max: ARC_SPACING_MAX, unit: "pt", def: 0 })}
        ${numberField("Spread", Math.abs(arc.sweep ?? ARC_SWEEP_DEFAULT), (v) => setArc((a) => {
          const sign = (a.sweep ?? ARC_SWEEP_DEFAULT) < 0 ? -1 : 1;
          const deg = clampArcSweep(sign * Math.abs(v ?? ARC_SWEEP_DEFAULT));
          if (deg === ARC_SWEEP_DEFAULT) delete a.sweep; else a.sweep = deg;
        }, "arc-sweep"), { step: 5, min: ARC_SWEEP_MIN, max: ARC_SWEEP_MAX, unit: "°", def: ARC_SWEEP_DEFAULT })}
        ${segField("Reads", arcReads(arc), ARC_READS_OPTIONS, (v) => setArc((a) => {
          const size = Math.abs(a.sweep ?? ARC_SWEEP_DEFAULT);
          const sweep = v === "bottom" ? -size : size;
          if (sweep === ARC_SWEEP_DEFAULT) delete a.sweep; else a.sweep = sweep;
          if (v === "bottom") a.flip = true; else delete a.flip;
          // Text still sitting at the default spot moves to the side it now reads
          // on, so the two clicks a bottom line needs are one.
          if (v === "bottom" && (a.angle ?? 0) === 0) a.angle = 180;
          if (v === "top" && a.angle === 180) delete a.angle;
        }, "arc-reads"), { def: "top" })}
        <div class="hint">Drag the box to grow the circle: a radius of ${ARC_RADIUS_DEFAULT} fills it,
          and a bigger one bends the text less without moving it. Position is where the
          middle of the text sits, 0 at the top and 90 on the right. Spread is how much of the circle the text may use; longer text shrinks
          to half size, then runs past the ends. Spacing adds room between the letters.</div>`}
    </div>`;
}

/** The two ways a curved line reads: clockwise over the top with the letters'
 * feet toward the centre, or anticlockwise along the bottom with the letters
 * turned over. Either alone reads backwards or upside down, so they are one
 * choice; a document holding another mix shows neither. */
type ArcReads = "top" | "bottom" | "mixed";
const ARC_READS_OPTIONS: [ArcReads, string][] = [["top", "Over the top"], ["bottom", "Along the bottom"]];

export function arcReads(arc: TextArc): ArcReads {
  const anticlockwise = (arc.sweep ?? ARC_SWEEP_DEFAULT) < 0;
  const flipped = arc.flip === true;
  if (!anticlockwise && !flipped) return "top";
  if (anticlockwise && flipped) return "bottom";
  return "mixed";
}

/**
 * A text layer's color by value: the chart's Color and Highlight fields, read
 * against the numbers in the text instead of a series. Every key is optional on
 * a text layer, so each field deletes its key when it goes back to the default
 * and a layer that tried the feature and turned it off saves as it did before.
 */
function textValueColorFields(
  host: EditorHost,
  t: TextElement,
  set: (mutate: (p: TextElement) => void, k?: string) => void,
  colorRow: (mode: SegChoice<ChartColoring>) => unknown,
): TemplateResult {
  const coloring = t.coloring ?? "uniform";
  // The shared table editor wants a table that is always there; this one holds
  // the text layer's optional keys for the length of one edit.
  const setBands = (mutate: (p: BandedLayer) => void, k?: string) => set((p) => {
    const table: BandedLayer = { bands: p.bands ?? [], bandAboveColorHex: p.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX };
    mutate(table);
    if (table.bands.length > 0) p.bands = table.bands; else delete p.bands;
    if (table.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) p.bandAboveColorHex = table.bandAboveColorHex;
    else delete p.bandAboveColorHex;
  }, k);
  // The table marks the number the text reads, when it reads exactly one.
  const numbers = coloring === "bands" ? chartNumbers(host.resolve(t.value) ?? "") : [];
  const row = colorRow({ label: "Color", value: coloring, options: CHART_COLORINGS, def: "uniform", set: (v) => set((p) => {
    if (v === "uniform") { delete p.coloring; return; }
    p.coloring = v;
    // Seeded from the numbers the text shows right now, as a chart seeds from
    // its readings, so the switch paints something the moment it is flipped.
    if ((p.bands?.length ?? 0) === 0) p.bands = seedBands(chartNumbers(host.resolve(p.value) ?? ""));
  }) });
  if (coloring !== "bands") return html`${row}`;
  return html`
    <div class="fgroup">
    ${row}
    <div class="hint">Each number in the text takes the color of the band it falls in, and other text keeps the layer color.</div>
    ${bandTableFields({ bands: t.bands ?? [], bandAboveColorHex: t.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX }, t.colorSlot.baseColorHex, setBands,
      numbers.length === 1 ? numbers[0] : undefined)}
    </div>`;
}

/** A text layer's Highlight row: the highest or lowest number in the text in a
 * color of its own. It sits behind the Look card's More line. */
function textHighlightFields(
  t: TextElement,
  set: (mutate: (p: TextElement) => void, k?: string) => void,
): TemplateResult {
  const coloring = t.coloring ?? "uniform";
  const highlight = t.highlight ?? "none";
  const setHex = (key: "highColorHex" | "lowColorHex", def: string, v: string | undefined) => set((p) => {
    if (v === undefined || v === def) delete p[key]; else p[key] = v;
  }, key);
  const highlightHint = highlight === "highest" ? "The highest number takes its own color"
    : highlight === "lowest" ? "The lowest number takes its own color"
    : "The highest and lowest numbers take their own colors";
  return html`
    <div class="fgroup">
    ${segField("Highlight", highlight, CHART_HIGHLIGHTS, (v) => set((p) => {
      if (v === "none") delete p.highlight; else p.highlight = v;
    }), { def: "none" })}
    ${highlight === "none" ? nothing : html`
      <div class="grid2">
        ${highlight === "lowest" ? nothing
          : colorField("Highest color", t.highColorHex ?? CHART_DEFAULT_HIGH_HEX, (v) => setHex("highColorHex", CHART_DEFAULT_HIGH_HEX, v), false, CHART_DEFAULT_HIGH_HEX)}
        ${highlight === "highest" ? nothing
          : colorField("Lowest color", t.lowColorHex ?? CHART_DEFAULT_LOW_HEX, (v) => setHex("lowColorHex", CHART_DEFAULT_LOW_HEX, v), false, CHART_DEFAULT_LOW_HEX)}
      </div>
      ${coloring === "bands" ? nothing : html`<div class="hint">${highlightHint}, and other text keeps the layer color.</div>`}`}
    </div>`;
}

// ── Rich text ─────────────────────────────────────────────────────────────
// A text layer drawn as a row of parts, each in its own color, weight and
// size. Most text layers are a few typed words, so all of it waits behind one
// switch and the Content card reads as it always did until that is on. The
// edits themselves are in rich-text.ts; this is the form around them.

type TextLayer = Extract<CElement, { kind: "text" }>;

/** The part each rich text layer has open, by layer id. Transient on purpose,
 * like `advancedRules`: which part is open is not part of the document and
 * does not belong in undo. An id whose part has gone falls back to part 1. */
const selectedParts = new Map<string, string>();
/** Layers asking whether to leave Rich under the Type row, with the type that
 * was picked. */
const pendingRichTextOff = new Map<string, "plain" | "countdown">();
/** The note under a layer's Type row, with whether the layer had parts when it
 * was written. An undo can flip the type back under a note, and a note about
 * the other state is then no longer shown. */
const richTextNotes = new Map<string, { text: string; rich: boolean; warn?: boolean }>();
/** A states table's part before its first row exists. As with
 * `pendingTestValues`, there is no rule yet to carry it. */
const pendingPartTargets = new Map<string, string>();

/** The range a part's own font size field offers. */
const PART_SIZE_MIN = 4;
const PART_SIZE_MAX = 40;

/** Which of a part's three Color choices it is on. */
export type PartColorMode = "layer" | "pick" | "bands";

const PART_COLORS: [PartColorMode, string][] = [["layer", "Layer"], ["pick", "Pick"], ["bands", "By value"]];

/** What a text layer draws, as its Type row names it. */
export type TextType = "plain" | "rich" | "countdown";

/** Countdown is not on the Type row: few layers need it, so it is a switch
 * under the value, offered only when the value is a timer or a future time. */
const TEXT_TYPES: [TextType, string][] = [["plain", "Plain"], ["rich", "Rich"]];
const TEXT_TYPE_TITLES: Partial<Record<TextType, string>> = {
  plain: "One line: typed words, a live value or a template",
  rich: "Parts, each with its own color, weight and size",
};

/** The Count down switch and its notes, for any value a countdown can sit
 * on: a text layer, the Inline text and a corner's bezel label. Hidden while
 * off on a value with no time in it, so it only shows where it can work; kept
 * while on, with a warning, so a countdown that stopped working can be
 * turned off. */
function countdownFields(host: EditorHost, on: boolean, value: Value | undefined, set: (on: boolean) => void): unknown {
  const works = value !== undefined && host.canCountDown(value);
  if (!on && !works) return nothing;
  return html`${checkField("Count down", on, set)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${on && !works ? html`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>` : nothing}`;
}

/** A text layer's Type. A countdown wins over parts, because the watch never
 * draws the parts of a countdown. */
export function textType(t: Pick<TextElement, "parts" | "countdown">): TextType {
  if (t.countdown === true) return "countdown";
  return textUsesParts(t) ? "rich" : "plain";
}

/** A typed part's text as words and runs of spaces, so its chip can draw each
 * space as a faint dot. A space at either end is the gap to the next part, and
 * drawn as a space it would not be seen. */
export function chipRuns(text: string): { text: string; space: boolean }[] {
  return (text.match(/ +|[^ ]+/g) ?? []).map((run) => ({ text: run, space: run.startsWith(" ") }));
}

/** What a part's chip says: typed words as typed, a template as its source,
 * and anything else by the name its value chip gives it. */
export function partChip(value: Value, ctx?: DescribeContext): { kind: "text" | "value" | "template"; label: string } {
  const words = literalPartText(value);
  if (words !== undefined) return { kind: "text", label: words };
  if (value.kind.kind === "jinja") return { kind: "template", label: truncate(value.kind.value, 40) || "template" };
  return { kind: "value", label: describeValueBody(value, ctx) };
}

/** A part as one entry of a rule's Changes menu: its number, then its words
 * trimmed short or the name of what it reads. */
export function rulePartLabel(part: TextPart, index: number, ctx?: DescribeContext): string {
  const words = literalPartText(part.value);
  const what = words === undefined
    ? truncate(describeValueBody(part.value, ctx), 28)
    : words.trim() === "" ? (words === "" ? "empty" : "spaces") : `"${truncate(words, 24)}"`;
  return `Part ${index + 1}: ${what}`;
}

/** The Changes menu: the whole text, then every part. A rule aimed at a part
 * that has since gone keeps an entry of its own, or the menu would claim the
 * rule changes the whole text when it changes nothing. */
export function rulePartOptions(parts: readonly TextPart[], partId: string | undefined, ctx?: DescribeContext): [string, string][] {
  const options: [string, string][] = [["", "Whole text"], ...parts.map((p, i): [string, string] => [p.id, rulePartLabel(p, i, ctx)])];
  if (partId !== undefined && !parts.some((p) => p.id === partId)) options.push([partId, "A part that is gone"]);
  return options;
}

export function partColorMode(part: TextPart): PartColorMode {
  if (part.coloring === "bands") return "bands";
  return part.colorHex === undefined ? "layer" : "pick";
}

/** The dot at the front of a part's chip: the color it draws in, or a wheel
 * of its own band colors when it colors by value. */
export function partDotBackground(part: TextPart, layerHex: string): string {
  if (partColorMode(part) === "bands" && (part.bands?.length ?? 0) > 0) {
    const colors = [...chartSortedBands({ bands: part.bands! }).map((b) => b.colorHex), part.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX];
    const step = 100 / colors.length;
    const at = (n: number) => `${Math.round(n * 10) / 10}%`;
    return `conic-gradient(${colors.map((c, i) => `${c} ${at(i * step)} ${at((i + 1) * step)}`).join(", ")})`;
  }
  return part.colorHex ?? layerHex;
}

/** Why rich text cannot turn off yet, naming every part in the way. */
export function richTextBlockedHint(blocked: readonly RichTextBlocked[]): string {
  return `Rich text stays on, because the parts cannot join into one line. ${blockedReasons(blocked)} Change or remove ${blocked.length === 1 ? "that part" : "those parts"} first.`;
}

/** Which parts cannot go in a template, and why, in a sentence per reason. */
function blockedReasons(blocked: readonly RichTextBlocked[]): string {
  const named = (list: readonly RichTextBlocked[]) => (list.length === 1
    ? `Part ${list[0]!.index + 1}`
    : `Parts ${joinWords(list.map((b) => String(b.index + 1)))}`);
  const kinds = blocked.filter((b) => b.reason === "kind");
  const formats = blocked.filter((b) => b.reason === "format");
  const said: string[] = [];
  if (kinds.length > 0) said.push(`${named(kinds)} ${kinds.length === 1 ? "shows" : "show"} a value a template cannot read, such as data age or a chart's number.`);
  if (formats.length > 0) said.push(`${named(formats)} ${formats.length === 1 ? "uses" : "use"} a relative time or duration format, which a template cannot print.`);
  return said.join(" ");
}

const MOVED_WORDS: Record<RichTextMoved, string> = { fontSize: "font size", fontWeight: "weight", color: "color", bands: "color bands" };

/** The note once rich text is off: what the one part handed to Look, or how
 * the parts joined. */
export function richTextOffNote(result: { joined: false; moved: readonly RichTextMoved[] } | { joined: true; template: boolean }): string {
  if (result.joined) {
    return result.template
      ? "Rich text is off. The parts joined into one template, so the live values still update."
      : "Rich text is off. The parts joined into one line of text.";
  }
  if (result.moved.length === 0) return "Rich text is off.";
  return `Rich text is off. The part's ${joinWords(result.moved.map((m) => MOVED_WORDS[m]))} moved into Look.`;
}

/**
 * A text layer's Content card: the Type row, then what that type needs. Plain
 * edits the layer's value, with the Count down switch under it when the value
 * holds a time; Rich replaces it with the parts and the editor for the one
 * picked.
 *
 * Leaving Rich takes one road whichever type it leaves for. One part hands its
 * styles to Look and goes straight through. Two or more join into one line,
 * which undo can take back but a reader may not expect, so the row asks first;
 * a part that would block the join is named instead of asking at all.
 */
function textContentFields(
  host: EditorHost,
  el: TextLayer,
  family: FamilyKind,
  upd: (mutate: (p: TextElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const t = el.payload;
  const layerId = t.id;
  const type = textType(t);
  const hasParts = (t.parts?.length ?? 0) > 0;
  // A chart's number says which chart it belongs to, one click from it.
  const owner = chartOfValue(host.config, t.value);
  const stored = richTextNotes.get(layerId);
  const note = stored && stored.rich === hasParts ? stored : undefined;
  const confirmTo = type === "rich" && (t.parts?.length ?? 0) >= 2 ? pendingRichTextOff.get(layerId) : undefined;

  const leaveRich = (to: "plain" | "countdown", node: EventTarget | null) => {
    const template = !(t.parts ?? []).every((p) => p.value.kind.kind === "literal");
    // Tried on a copy first: every update is an undo step, and a join that a
    // part blocks must not leave one behind that did nothing.
    const result = turnOffRichText(structuredClone(t), host.config.values);
    pendingRichTextOff.delete(layerId);
    if (!result.ok) {
      richTextNotes.set(layerId, { text: richTextBlockedHint(result.blocked), rich: true, warn: true });
      requestRerender(node);
      return;
    }
    richTextNotes.set(layerId, { text: richTextOffNote(result.joined ? { joined: true, template } : result), rich: false });
    upd((p) => {
      turnOffRichText(p, host.config.values);
      if (to === "countdown") p.countdown = true;
    });
  };

  const setType = (to: TextType, node: EventTarget | null) => {
    pendingRichTextOff.delete(layerId);
    if (type === "rich") {
      const leaveTo = to === "countdown" ? "countdown" : "plain";
      const parts = t.parts ?? [];
      if (parts.length < 2) {
        leaveRich(leaveTo, node);
        return;
      }
      const join = joinTextParts(parts, host.config.values);
      if (join.ok) {
        richTextNotes.delete(layerId);
        pendingRichTextOff.set(layerId, leaveTo);
      } else {
        richTextNotes.set(layerId, { text: richTextBlockedHint(join.blocked), rich: true, warn: true });
      }
      requestRerender(node);
      return;
    }
    if (to === "rich") {
      // A countdown can still hold parts from before it counted down. They
      // come back as they were rather than being rebuilt from the value.
      const partId = t.parts?.[0]?.id ?? newId();
      selectedParts.set(layerId, partId);
      // No note on the way in: a line pushed in under the Type row would move
      // the parts away from where the eye is, and the Add buttons say it.
      richTextNotes.delete(layerId);
      upd((p) => {
        delete p.countdown;
        turnOnRichText(p, partId);
      });
      return;
    }
    richTextNotes.delete(layerId);
    upd((p) => {
      if (to === "countdown") {
        p.countdown = true;
        return;
      }
      // Parts left under a countdown were never drawn, and would make the
      // layer Rich the moment it stopped counting, so they go with it.
      if ((p.parts?.length ?? 0) > 0) turnOffRichText(p, host.config.values);
      delete p.countdown;
    });
  };

  const confirmTitle = confirmTo === "countdown" ? "Switch to Countdown?" : "Switch to Plain?";
  return html`
    ${segField("Type", type === "rich" ? "rich" : "plain", TEXT_TYPES, setType, { titles: TEXT_TYPE_TITLES })}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own color, weight and size.</div>
    ${confirmTo === undefined ? nothing : html`<div class="rich-confirm" role="alertdialog" aria-label=${confirmTitle}>
        <b>${confirmTitle}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${t.rules.some((r) => r.partId !== undefined) ? " States that change one part will change the whole text." : ""}</div>
        <div class="acts">
          <button class="small primary" @click=${(e: Event) => leaveRich(confirmTo, e.currentTarget)}>Switch</button>
          <button class="small" @click=${(e: Event) => { pendingRichTextOff.delete(layerId); requestRerender(e.currentTarget); }}>Keep Rich</button>
        </div>
      </div>`}
    ${note ? html`<div class=${note.warn ? "hint warn" : "rich-note"}>${note.text}</div>` : nothing}
    ${type === "rich"
      // A rich text layer's value is only what older watches show for its
      // parts, rewritten from them on every edit, so an Entity field would
      // write into something that does not last. Each part picks its own. The
      // Entity row sits under Type, not over it, so the Type row stays put when
      // the type changes.
      ? richPartsEditor(host, el, family, upd, key)
      // No separate Entity row: the Entity button is where a text layer picks
      // one, and it points the layer's tap there too, as that row did.
      : html`
        ${sourceEditor(host, t.value, (v) => upd((p) => { p.value = v; }, "value"), {
          key: `${key}-value`,
          label: type === "countdown" ? "Until" : "Shows",
          onEntity: (ref) => host.update((c) => setLayerEntity(c, layerId, ref, deviceClassOf(host, ref.entityId)), `${key}-entity`),
          defaultEntity: layerEntityUses(host.config, layerId).find((u) => u.where === "tap")?.ref,
        })}
        ${countdownFields(host, type === "countdown", t.value, (on) => setType(on ? "countdown" : "plain", null))}
        ${owner ? html`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${() => host.selectLayer(owner.payload.id)}>${layerTitle(owner, describeContext(host))}</button>. It stays in the chart's group and moves with it.</div>` : nothing}`}`;
}

/**
 * The parts of a rich text layer as a row of chips with the two add buttons at
 * its end, then the editor for the part picked: what it shows, its color,
 * weight and size. A weight or size the part does not set shows the layer's,
 * outlined or faint, so what the part inherits is on screen without a sentence.
 */
function richPartsEditor(
  host: EditorHost,
  el: TextLayer,
  family: FamilyKind,
  upd: (mutate: (p: TextElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const t = el.payload;
  const parts = t.parts ?? [];
  const layerId = t.id;
  const ctx = describeContext(host);
  const index = Math.max(0, parts.findIndex((p) => p.id === selectedParts.get(layerId)));
  const part = parts[index]!;
  const count = parts.length;
  const layerHex = t.colorSlot.baseColorHex;
  const layerSize = effectivePlacement(host.config, family, el).size ?? t.fontSize;

  // Every parts edit brings the layer's value back in line with the parts, so
  // the draft says what the encoder will write, and ends the switch's note.
  const updParts = (mutate: (p: TextElement) => void, k?: string) => {
    richTextNotes.delete(layerId);
    upd((p) => { mutate(p); syncRichTextFallback(p); }, k);
  };
  const updPart = (mutate: (x: TextPart) => void, k?: string) => updParts((p) => {
    const x = p.parts?.find((y) => y.id === part.id);
    if (x) mutate(x);
  }, k ? `part-${part.id}-${k}` : undefined);
  const select = (id: string, node: EventTarget | null) => {
    selectedParts.set(layerId, id);
    richTextNotes.delete(layerId);
    requestRerender(node);
  };
  const add = (value: Value, node: EventTarget | null) => {
    const id = newId();
    selectedParts.set(layerId, id);
    updParts((p) => { (p.parts ??= []).push({ id, value }); });
    focusSourceSoon(node, `${key}-part-${id}`, "input[type=text], .ent-box input");
  };
  // Moving keeps the part's id, so a state aimed at it stays aimed at it.
  const move = (to: number) => updParts((p) => { if (p.parts) moveItem(p.parts, index, to); });
  const remove = () => {
    const next = parts[index + 1] ?? parts[index - 1];
    if (next) selectedParts.set(layerId, next.id);
    updParts((p) => { p.parts = (p.parts ?? []).filter((x) => x.id !== part.id); });
  };

  const chips = parts.map((p, i) => {
    const chip = partChip(p.value, ctx);
    const on = p.id === part.id;
    const mode = partColorMode(p);
    const now = chip.kind === "value" ? host.resolve(p.value) : undefined;
    const weight = p.fontWeight === undefined ? undefined : FONT_WEIGHTS.find(([w]) => w === p.fontWeight)?.[1];
    return html`<button type="button" role="option" aria-selected=${on ? "true" : "false"} class="part-chip ${chip.kind} ${on ? "on" : ""}"
      aria-label=${rulePartLabel(p, i, ctx)} @click=${(e: Event) => select(p.id, e.currentTarget)}>
      <span class="part-dot" style=${`background:${partDotBackground(p, layerHex)}`}
        title=${mode === "bands" ? "By value, with its own bands" : mode === "pick" ? "Its own color" : "The layer color"}></span>
      ${chip.kind === "text"
        ? html`<span class="part-txt">${chip.label === ""
          ? html`<span class="part-empty">empty</span>`
          : chipRuns(chip.label).map((r) => (r.space ? html`<span class="part-sp">${"·".repeat(r.text.length)}</span>` : r.text))}</span>`
        : html`<span class="part-txt">${chip.label}</span>`}
      ${now === undefined ? nothing : html`<span class="part-now">${now}</span>`}
      ${weight === undefined ? nothing : html`<span class="part-flag" title="Its own weight">${weight}</span>`}
      ${p.fontSize === undefined ? nothing : html`<span class="part-flag" title="Its own font size">${p.fontSize} pt</span>`}
    </button>`;
  });

  const targeted = t.rules.some((r) => r.partId === part.id);
  const literalPart = part.value.kind.kind === "literal";
  const mode = partColorMode(part);
  const ownSize = part.fontSize !== undefined;
  const layerWeight = FONT_WEIGHTS.find(([w]) => w === t.fontWeight)?.[1] ?? t.fontWeight;
  const layerDesign = FONT_DESIGNS.find(([d]) => d === (t.fontDesign ?? "default"))?.[1] ?? "System";
  const layerWidth = FONT_WIDTHS.find(([w]) => w === (t.fontWidth ?? "standard"))?.[1] ?? "Standard";
  // Out of range is left alone rather than clamped, so typing 12 can pass
  // through 1 without the box jumping to 4 under the caret.
  const setSize = (n: number) => {
    if (n >= PART_SIZE_MIN && n <= PART_SIZE_MAX) updPart((x) => { x.fontSize = n; }, "size");
  };
  // The band table marks the number the part reads, when it reads exactly one.
  const numbers = mode === "bands" ? chartNumbers(host.resolve(part.value) ?? "") : [];
  const colorTitles: Partial<Record<PartColorMode, string>> = {
    layer: "Use the layer color",
    ...(literalPart && mode !== "bands" ? { bands: "By value needs a live value" } : {}),
  };
  // The shared table editor wants a table that is always there; this one holds
  // the part's optional keys for the length of one edit.
  const setBands = (mutate: (b: BandedLayer) => void, k?: string) => updPart((x) => {
    const table: BandedLayer = { bands: x.bands ?? [], bandAboveColorHex: x.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX };
    mutate(table);
    if (table.bands.length > 0) x.bands = table.bands; else delete x.bands;
    if (table.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) x.bandAboveColorHex = table.bandAboveColorHex;
    else delete x.bandAboveColorHex;
  }, k);

  return html`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${chips}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${(e: Event) => add(literal(""), e.currentTarget)}>${uiIcon("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${(e: Event) => add({ kind: { kind: "entityState", entityId: "", displayName: "", domain: "" } }, e.currentTarget)}>${uiIcon("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${index + 1}</b> of ${count} · ${literalPart ? "Text" : "Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${index === 0} @click=${() => move(index - 1)}>${uiIcon("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${index === count - 1} @click=${() => move(index + 1)}>${uiIcon("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${count === 1 || targeted}
          title=${count === 1 ? "A rich text layer keeps at least one part" : targeted ? "A state changes this part" : "Remove this part"}
          @click=${remove}>${uiIcon("delete")}</button>
      </div>
      ${targeted && count > 1 ? html`<div class="hint keep">A state changes this part. Change or delete that state first.</div>` : nothing}
      ${sourceEditor(host, part.value, (v) => updPart((x) => { x.value = v; }, "value"), { key: `${key}-part-${part.id}` })}
      ${literalPart ? html`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>` : nothing}
      ${segField("Color", mode, PART_COLORS, (v) => updPart((x) => {
        if (v === "layer") { delete x.colorHex; delete x.coloring; return; }
        if (v === "pick") { delete x.coloring; x.colorHex = sameColor(layerHex, "#FFFFFF") ? "#64D2FF" : layerHex; return; }
        delete x.colorHex;
        x.coloring = "bands";
        // Seeded from the numbers the part shows right now, as the layer's own
        // table is, so By value paints something the moment it is picked.
        if ((x.bands?.length ?? 0) === 0) x.bands = seedBands(chartNumbers(host.resolve(x.value) ?? ""));
      }), { def: "layer", titles: colorTitles, ...(literalPart && mode !== "bands" ? { disabled: { bands: true } } : {}) })}
      ${mode === "pick" ? colorField("Part color", part.colorHex, (v) => updPart((x) => { x.colorHex = v ?? layerHex; }, "color")) : nothing}
      ${mode === "bands" ? html`
        ${bandTableFields({ bands: part.bands ?? [], bandAboveColorHex: part.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX }, part.colorHex ?? layerHex, setBands,
          numbers.length === 1 ? numbers[0] : undefined)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>` : nothing}
      <div class="field seg-field">${fieldLabel("Weight", part.fontWeight === undefined ? undefined
          : { atDefault: false, title: `Back to the layer weight (${layerWeight})`, reset: () => updPart((x) => { delete x.fontWeight; }) })}
        ${segButtons("Weight", part.fontWeight, FONT_WEIGHTS, (v) => updPart((x) => { x.fontWeight = v; }), { inherited: t.fontWeight })}
      </div>
      <div class="field seg-field">${fieldLabel("Typeface", part.fontDesign === undefined ? undefined
          : { atDefault: false, title: `Back to the layer typeface (${layerDesign})`, reset: () => updPart((x) => { delete x.fontDesign; }) })}
        ${segButtons("Typeface", part.fontDesign, FONT_DESIGNS, (v) => updPart((x) => { x.fontDesign = v; }), { inherited: t.fontDesign ?? "default" })}
      </div>
      ${part.fontDesign === "rounded" || part.fontDesign === "serif" ? FONT_DESIGN_HINT : nothing}
      <div class="field seg-field">${fieldLabel("Width", part.fontWidth === undefined ? undefined
          : { atDefault: false, title: `Back to the layer width (${layerWidth})`, reset: () => updPart((x) => { delete x.fontWidth; }) })}
        ${segButtons("Width", part.fontWidth, FONT_WIDTHS, (v) => updPart((x) => { x.fontWidth = v; }), { inherited: t.fontWidth ?? "standard" })}
      </div>
      ${part.fontWidth !== undefined && part.fontWidth !== "standard" ? FONT_WIDTH_HINT : nothing}
      <div class="field seg-field">${fieldLabel("Italic", part.italic === undefined ? undefined
          : { atDefault: false, title: `Back to the layer slant (${t.italic === true ? "italic" : "upright"})`, reset: () => updPart((x) => { delete x.italic; }) })}
        ${segButtons("Italic", part.italic === undefined ? undefined : part.italic ? "on" : "off", PART_ITALICS,
          (v) => updPart((x) => { x.italic = v === "on"; }), { inherited: t.italic === true ? "on" : "off" })}
      </div>
      <label class="field num part-size">${fieldLabel("Font size", ownSize
          ? { atDefault: false, title: `Back to the layer size (${layerSize} pt)`, reset: () => updPart((x) => { delete x.fontSize; }) }
          : undefined,
        scrubber(part.fontSize ?? layerSize, setSize, { step: 1, min: PART_SIZE_MIN, max: PART_SIZE_MAX }))}
        ${numberInput(part.fontSize, (n) => {
          if (n === undefined) updPart((x) => { delete x.fontSize; }, "size");
          else setSize(n);
        }, {
          step: 1, min: PART_SIZE_MIN, max: PART_SIZE_MAX, optional: true, unit: "pt", placeholder: String(layerSize),
          ariaLabel: ownSize ? "Part font size" : `Part font size, ${layerSize} pt from the layer`,
          ...(ownSize ? {} : { lead: uiIcon("link") }),
        })}
      </label>
    </div>
  </div>`;
}

export function layerEditor(host: EditorHost, el: CElement, family: FamilyKind, opts: { placement?: boolean; tap?: boolean } = {}): TemplateResult {
  const id = el.payload.id;
  const key = `el-${id}`;
  // Found rather than indexed: a row layer of a list is edited by these same
  // cards, and it is not in `elements`. Every edit that follows a row layer
  // also puts its list's attribute list back in step, because the attributes
  // the Jinja asks for are a fact about the row.
  const upd = (mutate: (e: CElement) => void, k?: string) => host.update((c) => {
    const target = elementIn(c, id);
    if (!target) return;
    mutate(target);
    const owner = listOwning(c, id);
    if (owner) syncListAttributes(owner.payload);
  }, k ? `${key}-${k}` : undefined);
  const eff = effectivePlacement(host.config, family, el);
  const f = eff.frame;
  const setFrame = (patch: Partial<NormalizedFrame>, k: string) => host.update((c) => setPlacement(c, family, id, { frame: typedFrame(f, patch) }), `${key}-${k}-${family}`);
  // What a fresh layer of this kind holds: the reset buttons go back to it,
  // and the changed dots compare against it.
  const base = newElement(el.kind).payload as unknown as Record<string, unknown>;
  const baseColor = (base.colorSlot as { baseColorHex: string } | undefined)?.baseColorHex ?? "#FFFFFF";
  const baseSize = (key: "fontSize" | "size" | "lineWidth") => base[key] as number;
  // The layer's own color. Where a Color choice picks between one color and
  // color by value, the color sits right under that choice; anywhere else it
  // closes the Look card.
  let colorPlaced = false;
  // Only the kinds with a colorSlot have a color of their own (`elementColor`).
  const setColor = (v: string | undefined) => upd((e) => {
    if (elementColor(e) !== undefined) (e.payload as { colorSlot: { baseColorHex: string } }).colorSlot.baseColorHex = v ?? "#FFFFFF";
  }, "color");
  const colorRow = (label: string) => elementColor(el) === undefined
    ? nothing
    : colorField(label, elementColor(el), setColor, false, baseColor);
  // The same color with its One color / By value choice on the row beside it.
  const colorModeRow = (label: string, mode: SegChoice<ChartColoring>) => elementColor(el) === undefined
    ? segField(mode.label, mode.value, mode.options, (v) => mode.set(v), mode.def === undefined ? {} : { def: mode.def })
    : colorModeField(label, elementColor(el), setColor, baseColor, mode);
  // The Look card's less used rows, per kind, for its More line. Opacity and
  // the shadow join them below for every drawing layer.
  let lookMore: MoreRow[] = [];
  // A chart's marks on the plot (highlight, threshold, now, clock times). Built in
  // the chart case, where its setters live, and shown in the Extras card.
  let chartMarks: TemplateResult | undefined;
  // Why a plot switch is greyed out, for the Extras preview.
  let chartBlocked: Partial<Record<ExtraKey, string>> = {};
  // The readings a chart draws, for the Extras previews.
  let chartShown: readonly number[] = [];

  // Content is what the layer shows; look is how it is drawn. Splitting them
  // per kind is the whole difference between a form and a page a person can
  // skim: the size of a font is never the answer to "what does this say".
  let content: TemplateResult;
  let look: TemplateResult | undefined;
  switch (el.kind) {
    case "text": {
      const setText = (mutate: (p: TextElement) => void, k?: string) => upd((e) => mutate((e as typeof el).payload), k);
      content = textContentFields(host, el, family, setText, key);
      colorPlaced = !el.payload.countdown && !textUsesParts(el.payload);
      look = html`
        ${sizeAlignField(host, el, family, "Font size", { step: 1, min: 4, def: baseSize("fontSize") },
          { label: "Align", value: el.payload.alignment ?? "center", options: TEXT_ALIGNMENTS, def: "center", set: (v) => upd((e) => {
            const p = (e as typeof el).payload;
            if (v === "center") delete p.alignment; else p.alignment = v;
          }) })}
        ${segField("Weight", el.payload.fontWeight, FONT_WEIGHTS, (v) => upd((e) => { (e as typeof el).payload.fontWeight = v; }),
          { def: base.fontWeight as typeof el.payload.fontWeight })}
        ${segField("Typeface", el.payload.fontDesign ?? "default", FONT_DESIGNS, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v === "default") delete p.fontDesign; else p.fontDesign = v;
        }), { def: "default" })}
        ${el.payload.fontDesign === "rounded" || el.payload.fontDesign === "serif" ? FONT_DESIGN_HINT : nothing}
        ${colorPlaced ? textValueColorFields(host, el.payload, setText, (mode) => colorModeRow("Color", mode)) : nothing}
        ${segField("Lines", String(el.payload.lineLimit ?? 1) as "1" | "2" | "3" | "4", TEXT_LINE_LIMITS, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v === "1") delete p.lineLimit; else p.lineLimit = Number(v);
        }), { def: "1" })}
        ${sliderField("Shrink to fit", el.payload.minimumScale ?? TEXT_MIN_SCALE, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          const n = clampMinimumScale(v);
          if (n === TEXT_MIN_SCALE) delete p.minimumScale; else p.minimumScale = n;
        }, "minscale"), { min: TEXT_MIN_SCALE, max: 1, step: 0.05, def: TEXT_MIN_SCALE, format: (v) => `${Math.round(v * 100)}%` })}
        <div class="hint">How small the text may go to fit its box before it is cut off with an ellipsis.
          100% never shrinks.</div>`;
      lookMore = [
        ["width", html`${segField("Width", el.payload.fontWidth ?? "standard", FONT_WIDTHS, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v === "standard") delete p.fontWidth; else p.fontWidth = v;
        }), { def: "standard" })}
        ${el.payload.fontWidth !== undefined && el.payload.fontWidth !== "standard" ? FONT_WIDTH_HINT : nothing}`],
        ["italic", checkField("Italic", el.payload.italic === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.italic = true; else delete p.italic;
        }), base.italic === true)],
        ["mono digits", html`${checkField("Mono digits", el.payload.monospacedDigits === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.monospacedDigits = true; else delete p.monospacedDigits;
        }), base.monospacedDigits === true)}
        ${el.payload.monospacedDigits ? html`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>` : nothing}`],
        ["curve", textArcFields(el.payload, family, setText)],
        ["highlight", colorPlaced ? textHighlightFields(el.payload, setText) : nothing],
      ];
      break;
    }
    case "icon": {
      const drawn = isCustomSvgIcon(el.payload) ? "svg" : "symbol";
      content = html`
        ${segField("Drawing", drawn, [["symbol", "Symbol"], ["svg", "Custom SVG"]],
          (v) => upd((e) => { setIconDrawing((e as typeof el).payload, v); }, "icon-drawing"),
          { titles: {
              symbol: "An SF Symbol or a Material Design icon, by name",
              svg: "An SVG path you paste yourself",
            }, def: "symbol" })}
        ${drawn === "svg"
          ? customSvgFields(el.payload, (m, k) => upd((e) => m((e as typeof el).payload), k))
          : html`
            ${valueEditor(host, el.payload.symbol, (v) => upd((e) => { (e as typeof el).payload.symbol = v; }, "symbol"), {
              noFormat: true, showResolved: true, symbol: true, label: "Symbol", key: `${key}-symbol`,
              setSymbolPath: (d) => upd((e) => {
                const p = (e as typeof el).payload;
                if (d) p.path = d; else delete p.path;
                delete p.viewBox;
              }, "symbol"),
            })}
            <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`}`;
      look = shapeSizeField(host, el, family, "Icon size", { step: 1, min: 4, def: baseSize("size") });
      break;
    }
    case "gauge": {
      const g = el.payload;
      const setGauge = (m: (p: GaugeElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      const dots = g.style === "dots";
      content = html`
        ${valueEditor(host, g.value, (v) => setGauge((p) => { p.value = v; }, "value"), { showResolved: true, label: "Reading", key: `${key}-value` })}
        ${dots
          ? html`
            ${valueEditor(host, g.total ?? seedGaugeTotal(g), (v) => setGauge((p) => { p.total = v; }, "total"),
              { showResolved: true, label: "Total", key: `${key}-total` })}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${GAUGE_MAX_DOTS} dots are drawn.</div>`
          : html`<div class="fgroup">${gaugeRangeFields(host, g, { min: base.minValue as number, max: base.maxValue as number }, key, setGauge)}</div>`}`;
      colorPlaced = true;
      look = html`
        <div class="grid2">
          ${segField("Style", g.style, GAUGE_STYLES, (v) => setGauge((p) => {
            // A dot gauge needs a count, and the useful one is nearly always the
            // reading's own scope without its filter. Seeded on the way in and
            // dropped on the way out, so a ring never carries a key nothing reads.
            if (v === "dots" && p.total === undefined) p.total = seedGaugeTotal(p);
            if (v !== "dots") delete p.total;
            // A needle is a pointer, not a band: at the ring's width it reads as
            // a bar. Switching to it thins the line to a needle's, and switching
            // away restores the ring width, unless the author set their own.
            if (v === "needle" && p.style !== "needle" && p.lineWidth === (base.lineWidth as number)) p.lineWidth = NEEDLE_LINE_WIDTH;
            if (v !== "needle" && p.style === "needle" && p.lineWidth === NEEDLE_LINE_WIDTH) p.lineWidth = base.lineWidth as number;
            p.style = v;
          }), { titles: GAUGE_STYLE_TITLES, def: base.style as typeof g.style })}
          ${dots ? nothing : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: baseSize("lineWidth") })}
        </div>
        ${colorField(dots ? "Empty dot color" : "Track color", g.trackColorHex, (v) => setGauge((p) => { p.trackColorHex = v ?? "#FFFFFF40"; }, "track"), false, base.trackColorHex as string)}
        ${colorModeRow("Main color", { label: "Color", value: g.coloring, options: CHART_COLORINGS, def: base.coloring as typeof g.coloring, set: (v) => setGauge((p) => {
          p.coloring = v;
          if (v === "bands" && p.bands.length === 0) p.bands = seedBands([p.minValue, p.maxValue]);
        }) })}
        ${g.coloring === "bands" ? html`
          <div class="fgroup">
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the color of the row its reading falls in, and a reading past the
            last row takes the color underneath.</div>
          ${bandTableFields(g, g.colorSlot.baseColorHex, setGauge, chartNumbers(host.resolve(g.value) ?? "")[0])}
          </div>`
          : nothing}`;
      lookMore = [
        ["gradient", g.coloring === "bands" ? nothing : fillField("Gradient", g.fill, (v) => setGauge((p) => {
          if (v === undefined) { delete p.fill; return; }
          p.fill = v;
          // The flat color keeps the gradient's first stop, so a watch app that
          // predates fills draws where the gradient starts rather than nothing.
          p.colorSlot.baseColorHex = fillColorAt(v, 0);
        }, "fill"), () => ({ kind: "linear", stops: [{ at: 0, colorHex: g.colorSlot.baseColorHex }, { at: 1, colorHex: g.colorSlot.baseColorHex }] }))],
        ["marks, end numbers", gaugeDialFields(g, setGauge)],
        ["threshold", dots ? nothing : html`
          <div class="fgroup">
          <div class="grid2">
            ${numberField("Threshold", g.thresholdValue, (v) => setGauge((p) => {
              if (v === undefined) delete p.thresholdValue; else p.thresholdValue = v;
            }, "thr"), { optional: true, def: null })}
            ${g.thresholdValue === undefined ? nothing
              : colorField("Threshold color", g.thresholdColorHex, (v) => setGauge((p) => { p.thresholdColorHex = v ?? GAUGE_DEFAULT_THRESHOLD_HEX; }, "thrcol"), false, GAUGE_DEFAULT_THRESHOLD_HEX)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`],
      ];
      break;
    }
    case "chart": {
      const c = el.payload;
      const setChart = (m: (p: ChartElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);

      // Three ways a chart gets its numbers, and the difference is the single
      // thing people trip on. A forecast sensor already holds a list, so its
      // own value is the series. Every ordinary sensor holds one number, so its
      // chart comes from the recorder instead: either the state history, which
      // is purged after ten days, or the long-term statistics, which are not.
      const baseMinutes = base.historyMinutes as number;
      const basePoints = base.historyPoints as number;
      const usingRecorder = c.historyMinutes > 0;
      const usingStatistics = usingRecorder && c.source === "statistics";
      const usingHistory = usingRecorder && !usingStatistics;
      const drawMode = usingRecorder ? (usingStatistics ? "statistics" : "history") : "value";
      const spans = usingStatistics ? CHART_STATISTICS_SPANS : CHART_HISTORY_SPANS;
      const seriesKey = chartHistoryKey(c) ?? chartStatisticsKey(c);
      const namesEntity = c.value.kind.kind === "entityState";
      const historyRaw = seriesKey === undefined ? undefined : host.historySeries(seriesKey);
      // Set to a recorder source but naming no entity yet, the chart draws its
      // own value, which is what the watch does too (both gates need an entity).
      const raw = usingRecorder && namesEntity ? (historyRaw ?? "") : (host.resolve(c.value) ?? "");
      const everyReading = c.historyPoints < 1;
      const readingsInfo = usingHistory && namesEntity && seriesKey !== undefined
        ? host.historyReadings?.(seriesKey)
        : undefined;
      const averagedHint = everyReadingAveragedHint(everyReading, readingsInfo, historySpanLabel(c.historyMinutes));
      const customSpan = spanIsCustom(id, c.historyMinutes, spans);
      // A fetched series keeps its holes, exactly as the resolver reads it.
      const parsed = usingRecorder && namesEntity
        ? chartSeriesWithHoles(raw)
        : { values: chartNumbers(raw), holes: [] as boolean[] };
      const series = parsed.values;
      const trimTo = <T,>(a: T[]) => (c.limit > 0 && a.length > c.limit
        ? (c.takeFromEnd ? a.slice(a.length - c.limit) : a.slice(0, c.limit))
        : a);
      const trimmed = trimTo(series);
      // What the chart actually reads: the readout and seeded bands follow the
      // averaged series, the same one the resolver hands the plot and its stats.
      const shown = chartSmoothed(trimmed, chartSmoothing(c.smoothing),
        parsed.holes.length > 0 ? trimTo(parsed.holes) : []);

      // The nudge that answers "why is my chart one bar?" before it is asked:
      // a lone number from a plain sensor is exactly the shape that says the
      // author wanted history and did not know to ask for it.
      const suggestHistory = !usingRecorder && namesEntity && series.length === 1;

      // Two series on one plot is two chart layers on one frame, the second
      // borrowing the first's range. So the picker lists the other charts in
      // the document, and the button below makes one.
      const otherCharts = host.config.elements.filter(
        (e): e is Extract<CElement, { kind: "chart" }> => e.kind === "chart" && e.payload.id !== id);
      const chartCtx = describeContext(host);
      const borrowed = c.scaleFrom !== undefined && otherCharts.some((e) => e.payload.id === c.scaleFrom);

      content = html`
        ${valueEditor(host, c.value, (v) => setChart((p) => { p.value = v; }, "value"),
          { label: "Readings", noShare: true, key: `${key}-value` })}
        <div class="fgroup">
        ${segField("Draw", drawMode,
          [["history", "Recorded history"], ["statistics", "Long-term statistics"], ["value", "The value itself"]],
          (v) => setChart((p) => {
            if (v === "value") { p.historyMinutes = 0; return; }
            p.source = v === "statistics" ? "statistics" : "history";
            const kept = p.historyMinutes || CHART_HISTORY_DEFAULT_MINUTES;
            // Coming back from a year of statistics, the span has to fit inside
            // what the state history can answer, or the request comes back short
            // with nothing to say why.
            p.historyMinutes = v === "statistics"
              ? Math.min(kept, CHART_STATISTICS_MAX_MINUTES)
              : Math.min(kept, CHART_HISTORY_MAX_MINUTES);
          }),
          { titles: {
              history: "Read the entity's recorded states from the recorder and plot them",
              statistics: "Plot the recorder's pre-aggregated rows, which reach back a year",
              value: "Plot the numbers the value holds right now, such as a forecast list",
            },
            def: (base.historyMinutes as number) > 0 ? "history" : "value" })}
        ${usingStatistics
          ? html`
            ${namesEntity ? nothing : html`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${historySpanPicker(id, c.historyMinutes, baseMinutes,
                (m) => setChart((p) => { p.historyMinutes = m; }), CHART_STATISTICS_SPANS)}
              ${segField("Per", c.statPeriod, STAT_PERIODS,
                (v) => setChart((p) => { p.statPeriod = v; }),
                { def: CHART_DEFAULT_STAT_PERIOD })}
            </div>
            ${customSpan
              ? historySpanCustomFields(c.historyMinutes, (m) => setChart((p) => { p.historyMinutes = m; }, "span"), true)
              : nothing}
            ${segField("Read", c.statType, STAT_TYPES,
              (v) => setChart((p) => { p.statType = v; }),
              { def: CHART_DEFAULT_STAT_TYPE })}
            <div class="hint">One bar per period, oldest first, newest ${CHART_HISTORY_MAX_POINTS} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${c.statPeriod === "5minute"
              ? html`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`
              : nothing}
            ${namesEntity && historyRaw === undefined
              ? html`<div class="hint keep">Reading the statistics…</div>`
              : nothing}
            ${namesEntity && historyRaw === ""
              ? html`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`
              : nothing}`
          : nothing}
        ${usingHistory
          ? html`
            ${namesEntity ? nothing : html`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${historySpanPicker(id, c.historyMinutes, baseMinutes, (m) => setChart((p) => { p.historyMinutes = m; }))}
              <div class="field readings-field">${fieldLabel("Points", {
                atDefault: c.historyPoints === basePoints,
                title: `Back to ${basePoints < 1 ? "every one" : `${basePoints} averaged`}`,
                reset: () => setChart((p) => { p.historyPoints = basePoints; }),
              })}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${everyReading ? "false" : "true"} class=${everyReading ? "" : "on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${() => { if (everyReading) setChart((p) => { p.historyPoints = 24; }); }}>Average</button>
                    <button type="button" role="radio" aria-checked=${everyReading ? "true" : "false"} class=${everyReading ? "on" : ""}
                      title="Plot every recorded state change, no averaging"
                      @click=${() => { if (!everyReading) setChart((p) => { p.historyPoints = CHART_HISTORY_EVERY_READING; }); }}>Every one</button>
                  </div>
                  ${everyReading ? nothing : html`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(c.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${CHART_HISTORY_MIN_POINTS} max=${CHART_HISTORY_MAX_POINTS}
                      data-scrub @pointerdown=${boxScrubber(c.historyPoints, (n) => setChart((p) => { p.historyPoints = Math.round(n); }, "hpoints"),
                        { step: 1, min: CHART_HISTORY_MIN_POINTS, max: CHART_HISTORY_MAX_POINTS })}
                      @input=${onInput((v) => { const n = Number(v); if (v.trim() !== "" && Number.isFinite(n) && n >= 1) setChart((p) => { p.historyPoints = Math.round(n); }, "hpoints"); })} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${customSpan
              ? historySpanCustomFields(c.historyMinutes, (m) => setChart((p) => { p.historyMinutes = m; }, "span"))
              : nothing}
            <div class="hint">${everyReading
              ? html`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${CHART_HISTORY_MAX_POINTS} readings is averaged into
                  ${CHART_HISTORY_MAX_POINTS} even slots instead, so the chart still covers all of it.`
              : html`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${averagedHint === undefined ? nothing : html`<div class="hint keep">${averagedHint}</div>`}
            ${namesEntity && historyRaw === undefined
              ? html`<div class="hint keep">Reading the history…</div>`
              : nothing}
            ${namesEntity && historyRaw === ""
              ? html`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`
              : nothing}`
          : nothing}
        ${usingRecorder
          ? html`
            ${checkField("Show gaps", c.gaps === true,
              (v) => setChart((p) => { if (v) p.gaps = true; else delete p.gaps; }), base.gaps === true)}
            ${watchNote(host)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`
          : nothing}
        ${usingRecorder
          ? nothing
          : html`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${series.length === 0 && !(usingRecorder && (!namesEntity || historyRaw === undefined || historyRaw === ""))
          ? html`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`
          : nothing}
        ${series.length > 0
          ? html`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${chartReadout(shown)}</span>${series.length === shown.length
              ? html` · ${shown.length} ${shown.length === 1 ? "value" : "values"}`
              : html` · ${shown.length} of ${series.length}`}</span></div>`
          : nothing}
        ${suggestHistory
          ? html`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`
          : nothing}
        ${/* Span and slots already decide how much a recorded chart draws, and a
           * trim on top of them makes a times layer label the whole span while the
           * plot shows part of it. So Only draw is offered for the value itself, and
           * on a recorded chart only to take an old trim back to 0. */
          usingRecorder && c.limit <= 0 ? nothing : html`
        <div class="grid2">
          ${numberField("Only draw", c.limit, (v) => setChart((p) => { p.limit = Math.max(0, Math.round(v ?? 0)); }, "limit"), { step: 1, min: 0, def: base.limit as number, unit: "readings" })}
          ${c.limit <= 0 ? nothing : segField("Keep", c.takeFromEnd ? "end" : "start",
            usingRecorder ? [["start", "Oldest"], ["end", "Newest"]] : [["start", "First"], ["end", "Last"]],
            (v) => setChart((p) => { p.takeFromEnd = v === "end"; }),
            { def: base.takeFromEnd === true ? "end" : "start" })}
        </div>
        ${usingRecorder
          ? html`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${c.limit} of the readings fetched above, while clock times still label the whole span.</div>`
          : html`<div class="hint">${c.limit <= 0
            ? "0 draws every reading. Type a number to draw only that many."
            : `Draws only ${c.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${selectField("Smooth data", chartSmoothing(c.smoothing) ?? "off", CHART_SMOOTHING_OPTIONS,
          (v) => setChart((p) => {
            const s = chartSmoothing(v);
            if (s === undefined) delete p.smoothing; else p.smoothing = s;
          }),
          { def: chartSmoothing(base.smoothing) ?? "off" })}
        ${watchNote(host)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`;
      colorPlaced = true;
      // Whether zero falls strictly inside the plot, which is the only place the
      // line at zero draws. Worked out from the readings on screen the way the
      // resolver sets the range; a chart on another's scale is not second-guessed.
      const zeroCrossed = (() => {
        if (borrowed) return true;
        if (c.scale === "fixed") return c.minValue < 0 && c.maxValue > 0;
        const real = shown.filter((n) => Number.isFinite(n));
        if (real.length === 0) return true;
        const lo = Math.min(...real, c.thresholdValue ?? Infinity);
        const hi = Math.max(...real, c.thresholdValue ?? -Infinity);
        return lo < 0 && hi > 0;
      })();
      // Only the colors that paint something on this chart get a row, named
      // for what they paint (see chart-colors.ts).
      const colorRows = chartColorRows(c);
      chartShown = shown;
      const chartColoring: SegChoice<ChartColoring> = { label: "Color", value: c.coloring, options: CHART_COLORINGS,
        def: base.coloring as typeof c.coloring, set: (v) => setChart((p) => {
          p.coloring = v;
          if (v === "bands" && p.bands.length === 0) p.bands = seedBands(shown);
        }) };
      // A chart whose own color paints nothing (see chart-colors.ts) keeps the
      // choice alone, with no swatch beside it.
      const chartColorRow = colorRows.main === undefined
        ? segField(chartColoring.label, chartColoring.value, chartColoring.options, (v) => chartColoring.set(v), { def: base.coloring as typeof c.coloring })
        : colorModeRow(colorRows.main, chartColoring);
      look = html`
        <div class="grid2">
          ${segField("Style", c.style, CHART_STYLES, (v) => setChart((p) => { p.style = v; }), { def: base.style as typeof c.style })}
          ${c.style === "bars"
            ? numberField("Bar gap", c.barGap, (v) => setChart((p) => { p.barGap = Math.max(0, v ?? 0); }, "gap"), { step: 0.5, min: 0, def: base.barGap as number, unit: "pt" })
            : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: baseSize("lineWidth") })}
        </div>
        ${c.style === "bars" ? html`
          ${colorRows.fill === undefined ? nothing : chartColorField(colorRows.fill, c.fillColorHex,
            (v) => setChart((p) => { if (v === undefined) delete p.fillColorHex; else p.fillColorHex = v; }, "fillcol"))}` : html`
          <div class="fgroup">
          ${segField("Curve", c.curve ?? "straight", CHART_CURVE_OPTIONS,
            (v) => setChart((p) => { if (v === "straight") delete p.curve; else p.curve = v; }),
            { titles: {
                straight: "A straight line from each reading to the next",
                smooth: "A smooth line that never rises past the highest reading or dips under the lowest",
                step: "Each reading holds flat until the next one, the way a state does",
              },
              def: (base.curve as ChartCurve | undefined) ?? "straight" })}
          ${watchNote(host)}
          </div>
          ${c.style === "area" ? html`
            <div class="fgroup">
            ${segField("Fill", chartFillStyle(c.fillStyle), CHART_FILL_STYLE_OPTIONS,
              (v) => setChart((p) => { if (v === "flat") delete p.fillStyle; else p.fillStyle = v; }),
              { titles: {
                  flat: "One even wash under the line",
                  fade: "Strongest at the top of the plot, fading to clear at the baseline",
                },
                def: chartFillStyle(base.fillStyle) })}
            ${colorRows.fill === undefined ? nothing : chartColorField(colorRows.fill, c.fillColorHex,
              (v) => setChart((p) => { if (v === undefined) delete p.fillColorHex; else p.fillColorHex = v; }, "fillcol"))}
            ${watchNote(host)}
            </div>`
            : nothing}`}
        ${segField("Scale", c.scale, CHART_SCALES, (v) => setChart((p) => { p.scale = v; }),
          { titles: { auto: "The plot stretches to fit the readings it has", fixed: "The plot always runs from Min to Max" }, def: base.scale as typeof c.scale })}
        ${borrowed
          ? html`<div class="hint keep">Scale, Min and Max are ignored while Same scale as picks another chart.</div>`
          : nothing}
        ${!borrowed && c.scale === "fixed"
          ? html`<div class="grid2">
              ${numberField("Min", c.minValue, (v) => setChart((p) => { p.minValue = v ?? 0; }, "cmin"), { def: base.minValue as number })}
              ${numberField("Max", c.maxValue, (v) => setChart((p) => { p.maxValue = v ?? 100; }, "cmax"), { def: base.maxValue as number })}
            </div>`
          : nothing}
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${() => {
                let made: string | undefined;
                host.update((cfg) => { made = addChartSeries(cfg, id, (el) => layerTitle(el, chartCtx)); });
                if (made) host.selectLayer(made);
              }}>${uiIcon("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        ${c.coloring !== "bands" ? chartColorRow : html`
          <div class="fgroup">
          ${chartColorRow}
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the color underneath.
            ${c.style === "bars"
              ? "Each bar is colored on its own value."
              : "A stroke cannot change color halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${bandTableFields(c, c.colorSlot.baseColorHex, setChart, shown, c.style === "bars"
            ? { ...(c.fillColorHex === undefined ? {} : { fillHex: c.fillColorHex }),
                ...(c.barBorderColorHex === undefined ? {} : { borderHex: c.barBorderColorHex }),
                border: c.barBorderWidth !== undefined }
            : undefined)}
          ${c.style === "area"
            ? html`${checkField("Band fill",c.fillBands,
                (v) => setChart((p) => { p.fillBands = v; }), base.fillBands as boolean)}
              <div class="hint">Off, the wash under the line stays one color. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`
            : nothing}
          </div>`}`;
      lookMore = [
        ["corner radius, round top only", c.style !== "bars" ? nothing : html`
          <div class="fgroup">
          <div class="grid2">
            ${numberField("Corner radius", chartBarRadius(c.barRadius),
              (v) => setChart((p) => {
                const r = Math.max(0, v ?? CHART_DEFAULT_BAR_RADIUS);
                if (r === CHART_DEFAULT_BAR_RADIUS) delete p.barRadius; else p.barRadius = r;
              }, "barradius"),
              { step: 0.5, min: 0, def: chartBarRadius(base.barRadius), unit: "pt" })}
          </div>
          ${checkField("Round top only", chartBarCorners(c.barCorners) === "top",
            (v) => setChart((p) => { if (v) p.barCorners = "top"; else delete p.barCorners; }),
            chartBarCorners(base.barCorners) === "top")}
          ${watchNote(host)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>`],
        ["border", c.style !== "bars" ? nothing : html`
          <div class="fgroup">
          ${checkField("Border", c.barBorderWidth !== undefined,
            (v) => setChart((p) => { if (v) p.barBorderWidth = 1; else delete p.barBorderWidth; }), false)}
          ${c.barBorderWidth === undefined ? nothing : html`
            ${numberField("Border width", c.barBorderWidth,
              (v) => setChart((p) => { p.barBorderWidth = Math.min(Math.max(v ?? 1, 0), CHART_MAX_BAR_BORDER_WIDTH); }, "barborderw"),
              { step: 0.5, min: 0, max: CHART_MAX_BAR_BORDER_WIDTH, def: 1, unit: "pt" })}
            ${colorRows.border === undefined ? nothing : chartColorField(colorRows.border, c.barBorderColorHex,
              (v) => setChart((p) => { if (v === undefined) delete p.barBorderColorHex; else p.barBorderColorHex = v; }, "barbordercol"))}
            ${checkField("Open at base", c.barBorderOpenBase === true,
              (v) => setChart((p) => { if (v) p.barBorderOpenBase = true; else delete p.barBorderOpenBase; }), false)}`}
          ${watchNote(host)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight color.${c.barBorderOpenBase === true
              ? " Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open." : " Open at base leaves the border off the edge on the baseline."}${c.coloring === "bands"
              ? " Each band can set its own fill and border in the color table." : ""}</div>
          </div>`],
        ["baseline", html`
          ${segField("Baseline", c.baseline, CHART_BASELINES, (v) => setChart((p) => { p.baseline = v; }), { def: base.baseline as typeof c.baseline })}
          <div class="hint">${c.baseline === "zero"
            ? "Bars grow from where zero falls, so a negative reading hangs below the line."
            : "Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>`],
        ["same scale as", otherCharts.length === 0 ? nothing : html`
          ${selectField("Same scale as", borrowed ? c.scaleFrom! : "",
            [["", "Its own"] as [string, string], ...otherCharts.map((e): [string, string] => [e.payload.id, layerTitle(e, chartCtx)])],
            (v) => setChart((p) => { if (v) p.scaleFrom = v; else delete p.scaleFrom; }), { def: "" })}
          ${borrowed
            ? html`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
                plot. Give them the same frame and each keeps its own readings, color, style and
                numbers. Scale, Min and Max are ignored while a chart is picked here.</div>`
            : nothing}`],
      ];
      // Every plot extra is a switch. On adds the layer the old button added;
      // off deletes it again, the same as its × in the list at the bottom. A line
      // counts only when it runs through the plot, so an icon marker at now or
      // at the threshold neither lights nor loses the line's switch.
      const through = (cfg: CustomComplicationConfig, at: ChartAnchorPoint) =>
        chartMarkersOf(cfg, id).filter((m) => m.payload.chartAnchor?.at === at && m.payload.chartAnchor.place === "through");
      const followed = (cfg: CustomComplicationConfig, at: ChartAnchorPoint) =>
        chartMarkersOf(cfg, id).some((m) => m.payload.chartAnchor?.at === at);
      const plotLayers: Record<ChartDrawExtra, (cfg: CustomComplicationConfig) => CElement[]> = {
        threshold: (cfg) => through(cfg, "threshold"),
        now: (cfg) => through(cfg, "now"),
        zero: (cfg) => through(cfg, "zero"),
        times: (cfg) => chartTimesOf(cfg, id),
        dots: (cfg) => chartDotsOf(cfg, id),
        grid: (cfg) => chartGridsOf(cfg, id),
      };
      const addPlotLayer: Record<ChartDrawExtra, (cfg: CustomComplicationConfig) => void> = {
        // With nothing following the threshold or now yet, the setter seeds the
        // number and adds the line. With a marker already there, the number is
        // set and only the line is missing.
        threshold: (cfg) => {
          if (followed(cfg, "threshold")) addChartLine(cfg, id, "threshold");
          else setChartThreshold(cfg, id, c.thresholdValue ?? seedThreshold(shown));
        },
        now: (cfg) => { if (followed(cfg, "now")) addChartLine(cfg, id, "now"); else setChartNow(cfg, id, true); },
        zero: (cfg) => { addChartZeroLine(cfg, id); },
        times: (cfg) => { convertChartTimes(cfg, id); },
        dots: (cfg) => { addChartDots(cfg, id); },
        grid: (cfg) => { addChartGrid(cfg, id); },
      };
      const why: Partial<Record<ChartDrawExtra, string>> = {};
      if (!chartShowsTimeLabels(c)) {
        why.times = everyReading && usingHistory
          ? "Clock times need evenly spaced readings. Set Points to Average."
          : "Clock times need a recorded span. Set Draw to Recorded history.";
      }
      if (c.style === "bars") why.dots = "Dots need a line or area chart. Set Style to Line or Area.";
      const plotOn = (d: ChartDrawExtra) => plotLayers[d](host.config).length > 0;
      chartBlocked = {};
      for (const [d, reason] of Object.entries(why) as [ChartDrawExtra, string][]) chartBlocked[`draw:${d}`] = reason;
      const plotSwitch = ([d, label]: readonly [ChartDrawExtra, string]) => {
        const on = plotOn(d);
        // A layer already on the chart can always come off, even where a new one
        // would draw nothing.
        const blocked = on ? undefined : why[d];
        const key: ExtraKey = `draw:${d}`;
        // Same row and switch as the Readings list below, so the two read as one
        // kind of control: the switch sits in the Number column.
        // The row carries the switch's key too, so pointing anywhere on the row
        // previews it, not only the switch.
        return html`<div class="xr-row" role="row" data-extra=${key}>
          <span role="cell"><span class="xr-name">${label}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${on ? "on" : ""}" role="switch" aria-checked=${on ? "true" : "false"}
            aria-label=${label} ?disabled=${blocked !== undefined} data-extra=${key}
            title=${extraTitle(key, blocked ?? (on ? `Remove the ${label.toLowerCase()} from this chart` : `Add ${label.toLowerCase()} to this chart`))}
            @click=${() => host.update((cfg) => {
              if (on) for (const layer of plotLayers[d](cfg)) removeElement(cfg, layer.payload.id);
              else addPlotLayer[d](cfg);
            })}>${on ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}</button></span>
          <span role="cell"></span>
        </div>`;
      };
      chartMarks = html`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${pointExtra} @focusin=${pointExtra}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${CHART_DRAW_EXTRAS.map(plotSwitch)}
          </div>
        </div>
        ${CHART_DRAW_EXTRAS.filter(([d]) => why[d] !== undefined && !plotOn(d)).map(([d]) => html`<div class="hint keep">${why[d]}</div>`)}
        ${plotOn("zero") && !zeroCrossed
          ? html`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`
          : nothing}
        ${watchNote(host)}`;
      break;
    }
    case "timeline": {
      const t = el.payload;
      const setTimeline = (m: (p: TimelineElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      const baseSpan = base.historyMinutes as number;
      const namesEntity = t.value.kind.kind === "entityState";
      const historyKey = timelineHistoryKey(t);
      const raw = historyKey === undefined ? undefined : host.historySeries(historyKey);
      const spanSeconds = timelineHistoryMinutes(t) * 60;
      const samples = timelineSamples(raw ?? "", TIMELINE_HISTORY_POINTS);
      const customSpan = spanIsCustom(id, t.historyMinutes);
      const entityId = t.value.kind.kind === "entityState" ? t.value.kind.entityId : undefined;
      const grouped = t.aggregate !== undefined;
      const knownStates = grouped
        ? TIMELINE_DOMAIN_STATES[TIMELINE_AGGREGATE_SEED_DOMAIN] ?? []
        : timelineKnownStates(samples, spanSeconds,
          entityId === undefined ? undefined : host.hass.states[entityId]?.state,
          entityId?.split(".")[0]);
      content = html`
        ${timelineGroupSwitch(t, setTimeline, key)}
        ${grouped
          ? timelineGroupFields(host, t, setTimeline, key)
          : html`
            ${valueEditor(host, t.value, (v) => setTimeline((p) => { p.value = v; }, "value"),
              { label: "States", noShare: true, key: `${key}-value` })}
            ${namesEntity ? nothing : html`<div class="hint warn">A timeline draws an entity's recorded
              past, so it needs one named above. A typed-in value, a template or a shared value has no
              past to read, and this layer stays blank until States names an entity.</div>`}`}
        <div class="fgroup">
        ${historySpanPicker(id, t.historyMinutes, baseSpan, (m) => setTimeline((p) => { p.historyMinutes = m; }))}
        ${customSpan
          ? historySpanCustomFields(t.historyMinutes, (m) => setTimeline((p) => { p.historyMinutes = m; }, "span"))
          : nothing}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${TIMELINE_HISTORY_POINTS} changes are drawn, and a
          busier span keeps its newest.</div>
        ${namesEntity && raw === undefined
          ? html`<div class="hint keep">Reading the history…</div>`
          : nothing}
        ${namesEntity && raw === ""
          ? html`<div class="hint warn">Nothing recorded for ${grouped ? "these entities" : "this entity"}
            in that span. Either ${grouped ? "they are" : "it is"} excluded from the recorder, or
            ${grouped ? "none of them have" : "it has not"} been seen in that long.</div>`
          : nothing}
        </div>
        ${samples.length > 0
          ? html`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${timelineReadout(samples, spanSeconds)}</span></span></div>`
          : nothing}
        ${timelineIsNumeric(samples)
          ? html`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one color with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`
          : nothing}`;
      look = html`
        <div class="hint">Each row is a state and the color its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the color underneath.</div>
        ${timelineBandFields(t, setTimeline, knownStates, `wa-tl-states-${key.replace(/[^a-z0-9]/gi, "")}`)}
        ${knownStates.length > 2
          ? html`<div class="hint keep">Seen in this span: <span class="nums">${knownStates.filter((s) => s !== "unavailable" && s !== "unknown").join(", ")}</span>. Click into a State box to pick one.</div>`
          : nothing}`;
      lookMore = [
        ["gap, corner radius", html`
          <div class="grid2">
            ${numberField("Gap", t.gap, (v) => setTimeline((p) => {
              p.gap = Math.min(TIMELINE_MAX_GAP, Math.max(0, v ?? 0));
            }, "tgap"), { step: 0.5, min: 0, max: TIMELINE_MAX_GAP, def: base.gap as number, unit: "pt" })}
            ${numberField("Corner radius", t.cornerRadius, (v) => setTimeline((p) => {
              p.cornerRadius = Math.max(0, v ?? 0);
            }, "tradius"), { step: 0.5, min: 0, def: base.cornerRadius as number, unit: "pt" })}
          </div>
          <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
            the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
            door or a light usually wants.</div>`],
      ];
      break;
    }
    case "shape":
      content = html`<div class="grid2">
          ${segField("Shape", shapePickerKind(el.payload.kind), SHAPE_PICKER, (v) => upd((e) => { (e as typeof el).payload.kind = v; }),
            { titles: SHAPE_PICKER_TITLES, def: shapePickerKind(base.kind as ShapeKind) })}
          ${shapeCornerField(el, base, upd)}
        </div>
        ${el.payload.kind === "line" ? lineOrientationField(family, f, setFrame) : nothing}`;
      // A line has no border and no corners: its color is the whole drawing, so
      // the Look card offers its thickness instead.
      look = el.payload.kind === "line"
        ? numberField("Thickness", el.payload.thickness, (v) => upd((e) => { (e as typeof el).payload.thickness = v ?? 1; }, "thick"), { step: 0.5, min: 0.5, def: base.thickness as number, unit: "pt" })
        : html`
        ${colorField("Border color", el.payload.borderColorHex, (v) => upd((e) => { if (v === undefined) delete (e as typeof el).payload.borderColorHex; else (e as typeof el).payload.borderColorHex = v; }, "border"), true, null)}
        ${el.payload.borderColorHex !== undefined ? numberField("Border width", el.payload.borderWidth, (v) => upd((e) => { (e as typeof el).payload.borderWidth = v ?? 1; }, "bw"), { step: 0.5, min: 0, def: base.borderWidth as number, unit: "pt" }) : nothing}`;
      lookMore = [
        ["gradient", el.payload.kind === "line" ? nothing : fillField("Gradient", el.payload.fill, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v === undefined) { delete p.fill; return; }
          p.fill = v;
          p.colorSlot.baseColorHex = fillColorAt(v, 0);
        }, "fill"), () => ({ kind: "linear", stops: [{ at: 0, colorHex: el.payload.colorSlot.baseColorHex }, { at: 1, colorHex: el.payload.colorSlot.baseColorHex }] }))],
      ];
      break;
    case "image": {
      const img = el.payload;
      const setImage = (m: (p: ImageElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      // The entity's own picture, as Home Assistant reports it right now. A path
      // on this instance is what the watch can fetch; anything absolute is hosted
      // somewhere else and the integration refuses to proxy it.
      const livePicture = img.entity.entityId
        ? host.hass.states[img.entity.entityId]?.attributes?.entity_picture
        : undefined;
      const picturePath = typeof livePicture === "string" ? livePicture : undefined;
      const externalPicture = picturePath !== undefined && !picturePath.startsWith("/");
      content = html`
        ${segField("Source", img.source, [["camera", "Camera"], ["entityPicture", "Entity picture"], ["inline", "Custom image"]],
          (v) => host.update((c) => {
            const target = c.elements.find((e) => e.payload.id === img.id);
            if (target?.kind !== "image") return;
            setImageSource(target.payload, v);
            // A timestamp over an uploaded picture has no fetched-at time to
            // print, so it would sit there drawing nothing. Its text and the
            // capsule behind it go with the switch, in the same undo step.
            if (v === "inline") for (const t of imageTimestampLayersOf(c, img.id)) removeElement(c, t.payload.id);
          }, "img-source"),
          { titles: {
              camera: "A snapshot from a camera entity",
              entityPicture: "The picture an entity already carries: a person's photo, cover art, a weather icon",
              inline: "A picture you upload, carried in the complication itself",
            }, def: base.source as typeof img.source })}
        ${img.source === "inline"
          ? inlineImageFields(host, img, family, setImage)
          : img.source === "camera"
          ? html`
            ${img.entity.entityId && !img.entity.entityId.startsWith("camera.") ? html`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>` : nothing}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`
          : html`
            ${img.entity.entityId && picturePath === undefined ? html`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>` : nothing}
            ${externalPicture ? html`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>` : nothing}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`;
      // The crop, its own section: a picture that is the wrong shape for its
      // frame has to be aimed, and every control here is about where the
      // picture sits rather than what it is.
      look = html`
        ${segField("Picture", img.contentMode, [["fill", "Fill the frame"], ["fit", "Fit inside"]],
          (v) => setImage((p) => { p.contentMode = v; }),
          { titles: { fill: "Cover the frame, cropping what does not fit", fit: "Show the whole picture, with space around it" }, def: base.contentMode as typeof img.contentMode })}`;
      lookMore = [
        ["zoom, pan", html`
          <div class="fgroup">
          ${sliderField("Zoom", img.zoom, (v) => setImage((p) => { p.zoom = v; }, "zoom"),
            { min: MIN_ZOOM, max: 4, step: 0.05, def: 1, format: (v) => `${v.toFixed(2)}x`, unit: "x" })}
          ${sliderField("Pan left/right", img.panX, (v) => setImage((p) => { p.panX = v; }, "panx"),
            { min: -1, max: 1, step: 0.02, def: 0 })}
          ${sliderField("Pan up/down", img.panY, (v) => setImage((p) => { p.panY = v; }, "pany"),
            { min: -1, max: 1, step: 0.02, def: 0 })}
          <div class=${img.contentMode === "fit" && img.zoom === 1 ? "hint keep" : "hint"}>${imagePanHint(img)}</div>
          </div>`],
        // Reset goes to what a new picture starts with, square. A picture
        // saved without the key still draws the decode default's 6.
        ["corner radius", numberField("Corner radius", img.cornerRadius, (v) => setImage((p) => { p.cornerRadius = Math.max(0, v ?? IMAGE_NEW_CORNER_RADIUS); }, "imgradius"), { step: 1, min: 0, def: IMAGE_NEW_CORNER_RADIUS, unit: "pt" })],
      ];
      break;
    }
    case "tap": {
      content = html`
        ${tapActionEditor(host, el.payload, (m, k) => upd((e) => m((e as typeof el).payload), k), key)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;
      break;
    }
    case "chartTimes": {
      const t = el.payload;
      const setTimes = (m: (p: ChartTimesElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      const linked = host.config.elements.find((e) => e.payload.id === t.chart);
      const owner = linked?.kind === "chart" || linked?.kind === "timeline" ? linked : undefined;
      const word = owner?.kind === "timeline" ? "timeline" : "chart";
      content = html`
        <div class="field readout"><span>${owner?.kind === "timeline" ? "Timeline" : "Chart"}</span><span class="readout-v">${owner
          ? html`<button class="small" title=${`Select that ${word}`} @click=${() => host.selectLayer(owner.payload.id)}>${layerTitle(owner, describeContext(host))}</button>`
          : "None"}</span></div>
        ${owner === undefined
          ? html`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`
          : owner.kind === "timeline"
            ? timelineHistoryKey(owner.payload) === undefined
              ? html`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`
              : nothing
            : chartShowsTimeLabels(owner.payload)
              ? nothing
              : html`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${word}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`;
      look = html`${timeLabelFields(t, setTimes, base, "ct", html`
        <div class="hint">Evenly spaced from the start of the ${word}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`)}
        ${segField("Weight", t.fontWeight ?? "regular", FONT_WEIGHTS, (v) => setTimes((p) => {
          if (v === "regular") delete p.fontWeight; else p.fontWeight = v;
        }), { def: (base.fontWeight as FontWeight | undefined) ?? "regular" })}
        ${segField("Typeface", chartTimesFontDesign(t), FONT_DESIGNS, (v) => setTimes((p) => {
          if (v === "rounded") delete p.fontDesign; else p.fontDesign = v;
        }), { def: (base.fontDesign as FontDesign | undefined) ?? "rounded" })}
        ${chartTimesFontDesign(t) === "rounded" || chartTimesFontDesign(t) === "serif" ? FONT_DESIGN_HINT : nothing}`;
      lookMore = [
        ["width", html`${segField("Width", t.fontWidth ?? "standard", FONT_WIDTHS, (v) => setTimes((p) => {
          if (v === "standard") delete p.fontWidth; else p.fontWidth = v;
        }), { def: "standard" })}
        ${t.fontWidth !== undefined && t.fontWidth !== "standard" ? FONT_WIDTH_HINT : nothing}`],
        ["italic", checkField("Italic", t.italic === true, (v) => setTimes((p) => {
          if (v) p.italic = true; else delete p.italic;
        }), base.italic === true)],
        ["mono digits", html`${checkField("Mono digits", t.monospacedDigits === true, (v) => setTimes((p) => {
          if (v) p.monospacedDigits = true; else delete p.monospacedDigits;
        }), base.monospacedDigits === true)}
        ${t.monospacedDigits ? html`<div class="hint">Digits take the same width, so the times do not shift sideways as they change.</div>` : nothing}`],
      ];
      break;
    }
    case "imageTime": {
      const t = el.payload;
      const linked = host.config.elements.find((e) => e.payload.id === t.image);
      const image = linked?.kind === "image" ? linked : undefined;
      content = html`
        <div class="field readout"><span>Picture</span><span class="readout-v">${image
          ? html`<button class="small" title="Select that picture" @click=${() => host.selectLayer(image.payload.id)}>${layerTitle(image, describeContext(host))}</button>`
          : "None"}</span></div>
        ${image === undefined
          ? html`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`
          : nothing}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;
      break;
    }
    case "chartDots": {
      const d = el.payload;
      const setDots = (m: (p: ChartDotsElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      const linked = host.config.elements.find((e) => e.payload.id === d.chart);
      const chart = linked?.kind === "chart" ? linked : undefined;
      // The automatic size follows the chart's line width on this shape.
      const lineWidth = chart === undefined ? undefined : (effectivePlacement(host.config, family, chart).size ?? chart.payload.lineWidth);
      const autoSize = lineWidth === undefined ? undefined : Math.round(lineWidth * 18) / 10;
      content = html`
        ${chartLinkReadout(host, chart)}
        ${chart === undefined
          ? html`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`
          : chart.payload.style === "bars"
            ? html`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`
            : nothing}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${watchNote(host)}`;
      look = html`
        ${segField("Dots", d.dots, CHART_DOTS_MODE_OPTIONS, (v) => setDots((p) => { p.dots = v; }),
          { titles: {
              auto: "A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",
              all: "A dot on every reading",
            },
            def: "auto" })}
        <div class="grid2">
          ${numberField("Dot size", d.size ?? autoSize,
            (v) => setDots((p) => {
              const size = chartPointDotSize(v);
              if (size === undefined || size === autoSize) delete p.size;
              else p.size = size;
            }, "dotsize"),
            { step: 0.5, min: 1, max: 12, ...(autoSize === undefined ? {} : { def: autoSize }), unit: "pt" })}
          ${fallbackColorField("Dot color", d.colorHex, "Series color",
            (v) => setDots((p) => { if (v === undefined) delete p.colorHex; else p.colorHex = v; }, "dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the color the series has at its reading.</div>`;
      break;
    }
    case "chartGrid": {
      const g = el.payload;
      const setGrid = (m: (p: ChartGridElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      const linked = host.config.elements.find((e) => e.payload.id === g.chart);
      const chart = linked?.kind === "chart" ? linked : undefined;
      content = html`
        ${chartLinkReadout(host, chart)}
        ${chart === undefined
          ? html`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`
          : nothing}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${watchNote(host)}`;
      look = html`
        <div class="grid2">
          ${numberField("Lines", g.lines, (v) => setGrid((p) => { p.lines = chartGridLayerLines(v ?? CHART_DEFAULT_GRID_LINES); }, "lines"),
            { step: 1, min: 1, max: 4, def: CHART_DEFAULT_GRID_LINES })}
          ${numberField("Thickness", g.thickness, (v) => setGrid((p) => { p.thickness = chartGridThickness(v ?? CHART_GRID_LINE_WIDTH); }, "thick"),
            { step: 0.25, min: CHART_MIN_GRID_THICKNESS, max: CHART_MAX_GRID_THICKNESS, def: CHART_GRID_LINE_WIDTH, unit: "pt" })}
        </div>
        ${colorField("Color", g.colorHex, (v) => setGrid((p) => { p.colorHex = v ?? CHART_DEFAULT_GRID_HEX; }, "gridcol"), false, CHART_DEFAULT_GRID_HEX)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;
      break;
    }
    case "list": {
      const setList = (m: (p: ListElement) => void, k?: string) => upd((e) => m((e as typeof el).payload), k);
      content = html`
        ${listSourceFields(host, el.payload, setList, key)}
        ${watchNote(host)}`;
      look = html`
        ${listLayoutFields(host, el, family, setList)}
        <div class="chips">
          <button class="small" title="Add a hidden line of text that shows only when this list has nothing to draw"
            @click=${() => {
              let made: string | undefined;
              host.update((c) => { made = addEmptyState(c, id, family); });
              if (made) host.selectLayer(made);
            }}>Add an empty state</button>
        </div>`;
      break;
    }
  }

  const color = colorPlaced || elementColor(el) === undefined
    ? undefined
    : colorRow(el.kind === "shape" ? "Fill color" : el.kind === "text" && textUsesParts(el.payload) ? "Layer color" : "Color");

  // Which of the two colors a tinted Home Screen paints this layer in. Only on
  // a document that has a Home Screen shape, and never on a tap area, which
  // draws nothing to paint.
  const accent = el.kind !== "tap" && host.config.supportedFamilies.some(isHomeFamily)
    ? accentGroupRow(el.payload.accentGroup ?? "primary", (v) => upd((e) => {
        if (v === "accent") e.payload.accentGroup = "accent"; else delete e.payload.accentGroup;
      }, "accent-group"))
    : undefined;

  // A layer already bound to an entity is what a new states table tests, so the
  // entity is asked for once at the top of this editor and never again.
  const ref = elementEntity(host.config, el);
  const tested: Value | undefined = ref ? { kind: { kind: "entityState", ...ref } } : undefined;
  const textParts = el.kind === "text" && (el.payload.parts?.length ?? 0) > 0 ? el.payload.parts : undefined;

  // Which fields each card owns, for its header reset. Content is what the
  // layer says; look is how it is drawn. Per-shape size overrides count as
  // look too, since that is the box they are typed into.
  const contentKeys = CONTENT_KEYS[el.kind];
  // Opacity and the shadow belong to the Look card of every drawing layer, so
  // they join that card's reset and its changed dot.
  const lookKeys = el.kind === "tap" ? LOOK_KEYS[el.kind] : [...LOOK_KEYS[el.kind], ...LAYER_LOOK_KEYS];
  const contentChanged = anyDiffers(el.payload, base, contentKeys);
  const sizeKey = el.kind === "text" ? "fontSize" : el.kind === "icon" ? "size" : el.kind === "gauge" || el.kind === "chart" ? "lineWidth" : undefined;
  const sizedHere = host.config.perFamily[family]?.placements[id]?.size !== undefined;
  const lookChanged = anyDiffers(el.payload, base, lookKeys)
    || (sizeKey !== undefined && eff.size !== undefined && eff.size !== base[sizeKey]);
  const labels = chartLabelsOf(host.config, id);
  // Every card's reset is one update, so one Undo takes the whole card back.
  const resetKeys = (keys: readonly string[], k: string) => () => upd((e) => restoreKeys(e.payload, base, keys), k);

  // The layer's own name, above every card, in the same tinted box but as one
  // row at header height: the box's icon, its title and the input, with no
  // body to open or shut. Empty shows the automatic title as the placeholder
  // and saves no name at all. A div rather than a label, because a label
  // hands its clicks to its first control, and that is the reset dot.
  const nameCard = html`<section class="sec name-sec" data-open="true" style=${`--c:${SECTION_COLOR.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon("text")}</span>
      <h4>Name${resetButton(el.payload.name === undefined ? undefined
        : { atDefault: false, title: "Go back to the automatic title", reset: () => upd((e) => { delete e.payload.name; }, "reset-name") })}</h4>
      <input type="text" aria-label="Layer name" .value=${el.payload.name ?? ""} placeholder=${autoLayerTitle(el, describeContext(host))}
        @input=${onInput((v) => upd((e) => {
          const name = typedLayerName(v);
          if (name === undefined) delete e.payload.name; else e.payload.name = name;
        }, "name"))} />
    </div>
  </section>`;

  return html`
    ${nameCard}
    ${card(host, "content", "Content", html`${layerShowsEntity(el) ? layerEntityField(host, el, key) : nothing}${content}`,
      { color: SECTION_COLOR.content, icon: "content", summary: contentSummary(host, el),
        ...(contentChanged ? { reset: () => upd((e) => {
          restoreKeys(e.payload, base, contentKeys);
          // Parts going with the reset leave no part for a state to aim at.
          if (e.kind === "text") dropPartIds(e.payload.rules);
        }, "reset-content") } : {}) })}
    ${look === undefined && color === undefined && accent === undefined && el.kind === "tap" ? nothing
      : card(host, "look", el.kind === "image" ? "Picture" : "Look",
        // A shape's fill is what it is, so it leads; everywhere else the color
        // follows the rows it belongs with.
        el.kind === "shape"
          ? html`${color ?? nothing}${look ?? nothing}${accent ?? nothing}`
          : html`${look ?? nothing}${color ?? nothing}${accent ?? nothing}`,
        { color: SECTION_COLOR.look, icon: el.kind === "image" ? "image" : "look", ...(lookSummary(el) ? { summary: lookSummary(el)! } : {}),
          more: {
            rows: [...lookMore, ["opacity, shadow", el.kind === "tap" ? nothing : layerLookFields(el, upd)]],
          },
          ...(lookChanged ? { reset: () => host.update((c) => {
            const target = elementIn(c, id);
            if (target) restoreKeys(target.payload, base, lookKeys);
            if (sizedHere) setPlacement(c, family, id, {}, true);
          }) } : {}) })}
    ${el.kind === "chart" ? card(host, "numbers", "Extras", chartExtrasSection(host, el, chartMarks, chartBlocked, chartShown),
      { color: SECTION_COLOR.numbers, icon: "text", summary: chartNumbersSummary(host, el),
        ...(labels.length > 0 || chartMarkersOf(host.config, id).length > 0 || chartTimesOf(host.config, id).length > 0
          || chartDotsOf(host.config, id).length > 0 || chartGridsOf(host.config, id).length > 0
          || anyDiffers(el.payload, base, CHART_EXTRAS_KEYS)
          ? { reset: () => host.update((c) => {
              for (const l of chartLabelsOf(c, id)) removeElement(c, l.payload.id);
              for (const m of chartMarkersOf(c, id)) removeElement(c, m.payload.id);
              for (const t of chartTimesOf(c, id)) removeElement(c, t.payload.id);
              for (const d of chartDotsOf(c, id)) removeElement(c, d.payload.id);
              for (const g of chartGridsOf(c, id)) removeElement(c, g.payload.id);
              const chart = c.elements.find((e) => e.payload.id === id);
              if (chart) restoreKeys(chart.payload, base, CHART_EXTRAS_KEYS);
            }) }
          : {}) }) : nothing}
    ${el.kind === "timeline" || (el.kind === "image" && el.payload.source !== "inline") ? ownedExtrasCard(host, el) : nothing}
    ${el.kind === "list"
      ? card(host, "row", "Row", listRowCard(host, el, (m, k) => upd((e) => m((e as typeof el).payload), k)),
          { color: SECTION_COLOR.numbers, icon: "content",
            summary: `${el.payload.template.length} of ${LIST_MAX_TEMPLATE} layers` })
      : nothing}
    ${layerTakesLevel(el)
      ? card(host, "level", "Fill by value", levelFields(host, el, key, upd),
          { color: SECTION_COLOR.numbers, icon: "gauge", summary: levelSummary(el),
            ...(anyDiffers(el.payload, base, LEVEL_KEYS) ? { reset: resetKeys(LEVEL_KEYS, "reset-level") } : {}) })
      : nothing}
    ${card(host, "states", "Rules", statesEditor(host, el.payload.rules, el.kind,
      (c) => c.elements.find((e) => e.payload.id === id)?.payload.rules, `rules-${id}`, tested, textParts,
      { colorByValue: colorsByValue(el) }),
      { color: SECTION_COLOR.states, icon: "states", summary: statesCardSummary(el.payload.rules),
        ...statesAddAction(host, el.payload.rules, el.kind,
          (c) => c.elements.find((e) => e.payload.id === id)?.payload.rules, `rules-${id}`, tested, textParts,
          { colorByValue: colorsByValue(el) }),
        ...(el.payload.rules.length > 0 ? { reset: () => upd((e) => { e.payload.rules = []; }) } : {}) })}
    ${opts.placement === false ? nothing : placementCard(host, el, family)}
    ${opts.tap === false ? nothing : tapCard(host, el)}`;
}

/**
 * The Extras card of a timeline or a picture: the one layer each can have
 * besides itself (a timeline's clock times, a picture's timestamp), the button
 * that adds it, and its row, opened in place like a chart's extras.
 *
 * The new layer is made from where the owner sits on the shape being edited,
 * so it lands under the timeline or in the picture's corner there.
 */
function ownedExtrasCard(host: EditorHost, el: Extract<CElement, { kind: "timeline" | "image" }>): TemplateResult {
  const id = el.payload.id;
  const timeline = el.kind === "timeline";
  // A picture's timestamp is a text over a capsule; the text is its row, and
  // deleting the row takes the capsule grouped with it too.
  const layers: CElement[] = timeline ? chartTimesOf(host.config, id) : imageTimeTextsOf(host.config, id);
  const drop = (c: CustomComplicationConfig, lid: string) => {
    if (timeline) removeElement(c, lid);
    else removeImageTimestamp(c, lid);
  };
  const label = timeline ? "Clock times" : "Timestamp";
  const family = host.activeFamily;
  const add = () => host.update((c) => {
    const owner = c.elements.find((e) => e.payload.id === id);
    if (!owner) return;
    // The helpers read the payload's frame, which can be stale in canonical
    // form; lend them this shape's placement for the length of the add.
    const own = owner.payload.frame;
    owner.payload.frame = { ...effectivePlacement(c, family, owner).frame };
    if (timeline) convertChartTimes(c, id);
    else addImageTime(c, id, DESIGN_BOX[family === "inline" ? "rectangular" : family]);
    owner.payload.frame = own;
  });
  const on = layers.length > 0;
  const rows = layers.map((l): LayerRow => ({ el: l, lead: uiIcon("clock"), title: label, kind: timeline ? "Times" : "Timestamp" }));
  const key: ExtraKey = timeline ? "timeline:times" : "image:time";
  const body = html`
    ${extraPreviewPane(timeline ? "timeline" : "image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${pointExtra} @focusin=${pointExtra}>
        <button class="small ${on ? "on" : ""}" ?disabled=${on} aria-pressed=${on ? "true" : "false"} data-extra=${key}
          title=${extraTitle(key, on ? `${label} is on this ${timeline ? "timeline" : "picture"}. Remove it in the list below.` : `Add ${label.toLowerCase()}`)}
          @click=${add}>${on ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}<span>${label}</span></button>
      </div>
    </div>
    <div class="hint">${timeline
      ? "Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or color."
      : "Adds the time the picture was fetched as a text over a capsule, grouped as Timestamp, so you can drag it anywhere and give it any text or shape style."}</div>
    ${on ? html`
      ${layerRowList(host, rows, {
        icon: "close", danger: true,
        label: (what) => `Delete this ${what}`,
        run: (lid) => host.update((c) => drop(c, lid)),
      })}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>` : nothing}`;
  return card(host, "numbers", "Extras", body, {
    color: SECTION_COLOR.numbers, icon: "clock", summary: on ? label : "none",
    ...(on ? { reset: () => host.update((c) => { for (const l of layers) drop(c, l.payload.id); }) } : {}),
  });
}

/** The payload fields the Content card owns, per kind. */
const CONTENT_KEYS: Record<CElement["kind"], readonly string[]> = {
  text: ["value", "countdown", "parts"],
  icon: ["symbol", "path"],
  gauge: ["value", "minValue", "maxValue", "total", "minSource", "maxSource"],
  chart: ["value", "historyMinutes", "historyPoints", "source", "statPeriod", "statType", "limit", "takeFromEnd"],
  timeline: ["value", "historyMinutes"],
  shape: ["kind", "cornerRadius"],
  image: ["entity", "source"],
  tap: ["action", "openPageName"],
  chartTimes: [],
  chartDots: [],
  chartGrid: [],
  imageTime: [],
  list: ["source", "template"],
};

/** The two look keys every drawing layer carries, whatever its kind. A tap area
 * draws nothing, so it has neither row and neither key. */
const LAYER_LOOK_KEYS = ["opacity", "shadow"] as const;

/**
 * The Shape picker. "rectangle" and "roundedRectangle" are one choice here: a
 * rectangle is a rounded one with a corner radius of 0, and two buttons for it
 * read as two different shapes. Both kinds stay in the document format, so old
 * layers and the watch are unchanged. Capsule keeps its own button because its
 * ends stay fully round at any size, which no fixed corner radius does.
 */
const SHAPE_PICKER: [ShapeKind, string][] = [
  ["roundedRectangle", "Rectangle"], ["capsule", "Capsule"], ["circle", "Circle"], ["line", "Line"],
];
const SHAPE_PICKER_TITLES: Partial<Record<ShapeKind, string>> = {
  roundedRectangle: "Set its corner radius to round the corners",
  capsule: "Fully round ends that stay round at any size",
  line: "A rule along the frame's long side",
};

function shapePickerKind(kind: ShapeKind): ShapeKind {
  return kind === "rectangle" ? "roundedRectangle" : kind;
}

/** A rectangle's corner radius. A plain "rectangle" reads as 0, and any value
 * typed turns it into a "roundedRectangle", which draws the same at 0. */
function shapeCornerField(
  el: Extract<CElement, { kind: "shape" }>,
  base: Record<string, unknown>,
  upd: (mutate: (e: CElement) => void, k: string) => void,
): TemplateResult | typeof nothing {
  const k = el.payload.kind;
  if (k !== "rectangle" && k !== "roundedRectangle") return nothing;
  return numberField("Corner radius", k === "rectangle" ? 0 : el.payload.cornerRadius, (v) => upd((e) => {
    if (e.kind !== "shape") return;
    e.payload.kind = "roundedRectangle";
    e.payload.cornerRadius = v ?? (base.cornerRadius as number);
  }, "radius"), { step: 0.5, min: 0, def: base.cornerRadius as number, unit: "pt" });
}

/**
 * Opacity and the shadow, the two rows every drawing layer shows at the foot of
 * its Look card.
 *
 * The shadow is one switch and four rows rather than a card of its own: a glow
 * is the same four numbers with no offset, so splitting them would be two names
 * for one thing.
 */
function layerLookFields(
  el: CElement,
  upd: (mutate: (e: CElement) => void, k?: string) => void,
): TemplateResult {
  const p = el.payload;
  const shadow = p.shadow;
  const setShadow = (mutate: (s: LayerShadow) => void, k?: string) => upd((e) => {
    const next: LayerShadow = { ...(e.payload.shadow ?? SHADOW_DEFAULT) };
    mutate(next);
    e.payload.shadow = next;
  }, k);
  // A glow on small text turns to mush on the watch, so the row says so. It
  // never blocks: a 9 pt label with a faint glow is still a look someone means.
  const smallGlow = el.kind === "text" && shadow !== undefined
    && shadow.dx === 0 && shadow.dy === 0 && shadow.radius > 0 && el.payload.fontSize < 10;
  return html`
    <div class="fgroup">
    ${sliderField("Opacity", p.opacity ?? 1, (v) => upd((e) => {
      const n = clampLayerOpacity(v);
      if (n === 1) delete e.payload.opacity; else e.payload.opacity = n;
    }, "opacity"), { min: 0, max: 1, step: 0.05, def: 1, format: (v) => `${Math.round(v * 100)}%` })}
    ${checkField("Shadow", shadow !== undefined, (v) => upd((e) => {
      if (v) e.payload.shadow = { ...SHADOW_DEFAULT }; else delete e.payload.shadow;
    }, "shadow-on"), false)}
    ${shadow === undefined ? nothing : html`
      ${colorField("Shadow color", shadow.colorHex, (v) => setShadow((s) => { s.colorHex = v ?? SHADOW_DEFAULT_HEX; }, "shcol"),
        false, SHADOW_DEFAULT_HEX)}
      ${sliderField("Blur", shadow.radius, (v) => setShadow((s) => { s.radius = clampShadowRadius(v); }, "shrad"),
        { min: 0, max: SHADOW_MAX_RADIUS, step: 0.5, def: SHADOW_DEFAULT.radius, unit: "pt" })}
      <div class="grid2">
        ${numberField("Offset X", shadow.dx, (v) => setShadow((s) => { s.dx = clampShadowOffset(v ?? 0); }, "shdx"),
          { step: 0.5, min: -SHADOW_MAX_OFFSET, max: SHADOW_MAX_OFFSET, def: SHADOW_DEFAULT.dx, unit: "pt" })}
        ${numberField("Offset Y", shadow.dy, (v) => setShadow((s) => { s.dy = clampShadowOffset(v ?? 0); }, "shdy"),
          { step: 0.5, min: -SHADOW_MAX_OFFSET, max: SHADOW_MAX_OFFSET, def: SHADOW_DEFAULT.dy, unit: "pt" })}
      </div>
      <div class="hint">Both offsets at zero makes a glow. On a tinted face the shadow takes the tint, like every other color.</div>
      ${smallGlow ? html`<div class="hint warn">A glow under text this small reads as a smudge on the watch.</div>` : nothing}`}
    </div>`;
}

/**
 * The Look card's accent-group row, for a document that has a Home Screen shape.
 *
 * A tinted Home Screen paints the whole tile in one color and gives an
 * accentable layer the lighter of the two, which is the only way to keep a layer
 * apart from the rest there. It changes nothing in full color, and on the watch
 * it only ever adds a layer to a group most kinds are in already, so the row
 * says what it is for rather than pretending to be a general setting.
 */
function accentGroupRow(value: AccentGroup, set: (v: AccentGroup) => void): TemplateResult {
  return html`${segField("Tinted group", value, [["primary", "Default"], ["accent", "Accent"]], (v) => set(v), { def: "primary" })}
    <div class="hint">On a tinted Home Screen the accent group takes the lighter of the two colors. Full color is unchanged.</div>`;
}

/** The payload fields the Look card owns, per kind. A chart's marks on the plot
 * are not here: they live in its Extras card (`CHART_EXTRAS_KEYS`). */
const LOOK_KEYS: Record<CElement["kind"], readonly string[]> = {
  text: ["fontSize", "fontWeight", "colorSlot", "alignment", "lineLimit", "monospacedDigits", "arc",
    "fontDesign", "fontWidth", "italic", "minimumScale",
    "coloring", "bands", "bandAboveColorHex", "highlight", "highColorHex", "lowColorHex"],
  icon: ["size", "colorSlot"],
  gauge: ["style", "lineWidth", "trackColorHex", "colorSlot", "coloring", "bands", "bandAboveColorHex", "thresholdValue", "thresholdColorHex", "fill", "ticks", "labels"],
  chart: ["style", "scale", "minValue", "maxValue", "baseline", "barGap", "lineWidth", "coloring", "bands", "bandAboveColorHex", "fillBands", "curve", "fillStyle", "fillColorHex", "areaFill", "barRadius", "barCorners", "barBorderWidth", "barBorderColorHex", "bandAboveFillColorHex", "bandAboveBorderColorHex", "barBorderOpenBase", "scaleFrom", "colorSlot"],
  timeline: ["bands", "otherColorHex", "gap", "cornerRadius"],
  shape: ["colorSlot", "borderColorHex", "borderWidth", "thickness", "fill"],
  image: ["contentMode", "zoom", "panX", "panY", "cornerRadius"],
  tap: [],
  chartTimes: ["timeLabelCount", "labelSize", "labelColorHex", "hourCycle", "minutes",
    "fontWeight", "fontDesign", "fontWidth", "italic", "monospacedDigits"],
  chartDots: ["dots", "size", "colorHex"],
  chartGrid: ["lines", "colorHex", "thickness"],
  imageTime: [],
  list: ["rows", "direction", "columns", "gap"],
};

/**
 * A gauge's marks and end text: the two objects that turn a bare fill into a
 * dial you can read a number off.
 *
 * Both stay off the wire until the author asks for them, so each is written back
 * whole and dropped again the moment it says nothing (`gaugeTicksAreDefault`,
 * `gaugeLabelsAreDefault`). Offered on every style: a bar and a row of dots draw
 * their marks along the bar and their two ends underneath it.
 */
function gaugeDialFields(g: GaugeElement, setGauge: (m: (p: GaugeElement) => void, k?: string) => void): TemplateResult {
  const ticks = g.ticks ?? defaultGaugeTicks();
  const labels = g.labels ?? defaultGaugeLabels();
  const setTicks = (m: (t: GaugeTicks) => void, k?: string) => setGauge((p) => {
    const next = { ...(p.ticks ?? defaultGaugeTicks()) };
    m(next);
    if (gaugeTicksAreDefault(next)) delete p.ticks; else p.ticks = next;
  }, k);
  const setLabels = (m: (l: GaugeLabels) => void, k?: string) => setGauge((p) => {
    const next = { ...(p.labels ?? defaultGaugeLabels()) };
    m(next);
    if (gaugeLabelsAreDefault(next)) delete p.labels; else p.labels = next;
  }, k);
  return html`
    <div class="fgroup">
    <div class="grid2">
      ${numberField("Marks", ticks.count, (v) => setTicks((t) => { t.count = Math.max(0, Math.min(GAUGE_MAX_TICKS, Math.round(v ?? 0))); }, "tickn"),
        { step: 1, min: 0, max: GAUGE_MAX_TICKS, def: 0 })}
      ${ticks.count > 0
        ? numberField("Mark length", ticks.length, (v) => setTicks((t) => { t.length = Math.max(1, Math.min(GAUGE_MAX_TICK_LENGTH, v ?? GAUGE_DEFAULT_TICK_LENGTH)); }, "ticklen"),
            { step: 0.5, min: 1, max: GAUGE_MAX_TICK_LENGTH, def: GAUGE_DEFAULT_TICK_LENGTH, unit: "pt" })
        : nothing}
    </div>
    ${ticks.count > 0 ? html`
      ${colorField("Mark color", ticks.colorHex, (v) => setTicks((t) => { t.colorHex = v ?? GAUGE_DEFAULT_TICK_HEX; }, "tickcol"), false, GAUGE_DEFAULT_TICK_HEX)}
      ${numberField("Long every", ticks.majorEvery, (v) => setTicks((t) => { t.majorEvery = Math.max(0, Math.round(v ?? 0)); }, "tickmaj"),
        { step: 1, min: 0, def: 0 })}
      <div class="hint">Marks are spread across the scale. Long every 5 draws every fifth one
        half as long again, which is what makes a dial countable. 0 draws them all the same.</div>`
      : nothing}
    </div>
    <div class="fgroup">
    ${checkField("End numbers", labels.show, (v) => setLabels((l) => { l.show = v; }, "lblshow"), false)}
    ${labels.show ? html`
      <div class="grid2">
        ${numberField("Text size", labels.size, (v) => setLabels((l) => { l.size = Math.max(GAUGE_MIN_LABEL_SIZE, Math.min(GAUGE_MAX_LABEL_SIZE, v ?? GAUGE_DEFAULT_LABEL_SIZE)); }, "lblsize"),
          { step: 0.5, min: GAUGE_MIN_LABEL_SIZE, max: GAUGE_MAX_LABEL_SIZE, def: GAUGE_DEFAULT_LABEL_SIZE, unit: "pt" })}
        ${colorField("Text color", labels.colorHex, (v) => setLabels((l) => { l.colorHex = v ?? GAUGE_DEFAULT_LABEL_HEX; }, "lblcol"), false, GAUGE_DEFAULT_LABEL_HEX)}
      </div>
      <div class="hint">Min and max at the two ends of the scale${g.style === "needle" ? ", and the reading itself under the pointer" : ""}.</div>`
      : nothing}
    </div>`;
}

/** The Chart row of a layer that draws on a chart: the chart's name as a button
 * that selects it, or None once it is gone. */
function chartLinkReadout(host: EditorHost, chart: Extract<CElement, { kind: "chart" }> | undefined): TemplateResult {
  return html`<div class="field readout"><span>Chart</span><span class="readout-v">${chart
    ? html`<button class="small" title="Select that chart" @click=${() => host.selectLayer(chart.payload.id)}>${layerTitle(chart, describeContext(host))}</button>`
    : "None"}</span></div>`;
}

/** The chart payload fields the Extras card owns: the marks the chart draws on
 * its own plot, and whether each has moved to a layer. */
const CHART_EXTRAS_KEYS = ["highlight", "highColorHex", "lowColorHex", "marker", "highMarker", "lowMarker",
  "thresholdValue", "thresholdColorHex", "nowIndex", "nowColorHex", "drawsThreshold", "drawsNowLine", "drawsTimeLabels",
  "timeLabelCount", "labelSize", "labelColorHex", "labelsAbove", "hourCycle", "minutes"] as const;

// ── Tappable ──────────────────────────────────────────────────────────────

/** What the action form edits: an action, and the page an openPage action
 * opens. A tap layer is one of these; so is the document's Control Center
 * control, which is not a layer at all. */
export type TapActionHolder = Pick<TapElement, "action" | "openPageId" | "openPageName">;

/**
 * The action form behind a tap: what it does, the entity it does it to, and
 * the page picker for Open a watch app page. Shared by a free-standing tap layer's own
 * editor, by the Tappable section below and by the Control Center card, so
 * they can never drift apart.
 *
 * `types` narrows the picker for a surface that cannot run everything: a
 * control is a one-shot press in Control Center, so it passes
 * `CONTROL_ACTION_TYPES` and keeps the same labels. `label` renames the row
 * for a surface where "tap" is the wrong word: a control is pressed, not
 * tapped, and it is not on the face at all.
 */
export function tapActionEditor(
  host: EditorHost,
  tap: TapActionHolder,
  upd: (mutate: (p: TapActionHolder) => void, k?: string) => void,
  key: string,
  types: [TapAction["type"], string][] = LAYER_TAP_TYPES,
  label = "Tap action",
): TemplateResult {
  const action = tap.action;
  return html`
    ${tapActionMenu(label, action.type, types, (v) => upd((p) => {
      p.action = tapActionForType(v, p.action);
      if (v !== "openPage") { delete p.openPageId; delete p.openPageName; }
    }), key, host.deviceKind === "iphone")}
    ${tapNote(action, usesPages(host.config))}
    ${action.type === "refreshAll"
      ? refreshTargetsField(host, action, (next) => upd((p) => { p.action = next; }))
      : nothing}
    ${action.type === "refreshAll" ? refreshAllBudgetHint(host, action) : nothing}
    ${action.type === "refresh"
      ? refreshLayersField(host, action, (next) => upd((p) => { p.action = next; }))
      : nothing}
    ${"entityId" in action ? html`
      ${entityField(host, "Target", action, (ref) => upd((p) => { p.action = { type: action.type, ...ref }; }, "tap-entity"), `${key}-tap`)}
      ${itemPlaceholders(host, (text) => upd((p) => {
        const a = p.action;
        if ("entityId" in a) p.action = { type: a.type, entityId: text, displayName: "", domain: "" };
      }, "tap-entity"), "the target")}` : nothing}
    ${action.type === "callService"
      ? callServiceFields(host, action, (next, k) => upd((p) => { p.action = next; }, k), `${key}-tap`)
      : nothing}
    ${action.type === "showPage" ? showPageField(host, action, (next) => upd((p) => { p.action = next; }, "tap-page")) : nothing}
    ${action.type === "playTour" ? tourHoldFields(host) : nothing}
    ${action.type === "openPage" ? pageChoiceField(host, tap.openPageId, tap.openPageName, (pid, name) => upd((p) => {
      if (pid === undefined) { delete p.openPageId; delete p.openPageName; return; }
      p.openPageId = pid;
      if (name) p.openPageName = name; else delete p.openPageName;
    }, "tap-page")) : nothing}`;
}

/** A finger covers about this many points, so a target with a shorter side
 * under it is hard to hit on a wrist. Apple's own guidance is 44 pt for a
 * phone; a complication cannot afford that, so this is the point where the
 * editor starts saying something rather than the point where it is fine. */
const SMALL_TAP_POINTS = 24;

/**
 * How big the tap area really is, shape by shape, in points, and a warning when
 * one of them is too small to hit. The fractions in the frame fields never show
 * this, because the same fraction is a different size in each shape.
 */
function tapSizeHint(host: EditorHost, tapId: string): TemplateResult | typeof nothing {
  const parts: string[] = [];
  let smallest = Infinity;
  for (const family of DRAWABLE_FAMILIES) {
    if (!host.config.supportedFamilies.includes(family)) continue;
    const size = tapPointSize(host.config, tapId, family);
    if (!size) continue;
    parts.push(`${familyTitle(family)} ${Math.round(size.width)} x ${Math.round(size.height)} pt`);
    smallest = Math.min(smallest, size.width, size.height);
  }
  if (parts.length === 0) return nothing;
  const small = smallest < SMALL_TAP_POINTS;
  return html`<div class="field readout"><span>Tap size</span><span class="readout-v">${parts.join(" · ")}</span></div>
    ${small ? html`<div class="hint warn">That is small for a wrist. Show the tap zone and drag its corners out.</div>` : nothing}`;
}

/**
 * "Tappable" on a drawing layer. Ticking it attaches a tap that copies this
 * layer's frame and per-shape placements, so the author never sizes an
 * invisible rectangle by hand; the action editor then sits right here, which
 * is why an attached tap needs no row of its own in the Layers card.
 */
/** The one-line state of a chart's Extras card: the marks the chart draws on
 * its plot first, then the layers that belong to it. */
function chartNumbersSummary(host: EditorHost, el: Extract<CElement, { kind: "chart" }>): string {
  const c = el.payload;
  const labels = chartLabelsOf(host.config, c.id);
  const markers = chartMarkersOf(host.config, c.id);
  const times = chartTimesOf(host.config, c.id);
  const dots = chartDotsOf(host.config, c.id);
  const grids = chartGridsOf(host.config, c.id);
  if (labels.length === 0 && markers.length === 0 && times.length === 0 && dots.length === 0 && grids.length === 0) return "none";
  const parts = [...labels.map((l) => {
    const k = l.payload.value.kind;
    return k.kind === "chartStat" ? (CHART_STATS.find(([s]) => s === k.stat)?.[1] ?? "number").toLowerCase() : "number";
  })];
  for (const m of markers) {
    const { at, place } = m.payload.chartAnchor!;
    const name = (CHART_ANCHOR_POINTS.find(([k]) => k === at)?.[1] ?? "reading").toLowerCase();
    parts.push(place === "through" ? `${name} line` : `${name} marker`);
  }
  for (const _ of times) parts.push("times layer");
  for (const _ of dots) parts.push("dots layer");
  for (const _ of grids) parts.push("grid layer");
  return parts.join(" · ");
}

/**
 * What a chart carries besides the plot: the text layers that print one of its
 * readings, the layers pinned over one of them, and the buttons that add either.
 *
 * Both are ordinary layers in the chart's group, dragged, sized, colored and
 * given states like any other; this card only lists them and hands the selection
 * over. That is the whole design: a number is a text layer with a `chartStat`
 * value, a marker is any layer with a `chartAnchor`, and neither is a setting on
 * the chart that has to be invented twice.
 */
function chartExtrasSection(host: EditorHost, el: Extract<CElement, { kind: "chart" }>, marks: TemplateResult | undefined,
  blocked: Partial<Record<ExtraKey, string>> = {}, shown: readonly number[] = []): TemplateResult {
  const id = el.payload.id;
  const ctx = describeContext(host);
  const labels = chartLabelsOf(host.config, id);
  const times = chartTimesOf(host.config, id);
  const dots = chartDotsOf(host.config, id);
  const grids = chartGridsOf(host.config, id);
  const markers = chartMarkersOf(host.config, id);

  // Every number as the resolver prints it for this chart right now, which is
  // what a number layer added for it would print (before its unit).
  const texts: Partial<Record<ChartStat, string>> = {};
  for (const [stat] of CHART_STATS) {
    const t = host.resolve({ kind: { kind: "chartStat", layer: id, stat } });
    if (t !== undefined && t.trim() !== "") texts[stat] = t;
  }
  const real = shown.filter((n) => Number.isFinite(n));
  const nowRaw = el.payload.nowIndex === undefined ? NaN : Number(host.resolve(el.payload.nowIndex));
  const nowAt = Number.isFinite(nowRaw) && shown.length > 0 ? Math.min(shown.length - 1, Math.max(0, Math.round(nowRaw))) : undefined;
  const nowValue = nowAt === undefined || !Number.isFinite(shown[nowAt]!) || real.length === 0
    ? undefined
    : chartStatText(shown[nowAt]!, Math.max(...real) - Math.min(...real));
  const sample: ChartSample = {
    values: shown,
    texts,
    ...(nowAt === undefined ? {} : { now: nowAt }),
    ...(el.payload.thresholdValue === undefined ? {} : { threshold: el.payload.thresholdValue }),
  };

  // Each reading's two switches. On adds the same layer the old Numbers and
  // Markers buttons added, and the chart stays selected; off deletes every
  // layer of that kind for the reading, which Undo brings back.
  const numbersFor = (cfg: CustomComplicationConfig, stat: ChartStat) => chartLabelsOf(cfg, id)
    .filter((l) => l.payload.value.kind.kind === "chartStat" && l.payload.value.kind.stat === stat);
  const markersFor = (cfg: CustomComplicationConfig, at: ChartAnchorPoint) => chartMarkersOf(cfg, id)
    .filter((m) => m.payload.chartAnchor?.at === at && m.payload.chartAnchor.place !== "through");
  const readingSwitch = (key: ExtraKey, count: number, addTitle: string, removeTitle: string, label: string,
    add: (cfg: CustomComplicationConfig) => void, layersNow: (cfg: CustomComplicationConfig) => CElement[]) => html`
    <button type="button" class="xtog ${count > 0 ? "on" : ""}" role="switch" aria-checked=${count > 0 ? "true" : "false"}
      aria-label=${label} data-extra=${key}
      title=${extraTitle(key, count === 0 ? addTitle : count === 1 ? removeTitle : `${removeTitle}: all ${count} of them`)}
      @click=${() => host.update((cfg) => {
        if (count > 0) for (const layer of layersNow(cfg)) removeElement(cfg, layer.payload.id);
        else add(cfg);
      })}>${count > 0 ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}</button>`;
  const readings = html`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${pointExtra} @focusin=${pointExtra}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${CHART_READINGS.map((r) => {
      const value = r.stat !== undefined ? texts[r.stat] : nowValue;
      const statName = r.stat === undefined ? "" : (CHART_STATS.find(([s]) => s === r.stat)?.[1] ?? r.label).toLowerCase();
      const markName = r.marker === "now" ? "the reading at now" : `the ${(CHART_ANCHOR_POINTS.find(([a]) => a === r.marker)?.[1] ?? r.label).toLowerCase()}`;
      // Pointing at the row previews its number, or its marker when it has no
      // number; each switch still previews its own kind, being the closer key.
      const rowKey: ExtraKey | undefined = r.stat !== undefined ? `number:${r.stat}` : r.marker !== undefined ? `marker:${r.marker}` : undefined;
      return html`<div class="xr-row" role="row" data-extra=${rowKey ?? nothing}>
        <span role="cell"><span class="xr-name">${r.label}</span></span>
        <span role="cell"><span class="xr-v nums">${value ?? ""}</span></span>
        <span role="cell">${r.stat === undefined ? nothing : readingSwitch(`number:${r.stat}`, numbersFor(host.config, r.stat).length,
          `Print the ${statName} as a number`, `Remove the ${statName} number`, `${r.label} number`,
          (cfg) => { addChartLabel(cfg, id, r.stat!); }, (cfg) => numbersFor(cfg, r.stat!))}</span>
        <span role="cell">${r.marker === undefined ? nothing : readingSwitch(`marker:${r.marker}`, markersFor(host.config, r.marker).length,
          `Put a marker over ${markName}`, `Remove the marker over ${markName}`, `${r.label} marker`,
          (cfg) => { addChartMarker(cfg, id, r.marker!); }, (cfg) => markersFor(cfg, r.marker!))}</span>
      </div>`;
    })}
  </div>`;
  // A lead that shows what each one draws, so a marker and a line on the same
  // reading tell apart.
  const rows: LayerRow[] = [
    ...labels.map((l): LayerRow => ({ el: l, lead: host.resolve(l.payload.value) ?? "--", title: layerTitle(l, ctx), kind: "Number" })),
    ...markers.map((m): LayerRow => {
      const { at, place } = m.payload.chartAnchor!;
      const name = CHART_ANCHOR_POINTS.find(([k]) => k === at)?.[1] ?? "Reading";
      if (place === "through") return { el: m, lead: at === "now" ? "│" : "─", title: at === "zero" ? "Zero" : name, kind: "Line" };
      const glyph = m.kind === "text" ? (host.resolve(m.payload.value) ?? "●")
        : m.kind === "icon" ? markerGlyph(host.resolve(m.payload.symbol)) : "◆";
      return { el: m, lead: glyph, title: name, kind: "Marker" };
    }),
    ...times.map((t): LayerRow => ({ el: t, lead: uiIcon("clock"), title: "Clock times", kind: "Times" })),
    ...dots.map((d): LayerRow => ({ el: d, lead: uiIcon("chartDots"), title: "Reading dots", kind: "Dots" })),
    ...grids.map((g): LayerRow => ({ el: g, lead: uiIcon("chartGrid"), title: "Grid lines", kind: "Grid" })),
  ];
  const count = rows.length;
  return html`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${extraPreviewPane("chart", blocked, el.payload.style === "bars", sample)}
    ${marks ?? nothing}
    <div class="field list-field"><span>Readings</span>${readings}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${count === 0 ? nothing : html`
      <div class="shown-head">On this chart <span class="shown-count">${count}</span></div>
      ${layerRowList(host, rows, {
        icon: "close", danger: true,
        label: (what) => `Delete this ${what}`,
        run: (layerId) => host.update((c) => removeElement(c, layerId)),
      })}
      <div class="hint">Click a row to set its value, color and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`;
}

/** The Extras button last pointed at or focused, shown in the preview. Kept
 * after the pointer leaves, so moving from one row of buttons to the next does
 * not flash the bare chart in between. */
let extraPointed: ExtraKey | undefined;

/** Whether the Extras preview is shown. Every page load starts with it shown:
 * remembering a hide per browser left people who hid it once never seeing it
 * again. The old remembered choice is cleared so it cannot come back. */
let extraPreviewOn = true;
try { window.localStorage.removeItem("wrist-assistant-extras-preview"); } catch { /* private window */ }

function setExtraPreviewOn(on: boolean, node: EventTarget | null): void {
  extraPreviewOn = on;
  requestRerender(node);
}

/** Pointer or focus moved onto an Extras button: preview that one. Pointer
 * events still reach a disabled button, so a greyed out one explains itself. */
function pointExtra(e: Event): void {
  if (!extraPreviewOn) return;
  const key = (e.target as Element | null)?.closest?.("[data-extra]")?.getAttribute("data-extra") as ExtraKey | null;
  if (!key || key === extraPointed) return;
  extraPointed = key;
  requestRerender(e.currentTarget);
}

/** A button's tooltip. With the preview hidden it also says what the button
 * adds, since nothing else on the card does. */
function extraTitle(key: ExtraKey, action: string): string {
  return extraPreviewOn ? action : `${extraInfo(key)} ${action}.`;
}

/** The preview at the top of an Extras card. `owner` is the layer the card
 * belongs to: a button pointed at on another kind's card is not shown here. */
function extraPreviewPane(owner: ExtraOwner, blocked: Partial<Record<ExtraKey, string>> = {}, bars = false, sample: ChartSample = {}): TemplateResult {
  if (!extraPreviewOn) {
    return html`<button class="link xprev-show" @click=${(e: Event) => setExtraPreviewOn(true, e.currentTarget)}>
      ${uiIcon("show")}<span>Show preview</span></button>`;
  }
  // A timeline or a picture has one button, so its preview shows it from the start.
  const only: ExtraKey | undefined = owner === "timeline" ? "timeline:times" : owner === "image" ? "image:time" : undefined;
  const key = extraPointed !== undefined && extraOwner(extraPointed) === owner ? extraPointed : only;
  const why = key === undefined ? undefined : blocked[key];
  const word = owner === "image" ? "picture" : owner;
  return html`<div class="xprev">
    <span class="well">${extraPreview(owner, key, bars, sample)}</span>
    <span class="xprev-t">
      <b>${key === undefined ? "Preview" : extraName(key)}</b>
      <span>${key === undefined ? `Point at a ${owner === "chart" ? "switch" : "button"} below to see what it adds to the ${word}.` : extraInfo(key)}</span>
      ${why ? html`<span class="xprev-why">${why}</span>` : nothing}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${(e: Event) => setExtraPreviewOn(false, e.currentTarget)}>${uiIcon("hide")}</button>
  </div>`;
}

/** One layer listed inside another layer's inspector: the chart's extras, a
 * group's members. */
interface LayerRow { el: CElement; lead: unknown; title: string; kind: string }

/**
 * Layers listed as rows that open in place with the settings people change
 * most, so the layer being inspected stays selected; "More settings" hands the
 * selection to the row's layer. Native <details> keeps each row's open state in
 * the page, and `repeat` keys it by layer id so removing one row never opens its
 * neighbour. The button beside each row is the caller's: delete, or take out.
 */
function layerRowList(
  host: EditorHost,
  rows: readonly LayerRow[],
  action: { icon: UiIconName; danger?: boolean; label: (what: string) => string; run: (id: string) => void },
): TemplateResult {
  const row = ({ el: layer, lead, title, kind }: LayerRow) => {
    const id = layer.payload.id;
    const what = kind.toLowerCase();
    return html`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${() => host.peekLayer(id, true)}
        @pointerleave=${() => host.peekLayer(id, false)}>
        <summary class="num-pick" title=${`Show the settings for this ${what}`}>
          <span class="num-lead">${lead}</span>
          <span class="num-text"><span class="num-title">${title}</span><span class="num-kind">${kind}</span></span>
          <span class="chev">${uiIcon("chevron")}</span>
        </summary>
        <div class="num-body">
          ${layerQuickFields(host, layer)}
          <div class="chips"><button class="small" title=${`Select this ${what} to see all of its settings`}
            @click=${() => host.selectLayer(id)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${action.danger ? "danger" : ""}" title=${action.label(what)} aria-label=${action.label(what)}
        @click=${() => {
          // The row goes away before its pointerleave can arrive.
          host.peekLayer(id, false);
          action.run(id);
        }}>${uiIcon(action.icon)}</button>
    </div>`;
  };
  return html`<div class="chart-numbers">${repeat(rows, (r) => r.el.payload.id, row)}</div>`;
}

/**
 * The few settings of a layer that people change most, shown when its row in
 * another layer's inspector is opened: what it shows, how big, what color. The
 * layer's own editor keeps everything else, one click away.
 */
function layerQuickFields(host: EditorHost, el: CElement): TemplateResult {
  const id = el.payload.id;
  const key = `quick-${id}`;
  const family = host.activeFamily;
  const upd = (m: (e: CElement) => void, k: string) => host.update((c) => {
    const target = c.elements.find((e) => e.payload.id === id);
    if (target) m(target);
  }, `${key}-${k}`);
  const base = newElement(el.kind).payload as unknown as Record<string, unknown>;
  const ownColor = elementColor(el);
  const color = ownColor === undefined ? nothing
    : colorField("Color", ownColor, (v) => upd((e) => {
        if (elementColor(e) !== undefined) (e.payload as { colorSlot: { baseColorHex: string } }).colorSlot.baseColorHex = v ?? "#FFFFFF";
      }, "color"), false, (base.colorSlot as { baseColorHex: string } | undefined)?.baseColorHex ?? "#FFFFFF");
  const anchor = el.payload.chartAnchor;

  switch (el.kind) {
    case "text": {
      const k = el.payload.value.kind;
      return html`
        ${k.kind === "chartStat"
          ? selectField("Number", k.stat, [...CHART_STATS], (v) => upd((e) => {
              if (e.kind === "text" && e.payload.value.kind.kind === "chartStat") {
                e.payload.value = { ...e.payload.value, kind: { ...e.payload.value.kind, stat: v } };
              }
            }, "stat"))
          : anchor || textUsesParts(el.payload)
            ? nothing
            : valueEditor(host, el.payload.value, (v) => upd((e) => { if (e.kind === "text") e.payload.value = v; }, "value"),
                { showResolved: true, label: el.payload.countdown ? "Until" : "Text", key: `${key}-value` })}
        ${anchor && anchor.place !== "through" ? markerReadingFields(host, id, anchor, upd) : nothing}
        <div class="grid2">
          ${shapeSizeField(host, el, family, "Font size", { step: 1, min: 4, def: base.fontSize as number })}
          ${el.payload.countdown || textUsesParts(el.payload) ? nothing : color}
        </div>`;
    }
    case "icon":
      return html`
        ${anchor
          ? markerReadingFields(host, id, anchor, upd)
          // A pasted drawing has no symbol name to offer: its box lives in the
          // layer's own Content card, one click away.
          : isCustomSvgIcon(el.payload)
          ? customSvgFields(el.payload, (m, k) => upd((e) => { if (e.kind === "icon") m(e.payload); }, k ?? "svg-path"))
          : valueEditor(host, el.payload.symbol,
          (v) => upd((e) => { if (e.kind === "icon") e.payload.symbol = v; }, "symbol"), {
            noFormat: true, showResolved: true, symbol: true, label: "Symbol", key: `${key}-symbol`,
            setSymbolPath: (d) => upd((e) => {
              if (e.kind !== "icon") return;
              if (d) e.payload.path = d; else delete e.payload.path;
              delete e.payload.viewBox;
            }, "symbol"),
          })}
        <div class="grid2">
          ${shapeSizeField(host, el, family, "Icon size", { step: 1, min: 4, def: base.size as number })}
          ${color}
        </div>`;
    case "shape":
      if (el.payload.kind !== "line") {
        return html`
          <div class="grid2">
            ${shapeCornerField(el, base, upd)}
            ${color}
          </div>`;
      }
      return html`
        ${anchor ? chartPointFields(host, anchor, key) : nothing}
        <div class="grid2">
          ${numberField("Thickness", el.payload.thickness, (v) => upd((e) => {
            if (e.kind === "shape") e.payload.thickness = v ?? 1;
          }, "thick"), { step: 0.5, min: 0.5, def: base.thickness as number, unit: "pt" })}
          ${color}
        </div>`;
    case "gauge": {
      const g = el.payload;
      return html`
        ${valueEditor(host, g.value, (v) => upd((e) => { if (e.kind === "gauge") e.payload.value = v; }, "value"),
          { showResolved: true, label: "Reading", key: `${key}-value` })}
        <div class="grid2">
          ${g.style === "dots" ? nothing : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: base.lineWidth as number })}
          ${color}
        </div>`;
    }
    case "chart": {
      const c = el.payload;
      return html`
        ${valueEditor(host, c.value, (v) => upd((e) => { if (e.kind === "chart") e.payload.value = v; }, "value"),
          { label: "Readings", noShare: true, key: `${key}-value` })}
        ${segField("Style", c.style, CHART_STYLES, (v) => upd((e) => { if (e.kind === "chart") e.payload.style = v; }, "style"),
          { def: base.style as typeof c.style })}
        <div class="grid2">
          ${c.style === "bars" ? nothing : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: base.lineWidth as number })}
          ${color}
        </div>`;
    }
    case "timeline":
      return html`
        ${valueEditor(host, el.payload.value, (v) => upd((e) => { if (e.kind === "timeline") e.payload.value = v; }, "value"),
          { label: "States", noShare: true, key: `${key}-value` })}`;
    case "image": {
      const img = el.payload;
      return html`
        ${segField("Source", img.source, [["camera", "Camera"], ["entityPicture", "Entity picture"], ["inline", "Custom image"]],
          (v) => upd((e) => { if (e.kind === "image") setImageSource(e.payload, v); }, "source"), { def: base.source as typeof img.source })}
        ${segField("Picture", img.contentMode, [["fill", "Fill the frame"], ["fit", "Fit inside"]],
          (v) => upd((e) => { if (e.kind === "image") e.payload.contentMode = v; }, "mode"), { def: base.contentMode as typeof img.contentMode })}`;
    }
    case "tap":
      return tapActionEditor(host, el.payload, (m, k) => upd((e) => { if (e.kind === "tap") m(e.payload); }, k ?? "action"), key);
    case "chartTimes": {
      const t = el.payload;
      return html`
        ${sliderField("Times", t.timeLabelCount, (v) => upd((e) => {
          if (e.kind === "chartTimes") e.payload.timeLabelCount = Math.max(0, Math.min(TIMELINE_MAX_LABEL_COUNT, Math.round(v)));
        }, "count"), { min: 0, max: TIMELINE_MAX_LABEL_COUNT, step: 1, def: base.timeLabelCount as number,
          format: (v) => (v <= 0 ? "None" : String(Math.round(v))), range: false })}
        <div class="grid2">
          ${numberField("Time size", t.labelSize, (v) => upd((e) => {
            if (e.kind === "chartTimes") e.payload.labelSize = Math.min(TIMELINE_MAX_LABEL_SIZE, Math.max(TIMELINE_MIN_LABEL_SIZE, v ?? TIMELINE_DEFAULT_LABEL_SIZE));
          }, "size"), { step: 0.5, min: TIMELINE_MIN_LABEL_SIZE, max: TIMELINE_MAX_LABEL_SIZE, def: base.labelSize as number, unit: "pt" })}
          ${colorField("Time color", t.labelColorHex, (v) => upd((e) => {
            if (e.kind === "chartTimes") e.payload.labelColorHex = v ?? TIMELINE_DEFAULT_LABEL_HEX;
          }, "color"), false, base.labelColorHex as string)}
        </div>`;
    }
    case "imageTime":
      return html``;
    case "chartDots": {
      const d = el.payload;
      const linked = host.config.elements.find((e) => e.payload.id === d.chart);
      const lineWidth = linked?.kind === "chart" ? (effectivePlacement(host.config, family, linked).size ?? linked.payload.lineWidth) : undefined;
      const autoSize = lineWidth === undefined ? undefined : Math.round(lineWidth * 18) / 10;
      return html`
        ${segField("Dots", d.dots, CHART_DOTS_MODE_OPTIONS, (v) => upd((e) => { if (e.kind === "chartDots") e.payload.dots = v; }, "mode"), { def: "auto" })}
        <div class="grid2">
          ${numberField("Dot size", d.size ?? autoSize, (v) => upd((e) => {
            if (e.kind !== "chartDots") return;
            const size = chartPointDotSize(v);
            if (size === undefined || size === autoSize) delete e.payload.size;
            else e.payload.size = size;
          }, "size"), { step: 0.5, min: 1, max: 12, ...(autoSize === undefined ? {} : { def: autoSize }), unit: "pt" })}
          ${fallbackColorField("Dot color", d.colorHex, "Series color", (v) => upd((e) => {
            if (e.kind !== "chartDots") return;
            if (v === undefined) delete e.payload.colorHex; else e.payload.colorHex = v;
          }, "color"))}
        </div>`;
    }
    case "chartGrid": {
      const g = el.payload;
      return html`
        <div class="grid2">
          ${numberField("Lines", g.lines, (v) => upd((e) => {
            if (e.kind === "chartGrid") e.payload.lines = chartGridLayerLines(v ?? CHART_DEFAULT_GRID_LINES);
          }, "lines"), { step: 1, min: 1, max: 4, def: CHART_DEFAULT_GRID_LINES })}
          ${numberField("Thickness", g.thickness, (v) => upd((e) => {
            if (e.kind === "chartGrid") e.payload.thickness = chartGridThickness(v ?? CHART_GRID_LINE_WIDTH);
          }, "thick"), { step: 0.25, min: CHART_MIN_GRID_THICKNESS, max: CHART_MAX_GRID_THICKNESS, def: CHART_GRID_LINE_WIDTH, unit: "pt" })}
        </div>
        ${colorField("Color", g.colorHex, (v) => upd((e) => {
          if (e.kind === "chartGrid") e.payload.colorHex = v ?? CHART_DEFAULT_GRID_HEX;
        }, "color"), false, CHART_DEFAULT_GRID_HEX)}`;
    }
    default:
      return html`${color}`;
  }
}

/** Which reading a marker follows and which side of it it sits on, for its
 * row in the Extras card. A marker follows one bar, so only the column readings
 * are offered, plus whatever it already follows. */
function markerReadingFields(
  host: EditorHost,
  id: string,
  anchor: ChartAnchor,
  upd: (m: (e: CElement) => void, k: string) => void,
): TemplateResult {
  const points = CHART_ANCHOR_POINTS.filter(([at]) => chartAnchorIsColumn(at) || at === anchor.at) as unknown as [ChartAnchorPoint, string][];
  return html`
    <div class="grid2">
      ${selectField("Reading", anchor.at, points, (v) => upd((e) => { if (e.payload.chartAnchor) e.payload.chartAnchor.at = v; }, "at"))}
      ${selectField("Sits", anchor.place, CHART_ANCHOR_PLACES.filter(([p]) => p !== "through") as [ChartAnchorPlace, string][],
        (v) => upd((e) => { if (e.payload.chartAnchor) e.payload.chartAnchor.place = v; }, "place"))}
    </div>`;
}

function tappableSection(host: EditorHost, el: CElement, key: string): TemplateResult | typeof nothing {
  // A tap has no tap, and a free-standing tap layer is edited on its own.
  if (el.kind === "tap") return nothing;
  const id = el.payload.id;
  const attached = attachedTapsOf(host.config, id)[0];
  const updTap = (mutate: (p: TapElement) => void, k?: string) => host.update((c) => {
    const t = c.elements.find((e) => e.kind === "tap" && e.payload.attachedTo === id);
    if (t) mutate(t.payload as TapElement);
  }, k ? `${key}-${k}` : undefined);
  const preview = defaultAttachedTapAction(host.config, el);
  return html`
    ${checkField("Tappable", attached !== undefined, (v) => host.update((c) => {
      if (v) attachTap(c, id);
      else detachTaps(c, id);
    }))}
    ${attached
      ? html`<div class="value-editor">
          ${tapActionEditor(host, attached.payload as TapElement, updTap, `${key}-attached`)}
          <div class="field"><span>Tap zone</span>
            <div class="chips">
              <button class="pick ${host.tapAreaShown ? "on" : ""}" aria-pressed=${host.tapAreaShown ? "true" : "false"}
                title=${host.tapAreaShown ? "Back to the normal face" : "Dim the face and show only this layer's tap zone, with corners to drag"}
                @click=${() => host.showTapArea(!host.tapAreaShown)}><span class="glyph">☞</span>${host.tapAreaShown ? "Hide" : "Show"}</button>
              ${!isZeroOutset((attached.payload as TapElement).outset)
                ? html`<button class="icon" title="Fit the tap zone to the layer again" aria-label="Fit the tap zone to the layer again"
                    @click=${() => updTap((p) => { p.outset = { ...ZERO_OUTSET }; })}>${uiIcon("reset")}</button>`
                : nothing}
            </div>
          </div>
        </div>
        ${tapSizeHint(host, attached.payload.id)}
        <div class="hint">The tap zone follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap zones overlap, the one higher in Layers wins.</div>`
      : html`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${describeTapAction(preview)}</b>.</div>`}`;
}

// ── Layer groups ──────────────────────────────────────────────────────────

/** A literal reads as `"lock"` in a rule, where the quotes say it is not an
 * entity; as a row title the name alone is the clearer thing. */
function unquote(s: string): string {
  return s.length >= 2 && s.startsWith("\"") && s.endsWith("\"") ? s.slice(1, -1) : s;
}

/** A character that stands in for an icon marker in the Extras list, where
 * there is no room for the icon itself. */
function markerGlyph(symbol: string | undefined): string {
  if (symbol === undefined) return "◆";
  if (symbol.includes("up")) return "▲";
  if (symbol.includes("down")) return "▼";
  if (symbol.startsWith("circle")) return "●";
  return "◆";
}

/** The name a layer goes by in the Layers list and the crumbs. */
export function layerTitle(el: CElement, ctx?: DescribeContext): string {
  // A name the author or the editor gave the layer wins over anything derived.
  if (el.payload.name) return el.payload.name;
  return autoLayerTitle(el, ctx);
}

/** What a typed layer name saves as: trimmed, and nothing at all when blank,
 * so an emptied Name box goes back to the automatic title instead of
 * saving an empty name. */
export function typedLayerName(raw: string): string | undefined {
  const name = raw.trim();
  return name === "" ? undefined : name;
}

/** The title a layer gets from its content, whatever its name. The Name box
 * shows it as its placeholder. */
export function autoLayerTitle(el: CElement, ctx?: DescribeContext): string {
  // A chart extra is named for what it marks. Its own content is a glyph or a
  // bare line, which says nothing in a list of five of them.
  const anchor = el.payload.chartAnchor;
  if (anchor !== undefined) {
    const name = CHART_ANCHOR_POINTS.find(([k]) => k === anchor.at)?.[1] ?? "Reading";
    return anchor.place === "through" ? `${name} line` : `${name} marker`;
  }
  switch (el.kind) {
    case "text": {
      // A chart's number sits in the chart's group, so the stat alone says
      // which one it is. Adding the chart's name made titles too long to read.
      const k = el.payload.value.kind;
      if (k.kind === "chartStat") return CHART_STATS.find(([s]) => s === k.stat)?.[1] ?? "Chart number";
      return unquote(describeValue(el.payload.value, ctx));
    }
    // The marker is not a name anyone typed, so a pasted drawing is titled for
    // what it is rather than for `svg:custom`.
    case "icon": return isCustomSvgIcon(el.payload) ? "Custom SVG" : unquote(describeValue(el.payload.symbol, ctx));
    case "gauge": return describeValue(el.payload.value, ctx);
    case "chart": return describeValue(el.payload.value, ctx);
    case "timeline": return describeValue(el.payload.value, ctx);
    case "shape": return el.payload.kind === "roundedRectangle" ? "Rounded rectangle" : el.payload.kind;
    case "image": {
      if (el.payload.source === "inline") return "picture";
      const e = el.payload.entity;
      return e.displayName || e.entityId || (el.payload.source === "camera" ? "camera" : "picture");
    }
    case "tap": {
      const a = el.payload.action;
      const target = "entityId" in a
        ? (a.displayName || a.entityId)
        : a.type === "callService"
          ? [a.serviceDomain, a.serviceName].filter((s) => s !== "").join(".")
          : a.type === "openPage" ? (el.payload.openPageName || "") : "";
      return target ? `${a.type} · ${target}` : a.type;
    }
    case "chartTimes": return "Clock times";
    case "chartDots": return "Reading dots";
    case "chartGrid": return "Grid lines";
    case "imageTime": return "Timestamp";
    case "list": return "List";
  }
}

/**
 * A group's own card: its name, whether it moves as one, and what is in it.
 * The members' own settings stay on the members; a group is a handle on
 * several layers, not another kind of layer.
 */
export function groupEditor(host: EditorHost, group: LayerGroup): TemplateResult {
  const members = groupMembers(host.config, group.id);
  const subs = childGroups(host.config, group.id);
  const all = groupLayers(host.config, group.id).length;
  const lockedAround = groupAncestors(host.config, group.id).find((g) => g.locked);
  const ctx = describeContext(host);
  const upd = (m: (g: LayerGroup) => void, k?: string) => host.update((c) => { const g = c.groups?.find((x) => x.id === group.id); if (g) m(g); }, k ? `group-${group.id}-${k}` : undefined);
  // Taking something out moves it up one level: into the group around this
  // one, or to the top level.
  const up = group.parentId;
  return card(host, "content", "Group", html`
    ${textField("Name", group.name, (v) => upd((g) => { g.name = v; }, "name"))}
    ${checkField("Move as one",group.locked, (v) => upd((g) => { g.locked = v; }))}
    <div class="hint">${group.locked
      ? "Locked: a drag on any of these layers moves all of them, the groups inside included. Unlock to move one at a time."
      : "Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}${lockedAround
      ? ` It sits inside the locked group ${lockedAround.name}, which moves as one whatever this group is set to.` : ""}</div>
    <div class="shown-head">Layers <span class="shown-count">${members.length}</span></div>
    ${layerRowList(host, members.map((m): LayerRow => ({ el: m, lead: uiIcon(m.kind), title: layerTitle(m, ctx), kind: KIND_LABEL[m.kind] })), {
      icon: "ungroup",
      label: (what) => `Take this ${what} out of the group`,
      run: (id) => host.update((c) => setGroup(c, id, up)),
    })}
    ${subs.length === 0 ? nothing : html`
      <div class="shown-head">Groups inside <span class="shown-count">${subs.length}</span></div>
      <div class="chips">${subs.map((s) => html`<button class="small" title=${`Take ${s.name} out of this group, with everything in it`}
        @click=${() => host.update((c) => { setGroupParent(c, s.id, up); })}>${uiIcon("ungroup")}<span>${s.name}</span></button>`)}</div>`}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder. What it holds moves up one level." @click=${() => host.update((c) => ungroup(c, group.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group, one level up, and keeps it on the face.</div>`,
    { color: SECTION_COLOR.group, icon: "folder", summary: `${all} layers${subs.length > 0 ? ` · ${subs.length} sub-group${subs.length === 1 ? "" : "s"}` : ""} · ${group.locked ? "moves as one" : "unlocked"}` });
}

// ── Family layout ─────────────────────────────────────────────────────────

/**
 * The shape's own cards, what the Background row of the Layers list selects.
 * The whole complication's tap comes first: a tap that lands on the
 * background is the complication's tap, so the two are one card rather than
 * a setting on the shape and another on the Complication card.
 */
export function familyEditor(host: EditorHost, family: FamilyKind): TemplateResult {
  return html`${docTapCard(host)}${familyCards(host, family)}`;
}

function familyCards(host: EditorHost, family: FamilyKind): TemplateResult {
  if (family === "inline") return inlineEditor(host);
  const layout = host.config.perFamily[family];
  if (!layout) {
    return html`<div class="hint">No settings stored for ${familyTitle(family)} yet.</div>
      <button class="small" @click=${() => host.update((c) => { c.perFamily[family] = { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] }; })}>Add ${familyTitle(family)} settings</button>`;
  }
  const upd = (mutate: (l: FamilyLayout) => void, k?: string) => host.update((c) => mutate(c.perFamily[family]!), k ? `fam-${family}-${k}` : undefined);
  const placed = shownCount(host.config, family);
  // Same sections as a layer, in the same order and for the same reason: a
  // shape is another object in the one inspector, not another tab.
  const home = isHomeFamily(family);
  const bg = layout.backgroundColorHex ? colorWords(layout.backgroundColorHex) : home ? "the system's widget material" : "transparent";
  const border = layout.borderColorHex ? `${layout.borderWidth} pt ${colorWords(layout.borderColorHex)} border` : "no border";
  const background = colorField(
    home ? "Tile background (blank = the system's widget material)" : "Background (blank = transparent)",
    layout.backgroundColorHex,
    (v) => upd((l) => { if (v === undefined) delete l.backgroundColorHex; else l.backgroundColorHex = v; }, "bg"),
    true,
    null,
  );
  const backgroundGradient = fillField("Background gradient", layout.backgroundFill, (v) => upd((l) => {
    if (v === undefined) { delete l.backgroundFill; return; }
    l.backgroundFill = v;
    l.backgroundColorHex = fillColorAt(v, 0);
  }, "bgfill"), () => ({ kind: "linear", stops: [
    { at: 0, colorHex: layout.backgroundColorHex ?? "#000000" },
    { at: 1, colorHex: layout.backgroundColorHex ?? "#000000" }] }));
  return html`
    ${card(host, "look", `${familyTitle(family)} shape`, html`
      ${home ? nothing : background}
      ${colorField("Border color", layout.borderColorHex, (v) => upd((l) => { if (v === undefined) delete l.borderColorHex; else l.borderColorHex = v; }, "border"), true, null)}
      ${numberField("Border width", layout.borderWidth, (v) => upd((l) => { l.borderWidth = v ?? 2; }, "bw"), { step: 0.5, min: 0, def: 2, unit: "pt" })}`,
      { color: SECTION_COLOR.look, icon: "shape", summary: `${bg} · ${border}`,
        more: { rows: [["gradient", home ? nothing : backgroundGradient]] },
        ...(layout.backgroundColorHex !== undefined || layout.backgroundFill !== undefined || layout.borderColorHex !== undefined || layout.borderWidth !== 2
          ? { reset: () => upd((l) => { delete l.backgroundColorHex; delete l.backgroundFill; delete l.borderColorHex; l.borderWidth = 2; }, "reset-look") } : {}) })}
    ${home ? card(host, "home", "Home Screen", html`
      ${background}
      ${backgroundGradient}
      <div class="hint">The tile is drawn edge to edge: this color fills every point of it, and the design is laid out inside the ${familyTitle(family)} box.</div>
      <div class="hint keep">iOS 18 lets a user tint the whole Home Screen. The system then drops the background and draws the design in two tones, so check that it still reads without its colors.</div>
      ${familyNote(family) ? html`<div class="hint keep">${familyTitle(family)} needs ${familyNote(family)}. An iPhone on an older version is not offered this size when adding a widget, and every other size still draws.</div>` : nothing}`,
      { color: SECTION_COLOR.look, icon: "shape", summary: bg,
        ...(layout.backgroundColorHex !== undefined || layout.backgroundFill !== undefined
          ? { reset: () => upd((l) => { delete l.backgroundColorHex; delete l.backgroundFill; }, "reset-home") } : {}) }) : nothing}
    ${family === "corner" ? card(host, "corner", "Corner content", cornerEditor(host, layout, upd),
      { color: SECTION_COLOR.content, icon: "content", summary: layout.curvedText ? "Big curved text" : "Layer canvas",
        ...(layout.curvedText !== undefined || layout.bezelText !== undefined || layout.bezelGauge !== undefined
          ? { reset: () => upd((l) => { delete l.curvedText; delete l.bezelText; delete l.bezelGauge; }, "reset-corner") } : {}) }) : nothing}
    ${card(host, "states", "Shape rules", statesEditor(host, layout.rules, "layout", (c) => c.perFamily[family]?.rules, `rules-${family}`),
      { color: SECTION_COLOR.states, icon: "states", summary: statesCardSummary(layout.rules),
        ...statesAddAction(host, layout.rules, "layout", (c) => c.perFamily[family]?.rules, `rules-${family}`),
        ...(layout.rules.length > 0 ? { reset: () => upd((l) => { l.rules = []; }, "reset-states") } : {}) })}
    ${card(host, "placements", "Layers", html`
      <div class="hint keep">${placed === 0
        ? `Nothing is on the ${familyTitle(family)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`
        : `${placed} layer${placed === 1 ? " is" : "s are"} on the ${familyTitle(family)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,
      { color: SECTION_COLOR.position, icon: "place", summary: placed === 0 ? "Nothing on it" : `${placed} layer${placed === 1 ? "" : "s"}` })}`;
}

/** The Inline shape: one line of text, no canvas. The watch draws
 * `symbol label: value` and drops the label when the face is narrow. The line
 * is always a row of parts (`inlineToParts` converts an older one on open):
 * words, live values and icons, the value parts using the same control a text
 * layer uses. An icon as the first part is the line's symbol. */
function inlineEditor(host: EditorHost): TemplateResult {
  const inline = host.config.inline;
  if (!inline || !inlineUsesParts(inline)) {
    return html`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${() => host.addInlineText()}>Add Inline text</button>`;
  }
  const upd = (mutate: (i: InlineLayoutDraft) => void, k?: string) => host.update((c) => { if (c.inline) mutate(c.inline); }, k ? `inline-${k}` : undefined);
  const ctx = describeContext(host);
  const parts = inline.parts!;
  const summary = parts.map((p) => (p.symbol !== undefined ? `(${p.symbol})` : literalPartText(p.value) ?? `[${describeValueBody(p.value, ctx)}]`)).join("");
  // Count down needs one live value to count to. Offered only when the line
  // has exactly one and it holds a time; kept while on, with a warning, so a
  // countdown that stopped working can be turned off.
  const timer = inlineCountdownPart(parts);
  const counting = inline.countdown === true;
  return html`
    ${card(host, "content", "Inline text", html`
      ${inlinePartsEditor(host, inline, upd)}
      ${timer || counting ? html`
        ${countdownFields(host, counting, timer?.value, (v) => upd((i) => { if (v) i.countdown = true; else delete i.countdown; }))}
        ${counting ? html`<div class="hint">While it counts down, the line is the first icon, the words before the time, and the time left. Parts after the time are not drawn.</div>` : nothing}` : nothing}
      <div class="field readout"><span>On the face</span><span class="readout-v">${inline.symbol ? html`${host.icons.render(inline.symbol, 12, "#FFFFFF")} ` : ""}${inline.label ? `${inline.label}: ` : ""}${inlineRuns(host.resolve(inline.value) ?? "--").map((r) => ("symbol" in r ? host.icons.render(r.symbol, 12, "#FFFFFF") : r.text))}</span></div>
      <div class="hint">Some faces, such as Modular, show the words only and leave the icons out.</div>`,
      { color: SECTION_COLOR.content, icon: "text", summary: truncate(summary, 48) })}`;
}

type InlineLayoutDraft = NonNullable<CustomComplicationConfig["inline"]>;

/** Where `selectedParts` keeps the Inline part picked. Not a layer id, so it
 * never meets one. */
const INLINE_PARTS_KEY = "inline";

/**
 * The Inline line as a row of parts: the chips and the two add buttons, then
 * the one picked. A text layer's parts editor without the looks, because the
 * face draws Inline in its own font and tint and would ignore them.
 */
function inlinePartsEditor(
  host: EditorHost,
  inline: InlineLayoutDraft,
  upd: (mutate: (i: InlineLayoutDraft) => void, k?: string) => void,
): TemplateResult {
  const parts = inline.parts ?? [];
  const ctx = describeContext(host);
  const index = Math.max(0, parts.findIndex((p) => p.id === selectedParts.get(INLINE_PARTS_KEY)));
  const part = parts[index]!;
  const count = parts.length;
  const iconPart = part.symbol !== undefined;
  const literalPart = part.value.kind.kind === "literal";
  const updPart = (mutate: (x: InlinePart) => void, k?: string) => upd((i) => {
    const x = i.parts?.find((y) => y.id === part.id);
    if (x) mutate(x);
  }, k ? `part-${part.id}-${k}` : undefined);
  const select = (id: string, node: EventTarget | null) => {
    selectedParts.set(INLINE_PARTS_KEY, id);
    requestRerender(node);
  };
  const add = (value: Value, node: EventTarget | null) => {
    const id = newId();
    selectedParts.set(INLINE_PARTS_KEY, id);
    upd((i) => { (i.parts ??= []).push({ id, value }); });
    openPopoverSoon(node, popoverId(`inline-part-${id}`), true);
  };
  // A gap between two parts, most often an icon and the words after it. It
  // is a text part holding one space, so it needs no editor opened.
  const addSpace = () => {
    const id = newId();
    selectedParts.set(INLINE_PARTS_KEY, id);
    upd((i) => { (i.parts ??= []).push({ id, value: literal(" ") }); });
  };
  // An icon part opens on a symbol, so the line shows something at once; the
  // picker under it is open to change it.
  const addIcon = () => {
    const id = newId();
    selectedParts.set(INLINE_PARTS_KEY, id);
    upd((i) => { (i.parts ??= []).push({ id, value: literal(""), symbol: "star.fill" }); });
  };
  const move = (to: number) => upd((i) => { if (i.parts) moveItem(i.parts, index, to); });
  const remove = () => {
    const next = parts[index + 1] ?? parts[index - 1];
    if (next) selectedParts.set(INLINE_PARTS_KEY, next.id);
    upd((i) => { i.parts = (i.parts ?? []).filter((x) => x.id !== part.id); });
  };
  // The same rule the save uses: only a line with two or more live values is
  // a template, and only a template can leave a part out.
  const blocked = syncInlineParts(structuredClone(host.config));
  const chips = parts.map((p) => {
    const on = p.id === part.id;
    if (p.symbol !== undefined) {
      return html`<button type="button" role="option" aria-selected=${on ? "true" : "false"} class="part-chip value ${on ? "on" : ""}"
        aria-label=${`Part ${parts.indexOf(p) + 1}: icon ${p.symbol}`} title=${p.symbol} @click=${(e: Event) => select(p.id, e.currentTarget)}>
        <span class="part-txt">${host.icons.render(p.symbol, 13, "#FFFFFF")}</span>
      </button>`;
    }
    const chip = partChip(p.value, ctx);
    const now = chip.kind === "value" ? host.resolve(p.value) : undefined;
    return html`<button type="button" role="option" aria-selected=${on ? "true" : "false"} class="part-chip ${chip.kind} ${on ? "on" : ""}"
      aria-label=${rulePartLabel(p, parts.indexOf(p), ctx)} @click=${(e: Event) => select(p.id, e.currentTarget)}>
      ${chip.kind === "text"
        ? html`<span class="part-txt">${chip.label === ""
          ? html`<span class="part-empty">empty</span>`
          : chipRuns(chip.label).map((r) => (r.space ? html`<span class="part-sp">${"·".repeat(r.text.length)}</span>` : r.text))}</span>`
        : html`<span class="part-txt">${chip.label}</span>`}
      ${now === undefined ? nothing : html`<span class="part-now">${now}</span>`}
    </button>`;
  });
  return html`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${chips}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${(e: Event) => add(literal(""), e.currentTarget)}>${uiIcon("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${(e: Event) => add({ kind: { kind: "entityState", entityId: "", displayName: "", domain: "" } }, e.currentTarget)}>${uiIcon("braces")}<span>Add value</span></button>
        <button type="button" class="small" title="Add an SF Symbol inside the line"
          @click=${addIcon}>${uiIcon("icon")}<span>Add icon</span></button>
        <button type="button" class="small" title="Add one space, a gap between two parts"
          @click=${addSpace}>${uiIcon("plus")}<span>Add space</span></button>
      </div>
    </div>
    ${blocked.length === 0 ? nothing : html`<div class="hint warn">${blockedReasons(blocked)} The watch leaves ${blocked.length === 1 ? "that part" : "those parts"} out of the line.</div>`}
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${index + 1}</b> of ${count} · ${iconPart ? "Icon" : literalPart && literalPartText(part.value)?.trim() === "" && literalPartText(part.value) !== "" ? "Space" : literalPart ? "Text" : "Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${index === 0} @click=${() => move(index - 1)}>${uiIcon("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${index === count - 1} @click=${() => move(index + 1)}>${uiIcon("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${count === 1}
          title=${count === 1 ? "The line keeps at least one part" : "Remove this part"}
          @click=${remove}>${uiIcon("delete")}</button>
      </div>
      ${iconPart
        ? html`${symbolField(host, part.symbol ?? "", (v) => updPart((x) => { x.symbol = v.trim(); }, "symbol"), `inline-part-${part.id}-symbol`, undefined, "Icon")}
          <div class="hint">${index === 0 ? "First in the line, so it draws ahead of the words with a gap, and stays while the line counts down." : "Drawn inside the line, where the part sits. Needs the watch app from 2.8.0."}</div>`
        : html`${valueEditor(host, part.value, (v) => updPart((x) => { x.value = v; }, "value"), { showResolved: true, label: literalPart ? "Text" : "Shows", key: `inline-part-${part.id}` })}
          ${literalPart ? html`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>` : nothing}`}
    </div>
  </div>`;
}

/** Corner-only controls: main content mode (canvas vs big curved text) and the
 * bezel (none / text label / gauge arc), matching what the watch can draw. */
function cornerEditor(
  host: EditorHost,
  layout: FamilyLayout,
  upd: (mutate: (l: FamilyLayout) => void, k?: string) => void,
): TemplateResult {
  const mode: "canvas" | "curved" = layout.curvedText ? "curved" : "canvas";
  const bezelKind: "none" | "text" | "gauge" = layout.bezelGauge ? "gauge" : layout.bezelText ? "text" : "none";
  return html`
    <div class="fgroup">
    ${segField("Main content", mode, [["canvas", "Layer canvas"], ["curved", "Big curved text"]], (v) => upd((l) => {
      if (v === "curved") { if (!l.curvedText) l.curvedText = defaultCurvedText(); }
      else { delete l.curvedText; delete l.curvedColorHex; }
    }))}
    ${mode === "curved" && layout.curvedText ? html`
      ${valueEditor(host, layout.curvedText, (val) => upd((l) => { l.curvedText = val; }, "curved"), { showResolved: true, label: "Curved text", key: "fam-corner-curved" })}
      ${colorField("Curved text color", layout.curvedColorHex ?? "#FFFFFF", (v) => upd((l) => { if (v === undefined) delete l.curvedColorHex; else l.curvedColorHex = v; }, "curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    ` : nothing}
    </div>
    <div class="fgroup">
    ${segField("Bezel", bezelKind, [["none", "None"], ["text", "Text label"], ["gauge", "Gauge arc"]], (v) => upd((l) => {
      if (v === "text") { delete l.bezelGauge; if (!l.bezelText) l.bezelText = literal("Label"); }
      else if (v === "gauge") { delete l.bezelText; if (!l.bezelGauge) l.bezelGauge = defaultBezelGauge(); }
      else { delete l.bezelText; delete l.bezelGauge; }
    }))}
    ${bezelKind === "text" && layout.bezelText ? html`
      ${valueEditor(host, layout.bezelText, (val) => upd((l) => { l.bezelText = val; }, "bezel"), { showResolved: true, label: "Bezel label", key: "fam-corner-bezel" })}
      ${countdownFields(host, layout.bezelCountdown === true, layout.bezelText, (v) => upd((l) => {
        if (v) l.bezelCountdown = true; else delete l.bezelCountdown;
      }))}` : nothing}
    ${bezelKind === "gauge" && layout.bezelGauge ? bezelGaugeEditor(host, layout.bezelGauge, upd) : nothing}
    </div>`;
}

function bezelGaugeEditor(
  host: EditorHost,
  g: BezelGauge,
  upd: (mutate: (l: FamilyLayout) => void, k?: string) => void,
): TemplateResult {
  const stops = [
    g.colorHexes[0] ?? "#34C759",
    g.colorHexes[1] ?? g.colorHexes[g.colorHexes.length - 1] ?? "#FFCC00",
    g.colorHexes[g.colorHexes.length - 1] ?? "#FF3B30",
  ];
  const setStop = (i: number) => (v: string | undefined) => upd((l) => {
    const next = [...stops];
    next[i] = v ?? next[i]!;
    l.bezelGauge!.colorHexes = next;
  }, `gstop${i}`);
  return html`
    ${valueEditor(host, g.value, (val) => upd((l) => { l.bezelGauge!.value = val; }, "gvalue"), { showResolved: true, label: "Reading", key: "fam-corner-gvalue" })}
    <div class="grid2">
      ${numberField("Gauge min", g.minValue, (v) => upd((l) => { l.bezelGauge!.minValue = v ?? 0; }, "gmin"), { step: 1 })}
      ${numberField("Gauge max", g.maxValue, (v) => upd((l) => { l.bezelGauge!.maxValue = v ?? 100; }, "gmax"), { step: 1 })}
    </div>
    ${colorField("Arc color (min end)", stops[0], setStop(0))}
    ${colorField("Arc color (middle)", stops[1], setStop(1))}
    ${colorField("Arc color (max end)", stops[2], setStop(2))}
    ${checkField("End labels",!!(g.minLabel || g.maxLabel), (v) => upd((l) => {
      const gauge = l.bezelGauge!;
      if (v) { gauge.minLabel = literal(String(gauge.minValue)); gauge.maxLabel = literal(String(gauge.maxValue)); }
      else { delete gauge.minLabel; delete gauge.maxLabel; }
    }))}
    ${g.minLabel ? valueEditor(host, g.minLabel, (val) => upd((l) => { l.bezelGauge!.minLabel = val; }, "gminlab"), { label: "Min label", key: "fam-corner-gminlab" }) : nothing}
    ${g.maxLabel ? valueEditor(host, g.maxLabel, (val) => upd((l) => { l.bezelGauge!.maxLabel = val; }, "gmaxlab"), { label: "Max label", key: "fam-corner-gmaxlab" }) : nothing}`;
}

export const FAMILY_OPTIONS = DRAWABLE_FAMILIES.map((f): [FamilyKind, string] => [f, familyTitle(f)]);
export type { Comparison };

// ── Rules ─────────────────────────────────────────────────────────────────

// COMPARISON_LABELS lives in states.ts, beside the table that turns a numeric
// comparison into "below 20", so the two wordings cannot drift apart.

const CHANGE_LABELS: Record<StyleChangeKind, string> = {
  setColor: "Set color", setOpacity: "Set opacity", setText: "Set text", setIcon: "Set icon",
  setFontSize: "Set size", setFontWeight: "Set weight",
  setFontDesign: "Set typeface", setFontWidth: "Set width", setItalic: "Set italic", setRotation: "Set rotation",
  hide: "Hide", show: "Show", setGaugeValue: "Set gauge value", setGaugeMin: "Set gauge min", setGaugeMax: "Set gauge max",
  setBorderColor: "Set border color", setBorderWidth: "Set border width", setBackgroundColor: "Set background color",
};

const CHANGE_KINDS = Object.keys(CHANGE_LABELS) as StyleChangeKind[];

/** What a rule aimed at one part of a rich text layer can change. Anything
 * else such a rule sets is ignored, on the watch and in the preview. */
export const PART_RULE_PROPERTIES: readonly StyleProperty[] = ["color", "text", "fontSize", "fontWeight", "fontDesign", "fontWidth", "italic", "visibility"];

/** The changes a rule can add: those its target reads, narrowed to what a
 * part reads when the rule is aimed at one. */
export function changeKindsFor(target: RuleTarget, forPart = false): StyleChangeKind[] {
  const allowed = RULE_TARGET_PROPERTIES[target].filter((p) => !forPart || PART_RULE_PROPERTIES.includes(p));
  return CHANGE_KINDS.filter((k) => allowed.includes(STYLE_PROPERTY[k]));
}

/** The Changes menu on a rich text layer's rule: the whole text, or one part. */
function partTargetField(
  parts: readonly TextPart[],
  partId: string | undefined,
  ctx: DescribeContext,
  set: (id: string, node: EventTarget | null) => void,
): TemplateResult {
  const gone = partId !== undefined && !parts.some((p) => p.id === partId);
  return html`<label class="field"><span>Changes</span>
      <select @change=${(e: Event) => set((e.target as HTMLSelectElement).value, e.target)}>
        ${rulePartOptions(parts, partId, ctx).map(([v, text]) => html`<option value=${v} ?selected=${v === (partId ?? "")}>${text}</option>`)}
      </select></label>
    ${gone ? html`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>` : nothing}`;
}

/**
 * What a value is, in words, for the chip on the front of every value editor
 * and for rule summaries.
 *
 * The context is optional so callers that only hold a value (the layer list in
 * the panel) still get a sensible line. With it, a named value reads as its
 * name and an entity reads as its friendly name, which is what the user typed
 * into the picker and what they will recognise.
 */
export interface DescribeContext {
  values?: readonly NamedValue[];
  hass?: HassLike;
  /** The document's layers, so a chart stat can name its chart. */
  elements?: readonly CElement[];
}

const TIME_FIELD_WORDS: Record<TimeField, string> = {
  now: "the time", hour: "the hour", minute: "the minute", weekday: "the weekday",
  day: "the day", month: "the month", timestamp: "the timestamp",
};

/** The friendly name a stored entity reference should read as. */
function entityWords(ref: EntityRef, ctx?: DescribeContext): string {
  if (ref.entityId === "") return "(no entity)";
  const stored = ref.displayName.trim();
  if (stored !== "" && stored !== ref.entityId) return stored;
  const live = ctx?.hass?.states[ref.entityId]?.attributes.friendly_name;
  return typeof live === "string" && live.trim() !== "" ? live.trim() : ref.entityId;
}

function truncate(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/** The short form of a value's formatting, for the end of a description. */
export function describeFormat(format: ValueFormat | undefined): string {
  if (!format || formatIsEmpty(format)) return "";
  const bits: string[] = [];
  if (format.decimals !== undefined) bits.push(`${format.decimals} dp`);
  if (format.multiply !== undefined) bits.push(`×${format.multiply}`);
  if (format.offset !== undefined) bits.push(`${format.offset < 0 ? "" : "+"}${format.offset}`);
  if (format.prefix) bits.push(`"${format.prefix}" first`);
  if (format.suffix) bits.push(`"${format.suffix}" after`);
  if (format.useEntityUnit) bits.push("with unit");
  if (format.relativeTime) bits.push("as relative time");
  if (format.duration) bits.push("as a duration");
  if (format.timestamp) bits.push(`as ${(TIMESTAMP_STYLES.find(([s]) => s === format.timestamp)?.[1] ?? format.timestamp).toLowerCase()}`);
  if (timestampHasClock(format.timestamp) && format.hideMinutes) bits.push("no minutes");
  if (timestampHasClock(format.timestamp) && format.hideDayPeriod) bits.push("no AM/PM");
  if (timestampHasClock(format.timestamp) && format.showSeconds && !format.hideMinutes) bits.push("with seconds");
  if (format.textCase) bits.push(format.textCase === "capitalized" ? "Capitalized" : format.textCase === "upper" ? "UPPER" : "lower");
  return bits.length === 0 ? "" : ` (${bits.join(", ")})`;
}

/** Short one-line description of a value, for the value chip and rule summaries. */
export function describeValue(v: Value, ctx?: DescribeContext): string {
  return `${describeValueBody(v, ctx)}${describeFormat(v.format)}`;
}

function describeValueBody(v: Value, ctx?: DescribeContext): string {
  const k = v.kind;
  switch (k.kind) {
    case "literal": return k.value ? `"${truncate(k.value, 40)}"` : "(empty)";
    case "entityState": return entityWords(k, ctx);
    case "entityAttribute": return k.attribute ? `${entityWords(k, ctx)} · ${k.attribute}` : entityWords(k, ctx);
    case "entityAge": return `age of ${entityWords(k, ctx)}`;
    case "aggregate": return describeAggregate(k.aggregate);
    case "time": return TIME_FIELD_WORDS[k.timeField];
    case "dataAge": return "data age";
    case "item": return k.field ? `item ${k.field}` : "item field";
    case "listStat": return k.stat === "total" ? "items in total" : "items shown";
    case "imageTime": {
      if (k.layer === "") return "picture time (no picture chosen)";
      const picture = ctx?.elements?.find((e) => e.kind === "image" && e.payload.id === k.layer);
      return picture?.kind === "image" ? `time of ${entityWords(picture.payload.entity, ctx)}` : "time of a missing picture";
    }
    case "jinja": return k.value ? `template ${truncate(k.value, 32)}` : "template (empty)";
    case "named": {
      if (k.id === "") return "(no value chosen)";
      const named = ctx?.values?.find((n) => n.id === k.id);
      return named?.name?.trim() || `named ${k.id.slice(0, 8)}`;
    }
    case "chartStat": {
      const stat = (CHART_STATS.find(([s]) => s === k.stat)?.[1] ?? k.stat).toLowerCase();
      if (k.layer === "") return `${stat} (no chart chosen)`;
      const chart = ctx?.elements?.find((e) => e.kind === "chart" && e.payload.id === k.layer);
      // The chart's own value names it. No recursion past one hop: a chart's
      // value is never itself a chart stat in any document the editor writes.
      const of = chart?.kind === "chart" && chart.payload.value.kind.kind !== "chartStat"
        ? describeValueBody(chart.payload.value, ctx)
        : "a missing chart";
      return `${stat} of ${of}`;
    }
  }
}

function describeAggregate(a: AggregateSpec): string {
  const of = a.scope.kind === "entities"
    ? `${a.scope.entities.length} entit${a.scope.entities.length === 1 ? "y" : "ies"}`
    : a.scope.domains.length > 0 ? a.scope.domains.join(" + ") : "matching entities";
  return `${a.function} of ${of}`;
}

function moveItem<T>(list: T[], from: number, to: number): void {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item!);
}

/**
 * Rule list editor for one layer or one family layout. `locate` finds the
 * live rule array inside a config so every edit goes through the undo history.
 */
export function rulesEditor(host: EditorHost, rules: Rule[], target: RuleTarget, locate: (cfg: CustomComplicationConfig) => Rule[] | undefined, key: string, parts?: readonly TextPart[], seed?: Value): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) => host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);
  return html`<div class="rules">
    ${rules.length === 0 ? html`<div class="rempty">No rules yet. A rule checks values and changes how this ${target === "layout" ? "family" : "layer"} looks.</div>` : nothing}
    ${rules.map((rule, ri) => ruleEditor(host, rule, ri, rules.length, target, upd, `${key}-${rule.id}`, parts, seed))}
    <div class="radd">
      <button class="small pill" title="Add a rule. A later rule wins over an earlier one for the same setting." @click=${() => upd((r) => { r.push(seededRule(host, seed)); })}>${uiIcon("plus")}<span>Add a rule</span></button>
    </div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same setting. Different settings add up.</div>
  </div>`;
}

// ── the Advanced editor's rows ─────────────────────────────────────────────
// Laid out the way Home Assistant lays out an automation: a heading per
// section, one full-width row per item that says what it does in a sentence,
// a menu on the row for moving and deleting it, and a pill to add one more.
// A row opens in place to be edited.

/** Rows the user has opened to edit, by row key. Transient, like the choice
 * of editor: what is open is not part of the document. */
const openRows = new Set<string>();

/** A new test that already reads what the layer is about, the way the
 * table's first row does, and checks it the way its reading suggests: on for
 * a light, a threshold for a number, equals the reading for words. */
function seededTest(host: EditorHost, seed: Value | undefined): import("./model.js").Test {
  if (seed === undefined) return newTest();
  const resolved = host.resolve(seed);
  const shape = freshShape(seed, resolved);
  const comparison: Comparison = shape === "onOff" ? { kind: "isOn" }
    : shape === "bands" ? { kind: "lessThan", value: literal(String(seedThresholds(Number(resolved))[0])) }
    : { kind: "equals", value: literal((resolved ?? "").trim() === "unknown" || (resolved ?? "").trim() === "unavailable" ? "" : (resolved ?? "").trim()) };
  return { id: newId(), value: structuredClone(seed), comparison };
}

function seededCase(host: EditorHost, seed: Value | undefined): RuleCase {
  return { id: newId(), when: { join: "all", tests: [seededTest(host, seed)] }, then: [] };
}

function seededRule(host: EditorHost, seed: Value | undefined): Rule {
  return { id: newId(), cases: [seededCase(host, seed)] };
}

/** One item of the Advanced editor: an icon, a sentence, a dot while it is
 * live, and its move and delete buttons; the form under it while the row is
 * open. */
function ruleRow(o: {
  key: string;
  icon: UiIconName;
  summary: TemplateResult | string;
  title: string;
  flag?: { on: boolean; title: string };
  ignored?: boolean;
  acts: TemplateResult;
  body: () => TemplateResult;
}): TemplateResult {
  const open = openRows.has(o.key);
  const toggle = (node: EventTarget | null) => {
    if (open) openRows.delete(o.key); else openRows.add(o.key);
    requestRerender(node);
  };
  return html`<div class="rcard ${open ? "open" : ""}">
    <div class="rrow" role="button" tabindex="0" aria-expanded=${open ? "true" : "false"} title=${open ? "Click to close" : `${o.title}. Click to edit.`}
      @click=${(e: Event) => { if (!onControl(e)) toggle(e.currentTarget); }}
      @keydown=${(e: KeyboardEvent) => { if ((e.key === "Enter" || e.key === " ") && !onControl(e)) { e.preventDefault(); toggle(e.currentTarget); } }}>
      <span class="ric">${uiIcon(o.icon)}</span>
      <span class="rsum ${o.ignored ? "ignored" : ""}">${o.summary}</span>
      ${o.flag === undefined ? nothing : html`<span class="row-flag ${o.flag.on ? "" : "off"}" title=${o.flag.title}>${o.flag.on ? "●" : "○"}</span>`}
      <span class="rchev">${uiIcon("chevron")}</span>
      <span class="racts">${o.acts}</span>
    </div>
    ${open ? html`<div class="rbody">${o.body()}</div>` : nothing}
  </div>`;
}

/** The Move up, Move down and Delete buttons of a row or a heading, always
 * in view. */
function orderButtons(i: number, count: number, move: (to: number) => void, remove: () => void, what: string): TemplateResult {
  return html`
    <button type="button" class="icon" title="Move up" ?disabled=${i === 0} @click=${() => move(i - 1)}>${uiIcon("up")}</button>
    <button type="button" class="icon" title="Move down" ?disabled=${i === count - 1} @click=${() => move(i + 1)}>${uiIcon("down")}</button>
    <button type="button" class="icon danger" title=${`Delete ${what}`} @click=${remove}>${uiIcon("delete")}</button>`;
}

/** A section heading of the Advanced editor: "Case 1", "Then", "Otherwise". */
function ruleHeading(text: string, o: { sub?: boolean; note?: TemplateResult | typeof nothing; right?: TemplateResult | typeof nothing } = {}): TemplateResult {
  return html`<div class="rsect ${o.sub ? "sub" : ""}">
    <h5>${text}${o.note ?? nothing}</h5>
    <span class="spacer"></span>
    ${o.right ?? nothing}
  </div>`;
}

/**
 * One rule: Preview, then each case, then Otherwise. A rule is only titled
 * when there is more than one.
 */
function ruleEditor(host: EditorHost, rule: Rule, ri: number, count: number, target: RuleTarget, upd: (m: (rules: Rule[]) => void, k?: string) => void, key: string, parts?: readonly TextPart[], seed?: Value): TemplateResult {
  const live = host.liveBranch(rule);
  const current = host.forced.get(rule.id) ?? "live";
  const isActive = (v: string) => (current === "live" ? v === "live" : current === "otherwise" ? v === "otherwise" : current.caseId === v);
  const updRule = (m: (r: Rule) => void, k?: string) => upd((rs) => { const r = rs.find((x) => x.id === rule.id); if (r) m(r); }, k);
  const forPart = parts !== undefined && rule.partId !== undefined;
  const otherwiseLive = live === "otherwise";
  return html`<div class="rule">
    ${ruleHeading(count < 2 ? "Rule" : `Rule ${ri + 1}`, { right: html`<span class="racts">
      ${orderButtons(ri, count, (to) => upd((rs) => moveItem(rs, ri, to)), () => upd((rs) => { const i = rs.findIndex((x) => x.id === rule.id); if (i >= 0) rs.splice(i, 1); }), "this rule")}
    </span>` })}
    ${parts === undefined ? nothing : partTargetField(parts, rule.partId, describeContext(host), (id) => updRule((r) => {
      if (id) r.partId = id; else delete r.partId;
    }))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${isActive("live") ? "active" : ""} @click=${() => host.setForced(rule.id, "live")}>Live</button>
        ${rule.cases.map((c, i) => html`<button class="${isActive(c.id) ? "active" : ""} ${live === c.id ? "live-match" : ""}" @click=${() => host.setForced(rule.id, { caseId: c.id })}>Case ${i + 1}</button>`)}
        ${rule.otherwise ? html`<button class="${isActive("otherwise") ? "active" : ""} ${otherwiseLive ? "live-match" : ""}" @click=${() => host.setForced(rule.id, "otherwise")}>Otherwise</button>` : nothing}
      </div>
    </div>
    ${rule.cases.map((c, ci) => caseEditor(host, c, ci, rule, target, updRule, `${key}-${c.id}`, forPart, seed))}
    ${rule.otherwise === undefined ? nothing : html`<div class="case otherwise ${otherwiseLive ? "match" : ""}">
      ${ruleHeading("Otherwise", {
        note: otherwiseLive ? html` <span class="rnote">· active now</span>` : nothing,
        right: html`<span class="racts"><button type="button" class="icon danger" title="Delete Otherwise" @click=${() => updRule((r) => { delete r.otherwise; })}>${uiIcon("delete")}</button></span>`,
      })}
      <div class="rpart then">
        <div class="rlabel">When no case matches</div>
        ${changeRows(host, rule.otherwise, target, (m, k) => updRule((r) => { if (r.otherwise) m(r.otherwise); }, k), `${key}-otherwise`, forPart)}
      </div>
    </div>`}
    <div class="radd">
      <button class="small pill" title="Add a case: when its tests hold, this rule makes these changes" @click=${() => updRule((r) => { r.cases.push(seededCase(host, seed)); })}>${uiIcon("plus")}<span>Add a case</span></button>
      ${rule.otherwise === undefined && rule.cases.length > 0
        ? html`<button class="small pill" title="Add Otherwise at the bottom: the changes when no case matches" @click=${() => updRule((r) => { r.otherwise = []; })}>${uiIcon("plus")}<span>Add otherwise</span></button>`
        : nothing}
    </div>
  </div>`;
}

/**
 * One case: a heading, its tests as rows, then a Then heading and its changes
 * as rows. The All or Any choice sits in the heading and is only shown once
 * there are two tests to join, because with one it changes nothing.
 */
function caseEditor(host: EditorHost, c: RuleCase, ci: number, rule: Rule, target: RuleTarget, updRule: (m: (r: Rule) => void, k?: string) => void, key: string, forPart = false, seed?: Value): TemplateResult {
  const updCase = (m: (c: RuleCase) => void, k?: string) => updRule((r) => { const x = r.cases.find((y) => y.id === c.id); if (x) m(x); }, k);
  const matches = host.liveBranch(rule) === c.id;
  const presetsId = popoverId(`${key}-presets`);
  const tests = c.when.tests;
  return html`<div class="case ${matches ? "match" : ""}">
    ${ruleHeading(`Case ${ci + 1}`, {
      note: matches ? html` <span class="rnote">· active now</span>` : nothing,
      right: html`
        ${tests.length < 2 ? nothing : html`<div class="seg join" role="radiogroup" aria-label="How the tests combine">
          ${([["all", "All of these"], ["any", "Any of these"]] as const).map(([v, label]) => html`<button type="button" role="radio" aria-checked=${c.when.join === v ? "true" : "false"}
            class=${c.when.join === v ? "on" : ""} @click=${() => updCase((x) => { x.when.join = v; })}>${label}</button>`)}
        </div>`}
        <span class="racts">
          ${orderButtons(ci, rule.cases.length, (to) => updRule((r) => moveItem(r.cases, ci, to)), () => updRule((r) => { const i = r.cases.findIndex((y) => y.id === c.id); if (i >= 0) r.cases.splice(i, 1); }), "this case")}
        </span>`,
    })}
    <div class="rpart if">
    <div class="rlabel">If</div>
    ${tests.length === 0 ? html`<div class="rempty">No tests yet, so this case always matches.</div>` : nothing}
    ${tests.map((t, ti) => testEditor(host, t, ti, tests.length,
      (m) => updCase((x) => { const y = x.when.tests.find((z) => z.id === t.id); if (y) m(y); }),
      (to) => updCase((x) => moveItem(x.when.tests, ti, to)),
      () => updCase((x) => { x.when.tests = x.when.tests.filter((z) => z.id !== t.id); }),
      `${key}-${t.id}`))}
    <div class="radd">
      <button class="small pill" title="Add a test: one more thing this case checks" @click=${(e: Event) => {
        const t = seededTest(host, seed);
        openRows.add(`${key}-${t.id}`);
        requestRerender(e.target);
        updCase((x) => { x.when.tests.push(t); });
      }}>${uiIcon("plus")}<span>Add a test</span></button>
      <button type="button" class="small pill" popovertarget=${presetsId} aria-haspopup="menu" title="Add a ready-made test: the sun, the weekday or a clock window">${uiIcon("plus")}<span>Add a preset</span></button>
      <div class="tap-menu" id=${presetsId} popover role="menu" aria-label="Add a preset" @toggle=${onValuePopoverToggle}>
        <div class="tap-menu-group" role="group" aria-label="Presets" data-group="presets">
          ${RULE_PRESETS.map((p) => html`<button type="button" role="menuitem" popovertarget=${presetsId} popovertargetaction="hide"
            @click=${() => { const added = rulePresetTests(p.kind, sunRef(host.hass?.states)); updCase((x) => { x.when.tests.push(...added); }); }}>
            <span class="tap-menu-name">${p.label}</span>
            <span class="tap-menu-info">${p.hint}</span>
          </button>`)}
        </div>
      </div>
    </div>
    </div>
    <div class="rpart then">
      <div class="rlabel">Then</div>
      ${changeRows(host, c.then, target, (m, k) => updCase((x) => m(x.then), k), `${key}-then`, forPart)}
    </div>
  </div>`;
}

/** The comparison menu of the Advanced editor: the table's groups, then the
 * three a table row cannot show. */
const MORE_COMPARISONS: ComparisonKind[] = ["timeBetween", "matchesRegex", "isOneOf"];

/** A test in one sentence, the way its row reads it: "Kitchen light is on",
 * "Temperature is less than 20", "Data is stale". */
function testSentence(host: EditorHost, t: import("./model.js").Test): string {
  const c = t.comparison;
  if (c.kind === "isStale") return "Data is stale";
  const describe = (v: Value) => describeValue(v, describeContext(host));
  const subject = describe(t.value);
  const rest = whenText(c, describe);
  return `${subject === "" ? "(empty)" : subject} ${isNumericComparison(c.kind) || c.kind === "timeBetween" ? `is ${rest}` : rest}`;
}

/**
 * One test as a row: its sentence, a dot while it holds, and the form under
 * it while it is open: the value, the comparison, and what it is compared
 * with.
 */
function testEditor(
  host: EditorHost,
  t: import("./model.js").Test,
  ti: number,
  count: number,
  updTest: (m: (t: import("./model.js").Test) => void, k?: string) => void,
  move: (to: number) => void,
  remove: () => void,
  key: string,
): TemplateResult {
  const upd = (m: (t: import("./model.js").Test) => void, k?: string) => updTest(m, k ? `${key}-${k}` : undefined);
  const c = t.comparison;
  const result = host.evaluateTest(t);
  const body = () => {
    const operand = comparisonOperand(c.kind);
    const numeric = isNumericComparison(c.kind);
    const rhsOpts = { showResolved: true, noFormat: true, noShare: true };
    let extra: TemplateResult | typeof nothing = nothing;
    switch (operand) {
      case "value":
        extra = valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { ...rhsOpts, label: "Compare with", key: `${key}-rhs` });
        break;
      case "between":
        extra = html`${valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { ...rhsOpts, label: "From", key: `${key}-rhs` })}
          ${valueEditor(host, c.upper ?? literal(""), (v) => upd((x) => { x.comparison.upper = v; }, "upper"), { ...rhsOpts, label: "To", key: `${key}-upper` })}`;
        break;
      case "pattern":
        extra = html`${textField("Pattern", c.pattern ?? "", (v) => upd((x) => { x.comparison.pattern = v; }, "pattern"), { mono: true, placeholder: "^on$" })}
          ${c.pattern && !regexOk(c.pattern) ? html`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>` : nothing}`;
        break;
      case "times":
        extra = html`<div class="row-inline">
            ${clockOperand(host, "From", c.value ?? literal("22:00"), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), `${key}-rhs`)}
            ${clockOperand(host, "To", c.upper ?? literal("06:00"), (v) => upd((x) => { x.comparison.upper = v; }, "upper"), `${key}-upper`)}
          </div>
          <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;
        break;
      case "options":
        extra = isWeekdayValue(t.value)
          ? weekdayRow(c.options ?? [], (days) => upd((x) => { x.comparison.options = weekdayOptions(days); }, "options"))
          : textField("Options (comma separated)", (c.options ?? []).join(", "), (v) => upd((x) => { x.comparison.options = v.split(",").map((s) => s.trim()).filter(Boolean); }, "options"));
        break;
      case "none":
        if (c.kind === "isStale") extra = html`<div class="hint">True when the watch's cached values are older than the staleness limit. The value is not read.</div>`;
        break;
    }
    const groups = [...comparisonGroups(numeric), { label: "More", kinds: MORE_COMPARISONS }];
    return html`
      ${valueEditor(host, t.value, (v) => upd((x) => { x.value = v; }, "lhs"), { showResolved: true, label: "Value", key: `${key}-lhs` })}
      <div class="field"><span>Check</span>
        <select title="How this test is decided" @change=${onInput((v) => upd((x) => { x.comparison = switchComparison(x.comparison, v as ComparisonKind); }))}>
          ${groups.map((g) => html`<optgroup label=${g.label}>
            ${g.kinds.map((k) => html`<option value=${k} ?selected=${k === c.kind}>${tableComparisonLabel(k)}</option>`)}
          </optgroup>`)}
        </select>
      </div>
      ${extra}`;
  };
  return ruleRow({
    key,
    icon: "states",
    summary: testSentence(host, t),
    title: "Test",
    flag: { on: result, title: result ? "True right now" : "False right now" },
    acts: orderButtons(ti, count, move, remove, "this test"),
    body,
  });
}

function regexOk(pattern: string): boolean {
  try { new RegExp(pattern); return true; } catch { return false; }
}

/**
 * One end of a `timeBetween` window.
 *
 * A literal gets the browser's own time control, which is already zero-padded
 * `HH:MM` and already knows what a clock looks like. Anything else (an entity
 * or a template, only reachable from a hand-written document) keeps the full
 * value editor rather than being silently flattened to a time.
 */
function clockOperand(host: EditorHost, label: string, v: Value, set: (v: Value) => void, key: string): TemplateResult {
  if (v.kind.kind !== "literal") {
    return valueEditor(host, v, set, { showResolved: true, label, key });
  }
  const stored = v.kind.value;
  const shown = clockTime(stored) ?? "";
  return html`<label class="field"><span>${label}</span>
    <input type="time" .value=${shown}
      @input=${onInput((val) => set({ ...v, kind: { kind: "literal", value: val } }))} />
    ${stored !== "" && shown === "" ? html`<div class="hint warn">"${stored}" is not a 24-hour HH:MM time. The test stays false until it is.</div>` : nothing}</label>`;
}

/** True when a test reads the weekday, which is what turns its options list
 * into a row of days instead of a comma-separated list of numbers. */
function isWeekdayValue(v: Value): boolean {
  return v.kind.kind === "time" && v.kind.timeField === "weekday";
}

/** Mon..Sun as checkboxes over Jinja's 0..6. The stored options are those
 * numbers, which read as nothing in a text box. */
function weekdayRow(options: string[], set: (days: number[]) => void): TemplateResult {
  const days = weekdayNumbers(options);
  const toggle = (d: number) => set(days.includes(d) ? days.filter((x) => x !== d) : [...days, d]);
  return html`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${WEEKDAY_LABELS.map((name, d) => html`<button type="button" role="checkbox" aria-checked=${days.includes(d) ? "true" : "false"}
        class=${days.includes(d) ? "on" : ""} @click=${() => toggle(d)}>${name}</button>`)}
    </div></div>`;
}

/**
 * A case's changes as rows, one per change, and a pill that adds one more
 * from a menu of the settings this layer can change. A change the layer will
 * not draw (aimed at a part that ignores it, or a kind this layer has no use
 * for) keeps its row, struck through, rather than vanishing with its value.
 */
function changeRows(host: EditorHost, changes: StyleChange[], target: RuleTarget, updList: (m: (list: StyleChange[]) => void, k?: string) => void, key: string, forPart = false): TemplateResult {
  const allowed = changeKindsFor(target, forPart);
  const set = changes.map((ch) => STYLE_PROPERTY[ch.kind]);
  const spare = COLUMN_ORDER.filter((p) => !set.includes(p) && allowed.includes(PROPERTY_CHANGE_KIND[p]));
  const menuId = popoverId(`${key}-add`);
  const add = (p: StyleProperty, node: EventTarget | null) => {
    openRows.add(`${key}-${changes.length}`);
    requestRerender(node);
    updList((list) => { list.push(newStyleChange(PROPERTY_CHANGE_KIND[p])); });
  };
  return html`
    ${changes.length === 0 ? html`<div class="rempty">No change yet.</div>` : nothing}
    ${changes.map((ch, i) => {
      const property = STYLE_PROPERTY[ch.kind];
      const ignored = !RULE_TARGET_PROPERTIES[target].includes(property) || (forPart && !PART_RULE_PROPERTIES.includes(property));
      const upd = (m: (c: StyleChange) => void, k?: string) => updList((list) => { if (list[i]) m(list[i]!); }, k ? `${i}-${k}` : undefined);
      return ruleRow({
        key: `${key}-${i}`,
        icon: "look",
        summary: cellSummary(host, ch, property),
        title: PROPERTY_LABELS[property],
        ignored,
        acts: orderButtons(i, changes.length, (to) => updList((list) => moveItem(list, i, to)), () => updList((list) => { list.splice(i, 1); }), "this change"),
        body: () => html`
          ${ignored ? html`<div class="hint warn">This layer does not draw this setting here, so the change does nothing.</div>` : nothing}
          ${property === "visibility"
            ? segField("This state", ch.kind === "hide" ? "hide" : "show", [["show", "Shown"], ["hide", "Hidden"]], (v) => upd((c) => { c.kind = v as StyleChangeKind; }))
            : changeBody(host, ch, upd, `${key}-${i}`)}`,
      });
    })}
    ${spare.length === 0 ? nothing : html`<div class="radd">
      <button type="button" class="small pill" popovertarget=${menuId} aria-haspopup="menu" title="Add a change: one more setting this case changes">${uiIcon("plus")}<span>Add a change</span></button>
      <div class="chip-menu" id=${menuId} popover role="menu" aria-label="Add a change" @toggle=${onValuePopoverToggle}>
        ${spare.map((p) => html`<button type="button" role="menuitem" popovertarget=${menuId} popovertargetaction="hide"
          @click=${(e: Event) => add(p, e.target)}>${PROPERTY_LABELS[p]}</button>`)}
      </div>
    </div>`}`;
}

const COLOR_KINDS: StyleChangeKind[] = ["setColor", "setBorderColor", "setBackgroundColor"];

/** The controls behind one style change: a color, a symbol, a value, a number
 * or a weight. Shared by the Advanced editor's change box and by a states
 * table cell, so the two can never offer different things. */
function changeBody(host: EditorHost, ch: StyleChange, upd: (m: (c: StyleChange) => void, k?: string) => void, key: string): TemplateResult | typeof nothing {
  const payload = styleChangePayload(ch.kind);
  let body: TemplateResult | typeof nothing = nothing;
  if (payload === "value") {
    const v = ch.value ?? literal("");
    if (COLOR_KINDS.includes(ch.kind)) {
      const fixed = v.kind.kind === "literal";
      body = html`${fixed
        ? colorField("Color", v.kind.kind === "literal" ? v.kind.value : "", (hex) => upd((c) => { c.value = literal(hex ?? "#FFFFFF"); }, "color"))
        : valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: true, showResolved: true, label: "Color from", key: `${key}-value` })}
        <button class="link" @click=${() => upd((c) => { c.value = fixed ? { kind: { kind: "entityAttribute", entityId: "", displayName: "", domain: "", attribute: "rgb_color" } } : literal("#FFFFFF"); })}>${fixed ? "Read the color from a value instead" : "Use a fixed color instead"}</button>
        ${fixed ? nothing : html`<div class="hint">The value must resolve to a hex color such as <code>#FF9F0A</code>. Empty or invalid results leave the color unchanged.</div>`}`;
    } else {
      body = valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: ch.kind === "setIcon", symbol: ch.kind === "setIcon", showResolved: true, label: ch.kind === "setIcon" ? "Symbol" : "To", key: `${key}-value` });
    }
  } else if (payload === "number") {
    const opts = ch.kind === "setOpacity" ? { step: 0.05, min: 0, max: 1 }
      : ch.kind === "setRotation" ? { step: 1, unit: "°" }
      : ch.kind === "setFontSize" || ch.kind === "setBorderWidth" ? { step: 0.5, min: 0, unit: "pt" }
      : { step: 0.5, min: 0 };
    const label = ch.kind === "setOpacity" ? "Opacity (0 to 1)"
      : ch.kind === "setRotation" ? "Angle"
      : ch.kind === "setFontSize" ? "Size"
      : ch.kind === "setBorderWidth" ? "Width"
      : "Value";
    body = numberField(label, ch.number ?? 0, (n) => upd((c) => { c.number = n ?? 0; }, "number"), opts);
  } else if (payload === "weight") {
    body = segField("Weight", ch.weight ?? "regular", FONT_WEIGHTS, (w) => upd((c) => { c.weight = w; }));
  } else if (payload === "design") {
    body = html`${segField("Typeface", ch.design ?? "default", FONT_DESIGNS, (d) => upd((c) => { c.design = d; }))}
      ${FONT_DESIGN_HINT}`;
  } else if (payload === "width") {
    body = html`${segField("Width", ch.width ?? "standard", FONT_WIDTHS, (w) => upd((c) => { c.width = w; }))}
      ${FONT_WIDTH_HINT}`;
  } else if (payload === "italic") {
    body = checkField("Italic", ch.italic !== false, (v) => upd((c) => { c.italic = v; }));
  }
  return body;
}

// ── States table ──────────────────────────────────────────────────────────
// A two-state light is two rows and nothing else. The table is a view of one
// ordinary rule (see states.ts): rows are cases, columns are the properties a
// change sets, and every edit here writes the same `Rule` the Advanced editor
// would have written by hand.

/** Keys the user has sent to the Advanced editor. Transient on purpose: which
 * editor is open is not part of the document and does not belong in undo. */
const advancedRules = new Set<string>();
/** Tables where "Fill from the entity" is waiting for confirmation, because the
 * fill replaces rows that are already there. */
const pendingStatesFill = new Set<string>();
/** What the header chip says before the first row exists. A table with no rows
 * has nowhere to store the value being tested, and inventing an empty rule to
 * hold it would put a rule on the watch that does nothing. */
const pendingTestValues = new Map<string, Value>();

/**
 * The States section of a layer: the states table when the rules are one,
 * today's `rulesEditor` when they are not.
 *
 * `defaultValue` is what a brand-new table tests, which the panel fills in
 * from the layer's own entity: a light layer already knows it is about the
 * light, and asking again would be the duplication this whole slice removes.
 *
 * `parts` is a rich text layer's parts: with them, each rule says whether it
 * changes the whole text or one part.
 */
/** Whether a layer's color already follows its value through a band table
 * (a chart's, a gauge's or a text's "By value"). The resolver lets that band
 * win over a Color rule, so a States table on such a layer has no Color
 * column to offer: setting one would draw nothing. */
export function colorsByValue(el: CElement): boolean {
  const p = el.payload as { coloring?: string; bands?: unknown[] };
  return p.coloring === "bands" && (p.bands?.length ?? 0) > 0;
}

export interface StatesEditorOptions {
  /** The layer's color follows its own band table, so Color is not offered
   * as a column and one already in the table is flagged as drawing nothing. */
  colorByValue?: boolean;
}

export function statesEditor(
  host: EditorHost,
  rules: Rule[],
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
  parts?: readonly TextPart[],
  options: StatesEditorOptions = {},
): TemplateResult {
  const shape = tableShape(rules);
  const advanced = !shape.ok || advancedRules.has(key);
  if (advanced) {
    // What a new test reads: whatever the first test reads, else the header
    // chip's pending choice, else the layer's own entity.
    const seed = rules[0]?.cases[0]?.when.tests[0]?.value ?? pendingTestValues.get(key) ?? defaultValue;
    return html`
      ${editorSwitch(key, "advanced", shape)}
      ${rulesEditor(host, rules, target, locate, key, parts, seed)}`;
  }
  return statesTable(host, shape.table, rules[0], target, locate, key, defaultValue, parts, options);
}

/** The switch at the top of the States card that picks the editor: Simple,
 * or Advanced for several rules, several tests per state, or a regular
 * expression. Simple is greyed out, with the reason, while the rules are
 * past what it can show. */
function editorSwitch(key: string, current: "table" | "advanced", shape: TableShape): TemplateResult {
  return html`<div class="editor-switch">
    ${segButtons("Editor", current, [["table", "Simple"], ["advanced", "Advanced"]], (v, node) => {
      if (v === "advanced") advancedRules.add(key); else advancedRules.delete(key);
      requestRerender(node);
    }, {
      disabled: { table: !shape.ok },
      titles: { table: shape.ok ? "One value, one test per state" : "These rules are past what the simple editor can show", advanced: "Several rules, several tests per state, or a regular expression" },
    })}
    ${shape.ok ? nothing : html`<div class="hint">${shape.reason}</div>`}
  </div>`;
}

/** What a states table works out before it draws, and what a new row is made
 * from. Shared by the table's own Add a state and the States card's header
 * button, so the two add the same row. */
interface StatesPlan {
  tested: Value | undefined;
  /** What the tested value reads right now. */
  resolved: string | undefined;
  /** No rows yet: the next Add a state fills the table with its first rows
   * (`startStates`) instead of adding one. */
  fresh: boolean;
  /** The rows a fresh table starts with. */
  shape: FreshShape;
  numberMode: boolean;
  colorByValue: boolean;
  /** The settings this layer lets a state change. */
  allowed: readonly StyleProperty[];
  /** The settings a row's "+ Change" offers: `allowed`, less what a part
   * ignores and less Color while the layer colors by value. */
  offered: StyleProperty[];
  colorIgnored: boolean;
  partId: string | undefined;
  forPart: boolean;
  seedColor: boolean;
}

function statesPlan(
  host: EditorHost,
  table: StatesTable,
  rule: Rule | undefined,
  target: RuleTarget,
  key: string,
  defaultValue?: Value,
  parts?: readonly TextPart[],
  options: StatesEditorOptions = {},
): StatesPlan {
  // What a new row tests: whatever the rows already test, else the header
  // chip's pending choice, else the layer's own entity.
  const tested = table.value ?? pendingTestValues.get(key) ?? defaultValue;
  const resolved = tested === undefined ? undefined : host.resolve(tested);
  // An empty table guesses from the value itself: a light gets on/off rows, a
  // thermometer gets bands. The live reading settles the cases a domain name
  // cannot, such as a sensor that reports words.
  const fresh = table.rows.length === 0 && table.otherwise === undefined;
  const shape = freshShape(tested, resolved);
  const numberMode = table.numberMode || (fresh && tested !== undefined && shape === "bands");

  // A layer whose color follows its own bands reads no Color rule, so Color
  // is not offered, and a row that already sets it is flagged.
  const colorByValue = options.colorByValue === true;
  const allowed = RULE_TARGET_PROPERTIES[target];
  const colorIgnored = colorByValue && table.columns.includes("color");

  // On a rich text layer the states can aim at one part. A part reads only
  // some settings, so only those are offered; a change already in the table
  // stays in view with a hint rather than disappearing with its value.
  const pendingPart = pendingPartTargets.get(key);
  const partId = rule ? rule.partId : parts?.some((p) => p.id === pendingPart) ? pendingPart : undefined;
  const forPart = parts !== undefined && partId !== undefined;
  const offered = (forPart ? allowed.filter((p) => PART_RULE_PROPERTIES.includes(p)) : [...allowed])
    .filter((p) => !(colorByValue && p === "color"));
  // A new row starts with a color when the table already sets colors, or
  // when color is what this kind of layer's first state usually changes, so
  // the first thing on screen is a working rule rather than a row of nothing.
  const defaultColumn = DEFAULT_COLUMN[target] === "color" && colorByValue ? "visibility" : DEFAULT_COLUMN[target];
  const seedColor = !colorIgnored && offered.includes("color")
    && (table.columns.includes("color") || (table.columns.length === 0 && defaultColumn === "color"));
  return { tested, resolved, fresh, shape, numberMode, colorByValue, allowed, offered, colorIgnored, partId, forPart, seedColor };
}

/** What Add a state writes: the table's first rows when it is empty, else one
 * new row under the last, both the way the table's own button writes them. */
function addPlannedRow(rs: Rule[], plan: Pick<StatesPlan, "tested" | "resolved" | "fresh" | "shape" | "numberMode" | "seedColor" | "partId">): void {
  const value = plan.tested ?? literal("");
  if (plan.fresh && plan.tested !== undefined) startStates(rs, value, plan.shape, plan.resolved, plan.seedColor);
  else addStateRow(rs, value, plan.numberMode, plan.seedColor);
  if (plan.partId !== undefined && rs[0] && rs[0].partId === undefined) rs[0].partId = plan.partId;
}

/**
 * The "Add" in a folded States card's header: it opens the card and adds a
 * state, the same row the table's own Add a state makes. Nothing when the
 * rules are past what a table can show, since there is no table to add a row
 * to; the card then opens on its Advanced editor as it did before.
 */
export function statesAddAction(
  host: EditorHost,
  rules: Rule[],
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
  parts?: readonly TextPart[],
  options: StatesEditorOptions = {},
): { action?: NonNullable<CardOptions["action"]> } {
  const shape = tableShape(rules);
  if (!shape.ok || advancedRules.has(key)) return {};
  const plan = statesPlan(host, shape.table, rules[0], target, key, defaultValue, parts, options);
  return {
    action: {
      label: "Add",
      title: `Add a state: when the value matches, this ${target === "layout" ? "shape" : "layer"} changes how it looks`,
      run: () => {
        pendingPartTargets.delete(key);
        host.update((c) => { const rs = locate(c); if (rs) addPlannedRow(rs, plan); });
      },
    },
  };
}

function statesTable(
  host: EditorHost,
  table: StatesTable,
  rule: Rule | undefined,
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
  parts?: readonly TextPart[],
  options: StatesEditorOptions = {},
): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) =>
    host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);

  const plan = statesPlan(host, table, rule, target, key, defaultValue, parts, options);
  const { tested, resolved, fresh, shape, numberMode, offered, colorIgnored, partId, forPart, seedColor } = plan;
  const partIgnores = forPart ? table.columns.filter((p) => !PART_RULE_PROPERTIES.includes(p)) : [];
  const setPart = (id: string, node: EventTarget | null) => {
    if (!rule) {
      if (id) pendingPartTargets.set(key, id); else pendingPartTargets.delete(key);
      requestRerender(node);
      return;
    }
    upd((rs) => {
      const r = rs[0];
      if (!r) return;
      if (id) r.partId = id; else delete r.partId;
    });
  };

  const live = rule ? host.liveBranch(rule) : "none";
  const forced = rule ? host.forced.get(rule.id) ?? "live" : "live";
  const isForced = (branch: string) => forced !== "live" && (forced === "otherwise" ? branch === "otherwise" : forced.caseId === branch);
  const force = (branch: string) => {
    if (!rule) return;
    host.setForced(rule.id, isForced(branch) ? "live" : branch === "otherwise" ? "otherwise" : { caseId: branch });
  };

  const setTested = (v: Value) => {
    pendingTestValues.set(key, v);
    if (table.rows.length === 0) return;
    upd((rs) => setTestedValue(rs, v), "lhs");
  };

  const addRow = () => {
    pendingPartTargets.delete(key);
    upd((rs) => addPlannedRow(rs, plan));
  };

  const rowOptions = { offered, colorIgnored, forPart };
  const rows = table.rows.map((row, i) => statesRow(host, {
    ...rowOptions,
    key: `${key}-${row.caseId}`,
    label: whenText(row.comparison, (v) => describeValue(v, describeContext(host))),
    changes: row.changes,
    live: live === row.caseId,
    forced: isForced(row.caseId),
    onForce: () => force(row.caseId),
    // Coalescing keys carry the row and the setting, so typing in one chip is
    // one undo step and typing in the next one is another.
    when: whenCell(host, row.comparison, numberMode, `${key}-${row.caseId}`, (m, k) => upd((rs) => {
      const t = rs[0]?.cases.find((c) => c.id === row.caseId)?.when.tests[0];
      if (t) m(t.comparison);
    }, k && `${row.caseId}-${k}`)),
    updChanges: (m, k) => upd((rs) => {
      const c = rs[0]?.cases.find((x) => x.id === row.caseId);
      if (c) m(c.then);
    }, k && `${row.caseId}-${k}`),
    acts: html`
      <button class="icon" title="Move up" ?disabled=${i === 0} @click=${() => upd((rs) => moveStateRow(rs, i, i - 1))}>${uiIcon("up")}</button>
      <button class="icon" title="Move down" ?disabled=${i === table.rows.length - 1} @click=${() => upd((rs) => moveStateRow(rs, i, i + 1))}>${uiIcon("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${() => upd((rs) => removeStateRow(rs, row.caseId))}>${uiIcon("delete")}</button>`,
  }));

  const otherwiseRow = table.otherwise === undefined ? nothing : statesRow(host, {
    ...rowOptions,
    key: `${key}-otherwise`,
    label: OTHERWISE_LABEL,
    changes: table.otherwise,
    live: live === "otherwise",
    forced: isForced("otherwise"),
    onForce: () => force("otherwise"),
    when: html`<span class="when-otherwise">${OTHERWISE_LABEL}</span>`,
    updChanges: (m, k) => upd((rs) => { const o = rs[0]?.otherwise; if (o) m(o); }, k),
    acts: html`<button class="icon" title=${`Remove the ${OTHERWISE_LABEL} row`} @click=${() => upd((rs) => setOtherwise(rs, false))}>${uiIcon("close")}</button>`,
  });

  // The bar over a number table: one piece per band, in the color of the row
  // that paints it, with a mark where the reading is now. Clicking a piece
  // holds the previews on its row, like clicking the row.
  const bar = !numberMode || table.rows.length === 0 ? nothing
    : statesBandBar(host, table, resolved, (row) => force(row === "otherwise" ? "otherwise" : table.rows[row]!.caseId));

  // Fill from the entity: one row per state the domain is known to report, with
  // an icon and a color (`states-seeds.ts`). Only the cells this kind of layer
  // reads are written, so a shape gets colors and no icons.
  const seedEntity = seedEntityOf(tested);
  const seedCells = { icon: offered.includes("icon"), color: offered.includes("color") };
  const seeds = seedEntity && (seedCells.icon || seedCells.color)
    ? seedStates(seedEntity.domain, deviceClassOf(host, seedEntity.entityId))
    : [];
  const hasRows = table.rows.length > 0 || table.otherwise !== undefined;
  const fill = () => {
    pendingStatesFill.delete(key);
    pendingPartTargets.delete(key);
    upd((rs) => {
      const rule = buildStatesRule(tested ?? literal(""), seedStatesRows(seeds, seedCells), undefined, rs[0]?.id);
      if (partId !== undefined) rule.partId = partId;
      rs.length = 0;
      rs.push(rule);
    }, "fill");
  };

  return html`
    <div class="states">
      ${editorSwitch(key, "table", { ok: true, table })}
      ${valueEditor(host, tested ?? literal(""), setTested, { label: "Testing", showResolved: true, key: `${key}-lhs` })}
      ${tested === undefined ? html`<div class="hint keep">Choose what these states look at.</div>` : nothing}
      ${parts === undefined ? nothing : partTargetField(parts, partId, describeContext(host), setPart)}
      ${bar}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            <th>Then</th>
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          ${otherwiseRow}
          ${fresh ? html`<tr><td class="empty-row" colspan="3">${statesEmptyText(target)}${tested === undefined ? nothing : html` ${startText(shape, resolved)}`}</td></tr>` : nothing}
        </tbody>
      </table></div>
      ${partIgnores.length === 0 ? nothing : html`<div class="hint warn">A part ignores ${joinWords(partIgnores.map((p) => PROPERTY_LABELS[p]))}. Pick Whole text to use ${partIgnores.length === 1 ? "it" : "them"}.</div>`}
      ${!colorIgnored ? nothing : html`<div class="hint warn">Color is set by value above, so a Color change here draws nothing. Switch Color to One color to use it, or remove the change.</div>`}
      ${!pendingStatesFill.has(key) ? nothing : html`<div class="hint warn confirm-row">
        Fill from the entity? The ${table.rows.length} state${table.rows.length === 1 ? "" : "s"} in this table ${table.rows.length === 1 ? "is" : "are"} replaced by one row per state a ${seedEntity?.domain.replace(/_/g, " ")} reports.
        <button class="danger small" @click=${(e: Event) => { requestRerender(e.target); fill(); }}>Fill</button>
        <button class="small" @click=${(e: Event) => { pendingStatesFill.delete(key); requestRerender(e.target); }}>Cancel</button>
      </div>`}
      <div class="states-add ${fresh ? "centered" : ""}">
        <button class="small pill" title=${fresh
          ? `Start the states: ${startText(shape, resolved).replace(/^Add a state starts with /, "").replace(/\.$/, "")}`
          : `Add a row: when the value matches, this ${target === "layout" ? "shape" : "layer"} changes how it looks`} @click=${addRow}>${uiIcon("plus")}<span>Add a state</span></button>
        ${seeds.length === 0 ? nothing : html`<button class="small pill" title=${`Write one row per state a ${seedEntity!.domain.replace(/_/g, " ")} reports, each with an icon and a color, ready to edit`}
          @click=${(e: Event) => {
            if (hasRows) { pendingStatesFill.add(key); requestRerender(e.target); return; }
            fill();
          }}>${uiIcon("plus")}<span>Fill from the entity</span></button>`}
        ${table.otherwise === undefined && table.rows.length > 0
          ? html`<button class="small pill" title="Add an Otherwise row at the bottom: the look when no state above matches" @click=${() => upd((rs) => setOtherwise(rs, true, seedColor))}>${uiIcon("plus")}<span>Add otherwise</span></button>`
          : nothing}
      </div>
      ${forced === "live" ? nothing : html`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${() => rule && host.setForced(rule.id, "live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${numberMode
        ? "States are checked top to bottom and the first match wins, so each band only has to say where it ends."
        : "States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
    </div>`;
}

/** The last row's name, the same word the Advanced editor and the document
 * use for it. */
const OTHERWISE_LABEL = "Otherwise";

/**
 * The bar over a number table. Every threshold the rows name is an edge, and
 * the stretch between two edges is painted in the color of the first row that
 * matches a number inside it (`bandOwners`), which is the row the watch would
 * take. A row with no fixed color paints in ink so the band is still visible;
 * a stretch no row and no last row covers stays clear. The reading now is
 * marked the way the chart's bar marks it.
 */
function statesBandBar(host: EditorHost, table: StatesTable, resolved: string | undefined, pick: (row: number | "otherwise") => void): TemplateResult | typeof nothing {
  const num = (v: Value | undefined): number | undefined => {
    if (!v) return undefined;
    const text = v.kind.kind === "literal" ? v.kind.value : host.resolve(v);
    return isNumberish(text) ? Number(text) : undefined;
  };
  const edges = tableEdges(table.rows, num);
  if (edges.length === 0) return nothing;
  const now = isNumberish(resolved) ? Number(resolved) : undefined;
  const { lo, hi } = bandScale(edges, now);
  const owners = bandOwners(table.rows, edges, lo, hi, table.otherwise !== undefined, num);
  const fillOf = (changes: StyleChange[], i: number) => {
    const color = cellChange(changes, "color");
    const hex = color?.value?.kind.kind === "literal" ? color.value.kind.value : undefined;
    if (hex && /^#[0-9a-fA-F]{6,8}$/.test(hex)) return hex;
    return `color-mix(in srgb, var(--wa-ink) ${i % 2 === 0 ? 30 : 18}%, transparent)`;
  };
  const pieces = owners.map((owner, i) => {
    const upTo = i < edges.length ? edges[i] : undefined;
    if (owner === undefined) return { ...(upTo === undefined ? {} : { upTo }), fill: "transparent" };
    const changes = owner === "otherwise" ? table.otherwise ?? [] : table.rows[owner]!.changes;
    const label = owner === "otherwise" ? OTHERWISE_LABEL : whenText(table.rows[owner]!.comparison, (v) => describeValue(v, describeContext(host)));
    return { ...(upTo === undefined ? {} : { upTo }), fill: fillOf(changes, owner === "otherwise" ? table.rows.length : owner), label, pick: () => pick(owner) };
  });
  return html`<div class="states-bar">${bandBar(pieces, now)}</div>`;
}

/** The "+ Change" at the end of a row: a small menu of the settings this row
 * does not set yet. A pick writes the setting's default and opens its form,
 * so adding a change is one click and then the value. */
function changeMenu(key: string, spare: readonly StyleProperty[], add: (p: StyleProperty, node: EventTarget | null) => void): TemplateResult {
  const id = popoverId(`${key}-add`);
  return html`
    <button type="button" class="cell add-change" popovertarget=${id} aria-haspopup="menu"
      title="Add a change: one more setting this state changes">${uiIcon("plus")}<span>Change</span></button>
    <div class="chip-menu" id=${id} popover role="menu" aria-label="Add a change" @toggle=${onValuePopoverToggle}>
      ${spare.map((p) => html`<button type="button" role="menuitem" popovertarget=${id} popovertargetaction="hide"
        @click=${(e: Event) => add(p, e.target)}>${PROPERTY_LABELS[p]}</button>`)}
    </div>`;
}

interface StatesRowOptions {
  key: string;
  label: string;
  /** The settings this row's "+ Change" can add. */
  offered: readonly StyleProperty[];
  /** A Color change here draws nothing, so its chip says so. */
  colorIgnored: boolean;
  /** The row aims at a text part, which ignores some settings. */
  forPart: boolean;
  changes: StyleChange[];
  live: boolean;
  forced: boolean;
  onForce: () => void;
  when: TemplateResult;
  updChanges: (m: (list: StyleChange[]) => void, k?: string) => void;
  acts: TemplateResult;
}

/** Whether a click landed on something that handles its own clicks, so the row
 * does not also treat it as "preview this state". */
function onControl(e: Event): boolean {
  const el = e.target as HTMLElement | null;
  return !!el?.closest?.("input, select, textarea, button, label, [popover]");
}

/**
 * One row: its When, then a chip per setting it changes and a "+ Change" for
 * one more. A row with no chips changes nothing and says so, so the table
 * never shows a grid of empty cells.
 */
function statesRow(host: EditorHost, o: StatesRowOptions): TemplateResult {
  const set = COLUMN_ORDER.filter((p) => cellChange(o.changes, p) !== undefined);
  const spare = o.offered.filter((p) => !set.includes(p));
  const add = (p: StyleProperty, node: EventTarget | null) => {
    o.updChanges((list) => { list.push(newStyleChange(PROPERTY_CHANGE_KIND[p])); });
    openPopoverSoon(node, popoverId(`${o.key}-${p}`));
  };
  return html`<tr class="state-row ${o.live ? "live" : ""} ${o.forced ? "forced" : ""}"
    title=${`${o.label}. Click to hold the previews on this state.`}
    @click=${(e: Event) => { if (!onControl(e)) o.onForce(); }}>
    <td class="when">
      <span class="row-flag" title=${o.forced ? "The previews are held on this state" : o.live ? "This state matches right now" : ""}>${o.forced ? "◉" : o.live ? "●" : ""}</span>
      ${o.when}
    </td>
    <td class="then"><span class="then-chips">
      ${set.length === 0 ? html`<span class="no-change">No change</span>` : nothing}
      ${set.map((p) => statesChip(host, p, o.changes, o.updChanges, `${o.key}-${p}`, {
        ignored: (p === "color" && o.colorIgnored) || (o.forPart && !PART_RULE_PROPERTIES.includes(p)),
      }))}
      ${spare.length === 0 ? nothing : changeMenu(o.key, spare, add)}
    </span></td>
    <td class="acts">${o.acts}</td>
  </tr>`;
}

/** One chip: a setting this state changes, with its form a click away. */
function statesChip(
  host: EditorHost,
  property: StyleProperty,
  changes: StyleChange[],
  updChanges: (m: (list: StyleChange[]) => void, k?: string) => void,
  key: string,
  o: { ignored: boolean },
): TemplateResult | typeof nothing {
  const ch = cellChange(changes, property);
  if (!ch) return nothing;
  const upd = (m: (c: StyleChange) => void, k?: string) => updChanges((list) => {
    const target = list.find((x) => STYLE_PROPERTY[x.kind] === property);
    if (target) m(target);
  }, k && `${property}-${k}`);
  const remove = () => updChanges((list) => {
    const i = list.findIndex((x) => STYLE_PROPERTY[x.kind] === property);
    if (i >= 0) list.splice(i, 1);
  });
  return changeChip(host, ch, property, popoverId(key), upd, remove, o);
}

/** The chip itself: the setting and its value, with its form in a popover
 * and a link there to remove it. Shared by a states row and a case. */
function changeChip(
  host: EditorHost,
  ch: StyleChange,
  property: StyleProperty,
  id: string,
  upd: (m: (c: StyleChange) => void, k?: string) => void,
  remove: () => void,
  o: { ignored: boolean },
): TemplateResult {
  const label = PROPERTY_LABELS[property];
  return html`
    <button type="button" class="cell filled ${o.ignored ? "ignored" : ""}" popovertarget=${id} aria-haspopup="dialog"
      title=${`${label}${o.ignored ? " (draws nothing here)" : ""}. Click to change it.`}>${cellSummary(host, ch, property)}</button>
    <div class="value-pop" id=${id} popover role="dialog" aria-label=${label} @toggle=${onValuePopoverToggle}>
      <div class="pop-head">
        <b>${label}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${id} popovertargetaction="hide">Done</button>
      </div>
      ${openedPopovers.has(id)
        ? html`${o.ignored ? html`<div class="hint warn">This layer does not draw this setting here, so the change does nothing.</div>` : nothing}
          ${property === "visibility"
            ? segField("This state", ch.kind === "hide" ? "hide" : "show", [["show", "Shown"], ["hide", "Hidden"]], (v) => upd((c) => { c.kind = v as StyleChangeKind; }))
            : changeBody(host, ch, upd, id)}
          <button class="link" @click=${(e: Event) => {
            // Closed first: removing the change takes this popover's own chip
            // out of the document, and a popover removed while open never
            // fires the toggle that tidies up after it.
            (e.target as HTMLElement).closest<HTMLElement>("[popover]")?.hidePopover();
            remove();
          }}>Remove this change</button>`
        : nothing}
    </div>`;
}

/** What a chip shows: the setting's name, then a color swatch, a symbol and
 * its name, or the value in words. Hidden and Shown say it all on their own.
 * Short enough that a row of them still reads as one line. */
function cellSummary(host: EditorHost, ch: StyleChange, property?: StyleProperty): TemplateResult {
  const name = property === undefined || property === "visibility" ? nothing : html`<span class="cell-name">${PROPERTY_LABELS[property]}</span>`;
  return html`${name}${cellValue(host, ch)}`;
}

function cellValue(host: EditorHost, ch: StyleChange): TemplateResult {
  if (ch.kind === "hide") return html`<span class="cell-word">Hidden</span>`;
  if (ch.kind === "show") return html`<span class="cell-word">Shown</span>`;
  const payload = styleChangePayload(ch.kind);
  if (payload === "number") return html`<span class="cell-word mono">${ch.number ?? 0}</span>`;
  if (payload === "weight") return html`<span class="cell-word">${FONT_WEIGHTS.find(([w]) => w === (ch.weight ?? "regular"))?.[1]}</span>`;
  if (payload === "design") return html`<span class="cell-word">${FONT_DESIGNS.find(([d]) => d === (ch.design ?? "default"))?.[1]}</span>`;
  if (payload === "width") return html`<span class="cell-word">${FONT_WIDTHS.find(([w]) => w === (ch.width ?? "standard"))?.[1]}</span>`;
  if (payload === "italic") return html`<span class="cell-word">${ch.italic === false ? "Upright" : "Italic"}</span>`;
  const v = ch.value ?? literal("");
  const fixed = v.kind.kind === "literal" ? v.kind.value : undefined;
  if (COLOR_KINDS.includes(ch.kind)) {
    return html`<span class="swatch" style=${`background:${fixed && /^#[0-9a-fA-F]{6,8}$/.test(fixed) ? fixed : "transparent"}`}></span>
      <span class="cell-word">${fixed ? colorWords(fixed) : describeValue(v, describeContext(host))}</span>`;
  }
  if (ch.kind === "setIcon" && fixed) {
    const glyph = host.icons.render(fixed, 16, "#FFFFFF");
    return html`${glyph ?? nothing}<span class="cell-word">${fixed}</span>`;
  }
  return html`<span class="cell-word">${describeValue(v, describeContext(host))}</span>`;
}

/** A hex color as something a person can read back. Names are the closest of
 * the Apple system colors the rest of the editor already offers; anything
 * else keeps its hex. */
export function colorWords(hex: string): string {
  const named: Record<string, string> = {
    "#FF453A": "red", "#FF9F0A": "orange", "#FFD60A": "amber", "#34C759": "green",
    "#30D158": "green", "#0A84FF": "blue", "#64D2FF": "cyan", "#BF5AF2": "purple",
    "#FFFFFF": "white", "#8E8E93": "grey", "#000000": "black", "#FFCC00": "amber",
    "#FF3B30": "red",
  };
  return named[hex.toUpperCase()] ?? hex;
}

/**
 * The "When" cell: a comparison and, when it needs one, its right-hand side.
 *
 * A literal right-hand side is a plain input, because that is what it is; a
 * value that reads an entity or a template shows the chip instead. The "…"
 * button beside a literal is how the first becomes the second.
 */
function whenCell(host: EditorHost, c: Comparison, numberMode: boolean, key: string, upd: (m: (c: Comparison) => void, k?: string) => void): TemplateResult {
  const operand = comparisonOperand(c.kind);
  const numeric = isNumericComparison(c.kind);
  const rhs = (v: Value, set: (v: Value) => void, k: string, placeholder: string) =>
    compactValue(host, v, set, `${key}-${k}`, numeric, placeholder, k === "rhs" ? "Compare with" : "Upper bound");
  return html`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${onInput((v) => upd((x) => {
      const next = switchComparison(x, v as ComparisonKind);
      x.kind = next.kind;
      if (next.value !== undefined) x.value = next.value; else delete x.value;
      if (next.upper !== undefined) x.upper = next.upper; else delete x.upper;
    }))}>
      ${comparisonGroups(numberMode).map((g) => html`<optgroup label=${g.label}>
        ${g.kinds.map((k) => html`<option value=${k} ?selected=${k === c.kind}>${tableComparisonLabel(k)}</option>`)}
      </optgroup>`)}
    </select>
    ${operand === "value" || operand === "between"
      ? rhs(c.value ?? literal(""), (v) => upd((x) => { x.value = v; }, "rhs"), "rhs", numeric ? "0" : "value")
      : nothing}
    ${operand === "between" ? html`<span class="when-and">to</span>${rhs(c.upper ?? literal(""), (v) => upd((x) => { x.upper = v; }, "upper"), "upper", "100")}` : nothing}
  </span>`;
}

/** The comparison dropdown's wording. Numeric kinds read the way the row will
 * read once it has a number in it, so choosing one is choosing a sentence. */
function tableComparisonLabel(kind: ComparisonKind): string {
  switch (kind) {
    case "lessThan": return "Less than";
    case "lessOrEqual": return "At most";
    case "between": return "Between";
    case "greaterOrEqual": return "At least";
    case "greaterThan": return "Greater than";
    default: {
      const label = COMPARISON_LABELS[kind];
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
  }
}

/** A right-hand side inside a row: a plain input while it is a literal, the
 * value chip once it is anything else, and one button between the two. */
function compactValue(
  host: EditorHost,
  v: Value,
  set: (v: Value) => void,
  key: string,
  numeric: boolean,
  placeholder: string,
  label: string,
): TemplateResult {
  const id = popoverId(key);
  // A comparison's other side is a number or an entity to read: no format
  // panel and no Make shared, so the form is a source and its box.
  const opts: ValueEditorOptions = { showResolved: true, label, key, noFormat: true, noShare: true };
  if (v.kind.kind !== "literal") {
    return html`<span class="rhs">
      ${valueEditor(host, v, set, { ...opts, compact: true })}
    </span>`;
  }
  const text = v.kind.value;
  return html`<span class="rhs">
    <input class="cellin ${numeric ? "num" : ""}" type=${numeric ? "number" : "text"} .value=${text} placeholder=${placeholder}
      @input=${onInput((val) => set({ ...v, kind: { kind: "literal", value: val } }))} />
    <button type="button" class="icon more" popovertarget=${id} aria-label="Compare with an entity instead" title="Compare with an entity or a template instead of a number">${uiIcon("link")}</button>
    ${valuePopover(host, id, label, v, set, opts)}
  </span>`;
}
