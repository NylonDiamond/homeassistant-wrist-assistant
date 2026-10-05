// The settings of the two library tiles, without any drawing: the target of
// an HTTP action or status page tile and the Request task of an HTTP action
// tile (part 3e).
//
// The setters follow `tile-settings-model.ts`: the raw document, a page id
// and a tile id in, a new document out in which only the path is new, a new
// key at its sorted place, a removed key deleted. A setter refuses by
// returning the document it was given: a tile of another kind, a value the
// phone could not write. Each one writes what the phone's
// `TileAddDefaults.libraryRetarget` and `LibraryTileRules` write; the shared
// case files (`test/fixtures-pages/settings`) pin them.
//
// Every key here is a tile key: none needs the catalog. The view asks the
// catalog only for what to offer (the targets, whether an action has a reply
// value) and for the old target's name a label follows.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3e build contract").

import { sameWatchId } from "./edit.js";
import { type WatchLibraryKind, watchLibraryTarget } from "./catalog.js";
import { type WatchPageTile, type WatchPagesDocument, tileEntityId } from "./model.js";
import { watchLibraryEntityId } from "./tile-new.js";
import { REMOVE, editTile, isBool, normalizeWatchColor, setKey, withKey, withOptional, withoutKey } from "./tile-settings-model.js";

// ── the target ───────────────────────────────────────────────────────────

/**
 * Point an HTTP action or status page tile at another entry of its
 * library (`libraryRetarget`): `entityId` becomes the kind's prefix and the
 * new id in upper case. The label becomes the new entry's `name` only while
 * it is one of `oldTargetNames` (the old entry's names now; none when it is
 * gone) or empty or absent. Icon, color and every other key stay.
 * Retargeting to the entry it already points at (ids compared without
 * regard to case) changes nothing; so does a tile of another kind.
 *
 * The phone passes an HTTP action's two names, the one its add writes now
 * and its URL for an unnamed one, which an older add wrote. The panel knows
 * only the catalog's name, so it passes that alone: a label that is an old
 * URL stays here, and follows on the phone.
 */
export function setWatchLibraryTileTarget(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  kind: WatchLibraryKind,
  entry: { id: string; name: string },
  oldTargetNames: readonly string[] = [],
): WatchPagesDocument {
  if (typeof entry?.id !== "string" || entry.id === "" || typeof entry.name !== "string") return document;
  return editTile(document, pageId, tileId, (tile) => {
    const target = watchLibraryTarget(tileEntityId(tile));
    if (target === undefined || target.kind !== kind || sameWatchId(target.id, entry.id)) return tile;
    const label = tile.customLabel;
    const follows =
      label === undefined || label === null || label === "" || (typeof label === "string" && oldTargetNames.includes(label));
    const next = withKey(tile, "entityId", watchLibraryEntityId(kind, entry.id));
    return follows ? withKey(next, "customLabel", entry.name) : next;
  });
}

// ── the Request task ─────────────────────────────────────────────────────

/** Show Reply on Watch: Off is no key. */
export type WatchHTTPReply = "toast" | "tileValue";

/** The Tile Value keys, which go when the tile leaves Tile Value. */
const TILE_VALUE_KEYS = [
  "httpAutoRefreshOnOpen",
  "httpAutoRefreshOnPull",
  "httpAutoRefreshInterval",
  "httpTileValueShowName",
  "httpTileValueFontSize",
  "httpTileValueColorHex",
  "httpTileValueOffsetY",
  "httpTileValueLineLimit",
  "httpTileValueLineSpacing",
] as const;

/** Every tile key the target and Request setters write or remove. */
export const WATCH_LIBRARY_SETTING_KEYS: readonly string[] = [
  "entityId",
  "customLabel",
  "icon",
  "httpResponseDisplay",
  "httpToastSeconds",
  ...TILE_VALUE_KEYS,
];

/** The reply banner's seconds a tile may store: 3, the standard, is no
 * key. */
export const WATCH_HTTP_TOAST_SECONDS: readonly number[] = [1, 2, 5];

/** The Auto-Refresh ladder (`HTTPAutoRefreshMode.rungs`): off, on open, then
 * every so many seconds. */
export const WATCH_HTTP_REFRESH_SECONDS: readonly number[] = [1, 3, 5, 10, 30];
export type WatchHTTPRefresh = "off" | "onOpen" | number;

/** The ranges of the Tile Value sliders, as the phone's rows have them. */
export const WATCH_HTTP_VALUE_RANGES = {
  fontSize: { min: 6, max: 36, auto: 14 },
  lineLimit: { min: 1, max: 8, auto: 2 },
  lineSpacing: { min: 0, max: 12 },
  offsetY: { min: -20, max: 20 },
} as const;

function isHTTPTile(tile: WatchPageTile): boolean {
  return watchLibraryTarget(tileEntityId(tile))?.kind === "httpAction";
}

/** The stored reply mode as the phone resolves it: an unknown string is
 * Off. */
function replyOf(tile: WatchPageTile): WatchHTTPReply | undefined {
  return tile.httpResponseDisplay === "toast" || tile.httpResponseDisplay === "tileValue" ? tile.httpResponseDisplay : undefined;
}

/** What the Request task shows for an HTTP action tile. */
export interface WatchHTTPRequestSettings {
  /** As the watch reads it; undefined is Off. */
  reply: WatchHTTPReply | undefined;
  /** The stored string, when it is one the watch does not know. */
  replyStoredUnknown: string | undefined;
  /** The stored banner seconds, undefined for the standard 3. */
  toastSeconds: number | undefined;
  refresh: WatchHTTPRefresh;
  refreshOnPull: boolean;
  showName: boolean;
  /** Absent is Auto. */
  fontSize: number | undefined;
  /** Absent is Auto. */
  lineLimit: number | undefined;
  /** 0 when absent. */
  lineSpacing: number;
  /** 0 when absent (centered). */
  offsetY: number;
  /** Absent is the watch's own. */
  color: string | undefined;
}

const num = (value: unknown): number | undefined => (typeof value === "number" && Number.isFinite(value) ? value : undefined);

/** The Request task's values for an HTTP action tile, absent keys read as
 * the phone reads them. */
export function watchHTTPRequestSettings(tile: WatchPageTile): WatchHTTPRequestSettings {
  const interval = num(tile.httpAutoRefreshInterval);
  const stored = tile.httpResponseDisplay;
  return {
    reply: replyOf(tile),
    replyStoredUnknown: typeof stored === "string" && replyOf(tile) === undefined ? stored : undefined,
    toastSeconds: num(tile.httpToastSeconds),
    refresh: interval !== undefined && interval > 0 ? interval : tile.httpAutoRefreshOnOpen === true ? "onOpen" : "off",
    refreshOnPull: tile.httpAutoRefreshOnPull === true,
    showName: tile.httpTileValueShowName !== false,
    fontSize: num(tile.httpTileValueFontSize),
    lineLimit: num(tile.httpTileValueLineLimit),
    lineSpacing: num(tile.httpTileValueLineSpacing) ?? 0,
    offsetY: num(tile.httpTileValueOffsetY) ?? 0,
    color: typeof tile.httpTileValueColorHex === "string" ? tile.httpTileValueColorHex : undefined,
  };
}

/**
 * Show Reply on Watch (`LibraryTileRules.setHTTPResponseDisplay`): `toast`,
 * `tileValue`, or `null` for Off (the key removed). Into Tile Value writes
 * the no-icon value `""`; out of it removes the icon while it is still
 * `""`. Anything but Banner removes `httpToastSeconds`; anything but Tile
 * Value removes every Tile Value key. Only on an HTTP action tile.
 */
export function setWatchTileHTTPReply(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  value: WatchHTTPReply | null,
): WatchPagesDocument {
  if (value !== null && value !== "toast" && value !== "tileValue") return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isHTTPTile(tile)) return tile;
    const old = replyOf(tile);
    let next = withOptional(tile, "httpResponseDisplay", value ?? undefined);
    if (value === "tileValue" && old !== "tileValue") next = withKey(next, "icon", "");
    else if (value !== "tileValue" && old === "tileValue" && next.icon === "") next = withoutKey(next, "icon");
    if (value !== "toast") next = withoutKey(next, "httpToastSeconds");
    if (value !== "tileValue") for (const key of TILE_VALUE_KEYS) next = withoutKey(next, key);
    return next;
  });
}

/** Banner Duration: 1, 2 or 5 seconds written; 3, the standard, or `null`
 * removes the key. */
export function setWatchTileHTTPToastSeconds(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  seconds: number | null,
): WatchPagesDocument {
  const remove = seconds === null || seconds === 3;
  if (!remove && (typeof seconds !== "number" || !WATCH_HTTP_TOAST_SECONDS.includes(seconds))) return document;
  return setKey(document, pageId, tileId, "httpToastSeconds", (tile) => (isHTTPTile(tile) ? (remove ? REMOVE : seconds) : undefined));
}

/** A Tile Value row's edit: only on an HTTP action tile showing its reply
 * as Tile Value (the rows show only then, and leaving it removes them). */
function setTileValueKey(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  key: string,
  value: unknown,
): WatchPagesDocument {
  if (value === undefined) return document;
  return setKey(document, pageId, tileId, key, (tile) => (isHTTPTile(tile) && replyOf(tile) === "tileValue" ? value : undefined));
}

/** A whole number in `min...max` (rounded), or undefined. */
function wholeIn(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  return n < min || n > max ? undefined : n;
}

/**
 * Auto-Refresh (`HTTPAutoRefreshMode`): Off removes both keys, On Open
 * writes `httpAutoRefreshOnOpen: true` and removes the interval, a number of
 * seconds from the ladder writes `httpAutoRefreshInterval` and removes the
 * on open key. One edit.
 */
export function setWatchTileHTTPRefresh(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  refresh: WatchHTTPRefresh,
): WatchPagesDocument {
  const every = typeof refresh === "number" ? refresh : undefined;
  if (refresh !== "off" && refresh !== "onOpen" && (every === undefined || !WATCH_HTTP_REFRESH_SECONDS.includes(every))) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!isHTTPTile(tile) || replyOf(tile) !== "tileValue") return tile;
    const next = withOptional(tile, "httpAutoRefreshOnOpen", refresh === "onOpen" ? true : undefined);
    return withOptional(next, "httpAutoRefreshInterval", every);
  });
}

/** Refresh on Pull: on writes `true`, off removes the key. */
export function setWatchTileHTTPRefreshOnPull(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  return isBool(on) ? setTileValueKey(document, pageId, tileId, "httpAutoRefreshOnPull", on ? true : REMOVE) : document;
}

/** Show Name: on (the default) removes the key, off writes `false`. */
export function setWatchTileHTTPShowName(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  return isBool(on) ? setTileValueKey(document, pageId, tileId, "httpTileValueShowName", on ? REMOVE : false) : document;
}

/** Text Size: a whole number from 6 to 36, or `null` for Auto. */
export function setWatchTileHTTPValueFontSize(document: WatchPagesDocument, pageId: string, tileId: string, size: number | null): WatchPagesDocument {
  const r = WATCH_HTTP_VALUE_RANGES.fontSize;
  return setTileValueKey(document, pageId, tileId, "httpTileValueFontSize", size === null ? REMOVE : wholeIn(size, r.min, r.max));
}

/** Lines: a whole number from 1 to 8, or `null` for Auto. */
export function setWatchTileHTTPValueLineLimit(document: WatchPagesDocument, pageId: string, tileId: string, lines: number | null): WatchPagesDocument {
  const r = WATCH_HTTP_VALUE_RANGES.lineLimit;
  return setTileValueKey(document, pageId, tileId, "httpTileValueLineLimit", lines === null ? REMOVE : wholeIn(lines, r.min, r.max));
}

/** Line Spacing: a whole number of points from 0 to 12; 0 removes the
 * key. */
export function setWatchTileHTTPValueLineSpacing(document: WatchPagesDocument, pageId: string, tileId: string, spacing: number): WatchPagesDocument {
  const r = WATCH_HTTP_VALUE_RANGES.lineSpacing;
  const n = wholeIn(spacing, r.min, r.max);
  return setTileValueKey(document, pageId, tileId, "httpTileValueLineSpacing", n === 0 ? REMOVE : n);
}

/** Vertical Position: a whole number of points from -20 (up) to 20 (down);
 * 0, centered, removes the key. */
export function setWatchTileHTTPValueOffsetY(document: WatchPagesDocument, pageId: string, tileId: string, offset: number): WatchPagesDocument {
  const r = WATCH_HTTP_VALUE_RANGES.offsetY;
  const n = wholeIn(offset, r.min, r.max);
  return setTileValueKey(document, pageId, tileId, "httpTileValueOffsetY", n === 0 ? REMOVE : n);
}

/** Text Color: `#RRGGBB` (the phone's picker has no gradient or rainbow
 * here), or `null` (Reset) to remove the key. */
export function setWatchTileHTTPValueColor(document: WatchPagesDocument, pageId: string, tileId: string, color: string | null): WatchPagesDocument {
  return setTileValueKey(document, pageId, tileId, "httpTileValueColorHex", color === null ? REMOVE : normalizeWatchColor(color, "solid"));
}
