// The Control Center editor's views, drawn from a host, in the complication
// editor's chrome (`editor-chrome.ts`) as the status pages editor wears it:
// the Control Center card (the list: add, pick, move, hide, remove), the
// watch preview of the buttons the canvas draws from Home Assistant's
// states, and the inspector: a picked entry's card, the Add card while
// entries are being added, and the list's own card with neither.
// `<wa-control-center-editor>` owns the draft and hands a host in on every
// draw; nothing here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 5 build
// contract", item 3).

import { css, html, nothing, type TemplateResult } from "lit";
import { browserStorage, type ColumnStorage } from "../column-split.js";
import { sectionCard } from "../editor-chrome.js";
import { colorField, entityField, segField, symbolField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import type { JsonObject } from "../watch-pages/model.js";
import { STAGE_ZOOM_STEPS } from "../watch-pages/stage.js";
import {
  type ControlCenterDocument,
  type ControlCenterEntry,
  type ControlCenterStates,
  addControlCenterEntries,
  controlCenterCustomized,
  controlCenterEntries,
  controlCenterFriendlyName,
  controlCenterHas,
  controlCenterIcon,
  controlCenterName,
  controlCenterShown,
  entityDomain,
  findControlCenterEntry,
  moveControlCenterEntry,
  readControlCenterEntry,
  removeControlCenterEntry,
  resetControlCenterEntry,
  setControlCenterHidden,
  setControlCenterIcon,
  setControlCenterName,
  setControlCenterTint,
} from "./model.js";
import { CONTROL_CENTER_DEFAULT_TINT, controlCenterDomains, controlCenterIsOn, controlCenterKind } from "./rules.js";

/** What the views are handed on every draw. `document` and `busy` are read
 * live. */
export interface ControlCenterViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: ControlCenterDocument;
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
  edit(change: (document: ControlCenterDocument) => ControlCenterDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

type ViewState = Pick<ControlCenterViewHost, "uiState" | "document">;
type Picker = Pick<ControlCenterViewHost, "uiState" | "requestUpdate">;

const FOLD_MODULE = "control-center";
const SELECTED_KEY = "cc:entry";
const ADD_KEY = "cc:add";
const ADDED_KEY = "cc:added";
const DRAG_KEY = "cc:drag";

/** The phone's colour swatches (`ControlCenterSettingsView.swatchColors`). */
export const CONTROL_CENTER_SWATCHES = [
  "#4A9EF5", "#5BC4F0", "#34D399", "#FBBF24", "#F97316",
  "#EF4444", "#EC4899", "#A855F7", "#6366F1", "#8B5CF6",
  "#CCD8E6", "#FFFFFF",
] as const;

/** The canvas's zoom, remembered between visits. */
export const CONTROL_CENTER_ZOOM_KEY = "wrist-assistant-panel.control-center.zoom.v1";

export function loadControlCenterZoom(storage: ColumnStorage | undefined = browserStorage()): number | undefined {
  try {
    const raw = storage?.getItem(CONTROL_CENTER_ZOOM_KEY);
    const n = raw === null || raw === undefined || raw === "" ? NaN : Number(raw);
    return STAGE_ZOOM_STEPS.includes(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

export function saveControlCenterZoom(scale: number | undefined, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(CONTROL_CENTER_ZOOM_KEY, scale === undefined ? "" : String(scale));
  } catch {
    // A full or blocked storage keeps the zoom for this visit only.
  }
}

// ── words ────────────────────────────────────────────────────────────────

export const CONTROL_CENTER_CARD_LINE =
  "The entities the watch's Toggle and Action controls offer. Add a control from the watch's Control Center, then pick one of these. A save reaches the watch the next time it checks.";

export const CONTROL_CENTER_STAGE_HINT =
  "Drawn from Home Assistant's states now. Each button is a control you can add to the watch's Control Center. Hidden entries and other domains are left out. Tap a button to edit it.";

export const CONTROL_CENTER_NOT_SHOWN = "Not shown on the watch";

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function states(hass: HassLike): ControlCenterStates {
  return hass.states as unknown as ControlCenterStates;
}

/** An entry's line under its name: its entity and what the watch makes of
 * it. */
export function controlCenterSubtitle(entry: ControlCenterEntry): string {
  const kind = controlCenterKind(entry.domain);
  const what = kind === "toggle" ? "Toggle" : kind === "action" ? "Action" : CONTROL_CENTER_NOT_SHOWN;
  return `${entry.entityId} · ${what}`;
}

// ── selection ────────────────────────────────────────────────────────────

/** The entry picked, while it is on the list. */
export function selectedControlCenterEntry(host: ViewState): JsonObject | undefined {
  const picked = host.uiState.get(SELECTED_KEY);
  return typeof picked === "string" ? findControlCenterEntry(host.document, picked) : undefined;
}

export function selectControlCenterEntry(host: Picker, entityId: string | undefined): void {
  if (entityId === undefined) host.uiState.delete(SELECTED_KEY);
  else host.uiState.set(SELECTED_KEY, entityId);
  host.uiState.delete(ADD_KEY);
  host.requestUpdate();
}

/** Let go of the picked entry or the Add card, back to the list's own card.
 * Whether there was one. */
export function deselectControlCenter(host: Picker & Pick<ControlCenterViewHost, "document">): boolean {
  if (selectedControlCenterEntry(host) === undefined && !host.uiState.has(ADD_KEY)) return false;
  host.uiState.delete(SELECTED_KEY);
  host.uiState.delete(ADD_KEY);
  host.requestUpdate();
  return true;
}

// ── the Add card's state ─────────────────────────────────────────────────

type AddMode = "entity" | "area";

interface AddState {
  mode: AddMode;
  area?: string;
  picked: string[];
}

function addState(host: Pick<ControlCenterViewHost, "uiState">): AddState | undefined {
  const held = host.uiState.get(ADD_KEY);
  return typeof held === "object" && held !== null ? (held as AddState) : undefined;
}

function setAddState(host: Picker, next: AddState | undefined): void {
  if (next === undefined) host.uiState.delete(ADD_KEY);
  else {
    host.uiState.set(ADD_KEY, next);
    host.uiState.delete(SELECTED_KEY);
  }
  host.requestUpdate();
}

/** Open the Add card. */
export function openControlCenterAdd(host: Picker, mode: AddMode = "entity"): void {
  host.uiState.delete(ADDED_KEY);
  setAddState(host, { mode, picked: [] });
}

/** Add entities at the end of the list. The words for what happened go to
 * the Add card. Returns the ids added. */
export function addControlCenterEntities(host: ControlCenterViewHost, entityIds: readonly string[]): string[] {
  let added: string[] = [];
  let refused: string[] = [];
  host.edit((d) => {
    const out = addControlCenterEntries(d, entityIds, states(host.hass));
    added = out.added;
    refused = out.refused;
    return out.document;
  });
  const name = (id: string) => controlCenterFriendlyName(states(host.hass), id);
  const words: string[] = [];
  if (added.length === 1) words.push(`Added ${name(added[0]!)}.`);
  else if (added.length > 1) words.push(`Added ${added.length} entities.`);
  if (refused.length === 1) words.push(`${name(refused[0]!)} is on the list already.`);
  else if (refused.length > 1) words.push(`${refused.length} are on the list already.`);
  if (words.length > 0) host.uiState.set(ADDED_KEY, words.join(" "));
  host.requestUpdate();
  return added;
}

// ── areas ────────────────────────────────────────────────────────────────

/** The areas of the home by name, from the registry snapshot the frontend
 * keeps on `hass`. Undefined when it has none to read. */
export function controlCenterAreas(hass: HassLike): { id: string; name: string }[] | undefined {
  const { areas, entities } = hass;
  if (areas === undefined || entities === undefined) return undefined;
  return Object.entries(areas)
    .map(([id, a]) => ({ id, name: typeof a?.name === "string" && a.name.trim() !== "" ? a.name.trim() : id }))
    .sort((a, b) => a.name.localeCompare(b.name) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** The entities in an area the watch can show, by name: those whose own
 * area is it, or whose device's is, as Home Assistant resolves an area.
 * Hidden entities and config or diagnostic ones are left out, as Home
 * Assistant's own area views leave them out. */
export function controlCenterAreaEntities(hass: HassLike, areaId: string): string[] {
  const { entities, devices } = hass;
  if (entities === undefined) return [];
  const domains = controlCenterDomains();
  const out: string[] = [];
  for (const id of Object.keys(hass.states)) {
    if (!domains.includes(entityDomain(id)) || !Object.hasOwn(entities, id)) continue;
    const reg = entities[id];
    if (reg?.hidden || reg?.entity_category) continue;
    const area = reg?.area_id || (reg?.device_id ? devices?.[reg.device_id]?.area_id : undefined);
    if (area === areaId) out.push(id);
  }
  const name = (id: string) => controlCenterFriendlyName(states(hass), id);
  return out.sort((a, b) => name(a).localeCompare(name(b)) || (a < b ? -1 : a > b ? 1 : 0));
}

// ── glyphs ───────────────────────────────────────────────────────────────

function tintOf(entry: ControlCenterEntry): string {
  return entry.tintColorHex ?? CONTROL_CENTER_DEFAULT_TINT;
}

function glyph(host: Pick<ControlCenterViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="cc-glyph-dot" style=${`background:${color};width:${Math.max(4, size * 0.6)}px;height:${Math.max(4, size * 0.6)}px`}></span>`;
}

function thumb(host: ControlCenterViewHost, entry: ControlCenterEntry): TemplateResult {
  const color = tintOf(entry);
  return html`<span class="thumb cc-thumb" style=${`--c:${color}`} aria-hidden="true"><span class="cc-thumb-glyph">${glyph(host, controlCenterIcon(entry), 14, color)}</span></span>`;
}

// ── drag to reorder ──────────────────────────────────────────────────────

function dragHandlers(host: ControlCenterViewHost, entityId: string, index: number) {
  return {
    start: (e: DragEvent) => {
      host.uiState.set(DRAG_KEY, entityId);
      e.dataTransfer?.setData("text/plain", entityId);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    over: (e: DragEvent) => {
      if (typeof host.uiState.get(DRAG_KEY) !== "string") return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    },
    drop: (e: DragEvent) => {
      const from = host.uiState.get(DRAG_KEY);
      host.uiState.delete(DRAG_KEY);
      if (typeof from !== "string" || from === entityId) return;
      e.preventDefault();
      host.edit((d) => moveControlCenterEntry(d, from, index));
    },
    end: () => { host.uiState.delete(DRAG_KEY); },
  };
}

// ── the Control Center card ──────────────────────────────────────────────

function entryRow(host: ControlCenterViewHost, raw: JsonObject, index: number, count: number, selected: string | undefined): TemplateResult {
  const entry = readControlCenterEntry(raw);
  const id = entry.entityId;
  const on = selected === id;
  const hidden = entry.isHidden;
  const shown = controlCenterShown(entry);
  const name = controlCenterName(entry) || id;
  const move = (to: number) => host.edit((d) => moveControlCenterEntry(d, id, to));
  const drag = dragHandlers(host, id, index);
  const pick = () => selectControlCenterEntry(host, id);
  return html`<div class="layer cc-entry-row ${on ? "hl" : ""} ${hidden || !shown ? "dim" : ""}" data-entity=${id} role="listitem" tabindex="0"
    draggable=${host.busy ? "false" : "true"} aria-current=${on ? "true" : "false"} aria-label=${name}
    title=${`${name} · ${controlCenterSubtitle(entry)}${hidden ? ", hidden" : ""}`}
    @dragstart=${drag.start} @dragover=${drag.over} @drop=${drag.drop} @dragend=${drag.end}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${thumb(host, entry)}
    <span class="name"><b><span class="nm-t">${name}</span></b><small>${controlCenterSubtitle(entry)}</small></span>
    <span class="right">
      <span class="badges">
        ${hidden ? html`<span class="badge">hidden</span>` : nothing}
        ${shown ? nothing : html`<span class="badge cc-off" title=${`The watch's controls cover ${controlCenterDomains().join(", ")}.`}>not shown</span>`}
      </span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${host.busy} title=${hidden ? "Show" : "Hide"} aria-label=${`${hidden ? "Show" : "Hide"} ${name}`}
          @click=${() => host.edit((d) => setControlCenterHidden(d, id, !hidden))}>${uiIcon(hidden ? "show" : "hide")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
          @click=${() => move(index - 1)}>${uiIcon("up")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
          @click=${() => move(index + 1)}>${uiIcon("down")}</button>
        <button type="button" class="icon danger" ?disabled=${host.busy} title="Remove" aria-label=${`Remove ${name}`}
          @click=${() => host.edit((d) => removeControlCenterEntry(d, id))}>${uiIcon("delete")}</button>
      </span>
    </span>
  </div>`;
}

/** The Control Center card: every entry in the stored order; + Add opens
 * the Add card in the inspector. */
export function renderEntriesCard(host: ControlCenterViewHost): TemplateResult {
  const entries = controlCenterEntries(host.document);
  const selected = selectedControlCenterEntry(host);
  const selectedId = selected === undefined ? undefined : readControlCenterEntry(selected).entityId;
  const adding = addState(host) !== undefined;
  return html`<section class="card lc cc-entries-card" aria-label="Control Center" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${uiIcon("grid")}</span><span class="lc-title">Control Center</span>
      <span class="lc-sub" title=${CONTROL_CENTER_CARD_LINE}>${plural(entries.length, "entity", "entities")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri cc-add ${adding ? "on" : ""}" aria-label="Add entities" ?disabled=${host.busy}
        title="Add an entity, or the entities of an area" @click=${() => openControlCenterAdd(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${entries.length === 0
      ? html`<div class="lc-note">No entities yet. Add lights, switches, scenes and more for the watch's Control Center.</div>`
      : html`<div class="layers cc-entry-list" role="list">${entries.map((e, i) => entryRow(host, e, i, entries.length, selectedId))}</div>
        <div class="lc-note cc-drag-note">Drag an entity, or use its arrows, to reorder.</div>`}
  </section>`;
}

// ── the watch preview ────────────────────────────────────────────────────

/** One round button as the watch's Control Center draws a control: a toggle
 * filled with its tint while on, grey while off; an action grey with its
 * icon in the tint. The name under it. */
function previewButton(host: ControlCenterViewHost, entry: ControlCenterEntry, selected: boolean): TemplateResult {
  const s = host.scale;
  const tint = tintOf(entry);
  const on = controlCenterIsOn(entry.domain, host.hass.states[entry.entityId]?.state);
  const kind = controlCenterKind(entry.domain);
  const fill = on === true ? tint : "rgba(255,255,255,.17)";
  const ink = on === true ? "#FFFFFF" : kind === "action" ? tint : on === false ? "#FFFFFF" : "rgba(255,255,255,.55)";
  const size = 44 * s;
  const name = controlCenterName(entry) || entry.entityId;
  const state = on === undefined ? (kind === "toggle" ? "no state" : "action") : on ? "on" : "off";
  return html`<button type="button" class="cc-w-btn ${selected ? "on" : ""}" title=${`${name} · ${state}`} aria-label=${`${name}, ${state}`}
    style=${`gap:${4 * s}px;width:${size + 8 * s}px`} @click=${() => selectControlCenterEntry(host, entry.entityId)}>
    <span class="cc-w-circle" style=${`width:${size}px;height:${size}px;background:${fill}`}>${glyph(host, controlCenterIcon(entry), Math.round(20 * s), ink)}</span>
    <span class="cc-w-name" style=${`font-size:${9 * s}px`}>${name}</span>
  </button>`;
}

function previewSection(host: ControlCenterViewHost, title: string, entries: ControlCenterEntry[], selected: string | undefined): TemplateResult | typeof nothing {
  if (entries.length === 0) return nothing;
  const s = host.scale;
  return html`<div class="cc-w-head" style=${`font-size:${10 * s}px;margin:${2 * s}px ${4 * s}px`}>${title}</div>
    <div class="cc-w-grid" style=${`gap:${8 * s}px ${4 * s}px`}>${entries.map((e) => previewButton(host, e, e.entityId === selected))}</div>`;
}

/**
 * The list on the watch: the Toggle controls, then the Action controls, as
 * round buttons in the stored order with their state from Home Assistant
 * now. Hidden entries and other domains are not drawn, as the watch leaves
 * them out of its pickers. A button tapped here is picked.
 */
export function renderControlCenterScreen(host: ControlCenterViewHost): TemplateResult {
  const { width, height } = host.screen;
  const s = host.scale;
  const all = controlCenterEntries(host.document).map(readControlCenterEntry);
  const visible = all.filter((e) => !e.isHidden && controlCenterShown(e));
  const toggles = visible.filter((e) => controlCenterKind(e.domain) === "toggle");
  const actions = visible.filter((e) => controlCenterKind(e.domain) === "action");
  const selected = selectedControlCenterEntry(host);
  const selectedId = selected === undefined ? undefined : readControlCenterEntry(selected).entityId;
  const content = visible.length === 0
    ? html`<p class="cc-w-empty" style=${`font-size:${11 * s}px`}>${all.length === 0 ? "Add entities" : "Nothing the watch shows"}</p>`
    : html`<div class="cc-w-scroll" style=${`padding:${26 * s}px ${8 * s}px ${14 * s}px;gap:${6 * s}px`}>
      ${previewSection(host, "Toggle", toggles, selectedId)}
      ${previewSection(host, "Action", actions, selectedId)}
    </div>`;
  const box = html`<div class="cc-screen" role="group" aria-label="Control Center on the watch"
    style=${`width:${Math.round(width * s)}px;min-height:${Math.round(height * s)}px`}>${content}</div>`;
  return renderWatchFrame({ width, height }, s, box, "Control Center on the watch");
}

/** The canvas head's facts: how many entries, hidden and not shown. */
export function controlCenterStageFacts(host: Pick<ControlCenterViewHost, "document">): string[] {
  const all = controlCenterEntries(host.document).map(readControlCenterEntry);
  const hidden = all.filter((e) => e.isHidden).length;
  const off = all.filter((e) => !controlCenterShown(e)).length;
  const parts = [plural(all.length, "entity", "entities")];
  if (hidden > 0) parts.push(`${hidden} hidden`);
  if (off > 0) parts.push(`${off} not shown`);
  return [parts.join(", ")];
}

// ── the inspector ────────────────────────────────────────────────────────

function isOpen(host: Pick<ControlCenterViewHost, "uiState">, section: string): boolean {
  return sectionOpen(host.uiState, FOLD_MODULE, section);
}

function toggle(host: Picker, section: string): void {
  setSectionOpen(host.uiState, FOLD_MODULE, section, !isOpen(host, section));
  host.requestUpdate();
}

const BADGES: Readonly<Record<string, { color: string; icon: UiIconName }>> = {
  entry: { color: SECTION_COLOR.content, icon: "content" },
  look: { color: SECTION_COLOR.look, icon: "look" },
  add: { color: SECTION_COLOR.content, icon: "plus" },
  list: { color: SECTION_COLOR.place, icon: "grid" },
};

function card(host: ControlCenterViewHost, badge: keyof typeof BADGES, fold: string, title: string, body: TemplateResult, extra: { summary?: string; dot?: boolean } = {}): TemplateResult {
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
export function controlCenterInspectorFolds(host: ViewState): FoldId[] {
  if (addState(host) !== undefined) return [{ module: FOLD_MODULE, section: "add" }];
  if (selectedControlCenterEntry(host) !== undefined) return [{ module: FOLD_MODULE, section: "entry" }, { module: FOLD_MODULE, section: "look" }];
  return [{ module: FOLD_MODULE, section: "list" }];
}

/** The Entity card and the Look card of the picked entry. */
function renderEntryCards(host: ControlCenterViewHost, raw: JsonObject): TemplateResult {
  const entry = readControlCenterEntry(raw);
  const id = entry.entityId;
  const shown = controlCenterShown(entry);
  const kind = controlCenterKind(entry.domain);
  const live = host.hass.states[id];
  const customized = controlCenterCustomized(raw);
  const stateLine = live === undefined ? "Not in Home Assistant now." : `${controlCenterFriendlyName(states(host.hass), id)} is ${live.state}.`;

  const entity = card(host, "entry", "entry", "Entity", html`<fieldset class="cc-body" ?disabled=${host.busy} aria-label="Entity">
    ${segField("Visibility", entry.isHidden ? "hidden" : "visible", [["visible", "Visible"], ["hidden", "Hidden"]] as ["visible" | "hidden", string][],
      (v) => host.edit((d) => setControlCenterHidden(d, id, v === "hidden")))}
    <div class="hint cc-under">Hidden entries stay on the list and out of the watch's pickers.</div>
    ${textField("Name", entry.customDisplayName ?? "", (v) => host.edit((d) => setControlCenterName(d, id, v), `entry:${id}:name`), { placeholder: entry.displayName || id })}
    <div class="hint cc-under">Empty shows the entity's own name, ${entry.displayName === "" ? "none" : `"${entry.displayName}"`}.</div>
    <div class="cc-facts">
      <span><b>Entity</b><code>${id}</code></span>
      <span><b>Control</b>${kind === "toggle" ? "Toggle" : kind === "action" ? "Action" : html`<span class="cc-warn">${CONTROL_CENTER_NOT_SHOWN}</span>`}</span>
      <span><b>Now</b>${stateLine}</span>
    </div>
    ${shown ? nothing : html`<p class="cc-warn cc-under-full">The watch's controls cover ${controlCenterDomains().join(", ")}. This entry is kept on the list but never shown.</p>`}
  </fieldset>`, { summary: controlCenterName(entry) || id });

  const tint = entry.tintColorHex;
  const look = card(host, "look", "look", "Icon and color", html`<fieldset class="cc-body" ?disabled=${host.busy} aria-label="Icon and color">
    <div class="cc-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, controlCenterIcon(entry),
      (v) => host.edit((d) => setControlCenterIcon(d, id, v === entry.iconName ? "" : v), `entry:${id}:icon`), `cc:icon:${id}`, undefined, "Icon", false)}</div>
    ${colorField("Color", tint, (v) => host.edit((d) => setControlCenterTint(d, id, v), `entry:${id}:tint`), true, null)}
    <div class="cc-swatches" role="group" aria-label="Suggested colors">
      ${CONTROL_CENTER_SWATCHES.map((hex) => {
        const on = tint !== undefined && tint.toUpperCase() === hex;
        return html`<button type="button" class="cc-swatch ${on ? "on" : ""}" style=${`--sw:${hex}`} title=${hex} aria-label=${`Color ${hex}`}
          aria-pressed=${on ? "true" : "false"} ?disabled=${host.busy} @click=${() => host.edit((d) => setControlCenterTint(d, id, hex))}></button>`;
      })}
    </div>
    <div class="hint cc-under">No color draws the control in the watch's blue.</div>
    <div class="cc-acts">
      <button type="button" class="pe-btn" ?disabled=${host.busy || !customized} title="Back to the entity's own name and icon, with no color"
        @click=${() => host.edit((d) => resetControlCenterEntry(d, id))}>${uiIcon("reset")}<span>Reset to defaults</span></button>
    </div>
  </fieldset>`, { summary: customized ? "Changed" : "Defaults", dot: customized });

  return html`${entity}${look}
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this entity from the list"
        @click=${() => host.edit((d) => removeControlCenterEntry(d, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>`;
}

/** A list of entities with a box each; those on the list already are ticked
 * and fixed. */
function areaChecklist(host: ControlCenterViewHost, state: AddState, ids: readonly string[]): TemplateResult {
  const picked = new Set(state.picked);
  return html`<div class="cc-pick-list" role="group" aria-label="Entities in the area">
    ${ids.map((id) => {
      const held = controlCenterHas(host.document, id);
      return html`<label class="cc-pick-row ${held ? "held" : ""}">
        <input type="checkbox" .checked=${held || picked.has(id)} ?disabled=${host.busy || held}
          @change=${(e: Event) => {
            const now = addState(host) ?? state;
            const rest = now.picked.filter((x) => x !== id);
            setAddState(host, { ...now, picked: (e.target as HTMLInputElement).checked ? [...rest, id] : rest });
          }} />
        <span class="cc-pick-name">${controlCenterFriendlyName(states(host.hass), id)}${held ? html` <span class="hint">on the list</span>` : nothing}</span><code>${id}</code>
      </label>`;
    })}
  </div>`;
}

/** The Add card: one entity from a search on the nine domains, or the
 * entities of an area. */
function renderAddCard(host: ControlCenterViewHost, state: AddState): TemplateResult {
  const added = host.uiState.get(ADDED_KEY);
  const modeRow = segField("Add", state.mode, [["entity", "Entity"], ["area", "From an area"]] as [AddMode, string][], (v) => {
    host.uiState.delete(ADDED_KEY);
    setAddState(host, { mode: v, picked: [] });
  });
  let body: TemplateResult;
  if (state.mode === "entity") {
    const count = Number(host.uiState.get(`${ADD_KEY}:n`) ?? 0) || 0;
    body = html`<div class="cc-stack">${entityField({ hass: host.hass }, "Entity", { entityId: "", displayName: "", domain: "" }, (ref) => {
      const entityId = ref.entityId.trim();
      if (entityId === "") return;
      host.uiState.set(`${ADD_KEY}:n`, count + 1);
      addControlCenterEntities(host, [entityId]);
    }, `cc:add:entity:${count}`, { clearable: false, domain: controlCenterDomains() })}</div>
      <div class="hint">Lights, switches, fans, input booleans, locks and covers are toggles; scenes, scripts and automations are actions. Pick another to add it too.</div>`;
  } else {
    const areas = controlCenterAreas(host.hass);
    if (areas === undefined) {
      body = html`<p class="hint">This Home Assistant does not share its areas with the panel. Add entities one by one instead.</p>`;
    } else if (areas.length === 0) {
      body = html`<p class="hint">No areas in Home Assistant yet.</p>`;
    } else {
      const area = state.area !== undefined && areas.some((a) => a.id === state.area) ? state.area : undefined;
      const ids = area === undefined ? [] : controlCenterAreaEntities(host.hass, area);
      const fresh = ids.filter((id) => !controlCenterHas(host.document, id));
      const picked = state.picked.filter((id) => fresh.includes(id));
      body = html`<label class="field cc-area"><span>Area</span>
          <select @change=${(e: Event) => setAddState(host, { ...state, area: (e.target as HTMLSelectElement).value || undefined, picked: [] })}>
            <option value="" ?selected=${area === undefined}>Choose an area</option>
            ${areas.map((a) => html`<option value=${a.id} ?selected=${a.id === area}>${a.name}</option>`)}
          </select></label>
        ${area === undefined ? nothing : ids.length === 0
          ? html`<p class="hint">No light, switch, fan, lock, cover, input boolean, scene, script or automation in this area.</p>`
          : html`${areaChecklist(host, state, ids)}
            <div class="cc-acts">
              <button type="button" class="pe-btn pe-primary" ?disabled=${host.busy || picked.length === 0}
                @click=${() => { addControlCenterEntities(host, picked); setAddState(host, { ...state, area, picked: [] }); }}>
                ${uiIcon("plus")}<span>${picked.length === 0 ? "Add" : `Add ${plural(picked.length, "entity", "entities")}`}</span></button>
              <button type="button" class="pe-btn" ?disabled=${host.busy || fresh.length === 0}
                @click=${() => { addControlCenterEntities(host, fresh); setAddState(host, { ...state, area, picked: [] }); }}>
                <span>${fresh.length === 0 ? "All on the list" : `Add all ${fresh.length}`}</span></button>
            </div>`}`;
    }
  }
  return html`${card(host, "add", "add", "Add entities", html`<fieldset class="cc-body" ?disabled=${host.busy} aria-label="Add entities">
    ${modeRow}${body}
    ${typeof added === "string" ? html`<div class="hint cc-added" role="status">${added}</div>` : nothing}
  </fieldset>`)}
    <div class="cc-acts">
      <button type="button" class="pe-btn" @click=${() => setAddState(host, undefined)}>Done</button>
    </div>`;
}

/** The list's own card, with nothing picked: what it is, and how many. */
function renderListCard(host: ControlCenterViewHost): TemplateResult {
  const all = controlCenterEntries(host.document).map(readControlCenterEntry);
  const toggles = all.filter((e) => controlCenterKind(e.domain) === "toggle").length;
  const actions = all.filter((e) => controlCenterKind(e.domain) === "action").length;
  const hidden = all.filter((e) => e.isHidden).length;
  const off = all.length - toggles - actions;
  return card(host, "list", "list", "Control Center list", html`<div class="cc-body">
    <p class="hint">${CONTROL_CENTER_CARD_LINE}</p>
    <div class="cc-facts">
      <span><b>Toggles</b>${toggles}</span>
      <span><b>Actions</b>${actions}</span>
      ${hidden > 0 ? html`<span><b>Hidden</b>${hidden}</span>` : nothing}
      ${off > 0 ? html`<span><b>Not shown</b>${off}</span>` : nothing}
    </div>
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-primary" ?disabled=${host.busy} @click=${() => openControlCenterAdd(host)}>${uiIcon("plus")}<span>Add entities</span></button>
      <button type="button" class="pe-btn" ?disabled=${host.busy} @click=${() => openControlCenterAdd(host, "area")}><span>Add from an area</span></button>
    </div>
  </div>`, { summary: plural(all.length, "entity", "entities") });
}

/**
 * The inspector: a sticky head with the breadcrumb (the list, then a picked
 * entry's chip and name; the list's name is the way back) and Collapse all,
 * then the cards.
 */
export function renderControlCenterInspector(host: ControlCenterViewHost): TemplateResult {
  const selected = selectedControlCenterEntry(host);
  const adding = addState(host);
  const folds = controlCenterInspectorFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  let crumbs: TemplateResult;
  let body: TemplateResult;
  if (adding !== undefined) {
    crumbs = html`<div class="crumbs"><button class="root" title="The list" @click=${() => deselectControlCenter(host)}>Control Center</button><span class="sep">›</span><span class="nm">Add entities</span></div>`;
    body = renderAddCard(host, adding);
  } else if (selected !== undefined) {
    const entry = readControlCenterEntry(selected);
    const label = controlCenterName(entry) || entry.entityId;
    const kind = controlCenterKind(entry.domain);
    crumbs = html`<div class="crumbs"><button class="root" title="The list" @click=${() => selectControlCenterEntry(host, undefined)}>Control Center</button><span class="sep">›</span><span class="kchip" style=${`--k:${tintOf(entry)}`}>${kind === "toggle" ? "Toggle" : kind === "action" ? "Action" : "Not shown"}</span><span class="nm" title=${label}>${label}</span></div>`;
    body = renderEntryCards(host, selected);
  } else {
    crumbs = html`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">List</span><span class="nm">Control Center</span></div>`;
    body = html`${renderListCard(host)}<p class="cc-note">Select an entity to edit it, or add one.</p>`;
  }
  return html`<div class="insp-head">
      ${crumbs}
      <button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>
    </div>
    <div class="insp-body">${body}</div>`;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const controlCenterViewStyles = css`
  .cc-entries-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .cc-entries-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .cc-entries-card > .lc-note.cc-drag-note { margin-top: 0; font-size: 11.5px; }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.cc-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .cc-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .cc-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .badge.cc-off { border-color: var(--wa-amber-line); color: var(--wa-amber); }
  .cc-glyph-dot { display: inline-block; border-radius: 50%; }

  /* The watch screen on the stage: black, as tall as the list needs. */
  .cc-screen { position: relative; flex: none; background: #000; color: #fff; overflow: hidden; }
  .cc-w-scroll { display: flex; flex-direction: column; }
  .cc-w-head { font-weight: 600; color: rgba(235, 235, 245, .6); letter-spacing: .02em; }
  .cc-w-grid { display: flex; flex-wrap: wrap; justify-content: center; }
  .cc-w-btn {
    display: flex; flex-direction: column; align-items: center; min-width: 0; padding: 0; border: 0;
    background: none; color: #fff; font: inherit; cursor: pointer;
  }
  .cc-w-circle { display: grid; place-items: center; border-radius: 50%; }
  .cc-w-circle svg { display: block; }
  .cc-w-name { max-width: 100%; color: rgba(255, 255, 255, .8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
  .cc-w-empty { margin: 40% 12px 0; text-align: center; color: rgba(255, 255, 255, .6); }
  .cc-screen { --cc-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .cc-w-btn.on .cc-w-circle { outline: 1.5px solid var(--cc-mark); outline-offset: 2px; }
  .cc-w-btn:focus-visible { outline: none; }
  .cc-w-btn:focus-visible .cc-w-circle { box-shadow: var(--wa-ring); }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.cc-body, div.cc-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  .cc-body .hint { margin: 0 0 4px; }
  .cc-note { margin: 10px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .cc-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .cc-added { color: var(--wa-green, inherit); }
  .cc-warn { color: var(--wa-amber); font-weight: 600; }
  p.cc-warn { margin: 4px 0; font-size: 12.5px; line-height: 1.4; }
  .hint.cc-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .cc-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .cc-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .cc-facts { display: flex; flex-direction: column; gap: 4px; margin: 6px 0; font-size: 12.5px; }
  .cc-facts > span { display: grid; grid-template-columns: var(--wa-lab, 104px) minmax(0, 1fr); gap: 8px; align-items: baseline; }
  .cc-facts b { font-weight: 500; color: var(--wa-muted); }
  .cc-facts code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
  .cc-swatches { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  .cc-swatch {
    width: 20px; height: 20px; padding: 0; border-radius: 50%; border: 1px solid var(--wa-line-strong);
    background: var(--sw); cursor: pointer;
  }
  .cc-swatch.on { box-shadow: 0 0 0 2px var(--wa-bg), 0 0 0 3.5px var(--wa-sel-ring, var(--wa-ink)); }
  .cc-swatch:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cc-area { display: grid; grid-template-columns: var(--wa-lab, 104px) minmax(0, 1fr); gap: 8px; align-items: center; padding: 4px 0; }
  .cc-area select {
    min-height: 30px; padding: 0 8px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .cc-pick-list { display: flex; flex-direction: column; max-height: 300px; overflow: auto; margin: 4px 0; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .cc-pick-row { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; align-items: center; padding: 5px 8px; border-top: 1px solid var(--wa-line); cursor: pointer; }
  .cc-pick-row:first-child { border-top: 0; }
  .cc-pick-row.held { cursor: default; opacity: .7; }
  .cc-pick-row > code { grid-column: 2; color: var(--wa-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cc-pick-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
`;
