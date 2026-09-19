// Which color rows a chart's Look card shows, and what each is called.
//
// A chart has three colors of its own: the layer color (its color slot, the
// one a state's Color column changes), a fill color and a bar border color.
// Which of them paints anything depends on the style and on Color, so the card
// asks this module rather than showing all three and leaving the author to find
// out which ones do nothing. The facts below are the resolver's
// (`chartBarColors` in model.ts, the chart case in resolver.ts) and the
// renderer's (`renderChartMarks`), which mirror the app's Swift:
//
// Bars, one color: a bar fills in the chart's fill color, else the layer
// color. Its border is the border color, else white. So the layer color is
// the bar color, and a fill color only duplicates it.
//
// Bars, by value: a bar fills in its band's own fill, else the chart's fill
// color, else its band's color. Its border is the band's own border, else the
// chart's border color, else white. The layer color paints nothing. The
// chart's fill and border are what every band without its own falls back to.
//
// Line, by value: each leg is stroked in its band's color. The layer color
// paints nothing.
//
// Area, by value: the stroke is banded like a line. The wash is the chart's fill
// color when set; else each band's color with Band fill on; else the layer
// color.
//
// A table with no bands draws as one color whatever Color says
// (`chartUsesBands`), so it is treated as one color here too.

import { type ChartElement, chartUsesBands } from "./model.js";

/** One color row: its title, the words shown while it is empty, and an
 * optional line under it saying what it does. */
export interface ChartColorRow {
  label: string;
  empty: string;
  note?: string;
  /** The note is a warning: the row is overriding something the author set. */
  warn?: boolean;
}

export interface ChartColorRows {
  /** The layer color's title, or undefined when it paints nothing. */
  main?: string;
  /** The chart's `fillColorHex` row, or undefined when it is hidden. */
  fill?: ChartColorRow;
  /** The chart's `barBorderColorHex` row, or undefined when it is hidden.
   * Only a bars chart with its border on has one. */
  border?: ChartColorRow;
}

type ChartColorFields = Pick<ChartElement, "style" | "coloring" | "bands" | "fillColorHex" | "barBorderWidth" | "fillBands">;

export function chartColorRows(c: ChartColorFields): ChartColorRows {
  const banded = chartUsesBands(c as ChartElement);
  const fillSet = c.fillColorHex !== undefined;
  if (c.style === "bars") {
    const bordered = c.barBorderWidth !== undefined;
    if (!banded) {
      return {
        main: "Bar color",
        ...(fillSet ? { fill: {
          label: "Fill color", empty: "Bar color",
          note: "Fills every bar in place of Bar color, even when a state changes the color. Clear it to fill in Bar color.",
          warn: true,
        } } : {}),
        ...(bordered ? { border: { label: "Border color", empty: "White" } } : {}),
      };
    }
    // By value. With the border on, every band row has its own Fill and Border
    // boxes, and these two are what a band without its own falls back to. With
    // it off, a band row has one color box, which a set fill color overrides.
    const out: ChartColorRows = {};
    if (bordered) {
      out.fill = { label: "Band fill", empty: "Each band's color",
        ...(fillSet ? { note: "Every band with no fill of its own fills in this." } : {}) };
      out.border = { label: "Band border", empty: "White",
        note: "Every band with no border of its own uses this." };
    } else if (fillSet) {
      out.fill = { label: "Band fill", empty: "Each band's color",
        note: "This fill wins over every band's color. Clear it to fill each bar in its band's color.", warn: true };
    }
    return out;
  }
  if (c.style === "line") return banded ? {} : { main: "Line color" };
  // Area.
  if (!banded) return { main: "Line color", fill: { label: "Fill color", empty: "Line color" } };
  if (fillSet) {
    return { fill: { label: "Fill color", empty: "Band colors",
      ...(c.fillBands ? { note: "A fill color wins over Band fill. Clear it to fill each stretch in its band's color.", warn: true } : {}) } };
  }
  // No fill color: with Band fill on the bands paint the wash, and with it off
  // the layer color does, so that is the one fill row to offer.
  return c.fillBands ? {} : { main: "Fill color" };
}
