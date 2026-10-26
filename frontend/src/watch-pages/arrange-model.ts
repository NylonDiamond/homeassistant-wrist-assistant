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
import { type WatchPage, type WatchPageTile, isWatchRemovedTileKind, tileEntityId, tileKind } from "./model.js";
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
import type { OneLookRect, OneLookSize } from "./one-look/layout.js";
import {
  ARRANGE_OFFSET_RANGE,
  ARRANGE_PARTS,
  type ArrangePart,
  type TileArrange,
  normalizeTileArrange,
  oneLookArrangeNative,
  withArrangePart,
} from "./one-look/arrange.js";

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
  const input: WatchPagePreviewInput = {
    page: source.page, pages: source.pages, screen, scale: 1, oneLook: true, stateMode: source.stateMode ?? "all-on",
    ...(source.states === undefined ? {} : { states: source.states }),
    ...(source.icons === undefined ? {} : { icons: source.icons }),
    ...(source.catalog === undefined ? {} : { catalog: source.catalog }),
    ...(source.behavior === undefined ? {} : { behavior: source.behavior }),
    ...(phone === undefined ? {} : { phone }),
  };
  const layout = watchPreviewLayout(source.page, screen, { sideInset: watchPreviewSideInset(input), topInset: watchPreviewTopInset(input), flat: true });
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
  if (model === undefined) return "This tile keeps its own face, so its parts cannot move.";
  if (model.picture === "camera") return "The camera's picture fills this tile, so its parts cannot move.";
  if (model.picture === "artwork") return "The album art fills this tile, so its parts cannot move.";
  if (model.chart !== undefined) return "A chart tile keeps its own layout, so its parts cannot move.";
  if (model.layout.mode === "strip") return "A tile under 4 rows lays its parts out in a row. Make it taller to move them.";
  if (model.layout.mode !== "centred") return "This tile is too small for its parts to move. Make it bigger to move them.";
  return undefined;
}

/** The arrangement the Free picture shows on a tile with none of its own:
 * the icon top right, a little smaller, and the name bottom left. */
export const ARRANGE_SAMPLE: TileArrange = { v: 1, parts: { icon: { spot: "tr", scale: 0.8 }, name: { spot: "bl" } } };

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

/** Whether the card shows Free for a tile: a stored arrangement, or Free
 * picked and nothing moved yet. Whether the tile can use Free is
 * `arrangeFreeBlock`'s answer. */
export function arrangeFreeOn(uiState: ReadonlyMap<string, unknown>, tile: WatchPageTile): boolean {
  return normalizeTileArrange(tile.arrange) !== undefined || uiState.get(freeKey(tileIdOf(tile))) === true;
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
  /** How far the face sits in from the cell's edge on every side. */
  inset: number;
  /** Each part drawn now (not hidden, and one the tile has), where it is
   * drawn, from the face's top left. */
  parts: Partial<Record<ArrangePart, OneLookRect>>;
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
    if (part === "state" && (layout.state === undefined || model.kind.stateHidden)) continue;
    const rect = placed?.rect ?? native[part];
    if (rect !== undefined && rect.width > 0 && rect.height > 0) parts[part] = rect;
  }
  return { size: layout.size, inset: previewTileCellInset(input, tile, cell.width, cell.height), parts };
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
