// One Look's numbers for each device, copied from the app's
// `OneLookMetrics.swift` (the mock's device table, `DEV`), with the switches
// that decide what One Look draws today (`OneLookChoices`) and the grid the
// app keeps under it (`OneLookGrid` in `OneLookLayout.swift`). Sizes are in
// points, as the app lays a tile out; a preview multiplies by its own pixel
// scale only when it draws. The `K` values are shares of the tile.

/** The device a One Look tile is drawn for (`OneLookDevice`). Every rule
 * takes it as an argument, so one panel can draw either device's tiles. */
export type OneLookDevice = "phone" | "watch";

/** `OneLookChoices`, as the app has them now. Each was a question in the
 * app's plan; the layout reads `tinyTiles`, `centredGlyph` and
 * `centredNamesOneLine`, and the tile's model reads `brightnessBar`. Read
 * from the app's source, never assumed: a change there is a change here. */
export const ONE_LOOK_CHOICES = {
  /** A tile too small for its text first drops its state, then shrinks its
   * disc, then shows the glyph alone ("dropDisc" would drop the disc and
   * keep the name). */
  tinyTiles: "shrinkToDisc" as "shrinkToDisc" | "dropDisc",
  /** The bridge look: the glyph big in the middle where the old look drew
   * its icon, the state top left, the name centred at the bottom. */
  centredGlyphOnPhone: true,
  centredGlyphOnWatch: true,
  /** A light keeps a brightness bar's room across the top. */
  brightnessBar: true,
  /** A centred name is always one line, shrunk, then cut in the middle. */
  centredNamesOneLine: true,
} as const;

/** Whether the bridge look draws on a device (`OneLookChoices.centredGlyph`). */
export function oneLookCentredGlyph(device: OneLookDevice): boolean {
  return device === "phone" ? ONE_LOOK_CHOICES.centredGlyphOnPhone : ONE_LOOK_CHOICES.centredGlyphOnWatch;
}

export interface OneLookMetrics {
  /** The name's size, and the smallest a fitted name may shrink to. */
  readonly nameSize: number;
  readonly nameMin: number;
  /** A name's letter spacing in ems of its size. Every measurement uses it,
   * whatever it measures, as the mock measured every run in one span. */
  readonly nameTracking: number;
  /** A state's number (bold rounded), its unit's share of it, and the floor
   * the unit never draws under (0: none). */
  readonly figureSize: number;
  readonly unitScale: number;
  readonly unitMin: number;
  /** A word state's size, and the smallest a fitted state may shrink to. */
  readonly wordSize: number;
  readonly textMin: number;
  /** The icon disc: its share of the tile's height, its floor (and the floor
   * on a narrow tile), its cap, and the glyph's share of it. */
  readonly discK: number;
  readonly discMin: number;
  readonly discMinNarrow: number;
  readonly discMax: number;
  readonly glyphK: number;
  /** The inset: a share of the short side, clamped. */
  readonly insetK: number;
  readonly insetMin: number;
  readonly insetMax: number;
  /** A strip's disc cap, and the gap between its disc and its text. */
  readonly stripDiscMax: number;
  readonly stripGap: number;
  /** The accessory disc and its touch square. */
  readonly accessoryDisc: number;
  readonly accessoryHit: number;
  /** The LIVE chip: text size, width in ems of it, padding. */
  readonly liveSize: number;
  readonly liveWidthEm: number;
  readonly livePaddingV: number;
  readonly livePaddingH: number;
  /** The gap between the disc and the name (and the centred layout's gaps). */
  readonly gapTop: number;
  /** The big value on a wide tile, the line under it, the gap between them,
   * and the room kept between it and the text. */
  readonly bigSize: number;
  readonly bigSubSize: number;
  readonly bigSubGap: number;
  readonly bigGap: number;
  /** Drawing only: a chart's line, the rim light, the pearl disc's glow,
   * and whether lit tiles cast a glow under them. */
  readonly chartLineWidth: number;
  readonly rim: number;
  readonly pearlGlow: number;
  readonly underGlow: boolean;
  /** The corner radius: a share of the short side, capped, in this curve. */
  readonly cornerRadiusMax: number;
  readonly cornerRadiusK: number;
  readonly cornerStyle: "continuous" | "circular";
  /** How far each tile is drawn in from its grid cell, a side. */
  readonly cellInset: number;
  /** The grid's padding at the screen's sides, outside the cell insets. */
  readonly sidePadding: number;
}

/** The accessory glyphs' share of the accessory disc, both devices. */
export const ONE_LOOK_ACCESSORY_GLYPH_PLAY = 0.5;
export const ONE_LOOK_ACCESSORY_GLYPH_FAN = 0.62;
export const ONE_LOOK_ACCESSORY_GLYPH_ARROW = 0.52;
export const ONE_LOOK_ACCESSORY_GLYPH_MIC = 0.54;

export const ONE_LOOK_PHONE: OneLookMetrics = Object.freeze({
  nameSize: 15.5, nameMin: 11, nameTracking: -0.01,
  figureSize: 21, unitScale: 0.66, unitMin: 0,
  wordSize: 15, textMin: 12,
  discK: 0.35, discMin: 30, discMinNarrow: 30, discMax: 46, glyphK: 0.58,
  insetK: 0.11, insetMin: 10, insetMax: 14,
  stripDiscMax: 44, stripGap: 11,
  accessoryDisc: 30, accessoryHit: 44,
  liveSize: 11, liveWidthEm: 4.2, livePaddingV: 4, livePaddingH: 8,
  gapTop: 6,
  bigSize: 40, bigSubSize: 13, bigSubGap: 3, bigGap: 18,
  chartLineWidth: 2.2, rim: 1, pearlGlow: 12, underGlow: true,
  cornerRadiusMax: 22, cornerRadiusK: 0.2, cornerStyle: "continuous",
  cellInset: 5, sidePadding: 11,
});

export const ONE_LOOK_WATCH: OneLookMetrics = Object.freeze({
  nameSize: 11.5, nameMin: 10, nameTracking: -0.01,
  figureSize: 14, unitScale: 0.66, unitMin: 10,
  wordSize: 11, textMin: 10,
  discK: 0.41, discMin: 20, discMinNarrow: 16, discMax: 40, glyphK: 0.64,
  insetK: 0.09, insetMin: 4.5, insetMax: 7,
  stripDiscMax: 20, stripGap: 5,
  accessoryDisc: 20, accessoryHit: 32,
  liveSize: 9, liveWidthEm: 4.2, livePaddingV: 2, livePaddingH: 5,
  gapTop: 1.5,
  bigSize: 22, bigSubSize: 10.5, bigSubGap: 1.5, bigGap: 10,
  chartLineWidth: 1.6, rim: 0.6, pearlGlow: 6, underGlow: false,
  cornerRadiusMax: 12, cornerRadiusK: 0.17, cornerStyle: "circular",
  cellInset: 0.5, sidePadding: 1.5,
});

export function oneLookMetrics(device: OneLookDevice): OneLookMetrics {
  return device === "phone" ? ONE_LOOK_PHONE : ONE_LOOK_WATCH;
}

/** A unit's size beside the state's number: 66% of it, never under the
 * floor (the watch's 10 pt). The app's `OneLookMetrics.unitSize`. */
export function oneLookUnitTextSize(m: OneLookMetrics): number {
  return Math.max(m.unitMin, m.figureSize * m.unitScale);
}

/** The disc's floor on a tile this many columns wide: 4 columns or fewer
 * take the narrow floor (16 on the watch; the iPhone's is the same 30). */
export function oneLookDiscMin(m: OneLookMetrics, colSpan: number): number {
  return colSpan <= 4 ? m.discMinNarrow : m.discMin;
}

/** The tile's corner radius at its drawn size: a share of the short side,
 * capped. */
export function oneLookCornerRadius(m: OneLookMetrics, size: { width: number; height: number }): number {
  return Math.min(m.cornerRadiusMax, Math.min(size.width, size.height) * m.cornerRadiusK);
}

/**
 * These metrics with their text at Dynamic Type's `scale` and the tile's own
 * Name Size and State Size factors (`scaledText`): the name, number, word
 * and big value sizes and their floors move together, so a name still
 * shrinks to fit. Discs, insets, gaps, the accessory and the LIVE chip keep
 * their size. All three at 1 give the metrics back unchanged. The panel has
 * no Dynamic Type, so `scale` is always 1 here.
 */
export function oneLookScaledText(m: OneLookMetrics, scale: number, name = 1, state = 1): OneLookMetrics {
  if (scale === 1 && name === 1 && state === 1) return m;
  const stateScale = scale * state;
  return Object.freeze({
    ...m,
    nameSize: m.nameSize * scale * name,
    nameMin: m.nameMin * scale * Math.min(1, name),
    figureSize: m.figureSize * stateScale,
    unitMin: m.unitMin * scale * Math.min(1, state),
    wordSize: m.wordSize * stateScale,
    textMin: m.textMin * scale * Math.min(1, state),
    bigSize: m.bigSize * stateScale,
    bigSubSize: m.bigSubSize * stateScale,
  });
}

// The grid under One Look (`OneLookGrid`). The app keeps its 2 pt pitch,
// which packing and header shifts count on, and draws each tile in from its
// cell instead: 2 + 2 x 5 apart on the iPhone, 2 + 2 x 0.5 on the watch.

export const ONE_LOOK_COLUMNS = 12;
/** `PageGridLayout.tileSpacing`: the pitch between cells. */
export const ONE_LOOK_TILE_SPACING = 2;

/** How far a tile is drawn in from its cell, a side. A divider and a
 * spacer keep their whole cell. */
export function oneLookCellInset(device: OneLookDevice, isDivider = false, isSpacer = false): number {
  return isDivider || isSpacer ? 0 : oneLookMetrics(device).cellInset;
}

/** The gap between two tiles as drawn: 12 on the iPhone, 3 on the watch. */
export function oneLookVisibleGap(device: OneLookDevice): number {
  return ONE_LOOK_TILE_SPACING + 2 * oneLookCellInset(device);
}

/** The padding the grid itself keeps at the screen's sides: the watch's
 * 1.5; the iPhone's pages pad its grid with their own gutter instead. */
export function oneLookGridSidePadding(device: OneLookDevice): number {
  return device === "watch" ? oneLookMetrics(device).sidePadding : 0;
}

/** The grid's square unit on a screen this wide, inside the device's side
 * padding: 29.83 on a 402 pt iPhone, 15.5 on a 211 pt watch. */
export function oneLookGridUnit(screenWidth: number, device: OneLookDevice): number {
  const width = screenWidth - 2 * oneLookMetrics(device).sidePadding;
  return (width - (ONE_LOOK_COLUMNS - 1) * ONE_LOOK_TILE_SPACING) / ONE_LOOK_COLUMNS;
}

/** A tile's grid cell at its spans. */
export function oneLookCellSize(colSpan: number, rowSpan: number, unit: number): { width: number; height: number } {
  return {
    width: unit * colSpan + ONE_LOOK_TILE_SPACING * (colSpan - 1),
    height: unit * rowSpan + ONE_LOOK_TILE_SPACING * (rowSpan - 1),
  };
}

/** A tile's drawn size from its cell: the cell less `cellInset` a side
 * (`OneLookLayout.drawnSize(cell:device:)`). */
export function oneLookDrawnSizeOfCell(cell: { width: number; height: number }, device: OneLookDevice): { width: number; height: number } {
  const inset = oneLookMetrics(device).cellInset;
  return { width: Math.max(0, cell.width - 2 * inset), height: Math.max(0, cell.height - 2 * inset) };
}

/** A tile's drawn size at its spans on a grid of `unit`. */
export function oneLookDrawnSize(colSpan: number, rowSpan: number, unit: number, device: OneLookDevice): { width: number; height: number } {
  return oneLookDrawnSizeOfCell(oneLookCellSize(colSpan, rowSpan, unit), device);
}

/** The padding the iPhone's pages keep each side of a One Look grid, so the
 * tiles' drawn edges stay where the page look puts them: `tileEdge` (16
 * with the iPhone look, 6 with the watch look) less the cell inset. */
export function oneLookPhonePagesInset(tileEdge: number): number {
  return Math.max(0, tileEdge - ONE_LOOK_PHONE.cellInset);
}

/** The room under the last row of an iPhone One Look page with the iPhone
 * look and the dock under it, so the last tile scrolls clear of the dock. */
export const ONE_LOOK_PHONE_BOTTOM_PADDING = 7;
