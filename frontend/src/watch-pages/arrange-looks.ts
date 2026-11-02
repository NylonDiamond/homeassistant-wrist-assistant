// The Layout section's ready made looks (`ARRANGE_LOOKS`): which of them a
// tile can use and why not, what a look writes on a tile, and what using one
// on the whole page would change. Nothing here draws. The section is
// `arrange-card.ts`.
//
// A look is a stored `arrange` key. On the watch a short tile lays its parts
// out in a row and ignores that key, unless the key hides its name and its
// state (`arrangeHidesText`): then it is drawn as only a centred icon. So a
// short watch tile has two looks, Standard and Icon only. On the iPhone a
// layout is drawn at any size (`ownLayout` in the layout), so every tile with
// parts has every look.

import { arrangeFaceBlock, arrangeFrame, arrangeFreeBlock, arrangeLookOfKey, arrangeOffered, ARRANGE_LOOKS, type ArrangeFrameSource, type ArrangeLook } from "./arrange-model.js";
import { type WatchPage, type WatchPageTile, watchPageTiles } from "./model.js";
import { arrangeHidesText, encodeTileArrange, normalizeTileArrange } from "./one-look/arrange.js";
import type { OneLookPreviewModel } from "./one-look/render.js";
import { withOptional, withoutKey } from "./tile-settings-model.js";

/** What a tile can do with the looks. */
export interface TileLooks {
  /** The look on it now, or "custom" for an arrangement of its own. */
  current: ArrangeLook | "custom";
  /** A short tile: only Standard and Icon only. */
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

/** The tile with `look` on it. */
export function tileWithLook(tile: WatchPageTile, look: ArrangeLook): WatchPageTile {
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
  // Read with no layout on it: a tile short by size is short under its Icon
  // only as well, where it is drawn centred.
  const baseTile = withoutKey(tile, "arrange");
  const model = frameOf(source, baseTile)?.model;
  const name = model?.name || (typeof tile.customLabel === "string" ? tile.customLabel : "") || "A tile";
  const block = arrangeFreeBlock(model);
  if (source.device === "iphone" && arrangeFaceBlock(model) === undefined && arrangeFrame(source, baseTile) !== undefined) {
    // Read with every part on: a tile too small for Standard's parts still
    // holds them, and a layout draws them.
    const whole = arrangeFrame(source, tileWithLook(baseTile, "corners"))?.model ?? model;
    return {
      current: arrangeLookOfKey(stored), short: false, block: undefined, skip: undefined, name,
      looks: ARRANGE_LOOKS.map((l) => ({ id: l.id, label: l.label, off: lookOff(whole)[l.id] })),
    };
  }
  if (isShortModel(model) && iconOnlyDraws(frameOf(source, tileWithLook(baseTile, "icon"))?.model)) {
    return {
      // Any other layout stored on it is not drawn, so it reads as Standard.
      current: arrangeHidesText(stored) ? "icon" : "standard", short: true, block, skip: undefined, name,
      looks: ARRANGE_LOOKS.filter((l) => l.id === "standard" || l.id === "icon").map((l) => ({ id: l.id, label: l.label, off: undefined })),
    };
  }
  if (block !== undefined || model === undefined) {
    return { current: arrangeLookOfKey(stored), short: false, looks: [], block, skip: skipWords(model), name };
  }
  const off = lookOff(model);
  return {
    current: arrangeLookOfKey(stored), short: false, block: undefined, skip: undefined, name,
    looks: ARRANGE_LOOKS.map((l) => ({ id: l.id, label: l.label, off: off[l.id] })),
  };
}

/** The looks a tile cannot use for lack of a part, and why. */
function lookOff(model: OneLookPreviewModel | undefined): Partial<Record<ArrangeLook, string>> {
  if (model === undefined) return {};
  const noIcon = model.icon === "" && model.photo === undefined;
  const noName = model.layout.name.lines.length === 0;
  const noState = model.layout.stateRect === undefined || model.kind.stateHidden;
  return {
    ...(noIcon ? { icon: "it has no icon", corners: "it has no icon" } : {}),
    ...(noState ? { big: "it has no value" } : {}),
    ...(noName ? { text: "it has no name" } : {}),
  };
}

/** What using a look on the whole page would do. */
export interface ArrangePagePlan {
  look: ArrangeLook;
  /** The ids of the tiles it changes. */
  changes: readonly string[];
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
  const changes: string[] = [];
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
    changes.push(tile.id);
    if (read.current === "custom") replaces += 1;
  }
  return { look, changes, skipped, replaces };
}
