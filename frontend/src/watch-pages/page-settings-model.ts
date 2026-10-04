// A page's styling, without any drawing: the phone's Page task (background
// decoration, page title), its Reset, the page theme with the phone's color
// remap, and the Solid or Gradient switch.
//
// The setters take the raw document and a page id and return a new document
// in which only the objects on the path are new. A page key the page did
// not have goes at its sorted place, as the phone encodes it. After every
// edit the page's decoration keys are written as the phone's codec writes
// them (`page-keys.json`, `writeWhen`): a pattern's keys only while the
// pattern is not none, the overlay's likewise, the image's only with an
// image id. A setter refuses by returning the document it was given; so
// does an edit that changes nothing.
//
// The theme remap is `DSThemeHex.remapKnownThemeHex` (not aggressive) over
// the palettes of `tile-styling.json` and the role colors of
// `tile-defaults.json`; the gradient form is `watchGradientOf`.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3d build contract".

import pageKeys from "./page-keys.json";
import { findWatchPage } from "./edit.js";
import { sameWatchPagesJson } from "./merge.js";
import { type JsonObject, type WatchPage, type WatchPagesDocument, isJsonObject, isSystemWatchPage } from "./model.js";
import { normalizeWatchColor, sameValue, withField } from "./tile-settings-model.js";
import { WATCH_TILE_DEFAULTS, normalizedHex, watchGradientOf } from "./tile-new.js";
import { watchSliderValue } from "./styling-model.js";
import {
  watchRemapIndexLists,
  watchRemapThemeOrder,
  watchRoleByHex,
  watchStylingChoices,
  watchStylingReset,
  watchStylingSlider,
  watchStylingTheme,
  watchSwatchFallbackTheme,
} from "./tile-styling.js";

// ── the codec ────────────────────────────────────────────────────────────

interface PageKeySpec {
  default?: unknown;
  writeWhen?: { key: string; present?: boolean; not?: unknown };
}

const PAGE_KEYS: Readonly<Record<string, PageKeySpec>> = (
  pageKeys as unknown as { types: { page: { keys: Record<string, PageKeySpec> } } }
).types.page.keys;

/** A page key as the phone decodes it: the stored value, else the key's
 * default. */
export function watchPageValue(page: WatchPage, key: string): unknown {
  if (Object.hasOwn(page, key) && page[key] !== null && page[key] !== undefined) return page[key];
  const spec = Object.hasOwn(PAGE_KEYS, key) ? PAGE_KEYS[key] : undefined;
  return spec?.default;
}

function pageString(page: WatchPage, key: string): string | undefined {
  const v = watchPageValue(page, key);
  return typeof v === "string" ? v : undefined;
}

function pageNumber(page: WatchPage, key: string): number | undefined {
  const v = watchPageValue(page, key);
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

/** Whether the phone writes a key with a `writeWhen` rule for this page. */
function written(page: WatchPage, rule: NonNullable<PageKeySpec["writeWhen"]>): boolean {
  if (rule.present === true) return page[rule.key] !== undefined && page[rule.key] !== null;
  if (Object.hasOwn(rule, "not")) return !sameValue(watchPageValue(page, rule.key), rule.not);
  return true;
}

/**
 * The page with its conditional keys as the phone's encoder writes them:
 * a key whose rule fails is removed; a key whose rule holds and that is
 * missing is written with its default (the phone writes what it decoded).
 */
export function encodeWatchPageKeys(page: WatchPage): WatchPage {
  let next: JsonObject = page;
  for (const [key, spec] of Object.entries(PAGE_KEYS)) {
    const rule = spec.writeWhen;
    if (rule === undefined) continue;
    const has = Object.hasOwn(next, key);
    if (!written(next as WatchPage, rule)) {
      if (has) {
        next = { ...next };
        delete next[key];
      }
    } else if (!has && Object.hasOwn(spec, "default")) {
      next = withField(next, key, structuredClone(spec.default));
    }
  }
  return next as WatchPage;
}

// ── plumbing ─────────────────────────────────────────────────────────────

/** The document with one page changed, then encoded (`encodeWatchPageKeys`).
 * The document itself for a page that is missing or a system page, or when
 * the change leaves the page as it was. */
function editPage(document: WatchPagesDocument, pageId: string, change: (page: WatchPage) => WatchPage | undefined): WatchPagesDocument {
  const page = findWatchPage(document, pageId);
  const pages = document.pages;
  if (page === undefined || isSystemWatchPage(page) || !Array.isArray(pages)) return document;
  const changed = change(page);
  if (changed === undefined) return document;
  const next = encodeWatchPageKeys(changed);
  if (next === page || (sameValue(next, page) && Object.keys(next).join() === Object.keys(page).join())) return document;
  const nextPages = pages.slice();
  nextPages[pages.indexOf(page)] = next;
  return { ...document, pages: nextPages };
}

/** The page with `key` set at its place, or at its sorted place when new. */
function withPageKey(page: WatchPage, key: string, value: unknown): WatchPage {
  if (Object.hasOwn(page, key) && sameValue(page[key], value)) return page;
  return withField(page, key, value);
}

function withoutPageKey(page: WatchPage, key: string): WatchPage {
  if (!Object.hasOwn(page, key)) return page;
  const next = { ...page };
  delete next[key];
  return next;
}

/** A setter for one page key whose value `accept` checks against the page:
 * undefined refuses, `null` removes. */
function setPageKey(
  document: WatchPagesDocument,
  pageId: string,
  key: string,
  accept: (page: WatchPage) => unknown,
): WatchPagesDocument {
  return editPage(document, pageId, (page) => {
    const value = accept(page);
    if (value === undefined) return undefined;
    return value === null ? withoutPageKey(page, key) : withPageKey(page, key, value);
  });
}

function enumPageSetter(enumName: string, key: string, when?: (page: WatchPage) => boolean) {
  return (document: WatchPagesDocument, pageId: string, value: string): WatchPagesDocument => {
    if (!watchStylingChoices(enumName).some((c) => c.value === value)) return document;
    return setPageKey(document, pageId, key, (page) => (when === undefined || when(page) ? value : undefined));
  };
}

function sliderPageSetter(sliderName: string, key: string, when?: (page: WatchPage) => boolean) {
  return (document: WatchPagesDocument, pageId: string, value: number): WatchPagesDocument => {
    const v = watchSliderValue(value, watchStylingSlider(sliderName));
    if (v === undefined) return document;
    return setPageKey(document, pageId, key, (page) => (when === undefined || when(page) ? v : undefined));
  };
}

function colorPageSetter(key: string, forms: "tile" | "label", when?: (page: WatchPage) => boolean) {
  return (document: WatchPagesDocument, pageId: string, color: string): WatchPagesDocument => {
    const v = normalizeWatchColor(color, forms);
    if (v === undefined) return document;
    return setPageKey(document, pageId, key, (page) => (when === undefined || when(page) ? v : undefined));
  };
}

// ── background decoration ────────────────────────────────────────────────

/** The phone's background decorations, one at a time. */
export type WatchPageDecoration = "none" | "image" | "color" | "pattern" | "animation";

/** The decorations in the phone's order. */
export const WATCH_PAGE_DECORATIONS: readonly WatchPageDecoration[] = ["none", "image", "color", "pattern", "animation"];

const NONE_STYLE = "none";

function hasImage(page: WatchPage): boolean {
  return typeof page.backgroundImageId === "string";
}

/** The decoration a page shows on open: image, else pattern, else
 * animation, else color when it is set and not black, else none. */
export function watchPageDecoration(page: WatchPage): WatchPageDecoration {
  if (page.backgroundImageId !== undefined && page.backgroundImageId !== null) return "image";
  if (pageString(page, "backgroundPattern") !== NONE_STYLE) return "pattern";
  if (pageString(page, "backgroundOverlay") !== NONE_STYLE) return "animation";
  const color = page.backgroundColor;
  if (color !== undefined && color !== null && color !== clearValue("backgroundColor")) return "color";
  return "none";
}

/** The values each decoration had when it was last left, as the phone's
 * Page task keeps them while it is open. Every key of a decoration: the
 * phone's clear only sets the pattern and the overlay to none, so their
 * color, size and the rest stay in its page and come back with them. */
export interface WatchPageDecorationMemory {
  color: { backgroundColor: unknown; backgroundBrightness: unknown };
  pattern: {
    backgroundPattern: unknown;
    backgroundPatternColor: unknown;
    backgroundPatternOpacity: unknown;
    backgroundPatternScale: unknown;
  };
  animation: {
    backgroundOverlay: unknown;
    backgroundOverlayColor: unknown;
    backgroundOverlaySpeed: unknown;
    backgroundOverlayIntensity: unknown;
    backgroundOverlaySize: unknown;
  };
}

const MEMORY_KEYS: { readonly [K in keyof WatchPageDecorationMemory]: readonly (keyof WatchPageDecorationMemory[K])[] } = {
  color: ["backgroundColor", "backgroundBrightness"],
  pattern: ["backgroundPattern", "backgroundPatternColor", "backgroundPatternOpacity", "backgroundPatternScale"],
  animation: ["backgroundOverlay", "backgroundOverlayColor", "backgroundOverlaySpeed", "backgroundOverlayIntensity", "backgroundOverlaySize"],
};

function remember<K extends keyof WatchPageDecorationMemory>(page: WatchPage, which: K): WatchPageDecorationMemory[K] {
  const out: Record<string, unknown> = {};
  for (const key of MEMORY_KEYS[which]) out[key as string] = page[key as string] === null ? undefined : watchPageValue(page, key as string);
  // `backgroundColor` has no default: an absent color stays absent.
  if (which === "color" && (page.backgroundColor === undefined || page.backgroundColor === null)) out.backgroundColor = undefined;
  return out as WatchPageDecorationMemory[K];
}

/** The memory as the phone seeds it when the Page task opens: every
 * decoration's values as the page has them. */
export function watchPageDecorationMemory(page: WatchPage): WatchPageDecorationMemory {
  return { color: remember(page, "color"), pattern: remember(page, "pattern"), animation: remember(page, "animation") };
}

/** The value a decoration's clear writes: the Page reset's. */
function clearValue(key: string): unknown {
  return watchStylingReset("page")[key];
}

/**
 * Choose a decoration, as the phone's segment does: the current one's
 * values remembered, every decoration cleared (pattern and overlay none,
 * background black at the reset brightness), then the chosen one's
 * remembered values put back, every key of it (a pattern's color and size,
 * an animation's color too). Only the Color decoration keeps a brightness;
 * leaving Image drops the image id, as on the phone. `from` is the segment
 * shown now (the page's own when not given), `memory` what the task
 * remembered (seeded from the page when not given). Refused for Image, which
 * only the phone sets; the view offers no segment on a page with an image.
 */
export function selectWatchPageDecoration(
  document: WatchPagesDocument,
  pageId: string,
  to: WatchPageDecoration,
  options: { from?: WatchPageDecoration; memory?: WatchPageDecorationMemory } = {},
): { document: WatchPagesDocument; memory: WatchPageDecorationMemory | undefined } {
  const page = findWatchPage(document, pageId);
  if (page === undefined || to === "image" || !WATCH_PAGE_DECORATIONS.includes(to)) {
    return { document, memory: options.memory };
  }
  const from = options.from ?? watchPageDecoration(page);
  if (from === to) return { document, memory: options.memory };
  const memory: WatchPageDecorationMemory = structuredClone(options.memory ?? watchPageDecorationMemory(page));
  if (from === "color" || from === "pattern" || from === "animation") {
    (memory as unknown as Record<string, unknown>)[from] = remember(page, from);
  }
  const next = editPage(document, pageId, (p) => {
    let out = p;
    for (const key of ["backgroundImageId", "backgroundPattern", "backgroundOverlay", "backgroundColor", "backgroundBrightness"]) {
      const value = clearValue(key);
      out = value === null || value === undefined ? withoutPageKey(out, key) : withPageKey(out, key, value);
    }
    if (to === "color" || to === "pattern" || to === "animation") {
      for (const [key, value] of Object.entries(memory[to])) {
        out = value === undefined || value === null ? withoutPageKey(out, key) : withPageKey(out, key, value);
      }
    }
    return out;
  });
  return { document: next, memory };
}

// ── Color, Pattern, Animation ────────────────────────────────────────────

/** The page's background color: `#RRGGBB` (OLED is `#000000`) or a
 * gradient. */
export const setWatchPageBackgroundColor = colorPageSetter("backgroundColor", "label");

/** The Solid or Gradient circle of a page palette (`backgroundColor` or
 * `pageTitleTextColor`): the stored color rewritten in that form. Nothing
 * for an absent color, and the background's OLED black stays as it is. */
export function setWatchPageColorMode(
  document: WatchPagesDocument,
  pageId: string,
  key: "backgroundColor" | "pageTitleTextColor",
  mode: "solid" | "gradient",
): WatchPagesDocument {
  if ((mode !== "solid" && mode !== "gradient") || (key !== "backgroundColor" && key !== "pageTitleTextColor")) return document;
  return setPageKey(document, pageId, key, (page) => {
    const color = page[key];
    if (typeof color !== "string") return undefined;
    if (key === "backgroundColor" && normalizedHex(color) === clearValue("backgroundColor")) return undefined;
    return normalizeWatchColor(mode === "gradient" ? watchGradientOf(color) : watchSolidVersion(color), "label");
  });
}

/** The background palette's Solid or Gradient circle. */
export function setWatchPageBackgroundColorMode(document: WatchPagesDocument, pageId: string, mode: "solid" | "gradient"): WatchPagesDocument {
  return setWatchPageColorMode(document, pageId, "backgroundColor", mode);
}

/** Brightness, 0 to 1.5. */
export const setWatchPageBrightness = sliderPageSetter("backgroundBrightness", "backgroundBrightness");

const patternOn = (page: WatchPage) => pageString(page, "backgroundPattern") !== NONE_STYLE;
const overlayOn = (page: WatchPage) => pageString(page, "backgroundOverlay") !== NONE_STYLE;

/** The page pattern; none drops its keys. */
export const setWatchPagePattern = enumPageSetter("backgroundPattern", "backgroundPattern");
export const setWatchPagePatternOpacity = sliderPageSetter("backgroundPatternOpacity", "backgroundPatternOpacity", patternOn);
export const setWatchPagePatternScale = sliderPageSetter("backgroundPatternScale", "backgroundPatternScale", patternOn);
/** The pattern's color: `#RRGGBB` or a gradient (drawn as its first color). */
export const setWatchPagePatternColor = colorPageSetter("backgroundPatternColor", "label", patternOn);

/** The page animation (overlay); none drops its keys. */
export const setWatchPageOverlay = enumPageSetter("backgroundOverlay", "backgroundOverlay");
export const setWatchPageOverlaySpeed = sliderPageSetter("backgroundOverlaySpeed", "backgroundOverlaySpeed", overlayOn);
export const setWatchPageOverlayIntensity = sliderPageSetter("backgroundOverlayIntensity", "backgroundOverlayIntensity", overlayOn);
export const setWatchPageOverlaySize = sliderPageSetter("backgroundOverlaySize", "backgroundOverlaySize", overlayOn);
/** The animation's color: `#RRGGBB`, a gradient or `#RAINBOW`. */
export const setWatchPageOverlayColor = colorPageSetter("backgroundOverlayColor", "tile", overlayOn);

// ── page title ───────────────────────────────────────────────────────────

/** Display: none, minimal, pill or glass. */
export const setWatchPageTitleStyle = enumPageSetter("pageTitleDisplayStyle", "pageTitleDisplayStyle");
/** Size: one of the size enum's values. */
export const setWatchPageTitleSize = enumPageSetter("pageTitleTextSize", "pageTitleTextSize");
/** Text color: `#RRGGBB` or a gradient. */
export const setWatchPageTitleColor = colorPageSetter("pageTitleTextColor", "label");

/** Icon: a symbol name, `""` for None. */
export function setWatchPageTitleIcon(document: WatchPagesDocument, pageId: string, icon: string): WatchPagesDocument {
  if (typeof icon !== "string") return document;
  return setPageKey(document, pageId, "pageTitleIcon", () => icon.trim());
}

// ── the page switcher ────────────────────────────────────────────────────

/** The page switcher's display modes, from `page-keys.json`. */
export const WATCH_PAGE_SWITCHER_MODES: readonly string[] =
  (pageKeys as unknown as { enums: Record<string, string[]> }).enums.PageSwitcherDisplayMode ?? ["text", "icon"];

/** The page's icon in the page switcher: a symbol name, `""` for the
 * automatic one (the key removed). */
export function setWatchPageSwitcherIcon(document: WatchPagesDocument, pageId: string, icon: string): WatchPagesDocument {
  if (typeof icon !== "string") return document;
  const name = icon.trim();
  return setPageKey(document, pageId, "switcherIcon", () => (name === "" ? null : name));
}

/** The page's color in the page switcher: `#RRGGBB`, or undefined for the
 * automatic one (the key removed). A gradient or anything else is refused:
 * the switcher reads a plain hex. */
export function setWatchPageSwitcherColor(document: WatchPagesDocument, pageId: string, color: string | undefined): WatchPagesDocument {
  if (color === undefined) return setPageKey(document, pageId, "switcherColor", () => null);
  const m = typeof color === "string" ? /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(color.trim()) : null;
  if (m === null) return document;
  return setPageKey(document, pageId, "switcherColor", () => `#${m[1]!.toUpperCase()}`);
}

/** The page's name in the page switcher; empty goes back to the page's own
 * name (the key removed), as the phone does. */
export function setWatchPageSwitcherText(document: WatchPagesDocument, pageId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return setPageKey(document, pageId, "switcherText", () => (text === "" ? null : text));
}

/** Text or icon for this page in the switcher; undefined removes the key,
 * which the watch reads as text. */
export function setWatchPageSwitcherDisplayMode(document: WatchPagesDocument, pageId: string, mode: string | undefined): WatchPagesDocument {
  if (mode === undefined) return setPageKey(document, pageId, "switcherDisplayMode", () => null);
  if (!WATCH_PAGE_SWITCHER_MODES.includes(mode)) return document;
  return setPageKey(document, pageId, "switcherDisplayMode", () => mode);
}

/** Whether the page is left out of the page switcher. */
export function setWatchPageHideFromSwitcher(document: WatchPagesDocument, pageId: string, hide: boolean): WatchPagesDocument {
  if (typeof hide !== "boolean") return document;
  return setPageKey(document, pageId, "hideFromSwitcher", () => hide);
}

/** The setter of each Page row, by the key it writes. */
export const WATCH_PAGE_STYLING_SETTERS: Readonly<Record<string, (document: WatchPagesDocument, pageId: string, value: never) => WatchPagesDocument>> = {
  backgroundColor: setWatchPageBackgroundColor,
  backgroundBrightness: setWatchPageBrightness,
  backgroundPattern: setWatchPagePattern,
  backgroundPatternOpacity: setWatchPagePatternOpacity,
  backgroundPatternScale: setWatchPagePatternScale,
  backgroundPatternColor: setWatchPagePatternColor,
  backgroundOverlay: setWatchPageOverlay,
  backgroundOverlaySpeed: setWatchPageOverlaySpeed,
  backgroundOverlayIntensity: setWatchPageOverlayIntensity,
  backgroundOverlaySize: setWatchPageOverlaySize,
  backgroundOverlayColor: setWatchPageOverlayColor,
  pageTitleDisplayStyle: setWatchPageTitleStyle,
  pageTitleTextSize: setWatchPageTitleSize,
  pageTitleTextColor: setWatchPageTitleColor,
  pageTitleIcon: setWatchPageTitleIcon,
  switcherIcon: setWatchPageSwitcherIcon,
  switcherColor: setWatchPageSwitcherColor,
  switcherText: setWatchPageSwitcherText,
  switcherDisplayMode: setWatchPageSwitcherDisplayMode,
  hideFromSwitcher: setWatchPageHideFromSwitcher,
};

// ── reset ────────────────────────────────────────────────────────────────

const IMAGE_KEYS: ReadonlySet<string> = new Set(["backgroundImageId", "backgroundImageOpacity", "backgroundImageBlur", "backgroundImageFit"]);

/** Reset Page: the phone's keys, each written with the table's value
 * (`pageTitleIcon` as `house`), a `null` one removed (the image id included,
 * as the phone does). Not the theme or the gradient switch. A key the page
 * does not have and that reads as the reset value already (an absent icon
 * is `house` to the watch) stays absent, so a page at its reset values is
 * left as it is. With `keepImage` the image keys stay: the panel's own Reset
 * never touches an image the phone set. */
export function resetWatchPage(document: WatchPagesDocument, pageId: string, options: { keepImage?: boolean } = {}): WatchPagesDocument {
  return editPage(document, pageId, (page) => {
    const keepImage = options.keepImage === true && hasImage(page);
    let out = page;
    for (const [key, value] of Object.entries(watchStylingReset("page"))) {
      if (keepImage && IMAGE_KEYS.has(key)) continue;
      const absent = page[key] === undefined || page[key] === null;
      if (absent && value !== null && Object.hasOwn(PAGE_KEYS, key) && sameValue(PAGE_KEYS[key]!.default, value)) continue;
      out = value === null ? withoutPageKey(out, key) : withPageKey(out, key, value);
    }
    return out;
  });
}

/** Whether the panel's Reset Page would change the page: an absent icon
 * and `house` are one. */
export function watchPageModified(document: WatchPagesDocument, pageId: string): boolean {
  return resetWatchPage(document, pageId, { keepImage: true }) !== document;
}

// ── themes and the remap ─────────────────────────────────────────────────

const GRADIENT_PREFIX = "GRADIENT|";
const RAINBOW = "#RAINBOW";

/** `DSThemeHex.gradientComponents`: the two ends of a gradient token,
 * normalized, or undefined. */
function gradientEnds(value: string): { start: string; end: string } | undefined {
  const trimmed = value.trim();
  if (!trimmed.startsWith(GRADIENT_PREFIX)) return undefined;
  const payload = trimmed.slice(GRADIENT_PREFIX.length);
  const bar = payload.indexOf("|");
  if (bar < 0) return undefined;
  return { start: normalizedHex(payload.slice(0, bar)), end: normalizedHex(payload.slice(bar + 1)) };
}

/** `DSThemeHex.solidVersion`: a gradient's start, `#RAINBOW` as is, else
 * the color normalized. */
export function watchSolidVersion(value: string): string {
  const trimmed = value.trim();
  if (trimmed === RAINBOW) return value;
  return gradientEnds(trimmed)?.start ?? normalizedHex(trimmed);
}

/** `DSThemeHex.primaryHex`. */
function primaryHex(value: string): string {
  return gradientEnds(value)?.start ?? normalizedHex(value);
}

/** The theme names in the phone's order. */
export function watchPageThemes(): string[] {
  return WATCH_TILE_DEFAULTS.themeOrder.slice();
}

/** The theme whose swatches a page's palettes show: its `themeOverride`
 * when the app has it, else the table's swatch fallback. */
export function watchPageSwatchTheme(page: WatchPage): string {
  const t = page.themeOverride;
  return typeof t === "string" && WATCH_TILE_DEFAULTS.themeOrder.includes(t) ? t : watchSwatchFallbackTheme();
}

/** The theme a page draws in: its `themeOverride` when the app has it, else
 * the watch's fallback. */
export function watchPageTheme(page: WatchPage): string {
  const t = page.themeOverride;
  return typeof t === "string" && WATCH_TILE_DEFAULTS.themeOrder.includes(t) ? t : WATCH_TILE_DEFAULTS.watchFallbackTheme;
}

/** A theme's role colors, every role the phone has. */
function themeRoles(theme: string): Record<string, string> {
  return watchStylingTheme(theme)?.roles ?? {};
}

/**
 * `DSThemeHex.remapKnownThemeHex(hex, to: target)`: a gradient end by end;
 * `#000000` and `#FFFFFF` as they are; a role color of any theme to the
 * target's color for that role; else a swatch of any theme (page, then
 * background, subtle, animation lists, theme by theme) to the same place in
 * the target's list. Undefined when the color is none of these.
 */
export function watchRemapThemeHex(hex: string, target: string): string | undefined {
  const ends = gradientEnds(hex);
  if (ends !== undefined) {
    const start = watchRemapThemeHex(ends.start, target) ?? ends.start;
    const end = watchRemapThemeHex(ends.end, target) ?? ends.end;
    return `${GRADIENT_PREFIX}${normalizedHex(start)}|${normalizedHex(end)}`;
  }
  const n = normalizedHex(hex);
  if (n === "#000000" || n === "#FFFFFF") return n;
  const byHex = watchRoleByHex();
  const role = Object.hasOwn(byHex, n) ? byHex[n] : undefined;
  if (role !== undefined) {
    const to = themeRoles(target)[role];
    return to === undefined ? undefined : normalizedHex(to);
  }
  const targetTheme = watchStylingTheme(target) as unknown as Record<string, unknown> | undefined;
  if (targetTheme === undefined) return undefined;
  for (const source of watchRemapThemeOrder()) {
    const sourceTheme = watchStylingTheme(source) as unknown as Record<string, unknown> | undefined;
    if (sourceTheme === undefined) continue;
    for (const list of watchRemapIndexLists()) {
      const from = sourceTheme[list];
      const to = targetTheme[list];
      if (!Array.isArray(from) || !Array.isArray(to) || from.length !== to.length) continue;
      const index = from.findIndex((h) => typeof h === "string" && normalizedHex(h) === n);
      if (index >= 0) return normalizedHex(String(to[index]));
    }
  }
  return undefined;
}

function remapped(value: unknown, target: string): unknown {
  return typeof value === "string" ? (watchRemapThemeHex(value, target) ?? value) : value;
}

/** An object with some keys replaced, each in its place, or the object
 * itself when none changed. */
function withValues<T extends JsonObject>(object: T, values: Record<string, unknown>): T {
  let out = object;
  for (const [key, value] of Object.entries(values)) {
    if (!Object.hasOwn(object, key) || sameValue(object[key], value)) continue;
    if (out === object) out = { ...object };
    (out as JsonObject)[key] = value;
  }
  return out;
}

function mapTiles(page: WatchPage, change: (tile: JsonObject) => JsonObject): WatchPage {
  if (!Array.isArray(page.items)) return page;
  let items: unknown[] | undefined;
  page.items.forEach((tile, i) => {
    if (!isJsonObject(tile)) return;
    const next = change(tile);
    if (next === tile) return;
    items ??= (page.items as unknown[]).slice();
    items[i] = next;
  });
  return items === undefined ? page : { ...page, items };
}

/** Every tile's `color` and `animationColor` (not `#RAINBOW`) through `f`. */
function mapTileColors(page: WatchPage, f: (color: string) => string): WatchPage {
  return mapTiles(page, (tile) => {
    const values: Record<string, unknown> = {};
    for (const key of ["color", "animationColor"]) {
      const c = tile[key];
      if (typeof c === "string" && c !== RAINBOW) values[key] = f(c);
    }
    return withValues(tile, values);
  });
}

/** The tile colors a theme change remaps. */
const THEME_TILE_KEYS = ["color", "animationColor", "borderColor", "overlayColor"] as const;

/** A tile's theme colors remapped to `theme`, as the phone's theme change
 * does: `borderColor` not when `#THEME`, `overlayColor` not when `#FFFFFF`.
 * Only the keys `only` allows, when it is given. */
function remapTileColors(tile: JsonObject, theme: string, only?: (key: string) => boolean): JsonObject {
  const values: Record<string, unknown> = {};
  for (const key of THEME_TILE_KEYS) {
    if (only !== undefined && !only(key)) continue;
    if (key === "borderColor" && tile.borderColor === "#THEME") continue;
    if (key === "overlayColor" && tile.overlayColor === "#FFFFFF") continue;
    values[key] = remapped(tile[key], theme);
  }
  return withValues(tile, values);
}

/**
 * Change the page theme, as the phone's picker commits it. When the theme
 * the page draws in now is another: every tile's `color`, `animationColor`,
 * `borderColor` (not `#THEME`) and `overlayColor` (not `#FFFFFF`), and every
 * group's `overlayColor`, remapped (`watchRemapThemeHex`). Then the page's
 * `backgroundColor` remapped, and, with gradient colors on, every tile's
 * `color` and `animationColor` written again in the gradient form of its
 * first color. Then `themeOverride`. Pattern, state, label, title and
 * decoration colors stay.
 */
export function setWatchPageTheme(document: WatchPagesDocument, pageId: string, theme: string): WatchPagesDocument {
  if (!watchPageThemes().includes(theme)) return document;
  return editPage(document, pageId, (page) => {
    const source = watchPageTheme(page);
    let out = page;
    if (source !== theme) {
      out = mapTiles(out, (tile) => remapTileColors(tile, theme));
      if (Array.isArray(out.groups)) {
        const groups = out.groups.map((g) => (isJsonObject(g) ? withValues(g, { overlayColor: remapped(g.overlayColor, theme) }) : g));
        if (groups.some((g, i) => g !== (out.groups as unknown[])[i])) out = { ...out, groups };
      }
    }
    if (typeof out.backgroundColor === "string") out = withValues(out, { backgroundColor: remapped(out.backgroundColor, theme) });
    if (out.useGradientColors === true) out = mapTileColors(out, (c) => watchGradientOf(primaryHex(c)));
    return withPageKey(out, "themeOverride", theme);
  });
}

/**
 * The Solid or Gradient switch: `useGradientColors`, then every tile's
 * `color` and `animationColor` (not `#RAINBOW`) in that form: a solid color
 * to its gradient (`watchGradientOf`), a gradient to its first color.
 * Border, overlay, pattern and state colors stay.
 */
export function setWatchPageGradientColors(document: WatchPagesDocument, pageId: string, on: boolean): WatchPagesDocument {
  if (typeof on !== "boolean") return document;
  return editPage(document, pageId, (page) =>
    withPageKey(mapTileColors(page, (c) => (on ? watchGradientOf(c) : watchSolidVersion(c))), "useGradientColors", on),
  );
}

// ── after a merge ────────────────────────────────────────────────────────

/** The page without the keys the phone's codec would not write: a
 * pattern's keys while it is absent or none, the overlay's likewise, the
 * image's without an image id. Nothing is added. */
function dropUnwrittenPageKeys(page: WatchPage): WatchPage {
  let next: JsonObject = page;
  for (const [key, spec] of Object.entries(PAGE_KEYS)) {
    const rule = spec.writeWhen;
    if (rule === undefined || !Object.hasOwn(next, key) || written(next as WatchPage, rule)) continue;
    if (next === page) next = { ...page };
    delete next[key];
  }
  return next as WatchPage;
}

function byId(list: unknown): Map<string, JsonObject> {
  const out = new Map<string, JsonObject>();
  if (!Array.isArray(list)) return out;
  for (const item of list) if (isJsonObject(item) && typeof item.id === "string") out.set(item.id, item);
  return out;
}

const gradientOn = (page: JsonObject) => page.useGradientColors === true;

/** One merged page made whole again (see `settleMergedWatchPages`). */
function settlePage(merged: WatchPage, base: JsonObject | undefined, local: JsonObject | undefined, server: JsonObject | undefined): WatchPage {
  if (base === undefined || local === undefined || server === undefined) return merged;
  let out = merged;
  const themed = watchPageTheme(local as WatchPage) !== watchPageTheme(base as WatchPage);
  if (themed) {
    // A tile or a key that kept the server's value missed the panel's remap.
    const theme = watchPageTheme(out);
    const localTiles = byId(local.items);
    const baseTiles = byId(base.items);
    out = mapTiles(out, (tile) => {
      const mine = typeof tile.id === "string" ? localTiles.get(tile.id) : undefined;
      if (mine === undefined) return remapTileColors(tile, theme);
      const before = (typeof tile.id === "string" ? baseTiles.get(tile.id) : undefined) ?? {};
      return remapTileColors(tile, theme, (key) => sameWatchPagesJson(mine[key], before[key]));
    });
    if (typeof out.backgroundColor === "string" && sameWatchPagesJson(local.backgroundColor, base.backgroundColor)) {
      out = withValues(out, { backgroundColor: remapped(out.backgroundColor, theme) });
    }
  }
  const on = gradientOn(out);
  const switched = gradientOn(local) !== gradientOn(base) || gradientOn(server) !== gradientOn(base);
  if (themed && on) out = mapTileColors(out, (c) => watchGradientOf(primaryHex(c)));
  else if (switched) out = mapTileColors(out, (c) => (on ? watchGradientOf(c) : watchSolidVersion(c)));
  return out;
}

/**
 * A merged document made whole, for the draft's rebase after
 * `mergeWatchPages`, which merges key by key and so can leave a page mixed.
 * For each page both sides kept:
 *
 * - The panel changed the theme: every tile color the server's side gave
 *   (a tile the panel did not have, or a key the panel left as it was) is
 *   remapped to the page's theme as the theme change does, the page's
 *   background color likewise; and with gradient colors on, every tile color
 *   is written again in the gradient form, as the phone's theme change does.
 * - Either side moved the Solid or Gradient switch: every tile's `color` and
 *   `animationColor` in the page's form, as the switch writes them. Both are
 *   no change on a page already in that form.
 *
 * Then every page loses the keys the phone's codec would not write
 * (`dropUnwrittenPageKeys`). Objects that do not change stay the same.
 */
export function settleMergedWatchPages(
  base: WatchPagesDocument | null | undefined,
  local: WatchPagesDocument,
  server: WatchPagesDocument,
  merged: WatchPagesDocument,
): WatchPagesDocument {
  const list = merged.pages;
  if (!Array.isArray(list)) return merged;
  const basePages = byId(base?.pages);
  const localPages = byId(local.pages);
  const serverPages = byId(server.pages);
  let pages: unknown[] | undefined;
  list.forEach((page, i) => {
    if (!isJsonObject(page)) return;
    const id = typeof page.id === "string" ? page.id : "";
    const next = dropUnwrittenPageKeys(settlePage(page as WatchPage, basePages.get(id), localPages.get(id), serverPages.get(id)));
    if (next === page) return;
    pages ??= list.slice();
    pages[i] = next;
  });
  return pages === undefined ? merged : { ...merged, pages };
}

// ── readers ──────────────────────────────────────────────────────────────

/** What the Page task shows, as the phone decodes the page. */
export interface WatchPageSettings {
  theme: string;
  gradient: boolean;
  decoration: WatchPageDecoration;
  hasImage: boolean;
  /** Absent means the theme's own background. */
  backgroundColor: string | undefined;
  brightness: number;
  pattern: string;
  patternOpacity: number;
  patternScale: number;
  patternColor: string;
  overlay: string;
  overlaySpeed: number;
  overlayIntensity: number;
  overlaySize: number;
  overlayColor: string;
  titleStyle: string;
  titleSize: string;
  /** Absent means the theme's title color. */
  titleColor: string | undefined;
  titleIcon: string;
  fullScreen: boolean;
  /** The page in the page switcher. Each absent means the automatic one:
   * an icon from the page's first tile, a color by the page's place, the
   * page's own name, and text. */
  switcherIcon: string | undefined;
  switcherColor: string | undefined;
  switcherText: string | undefined;
  switcherDisplayMode: string | undefined;
  hideFromSwitcher: boolean;
}

export function watchPageSettings(page: WatchPage): WatchPageSettings {
  const n = (key: string) => pageNumber(page, key) ?? 0;
  const s = (key: string) => pageString(page, key) ?? "";
  return {
    theme: watchPageTheme(page),
    gradient: page.useGradientColors === true,
    decoration: watchPageDecoration(page),
    hasImage: hasImage(page),
    backgroundColor: typeof page.backgroundColor === "string" ? page.backgroundColor : undefined,
    brightness: n("backgroundBrightness"),
    pattern: s("backgroundPattern"),
    patternOpacity: n("backgroundPatternOpacity"),
    patternScale: n("backgroundPatternScale"),
    patternColor: s("backgroundPatternColor"),
    overlay: s("backgroundOverlay"),
    overlaySpeed: n("backgroundOverlaySpeed"),
    overlayIntensity: n("backgroundOverlayIntensity"),
    overlaySize: n("backgroundOverlaySize"),
    overlayColor: s("backgroundOverlayColor"),
    titleStyle: s("pageTitleDisplayStyle"),
    titleSize: s("pageTitleTextSize"),
    titleColor: typeof page.pageTitleTextColor === "string" ? page.pageTitleTextColor : undefined,
    titleIcon: s("pageTitleIcon"),
    fullScreen: page.fullScreen === true,
    switcherIcon: typeof page.switcherIcon === "string" && page.switcherIcon !== "" ? page.switcherIcon : undefined,
    switcherColor: typeof page.switcherColor === "string" ? page.switcherColor : undefined,
    switcherText: typeof page.switcherText === "string" ? page.switcherText : undefined,
    switcherDisplayMode: typeof page.switcherDisplayMode === "string" ? page.switcherDisplayMode : undefined,
    hideFromSwitcher: page.hideFromSwitcher === true,
  };
}

/** Whether `read` gives the page something other than it gives the same
 * page with `keys` removed: a changed dot's measure. The iPhone app stores
 * most keys at their defaults (`hideFromSwitcher: false`, the theme it would
 * fall back to), so a key merely being there says nothing. */
export function watchPageReadsOtherThanDefault(page: WatchPage, keys: readonly string[], read: (page: WatchPage) => unknown): boolean {
  if (!keys.some((key) => Object.hasOwn(page, key))) return false;
  const bare: Record<string, unknown> = { ...page };
  for (const key of keys) delete bare[key];
  return JSON.stringify(read(page)) !== JSON.stringify(read(bare as WatchPage));
}
