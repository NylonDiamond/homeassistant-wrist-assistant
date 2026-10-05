// The selected tile's settings, as the inspector's section cards under its
// pinned Name card (`sectionCard`, editor-chrome.ts, the complication
// editor's look): place and size (rows the page editor hands in), icon and
// color, text, action, a header's look and a
// page link's target (part 3c); styling (3d); and for an HTTP action or
// status page tile its target and the Request task, with Run HTTP Action in
// hold and slide, from the iPhone's catalog on the host (3e,
// `library-model.ts`). A macro tile, a kind that was removed, gets one line
// that says so and nothing to edit.
//
// `<wa-page-editor>` calls `renderTileSettings` on every draw with the
// selected tile, and puts `tileSettingsStyles` in its sheet after the shared
// form rules and its own. Everything this module needs comes through its host
// (`editor-host.ts`); it edits only through `host.apply`, and only with the
// setters of `tile-settings-model.ts`, which hold the phone's rules for what
// each setting writes. The lists, defaults and sentences come from
// `tile-settings-options.ts`.
//
// The rows are the panel's own (`editors.ts`), inside a card's `.sec-b` so
// they take the inspector's compact look. They send an edit on every keystroke,
// so the picture follows the typing; each field's edits share one coalesce
// key, so a run of typing is one undo step. What is typed is also kept in
// `uiState` while the field has focus: Home Assistant hands the element a new
// `hass` several times a second, and a merge from the iPhone can change the
// stored value under a field, and neither may take away what is being typed.
//
// Every edit reads the document, the page and the tile from the host at the
// moment it commits (they are getters, `editor-host.ts`), never from the
// draw: two edits in one task each build on the one before.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3c build contract").

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import type { EntityRef } from "../model.js";
import { checkField, colorField, entityField, numberField, segField, sliderField, symbolField, symbolNameSet, textField } from "../editors.js";
import { sectionCard } from "../editor-chrome.js";
import { goToWatchHttpActions } from "../shell.js";
import { uiIcon } from "../ui-icons.js";
import {
  type WatchTileStylingTask,
  clearWatchTileStateOverrides,
  clearWatchTileTask,
  resetWatchTileState,
  resetWatchTileTask,
  setWatchTileBorderActiveOnly,
  setWatchTileBorderAnimation,
  setWatchTileBorderColor,
  setWatchTileBorderGlow,
  setWatchTileBorderIntensity,
  setWatchTileBorderLineStyle,
  setWatchTileBorderSize,
  setWatchTileBorderSpeed,
  setWatchTileBorderStyle,
  setWatchTileBorderThickness,
  setWatchTileEffect,
  setWatchTileEffectActiveOnly,
  setWatchTileEffectColor,
  setWatchTileEffectIntensity,
  setWatchTileEffectSize,
  setWatchTileEffectSpeed,
  setWatchTilePattern,
  setWatchTilePatternColor,
  setWatchTilePatternOpacity,
  setWatchTilePatternScale,
  setWatchTileStateColor,
  setWatchTileStateIcon,
  watchTileBackgroundSettings,
  watchTileBorderSettings,
  type WatchStateRow,
  WATCH_STATE_ROW_SETTERS,
  watchTileStateCards,
  watchTileStateIcons,
  watchTileTaskHeld,
  watchTileTaskModified,
} from "./styling-model.js";
import { watchDecimalOptions, watchStateEmptyText, watchStylingChoices, watchStylingLabel, watchStylingReset, watchStylingSlider } from "./tile-styling.js";
import { watchPageSwatchTheme } from "./page-settings-model.js";
import type { TileSettingsHost } from "./editor-host.js";
import { type FoldId, sectionOpen, setSectionOpen } from "./fold-memory.js";
import { forgetSpecialStatus, renderSpecial, specialSummary, watchSpecialSectionTitle } from "./special-settings.js";
import { renderInboxLine } from "./app-settings.js";
import { watchSpecialTask } from "./special-model.js";
import { findWatchPage } from "./edit.js";
import { type WatchPageTile, type WatchPagesDocument, WATCH_REMOVED_TILE_TEXT, tileEntityId, tileKind, watchPageId, watchPageName, watchPagesOf } from "./model.js";
import {
  type WatchLibraryKind,
  WATCH_LIBRARY_WORDS,
  WATCH_NO_CATALOG_TEXT,
  WATCH_NO_HTTP_ACTIONS_TEXT,
  type WatchCatalogHTTPAction,
  findWatchCatalogEntry,
  watchCatalogKnows,
  watchCatalogListedFor,
  watchCatalogWarning,
  watchHttpScreenOffered,
  watchLibraryLister,
  watchLibraryMissingText,
  watchLibraryTarget,
  watchLibraryTileFallbackName,
} from "./catalog.js";
import {
  type WatchHTTPReply,
  WATCH_HTTP_VALUE_RANGES,
  setWatchLibraryTileTarget,
  setWatchTileHTTPRefresh,
  setWatchTileHTTPRefreshOnPull,
  setWatchTileHTTPReply,
  setWatchTileHTTPShowName,
  setWatchTileHTTPToastSeconds,
  setWatchTileHTTPValueColor,
  setWatchTileHTTPValueFontSize,
  setWatchTileHTTPValueLineLimit,
  setWatchTileHTTPValueLineSpacing,
  setWatchTileHTTPValueOffsetY,
  watchHTTPRequestSettings,
} from "./library-model.js";
import {
  type WatchChoice,
  type WatchSlideDirection,
  WATCH_FONT_SIZE_RANGE,
  WATCH_HEADER_TEXT_SIZE_RANGE,
  WATCH_ICON_SIZE_RANGE,
  WATCH_ICON_TAP_ANIMATIONS,
  WATCH_TRIGGER_TARGET_DOMAINS,
  watchStoredPageName,
  watchTileIconSizeTop,
  clearWatchTileHoldSlide,
  isWatchTriggerTarget,
  setWatchHeaderColor,
  setWatchHeaderGlow,
  setWatchHeaderLabel,
  setWatchHeaderStyle,
  setWatchHeaderTextSize,
  setWatchPageLinkTarget,
  setWatchTileAskBeforeRunning,
  setWatchTileColor,
  setWatchTileDimWhenOff,
  setWatchTileFontDesign,
  setWatchTileFontSize,
  setWatchTileFontWeight,
  setWatchTileHideWhenOff,
  setWatchTileHoldSlide,
  setWatchTileHoldSlideHTTP,
  setWatchTileHoldSlideHTTPBanner,
  setWatchTileHoldSlideHTTPBannerSeconds,
  setWatchTileHoldSlideTarget,
  setWatchTileHoldSlideTargetMode,
  setWatchTileIcon,
  setWatchTileIconDefault,
  setWatchTileIconShadow,
  setWatchTileIconSize,
  setWatchTileLabel,
  setWatchTileLabelColor,
  setWatchTileRainbow,
  setWatchTileShowLabel,
  setWatchTileSingleTap,
  setWatchTileSkipConditions,
  setWatchTileTapAnimation,
  setWatchTileTextShadow,
  watchHeaderSettings,
  watchPageLinkTarget,
  watchSingleTapSettings,
  watchStorageIconName,
  watchTileActionSettings,
  watchTileIconSettings,
  watchTileTextSettings,
} from "./tile-settings-model.js";
import {
  type WatchColorModeChoice,
  type WatchHTTPSlideRow,
  type WatchMenu,
  type WatchMenuOption,
  type WatchSkipChoice,
  type WatchTileSettingsSection,
  WATCH_COLOR_MODES,
  WATCH_DEFAULT_CHOICE,
  WATCH_HTTP_REPLY_OFF,
  WATCH_NAME_BADGE,
  WATCH_SKIP_CHOICES,
  WATCH_TILE_SECTION_BADGES,
  WATCH_TILE_SETTINGS_SECTION_TITLES,
  isWatchStoredChoice,
  sameWatchColor,
  watchAskBeforeRunningNote,
  watchChoiceMenu,
  watchColorEnds,
  watchColorForMode,
  watchColorModeChoice,
  watchColorRefusal,
  watchCustomBoxColor,
  watchFontDesignMenu,
  watchFontSizeRefusal,
  watchFontWeightMenu,
  watchGlowPercent,
  watchHeaderTextSizeRefusal,
  watchHTTPBannerSecondsMenu,
  watchHTTPRefreshMenu,
  watchHTTPReplyMenu,
  watchHTTPSlideChoice,
  watchHoldSlideMenus,
  watchLibraryTargetMenu,
  watchIconSizeHint,
  watchIconSizeRefusal,
  watchLabelNote,
  watchLinkTargetMenu,
  watchSingleTapMenu,
  watchSkipChoice,
  watchSkipValue,
  watchSwatchesInGradient,
  watchTileFallbackName,
  watchTileSettingsSections,
  watchTriggerEntityName,
  watchWholeRefusal,
} from "./tile-settings-options.js";
import {
  watchAddThemeOf,
  watchAddUsesGradient,
  watchEntityAddFromHass,
  watchEntityDefaults,
  watchGradientOf,
  watchLinkTargetPages,
  watchThemeDisplayName,
  watchThemeSwatches,
  type WatchHassView,
} from "./tile-new.js";

/** Every `uiState` key of this module starts with this. */
const KEY = "tile-settings";

// ── state kept between draws ─────────────────────────────────────────────

/** Every section starts open, so the controls are in view without a click.
 * A fold is kept by section, not by tile (a person who folds Action keeps it
 * folded from tile to tile), and across reloads (`fold-memory.ts`). */
function isOpen(host: TileSettingsHost, section: WatchTileSettingsSection): boolean {
  return sectionOpen(host.uiState, KEY, section);
}

function toggle(host: TileSettingsHost, section: WatchTileSettingsSection): void {
  setSectionOpen(host.uiState, KEY, section, !isOpen(host, section));
  host.requestUpdate();
}

/** Keys of one field of the selected tile: the text typed in it, and the
 * reason its last value was refused. */
function typedKey(host: TileSettingsHost, setting: string): string {
  return `${KEY}:typed:${host.tileId.toUpperCase()}:${setting}`;
}

function noteKey(host: TileSettingsHost, setting: string): string {
  return `${KEY}:note:${host.tileId.toUpperCase()}:${setting}`;
}

/** Drop every field's refusal and the special rows' status lines: the
 * selection is changing, and a refusal belongs to the field it was shown
 * by. `<wa-page-editor>` calls this. */
export function forgetTileSettingsNotes(uiState: Map<string, unknown>): void {
  for (const key of [...uiState.keys()]) if (key.startsWith(`${KEY}:note:`)) uiState.delete(key);
  forgetSpecialStatus(uiState);
}

/** What a field shows while it is typed in, else undefined. */
export function typed(host: TileSettingsHost, setting: string): string | undefined {
  const value = host.uiState.get(typedKey(host, setting));
  return typeof value === "string" ? value : undefined;
}

/** The field a person is in now, through every shadow root, for dropping
 * typed text a field kept when it went away without a blur (an undo that
 * took its tile away). */
function focusedField(): Element | null {
  let at: Element | null = document.activeElement;
  while (at?.shadowRoot?.activeElement) at = at.shadowRoot.activeElement;
  return at;
}

/** Typed text of fields that are not focused any more: a field removed while
 * focused sends no focusout. */
export function dropStaleTyping(host: TileSettingsHost): void {
  const focused = focusedField();
  const inField = focused instanceof HTMLElement ? focused.closest<HTMLElement>("[data-ts-field]")?.dataset.tsField : undefined;
  for (const key of [...host.uiState.keys()]) {
    if (!key.startsWith(`${KEY}:typed:`)) continue;
    if (inField === undefined || key !== `${KEY}:typed:${host.tileId.toUpperCase()}:${inField}`) host.uiState.delete(key);
  }
}

/**
 * One edit. `reason` refuses it before it is tried, with the reason shown
 * by the field; a setter that returns the document it was given changes
 * nothing. `typing` makes a run of edits from one field one undo step.
 */
export function commit(
  host: TileSettingsHost,
  setting: string,
  make: (document: WatchPagesDocument) => WatchPagesDocument,
  options: { typing?: boolean; reason?: string } = {},
): void {
  // A reset dot's edit is a step of its own, never part of a run of typing
  // or a drag (`resetDotPressed`).
  const fromDot = host.uiState.delete(RESET_DOT_KEY);
  if (host.busy) return;
  const note = noteKey(host, setting);
  if (options.reason !== undefined) {
    host.uiState.set(note, options.reason);
    host.requestUpdate();
    return;
  }
  const had = host.uiState.delete(note);
  const typing = options.typing === true && !fromDot;
  const next = make(host.document);
  if (next === host.document) {
    if (had) host.requestUpdate();
    return;
  }
  host.apply(next, typing ? { coalesce: `tile:${host.tileId}:${setting}` } : undefined);
}

const RESET_DOT_KEY = `${KEY}:resetDot`;

/**
 * A field's reset dot was pressed: the run of edits going on (a drag of the
 * slider, typing) ends, and the edit the dot makes next is a step of its
 * own, so an undo after another drag comes back to the reset value. The
 * dot calls the same setter as the slider, so the field tells it apart here,
 * before the dot's own click handler runs.
 */
export function resetDotPressed(host: TileSettingsHost): void {
  host.endCoalesce();
  host.uiState.set(RESET_DOT_KEY, true);
}

/** The refusal shown by a field, if any. */
export function fieldNote(host: TileSettingsHost, setting: string): TemplateResult | typeof nothing {
  const note = host.uiState.get(noteKey(host, setting));
  return typeof note === "string" ? html`<div class="hint warn ts-note" role="status">${note}</div>` : nothing;
}

/**
 * A field that is typed in: what is typed is kept while it has focus, and
 * its run of edits ends when it loses focus. Only the text and number boxes
 * count; a search box or a swatch inside the same row does not.
 */
export function typingField(host: TileSettingsHost, setting: string, body: TemplateResult, stored?: number): TemplateResult {
  const key = typedKey(host, setting);
  const keeps = (target: EventTarget | null): target is HTMLInputElement =>
    target instanceof HTMLInputElement && (target.type === "text" || target.type === "number") && !target.closest(".alpha");
  // A number box holding what is no number yet ("-", "e", "1e") reads as
  // empty, and an empty optional box clears the setting. Such a keystroke
  // changes nothing: the stored value stays, and the text stays as typed.
  const unfinished = (target: HTMLInputElement) => target.type === "number" && target.validity.badInput;
  // Recorded on the way down, before the field's own handler edits: a
  // trusted input event runs queued microtasks between its listeners, so
  // the redraw that edit asks for comes before any listener on the way up,
  // and would draw the text from one keystroke before.
  const record = {
    capture: true,
    handleEvent: (e: Event) => {
      if (!keeps(e.target)) return;
      if (unfinished(e.target)) {
        e.stopPropagation();
        return;
      }
      host.uiState.set(key, e.target.value);
    },
  };
  // On the way down too: the dot stops its click where it is.
  const dot = {
    capture: true,
    handleEvent: (e: Event) => {
      if (e.target instanceof Element && e.target.closest(".reset-dot") !== null) resetDotPressed(host);
    },
  };
  return html`<div class="ts-typing" data-ts-field=${setting}
    @input=${record}
    @click=${dot}
    @change=${(e: Event) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      // A slider or the system color picker sends input all the way through
      // a drag and change when it is let go: the end of that run.
      if (t.type === "range" || t.type === "color") host.endCoalesce();
      // A switch in the row (Label color's) decides what is stored, so text
      // typed in the box beside it is no longer what the row shows.
      if (t.type === "checkbox") {
        host.uiState.delete(key);
        host.endCoalesce();
        host.requestUpdate();
      }
    }}
    @focusout=${(e: FocusEvent) => {
      if (!keeps(e.target)) return;
      const stayed = e.relatedTarget instanceof Node && (e.currentTarget as HTMLElement).contains(e.relatedTarget);
      if (stayed) return;
      // Unfinished text never reached the store: the box goes back to the
      // stored number.
      if (unfinished(e.target)) e.target.value = stored === undefined ? "" : String(stored);
      host.uiState.delete(key);
      // A refusal is about what was typed, which is gone now.
      host.uiState.delete(noteKey(host, setting));
      host.endCoalesce();
      host.requestUpdate();
    }}>${body}${fieldNote(host, setting)}</div>`;
}

/** The number a typed text stands for: undefined for an empty box. */
export function typedNumber(text: string | undefined, stored: number | undefined): number | undefined {
  if (text === undefined) return stored;
  if (text.trim() === "") return undefined;
  const n = Number(text);
  return Number.isFinite(n) ? n : stored;
}

// ── shared pieces ────────────────────────────────────────────────────────

/**
 * A select row in the panel's field look, for menus `selectField` cannot
 * draw: a stored value shown and not offered is a disabled entry. Each
 * option's `selected` is set as a property, so an undo or a merge moves the
 * select even after a person has picked from it.
 */
export function menuField(label: string, menu: WatchMenu, pick: (value: string) => void): TemplateResult {
  const option = (o: WatchMenuOption) => html`<option value=${o.value} ?disabled=${o.disabled === true}
    .selected=${live(o.value === menu.selected)}>${o.label}</option>`;
  // Options next to each other with one group go under one heading.
  const runs: { group: string | undefined; options: WatchMenuOption[] }[] = [];
  for (const o of menu.options) {
    const last = runs[runs.length - 1];
    if (last !== undefined && last.group !== undefined && last.group === o.group) last.options.push(o);
    else runs.push({ group: o.group, options: [o] });
  }
  return html`<label class="field"><span>${label}</span>
      <select @change=${(e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        if (!isWatchStoredChoice(value)) pick(value);
      }}>
        ${runs.map((run) => run.group === undefined
          ? run.options.map(option)
          : html`<optgroup label=${run.group}>${run.options.map(option)}</optgroup>`)}
      </select></label>
    ${menu.note === undefined ? nothing : html`<div class="hint ts-under">${menu.note}</div>`}`;
}

/** A row of small round color buttons, the page theme's swatches. */
export function swatchRow(
  label: string,
  swatches: readonly string[],
  current: unknown,
  pick: (color: string) => void,
): TemplateResult {
  return html`<div class="ts-swatches" role="group" aria-label=${label}>
    ${swatches.map((value) => {
      const ends = watchColorEnds(value);
      if (ends === undefined) return nothing;
      const on = sameWatchColor(current, value);
      const name = ends.from === ends.to ? ends.from : `Gradient from ${ends.from} to ${ends.to}`;
      return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        title=${name} aria-label=${name}
        style=${`--sw:linear-gradient(135deg, ${ends.from}, ${ends.to})`}
        @click=${() => pick(value)}></button>`;
    })}
  </div>`;
}

/** A small text button beside a row, for a way back to a default. */
export function linkButton(text: string, title: string, action: () => void): TemplateResult {
  return html`<button type="button" class="link ts-link" title=${title} @click=${action}>${text}</button>`;
}

/** The defaults of the tile's kind for this page: icon and color. */
function kindDefaults(host: TileSettingsHost): { icon: string | undefined; color: string | undefined } {
  const entityId = tileEntityId(host.tile);
  const add = watchEntityAddFromHass(host.hass as unknown as WatchHassView, entityId);
  return watchEntityDefaults(add, host.page);
}

/**
 * The Icon task's Default: writes the kind's default icon and nothing else.
 * Each Default writes only its own key, as on the phone. On a smart page rule's
 * style (`host.domainStyle`) it removes the key instead.
 */
export function watchTileDefaultIconEdit(host: TileSettingsHost): (d: WatchPagesDocument) => WatchPagesDocument {
  // A rule's style: Default removes the key, and the watch draws its own
  // (part 3f batch 3, decision 7).
  const icon = host.domainStyle === true ? undefined : kindDefaults(host).icon;
  return (d) =>
    icon !== undefined
      ? setWatchTileIcon(d, host.pageId, host.tileId, icon)
      : setWatchTileIconDefault(d, host.pageId, host.tileId, { icon: null, color: watchTileIconSettings(host.tile).color ?? null });
}

/**
 * The color's Default: writes the kind's default color and nothing else. On
 * a rule's style it removes the key instead.
 */
export function watchTileDefaultColorEdit(host: TileSettingsHost): (d: WatchPagesDocument) => WatchPagesDocument {
  const color = host.domainStyle === true ? undefined : kindDefaults(host).color;
  return (d) =>
    color !== undefined
      ? setWatchTileColor(d, host.pageId, host.tileId, color)
      : setWatchTileIconDefault(d, host.pageId, host.tileId, { icon: watchTileIconSettings(host.tile).icon ?? null, color: null });
}

// ── sections ─────────────────────────────────────────────────────────────

/** What a caller hands `renderTileSettings` beyond its host: the sections to
 * draw instead of the tile's own (a smart page rule's style, or a page's tile
 * with its Size first), and the Size section's rows, which only such a caller
 * has, with whether they hold a value of their own (its changed dot). */
export interface TileSettingsExtras {
  sections?: readonly WatchTileSettingsSection[];
  size?: { summary: () => string; body: () => TemplateResult; changed?: () => boolean };
}

/** The sections a page's selected tile gets in the inspector: its place and
 * size first, as the page editor hands those rows in, then the tile's own. */
export function tileInspectorSections(host: TileSettingsHost): WatchTileSettingsSection[] {
  return ["size", ...watchTileSettingsSections(host.tile, host.hass.states)];
}

/** Whether the section is one line rather than a card: the webhook inbox's,
 * or a removed kind's. */
function inboxLine(host: TileSettingsHost, section: WatchTileSettingsSection): boolean {
  return section === "removed" || (section === "special" && watchSpecialTask(host.tile, host.hass.states)?.task === "inbox");
}

/** The one line a tile of a removed kind (a macro) gets in place of its
 * tasks. The tile stays as stored; it can still be moved or deleted. */
function renderRemovedLine(): TemplateResult {
  return html`<p class="hint ts-removed">${WATCH_REMOVED_TILE_TEXT}</p>`;
}

/** The folds the inspector's Collapse all turns: each of the sections that is
 * drawn as a card. */
export function tileSettingsFoldIds(host: TileSettingsHost, sections: readonly WatchTileSettingsSection[]): FoldId[] {
  return sections.filter((s) => !inboxLine(host, s)).map((section) => ({ module: KEY, section }));
}

/** The settings cards for `host.tile`, or nothing. */
export function renderTileSettings(host: TileSettingsHost, extras: TileSettingsExtras = {}): TemplateResult | typeof nothing {
  const sections = (extras.sections ?? watchTileSettingsSections(host.tile, host.hass.states)).filter((s) => s !== "size" || extras.size !== undefined);
  if (sections.length === 0) return nothing;
  dropStaleTyping(host);
  return html`<div class="ts-root">
    ${sections.map((section) => renderSection(host, section, extras))}
  </div>`;
}

function renderSection(host: TileSettingsHost, section: WatchTileSettingsSection, extras: TileSettingsExtras): TemplateResult {
  // A webhook inbox has no task here (its topics live on the iPhone): one
  // line stands where the task would be (part 3f batch 2). So does a removed
  // kind's line.
  if (section === "removed") return renderRemovedLine();
  if (inboxLine(host, section)) return renderInboxLine(host);
  const open = isOpen(host, section);
  const title = section === "special" ? watchSpecialSectionTitle(host) : WATCH_TILE_SETTINGS_SECTION_TITLES[section];
  const summary = open ? "" : section === "size" ? (extras.size?.summary() ?? "") : sectionSummary(host, section);
  const badge = WATCH_TILE_SECTION_BADGES[section];
  const changed = section === "size" ? extras.size?.changed?.() === true : watchTileSectionChanged(host, section);
  // A fieldset only to switch every control off at once while a save is out.
  // Drawn only while open: a body is work, and the Icon one can edit.
  const body = open
    ? html`<fieldset class="ts-body" id=${`ts-body-${section}`} ?disabled=${host.busy} aria-label=${title}>${section === "size" ? (extras.size?.body() ?? nothing) : sectionBody(host, section)}</fieldset>`
    : html``;
  return sectionCard({
    color: badge.color,
    icon: uiIcon(badge.icon),
    title,
    open,
    onToggle: () => toggle(host, section),
    ...(summary === "" ? {} : { summary }),
    dot: changed,
    id: `${KEY}:${section}`,
  }, body);
}

// ── the changed dot ──────────────────────────────────────────────────────

/** The tile keys each section edits, for the changed dot: the section reads
 * as changed when what its rows read differs from what they would read with
 * these keys gone. */
const SECTION_KEYS: Readonly<Partial<Record<WatchTileSettingsSection, readonly string[]>>> = {
  request: [
    "httpResponseDisplay", "httpToastSeconds", "httpAutoRefreshInterval", "httpAutoRefreshOnOpen", "httpAutoRefreshOnPull",
    "httpTileValueShowName", "httpTileValueFontSize", "httpTileValueLineLimit", "httpTileValueLineSpacing", "httpTileValueOffsetY",
    "httpTileValueColorHex",
  ],
  // The icon and the color are compared to the kind's defaults instead.
  icon: ["iconSizeOverride", "iconShadow", "dimWhenOff", "iconTapAnimation", "stateIcons", "stateColors"],
  // The label is the Name card's, not this one's.
  text: ["showLabel", "labelFontSizeOverride", "labelFontWeight", "labelFontDesign", "labelShadow", "labelColorHex"],
  action: [
    "singleTapAction", "holdSlideActions", "holdSlideTriggerTargets", "holdSlideHTTPActionTargets", "holdSlideHTTPActionShowBanner",
    "holdSlideHTTPActionBannerSeconds", "requiresConfirmation", "hideWhenInactive", "automationSkipConditionOverride",
  ],
};

/** Whether `read` gives the tile something other than it gives the same
 * tile with `keys` removed: a stored value that is not the one the watch
 * would use anyway. The iPhone app stores most keys at their defaults, so a
 * key merely being there says nothing. */
function readsOtherThanDefault(tile: WatchPageTile, keys: readonly string[], read: (tile: WatchPageTile) => unknown): boolean {
  if (!keys.some((key) => Object.hasOwn(tile, key))) return false;
  const bare: Record<string, unknown> = { ...tile };
  for (const key of keys) delete bare[key];
  return JSON.stringify(read(tile)) !== JSON.stringify(read(bare as WatchPageTile));
}

/** The label weight the iPhone app stores on every tile it saves. */
const PHONE_DEFAULT_FONT_WEIGHT = "light";

/** The label weight the watch reads with no key. */
const ABSENT_FONT_WEIGHT = watchTileTextSettings({} as WatchPageTile).fontWeight;

/** What each section's rows read, for `readsOtherThanDefault`. */
const SECTION_READS: Readonly<Partial<Record<WatchTileSettingsSection, (tile: WatchPageTile) => unknown>>> = {
  request: (t) => watchHTTPRequestSettings(t),
  icon: (t) => {
    const s = watchTileIconSettings(t);
    const map = (v: unknown) => (typeof v === "object" && v !== null && Object.keys(v).length > 0 ? v : undefined);
    return [s.iconSize, s.iconShadow, s.dimWhenOff.value, s.tapAnimation, map(t.stateIcons), map(t.stateColors)];
  },
  text: (t) => {
    const { label: _label, ...rest } = watchTileTextSettings(t);
    // Every tile the iPhone app saves carries its own default weight, Light
    // (all 94 tiles of the test fixtures), where an absent key reads Regular:
    // both are a default, neither is a change.
    return rest.fontWeight === PHONE_DEFAULT_FONT_WEIGHT ? { ...rest, fontWeight: ABSENT_FONT_WEIGHT } : rest;
  },
  action: (t) => {
    const a = watchTileActionSettings(t);
    const slides = ["holdSlideActions", "holdSlideTriggerTargets", "holdSlideHTTPActionTargets", "holdSlideHTTPActionShowBanner", "holdSlideHTTPActionBannerSeconds"]
      .map((key) => t[key]);
    return [watchSingleTapSettings(t).resolvedLabel, a.askBeforeRunning.value, a.hideWhenOff, a.skipConditions.value, slides];
  },
};

/**
 * Whether a section holds a value of the tile's own, which its card marks
 * with the changed dot: one of its keys stored with a value that reads other
 * than the key's absence would (`readsOtherThanDefault`). The icon and the
 * color count only away from the kind's defaults (what Default writes, and
 * what its chip shows as on); a header only away from a plain line with no
 * glow in its default color; the styling tasks (State, Border, Background)
 * while their Reset would change something (`taskModified`, what Reset is
 * shown for). Opens, Target and a special task always hold a choice, and
 * Size a place, and never show it.
 */
export function watchTileSectionChanged(host: TileSettingsHost, section: WatchTileSettingsSection): boolean {
  const tile = host.tile;
  const keys = SECTION_KEYS[section] ?? [];
  const read = SECTION_READS[section];
  const stored = read !== undefined && readsOtherThanDefault(tile, keys, read);
  switch (section) {
    case "request":
    case "text":
    case "action":
      return stored;
    case "icon": {
      if (stored) return true;
      const s = watchTileIconSettings(tile);
      if (s.icon === undefined && s.color === undefined) return false;
      const defaults = host.domainStyle === true ? { icon: undefined, color: undefined } : kindDefaults(host);
      const ownIcon = s.icon !== undefined && (defaults.icon === undefined || s.icon !== defaults.icon);
      const ownColor = s.color !== undefined && (defaults.color === undefined || !sameWatchColor(s.color, defaults.color));
      return ownIcon || ownColor;
    }
    case "header": {
      const h = watchHeaderSettings(tile);
      if (h === undefined) return false;
      const defaultColor = kindDefaults(host).color;
      return h.style === "label" || h.label !== undefined || h.textSize !== undefined || watchGlowPercent(h.glow) > 0
        || (h.color !== undefined && (defaultColor === undefined || !sameWatchColor(h.color, defaultColor)));
    }
    case "state":
    case "border":
    case "background":
      return taskModified(host, section);
    case "opens":
    case "target":
    case "special":
    case "size":
    case "removed":
      return false;
  }
}

// ── name ─────────────────────────────────────────────────────────────────

/**
 * The pinned Name card at the top of the inspector, a tile's or a page's:
 * one header row with its badge, its title and the name's box, and under it
 * an optional line. A div rather than a label round the row, as the
 * complication editor's: a label hands its clicks to its first control.
 */
export function watchNameSection(input: TemplateResult, under: TemplateResult | typeof nothing = nothing): TemplateResult {
  return html`<section class="sec name-sec" data-open="true" style=${`--c:${WATCH_NAME_BADGE.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon(WATCH_NAME_BADGE.icon)}</span>
      <h4>Name</h4>
      ${input}
    </div>
    ${under === nothing ? nothing : html`<div class="sec-b ts-name-b">${under}</div>`}
  </section>`;
}

/**
 * The tile's label as its Name card, for every tile with a Text section (a
 * header's words are its Header's, a spacer has none), and never for a
 * rule's style, whose tiles carry each entity's own name. Empty shows the
 * name the watch falls back to and stores no label. Inside a `.ts-root`, so
 * the editor lets the box go when the selection moves, as it does the
 * settings' own fields.
 */
export function renderTileName(host: TileSettingsHost): TemplateResult | typeof nothing {
  if (host.domainStyle === true || !watchTileSettingsSections(host.tile, host.hass.states).includes("text")) return nothing;
  const tile = host.tile;
  const fallback = watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document), host.catalog);
  const label = typed(host, "label") ?? watchTileTextSettings(tile).label ?? "";
  const set = (v: string) =>
    commit(host, "label", (d) => setWatchTileLabel(d, host.pageId, host.tileId, v, { emptyRemoves: true }), { typing: true });
  const entityId = tileEntityId(tile);
  const input = typingField(host, "label", html`<input type="text" aria-label="Label" .value=${label} placeholder=${fallback}
    ?disabled=${host.busy} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />`);
  return html`<div class="ts-root ts-name-root">${watchNameSection(input, html`
    <div class="hint keep">${watchLabelNote(tile)}</div>
    ${entityId === "" ? nothing : html`<div class="ts-entity"><code>${entityId}</code></div>`}`)}</div>`;
}

/** What a folded section's heading says it holds. */
function sectionSummary(host: TileSettingsHost, section: WatchTileSettingsSection): string {
  const tile = host.tile;
  switch (section) {
    case "opens": {
      const link = watchPageLinkTarget(tile);
      const page = link === undefined ? undefined : findWatchPage(host.document, link.targetId);
      return page === undefined ? "" : watchPageName(page);
    }
    case "target": {
      const target = watchLibraryTarget(tileEntityId(tile));
      if (target === undefined || !watchCatalogKnows(host.catalog, target.kind)) return "";
      return findWatchCatalogEntry(host.catalog, target.kind, target.id)?.name ?? watchLibraryMissingText(host.catalog, target.kind);
    }
    case "request": {
      const reply = watchHTTPRequestSettings(tile).reply;
      return reply === "toast" ? "Reply as a banner" : reply === "tileValue" ? "Reply on the tile" : "";
    }
    case "special":
      return specialSummary(host);
    case "header": {
      const h = watchHeaderSettings(tile);
      return h === undefined ? "" : h.style === "label" ? `Label${h.label ? `: ${h.label}` : ""}` : "Line";
    }
    case "icon": {
      const icon = watchTileIconSettings(tile).icon;
      return icon === undefined ? "Default icon" : icon === "" ? "No icon" : icon;
    }
    case "text": {
      const text = watchTileTextSettings(tile);
      // A rule's tiles carry each entity's own name.
      if (host.domainStyle === true) return text.showLabel ? "Label shown" : "Label hidden";
      const name = text.label !== undefined && text.label !== "" ? text.label : watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document), host.catalog);
      return text.showLabel ? name : `${name} (hidden)`;
    }
    case "action": {
      if (host.domainStyle === true) return watchTileActionSettings(tile).askBeforeRunning.value ? "Ask before running" : "";
      const tap = watchSingleTapSettings(tile);
      return tap.picker ? `Tap: ${tap.resolvedLabel}` : "";
    }
    case "size":
    case "removed":
      return "";
    case "state":
      return taskModified(host, "state") ? "Changed" : "";
    case "border": {
      const b = watchTileBorderSettings(tile);
      if (tileKind(tileEntityId(tile)) === "spacer") return watchStylingLabel("borderThickness", b.thickness);
      return b.style === "none" ? "" : b.style === "animate" ? `Animate: ${watchStylingLabel("borderAnimation", b.animation)}` : watchStylingLabel("borderThickness", b.thickness);
    }
    case "background": {
      const g = watchTileBackgroundSettings(tile);
      if (tileKind(tileEntityId(tile)) === "spacer") return g.pattern === "none" ? "" : watchStylingLabel("backgroundPattern", g.pattern);
      return [g.pattern, g.effect].filter((v) => v !== "none").map((v, i) => watchStylingLabel(i === 0 && g.pattern !== "none" ? "backgroundPattern" : "tileAnimation", v)).join(", ");
    }
  }
}

function sectionBody(host: TileSettingsHost, section: WatchTileSettingsSection): TemplateResult {
  switch (section) {
    case "opens":
      return renderOpens(host);
    case "target":
      return renderTarget(host);
    case "request":
      return renderRequest(host);
    case "header":
      return renderHeader(host);
    case "special":
      return renderSpecial(host);
    case "icon":
      return renderIcon(host);
    case "text":
      return renderText(host);
    case "action":
      return renderAction(host);
    case "state":
      return renderState(host);
    case "border":
      return renderBorder(host);
    case "background":
      return renderBackground(host);
    case "size":
    case "removed":
      return html``;
  }
}

// ── opens ────────────────────────────────────────────────────────────────

function renderOpens(host: TileSettingsHost): TemplateResult {
  const link = watchPageLinkTarget(host.tile);
  if (link === undefined) return html``;
  const targets = watchLinkTargetPages(host.document, host.pageId, link.kind === "page" ? "pageLink" : "peekLink");
  const menu = watchLinkTargetMenu(host.document, host.tile, targets);
  if (menu === undefined) return html``;
  const pick = (id: string) => {
    commit(host, "target", (d) => {
      // The pages and the old target's name as they are now: an edit just
      // before this one may have renamed either.
      const now = watchLinkTargetPages(d, host.pageId, link.kind === "page" ? "pageLink" : "peekLink");
      const page = now.find((p) => watchPageId(p) === id);
      if (page === undefined) return d;
      const old = watchLinkTargetMenu(d, host.tile, now)?.oldTargetName;
      return setWatchPageLinkTarget(d, host.pageId, host.tileId, { id: watchPageId(page), name: watchStoredPageName(page) }, old);
    });
  };
  return html`
    ${targets.length === 0 && menu.options.length === 0
      ? html`<p class="hint">There is no other page this tile can open. Add a page first.</p>`
      : menuField(link.kind === "page" ? "Goes to" : "Peeks at", menu, pick)}
    <div class="hint ts-under">${link.kind === "page"
      ? "A tap goes to that page. A label that is the page's name follows it."
      : "A tap shows that page over this one, hidden pages included. A label that is the page's name follows it."}</div>`;
}

// ── library tiles: target, request ───────────────────────────────────────

const TARGET_HINTS: Readonly<Record<WatchLibraryKind, string>> = {
  httpAction: "A tap runs this action. A label that is the action's name follows it.",
  statusPage: "A tap opens this status page. A label that is the page's name follows it.",
};

/** The way from an HTTP action tile to the HTTP actions screen. */
function httpActionsLink(): TemplateResult {
  return linkButton("Open HTTP actions", "Go to the HTTP actions screen", goToWatchHttpActions);
}

/**
 * The Target of an HTTP action or status page tile: the catalog's
 * entries of its kind, the home's HTTP actions first (`http-library.ts`). A
 * target the list does not hold shows the tile's label and "Not on the
 * iPhone" ("Not in this watch's status pages" for a status page from the
 * watch's own record, "Not in the list" when the home's library is the only
 * list), and stays until another is picked. With no list of its kind the
 * tile shows its label and the line that says where the list comes from;
 * nothing can be picked. Where the HTTP actions screen could help (an empty
 * list, an action it should set up or one it no longer holds) it is a click
 * away.
 */
function renderTarget(host: TileSettingsHost): TemplateResult {
  const target = watchLibraryTarget(tileEntityId(host.tile));
  if (target === undefined) return html``;
  const words = WATCH_LIBRARY_WORDS[target.kind];
  const catalog = host.catalog;
  if (catalog === undefined || !watchCatalogKnows(catalog, target.kind)) {
    // With no label of its own, the name the watch shows ("Action",
    // "Status Page").
    const label = watchTileTextSettings(host.tile).label;
    const shown = label !== undefined && label.trim() !== "" ? label : (watchLibraryTileFallbackName(tileEntityId(host.tile), undefined) ?? words.one);
    return html`<div class="ts-target-now">${shown}</div>
      <div class="hint ts-under">${WATCH_NO_CATALOG_TEXT}</div>`;
  }
  const menu = watchLibraryTargetMenu(host.tile, catalog);
  if (menu === undefined) return html``;
  const pick = (id: string) =>
    commit(host, "target", (d) => {
      // The catalog, the tile and the old target's name as they are when the
      // pick lands: the catalog may have moved while the menu was open.
      const now = host.catalog;
      const entry = findWatchCatalogEntry(now, target.kind, id);
      const current = watchLibraryTarget(tileEntityId(host.tile));
      if (entry === undefined || current === undefined) return d;
      const old = findWatchCatalogEntry(now, current.kind, current.id)?.name;
      return setWatchLibraryTileTarget(d, host.pageId, host.tileId, target.kind, entry, old === undefined ? [] : [old]);
    });
  const warning = menu.current === undefined ? undefined : watchCatalogWarning(target.kind, menu.current);
  // The watch's own status pages are not listed by the iPhone, nor is the
  // home's HTTP action library.
  const listed = watchCatalogListedFor(catalog, target.kind);
  const onlyMissing = menu.options.every((o) => o.disabled === true);
  const http = target.kind === "httpAction" && watchHttpScreenOffered(catalog);
  const current = menu.current as WatchCatalogHTTPAction | undefined;
  const screenHelps = http && (current === undefined ? catalog.httpLibrary === "held" || onlyMissing : current.source === "home" && current.needsSetup);
  return html`
    ${menu.options.length === 0
      ? html`<p class="hint">${http ? WATCH_NO_HTTP_ACTIONS_TEXT
        : watchLibraryLister(catalog, target.kind) === "The iPhone" ? `The iPhone lists no ${words.many} yet.` : `This watch has no ${words.many} yet.`}</p>`
      : menuField(words.one, menu, pick)}
    ${warning === undefined ? nothing : html`<div class="hint warn ts-under">${warning}.</div>`}
    <div class="hint ts-under">${onlyMissing ? nothing : TARGET_HINTS[target.kind]}${listed === undefined ? nothing : html` ${listed}`}</div>
    ${screenHelps ? html`<div class="ts-under">${httpActionsLink()}</div>` : nothing}`;
}

const REPLY_HINTS: Readonly<Record<WatchHTTPReply | "off", string>> = {
  off: "The watch stays quiet after a successful run. Failures always show their error.",
  toast: "After each successful run, a banner shows the reply. Failures always show their error.",
  tileValue: "The tile shows the value from its last run in place of its icon. Successful runs show no banner.",
};

/** The Request task of an HTTP action tile: how the reply shows, the
 * banner's seconds, and the Tile Value rows. */
function renderRequest(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const target = watchLibraryTarget(tileEntityId(tile));
  const action = target === undefined ? undefined : findWatchCatalogEntry(host.catalog, "httpAction", target.id);
  const r = watchHTTPRequestSettings(tile);
  const pickReply = (v: string) =>
    commit(host, "httpReply", (d) => setWatchTileHTTPReply(d, host.pageId, host.tileId, v === WATCH_HTTP_REPLY_OFF ? null : (v as WatchHTTPReply)));
  return html`
    ${menuField("Show reply", watchHTTPReplyMenu(tile, action, host.catalog), pickReply)}
    <div class="hint ts-under">${REPLY_HINTS[r.reply ?? "off"]}</div>
    ${r.reply === "toast"
      ? menuField("Banner for", watchHTTPBannerSecondsMenu(r.toastSeconds), (v) =>
          commit(host, "httpToastSeconds", (d) => setWatchTileHTTPToastSeconds(d, host.pageId, host.tileId, Number(v))))
      : nothing}
    ${r.reply === "tileValue" ? renderTileValue(host, r) : nothing}`;
}

/** The Tile Value rows, as the phone has them. */
function renderTileValue(host: TileSettingsHost, r: ReturnType<typeof watchHTTPRequestSettings>): TemplateResult {
  const P = () => [host.pageId, host.tileId] as const;
  const R = WATCH_HTTP_VALUE_RANGES;
  const fontSize = typedNumber(typed(host, "httpFontSize"), r.fontSize);
  const lines = typedNumber(typed(host, "httpLines"), r.lineLimit);
  const setFontSize = (v: number | undefined) =>
    commit(host, "httpFontSize", (d) => setWatchTileHTTPValueFontSize(d, ...P(), v ?? null), {
      typing: true,
      ...(v === undefined ? {} : reasonOf(watchWholeRefusal(v, R.fontSize.min, R.fontSize.max))),
    });
  const setLines = (v: number | undefined) =>
    commit(host, "httpLines", (d) => setWatchTileHTTPValueLineLimit(d, ...P(), v ?? null), {
      typing: true,
      ...(v === undefined ? {} : reasonOf(watchWholeRefusal(v, R.lineLimit.min, R.lineLimit.max))),
    });
  const color = typed(host, "httpColor") ?? r.color;
  const setColor = (v: string | undefined) => {
    if (v === undefined) commit(host, "httpColor", (d) => setWatchTileHTTPValueColor(d, ...P(), null));
    else commit(host, "httpColor", (d) => setWatchTileHTTPValueColor(d, ...P(), v), { typing: true, ...reasonOf(watchColorRefusal(v)) });
    host.requestUpdate();
  };
  const refresh = watchHTTPRefreshMenu(r.refresh);
  return html`<div class="ts-sub">
    <div class="ts-sub-h"><span>Tile value</span></div>
    ${menuField("Auto-refresh", refresh, (v) =>
      commit(host, "httpRefresh", (d) => setWatchTileHTTPRefresh(d, ...P(), v === "off" || v === "onOpen" ? v : Number(v))))}
    <div class="hint ts-under">Once each time the page opens, or on a timer while it is open. Short intervals use more battery.</div>
    ${checkField("Refresh on pull", r.refreshOnPull, (on) => commit(host, "httpRefreshOnPull", (d) => setWatchTileHTTPRefreshOnPull(d, ...P(), on)))}
    ${checkField("Show name", r.showName, (on) => commit(host, "httpShowName", (d) => setWatchTileHTTPShowName(d, ...P(), on)))}
    <div class="hint ts-under">Captions the value with the tile's name.</div>
    ${typingField(host, "httpFontSize", html`<div class="ts-with-link">
      ${numberField("Text size", fontSize, setFontSize, { step: 1, min: R.fontSize.min, max: R.fontSize.max, optional: true, placeholder: "Auto", unit: "pt" })}
      ${r.fontSize === undefined ? nothing : linkButton("Auto", "Let the watch size the value", () => commit(host, "httpFontSize", (d) => setWatchTileHTTPValueFontSize(d, ...P(), null)))}
    </div>`, r.fontSize)}
    ${typingField(host, "httpLines", html`<div class="ts-with-link">
      ${numberField("Lines", lines, setLines, { step: 1, min: R.lineLimit.min, max: R.lineLimit.max, optional: true, placeholder: "Auto" })}
      ${r.lineLimit === undefined ? nothing : linkButton("Auto", "More lines on taller tiles", () => commit(host, "httpLines", (d) => setWatchTileHTTPValueLineLimit(d, ...P(), null)))}
    </div>`, r.lineLimit)}
    ${typingField(host, "httpLineSpacing", sliderField("Line spacing", r.lineSpacing, (v) =>
      commit(host, "httpLineSpacing", (d) => setWatchTileHTTPValueLineSpacing(d, ...P(), v), { typing: true }), {
      min: R.lineSpacing.min, max: R.lineSpacing.max, step: 1, def: 0, unit: "pt",
    }), r.lineSpacing)}
    ${typingField(host, "httpOffsetY", sliderField("Vertical position", r.offsetY, (v) =>
      commit(host, "httpOffsetY", (d) => setWatchTileHTTPValueOffsetY(d, ...P(), v), { typing: true }), {
      min: R.offsetY.min, max: R.offsetY.max, step: 1, def: 0, unit: "pt",
    }), r.offsetY)}
    <div class="hint ts-under">Below 0 moves the value up, above 0 down.</div>
    ${typingField(host, "httpColor", html`<div class="ts-no-alpha">${colorField("Text color", color, setColor, true, undefined, { switchOn: r.color !== undefined })}</div>`)}
    <div class="hint ts-under">${r.color === undefined ? "Off: the watch's own text color." : "On: this color. Switch it off for the watch's own."}</div>
  </div>`;
}

// ── icon and color ───────────────────────────────────────────────────────

/** Set during a click on a symbol grid's tile, so the edit it sends is told
 * apart from typing in the Symbol box (`symbolField` calls one setter for
 * both). */
let gridPick = false;

/** The names the symbol provider lists, as a set; undefined while they
 * load. */
function knownSymbols(host: TileSettingsHost): Set<string> | undefined {
  const names = host.icons.names();
  return names === undefined ? undefined : symbolNameSet(names);
}

/** The name stored for a picked or typed symbol (`watchStorageIconName`),
 * against the names as they are when it is stored. */
function storedSymbol(host: TileSettingsHost, name: string): string {
  const trimmed = name.trim();
  if (trimmed === "") return "";
  const known = knownSymbols(host);
  return watchStorageIconName(trimmed, (symbol) => known?.has(symbol) === true);
}

/**
 * A `.fill` name stored before the symbol list was in could not be checked
 * against it, so it was stored as given. Once the list is in, it becomes what
 * the phone stores, if the tile still has it; in the same run of edits when
 * that run is still going.
 */
function stripFillWhenListed(host: TileSettingsHost): void {
  const key = `${KEY}:fill:${host.tileId.toUpperCase()}`;
  const pending = host.uiState.get(key);
  if (typeof pending !== "string" || knownSymbols(host) === undefined || host.busy) return;
  host.uiState.delete(key);
  const stripped = storedSymbol(host, pending);
  if (stripped === pending || watchTileIconSettings(host.tile).icon !== pending) return;
  // After the draw: an edit asks for another one.
  queueMicrotask(() =>
    commit(host, "icon", (d) => (watchTileIconSettings(host.tile).icon === pending ? setWatchTileIcon(d, host.pageId, host.tileId, stripped) : d), { typing: true }));
}

function renderIcon(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const s = watchTileIconSettings(tile);
  const defaults = kindDefaults(host);
  stripFillWhenListed(host);
  const shown = s.icon === undefined ? defaults.icon : s.icon === "" ? undefined : s.icon;
  const ink = watchColorEnds(s.color)?.from ?? "#FFFFFF";
  const glyph = shown === undefined ? undefined : host.icons.render(shown, 26, ink);
  // A rule's style is at its default only with no icon of its own.
  const atDefaultIcon = s.icon === undefined || (host.domainStyle !== true && defaults.icon !== undefined && s.icon === defaults.icon);

  const setIcon = (name: string) => {
    const picked = gridPick;
    gridPick = false;
    const value = storedSymbol(host, name);
    if (knownSymbols(host) === undefined && value.includes(".fill")) host.uiState.set(`${KEY}:fill:${host.tileId.toUpperCase()}`, value);
    if (picked) {
      // A pick from the grid is a step of its own, and the box shows the
      // picked name, not what was typed before it.
      host.uiState.delete(typedKey(host, "icon"));
      host.endCoalesce();
      host.requestUpdate();
    }
    commit(host, "icon", (d) => setWatchTileIcon(d, host.pageId, host.tileId, value), { typing: !picked });
  };
  const noIcon = () => commit(host, "icon", (d) => setWatchTileIcon(d, host.pageId, host.tileId, ""));
  const defaultIcon = () => commit(host, "icon", watchTileDefaultIconEdit(host));

  const typedIcon = typed(host, "icon");
  const what = s.icon === "" ? "No icon" : shown ?? "Default icon";
  const animation = watchChoiceMenu(WATCH_ICON_TAP_ANIMATIONS, s.tapAnimation);
  const unknownAnimation = s.tapAnimationStored !== undefined && s.tapAnimationStored !== s.tapAnimation ? s.tapAnimationStored : undefined;
  return html`
    <div class="ts-icon-now">
      <span class="ts-glyph ${s.icon === "" ? "none" : ""}" aria-hidden="true">${s.icon === "" ? uiIcon("close") : glyph ?? html`<span class="ts-glyph-dot"></span>`}</span>
      <span class="ts-icon-name">${what}${s.icon === undefined ? html`<span class="ts-faint"> (default)</span>` : nothing}</span>
    </div>
    <div class="ts-chips" role="group" aria-label="Icon">
      <button type="button" class="pe-chip ${s.icon === "" ? "on" : ""}" aria-pressed=${s.icon === "" ? "true" : "false"} @click=${noIcon}>No icon</button>
      <button type="button" class="pe-chip ${atDefaultIcon && s.icon !== "" ? "on" : ""}" aria-pressed=${atDefaultIcon && s.icon !== "" ? "true" : "false"}
        title=${host.domainStyle === true ? "No icon of its own: the watch draws its default" : defaults.icon === undefined ? "The watch picks the icon" : `The default for this kind of tile: ${defaults.icon}`}
        @click=${defaultIcon}>Default</button>
    </div>
    <div class="ts-symbol" @click=${{
      // On the way down, before the tile's own click handler sets the icon.
      capture: true,
      // Let go after the click either way (a task later: a trusted click
      // runs microtasks between its listeners).
      handleEvent: (e: Event) => {
        gridPick = e.target instanceof Element && e.target.closest("button.sym") !== null;
        if (gridPick) setTimeout(() => { gridPick = false; }, 0);
      },
    }}>
    ${typingField(host, "icon", symbolField(
      { icons: host.icons, symbols: host.symbols },
      typedIcon ?? (s.icon ?? ""),
      setIcon,
      `pe:ts:symbol`,
      undefined,
      "Symbol",
      false,
    ))}
    </div>
    ${renderTileColor(host, defaults.color)}
    ${host.domainStyle === true ? nothing : renderStateIcons(host)}
    ${renderIconSize(host)}
    ${checkField("Icon shadow", s.iconShadow, (on) => commit(host, "iconShadow", (d) => setWatchTileIconShadow(d, host.pageId, host.tileId, on)))}
    ${s.dimWhenOff.applies && host.domainStyle !== true
      ? html`${checkField("Dim when off", s.dimWhenOff.value, (on) => commit(host, "dimWhenOff", (d) => setWatchTileDimWhenOff(d, host.pageId, host.tileId, on)))}
          <div class="hint ts-under">The tile dims while it is off.</div>`
      : nothing}
    ${menuField("Tap animation", animation, (v) =>
      commit(host, "tapAnimation", (d) => setWatchTileTapAnimation(d, host.pageId, host.tileId, v)))}
    <div class="hint ts-under">How the icon moves when the tile is tapped.${unknownAnimation === undefined
      ? nothing
      : html` Stored as "${unknownAnimation}", which the watch plays as Bounce; it stays until another is picked.`}</div>`;
}

function renderTileColor(host: TileSettingsHost, defaultColor: string | undefined): TemplateResult {
  const color = watchTileIconSettings(host.tile).color;
  const mode = watchColorModeChoice(color);
  const theme = watchAddThemeOf(host.page);
  const gradient = watchSwatchesInGradient(color, watchAddUsesGradient(host.page));
  const swatches = watchThemeSwatches(theme, gradient);
  const fallback = defaultColor ?? swatches[0];
  /** The tile's color when the edit is made, not when it was drawn. */
  const colorNow = () => watchTileIconSettings(host.tile).color;
  const write = (value: string, typing = false) =>
    commit(host, "color", (d) => setWatchTileColor(d, host.pageId, host.tileId, value), { typing });
  const pickMode = (next: WatchColorModeChoice) => {
    if (next === "rainbow") return commit(host, "color", (d) => setWatchTileRainbow(d, host.pageId, host.tileId));
    if (next !== "solid" && next !== "gradient") return;
    const value = watchColorForMode(colorNow(), next, fallback, watchGradientOf);
    if (value !== undefined) write(value);
  };
  const custom = (value: string | undefined) => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(host, "color", (d) => d, { reason: reason ?? "Pick a color." });
    // A custom color keeps the form the tile is in: a gradient tile gets
    // the gradient of the picked color, as a swatch would give it.
    write(watchColorModeChoice(colorNow()) === "gradient" ? watchGradientOf(value) : value, true);
  };
  // No color stored draws the theme's color for the kind, which is what
  // Default writes out.
  // A rule's style only with no color of its own.
  const atDefault = color === undefined || (host.domainStyle !== true && defaultColor !== undefined && sameWatchColor(color, defaultColor));
  const resetColor = () => commit(host, "color", watchTileDefaultColorEdit(host));
  const typedHex = typed(host, "color");
  return html`
    ${segField<WatchColorModeChoice>("Color", mode, WATCH_COLOR_MODES as [WatchColorModeChoice, string][], (v) => pickMode(v))}
    ${mode === "rainbow" ? html`<div class="hint ts-under">The watch cycles the tile through every color.</div>` : nothing}
    <div class="ts-swatch-row">
      ${swatchRow(`${watchThemeDisplayName(theme)} colors`, swatches, color, (v) => write(v))}
    </div>
    ${typingField(host, "color", html`<div class="ts-no-alpha">${colorField("Custom", typedHex ?? watchCustomBoxColor(color), custom)}</div>`)}
    <div class="ts-after">
      <button type="button" class="pe-chip ${atDefault ? "on" : ""}" aria-pressed=${atDefault ? "true" : "false"}
        title=${defaultColor === undefined || host.domainStyle === true ? "No color of its own: the watch picks one" : `The theme's color for this kind of tile: ${defaultColor}`}
        @click=${resetColor}>Default color</button>
    </div>`;
}

function renderIconSize(host: TileSettingsHost): TemplateResult {
  const s = watchTileIconSettings(host.tile);
  // The next whole number above a largest size with a fraction stands for
  // that size (`watchTileIconSizeValue`), so the box and a drag reach it.
  const top = watchTileIconSizeTop(s.iconSizeMax);
  const shown = typedNumber(typed(host, "iconSize"), s.iconSize);
  const set = (v: number | undefined) => {
    if (v === undefined) return commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, null), { typing: true });
    const max = watchTileIconSettings(host.tile).iconSizeMax;
    commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, v), { typing: true, ...reasonOf(watchIconSizeRefusal(v, max)) });
  };
  return html`${typingField(host, "iconSize", html`<div class="ts-with-link">
      ${numberField("Icon size", shown, set, { step: 1, min: WATCH_ICON_SIZE_RANGE.min, max: top, optional: true, placeholder: "Auto", unit: "pt" })}
      ${s.iconSize === undefined ? nothing : linkButton("Auto", "Let the watch size the icon to the tile", () => commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, null)))}
    </div>`, s.iconSize)}
    <div class="hint ts-under">${watchIconSizeHint(s.iconSizeMax)}</div>`;
}

export function reasonOf(reason: string | undefined): { reason?: string } {
  return reason === undefined ? {} : { reason };
}

// ── text ─────────────────────────────────────────────────────────────────

function renderText(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const t = watchTileTextSettings(tile);
  const fontSize = typedNumber(typed(host, "fontSize"), t.fontSize);
  const setFontSize = (v: number | undefined) =>
    commit(host, "fontSize", (d) => setWatchTileFontSize(d, host.pageId, host.tileId, v ?? null), { typing: true, ...(v === undefined ? {} : reasonOf(watchFontSizeRefusal(v))) });
  const labelColor = typed(host, "labelColor") ?? watchCustomBoxColor(t.labelColor);
  const setLabelColor = (v: string | undefined) => {
    if (v === undefined) commit(host, "labelColor", (d) => setWatchTileLabelColor(d, host.pageId, host.tileId, null));
    else commit(host, "labelColor", (d) => setWatchTileLabelColor(d, host.pageId, host.tileId, v), { typing: true, ...reasonOf(watchColorRefusal(v)) });
    // Drawn again even when nothing changed (a refused press), so the
    // switch goes back to what is stored.
    host.requestUpdate();
  };
  // The label itself is the Name card's (`renderTileName`); a rule's tiles
  // each carry their entity's own name and have none.
  return html`
    ${checkField("Show label", t.showLabel, (on) => commit(host, "showLabel", (d) => setWatchTileShowLabel(d, host.pageId, host.tileId, on)))}
    ${typingField(host, "fontSize", html`<div class="ts-with-link">
      ${numberField("Font size", fontSize, setFontSize, { step: 1, min: WATCH_FONT_SIZE_RANGE.min, max: WATCH_FONT_SIZE_RANGE.max, optional: true, placeholder: "Auto", unit: "pt" })}
      ${t.fontSize === undefined ? nothing : linkButton("Auto", "Let the watch size the label to the tile", () => commit(host, "fontSize", (d) => setWatchTileFontSize(d, host.pageId, host.tileId, null)))}
    </div>`, t.fontSize)}
    <div class="hint ts-under">Empty is Auto, sized to the tile's width. Or ${WATCH_FONT_SIZE_RANGE.min} to ${WATCH_FONT_SIZE_RANGE.max}.</div>
    ${menuField("Weight", watchFontWeightMenu(t.fontWeight), (v) => commit(host, "fontWeight", (d) => setWatchTileFontWeight(d, host.pageId, host.tileId, v)))}
    ${menuField("Design", watchFontDesignMenu(t.fontDesign), (v) => commit(host, "fontDesign", (d) => setWatchTileFontDesign(d, host.pageId, host.tileId, v)))}
    ${checkField("Text shadow", t.textShadow, (on) => commit(host, "textShadow", (d) => setWatchTileTextShadow(d, host.pageId, host.tileId, on)))}
    ${typingField(host, "labelColor", html`<div class="ts-no-alpha">${colorField("Label color", labelColor, setLabelColor, true, undefined, { switchOn: t.labelColor !== undefined })}</div>`)}
    <div class="hint ts-under">${t.labelColor === undefined ? "Off: the theme's label color." : "On: this color. Switch it off for the theme's."}</div>`;
}

// ── action ───────────────────────────────────────────────────────────────

function renderAction(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const a = watchTileActionSettings(tile);
  const ask = html`
    ${checkField("Ask before running", a.askBeforeRunning.value, (on) =>
      commit(host, "askBeforeRunning", (d) => setWatchTileAskBeforeRunning(d, host.pageId, host.tileId, on)))}
    <div class="hint ts-under">${watchAskBeforeRunningNote(tile)}
      ${a.askBeforeRunning.stored === undefined
        ? nothing
        : linkButton("Use the default", "Remove this tile's own setting", () =>
            commit(host, "askBeforeRunning", (d) => setWatchTileAskBeforeRunning(d, host.pageId, host.tileId, null)))}</div>`;
  // A rule's style holds the confirmation and no other action key.
  if (host.domainStyle === true) return ask;
  const tap = watchSingleTapMenu(tile);
  const slides = watchHoldSlideMenus(tile, host.catalog);
  return html`
    ${tap === undefined
      ? nothing
      : menuField("Single tap", tap, (v) =>
          commit(host, "singleTap", (d) => setWatchTileSingleTap(d, host.pageId, host.tileId, v === WATCH_DEFAULT_CHOICE ? null : v)))}
    ${slides === undefined ? nothing : renderHoldSlide(host, slides)}
    ${ask}
    ${checkField("Hide when off", a.hideWhenOff, (on) => commit(host, "hideWhenOff", (d) => setWatchTileHideWhenOff(d, host.pageId, host.tileId, on)))}
    <div class="hint ts-under">The watch leaves the tile out while it is off.</div>
    ${a.skipConditions.shown
      ? html`<div class="ts-stack">${segField<WatchSkipChoice>("Skip conditions", watchSkipChoice(a.skipConditions.value), WATCH_SKIP_CHOICES as [WatchSkipChoice, string][], (v) =>
          commit(host, "skipConditions", (d) => setWatchTileSkipConditions(d, host.pageId, host.tileId, watchSkipValue(v))))}</div>
          <div class="hint">Whether running the automation from the watch skips its conditions. Default follows the iPhone app.</div>`
      : nothing}`;
}

function renderHoldSlide(host: TileSettingsHost, slides: NonNullable<ReturnType<typeof watchHoldSlideMenus>>): TemplateResult {
  const setDirection = (direction: WatchSlideDirection, value: string) => {
    // An HTTP action's entry sets the action and its target in one edit,
    // so no direction is ever saved as Run HTTP Action with nothing to run.
    const http = watchHTTPSlideChoice(value);
    if (http !== undefined) {
      return commit(host, `slide:${direction}`, (d) =>
        findWatchCatalogEntry(host.catalog, "httpAction", http) === undefined ? d : setWatchTileHoldSlideHTTP(d, host.pageId, host.tileId, direction, http));
    }
    commit(host, `slide:${direction}`, (d) => setWatchTileHoldSlide(d, host.pageId, host.tileId, direction, value === WATCH_DEFAULT_CHOICE ? null : value));
  };
  return html`<div class="ts-sub">
    <div class="ts-sub-h">
      <span>Hold and slide</span>
      ${slides.anyStored && slides.readable
        ? linkButton("Reset all", "Every direction back to its default", () => commit(host, "slide", (d) => clearWatchTileHoldSlide(d, host.pageId, host.tileId)))
        : nothing}
    </div>
    ${slides.readable
      ? nothing
      : html`<div class="hint warn">This tile's hold and slide settings could not be read here. They are kept as they are; change them in the iPhone app.</div>`}
    <fieldset class="ts-plain" ?disabled=${!slides.readable}>
      ${slides.rows.map((row) => html`
        ${menuField(row.title, row, (v) => setDirection(row.direction, v))}
        ${row.trigger === undefined ? nothing : renderTrigger(host, row.direction, row.trigger)}
        ${row.http === undefined ? nothing : renderSlideBanner(host, row.direction, row.http)}
        ${fieldNote(host, `slide:${row.direction}`)}`)}
    </fieldset>
    <div class="hint ts-under">Hold the tile, then slide. None turns a default off.</div>
  </div>`;
}

/** A Run HTTP Action direction's banner: on or off, and for how long. */
function renderSlideBanner(host: TileSettingsHost, direction: WatchSlideDirection, http: WatchHTTPSlideRow): TemplateResult {
  const setting = `slideBanner:${direction}`;
  return html`<div class="ts-nested">
    ${checkField("Show the reply", http.banner, (on) =>
      commit(host, setting, (d) => setWatchTileHoldSlideHTTPBanner(d, host.pageId, host.tileId, direction, on)))}
    ${http.banner
      ? menuField("Banner for", http.seconds, (v) =>
          commit(host, `${setting}:seconds`, (d) => setWatchTileHoldSlideHTTPBannerSeconds(d, host.pageId, host.tileId, direction, Number(v))))
      : html`<div class="hint ts-under">Off: the slide runs the action with no banner. Failures still show.</div>`}
    ${fieldNote(host, setting)}
  </div>`;
}

function renderTrigger(
  host: TileSettingsHost,
  direction: WatchSlideDirection,
  trigger: NonNullable<NonNullable<ReturnType<typeof watchHoldSlideMenus>>["rows"][number]["trigger"]>,
): TemplateResult {
  const setting = `trigger:${direction}`;
  const ref: EntityRef = {
    entityId: trigger.entityId,
    displayName: trigger.entityId === "" ? "" : watchTriggerEntityName(trigger.entityId, trigger.friendlyName, host.hass.states),
    domain: tileKind(trigger.entityId),
  };
  const pick = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "" || id === trigger.entityId) return;
    if (!isWatchTriggerTarget(id)) {
      return commit(host, setting, (d) => d, { reason: `A trigger cannot run ${tileKind(id) === "" ? "that" : `a ${tileKind(id)} entity`}. Pick a light, switch, scene, script or another entity it can act on.` });
    }
    const friendly = host.hass.states[id]?.attributes?.friendly_name;
    const name = typeof friendly === "string" && friendly.trim() !== "" ? friendly : undefined;
    commit(host, setting, (d) => setWatchTileHoldSlideTarget(d, host.pageId, host.tileId, direction, id, name));
  };
  return html`<div class="ts-nested">
    <div class="ts-stack">${entityField({ hass: host.hass }, "Runs", ref, pick, `pe:ts:trigger:${direction}`, { domain: WATCH_TRIGGER_TARGET_DOMAINS, clearable: false })}</div>
    ${trigger.modes === undefined
      ? html`<div class="hint warn ts-under">This does nothing until an entity is picked. Saved without one, it is saved as None.</div>`
      : menuField("Mode", trigger.modes, (v) =>
          commit(host, `${setting}:mode`, (d) => setWatchTileHoldSlideTargetMode(d, host.pageId, host.tileId, direction, v)))}
    ${fieldNote(host, setting)}
  </div>`;
}

// ── header ───────────────────────────────────────────────────────────────

const HEADER_STYLES: [string, string][] = [
  ["line", "Line"],
  ["label", "Label"],
];

function renderHeader(host: TileSettingsHost): TemplateResult {
  const h = watchHeaderSettings(host.tile);
  if (h === undefined) return html``;
  const theme = watchAddThemeOf(host.page);
  const defaultColor = kindDefaults(host).color;
  const label = typed(host, "headerLabel") ?? h.label ?? "";
  const textSize = typedNumber(typed(host, "headerTextSize"), h.textSize);
  const setTextSize = (v: number | undefined) =>
    commit(host, "headerTextSize", (d) => setWatchHeaderTextSize(d, host.pageId, host.tileId, v ?? null), { typing: true, ...(v === undefined ? {} : reasonOf(watchHeaderTextSizeRefusal(v))) });
  const glow = typedNumber(typed(host, "headerGlow"), watchGlowPercent(h.glow)) ?? 0;
  const setGlow = (v: number) => {
    const percent = Math.max(0, Math.min(100, Math.round(v / 5) * 5));
    commit(host, "headerGlow", (d) => setWatchHeaderGlow(d, host.pageId, host.tileId, percent / 100), { typing: true });
  };
  const writeColor = (v: string, typing = false) =>
    commit(host, "headerColor", (d) => setWatchHeaderColor(d, host.pageId, host.tileId, v), { typing });
  const custom = (v: string | undefined) => {
    const reason = watchColorRefusal(v);
    if (reason !== undefined || v === undefined) return commit(host, "headerColor", (d) => d, { reason: reason ?? "Pick a color." });
    writeColor(v, true);
  };
  const atDefault = defaultColor !== undefined && sameWatchColor(h.color, defaultColor);
  return html`
    ${segField("Style", h.style, HEADER_STYLES as ["line" | "label", string][], (v) =>
      commit(host, "headerStyle", (d) => setWatchHeaderStyle(d, host.pageId, host.tileId, v)))}
    ${h.style === "label"
      ? html`
        ${typingField(host, "headerLabel", textField("Label", label, (v) =>
          commit(host, "headerLabel", (d) => setWatchHeaderLabel(d, host.pageId, host.tileId, v), { typing: true }), { placeholder: h.domain === "custom" || h.domain === "" ? "Header" : h.domain }))}
        ${typingField(host, "headerTextSize", html`<div class="ts-with-link">
          ${numberField("Text size", textSize, setTextSize, { step: 1, min: WATCH_HEADER_TEXT_SIZE_RANGE.min, max: WATCH_HEADER_TEXT_SIZE_RANGE.max, optional: true, placeholder: `Auto`, unit: "pt" })}
          ${h.textSize === undefined ? nothing : linkButton("Auto", `Back to ${WATCH_HEADER_TEXT_SIZE_RANGE.auto} pt`, () => commit(host, "headerTextSize", (d) => setWatchHeaderTextSize(d, host.pageId, host.tileId, null)))}
        </div>`, h.textSize)}
        <div class="hint ts-under">Empty is Auto (${WATCH_HEADER_TEXT_SIZE_RANGE.auto} pt). Or ${WATCH_HEADER_TEXT_SIZE_RANGE.min} to ${WATCH_HEADER_TEXT_SIZE_RANGE.max}.</div>`
      : html`<div class="hint ts-under">A line across the page. Pick Label for words between two lines.</div>`}
    ${typingField(host, "headerGlow", sliderField("Line glow", glow, setGlow, { min: 0, max: 100, step: 5, def: 0, unit: "%" }), watchGlowPercent(h.glow))}
    <div class="ts-sub-h"><span>Color</span></div>
    <div class="ts-swatch-row">
      ${swatchRow(`${watchThemeDisplayName(theme)} colors`, watchThemeSwatches(theme, false), h.color, (v) => writeColor(v))}
    </div>
    ${typingField(host, "headerColor", html`<div class="ts-no-alpha">${colorField("Custom", typed(host, "headerColor") ?? watchCustomBoxColor(h.color), custom)}</div>`)}
    ${defaultColor === undefined
      ? nothing
      : html`<div class="ts-after"><button type="button" class="pe-chip ${atDefault ? "on" : ""}" aria-pressed=${atDefault ? "true" : "false"}
          title=${`The header's own color: ${defaultColor}`} @click=${() => writeColor(defaultColor)}>Default color</button></div>`}`;
}

// ── styling: shared rows ─────────────────────────────────────────────────

type Edit<V> = (document: WatchPagesDocument, pageId: string, tileId: string, value: V) => WatchPagesDocument;

/** A styling enum: buttons for up to four values, a menu for more. A
 * stored value the table does not offer is shown, not offered. */
export function stylingEnumField(label: string, enumName: string, value: string, pick: (v: string) => void): TemplateResult {
  const choices = watchStylingChoices(enumName);
  if (choices.length <= 4 && choices.some((c) => c.value === value)) {
    return segField(label, value, choices.map((c) => [c.value, c.label] as [string, string]), (v) => pick(v));
  }
  return menuField(label, watchChoiceMenu(choices, value), pick);
}

function enumRow(host: TileSettingsHost, setting: string, label: string, enumName: string, value: string, set: Edit<string>): TemplateResult {
  return stylingEnumField(label, enumName, value, (v) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, v)));
}

function boolRow(host: TileSettingsHost, setting: string, label: string, value: boolean, set: Edit<boolean>): TemplateResult {
  return checkField(label, value, (on) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, on)));
}

/** A slider from the table, its edits one undo step per drag or run of
 * typing; the dot goes back to the task's reset value when it has one. */
function sliderRow(
  host: TileSettingsHost,
  setting: string,
  label: string,
  sliderName: string,
  value: number,
  set: Edit<number>,
  options: { reset?: unknown; percent?: boolean } = {},
): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  const def = typeof options.reset === "number" ? options.reset : (spec.auto ?? spec.min);
  const format = options.percent ? (v: number) => `${Math.round(v * 100)}%` : undefined;
  return typingField(host, setting, sliderField(label, value, (v) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, v), { typing: true }), {
    min: spec.min,
    max: spec.max,
    step: spec.step,
    def,
    ...(format === undefined ? {} : { format }),
  }), value);
}

/** A whole number slider with an Auto button (`null` removes the key). */
function autoSizeRow(host: TileSettingsHost, setting: string, label: string, sliderName: string, value: number | undefined, set: Edit<number | null>): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  const shown = typedNumber(typed(host, setting), value);
  const write = (v: number | undefined) =>
    commit(host, setting, (d) => set(d, host.pageId, host.tileId, v ?? null), {
      typing: true,
      ...(v === undefined ? {} : reasonOf(watchWholeRefusal(v, spec.min, spec.max))),
    });
  return html`${typingField(host, setting, html`<div class="ts-with-link">
      ${numberField(label, shown, write, { step: 1, min: spec.min, max: spec.max, optional: true, placeholder: `Auto (${spec.auto ?? ""})`, unit: "pt" })}
      ${value === undefined ? nothing : linkButton("Auto", "Let the watch size it", () => commit(host, setting, (d) => set(d, host.pageId, host.tileId, null)))}
    </div>`, value)}`;
}

/** The value a task's reset writes for a key. */
function resetValue(task: WatchTileStylingTask, key: string): unknown {
  return watchStylingReset(task)[key];
}

/** Whether a task's Reset is offered and its section reads "Changed": on a
 * tile while the reset would change it, on a rule's style while the style
 * holds one of the task's keys. */
function taskModified(host: TileSettingsHost, task: WatchTileStylingTask): boolean {
  return host.domainStyle === true ? watchTileTaskHeld(host.tile, task) : watchTileTaskModified(host.tile, task);
}

/** A task's Reset, shown while `taskModified`. On a tile it writes the
 * phone's reset values; on a rule's style it removes the task's keys, so
 * each reads as the watch's own default. */
function resetRow(host: TileSettingsHost, task: WatchTileStylingTask, words: string): TemplateResult | typeof nothing {
  if (!taskModified(host, task)) return nothing;
  const domain = host.domainStyle === true;
  return html`<div class="ts-after ts-reset">${linkButton(`Reset ${words}`,
    domain ? `Remove every ${words.toLowerCase()} setting from the rule, so the watch draws its own` : `Put every ${words.toLowerCase()} setting back as the iPhone app's reset does`, () =>
    commit(host, `reset:${task}`, (d) => (domain ? clearWatchTileTask : resetWatchTileTask)(d, host.pageId, host.tileId, task)))}</div>`;
}

/**
 * A color of a styling task: Solid or Gradient (and Rainbow where the phone
 * offers it), the page theme's swatches in that form, a custom color, and a
 * chip for no color of its own (the key removed). With no color stored the
 * swatches follow the page's Solid or Gradient switch until a form is
 * picked.
 */
/** What a styling palette needs: its color, read when an edit is made (two
 * edits in one task must not start from the color drawn), and its setter. */
export interface StylingPaletteSource {
  color: () => string | undefined;
  write: (document: WatchPagesDocument, value: string | null) => WatchPagesDocument;
}

/**
 * The edits of a styling palette, each reading the color when it is made.
 * `gradient()` is whether the swatches show their gradient form. Solid or
 * Gradient on a rainbow writes the kind's color in that form, as the tile
 * color does; with no color stored it only turns the swatches.
 */
export function stylingPaletteActions(host: TileSettingsHost, setting: string, source: StylingPaletteSource) {
  const formKey = `${KEY}:form:${host.tileId.toUpperCase()}:${setting}`;
  const gradient = (): boolean => {
    const mode = watchColorModeChoice(source.color());
    const chosen = host.uiState.get(formKey);
    return mode === "gradient" || ((mode === "none" || mode === "rainbow") && (chosen === "gradient" || (chosen === undefined && watchAddUsesGradient(host.page))));
  };
  const write = (value: string | null, typing = false) => commit(host, setting, (d) => source.write(d, value), { typing });
  const pickMode = (next: WatchColorModeChoice): void => {
    if (next === "rainbow") return write("#RAINBOW");
    if (next !== "solid" && next !== "gradient") return;
    const now = source.color();
    const mode = watchColorModeChoice(now);
    if (mode === "none") {
      host.uiState.set(formKey, next);
      host.requestUpdate();
      return;
    }
    const fallback = mode === "rainbow" ? (kindDefaults(host).color ?? watchThemeSwatches(watchPageSwatchTheme(host.page), false)[0]) : undefined;
    const value = watchColorForMode(now, next, fallback, watchGradientOf);
    if (value !== undefined) write(value);
  };
  const custom = (value: string | undefined): void => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(gradient() ? watchGradientOf(value) : value, true);
  };
  return { gradient, pickMode, custom, swatch: (value: string) => write(value), clear: () => write(null) };
}

function stylingPalette(
  host: TileSettingsHost,
  setting: string,
  opts: StylingPaletteSource & {
    label: string;
    rainbow: boolean;
    absentLabel: string;
    absentTitle: string;
  },
): TemplateResult {
  const color = opts.color();
  const mode = watchColorModeChoice(color);
  const act = stylingPaletteActions(host, setting, opts);
  const gradient = act.gradient();
  const theme = watchPageSwatchTheme(host.page);
  const swatches = watchThemeSwatches(theme, gradient);
  const modes = (WATCH_COLOR_MODES as [WatchColorModeChoice, string][]).filter(([m]) => m !== "rainbow" || opts.rainbow);
  const shownMode = mode === "none" ? (gradient ? "gradient" : "solid") : mode;
  return html`
    <div class="ts-sub-h"><span>${opts.label}</span></div>
    ${segField<WatchColorModeChoice>("Form", shownMode, modes, (v) => act.pickMode(v))}
    <div class="ts-swatch-row">${swatchRow(`${opts.label}: ${watchThemeDisplayName(theme)} colors`, swatches, color, act.swatch)}</div>
    ${typingField(host, setting, html`<div class="ts-no-alpha">${colorField("Custom", typed(host, setting) ?? watchCustomBoxColor(color), act.custom)}</div>`)}
    <div class="ts-after">
      <button type="button" class="pe-chip ${color === undefined ? "on" : ""}" aria-pressed=${color === undefined ? "true" : "false"}
        title=${opts.absentTitle} @click=${act.clear}>${opts.absentLabel}</button>
    </div>`;
}

// ── styling: State ───────────────────────────────────────────────────────

/** The words of each State row; the rows and their order are the table's. */
const STATE_ROW_LABELS: Readonly<Record<string, string>> = {
  showTargetTempOnTile: "Target temperature",
  showCurrentTempOnTile: "Current temperature",
  statusTextShadow: "Text shadow",
  stateValueLabelStyle: "Value",
  decimalPlaces: "Decimals",
  badgeFontSizeOverride: "Size",
  stateBarStyle: "Bar",
  stateBarColorStyle: "Bar color",
  stateBarBorder: "Bar border",
  stateBarShadow: "Bar shadow",
  showActivityStatus: "Show status badge",
  statusIconSizeOverride: "Icon size",
};

function renderStateRow(host: TileSettingsHost, row: WatchStateRow): TemplateResult | typeof nothing {
  const label = STATE_ROW_LABELS[row.key] ?? row.key;
  const setters = WATCH_STATE_ROW_SETTERS as Record<string, Edit<never>>;
  const set = setters[row.key];
  if (set === undefined) return nothing;
  switch (row.key) {
    case "stateValueLabelStyle":
    case "stateBarStyle":
    case "stateBarColorStyle":
      return enumRow(host, row.key, label, row.key, String(row.value), set as Edit<string>);
    case "decimalPlaces": {
      const { options } = watchDecimalOptions();
      return segField(label, String(row.value), options.map((n) => [String(n), String(n)] as [string, string]), (v) =>
        commit(host, row.key, (d) => (set as Edit<number>)(d, host.pageId, host.tileId, Number(v))));
    }
    case "badgeFontSizeOverride":
    case "statusIconSizeOverride":
      return autoSizeRow(host, row.key, label, row.key, typeof row.value === "number" ? row.value : undefined, set as Edit<number | null>);
    default:
      return boolRow(host, row.key, label, row.value === true, set as Edit<boolean>);
  }
}

/** The State rows a rule's style cannot hold: the phone fixes both on for
 * a domain. */
const NO_DOMAIN_STATE_ROWS: ReadonlySet<string> = new Set(["showTargetTempOnTile", "showCurrentTempOnTile"]);

function renderState(host: TileSettingsHost): TemplateResult {
  const domain = host.domainStyle === true;
  const cards = watchTileStateCards(host.tile)
    .map((card) => (domain ? { ...card, rows: card.rows.filter((row) => !NO_DOMAIN_STATE_ROWS.has(row.key)) } : card))
    .filter((card) => !domain || card.rows.length > 0);
  if (cards.length === 0) return html`<p class="hint">${watchStateEmptyText()}</p>`;
  return html`
    ${cards.map((card) => html`
      <div class="ts-sub-h"><span>${card.title}</span></div>
      ${card.rows.map((row) => renderStateRow(host, row))}
      ${card.subtitle === "" ? nothing : html`<div class="hint ts-under">${card.subtitle}.</div>`}`)}
    ${resetRow(host, "state", "State")}`;
}

// ── styling: State Icons and Colors ──────────────────────────────────────

interface StateEditing {
  state: string;
  what: "icon" | "color";
}

function stateEditKey(host: TileSettingsHost): string {
  return `${KEY}:stateEdit:${host.tileId.toUpperCase()}`;
}

/** The card under Icon and color: one row per state of the domain, narrowed
 * by the entity's live attributes. Nothing for a domain with no states. */
function renderStateIcons(host: TileSettingsHost): TemplateResult | typeof nothing {
  const entityId = tileEntityId(host.tile);
  const attributes = host.hass.states[entityId]?.attributes;
  const card = watchTileStateIcons(host.tile, attributes);
  if (card === undefined || card.rows.length === 0) return nothing;
  const raw = host.uiState.get(stateEditKey(host));
  const editing = typeof raw === "object" && raw !== null ? (raw as StateEditing) : undefined;
  const tileColor = watchTileIconSettings(host.tile).color;
  const tileIcon = watchTileIconSettings(host.tile).icon;
  const toggleEdit = (state: string, what: StateEditing["what"]) => {
    const same = editing?.state === state && editing.what === what;
    if (same) host.uiState.delete(stateEditKey(host));
    else host.uiState.set(stateEditKey(host), { state, what });
    host.endCoalesce();
    host.requestUpdate();
  };
  return html`<div class="ts-sub">
    <div class="ts-sub-h"><span>State icons and colors</span><span class="ts-faint">Optional</span></div>
    ${card.rows.map((row) => {
      const ink = watchColorEnds(row.color ?? tileColor)?.from ?? "#FFFFFF";
      const symbol = row.icon ?? (tileIcon !== undefined && tileIcon !== "" ? tileIcon : row.defaultIcon);
      const glyph = symbol === undefined ? undefined : host.icons.render(symbol, 18, ink);
      const open = editing?.state === row.key ? editing.what : undefined;
      return html`<div class="ts-state-row ${row.overridden ? "own" : ""}">
          <span class="ts-state-glyph" aria-hidden="true">${glyph ?? html`<span class="ts-glyph-dot"></span>`}</span>
          <span class="ts-state-label">${row.label}</span>
          <button type="button" class="ts-swatch ts-state-color ${open === "color" ? "on" : ""}" aria-expanded=${open === "color" ? "true" : "false"}
            title=${row.color === undefined ? `${row.label}: the tile's color` : `${row.label}: ${row.color}`} aria-label=${`${row.label} color`}
            style=${`--sw:${row.color === undefined ? "transparent" : `linear-gradient(135deg, ${watchColorEnds(row.color)?.from ?? ink}, ${watchColorEnds(row.color)?.to ?? ink})`}`}
            @click=${() => toggleEdit(row.key, "color")}></button>
          <button type="button" class="pe-chip ts-state-icon ${open === "icon" ? "on" : ""}" aria-expanded=${open === "icon" ? "true" : "false"}
            title=${row.icon === undefined ? `${row.label}: no icon of its own` : `${row.label}: ${row.icon}`}
            @click=${() => toggleEdit(row.key, "icon")}>Icon</button>
          ${row.overridden
            ? html`<button type="button" class="pe-icon-btn ts-state-reset" title=${`${row.label}: back to the tile's icon and color`} aria-label=${`Reset ${row.label}`}
                @click=${() => commit(host, `state:${row.key}`, (d) => resetWatchTileState(d, host.pageId, host.tileId, row.key))}>${uiIcon("undo")}</button>`
            : html`<span class="ts-state-reset"></span>`}
        </div>
        ${open === "icon" ? renderStateIconPicker(host, row.key, row.icon) : nothing}
        ${open === "color" ? renderStateColorPicker(host, row.key, row.color) : nothing}`;
    })}
    ${card.any
      ? html`<div class="ts-after">${linkButton("Clear state overrides", "Every state back to the tile's icon and color", () => {
          host.uiState.delete(stateEditKey(host));
          commit(host, "stateClear", (d) => clearWatchTileStateOverrides(d, host.pageId, host.tileId));
        })}</div>`
      : nothing}
    <div class="hint ts-under">An icon or color per state. A state with none uses the tile's.</div>
  </div>`;
}

function renderStateIconPicker(host: TileSettingsHost, state: string, icon: string | undefined): TemplateResult {
  const setting = `stateIcon:${state}`;
  return html`<div class="ts-nested">${typingField(host, setting, symbolField(
    { icons: host.icons, symbols: host.symbols },
    typed(host, setting) ?? icon ?? "",
    (name) => {
      const value = name.trim();
      if (value === "") return;
      commit(host, setting, (d) => setWatchTileStateIcon(d, host.pageId, host.tileId, state, value), { typing: true });
    },
    `pe:ts:state:${state}`,
    undefined,
    "Symbol",
    true,
  ))}</div>`;
}

function renderStateColorPicker(host: TileSettingsHost, state: string, color: string | undefined): TemplateResult {
  const setting = `stateColor:${state}`;
  const theme = watchPageSwatchTheme(host.page);
  const write = (value: string | null, typing = false) =>
    commit(host, setting, (d) => setWatchTileStateColor(d, host.pageId, host.tileId, state, value), { typing });
  const custom = (value: string | undefined) => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(value, true);
  };
  return html`<div class="ts-nested">
    <div class="ts-swatch-row">${swatchRow(`${watchThemeDisplayName(theme)} colors`, watchThemeSwatches(theme, false), color, (v) => write(v))}</div>
    ${typingField(host, setting, html`<div class="ts-no-alpha">${colorField("Custom", typed(host, setting) ?? watchCustomBoxColor(color), custom)}</div>`)}
    <div class="ts-after"><button type="button" class="pe-chip ${color === undefined ? "on" : ""}" aria-pressed=${color === undefined ? "true" : "false"}
      title="No color of its own: the tile's color" @click=${() => write(null)}>Default</button></div>
  </div>`;
}

// ── styling: Border ──────────────────────────────────────────────────────

// A spacer and a header show only what the watch draws of them, which is a
// departure from the phone: it shows every Border and Background row on
// them, and most do nothing there. The watch's `SpacerTile` reads the color,
// the pattern and `borderThickness` (a solid border at any thickness but
// none, whatever the style says); its `DividerTile` reads no Border or
// Background key at all, so a header has neither section
// (`watchTileSettingsSections`).

function renderBorder(host: TileSettingsHost): TemplateResult {
  const b = watchTileBorderSettings(host.tile);
  const reset = (key: string) => resetValue("border", key);
  if (tileKind(tileEntityId(host.tile)) === "spacer") {
    return html`
      ${enumRow(host, "borderThickness", "Thickness", "borderThickness", b.thickness, setWatchTileBorderThickness)}
      <div class="hint ts-under">A spacer draws a plain line in its own color at this thickness. The other border settings do nothing on it.</div>
      ${resetRow(host, "border", "Border")}`;
  }
  return html`
    ${enumRow(host, "borderStyle", "Style", "borderStyle", b.style, setWatchTileBorderStyle)}
    ${b.style === "line" ? html`
      ${enumRow(host, "borderThickness", "Thickness", "borderThickness", b.thickness, setWatchTileBorderThickness)}
      ${enumRow(host, "borderLineStyle", "Line style", "borderLineStyle", b.lineStyle, setWatchTileBorderLineStyle)}
      ${sliderRow(host, "borderGlow", "Glow", "borderGlow", b.glow, setWatchTileBorderGlow, { reset: reset("borderGlow"), percent: true })}` : nothing}
    ${b.style === "animate" ? html`
      ${enumRow(host, "borderAnimation", "Animation", "borderAnimation", b.animation, setWatchTileBorderAnimation)}
      ${b.animation === "none" ? nothing : html`
        ${sliderRow(host, "borderSpeed", "Speed", "borderAnimationSpeed", b.speed, setWatchTileBorderSpeed, { reset: reset("borderAnimationSpeed") })}
        ${sliderRow(host, "borderIntensity", "Intensity", "borderAnimationIntensity", b.intensity, setWatchTileBorderIntensity, { reset: reset("borderAnimationIntensity") })}
        ${sliderRow(host, "borderSize", "Size", "borderAnimationSize", b.size, setWatchTileBorderSize, { reset: reset("borderAnimationSize") })}`}` : nothing}
    ${b.style === "none" ? nothing : html`
      ${boolRow(host, "borderActiveOnly", "Only when on", b.activeOnly, setWatchTileBorderActiveOnly)}
      ${stylingPalette(host, "borderColor", {
        label: "Border color",
        color: () => watchTileBorderSettings(host.tile).color,
        rainbow: true,
        absentLabel: "Tile color",
        absentTitle: "No color of its own: the border takes the tile's color",
        write: (d, v) => setWatchTileBorderColor(d, host.pageId, host.tileId, v),
      })}`}
    ${resetRow(host, "border", "Border")}`;
}

// ── styling: Background ──────────────────────────────────────────────────

function renderBackground(host: TileSettingsHost): TemplateResult {
  const g = watchTileBackgroundSettings(host.tile);
  const reset = (key: string) => resetValue("background", key);
  return html`
    <div class="ts-sub-h"><span>Pattern</span></div>
    ${enumRow(host, "pattern", "Pattern", "backgroundPattern", g.pattern, setWatchTilePattern)}
    ${g.pattern === "none" ? nothing : html`
      ${sliderRow(host, "patternOpacity", "Opacity", "patternOpacity", g.patternOpacity, setWatchTilePatternOpacity, { reset: reset("patternOpacity"), percent: true })}
      ${sliderRow(host, "patternScale", "Size", "patternScale", g.patternScale, setWatchTilePatternScale)}
      ${stylingPalette(host, "patternColor", {
        label: "Pattern color",
        color: () => watchTileBackgroundSettings(host.tile).patternColor,
        rainbow: false,
        absentLabel: "Default gray",
        absentTitle: "No color of its own: the watch draws the pattern in gray",
        write: (d, v) => setWatchTilePatternColor(d, host.pageId, host.tileId, v),
      })}`}
    ${tileKind(tileEntityId(host.tile)) === "spacer" ? resetRow(host, "background", "Background") : renderEffect(host, g, reset)}`;
}

function renderEffect(host: TileSettingsHost, g: ReturnType<typeof watchTileBackgroundSettings>, reset: (key: string) => unknown): TemplateResult {
  return html`
    <div class="ts-sub-h"><span>Effect</span></div>
    ${enumRow(host, "effect", "Effect", "tileAnimation", g.effect, setWatchTileEffect)}
    ${g.effect === "none" ? nothing : html`
      ${boolRow(host, "effectActiveOnly", "Only when on", g.effectActiveOnly, setWatchTileEffectActiveOnly)}
      ${stylingPalette(host, "effectColor", {
        label: "Effect color",
        color: () => watchTileBackgroundSettings(host.tile).effectColor,
        rainbow: true,
        absentLabel: "Tile color",
        absentTitle: "No color of its own: the effect takes the tile's color",
        write: (d, v) => setWatchTileEffectColor(d, host.pageId, host.tileId, v),
      })}
      ${sliderRow(host, "effectSpeed", "Speed", "animationSpeed", g.speed, setWatchTileEffectSpeed, { reset: reset("animationSpeed") })}
      ${sliderRow(host, "effectIntensity", "Intensity", "animationIntensity", g.intensity, setWatchTileEffectIntensity, { reset: reset("animationIntensity") })}
      ${sliderRow(host, "effectSize", "Size", "animationSize", g.size, setWatchTileEffectSize, { reset: reset("animationSize") })}`}
    ${resetRow(host, "background", "Background")}`;
}

/** This module's rules, in the page editor's sheet after the shared form
 * rules and the editor's own. Prefix classes with `ts-`. */
export const tileSettingsStyles = css`
  /* The section cards are the shared inspector's (\`.sec\`, editor-chrome.ts);
     this only stacks them. */
  .ts-root { display: flex; flex-direction: column; }
  /* A removed kind's one line, where its tasks would be. */
  .ts-removed { margin: 6px 0 2px; }
  /* The Name card's box takes the header's free width, its line sits under. */
  .name-sec .sec-h > .ts-typing { flex: 1 1 auto; min-width: 0; display: flex; }
  .name-sec .sec-h > .ts-typing > input { flex: 1 1 auto; width: 0; min-width: 0; }
  .ts-name-b { display: flex; flex-direction: column; gap: 2px; }
  .ts-name-b > .hint { margin: 0; }
  .ts-entity { min-width: 0; font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* The row under the last card: Delete tile. */
  .ts-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  /* A fieldset only to switch every control off at once while a save is
     out; it draws nothing of its own. */
  fieldset.ts-body, fieldset.ts-plain { margin: 0; padding: 0; border: 0; min-width: 0; }
  fieldset.ts-body { display: flex; flex-direction: column; gap: 2px; padding: 2px 0 0; --wa-lab: 84px; }
  .ts-body .hint { margin: 0 0 4px; }
  .ts-body .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-nested .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); }
  .ts-note { padding-left: calc(var(--wa-lab) + 8px); }
  .ts-faint { color: var(--wa-muted); font-weight: 400; }

  .ts-icon-now { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 4px 0 6px; }
  .ts-glyph {
    flex: none; width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center;
    background: #1c1c1e; color: #fff; box-shadow: inset 0 0 0 1px var(--wa-line);
  }
  .ts-glyph svg { display: block; }
  .ts-glyph.none { color: rgba(255, 255, 255, .45); }
  .ts-glyph.none svg.ui-icon { width: 18px; height: 18px; }
  .ts-glyph-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, .55); }
  .ts-icon-name { min-width: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
    overflow-wrap: anywhere; }
  .ts-target-now { padding: 4px 0 2px; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
  .ts-chips, .ts-after { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px; }
  .ts-after { padding-left: calc(var(--wa-lab) + 8px); }

  .ts-swatch-row { padding: 2px 0 4px calc(var(--wa-lab) + 8px); }
  .ts-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
  .ts-swatch {
    width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
    background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
  }
  .ts-swatch:hover:not(:disabled) { transform: scale(1.12); }
  .ts-swatch.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ts-swatch:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  /* The watch has no opacity, so the panel's color box shows none. */
  .ts-no-alpha .color-box .alpha { display: none; }
  .ts-no-alpha .color-box { padding-right: 6px; }

  /* A row whose control needs the card's whole width: title above. */
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .ts-with-link { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .ts-with-link > .field { flex: 1; min-width: 0; }
  .ts-link { flex: none; font-size: 12px; }
  .hint .ts-link { margin-left: 4px; }

  .ts-sub { display: flex; flex-direction: column; gap: 2px; margin: 6px 0 4px; }
  .ts-sub-h { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-top: 6px;
    font-size: 11.5px; font-weight: 650; color: var(--wa-muted); letter-spacing: .02em; }
  .ts-nested { display: flex; flex-direction: column; gap: 2px; margin: 0 0 6px 12px; padding-left: 10px;
    border-left: 2px solid var(--wa-line); --wa-lab: 62px; }
`;
