// A tile group's look, without any drawing: what the watch reads from a
// page's `groups` entry (`TileGroup`, GridConfiguration.swift) and the
// setters the group card edits it with. Making a group, Ungroup and Leave
// group change tiles as well, so they live with the other tile edits in
// `edit.ts` (`makeWatchTileGroup`, `ungroupWatchTileGroup`,
// `leaveWatchTileGroup`).
//
// The setters follow `styling-model.ts`: they take the raw document, a page
// id and a group id, change only the objects on the path, keep every key
// they do not know, write a new key at its sorted place, and refuse by
// returning the document they were given. An optional key the person sets
// back to what its absence means is removed, never written as null. The
// overlay's five keys and the pattern are required on the watch (a group
// without one fails to decode, and the page with it), so their defaults are
// written.
//
// The ranges are the old iPhone editor's (`StyleTabContent`, removed in app
// commit bbbb37b2): pattern opacity 0 to 1, pattern size 0.25 to 4, overlay
// speed 0.25 to 3, intensity and size 0.5 to 2. The watch draws no group
// border, so there is none here.

import { findWatchPage, sameWatchId } from "./edit.js";
import pageKeys from "./page-keys.json";
import { type JsonObject, type WatchPage, type WatchPagesDocument, isJsonObject, isSmartWatchPage, watchPageTiles } from "./model.js";
import { watchSliderValue } from "./styling-model.js";
import { normalizeWatchColor, sameValue, withField } from "./tile-settings-model.js";
import type { WatchStylingSlider } from "./tile-styling.js";

// ── reading ──────────────────────────────────────────────────────────────

/** A group's look as the watch reads it, absent keys read as it decodes
 * them. */
export interface WatchGroupLook {
  pattern: string;
  /** What the watch draws: the stored opacity, else 0.5 with a pattern
   * color and 1 without one (`GroupBackgroundPatternView`). */
  patternOpacity: number;
  patternScale: number;
  /** Absent means the pattern's own gray. */
  patternColor: string | undefined;
  overlay: string;
  overlayColor: string;
  overlaySpeed: number;
  overlayIntensity: number;
  overlaySize: number;
}

/** The sliders of the group card. */
export const WATCH_GROUP_SLIDERS: Readonly<Record<"patternOpacity" | "patternScale" | "overlaySpeed" | "overlayIntensity" | "overlaySize", WatchStylingSlider>> = {
  patternOpacity: { min: 0, max: 1, step: 0.01 },
  patternScale: { min: 0.25, max: 4, step: 0.01, auto: 1 },
  overlaySpeed: { min: 0.25, max: 3, step: 0.25, auto: 1 },
  overlayIntensity: { min: 0.5, max: 2, step: 0.25, auto: 1 },
  overlaySize: { min: 0.5, max: 2, step: 0.25, auto: 1 },
};

/** The opacity the old editor started a pattern at, and wrote with it. */
export const WATCH_GROUP_PATTERN_OPACITY = 0.5;

const ENUMS = (pageKeys as unknown as { enums: Record<string, string[]> }).enums;
const PATTERNS: readonly string[] = ENUMS.TileBackgroundPattern ?? [];
const OVERLAYS: readonly string[] = ENUMS.GroupOverlayStyle ?? [];

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** What an absent `backgroundPatternOpacity` draws as: 0.5 under a pattern
 * color, 1 without one. */
function absentOpacity(group: JsonObject): number {
  return group.backgroundPatternColor !== undefined && group.backgroundPatternColor !== null ? WATCH_GROUP_PATTERN_OPACITY : 1;
}

export function watchGroupLook(group: JsonObject): WatchGroupLook {
  return {
    pattern: str(group.backgroundPattern) ?? "none",
    patternOpacity: num(group.backgroundPatternOpacity) ?? absentOpacity(group),
    patternScale: num(group.backgroundPatternScale) ?? 1,
    patternColor: str(group.backgroundPatternColor),
    overlay: str(group.overlayStyle) ?? "none",
    overlayColor: str(group.overlayColor) ?? "#FFFFFF",
    overlaySpeed: num(group.overlaySpeed) ?? 1,
    overlayIntensity: num(group.overlayIntensity) ?? 1,
    overlaySize: num(group.overlaySize) ?? 1,
  };
}

/** A page's group with this id, or undefined. */
export function watchTileGroup(page: WatchPage | undefined, groupId: unknown): JsonObject | undefined {
  if (page === undefined || typeof groupId !== "string" || groupId === "" || !Array.isArray(page.groups)) return undefined;
  return page.groups.find((g): g is JsonObject => isJsonObject(g) && sameWatchId(g.id, groupId));
}

/** The ids of the page's tiles in a group, in stored order. */
export function watchGroupTileIds(page: WatchPage | undefined, groupId: string): string[] {
  return watchPageTiles(page)
    .filter((t) => sameWatchId(t.groupId, groupId) && typeof t.id === "string" && t.id !== "")
    .map((t) => t.id as string);
}

/** The group every one of these tiles is in, when they share one the page
 * has; else undefined. */
export function watchSharedGroupId(page: WatchPage | undefined, tileIds: readonly string[]): string | undefined {
  if (page === undefined || tileIds.length === 0) return undefined;
  const tiles = watchPageTiles(page);
  let shared: string | undefined;
  for (const id of tileIds) {
    const tile = tiles.find((t) => sameWatchId(t.id, id));
    const groupId = str(tile?.groupId);
    if (groupId === undefined || groupId === "") return undefined;
    if (shared === undefined) shared = groupId;
    else if (!sameWatchId(shared, groupId)) return undefined;
  }
  return watchTileGroup(page, shared) === undefined ? undefined : shared;
}

// ── writing ──────────────────────────────────────────────────────────────

/** The group object with `key` set (sorted place), or removed for
 * undefined; the object itself when nothing changes. */
function withGroupKey(group: JsonObject, key: string, value: unknown): JsonObject {
  if (value === undefined) {
    if (!Object.hasOwn(group, key)) return group;
    const next = { ...group };
    delete next[key];
    return next;
  }
  if (Object.hasOwn(group, key) && sameValue(group[key], value)) return group;
  return withField(group, key, value);
}

/** One group of a page changed. Refused on a page that is missing or smart
 * and for a group the page lacks. */
export function editWatchTileGroup(
  document: WatchPagesDocument,
  pageId: string,
  groupId: string,
  change: (group: JsonObject) => JsonObject,
): WatchPagesDocument {
  const page = findWatchPage(document, pageId);
  const pages = document.pages;
  if (page === undefined || isSmartWatchPage(page) || !Array.isArray(page.groups) || !Array.isArray(pages)) return document;
  const index = page.groups.findIndex((g) => isJsonObject(g) && sameWatchId(g.id, groupId));
  if (index < 0) return document;
  const group = page.groups[index] as JsonObject;
  const next = change(group);
  if (next === group) return document;
  const groups = page.groups.slice();
  groups[index] = next;
  const nextPages = pages.slice();
  nextPages[pages.indexOf(page)] = { ...page, groups };
  return { ...document, pages: nextPages };
}

type GroupSetter<V> = (document: WatchPagesDocument, pageId: string, groupId: string, value: V) => WatchPagesDocument;

/** The opacity key for what should be drawn: removed when that is what its
 * absence draws now. */
function withOpacity(group: JsonObject, opacity: number): JsonObject {
  return withGroupKey(group, "backgroundPatternOpacity", opacity === absentOpacity(group) ? undefined : opacity);
}

/** Pattern, any `TileBackgroundPattern`. A pattern picked on a group with
 * none and no opacity of its own starts at 50%, as the old editor wrote it.
 * Picking None keeps the opacity, size and color. */
export const setWatchGroupPattern: GroupSetter<string> = (document, pageId, groupId, value) => {
  if (!PATTERNS.includes(value)) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => {
    let next = withGroupKey(group, "backgroundPattern", value);
    const was = str(group.backgroundPattern) ?? "none";
    if (was === "none" && value !== "none" && num(group.backgroundPatternOpacity) === undefined) {
      next = withOpacity(next, WATCH_GROUP_PATTERN_OPACITY);
    }
    return next;
  });
};

/** Pattern opacity, 0 to 1 in hundredths. The value an absent key draws
 * (0.5 with a pattern color, 1 without) removes the key. */
export const setWatchGroupPatternOpacity: GroupSetter<number> = (document, pageId, groupId, value) => {
  const v = watchSliderValue(value, WATCH_GROUP_SLIDERS.patternOpacity);
  if (v === undefined) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => withOpacity(group, v));
};

/** Pattern size, 0.25 to 4; 1 removes the key. */
export const setWatchGroupPatternScale: GroupSetter<number> = (document, pageId, groupId, value) => {
  const v = watchSliderValue(value, WATCH_GROUP_SLIDERS.patternScale);
  if (v === undefined) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => withGroupKey(group, "backgroundPatternScale", v === 1 ? undefined : v));
};

/** Pattern color, `#RRGGBB`; `null` removes the key (the pattern's own
 * gray). The opacity drawn stays as it was: an absent opacity draws 0.5
 * under a color and 1 without one, so the key is written or removed to
 * keep it. */
export const setWatchGroupPatternColor: GroupSetter<string | null> = (document, pageId, groupId, color) => {
  const v = color === null ? null : normalizeWatchColor(color, "solid");
  if (v === undefined) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => {
    const drawn = watchGroupLook(group).patternOpacity;
    const next = withGroupKey(group, "backgroundPatternColor", v ?? undefined);
    return next === group ? group : withOpacity(next, drawn);
  });
};

/** Animated overlay, any `GroupOverlayStyle`. Picking None keeps the
 * overlay's color, speed, intensity and size. */
export const setWatchGroupOverlay: GroupSetter<string> = (document, pageId, groupId, value) => {
  if (!OVERLAYS.includes(value)) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => withGroupKey(group, "overlayStyle", value));
};

/** Overlay color, `#RRGGBB`. Required, so there is no "none". */
export const setWatchGroupOverlayColor: GroupSetter<string> = (document, pageId, groupId, color) => {
  const v = normalizeWatchColor(color, "solid");
  if (v === undefined) return document;
  return editWatchTileGroup(document, pageId, groupId, (group) => withGroupKey(group, "overlayColor", v));
};

function requiredSlider(key: "overlaySpeed" | "overlayIntensity" | "overlaySize"): GroupSetter<number> {
  return (document, pageId, groupId, value) => {
    const v = watchSliderValue(value, WATCH_GROUP_SLIDERS[key]);
    if (v === undefined) return document;
    return editWatchTileGroup(document, pageId, groupId, (group) => withGroupKey(group, key, v));
  };
}

/** Overlay speed, 0.25 to 3 in quarters. */
export const setWatchGroupOverlaySpeed = requiredSlider("overlaySpeed");
/** Overlay intensity, 0.5 to 2 in quarters. */
export const setWatchGroupOverlayIntensity = requiredSlider("overlayIntensity");
/** Overlay size, 0.5 to 2 in quarters. */
export const setWatchGroupOverlaySize = requiredSlider("overlaySize");
