// A tile's layers (`design`): reading, editing and writing them, the base
// layers kept in step with the simple settings, tap zones, and the watch
// budget. Everything here is pure: a tile or a document in, a new one out,
// nothing changed in place and nothing drawn.
//
// The rules, in short (app repo docs/tile_layers_contract_2026-10.md):
//
// - A tile nobody changed has no `design`; its base layers are made on the
//   fly (`baseLayers`). The first change saves the whole document.
// - A base layer edited directly is owned (`owned`): the simple settings no
//   longer touch it. Every other base layer is rebuilt from the simple keys
//   whenever they change (`syncTileDesigns`), so there is one copy of each
//   value.
// - Reset one layer gives it back to the simple settings; Reset all removes
//   the design. A design that is only base layers as they would be built
//   now, with nothing owned and no zones, is dropped on write.
// - Tap zones are tap layers; each one's action is in `zones` under its id.

import { compile } from "../compiler.js";
import {
  type CustomComplicationConfig,
  type Element,
  type NormalizedFrame,
  encodeConfig,
  newElement,
  newId,
} from "../model.js";
import { type JsonObject, type WatchPage, type WatchPageTile, type WatchPagesDocument, isJsonObject, tileEntityId, tileGeometry, watchPageTiles, watchPagesOf } from "./model.js";
import { oneLookDrawnSize, oneLookGridUnit } from "./one-look/metrics.js";
import { watchSingleTapSettings } from "./tile-settings-model.js";
import { type BaseLayerContext, baseLayersByRole, baseLayersDocument, designBoxFor, tileValuesFor } from "./tile-base-layers.js";
import {
  type BaseLayerRole,
  type TileDesign,
  type TileZoneAction,
  type TileZonePreset,
  BASE_LAYER_IDS,
  TILE_DESIGN_KEY,
  TILE_DESIGN_MAX_LAYERS,
  TILE_DESIGN_MAX_ZONES,
  TILE_DESIGN_VERSION,
  TILE_LAYER_KINDS,
  TILE_ZONE_MIN_POINTS,
  baseRoleOf,
  encodeZoneAction,
  normalizeDesignDoc,
  ownedString,
  readTileDesign,
  sortRoles,
  tileHasLayers,
} from "./tile-design-core.js";

export * from "./tile-design-core.js";
export type { BaseLayerContext } from "./tile-base-layers.js";

// ── the design box ───────────────────────────────────────────────────────

/** A tile's design box: its drawn size on a 46 mm watch (208 pt screen)
 * under One Look, `17.25*colSpan-3` by `17.25*rowSpan-3`. 3x3 is
 * 48.75 square, 4x4 66, 6x4 100.5 by 66, 12x4 204 by 66. */
export function tileDesignBox(colSpan: number, rowSpan: number): { width: number; height: number } {
  return designBoxFor(colSpan, rowSpan);
}

// ── status and counts ────────────────────────────────────────────────────

/** How a layer row reads: a base layer following the simple settings, one
 * changed here, an added layer, or a tap zone. */
export type LayerStatus = "follows" | "changed" | "added" | "zone";

export interface DesignSummary {
  layers: number;
  changed: number;
  added: number;
  zones: number;
}

const GLYPH_ROLES: readonly BaseLayerRole[] = ["icon", "photo"];

function isGlyph(role: BaseLayerRole): boolean {
  return GLYPH_ROLES.includes(role);
}

export function layerStatus(design: TileDesign | undefined, elementId: string): LayerStatus {
  const id = elementId.toUpperCase();
  const el = design?.doc.elements.find((e) => e.payload.id.toUpperCase() === id);
  if (el?.kind === "tap") return "zone";
  const role = baseRoleOf(id);
  if (role === undefined) return "added";
  return design !== undefined && design.owned.includes(role) ? "changed" : "follows";
}

/** The counts a tile row and its Layers section show. A tile with no design
 * counts its base layers as they would be built, none changed. A base layer
 * deleted in the layer list counts as changed. */
export function designSummary(design: TileDesign | undefined, tile: WatchPageTile, ctx: BaseLayerContext = {}): DesignSummary {
  if (design === undefined) {
    return { layers: tileHasLayers(tile) ? baseLayersByRole(tile, ctx).size : 0, changed: 0, added: 0, zones: 0 };
  }
  const elements = design.doc.elements;
  const zones = elements.filter((el) => el.kind === "tap").length;
  const added = elements.filter((el) => el.kind !== "tap" && baseRoleOf(el.payload.id) === undefined).length;
  return { layers: elements.length - zones, changed: design.owned.length, added, zones };
}

// ── the normal form and writing ──────────────────────────────────────────

/** The design in normal form (section 1.4): the document normalised, tap
 * layers without a zone entry gone, zone entries without a tap layer gone,
 * `owned` sorted. The template is not part of it: `encodeTileDesign`
 * compiles it. */
function normalDesign(design: TileDesign): TileDesign {
  const doc = normalizeDesignDoc(design.doc);
  const zones: Record<string, TileZoneAction> = {};
  const byId = new Map(Object.entries(design.zones).map(([id, action]) => [id.toUpperCase(), action]));
  doc.elements = doc.elements.filter((el) => {
    if (el.kind !== "tap") return true;
    const action = byId.get(el.payload.id.toUpperCase());
    if (action === undefined) return false;
    zones[el.payload.id.toUpperCase()] = action;
    return true;
  });
  const out: TileDesign = { v: TILE_DESIGN_VERSION, doc, owned: sortRoles(design.owned), zones };
  const template = compile(doc).document;
  if (template !== undefined) out.template = template;
  return out;
}

/** The design as the tile stores it, in normal form with its template
 * compiled: keys `v`, `owned`, `zones`, `template` (when anything is
 * computed) and `doc`. */
export function encodeTileDesign(design: TileDesign): JsonObject {
  const normal = normalDesign(design);
  const zones: JsonObject = {};
  for (const [id, action] of Object.entries(normal.zones)) zones[id] = encodeZoneAction(action);
  const out: JsonObject = { v: TILE_DESIGN_VERSION, owned: normal.owned.map(ownedString), zones };
  if (normal.template !== undefined) out.template = normal.template;
  out.doc = encodeConfig(normal.doc);
  return out;
}

/** JSON with every object's keys sorted, for comparing two values that may
 * have been built in different orders. */
function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) => {
    if (!isJsonObject(v)) return v;
    const out: JsonObject = {};
    for (const k of Object.keys(v).sort()) out[k] = v[k];
    return out;
  });
}

/** Each element of a document as written, by its id upper case. */
function encodedElements(doc: CustomComplicationConfig): Map<string, string> {
  const out = new Map<string, string>();
  const elements = encodeConfig(normalizeDesignDoc(doc)).elements;
  if (!Array.isArray(elements)) return out;
  for (const el of elements) {
    const payload = isJsonObject(el) ? el.payload : undefined;
    if (isJsonObject(payload) && typeof payload.id === "string") out.set(payload.id.toUpperCase(), stableJson(el));
  }
  return out;
}

/** Whether a design is the tile's base layers exactly as they would be built
 * now, with nothing owned and no zones: the tile needs no design. */
function isPureBase(tile: WatchPageTile, design: TileDesign, ctx: BaseLayerContext): boolean {
  if (design.owned.length > 0) return false;
  const elements = design.doc.elements;
  if (elements.some((el) => el.kind === "tap")) return false;
  const fresh = baseLayersDocument(tile, ctx);
  if (fresh.elements.length !== elements.length) return false;
  const now = encodedElements(design.doc);
  const built = encodedElements(fresh);
  return elements.every((el, i) => {
    const id = el.payload.id.toUpperCase();
    return fresh.elements[i]?.payload.id.toUpperCase() === id && now.get(id) === built.get(id);
  });
}

function withoutDesign(tile: WatchPageTile): WatchPageTile {
  if (!Object.hasOwn(tile, TILE_DESIGN_KEY)) return tile;
  const { [TILE_DESIGN_KEY]: _gone, ...rest } = tile;
  return rest;
}

/**
 * The tile with this design written in normal form, its document named and
 * identified after the tile; undefined removes the design. A design that is
 * only the tile's base layers as they would be built now (nothing owned, no
 * zones) is removed too, so an untouched tile never carries one. A tile
 * whose kind has no layers is returned as it is.
 */
export function withDesign(tile: WatchPageTile, design: TileDesign | undefined, ctx: BaseLayerContext): WatchPageTile {
  if (design === undefined) return withoutDesign(tile);
  if (!tileHasLayers(tile)) return tile;
  const doc = normalizeDesignDoc(design.doc);
  if (typeof tile.id === "string" && tile.id !== "") doc.id = tile.id.toUpperCase();
  doc.name = tileValuesFor(tile, ctx).name;
  const normal = normalDesign({ ...design, doc });
  if (isPureBase(tile, normal, ctx)) return withoutDesign(tile);
  return { ...tile, [TILE_DESIGN_KEY]: encodeTileDesign(normal) };
}

/** The tile's design to edit: the one it has, or its base layers fresh,
 * nothing owned and no zones (not yet saved). */
export function designForEdit(tile: WatchPageTile, ctx: BaseLayerContext): TileDesign {
  const existing = readTileDesign(tile);
  if (existing !== undefined) return existing;
  const doc = baseLayersDocument(tile, ctx);
  const design: TileDesign = { v: TILE_DESIGN_VERSION, doc, owned: [], zones: {} };
  const template = compile(doc).document;
  if (template !== undefined) design.template = template;
  return design;
}

/** `after` with every base role owned whose layer differs from `before`'s
 * or is gone from it. */
export function ownChangedBaseLayers(before: TileDesign, after: TileDesign): TileDesign {
  const was = encodedElements(before.doc);
  const now = encodedElements(after.doc);
  const owned = new Set(after.owned);
  for (const role of Object.keys(BASE_LAYER_IDS) as BaseLayerRole[]) {
    const id = BASE_LAYER_IDS[role];
    const a = was.get(id);
    const b = now.get(id);
    if (a !== b && (a !== undefined || b !== undefined)) owned.add(role);
  }
  return { ...after, owned: sortRoles([...owned]) };
}

/** A layer edit written to the tile: every base role whose layer changed or
 * went is owned, then `withDesign`. */
export function writeDesignDoc(tile: WatchPageTile, before: TileDesign, nextDoc: CustomComplicationConfig, ctx: BaseLayerContext): WatchPageTile {
  return withDesign(tile, ownChangedBaseLayers(before, { ...before, doc: nextDoc }), ctx);
}

// ── rebuilding the base layers ───────────────────────────────────────────

/** Where a base role sits in the draw order: the glyph at the bottom, then
 * the state, then the name. */
const ROLE_RANK: Readonly<Record<BaseLayerRole, number>> = { icon: 0, photo: 0, state: 1, name: 2 };

function roleOwned(design: TileDesign, role: BaseLayerRole): boolean {
  return isGlyph(role) ? design.owned.some(isGlyph) : design.owned.includes(role);
}

/** Puts a base layer in among the others at its rank: just above the
 * highest base layer under it, else just below the lowest one above it,
 * else at the bottom. Tap layers stay above every drawing layer. */
function insertAtRank(elements: Element[], el: Element, role: BaseLayerRole): void {
  const rank = ROLE_RANK[role];
  let after = -1;
  let before = -1;
  elements.forEach((e, i) => {
    const r = baseRoleOf(e.payload.id);
    if (r === undefined) return;
    if (ROLE_RANK[r] <= rank) after = i;
    else if (before < 0) before = i;
  });
  const at = after >= 0 ? after + 1 : before >= 0 ? before : 0;
  elements.splice(at, 0, el);
}

/**
 * The design with every base layer that is not owned built again from the
 * tile's simple settings as they are now: replaced where it is, removed when
 * the settings no longer make it (Show label off), put in at its rank when
 * they make it again. Owned layers (deleted ones included), added layers and
 * tap zones are untouched. The glyph is one slot: owning the icon or the
 * photo keeps either from being swapped for the other.
 */
export function rebuildBaseLayers(tile: WatchPageTile, design: TileDesign, ctx: BaseLayerContext): TileDesign {
  const fresh = baseLayersByRole(tile, ctx);
  const doc = normalizeDesignDoc(design.doc);
  const elements = [...doc.elements];
  for (const role of ["icon", "photo", "state", "name"] as const) {
    if (roleOwned(design, role)) continue;
    const id = BASE_LAYER_IDS[role];
    const at = elements.findIndex((el) => el.payload.id.toUpperCase() === id);
    const next = fresh.get(role);
    if (at >= 0) {
      if (next !== undefined) elements[at] = next;
      else elements.splice(at, 1);
    } else if (next !== undefined) {
      insertAtRank(elements, next, role);
    }
  }
  return { ...design, doc: { ...doc, elements } };
}

/** The tile with one base layer given back to the simple settings: no
 * longer owned, built again. The glyph is one slot, so resetting the icon or
 * the photo resets both. A tile with no design is returned as it is. */
export function resetBaseLayer(tile: WatchPageTile, role: BaseLayerRole, ctx: BaseLayerContext): WatchPageTile {
  const design = readTileDesign(tile);
  if (design === undefined) return tile;
  const owned = design.owned.filter((r) => (isGlyph(role) ? !isGlyph(r) : r !== role));
  // A layer moved out of its rank among the base layers is taken out first,
  // so the rebuild puts it back at its place rather than where it was moved.
  const reset = (r: BaseLayerRole) => (isGlyph(role) ? isGlyph(r) : r === role);
  const elements = design.doc.elements;
  const outOfRank = elements.some((el, i) => {
    const r = baseRoleOf(el.payload.id);
    return r !== undefined && reset(r) && !inRank(elements, i);
  });
  const doc = outOfRank ? { ...design.doc, elements: elements.filter((el) => { const r = baseRoleOf(el.payload.id); return r === undefined || !reset(r); }) } : design.doc;
  return withDesign(tile, rebuildBaseLayers(tile, { ...design, doc, owned }, ctx), ctx);
}

/** Whether the base layer at `index` sits in rank among the other base
 * layers: none under it ranks higher and none above it ranks lower. */
function inRank(elements: readonly Element[], index: number): boolean {
  const role = baseRoleOf(elements[index]!.payload.id);
  if (role === undefined) return true;
  const rank = ROLE_RANK[role];
  return elements.every((el, i) => {
    const r = baseRoleOf(el.payload.id);
    if (r === undefined || i === index) return true;
    return i < index ? ROLE_RANK[r] <= rank : ROLE_RANK[r] >= rank;
  });
}

/** The tile back to plain simple settings: no design. */
export function resetAllLayers(tile: WatchPageTile): WatchPageTile {
  return withoutDesign(tile);
}

/** A tile's keys other than its design and its place on the grid, for
 * telling a simple edit apart: a move feeds no base layer, so it never
 * rewrites one. */
function simpleKeys(tile: WatchPageTile): string {
  const { gridCol: _col, gridRow: _row, ...rest } = withoutDesign(tile);
  return stableJson(rest);
}

/**
 * The document after a simple edit, with the base layers of every tile
 * that has a design built again where the edit changed any of that tile's
 * other keys (matched by page id and tile id against `before`). Returns
 * `after` itself when nothing changes. The page editor's `edit()` runs it
 * before the draft applies, so the rebuild is in the same undo step.
 */
export function syncTileDesigns(before: WatchPagesDocument, after: WatchPagesDocument, ctx: BaseLayerContext): WatchPagesDocument {
  const old = new Map<string, WatchPageTile>();
  for (const page of watchPagesOf(before)) {
    for (const tile of watchPageTiles(page)) {
      if (typeof page.id === "string" && typeof tile.id === "string") old.set(`${page.id}\n${tile.id}`, tile);
    }
  }
  const pagesRaw = after.pages;
  if (!Array.isArray(pagesRaw)) return after;
  const allPages = watchPagesOf(after);
  let changed = false;
  const pages = pagesRaw.map((page: unknown) => {
    if (!isJsonObject(page) || !Array.isArray(page.items)) return page;
    const p = page as WatchPage;
    let pageChanged = false;
    const items = (page.items as unknown[]).map((item) => {
      if (!isJsonObject(item)) return item;
      const tile = item as WatchPageTile;
      const design = readTileDesign(tile);
      if (design === undefined || typeof p.id !== "string" || typeof tile.id !== "string") return item;
      const prior = old.get(`${p.id}\n${tile.id}`);
      if (prior === undefined || simpleKeys(prior) === simpleKeys(tile)) return item;
      // Built from no state (a renamed entity, Home Assistant not loaded),
      // the base layers would lose the state line until the next edit, so
      // they are kept as they are until the entity is back.
      const entityId = tileEntityId(tile);
      if (ctx.states === undefined || !Object.hasOwn(ctx.states, entityId)) return item;
      const pageCtx: BaseLayerContext = { ...ctx, page: p, pages: allPages };
      const next = withDesign(tile, rebuildBaseLayers(tile, design, pageCtx), pageCtx);
      if (stableJson(next) === stableJson(tile)) return item;
      pageChanged = true;
      return next;
    });
    if (!pageChanged) return page;
    changed = true;
    return { ...page, items };
  });
  return changed ? { ...after, pages } : after;
}

// ── adding, removing and moving layers ───────────────────────────────────

function isTap(el: Element): boolean {
  return el.kind === "tap";
}

/** Drawing layers first, tap zones above them, each in its own order. */
function tapsOnTop(elements: Element[]): Element[] {
  return [...elements.filter((el) => !isTap(el)), ...elements.filter(isTap)];
}

/** A tap zone's row name: "Tap zone 1", "Tap zone 2"... */
function zoneName(index: number): string {
  return `Tap zone ${index + 1}`;
}

/**
 * The design with a new layer of this kind on top of the drawing layers (a
 * tap zone on top of everything, doing nothing yet), and its id. Refused,
 * with the design unchanged and id "", for a kind a tile cannot hold and
 * over the layer or zone cap.
 */
export function addLayer(design: TileDesign, kind: Element["kind"]): { design: TileDesign; id: string } {
  const elements = design.doc.elements;
  const taps = elements.filter(isTap).length;
  const layers = elements.length - taps;
  if (kind === "tap") {
    if (taps >= TILE_DESIGN_MAX_ZONES) return { design, id: "" };
  } else if (!TILE_LAYER_KINDS.includes(kind) || layers >= TILE_DESIGN_MAX_LAYERS) {
    return { design, id: "" };
  }
  const el = newElement(kind);
  if (el.kind === "tap") {
    el.payload.action = { type: "none" };
    el.payload.name = zoneName(taps);
  } else if (el.kind === "image") {
    // A tile's picture is inline or its own entity's: no camera picker.
    el.payload.source = "inline";
    el.payload.entity = { entityId: "", displayName: "", domain: "" };
  }
  const id = el.payload.id.toUpperCase();
  const next = kind === "tap"
    ? [...elements, el]
    : [...elements.filter((e) => !isTap(e)), el, ...elements.filter(isTap)];
  const zones = kind === "tap" ? { ...design.zones, [id]: { action: "none" } } : design.zones;
  return { design: { ...design, doc: { ...design.doc, elements: next }, zones }, id };
}

/** The design without one layer: a base layer goes and is owned (a rebuild
 * does not bring it back; Reset does), an added layer goes, a tap zone goes
 * with its entry. */
export function removeLayer(design: TileDesign, elementId: string): TileDesign {
  const id = elementId.toUpperCase();
  const el = design.doc.elements.find((e) => e.payload.id.toUpperCase() === id);
  if (el === undefined) return design;
  const elements = design.doc.elements.filter((e) => e !== el);
  const role = baseRoleOf(id);
  const owned = role === undefined ? design.owned : sortRoles([...design.owned, role]);
  let zones = design.zones;
  if (isTap(el)) {
    zones = { ...design.zones };
    for (const key of Object.keys(zones)) if (key.toUpperCase() === id) delete zones[key];
  }
  return { ...design, doc: { ...design.doc, elements }, owned, zones };
}

/** The design with one layer a step up the draw order (1, toward the top)
 * or down (-1). A drawing layer moves among drawing layers and a tap zone
 * among tap zones, so tap zones stay above everything they cover. A base
 * layer moved is owned, as any other change to it is, so its row says it
 * was changed and Reset puts it back at its place. */
export function moveLayer(design: TileDesign, elementId: string, dir: -1 | 1): TileDesign {
  const id = elementId.toUpperCase();
  const elements = tapsOnTop(design.doc.elements);
  const at = elements.findIndex((e) => e.payload.id.toUpperCase() === id);
  if (at < 0) return design;
  const to = at + dir;
  const target = elements[to];
  if (target === undefined || isTap(target) !== isTap(elements[at]!)) return design;
  [elements[at], elements[to]] = [elements[to]!, elements[at]!];
  const role = baseRoleOf(id);
  const owned = role === undefined || design.owned.includes(role) ? design.owned : sortRoles([...design.owned, role]);
  return { ...design, doc: { ...design.doc, elements }, owned };
}

// ── tap zones ────────────────────────────────────────────────────────────

/** The tap zones in draw order, each with its frame and action (none when
 * it has no entry). */
export function zonesOf(design: TileDesign | undefined): { id: string; frame: NormalizedFrame; action: TileZoneAction }[] {
  if (design === undefined) return [];
  const byId = new Map(Object.entries(design.zones).map(([id, action]) => [id.toUpperCase(), action]));
  return design.doc.elements.filter(isTap).map((el) => {
    const id = el.payload.id.toUpperCase();
    return { id, frame: el.payload.frame, action: byId.get(id) ?? { action: "none" } };
  });
}

/** The design with one zone's action set. A zone the design does not have
 * is left alone. */
export function setZoneAction(design: TileDesign, zoneId: string, action: TileZoneAction): TileDesign {
  const id = zoneId.toUpperCase();
  if (!design.doc.elements.some((el) => isTap(el) && el.payload.id.toUpperCase() === id)) return design;
  const zones: Record<string, TileZoneAction> = {};
  for (const [key, value] of Object.entries(design.zones)) if (key.toUpperCase() !== id) zones[key] = value;
  zones[id] = action;
  return { ...design, zones };
}

const frame = (x: number, y: number, width: number, height: number): NormalizedFrame => ({ x, y, width, height, rotationDegrees: 0 });

/** Each preset's zones, in order (section 6.2). */
export const TILE_ZONE_PRESET_FRAMES: Readonly<Record<TileZonePreset, readonly NormalizedFrame[]>> = {
  whole: [],
  leftRight: [frame(0, 0, 0.5, 1), frame(0.5, 0, 0.5, 1)],
  topBottom: [frame(0, 0, 1, 0.5), frame(0, 0.5, 1, 0.5)],
  quad: [frame(0, 0, 0.5, 0.5), frame(0.5, 0, 0.5, 0.5), frame(0, 0.5, 0.5, 0.5), frame(0.5, 0.5, 0.5, 0.5)],
};

/** What a tile's first zone starts with: its own single tap, with its
 * trigger target and ask first when it has them. */
function singleTapZone(tile: WatchPageTile): TileZoneAction {
  const zone: TileZoneAction = { action: watchSingleTapSettings(tile).resolved };
  const target = tile.triggerTarget;
  if (zone.action === "triggerEntity" && isJsonObject(target) && typeof target.entityId === "string" && typeof target.mode === "string") {
    zone.triggerTarget = { entityId: target.entityId, mode: target.mode };
    if (typeof target.friendlyName === "string") zone.triggerTarget.friendlyName = target.friendlyName;
  }
  if (tile.requiresConfirmation === true) zone.requiresConfirmation = true;
  return zone;
}

/**
 * The design split into a preset's zones, above every drawing layer. The
 * zones that remain keep their ids and actions by index; a new first zone
 * takes the tile's single tap, every other new one does nothing. Whole
 * removes every zone, so the tile's own single tap applies again.
 */
export function applyZonePreset(tile: WatchPageTile, design: TileDesign, preset: TileZonePreset): TileDesign {
  const current = zonesOf(design);
  const frames = TILE_ZONE_PRESET_FRAMES[preset];
  const zones: Record<string, TileZoneAction> = {};
  const taps: Element[] = frames.map((f, i) => {
    const kept = current[i];
    const el = newElement("tap");
    if (el.kind !== "tap") throw new Error("unreachable");
    const id = kept?.id ?? el.payload.id.toUpperCase();
    el.payload.id = id;
    el.payload.action = { type: "none" };
    el.payload.name = zoneName(i);
    el.payload.frame = { ...f };
    zones[id] = kept?.action ?? (i === 0 ? singleTapZone(tile) : { action: "none" });
    return el;
  });
  const drawing = design.doc.elements.filter((el) => !isTap(el));
  return { ...design, doc: { ...design.doc, elements: [...drawing, ...taps] }, zones };
}

const sameFrame = (a: NormalizedFrame, b: NormalizedFrame): boolean =>
  [a.x - b.x, a.y - b.y, a.width - b.width, a.height - b.height].every((d) => Math.abs(d) < 0.0005);

/** The preset the zones match, in order, or "custom". No zones is whole. */
export function zonePresetOf(design: TileDesign | undefined): TileZonePreset | "custom" {
  const frames = zonesOf(design).map((z) => z.frame);
  for (const preset of Object.keys(TILE_ZONE_PRESET_FRAMES) as TileZonePreset[]) {
    const want = TILE_ZONE_PRESET_FRAMES[preset];
    if (want.length === frames.length && want.every((f, i) => sameFrame(f, frames[i]!))) return preset;
  }
  return "custom";
}

/** Whether every zone of a preset is at least 40 pt on its short side on a
 * watch `watchWidth` points wide (the smallest the page is on; 208 when
 * none is known), at the tile's spans. Whole is always allowed. */
export function zonePresetAllowed(preset: TileZonePreset, colSpan: number, rowSpan: number, watchWidth: number): boolean {
  const drawn = oneLookDrawnSize(Math.max(1, colSpan), Math.max(1, rowSpan), oneLookGridUnit(watchWidth, "watch"), "watch");
  return TILE_ZONE_PRESET_FRAMES[preset].every((f) => Math.min(f.width * drawn.width, f.height * drawn.height) >= TILE_ZONE_MIN_POINTS - 1e-9);
}

/** The zone a point in the tile's box lands in, topmost first and hidden
 * zones skipped, or undefined when the tap is the whole tile's. The
 * preview's mirror of the app's `TileDesign.zone(at:)`. */
export function tileZoneHit(design: TileDesign, box: { width: number; height: number }, point: { x: number; y: number }): string | undefined {
  if (!(box.width > 0) || !(box.height > 0)) return undefined;
  const x = point.x / box.width;
  const y = point.y / box.height;
  const taps = design.doc.elements.filter(isTap);
  for (let i = taps.length - 1; i >= 0; i--) {
    const el = taps[i]!;
    if (el.payload.isHidden) continue;
    const f = el.payload.frame;
    if (x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height) return el.payload.id.toUpperCase();
  }
  return undefined;
}

// ── the simple settings that move into a layer ───────────────────────────

/** The simple keys a base layer takes over once it is owned (section 3's
 * layer rows). The name field and the state's content keys are not here:
 * they stay live through `tileName` and `tileState`. */
export const SIMPLE_KEY_ROLES: Readonly<Record<string, BaseLayerRole>> = Object.freeze({
  icon: "icon",
  usesStateIcons: "icon",
  stateIcons: "icon",
  iconSizeOverride: "icon",
  iconShadow: "icon",
  usePersonPhoto: "photo",
  stateValueLabelStyle: "state",
  badgeFontSizeOverride: "state",
  statusTextShadow: "state",
  showLabel: "name",
  labelFontSizeOverride: "name",
  labelFontWeight: "name",
  labelFontDesign: "name",
  labelColorHex: "name",
  labelShadow: "name",
});

/** Which owned role takes a simple key away from the simple settings, for
 * "Changed in the X layer". The icon keys and the photo switch belong to the
 * glyph: whichever of the icon and the photo is owned. */
export function settingOwnerRole(design: TileDesign | undefined, key: string): BaseLayerRole | undefined {
  if (design === undefined || !Object.hasOwn(SIMPLE_KEY_ROLES, key)) return undefined;
  const role = SIMPLE_KEY_ROLES[key]!;
  if (isGlyph(role)) {
    if (design.owned.includes(role)) return role;
    return design.owned.find(isGlyph);
  }
  return design.owned.includes(role) ? role : undefined;
}

/** The tile's spans, for callers that hold only a tile. */
export function tileSpans(tile: WatchPageTile): { colSpan: number; rowSpan: number } {
  const g = tileGeometry(tile);
  return { colSpan: g.colSpan, rowSpan: g.rowSpan };
}
