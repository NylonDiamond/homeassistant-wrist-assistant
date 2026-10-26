// The selected tile's settings. The page editor's inspector stands them in
// four group panels under its head strip, Look, Text, Tap and Layout, each
// section under a calm heading (`renderTileInspector`); a smart page rule's
// style draws them as folding section cards (`renderTileSettings`,
// `sectionCard`, editor-chrome.ts). Place and size (rows the page editor
// hands in), icon and color, text, action, a header's look and a
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
// `hass` several times a second, and a merge from another save can change the
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
import { type EntityPickSource, checkField, colorField, entityField, numberField, segField, sliderField, symbolField, symbolNameSet, templateBox, textField } from "../editors.js";
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
import { watchDecimalOptions, watchStateEmptyText, watchStylingChoices, watchStylingLabel, watchStylingReset, watchStylingSlider, watchStylingTheme, watchTitleSwatches } from "./tile-styling.js";
import { watchPageSwatchTheme } from "./page-settings-model.js";
import { type ColorTrial, colorPickerView } from "./color-picker.js";
import { MIXED_WORD, acrossPicked, everyPicked, firstPicked, pickedMixed, somePicked } from "./multi-pick.js";
import type { SettingDevice } from "../watch-settings.js";
import { type TileSettingsHost, extendHost, hostDevice, hostDeviceNoun } from "./editor-host.js";
import { type FoldId, sectionOpen, setSectionOpen } from "./fold-memory.js";
import {
  type OneLookGlowMode,
  type OneLookGlyphGlow,
  ONE_LOOK_GLOW_BRIGHTNESS_RANGE,
  ONE_LOOK_GLOW_SIZE_RANGE,
  ONE_LOOK_NATIVE_GLOW,
  encodeOneLookGlyphGlow,
  oneLookHex,
  oneLookParseHex,
} from "./one-look/colour.js";
import { forgetSpecialStatus, renderSpecial, specialSummary, watchSpecialSectionTitle } from "./special-settings.js";
import { renderInboxLine, renderPhoneTileTask } from "./app-settings.js";
import { watchPhoneTileChanged, watchPhoneTileKindOf, watchPhoneTileSummary, watchPhoneTileTitle } from "./phone-tiles-model.js";
import { watchSpecialTask } from "./special-model.js";
import { findWatchPage } from "./edit.js";
import {
  type WatchShowWhenOperator,
  WATCH_SHOW_WHEN_OPERATORS,
  WATCH_SHOW_WHEN_TEMPLATE_MAX_CHARS,
  watchShowWhenPasses,
  watchShowWhenStateChoices,
  watchShowWhenTemplateShows,
  watchTileShowWhen,
  watchTileShowWhenTemplate,
} from "./show-when.js";
import { watchShowWhenTemplateRender } from "./app-model.js";
import { setWatchEditorLiveCameras, watchCameraRows, watchCameraStreamsFrom, watchEditorLiveCameras } from "./camera-live.js";
import { type WatchPageTile, type WatchPagesDocument, WATCH_REMOVED_TILE_TEXT, isVirtualTileKind, tileEntityId, tileKind, tileKindLabel, watchPageId, watchPageName, watchPagesOf } from "./model.js";
import { watchValueLabelStyle } from "./preview.js";
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
  editTile,
  withoutKey,
  isWatchTriggerTarget,
  setWatchHeaderColor,
  setWatchHeaderGlow,
  setWatchHeaderLabel,
  setWatchHeaderStyle,
  setWatchHeaderTextSize,
  setWatchPageLinkTarget,
  setWatchTileActiveIconAnimation,
  setWatchTileAskBeforeRunning,
  setWatchTileColor,
  setWatchTileDimWhenOff,
  setWatchTileFontDesign,
  setWatchTileFontSize,
  setWatchTileFontWeight,
  setWatchTileHideWhenOff,
  type WatchShowTileMode,
  setWatchTileShowAlways,
  setWatchTileShowWhenEntity,
  setWatchTileShowWhenOperator,
  setWatchTileShowWhenState,
  setWatchTileShowWhileOn,
  watchShowTileMode,
  setWatchTileHoldSlide,
  setWatchTileHoldSlideHTTP,
  setWatchTileHoldSlideHTTPBanner,
  setWatchTileHoldSlideHTTPBannerSeconds,
  setWatchTileHoldSlideTarget,
  setWatchTileHoldSlideTargetMode,
  setWatchTileIcon,
  setWatchTileIconDefault,
  setWatchTileIconGlow,
  setWatchTileIconShadow,
  setWatchTileIconSize,
  setWatchTileLabel,
  setWatchTileLabelColor,
  setWatchTilePeekSkipAnimation,
  setWatchTileShowLabel,
  setWatchTileShowWhenTemplate,
  setWatchTileSingleTap,
  setWatchTileSkipConditions,
  setWatchTileTapAnimation,
  setWatchTileTextShadow,
  watchHeaderSettings,
  watchPageLinkTarget,
  watchPeekSkipAnimation,
  watchSingleTapSettings,
  watchStorageIconName,
  watchTileActionSettings,
  watchTileArrange,
  watchTileIconGlow,
  watchTileIconSettings,
  watchTileTextSettings,
} from "./tile-settings-model.js";
import {
  type ChoiceTrial,
  type PictureChoiceSize,
  PATTERN_GROUND,
  barSample,
  borderSample,
  designSample,
  endTileTry,
  lineStyleLine,
  mixedWord,
  patternSwatch,
  pictureChoice,
  pictureChoiceStyles,
  thicknessLine,
  tilePictures,
  tileTrial,
  tryMenuField,
  tryTileEdit,
  valueSample,
  watchTileIn,
  weightSample,
} from "./picture-choice.js";
import { arrangeResetEdit, renderArrangeSection } from "./arrange-card.js";
import { arrangeFreeOn, arrangeOffered } from "./arrange-model.js";
import {
  type WatchHTTPSlideRow,
  type WatchMenu,
  type WatchMenuOption,
  type WatchSkipChoice,
  type WatchTileSettingsSection,
  WATCH_COLOR_MODES,
  WATCH_DEFAULT_CHOICE,
  WATCH_HTTP_REPLY_OFF,
  WATCH_SKIP_CHOICES,
  WATCH_TILE_SECTION_BADGES,
  WATCH_TILE_SETTINGS_SECTION_TITLES,
  isWatchStoredChoice,
  sameWatchColor,
  watchActiveAnimationNote,
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
  watchTileSectionsFor,
  watchTriggerEntityName,
  watchWholeRefusal,
  WATCH_PHONE_EXTRAS_HINT,
  WATCH_PHONE_KEY_WORDS,
  watchPhoneKeySummary,
  watchSensorChartMenu,
  watchSensorChartShortNote,
  watchTemplateLinesMenu,
} from "./tile-settings-options.js";
import {
  type WatchPhoneKey,
  WATCH_CAMERA_FULL_SCREEN_ABSENT,
  WATCH_CAMERA_FULL_SCREEN_CHOICES,
  WATCH_CAMERA_TILE_STREAM_ABSENT,
  WATCH_CAMERA_TILE_STREAM_CHOICES,
  setWatchCameraFullScreenStream,
  setWatchCameraTileLive,
  setWatchCameraTileStream,
  setWatchMediaArtwork,
  setWatchSensorChart,
  setWatchTemplateLines,
  watchCameraFullScreenStream,
  watchCameraTileLive,
  watchCameraTileStream,
  watchMediaArtwork,
  watchPhoneKeyChanged,
  watchPhoneKeysOf,
  watchSensorChart,
} from "./phone-keys-model.js";
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
import {
  ONE_LOOK_ANIMATE_REASON,
  ONE_LOOK_ARTWORK_NOTE,
  ONE_LOOK_CHART_NOTE,
  ONE_LOOK_DIM_LIGHT_NOTE,
  ONE_LOOK_DIM_OFF_REASON,
  ONE_LOOK_EXTRA_THIN_REASON,
  ONE_LOOK_RAINBOW_NOTE,
  ONE_LOOK_STATE_ICONS_NOTE,
  ONE_LOOK_TEXT_SHADOW_NOTE,
  ONE_LOOK_WEIGHT_NOTE,
  oneLookCardSubtitle,
  oneLookColorNote,
  oneLookDims,
  oneLookDrawsThickness,
  oneLookFontSizeHint,
  oneLookIconSizeHint,
  oneLookSectionOff,
  oneLookStateRowNote,
  oneLookStateRowOff,
  oneLookValueStylesOff,
} from "./one-look-settings.js";
import { requiredTileKeyDefault } from "./merge.js";

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
 * nothing. `typing` makes a run of edits from one field one undo step. With
 * several tiles picked, `make` runs once per picked tile with the host
 * pointed at it, so it must read the tile, its id and its values from the
 * host when it runs, never from the draw.
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
  // With several tiles picked, the edit is made on each of them, as one
  // step (`acrossPicked`).
  const next = acrossPicked(host, make)(host.document);
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

/** A small text button beside a row, for a way back to a default. */
export function linkButton(text: string, title: string, action: () => void): TemplateResult {
  return html`<button type="button" class="link ts-link" title=${title} @click=${action}>${text}</button>`;
}

// ── several tiles picked ─────────────────────────────────────────────────

/** A menu's value while the picked tiles differ: a stored choice, so a pick
 * of it is never written (`isWatchStoredChoice`). */
const MIXED_CHOICE = "stored:mixed";

/** The menu with Mixed first and on, while the picked tiles differ. */
function mixedMenu(menu: WatchMenu, mixed: boolean): WatchMenu {
  return mixed ? { ...menu, selected: MIXED_CHOICE, options: [{ value: MIXED_CHOICE, label: MIXED_WORD, disabled: true }, ...menu.options] } : menu;
}

/** A row whose picked tiles differ: its title says Mixed in grey, and the
 * number it shows is the primary tile's, so it is drawn faint (CSS,
 * `.ts-mixed-f`). */
function mixedRow(mixed: boolean, body: TemplateResult): TemplateResult {
  return mixed ? html`<div class="ts-mixed-f">${body}</div>` : body;
}

/** A switch, or while the picked tiles differ an indeterminate one with
 * Mixed in its title; a press sets every tile on. */
function checkRow(label: string, value: boolean, mixed: boolean, set: (on: boolean) => void): TemplateResult {
  if (!mixed) return checkField(label, value, set);
  return html`<label class="field check"><span>${label} ${mixedWord()}</span><input type="checkbox" .checked=${false} .indeterminate=${true}
    @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /></label>`;
}

/** The trial of a color picker: each swatch and chip tried through the edit
 * its press makes (`tryTileEdit`), the pill reading "`name`: color". */
function colorTrial(
  host: TileSettingsHost,
  name: string,
  edits: {
    swatch: (value: string) => (d: WatchPagesDocument) => WatchPagesDocument;
    default?: (d: WatchPagesDocument) => WatchPagesDocument;
    tile?: (d: WatchPagesDocument) => WatchPagesDocument;
  },
): ColorTrial {
  const { default: def, tile } = edits;
  return {
    swatch: (value, label) => tryTileEdit(host, edits.swatch(value), `${name}: ${label}`),
    ...(def === undefined ? {} : { default: () => tryTileEdit(host, def, `${name}: Default`) }),
    ...(tile === undefined ? {} : { tile: () => tryTileEdit(host, tile, `${name}: Tile color`) }),
    end: () => endTileTry(host),
  };
}

/** A section's Reset: a quiet button with the undo glyph, not a link, so it
 * reads as something to press rather than a line of text. */
export function resetButton(text: string, title: string, action: () => void): TemplateResult {
  return html`<button type="button" class="ghost ts-reset-btn" title=${title} @click=${action}>${uiIcon("undo")}${text}</button>`;
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

/** Whether the tile's color is its kind's default, what Default writes. A
 * rule's style only with no color of its own. */
function colorAtDefault(host: TileSettingsHost, color: string | undefined, defaultColor: string | undefined): boolean {
  return color === undefined || (host.domainStyle !== true && defaultColor !== undefined && sameWatchColor(color, defaultColor));
}

// ── sections ─────────────────────────────────────────────────────────────

/** What a caller hands `renderTileSettings` beyond its host: the sections to
 * draw instead of the tile's own (a smart page rule's style, or a page's tile
 * with its Size first), and the Size section's rows, which only such a caller
 * has, with whether they hold a value of their own (its changed dot), and
 * the large live tile the Arrangement section's parts are dragged on in
 * Free, which only the page editor draws. */
export interface TileSettingsExtras {
  sections?: readonly WatchTileSettingsSection[];
  size?: { summary: () => string; body: () => TemplateResult; changed?: () => boolean };
  arrangePicture?: () => TemplateResult | typeof nothing;
}

/** The sections a page's selected tile gets in the inspector: its place and
 * size first, as the page editor hands those rows in, then the tile's own on
 * the device showing the page (`watchTileSectionsFor`). */
export function tileInspectorSections(host: TileSettingsHost): WatchTileSettingsSection[] {
  return ["size", ...tileSections(host)];
}

/** Whether Layout offers the Arrangement section: a tile One Look draws
 * with its own icon, name and state. */
export function tileArrangeShown(host: TileSettingsHost): boolean {
  return oneLook(host) && host.domainStyle !== true && arrangeOffered(host.tile);
}

/** The tile's own sections on the device showing the page
 * (`watchTileSectionsFor`). */
function tileSections(host: TileSettingsHost): WatchTileSettingsSection[] {
  return watchTileSectionsFor(host.tile, host.hass.states, hostDevice(host));
}

/** Whether the settings speak for One Look (`one-look-settings.ts`): only
 * when the host says every device showing the page draws it. */
function oneLook(host: TileSettingsHost): boolean {
  return host.oneLook === true;
}

/** A control One Look does not draw: greyed, its stored value kept as it
 * is, with the reason under it. The disabled fieldset of hold and slide,
 * laid out as if it were not there. */
function greyed(reason: string, body: TemplateResult | typeof nothing): TemplateResult {
  return html`<fieldset class="ts-plain ts-off" disabled>${body}</fieldset><div class="hint keep ts-under">${reason}</div>`;
}

/** Whether the section is one line rather than a card: the webhook inbox's,
 * or a removed kind's. */
function inboxLine(host: TileSettingsHost, section: WatchTileSettingsSection): boolean {
  return section === "removed" || (section === "special" && watchSpecialTask(host.tile, host.hass.states)?.task === "inbox");
}

/** The one line a tile of a removed kind (a macro) gets in place of its
 * tasks. The tile stays as stored; it can still be moved or deleted. */
function renderRemovedLine(): TemplateResult {
  return html`<p class="hint keep ts-removed">${WATCH_REMOVED_TILE_TEXT}</p>`;
}

/** The folds the inspector's Collapse all turns: each of the sections that is
 * drawn as a card. */
export function tileSettingsFoldIds(host: TileSettingsHost, sections: readonly WatchTileSettingsSection[]): FoldId[] {
  return sections.filter((s) => !inboxLine(host, s)).map((section) => ({ module: KEY, section }));
}

/**
 * The host the tile's lines are written for. A tile only the iPhone draws
 * (a map, a web card) is never shown by a watch, so on a watch's editor its
 * lines name the iPhone too ("The iPhone picks the icon"), not a watch that
 * skips it. Any other tile keeps the host's device.
 */
export function tileWordsHost(host: TileSettingsHost): TileSettingsHost {
  if (hostDevice(host) === "iphone" || watchPhoneTileKindOf(host.tile) === undefined) return host;
  return extendHost(host, { device: (): SettingDevice => "iphone" });
}

/** The settings cards for `host.tile`, or nothing. */
export function renderTileSettings(watchHost: TileSettingsHost, extras: TileSettingsExtras = {}): TemplateResult | typeof nothing {
  const host = tileWordsHost(watchHost);
  const sections = (extras.sections ?? tileSections(host)).filter((s) => s !== "size" || extras.size !== undefined);
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
  const phoneKey = section === "phone" ? watchPhoneKeysOf(host.tile, host.hass.states)[0] : undefined;
  const phoneKind = section === "phoneTile" ? watchPhoneTileKindOf(host.tile) : undefined;
  const title = section === "special"
    ? watchSpecialSectionTitle(host)
    : phoneKey !== undefined ? WATCH_PHONE_KEY_WORDS[phoneKey].title
    : phoneKind !== undefined ? watchPhoneTileTitle(phoneKind) : WATCH_TILE_SETTINGS_SECTION_TITLES[section];
  const summary = open ? "" : section === "size" ? (extras.size?.summary() ?? "") : sectionSummary(host, section);
  const phone = section === "phone" || section === "phoneExtras" || section === "phoneTile";
  const badge = WATCH_TILE_SECTION_BADGES[section];
  const changed = section === "size" ? extras.size?.changed?.() === true : watchTileSectionChanged(host, section);
  // A fieldset only to switch every control off at once while a save is out.
  // Drawn only while open: a body is work, and the Icon one can edit.
  const body = open
    ? html`<fieldset class="ts-body" id=${`ts-body-${section}`} ?disabled=${host.busy} aria-label=${title}>${section === "size" ? (extras.size?.body() ?? nothing) : sectionBodyFor(host, section)}</fieldset>`
    : html``;
  return sectionCard({
    color: badge.color,
    icon: uiIcon(badge.icon),
    title,
    open,
    onToggle: () => toggle(host, section),
    ...(summary === "" ? {} : { summary }),
    ...(section === "phoneExtras" ? { help: WATCH_PHONE_EXTRAS_HINT } : {}),
    ...(phone ? { tag: phoneTag() } : {}),
    dot: changed,
    id: `${KEY}:${section}`,
  }, body);
}

/** The small iPhone tag on a card or group only the iPhone reads. */
function phoneTag(): TemplateResult {
  return html`<span class="ts-dev-tag" title="Only the iPhone reads this">${uiIcon("phone")}iPhone</span>`;
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
  icon: ["iconSizeOverride", "iconShadow", "iconGlow", "dimWhenOff", "activeIconAnimationEnabled", "iconTapAnimation", "stateIcons", "stateColors"],
  // The label is the Name card's, not this one's.
  text: ["showLabel", "labelFontSizeOverride", "labelFontWeight", "labelFontDesign", "labelShadow", "labelColorHex"],
  action: [
    "singleTapAction", "holdSlideActions", "holdSlideTriggerTargets", "holdSlideHTTPActionTargets", "holdSlideHTTPActionShowBanner",
    "holdSlideHTTPActionBannerSeconds", "requiresConfirmation", "automationSkipConditionOverride",
  ],
  // Show tile, every choice of it.
  visibility: ["hideWhenInactive", "showWhen", "showWhenTemplate"],
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
    return [s.iconSize, s.iconShadow, encodeOneLookGlyphGlow(watchTileIconGlow(t)), s.dimWhenOff.value, s.activeAnimation.value, s.tapAnimation, map(t.stateIcons), map(t.stateColors)];
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
    return [watchSingleTapSettings(t).resolvedLabel, a.askBeforeRunning.value, a.skipConditions.value, slides];
  },
  // A blank template is none, as on the watch.
  visibility: (t) => [t.hideWhenInactive === true, t.showWhen, watchTileShowWhenTemplate(t)],
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
    case "visibility":
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
    case "phone":
    case "phoneExtras":
      return watchPhoneKeysOf(tile, host.hass.states).some((key) => watchPhoneKeyChanged(tile, key));
    case "phoneTile":
      return watchPhoneTileChanged(tile);
    case "opens":
    case "target":
    case "special":
    case "size":
    case "removed":
      return false;
  }
}

// ── the tile inspector's groups ──────────────────────────────────────────

/** The four groups the tile inspector stands its settings in, always in
 * this order. */
export type TileInspectorGroup = "look" | "text" | "tap" | "layout";

/**
 * One section of the tile inspector, under one heading. Most are a settings
 * section as it is; the Icon and color section is split into its parts so
 * each stands under its own heading and its Tap animation goes to Tap:
 * `color`, `icon` (the symbol, the state icons, the icon's size and shadow),
 * `glow`, `whenOff` (Dim when off, Animate while on) and `tapAnimation`.
 * One is no settings section: `arrange`, the tile's Arrangement
 * (`arrange-card.ts`), in Layout after Size.
 */
export type TileInspectorPart = Exclude<WatchTileSettingsSection, "icon"> | "color" | "icon" | "glow" | "whenOff" | "tapAnimation" | "arrange";

/**
 * Where each part goes, as one table, in reading order. What a kind's own
 * task makes the tile show (a header's look, an iPhone tile's task, a
 * special task, an iPhone key) leads Look, before the color; a removed
 * kind's one line leads it too, standing for everything else. The iPhone
 * extras of a watch's editor close Look, as the aside they are. What a tap
 * does is Tap: a link's page, an HTTP action or status page and the reply
 * of its request, then the action, the tap's animation and Show tile.
 * Layout is the tile's size and place, then where its parts sit in it.
 */
export const TILE_INSPECTOR_PARTS: readonly (readonly [TileInspectorPart, TileInspectorGroup])[] = [
  ["removed", "look"],
  ["header", "look"],
  ["phoneTile", "look"],
  ["special", "look"],
  ["phone", "look"],
  ["color", "look"],
  ["icon", "look"],
  ["glow", "look"],
  ["whenOff", "look"],
  ["background", "look"],
  ["border", "look"],
  ["phoneExtras", "look"],
  ["text", "text"],
  ["state", "text"],
  ["opens", "tap"],
  ["target", "tap"],
  ["request", "tap"],
  ["action", "tap"],
  ["tapAnimation", "tap"],
  ["visibility", "tap"],
  ["size", "layout"],
  ["arrange", "layout"],
];

/** Each group's title and its one grey line. */
export const TILE_INSPECTOR_GROUP_WORDS: Readonly<Record<TileInspectorGroup, { title: string; description: string }>> = {
  look: { title: "Look", description: "Color, icon, glow, background, border" },
  text: { title: "Text", description: "Name, state, state bar" },
  tap: { title: "Tap", description: "What it does, when it shows" },
  layout: { title: "Layout", description: "Size, arrangement" },
};

/** Layout's grey line for the parts it holds: "Size, arrangement",
 * "Arrangement" or "Size". */
function layoutWords(parts: readonly string[]): string {
  const words = [parts.includes("size") ? "size" : "", parts.includes("arrange") ? "arrangement" : ""].filter((w) => w !== "").join(", ");
  return words === "" ? TILE_INSPECTOR_GROUP_WORDS.layout.description : words[0]!.toUpperCase() + words.slice(1);
}

/** The heading of each part that is not titled by its kind. */
const PART_TITLES: Readonly<Partial<Record<TileInspectorPart, string>>> = {
  color: "Color",
  icon: "Icon",
  glow: "Glow",
  whenOff: "When it is off",
  tapAnimation: "Tap animation",
  text: "Name",
  visibility: "Show tile",
  arrange: "Arrangement",
};

/** The groups of the tile on `host`, each with its parts in reading order;
 * a group with no part is left out. Size is the page editor's, so it is in
 * only where the caller hands its rows in (`renderTileInspector`). */
export function tileInspectorParts(host: TileSettingsHost): { group: TileInspectorGroup; parts: TileInspectorPart[] }[] {
  const sections = tileInspectorSections(host);
  const has = (part: TileInspectorPart): boolean => {
    switch (part) {
      case "color":
      case "icon":
      case "tapAnimation":
        return sections.includes("icon");
      case "glow":
        return sections.includes("icon") && glowOffered(host);
      case "whenOff":
        return sections.includes("icon") && whenOffShown(host);
      case "arrange":
        return tileArrangeShown(host);
      default:
        return sections.includes(part);
    }
  };
  const groups: TileInspectorGroup[] = ["look", "text", "tap", "layout"];
  return groups
    .map((group) => ({ group, parts: TILE_INSPECTOR_PARTS.filter(([p, g]) => g === group && has(p)).map(([p]) => p) }))
    .filter((g) => g.parts.length > 0);
}

/** The parts several picked tiles are edited in together: those whose rows
 * each write one value of the tile's own look, the same on any kind. The
 * rest (what a kind's own task shows, the entity, the tap's action, Show
 * tile, the size and the arrangement) are one tile's. */
const PICKED_PARTS: ReadonlySet<TileInspectorPart> = new Set<TileInspectorPart>([
  "color", "icon", "glow", "whenOff", "background", "border", "text", "state", "tapAnimation",
]);

/** The parts the Icon and color section is split into. */
const ICON_PARTS: ReadonlySet<TileInspectorPart> = new Set<TileInspectorPart>(["color", "icon", "glow", "whenOff", "tapAnimation"]);

/** The grey line a group carries for its parts left out while several tiles
 * are picked. */
export const PICKED_HIDDEN_NOTE = "Shown when one tile is picked";

/**
 * The groups and parts of the inspector while several tiles are picked: a
 * part only when every picked tile has it (`tileInspectorParts` of each) and
 * it is one several tiles share (`PICKED_PARTS`); State only for tiles of
 * one kind, whose rows are the same. `hidden` names, per group, the parts
 * some picked tile has that are left out, for the group's grey line. With one
 * tile, its own groups and nothing hidden.
 */
export function pickedInspectorParts(host: TileSettingsHost): {
  groups: { group: TileInspectorGroup; parts: TileInspectorPart[] }[];
  hidden: Map<TileInspectorGroup, TileInspectorPart[]>;
} {
  const pick = host.picked;
  if (pick === undefined) return { groups: tileInspectorParts(host), hidden: new Map() };
  const each = pick.ids.map((id) => pick.as(id, () => ({
    parts: tileInspectorParts(host).flatMap((g) => g.parts),
    // A part One Look does not draw on this tile (a camera showing its
    // picture): left out, rather than greyed for some tiles only.
    off: (part: TileInspectorPart) => oneLook(host) && oneLookSectionOff(host.tile, ICON_PARTS.has(part) ? "icon" : part) !== undefined,
  })));
  const kinds = new Set(pick.tiles.map((t) => tileKind(tileEntityId(t))));
  const shared = (part: TileInspectorPart): boolean =>
    PICKED_PARTS.has(part) && (part !== "state" || kinds.size === 1)
    && each.every((t) => t.parts.includes(part) && !t.off(part));
  const groups: { group: TileInspectorGroup; parts: TileInspectorPart[] }[] = [];
  const hidden = new Map<TileInspectorGroup, TileInspectorPart[]>();
  for (const group of ["look", "text", "tap", "layout"] as const) {
    const any = TILE_INSPECTOR_PARTS.filter(([p, g]) => g === group && each.some((t) => t.parts.includes(p))).map(([p]) => p);
    const parts = any.filter(shared);
    if (parts.length > 0) groups.push({ group, parts });
    const left = any.filter((p) => !parts.includes(p) && p !== "removed");
    if (left.length > 0) hidden.set(group, left);
  }
  return { groups, hidden };
}

/** A part's Reset while several tiles are picked: made per tile when it
 * runs, so each goes back to its own defaults (its kind's color and icon),
 * or undefined when no picked tile has one. With one tile, its own. */
function partResetEdit(host: TileSettingsHost, part: TileInspectorPart): ((d: WatchPagesDocument) => WatchPagesDocument) | undefined {
  if (host.picked === undefined) return watchTileInspectorPartReset(host, part);
  if (!somePicked(host, () => watchTileInspectorPartReset(host, part) !== undefined)) return undefined;
  return (d) => watchTileInspectorPartReset(host, part)?.(d) ?? d;
}

/** The tile keys each split part of Icon and color edits, beside the icon
 * and color themselves, and what its rows read of them. */
const PART_KEYS: Readonly<Partial<Record<TileInspectorPart, readonly string[]>>> = {
  icon: ["iconSizeOverride", "iconShadow", "stateIcons", "stateColors"],
  glow: ["iconGlow"],
  whenOff: ["dimWhenOff", "activeIconAnimationEnabled"],
  tapAnimation: ["iconTapAnimation"],
};

const PART_READS: Readonly<Partial<Record<TileInspectorPart, (tile: WatchPageTile) => unknown>>> = {
  icon: (t) => {
    const s = watchTileIconSettings(t);
    const map = (v: unknown) => (typeof v === "object" && v !== null && Object.keys(v).length > 0 ? v : undefined);
    return [s.iconSize, s.iconShadow, map(t.stateIcons), map(t.stateColors)];
  },
  glow: (t) => encodeOneLookGlyphGlow(watchTileIconGlow(t)),
  whenOff: (t) => {
    const s = watchTileIconSettings(t);
    return [s.dimWhenOff.value, s.activeAnimation.value];
  },
  tapAnimation: (t) => watchTileIconSettings(t).tapAnimation,
};

/**
 * Whether a part of the tile inspector holds a value other than its
 * default, which its heading marks with the blue dot and its group counts.
 * A whole section reads as its card's changed dot does
 * (`watchTileSectionChanged`); Size as the page editor says (`sizeChanged`).
 * Of Icon and color's parts, Color counts only away from the kind's color
 * (what Default writes), Icon for an icon away from the kind's or a size,
 * shadow, state icon or state color of its own, and Glow, When it is off and
 * Tap animation for a stored key that reads other than its absence. The
 * Arrangement counts while one is stored.
 */
export function watchTileInspectorPartChanged(host: TileSettingsHost, part: TileInspectorPart, sizeChanged = false): boolean {
  const tile = host.tile;
  switch (part) {
    case "size":
      return sizeChanged;
    case "arrange":
      return watchTileArrange(tile) !== undefined;
    case "color": {
      const color = watchTileIconSettings(tile).color;
      return !colorAtDefault(host, color, host.domainStyle === true ? undefined : kindDefaults(host).color);
    }
    case "icon": {
      const icon = watchTileIconSettings(tile).icon;
      const defaultIcon = host.domainStyle === true ? undefined : kindDefaults(host).icon;
      const ownIcon = icon !== undefined && (defaultIcon === undefined || icon !== defaultIcon);
      return ownIcon || readsOtherThanDefault(tile, PART_KEYS.icon!, PART_READS.icon!);
    }
    case "glow":
    case "whenOff":
    case "tapAnimation":
      return readsOtherThanDefault(tile, PART_KEYS[part]!, PART_READS[part]!);
    default:
      return watchTileSectionChanged(host, part);
  }
}

/** An edit that puts `keys` of the tile back: removed, or for a key the phone
 * and the watch require (`iconShadow`, `labelShadow`, `iconTapAnimation`)
 * set to its default, never removed, since a tile without it makes both
 * refuse the whole page. */
function keysAtDefault(host: TileSettingsHost, keys: readonly string[]): (d: WatchPagesDocument) => WatchPagesDocument {
  const { pageId, tileId } = host;
  return (d) => editTile(d, pageId, tileId, (tile) => keys.reduce((t, key) => {
    const start = requiredTileKeyDefault(key);
    return start === undefined ? withoutKey(t, key) : { ...t, [key]: structuredClone(start) };
  }, tile));
}

/**
 * The Reset beside a changed part's heading: an edit that puts that part,
 * and only it, back to its defaults, or undefined where a part has no way
 * back (a header's look, an iPhone key, Size, which is a place). State,
 * Border and Background reset as their own Reset does (a rule's style
 * drops their keys instead); Color and Icon write the kind's defaults as
 * their Default chips do; Show tile goes back to Always; the Arrangement to
 * Default; the rest remove their keys.
 */
export function watchTileInspectorPartReset(host: TileSettingsHost, part: TileInspectorPart): ((d: WatchPagesDocument) => WatchPagesDocument) | undefined {
  const { pageId, tileId } = host;
  switch (part) {
    case "color":
      return watchTileDefaultColorEdit(host);
    case "arrange":
      return arrangeResetEdit(host);
    case "icon": {
      const icon = watchTileDefaultIconEdit(host);
      const rest = keysAtDefault(host, PART_KEYS.icon!);
      return (d) => rest(icon(d));
    }
    case "glow":
    case "whenOff":
    case "tapAnimation":
      return keysAtDefault(host, PART_KEYS[part]!);
    case "text":
    case "action":
    case "request":
      return keysAtDefault(host, SECTION_KEYS[part]!);
    case "visibility":
      return (d) => setWatchTileShowAlways(d, pageId, tileId);
    case "state":
    case "border":
    case "background":
      return (d) => (host.domainStyle === true ? clearWatchTileTask : resetWatchTileTask)(d, pageId, tileId, part);
    default:
      return undefined;
  }
}

/** A part's heading words. */
function partTitle(host: TileSettingsHost, part: TileInspectorPart): string {
  if (part === "special") return watchSpecialSectionTitle(host);
  if (part === "phone") {
    const key = watchPhoneKeysOf(host.tile, host.hass.states)[0];
    if (key !== undefined) return WATCH_PHONE_KEY_WORDS[key].title;
  }
  if (part === "phoneTile") {
    const kind = watchPhoneTileKindOf(host.tile);
    if (kind !== undefined) return watchPhoneTileTitle(kind);
  }
  return PART_TITLES[part] ?? WATCH_TILE_SETTINGS_SECTION_TITLES[part as WatchTileSettingsSection];
}

/** A part's rows. */
function partBody(host: TileSettingsHost, part: TileInspectorPart, extras: TileSettingsExtras): TemplateResult | typeof nothing {
  switch (part) {
    case "color":
      return renderTileColor(host, kindDefaults(host).color);
    case "icon":
      // State icons and colors are per state of one entity: one tile's.
      return html`${renderIconGlyph(host)}${host.domainStyle === true ? nothing : host.picked !== undefined ? renderStateIconsOff(host) : renderStateIcons(host)}<div class="ts-group">${renderIconLook(host)}</div>`;
    case "glow":
      return renderGlowPart(host);
    case "whenOff":
      return renderWhenOff(host);
    case "tapAnimation":
      return renderTapAnimation(host);
    case "size":
      return extras.size?.body() ?? nothing;
    case "arrange":
      return renderArrangeSection(host, extras.arrangePicture);
    default:
      return sectionBodyFor(host, part);
  }
}

/** One part: its heading in sentence case, the blue dot and Reset while it
 * holds a value of its own, then its rows, always open. */
function renderPart(host: TileSettingsHost, part: TileInspectorPart, changed: boolean, extras: TileSettingsExtras): TemplateResult {
  // A webhook inbox and a removed kind are one line, with no heading.
  if (part === "removed") return renderRemovedLine();
  if (part === "special" && inboxLine(host, part)) return renderInboxLine(host);
  const title = partTitle(host, part);
  const reset = changed ? partResetEdit(host, part) : undefined;
  const phone = part === "phone" || part === "phoneExtras" || part === "phoneTile";
  return html`<section class="ts-sec" data-part=${part} aria-label=${title}>
    <div class="ts-sec-h"><h4>${title}</h4>${phone ? phoneTag() : nothing}${changed ? html`<span class="ts-dot" title="Not the default"></span>` : nothing}${reset === undefined
      ? nothing
      : html`<button type="button" class="ts-sec-reset" title=${`Put ${title.toLowerCase()} back to its defaults`} ?disabled=${host.busy}
          @click=${() => { host.endCoalesce(); commit(host, `reset:${part}`, reset); }}>Reset</button>`}</div>
    <div class="sec-b ts-sec-b"><fieldset class="ts-body" id=${`ts-body-${part}`} ?disabled=${host.busy} aria-label=${title}>
      ${part === "phoneExtras" ? html`<p class="hint">${WATCH_PHONE_EXTRAS_HINT}</p>` : nothing}
      ${partBody(host, part, extras)}
    </fieldset></div>
  </section>`;
}

/**
 * The selected tile's settings as the page editor's inspector stands them:
 * four group panels, Look, Text, Tap and Layout, each with its title, its
 * grey line and how many of its parts hold a value of their own, then its
 * parts under calm headings, always open. The columns are pure CSS by the
 * inspector's own width (`@container insp`): four at 1560 px and up (Look,
 * Text, Tap, Layout), three at 1080 (Tap over Layout in the third), two at
 * 760 (Text, Tap and Layout down the second), else one. The nesting is what
 * lets one markup make all four: `.ts-g2` holds Text and `.ts-g3`, which
 * holds Tap and Layout, and each wrapper turns to `display: contents` where
 * its children take columns of their own.
 */
export function renderTileInspector(watchHost: TileSettingsHost, extras: TileSettingsExtras = {}): TemplateResult | typeof nothing {
  const host = tileWordsHost(watchHost);
  // With several tiles picked, only the parts they share (`pickedInspectorParts`).
  const { groups: all, hidden } = pickedInspectorParts(host);
  const groups = all
    .map((g) => ({ ...g, parts: g.parts.filter((p) => p !== "size" || extras.size !== undefined) }))
    .filter((g) => g.parts.length > 0 || hidden.has(g.group));
  for (const id of hidden.keys()) if (!groups.some((g) => g.group === id)) groups.push({ group: id, parts: [] });
  if (groups.length === 0) return nothing;
  dropStaleTyping(host);
  const group = (id: TileInspectorGroup): TemplateResult | typeof nothing => {
    const g = groups.find((x) => x.group === id);
    if (g === undefined) return nothing;
    // A part reads as changed while any picked tile holds a value there.
    const changed = g.parts.map((p) => somePicked(host, () => watchTileInspectorPartChanged(host, p, p === "size" && extras.size?.changed?.() === true)));
    const n = changed.filter(Boolean).length;
    const words = TILE_INSPECTOR_GROUP_WORDS[id];
    // Layout's line names what it holds: a page tile's Size went on
    // 2026-10-26 (the stage drags and sizes it), a smart rule keeps its own.
    const description = id === "layout" ? layoutWords(g.parts) : words.description;
    const left = hidden.get(id);
    return html`<section class="ts-grp" data-group=${id} aria-label=${words.title}>
      <div class="ts-grp-h"><h3 class="ts-grp-t">${words.title}</h3><span class="ts-grp-d">${description}</span>${n === 0
        ? nothing
        : html`<span class="ts-grp-n"><i aria-hidden="true"></i>${n} changed</span>`}</div>
      ${g.parts.map((p, i) => renderPart(host, p, changed[i]!, extras))}
      ${left === undefined ? nothing : html`<p class="hint keep ts-picked-off">${PICKED_HIDDEN_NOTE}: ${left.map((p) => partTitle(host, p)).join(", ")}.</p>`}
    </section>`;
  };
  return html`<div class="ts-root ts-groups">
    ${group("look")}
    <div class="ts-g2">${group("text")}<div class="ts-g3">${group("tap")}${group("layout")}</div></div>
  </div>`;
}

// ── the inspector's head ─────────────────────────────────────────────────

/** The look keys Reset tile removes beside the styling tasks' own resets:
 * the icon's size, shadow, glow, dimming, animations and per state icons
 * and colors, the label's size, weight, design, shadow and color, and the
 * arrangement. The name, whether it shows, the size, the tap and Show tile
 * stay. */
const RESET_LOOK_KEYS: readonly string[] = [
  "iconSizeOverride", "iconShadow", "iconGlow", "dimWhenOff", "activeIconAnimationEnabled", "iconTapAnimation", "stateIcons", "stateColors",
  "labelFontSizeOverride", "labelFontWeight", "labelFontDesign", "labelShadow", "labelColorHex", "arrange",
];

/** The sections whose values Reset tile puts back. */
const RESET_SECTIONS: readonly WatchTileSettingsSection[] = ["icon", "text", "state", "border", "background"];

/**
 * Reset tile's edit: the tile's look back to its kind's defaults in one
 * step. The icon and color as Default writes them, State, Border and
 * Background as their own Resets do, and `RESET_LOOK_KEYS` removed.
 */
export function watchTileResetEdit(host: TileSettingsHost): (d: WatchPagesDocument) => WatchPagesDocument {
  const defaults = host.domainStyle === true ? { icon: undefined, color: undefined } : kindDefaults(host);
  const { pageId, tileId } = host;
  const look = keysAtDefault(host, RESET_LOOK_KEYS);
  return (d) => {
    let next = setWatchTileIconDefault(d, pageId, tileId, { icon: defaults.icon ?? null, color: defaults.color ?? null });
    for (const task of ["state", "border", "background"] as const) next = resetWatchTileTask(next, pageId, tileId, task);
    return look(next);
  };
}

/** Whether Reset tile would change how the tile looks: one of its sections
 * reads as changed, or the Arrangement holds an arrangement. */
export function watchTileResettable(host: TileSettingsHost): boolean {
  const sections = tileInspectorSections(host);
  if (tileArrangeShown(host) && watchTileArrange(host.tile) !== undefined) return true;
  return RESET_SECTIONS.some((s) => sections.includes(s) && watchTileSectionChanged(host, s));
}

/** Whether the tile shows an entity of Home Assistant's: not a spacer, a
 * divider or one of the app's own kinds, and not empty. */
export function tileHeadHasEntity(tile: WatchPageTile): boolean {
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  return entityId.includes(".") && kind !== "spacer" && kind !== "divider" && !isVirtualTileKind(kind);
}

/** What the page editor hands the head: what only it draws or does. */
export interface TileHeadParts {
  /** The strip's start: the path back to the page and the live tiles. */
  lead: TemplateResult | typeof nothing;
  /** The actions before Reset (Duplicate, Hide). */
  actions: TemplateResult | typeof nothing;
  /** The action after Reset (Delete). */
  remove: TemplateResult | typeof nothing;
  /** Under Shows: the group line, while the tile is in a group. */
  below?: TemplateResult | typeof nothing;
  /** Change beside what the tile shows, where the tile has another way to
   * say it (a library tile's Target). */
  change?: { title: string; go: () => void };
}

/**
 * The tile inspector's head, one strip across the inspector that wraps on a
 * narrow one: at its start what the page editor draws (the path and the
 * live tiles), in the middle the tile's Name (for a tile with a Text
 * section; empty shows the name the watch falls back to and stores no
 * label) and Shows, its entity, then at its end the actions with Reset
 * among them and the Find a setting field. Inside a `.ts-root`, so the
 * editor lets the name's box go when the selection moves.
 */
export function renderTileHead(watchHost: TileSettingsHost, parts: TileHeadParts): TemplateResult {
  const host = tileWordsHost(watchHost);
  const tile = host.tile;
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const hasEntity = tileHeadHasEntity(tile);
  const named = host.domainStyle !== true && watchTileSettingsSections(tile, host.hass.states).includes("text");
  let name: TemplateResult | typeof nothing = nothing;
  if (named) {
    const fallback = watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document), host.catalog);
    const label = typed(host, "label") ?? watchTileTextSettings(tile).label ?? "";
    const set = (v: string) =>
      commit(host, "label", (d) => setWatchTileLabel(d, host.pageId, host.tileId, v, { emptyRemoves: true }), { typing: true });
    name = html`<div class="ts-head-f ts-head-name"><span class="ts-head-lab">Name</span>${typingField(host, "label", html`<input type="text" aria-label="Name" .value=${label}
      placeholder=${fallback} title=${watchLabelNote(tile, hostDevice(host))} ?disabled=${host.busy} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />`)}</div>`;
  }
  const shown = hasEntity
    ? html`<code class="ts-head-entity" title=${entityId}>${entityId}</code>`
    : html`<span class="ts-head-none">${entityId === "" || kind === "spacer" || kind === "divider" ? "No entity" : tileKindLabel(kind)}</span>`;
  const change = parts.change === undefined ? nothing
    : html`<button type="button" class="link ts-head-change" title=${parts.change.title} @click=${parts.change.go}>Change</button>`;
  const resettable = watchTileResettable(host);
  return html`<section class="ts-head ts-root" aria-label="Tile">
    <div class="ts-head-lead">${parts.lead}</div>
    <div class="ts-head-mid">
      ${name}
      <div class="ts-head-f ts-head-shows"><span class="ts-head-lab">Shows</span><div class="ts-head-ent">${shown}${change}</div></div>
      ${parts.below ?? nothing}
    </div>
    <div class="ts-head-side">
      <div class="ts-head-acts" role="group" aria-label="Tile actions">
        ${parts.actions}
        <button type="button" class="ghost ts-reset-btn" ?disabled=${!resettable || host.busy}
          title=${resettable ? "Put the icon, color, text, state, border, background and arrangement back to their defaults. The name, size, tap and Show tile stay. Undo brings them back." : "The tile's look is at its defaults"}
          @click=${() => { host.endCoalesce(); commit(host, "resetTile", watchTileResetEdit(host)); }}>${uiIcon("undo")}<span>Reset</span></button>
        ${parts.remove}
      </div>
    </div>
  </section>`;
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
      return findWatchCatalogEntry(host.catalog, target.kind, target.id)?.name ?? watchLibraryMissingText(host.catalog, target.kind, hostDevice(host));
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
    case "visibility":
      return showTileSummary(host);
    case "phone":
      return watchPhoneKeysOf(tile, host.hass.states).map((key) => watchPhoneKeySummary(tile, key)).filter((s) => s !== "").join(", ");
    case "phoneExtras":
      return WATCH_PHONE_EXTRAS_HINT;
    case "phoneTile":
      return watchPhoneTileSummary(tile);
    case "size":
    case "removed":
      return "";
    case "state":
      return watchTileSectionChanged(host, "state") ? "Changed" : "";
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

/** A section's rows, greyed as a whole with the reason first when One Look
 * draws none of them on this tile (a camera showing its picture). */
function sectionBodyFor(host: TileSettingsHost, section: WatchTileSettingsSection): TemplateResult {
  const off = oneLook(host) ? oneLookSectionOff(host.tile, section) : undefined;
  if (off === undefined) return sectionBody(host, section);
  return html`<div class="hint keep">${off}</div><fieldset class="ts-plain ts-off" disabled>${sectionBody(host, section)}</fieldset>`;
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
    case "visibility":
      return renderShowTile(host);
    case "state":
      return renderState(host);
    case "border":
      return renderBorder(host);
    case "background":
      return renderBackground(host);
    case "phone":
      return renderPhoneKeys(host, false);
    case "phoneExtras":
      return renderPhoneKeys(host, true);
    case "phoneTile":
      return renderPhoneTileTask(host);
    case "size":
    case "removed":
      return html``;
  }
}

// ── the keys only the iPhone reads ──────────────────────────────────────

/**
 * The tile's phone keys (`watchPhoneKeysOf`): on an iPhone's editor one card
 * titled by its key; in a watch's "iPhone extras" each key under its own
 * heading with the iPhone tag.
 */
function renderPhoneKeys(host: TileSettingsHost, grouped: boolean): TemplateResult {
  // The stream and the full screen stream sit under Live video, without a
  // heading of their own; the stream only while the live video is on.
  const keys = watchPhoneKeysOf(host.tile, host.hass.states)
    .filter((key) => key !== "cameraTileStream" || watchCameraTileLive(host.tile));
  const unheaded = (key: WatchPhoneKey) => key === "cameraTileStream" || key === "cameraFullScreenStream";
  const headed = keys.filter((key) => !unheaded(key));
  const camera = keys.includes("cameraTileLive");
  return html`${camera ? renderCameraStreams(host) : nothing}${keys.map((key) => html`
    ${!unheaded(key) && (grouped || headed.length > 1)
      ? html`<div class="ts-sub-h"><span>${WATCH_PHONE_KEY_WORDS[key].title}</span>${phoneTag()}</div>`
      : nothing}
    ${renderPhoneKey(host, key)}`)}${camera ? renderCameraPlay(host) : nothing}`;
}

/** The line naming the camera's two streams, the ones a live tile plays:
 * a person picks one camera and both come with it. Nothing until the
 * integration has listed the cameras, or for a camera group. */
function renderCameraStreams(host: TileSettingsHost): TemplateResult | typeof nothing {
  const entityId = tileEntityId(host.tile);
  if (tileKind(entityId) !== "camera") return nothing;
  const rows = watchCameraRows(host.hass, () => host.requestUpdate());
  const streams = rows === undefined ? undefined : watchCameraStreamsFrom(rows, entityId);
  if (streams === undefined) return nothing;
  const name = (id: string) => {
    const friendly = host.hass.states[id]?.attributes?.friendly_name;
    return typeof friendly === "string" && friendly !== "" ? friendly : id;
  };
  const both = streams.sd !== undefined && streams.hd !== undefined && streams.sd !== streams.hd;
  const text = both
    ? html`<b>SD</b> ${name(streams.sd!)} · <b>HD</b> ${name(streams.hd!)}`
    : html`One stream: ${name(streams.sd ?? streams.hd ?? entityId)}. SD and HD play the same.`;
  return html`<div class="hint ts-streams" title=${both ? `${streams.sd} and ${streams.hd}` : entityId}>${text}</div>`;
}

/** The uiState key of the tile's Play box: the stream it plays, if any. */
const playKey = (host: TileSettingsHost) => `camera-play:${host.tileId}`;

/** Play buttons for the camera's SD and HD streams, and the box that plays
 * the one picked, with its size, codec and frame rate; then the stage's
 * live tiles switch. */
function renderCameraPlay(host: TileSettingsHost): TemplateResult {
  const entityId = tileEntityId(host.tile);
  const single = tileKind(entityId) === "camera";
  const rows = single ? watchCameraRows(host.hass, () => host.requestUpdate()) : undefined;
  const streams = rows === undefined ? undefined : watchCameraStreamsFrom(rows, entityId);
  const sd = streams?.sd ?? entityId;
  const hd = streams?.hd ?? entityId;
  const playing = host.uiState.get(playKey(host)) as "sd" | "hd" | undefined;
  const play = (which: "sd" | "hd" | undefined) => {
    if (which === undefined) host.uiState.delete(playKey(host));
    else host.uiState.set(playKey(host), which);
    host.requestUpdate();
  };
  const ratio = Number(host.tile.cameraAspectRatio);
  const wide = Number.isFinite(ratio) && ratio > 0 ? ratio > 1 : undefined;
  const box = Number.isFinite(ratio) && ratio > 0 ? Math.min(Math.max(ratio, 0.5), 4) : 16 / 9;
  const liveTiles = watchEditorLiveCameras();
  return html`
    ${single ? html`<div class="field ts-play"><span>Preview</span><div class="ts-play-btns">
      <button type="button" class="pe-chip ${playing === "sd" ? "on" : ""}" aria-pressed=${playing === "sd" ? "true" : "false"}
        @click=${() => play(playing === "sd" ? undefined : "sd")}>${playing === "sd" ? "Stop" : "Play SD"}</button>
      ${hd !== sd ? html`<button type="button" class="pe-chip ${playing === "hd" ? "on" : ""}" aria-pressed=${playing === "hd" ? "true" : "false"}
        @click=${() => play(playing === "hd" ? undefined : "hd")}>${playing === "hd" ? "Stop" : "Play HD"}</button>` : nothing}
    </div></div>
    ${playing === undefined ? nothing : html`<wa-camera-live class="ts-play-box" style=${`aspect-ratio:${box}`}
      .hass=${host.hass} .entity=${playing === "hd" ? hd : sd} .fit=${true} .info=${true} .wide=${wide}></wa-camera-live>`}
    <div class="hint ts-under">Plays the stream here, in this browser, with its size, codec and frame rate. The iPhone turns a sideways HD stream the same way.</div>` : nothing}
    ${checkField("Live tiles in the editor", liveTiles, (on) => {
      setWatchEditorLiveCameras(on);
      host.requestUpdate();
    })}
    <div class="hint ts-under">Off by default. Plays every camera tile of an iPhone page on its SD stream in the preview. Each one keeps a stream open while the editor shows the page. This browser keeps the switch.</div>`;
}

function renderPhoneKey(host: TileSettingsHost, key: WatchPhoneKey): TemplateResult {
  const tile = host.tile;
  const words = WATCH_PHONE_KEY_WORDS[key];
  const help = html`<div class="hint ts-under">${words.help}</div>`;
  switch (key) {
    case "cameraTileLive":
      return html`${checkField(words.label, watchCameraTileLive(tile), (on) =>
        commit(host, key, (d) => setWatchCameraTileLive(d, host.pageId, host.tileId, on)))}${help}`;
    case "cameraTileStream":
      return html`${segField(words.label, watchCameraTileStream(tile), WATCH_CAMERA_TILE_STREAM_CHOICES.map((c) => [c.value, c.label] as [string, string]), (v) =>
        commit(host, key, (d) => setWatchCameraTileStream(d, host.pageId, host.tileId, v)), { def: WATCH_CAMERA_TILE_STREAM_ABSENT })}${help}`;
    case "cameraFullScreenStream":
      return html`${segField(words.label, watchCameraFullScreenStream(tile), WATCH_CAMERA_FULL_SCREEN_CHOICES.map((c) => [c.value, c.label] as [string, string]), (v) =>
        commit(host, key, (d) => setWatchCameraFullScreenStream(d, host.pageId, host.tileId, v)), { def: WATCH_CAMERA_FULL_SCREEN_ABSENT })}${help}`;
    case "mediaArtwork":
      return html`${checkField(words.label, watchMediaArtwork(tile), (on) =>
        commit(host, key, (d) => setWatchMediaArtwork(d, host.pageId, host.tileId, on)))}${help}`;
    case "sensorChart": {
      const short = watchSensorChartShortNote(tile);
      return html`${menuField(words.label, watchSensorChartMenu(tile), (v) =>
        commit(host, key, (d) => setWatchSensorChart(d, host.pageId, host.tileId, v === WATCH_DEFAULT_CHOICE ? null : v)))}${help}
        ${short === undefined ? nothing : html`<div class="hint warn ts-under" role="status">${short}</div>`}`;
    }
    case "templateLines":
      return html`${menuField(words.label, watchTemplateLinesMenu(tile), (v) =>
        commit(host, key, (d) => setWatchTemplateLines(d, host.pageId, host.tileId, Number(v))))}${help}`;
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
      ? html`<p class="hint keep">There is no other page this tile can open. Add a page first.</p>`
      : menuField(link.kind === "page" ? "Goes to" : "Peeks at", menu, pick)}
    <div class="hint ts-under">${link.kind === "page"
      ? "A tap goes to that page. A label that is the page's name follows it."
      : "A tap shows that page over this one, hidden pages included. A label that is the page's name follows it."}</div>
    ${renderPeekAnimation(host)}`;
}

/** Skip open and close animation, on a Peek page tile only. */
function renderPeekAnimation(host: TileSettingsHost): TemplateResult | typeof nothing {
  const skip = watchPeekSkipAnimation(host.tile);
  if (skip === undefined) return nothing;
  return html`
    ${checkField("Skip open and close animation", skip, (on) =>
      commit(host, "peekDisableAnimation", (d) => setWatchTilePeekSkipAnimation(d, host.pageId, host.tileId, on)))}
    <div class="hint ts-under">The page snaps in and out with no slide.</div>`;
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
      <div class="hint keep ts-under">${WATCH_NO_CATALOG_TEXT}</div>`;
  }
  const menu = watchLibraryTargetMenu(host.tile, catalog, hostDevice(host));
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
      ? html`<p class="hint keep">${http ? WATCH_NO_HTTP_ACTIONS_TEXT
        : watchLibraryLister(catalog, target.kind) === "The iPhone" ? `The iPhone's list has no ${words.many}.` : `This ${hostDeviceNoun(host)} has no ${words.many} yet.`}</p>`
      : menuField(words.one, menu, pick)}
    ${warning === undefined ? nothing : html`<div class="hint warn ts-under">${warning}.</div>`}
    <div class="hint ts-under">${onlyMissing ? nothing : TARGET_HINTS[target.kind]}${listed === undefined ? nothing : html` ${listed}`}</div>
    ${screenHelps ? html`<div class="ts-under">${httpActionsLink()}</div>` : nothing}`;
}

/** The line under Show reply, naming the device showing the page. */
function replyHint(reply: WatchHTTPReply | "off", device: string): string {
  switch (reply) {
    case "off": return `The ${device} stays quiet after a successful run. Failures always show their error.`;
    case "toast": return "After each successful run, a banner shows the reply. Failures always show their error.";
    case "tileValue": return "The tile shows the value from its last run in place of its icon. Successful runs show no banner.";
  }
}

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
    ${menuField("Show reply", watchHTTPReplyMenu(tile, action, host.catalog, hostDevice(host)), pickReply)}
    <div class="hint ts-under">${replyHint(r.reply ?? "off", hostDeviceNoun(host))}</div>
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
    else commit(host, "httpColor", (d) => setWatchTileHTTPValueColor(d, ...P(), v), { typing: true, ...reasonOf(watchColorRefusal(v, hostDevice(host))) });
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
      ${numberField("Text size", fontSize, setFontSize, { step: 1, min: R.fontSize.min, max: R.fontSize.max, optional: true, placeholder: "Auto", unit: "pt", rawTyping: true })}
      ${r.fontSize === undefined ? nothing : linkButton("Auto", `Let the ${hostDeviceNoun(host)} size the value`, () => commit(host, "httpFontSize", (d) => setWatchTileHTTPValueFontSize(d, ...P(), null)))}
    </div>`, r.fontSize)}
    ${typingField(host, "httpLines", html`<div class="ts-with-link">
      ${numberField("Lines", lines, setLines, { step: 1, min: R.lineLimit.min, max: R.lineLimit.max, optional: true, placeholder: "Auto", rawTyping: true })}
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
    <div class="hint ts-under">${r.color === undefined ? `Off: the ${hostDeviceNoun(host)}'s own text color.` : `On: this color. Switch it off for the ${hostDeviceNoun(host)}'s own.`}</div>
  </div>`;
}

// ── icon and color ───────────────────────────────────────────────────────

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

/** The icon itself: the symbol box, with No icon and Default under it. */
function renderIconGlyph(host: TileSettingsHost): TemplateResult {
  const s = watchTileIconSettings(host.tile);
  const defaults = kindDefaults(host);
  const many = host.picked !== undefined;
  // The typed-fill bookkeeping is one tile's.
  if (!many) stripFillWhenListed(host);
  // A rule's style is at its default only with no icon of its own. With
  // several tiles picked, a chip is on when it is on for every one of them.
  const atDefault = (): boolean => {
    const icon = watchTileIconSettings(host.tile).icon;
    const def = kindDefaults(host).icon;
    return icon === undefined || (host.domainStyle !== true && def !== undefined && icon === def);
  };
  const noIconOn = everyPicked(host, () => watchTileIconSettings(host.tile).icon === "");
  const defaultOn = !noIconOn && everyPicked(host, () => atDefault() && watchTileIconSettings(host.tile).icon !== "");
  const mixed = pickedMixed(host, (t) => watchTileIconSettings(t).icon);

  // Every icon comes from the list now, picked or typed into its search, so
  // each one is a step of its own.
  const setIcon = (name: string) => {
    const value = storedSymbol(host, name);
    if (!many && knownSymbols(host) === undefined && value.includes(".fill")) host.uiState.set(`${KEY}:fill:${host.tileId.toUpperCase()}`, value);
    host.endCoalesce();
    commit(host, "icon", (d) => setWatchTileIcon(d, host.pageId, host.tileId, value));
  };
  const noIcon = () => commit(host, "icon", (d) => setWatchTileIcon(d, host.pageId, host.tileId, ""));
  // Made when it runs, so each picked tile gets its own kind's icon.
  const defaultIcon = () => commit(host, "icon", (d) => watchTileDefaultIconEdit(host)(d));
  return html`
    ${symbolField(
      { icons: host.icons, symbols: host.symbols, device: hostDevice(host) },
      mixed ? "" : (s.icon ?? ""),
      setIcon,
      `pe:ts:symbol`,
      // The chips under the box are the way back to none and to the default,
      // so the box carries no x of its own.
      {
        clearable: false,
        tint: watchColorEnds(s.color ?? defaults.color)?.from,
        emptyText: mixed ? MIXED_WORD : s.icon === "" ? "No icon" : defaults.icon === undefined ? "Default" : `Default (${defaults.icon})`,
        ...(!mixed && s.icon === undefined && defaults.icon !== undefined ? { emptyGlyph: defaults.icon } : {}),
      },
    )}
    <div class="ts-after" role="group" aria-label="Icon">
      <button type="button" class="pe-chip ${noIconOn ? "on" : ""}" aria-pressed=${noIconOn ? "true" : "false"} @click=${noIcon}>No icon</button>
      <button type="button" class="pe-chip ${defaultOn ? "on" : ""}" aria-pressed=${defaultOn ? "true" : "false"}
        title=${host.domainStyle === true ? `No icon of its own: the ${hostDeviceNoun(host)} draws its default` : defaults.icon === undefined ? `The ${hostDeviceNoun(host)} picks the icon` : `The default for this kind of tile: ${defaults.icon}`}
        @click=${defaultIcon}>Default</button>
    </div>`;
}

/**
 * Whether the tile draws no icon in any state: No icon picked and no state
 * with an icon of its own. The renderer draws a state's own icon before it
 * looks at the tile's (`one-look/render.ts`), so a state icon still gives a
 * No icon tile a glyph to size, shadow and glow; only with neither do those
 * rows do nothing.
 */
export function watchTileDrawsNoIcon(tile: WatchPageTile): boolean {
  if (watchTileIconSettings(tile).icon !== "") return false;
  const own = tile.stateIcons;
  return !(typeof own === "object" && own !== null && Object.values(own).some((v) => typeof v === "string" && v !== ""));
}

/** The one line that stands where the icon's own rows were. */
export const NO_ICON_NOTE = "No icon, so its size, shadow and animation do nothing.";

/** The one line that stands where the Glow rows were. */
export const NO_ICON_GLOW_NOTE = "No icon, so there is nothing to glow.";

/** The icon's size and shadow, or the line that says why they are gone. */
function renderIconLook(host: TileSettingsHost): TemplateResult {
  if (everyPicked(host, () => watchTileDrawsNoIcon(host.tile))) return html`<div class="hint keep ts-gone">${NO_ICON_NOTE}</div>`;
  const s = watchTileIconSettings(host.tile);
  return html`
    ${renderIconSize(host)}
    ${checkRow("Icon shadow", s.iconShadow, pickedMixed(host, (t) => watchTileIconSettings(t).iconShadow),
      (on) => commit(host, "iconShadow", (d) => setWatchTileIconShadow(d, host.pageId, host.tileId, on)))}`;
}

/** Whether the Glow rows are offered: One Look draws the glow, and a rule's
 * style holds none. */
function glowOffered(host: TileSettingsHost): boolean {
  return oneLook(host) && host.domainStyle !== true;
}

/** The glow, or the line that says why it is gone. */
function renderGlowPart(host: TileSettingsHost): TemplateResult {
  return everyPicked(host, () => watchTileDrawsNoIcon(host.tile)) ? html`<div class="hint keep ts-gone">${NO_ICON_GLOW_NOTE}</div>` : renderIconGlow(host);
}

/** Whether When it is off has a row: Dim when off for a kind that dims, or
 * Animate while on for a kind that animates and an icon to move. */
function whenOffShown(host: TileSettingsHost): boolean {
  const s = watchTileIconSettings(host.tile);
  return (s.dimWhenOff.applies && host.domainStyle !== true) || (s.activeAnimation.shown && !watchTileDrawsNoIcon(host.tile));
}

/** When it is off: Dim or Keep color, then Animate while on. */
function renderWhenOff(host: TileSettingsHost): TemplateResult {
  const s = watchTileIconSettings(host.tile);
  // With several tiles picked, a row only where every one of them has it.
  const dims = everyPicked(host, () => watchTileIconSettings(host.tile).dimWhenOff.applies);
  const animates = everyPicked(host, () => watchTileIconSettings(host.tile).activeAnimation.shown && !watchTileDrawsNoIcon(host.tile));
  return html`
    ${dims && host.domainStyle !== true ? renderDimWhenOff(host, s.dimWhenOff.value) : nothing}
    ${!animates ? nothing
      // One Look never moves the icon for being on: the switch is greyed.
      : oneLook(host) ? greyed(ONE_LOOK_ANIMATE_REASON, checkField("Animate while on", s.activeAnimation.value, () => {}))
      : renderActiveAnimation(host, s.activeAnimation.stored)}`;
}

/** Tap animation: how the icon moves when the tile is tapped. */
function renderTapAnimation(host: TileSettingsHost): TemplateResult {
  const s = watchTileIconSettings(host.tile);
  const animation = watchChoiceMenu(WATCH_ICON_TAP_ANIMATIONS, s.tapAnimation);
  const unknownAnimation = s.tapAnimationStored !== undefined && s.tapAnimationStored !== s.tapAnimation ? s.tapAnimationStored : undefined;
  return html`
    ${menuField("Tap animation", mixedMenu(animation, pickedMixed(host, (t) => watchTileIconSettings(t).tapAnimation)), (v) =>
      commit(host, "tapAnimation", (d) => setWatchTileTapAnimation(d, host.pageId, host.tileId, v)))}
    <div class="hint ts-under">How the icon moves when the tile is tapped.${unknownAnimation === undefined
      ? nothing
      : html` Stored as "${unknownAnimation}", which the ${hostDeviceNoun(host)} plays as Bounce; it stays until another is picked.`}</div>`;
}

/** The Icon and color card of a smart rule's style: its parts in groups, a
 * hairline between each (the tile inspector stands each part under its own
 * heading instead, `renderTileInspector`). */
function renderIcon(host: TileSettingsHost): TemplateResult {
  const domain = host.domainStyle === true;
  return html`
    <div class="ts-group">${renderIconGlyph(host)}</div>
    <div class="ts-group">${renderTileColor(host, kindDefaults(host).color)}</div>
    ${domain ? nothing : html`<div class="ts-group">${renderStateIcons(host)}</div>`}
    <div class="ts-group">${renderIconLook(host)}</div>
    ${glowOffered(host) ? html`<div class="ts-group">${renderGlowPart(host)}</div>` : nothing}
    <div class="ts-group">${whenOffShown(host) ? renderWhenOff(host) : nothing}${renderTapAnimation(host)}</div>`;
}

/** The glow modes, as the Glow switch names them. */
const GLOW_MODES: [OneLookGlowMode, string][] = [["auto", "When on"], ["on", "Always"], ["off", "Off"]];

/**
 * The icon's glow under One Look: a "Glow" group with When on (stored as
 * `auto`), Always (`on`) and Off, and
 * while it draws its size, its brightness and its color (white, the tile's
 * color, the theme's swatches or a custom one).
 */
function renderIconGlow(host: TileSettingsHost): TemplateResult {
  const glow = watchTileIconGlow(host.tile);
  const now = () => watchTileIconGlow(host.tile);
  // Each edit reads the glow when it runs, so with several tiles picked each
  // keeps its own glow but for what is changed.
  const glowEdit = (next: (g: OneLookGlyphGlow) => OneLookGlyphGlow) => (d: WatchPagesDocument) =>
    setWatchTileIconGlow(d, host.pageId, host.tileId, next(now()));
  const write = (setting: string, next: (g: OneLookGlyphGlow) => OneLookGlyphGlow, typing = false) =>
    commit(host, setting, glowEdit(next), { typing });
  const mixed = (read: (g: OneLookGlyphGlow) => unknown) => pickedMixed(host, (t) => read(watchTileIconGlow(t)));
  const colourMixed = mixed((g) => g.colour);
  // A color edit that leaves a tile already in that color as it is.
  const colourEdit = (kind: "white" | "tile") => (d: WatchPagesDocument) =>
    (now().colour.kind === kind ? d : glowEdit((g) => ({ ...g, colour: { kind } }))(d));
  const customEdit = (value: string) => {
    const rgb = oneLookParseHex(value);
    return rgb === undefined ? (d: WatchPagesDocument) => d : glowEdit((g) => ({ ...g, colour: { kind: "custom", rgb } }));
  };
  const theme = watchAddThemeOf(host.page);
  const colourValue = glow.colour.kind === "custom" ? oneLookHex(glow.colour.rgb) : undefined;
  const tileOn = glow.colour.kind === "tile";
  const custom = (value: string | undefined) => {
    const reason = watchColorRefusal(value, hostDevice(host));
    const rgb = value === undefined ? undefined : oneLookParseHex(value);
    if (reason !== undefined || rgb === undefined) return commit(host, "glowColor", (d) => d, { reason: reason ?? "Pick a color." });
    write("glowColor", (g) => ({ ...g, colour: { kind: "custom", rgb } }), true);
  };
  const pickHex = (value: string) => {
    if (oneLookParseHex(value) !== undefined) commit(host, "glowColor", customEdit(value));
  };
  // Each choice as the tile on, then off: When on and Always differ only off.
  const pics = tilePictures(host);
  const withMode = (mode: OneLookGlowMode) => (d: WatchPagesDocument) => setWatchTileIconGlow(d, host.pageId, host.tileId, { ...glow, mode });
  const options = GLOW_MODES.map(([mode, label]) => ({
    value: mode,
    label,
    picture: () => html`${pics.tile(`glow:${mode}`, withMode(mode), "on", 40, 32)}${pics.tile(`glow:${mode}`, withMode(mode), "off", 40, 32)}`,
  }));
  const modeEdit = (mode: OneLookGlowMode) => glowEdit((g) => ({ ...g, mode }));
  return html`${pictureChoice<OneLookGlowMode>("Glow", glow.mode, options, (v) => commit(host, "glowMode", modeEdit(v)), {
    def: "auto", size: "pair", mixed: mixed((g) => g.mode), trial: tileTrial(host, "Glow", modeEdit),
  })}
    <div class="hint">Each picture shows the tile on, then off. When on glows behind the icon while the tile has its color, brighter while it is on. Always glows on gray and off tiles too. Never over a picture.</div>
    ${everyPicked(host, () => now().mode === "off") ? nothing : html`
      ${mixedRow(mixed((g) => g.size), typingField(host, "glowSize", sliderField("Size", glow.size, (v) => write("glowSize", (g) => ({ ...g, size: v }), true), {
        min: ONE_LOOK_GLOW_SIZE_RANGE[0], max: ONE_LOOK_GLOW_SIZE_RANGE[1], step: 5, def: ONE_LOOK_NATIVE_GLOW.size, unit: "%",
      }), glow.size))}
      ${mixedRow(mixed((g) => g.brightness), typingField(host, "glowBrightness", sliderField("Brightness", glow.brightness, (v) => write("glowBrightness", (g) => ({ ...g, brightness: v }), true), {
        min: ONE_LOOK_GLOW_BRIGHTNESS_RANGE[0], max: ONE_LOOK_GLOW_BRIGHTNESS_RANGE[1], step: 5, def: ONE_LOOK_NATIVE_GLOW.brightness, unit: "%",
      }), glow.brightness))}
      <div class="hint ts-under">100% is the tile's own glow. Off and on keep their difference.</div>
      ${colorPickerView({
        label: "Glow color",
        color: colourValue,
        swatches: watchThemeSwatches(theme, false),
        swatchesLabel: `Glow color: ${watchThemeDisplayName(theme)} colors`,
        pickSwatch: pickHex,
        default: {
          title: "White, the tile's own glow",
          on: glow.colour.kind === "white",
          pick: () => commit(host, "glowColor", colourEdit("white")),
        },
        tile: {
          title: "The tile's own color",
          on: tileOn,
          pick: () => commit(host, "glowColor", colourEdit("tile")),
        },
        custom: { shown: typed(host, "glowColor") ?? (colourMixed ? undefined : colourValue), pick: custom },
        mixed: colourMixed,
        trial: colorTrial(host, "Glow color", { swatch: customEdit, default: colourEdit("white"), tile: colourEdit("tile") }),
        wrap: (body) => typingField(host, "glowColor", body),
      })}`}`;
}

/** Dim when off, for a kind whose table entry has it. One Look dims only a
 * light (a dark gray tile, its bulb in its color); on any other kind the
 * tile keeps its color, so the switch is greyed there. */
function renderDimWhenOff(host: TileSettingsHost, value: boolean): TemplateResult {
  // Dim or Keep color, each as the tile off: the Dim when off switch's key
  // and values, `dimWhenOff` removed for Dim and false for Keep color.
  const pics = tilePictures(host);
  const edit = (dim: boolean) => (d: WatchPagesDocument) => setWatchTileDimWhenOff(d, host.pageId, host.tileId, dim);
  const row = pictureChoice<"dim" | "keep">("When it is off", value ? "dim" : "keep", [
    { value: "dim", label: "Dim", picture: () => pics.tile("dim:on", edit(true), "off", 54, 36) },
    { value: "keep", label: "Keep color", picture: () => pics.tile("dim:off", edit(false), "off", 54, 36) },
  ], (v) => commit(host, "dimWhenOff", edit(v === "dim")), {
    def: "dim",
    mixed: pickedMixed(host, (t) => watchTileIconSettings(t).dimWhenOff.value),
    trial: tileTrial<"dim" | "keep">(host, "When it is off", (v) => edit(v === "dim")),
  });
  if (!oneLook(host)) return html`${row}<div class="hint">The tile dims while it is off, or keeps its color.</div>`;
  return oneLookDims(host.tile) ? html`${row}<div class="hint">${ONE_LOOK_DIM_LIGHT_NOTE}</div>` : greyed(ONE_LOOK_DIM_OFF_REASON, row);
}

/** Animate while on, for a kind the watch animates: the switch writes
 * `true` or `false`, Use the default removes the key. */
function renderActiveAnimation(host: TileSettingsHost, stored: boolean | undefined): TemplateResult {
  const set = (value: boolean | null) =>
    commit(host, "activeAnimation", (d) => setWatchTileActiveIconAnimation(d, host.pageId, host.tileId, value));
  const own = stored !== undefined || somePicked(host, () => watchTileIconSettings(host.tile).activeAnimation.stored !== undefined);
  return html`${checkRow("Animate while on", watchTileIconSettings(host.tile).activeAnimation.value, pickedMixed(host, (t) => watchTileIconSettings(t).activeAnimation.value), (on) => set(on))}
    <div class="hint ts-under">${watchActiveAnimationNote(host.tile)}
      ${!own ? nothing : linkButton("Use the default", "Remove this tile's own setting", () => set(null))}</div>`;
}

/** The tile's color. */
function renderTileColor(host: TileSettingsHost, defaultColor: string | undefined): TemplateResult {
  const color = watchTileIconSettings(host.tile).color;
  const mode = watchColorModeChoice(color);
  const theme = watchAddThemeOf(host.page);
  const gradient = watchSwatchesInGradient(color, watchAddUsesGradient(host.page));
  const swatches = watchThemeSwatches(theme, gradient);
  const fallback = defaultColor ?? swatches[0];
  /** The tile's color when the edit is made, not when it was drawn. */
  const colorNow = () => watchTileIconSettings(host.tile).color;
  const colorEdit = (value: string) => (d: WatchPagesDocument) => setWatchTileColor(d, host.pageId, host.tileId, value);
  const write = (value: string, typing = false) => commit(host, "color", colorEdit(value), { typing });
  // Each tile's own color in the form picked: with several tiles picked,
  // each keeps its color. The rainbow is one of the gradients already.
  const pickMode = (next: "solid" | "gradient") => commit(host, "color", (d) => {
    const now = colorNow();
    if (next === "gradient" && watchColorModeChoice(now) === "rainbow") return d;
    const value = watchColorForMode(now, next, fallback, watchGradientOf);
    return value === undefined ? d : colorEdit(value)(d);
  });
  const custom = (value: string | undefined) => {
    const reason = watchColorRefusal(value, hostDevice(host));
    if (reason !== undefined || value === undefined) return commit(host, "color", (d) => d, { reason: reason ?? "Pick a color." });
    // A custom color keeps the form the tile is in: a gradient or rainbow
    // tile gets the gradient of the picked color, as a swatch would give it.
    const now = watchColorModeChoice(colorNow());
    write(now === "gradient" || now === "rainbow" ? watchGradientOf(value) : value, true);
  };
  // No color stored draws the theme's color for the kind, which is what
  // Default writes out. With several tiles picked Default is on when every
  // one has its kind's color, and the picker is Mixed when they differ
  // otherwise.
  const atDefault = everyPicked(host, () => colorAtDefault(host, colorNow(), host.domainStyle === true ? undefined : kindDefaults(host).color));
  const differ = pickedMixed(host, (t) => watchTileIconSettings(t).color);
  // Made when it runs, so each picked tile gets its own kind's color.
  const defaultEdit = (d: WatchPagesDocument) => watchTileDefaultColorEdit(host)(d);
  const resetColor = () => commit(host, "color", defaultEdit);
  // The Form switch is this picker's heading: the Icon card has no Color
  // heading of its own.
  // One Look fills the tile with its color, and a still rainbow; a tile
  // with none draws its kind's color on the watch, graphite on the iPhone.
  const lookNote = oneLook(host) ? oneLookColorNote(mode, hostDevice(host)) : undefined;
  return html`${colorPickerView({
    color: differ ? undefined : color,
    swatches,
    swatchesLabel: `${watchThemeDisplayName(theme)} colors`,
    pickSwatch: (v) => write(v),
    mixed: differ && !atDefault,
    trial: colorTrial(host, "Color", { swatch: colorEdit, default: defaultEdit }),
    default: {
      title: defaultColor === undefined || host.domainStyle === true ? `The ${hostDeviceNoun(host)} picks one` : `The theme's color for this kind of tile, ${defaultColor}`,
      on: atDefault,
      pick: resetColor,
    },
    form: { title: "Color", shown: mode, forms: WATCH_COLOR_MODES.map(([m]) => m), pick: pickMode },
    rainbow: { note: oneLook(host) ? ONE_LOOK_RAINBOW_NOTE : `The ${hostDeviceNoun(host)} cycles the tile through every color.` },
    custom: { shown: typed(host, "color") ?? (differ ? undefined : watchCustomBoxColor(color)), pick: custom },
    wrap: (body) => typingField(host, "color", body),
  })}${lookNote === undefined ? nothing : html`<div class="hint ts-under">${lookNote}</div>`}`;
}

function renderIconSize(host: TileSettingsHost): TemplateResult {
  const s = watchTileIconSettings(host.tile);
  // The next whole number above a largest size with a fraction stands for
  // that size (`watchTileIconSizeValue`), so the box and a drag reach it.
  const top = watchTileIconSizeTop(s.iconSizeMax);
  const mixed = pickedMixed(host, (t) => watchTileIconSettings(t).iconSize);
  const shown = typedNumber(typed(host, "iconSize"), mixed ? undefined : s.iconSize);
  const set = (v: number | undefined) => {
    if (v === undefined) return commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, null), { typing: true });
    // Each picked tile has its own largest size: the first that refuses says why.
    const reason = firstPicked(host, () => watchIconSizeRefusal(v, watchTileIconSettings(host.tile).iconSizeMax));
    commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, v), { typing: true, ...reasonOf(reason) });
  };
  return html`${typingField(host, "iconSize", html`<div class="ts-with-link">
      ${numberField("Icon size", shown, set, { step: 1, min: WATCH_ICON_SIZE_RANGE.min, max: top, optional: true, placeholder: mixed ? MIXED_WORD : "Auto", unit: "pt", rawTyping: true })}
      ${!somePicked(host, () => watchTileIconSettings(host.tile).iconSize !== undefined) ? nothing : linkButton("Auto", `Let the ${hostDeviceNoun(host)} size the icon to the tile`, () => commit(host, "iconSize", (d) => setWatchTileIconSize(d, host.pageId, host.tileId, null)))}
    </div>`, s.iconSize)}
    <div class="hint ts-under">${oneLook(host) ? oneLookIconSizeHint(top) : watchIconSizeHint(s.iconSizeMax)}</div>`;
}

export function reasonOf(reason: string | undefined): { reason?: string } {
  return reason === undefined ? {} : { reason };
}

// ── text ─────────────────────────────────────────────────────────────────

function renderText(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const t = watchTileTextSettings(tile);
  const mixed = (read: (s: ReturnType<typeof watchTileTextSettings>) => unknown) => pickedMixed(host, (x) => read(watchTileTextSettings(x)));
  const sizeMixed = mixed((s) => s.fontSize);
  const colorMixed = mixed((s) => s.labelColor);
  const fontSize = typedNumber(typed(host, "fontSize"), sizeMixed ? undefined : t.fontSize);
  const setFontSize = (v: number | undefined) =>
    commit(host, "fontSize", (d) => setWatchTileFontSize(d, host.pageId, host.tileId, v ?? null), { typing: true, ...(v === undefined ? {} : reasonOf(watchFontSizeRefusal(v))) });
  const labelColor = typed(host, "labelColor") ?? (colorMixed ? undefined : watchCustomBoxColor(t.labelColor));
  const labelColorEdit = (v: string | null) => (d: WatchPagesDocument) => setWatchTileLabelColor(d, host.pageId, host.tileId, v);
  const setLabelColor = (v: string | undefined) => {
    if (v === undefined) commit(host, "labelColor", (d) => setWatchTileLabelColor(d, host.pageId, host.tileId, null));
    else commit(host, "labelColor", (d) => setWatchTileLabelColor(d, host.pageId, host.tileId, v), { typing: true, ...reasonOf(watchColorRefusal(v, hostDevice(host))) });
    // Drawn again even when nothing changed (a refused press), so the
    // switch goes back to what is stored.
    host.requestUpdate();
  };
  // The label itself is the head's Name; a rule's tiles each carry their
  // entity's own name and have none.
  const show = checkRow("Show label", t.showLabel, mixed((s) => s.showLabel), (on) => commit(host, "showLabel", (d) => setWatchTileShowLabel(d, host.pageId, host.tileId, on)));
  if (everyPicked(host, () => !watchTileLabelDrawn(host.tile))) return html`${show}<div class="hint keep ts-gone">${LABEL_HIDDEN_NOTE}</div>`;
  return html`
    ${show}
    ${typingField(host, "fontSize", html`<div class="ts-with-link">
      ${numberField("Font size", fontSize, setFontSize, { step: 1, min: WATCH_FONT_SIZE_RANGE.min, max: WATCH_FONT_SIZE_RANGE.max, optional: true, placeholder: sizeMixed ? MIXED_WORD : "Auto", unit: "pt", rawTyping: true })}
      ${!somePicked(host, () => watchTileTextSettings(host.tile).fontSize !== undefined) ? nothing : linkButton("Auto", `Let the ${hostDeviceNoun(host)} size the label to the tile`, () => commit(host, "fontSize", (d) => setWatchTileFontSize(d, host.pageId, host.tileId, null)))}
    </div>`, t.fontSize)}
    <div class="hint ts-under">${oneLook(host)
      ? oneLookFontSizeHint(WATCH_FONT_SIZE_RANGE.min, WATCH_FONT_SIZE_RANGE.max)
      : `Leave empty for Auto, sized to the tile's width, or pick ${WATCH_FONT_SIZE_RANGE.min} to ${WATCH_FONT_SIZE_RANGE.max} pt.`}</div>
    ${aaField(host, "Weight", watchFontWeightMenu(t.fontWeight), weightSample, mixed((s) => s.fontWeight),
      (v) => (d) => setWatchTileFontWeight(d, host.pageId, host.tileId, v), "fontWeight")}
    ${oneLook(host) ? html`<div class="hint ts-under">${ONE_LOOK_WEIGHT_NOTE}</div>` : nothing}
    ${aaField(host, "Design", watchFontDesignMenu(t.fontDesign), designSample, mixed((s) => s.fontDesign),
      (v) => (d) => setWatchTileFontDesign(d, host.pageId, host.tileId, v), "fontDesign")}
    ${checkRow("Text shadow", t.textShadow, mixed((s) => s.textShadow), (on) => commit(host, "textShadow", (d) => setWatchTileTextShadow(d, host.pageId, host.tileId, on)))}
    ${oneLook(host) ? html`<div class="hint ts-under">${ONE_LOOK_TEXT_SHADOW_NOTE}</div>` : nothing}
    ${colorPickerView({
      label: "Label color",
      color: t.labelColor,
      swatches: watchStylingTheme(watchPageSwatchTheme(host.page))?.pageTitleSwatches ?? watchTitleSwatches(),
      swatchesLabel: "Label color",
      pickSwatch: (c) => setLabelColor(c),
      default: { title: "The theme's label color", on: everyPicked(host, () => watchTileTextSettings(host.tile).labelColor === undefined), pick: () => setLabelColor(undefined) },
      custom: { shown: labelColor, pick: setLabelColor },
      mixed: colorMixed,
      trial: colorTrial(host, "Label color", { swatch: labelColorEdit, default: labelColorEdit(null) }),
      wrap: (body) => typingField(host, "labelColor", body),
    })}`;
}

/** The one line that stands where the label's own rows were. */
export const LABEL_HIDDEN_NOTE = "The label is hidden, so its size, weight, design, shadow and color do nothing.";

/**
 * Whether the tile draws its label, so the label's size, weight, design,
 * shadow and color do something: Show label on, or an HTTP action showing
 * its reply on the tile, which names itself by its own Show Name instead
 * (`one-look/render.ts`).
 */
export function watchTileLabelDrawn(tile: WatchPageTile): boolean {
  if (tileKind(tileEntityId(tile)) === "http_action" && tile.httpResponseDisplay === "tileValue") return true;
  return watchTileTextSettings(tile).showLabel;
}

/** A label's Weight or Design as "Aa" chips, each in its own weight or
 * design; a stored value the panel does not offer keeps the menu, which
 * shows it. */
function aaField(
  host: TileSettingsHost,
  label: string,
  menu: WatchMenu,
  sample: (value: string) => TemplateResult,
  mixed: boolean,
  edit: (value: string) => (d: WatchPagesDocument) => WatchPagesDocument,
  setting: string,
): TemplateResult {
  const pick = (v: string) => commit(host, setting, edit(v));
  if (menu.note !== undefined) return menuField(label, mixedMenu(menu, mixed), pick);
  return pictureChoice(label, menu.selected, menu.options.map((o) => ({ value: o.value, label: o.label, picture: () => sample(o.value) })), pick, {
    size: "small", mixed, trial: tileTrial(host, `Label ${label.toLowerCase()}`, edit),
  });
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
  const slides = watchHoldSlideMenus(tile, host.catalog, hostDevice(host));
  const single = tap === undefined
    ? nothing
    : menuField("Single tap", tap, (v) =>
        commit(host, "singleTap", (d) => setWatchTileSingleTap(d, host.pageId, host.tileId, v === WATCH_DEFAULT_CHOICE ? null : v)));
  return html`
    ${single}
    ${slides === undefined ? nothing : renderHoldSlide(host, slides)}
    ${ask}
    ${a.skipConditions.shown
      ? html`<div class="ts-stack">${segField<WatchSkipChoice>("Skip conditions", watchSkipChoice(a.skipConditions.value), WATCH_SKIP_CHOICES as [WatchSkipChoice, string][], (v) =>
          commit(host, "skipConditions", (d) => setWatchTileSkipConditions(d, host.pageId, host.tileId, watchSkipValue(v))))}</div>
          <div class="hint">Whether running the automation from the ${hostDeviceNoun(host)} skips its conditions. Default follows "Skip conditions by default" in the ${hostDeviceNoun(host)}'s Settings.</div>`
      : nothing}`;
}

const SHOW_TILE_CHOICES: [WatchShowTileMode, string][] = [
  ["always", "Always"],
  ["on", "While on"],
  ["when", "When…"],
  ["template", "Template"],
];

/** The words of each choice in full, as the buttons' tooltips. */
const SHOW_TILE_TITLES: Partial<Record<WatchShowTileMode, string>> = {
  on: "Only while on",
  when: "Only when another entity is in a state",
  template: "Only while a Home Assistant template renders true",
};

/** The choice Show Tile draws: what is stored, or the choice picked that
 * stores nothing yet (Only When before an entity, Template before a text). */
function shownShowTileMode(host: TileSettingsHost): { mode: WatchShowTileMode; pendingKey: string } {
  const stored = watchShowTileMode(host.tile);
  const pendingKey = `${KEY}:showTile:${host.tileId.toUpperCase()}`;
  const pending = host.uiState.get(pendingKey);
  const mode: WatchShowTileMode = (pending === "when" || pending === "template") && pending !== stored ? pending : stored;
  return { mode, pendingKey };
}

/** The Visibility card's line while folded: the choice, with the entity of
 * Only When. Nothing for Always. */
function showTileSummary(host: TileSettingsHost): string {
  switch (watchShowTileMode(host.tile)) {
    case "always":
      return "";
    case "on":
      return "Only while on";
    case "when": {
      const c = watchTileShowWhen(host.tile);
      if (c === undefined || c.entityId === "") return "Only when…";
      const friendly = host.hass.states[c.entityId]?.attributes?.friendly_name;
      return `Only when ${typeof friendly === "string" && friendly.trim() !== "" ? friendly : c.entityId}`;
    }
    case "template":
      return watchTileShowWhenTemplate(host.tile) === undefined ? "Template (empty)" : "Template";
  }
}

/**
 * Show Tile, the Visibility card: Always, Only While On
 * (`hideWhenInactive`), Only When (`showWhen`) or Template
 * (`showWhenTemplate`). Only When stores nothing until an entity is picked,
 * and Template nothing until a text is typed, so the choice is held in
 * `uiState` until then and the tile keeps what it had.
 */
function renderShowTile(host: TileSettingsHost): TemplateResult {
  const { mode, pendingKey } = shownShowTileMode(host);
  const pick = (v: WatchShowTileMode) => {
    if (v === "when" || v === "template") {
      host.uiState.set(pendingKey, v);
      host.requestUpdate();
      return;
    }
    host.uiState.delete(pendingKey);
    if (v === "always") commit(host, "showTile", (d) => setWatchTileShowAlways(d, host.pageId, host.tileId));
    else commit(host, "showTile", (d) => setWatchTileShowWhileOn(d, host.pageId, host.tileId));
    host.requestUpdate();
  };
  return html`<div class="ts-sub">
    <div class="ts-stack">${segField<WatchShowTileMode>("Show tile", mode, SHOW_TILE_CHOICES, (v) => pick(v), { titles: SHOW_TILE_TITLES })}</div>
    ${mode === "always"
      ? html`<div class="hint ts-under">The ${hostDeviceNoun(host)} always shows this tile.</div>`
      : mode === "on"
        ? html`<div class="hint ts-under">The ${hostDeviceNoun(host)} leaves the tile out while it is off.</div>`
        : mode === "when"
          ? renderShowWhen(host, pendingKey)
          : renderShowWhenTemplate(host, pendingKey)}
  </div>`;
}

/**
 * Template: Home Assistant renders the text and the device shows the tile
 * only while the result reads as true (`watchTemplateTruthy`). Under the box
 * the result now, from the same renders the stage draws with, or Home
 * Assistant's error, which shows the tile.
 */
function renderShowWhenTemplate(host: TileSettingsHost, pendingKey: string): TemplateResult {
  const tile = host.tile;
  const stored = typeof tile.showWhenTemplate === "string" ? tile.showWhenTemplate : "";
  const text = watchTileShowWhenTemplate(tile);
  const render = watchShowWhenTemplateRender(host.templateRenders, tile);
  const noun = hostDeviceNoun(host);
  const write = (value: string, typing: boolean) => {
    // Emptied, the box stays: the key goes, the choice does not.
    if (value === "") host.uiState.set(pendingKey, "template");
    commit(host, "showWhenTemplate", (d) => setWatchTileShowWhenTemplate(d, host.pageId, host.tileId, value), typing ? { typing: true } : {});
  };
  let now: TemplateResult;
  if (text === undefined) {
    now = html`<div class="hint keep ts-under">Type a template, for example <code>{{ is_state('person.alex', 'home') }}</code>. Until then the ${noun} always shows the tile.</div>`;
  } else if (text.length > WATCH_SHOW_WHEN_TEMPLATE_MAX_CHARS) {
    now = html`<div class="hint warn ts-under">Longer than ${WATCH_SHOW_WHEN_TEMPLATE_MAX_CHARS} characters, so the ${noun} never asks Home Assistant about it and always shows the tile.</div>`;
  } else if (render === undefined) {
    now = html`<div class="hint ts-under" role="status">Rendering in Home Assistant…</div>`;
  } else if (!render.ok) {
    now = html`<div class="hint warn ts-under" role="status">${render.error} While it fails, the ${noun} shows the tile.</div>`;
  } else {
    const shown = watchShowWhenTemplateShows(render);
    const value = render.value.trim();
    now = html`<div class="hint ts-under" role="status">Now it renders <code>${value === "" ? "(empty)" : value}</code>, so the tile is ${shown ? "shown" : "hidden"}.</div>`;
  }
  return html`
    <div class="ts-show-tpl">${templateBox(host, stored, {
      label: "Template", rows: 3, key: `tile-${host.tileId}-show-tpl`, use: "condition", bare: false,
      placeholder: "{{ is_state('person.alex', 'home') }}",
      ...(render !== undefined && !render.ok ? { error: render.error } : {}),
      write,
      onBlur: () => host.endCoalesce(),
    })}</div>
    ${now}`;
}

/** Only When: an entity, a comparison and a state. Picking an entity makes
 * the condition, starting at that entity's state now; the x removes it. */
function renderShowWhen(host: TileSettingsHost, pendingKey: string): TemplateResult {
  const stored = host.tile.showWhen;
  const c = watchTileShowWhen(host.tile);
  const states = host.hass.states;
  const id = c?.entityId ?? "";
  const friendly = states[id]?.attributes?.friendly_name;
  const ref: EntityRef = {
    entityId: id,
    displayName: typeof friendly === "string" && friendly.trim() !== "" ? friendly : id,
    domain: tileKind(id),
  };
  const pick = (next: EntityRef, source?: EntityPickSource) => {
    const nextId = next.entityId.trim();
    if (source === "clear" || nextId === "") {
      // The rows stay open for another entity.
      host.uiState.set(pendingKey, "when");
      return commit(host, "showWhen", (d) => setWatchTileShowWhenEntity(d, host.pageId, host.tileId, null));
    }
    if (nextId === id) return;
    // Starts on the first value offered (Home, Plugged in, On), else its state now.
    const first = watchShowWhenStateChoices(nextId, states)[0]?.value ?? states[nextId]?.state ?? "";
    commit(host, "showWhen", (d) => setWatchTileShowWhenEntity(d, host.pageId, host.tileId, nextId, first), {
      reason: /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(nextId) ? undefined : "Pick an entity, or type a full entity id such as person.alex.",
    });
  };
  const unreadable = stored !== undefined && c === undefined;
  const state = typed(host, "showWhenState") ?? c?.state ?? "";
  // Above and below compare numbers, so only a number is offered there.
  const numeric = c?.comparisonOperator === "gt" || c?.comparisonOperator === "lt";
  const choices = watchShowWhenStateChoices(id, states).filter((ch) => !numeric || /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(ch.value));
  const chosen = choices.find((ch) => c !== undefined && ch.value.toLowerCase() === c.state.toLowerCase());
  const setValue = (value: string) => {
    host.uiState.delete(typedKey(host, "showWhenState"));
    commit(host, "showWhenState", (d) => setWatchTileShowWhenState(d, host.pageId, host.tileId, value));
    host.requestUpdate();
  };
  const passes = c === undefined || watchShowWhenPasses(c, states);
  // Older documents can hold both keys; the watch then needs both to pass.
  const alsoWhileOn = host.tile.hideWhenInactive === true;
  return html`
    ${unreadable
      ? html`<div class="hint warn">This tile's condition could not be read here. Pick an entity to replace it, or remove it.</div>
          ${linkButton("Remove", "Remove the condition", () => commit(host, "showWhen", (d) => setWatchTileShowWhenEntity(d, host.pageId, host.tileId, null)))}`
      : nothing}
    <div class="ts-stack">${entityField({ hass: host.hass }, "Entity", ref, pick, `pe:ts:showWhen:${host.tileId}`, { needed: true })}</div>
    ${fieldNote(host, "showWhen")}
    ${alsoWhileOn && stored !== undefined
      ? html`<div class="hint warn ts-under">This tile also hides while it is off.
          ${linkButton("Stop that", "Show it while off too, when the condition holds", () =>
            commit(host, "hideWhenOff", (d) => setWatchTileHideWhenOff(d, host.pageId, host.tileId, false)))}</div>`
      : nothing}
    ${c === undefined
      ? html`<div class="hint keep ts-under">Pick an entity, for example yourself to show a door lock only while you are home.${alsoWhileOn ? " Until then the tile still hides while it is off." : ""}</div>`
      : html`
        <div class="ts-stack">${segField<WatchShowWhenOperator>("State", c.comparisonOperator, WATCH_SHOW_WHEN_OPERATORS as [WatchShowWhenOperator, string][], (v) =>
          commit(host, "showWhenOperator", (d) => setWatchTileShowWhenOperator(d, host.pageId, host.tileId, v)))}</div>
        ${typingField(host, "showWhenState", textField("Value", state, (v) =>
          commit(host, "showWhenState", (d) => setWatchTileShowWhenState(d, host.pageId, host.tileId, v), { typing: true }), { mono: true, placeholder: numeric ? "A number" : "Pick below or type a state" }))}
        ${choices.length === 0
          ? nothing
          : html`<div class="ts-after">${choices.map((ch) => {
              const on = ch === chosen;
              return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
                title=${ch.label === ch.value ? ch.value : `${ch.label}, stored as ${ch.value}`} @click=${() => setValue(ch.value)}>${ch.label}</button>`;
            })}</div>`}
        <div class="hint ts-under ${c.state === "" ? "warn" : ""}">${c.state === ""
          ? "Pick a value above or type one. Empty matches nothing."
          : `The ${hostDeviceNoun(host)} shows this tile only while ${ref.displayName || id} ${WATCH_SHOW_WHEN_OPERATORS.find(([o]) => o === c.comparisonOperator)?.[1] ?? c.comparisonOperator} ${chosen?.label ?? c.state}. Now it is ${passes ? "shown" : "hidden"}.`}</div>`}`;
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
      : html`<div class="hint warn">This tile's hold and slide settings could not be read here. They are kept as they are.</div>`}
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
    const reason = watchColorRefusal(v, hostDevice(host));
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
          ${numberField("Text size", textSize, setTextSize, { step: 1, min: WATCH_HEADER_TEXT_SIZE_RANGE.min, max: WATCH_HEADER_TEXT_SIZE_RANGE.max, optional: true, placeholder: `Auto`, unit: "pt", rawTyping: true })}
          ${h.textSize === undefined ? nothing : linkButton("Auto", `Back to ${WATCH_HEADER_TEXT_SIZE_RANGE.auto} pt`, () => commit(host, "headerTextSize", (d) => setWatchHeaderTextSize(d, host.pageId, host.tileId, null)))}
        </div>`, h.textSize)}
        <div class="hint ts-under">Empty is Auto (${WATCH_HEADER_TEXT_SIZE_RANGE.auto} pt). Or ${WATCH_HEADER_TEXT_SIZE_RANGE.min} to ${WATCH_HEADER_TEXT_SIZE_RANGE.max}.</div>`
      : html`<div class="hint ts-under">A line across the page. Pick Label for words between two lines.</div>`}
    ${typingField(host, "headerGlow", sliderField("Line glow", glow, setGlow, { min: 0, max: 100, step: 5, def: 0, unit: "%" }), watchGlowPercent(h.glow))}
    ${colorPickerView({
      label: "Color",
      color: h.color,
      swatches: watchThemeSwatches(theme, false),
      swatchesLabel: `${watchThemeDisplayName(theme)} colors`,
      pickSwatch: (v) => writeColor(v),
      ...(defaultColor === undefined
        ? {}
        : { default: { title: `The header's own color, ${defaultColor}`, on: atDefault, pick: () => writeColor(defaultColor) } }),
      custom: { shown: typed(host, "headerColor") ?? watchCustomBoxColor(h.color), pick: custom },
      wrap: (body) => typingField(host, "headerColor", body),
    })}`;
}

// ── styling: shared rows ─────────────────────────────────────────────────

type Edit<V> = (document: WatchPagesDocument, pageId: string, tileId: string, value: V) => WatchPagesDocument;

/** A styling enum: buttons for up to four values, a menu for more; with a
 * `picture`, a picture per value (`pictureChoice`) however many there are.
 * A stored value the table does not offer is shown in the menu, not
 * offered. */
export function stylingEnumField(label: string, enumName: string, value: string, pick: (v: string) => void, opts: StylingEnumOptions = {}): TemplateResult {
  const choices = watchStylingChoices(enumName);
  const offered = choices.some((c) => c.value === value);
  const mixed = opts.mixed === true;
  if (opts.picture !== undefined && offered) {
    const picture = opts.picture;
    return pictureChoice(label, value, choices.map((c) => ({
      value: c.value,
      label: c.label,
      picture: () => picture(c.value),
      ...(opts.disabled?.[c.value] === true ? { disabled: true } : {}),
      ...(opts.titles?.[c.value] === undefined ? {} : { title: opts.titles[c.value]! }),
    })), pick, { size: opts.size ?? "tile", mixed, ...(opts.trial === undefined ? {} : { trial: opts.trial }) });
  }
  if (choices.length <= 4 && offered) {
    // Mixed lights no button.
    return mixedRow(mixed, segField(label, mixed ? "" : value, choices.map((c) => [c.value, c.label] as [string, string]), (v) => pick(v), opts));
  }
  const menu = watchChoiceMenu(choices, value);
  return menuField(label, mixedMenu({ ...menu, options: menu.options.map((o) => (opts.disabled?.[o.value] === true ? { ...o, disabled: true } : o)) }, mixed), pick);
}

/** Choices of a styling enum that are drawn but cannot be picked, with the
 * reason as each one's tooltip; and the picture of each value, which draws
 * the enum as pictures. */
export interface StylingEnumOptions {
  disabled?: Readonly<Record<string, boolean>>;
  titles?: Readonly<Record<string, string>>;
  picture?: (value: string) => TemplateResult | typeof nothing;
  size?: PictureChoiceSize;
  /** The picked tiles differ: no choice is on, and the title says Mixed. */
  mixed?: boolean;
  /** Pointing at a picture tries it on the tile (`pictureChoice`). */
  trial?: ChoiceTrial<string>;
}

/** What an enum row of the tile settings adds: what the row reads of a tile,
 * to show Mixed when the picked tiles differ, and what the stage's pill
 * calls it while a picture is tried, where the row's label says too little
 * ("Style" is "Border style"). */
interface EnumRowOptions extends StylingEnumOptions {
  read?: (tile: WatchPageTile) => unknown;
  tryName?: string;
}

function enumRow(host: TileSettingsHost, setting: string, label: string, enumName: string, value: string, set: Edit<string>, opts: EnumRowOptions = {}): TemplateResult {
  const { read, tryName, ...rest } = opts;
  const edit = (v: string) => (d: WatchPagesDocument) => set(d, host.pageId, host.tileId, v);
  return stylingEnumField(label, enumName, value, (v) => commit(host, setting, edit(v)), {
    ...rest,
    mixed: read !== undefined && pickedMixed(host, read),
    // A picture of each choice: pointing at one tries it on the tile.
    ...(rest.picture === undefined ? {} : { trial: tileTrial(host, tryName ?? label, edit) }),
  });
}

/** A border's Thickness as sample lines. */
const SMALL_THICKNESS: StylingEnumOptions = { picture: thicknessLine, size: "small" };

/**
 * A styling enum whose choices move (a tile's Effect, a border's Animation):
 * a menu where pointing at a choice plays it on the inspector head's
 * preview tile and nothing is saved until one is clicked (`tryMenuField`).
 * A stored value the table does not offer keeps the plain menu, which
 * shows it.
 */
function tryEnumRow(host: TileSettingsHost, setting: string, label: string, enumName: string, value: string, set: Edit<string>, read: (tile: WatchPageTile) => unknown, name: string): TemplateResult {
  const choices = watchStylingChoices(enumName);
  if (!choices.some((c) => c.value === value)) return enumRow(host, setting, label, enumName, value, set, { read });
  return tryMenuField(host, setting, label, choices, value,
    (v) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, v)),
    (v) => (d) => set(d, host.pageId, host.tileId, v),
    { name, mixed: pickedMixed(host, read) });
}

/**
 * The picture of each value of a styling enum that is not about the tile's
 * color (a state value, a state bar, a border's style): the value as `set`
 * stores it, read back from the tile it leaves, so a picture never shows
 * what a pick would not store, drawn by `draw` as a small sample on a
 * neutral ground that shows only what the choice changes.
 */
function neutralPicture(host: TileSettingsHost, set: Edit<string>, draw: (tile: WatchPageTile) => TemplateResult): (value: string) => TemplateResult | typeof nothing {
  return (value) => {
    const tile = watchTileIn(set(host.document, host.pageId, host.tileId, value), host.pageId, host.tileId);
    return tile === undefined ? nothing : draw(tile);
  };
}

/** A State row's value as the State task reads it, on a tile. */
function stateRowOf(tile: WatchPageTile, key: string): WatchStateRow["value"] {
  return watchTileStateCards(tile).flatMap((c) => c.rows).find((r) => r.key === key)?.value;
}

/** The neutral pictures of a state value, a state bar and a border style. */
const VALUE_PICTURE = (t: WatchPageTile) => valueSample(watchValueLabelStyle(t));
const BAR_PICTURE = (t: WatchPageTile) => barSample(String(stateRowOf(t, "stateBarStyle") ?? ""));
const BORDER_PICTURE = (t: WatchPageTile) => borderSample(watchTileBorderSettings(t));

function boolRow(host: TileSettingsHost, setting: string, label: string, value: boolean, set: Edit<boolean>, read?: (tile: WatchPageTile) => unknown): TemplateResult {
  return checkRow(label, value, read !== undefined && pickedMixed(host, read), (on) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, on)));
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
  options: { reset?: unknown; percent?: boolean; read?: (tile: WatchPageTile) => unknown } = {},
): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  const def = typeof options.reset === "number" ? options.reset : (spec.auto ?? spec.min);
  const format = options.percent ? (v: number) => `${Math.round(v * 100)}%` : undefined;
  return mixedRow(options.read !== undefined && pickedMixed(host, options.read), typingField(host, setting, sliderField(label, value, (v) => commit(host, setting, (d) => set(d, host.pageId, host.tileId, v), { typing: true }), {
    min: spec.min,
    max: spec.max,
    step: spec.step,
    def,
    ...(format === undefined ? {} : { format }),
  }), value));
}

/** A whole number slider with an Auto button (`null` removes the key). */
function autoSizeRow(host: TileSettingsHost, setting: string, label: string, sliderName: string, value: number | undefined, set: Edit<number | null>, placeholder?: string, read?: (tile: WatchPageTile) => unknown): TemplateResult {
  const spec = watchStylingSlider(sliderName);
  const mixed = read !== undefined && pickedMixed(host, read);
  if (mixed) placeholder = MIXED_WORD;
  const shown = typedNumber(typed(host, setting), mixed ? undefined : value);
  const write = (v: number | undefined) =>
    commit(host, setting, (d) => set(d, host.pageId, host.tileId, v ?? null), {
      typing: true,
      ...(v === undefined ? {} : reasonOf(watchWholeRefusal(v, spec.min, spec.max))),
    });
  return html`${typingField(host, setting, html`<div class="ts-with-link">
      ${numberField(label, shown, write, { step: 1, min: spec.min, max: spec.max, optional: true, placeholder: placeholder ?? `Auto (${spec.auto ?? ""})`, unit: "pt", rawTyping: true })}
      ${value === undefined && !mixed ? nothing : linkButton("Auto", `Let the ${hostDeviceNoun(host)} size it`, () => commit(host, setting, (d) => set(d, host.pageId, host.tileId, null)))}
    </div>`, value)}`;
}

/** The value a task's reset writes for a key. */
function resetValue(task: WatchTileStylingTask, key: string): unknown {
  return watchStylingReset(task)[key];
}

/** What a styling task's rows read of a tile. */
const TASK_READS: Readonly<Record<WatchTileStylingTask, (tile: WatchPageTile) => unknown>> = {
  state: (t) => watchTileStateCards(t).map((c) => c.rows),
  border: (t) => watchTileBorderSettings(t),
  background: (t) => watchTileBackgroundSettings(t),
};

/**
 * Whether a task's Reset is offered and its section reads "Changed": on a
 * tile while the reset would change what its rows read, on a rule's style
 * while the style holds one of the task's keys. A key the reset would only
 * write out at the value its absence reads already (a State value of Plain
 * on a tile that stores none) is no change: the rows show the same either
 * way.
 */
function taskModified(host: TileSettingsHost, task: WatchTileStylingTask): boolean {
  if (host.domainStyle === true) return watchTileTaskHeld(host.tile, task);
  if (!watchTileTaskModified(host.tile, task)) return false;
  const reset = watchTileIn(resetWatchTileTask(host.document, host.pageId, host.tileId, task), host.pageId, host.tileId);
  const read = TASK_READS[task];
  return reset === undefined || JSON.stringify(read(host.tile)) !== JSON.stringify(read(reset));
}

/** A task's Reset, shown while `taskModified`. On a tile it writes the
 * phone's reset values; on a rule's style it removes the task's keys, so
 * each reads as the watch's own default. */
function resetRow(host: TileSettingsHost, task: WatchTileStylingTask, words: string): TemplateResult | typeof nothing {
  if (!somePicked(host, () => taskModified(host, task))) return nothing;
  const domain = host.domainStyle === true;
  return html`<div class="ts-after ts-reset">${resetButton(`Reset ${words.toLowerCase()}`,
    domain ? `Remove every ${words.toLowerCase()} setting from the rule, so the ${hostDeviceNoun(host)} draws its own` : `Put every ${words.toLowerCase()} setting back to its default`, () =>
    commit(host, `reset:${task}`, (d) => (domain ? clearWatchTileTask : resetWatchTileTask)(d, host.pageId, host.tileId, task)))}</div>`;
}

/** What a color picker needs: its color, read when an edit is made (two
 * edits in one task must not start from the color drawn), and its setter,
 * which takes null for Default where Default removes the key. */
export interface StylingPaletteSource {
  color: () => string | undefined;
  write: (document: WatchPagesDocument, value: string | null) => WatchPagesDocument;
}

/**
 * The edits of a styling palette, each reading the color when it is made.
 * `gradient()` is whether the swatches show their gradient form, as they do
 * on a rainbow (the last of them). Solid on a rainbow writes the kind's
 * color, as the tile color does; Gradient leaves it. With no color stored
 * either only turns the swatches.
 */
export function stylingPaletteActions(host: TileSettingsHost, setting: string, source: StylingPaletteSource) {
  const formKey = `${KEY}:form:${host.tileId.toUpperCase()}:${setting}`;
  const gradient = (): boolean => {
    const mode = watchColorModeChoice(source.color());
    const chosen = host.uiState.get(formKey);
    return mode === "gradient" || mode === "rainbow" || (mode === "none" && (chosen === "gradient" || (chosen === undefined && watchAddUsesGradient(host.page))));
  };
  const write = (value: string | null, typing = false) => commit(host, setting, (d) => source.write(d, value), { typing });
  const pickMode = (next: "solid" | "gradient"): void => {
    const mode = watchColorModeChoice(source.color());
    if (mode === "rainbow" && next === "gradient" && host.picked === undefined) return;
    if (mode === "none") {
      host.uiState.set(formKey, next);
      host.requestUpdate();
      if (host.picked === undefined) return;
    }
    // Each tile's own color in the form picked, read when the edit runs: with
    // several tiles picked, each keeps its color, and one with none is left.
    commit(host, setting, (d) => {
      const now = source.color();
      const own = watchColorModeChoice(now);
      if (own === "none" || (own === "rainbow" && next === "gradient")) return d;
      const fallback = own === "rainbow" ? (kindDefaults(host).color ?? watchThemeSwatches(watchPageSwatchTheme(host.page), false)[0]) : undefined;
      const value = watchColorForMode(now, next, fallback, watchGradientOf);
      return value === undefined ? d : source.write(d, value);
    });
  };
  const custom = (value: string | undefined): void => {
    const reason = watchColorRefusal(value, hostDevice(host));
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(gradient() ? watchGradientOf(value) : value, true);
  };
  return { gradient, pickMode, custom, swatch: (value: string) => write(value), clear: () => write(null) };
}

/** A card's color picker (`colorPicker`): what it shows beyond its color
 * and setter. */
export interface ColorPickerSource extends StylingPaletteSource {
  /** The heading over the picker. */
  label: string;
  /** What Default draws, as the chip's tooltip ("Gray, the watch's own
   * pattern color"). Absent: no Default chip. */
  defaultTitle?: string;
  /** What Default writes: null (the default) removes the key; a color is
   * the one the device draws when the key holds none, for a key that must
   * hold a color. */
  defaultValue?: string | null;
  /** Offer Gradient, where the key takes `GRADIENT|…`. */
  gradient?: boolean;
  /** Offer the Rainbow swatch, only where the device draws `#RAINBOW` for
   * the key: the last of the gradients, or after the solid colors where
   * there is no Gradient. */
  rainbow?: boolean;
  /** Solid swatches other than the page theme's, and what a screen reader
   * calls them. */
  swatches?: readonly string[];
  swatchesLabel?: string;
}

/**
 * One color of a card, as every card draws it (`colorPickerView`): Form
 * where the key takes Gradient, then Default, the swatches and Rainbow,
 * then Custom. With Gradient offered the swatches follow the page's Solid
 * or Gradient switch until a form is picked (`stylingPaletteActions`).
 * Without it there is no Form, and a custom color is written as `#RRGGBB`.
 */
export function colorPicker(host: TileSettingsHost, setting: string, o: ColorPickerSource): TemplateResult {
  const color = o.color();
  const mode = watchColorModeChoice(color);
  const theme = watchPageSwatchTheme(host.page);
  const defaultValue = o.defaultValue ?? null;
  const write = (value: string | null, typing = false) => commit(host, setting, (d) => o.write(d, value), { typing });
  const act = o.gradient === true ? stylingPaletteActions(host, setting, o) : undefined;
  const gradient = act?.gradient() ?? false;
  const swatches = o.swatches ?? watchThemeSwatches(theme, gradient);
  const custom = act?.custom ?? ((value: string | undefined): void => {
    const reason = watchColorRefusal(value, hostDevice(host));
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(value.toUpperCase(), true);
  });
  // With several tiles picked, at the default only when every one is.
  const atDefault = everyPicked(host, () => {
    const c = o.color();
    return c === undefined || (defaultValue !== null && sameWatchColor(c, defaultValue));
  });
  const differ = host.picked !== undefined && pickedValueDiffers(host, o.color);
  const edit = (value: string | null) => (d: WatchPagesDocument) => o.write(d, value);
  return colorPickerView({
    label: o.label,
    color: differ ? undefined : color,
    swatches,
    swatchesLabel: o.swatchesLabel ?? `${o.label}: ${watchThemeDisplayName(theme)} colors`,
    pickSwatch: (v) => write(v),
    mixed: differ && !atDefault,
    trial: colorTrial(host, o.label, { swatch: edit, ...(o.defaultTitle === undefined ? {} : { default: edit(defaultValue) }) }),
    ...(o.defaultTitle === undefined
      ? {}
      : { default: { title: o.defaultTitle, on: atDefault, pick: () => { if (!atDefault) write(defaultValue); } } }),
    ...(act === undefined
      ? {}
      : { form: { shown: mode === "none" || mode === "rainbow" ? (gradient ? "gradient" : "solid") : mode, forms: ["solid", "gradient"], pick: act.pickMode } }),
    ...(o.rainbow === true ? { rainbow: {} } : {}),
    custom: { shown: typed(host, setting) ?? (differ ? undefined : watchCustomBoxColor(color)), pick: custom },
    wrap: (body) => typingField(host, setting, body),
  });
}

/** Whether a color read through the host (`ColorPickerSource.color`) differs
 * between the picked tiles. */
function pickedValueDiffers(host: TileSettingsHost, color: () => string | undefined): boolean {
  const pick = host.picked;
  if (pick === undefined || pick.ids.length < 2) return false;
  const first = pick.as(pick.ids[0]!, color);
  return pick.ids.slice(1).some((id) => {
    const c = pick.as(id, color);
    return !(c === first || (c !== undefined && first !== undefined && sameWatchColor(c, first)));
  });
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

/** A State row as One Look draws it: greyed with its reason where it does
 * nothing on the kind, else with its line under it where One Look has one. */
function renderStateRow(host: TileSettingsHost, row: WatchStateRow): TemplateResult | typeof nothing {
  if (!oneLook(host)) return stateRow(host, row);
  const kind = tileKind(tileEntityId(host.tile));
  const off = oneLookStateRowOff(kind, row.key);
  if (off !== undefined) return greyed(off, stateRow(host, row));
  const note = oneLookStateRowNote(kind, row.key, row.value);
  const body = stateRow(host, row, true);
  return note === undefined ? body : html`${body}<div class="hint ts-under">${note}</div>`;
}

function stateRow(host: TileSettingsHost, row: WatchStateRow, oneLookOn = false): TemplateResult | typeof nothing {
  const label = STATE_ROW_LABELS[row.key] ?? row.key;
  const setters = WATCH_STATE_ROW_SETTERS as Record<string, Edit<never>>;
  const set = setters[row.key];
  if (set === undefined) return nothing;
  // What the row reads of each picked tile, for Mixed.
  const read = (t: WatchPageTile) => stateRowOf(t, row.key);
  switch (row.key) {
    case "stateValueLabelStyle": {
      // One Look draws no number for some kinds' values (a media player's
      // volume is the bar): those choices are greyed, their reason the
      // button's tooltip.
      const off = oneLookOn ? oneLookValueStylesOff(tileKind(tileEntityId(host.tile))) : {};
      const disabled = Object.fromEntries(Object.keys(off).map((v) => [v, true]));
      return enumRow(host, row.key, label, row.key, String(row.value), set as Edit<string>, {
        disabled, titles: off, picture: neutralPicture(host, set as Edit<string>, VALUE_PICTURE), size: "mini", read, tryName: "State value",
      });
    }
    case "stateBarStyle":
      return enumRow(host, row.key, label, row.key, String(row.value), set as Edit<string>, { picture: neutralPicture(host, set as Edit<string>, BAR_PICTURE), size: "mini", read, tryName: "State bar" });
    case "stateBarColorStyle":
      return enumRow(host, row.key, label, row.key, String(row.value), set as Edit<string>, { read });
    case "decimalPlaces": {
      const { options } = watchDecimalOptions();
      const mixed = pickedMixed(host, read);
      return mixedRow(mixed, segField(label, mixed ? "" : String(row.value), options.map((n) => [String(n), String(n)] as [string, string]), (v) =>
        commit(host, row.key, (d) => (set as Edit<number>)(d, host.pageId, host.tileId, Number(v)))));
    }
    case "badgeFontSizeOverride":
    case "statusIconSizeOverride":
      // One Look's state size is a share of the tile's own, not a fixed
      // point size, so its Auto names no number.
      return autoSizeRow(host, row.key, label, row.key, typeof row.value === "number" ? row.value : undefined, set as Edit<number | null>,
        oneLookOn && row.key === "badgeFontSizeOverride" ? "Auto" : undefined, read);
    default:
      return boolRow(host, row.key, label, row.value === true, set as Edit<boolean>, read);
  }
}

/** A State card's rows. */
function stateRows(host: TileSettingsHost, rows: readonly WatchStateRow[]): (TemplateResult | typeof nothing)[] {
  return rows.map((row) => renderStateRow(host, row));
}

/** The State rows a rule's style cannot hold: the phone fixes both on for
 * a domain. */
const NO_DOMAIN_STATE_ROWS: ReadonlySet<string> = new Set(["showTargetTempOnTile", "showCurrentTempOnTile"]);

function renderState(host: TileSettingsHost): TemplateResult {
  const domain = host.domainStyle === true;
  const look = oneLook(host);
  const kind = tileKind(tileEntityId(host.tile));
  const cards = watchTileStateCards(host.tile, { oneLook: look })
    .map((card) => (domain ? { ...card, rows: card.rows.filter((row) => !NO_DOMAIN_STATE_ROWS.has(row.key)) } : card))
    .filter((card) => !domain || card.rows.length > 0);
  if (cards.length === 0) return html`<p class="hint keep">${watchStateEmptyText()}</p>`;
  return html`
    ${cards.map((card) => {
      const subtitle = (look ? oneLookCardSubtitle(card.id, kind) : undefined) ?? card.subtitle;
      return html`<div class="ts-group">
      <div class="ts-sub-h"><span>${card.title}</span></div>
      ${subtitle === "" ? nothing : html`<div class="hint ts-sub-note">${subtitle}.</div>`}
      ${stateRows(host, card.rows)}
      ${look ? stateCardNote(host, card.id) : nothing}</div>`;
    })}
    ${resetRow(host, "state", "State")}`;
}

/** One Look's line under a card for a tile the iPhone draws as a picture or
 * a chart, in the disc layout, where neither the bar nor the pill shows. */
function stateCardNote(host: TileSettingsHost, cardId: string): TemplateResult | typeof nothing {
  const kind = tileKind(tileEntityId(host.tile));
  const note = kind === "media_player" && watchMediaArtwork(host.tile) && cardId === "bar" ? ONE_LOOK_ARTWORK_NOTE
    : kind === "sensor" && watchSensorChart(host.tile) !== undefined && cardId === "valueLabel" ? ONE_LOOK_CHART_NOTE
    : undefined;
  return note === undefined ? nothing : html`<div class="hint ts-under">${note}</div>`;
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
    <div class="hint ts-sub-note">${oneLook(host) ? ONE_LOOK_STATE_ICONS_NOTE : "An icon or color per state. A state with none uses the tile's."}</div>
    ${card.rows.map((row) => {
      const ink = watchColorEnds(row.color ?? tileColor)?.from ?? "#FFFFFF";
      const symbol = row.icon ?? (tileIcon !== undefined && tileIcon !== "" ? tileIcon : row.defaultIcon);
      const glyph = symbol === undefined ? undefined : host.icons.render(symbol, 18, ink);
      const open = editing?.state === row.key ? editing.what : undefined;
      return html`<div class="ts-state-row ${row.overridden ? "own" : ""}">
          <span class="ts-state-glyph" aria-hidden="true">${glyph ?? html`<span class="ts-glyph-dot"></span>`}</span>
          <span class="ts-state-label">${row.label}</span>
          <button type="button" class="pe-chip ts-state-color ${open === "color" ? "on" : ""}" aria-expanded=${open === "color" ? "true" : "false"}
            title=${row.color === undefined ? `${row.label}: the tile's color` : `${row.label}: ${row.color}`} aria-label=${`${row.label} color`}
            @click=${() => toggleEdit(row.key, "color")}><i class="ts-state-sw ${row.color === undefined ? "inherit" : ""}"
              style=${`--sw:${(() => { const ends = watchColorEnds(row.color ?? tileColor); return ends === undefined ? ink : `linear-gradient(135deg, ${ends.from}, ${ends.to})`; })()}`}></i>Color</button>
          <button type="button" class="pe-chip ts-state-icon ${open === "icon" ? "on" : ""}" aria-expanded=${open === "icon" ? "true" : "false"}
            title=${row.icon === undefined ? `${row.label}: no icon of its own` : `${row.label}: ${row.icon}`}
            @click=${() => toggleEdit(row.key, "icon")}>Icon</button>
          ${row.overridden
            ? html`<button type="button" class="pe-icon-btn ts-state-reset" title=${`${row.label}: back to the tile's icon and color`} aria-label=${`Reset ${row.label}`}
                @click=${() => commit(host, `state:${row.key}`, (d) => resetWatchTileState(d, host.pageId, host.tileId, row.key))}>${uiIcon("undo")}</button>`
            : html`<span class="ts-state-reset"></span>`}
        </div>
        ${open === "icon" ? renderStateIconPicker(host, row.key, row.icon, watchColorEnds(row.color ?? tileColor)?.from) : nothing}
        ${open === "color" ? renderStateColorPicker(host, row.key, row.color) : nothing}`;
    })}
    ${card.any
      ? html`<div class="ts-after">${linkButton("Clear state overrides", "Every state back to the tile's icon and color", () => {
          host.uiState.delete(stateEditKey(host));
          commit(host, "stateClear", (d) => clearWatchTileStateOverrides(d, host.pageId, host.tileId));
        })}</div>`
      : nothing}
  </div>`;
}

/** Where State icons and colors would be with several tiles picked: one
 * grey line, when a picked tile has the card. */
function renderStateIconsOff(host: TileSettingsHost): TemplateResult | typeof nothing {
  const has = somePicked(host, () => (watchTileStateIcons(host.tile, host.hass.states[tileEntityId(host.tile)]?.attributes)?.rows.length ?? 0) > 0);
  return has ? html`<p class="hint keep ts-picked-off">State icons and colors: ${PICKED_HIDDEN_NOTE.toLowerCase()}.</p>` : nothing;
}

function renderStateIconPicker(host: TileSettingsHost, state: string, icon: string | undefined, tint: string | undefined): TemplateResult {
  const setting = `stateIcon:${state}`;
  // Starts open: a click on the state's Icon button is what asked for it.
  return html`<div class="ts-nested">${symbolField(
    { icons: host.icons, symbols: host.symbols, device: hostDevice(host) },
    icon ?? "",
    (name) => {
      const value = name.trim();
      if (value === "") return;
      commit(host, setting, (d) => setWatchTileStateIcon(d, host.pageId, host.tileId, state, value));
    },
    `pe:ts:state:${state}`,
    { defaultOpen: true, clearable: false, tint },
  )}</div>`;
}

function renderStateColorPicker(host: TileSettingsHost, state: string, color: string | undefined): TemplateResult {
  const setting = `stateColor:${state}`;
  const theme = watchPageSwatchTheme(host.page);
  const write = (value: string | null, typing = false) =>
    commit(host, setting, (d) => setWatchTileStateColor(d, host.pageId, host.tileId, state, value), { typing });
  const custom = (value: string | undefined) => {
    const reason = watchColorRefusal(value, hostDevice(host));
    if (reason !== undefined || value === undefined) return commit(host, setting, (d) => d, { reason: reason ?? "Pick a color." });
    write(value, true);
  };
  return html`<div class="ts-nested">
    ${colorPickerView({
      color,
      swatches: watchThemeSwatches(theme, false),
      swatchesLabel: `${watchThemeDisplayName(theme)} colors`,
      pickSwatch: (v) => write(v),
      default: { title: "The tile's color", on: color === undefined, pick: () => write(null) },
      custom: { shown: typed(host, setting) ?? watchCustomBoxColor(color), pick: custom },
      trial: colorTrial(host, "State color", { swatch: (v) => (d) => setWatchTileStateColor(d, host.pageId, host.tileId, state, v), default: (d) => setWatchTileStateColor(d, host.pageId, host.tileId, state, null) }),
      wrap: (body) => typingField(host, setting, body),
    })}
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

/** What each Border row reads of a tile, for Mixed. */
const BORDER_READ = {
  style: (t: WatchPageTile) => watchTileBorderSettings(t).style,
  thickness: (t: WatchPageTile) => watchTileBorderSettings(t).thickness,
  lineStyle: (t: WatchPageTile) => watchTileBorderSettings(t).lineStyle,
  glow: (t: WatchPageTile) => watchTileBorderSettings(t).glow,
  animation: (t: WatchPageTile) => watchTileBorderSettings(t).animation,
  speed: (t: WatchPageTile) => watchTileBorderSettings(t).speed,
  intensity: (t: WatchPageTile) => watchTileBorderSettings(t).intensity,
  size: (t: WatchPageTile) => watchTileBorderSettings(t).size,
  activeOnly: (t: WatchPageTile) => watchTileBorderSettings(t).activeOnly,
};

function renderBorder(host: TileSettingsHost): TemplateResult {
  const b = watchTileBorderSettings(host.tile);
  const reset = (key: string) => resetValue("border", key);
  if (tileKind(tileEntityId(host.tile)) === "spacer") {
    return html`
      ${enumRow(host, "borderThickness", "Thickness", "borderThickness", b.thickness, setWatchTileBorderThickness, { ...SMALL_THICKNESS, read: BORDER_READ.thickness, tryName: "Border thickness" })}
      <div class="hint ts-under">A spacer draws a plain line in its own color at this thickness. The other border settings do nothing on it.</div>
      ${resetRow(host, "border", "Border")}`;
  }
  return html`
    ${enumRow(host, "borderStyle", "Style", "borderStyle", b.style, setWatchTileBorderStyle, {
      picture: neutralPicture(host, setWatchTileBorderStyle, BORDER_PICTURE), size: "mini", read: BORDER_READ.style, tryName: "Border style",
    })}
    ${b.style === "line" ? html`
      ${oneLook(host) ? oneLookThickness(host, b.thickness) : enumRow(host, "borderThickness", "Thickness", "borderThickness", b.thickness, setWatchTileBorderThickness, { ...SMALL_THICKNESS, read: BORDER_READ.thickness, tryName: "Border thickness" })}
      ${enumRow(host, "borderLineStyle", "Line style", "borderLineStyle", b.lineStyle, setWatchTileBorderLineStyle, { picture: lineStyleLine, size: "small", read: BORDER_READ.lineStyle, tryName: "Border line style" })}
      ${sliderRow(host, "borderGlow", "Glow", "borderGlow", b.glow, setWatchTileBorderGlow, { reset: reset("borderGlow"), percent: true, read: BORDER_READ.glow })}` : nothing}
    ${b.style === "animate" ? html`
      ${tryEnumRow(host, "borderAnimation", "Animation", "borderAnimation", b.animation, setWatchTileBorderAnimation, BORDER_READ.animation, "Border animation")}
      ${b.animation === "none" ? nothing : html`
        ${sliderRow(host, "borderSpeed", "Speed", "borderAnimationSpeed", b.speed, setWatchTileBorderSpeed, { reset: reset("borderAnimationSpeed"), read: BORDER_READ.speed })}
        ${sliderRow(host, "borderIntensity", "Intensity", "borderAnimationIntensity", b.intensity, setWatchTileBorderIntensity, { reset: reset("borderAnimationIntensity"), read: BORDER_READ.intensity })}
        ${sliderRow(host, "borderSize", "Size", "borderAnimationSize", b.size, setWatchTileBorderSize, { reset: reset("borderAnimationSize"), read: BORDER_READ.size })}`}` : nothing}
    ${b.style === "none" ? nothing : html`
      ${boolRow(host, "borderActiveOnly", "Only when on", b.activeOnly, setWatchTileBorderActiveOnly, BORDER_READ.activeOnly)}
      ${colorPicker(host, "borderColor", {
        label: "Border color",
        color: () => watchTileBorderSettings(host.tile).color,
        gradient: true,
        rainbow: true,
        defaultTitle: "The tile's color",
        write: (d, v) => setWatchTileBorderColor(d, host.pageId, host.tileId, v),
      })}`}
    ${resetRow(host, "border", "Border")}`;
}

/** A Line border's Thickness in One Look: the hairlines are dropped for the
 * look's own rim, so Extra Thin is greyed, and a tile that holds one is told
 * why it draws no border. */
function oneLookThickness(host: TileSettingsHost, thickness: string): TemplateResult {
  const row = enumRow(host, "borderThickness", "Thickness", "borderThickness", thickness, setWatchTileBorderThickness, {
    ...SMALL_THICKNESS,
    read: BORDER_READ.thickness,
    tryName: "Border thickness",
    disabled: { extraThin: true },
    titles: { extraThin: ONE_LOOK_EXTRA_THIN_REASON },
  });
  return oneLookDrawsThickness(thickness) ? row : html`${row}<div class="hint keep ts-under">${ONE_LOOK_EXTRA_THIN_REASON}</div>`;
}

// ── styling: Background ──────────────────────────────────────────────────

/** What each Background row reads of a tile, for Mixed. */
const BACKGROUND_READ = {
  pattern: (t: WatchPageTile) => watchTileBackgroundSettings(t).pattern,
  patternOpacity: (t: WatchPageTile) => watchTileBackgroundSettings(t).patternOpacity,
  patternScale: (t: WatchPageTile) => watchTileBackgroundSettings(t).patternScale,
  effect: (t: WatchPageTile) => watchTileBackgroundSettings(t).effect,
  effectActiveOnly: (t: WatchPageTile) => watchTileBackgroundSettings(t).effectActiveOnly,
  speed: (t: WatchPageTile) => watchTileBackgroundSettings(t).speed,
  intensity: (t: WatchPageTile) => watchTileBackgroundSettings(t).intensity,
  size: (t: WatchPageTile) => watchTileBackgroundSettings(t).size,
};

function renderBackground(host: TileSettingsHost): TemplateResult {
  const g = watchTileBackgroundSettings(host.tile);
  const reset = (key: string) => resetValue("background", key);
  return html`
    <div class="ts-sub-h"><span>Pattern</span></div>
    ${enumRow(host, "pattern", "Type", "backgroundPattern", g.pattern, setWatchTilePattern, {
      picture: (v) => patternSwatch(v, PATTERN_GROUND), size: "swatch", read: BACKGROUND_READ.pattern, tryName: "Pattern",
    })}
    ${g.pattern === "none" ? nothing : html`
      ${sliderRow(host, "patternOpacity", "Opacity", "patternOpacity", g.patternOpacity, setWatchTilePatternOpacity, { reset: reset("patternOpacity"), percent: true, read: BACKGROUND_READ.patternOpacity })}
      ${sliderRow(host, "patternScale", "Size", "patternScale", g.patternScale, setWatchTilePatternScale, { read: BACKGROUND_READ.patternScale })}
      ${colorPicker(host, "patternColor", {
        label: "Pattern color",
        color: () => watchTileBackgroundSettings(host.tile).patternColor,
        gradient: true,
        defaultTitle: `Gray, the ${hostDeviceNoun(host)}'s own pattern color`,
        write: (d, v) => setWatchTilePatternColor(d, host.pageId, host.tileId, v),
      })}`}
    ${tileKind(tileEntityId(host.tile)) === "spacer" ? resetRow(host, "background", "Background") : renderEffect(host, g, reset)}`;
}

function renderEffect(host: TileSettingsHost, g: ReturnType<typeof watchTileBackgroundSettings>, reset: (key: string) => unknown): TemplateResult {
  return html`
    <div class="ts-sub-h"><span>Effect</span></div>
    ${tryEnumRow(host, "effect", "Type", "tileAnimation", g.effect, setWatchTileEffect, BACKGROUND_READ.effect, "Effect")}
    ${g.effect === "none" ? nothing : html`
      ${boolRow(host, "effectActiveOnly", "Only when on", g.effectActiveOnly, setWatchTileEffectActiveOnly, BACKGROUND_READ.effectActiveOnly)}
      ${colorPicker(host, "effectColor", {
        label: "Effect color",
        color: () => watchTileBackgroundSettings(host.tile).effectColor,
        gradient: true,
        rainbow: true,
        defaultTitle: "The tile's color",
        write: (d, v) => setWatchTileEffectColor(d, host.pageId, host.tileId, v),
      })}
      ${sliderRow(host, "effectSpeed", "Speed", "animationSpeed", g.speed, setWatchTileEffectSpeed, { reset: reset("animationSpeed"), read: BACKGROUND_READ.speed })}
      ${sliderRow(host, "effectIntensity", "Intensity", "animationIntensity", g.intensity, setWatchTileEffectIntensity, { reset: reset("animationIntensity"), read: BACKGROUND_READ.intensity })}
      ${sliderRow(host, "effectSize", "Size", "animationSize", g.size, setWatchTileEffectSize, { reset: reset("animationSize"), read: BACKGROUND_READ.size })}`}
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
  /* The row under the last card: Delete tile. */
  .ts-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  /* A fieldset only to switch every control off at once while a save is
     out; it draws nothing of its own. */
  fieldset.ts-body, fieldset.ts-plain { margin: 0; padding: 0; border: 0; min-width: 0; }
  /* A control One Look does not draw, greyed in place: its rows keep the
     card's layout as if the fieldset were not there. */
  fieldset.ts-plain.ts-off { display: contents; }
  fieldset.ts-body { display: flex; flex-direction: column; gap: 2px; padding: 2px 0 0; --wa-lab: 112px; }
  .ts-body .hint { margin: 0 0 4px; }
  /* Where a row's control starts: the title column and the gap after it
     (\`--ts-gap\`, 8px in a card, 12px in the tile inspector's groups). */
  .ts-body .hint.ts-under { padding-left: calc(var(--wa-lab) + var(--ts-gap, 8px)); margin-top: -2px; }
  .ts-nested .hint.ts-under { padding-left: calc(var(--wa-lab) + var(--ts-gap, 8px)); }
  .ts-note { padding-left: calc(var(--wa-lab) + var(--ts-gap, 8px)); }
  .ts-faint { color: var(--wa-muted); font-weight: 400; }
  /* The iPhone tag on a card or group only the iPhone reads. */
  .ts-dev-tag {
    display: inline-flex; align-items: center; gap: 3px; flex: none; margin-left: 6px; padding: 0 6px; height: 16px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; vertical-align: 1px;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0; color: var(--wa-muted);
  }
  .ts-dev-tag svg { width: 10px; height: 10px; flex: none; }
  .ts-sub-h > .ts-dev-tag { margin-left: 0; }

  .ts-glyph-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, .55); }
  .ts-target-now { padding: 4px 0 2px; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
  .ts-chips, .ts-after { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px; }
  .ts-after { padding-left: calc(var(--wa-lab) + var(--ts-gap, 8px)); }

  .ts-swatch-row { padding: 2px 0 4px calc(var(--wa-lab) + var(--ts-gap, 8px)); }
  .ts-swatches { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  /* A color picker's Default chip leads its swatches (\`color-picker.ts\`),
     a little shorter than a chip alone so the row keeps the swatches' height. */
  .ts-swatches > .ts-color-default { min-height: 24px; margin-right: 2px; }
  /* More and Less after the first ten swatches: a pill like Default. */
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
  /* A link drawn as one: the theme's accent is a grey close to the text, so
     without the underline a link read as plain words. */
  .ts-link {
    flex: none; font-size: 12px; color: var(--wa-ink); text-decoration: underline;
    text-decoration-color: color-mix(in srgb, currentColor 40%, transparent); text-underline-offset: 3px;
  }
  .ts-link:hover { text-decoration-color: currentColor; }
  .hint .ts-link { margin-left: 4px; }
  button.ghost.ts-reset-btn { border-color: var(--wa-line-strong); color: var(--wa-label, var(--wa-muted)); font-size: 12px; }
  button.ghost.ts-reset-btn svg { width: 13px; height: 13px; flex: none; }
  button.ghost.ts-reset-btn:hover:not(:disabled) { color: var(--wa-ink); }

  .ts-sub { display: flex; flex-direction: column; gap: 2px; margin: 6px 0 4px; }
  /* A card's groups (the Icon card's icon, color, glow; the State card's
     parts), a hairline between each. An empty group draws no line. */
  .ts-group { display: flex; flex-direction: column; gap: 2px; }
  .ts-group:empty { display: none; }
  .ts-group + .ts-group:not(:empty) { margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .ts-group > .ts-sub:first-child, .ts-group > .ts-sub-h:first-child { margin-top: 0; }
  .ts-streams { margin: 0 0 6px; }
  .ts-streams b { font-weight: 600; }
  .ts-play { align-items: center; }
  .ts-play-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .ts-play-box { width: 100%; max-height: 360px; border-radius: 8px; margin: 4px 0 2px; }
  .ts-sub-h { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-top: 6px;
    font-size: 11.5px; font-weight: 650; color: var(--wa-muted); letter-spacing: .02em; }
  /* A group's one line of description, under its heading and over its rows,
     so it never reads as the help of whichever row came last. */
  .ts-body .hint.ts-sub-note { margin: -1px 0 4px; }

  /* One state per row: its glyph and name, then its Color and Icon chips and
     the Reset that shows once the state has its own. */
  .ts-state-row {
    display: grid; grid-template-columns: 22px minmax(0, 1fr) auto auto 26px; align-items: center; gap: 6px;
    min-height: 34px; padding: 2px 4px; border-radius: 8px;
  }
  .ts-state-row:hover { background: color-mix(in srgb, var(--wa-hover) 60%, transparent); }
  .ts-state-glyph { display: grid; place-items: center; width: 22px; height: 22px; }
  .ts-state-glyph svg { display: block; }
  .ts-state-label { min-width: 0; font-size: 12.5px; overflow-wrap: anywhere; }
  .ts-state-row.own .ts-state-label { font-weight: 600; }
  .pe-chip.ts-state-color, .pe-chip.ts-state-icon { min-height: 26px; padding: 0 9px; display: inline-flex; align-items: center; gap: 6px; }
  .ts-state-sw { width: 12px; height: 12px; border-radius: 50%; flex: none; background: var(--sw);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 25%, transparent); }
  /* No color of its own: the tile's, faded and ringed in dashes. */
  .ts-state-sw.inherit { opacity: .45; outline: 1px dashed color-mix(in srgb, var(--wa-ink) 55%, transparent); outline-offset: 1px; }
  .ts-state-reset { width: 26px; height: 26px; }
  .ts-nested { display: flex; flex-direction: column; gap: 2px; margin: 0 0 6px 12px; padding-left: 10px;
    border-left: 2px solid var(--wa-line); --wa-lab: 62px; }

  /* The Arrangement section (\`arrange-card.ts\`): in Free, the large live
     tile on a black well as wide as the section, then the rows. */
  .ts-arr { display: flex; flex-direction: column; gap: 4px; }
  .ts-arr-pic {
    display: grid; place-items: center; width: 100%; min-height: 150px; margin: 6px 0; padding: 14px;
    border-radius: 10px; background: #000; overflow: hidden;
  }
  .ts-arr-free { display: flex; flex-direction: column; gap: 2px; }
  .ts-arr-spot-ctl { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ts-arr-spots {
    display: grid; grid-template-columns: repeat(3, 26px); gap: 3px; padding: 3px;
    border: 1px solid var(--wa-line-strong); border-radius: 9px;
  }
  .ts-arr-spot { display: grid; place-items: center; width: 26px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: transparent; cursor: pointer; }
  .ts-arr-spot > span { width: 8px; height: 8px; border-radius: 2px; background: color-mix(in srgb, var(--wa-ink) 30%, transparent); }
  .ts-arr-spot:hover > span { background: color-mix(in srgb, var(--wa-ink) 60%, transparent); }
  .ts-arr-spot.on { background: var(--wa-sel-bg); }
  .ts-arr-spot.on > span { background: var(--wa-accent); }
  .ts-arr-spot:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ts-arr-foot { display: flex; justify-content: flex-end; padding-top: 4px; }

  /* The inspector's head (\`renderTileHead\`): one strip across the
     inspector, wrapping on a narrow one. The path and the live tiles at its
     start, Name and Shows in the middle (labels over their boxes), the
     actions and Find a setting at its end. A row, said outright: the head
     also wears .ts-root, which stands its children in a column, and in a
     column the parts' flex bases (280px, 300px) became heights, so the head
     stood 800px tall with each part on its own line. */
  .ts-head {
    display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 16px 28px;
    margin: 0; padding: 16px 20px; border: 1px solid var(--wa-line); border-radius: 14px; background: var(--wa-card);
  }
  .ts-head-lead { display: flex; flex-direction: column; gap: 10px; flex: 0 1 auto; min-width: 0; }
  .ts-head-mid { display: flex; flex-direction: column; gap: 8px; flex: 1 1 280px; min-width: 240px; max-width: 440px; }
  .ts-head-side {
    display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    flex: 1 1 300px; min-width: 260px; align-self: stretch;
  }
  .ts-head-f { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .ts-head-lab { font-size: 12.5px; color: var(--wa-muted); }
  .ts-head .ts-head-f .ts-typing { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
  .ts-head .ts-head-f input[type=text] {
    width: 100%; min-width: 0; height: 36px; min-height: 36px; padding: 0 10px; font-size: 14px; font-weight: 500; border-radius: 8px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .ts-head-ent {
    display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; height: 36px; padding: 0 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-field);
  }
  .ts-head-entity { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--wa-soft, var(--wa-ink)); }
  .ts-head-none { font-size: 12.5px; color: var(--wa-muted); }
  button.link.ts-head-change { flex: none; padding: 2px 4px; border: 0; background: none; font: inherit; font-size: 12px; color: var(--ts-blue, var(--wa-accent)); cursor: pointer; }
  button.link.ts-head-change:hover { text-decoration: underline; text-underline-offset: 3px; }
  .ts-head-acts { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 2px; }
  .ts-head-acts > button { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-height: 30px; padding: 0 10px; font-size: 13px; }
  .ts-head-acts > button svg.ui-icon { width: 15px; height: 15px; }
  button.ghost.ts-reset-btn:disabled { opacity: .45; }

  ${pictureChoiceStyles}

  /* Several tiles picked: a row whose tiles differ says Mixed in grey after
     its title, and the primary tile's number it still holds is drawn faint
     (\`mixedRow\`); a group's parts that are one tile's are named on one
     grey line. */
  .ts-mixed-f .field > span:first-child::after {
    content: "Mixed"; margin-left: 4px; font-style: italic; font-weight: 400; color: var(--wa-hint, var(--wa-muted));
  }
  .ts-mixed-f input[type=number]:not(:focus) { color: transparent; }
  .ts-mixed-f input[type=range] { opacity: .45; }
  .ts-picked-off { margin: 6px 0 2px; font-size: 12px; color: var(--wa-hint, var(--wa-muted)); }

  /* The tile inspector's groups (\`renderTileInspector\`): Look, Text, Tap
     and Layout in one to four columns by the inspector's own width, pure
     CSS. \`.ts-g2\` holds Text and \`.ts-g3\`, which holds Tap and Layout;
     a wrapper turns to display: contents where its children take columns
     of their own. The inspector body is the one scroll. */
  .ts-groups {
    display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: start; margin-top: 14px;
    --ts-gap: 12px; --ts-blue: var(--wa-hue-blue, #4c8dff);
  }
  .ts-g2, .ts-g3 { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  @container insp (min-width: 760px) {
    .ts-groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ts-g3 { display: contents; }
  }
  @container insp (min-width: 1080px) {
    .ts-groups { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ts-g2 { display: contents; }
    .ts-g3 { display: flex; }
  }
  @container insp (min-width: 1560px) {
    .ts-groups { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .ts-g3 { display: contents; }
  }
  .ts-grp { min-width: 0; border: 1px solid var(--wa-line); border-radius: 14px; background: var(--wa-card); }
  .ts-grp-h { display: flex; align-items: baseline; gap: 10px; padding: 14px 18px 12px; border-bottom: 1px solid var(--wa-line); }
  /* Sentence case said outright: the panel's heading rules set uppercase. */
  .ts-grp-t { margin: 0; flex: none; font-size: 15px; font-weight: 600; color: var(--wa-ink); text-transform: none; letter-spacing: normal; }
  .ts-grp-d { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ts-grp-n { flex: none; display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--ts-blue); white-space: nowrap; }
  .ts-grp-n > i { display: block; width: 6px; height: 6px; border-radius: 50%; background: var(--ts-blue); }
  /* A removed kind's or an inbox's one line, where a group's sections would be. */
  .ts-grp > :not(.ts-grp-h):not(.ts-sec) { margin: 12px 18px; }

  /* One heading style for every section: sentence case, 13px semibold, no
     badge and no fold, the blue dot and Reset while it holds a value of its
     own. */
  .ts-sec { min-width: 0; padding: 14px 18px 16px; border-bottom: 1px solid var(--wa-line); }
  .ts-sec:last-child { border-bottom: 0; }
  .ts-sec-h { display: flex; align-items: center; gap: 8px; min-height: 22px; margin-bottom: 8px; }
  .ts-sec-h h4 { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--wa-ink); }
  .ts-sec-h > .ts-dev-tag { margin-left: 0; }
  .ts-dot { display: block; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--ts-blue); }
  button.ts-sec-reset {
    margin-left: auto; padding: 2px 4px; border: 0; border-radius: 6px; background: none; cursor: pointer;
    font: inherit; font-size: 12px; font-weight: 500; color: var(--ts-blue);
  }
  button.ts-sec-reset:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }
  button.ts-sec-reset:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ts-sec-reset:disabled { opacity: .45; cursor: default; }
  .ts-sec-b { padding: 0; }
  /* One title column in every section: 100px, the control 12px after it,
     rows at least 32px. A row whose control needs the width (pictures, the
     pattern gallery, a choice of four) keeps its title in that column too. */
  .ts-groups fieldset.ts-body { --wa-lab: 100px; gap: 4px; padding: 0; }
  .ts-groups .field { column-gap: var(--ts-gap); min-height: 32px; }
  .ts-groups .field.pc-field { display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: start; column-gap: var(--ts-gap); }
  .ts-groups .field.pc-field > span:first-child { padding-top: 8px; }
  .ts-groups .ts-stack .field { grid-template-columns: var(--wa-lab) minmax(0, 1fr); column-gap: var(--ts-gap); }
  .ts-groups .ts-stack .field.entity-field > :not(:first-child) { grid-column: 2; }
  .ts-groups .seg.wide { height: auto; min-height: 28px; flex-wrap: wrap; }
  /* A styling section's own Reset at the foot of its rows is the heading's
     Reset in the groups, so it is not drawn twice. */
  .ts-groups .ts-reset { display: none; }
  /* The line that stands where rows that do nothing were. */
  .ts-body .hint.ts-gone { margin: 2px 0 0; color: var(--wa-muted); font-style: normal; }
`;
