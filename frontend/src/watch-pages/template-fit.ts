// How a device fits a template tile's text in its tile, line by line: a model
// of SwiftUI's `minimumScaleFactor(0.4)` on the `Text` of the app's
// `TemplateTileOverlay`.
//
// Both apps draw that text in the bundled Inter SemiBold (`TileFont`), so
// the widths are the same on the iPhone and the watch. They come from the
// font file itself, its advances and its kerning (`tile-font-width.ts`), not
// from renders. A row's height is Inter's line height from its metrics
// (ascender 1984 and descender 494 of 2048 units). That height has not yet
// been measured on a real watch; the SF fonts' rows were.
//
// What the model holds to, each seen on a render in the system font:
//   - The words shrink, to 40% at most. An icon inside the text does not: it
//     stays at the full size, and a row with one stays a full row tall.
//   - The size is the largest where every line fits, the lines stay within the
//     limit, and they fit the height.
//   - A word with a digit or a sign in it never breaks while a smaller size
//     would fit it on its line, so a long time stamp shrinks the whole tile. A
//     word of letters is hyphenated instead, and breaks after its own hyphens.
//   - At 40% with no fit, a word breaks anywhere, and the lines that do not fit
//     are dropped, the last one left ending in "…".
//
// On the iPhone the tile is the watch's, zoomed (`OneLookZoom`): the preview
// fits it as the watch, from the fixed 15 pt body at the tile's room over the
// zoom, and draws it the zoom bigger. Only the line cap stays the iPhone's own
// key.
//
// No DOM here: the preview draws what this returns (`preview.ts`).

import { tileTextEms } from "../tile-font-width.js";
import { templateIconDrawnColor, templateStyledSegments } from "./rich-text.js";

/** The device whose fit a template's text takes: the watch's on both, since
 * the iPhone draws a template tile as the watch does at its virtual size,
 * zoomed (`OneLookZoom`, the app's `docs/one_size_table_2026-11.md`, "Text
 * Size does not reach tiles"). */
export type TemplateFitDevice = "watch";

/** Inter's line height as a part of the size: (1984 + 494) / 2048. */
export const TEMPLATE_INTER_ROW = 2478 / 2048;

/** The size the text starts from, in points, plain and in columns, and a
 * row's height as a part of the size: the fixed 15 pt body both apps start
 * a template tile from whatever the device's Text Size
 * (`OneLookZoom.referenceBody`), and Inter's line. The iPhone's own 17 is
 * gone: its tile is the watch's, scaled up. */
export const TEMPLATE_FIT_METRICS: Readonly<Record<TemplateFitDevice, { body: number; columnsBody: number; row: number }>> = {
  watch: { body: 15, columnsBody: 15, row: TEMPLATE_INTER_ROW },
};

/** The smallest share of the size SwiftUI draws text at. */
export const TEMPLATE_MIN_SCALE = 0.4;

const OTHER_CHAR = 0.56;
const WIDE_CHAR = 1;

/** A text's width as a part of the size, in Inter SemiBold. The device no
 * longer changes it: both draw the same font. */
export function templateTextUnits(text: string, _device: TemplateFitDevice): number {
  return tileTextEms(text, "semibold", (ch) => ((ch.codePointAt(0) ?? 0) >= 0x2e80 ? WIDE_CHAR : OTHER_CHAR));
}

/** One run of a drawn line. `row` and `cell` are the template's row and cell,
 * as `templateRows` counts them, which the template editor finds code by. */
export type TemplateFitPiece =
  | { kind: "icon"; symbol: string; color: string | undefined; row: number; cell: number }
  | { kind: "text"; text: string; row: number; cell: number; marked: boolean; color?: string };

export interface TemplateFitLine {
  pieces: TemplateFitPiece[];
  hasIcon: boolean;
}

export interface TemplateFit {
  /** The words' size, in points. */
  size: number;
  /** The icons' size, in points: the device's body size, whatever `size` is. */
  iconSize: number;
  /** A line's height with an icon on it, and without, in points. */
  iconRow: number;
  textRow: number;
  lines: TemplateFitLine[];
}

interface Item {
  piece: TemplateFitPiece | undefined;
  /** A run of text to wrap, or an icon's width as a part of the body size. */
  text?: string;
  iconWidth?: number;
  row: number;
  cell: number;
  marked: boolean;
  /** The text's colour marker (`[color:SPEC]`), undefined for the ink. */
  color?: string;
}

/** A template's text as runs, line by line, with the colour markers read:
 * they take no width, and an icon's colour is its own, else its run's. */
function itemsOf(text: string, iconWidth: (symbol: string) => number): Item[][] {
  let row = 0;
  return text.split("\n").map((line) => {
    const styled = templateStyledSegments(line);
    if (styled.every((seg) => seg.kind === "text" && seg.text.trim() === "")) return [];
    let cell = -1;
    const items: Item[] = [];
    for (const segment of styled) {
      if (segment.kind === "icon") {
        cell++;
        const color = templateIconDrawnColor(segment.color, segment.run);
        items.push({ piece: { kind: "icon", symbol: segment.symbol, color, row, cell }, iconWidth: iconWidth(segment.symbol), row, cell, marked: true });
      } else if (segment.text.trim() === "") {
        items.push({ piece: undefined, text: segment.text, row, cell: Math.max(0, cell), marked: false, ...(segment.color === undefined ? {} : { color: segment.color }) });
      } else {
        if (cell < 0) cell = 0;
        items.push({ piece: undefined, text: segment.text, row, cell, marked: true, ...(segment.color === undefined ? {} : { color: segment.color }) });
      }
    }
    row++;
    return items;
  });
}

/** Letters alone: the words the device hyphenates rather than shrinks for. */
const HYPHENATES = /^[\p{L}\p{M}'-]+$/u;
/** A hyphen between letters, where a word may break. */
const AFTER_HYPHEN = /(?<=\p{L}-)(?=\p{L})/u;

class Wrapper {
  lines: TemplateFitLine[] = [];
  overflow = false;
  private x = 0;
  private line: TemplateFitLine = { pieces: [], hasIcon: false };

  constructor(private readonly width: number, private readonly size: number, private readonly body: number, private readonly device: TemplateFitDevice, private readonly breakAnywhere: boolean) {}

  private wide(text: string): number {
    return templateTextUnits(text, this.device) * this.size;
  }

  private place(text: string, item: Item): void {
    const last = this.line.pieces[this.line.pieces.length - 1];
    if (last?.kind === "text" && last.row === item.row && last.cell === item.cell && last.marked === item.marked && last.color === item.color) last.text += text;
    else this.line.pieces.push({ kind: "text", text, row: item.row, cell: item.cell, marked: item.marked, ...(item.color === undefined ? {} : { color: item.color }) });
    this.x += this.wide(text);
  }

  private newLine(): void {
    this.lines.push(this.line);
    this.line = { pieces: [], hasIcon: false };
    this.x = 0;
  }

  icon(item: Item): void {
    const wide = (item.iconWidth ?? 1) * this.body;
    if (this.x > 0 && this.x + wide > this.width) this.newLine();
    if (item.piece !== undefined) this.line.pieces.push(item.piece);
    this.line.hasIcon = true;
    this.x += wide;
  }

  space(text: string, item: Item): void {
    // A space at the end of a line hangs off it, so it wraps nothing.
    if (this.x === 0 && this.lines.length > 0 && this.line.pieces.length === 0) return;
    this.place(text, item);
  }

  word(token: string, item: Item): void {
    const wide = this.wide(token);
    if (this.x + wide <= this.width) {
      this.place(token, item);
      return;
    }
    if (this.x > 0) this.newLine();
    if (wide <= this.width) {
      this.place(token, item);
      return;
    }
    const hyphenates = HYPHENATES.test(token);
    if (!hyphenates && !this.breakAnywhere) {
      this.overflow = true;
      this.place(token, item);
      return;
    }
    const mark = hyphenates ? "-" : "";
    let part = "";
    for (const ch of token) {
      if (part !== "" && this.wide(part + ch + mark) > this.width) {
        this.place(part + mark, item);
        this.newLine();
        part = "";
      }
      part += ch;
    }
    if (part !== "") this.place(part, item);
  }

  finishLine(): void {
    this.newLine();
  }
}

function layout(all: readonly (readonly Item[])[], width: number, size: number, body: number, device: TemplateFitDevice, breakAnywhere: boolean): { lines: TemplateFitLine[]; overflow: boolean } {
  const wrap = new Wrapper(width, size, body, device, breakAnywhere);
  for (const items of all) {
    for (const item of items) {
      if (item.text === undefined) {
        wrap.icon(item);
        continue;
      }
      for (const run of item.text.split(/( +)/)) {
        if (run === "") continue;
        if (run.trim() === "") wrap.space(run, item);
        else for (const token of run.split(AFTER_HYPHEN)) wrap.word(token, item);
      }
    }
    wrap.finishLine();
  }
  return { lines: wrap.lines, overflow: wrap.overflow };
}

/** The lines the room holds at the smallest size, the last one left ending in
 * "…" when any are dropped. The first line always stays. */
function cutToRoom(lines: TemplateFitLine[], limit: number, height: number, textRow: number, iconRow: number): TemplateFitLine[] {
  const kept: TemplateFitLine[] = [];
  let used = 0;
  for (const line of lines) {
    const tall = line.hasIcon ? iconRow : textRow;
    if (kept.length > 0 && (kept.length >= limit || used + tall > height)) break;
    kept.push(line);
    used += tall;
  }
  if (kept.length === lines.length) return kept;
  const last = kept[kept.length - 1];
  if (last !== undefined) {
    const tail = last.pieces[last.pieces.length - 1];
    if (tail?.kind === "text") tail.text = `${tail.text.trimEnd()}…`;
    else if (tail !== undefined) last.pieces.push({ kind: "text", text: "…", row: tail.row, cell: tail.cell, marked: false });
  }
  return kept;
}

/**
 * The size and the lines a device draws a template's plain text in, in a room
 * of `width` by `height` points, with at most `limit` lines. `iconWidth` is a
 * symbol's width as a part of the body size.
 */
export function templateTextFit(text: string, width: number, height: number, limit: number, device: TemplateFitDevice, iconWidth: (symbol: string) => number = () => 1): TemplateFit {
  const { body, row } = TEMPLATE_FIT_METRICS[device];
  const items = itemsOf(text, iconWidth);
  const iconRow = body * row;
  const room = Math.max(1, width);
  const steps = Math.round(body * (1 - TEMPLATE_MIN_SCALE) * 10);
  for (let step = 0; step < steps; step++) {
    const size = Math.round((body - step / 10) * 10) / 10;
    const { lines, overflow } = layout(items, room, size, body, device, false);
    const textRow = size * row;
    const tall = lines.reduce((sum, line) => sum + (line.hasIcon ? iconRow : textRow), 0);
    if (!overflow && lines.length <= limit && tall <= height) return { size, iconSize: body, iconRow, textRow, lines };
  }
  const size = Math.round(body * TEMPLATE_MIN_SCALE * 10) / 10;
  const textRow = size * row;
  const { lines } = layout(items, room, size, body, device, true);
  return { size, iconSize: body, iconRow, textRow, lines: cutToRoom(lines, limit, height, textRow, iconRow) };
}
