// The Home map tile (app repo docs/home_map_plan_2026-10.md, "The tile
// kind"), without any drawing: `home_map.<floor id>`, one floor of the home's
// map drawn small with a glow over each room with a light on and how many
// lights are on, and a tap that opens the full map. Both devices draw it.
//
// What the page editor needs of it: which floor a tile shows, the floors the
// Add tile dialog offers (a floor with at least one room), the Floor menu of
// its settings and the edit that menu makes, and the words under its
// picture. The map comes from the host (`homeMap`), read by the page editor
// once the integration lists `home_map` (`home-map/store.ts`).

import {
  type HomeMapDocument,
  type HomeMapFloor,
  type HomeMapStates,
  homeMapFloor,
  homeMapFloorName,
  homeMapFloorsWithRooms,
  homeMapLightsOn,
  homeMapLightsOnWords,
} from "../home-map/model.js";
import { type WatchPageTile, type WatchPagesDocument, tileEntityId, tileKind, tileTarget } from "./model.js";
import type { WatchMenu } from "./tile-settings-options.js";
import { editTile, withKey, withoutKey } from "./tile-settings-model.js";
import { watchHomeMapEntityId } from "./tile-new.js";

/** The tile kind. */
export const WATCH_HOME_MAP_KIND = "home_map";

/** Whether a tile is a Home map tile. */
export function isWatchHomeMapTile(tile: Pick<WatchPageTile, "entityId">): boolean {
  return tileKind(tileEntityId(tile as WatchPageTile)) === WATCH_HOME_MAP_KIND;
}

/** The floor id a Home map tile shows, as its entity id holds it, or
 * undefined for a tile of another kind. */
export function watchHomeMapFloorId(tile: Pick<WatchPageTile, "entityId">): string | undefined {
  if (!isWatchHomeMapTile(tile)) return undefined;
  return tileTarget(tileEntityId(tile as WatchPageTile));
}

/** The floor a Home map tile shows, when the map has it. */
export function watchHomeMapFloorOf(tile: Pick<WatchPageTile, "entityId">, doc: HomeMapDocument | null | undefined): HomeMapFloor | undefined {
  const id = watchHomeMapFloorId(tile);
  return id === undefined ? undefined : homeMapFloor(doc, id);
}

/** The floors the Add tile dialog offers a Home map tile for: those with a
 * room. Empty without a map, which hides the button. */
export function watchHomeMapAddFloors(doc: HomeMapDocument | null | undefined): HomeMapFloor[] {
  return homeMapFloorsWithRooms(doc);
}

/** What the Add tile button says and draws, and the line after an add. */
export const WATCH_HOME_MAP_ADD_WORDS = {
  label: "Home map",
  hint: "Your home's plan, with the lights that are on",
  question: "Which floor should the tile show?",
} as const;

/** "Added a Home map tile." or "Added a Home map tile for Upstairs." when
 * the map has more than one floor to tell apart. */
export function watchHomeMapAddedText(floor: HomeMapFloor, floors: number): string {
  return floors > 1 ? `Added a Home map tile for ${homeMapFloorName(floor)}.` : "Added a Home map tile.";
}

/** What the Floor menu's stored entry says when the map has no such floor
 * (deleted on the iPhone, or the map is not read yet). */
export const WATCH_HOME_MAP_MISSING_TEXT = "Not on the map";

/** The line under the Floor menu. */
export const WATCH_HOME_MAP_FLOOR_HINT = "The tile draws this floor's plan, with the lights that are on. A tap opens the full map.";

/** The line in place of the menu while there is no map to pick from. */
export const WATCH_HOME_MAP_NO_MAP_TEXT = "No home map yet. Scan your rooms in the iPhone app, then pick a floor here.";

/**
 * The Floor menu: every floor with a room, by name, the tile's own picked.
 * A floor the tile names that the map does not have is shown first,
 * disabled, as "Not on the map", and stays until another is picked. Without
 * a map, undefined.
 */
export function watchHomeMapFloorMenu(tile: WatchPageTile, doc: HomeMapDocument | null | undefined): WatchMenu | undefined {
  const id = watchHomeMapFloorId(tile);
  if (id === undefined) return undefined;
  const floors = homeMapFloorsWithRooms(doc);
  if (floors.length === 0) return undefined;
  const current = floors.find((f) => f.id.toUpperCase() === id.toUpperCase());
  const options = floors.map((f) => ({ value: f.id, label: homeMapFloorName(f) }));
  if (current === undefined) {
    const stored = `stored:${id}`;
    return { options: [{ value: stored, label: WATCH_HOME_MAP_MISSING_TEXT, disabled: true }, ...options], selected: stored };
  }
  return { options, selected: current.id };
}

/** Point a Home map tile at another floor: its entity id becomes that
 * floor's. The label, the look and every other key stay. A tile of another
 * kind, or the floor it shows already, changes nothing. */
export function setWatchHomeMapFloor(document: WatchPagesDocument, pageId: string, tileId: string, floorId: string): WatchPagesDocument {
  if (typeof floorId !== "string" || floorId === "") return document;
  return editTile(document, pageId, tileId, (tile) => {
    const now = watchHomeMapFloorId(tile);
    if (now === undefined || now === floorId) return tile;
    return withKey(tile, "entityId", watchHomeMapEntityId(floorId));
  });
}

/** The tile key that makes the iPhone's Home map tile take a tap on a light
 * as that light's own tap (it toggles), and anywhere else open the map.
 * Absent or false: every tap opens the map. The watch ignores it. */
export const WATCH_HOME_MAP_TAP_LIGHTS_KEY = "homeMapTapLights";

/** The line under the Tap lights switch. */
export const WATCH_HOME_MAP_TAP_LIGHTS_HINT =
  "Every light on the floor shows as a dot. A tap on a dot turns that light on or off; a tap anywhere else opens the map.";

/** Whether a tap on a light toggles it (`homeMapTapLights`). */
export function watchHomeMapTapsLights(tile: Pick<WatchPageTile, "entityId"> & Record<string, unknown>): boolean {
  return tile[WATCH_HOME_MAP_TAP_LIGHTS_KEY] === true;
}

/** Turn Tap lights on (stores true) or off (removes the key). A tile of
 * another kind changes nothing. */
export function setWatchHomeMapTapLights(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isWatchHomeMapTile(tile) || watchHomeMapTapsLights(tile) === on) return tile;
    return on ? withKey(tile, WATCH_HOME_MAP_TAP_LIGHTS_KEY, true) : withoutKey(tile, WATCH_HOME_MAP_TAP_LIGHTS_KEY);
  });
}

/** The tile key that holds a Home map tile's look, on both devices. Absent
 * is glow, so a glow tile stores nothing. */
export const WATCH_HOME_MAP_LOOK_KEY = "homeMapLook";

/** A Home map tile's look. */
export type WatchHomeMapLook = "glow" | "dots" | "dollhouse" | "night";

/** The Look choice, in its order. */
export const WATCH_HOME_MAP_LOOKS: [WatchHomeMapLook, string][] = [
  ["glow", "Glow"],
  ["dots", "Dots"],
  ["dollhouse", "Dollhouse"],
  ["night", "Night"],
];

/** The line under the Look choice. */
export const WATCH_HOME_MAP_LOOK_HINTS: Record<WatchHomeMapLook, string> = {
  glow: "A soft glow round each light that is on.",
  dots: "Every light is a dot: yellow when it is on, gray when it is off.",
  dollhouse: "The plan tipped back, with its walls standing up.",
  night: "The plan almost black, so only the light shows.",
};

/** A Home map tile's look (`homeMapLook`): absent or unknown is glow. */
export function watchHomeMapLook(tile: Record<string, unknown>): WatchHomeMapLook {
  const value = tile[WATCH_HOME_MAP_LOOK_KEY];
  return WATCH_HOME_MAP_LOOKS.some(([look]) => look === value) ? (value as WatchHomeMapLook) : "glow";
}

/** Set a Home map tile's look: glow removes the key, any other look stores
 * it. A tile of another kind, or a look it has, changes nothing. */
export function setWatchHomeMapLook(document: WatchPagesDocument, pageId: string, tileId: string, look: WatchHomeMapLook): WatchPagesDocument {
  if (!WATCH_HOME_MAP_LOOKS.some(([l]) => l === look)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    const stored = (tile as Record<string, unknown>)[WATCH_HOME_MAP_LOOK_KEY];
    if (!isWatchHomeMapTile(tile) || (look === "glow" ? stored === undefined : stored === look)) return tile;
    return look === "glow" ? withoutKey(tile, WATCH_HOME_MAP_LOOK_KEY) : withKey(tile, WATCH_HOME_MAP_LOOK_KEY, look);
  });
}

/** The words under a Home map tile's picture: how many of its floor's
 * lights are on, or why there is no picture. */
export function watchHomeMapTileWords(floor: HomeMapFloor | undefined, states: HomeMapStates | undefined, mapRead: boolean): string {
  if (floor === undefined) return mapRead ? WATCH_HOME_MAP_MISSING_TEXT : "Home map";
  return homeMapLightsOnWords(homeMapLightsOn(floor, states));
}

/** The summary a folded Floor card shows: the floor's name. */
export function watchHomeMapFloorSummary(tile: WatchPageTile, doc: HomeMapDocument | null | undefined): string {
  if (doc === undefined || doc === null) return "";
  const floor = watchHomeMapFloorOf(tile, doc);
  return floor === undefined ? WATCH_HOME_MAP_MISSING_TEXT : homeMapFloorName(floor);
}
