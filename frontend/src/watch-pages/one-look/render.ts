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
  oneLookGlyphHaloOpacity,
  oneLookGlyphInk,
  oneLookHex,
  oneLookInkCss,
  oneLookPalette,
  oneLookRimCss,
  oneLookScrimCss,
  oneLookSheenCss,
  oneLookUnderGlowCss,
  ONE_LOOK_AMBER_DOT,
  ONE_LOOK_BAR_BORDER_OPACITY,
  ONE_LOOK_BAR_FILL_OPACITY,
  ONE_LOOK_BAR_TRACK_OPACITY,
  ONE_LOOK_FILL_EDGE_OPACITY,
  ONE_LOOK_FILL_EDGE_WIDTH,
  ONE_LOOK_GLYPH_HALO_SHARE,
  ONE_LOOK_PILL_OPACITY,
  ONE_LOOK_UNIT_OPACITY,
} from "./colour.js";
import { type OneLookKindState, oneLookBarValue, oneLookFillLevel, oneLookTileState } from "./state.js";
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
import { type OneLookTextWeight, type StateFit, type StateLine, type TextMeasurer, glyphAspectOf, glyphExtentOf } from "./text.js";
import type { TileHiddenParts } from "../tile-design-core.js";

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
   * the picture's symbols. A tile's base layers pass the estimate measurer
   * for stable fixtures (`tile-base-layers.ts`). */
  measurer?: TextMeasurer;
  /** The parts of the tile a design took over (its owned roles), which are
   * left undrawn: the layout is the same as with them, so nothing else
   * moves. The glyph takes its disc or halo with it; the state its pill,
   * unit, tail and amber dot, the big value that stands in for it, and the
   * accessory beside it (as the apps hide it, touch area and all). The bar
   * and the chart are never hidden. */
  hidden?: TileHiddenParts;
  /** A tile's layers (`design`) that it draws itself (its owned base layers
   * and added layers), over One Look's own content and under the rim,
   * dimmed with it (app repo docs/tile_layers_contract_2026-10.md). */
  content?: TemplateResult;
  /** The design's layers drawn from the model this tile is laid out by, so
   * its owned base layers can be placed on the native parts of this very
   * layout (round two: app repo docs/tile_layers_contract_2026-10.md,
   * section 13.2). Drawn where `content` is, and wins over it. */
  contentFor?: (model: OneLookPreviewModel) => TemplateResult | undefined;
  /** Drawn over the tile's content, under the rim: the page editor's outline
   * of a picked layer on a tile that has no layers saved yet. */
  overlay?: TemplateResult;
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
  const photo = ks.placeholder ? undefined : f.look?.photo;

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
    hasIcon: base !== "" || photo !== undefined,
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
  return {
    device, pageLook, kind: ks, icon, baseIcon: base,
    ...(photo === undefined ? {} : { photo }),
    picture, ...(pictureUrl === undefined ? {} : { pictureUrl }),
    name, ...(chart === undefined ? {} : { chart }),
    style, bar, ...(barValue === undefined ? {} : { barValue }),
    decorated: !ks.placeholder && picture !== "camera",
    colSpan, rowSpan, layout, palette,
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
 * tail after it, or a word (the amber dot before it when it asks). */
function stateLine(state: StateFit, palette: OneLookPalette, device: OneLookDevice, s: number): TemplateResult {
  const family = ONE_LOOK_FONT_FAMILIES[device];
  const ink = oneLookInkCss(palette.ink);
  const ink2 = oneLookInkCss(palette.ink2);
  const p = state.parts;
  if (p.kind === "number") {
    return html`<span class="ol-line"><span class="ol-figure" style=${`font:700 ${r2(state.size * s)}px/1 ${family.rounded};color:${ink}`}>${p.figure}</span>${p.unit === undefined ? nothing
      : html`<span class="ol-unit" style=${`font:600 ${r2(state.unitSize * s)}px/1 ${family.rounded};color:${ink};opacity:${ONE_LOOK_UNIT_OPACITY}`}>${p.unit}</span>`}${p.tail === undefined ? nothing
      : html`<span class="ol-tail" style=${`font:400 ${r2(state.tailSize * s)}px/1 ${family.standard};color:${ink2}`}>${` ${p.tail}`}</span>`}</span>`;
  }
  return html`<span class="ol-line ol-word" style=${`font:400 ${r2(state.size * s)}px/1 ${family.standard};color:${ink2}`}>${p.amber
    ? html`<span class="ol-amber" style=${`background:${oneLookHex(ONE_LOOK_AMBER_DOT)}`}></span>` : nothing}${p.word}</span>`;
}

function nameFont(model: OneLookPreviewModel, centred: boolean, s: number): string {
  const layout = model.layout;
  const weight = model.style.nameWeight ?? (centred ? "medium" : "semibold");
  const family = ONE_LOOK_FONT_FAMILIES[model.device][model.style.nameDesign];
  const colour = model.picture === "none" && model.style.nameColour !== undefined ? model.style.nameColour : oneLookInkCss(model.palette.ink);
  return `font:${oneLookCssWeight(weight)} ${r2(layout.name.size * s)}px/${r2(layout.nameLineHeight * s)}px ${family};color:${colour}`;
}

/** The name and the state: in the centred layout the state alone in its
 * box top left and the name lines centred at the bottom; in every other
 * layout the name lines then the state, top left at the text's origin. A
 * hidden part keeps its room, so the other stays where it was. */
function textLayer(model: OneLookPreviewModel, s: number, hidden?: TileHiddenParts): TemplateResult | typeof nothing {
  const { layout, palette, device, kind } = model;
  const shadows = palette.textShadow && device === "phone";
  const nameShadow = textShadow(shadows && model.style.nameShadow, s);
  const stateShadow = textShadow(shadows && model.style.stateShadow, s);
  const lines = layout.name.lines;
  if (layout.mode === "centred") {
    const rect = layout.stateRect;
    const state = layout.state !== undefined && rect !== undefined && !kind.stateHidden && hidden?.state !== true
      ? html`<span class="ol-state ${model.style.statePill ? "pill" : ""}" style=${`${rectCss(rect, s)}${model.style.statePill ? `;background:rgba(0, 0, 0, ${ONE_LOOK_PILL_OPACITY})` : ""}${stateShadow}`}>${stateLine(layout.state, palette, device, s)}</span>`
      : nothing;
    const name = lines.length === 0 || hidden?.name === true ? nothing : html`<span class="ol-text centred" style=${`${rectCss({ x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight }, s)}`}>
      ${lines.map((line) => html`<span class="ol-name" style=${`height:${r2(layout.nameLineHeight * s)}px;${nameFont(model, true, s)}${nameShadow}`}>${line}</span>`)}
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

/** The glyph's place: a disc behind it in the disc layouts, the soft halo
 * behind a bare glyph on a coloured tile, then the glyph or a person's
 * photo. */
function discLayer(model: OneLookPreviewModel, input: WatchPagePreviewInput, s: number): TemplateResult | typeof nothing {
  const { layout, palette, device } = model;
  const rect = layout.discRect;
  if (!(rect.width > 0)) return nothing;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  let back: TemplateResult | typeof nothing = nothing;
  if (layout.drawsDisc) {
    const glow = palette.pearlGlow ? `;box-shadow:0 0 ${r2(oneLookMetrics(device).pearlGlow * s)}px rgba(255, 255, 255, 0.5)` : "";
    back = html`<span class="ol-disc" style=${`${rectCss(rect, s)};background:${oneLookInkCss(palette.disc)}${glow}`}></span>`;
  } else {
    const halo = oneLookGlyphHaloOpacity(palette, { centred: oneLookCentredGlyph(device), picture: model.picture !== "none", hasIcon: model.baseIcon !== "" });
    if (halo !== undefined) {
      const d = layout.glyphSize * ONE_LOOK_GLYPH_HALO_SHARE;
      back = html`<span class="ol-halo" style=${`${rectCss({ x: cx - d / 2, y: cy - d / 2, width: d, height: d }, s)};background:radial-gradient(circle closest-side, rgba(255, 255, 255, ${halo}) 0%, rgba(255, 255, 255, 0) 100%)`}></span>`;
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
 * (the bar, the glyph, the button, the text, less the parts a design hides,
 * then the design's own layers), the rim and the user's border. Outside it,
 * on the iPhone, the under-glow of a lit coloured tile.
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
      ${f.contentFor !== undefined ? (f.contentFor(model) ?? nothing) : (f.content ?? nothing)}
    </span>
    ${f.overlay ?? nothing}
    <span class="ol-rim" style=${`padding:${r2(rim * s)}px;background:${oneLookRimCss(palette.rimOpacity)}`}></span>
    ${borderLayer(model, f, active, radius)}
  </div>`;
}
