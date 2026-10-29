// One Look's tile in a panel picture, as the app draws it today
// (`OneLookKindTile`, `OneLookTileView` and `TileStyleModifier.oneLookBody`):
// the 135 deg fill with its corner light, the tile's own pattern and effect,
// a camera's picture or album art under its scrim, the content (the level
// bar, the glyph or a person's photo, the round button top right, the state
// and the name) and the rim over it all, with the user's border when it is
// thick enough to draw. The bridge look is on on both devices, so a tile's
// glyph sits big and bare where the old look drew its icon, the state top
// left and the name centred at the bottom on one line; chart and picture
// tiles keep the disc layouts.
//
// Where everything goes comes only from `layout.ts`, every colour only from
// `colour.ts` and every word only from `state.ts`; this file reads the stored
// tile into their inputs and turns their answers into positioned HTML. The
// tile's own sizes are the old look's (`takeOldSizes`), ported here with the
// iPhone look's text scale, its Home name cap and its icon shares, so a
// tile's name and bulb keep the size the old look gave them, as on the
// devices. Everything is in points times `s`.

import { html, nothing, svg, type TemplateResult } from "lit";
import type { HassEntityState } from "../../ha-api.js";
import type { IconProvider } from "../../renderer.js";
import { type WatchPageTile, tileEntityId, tileKind, tileShowsLabel, tileTarget } from "../model.js";
import { findWatchCatalogEntry, watchLibraryTarget, type WatchCatalog } from "../catalog.js";
import { isWatchTvRemote } from "../special-model.js";
import { watchMediaArtwork, watchSensorChart } from "../phone-keys-model.js";
import {
  type WatchPagePreviewInput,
  type WatchSpecialLook,
  filledSymbol,
  knownSymbol,
  liveOver,
  pictureOf,
  renderTileRim,
  snapshot,
  stateEntry,
  tileUnderlay,
  unfilledSymbol,
  watchAutoLabelFontSize,
  watchIconVerticalOffset,
  watchMultiCamBorder,
  watchMultiCamCells,
  watchPreviewTileLabel,
  watchTileBorder,
  watchTileColorOpacity,
  watchTileFallbackInk,
  watchTileLabelColor,
  watchTilePreviewActive,
  watchTileSymbol,
  watchValueLabelStyle,
} from "../preview.js";
import { phoneDrawsIphoneLook } from "../../phone-frame.js";
import {
  type OneLookInk,
  type OneLookPalette,
  oneLookBarColour,
  oneLookBlendCss,
  oneLookFill,
  oneLookFillTrackStops,
  oneLookGlyphHalo,
  oneLookGlyphGlowOf,
  oneLookGlyphInk,
  oneLookHex,
  oneLookInkCss,
  oneLookPalette,
  oneLookRimCss,
  oneLookScrimCss,
  oneLookSheenCss,
  oneLookUnderGlowCss,
  ONE_LOOK_AMBER,
  ONE_LOOK_AMBER_DOT,
  ONE_LOOK_BAR_BORDER_OPACITY,
  ONE_LOOK_BAR_FILL_OPACITY,
  ONE_LOOK_BAR_TRACK_OPACITY,
  ONE_LOOK_FILL_EDGE_OPACITY,
  ONE_LOOK_FILL_EDGE_WIDTH,
  ONE_LOOK_PILL_OPACITY,
  ONE_LOOK_UNIT_OPACITY,
} from "./colour.js";
import { type OneLookKindState, oneLookBarValue, oneLookFillLevel, oneLookStateFor, oneLookTileState } from "./state.js";
import { ONE_LOOK_CHOICES, type OneLookDevice, oneLookCentredGlyph, oneLookCornerRadius, oneLookMetrics } from "./metrics.js";
import {
  type OneLookLayout,
  type OneLookLayoutInputInit,
  type OneLookRect,
  type OneLookTileStyle,
  ONE_LOOK_ACCESSORY_SCALE_RANGE,
  ONE_LOOK_GLYPH_INK_SHARE,
  ONE_LOOK_STATE_SCALE_RANGE,
  oneLookAccessoryGlyphShare,
  oneLookLayoutMetrics,
  oneLookStyleFactor,
  resolveOneLookLayout,
} from "./layout.js";
import { ONE_LOOK_FONT_FAMILIES, oneLookCssWeight, oneLookMeasurer, oneLookSymbolImage } from "./measurer.js";
import { type OneLookArranged, normalizeTileArrange, oneLookArrangeLayout } from "./arrange.js";
import { type OneLookPhotoLight, oneLookGlowColour, oneLookLightPlacement } from "./glow.js";
import { type OneLookTint, oneLookTintIsWhite, oneLookTintOf, oneLookTintRGB8 } from "./tint.js";
import { type OneLookTextDesign, type OneLookTextWeight, type StateFit, type StateLine, type TextMeasurer, glyphAspectOf, glyphExtentOf, measureDesign } from "./text.js";

/** Which of a tile's own parts are left undrawn: the glyph (its icon or a
 * person's photo, and the glow with it), the name, and the state line. */
export interface TileHiddenParts {
  glyph: boolean;
  name: boolean;
  state: boolean;
}

/** What a page picture has for one tile when it hands it to One Look. */
export interface OneLookTileFaceInput {
  /** The tile as the device holds it: a watch's with the colour its pull
   * gives a tile with none, an iPhone's as stored. */
  tile: WatchPageTile;
  /** The picture's input with the tile's state mode and seeded state in. */
  input: WatchPagePreviewInput;
  /** Whether the tile's entity is a seeded stand in, drawn at 0.7. */
  stub: boolean;
  device: OneLookDevice;
  /** The panel's special look for the kind (`watchSpecialTileLook`): its
   * symbol, a person's photo, a music hub's album art. */
  look: WatchSpecialLook | undefined;
  /** The size the tile is drawn at, its cell less the cell inset a side. */
  width: number;
  height: number;
  /** Its grid cell. */
  cell: { width: number; height: number };
  /** The grid's unit in points. */
  unit: number;
  /** Where the drawn tile goes, as CSS. */
  box: string;
  /** Pixels per point. */
  s: number;
  /** The tooltip, when the picture names its tiles. */
  hint?: string;
  /** Measures the text and glyphs; absent, the device's own measurer with
   * the picture's symbols. */
  measurer?: TextMeasurer;
  /** The parts of the tile left undrawn: the layout is the same as with
   * them, so nothing else moves. The glyph takes its disc or halo with it;
   * the state its pill, unit, tail and amber dot, the big value that stands
   * in for it, and the accessory beside it (as the apps hide it, touch area
   * and all). The bar and the chart are never hidden. */
  hidden?: TileHiddenParts;
}

/** The iPhone's Page look a tile's old sizes are read in; the watch is
 * always the watch's. */
type PageLook = "iphone" | "watch";

/** A tile as One Look draws it, everything resolved: what `renderOneLookTile`
 * draws, and what tests read. */
export interface OneLookPreviewModel {
  device: OneLookDevice;
  pageLook: PageLook;
  kind: OneLookKindState;
  /** The symbol as drawn (its fill, outline or slashed form), "" for none,
   * and the bare one the layout measured. */
  icon: string;
  baseIcon: string;
  /** A person's photo in the glyph's place. */
  photo?: string;
  /** The tile's icon photo (`iconPhotoId`) in the glyph's place, once its
   * bytes are in: its URL, and its width over its height when the list
   * has its size. It wins over a person's photo. */
  cutout?: OneLookCutout;
  /** What fills the tile behind its content: its own fill, a camera's
   * picture, or album art. */
  picture: "none" | "camera" | "artwork";
  pictureUrl?: string;
  /** The name laid out ("" draws none). */
  name: string;
  /** A sensor chart's samples, oldest first. */
  chart?: readonly number[];
  style: OneLookTileStyle;
  bar: OneLookBarStyle;
  /** What the top bar fills to; undefined draws no bar. */
  barValue?: number;
  /** False for a placeholder and a camera showing its picture: no pattern,
   * effect or border. */
  decorated: boolean;
  colSpan: number;
  rowSpan: number;
  layout: OneLookLayout;
  palette: OneLookPalette;
  /** The tile's Arrangement (`arrange`) placed over the centred layout:
   * where its listed parts are drawn, at what size, and which are hidden.
   * Undefined for Default, and in every other layout, which ignores it. */
  arrange?: OneLookArranged;
  /** A light's tint from its live state (`tint.ts`): the colour its On
   * photo and its Clear look's glow take, and their level. Only for a
   * tile of the `light` domain. */
  tint?: OneLookTint;
}

/** A tile's icon photo as One Look draws it. */
export interface OneLookCutout {
  url: string;
  /** Width over height; undefined until the photo list has its size. */
  aspect?: number;
  /** The look saved in the photo (Light Look) with its masks made, drawn
   * while the tile is lit. */
  light?: OneLookPhotoLight;
  /** The URL of the On photo the photo carries (the same lamp, its light
   * on, at the photo's size), drawn in its place while the tile is lit. */
  on?: string;
  /** The URL of the On photo's tint mask (`tint.ts`, `W` clipped to the On
   * photo's alpha), which a light's On photo is tinted through. */
  onMask?: string;
  /** The tile asks for the photo's Clear look (`iconPhotoLook` "clear"). */
  clear?: true;
}

/** A tile's icon photo once its bytes are in, from the picture's photos,
 * or undefined: no `iconPhotoId`, no photos to read from, or the bytes not
 * in yet (the tile draws its icon meanwhile, as the devices do). Its On
 * photo and its look come with it once they are made; the photo's size
 * then comes from the masks when the list has none. */
export function oneLookCutoutOf(tile: WatchPageTile, input: Pick<WatchPagePreviewInput, "photo" | "photoSize" | "photoGlow" | "photoOn" | "photoOnMask">): OneLookCutout | undefined {
  const id = tile.iconPhotoId;
  if (typeof id !== "string" || id.trim() === "" || input.photo === undefined) return undefined;
  const url = input.photo(id);
  if (url === undefined || url === "") return undefined;
  const light = input.photoGlow?.(id);
  const on = input.photoOn?.(id);
  const onMask = on === undefined || on === "" ? undefined : input.photoOnMask?.(id);
  const size = input.photoSize?.(id) ?? light;
  return {
    url,
    ...(size !== undefined && size.width > 0 && size.height > 0 ? { aspect: size.width / size.height } : {}),
    ...(light === undefined ? {} : { light }),
    ...(on === undefined || on === "" ? {} : { on }),
    ...(onMask === undefined || onMask === "" ? {} : { onMask }),
    ...(tile.iconPhotoLook === "clear" ? { clear: true as const } : {}),
  };
}

/** The icon photo's box against the disc's diameter, and its corner
 * radius against the box's side (photo tiles plan, "Drawing"). */
export const ONE_LOOK_CUTOUT_BOX = 1.35;
export const ONE_LOOK_CUTOUT_CORNER = 0.22;

/** The CSS filter of an icon photo that is not lit (and of every one wrist
 * down): grayscale 85%, brightness 62%, as the apps' `.saturation(0.15)`
 * and `.brightness(-0.3)`. */
export const ONE_LOOK_CUTOUT_OFF_FILTER = "grayscale(.85) brightness(.62)";

/**
 * Where an icon photo is drawn for a disc `rect`: a square box 1.35 times
 * the disc's diameter on the disc's centre, the photo fitted inside it with
 * its aspect kept (the whole box while the aspect is unknown), and the
 * corner radius 22% of the box's side.
 */
export function oneLookCutoutRect(rect: OneLookRect, aspect: number | undefined): { box: OneLookRect; photo: OneLookRect; radius: number } {
  const side = rect.width * ONE_LOOK_CUTOUT_BOX;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const box = { x: cx - side / 2, y: cy - side / 2, width: side, height: side };
  return { box, photo: fittedPhoto(box, aspect), radius: side * ONE_LOOK_CUTOUT_CORNER };
}

/** A photo of `aspect` (width over height) fitted whole in a square `box`
 * on its centre; the whole box while the aspect is unknown. */
function fittedPhoto(box: OneLookRect, aspect: number | undefined): OneLookRect {
  const side = box.width;
  const cx = box.x + side / 2;
  const cy = box.y + box.height / 2;
  const a = aspect !== undefined && Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const w = a >= 1 ? side : side * a;
  const h = a >= 1 ? side / a : side;
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
}

// ── the Clear look (photo tiles plan, "Clear look") ─────────────────────

/** The Clear look's numbers, the apps' `OneLookPhotoClear`: the white wash
 * and hairline in place of the fill; the photo box's side as a share of the
 * tile's height, never over a share of its width, its top a share of the
 * height down; the glow behind a lit photo (photo tiles plan, "On photo
 * tint", screen blended), its alpha at the box's centre, its alpha at a
 * stop part way out (a share of its radius), and its radius, where it is
 * gone, as a share of the tile's width; the state's size against the
 * name's; how far the name and the state shrink before they truncate; and
 * the state's grey while not lit. */
export const ONE_LOOK_CLEAR = Object.freeze({
  washOpacity: 0.025,
  borderOpacity: 0.06,
  boxHeightShare: 0.62,
  boxWidthCap: 0.8,
  topShare: 0.05,
  glowCentreOpacity: 0.42,
  glowMidOpacity: 0.18,
  glowMidStop: 0.45,
  glowRadiusShare: 0.7,
  stateShare: 0.82,
  textMinimumScale: 0.7,
  offStateOpacity: 0.6,
});

/** The Clear look's photo box in a tile of `size`: a square of side
 * `min(0.62 h, 0.8 w)`, centred across, its top 5% of the height down. */
export function oneLookClearBox(size: { width: number; height: number }): OneLookRect {
  const side = Math.max(0, Math.min(size.height * ONE_LOOK_CLEAR.boxHeightShare, size.width * ONE_LOOK_CLEAR.boxWidthCap));
  return { x: (size.width - side) / 2, y: size.height * ONE_LOOK_CLEAR.topShare, width: side, height: side };
}

/** Whether a Clear look photo draws gray and dark: its thing is off, or
 * the wrist is down. There is no fill whose colour could keep it bright. */
export function oneLookClearDimmed(active: boolean, aod: boolean): boolean {
  return !active || aod;
}

/** The Clear look's lit colour: the tile's (its state's colour first, as
 * the palette resolves it), else One Look's amber. */
export function oneLookClearColour(palette: Pick<OneLookPalette, "hue">): readonly [number, number, number] {
  return palette.hue ?? ONE_LOOK_AMBER;
}

/** The colour of the Clear look's glow: a light's tint colour when the
 * light's colour is known (`tint.ts`), else the Clear look's lit colour. */
export function oneLookClearGlowColour(palette: Pick<OneLookPalette, "hue">, tint: OneLookTint | undefined): readonly [number, number, number] {
  return tint?.known === true ? oneLookTintRGB8(tint.colour) : oneLookClearColour(palette);
}

/** The Clear look's glow behind a lit photo in a tile of `size` around the
 * photo box `box`, as CSS: a radial of `colour` from 0.42 alpha at the
 * box's centre through 0.18 at 45% of the radius to 0 at the radius, 70% of
 * the tile's width, every alpha scaled by `level` (a light's `k`, else 1),
 * screen blended so it reads as light, not paint. */
export function oneLookClearGlowCss(size: { width: number }, box: OneLookRect, colour: readonly [number, number, number], level: number, s: number): string {
  const c = ONE_LOOK_CLEAR;
  const k = Math.min(1, Math.max(0, level));
  return `background:radial-gradient(circle ${r2(size.width * c.glowRadiusShare * s)}px at ${r2((box.x + box.width / 2) * s)}px ${r2((box.y + box.height / 2) * s)}px, ${rgba(colour, c.glowCentreOpacity * k)} 0%, ${rgba(colour, c.glowMidOpacity * k)} ${c.glowMidStop * 100}%, ${rgba(colour, 0)} 100%);mix-blend-mode:screen`;
}

/** Whether a tile draws its photo in the Clear look: it asks for it
 * (`iconPhotoLook` "clear") and its photo draws (in, and nothing fills the
 * tile). */
export function oneLookDrawsClear(model: Pick<OneLookPreviewModel, "picture" | "cutout">): boolean {
  return model.picture === "none" && model.cutout?.clear === true;
}

/** A tile's Bar settings as One Look reads them (`OneLookBar`). */
export interface OneLookBarStyle {
  fill: boolean;
  white: boolean;
  border: boolean;
  shadow: boolean;
}

// ── the old look's sizes (`takeOldSizes`) ────────────────────────────────

/** `GridItemConfig.tileTextScale`: how much the iPhone grows a tile's text
 * and icon with its grid unit, held to 1.5 in the watch's look (1 on every
 * watch, whose units are under 18). */
export function oneLookTileTextScale(unit: number, look: PageLook): number {
  const scale = Math.max(1, unit / 18);
  return look === "iphone" ? scale : Math.min(1.5, scale);
}

/** `TileHomeLayout.nameSize`: the most the iPhone look draws a Home sized
 * tile's name at, given no size of its own. */
export const ONE_LOOK_HOME_NAME_SIZE = 15;

/** `TileHomeLayout.qualifies`: a tile the iPhone look lays out as a Home
 * app tile, 6 columns or wider and not a header, spacer, camera, camera
 * group, point control or music hub. */
function homeLayoutQualifies(tile: WatchPageTile, colSpan: number, look: PageLook): boolean {
  if (look !== "iphone" || colSpan < 6) return false;
  const id = tileEntityId(tile);
  const kind = tileKind(id);
  if (kind === "divider" || kind === "spacer") return false;
  return !["camera.", "multicam.", "point_control.", "music_hub."].some((p) => id.startsWith(p));
}

function storedNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * The old look's name size, icon size and icon offset for a tile in its
 * cell on a grid of `unit` (`effectiveLabelFontSize`, `baseIconSize` and
 * `dynamicIconVerticalOffset`, each with the page's look): what One Look
 * draws a tile's name at before it shrinks to fit, and where and how big
 * it puts the glyph.
 */
export function oneLookOldSizes(
  tile: WatchPageTile,
  cell: { width: number; height: number },
  colSpan: number,
  unit: number,
  look: PageLook,
): { nameSize: number; iconSize: number; iconOffset: number } {
  const scale = oneLookTileTextScale(unit, look);
  const nameOverride = storedNumber(tile.labelFontSizeOverride);
  let nameSize: number;
  if (nameOverride !== undefined) nameSize = nameOverride * scale;
  else {
    const auto = watchAutoLabelFontSize(cell.width) * scale;
    nameSize = homeLayoutQualifies(tile, colSpan, look) ? Math.min(auto, ONE_LOOK_HOME_NAME_SIZE) : auto;
  }
  const room = cell.height >= 35 && tileShowsLabel(tile);
  const heightShare = look === "iphone" ? (room ? 0.42 : 0.6) : (room ? 0.54 : 0.68);
  const fit = Math.min(room ? cell.width * 0.64 : cell.width * 0.7, cell.height * heightShare);
  const iconOverride = storedNumber(tile.iconSizeOverride);
  const iconSize = iconOverride !== undefined
    ? Math.max(8, Math.min(look === "iphone" ? iconOverride * scale : iconOverride, fit))
    : Math.max(10, Math.min(fit, (room ? 36 : 40) * (look === "iphone" ? scale : 1)));
  return { nameSize, iconSize, iconOffset: watchIconVerticalOffset(tile, cell.height) };
}

/** `GridItemConfig.dynamicBadgeFontSize`, the property: the old look's own
 * state size on its fixed 21 point unit, which State Size is a factor on. */
function staticBadgeSize(colSpan: number, rowSpan: number): number {
  const side = Math.min(colSpan * 21 + (colSpan - 1) * 2, rowSpan * 21 + (rowSpan - 1) * 2);
  return side < 25 ? 4 : side < 35 ? 5 : side < 50 ? 7 : 9;
}

const NAME_WEIGHTS: ReadonlySet<string> = new Set(["regular", "medium", "semibold", "bold"]);

/** The status icon size the old look drew with no size of its own
 * (`defaultStatusIconSize`), which Status Icon Size is a factor on. */
const DEFAULT_STATUS_ICON_SIZE = 15;

/** A tile's text and icon settings as One Look reads them
 * (`OneLookTileStyle(item)`), with the old look's sizes in. */
export function oneLookTileStyle(
  tile: WatchPageTile,
  colSpan: number,
  rowSpan: number,
  old: { nameSize: number; iconSize: number; iconOffset: number },
): OneLookTileStyle {
  const weight = typeof tile.labelFontWeight === "string" && NAME_WEIGHTS.has(tile.labelFontWeight)
    ? tile.labelFontWeight as OneLookTextWeight : undefined;
  const design = tile.labelFontDesign === "rounded" || tile.labelFontDesign === "monospaced" || tile.labelFontDesign === "serif"
    ? tile.labelFontDesign : "standard";
  const colour = watchTileLabelColor(tile);
  return {
    nameSize: old.nameSize,
    iconSize: old.iconSize,
    iconOffset: old.iconOffset,
    stateScale: oneLookStyleFactor(storedNumber(tile.badgeFontSizeOverride), staticBadgeSize(colSpan, rowSpan), ONE_LOOK_STATE_SCALE_RANGE),
    accessoryScale: oneLookStyleFactor(storedNumber(tile.statusIconSizeOverride), DEFAULT_STATUS_ICON_SIZE, ONE_LOOK_ACCESSORY_SCALE_RANGE),
    ...(weight === undefined ? {} : { nameWeight: weight }),
    nameDesign: design,
    ...(colour === undefined ? {} : { nameColour: colour }),
    nameShadow: tile.labelShadow !== false,
    stateShadow: tile.statusTextShadow !== false,
    glyphShadow: tile.iconShadow === true,
    statePill: watchValueLabelStyle(tile) === "Pill",
    glow: oneLookGlyphGlowOf(tile.iconGlow),
  };
}

/** The kinds whose Bar colour setting draws (`stateSupportsBars`). */
const BAR_KINDS: ReadonlySet<string> = new Set(["light", "cover", "valve", "fan", "media_player"]);

/** A tile's Bar settings (`OneLookBar(item)`): Fill fills the tile from the
 * left, White draws the bar white (on a kind with a bar), with the outline
 * and the shadow. */
export function oneLookBarStyle(tile: WatchPageTile): OneLookBarStyle {
  return {
    fill: tile.stateBarStyle === "Fill",
    white: BAR_KINDS.has(tileKind(tileEntityId(tile))) && tile.stateBarColorStyle === "White",
    border: tile.stateBarBorder === true,
    shadow: tile.stateBarShadow === true,
  };
}

// ── measuring ────────────────────────────────────────────────────────────

const measurers = new WeakMap<IconProvider, Map<OneLookDevice, TextMeasurer>>();
const bareMeasurers = new Map<OneLookDevice, TextMeasurer>();

/** One measurer per device and symbol provider, so its widths stay cached
 * across every tile and picture. */
function measurerFor(device: OneLookDevice, icons: IconProvider | undefined): TextMeasurer {
  if (icons === undefined) {
    let m = bareMeasurers.get(device);
    if (m === undefined) bareMeasurers.set(device, (m = oneLookMeasurer(device)));
    return m;
  }
  let byDevice = measurers.get(icons);
  if (byDevice === undefined) measurers.set(icons, (byDevice = new Map()));
  let m = byDevice.get(device);
  if (m === undefined) byDevice.set(device, (m = oneLookMeasurer(device, { icons, known: (n) => knownSymbol(icons, n) })));
  return m;
}

// ── the model ────────────────────────────────────────────────────────────

/** An HTTP action that cannot fire: the iPhone's library does not have it,
 * or has it with no URL yet. Unknown (no catalog read) is fine. */
function httpNeedsAttention(tile: WatchPageTile, catalog: WatchCatalog | undefined): boolean {
  const target = watchLibraryTarget(tileEntityId(tile));
  if (target?.kind !== "httpAction" || catalog === undefined) return false;
  if (catalog.noPhone === true && catalog.httpLibrary !== "held") return false;
  const entry = findWatchCatalogEntry(catalog, "httpAction", target.id);
  return entry === undefined || entry.needsSetup;
}

/** A symbol's crossed out form for an unavailable tile, as `.slash` adds
 * it to the variant (`lightbulb.slash`, `lightbulb.slash.fill`), when the
 * provider draws one; else the symbol as it is. */
function slashedSymbol(icons: IconProvider | undefined, name: string): string {
  const filled = name.endsWith(".fill");
  const base = filled ? name.slice(0, -5) : name;
  const tries = filled ? [`${base}.slash.fill`, `${base}.slash`] : [`${base}.slash`];
  return tries.find((t) => icons?.render(t, 1, "#FFFFFF") !== undefined) ?? name;
}

/** The series a sensor chart draws in a picture, which has no history: a
 * gentle made up rise, oldest first. */
const PREVIEW_CHART: readonly number[] = [0.28, 0.42, 0.36, 0.62, 0.54, 0.74, 0.7];

function entityOf(states: Readonly<Record<string, HassEntityState>> | undefined, id: string): HassEntityState | undefined {
  return states !== undefined && Object.hasOwn(states, id) ? states[id] : undefined;
}

function customLabel(tile: WatchPageTile): string | undefined {
  return typeof tile.customLabel === "string" ? tile.customLabel : undefined;
}

/** A label of its own, trimmed, or undefined when it has none. */
function ownLabel(tile: WatchPageTile): string | undefined {
  const own = customLabel(tile)?.trim() ?? "";
  return own === "" ? undefined : own;
}

/** The kind's symbol and whether it takes its fill variant, before the
 * unavailable slash, as each of the app's kinds hands it to One Look. */
function symbolOf(f: OneLookTileFaceInput, kind: string, ks: OneLookKindState, entity: HassEntityState | undefined): { base: string; drawn: string } {
  const { tile, look } = f;
  const icons = f.input.icons;
  const own = typeof tile.icon === "string" ? tile.icon.trim() : undefined;
  const fill = (name: string) => (name === "" ? "" : filledSymbol(icons, name, true));
  if (ks.placeholder) {
    // Before its entity loads: its own icon or a question mark, filled. A
    // picture with no states at all says nothing about any entity, so it
    // keeps the kind's own symbol rather than a question mark on every tile.
    const base = own ?? (f.input.states === undefined ? (watchTileSymbol(tile, undefined) ?? "questionmark.circle") : "questionmark.circle");
    return { base, drawn: fill(base) };
  }
  if (kind === "camera" || kind === "multicam") {
    if (tile.cameraDisplayMode === "preview") return { base: "", drawn: "" };
    const base = kind === "multicam" ? (own ?? "rectangle.split.2x2") : own === "" ? "" : (own ?? "video");
    return { base, drawn: kind === "multicam" ? fill(base) : base };
  }
  if (kind === "music_hub") {
    const base = own === "" ? "" : (own ?? "music.note.house");
    return { base, drawn: fill(base) };
  }
  if (kind === "point_control") {
    const base = own === "" ? "" : (own ?? "hand.point.up.left");
    return { base, drawn: fill(base) };
  }
  if (kind === "macro") {
    const base = own === "" ? "" : (own ?? "link");
    return { base, drawn: fill(base) };
  }
  if (look !== undefined) {
    // The old look's symbol for the kind, filled by One Look's own rule
    // (the kind's variant, none under a state's icon), not the old look's.
    const base = look.symbol ?? "";
    return { base, drawn: base === "" ? "" : filledSymbol(icons, base, ks.filled) };
  }
  const stateIcon = stateEntry(tile.stateIcons, ks.stateKey);
  if (stateIcon !== undefined) return { base: stateIcon, drawn: stateIcon };
  if (own === "") return { base: "", drawn: "" };
  const base = watchTileSymbol(tile, entity) ?? "";
  if (base === "") return { base, drawn: base };
  return { base, drawn: ks.filled ? fill(base) : own !== undefined ? base : unfilledSymbol(icons, base) };
}

/** The name a tile draws, as each of the app's kinds names its model:
 * its own label (an empty one draws none), else the entity's name; a
 * placeholder's object id. A music hub, a point control, a macro and an
 * inbox name themselves when their label is empty too: "Music", "Point
 * Control", "Macro" and "Inbox" (the removed tile's, whatever the topic). */
function nameOf(f: OneLookTileFaceInput, kind: string, ks: OneLookKindState): string {
  const { tile, input } = f;
  const own = ownLabel(tile);
  if (kind === "music_hub") return own ?? "Music";
  if (kind === "point_control") return customLabel(tile) || "Point Control";
  if (kind === "macro") return own ?? "Macro";
  if (kind === "webhook_inbox") return own ?? "Inbox";
  if (customLabel(tile) === "") return "";
  if (ks.placeholder && input.states !== undefined) return own ?? (tileTarget(tileEntityId(tile)) || "Loading");
  return watchPreviewTileLabel(tile, input);
}

/** The state line laid out, compared by what it says. */
function sameLine(a: StateLine, b: StateLine): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * A tile resolved as One Look draws it: its state from `state.ts`, its
 * symbol and name, its picture, its style with the old look's sizes, the
 * layout at its drawn size and the palette. Undefined for a kind that keeps
 * its own face.
 */
export function oneLookPreviewModel(f: OneLookTileFaceInput): OneLookPreviewModel | undefined {
  const { tile, input, device } = f;
  const states = input.states;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const ks = oneLookTileState(tile, states, Date.now(), { httpNeedsAttention: httpNeedsAttention(tile, input.catalog) });
  if (ks === undefined) return undefined;
  const entity = entityOf(states, entityId);
  const pageLook: PageLook = device === "phone" && phoneDrawsIphoneLook(input.phone) ? "iphone" : "watch";
  // The spans from the cell, so a tile drawn at a size of its own (a resize
  // being dragged) is read at that size.
  const unit = f.unit > 0 ? f.unit : f.cell.width;
  const colSpan = Math.max(1, Math.round((f.cell.width + 2) / (unit + 2)));
  const rowSpan = Math.max(1, Math.round((f.cell.height + 2) / (unit + 2)));

  const { base, drawn } = symbolOf(f, kind, ks, entity);
  const icon = drawn === "" ? "" : ks.isUnavailable ? slashedSymbol(input.icons, drawn) : drawn;
  // The tile's icon photo wins over a person's photo; neither on a
  // placeholder.
  const cutout = ks.placeholder ? undefined : oneLookCutoutOf(tile, input);
  const photo = ks.placeholder || cutout !== undefined ? undefined : f.look?.photo;

  let picture: OneLookPreviewModel["picture"] = "none";
  let pictureUrl: string | undefined;
  if ((kind === "camera" || kind === "multicam") && tile.cameraDisplayMode === "preview") picture = "camera";
  else if (!ks.placeholder && f.look?.art !== undefined) {
    picture = "artwork";
    pictureUrl = f.look.art;
  } else if (device === "phone" && kind === "media_player" && !isWatchTvRemote(entityId, states) && watchMediaArtwork(tile)) {
    const art = pictureOf(states, entityId);
    if (art !== undefined) {
      picture = "artwork";
      pictureUrl = art;
    }
  }

  // An HTTP action showing its reply names itself by Show Name in place of
  // the tile's showLabel, as its model does.
  const httpValue = kind === "http_action" && tile.httpResponseDisplay === "tileValue";
  const showsName = (httpValue ? tile.httpTileValueShowName !== false : tileShowsLabel(tile)) && picture !== "camera";
  const name = showsName ? nameOf(f, kind, ks) : "";
  const chart = device === "phone" && !ks.placeholder && (kind === "sensor" || kind === "binary_sensor")
    && watchSensorChart(tile) !== undefined && rowSpan >= 4 ? PREVIEW_CHART : undefined;
  const isChart = chart !== undefined;

  const style = oneLookTileStyle(tile, colSpan, rowSpan, oneLookOldSizes(tile, f.cell, colSpan, unit, pageLook));
  const bar = oneLookBarStyle(tile);
  const measurer = f.measurer ?? measurerFor(device, input.icons);
  const centred = oneLookCentredGlyph(device) && picture === "none" && !isChart;
  const reservesBar = ONE_LOOK_CHOICES.brightnessBar && !bar.fill
    && (ks.role.kind === "light" || ks.keepsBarRoom || ks.barLevel !== undefined);
  const init: OneLookLayoutInputInit = {
    device,
    size: { width: f.width, height: f.height },
    colSpan,
    rowSpan,
    name,
    state: ks.state,
    hasIcon: base !== "" || photo !== undefined || cutout !== undefined,
    accessory: ks.accessory,
    isChart,
    ...(ks.bigValue === undefined ? {} : { bigValue: ks.bigValue }),
    centred,
    topBar: centred && reservesBar,
    glyphAspect: centred ? glyphAspectOf(measurer, base) : 1,
    glyphExtent: centred ? glyphExtentOf(measurer, base) : 1.25,
    glyphIsPhoto: centred && photo !== undefined,
    style,
  };
  let layout = resolveOneLookLayout(init, measurer);
  // A wide weather tile's big value that found no room: laid out again with
  // the state that stands in for it.
  if (ks.bigValue !== undefined && layout.bigValue === undefined && ks.stateWithoutBig !== undefined && !sameLine(ks.stateWithoutBig, ks.state)) {
    const again: OneLookLayoutInputInit = { ...init, state: ks.stateWithoutBig };
    delete (again as { bigValue?: unknown }).bigValue;
    layout = resolveOneLookLayout(again, measurer);
  }

  const stateHue = ks.placeholder ? undefined : stateEntry(tile.stateColors, ks.stateKey);
  const fillLevel = oneLookFillLevel(ks, bar.fill);
  // The placeholder is not styled by the tile (`OneLookTileModel.placeholder`):
  // no colour, and the palette's own dim when off and colour opacity.
  const palette = oneLookPalette({
    role: picture === "none" ? ks.role : { kind: "camera" },
    ...(ks.placeholder ? {} : { hue: tile.color }),
    ...(stateHue === undefined ? {} : { stateHue }),
    unavailable: ks.isUnavailable,
    calm: ks.isCalm,
    dimWhenOff: ks.placeholder || tile.dimWhenOff !== false,
    colorOpacity: ks.placeholder ? 1 : watchTileColorOpacity(tile),
    brightnessFill: bar.fill,
    ...(fillLevel === undefined ? {} : { fillLevel }),
  });
  const barValue = oneLookBarValue(ks);
  const arrange = oneLookArrangeLayout(layout, normalizeTileArrange(tile.arrange));
  // Only a light is tinted, from its live colour and brightness.
  const tint = kind === "light" && !ks.placeholder ? oneLookTintOf(entity?.attributes) : undefined;
  return {
    device, pageLook, kind: ks, icon, baseIcon: base,
    ...(photo === undefined ? {} : { photo }),
    ...(cutout === undefined ? {} : { cutout }),
    picture, ...(pictureUrl === undefined ? {} : { pictureUrl }),
    name, ...(chart === undefined ? {} : { chart }),
    style, bar, ...(barValue === undefined ? {} : { barValue }),
    decorated: !ks.placeholder && picture !== "camera",
    colSpan, rowSpan, layout, palette,
    ...(arrange === undefined ? {} : { arrange }),
    ...(tint === undefined ? {} : { tint }),
  };
}

// ── drawing ──────────────────────────────────────────────────────────────

const r2 = (v: number) => Math.round(v * 100) / 100;

function rectCss(r: OneLookRect, s: number): string {
  return `left:${r2(r.x * s)}px;top:${r2(r.y * s)}px;width:${r2(r.width * s)}px;height:${r2(r.height * s)}px`;
}

/** An ink as a hex and an opacity, for the symbol provider, which paints
 * in a hex only. */
function inkParts(ink: OneLookInk): { hex: string; opacity: number } {
  return { hex: oneLookHex(ink.rgb), opacity: ink.opacity };
}

/**
 * An SF Symbol as One Look's `Glyph` draws it: the symbol's image (its ink
 * and Apple's margin round it, `oneLookSymbolImage`) fitted into the middle
 * 86% of a `box` point square at `at`, the ink centred. A symbol the
 * provider does not know draws nothing; with no provider at all a faint dot
 * shows where it goes.
 */
function glyphMark(
  icons: IconProvider | undefined,
  symbol: string,
  box: number,
  at: { x: number; y: number },
  ink: OneLookInk,
  s: number,
  shadow: boolean,
): TemplateResult | typeof nothing {
  if (symbol === "" || !(box > 0)) return nothing;
  const place = rectCss({ x: at.x, y: at.y, width: box, height: box }, s);
  const { hex, opacity } = inkParts(ink);
  const fade = opacity >= 1 ? "" : `;opacity:${Math.round(opacity * 1000) / 1000}`;
  const lift = shadow ? `;filter:drop-shadow(0 ${r2(s)}px ${r2(4 * s)}px rgba(0, 0, 0, 0.5))` : "";
  const name = knownSymbol(icons, symbol);
  const image = oneLookSymbolImage(icons, name);
  if (image === undefined) {
    if (icons !== undefined) return nothing;
    const d = r2(box * ONE_LOOK_GLYPH_INK_SHARE * 0.4 * s);
    return html`<span class="ol-glyph" data-symbol=${symbol} style=${`${place}${fade}`}><span class="ol-dot-glyph" style=${`width:${d}px;height:${d}px;background:${hex}`}></span></span>`;
  }
  const k = (box * ONE_LOOK_GLYPH_INK_SHARE) / Math.max(image.width, image.height);
  const side = r2(Math.max(image.inkWidth, image.inkHeight) * k * s);
  return html`<span class="ol-glyph" data-symbol=${symbol} style=${`${place}${fade}${lift}`}>${icons?.render(name, side, hex) ?? nothing}</span>`;
}

/** The soft shadow under text on a coloured fill, the iPhone's only. */
function textShadow(on: boolean, s: number): string {
  return on ? `;text-shadow:0 ${r2(0.5 * s)}px ${r2(1.5 * s)}px rgba(0, 0, 0, 0.25)` : "";
}

/** A state line: the number in bold rounded with its unit at 84% and the
 * tail after it, or a word (the amber dot before it when it asks). The
 * figure is tracked as the apps track it (`nameTracking`, round four section
 * 15.2), as the fitter measured it. */
function stateLine(state: StateFit, palette: OneLookPalette, device: OneLookDevice, s: number): TemplateResult {
  const family = ONE_LOOK_FONT_FAMILIES[device];
  const ink = oneLookInkCss(palette.ink);
  const ink2 = oneLookInkCss(palette.ink2);
  const p = state.parts;
  if (p.kind === "number") {
    return html`<span class="ol-line"><span class="ol-figure" style=${`font:700 ${r2(state.size * s)}px/1 ${family.rounded};letter-spacing:${oneLookMetrics(device).nameTracking}em;color:${ink}`}>${p.figure}</span>${p.unit === undefined ? nothing
      : html`<span class="ol-unit" style=${`font:600 ${r2(state.unitSize * s)}px/1 ${family.rounded};color:${ink};opacity:${ONE_LOOK_UNIT_OPACITY}`}>${p.unit}</span>`}${p.tail === undefined ? nothing
      : html`<span class="ol-tail" style=${`font:400 ${r2(state.tailSize * s)}px/1 ${family.standard};color:${ink2}`}>${` ${p.tail}`}</span>`}</span>`;
  }
  return html`<span class="ol-line ol-word" style=${`font:400 ${r2(state.size * s)}px/1 ${family.standard};color:${ink2}`}>${p.amber
    ? html`<span class="ol-amber" style=${`background:${oneLookHex(ONE_LOOK_AMBER_DOT)}`}></span>` : nothing}${p.word}</span>`;
}

function nameFont(model: OneLookPreviewModel, centred: boolean, s: number, scale = 1): string {
  const layout = model.layout;
  const weight = model.style.nameWeight ?? (centred ? "medium" : "semibold");
  const family = ONE_LOOK_FONT_FAMILIES[model.device][model.style.nameDesign];
  const colour = model.picture === "none" && model.style.nameColour !== undefined ? model.style.nameColour : oneLookInkCss(model.palette.ink);
  return `font:${oneLookCssWeight(weight)} ${r2(layout.name.size * scale * s)}px/${r2(layout.nameLineHeight * scale * s)}px ${family};color:${colour}`;
}

/** How the centred name's lines sit across its box for an arranged
 * alignment (the box's own rule centres them). */
const NAME_ALIGN_CSS = { leading: ";align-items:flex-start;text-align:left", center: "", trailing: ";align-items:flex-end;text-align:right" } as const;

/** The name and the state: in the centred layout the state alone in its
 * box top left and the name lines centred at the bottom, each where the
 * tile's Arrangement puts it (`model.arrange`); in every other layout the
 * name lines then the state, top left at the text's origin. A hidden part
 * keeps its room, so the other stays where it was. */
function textLayer(model: OneLookPreviewModel, s: number, hidden?: TileHiddenParts): TemplateResult | typeof nothing {
  const { layout, palette, device, kind } = model;
  const shadows = palette.textShadow && device === "phone";
  const nameShadow = textShadow(shadows && model.style.nameShadow, s);
  const stateShadow = textShadow(shadows && model.style.stateShadow, s);
  const lines = layout.name.lines;
  if (layout.mode === "centred") {
    const arranged = model.arrange;
    const placedState = arranged?.state;
    const rect = placedState?.rect ?? layout.stateRect;
    const stateScale = placedState?.scale ?? 1;
    const state = layout.state !== undefined && rect !== undefined && !kind.stateHidden && hidden?.state !== true && placedState?.hidden !== true
      ? html`<span class="ol-state ${model.style.statePill ? "pill" : ""}" style=${`${rectCss(rect, s)}${model.style.statePill ? `;background:rgba(0, 0, 0, ${ONE_LOOK_PILL_OPACITY})` : ""}${stateShadow}`}>${stateLine(layout.state, palette, device, s * stateScale)}</span>`
      : nothing;
    const placedName = arranged?.name;
    const nameRect = placedName?.rect ?? { x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight };
    const nameScale = placedName?.scale ?? 1;
    const align = placedName === undefined ? "" : NAME_ALIGN_CSS[placedName.align];
    const name = lines.length === 0 || hidden?.name === true || placedName?.hidden === true ? nothing : html`<span class="ol-text centred" style=${`${rectCss(nameRect, s)}${align}`}>
      ${lines.map((line) => html`<span class="ol-name" style=${`height:${r2(layout.nameLineHeight * nameScale * s)}px;${nameFont(model, true, s, nameScale)}${nameShadow}`}>${line}</span>`)}
    </span>`;
    return html`${state}${name}`;
  }
  if (lines.length === 0 && layout.state === undefined) return nothing;
  const nameGone = hidden?.name === true ? ";visibility:hidden" : "";
  return html`<span class="ol-text" style=${rectCss({ x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight }, s)}>
    ${lines.map((line) => html`<span class="ol-name" style=${`height:${r2(layout.nameLineHeight * s)}px;${nameFont(model, false, s)}${nameShadow}${nameGone}`}>${line}</span>`)}
    ${layout.state === undefined ? nothing : html`<span class="ol-state-row" style=${`height:${r2(layout.stateLineHeight * s)}px${stateShadow}`}>${kind.stateHidden || hidden?.state === true ? nothing : stateLine(layout.state, palette, device, s)}</span>`}
  </span>`;
}

/** A weather tile's big value, right aligned in its box (disc layouts
 * only). */
function bigValueLayer(model: OneLookPreviewModel, s: number): TemplateResult | typeof nothing {
  const { layout, palette, device } = model;
  const big = layout.bigValue;
  const rect = layout.bigRect;
  if (big === undefined || rect === undefined) return nothing;
  const m = oneLookLayoutMetrics(layout, device);
  const family = ONE_LOOK_FONT_FAMILIES[device].rounded;
  const shadow = textShadow(palette.textShadow && device === "phone" && model.style.stateShadow, s);
  return html`<span class="ol-big" style=${`${rectCss(rect, s)}${shadow}`}>
    <span style=${`height:${r2(m.bigSize * 1.02 * s)}px;font:700 ${r2(m.bigSize * s)}px/${r2(m.bigSize * 1.02 * s)}px ${family};letter-spacing:-0.02em;color:${oneLookInkCss(palette.ink)}`}>${big.figure}</span>
    ${big.sub === undefined ? nothing : html`<span style=${`margin-top:${r2(m.bigSubGap * s)}px;font:600 ${r2(m.bigSubSize * s)}px/${r2(m.bigSubSize * 1.2 * s)}px ${family};color:${oneLookInkCss(palette.ink2)}`}>${big.sub}</span>`}
  </span>`;
}

/** The thin bar across the top, filled to a lit light's brightness or
 * another kind's level, over a faint track. */
function barLayer(model: OneLookPreviewModel, s: number): TemplateResult | typeof nothing {
  const rect = model.layout.barRect;
  const level = model.barValue;
  if (rect === undefined || level === undefined) return nothing;
  const fill = Math.max(rect.height, rect.width * Math.min(1, Math.max(0, level)));
  const colour = oneLookInkCss(oneLookBarColour(model.palette, model.bar.white), ONE_LOOK_BAR_FILL_OPACITY);
  const border = model.bar.border ? `;box-shadow:inset 0 0 0 ${r2(s)}px rgba(255, 255, 255, ${ONE_LOOK_BAR_BORDER_OPACITY})` : "";
  const shadow = model.bar.shadow ? `;filter:drop-shadow(0 ${r2(0.5 * s)}px ${r2(3 * s)}px rgba(0, 0, 0, 0.6))` : "";
  return html`<span class="ol-bar" style=${`${rectCss(rect, s)};background:rgba(255, 255, 255, ${ONE_LOOK_BAR_TRACK_OPACITY})${shadow}`}>
    <span class="ol-bar-fill" style=${`width:${r2(fill * s)}px;background:${colour}${border}`}></span>
  </span>`;
}

/**
 * Whether the thing in a tile's photo is on (photo tiles plan, "On for every
 * kind"; the apps' `OneLookCutout.isActive`): a light on or media playing
 * (the palette's `isLit`), and any other kind in an active state, that is
 * not calm and not unavailable (a cover open, opening or closing, a switch,
 * fan or input boolean on, a lock unlocked). A camera never is.
 */
export function oneLookCutoutActive(kind: Pick<OneLookKindState, "role" | "isCalm" | "isUnavailable">, palette: Pick<OneLookPalette, "isLit">): boolean {
  switch (kind.role.kind) {
    case "light":
    case "media":
      return palette.isLit;
    case "plain":
      return !kind.isCalm && !kind.isUnavailable;
    default:
      return false;
  }
}

/**
 * Whether the icon photo draws gray and dark: the wrist is down, a light is
 * off, or the tile is graphite (off with Dim, idle, unavailable, no colour)
 * while its thing is not on (`active`, `oneLookCutoutActive`). A switch, fan
 * or any other kind that keeps its colour keeps its photo bright; one with
 * no colour is bright while it is on. The apps' `OneLookCutout.isDimmed`
 * reads the same. `active` left out is the palette's `isLit`, which is the
 * rule for a light and for media.
 */
export function oneLookCutoutDimmed(palette: OneLookPalette, light: boolean, active: boolean = palette.isLit): boolean {
  return palette.aod || (!active && (light || palette.surface !== "coloured"));
}

/** Whether an icon photo is drawn bright and lit, which is when its On
 * photo takes its place, or else its light (Light Look) is drawn: its thing
 * is on (`active`, the palette's `isLit` when left out) and the photo is not
 * dimmed. */
export function oneLookCutoutGlows(palette: OneLookPalette, light: boolean, active: boolean = palette.isLit): boolean {
  return active && !oneLookCutoutDimmed(palette, light, active);
}

/** An alpha as CSS writes it, to four places. */
const a4 = (v: number) => Math.round(v * 10000) / 10000;

/** A colour at an alpha, as CSS. */
function rgba(c: readonly [number, number, number], alpha: number): string {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a4(alpha)})`;
}

/** One layer of the light: a span of the light's colour at `opacity`,
 * masked by its mask image (stretched over the span by the class), screen
 * blended. */
function lightSpan(kind: "aura" | "beam" | "emit", rect: OneLookRect, url: string, colour: readonly [number, number, number], opacity: number, s: number): TemplateResult {
  const mask = `url("${url.replace(/["\\]/g, (ch) => `\\${ch}`)}")`;
  return html`<span class="ol-light ol-light-${kind}" style=${`${rectCss(rect, s)};background:${rgba(colour, 1)};opacity:${a4(opacity)};-webkit-mask-image:${mask};mask-image:${mask}`}></span>`;
}

/**
 * A light's On photo, tinted (photo tiles plan, "On photo tint"), in the
 * photo rect whose CSS is `place` (position, size, corners): the Off photo
 * with no filter, the On photo over it at opacity `k`, then the tint colour
 * `C` multiply blended through the tint mask at opacity `k`. `shadow` (a
 * CSS filter) goes on the lowest photo drawn only, so it is cast once.
 *
 * Two layers that would change nothing are left out: at full brightness
 * (`k` 1) the On photo covers the Off one (and, drawn over it, would
 * thicken its soft edges), and a white `C` multiplies by 1. So a white
 * light at full brightness draws exactly as its On photo did before the
 * tint. With no mask yet, the tint layer waits for it.
 */
export function oneLookTintedOn(cutout: Pick<OneLookCutout, "url" | "on" | "onMask">, tint: OneLookTint, place: string, clear: boolean, shadow: string): TemplateResult {
  const k = Math.min(1, Math.max(0, tint.level));
  const full = k >= 1;
  const shadowCss = shadow === "" ? "" : `;filter:${shadow}`;
  const img = (src: string, style: string) => clear
    ? html`<img class="ol-cutout clear" alt="" src=${src} style=${style} />`
    : html`<img class="ol-cutout" alt="" src=${src} style=${style} />`;
  const off = full ? nothing : img(cutout.url, `${place}${shadowCss}`);
  const on = img(cutout.on ?? cutout.url, `${place}${full ? shadowCss : `;opacity:${a4(k)}`}`);
  if (cutout.onMask === undefined || oneLookTintIsWhite(tint.colour)) return html`${off}${on}`;
  const mask = `url("${cutout.onMask.replace(/["\\]/g, (ch) => `\\${ch}`)}")`;
  const tinted = html`<span class="ol-tint" style=${`${place};background:${rgba(oneLookTintRGB8(tint.colour), 1)};opacity:${a4(k)};-webkit-mask-image:${mask};mask-image:${mask}`}></span>`;
  return html`${off}${on}${tinted}`;
}

/**
 * A tile's icon photo in the glyph's place (photo tiles plan, "Drawing"):
 * no disc fill, the photo fitted in a box 1.35 times the disc on its centre,
 * its corners rounded by 22% of the box. Lit (and not wrist down): the pearl
 * halo behind it as a glyph has it, the pearl disc's white glow in the disc
 * layouts. Not lit, and wrist down: no halo. Grayscale 85% and brightness
 * 62% when `oneLookCutoutDimmed` says so. Lit and bright
 * (`oneLookCutoutGlows`), a photo that carries an On photo has it drawn in
 * its place, the halo as for any photo (a light's tinted to its colour and
 * brightness, `oneLookTintedOn`); else a photo with a look (Light
 * Look) has the aura and the beam behind it in the pearl halo's place and
 * the emission over it, in the light's colour (`glow.ts`). The real photo
 * wins over the recipe. The tile keeps its lit fill either way.
 */
function cutoutLayer(model: OneLookPreviewModel, layout: OneLookLayout, cutout: OneLookCutout, s: number): TemplateResult {
  const { palette, device } = model;
  const rect = layout.discRect;
  const lit = palette.isLit && !palette.aod;
  const { photo, radius } = oneLookCutoutRect(rect, cutout.aspect);
  const light = model.kind.role.kind === "light";
  const active = oneLookCutoutActive(model.kind, palette);
  const dimmed = oneLookCutoutDimmed(palette, light, active);
  const filter = dimmed ? `;filter:${ONE_LOOK_CUTOUT_OFF_FILTER}` : "";
  const glows = oneLookCutoutGlows(palette, light, active);
  const src = glows && cutout.on !== undefined ? cutout.on : cutout.url;
  const look = cutout.light;
  if (look !== undefined && glows && cutout.on === undefined) {
    const at = oneLookLightPlacement(photo, look, palette.brightness, oneLookGlowColour(palette.hue));
    const c = at.colour;
    return html`${lightSpan("aura", at.aura.rect, look.aura, c, at.aura.opacity, s)}${at.beam === undefined || look.beam === undefined ? nothing : lightSpan("beam", at.beam.rect, look.beam, c, at.beam.opacity, s)}<img class="ol-cutout" alt="" src=${cutout.url} style=${`${rectCss(photo, s)};border-radius:${r2(radius * s)}px`} />${lightSpan("emit", at.emit.rect, look.emit, c, at.emit.opacity, s)}`;
  }
  let back: TemplateResult | typeof nothing = nothing;
  if (lit && layout.drawsDisc) {
    if (palette.pearlGlow) back = html`<span class="ol-disc ol-cutout-glow" style=${`${rectCss(rect, s)};box-shadow:0 0 ${r2(oneLookMetrics(device).pearlGlow * s)}px rgba(255, 255, 255, 0.5)`}></span>`;
  } else if (lit) {
    const halo = oneLookGlyphHalo(palette, { centred: oneLookCentredGlyph(device), picture: false, hasIcon: true }, model.style.glow);
    if (halo !== undefined) {
      const d = layout.glyphSize * halo.share;
      const [r, g, b] = halo.rgb;
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      back = html`<span class="ol-halo" style=${`${rectCss({ x: cx - d / 2, y: cy - d / 2, width: d, height: d }, s)};background:radial-gradient(circle closest-side, rgba(${r}, ${g}, ${b}, ${Math.round(halo.opacity * 10000) / 10000}) 0%, rgba(${r}, ${g}, ${b}, 0) 100%)`}></span>`;
    }
  }
  const place = `${rectCss(photo, s)};border-radius:${r2(radius * s)}px`;
  // A light's On photo follows the light's colour and brightness.
  if (glows && cutout.on !== undefined && model.tint !== undefined) return html`${back}${oneLookTintedOn(cutout, model.tint, place, false, "")}`;
  return html`${back}<img class="ol-cutout" alt="" src=${src} style=${`${place}${filter}`} />`;
}

/** A state line as plain words, as the apps speak it: a number with its
 * unit and its tail, or a word; undefined for none. */
function stateWords(line: StateLine): string | undefined {
  if (line.kind === "none") return undefined;
  if (line.kind === "word") return line.word === "" ? undefined : line.word;
  const unit = line.unit === undefined ? "" : `${line.unitSpaced === true ? " " : ""}${line.unit}`;
  return `${line.figure}${unit}${line.tail === undefined ? "" : ` ${line.tail}`}`;
}

/** The size `text` draws at to fit `width`: its own, shrunk as far as the
 * Clear look's minimum scale, past which the line truncates. */
function clearFitSize(measurer: TextMeasurer, text: string, size: number, weight: OneLookTextWeight, design: OneLookTextDesign, tracking: number, width: number): number {
  const measured = measureDesign(measurer, text, size, weight, design, tracking);
  if (!(measured > width) || !(measured > 0)) return size;
  return size * Math.max(ONE_LOOK_CLEAR.textMinimumScale, width / measured);
}

/**
 * The photo's Clear look (photo tiles plan, "Clear look"; the apps'
 * `OneLookPhotoClear`), in place of the disc, the bar, the accessory, the
 * text and the big value: the photo fitted in its box near the top (no
 * rounding), with a soft screen blended glow behind it while lit (a light's
 * tint colour when its colour is known, else the tile's, scaled by a
 * light's level; `oneLookClearGlowCss`), and the name and state centred
 * under it in the room left, each on one line, shrinking to 70% before
 * truncating. Lit (its thing on, not wrist down): the state in the glow's
 * colour (a light's own when known, else the tile's), the On photo in the photo's place (a light's tinted,
 * `oneLookTintedOn`), else the Light Look's layers as on any tile. Not lit:
 * the Off filter and the grey state.
 */
function clearLayer(model: OneLookPreviewModel, f: OneLookTileFaceInput, cutout: OneLookCutout): TemplateResult {
  const { palette, device, layout, kind, style } = model;
  const { s, hidden } = f;
  const size = layout.size;
  const box = oneLookClearBox(size);
  const active = oneLookCutoutActive(kind, palette);
  const dimmed = oneLookClearDimmed(active, palette.aod);
  const lit = active && !dimmed;
  const colour = oneLookClearColour(palette);
  let picture: TemplateResult | typeof nothing = nothing;
  if (hidden?.glyph !== true) {
    const photo = fittedPhoto(box, cutout.aspect);
    const tint = model.tint;
    const glow = lit
      ? html`<span class="ol-layer ol-clear-glow" style=${oneLookClearGlowCss(size, box, oneLookClearGlowColour(palette, tint), tint?.level ?? 1, s)}></span>`
      : nothing;
    const shadow = style.glyphShadow ? `drop-shadow(0 ${r2(s)}px ${r2(4 * s)}px rgba(0, 0, 0, 0.5))` : "";
    const filters = [dimmed ? ONE_LOOK_CUTOUT_OFF_FILTER : "", shadow].filter((v) => v !== "");
    const filter = filters.length === 0 ? "" : `;filter:${filters.join(" ")}`;
    const look = cutout.light;
    if (lit && cutout.on !== undefined && tint !== undefined) {
      // A light's On photo follows the light's colour and brightness.
      picture = html`${glow}${oneLookTintedOn(cutout, tint, rectCss(photo, s), true, shadow)}`;
    } else if (look !== undefined && lit && cutout.on === undefined) {
      const at = oneLookLightPlacement(photo, look, palette.brightness, oneLookGlowColour(palette.hue));
      const c = at.colour;
      picture = html`${glow}${lightSpan("aura", at.aura.rect, look.aura, c, at.aura.opacity, s)}${at.beam === undefined || look.beam === undefined ? nothing : lightSpan("beam", at.beam.rect, look.beam, c, at.beam.opacity, s)}<img class="ol-cutout clear" alt="" src=${cutout.url} style=${`${rectCss(photo, s)}${filter}`} />${lightSpan("emit", at.emit.rect, look.emit, c, at.emit.opacity, s)}`;
    } else {
      const src = lit && cutout.on !== undefined ? cutout.on : cutout.url;
      picture = html`${glow}<img class="ol-cutout clear" alt="" src=${src} style=${`${rectCss(photo, s)}${filter}`} />`;
    }
  }

  const metrics = oneLookLayoutMetrics(layout, device);
  const measurer = f.measurer ?? measurerFor(device, f.input.icons);
  const width = Math.max(0, size.width - 2 * layout.insetH);
  const nameSize = layout.name.lines.length === 0 ? metrics.nameSize : layout.name.size;
  const family = ONE_LOOK_FONT_FAMILIES[device];
  const name = model.name !== "" && hidden?.name !== true ? model.name : undefined;
  const state = kind.stateHidden || hidden?.state === true ? undefined : stateWords(oneLookStateFor(kind, false));
  const nameWeight = style.nameWeight ?? "semibold";
  const lines: TemplateResult[] = [];
  if (name !== undefined) {
    const at = clearFitSize(measurer, name, nameSize, nameWeight, style.nameDesign, metrics.nameTracking, width);
    const ink = style.nameColour ?? oneLookInkCss(palette.ink);
    lines.push(html`<span class="ol-clear-name" style=${`font:${oneLookCssWeight(nameWeight)} ${r2(at * s)}px/${r2(at * 1.2 * s)}px ${family[style.nameDesign]};letter-spacing:${metrics.nameTracking}em;color:${ink}`}>${name}</span>`);
  }
  if (state !== undefined) {
    const own = nameSize * ONE_LOOK_CLEAR.stateShare;
    const at = clearFitSize(measurer, state, own, "semibold", "standard", 0, width);
    // Lit, in the same colour as the glow: a light's tint colour when its
    // colour is known, so the words and the lamp agree; else the tile's.
    const ink = lit ? rgba(oneLookClearGlowColour({ hue: colour }, model.tint), 1) : `rgba(255, 255, 255, ${ONE_LOOK_CLEAR.offStateOpacity})`;
    lines.push(html`<span class="ol-clear-state" style=${`font:600 ${r2(at * s)}px/${r2(at * 1.2 * s)}px ${family.standard};color:${ink}`}>${state}</span>`);
  }
  const top = box.y + box.height;
  const text = lines.length === 0 ? nothing
    : html`<span class="ol-clear-text" style=${rectCss({ x: layout.insetH, y: top, width, height: Math.max(0, size.height - top) }, s)}>${lines}</span>`;
  return html`${picture}${text}`;
}

/** The glyph's place: a disc behind it in the disc layouts, the soft halo
 * behind a bare glyph on a coloured tile, then the glyph or a person's
 * photo; or the tile's icon photo by its own rules (`cutoutLayer`). Where
 * the tile's Arrangement puts the icon, all of them go together, at its
 * size. */
function discLayer(model: OneLookPreviewModel, input: WatchPagePreviewInput, s: number): TemplateResult | typeof nothing {
  const { palette, device } = model;
  const placed = model.arrange?.icon;
  if (placed?.hidden === true) return nothing;
  const layout = placed === undefined ? model.layout : { ...model.layout, discRect: placed.rect, glyphSize: model.layout.glyphSize * placed.scale };
  const rect = layout.discRect;
  if (!(rect.width > 0)) return nothing;
  if (model.picture === "none" && model.cutout !== undefined) return cutoutLayer(model, layout, model.cutout, s);
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  let back: TemplateResult | typeof nothing = nothing;
  if (layout.drawsDisc) {
    const glow = palette.pearlGlow ? `;box-shadow:0 0 ${r2(oneLookMetrics(device).pearlGlow * s)}px rgba(255, 255, 255, 0.5)` : "";
    back = html`<span class="ol-disc" style=${`${rectCss(rect, s)};background:${oneLookInkCss(palette.disc)}${glow}`}></span>`;
  } else {
    const halo = oneLookGlyphHalo(palette, {
      centred: oneLookCentredGlyph(device),
      picture: model.picture !== "none",
      hasIcon: model.baseIcon !== "",
      photo: model.picture === "none" && model.photo !== undefined,
    }, model.style.glow);
    if (halo !== undefined) {
      const d = layout.glyphSize * halo.share;
      const [r, g, b] = halo.rgb;
      back = html`<span class="ol-halo" style=${`${rectCss({ x: cx - d / 2, y: cy - d / 2, width: d, height: d }, s)};background:radial-gradient(circle closest-side, rgba(${r}, ${g}, ${b}, ${Math.round(halo.opacity * 10000) / 10000}) 0%, rgba(${r}, ${g}, ${b}, 0) 100%)`}></span>`;
    }
  }
  if (model.picture === "none" && model.photo !== undefined) {
    return html`${back}<img class="ol-photo" alt="" src=${model.photo} style=${rectCss(rect, s)} />`;
  }
  const ink = oneLookGlyphInk(palette, layout.drawsDisc, oneLookCentredGlyph(device));
  const g = layout.glyphSize;
  return html`${back}${glyphMark(input.icons, model.icon, g, { x: cx - g / 2, y: cy - g / 2 }, ink, s, model.style.glyphShadow)}`;
}

const ACCESSORY_SYMBOLS: Readonly<Record<string, string>> = { fan: "fan.fill" };

/** The round button top right: play or pause, or the fan. A camera's live chip needs a stream, which a picture never
 * has, so it draws nothing. */
function accessoryLayer(model: OneLookPreviewModel, input: WatchPagePreviewInput, s: number): TemplateResult | typeof nothing {
  const { layout, palette } = model;
  const rect = layout.accessoryRect;
  if (rect === undefined || layout.accessory === "none" || layout.accessory === "live") return nothing;
  const playing = model.kind.role.kind === "media" && model.kind.role.playing;
  const symbol = layout.accessory === "playPause" ? (playing ? "pause.fill" : "play.fill") : ACCESSORY_SYMBOLS[layout.accessory] ?? "";
  const box = rect.width * oneLookAccessoryGlyphShare(layout.accessory);
  const at = { x: rect.x + (rect.width - box) / 2, y: rect.y + (rect.height - box) / 2 };
  return html`<span class="ol-acc" data-accessory=${layout.accessory} style=${`${rectCss(rect, s)};background:${oneLookInkCss(palette.accessoryDisc)}`}></span>
    ${glyphMark(input.icons, symbol, box, at, palette.accessoryGlyph, s, false)}`;
}

/** A camera's snapshot or group of snapshots, or album art, filling the
 * tile, under the scrim while text sits over it. */
function pictureLayer(model: OneLookPreviewModel, f: OneLookTileFaceInput): TemplateResult | typeof nothing {
  if (model.picture === "none") return nothing;
  const { tile, input, width, height, s } = f;
  const entityId = tileEntityId(tile);
  const scrim = model.picture !== "camera" || model.name !== "" || model.kind.state.kind !== "none" || model.kind.bigValue !== undefined;
  const over = scrim ? html`<span class="ol-layer" style=${`background:${oneLookScrimCss()}`}></span>` : nothing;
  if (model.picture === "artwork") {
    const url = (model.pictureUrl ?? "").replace(/["\\]/g, (c) => `\\${c}`);
    return html`<span class="ol-layer ol-art" role="img" aria-label="Album art" style=${`background-image:url("${url}")`}></span>${over}`;
  }
  if (tileKind(entityId) === "multicam") {
    const ids = Array.isArray(tile.cameraGroupIds) ? tile.cameraGroupIds.filter((id): id is string => typeof id === "string") : [];
    if (ids.length === 0) return over;
    return html`<span class="ol-layer" style=${`background:${watchMultiCamBorder(tile).background}`}>${watchMultiCamCells(tile, ids, width, height, input, s, true)}</span>${over}`;
  }
  const url = pictureOf(input.states, entityId);
  const fill = tile.cameraFillMode === "fill";
  return html`${url === undefined ? nothing : snapshot(url, fill, width, height, storedNumber(tile.cameraFillOffsetX) ?? 0, storedNumber(tile.cameraFillOffsetY) ?? 0, s)}
    ${liveOver(input, entityId, fill)}${over}`;
}

/** An iPhone sensor chart in the tile's right half: the line, its area
 * fading to clear, a dot on the latest value. */
function chartLayer(model: OneLookPreviewModel, s: number): TemplateResult | typeof nothing {
  const samples = model.chart;
  const { layout, device } = model;
  if (samples === undefined || samples.length < 2 || layout.chartTextWidth === undefined) return nothing;
  const w = layout.size.width;
  const h = layout.size.height;
  const inset = layout.insetH;
  const left = 0.5 * w;
  const right = w - inset;
  const top = inset + layout.discRect.width * 0.55;
  const bottom = h - inset * 1.1;
  const lo = Math.min(...samples);
  const hi = Math.max(...samples);
  const range = hi - lo || 1;
  const mn = lo - (range * 30) / 278;
  const mx = hi + (range * 20) / 278;
  const pts = samples.map((v, i) => [left + ((right - left) * i) / (samples.length - 1), bottom - ((bottom - top) * (v - mn)) / (mx - mn)] as const);
  const p = (x: number, y: number) => `${r2(x * s)} ${r2(y * s)}`;
  let line = `M ${p(pts[0]![0], pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const mid = (a[0] + b[0]) / 2;
    line += ` C ${p(mid, a[1])} ${p(mid, b[1])} ${p(b[0], b[1])}`;
  }
  const area = `${line} L ${p(right, bottom)} L ${p(left, bottom)} Z`;
  const lw = oneLookMetrics(device).chartLineWidth;
  const last = pts[pts.length - 1]!;
  const ink = oneLookHex(model.palette.ink.rgb);
  const id = `ol-chart-${++chartSeq}`;
  return html`<svg class="ol-chart" width=${r2(w * s)} height=${r2(h * s)} viewBox=${`0 0 ${r2(w * s)} ${r2(h * s)}`} aria-hidden="true">${svg`
    <defs>
      <linearGradient id=${`${id}-a`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color=${ink} stop-opacity="0.24" /><stop offset="1" stop-color=${ink} stop-opacity="0" /></linearGradient>
      <linearGradient id=${`${id}-l`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color=${ink} stop-opacity="0.25" /><stop offset="0.25" stop-color=${ink} stop-opacity="0.9" /><stop offset="1" stop-color=${ink} stop-opacity="0.95" /></linearGradient>
    </defs>
    <path d=${area} fill=${`url(#${id}-a)`} />
    <path d=${line} fill="none" stroke=${`url(#${id}-l)`} stroke-width=${r2(lw * s)} stroke-linecap="round" />
    <circle cx=${r2(last[0] * s)} cy=${r2(last[1] * s)} r=${r2(lw * 1.9 * s)} fill=${ink} />
    <circle cx=${r2(last[0] * s)} cy=${r2(last[1] * s)} r=${r2(lw * 3.6 * s)} fill=${ink} fill-opacity="0.18" />`}</svg>`;
}

let chartSeq = 0;

/** The tile's fill: the blend with its corner light, or with the Fill bar
 * style the track, the colour to the level and the white edge where it
 * ends. */
function fillLayers(model: OneLookPreviewModel, s: number): { ground: string; layers: TemplateResult | typeof nothing } {
  const { layout, palette } = model;
  const fill = oneLookFill(palette, layout.size, layout.textOrigin, layout.mode === "strip", layout.discEdge);
  const blend = oneLookBlendCss(fill.stops);
  const sheen = oneLookSheenCss(fill.sheen, s);
  if (palette.fillShare === undefined) return { ground: sheen === undefined ? blend : `${sheen}, ${blend}`, layers: nothing };
  const w = layout.size.width;
  const share = Math.min(1, Math.max(0, palette.fillShare));
  const edge = Math.max(0, w * share - ONE_LOOK_FILL_EDGE_WIDTH);
  return {
    ground: oneLookBlendCss(oneLookFillTrackStops(fill)),
    layers: html`<span class="ol-fill" style=${`width:${r2(w * share * s)}px`}><span class="ol-layer" style=${`width:${r2(w * s)}px;background:${blend}`}></span></span>
      <span class="ol-edge" style=${`left:${r2(edge * s)}px;width:${r2(ONE_LOOK_FILL_EDGE_WIDTH * s)}px;background:rgba(255, 255, 255, ${ONE_LOOK_FILL_EDGE_OPACITY})`}></span>
      ${sheen === undefined ? nothing : html`<span class="ol-layer" style=${`background:${sheen}`}></span>`}`,
  };
}

/** The user's border, drawn only when it is thick enough to (Thin, Medium,
 * Thick) or animated: One Look's rim takes the hairlines' place. */
function borderLayer(model: OneLookPreviewModel, f: OneLookTileFaceInput, active: boolean, radius: number): TemplateResult | typeof nothing {
  const { tile, input } = f;
  if (!model.decorated) return nothing;
  const thick = tile.borderThickness === "thin" || tile.borderThickness === "medium" || tile.borderThickness === "thick";
  if (!thick && tile.borderStyle !== "animate") return nothing;
  const border = watchTileBorder(tile, active, watchTileFallbackInk(tile, input.page, input.states));
  return renderTileRim(border, f.width, f.height, f.s, radius);
}

/**
 * A tile drawn in One Look at its place, or undefined for a kind that keeps
 * its own face. Under the clip: the fill, the pattern and effect, the
 * picture, the chart, then the content at the palette's content opacity
 * (the bar, the glyph, the button and the text, less the parts `hidden`
 * names), the rim and the
 * user's border. Outside it, on the iPhone, the under-glow of a lit coloured
 * tile.
 */
export function renderOneLookTile(f: OneLookTileFaceInput): TemplateResult {
  const model = oneLookPreviewModel(f);
  if (model === undefined) return html`<div class="wp-tile ol-tile" style=${f.box}></div>`;
  const { layout, palette, device } = model;
  const { input, s } = f;
  const radius = oneLookCornerRadius(oneLookMetrics(device), layout.size);
  const { ground, layers } = fillLayers(model, s);
  const glow = device === "phone" ? oneLookUnderGlowCss(palette, s) : undefined;
  const active = watchTilePreviewActive(f.tile, input.states);
  const fade = f.stub ? 0.7 : 1;
  if (oneLookDrawsClear(model) && model.cutout !== undefined) {
    // The Clear look: the wash and the hairline in place of the fill, its
    // sheen, the rim and the under-glow. No pattern or animation behind the
    // photo either (contract revision 2); the user's border stays.
    return html`<div class="wp-tile ol-tile clear" data-ol-mode="clear"
      style=${`${f.box}border-radius:${r2(radius * s)}px;background:rgba(255, 255, 255, ${ONE_LOOK_CLEAR.washOpacity});box-shadow:inset 0 0 0 1px rgba(255, 255, 255, ${ONE_LOOK_CLEAR.borderOpacity})${fade < 1 ? `;opacity:${fade}` : ""}`}
      title=${f.hint ?? nothing}>
      <span class="ol-content" style=${palette.contentOpacity < 1 ? `opacity:${palette.contentOpacity}` : nothing}>${clearLayer(model, f, model.cutout)}</span>
      ${borderLayer(model, f, active, radius)}
    </div>`;
  }
  const rim = oneLookMetrics(device).rim;
  return html`<div class="wp-tile ol-tile" data-ol-mode=${layout.mode}
    style=${`${f.box}border-radius:${r2(radius * s)}px;background:${ground}${glow === undefined ? "" : `;box-shadow:${glow}`}${fade < 1 ? `;opacity:${fade}` : ""}`}
    title=${f.hint ?? nothing}>
    ${layers}
    ${model.decorated ? tileUnderlay(f.tile, input, active, { width: f.width, height: f.height }, s) : nothing}
    ${pictureLayer(model, f)}
    ${chartLayer(model, s)}
    <span class="ol-content" style=${palette.contentOpacity < 1 ? `opacity:${palette.contentOpacity}` : nothing}>
      ${barLayer(model, s)}
      ${f.hidden?.glyph === true ? nothing : discLayer(model, input, s)}${f.hidden?.state === true ? nothing : accessoryLayer(model, input, s)}${textLayer(model, s, f.hidden)}${f.hidden?.state === true ? nothing : bigValueLayer(model, s)}
    </span>
    <span class="ol-rim" style=${`padding:${r2(rim * s)}px;background:${oneLookRimCss(palette.rimOpacity)}`}></span>
    ${borderLayer(model, f, active, radius)}
  </div>`;
}
