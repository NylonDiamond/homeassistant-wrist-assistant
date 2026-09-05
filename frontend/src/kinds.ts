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
  shape: "#43a047",
  image: "#00acc1",
  tap: "#ec407a",
};

export const KIND_LABEL: Record<LayerKind, string> = {
  text: "Text",
  icon: "Icon",
  gauge: "Gauge",
  shape: "Shape",
  image: "Picture",
  tap: "Tap area",
};

/** The order the add buttons and the picker show the kinds in. */
export const KIND_ORDER: readonly LayerKind[] = ["text", "icon", "gauge", "shape", "image", "tap"];

/** Sections that are not about one kind of layer keep a colour of their own. */
export const SECTION_COLOR = {
  states: "#f9a825",
  tap: KIND_COLOR.tap,
  place: "#78909c",
  complication: "#5c6bc0",
} as const;
