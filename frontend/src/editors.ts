// Inspector controls. Every function renders a form for one part of the
// draft and reports edits through `EditorHost.update`, which the panel wires
// to the Draft's undo history. Controls are plain HTML inputs styled to HA
// so the bundle stays free of HA's internal component library.

import { html, nothing, type TemplateResult } from "lit";
import {
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
  type TapAction,
  type TapElement,
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
  CHART_STATS,
  addChartLabel,
  addChartSeries,
  chartLabelsOf,
  chartOfValue,
  CHART_DEFAULT_LOW_HEX,
  COMPARISON_KINDS,
  DRAWABLE_FAMILIES,
  defaultLayout,
  elementSize,
  refitPlacement,
  IMAGE_DEFAULT_CORNER_RADIUS,
  IMAGE_DEFAULT_TIMESTAMP_SIZE,
  ZERO_OUTSET,
  hasFreeTimestamp,
  isZeroOutset,
  nearestTimestampCorner,
  RULE_TARGET_PROPERTIES,
  STYLE_PROPERTY,
  TAP_ACTION_LABELS,
  describeTapAction,
  serviceDataIsValid,
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
  groupMembers,
  layerEntityUses,
  ungroup,
  literal,
  literalPartText,
  syncRichTextFallback,
  textUsesParts,
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
  copyElements,
  isAttachedTap,
  normalizeOwnership,
  ownedElements,
  ownedShownCount,
  pasteElements,
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
  type ChartTimesElement,
  addChartDots,
  addChartGrid,
  addChartZeroLine,
  chartDotsOf,
  chartGridsOf,
  chartZeroLinesOf,
  type ChartDotsElement,
  type ChartGridElement,
  CHART_DEFAULT_GRID_LINES,
  CHART_GRID_LINE_WIDTH,
  CHART_MIN_GRID_THICKNESS,
  CHART_MAX_GRID_THICKNESS,
  chartGridLayerLines,
  chartGridThickness,
  chartPointDotSize,
  chartMarkerToIcon,
  addChartLine,
  chartAnchorIsColumn,
  setChartNow,
  setChartThreshold,
} from "./model.js";
import {
  type StatesTable,
  COMPARISON_LABELS,
  DEFAULT_COLUMN,
  PROPERTY_CHANGE_KIND,
  PROPERTY_LABELS,
  TABLE_COMPARISONS,
  addStateRow,
  cellChange,
  isNumericComparison,
  looksBinary,
  moveStateRow,
  removeColumn,
  removeStateRow,
  setOtherwise,
  setTestedValue,
  shownColumns,
  statesSummary,
  tableShape,
  whenText,
} from "./states.js";
import {
  type RulePresetKind,
  RULE_PRESETS,
  WEEKDAY_LABELS,
  rulePresetTests,
  sunRef,
  weekdayNumbers,
  weekdayOptions,
} from "./rule-presets.js";
import { chartNumbers, leadingNumber, timelineSamples, type ForcedBranches, type TimelineSample } from "./resolver.js";
import {
  type RichTextBlocked,
  type RichTextMoved,
  dropPartIds,
  joinTextParts,
  turnOffRichText,
  turnOnRichText,
} from "./rich-text.js";
import type { HassEntityState, HassLike } from "./ha-api.js";
import { MIN_ZOOM, familyTitle, type IconProvider } from "./renderer.js";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES, SymbolBrowser, searchSymbols, type SymbolPack } from "./symbols.js";
import { MDI_PREFIX } from "./icons.js";
import { typedFrame } from "./interact.js";
import {
  DESIGN_BOX,
  CHART_DEFAULT_BAR_RADIUS,
  CHART_DEFAULT_GRID_HEX,
  CHART_MAX_GRID_LINES,
  chartBarCorners,
  chartBarRadius,
  chartFillStyle,
  chartSmoothing,
  type ChartCurve,
  type ChartDotsMode,
  type ChartFillStyle,
} from "./model.js";
import { chartSmoothed, chartSeriesWithHoles } from "./resolver.js";
import { watchVersionNote } from "./version.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import { SECTION_COLOR } from "./kinds.js";
import { domainIcon, domainLabel, isActiveState } from "./domain-icons.js";

export interface EditorHost {
  hass: HassLike;
  config: CustomComplicationConfig;
  /** Draws and enumerates SF Symbols for the symbol picker. */
  icons: IconProvider;
  /** Search text, category and recents for the symbol picker. */
  symbols: SymbolBrowser;
  /** Watch-app pages (id + name, watch order) from the watch's last sync
   * report; feeds the "Open the page" tap-action picker. */
  pages: { id: string; name: string }[];
  /** The Wrist Assistant version the edited watch last reported, for the
   * "Needs Wrist Assistant X.Y" notes under newer controls. Absent or null when
   * it has not reported, which shows no note. */
  watchAppVersion?: string | null;
  /** Mutate the draft. `coalesce` groups rapid edits of one control into one undo step. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string): void;
  endGesture(): void;
  /** Resolved text for a value, for the "current value" line. */
  resolve(value: Value): string | undefined;
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
  /** Add a shape and seed its layout. Also makes it the active shape. */
  addFamily(family: FamilyKind): void;
  /** The complication's name when this edit session opened, for the rename
   * note. Undefined for a brand-new complication (nothing on the watch yet). */
  savedName?: string;
  /** Whether the preview's Show taps view is on. With this layer selected it
   * shows only this layer's tap area, with corners to drag. */
  tapAreaShown: boolean;
  /** Turn that view on or off. */
  showTapArea(on: boolean): void;
  /** The inspector cards that are open. With one entry the inspector is in
   * its one-at-a-time mode and a click on another card swaps to it. */
  openSections: ReadonlySet<string>;
  toggleSection(id: string): void;
  /** The cards whose "?" is on. A card's plain hints are hidden until then;
   * warnings, errors, empty states and hints marked `keep` always show. */
  helpSections: ReadonlySet<string>;
  toggleHelp(id: string): void;
  /** Make a layer the selection, the way a click on its Layers row does. */
  selectLayer(id: string): void;
  /** Open one shared value for editing, in its card under the preview. */
  selectValue(id: string): void;
  /** Hold every update until `endGesture` in one undo step. */
  beginGesture(): void;
}

/** Every card id the inspector can show, for "Open all". */
export const ALL_SECTIONS = ["content", "look", "numbers", "timestamp", "tappable", "states", "placement", "corner", "placements", "shape", "symbol"] as const;

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

/**
 * Drag a number's title left or right to change it: one step every 3px,
 * clamped to the field's range. The step is the field's own, else 1, or 0.1
 * for a number that already has decimals. A press that never moves is left to
 * the label, which focuses the box as it always did.
 */
function scrubber(value: number | undefined, set: (v: number) => void, opts: { step?: number; min?: number; max?: number }) {
  return (e: PointerEvent) => {
    if (e.button !== 0 || !e.isPrimary) return;
    const handle = e.currentTarget as HTMLElement;
    if (handle.closest(".field")?.querySelector<HTMLInputElement>("input[type=number]")?.disabled) return;
    // Keeps the press from selecting the title's text. The click after a press
    // that did not move still reaches the label and focuses the box.
    e.preventDefault();
    const start = value !== undefined && Number.isFinite(value) ? value : Math.max(0, opts.min ?? 0);
    const step = opts.step ?? (Number.isInteger(start) ? 1 : 0.1);
    const places = (String(step).split(".")[1] ?? "").length;
    const x0 = e.clientX;
    let moved = false;
    let last = start;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      if (!moved && Math.abs(dx) < 3) return;
      moved = true;
      let v = start + Math.round(dx / 3) * step;
      if (opts.min !== undefined) v = Math.max(opts.min, v);
      if (opts.max !== undefined) v = Math.min(opts.max, v);
      v = Number(v.toFixed(places));
      if (v !== last) { last = v; set(v); }
    };
    const end = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
      handle.dispatchEvent(new CustomEvent(SCRUB_END, { bubbles: true, composed: true }));
      if (!moved) return;
      // A drag is not a click: without this the label would pass the release
      // on to its box and focus it.
      const swallow = (c: Event) => { c.preventDefault(); c.stopPropagation(); };
      handle.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => handle.removeEventListener("click", swallow, { capture: true }), 0);
    };
    handle.setPointerCapture(e.pointerId);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
    handle.dispatchEvent(new CustomEvent(SCRUB_START, { bubbles: true, composed: true }));
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
 * default. The title doubles as a handle that drags the number. */
export function numberField(label: string, value: number | undefined, set: (v: number | undefined) => void, opts: NumberInputOptions & { def?: number } = {}) {
  return html`<label class="field num">${fieldLabel(label, backTo<number | undefined>(value, opts.def, set), scrubber(value, set, opts))}${numberInput(value, set, opts)}</label>`;
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
 * alpha can be typed either way. `def` adds a reset dot back to that colour
 * (or, for an optional colour, `null` clears it). */
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

/** A stored colour as its controls show it: the swatch, the six digits the
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
 * a row that names its colour some other way, such as a band table's. */
function colorBox(label: string, value: string | undefined, set: (v: string | undefined) => void, off = false, placeholder = "#RRGGBB"): TemplateResult {
  const { valid, swatch, rgb, alpha } = colorParts(value);
  return html`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${off || !valid ? "transparent" : swatch}`} title="Pick a colour">
        <input type="color" .value=${rgb} ?disabled=${off} aria-label=${`${label}: pick a colour`} @input=${onInput((v) => set(composeColor(v, alpha)))} />
      </span>
      <input type="text" class="mono hex" .value=${value ?? ""} placeholder=${placeholder} spellcheck="false" aria-label=${`${label}: hex`} ?disabled=${off}
        @input=${onInput((v) => { const t = v.trim(); if (/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t)) set(t.startsWith("#") ? t.toUpperCase() : `#${t.toUpperCase()}`); })} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(alpha)} title="Opacity" aria-label=${`${label}: opacity`} ?disabled=${off}
          @input=${onInput((v) => { const n = Number(v); if (v.trim() !== "" && n >= 0 && n <= 100) set(composeColor(rgb, Math.round(n))); })} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`;
}

/** A colour that may be left empty, where empty means another colour stands in
 * (named by `empty`, shown in the hex box). Picking a colour sets one; the
 * reset dot clears it again. */
function fallbackColorField(label: string, value: string | undefined, empty: string, set: (v: string | undefined) => void) {
  const back: ResetTo = { atDefault: value === undefined, title: `Back to ${empty.toLowerCase()}`, reset: () => set(undefined) };
  return html`<div class="field color">${fieldLabel(label, back)}
    <div class="color-row">${colorBox(label, value, set, false, empty)}</div></div>`;
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
 */
export function commitTypedEntity(text: string, ref: EntityRef, states: Record<string, HassEntityState>): EntityRef | undefined {
  const t = text.trim();
  if (t === ref.entityId) return undefined;
  if (t === "") return { entityId: "", displayName: "", domain: "" };
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
   * takes a ring in the entity colour, and pulses once when it becomes the
   * thing to fill in, so the answer to "why is my layer blank?" is marked
   * where the answer gets typed rather than only in a line of prose. */
  needed?: boolean;
}

/** Whether a field's result list is open right now. The preset dialog asks so
 * that its own Enter shortcut waits until the search has been answered. */
export function entitySearchOpen(key: string): boolean {
  return entitySearches.has(key);
}

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
export function entityField(host: Pick<EditorHost, "hass">, label: string, ref: EntityRef, set: (ref: EntityRef) => void, key: string, opts: EntityFieldOptions = {}): TemplateResult {
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
  const commitText = (text: string) => {
    const next = commitTypedEntity(text, ref, states);
    if (next) set(next);
  };
  const pick = (choice: EntityChoice, target: EventTarget | null) => {
    set(entityRefFrom(states, choice.entityId));
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
      else { commitText(el.value); close(el); }
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

  const currentArea = ref.entityId ? areaLookup(host.hass)?.(ref.entityId) : undefined;
  const caption = ref.entityId === ""
    ? html`<div class="hint">Type part of a name, a room, or an id.</div>`
    : live
      ? html`<div class="entity-current">
          <span class="ent-ico ${isActiveState(live.state) ? "on" : ""}">${domainIcon(ref.domain || ref.entityId.split(".")[0] || "")}</span>
          <span class="ent-name">${typeof live.attributes.friendly_name === "string" ? live.attributes.friendly_name : ref.entityId}</span>
          ${currentArea ? html`<span class="ent-area">${currentArea}</span>` : nothing}
          <span class="ent-state">${live.state}</span>
        </div>`
      : html`<div class="hint warn">Not in Home Assistant right now.</div>`;

  return html`<div class="field entity-field">
    <span>${label}</span>
    <div class="ent-box ${search ? "open" : ""} ${opts.needed && ref.entityId === "" ? "needs" : ""}">
      <span class="ent-glass">${uiIcon("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${search ? "true" : "false"} autocomplete="off" spellcheck="false"
        .value=${search ? search.query : ref.entityId}
        placeholder="Search by name, room, or id"
        @focus=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; open(el, ref.entityId); el.select(); }}
        @input=${(e: Event) => { const el = e.target as HTMLInputElement; open(el, el.value); }}
        @keydown=${onKey}
        @blur=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; if (search) commitText(el.value); close(el); }} />
      ${(search ? search.query : ref.entityId) === "" ? nothing : html`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${(e: MouseEvent) => e.preventDefault()}
        @click=${(e: MouseEvent) => {
          const el = (e.currentTarget as HTMLElement).closest(".ent-box")?.querySelector("input") ?? null;
          set({ entityId: "", displayName: "", domain: "" });
          entitySearches.set(key, { query: "", index: 0 });
          requestRerender(el);
          el?.focus();
        }}>${uiIcon("close")}</button>`}
    </div>
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
      : caption}
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
  // The colour passed here is overridden by CSS `currentColor`, which wins over
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
 */
function symbolField(
  host: EditorHost,
  symbol: string,
  set: (v: string) => void,
  key: string,
  setPath?: (d: string | undefined) => void
): TemplateResult {
  const browser = host.symbols;
  const open = browser.isOpen(key);
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
    <label class="field"><span>Symbol</span>
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
    <button type="button" class="link" @click=${() => browser.toggle(key)}>${open ? "Hide symbols" : "Browse symbols"}</button>
    ${browsePane}`;
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
  ["uniform", "One colour"], ["bands", "By value"],
];
/** The colour table a chart starts with when the author first switches it to
 * banded colour.
 *
 * Seeded from the readings on screen rather than left empty, because a new
 * setting that visibly does nothing reads as broken. Thirds of the current
 * spread is the same split the gauge preset uses, and it always paints all
 * three colours on the data in front of the author. */
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
 * the layer's own colour so it is visible before the author picks one. Takes the
 * table rather than a layer, so the chart and the gauge share it. */
function nextBand(bands: readonly ChartBand[], ownColorHex: string): ChartBand {
  const sorted = chartSortedBands({ bands });
  const last = sorted.at(-1);
  const step = bands.length > 1 ? Math.abs(sorted[1]!.upTo - sorted[0]!.upTo) : 10;
  return { id: newId(), upTo: (last?.upTo ?? 0) + (step || 10), colorHex: ownColorHex };
}

/** A layer that carries a colour table: the chart and the gauge. */
interface BandedLayer {
  bands: ChartBand[];
  bandAboveColorHex: string;
}

/** Where a band table's colour bar starts and ends: a typical band's width
 * before the first row and past the last, stretched to take in the current
 * value when there is one. */
export function bandScale(upTos: readonly number[], value?: number): { lo: number; hi: number } {
  const sorted = [...upTos].sort((a, b) => a - b);
  const first = sorted[0];
  const last = sorted.at(-1);
  const now = value !== undefined && Number.isFinite(value) ? value : undefined;
  let lo = (now ?? 0) - 1;
  let hi = (now ?? 0) + 1;
  if (first !== undefined && last !== undefined) {
    const gap = (sorted.length > 1 ? (last - first) / (sorted.length - 1) : Math.abs(first) / 2) || 1;
    lo = first - gap;
    hi = last + gap;
  }
  if (now !== undefined) {
    lo = Math.min(lo, now);
    hi = Math.max(hi, now);
  }
  return { lo, hi };
}

/** The thin bar over a band table: each band's colour as wide as the stretch
 * of numbers it covers, and a mark where the current value falls. */
function bandBar(sorted: readonly ChartBand[], aboveHex: string, value: number | undefined): TemplateResult {
  const { lo, hi } = bandScale(sorted.map((b) => b.upTo), value);
  const at = (n: number) => Math.max(0, Math.min(100, ((n - lo) / (hi - lo)) * 100));
  let prev = lo;
  const pieces = sorted.map((b) => {
    const width = Math.max(0, at(b.upTo) - at(prev));
    prev = Math.max(prev, b.upTo);
    return html`<i style=${`width:${width}%;background:${b.colorHex}`}></i>`;
  });
  return html`<div class="band-bar">
    <div class="bb" aria-hidden="true">${pieces}<i style=${`flex:1 1 auto;background:${aboveHex}`}></i></div>
    ${value === undefined ? nothing : html`<span class="now" style=${`left:${at(value)}%`} title=${`Now ${value}`}></span>`}
  </div>`;
}

/**
 * A colour table as compact rows, lowest first the way they are checked: up to
 * which number, in which colour, then the colour for anything above the last
 * row, then the button that adds a row. Shared by the gauge's and the chart's
 * Look cards, a text layer's colour by value and a rich text part, so a change
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
  value?: number,
): TemplateResult {
  const sorted = chartSortedBands({ bands: layer.bands });
  const now = value !== undefined && Number.isFinite(value) ? value : undefined;
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
  return html`<div class="bands">
    ${bandBar(sorted, above, now)}
    ${sorted.map((b) => html`
      <div class="band-row ${hit === b.id ? "hit" : ""}">
        <span class="le" aria-hidden="true">≤</span>
        <input type="number" class="band-up" step="any" .value=${String(b.upTo)} aria-label="Up to"
          title="This colour runs up to and including this number"
          @change=${onInput((v) => {
            const n = Number(v);
            if (v.trim() !== "" && Number.isFinite(n)) set(band(b.id, (x) => { x.upTo = n; }));
          })} />
        ${colorBox(`Up to ${b.upTo}`, b.colorHex, (v) => set(band(b.id, (x) => { x.colorHex = v ?? "#FFFFFF"; }), `bcol${b.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${() => set((p) => { p.bands = p.bands.filter((x) => x.id !== b.id); })}>${uiIcon("close")}</button>
      </div>`)}
    <div class="band-row ${hit === "above" ? "hit" : ""}">${resetButton(aboveBack)}
      <span class="le" aria-hidden="true">&gt;</span>
      <span class="else">Above</span>
      ${colorBox("Above the last band", above, (v) => set((p) => { p.bandAboveColorHex = v ?? CHART_DEFAULT_BAND_HIGH_HEX; }, "babove"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${() => set((p) => { p.bands = [...p.bands, nextBand(p.bands, ownColorHex)]; })}>+ Band</button>
  </div>`;
}

/** A layer that colours by state rather than by value: the timeline. */
interface StateBandedLayer {
  bands: TimelineBand[];
  otherColorHex: string;
}

/**
 * The rows of a timeline's colour table, the button that adds one, and the
 * colour a state no row named takes.
 *
 * A sibling of `bandTableFields` rather than the same function: a chart's row
 * says where a number stops and a timeline's says which word it is, so the two
 * share their shape and nothing else.
 */
/** The states a timeline's colour table can offer instead of a blank box: what
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
        ${colorField("Colour", band.colorHex,
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

const GAUGE_STYLES: [GaugeStyle, string][] = [
  ["arc", "Arc"], ["ring", "Ring"], ["bar", "Bar"], ["dots", "Dots"],
];
const GAUGE_STYLE_TITLES: Record<string, string> = {
  arc: "A 270° arc, open at the bottom",
  ring: "A full circle",
  bar: "A straight bar",
  dots: "One dot per unit, the first few filled",
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
    case "jinja": return { kind, value: current.kind === "jinja" ? current.value : "{{ states('sensor.example') }}" };
    case "named": return { kind, id: "" };
    case "chartStat": return { kind, layer: "", stat: "latest" };
  }
}

export interface ValueEditorOptions {
  /** Named values are not offered inside a named value (no self reference). */
  allowNamed?: boolean;
  /** Leave out Make shared, for a value that has to name an entity itself
   * (a chart's readings, a timeline's states). */
  noShare?: boolean;
  /** Hide the format section (icon symbols, colours). */
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
  // A chip whose summary is an entity's name says so in the entity colour. A
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
/** Below this a popover is squeezed enough that flipping is worth it. */
const POPOVER_MIN_HEIGHT = 140;

/**
 * Where a popover goes under its chip.
 *
 * Under the chip by default, above it when there is not enough room below and
 * more room above, and always inside the window: a chip near the right edge of
 * a narrow inspector would otherwise open a form half off screen. The popover
 * itself sits in the top layer, so nothing an ancestor does with `overflow`
 * can clip it, which is the reason these are window coordinates.
 */
export function placePopover(anchor: AnchorBox, size: { width: number; height: number }, viewport: { width: number; height: number }): PopoverPlacement {
  const below = viewport.height - anchor.bottom - POPOVER_GAP - POPOVER_MARGIN;
  const above = anchor.top - POPOVER_GAP - POPOVER_MARGIN;
  const flip = size.height > below && above > below && below < POPOVER_MIN_HEIGHT;
  const room = Math.max(POPOVER_MIN_HEIGHT, flip ? above : below);
  const height = Math.min(size.height, room);
  const left = Math.max(POPOVER_MARGIN, Math.min(anchor.left, viewport.width - size.width - POPOVER_MARGIN));
  const top = flip
    ? Math.max(POPOVER_MARGIN, anchor.top - POPOVER_GAP - height)
    : Math.max(POPOVER_MARGIN, Math.min(anchor.bottom + POPOVER_GAP, viewport.height - height - POPOVER_MARGIN));
  return { left, top, maxHeight: room, above: flip };
}

function valueForm(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  const k = value.kind;
  const setKind = (kind: ValueKind) => set({ ...value, kind });
  const key = opts.key;
  const kinds = VALUE_KINDS.filter(([kind]) => opts.allowNamed !== false || kind !== "named");
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
  }
  const kindHint = VALUE_KIND_HINTS[k.kind];
  return html`
    ${selectField("Source", k.kind, kinds, (kind) => setKind(switchKind(k, kind)))}
    ${kindHint ? html`<div class="hint">${kindHint}</div>` : nothing}
    ${body}
    ${canShare(value, opts) ? html`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${() => makeShared(host, value, set)}>Make shared</button>
      so other layers can read this too.</div>` : nothing}
    ${opts.noFormat ? nothing : formatEditor(value.format, (f) => set(formatIsEmpty(f) ? { kind: value.kind } : { ...value, format: f }), formatFits(sourceKind(host, value)))}
    ${opts.showResolved ? nowReadout(host, value, host.resolve(opts.resolveAs ?? value)) : nothing}`;
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
  if (k.kind === "chartStat") return k.layer !== "";
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
  </details>`;
}

function aggregateEditor(host: EditorHost, a: AggregateSpec, set: (a: AggregateSpec) => void, key: string) {
  const csv = (list: string[]) => list.join(", ");
  const parse = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const scope = a.scope;
  return html`
    ${selectField("Function", a.function, [["count", "Count"], ["sum", "Sum"], ["average", "Average"], ["min", "Min"], ["max", "Max"]], (v) => set({ ...a, function: v }))}
    ${segField("Over", scope.kind, [["filter", "Entities matching a filter"], ["entities", "A fixed list"]], (v) =>
      set({ ...a, scope: v === "entities" ? { kind: "entities", entities: [] } : { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] } }))}
    ${scope.kind === "filter"
      ? html`<div class="grid2">
          ${textField("Domains", csv(scope.domains), (v) => set({ ...a, scope: { ...scope, domains: parse(v) } }), { placeholder: "light, switch" })}
          ${textField("Area ids", csv(scope.areaIds), (v) => set({ ...a, scope: { ...scope, areaIds: parse(v) } }))}
          ${textField("Label ids", csv(scope.labelIds), (v) => set({ ...a, scope: { ...scope, labelIds: parse(v) } }))}
          ${textField("Floor ids", csv(scope.floorIds), (v) => set({ ...a, scope: { ...scope, floorIds: parse(v) } }))}
        </div>`
      : html`${scope.entities.map((e, i) => html`<div class="row-inline">
            ${entityField(host, `Entity ${i + 1}`, e, (ref) => { const list = [...scope.entities]; list[i] = ref; set({ ...a, scope: { ...scope, entities: list } }); }, `${key}-agg-${i}`, { compact: true })}
            <button class="icon" title="Remove" @click=${() => set({ ...a, scope: { ...scope, entities: scope.entities.filter((_, j) => j !== i) } })}>${uiIcon("close")}</button>
          </div>`)}
          <button class="small" @click=${() => set({ ...a, scope: { ...scope, entities: [...scope.entities, { entityId: "", displayName: "", domain: "" }] } })}>Add entity</button>`}
    ${selectField("Only count when", a.stateFilter?.kind ?? "", [["", "Any state"], ["isOn", "On"], ["isOff", "Off"], ["equals", "State equals"], ["notEquals", "State does not equal"]], (v) => {
      const next = { ...a };
      if (v === "") delete next.stateFilter;
      else if (v === "equals" || v === "notEquals") next.stateFilter = { kind: v, value: a.stateFilter && "value" in a.stateFilter ? a.stateFilter.value : "" };
      else next.stateFilter = { kind: v as "isOn" | "isOff" };
      set(next);
    })}
    ${a.stateFilter && "value" in a.stateFilter ? textField("State", a.stateFilter.value, (v) => set({ ...a, stateFilter: { kind: a.stateFilter!.kind as "equals", value: v } })) : nothing}
    ${a.function === "count" ? nothing : textField("Attribute (blank = state)", a.attribute ?? "", (v) => { const next = { ...a }; if (v) next.attribute = v; else delete next.attribute; set(next); })}`;
}

// ── General ───────────────────────────────────────────────────────────────

const TAP_TYPES = TAP_ACTION_LABELS;

/** A tap layer offers everything but "Nothing": a layer that does nothing would
 * just let the tap fall through to the whole-complication action, which is what
 * deleting the layer does. */
const LAYER_TAP_TYPES: [TapAction["type"], string][] = TAP_TYPES.filter(([t]) => t !== "none");

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
  if (type === "callService") {
    const out: CallServiceAction = current.type === "callService"
      ? { ...current }
      : { type: "callService", serviceDomain: "", serviceName: "" };
    if (ref.entityId !== "") out.target = ref;
    return out;
  }
  if (tapNeedsEntity(type)) return { type: type as "toggleEntity", ...ref };
  return { type: type as "refresh" };
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
    ${textArea("Data (JSON)", data, (v) => {
      const next: CallServiceAction = { ...action };
      if (v.trim() === "") delete next.serviceDataJSON; else next.serviceDataJSON = v;
      set(next, "svc-data");
    }, 3)}
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

export function generalEditor(host: EditorHost): TemplateResult {
  const cfg = host.config;
  const tap = cfg.tapAction;
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
  // One row each: name, refresh, tap action, flash. Anything a tap action
  // needs beyond its type (an entity, a page, a service) follows the tap row.
  return html`
    <div class="gen-row">
      ${textField("Name", cfg.name, (v) => host.update((c) => { c.name = v; }, "name"))}
      ${selectField("Refresh", String(refresh), refreshOptions, (v) => host.update((c) => { c.refreshMinutes = Number(v) || 0; }, "refresh"))}
      ${selectField("Tap action", tap.type, TAP_TYPES, (v) => host.update((c) => {
        c.tapAction = tapActionForType(v, c.tapAction);
        // Mirrors the iPhone preset editor: the chosen page belongs to the
        // openPage type; leaving it clears the choice.
        if (v !== "openPage") { delete c.openPageId; delete c.openPageName; }
      }))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${flashOn} title="Flash when a tap works"
            @change=${(e: Event) => host.update((c) => { c.showSuccessFlash = (e.target as HTMLInputElement).checked; })} />
          ${flashOn
            ? html`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(cfg.successFlashColorHex ?? FLASH_DEFAULT).slice(0, 7)}
                @input=${onInput((v) => host.update((c) => { c.successFlashColorHex = v.toUpperCase(); }, "flash"))} />`
            : html`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${renamed ? html`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>` : nothing}
    ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => host.update((c) => { c.tapAction = { type: tap.type, ...ref }; }, "tap-entity"), "general-tap") : nothing}
    ${tap.type === "callService"
      ? callServiceFields(host, tap, (next, k) => host.update((c) => { c.tapAction = next; }, k), "general-tap")
      : nothing}
    ${tap.type === "openPage" ? openPageField(host) : nothing}`;
}

/** What the swatch shows while no colour is stored: the watch's own fallback,
 * a mid grey. Nothing is written until the user picks a colour. */
const FLASH_DEFAULT = "#808080";

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

/** Write a per-family placement for a layer, creating it from the effective values. */
export function setPlacement(cfg: CustomComplicationConfig, family: FamilyKind, id: string, patch: Partial<Placement>, clearSize = false): void {
  const el = cfg.elements.find((e) => e.payload.id === id);
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
  const id = el.payload.id;
  const shared = elementSize(el) ?? opts.min;
  const value = effectivePlacement(host.config, family, el).size ?? shared;
  return numberField(label, value,
    (v) => host.update(
      (c) => setPlacement(c, family, id, { size: Math.max(opts.min, v ?? shared) }),
      `el-${id}-size-${family}`,
    ),
    { step: opts.step, min: opts.min, unit: "pt", ...(opts.def === undefined ? {} : { def: opts.def }) });
}

/** `elementSize` lives beside the design boxes now, because the refit that
 * scales it for another canvas has to read both. Re-exported here so the
 * inspector's own callers do not have to know that. */
export { elementSize };

/**
 * Give one shape its own copy of another shape's layers.
 *
 * A real copy, not a link: the new shape gets new layers with new ids, so
 * editing one of them afterwards changes nothing on the shape it came from.
 * Each one lands where its original sits, scaled for the canvas it arrives on.
 * What "copy the Rectangular layout" does to a shape that is still blank.
 */
export function copyShapeLayout(cfg: CustomComplicationConfig, from: FamilyKind, to: FamilyKind): void {
  const layout = cfg.perFamily[to] ?? (cfg.perFamily[to] = defaultLayout());
  const source = ownedElements(cfg, from).filter((el) => !isAttachedTap(cfg, el));
  if (source.length === 0) return;
  const clip = copyElements(cfg, source.map((el) => el.payload.id), from);
  const landed = pasteElements(cfg, clip, { nudge: false });
  // Each copy arrives carrying the source shape's own placement. Refit it for
  // this canvas, hand it to this shape, and take it off the source shape,
  // which is what makes the copy a layer of its own rather than a second
  // pointer at the original.
  const sourceLayout = cfg.perFamily[from];
  for (const id of landed) {
    const el = cfg.elements.find((e) => e.payload.id === id);
    if (!el) continue;
    const src = sourceLayout?.placements[id];
    // The size travels even when the source shape never set one, so the refit
    // has something to scale down for the smaller canvas.
    const size = src?.size ?? elementSize(el);
    const base: Placement = {
      frame: { ...(src?.frame ?? el.payload.frame) },
      // A layer hidden on the source shape arrives hidden, so the copy is the
      // arrangement as it stands rather than an arrangement plus whatever was
      // switched off in it.
      isHidden: src?.isHidden ?? false,
      ...(size !== undefined ? { size } : {}),
    };
    // Left on the source shape the copy would have two owners, and settling
    // the document would split it in two, so it comes off there.
    for (const f of DRAWABLE_FAMILIES) if (f !== to) delete cfg.perFamily[f]?.placements[id];
    layout.placements[id] = refitPlacement(base, from, to, el.kind);
  }
  normalizeOwnership(cfg, to);
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

/** A layer's own colour, or undefined for the kinds that have none: a picture
 * draws a photo, a tap area draws nothing, and every colour on a timeline
 * comes out of its own table. */
export function elementColour(el: CElement): string | undefined {
  return el.kind === "image" || el.kind === "tap" || el.kind === "timeline" || el.kind === "chartTimes"
    || el.kind === "chartDots" || el.kind === "chartGrid"
    ? undefined
    : el.payload.colorSlot.baseColorHex;
}

export interface PickedCommon {
  /** Hidden on the shape they are on. A layer is on one shape only, so there
   * is nowhere else for it to be hidden. */
  hiddenHere: PickedFlag;
  /** Whether every picked layer has a colour to set at all. */
  colourable: boolean;
  /** The colour they already share, or undefined when they differ or one of
   * them has none. Blank in the field is what "they differ" looks like. */
  colour: string | undefined;
}

/**
 * What the picked layers agree on, for the inspector's multi-pick panel.
 *
 * Only settings every kind of layer has are read here. Anything narrower
 * belongs to the one-layer editor, where the form can match the kind.
 */
export function pickedCommon(cfg: CustomComplicationConfig, family: FamilyKind, els: readonly CElement[]): PickedCommon {
  const hiddenHere = flagAcross(els.map((el) => effectivePlacement(cfg, family, el).isHidden));
  const colours = els.map(elementColour);
  const colourable = els.length > 0 && colours.every((c) => c !== undefined);
  const first = colours[0];
  const shared = colourable && first !== undefined
    && colours.every((c) => c !== undefined && c.toUpperCase() === first.toUpperCase());
  return { hiddenHere, colourable, colour: shared ? first : undefined };
}

const FONT_WEIGHTS: [FontWeight, string][] = [["regular", "Regular"], ["medium", "Medium"], ["semibold", "Semibold"], ["bold", "Bold"]];

const TEXT_ALIGNMENTS: [TextAlignment, string][] = [["leading", "Left"], ["center", "Center"], ["trailing", "Right"]];

/** The line counts a text layer offers. Kept as strings because the segmented
 * control is a string control; the payload stores the number. */
const TEXT_LINE_LIMITS: ["1" | "2", string][] = [["1", "1"], ["2", "2"]];

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
  // Only a timeline reads this, to know whether a binary sensor is a door
  // before it seeds its colour table. Nothing in the document holds it.
  const deviceClassOf = (entityId: string) => {
    const dc = host.hass.states[entityId]?.attributes?.device_class;
    return typeof dc === "string" ? dc : undefined;
  };
  return html`
    ${entityField(host, cameraOnly ? "Camera" : "Entity", ref,
      (next) => host.update((c) => setLayerEntity(c, id, next, deviceClassOf(next.entityId)), `${key}-entity`), `${key}-layer-entity`, opts)}
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
  if (el.kind === "image") return el.payload.entity.entityId === "";
  return false;
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

/** The fetched-at overlay: whether it is drawn, where, how big, and what it
 * says. `age` keeps counting on the watch between snapshots, which is the
 * honest answer to "is this picture current?". */
function imageTimestampSection(img: ImageElement, upd: (m: (p: ImageElement) => void, key?: string) => void): TemplateResult {
  const on = img.timestamp === true;
  const free = hasFreeTimestamp(img);
  // Leaving free placement keeps the corner the chip was nearest, so the chip
  // barely moves; entering it starts from wherever the corner already put it,
  // so the first drag is a nudge rather than a jump.
  const setFree = (v: boolean) => upd((p) => {
    if (v) {
      p.timestampX = p.timestampCorner.endsWith("Leading") ? 0.16 : 0.84;
      p.timestampY = p.timestampCorner.startsWith("top") ? 0.16 : 0.84;
    } else {
      if (hasFreeTimestamp(p)) p.timestampCorner = nearestTimestampCorner(p.timestampX!, p.timestampY!);
      delete p.timestampX;
      delete p.timestampY;
    }
  });
  return html`
    ${checkField("Timestamp", on, (v) => upd((p) => { if (v) p.timestamp = true; else delete p.timestamp; }), false)}
    ${!on ? nothing : html`
      ${segField("Placement", free ? "free" : "corner", [
        ["corner", "A corner"],
        ["free", "Anywhere"],
      ], (v) => setFree(v === "free"))}
      ${free
        ? nothing
        : segField("Corner", img.timestampCorner, [
            ["topLeading", "Top left"],
            ["topTrailing", "Top right"],
            ["bottomLeading", "Bottom left"],
            ["bottomTrailing", "Bottom right"],
          ], (v) => upd((p) => { p.timestampCorner = v; }))}
      ${numberField("Text size", img.timestampSize, (v) => upd((p) => { p.timestampSize = Math.min(40, Math.max(4, v ?? IMAGE_DEFAULT_TIMESTAMP_SIZE)); }, "tssize"), { step: 1, min: 4, max: 40, def: IMAGE_DEFAULT_TIMESTAMP_SIZE, unit: "pt" })}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`}`;
}

interface CardOptions {
  /** Tint of the header band and the edge; one of SECTION_COLOR, so a card
   * wears the same colour on every kind of layer. */
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
 * The copy is deep, or two layers would end up sharing one colour slot. */
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
      <button type="button" class="sec-help ${help ? "on" : ""}" aria-pressed=${help ? "true" : "false"} title=${helpLabel} aria-label=${helpLabel}
        @click=${(e: Event) => { e.stopPropagation(); toggleHelp(); }}>?</button>`;
  return html`<section class="sec" data-open=${open ? "true" : "false"} data-help=${help ? "on" : "off"} style=${opts.color ? `--c:${opts.color}` : ""}>
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
    ${open ? html`<div class="sec-b">${body}</div>` : nothing}
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
    case "icon": return truncate(describeValue(el.payload.symbol, ctx), 48);
    case "gauge": return truncate(describeValue(el.payload.value, ctx), 48);
    // Charts drawing a past say so: the value names the entity either way, so
    // without the span the kinds of chart read identically in the list. A
    // statistics chart adds what one bar covers, because a day of hourly rows
    // and a day of daily ones are the same span and different plots.
    case "chart": return truncate(
      `${describeValue(el.payload.value, ctx)}${chartSpanSummary(el.payload)}`,
      48
    );
    case "timeline": return truncate(
      `${describeValue(el.payload.value, ctx)} · ${historySpanLabel(timelineHistoryMinutes(el.payload))}`, 48);
    case "shape": return el.payload.kind === "roundedRectangle" ? "Rounded rectangle" : el.payload.kind;
    case "image": return el.payload.entity.displayName || el.payload.entity.entityId
      || (el.payload.source === "camera" ? "No camera yet" : "No entity yet");
    case "tap": return describeTapAction(el.payload.action);
    case "chartTimes": {
      const chart = host.config.elements.find((e) => e.payload.id === el.payload.chart);
      return chart?.kind === "chart" ? truncate(`Times of ${describeValue(chart.payload.value, ctx)}`, 48) : "No chart";
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
      const size = g.style === "dots" ? `${g.bands.length > 0 && g.coloring === "bands" ? "banded" : colorWords(g.colorSlot.baseColorHex)} dots` : `${g.lineWidth} pt line · ${g.coloring === "bands" && g.bands.length > 0 ? `${g.bands.length + 1} colour bands` : colorWords(g.colorSlot.baseColorHex)}`;
      return `${g.style} · ${size}${g.thresholdValue === undefined ? "" : ` · threshold ${g.thresholdValue}`}`;
    }
    // The highlight is an Extras setting now, so it is that card's summary.
    case "chart": return `${el.payload.style} · ${el.payload.scale === "auto" ? "auto scale" : `${el.payload.minValue} to ${el.payload.maxValue}`}`;
    case "timeline": {
      const t = el.payload;
      const colours = t.bands.length === 0
        ? `one colour (${colorWords(t.otherColorHex)})`
        : `${t.bands.length} ${t.bands.length === 1 ? "state" : "states"} coloured`;
      return `${colours}${t.gap > 0 ? ` · ${t.gap} pt gap` : ""} · corners ${t.cornerRadius} pt`;
    }
    case "shape": return el.payload.kind === "line"
      ? `${colorWords(el.payload.colorSlot.baseColorHex)} · ${el.payload.thickness} pt thick`
      : `${colorWords(el.payload.colorSlot.baseColorHex)}${el.payload.borderColorHex ? ` · ${el.payload.borderWidth} pt border` : ""}`;
    case "image": return `${el.payload.contentMode === "fill" ? "Fill the frame" : "Fit inside"} · ${el.payload.zoom.toFixed(2)}x · corners ${el.payload.cornerRadius} pt`;
    case "tap": return undefined;
    case "chartTimes": return `${el.payload.timeLabelCount <= 0 ? "no" : el.payload.timeLabelCount} times · ${el.payload.labelSize} pt · ${colorWords(el.payload.labelColorHex)}`;
    case "chartDots": {
      const d = el.payload;
      return `${d.dots === "all" ? "all" : "auto"} · ${d.size === undefined ? "automatic size" : `${d.size} pt`} · ${d.colorHex === undefined ? "series colour" : colorWords(d.colorHex)}`;
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
      @input=${onInput((v) => { const n = Number(v); if (v.trim() !== "" && Number.isFinite(n)) setPct(n); })} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`;
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
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
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
    ${anchorFields(host, el, family)}
    ${anchor === undefined ? html`
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${frameLetterField("X", "Left", f.x, (v) => setFrame({ x: v }, "x"), -100, 100)}
        ${frameLetterField("Y", "Top", f.y, (v) => setFrame({ y: v }, "y"), -100, 100)}
      </div>
    </div>`
    // The threshold settles only the height, so a label beside it keeps its own X.
    : !chartAnchorIsColumn(anchor.at) ? html`
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${frameLetterField("X", "Left", f.x, (v) => setFrame({ x: v }, "x"), -100, 100)}
      </div>
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
    <div class="hint">${anchor === undefined ? "X, Y, W and H are" : "W and H are"} a percent of the face, on the ${familyTitle(family)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.</div>`,
    { color: SECTION_COLOR.position, icon: "place", summary: `${Math.round(f.width * 100)}% wide · ${familyTitle(family)}`,
      ...(placeChanged ? {
        resetTitle: `Put this layer back to the middle of the ${familyTitle(family)} face at half size, unrotated and shown`,
        reset: () => host.update((c) => setPlacement(c, family, id, { frame: { ...CENTERED_FRAME }, isHidden: false })),
      } : {}) });
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
    return html`
      <div class="grid2">
        ${numberField("Threshold at", c.thresholdValue ?? 0, (v) => setChart((p) => { p.thresholdValue = v ?? 0; p.drawsThreshold = false; }, "thval"))}
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
  const id = el.payload.id;
  const attached = attachedTapsOf(host.config, id)[0];
  return card(host, "tappable", "Tap", tappableSection(host, el, `el-${id}`),
    { color: SECTION_COLOR.tap, icon: "tap", summary: attached ? describeTapAction((attached.payload as TapElement).action) : "Not tappable",
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
 * The six controls behind a row of clock times: how many, how big, what colour,
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
      <div class="grid2">
        ${numberField("Time size", el.labelSize, (v) => set((p) => {
          p.labelSize = Math.min(TIMELINE_MAX_LABEL_SIZE, Math.max(TIMELINE_MIN_LABEL_SIZE, v ?? TIMELINE_DEFAULT_LABEL_SIZE));
        }, `${keyPrefix}size`), { step: 0.5, min: TIMELINE_MIN_LABEL_SIZE, max: TIMELINE_MAX_LABEL_SIZE, def: base.labelSize as number, unit: "pt" })}
        ${colorField("Time colour", el.labelColorHex, (v) => set((p) => {
          p.labelColorHex = v ?? TIMELINE_DEFAULT_LABEL_HEX;
        }, `${keyPrefix}colour`), false, base.labelColorHex as string)}
      </div>
      ${el.labelsAbove === undefined ? nothing : segField("Row", el.labelsAbove ? "above" : "below", [["below", "Below"], ["above", "Above"]],
        (v) => set((p) => { p.labelsAbove = v === "above"; }),
        { def: base.labelsAbove === true ? "above" : "below" })}
      ${segField("Clock", el.hourCycle, TIMELINE_HOUR_CYCLES,
        (v) => set((p) => { p.hourCycle = v; }),
        { titles: { auto: "Whatever clock the watch is set to" }, def: base.hourCycle as TimelineHourCycle })}
      ${segField("Minutes", el.minutes, TIMELINE_MINUTE_STYLES,
        (v) => set((p) => { p.minutes = v; }),
        { titles: { auto: "Kept up to a three hour span, dropped past it" }, def: base.minutes as TimelineMinuteStyle })}
      ${hint}`}`;
}

/** One end of a gauge's range. */
export type GaugeEnd = "min" | "max";
export type GaugeEndMode = "number" | "entity";

const GAUGE_END_MODES: [GaugeEndMode, string][] = [["number", "Number"], ["entity", "Entity"]];

/** What one end of a gauge's range reads, as the stored layer says: an end with
 * a source is an entity end, and any other end is its number. */
export function gaugeEndMode(g: GaugeElement, end: GaugeEnd): GaugeEndMode {
  return (end === "min" ? g.minSource : g.maxSource) === undefined ? "number" : "entity";
}

/**
 * Switch one end between its number and an entity. Only the source key moves:
 * the number stays stored, as the entity's fallback, so switching back to
 * Number brings the old number back.
 */
export function setGaugeEndMode(p: GaugeElement, end: GaugeEnd, mode: GaugeEndMode): void {
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
  g: GaugeElement,
  defaults: Record<GaugeEnd, number>,
  key: string,
  setGauge: (mutate: (p: GaugeElement) => void, k?: string) => void,
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
      <div class="hint">If the entity has no number, the gauge uses ${String(stored)}.</div>`;
  };
  return g.minSource === undefined && g.maxSource === undefined
    ? html`<div class="grid2 gauge-ends">${end("min")}${end("max")}</div>`
    : html`${end("min")}${end("max")}`;
}

/**
 * A text layer's colour by value: the chart's Colour and Highlight fields, read
 * against the numbers in the text instead of a series. Every key is optional on
 * a text layer, so each field deletes its key when it goes back to the default
 * and a layer that tried the feature and turned it off saves as it did before.
 */
function textValueColourFields(
  host: EditorHost,
  t: TextElement,
  set: (mutate: (p: TextElement) => void, k?: string) => void,
  colourRow: unknown,
): TemplateResult {
  const coloring = t.coloring ?? "uniform";
  const highlight = t.highlight ?? "none";
  // The shared table editor wants a table that is always there; this one holds
  // the text layer's optional keys for the length of one edit.
  const setBands = (mutate: (p: BandedLayer) => void, k?: string) => set((p) => {
    const table: BandedLayer = { bands: p.bands ?? [], bandAboveColorHex: p.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX };
    mutate(table);
    if (table.bands.length > 0) p.bands = table.bands; else delete p.bands;
    if (table.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) p.bandAboveColorHex = table.bandAboveColorHex;
    else delete p.bandAboveColorHex;
  }, k);
  const setHex = (key: "highColorHex" | "lowColorHex", def: string, v: string | undefined) => set((p) => {
    if (v === undefined || v === def) delete p[key]; else p[key] = v;
  }, key);
  const highlightHint = highlight === "highest" ? "The highest number takes its own colour"
    : highlight === "lowest" ? "The lowest number takes its own colour"
    : "The highest and lowest numbers take their own colours";
  // The table marks the number the text reads, when it reads exactly one.
  const numbers = coloring === "bands" ? chartNumbers(host.resolve(t.value) ?? "") : [];
  return html`
    ${segField("Colour", coloring, CHART_COLORINGS, (v) => set((p) => {
      if (v === "uniform") { delete p.coloring; return; }
      p.coloring = v;
      // Seeded from the numbers the text shows right now, as a chart seeds from
      // its readings, so the switch paints something the moment it is flipped.
      if ((p.bands?.length ?? 0) === 0) p.bands = seedBands(chartNumbers(host.resolve(p.value) ?? ""));
    }), { def: "uniform" })}
    ${colourRow}
    ${coloring === "bands" ? html`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${bandTableFields({ bands: t.bands ?? [], bandAboveColorHex: t.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX }, t.colorSlot.baseColorHex, setBands,
        numbers.length === 1 ? numbers[0] : undefined)}`
      : nothing}
    ${segField("Highlight", highlight, CHART_HIGHLIGHTS, (v) => set((p) => {
      if (v === "none") delete p.highlight; else p.highlight = v;
    }), { def: "none" })}
    ${highlight === "none" ? nothing : html`
      <div class="grid2">
        ${highlight === "lowest" ? nothing
          : colorField("Highest colour", t.highColorHex ?? CHART_DEFAULT_HIGH_HEX, (v) => setHex("highColorHex", CHART_DEFAULT_HIGH_HEX, v), false, CHART_DEFAULT_HIGH_HEX)}
        ${highlight === "highest" ? nothing
          : colorField("Lowest colour", t.lowColorHex ?? CHART_DEFAULT_LOW_HEX, (v) => setHex("lowColorHex", CHART_DEFAULT_LOW_HEX, v), false, CHART_DEFAULT_LOW_HEX)}
      </div>
      ${coloring === "bands" ? nothing : html`<div class="hint">${highlightHint}, and other text keeps the layer colour.</div>`}`}`;
}

// ── Rich text ─────────────────────────────────────────────────────────────
// A text layer drawn as a row of parts, each in its own colour, weight and
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

/** Which of a part's three Colour choices it is on. */
export type PartColourMode = "layer" | "pick" | "bands";

const PART_COLOURS: [PartColourMode, string][] = [["layer", "Layer"], ["pick", "Pick"], ["bands", "By value"]];

/** What a text layer draws, as its Type row names it. */
export type TextType = "plain" | "rich" | "countdown";

/** Countdown is not on the Type row: few layers need it, so it is a switch
 * under the value, offered only when the value is a timer or a future time. */
const TEXT_TYPES: [TextType, string][] = [["plain", "Plain"], ["rich", "Rich"]];
const TEXT_TYPE_TITLES: Partial<Record<TextType, string>> = {
  plain: "One line: typed words, a live value or a template",
  rich: "Parts, each with its own colour, weight and size",
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

export function partColourMode(part: TextPart): PartColourMode {
  if (part.coloring === "bands") return "bands";
  return part.colorHex === undefined ? "layer" : "pick";
}

/** The dot at the front of a part's chip: the colour it draws in, or a wheel
 * of its own band colours when it colours by value. */
export function partDotBackground(part: TextPart, layerHex: string): string {
  if (partColourMode(part) === "bands" && (part.bands?.length ?? 0) > 0) {
    const colours = [...chartSortedBands({ bands: part.bands! }).map((b) => b.colorHex), part.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX];
    const step = 100 / colours.length;
    const at = (n: number) => `${Math.round(n * 10) / 10}%`;
    return `conic-gradient(${colours.map((c, i) => `${c} ${at(i * step)} ${at((i + 1) * step)}`).join(", ")})`;
  }
  return part.colorHex ?? layerHex;
}

/** Why rich text cannot turn off yet, naming every part in the way. */
export function richTextBlockedHint(blocked: readonly RichTextBlocked[]): string {
  const named = (list: readonly RichTextBlocked[]) => (list.length === 1
    ? `Part ${list[0]!.index + 1}`
    : `Parts ${joinWords(list.map((b) => String(b.index + 1)))}`);
  const kinds = blocked.filter((b) => b.reason === "kind");
  const formats = blocked.filter((b) => b.reason === "format");
  const said: string[] = [];
  if (kinds.length > 0) said.push(`${named(kinds)} ${kinds.length === 1 ? "shows" : "show"} a value a template cannot read, such as data age or a chart's number.`);
  if (formats.length > 0) said.push(`${named(formats)} ${formats.length === 1 ? "uses" : "use"} a relative time or duration format, which a template cannot print.`);
  return `Rich text stays on, because the parts cannot join into one line. ${said.join(" ")} Change or remove ${blocked.length === 1 ? "that part" : "those parts"} first.`;
}

const MOVED_WORDS: Record<RichTextMoved, string> = { fontSize: "font size", fontWeight: "weight", color: "colour", bands: "colour bands" };

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
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
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
      : html`
        ${layerEntityField(host, el, key)}
        ${valueEditor(host, t.value, (v) => upd((p) => { p.value = v; }, "value"), { showResolved: true, label: type === "countdown" ? "Until" : "Text", key: `${key}-value` })}
        ${countdownFields(host, type === "countdown", t.value, (on) => setType(on ? "countdown" : "plain", null))}
        ${owner ? html`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${() => host.selectLayer(owner.payload.id)}>${layerTitle(owner, describeContext(host))}</button>. It stays in the chart's group and moves with it.</div>` : nothing}`}`;
}

/**
 * The parts of a rich text layer as a row of chips with the two add buttons at
 * its end, then the editor for the part picked: what it shows, its colour,
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
    openPopoverSoon(node, popoverId(`${key}-part-${id}`), true);
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
    const mode = partColourMode(p);
    const now = chip.kind === "value" ? host.resolve(p.value) : undefined;
    const weight = p.fontWeight === undefined ? undefined : FONT_WEIGHTS.find(([w]) => w === p.fontWeight)?.[1];
    return html`<button type="button" role="option" aria-selected=${on ? "true" : "false"} class="part-chip ${chip.kind} ${on ? "on" : ""}"
      aria-label=${rulePartLabel(p, i, ctx)} @click=${(e: Event) => select(p.id, e.currentTarget)}>
      <span class="part-dot" style=${`background:${partDotBackground(p, layerHex)}`}
        title=${mode === "bands" ? "By value, with its own bands" : mode === "pick" ? "Its own colour" : "The layer colour"}></span>
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
  const mode = partColourMode(part);
  const ownSize = part.fontSize !== undefined;
  const layerWeight = FONT_WEIGHTS.find(([w]) => w === t.fontWeight)?.[1] ?? t.fontWeight;
  // Out of range is left alone rather than clamped, so typing 12 can pass
  // through 1 without the box jumping to 4 under the caret.
  const setSize = (n: number) => {
    if (n >= PART_SIZE_MIN && n <= PART_SIZE_MAX) updPart((x) => { x.fontSize = n; }, "size");
  };
  // The band table marks the number the part reads, when it reads exactly one.
  const numbers = mode === "bands" ? chartNumbers(host.resolve(part.value) ?? "") : [];
  const colourTitles: Partial<Record<PartColourMode, string>> = {
    layer: "Use the layer colour",
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
      ${valueEditor(host, part.value, (v) => updPart((x) => { x.value = v; }, "value"), { showResolved: true, label: literalPart ? "Text" : "Shows", key: `${key}-part-${part.id}` })}
      ${literalPart ? html`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>` : nothing}
      ${segField("Colour", mode, PART_COLOURS, (v) => updPart((x) => {
        if (v === "layer") { delete x.colorHex; delete x.coloring; return; }
        if (v === "pick") { delete x.coloring; x.colorHex = sameColor(layerHex, "#FFFFFF") ? "#64D2FF" : layerHex; return; }
        delete x.colorHex;
        x.coloring = "bands";
        // Seeded from the numbers the part shows right now, as the layer's own
        // table is, so By value paints something the moment it is picked.
        if ((x.bands?.length ?? 0) === 0) x.bands = seedBands(chartNumbers(host.resolve(x.value) ?? ""));
      }), { def: "layer", titles: colourTitles, ...(literalPart && mode !== "bands" ? { disabled: { bands: true } } : {}) })}
      ${mode === "pick" ? colorField("Part colour", part.colorHex, (v) => updPart((x) => { x.colorHex = v ?? layerHex; }, "color")) : nothing}
      ${mode === "bands" ? html`
        ${bandTableFields({ bands: part.bands ?? [], bandAboveColorHex: part.bandAboveColorHex ?? CHART_DEFAULT_BAND_HIGH_HEX }, part.colorHex ?? layerHex, setBands,
          numbers.length === 1 ? numbers[0] : undefined)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>` : nothing}
      <div class="field seg-field">${fieldLabel("Weight", part.fontWeight === undefined ? undefined
          : { atDefault: false, title: `Back to the layer weight (${layerWeight})`, reset: () => updPart((x) => { delete x.fontWeight; }) })}
        ${segButtons("Weight", part.fontWeight, FONT_WEIGHTS, (v) => updPart((x) => { x.fontWeight = v; }), { inherited: t.fontWeight })}
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
  const idx = host.config.elements.findIndex((e) => e.payload.id === id);
  const key = `el-${id}`;
  const upd = (mutate: (e: CElement) => void, k?: string) => host.update((c) => mutate(c.elements[idx]!), k ? `${key}-${k}` : undefined);
  const eff = effectivePlacement(host.config, family, el);
  const f = eff.frame;
  const setFrame = (patch: Partial<NormalizedFrame>, k: string) => host.update((c) => setPlacement(c, family, id, { frame: typedFrame(f, patch) }), `${key}-${k}-${family}`);
  // What a fresh layer of this kind holds: the reset buttons go back to it,
  // and the changed dots compare against it.
  const base = newElement(el.kind).payload as unknown as Record<string, unknown>;
  const baseColor = (base.colorSlot as { baseColorHex: string } | undefined)?.baseColorHex ?? "#FFFFFF";
  const baseSize = (key: "fontSize" | "size" | "lineWidth") => base[key] as number;
  // The layer's own colour. Where a Colour choice picks between one colour and
  // colour by value, the colour sits right under that choice; anywhere else it
  // closes the Look card.
  let colourPlaced = false;
  // Only the kinds with a colorSlot have a colour of their own (`elementColour`).
  const colourRow = (label: string) => elementColour(el) === undefined
    ? nothing
    : colorField(label, elementColour(el), (v) => upd((e) => {
        if (elementColour(e) !== undefined) (e.payload as { colorSlot: { baseColorHex: string } }).colorSlot.baseColorHex = v ?? "#FFFFFF";
      }, "color"), false, baseColor);
  // A chart's marks on the plot (highlight, threshold, now, clock times). Built in
  // the chart case, where its setters live, and shown in the Extras card.
  let chartMarks: TemplateResult | undefined;

  // Content is what the layer shows; look is how it is drawn. Splitting them
  // per kind is the whole difference between a form and a page a person can
  // skim: the size of a font is never the answer to "what does this say".
  let content: TemplateResult;
  let look: TemplateResult | undefined;
  switch (el.kind) {
    case "text": {
      const setText = (mutate: (p: TextElement) => void, k?: string) => upd((e) => mutate((e as typeof el).payload), k);
      content = textContentFields(host, el, family, setText, key);
      colourPlaced = !el.payload.countdown && !textUsesParts(el.payload);
      look = html`
        ${shapeSizeField(host, el, family, "Font size", { step: 1, min: 4, def: baseSize("fontSize") })}
        ${segField("Weight", el.payload.fontWeight, FONT_WEIGHTS, (v) => upd((e) => { (e as typeof el).payload.fontWeight = v; }),
          { def: base.fontWeight as typeof el.payload.fontWeight })}
        ${segPairField(
          { label: "Align", value: el.payload.alignment ?? "center", options: TEXT_ALIGNMENTS, def: "center", set: (v) => upd((e) => {
            const p = (e as typeof el).payload;
            if (v === "center") delete p.alignment; else p.alignment = v;
          }) },
          { label: "Lines", value: el.payload.lineLimit === 2 ? "2" : "1", options: TEXT_LINE_LIMITS, def: "1", set: (v) => upd((e) => {
            const p = (e as typeof el).payload;
            if (v === "2") p.lineLimit = 2; else delete p.lineLimit;
          }) })}
        ${checkField("Mono digits", el.payload.monospacedDigits === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.monospacedDigits = true; else delete p.monospacedDigits;
        }), base.monospacedDigits === true)}
        ${el.payload.monospacedDigits ? html`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>` : nothing}
        ${colourPlaced ? textValueColourFields(host, el.payload, setText, colourRow("Main colour")) : nothing}`;
      break;
    }
    case "icon":
      content = html`
        ${valueEditor(host, el.payload.symbol, (v) => upd((e) => { (e as typeof el).payload.symbol = v; }, "symbol"), {
          noFormat: true, showResolved: true, symbol: true, label: "Symbol", key: `${key}-symbol`,
          setSymbolPath: (d) => upd((e) => {
            const p = (e as typeof el).payload;
            if (d) p.path = d; else delete p.path;
          }, "symbol"),
        })}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`;
      look = shapeSizeField(host, el, family, "Icon size", { step: 1, min: 4, def: baseSize("size") });
      break;
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
          : gaugeRangeFields(host, g, { min: base.minValue as number, max: base.maxValue as number }, key, setGauge)}`;
      colourPlaced = true;
      look = html`
        <div class="grid2">
          ${segField("Style", g.style, GAUGE_STYLES, (v) => setGauge((p) => {
            // A dot gauge needs a count, and the useful one is nearly always the
            // reading's own scope without its filter. Seeded on the way in and
            // dropped on the way out, so a ring never carries a key nothing reads.
            if (v === "dots" && p.total === undefined) p.total = seedGaugeTotal(p);
            if (v !== "dots") delete p.total;
            p.style = v;
          }), { titles: GAUGE_STYLE_TITLES, def: base.style as typeof g.style })}
          ${dots ? nothing : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: baseSize("lineWidth") })}
        </div>
        ${colorField(dots ? "Empty dot colour" : "Track colour", g.trackColorHex, (v) => setGauge((p) => { p.trackColorHex = v ?? "#FFFFFF40"; }, "track"), false, base.trackColorHex as string)}
        ${segField("Colour", g.coloring, CHART_COLORINGS, (v) => setGauge((p) => {
          p.coloring = v;
          if (v === "bands" && p.bands.length === 0) p.bands = seedBands([p.minValue, p.maxValue]);
        }), { def: base.coloring as typeof g.coloring })}
        ${colourRow("Main colour")}
        ${g.coloring === "bands" ? html`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${bandTableFields(g, g.colorSlot.baseColorHex, setGauge, chartNumbers(host.resolve(g.value) ?? "")[0])}`
          : nothing}
        ${dots ? nothing : html`
          <div class="grid2">
            ${numberField("Threshold", g.thresholdValue, (v) => setGauge((p) => {
              if (v === undefined) delete p.thresholdValue; else p.thresholdValue = v;
            }, "thr"), { optional: true })}
            ${g.thresholdValue === undefined ? nothing
              : colorField("Threshold colour", g.thresholdColorHex, (v) => setGauge((p) => { p.thresholdColorHex = v ?? GAUGE_DEFAULT_THRESHOLD_HEX; }, "thrcol"), false, GAUGE_DEFAULT_THRESHOLD_HEX)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>`}`;
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
            ${checkField("Show gaps when unavailable", c.gaps === true,
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
      colourPlaced = true;
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
      look = html`
        <div class="grid2">
          ${segField("Style", c.style, CHART_STYLES, (v) => setChart((p) => { p.style = v; }), { def: base.style as typeof c.style })}
          ${c.style === "bars"
            ? numberField("Bar gap", c.barGap, (v) => setChart((p) => { p.barGap = Math.max(0, v ?? 0); }, "gap"), { step: 0.5, min: 0, def: base.barGap as number, unit: "pt" })
            : shapeSizeField(host, el, family, "Line width", { step: 0.5, min: 0.5, def: baseSize("lineWidth") })}
        </div>
        ${c.style === "bars" ? html`
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
            below zero rounds its bottom.</div>` : html`
          ${segField("Curve", c.curve ?? "straight", CHART_CURVE_OPTIONS,
            (v) => setChart((p) => { if (v === "straight") delete p.curve; else p.curve = v; }),
            { titles: {
                straight: "A straight line from each reading to the next",
                smooth: "A smooth line that never rises past the highest reading or dips under the lowest",
                step: "Each reading holds flat until the next one, the way a state does",
              },
              def: (base.curve as ChartCurve | undefined) ?? "straight" })}
          ${watchNote(host)}
          ${c.style === "area" ? html`
            ${segField("Fill", chartFillStyle(c.fillStyle), CHART_FILL_STYLE_OPTIONS,
              (v) => setChart((p) => { if (v === "flat") delete p.fillStyle; else p.fillStyle = v; }),
              { titles: {
                  flat: "One even wash under the line",
                  fade: "Strongest at the top of the plot, fading to clear at the baseline",
                },
                def: chartFillStyle(base.fillStyle) })}
            ${fallbackColorField("Fill colour", c.fillColorHex, "Line colour",
              (v) => setChart((p) => { if (v === undefined) delete p.fillColorHex; else p.fillColorHex = v; }, "fillcol"))}
            ${watchNote(host)}`
            : nothing}`}
        <div class="grid2">
          ${segField("Scale", c.scale, CHART_SCALES, (v) => setChart((p) => { p.scale = v; }),
            { titles: { auto: "The plot stretches to fit the readings it has", fixed: "The plot always runs from Min to Max" }, def: base.scale as typeof c.scale })}
          ${segField("Baseline", c.baseline, CHART_BASELINES, (v) => setChart((p) => { p.baseline = v; }), { def: base.baseline as typeof c.baseline })}
        </div>
        ${otherCharts.length === 0 ? nothing : selectField("Same scale as", borrowed ? c.scaleFrom! : "",
          [["", "Its own"] as [string, string], ...otherCharts.map((e): [string, string] => [e.payload.id, layerTitle(e, chartCtx)])],
          (v) => setChart((p) => { if (v) p.scaleFrom = v; else delete p.scaleFrom; }), { def: "" })}
        ${borrowed
          ? html`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`
          : nothing}
        ${!borrowed && c.scale === "fixed"
          ? html`<div class="grid2">
              ${numberField("Min", c.minValue, (v) => setChart((p) => { p.minValue = v ?? 0; }, "cmin"), { def: base.minValue as number })}
              ${numberField("Max", c.maxValue, (v) => setChart((p) => { p.maxValue = v ?? 100; }, "cmax"), { def: base.maxValue as number })}
            </div>`
          : nothing}
        <div class="hint">${c.baseline === "zero"
          ? "Bars grow from where zero falls, so a negative reading hangs below the line."
          : "Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${() => {
                let made: string | undefined;
                host.update((cfg) => { made = addChartSeries(cfg, id); });
                if (made) host.selectLayer(made);
              }}>${uiIcon("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        ${segField("Colour", c.coloring, CHART_COLORINGS, (v) => setChart((p) => {
          p.coloring = v;
          if (v === "bands" && p.bands.length === 0) p.bands = seedBands(shown);
        }), { def: base.coloring as typeof c.coloring })}
        ${colourRow("Main colour")}
        ${c.coloring === "bands" ? html`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${c.style === "bars"
              ? "Each bar is coloured on its own value."
              : "A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${bandTableFields(c, c.colorSlot.baseColorHex, setChart)}
          ${c.style === "area"
            ? html`${checkField("Band fill",c.fillBands,
                (v) => setChart((p) => { p.fillBands = v; }), base.fillBands as boolean)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`
            : nothing}`
          : nothing}`;
      // Every extra is a button that adds a layer, the same as Numbers and
      // Markers below, so the card has one kind of control. A button whose layer
      // is already on the chart shows a tick and stays pressed; the × in the list
      // at the bottom takes it off again.
      const anchoredAt = (at: "now" | "threshold") => chartMarkersOf(host.config, id).some((m) => m.payload.chartAnchor?.at === at);
      const timesOn = chartTimesOf(host.config, id).length > 0;
      const dotsOn = chartDotsOf(host.config, id).length > 0;
      const gridOn = chartGridsOf(host.config, id).length > 0;
      const zeroOn = chartZeroLinesOf(host.config, id).length > 0;
      const timesBlocked = chartShowsTimeLabels(c) ? undefined
        : everyReading && usingHistory
          ? "Clock times need evenly spaced readings: set Points to Average"
          : "Clock times need a recorded span: set Draw to Recorded history";
      const dotsBlocked = c.style === "bars" ? "Dots sit on a line or area chart: set Style to Line or Area" : undefined;
      const drawButton = (label: string, on: boolean, add: (cfg: CustomComplicationConfig) => void, blocked?: string) => html`
        <button class="small ${on ? "on" : ""}" ?disabled=${on || blocked !== undefined} aria-pressed=${on ? "true" : "false"}
          title=${on ? `${label} is on this chart. Remove it in the list at the bottom.` : blocked ?? `Add ${label.toLowerCase()} to this chart`}
          @click=${() => host.update((cfg) => { add(cfg); })}>${on ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}<span>${label}</span></button>`;
      chartMarks = html`
        <div class="field list-field"><span>Draw</span>
          <div class="adders">
            ${drawButton("Threshold line", anchoredAt("threshold"), (cfg) => setChartThreshold(cfg, id, c.thresholdValue ?? seedThreshold(shown)))}
            ${drawButton("Now line", anchoredAt("now"), (cfg) => setChartNow(cfg, id, true))}
            ${drawButton("Zero line", zeroOn, (cfg) => { addChartZeroLine(cfg, id); })}
            ${drawButton("Clock times", timesOn, (cfg) => { convertChartTimes(cfg, id); }, timesBlocked)}
            ${drawButton("Dots", dotsOn, (cfg) => { addChartDots(cfg, id); }, dotsBlocked)}
            ${drawButton("Grid lines", gridOn, (cfg) => { addChartGrid(cfg, id); })}
          </div>
        </div>
        ${zeroOn && !zeroCrossed
          ? html`<div class="hint warn">These readings never go below zero, or never above it, so the zero
              line is not drawn.</div>`
          : nothing}
        <div class="hint">Each button adds a layer to this chart, listed at the bottom. Click it there to set its
          value, colour, size and the rest: where the threshold sits and which reading is now are set on
          those lines.</div>
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
      const knownStates = timelineKnownStates(samples, spanSeconds,
        entityId === undefined ? undefined : host.hass.states[entityId]?.state,
        entityId?.split(".")[0]);
      content = html`
        ${valueEditor(host, t.value, (v) => setTimeline((p) => { p.value = v; }, "value"),
          { label: "States", noShare: true, key: `${key}-value` })}
        ${namesEntity ? nothing : html`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
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
          ? html`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`
          : nothing}
        ${samples.length > 0
          ? html`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${timelineReadout(samples, spanSeconds)}</span></span></div>`
          : nothing}
        ${timelineIsNumeric(samples)
          ? html`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`
          : nothing}`;
      look = html`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${timelineBandFields(t, setTimeline, knownStates, `wa-tl-states-${key.replace(/[^a-z0-9]/gi, "")}`)}
        ${knownStates.length > 2
          ? html`<div class="hint keep">Seen in this span: <span class="nums">${knownStates.filter((s) => s !== "unavailable" && s !== "unknown").join(", ")}</span>. Click into a State box to pick one.</div>`
          : nothing}
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
          door or a light usually wants.</div>
        ${timeLabelFields(t, setTimeline, base, "tl", html`
          <div class="hint">Clock times from the start of the span to now, evenly spaced. Four is what
            the history page on the watch shows. Auto follows the watch's own clock and drops the
            minutes past a three hour span.</div>`)}`;
      break;
    }
    case "shape":
      content = html`<div class="grid2">
          ${segField("Shape", el.payload.kind, [["roundedRectangle", "Rounded"], ["rectangle", "Rectangle"], ["capsule", "Capsule"], ["circle", "Circle"], ["line", "Line"]], (v) => upd((e) => { (e as typeof el).payload.kind = v; }),
            { titles: { roundedRectangle: "Rounded rectangle", line: "A rule along the frame's long side" }, def: base.kind as typeof el.payload.kind })}
          ${el.payload.kind === "roundedRectangle" ? numberField("Corner radius", el.payload.cornerRadius, (v) => upd((e) => { (e as typeof el).payload.cornerRadius = v ?? 6; }, "radius"), { step: 0.5, min: 0, def: base.cornerRadius as number, unit: "pt" }) : nothing}
        </div>
        ${el.payload.kind === "line" ? lineOrientationField(family, f, setFrame) : nothing}`;
      // A line has no border and no corners: its colour is the whole drawing, so
      // the Look card offers its thickness instead.
      look = el.payload.kind === "line"
        ? numberField("Thickness", el.payload.thickness, (v) => upd((e) => { (e as typeof el).payload.thickness = v ?? 1; }, "thick"), { step: 0.5, min: 0.5, def: base.thickness as number, unit: "pt" })
        : html`
        ${colorField("Border colour", el.payload.borderColorHex, (v) => upd((e) => { if (v === undefined) delete (e as typeof el).payload.borderColorHex; else (e as typeof el).payload.borderColorHex = v; }, "border"), true, null)}
        ${el.payload.borderColorHex !== undefined ? numberField("Border width", el.payload.borderWidth, (v) => upd((e) => { (e as typeof el).payload.borderWidth = v ?? 1; }, "bw"), { step: 0.5, min: 0, def: base.borderWidth as number, unit: "pt" }) : nothing}`;
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
        ${segField("Source", img.source, [["camera", "Camera"], ["entityPicture", "Entity picture"]],
          (v) => setImage((p) => { p.source = v; }),
          { titles: {
              camera: "A snapshot from a camera entity",
              entityPicture: "The picture an entity already carries: a person's photo, cover art, a weather icon",
            }, def: base.source as typeof img.source })}
        ${img.source === "camera"
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
          { titles: { fill: "Cover the frame, cropping what does not fit", fit: "Show the whole picture, with space around it" }, def: base.contentMode as typeof img.contentMode })}
        ${sliderField("Zoom", img.zoom, (v) => setImage((p) => { p.zoom = v; }, "zoom"),
          { min: MIN_ZOOM, max: 4, step: 0.05, def: 1, format: (v) => `${v.toFixed(2)}x`, unit: "x" })}
        ${sliderField("Pan left/right", img.panX, (v) => setImage((p) => { p.panX = v; }, "panx"),
          { min: -1, max: 1, step: 0.02, def: 0 })}
        ${sliderField("Pan up/down", img.panY, (v) => setImage((p) => { p.panY = v; }, "pany"),
          { min: -1, max: 1, step: 0.02, def: 0 })}
        <div class=${img.contentMode === "fit" && img.zoom === 1 ? "hint keep" : "hint"}>${imagePanHint(img)}</div>
        ${numberField("Corner radius", img.cornerRadius, (v) => setImage((p) => { p.cornerRadius = Math.max(0, v ?? IMAGE_DEFAULT_CORNER_RADIUS); }, "imgradius"), { step: 1, min: 0, def: IMAGE_DEFAULT_CORNER_RADIUS, unit: "pt" })}`;
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
      const chart = linked?.kind === "chart" ? linked : undefined;
      content = html`
        <div class="field readout"><span>Chart</span><span class="readout-v">${chart
          ? html`<button class="small" title="Select that chart" @click=${() => host.selectLayer(chart.payload.id)}>${layerTitle(chart, describeContext(host))}</button>`
          : "None"}</span></div>
        ${chart === undefined
          ? html`<div class="hint warn">The chart these times belonged to is gone, so this layer draws nothing.</div>`
          : chartShowsTimeLabels(chart.payload)
            ? nothing
            : html`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                or Long-term statistics.</div>`}
        <div class="hint">The clock times of that chart's span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`;
      look = timeLabelFields(t, setTimes, base, "ct", html`
        <div class="hint">Evenly spaced from the start of the chart's span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);
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
          ${fallbackColorField("Dot colour", d.colorHex, "Series colour",
            (v) => setDots((p) => { if (v === undefined) delete p.colorHex; else p.colorHex = v; }, "dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;
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
        ${colorField("Colour", g.colorHex, (v) => setGrid((p) => { p.colorHex = v ?? CHART_DEFAULT_GRID_HEX; }, "gridcol"), false, CHART_DEFAULT_GRID_HEX)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;
      break;
    }
  }

  const colour = colourPlaced || elementColour(el) === undefined
    ? undefined
    : colourRow(el.kind === "shape" ? "Fill colour" : el.kind === "text" && textUsesParts(el.payload) ? "Layer colour" : "Colour");

  // A layer already bound to an entity is what a new states table tests, so the
  // entity is asked for once at the top of this editor and never again.
  const ref = elementEntity(host.config, el);
  const tested: Value | undefined = ref ? { kind: { kind: "entityState", ...ref } } : undefined;
  const stamp = el.kind === "image" ? el.payload.timestamp === true : false;
  const textParts = el.kind === "text" && (el.payload.parts?.length ?? 0) > 0 ? el.payload.parts : undefined;

  // Which fields each card owns, for its header reset. Content is what the
  // layer says; look is how it is drawn. Per-shape size overrides count as
  // look too, since that is the box they are typed into.
  const contentKeys = CONTENT_KEYS[el.kind];
  const lookKeys = LOOK_KEYS[el.kind];
  const contentChanged = anyDiffers(el.payload, base, contentKeys);
  const sizeKey = el.kind === "text" ? "fontSize" : el.kind === "icon" ? "size" : el.kind === "gauge" || el.kind === "chart" ? "lineWidth" : undefined;
  const sizedHere = host.config.perFamily[family]?.placements[id]?.size !== undefined;
  const lookChanged = anyDiffers(el.payload, base, lookKeys)
    || (sizeKey !== undefined && eff.size !== undefined && eff.size !== base[sizeKey]);
  const labels = chartLabelsOf(host.config, id);
  // Every card's reset is one update, so one Undo takes the whole card back.
  const resetKeys = (keys: readonly string[], k: string) => () => upd((e) => restoreKeys(e.payload, base, keys), k);

  return html`
    ${card(host, "content", "Content", html`${el.kind === "tap" || el.kind === "text" || el.kind === "chartTimes" || el.kind === "chartDots" || el.kind === "chartGrid" ? nothing : layerEntityField(host, el, key)}${content}`,
      { color: SECTION_COLOR.content, icon: "content", summary: contentSummary(host, el),
        ...(contentChanged ? { reset: () => upd((e) => {
          restoreKeys(e.payload, base, contentKeys);
          // Parts going with the reset leave no part for a state to aim at.
          if (e.kind === "text") dropPartIds(e.payload.rules);
        }, "reset-content") } : {}) })}
    ${look === undefined && colour === undefined ? nothing
      : card(host, "look", el.kind === "image" ? "Picture" : "Look", html`${look ?? nothing}${colour ?? nothing}`,
        { color: SECTION_COLOR.look, icon: el.kind === "image" ? "image" : "look", ...(lookSummary(el) ? { summary: lookSummary(el)! } : {}),
          ...(lookChanged ? { reset: () => host.update((c) => {
            restoreKeys(c.elements[idx]!.payload, base, lookKeys);
            if (sizedHere) setPlacement(c, family, id, {}, true);
          }) } : {}) })}
    ${el.kind === "chart" ? card(host, "numbers", "Extras", chartExtrasSection(host, el, chartMarks),
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
    ${el.kind === "image" ? card(host, "timestamp", "Timestamp", imageTimestampSection(el.payload, (m, k) => upd((e) => m((e as typeof el).payload), k)),
      { color: SECTION_COLOR.numbers, icon: "clock", summary: stamp ? `Shown · ${el.payload.timestampSize} pt` : "Hidden",
        ...(stamp ? { reset: resetKeys(TIMESTAMP_KEYS, "reset-stamp") } : {}) }) : nothing}
    ${card(host, "states", "States", statesEditor(host, el.payload.rules, el.kind,
      (c) => c.elements.find((e) => e.payload.id === id)?.payload.rules, `rules-${id}`, tested, textParts),
      { color: SECTION_COLOR.states, icon: "states", summary: statesSummary(el.payload.rules).replace(/\.$/, ""),
        ...(el.payload.rules.length > 0 ? { reset: () => upd((e) => { e.payload.rules = []; }) } : {}) })}
    ${opts.placement === false ? nothing : placementCard(host, el, family)}
    ${opts.tap === false ? nothing : tapCard(host, el)}`;
}

/** The payload fields the Timestamp card owns. Pictures only. */
const TIMESTAMP_KEYS = ["timestamp", "timestampCorner", "timestampSize"] as const;

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
};

/** The payload fields the Look card owns, per kind. A chart's marks on the plot
 * are not here: they live in its Extras card (`CHART_EXTRAS_KEYS`). */
const LOOK_KEYS: Record<CElement["kind"], readonly string[]> = {
  text: ["fontSize", "fontWeight", "colorSlot", "alignment", "lineLimit", "monospacedDigits",
    "coloring", "bands", "bandAboveColorHex", "highlight", "highColorHex", "lowColorHex"],
  icon: ["size", "colorSlot"],
  gauge: ["style", "lineWidth", "trackColorHex", "colorSlot", "coloring", "bands", "bandAboveColorHex", "thresholdValue", "thresholdColorHex"],
  chart: ["style", "scale", "minValue", "maxValue", "baseline", "barGap", "lineWidth", "coloring", "bands", "bandAboveColorHex", "fillBands", "curve", "fillStyle", "fillColorHex", "barRadius", "barCorners", "scaleFrom", "colorSlot"],
  timeline: ["bands", "otherColorHex", "gap", "cornerRadius", "labelSize", "labelColorHex", "labelsAbove", "timeLabelCount", "hourCycle", "minutes"],
  shape: ["colorSlot", "borderColorHex", "borderWidth", "thickness"],
  image: ["contentMode", "zoom", "panX", "panY", "cornerRadius"],
  tap: [],
  chartTimes: ["timeLabelCount", "labelSize", "labelColorHex", "hourCycle", "minutes"],
  chartDots: ["dots", "size", "colorHex"],
  chartGrid: ["lines", "colorHex", "thickness"],
};

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

/**
 * The action form behind a tap: what it does, the entity it does it to, and
 * the page picker for Open the page. Shared by a free-standing tap layer's own
 * editor and by the Tappable section below, so the two can never drift apart.
 */
export function tapActionEditor(
  host: EditorHost,
  tap: TapElement,
  upd: (mutate: (p: TapElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const action = tap.action;
  return html`
    ${selectField("Tap action", action.type, LAYER_TAP_TYPES, (v) => upd((p) => {
      p.action = tapActionForType(v, p.action);
      if (v !== "openPage") { delete p.openPageId; delete p.openPageName; }
    }))}
    ${"entityId" in action ? entityField(host, "Target", action, (ref) => upd((p) => { p.action = { type: action.type, ...ref }; }, "tap-entity"), `${key}-tap`) : nothing}
    ${action.type === "callService"
      ? callServiceFields(host, action, (next, k) => upd((p) => { p.action = next; }, k), `${key}-tap`)
      : nothing}
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
    if (family === "inline" || !host.config.supportedFamilies.includes(family)) continue;
    const size = tapPointSize(host.config, tapId, family as "rectangular" | "circular" | "corner");
    if (!size) continue;
    parts.push(`${familyTitle(family)} ${Math.round(size.width)} x ${Math.round(size.height)} pt`);
    smallest = Math.min(smallest, size.width, size.height);
  }
  if (parts.length === 0) return nothing;
  const small = smallest < SMALL_TAP_POINTS;
  return html`<div class="field readout"><span>Tap size</span><span class="readout-v">${parts.join(" · ")}</span></div>
    ${small ? html`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>` : nothing}`;
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
  if (labels.length === 0 && markers.length === 0 && times.length === 0 && dots.length === 0 && grids.length === 0) return "None yet";
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
 * Both are ordinary layers in the chart's group, dragged, sized, coloured and
 * given states like any other; this card only lists them and hands the selection
 * over. That is the whole design: a number is a text layer with a `chartStat`
 * value, a marker is any layer with a `chartAnchor`, and neither is a setting on
 * the chart that has to be invented twice.
 */
function chartExtrasSection(host: EditorHost, el: Extract<CElement, { kind: "chart" }>, marks: TemplateResult | undefined): TemplateResult {
  const ctx = describeContext(host);
  const labels = chartLabelsOf(host.config, el.payload.id);
  const times = chartTimesOf(host.config, el.payload.id);
  const dots = chartDotsOf(host.config, el.payload.id);
  const grids = chartGridsOf(host.config, el.payload.id);
  const markers = chartMarkersOf(host.config, el.payload.id);
  // The chart stays selected after an add: the next click is usually another
  // number, and the new one is one click away in the list above the buttons.
  const add = (stat: ChartStat) => host.update((c) => { addChartLabel(c, el.payload.id, stat); });
  const addMarker = (at: ChartAnchorPoint) => host.update((c) => { addChartMarker(c, el.payload.id, at); });
  const taken = new Set(labels.map((l) => (l.payload.value.kind.kind === "chartStat" ? l.payload.value.kind.stat : "")));
  const markedAlready = new Set(markers.map((m) => m.payload.chartAnchor!.at));
  // One row per layer: a lead that shows what it draws, a name, and what kind of
  // layer it is underneath, so a marker and a line on the same reading tell apart.
  const row = (id: string, lead: unknown, title: string, kind: string) => html`
    <div class="num-row">
      <button class="num-pick" title=${`Edit this ${kind.toLowerCase()}`} @click=${() => host.selectLayer(id)}>
        <span class="num-lead">${lead}</span>
        <span class="num-text"><span class="num-title">${title}</span><span class="num-kind">${kind}</span></span>
      </button>
      <button class="icon danger" title=${`Delete this ${kind.toLowerCase()}`} aria-label=${`Delete this ${kind.toLowerCase()}`}
        @click=${() => host.update((c) => removeElement(c, id))}>${uiIcon("close")}</button>
    </div>`;
  const count = labels.length + markers.length + times.length + dots.length + grids.length;
  return html`
    <div class="hint">Everything the chart shows besides its readings: a threshold, now, clock times, numbers
      and markers. Each one is a layer in this chart's group, so you can drag it and give it any size or colour.</div>
    ${marks ?? nothing}
    ${count === 0
      ? html`<div class="hint keep">A chart on its own shows that a reading moved, not what it moved to and not
          which reading was the day's best. Add a number or a marker below and it appears as a layer in this chart's
          group: drag it anywhere, give it any size or colour, and it follows the live value.</div>`
      : nothing}
    <div class="field list-field"><span>Numbers</span>
      <div class="adders">
        ${CHART_STATS.map(([stat, label]) => html`
          <button class="small ${taken.has(stat) ? "on" : ""}" title=${taken.has(stat) ? `Add another ${label.toLowerCase()}` : `Add the ${label.toLowerCase()}`}
            @click=${() => add(stat)}>${taken.has(stat) ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}<span>${label}</span></button>`)}
      </div>
    </div>
    <div class="hint">The newest reading, the change and the total start with the entity's unit after them. The change is the newest reading minus the first, and the trend arrow is that change as ↑, ↓ or →, flat when it is too small for the chart to print. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>
    <div class="field list-field"><span>Markers</span>
      <div class="adders">
        ${CHART_ANCHOR_POINTS.filter(([at]) => chartAnchorIsColumn(at)).map(([at, label]) => html`
          <button class="small ${markedAlready.has(at) ? "on" : ""}" title=${markedAlready.has(at) ? `Add another mark over the ${label.toLowerCase()}` : `Mark the ${label.toLowerCase()}`}
            @click=${() => addMarker(at)}>${markedAlready.has(at) ? html`<span aria-hidden="true">✓</span>` : uiIcon("plus")}<span>${label}</span></button>`)}
      </div>
    </div>
    <div class="hint">A marker starts as an icon over the reading it names: a triangle over the highest, a dot over
      the lowest. Pick any other icon for it in its Content card. It hangs in the empty space above its own bar rather than in a
      band along the top, so the bars keep their full height, and it is pushed back down rather than off the chart
      when the bar is already tall. Its Position card sets which reading it follows and which side of the bar it
      sits on.</div>
    ${count === 0 ? nothing : html`
      <div class="shown-head">On this chart <span class="shown-count">${count}</span></div>
      <div class="chart-numbers">
        ${labels.map((l) => row(l.payload.id, host.resolve(l.payload.value) ?? "--", layerTitle(l, ctx), "Number"))}
        ${markers.map((m) => {
          const { at, place } = m.payload.chartAnchor!;
          const name = CHART_ANCHOR_POINTS.find(([k]) => k === at)?.[1] ?? "Reading";
          if (place === "through") return row(m.payload.id, at === "now" ? "│" : "─", at === "zero" ? "Zero" : name, "Line");
          const glyph = m.kind === "text" ? (host.resolve(m.payload.value) ?? "●")
            : m.kind === "icon" ? markerGlyph(host.resolve(m.payload.symbol)) : "◆";
          return row(m.payload.id, glyph, name, "Marker");
        })}
        ${times.map((t) => row(t.payload.id, uiIcon("clock"), "Clock times", "Times"))}
        ${dots.map((d) => row(d.payload.id, uiIcon("chartDots"), "Reading dots", "Dots"))}
        ${grids.map((g) => row(g.payload.id, uiIcon("chartGrid"), "Grid lines", "Grid"))}
      </div>
      <div class="hint">Click a row to edit that layer. The × deletes it, and Undo brings it back. Dots and grid
        lines always sit on the chart, so on the preview a click on the chart selects the chart; click right on a
        dot to pick the dots.</div>`}`;
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
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${host.tapAreaShown ? "on" : ""}" aria-pressed=${host.tapAreaShown ? "true" : "false"}
                title=${host.tapAreaShown ? "Back to the normal face" : "Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${() => host.showTapArea(!host.tapAreaShown)}><span class="glyph">☞</span>${host.tapAreaShown ? "Hide" : "Show"}</button>
              ${!isZeroOutset((attached.payload as TapElement).outset)
                ? html`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${() => updTap((p) => { p.outset = { ...ZERO_OUTSET }; })}>${uiIcon("reset")}</button>`
                : nothing}
            </div>
          </div>
        </div>
        ${tapSizeHint(host, attached.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`
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
  // A chart extra is named for what it marks. Its own content is a glyph or a
  // bare line, which says nothing in a list of five of them.
  const anchor = el.payload.chartAnchor;
  if (anchor !== undefined) {
    const name = CHART_ANCHOR_POINTS.find(([k]) => k === anchor.at)?.[1] ?? "Reading";
    return anchor.place === "through" ? `${name} line` : `${name} marker`;
  }
  switch (el.kind) {
    case "text": return unquote(describeValue(el.payload.value, ctx));
    case "icon": return unquote(describeValue(el.payload.symbol, ctx));
    case "gauge": return describeValue(el.payload.value, ctx);
    case "chart": return describeValue(el.payload.value, ctx);
    case "timeline": return describeValue(el.payload.value, ctx);
    case "shape": return el.payload.kind === "roundedRectangle" ? "Rounded rectangle" : el.payload.kind;
    case "image": {
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
  }
}

/**
 * A group's own card: its name, whether it moves as one, and what is in it.
 * The members' own settings stay on the members; a group is a handle on
 * several layers, not another kind of layer.
 */
export function groupEditor(host: EditorHost, group: LayerGroup): TemplateResult {
  const members = groupMembers(host.config, group.id);
  const ctx = describeContext(host);
  const upd = (m: (g: LayerGroup) => void, k?: string) => host.update((c) => { const g = c.groups?.find((x) => x.id === group.id); if (g) m(g); }, k ? `group-${group.id}-${k}` : undefined);
  return card(host, "content", "Group", html`
    ${textField("Name", group.name, (v) => upd((g) => { g.name = v; }, "name"))}
    ${checkField("Move as one",group.locked, (v) => upd((g) => { g.locked = v; }))}
    <div class="hint">${group.locked
      ? "Locked: a drag on any of these layers moves all of them. Unlock to move one at a time."
      : "Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="field list-field"><span>Layers</span>
      <span class="readout-v">${members.map((m) => layerTitle(m, ctx)).join(", ")}</span>
      <div class="row-acts">
        <button class="small" title="Keep the layers where they are and drop the folder" @click=${() => host.update((c) => ungroup(c, group.id))}>Ungroup</button>
      </div>
    </div>
    <div class="hint">Click a layer in the list to edit it.</div>`,
    { color: SECTION_COLOR.group, icon: "folder", summary: `${members.length} layers · ${group.locked ? "moves as one" : "unlocked"}` });
}

// ── Family layout ─────────────────────────────────────────────────────────

export function familyEditor(host: EditorHost, family: FamilyKind): TemplateResult {
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
  const bg = layout.backgroundColorHex ? colorWords(layout.backgroundColorHex) : "transparent";
  const border = layout.borderColorHex ? `${layout.borderWidth} pt ${colorWords(layout.borderColorHex)} border` : "no border";
  return html`
    ${card(host, "look", `${familyTitle(family)} shape`, html`
      ${colorField("Background (blank = transparent)", layout.backgroundColorHex, (v) => upd((l) => { if (v === undefined) delete l.backgroundColorHex; else l.backgroundColorHex = v; }, "bg"), true, null)}
      ${colorField("Border colour", layout.borderColorHex, (v) => upd((l) => { if (v === undefined) delete l.borderColorHex; else l.borderColorHex = v; }, "border"), true, null)}
      ${numberField("Border width", layout.borderWidth, (v) => upd((l) => { l.borderWidth = v ?? 2; }, "bw"), { step: 0.5, min: 0, def: 2, unit: "pt" })}`,
      { color: SECTION_COLOR.look, icon: "shape", summary: `${bg} · ${border}`,
        ...(layout.backgroundColorHex !== undefined || layout.borderColorHex !== undefined || layout.borderWidth !== 2
          ? { reset: () => upd((l) => { delete l.backgroundColorHex; delete l.borderColorHex; l.borderWidth = 2; }, "reset-look") } : {}) })}
    ${family === "corner" ? card(host, "corner", "Corner content", cornerEditor(host, layout, upd),
      { color: SECTION_COLOR.content, icon: "content", summary: layout.curvedText ? "Big curved text" : "Layer canvas",
        ...(layout.curvedText !== undefined || layout.bezelText !== undefined || layout.bezelGauge !== undefined
          ? { reset: () => upd((l) => { delete l.curvedText; delete l.bezelText; delete l.bezelGauge; }, "reset-corner") } : {}) }) : nothing}
    ${card(host, "states", "Shape states", statesEditor(host, layout.rules, "layout", (c) => c.perFamily[family]?.rules, `rules-${family}`),
      { color: SECTION_COLOR.states, icon: "states", summary: statesSummary(layout.rules).replace(/\.$/, ""),
        ...(layout.rules.length > 0 ? { reset: () => upd((l) => { l.rules = []; }, "reset-states") } : {}) })}
    ${card(host, "placements", "Layers", html`
      <div class="hint keep">${placed === 0
        ? `Nothing is on the ${familyTitle(family)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`
        : `${placed} layer${placed === 1 ? " is" : "s are"} on the ${familyTitle(family)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,
      { color: SECTION_COLOR.position, icon: "place", summary: placed === 0 ? "Nothing on it" : `${placed} layer${placed === 1 ? "" : "s"}` })}`;
}

/** The Inline shape: one line of text, no canvas. The watch draws
 * `symbol label: value` and drops the label when the face is narrow. The
 * value is the same control a text layer uses, so an entity, an attribute or
 * a template all work; the symbol is the same picker an icon layer uses. */
function inlineEditor(host: EditorHost): TemplateResult {
  const inline = host.config.inline;
  if (!inline) {
    return html`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${() => host.addFamily("inline")}>Add Inline text</button>`;
  }
  const upd = (mutate: (i: NonNullable<CustomComplicationConfig["inline"]>) => void, k?: string) => host.update((c) => { if (c.inline) mutate(c.inline); }, k ? `inline-${k}` : undefined);
  const ctx = describeContext(host);
  return html`
    ${card(host, "content", "Inline text", html`
      ${textField("Label (blank = value only)", inline.label ?? "", (v) => upd((i) => { if (v) i.label = v; else delete i.label; }, "label"))}
      ${valueEditor(host, inline.value, (v) => upd((i) => { i.value = v; }, "value"), { showResolved: true, label: "Text", key: "inline-value" })}
      ${countdownFields(host, inline.countdown === true, inline.value, (v) => upd((i) => { if (v) i.countdown = true; else delete i.countdown; }))}`,
      { color: SECTION_COLOR.content, icon: "text", summary: truncate(`${inline.label ? `${inline.label}: ` : ""}${describeValue(inline.value, ctx)}`, 48) })}
    ${card(host, "symbol", "Symbol", html`
      ${symbolField(host, inline.symbol ?? "", (v) => upd((i) => { if (v) i.symbol = v; else delete i.symbol; }, "symbol"), "inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${inline.symbol ? `${inline.symbol} ` : ""}${inline.label ? `${inline.label}: ` : ""}${host.resolve(inline.value) ?? "--"}</span></div>`,
      { color: SECTION_COLOR.look, icon: "icon", summary: inline.symbol || "None" })}`;
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
    ${segField("Main content", mode, [["canvas", "Layer canvas"], ["curved", "Big curved text"]], (v) => upd((l) => {
      if (v === "curved") { if (!l.curvedText) l.curvedText = literal("Text"); }
      else { delete l.curvedText; delete l.curvedColorHex; }
    }))}
    ${mode === "curved" && layout.curvedText ? html`
      ${valueEditor(host, layout.curvedText, (val) => upd((l) => { l.curvedText = val; }, "curved"), { showResolved: true, label: "Curved text", key: "fam-corner-curved" })}
      ${colorField("Curved text colour", layout.curvedColorHex ?? "#FFFFFF", (v) => upd((l) => { if (v === undefined) delete l.curvedColorHex; else l.curvedColorHex = v; }, "curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    ` : nothing}
    ${segField("Bezel", bezelKind, [["none", "None"], ["text", "Text label"], ["gauge", "Gauge arc"]], (v) => upd((l) => {
      if (v === "text") { delete l.bezelGauge; if (!l.bezelText) l.bezelText = literal("Label"); }
      else if (v === "gauge") { delete l.bezelText; if (!l.bezelGauge) l.bezelGauge = { value: literal("50"), minValue: 0, maxValue: 100, colorHexes: ["#34C759", "#FFCC00", "#FF3B30"] }; }
      else { delete l.bezelText; delete l.bezelGauge; }
    }))}
    ${bezelKind === "text" && layout.bezelText ? html`
      ${valueEditor(host, layout.bezelText, (val) => upd((l) => { l.bezelText = val; }, "bezel"), { showResolved: true, label: "Bezel label", key: "fam-corner-bezel" })}
      ${countdownFields(host, layout.bezelCountdown === true, layout.bezelText, (v) => upd((l) => {
        if (v) l.bezelCountdown = true; else delete l.bezelCountdown;
      }))}` : nothing}
    ${bezelKind === "gauge" && layout.bezelGauge ? bezelGaugeEditor(host, layout.bezelGauge, upd) : nothing}`;
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
    ${colorField("Arc colour (min end)", stops[0], setStop(0))}
    ${colorField("Arc colour (middle)", stops[1], setStop(1))}
    ${colorField("Arc colour (max end)", stops[2], setStop(2))}
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
  setColor: "Set colour", setOpacity: "Set opacity", setText: "Set text", setIcon: "Set icon",
  setFontSize: "Set size", setFontWeight: "Set weight", setRotation: "Set rotation",
  hide: "Hide", show: "Show", setGaugeValue: "Set gauge value", setGaugeMin: "Set gauge min", setGaugeMax: "Set gauge max",
  setBorderColor: "Set border colour", setBorderWidth: "Set border width", setBackgroundColor: "Set background colour",
};

const CHANGE_KINDS = Object.keys(CHANGE_LABELS) as StyleChangeKind[];

/** What a rule aimed at one part of a rich text layer can change. Anything
 * else such a rule sets is ignored, on the watch and in the preview. */
export const PART_RULE_PROPERTIES: readonly StyleProperty[] = ["color", "text", "fontSize", "fontWeight", "visibility"];

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
export function rulesEditor(host: EditorHost, rules: Rule[], target: RuleTarget, locate: (cfg: CustomComplicationConfig) => Rule[] | undefined, key: string, parts?: readonly TextPart[]): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) => host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);
  return html`
    ${rules.length === 0 ? html`<div class="hint keep">No rules yet. A rule checks values and changes how this ${target === "layout" ? "family" : "layer"} looks.</div>` : nothing}
    ${rules.map((rule, ri) => ruleEditor(host, rule, ri, rules.length, target, upd, `${key}-${rule.id}`, parts))}
    <div class="adders"><button class="small" @click=${() => upd((r) => { r.push(newRule()); })}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`;
}

function ruleEditor(host: EditorHost, rule: Rule, ri: number, count: number, target: RuleTarget, upd: (m: (rules: Rule[]) => void, k?: string) => void, key: string, parts?: readonly TextPart[]): TemplateResult {
  const live = host.liveBranch(rule);
  const current = host.forced.get(rule.id) ?? "live";
  const isActive = (v: string) => (current === "live" ? v === "live" : current === "otherwise" ? v === "otherwise" : current.caseId === v);
  const updRule = (m: (r: Rule) => void, k?: string) => upd((rs) => { const r = rs.find((x) => x.id === rule.id); if (r) m(r); }, k);
  const forPart = parts !== undefined && rule.partId !== undefined;
  return html`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${ri + 1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${ri === 0} @click=${() => upd((rs) => moveItem(rs, ri, ri - 1))}>${uiIcon("up")}</button>
      <button class="icon" title="Move down" ?disabled=${ri === count - 1} @click=${() => upd((rs) => moveItem(rs, ri, ri + 1))}>${uiIcon("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${() => upd((rs) => { const i = rs.findIndex((x) => x.id === rule.id); if (i >= 0) rs.splice(i, 1); })}>${uiIcon("delete")}</button>
    </div>
    ${parts === undefined ? nothing : partTargetField(parts, rule.partId, describeContext(host), (id) => updRule((r) => {
      if (id) r.partId = id; else delete r.partId;
    }))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${isActive("live") ? "active" : ""} @click=${() => host.setForced(rule.id, "live")}>Live</button>
        ${rule.cases.map((c, i) => html`<button class="${isActive(c.id) ? "active" : ""} ${live === c.id ? "live-match" : ""}" @click=${() => host.setForced(rule.id, { caseId: c.id })}>Case ${i + 1}</button>`)}
        ${rule.otherwise ? html`<button class="${isActive("otherwise") ? "active" : ""} ${live === "otherwise" ? "live-match" : ""}" @click=${() => host.setForced(rule.id, "otherwise")}>Otherwise</button>` : nothing}
      </div>
    </div>
    ${rule.cases.map((c, ci) => caseEditor(host, c, ci, rule, target, updRule, `${key}-${c.id}`, forPart))}
    <div class="adders"><button class="small" @click=${() => updRule((r) => { r.cases.push(newCase()); })}>+ case</button></div>
    ${checkField("Otherwise",rule.otherwise !== undefined, (v) => updRule((r) => { if (v) r.otherwise = r.otherwise ?? []; else delete r.otherwise; }))}
    ${rule.otherwise
      ? html`<div class="case-box otherwise">
          <div class="hint keep">${live === "otherwise" ? html`<b>Active now.</b> ` : nothing}Changes when no case matches:</div>
          ${changesEditor(host, rule.otherwise, target, (m) => updRule((r) => { if (r.otherwise) m(r.otherwise); }), `${key}-otherwise`, forPart)}
        </div>`
      : nothing}
  </div>`;
}

function caseEditor(host: EditorHost, c: RuleCase, ci: number, rule: Rule, target: RuleTarget, updRule: (m: (r: Rule) => void, k?: string) => void, key: string, forPart = false): TemplateResult {
  const updCase = (m: (c: RuleCase) => void, k?: string) => updRule((r) => { const x = r.cases.find((y) => y.id === c.id); if (x) m(x); }, k);
  const matches = host.liveBranch(rule) === c.id;
  return html`<div class="case-box ${matches ? "match" : ""}">
    <div class="rule-head">
      <span>Case ${ci + 1}${matches ? html` <span class="ok">· active now</span>` : nothing}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${ci === 0} @click=${() => updRule((r) => moveItem(r.cases, ci, ci - 1))}>${uiIcon("up")}</button>
      <button class="icon" title="Move down" ?disabled=${ci === rule.cases.length - 1} @click=${() => updRule((r) => moveItem(r.cases, ci, ci + 1))}>${uiIcon("down")}</button>
      <button class="icon danger" title="Delete case" @click=${() => updRule((r) => { const i = r.cases.findIndex((y) => y.id === c.id); if (i >= 0) r.cases.splice(i, 1); })}>${uiIcon("delete")}</button>
    </div>
    <div class="row-inline">
      ${segField("When", c.when.join, [["all", "All of these are true"], ["any", "Any of these is true"]], (v) => updCase((x) => { x.when.join = v; }))}
    </div>
    ${c.when.tests.length === 0 ? html`<div class="hint keep">No tests: this case always matches.</div>` : nothing}
    ${c.when.tests.map((t, ti) => testEditor(host, t, ti, (m) => updCase((x) => { const y = x.when.tests.find((z) => z.id === t.id); if (y) m(y); }), () => updCase((x) => { x.when.tests = x.when.tests.filter((z) => z.id !== t.id); }), `${key}-${t.id}`))}
    <div class="adders">
      <button class="small" @click=${() => updCase((x) => { x.when.tests.push(newTest()); })}>+ test</button>
      <select class="adder" @change=${(e: Event) => {
        const sel = e.target as HTMLSelectElement;
        const kind = sel.value as RulePresetKind | "";
        sel.value = "";
        if (!kind) return;
        const tests = rulePresetTests(kind, sunRef(host.hass?.states));
        updCase((x) => { x.when.tests.push(...tests); });
      }}>
        <option value="">+ preset…</option>
        ${RULE_PRESETS.map((p) => html`<option value=${p.kind} title=${p.hint}>${p.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${changesEditor(host, c.then, target, (m) => updCase((x) => m(x.then)), `${key}-then`, forPart)}
  </div>`;
}

function testEditor(host: EditorHost, t: import("./model.js").Test, ti: number, updTest: (m: (t: import("./model.js").Test) => void, k?: string) => void, remove: () => void, key: string): TemplateResult {
  const upd = (m: (t: import("./model.js").Test) => void, k?: string) => updTest(m, k ? `${key}-${k}` : undefined);
  const c = t.comparison;
  const operand = comparisonOperand(c.kind);
  const result = host.evaluateTest(t);
  let extra: TemplateResult | typeof nothing = nothing;
  switch (operand) {
    case "value":
      extra = valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, label: "Compare with", key: `${key}-rhs` });
      break;
    case "between":
      extra = html`${valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, label: "Lower bound", key: `${key}-rhs` })}
        ${valueEditor(host, c.upper ?? literal(""), (v) => upd((x) => { x.comparison.upper = v; }, "upper"), { showResolved: true, label: "Upper bound", key: `${key}-upper` })}`;
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
      break;
  }
  return html`<div class="test-box">
    <div class="rule-head">
      <span>Test ${ti + 1} <span class=${result ? "ok" : "no"}>${result ? "✓ true now" : "✗ false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${remove}>${uiIcon("delete")}</button>
    </div>
    ${c.kind === "isStale"
      ? html`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`
      : valueEditor(host, t.value, (v) => upd((x) => { x.value = v; }, "lhs"), { showResolved: true, label: "Value", key: `${key}-lhs` })}
    ${selectField("Comparison", c.kind, COMPARISON_KINDS.map((k): [ComparisonKind, string] => [k, COMPARISON_LABELS[k]]), (v) => upd((x) => { x.comparison = switchComparison(x.comparison, v); }))}
    ${extra}
  </div>`;
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

function changesEditor(host: EditorHost, changes: StyleChange[], target: RuleTarget, updList: (m: (list: StyleChange[]) => void, k?: string) => void, key: string, forPart = false): TemplateResult {
  const allowed = changeKindsFor(target, forPart);
  return html`
    ${changes.length === 0 ? html`<div class="hint keep">No changes.</div>` : nothing}
    ${changes.map((ch, i) => changeEditor(host, ch, i, target, (m, k) => updList((list) => { if (list[i]) m(list[i]!); }, k ? `${key}-${i}-${k}` : undefined), () => updList((list) => { list.splice(i, 1); }), `${key}-${i}`, forPart))}
    <select class="adder" @change=${(e: Event) => { const sel = e.target as HTMLSelectElement; const kind = sel.value as StyleChangeKind; sel.value = ""; if (kind) updList((list) => { list.push(newStyleChange(kind)); }); }}>
      <option value="">+ change…</option>
      ${allowed.map((k) => html`<option value=${k}>${CHANGE_LABELS[k]}</option>`)}
    </select>`;
}

const COLOR_KINDS: StyleChangeKind[] = ["setColor", "setBorderColor", "setBackgroundColor"];

function changeEditor(host: EditorHost, ch: StyleChange, i: number, target: RuleTarget, upd: (m: (c: StyleChange) => void, k?: string) => void, remove: () => void, key: string, forPart = false): TemplateResult {
  const ignored = !RULE_TARGET_PROPERTIES[target].includes(STYLE_PROPERTY[ch.kind]);
  // Aiming a rule at a part keeps the changes it already had, marked, rather
  // than deleting the ones a part does not read.
  const partIgnores = forPart && !ignored && !PART_RULE_PROPERTIES.includes(STYLE_PROPERTY[ch.kind]);
  return html`<div class="change-box">
    <div class="rule-head">
      <span>${CHANGE_LABELS[ch.kind]}${ignored ? html` <span class="no">(ignored by ${target === "layout" ? "layouts" : `${target} layers`})</span>` : partIgnores ? html` <span class="no">(ignored by a part)</span>` : nothing}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${remove}>${uiIcon("delete")}</button>
    </div>
    ${partIgnores ? html`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>` : nothing}
    ${changeBody(host, ch, upd, key)}
  </div>`;
}

/** The controls behind one style change: a colour, a symbol, a value, a number
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
        ? colorField("Colour", v.kind.kind === "literal" ? v.kind.value : "", (hex) => upd((c) => { c.value = literal(hex ?? "#FFFFFF"); }, "color"))
        : valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: true, showResolved: true, label: "Colour from", key: `${key}-value` })}
        <button class="link" @click=${() => upd((c) => { c.value = fixed ? { kind: { kind: "entityAttribute", entityId: "", displayName: "", domain: "", attribute: "rgb_color" } } : literal("#FFFFFF"); })}>${fixed ? "Read the colour from a value instead" : "Use a fixed colour instead"}</button>
        ${fixed ? nothing : html`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`;
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
/** Columns added by the picker that no change fills in yet. A column with a
 * change in it is always shown, so this only ever holds empty ones. */
const pickedColumns = new Map<string, Set<StyleProperty>>();
/** The column a "Remove column" click is waiting for confirmation on. */
const pendingColumnRemoval = new Map<string, StyleProperty>();
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
export function statesEditor(
  host: EditorHost,
  rules: Rule[],
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
  parts?: readonly TextPart[],
): TemplateResult {
  const shape = tableShape(rules);
  const advanced = !shape.ok || advancedRules.has(key);
  if (advanced) {
    return html`
      <div class="states-switch">
        <button class="link" ?disabled=${!shape.ok} title=${shape.ok ? "Go back to the table" : "These rules cannot be shown as a table"}
          @click=${(e: Event) => { advancedRules.delete(key); requestRerender(e.target); }}>Show as table</button>
        ${shape.ok ? nothing : html`<span class="hint keep">${shape.reason}</span>`}
      </div>
      ${rulesEditor(host, rules, target, locate, key, parts)}`;
  }
  return statesTable(host, shape.table, rules[0], target, locate, key, defaultValue, parts);
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
): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) =>
    host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);

  // What a new row tests: whatever the rows already test, else the header
  // chip's pending choice, else the layer's own entity.
  const tested = table.value ?? pendingTestValues.get(key) ?? defaultValue;
  // An empty table guesses from the value itself: a light gets on/off rows, a
  // thermometer gets bands. The live reading settles the cases a domain name
  // cannot, such as a sensor that reports words.
  const fresh = table.rows.length === 0;
  const numberMode = table.numberMode
    || (fresh && tested !== undefined && !looksBinary(tested) && isNumberish(host.resolve(tested)));

  const allowed = RULE_TARGET_PROPERTIES[target];
  const picked = pickedColumns.get(key) ?? new Set<StyleProperty>();
  const seed = table.columns.length === 0 && picked.size === 0 ? [DEFAULT_COLUMN[target]] : [];
  const columns = shownColumns(table.columns, [...picked, ...seed.filter((p): p is StyleProperty => p !== undefined)], allowed);

  // On a rich text layer the states can aim at one part. A part reads only
  // some columns, so only those are offered; a column already in the table
  // stays in view with a hint rather than disappearing with its values.
  const pendingPart = pendingPartTargets.get(key);
  const partId = rule ? rule.partId : parts?.some((p) => p.id === pendingPart) ? pendingPart : undefined;
  const forPart = parts !== undefined && partId !== undefined;
  const offered = forPart ? allowed.filter((p) => PART_RULE_PROPERTIES.includes(p)) : allowed;
  const partIgnores = forPart ? columns.filter((p) => !PART_RULE_PROPERTIES.includes(p)) : [];
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
    upd((rs) => {
      addStateRow(rs, tested ?? literal(""), numberMode);
      if (partId !== undefined && rs[0] && rs[0].partId === undefined) rs[0].partId = partId;
    });
  };

  const rows = table.rows.map((row, i) => statesRow(host, {
    key: `${key}-${row.caseId}`,
    label: whenText(row.comparison, (v) => describeValue(v, describeContext(host))),
    columns,
    changes: row.changes,
    live: live === row.caseId,
    forced: isForced(row.caseId),
    onForce: () => force(row.caseId),
    // Coalescing keys carry the row and the column, so typing in one cell is
    // one undo step and typing in the next one is another.
    when: whenCell(host, row.comparison, `${key}-${row.caseId}`, (m, k) => upd((rs) => {
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
    key: `${key}-otherwise`,
    label: "Otherwise",
    columns,
    changes: table.otherwise,
    live: live === "otherwise",
    forced: isForced("otherwise"),
    onForce: () => force("otherwise"),
    when: html`<span class="when-otherwise">Otherwise</span>`,
    updChanges: (m, k) => upd((rs) => { const o = rs[0]?.otherwise; if (o) m(o); }, k),
    acts: html`<button class="icon" title="Remove the Otherwise row" @click=${() => upd((rs) => setOtherwise(rs, false))}>${uiIcon("close")}</button>`,
  });

  const pendingRemoval = pendingColumnRemoval.get(key);
  const spare = COLUMN_PICKER_ORDER.filter((p) => offered.includes(p) && !columns.includes(p));

  return html`
    <div class="states">
      ${valueEditor(host, tested ?? literal(""), setTested, { label: "Testing", showResolved: true, key: `${key}-lhs` })}
      ${tested === undefined ? html`<div class="hint keep">Choose what these states look at.</div>` : nothing}
      ${parts === undefined ? nothing : partTargetField(parts, partId, describeContext(host), setPart)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${columns.map((p) => html`<th>
              <span>${PROPERTY_LABELS[p]}</span>
              <button class="icon" title=${`Remove the ${PROPERTY_LABELS[p]} column`}
                @click=${(e: Event) => { pendingColumnRemoval.set(key, p); requestRerender(e.target); }}>${uiIcon("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          ${otherwiseRow}
          ${table.rows.length === 0 && table.otherwise === undefined
            ? html`<tr><td class="empty-row" colspan=${columns.length + 2}>No states yet. Add one to change how this ${target === "layout" ? "shape" : "layer"} looks when a value changes.</td></tr>`
            : nothing}
        </tbody>
      </table></div>
      ${partIgnores.length === 0 ? nothing : html`<div class="hint warn">A part ignores ${joinWords(partIgnores.map((p) => PROPERTY_LABELS[p]))}. Pick Whole text to use ${partIgnores.length === 1 ? "it" : "them"}.</div>`}
      ${pendingRemoval === undefined ? nothing : html`<div class="hint warn confirm-row">
        Remove the ${PROPERTY_LABELS[pendingRemoval]} column? Its ${countColumnUses(table, pendingRemoval)} value${countColumnUses(table, pendingRemoval) === 1 ? "" : "s"} are deleted from every state.
        <button class="danger small" @click=${(e: Event) => {
          pendingColumnRemoval.delete(key);
          pickedColumns.get(key)?.delete(pendingRemoval);
          requestRerender(e.target);
          upd((rs) => removeColumn(rs, pendingRemoval));
        }}>Remove</button>
        <button class="small" @click=${(e: Event) => { pendingColumnRemoval.delete(key); requestRerender(e.target); }}>Cancel</button>
      </div>`}
      <div class="field list-field"><span>Add</span>
        <div class="states-foot">
          <button class="small" title="Add a row: a value to match and what the layer looks like then" @click=${addRow}>${uiIcon("plus")}<span>State</span></button>
          ${table.otherwise === undefined
            ? html`<button class="small" title="What this layer looks like when no state above matches" @click=${() => upd((rs) => setOtherwise(rs, true))}>${uiIcon("plus")}<span>Otherwise</span></button>`
            : nothing}
          ${spare.length === 0 ? nothing : html`<select class="chip-add" title="Add a column" aria-label="Add a column" @change=${(e: Event) => {
            const sel = e.target as HTMLSelectElement;
            const p = sel.value as StyleProperty | "";
            sel.value = "";
            if (!p) return;
            const set = pickedColumns.get(key) ?? new Set<StyleProperty>();
            set.add(p);
            pickedColumns.set(key, set);
            requestRerender(sel);
          }}>
            <option value="" selected>+ Column…</option>
            ${spare.map((p) => html`<option value=${p}>${PROPERTY_LABELS[p]}</option>`)}
          </select>`}
        </div>
      </div>
      ${forced === "live" ? nothing : html`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${() => rule && host.setForced(rule.id, "live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${numberMode
        ? "States are checked top to bottom and the first match wins, so each band only has to say where it starts."
        : "States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${(e: Event) => { advancedRules.add(key); requestRerender(e.target); }}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`;
}

/** Whether a resolved reading is a number, which is what makes a fresh table
 * a set of bands rather than a set of states. */
function isNumberish(resolved: string | undefined): boolean {
  const t = (resolved ?? "").trim();
  return t !== "" && Number.isFinite(Number(t));
}

/** Column picker order. The same order the header reads in, so a column lands
 * where the list said it would. */
const COLUMN_PICKER_ORDER: StyleProperty[] = [
  "icon", "text", "color", "visibility", "opacity", "fontSize", "fontWeight",
  "rotation", "gaugeValue", "gaugeMin", "gaugeMax", "backgroundColor",
  "borderColor", "borderWidth",
];

function countColumnUses(table: StatesTable, property: StyleProperty): number {
  let n = 0;
  for (const row of table.rows) if (cellChange(row.changes, property)) n += 1;
  if (table.otherwise && cellChange(table.otherwise, property)) n += 1;
  return n;
}

interface StatesRowOptions {
  key: string;
  label: string;
  columns: StyleProperty[];
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

function statesRow(host: EditorHost, o: StatesRowOptions): TemplateResult {
  return html`<tr class="state-row ${o.live ? "live" : ""} ${o.forced ? "forced" : ""}"
    title=${`${o.label}. Click to hold the previews on this state.`}
    @click=${(e: Event) => { if (!onControl(e)) o.onForce(); }}>
    <td class="when">
      <span class="row-flag" title=${o.forced ? "The previews are held on this state" : o.live ? "This state matches right now" : ""}>${o.forced ? "◉" : o.live ? "●" : ""}</span>
      ${o.when}
    </td>
    ${o.columns.map((p) => html`<td>${statesCell(host, p, o.changes, o.updChanges, `${o.key}-${p}`)}</td>`)}
    <td class="acts">${o.acts}</td>
  </tr>`;
}

/** One cell: what this state sets for one column, or "unchanged". Clicking an
 * empty cell writes the column's default and opens its form, so filling in a
 * table is one click per cell rather than a trip through an adder menu. */
function statesCell(
  host: EditorHost,
  property: StyleProperty,
  changes: StyleChange[],
  updChanges: (m: (list: StyleChange[]) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const ch = cellChange(changes, property);
  const id = popoverId(key);
  if (!ch) {
    return html`<button type="button" class="cell empty" title=${`Set ${PROPERTY_LABELS[property]} for this state`}
      @click=${(e: Event) => {
        updChanges((list) => { list.push(newStyleChange(PROPERTY_CHANGE_KIND[property])); });
        openPopoverSoon(e.target, id);
      }}>unchanged</button>`;
  }
  const upd = (m: (c: StyleChange) => void, k?: string) => updChanges((list) => {
    const target = list.find((x) => STYLE_PROPERTY[x.kind] === property);
    if (target) m(target);
  }, k && `${property}-${k}`);
  const label = PROPERTY_LABELS[property];
  return html`
    <button type="button" class="cell filled" popovertarget=${id} aria-haspopup="dialog" title=${`${label}. Click to change it.`}>${cellSummary(host, ch)}</button>
    <div class="value-pop" id=${id} popover role="dialog" aria-label=${label} @toggle=${onValuePopoverToggle}>
      <div class="pop-head">
        <b>${label}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${id} popovertargetaction="hide">Done</button>
      </div>
      ${openedPopovers.has(id)
        ? html`${property === "visibility"
            ? segField("This state", ch.kind === "hide" ? "hide" : "show", [["show", "Shown"], ["hide", "Hidden"]], (v) => upd((c) => { c.kind = v as StyleChangeKind; }))
            : changeBody(host, ch, upd, key)}
          <button class="link" @click=${(e: Event) => {
            // Closed first: emptying the cell takes this popover's own button
            // out of the document, and a popover removed while open never
            // fires the toggle that tidies up after it.
            (e.target as HTMLElement).closest<HTMLElement>("[popover]")?.hidePopover();
            updChanges((list) => {
              const i = list.findIndex((x) => STYLE_PROPERTY[x.kind] === property);
              if (i >= 0) list.splice(i, 1);
            });
          }}>Leave ${label.toLowerCase()} unchanged</button>`
        : nothing}
    </div>`;
}

/** What a filled cell shows: a colour swatch, a symbol and its name, or the
 * value in words. Short enough that a row still reads as one line. */
function cellSummary(host: EditorHost, ch: StyleChange): TemplateResult {
  if (ch.kind === "hide") return html`<span class="cell-word">Hidden</span>`;
  if (ch.kind === "show") return html`<span class="cell-word">Shown</span>`;
  const payload = styleChangePayload(ch.kind);
  if (payload === "number") return html`<span class="cell-word mono">${ch.number ?? 0}</span>`;
  if (payload === "weight") return html`<span class="cell-word">${FONT_WEIGHTS.find(([w]) => w === (ch.weight ?? "regular"))?.[1]}</span>`;
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

/** A hex colour as something a person can read back. Names are the closest of
 * the Apple system colours the rest of the editor already offers; anything
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
function whenCell(host: EditorHost, c: Comparison, key: string, upd: (m: (c: Comparison) => void, k?: string) => void): TemplateResult {
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
      ${TABLE_COMPARISONS.map((k) => html`<option value=${k} ?selected=${k === c.kind}>${tableComparisonLabel(k)}</option>`)}
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
    case "lessThan": return "below…";
    case "lessOrEqual": return "…or below";
    case "between": return "between…";
    case "greaterOrEqual": return "…or above";
    case "greaterThan": return "above…";
    default: return COMPARISON_LABELS[kind];
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
  const opts: ValueEditorOptions = { showResolved: true, label, key };
  if (v.kind.kind !== "literal") {
    return html`<span class="rhs">
      ${valueEditor(host, v, set, { ...opts, compact: true })}
    </span>`;
  }
  const text = v.kind.value;
  return html`<span class="rhs">
    <input class="cellin ${numeric ? "num" : ""}" type=${numeric ? "number" : "text"} .value=${text} placeholder=${placeholder}
      @input=${onInput((val) => set({ ...v, kind: { kind: "literal", value: val } }))} />
    <button type="button" class="icon more" popovertarget=${id} title="Compare with an entity or a template instead">…</button>
    ${valuePopover(host, id, label, v, set, opts)}
  </span>`;
}
