// Point a tile at another Home Assistant entity, from the Entity row of What
// it does. The tile stays where it is, with its id, so its place on both
// screens and its picture settings stay with it.
//
// What follows the entity:
//  - The name, icon and color, but only while they are the old entity's own
//    defaults. One the user chose stays.
//  - The keys that describe the old entity or its device (`DEVICE_KEYS`) go in
//    every case: a vacuum's battery sensor is no use on another vacuum, and the
//    watch reads `capabilities` as the entity's own.
//  - Another kind of tile (a switch to a light) also loses every key that only
//    the old kind reads (`isKindKey`), its tap and hold included, and takes the
//    new kind's starting keys. Its look, place and visibility stay.
//
// Without any drawing, in the shape of `tile-settings-model.ts`: a setter
// refuses by returning the document it was given.

import { findWatchPage } from "./edit.js";
import { type WatchPageTile, type WatchPagesDocument, isJsonObject, isVirtualTileKind, tileEntityId, tileKind } from "./model.js";
import { editTile, withKey, withOptional, withoutKey } from "./tile-settings-model.js";
import { sameWatchColor } from "./tile-settings-options.js";
import { type WatchEntityAdd, WATCH_TILE_DEFAULTS, newWatchEntityTile, watchAddableDomain, watchCalendarColor, watchEntityDefaults, watchEntityLabel } from "./tile-new.js";

/** The domains the Entity row offers: the ones a tile can be added for. */
export const WATCH_TILE_ENTITY_DOMAINS: readonly string[] = WATCH_TILE_DEFAULTS.addable.map((a) => a.domain);

/** Keys that hold something about the old entity or its device. */
const DEVICE_KEYS: ReadonlySet<string> = new Set([
  "capabilities",
  "associatedMediaPlayerId",
  "associatedVolumePlayerId",
  "mowerBatteryEntityId",
  "vacuumBatteryEntityId",
  "vacuumCleaningModeEntityId",
  "vacuumExtraSelectEntityId",
  "vacuumExtraSelectLabel",
  "vacuumFanSpeedEntityId",
  "vacuumSwitchEntityIds",
]);

/** Keys only some kinds of tile read, by name (`page-keys.json`). A key that
 * is not listed here is about the tile's look, place or visibility, and stays,
 * so a key from a newer app is never lost. */
const KIND_KEYS: ReadonlySet<string> = new Set([
  "additionalCalendarEntityIds",
  "autoCloseMacroRun",
  "autoSubmitPIN",
  "automationSkipConditionOverride",
  "calendarSourceColors",
  "decimalPlaces",
  "mediaArtwork",
  "peekDisableAnimation",
  "sensorChart",
  "showActivityStatus",
  "showAlbumArt",
  "showBatteryOnTile",
  "showCurrentTempOnTile",
  "showTargetTempOnTile",
  "singleTapAction",
  "stateColorRules",
  "stateColors",
  "stateIcons",
  "usePersonPhoto",
  "usesStateIcons",
]);
const KIND_KEY_PREFIXES = /^(assist|broadcast|camera|chart|holdSlide|homeMap|http|macro|map|multiCam|musicHub|remote|speakMessage|template|text|vacuum|weather|web)[A-Z]/;

function isKindKey(key: string): boolean {
  return DEVICE_KEYS.has(key) || KIND_KEYS.has(key) || KIND_KEY_PREFIXES.test(key);
}

/** Whether a tile can point at this id: a full entity id of a domain a tile can
 * be added for. The app's own kinds (`page.`, `spacer.`) are never one. */
export function isWatchTileEntityChoice(entityId: string): boolean {
  return /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(entityId) && !isVirtualTileKind(tileKind(entityId)) && watchAddableDomain(entityId) !== undefined;
}

/** The label moves on while it is the old entity's friendly name or the name
 * made from its id. Absent or empty, the tile already reads its entity's name. */
function followLabel(tile: WatchPageTile, next: WatchEntityAdd, old: WatchEntityAdd): WatchPageTile {
  const label = tile.customLabel;
  if (typeof label !== "string" || label === "") return tile;
  if (label !== watchEntityLabel(old.entityId, old.friendlyName) && label !== watchEntityLabel(old.entityId)) return tile;
  return withKey(tile, "customLabel", watchEntityLabel(next.entityId, next.friendlyName));
}

/** The calendar a tile shows first takes the place of the old one: the old
 * one's color goes, the new one's stays or is made, and it is not an extra too. */
function followCalendar(tile: WatchPageTile, nextId: string, oldId: string): WatchPageTile {
  const colors = isJsonObject(tile.calendarSourceColors) ? { ...tile.calendarSourceColors } : {};
  delete colors[oldId];
  colors[nextId] ??= watchCalendarColor(nextId);
  const extras = Array.isArray(tile.additionalCalendarEntityIds) ? tile.additionalCalendarEntityIds.filter((id) => id !== nextId) : [];
  const next = withKey(tile, "calendarSourceColors", colors);
  return extras.length === 0 ? withoutKey(next, "additionalCalendarEntityIds") : withKey(next, "additionalCalendarEntityIds", extras);
}

/**
 * Point a tile at `next`, `old` being what Home Assistant says of the entity it
 * shows now (`watchEntityAddFromHass`). Refused for a tile of one of the app's
 * own kinds, for an id `isWatchTileEntityChoice` turns down, and for the entity
 * it already shows.
 */
export function setWatchTileEntity(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  next: WatchEntityAdd,
  old: WatchEntityAdd,
): WatchPagesDocument {
  const nextId = next.entityId;
  if (!isWatchTileEntityChoice(nextId)) return document;
  const page = findWatchPage(document, pageId);
  return editTile(document, pageId, tileId, (tile) => {
    const oldId = tileEntityId(tile);
    if (oldId === nextId || oldId !== old.entityId || isVirtualTileKind(tileKind(oldId))) return tile;
    const sameKind = tileKind(oldId) === tileKind(nextId);
    const owned = (key: string) => (sameKind ? DEVICE_KEYS.has(key) : isKindKey(key));
    const fresh = newWatchEntityTile(next, page);
    let out = withKey(tile, "entityId", nextId);
    for (const key of Object.keys(tile)) if (owned(key)) out = withoutKey(out, key);
    for (const [key, value] of Object.entries(fresh)) if (owned(key)) out = withKey(out, key, value);
    out = followLabel(out, next, old);
    const before = watchEntityDefaults(old, page);
    const after = watchEntityDefaults(next, page);
    if (typeof tile.icon === "string" && tile.icon === before.icon) out = withOptional(out, "icon", after.icon);
    if (before.color !== undefined && sameWatchColor(tile.color, before.color)) out = withOptional(out, "color", after.color);
    return sameKind && tileKind(nextId) === "calendar" ? followCalendar(out, nextId, oldId) : out;
  });
}
