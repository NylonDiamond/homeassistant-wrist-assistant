// A run's width in the tile font, Inter, worked out from the font's own
// advances and kerning (`tile-font-metrics.ts`) rather than a canvas. The
// panel's tests have no canvas, and the fixtures the apps check are written
// by them, so they measure as the apps' CoreText does: each character's
// advance, plus the kerning between printable ASCII pairs. Template fitting
// uses the same widths.

import { TILE_FONT_ADVANCES, TILE_FONT_CHARS, TILE_FONT_KERNING, TILE_FONT_UNITS_PER_EM } from "./tile-font-metrics.js";

export type TileFontWeight = keyof typeof TILE_FONT_ADVANCES;

interface Table {
  advance: Map<string, number>;
  kern: Map<string, number>;
}

const tables = new Map<TileFontWeight, Table>();

function table(weight: TileFontWeight): Table {
  let t = tables.get(weight);
  if (t !== undefined) return t;
  const advance = new Map<string, number>();
  const chars = Array.from(TILE_FONT_CHARS);
  TILE_FONT_ADVANCES[weight].split(",").forEach((value, i) => {
    const ch = chars[i];
    if (ch !== undefined) advance.set(ch, parseInt(value, 36) / TILE_FONT_UNITS_PER_EM);
  });
  const kern = new Map<string, number>();
  const list = TILE_FONT_KERNING[weight];
  let at = 0;
  while (at + 2 < list.length) {
    const pair = list.slice(at, at + 2);
    const end = list.indexOf(",", at + 2);
    const stop = end < 0 ? list.length : end;
    kern.set(pair, parseInt(list.slice(at + 2, stop), 36) / TILE_FONT_UNITS_PER_EM);
    at = stop + 1;
  }
  t = { advance, kern };
  tables.set(weight, t);
  return t;
}

/** Whether Inter's tables hold this character. */
export function tileFontHas(ch: string): boolean {
  return table("regular").advance.has(ch);
}

/** `text`'s width in ems of its size, in Inter at `weight`. A character the
 * tables do not hold counts `other(ch)` ems. */
export function tileTextEms(text: string, weight: TileFontWeight, other: (ch: string) => number): number {
  const { advance, kern } = table(weight);
  let sum = 0;
  let previous: string | undefined;
  for (const ch of text) {
    sum += advance.get(ch) ?? other(ch);
    if (previous !== undefined) sum += kern.get(previous + ch) ?? 0;
    previous = ch;
  }
  return sum;
}
