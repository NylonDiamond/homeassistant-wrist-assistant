// A picture and a sentence for each control in an Extras card, and the list of
// readings a chart's card offers.
//
// "Change", "Top of the scale" and "Now line" are the schema's words, and the
// card's hints that explain them are hidden until the author asks for help. So
// the card shows one preview: the control last pointed at, drawn on the layer
// the card belongs to, with a line saying what it adds.
//
// A chart's picture is drawn from the readings the editor already has for it,
// and its numbers are the ones the resolver prints, so the preview of "Highest"
// shows this chart's highest reading. A chart with no readings yet, a timeline
// and a picture are drawn on a hand drawn sample, with no numbers on it. Only
// the part the control adds is in `--k` (the accent set on the well), and the
// rest stays muted.

import { type TemplateResult, html, svg } from "lit";
import { CHART_ANCHOR_POINTS, CHART_STATS, type ChartAnchorPoint, type ChartStat } from "./model.js";

/** A chart's plot extras: the layers drawn across the plot. */
export type ChartDrawExtra = "threshold" | "now" | "zero" | "times" | "dots" | "grid";

/** One Extras control: a chart's plot extra, Number or Marker, a timeline's
 * clock times, or a picture's timestamp. */
export type ExtraKey =
  | `draw:${ChartDrawExtra}` | `number:${ChartStat}` | `marker:${ChartAnchorPoint}`
  | "timeline:times" | "image:time";

/** The layer an Extras card belongs to, which is what its samples are drawn on. */
export type ExtraOwner = "chart" | "timeline" | "image";

/** The plot extras in the order the card lists them, with the chip's words. */
export const CHART_DRAW_EXTRAS: readonly [ChartDrawExtra, string][] = [
  ["threshold", "Threshold line"],
  ["now", "Now line"],
  ["zero", "Zero line"],
  ["grid", "Grid lines"],
  ["dots", "Dots"],
  ["times", "Clock times"],
];

/** One row of a chart's Readings list: a reading, and what can be added for it.
 * `stat` is set when a number can print it, `marker` when a marker can sit over
 * it. A marker needs a column of readings, so the reading-free ends of the scale
 * and the numbers worked out from the whole span have none, and "now" is a
 * column with no number of its own. */
export interface ChartReadingRow {
  label: string;
  stat?: ChartStat;
  marker?: ChartAnchorPoint;
}

export const CHART_READINGS: readonly ChartReadingRow[] = [
  { label: "Newest", stat: "latest", marker: "latest" },
  { label: "First", stat: "first", marker: "first" },
  { label: "Highest", stat: "highest", marker: "highest" },
  { label: "Lowest", stat: "lowest", marker: "lowest" },
  { label: "Average", stat: "average" },
  { label: "Change", stat: "delta" },
  { label: "Total", stat: "sum" },
  { label: "Trend", stat: "trend" },
  { label: "Top of scale", stat: "top" },
  { label: "Bottom of scale", stat: "bottom" },
  { label: "Now", marker: "now" },
];

/** What a chart's previews are drawn from: the readings the chart draws, the
 * text each number prints, which reading is now, and where the threshold sits.
 * Every field is optional; what is missing is drawn from the sample. */
export interface ChartSample {
  values?: readonly number[];
  texts?: Partial<Record<ChartStat, string>>;
  now?: number;
  threshold?: number;
}

const DIM = "color-mix(in srgb, var(--k) 30%, #6b7280)";
const FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;
const BOTTOM_Y = 40;
const TOP_Y = 6;

/** The sample readings for a chart with none of its own yet. */
const SAMPLE = [22, 17, 11, 16, 27, 23, 35, 31];

/** Where everything on a chart preview lands in the 120x46 box. */
interface Plot {
  xs: number[];
  ys: number[];
  y: (v: number) => number;
  /** Where zero falls, clamped to the plot so a zero line always shows. */
  zeroY: number;
  thresholdY: number;
  averageY: number;
  column: Record<"highest" | "lowest" | "first" | "latest" | "now", number>;
  /** Whether the numbers are this chart's own, so they can be printed. */
  real: boolean;
}

/** The plot for a sample, exported for tests. Non-finite readings are left out;
 * fewer than two readings draws the hand drawn sample instead. */
export function chartPreviewPlot(sample: ChartSample = {}): Plot {
  const own = (sample.values ?? []).filter((v) => Number.isFinite(v));
  const real = own.length >= 2;
  const values = real ? own : SAMPLE;
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (real && sample.threshold !== undefined && Number.isFinite(sample.threshold)) {
    lo = Math.min(lo, sample.threshold);
    hi = Math.max(hi, sample.threshold);
  }
  if (hi === lo) { hi += 1; lo -= 1; }
  const y = (v: number) => TOP_Y + ((hi - v) / (hi - lo)) * (BOTTOM_Y - TOP_Y);
  const n = values.length;
  const xs = values.map((_, i) => 10 + (i * 100) / (n - 1));
  const ys = values.map(y);
  const clampY = (v: number) => Math.min(BOTTOM_Y, Math.max(TOP_Y, v));
  const nowAt = real && sample.now !== undefined && Number.isFinite(sample.now)
    ? Math.min(n - 1, Math.max(0, Math.round(sample.now)))
    : Math.round((n - 1) * 0.6);
  return {
    xs, ys, y, real,
    zeroY: clampY(y(0)),
    thresholdY: clampY(y(real && sample.threshold !== undefined ? sample.threshold : (lo + hi) / 2)),
    averageY: y(values.reduce((a, b) => a + b, 0) / n),
    column: {
      highest: values.indexOf(Math.max(...values)),
      lowest: values.indexOf(Math.min(...values)),
      first: 0,
      latest: n - 1,
      now: nowAt,
    },
  };
}

function baseChart(p: Plot): TemplateResult {
  const line = p.xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${p.ys[i]!.toFixed(1)}`).join("");
  return svg`
    <path d=${`${line}L${p.xs[p.xs.length - 1]} ${BOTTOM_Y}L${p.xs[0]} ${BOTTOM_Y}Z`} fill=${DIM} opacity=".18" />
    <path d=${line} fill="none" stroke=${DIM} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
}

/** The same readings as bars, one per reading, centred where the line's points
 * are so every marker and number still lands on its reading. */
function baseBars(p: Plot): TemplateResult {
  const w = Math.min(10, Math.max(1, (100 / p.xs.length) * 0.7));
  return svg`${p.xs.map((x, i) => {
    const top = Math.min(p.ys[i]!, BOTTOM_Y - 1);
    return svg`<rect x=${x - w / 2} y=${top} width=${w} height=${BOTTOM_Y - top} rx=${Math.min(2, w / 2)} fill=${DIM} opacity=".45" />`;
  })}`;
}

/** A timeline's strip of runs, high enough to leave a row for its times. */
function baseTimeline(): TemplateResult {
  const runs: [number, number, number][] = [[4, 30, .35], [35, 18, .7], [54, 10, .35], [65, 26, .7], [92, 24, .35]];
  return svg`${runs.map(([x, w, o]) => svg`<rect x=${x} y="10" width=${w} height="16" rx="3" fill=${DIM} opacity=${o} />`)}`;
}

/** A picture filling the frame: sky, sun and hills. */
function baseImage(): TemplateResult {
  return svg`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${DIM} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${DIM} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${DIM} opacity=".5" />`;
}

/** A dot on one reading, in the accent, to tie a number to where it came from. */
function reading(p: Plot, i: number, r = 2.6): TemplateResult {
  return svg`<circle cx=${p.xs[i]} cy=${p.ys[i]} r=${r} fill="var(--k)" />`;
}

/** A number printed on a dark chip, top left or bottom left, so it reads over
 * whatever the readings draw there. Nothing when the text is not known. */
function number(text: string | undefined, bottom = false): TemplateResult | string {
  if (text === undefined || text === "") return "";
  const w = text.length * 5.8 + 5;
  const y = bottom ? 36 : 13;
  return svg`<rect x="2" y=${y - 9.5} width=${w} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${y} font-family=${FONT} font-size="10" font-weight="700" fill="var(--k)">${text}</text>`;
}

function flat(y: number, dashed = false): TemplateResult {
  return svg`<path d=${`M4 ${y}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${dashed ? "4 3" : "none"} />`;
}

/** Three clock times along a row. */
function times(y: number): TemplateResult {
  return svg`<g font-family=${FONT} font-size="6.5" fill="var(--k)">
    <text x="4" y=${y}>9 AM</text><text x="60" y=${y} text-anchor="middle">1 PM</text><text x="116" y=${y} text-anchor="end">5 PM</text>
  </g>`;
}

function overlay(key: ExtraKey, p: Plot, texts: Partial<Record<ChartStat, string>>): TemplateResult | string {
  if (key === "timeline:times") return times(38);
  if (key === "image:time") {
    return svg`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${FONT} font-size="7" fill="var(--k)">3:41:07</text>`;
  }
  const [group, name] = key.split(":") as [string, string];
  const dotR = Math.min(2.2, Math.max(0.8, 40 / p.xs.length));
  if (group === "draw") {
    switch (name as ChartDrawExtra) {
      case "threshold": return flat(p.thresholdY, true);
      case "now": return svg`<path d=${`M${p.xs[p.column.now]} 4V${BOTTOM_Y + 2}`} stroke="var(--k)" stroke-width="1.4" />`;
      case "zero": return svg`${flat(p.zeroY)}<text x="115" y=${Math.max(9, p.zeroY - 3)} text-anchor="end" font-family=${FONT} font-size="6.5" fill="var(--k)">0</text>`;
      case "times": return times(45);
      case "dots": return svg`${p.xs.map((_, i) => reading(p, i, dotR))}`;
      case "grid": return svg`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`;
    }
  }
  if (group === "number") {
    const text = p.real ? texts[name as ChartStat] : undefined;
    const { first, latest } = p.column;
    switch (name as ChartStat) {
      case "latest": return svg`${reading(p, latest)}${number(text)}`;
      case "first": return svg`${reading(p, first)}${number(text)}`;
      case "highest": return svg`${reading(p, p.column.highest)}${number(text)}`;
      case "lowest": return svg`${reading(p, p.column.lowest)}${number(text)}`;
      case "average": return svg`${flat(p.averageY, true)}${number(text)}`;
      case "delta": return svg`<path d=${`M${p.xs[first]} ${p.ys[first]}L${p.xs[latest]} ${p.ys[latest]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${reading(p, first)}${reading(p, latest)}${number(text)}`;
      case "sum": return svg`${p.xs.map((_, i) => reading(p, i, dotR))}${number(text)}`;
      case "trend": return svg`<path d=${`M${p.xs[first]} ${p.ys[first]}L${p.xs[latest]} ${p.ys[latest]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${number(text)}`;
      case "top": return svg`${flat(TOP_Y)}${number(text, true)}`;
      case "bottom": return svg`${flat(BOTTOM_Y)}${number(text)}`;
    }
  }
  // A marker: an icon hanging over its reading.
  const col = p.column[name as keyof Plot["column"]] ?? 0;
  const x = p.xs[col]!;
  const y = Math.max(5, p.ys[col]! - 7);
  if (name === "highest") return svg`<path d=${`M${x} ${y - 4}L${x + 4} ${y + 3}L${x - 4} ${y + 3}Z`} fill="var(--k)" />`;
  if (name === "now") return svg`<path d=${`M${x - 4} ${y - 3}L${x + 4} ${y - 3}L${x} ${y + 4}Z`} fill="var(--k)" />`;
  return svg`<circle cx=${x} cy=${y} r="3" fill="var(--k)" />`;
}

/** The layer a key's sample is drawn on. */
export function extraOwner(key: ExtraKey): ExtraOwner {
  return key === "timeline:times" ? "timeline" : key === "image:time" ? "image" : "chart";
}

/** The picture for one control, or the bare layer when none has been pointed
 * at. Sized by the `.xprev svg.shot` rule in the panel's styles. A bars chart's
 * pictures are drawn on bars, so the picture matches the chart being edited. */
export function extraPreview(owner: ExtraOwner, key: ExtraKey | undefined, bars = false, sample: ChartSample = {}): TemplateResult {
  const plot = chartPreviewPlot(sample);
  const base = owner === "timeline" ? baseTimeline() : owner === "image" ? baseImage() : bars ? baseBars(plot) : baseChart(plot);
  const shown = key !== undefined && extraOwner(key) === owner ? overlay(key, plot, sample.texts ?? {}) : "";
  return html`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${base}${shown}</svg>`;
}

/** The control's own words, for the preview's heading. */
export function extraName(key: ExtraKey): string {
  if (key === "timeline:times") return "Clock times";
  if (key === "image:time") return "Timestamp";
  const [group, name] = key.split(":") as [string, string];
  if (group === "draw") return CHART_DRAW_EXTRAS.find(([d]) => d === name)?.[1] ?? name;
  if (group === "number") return `${CHART_STATS.find(([s]) => s === name)?.[1] ?? name} number`;
  return `${CHART_ANCHOR_POINTS.find(([a]) => a === name)?.[1] ?? "Reading"} marker`;
}

const INFO: Record<ExtraKey, string> = {
  "draw:threshold": "A flat line at a value you pick, so a reading over it stands out.",
  "draw:now": "An upright line through the reading that counts as now.",
  "draw:zero": "A flat line where zero falls. It is drawn only when the readings cross zero.",
  "draw:times": "The clock times of the chart's span, spread under the plot.",
  "draw:dots": "A dot on every reading. Line and area charts only.",
  "draw:grid": "Faint rules across the plot, to read heights against.",
  "number:latest": "A text layer printing the newest reading, with the entity's unit after it.",
  "number:first": "A text layer printing the oldest reading in the span.",
  "number:highest": "A text layer printing the highest reading in the span.",
  "number:lowest": "A text layer printing the lowest reading in the span.",
  "number:average": "A text layer printing the average of every reading in the span.",
  "number:delta": "A text layer printing the newest reading minus the first, with the unit after it.",
  "number:sum": "A text layer printing every reading in the span added up, with the unit after it.",
  "number:trend": "A text layer printing the change as an arrow: up, down, or flat when it is too small to print.",
  "number:top": "A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.",
  "number:bottom": "A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.",
  "marker:highest": "An icon over the highest reading. It starts as a triangle.",
  "marker:lowest": "An icon over the lowest reading. It starts as a dot.",
  "marker:now": "An icon over the reading that counts as now.",
  "marker:first": "An icon over the oldest reading.",
  "marker:latest": "An icon over the newest reading.",
  "marker:threshold": "An icon at the threshold's height.",
  "marker:zero": "An icon at zero's height.",
  "timeline:times": "The clock times of the timeline's span, spread under the strip.",
  "image:time": "The time the picture was fetched, so a picture that stops updating reads as stale.",
};

/** One sentence on what the control adds. */
export function extraInfo(key: ExtraKey): string {
  return INFO[key];
}
