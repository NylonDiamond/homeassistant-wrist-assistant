// The Home map tile (app repo docs/home_map_plan_2026-10.md, "The tile
// kind"), without any drawing: `home_map.<floor id>`, one floor of the home's
// map (or one room of it, `homeMapRoomId`) drawn small with a glow over each
// room with a light on and how many lights are on, and a tap that opens the
// full map. Both devices draw it.
//
// What the page editor needs of it: which floor a tile shows, the floors the
// Add tile dialog offers (a floor with at least one room), the menus and
// switches of its settings' Map card and the edits they make (floor, room,
// look, turn, names, devices, furniture, glow, Tap lights), and the words
// under its picture. The map comes from the host (`homeMap`), read by the
// page editor once the integration lists `home_map` (`home-map/store.ts`).
// The picture itself is `home-map/tile-art.ts`.
//
// The six look keys (`homeMapLook`, `homeMapTurn`, `homeMapNames`,
// `homeMapDevices`, `homeMapFurniture`, `homeMapGlow`) follow the tile rule,
// the same on every device: a tile's own key when present wins, else the
// map's home style (`doc.style`, set in the map editor's Style), else the
// key's default. The Map card shows each resolved that way and stores a key
// only when the choice differs from the home style, so a tile left alone
// follows the home style when it changes; "Use the home style" takes all six
// away. Every reader and setter takes the map as its last argument; without
// it the home style is the defaults. The other keys (the room, Tap lights)
// store nothing for their default.

import { homeStyleOf, tileHasOwnStyle, tileOptionsResolved, withoutTileStyle } from "../home-map/edit-ops.js";
import { HOME_TILE_DEFAULT_TURN, HOME_TILE_MODEL_LOOKS, type HomeTileDevices, type HomeTileLook } from "../home-map/tile-art.js";
import {
  type HomeMapDocument,
  type HomeMapFloor,
  type HomeMapRoom,
  type HomeMapStates,
  homeMapFloor,
  homeMapFloorName,
  homeMapFloorsWithRooms,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapRoomFloor,
  sameHomeMapId,
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
 * floor's, and its room (`homeMapRoomId`, a room of the old floor) goes, so
 * it shows the whole new floor. The label, the look and every other key
 * stay. A tile of another kind, or the floor it shows already, changes
 * nothing. */
export function setWatchHomeMapFloor(document: WatchPagesDocument, pageId: string, tileId: string, floorId: string): WatchPagesDocument {
  if (typeof floorId !== "string" || floorId === "") return document;
  return editTile(document, pageId, tileId, (tile) => {
    const now = watchHomeMapFloorId(tile);
    if (now === undefined || now === floorId) return tile;
    return withKey(withoutKey(tile, WATCH_HOME_MAP_ROOM_KEY), "entityId", watchHomeMapEntityId(floorId));
  });
}

// ── one room ─────────────────────────────────────────────────────────────

/** The tile key that holds the one room a Home map tile shows, on both
 * devices: the id of a room of the tile's floor. Absent is the whole floor.
 * A room the floor no longer has also draws the whole floor. */
export const WATCH_HOME_MAP_ROOM_KEY = "homeMapRoomId";

/** The Room menu's entry that removes the key. */
export const WATCH_HOME_MAP_WHOLE_FLOOR_TEXT = "Whole floor";

/** The line under the Room menu. */
export const WATCH_HOME_MAP_ROOM_HINT = "Pick a room to draw only that room, as large as the tile allows.";

/** The room id a Home map tile stores (`homeMapRoomId`), or undefined for
 * none, a blank one or one that is not a string. */
export function watchHomeMapRoomId(tile: Record<string, unknown>): string | undefined {
  const value = tile[WATCH_HOME_MAP_ROOM_KEY];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** The room a Home map tile shows, when its floor has the room it names. */
export function watchHomeMapRoomOf(tile: Record<string, unknown>, floor: HomeMapFloor | undefined): HomeMapRoom | undefined {
  const id = watchHomeMapRoomId(tile);
  return id === undefined ? undefined : floor?.rooms.find((r) => sameHomeMapId(r.id, id));
}

/**
 * The floor a Home map tile draws: its floor cut down to its room
 * (`homeMapRoomFloor`: that room alone and the pins in it) when it names a
 * room its floor has, else its whole floor. The plan, the lit rooms, the
 * lights on and the fit are all read from this, so a room fills the tile.
 * Undefined when the map has no such floor.
 */
export function watchHomeMapDrawnFloor(tile: Pick<WatchPageTile, "entityId"> & Record<string, unknown>, doc: HomeMapDocument | null | undefined): HomeMapFloor | undefined {
  const floor = watchHomeMapFloorOf(tile, doc);
  if (floor === undefined) return undefined;
  return homeMapRoomFloor(floor, watchHomeMapRoomId(tile)) ?? floor;
}

/** A room's name in the Room menu: its own, or "Room N" by its place on
 * the floor (the first room 1) for one with none. */
export function watchHomeMapRoomMenuName(floor: HomeMapFloor, room: HomeMapRoom): string {
  const name = room.name?.trim() ?? "";
  return name !== "" ? name : `Room ${floor.rooms.indexOf(room) + 1}`;
}

/**
 * The Room menu: "Whole floor" (the key removed), then each room of the
 * tile's floor by name in the map's order, the tile's own picked. A room
 * the tile names that the floor does not have is shown first, disabled, as
 * "Not on the map", until another is picked. Undefined while the map does
 * not have the tile's floor.
 */
export function watchHomeMapRoomMenu(tile: WatchPageTile, doc: HomeMapDocument | null | undefined): WatchMenu | undefined {
  const floor = watchHomeMapFloorOf(tile, doc);
  if (floor === undefined) return undefined;
  const t = tile as WatchPageTile & Record<string, unknown>;
  const options = [
    { value: "", label: WATCH_HOME_MAP_WHOLE_FLOOR_TEXT },
    ...floor.rooms.map((room) => ({ value: room.id, label: watchHomeMapRoomMenuName(floor, room) })),
  ];
  const id = watchHomeMapRoomId(t);
  if (id === undefined) return { options, selected: "" };
  const room = watchHomeMapRoomOf(t, floor);
  if (room === undefined) {
    const stored = `stored:${id}`;
    return { options: [{ value: stored, label: WATCH_HOME_MAP_MISSING_TEXT, disabled: true }, ...options], selected: stored };
  }
  return { options, selected: room.id };
}

/** Show one room of a Home map tile's floor (stores its id), or the whole
 * floor (undefined or blank removes the key). A tile of another kind, or
 * the room it shows already, changes nothing. */
export function setWatchHomeMapRoom(document: WatchPagesDocument, pageId: string, tileId: string, roomId: string | undefined): WatchPagesDocument {
  const id = typeof roomId === "string" && roomId.trim() !== "" ? roomId : undefined;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isWatchHomeMapTile(tile)) return tile;
    if (id === undefined) return Object.hasOwn(tile, WATCH_HOME_MAP_ROOM_KEY) ? withoutKey(tile, WATCH_HOME_MAP_ROOM_KEY) : tile;
    return (tile as Record<string, unknown>)[WATCH_HOME_MAP_ROOM_KEY] === id ? tile : withKey(tile, WATCH_HOME_MAP_ROOM_KEY, id);
  });
}

/** A Home map tile's title: its own label, else the name of the room it
 * shows, else its floor's name, else "Home map". */
export function watchHomeMapTileTitle(tile: Pick<WatchPageTile, "entityId" | "customLabel"> & Record<string, unknown>, doc: HomeMapDocument | null | undefined): string {
  const label = typeof tile.customLabel === "string" ? tile.customLabel.trim() : "";
  if (label !== "") return label;
  const floor = watchHomeMapFloorOf(tile, doc);
  const room = watchHomeMapRoomOf(tile, floor)?.name?.trim() ?? "";
  if (room !== "") return room;
  const floorName = floor?.name.trim() ?? "";
  return floorName !== "" ? floorName : "Home map";
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
 * is the home style's look (plan when the map has none). */
export const WATCH_HOME_MAP_LOOK_KEY = "homeMapLook";

/** A Home map tile's look: `plan`, the floor from above like the iPhone's
 * Flat view; `night`, `warm`, `lines`, `clay` and `blueprint`, the floor as
 * a small model turned and tipped back; `dots`, a plain gray plan with every
 * light a dot. */
export type WatchHomeMapLook = HomeTileLook;

/** The Look choice, in its order. */
export const WATCH_HOME_MAP_LOOKS: [WatchHomeMapLook, string][] = [
  ["plan", "Plan"],
  ["night", "Night"],
  ["warm", "Warm"],
  ["lines", "Lines"],
  ["clay", "Clay"],
  ["blueprint", "Blueprint"],
  ["dots", "Dots"],
];

/** The looks drawn as a small model, the ones the Turn applies to. */
export const WATCH_HOME_MAP_MODEL_LOOKS: readonly WatchHomeMapLook[] = HOME_TILE_MODEL_LOOKS;

/** Whether a look is drawn as a small model. */
export function isWatchHomeMapModelLook(look: WatchHomeMapLook): boolean {
  return WATCH_HOME_MAP_MODEL_LOOKS.includes(look);
}

/** The line under the Look choice. */
export const WATCH_HOME_MAP_LOOK_HINTS: Record<WatchHomeMapLook, string> = {
  plan: "The floor from above, as the iPhone's Flat view draws it: wood, tile and stone floors, walls, windows, furniture and a warm pool round each light that is on.",
  night: "A small model at night: dark rooms, and warm pools of light where a light is on.",
  warm: "A small model at night: wood floors, furniture and warm lamplight.",
  lines: "A small model drawn in thin glowing amber lines on black.",
  clay: "A small white model in soft daylight.",
  blueprint: "A small blue model with pale lines, a measuring grid and, for one room, its sizes.",
  dots: "A plain gray plan where every light is a dot: yellow when it is on, gray when it is off.",
};

/** A Home map tile's look by the tile rule: its own `homeMapLook` (the older
 * glow read as plan and dollhouse as warm), else the home style's, else
 * plan. An unknown look counts as none. */
export function watchHomeMapLook(tile: Record<string, unknown>, home?: HomeMapDocument | null): WatchHomeMapLook {
  return tileOptionsResolved(tile, home).look;
}

/**
 * Set a tile key that follows the home style: the home style's value
 * (`def`) removes the key, any other value stores it. A tile of another
 * kind, or one that already stores exactly what this would, changes
 * nothing.
 */
function setHomeMapKey(document: WatchPagesDocument, pageId: string, tileId: string, key: string, value: unknown, def: unknown): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isWatchHomeMapTile(tile)) return tile;
    const has = Object.hasOwn(tile, key);
    if (value === def) return has ? withoutKey(tile, key) : tile;
    return has && (tile as Record<string, unknown>)[key] === value ? tile : withKey(tile, key, value);
  });
}

/** Set a Home map tile's look: the home style's look removes the key, any
 * other look stores it (an older glow or dollhouse is written over). A tile
 * of another kind, or a look it stores, changes nothing. */
export function setWatchHomeMapLook(document: WatchPagesDocument, pageId: string, tileId: string, look: WatchHomeMapLook, home?: HomeMapDocument | null): WatchPagesDocument {
  if (!WATCH_HOME_MAP_LOOKS.some(([l]) => l === look)) return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_LOOK_KEY, look, homeStyleOf(home).look);
}

// ── the map's other options ─────────────────────────────────────────────

/** The tile key that holds the model's turn, in whole degrees. */
export const WATCH_HOME_MAP_TURN_KEY = "homeMapTurn";

/** The turn a tile that stores none draws at, as the iPhone's 3D view first
 * frames a floor. */
export const WATCH_HOME_MAP_DEFAULT_TURN = HOME_TILE_DEFAULT_TURN;

/** A turn as a tile keeps it: whole degrees from -180 to 180. Undefined for
 * a value that is not a finite number. */
export function watchHomeMapTurnOf(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const turn = Math.round(Math.min(180, Math.max(-180, value)));
  return turn === 0 ? 0 : turn;
}

/** A Home map tile's turn (`homeMapTurn`) by the tile rule: its own, else
 * the home style's, else -28; a value that is not a number counts as
 * none. */
export function watchHomeMapTurn(tile: Record<string, unknown>, home?: HomeMapDocument | null): number {
  return tileOptionsResolved(tile, home).turn;
}

/** Set a Home map tile's turn, clamped to -180...180 and rounded to whole
 * degrees: the home style's turn removes the key. A value that is not a
 * number changes nothing. */
export function setWatchHomeMapTurn(document: WatchPagesDocument, pageId: string, tileId: string, degrees: number, home?: HomeMapDocument | null): WatchPagesDocument {
  const turn = watchHomeMapTurnOf(degrees);
  if (turn === undefined) return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_TURN_KEY, turn, homeStyleOf(home).turn);
}

/** The tile key that turns the room names off, or on over a home style
 * that hides them. */
export const WATCH_HOME_MAP_NAMES_KEY = "homeMapNames";

/** Whether a Home map tile draws its room names (`homeMapNames`) by the
 * tile rule. */
export function watchHomeMapNames(tile: Record<string, unknown>, home?: HomeMapDocument | null): boolean {
  return tileOptionsResolved(tile, home).names;
}

/** Show or hide the room names: the home style's choice removes the key,
 * the other stores it. */
export function setWatchHomeMapNames(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean, home?: HomeMapDocument | null): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_NAMES_KEY, on, homeStyleOf(home).names);
}

/** The tile key that says which devices a Home map tile draws. */
export const WATCH_HOME_MAP_DEVICES_KEY = "homeMapDevices";

/** Which devices a Home map tile draws: the lights as glowing dots, every
 * pin with its icon and reading, or none. */
export type WatchHomeMapDevices = HomeTileDevices;

/** The Devices choice, in its order. */
export const WATCH_HOME_MAP_DEVICES: [WatchHomeMapDevices, string][] = [
  ["lights", "Lights"],
  ["all", "All"],
  ["none", "None"],
];

/** The line under the Devices choice. */
export const WATCH_HOME_MAP_DEVICES_HINTS: Record<WatchHomeMapDevices, string> = {
  lights: "Each light that is on glows as a dot.",
  all: "Every device on the map as a small pin with its icon, and its reading under it when it has one.",
  none: "No pins or dots, only the plan and its light.",
};

/** A Home map tile's devices (`homeMapDevices`) by the tile rule; an
 * unknown value counts as none. */
export function watchHomeMapDevices(tile: Record<string, unknown>, home?: HomeMapDocument | null): WatchHomeMapDevices {
  return tileOptionsResolved(tile, home).devices;
}

/** Set a Home map tile's devices: the home style's removes the key. */
export function setWatchHomeMapDevices(document: WatchPagesDocument, pageId: string, tileId: string, devices: WatchHomeMapDevices, home?: HomeMapDocument | null): WatchPagesDocument {
  if (!WATCH_HOME_MAP_DEVICES.some(([d]) => d === devices)) return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_DEVICES_KEY, devices, homeStyleOf(home).devices);
}

/** The tile key that turns the furniture off, or on over a home style
 * that hides it. */
export const WATCH_HOME_MAP_FURNITURE_KEY = "homeMapFurniture";

/** Whether a Home map tile draws the scan's furniture (`homeMapFurniture`)
 * by the tile rule. */
export function watchHomeMapFurniture(tile: Record<string, unknown>, home?: HomeMapDocument | null): boolean {
  return tileOptionsResolved(tile, home).furniture;
}

/** Show or hide the furniture: the home style's choice removes the key. */
export function setWatchHomeMapFurniture(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean, home?: HomeMapDocument | null): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_FURNITURE_KEY, on, homeStyleOf(home).furniture);
}

/** The tile key that turns the light's glow off, or on over a home style
 * without it. */
export const WATCH_HOME_MAP_GLOW_KEY = "homeMapGlow";

/** Whether a Home map tile draws its pools of light, the lit rooms' tint and
 * the wash up their walls (`homeMapGlow`) by the tile rule. */
export function watchHomeMapGlow(tile: Record<string, unknown>, home?: HomeMapDocument | null): boolean {
  return tileOptionsResolved(tile, home).glow;
}

/** Show or hide the light's glow: the home style's choice removes the
 * key. */
export function setWatchHomeMapGlow(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean, home?: HomeMapDocument | null): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return setHomeMapKey(document, pageId, tileId, WATCH_HOME_MAP_GLOW_KEY, on, homeStyleOf(home).glow);
}

// ── the home style ──────────────────────────────────────────────────────

/** The Map card's note while a tile has none of the six look keys. */
export const WATCH_HOME_MAP_FOLLOWS_TEXT = "Follows the home style";

/** The Map card's way back to the home style. */
export const WATCH_HOME_MAP_USE_HOME_STYLE_TEXT = "Use the home style";

/** The line under the note and the button. */
export const WATCH_HOME_MAP_HOME_STYLE_HINT = "The home style is set in the Home map's Style. A choice here that differs from it is kept for this tile alone.";

/** Whether a Home map tile has none of the six look keys, so it draws the
 * home style. */
export function watchHomeMapFollowsHomeStyle(tile: Record<string, unknown>): boolean {
  return !tileHasOwnStyle(tile);
}

/** Use the home style: a Home map tile without any of its six look keys. A
 * tile of another kind, or one with none, changes nothing. */
export function useWatchHomeMapHomeStyle(document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => (!isWatchHomeMapTile(tile) || !tileHasOwnStyle(tile) ? tile : withoutTileStyle(tile)));
}

/** The lines under the Map card's switches. */
export const WATCH_HOME_MAP_OPTION_HINTS = {
  turn: "How far the model is turned. -28° frames it as the iPhone's 3D view does.",
  names: "Each room's name on a small pill, where it fits and the tile is tall enough.",
  furniture: "The furniture the scan found.",
  glow: "Pools of light on the floor round each light that is on.",
} as const;

/** Everything a Home map tile's picture reads from the tile and the map's
 * home style by the tile rule, in one place for the face and the Map card's
 * pictures. */
export function watchHomeMapArtOptions(tile: Record<string, unknown>, home?: HomeMapDocument | null) {
  return {
    ...tileOptionsResolved(tile, home),
    tapLights: tile[WATCH_HOME_MAP_TAP_LIGHTS_KEY] === true,
  };
}

/** The words under a Home map tile's picture: how many of its floor's
 * lights are on, or why there is no picture. */
export function watchHomeMapTileWords(floor: HomeMapFloor | undefined, states: HomeMapStates | undefined, mapRead: boolean): string {
  if (floor === undefined) return mapRead ? WATCH_HOME_MAP_MISSING_TEXT : "Home map";
  return homeMapLightsOnWords(homeMapLightsOn(floor, states));
}

/** The summary a folded Floor card shows: the floor's name, and the room's
 * when the tile shows one. */
export function watchHomeMapFloorSummary(tile: WatchPageTile, doc: HomeMapDocument | null | undefined): string {
  if (doc === undefined || doc === null) return "";
  const floor = watchHomeMapFloorOf(tile, doc);
  if (floor === undefined) return WATCH_HOME_MAP_MISSING_TEXT;
  const room = watchHomeMapRoomOf(tile as WatchPageTile & Record<string, unknown>, floor);
  return room === undefined ? homeMapFloorName(floor) : `${homeMapFloorName(floor)} · ${watchHomeMapRoomMenuName(floor, room)}`;
}
