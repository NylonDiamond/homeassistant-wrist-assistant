// What the Arrangement section's rows (`arrange-card.ts`) know about the tile they
// arrange, without drawing anything: the tile laid out on its page as One
// Look draws it, whether Free can place its parts (only the centred layout
// does) and the words for why not, and which kinds are offered the card at
// all. The shared fixtures' test lays its tiles out through here too, so the
// card and the fixtures read the same layout.

import type { HassEntityState } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { REFERENCE_CASE } from "../renderer.js";
import { phoneModelForScreenSize, phonePageLookOf, phonePagesLayout, phonePagesScreen } from "../phone-frame.js";
import type { SettingDevice } from "../watch-settings.js";
import type { WatchCatalog } from "./catalog.js";
import { sameWatchId } from "./edit.js";
import { type WatchPage, type WatchPageTile, isWatchRemovedTileKind, tileEntityId, tileKind, watchScreenPage } from "./model.js";
import { isWatchPhoneTileKind } from "./phone-tiles-model.js";
import {
  type WatchPagePreviewInput,
  previewTileCellInset,
  watchPreviewLayout,
  watchPreviewSideInset,
  watchPreviewTopInset,
  watchTileOneLookModel,
} from "./preview.js";
import type { OneLookPreviewModel } from "./one-look/render.js";
import { type OneLookRect, type OneLookSize, oneLookAccessoryHasOwnAction } from "./one-look/layout.js";
import { oneLookCornerRadius, oneLookMetrics } from "./one-look/metrics.js";
import {
  ARRANGE_OFFSET_RANGE,
  ARRANGE_PARTS,
  type ArrangePart,
  type TileArrange,
  encodeTileArrange,
  normalizeTileArrange,
  oneLookArrangeContent,
  oneLookArrangeNative,
  withArrangePart,
} from "./one-look/arrange.js";
import { oneLookMeasurer } from "./one-look/measurer.js";

/** What the card reads beside the tile: the page, the states, the symbols. */
export interface ArrangeFrameSource {
  page: WatchPage;
  pages: readonly WatchPage[];
  device: SettingDevice;
  states?: Record<string, HassEntityState>;
  icons?: IconProvider;
  catalog?: WatchCatalog;
  behavior?: Readonly<Record<string, unknown>>;
  /** Live states as they are, or each tile lit ("all-on", the default). */
  stateMode?: WatchPagePreviewInput["stateMode"];
}

/** A tile on its page as One Look draws it on `device`: the picture's input
 * (One Look, scale 1), the tile's grid cell and unit, and its model. */
export interface ArrangeFrame {
  input: WatchPagePreviewInput;
  cell: { width: number; height: number };
  unit: number;
  model: OneLookPreviewModel | undefined;
}

/**
 * The tile laid out as the stage lays it out (the reference watch, or the
 * default iPhone in the page look the behavior picks), with `tile` in place
 * of the stored one so a variant can be drawn at the same cell. Undefined
 * when the page does not hold the tile.
 */
export function arrangeFrame(source: ArrangeFrameSource, tile: WatchPageTile): ArrangeFrame | undefined {
  const phone = source.device === "iphone" ? phonePagesLayout(phoneModelForScreenSize(undefined), { look: phonePageLookOf(source.behavior) }) : undefined;
  const screen = phone === undefined ? REFERENCE_CASE.screen : phonePagesScreen(phone);
  // The device's own screen of the page: the tile's cell there, or none when
  // it is Off on that screen.
  const page = watchScreenPage(source.page, source.device);
  const input: WatchPagePreviewInput = {
    page, pages: source.pages, screen, scale: 1, oneLook: true, stateMode: source.stateMode ?? "all-on",
    ...(source.states === undefined ? {} : { states: source.states }),
    ...(source.icons === undefined ? {} : { icons: source.icons }),
    ...(source.catalog === undefined ? {} : { catalog: source.catalog }),
    ...(source.behavior === undefined ? {} : { behavior: source.behavior }),
    ...(phone === undefined ? {} : { phone }),
  };
  const layout = watchPreviewLayout(page, screen, { sideInset: watchPreviewSideInset(input), topInset: watchPreviewTopInset(input), flat: true });
  const placed = layout.tiles.find((t) => sameWatchId(t.tile.id, tile.id));
  if (placed === undefined || !(placed.width > 0 && placed.height > 0)) return undefined;
  const cell = { width: placed.width, height: placed.height };
  return { input, cell, unit: layout.unit, model: watchTileOneLookModel(tile, cell, input, layout.unit) };
}

/**
 * Why Free cannot place this tile's parts, or undefined when it can: only
 * the centred layout places them. The words name what the tile is drawn as.
 */
export function arrangeFreeBlock(model: OneLookPreviewModel | undefined): string | undefined {
  const face = arrangeFaceBlock(model);
  if (face !== undefined || model === undefined) return face;
  if (model.layout.mode === "strip") return "On the watch, a tile under 4 rows keeps its parts in a row. Make it taller for more layouts.";
  if (model.layout.mode !== "centred") return "On the watch, a tile this small has few layouts. Make it bigger for more.";
  return undefined;
}

/** Why a tile's parts cannot move at any size: it has a face of its own. */
export function arrangeFaceBlock(model: OneLookPreviewModel | undefined): string | undefined {
  if (model === undefined) return "This tile keeps its own face, so its parts cannot move.";
  if (model.picture === "camera") return "The camera's picture fills this tile, so its parts cannot move.";
  if (model.picture === "artwork") return "The album art fills this tile, so its parts cannot move.";
  if (model.chart !== undefined) return "A chart tile keeps its own layout, so its parts cannot move.";
  return undefined;
}

/** Which of the icon, the name and the state a model draws, whatever its
 * layout's key then hides. */
function drawnParts(model: OneLookPreviewModel): readonly ArrangePart[] {
  return (["icon", "name", "state"] as const).filter((part) => arrangePartDrawn(model, part));
}

/** Whether a model draws a part now, wherever its layout's key puts it or
 * whether the key hides it. A bar needs a level to show: an off light has none. */
export function arrangePartDrawn(model: OneLookPreviewModel, part: ArrangePart): boolean {
  const layout = model.layout;
  switch (part) {
    case "icon": return layout.discRect.width > 0;
    case "name": return layout.name.lines.length > 0;
    case "state": return layout.state !== undefined && !model.kind.stateHidden;
    case "bar": return layout.barRect !== undefined && model.barValue !== undefined;
    case "button": return layout.accessoryRect !== undefined && oneLookAccessoryHasOwnAction(layout.accessory);
  }
}

/** Whether a tile can have a part at all, so its row is worth showing: a bar
 * on a kind that keeps its room (an off light too), a button on a kind that
 * draws one. The other three are on every tile. */
export function arrangePartOffered(model: OneLookPreviewModel | undefined, part: ArrangePart): boolean {
  if (part === "bar") return model?.layout.barRect !== undefined;
  if (part === "button") return model !== undefined && arrangePartDrawn(model, "button");
  return true;
}

/**
 * What a resize took from a tile, in the words of the line under the bar, or
 * undefined when it took nothing. The tile is drawn from its size, so making
 * it bigger brings back all of it.
 */
export function arrangeResizeNote(before: OneLookPreviewModel | undefined, after: OneLookPreviewModel | undefined, arrange: TileArrange | undefined): string | undefined {
  if (before === undefined || after === undefined) return undefined;
  if (arrange !== undefined && before.layout.mode === "centred" && after.layout.mode !== "centred") {
    return "This tile is now too small for its layout on the watch, so it uses Standard. Make it bigger to bring the layout back.";
  }
  const left = drawnParts(after);
  const lost = drawnParts(before).filter((part) => !left.includes(part));
  if (lost.length === 0) return undefined;
  const words = lost.length === 1 ? lost[0]! : `${lost.slice(0, -1).join(", ")} and ${lost[lost.length - 1]!}`;
  return `This tile is now too small to show its ${words}. Make it bigger to bring ${lost.length === 1 ? "it" : "them"} back.`;
}

/**
 * The layout Custom starts from on a tile whose size gives it a layout of few
 * parts: it keeps what the tile draws now (the icon in the middle, the name at
 * the bottom, the state at the top left), and hides what the tile does not draw, so
 * nothing appears on a small tile that it has no room for. The eyes bring a
 * part back. Undefined for a tile that has its parts in the centred layout
 * already, or that keeps its own face.
 */
export function arrangeStartFor(model: OneLookPreviewModel | undefined): TileArrange | undefined {
  if (model === undefined || arrangeFaceBlock(model) !== undefined || model.layout.mode === "centred") return undefined;
  const drawn = drawnParts(model);
  if (drawn.length === 0) return undefined;
  // A tile with its parts in a row is thin: they start apart, as it drew them.
  const row = model.layout.mode === "strip";
  // A kind with a bar gets one in the centred layout, which this tile did not
  // draw: it stays hidden until its eye brings it back.
  const hasBar = !model.bar.fill && (model.kind.role.kind === "light" || model.kind.keepsBarRoom === true || model.kind.barLevel !== undefined);
  return normalizeTileArrange({
    v: 1,
    parts: {
      icon: drawn.includes("icon") ? { spot: row ? "ml" : "mc" } : { hidden: true },
      name: drawn.includes("name") ? (row ? { spot: "mr", scale: 0.8 } : { spot: "bc" }) : { hidden: true },
      state: drawn.includes("state") ? { spot: row ? "tr" : "tl" } : { hidden: true },
      ...(hasBar ? { bar: { hidden: true } } : {}),
    },
  });
}

/** A ready made layout: nothing but a stored `arrange` key, so the apps draw
 * it as they draw any arrangement. Standard is no key. */
export type ArrangeLook = "standard" | "icon" | "big" | "corners" | "text";

/** The looks in the order the card shows them. */
export const ARRANGE_LOOKS: readonly { id: ArrangeLook; label: string; arrange: TileArrange | undefined }[] = [
  { id: "standard", label: "Standard", arrange: undefined },
  // 125%, not the 150% limit: on a 6 by 4 watch tile the icon's box at 150%
  // is taller than the tile.
  { id: "icon", label: "Icon only", arrange: { v: 1, parts: { icon: { spot: "mc", scale: 1.25 }, name: { hidden: true }, state: { hidden: true } } } },
  { id: "big", label: "Big value", arrange: { v: 1, parts: { icon: { hidden: true }, state: { spot: "mc", scale: 1.5 } } } },
  { id: "corners", label: "Corners", arrange: { v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } } },
  { id: "text", label: "Text only", arrange: { v: 1, parts: { icon: { hidden: true }, name: { spot: "mc" } } } },
];

/** Which look a stored arrangement is, or "custom" when it is none of them. */
export function arrangeLookOfKey(arrange: TileArrange | undefined): ArrangeLook | "custom" {
  const key = JSON.stringify(encodeTileArrange(arrange));
  return ARRANGE_LOOKS.find((l) => JSON.stringify(encodeTileArrange(l.arrange)) === key)?.id ?? "custom";
}

/** The kinds the card is offered for: every kind One Look draws with an
 * icon, a name and a state of its own (not a header, a spacer, a template,
 * a removed kind or a kind only the iPhone draws). */
export function arrangeOffered(tile: WatchPageTile): boolean {
  const kind = tileKind(tileEntityId(tile));
  return kind !== "divider" && kind !== "spacer" && kind !== "template" && !isWatchRemovedTileKind(kind) && !isWatchPhoneTileKind(kind);
}

// ── the part being placed, shared by the card and the stage ──────────────
//
// Free and the part picked are view state, kept in the page editor's
// `uiState` (it outlives a draw, not a watch switch), by tile: the card's
// Part row and the stage's selected tile read and write the same keys, so a
// part picked on either is the one the other shows.

/** Every `uiState` key the Arrange rows keep starts with this. */
export const ARRANGE_UI_KEY = "tile-settings:arrange";

const freeKey = (tileId: string) => `${ARRANGE_UI_KEY}:free:${tileId.toUpperCase()}`;
const partKey = (tileId: string) => `${ARRANGE_UI_KEY}:part:${tileId.toUpperCase()}`;

/** What the part key holds once the part was let go (Escape on the stage):
 * no part picked, so a drag on the tile moves the tile. */
const NO_PART = "none";

/** The part being placed on a tile: Icon until another is picked, or
 * undefined once the pick was let go. */
export function arrangePickedPart(uiState: ReadonlyMap<string, unknown>, tileId: string): ArrangePart | undefined {
  const v = uiState.get(partKey(tileId));
  if (v === NO_PART) return undefined;
  return typeof v === "string" && (ARRANGE_PARTS as readonly string[]).includes(v) ? (v as ArrangePart) : "icon";
}

/** Pick the part to place on a tile, or let the pick go (undefined). */
export function setArrangePickedPart(uiState: Map<string, unknown>, tileId: string, part: ArrangePart | undefined): void {
  uiState.set(partKey(tileId), part ?? NO_PART);
}

/** Free picked on a tile with nothing moved yet (which stores nothing). */
export function setArrangeFreePicked(uiState: Map<string, unknown>, tileId: string, on: boolean): void {
  if (on) uiState.set(freeKey(tileId), true);
  else uiState.delete(freeKey(tileId));
}

/** Whether the card shows Custom for a tile: a stored arrangement that is
 * none of the looks (`arrangeLookOfKey`), or Custom picked. Whether the tile
 * can use it is `arrangeFreeBlock`'s answer. */
export function arrangeFreeOn(uiState: ReadonlyMap<string, unknown>, tile: WatchPageTile): boolean {
  return arrangeLookOfKey(normalizeTileArrange(tile.arrange)) === "custom" || uiState.get(freeKey(tileIdOf(tile))) === true;
}

function tileIdOf(tile: WatchPageTile): string {
  return typeof tile.id === "string" ? tile.id : "";
}

// ── the parts on the stage ───────────────────────────────────────────────

/** Where a tile's parts are drawn in its cell, for the stage to outline and
 * grab them: in points, from the cell's top left. */
export interface ArrangeStageParts {
  /** The face's size inside the cell: what `dx` and `dy` are shares of. */
  size: OneLookSize;
  /** The face's corner radius, which the grid over it follows. */
  radius: number;
  /** How far the face sits in from the cell's edge on every side. */
  inset: number;
  /** Each part drawn now (not hidden, and one the tile has), where it is
   * drawn, from the face's top left: the glyph's ink, the name's text, the
   * state's box. */
  parts: Partial<Record<ArrangePart, OneLookRect>>;
  /** The content box and the parts' native rects, which a drag places by. */
  content: OneLookRect;
  native: Partial<Record<ArrangePart, OneLookRect>>;
}

/** The name's box shrunk to its text, where its alignment puts the text. */
function nameTextBox(rect: OneLookRect, model: OneLookPreviewModel, device: "phone" | "watch"): OneLookRect {
  const { lines, size } = model.layout.name;
  const measure = oneLookMeasurer(device);
  const wide = Math.max(0, ...lines.map((line) => measure.width(line, size, "medium", false, 0)));
  if (!(wide > 0) || wide >= rect.width) return rect;
  const align = model.arrange?.name?.align ?? "center";
  const x = align === "leading" ? rect.x : align === "trailing" ? rect.x + rect.width - wide : rect.x + (rect.width - wide) / 2;
  return { ...rect, x, width: wide };
}

/** `rect`, the icon's box wherever it is placed, shrunk to where the glyph's
 * ink lands in that box. */
function inkBox(rect: OneLookRect, layout: OneLookPreviewModel["layout"]): OneLookRect {
  const box = layout.discRect;
  const ink = layout.glyphInk;
  if (ink === undefined || !(box.width > 0 && box.height > 0)) return rect;
  const across = rect.width / box.width;
  const down = rect.height / box.height;
  return { x: rect.x + (ink.x - box.x) * across, y: rect.y + (ink.y - box.y) * down, width: ink.width * across, height: ink.height * down };
}

/**
 * A tile's parts as the stage draws them at `cell` (points), or undefined
 * when Free cannot place them (`arrangeOffered`, `arrangeFreeBlock`): such a
 * tile never enters a part drag. A hidden part, and a part the tile does
 * not draw, is left out, so it is never grabbed.
 */
export function arrangeStageParts(tile: WatchPageTile, cell: { width: number; height: number }, input: WatchPagePreviewInput, unit: number): ArrangeStageParts | undefined {
  if (!arrangeOffered(tile)) return undefined;
  const model = watchTileOneLookModel(tile, cell, input, unit);
  if (model === undefined || arrangeFreeBlock(model) !== undefined) return undefined;
  const layout = model.layout;
  const native = oneLookArrangeNative(layout);
  const parts: Partial<Record<ArrangePart, OneLookRect>> = {};
  for (const part of ARRANGE_PARTS) {
    const placed = model.arrange?.[part];
    if (placed?.hidden === true) continue;
    if (part === "icon" && model.icon === "" && model.photo === undefined) continue;
    if (part !== "icon" && !arrangePartDrawn(model, part)) continue;
    const rect = placed?.rect ?? native[part];
    if (rect === undefined || !(rect.width > 0 && rect.height > 0)) continue;
    // The icon's box is the glyph's ink, not the larger box it is fitted in,
    // whose lower edge runs through the name on a watch tile.
    parts[part] = part === "icon" && model.photo === undefined ? inkBox(rect, layout)
      : part === "name" ? nameTextBox(rect, model, input.phone === undefined ? "watch" : "phone")
      : rect;
  }
  return {
    size: layout.size, radius: oneLookCornerRadius(oneLookMetrics(model.device), layout.size),
    inset: previewTileCellInset(input, tile, cell.width, cell.height), parts, content: oneLookArrangeContent(layout), native,
  };
}

/** An offset as a drag or a nudge writes it: clamped to its range and
 * rounded to a thousandth of the tile. */
export function arrangeOffset(v: number): number {
  const clamped = Math.min(ARRANGE_OFFSET_RANGE[1], Math.max(ARRANGE_OFFSET_RANGE[0], v));
  return Math.round(clamped * 1000) / 1000 + 0;
}

/**
 * `arrange` with `part` moved by (`across`, `down`), shares of the tile's
 * width and height, from where it is: its spot kept, its offsets clamped and
 * rounded (`arrangeOffset`). Undefined once nothing is left moved (Default).
 */
export function movedArrangePart(arrange: TileArrange | undefined, part: ArrangePart, across: number, down: number): TileArrange | undefined {
  return withArrangePart(arrange, part, (e) => ({ ...e, dx: arrangeOffset((e.dx ?? 0) + across), dy: arrangeOffset((e.dy ?? 0) + down) }));
}

/** How far one arrow key moves a part: 1% of the tile, 5% with Shift. */
export const ARRANGE_NUDGE_STEP = 0.01;
export const ARRANGE_NUDGE_BIG_STEP = 0.05;

/** `arrange` with `part` moved one arrow key's step. */
export function nudgedArrangePart(
  arrange: TileArrange | undefined,
  part: ArrangePart,
  direction: "up" | "down" | "left" | "right",
  big: boolean,
): TileArrange | undefined {
  const step = big ? ARRANGE_NUDGE_BIG_STEP : ARRANGE_NUDGE_STEP;
  const across = direction === "left" ? -step : direction === "right" ? step : 0;
  const down = direction === "up" ? -step : direction === "down" ? step : 0;
  return movedArrangePart(arrange, part, across, down);
}
