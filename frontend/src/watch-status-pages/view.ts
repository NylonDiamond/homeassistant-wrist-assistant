// The status page editor's views, drawn from a host, in the complication
// editor's chrome (`editor-chrome.ts`) as the page and menu editors wear it:
// the Status pages card (the list: add, pick, move, delete), the Rows card
// (the picked page's rows: pick, move, hide, remove, add), the watch preview
// the canvas draws from Home Assistant's states with the watch's own rules
// (`rules.ts`), and the inspector: a picked row's Row card, the Add a row
// card while a row is being added, the page's own Page card, and its Style
// card. `<wa-status-pages-editor>` owns the draft and hands a host in on
// every draw; nothing here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 16).

import { css, html, nothing, type TemplateResult } from "lit";
import { browserStorage, type ColumnStorage } from "../column-split.js";
import { sectionCard } from "../editor-chrome.js";
import { checkField, entityField, numberField, segField, selectField, sliderField, symbolField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import type { JsonObject } from "../watch-pages/model.js";
import { STAGE_ZOOM_STEPS } from "../watch-pages/stage.js";
import {
  type StatusPagesDocument,
  type StatusStyleField,
  STATUS_PAGE_KEYS,
  addStatusPage,
  addStatusRow,
  findStatusPage,
  findStatusRow,
  isSystemStatusPage,
  moveStatusPage,
  moveStatusRow,
  newStatusDynamicListRow,
  newStatusEntityRow,
  newStatusGroupCountRow,
  newStatusHeaderRow,
  removeStatusPage,
  removeStatusRow,
  renameStatusPage,
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
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: StatusPagesDocument) => StatusPagesDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

type ViewState = Pick<StatusPagesViewHost, "uiState" | "document">;

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

export const STATUS_PAGES_CARD_LINE = "Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.";

export const STATUS_PAGES_STAGE_HINT = "Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";

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
  host.requestUpdate();
}

/** Let go of the picked row or the add card, back to the page's own
 * settings. Whether there was one. */
export function deselectStatusRow(host: Pick<StatusPagesViewHost, "uiState" | "requestUpdate" | "document">): boolean {
  if (selectedStatusRow(host) === undefined && !host.uiState.has(ADD_KEY)) return false;
  host.uiState.delete(ROW_KEY);
  host.uiState.delete(ADD_KEY);
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

/** Add a new page at the end and pick it. */
export function addPage(host: StatusPagesViewHost): void {
  let id: string | undefined;
  host.edit((d) => {
    const out = addStatusPage(d);
    id = out.id;
    return out.document;
  });
  if (id !== undefined) selectStatusPage(host, id);
}

// ── drag to reorder ──────────────────────────────────────────────────────

interface DragState {
  list: "page" | "row";
  id: string;
}

function dragHandlers(host: StatusPagesViewHost, list: "page" | "row", id: string, index: number, move: (from: string, to: number) => void) {
  return {
    start: (e: DragEvent) => {
      host.uiState.set(DRAG_KEY, { list, id } satisfies DragState);
      e.dataTransfer?.setData("text/plain", id);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    over: (e: DragEvent) => {
      const drag = host.uiState.get(DRAG_KEY) as DragState | undefined;
      if (drag?.list !== list) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    },
    drop: (e: DragEvent) => {
      const drag = host.uiState.get(DRAG_KEY) as DragState | undefined;
      host.uiState.delete(DRAG_KEY);
      if (drag?.list !== list || sameStatusId(drag.id, id)) return;
      e.preventDefault();
      move(drag.id, index);
    },
    end: () => { host.uiState.delete(DRAG_KEY); },
  };
}

// ── glyphs ───────────────────────────────────────────────────────────────

function glyph(host: Pick<StatusPagesViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="sp-glyph-dot" style=${`background:${color};width:${Math.max(4, size * 0.6)}px;height:${Math.max(4, size * 0.6)}px`}></span>`;
}

function thumb(host: StatusPagesViewHost, icon: string, color: string): TemplateResult {
  return html`<span class="thumb sp-thumb" style=${`--c:${color}`} aria-hidden="true"><span class="sp-thumb-glyph">${glyph(host, icon, 14, color)}</span></span>`;
}

/** A stored row's color in the lists: an entity row's by its state now, a
 * list's or a count's as the watch colors its rows. */
function rowColor(host: StatusPagesViewHost, row: JsonObject): string {
  const r = readStatusRow(row);
  if (r.rowType === "sectionHeader") return STATUS_COLORS.secondary!;
  if (r.rowType === "entity") return statusColor(r.domain, host.hass.states[r.entityId]?.state);
  return statusColor(r.domain, "on");
}

// ── the Status pages card ────────────────────────────────────────────────

function pageRow(host: StatusPagesViewHost, page: JsonObject, index: number, count: number, shown: JsonObject | undefined): TemplateResult {
  const id = statusPageId(page);
  const name = statusPageName(page);
  const on = shown !== undefined && sameStatusId(id, statusPageId(shown));
  const rows = statusPageRows(page).length;
  const move = (from: string, to: number) => host.edit((d) => moveStatusPage(d, from, to));
  const drag = dragHandlers(host, "page", id, index, move);
  const pick = () => { if (!on) selectStatusPage(host, id); };
  return html`<div class="layer sp-page-row ${on ? "hl" : ""}" data-page=${id} role="listitem" tabindex="0"
    draggable=${host.busy ? "false" : "true"} aria-current=${on ? "true" : "false"} aria-label=${name || "Untitled page"}
    @dragstart=${drag.start} @dragover=${drag.over} @drop=${drag.drop} @dragend=${drag.end}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${thumb(host, "doc.text.fill", "#5B8FD4")}
    <span class="name"><b><span class="nm-t">${name || "Untitled page"}</span></b><small>${plural(rows, "row", "rows")}</small></span>
    <span class="right">
      <span class="badges">${isSystemStatusPage(page) ? html`<span class="badge" title="One of the app's starter pages. The watch treats it as any other page.">starter</span>` : nothing}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
          @click=${() => move(id, index - 1)}>${uiIcon("up")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
          @click=${() => move(id, index + 1)}>${uiIcon("down")}</button>
        <button type="button" class="icon danger" ?disabled=${host.busy} title="Delete" aria-label=${`Delete ${name}`}
          @click=${() => host.edit((d) => removeStatusPage(d, id))}>${uiIcon("delete")}</button>
      </span>
    </span>
  </div>`;
}

/** The Status pages card: every page in the watch's order; + Add makes
 * "New Page N" as the phone names it. */
export function renderPagesCard(host: StatusPagesViewHost): TemplateResult {
  const pages = statusPagesOf(host.document);
  const shown = shownStatusPage(host);
  return html`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${uiIcon("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${STATUS_PAGES_CARD_LINE}>${plural(pages.length, "page", "pages")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${host.busy}
        title="Add a status page" @click=${() => addPage(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${pages.length === 0
      ? html`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`
      : html`<div class="layers sp-page-list" role="list">${pages.map((p, i) => pageRow(host, p, i, pages.length, shown))}</div>`}
  </section>`;
}

// ── the Rows card ────────────────────────────────────────────────────────

function rowRow(host: StatusPagesViewHost, pageId: string, row: JsonObject, index: number, count: number, selected: JsonObject | undefined): TemplateResult {
  const id = statusRowId(row);
  const r = readStatusRow(row);
  const on = selected !== undefined && sameStatusId(id, statusRowId(selected));
  const hidden = r.isHidden === true;
  const name = r.displayName === "" ? "Display Name" : r.displayName;
  const move = (from: string, to: number) => host.edit((d) => moveStatusRow(d, pageId, from, to));
  const drag = dragHandlers(host, "row", id, index, move);
  const pick = () => selectStatusRow(host, id);
  const icon = r.rowType === "sectionHeader" ? "line.horizontal.3" : r.iconName;
  return html`<div class="layer sp-row-row ${on ? "hl" : ""} ${hidden ? "dim" : ""}" data-row=${id} role="listitem" tabindex="0"
    draggable=${host.busy ? "false" : "true"} aria-current=${on ? "true" : "false"} aria-label=${name}
    title=${`${name} · ${statusRowSubtitle(row)}${hidden ? ", hidden" : ""}`}
    @dragstart=${drag.start} @dragover=${drag.over} @drop=${drag.drop} @dragend=${drag.end}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${thumb(host, icon, rowColor(host, row))}
    <span class="name"><b><span class="nm-t">${name}</span></b><small>${statusRowSubtitle(row)}</small></span>
    <span class="right">
      <span class="badges">${hidden ? html`<span class="badge">hidden</span>` : nothing}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${host.busy} title=${hidden ? "Show" : "Hide"} aria-label=${`${hidden ? "Show" : "Hide"} ${name}`}
          @click=${() => host.edit((d) => setStatusRowKey(d, pageId, id, "isHidden", !hidden))}>${uiIcon(hidden ? "show" : "hide")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
          @click=${() => move(id, index - 1)}>${uiIcon("up")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
          @click=${() => move(id, index + 1)}>${uiIcon("down")}</button>
        <button type="button" class="icon danger" ?disabled=${host.busy} title="Remove" aria-label=${`Remove ${name}`}
          @click=${() => host.edit((d) => removeStatusRow(d, pageId, id))}>${uiIcon("delete")}</button>
      </span>
    </span>
  </div>`;
}

/** The Rows card: the shown page's rows in order; + Add opens the add card
 * in the inspector. */
export function renderRowsCard(host: StatusPagesViewHost): TemplateResult {
  const page = shownStatusPage(host);
  const rows = page === undefined ? [] : statusPageRows(page);
  const selected = selectedStatusRow(host);
  const pageId = page === undefined ? "" : statusPageId(page);
  let body: TemplateResult;
  if (page === undefined) body = html`<div class="lc-note">Add a status page to give it rows.</div>`;
  else if (rows.length === 0) body = html`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`;
  else body = html`<div class="layers sp-row-list" role="list">${rows.map((r, i) => rowRow(host, pageId, r, i, rows.length, selected))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;
  const adding = addState(host) !== undefined;
  return html`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${uiIcon("layers")}</span><span class="lc-title">Rows</span>
      ${page === undefined ? nothing : html`<span class="lc-sub">${plural(rows.length, "row", "rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${adding ? "on" : ""}" aria-label="Add row" ?disabled=${host.busy || page === undefined}
        title="Add an entity, a group count, a dynamic list or a header" @click=${() => openStatusAddRow(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${body}
  </section>`;
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

function previewIcon(host: StatusPagesViewHost, style: PreviewStyle, row: StatusPreviewRow, size: number, scale: number): TemplateResult {
  const color = hexColor(row.color);
  return html`<span class="sp-w-icon" style=${`width:${size * scale}px`}>${glyph(host, row.icon, Math.round(size * 0.8 * scale), color)}</span>`;
}

/** One row of a single column page (`statusRow`), or a header. */
function previewRow(host: StatusPagesViewHost, style: PreviewStyle, row: StatusPreviewRow, selectedId: string | undefined): TemplateResult {
  const s = host.scale;
  const sizes = TEXT_SIZES[style.textSize] ?? TEXT_SIZES.medium!;
  const on = selectedId !== undefined && sameStatusId(selectedId, row.rowId);
  const pick = () => selectStatusRow(host, row.rowId);
  if (row.kind === "sectionHeader") {
    return html`<div class="sp-w-header ${on ? "on" : ""}" style=${`font-size:${9 * s}px;text-align:${row.align === "center" ? "center" : row.align === "trailing" ? "right" : "left"}`}
      @click=${pick}>${row.label}</div>`;
  }
  const color = hexColor(row.color);
  const plain = style.rowStyle === "plain";
  return html`<div class="sp-w-row ${on ? "on" : ""}" title=${row.entityId ?? row.label}
    style=${`gap:${6 * s}px;font-size:${sizes.row * s}px;font-weight:${FONT_WEIGHTS[style.fontWeight] ?? 400};padding:${plain ? 0 : 4 * s}px ${plain ? 0 : 8 * s}px;border-radius:${6 * s}px;${pill(style, color)}`}
    @click=${pick}>
    ${style.iconPosition === "leading" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
    <span class="sp-w-label">${row.label}</span>
    <span class="sp-w-value" style=${`color:${color}`}>${row.value}</span>
    ${style.iconPosition === "trailing" ? previewIcon(host, style, row, sizes.icon, s) : nothing}
  </div>`;
}

/** One cell of a two column page (`twoColCell`): the icon and the value. */
function previewCell(host: StatusPagesViewHost, style: PreviewStyle, row: StatusPreviewRow, selectedId: string | undefined): TemplateResult {
  const s = host.scale;
  const sizes = TEXT_SIZES[style.textSize] ?? TEXT_SIZES.medium!;
  const on = selectedId !== undefined && sameStatusId(selectedId, row.rowId);
  const color = hexColor(row.color);
  const plain = style.rowStyle === "plain";
  return html`<div class="sp-w-cell ${on ? "on" : ""}" title=${row.label}
    style=${`gap:${3 * s}px;font-size:${sizes.compact * s}px;font-weight:${FONT_WEIGHTS[style.fontWeight] ?? 400};padding:${plain ? 0 : 3 * s}px ${plain ? 0 : 6 * s}px;border-radius:${6 * s}px;${pill(style, color)}`}
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
  const box = html`<div class="sp-screen" role="group" aria-label="Status page on the watch"
    style=${`width:${Math.round(width * s)}px;min-height:${Math.round(height * s)}px`}>${content}</div>`;
  return renderWatchFrame({ width, height }, s, box, "Status page on the watch");
}

/** The canvas head's facts: the page's rows and what the watch draws. */
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
  style: { color: SECTION_COLOR.look, icon: "look" },
};

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

/** The cards drawn now that fold, for the inspector's Collapse all. */
export function statusInspectorFolds(host: ViewState): FoldId[] {
  if (addState(host) !== undefined) return [{ module: FOLD_MODULE, section: "add" }];
  if (selectedStatusRow(host) !== undefined) return [{ module: FOLD_MODULE, section: "row" }, { module: FOLD_MODULE, section: "style" }];
  return [{ module: FOLD_MODULE, section: "page" }, { module: FOLD_MODULE, section: "style" }];
}

/** A searchable list of entities with a box each: the picked ones first,
 * then the rest by name. */
function entityChecklist(
  host: StatusPagesViewHost,
  key: string,
  choices: readonly string[],
  picked: readonly string[],
  toggleOne: (entityId: string, on: boolean) => void,
): TemplateResult {
  const queryKey = `${key}:q`;
  const query = String(host.uiState.get(queryKey) ?? "").trim().toLowerCase();
  const pickedSet = new Set(picked);
  const matches = choices.filter((id) => query === "" || id.toLowerCase().includes(query) || nameOf(host.hass, id).toLowerCase().includes(query));
  const ordered = [...matches.filter((id) => pickedSet.has(id)), ...matches.filter((id) => !pickedSet.has(id))];
  const shown = ordered.slice(0, 200);
  return html`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(host.uiState.get(queryKey) ?? "")}
      @input=${(e: Event) => { host.uiState.set(queryKey, (e.target as HTMLInputElement).value); host.requestUpdate(); }} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${shown.length === 0 ? html`<div class="sp-pick-none">${choices.length === 0 ? "No entity of this kind in Home Assistant." : "No entity matches."}</div>` : nothing}
      ${shown.map((id) => html`<label class="sp-pick-row">
        <input type="checkbox" .checked=${pickedSet.has(id)} ?disabled=${host.busy}
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
      (v) => set("iconName", v, `row:${id}:icon`), `sp:icon:${id}`, undefined, "Icon", false)}</div>`);
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
  if (counted && r.domain !== "sensor") {
    const options = stateOptions(r.domain, r.deviceClassFilter);
    if (options.length >= 2) {
      const current = effectiveFilterState(r);
      const choices: [string, string][] = options.map((o) => [o.value, o.label]);
      if (!choices.some(([v]) => v === current)) choices.push([current, swiftCapitalized(current)]);
      parts.push(segField("Show State", current, choices, (v) => set("filterState", v)));
    }
  }
  if (r.rowType === "dynamicList") {
    parts.push(segField("Entities", allMatching ? "all" : "specific", statusEnumChoices("DynamicMode") as ["all" | "specific", string][], (v) => set("dynamicMode", v)));
    parts.push(checkField("Show all states", r.showAllStates === true, (v) => set("showAllStates", v ? true : undefined), false));
    parts.push(html`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`);
  }
  if (r.domain === "sensor" && (r.rowType === "groupCount" || allMatching)) {
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
  return html`${card(host, "row", "row", rowTypeLabel(r.rowType), body, { summary: statusRowSubtitle(row) })}
    <div class="sp-acts">
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

/** The Style card: every style key with the phone's controls and ranges,
 * and Reset to Defaults. */
function renderStyleCard(host: StatusPagesViewHost, page: JsonObject): TemplateResult {
  const pageId = statusPageId(page);
  const changed = statusPageStyleChanged(page);
  return card(host, "style", "style", "Style", html`<fieldset class="sp-body" ?disabled=${host.busy} aria-label="Style">
    ${statusStyleFields().map((f) => renderStyleField(host, pageId, page, f))}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${host.busy || !changed} @click=${() => host.edit((d) => resetStatusPageStyle(d, pageId))}>
        ${uiIcon("reset")}<span>Reset to Defaults</span></button>
    </div>
  </fieldset>`, { summary: changed ? "Changed" : "Defaults", dot: changed });
}

/** The Page card: the name, and Delete. */
function renderPageCard(host: StatusPagesViewHost, page: JsonObject): TemplateResult {
  const pageId = statusPageId(page);
  const name = statusPageName(page);
  return card(host, "page", "page", "Page", html`<fieldset class="sp-body" ?disabled=${host.busy} aria-label="Page">
    ${textField("Name", name, (v) => host.edit((d) => renameStatusPage(d, pageId, v), `page:${pageId}:name`), { placeholder: "Page Name" })}
    ${isSystemStatusPage(page) ? html`<div class="hint ts-under">One of the app's starter pages. It is edited and deleted like any other.</div>` : nothing}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Delete this status page"
        @click=${() => host.edit((d) => removeStatusPage(d, pageId))}>${uiIcon("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`, { summary: name });
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
 * The inspector: a sticky head with the breadcrumb (the page, then a picked
 * row's chip and name; the page's name is the way back) and Collapse all,
 * then the cards. A picked row has its Row card and the page's Style card;
 * adding a row, the Add a row card; with neither, the Page card and the
 * Style card.
 */
export function renderStatusInspector(host: StatusPagesViewHost): TemplateResult {
  const page = shownStatusPage(host);
  if (page === undefined) {
    return html`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;
  }
  const name = statusPageName(page) || "Untitled page";
  const row = selectedStatusRow(host);
  const adding = addState(host);
  const folds = statusInspectorFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  let crumbs: TemplateResult;
  let body: TemplateResult;
  if (adding !== undefined) {
    crumbs = html`<div class="crumbs"><button class="root" title="The page's own settings" @click=${() => deselectStatusRow(host)}>${name}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`;
    body = renderAddCard(host, page, adding);
  } else if (row !== undefined) {
    const r = readStatusRow(row);
    const label = r.displayName === "" ? "Display Name" : r.displayName;
    crumbs = html`<div class="crumbs"><button class="root" title="The page's own settings" @click=${() => selectStatusRow(host, undefined)}>${name}</button><span class="sep">›</span><span class="kchip" style=${`--k:${rowColor(host, row)}`}>${rowTypeLabel(r.rowType)}</span><span class="nm" title=${label}>${label}</span></div>`;
    body = html`${renderRowCard(host, page, row)}${renderStyleCard(host, page)}`;
  } else {
    crumbs = html`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${name}>${name}</span></div>`;
    body = html`${renderPageCard(host, page)}${renderStyleCard(host, page)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;
  }
  return html`<div class="insp-head">
      ${crumbs}
      <button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>
    </div>
    <div class="insp-body">${body}</div>`;
}

/** Whether `findStatusPage` finds the page picked; for the editor's keys. */
export function statusPageShown(host: ViewState, pageId: string): boolean {
  return findStatusPage(host.document, pageId) !== undefined;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const statusPagesViewStyles = css`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.sp-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .sp-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .sp-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .sp-glyph-dot { display: inline-block; border-radius: 50%; }

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
