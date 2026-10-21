// The tile keys only the iPhone reads, on tiles both devices draw: a live
// camera and the stream it plays, a chart under a sensor, a media player's
// artwork and controls, and a template's line limit. Without any drawing:
// which tile gets which key, what each one reads as, and the setters.
//
// The keys are the device table's (`tile-devices.json` `keys`); each one's
// rule lives in the table of the task it sits beside: `cameraTileLive`,
// `cameraTileStream` and `cameraFullScreenStream` in `tile-special.json`
// (`camera.live`, `camera.stream`, `camera.fullScreen`),
// `templateLines` in `tile-app.json`
// (`template.lines`), `sensorChart` and `mediaArtwork` in `tile-styling.json`
// (`phone`). The watch decodes them and reads none, so nothing here changes
// what a watch shows.
//
// Plan: app repo docs/phone_native_pages_plan_2026-10.md, phase 2; the names
// in docs/phone_native_contract.md.

import tileApp from "./tile-app.json";
import tileSpecial from "./tile-special.json";
import tileStyling from "./tile-styling.json";
import { REMOVE, isBool, setKey } from "./tile-settings-model.js";
import { isWatchTvRemote, type WatchSpecialStates } from "./special-model.js";
import { type WatchPageTile, type WatchPagesDocument, keyDevices, tileEntityId, tileKind } from "./model.js";

/** A tile key only the iPhone reads, in the order the inspector lists them. */
export type WatchPhoneKey = "cameraTileLive" | "cameraTileStream" | "cameraFullScreenStream" | "sensorChart" | "mediaArtwork" | "templateLines";

/** One choice of the chart's range: a value of `TileHistoryRange`, or null
 * for Off (no key). */
export interface WatchPhoneChoice {
  value: string | null;
  label: string;
}

interface PhoneKeyRule {
  key: WatchPhoneKey;
  kinds: readonly string[];
}

const LIVE = tileSpecial.camera.live as PhoneKeyRule & { absent: boolean };
const STREAM = tileSpecial.camera.stream as PhoneKeyRule & { absent: string; choices: { value: string; label: string }[] };
const FULL_SCREEN = tileSpecial.camera.fullScreen as PhoneKeyRule & { absent: string; choices: { value: string; label: string }[] };
const LINES = tileApp.template.lines as PhoneKeyRule & { min: number; max: number; absent: number };
const CHART = tileStyling.phone.sensorChart as PhoneKeyRule & { choices: WatchPhoneChoice[]; minRows: number };
const ARTWORK = tileStyling.phone.mediaArtwork as PhoneKeyRule & { absent: boolean; controlsMinColumns: number };

/** Every phone key's rule, in the inspector's order. */
const RULES: readonly PhoneKeyRule[] = [LIVE, STREAM, FULL_SCREEN, CHART, ARTWORK, LINES];

/** The keys the panel writes here, for the key tests. */
export const WATCH_PHONE_SETTING_KEYS: readonly WatchPhoneKey[] = RULES.map((r) => r.key);

/** The kinds each key is offered on, as the tables have them. */
export function watchPhoneKeyKinds(key: WatchPhoneKey): readonly string[] {
  return RULES.find((r) => r.key === key)?.kinds ?? [];
}

/** The live stream's choices, SD then HD (auto, the absent one). */
export const WATCH_CAMERA_TILE_STREAM_CHOICES: readonly { value: string; label: string }[] = STREAM.choices;

/** What a tile without the stream key plays. */
export const WATCH_CAMERA_TILE_STREAM_ABSENT = STREAM.absent;

/** The full screen stream's choices, SD then HD (the absent one). */
export const WATCH_CAMERA_FULL_SCREEN_CHOICES: readonly { value: string; label: string }[] = FULL_SCREEN.choices;

/** What full screen opens on for a tile without the key. */
export const WATCH_CAMERA_FULL_SCREEN_ABSENT = FULL_SCREEN.absent;

/** The chart's choices, Off first. */
export const WATCH_SENSOR_CHART_CHOICES: readonly WatchPhoneChoice[] = CHART.choices;

/** The rows a tile needs for the iPhone to draw its chart. */
export const WATCH_SENSOR_CHART_MIN_ROWS = CHART.minRows;

/** The columns a media tile needs for the iPhone's inline controls. */
export const WATCH_MEDIA_CONTROLS_MIN_COLUMNS = ARTWORK.controlsMinColumns;

/** The line limit's range and what an absent key reads as. */
export const WATCH_TEMPLATE_LINES = { min: LINES.min, max: LINES.max, absent: LINES.absent } as const;

/**
 * The phone keys this tile gets, in order: by its kind, and only keys the
 * device table gives the iPhone alone. A media player that is a TV drawn as
 * a remote (`isWatchTvRemote`) gets no artwork: neither device draws it as a
 * media tile.
 */
export function watchPhoneKeysOf(tile: WatchPageTile, states?: WatchSpecialStates): WatchPhoneKey[] {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  return RULES.filter((r) => {
    if (!r.kinds.includes(kind)) return false;
    const devices = keyDevices(r.key);
    if (devices.includes("watch") || !devices.includes("iphone")) return false;
    return r.key !== "mediaArtwork" || !isWatchTvRemote(entityId, states);
  }).map((r) => r.key);
}

// ── reading ──────────────────────────────────────────────────────────────

/** Live video in the tile: on only when `true` is stored. */
export function watchCameraTileLive(tile: WatchPageTile): boolean {
  return isBool(tile.cameraTileLive) ? tile.cameraTileLive : LIVE.absent;
}

/** The stream a live tile plays: the stored choice, else auto (HD). A
 * value that is not a choice, the retired main among them, reads as auto,
 * as the iPhone reads it. */
export function watchCameraTileStream(tile: WatchPageTile): string {
  const stored = tile.cameraTileStream;
  return typeof stored === "string" && STREAM.choices.some((c) => c.value === stored) ? stored : STREAM.absent;
}

/** The stream full screen opens on: the stored choice, else HD. A value
 * that is not a choice reads as HD, as the iPhone reads it. */
export function watchCameraFullScreenStream(tile: WatchPageTile): string {
  const stored = tile.cameraFullScreenStream;
  return typeof stored === "string" && FULL_SCREEN.choices.some((c) => c.value === stored) ? stored : FULL_SCREEN.absent;
}

/** The chart's stored range, or undefined for Off. A stored value that is
 * not a string reads as Off, as the iPhone's decoder drops the tile key. */
export function watchSensorChart(tile: WatchPageTile): string | undefined {
  return typeof tile.sensorChart === "string" ? tile.sensorChart : undefined;
}

/** Artwork and controls: true only when `true` is stored. */
export function watchMediaArtwork(tile: WatchPageTile): boolean {
  return isBool(tile.mediaArtwork) ? tile.mediaArtwork : ARTWORK.absent;
}

/** The stored line limit as stored, or undefined for none (5 on the
 * iPhone). */
export function watchTemplateLines(tile: WatchPageTile): unknown {
  return tile.templateLines;
}

/** Whether the tile holds a phone key of its own: one stored that reads
 * other than its absence would. */
export function watchPhoneKeyChanged(tile: WatchPageTile, key: WatchPhoneKey): boolean {
  if (!Object.hasOwn(tile, key)) return false;
  switch (key) {
    case "cameraTileLive":
      return watchCameraTileLive(tile) !== LIVE.absent;
    case "cameraTileStream":
      return watchCameraTileStream(tile) !== STREAM.absent;
    case "cameraFullScreenStream":
      return watchCameraFullScreenStream(tile) !== FULL_SCREEN.absent;
    case "mediaArtwork":
      return watchMediaArtwork(tile) !== ARTWORK.absent;
    case "sensorChart":
      return watchSensorChart(tile) !== undefined;
    case "templateLines":
      return tile.templateLines !== LINES.absent;
  }
}

// ── setters ──────────────────────────────────────────────────────────────

/** Whether `key` is offered on this tile's kind. The setters check only the
 * kind: what the states say (a TV) is the view's to decide. */
function offered(tile: WatchPageTile, key: WatchPhoneKey): boolean {
  return watchPhoneKeyKinds(key).includes(tileKind(tileEntityId(tile)));
}

/** "Live video in the tile", off by default: on writes true, off removes
 * the key. */
export function setWatchCameraTileLive(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, LIVE.key, (tile) => (offered(tile, LIVE.key) ? (on ? true : REMOVE) : undefined));
}

/** "Stream": sub (SD) writes its value, auto (HD) removes the key. A value
 * that is not a choice is refused. */
export function setWatchCameraTileStream(document: WatchPagesDocument, pageId: string, tileId: string, stream: string): WatchPagesDocument {
  if (!STREAM.choices.some((c) => c.value === stream)) return document;
  return setKey(document, pageId, tileId, STREAM.key, (tile) => (offered(tile, STREAM.key) ? (stream === STREAM.absent ? REMOVE : stream) : undefined));
}

/** "Full screen": sd writes its value, hd removes the key. A value that
 * is not a choice is refused. */
export function setWatchCameraFullScreenStream(document: WatchPagesDocument, pageId: string, tileId: string, stream: string): WatchPagesDocument {
  if (!FULL_SCREEN.choices.some((c) => c.value === stream)) return document;
  return setKey(document, pageId, tileId, FULL_SCREEN.key, (tile) => (offered(tile, FULL_SCREEN.key) ? (stream === FULL_SCREEN.absent ? REMOVE : stream) : undefined));
}

/** "Chart under the value": a range writes its value, null (Off) removes
 * the key. A value that is not a choice is refused. */
export function setWatchSensorChart(document: WatchPagesDocument, pageId: string, tileId: string, range: string | null): WatchPagesDocument {
  if (range !== null && !CHART.choices.some((c) => c.value === range)) return document;
  return setKey(document, pageId, tileId, CHART.key, (tile) => (offered(tile, CHART.key) ? (range === null ? REMOVE : range) : undefined));
}

/** "Artwork and controls": on writes true, off removes the key. */
export function setWatchMediaArtwork(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, ARTWORK.key, (tile) => (offered(tile, ARTWORK.key) ? (on ? true : REMOVE) : undefined));
}

/** "Lines": a whole number from 1 to 8; the absent value (5) removes the
 * key, so a tile left at the default carries nothing. */
export function setWatchTemplateLines(document: WatchPagesDocument, pageId: string, tileId: string, lines: number): WatchPagesDocument {
  if (!Number.isInteger(lines) || lines < LINES.min || lines > LINES.max) return document;
  return setKey(document, pageId, tileId, LINES.key, (tile) => (offered(tile, LINES.key) ? (lines === LINES.absent ? REMOVE : lines) : undefined));
}
