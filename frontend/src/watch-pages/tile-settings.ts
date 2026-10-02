// The selected tile's settings, in the side column's Tile card under the
// place and size fields: icon and color, text, action, a header's look and a
// page link's target (part 3c).
//
// `<wa-page-editor>` calls `renderTileSettings` on every draw with the
// selected tile, and puts `tileSettingsStyles` in its sheet after the shared
// form rules and its own. Everything this module needs comes through its host
// (`editor-host.ts`); it edits only through `host.apply`, and only with the
// setters of `tile-settings-model.ts`, which hold the phone's rules for what
// each setting writes. The lists, defaults and sentences come from
// `tile-settings-options.ts`.
//
// The rows are the panel's own (`editors.ts`), inside a `.sec-b` so they
// take the inspector's compact look. They send an edit on every keystroke,
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
import { uiIcon } from "../ui-icons.js";
import type { TileSettingsHost } from "./editor-host.js";
import { findWatchPage } from "./edit.js";
import { type WatchPagesDocument, tileEntityId, tileKind, watchPageId, watchPageName, watchPagesOf } from "./model.js";
import {
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
  type WatchMenu,
  type WatchSkipChoice,
  type WatchTileSettingsSection,
  WATCH_COLOR_MODES,
  WATCH_DEFAULT_CHOICE,
  WATCH_SKIP_CHOICES,
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
  watchHoldSlideMenus,
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

/** Sections open when first seen. The rest start folded, so the card opens
 * on what a person changes most. Kept by section, not by tile: a person who
 * folds Action keeps it folded from tile to tile. */
const OPEN_AT_FIRST: Readonly<Record<WatchTileSettingsSection, boolean>> = {
  opens: true,
  header: true,
  icon: true,
  text: false,
  action: false,
};

// ── state kept between draws ─────────────────────────────────────────────

function isOpen(host: TileSettingsHost, section: WatchTileSettingsSection): boolean {
  const stored = host.uiState.get(`${KEY}:open:${section}`);
  return typeof stored === "boolean" ? stored : OPEN_AT_FIRST[section];
}

function toggle(host: TileSettingsHost, section: WatchTileSettingsSection): void {
  host.uiState.set(`${KEY}:open:${section}`, !isOpen(host, section));
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

/** Drop every field's refusal: the selection is changing, and a refusal
 * belongs to the field it was shown by. `<wa-page-editor>` calls this. */
export function forgetTileSettingsNotes(uiState: Map<string, unknown>): void {
  for (const key of [...uiState.keys()]) if (key.startsWith(`${KEY}:note:`)) uiState.delete(key);
}

/** What a field shows while it is typed in, else undefined. */
function typed(host: TileSettingsHost, setting: string): string | undefined {
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
function dropStaleTyping(host: TileSettingsHost): void {
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
function commit(
  host: TileSettingsHost,
  setting: string,
  make: (document: WatchPagesDocument) => WatchPagesDocument,
  options: { typing?: boolean; reason?: string } = {},
): void {
  if (host.busy) return;
  const note = noteKey(host, setting);
  if (options.reason !== undefined) {
    host.uiState.set(note, options.reason);
    host.requestUpdate();
    return;
  }
  const had = host.uiState.delete(note);
  const next = make(host.document);
  if (next === host.document) {
    if (had) host.requestUpdate();
    return;
  }
  host.apply(next, options.typing ? { coalesce: `tile:${host.tileId}:${setting}` } : undefined);
}

/** The refusal shown by a field, if any. */
function fieldNote(host: TileSettingsHost, setting: string): TemplateResult | typeof nothing {
  const note = host.uiState.get(noteKey(host, setting));
  return typeof note === "string" ? html`<div class="hint warn ts-note" role="status">${note}</div>` : nothing;
}

/**
 * A field that is typed in: what is typed is kept while it has focus, and
 * its run of edits ends when it loses focus. Only the text and number boxes
 * count; a search box or a swatch inside the same row does not.
 */
function typingField(host: TileSettingsHost, setting: string, body: TemplateResult, stored?: number): TemplateResult {
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
  return html`<div class="ts-typing" data-ts-field=${setting}
    @input=${record}
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
function typedNumber(text: string | undefined, stored: number | undefined): number | undefined {
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
function menuField(label: string, menu: WatchMenu, pick: (value: string) => void): TemplateResult {
  return html`<label class="field"><span>${label}</span>
      <select @change=${(e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        if (!isWatchStoredChoice(value)) pick(value);
      }}>
        ${menu.options.map((o) => html`<option value=${o.value} ?disabled=${o.disabled === true}
          .selected=${live(o.value === menu.selected)}>${o.label}</option>`)}
      </select></label>
    ${menu.note === undefined ? nothing : html`<div class="hint ts-under">${menu.note}</div>`}`;
}

/** A row of small round color buttons, the page theme's swatches. */
function swatchRow(
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
function linkButton(text: string, title: string, action: () => void): TemplateResult {
  return html`<button type="button" class="link ts-link" title=${title} @click=${action}>${text}</button>`;
}

/** The defaults of the tile's kind for this page: icon and color. */
function kindDefaults(host: TileSettingsHost): { icon: string | undefined; color: string | undefined } {
  const add = watchEntityAddFromHass(host.hass as unknown as WatchHassView, tileEntityId(host.tile));
  return watchEntityDefaults(add, host.page);
}

// ── sections ─────────────────────────────────────────────────────────────

/** The settings rows for `host.tile`, or nothing. */
export function renderTileSettings(host: TileSettingsHost): TemplateResult | typeof nothing {
  const sections = watchTileSettingsSections(host.tile);
  if (sections.length === 0) return nothing;
  dropStaleTyping(host);
  return html`<div class="ts-root">
    ${sections.map((section) => renderSection(host, section))}
  </div>`;
}

function renderSection(host: TileSettingsHost, section: WatchTileSettingsSection): TemplateResult {
  const open = isOpen(host, section);
  const id = `ts-body-${section}`;
  const title = WATCH_TILE_SETTINGS_SECTION_TITLES[section];
  const summary = open ? "" : sectionSummary(host, section);
  return html`<section class="ts-sec" data-open=${open ? "true" : "false"}>
    <h4 class="ts-h">
      <button type="button" class="ts-fold" aria-expanded=${open ? "true" : "false"} aria-controls=${open ? id : nothing}
        @click=${() => toggle(host, section)}>
        <span class="ts-title">${title}</span>
        ${summary === "" ? nothing : html`<span class="ts-sum">${summary}</span>`}
        <span class="ts-chev">${uiIcon("chevron")}</span>
      </button>
    </h4>
    ${open
      ? html`<fieldset class="ts-body sec-b" id=${id} ?disabled=${host.busy} aria-label=${title}>${sectionBody(host, section)}</fieldset>`
      : nothing}
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
      const name = text.label !== undefined && text.label !== "" ? text.label : watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document));
      return text.showLabel ? name : `${name} (hidden)`;
    }
    case "action": {
      const tap = watchSingleTapSettings(tile);
      return tap.picker ? `Tap: ${tap.resolvedLabel}` : "";
    }
  }
}

function sectionBody(host: TileSettingsHost, section: WatchTileSettingsSection): TemplateResult {
  switch (section) {
    case "opens":
      return renderOpens(host);
    case "header":
      return renderHeader(host);
    case "icon":
      return renderIcon(host);
    case "text":
      return renderText(host);
    case "action":
      return renderAction(host);
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
  const atDefaultIcon = s.icon === undefined || (defaults.icon !== undefined && s.icon === defaults.icon);

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
  const defaultIcon = () =>
    commit(host, "icon", (d) =>
      defaults.icon !== undefined
        ? setWatchTileIcon(d, host.pageId, host.tileId, defaults.icon)
        : setWatchTileIconDefault(d, host.pageId, host.tileId, { icon: null, color: watchTileIconSettings(host.tile).color ?? null }));

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
        title=${defaults.icon === undefined ? "The watch picks the icon" : `The default for this kind of tile: ${defaults.icon}`}
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
    ${renderIconSize(host)}
    ${checkField("Icon shadow", s.iconShadow, (on) => commit(host, "iconShadow", (d) => setWatchTileIconShadow(d, host.pageId, host.tileId, on)))}
    ${s.dimWhenOff.applies
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
  const atDefault = color === undefined || (defaultColor !== undefined && sameWatchColor(color, defaultColor));
  const resetColor = () =>
    commit(host, "color", (d) =>
      defaultColor !== undefined
        ? setWatchTileColor(d, host.pageId, host.tileId, defaultColor)
        : setWatchTileIconDefault(d, host.pageId, host.tileId, { icon: watchTileIconSettings(host.tile).icon ?? null, color: null }));
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
        title=${defaultColor === undefined ? "No color of its own: the watch picks one" : `The theme's color for this kind of tile: ${defaultColor}`}
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

function reasonOf(reason: string | undefined): { reason?: string } {
  return reason === undefined ? {} : { reason };
}

// ── text ─────────────────────────────────────────────────────────────────

function renderText(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const t = watchTileTextSettings(tile);
  const fallback = watchTileFallbackName(tile, host.hass.states, watchPagesOf(host.document));
  const label = typed(host, "label") ?? t.label ?? "";
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
  return html`
    ${typingField(host, "label", textField("Label", label, (v) =>
      commit(host, "label", (d) => setWatchTileLabel(d, host.pageId, host.tileId, v, { emptyRemoves: true }), { typing: true }), { placeholder: fallback }))}
    <div class="hint ts-under">${watchLabelNote(tile)}</div>
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
  const tap = watchSingleTapMenu(tile);
  const slides = watchHoldSlideMenus(tile);
  const a = watchTileActionSettings(tile);
  return html`
    ${tap === undefined
      ? nothing
      : menuField("Single tap", tap, (v) =>
          commit(host, "singleTap", (d) => setWatchTileSingleTap(d, host.pageId, host.tileId, v === WATCH_DEFAULT_CHOICE ? null : v)))}
    ${slides === undefined ? nothing : renderHoldSlide(host, slides)}
    ${checkField("Ask before running", a.askBeforeRunning.value, (on) =>
      commit(host, "askBeforeRunning", (d) => setWatchTileAskBeforeRunning(d, host.pageId, host.tileId, on)))}
    <div class="hint ts-under">${watchAskBeforeRunningNote(tile)}
      ${a.askBeforeRunning.stored === undefined
        ? nothing
        : linkButton("Use the default", "Remove this tile's own setting", () =>
            commit(host, "askBeforeRunning", (d) => setWatchTileAskBeforeRunning(d, host.pageId, host.tileId, null)))}</div>
    ${checkField("Hide when off", a.hideWhenOff, (on) => commit(host, "hideWhenOff", (d) => setWatchTileHideWhenOff(d, host.pageId, host.tileId, on)))}
    <div class="hint ts-under">The watch leaves the tile out while it is off.</div>
    ${a.skipConditions.shown
      ? html`<div class="ts-stack">${segField<WatchSkipChoice>("Skip conditions", watchSkipChoice(a.skipConditions.value), WATCH_SKIP_CHOICES as [WatchSkipChoice, string][], (v) =>
          commit(host, "skipConditions", (d) => setWatchTileSkipConditions(d, host.pageId, host.tileId, watchSkipValue(v))))}</div>
          <div class="hint">Whether running the automation from the watch skips its conditions. Default follows the iPhone app.</div>`
      : nothing}`;
}

function renderHoldSlide(host: TileSettingsHost, slides: NonNullable<ReturnType<typeof watchHoldSlideMenus>>): TemplateResult {
  const setDirection = (direction: WatchSlideDirection, value: string) =>
    commit(host, `slide:${direction}`, (d) => setWatchTileHoldSlide(d, host.pageId, host.tileId, direction, value === WATCH_DEFAULT_CHOICE ? null : value));
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
        ${fieldNote(host, `slide:${row.direction}`)}`)}
    </fieldset>
    <div class="hint ts-under">Hold the tile, then slide. None turns a default off.</div>
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

/** This module's rules, in the page editor's sheet after the shared form
 * rules and the editor's own. Prefix classes with `ts-`. */
export const tileSettingsStyles = css`
  .ts-root { display: flex; flex-direction: column; margin: 4px -14px 4px; border-top: 1px solid var(--wa-line); }
  .ts-sec { border-bottom: 1px solid var(--wa-line); }
  .ts-h { margin: 0; font: inherit; }
  .ts-fold {
    display: flex; align-items: center; gap: 8px; width: 100%; min-height: 38px; padding: 0 14px;
    border: 0; background: none; color: var(--wa-ink); font: inherit; font-size: 12.5px; font-weight: 650;
    text-align: left; cursor: pointer;
  }
  .ts-fold:hover { background: var(--wa-field); }
  .ts-fold:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  .ts-title { flex: none; }
  .ts-sum { flex: 1; min-width: 0; color: var(--wa-muted); font-size: 11.5px; font-weight: 500; text-align: right;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ts-chev { flex: none; margin-left: auto; color: var(--wa-muted); opacity: .7; display: grid; place-items: center; transition: transform .15s ease-out; }
  .ts-sum + .ts-chev { margin-left: 0; }
  .ts-chev svg.ui-icon { width: 14px; height: 14px; }
  .ts-sec[data-open="true"] .ts-chev { transform: rotate(180deg); }
  /* A fieldset only to switch every control off at once while a save is
     out; it draws nothing of its own. */
  fieldset.ts-body, fieldset.ts-plain { margin: 0; padding: 0; border: 0; min-width: 0; }
  fieldset.ts-body { display: flex; flex-direction: column; gap: 2px; padding: 2px 14px 12px 14px; --wa-lab: 84px; }
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
