// A tile's styling, without any drawing: the phone's State, Border and
// Background tasks, the State Icons and Colors card of its Icon task, and
// the reset of each task.
//
// The setters follow `tile-settings-model.ts`: they take the raw document, a
// page id and a tile id, change only the objects on the path, write exactly
// what the phone writes (a new key at its sorted place, a removed key
// deleted), and refuse by returning the document they were given. Every
// list, word, range and reset key set comes from `tile-styling.json`
// (`tile-styling.ts`), the panel's own table.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3d build contract".

import {
  type TileChange,
  REMOVE,
  editTile,
  isBool,
  normalizeWatchColor,
  sameValue,
  setKey,
  withField,
  withKey,
  withoutKey,
} from "./tile-settings-model.js";
import {
  type WatchStylingSlider,
  type WatchStylingTask,
  watchDecimalOptions,
  watchExtraStateLabel,
  watchStateCards,
  watchStateVocabulary,
  watchStatesNotOffered,
  watchStylingChoices,
  watchStylingReset,
  watchStylingSlider,
} from "./tile-styling.js";
import { type WatchPageTile, type WatchPagesDocument, isJsonObject, tileEntityId, tileKind } from "./model.js";

// ── numbers ──────────────────────────────────────────────────────────────

/** A number as a slider with this range and step stores it: on a step from
 * the slider's start, with the float noise of the step taken off. Undefined
 * for a value that is no number or out of range. */
export function watchSliderValue(value: unknown, slider: WatchStylingSlider): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const { min, max, step } = slider;
  const eps = step > 0 ? step / 2 : 1e-9;
  if (value < min - eps || value > max + eps) return undefined;
  const snapped = step > 0 ? min + Math.round((value - min) / step) * step : value;
  const clean = Number(Math.min(max, Math.max(min, snapped)).toFixed(10));
  return Object.is(clean, -0) ? 0 : clean;
}

/** A stored number, or undefined. */
function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

// ── generic setters ──────────────────────────────────────────────────────

type Setter<V> = (document: WatchPagesDocument, pageId: string, tileId: string, value: V) => WatchPagesDocument;

/** Whether a tile shows a row: by its domain. */
type Shows = (tile: WatchPageTile) => boolean;
const always: Shows = () => true;

function boolSetter(key: string, shows: Shows = always): Setter<boolean> {
  return (document, pageId, tileId, on) =>
    isBool(on) ? setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? on : undefined)) : document;
}

function enumSetter(enumName: string, key: string, shows: Shows = always): Setter<string> {
  return (document, pageId, tileId, value) => {
    if (!watchStylingChoices(enumName).some((c) => c.value === value)) return document;
    return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? value : undefined));
  };
}

function sliderSetter(sliderName: string, key: string, shows: Shows = always): Setter<number> {
  return (document, pageId, tileId, value) => {
    const v = watchSliderValue(value, watchStylingSlider(sliderName));
    if (v === undefined) return document;
    return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? v : undefined));
  };
}

/** A size slider with an Auto button: a whole number in range, or `null`
 * for Auto, which removes the key. */
function autoSizeSetter(sliderName: string, key: string, shows: Shows): Setter<number | null> {
  return (document, pageId, tileId, value) => {
    const v = value === null ? REMOVE : watchSliderValue(Math.round(value), watchStylingSlider(sliderName));
    if (v === undefined) return document;
    return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? v : undefined));
  };
}

/** A color key: the forms the field may hold, `null` removes the key. */
function colorSetter(key: string, forms: "tile" | "label"): Setter<string | null> {
  return (document, pageId, tileId, color) => {
    const v = color === null ? REMOVE : normalizeWatchColor(color, forms);
    return v === undefined ? document : setKey(document, pageId, tileId, key, () => v);
  };
}

// ── State task ───────────────────────────────────────────────────────────

/** A tile's domain: its entity id before the first dot. */
function domainOf(tile: WatchPageTile): string {
  return tileKind(tileEntityId(tile));
}

/** Whether the phone's State task has a row for this key on the tile's
 * domain (`state.cards` of the table). */
function hasRow(key: string): Shows {
  return (tile) => watchStateCards(domainOf(tile)).some((c) => c.rows.includes(key));
}

/** Whether a tile gets the State task at all. */
export function watchTileHasStateTask(tile: WatchPageTile): boolean {
  return watchStateCards(domainOf(tile)).length > 0;
}

/** One row of the State task, with what it shows now (absent keys read as
 * the watch reads them). */
export interface WatchStateRow {
  key: string;
  value: boolean | string | number | undefined;
}

/** One card of the State task as a tile shows it. */
export interface WatchTileStateCard {
  id: string;
  title: string;
  subtitle: string;
  rows: WatchStateRow[];
}

const OFF_STYLE = (): string | undefined => watchStylingChoices("stateValueLabelStyle")[0]?.value;

/** The value a State row shows for a tile. */
function stateRowValue(tile: WatchPageTile, key: string): WatchStateRow["value"] {
  switch (key) {
    case "showTargetTempOnTile":
    case "showCurrentTempOnTile":
    case "showActivityStatus":
    case "statusTextShadow":
      return tile[key] !== false;
    case "stateBarBorder":
    case "stateBarShadow":
      return tile[key] === true;
    case "stateValueLabelStyle":
      return str(tile[key]) ?? "Plain";
    case "stateBarStyle":
      return str(tile[key]) ?? "Top";
    case "stateBarColorStyle":
      return str(tile[key]) ?? "Tile";
    case "decimalPlaces":
      return num(tile[key]) ?? watchDecimalOptions().absent;
    default:
      return num(tile[key]);
  }
}

/** Whether a row shows now: Decimals while the value style is not Off,
 * Icon Size while the status badge is on. */
function stateRowShown(tile: WatchPageTile, key: string): boolean {
  if (key === "decimalPlaces") return str(tile.stateValueLabelStyle) !== OFF_STYLE();
  if (key === "statusIconSizeOverride") return tile.showActivityStatus !== false;
  return true;
}

/** The State task's cards for a tile, in the phone's order, each with the
 * rows that show now. Empty for a domain with no State task. */
export function watchTileStateCards(tile: WatchPageTile): WatchTileStateCard[] {
  return watchStateCards(domainOf(tile)).map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    rows: c.rows.filter((key) => stateRowShown(tile, key)).map((key) => ({ key, value: stateRowValue(tile, key) })),
  }));
}

/** Target Temperature (climate): `true` or `false`. */
export const setWatchTileShowTargetTemp = boolSetter("showTargetTempOnTile", hasRow("showTargetTempOnTile"));
/** Current Temperature (climate). */
export const setWatchTileShowCurrentTemp = boolSetter("showCurrentTempOnTile", hasRow("showCurrentTempOnTile"));
/** Text Shadow of the state text, on the temperature or value card. */
export const setWatchTileStatusTextShadow = boolSetter("statusTextShadow", hasRow("statusTextShadow"));
/** The value label style: Off, Plain or Pill. */
export const setWatchTileValueLabelStyle = enumSetter("stateValueLabelStyle", "stateValueLabelStyle", hasRow("stateValueLabelStyle"));

/** Decimals of a sensor's value: one of the table's choices. */
export const setWatchTileDecimals: Setter<number> = (document, pageId, tileId, value) => {
  if (!watchDecimalOptions().options.includes(value)) return document;
  return setKey(document, pageId, tileId, "decimalPlaces", (tile) => (hasRow("decimalPlaces")(tile) ? value : undefined));
};

/** State Text Size: a whole number, or `null` for Auto. */
export const setWatchTileStateTextSize = autoSizeSetter("badgeFontSizeOverride", "badgeFontSizeOverride", hasRow("badgeFontSizeOverride"));
/** The state bar: Top or Fill. */
export const setWatchTileStateBarStyle = enumSetter("stateBarStyle", "stateBarStyle", hasRow("stateBarStyle"));
/** The state bar's color: Tile or White. */
export const setWatchTileStateBarColor = enumSetter("stateBarColorStyle", "stateBarColorStyle", hasRow("stateBarColorStyle"));
/** Bar Border. */
export const setWatchTileStateBarBorder = boolSetter("stateBarBorder", hasRow("stateBarBorder"));
/** Bar Shadow. */
export const setWatchTileStateBarShadow = boolSetter("stateBarShadow", hasRow("stateBarShadow"));
/** Show Status Badge. */
export const setWatchTileShowActivity = boolSetter("showActivityStatus", hasRow("showActivityStatus"));
/** The status badge's icon size: a whole number, or `null` for Auto. */
export const setWatchTileStatusIconSize = autoSizeSetter("statusIconSizeOverride", "statusIconSizeOverride", hasRow("statusIconSizeOverride"));

/** The setter of each State row, by the key it writes: what a view or a
 * replayed case uses for a row it reads from the table. */
export const WATCH_STATE_ROW_SETTERS = {
  showTargetTempOnTile: setWatchTileShowTargetTemp,
  showCurrentTempOnTile: setWatchTileShowCurrentTemp,
  statusTextShadow: setWatchTileStatusTextShadow,
  stateValueLabelStyle: setWatchTileValueLabelStyle,
  decimalPlaces: setWatchTileDecimals,
  badgeFontSizeOverride: setWatchTileStateTextSize,
  stateBarStyle: setWatchTileStateBarStyle,
  stateBarColorStyle: setWatchTileStateBarColor,
  stateBarBorder: setWatchTileStateBarBorder,
  stateBarShadow: setWatchTileStateBarShadow,
  showActivityStatus: setWatchTileShowActivity,
  statusIconSizeOverride: setWatchTileStatusIconSize,
} as const;

// ── State Icons and Colors ───────────────────────────────────────────────

/** What a domain's live entity tells the vocabulary. */
export interface WatchStateAttributes {
  hvac_modes?: unknown;
  supported_features?: unknown;
  /** Picks the table's `deviceClassIcons` for the default icons. */
  device_class?: unknown;
}

/** One row of the State Icons and Colors card. */
export interface WatchStateIconRow {
  key: string;
  label: string;
  /** The row's own icon and color, when overridden. */
  icon: string | undefined;
  color: string | undefined;
  /** What the state draws with no override: the vocabulary's icon. */
  defaultIcon: string | undefined;
  overridden: boolean;
}

function stringMap(value: unknown): Record<string, string> {
  if (!isJsonObject(value)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) if (typeof v === "string") out[k] = v;
  return out;
}

/**
 * The states a domain offers, narrowed by the entity's live attributes as
 * the phone does: climate rows are the entity's own `hvac_modes` in its
 * order; a state with feature bits is kept only when `supported_features`
 * has one of them. Before the attributes are known, every row. Undefined
 * for a domain with no card.
 */
export function watchStateVocabularyRows(
  domain: string,
  attributes?: WatchStateAttributes,
): { key: string; label: string }[] | undefined {
  const vocab = watchStateVocabulary(domain);
  if (vocab === undefined) return undefined;
  const notOffered = watchStatesNotOffered();
  const rows = narrowRows(vocab, attributes);
  return rows.filter((r) => !notOffered.includes(r.key));
}

function narrowRows(vocab: NonNullable<ReturnType<typeof watchStateVocabulary>>, attributes?: WatchStateAttributes): { key: string; label: string }[] {
  const narrow = vocab.narrow;
  if (narrow?.kind === "hvacModes") {
    const modes = Array.isArray(attributes?.hvac_modes) ? attributes.hvac_modes.filter((m): m is string => typeof m === "string") : [];
    if (modes.length === 0) return vocab.rows.map((r) => ({ ...r }));
    return modes.map((mode) => {
      const key = mode.toLowerCase();
      return { key, label: (Object.hasOwn(narrow.labels, key) ? narrow.labels[key] : undefined) ?? watchExtraStateLabel(key) };
    });
  }
  const features = attributes?.supported_features;
  if (narrow?.kind === "featureBits" && typeof features === "number" && Number.isFinite(features)) {
    const bits = Math.trunc(features);
    return vocab.rows
      .filter((r) => {
        const need = Object.hasOwn(narrow.bits, r.key) ? narrow.bits[r.key] : undefined;
        return need === undefined || need.some((b) => (bits & b) !== 0);
      })
      .map((r) => ({ ...r }));
  }
  return vocab.rows.map((r) => ({ ...r }));
}

/** The State Icons and Colors card for a tile, or undefined for a domain
 * with none. Every overridden state not in the list comes after it, sorted.
 * The default icons are the device class's when the table has them (a
 * cover's garage door), else the domain's. */
export function watchTileStateIcons(
  tile: WatchPageTile,
  attributes?: WatchStateAttributes,
): { rows: WatchStateIconRow[]; any: boolean } | undefined {
  const domain = domainOf(tile);
  const rows = watchStateVocabularyRows(domain, attributes);
  if (rows === undefined) return undefined;
  const icons = stringMap(tile.stateIcons);
  const colors = stringMap(tile.stateColors);
  const known = new Set(rows.map((r) => r.key));
  const extras = [...new Set([...Object.keys(icons), ...Object.keys(colors)])].filter((k) => !known.has(k)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const vocab = watchStateVocabulary(domain);
  const deviceClass = typeof attributes?.device_class === "string" ? attributes.device_class : "";
  const byClass = vocab === undefined || deviceClass === "" ? undefined
    : (Object.hasOwn(vocab.deviceClassIcons, deviceClass) ? vocab.deviceClassIcons[deviceClass] : undefined);
  const defaults = byClass ?? vocab?.defaultIcons ?? {};
  const all =[...rows, ...extras.map((key) => ({ key, label: watchExtraStateLabel(key) }))];
  return {
    rows: all.map((r) => ({
      key: r.key,
      label: r.label,
      icon: Object.hasOwn(icons, r.key) ? icons[r.key] : undefined,
      color: Object.hasOwn(colors, r.key) ? colors[r.key] : undefined,
      defaultIcon: Object.hasOwn(defaults, r.key) ? defaults[r.key] : vocab?.otherStateIcon,
      overridden: Object.hasOwn(icons, r.key) || Object.hasOwn(colors, r.key),
    })),
    any: Object.keys(icons).length > 0 || Object.keys(colors).length > 0,
  };
}

/** A state map with one entry set (at its sorted place) or removed. */
function withMapEntry(map: unknown, key: string, value: string | undefined): Record<string, unknown> | undefined {
  const current: Record<string, unknown> = isJsonObject(map) ? map : {};
  if (value === undefined) {
    if (!Object.hasOwn(current, key)) return isJsonObject(map) && Object.keys(map).length > 0 ? map : undefined;
    const next = { ...current };
    delete next[key];
    return Object.keys(next).length === 0 ? undefined : next;
  }
  if (Object.hasOwn(current, key) && current[key] === value) return current;
  return withField(current, key, value);
}

/** The tile with `usesStateIcons` as the phone syncs it: `true` while either
 * map is there, else removed. */
function syncUsesStateIcons(tile: WatchPageTile): WatchPageTile {
  const any = isJsonObject(tile.stateIcons) || isJsonObject(tile.stateColors);
  return any ? withKey(tile, "usesStateIcons", true) : withoutKey(tile, "usesStateIcons");
}

function withStateEntry(tile: WatchPageTile, mapKey: string, state: string, value: string | undefined): WatchPageTile {
  const next = withMapEntry(tile[mapKey], state.toLowerCase(), value);
  const changed = next === undefined ? withoutKey(tile, mapKey) : next === tile[mapKey] ? tile : withKey(tile, mapKey, next);
  return syncUsesStateIcons(changed);
}

function stateEdit(change: (tile: WatchPageTile) => WatchPageTile, document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  const run: TileChange = (tile) => {
    const next = change(tile);
    return sameValue(next, tile) && Object.keys(next).join() === Object.keys(tile).join() ? tile : next;
  };
  return editTile(document, pageId, tileId, run);
}

/** One state's icon: the symbol name verbatim (a `.fill` stays), `null`
 * removes it. The key is lowercased; an emptied map is removed; and
 * `usesStateIcons` follows. */
export function setWatchTileStateIcon(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  state: string,
  icon: string | null,
): WatchPagesDocument {
  if (typeof state !== "string" || state === "") return document;
  if (icon !== null && (typeof icon !== "string" || icon.trim() === "")) return document;
  return stateEdit((tile) => withStateEntry(tile, "stateIcons", state, icon ?? undefined), document, pageId, tileId);
}

/** One state's color: `#RRGGBB` (or a gradient), `null` removes it. */
export function setWatchTileStateColor(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  state: string,
  color: string | null,
): WatchPagesDocument {
  if (typeof state !== "string" || state === "") return document;
  const value = color === null ? undefined : normalizeWatchColor(color, "label");
  if (color !== null && value === undefined) return document;
  return stateEdit((tile) => withStateEntry(tile, "stateColors", state, value), document, pageId, tileId);
}

/** A row's reset arrow: the state's icon and color both removed. */
export function resetWatchTileState(document: WatchPagesDocument, pageId: string, tileId: string, state: string): WatchPagesDocument {
  if (typeof state !== "string" || state === "") return document;
  return stateEdit(
    (tile) => withStateEntry(withStateEntry(tile, "stateIcons", state, undefined), "stateColors", state, undefined),
    document,
    pageId,
    tileId,
  );
}

/** Clear State Overrides: `usesStateIcons`, `stateIcons`, `stateColors`
 * removed. */
export function clearWatchTileStateOverrides(document: WatchPagesDocument, pageId: string, tileId: string): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) =>
    ["usesStateIcons", "stateIcons", "stateColors"].reduce(withoutKey, tile),
  );
}

// ── Border task ──────────────────────────────────────────────────────────

/** What the Border task shows for a tile, absent keys read as the phone
 * decodes them (a new tile's values). */
export interface WatchTileBorderSettings {
  style: string;
  thickness: string;
  lineStyle: string;
  glow: number;
  animation: string;
  speed: number;
  intensity: number;
  size: number;
  activeOnly: boolean;
  /** Absent means the tile's color. */
  color: string | undefined;
}

export function watchTileBorderSettings(tile: WatchPageTile): WatchTileBorderSettings {
  return {
    style: str(tile.borderStyle) ?? "none",
    thickness: str(tile.borderThickness) ?? "extraThin",
    lineStyle: str(tile.borderLineStyle) ?? "solid",
    glow: num(tile.borderGlow) ?? 0,
    animation: str(tile.borderAnimation) ?? "none",
    speed: num(tile.borderAnimationSpeed) ?? 1,
    intensity: num(tile.borderAnimationIntensity) ?? 1,
    size: num(tile.borderAnimationSize) ?? 1,
    activeOnly: tile.borderActiveOnly !== false,
    color: str(tile.borderColor),
  };
}

/** Border style: none, line or animate. Switching never clears the other
 * style's keys. */
export const setWatchTileBorderStyle = enumSetter("borderStyle", "borderStyle");
/** Thickness: the four the phone offers. */
export const setWatchTileBorderThickness = enumSetter("borderThickness", "borderThickness");
/** Line style: solid, dashed or dotted. */
export const setWatchTileBorderLineStyle = enumSetter("borderLineStyle", "borderLineStyle");
/** Glow, 0 to 1 in tenths. */
export const setWatchTileBorderGlow = sliderSetter("borderGlow", "borderGlow");
/** Border animation. */
export const setWatchTileBorderAnimation = enumSetter("borderAnimation", "borderAnimation");
export const setWatchTileBorderSpeed = sliderSetter("borderAnimationSpeed", "borderAnimationSpeed");
export const setWatchTileBorderIntensity = sliderSetter("borderAnimationIntensity", "borderAnimationIntensity");
export const setWatchTileBorderSize = sliderSetter("borderAnimationSize", "borderAnimationSize");
/** Only when on. */
export const setWatchTileBorderActiveOnly = boolSetter("borderActiveOnly");
/** Border color: `#RRGGBB`, a gradient, `#RAINBOW`; `null` (Tile color)
 * removes the key. */
export const setWatchTileBorderColor = colorSetter("borderColor", "tile");

// ── Background task ──────────────────────────────────────────────────────

export interface WatchTileBackgroundSettings {
  pattern: string;
  patternOpacity: number;
  patternScale: number;
  /** Absent means the default gray. */
  patternColor: string | undefined;
  effect: string;
  effectActiveOnly: boolean;
  /** Absent means the tile's color. */
  effectColor: string | undefined;
  speed: number;
  intensity: number;
  size: number;
}

export function watchTileBackgroundSettings(tile: WatchPageTile): WatchTileBackgroundSettings {
  return {
    pattern: str(tile.backgroundPattern) ?? "none",
    patternOpacity: num(tile.patternOpacity) ?? 1,
    patternScale: num(tile.patternScale) ?? watchStylingSlider("patternScale").auto ?? 1,
    patternColor: str(tile.patternColor),
    effect: str(tile.tileAnimation) ?? "none",
    effectActiveOnly: tile.effectActiveOnly === true,
    effectColor: str(tile.animationColor),
    speed: num(tile.animationSpeed) ?? 1,
    intensity: num(tile.animationIntensity) ?? 1,
    size: num(tile.animationSize) ?? 1,
  };
}

/** Pattern. Choosing one never clears its opacity, size or color. */
export const setWatchTilePattern = enumSetter("backgroundPattern", "backgroundPattern");
export const setWatchTilePatternOpacity = sliderSetter("patternOpacity", "patternOpacity");
export const setWatchTilePatternScale = sliderSetter("patternScale", "patternScale");
/** Pattern color: `#RRGGBB` or a gradient (drawn as its first color); `null`
 * removes the key, the default gray. */
export const setWatchTilePatternColor = colorSetter("patternColor", "label");
/** Effect. */
export const setWatchTileEffect = enumSetter("tileAnimation", "tileAnimation");
export const setWatchTileEffectActiveOnly = boolSetter("effectActiveOnly");
/** Effect color: as the border's; `null` (Tile color) removes the key. */
export const setWatchTileEffectColor = colorSetter("animationColor", "tile");
export const setWatchTileEffectSpeed = sliderSetter("animationSpeed", "animationSpeed");
export const setWatchTileEffectIntensity = sliderSetter("animationIntensity", "animationIntensity");
export const setWatchTileEffectSize = sliderSetter("animationSize", "animationSize");

/** The setter of every tile styling row, by the key it writes. */
export const WATCH_TILE_STYLING_SETTERS: Readonly<Record<string, Setter<never>>> = {
  ...WATCH_STATE_ROW_SETTERS,
  borderStyle: setWatchTileBorderStyle,
  borderThickness: setWatchTileBorderThickness,
  borderLineStyle: setWatchTileBorderLineStyle,
  borderGlow: setWatchTileBorderGlow,
  borderAnimation: setWatchTileBorderAnimation,
  borderAnimationSpeed: setWatchTileBorderSpeed,
  borderAnimationIntensity: setWatchTileBorderIntensity,
  borderAnimationSize: setWatchTileBorderSize,
  borderActiveOnly: setWatchTileBorderActiveOnly,
  borderColor: setWatchTileBorderColor,
  backgroundPattern: setWatchTilePattern,
  patternOpacity: setWatchTilePatternOpacity,
  patternScale: setWatchTilePatternScale,
  patternColor: setWatchTilePatternColor,
  tileAnimation: setWatchTileEffect,
  effectActiveOnly: setWatchTileEffectActiveOnly,
  animationColor: setWatchTileEffectColor,
  animationSpeed: setWatchTileEffectSpeed,
  animationIntensity: setWatchTileEffectIntensity,
  animationSize: setWatchTileEffectSize,
};

// ── resets ───────────────────────────────────────────────────────────────

/** The tile tasks with a reset. */
export type WatchTileStylingTask = Exclude<WatchStylingTask, "page">;

/** A task's reset, the phone's keys: each written with the table's value,
 * a `null` one removed. */
export function resetWatchTileTask(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  task: WatchTileStylingTask,
): WatchPagesDocument {
  if (task !== "state" && task !== "border" && task !== "background") return document;
  const keys = watchStylingReset(task);
  return editTile(document, pageId, tileId, (tile) => {
    let next = tile;
    for (const [key, value] of Object.entries(keys)) next = value === null ? withoutKey(next, key) : withKey(next, key, value);
    return next;
  });
}

/** A task's reset on a smart page rule's style: every key of the task
 * removed, so each reads as the watch's own default, as the phone's rule
 * Reset leaves them. */
export function clearWatchTileTask(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  task: WatchTileStylingTask,
): WatchPagesDocument {
  if (task !== "state" && task !== "border" && task !== "background") return document;
  const keys = Object.keys(watchStylingReset(task));
  return editTile(document, pageId, tileId, (tile) => keys.reduce((next, key) => withoutKey(next, key), tile));
}

/** Whether a tile holds any key of a task: what a rule's style shows the
 * "modified" mark and the Reset row for. */
export function watchTileTaskHeld(tile: WatchPageTile, task: WatchTileStylingTask): boolean {
  return Object.keys(watchStylingReset(task)).some((key) => Object.hasOwn(tile, key));
}

/** Whether a task's reset would change the tile: what the "modified" mark
 * of a section shows. */
export function watchTileTaskModified(tile: WatchPageTile, task: WatchTileStylingTask): boolean {
  for (const [key, value] of Object.entries(watchStylingReset(task))) {
    if (value === null ? Object.hasOwn(tile, key) : !sameValue(tile[key], value)) return true;
  }
  return false;
}
