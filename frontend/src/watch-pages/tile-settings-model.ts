// The basic settings of one tile, without any drawing: the phone's Icon,
// Text and Action tasks, the Header task of a header tile, and the target of
// a page link.
//
// Every setter takes the raw document, a page id and a tile id, and returns a
// new document in which only the objects on the path are new (the document,
// `pages`, the page, its `items`, the tile), as in `edit.ts`. Each one writes
// exactly what the phone's editor writes: the same value, and the key removed
// where the phone removes it. Every other key of the tile, known or not,
// keeps its value and its place; a key the tile did not have goes at the end.
// A removed key is deleted, never set to null.
//
// A setter refuses by returning the document it was given: a page that is
// missing, a system page or a smart page, a tile that is not there, a value
// the phone could not write for this kind of tile, or a stored hold and slide
// array that does not parse. An edit that changes nothing returns the given
// document too, so a caller can tell by reference.
//
// What each kind of tile offers, every action, label and default, comes from
// `tile-actions.json`, written from the app's Swift code. Nothing of it is
// written here by hand.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3c build contract".

import tileActions from "./tile-actions.json";
import { findWatchPage, sameWatchId } from "./edit.js";
import {
  type WatchPageTile,
  type WatchPagesDocument,
  dividerParts,
  isJsonObject,
  isSmartWatchPage,
  tileEntityId,
  tileKind,
  tileTarget,
} from "./model.js";

// ── the table ────────────────────────────────────────────────────────────

/** A hold and slide direction. */
export type WatchSlideDirection = "up" | "down" | "left" | "right";

/** What one kind of tile offers on the Action task, as `tile-actions.json`
 * has it. */
export interface WatchTileKindEntry {
  /** The Action task shows the Single Tap menu. */
  tapPicker: boolean;
  /** The Action task shows the four Hold + Slide menus. */
  holdSlidePicker: boolean;
  /** Single tap actions offered, in menu order. */
  tapActions: string[];
  /** What a stored value that is not offered resolves to. */
  defaultTap: string;
  /** What an absent `singleTapAction` resolves to. */
  absentTap: string;
  /** Hold and slide actions offered, in menu order. */
  holdSlideActions: string[];
  /** Direction to its default; a direction not listed does nothing. */
  holdSlideDefaults: Partial<Record<WatchSlideDirection, string>>;
  defaultRequiresConfirmation: boolean;
  /** The Dim When Off row shows. */
  dimWhenOff: boolean;
  /** The Skip Conditions row shows. */
  skipConditions: boolean;
  /** Action raw value to the words the phone shows for this kind. */
  labels: Record<string, string>;
}

interface Choice {
  label: string;
  value: string;
  stored?: string | null;
}

interface ActionsTable {
  actions: { raw: string; label: string }[];
  unknownActionLabel: string;
  libraryActions: string[];
  directions: WatchSlideDirection[];
  kinds: Record<string, WatchTileKindEntry>;
  triggerEntity: {
    targetDomains: string[];
    modes: Record<string, string[]>;
    modeLabels: Record<string, string>;
  };
  labelFontWeights: Choice[];
  labelFontDesigns: Choice[];
  iconTapAnimations: { value: string; label: string }[];
  newIconTapAnimation: string;
}

const TABLE = tileActions as unknown as ActionsTable;

const ACTION_LABELS: ReadonlyMap<string, string> = new Map(TABLE.actions.map((a) => [a.raw, a.label]));
const LIBRARY_ACTIONS: ReadonlySet<string> = new Set(TABLE.libraryActions);

/** One entry of a menu: the stored value and the words shown for it. */
export interface WatchChoice {
  value: string;
  label: string;
}

/** The hold and slide directions, in the order the phone lists and writes
 * them: up, down, left, right. */
export const WATCH_SLIDE_DIRECTIONS: readonly WatchSlideDirection[] = TABLE.directions;

/** The words the phone shows for a stored action it does not know. */
export const WATCH_UNKNOWN_ACTION_LABEL: string = TABLE.unknownActionLabel;

/** The Font Weight menu. Regular is stored as no key. */
export const WATCH_LABEL_FONT_WEIGHTS: readonly WatchChoice[] = TABLE.labelFontWeights.map((c) => ({
  value: c.value,
  label: c.label,
}));

/** The Font Design menu. Default is stored as no key. */
export const WATCH_LABEL_FONT_DESIGNS: readonly WatchChoice[] = TABLE.labelFontDesigns.map((c) => ({
  value: c.value,
  label: c.label,
}));

/** The Icon Animation When Tapped menu, offered to every tile. */
export const WATCH_ICON_TAP_ANIMATIONS: readonly WatchChoice[] = TABLE.iconTapAnimations.map((c) => ({ ...c }));

/** The domains a hold and slide Trigger Entity may target, sorted. */
export const WATCH_TRIGGER_TARGET_DOMAINS: readonly string[] = TABLE.triggerEntity.targetDomains;

/** Font Size slider: whole points from `min` to `max`; absent is Auto, which
 * the phone shows as `auto`. */
export const WATCH_FONT_SIZE_RANGE = { min: 4, max: 16, auto: 10 } as const;

/** A header's Text Size slider: whole points from `min` to `max`; absent
 * draws at `auto`. */
export const WATCH_HEADER_TEXT_SIZE_RANGE = { min: 8, max: 20, auto: 10 } as const;

/** The smallest icon size. The largest depends on the tile
 * (`watchTileMaxIconSize`). The slider sits at `auto` while the key is
 * absent. */
export const WATCH_ICON_SIZE_RANGE = { min: 8, auto: 20 } as const;

/** Every tile key a setter here writes or removes. */
export const WATCH_TILE_SETTING_KEYS: readonly string[] = [
  "icon",
  "color",
  "iconSizeOverride",
  "iconShadow",
  "dimWhenOff",
  "iconTapAnimation",
  "customLabel",
  "showLabel",
  "labelFontSizeOverride",
  "labelFontWeight",
  "labelFontDesign",
  "labelShadow",
  "labelColorHex",
  "singleTapAction",
  "holdSlideActions",
  "holdSlideTriggerTargets",
  "holdSlideHTTPActionTargets",
  "holdSlideHTTPActionShowBanner",
  "holdSlideHTTPActionBannerSeconds",
  "requiresConfirmation",
  "hideWhenInactive",
  "automationSkipConditionOverride",
  "entityId",
];

/** The name of the table entry for an entity id: its text before the first
 * dot when the table has that kind, else `*`. */
export function watchTileKindName(entityId: string): string {
  const kind = tileKind(entityId);
  return Object.hasOwn(TABLE.kinds, kind) ? kind : "*";
}

/** What a tile's kind offers (`watchTileKindName` of its entity id). */
export function watchTileKindEntry(tile: WatchPageTile): WatchTileKindEntry {
  return TABLE.kinds[watchTileKindName(tileEntityId(tile))]!;
}

/** The words for an action on this kind: the kind's own words, else the
 * action's, else the words for an unknown action. */
export function watchTapActionLabel(entry: WatchTileKindEntry, action: string): string {
  return entry.labels[action] ?? ACTION_LABELS.get(action) ?? TABLE.unknownActionLabel;
}

/** Whether an action needs a library entry when it is a hold and slide
 * value (`libraryActionsMeaning`): Run HTTP Action. As the single tap of its
 * own tile kind it needs nothing: the target is the tile's `entityId`. */
export function isWatchLibraryAction(action: string): boolean {
  return LIBRARY_ACTIONS.has(action);
}

function isDirection(value: unknown): value is WatchSlideDirection {
  return typeof value === "string" && (WATCH_SLIDE_DIRECTIONS as readonly string[]).includes(value);
}

// ── plumbing ─────────────────────────────────────────────────────────────

export type TileChange = (tile: WatchPageTile, pageId: unknown) => WatchPageTile;

/** The document with one tile changed, the first in `items` with that id.
 * The document itself when the page or tile is not editable or the change
 * returns the tile it was given. */
export function editTile(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  change: TileChange,
): WatchPagesDocument {
  const page = findWatchPage(document, pageId);
  const pages = document.pages;
  if (page === undefined || isSmartWatchPage(page) || !Array.isArray(page.items) || !Array.isArray(pages)) {
    return document;
  }
  const index = page.items.findIndex((t) => isJsonObject(t) && sameWatchId(t.id, tileId));
  if (index < 0) return document;
  const tile = page.items[index] as WatchPageTile;
  const next = change(tile, page.id);
  if (next === tile) return document;
  const items = page.items.slice();
  items[index] = next;
  const nextPages = pages.slice();
  nextPages[pages.indexOf(page)] = { ...page, items };
  return { ...document, pages: nextPages };
}

export function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Whether an object's keys are in the order the phone encodes them
 * (`JSONEncoder` with `.sortedKeys`: by code unit, which is what `<` on two
 * strings compares). */
export function keysSorted(object: Record<string, unknown>): boolean {
  const keys = Object.keys(object);
  for (let i = 1; i < keys.length; i += 1) if (!(keys[i - 1]! < keys[i]!)) return false;
  return true;
}

/**
 * The object with `key` set: in its place when the object has it. A new key
 * goes where the phone's sorted encoding puts it when the object's keys are
 * in that order already, so an object the panel edits is, to the byte, the
 * one the phone would write; on an object in some other order it goes at
 * the end.
 */
export function withField<T extends Record<string, unknown>>(object: T, key: string, value: unknown): T {
  if (Object.hasOwn(object, key) || !keysSorted(object)) return { ...object, [key]: value };
  const out: Record<string, unknown> = {};
  let placed = false;
  for (const k of Object.keys(object)) {
    if (!placed && key < k) {
      out[key] = value;
      placed = true;
    }
    out[k] = object[k];
  }
  if (!placed) out[key] = value;
  return out as T;
}

/** The tile with `key` set (`withField`). The tile itself when the key
 * already holds that value. */
export function withKey(tile: WatchPageTile, key: string, value: unknown): WatchPageTile {
  if (Object.hasOwn(tile, key) && sameValue(tile[key], value)) return tile;
  return withField(tile, key, value);
}

/** The tile without `key`, or the tile itself when it has none. */
export function withoutKey(tile: WatchPageTile, key: string): WatchPageTile {
  if (!Object.hasOwn(tile, key)) return tile;
  const next = { ...tile };
  delete next[key];
  return next;
}

/** `withKey`, or `withoutKey` for undefined. */
export function withOptional(tile: WatchPageTile, key: string, value: unknown): WatchPageTile {
  return value === undefined ? withoutKey(tile, key) : withKey(tile, key, value);
}

/** What `accept` returns in `setKey` to remove the key. */
export const REMOVE = Symbol("remove");

/** A setter for one key whose value `accept` checks: undefined from `accept`
 * refuses, `REMOVE` removes the key. */
export function setKey(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  key: string,
  accept: (tile: WatchPageTile) => unknown,
): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const value = accept(tile);
    if (value === undefined) return tile;
    return value === REMOVE ? withoutKey(tile, key) : withKey(tile, key, value);
  });
}

export function isBool(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/** A finite number rounded as Swift's `round` does for these ranges, or
 * undefined when it is out of `min...max`. */
function wholeIn(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  return n < min || n > max ? undefined : n;
}

// ── colors ───────────────────────────────────────────────────────────────

const HEX6 = /^#?([0-9a-fA-F]{6})$/;
const GRADIENT_PREFIX = "GRADIENT|";
const RAINBOW = "#RAINBOW";

/** Which forms a color field accepts. */
export type WatchColorForms = "tile" | "label" | "solid";

function solidHex(value: string): string | undefined {
  const m = HEX6.exec(value.trim());
  return m ? `#${m[1]!.toUpperCase()}` : undefined;
}

/**
 * A color as the phone stores it, or undefined when it is not one the given
 * field may hold. `#RRGGBB` in upper case (a missing `#` is added), and for
 * `tile` and `label` also `GRADIENT|#RRGGBB|#RRGGBB`; `tile` also takes
 * `#RAINBOW`. `solid` is the header color: its picker has neither. Alpha and
 * color names are never written.
 */
export function normalizeWatchColor(value: unknown, forms: WatchColorForms): string | undefined {
  if (typeof value !== "string") return undefined;
  if (value.trim().toUpperCase() === RAINBOW) return forms === "tile" ? RAINBOW : undefined;
  if (value.startsWith(GRADIENT_PREFIX)) {
    if (forms === "solid") return undefined;
    const parts = value.split("|");
    if (parts.length !== 3) return undefined;
    const a = solidHex(parts[1]!);
    const b = solidHex(parts[2]!);
    return a !== undefined && b !== undefined ? `${GRADIENT_PREFIX}${a}|${b}` : undefined;
  }
  return solidHex(value);
}

/** The mode of a stored color: a gradient token, `#RAINBOW`, a plain
 * `#RRGGBB`, or undefined for no color or one the palette cannot show. */
export function watchColorMode(color: unknown): "solid" | "gradient" | "rainbow" | undefined {
  if (typeof color !== "string") return undefined;
  if (color.trim().toUpperCase() === RAINBOW) return "rainbow";
  if (color.startsWith(GRADIENT_PREFIX)) return normalizeWatchColor(color, "label") === undefined ? undefined : "gradient";
  return solidHex(color) === undefined ? undefined : "solid";
}

/**
 * A color converted for the Solid and Gradient switch. Solid to gradient
 * goes through `gradientOf` (the phone's gradient version of a solid color);
 * gradient to solid takes the gradient's first color. A color already in
 * that mode, `#RAINBOW`, no color, or a value that is neither form comes
 * back unchanged.
 */
export function watchColorInMode(
  color: string | undefined,
  mode: "solid" | "gradient",
  gradientOf: (hex: string) => string,
): string | undefined {
  const current = watchColorMode(color);
  if (color === undefined || current === undefined || current === "rainbow" || current === mode) return color;
  if (mode === "solid") return solidHex(color.split("|")[1]!);
  return gradientOf(solidHex(color)!);
}

/** Pick a color (a swatch or the color picker): `#RRGGBB`,
 * `GRADIENT|#RRGGBB|#RRGGBB` or `#RAINBOW`, written in upper case. */
export function setWatchTileColor(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  color: string,
): WatchPagesDocument {
  const value = normalizeWatchColor(color, "tile");
  return value === undefined ? document : setKey(document, pageId, tileId, "color", () => value);
}

/** The Rainbow button: `#RAINBOW`. */
export function setWatchTileRainbow(document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  return setWatchTileColor(document, pageId, tileId, RAINBOW);
}

/** The Solid and Gradient switch: the stored color rewritten in the other
 * form (`watchColorInMode`). Nothing when there is no color or it is
 * `#RAINBOW`. */
export function setWatchTileColorMode(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  mode: "solid" | "gradient",
  gradientOf: (hex: string) => string,
): WatchPagesDocument {
  if (mode !== "solid" && mode !== "gradient") return document;
  return setKey(document, pageId, tileId, "color", (tile) => {
    if (typeof tile.color !== "string") return undefined;
    const next = watchColorInMode(tile.color, mode, gradientOf);
    if (next === tile.color) return undefined;
    return normalizeWatchColor(next, "tile");
  });
}

// ── icon ─────────────────────────────────────────────────────────────────

/**
 * The name the phone stores for a picked symbol: every `.fill` taken out
 * when the symbol without them exists, else the name as given (a fill only
 * symbol stays as it is). The watch then fills it from the entity's state.
 * `IconFavoritesStore.storageIconName` in the app.
 */
export function watchStorageIconName(name: string, symbolExists: (symbol: string) => boolean): string {
  const base = name.split(".fill").join("");
  if (base === name) return name;
  return symbolExists(base) ? base : name;
}

/** Pick an icon: the name as given, `""` for the None chip (no icon). Pass
 * a picked symbol through `watchStorageIconName` first. */
export function setWatchTileIcon(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  icon: string,
): WatchPagesDocument {
  return typeof icon !== "string" ? document : setKey(document, pageId, tileId, "icon", () => icon);
}

/**
 * Back to the default icon: the kind's default icon and color written out,
 * as the phone's Reset Icon does (it never leaves the key absent for a kind
 * that has a default). `null` removes the key, which is what the phone
 * writes for a kind with no default (a header, an unknown domain). The
 * caller looks the defaults up for the tile's entity and page theme.
 */
export function setWatchTileIconDefault(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  defaults: { icon: string | null; color: string | null },
): WatchPagesDocument {
  const icon = defaults.icon;
  if (icon !== null && typeof icon !== "string") return document;
  const color = defaults.color === null ? null : normalizeWatchColor(defaults.color, "tile");
  if (color === undefined) return document;
  return editTile(document, pageId, tileId, (tile) => {
    const withIcon = withOptional(tile, "icon", icon ?? undefined);
    return withOptional(withIcon, "color", color ?? undefined);
  });
}

/**
 * The largest icon size that still changes what the watch draws for this
 * tile's size and label: `GridItemConfig.maxIconSizeOverride`. Never under
 * 8. An absent `colSpan` or `rowSpan` reads as the phone decodes it, 6 by 4;
 * an absent `showLabel` as shown.
 */
export function watchTileMaxIconSize(tile: WatchPageTile): number {
  const span = (value: unknown, fallback: number): number =>
    typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.trunc(value)) : fallback;
  const colSpan = span(tile.colSpan, 6);
  const rowSpan = span(tile.rowSpan, 4);
  const unit = 21;
  const spacing = 2;
  const width = colSpan * unit + (colSpan - 1) * spacing;
  const height = rowSpan * unit + (rowSpan - 1) * spacing;
  const roomForLabel = height >= 35 && tile.showLabel !== false;
  const availableHeight = roomForLabel ? height * 0.54 : height * 0.68;
  const availableWidth = roomForLabel ? width * 0.64 : width * 0.7;
  return Math.max(WATCH_ICON_SIZE_RANGE.min, Math.min(availableWidth, availableHeight));
}

/** The highest number the icon size field takes for a tile whose largest
 * size is `max`: the next whole number up, which stands for `max` itself
 * (`watchTileIconSizeValue`). `max` when it is whole. */
export function watchTileIconSizeTop(max: number): number {
  return Math.max(WATCH_ICON_SIZE_RANGE.min, Math.ceil(max));
}

/**
 * The icon size stored for a typed or dragged `size` on a tile whose largest
 * is `max`, or undefined when it is out of range. A whole number (rounded)
 * from 8 to `max`; a number that rounds above `max` but not past the next
 * whole number stores `max` itself. The phone's slider runs from 8 to `max`
 * in steps of 1 and clamps the step past its end to the end, so at the top
 * it stores 23.76, not 24 (`GlowSlider`, `IconTabContent.iconSizeSlider`).
 */
export function watchTileIconSizeValue(size: number, max: number): number | undefined {
  if (typeof size !== "number" || !Number.isFinite(size) || !Number.isFinite(max)) return undefined;
  const n = Math.round(size);
  if (n < WATCH_ICON_SIZE_RANGE.min) return undefined;
  if (n <= max) return n;
  return n <= watchTileIconSizeTop(max) ? Math.max(WATCH_ICON_SIZE_RANGE.min, max) : undefined;
}

/** Icon Size: `watchTileIconSizeValue` for the tile's
 * `watchTileMaxIconSize`, or `null` for Auto, which removes the key. The
 * stored value is not clamped later when the tile is resized; the watch
 * clamps it. */
export function setWatchTileIconSize(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  size: number | null,
): WatchPagesDocument {
  return setKey(document, pageId, tileId, "iconSizeOverride", (tile) =>
    size === null ? REMOVE : watchTileIconSizeValue(size, watchTileMaxIconSize(tile)),
  );
}

/** Icon Shadow: `true` or `false`. */
export function setWatchTileIconShadow(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  return isBool(on) ? setKey(document, pageId, tileId, "iconShadow", () => on) : document;
}

/** Dim When Off: on removes the key (dimmed is the default), off writes
 * `false`. Only for a kind that shows the row. */
export function setWatchTileDimWhenOff(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, "dimWhenOff", (tile) =>
    watchTileKindEntry(tile).dimWhenOff ? (on ? REMOVE : false) : undefined,
  );
}

/** Icon Animation When Tapped: one of `WATCH_ICON_TAP_ANIMATIONS`. */
export function setWatchTileTapAnimation(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  animation: string,
): WatchPagesDocument {
  if (!WATCH_ICON_TAP_ANIMATIONS.some((c) => c.value === animation)) return document;
  return setKey(document, pageId, tileId, "iconTapAnimation", () => animation);
}

/** What the Icon task shows for a tile. */
export interface WatchTileIconSettings {
  /** Absent means the kind's default; `""` means no icon. */
  icon: string | undefined;
  color: string | undefined;
  colorMode: "solid" | "gradient" | "rainbow" | undefined;
  /** Absent means Auto. */
  iconSize: number | undefined;
  iconSizeMax: number;
  iconShadow: boolean;
  /** `applies`: the row shows for this kind. */
  dimWhenOff: { applies: boolean; value: boolean };
  /** What the watch plays: a stored value it does not know reads as
   * `bounce`, as the watch decodes it. */
  tapAnimation: string;
  /** The stored string, kept as it is until a person picks one. */
  tapAnimationStored: string | undefined;
}

/** What the watch decodes an `iconTapAnimation` it does not know as
 * (`IconTapAnimation.init(from:)`). */
const UNKNOWN_TAP_ANIMATION = "bounce";

/** The Icon task's values for a tile, absent keys read as the watch reads them. */
export function watchTileIconSettings(tile: WatchPageTile): WatchTileIconSettings {
  return {
    icon: typeof tile.icon === "string" ? tile.icon : undefined,
    color: typeof tile.color === "string" ? tile.color : undefined,
    colorMode: watchColorMode(tile.color),
    iconSize: typeof tile.iconSizeOverride === "number" ? tile.iconSizeOverride : undefined,
    iconSizeMax: watchTileMaxIconSize(tile),
    iconShadow: tile.iconShadow === true,
    dimWhenOff: { applies: watchTileKindEntry(tile).dimWhenOff, value: tile.dimWhenOff !== false },
    tapAnimation:
      typeof tile.iconTapAnimation !== "string"
        ? TABLE.newIconTapAnimation
        : WATCH_ICON_TAP_ANIMATIONS.some((c) => c.value === tile.iconTapAnimation)
          ? tile.iconTapAnimation
          : UNKNOWN_TAP_ANIMATION,
    tapAnimationStored: typeof tile.iconTapAnimation === "string" ? tile.iconTapAnimation : undefined,
  };
}

// ── text ─────────────────────────────────────────────────────────────────

export interface WatchLabelOptions {
  /** An empty label removes `customLabel`, so the tile shows the name Home
   * Assistant has. The panel's label field does this; the phone's Text task
   * writes `""`, which draws a blank label. */
  emptyRemoves?: boolean;
}

/** The label: `customLabel` is the text as given, `""` included, as the
 * phone writes it. With `emptyRemoves`, `""` removes the key instead. */
export function setWatchTileLabel(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  text: string,
  options?: WatchLabelOptions,
): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return setKey(document, pageId, tileId, "customLabel", () =>
    text === "" && options?.emptyRemoves === true ? REMOVE : text,
  );
}

/** Show Label: `true` or `false`. */
export function setWatchTileShowLabel(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  return isBool(on) ? setKey(document, pageId, tileId, "showLabel", () => on) : document;
}

/** Font Size: rounded to a whole number from 4 to 16, or `null` for Auto,
 * which removes the key. */
export function setWatchTileFontSize(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  size: number | null,
): WatchPagesDocument {
  const value = size === null ? REMOVE : wholeIn(size, WATCH_FONT_SIZE_RANGE.min, WATCH_FONT_SIZE_RANGE.max);
  return value === undefined ? document : setKey(document, pageId, tileId, "labelFontSizeOverride", () => value);
}

function choiceSetter(choices: Choice[], key: string) {
  return (document: WatchPagesDocument, pageId: string, tileId: string, value: string): WatchPagesDocument => {
    const choice = choices.find((c) => c.value === value);
    if (choice === undefined) return document;
    const stored = choice.stored ?? null;
    return setKey(document, pageId, tileId, key, () => (stored === null ? REMOVE : stored));
  };
}

/** Font Weight: a `WATCH_LABEL_FONT_WEIGHTS` value; `regular` removes the
 * key. (A new tile carries `light`.) */
export const setWatchTileFontWeight = choiceSetter(TABLE.labelFontWeights, "labelFontWeight");

/** Font Design: a `WATCH_LABEL_FONT_DESIGNS` value; `default` removes the
 * key. */
export const setWatchTileFontDesign = choiceSetter(TABLE.labelFontDesigns, "labelFontDesign");

/** Text Shadow: `true` or `false`. */
export function setWatchTileTextShadow(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  return isBool(on) ? setKey(document, pageId, tileId, "labelShadow", () => on) : document;
}

/** Label Color: `#RRGGBB` or `GRADIENT|#RRGGBB|#RRGGBB` (the watch draws a
 * gradient's first color), never `#RAINBOW`; `null` resets to the theme's,
 * which removes the key. */
export function setWatchTileLabelColor(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  color: string | null,
): WatchPagesDocument {
  const value = color === null ? REMOVE : normalizeWatchColor(color, "label");
  return value === undefined ? document : setKey(document, pageId, tileId, "labelColorHex", () => value);
}

/** What the Text task shows for a tile. */
export interface WatchTileTextSettings {
  /** Absent means the name the tile gets elsewhere. */
  label: string | undefined;
  showLabel: boolean;
  /** Absent means Auto. */
  fontSize: number | undefined;
  /** A `WATCH_LABEL_FONT_WEIGHTS` value, `regular` when absent, or a stored
   * value the menu does not have. */
  fontWeight: string;
  /** A `WATCH_LABEL_FONT_DESIGNS` value, `default` when absent, or a stored
   * value the menu does not have. */
  fontDesign: string;
  textShadow: boolean;
  /** Absent means the theme's. */
  labelColor: string | undefined;
}

function absentChoice(choices: Choice[]): string {
  return choices.find((c) => c.stored === null)?.value ?? "";
}

/** The Text task's values for a tile, absent keys read as the watch reads them. */
export function watchTileTextSettings(tile: WatchPageTile): WatchTileTextSettings {
  return {
    label: typeof tile.customLabel === "string" ? tile.customLabel : undefined,
    showLabel: tile.showLabel !== false,
    fontSize: typeof tile.labelFontSizeOverride === "number" ? tile.labelFontSizeOverride : undefined,
    fontWeight: typeof tile.labelFontWeight === "string" ? tile.labelFontWeight : absentChoice(TABLE.labelFontWeights),
    fontDesign: typeof tile.labelFontDesign === "string" ? tile.labelFontDesign : absentChoice(TABLE.labelFontDesigns),
    textShadow: tile.labelShadow !== false,
    labelColor: typeof tile.labelColorHex === "string" ? tile.labelColorHex : undefined,
  };
}

// ── single tap ───────────────────────────────────────────────────────────

/** What the Single Tap menu shows for a tile. */
export interface WatchSingleTapSettings {
  /** The menu shows for this kind. */
  picker: boolean;
  /** The stored `singleTapAction`, absent meaning the default. */
  stored: string | undefined;
  /** What the watch does while the key is absent. */
  absent: string;
  /** What the watch does now: the stored action when this kind offers it,
   * else the kind's default. */
  resolved: string;
  resolvedLabel: string;
  /** The menu, in order, with this kind's words. A library action only on
   * its own kind (Run HTTP Action on an HTTP action tile), where the target
   * is the tile itself. */
  offered: WatchChoice[];
  /** A stored value the menu does not have (a library action or an unknown
   * string): shown, not offered. */
  storedNotOffered: boolean;
  storedLabel: string | undefined;
}

/** The single tap menu: the kind's whole list. Only the HTTP action kind
 * lists a library action there, its own, which needs no pick: the tile's
 * `entityId` is the target. */
function offeredTap(entry: WatchTileKindEntry): string[] {
  return entry.tapActions.slice();
}

/** The Single Tap menu for a tile: offered, stored, and what the watch does. */
export function watchSingleTapSettings(tile: WatchPageTile): WatchSingleTapSettings {
  const entry = watchTileKindEntry(tile);
  const stored = typeof tile.singleTapAction === "string" ? tile.singleTapAction : undefined;
  const offered = offeredTap(entry);
  const candidate = stored ?? entry.absentTap;
  const resolved = entry.tapActions.includes(candidate) ? candidate : entry.defaultTap;
  return {
    picker: entry.tapPicker,
    stored,
    absent: entry.absentTap,
    resolved,
    resolvedLabel: watchTapActionLabel(entry, resolved),
    offered: offered.map((a) => ({ value: a, label: watchTapActionLabel(entry, a) })),
    storedNotOffered: stored !== undefined && !offered.includes(stored),
    storedLabel: stored === undefined ? undefined : watchTapActionLabel(entry, stored),
  };
}

/** Single Tap: an action the kind's menu offers, stored even when it equals
 * the default; `null` (Reset to Default) removes the key. Refused for a kind
 * with no menu, and for a library action on a kind that is not its own. */
export function setWatchTileSingleTap(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  action: string | null,
): WatchPagesDocument {
  return setKey(document, pageId, tileId, "singleTapAction", (tile) => {
    const entry = watchTileKindEntry(tile);
    if (!entry.tapPicker) return undefined;
    if (action === null) return REMOVE;
    return offeredTap(entry).includes(action) ? action : undefined;
  });
}

// ── hold and slide ───────────────────────────────────────────────────────

const HOLD_SLIDE_ACTIONS = "holdSlideActions";
const HOLD_SLIDE_TRIGGERS = "holdSlideTriggerTargets";
const HOLD_SLIDE_HTTP = "holdSlideHTTPActionTargets";
const HOLD_SLIDE_HTTP_BANNER = "holdSlideHTTPActionShowBanner";
const HOLD_SLIDE_HTTP_SECONDS = "holdSlideHTTPActionBannerSeconds";

/** The banner seconds a direction may store (`HTTPBannerDuration`): 3, the
 * standard, is stored as no entry. */
export const WATCH_HTTP_BANNER_SECONDS: readonly number[] = [1, 2, 5];
/** What no seconds entry means. */
export const WATCH_HTTP_BANNER_DEFAULT_SECONDS = 3;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Whether a value reads as a `UUID` on the phone. A hold and slide HTTP
 * target is typed `UUID` there: anything else makes the whole document
 * unreadable. */
export function isWatchUUID(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** What the hold and slide card may offer beyond the tile itself. */
export interface WatchHoldSlideOptions {
  /** The catalog lists at least one HTTP action: Run HTTP Action is
   * offered on every direction. Without it, a stored one is shown only. */
  httpActions?: boolean;
}

/**
 * A stored hold and slide array read into a map: `[direction, value, ...]`
 * in any order. Absent (or null) is an empty map. A direction given twice
 * keeps its last value, as Swift's dictionary decoding does; writing the map
 * back leaves one of each. Undefined when it does not parse: not an array,
 * an odd length, or a direction that is not one of the four.
 */
export function readWatchSlideMap(value: unknown): Map<WatchSlideDirection, unknown> | undefined {
  const map = new Map<WatchSlideDirection, unknown>();
  if (value === undefined || value === null) return map;
  if (!Array.isArray(value) || value.length % 2 !== 0) return undefined;
  for (let i = 0; i < value.length; i += 2) {
    const direction = value[i];
    if (!isDirection(direction)) return undefined;
    map.set(direction, value[i + 1]);
  }
  return map;
}

/** Whether all three hold and slide arrays parse: a setter touches the
 * card only then, whichever array it is about to write. */
function slideMapsParse(tile: WatchPageTile): boolean {
  return [HOLD_SLIDE_ACTIONS, HOLD_SLIDE_TRIGGERS, HOLD_SLIDE_HTTP].every((key) => readWatchSlideMap(tile[key]) !== undefined);
}

/** A map written back as the phone writes it: pairs in the order up, down,
 * left, right. */
export function writeWatchSlideMap(map: ReadonlyMap<WatchSlideDirection, unknown>): unknown[] {
  const out: unknown[] = [];
  for (const direction of WATCH_SLIDE_DIRECTIONS) {
    if (map.has(direction)) out.push(direction, map.get(direction));
  }
  return out;
}

/** The tile with a slide map key written, or removed when the map is
 * empty. */
function withSlideMap(tile: WatchPageTile, key: string, map: ReadonlyMap<WatchSlideDirection, unknown>): WatchPageTile {
  return map.size === 0 ? withoutKey(tile, key) : withKey(tile, key, writeWatchSlideMap(map));
}

/** The tile with `direction` taken out of a slide map key, the tile itself
 * when the map has no such direction, undefined when the map does not
 * parse. */
function withoutDirection(tile: WatchPageTile, key: string, direction: WatchSlideDirection): WatchPageTile | undefined {
  const map = readWatchSlideMap(tile[key]);
  if (map === undefined) return undefined;
  if (!map.has(direction)) return tile;
  map.delete(direction);
  return withSlideMap(tile, key, map);
}

/** The hold and slide menu for one direction: the kind's list without the
 * library actions, unless one is stored for that direction, or it is Run
 * HTTP Action and the catalog has an HTTP action to run. */
function offeredHoldSlide(entry: WatchTileKindEntry, stored: unknown, httpActions = false): string[] {
  return entry.holdSlideActions.filter((a) => !LIBRARY_ACTIONS.has(a) || a === stored || (a === "httpAction" && httpActions));
}

/** A trigger target as stored: `entityId`, `mode`, `friendlyName`. */
export interface WatchTriggerTarget {
  entityId: string;
  mode: string;
  friendlyName: string | undefined;
  /** The target's domain offers the stored mode. The phone keeps a mode the
   * new domain does not offer when only the entity changes. */
  modeOffered: boolean;
}

function triggerTargetOf(value: unknown): WatchTriggerTarget | undefined {
  if (!isJsonObject(value) || typeof value.entityId !== "string" || typeof value.mode !== "string") return undefined;
  return {
    entityId: value.entityId,
    mode: value.mode,
    friendlyName: typeof value.friendlyName === "string" ? value.friendlyName : undefined,
    modeOffered: watchTriggerModeValues(tileKind(value.entityId)).includes(value.mode),
  };
}

/** What one direction's menu shows. */
export interface WatchHoldSlideDirectionSettings {
  direction: WatchSlideDirection;
  /** The stored action, absent meaning the default. */
  stored: string | undefined;
  /** The kind's default for this direction, undefined for none. */
  default: string | undefined;
  /** What the watch does now (`resolvedHoldSlideAction`). */
  resolved: string;
  /** Its words: the unknown action's words for a stored unknown string, and
   * for Trigger Entity or Run HTTP Action without a target. */
  resolvedLabel: string;
  offered: WatchChoice[];
  storedNotOffered: boolean;
  storedLabel: string | undefined;
  /** The Trigger Entity target, when one is stored for this direction. */
  target: WatchTriggerTarget | undefined;
  /** The library id of the HTTP action, when one is stored. */
  httpTarget: unknown;
  /** The banner after the HTTP action runs: on unless `false` is stored. */
  httpBanner: boolean;
  /** The stored banner seconds, undefined for the standard 3. */
  httpBannerSeconds: unknown;
}

/** What the Hold + Slide card shows for a tile. */
export interface WatchHoldSlideSettings {
  /** The card shows for this kind. */
  picker: boolean;
  /** Every stored array parses. When not, the setters refuse. */
  parses: boolean;
  /** Any direction is stored: the card offers Reset to Defaults. */
  anyStored: boolean;
  /** The four directions, up, down, left, right. */
  directions: WatchHoldSlideDirectionSettings[];
}

/** The Hold + Slide card for a tile, each direction with its menu, default,
 * stored value and targets. `options.httpActions` offers Run HTTP Action. */
export function watchHoldSlideSettings(tile: WatchPageTile, options: WatchHoldSlideOptions = {}): WatchHoldSlideSettings {
  const entry = watchTileKindEntry(tile);
  const actions = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS]);
  const triggers = readWatchSlideMap(tile[HOLD_SLIDE_TRIGGERS]);
  const http = readWatchSlideMap(tile[HOLD_SLIDE_HTTP]);
  const banners = readWatchSlideMap(tile[HOLD_SLIDE_HTTP_BANNER]);
  const seconds = readWatchSlideMap(tile[HOLD_SLIDE_HTTP_SECONDS]);
  const known = new Set(TABLE.actions.map((a) => a.raw));
  const directions = WATCH_SLIDE_DIRECTIONS.map((direction): WatchHoldSlideDirectionSettings => {
    const raw = actions?.get(direction);
    const stored = typeof raw === "string" ? raw : undefined;
    const fallback = entry.holdSlideDefaults[direction];
    const target = triggerTargetOf(triggers?.get(direction));
    const httpTarget = http?.get(direction);
    const candidate = stored ?? fallback ?? "none";
    let resolved: string;
    let unknown = false;
    if (!known.has(candidate)) {
      resolved = candidate;
      unknown = true;
    } else if (candidate === "triggerEntity" && !triggers?.has(direction)) {
      resolved = candidate;
      unknown = true;
    } else if (candidate === "httpAction" && !http?.has(direction)) {
      resolved = candidate;
      unknown = true;
    } else if (entry.holdSlideActions.includes(candidate)) {
      resolved = candidate;
    } else {
      const other = fallback ?? "none";
      resolved = entry.holdSlideActions.includes(other) ? other : "none";
    }
    const offered = offeredHoldSlide(entry, stored, options.httpActions === true);
    return {
      direction,
      stored,
      default: fallback,
      resolved,
      resolvedLabel: unknown ? TABLE.unknownActionLabel : watchTapActionLabel(entry, resolved),
      offered: offered.map((a) => ({ value: a, label: watchTapActionLabel(entry, a) })),
      storedNotOffered: stored !== undefined && !offered.includes(stored),
      storedLabel: stored === undefined ? undefined : watchTapActionLabel(entry, stored),
      target,
      httpTarget,
      httpBanner: banners?.get(direction) !== false,
      httpBannerSeconds: seconds?.get(direction),
    };
  });
  return {
    picker: entry.holdSlidePicker,
    parses: actions !== undefined && triggers !== undefined && http !== undefined && banners !== undefined && seconds !== undefined,
    anyStored: (actions?.size ?? 0) > 0,
    directions,
  };
}

/** Change one direction on a tile, the phone's direction setter. */
function holdSlideChange(tile: WatchPageTile, direction: WatchSlideDirection, action: string | null): WatchPageTile {
  // Trigger entity and Run HTTP Action keep a target in the other two
  // arrays: every one of them has to parse before the direction moves.
  if (!slideMapsParse(tile)) return tile;
  const actions = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS]);
  if (actions === undefined) return tile;
  let next = tile;
  if (action === null ? actions.has(direction) : actions.get(direction) !== action) {
    if (action === null) actions.delete(direction);
    else actions.set(direction, action);
    next = withSlideMap(next, HOLD_SLIDE_ACTIONS, actions);
  }
  if (action !== "triggerEntity") {
    const dropped = withoutDirection(next, HOLD_SLIDE_TRIGGERS, direction);
    if (dropped === undefined) return tile;
    next = dropped;
  }
  if (action !== "httpAction") {
    const dropped = withoutDirection(next, HOLD_SLIDE_HTTP, direction);
    if (dropped === undefined) return tile;
    next = dropped;
  }
  return next;
}

/**
 * One hold and slide direction: an action its menu offers, `"none"` to do
 * nothing over the default, or `null` to remove the direction (the
 * default). Any value but `triggerEntity` drops the direction's trigger
 * target, any but `httpAction` its HTTP target; the banner keys stay, as on
 * the phone. Each array is written in the order up, down, left, right, and
 * removed when it empties. Refused for a kind with no card, a value not
 * offered, or a stored array that does not parse. Run HTTP Action comes with
 * its target or not at all: `setWatchTileHoldSlideHTTP`.
 */
export function setWatchTileHoldSlide(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  action: string | null,
): WatchPagesDocument {
  if (!isDirection(direction)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    const entry = watchTileKindEntry(tile);
    if (!entry.holdSlidePicker) return tile;
    if (action !== null) {
      const stored = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS])?.get(direction);
      if (!offeredHoldSlide(entry, stored).includes(action)) return tile;
    }
    return holdSlideChange(tile, direction, action);
  });
}

/** Reset to Defaults: every direction removed, with its trigger and HTTP
 * targets. The banner keys stay. Refused when a stored array does not
 * parse. */
export function clearWatchTileHoldSlide(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!watchTileKindEntry(tile).holdSlidePicker) return tile;
    const maps = [HOLD_SLIDE_ACTIONS, HOLD_SLIDE_TRIGGERS, HOLD_SLIDE_HTTP];
    if (maps.some((key) => readWatchSlideMap(tile[key]) === undefined)) return tile;
    return maps.reduce(withoutKey, tile);
  });
}

/**
 * Run HTTP Action on one direction, with the action it runs, in one edit:
 * `holdSlideActions[direction] = "httpAction"` and
 * `holdSlideHTTPActionTargets[direction]` the action's id in upper case.
 * The direction's trigger target goes; its banner entries stay. Picking
 * another action moves only the target. Refused for a kind with no card or
 * no Run HTTP Action, an id that is no UUID (the phone types it `UUID`), or
 * a stored array that does not parse. The caller offers only actions the
 * catalog lists.
 */
export function setWatchTileHoldSlideHTTP(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  actionId: string,
): WatchPagesDocument {
  if (!isDirection(direction) || !isWatchUUID(actionId)) return document;
  const id = actionId.toUpperCase();
  return editTile(document, pageId, tileId, (tile) => {
    const entry = watchTileKindEntry(tile);
    if (!entry.holdSlidePicker || !entry.holdSlideActions.includes("httpAction") || !slideMapsParse(tile)) return tile;
    const next = holdSlideChange(tile, direction, "httpAction");
    const http = readWatchSlideMap(next[HOLD_SLIDE_HTTP]);
    if (http === undefined || http.get(direction) === id) return next;
    http.set(direction, id);
    return withSlideMap(next, HOLD_SLIDE_HTTP, http);
  });
}

/** One banner key of a direction set to Run HTTP Action, changed by
 * `change` on its map (false: nothing to do). Refused when the direction is
 * not Run HTTP Action or an array does not parse. */
function editBannerMap(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  key: string,
  change: (map: Map<WatchSlideDirection, unknown>) => boolean,
): WatchPagesDocument {
  if (!isDirection(direction)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!watchTileKindEntry(tile).holdSlidePicker) return tile;
    const actions = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS]);
    const map = readWatchSlideMap(tile[key]);
    if (actions === undefined || map === undefined || actions.get(direction) !== "httpAction") return tile;
    return change(map) ? withSlideMap(tile, key, map) : tile;
  });
}

/** A Run HTTP Action direction's banner: off writes `false`, on removes the
 * entry (the array with it once empty). The seconds stay, as on the
 * phone. */
export function setWatchTileHoldSlideHTTPBanner(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  on: boolean,
): WatchPagesDocument {
  if (!isBool(on)) return document;
  return editBannerMap(document, pageId, tileId, direction, HOLD_SLIDE_HTTP_BANNER, (map) => {
    if (on) return map.delete(direction);
    if (map.get(direction) === false) return false;
    map.set(direction, false);
    return true;
  });
}

/** A Run HTTP Action direction's banner seconds: 1, 2 or 5 written; 3, the
 * standard, or `null` removes the entry. */
export function setWatchTileHoldSlideHTTPBannerSeconds(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  seconds: number | null,
): WatchPagesDocument {
  const remove = seconds === null || seconds === WATCH_HTTP_BANNER_DEFAULT_SECONDS;
  if (!remove && (typeof seconds !== "number" || !WATCH_HTTP_BANNER_SECONDS.includes(seconds))) return document;
  return editBannerMap(document, pageId, tileId, direction, HOLD_SLIDE_HTTP_SECONDS, (map) => {
    if (remove) return map.delete(direction);
    if (map.get(direction) === seconds) return false;
    map.set(direction, seconds);
    return true;
  });
}

/** The trigger modes of a target domain, in order; the first is a new
 * target's mode. */
function watchTriggerModeValues(domain: string): string[] {
  const modes = TABLE.triggerEntity.modes;
  return (Object.hasOwn(modes, domain) ? modes[domain] : modes["*"]) ?? [];
}

/** The trigger modes offered for a target domain, with their words. */
export function watchTriggerModes(domain: string): WatchChoice[] {
  return watchTriggerModeValues(domain).map((m) => ({ value: m, label: TABLE.triggerEntity.modeLabels[m] ?? m }));
}

/** Whether an entity id names something a Trigger Entity may target:
 * `domain.object_id` with a domain in `WATCH_TRIGGER_TARGET_DOMAINS`. */
export function isWatchTriggerTarget(entityId: string): boolean {
  if (typeof entityId !== "string") return false;
  const dot = entityId.indexOf(".");
  return dot > 0 && dot < entityId.length - 1 && WATCH_TRIGGER_TARGET_DOMAINS.includes(entityId.slice(0, dot));
}

/** A direction's trigger target replaced, in the slide map. Refused when the
 * direction is not set to Trigger Entity or a stored array does not
 * parse. */
function withTriggerTarget(
  tile: WatchPageTile,
  direction: WatchSlideDirection,
  make: (old: unknown) => Record<string, unknown> | undefined,
): WatchPageTile {
  if (!slideMapsParse(tile)) return tile;
  const actions = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS]);
  const triggers = readWatchSlideMap(tile[HOLD_SLIDE_TRIGGERS]);
  if (actions === undefined || triggers === undefined || actions.get(direction) !== "triggerEntity") return tile;
  const old = triggers.get(direction);
  const target = make(old);
  if (target === undefined || sameValue(old, target)) return tile;
  triggers.set(direction, target);
  return withSlideMap(tile, HOLD_SLIDE_TRIGGERS, triggers);
}

/**
 * Pick the entity a Trigger Entity direction runs. The mode stays what it
 * was, even when the new domain does not offer it (as on the phone); a new
 * target takes the domain's first mode. `friendlyName` is written when
 * given and removed when not. Other keys of an old target are kept. Refused
 * unless the direction is set to Trigger Entity and the entity's domain is
 * one a trigger may target.
 */
export function setWatchTileHoldSlideTarget(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  entityId: string,
  friendlyName?: string,
): WatchPagesDocument {
  if (!isDirection(direction) || !isWatchTriggerTarget(entityId)) return document;
  if (friendlyName !== undefined && typeof friendlyName !== "string") return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!watchTileKindEntry(tile).holdSlidePicker) return tile;
    return withTriggerTarget(tile, direction, (old) => {
      const kept = isJsonObject(old) ? old : undefined;
      const mode = typeof kept?.mode === "string" ? kept.mode : watchTriggerModeValues(tileKind(entityId))[0];
      if (mode === undefined) return undefined;
      // Keys added in the phone's sorted order (`withField`), as on a tile.
      let next: Record<string, unknown> = withField(kept ? { ...kept } : {}, "entityId", entityId);
      if (friendlyName === undefined) delete next.friendlyName;
      else next = withField(next, "friendlyName", friendlyName);
      return withField(next, "mode", mode);
    });
  });
}

/** The mode of a direction's trigger target: one its domain offers. The
 * entity and friendly name stay. Refused when there is no target. */
export function setWatchTileHoldSlideTargetMode(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  direction: WatchSlideDirection,
  mode: string,
): WatchPagesDocument {
  if (!isDirection(direction)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (!watchTileKindEntry(tile).holdSlidePicker) return tile;
    return withTriggerTarget(tile, direction, (old) => {
      const target = triggerTargetOf(old);
      if (target === undefined || !watchTriggerModeValues(tileKind(target.entityId)).includes(mode)) return undefined;
      return withField(old as Record<string, unknown>, "mode", mode);
    });
  });
}

// ── confirmation, visibility, skip conditions ────────────────────────────

/** What the rest of the Action task shows for a tile. */
export interface WatchTileActionSettings {
  /** Ask Before Running: shown for every tile. `value` is what applies. */
  askBeforeRunning: { stored: boolean | undefined; default: boolean; value: boolean };
  /** Hide When Off, shown for every tile. */
  hideWhenOff: boolean;
  /** Skip Conditions: `shown` for automations; `value` null is Default. */
  skipConditions: { shown: boolean; value: boolean | null };
}

/** Ask Before Running, Hide When Off and Skip Conditions for a tile. */
export function watchTileActionSettings(tile: WatchPageTile): WatchTileActionSettings {
  const entry = watchTileKindEntry(tile);
  const stored = isBool(tile.requiresConfirmation) ? tile.requiresConfirmation : undefined;
  return {
    askBeforeRunning: {
      stored,
      default: entry.defaultRequiresConfirmation,
      value: stored ?? entry.defaultRequiresConfirmation,
    },
    hideWhenOff: tile.hideWhenInactive === true,
    skipConditions: {
      shown: entry.skipConditions,
      value: isBool(tile.automationSkipConditionOverride) ? tile.automationSkipConditionOverride : null,
    },
  };
}

/** Ask Before Running: `true` or `false`, written even when it equals the
 * kind's default; `null` (the Action task's reset) removes the key. */
export function setWatchTileAskBeforeRunning(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  value: boolean | null,
): WatchPagesDocument {
  if (value !== null && !isBool(value)) return document;
  return setKey(document, pageId, tileId, "requiresConfirmation", () => (value === null ? REMOVE : value));
}

/** Hide When Off: on writes `hideWhenInactive: true`, off removes it. */
export function setWatchTileHideWhenOff(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, "hideWhenInactive", () => (on ? true : REMOVE));
}

/** Skip Conditions on an automation: `true` (Skip), `false` (Don't Skip),
 * `null` (Default, the key removed). Refused for other kinds. */
export function setWatchTileSkipConditions(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  value: boolean | null,
): WatchPagesDocument {
  if (value !== null && !isBool(value)) return document;
  return setKey(document, pageId, tileId, "automationSkipConditionOverride", (tile) => {
    if (!watchTileKindEntry(tile).skipConditions) return undefined;
    return value === null ? REMOVE : value;
  });
}

// ── header ───────────────────────────────────────────────────────────────

/** What the Header task shows, or undefined for a tile that is not a
 * header. */
export interface WatchHeaderSettings {
  style: "line" | "label";
  /** `custom` for a header the editor made. */
  domain: string;
  label: string | undefined;
  /** Absent draws at `WATCH_HEADER_TEXT_SIZE_RANGE.auto`. */
  textSize: number | undefined;
  /** As the watch reads it (`dividerParts`): a whole percent over 100, so
   * 0.4 for `g40`; not held to 0 to 1. */
  glow: number;
  color: string | undefined;
}

function isHeader(tile: WatchPageTile): boolean {
  return tileKind(tileEntityId(tile)) === "divider";
}

/** A header tile's style, domain, label, text size, glow and color. */
export function watchHeaderSettings(tile: WatchPageTile): WatchHeaderSettings | undefined {
  if (!isHeader(tile)) return undefined;
  const { style, domain, glow } = dividerParts(tileEntityId(tile));
  return {
    style,
    domain,
    label: typeof tile.customLabel === "string" ? tile.customLabel : undefined,
    textSize: typeof tile.labelFontSizeOverride === "number" ? tile.labelFontSizeOverride : undefined,
    glow,
    color: typeof tile.color === "string" ? tile.color : undefined,
  };
}

function setHeaderKey(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  key: string,
  accept: (tile: WatchPageTile) => unknown,
): WatchPagesDocument {
  return setKey(document, pageId, tileId, key, (tile) => (isHeader(tile) ? accept(tile) : undefined));
}

/** A header's style: the entity id becomes `divider.<style>.custom` plus
 * its glow part, the first dot part that starts with `g`. The domain part
 * always becomes `custom` (a smart page header loses its domain); the label
 * stays. */
export function setWatchHeaderStyle(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  style: "line" | "label",
): WatchPagesDocument {
  if (style !== "line" && style !== "label") return document;
  return setHeaderKey(document, pageId, tileId, "entityId", (tile) => {
    const glow = tileEntityId(tile)
      .split(".")
      .find((p) => p.startsWith("g"));
    return `divider.${style}.custom${glow === undefined ? "" : `.${glow}`}`;
  });
}

/** A header's label: `customLabel`, removed when empty. */
export function setWatchHeaderLabel(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  text: string,
): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return setHeaderKey(document, pageId, tileId, "customLabel", () => (text === "" ? REMOVE : text));
}

/** A header's text size: `labelFontSizeOverride`, rounded to a whole number
 * from 8 to 20; `null` removes it. */
export function setWatchHeaderTextSize(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  size: number | null,
): WatchPagesDocument {
  const value =
    size === null ? REMOVE : wholeIn(size, WATCH_HEADER_TEXT_SIZE_RANGE.min, WATCH_HEADER_TEXT_SIZE_RANGE.max);
  return value === undefined ? document : setHeaderKey(document, pageId, tileId, "labelFontSizeOverride", () => value);
}

/** A header's line glow, 0 to 1: every dot part of the entity id that
 * starts with `g` is removed, then `g<round(glow * 100)>` is added when the
 * glow is above 0. (As on the phone, a domain part starting with `g` would
 * go too; the editor's own headers have `custom`.) */
export function setWatchHeaderGlow(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  glow: number,
): WatchPagesDocument {
  if (typeof glow !== "number" || !Number.isFinite(glow) || glow < 0 || glow > 1) return document;
  return setHeaderKey(document, pageId, tileId, "entityId", (tile) => {
    const parts = tileEntityId(tile)
      .split(".")
      .filter((p) => !p.startsWith("g"));
    if (glow > 0) parts.push(`g${Math.round(glow * 100)}`);
    return parts.join(".");
  });
}

/** A header's color: `#RRGGBB` (its picker has no gradient or rainbow). */
export function setWatchHeaderColor(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  color: string,
): WatchPagesDocument {
  const value = normalizeWatchColor(color, "solid");
  return value === undefined ? document : setHeaderKey(document, pageId, tileId, "color", () => value);
}

// ── page links ───────────────────────────────────────────────────────────

/** A Go to page or Peek page tile's target, or undefined for any other
 * tile. The id is as stored. */
export function watchPageLinkTarget(tile: WatchPageTile): { kind: "page" | "show_page"; targetId: string } | undefined {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  if (kind !== "page" && kind !== "show_page") return undefined;
  return { kind, targetId: tileTarget(entityId) };
}

/**
 * Point a Go to page or Peek page tile at another page: the entity id
 * becomes `page.<ID>` or `show_page.<ID>`, the id in upper case; the kind,
 * icon and color never change. The label follows (becomes the new page's
 * name) when it equals `oldTargetName`, the old target's name now, or is
 * empty or absent; a label of its own, or a stale name from before a
 * rename, stays. A page with no name is called `"Page"`, as the phone reads
 * it (`watchStoredPageName`). Refused for the tile's own page and for a
 * target that is the one it has.
 */
export function setWatchPageLinkTarget(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  page: { id: string; name?: unknown },
  oldTargetName?: string,
): WatchPagesDocument {
  if (typeof page?.id !== "string" || page.id === "") return document;
  const name = watchStoredPageName(page);
  return editTile(document, pageId, tileId, (tile, ownPageId) => {
    const link = watchPageLinkTarget(tile);
    if (link === undefined || sameWatchId(page.id, ownPageId)) return tile;
    const entityId = `${link.kind}.${page.id.toUpperCase()}`;
    if (entityId === tile.entityId) return tile;
    const label = tile.customLabel;
    const follows = label === undefined || label === null || label === "" || (oldTargetName !== undefined && label === oldTargetName);
    const next = withKey(tile, "entityId", entityId);
    return follows ? withKey(next, "customLabel", name) : next;
  });
}

/** Skip open and close animation on a Peek page tile
 * (`peekDisableAnimation`): the watch snaps the peeked page in and out
 * instead of sliding it (`resolvedPeekSkipAnimation`, absent reads as off).
 * Undefined for every other kind, which shows no switch. */
export function watchPeekSkipAnimation(tile: WatchPageTile): boolean | undefined {
  return watchPageLinkTarget(tile)?.kind === "show_page" ? tile.peekDisableAnimation === true : undefined;
}

/** Skip open and close animation: on writes `peekDisableAnimation: true`,
 * off removes the key, as the phone's old toggle did. Refused for a tile
 * that is not a Peek page tile. */
export function setWatchTilePeekSkipAnimation(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  on: boolean,
): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setKey(document, pageId, tileId, "peekDisableAnimation", (tile) =>
    watchPageLinkTarget(tile)?.kind !== "show_page" ? undefined : on ? true : REMOVE);
}

/** A page's name as the phone reads it: a missing (or unreadable) name is
 * `"Page"` (`GridPage.init(from:)`), and that is what a link to it stores. */
export function watchStoredPageName(page: { name?: unknown } | undefined): string {
  return typeof page?.name === "string" ? page.name : "Page";
}

// ── saving ───────────────────────────────────────────────────────────────

/** A tile with every hold and slide direction that is set to Trigger entity
 * and has no target (or one with an empty entity) set to `"none"`, its
 * target entry dropped. The tile itself when there is none, or when the
 * actions or trigger array does not parse. */
function scrubOrphanTriggers(tile: WatchPageTile): WatchPageTile {
  const actions = readWatchSlideMap(tile[HOLD_SLIDE_ACTIONS]);
  if (actions === undefined || actions.size === 0) return tile;
  const triggers = readWatchSlideMap(tile[HOLD_SLIDE_TRIGGERS]);
  if (triggers === undefined) return tile;
  let changed = false;
  for (const [direction, action] of actions) {
    if (action !== "triggerEntity") continue;
    const target = triggers.get(direction);
    const entityId = isJsonObject(target) && typeof target.entityId === "string" ? target.entityId.trim() : "";
    if (entityId !== "") continue;
    actions.set(direction, "none");
    triggers.delete(direction);
    changed = true;
  }
  if (!changed) return tile;
  return withSlideMap(withSlideMap(tile, HOLD_SLIDE_ACTIONS, actions), HOLD_SLIDE_TRIGGERS, triggers);
}

/**
 * The phone's save tidy (`PageEditorView.scrubOrphanTriggerEntityActions`)
 * over every tile of every page: a hold and slide direction left on Trigger
 * entity with no entity picked becomes an explicit `"none"`, and its target
 * entry goes (the array with it once empty). The watch would show such a
 * direction as needing a sync. Pages and tiles with nothing to tidy keep
 * their identity; the document itself comes back when nothing changed.
 */
export function scrubWatchOrphanTriggers(document: WatchPagesDocument): WatchPagesDocument {
  const pages = document.pages;
  if (!Array.isArray(pages)) return document;
  let nextPages: unknown[] | undefined;
  pages.forEach((page, pageIndex) => {
    if (!isJsonObject(page) || !Array.isArray(page.items)) return;
    const items = page.items;
    let nextItems: unknown[] | undefined;
    items.forEach((tile, tileIndex) => {
      if (!isJsonObject(tile)) return;
      const next = scrubOrphanTriggers(tile as WatchPageTile);
      if (next === tile) return;
      nextItems ??= items.slice();
      nextItems[tileIndex] = next;
    });
    if (nextItems === undefined) return;
    nextPages ??= pages.slice();
    nextPages[pageIndex] = { ...page, items: nextItems };
  });
  return nextPages === undefined ? document : ({ ...document, pages: nextPages } as WatchPagesDocument);
}
