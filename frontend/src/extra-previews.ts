// A picture and a sentence for each button in an Extras card.
//
// "Change", "Top of the scale" and "Now line" are the schema's words, and the
// card's hints that explain them are hidden until the author asks for help. So
// the card shows one preview: the button last pointed at, drawn on a sample of
// the layer the card belongs to (a chart, a timeline or a picture), with a line
// saying what it adds.
//
// Like the Add a layer samples, nothing here is live. Every picture of one kind
// is the same hand drawn sample, so only the part the button adds changes
// between them, in `--k` (the accent set on the well), and the rest stays muted.

import { type TemplateResult, html, svg } from "lit";
import { CHART_ANCHOR_POINTS, CHART_STATS, type ChartAnchorPoint, type ChartStat } from "./model.js";

/** A chart's Draw row buttons. */
export type ChartDrawExtra = "threshold" | "now" | "zero" | "times" | "dots" | "grid";

/** One Extras button: a chart's Draw item, Number or Marker, a timeline's
 * clock times, or a picture's timestamp. */
export type ExtraKey =
  | `draw:${ChartDrawExtra}` | `number:${ChartStat}` | `marker:${ChartAnchorPoint}`
  | "timeline:times" | "image:time";

/** The layer an Extras card belongs to, which is what its samples are drawn on. */
export type ExtraOwner = "chart" | "timeline" | "image";

const DIM = "color-mix(in srgb, var(--k) 30%, #6b7280)";
const FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;

/** The sample readings, as heights in the 120x46 box. It dips under the zero
 * line once, so the zero line has something to divide. */
const YS = [24, 29, 35, 30, 19, 23, 11, 15];
const XS = YS.map((_, i) => 10 + (i * 100) / (YS.length - 1));
const ZERO_Y = 32;
const THRESHOLD_Y = 20;
const AVERAGE_Y = YS.reduce((a, b) => a + b, 0) / YS.length;
const BOTTOM_Y = 40;
const TOP_Y = 6;

/** Which reading each column marker sits on. */
const COLUMN: Partial<Record<ChartAnchorPoint, number>> = {
  highest: YS.indexOf(Math.min(...YS)),
  lowest: YS.indexOf(Math.max(...YS)),
  first: 0,
  latest: YS.length - 1,
  now: 5,
};

const LINE = XS.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${YS[i]}`).join("");

/** The sample every chart extra is drawn on: a line with a faint wash under it. */
function baseChart(): TemplateResult {
  return svg`
    <path d=${`${LINE}L${XS[XS.length - 1]} ${BOTTOM_Y}L${XS[0]} ${BOTTOM_Y}Z`} fill=${DIM} opacity=".18" />
    <path d=${LINE} fill="none" stroke=${DIM} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
}

/** The same sample as bars, one per reading, centred where the line's points
 * are so every marker and number still lands on its reading. */
function baseBars(): TemplateResult {
  return svg`${XS.map((x, i) => svg`<rect x=${x - 5} y=${YS[i]} width="10" height=${BOTTOM_Y - YS[i]!} rx="2" fill=${DIM} opacity=".45" />`)}`;
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
function reading(i: number, r = 2.6): TemplateResult {
  return svg`<circle cx=${XS[i]} cy=${YS[i]} r=${r} fill="var(--k)" />`;
}

/** A number printed in the top left, where the sample line leaves room. */
function number(text: string): TemplateResult {
  return svg`<text x="5" y="13" font-family=${FONT} font-size="10" font-weight="700" fill="var(--k)">${text}</text>`;
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

function overlay(key: ExtraKey): TemplateResult {
  if (key === "timeline:times") return times(38);
  if (key === "image:time") {
    return svg`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${FONT} font-size="7" fill="var(--k)">3:41:07</text>`;
  }
  const [group, name] = key.split(":") as [string, string];
  if (group === "draw") {
    switch (name as ChartDrawExtra) {
      case "threshold": return flat(THRESHOLD_Y, true);
      case "now": return svg`<path d=${`M${XS[COLUMN.now!]} 4V${BOTTOM_Y + 2}`} stroke="var(--k)" stroke-width="1.4" />`;
      case "zero": return svg`${flat(ZERO_Y)}<text x="115" y=${ZERO_Y - 3} text-anchor="end" font-family=${FONT} font-size="6.5" fill="var(--k)">0</text>`;
      case "times": return times(45);
      case "dots": return svg`${XS.map((_, i) => reading(i, 2.2))}`;
      case "grid": return svg`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`;
    }
  }
  if (group === "number") {
    const last = YS.length - 1;
    switch (name as ChartStat) {
      case "latest": return svg`${number("24.6")}${reading(last)}`;
      case "first": return svg`${number("18.2")}${reading(0)}`;
      case "highest": return svg`${number("28.9")}${reading(COLUMN.highest!)}`;
      case "lowest": return svg`${number("9.8")}${reading(COLUMN.lowest!)}`;
      case "average": return svg`${number("19.4")}${flat(AVERAGE_Y, true)}`;
      case "delta": return svg`${number("+6.4")}${reading(0)}${reading(last)}
        <path d=${`M${XS[0]} ${YS[0]}L${XS[last]} ${YS[last]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />`;
      case "sum": return svg`${number("155")}${XS.map((_, i) => reading(i, 1.6))}`;
      case "trend": return number("↑");
      case "top": return svg`${number("30")}${flat(TOP_Y)}`;
      case "bottom": return svg`<text x="5" y="37" font-family=${FONT} font-size="10" font-weight="700" fill="var(--k)">0</text>${flat(BOTTOM_Y)}`;
    }
  }
  // A marker: an icon hanging over its reading.
  const i = COLUMN[name as ChartAnchorPoint] ?? 0;
  const x = XS[i]!;
  const y = YS[i]! - 7;
  return name === "highest"
    ? svg`<path d=${`M${x} ${y - 4}L${x + 4} ${y + 3}L${x - 4} ${y + 3}Z`} fill="var(--k)" />`
    : svg`<circle cx=${x} cy=${y} r="3" fill="var(--k)" />`;
}

/** The layer a key's sample is drawn on. */
export function extraOwner(key: ExtraKey): ExtraOwner {
  return key === "timeline:times" ? "timeline" : key === "image:time" ? "image" : "chart";
}

/** The sample for one button, or the bare layer when none has been pointed at.
 * Sized by the `.xprev svg.shot` rule in the panel's styles. A bars chart's
 * samples are drawn on bars, so the picture matches the chart being edited. */
export function extraPreview(owner: ExtraOwner, key: ExtraKey | undefined, bars = false): TemplateResult {
  const base = owner === "timeline" ? baseTimeline() : owner === "image" ? baseImage() : bars ? baseBars() : baseChart();
  const shown = key !== undefined && extraOwner(key) === owner ? overlay(key) : "";
  return html`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${base}${shown}</svg>`;
}

const DRAW_NAMES: Record<ChartDrawExtra, string> = {
  threshold: "Threshold line", now: "Now line", zero: "Zero line", times: "Clock times", dots: "Dots", grid: "Grid lines",
};

/** The button's own words, for the preview's heading. */
export function extraName(key: ExtraKey): string {
  if (key === "timeline:times") return "Clock times";
  if (key === "image:time") return "Timestamp";
  const [group, name] = key.split(":") as [string, string];
  if (group === "draw") return DRAW_NAMES[name as ChartDrawExtra];
  if (group === "number") return CHART_STATS.find(([s]) => s === name)?.[1] ?? name;
  return `${CHART_ANCHOR_POINTS.find(([a]) => a === name)?.[1] ?? "Reading"} marker`;
}

const INFO: Record<ExtraKey, string> = {
  "draw:threshold": "A flat line at a value you pick, so a reading over it stands out.",
  "draw:now": "An upright line through the reading that counts as now.",
  "draw:zero": "A flat line where zero falls. It is drawn only when the readings cross zero.",
  "draw:times": "The clock times of the chart's span, spread under the plot.",
  "draw:dots": "A dot on every reading. Line and area charts only.",
  "draw:grid": "Faint rules across the plot, to read heights against.",
  "number:latest": "The newest reading, with the entity's unit after it.",
  "number:first": "The oldest reading in the span.",
  "number:highest": "The highest reading in the span.",
  "number:lowest": "The lowest reading in the span.",
  "number:average": "The average of every reading in the span.",
  "number:delta": "The newest reading minus the first, with the unit after it.",
  "number:sum": "Every reading in the span added up, with the unit after it.",
  "number:trend": "The change as an arrow: up, down, or flat when it is too small to print.",
  "number:top": "The value at the top of the plot. On a Fixed scale, this is Max.",
  "number:bottom": "The value at the bottom of the plot. On a Fixed scale, this is Min.",
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

/** One sentence on what the button adds. */
export function extraInfo(key: ExtraKey): string {
  return INFO[key];
}
