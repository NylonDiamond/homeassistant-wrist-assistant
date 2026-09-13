// One colour and one plain name per layer kind, and one colour per inspector
// section. The Layers list, the add buttons, the preview outline and the
// inspector cards all read from here, so a kind looks the same wherever it
// turns up and the eye can find "the gauge" without reading.
//
// The hues are Material 500/600 weights: strong enough to read as text on a
// white Home Assistant theme and still clear on a dark one.

import type { Element as CElement } from "./model.js";

export type LayerKind = CElement["kind"];

export const KIND_COLOR: Record<LayerKind, string> = {
  text: "#42a5f5",
  icon: "#ab47bc",
  gauge: "#fb8c00",
  chart: "#3949ab",
  timeline: "#00897b",
  shape: "#43a047",
  image: "#00acc1",
  tap: "#ec407a",
  chartTimes: "#5e35b1",
  chartDots: "#5e35b1",
  chartGrid: "#5e35b1",
  imageTime: "#00838f",
};

export const KIND_LABEL: Record<LayerKind, string> = {
  text: "Text",
  icon: "Icon",
  gauge: "Gauge",
  chart: "Chart",
  timeline: "Timeline",
  shape: "Shape",
  image: "Picture",
  tap: "Tap area",
  chartTimes: "Clock times",
  chartDots: "Chart dots",
  chartGrid: "Chart grid",
  imageTime: "Timestamp",
};

/** The order the add buttons and the picker show the kinds in. Clock times,
 * dots, grid and a picture's timestamp are not here: they are made from their
 * layer's Extras card, never blank. */
export const KIND_ORDER: readonly LayerKind[] = ["text", "icon", "gauge", "chart", "timeline", "shape", "image", "tap"];

/**
 * One colour per inspector card, the same on every kind of layer, so Content,
 * Look, Numbers, States, Position and Tap never share a tint. The hues are
 * spread round the wheel and the order on screen alternates warm and cool, so
 * two cards next to each other are never neighbours on the wheel. Numbers
 * (charts only) and Timestamp (pictures only) share teal, since no layer has
 * both.
 */
export const SECTION_COLOR = {
  content: "#4a7fe8",
  look: "#a15fe0",
  numbers: "#26a69a",
  position: "#66bb6a",
  states: "#f9a825",
  tap: KIND_COLOR.tap,
  place: "#78909c",
  complication: "#5c6bc0",
  group: "#90a4ae",
  /** A locked group reads in red, so it stands out from the rest of the list. */
  locked: "#e53935",
} as const;
