// The panel's measurer for One Look (`UIFontMeasurer` in the app's
// `OneLookText.swift`): text widths from a canvas in the tile font, Inter,
// and SF Symbol image sizes from the panel's bundled symbols. Without a
// canvas (the tests run in node) Inter's own advances and kerning
// (`tile-font-width.ts`) stand in for it, so a layout resolves the same way
// every time and as the apps' CoreText measures it; that is what the shared
// fixtures are written with. A chosen rounded, monospaced or serif design has
// no table and falls back to the app's estimate, 0.55 em a character.
//
// Both apps draw a tile's text in the same bundled Inter (`TileFont`), so
// the watch and the iPhone measure alike, and so does the panel, which loads
// the same cuts (`font.ts`). A width measured before Inter has loaded is in
// the fallback font, so it is not kept; once Inter loads, the cache empties.

import { TILE_FONT_STACK, onTileFontLoaded, tileFontLoaded } from "../../font.js";
import type { IconProvider } from "../../renderer.js";
import { tileTextEms } from "../../tile-font-width.js";
import type { OneLookDevice } from "./metrics.js";
import {
  ONE_LOOK_DEFAULT_GLYPH_ASPECT,
  ONE_LOOK_DEFAULT_GLYPH_EXTENT,
  graphemes,
  type OneLookTextDesign,
  type OneLookTextWeight,
  type TextMeasurer,
} from "./text.js";

/** The font a design is drawn in on each device. The default design is the
 * tile font, Inter, on both. A tile's chosen Font Design keeps the system's:
 * SF Compact Rounded on the watch and SF Pro Rounded on the iPhone, and the
 * stacks the old look's monospaced and serif draw with. One Look's own
 * numbers and units are Inter too (`ONE_LOOK_OWN_FAMILY`). */
export const ONE_LOOK_FONT_FAMILIES: Readonly<Record<OneLookDevice, Readonly<Record<OneLookTextDesign, string>>>> = {
  watch: {
    standard: TILE_FONT_STACK,
    rounded: '"SF Compact Rounded", ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
    monospaced: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace',
    serif: 'ui-serif, "New York", Georgia, "Times New Roman", serif',
  },
  phone: {
    standard: TILE_FONT_STACK,
    rounded: '"SF Pro Rounded", ui-rounded, "SF Compact Rounded", "Nunito", system-ui, sans-serif',
    monospaced: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace',
    serif: 'ui-serif, "New York", Georgia, "Times New Roman", serif',
  },
};

/** One Look's own text, which no Font Design changes: the numbers, units
 * and words of a state line and a big value. The apps draw these in Inter
 * whatever the tile's design (`TileFont.font(size:weight:fallback:)`). */
export const ONE_LOOK_OWN_FAMILY = TILE_FONT_STACK;

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

/** A run's width in Inter from the font's own tables, with the tracking
 * after every character as CoreText's kern adds it. A character the tables
 * do not hold counts 0.55 em, the app's estimate. */
export function oneLookInterWidth(text: string, size: number, weight: OneLookTextWeight, tracking: number): number {
  return tileTextEms(text, weight, () => 0.55) * size + graphemes(text).length * tracking * size;
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
  // The devices' own image, where the table has it (`imageSize`): the
  // margin around the ink differs by symbol.
  const real = icons.imageSize?.(symbol) ?? icons.imageSize?.(known?.(symbol) ?? symbol);
  if (real !== undefined) {
    const wide = real.aspect >= 1;
    return { width: wide ? real.extent : real.extent * real.aspect, height: wide ? real.extent / real.aspect : real.extent, inkWidth, inkHeight };
  }
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
onTileFontLoaded(() => widths.clear());

/** A width from the cache, else measured. A width in the tile font is kept
 * only once that font has loaded. */
function cached(key: string, keep: boolean, measure: () => number): number {
  const hit = widths.get(key);
  if (hit !== undefined) return hit;
  const width = measure();
  if (!keep) return width;
  if (widths.size >= CACHE_LIMIT) widths.clear();
  widths.set(key, width);
  return width;
}

/** The devices' own size for a symbol (`IconProvider.imageSize`), under
 * its name, else the name the provider keeps it under; undefined when the
 * table lacks both, which falls back to the outline and its margin. */
function deviceSize(options: OneLookMeasurerOptions, symbol: string): { aspect: number; extent: number } | undefined {
  const sizes = options.icons?.imageSize;
  if (sizes === undefined || symbol.trim() === "") return undefined;
  return options.icons!.imageSize!(symbol) ?? (options.known === undefined ? undefined : options.icons!.imageSize!(options.known(symbol)));
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
 * (a system font changes its letter shapes with size, as SF does between
 * Text and Display), plus the tracking after every character as CoreText's
 * kern adds it. Widths are cached by everything that shapes them; symbol
 * sizes are read fresh, as a provider that is still loading answers later.
 */
export function oneLookMeasurer(device: OneLookDevice, options: OneLookMeasurerOptions = {}): TextMeasurer {
  const families = ONE_LOOK_FONT_FAMILIES[device];
  const g = options.estimate === true ? null : canvas();
  const measure = (text: string, size: number, weight: OneLookTextWeight, design: OneLookTextDesign, tracking: number): number => {
    if (text === "" || !(size > 0)) return 0;
    const family = families[design];
    if (g === null) return family === TILE_FONT_STACK ? oneLookInterWidth(text, size, weight, tracking) : oneLookEstimatedWidth(text, size);
    const font = `${CSS_WEIGHTS[weight]} ${size}px ${family}`;
    return cached(`${font}|${tracking}|${text}`, family !== TILE_FONT_STACK || tileFontLoaded(), () => {
      g.font = font;
      const width = g.measureText(text).width;
      if (!(width > 0)) return oneLookEstimatedWidth(text, size);
      return width + graphemes(text).length * tracking * size;
    });
  };
  return {
    // One Look's own runs: Inter, rounded or not, as the apps draw them.
    width: (text, size, weight, _rounded, tracking) => measure(text, size, weight, "standard", tracking),
    widthDesign: measure,
    glyphAspect(symbol) {
      const real = deviceSize(options, symbol);
      if (real !== undefined) return real.aspect;
      const image = oneLookSymbolImage(options.icons, symbol, options.known);
      return image === undefined ? ONE_LOOK_DEFAULT_GLYPH_ASPECT : image.width / image.height;
    },
    glyphExtent(symbol) {
      const real = deviceSize(options, symbol);
      if (real !== undefined) return real.extent;
      const image = oneLookSymbolImage(options.icons, symbol, options.known);
      return image === undefined ? ONE_LOOK_DEFAULT_GLYPH_EXTENT : Math.max(image.width, image.height);
    },
  };
}
