// A picture and a sentence for each button in a chart's Extras card.
//
// "Change", "Top of the scale" and "Now line" are the schema's words, and the
// card's hints that explain them are hidden until the author asks for help. So
// the card shows one preview: the button last pointed at, drawn on a sample
// chart, with a line saying what it adds.
//
// Like the Add a layer samples, nothing here is live. Every picture is the same
// hand drawn chart, so only the part the button adds changes between them, in
// `--k` (the accent set on the well), and the rest stays muted.

import { type TemplateResult, html, svg } from "lit";
import type { ChartAnchorPoint, ChartStat } from "./model.js";

/** The Draw row's buttons. */
export type ChartDrawExtra = "threshold" | "now" | "zero" | "times" | "dots" | "grid";

/** One Extras button: a Draw item, a Number or a Marker. */
export type ChartExtraKey = `draw:${ChartDrawExtra}` | `number:${ChartStat}` | `marker:${ChartAnchorPoint}`;

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

/** The chart every sample is drawn on: a line with a faint wash under it. */
function baseChart(): TemplateResult {
  return svg`
    <path d=${`${LINE}L${XS[XS.length - 1]} ${BOTTOM_Y}L${XS[0]} ${BOTTOM_Y}Z`} fill=${DIM} opacity=".18" />
    <path d=${LINE} fill="none" stroke=${DIM} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
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

function overlay(key: ChartExtraKey): TemplateResult {
  const [group, name] = key.split(":") as [string, string];
  if (group === "draw") {
    switch (name as ChartDrawExtra) {
      case "threshold": return flat(THRESHOLD_Y, true);
      case "now": return svg`<path d=${`M${XS[COLUMN.now!]} 4V${BOTTOM_Y + 2}`} stroke="var(--k)" stroke-width="1.4" />`;
      case "zero": return svg`${flat(ZERO_Y)}<text x="115" y=${ZERO_Y - 3} text-anchor="end" font-family=${FONT} font-size="6.5" fill="var(--k)">0</text>`;
      case "times": return svg`<g font-family=${FONT} font-size="6.5" fill="var(--k)">
          <text x="4" y="45">9 AM</text><text x="60" y="45" text-anchor="middle">1 PM</text><text x="116" y="45" text-anchor="end">5 PM</text>
        </g>`;
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

/** The sample for one button, or the bare chart for none. Sized by the
 * `.xprev svg.shot` rule in the panel's styles. */
export function extraPreview(key: ChartExtraKey | undefined): TemplateResult {
  return html`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${baseChart()}${key ? overlay(key) : ""}</svg>`;
}

const INFO: Record<ChartExtraKey, string> = {
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
};

/** One sentence on what the button adds. */
export function extraInfo(key: ChartExtraKey): string {
  return INFO[key];
}
