// The special tiles' settings, without any drawing: the phone's Remote,
// Camera (a single camera and a camera group), Vacuum, Mower, Calendars,
// Weather, Person and Alarm tasks, and their resets.
//
// The tile setters follow `tile-settings-model.ts`: they take the raw
// document, a page id and a tile id, change only the objects on the path,
// write exactly what the phone writes (a new key at its sorted place, a
// removed key deleted), and refuse by returning the document they were
// given. The whole page edits (a camera group made from camera tiles, ratio
// detection, a camera's height in a group, a group split into cameras) move
// tiles through `edit.ts`: the resize there is the phone's push down
// (`SpecialTileRules.resizePushingDown`), and a removed tile's groups are
// repaired as a delete repairs them.
//
// Every list, word, limit and rule's data comes from `tile-special.json`,
// the panel's own table; the settings
// case files in `test/fixtures-pages/settings` pin what each setter writes.
// Anything fetched (a snapshot's size, the device's entities, the players'
// features) comes in as a plain value.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 1 build
// contract".

import pageKeys from "./page-keys.json";
import tileSpecial from "./tile-special.json";
import settingsCatalog from "../watch-settings-catalog.json";
import { type WatchEditOptions, deleteWatchTile, findWatchPage, firstFreeWatchCell, previewWatchTileResize, randomWatchId, resizeWatchTile, sameWatchId, watchTileRect } from "./edit.js";
import { REMOVE, editTile, isBool, sameValue, setKey, withField, withKey, withoutKey } from "./tile-settings-model.js";
import { WATCH_TILE_DEFAULTS, watchCalendarColor, watchCapitalized, watchEntityDefaults, watchFreshTile, watchThemeSwatches } from "./tile-new.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, WATCH_GRID_COLUMNS, isJsonObject, isSmartWatchPage, tileEntityId, tileKind, tileTarget } from "./model.js";

// ── the table ────────────────────────────────────────────────────────────

/** A value and the words the phone shows for it. */
export interface WatchSpecialChoice<V = string> {
  value: V;
  label: string;
}

/** A button kind of the remote's layout. */
export interface WatchRemoteButtonKind {
  value: string;
  label: string;
  symbol: string;
  category: string;
}

/** One way a button kind is available; every field set must hold. */
interface ButtonCondition {
  player?: "media" | "volume";
  bit?: number;
  fallback?: string;
  needsAttribute?: string;
  nativeMute?: boolean;
}

type Size = [number, number];

/** The special task of a tile: the phone's `EditorTask` raw value. The app
 * kinds' tasks (`template`, `musicHub`, the inbox's, and `data` for assist,
 * speak message and point control) are drawn by `app-settings.ts`. */
export type WatchSpecialTask = "data" | "inbox" | "alarm" | "camera" | "musicHub" | "calendarSettings" | "weather" | "person" | "template";

interface SpecialTable {
  version: number;
  tasks: { order: WatchSpecialTask[]; kinds: Record<string, { task: WatchSpecialTask; title: string }> };
  remote: {
    slotCount: number;
    kinds: WatchRemoteButtonKind[];
    defaultLayout: string[];
    availability: { kinds: Record<string, { anyOf: ButtonCondition[]; reason: { linked: string; unlinked: string } }> };
    platforms: { value: string; contains: string[]; nativeMute: boolean }[];
    launcher: { icon: string; color: string };
    inputDefaults: {
      remoteCrownSelectEnabled: boolean;
      remoteCrownBackEnabled: boolean;
      remoteEdgeVolumeEnabled: boolean;
      remoteEdgeVolumeSide: string;
      remoteQuickActionConfirm: boolean;
    };
    edgeSides: WatchSpecialChoice[];
  };
  camera: {
    displayModes: WatchSpecialChoice[];
    fillModes: WatchSpecialChoice[];
    fillAbsent: { single: string; cell: string };
    offset: { step: number; limit: number };
    refresh: { key: string; choices: { value: boolean | null; label: string; labelWhenOff?: string }[] };
    bestFitCandidates: Size[];
    suggestionBands: { above: number | null; sizes: Size[] }[];
    ratioNames: { ratio: number; name: string }[];
    detectFallbackRatio: number;
  };
  multicam: {
    newTile: { entityIdPrefix: string; icon: string; hex: string; displayMode: string; colSpan: number; rowSpan: number };
    labels: { joinMerge: string; joinRemove: string; manyAbove: number; many: string };
    weight: { step: number; min: number };
    rowSpanMin: number;
    borderThicknesses: WatchSpecialChoice[];
    borderDefaults: { multiCamBorderEnabled: boolean; multiCamBorderColor: string; multiCamBorderThickness: string };
    unmergeTile: { icon: string; colSpan: number; rowSpan: number; displayMode: string };
  };
  vacuum: {
    selectDomains: string[];
    batteryDeviceClass: string;
    slots: { slot: WatchVacuumSlot; key: string; picker: string; noneLabel: string }[];
    extraLabelFallback: string;
  };
  mower: { fallbackBatteryId: string };
  weather: {
    textScale: { key: string; min: number; max: number; step: number; auto: number };
    showIcons: { key: string; absent: boolean };
  };
  person: {
    key: string;
    choices: { value: boolean; label: string; icon: string }[];
    /** The watch's `resolvedUsePersonPhoto` with no stored choice. */
    absentSamples: { icon: string | null; stateIcons: Record<string, string> | null; photo: boolean }[];
  };
  alarm: { key: string; absent: boolean };
  resets: Record<string, Record<string, unknown>>;
}

/** The table as the app wrote it. */
export const WATCH_SPECIAL: Readonly<SpecialTable> = tileSpecial as unknown as SpecialTable;
const T = WATCH_SPECIAL;
const COLUMNS = WATCH_GRID_COLUMNS;

// ── page-keys.json: the special keys' defaults and value checks ─────────

interface KeySpec {
  type: string;
  of?: string;
  enum?: string;
  strict?: boolean;
  empty?: boolean;
  default?: unknown;
}

const KEYS = pageKeys as unknown as { enums: Record<string, string[]>; types: { tile: { keys: Record<string, KeySpec> } } };
const TILE_KEYS = KEYS.types.tile.keys;

/** A tile key's spec in `page-keys.json`, or undefined. */
export function watchTileKeySpec(key: string): Readonly<KeySpec> | undefined {
  return Object.hasOwn(TILE_KEYS, key) ? TILE_KEYS[key] : undefined;
}

/** What the watch and the phone make of an absent tile key, by
 * `page-keys.json`; undefined when it names none. */
export function watchTileKeyDefault(key: string): unknown {
  return watchTileKeySpec(key)?.default;
}

const HEX_COLOR = /^#?[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;

function colorAccepted(value: unknown, empty: boolean): boolean {
  if (typeof value !== "string") return false;
  if (value === "") return empty;
  if (value === "#RAINBOW" || HEX_COLOR.test(value)) return true;
  const parts = value.split("|");
  return parts.length === 3 && parts[0] === "GRADIENT" && HEX_COLOR.test(parts[1]!) && HEX_COLOR.test(parts[2]!);
}

function scalarAccepted(type: string, spec: KeySpec, value: unknown): boolean {
  switch (type) {
    case "bool":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "int":
      return Number.isInteger(value);
    case "string":
    case "symbol":
      return typeof value === "string";
    case "entity":
      return typeof value === "string" && value.includes(".");
    case "color":
      return colorAccepted(value, spec.empty === true);
    case "enum": {
      if (typeof value !== "string") return false;
      if (spec.strict === false) return true;
      return (KEYS.enums[spec.enum ?? ""] ?? []).includes(value);
    }
    default:
      return true;
  }
}

/**
 * Whether a value is one the phone decodes for this tile key, by its
 * `page-keys.json` type: a list or map checks each element by `of`, and
 * `empty: true` lets a color element be `""` (`remoteLauncherColors`, whose
 * `""` is the remote's accent). A key the table does not have is refused.
 */
export function watchTileKeyAccepts(key: string, value: unknown): boolean {
  const spec = watchTileKeySpec(key);
  if (spec === undefined) return false;
  if (spec.type === "array") return Array.isArray(value) && value.every((v) => scalarAccepted(spec.of ?? "", spec, v));
  if (spec.type === "map") {
    return isJsonObject(value) && Object.values(value).every((v) => scalarAccepted(spec.of ?? "", spec, v));
  }
  return scalarAccepted(spec.type, spec, value);
}

// ── small readers ────────────────────────────────────────────────────────

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function strings(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : undefined;
}

/** A list as stored: undefined when absent or not a list. */
function list(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function kindOf(tile: WatchPageTile): string {
  return tileKind(tileEntityId(tile));
}

function isKind(...kinds: string[]): (tile: WatchPageTile) => boolean {
  return (tile) => kinds.includes(kindOf(tile));
}

const isRemoteLike = isKind("remote", "media_player");
const isCamera = isKind("camera");
const isGroup = isKind("multicam");
const isCameraLike = isKind("camera", "multicam");

/** The object id made readable, as the remove, the unmerge and discovery
 * name an entity: the text after the last dot, `_` as spaces, in
 * Foundation's `capitalized`. */
export function watchObjectName(entityId: string): string {
  const last = entityId.split(".").pop() ?? "";
  return watchCapitalized(last.replaceAll("_", " "));
}

/** A camera's name in a merge or an add label: the id without `camera.`. */
function mergeName(cameraId: string): string {
  const name = cameraId.startsWith("camera.") ? cameraId.slice("camera.".length) : cameraId;
  return watchCapitalized(name.replaceAll("_", " "));
}

/** A merge's or an add's label: three cameras or fewer by name, joined
 * `", "`; else "<n> Cameras". */
export function watchCameraGroupLabel(cameraIds: readonly string[]): string {
  const l = T.multicam.labels;
  return cameraIds.length <= l.manyAbove ? cameraIds.map(mergeName).join(l.joinMerge) : l.many.replace("<n>", String(cameraIds.length));
}

/** A remove's label: every camera left by its object id, joined `" + "`. */
function removeLabel(cameraIds: readonly string[]): string {
  return cameraIds.map(watchObjectName).join(T.multicam.labels.joinRemove);
}

// ── tasks ────────────────────────────────────────────────────────────────

/** What a states map holds, as far as these rules read it. */
export type WatchSpecialStates = Readonly<Record<string, { state?: unknown; attributes?: Readonly<Record<string, unknown>> } | undefined>>;

function stateOf(states: WatchSpecialStates | undefined, entityId: string) {
  return states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
}

/**
 * A `media_player.` the watch draws as a remote, by the watch's two rules:
 *
 * - `device_class` `tv` and no `remote.` of the same object id
 *   (`HomeAssistantAPI.fetchRemotes`, the phone's `isTVRemote`);
 * - an id that, lower cased, contains `lg` or `webos`: the watch takes it for
 *   a webOS TV and registers it as a remote whatever its state says
 *   (`RemotePlatform.detect` in the app's `WristAssistant Watch App/Models/
 *   RemoteEntity.swift`, used by `EntityStateViewModel`). The phone editor
 *   and `tile-special.json` know only the first rule.
 */
export function isWatchTvRemote(entityId: string, states: WatchSpecialStates | undefined): boolean {
  if (tileKind(entityId) !== "media_player") return false;
  const id = entityId.toLowerCase();
  if (id.includes("lg") || id.includes("webos")) return true;
  if (stateOf(states, entityId)?.attributes?.device_class !== "tv") return false;
  return !Object.hasOwn(states ?? {}, `remote.${tileTarget(entityId)}`);
}

/** The special task a tile gets, its title and the table kind it is read
 * as; undefined for a tile with none. A TV media player is a remote. */
export function watchSpecialTask(
  tile: WatchPageTile,
  states?: WatchSpecialStates,
): { task: WatchSpecialTask; title: string; kind: string } | undefined {
  const entityId = tileEntityId(tile);
  const kind = isWatchTvRemote(entityId, states) ? "remote" : tileKind(entityId);
  const entry = Object.hasOwn(T.tasks.kinds, kind) ? T.tasks.kinds[kind] : undefined;
  return entry === undefined ? undefined : { task: entry.task, title: entry.title, kind };
}

// ── whole page plumbing ──────────────────────────────────────────────────

/** A page whose tiles may be edited, with its tiles. */
function editablePage(document: WatchPagesDocument, pageId: string): WatchPage | undefined {
  const page = findWatchPage(document, pageId);
  if (page === undefined || isSmartWatchPage(page) || !Array.isArray(page.items)) return undefined;
  return page;
}

function tileOn(page: WatchPage, tileId: string): WatchPageTile | undefined {
  return (page.items as unknown[]).find((t): t is WatchPageTile => isJsonObject(t) && sameWatchId(t.id, tileId));
}

/** The document with a tile appended to a page's `items` as it is. */
function appendTile(document: WatchPagesDocument, pageId: string, tile: WatchPageTile): WatchPagesDocument {
  const pages = document.pages as unknown[];
  const index = pages.findIndex((p) => isJsonObject(p) && sameWatchId(p.id, pageId));
  const page = pages[index] as WatchPage;
  const nextPages = pages.slice();
  nextPages[index] = { ...page, items: [...(page.items as unknown[]), tile] };
  return { ...document, pages: nextPages };
}

function newIdFrom(options: WatchEditOptions | undefined): string {
  return (options?.newId ?? randomWatchId)().toUpperCase();
}

/** Why a resize a special edit asked for was not made: the tile would still
 * overlap a tile that starts above it (the push down never moves a tile up),
 * or a tile would end past the last row. */
export type WatchSpecialResizeRefusal = "overlap" | "end";

export interface WatchSpecialResize {
  document: WatchPagesDocument;
  refused?: WatchSpecialResizeRefusal;
}

type Rect = { col: number; row: number; colSpan: number; rowSpan: number };

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.row < b.row + b.rowSpan && a.row + a.rowSpan > b.row && a.col < b.col + b.colSpan && a.col + a.colSpan > b.col;
}

/** The ids of the tiles of a page a tile at `rect` overlaps, itself left
 * out. */
function overlappedIds(page: WatchPage, tileId: string, rect: Rect): string[] {
  return (page.items as unknown[])
    .filter((t): t is WatchPageTile => isJsonObject(t) && !sameWatchId(t.id, tileId) && rectsOverlap(rect, watchTileRect(t)))
    .map((t) => String(t.id).toUpperCase());
}

/**
 * Change a tile's keys and resize it in one edit, as the phone does: the
 * change returns the new tile and the size to go to, then the tile keeps its
 * place (moved left when it would pass the last column) and every tile it
 * overlaps is pushed down, cascading (`resizeWatchTile`). The phone leaves
 * an overlap with a tile above in place; the panel refuses the whole edit
 * instead, keys included, and says why, but only for an overlap the edit
 * adds: a tile the resized one overlapped already before may stay under it
 * (a group the phone placed over another tile can still be sized).
 */
function changeAndResize(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  change: (tile: WatchPageTile) => { tile: WatchPageTile; colSpan?: number; rowSpan: number | undefined } | undefined,
): WatchSpecialResize {
  let size: { colSpan?: number; rowSpan: number | undefined } | undefined;
  const keyed = editTile(document, pageId, tileId, (tile) => {
    const out = change(tile);
    if (out === undefined) return tile;
    size = out;
    return out.tile;
  });
  if (size === undefined) return { document };
  const page = editablePage(keyed, pageId);
  const tile = page === undefined ? undefined : tileOn(page, tileId);
  if (page === undefined || tile === undefined) return { document };
  const now = watchTileRect(tile);
  const rect = { col: now.col, row: now.row, colSpan: size.colSpan ?? now.colSpan, rowSpan: size.rowSpan ?? now.rowSpan };
  // Even at the same size: a tile moved to column 0 pushes what it now
  // overlaps, as the phone's resize does.
  const preview = previewWatchTileResize(page, tileId, rect);
  if (preview.refused !== undefined) return { document, refused: "end" };
  const before = editablePage(document, pageId);
  const beforeTile = before === undefined ? undefined : tileOn(before, tileId);
  const already = before === undefined || beforeTile === undefined ? [] : overlappedIds(before, tileId, watchTileRect(beforeTile));
  if (preview.overlaps && overlappedIds(preview.page, tileId, preview.rect).some((id) => !already.includes(id))) return { document, refused: "overlap" };
  return { document: resizeWatchTile(keyed, pageId, tileId, rect, { keepOverlapsWith: already }) };
}

/** A resize to a size, through the push down (a suggested size). */
export function resizeWatchSpecialTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  colSpan: number,
  rowSpan: number,
): WatchSpecialResize {
  if (!Number.isInteger(colSpan) || !Number.isInteger(rowSpan) || colSpan < 1 || rowSpan < 1) return { document };
  return changeAndResize(document, pageId, tileId, (tile) => ({ tile, colSpan: Math.min(colSpan, COLUMNS), rowSpan }));
}

// ── generic setters ──────────────────────────────────────────────────────

type Setter<V> = (document: WatchPagesDocument, pageId: string, tileId: string, value: V) => WatchPagesDocument;

function boolSetter(key: string, shows: (tile: WatchPageTile) => boolean): Setter<boolean> {
  return (document, pageId, tileId, on) =>
    isBool(on) ? setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? on : undefined)) : document;
}

/** An entity key: an id of one of `domains`, or null to remove it. */
function entitySetter(key: string, domains: readonly string[], shows: (tile: WatchPageTile) => boolean): Setter<string | null> {
  return (document, pageId, tileId, value) => {
    const v = value === null ? REMOVE : typeof value === "string" && domains.includes(tileKind(value.trim())) && tileTarget(value.trim()) !== "" ? value.trim() : undefined;
    if (v === undefined) return document;
    return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? v : undefined));
  };
}

function choiceSetter(key: string, choices: readonly WatchSpecialChoice[], shows: (tile: WatchPageTile) => boolean): Setter<string> {
  return (document, pageId, tileId, value) =>
    choices.some((c) => c.value === value) ? setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? value : undefined)) : document;
}

// ── Remote ───────────────────────────────────────────────────────────────

export const setWatchRemoteMediaPlayer = entitySetter("associatedMediaPlayerId", ["media_player"], isRemoteLike);
export const setWatchRemoteVolumePlayer = entitySetter("associatedVolumePlayerId", ["media_player"], isRemoteLike);
export const setWatchRemoteCrownSelect = boolSetter("remoteCrownSelectEnabled", isRemoteLike);
export const setWatchRemoteCrownBack = boolSetter("remoteCrownBackEnabled", isRemoteLike);
export const setWatchRemoteEdgeVolume = boolSetter("remoteEdgeVolumeEnabled", isRemoteLike);
export const setWatchRemoteEdgeSide = choiceSetter("remoteEdgeVolumeSide", T.remote.edgeSides, isRemoteLike);
export const setWatchRemoteQuickConfirm = boolSetter("remoteQuickActionConfirm", isRemoteLike);

/** A remote's settings as the watch reads them (absent keys resolved). */
export interface WatchRemoteSettings {
  mediaPlayer: string | undefined;
  volumePlayer: string | undefined;
  crownSelect: boolean;
  crownBack: boolean;
  edgeVolume: boolean;
  edgeSide: string;
  quickConfirm: boolean;
  /** The layout as the watch reads it, 12 kinds. */
  layout: string[];
  /** Whether a layout is stored (absent is the adaptive default). */
  layoutStored: boolean;
}

function boolOr(value: unknown, absent: boolean): boolean {
  return typeof value === "boolean" ? value : absent;
}

function entityOr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export function watchRemoteSettings(tile: WatchPageTile): WatchRemoteSettings {
  const d = T.remote.inputDefaults;
  return {
    mediaPlayer: entityOr(tile.associatedMediaPlayerId),
    volumePlayer: entityOr(tile.associatedVolumePlayerId),
    crownSelect: boolOr(tile.remoteCrownSelectEnabled, d.remoteCrownSelectEnabled),
    crownBack: boolOr(tile.remoteCrownBackEnabled, d.remoteCrownBackEnabled),
    edgeVolume: boolOr(tile.remoteEdgeVolumeEnabled, d.remoteEdgeVolumeEnabled),
    edgeSide: typeof tile.remoteEdgeVolumeSide === "string" ? tile.remoteEdgeVolumeSide : d.remoteEdgeVolumeSide,
    quickConfirm: boolOr(tile.remoteQuickActionConfirm, d.remoteQuickActionConfirm),
    layout: watchRemoteLayout(tile.remoteButtonLayout),
    layoutStored: Array.isArray(tile.remoteButtonLayout),
  };
}

/** The first `media_player.` among a device's entities (registry order):
 * what "Use <player>" offers while no media player is linked. */
export function watchSuggestedMediaPlayer(deviceEntityIds: readonly string[]): string | undefined {
  return deviceEntityIds.find((id) => id.startsWith("media_player."));
}

// Button layout

const KIND_VALUES: ReadonlySet<string> = new Set(T.remote.kinds.map((k) => k.value));

/** A stored layout as the watch reads it (`RemoteButtonLayout.resolve`):
 * absent is the default; an unknown kind is `empty`; a short list is filled
 * from the default's slots at the same places; a long one is cut to 12. */
export function watchRemoteLayout(stored: unknown): string[] {
  const defaults = T.remote.defaultLayout;
  if (!Array.isArray(stored)) return defaults.slice();
  const slots = stored.slice(0, T.remote.slotCount).map((v) => (typeof v === "string" && KIND_VALUES.has(v) ? v : "empty"));
  for (let i = slots.length; i < T.remote.slotCount; i++) slots.push(defaults[i] ?? "empty");
  return slots;
}

function slotIndex(slot: unknown): slot is number {
  return Number.isInteger(slot) && (slot as number) >= 0 && (slot as number) < T.remote.slotCount;
}

/** A slot set to a kind: all 12 slots written. */
export function setWatchRemoteLayoutSlot(document: WatchPagesDocument, pageId: string, tileId: string, slot: number, kind: string): WatchPagesDocument {
  if (!slotIndex(slot) || !KIND_VALUES.has(kind)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isRemoteLike(tile)) return tile;
    const slots = watchRemoteLayout(tile.remoteButtonLayout);
    slots[slot] = kind;
    return withKey(tile, "remoteButtonLayout", slots);
  });
}

/** Two slots swapped: all 12 written. */
export function swapWatchRemoteLayoutSlots(document: WatchPagesDocument, pageId: string, tileId: string, from: number, to: number): WatchPagesDocument {
  if (!slotIndex(from) || !slotIndex(to) || from === to) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isRemoteLike(tile)) return tile;
    const slots = watchRemoteLayout(tile.remoteButtonLayout);
    [slots[from], slots[to]] = [slots[to]!, slots[from]!];
    return withKey(tile, "remoteButtonLayout", slots);
  });
}

/** Reset: the key removed, so the watch's adaptive default comes back. */
export function resetWatchRemoteLayout(document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => (isRemoteLike(tile) ? withoutKey(tile, "remoteButtonLayout") : tile));
}

/** The button kind with this raw value. */
export function watchRemoteButtonKind(value: string): WatchRemoteButtonKind | undefined {
  return T.remote.kinds.find((k) => k.value === value);
}

// Availability

/** What the layout knows of a linked player: its `supported_features`, and
 * which fallback attributes it has (`shuffle`, `repeat` present;
 * `source_list`, `sound_mode_list` not empty). */
export interface WatchPlayerFeatures {
  supportedFeatures: number;
  attributes: ReadonlySet<string>;
}

/** A player's features from its Home Assistant state, or undefined when
 * Home Assistant does not have it. */
export function watchPlayerFeatures(states: WatchSpecialStates | undefined, entityId: string | undefined): WatchPlayerFeatures | undefined {
  if (entityId === undefined) return undefined;
  const a = stateOf(states, entityId)?.attributes;
  if (stateOf(states, entityId) === undefined) return undefined;
  const attributes = new Set<string>();
  if (a?.shuffle !== undefined && a.shuffle !== null) attributes.add("shuffle");
  if (a?.repeat !== undefined && a.repeat !== null) attributes.add("repeat");
  if (Array.isArray(a?.source_list) && a.source_list.length > 0) attributes.add("source_list");
  if (Array.isArray(a?.sound_mode_list) && a.sound_mode_list.length > 0) attributes.add("sound_mode_list");
  const bits = num(a?.supported_features);
  return { supportedFeatures: bits === undefined ? 0 : Math.trunc(bits), attributes };
}

/** The remote's platform, guessed from its entity id, lower cased: the
 * first platform whose `contains` has a substring of it, else generic. */
export function watchRemotePlatform(entityId: string): { value: string; nativeMute: boolean } {
  const id = entityId.toLowerCase();
  const found = T.remote.platforms.find((p) => p.contains.some((c) => id.includes(c)));
  const generic = T.remote.platforms.find((p) => p.contains.length === 0);
  const p = found ?? generic ?? { value: "generic", nativeMute: false };
  return { value: p.value, nativeMute: p.nativeMute };
}

/** Who plays what for a remote's layout. */
export interface WatchRemotePlayers {
  /** The linked media player (a TV remote's own entity), with its features
   * when Home Assistant has it. */
  playerId: string | undefined;
  player: WatchPlayerFeatures | undefined;
  /** The volume player when one is set apart from the media player. */
  volumeId: string | undefined;
  volume: WatchPlayerFeatures | undefined;
  nativeMute: boolean;
}

/** The players a remote tile's layout is checked against. */
export function watchRemotePlayers(tile: WatchPageTile, states: WatchSpecialStates | undefined): WatchRemotePlayers {
  const entityId = tileEntityId(tile);
  const s = watchRemoteSettings(tile);
  const playerId = isWatchTvRemote(entityId, states) ? entityId : s.mediaPlayer;
  const volumeId = s.volumePlayer;
  return {
    playerId,
    player: watchPlayerFeatures(states, playerId),
    volumeId,
    volume: watchPlayerFeatures(states, volumeId),
    nativeMute: watchRemotePlatform(entityId).nativeMute,
  };
}

/** Whether a button kind works with these players, and the words a dimmed
 * chip shows when it does not. Availability never blocks a placement. */
export function watchRemoteKindAvailability(kind: string, players: WatchRemotePlayers): { available: boolean; reason: string } {
  const rule = Object.hasOwn(T.remote.availability.kinds, kind) ? T.remote.availability.kinds[kind]! : undefined;
  if (rule === undefined) return { available: true, reason: "" };
  const player = players.player;
  const volume = players.volume ?? player;
  const available = rule.anyOf.some((c) => {
    if (c.nativeMute === true && !players.nativeMute) return false;
    if (c.player === undefined) return true;
    const features = c.player === "media" ? player : volume;
    if (features === undefined) return false;
    if (c.bit !== undefined) {
      const has = features.supportedFeatures !== 0
        ? (features.supportedFeatures & c.bit) !== 0
        : c.fallback !== undefined && features.attributes.has(c.fallback);
      if (!has) return false;
    }
    if (c.needsAttribute !== undefined && !features.attributes.has(c.needsAttribute)) return false;
    return true;
  });
  if (available) return { available, reason: "" };
  const volumeKind = kind === "volume_up" || kind === "volume_down";
  const linked = volumeKind ? players.volumeId !== undefined || players.playerId !== undefined : players.playerId !== undefined;
  return { available, reason: linked ? rule.reason.linked : rule.reason.unlinked };
}

// Quick actions

const LAUNCHER_KEYS = ["remoteLauncherScriptIds", "remoteLauncherLabels", "remoteLauncherIcons", "remoteLauncherColors"] as const;

/** One quick action as the Remote task lists it. */
export interface WatchRemoteLauncher {
  scriptId: string;
  label: string;
  icon: string;
  color: string;
}

/** The quick actions, one per script id; a short label, icon or color list
 * reads as the empty label, `app.fill` and `""`. */
export function watchRemoteLaunchers(tile: WatchPageTile): WatchRemoteLauncher[] {
  const ids = list(tile.remoteLauncherScriptIds) ?? [];
  const labels = list(tile.remoteLauncherLabels) ?? [];
  const icons = list(tile.remoteLauncherIcons) ?? [];
  const colors = list(tile.remoteLauncherColors) ?? [];
  return ids.map((id, i) => ({
    scriptId: str(id) ?? "",
    label: str(labels[i]) ?? "",
    icon: str(icons[i]) ?? T.remote.launcher.icon,
    color: str(colors[i]) ?? T.remote.launcher.color,
  }));
}

/** A new quick action's label: the script's friendly name, else its id
 * without `script.`, `_` as spaces, capitalized. */
export function watchLauncherLabel(scriptId: string, friendlyName: string): string {
  if (friendlyName !== "") return friendlyName;
  const name = scriptId.startsWith("script.") ? scriptId.slice("script.".length) : scriptId;
  return watchCapitalized(name.replaceAll("_", " "));
}

/** "Add Quick Action": the script appended to all four lists. */
export function addWatchRemoteLauncher(document: WatchPagesDocument, pageId: string, tileId: string, scriptId: string, friendlyName: string): WatchPagesDocument {
  const id = scriptId.trim();
  if (tileKind(id) !== "script" || tileTarget(id) === "") return document;
  const values = [id, watchLauncherLabel(id, friendlyName), T.remote.launcher.icon, T.remote.launcher.color];
  return editTile(document, pageId, tileId, (tile) => {
    if (!isRemoteLike(tile)) return tile;
    let next = tile;
    LAUNCHER_KEYS.forEach((key, i) => {
      next = withKey(next, key, [...(list(tile[key]) ?? []), values[i]]);
    });
    return next;
  });
}

/** "Remove": the index dropped from each list long enough; an empty list is
 * removed. */
export function removeWatchRemoteLauncher(document: WatchPagesDocument, pageId: string, tileId: string, index: number): WatchPagesDocument {
  if (!Number.isInteger(index) || index < 0) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isRemoteLike(tile)) return tile;
    let next = tile;
    for (const key of LAUNCHER_KEYS) {
      const items = (list(tile[key]) ?? []).slice();
      if (index < items.length) items.splice(index, 1);
      next = items.length === 0 ? withoutKey(next, key) : withKey(next, key, items);
    }
    return next;
  });
}

/** One entry of one list set, the list padded to reach it. */
function launcherSetter(key: (typeof LAUNCHER_KEYS)[number], padding: string) {
  return (document: WatchPagesDocument, pageId: string, tileId: string, index: number, value: string): WatchPagesDocument => {
    if (!Number.isInteger(index) || index < 0 || index > 999) return document;
    return editTile(document, pageId, tileId, (tile) => {
      if (!isRemoteLike(tile)) return tile;
      const items = (list(tile[key]) ?? []).slice();
      while (items.length <= index) items.push(padding);
      items[index] = value;
      return withKey(tile, key, items);
    });
  };
}

const setLauncherLabel = launcherSetter("remoteLauncherLabels", "");
const setLauncherIcon = launcherSetter("remoteLauncherIcons", T.remote.launcher.icon);
const setLauncherColor = launcherSetter("remoteLauncherColors", T.remote.launcher.color);

export function setWatchRemoteLauncherLabel(document: WatchPagesDocument, pageId: string, tileId: string, index: number, label: string): WatchPagesDocument {
  return typeof label === "string" ? setLauncherLabel(document, pageId, tileId, index, label) : document;
}

/** No icon (null or empty) is `app.fill`. */
export function setWatchRemoteLauncherIcon(document: WatchPagesDocument, pageId: string, tileId: string, index: number, icon: string | null): WatchPagesDocument {
  const value = icon === null || icon.trim() === "" ? T.remote.launcher.icon : icon.trim();
  return setLauncherIcon(document, pageId, tileId, index, value);
}

/** No color (null) is `""`, the remote's accent; a color as given. */
export function setWatchRemoteLauncherColor(document: WatchPagesDocument, pageId: string, tileId: string, index: number, color: string | null): WatchPagesDocument {
  const value = color === null ? T.remote.launcher.color : color;
  if (!colorAccepted(value, true)) return document;
  return setLauncherColor(document, pageId, tileId, index, value);
}

/** The swatches the quick action colors and the calendar colors offer: the
 * editable palette, never the page theme. */
export function watchEditablePalette(): string[] {
  return watchThemeSwatches(WATCH_TILE_DEFAULTS.calendar.swatchTheme, false);
}

// ── Camera ───────────────────────────────────────────────────────────────

/** A single camera's settings as the watch reads them. */
export interface WatchCameraSettings {
  displayMode: string;
  fillMode: string;
  offsetX: number;
  offsetY: number;
  ratio: number | undefined;
  /** `cameraRefreshOnOpen`, undefined while it follows the global setting. */
  refresh: boolean | undefined;
}

export function watchCameraSettings(tile: WatchPageTile): WatchCameraSettings {
  const ratio = num(tile.cameraAspectRatio);
  return {
    displayMode: str(tile.cameraDisplayMode) ?? (watchTileKeyDefault("cameraDisplayMode") as string),
    fillMode: str(tile.cameraFillMode) ?? T.camera.fillAbsent.single,
    offsetX: num(tile.cameraFillOffsetX) ?? 0,
    offsetY: num(tile.cameraFillOffsetY) ?? 0,
    ratio: ratio !== undefined && ratio > 0 ? ratio : undefined,
    refresh: typeof tile.cameraRefreshOnOpen === "boolean" ? tile.cameraRefreshOnOpen : undefined,
  };
}

export const setWatchCameraDisplayMode = choiceSetter("cameraDisplayMode", T.camera.displayModes, isCamera);
export const setWatchCameraRefresh: Setter<boolean | null> = (document, pageId, tileId, value) =>
  value === null
    ? setKey(document, pageId, tileId, "cameraRefreshOnOpen", (tile) => (isCameraLike(tile) ? REMOVE : undefined))
    : boolSetter("cameraRefreshOnOpen", isCameraLike)(document, pageId, tileId, value);

/** Fill or Fit on a single camera; Fit puts the crop back in the middle. */
export function setWatchCameraFill(document: WatchPagesDocument, pageId: string, tileId: string, mode: string): WatchPagesDocument {
  if (!T.camera.fillModes.some((c) => c.value === mode)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isCamera(tile)) return tile;
    let next = withKey(tile, "cameraFillMode", mode);
    if (mode === "fit") {
      next = withKey(next, "cameraFillOffsetX", 0);
      next = withKey(next, "cameraFillOffsetY", 0);
    }
    return next;
  });
}

/** One D-pad step: down to the limit on the side it moves to. */
export function watchNudged(value: number, steps: number): number {
  const { step, limit } = T.camera.offset;
  if (steps < 0) return Math.max(-limit, value - step);
  if (steps > 0) return Math.min(limit, value + step);
  return value;
}

/** The single camera's Crop Position D-pad: `dx`, `dy` -1, 0 or 1; up is y
 * minus a step. */
export function nudgeWatchCameraOffset(document: WatchPagesDocument, pageId: string, tileId: string, dx: number, dy: number): WatchPagesDocument {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isCamera(tile)) return tile;
    let next = tile;
    if (dx !== 0) next = withKey(next, "cameraFillOffsetX", watchNudged(num(tile.cameraFillOffsetX) ?? 0, Math.sign(dx)));
    if (dy !== 0) next = withKey(next, "cameraFillOffsetY", watchNudged(num(tile.cameraFillOffsetY) ?? 0, Math.sign(dy)));
    return next;
  });
}

/** The D-pad's middle dot. */
export function centerWatchCameraOffset(document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) =>
    isCamera(tile) ? withKey(withKey(tile, "cameraFillOffsetX", 0), "cameraFillOffsetY", 0) : tile);
}

/** The candidate whose `colSpan / rowSpan` is closest to the ratio, the
 * first on a tie. */
export function watchBestFitTileSize(ratio: number): { colSpan: number; rowSpan: number } {
  let best: Size = [8, 4];
  let bestError = Infinity;
  for (const c of T.camera.bestFitCandidates) {
    const error = Math.abs(c[0] / c[1] - ratio);
    if (error < bestError) {
      bestError = error;
      best = c;
    }
  }
  return { colSpan: best[0], rowSpan: best[1] };
}

/** "Suggested Sizes": the first band whose `above` the ratio passes, the last
 * for the rest; the best fit marked. */
export function watchSuggestedTileSizes(ratio: number): { colSpan: number; rowSpan: number; bestFit: boolean }[] {
  const best = watchBestFitTileSize(ratio);
  const bands = T.camera.suggestionBands;
  const band = bands.find((b) => b.above === null || ratio > b.above) ?? bands[bands.length - 1]!;
  return band.sizes.map(([colSpan, rowSpan]) => ({ colSpan, rowSpan, bestFit: colSpan === best.colSpan && rowSpan === best.rowSpan }));
}

/** A ratio's name: a named one within 0.1, else the number. */
export function watchRatioName(ratio: number): string {
  const named = T.camera.ratioNames.find((n) => Math.abs(ratio - n.ratio) < 0.1);
  if (named !== undefined) return named.name;
  if (ratio > 1.5) return `${ratio.toFixed(2)}:1 (Wide)`;
  if (ratio > 0.9) return `${ratio.toFixed(2)}:1`;
  return `1:${(1 / ratio).toFixed(2)} (Tall)`;
}

/** The refresh menu's entries: Default in the global setting's words, On,
 * Off. `globalOn` and `debounce` come from the behavior document. */
export function watchCameraRefreshChoices(globalOn: boolean, debounce: string): { value: boolean | null; label: string }[] {
  return T.camera.refresh.choices.map((c) => ({
    value: c.value,
    label: c.value === null ? (globalOn ? c.label.replace("<debounce>", debounce) : (c.labelWhenOff ?? c.label)) : c.label,
  }));
}

/** A watch behavior setting's default, as the behavior catalog
 * (`watch-settings-catalog.json`) names it. */
function behaviorDefault(key: string): unknown {
  const sections = (settingsCatalog as { sections: { settings: { key: string; default?: unknown }[] }[] }).sections;
  for (const section of sections) {
    const setting = section.settings.find((s) => s.key === key);
    if (setting !== undefined) return setting.default;
  }
  return undefined;
}

/** The behavior document's camera keys, with the behavior catalog's
 * defaults for what it does not hold. */
export function watchCameraRefreshDefaults(behavior: unknown): { on: boolean; debounce: string } {
  const doc = isJsonObject(behavior) ? behavior : {};
  const on = behaviorDefault("cameraRefreshOnOpen");
  const debounce = behaviorDefault("cameraRefreshOnOpenDebounce");
  return {
    on: typeof doc.cameraRefreshOnOpen === "boolean" ? doc.cameraRefreshOnOpen : on === true,
    debounce: typeof doc.cameraRefreshOnOpenDebounce === "string" && doc.cameraRefreshOnOpenDebounce !== ""
      ? doc.cameraRefreshOnOpenDebounce
      : typeof debounce === "string" ? debounce : "",
  };
}

/** A snapshot's ratio from its size: undefined for a size that is no
 * picture. */
export function watchSnapshotRatio(size: { width: number; height: number } | undefined): number | undefined {
  if (size === undefined) return undefined;
  const { width, height } = size;
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 ? width / height : undefined;
}

/** The automatic grid of a group (`multiCamGridSize`): 1 or 2 cameras in one
 * column, else `ceil(sqrt(n))` columns; rows to hold them. */
function groupGrid(count: number, columns?: number): { columns: number; rows: number } {
  const cols = columns ?? (count <= 2 ? 1 : Math.ceil(Math.sqrt(count)));
  return { columns: cols, rows: Math.ceil(count / Math.max(1, cols)) };
}

/**
 * Ratio detection with the ratios given, then the push-down resize: one ratio
 * per camera of a group (null for a snapshot that did not load, read as
 * 1.78), one for a single camera (null: nothing changes). A group gets the
 * columns from the mean ratio, row weights `1 / ratio`, Fill for the tile and
 * every cell, the full width and the height rule; a single camera its ratio
 * and the best fit size. The tile moves to column 0 when the new width would
 * pass the last column.
 */
export function detectWatchCameraRatios(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  ratios: readonly (number | null | undefined)[],
): WatchSpecialResize {
  const clean = ratios.map((r) => (typeof r === "number" && Number.isFinite(r) && r > 0 ? r : undefined));
  return changeAndResize(document, pageId, tileId, (tile) => {
    const col = watchTileRect(tile).col;
    if (isGroup(tile)) {
      const ids = strings(tile.cameraGroupIds) ?? [];
      if (ids.length === 0) return undefined;
      const found = ids.map((_, i) => clean[i]);
      const camRatios = found.map((r) => r ?? T.camera.detectFallbackRatio);
      const count = ids.length;
      const mean = camRatios.reduce((a, b) => a + b, 0) / camRatios.length;
      const gridColumns = mean > 2.0 ? 1 : mean > 1.2 ? Math.min(2, count) : groupGrid(count).columns;
      const grid = groupGrid(count, gridColumns);
      const width = COLUMNS;
      const cellWidth = width / grid.columns;
      const height = gridColumns === 1
        ? Math.max(T.multicam.rowSpanMin, Math.round(camRatios.reduce((sum, r) => sum + Math.max(1.0, cellWidth / r), 0)))
        : Math.max(T.multicam.rowSpanMin, Math.round(grid.rows * Math.max(1.0, cellWidth / mean)));
      let next = tile;
      const first = found.find((r) => r !== undefined);
      if (first !== undefined) next = withKey(next, "cameraAspectRatio", first);
      next = withKey(next, "cameraGridColumns", gridColumns);
      next = withKey(next, "cameraRowWeights", camRatios.map((r) => 1.0 / r));
      next = withKey(next, "cameraFillMode", "fill");
      next = withKey(next, "cameraFillModes", ids.map(() => "fill"));
      if (col + width > COLUMNS) next = withKey(next, "gridCol", 0);
      return { tile: next, colSpan: width, rowSpan: height };
    }
    if (!isCamera(tile)) return undefined;
    const ratio = clean[0];
    if (ratio === undefined) return undefined;
    const best = watchBestFitTileSize(ratio);
    let next = withKey(tile, "cameraAspectRatio", ratio);
    if (col + best.colSpan > COLUMNS) next = withKey(next, "gridCol", 0);
    return { tile: next, colSpan: best.colSpan, rowSpan: best.rowSpan };
  });
}

/** The cameras a camera or group tile shows, in order: a group's
 * `cameraGroupIds`, a camera's own entity. */
export function watchTileCameraIds(tile: WatchPageTile): string[] {
  return isGroup(tile) ? (strings(tile.cameraGroupIds) ?? []) : isCamera(tile) ? [tileEntityId(tile)] : [];
}

/**
 * Ratio detection with the ratios measured by camera id, applied to the
 * cameras the tile holds when it commits: a camera that left the tile while
 * the pictures loaded is skipped, a requested camera whose picture did not
 * load (null) counts as missing (1.78 in a group). A camera the tile holds
 * that was not requested (added meanwhile) has no measure, so nothing is
 * changed and `unmeasured` names it. `missing` counts the tile's cameras
 * with no ratio.
 */
export function detectWatchCameraRatiosById(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  measured: ReadonlyMap<string, number | null | undefined>,
): WatchSpecialResize & { unmeasured?: string[]; missing: number } {
  const page = editablePage(document, pageId);
  const tile = page === undefined ? undefined : tileOn(page, tileId);
  const ids = tile === undefined ? [] : watchTileCameraIds(tile);
  const unmeasured = ids.filter((id) => !measured.has(id));
  if (unmeasured.length > 0) return { document, unmeasured, missing: 0 };
  const ratios = ids.map((id) => measured.get(id) ?? null);
  const missing = ratios.filter((r) => watchSnapshotRatio(r === null ? undefined : { width: r, height: 1 }) === undefined).length;
  return { ...detectWatchCameraRatios(document, pageId, tileId, ratios), missing };
}

// ── Camera group ─────────────────────────────────────────────────────────

/** A camera group's settings, the per-camera lists read at the camera
 * count (a cell with no entry reads Fill, offsets 0). */
export interface WatchCameraGroupSettings {
  cameraIds: string[];
  /** Undefined when the tile has no weights: Height does nothing then. */
  weights: number[] | undefined;
  fills: string[];
  offsetsX: number[];
  offsetsY: number[];
  border: { on: boolean; color: string; thickness: string };
  ratio: number | undefined;
  refresh: boolean | undefined;
}

export function watchCameraGroupSettings(tile: WatchPageTile): WatchCameraGroupSettings {
  const ids = strings(tile.cameraGroupIds) ?? [];
  const at = <V>(value: unknown, i: number, pick: (v: unknown) => V | undefined, fallback: V): V => {
    const items = list(value);
    return items === undefined || i >= items.length ? fallback : (pick(items[i]) ?? fallback);
  };
  const weights = list(tile.cameraRowWeights);
  const d = T.multicam.borderDefaults;
  const ratio = num(tile.cameraAspectRatio);
  return {
    cameraIds: ids,
    weights: weights === undefined ? undefined : weights.map((w) => num(w) ?? 0),
    fills: ids.map((_, i) => at(tile.cameraFillModes, i, str, str(tile.cameraFillMode) ?? T.camera.fillAbsent.cell)),
    offsetsX: ids.map((_, i) => at(tile.cameraFillOffsetsX, i, num, 0)),
    offsetsY: ids.map((_, i) => at(tile.cameraFillOffsetsY, i, num, 0)),
    border: {
      on: boolOr(tile.multiCamBorderEnabled, d.multiCamBorderEnabled),
      color: str(tile.multiCamBorderColor) ?? d.multiCamBorderColor,
      thickness: str(tile.multiCamBorderThickness) ?? d.multiCamBorderThickness,
    },
    ratio: ratio !== undefined && ratio > 0 ? ratio : undefined,
    refresh: typeof tile.cameraRefreshOnOpen === "boolean" ? tile.cameraRefreshOnOpen : undefined,
  };
}

export const setWatchCameraBorder = boolSetter("multiCamBorderEnabled", isGroup);
export const setWatchCameraBorderThickness = choiceSetter("multiCamBorderThickness", T.multicam.borderThicknesses, isGroup);

/** A group's border color: a swatch as listed, `#RAINBOW`, or a picked
 * color. */
export const setWatchCameraBorderColor: Setter<string> = (document, pageId, tileId, color) => {
  if (typeof color !== "string" || color.startsWith("GRADIENT|") || !colorAccepted(color, false)) return document;
  const value = color === "#RAINBOW" ? color : `#${color.replace(/^#/, "").toUpperCase()}`;
  return setKey(document, pageId, tileId, "multiCamBorderColor", (tile) => (isGroup(tile) ? value : undefined));
};

/**
 * "Merge into Camera Grid": the chosen camera and group tiles, in page order,
 * become one group. The groups' cameras come first with their per-camera
 * settings (padded with weight 1, Fill, offsets 0), then each camera tile
 * with weight 1, its own fill mode (else Fill) and offsets; a camera listed
 * already is skipped. The first chosen group keeps its id, place and keys
 * and takes the lists and the label; every other chosen tile goes. With no
 * group chosen the chosen tiles go and a new 4 by 4 group takes the first
 * free place left, appended last; `newId` gives its entity id's UUID, then
 * its id. Refused with fewer than two camera tiles.
 */
export function mergeWatchCameraTiles(
  document: WatchPagesDocument,
  pageId: string,
  tileIds: readonly string[],
  options?: WatchEditOptions,
): { document: WatchPagesDocument; groupId?: string } {
  const page = editablePage(document, pageId);
  if (page === undefined) return { document };
  const chosen = (page.items as unknown[]).filter(
    (t): t is WatchPageTile => isJsonObject(t) && tileIds.some((id) => sameWatchId(t.id, id)) && isCameraLike(t),
  );
  const groups = chosen.filter(isGroup);
  const cameras = chosen.filter(isCamera);
  if (groups.length + cameras.length < 2) return { document };

  const { ids, weights, modes, offsetsX, offsetsY } = mergedCameraLists(groups, cameras);
  const label = watchCameraGroupLabel(ids);

  const base = groups[0];
  let next = document;
  if (base !== undefined) {
    for (const t of chosen) if (t !== base) next = deleteWatchTile(next, pageId, String(t.id), options);
    next = editTile(next, pageId, String(base.id), (tile) => {
      let out = withKey(tile, "cameraGroupIds", ids);
      out = withKey(out, "cameraRowWeights", weights);
      out = withKey(out, "cameraFillModes", modes);
      out = withKey(out, "cameraFillOffsetsX", offsetsX);
      out = withKey(out, "cameraFillOffsetsY", offsetsY);
      return withKey(out, "customLabel", label);
    });
    return { document: next, groupId: String(base.id) };
  }
  const spec = T.multicam.newTile;
  const entityUuid = newIdFrom(options);
  const id = newIdFrom(options);
  for (const t of chosen) next = deleteWatchTile(next, pageId, String(t.id), options);
  const place = firstFreeWatchCell(findWatchPage(next, pageId)!, spec.colSpan, spec.rowSpan);
  const group = watchFreshTile({
    id,
    entityId: `${spec.entityIdPrefix}${entityUuid}`,
    icon: spec.icon,
    color: spec.hex,
    customLabel: label,
    cameraDisplayMode: spec.displayMode,
    cameraGroupIds: ids,
    cameraRowWeights: weights,
    cameraFillModes: modes,
    cameraFillOffsetsX: offsetsX,
    cameraFillOffsetsY: offsetsY,
    colSpan: spec.colSpan,
    rowSpan: spec.rowSpan,
    gridRow: place.row,
    gridCol: place.col,
  });
  return { document: appendTile(next, pageId, group), groupId: id };
}

/** The lists of a merge: the groups' cameras first with their per-camera
 * settings (padded with weight 1, Fill, offsets 0), then each camera tile
 * with weight 1, its own fill mode (else Fill) and offsets. A camera already
 * listed is skipped, as Add camera skips it. */
function mergedCameraLists(groups: readonly WatchPageTile[], cameras: readonly WatchPageTile[]) {
  const ids: string[] = [];
  const weights: unknown[] = [];
  const modes: unknown[] = [];
  const offsetsX: unknown[] = [];
  const offsetsY: unknown[] = [];
  const push = (id: string, w: unknown, m: unknown, x: unknown, y: unknown) => {
    if (ids.includes(id)) return;
    ids.push(id);
    weights.push(w);
    modes.push(m);
    offsetsX.push(x);
    offsetsY.push(y);
  };
  for (const group of groups) {
    const w = list(group.cameraRowWeights) ?? [];
    const m = list(group.cameraFillModes) ?? [];
    const x = list(group.cameraFillOffsetsX) ?? [];
    const y = list(group.cameraFillOffsetsY) ?? [];
    (strings(group.cameraGroupIds) ?? []).forEach((id, i) =>
      push(id, i < w.length ? w[i] : 1.0, i < m.length ? m[i] : "fill", i < x.length ? x[i] : 0, i < y.length ? y[i] : 0));
  }
  for (const camera of cameras) {
    push(tileEntityId(camera), 1.0, str(camera.cameraFillMode) ?? "fill", num(camera.cameraFillOffsetX) ?? 0, num(camera.cameraFillOffsetY) ?? 0);
  }
  return { ids, weights, modes, offsetsX, offsetsY };
}

/** The cameras a merge of these tiles would list, in order, each once (what
 * "Group N cameras" counts). */
export function watchCameraMergeIds(page: WatchPage, tileIds: readonly string[]): string[] {
  const chosen = watchPageTilesOf(page).filter((t) => tileIds.some((id) => sameWatchId(t.id, id)) && isCameraLike(t));
  return mergedCameraLists(chosen.filter(isGroup), chosen.filter(isCamera)).ids;
}

function watchPageTilesOf(page: WatchPage): WatchPageTile[] {
  return Array.isArray(page.items) ? (page.items as unknown[]).filter((t): t is WatchPageTile => isJsonObject(t)) : [];
}

/** "Add Camera": the cameras not in the group yet are appended, each with
 * weight 1 (the weights made when absent), Fill and offsets 0 in the lists
 * that exist; the label is rewritten. */
export function addWatchCamerasToGroup(document: WatchPagesDocument, pageId: string, tileId: string, entityIds: readonly string[]): WatchPagesDocument {
  const picked = entityIds.map((id) => id.trim()).filter((id) => tileKind(id) === "camera" && tileTarget(id) !== "");
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile)) return tile;
    const existing = strings(tile.cameraGroupIds) ?? [];
    const added: string[] = [];
    for (const id of picked) if (!existing.includes(id) && !added.includes(id)) added.push(id);
    if (added.length === 0 || !Array.isArray(tile.cameraGroupIds)) return tile;
    const fill = (v: unknown) => added.map(() => v);
    const all = [...(tile.cameraGroupIds as unknown[]), ...added];
    let next = withKey(tile, "cameraGroupIds", all);
    next = withKey(next, "cameraRowWeights", [...(list(tile.cameraRowWeights) ?? []), ...fill(1.0)]);
    if (Array.isArray(tile.cameraFillModes)) next = withKey(next, "cameraFillModes", [...tile.cameraFillModes, ...fill("fill")]);
    if (Array.isArray(tile.cameraFillOffsetsX)) next = withKey(next, "cameraFillOffsetsX", [...tile.cameraFillOffsetsX, ...fill(0)]);
    if (Array.isArray(tile.cameraFillOffsetsY)) next = withKey(next, "cameraFillOffsetsY", [...tile.cameraFillOffsetsY, ...fill(0)]);
    return withKey(next, "customLabel", watchCameraGroupLabel(strings(all) ?? []));
  });
}

/**
 * "Remove" on a camera of a group (offered with two cameras or more): the
 * index leaves all five lists. Two or more left: the lists (an empty optional
 * one removed, the weights kept even empty) and the label joined `" + "`. One
 * left: the tile turns into that camera in place, with the cell's fill mode
 * (else Fill) and offsets; icon, color and display mode stay.
 */
export function removeWatchCameraFromGroup(document: WatchPagesDocument, pageId: string, tileId: string, index: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile) || !Array.isArray(tile.cameraGroupIds)) return tile;
    const ids = tile.cameraGroupIds.slice();
    if (!Number.isInteger(index) || index < 0 || index >= ids.length || ids.length < 2) return tile;
    ids.splice(index, 1);
    const dropping = (value: unknown): unknown[] => {
      const items = (list(value) ?? []).slice();
      if (index < items.length) items.splice(index, 1);
      return items;
    };
    const weights = dropping(tile.cameraRowWeights);
    const modes = dropping(tile.cameraFillModes);
    const offsetsX = dropping(tile.cameraFillOffsetsX);
    const offsetsY = dropping(tile.cameraFillOffsetsY);
    let next = tile;
    if (ids.length === 1) {
      const remaining = String(ids[0]);
      next = withKey(next, "entityId", remaining);
      next = withoutKey(next, "cameraGroupIds");
      next = withoutKey(next, "cameraRowWeights");
      next = withKey(next, "cameraFillMode", modes[0] ?? "fill");
      next = withoutKey(next, "cameraFillModes");
      next = withKey(next, "cameraFillOffsetX", offsetsX[0] ?? 0);
      next = withKey(next, "cameraFillOffsetY", offsetsY[0] ?? 0);
      next = withoutKey(next, "cameraFillOffsetsX");
      next = withoutKey(next, "cameraFillOffsetsY");
      next = withoutKey(next, "multiCamTapMode");
      next = withKey(next, "multiCamBorderEnabled", false);
      return withKey(next, "customLabel", watchObjectName(remaining));
    }
    const optional = (key: string, items: unknown[]) => {
      next = items.length === 0 ? withoutKey(next, key) : withKey(next, key, items);
    };
    next = withKey(next, "cameraGroupIds", ids);
    next = withKey(next, "cameraRowWeights", weights);
    optional("cameraFillModes", modes);
    optional("cameraFillOffsetsX", offsetsX);
    optional("cameraFillOffsetsY", offsetsY);
    return withKey(next, "customLabel", removeLabel(strings(ids) ?? []));
  });
}

/** "Remove" on a page (the phone's page remove): as
 * `removeWatchCameraFromGroup`, except that a group whose last camera is
 * removed goes from the page, its groups repaired as a delete repairs them. */
export function removeWatchGroupCamera(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  index: number,
  options?: WatchEditOptions,
): WatchPagesDocument {
  const page = editablePage(document, pageId);
  const tile = page === undefined ? undefined : tileOn(page, tileId);
  if (tile === undefined || !isGroup(tile) || !Array.isArray(tile.cameraGroupIds)) return document;
  if (tile.cameraGroupIds.length === 1 && index === 0) return deleteWatchTile(document, pageId, tileId, options);
  return removeWatchCameraFromGroup(document, pageId, tileId, index);
}

const CELL_KEYS = ["cameraRowWeights", "cameraFillModes", "cameraFillOffsetsX", "cameraFillOffsetsY"] as const;

/** The arrows: a camera swapped with its neighbor (`direction` -1 or 1), and
 * the same index in each per-camera list long enough. */
export function swapWatchCameraInGroup(document: WatchPagesDocument, pageId: string, tileId: string, index: number, direction: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile) || !Array.isArray(tile.cameraGroupIds)) return tile;
    const target = index + Math.sign(direction);
    const count = tile.cameraGroupIds.length;
    if (!Number.isInteger(index) || index < 0 || index >= count || target < 0 || target >= count || target === index) return tile;
    const swapped = (items: unknown[]) => {
      const out = items.slice();
      [out[index], out[target]] = [out[target], out[index]];
      return out;
    };
    let next = withKey(tile, "cameraGroupIds", swapped(tile.cameraGroupIds));
    const reach = Math.max(index, target);
    for (const key of CELL_KEYS) {
      const items = list(tile[key]);
      if (items !== undefined && items.length > reach) next = withKey(next, key, swapped(items));
    }
    return next;
  });
}

/** A drag: the camera at `from` moved to before `toOffset` (insert before;
 * nothing at `from` or `from + 1`), and each per-camera list exactly as long
 * as the camera list. */
export function moveWatchCameraInGroup(document: WatchPagesDocument, pageId: string, tileId: string, from: number, toOffset: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile) || !Array.isArray(tile.cameraGroupIds)) return tile;
    const count = tile.cameraGroupIds.length;
    if (!Number.isInteger(from) || !Number.isInteger(toOffset)) return tile;
    if (from < 0 || from >= count || toOffset < 0 || toOffset > count || toOffset === from || toOffset === from + 1) return tile;
    const moving = (items: unknown[]) => {
      const out = items.slice();
      const [element] = out.splice(from, 1);
      out.splice(toOffset > from ? toOffset - 1 : toOffset, 0, element);
      return out;
    };
    let next = withKey(tile, "cameraGroupIds", moving(tile.cameraGroupIds));
    for (const key of CELL_KEYS) {
      const items = list(tile[key]);
      if (items !== undefined && items.length === count) next = withKey(next, key, moving(items));
    }
    return next;
  });
}

function cellOffset(tile: WatchPageTile, index: number, x: number, y: number): WatchPageTile {
  const count = list(tile.cameraGroupIds)?.length ?? 0;
  if (count === 0) return tile;
  const xs = (list(tile.cameraFillOffsetsX) ?? new Array(count).fill(0)).slice();
  const ys = (list(tile.cameraFillOffsetsY) ?? new Array(count).fill(0)).slice();
  while (xs.length < count) xs.push(0);
  while (ys.length < count) ys.push(0);
  if (index >= xs.length || index >= ys.length) return tile;
  xs[index] = x;
  ys[index] = y;
  return withKey(withKey(tile, "cameraFillOffsetsX", xs), "cameraFillOffsetsY", ys);
}

/** A cell's Fill or Fit: the whole fill list written (made all Fill at the
 * camera count); Fit also puts the cell's crop in the middle. */
export function setWatchCameraCellFill(document: WatchPagesDocument, pageId: string, tileId: string, index: number, mode: string): WatchPagesDocument {
  if (!T.camera.fillModes.some((c) => c.value === mode) || !Number.isInteger(index) || index < 0) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile)) return tile;
    const count = list(tile.cameraGroupIds)?.length ?? 0;
    const modes = (list(tile.cameraFillModes) ?? new Array(count).fill("fill")).slice();
    while (modes.length < count) modes.push("fill");
    if (index >= modes.length) return tile;
    modes[index] = mode;
    const next = withKey(tile, "cameraFillModes", modes);
    return mode === "fit" ? cellOffset(next, index, 0, 0) : next;
  });
}

/** A cell's Position D-pad step. */
export function nudgeWatchCameraCellOffset(document: WatchPagesDocument, pageId: string, tileId: string, index: number, dx: number, dy: number): WatchPagesDocument {
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(dx) || !Number.isFinite(dy)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isGroup(tile)) return tile;
    const at = (value: unknown) => {
      const items = list(value);
      return items !== undefined && index < items.length ? (num(items[index]) ?? 0) : 0;
    };
    return cellOffset(tile, index, watchNudged(at(tile.cameraFillOffsetsX), Math.sign(dx)), watchNudged(at(tile.cameraFillOffsetsY), Math.sign(dy)));
  });
}

/** A cell's middle dot. */
export function centerWatchCameraCellOffset(document: WatchPagesDocument, pageId: string, tileId: string, index: number): WatchPagesDocument {
  if (!Number.isInteger(index) || index < 0) return document;
  return editTile(document, pageId, tileId, (tile) => (isGroup(tile) ? cellOffset(tile, index, 0, 0) : tile));
}

/** A camera's Height plus or minus: its weight by `delta`, at least the
 * minimum; the tile's height scaled by the new sum over the old, rounded,
 * at least 2, through the push down. Nothing without a weight. */
export function setWatchCameraCellWeight(document: WatchPagesDocument, pageId: string, tileId: string, index: number, delta: number): WatchSpecialResize {
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(delta)) return { document };
  return changeAndResize(document, pageId, tileId, (tile) => {
    if (!isGroup(tile)) return undefined;
    const stored = list(tile.cameraRowWeights);
    if (stored === undefined || index >= stored.length || !stored.every((w) => num(w) !== undefined)) return undefined;
    const weights = stored.map((w) => num(w)!);
    const oldTotal = weights.reduce((a, b) => a + b, 0);
    weights[index] = Math.max(T.multicam.weight.min, weights[index]! + delta);
    const newTotal = weights.reduce((a, b) => a + b, 0);
    const next = withKey(tile, "cameraRowWeights", weights);
    if (!(oldTotal > 0)) return { tile: next, rowSpan: undefined };
    const rowSpan = Math.max(T.multicam.rowSpanMin, Math.round((watchTileRect(tile).rowSpan * newTotal) / oldTotal));
    return { tile: next, rowSpan };
  });
}

/**
 * "Split into Individual Cameras": the group goes; each camera becomes a 4 by
 * 4 Preview tile with the add's `video` icon and the page theme's camera
 * color (the gradient form on a gradient page), labelled with its object id
 * made readable, at the first free place in turn. `newId` gives the new
 * tiles' ids in order.
 */
export function unmergeWatchCameraGroup(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  options?: WatchEditOptions,
): { document: WatchPagesDocument; tileIds: string[] } {
  const page = editablePage(document, pageId);
  const group = page === undefined ? undefined : tileOn(page, tileId);
  if (page === undefined || group === undefined || !isGroup(group)) return { document, tileIds: [] };
  const cameraIds = strings(group.cameraGroupIds);
  if (cameraIds === undefined) return { document, tileIds: [] };
  let next = deleteWatchTile(document, pageId, tileId, options);
  const spec = T.multicam.unmergeTile;
  const added: string[] = [];
  for (const entityId of cameraIds) {
    const color = watchEntityDefaults({ entityId }, page).color;
    const fields: Record<string, unknown> = {
      id: newIdFrom(options),
      entityId,
      icon: spec.icon,
      customLabel: watchObjectName(entityId),
      colSpan: spec.colSpan,
      rowSpan: spec.rowSpan,
      cameraDisplayMode: spec.displayMode,
    };
    if (color !== undefined) fields.color = color;
    const now = findWatchPage(next, pageId)!;
    const place = firstFreeWatchCell(now, spec.colSpan, spec.rowSpan);
    const tile = watchFreshTile({ ...fields, gridRow: place.row, gridCol: place.col });
    next = appendTile(next, pageId, tile);
    added.push(String(fields.id));
  }
  return { document: next, tileIds: added };
}

// ── Vacuum ───────────────────────────────────────────────────────────────

export type WatchVacuumSlot = "cleaningMode" | "fanSpeed" | "extraSelect" | "battery";

/** A vacuum slot's key, picker and the words of its none row. */
export function watchVacuumSlot(slot: WatchVacuumSlot) {
  return T.vacuum.slots.find((s) => s.slot === slot)!;
}

function slotDomains(slot: WatchVacuumSlot): string[] {
  return watchVacuumSlot(slot).picker === "select" ? T.vacuum.selectDomains : ["sensor"];
}

const isVacuum = isKind("vacuum");
const isMower = isKind("lawn_mower");

/** A picked entity, or null from the none row or Clear. Clearing the extra
 * select drops its label too. */
export function setWatchVacuumEntity(document: WatchPagesDocument, pageId: string, tileId: string, slot: WatchVacuumSlot, entityId: string | null): WatchPagesDocument {
  const spec = T.vacuum.slots.find((s) => s.slot === slot);
  if (spec === undefined) return document;
  const id = entityId === null ? null : entityId.trim();
  if (id !== null && (!slotDomains(slot).includes(tileKind(id)) || tileTarget(id) === "")) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isVacuum(tile)) return tile;
    if (id !== null) return withKey(tile, spec.key, id);
    const next = withoutKey(tile, spec.key);
    return slot === "extraSelect" ? withoutKey(next, "vacuumExtraSelectLabel") : next;
  });
}

/** The Extra Tab's label: empty removes the key. */
export function setWatchVacuumExtraLabel(document: WatchPagesDocument, pageId: string, tileId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return setKey(document, pageId, tileId, "vacuumExtraSelectLabel", (tile) => (isVacuum(tile) ? (text === "" ? REMOVE : text) : undefined));
}

/** The switch list in pick order, each once; empty removes the key. */
export function setWatchVacuumSwitches(document: WatchPagesDocument, pageId: string, tileId: string, ids: readonly string[]): WatchPagesDocument {
  const out: string[] = [];
  for (const raw of ids) {
    const id = typeof raw === "string" ? raw.trim() : "";
    if (tileKind(id) !== "switch" || tileTarget(id) === "") return document;
    if (!out.includes(id)) out.push(id);
  }
  return setKey(document, pageId, tileId, "vacuumSwitchEntityIds", (tile) => (isVacuum(tile) ? (out.length === 0 ? REMOVE : out) : undefined));
}

/** A tap in the switch picker: a listed switch leaves, another is appended,
 * so the list keeps the order things were picked in. */
export function watchToggled(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
}

/** The linked entities of a vacuum tile; what discovery offers and Apply
 * writes. */
export interface WatchVacuumPicks {
  cleaningMode: string | null;
  fanSpeed: string | null;
  extraSelect: string | null;
  switches: string[];
  battery: string | null;
}

export function watchVacuumPicks(tile: WatchPageTile): WatchVacuumPicks {
  return {
    cleaningMode: entityOr(tile.vacuumCleaningModeEntityId) ?? null,
    fanSpeed: entityOr(tile.vacuumFanSpeedEntityId) ?? null,
    extraSelect: entityOr(tile.vacuumExtraSelectEntityId) ?? null,
    switches: strings(tile.vacuumSwitchEntityIds) ?? [],
    battery: entityOr(tile.vacuumBatteryEntityId) ?? null,
  };
}

/** A device's other entities in registry order, bucketed. */
export interface WatchDeviceSiblings {
  selects: string[];
  switches: string[];
  sensors: string[];
  all: string[];
}

/** The entities that share the entity's device in the entity registry
 * (`hass.entities`, registry order), itself left out. Empty when the
 * entity has no device. */
export function watchDeviceSiblings(
  entities: Readonly<Record<string, { device_id?: string | null } | undefined>> | undefined,
  entityId: string,
): WatchDeviceSiblings {
  const out: WatchDeviceSiblings = { selects: [], switches: [], sensors: [], all: [] };
  if (entities === undefined) return out;
  const device = Object.hasOwn(entities, entityId) ? entities[entityId]?.device_id : undefined;
  if (typeof device !== "string" || device === "") return out;
  for (const id of Object.keys(entities)) {
    if (id === entityId || entities[id]?.device_id !== device) continue;
    out.all.push(id);
    const domain = tileKind(id);
    if (T.vacuum.selectDomains.includes(domain)) out.selects.push(id);
    else if (domain === "switch") out.switches.push(id);
    else if (domain === "sensor") out.sensors.push(id);
  }
  return out;
}

/** The discovery sheet's first picks: the tile's own, then for an empty
 * cleaning mode the first sibling select containing `cleaning_mode`, for no
 * switches every sibling switch, for an empty battery the first sibling
 * sensor containing `battery`. */
export function watchVacuumDiscoverySuggestions(tile: WatchPageTile, siblings: Pick<WatchDeviceSiblings, "selects" | "switches" | "sensors">): WatchVacuumPicks {
  const picks = watchVacuumPicks(tile);
  if (picks.cleaningMode === null) picks.cleaningMode = siblings.selects.find((id) => id.includes("cleaning_mode")) ?? null;
  if (picks.switches.length === 0) picks.switches = siblings.switches.slice();
  if (picks.battery === null) picks.battery = siblings.sensors.find((id) => id.includes("battery")) ?? null;
  return picks;
}

/** Apply: each pick that is set is written; an extra select writes its label
 * (the object id made readable, else "Extra"); picked switches not linked
 * yet are appended in pick order. */
export function applyWatchVacuumDiscovery(document: WatchPagesDocument, pageId: string, tileId: string, picks: Partial<WatchVacuumPicks>): WatchPagesDocument {
  const ok = (id: unknown, domains: readonly string[]): id is string => typeof id === "string" && domains.includes(tileKind(id)) && tileTarget(id) !== "";
  return editTile(document, pageId, tileId, (tile) => {
    if (!isVacuum(tile)) return tile;
    let next = tile;
    if (ok(picks.cleaningMode, T.vacuum.selectDomains)) next = withKey(next, "vacuumCleaningModeEntityId", picks.cleaningMode);
    if (ok(picks.fanSpeed, T.vacuum.selectDomains)) next = withKey(next, "vacuumFanSpeedEntityId", picks.fanSpeed);
    if (ok(picks.extraSelect, T.vacuum.selectDomains)) {
      next = withKey(next, "vacuumExtraSelectEntityId", picks.extraSelect);
      next = withKey(next, "vacuumExtraSelectLabel", watchObjectName(picks.extraSelect) || T.vacuum.extraLabelFallback);
    }
    const switches = (picks.switches ?? []).filter((id) => ok(id, ["switch"]));
    if (switches.length > 0) {
      const existing = strings(tile.vacuumSwitchEntityIds) ?? [];
      const added = switches.filter((id, i) => !existing.includes(id) && switches.indexOf(id) === i);
      if (added.length > 0) next = withKey(next, "vacuumSwitchEntityIds", [...existing, ...added]);
    }
    if (ok(picks.battery, ["sensor"])) next = withKey(next, "vacuumBatteryEntityId", picks.battery);
    return next;
  });
}

/** The line under Discover after Apply. */
export function watchVacuumDiscoveryResult(picks: WatchVacuumPicks): string {
  const parts: string[] = [];
  if (picks.cleaningMode !== null) parts.push("Cleaning Mode");
  if (picks.fanSpeed !== null) parts.push("Fan Speed");
  if (picks.extraSelect !== null) parts.push("Extra Tab");
  if (picks.switches.length > 0) parts.push(`${picks.switches.length} switch${picks.switches.length === 1 ? "" : "es"}`);
  if (picks.battery !== null) parts.push("Battery");
  return parts.length === 0 ? "No changes applied" : `Linked: ${parts.join(", ")}`;
}

/** Whether the watch finds a cleaning mode select on its own. */
export function watchCleaningModeAutoDetectable(vacuumEntityId: string, selectIds: readonly string[]): boolean {
  const name = vacuumEntityId.replaceAll("vacuum.", "");
  if (name === "") return false;
  if (selectIds.includes(`select.${name}_cleaning_mode`) || selectIds.includes(`input_select.${name}_cleaning_mode`)) return true;
  const candidates = selectIds.filter((id) => id.endsWith("cleaning_mode"));
  if (candidates.some((id) => id.includes(name))) return true;
  return candidates.length === 1;
}

/** The rows that need a linked entity: the vacuum lacks the attribute, none
 * is linked, and for the cleaning mode the watch would not find one. */
export function watchVacuumAttention(tile: WatchPageTile, states: WatchSpecialStates | undefined): { cleaningMode: boolean; fanSpeed: boolean; battery: boolean; any: boolean } {
  const entityId = tileEntityId(tile);
  const a = stateOf(states, entityId)?.attributes ?? {};
  const nonEmpty = (v: unknown) => Array.isArray(v) && v.length > 0;
  const picks = watchVacuumPicks(tile);
  const selectIds = Object.keys(states ?? {}).filter((id) => T.vacuum.selectDomains.includes(tileKind(id)));
  const cleaningMode = !(nonEmpty(a.cleaning_modes) || nonEmpty(a.cleaning_mode_list)) && picks.cleaningMode === null
    && !watchCleaningModeAutoDetectable(entityId, selectIds);
  const fanSpeed = !nonEmpty(a.fan_speed_list) && picks.fanSpeed === null;
  const battery = num(a.battery_level) === undefined && picks.battery === null;
  return { cleaningMode, fanSpeed, battery, any: cleaningMode || fanSpeed || battery };
}

/** The battery sensors to pick from: every sensor, battery class (or a
 * battery id) first, then by name. */
export function watchBatterySensors(states: WatchSpecialStates | undefined): string[] {
  const ids = Object.keys(states ?? {}).filter((id) => tileKind(id) === "sensor");
  const name = (id: string) => {
    const n = stateOf(states, id)?.attributes?.friendly_name;
    return typeof n === "string" && n !== "" ? n : id;
  };
  const battery = (id: string) => stateOf(states, id)?.attributes?.device_class === T.vacuum.batteryDeviceClass || id.includes("battery");
  return ids.sort((a, b) => Number(battery(b)) - Number(battery(a)) || name(a).localeCompare(name(b)));
}

// ── Battery (vacuum and mower) ───────────────────────────────────────────

export const setWatchShowBattery = boolSetter("showBatteryOnTile", (tile) => isVacuum(tile) || isMower(tile));
export const setWatchMowerBattery = entitySetter("mowerBatteryEntityId", ["sensor"], isMower);

/** "Show Battery on Tile" as the watch reads it. */
export function watchShowBattery(tile: WatchPageTile): boolean {
  return boolOr(tile.showBatteryOnTile, watchTileKeyDefault("showBatteryOnTile") === true);
}

/** The sensor a mower with no `mowerBatteryEntityId` reads. */
export function watchMowerFallbackBatteryId(mowerEntityId: string): string {
  return T.mower.fallbackBatteryId.replace("<object id>", tileTarget(mowerEntityId));
}

/** Whether the mower's battery is known: a sensor is linked, or the
 * fallback sensor exists. */
export function watchMowerBatteryResolved(tile: WatchPageTile, states: WatchSpecialStates | undefined): boolean {
  return entityOr(tile.mowerBatteryEntityId) !== undefined || stateOf(states, watchMowerFallbackBatteryId(tileEntityId(tile))) !== undefined;
}

// ── Calendar ─────────────────────────────────────────────────────────────

const isCalendar = isKind("calendar");

/** The tile's calendars: the primary, then the extras. */
export function watchCalendarIds(tile: WatchPageTile): string[] {
  return [tileEntityId(tile), ...(strings(tile.additionalCalendarEntityIds) ?? [])];
}

/** A calendar's color, or undefined for none. */
export function watchCalendarSourceColor(tile: WatchPageTile, id: string): string | undefined {
  const map = tile.calendarSourceColors;
  return isJsonObject(map) && Object.hasOwn(map, id) ? str(map[id]) : undefined;
}

function colorMap(tile: WatchPageTile): Record<string, unknown> {
  return isJsonObject(tile.calendarSourceColors) ? tile.calendarSourceColors : {};
}

/** "Add Calendar": each picked calendar that is neither the primary nor an
 * extra is appended, with the add's color when it has none. */
export function addWatchCalendars(document: WatchPagesDocument, pageId: string, tileId: string, ids: readonly string[]): WatchPagesDocument {
  const picked = ids.map((id) => id.trim()).filter((id) => tileKind(id) === "calendar" && tileTarget(id) !== "");
  return editTile(document, pageId, tileId, (tile) => {
    if (!isCalendar(tile)) return tile;
    const extras = strings(tile.additionalCalendarEntityIds) ?? [];
    let colors = colorMap(tile);
    for (const id of picked) {
      if (id === tileEntityId(tile) || extras.includes(id)) continue;
      extras.push(id);
      if (colors[id] === undefined || colors[id] === null) colors = withField(colors, id, watchCalendarColor(id));
    }
    let next = extras.length === 0 ? withoutKey(tile, "additionalCalendarEntityIds") : withKey(tile, "additionalCalendarEntityIds", extras);
    next = Object.keys(colors).length === 0 ? withoutKey(next, "calendarSourceColors") : withKey(next, "calendarSourceColors", colors);
    return next;
  });
}

/** Remove (offered with two calendars or more): the primary's place goes to
 * the first extra (the label stays); the calendar's color goes. */
export function removeWatchCalendar(document: WatchPagesDocument, pageId: string, tileId: string, id: string): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isCalendar(tile) || watchCalendarIds(tile).length <= 1) return tile;
    let extras = strings(tile.additionalCalendarEntityIds) ?? [];
    let next = tile;
    if (id === tileEntityId(tile)) {
      const first = extras[0];
      if (first === undefined) return tile;
      next = withKey(next, "entityId", first);
      extras = extras.slice(1);
    } else {
      if (!extras.includes(id)) return tile;
      extras = extras.filter((e) => e !== id);
    }
    next = extras.length === 0 ? withoutKey(next, "additionalCalendarEntityIds") : withKey(next, "additionalCalendarEntityIds", extras);
    const colors = { ...colorMap(tile) };
    delete colors[id];
    return Object.keys(colors).length === 0 ? withoutKey(next, "calendarSourceColors") : withKey(next, "calendarSourceColors", colors);
  });
}

/** A calendar's swatch, as listed, or none (null) removing its entry; an
 * empty map is removed. */
export function setWatchCalendarColor(document: WatchPagesDocument, pageId: string, tileId: string, id: string, hex: string | null): WatchPagesDocument {
  if (hex !== null && !colorAccepted(hex, false)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isCalendar(tile) || !watchCalendarIds(tile).includes(id)) return tile;
    let colors = colorMap(tile);
    if (hex === null) {
      if (!Object.hasOwn(colors, id)) return tile;
      colors = { ...colors };
      delete colors[id];
    } else {
      if (Object.hasOwn(colors, id) && sameValue(colors[id], hex)) return tile;
      colors = withField(colors, id, hex);
    }
    return Object.keys(colors).length === 0 ? withoutKey(tile, "calendarSourceColors") : withKey(tile, "calendarSourceColors", colors);
  });
}

// ── Weather ──────────────────────────────────────────────────────────────

const isWeather = isKind("weather");

/** The detail text size as the watch reads it, and whether it is stored. */
export function watchWeatherSettings(tile: WatchPageTile): { textScale: number; textScaleStored: boolean; showIcons: boolean } {
  const scale = num(tile.weatherDetailTextScale);
  return {
    textScale: scale ?? T.weather.textScale.auto,
    textScaleStored: scale !== undefined,
    showIcons: boolOr(tile.weatherDetailShowIcons, T.weather.showIcons.absent),
  };
}

/** "Text Size": held to the slider's range, snapped to the step, written as
 * the clean decimal, removed at the default. */
export function setWatchWeatherTextScale(document: WatchPagesDocument, pageId: string, tileId: string, value: number): WatchPagesDocument {
  const s = T.weather.textScale;
  if (typeof value !== "number" || !Number.isFinite(value)) return document;
  const steps = Math.round(Math.min(s.max, Math.max(s.min, value)) / s.step);
  const snapped = steps / Math.round(1 / s.step);
  return setKey(document, pageId, tileId, s.key, (tile) => (isWeather(tile) ? (Math.abs(snapped - s.auto) < 0.001 ? REMOVE : snapped) : undefined));
}

/** "Show Icons": on removes the key, off writes false. */
export function setWatchWeatherShowIcons(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, T.weather.showIcons.key, (tile) => (isWeather(tile) ? (on ? REMOVE : false) : undefined));
}

// ── Person and alarm ─────────────────────────────────────────────────────

export const setWatchUsePersonPhoto = boolSetter("usePersonPhoto", isKind("person"));

/** Whether a person tile has an icon of its own (`hasCustomPersonIcon`): a
 * state icon that is not empty, or an `icon` other than `person`, `""`
 * included. */
export function watchHasCustomPersonIcon(tile: WatchPageTile): boolean {
  const icons = tile.stateIcons;
  if (isJsonObject(icons) && Object.values(icons).some((v) => typeof v === "string" && v !== "")) return true;
  return typeof tile.icon === "string" && tile.icon !== "person";
}

/** Photo or Icon as the watch reads it (`resolvedUsePersonPhoto`): the
 * stored choice, else Photo unless the tile has an icon of its own. The
 * preview draws by the same rule. */
export function watchUsesPersonPhoto(tile: WatchPageTile): boolean {
  return typeof tile.usePersonPhoto === "boolean" ? tile.usePersonPhoto : !watchHasCustomPersonIcon(tile);
}

/** "Auto-Submit": on writes true, off removes the key. */
export function setWatchAlarmAutoSubmit(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, T.alarm.key, (tile) => (kindOf(tile) === "alarm_control_panel" ? (on ? true : REMOVE) : undefined));
}

export function watchAlarmAutoSubmit(tile: WatchPageTile): boolean {
  return boolOr(tile.autoSubmitPIN, T.alarm.absent);
}

// ── resets ───────────────────────────────────────────────────────────────

/** The keys a task's reset writes for this tile: the table's, with the
 * speak message tile's own output mode. */
function resetKeys(tile: WatchPageTile, task: WatchSpecialTask): Record<string, unknown> | undefined {
  const keys = Object.hasOwn(T.resets, task) ? T.resets[task] : undefined;
  if (keys === undefined || Object.keys(keys).length === 0) return undefined;
  if (task === "data" && kindOf(tile) === "speak_message") return { ...keys, speakMessageOutputMode: "configuredSpeakers" };
  return keys;
}

/** A task's reset: each key written with its value, a null one removed.
 * Camera, Calendars and Weather have none. */
export function resetWatchSpecialTask(document: WatchPagesDocument, pageId: string, tileId: string, task: WatchSpecialTask): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const keys = resetKeys(tile, task);
    if (keys === undefined) return tile;
    let next = tile;
    for (const [key, value] of Object.entries(keys)) next = value === null ? withoutKey(next, key) : withKey(next, key, value);
    return next;
  });
}

/** Whether a task's reset would change the tile. */
export function watchSpecialTaskModified(tile: WatchPageTile, task: WatchSpecialTask): boolean {
  const keys = resetKeys(tile, task);
  if (keys === undefined) return false;
  return Object.entries(keys).some(([key, value]) => (value === null ? Object.hasOwn(tile, key) : !sameValue(tile[key], value)));
}

// ── the setters by key ───────────────────────────────────────────────────

/** The setter of every special row that writes one key, by that key. */
export const WATCH_SPECIAL_SETTERS: Readonly<Record<string, Setter<never>>> = {
  associatedMediaPlayerId: setWatchRemoteMediaPlayer,
  associatedVolumePlayerId: setWatchRemoteVolumePlayer,
  remoteCrownSelectEnabled: setWatchRemoteCrownSelect,
  remoteCrownBackEnabled: setWatchRemoteCrownBack,
  remoteEdgeVolumeEnabled: setWatchRemoteEdgeVolume,
  remoteEdgeVolumeSide: setWatchRemoteEdgeSide,
  remoteQuickActionConfirm: setWatchRemoteQuickConfirm,
  cameraRefreshOnOpen: setWatchCameraRefresh,
  multiCamBorderEnabled: setWatchCameraBorder,
  multiCamBorderColor: setWatchCameraBorderColor,
  multiCamBorderThickness: setWatchCameraBorderThickness,
  showBatteryOnTile: setWatchShowBattery,
  mowerBatteryEntityId: setWatchMowerBattery,
  usePersonPhoto: setWatchUsePersonPhoto,
};

/** Every tile key a special setter here writes or removes. */
export const WATCH_SPECIAL_SETTING_KEYS: readonly string[] = [
  ...Object.keys(WATCH_SPECIAL_SETTERS),
  "remoteButtonLayout",
  ...LAUNCHER_KEYS,
  "cameraDisplayMode",
  "cameraFillMode",
  "cameraFillOffsetX",
  "cameraFillOffsetY",
  "cameraAspectRatio",
  "cameraGridColumns",
  "cameraRowWeights",
  "cameraFillModes",
  "cameraFillOffsetsX",
  "cameraFillOffsetsY",
  "cameraGroupIds",
  "multiCamTapMode",
  "customLabel",
  "entityId",
  "vacuumCleaningModeEntityId",
  "vacuumFanSpeedEntityId",
  "vacuumExtraSelectEntityId",
  "vacuumExtraSelectLabel",
  "vacuumSwitchEntityIds",
  "vacuumBatteryEntityId",
  "additionalCalendarEntityIds",
  "calendarSourceColors",
  "weatherDetailTextScale",
  "weatherDetailShowIcons",
  "autoSubmitPIN",
];
