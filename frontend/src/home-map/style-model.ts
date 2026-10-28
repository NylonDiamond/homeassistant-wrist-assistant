// The map editor's Style mode without any drawing (mock board 4): the
// looks' names and lines, and the Home map tiles that use the home style.
//
// Used on: every Home map tile on every page of the library (the pages
// every watch and iPhone shows), with whether it follows the home style or
// has a look of its own, and the edit that makes one page's tiles follow it
// again (all six look keys taken away, `withoutTileStyle`). The page is then
// saved through the library as the page editor saves it.

import type { LibrarySummary } from "../library/client.js";
import { type WatchPage, type WatchPagesDocument, isJsonObject, tileEntityId, tileKind, tileTarget, watchPageId, watchPageName, watchPageTiles } from "../watch-pages/model.js";
import { HOME_MAP_TILE_STYLE_KEYS, tileHasOwnStyle, tileOptionsResolved, withoutTileStyle } from "./edit-ops.js";
import { type HomeMapDocument, type HomeMapLook, type HomeMapStyle, homeMapFloorName, sameHomeMapId } from "./model.js";

/** Each look's name and the line under the big preview. */
export const HOME_MAP_LOOK_WORDS: Readonly<Record<HomeMapLook, { title: string; hint: string }>> = {
  plan: { title: "Plan", hint: "The floor from above, with real floors, walls and pools of light." },
  night: { title: "Night", hint: "A small model at night. Lit rooms glow warm." },
  warm: { title: "Warm", hint: "Wood floors and cream walls, like a doll house." },
  lines: { title: "Lines", hint: "Only the lines. Calm and clean." },
  clay: { title: "Clay", hint: "A soft light model, for light pages." },
  blueprint: { title: "Blueprint", hint: "White lines on blue paper." },
  dots: { title: "Dots", hint: "A quiet plan with a dot for each light." },
};

/** One Home map tile of a library page. */
export interface HomeMapTileUse {
  pageId: string;
  pageName: string;
  tileId: string;
  /** "Home map 6×6", or the tile's room. */
  what: string;
  /** Its size in grid units, "6×6". */
  size: string;
  /** It has a look key of its own. */
  own: boolean;
  /** "Home style", or "Own look: Night, turned 40°". */
  words: string;
  /** Its look by the tile rule, for its swatch. */
  look: HomeMapLook;
}

/** What a tile's own keys change, in words: its look's name, its turn,
 * names, devices, furniture and glow, each only where the tile has it. */
export function homeMapOwnLookWords(tile: Readonly<Record<string, unknown>>, doc: HomeMapDocument | null | undefined): string {
  if (!tileHasOwnStyle(tile)) return "Home style";
  const o = tileOptionsResolved(tile, doc);
  const has = (key: keyof HomeMapStyle) => Object.hasOwn(tile, HOME_MAP_TILE_STYLE_KEYS[key]);
  const parts: string[] = [];
  if (has("look")) parts.push(HOME_MAP_LOOK_WORDS[o.look].title);
  if (has("turn")) parts.push(`turned ${o.turn}°`);
  if (has("names")) parts.push(o.names ? "room names" : "no room names");
  if (has("devices")) parts.push(o.devices === "all" ? "every device" : o.devices === "none" ? "no devices" : "lights only");
  if (has("furniture")) parts.push(o.furniture ? "furniture" : "no furniture");
  if (has("glow")) parts.push(o.glow ? "glow" : "no glow");
  return `Own look: ${parts.join(", ")}`;
}

const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

/** The Home map tiles of one page. */
function usesOf(page: WatchPage, doc: HomeMapDocument | null | undefined): HomeMapTileUse[] {
  const pageId = watchPageId(page);
  return watchPageTiles(page).flatMap((tile) => {
    if (tileKind(tileEntityId(tile)) !== "home_map") return [];
    const record = tile as Readonly<Record<string, unknown>>;
    const floorId = tileTarget(tileEntityId(tile));
    const floor = doc?.floors.find((f) => sameHomeMapId(f.id, floorId));
    const roomId = typeof record.homeMapRoomId === "string" ? record.homeMapRoomId : undefined;
    const room = roomId === undefined ? undefined : floor?.rooms.find((r) => sameHomeMapId(r.id, roomId));
    const size = `${num(tile.colSpan, 1)}×${num(tile.rowSpan, 1)}`;
    const label = typeof tile.customLabel === "string" && tile.customLabel.trim() !== "" ? tile.customLabel.trim() : undefined;
    const what = label ?? (room?.name?.trim() ? `${room.name.trim()} only` : floor === undefined || (doc?.floors.length ?? 0) <= 1 ? "Home map" : homeMapFloorName(floor));
    return [{
      pageId,
      pageName: watchPageName(page),
      tileId: typeof tile.id === "string" ? tile.id : "",
      what,
      size,
      own: tileHasOwnStyle(record),
      words: homeMapOwnLookWords(record, doc),
      look: tileOptionsResolved(record, doc).look,
    }];
  });
}

/** Every Home map tile on the library's pages, page by page in name order. */
export function homeMapTileUses(summary: Pick<LibrarySummary, "pages"> | undefined, doc: HomeMapDocument | null | undefined): HomeMapTileUse[] {
  const pages = Object.values(summary?.pages ?? {})
    .map((entry) => entry?.item)
    .filter((item): item is WatchPage => isJsonObject(item));
  return pages
    .sort((a, b) => watchPageName(a).localeCompare(watchPageName(b)))
    .flatMap((page) => usesOf(page, doc));
}

/** A library page's document with every Home map tile on it following the
 * home style, or undefined when none had a look of its own. */
export function homeMapPagesWithoutTileStyle(document: WatchPagesDocument): WatchPagesDocument | undefined {
  let changed = false;
  if (!Array.isArray(document.pages)) return undefined;
  const pages = document.pages.map((page: unknown) => {
    if (!isJsonObject(page) || !Array.isArray(page.items)) return page;
    const items = page.items.map((tile: unknown) => {
      if (!isJsonObject(tile) || tileKind(tileEntityId(tile)) !== "home_map" || !tileHasOwnStyle(tile)) return tile;
      changed = true;
      return withoutTileStyle(tile);
    });
    return { ...page, items };
  });
  return changed ? { ...document, pages } : undefined;
}
