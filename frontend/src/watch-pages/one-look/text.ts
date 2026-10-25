// One Look's text measuring and fitting, copied from the app's
// `OneLookText.swift` (the mock's `midTrunc` to `fitState`): the name and
// state ladders. Everything here is pure: a measurer, the device's metrics
// and the room in, sizes and already split lines out. The measurer is a
// parameter so the tests can use a fake one with known widths; the panel's
// real one is in `measurer.ts`.
//
// The operations run in the Swift's order (`base * avail / w0`, never
// `base * (avail / w0)`), so a size floored to a twentieth lands on the same
// twentieth as on the device.

import type { OneLookTileStyle } from "./layout.js";
import { oneLookMetrics, oneLookUnitTextSize, type OneLookDevice, type OneLookMetrics } from "./metrics.js";

/** The weights One Look draws text in: words (400), the bridge look's
 * names (500), names and units (600), numbers (700). */
export type OneLookTextWeight = "regular" | "medium" | "semibold" | "bold";

/** The designs a name may be drawn in (the tile's Font Design). */
export type OneLookTextDesign = "standard" | "rounded" | "monospaced" | "serif";

/**
 * Measures one line of text as it will be drawn: the system font (SF Pro on
 * the iPhone, SF Compact on the watch), or its rounded design for numbers.
 * `tracking` is in ems of `size` and is added after every character, as
 * CoreText's kern is.
 */
export interface TextMeasurer {
  width(text: string, size: number, weight: OneLookTextWeight, rounded: boolean, tracking: number): number;
  /** The same in any design. A measurer without it measures the other
   * designs as the system's, as the app's protocol does by default. */
  widthDesign?(text: string, size: number, weight: OneLookTextWeight, design: OneLookTextDesign, tracking: number): number;
  /** An SF Symbol's width over its height, as its image is drawn scaled to
   * fit a square. 1 when unknown (and when absent). */
  glyphAspect?(symbol: string): number;
  /** An SF Symbol's image's longer side over the font size it is drawn at,
   * about 1.3 for a light bulb. 1.25 when unknown (and when absent). */
  glyphExtent?(symbol: string): number;
}

/** The app's defaults for a symbol it cannot measure. */
export const ONE_LOOK_DEFAULT_GLYPH_ASPECT = 1;
export const ONE_LOOK_DEFAULT_GLYPH_EXTENT = 1.25;

/** `width(_:size:weight:design:tracking:)`, with the protocol's default. */
export function measureDesign(
  measurer: TextMeasurer, text: string, size: number, weight: OneLookTextWeight, design: OneLookTextDesign, tracking: number,
): number {
  return measurer.widthDesign !== undefined
    ? measurer.widthDesign(text, size, weight, design, tracking)
    : measurer.width(text, size, weight, design === "rounded", tracking);
}

export function glyphAspectOf(measurer: TextMeasurer, symbol: string): number {
  return measurer.glyphAspect?.(symbol) ?? ONE_LOOK_DEFAULT_GLYPH_ASPECT;
}

export function glyphExtentOf(measurer: TextMeasurer, symbol: string): number {
  return measurer.glyphExtent?.(symbol) ?? ONE_LOOK_DEFAULT_GLYPH_EXTENT;
}

const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl
  ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
  : undefined;

/** A string's characters as Swift counts them (grapheme clusters), so an
 * emoji or a letter with its accent is one character, as on the device. */
export function graphemes(text: string): string[] {
  if (segmenter === undefined) return Array.from(text);
  return Array.from(segmenter.segment(text), (s) => s.segment);
}

/** What a tile says under its name, before fitting (`StateLine`). */
export type StateLine =
  /** A number in bold rounded ("64", "4:32"), its unit glued on or after a
   * space, and a word after it. The watch drops the tail on tiles under 8
   * columns unless `keepTail`. */
  | { kind: "number"; figure: string; unit?: string; unitSpaced?: boolean; tail?: string; keepTail?: boolean }
  /** A word ("Locked"), the short form tried before it shrinks ("Vacant"),
   * and the amber dot before it. */
  | { kind: "word"; word: string; short?: string; amber?: boolean }
  | { kind: "none" };

export const NO_STATE: StateLine = Object.freeze({ kind: "none" });

/** A fitted name: its size and its lines, already split (a hyphenated word
 * is two strings, "Night-" and "stand"). No lines: no name drawn. */
export interface NameFit {
  readonly size: number;
  readonly lines: readonly string[];
}

export type StateFitParts =
  /** The number, its unit (with its leading space when spaced) and the
   * tail, if it kept one. */
  | { kind: "number"; figure: string; unit?: string; tail?: string }
  /** The word that fitted (the full or the short form) and the amber dot. */
  | { kind: "word"; word: string; amber: boolean };

/** A fitted state line (`StateFit`); `fitState` gives undefined when the
 * line was dropped. */
export interface StateFit {
  readonly parts: StateFitParts;
  /** The number's size, or the word's (which may have shrunk). */
  readonly size: number;
  /** The unit's size beside the number. */
  readonly unitSize: number;
  /** The tail's size after the number: the full word size, never shrunk. */
  readonly tailSize: number;
  /** The number's size (x 1.1 on the iPhone), or 1.2 x the full word size
   * even when the word shrank. */
  readonly lineHeight: number;
}

/** The fitted line as plain text, for a screen reader's label. */
export function stateFitText(fit: StateFit): string {
  const p = fit.parts;
  if (p.kind === "word") return p.word;
  return p.figure + (p.unit ?? "") + (p.tail === undefined ? "" : " " + p.tail);
}

/** Fitting leaves this share of the room unused, for the measurer's
 * rounding against the drawn text. */
export const ONE_LOOK_AVAIL_SHARE = 0.97;
/** The smallest name a narrow watch tile steps down to, and its step. The
 * floor never scales with the tile's own name size. */
export const ONE_LOOK_NARROW_MIN = 10;
export const ONE_LOOK_NARROW_STEP = 0.25;
/** A name on one line may shrink to the first share of the row's size; a
 * lone word to the second; anything else draws at the third, cut in the
 * middle if it must be. */
export const ONE_LOOK_ONE_LINE_SHARE = 0.88;
export const ONE_LOOK_LONE_WORD_SHARE = 0.72;
export const ONE_LOOK_LAST_SHARE = 0.8;
/** A word state may shrink to this share of its size (never under
 * `textMin`) before it is dropped. */
export const ONE_LOOK_STATE_SHARE = 0.85;
/** The amber dot and its gap, in ems of the word. */
export const ONE_LOOK_AMBER_DOT_EM = 0.8;
/** The watch shows a number's tail only on tiles at least this wide,
 * unless the state keeps it. */
export const ONE_LOOK_WATCH_TAIL_COLUMNS = 8;

const ELLIPSIS = "…";

/** Floors to a twentieth of a point, as the mock does for every fitted size. */
function floor20(value: number): number {
  return Math.floor(value * 20) / 20;
}

/** Rounds to a hundredth, half away from zero as Swift's `rounded()`. */
function round100(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value) * 100) / 100;
}

/** The mock splits on single spaces, keeping empty words. */
function words(name: string): string[] {
  return name.split(" ");
}

/** The text less its last character. */
function dropLast(text: string): string {
  const chars = graphemes(text);
  chars.pop();
  return chars.join("");
}

/** The mock's text ladders for one device (`OneLookTextFitter`). Every
 * width goes through the measurer. A fitter never changes; `centredNames`
 * and `styled` give new ones. */
export class OneLookTextFitter {
  readonly device: OneLookDevice;
  readonly metrics: OneLookMetrics;
  readonly measurer: TextMeasurer;
  /** The weight names are measured at: the bridge look's centred names are
   * medium (`centredNames`). */
  readonly nameWeight: OneLookTextWeight;
  /** The weight the tile's Font Weight picks, which wins over the look's
   * own in every layout; undefined keeps the look's. */
  readonly nameWeightSet: OneLookTextWeight | undefined;
  /** The tile's Font Design. */
  readonly nameDesign: OneLookTextDesign;

  constructor(
    device: OneLookDevice,
    measurer: TextMeasurer,
    metrics?: OneLookMetrics,
    names: { weight?: OneLookTextWeight; weightSet?: OneLookTextWeight; design?: OneLookTextDesign } = {},
  ) {
    this.device = device;
    this.metrics = metrics ?? oneLookMetrics(device);
    this.measurer = measurer;
    this.nameWeight = names.weight ?? "semibold";
    this.nameWeightSet = names.weightSet;
    this.nameDesign = names.design ?? "standard";
  }

  /** This fitter for the bridge look's centred names. */
  get centredNames(): OneLookTextFitter {
    return new OneLookTextFitter(this.device, this.measurer, this.metrics, {
      weight: this.nameWeightSet ?? "medium",
      weightSet: this.nameWeightSet,
      design: this.nameDesign,
    });
  }

  /** This fitter for a tile's own name settings. */
  styled(style: Pick<OneLookTileStyle, "nameWeight" | "nameDesign">): OneLookTextFitter {
    return new OneLookTextFitter(this.device, this.measurer, this.metrics, {
      weight: style.nameWeight ?? "semibold",
      weightSet: style.nameWeight,
      design: style.nameDesign,
    });
  }

  // Measuring

  nameWidth(text: string, size: number): number {
    return measureDesign(this.measurer, text, size, this.nameWeight, this.nameDesign, this.metrics.nameTracking);
  }

  private width(text: string, size: number, weight: OneLookTextWeight, rounded = false): number {
    return this.measurer.width(text, size, weight, rounded, this.metrics.nameTracking);
  }

  // Names

  /** Cuts in the middle so the last word survives: "Aranet4 03A66 Battery"
   * becomes "Aranet4…Battery". `avail` is used as given. */
  midTrunc(text: string, size: number, avail: number): string {
    if (this.nameWidth(text, size) <= avail) return text;
    const w = words(text);
    const last = w[w.length - 1]!;
    if (w.length > 1) {
      for (let n = w.length - 2; n >= 1; n--) {
        const s = w.slice(0, n).join(" ") + ELLIPSIS + last;
        if (this.nameWidth(s, size) <= avail) return s;
      }
      let head = w[0]!;
      while (graphemes(head).length > 1) {
        head = dropLast(head);
        const s = head + ELLIPSIS + last;
        if (this.nameWidth(s, size) <= avail) return s;
      }
    }
    let s = text;
    while (graphemes(s).length > 1 && this.nameWidth(s + ELLIPSIS, size) > avail) s = dropLast(s);
    return s + ELLIPSIS;
  }

  /** A greedy two line wrap; the second line is cut in the middle if it
   * still overflows. `avail` is used as given. */
  wrap2(name: string, size: number, avail: number): string[] {
    const w = words(name);
    let first = w[0]!;
    let i = 1;
    while (i < w.length && this.nameWidth(first + " " + w[i], size) <= avail) {
      first += " " + w[i];
      i += 1;
    }
    const rest = w.slice(i).join(" ");
    return rest === "" ? [first] : [first, this.midTrunc(rest, size, avail)];
  }

  /**
   * The name ladder: full; down to 88% on one line; two lines, shrunk until
   * the longest word fits whole; a lone word down to 72%; else 80% on one
   * line, cut in the middle if it must be. Never under the device's floor.
   * `two` is the size two lines may use (undefined when they do not fit),
   * `base` the row's name size.
   */
  fitName(name: string, avail: number, two: number | undefined, base?: number): NameFit {
    const m = this.metrics;
    const b = base ?? m.nameSize;
    const room = avail * ONE_LOOK_AVAIL_SHARE;
    const w0 = this.nameWidth(name, b);
    if (w0 <= room) return { size: b, lines: [name] };
    const fitSize = floor20(b * room / w0);
    // A row that has already shrunk does not shrink a second time if two
    // lines will do.
    const capped = b < m.nameSize - 0.01;
    const ws = words(name);
    if (fitSize >= Math.max(b * ONE_LOOK_ONE_LINE_SHARE, m.nameMin) && !(capped && ws.length > 1 && two !== undefined)) {
      return { size: fitSize, lines: [name] };
    }
    if (ws.length > 1 && two !== undefined) {
      const longest = ws.reduce((most, word) => Math.max(most, this.nameWidth(word, two)), 0);
      const size = Math.max(m.nameMin, floor20(two * Math.min(1, room / longest)));
      return { size, lines: this.wrap2(name, size, room) };
    }
    if (ws.length === 1 && fitSize >= Math.max(b * ONE_LOOK_LONE_WORD_SHARE, m.nameMin)) {
      return { size: fitSize, lines: [name] };
    }
    const size = Math.max(b * ONE_LOOK_LAST_SHARE, m.nameMin);
    if (this.nameWidth(name, size) <= room) return { size, lines: [name] };
    return { size, lines: [this.midTrunc(name, size, room)] };
  }

  /**
   * The name ladder on a narrow watch tile (4 columns or fewer), which never
   * cuts a name of two words or fewer: one line, stepping down a quarter
   * point to 10; then two lines at the largest size that fits, split between
   * words, or a single word hyphenated near its middle with 3 or more
   * letters a side ("Night-" / "stand"); only then cut.
   */
  fitNarrow(name: string, avail: number, twoOK: boolean, base?: number): NameFit {
    const b = base ?? this.metrics.nameSize;
    const room = avail * ONE_LOOK_AVAIL_SHARE;
    const sizes: number[] = [];
    for (let step = 0; ; step++) {
      const s = b - step * ONE_LOOK_NARROW_STEP;
      if (s < ONE_LOOK_NARROW_MIN - 0.001) break;
      sizes.push(round100(s));
    }
    for (const s of sizes) if (this.nameWidth(name, s) <= room) return { size: s, lines: [name] };
    if (!twoOK) return { size: ONE_LOOK_NARROW_MIN, lines: [this.midTrunc(name, ONE_LOOK_NARROW_MIN, room)] };
    const ws = words(name);
    const letters = graphemes(name);
    for (const s of sizes) {
      if (ws.length > 1) {
        // The best word split: both lines fit uncut, the longest first line
        // first.
        for (let i = ws.length - 1; i >= 1; i--) {
          const a = ws.slice(0, i).join(" ");
          const b2 = ws.slice(i).join(" ");
          if (this.nameWidth(a, s) <= room && this.nameWidth(b2, s) <= room) return { size: s, lines: [a, b2] };
        }
      } else if (letters.length >= 6) {
        // Hyphenate a single word near its middle.
        const n = letters.length;
        let best: { score: number; lines: string[] } | undefined;
        for (let i = 3; i <= n - 3; i++) {
          const a = letters.slice(0, i).join("") + "-";
          const b2 = letters.slice(i).join("");
          if (this.nameWidth(a, s) <= room && this.nameWidth(b2, s) <= room) {
            const score = Math.abs(i - n / 2);
            if (score < (best?.score ?? Number.POSITIVE_INFINITY)) best = { score, lines: [a, b2] };
          }
        }
        if (best !== undefined) return { size: s, lines: best.lines };
      }
    }
    return { size: ONE_LOOK_NARROW_MIN, lines: this.wrap2(name, ONE_LOOK_NARROW_MIN, room) };
  }

  /** The bridge look's name, always one line: its full size, stepping down
   * a quarter point to `floor`, then cut in the middle at the floor. The
   * running size is decremented as the Swift does, each try rounded to a
   * hundredth. */
  fitOneLine(name: string, avail: number, base: number | undefined, floor: number): NameFit {
    const b = base ?? this.metrics.nameSize;
    const room = avail * ONE_LOOK_AVAIL_SHARE;
    let size = b;
    while (size >= floor - 0.001) {
      const rounded = round100(size);
      if (this.nameWidth(name, rounded) <= room) return { size: rounded, lines: [name] };
      size -= ONE_LOOK_NARROW_STEP;
    }
    const low = Math.min(b, floor);
    return { size: low, lines: [this.midTrunc(name, low, room)] };
  }

  /** Whether the name would need two lines: it overflows at the size one
   * line may shrink to (a row that has already shrunk does not shrink
   * again), and it has a space to break at. */
  wouldWrap(name: string, avail: number, base?: number): boolean {
    const m = this.metrics;
    const b = base ?? m.nameSize;
    const room = avail * ONE_LOOK_AVAIL_SHARE;
    const capped = b < m.nameSize - 0.01;
    const size = capped ? b : Math.max(b * ONE_LOOK_ONE_LINE_SHARE, m.nameMin);
    return this.nameWidth(name, size) > room && name.includes(" ");
  }

  // States

  /**
   * The state ladder. A number keeps its size; its tail goes when it does
   * not fit (and on the watch under 8 columns, unless kept). A word: full;
   * the short form at full size; shrunk to 85% (never under `textMin`);
   * else undefined, and the line is dropped. `numberFloor` lets a number too
   * wide for the room shrink, its unit with it, down to that share of its
   * size (else undefined); without it a number is never dropped. A number's
   * line height stays the full size's.
   */
  fitState(state: StateLine, avail: number, colSpan: number, numberFloor?: number): StateFit | undefined {
    const m = this.metrics;
    const room = avail * ONE_LOOK_AVAIL_SHARE;
    const unitSize = oneLookUnitTextSize(m);
    const numberLine = m.figureSize * (this.device === "watch" ? 1.0 : 1.1);
    switch (state.kind) {
      case "none":
        return undefined;

      case "number": {
        const unitText = state.unit === undefined ? undefined : (state.unitSpaced === true ? " " : "") + state.unit;
        let tail = state.tail;
        if (tail !== undefined && this.device === "watch" && colSpan < ONE_LOOK_WATCH_TAIL_COLUMNS && state.keepTail !== true) {
          tail = undefined;
        }
        if (tail !== undefined) {
          const w = this.width(state.figure, m.figureSize, "bold", true)
            + this.width(unitText ?? "", unitSize, "semibold", true)
            + this.width(" " + tail, m.wordSize, "regular");
          if (w > room) tail = undefined;
        }
        if (numberFloor !== undefined && tail === undefined) {
          const w = this.width(state.figure, m.figureSize, "bold", true)
            + this.width(unitText ?? "", unitSize, "semibold", true);
          if (w > room) {
            const share = floor20(room / w);
            if (share < numberFloor) return undefined;
            return {
              parts: numberParts(state.figure, unitText, undefined),
              size: m.figureSize * share,
              unitSize: unitSize * share,
              tailSize: m.wordSize,
              lineHeight: numberLine,
            };
          }
        }
        return {
          parts: numberParts(state.figure, unitText, tail),
          size: m.figureSize,
          unitSize,
          tailSize: m.wordSize,
          lineHeight: numberLine,
        };
      }

      case "word": {
        const amber = state.amber === true;
        const w = (s: string, size: number) => this.width(s, size, "regular") + (amber ? size * ONE_LOOK_AMBER_DOT_EM : 0);
        const fullSize = m.wordSize;
        const low = Math.max(fullSize * ONE_LOOK_STATE_SHARE, m.textMin);
        let word = state.word;
        let size = fullSize;
        if (w(word, fullSize) > room) {
          if (state.short !== undefined && w(state.short, fullSize) <= room) {
            word = state.short;
          } else {
            word = state.short ?? state.word;
            size = floor20(fullSize * room / w(word, fullSize));
            if (size < low) return undefined;
          }
        }
        return { parts: { kind: "word", word, amber }, size, unitSize, tailSize: fullSize, lineHeight: fullSize * 1.2 };
      }
    }
  }
}

/** The number's parts, leaving out what it does not have, so two fits
 * compare equal by their keys. */
function numberParts(figure: string, unit: string | undefined, tail: string | undefined): StateFitParts {
  const parts: { kind: "number"; figure: string; unit?: string; tail?: string } = { kind: "number", figure };
  if (unit !== undefined) parts.unit = unit;
  if (tail !== undefined) parts.tail = tail;
  return parts;
}

/** The drawn width of a fitted state line (`OneLookLayout.stateWidth`). */
export function oneLookStateWidth(state: StateFit, m: OneLookMetrics, measurer: TextMeasurer): number {
  const width = (s: string, size: number, weight: OneLookTextWeight, rounded: boolean) =>
    measurer.width(s, size, weight, rounded, m.nameTracking);
  const p = state.parts;
  if (p.kind === "number") {
    return width(p.figure, state.size, "bold", true)
      + width(p.unit ?? "", state.unitSize, "semibold", true)
      + (p.tail === undefined ? 0 : width(" " + p.tail, state.tailSize, "regular", false));
  }
  return width(p.word, state.size, "regular", false) + (p.amber ? state.size * ONE_LOOK_AMBER_DOT_EM : 0);
}
