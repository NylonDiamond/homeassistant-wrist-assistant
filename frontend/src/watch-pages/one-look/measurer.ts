// The panel's measurer for One Look (`UIFontMeasurer` in the app's
// `OneLookText.swift`): text widths from a canvas in the device's own system
// font, and SF Symbol image sizes from the panel's bundled symbols. Without
// a canvas (the tests run in node) it falls back to the app's own estimate,
// 0.55 em a character, so a layout still resolves the same way every time.

import type { IconProvider } from "../../renderer.js";
import type { OneLookDevice } from "./metrics.js";
import {
  ONE_LOOK_DEFAULT_GLYPH_ASPECT,
  ONE_LOOK_DEFAULT_GLYPH_EXTENT,
  graphemes,
  type OneLookTextDesign,
  type OneLookTextWeight,
  type TextMeasurer,
} from "./text.js";

/** The system font a design is drawn in on each device: SF Compact on the
 * watch, SF Pro on the iPhone. The watch's two are the same stacks as
 * `WATCH_FONT_FAMILY` and `WATCH_ROUNDED_FAMILY` in preview.ts, the
 * iPhone's the one phone-frame.ts gives its screen; monospaced and serif
 * are the stacks the old look's Font Design draws with. */
export const ONE_LOOK_FONT_FAMILIES: Readonly<Record<OneLookDevice, Readonly<Record<OneLookTextDesign, string>>>> = {
  watch: {
    standard: '"SF Compact Text", "SF Compact", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    rounded: '"SF Compact Rounded", ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
    monospaced: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace',
    serif: 'ui-serif, "New York", Georgia, "Times New Roman", serif',
  },
  phone: {
    standard: '"SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    rounded: '"SF Pro Rounded", ui-rounded, "SF Compact Rounded", "Nunito", system-ui, sans-serif',
    monospaced: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace',
    serif: 'ui-serif, "New York", Georgia, "Times New Roman", serif',
  },
};

const CSS_WEIGHTS: Readonly<Record<OneLookTextWeight, number>> = { regular: 400, medium: 500, semibold: 600, bold: 700 };

/** A weight as CSS writes it. */
export function oneLookCssWeight(weight: OneLookTextWeight): number {
  return CSS_WEIGHTS[weight];
}

/** The app's estimate when it has no font to measure with: 0.55 em a
 * character, with no tracking. */
export function oneLookEstimatedWidth(text: string, size: number): number {
  return graphemes(text).length * size * 0.55;
}

/** The point size the bundled symbols' viewBoxes are measured at
 * (`WATCH_SYMBOL_EXPORT_SIZE` in preview.ts). */
const SYMBOL_EXPORT_SIZE = 22;

/**
 * The margin a symbol's image keeps around its ink, in ems of the point
 * size: across, then up and down, both sides together. The bundled viewBox
 * is the ink's tight box, while the app measures the image
 * (`UIImage(systemName:)`), which is larger by about this much whatever the
 * symbol: the medians over a thousand symbols drawn by AppKit at 100 pt
 * against their viewBoxes (the light bulb's image is 91 by 131 for an ink of
 * 62 by 108, so its extent is 1.31 and its aspect 0.69, as the app has it).
 */
export const ONE_LOOK_SYMBOL_MARGIN_W = 0.26;
export const ONE_LOOK_SYMBOL_MARGIN_H = 0.24;

/** A symbol's image and the ink inside it, in ems of the point size it is
 * drawn at. The ink is centred in the image. */
export interface OneLookSymbolImage {
  readonly width: number;
  readonly height: number;
  readonly inkWidth: number;
  readonly inkHeight: number;
}

/** A provider glyph's viewBox width and height, read off what it renders
 * (as preview.ts reads it), or undefined when it says nothing readable. */
function viewBox(icons: IconProvider, name: string): [number, number] | undefined {
  const result = icons.render(name, 1, "#FFFFFF") as { values?: readonly unknown[] } | undefined;
  for (const v of result?.values ?? []) {
    const m = typeof v === "string" ? /^\s*-?[\d.]+\s+-?[\d.]+\s+([\d.]+)\s+([\d.]+)\s*$/.exec(v) : null;
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return undefined;
}

/** A symbol's image as the app's `UIImage(systemName:)` has it, from the
 * provider's glyph and the margin around it; undefined for a symbol the
 * provider does not know. `known` maps an old name to the one the provider
 * keeps it under. */
export function oneLookSymbolImage(
  icons: IconProvider | undefined, symbol: string, known?: (name: string) => string,
): OneLookSymbolImage | undefined {
  if (icons === undefined || symbol.trim() === "") return undefined;
  const box = viewBox(icons, known?.(symbol) ?? symbol);
  if (box === undefined || !(box[0] > 0) || !(box[1] > 0)) return undefined;
  const inkWidth = box[0] / SYMBOL_EXPORT_SIZE;
  const inkHeight = box[1] / SYMBOL_EXPORT_SIZE;
  return { width: inkWidth + ONE_LOOK_SYMBOL_MARGIN_W, height: inkHeight + ONE_LOOK_SYMBOL_MARGIN_H, inkWidth, inkHeight };
}

/** The one canvas every measurer shares, or null where there is none. */
let context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null | undefined;

function canvas(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  if (context !== undefined) return context;
  context = null;
  try {
    if (typeof OffscreenCanvas !== "undefined") context = new OffscreenCanvas(1, 1).getContext("2d");
    if (context === null && typeof document !== "undefined") context = document.createElement("canvas").getContext("2d");
  } catch {
    context = null;
  }
  return context;
}

/** A runaway guard, not an eviction policy: a page measures a few hundred
 * runs. The app keeps the same. */
const CACHE_LIMIT = 4096;
const widths = new Map<string, number>();

function cached(key: string, measure: () => number): number {
  const hit = widths.get(key);
  if (hit !== undefined) return hit;
  const width = measure();
  if (widths.size >= CACHE_LIMIT) widths.clear();
  widths.set(key, width);
  return width;
}

export interface OneLookMeasurerOptions {
  /** The symbols to size glyphs from; without it every glyph takes the
   * app's defaults. */
  readonly icons?: IconProvider;
  /** Maps an old symbol name to the one the provider keeps it under. */
  readonly known?: (name: string) => string;
  /** Measure by the estimate even where a canvas exists (stable pictures). */
  readonly estimate?: boolean;
}

/**
 * A measurer for a device's tiles. Text is measured at its own point size
 * (system fonts change their letter shapes with size, as SF does between
 * Text and Display), plus the tracking after every character as CoreText's
 * kern adds it. Widths are cached by everything that shapes them; symbol
 * sizes are read fresh, as a provider that is still loading answers later.
 */
export function oneLookMeasurer(device: OneLookDevice, options: OneLookMeasurerOptions = {}): TextMeasurer {
  const families = ONE_LOOK_FONT_FAMILIES[device];
  const g = options.estimate === true ? null : canvas();
  const measure = (text: string, size: number, weight: OneLookTextWeight, design: OneLookTextDesign, tracking: number): number => {
    if (text === "" || !(size > 0)) return 0;
    if (g === null) return oneLookEstimatedWidth(text, size);
    const font = `${CSS_WEIGHTS[weight]} ${size}px ${families[design]}`;
    return cached(`${font}|${tracking}|${text}`, () => {
      g.font = font;
      const width = g.measureText(text).width;
      if (!(width > 0)) return oneLookEstimatedWidth(text, size);
      return width + graphemes(text).length * tracking * size;
    });
  };
  return {
    width: (text, size, weight, rounded, tracking) => measure(text, size, weight, rounded ? "rounded" : "standard", tracking),
    widthDesign: measure,
    glyphAspect(symbol) {
      const image = oneLookSymbolImage(options.icons, symbol, options.known);
      return image === undefined ? ONE_LOOK_DEFAULT_GLYPH_ASPECT : image.width / image.height;
    },
    glyphExtent(symbol) {
      const image = oneLookSymbolImage(options.icons, symbol, options.known);
      return image === undefined ? ONE_LOOK_DEFAULT_GLYPH_EXTENT : Math.max(image.width, image.height);
    },
  };
}
