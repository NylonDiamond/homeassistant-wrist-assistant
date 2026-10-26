// What the Arrangement card (`arrange-card.ts`) knows about the tile it
// arranges, without drawing anything: the tile laid out on its page as One
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
  watchPreviewLayout,
  watchPreviewSideInset,
  watchPreviewTopInset,
  watchTileOneLookModel,
} from "./preview.js";
import type { OneLookPreviewModel } from "./one-look/render.js";
import type { TileArrange } from "./one-look/arrange.js";

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
