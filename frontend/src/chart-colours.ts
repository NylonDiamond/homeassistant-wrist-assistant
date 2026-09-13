// Which colour rows a chart's Look card shows, and what each is called.
//
// A chart has three colours of its own: the layer colour (its colour slot, the
// one a state's Colour column changes), a fill colour and a bar border colour.
// Which of them paints anything depends on the style and on Colour, so the card
// asks this module rather than showing all three and leaving the author to find
// out which ones do nothing. The facts below are the resolver's
// (`chartBarColors` in model.ts, the chart case in resolver.ts) and the
// renderer's (`renderChartMarks`), which mirror the app's Swift:
//
// Bars, one colour: a bar fills in the chart's fill colour, else the layer
// colour. Its border is the border colour, else white. So the layer colour is
// the bar colour, and a fill colour only duplicates it.
//
// Bars, by value: a bar fills in its band's own fill, else the chart's fill
// colour, else its band's colour. Its border is the band's own border, else the
// chart's border colour, else white. The layer colour paints nothing. The
// chart's fill and border are what every band without its own falls back to.
//
// Line, by value: each leg is stroked in its band's colour. The layer colour
// paints nothing.
//
// Area, by value: the stroke is banded like a line. The wash is the chart's fill
// colour when set; else each band's colour with Band fill on; else the layer
// colour.
//
// A table with no bands draws as one colour whatever Colour says
// (`chartUsesBands`), so it is treated as one colour here too.

import { type ChartElement, chartUsesBands } from "./model.js";

/** One colour row: its title, the words shown while it is empty, and an
 * optional line under it saying what it does. */
export interface ChartColourRow {
  label: string;
  empty: string;
  note?: string;
  /** The note is a warning: the row is overriding something the author set. */
  warn?: boolean;
}

export interface ChartColourRows {
  /** The layer colour's title, or undefined when it paints nothing. */
  main?: string;
  /** The chart's `fillColorHex` row, or undefined when it is hidden. */
  fill?: ChartColourRow;
  /** The chart's `barBorderColorHex` row, or undefined when it is hidden.
   * Only a bars chart with its border on has one. */
  border?: ChartColourRow;
}

type ChartColourFields = Pick<ChartElement, "style" | "coloring" | "bands" | "fillColorHex" | "barBorderWidth" | "fillBands">;

export function chartColourRows(c: ChartColourFields): ChartColourRows {
  const banded = chartUsesBands(c as ChartElement);
  const fillSet = c.fillColorHex !== undefined;
  if (c.style === "bars") {
    const bordered = c.barBorderWidth !== undefined;
    if (!banded) {
      return {
        main: "Bar colour",
        ...(fillSet ? { fill: {
          label: "Fill colour", empty: "Bar colour",
          note: "Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",
          warn: true,
        } } : {}),
        ...(bordered ? { border: { label: "Border colour", empty: "White" } } : {}),
      };
    }
    // By value. With the border on, every band row has its own Fill and Border
    // boxes, and these two are what a band without its own falls back to. With
    // it off, a band row has one colour box, which a set fill colour overrides.
    const out: ChartColourRows = {};
    if (bordered) {
      out.fill = { label: "Band fill", empty: "Each band's colour",
        ...(fillSet ? { note: "Every band with no fill of its own fills in this." } : {}) };
      out.border = { label: "Band border", empty: "White",
        note: "Every band with no border of its own uses this." };
    } else if (fillSet) {
      out.fill = { label: "Band fill", empty: "Each band's colour",
        note: "This fill wins over every band's colour. Clear it to fill each bar in its band's colour.", warn: true };
    }
    return out;
  }
  if (c.style === "line") return banded ? {} : { main: "Line colour" };
  // Area.
  if (!banded) return { main: "Line colour", fill: { label: "Fill colour", empty: "Line colour" } };
  if (fillSet) {
    return { fill: { label: "Fill colour", empty: "Band colours",
      ...(c.fillBands ? { note: "A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.", warn: true } : {}) } };
  }
  // No fill colour: with Band fill on the bands paint the wash, and with it off
  // the layer colour does, so that is the one fill row to offer.
  return c.fillBands ? {} : { main: "Fill colour" };
}
