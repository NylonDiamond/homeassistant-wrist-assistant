// A tile's layers (`design`) drawn: the resolve context its layers read, the
// layout the resolver makes of them in the tile's design box, and the
// pictures the page editor draws from that layout (the tile's content on the
// stage, a layer's thumbnail in the Tiles list, the outline of a picked
// layer). Plain functions of a tile and what the picture already has (the
// states, the symbols, the template renders); nothing here edits.
//
// A design is drawn only under One Look: the native tile exactly as it is,
// less the parts the design owns (`designHiddenParts`, left undrawn with
// nothing laid out again), and the layers the design draws itself (its owned
// base layers and added layers, `drawnDesignDoc`) over the rest. A base layer
// that follows the simple settings is never drawn from the document. A tile
// with no design, or one that does not read, draws as it always has.
//
// App repo docs/tile_layers_contract_2026-10.md, sections 4, 5 and 10.4.

import { html, type TemplateResult } from "lit";
import type { HassEntityState } from "../ha-api.js";
import { type Compiled, compile, parseValueDocument } from "../compiler.js";
import type { CustomComplicationConfig } from "../model.js";
import { type EntityState, type ForcedBranches, type ResolveContext, type ResolvedLayout, Resolver } from "../resolver.js";
import { type IconProvider, fitBox, renderLayerThumb, renderLayout } from "../renderer.js";
import { type WatchPage, type WatchPageTile, tileEntityId, tileGeometry } from "./model.js";
import { type WatchTemplateRender, watchTileDesignRender } from "./app-model.js";
import { tileValuesFor } from "./tile-base-layers.js";
import {
  type TileDesign,
  type TileHiddenParts,
  TILE_DESIGN_FAMILY,
  TILE_DESIGN_KEY,
  designHiddenParts,
  designTemplate,
  drawnDesignDoc,
  parseTileDesign,
  tileDesignBox,
  tileHasLayers,
} from "./tile-design.js";

/** What a tile's layers are drawn from besides the tile. */
export interface TileDesignInputs {
  /** Home Assistant's states, as the picture draws them (a state being tried
   * included). */
  states?: Readonly<Record<string, HassEntityState>>;
  /** The tile's page and every page, for the tile's own words. */
  page?: WatchPage;
  pages?: readonly WatchPage[];
  icons?: IconProvider;
  /** The page's template renders (`watchTemplateRequests`), which hold each
   * design's values under its `tile_` key. */
  templates?: ReadonlyMap<string, WatchTemplateRender>;
}

/** A design read and compiled, kept by the stored object: a draw reads the
 * same tile many times, and an edit makes a new object. */
interface ReadDesign {
  design: TileDesign;
  /** Every layer compiled, for the entities they read. */
  compiled: Compiled;
  /** What the drawn layers compute: the template the apps ask for. */
  template: string | undefined;
}

const readMemo = new WeakMap<object, ReadDesign | null>();

/** A tile's design as it stores it, read and compiled, or undefined when it
 * has none, it does not read, or its kind has no layers. */
export function storedTileDesign(tile: WatchPageTile): ReadDesign | undefined {
  if (!tileHasLayers(tile)) return undefined;
  const raw = tile[TILE_DESIGN_KEY];
  if (raw === null || typeof raw !== "object") return undefined;
  const held = readMemo.get(raw);
  if (held !== undefined) return held ?? undefined;
  const design = parseTileDesign(raw);
  const out = design === undefined ? null : { design, compiled: compile(design.doc), template: designTemplate(design.doc, design.owned) };
  readMemo.set(raw, out);
  return out ?? undefined;
}

/** A design compiled (every layer, for the entities they read) and the
 * template of the layers it draws, the stored one's memo when it is that
 * one. */
function compiledOf(tile: WatchPageTile, design: TileDesign): { compiled: Compiled; template: string | undefined } {
  const stored = storedTileDesign(tile);
  if (stored !== undefined && stored.design.doc === design.doc && stored.design.owned === design.owned) return stored;
  return { compiled: compile(design.doc), template: designTemplate(design.doc, design.owned) };
}

/** One entity as the resolver reads it, from Home Assistant's state. */
export function tileEntityState(entityId: string, s: HassEntityState | undefined, iconName = ""): EntityState | undefined {
  if (s === undefined) return undefined;
  const attrs = s.attributes ?? {};
  const out: EntityState = {
    entityId,
    state: String(s.state ?? ""),
    iconName,
    domain: entityId.split(".")[0] ?? "",
  };
  if (typeof attrs.unit_of_measurement === "string") out.unitOfMeasurement = attrs.unit_of_measurement;
  if (typeof attrs.entity_picture === "string") out.entityPicture = attrs.entity_picture;
  if (out.domain === "timer") {
    out.timerState = out.state;
    if (typeof attrs.finishes_at === "string") out.finishesAt = attrs.finishes_at;
  }
  return out;
}

/** The entities a design reads: what it compiles to, every picture's
 * entity, and the tile's own. */
function entityIdsOf(tile: WatchPageTile, doc: CustomComplicationConfig, compiled: Compiled): Map<string, string> {
  const out = new Map<string, string>();
  for (const [id, ref] of compiled.entities) out.set(id, ref.iconName ?? "");
  for (const el of doc.elements) {
    if (el.kind === "image" && el.payload.entity.entityId !== "" && !out.has(el.payload.entity.entityId)) out.set(el.payload.entity.entityId, "");
  }
  const own = tileEntityId(tile);
  if (own !== "" && !out.has(own)) out.set(own, "");
  return out;
}

/**
 * The context a tile's layers resolve in: its entities from the states, its
 * computed values from the render of its template (none until one is in, as
 * on the watch), and the tile's own words for `tileState` and `tileName`.
 */
export function tileDesignResolveContext(tile: WatchPageTile, design: TileDesign, inputs: TileDesignInputs): ResolveContext {
  const { compiled, template } = compiledOf(tile, design);
  const entityStates = new Map<string, EntityState>();
  for (const [id, icon] of entityIdsOf(tile, design.doc, compiled)) {
    const state = tileEntityState(id, inputs.states?.[id], icon);
    if (state !== undefined) entityStates.set(id, state);
  }
  let templateResults = new Map<string, string>();
  if (template !== undefined) {
    const rendered = watchTileDesignRender(inputs.templates, template);
    const parsed = rendered === undefined ? undefined : parseValueDocument(rendered);
    if (parsed !== undefined) templateResults = parsed.values;
  }
  return {
    entityStates,
    templateResults,
    namedValues: design.doc.values,
    tileValues: tileValuesFor(tile, {
      ...(inputs.states === undefined ? {} : { states: inputs.states }),
      ...(inputs.page === undefined ? {} : { page: inputs.page }),
      ...(inputs.pages === undefined ? {} : { pages: inputs.pages }),
      ...(inputs.icons === undefined ? {} : { icons: inputs.icons }),
    }),
  };
}

/** A design's layers resolved in the tile's design box: every layer (for
 * the Tiles rows' thumbnails), or with `drawn` only those it draws. */
export function tileDesignLayout(tile: WatchPageTile, design: TileDesign, inputs: TileDesignInputs, forced?: ForcedBranches, drawn = false): ResolvedLayout {
  const doc = drawn ? drawnDesignDoc(design.doc, design.owned) : design.doc;
  return new Resolver(tileDesignResolveContext(tile, design, inputs), doc).resolveLayout(doc, TILE_DESIGN_FAMILY, forced);
}

/** The tile's design box, from its spans. */
export function tileBoxOf(tile: WatchPageTile): { width: number; height: number } {
  const g = tileGeometry(tile);
  return tileDesignBox(g.colSpan, g.rowSpan);
}

/** What the page editor marks on a tile's layers: the picked layer outlined,
 * or the picked tap zone shown. */
export interface TileDesignFocus {
  layerId?: string;
  zoneId?: string;
}

/** How a design tile draws: the native parts it hides, and its own layers
 * drawn over the rest (undefined when it draws none). */
export interface TileDesignDrawing {
  hidden: TileHiddenParts;
  content?: TemplateResult;
}

/**
 * How a design tile draws on the stage: the native parts its owned roles
 * hide, and the layers it draws itself (owned base layers, added layers,
 * the picked tap zone's areas) by the complication renderer at the tile's
 * drawn size, `width` by `height` points at `s` pixels a point, the design
 * box fitted in and centred as the apps fit it, the picked one outlined. A
 * design that owns nothing and adds nothing draws exactly as the plain tile.
 * Undefined for a tile with no design that reads, which draws as it always
 * has.
 */
export function renderTileDesignContent(
  tile: WatchPageTile,
  width: number,
  height: number,
  s: number,
  inputs: TileDesignInputs,
  focus?: TileDesignFocus,
): TileDesignDrawing | undefined {
  const stored = storedTileDesign(tile);
  if (stored === undefined || !(width > 0) || !(height > 0)) return undefined;
  const design = stored.design;
  const hidden = designHiddenParts(design);
  const zone = focus?.zoneId;
  const drawn = drawnDesignDoc(design.doc, design.owned).elements;
  // Tap zones draw nothing but their areas while a zone is picked.
  const draws = drawn.some((el) => el.kind !== "tap") || (zone !== undefined && drawn.some((el) => el.kind === "tap"));
  if (!draws) return { hidden };
  const layout = tileDesignLayout(tile, design, inputs, undefined, true);
  const picked = zone ?? focus?.layerId;
  const content = html`<span class="ol-design" style=${`position:absolute;left:0;top:0;width:${width * s}px;height:${height * s}px`}>${renderLayout(layout, {
    icons: inputs.icons ?? NO_DRAW,
    bare: true,
    slot: { width: width * s, height: height * s },
    designBox: tileBoxOf(tile),
    ...(picked === undefined ? {} : { highlightId: picked }),
    ...(zone === undefined ? {} : { tapAreas: true, quietTaps: true }),
  })}</span>`;
  return { hidden, content };
}

/** Whether a design draws a layer itself (so `renderTileDesignContent`
 * outlines it when picked), rather than the native tile drawing that part. */
export function tileDesignDrawsLayer(tile: WatchPageTile, elementId: string): boolean {
  const stored = storedTileDesign(tile);
  if (stored === undefined) return false;
  const id = elementId.toUpperCase();
  return drawnDesignDoc(stored.design.doc, stored.design.owned).elements.some((el) => el.payload.id.toUpperCase() === id);
}

/**
 * The outline of a picked layer drawn over a tile that has no design saved
 * yet: the tile draws as it always has, and its base layer's frame, fitted
 * as the design box is, shows where that layer is.
 */
export function renderTileLayerOutline(frame: { x: number; y: number; width: number; height: number }, box: { width: number; height: number }, width: number, height: number, s: number): TemplateResult {
  const fit = fitBox({ width, height }, TILE_DESIGN_FAMILY, box);
  const left = (fit.x + frame.x * fit.width) * s;
  const top = (fit.y + frame.y * fit.height) * s;
  return html`<span class="ol-design-outline" aria-hidden="true"
    style=${`position:absolute;left:${left}px;top:${top}px;width:${frame.width * fit.width * s}px;height:${frame.height * fit.height * s}px`}></span>`;
}

/** Where a layer's frame lands in a drawn tile `width` by `height` (any
 * unit), the design box fitted in and centred as the apps fit it: its box in
 * that unit from the tile's top left, and the fitted design box, whose size
 * turns a drag in that unit into fractions of the box. */
export function tileLayerPlacement(
  frame: { x: number; y: number; width: number; height: number },
  box: { width: number; height: number },
  width: number,
  height: number,
): { layer: { left: number; top: number; width: number; height: number }; fit: { x: number; y: number; width: number; height: number } } {
  const fit = fitBox({ width, height }, TILE_DESIGN_FAMILY, box);
  return {
    layer: { left: fit.x + frame.x * fit.width, top: fit.y + frame.y * fit.height, width: frame.width * fit.width, height: frame.height * fit.height },
    fit: { x: fit.x, y: fit.y, width: fit.width, height: fit.height },
  };
}

/** One layer drawn alone in a Tiles row's thumbnail box. */
export function renderTileLayerThumb(layout: ResolvedLayout, id: string, box: { width: number; height: number }, icons: IconProvider | undefined, width: number, height: number): TemplateResult {
  return renderLayerThumb(layout, [id], { icons: icons ?? NO_DRAW, width, height, designBox: box });
}

/** A provider that draws no symbol, for a picture handed none. */
const NO_DRAW: IconProvider = { render: () => undefined, available: () => false, names: () => [] };

