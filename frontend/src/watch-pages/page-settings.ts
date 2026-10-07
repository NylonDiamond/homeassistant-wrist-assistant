// The selected page's styling, drawn in the page strip over the watch: the
// theme strip with its role colors and the Solid or Gradient switch, the
// background decoration (one at a time, as the phone's Page task), the page
// title, and Reset (part 3d). Each is one chip of the strip, and its chip
// opens a popover holding the section's body. How the page shows in the page
// switcher is set in the menu editor (`switcher-settings.ts`), beside the
// switcher's own look, as on the iPhone.
//
// `<wa-page-editor>` draws the strip itself and asks this module for each
// section's words (`pageSettingSummary`), its body (`renderPageSettingBody`)
// and Reset page (`renderPageReset`). The fields are the tile settings' own
// (`tile-settings.ts`), under a scope of the page so their typed text and
// refusals never mix with a tile's. Every edit goes through the setters of
// `page-settings-model.ts` and reads the document at the moment it commits.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3d build contract").

import { css, html, nothing, type TemplateResult } from "lit";
import { checkField, colorField, segField, sliderField, symbolField, symbolNameSet } from "../editors.js";
import { SECTION_COLOR } from "../kinds.js";
import { type TileSettingsHost, type WatchPagesEditorHost, extendHost } from "./editor-host.js";
import { type WatchPage, type WatchPageTile, type WatchPagesDocument, isHiddenWatchPage } from "./model.js";
import {
  type WatchPageDecoration,
  type WatchPageDecorationMemory,
  resetWatchPage,
  selectWatchPageDecoration,
  setWatchPageBackgroundColor,
  setWatchPageColorMode,
  setWatchPageBrightness,
  setWatchPageFullScreen,
  setWatchPageGradientColors,
  setWatchPageImage,
  setWatchPageImageBlur,
  setWatchPageImageFit,
  setWatchPageImageOpacity,
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
  watchPageReadsOtherThanDefault,
  watchPageSettings,
  watchPageSwatchTheme,
  watchPageThemes,
} from "./page-settings-model.js";
import { pagePhotoIdsInUse, samePagePhotoId } from "./page-photo.js";
import type { PagePhotoStore } from "./page-photo-store.js";
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
import {
  watchPageRoleSwatches,
  watchPatternSwatches,
  watchStylingChoices,
  watchStylingLabel,
  watchStylingReset,
  watchStylingSlider,
  watchStylingTheme,
  watchTitleSwatches,
} from "./tile-styling.js";

const KEY = "page-settings";

/** This module's sections, each a chip of the page strip. */
export type WatchPageSettingSection = "theme" | "background" | "title";

/** The page strip's chips, in the order drawn: the page editor's Page chip
 * (its switches and facts), then this module's. */
export type WatchPageStripSection = "page" | WatchPageSettingSection;

/** Each section's full name: its popover's title and its chip's tooltip. */
export const WATCH_PAGE_SECTION_TITLES: Readonly<Record<WatchPageStripSection, string>> = {
  page: "Page",
  theme: "Theme",
  background: "Background",
  title: "Page title",
};

/** Each section's chip word, short so the chips fit one row over the watch. */
export const WATCH_PAGE_CHIP_LABELS: Readonly<Record<WatchPageStripSection, string>> = {
  page: "Page",
  theme: "Theme",
  background: "Background",
  title: "Title",
};

/** Each section's badge, in the complication editor's colors: the page's
 * switches are Content, its theme and background are Look, its title is
 * Extras (teal). */
export const WATCH_PAGE_SECTION_BADGES: Readonly<Record<WatchPageStripSection, WatchSectionBadge>> = {
  page: { color: SECTION_COLOR.content, icon: "content" },
  theme: { color: SECTION_COLOR.look, icon: "look" },
  background: { color: SECTION_COLOR.look, icon: "shape" },
  title: { color: SECTION_COLOR.numbers, icon: "text" },
};

/** The breadcrumb chip's color for the page itself, the complication's in
 * the complication editor. */
export const WATCH_PAGE_CHIP_COLOR = SECTION_COLOR.complication;

/**
 * Whether a page section holds a value of the page's own, which its chip
 * marks with the changed dot: Page while the page is hidden on the watch;
 * Theme while one of its keys reads other than its absence would (a theme
 * other than the watch's fallback, gradient colors on); Background and Page
 * title
 * while Reset Page would change one of their keys, as its own Reset is
 * shown for (an absent background brightness reads 0 where the phone's
 * default is 0.6, so absence is no measure there).
 */
export function watchPageSectionChanged(page: WatchPage, section: WatchPageStripSection): boolean {
  const resetChanges = (prefix: string): boolean =>
    Object.entries(watchStylingReset("page")).some(([key, value]) => {
      if (!key.startsWith(prefix) || !Object.hasOwn(page, key)) return false;
      return value === null || JSON.stringify(page[key]) !== JSON.stringify(value);
    });
  switch (section) {
    case "page":
      return isHiddenWatchPage(page);
    case "theme":
      return watchPageReadsOtherThanDefault(page, ["themeOverride", "useGradientColors"], (p) => {
        const s = watchPageSettings(p);
        return [s.theme, s.gradient];
      });
    case "background":
      return resetChanges("background");
    case "title":
      return resetChanges("pageTitle");
  }
}

/** The decorations a person can pick here, in the phone's order. */
const DECORATION_CHOICES: readonly [WatchPageDecoration, string][] = [
  ["none", "None"],
  ["image", "Image"],
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

/**
 * One section's body for `host.page`, as its popover in the page strip
 * holds it: a fieldset that switches every control off while a save is out.
 * Typed text left over from a field no longer drawn is dropped first, as
 * every draw of the page's fields does.
 */
export function renderPageSettingBody(host: WatchPagesEditorHost, section: WatchPageSettingSection): TemplateResult {
  const sh = scoped(host);
  dropStaleTyping(sh);
  return html`<fieldset class="ts-body" id=${`ps-body-${section}`} ?disabled=${host.busy} aria-label=${WATCH_PAGE_SECTION_TITLES[section]}>${body(sh, section)}</fieldset>`;
}

/** Reset page while it would change something, else nothing: the
 * background and title back as the phone's reset puts them. */
export function renderPageReset(host: WatchPagesEditorHost): TemplateResult | typeof nothing {
  if (!watchPageModified(host.document, host.pageId)) return nothing;
  const sh = scoped(host);
  return html`<span class="ps-reset">${linkButton("Reset page", "The background and title back to their defaults, the photo removed. The theme stays.", () =>
    commit(sh, "reset", (d) => resetWatchPage(d, host.pageId)))}</span>`;
}

/** What a section is set to now, in a word or two: its chip's value. */
export function pageSettingSummary(page: WatchPage, section: WatchPageSettingSection): string {
  const s = watchPageSettings(page);
  switch (section) {
    case "theme":
      return `${watchThemeDisplayName(s.theme)}${s.gradient ? ", gradient" : ""}`;
    case "background":
      return DECORATION_CHOICES.find(([d]) => d === s.decoration)?.[1] ?? "";
    case "title":
      return s.titleStyle === "none" ? "Hidden" : watchStylingLabel("pageTitleDisplayStyle", s.titleStyle);
  }
}

/** A theme's dot (`.ps-theme`): its first and fifth role colors in a ring
 * around its page background, as the custom properties the dot reads. */
export function watchPageThemeDot(theme: string): string {
  const r = watchStylingTheme(theme)?.roles ?? {};
  const swatches = watchPageRoleSwatches();
  const a = r[swatches[0]?.role ?? ""] ?? "#888888";
  const b = r[swatches[4]?.role ?? ""] ?? a;
  const ground = watchStylingTheme(theme)?.pageDefaultBackground ?? "#000000";
  return `--ps-a:${a};--ps-b:${b};--ps-g:${ground}`;
}

function body(sh: TileSettingsHost, section: WatchPageSettingSection): TemplateResult {
  switch (section) {
    case "theme":
      return renderTheme(sh);
    case "background":
      return renderBackground(sh);
    case "title":
      return renderTitle(sh);
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
        const name = watchThemeDisplayName(theme);
        return html`<button type="button" role="radio" class="ps-theme ${on ? "on" : ""}" aria-checked=${on ? "true" : "false"} title=${name} aria-label=${name}
          style=${watchPageThemeDot(theme)}
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
    <div class="hint ts-under">A theme change recolors the tiles in theme colors. Gradient rewrites every tile's color.</div>`;
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
  percent: boolean | ((v: number) => string) = false,
): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  const format = percent === true ? (v: number) => `${Math.round(v * 100)}%` : percent === false ? undefined : percent;
  return typingField(sh, setting, sliderField(label, value, (v) => commit(sh, setting, (d) => set(d, sh.pageId, v), { typing: true }), {
    min: spec.min,
    max: spec.max,
    step: spec.step,
    def,
    ...(format === undefined ? {} : { format }),
  }), value);
}

function renderBackground(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  const segment = shownDecoration(sh);
  const theme = watchStylingTheme(watchPageSwatchTheme(sh.page));
  return html`
    ${segField("Decoration", segment, DECORATION_CHOICES as [WatchPageDecoration, string][], (v) => pickDecoration(sh, v))}
    <div class="hint ts-under">One at a time. Each one keeps its settings while this page is open.</div>
    ${segment === "image" ? renderImage(sh) : nothing}
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

// ── image ────────────────────────────────────────────────────────────────

/** Keep the Image segment shown after an edit that changes what the page's
 * own decoration reads (a photo picked or removed), as the phone's segment
 * stays where it was. */
function holdImageSegment(sh: TileSettingsHost): void {
  sh.uiState.set(`${KEY}:segment:${sh.pageId.toUpperCase()}`, { segment: "image", derived: watchPageDecoration(sh.page) } satisfies ShownDecoration);
  sh.requestUpdate();
}

function pickPhoto(sh: TileSettingsHost, id: string | undefined): void {
  commit(sh, "image", (d) => setWatchPageImage(d, sh.pageId, id));
  holdImageSegment(sh);
}

/** The id of the library photo whose delete is being asked about. */
const deleteAskKey = (sh: TileSettingsHost) => `${KEY}:photo-delete:${sh.pageId.toUpperCase()}`;

/** One photo to pick: its picture once the bytes are in, its name under
 * it, and for a library photo no page uses, a delete button. */
function photoButton(
  sh: TileSettingsHost,
  photos: PagePhotoStore,
  id: string,
  name: string,
  title: string,
  canDelete: boolean,
): TemplateResult {
  const on = samePagePhotoId(watchPageSettings(sh.page).imageId, id);
  const url = photos.url(id);
  const missing = photos.status(id) === "missing";
  return html`<span class="ps-photo-cell">
    <button type="button" role="radio" class="ps-photo ${on ? "on" : ""} ${url === undefined ? "empty" : ""}" aria-checked=${on ? "true" : "false"}
      aria-label=${name} title=${title} style=${url === undefined ? "" : `background-image:url(${JSON.stringify(url)})`}
      @click=${() => pickPhoto(sh, id)}>${missing ? html`<span class="ps-photo-gone">Missing</span>` : nothing}</button>
    <span class="ps-photo-name">${name}</span>
    ${canDelete ? html`<button type="button" class="ps-photo-del" title="Delete this photo from Home Assistant" aria-label=${`Delete ${name}`}
      ?disabled=${photos.deleting} @click=${() => { sh.uiState.set(deleteAskKey(sh), id); sh.requestUpdate(); }}>×</button>` : nothing}
  </span>`;
}

function addedWords(at: string): string {
  const date = new Date(at);
  return Number.isNaN(date.getTime()) ? "Your photo" : `Added ${date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
}

async function uploadPhoto(sh: TileSettingsHost, photos: PagePhotoStore, input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0];
  input.value = "";
  if (file === undefined) return;
  const id = await photos.upload(file);
  if (id !== undefined) pickPhoto(sh, id);
}

/**
 * The Image decoration: the built-in photos in the phone's order, then
 * "Your photos" (the library, newest first, a delete button on each photo
 * no page uses), then "Upload a photo". With a photo set: Opacity, Blur, Fit
 * and Remove, with the phone's ranges and defaults; a photo the store does
 * not have says so and can still be removed.
 */
function renderImage(sh: TileSettingsHost): TemplateResult {
  const s = watchPageSettings(sh.page);
  const photos = sh.photos;
  photos?.ensureList();
  const list = photos?.list;
  const inUse = pagePhotoIdsInUse(sh.document.pages);
  const asked = sh.uiState.get(deleteAskKey(sh)) as string | undefined;
  const askedImage = asked === undefined ? undefined : list?.images.find((image) => samePagePhotoId(image.id, asked));
  const missing = s.imageId !== undefined && photos?.status(s.imageId) === "missing";
  const fits = watchStylingChoices("backgroundImageFit").map((c) => [c.value, c.label] as [string, string]);
  const blurText = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
  return html`
    ${photos === undefined || photos.listState === "none" ? html`<p class="hint warn">Photos need a newer version of the integration. A photo set before still shows here.</p>` : nothing}
    ${photos?.listState === "failed" ? html`<p class="hint warn">Home Assistant did not list its photos. ${linkButton("Try again", "Read the photo list again", () => void photos.refreshList())}</p>` : nothing}
    ${photos?.listState === "loading" ? html`<p class="hint">Loading photos...</p>` : nothing}
    ${photos !== undefined && list !== undefined ? html`
      <div class="ts-sub-h"><span>Built-in</span></div>
      <div class="ps-photos" role="radiogroup" aria-label="Built-in photos">
        ${list.presets.map((p) => photoButton(sh, photos, p.id, p.name, p.name, false))}
      </div>
      <div class="ts-sub-h"><span>Your photos</span></div>
      ${list.images.length === 0 ? html`<div class="hint ts-under">None yet.</div>` : html`
        <div class="ps-photos" role="radiogroup" aria-label="Your photos">
          ${list.images.map((image) => photoButton(sh, photos, image.id, "Photo", addedWords(image.added_at),
            image.used_by.length === 0 && !inUse.has(image.id.toUpperCase())))}
        </div>`}
      ${askedImage !== undefined ? html`<div class="ps-ask" role="alert">
        <span>Delete this photo from Home Assistant? This cannot be undone.</span>
        <button type="button" class="small danger" ?disabled=${photos.deleting} @click=${async () => {
          if (await photos.remove(askedImage.id)) sh.uiState.delete(deleteAskKey(sh));
          sh.requestUpdate();
        }}>Delete</button>
        <button type="button" class="small" @click=${() => { sh.uiState.delete(deleteAskKey(sh)); sh.requestUpdate(); }}>Keep</button>
      </div>` : nothing}
      <div class="ts-after">
        <label class="pe-chip ps-upload ${photos.uploading || sh.busy ? "off" : ""}" title="A JPEG, PNG or other picture this browser can open. It is made watch size first.">
          <input type="file" accept="image/*" ?disabled=${photos.uploading || sh.busy}
            @change=${(e: Event) => void uploadPhoto(sh, photos, e.target as HTMLInputElement)} />${photos.uploading ? "Uploading..." : "Upload a photo"}
        </label>
      </div>` : nothing}
    ${photos?.error !== undefined ? html`<p class="hint warn">${photos.error}</p>` : nothing}
    ${s.imageId === undefined ? (list !== undefined ? html`<div class="hint ts-under">No photo yet: pick one.</div>` : nothing) : html`
      ${missing ? html`<p class="hint warn">Photo missing. Home Assistant does not have it, so the watch shows none. Pick another or remove it.</p>` : nothing}
      ${pageSlider(sh, "imageOpacity", "Opacity", "backgroundImageOpacity", s.imageOpacity, setWatchPageImageOpacity, 1, true)}
      ${pageSlider(sh, "imageBlur", "Blur", "backgroundImageBlur", s.imageBlur, setWatchPageImageBlur, 0, blurText)}
      ${segField("Fit", s.imageFit, fits, (v) => commit(sh, "imageFit", (d) => setWatchPageImageFit(d, sh.pageId, v)))}
      <div class="ts-after">
        <button type="button" class="pe-chip" title="Take the photo off this page" @click=${() => pickPhoto(sh, undefined)}>Remove</button>
      </div>`}`;
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
      ${s.fullScreen ? html`<div class="hint warn">Full screen is on: the watch hides the title.</div>` : nothing}`}
    ${checkField("Full screen", s.fullScreen, (on) => commit(sh, "fullScreen", (d) => setWatchPageFullScreen(d, sh.pageId, on)), false)}
    <div class="hint ts-under">The tiles run up behind the clock, with no title.</div>`;
}

/** This module's rules, after the tile settings' in the page editor's
 * sheet. */
export const pageSettingsStyles = css`
  /* The Page popover's rows: switches and facts, left aligned. */
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
  /* The Image decoration's photos: a grid of small squares, each a radio. */
  .ps-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 8px 6px; padding: 4px 0 6px; }
  .ps-photo-cell { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; }
  .ps-photo {
    width: 48px; height: 48px; padding: 0; border: 0; border-radius: 8px; cursor: pointer;
    background: #000 center / cover no-repeat; box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
    display: grid; place-items: center;
  }
  .ps-photo.empty { background-color: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
  .ps-photo:hover:not(:disabled) { transform: scale(1.05); }
  .ps-photo.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ps-photo:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .ps-photo-gone { font-size: 9px; color: var(--wa-muted); }
  .ps-photo-name { max-width: 100%; font-size: 10px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-photo-del {
    position: absolute; top: -5px; right: calc(50% - 30px); width: 18px; height: 18px; padding: 0; border: 0; border-radius: 50%;
    background: var(--wa-card); color: var(--wa-ink); font-size: 13px; line-height: 18px; cursor: pointer;
    box-shadow: 0 0 0 1px var(--wa-line-strong); opacity: 0;
  }
  .ps-photo-cell:hover .ps-photo-del, .ps-photo-del:focus-visible { opacity: 1; }
  .ps-photo-del:hover:not(:disabled) { color: var(--error-color, #e5484d); }
  @media (hover: none) { .ps-photo-del { opacity: 1; } }
  .ps-ask { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 0 8px; font-size: 12px; }
  .ps-ask > span { flex: 1 1 100%; }
  .ps-upload { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
  .ps-upload.off { opacity: .55; cursor: default; }
  /* The file input is the label's own: hidden, the label opens it. */
  .ps-upload > input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
  .ps-upload:focus-within { box-shadow: var(--wa-ring); }
  /* Reset page, at the end of the page strip's row of chips. */
  .ps-reset { display: inline-flex; align-items: center; min-height: 28px; padding: 0 4px; }
`;
