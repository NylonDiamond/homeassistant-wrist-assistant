// The part of a tile's layers (`design`) that needs no drawing: the names,
// the caps, reading the key, the template key, the problems a save refuses
// and the watch budget. `tile-design.ts` re-exports all of it beside the
// editing functions; this file is apart so the page draft's value check
// (`merge.ts`) can read the caps without pulling One Look's drawing in, which
// imports the draft's own modules back.
//
// App repo docs/tile_layers_contract_2026-10.md is the contract: sections 1
// (the key and its caps), 2.1 and 2.2 (which tiles, the base roles), 5.3 (the
// template key) and 6.1 (a zone's action).

import { fnv1a64Hex } from "../compiler.js";
import {
  type CustomComplicationConfig,
  type DrawableFamily,
  type Element,
  type TileStatePart,
  defaultLayout,
  elementsFor,
  parseConfig,
  schemaVersionFor,
} from "../model.js";
import {
  type JsonObject,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  VIRTUAL_TILE_KINDS,
  isJsonObject,
  tileEntityId,
  tileGeometry,
  tileKind,
  watchPageTiles,
  watchPagesOf,
} from "./model.js";

// ── names and caps ───────────────────────────────────────────────────────

export const TILE_DESIGN_KEY = "design";
/** The only `design.v` there is. A reader that meets another draws the plain
 * tile. */
export const TILE_DESIGN_VERSION = 1;
/** The design as compact UTF-8 JSON. */
export const TILE_DESIGN_MAX_BYTES = 16384;
/** Drawing layers, base layers included (every element that is not a tap). */
export const TILE_DESIGN_MAX_LAYERS = 8;
/** Tap zones. */
export const TILE_DESIGN_MAX_ZONES = 4;
/** A tile's compiled values, in Unicode code points: the delta's own cap on
 * one template. */
export const TILE_TEMPLATE_MAX_CHARS = 4096;
/** Distinct templates one device sends with the delta, show when templates
 * and tile templates together. */
export const DELTA_MAX_TEMPLATES = 100;
/** A tap zone's shortest side, in drawn points on the smallest watch the page
 * is on. */
export const TILE_ZONE_MIN_POINTS = 40;
/** The screen a design box is measured on: the 46 mm watch. */
export const TILE_DESIGN_SCREEN_WIDTH = 208;
/** The complication family a tile's document is drawn as. */
export const TILE_DESIGN_FAMILY: DrawableFamily = "rectangular";
export const TILE_TEMPLATE_KEY_PREFIX = "tile_";
/** The tile width, in columns, from which a tile counts as large: the only
 * size that may carry a chart layer once tiles draw charts. */
export const TILE_CHART_MIN_COLUMNS = 12;
/** The rows a large tile has at least. */
export const TILE_CHART_MIN_ROWS = 4;
/** Whether tiles draw chart layers yet. Off in the first round: a chart needs
 * a history fetch the tile path does not make (contract decision 10). */
export const TILE_CHARTS_DRAWN = false;

// ── base roles ───────────────────────────────────────────────────────────

/** The layers a tile starts with, made from its simple settings. */
export type BaseLayerRole = "icon" | "photo" | "name" | "state";

/** Every role, in draw order bottom to top (icon and photo share the
 * bottom: a tile has one or the other). */
export const BASE_LAYER_ROLES: readonly BaseLayerRole[] = ["icon", "photo", "state", "name"];

/** Each role's element id, fixed so a rebuild finds the layer it made. */
export const BASE_LAYER_IDS: Readonly<Record<BaseLayerRole, string>> = Object.freeze({
  icon: "BA5E0000-0000-4000-8000-000000000001",
  photo: "BA5E0000-0000-4000-8000-000000000002",
  name: "BA5E0000-0000-4000-8000-000000000003",
  state: "BA5E0000-0000-4000-8000-000000000004",
});

/** Each role's row name in the Layers list (the element's `name`). */
export const BASE_LAYER_NAMES: Readonly<Record<BaseLayerRole, string>> = Object.freeze({
  icon: "Icon",
  photo: "Photo",
  name: "Name",
  state: "State",
});

/** A role as `design.owned` writes it ("base.name"). */
export function ownedString(role: BaseLayerRole): string {
  return `base.${role}`;
}

/** The role an `owned` string names, or undefined for anything else. */
export function roleOfOwnedString(value: unknown): BaseLayerRole | undefined {
  if (typeof value !== "string" || !value.startsWith("base.")) return undefined;
  const role = value.slice(5);
  return (BASE_LAYER_ROLES as readonly string[]).includes(role) ? (role as BaseLayerRole) : undefined;
}

/** The capsule One Look draws behind the state with the Pill value style:
 * a shape layer just under the State layer, part of the state role. It is
 * built with the State layer, drawn and owned with it, and goes with it. */
export const BASE_STATE_PILL_ID = "BA5E0000-0000-4000-8000-000000000005";
/** The pill's row name in the Layers list. */
export const BASE_STATE_PILL_NAME = "State pill";

/** The four parts of the base State layer (round two, section 13.4), each
 * reading one piece of the state line in One Look's own type for it. Fixed,
 * so a rebuild writes the same document. */
export const BASE_STATE_PART_IDS: Readonly<Record<TileStatePart, string>> = Object.freeze({
  figure: "BA5E0004-0000-4000-8000-0000000000F1",
  unit: "BA5E0004-0000-4000-8000-0000000000F2",
  tail: "BA5E0004-0000-4000-8000-0000000000F3",
  word: "BA5E0004-0000-4000-8000-0000000000F4",
});

/** The soft glow One Look draws behind a bare glyph (tile layers round
 * three, section 14.4): a circle shape under the icon or the photo, part of
 * the glyph slot. It is never written in `owned`: it is owned, drawn and
 * reset with the glyph, and placed by its own anchor, `base.glow`. */
export const BASE_GLOW_ID = "BA5E0000-0000-4000-8000-000000000006";
/** The glow's row name in the Layers list. */
export const BASE_GLOW_NAME = "Glow";

/** Every base layer's id with its role, in draw order bottom to top: the
 * glyph's glow, the glyph (icon or photo), the state's pill, the state, the
 * name. The glow's role reads "icon" here; a place that owns something for
 * it owns the document's glyph slot (`glyphSlotRole`). */
export const BASE_LAYER_PARTS: readonly { id: string; role: BaseLayerRole }[] = Object.freeze([
  { id: BASE_GLOW_ID, role: "icon" },
  { id: BASE_LAYER_IDS.icon, role: "icon" },
  { id: BASE_LAYER_IDS.photo, role: "photo" },
  { id: BASE_STATE_PILL_ID, role: "state" },
  { id: BASE_LAYER_IDS.state, role: "state" },
  { id: BASE_LAYER_IDS.name, role: "name" },
]);

/** The base role an element id is (the state's pill is the state's, the
 * glow the glyph's, read as "icon"), or undefined for an added layer or a
 * tap zone. Any case. */
export function baseRoleOf(elementId: string): BaseLayerRole | undefined {
  const id = elementId.toUpperCase();
  return BASE_LAYER_PARTS.find((part) => part.id === id)?.role;
}

/** A base layer's row name: the role's, or the pill's. */
export function baseLayerName(elementId: string): string | undefined {
  const id = elementId.toUpperCase();
  if (id === BASE_STATE_PILL_ID) return BASE_STATE_PILL_NAME;
  if (id === BASE_GLOW_ID) return BASE_GLOW_NAME;
  const role = baseRoleOf(id);
  return role === undefined ? undefined : BASE_LAYER_NAMES[role];
}

/** Whether an element id is the glyph's glow. Any case. */
export function isGlowId(elementId: string): boolean {
  return elementId.toUpperCase() === BASE_GLOW_ID;
}

/** The glyph slot's role in a document (section 14.5): the photo when it
 * holds the photo layer and no icon layer, else the icon. What owning the
 * glow owns. */
export function glyphSlotRole(doc: Pick<CustomComplicationConfig, "elements">): "icon" | "photo" {
  const ids = new Set(doc.elements.map((el) => el.payload.id.toUpperCase()));
  return ids.has(BASE_LAYER_IDS.photo) && !ids.has(BASE_LAYER_IDS.icon) ? "photo" : "icon";
}

/** The key an element's anchor is read under: "glow" for the glyph's glow,
 * else its base role; undefined for an added layer or a tap zone. */
export function anchorKeyOf(elementId: string): TileAnchorKey | undefined {
  return isGlowId(elementId) ? "glow" : baseRoleOf(elementId);
}

// ── what a design tile draws ─────────────────────────────────────────────

/** The parts of One Look's own tile a design takes over, which the native
 * tile then leaves undrawn (without laying anything out again): the glyph
 * (the disc, halo, symbol or photo) when the icon or the photo is owned, the
 * name when the name is, the state line (its pill, unit, tail and amber dot,
 * the big value that stands in for it and the accessory beside it) when the
 * state is. The app's `TileNativeParts`. */
export interface TileHiddenParts {
  glyph: boolean;
  name: boolean;
  state: boolean;
}

/** Whether the glyph slot is owned: the icon and the photo are one slot,
 * and the glow goes with it. */
export function glyphOwned(owned: readonly BaseLayerRole[]): boolean {
  return owned.includes("icon") || owned.includes("photo");
}

/** The native parts a design hides: exactly its owned roles, whether or not
 * the owned layer is still there (a base layer the user deleted hides its
 * part and draws nothing). */
export function designHiddenParts(design: Pick<TileDesign, "owned"> | undefined): TileHiddenParts {
  const owned = design?.owned ?? [];
  return { glyph: glyphOwned(owned), name: owned.includes("name"), state: owned.includes("state") };
}

/** Whether a design draws this element from its document: an owned base
 * layer, an added layer or a tap zone. A base layer that still follows the
 * simple settings is never drawn from the document: the native tile draws
 * that part. */
export function designDrawsElement(owned: readonly BaseLayerRole[], el: Element): boolean {
  const role = baseRoleOf(el.payload.id);
  if (role === undefined) return true;
  return role === "icon" || role === "photo" ? glyphOwned(owned) : owned.includes(role);
}

/** The design's document with only the layers it draws (`designDrawsElement`),
 * in draw order: what is compiled into its template and resolved on screen.
 * A copy; the stored document keeps every layer. */
export function drawnDesignDoc(doc: CustomComplicationConfig, owned: readonly BaseLayerRole[]): CustomComplicationConfig {
  return { ...doc, elements: doc.elements.filter((el) => designDrawsElement(owned, el)) };
}

/**
 * The drawn layer drawn in the under pass (round four, section 15.1): the
 * base Glow element when it is the first drawing (non tap) element of the
 * drawn document, else undefined. The under pass draws it where the native
 * halo draws, under the native state, pill and name, so an unmoved owned
 * glow over a native state is the plain tile's. A Glow moved up the list, or
 * an added layer put under it, leaves no under layer: everything then draws
 * over the native parts in list order. A hidden first Glow still counts and
 * draws nothing.
 */
export function designUnderLayerId(drawnDoc: Pick<CustomComplicationConfig, "elements">): string | undefined {
  const first = drawnDoc.elements.find((el) => el.kind !== "tap");
  return first !== undefined && isGlowId(first.payload.id) ? first.payload.id : undefined;
}

/** The layer kinds a tile may hold, in the + Add layer menu's order. */
export const TILE_LAYER_KINDS: readonly Element["kind"][] = ["text", "icon", "gauge", "shape", "image"];

/** Whether a tile of these spans may hold a layer of this kind: the kinds of
 * `TILE_LAYER_KINDS` and tap zones on any tile, a chart only on a large tile
 * and only once tiles draw charts, nothing else. */
export function tileLayerKindAllowed(kind: Element["kind"], colSpan: number, rowSpan: number): boolean {
  if (kind === "tap" || TILE_LAYER_KINDS.includes(kind)) return true;
  if (kind === "chart") return TILE_CHARTS_DRAWN && colSpan >= TILE_CHART_MIN_COLUMNS && rowSpan >= TILE_CHART_MIN_ROWS;
  return false;
}

// ── which tiles have layers ──────────────────────────────────────────────

/** The entity kinds that draw live content of their own, and the removed
 * macro kind: no layers. The app kinds (`VIRTUAL_TILE_KINDS`) have none
 * either. */
const KINDS_WITHOUT_LAYERS: ReadonlySet<string> = new Set([
  "camera", "media_player", "remote", "weather", "calendar", "todo", "image",
  "assist_satellite", "conversation", "stt", "tts", "wake_word", "macro",
]);

/** Whether a tile is made of layers: every entity tile except the kinds that
 * draw live content of their own. Section 2.1. */
export function tileHasLayersForKind(kind: string): boolean {
  if (kind === "") return false;
  if (Object.hasOwn(VIRTUAL_TILE_KINDS, kind)) return false;
  return !KINDS_WITHOUT_LAYERS.has(kind);
}

export function tileHasLayers(tile: WatchPageTile): boolean {
  return tileHasLayersForKind(tileKind(tileEntityId(tile)));
}

// ── a zone's action ──────────────────────────────────────────────────────

export type TileZonePreset = "whole" | "leftRight" | "topBottom" | "quad";

export interface TileZoneAction {
  /** A TileTapAction raw value (tile-actions.json `actions`). Entity actions
   * act on the tile's own entity, as the tile's single tap does. */
  action: string;
  /** With "triggerEntity": the entity and its mode (page-keys `triggerTarget`). */
  triggerTarget?: { entityId: string; mode: string; friendlyName?: string };
  /** With "httpAction": the id of the home library's HTTP action. */
  httpActionId?: string;
  /** With "httpAction": show the reply banner. Absent means true. */
  httpShowBanner?: boolean;
  /** With "httpAction": the banner's seconds. Absent means the default 3. */
  httpBannerSeconds?: number;
  /** Ask before running, for this zone only. Absent means no. */
  requiresConfirmation?: boolean;
}

/** A zone entry as stored, or undefined when it has no action text. Keys of
 * the wrong type are dropped. */
export function parseZoneAction(raw: unknown): TileZoneAction | undefined {
  if (!isJsonObject(raw) || typeof raw.action !== "string") return undefined;
  const out: TileZoneAction = { action: raw.action };
  const target = raw.triggerTarget;
  if (isJsonObject(target) && typeof target.entityId === "string" && typeof target.mode === "string") {
    out.triggerTarget = { entityId: target.entityId, mode: target.mode };
    if (typeof target.friendlyName === "string") out.triggerTarget.friendlyName = target.friendlyName;
  }
  if (typeof raw.httpActionId === "string") out.httpActionId = raw.httpActionId;
  if (typeof raw.httpShowBanner === "boolean") out.httpShowBanner = raw.httpShowBanner;
  if (typeof raw.httpBannerSeconds === "number" && Number.isFinite(raw.httpBannerSeconds)) out.httpBannerSeconds = raw.httpBannerSeconds;
  if (typeof raw.requiresConfirmation === "boolean") out.requiresConfirmation = raw.requiresConfirmation;
  return out;
}

/** A zone's action as written, its keys in a fixed order and the unset ones
 * left out. */
export function encodeZoneAction(action: TileZoneAction): JsonObject {
  const out: JsonObject = { action: action.action };
  if (action.triggerTarget !== undefined) {
    const t: JsonObject = { entityId: action.triggerTarget.entityId, mode: action.triggerTarget.mode };
    if (action.triggerTarget.friendlyName !== undefined) t.friendlyName = action.triggerTarget.friendlyName;
    out.triggerTarget = t;
  }
  if (action.httpActionId !== undefined) out.httpActionId = action.httpActionId;
  if (action.httpShowBanner !== undefined) out.httpShowBanner = action.httpShowBanner;
  if (action.httpBannerSeconds !== undefined) out.httpBannerSeconds = action.httpBannerSeconds;
  if (action.requiresConfirmation !== undefined) out.requiresConfirmation = action.requiresConfirmation;
  return out;
}

// ── anchors ──────────────────────────────────────────────────────────────

/**
 * Where an owned role's native part was when its base layer was built from
 * it (round two, section 13.1): the part's rect as fractions of the design
 * box and its size in reference watch points. Each device draws the role's
 * elements through a map from this to its own native part (`placeDesignDoc`
 * in `tile-anchors.ts`), so an unmoved owned part lands on the native one.
 */
export interface TileAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
  /** The glyph's point size (icon), the glyph box's side (photo and glow),
   * the fitted name size (name), or the design figure size (state). */
  size: number;
  /** The state only: the fitted size of the line shown, the unit's and the
   * tail's. */
  textSize?: number;
  unitSize?: number;
  tailSize?: number;
}

/** What an anchor is kept for: each base role, and the glyph's glow (section
 * 14.6), written `base.glow` while the glyph slot is owned. */
export type TileAnchorKey = BaseLayerRole | "glow";

export type TileAnchors = Partial<Record<TileAnchorKey, TileAnchor>>;

/** An anchor key as `design.anchors` writes it ("base.glow"). */
function anchorString(key: TileAnchorKey): string {
  return `base.${key}`;
}

const positiveNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const finiteNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** One anchor entry as stored, or undefined when it is not usable: finite
 * `x`, `y`, a positive `width`, `height` and `size`, and for the state a
 * positive `textSize`, `unitSize` and `tailSize`. Unknown keys are dropped. */
function parseAnchor(role: TileAnchorKey, raw: unknown): TileAnchor | undefined {
  if (!isJsonObject(raw)) return undefined;
  if (!finiteNumber(raw.x) || !finiteNumber(raw.y) || !positiveNumber(raw.width) || !positiveNumber(raw.height) || !positiveNumber(raw.size)) return undefined;
  const out: TileAnchor = { x: raw.x, y: raw.y, width: raw.width, height: raw.height, size: raw.size };
  if (role === "state") {
    if (!positiveNumber(raw.textSize) || !positiveNumber(raw.unitSize) || !positiveNumber(raw.tailSize)) return undefined;
    out.textSize = raw.textSize;
    out.unitSize = raw.unitSize;
    out.tailSize = raw.tailSize;
  }
  return out;
}

/** `design.anchors` as stored, usable entries only, by role. Anything that
 * is not an object reads as none; a bad entry is dropped (that role draws by
 * the box fit). Never makes the design unreadable. */
export function parseAnchors(raw: unknown): TileAnchors {
  const out: TileAnchors = {};
  if (!isJsonObject(raw)) return out;
  for (const [key, entry] of Object.entries(raw)) {
    const role: TileAnchorKey | undefined = key === "base.glow" ? "glow" : roleOfOwnedString(key);
    if (role === undefined) continue;
    const anchor = parseAnchor(role, entry);
    if (anchor !== undefined) out[role] = anchor;
  }
  return out;
}

/** The anchors of the owned roles, as `design.anchors` writes them: keyed by
 * `owned` string, sorted by key (`base.glow` first, while the glyph slot is
 * owned), keys `x, y, width, height, size` then for the state `textSize,
 * unitSize, tailSize`. Undefined when no owned role has one, so the key is
 * left out. */
export function encodeAnchors(anchors: TileAnchors, owned: readonly BaseLayerRole[]): JsonObject | undefined {
  const out: JsonObject = {};
  const keys: TileAnchorKey[] = [...(glyphOwned(owned) ? ["glow" as const] : []), ...sortRoles(owned)];
  for (const role of keys) {
    const a = anchors[role];
    if (a === undefined) continue;
    const entry: JsonObject = { x: a.x, y: a.y, width: a.width, height: a.height, size: a.size };
    if (role === "state") {
      if (a.textSize === undefined || a.unitSize === undefined || a.tailSize === undefined) continue;
      entry.textSize = a.textSize;
      entry.unitSize = a.unitSize;
      entry.tailSize = a.tailSize;
    }
    out[anchorString(role)] = entry;
  }
  return Object.keys(out).length === 0 ? undefined : out;
}

/** The anchors of the owned roles only, the glow's while the glyph slot is
 * owned. */
export function ownedAnchors(anchors: TileAnchors, owned: readonly BaseLayerRole[]): TileAnchors {
  const out: TileAnchors = {};
  for (const role of owned) if (anchors[role] !== undefined) out[role] = anchors[role];
  if (glyphOwned(owned) && anchors.glow !== undefined) out.glow = anchors.glow;
  return out;
}

// ── reading the key ──────────────────────────────────────────────────────

export interface TileDesign {
  v: 1;
  /** The layers, parsed. */
  doc: CustomComplicationConfig;
  owned: BaseLayerRole[];
  /** Each role's anchor (round two, section 13.1). Read and written for the
   * owned roles only; while a design is edited it also holds the fresh
   * anchors of the roles not owned (`designForEdit`), so the write that
   * owns one keeps the anchor built with the layer it owns. */
  anchors: TileAnchors;
  /** By tap layer id, upper case. */
  zones: Record<string, TileZoneAction>;
  template?: string;
}

/** The design as stored, parsed, whatever the tile's kind; undefined when it
 * is absent or does not read (not an object, another version, a document
 * the parser refuses). */
export function parseTileDesign(raw: unknown): TileDesign | undefined {
  if (!isJsonObject(raw) || raw.v !== TILE_DESIGN_VERSION) return undefined;
  let doc: CustomComplicationConfig;
  try {
    doc = parseConfig(raw.doc);
  } catch {
    return undefined;
  }
  const owned: BaseLayerRole[] = [];
  if (Array.isArray(raw.owned)) {
    for (const value of raw.owned) {
      const role = roleOfOwnedString(value);
      if (role !== undefined && !owned.includes(role)) owned.push(role);
    }
  }
  const zones: Record<string, TileZoneAction> = {};
  if (isJsonObject(raw.zones)) {
    for (const [id, entry] of Object.entries(raw.zones)) {
      const action = parseZoneAction(entry);
      if (action !== undefined) zones[id.toUpperCase()] = action;
    }
  }
  const sorted = sortRoles(owned);
  const design: TileDesign = { v: TILE_DESIGN_VERSION, doc, owned: sorted, anchors: ownedAnchors(parseAnchors(raw.anchors), sorted), zones };
  if (typeof raw.template === "string") design.template = raw.template;
  return design;
}

/** A tile's design, or undefined when it has none, it does not read, or the
 * tile's kind has no layers: in each case the tile draws plain. */
export function readTileDesign(tile: WatchPageTile): TileDesign | undefined {
  if (!tileHasLayers(tile)) return undefined;
  return parseTileDesign(tile[TILE_DESIGN_KEY]);
}

/** Roles in `BASE_LAYER_ROLES` order, as `owned` is written sorted by its
 * strings: "base.icon", "base.name", "base.photo", "base.state". */
export function sortRoles(roles: readonly BaseLayerRole[]): BaseLayerRole[] {
  return [...new Set(roles)].sort((a, b) => (ownedString(a) < ownedString(b) ? -1 : ownedString(a) > ownedString(b) ? 1 : 0));
}

// ── the normal form ──────────────────────────────────────────────────────

/**
 * A design's document in the panel's normal form (section 1.4), a copy: the
 * rectangular placements folded into their layers and every other family's
 * layout gone, one rectangular layout from `defaultLayout()`, the shape
 * `["rectangular"]`, no inline, control, pages, link, hidden flag, notes or
 * groups, each tap layer doing nothing itself (its action is the zone's)
 * with no attachment and no rotation, slot 0, no data sources, and the
 * schema version the document needs. Written before every write and every
 * comparison.
 */
export function normalizeDesignDoc(doc: CustomComplicationConfig): CustomComplicationConfig {
  const copy = structuredClone(doc);
  const elements = elementsFor(copy, TILE_DESIGN_FAMILY).map((el) => {
    const next = structuredClone(el);
    delete next.payload.groupId;
    if (next.kind === "tap") {
      const p = next.payload;
      p.action = { type: "none" };
      delete p.attachedTo;
      delete p.outset;
      delete p.openPageId;
      delete p.openPageName;
      p.frame = { ...p.frame, rotationDegrees: 0 };
    }
    return next;
  });
  const out: CustomComplicationConfig = {
    schemaVersion: 0,
    id: copy.id,
    name: copy.name,
    values: copy.values,
    slotIndex: 0,
    elements,
    supportedFamilies: [TILE_DESIGN_FAMILY],
    perFamily: { [TILE_DESIGN_FAMILY]: defaultLayout() },
    dataSources: [],
    tapAction: { type: "none" },
  };
  out.schemaVersion = schemaVersionFor(out);
  return out;
}

// ── the template key ─────────────────────────────────────────────────────

/** The key a tile's template is sent and answered under (`template.<key>`):
 * `tile_` and the FNV-1a 64 hash of its text, as the apps key it. */
export function tileTemplateKey(template: string): string {
  return TILE_TEMPLATE_KEY_PREFIX + fnv1a64Hex(template);
}

/** The key the app sends a Show when template under. */
export function showWhenTemplateKey(template: string): string {
  return "show_" + fnv1a64Hex(template);
}

/** A string's length in Unicode code points, as Python's `len` and Swift's
 * `unicodeScalars.count` count it. */
export function codePoints(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

// ── the budget ───────────────────────────────────────────────────────────

/** A tile's Show when template as the app sends it: non blank, at most the
 * delta's 4096 code points. */
function showTemplateOf(tile: WatchPageTile): string | undefined {
  const raw = tile.showWhenTemplate;
  return typeof raw === "string" && raw.trim() !== "" && codePoints(raw) <= TILE_TEMPLATE_MAX_CHARS ? raw : undefined;
}

/** A tile's stored design template, when it has a non blank one. Read off
 * the raw key the way the integration counts it (`template_budget`). */
function designTemplateOf(tile: WatchPageTile): string | undefined {
  const design = tile[TILE_DESIGN_KEY];
  if (!isJsonObject(design)) return undefined;
  const t = design.template;
  return typeof t === "string" && t.trim() !== "" ? t : undefined;
}

/** The delta template keys one page's tiles send, as the app keys them:
 * `show_<hash>` for each Show when template and `tile_<hash>` for each
 * design's template. Tiles with the same text share a key. */
export function pageTemplateKeys(page: WatchPage): Set<string> {
  const keys = new Set<string>();
  for (const tile of watchPageTiles(page)) {
    const show = showTemplateOf(tile);
    if (show !== undefined) keys.add(showWhenTemplateKey(show));
    const design = designTemplateOf(tile);
    if (design !== undefined) keys.add(tileTemplateKey(design));
  }
  return keys;
}

/** The distinct delta templates over every page of the document: what one
 * device that shows every page would send, against `DELTA_MAX_TEMPLATES`.
 * The integration's `template_budget` counts the same. */
export function documentTemplateCount(document: WatchPagesDocument): number {
  const keys = new Set<string>();
  for (const page of watchPagesOf(document)) for (const key of pageTemplateKeys(page)) keys.add(key);
  return keys.size;
}

// ── problems ─────────────────────────────────────────────────────────────

/** The design as compact UTF-8 JSON, in bytes. */
export function designBytes(design: unknown): number {
  return new TextEncoder().encode(JSON.stringify(design)).length;
}

/**
 * What would make a save of this tile's design wrong, as sentences that
 * start with the key ("design has 9 layers; the limit is 8."), or an empty
 * list. A tile with no design has none. Checked: an object, a kind with
 * layers, version 1, a document that reads, the byte, layer and zone caps,
 * layer kinds a tile may hold, and the template's length.
 */
export function tileDesignProblems(tile: WatchPageTile): string[] {
  const raw = tile[TILE_DESIGN_KEY];
  if (raw === undefined || raw === null) return [];
  if (!isJsonObject(raw)) return ["design is not an object."];
  const problems: string[] = [];
  if (!tileHasLayers(tile)) problems.push("design is set on a tile whose kind has no layers.");
  const bytes = designBytes(raw);
  if (bytes > TILE_DESIGN_MAX_BYTES) problems.push(`design is ${bytes} bytes; the limit is ${TILE_DESIGN_MAX_BYTES}.`);
  if (raw.v !== TILE_DESIGN_VERSION) {
    problems.push(`design.v must be ${TILE_DESIGN_VERSION}.`);
    return problems;
  }
  const design = parseTileDesign(raw);
  if (design === undefined) {
    problems.push("design.doc cannot be read.");
    return problems;
  }
  const elements = design.doc.elements;
  const layers = elements.filter((el) => el.kind !== "tap").length;
  const zones = elements.length - layers;
  if (layers > TILE_DESIGN_MAX_LAYERS) problems.push(`design has ${layers} layers; the limit is ${TILE_DESIGN_MAX_LAYERS}.`);
  if (zones > TILE_DESIGN_MAX_ZONES) problems.push(`design has ${zones} tap zones; the limit is ${TILE_DESIGN_MAX_ZONES}.`);
  const g = tileGeometry(tile);
  const refused = [...new Set(elements.map((el) => el.kind).filter((kind) => !tileLayerKindAllowed(kind, g.colSpan, g.rowSpan)))];
  for (const kind of refused) problems.push(`design has a ${kind} layer, which a tile cannot draw.`);
  if (design.template !== undefined) {
    const chars = codePoints(design.template);
    if (chars > TILE_TEMPLATE_MAX_CHARS) problems.push(`design's values need ${chars} of ${TILE_TEMPLATE_MAX_CHARS} characters.`);
  }
  return problems;
}

/**
 * What would make a save of this tile's `iconGlow` wrong (section 14.9), as
 * sentences that start with the key, or an empty list; the integration's
 * `_check_icon_glow` refuses the same. Absent or null is no setting. Ranges
 * and colour forms are not checked: the readers clamp and fall back.
 */
export function tileGlowProblems(tile: WatchPageTile): string[] {
  const raw = tile.iconGlow;
  if (raw === undefined || raw === null) return [];
  if (!isJsonObject(raw)) return ["iconGlow must be an object."];
  const problems: string[] = [];
  if (raw.mode !== undefined && raw.mode !== "auto" && raw.mode !== "on" && raw.mode !== "off") problems.push('iconGlow.mode must be "auto", "on" or "off".');
  for (const key of ["size", "brightness"] as const) {
    const v = raw[key];
    if (v !== undefined && !(typeof v === "number" && Number.isFinite(v))) problems.push(`iconGlow.${key} must be a number.`);
  }
  if (raw.color !== undefined && typeof raw.color !== "string") problems.push("iconGlow.color must be a string.");
  return problems;
}
