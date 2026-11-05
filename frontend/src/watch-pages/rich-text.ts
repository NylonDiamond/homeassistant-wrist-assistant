// A template tile's rich text, read as the watch reads it: a port of the
// app's `Shared/TemplateRichText.swift`, which the watch's Template tile and
// the iPhone's editor share.
//
// `[icon:snowflake]` is an SF Symbol in the text's color; `[icon:snowflake
// color:blue]` colors the symbol alone. The color is one of sixteen names or
// a 3, 6 or 8 digit hex code, with or without `#`. A color the watch cannot
// read leaves the symbol in the text's color, so a typo never hides it.
//
// Coloured text (2026-11-05, the app's `docs/one_size_table_2026-11.md`,
// "The colour marker"): `[color:SPEC]` starts a run of text in that colour,
// `[/color]` ends it, another `[color:...]` replaces it, and a line break ends
// it. SPEC is read as an icon's colour; an unknown or empty one ends the run.
// The word `color` is lower case, as `icon` is. The markers draw nothing and
// take no width: `templateRichTextSegments` reads the text with them gone. An
// icon with no colour of its own takes its run's colour; a run started after
// an icon does not colour that icon.
//
// No DOM here: the preview draws the segments (`preview.ts`), and the cases
// of `TemplateRichTextTests.swift` pin the reading.

/** One run of a template's text: plain words, or one symbol with the color
 * its marker named (undefined for none, or an empty `color:`). */
export type TemplateRichTextSegment =
  | { kind: "text"; text: string }
  | { kind: "icon"; symbol: string; color: string | undefined };

/** A color as the preview draws it: `#RRGGBB` and an opacity, 0 to 1. */
export interface TemplateIconColor {
  hex: string;
  alpha: number;
}

/** The marker, as Swift's `/\[icon:([^\]]+)\]/`. Global, so `exec` walks the
 * text; reset before each walk. */
const MARKER = /\[icon:([^\]]+)\]/g;

/** Swift's `Character.isWhitespace`, near enough for a marker's words: the
 * Unicode white space JavaScript's `\s` knows. */
const WORDS = /\s+/u;

/** A colour marker, as Swift's `/\[color:[^\]]*\]|\[\/color\]/`. */
const COLOR_MARKER = /\[color:[^\]]*\]|\[\/color\]/g;

/** Any marker, as Swift's `styledSegments` reads them: an icon, a colour, an
 * end. */
const ANY_MARKER = /\[icon:([^\]]+)\]|\[color:([^\]]*)\]|\[\/color\]/g;

/** A piece of the text with its colour markers read (`StyledSegment`):
 * words in a run's colour (undefined: the ink), or an icon with its own
 * colour and the colour of the run it sits in. */
export type TemplateStyledSegment =
  | { kind: "text"; text: string; color: string | undefined }
  | { kind: "icon"; symbol: string; color: string | undefined; run: string | undefined };

/** An icon's colour as drawn: its own, else its run's. */
export function templateIconDrawnColor(own: string | undefined, run: string | undefined): string | undefined {
  return own ?? run;
}

/** An icon marker's symbol and own colour, or undefined for a marker with no
 * word (`[icon: ]`), which stays as text. */
function iconOf(body: string): { symbol: string; color: string | undefined } | undefined {
  const words = body.split(WORDS).filter((w) => w !== "");
  const symbol = words[0];
  if (symbol === undefined) return undefined;
  const option = words.slice(1).find((w) => w.toLowerCase().startsWith("color:"));
  const color = option === undefined ? undefined : option.slice("color:".length);
  return { symbol, color: color === undefined || color === "" ? undefined : color };
}

/**
 * The text's pieces with their colours (`TemplateRichText.styledSegments`):
 * each line read from the ink, the line breaks kept as text in the ink. Next
 * to each other, words of one colour are one piece.
 */
export function templateStyledSegments(text: string): TemplateStyledSegment[] {
  const out: TemplateStyledSegment[] = [];
  const add = (string: string, color: string | undefined) => {
    if (string === "") return;
    const last = out[out.length - 1];
    if (last?.kind === "text" && last.color === color) last.text += string;
    else out.push({ kind: "text", text: string, color });
  };
  text.split("\n").forEach((line, index) => {
    if (index > 0) add("\n", undefined);
    let color: string | undefined;
    let at = 0;
    ANY_MARKER.lastIndex = 0;
    for (let match = ANY_MARKER.exec(line); match !== null; match = ANY_MARKER.exec(line)) {
      add(line.slice(at, match.index), color);
      if (match[1] !== undefined) {
        const icon = iconOf(match[1]);
        if (icon === undefined) add(match[0], color);
        else out.push({ kind: "icon", symbol: icon.symbol, color: icon.color, run: color });
      } else if (match[2] !== undefined) {
        // A colour the tile can draw starts a run; any other ends it.
        const trimmed = match[2].trim();
        color = templateIconColor(trimmed) === undefined ? undefined : trimmed;
      } else {
        color = undefined;
      }
      at = match.index + match[0].length;
    }
    add(line.slice(at), color);
  });
  return out;
}

/**
 * The text cut into runs, in order, with the colour markers gone. Inside a marker the words split on
 * white space: the first is the symbol (symbol names never hold a space),
 * the first later word that starts `color:` in any case gives the color, as
 * written after the colon. A marker with no word (`[icon: ]`) stays as text.
 * Text between markers is kept as it is, newlines too; empty runs are left
 * out.
 */
export function templateRichTextSegments(given: string): TemplateRichTextSegment[] {
  const text = given.replace(COLOR_MARKER, "");
  const out: TemplateRichTextSegment[] = [];
  let at = 0;
  MARKER.lastIndex = 0;
  for (let match = MARKER.exec(text); match !== null; match = MARKER.exec(text)) {
    if (match.index > at) out.push({ kind: "text", text: text.slice(at, match.index) });
    const words = match[1]!.split(WORDS).filter((w) => w !== "");
    const symbol = words[0];
    if (symbol === undefined) {
      out.push({ kind: "text", text: match[0] });
    } else {
      const option = words.slice(1).find((w) => w.toLowerCase().startsWith("color:"));
      const color = option === undefined ? undefined : option.slice("color:".length);
      out.push({ kind: "icon", symbol, color: color === undefined || color === "" ? undefined : color });
    }
    at = match.index + match[0].length;
  }
  if (at < text.length) out.push({ kind: "text", text: text.slice(at) });
  return out;
}

/**
 * The sixteen names the watch knows, as SwiftUI's system colors. Where the
 * panel already draws a name (`NAMED_COLORS` in `model.ts`) it is the same
 * hex; the rest are SwiftUI's documented light values of `Color.mint`,
 * `.teal`, `.cyan`, `.indigo`, `.pink`, `.brown` and `.gray`. The watch
 * draws its dark variants, a shade brighter; the preview keeps one table.
 */
const SYSTEM_COLORS: Readonly<Record<string, string>> = {
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  mint: "#00C7BE",
  teal: "#30B0C7",
  cyan: "#32ADE6",
  blue: "#007AFF",
  indigo: "#5856D6",
  purple: "#AF52DE",
  pink: "#FF2D55",
  brown: "#A2845E",
  gray: "#8E8E93",
  grey: "#8E8E93",
  white: "#FFFFFF",
  black: "#000000",
};

/** Swift's `UInt64(text, radix: 16)`: an optional `+`, then hex digits. */
const HEX_DIGITS = /^\+?[0-9a-f]+$/;

function byte(n: number): string {
  return Math.round(n).toString(16).toUpperCase().padStart(2, "0");
}

/**
 * A marker's color: one of the sixteen names in any case, else 3, 6 or 8
 * hex digits with or without a leading `#` (8 is RRGGBBAA, 3 is one digit a
 * channel). Undefined for anything else, which draws in the text's color.
 * The count includes a `+`, as Swift counts it.
 */
export function templateIconColor(spec: string): TemplateIconColor | undefined {
  const key = spec.toLowerCase();
  if (Object.hasOwn(SYSTEM_COLORS, key)) return { hex: SYSTEM_COLORS[key]!, alpha: 1 };
  const hex = key.startsWith("#") ? key.slice(1) : key;
  if (![3, 6, 8].includes(hex.length) || !HEX_DIGITS.test(hex)) return undefined;
  const value = parseInt(hex, 16);
  if (!Number.isFinite(value)) return undefined;
  if (hex.length === 3) {
    const nibble = (shift: number) => ((value >> shift) & 0xf) * 17;
    return { hex: `#${byte(nibble(8))}${byte(nibble(4))}${byte(nibble(0))}`, alpha: 1 };
  }
  if (hex.length === 6) {
    return { hex: `#${byte((value >> 16) & 0xff)}${byte((value >> 8) & 0xff)}${byte(value & 0xff)}`, alpha: 1 };
  }
  // Eight digits pass 2^31, where JavaScript's shifts turn signed: divide.
  const at = (n: number) => Math.floor(value / 2 ** n) % 256;
  return { hex: `#${byte(at(24))}${byte(at(16))}${byte(at(8))}`, alpha: Math.round((at(0) / 255) * 1000) / 1000 };
}
