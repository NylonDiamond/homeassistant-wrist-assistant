// The Layout section's ready made looks (`ARRANGE_LOOKS`): which of them a
// tile can use and why not, what a look writes on a tile, and what using one
// on the whole page would change. Nothing here draws. The section is
// `arrange-card.ts`.
//
// A look is a stored `arrange` key, with one exception. A short tile lays its
// parts out in a row and ignores that key, so its Icon only turns the name
// and the value off instead: a short tile with only an icon is drawn centred.

import { arrangeFrame, arrangeFreeBlock, arrangeLookOfKey, arrangeOffered, ARRANGE_LOOKS, type ArrangeFrameSource, type ArrangeLook } from "./arrange-model.js";
import { requiredTileKeyDefault } from "./merge.js";
import { type WatchPage, type WatchPageTile, tileEntityId, tileKind, watchPageTiles } from "./model.js";
import { encodeTileArrange, normalizeTileArrange } from "./one-look/arrange.js";
import type { OneLookPreviewModel } from "./one-look/render.js";
import { watchValueLabelStyle } from "./preview.js";
import { watchStateDomains } from "./tile-styling.js";
import { withKey, withOptional, withoutKey } from "./tile-settings-model.js";

/** What a tile can do with the looks. */
export interface TileLooks {
  /** The look on it now, or "custom" for an arrangement of its own. */
  current: ArrangeLook | "custom";
  /** A short tile: only Standard and Icon only, through the name and value. */
  short: boolean;
  /** The looks to show, each with why it is off, if it is. Empty for a tile
   * that cannot use any. */
  looks: readonly { id: ArrangeLook; label: string; off: string | undefined }[];
  /** Why the parts cannot move (`arrangeFreeBlock`), or undefined when they can. */
  block: string | undefined;
  /** Why the whole tile is left out of a look for the whole page, as the
   * end of "<tile> (...)". Undefined when it can use some look. */
  skip: string | undefined;
  /** The tile's name, for the whole page's list. */
  name: string;
}

/** Whether the tile's kind draws a word for what it is doing ("On"). */
function drawsActivity(tile: WatchPageTile): boolean {
  return watchStateDomains("activityStatus").includes(tileKind(tileEntityId(tile)));
}

/** Whether a short tile's Icon only is on: the name off, and the value off
 * on a kind that draws one. */
function iconOnlyKeysOn(tile: WatchPageTile): boolean {
  const value = watchValueLabelStyle(tile);
  return tile.showLabel === false && (value === undefined || value === "Off") && (!drawsActivity(tile) || tile.showActivityStatus === false);
}

function withIconOnlyKeys(tile: WatchPageTile): WatchPageTile {
  let next = withKey(tile, "showLabel", false);
  if (watchValueLabelStyle(tile) !== undefined) next = withKey(next, "stateValueLabelStyle", "Off");
  return drawsActivity(tile) ? withKey(next, "showActivityStatus", false) : next;
}

/** The name and the value back at their starting values. A key a tile must
 * carry is written, never removed: one missing refuses the whole document. */
function withoutIconOnlyKeys(tile: WatchPageTile): WatchPageTile {
  return ["showLabel", "stateValueLabelStyle", "showActivityStatus"].reduce<WatchPageTile>((t, key) => {
    if (!Object.hasOwn(t, key)) return t;
    const start = requiredTileKeyDefault(key);
    return start === undefined ? withoutKey(t, key) : withKey(t, key, structuredClone(start));
  }, tile);
}

/** The tile with `look` on it. `short` as `tileLooks` says it for this tile. */
export function tileWithLook(tile: WatchPageTile, look: ArrangeLook, short: boolean): WatchPageTile {
  const noArrange = withoutKey(tile, "arrange");
  if (short) {
    const plain = iconOnlyKeysOn(noArrange) ? withoutIconOnlyKeys(noArrange) : noArrange;
    return look === "icon" ? withIconOnlyKeys(plain) : plain;
  }
  return withOptional(tile, "arrange", encodeTileArrange(ARRANGE_LOOKS.find((l) => l.id === look)?.arrange));
}

/** A frame on the device showing the page, or on the other one for a tile
 * that is Off on this one. */
function frameOf(source: ArrangeFrameSource, tile: WatchPageTile) {
  return arrangeFrame(source, tile) ?? arrangeFrame({ ...source, device: source.device === "iphone" ? "watch" : "iphone" }, tile);
}

/** Whether `model` draws the tile as short: in a row or compact, not a
 * picture or a chart that has its own face. */
function isShortModel(model: OneLookPreviewModel | undefined): boolean {
  return model !== undefined && model.picture === "none" && model.chart === undefined && model.layout.mode !== "centred";
}

function iconOnlyDraws(model: OneLookPreviewModel | undefined): boolean {
  return model !== undefined && model.layout.mode === "centred" && model.layout.name.lines.length === 0
    && (model.layout.stateRect === undefined || model.kind.stateHidden) && model.layout.discRect.width > 0;
}

/** Why a tile is left out of every look but Standard, for the whole page's
 * list. */
function skipWords(model: OneLookPreviewModel | undefined): string {
  if (model?.picture === "camera") return "the camera fills the tile";
  if (model?.picture === "artwork") return "the album art fills the tile";
  if (model?.chart !== undefined) return "it is a chart";
  if (isShortModel(model)) return "it is too short";
  return "it keeps its own face";
}

/** The looks of a tile on the page `source` shows. */
export function tileLooks(source: ArrangeFrameSource, tile: WatchPageTile): TileLooks {
  const stored = normalizeTileArrange(tile.arrange);
  // A tile short by size is short under its Icon only as well, where it is
  // drawn centred: it is read with the name and the value back.
  const keysOn = stored === undefined && iconOnlyKeysOn(tile);
  const baseTile = keysOn ? withoutIconOnlyKeys(tile) : tile;
  const model = frameOf(source, baseTile)?.model;
  const name = model?.name || (typeof tile.customLabel === "string" ? tile.customLabel : "") || "A tile";
  const block = arrangeFreeBlock(model);
  if (isShortModel(model) && iconOnlyDraws(frameOf(source, withIconOnlyKeys(baseTile))?.model)) {
    return {
      current: keysOn ? "icon" : "standard", short: true, block, skip: undefined, name,
      looks: ARRANGE_LOOKS.filter((l) => l.id === "standard" || l.id === "icon").map((l) => ({ id: l.id, label: l.label, off: undefined })),
    };
  }
  if (block !== undefined || model === undefined) {
    return { current: arrangeLookOfKey(stored), short: false, looks: [], block, skip: skipWords(model), name };
  }
  const noIcon = model.icon === "" && model.photo === undefined;
  const noName = model.layout.name.lines.length === 0;
  const noState = model.layout.stateRect === undefined || model.kind.stateHidden;
  const off: Partial<Record<ArrangeLook, string>> = {
    ...(noIcon ? { icon: "it has no icon", corners: "it has no icon" } : {}),
    ...(noState ? { big: "it has no value" } : {}),
    ...(noName ? { text: "it has no name" } : {}),
  };
  return {
    current: arrangeLookOfKey(stored), short: false, block: undefined, skip: undefined, name,
    looks: ARRANGE_LOOKS.map((l) => ({ id: l.id, label: l.label, off: off[l.id] })),
  };
}

/** What using a look on the whole page would do. */
export interface ArrangePagePlan {
  look: ArrangeLook;
  /** The tiles it changes, each with what to write on it. */
  changes: readonly { tileId: string; short: boolean }[];
  /** The tiles it leaves as they are, and why. */
  skipped: readonly { name: string; why: string }[];
  /** How many of `changes` hold a layout of their own, which it replaces. */
  replaces: number;
}

/**
 * What `look` would do on every tile of `page` that has parts: a tile with
 * the look already is no change, and a tile that cannot use it is named with
 * why. Standard leaves nobody out: taking a layout off works on any tile.
 */
export function arrangePagePlan(source: ArrangeFrameSource, page: WatchPage, look: ArrangeLook): ArrangePagePlan {
  const changes: { tileId: string; short: boolean }[] = [];
  const skipped: { name: string; why: string }[] = [];
  let replaces = 0;
  for (const tile of watchPageTiles(page)) {
    if (!arrangeOffered(tile) || typeof tile.id !== "string") continue;
    const read = tileLooks(source, tile);
    const stored = normalizeTileArrange(tile.arrange);
    if (read.current === look && (look !== "standard" || stored === undefined)) continue;
    const choice = read.looks.find((l) => l.id === look);
    const why = look === "standard" ? undefined : read.skip ?? (read.short && choice === undefined ? "it is too short" : choice?.off);
    if (why !== undefined) {
      skipped.push({ name: read.name, why });
      continue;
    }
    changes.push({ tileId: tile.id, short: read.short });
    if (read.current === "custom") replaces += 1;
  }
  return { look, changes, skipped, replaces };
}
