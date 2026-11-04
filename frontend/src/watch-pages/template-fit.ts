// How a device fits a template tile's text in its tile, line by line: a model
// of SwiftUI's `minimumScaleFactor(0.4)` on the `Text` of the app's
// `TemplateTileOverlay`, read off renders of that view on the iPhone simulator
// and off a real watch.
//
// What the model holds to, each seen on a render:
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
// No DOM here: the preview draws what this returns (`preview.ts`).

import { templateRichTextSegments } from "./rich-text.js";

export type TemplateFitDevice = "watch" | "iphone";

/** Character widths as parts of the size, Semibold Rounded, measured on the
 * simulators (`UIFont`, watchOS 27 and iOS 27). The watch's font is narrower. */
const UNITS: Readonly<Record<TemplateFitDevice, Readonly<Record<string, number>>>> = {
  iphone: {
    a: .531, b: .581, c: .529, d: .58, e: .539, f: .337, g: .577, h: .568, i: .227, j: .227, k: .519, l: .228, m: .841, n: .558, o: .557, p: .577, q: .577, r: .344, s: .497, t: .336, u: .558, v: .511, w: .763, x: .506, y: .522, z: .492,
    A: .668, B: .627, C: .703, D: .692, E: .565, F: .541, G: .719, H: .718, I: .25, J: .535, K: .644, L: .536, M: .851, N: .709, O: .745, P: .603, Q: .745, R: .625, S: .618, T: .594, U: .703, V: .661, W: .95, X: .667, Y: .646, Z: .626,
    "0": .638, "1": .467, "2": .59, "3": .616, "4": .632, "5": .61, "6": .627, "7": .563, "8": .633, "9": .628,
    " ": .2, ".": .269, ",": .269, ":": .269, ";": .269, "-": .437, "+": .632, "/": .36, "%": .846, "°": .431, "—": 1, "'": .221, "(": .36, ")": .36,
  },
  watch: {
    a: .51, b: .565, c: .5, d: .564, e: .518, f: .339, g: .562, h: .559, i: .242, j: .241, k: .502, l: .239, m: .845, n: .557, o: .535, p: .561, q: .564, r: .351, s: .48, t: .347, u: .555, v: .473, w: .742, x: .496, y: .484, z: .464,
    A: .591, B: .59, C: .6, D: .624, E: .526, F: .497, G: .612, H: .661, I: .249, J: .495, K: .59, L: .473, M: .772, N: .65, O: .635, P: .56, Q: .636, R: .591, S: .565, T: .501, U: .64, V: .586, W: .829, X: .554, Y: .538, Z: .55,
    "0": .557, "1": .386, "2": .533, "3": .544, "4": .564, "5": .566, "6": .547, "7": .515, "8": .57, "9": .547,
    " ": .172, ".": .236, ",": .196, ":": .249, ";": .248, "-": .36, "+": .561, "/": .331, "%": .723, "°": .248, "—": .976, "'": .193, "(": .331, ")": .331,
  },
};

/** The sizes each device starts from, in points, and a row's height as a part
 * of the size. The iPhone's are its default text size. A watch's body size
 * follows its model and text size, which the panel cannot read: 15 is the size
 * a real watch's tile measured (its text stops at 6 points and its rows stand
 * 17 apart), where a 46 mm simulator at its default says 16. */
export const TEMPLATE_FIT_METRICS: Readonly<Record<TemplateFitDevice, { body: number; columnsBody: number; row: number }>> = {
  iphone: { body: 17, columnsBody: 17, row: 22 / 17 },
  watch: { body: 15, columnsBody: 15, row: 17 / 15 },
};

/** The smallest share of the size SwiftUI draws text at. */
export const TEMPLATE_MIN_SCALE = 0.4;

const OTHER_CHAR = 0.56;
const WIDE_CHAR = 1;
/** A measured line against the sum of its characters: the font's kerning. */
const KERNING: Readonly<Record<TemplateFitDevice, number>> = { iphone: 0.9964, watch: 0.9936 };

/** A text's width as a part of the size. */
export function templateTextUnits(text: string, device: TemplateFitDevice): number {
  const units = UNITS[device];
  let sum = 0;
  for (const ch of text) sum += units[ch] ?? ((ch.codePointAt(0) ?? 0) >= 0x2e80 ? WIDE_CHAR : OTHER_CHAR);
  return sum * KERNING[device];
}

/** One run of a drawn line. `row` and `cell` are the template's row and cell,
 * as `templateRows` counts them, which the template editor finds code by. */
export type TemplateFitPiece =
  | { kind: "icon"; symbol: string; color: string | undefined; row: number; cell: number }
  | { kind: "text"; text: string; row: number; cell: number; marked: boolean };

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
}

/** A template's text as runs, line by line. */
function itemsOf(text: string, iconWidth: (symbol: string) => number): Item[][] {
  let row = 0;
  return text.split("\n").map((line) => {
    if (line.trim() === "") return [];
    let cell = -1;
    const items: Item[] = [];
    for (const segment of templateRichTextSegments(line)) {
      if (segment.kind === "icon") {
        cell++;
        items.push({ piece: { kind: "icon", symbol: segment.symbol, color: segment.color, row, cell }, iconWidth: iconWidth(segment.symbol), row, cell, marked: true });
      } else if (segment.text.trim() === "") {
        items.push({ piece: undefined, text: segment.text, row, cell: Math.max(0, cell), marked: false });
      } else {
        if (cell < 0) cell = 0;
        items.push({ piece: undefined, text: segment.text, row, cell, marked: true });
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
    if (last?.kind === "text" && last.row === item.row && last.cell === item.cell && last.marked === item.marked) last.text += text;
    else this.line.pieces.push({ kind: "text", text, row: item.row, cell: item.cell, marked: item.marked });
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
