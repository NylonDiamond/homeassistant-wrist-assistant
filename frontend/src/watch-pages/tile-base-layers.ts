// A tile's base layers: the glyph or photo, the name and the state line One
// Look draws inside the tile, as complication layers in the tile's design
// box. They are made on the fly from the simple settings and are saved only
// once a layer of the tile is changed or added (`tile-design.ts`).
//
// One Look's own layout decides where each one goes (`oneLookPreviewModel`
// at the design box, on the watch), so a base layer sits where the native
// tile draws that part, at the size and in the ink it draws it. The name and
// the state read the tile's own words through the `tileName` and `tileState`
// value kinds, so they stay live and cost no template.
//
// App repo docs/tile_layers_contract_2026-10.md, section 2.3.

import type { HassEntityState } from "../ha-api.js";
import {
  type CustomComplicationConfig,
  type Element,
  type FontDesign,
  type FontWeight,
  type IconElement,
  type ImageElement,
  type NormalizedFrame,
  type Rule,
  type TextElement,
  type Value,
  IMAGE_DEFAULT_TIMESTAMP_SIZE,
  encodeConfig,
  literal,
  newConfig,
  parseConfig,
} from "../model.js";
import type { IconProvider } from "../renderer.js";
import { type WatchPage, type WatchPageTile, tileEntityId, tileGeometry, tileKind } from "./model.js";
import { type WatchPagePreviewInput, knownSymbol, watchPreviewTileLabel, watchSpecialTileLook, watchSyncedTile } from "./preview.js";
import { type OneLookPreviewModel, oneLookPreviewModel } from "./one-look/render.js";
import { type OneLookInk, oneLookGlyphInk, oneLookHex } from "./one-look/colour.js";
import { type OneLookStateLine, oneLookStateFor } from "./one-look/state.js";
import { oneLookCellSize, oneLookCentredGlyph, oneLookDrawnSize, oneLookGridUnit } from "./one-look/metrics.js";
import { type OneLookRect, ONE_LOOK_GLYPH_INK_SHARE, ONE_LOOK_GLYPH_STATE_GAP, oneLookLayoutMetrics } from "./one-look/layout.js";
import { oneLookMeasurer } from "./one-look/measurer.js";
import { ONE_LOOK_WATCH_TAIL_COLUMNS, type TextMeasurer, glyphExtentOf } from "./one-look/text.js";
import {
  type BaseLayerRole,
  BASE_LAYER_IDS,
  BASE_LAYER_NAMES,
  TILE_DESIGN_FAMILY,
  TILE_DESIGN_SCREEN_WIDTH,
  normalizeDesignDoc,
  tileHasLayers,
} from "./tile-design-core.js";

/** What the base layers are built from besides the tile. */
export interface BaseLayerContext {
  /** Home Assistant's states. The tile's words, its inks and whether it shows
   * a photo come from its entity's. */
  states?: Readonly<Record<string, HassEntityState>>;
  /** Every page, so a page link is named after its page. */
  pages?: readonly WatchPage[];
  /** The tile's page, for the colour the watch gives a tile with none. */
  page?: WatchPage;
  /** The watch's measurer. Absent: the watch measurer with `icons`. Fixtures
   * pass `oneLookMeasurer("watch", { estimate: true })`. */
  measurer?: TextMeasurer;
  /** The panel's symbols, which size the glyph. */
  icons?: IconProvider;
}

// ── the design box ───────────────────────────────────────────────────────

/** The grid unit on the reference watch: 208 less 3 of padding less 22 of
 * spacing, over 12 columns, is 15.25. */
function designUnit(): number {
  return oneLookGridUnit(TILE_DESIGN_SCREEN_WIDTH, "watch");
}

/** A tile's design box: its drawn size on a 46 mm watch under One Look,
 * `17.25*colSpan-3` by `17.25*rowSpan-3` (6x4 is 100.5 by 66).
 * `tile-design.ts` exports it; it lives here so the base layers need no
 * import back. */
export function designBoxFor(colSpan: number, rowSpan: number): { width: number; height: number } {
  return oneLookDrawnSize(Math.max(1, colSpan), Math.max(1, rowSpan), designUnit(), "watch");
}

// ── the tile's One Look model ────────────────────────────────────────────

const measurers = new WeakMap<IconProvider, TextMeasurer>();
let bareMeasurer: TextMeasurer | undefined;

/** The watch's measurer with these symbols, one per provider. */
function measurerFor(icons: IconProvider | undefined): TextMeasurer {
  if (icons === undefined) return (bareMeasurer ??= oneLookMeasurer("watch"));
  let m = measurers.get(icons);
  if (m === undefined) measurers.set(icons, (m = oneLookMeasurer("watch", { icons, known: (n) => knownSymbol(icons, n) })));
  return m;
}

interface Face {
  model: OneLookPreviewModel;
  box: { width: number; height: number };
  input: WatchPagePreviewInput;
  tile: WatchPageTile;
  measurer: TextMeasurer;
}

/** The input a page picture would hand One Look for this tile on the watch,
 * drawn at its design box. */
function previewInput(tile: WatchPageTile, ctx: BaseLayerContext, states: Readonly<Record<string, HassEntityState>> | undefined): WatchPagePreviewInput {
  const page: WatchPage = ctx.page ?? { id: "", items: [tile] };
  return {
    page,
    pages: ctx.pages ?? [page],
    screen: { width: TILE_DESIGN_SCREEN_WIDTH, height: TILE_DESIGN_SCREEN_WIDTH },
    ...(states === undefined ? {} : { states: states as Record<string, HassEntityState> }),
    ...(ctx.icons === undefined ? {} : { icons: ctx.icons }),
  };
}

/** The tile's One Look model at its design box, with these states. */
function faceOf(stored: WatchPageTile, ctx: BaseLayerContext, states = ctx.states): Face | undefined {
  const tile = watchSyncedTile(stored, ctx.page);
  const g = tileGeometry(tile);
  const box = designBoxFor(g.colSpan, g.rowSpan);
  const unit = designUnit();
  const cell = oneLookCellSize(g.colSpan, g.rowSpan, unit);
  const input = previewInput(tile, ctx, states);
  const measurer = ctx.measurer ?? measurerFor(ctx.icons);
  const model = oneLookPreviewModel({
    tile, input, stub: false, device: "watch", look: watchSpecialTileLook(tile, input),
    width: box.width, height: box.height, cell, unit, box: "", s: 1, measurer,
  });
  return model === undefined ? undefined : { model, box, input, tile, measurer };
}

/** The tile's entity's state with its word replaced, its attributes kept. */
function withEntityState(
  states: Readonly<Record<string, HassEntityState>> | undefined,
  entityId: string,
  state: string,
): Record<string, HassEntityState> {
  const prior = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  const entity: HassEntityState = prior === undefined
    ? { entity_id: entityId, state, attributes: {}, last_changed: "", last_updated: "" }
    : { ...prior, state };
  return { ...(states ?? {}), [entityId]: entity };
}

// ── words ────────────────────────────────────────────────────────────────

/**
 * A One Look state line as plain text, as a tile's `tileState` value reads
 * it: a number with its unit (after a space when spaced) and its tail when
 * the watch shows one (the line keeps it, or the tile is 8 columns or
 * wider); a word in full; nothing for none.
 */
export function oneLookStateLineText(line: OneLookStateLine, colSpan: number): string {
  if (line.kind === "none") return "";
  if (line.kind === "word") return line.word;
  const tail = line.tail !== undefined && (line.keepTail === true || colSpan >= ONE_LOOK_WATCH_TAIL_COLUMNS) ? ` ${line.tail}` : "";
  return line.figure + (line.unitSpaced === true ? " " : "") + (line.unit ?? "") + tail;
}

/** A tile's own words for `ResolveContext.tileValues`: its state line as
 * text ("" while its entity has not loaded) and its name (its label, else
 * the friendly name, else the entity id), whether or not the label shows. */
export function tileValuesFor(tile: WatchPageTile, ctx: BaseLayerContext): { state: string; name: string } {
  const face = faceOf(tile, ctx);
  const name = watchPreviewTileLabel(face?.tile ?? tile, face?.input ?? previewInput(tile, ctx, ctx.states));
  if (face === undefined) return { state: "", name };
  const ks = face.model.kind;
  const state = ks.stateHidden ? "" : oneLookStateLineText(oneLookStateFor(ks, false), face.model.colSpan);
  return { state, name };
}

// ── building the layers ──────────────────────────────────────────────────

const round = (v: number, places: number): number => {
  const k = 10 ** places;
  return Math.round(v * k) / k;
};

/** A rect in the drawn tile as fractions of the design box. */
function frameOf(r: OneLookRect, box: { width: number; height: number }): NormalizedFrame {
  return {
    x: round(r.x / box.width, 4),
    y: round(r.y / box.height, 4),
    width: round(r.width / box.width, 4),
    height: round(r.height / box.height, 4),
    rotationDegrees: 0,
  };
}

/** An ink as a hex, with its opacity as a fourth byte when under 1. */
function inkHex(ink: OneLookInk): string {
  const hex = oneLookHex(ink.rgb);
  if (ink.opacity >= 1) return hex;
  const alpha = Math.round(Math.max(0, ink.opacity) * 255).toString(16).padStart(2, "0").toUpperCase();
  return `${hex}${alpha}`;
}

/** A hex as the documents write one: "#" and upper case. */
function normalHex(value: string): string {
  const body = value.trim().replace(/^#/, "");
  return `#${body.toUpperCase()}`;
}

/** The kinds whose lit state is `on`: their glyph ink follows on and off by
 * a rule. */
const LIT_ON_KINDS: ReadonlySet<string> = new Set(["light", "switch", "input_boolean", "fan", "siren", "humidifier", "automation"]);

/** One Look's text shadow on a coloured fill (`OneLookViews.TextShadow`). */
const TEXT_SHADOW = Object.freeze({ colorHex: "#00000040", radius: 0.75, dx: 0, dy: 0.5 });
/** The glyph's shadow with Icon Shadow on (`glyphShadowOpacity`, `glyphShadowRadius`). */
const GLYPH_SHADOW = Object.freeze({ colorHex: "#00000080", radius: 2, dx: 0, dy: 1 });

/** Fixed ids for the rules a base layer carries, so a rebuild writes the
 * same document: the role, the rule, the case and the part (1 the rule, 2
 * the case, 3 its test). */
function baseRuleId(role: BaseLayerRole, rule: number, caseIndex: number, part: 1 | 2 | 3): string {
  const r = { icon: 1, photo: 2, name: 3, state: 4 }[role];
  const hex = (n: number, width: number) => n.toString(16).toUpperCase().padStart(width, "0");
  return `BA5E000${r}-${hex(rule, 4)}-4${hex(caseIndex, 3)}-8${hex(part, 3)}-000000000000`;
}

function entityValue(tile: WatchPageTile, states: Readonly<Record<string, HassEntityState>> | undefined): Value {
  const entityId = tileEntityId(tile);
  const entity = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  const friendly = entity?.attributes?.friendly_name;
  return { kind: { kind: "entityState", entityId, displayName: typeof friendly === "string" ? friendly : "", domain: tileKind(entityId) } };
}

/** The per state icons as one rule: a case per entry of `stateIcons`, the
 * `unavailable` entry testing unavailable, every other its state word. */
function stateIconRule(tile: WatchPageTile, ctx: BaseLayerContext): Rule | undefined {
  if (tile.usesStateIcons !== true) return undefined;
  const map = tile.stateIcons;
  if (map === null || typeof map !== "object" || Array.isArray(map)) return undefined;
  const entries = Object.entries(map as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== "");
  if (entries.length === 0) return undefined;
  const value = entityValue(tile, ctx.states);
  return {
    id: baseRuleId("icon", 1, 0, 1),
    cases: entries.map(([key, symbol], i) => ({
      id: baseRuleId("icon", 1, i + 1, 2),
      when: {
        join: "all",
        tests: [{
          id: baseRuleId("icon", 1, i + 1, 3),
          value,
          comparison: key === "unavailable" ? { kind: "isUnavailable" } : { kind: "equals", value: literal(key) },
        }],
      },
      then: [{ kind: "setIcon", value: literal(symbol) }],
    })),
  };
}

/** The glyph's ink at a state, or undefined when the tile draws none then. */
function glyphInkAt(tile: WatchPageTile, ctx: BaseLayerContext, state: string): string | undefined {
  const face = faceOf(tile, ctx, withEntityState(ctx.states, tileEntityId(tile), state));
  if (face === undefined) return undefined;
  return inkHex(oneLookGlyphInk(face.model.palette, face.model.layout.drawsDisc, oneLookCentredGlyph("watch")));
}

/** The glyph layer: the person's photo, or the symbol. */
function glyphLayer(tile: WatchPageTile, ctx: BaseLayerContext, face: Face): Element | undefined {
  const { model, box } = face;
  const layout = model.layout;
  if (!(layout.discRect.width > 0)) return undefined;
  const rect = layout.glyphInk ?? layout.discRect;
  const entityId = tileEntityId(tile);
  if (model.photo !== undefined) {
    const states = ctx.states;
    const friendly = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId]?.attributes?.friendly_name : undefined;
    const payload: ImageElement = {
      id: BASE_LAYER_IDS.photo,
      name: BASE_LAYER_NAMES.photo,
      rules: [],
      frame: frameOf(rect, box),
      isHidden: false,
      entity: { entityId, displayName: typeof friendly === "string" ? friendly : "", domain: tileKind(entityId) },
      source: "entityPicture",
      contentMode: "fill",
      zoom: 1,
      panX: 0,
      panY: 0,
      cornerRadius: round(Math.min(rect.width, rect.height) / 2, 2),
      timestampCorner: "topLeading",
      timestampSize: IMAGE_DEFAULT_TIMESTAMP_SIZE,
    };
    return { kind: "image", payload };
  }
  if (model.baseIcon === "") return undefined;
  const iconRule = stateIconRule(tile, ctx);
  // With per state icons the symbol is the one shown when no entry matches:
  // the tile's own, read with the state icons off.
  let symbol = model.baseIcon;
  if (iconRule !== undefined) {
    const plain = faceOf({ ...tile, usesStateIcons: false }, ctx);
    if (plain !== undefined && plain.model.baseIcon !== "") symbol = plain.model.baseIcon;
  }
  let colorHex = inkHex(oneLookGlyphInk(model.palette, layout.drawsDisc, oneLookCentredGlyph("watch")));
  let colorRule: Rule | undefined;
  if (LIT_ON_KINDS.has(tileKind(entityId))) {
    const on = glyphInkAt(tile, ctx, "on");
    const off = glyphInkAt(tile, ctx, "off");
    if (on !== undefined && off !== undefined) {
      colorHex = off;
      if (on !== off) {
        colorRule = {
          id: baseRuleId("icon", 2, 0, 1),
          cases: [{
            id: baseRuleId("icon", 2, 1, 2),
            when: { join: "all", tests: [{ id: baseRuleId("icon", 2, 1, 3), value: entityValue(tile, ctx.states), comparison: { kind: "isOn" } }] },
            then: [{ kind: "setColor", value: literal(on) }],
          }],
        };
      }
    }
  }
  const extent = Math.max(0.5, glyphExtentOf(face.measurer, model.baseIcon));
  const payload: IconElement = {
    id: BASE_LAYER_IDS.icon,
    name: BASE_LAYER_NAMES.icon,
    colorSlot: { baseColorHex: colorHex },
    rules: [iconRule, colorRule].filter((r): r is Rule => r !== undefined),
    frame: frameOf(rect, box),
    isHidden: false,
    symbol: literal(symbol),
    size: round((layout.glyphSize * ONE_LOOK_GLYPH_INK_SHARE) / extent, 2),
  };
  if (model.style.glyphShadow) payload.shadow = { ...GLYPH_SHADOW };
  return { kind: "icon", payload };
}

const FONT_DESIGNS: Readonly<Record<string, FontDesign>> = { standard: "default", rounded: "rounded", monospaced: "monospaced", serif: "serif" };

/** The name layer: the name's room (not its ink), at the size One Look
 * fitted it, in the tile's name style. */
function nameLayer(face: Face): Element | undefined {
  const { model, box } = face;
  const layout = model.layout;
  const lines = layout.name.lines.length;
  if (model.name === "" || lines === 0) return undefined;
  const centred = layout.mode === "centred";
  const size = layout.name.size;
  const m = oneLookLayoutMetrics(layout, "watch");
  const colour = model.picture === "none" && model.style.nameColour !== undefined ? normalHex(model.style.nameColour) : inkHex(model.palette.ink);
  const design = FONT_DESIGNS[model.style.nameDesign] ?? "default";
  const payload: TextElement = {
    id: BASE_LAYER_IDS.name,
    name: BASE_LAYER_NAMES.name,
    colorSlot: { baseColorHex: colour },
    rules: [],
    frame: frameOf({ x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: lines * layout.nameLineHeight }, box),
    isHidden: false,
    value: { kind: { kind: "tileName" } },
    fontSize: round(size, 2),
    fontWeight: (model.style.nameWeight ?? (centred ? "medium" : "semibold")) as FontWeight,
    lineLimit: lines,
    minimumScale: round(Math.min(1, Math.max(0.5, m.nameMin / size)), 2),
    alignment: centred ? "center" : "leading",
  };
  if (design !== "default") payload.fontDesign = design;
  if (model.palette.textShadow && model.style.nameShadow) payload.shadow = { ...TEXT_SHADOW };
  return { kind: "text", payload };
}

/** The state layer: the state line's box, widened to the room the layout
 * leaves it, bold rounded for a number and semibold for a word. */
function stateLayer(face: Face): Element | undefined {
  const { model, box } = face;
  const layout = model.layout;
  const state = layout.state;
  if (state === undefined) return undefined;
  const w = layout.size.width;
  const line: OneLookRect = layout.mode === "centred" && layout.stateRect !== undefined
    ? layout.stateRect
    : { x: layout.textOrigin.x, y: layout.textOrigin.y + layout.name.lines.length * layout.nameLineHeight, width: layout.textWidth, height: layout.stateLineHeight };
  // Up to the glyph's left edge when the glyph is beside the line, else to
  // the tile's right inset.
  const glyph = layout.discRect.width > 0 ? (layout.glyphInk ?? layout.discRect) : undefined;
  const beside = glyph !== undefined && glyph.x > line.x && glyph.y < line.y + line.height && glyph.y + glyph.height > line.y;
  const right = beside ? glyph.x - ONE_LOOK_GLYPH_STATE_GAP : w - layout.insetH;
  const width = Math.max(line.width, right - line.x);
  const number = state.parts.kind === "number";
  const size = state.size;
  const m = oneLookLayoutMetrics(layout, "watch");
  const payload: TextElement = {
    id: BASE_LAYER_IDS.state,
    name: BASE_LAYER_NAMES.state,
    colorSlot: { baseColorHex: inkHex(number ? model.palette.ink : model.palette.ink2) },
    rules: [],
    frame: frameOf({ x: line.x, y: line.y, width, height: line.height }, box),
    isHidden: false,
    value: { kind: { kind: "tileState" } },
    fontSize: round(size, 2),
    fontWeight: number ? "bold" : "semibold",
    lineLimit: 1,
    minimumScale: round(Math.min(1, Math.max(0.5, m.textMin / size)), 2),
    alignment: "leading",
  };
  if (number) payload.fontDesign = "rounded";
  if (model.palette.textShadow && model.style.stateShadow) payload.shadow = { ...TEXT_SHADOW };
  return { kind: "text", payload };
}

/**
 * A tile's base layers in draw order (the glyph or photo, the state, the
 * name), made from its simple settings and One Look's layout at the tile's
 * design box. Empty for a tile whose kind has no layers, and for one One
 * Look does not draw. They come out as a saved document reads back (every
 * key at its default left out), so a layer read from a design compares
 * equal to the one built now.
 */
export function baseLayers(tile: WatchPageTile, ctx: BaseLayerContext): Element[] {
  if (!tileHasLayers(tile)) return [];
  const face = faceOf(tile, ctx);
  if (face === undefined) return [];
  const built = [glyphLayer(face.tile, ctx, face), stateLayer(face), nameLayer(face)].filter((el): el is Element => el !== undefined);
  const cfg = newConfig("", 0, TILE_DESIGN_FAMILY);
  cfg.elements = built;
  return parseConfig(encodeConfig(cfg)).elements;
}

/** The role of each base layer `baseLayers` builds. */
export function baseLayersByRole(tile: WatchPageTile, ctx: BaseLayerContext): Map<BaseLayerRole, Element> {
  const out = new Map<BaseLayerRole, Element>();
  for (const el of baseLayers(tile, ctx)) {
    for (const role of Object.keys(BASE_LAYER_IDS) as BaseLayerRole[]) if (BASE_LAYER_IDS[role] === el.payload.id) out.set(role, el);
  }
  return out;
}

/** The base layers as a design's document (section 1.1): the tile's id and
 * name, one rectangular layout, in the panel's normal form. */
export function baseLayersDocument(tile: WatchPageTile, ctx: BaseLayerContext): CustomComplicationConfig {
  const cfg = newConfig(tileValuesFor(tile, ctx).name, 0, TILE_DESIGN_FAMILY);
  if (typeof tile.id === "string" && tile.id !== "") cfg.id = tile.id.toUpperCase();
  cfg.elements = baseLayers(tile, ctx);
  return normalizeDesignDoc(cfg);
}
