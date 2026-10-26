// One Look's layout, copied from the app's `OneLookLayout.swift`: one
// resolved layout per tile from its DRAWN size (its grid cell less the cell
// inset a side). Everything here is pure: the tile's size, spans, name and
// state in, rects and fitted text out, in points, in the tile's own
// coordinates (0,0 its drawn top left). A preview scales by its pixel size
// only when it draws.
//
// Four modes. Stacked (disc top left, name and state bottom left) and strip
// (disc on the left, text beside it, under 4 rows) are the mock's. Compact (a
// centred glyph and no text) is the last step of the tiny tile ladder.
// Centred is the bridge look the devices draw today: the glyph big in the
// middle where the old look drew its icon, the state top left, the
// accessory top right, the name centred at the bottom on one line. Chart and
// picture tiles never take it; they keep the mock's disc layouts.
//
// Rects follow CoreGraphics: min and max are taken from the standardized
// rect, `insetBy` gives null (undefined) when it would turn inside out, and
// two rects that only touch do not intersect. `fits` depends on all three.

import {
  ONE_LOOK_ACCESSORY_GLYPH_FAN,
  ONE_LOOK_ACCESSORY_GLYPH_PLAY,
  ONE_LOOK_CHOICES,
  oneLookDiscMin,
  oneLookMetrics,
  oneLookScaledText,
  type OneLookDevice,
  type OneLookMetrics,
} from "./metrics.js";
import {
  NO_STATE,
  ONE_LOOK_AVAIL_SHARE,
  ONE_LOOK_DEFAULT_GLYPH_ASPECT,
  ONE_LOOK_DEFAULT_GLYPH_EXTENT,
  ONE_LOOK_NARROW_MIN,
  OneLookTextFitter,
  oneLookStateWidth,
  type NameFit,
  type OneLookTextDesign,
  type OneLookTextWeight,
  type StateFit,
  type StateLine,
  type TextMeasurer,
} from "./text.js";
import { type OneLookGlyphGlow, ONE_LOOK_NATIVE_GLOW } from "./colour.js";

export interface OneLookSize { readonly width: number; readonly height: number }
export interface OneLookPoint { readonly x: number; readonly y: number }
export interface OneLookRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number }

/** The small round control top right (a strip's right end), or the LIVE
 * chip. */
export type OneLookAccessory = "none" | "playPause" | "fan" | "live";

/** The glyph's share of the accessory disc (none for the LIVE chip). */
export function oneLookAccessoryGlyphShare(accessory: OneLookAccessory): number {
  switch (accessory) {
    case "none":
    case "live": return 0;
    case "playPause": return ONE_LOOK_ACCESSORY_GLYPH_PLAY;
    case "fan": return ONE_LOOK_ACCESSORY_GLYPH_FAN;
  }
}

/** Play/pause and fan do their own thing when tapped, so they get a touch
 * area of their own. LIVE, the arrow and the mic are cues. */
export function oneLookAccessoryHasOwnAction(accessory: OneLookAccessory): boolean {
  return accessory === "playPause" || accessory === "fan";
}

/** The big number on the right of a wide tile ("62°" over "H 68° L 51°"). */
export interface OneLookBigValue {
  readonly figure: string;
  readonly sub?: string;
}

/**
 * A tile's own text and icon settings from the editor, as One Look reads them
 * (`OneLookTileStyle`). Unset values keep the look's own. `nameSize`,
 * `iconSize` and `iconOffset` are the old look's sizes for the tile, which
 * every drawn tile sets (`takeOldSizes`); the shadows and the name's colour
 * are drawing only.
 */
export interface OneLookTileStyle {
  readonly nameSize?: number;
  readonly iconSize?: number;
  /** Points, negative is up. */
  readonly iconOffset: number;
  /** State Size over the look's own, held to 0.75 to 1.5. */
  readonly stateScale: number;
  /** Status Icon Size over the round button's own, held to 0.75 to 1.4. */
  readonly accessoryScale: number;
  /** Font Weight; undefined (unset, or Light) keeps the look's. */
  readonly nameWeight?: OneLookTextWeight;
  readonly nameDesign: OneLookTextDesign;
  readonly nameColour?: string;
  readonly nameShadow: boolean;
  readonly stateShadow: boolean;
  readonly glyphShadow: boolean;
  /** The Pill value style: the state in a capsule. */
  readonly statePill: boolean;
  /** The soft glow behind a bare glyph (`iconGlow`, tile layers round
   * three); One Look's own when unset. */
  readonly glow: OneLookGlyphGlow;
}

/** A new tile's style: every value the look's own. */
export const ONE_LOOK_DEFAULT_STYLE: OneLookTileStyle = Object.freeze({
  iconOffset: 0,
  stateScale: 1,
  accessoryScale: 1,
  nameDesign: "standard",
  nameShadow: true,
  stateShadow: true,
  glyphShadow: false,
  statePill: false,
  glow: ONE_LOOK_NATIVE_GLOW,
});

export const ONE_LOOK_STATE_SCALE_RANGE: readonly [number, number] = [0.75, 1.5];
export const ONE_LOOK_ACCESSORY_SCALE_RANGE: readonly [number, number] = [0.75, 1.4];

/** A set size over the old look's own for the tile, held in `range` and
 * rounded to a hundredth; 1 when unset (`OneLookTileStyle.factor`). */
export function oneLookStyleFactor(set: number | undefined, auto: number, range: readonly [number, number]): number {
  if (set === undefined || !(set > 0) || !(auto > 0)) return 1;
  const factor = Math.min(range[1], Math.max(range[0], set / auto));
  return Math.round(factor * 100) / 100;
}

/** Everything the layout needs to know about one tile
 * (`OneLookLayoutInput`). */
export interface OneLookLayoutInput {
  readonly device: OneLookDevice;
  /** The tile's drawn size. */
  readonly size: OneLookSize;
  readonly colSpan: number;
  readonly rowSpan: number;
  /** The name; empty draws no name line. */
  readonly name: string;
  readonly state: StateLine;
  /** False: no disc or glyph, and the text takes its place. */
  readonly hasIcon: boolean;
  readonly accessory: OneLookAccessory;
  /** A sensor chart: the text stays in the left 46%. */
  readonly isChart: boolean;
  readonly bigValue?: OneLookBigValue;
  /** The row's name size, undefined before it is known. */
  readonly nameCap?: number;
  /** Dynamic Type's factor; always 1 in the panel. */
  readonly textScale: number;
  /** A tile under this many rows is a strip; always 4 in the panel. */
  readonly stripRows: number;
  /** The bridge look. The caller leaves it off for chart and picture tiles. */
  readonly centred: boolean;
  /** The centred layout keeps a brightness bar's room across the top. */
  readonly topBar: boolean;
  /** The glyph's image's width over its height, and its longer side over
   * its font size (the measurer's `glyphAspect` and `glyphExtent`). */
  readonly glyphAspect: number;
  readonly glyphExtent: number;
  /** The glyph is a person's round photo, filling its whole box. */
  readonly glyphIsPhoto: boolean;
  readonly style: OneLookTileStyle;
}

/** What a caller must say; everything else takes the app's defaults. */
export type OneLookLayoutInputInit =
  Pick<OneLookLayoutInput, "device" | "size" | "colSpan" | "rowSpan" | "name">
  & Partial<Omit<OneLookLayoutInput, "device" | "size" | "colSpan" | "rowSpan" | "name">>;

export function oneLookLayoutInput(init: OneLookLayoutInputInit): OneLookLayoutInput {
  return {
    state: NO_STATE,
    hasIcon: true,
    accessory: "none",
    isChart: false,
    textScale: 1,
    stripRows: ONE_LOOK_STRIP_ROWS,
    centred: false,
    topBar: false,
    glyphAspect: ONE_LOOK_DEFAULT_GLYPH_ASPECT,
    glyphExtent: ONE_LOOK_DEFAULT_GLYPH_EXTENT,
    glyphIsPhoto: false,
    style: ONE_LOOK_DEFAULT_STYLE,
    ...init,
  };
}

/** The tile's name size as a factor on the device's own: the old look's
 * size over One Look's, 1 when the style has none. */
export function oneLookNameScale(input: Pick<OneLookLayoutInput, "device" | "style">): number {
  const size = input.style.nameSize;
  if (size === undefined || !(size > 0)) return 1;
  return size / oneLookMetrics(input.device).nameSize;
}

export type OneLookMode = "stacked" | "strip" | "compact" | "centred";

/** One tile's resolved layout (`OneLookLayout`). */
export interface OneLookLayout {
  readonly mode: OneLookMode;
  readonly size: OneLookSize;
  /** The padding at the sides, and at the top and bottom. */
  readonly insetH: number;
  readonly insetV: number;
  /** The disc's box, or in the centred layout the glyph's. With
   * `drawsDisc` false the glyph draws bare in it. */
  readonly discRect: OneLookRect;
  readonly drawsDisc: boolean;
  /** The glyph box's side, as the app's `Glyph` view takes it: the symbol is
   * fitted into a centred square of 86% of it. */
  readonly glyphSize: number;
  /** The accessory drawn ("none" when dropped), its slot and its touch
   * area (play/pause and fan only). */
  readonly accessory: OneLookAccessory;
  readonly accessoryRect?: OneLookRect;
  readonly accessoryHitRect?: OneLookRect;
  /** The text block: its top left corner, its room across (names are fitted
   * to it) and its height. */
  readonly textOrigin: OneLookPoint;
  readonly textWidth: number;
  readonly textHeight: number;
  readonly name: NameFit;
  readonly nameLineHeight: number;
  readonly state?: StateFit;
  readonly stateLineHeight: number;
  readonly bigValue?: OneLookBigValue;
  readonly bigRect?: OneLookRect;
  /** A chart tile's text column (46% of the width). */
  readonly chartTextWidth?: number;
  /** For a strip's sheen: just past the disc. 0 otherwise. */
  readonly discEdge: number;
  /** The text factors the layout was fitted at. */
  readonly textScale: number;
  readonly nameScale: number;
  readonly stateScale: number;
  /** The centred layout's state box, top left, as wide as the fitted state
   * (and its pill padding). */
  readonly stateRect?: OneLookRect;
  /** The centred layout's brightness bar track. */
  readonly barRect?: OneLookRect;
  /** Where the centred glyph's ink lands. */
  readonly glyphInk?: OneLookRect;
  /** The centred glyph sits where the old look drew its icon, at its size. */
  readonly glyphAtOldPlace: boolean;
  /** The glyph's ink height over its font size the layout was made with:
   * the input's in the centred layout, `ONE_LOOK_DEFAULT_GLYPH_EXTENT` in
   * every other (Swift's `OneLookLayout.glyphExtent`). */
  readonly glyphExtent: number;
}

/** The text block as a rect. */
export function oneLookTextRect(layout: OneLookLayout): OneLookRect {
  return { x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight };
}

/** The size the name was fitted at over the tile's own name factor, for the
 * row caps; undefined when the tile draws no name. */
export function oneLookRowNameSize(layout: OneLookLayout): number | undefined {
  return layout.name.lines.length === 0 ? undefined : layout.name.size / layout.nameScale;
}

/** The device's metrics at the layout's text sizes, for drawing the state
 * and the big value at the sizes the layout made room for. */
export function oneLookLayoutMetrics(layout: OneLookLayout, device: OneLookDevice): OneLookMetrics {
  return oneLookScaledText(oneLookMetrics(device), layout.textScale, layout.nameScale, layout.stateScale);
}

// Constants (the mock's, unless marked)

/** A tile under this many rows is a strip. */
export const ONE_LOOK_STRIP_ROWS = 4;
/** A watch tile this many columns or fewer is narrow. */
export const ONE_LOOK_NARROW_COLUMNS = 4;
/** The disc never takes more than this share of the width. */
export const ONE_LOOK_DISC_WIDTH_SHARE = 0.55;
/** A chart tile's text column, as a share of the width. */
export const ONE_LOOK_CHART_TEXT_SHARE = 0.46;
/** Name line heights in ems: two lines, one stacked or centred line, one
 * strip line. */
export const ONE_LOOK_TWO_LINE_HEIGHT = 1.08;
export const ONE_LOOK_ONE_LINE_HEIGHT = 1.18;
export const ONE_LOOK_STRIP_ONE_LINE_HEIGHT = 1.16;
/** A strip's state line height, as a share of the state's own. */
export const ONE_LOOK_STRIP_STATE_SHARE = 0.96;
/** Two lines on an unshrunk row may also try this share of its size. */
export const ONE_LOOK_TWO_LINE_SHARE = 0.92;
/** The gap kept between the text and the accessory, and the disc and it. */
export const ONE_LOOK_ACCESSORY_GAP = 6;
/** A big value's number line and the line under it, in ems. */
export const ONE_LOOK_BIG_LINE_HEIGHT = 1.02;
export const ONE_LOOK_BIG_SUB_LINE_HEIGHT = 1.2;
/** A big value needs this many columns (6 on an iPhone tile of 4 rows or
 * more). */
export const ONE_LOOK_BIG_COLUMNS = 8;
export const ONE_LOOK_PHONE_BIG_COLUMNS = 6;
/** The LIVE chip's text line height, in ems. */
export const ONE_LOOK_LIVE_LINE_HEIGHT = 1.2;
/** A layout may overrun its tile by this much. */
export const ONE_LOOK_OVERFLOW_SLACK = 0.5;
/** Text needs at least this many name floors of room across. */
export const ONE_LOOK_TEXT_ROOM_NAMES = 3;
/** A disc smaller than this is not drawn; the glyph draws alone. */
export const ONE_LOOK_SMALLEST_DISC = 14;
/** The glyph box's share the symbol is fitted into (`glyphInkShare`). */
export const ONE_LOOK_GLYPH_INK_SHARE = 0.86;
/** With the bridge look, a strip's, compact or fallback glyph draws with no
 * disc at this share of the box it stands in for. */
export const ONE_LOOK_BARE_GLYPH_SHARE = 0.85;
/** The centred glyph's box never takes more than this share of the width
 * (only where a tile has no old look icon size). */
export const ONE_LOOK_CENTRED_GLYPH_WIDTH_SHARE = 0.5;
/** The gap between the state and a glyph that rises beside it. */
export const ONE_LOOK_GLYPH_STATE_GAP = 2;
/** The Pill value style's padding, in ems of the word size, rounded to
 * whole points. */
export const ONE_LOOK_PILL_PAD_H = 0.3;
export const ONE_LOOK_PILL_PAD_V = 0.12;
/** The share of a symbol's image at each side that is margin, not ink. */
export const ONE_LOOK_OLD_PLACE_INK_TRIM = 0.08;
/** The gap the old place's glyph keeps from the text and the bar. */
export const ONE_LOOK_OLD_PLACE_GAP = 1;
/** How small a number state may shrink to leave the glyph its size. */
export const ONE_LOOK_STATE_GIVE_WAY = 0.7;
/** A person's photo's diameter over the icon size. */
export const ONE_LOOK_OLD_PLACE_PHOTO_SHARE = 1.35;
/** The words a person's state shows most: a photo keeps clear of the
 * room the widest takes, whichever one the tile shows now. */
export const ONE_LOOK_PHOTO_STATE_WORDS: readonly string[] = ["Home", "Away"];

/** The disc may go under its floor to this, the last step before compact. */
export function oneLookTinyDiscFloor(device: OneLookDevice): number {
  return device === "phone" ? 20 : 14;
}
export function oneLookCentredGlyphMax(device: OneLookDevice): number {
  return device === "phone" ? 56 : 40;
}
export function oneLookCentredGlyphMin(device: OneLookDevice): number {
  return device === "phone" ? 24 : 16;
}
export function oneLookCentredGlyphTinyFloor(device: OneLookDevice): number {
  return device === "phone" ? 18 : 12;
}
/** The centred name's floor and its side inset. */
export function oneLookCentredNameMin(device: OneLookDevice): number {
  return device === "phone" ? 11 : 9;
}
export function oneLookCentredNameInset(device: OneLookDevice): number {
  return device === "phone" ? 8 : 3;
}
/** The brightness bar: its height, its distance from the tile's top and
 * sides, and the gap under it. */
export function oneLookBarHeight(device: OneLookDevice): number {
  return device === "phone" ? 4 : 3;
}
export function oneLookBarTop(device: OneLookDevice): number {
  return device === "phone" ? 8 : 4;
}
export function oneLookBarSide(device: OneLookDevice): number {
  return device === "phone" ? 12 : 6;
}
export function oneLookBarGap(device: OneLookDevice): number {
  return device === "phone" ? 5 : 2.5;
}

/** The accessory's slot. `scale` is the tile's Status Icon Size factor on
 * the round button; the LIVE chip keeps its size. */
export function oneLookAccessorySize(accessory: OneLookAccessory, m: OneLookMetrics, scale = 1): OneLookSize {
  switch (accessory) {
    case "none": return { width: 0, height: 0 };
    case "live": return { width: m.liveSize * m.liveWidthEm, height: m.liveSize * ONE_LOOK_LIVE_LINE_HEIGHT + 2 * m.livePaddingV };
    default: return { width: m.accessoryDisc * scale, height: m.accessoryDisc * scale };
  }
}

// Rects, as CoreGraphics reads them

function minX(r: OneLookRect): number { return Math.min(r.x, r.x + r.width); }
function maxX(r: OneLookRect): number { return Math.max(r.x, r.x + r.width); }
function minY(r: OneLookRect): number { return Math.min(r.y, r.y + r.height); }
function maxY(r: OneLookRect): number { return Math.max(r.y, r.y + r.height); }
function midX(r: OneLookRect): number { return r.x + r.width / 2; }
function midY(r: OneLookRect): number { return r.y + r.height / 2; }

/** `CGRect.insetBy`: undefined (the null rect) when it turns inside out. */
function insetBy(r: OneLookRect, dx: number, dy: number): OneLookRect | undefined {
  const x = minX(r) + dx, y = minY(r) + dy;
  const width = Math.abs(r.width) - 2 * dx, height = Math.abs(r.height) - 2 * dy;
  return width < 0 || height < 0 ? undefined : { x, y, width, height };
}

/** `CGRect.intersects`: rects that only touch do not; an empty rect
 * strictly inside another does. */
export function oneLookRectsIntersect(a: OneLookRect | undefined, b: OneLookRect | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  return minX(a) < maxX(b) && minX(b) < maxX(a) && minY(a) < maxY(b) && minY(b) < maxY(a);
}

/** `CGRect.intersection`: undefined when apart; touching gives an empty rect. */
function intersection(a: OneLookRect, b: OneLookRect): OneLookRect | undefined {
  const x1 = Math.max(minX(a), minX(b)), x2 = Math.min(maxX(a), maxX(b));
  const y1 = Math.max(minY(a), minY(b)), y2 = Math.min(maxY(a), maxY(b));
  if (x2 < x1 || y2 < y1) return undefined;
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function clamp(v: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, v));
}

// Resolving

interface Step {
  readonly mode: OneLookMode;
  readonly withState: boolean;
  readonly hasIcon: boolean;
  /** The disc's (or centred glyph's) floor when it may go under its own. */
  readonly discFloor?: number;
}

function step(mode: OneLookMode, rest: Partial<Omit<Step, "mode">> = {}): Step {
  return { mode, withState: true, hasIcon: true, ...rest };
}

/**
 * Resolves a tile's layout: the look's own layout first, then the tiny tile
 * ladder until one fits; compact always does. Every text size is the
 * tile's scaled one (`oneLookScaledText`).
 */
export function resolveOneLookLayout(given: OneLookLayoutInput | OneLookLayoutInputInit, measurer: TextMeasurer): OneLookLayout {
  const input = oneLookLayoutInput(given);
  const metrics = oneLookScaledText(oneLookMetrics(input.device), input.textScale, oneLookNameScale(input), input.style.stateScale);
  const fitter = new OneLookTextFitter(input.device, measurer, metrics).styled(input.style);
  for (const s of ladder(input)) {
    if (s.mode === "compact") return keepScales(compact(input, fitter), input);
    const layout = s.mode === "stacked" ? stacked(input, fitter, s)
      : s.mode === "strip" ? strip(input, fitter, s)
      : centred(input, fitter, s);
    if (fits(layout, fitter)) return keepScales(layout, input);
  }
  return keepScales(compact(input, fitter), input);
}

type Unscaled = Omit<OneLookLayout, "textScale" | "nameScale" | "stateScale" | "glyphExtent">;

function keepScales(layout: Unscaled, input: OneLookLayoutInput): OneLookLayout {
  return {
    ...layout,
    textScale: input.textScale,
    nameScale: oneLookNameScale(input),
    stateScale: input.style.stateScale,
    glyphExtent: layout.mode === "centred" ? input.glyphExtent : ONE_LOOK_DEFAULT_GLYPH_EXTENT,
  };
}

/**
 * The order the layouts are tried in. The bridge look's centred layout
 * first, then again with its glyph at the tiny floor; then the mock's
 * layout (with the bridge look, a bare glyph); a strip that does not fit is
 * stacked if that fits; then the state is dropped; then the disc may go
 * under its floor; then compact.
 */
function ladder(input: OneLookLayoutInput): Step[] {
  const natural: OneLookMode = input.rowSpan < input.stripRows ? "strip" : "stacked";
  const hasState = input.state.kind !== "none";
  const steps: Step[] = [];
  if (input.centred && natural === "stacked") {
    steps.push(step("centred", { hasIcon: input.hasIcon }));
    if (input.hasIcon) steps.push(step("centred", { discFloor: oneLookCentredGlyphTinyFloor(input.device) }));
  }
  steps.push(step(natural, { hasIcon: input.hasIcon }));
  if (natural === "strip") steps.push(step("stacked", { hasIcon: input.hasIcon }));
  // With Dynamic Type's larger text (never in the panel), a stacked tile
  // keeps its state by letting the disc go under its floor, then by turning
  // into a strip, before the state goes.
  if (hasState && natural === "stacked" && input.textScale > 1) {
    if (input.hasIcon) steps.push(step("stacked", { discFloor: oneLookTinyDiscFloor(input.device) }));
    steps.push(step("strip", { hasIcon: input.hasIcon }));
  }
  if (hasState) {
    steps.push(step(natural, { withState: false, hasIcon: input.hasIcon }));
    if (natural === "strip") steps.push(step("stacked", { withState: false, hasIcon: input.hasIcon }));
  }
  if (input.hasIcon) {
    if (ONE_LOOK_CHOICES.tinyTiles === "shrinkToDisc") {
      steps.push(step("stacked", { withState: false, discFloor: oneLookTinyDiscFloor(input.device) }));
    } else {
      steps.push(step("stacked", { withState: false, hasIcon: false }));
      steps.push(step("strip", { withState: false, hasIcon: false }));
    }
  }
  steps.push(step("compact"));
  return steps;
}

/** The row's name size: the device's, or the row's cap when smaller. A tile
 * with the old look's name size keeps it, as the old look did: no row cap.
 * Every tile the devices draw has one, so a drawn tile never takes a cap. */
function rowBase(input: OneLookLayoutInput, m: OneLookMetrics): number {
  if (input.style.nameSize !== undefined) return m.nameSize;
  return Math.min(m.nameSize, (input.nameCap ?? Number.POSITIVE_INFINITY) * oneLookNameScale(input));
}

/** The sizes two name lines may use: the row's, and on a row that has not
 * shrunk, 92% of it (never under the floor). */
function twoSizes(base: number, m: OneLookMetrics): number[] {
  return base < m.nameSize - 0.01 ? [base] : [base, Math.max(base * ONE_LOOK_TWO_LINE_SHARE, m.nameMin)];
}

function emptyName(base: number): NameFit {
  return { size: base, lines: [] };
}

/** A line still wider than the room is cut in the middle, so every line
 * fits the text block as fitted. `avail` is used as given. */
function clipped(fit: NameFit, avail: number, fitter: OneLookTextFitter): NameFit {
  let changed = false;
  const lines = fit.lines.map((line) => {
    if (fitter.nameWidth(line, fit.size) <= avail) return line;
    const cut = fitter.midTrunc(line, fit.size, avail);
    if (cut !== line) changed = true;
    return cut;
  });
  return changed ? { size: fit.size, lines } : fit;
}

/** The touch area of an accessory with its own action: a square of the
 * device's hit size centred on it, clipped to the tile, and to half the
 * tile's width from its right edge. */
function hitRect(slot: OneLookRect, accessory: OneLookAccessory, size: OneLookSize, m: OneLookMetrics): OneLookRect | undefined {
  if (!oneLookAccessoryHasOwnAction(accessory)) return undefined;
  const hit = Math.max(m.accessoryHit, slot.width);
  let rect = intersection(
    { x: midX(slot) - hit / 2, y: midY(slot) - hit / 2, width: hit, height: hit },
    { x: 0, y: 0, width: size.width, height: size.height },
  );
  if (rect === undefined || rect.width <= 0 || rect.height <= 0) return undefined;
  const half = size.width / 2;
  if (rect.width > half) rect = { x: maxX(rect) - half, y: rect.y, width: half, height: rect.height };
  return rect;
}

// Stacked (the mock, 4 rows and up; the bridge look's fallback; every chart
// and picture tile)

function stacked(input: OneLookLayoutInput, fitter: OneLookTextFitter, s: Step): Unscaled {
  const m = fitter.metrics;
  const w = input.size.width, h = input.size.height;
  const device = input.device;
  const base = rowBase(input, m);
  const hasIcon = s.hasIcon;
  const inset = clamp(Math.min(w, h) * m.insetK, m.insetMin, m.insetMax);
  const narrow = device === "watch" && input.colSpan <= ONE_LOOK_NARROW_COLUMNS;
  const floor = hasIcon ? (s.discFloor ?? oneLookDiscMin(m, input.colSpan)) : 0;
  const gapTop = hasIcon ? m.gapTop : 0;

  let avail = (input.isChart ? w * ONE_LOOK_CHART_TEXT_SHARE : w) - 2 * inset;

  // A big number on the right of a wide tile: 8 columns or more, or 6 on an
  // iPhone tile of 4 rows or more. On the watch only when the name still
  // fits whole beside it.
  let bigRect: OneLookRect | undefined;
  const bigRoom = input.colSpan >= ONE_LOOK_BIG_COLUMNS
    || (device === "phone" && input.colSpan >= ONE_LOOK_PHONE_BIG_COLUMNS && input.rowSpan >= ONE_LOOK_STRIP_ROWS);
  const big = input.bigValue;
  if (big !== undefined && bigRoom) {
    const figureWidth = fitter.measurer.width(big.figure, m.bigSize, "bold", true, m.nameTracking);
    const subWidth = big.sub === undefined ? 0 : fitter.measurer.width(big.sub, m.bigSubSize, "semibold", true, m.nameTracking);
    const bigWidth = Math.max(figureWidth, subWidth);
    const left = avail - bigWidth - m.bigGap;
    if (device === "phone" || fitter.nameWidth(input.name, base) <= left * ONE_LOOK_AVAIL_SHARE) {
      const bigHeight = m.bigSize * ONE_LOOK_BIG_LINE_HEIGHT
        + (big.sub === undefined ? 0 : m.bigSubGap + m.bigSubSize * ONE_LOOK_BIG_SUB_LINE_HEIGHT);
      bigRect = { x: w - inset - bigWidth, y: (h - bigHeight) / 2, width: bigWidth, height: bigHeight };
      avail = left;
    }
  }

  const state = s.withState ? fitter.fitState(input.state, avail, input.colSpan) : undefined;
  const stateLH = state?.lineHeight ?? 0;

  // Two lines at the row's size if the disc can stay at or above its floor,
  // else at 92% (never under the floor); on the watch the inset tightens to
  // its minimum first.
  let insetV = inset;
  const need = (ins: number, size: number) => 2 * ins + floor + gapTop + 2 * size * ONE_LOOK_TWO_LINE_HEIGHT + stateLH;
  let fit: NameFit;
  if (input.name === "") {
    fit = emptyName(base);
  } else if (narrow) {
    let twoOK = false;
    if (need(inset, ONE_LOOK_NARROW_MIN) <= h) {
      twoOK = true;
    } else if (need(m.insetMin, ONE_LOOK_NARROW_MIN) <= h + ONE_LOOK_OVERFLOW_SLACK) {
      twoOK = true;
      insetV = m.insetMin;
    }
    fit = fitter.fitNarrow(input.name, avail, twoOK, base);
  } else {
    let two: number | undefined;
    if (fitter.wouldWrap(input.name, avail, base)) {
      for (const size of twoSizes(base, m)) {
        if (need(inset, size) <= h) { two = size; break; }
        if (device === "watch" && need(m.insetMin, size) <= h + ONE_LOOK_OVERFLOW_SLACK) {
          two = size;
          insetV = m.insetMin;
          break;
        }
      }
    }
    fit = fitter.fitName(input.name, avail, two, base);
  }
  fit = clipped(fit, avail, fitter);
  const isTwo = fit.lines.length > 1;
  if (isTwo && device === "watch" && need(inset, fit.size) > h) insetV = m.insetMin;
  const nameLH = fit.size * (isTwo ? ONE_LOOK_TWO_LINE_HEIGHT : ONE_LOOK_ONE_LINE_HEIGHT);
  const textH = fit.lines.length * nameLH + stateLH;

  const accessory = input.accessory;
  const accSize = oneLookAccessorySize(accessory, m, input.style.accessoryScale);
  let disc = 0;
  if (hasIcon) {
    const preferred = clamp(Math.min(h * m.discK, w * ONE_LOOK_DISC_WIDTH_SHARE), floor, m.discMax);
    disc = Math.max(floor, Math.min(preferred, h - 2 * insetV - textH - gapTop));
    // On a tile narrow enough for the disc to reach the accessory, the disc
    // gives way (never under its floor).
    if (accessory !== "none") disc = Math.max(floor, Math.min(disc, w - 2 * inset - accSize.width - ONE_LOOK_ACCESSORY_GAP));
  }

  const accRect: OneLookRect | undefined = accessory === "none" ? undefined
    : { x: w - inset - accSize.width, y: insetV, width: accSize.width, height: accSize.height };
  return {
    mode: "stacked",
    size: input.size,
    insetH: inset,
    insetV,
    discRect: { x: inset, y: insetV, width: disc, height: disc },
    // The bridge look's fallback keeps its glyph off a disc.
    drawsDisc: hasIcon && !input.centred,
    glyphSize: disc * (input.centred ? ONE_LOOK_BARE_GLYPH_SHARE : m.glyphK),
    accessory,
    accessoryRect: accRect,
    accessoryHitRect: accRect === undefined ? undefined : hitRect(accRect, accessory, input.size, m),
    textOrigin: { x: inset, y: h - insetV - textH },
    textWidth: avail,
    textHeight: textH,
    name: fit,
    nameLineHeight: nameLH,
    state,
    stateLineHeight: stateLH,
    bigValue: bigRect === undefined ? undefined : input.bigValue,
    bigRect,
    chartTextWidth: input.isChart ? w * ONE_LOOK_CHART_TEXT_SHARE : undefined,
    discEdge: 0,
    glyphAtOldPlace: false,
  };
}

// Centred (the bridge look, 4 rows and up)

/**
 * The state top left beside the accessory, the name centred at the bottom
 * across the whole width, and the glyph where the old look drew its icon
 * (or, with no old icon size, as big as the room between them allows). No
 * big value: the tile's model lays it out again with the state that stands
 * in for it.
 */
function centred(input: OneLookLayoutInput, fitter: OneLookTextFitter, s: Step): Unscaled {
  const m = fitter.metrics;
  const w = input.size.width, h = input.size.height;
  const device = input.device;
  const base = rowBase(input, m);
  const hasIcon = s.hasIcon;
  const inset = clamp(Math.min(w, h) * m.insetK, m.insetMin, m.insetMax);
  const narrow = device === "watch" && input.colSpan <= ONE_LOOK_NARROW_COLUMNS;
  const glyphCap = Math.min(w * ONE_LOOK_CENTRED_GLYPH_WIDTH_SHARE, oneLookCentredGlyphMax(device));
  const floor = hasIcon ? (s.discFloor ?? oneLookCentredGlyphMin(device)) : 0;
  const names = fitter.centredNames;
  const oneLine = ONE_LOOK_CHOICES.centredNamesOneLine;

  // A light's brightness bar across the top, the state under it.
  const side = oneLookBarSide(device);
  const bar: OneLookRect | undefined = input.topBar
    ? { x: side, y: oneLookBarTop(device), width: Math.max(0, w - 2 * side), height: oneLookBarHeight(device) }
    : undefined;
  const top = bar === undefined ? inset : Math.max(inset, maxY(bar) + oneLookBarGap(device));

  const accessory = input.accessory;
  const accSize = oneLookAccessorySize(accessory, m, input.style.accessoryScale);
  // The Pill value style draws the state in a capsule, padded at its sides
  // and ends.
  const pill = input.style.statePill;
  const padH = pill ? Math.round(m.wordSize * ONE_LOOK_PILL_PAD_H) : 0;
  const padV = pill ? Math.round(m.wordSize * ONE_LOOK_PILL_PAD_V) : 0;
  const stateAvail = w - 2 * inset - (accessory === "none" ? 0 : accSize.width + ONE_LOOK_ACCESSORY_GAP);
  let state = s.withState ? fitter.fitState(input.state, stateAvail - 2 * padH, input.colSpan) : undefined;
  const stateLH = state === undefined ? 0 : state.lineHeight + 2 * padV;
  let stateW = state === undefined ? 0 : Math.min(stateAvail, oneLookStateWidth(state, m, fitter.measurer) + 2 * padH);
  const topBand = Math.max(stateLH, accessory === "none" ? 0 : accSize.height);
  const topGap = topBand > 0 && hasIcon ? m.gapTop : 0;

  // The name: one line nearly edge to edge, or (with the switch off) two
  // lines while the glyph keeps its floor; on the watch the inset tightens
  // to its minimum first.
  const nameInset = oneLine ? Math.min(inset, oneLookCentredNameInset(device)) : inset;
  const avail = w - 2 * nameInset;
  let insetV = inset;
  const need = (ins: number, size: number) =>
    top + ins + topBand + topGap + floor + (hasIcon ? m.gapTop : 0) + 2 * size * ONE_LOOK_TWO_LINE_HEIGHT;
  let fit: NameFit;
  if (input.name === "") {
    fit = emptyName(base);
  } else if (oneLine) {
    fit = names.fitOneLine(input.name, avail, base, Math.min(base, oneLookCentredNameMin(device)));
  } else if (narrow) {
    let twoOK = false;
    if (need(inset, ONE_LOOK_NARROW_MIN) <= h) {
      twoOK = true;
    } else if (need(m.insetMin, ONE_LOOK_NARROW_MIN) <= h + ONE_LOOK_OVERFLOW_SLACK) {
      twoOK = true;
      insetV = m.insetMin;
    }
    fit = names.fitNarrow(input.name, avail, twoOK, base);
  } else {
    let two: number | undefined;
    if (names.wouldWrap(input.name, avail, base)) {
      for (const size of twoSizes(base, m)) {
        if (need(inset, size) <= h) { two = size; break; }
        if (device === "watch" && need(m.insetMin, size) <= h + ONE_LOOK_OVERFLOW_SLACK) {
          two = size;
          insetV = m.insetMin;
          break;
        }
      }
    }
    fit = names.fitName(input.name, avail, two, base);
  }
  fit = clipped(fit, avail, names);
  const isTwo = fit.lines.length > 1;
  if (isTwo && device === "watch" && need(inset, fit.size) > h) insetV = m.insetMin;
  const nameLH = fit.size * (isTwo ? ONE_LOOK_TWO_LINE_HEIGHT : ONE_LOOK_ONE_LINE_HEIGHT);
  const textH = fit.lines.length * nameLH;
  const textTop = h - insetV - textH;

  let glyph: OneLookRect = { x: 0, y: 0, width: 0, height: 0 };
  let ink: OneLookRect | undefined;
  const accRect: OneLookRect | undefined = accessory === "none" ? undefined
    : { x: w - inset - accSize.width, y: top, width: accSize.width, height: accSize.height };
  const points = input.style.iconSize;
  const atOldPlace = hasIcon && points !== undefined;
  if (atOldPlace) {
    // Where the old look drew the icon: in the middle, moved up by its
    // offset, at its size. The state first gives way by shrinking into the
    // room left of the glyph's ink (a number to 70% of its size); only a
    // state that cannot makes the glyph shrink about that point, as the
    // bar, the accessory and the name do. The state's line height stays the
    // full size's.
    const nameBox: OneLookRect | undefined = textH > 0 ? { x: 0, y: textTop, width: w, height: textH } : undefined;
    const place = (obstacles: readonly (OneLookRect | undefined)[]) => oneLookOldPlaceGlyph({
      size: input.size, points, offset: input.style.iconOffset,
      extent: input.glyphExtent, aspect: input.glyphAspect, photo: input.glyphIsPhoto,
      floor, obstacles: obstacles.filter((o): o is OneLookRect => o !== undefined),
    });
    const full = place([bar, accRect, nameBox]);
    const beside = minX(full.ink) - ONE_LOOK_OLD_PLACE_GAP - inset;
    // A line and its width once it has given way beside the glyph drawn
    // whole.
    const givenWay = (line: StateLine, fit: StateFit): { fit: StateFit; width: number } => {
      const whole = Math.min(stateAvail, oneLookStateWidth(fit, m, fitter.measurer) + 2 * padH);
      const fitted = whole > beside ? fitter.fitState(line, beside - 2 * padH, input.colSpan, ONE_LOOK_STATE_GIVE_WAY) : undefined;
      return fitted === undefined ? { fit, width: whole } : { fit: fitted, width: Math.min(beside, oneLookStateWidth(fitted, m, fitter.measurer) + 2 * padH) };
    };
    const wholeState = state, wholeW = stateW;
    if (state !== undefined) ({ fit: state, width: stateW } = givenWay(input.state, state));
    // A person's photo clears whatever room the widest of "Home" and
    // "Away" takes, so two people's photos stay one size whichever word
    // each shows.
    let clearW = stateW;
    const photoWord = input.glyphIsPhoto && wholeState?.parts.kind === "word";
    if (photoWord) {
      for (const word of ONE_LOOK_PHOTO_STATE_WORDS) {
        const line: StateLine = { kind: "word", word };
        const fit = fitter.fitState(line, stateAvail - 2 * padH, input.colSpan);
        if (fit !== undefined) clearW = Math.max(clearW, givenWay(line, fit).width);
      }
    }
    const stateBox: OneLookRect | undefined = state === undefined ? undefined : { x: inset, y: top, width: clearW, height: stateLH };
    const placed = stateBox === undefined ? full : place([bar, stateBox, accRect, nameBox]);
    // The photo gave way for a wider word, so this one may take back its
    // whole size in the room left of it.
    if (photoWord && clearW > stateW && wholeState !== undefined) {
      const room = minX(placed.ink) - ONE_LOOK_OLD_PLACE_GAP - inset;
      if (wholeW <= room) {
        state = wholeState;
        stateW = wholeW;
      } else {
        const fitted = fitter.fitState(input.state, room - 2 * padH, input.colSpan, ONE_LOOK_STATE_GIVE_WAY);
        if (fitted !== undefined) {
          state = fitted;
          stateW = Math.min(room, oneLookStateWidth(fitted, m, fitter.measurer) + 2 * padH);
        }
      }
    }
    glyph = placed.box;
    ink = placed.ink;
  } else if (hasIcon) {
    // No old icon size (the app's tests and row probes): centred in the
    // room under the state, or taller, rising beside it while its ink clears
    // the state and the accessory.
    const bottom = textTop - (textH > 0 ? m.gapTop : 0);
    const bandTop = top + topBand + topGap;
    let box = Math.max(floor, Math.min(bottom - bandTop, glyphCap));
    let y = bandTop + Math.max(0, bottom - bandTop - box) / 2;
    const tall = Math.min(bottom - top, glyphCap);
    if (topBand > 0 && tall > box) {
      const inkShare = ONE_LOOK_GLYPH_INK_SHARE * Math.min(1, input.glyphAspect);
      let room = w;
      if (state !== undefined) room = Math.min(room, w - 2 * (inset + stateW + ONE_LOOK_GLYPH_STATE_GAP));
      if (accessory !== "none") room = Math.min(room, 2 * (w - inset - accSize.width - ONE_LOOK_GLYPH_STATE_GAP) - w);
      const risen = Math.min(tall, room / inkShare);
      if (risen > box) {
        box = risen;
        y = top + (bottom - top - box) / 2;
      }
    }
    glyph = { x: (w - box) / 2, y, width: box, height: box };
    const sideInk = box * ONE_LOOK_GLYPH_INK_SHARE;
    const inkW = sideInk * Math.min(1, input.glyphAspect);
    const inkH = sideInk / Math.max(1, input.glyphAspect);
    ink = { x: midX(glyph) - inkW / 2, y: midY(glyph) - inkH / 2, width: inkW, height: inkH };
  }

  const stateRect: OneLookRect | undefined = state === undefined ? undefined : { x: inset, y: top, width: stateW, height: stateLH };
  return {
    mode: "centred",
    size: input.size,
    insetH: inset,
    insetV,
    discRect: glyph,
    drawsDisc: false,
    glyphSize: glyph.width,
    accessory,
    accessoryRect: accRect,
    accessoryHitRect: accRect === undefined ? undefined : hitRect(accRect, accessory, input.size, m),
    textOrigin: { x: nameInset, y: textTop },
    textWidth: avail,
    textHeight: textH,
    name: fit,
    nameLineHeight: nameLH,
    state,
    stateLineHeight: stateLH,
    discEdge: 0,
    stateRect,
    barRect: bar,
    glyphInk: ink,
    glyphAtOldPlace: atOldPlace,
  };
}

/**
 * The glyph's box and ink at the old look's place (`oldPlaceGlyph`):
 * centred across, `offset` from the middle, its image as big as `points`
 * drew it, then shrunk about its centre until its ink clears every obstacle
 * and stays in the tile (never under `floor`; `fits` then decides). A
 * `photo` fills its whole box, round, at 1.35 x `points`.
 */
export function oneLookOldPlaceGlyph(given: {
  size: OneLookSize; points: number; offset: number; extent: number; aspect: number;
  photo?: boolean; floor: number; obstacles: readonly OneLookRect[];
}): { box: OneLookRect; ink: OneLookRect } {
  const w = given.size.width, h = given.size.height;
  const photo = given.photo === true;
  const cx = w / 2, cy = h / 2 + given.offset;
  const share = photo ? 1 : ONE_LOOK_GLYPH_INK_SHARE;
  const drawn = photo ? 1 : 1 - 2 * ONE_LOOK_OLD_PLACE_INK_TRIM;
  const aspect = photo ? 1 : given.aspect;
  // The ink's half width and half height per point of box.
  const ha = share * Math.min(1, aspect) * drawn / 2;
  const hb = share / Math.max(1, aspect) * drawn / 2;
  let box = photo ? given.points * ONE_LOOK_OLD_PLACE_PHOTO_SHARE : given.points * given.extent / share;
  box = Math.min(box, Math.min(cx, w - cx) / ha, Math.min(cy, h - cy) / hb);
  for (const o of given.obstacles) {
    const dx = Math.abs(cx - midX(o)) - Math.abs(o.width) / 2 - ONE_LOOK_OLD_PLACE_GAP;
    const dy = Math.abs(cy - midY(o)) - Math.abs(o.height) / 2 - ONE_LOOK_OLD_PLACE_GAP;
    box = Math.min(box, Math.max(0, dx / ha, dy / hb));
  }
  box = Math.max(given.floor, box);
  return {
    box: { x: cx - box / 2, y: cy - box / 2, width: box, height: box },
    ink: { x: cx - ha * box, y: cy - hb * box, width: 2 * ha * box, height: 2 * hb * box },
  };
}

// Strip (the mock, under 4 rows)

function strip(input: OneLookLayoutInput, fitter: OneLookTextFitter, s: Step): Unscaled {
  const m = fitter.metrics;
  const w = input.size.width, h = input.size.height;
  const base = rowBase(input, m);
  const hasIcon = s.hasIcon;
  const sInset = input.device === "phone" ? Math.max(8, h * 0.16) : Math.max(4, h * 0.12);

  let box = 0;
  let glyph = 0;
  let drawsDisc = false;
  if (hasIcon) {
    box = Math.max(0, Math.min(h - 2 * sInset, m.stripDiscMax));
    glyph = box * m.glyphK;
    drawsDisc = true;
    if (box < ONE_LOOK_SMALLEST_DISC) {
      // A strip too short for a readable disc (a one row tile): the glyph
      // alone, at the size it would have in a disc as tall as the tile.
      box = Math.min(h * m.glyphK, m.stripDiscMax);
      glyph = box;
      drawsDisc = false;
    } else if (input.centred) {
      // The bridge look draws no disc.
      glyph = box * ONE_LOOK_BARE_GLYPH_SHARE;
      drawsDisc = false;
    }
  }
  const lead = hasIcon ? box + m.stripGap : 0;

  const accessory = input.accessory;
  const accSize = oneLookAccessorySize(accessory, m, input.style.accessoryScale);
  const avail = w - 2 * sInset - lead - (accessory === "none" ? 0 : accSize.width + ONE_LOOK_ACCESSORY_GAP);

  const state = s.withState ? fitter.fitState(input.state, avail, input.colSpan) : undefined;
  const stateLH = (state?.lineHeight ?? 0) * ONE_LOOK_STRIP_STATE_SHARE;
  let two: number | undefined;
  for (const size of twoSizes(base, m)) {
    if (h - sInset >= 2 * size * ONE_LOOK_TWO_LINE_HEIGHT + stateLH) { two = size; break; }
  }
  const fit = input.name === "" ? emptyName(base) : clipped(fitter.fitName(input.name, avail, two, base), avail, fitter);
  const nameLH = fit.size * (fit.lines.length > 1 ? ONE_LOOK_TWO_LINE_HEIGHT : ONE_LOOK_STRIP_ONE_LINE_HEIGHT);
  const textH = fit.lines.length * nameLH + stateLH;

  const accRect: OneLookRect | undefined = accessory === "none" ? undefined
    : { x: w - sInset - accSize.width, y: (h - accSize.height) / 2, width: accSize.width, height: accSize.height };
  return {
    mode: "strip",
    size: input.size,
    insetH: sInset,
    insetV: sInset,
    discRect: { x: sInset, y: (h - box) / 2, width: box, height: box },
    drawsDisc,
    glyphSize: glyph,
    accessory,
    accessoryRect: accRect,
    accessoryHitRect: accRect === undefined ? undefined : hitRect(accRect, accessory, input.size, m),
    textOrigin: { x: sInset + lead, y: (h - textH) / 2 },
    textWidth: avail,
    textHeight: textH,
    name: fit,
    nameLineHeight: nameLH,
    state,
    stateLineHeight: stateLH,
    discEdge: hasIcon ? sInset + box + m.stripGap * 0.4 : sInset,
    glyphAtOldPlace: false,
  };
}

// Compact (the tiny tile ladder's last step)

/** A centred glyph, no text, no accessory. Under 2 x inset + 14 the glyph
 * draws with no disc. It reads the tile's own icon, not the step's. */
function compact(input: OneLookLayoutInput, fitter: OneLookTextFitter): Unscaled {
  const m = fitter.metrics;
  const w = input.size.width, h = input.size.height;
  const short = Math.min(w, h);
  const inset = clamp(short * m.insetK, m.insetMin, m.insetMax);
  const room = short - 2 * inset;
  let box = 0;
  let glyph = 0;
  let drawsDisc = false;
  if (input.hasIcon) {
    if (room >= ONE_LOOK_SMALLEST_DISC) {
      box = Math.min(room, m.discMax);
      glyph = box * (input.centred ? ONE_LOOK_BARE_GLYPH_SHARE : m.glyphK);
      drawsDisc = !input.centred;
    } else {
      box = short * m.glyphK;
      glyph = box;
    }
  }
  const disc: OneLookRect = { x: (w - box) / 2, y: (h - box) / 2, width: box, height: box };
  return {
    mode: "compact",
    size: input.size,
    insetH: inset,
    insetV: inset,
    discRect: disc,
    drawsDisc,
    glyphSize: glyph,
    accessory: "none",
    textOrigin: { x: minX(disc), y: maxY(disc) },
    textWidth: 0,
    textHeight: 0,
    name: emptyName(rowBase(input, m)),
    nameLineHeight: 0,
    stateLineHeight: 0,
    discEdge: 0,
    glyphAtOldPlace: false,
  };
}

// Fitting

/** Whether a layout keeps everything inside its tile: the text has room for
 * three name floors across, every line fits its width, the text clears the
 * glyph and the tile's edges, and the disc clears the accessory. */
function fits(layout: Unscaled, fitter: OneLookTextFitter): boolean {
  const m = fitter.metrics;
  const w = layout.size.width, h = layout.size.height;
  const slack = ONE_LOOK_OVERFLOW_SLACK;
  const hasText = layout.name.lines.length > 0 || layout.state !== undefined;
  const names = layout.mode === "centred" ? fitter.centredNames : fitter;
  if (hasText) {
    if (layout.textWidth < ONE_LOOK_TEXT_ROOM_NAMES * m.nameMin) return false;
    for (const line of layout.name.lines) {
      if (names.nameWidth(line, layout.name.size) > layout.textWidth + slack) return false;
    }
    // A rect's width reads standardized, as `CGRect.width` does: a state
    // box squeezed past nothing on a tiny tile has a negative stored width.
    const stateRoom = layout.stateRect === undefined ? layout.textWidth : Math.abs(layout.stateRect.width);
    if (layout.state !== undefined && oneLookStateWidth(layout.state, m, fitter.measurer) > stateRoom + slack) return false;
  }
  const text: OneLookRect = { x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight };
  if (minY(text) < -slack || maxY(text) > h + slack || maxX(text) > w + slack) return false;
  const st = layout.stateRect;
  if (st !== undefined && (maxY(st) > h + slack || maxX(st) > w + slack)) return false;
  const disc = layout.discRect;
  const acc = layout.accessoryRect;
  if (disc.width > 0) {
    // The old place's glyph box may run past the tile's edge where its
    // image has only margin; its ink stays in.
    const bounds = layout.glyphAtOldPlace ? (layout.glyphInk ?? disc) : disc;
    if (minY(bounds) < -slack || maxY(bounds) > h + slack || maxX(bounds) > w + slack) return false;
    if (layout.mode === "stacked") {
      if (hasText && minY(text) < maxY(disc) + m.gapTop - slack) return false;
    } else if (layout.mode === "centred") {
      const core = insetBy(layout.glyphInk ?? disc, slack, slack);
      if (layout.glyphAtOldPlace) {
        // The old place's glyph clears everything by its ink alone.
        if (oneLookRectsIntersect(layout.barRect, core)) return false;
        if (layout.name.lines.length > 0 && oneLookRectsIntersect(text, core)) return false;
      } else {
        // The glyph clears the bar, the name, and by its ink the state and
        // the accessory.
        if (layout.barRect !== undefined && minY(disc) < maxY(layout.barRect) - slack) return false;
        if (layout.name.lines.length > 0 && minY(text) < maxY(disc) + m.gapTop - slack) return false;
      }
      if (oneLookRectsIntersect(st, core)) return false;
      if (oneLookRectsIntersect(acc, core)) return false;
    }
    if (acc !== undefined && layout.mode === "stacked" && maxX(disc) > minX(acc) + slack) return false;
  }
  if (acc !== undefined && (minX(acc) < -slack || maxY(acc) > h + slack || minY(acc) < -slack)) return false;
  const big = layout.bigRect;
  if (big !== undefined && (minY(big) < -slack || maxY(big) > h + slack || minX(big) < maxX(text))) return false;
  return true;
}

// Row name sizes (`OneLookRowNames`): every tile in a row (same top, same
// height) takes the smallest name size any of them needs, settled over at
// most 4 passes. Drawn tiles carry the old look's name size and so ignore
// the caps (`rowBase`); the caps are here for parity with the app's probes.

export const ONE_LOOK_ROW_MAX_PASSES = 4;
/** Two caps this close are the same. */
export const ONE_LOOK_ROW_SETTLED = 0.01;

/** A row: the packed row a tile starts on and its rowSpan. */
export function oneLookRowKey(row: number, rowSpan: number): string {
  return `${row}:${rowSpan}`;
}

export interface OneLookRowProbe {
  readonly key: string;
  readonly input: OneLookLayoutInput | OneLookLayoutInputInit;
}

export function oneLookRowCaps(probes: readonly OneLookRowProbe[], measurer: TextMeasurer): Map<string, number> {
  let cap = new Map<string, number>();
  for (let pass = 0; pass < ONE_LOOK_ROW_MAX_PASSES; pass++) {
    const next = new Map<string, number>();
    for (const probe of probes) {
      const input = { ...probe.input, nameCap: cap.get(probe.key) };
      const size = oneLookRowNameSize(resolveOneLookLayout(input, measurer));
      if (size === undefined) continue;
      next.set(probe.key, Math.min(next.get(probe.key) ?? Number.POSITIVE_INFINITY, size));
    }
    let same = true;
    for (const [key, size] of next) {
      if (!(Math.abs(size - (cap.get(key) ?? Number.POSITIVE_INFINITY)) < ONE_LOOK_ROW_SETTLED)) same = false;
    }
    cap = next;
    if (same) break;
  }
  return cap;
}
