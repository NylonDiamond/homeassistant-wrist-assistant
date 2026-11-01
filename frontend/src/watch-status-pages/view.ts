// The status page editor's views, drawn from a host, in the complication
// editor's chrome (`editor-chrome.ts`) as the page and menu editors wear it:
// the watch preview the canvas draws from Home Assistant's states with the
// watch's own rules (`rules.ts`), whose rows are picked and dragged there, the
// stage's + Add row and the rows it cannot draw right now, and the inspector:
// a picked row's Row card, the Add a row card while a row is being added, and
// with neither the page's own settings and its look cards.
// `<wa-status-pages-editor>` owns the draft and hands a host in on every draw;
// nothing here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 16).

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import { browserStorage, type ColumnStorage } from "../column-split.js";
import { sectionCard } from "../editor-chrome.js";
import { checkField, entityField, numberField, segField, selectField, settingTitle, sliderField, symbolField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { type PhonePagesLayout, renderDeviceFrame } from "../phone-frame.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import type { JsonObject } from "../watch-pages/model.js";
import { STAGE_ZOOM_STEPS } from "../watch-pages/stage.js";
import {
  type StatusPagesDocument,
  type StatusStyleField,
  STATUS_PAGE_KEYS,
  addStatusRow,
  findStatusPage,
  findStatusRow,
  isSystemStatusPage,
  moveStatusRow,
  newStatusDynamicListRow,
  newStatusEntityRow,
  newStatusGroupCountRow,
  newStatusHeaderRow,
  removeStatusPage,
  removeStatusRow,
  resetStatusPageStyle,
  sameStatusId,
  setStatusPageStyle,
  setStatusRowKey,
  statusDeviceClassChoices,
  statusDynamicListTiles,
  statusEntityChoices,
  statusEnumChoices,
  statusGroupCountPresets,
  statusPageHasEntity,
  statusPageId,
  statusPageName,
  statusPageRows,
  statusPageStyleChanged,
  statusPagesOf,
  statusRowEntityChoices,
  statusRowId,
  statusStyleFields,
  statusStyleValue,
} from "./model.js";
import {
  type StatusPagePreset,
  type StatusPreviewRow,
  STATUS_COLORS,
  effectiveFilterState,
  maxValueLabel,
  readStatusRow,
  stateOptions,
  statusColor,
  statusPageFill,
  statusTwoColumnItems,
  swiftCapitalized,
} from "./rules.js";

/** What the views are handed on every draw. `document` and `busy` are read
 * live. */
export interface StatusPagesViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: StatusPagesDocument;
  /** A save is out: every field is drawn off and every edit refused. */
  readonly busy: boolean;
  readonly uiState: Map<string, unknown>;
  /** The watch's screen in points: the owner's reported size, else the
   * 46 mm reference. */
  readonly screen: { width: number; height: number };
  /** Points to pixels for the canvas's watch: the stage's zoom. */
  readonly scale: number;
  /** The device is an iPhone: `screen` is its pages screen's pages area, where
   * the phone draws a status page over the pages, and the page is drawn in
   * the iPhone (`phone-frame.ts`). */
  readonly phone?: PhonePagesLayout;
  /** Delete a page. One other devices have too asks first: off this device
   * only, or out of the library. Without it, Delete is an edit at once, as
   * it always was. */
  deletePage?(pageId: string): void;
  /** The first of the page's own settings in the inspector, from the editor:
   * the Name row and the On each device card. */
  readonly pageHead?: TemplateResult;
  /** The picture beside the edited stage (Side by side): drawn the same, with
   * nothing to pick or drag. */
  readonly still?: boolean;
  /** The bar's Hints: plain hints show under the settings. */
  readonly helpOn?: boolean;
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: StatusPagesDocument) => StatusPagesDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

type ViewState = Pick<StatusPagesViewHost, "uiState" | "document">;

/** Delete a page: the host's way, which asks for one other devices have
 * too, else at once. */
function deletePage(host: StatusPagesViewHost, pageId: string): void {
  if (host.deletePage !== undefined) host.deletePage(pageId);
  else host.edit((d) => removeStatusPage(d, pageId));
}

const FOLD_MODULE = "status-pages";
const PAGE_KEY = "sp:page";
const ROW_KEY = "sp:row";
const ADD_KEY = "sp:add";
const DRAG_KEY = "sp:drag";
const ADDED_KEY = "sp:added";

/** The canvas's zoom, remembered between visits. */
export const STATUS_PAGES_ZOOM_KEY = "wrist-assistant-panel.status-pages.zoom.v1";

export function loadStatusPagesZoom(storage: ColumnStorage | undefined = browserStorage()): number | undefined {
  try {
    const raw = storage?.getItem(STATUS_PAGES_ZOOM_KEY);
    const n = raw === null || raw === undefined || raw === "" ? NaN : Number(raw);
    return STAGE_ZOOM_STEPS.includes(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

export function saveStatusPagesZoom(scale: number | undefined, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(STATUS_PAGES_ZOOM_KEY, scale === undefined ? "" : String(scale));
  } catch {
    // A full or blocked storage keeps the zoom for this visit only.
  }
}

// ── words ────────────────────────────────────────────────────────────────

export const STATUS_PAGES_STAGE_HINT = "Drawn from Home Assistant's states now, as the watch draws the page. Click a row to edit it, or drag it to reorder.";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function refOf(hass: HassLike, entityId: string): EntityRef {
  const dot = entityId.indexOf(".");
  return { entityId, displayName: entityId === "" ? "" : nameOf(hass, entityId), domain: dot < 0 ? "" : entityId.slice(0, dot) };
}

/** A device class as the phone's row subtitles name it. */
function deviceClassNoun(cls: string): string {
  switch (cls) {
    case "battery_charging": return "charging";
    case "illuminance": return "light";
    case "occupancy":
    case "presence": return "occupancy";
    case "garage_door":
    case "garage": return "garage";
    case "carbon_monoxide": return "CO";
    default: return cls.replaceAll("_", " ");
  }
}

/** What a list of all matching shows, in the phone's words: "all door/window
 * sensors", "all lights". */
function domainNoun(domain: string, classes: readonly string[] | undefined): string {
  if (classes !== undefined && classes.length > 0) {
    const labels = classes.map(deviceClassNoun);
    const joined = labels.length === 1 ? labels[0]! : labels.slice(0, 2).join("/");
    if (domain === "sensor" || domain === "binary_sensor") return `${joined} sensors`;
    if (domain === "cover") return joined.includes("garage") ? "garage doors" : `${joined} covers`;
    return `${joined} ${domain}s`;
  }
  if (domain === "person") return "people";
  if (domain === "binary_sensor") return "binary sensors";
  return `${domain}s`;
}

/** A row's line under its name, the phone's `rowSubtitle`. */
export function statusRowSubtitle(row: JsonObject): string {
  const r = readStatusRow(row);
  const entities = (n: number) => `${n} ${n === 1 ? "entity" : "entities"}`;
  switch (r.rowType) {
    case "entity": return r.entityId;
    case "groupCount": return `${entities(r.groupEntityIds?.length ?? 0)} · group count`;
    case "dynamicList":
      if (r.dynamicMode === "all") return `all ${domainNoun(r.domain, r.deviceClassFilter)} · dynamic list`;
      return `${entities(r.groupEntityIds?.length ?? 0)} · dynamic list`;
    case "sectionHeader": return "section header";
    default: return r.rowType;
  }
}

/** A row type's name, the phone's. */
function rowTypeLabel(rowType: string): string {
  return STATUS_PAGE_KEYS.labels.StatusRowType?.[rowType] ?? rowType;
}

// ── selection ────────────────────────────────────────────────────────────

/** The page shown: the one picked, while it is there, else the first. */
export function shownStatusPage(host: ViewState): JsonObject | undefined {
  const pages = statusPagesOf(host.document);
  const picked = host.uiState.get(PAGE_KEY);
  return (typeof picked === "string" ? pages.find((p) => sameStatusId(statusPageId(p), picked)) : undefined) ?? pages[0];
}

export function selectStatusPage(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate">, pageId: string): void {
  host.uiState.set(PAGE_KEY, pageId);
  host.uiState.delete(ROW_KEY);
  host.uiState.delete(ADD_KEY);
  forgetChecklistOrders(host.uiState);
  host.requestUpdate();
}

/** The row picked on the shown page, while it is there. */
export function selectedStatusRow(host: ViewState): JsonObject | undefined {
  const picked = host.uiState.get(ROW_KEY);
  return typeof picked === "string" ? findStatusRow(shownStatusPage(host), picked) : undefined;
}

export function selectStatusRow(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate">, rowId: string | undefined): void {
  if (rowId === undefined) host.uiState.delete(ROW_KEY);
  else host.uiState.set(ROW_KEY, rowId);
  host.uiState.delete(ADD_KEY);
  forgetChecklistOrders(host.uiState);
  host.requestUpdate();
}

/** Let go of the picked row or the add card, back to the page's own
 * settings. Whether there was one. */
export function deselectStatusRow(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate" | "document">): boolean {
  if (selectedStatusRow(host) === undefined && !host.uiState.has(ADD_KEY)) return false;
  host.uiState.delete(ROW_KEY);
  host.uiState.delete(ADD_KEY);
  forgetChecklistOrders(host.uiState);
  host.requestUpdate();
  return true;
}

// ── the add card's state ─────────────────────────────────────────────────

type AddKind = "entity" | "groupCount" | "dynamicList";

interface AddState {
  kind: AddKind;
  /** The group count preset or the dynamic list tile picked, by index. */
  preset?: number;
  /** Dynamic lists: all matching, or hand picked. */
  mode: "all" | "specific";
  picked: string[];
}

function addState(host: Pick<StatusPagesViewHost, "uiState">): AddState | undefined {
  const held = host.uiState.get(ADD_KEY);
  return typeof held === "object" && held !== null ? (held as AddState) : undefined;
}

function setAddState(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate">, next: AddState | undefined): void {
  if (next === undefined) host.uiState.delete(ADD_KEY);
  else {
    host.uiState.set(ADD_KEY, next);
    host.uiState.delete(ROW_KEY);
  }
  host.requestUpdate();
}

/** Open the add card. */
export function openStatusAddRow(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate">, kind: AddKind = "entity"): void {
  host.uiState.delete(ADDED_KEY);
  forgetChecklistOrders(host.uiState);
  setAddState(host, { kind, mode: "all", picked: [] });
}

/** Add a row to the shown page and pick it. */
function addRow(host: StatusPagesViewHost, row: JsonObject, keepAdding = false): string | undefined {
  const page = shownStatusPage(host);
  if (page === undefined) return undefined;
  const pageId = statusPageId(page);
  let id: string | undefined;
  host.edit((d) => {
    const out = addStatusRow(d, pageId, row);
    id = out.id;
    return out.document;
  });
  if (id !== undefined && !keepAdding) selectStatusRow(host, id);
  return id;
}

// ── drag to reorder ──────────────────────────────────────────────────────

/** A row's drag on the stage: dropped on another row, it takes that row's
 * place in the page's order. `index` is the place in the stored rows, so a
 * dynamic list drawn as several rows moves as the one row it is. */
function rowDragHandlers(host: Pick<StatusPagesViewHost, "uiState">, id: string, index: number, move: (from: string, to: number) => void) {
  const mark = (e: DragEvent, on: boolean) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.classList.toggle("sp-drop", on);
  };
  return {
    start: (e: DragEvent) => {
      host.uiState.set(DRAG_KEY, id);
      e.dataTransfer?.setData("text/plain", id);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    over: (e: DragEvent) => {
      if (typeof host.uiState.get(DRAG_KEY) !== "string") return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      mark(e, true);
    },
    leave: (e: DragEvent) => mark(e, false),
    drop: (e: DragEvent) => {
      const drag = host.uiState.get(DRAG_KEY);
      host.uiState.delete(DRAG_KEY);
      mark(e, false);
      if (typeof drag !== "string" || sameStatusId(drag, id)) return;
      e.preventDefault();
      move(drag, index);
    },
    end: () => { host.uiState.delete(DRAG_KEY); },
  };
}

// ── glyphs ───────────────────────────────────────────────────────────────

function glyph(host: Pick<StatusPagesViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="sp-glyph-dot" style=${`background:${color};width:${Math.max(4, size * 0.6)}px;height:${Math.max(4, size * 0.6)}px`}></span>`;
}

/** A stored row's color for its chip: an entity row's by its state now, a
 * list's or a count's as the watch colors its rows. */
function rowColor(host: StatusPagesViewHost, row: JsonObject): string {
  const r = readStatusRow(row);
  if (r.rowType === "sectionHeader") return STATUS_COLORS.secondary!;
  if (r.rowType === "entity") return statusColor(r.domain, host.hass.states[r.entityId]?.state);
  return statusColor(r.domain, "on");
}

// ── the stage's rows ─────────────────────────────────────────────────────

/** The stage's + Add row, its one loud button: the Add a row card opens in
 * the inspector. */
export function renderAddRowButton(host: StatusPagesViewHost): TemplateResult {
  const page = shownStatusPage(host);
  return html`<button type="button" class="pe-stage-add sp-add-row" aria-label="Add row" ?disabled=${host.busy || page === undefined}
    title="Add an entity, a group count, a dynamic list or a header" @click=${() => openStatusAddRow(host)}>${uiIcon("plus")}<span>Add row</span></button>`;
}

/**
 * The rows the screen does not draw now, hidden ones and a list with nothing
 * to show, under the stage: each still has to be reachable to change it, and
 * nothing on the device stands for it. A press picks it.
 */
export function renderUndrawnRows(host: StatusPagesViewHost): TemplateResult | typeof nothing {
  const page = shownStatusPage(host);
  if (page === undefined) return nothing;
  const drawn = statusPageFill(page, host.hass.states).map((r) => r.rowId.toUpperCase());
  const left = statusPageRows(page).filter((r) => !drawn.includes(statusRowId(r).toUpperCase()));
  if (left.length === 0) return nothing;
  const selected = selectedStatusRow(host);
  return html`<div class="sp-undrawn" role="group" aria-label="Rows not on the screen now">
    <span class="sp-undrawn-l">Not on the screen now:</span>
    ${left.map((row) => {
      const r = readStatusRow(row);
      const id = statusRowId(row);
      const on = selected !== undefined && sameStatusId(id, statusRowId(selected));
      return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} data-row=${id}
        title=${statusRowSubtitle(row)} @click=${() => selectStatusRow(host, id)}>${r.displayName === "" ? "Display Name" : r.displayName}${r.isHidden === true ? " (hidden)" : ""}</button>`;
    })}
  </div>`;
}

// ── the watch preview ────────────────────────────────────────────────────

const TEXT_SIZES: Readonly<Record<string, { row: number; compact: number; icon: number }>> = {
  small: { row: 10, compact: 9, icon: 14 },
  medium: { row: 12, compact: 10, icon: 16 },
  large: { row: 14, compact: 12, icon: 18 },
};

const FONT_WEIGHTS: Readonly<Record<string, number>> = { regular: 400, medium: 500, semibold: 600, bold: 700 };

const FONT_FAMILIES: Readonly<Record<string, string>> = {
  default: "-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",
  rounded: "ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",
  monospaced: "ui-monospace, 'SF Mono', Menlo, monospace",
  serif: "ui-serif, 'New York', Georgia, serif",
};

/** The materials as white over the watch's black, from thinnest to thickest. */
const MATERIALS: Readonly<Record<string, number>> = { ultraThin: 0.1, thin: 0.13, regular: 0.16, thick: 0.2, ultraThick: 0.24 };

interface PreviewStyle {
  rowStyle: string;
  textSize: string;
  fontWeight: string;
  fontDesign: string;
  rowSpacing: number;
  backgroundMaterial: string;
  columnLayout: string;
  showDividers: boolean;
  iconPosition: string;
  horizontalPadding: number;
}

function previewStyle(page: JsonObject): PreviewStyle {
  const value = (key: string) => {
    const field = statusStyleFields().find((f) => f.key === key)!;
    return statusStyleValue(page, field);
  };
  return {
    rowStyle: String(value("rowStyle")),
    textSize: String(value("textSize")),
    fontWeight: String(value("fontWeight")),
    fontDesign: String(value("fontDesign")),
    rowSpacing: Number(value("rowSpacing")),
    backgroundMaterial: String(value("backgroundMaterial")),
    columnLayout: String(value("columnLayout")),
    showDividers: value("showDividers") === true,
    iconPosition: String(value("iconPosition")),
    horizontalPadding: Number(value("horizontalPadding")),
  };
}

function hexColor(name: string): string {
  return STATUS_COLORS[name] ?? STATUS_COLORS.secondary!;
}

function pill(style: PreviewStyle, color: string): string {
  if (style.rowStyle === "pillFilled") return `background:color-mix(in srgb, ${color} 15%, transparent);`;
  if (style.rowStyle === "pillOutline") return `box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${color} 40%, transparent);`;
  return "";
}

/** What drawing the watch screen needs of the host: the Status pages tab's cards
 * hand in only this (`renderStatusPagePicture`). */
type ScreenHost = Pick<StatusPagesViewHost, "hass" | "icons" | "scale" | "screen" | "phone" | "uiState" | "document" | "requestUpdate">
  & Partial<Pick<StatusPagesViewHost, "edit" | "busy" | "still">>;

/** What makes a drawn row a control on the edited stage: focus, Enter or
 * Space to pick it, and a drag to take another row's place. Nothing on a
 * picture (`still`, or a host with no edit). */
function stageRow(host: ScreenHost, row: StatusPreviewRow): {
  role: "button" | typeof nothing;
  tabindex: "0" | typeof nothing;
  draggable: "true" | typeof nothing;
  key: ((e: KeyboardEvent) => void) | undefined;
  start: ((e: DragEvent) => void) | undefined;
  over: ((e: DragEvent) => void) | undefined;
  leave: ((e: DragEvent) => void) | undefined;
  drop: ((e: DragEvent) => void) | undefined;
  end: (() => void) | undefined;
} {
  const edit = host.edit;
  const page = shownStatusPage(host);
  const index = page === undefined ? -1 : statusPageRows(page).findIndex((r) => sameStatusId(statusRowId(r), row.rowId));
  if (edit === undefined || host.still === true || page === undefined || index < 0) {
    return { role: nothing, tabindex: nothing, draggable: nothing, key: undefined, start: undefined, over: undefined, leave: undefined, drop: undefined, end: undefined };
  }
  const pageId = statusPageId(page);
  const drag = rowDragHandlers(host, row.rowId, index, (from, to) => edit((d) => moveStatusRow(d, pageId, from, to)));
  return {
    role: "button",
    tabindex: "0",
    draggable: host.busy === true ? nothing : "true",
    key: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      selectStatusRow(host, row.rowId);
    },
    ...drag,
  };
}

function previewIcon(host: ScreenHost, style: PreviewStyle, row: StatusPreviewRow, size: number, scale: number): TemplateResult {
  const color = hexColor(row.color);
  return html`<span class="sp-w-icon" style=${`width:${size * scale}px`}>${glyph(host, row.icon, Math.round(size * 0.8 * scale), color)}</span>`;
}

/** One row of a single column page (`statusRow`), or a header. */
function previewRow(host: ScreenHost, style: PreviewStyle, row: StatusPreviewRow, selectedId: string | undefined): TemplateResult {
  const s = host.scale;
  const sizes = TEXT_SIZES[style.textSize] ?? TEXT_SIZES.medium!;
  const on = selectedId !== undefined && sameStatusId(selectedId, row.rowId);
  const pick = () => selectStatusRow(host, row.rowId);
  const stage = stageRow(host, row);
  if (row.kind === "sectionHeader") {
    return html`<div class="sp-w-header ${on ? "on" : ""}" style=${`font-size:${9 * s}px;text-align:${row.align === "center" ? "center" : row.align === "trailing" ? "right" : "left"}`}
      role=${stage.role} tabindex=${stage.tabindex} draggable=${stage.draggable}
      @dragstart=${stage.start} @dragover=${stage.over} @dragleave=${stage.leave} @drop=${stage.drop} @dragend=${stage.end} @keydown=${stage.key}
      @click=${pick}>${row.label}</div>`;
  }
  const color = hexColor(row.color);
  const plain = style.rowStyle === "plain";
  return html`<div class="sp-w-row ${on ? "on" : ""}" title=${row.entityId ?? row.label}
    style=${`gap:${6 * s}px;font-size:${sizes.row * s}px;font-weight:${FONT_WEIGHTS[style.fontWeight] ?? 400};padding:${plain ? 0 : 4 * s}px ${plain ? 0 : 8 * s}px;border-radius:${6 * s}px;${pill(style, color)}`}
    role=${stage.role} tabindex=${stage.tabindex} draggable=${stage.draggable}
    @dragstart=${stage.start} @dragover=${stage.over} @dragleave=${stage.leave} @drop=${stage.drop} @dragend=${stage.end} @keydown=${stage.key}
    @click=${pick}>
    ${style.iconPosition === "leading" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
    <span class="sp-w-label">${row.label}</span>
    <span class="sp-w-value" style=${`color:${color}`}>${row.value}</span>
    ${style.iconPosition === "trailing" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
  </div>`;
}

/** One cell of a two column page (`twoColCell`): the icon and the value. */
function previewCell(host: ScreenHost, style: PreviewStyle, row: StatusPreviewRow, selectedId: string | undefined): TemplateResult {
  const s = host.scale;
  const sizes = TEXT_SIZES[style.textSize] ?? TEXT_SIZES.medium!;
  const on = selectedId !== undefined && sameStatusId(selectedId, row.rowId);
  const color = hexColor(row.color);
  const plain = style.rowStyle === "plain";
  const stage = stageRow(host, row);
  return html`<div class="sp-w-cell ${on ? "on" : ""}" title=${row.label}
    style=${`gap:${3 * s}px;font-size:${sizes.compact * s}px;font-weight:${FONT_WEIGHTS[style.fontWeight] ?? 400};padding:${plain ? 0 : 3 * s}px ${plain ? 0 : 6 * s}px;border-radius:${6 * s}px;${pill(style, color)}`}
    role=${stage.role} tabindex=${stage.tabindex} draggable=${stage.draggable}
    @dragstart=${stage.start} @dragover=${stage.over} @dragleave=${stage.leave} @drop=${stage.drop} @dragend=${stage.end} @keydown=${stage.key}
    @click=${() => selectStatusRow(host, row.rowId)}>
    ${style.iconPosition === "leading" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
    <span class="sp-w-value" style=${`color:${color}`}>${row.value}</span>
    ${style.iconPosition === "trailing" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
  </div>`;
}

function divider(scale: number): TemplateResult {
  return html`<div class="sp-w-divider" style=${`height:${Math.max(1, 0.5 * scale)}px`}></div>`;
}

/**
 * The shown page on the watch, as the watch's sheet draws it: the card with
 * the page's rows (`StatusPageSnippetView`) from Home Assistant's states
 * now, then Done. Hidden rows are not drawn. A row tapped here is picked.
 */
export function renderStatusPageScreen(host: StatusPagesViewHost): TemplateResult {
  const label = host.phone === undefined ? "Status page on the watch" : "Status page on the iPhone";
  return renderDeviceFrame(host.phone, host.screen, host.scale, statusScreenBox(host, label), label, host.icons);
}

/**
 * One status page alone, as the watch draws it, with no watch or iPhone
 * around it and nothing to pick: the picture on a card of the Status
 * pages tab. `scale` is points to pixels on `screen`.
 */
export function renderStatusPagePicture(input: {
  page: JsonObject;
  hass: HassLike;
  icons: IconProvider;
  screen: { width: number; height: number };
  scale: number;
}): TemplateResult {
  const host: ScreenHost = {
    hass: input.hass,
    icons: input.icons,
    screen: input.screen,
    scale: input.scale,
    uiState: new Map<string, unknown>([[PAGE_KEY, statusPageId(input.page)]]),
    document: { statusPages: [input.page] },
    requestUpdate: () => undefined,
  };
  return statusScreenBox(host, `${statusPageName(input.page) || "Untitled page"} on the watch`);
}

/** The watch screen with the shown page on it: the card of its rows, then
 * Done. */
function statusScreenBox(host: ScreenHost, label: string): TemplateResult {
  const { width, height } = host.screen;
  const s = host.scale;
  const page = shownStatusPage(host);
  const selected = selectedStatusRow(host);
  const selectedId = selected === undefined ? undefined : statusRowId(selected);
  let content: TemplateResult;
  if (page === undefined) {
    content = html`<p class="sp-w-empty">No status page.</p>`;
  } else {
    const style = previewStyle(page);
    const rows = statusPageFill(page, host.hass.states);
    const body = style.columnLayout === "twoColumn"
      ? statusTwoColumnItems(rows).map((item, i, all) => html`${item.kind === "header"
          ? previewRow(host, style, item.row, selectedId)
          : html`<div class="sp-w-pair" style=${`gap:${8 * s}px`}>${previewCell(host, style, item.first, selectedId)}${item.second === undefined
            ? html`<span class="sp-w-cell sp-w-spacer"></span>` : previewCell(host, style, item.second, selectedId)}</div>`}
          ${style.showDividers && i < all.length - 1 ? divider(s) : nothing}`)
      : rows.map((row, i) => html`${previewRow(host, style, row, selectedId)}${style.showDividers && i < rows.length - 1 ? divider(s) : nothing}`);
    const tint = MATERIALS[style.backgroundMaterial] ?? MATERIALS.regular!;
    content = html`<div class="sp-w-scroll" style=${`padding:${30 * s}px ${6 * s}px ${12 * s}px;gap:${12 * s}px`}>
      <div class="sp-w-card" style=${`padding:${8 * s}px ${(6 + style.horizontalPadding) * s}px;border-radius:${14 * s}px;background:rgba(255,255,255,${tint});font-family:${FONT_FAMILIES[style.fontDesign] ?? FONT_FAMILIES.default}`}>
        <div class="sp-w-rows" style=${`gap:${style.rowSpacing * s}px;padding:${4 * s}px 0`}>
          ${rows.length === 0 ? html`<span class="sp-w-none" style=${`font-size:${11 * s}px`}>${statusPageRows(page).length === 0 ? "Add entities" : "Nothing to show now"}</span>` : body}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15 * s}px;padding:${12 * s}px 0;border-radius:${20 * s}px`}>Done</div>
    </div>`;
  }
  return html`<div class="sp-screen" role="group" aria-label=${label}
    style=${`width:${Math.round(width * s)}px;min-height:${Math.round(height * s)}px`}>${content}</div>`;
}

/** The page's facts, for the ··· menu and the bar: its rows and how many are
 * hidden. */
export function statusStageFacts(host: Pick<StatusPagesViewHost, "uiState" | "document" | "hass">): string[] {
  const page = shownStatusPage(host);
  if (page === undefined) return [];
  const rows = statusPageRows(page);
  const hidden = rows.filter((r) => r.isHidden === true).length;
  return [plural(rows.length, "row", "rows") + (hidden > 0 ? `, ${hidden} hidden` : "")];
}

// ── the inspector ────────────────────────────────────────────────────────

function isOpen(host: Pick<StatusPagesViewHost, "uiState">, section: string): boolean {
  return sectionOpen(host.uiState, FOLD_MODULE, section);
}

function toggle(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate">, section: string): void {
  setSectionOpen(host.uiState, FOLD_MODULE, section, !isOpen(host, section));
  host.requestUpdate();
}

const BADGES: Readonly<Record<string, { color: string; icon: UiIconName }>> = {
  row: { color: SECTION_COLOR.content, icon: "content" },
  add: { color: SECTION_COLOR.content, icon: "plus" },
  page: { color: SECTION_COLOR.place, icon: "text" },
  /** The page's look in three cards: its rows in the Status pages hue, its
   * text and the rest neutral. */
  rows: { color: "var(--wa-hue-yellow)", icon: "checklist" },
  text: { color: SECTION_COLOR.place, icon: "text" },
  more: { color: SECTION_COLOR.place, icon: "look" },
};

/** The fold ids of the page's look cards, in their order. */
const LOOK_FOLDS = ["look-rows", "look-text", "look-more"] as const;

function card(host: StatusPagesViewHost, badge: keyof typeof BADGES, fold: string, title: string, body: TemplateResult, extra: { summary?: string; dot?: boolean } = {}): TemplateResult {
  const open = isOpen(host, fold);
  const mark = BADGES[badge]!;
  return sectionCard({
    color: mark.color,
    icon: uiIcon(mark.icon),
    title,
    open,
    onToggle: () => toggle(host, fold),
    ...(extra.summary === undefined || extra.summary === "" ? {} : { summary: extra.summary }),
    dot: extra.dot === true,
    id: `${FOLD_MODULE}:${fold}`,
  }, open ? body : html``);
}

/** The cards drawn now that fold, for the inspector's Collapse all. The
 * page's Name is a plain row and never folds. */
export function statusInspectorFolds(host: ViewState): FoldId[] {
  if (addState(host) !== undefined) return [{ module: FOLD_MODULE, section: "add" }];
  const look = LOOK_FOLDS.map((section) => ({ module: FOLD_MODULE, section }));
  if (selectedStatusRow(host) !== undefined) return [{ module: FOLD_MODULE, section: "row" }, ...look];
  return [...look, { module: FOLD_MODULE, section: "devices" }];
}

/** The suffix of the uiState key that holds a checklist's order. */
const CHECKLIST_ORDER = ":order";

/** A checklist's order as it was first drawn: the search it was drawn for
 * and the entities picked then. */
interface ChecklistOrder {
  query: string;
  first: readonly string[];
}

/**
 * The order of an entity checklist: the entities matching `query` (by id
 * or name), those in `first` on top, then the rest, each part in the order
 * of `choices`. `first` is the picks as they were when the list was drawn
 * for this search, not the picks now, so a tick never moves a row out from
 * under the pointer and puts another entity there.
 */
export function entityChecklistOrder(choices: readonly string[], first: readonly string[], query: string, nameOf: (entityId: string) => string): string[] {
  const q = query.trim().toLowerCase();
  const top = new Set(first);
  const matches = choices.filter((id) => q === "" || id.toLowerCase().includes(q) || nameOf(id).toLowerCase().includes(q));
  return [...matches.filter((id) => top.has(id)), ...matches.filter((id) => !top.has(id))];
}

/** Forget every checklist's order, so the next draw puts the picks then on
 * top. On a change of page, row or add. */
function forgetChecklistOrders(uiState: Map<string, unknown>): void {
  for (const key of [...uiState.keys()]) if (key.endsWith(CHECKLIST_ORDER)) uiState.delete(key);
}

/** A searchable list of entities with a box each: the picked ones first,
 * then the rest by name. The order holds while boxes are ticked (see
 * `entityChecklistOrder`), and each row is keyed by its entity and shows
 * its box's state live, so a box always shows its own entity's pick. */
function entityChecklist(
  host: StatusPagesViewHost,
  key: string,
  choices: readonly string[],
  picked: readonly string[],
  toggleOne: (entityId: string, on: boolean) => void,
): TemplateResult {
  const queryKey = `${key}:q`;
  const orderKey = `${key}${CHECKLIST_ORDER}`;
  const query = String(host.uiState.get(queryKey) ?? "").trim().toLowerCase();
  const pickedSet = new Set(picked);
  let order = host.uiState.get(orderKey) as ChecklistOrder | undefined;
  if (order === undefined || order.query !== query) {
    order = { query, first: [...picked] };
    host.uiState.set(orderKey, order);
  }
  const ordered = entityChecklistOrder(choices, order.first, query, (id) => nameOf(host.hass, id));
  const shown = ordered.slice(0, 200);
  return html`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(host.uiState.get(queryKey) ?? "")}
      @input=${(e: Event) => { host.uiState.set(queryKey, (e.target as HTMLInputElement).value); host.requestUpdate(); }} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${shown.length === 0 ? html`<div class="sp-pick-none">${choices.length === 0 ? "No entity of this kind in Home Assistant." : "No entity matches."}</div>` : nothing}
      ${repeat(shown, (id) => id, (id) => html`<label class="sp-pick-row">
        <input type="checkbox" .checked=${live(pickedSet.has(id))} ?disabled=${host.busy}
          @change=${(e: Event) => toggleOne(id, (e.target as HTMLInputElement).checked)} />
        <span class="sp-pick-name">${nameOf(host.hass, id)}</span><code>${id}</code>
      </label>`)}
      ${ordered.length > shown.length ? html`<div class="sp-pick-none">${ordered.length - shown.length} more. Search to narrow the list.</div>` : nothing}
    </div>
  </div>`;
}

/** The Row card: the picked row's settings, as the phone's row editor has
 * them, plus the keys the phone sets only from its add lists (device
 * classes, show all states). */
function renderRowCard(host: StatusPagesViewHost, page: JsonObject, row: JsonObject): TemplateResult {
  const pageId = statusPageId(page);
  const id = statusRowId(row);
  const r = readStatusRow(row);
  const set = (key: string, value: unknown, coalesce?: string) => host.edit((d) => setStatusRowKey(d, pageId, id, key, value), coalesce);
  const header = r.rowType === "sectionHeader";
  const counted = r.rowType === "groupCount" || r.rowType === "dynamicList";
  const allMatching = r.rowType === "dynamicList" && r.dynamicMode === "all";
  const handPicked = r.rowType === "groupCount" || (r.rowType === "dynamicList" && !allMatching);
  const parts: TemplateResult[] = [];

  parts.push(segField("Visibility", r.isHidden === true ? "hidden" : "visible", [["visible", "Visible"], ["hidden", "Hidden"]] as ["visible" | "hidden", string][],
    (v) => set("isHidden", v === "hidden")));
  parts.push(textField("Label", r.displayName, (v) => set("displayName", v, `row:${id}:label`), { placeholder: "Display Name" }));
  if (header) {
    parts.push(segField("Alignment", r.headerAlignment ?? "leading", statusEnumChoices("HeaderAlignment"), (v) => set("headerAlignment", v)));
  } else {
    parts.push(html`<div class="ts-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, r.iconName,
      (v) => set("iconName", v, `row:${id}:icon`), `sp:icon:${id}`)}</div>`);
  }
  if (r.rowType === "entity") {
    parts.push(html`<div class="ts-stack">${entityField({ hass: host.hass }, "Entity", refOf(host.hass, r.entityId), (ref) => {
      const entityId = ref.entityId.trim();
      if (entityId === "") return;
      host.edit((d) => {
        let next = setStatusRowKey(d, pageId, id, "entityId", entityId);
        const fresh = newStatusEntityRow(entityId, host.hass.states);
        next = setStatusRowKey(next, pageId, id, "domain", fresh.domain);
        // An icon still at the old domain's default follows the new domain.
        if (r.iconName === newStatusEntityRow(r.entityId).iconName) next = setStatusRowKey(next, pageId, id, "iconName", fresh.iconName);
        return next;
      });
    }, `sp:entity:${id}`, { clearable: false })}</div>`);
  }
  // Whether the Show State control is drawn, which the Show all states
  // hint points at.
  let stateShown = false;
  if (counted && r.domain !== "sensor") {
    const options = stateOptions(r.domain, r.deviceClassFilter);
    if (options.length >= 2) {
      stateShown = true;
      const current = effectiveFilterState(r);
      const choices: [string, string][] = options.map((o) => [o.value, o.label]);
      if (!choices.some(([v]) => v === current)) choices.push([current, swiftCapitalized(current)]);
      parts.push(segField("Show State", current, choices, (v) => set("filterState", v)));
    }
  }
  if (r.rowType === "dynamicList") {
    parts.push(segField("Entities", allMatching ? "all" : "specific", statusEnumChoices("DynamicMode") as ["all" | "specific", string][], (v) => set("dynamicMode", v)));
    parts.push(checkField("Show all states", r.showAllStates === true, (v) => set("showAllStates", v ? true : undefined), false));
    const off = stateShown ? "only those in the state above" : `only those whose state is “${effectiveFilterState(r)}”`;
    const max = r.maxNumericValue === undefined ? "" : " Either way, the max value below still applies.";
    parts.push(html`<div class="hint ts-under">On: every entity is listed whatever its state. Off: ${off}.${max}</div>`);
  }
  // The max value is drawn wherever the watch applies it: a sensor group
  // count, a sensor list of either kind (hand picked too), and a list of
  // any other domain still holding one, as the watch narrows every dynamic
  // list by it.
  if (r.domain === "sensor" ? counted : r.rowType === "dynamicList" && r.maxNumericValue !== undefined) {
    parts.push(numberField(maxValueLabel(r.deviceClassFilter), r.maxNumericValue, (v) => set("maxNumericValue", v, `row:${id}:max`),
      { optional: true, placeholder: "No limit", def: null }));
    parts.push(html`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`);
  }
  if (counted) {
    const held = r.deviceClassFilter ?? [];
    const choices = statusDeviceClassChoices(r.domain, host.hass.states, held);
    const toggleClass = (cls: string) => {
      const now = readStatusRow(findStatusRow(findStatusPage(host.document, pageId), id) ?? row).deviceClassFilter ?? [];
      const next = now.includes(cls) ? now.filter((c) => c !== cls) : [...now, cls];
      set("deviceClassFilter", next.length === 0 ? undefined : next);
    };
    parts.push(html`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${choices.length === 0 ? html`<span class="hint">None reported for ${r.domain === "" ? "this row" : r.domain}.</span>` : nothing}
        ${choices.map((cls) => {
          const on = held.includes(cls);
          return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${host.busy}
            @click=${() => toggleClass(cls)}>${cls.replaceAll("_", " ")}</button>`;
        })}
      </div></div>
      <div class="hint ts-under">${held.length === 0 ? "None picked: every class counts." : "Only entities of these classes count."}</div>`);
  }
  if (handPicked) {
    const ids = r.groupEntityIds ?? [];
    const choices = statusRowEntityChoices(row, host.hass.states);
    parts.push(html`<div class="field sp-entities-field"><span>Edit Entities (${ids.length})</span></div>
      ${entityChecklist(host, `sp:ents:${id}`, choices, ids, (entityId, on) => {
        // The row as it is now: two ticks may land before a draw.
        const held = readStatusRow(findStatusRow(findStatusPage(host.document, pageId), id) ?? row).groupEntityIds ?? [];
        const next = on ? (held.includes(entityId) ? held : [...held, entityId]) : held.filter((e) => e !== entityId);
        set("groupEntityIds", next);
      })}`);
  }

  const body = html`<fieldset class="sp-body" ?disabled=${host.busy} aria-label="Row">${parts}</fieldset>`;
  const rows = statusPageRows(page);
  const index = rows.findIndex((x) => sameStatusId(statusRowId(x), id));
  // Moving a row is a drag on the stage; these reach it from the keyboard too.
  return html`${card(host, "row", "row", rowTypeLabel(r.rowType), body, { summary: statusRowSubtitle(row) })}
    <div class="sp-acts">
      <button type="button" class="pe-btn sp-row-up" ?disabled=${host.busy || index <= 0} title="Move this row up the page"
        @click=${() => host.edit((d) => moveStatusRow(d, pageId, id, index - 1))}>${uiIcon("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn sp-row-down" ?disabled=${host.busy || index < 0 || index >= rows.length - 1} title="Move this row down the page"
        @click=${() => host.edit((d) => moveStatusRow(d, pageId, id, index + 1))}>${uiIcon("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this row from the page"
        @click=${() => host.edit((d) => removeStatusRow(d, pageId, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>`;
}

function renderStyleField(host: StatusPagesViewHost, pageId: string, page: JsonObject, field: StatusStyleField): TemplateResult {
  const value = statusStyleValue(page, field);
  const set = (v: unknown, coalesce?: string) => host.edit((d) => setStatusPageStyle(d, pageId, field.key, v), coalesce);
  switch (field.kind) {
    case "switch":
      return html`${checkField(field.label, value === true, (v) => set(v), field.default as boolean)}
        ${field.help === undefined ? nothing : html`<div class="hint ts-under">${field.help}</div>`}`;
    case "slider":
      return sliderField(field.label, Number(value), (v) => set(v, `style:${pageId}:${field.key}`), {
        min: field.min ?? 0,
        max: field.max ?? 1,
        step: field.step ?? 1,
        def: Number(field.default),
        ...(field.unit === undefined ? {} : { unit: field.unit }),
      });
    default: {
      const name = STATUS_PAGE_KEYS.types.page.keys[field.key]?.enum ?? "";
      const choices = statusEnumChoices(name);
      return choices.length <= 4
        ? segField(field.label, String(value), choices, (v) => set(v), { def: String(field.default) })
        : selectField(field.label, String(value), choices, (v) => set(v), { def: String(field.default), snapBack: true });
    }
  }
}

/** The style keys the Rows and Text cards draw as pictures; the More card
 * has the rest, with the phone's own controls. */
const ROWS_KEYS = ["rowStyle", "columnLayout", "iconPosition"] as const;
const TEXT_KEYS = ["textSize", "fontDesign", "fontWeight"] as const;
const PICTURE_KEYS: ReadonlySet<string> = new Set([...ROWS_KEYS, ...TEXT_KEYS]);

/** The "Aa" of each text size's button, in panel pixels. */
const SIZE_SAMPLE_PX: Readonly<Record<string, number>> = { small: 12, medium: 15, large: 18 };

/** One style key as the look cards read and write it. */
interface LookChoice {
  field: StatusStyleField;
  value: string;
  choices: [string, string][];
  /** The picked choice's name, for the card's summary. */
  name: string;
  set: (v: string) => void;
}

function lookChoice(host: StatusPagesViewHost, page: JsonObject, key: string): LookChoice | undefined {
  const field = statusStyleFields().find((f) => f.key === key);
  if (field === undefined) return undefined;
  const pageId = statusPageId(page);
  const value = String(statusStyleValue(page, field));
  const choices = statusEnumChoices(STATUS_PAGE_KEYS.types.page.keys[key]?.enum ?? "");
  const name = choices.find(([v]) => v === value)?.[1] ?? value;
  // A pick already on writes nothing, as the segmented controls did.
  const set = (v: string) => { if (v !== String(statusStyleValue(shownStatusPage(host) ?? page, field))) host.edit((d) => setStatusPageStyle(d, pageId, key, v)); };
  return { field, value, choices, name, set };
}

function styleKeysChanged(page: JsonObject, keys: (key: string) => boolean): boolean {
  return statusStyleFields().some((f) => keys(f.key) && !sameWatchPagesJson(statusStyleValue(page, f), f.default));
}

/** A group of picture buttons under its title, which carries the reset dot
 * back to the default. `draw` is each choice's picture. */
function pictureGroup(title: string, c: LookChoice, draw: (value: string, name: string) => TemplateResult, cls = ""): TemplateResult {
  const nameOf = (v: string) => c.choices.find(([o]) => o === v)?.[1] ?? v;
  return html`<div class="sp-look">
    <div class="sp-look-title">${settingTitle(title, c.value, String(c.field.default), (v) => c.set(v), nameOf)}</div>
    <div class="sp-pics ${cls}" role="group" aria-label=${title} style=${`--n:${c.choices.length}`}>
      ${c.choices.map(([v, name]) => {
        const on = v === c.value;
        return html`<button type="button" class="sp-pic ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} aria-label=${`${title}: ${name}`}
          @click=${() => c.set(v)}>${draw(v, name)}</button>`;
      })}
    </div>
  </div>`;
}

/** Row style: two mini rows on the watch's black, drawn in that style. */
function rowStylePicture(value: string, name: string): TemplateResult {
  return html`<span class="sp-pic-well ${value}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${name}</span>`;
}

/** Layout: a tiny grid of one or two columns. */
function layoutPicture(value: string, name: string): TemplateResult {
  return html`<span class="sp-pic-grid ${value === "twoColumn" ? "two" : ""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${name}</span>`;
}

/** Icon: a dot on the side the icon sits, none when hidden. */
function iconPicture(value: string, name: string): TemplateResult {
  const dot = html`<i class="sp-pic-dot" aria-hidden="true"></i>`;
  return html`${value === "leading" ? dot : nothing}<span class="sp-pic-name">${name}</span>${value === "trailing" ? dot : nothing}`;
}

function sizePicture(value: string, name: string): TemplateResult {
  return html`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${SIZE_SAMPLE_PX[value] ?? 15}px`}>Aa</span><span class="sp-pic-name sub">${name}</span>`;
}

function fontPicture(value: string, name: string): TemplateResult {
  return html`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${FONT_FAMILIES[value] ?? FONT_FAMILIES.default}`}>Ag</span><span class="sp-pic-name sub">${name}</span>`;
}

/** Weight: a compact segmented control, each choice set in its own weight. */
function weightField(c: LookChoice): TemplateResult {
  const nameOf = (v: string) => c.choices.find(([o]) => o === v)?.[1] ?? v;
  return html`<div class="field seg-field sp-weight-field">${settingTitle("Weight", c.value, String(c.field.default), (v) => c.set(v), nameOf)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${c.choices.map(([v, name]) => {
        const on = v === c.value;
        return html`<button type="button" class=${on ? "on" : ""} aria-pressed=${on ? "true" : "false"} aria-label=${`Weight: ${name}`}
          style=${`--w:${FONT_WEIGHTS[v] ?? 400}`} @click=${() => c.set(v)}>${name}</button>`;
      })}
    </div></div>`;
}

/**
 * The page's look, in three cards with the phone's keys and values: Rows
 * (style, layout and icon as pictures), Text (size and font as pictures,
 * weight as a segmented control set in each weight), and More (background,
 * dividers, numbers and spacing, with the phone's controls). Reset to
 * Defaults after them puts every one back.
 */
function renderLookCards(host: StatusPagesViewHost, page: JsonObject): TemplateResult {
  const pageId = statusPageId(page);
  const pick = (key: string) => lookChoice(host, page, key);
  const [rowStyle, layout, icon] = ROWS_KEYS.map(pick);
  const [size, font, weight] = TEXT_KEYS.map(pick);
  const summary = (cs: (LookChoice | undefined)[]) => cs.filter((c) => c !== undefined).map((c) => c.name).join(", ");
  const rowsChanged = styleKeysChanged(page, (k) => (ROWS_KEYS as readonly string[]).includes(k));
  const textChanged = styleKeysChanged(page, (k) => (TEXT_KEYS as readonly string[]).includes(k));
  const moreChanged = styleKeysChanged(page, (k) => !PICTURE_KEYS.has(k));
  const changed = statusPageStyleChanged(page);

  const rows = card(host, "rows", "look-rows", "Rows", html`<fieldset class="sp-body sp-looks" ?disabled=${host.busy} aria-label="Rows">
    ${rowStyle === undefined ? nothing : pictureGroup("Style", rowStyle, rowStylePicture)}
    ${layout === undefined ? nothing : pictureGroup("Layout", layout, layoutPicture, "across")}
    ${icon === undefined ? nothing : pictureGroup("Icon", icon, iconPicture, "inline")}
  </fieldset>`, { summary: summary([rowStyle, layout]), dot: rowsChanged });

  const text = card(host, "text", "look-text", "Text", html`<fieldset class="sp-body sp-looks" ?disabled=${host.busy} aria-label="Text">
    ${size === undefined ? nothing : pictureGroup("Size", size, sizePicture, "type")}
    ${font === undefined ? nothing : pictureGroup("Font", font, fontPicture, "type")}
    ${weight === undefined ? nothing : weightField(weight)}
  </fieldset>`, { summary: summary([size, weight, font]), dot: textChanged });

  const more = card(host, "more", "look-more", "More", html`<fieldset class="sp-body" ?disabled=${host.busy} aria-label="More">
    ${statusStyleFields().filter((f) => !PICTURE_KEYS.has(f.key)).map((f) => renderStyleField(host, pageId, page, f))}
  </fieldset>`, { summary: moreChanged ? "Changed" : "Defaults", dot: moreChanged });

  return html`${rows}${text}${more}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${host.busy || !changed} title="Put the page's whole look back to the app's defaults"
        @click=${() => host.edit((d) => resetStatusPageStyle(d, pageId))}>${uiIcon("reset")}<span>Reset to Defaults</span></button>
    </div>`;
}

/** The foot of the page's settings, as on Pages: the line on reaching a row,
 * then Delete page. A starter page says what it is. */
function renderPageFoot(host: StatusPagesViewHost, page: JsonObject): TemplateResult {
  const pageId = statusPageId(page);
  return html`${isSystemStatusPage(page) ? html`<div class="hint keep sp-starter">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>` : nothing}
    <div class="pe-no-tile">
      <span class="pe-no-tile-ic" aria-hidden="true">${uiIcon("tap")}</span>
      <p>${statusPageRows(page).length === 0 ? "No rows yet. Add entities to show in this status page." : "Click a row on the stage to edit it, or drag it to reorder."}</p>
    </div>
    <div class="pe-page-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Delete this status page"
        @click=${() => deletePage(host, pageId)}>${uiIcon("delete")}<span>Delete page</span></button>
    </div>`;
}

function presetButton(host: StatusPagesViewHost, preset: StatusPagePreset, on: boolean, pick: () => void): TemplateResult {
  const color = statusColor(preset.domain, "on");
  return html`<button type="button" class="sp-preset ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${host.busy} @click=${pick}>
    <span class="sp-preset-glyph">${glyph(host, preset.icon, 18, color === STATUS_COLORS.secondary ? "#5B8FD4" : color)}</span>
    <span class="sp-preset-label">${preset.label}</span>
  </button>`;
}

/** The Add a row card: Entity, Group Count, Dynamic List or Header, with
 * the phone's lists. */
function renderAddCard(host: StatusPagesViewHost, page: JsonObject, state: AddState): TemplateResult {
  const set = (next: Partial<AddState>) => setAddState(host, { ...state, ...next });
  const added = host.uiState.get(ADDED_KEY);
  const kinds: [AddKind | "header", string][] = [["entity", "Entity"], ["groupCount", "Group Count"], ["dynamicList", "Dynamic List"], ["header", "Header"]];
  const kindRow = segField("Add", state.kind, kinds, (v) => {
    if (v === "header") {
      addRow(host, newStatusHeaderRow());
      return;
    }
    host.uiState.delete(ADDED_KEY);
    set({ kind: v, preset: undefined, picked: [], mode: "all" });
  });
  let body: TemplateResult;
  if (state.kind === "entity") {
    const count = Number(host.uiState.get(`${ADD_KEY}:n`) ?? 0) || 0;
    body = html`<div class="ts-stack">${entityField({ hass: host.hass }, "Entity", refOf(host.hass, ""), (ref) => {
      const entityId = ref.entityId.trim();
      if (entityId === "") return;
      host.uiState.set(`${ADD_KEY}:n`, count + 1);
      const now = shownStatusPage(host);
      if (now !== undefined && statusPageHasEntity(now, entityId)) {
        host.uiState.set(ADDED_KEY, `${nameOf(host.hass, entityId)} is on this page already.`);
        host.requestUpdate();
        return;
      }
      addRow(host, newStatusEntityRow(entityId, host.hass.states), true);
      host.uiState.set(ADDED_KEY, `Added ${nameOf(host.hass, entityId)}.`);
      host.requestUpdate();
    }, `sp:add:entity:${count}`, { clearable: false })}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`;
  } else {
    const presets = state.kind === "groupCount" ? statusGroupCountPresets() : statusDynamicListTiles();
    const preset = state.preset === undefined ? undefined : presets[state.preset];
    const handPicked = state.kind === "groupCount" || state.mode === "specific";
    const intro = state.kind === "groupCount"
      ? "Counts how many of the entities you pick are in a state."
      : "Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.";
    const grid = html`<div class="sp-presets" role="group" aria-label=${state.kind === "groupCount" ? "Group Count" : "Dynamic List"}>
      ${presets.map((p, i) => presetButton(host, p, state.preset === i, () => {
        if (!handPicked) {
          addRow(host, newStatusDynamicListRow(p));
          return;
        }
        set({ preset: i, picked: [] });
      }))}
    </div>`;
    let pickStep: TemplateResult | typeof nothing = nothing;
    if (handPicked && preset !== undefined) {
      const classes = state.kind === "groupCount" ? (preset.picker === "deviceClass" ? preset.deviceClassFilter : undefined) : preset.deviceClassFilter;
      const choices = statusEntityChoices(preset.domain, classes, host.hass.states);
      pickStep = html`<div class="field sp-entities-field"><span>${preset.label}: ${plural(state.picked.length, "entity", "entities")} picked</span></div>
        ${entityChecklist(host, `${ADD_KEY}:pick`, choices, state.picked, (entityId, on) => {
          // The add as it is now: two ticks may land before a draw.
          const now = addState(host) ?? state;
          const rest = now.picked.filter((e) => e !== entityId);
          setAddState(host, { ...now, picked: on ? [...rest, entityId] : rest });
        })}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${host.busy}
            @click=${() => {
              const picked = (addState(host) ?? state).picked;
              addRow(host, state.kind === "groupCount" ? newStatusGroupCountRow(preset, picked) : newStatusDynamicListRow(preset, picked));
            }}>
            ${uiIcon("plus")}<span>Add ${state.kind === "groupCount" ? "group count" : "dynamic list"}</span></button>
        </div>`;
    }
    body = html`<p class="hint">${intro}</p>
      ${state.kind === "dynamicList" ? segField("Entities", state.mode, statusEnumChoices("DynamicMode") as ["all" | "specific", string][], (v) => set({ mode: v, preset: undefined, picked: [] })) : nothing}
      ${grid}${pickStep}`;
  }
  return html`${card(host, "add", "add", "Add a row", html`<fieldset class="sp-body" ?disabled=${host.busy} aria-label="Add a row">
    ${kindRow}${body}
    ${typeof added === "string" ? html`<div class="hint sp-added" role="status">${added}</div>` : nothing}
  </fieldset>`, { summary: statusPageName(page) })}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${() => setAddState(host, undefined)}>Done</button>
    </div>`;
}

/**
 * The inspector: a sticky head with Page, or the path back to it and a picked
 * row's chip and name, and Collapse all, then the cards. A picked row has its
 * Row card and the page's look cards (Rows, Text, More); adding a row, the Add
 * a row card; with neither, the page's own settings as on Pages: the editor's
 * Name row and On each device card (`pageHead`), the look cards, the line on
 * reaching a row, and Delete page.
 */
export function renderStatusInspector(host: StatusPagesViewHost): TemplateResult {
  const page = shownStatusPage(host);
  if (page === undefined) {
    return html`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;
  }
  const row = selectedStatusRow(host);
  const adding = addState(host);
  const folds = statusInspectorFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  let crumbs: TemplateResult;
  let body: TemplateResult;
  if (adding !== undefined) {
    crumbs = html`<div class="crumbs"><button class="root" title="The page's own settings" @click=${() => deselectStatusRow(host)}>Page</button><span class="sep">›</span><span class="nm">Add a row</span></div>`;
    body = renderAddCard(host, page, adding);
  } else if (row !== undefined) {
    const r = readStatusRow(row);
    const label = r.displayName === "" ? "Display Name" : r.displayName;
    crumbs = html`<div class="crumbs"><button class="root" title="The page's own settings" @click=${() => selectStatusRow(host, undefined)}>Page</button><span class="sep">›</span><span class="kchip" style=${`--k:${rowColor(host, row)}`}>${rowTypeLabel(r.rowType)}</span><span class="nm" title=${label}>${label}</span></div>`;
    body = html`${renderRowCard(host, page, row)}${renderLookCards(host, page)}`;
  } else {
    crumbs = html`<div class="crumbs"><span class="nm pe-insp-t">Page</span></div>`;
    body = html`${host.pageHead ?? nothing}${renderLookCards(host, page)}${renderPageFoot(host, page)}`;
  }
  return html`<div class="insp-head">
      ${crumbs}
      <button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>
    </div>
    <div class="insp-body pe-page-insp" data-help=${host.helpOn === true ? "on" : "off"}>${body}</div>`;
}

/** Whether `findStatusPage` finds the page picked; for the editor's keys. */
export function statusPageShown(host: ViewState, pageId: string): boolean {
  return findStatusPage(host.document, pageId) !== undefined;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const statusPagesViewStyles = css`
  /* The save-first line in place of a status page's ticks, in the bar
     (libraryTicksStyles has the ticks). */
  .sp-lib-hint { margin: 0; max-width: 280px; font-size: 12px; line-height: 1.3; color: var(--wa-muted); }
  .sp-glyph-dot { display: inline-block; border-radius: 50%; }
  /* The rows the screen does not draw now, under the stage: a press picks one. */
  .sp-undrawn { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; max-width: 520px; align-self: center; }
  .sp-undrawn-l { font-size: 12px; color: var(--wa-muted); }
  .sp-starter { margin: 12px 0 0; }
  /* A row on the edited stage: its focus, and where a drag would land. */
  .sp-w-row[tabindex]:focus-visible, .sp-w-cell[tabindex]:focus-visible, .sp-w-header[tabindex]:focus-visible { outline: 2px solid var(--sp-mark); outline-offset: 2px; border-radius: 4px; }
  .sp-w-row[draggable="true"], .sp-w-cell[draggable="true"], .sp-w-header[draggable="true"] { cursor: grab; }
  .sp-w-row.sp-drop, .sp-w-cell.sp-drop, .sp-w-header.sp-drop { box-shadow: 0 -2px 0 0 var(--sp-mark); }

  /* The watch screen on the stage: black, as tall as the page needs. */
  .sp-screen { position: relative; flex: none; background: #000; color: #fff; overflow: hidden; }
  .sp-w-scroll { display: flex; flex-direction: column; }
  .sp-w-card { display: flex; flex-direction: column; }
  .sp-w-rows { display: flex; flex-direction: column; }
  .sp-w-row, .sp-w-cell { display: flex; align-items: center; min-width: 0; cursor: pointer; line-height: 1.25; }
  .sp-w-row .sp-w-label { flex: 1 1 auto; min-width: 0; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-w-row .sp-w-value, .sp-w-cell .sp-w-value { flex: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
  .sp-w-cell { flex: 1 1 0; justify-content: center; }
  .sp-w-cell .sp-w-value { max-width: 100%; }
  .sp-w-cell.sp-w-spacer { cursor: default; }
  .sp-w-pair { display: flex; align-items: center; }
  .sp-w-icon { display: inline-grid; place-items: center; flex: none; }
  .sp-w-icon svg { display: block; }
  .sp-w-header { font-weight: 600; color: rgba(235, 235, 245, .6); cursor: pointer; letter-spacing: .02em; }
  .sp-w-divider { background: rgba(255, 255, 255, .3); opacity: .3; }
  .sp-w-none { color: rgba(235, 235, 245, .6); text-align: center; }
  .sp-w-done { text-align: center; font-weight: 600; background: rgba(255, 255, 255, .14); color: #fff; }
  .sp-w-empty { margin: 40% 12px 0; text-align: center; color: rgba(255, 255, 255, .6); font-size: 12px; }
  .sp-screen { --sp-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .sp-w-row.on, .sp-w-cell.on, .sp-w-header.on { outline: 1.5px solid var(--sp-mark); outline-offset: 2px; border-radius: 4px; }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.sp-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  .sp-body .hint { margin: 0 0 4px; }
  .sp-note { margin: 10px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .sp-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .sp-added { color: var(--wa-green, inherit); }
  .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .sp-classes .sp-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0; }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-entities-field > span { font-weight: 600; }

  /* A searchable checklist of entities. */
  .sp-pick { display: flex; flex-direction: column; gap: 6px; margin: 2px 0 6px; }
  .sp-pick-q {
    width: 100%; min-height: 30px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .sp-pick-list { display: flex; flex-direction: column; max-height: 260px; overflow: auto; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .sp-pick-row { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; align-items: center; padding: 5px 8px; border-top: 1px solid var(--wa-line); cursor: pointer; }
  .sp-pick-row:first-child { border-top: 0; }
  .sp-pick-row > code { grid-column: 2; color: var(--wa-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sp-pick-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
  .sp-pick-none { padding: 8px; color: var(--wa-muted); font-size: 12px; }

  /* The page's look as pictures: a titled group of buttons, each a small
     drawing with its name. A pick is the neutral raised fill and a brighter
     line, the rest a plain grey outline; the mini drawings sit on the
     watch's black and use the panel's own watch art tokens. */
  fieldset.sp-looks { gap: 10px; padding-top: 4px; }
  .sp-look { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .sp-look-title > span { position: relative; display: inline-block; font-size: 12px; color: var(--wa-muted); }
  .sp-look-title > span.changed { color: var(--wa-ink); }
  .sp-look-title button.reset-dot { top: 50%; margin-top: -2.5px; }
  .sp-pics { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 6px; }
  .sp-pic {
    display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 6px; min-width: 0;
    padding: 7px 6px 6px; border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-label); font: inherit; font-size: 11.5px; line-height: 1.2; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .sp-pic:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); color: var(--wa-ink); }
  .sp-pic.on { background: var(--wa-panel); border-color: var(--wa-accent); color: var(--wa-ink); }
  .sp-pic:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-pic:disabled { opacity: .45; cursor: default; }
  .sp-pic-name { text-align: center; overflow-wrap: anywhere; }
  .sp-pic-name.sub { font-size: 10.5px; color: var(--wa-muted); }
  .sp-pic.on .sp-pic-name.sub { color: var(--wa-label); }
  /* Row style: two mini rows in the style on the watch's black. */
  .sp-pic-well { display: flex; flex-direction: column; gap: 3px; padding: 5px; border-radius: 6px; background: var(--wa-art-screen); }
  .sp-pic-well > i { display: block; height: 9px; }
  .sp-pic-well.plain > i { border-radius: 3px; background: var(--wa-art-dim); }
  .sp-pic-well.pillOutline > i { border-radius: 999px; box-shadow: inset 0 0 0 1px var(--wa-faint); }
  .sp-pic-well.pillFilled > i { border-radius: 999px; background: var(--wa-art-case); }
  /* Layout: the picture beside its name. */
  .sp-pics.across .sp-pic { flex-direction: row; align-items: center; gap: 8px; padding: 6px 8px; }
  .sp-pics.across .sp-pic-name { text-align: left; }
  .sp-pic-grid { flex: none; width: 34px; display: grid; grid-template-columns: 1fr; gap: 2px; padding: 4px; border-radius: 5px; background: var(--wa-art-screen); }
  .sp-pic-grid.two { grid-template-columns: 1fr 1fr; }
  .sp-pic-grid > i { display: block; height: 5px; border-radius: 2px; background: var(--wa-art-clock); }
  /* Icon: the name with a dot on the icon's side. */
  .sp-pics.inline .sp-pic { flex-direction: row; align-items: center; gap: 6px; min-height: 32px; padding: 4px 8px; }
  .sp-pic-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  /* Text size and font: a sample set as the watch would set it. */
  .sp-pics.type .sp-pic { align-items: center; gap: 3px; min-height: 50px; padding: 6px 4px; }
  .sp-pic-sample { line-height: 1; color: inherit; }
  /* Weight: each choice set in its own weight, the pick included. */
  .seg.wide.sp-weight button, .seg.wide.sp-weight button.on { font-weight: var(--w, 400); }

  /* The phone's add lists as a grid of buttons. */
  .sp-presets { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; margin: 4px 0 8px; }
  .sp-preset {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .sp-preset:hover:not(:disabled) { background: var(--wa-panel); }
  .sp-preset.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .sp-preset:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-preset-glyph { display: grid; place-items: center; width: 22px; height: 22px; }
  .sp-preset-glyph svg { display: block; }
  .sp-preset-label { text-align: center; line-height: 1.2; }
`;
