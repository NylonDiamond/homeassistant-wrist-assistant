// The selected page's styling, as the inspector's section cards when no tile
// is selected (`sectionCard`, editor-chrome.ts): the theme strip with its
// role colors and the Solid or Gradient switch, the background decoration
// (one at a time, as the phone's Page task), the page title, the page
// switcher, and Reset (part 3d). The editor's own Page card (its switches)
// folds and is marked the same way, through `renderPageSection`.
//
// `<wa-page-editor>` calls `renderPageSettings` from its inspector. The
// fields are the tile settings' own (`tile-settings.ts`), under a scope of
// the page so their typed text and refusals never mix with a tile's. Every
// edit goes through the setters of `page-settings-model.ts` and reads the
// document at the moment it commits.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3d build contract").

import { css, html, nothing, type TemplateResult } from "lit";
import { checkField, colorField, segField, sliderField, symbolField, symbolNameSet, textField } from "../editors.js";
import { sectionCard } from "../editor-chrome.js";
import { SECTION_COLOR } from "../kinds.js";
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, type WatchPagesEditorHost, extendHost } from "./editor-host.js";
import { type FoldId, sectionOpen, setSectionOpen } from "./fold-memory.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, isHiddenWatchPage } from "./model.js";
import {
  type WatchPageDecoration,
  type WatchPageDecorationMemory,
  WATCH_PAGE_SWITCHER_MODES,
  resetWatchPage,
  setWatchPageHideFromSwitcher,
  setWatchPageSwitcherColor,
  setWatchPageSwitcherDisplayMode,
  setWatchPageSwitcherIcon,
  setWatchPageSwitcherText,
  selectWatchPageDecoration,
  setWatchPageBackgroundColor,
  setWatchPageColorMode,
  setWatchPageBrightness,
  setWatchPageGradientColors,
  setWatchPageOverlay,
  setWatchPageOverlayColor,
  setWatchPageOverlayIntensity,
  setWatchPageOverlaySize,
  setWatchPageOverlaySpeed,
  setWatchPagePattern,
  setWatchPagePatternColor,
  setWatchPagePatternOpacity,
  setWatchPagePatternScale,
  setWatchPageTheme,
  setWatchPageTitleColor,
  setWatchPageTitleIcon,
  setWatchPageTitleSize,
  setWatchPageTitleStyle,
  watchPageDecoration,
  watchPageDecorationMemory,
  watchPageModified,
  watchPageSettings,
  watchPageSwatchTheme,
  watchPageThemes,
} from "./page-settings-model.js";
import { commit, dropStaleTyping, linkButton, stylingEnumField, swatchRow, typed, typingField } from "./tile-settings.js";
import {
  type WatchSectionBadge,
  sameWatchColor,
  watchColorEnds,
  watchColorModeChoice,
  watchColorRefusal,
  watchCustomBoxColor,
} from "./tile-settings-options.js";
import { watchStorageIconName } from "./tile-settings-model.js";
import { watchGradientOf, watchThemeDisplayName } from "./tile-new.js";
import { watchPageRoleSwatches, watchPatternSwatches, watchStylingReset, watchStylingSlider, watchStylingTheme, watchTitleSwatches } from "./tile-styling.js";

const KEY = "page-settings";

type Section = "theme" | "background" | "title" | "switcher";

/** The page's own cards in the inspector with no tile selected, in the
 * order drawn: the page editor's Page card (its switches and facts), then
 * this module's. */
export type WatchPageInspectorSection = "page" | Section;

const SECTION_TITLES: Readonly<Record<WatchPageInspectorSection, string>> = {
  page: "Page",
  theme: "Theme",
  background: "Background",
  title: "Page title",
  switcher: "In the page switcher",
};

/** Each page card's badge, in the complication editor's colors: the page's
 * switches and how it shows in the switcher are Content, its theme and
 * background are Look, its title is Extras (teal). */
export const WATCH_PAGE_SECTION_BADGES: Readonly<Record<WatchPageInspectorSection, WatchSectionBadge>> = {
  page: { color: SECTION_COLOR.content, icon: "content" },
  theme: { color: SECTION_COLOR.look, icon: "look" },
  background: { color: SECTION_COLOR.look, icon: "shape" },
  title: { color: SECTION_COLOR.numbers, icon: "text" },
  switcher: { color: SECTION_COLOR.content, icon: "watch" },
};

/** The breadcrumb chip's color for the page itself, the complication's in
 * the complication editor. */
export const WATCH_PAGE_CHIP_COLOR = SECTION_COLOR.complication;

/** The keys of the page's switcher card. */
const SWITCHER_KEYS = ["switcherIcon", "switcherColor", "switcherText", "switcherDisplayMode", "hideFromSwitcher"] as const;

/** The background keys Reset Page writes or removes, the image's aside (the
 * phone sets those). */
const IMAGE_KEY = /^backgroundImage/;

/** Whether `read` gives the page something other than it gives the same
 * page with `keys` removed. The iPhone app stores most keys at their
 * defaults (`hideFromSwitcher: false`, the theme it would fall back to), so
 * a key merely being there says nothing. */
function readsOtherThanDefault(page: WatchPage, keys: readonly string[], read: (page: WatchPage) => unknown): boolean {
  if (!keys.some((key) => Object.hasOwn(page, key))) return false;
  const bare: Record<string, unknown> = { ...page };
  for (const key of keys) delete bare[key];
  return JSON.stringify(read(page)) !== JSON.stringify(read(bare as WatchPage));
}

/**
 * Whether a page card holds a value of the page's own, which the card marks
 * with the changed dot: Page while the page is hidden on the watch; Theme
 * and the switcher while one of their keys reads other than its absence
 * would (a theme other than the watch's fallback, gradient colors on, a
 * switcher name, icon, color, mode or hiding); Background and Page title
 * while Reset Page would change one of their keys, as its own Reset is
 * shown for (an absent background brightness reads 0 where the phone's
 * default is 0.6, so absence is no measure there).
 */
export function watchPageSectionChanged(page: WatchPage, section: WatchPageInspectorSection): boolean {
  const resetChanges = (prefix: string): boolean =>
    Object.entries(watchStylingReset("page")).some(([key, value]) => {
      if (!key.startsWith(prefix) || IMAGE_KEY.test(key) || !Object.hasOwn(page, key)) return false;
      return value === null || JSON.stringify(page[key]) !== JSON.stringify(value);
    });
  switch (section) {
    case "page":
      return isHiddenWatchPage(page);
    case "theme":
      return readsOtherThanDefault(page, ["themeOverride", "useGradientColors"], (p) => {
        const s = watchPageSettings(p);
        return [s.theme, s.gradient];
      });
    case "background":
      return resetChanges("background");
    case "title":
      return resetChanges("pageTitle");
    case "switcher":
      return readsOtherThanDefault(page, SWITCHER_KEYS, (p) => {
        const s = watchPageSettings(p);
        return [s.switcherIcon, s.switcherColor, s.switcherText, s.switcherDisplayMode ?? "text", s.hideFromSwitcher];
      });
  }
}

/** The folds the inspector's Collapse all turns with no tile selected:
 * the Page card and this module's. */
export function pageSettingsFoldIds(): FoldId[] {
  return (["page", "theme", "background", "title", "switcher"] as const).map((section) => ({ module: KEY, section }));
}

/** One page card through the shared section card; its body drawn only
 * while open. */
function pageCard(host: WatchPagesEditorHost, section: WatchPageInspectorSection, summary: string, body: () => TemplateResult): TemplateResult {
  const open = isOpen(host, section);
  const badge = WATCH_PAGE_SECTION_BADGES[section];
  return sectionCard({
    color: badge.color,
    icon: uiIcon(badge.icon),
    title: SECTION_TITLES[section],
    open,
    onToggle: () => toggle(host, section),
    ...(open || summary === "" ? {} : { summary }),
    dot: watchPageSectionChanged(host.page, section),
    id: `${KEY}:${section}`,
  }, open ? body() : html``);
}

/**
 * The Page card: the page editor's rows for the page itself (Hidden on the
 * watch, the Smart Page switch, the tile and row count) in the shared card,
 * folding as this module's do. `summary` is what it says while folded.
 */
export function renderPageSection(host: WatchPagesEditorHost, summary: string, body: TemplateResult): TemplateResult {
  return pageCard(host, "page", summary, () => html`<div class="ps-page-b">${body}</div>`);
}

/** The decorations a person can pick here, in the phone's order. Image is
 * set on the phone only. */
const DECORATION_CHOICES: readonly [WatchPageDecoration, string][] = [
  ["none", "None"],
  ["color", "Color"],
  ["pattern", "Pattern"],
  ["animation", "Animation"],
];

const NO_TILE: WatchPageTile = Object.freeze({}) as WatchPageTile;

/** The host the shared fields take: the page stands in for the tile, so
 * every key of a field is the page's own. */
function scoped(host: WatchPagesEditorHost): TileSettingsHost {
  return extendHost(host, { tileId: () => `page-${host.pageId}`, tile: () => NO_TILE });
}

/** Open unless folded, this visit or an earlier one (`fold-memory.ts`). */
function isOpen(host: WatchPagesEditorHost, section: WatchPageInspectorSection): boolean {
  return sectionOpen(host.uiState, KEY, section);
}

function toggle(host: WatchPagesEditorHost, section: WatchPageInspectorSection): void {
  setSectionOpen(host.uiState, KEY, section, !isOpen(host, section));
  host.requestUpdate();
}

/** The page's styling cards for `host.page`: Theme, Background, Page title
 * and In the page switcher, then Reset page while it would change
 * something. */
export function renderPageSettings(host: WatchPagesEditorHost): TemplateResult {
  const sh = scoped(host);
  dropStaleTyping(sh);
  const sections: Section[] = ["theme", "background", "title", "switcher"];
  return html`<div class="ts-root ps-root">
    ${sections.map((section) => pageCard(host, section, summary(host, section),
      () => html`<fieldset class="ts-body" id=${`ps-body-${section}`} ?disabled=${host.busy} aria-label=${SECTION_TITLES[section]}>${body(sh, section)}</fieldset>`))}
    ${watchPageModified(host.document, host.pageId)
      ? html`<div class="ps-reset">${linkButton("Reset page", "The background and title back as the iPhone app's reset puts them. The theme stays.", () =>
          commit(sh, "reset", (d) => resetWatchPage(d, host.pageId, { keepImage: true })))}</div>`
      : nothing}
  </div>`;
}

function summary(host: WatchPagesEditorHost, section: Section): string {
  const s = watchPageSettings(host.page);
  switch (section) {
    case "theme":
      return `${watchThemeDisplayName(s.theme)}${s.gradient ? ", gradient" : ""}`;
    case "background":
      return DECORATION_CHOICES.find(([d]) => d === s.decoration)?.[1] ?? (s.decoration === "image" ? "Image" : "");
    case "title":
      return s.titleStyle === "none" ? "Hidden" : s.titleStyle;
    case "switcher":
      return s.hideFromSwitcher ? "Hidden" : s.switcherText ?? (s.switcherDisplayMode === "icon" ? "Icon" : "Shown");
  }
}

function body(sh: TileSettingsHost, section: Section): TemplateResult {
  switch (section) {
    case "theme":
      return renderTheme(sh);
    case "background":
      return renderBackground(sh);
    case "title":
      return renderTitle(sh);
    case "switcher":
      return renderSwitcher(sh);
  }
}

// ── theme ────────────────────────────────────────────────────────────────

function renderTheme(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  const roles = watchStylingTheme(s.theme)?.roles ?? {};
  return html`
    <div class="ps-themes" role="radiogroup" aria-label="Page theme">
      ${watchPageThemes().map((theme) => {
        const on = theme === s.theme;
        const r = watchStylingTheme(theme)?.roles ?? {};
        const swatches = watchPageRoleSwatches();
        const a = r[swatches[0]?.role ?? ""] ?? "#888888";
        const b = r[swatches[4]?.role ?? ""] ?? a;
        const ground = watchStylingTheme(theme)?.pageDefaultBackground ?? "#000000";
        const name = watchThemeDisplayName(theme);
        return html`<button type="button" role="radio" class="ps-theme ${on ? "on" : ""}" aria-checked=${on ? "true" : "false"} title=${name} aria-label=${name}
          style=${`--ps-a:${a};--ps-b:${b};--ps-g:${ground}`}
          @click=${() => commit(sh, "theme", (d) => setWatchPageTheme(d, sh.pageId, theme))}></button>`;
      })}
    </div>
    <div class="ps-theme-name">${watchThemeDisplayName(s.theme)}</div>
    <div class="ps-roles" aria-label="The theme's colors">
      ${watchPageRoleSwatches().map(({ role, label }) => html`<span class="ps-role" title=${`${label}: ${roles[role] ?? ""}`}>
        <span class="ps-role-sw" style=${`background:${roles[role] ?? "transparent"}`}></span><span>${label}</span></span>`)}
    </div>
    ${segField("Colors", s.gradient ? "gradient" : "solid", [["solid", "Solid"], ["gradient", "Gradient"]] as ["solid" | "gradient", string][], (v) =>
      commit(sh, "gradient", (d) => setWatchPageGradientColors(d, sh.pageId, v === "gradient")))}
    <div class="hint ts-under">A theme change recolors the tiles in theme colors, as the iPhone app does. Gradient rewrites every tile's color.</div>`;
}

// ── background ───────────────────────────────────────────────────────────

interface ShownDecoration {
  segment: WatchPageDecoration;
  /** The page's own decoration when the segment was picked: once the page
   * says otherwise (an undo, a merge), the pick no longer holds. */
  derived: WatchPageDecoration;
}

function shownDecoration(sh: TileSettingsHost): WatchPageDecoration {
  const derived = watchPageDecoration(sh.page);
  const stored = sh.uiState.get(`${KEY}:segment:${sh.pageId.toUpperCase()}`) as ShownDecoration | undefined;
  return stored !== undefined && stored.derived === derived ? stored.segment : derived;
}

function pickDecoration(sh: TileSettingsHost, to: WatchPageDecoration): void {
  const memoryKey = `${KEY}:memory:${sh.pageId.toUpperCase()}`;
  const segmentKey = `${KEY}:segment:${sh.pageId.toUpperCase()}`;
  const from = shownDecoration(sh);
  if (from === to) return;
  const kept = sh.uiState.get(memoryKey) as WatchPageDecorationMemory | undefined;
  let memory = kept ?? watchPageDecorationMemory(sh.page);
  commit(sh, "decoration", (d) => {
    const result = selectWatchPageDecoration(d, sh.pageId, to, { from, memory });
    memory = result.memory ?? memory;
    return result.document;
  });
  sh.uiState.set(memoryKey, memory);
  // The page's own decoration after the edit, read live.
  sh.uiState.set(segmentKey, { segment: to, derived: watchPageDecoration(sh.page) } satisfies ShownDecoration);
  sh.requestUpdate();
}

/** What a Page task palette needs: its color, read when an edit is made
 * (two edits in one task must not start from the color drawn), its swatches
 * and its setter. */
export interface PagePaletteSource {
  color: () => string | undefined;
  swatches: readonly string[];
  write: (document: WatchPagesDocument, value: string) => WatchPagesDocument;
  /** The palette's key, whose stored color the Solid or Gradient circle
   * rewrites; without one the circle writes the color in the other form
   * itself. */
  modeKey?: "backgroundColor" | "pageTitleTextColor";
}

/**
 * The edits of a Page task palette, each reading the color when it is made.
 * `gradient()` is whether the swatches show their gradient form. Solid or
 * Gradient rewrites a stored color in that form; with none stored it only
 * turns the swatches, and so it does on the background's OLED black, which
 * the phone leaves black while the swatches turn. On a rainbow it writes the
 * first swatch in that form.
 */
export function pagePaletteActions(sh: TileSettingsHost, setting: string, source: PagePaletteSource) {
  const formKey = `${KEY}:form:${sh.pageId.toUpperCase()}:${setting}`;
  /** The stored color's form, or none when it has no form of its own. */
  const storedForm = (color: string | undefined): "solid" | "gradient" | "rainbow" | "none" => {
    if (source.modeKey === "backgroundColor" && sameWatchColor(color, "#000000")) return "none";
    return watchColorModeChoice(color);
  };
  const gradient = (): boolean => {
    const stored = storedForm(source.color());
    if (stored === "gradient") return true;
    if (stored === "solid") return false;
    const chosen = sh.uiState.get(formKey);
    return chosen === "gradient" || (chosen === undefined && watchPageSettings(sh.page).gradient);
  };
  const write = (value: string, typing = false) => commit(sh, setting, (d) => source.write(d, value), { typing });
  const pickMode = (next: "solid" | "gradient" | "rainbow"): void => {
    if (next === "rainbow") return write("#RAINBOW");
    sh.uiState.set(formKey, next);
    const now = source.color();
    const stored = storedForm(now);
    if (stored === "rainbow") {
      const first = source.swatches[0];
      if (first !== undefined) write(next === "gradient" ? watchGradientOf(first) : first);
    } else if ((stored === "solid" || stored === "gradient") && stored !== next && now !== undefined) {
      commit(sh, setting, (d) => (source.modeKey !== undefined
        ? setWatchPageColorMode(d, sh.pageId, source.modeKey, next)
        : source.write(d, next === "gradient" ? watchGradientOf(now) : (watchColorEnds(now)?.from ?? now))));
    }
    sh.requestUpdate();
  };
  const custom = (value: string | undefined): void => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(sh, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(gradient() ? watchGradientOf(value) : value, true);
  };
  const shown = (): "solid" | "gradient" | "rainbow" => (storedForm(source.color()) === "rainbow" ? "rainbow" : gradient() ? "gradient" : "solid");
  return { gradient, shown, pickMode, custom, swatch: (value: string) => write(value) };
}

/**
 * A color of the Page task: Solid or Gradient, the given swatches in that
 * form, a custom color, and Rainbow where the phone offers it.
 */
function pagePalette(sh: TileSettingsHost, setting: string, opts: PagePaletteSource & { label: string; rainbow?: boolean }): TemplateResult {
  const act = pagePaletteActions(sh, setting, opts);
  const color = opts.color();
  const swatches = act.gradient() ? opts.swatches.map((h) => watchGradientOf(h)) : [...opts.swatches];
  const modes: ["solid" | "gradient" | "rainbow", string][] = [["solid", "Solid"], ["gradient", "Gradient"]];
  if (opts.rainbow) modes.push(["rainbow", "Rainbow"]);
  return html`
    <div class="ts-sub-h"><span>${opts.label}</span></div>
    ${segField("Form", act.shown(), modes, (v) => act.pickMode(v))}
    <div class="ts-swatch-row">${swatchRow(opts.label, swatches, color, act.swatch)}</div>
    ${typingField(sh, setting, html`<div class="ts-no-alpha">${colorField("Custom", typed(sh, setting) ?? watchCustomBoxColor(color), act.custom)}</div>`)}`;
}

/** A Page task slider; a drag or a run of typing is one undo step. */
function pageSlider(
  sh: TileSettingsHost,
  setting: string,
  label: string,
  sliderName: string,
  value: number,
  set: (document: WatchPagesDocument, pageId: string, value: number) => WatchPagesDocument,
  def: number,
  percent = false,
): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  return typingField(sh, setting, sliderField(label, value, (v) => commit(sh, setting, (d) => set(d, sh.pageId, v), { typing: true }), {
    min: spec.min,
    max: spec.max,
    step: spec.step,
    def,
    ...(percent ? { format: (v: number) => `${Math.round(v * 100)}%` } : {}),
  }), value);
}

function renderBackground(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  if (s.hasImage) {
    return html`<p class="hint">Image, set on the phone. The picture goes to the watch from the iPhone app, so it is changed there.</p>`;
  }
  const segment = shownDecoration(sh);
  const theme = watchStylingTheme(watchPageSwatchTheme(sh.page));
  return html`
    ${segField("Decoration", segment, DECORATION_CHOICES as [WatchPageDecoration, string][], (v) => pickDecoration(sh, v))}
    <div class="hint ts-under">One at a time, as on the iPhone. Each one keeps its settings while this page is open.</div>
    ${segment === "color" ? html`
      <div class="ts-after">
        <button type="button" class="pe-chip ${sameWatchColor(s.backgroundColor, "#000000") ? "on" : ""}"
          title="Pure black, best for the watch's battery" @click=${() => commit(sh, "bgColor", (d) => setWatchPageBackgroundColor(d, sh.pageId, "#000000"))}>OLED black</button>
      </div>
      ${pagePalette(sh, "bgColor", {
        label: "Background color",
        color: () => watchPageSettings(sh.page).backgroundColor,
        swatches: theme?.backgroundSwatchHexes ?? [],
        write: (d, v) => setWatchPageBackgroundColor(d, sh.pageId, v),
        modeKey: "backgroundColor",
      })}
      ${s.backgroundColor === undefined ? html`<div class="hint ts-under">None set: the theme's own background.</div>` : nothing}
      ${pageSlider(sh, "brightness", "Brightness", "backgroundBrightness", s.brightness, setWatchPageBrightness, 0.6, true)}` : nothing}
    ${segment === "pattern" ? html`
      ${stylingEnumField("Pattern", "backgroundPattern", s.pattern, (v) => commit(sh, "pattern", (d) => setWatchPagePattern(d, sh.pageId, v)))}
      ${s.pattern === "none" ? nothing : html`
        ${pageSlider(sh, "patternOpacity", "Opacity", "backgroundPatternOpacity", s.patternOpacity, setWatchPagePatternOpacity, 0.5, true)}
        ${pageSlider(sh, "patternScale", "Size", "backgroundPatternScale", s.patternScale, setWatchPagePatternScale, 1)}
        ${pagePalette(sh, "patternColor", {
          label: "Pattern color",
          color: () => watchPageSettings(sh.page).patternColor,
          swatches: watchPatternSwatches(),
          write: (d, v) => setWatchPagePatternColor(d, sh.pageId, v),
        })}`}` : nothing}
    ${segment === "animation" ? html`
      ${stylingEnumField("Animation", "backgroundOverlay", s.overlay, (v) => commit(sh, "overlay", (d) => setWatchPageOverlay(d, sh.pageId, v)))}
      ${s.overlay === "none" ? nothing : html`
        ${pageSlider(sh, "overlaySpeed", "Speed", "backgroundOverlaySpeed", s.overlaySpeed, setWatchPageOverlaySpeed, 1)}
        ${pageSlider(sh, "overlayIntensity", "Intensity", "backgroundOverlayIntensity", s.overlayIntensity, setWatchPageOverlayIntensity, 0.5)}
        ${pageSlider(sh, "overlaySize", "Size", "backgroundOverlaySize", s.overlaySize, setWatchPageOverlaySize, 1)}
        ${pagePalette(sh, "overlayColor", {
          label: "Animation color",
          color: () => watchPageSettings(sh.page).overlayColor,
          swatches: watchPatternSwatches(),
          rainbow: true,
          write: (d, v) => setWatchPageOverlayColor(d, sh.pageId, v),
        })}`}` : nothing}`;
}

// ── page title ───────────────────────────────────────────────────────────

/** The title color swatches: the fixed ones, then the first of the theme's
 * background swatches, each once (the table's `pageTitleSwatches`). */
export function watchPageTitleSwatches(theme: string): string[] {
  return watchStylingTheme(theme)?.pageTitleSwatches ?? watchTitleSwatches();
}

function renderTitle(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  const setIcon = (name: string) => {
    const trimmed = name.trim();
    const names = sh.icons.names();
    const known = names === undefined ? undefined : symbolNameSet(names);
    const value = trimmed === "" ? "" : watchStorageIconName(trimmed, (symbol) => known?.has(symbol) === true);
    commit(sh, "titleIcon", (d) => setWatchPageTitleIcon(d, sh.pageId, value), { typing: true });
  };
  return html`
    ${stylingEnumField("Display", "pageTitleDisplayStyle", s.titleStyle, (v) => commit(sh, "titleStyle", (d) => setWatchPageTitleStyle(d, sh.pageId, v)))}
    ${s.titleStyle === "none" ? html`<div class="hint ts-under">The page's name above its tiles, hidden while this is None.</div>` : html`
      ${stylingEnumField("Size", "pageTitleTextSize", s.titleSize, (v) => commit(sh, "titleSize", (d) => setWatchPageTitleSize(d, sh.pageId, v)))}
      <div class="ts-chips" role="group" aria-label="Title icon">
        <button type="button" class="pe-chip ${s.titleIcon === "" ? "on" : ""}" aria-pressed=${s.titleIcon === "" ? "true" : "false"}
          @click=${() => commit(sh, "titleIcon", (d) => setWatchPageTitleIcon(d, sh.pageId, ""))}>No icon</button>
      </div>
      ${typingField(sh, "titleIcon", symbolField({ icons: sh.icons, symbols: sh.symbols }, typed(sh, "titleIcon") ?? s.titleIcon, setIcon, "pe:ps:title-icon", undefined, "Icon", false))}
      ${pagePalette(sh, "titleColor", {
        label: "Text color",
        color: () => watchPageSettings(sh.page).titleColor,
        swatches: watchPageTitleSwatches(watchPageSwatchTheme(sh.page)),
        write: (d, v) => setWatchPageTitleColor(d, sh.pageId, v),
        modeKey: "pageTitleTextColor",
      })}
      ${s.titleColor === undefined ? html`<div class="hint ts-under">None set: the theme's title color.</div>` : nothing}
      ${s.fullScreen ? html`<div class="hint warn">Full screen is on (set on the iPhone): the watch hides the title.</div>` : nothing}`}`;
}

// ── the page switcher ────────────────────────────────────────────────────

/** How the page shows in the watch's page switcher: hidden or not, as text
 * or an icon, its name, icon and color there. Each left empty is chosen by
 * the watch, as on the iPhone. The switcher's own look is in the menu
 * editor. */
function renderSwitcher(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  const mode = s.switcherDisplayMode ?? "text";
  const modes = WATCH_PAGE_SWITCHER_MODES.map((m) => [m, m === "icon" ? "Icon" : "Name"] as [string, string]);
  const name = typeof sh.page.name === "string" ? sh.page.name : "";
  const setIcon = (value: string) => commit(sh, "switcherIcon", (d) => setWatchPageSwitcherIcon(d, sh.pageId, value), { typing: true });
  const setColor = (value: string | undefined) => commit(sh, "switcherColor", (d) => setWatchPageSwitcherColor(d, sh.pageId, value), { typing: true });
  return html`
    ${checkField("Hidden", s.hideFromSwitcher, (v) => commit(sh, "hideFromSwitcher", (d) => setWatchPageHideFromSwitcher(d, sh.pageId, v)), false)}
    ${s.hideFromSwitcher ? html`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>` : nothing}
    ${segField("Show as", modes.some(([m]) => m === mode) ? mode : "text", modes, (v) =>
      commit(sh, "switcherDisplayMode", (d) => setWatchPageSwitcherDisplayMode(d, sh.pageId, v)))}
    ${typingField(sh, "switcherText", textField("Name", typed(sh, "switcherText") ?? s.switcherText ?? "", (v) =>
      commit(sh, "switcherText", (d) => setWatchPageSwitcherText(d, sh.pageId, v), { typing: true }), { placeholder: name }))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${s.switcherIcon === undefined ? "on" : ""}" aria-pressed=${s.switcherIcon === undefined ? "true" : "false"}
        title="The watch picks one from the page's first tile" @click=${() => commit(sh, "switcherIcon", (d) => setWatchPageSwitcherIcon(d, sh.pageId, ""))}>Automatic icon</button>
    </div>
    ${typingField(sh, "switcherIcon", symbolField({ icons: sh.icons, symbols: sh.symbols }, typed(sh, "switcherIcon") ?? s.switcherIcon ?? "", setIcon, "pe:ps:switcher-icon", undefined, "Icon", false))}
    ${typingField(sh, "switcherColor", html`<div class="ts-no-alpha">${colorField("Color", typed(sh, "switcherColor") ?? s.switcherColor, setColor, true, null, { switchOn: s.switcherColor !== undefined })}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself. The switcher's own look is under Menus.</div>`;
}

/** This module's rules, after the tile settings' in the page editor's
 * sheet. */
export const pageSettingsStyles = css`
  /* The Page card's rows: switches and facts, left aligned. */
  .ps-page-b { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 4px 0 2px; }
  /* The row under the last card: Delete page. */
  .ps-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .ps-themes { display: flex; flex-wrap: wrap; gap: 8px; padding: 6px 0 2px; }
  .ps-theme {
    width: 28px; height: 28px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
    background: radial-gradient(circle at 50% 50%, var(--ps-g) 0 34%, transparent 35%), linear-gradient(135deg, var(--ps-a), var(--ps-b));
    box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
  }
  .ps-theme:hover:not(:disabled) { transform: scale(1.08); }
  .ps-theme.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ps-theme:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .ps-theme-name { font-size: 12px; font-weight: 600; padding: 2px 0 4px; }
  .ps-roles { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px 6px; padding: 2px 0 8px; }
  .ps-role { display: flex; flex-direction: column; align-items: stretch; gap: 2px; font-size: 9.5px; color: var(--wa-muted); text-align: center; min-width: 0; }
  .ps-role-sw { height: 14px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .15); }
  .ps-reset { padding: 8px 0 0; }
`;
