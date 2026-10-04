// One color and one plain name per layer kind, and one color per inspector
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
  list: "#c0ca33",
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
  list: "List",
  shape: "Shape",
  image: "Picture",
  tap: "Tap zone",
  chartTimes: "Clock times",
  chartDots: "Chart dots",
  chartGrid: "Chart grid",
  imageTime: "Timestamp",
};

/** The order the add buttons and the picker show the kinds in. Clock times,
 * dots, grid and a picture's timestamp are not here: they are made from their
 * layer's Extras card, never blank. */
export const KIND_ORDER: readonly LayerKind[] = ["text", "icon", "gauge", "chart", "timeline", "list", "shape", "image", "tap"];

/**
 * One color per inspector card, the same on every kind of layer, and the one
 * place that says which card wears which. A card's color shows in three places
 * only: its outline, the chip behind its title glyph, and the dot that marks a
 * changed setting. Everything inside the card is neutral.
 *
 * The values name the panel's palette tokens (`--wa-hue-*`), not colors, so
 * the light and dark skins can each set a shade that reads on their ground.
 * On screen a layer's cards run Content, Look, Extras or Fill by value,
 * Rules, Position, Tap: blue, green, orange, yellow, pink, red, so two cards
 * next to each other never share a hue. Purple is kept for Import alone.
 */
export const SECTION_COLOR = {
  content: "var(--wa-hue-blue)",
  look: "var(--wa-hue-green)",
  /** Extras, Row, Fill by value and Timestamp: no layer has two of them. */
  numbers: "var(--wa-hue-orange)",
  position: "var(--wa-hue-pink)",
  states: "var(--wa-hue-yellow)",
  tap: "var(--wa-hue-red)",
  /** The Home Screen card, between a shape's Look and its Rules. */
  home: "var(--wa-hue-blue)",
  /** A layer's name and other cards about no section: neutral. */
  place: "var(--wa-hue-grey)",
  complication: "var(--wa-hue-blue)",
  group: "var(--wa-hue-green)",
  /** A locked group reads in red, so it stands out from the rest of the list. */
  locked: "var(--wa-hue-red)",
} as const;

/** The left column's cards, from the same palette: Pages blue, Layers green,
 * Shared values red. */
export const LEFT_CARD_COLOR = {
  pages: "var(--wa-hue-blue)",
  layers: "var(--wa-hue-green)",
  values: "var(--wa-hue-red)",
} as const;
