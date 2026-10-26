// A page tile's layers in the page editor: the rows under the picked tile in
// the Tiles list, the inspector for a picked layer (the complication
// editor's own layer cards) or tap zone, and the tile's Layers card.
//
// Every tile kind with layers is made of them, from its simple settings
// (`baseLayers`). Picking the tile shows its simple settings as before;
// picking a layer under it shows that layer's own settings, and the first
// change there makes the layer the tile's own ("changed"), so the simple
// settings no longer touch it. Added layers and tap zones sit beside them.
//
// The rows wear the classes the page editor already styles for its Tiles
// rows (`.layer`, `.name`, `.badges`, `.acts`), which are the complication
// editor's Layers rows. Everything edits through `tile-layer-host.ts`, so
// each change is one page edit with undo.
//
// App repo docs/tile_layers_contract_2026-10.md, section 10.4; the look is
// the design mock "Layers in the current editor".

import { css, html, nothing, type TemplateResult } from "lit";
import { type DescribeContext, checkField, describeValue, entityField, layerEditor, layerTitle, sliderField } from "../editors.js";
import { sectionCard } from "../editor-chrome.js";
import { KIND_COLOR, KIND_LABEL, SECTION_COLOR } from "../kinds.js";
import type { Element, EntityRef, NormalizedFrame, ShapeElement } from "../model.js";
import { compile } from "../compiler.js";
import { CASES } from "../renderer.js";
import type { ResolvedLayout } from "../resolver.js";
import { uiIcon } from "../ui-icons.js";
import { customTilesFor, customTilesUpdateNote } from "../version.js";
import type { TileSettingsHost } from "./editor-host.js";
import { sectionOpen, setSectionOpen } from "./fold-memory.js";
import { type WatchPage, type WatchPageTile, tileGeometry, tileKind } from "./model.js";
import { menuField } from "./tile-settings.js";
import { colorPickerView } from "./color-picker.js";
import { watchAddThemeOf, watchThemeDisplayName, watchThemeSwatches } from "./tile-new.js";
import { watchColorRefusal } from "./tile-settings-options.js";
import { ONE_LOOK_GLOW_BRIGHTNESS_RANGE, ONE_LOOK_GLOW_SIZE_RANGE, oneLookHex, oneLookParseHex } from "./one-look/colour.js";
import { glowReference } from "./tile-base-layers.js";
import {
  WATCH_TRIGGER_TARGET_DOMAINS,
  isWatchTriggerTarget,
  watchHoldSlideSettings,
  watchSingleTapSettings,
  watchTapActionLabel,
  watchTileKindEntry,
  watchTriggerModes,
} from "./tile-settings-model.js";
import {
  type BaseLayerRole,
  type DesignSummary,
  type LayerStatus,
  type TileDesign,
  type TileZoneAction,
  type TileZonePreset,
  baseLayerName,
  BASE_GLOW_ID,
  DELTA_MAX_TEMPLATES,
  TILE_DESIGN_MAX_LAYERS,
  TILE_DESIGN_SCREEN_WIDTH,
  TILE_LAYER_KINDS,
  TILE_TEMPLATE_MAX_CHARS,
  TILE_ZONE_MIN_POINTS,
  TILE_ZONE_PRESET_FRAMES,
  baseRoleOf,
  codePoints,
  designSummary,
  layerStatus,
  pageTemplateKeys,
  readTileDesign,
  tileDesignProblems,
  tileHasLayers,
  tileLayerKindAllowed,
  zonePresetAllowed,
  zonePresetOf,
  zonesOf,
} from "./tile-design.js";
import { renderTileLayerThumb, tileBoxOf, tileDesignLayout } from "./tile-design-face.js";
import { tileDesignNow, tileLayerContext, tileLayerEdits, tileLayerHost, tileLayerInputs } from "./tile-layer-host.js";

// ── words ────────────────────────────────────────────────────────────────

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

/** What a picked layer's status line says first. */
export const LAYER_STATUS_TEXT: Readonly<Record<Exclude<LayerStatus, "zone">, string>> = {
  follows: "Follows the tile's simple settings. Change anything here and this layer takes over.",
  changed: "Changed here. The simple setting now points to this layer.",
  added: "Added layer. The simple settings do not touch it.",
};

/** The Layers card's summary: "6 layers: 2 changed, 2 added, 2 tap zones". */
export function layersSummaryText(s: DesignSummary): string {
  return `${plural(s.layers, "layer", "layers")}: ${s.changed} changed, ${s.added} added, ${plural(s.zones, "tap zone", "tap zones")}`;
}

/** What a tile's row adds after its kind and size once it has layers of its
 * own: "2 changed, 1 added", or its tap zones when that is all. Empty for a
 * tile with no design. */
export function tileRowDesignNote(design: TileDesign | undefined, tile: WatchPageTile): string {
  if (design === undefined) return "";
  const s = designSummary(design, tile);
  const parts: string[] = [];
  if (s.changed > 0) parts.push(`${s.changed} changed`);
  if (s.added > 0) parts.push(`${s.added} added`);
  if (parts.length === 0 && s.zones > 0) parts.push(plural(s.zones, "tap zone", "tap zones"));
  return parts.join(", ");
}

/** A tile's own action in words, for a zone ("Toggle light", "Run script:
 * Ring Chen's phone"). An HTTP action is named from the home's library. */
export function zoneActionLabel(tile: WatchPageTile, action: TileZoneAction, httpActions: readonly { id: string; name: string }[] = []): string {
  const words = watchTapActionLabel(watchTileKindEntry(tile), action.action);
  if (action.action === "triggerEntity" && action.triggerTarget !== undefined) {
    return `${words}: ${action.triggerTarget.friendlyName ?? action.triggerTarget.entityId}`;
  }
  if (action.action === "httpAction" && action.httpActionId !== undefined) {
    const found = httpActions.find((a) => a.id.toUpperCase() === action.httpActionId!.toUpperCase());
    return `${words}: ${found?.name ?? "not in the list"}`;
  }
  return words;
}

/** A layer kind as a pill and the add buttons say it: "Text layer". */
export function layerKindWords(kind: Element["kind"]): string {
  return kind === "tap" ? "Tap zone" : `${KIND_LABEL[kind]} layer`;
}

/** The size of a 46 mm or other watch, by its screen width: "40 mm". */
export function watchSizeLabel(width: number): string {
  return CASES.find((c) => c.screen.width === width)?.label ?? `${width} pt`;
}

/** The splits Add layer's Tap zone tries, in order, on a tile with none. */
const ADD_ZONE_PRESETS: readonly TileZonePreset[] = ["leftRight", "topBottom", "quad"];

/**
 * The Add layer menu: each kind a tile may hold, refused over its cap. Tap
 * zones only come from the Split presets, so Tap zone splits a tile with
 * none by the first preset whose zones keep the 40 pt rule on a watch
 * `watchWidth` points wide (its `preset`), and is refused on a tile that is
 * split already (its zone card changes the split) or too small for any.
 */
export function addLayerChoices(
  tile: WatchPageTile,
  design: TileDesign,
  watchWidth: number = TILE_DESIGN_SCREEN_WIDTH,
): { kind: Element["kind"]; label: string; reason?: string; preset?: TileZonePreset }[] {
  const g = tileGeometry(tile);
  const elements = design.doc.elements;
  const zones = elements.filter((e) => e.kind === "tap").length;
  const layers = elements.length - zones;
  const kinds: Element["kind"][] = [...TILE_LAYER_KINDS, ...(tileLayerKindAllowed("chart", g.colSpan, g.rowSpan) ? ["chart" as const] : []), "tap"];
  return kinds.map((kind) => {
    if (kind === "tap") {
      const label = "Tap zone";
      if (zones > 0) return { kind, label, reason: "Pick a tap zone to change how the tile is split." };
      const preset = ADD_ZONE_PRESETS.find((p) => zonePresetAllowed(p, g.colSpan, g.rowSpan, watchWidth));
      if (preset === undefined) return { kind, label, reason: `Too small for tap zones on a ${watchSizeLabel(watchWidth)} watch` };
      return { kind, label, preset };
    }
    const label = KIND_LABEL[kind];
    if (layers >= TILE_DESIGN_MAX_LAYERS) return { kind, label, reason: `A tile holds ${TILE_DESIGN_MAX_LAYERS} layers at most.` };
    return { kind, label };
  });
}

const PRESET_LABELS: readonly [TileZonePreset, string][] = [
  ["whole", "Whole"],
  ["leftRight", "Left · Right"],
  ["topBottom", "Top · Bottom"],
  ["quad", "4 parts"],
];

/** The Split presets, each refused where a zone would be under 40 pt on its
 * short side on the smallest watch the page is on. */
export function zonePresetChoices(tile: WatchPageTile, watchWidth: number): { preset: TileZonePreset; label: string; reason?: string }[] {
  const g = tileGeometry(tile);
  return PRESET_LABELS.map(([preset, label]) => zonePresetAllowed(preset, g.colSpan, g.rowSpan, watchWidth)
    ? { preset, label }
    : { preset, label, reason: `Too small on a ${watchSizeLabel(watchWidth)} watch` });
}

/** The names of the devices on a page whose app draws the plain tile, not
 * its layers. */
export function tooOldForLayers(pickers: readonly { name: string; version?: string | null }[]): string[] {
  return pickers.filter((p) => !customTilesFor(p.version ?? null)).map((p) => p.name);
}

// ── rows ─────────────────────────────────────────────────────────────────

export interface TileLayerRow {
  id: string;
  kind: Element["kind"];
  title: string;
  /** "Text · Office · 9 pt": the kind, what it shows, its size. */
  detail: { kind: string; value: string; size: string };
  status: LayerStatus;
  role: BaseLayerRole | undefined;
  hidden: boolean;
  rules: boolean;
  /** What it shows needs a Home Assistant template, one of the page's 100. */
  template: boolean;
  /** It can go up (toward the top) or down among the drawing layers. */
  up: boolean;
  down: boolean;
}

export interface TileZoneRow {
  id: string;
  label: string;
  hidden: boolean;
}

/** What a layer shows, in a few words, for its row. */
function layerValueText(el: Element, ctx: DescribeContext | undefined): string {
  switch (el.kind) {
    case "text": return describeValue(el.payload.value, ctx);
    case "icon": return describeValue(el.payload.symbol, ctx);
    case "gauge": return describeValue(el.payload.value, ctx);
    case "image":
      if (el.payload.source === "inline") return "Uploaded picture";
      return el.payload.source === "entityPicture" ? `${el.payload.entity.displayName || el.payload.entity.entityId || "Entity"} picture` : "Camera";
    case "shape": return el.payload.kind === "roundedRectangle" ? "Rounded rectangle" : el.payload.kind;
    default: return "";
  }
}

function layerSizeText(el: Element): string {
  if (el.kind === "text") return `${el.payload.fontSize} pt`;
  if (el.kind === "icon") return `${el.payload.size} pt`;
  return "";
}

/**
 * A tile's layer rows, top of the drawing first (the layer drawn last), and
 * its tap zones after them in their own order. `stored` is the design the
 * tile holds (undefined for none), `design` the one to list: the stored one,
 * or the base layers made fresh, so the rows read the same before and after
 * the first change.
 */
export function tileLayerRows(
  tile: WatchPageTile,
  stored: TileDesign | undefined,
  design: TileDesign,
  ctx?: DescribeContext,
  httpActions: readonly { id: string; name: string }[] = [],
): { layers: TileLayerRow[]; zones: TileZoneRow[] } {
  const drawing = design.doc.elements.filter((e) => e.kind !== "tap");
  const top = [...drawing].reverse();
  const layers = top.map((el, i): TileLayerRow => {
    const role = baseRoleOf(el.payload.id);
    const rules = "rules" in el.payload && Array.isArray(el.payload.rules) && el.payload.rules.length > 0;
    const template = compile({ ...design.doc, elements: [el] }).document !== undefined;
    return {
      id: el.payload.id.toUpperCase(),
      kind: el.kind,
      title: baseLayerName(el.payload.id) ?? layerTitle(el, ctx),
      detail: { kind: KIND_LABEL[el.kind], value: layerValueText(el, ctx), size: layerSizeText(el) },
      status: layerStatus(stored, el.payload.id),
      role,
      hidden: el.payload.isHidden === true,
      rules,
      template,
      up: i > 0,
      down: i < top.length - 1,
    };
  });
  const zones = zonesOf(design).map((z, i): TileZoneRow => {
    const el = design.doc.elements.find((e) => e.payload.id.toUpperCase() === z.id);
    return { id: z.id, label: `Tap zone ${i + 1} · ${zoneActionLabel(tile, z.action, httpActions)}`, hidden: el?.payload.isHidden === true };
  });
  return { layers, zones };
}

/** The key under the Tiles list: what a layer row's dot and tag mean, and
 * why some tiles have no arrow. */
export function renderTileLayersLegend(): TemplateResult {
  return html`<div class="tl-legend" aria-hidden="true">
    <span class="tl-legend-item"><span class="tl-dot"></span>changed</span>
    <span class="tl-added">added</span>
    <span>No arrow: live tile, no layers</span>
  </div>`;
}

// ── the view ─────────────────────────────────────────────────────────────

/** What the page editor hands these views: the picked tile's host, the
 * picked layer or zone, and how to pick another. */
export interface TileLayersView {
  host: TileSettingsHost;
  /** The picked layer's or tap zone's id, upper case; undefined: the tile. */
  selected: string | undefined;
  /** Pick a layer or zone, or the tile itself with undefined. */
  pick(id: string | undefined): void;
  /** Edits are refused (a save is out, a view that only shows). */
  off: boolean;
}

/** The thumbnail box of a layer row. */
const ROW_THUMB = { width: 44, height: 22 };

/** The design to list and draw for the view's tile, with the one it holds. */
function viewDesign(view: TileLayersView): { stored: TileDesign | undefined; design: TileDesign } {
  return { stored: readTileDesign(view.host.tile), design: tileDesignNow(view.host) };
}

/**
 * The rows under the picked tile in the Tiles list: its layers, each with
 * its own picture, kind, what it shows and its size, a blue dot when changed
 * here, an "added" tag, and on hover bring forward, send back, hide, copy
 * (added layers) and delete; then its tap zones in the tap color.
 */
export function renderTileLayerRows(view: TileLayersView): TemplateResult | typeof nothing {
  const host = view.host;
  if (!tileHasLayers(host.tile)) return nothing;
  const { stored, design } = viewDesign(view);
  const rows = tileLayerRows(host.tile, stored, design, { values: design.doc.values, hass: host.hass, elements: design.doc.elements }, host.catalog?.httpActions ?? []);
  const layout: ResolvedLayout = tileDesignLayout(host.tile, design, tileLayerInputs(host));
  const box = tileBoxOf(host.tile);
  const edits = tileLayerEdits(host);
  const off = view.off;
  const stop = (e: Event) => e.stopPropagation();
  const layerRow = (r: TileLayerRow) => {
    const picked = view.selected === r.id;
    const pick = () => view.pick(r.id);
    const added = r.status === "added";
    return html`<div class="layer tl-row ${picked ? "hl" : ""} ${r.hidden ? "dim" : ""}" role="listitem" tabindex="0" data-layer-row=${r.id}
      style=${`--k:${KIND_COLOR[r.kind]}`} aria-current=${picked ? "true" : "false"} aria-label=${`${r.title}, ${layerKindWords(r.kind)}`}
      @click=${pick}
      @keydown=${(e: KeyboardEvent) => {
        if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        pick();
      }}>
      <span class="grip" aria-hidden="true"></span>
      <span class="thumb" aria-hidden="true">${renderTileLayerThumb(layout, r.id, box, host.icons, ROW_THUMB.width, ROW_THUMB.height)}</span>
      <span class="name">
        <b><span class="nm-t">${r.title}</span>${r.status === "changed" ? html`<span class="tl-dot" title="Changed here" aria-label="changed"></span>` : nothing}${added ? html`<span class="tl-added">added</span>` : nothing}</b>
        <small><span class="kind">${r.detail.kind}</span>${r.detail.value === "" ? nothing : html` · <span class="val-tok">${r.detail.value}</span>`}${r.detail.size === "" ? nothing : ` · ${r.detail.size}`}</small>
      </span>
      <span class="right">
        <span class="badges">${r.template ? html`<span class="badge states" title="Reads a Home Assistant template, one of the page's ${DELTA_MAX_TEMPLATES}">template</span>` : nothing}${r.rules ? html`<span class="badge states" title="Changes with the state">rules</span>` : nothing}</span>
        ${off ? nothing : html`<span class="acts" @click=${stop}>
          <button type="button" class="icon" ?disabled=${!r.up} title="Bring forward" aria-label=${`Bring ${r.title} forward`} @click=${() => edits.move(r.id, 1)}>${uiIcon("up")}</button>
          <button type="button" class="icon" ?disabled=${!r.down} title="Send backward" aria-label=${`Send ${r.title} backward`} @click=${() => edits.move(r.id, -1)}>${uiIcon("down")}</button>
          <button type="button" class="icon" title=${r.hidden ? "Show" : "Hide"} aria-label=${`${r.hidden ? "Show" : "Hide"} ${r.title}`} @click=${() => edits.setHidden(r.id, !r.hidden)}>${uiIcon(r.hidden ? "show" : "hide")}</button>
          ${added ? html`<button type="button" class="icon" title="Duplicate" aria-label=${`Duplicate ${r.title}`} @click=${() => { const id = edits.duplicate(r.id); if (id !== "") view.pick(id); }}>${uiIcon("duplicate")}</button>` : nothing}
          <button type="button" class="icon danger" title=${r.role === undefined ? "Delete" : "Delete (Reset brings it back)"} aria-label=${`Delete ${r.title}`}
            @click=${() => { if (edits.remove(r.id) && picked) view.pick(undefined); }}>${uiIcon("delete")}</button>
        </span>`}
      </span>
    </div>`;
  };
  const zoneRow = (z: TileZoneRow) => {
    const picked = view.selected === z.id;
    const label = z.label;
    return html`<div class="tl-zone ${picked ? "on" : ""} ${z.hidden ? "dim" : ""}" role="listitem" tabindex="0" data-zone-row=${z.id}
      aria-current=${picked ? "true" : "false"}
      @click=${() => view.pick(z.id)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        view.pick(z.id);
      }}>
      <span class="tl-zone-glyph" aria-hidden="true">${uiIcon("tap")}</span>
      <span class="tl-zone-words">${label}</span>
      ${off ? nothing : html`<button type="button" class="icon tl-zone-del" title="Delete" aria-label=${`Delete ${label}`}
        @click=${(e: Event) => { e.stopPropagation(); if (edits.remove(z.id) && picked) view.pick(undefined); }}>${uiIcon("delete")}</button>`}
    </div>`;
  };
  return html`<div class="tl-rows" role="list" aria-label="Layers">
    ${rows.layers.map(layerRow)}
    ${rows.zones.map(zoneRow)}
  </div>`;
}

/** The picked layer or zone of the view, when it is still in the tile. */
export function pickedTileLayer(view: TileLayersView): Element | undefined {
  const id = view.selected;
  if (id === undefined || !tileHasLayers(view.host.tile)) return undefined;
  return tileDesignNow(view.host).doc.elements.find((e) => e.payload.id.toUpperCase() === id);
}

/** The picked layer's name and kind words, for the inspector's head. */
export function tileLayerCrumb(view: TileLayersView): { kind: string; name: string; color: string } | undefined {
  const el = pickedTileLayer(view);
  if (el === undefined) return undefined;
  const design = tileDesignNow(view.host);
  if (el.kind === "tap") {
    const index = zonesOf(design).findIndex((z) => z.id === el.payload.id.toUpperCase());
    return { kind: layerKindWords("tap"), name: `Tap zone ${index + 1}`, color: KIND_COLOR.tap };
  }
  return {
    kind: layerKindWords(el.kind),
    name: baseLayerName(el.payload.id) ?? layerTitle(el, { values: design.doc.values, hass: view.host.hass, elements: design.doc.elements }),
    color: KIND_COLOR[el.kind],
  };
}

/**
 * The inspector for the picked layer: its status line (follows the simple
 * settings, changed here with Reset layer, or added with Delete), then the
 * complication editor's own cards for the layer. A tap zone gets its own
 * card instead. Undefined when the picked layer is gone.
 */
export function renderTileLayerInspector(view: TileLayersView, watchWidth: number): TemplateResult | undefined {
  const el = pickedTileLayer(view);
  if (el === undefined) return undefined;
  if (el.kind === "tap") return renderZoneCard(view, el.payload.id.toUpperCase(), watchWidth);
  const host = view.host;
  const status = layerStatus(readTileDesign(host.tile), el.payload.id);
  const role = baseRoleOf(el.payload.id);
  const edits = tileLayerEdits(host);
  const line = status === "follows"
    ? html`<div class="tl-status follow">${LAYER_STATUS_TEXT.follows}</div>`
    : status === "changed"
    ? html`<div class="tl-status changed"><span class="tl-dot" aria-hidden="true"></span><span>${LAYER_STATUS_TEXT.changed}</span>
        ${view.off || role === undefined ? nothing : html`<button type="button" class="link" @click=${() => edits.reset(role)}>Reset layer</button>`}</div>`
    : html`<div class="tl-status added"><span>${LAYER_STATUS_TEXT.added}</span>
        ${view.off ? nothing : html`<button type="button" class="link" @click=${() => { if (edits.remove(el.payload.id)) view.pick(undefined); }}>Delete</button>`}</div>`;
  const lh = tileLayerHost(host, (id) => view.pick(id.toUpperCase()));
  const current = lh.config.elements.find((e) => e.payload.id.toUpperCase() === el.payload.id.toUpperCase()) ?? el;
  const glow = current.kind === "shape" && current.payload.id.toUpperCase() === BASE_GLOW_ID ? renderGlowCard(view, current.payload) : nothing;
  return html`${line}${glow}
    <fieldset class="tl-editor ts-plain" ?disabled=${view.off} aria-label=${layerKindWords(el.kind)}>
      ${layerEditor(lh, current, "rectangular", { placement: true, tap: false })}
    </fieldset>`;
}

/** A tap zone's action as the picker holds it: the action, or "http:" and
 * an HTTP action's id. */
const HTTP_CHOICE = "http:";

/** The actions a zone may take: the tile's single tap choices and its hold
 * and slide ones, each once, None last; an HTTP action per entry of the
 * home's library. */
function zoneActionMenu(tile: WatchPageTile, action: TileZoneAction, httpActions: readonly { id: string; name: string }[]) {
  const entry = watchTileKindEntry(tile);
  const seen = new Set<string>();
  const options: { value: string; label: string; group?: string; disabled?: boolean }[] = [];
  const offered = [
    ...watchSingleTapSettings(tile).offered,
    ...(watchHoldSlideSettings(tile, { httpActions: httpActions.length > 0 }).directions[0]?.offered ?? []),
  ];
  for (const c of offered) {
    if (seen.has(c.value) || c.value === "none") continue;
    seen.add(c.value);
    if (c.value === "httpAction") {
      const group = watchTapActionLabel(entry, "httpAction");
      options.push(...httpActions.map((a) => ({ value: HTTP_CHOICE + a.id, label: a.name, group })));
      continue;
    }
    options.push({ value: c.value, label: c.label });
  }
  options.push({ value: "none", label: watchTapActionLabel(entry, "none") });
  const selected = action.action === "httpAction" && action.httpActionId !== undefined ? HTTP_CHOICE + action.httpActionId : action.action;
  if (!options.some((o) => o.value === selected)) options.unshift({ value: selected, label: zoneActionLabel(tile, action, httpActions), disabled: true });
  return { options, selected };
}

/** The zone's action after a pick in its menu, keeping its ask first. */
export function pickedZoneAction(before: TileZoneAction, value: string): TileZoneAction {
  const out: TileZoneAction = value.startsWith(HTTP_CHOICE)
    ? { action: "httpAction", httpActionId: value.slice(HTTP_CHOICE.length) }
    : { action: value };
  if (out.action === "triggerEntity" && before.action === "triggerEntity" && before.triggerTarget !== undefined) out.triggerTarget = before.triggerTarget;
  if (out.action === "httpAction" && before.action === "httpAction") {
    if (before.httpShowBanner !== undefined) out.httpShowBanner = before.httpShowBanner;
    if (before.httpBannerSeconds !== undefined) out.httpBannerSeconds = before.httpBannerSeconds;
  }
  if (before.requiresConfirmation === true) out.requiresConfirmation = true;
  return out;
}

/**
 * A picked tap zone's card: Split (the four presets, those a zone would be
 * too small for refused with the reason), This zone (the action, with what
 * a trigger runs), and Ask first.
 */
function renderZoneCard(view: TileLayersView, zoneId: string, watchWidth: number): TemplateResult {
  const host = view.host;
  const tile = host.tile;
  const design = tileDesignNow(host);
  const zone = zonesOf(design).find((z) => z.id === zoneId);
  const action = zone?.action ?? { action: "none" };
  const edits = tileLayerEdits(host);
  const httpActions = host.catalog?.httpActions ?? [];
  const now = zonePresetOf(design);
  const presets = zonePresetChoices(tile, watchWidth);
  const set = (next: TileZoneAction) => edits.zoneAction(zoneId, next);
  const trigger = action.action === "triggerEntity" ? action.triggerTarget : undefined;
  const ref: EntityRef = {
    entityId: trigger?.entityId ?? "",
    displayName: trigger?.friendlyName ?? trigger?.entityId ?? "",
    domain: tileKind(trigger?.entityId ?? ""),
  };
  const pickTarget = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "" || !isWatchTriggerTarget(id)) return;
    const friendly = host.hass.states[id]?.attributes?.friendly_name;
    const modes = watchTriggerModes(tileKind(id));
    const mode = trigger?.entityId === id ? trigger.mode : modes[0]?.value ?? "run";
    set({ ...action, triggerTarget: { entityId: id, mode, ...(typeof friendly === "string" && friendly.trim() !== "" ? { friendlyName: friendly } : {}) } });
  };
  const modes = trigger === undefined ? undefined : watchTriggerModes(tileKind(trigger.entityId));
  return sectionCard({
    color: SECTION_COLOR.tap,
    icon: uiIcon("tap"),
    title: "Tap zone",
    open: true,
    onToggle: () => undefined,
  }, html`<fieldset class="ts-body tl-zone-card" ?disabled=${view.off} aria-label="Tap zone">
    <div class="field"><span>Split</span><div class="tl-presets" role="group" aria-label="Split">
      ${presets.map((p) => html`<button type="button" class="pe-chip ${now === p.preset ? "on" : ""}" aria-pressed=${now === p.preset ? "true" : "false"}
        ?disabled=${p.reason !== undefined} title=${p.reason ?? p.label}
        @click=${() => { if (edits.preset(p.preset) && p.preset === "whole") view.pick(undefined); }}>${p.label}</button>`)}
    </div></div>
    <div class="hint ts-under">Each zone is at least ${TILE_ZONE_MIN_POINTS} pt on its short side on the smallest watch the page is on.</div>
    ${menuField("This zone", zoneActionMenu(tile, action, httpActions), (v) => set(pickedZoneAction(action, v)))}
    ${action.action !== "triggerEntity" ? nothing : html`<div class="ts-nested">
      <div class="ts-stack">${entityField({ hass: host.hass }, "Runs", ref, pickTarget, `pe:tl:trigger:${zoneId}`, { domain: WATCH_TRIGGER_TARGET_DOMAINS, clearable: false })}</div>
      ${modes === undefined || trigger === undefined
        ? html`<div class="hint warn ts-under">This does nothing until an entity is picked.</div>`
        : menuField("Mode", { options: modes, selected: trigger.mode }, (v) => set({ ...action, triggerTarget: { ...trigger, mode: v } }))}
    </div>`}
    ${checkField("Ask first", action.requiresConfirmation === true, (on) => {
      const next: TileZoneAction = { ...action };
      if (on) next.requiresConfirmation = true;
      else delete next.requiresConfirmation;
      set(next);
    })}
    <div class="hint ts-under">A tap here runs this zone's action instead of the tile's single tap. Hold and slide stay the whole tile's.</div>
    <div class="hint ts-under">A zone keeps its place in the Split: it does not drag on the page. Pick another Split to change it.</div>
  </fieldset>`);
}

// ── the Glow layer's card ────────────────────────────────────────────────

const round4 = (v: number): number => Math.round(v * 10000) / 10000;

/** What the Glow layer's card measures against (section 14.8): the glyph
 * box, the stored `base.glow` anchor's while the design has one, else the
 * one built now; the opacity the tile's glow has at 100%; the tile's colour.
 * Undefined while the tile has no state to build from. */
export function glowCardReference(host: TileSettingsHost): { box: { x: number; y: number; width: number; height: number }; opacity: number; tileHex: string } | undefined {
  const ref = glowReference(host.tile, tileLayerContext(host));
  if (ref === undefined) return undefined;
  const anchor = readTileDesign(host.tile)?.anchors.glow;
  return { box: anchor ?? ref.box, opacity: ref.opacity, tileHex: ref.tileHex };
}

/** The Glow card's values read off the layer: its size as a percent of the
 * glyph box and its brightness as a percent of the tile's own glow, both
 * whole numbers. */
export function glowCardValues(glow: Pick<ShapeElement, "frame" | "opacity">, ref: { box: { width: number }; opacity: number }): { size: number; brightness: number } {
  const size = ref.box.width > 0 ? Math.round((glow.frame.width / ref.box.width) * 100) : 100;
  const brightness = ref.opacity > 0 ? Math.round(((glow.opacity ?? 1) / ref.opacity) * 100) : 100;
  return { size, brightness };
}

/** The glow's frame at a size, a percent of the glyph box, its centre kept. */
export function glowFrameAtSize(frame: NormalizedFrame, box: { width: number; height: number }, size: number): NormalizedFrame {
  const w = (box.width * size) / 100;
  const h = (box.height * size) / 100;
  const cx = frame.x + frame.width / 2;
  const cy = frame.y + frame.height / 2;
  return { ...frame, x: round4(cx - w / 2), y: round4(cy - h / 2), width: round4(w), height: round4(h) };
}

/** The glow's own opacity at a brightness, a percent of the tile's own glow;
 * at most 1. Its rule's numbers are ratios and stay. */
export function glowOpacityAt(refOpacity: number, brightness: number): number {
  return round4(Math.min(1, (refOpacity * brightness) / 100));
}

/**
 * The friendly card at the top of the Glow layer's editor: Show glow, its
 * size and brightness against the tile's own glow, and its colour (white,
 * the tile's colour, the theme's swatches, a custom one), each written into
 * the layer, so a change owns the glyph slot like any edit of the layer. The
 * shape editor below keeps everything else. Left out while the tile has no
 * state to measure against.
 */
function renderGlowCard(view: TileLayersView, glow: ShapeElement): TemplateResult | typeof nothing {
  const host = view.host;
  const ref = glowCardReference(host);
  if (ref === undefined) return nothing;
  const lh = tileLayerHost(host, (id) => view.pick(id.toUpperCase()));
  const write = (change: (p: ShapeElement) => void) => lh.update((cfg) => {
    const el = cfg.elements.find((e) => e.payload.id.toUpperCase() === BASE_GLOW_ID);
    if (el?.kind === "shape") change(el.payload);
  });
  const values = glowCardValues(glow, ref);
  const hex = glow.colorSlot.baseColorHex.slice(0, 7).toUpperCase();
  const setHex = (value: string) => {
    const rgb = oneLookParseHex(value);
    if (rgb === undefined) return;
    const next = oneLookHex(rgb);
    write((p) => {
      p.colorSlot = { ...p.colorSlot, baseColorHex: next };
      p.fill = { kind: "radial", stops: [{ at: 0, colorHex: next }, { at: 1, colorHex: `${next}00` }] };
    });
  };
  const theme = watchAddThemeOf(host.page);
  const tileOn = hex === ref.tileHex && hex !== "#FFFFFF";
  return html`<fieldset class="tl-glow ts-plain" ?disabled=${view.off} aria-label="Glow">
    <div class="ts-sub-h"><span>Glow</span></div>
    ${checkField("Show glow", glow.isHidden !== true, (on) => write((p) => { p.isHidden = !on; }))}
    ${sliderField("Size", values.size, (v) => write((p) => { p.frame = glowFrameAtSize(p.frame, ref.box, v); }), {
      min: ONE_LOOK_GLOW_SIZE_RANGE[0], max: ONE_LOOK_GLOW_SIZE_RANGE[1], step: 5, def: 150, unit: "%",
    })}
    ${sliderField("Brightness", values.brightness, (v) => write((p) => {
      const opacity = glowOpacityAt(ref.opacity, v);
      if (opacity >= 1) delete p.opacity;
      else p.opacity = opacity;
    }), { min: ONE_LOOK_GLOW_BRIGHTNESS_RANGE[0], max: ONE_LOOK_GLOW_BRIGHTNESS_RANGE[1], step: 5, def: 100, unit: "%" })}
    <div class="hint ts-under">100% is the tile's own glow. The glow still dims as the tile turns off.</div>
    ${colorPickerView({
      label: "Color",
      color: hex === "#FFFFFF" ? undefined : hex,
      swatches: watchThemeSwatches(theme, false),
      swatchesLabel: `Glow color: ${watchThemeDisplayName(theme)} colors`,
      pickSwatch: setHex,
      default: { title: "White, the tile's own glow", on: hex === "#FFFFFF", pick: () => setHex("#FFFFFF") },
      tile: { title: `The tile's color, ${ref.tileHex}`, on: tileOn, pick: () => setHex(ref.tileHex) },
      custom: {
        shown: hex,
        pick: (value) => { if (value !== undefined && watchColorRefusal(value) === undefined) setHex(value); },
      },
      wrap: (body) => body,
    })}
  </fieldset>`;
}

// ── the Layers card ──────────────────────────────────────────────────────

/** Where the Layers card keeps whether it is open. */
export const TILE_LAYERS_FOLD = { module: "tile-layers", section: "layers" } as const;

/** What the Layers card needs beyond the view. */
export interface TileLayersCardInfo {
  /** The devices that pick the page, with the app version each reported. */
  pickers: readonly { name: string; version?: string | null }[];
  /** The page as edited, for its template count. */
  page: WatchPage;
  /** The smallest watch the page is on, for the 40 pt rule of Tap zone. */
  watchWidth?: number;
}

/**
 * The tile's Layers card, last of its cards: how many layers and what they
 * are, + Add layer, the watch's budget (layers of 8, templates of 100 on the
 * page), Reset all layers, and the lines a save would refuse or a device
 * too old to draw the layers.
 */
export function renderTileLayersCard(view: TileLayersView, info: TileLayersCardInfo): TemplateResult | typeof nothing {
  const host = view.host;
  const tile = host.tile;
  if (!tileHasLayers(tile)) return nothing;
  const { module, section } = TILE_LAYERS_FOLD;
  const open = sectionOpen(host.uiState, module, section);
  const { stored, design } = viewDesign(view);
  const summary = designSummary(stored, tile, tileLayerContext(host));
  const toggle = () => { setSectionOpen(host.uiState, module, section, !open); host.requestUpdate(); };
  if (!open) {
    return sectionCard({ color: "var(--wa-hue-blue, #2f6ccc)", icon: uiIcon("layers"), title: "Layers", open, onToggle: toggle, summary: layersSummaryText(summary), dot: stored !== undefined, id: `${module}:${section}` }, html``);
  }
  const edits = tileLayerEdits(host);
  const choices = addLayerChoices(tile, design, info.watchWidth);
  const templates = pageTemplateKeys(info.page).size;
  const template = stored?.template;
  const chars = template === undefined ? 0 : codePoints(template);
  const old = customTilesUpdateNote(tooOldForLayers(info.pickers));
  const problems = tileDesignProblems(tile);
  const meter = (label: string, used: number, limit: number, warn: boolean) => html`<div class="tl-meter ${used > limit ? "over" : ""}">
    <div class="tl-meter-h"><span>${label}</span><span>${used} of ${limit}</span></div>
    <div class="tl-meter-bar"><span style=${`width:${Math.min(100, (used / limit) * 100)}%${warn ? ";background:var(--wa-hue-yellow)" : ""}`}></span></div>
  </div>`;
  return sectionCard({ color: "var(--wa-hue-blue, #2f6ccc)", icon: uiIcon("layers"), title: "Layers", open, onToggle: toggle, dot: stored !== undefined, id: `${module}:${section}` }, html`
    <div class="tl-card">
      <div class="tl-sum">${layersSummaryText(summary)}</div>
      <div class="field"><span>Add layer</span><div class="tl-add" role="group" aria-label="Add layer">
        ${choices.map((c) => html`<button type="button" class="pe-chip tl-add-btn" ?disabled=${view.off || c.reason !== undefined}
          title=${c.reason ?? (c.preset !== undefined ? `Split the tile into ${TILE_ZONE_PRESET_FRAMES[c.preset].length} tap zones` : `Add a ${c.label.toLowerCase()} layer on top`)}
          @click=${() => {
            if (c.kind === "tap") {
              // A zone comes from a Split preset, never a free frame.
              if (c.preset === undefined || !edits.preset(c.preset)) return;
              const first = zonesOf(readTileDesign(host.tile))[0];
              if (first !== undefined) view.pick(first.id);
              return;
            }
            const id = edits.add(c.kind);
            if (id !== "") view.pick(id);
          }}>${uiIcon(c.kind === "image" ? "image" : c.kind)}<span>${c.label}</span></button>`)}
      </div></div>
      <div class="tl-meters">
        ${meter("Layers", summary.layers, TILE_DESIGN_MAX_LAYERS, false)}
        ${meter("Templates on page", templates, DELTA_MAX_TEMPLATES, true)}
      </div>
      ${chars > TILE_TEMPLATE_MAX_CHARS ? html`<div class="hint warn keep">This tile's values need ${chars} of ${TILE_TEMPLATE_MAX_CHARS} characters.</div>` : nothing}
      ${problems.filter((p) => !p.startsWith("design's values need")).map((p) => html`<div class="hint warn keep">${p.charAt(0).toUpperCase()}${p.slice(1)}</div>`)}
      ${old === undefined ? nothing : html`<div class="hint warn keep tl-old">${old}</div>`}
      <div class="tl-reset">
        <button type="button" class="pe-btn" ?disabled=${view.off || stored === undefined} @click=${() => { if (edits.resetAll()) view.pick(undefined); }}>${uiIcon("reset")}<span>Reset all layers</span></button>
        <span class="hint">Back to the plain tile.</span>
      </div>
    </div>`);
}

/** The width the 40 pt rule is measured on when no watch is known. */
export const TILE_LAYERS_DEFAULT_WATCH_WIDTH = TILE_DESIGN_SCREEN_WIDTH;

// ── styles ───────────────────────────────────────────────────────────────

export const tileLayersStyles = css`
  /* The picked tile's row and its layers, boxed together as the mock draws
     them; every other tile stays one row. */
  .tl-group { display: flex; flex-direction: column; gap: 2px; padding: 3px; border-radius: calc(var(--wa-r-sm) + 3px); flex: none;
    border: 1px solid color-mix(in srgb, var(--wa-pick-line, #3b74e0) 45%, transparent); background: color-mix(in srgb, var(--wa-pick-bg, #e3ecfa) 30%, transparent); }
  .tl-rows { display: flex; flex-direction: column; gap: 2px; }
  .tl-rows > .layer { margin-left: 14px; min-height: 36px; }
  .pe-tile-row .pe-caret { display: grid; place-items: center; width: 12px; color: var(--wa-muted); }
  .pe-tile-row .pe-caret svg.ui-icon { width: 11px; height: 11px; transform: rotate(-90deg); }
  .pe-tile-row .pe-caret.open svg.ui-icon { transform: none; }
  .pe-tile-row .pe-caret.none { visibility: hidden; }
  .layer.pe-tile-row { grid-template-columns: 12px var(--thumb-w) minmax(0, 1fr) auto; padding-left: 2px; }
  .tl-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--wa-hue-blue, #2f6ccc); flex: none; display: inline-block; }
  .tl-added { font-size: 10px; font-weight: 600; padding: 1px 5px; border-radius: 4px; flex: none;
    color: var(--wa-hue-green, #1d8455); background: color-mix(in srgb, var(--wa-hue-green, #1d8455) 14%, transparent); }
  .tl-zone {
    display: flex; align-items: center; gap: 6px; min-height: 26px; margin-left: 14px; padding: 0 6px; border-radius: var(--wa-r-sm);
    font-size: 12px; font-weight: 600; color: var(--wa-hue-red, #d0453a); cursor: pointer; flex: none;
    background: color-mix(in srgb, var(--wa-hue-red, #d0453a) 9%, var(--wa-field));
  }
  .tl-zone:hover { background: color-mix(in srgb, var(--wa-hue-red, #d0453a) 16%, var(--wa-field)); }
  .tl-zone.on { background: var(--wa-pick-bg, #e3ecfa); box-shadow: inset 0 0 0 1px var(--wa-pick-line, #3b74e0); }
  .tl-zone.dim { opacity: .55; }
  .tl-zone:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .tl-zone-glyph { display: grid; place-items: center; }
  .tl-zone-glyph svg.ui-icon { width: 13px; height: 13px; }
  .tl-zone-words { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tl-zone-del { visibility: hidden; width: 22px; height: 20px; color: inherit; }
  .tl-zone:hover .tl-zone-del, .tl-zone-del:focus-visible { visibility: visible; }
  .tl-zone-del svg.ui-icon { width: 14px; height: 14px; }
  /* The picked layer's status line, first in the inspector. */
  .tl-status { display: flex; align-items: center; gap: 7px; padding: 7px 10px; margin-bottom: 8px; border-radius: 8px; font-size: 12px; line-height: 1.4;
    border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-muted); }
  .tl-status > span:not(.tl-dot) { flex: 1; min-width: 0; }
  .tl-status .link { margin-left: auto; font-weight: 600; white-space: nowrap; }
  .tl-status.changed { border-color: color-mix(in srgb, var(--wa-hue-blue, #2f6ccc) 50%, transparent); background: color-mix(in srgb, var(--wa-hue-blue, #2f6ccc) 10%, var(--wa-card)); color: var(--wa-ink); }
  .tl-status.added { border-color: color-mix(in srgb, var(--wa-hue-green, #1d8455) 50%, transparent); background: color-mix(in srgb, var(--wa-hue-green, #1d8455) 10%, var(--wa-card)); color: var(--wa-ink); }
  .tl-editor { border: 0; margin: 0; padding: 0; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
  .tl-presets, .tl-add { display: flex; flex-wrap: wrap; gap: 4px; }
  .tl-add-btn { display: inline-flex; align-items: center; gap: 4px; }
  .tl-add-btn svg.ui-icon { width: 13px; height: 13px; }
  .tl-card { display: flex; flex-direction: column; gap: 8px; }
  .tl-sum { font-size: 12px; color: var(--wa-ink); }
  .tl-meters { display: flex; gap: 12px; }
  .tl-meter { flex: 1; display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--wa-muted); }
  .tl-meter-h { display: flex; justify-content: space-between; gap: 6px; }
  .tl-meter-bar { height: 4px; border-radius: 2px; background: color-mix(in srgb, var(--wa-ink) 12%, transparent); overflow: hidden; }
  .tl-meter-bar > span { display: block; height: 100%; background: var(--wa-hue-blue, #2f6ccc); }
  .tl-meter.over { color: var(--wa-need); }
  .tl-meter.over .tl-meter-bar > span { background: var(--wa-need); }
  .tl-reset { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .tl-legend { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 6px 4px 0; font-size: 10px; color: var(--wa-muted); }
  .tl-legend-item { display: inline-flex; align-items: center; gap: 4px; }
  /* The shared layer editor's Format summary note, spaced as panel.ts does. */
  details.sub.format summary .sum-note { margin-left: 6px; color: var(--wa-muted); font-weight: 400; }
`;
