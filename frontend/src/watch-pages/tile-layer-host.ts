// What the page editor hands the complication editor's own layer cards
// (`layerEditor`, editors.ts) to edit one layer of a page tile, and the
// edits the Tiles rows and the tile's Layers card make to its layers.
//
// The layer cards edit a complication document through an `EditorHost`. Here
// that document is the tile's design (`designForEdit`: the one it has, or its
// base layers made fresh), and every change the cards make is written back
// to the tile through the page draft like any tile edit (`writeDesignDoc`,
// which owns a base layer on its first change), so undo, redo and a merge
// from another save treat it as one more page edit. Nothing here keeps state
// of its own beyond the host's `uiState`.
//
// App repo docs/tile_layers_contract_2026-10.md, section 10.4 items 2, 3 and 6.

import { type EditorHost, defaultOpenSections } from "../editors.js";
import type { CustomComplicationConfig, Element, Rule, Test, Value } from "../model.js";
import { newId } from "../model.js";
import { type ForcedBranches, Resolver } from "../resolver.js";
import type { TileSettingsHost } from "./editor-host.js";
import { type WatchPageTile, type WatchPagesDocument, watchPagesOf } from "./model.js";
import { editTile } from "./tile-settings-model.js";
import {
  type BaseLayerContext,
  type BaseLayerRole,
  type TileDesign,
  type TileZoneAction,
  type TileZonePreset,
  TILE_DESIGN_FAMILY,
  TILE_DESIGN_MAX_LAYERS,
  addLayer,
  applyZonePreset,
  baseRoleOf,
  designForEdit,
  moveLayer,
  removeLayer,
  resetAllLayers,
  resetBaseLayer,
  setZoneAction,
  withDesign,
  writeDesignDoc,
} from "./tile-design.js";
import { type TileDesignInputs, tileBoxOf, tileDesignResolveContext } from "./tile-design-face.js";

/** Every `uiState` key of this module starts with this. */
const KEY = "tile-layers";

/** The context the tile's base layers are built in: Home Assistant's real
 * states (never a state tried in the Live strip), the page, every page and
 * the panel's symbols. */
export function tileLayerContext(host: Pick<TileSettingsHost, "hass" | "page" | "document" | "icons">): BaseLayerContext {
  return { states: host.hass.states, page: host.page, pages: watchPagesOf(host.document), icons: host.icons };
}

/** What a tile's layers are drawn from in the inspector: the live states,
 * the page and the page's template renders. */
export function tileLayerInputs(host: Pick<TileSettingsHost, "hass" | "page" | "document" | "icons" | "templateRenders">): TileDesignInputs {
  return { states: host.hass.states, page: host.page, pages: watchPagesOf(host.document), icons: host.icons, templates: host.templateRenders };
}

/** The tile's design to edit now, read from the host at the moment it is
 * asked (a getter), never from the draw. */
export function tileDesignNow(host: TileSettingsHost): TileDesign {
  return designForEdit(host.tile, tileLayerContext(host));
}

/** The document with the selected tile replaced by `change` of it. */
function withTile(host: TileSettingsHost, change: (tile: WatchPageTile) => WatchPageTile): WatchPagesDocument {
  return editTile(host.document, host.pageId, host.tileId, (tile) => change(tile));
}

/**
 * The edits a tile's Layers rows and Layers card make, each one undo step
 * through the host's `apply`. Each reads the tile and its design from the
 * host when it runs. False when nothing changed or the edit was refused.
 */
export interface TileLayerEdits {
  /** Write the design `change` makes of the current one (`withDesign`). */
  design(change: (design: TileDesign, tile: WatchPageTile, ctx: BaseLayerContext) => TileDesign, coalesce?: string): boolean;
  /** A change to the layers' document, owning every base layer it touches
   * (`writeDesignDoc`). */
  doc(mutate: (doc: CustomComplicationConfig) => void, coalesce?: string): boolean;
  /** Add a layer of a kind on top; its id, or "" when refused (over a cap,
   * or a kind a tile cannot hold). */
  add(kind: Element["kind"]): string;
  remove(id: string): boolean;
  move(id: string, dir: -1 | 1): boolean;
  /** Show or hide a layer. A base layer is owned by it, as by any change. */
  setHidden(id: string, hidden: boolean): boolean;
  /** Copy an added layer, the copy just above it; the copy's id, or "". */
  duplicate(id: string): string;
  /** Give a base layer back to the simple settings. */
  reset(role: BaseLayerRole): boolean;
  /** Back to the plain tile: no layers saved. */
  resetAll(): boolean;
  preset(preset: TileZonePreset): boolean;
  zoneAction(zoneId: string, action: TileZoneAction): boolean;
}

export function tileLayerEdits(host: TileSettingsHost): TileLayerEdits {
  const coalesceKey = (k: string | undefined) => (k === undefined ? undefined : { coalesce: `${KEY}:${host.tileId.toUpperCase()}:${k}` });
  const applyTile = (change: (tile: WatchPageTile, ctx: BaseLayerContext) => WatchPageTile, coalesce?: string): boolean => {
    const ctx = tileLayerContext(host);
    const next = withTile(host, (tile) => change(tile, ctx));
    if (next === host.document) return false;
    return host.apply(next, coalesceKey(coalesce));
  };
  const design = (change: (design: TileDesign, tile: WatchPageTile, ctx: BaseLayerContext) => TileDesign, coalesce?: string): boolean =>
    applyTile((tile, ctx) => {
      const before = designForEdit(tile, ctx);
      const after = change(before, tile, ctx);
      return after === before ? tile : withDesign(tile, after, ctx);
    }, coalesce);
  const doc = (mutate: (doc: CustomComplicationConfig) => void, coalesce?: string): boolean =>
    applyTile((tile, ctx) => {
      const before = designForEdit(tile, ctx);
      const next = structuredClone(before.doc);
      mutate(next);
      return writeDesignDoc(tile, before, next, ctx);
    }, coalesce);
  return {
    design,
    doc,
    add: (kind) => {
      let id = "";
      design((d) => {
        const added = addLayer(d, kind);
        id = added.id;
        return added.id === "" ? d : added.design;
      });
      return id;
    },
    remove: (id) => design((d) => removeLayer(d, id)),
    move: (id, dir) => design((d) => moveLayer(d, id, dir)),
    setHidden: (id, hidden) => doc((c) => {
      const el = c.elements.find((e) => e.payload.id.toUpperCase() === id.toUpperCase());
      if (el !== undefined) el.payload.isHidden = hidden;
    }),
    duplicate: (id) => {
      let copyId = "";
      doc((c) => {
        const at = c.elements.findIndex((e) => e.payload.id.toUpperCase() === id.toUpperCase());
        const el = c.elements[at];
        // Only an added drawing layer: a base layer is one of a kind, and a
        // tap zone's copy would need an action of its own.
        if (el === undefined || el.kind === "tap" || baseRoleOf(el.payload.id) !== undefined) return;
        if (c.elements.filter((e) => e.kind !== "tap").length >= TILE_DESIGN_MAX_LAYERS) return;
        const copy = structuredClone(el);
        copy.payload.id = newId();
        copyId = copy.payload.id.toUpperCase();
        c.elements.splice(at + 1, 0, copy);
      });
      return copyId;
    },
    reset: (role) => applyTile((tile, ctx) => resetBaseLayer(tile, role, ctx)),
    resetAll: () => applyTile((tile) => resetAllLayers(tile)),
    preset: (preset) => design((d, tile) => applyZonePreset(tile, d, preset)),
    zoneAction: (zoneId, action) => design((d) => setZoneAction(d, zoneId, action)),
  };
}

/** A set kept in `uiState` under one key, made on first use. */
function uiSet(host: TileSettingsHost, key: string, make: () => Set<string>): Set<string> {
  const held = host.uiState.get(key);
  if (held instanceof Set) return held as Set<string>;
  const made = make();
  host.uiState.set(key, made);
  return made;
}

/** The forced rule branches of one tile's layers, kept in `uiState`. */
function forcedOf(host: TileSettingsHost): ForcedBranches {
  const key = `${KEY}:forced:${host.tileId.toUpperCase()}`;
  const held = host.uiState.get(key);
  if (held instanceof Map) return held as ForcedBranches;
  const made: ForcedBranches = new Map();
  host.uiState.set(key, made);
  return made;
}

/** The forced rule branches of the selected tile's layers, for the preview
 * of the layer being edited. */
export function tileLayerForced(host: TileSettingsHost): ForcedBranches {
  return forcedOf(host);
}

/**
 * The `EditorHost` the layer cards edit one tile's layers through. Built
 * afresh on each draw, like the tile settings' own host. `config` is the
 * design as it is at the draw; every `update` starts again from the tile as
 * the host reads it then, so two edits in one task build on each other.
 *
 * `selectLayer` is the page editor's: a card's link to another layer (a
 * picture's timestamp) picks that layer's row.
 */
export function tileLayerHost(host: TileSettingsHost, selectLayer: (id: string) => void): EditorHost {
  const edits = tileLayerEdits(host);
  const design = tileDesignNow(host);
  const context = tileDesignResolveContext(host.tile, design, tileLayerInputs(host));
  const resolver = new Resolver(context, design.doc);
  // A gesture (a drag on a number) outlives a draw, so its key is kept in
  // `uiState`, not on this host.
  const gestureKey = `${KEY}:gesture`;
  const gesture = (): string | undefined => {
    const held = host.uiState.get(gestureKey);
    return typeof held === "string" ? held : undefined;
  };
  const open = uiSet(host, `${KEY}:open`, defaultOpenSections);
  const help = uiSet(host, `${KEY}:help`, () => new Set());
  const forced = forcedOf(host);
  const toggle = (set: Set<string>, id: string) => {
    if (set.has(id)) set.delete(id);
    else set.add(id);
    host.requestUpdate();
  };
  const secMenu = host.uiState.get(`${KEY}:secMenu`);
  const copied = host.uiState.get(`${KEY}:copied`);
  return {
    hass: host.hass,
    config: design.doc,
    icons: host.icons,
    symbols: host.symbols,
    pages: [],
    update: (mutate, coalesce) => {
      edits.doc(mutate, gesture() ?? coalesce);
    },
    endGesture: () => {
      host.uiState.delete(gestureKey);
      host.endCoalesce();
    },
    beginGesture: () => {
      host.endCoalesce();
      host.uiState.set(gestureKey, `gesture-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`);
    },
    resolve: (v: Value) => resolver.resolve(v),
    resolveContext: () => context,
    canCountDown: (v: Value) => resolver.canCountDown(v),
    historySeries: () => undefined,
    evaluateTest: (t: Test) => resolver.evaluateTest(t),
    liveBranch: (rule: Rule) => resolver.liveBranches([rule]).get(rule.id) ?? "none",
    forced,
    setForced: (ruleId, branch) => {
      forced.set(ruleId, branch);
      host.requestUpdate();
    },
    activeFamily: TILE_DESIGN_FAMILY,
    setActiveFamily: () => undefined,
    addInlineText: () => undefined,
    tapAreaShown: false,
    showTapArea: () => undefined,
    openSections: open,
    toggleSection: (id) => toggle(open, id),
    helpSections: help,
    toggleHelp: (id) => toggle(help, id),
    selectLayer,
    peekLayer: () => undefined,
    selectValue: () => undefined,
    ...(copied === undefined ? {} : { copiedPosition: copied as NonNullable<EditorHost["copiedPosition"]> }),
    copyPosition: (position) => {
      host.uiState.set(`${KEY}:copied`, position);
      host.requestUpdate();
    },
    ...(typeof secMenu === "string" ? { secMenu } : {}),
    toggleSecMenu: (id, on) => {
      if (on) host.uiState.set(`${KEY}:secMenu`, id);
      else if (host.uiState.get(`${KEY}:secMenu`) === id) host.uiState.delete(`${KEY}:secMenu`);
      host.requestUpdate();
    },
    setRowEdit: () => undefined,
    designBox: tileBoxOf(host.tile),
    tileValueKinds: true,
  };
}
