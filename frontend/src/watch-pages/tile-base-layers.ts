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
  type Comparison,
  type CustomComplicationConfig,
  type Element,
  type FontDesign,
  type FontWeight,
  type IconElement,
  type ImageElement,
  type NormalizedFrame,
  type Rule,
  type RuleCase,
  type ShapeElement,
  type TextElement,
  type Value,
  type TextPart,
  type TileStatePart,
  IMAGE_DEFAULT_TIMESTAMP_SIZE,
  TILE_STATE_PARTS,
  encodeConfig,
  literal,
  newConfig,
  parseConfig,
  richTextFallback,
} from "../model.js";
import type { TileStateParts } from "../resolver.js";
import type { IconProvider } from "../renderer.js";
import { type WatchPage, type WatchPageTile, tileEntityId, tileGeometry, tileKind } from "./model.js";
import { type WatchPagePreviewInput, filledSymbol, knownSymbol, watchPreviewTileLabel, watchSpecialTileLook, watchSyncedTile } from "./preview.js";
import { type OneLookPreviewModel, oneLookPreviewModel } from "./one-look/render.js";
import { type OneLookInk, ONE_LOOK_PILL_OPACITY, ONE_LOOK_UNIT_OPACITY, oneLookGlyphInk, oneLookHex } from "./one-look/colour.js";
import { type OneLookStateLine, oneLookStateFor } from "./one-look/state.js";
import { type OneLookDevice, oneLookCellSize, oneLookCentredGlyph, oneLookDrawnSize, oneLookGridUnit } from "./one-look/metrics.js";
import { type OneLookRect, ONE_LOOK_GLYPH_INK_SHARE, ONE_LOOK_GLYPH_STATE_GAP, ONE_LOOK_PILL_PAD_H, oneLookLayoutMetrics } from "./one-look/layout.js";
import { oneLookMeasurer } from "./one-look/measurer.js";
import { ONE_LOOK_WATCH_TAIL_COLUMNS, type TextMeasurer, glyphExtentOf, oneLookStateWidth } from "./one-look/text.js";
import { phonePagesLayout } from "../phone-frame.js";
import { type TileNativeFrames, anchorOf, tileNativeFrames } from "./tile-anchors.js";
import {
  type BaseLayerRole,
  type TileAnchors,
  BASE_LAYER_IDS,
  BASE_LAYER_NAMES,
  BASE_STATE_PART_IDS,
  BASE_STATE_PILL_ID,
  BASE_STATE_PILL_NAME,
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
  /** The iPhone's measurer, which only fits the state line (the iPhone's
   * face is wider). Absent: the iPhone measurer, estimating away from a
   * browser. */
  phoneMeasurer?: TextMeasurer;
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

let phoneTextMeasurer: TextMeasurer | undefined;

/** The iPhone's text measurer. The iPhone draws a design scaled up in its
 * own face, which is wider than the watch's, so a text layer is fitted to
 * both. Away from a browser it estimates, the same widths as the watch's. */
function phoneMeasurer(ctx: BaseLayerContext): TextMeasurer {
  return ctx.phoneMeasurer ?? (phoneTextMeasurer ??= oneLookMeasurer("phone"));
}

interface Face {
  model: OneLookPreviewModel;
  box: { width: number; height: number };
  input: WatchPagePreviewInput;
  tile: WatchPageTile;
  measurer: TextMeasurer;
  /** The iPhone's, for fitting the state line (`phoneMeasurer`). */
  phoneMeasurer: TextMeasurer;
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
  return model === undefined ? undefined : { model, box, input, tile, measurer, phoneMeasurer: phoneMeasurer(ctx) };
}

/** The tile's entity's state with its word replaced, its attributes kept. */
function withEntityState(
  states: Readonly<Record<string, HassEntityState>> | undefined,
  entityId: string,
  state: string,
  attributes?: Readonly<Record<string, unknown>>,
): Record<string, HassEntityState> {
  const prior = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
  const entity: HassEntityState = prior === undefined
    ? { entity_id: entityId, state, attributes: { ...(attributes ?? {}) }, last_changed: "", last_updated: "" }
    : { ...prior, state, ...(attributes === undefined ? {} : { attributes: { ...(prior.attributes ?? {}), ...attributes } }) };
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

/**
 * A One Look state line in its four pieces, as a `tileState` value with a
 * `part` reads them (round two, section 13.4): a number's figure, its unit
 * (after a space when spaced; "" with none) and its tail (after a space,
 * when the watch shows it, by the same rule as the whole line), or the word.
 * The pieces a line does not have are "". A number's `figure + unit + tail`,
 * or the `word`, is the whole line (`oneLookStateLineText`).
 */
export function oneLookStateLineParts(line: OneLookStateLine, colSpan: number): TileStateParts {
  if (line.kind === "none") return { ...NO_STATE_PARTS };
  if (line.kind === "word") return { ...NO_STATE_PARTS, word: line.word };
  const tail = line.tail !== undefined && (line.keepTail === true || colSpan >= ONE_LOOK_WATCH_TAIL_COLUMNS) ? ` ${line.tail}` : "";
  const unit = line.unit === undefined ? "" : (line.unitSpaced === true ? " " : "") + line.unit;
  return { figure: line.figure, unit, tail, word: "" };
}

const NO_STATE_PARTS: Readonly<TileStateParts> = Object.freeze({ figure: "", unit: "", tail: "", word: "" });

/** A tile's own words for `ResolveContext.tileValues`: its state line as
 * text ("" while its entity has not loaded), the same line in its four
 * pieces, and its name (its label, else the friendly name, else the entity
 * id), whether or not the label shows. */
export function tileValuesFor(tile: WatchPageTile, ctx: BaseLayerContext): { state: string; name: string; stateParts: TileStateParts } {
  const face = faceOf(tile, ctx);
  const name = watchPreviewTileLabel(face?.tile ?? tile, face?.input ?? previewInput(tile, ctx, ctx.states));
  if (face === undefined) return { state: "", name, stateParts: { ...NO_STATE_PARTS } };
  const ks = face.model.kind;
  if (ks.stateHidden) return { state: "", name, stateParts: { ...NO_STATE_PARTS } };
  const line = oneLookStateFor(ks, false);
  return { state: oneLookStateLineText(line, face.model.colSpan), name, stateParts: oneLookStateLineParts(line, face.model.colSpan) };
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

/** A state to read the tile's face at: its word, and any attributes that
 * must read a set way then (a cover's position). */
interface Probe {
  state: string;
  attributes?: Readonly<Record<string, unknown>>;
}

type FacesAt = (state: string, attributes?: Readonly<Record<string, unknown>>) => Face | undefined;

/** The tile's face with its entity in another state (and those attributes),
 * one per state asked. */
function facesAt(tile: WatchPageTile, ctx: BaseLayerContext): FacesAt {
  const held = new Map<string, Face | undefined>();
  return (state, attributes) => {
    const key = attributes === undefined ? state : `${state}\u0000${JSON.stringify(attributes)}`;
    if (!held.has(key)) held.set(key, faceOf(tile, ctx, withEntityState(ctx.states, tileEntityId(tile), state, attributes)));
    return held.get(key);
  };
}

/** The glyph's ink in a face, or undefined when the tile draws none then. */
function glyphInkOf(face: Face | undefined): string | undefined {
  if (face === undefined) return undefined;
  return inkHex(oneLookGlyphInk(face.model.palette, face.model.layout.drawsDisc, oneLookCentredGlyph("watch")));
}

/** The symbol One Look draws in a face (its fill, outline or slashed form),
 * or undefined when it draws none. */
function drawnSymbolOf(face: Face | undefined): string | undefined {
  const icon = face?.model.icon ?? "";
  return icon === "" ? undefined : icon;
}

/** One case of the icon's symbol rule: the test on the entity's state, the
 * state its symbol is read off One Look at, and whether the test also holds
 * while the entity is unavailable (so the unavailable case knows what it
 * would otherwise fall to). */
interface StateCase {
  test: Comparison;
  probe: Probe;
  matchesUnavailable: boolean;
}

/** A number as Home Assistant stores one in an attribute, as One Look reads
 * a cover's position (`storedNumber` in `preview.ts`). */
function finiteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * The states a kind's symbol swaps between, as One Look swaps it
 * (`watchTileSymbol` and the fill rules in `preview.ts`): the state every
 * other one draws like, and a case per state that draws another symbol, the
 * first matching case winning. Undefined for a kind whose symbol does not
 * follow its state.
 *
 * A light, switch or fan fills while on. A climate stands off as an outline.
 * A lock draws the open padlock in every state but locked. A cover or valve
 * draws its open form while open or opening, and while closing too when it
 * reports a position (One Look then reads the position, above 0 until the
 * cover is closed). A timer draws pause while paused. A battery reading draws
 * its level at One Look's thresholds, under 10, 25, 50 and 75.
 */
function stateCasesFor(kind: string, ctx: BaseLayerContext, entityId: string): { base: Probe; cases: StateCase[] } | undefined {
  const entity = ctx.states !== undefined && Object.hasOwn(ctx.states, entityId) ? ctx.states[entityId] : undefined;
  if (LIT_ON_KINDS.has(kind)) {
    return { base: { state: "off" }, cases: [{ test: { kind: "isOn" }, probe: { state: "on" }, matchesUnavailable: false }] };
  }
  if (kind === "climate") {
    const raw = entity?.state;
    const running = raw !== undefined && raw !== "off" && raw !== "unavailable" && raw !== "unknown" ? raw : "heat";
    return { base: { state: running }, cases: [{ test: { kind: "equals", value: literal("off") }, probe: { state: "off" }, matchesUnavailable: false }] };
  }
  if (kind === "lock") {
    return { base: { state: "locked" }, cases: [{ test: { kind: "notEquals", value: literal("locked") }, probe: { state: "unlocked" }, matchesUnavailable: true }] };
  }
  if (kind === "cover" || kind === "valve") {
    const positioned = finiteNumber(entity?.attributes?.current_position);
    return {
      base: positioned ? { state: "closed", attributes: { current_position: 0 } } : { state: "closed" },
      cases: [{
        test: { kind: "isOneOf", options: positioned ? ["open", "opening", "closing"] : ["open", "opening"] },
        probe: positioned ? { state: "open", attributes: { current_position: 100 } } : { state: "open" },
        matchesUnavailable: false,
      }],
    };
  }
  if (kind === "timer") {
    return { base: { state: "idle" }, cases: [{ test: { kind: "equals", value: literal("paused") }, probe: { state: "paused" }, matchesUnavailable: false }] };
  }
  const deviceClass = entity?.attributes?.device_class;
  if (typeof deviceClass === "string" && deviceClass.toLowerCase() === "battery") {
    const below = (limit: number, state: string): StateCase => ({
      test: { kind: "lessThan", value: literal(String(limit)) },
      probe: { state },
      matchesUnavailable: false,
    });
    return { base: { state: "100" }, cases: [below(10, "5"), below(25, "20"), below(50, "40"), below(75, "60")] };
  }
  return undefined;
}

/**
 * The symbol an icon layer starts with and the rule that swaps it the way
 * One Look does (`stateCasesFor`), with the crossed out form while
 * unavailable first. Each symbol is read off One Look's own face at that
 * state, with the per state icons off (their own rule comes after this one
 * and wins when an entry matches, as One Look draws an entry's symbol as it
 * is). A kind whose symbol does not follow its state takes the symbol drawn
 * now (the filled one while unavailable) and only the unavailable case.
 */
function symbolRule(tile: WatchPageTile, ctx: BaseLayerContext, face: Face, tileAt: FacesAt): { symbol: string; rule?: Rule } {
  const plainTile = tile.usesStateIcons === true ? { ...tile, usesStateIcons: false } : tile;
  const at = plainTile === tile ? tileAt : facesAt(plainTile, ctx);
  const entityId = tileEntityId(tile);
  const kind = tileKind(entityId);
  const plainNow = plainTile === tile ? face : faceOf(plainTile, ctx);
  const fallback = plainNow?.model.baseIcon || face.model.baseIcon;
  const swaps = stateCasesFor(kind, ctx, entityId);
  // The symbol in every state the rule does not name, and the state cases
  // with their symbols. They are kept together or not at all: a battery's
  // thresholds are read in order, so dropping one would hand its readings to
  // the next.
  let symbol: string;
  let stateCases: { test: Comparison; symbol: string; matchesUnavailable: boolean }[] = [];
  if (swaps !== undefined) {
    symbol = drawnSymbolOf(at(swaps.base.state, swaps.base.attributes)) ?? fallback;
    stateCases = swaps.cases.map((c) => ({ test: c.test, symbol: drawnSymbolOf(at(c.probe.state, c.probe.attributes)) ?? symbol, matchesUnavailable: c.matchesUnavailable }));
    if (stateCases.every((c) => c.symbol === symbol)) stateCases = [];
  } else {
    symbol = plainNow !== undefined && !plainNow.model.kind.isUnavailable ? (drawnSymbolOf(plainNow) ?? fallback) : filledSymbol(ctx.icons, fallback, true);
  }
  const cases: RuleCase[] = [];
  const value = entityValue(tile, ctx.states);
  const unavailable = drawnSymbolOf(at("unavailable"));
  // What the rule would draw while unavailable without a case of its own.
  const otherwise = stateCases.find((c) => c.matchesUnavailable)?.symbol ?? symbol;
  if (unavailable !== undefined && unavailable !== otherwise) {
    cases.push({
      id: baseRuleId("icon", 3, cases.length + 1, 2),
      when: { join: "all", tests: [{ id: baseRuleId("icon", 3, cases.length + 1, 3), value, comparison: { kind: "isUnavailable" } }] },
      then: [{ kind: "setIcon", value: literal(unavailable) }],
    });
  }
  for (const c of stateCases) {
    cases.push({
      id: baseRuleId("icon", 3, cases.length + 1, 2),
      when: { join: "all", tests: [{ id: baseRuleId("icon", 3, cases.length + 1, 3), value, comparison: c.test }] },
      then: [{ kind: "setIcon", value: literal(c.symbol) }],
    });
  }
  return cases.length === 0 ? { symbol } : { symbol, rule: { id: baseRuleId("icon", 3, 0, 1), cases } };
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
  // The symbol shown when no per state icon matches, filled or not as One
  // Look fills it, with the rule that swaps it as the state changes.
  const tileAt = facesAt(tile, ctx);
  const { symbol, rule: fillRule } = symbolRule(tile, ctx, face, tileAt);
  let colorHex = inkHex(oneLookGlyphInk(model.palette, layout.drawsDisc, oneLookCentredGlyph("watch")));
  let colorRule: Rule | undefined;
  if (LIT_ON_KINDS.has(tileKind(entityId))) {
    const at = tileAt;
    const on = glyphInkOf(at("on"));
    const off = glyphInkOf(at("off"));
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
    // The fill rule first: a per state icon, later, wins where it matches.
    rules: [fillRule, colorRule, iconRule].filter((r): r is Rule => r !== undefined),
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

/** The share of the state layer's width its line is fitted to, so the app's
 * own font metrics, a little wider than the measurer's, still fit. */
const STATE_FIT_SLACK = 0.92;

/** Whether One Look draws this face's state in the Pill style's capsule:
 * the centred layout, with the style on and a box for the state. */
function drawsPill(face: Face): boolean {
  const layout = face.model.layout;
  return face.model.style.statePill && layout.mode === "centred" && layout.stateRect !== undefined && layout.state !== undefined;
}

/** The state's pill: a black capsule at One Look's pill opacity over the
 * state's box (its padding included), just under the State layer. */
function statePillLayer(face: Face): Element | undefined {
  const rect = face.model.layout.stateRect;
  if (!drawsPill(face) || rect === undefined) return undefined;
  const alpha = Math.round(ONE_LOOK_PILL_OPACITY * 255).toString(16).padStart(2, "0").toUpperCase();
  const payload: ShapeElement = {
    id: BASE_STATE_PILL_ID,
    name: BASE_STATE_PILL_NAME,
    colorSlot: { baseColorHex: `#000000${alpha}` },
    rules: [],
    frame: frameOf(rect, face.box),
    isHidden: false,
    kind: "capsule",
    cornerRadius: 0,
    thickness: 1,
    borderWidth: 0,
  };
  return { kind: "shape", payload };
}

/** The state layer: the state line's box, widened to the room the layout
 * leaves it (in the Pill style the pill's box, the line centred in it), in
 * One Look's own state type as rich text (round two, section 13.4): the
 * layer in the number's type (bold, rounded, tabular digits, the main ink at
 * the fitted size), and four parts, each reading one piece of the line: the
 * figure in the layer's type, the unit smaller, semibold, in the main ink at
 * One Look's unit opacity, the tail regular in the second ink at the word
 * size, and the word regular in the second ink. The pieces a line does not
 * have are empty and draw nothing, so it turns from a number into a word
 * live, with no rule. */
function stateLayer(face: Face, ctx?: BaseLayerContext): Element | undefined {
  const { model, box } = face;
  const layout = model.layout;
  const state = layout.state;
  if (state === undefined) return undefined;
  const w = layout.size.width;
  const pill = drawsPill(face);
  const line: OneLookRect = layout.mode === "centred" && layout.stateRect !== undefined
    ? layout.stateRect
    : { x: layout.textOrigin.x, y: layout.textOrigin.y + layout.name.lines.length * layout.nameLineHeight, width: layout.textWidth, height: layout.stateLineHeight };
  const m = oneLookLayoutMetrics(layout, "watch");
  // Up to the glyph's left edge when the glyph is beside the line, else to
  // the tile's right inset; in a pill, the pill's own box.
  const glyph = layout.discRect.width > 0 ? (layout.glyphInk ?? layout.discRect) : undefined;
  const beside = glyph !== undefined && glyph.x > line.x && glyph.y < line.y + line.height && glyph.y + glyph.height > line.y;
  const right = beside ? glyph.x - ONE_LOOK_GLYPH_STATE_GAP : w - layout.insetH;
  const width = pill ? line.width : Math.max(line.width, right - line.x);
  // The room the line itself has: in a pill, less its padding each side.
  const room = pill ? Math.max(1, width - 2 * Math.round(m.wordSize * ONE_LOOK_PILL_PAD_H)) : width;
  const size = state.size;
  // The line shown now, measured as One Look draws it, can need more room
  // than One Look's own shrink floor leaves it (the iPhone's face is wider
  // than the watch's), so the floor goes low enough for it to fit on both,
  // with a little slack for the apps' own font metrics, never under half.
  const drawn = model.kind.stateHidden ? 0 : Math.max(oneLookStateWidth(state, m, face.measurer), oneLookStateWidth(state, m, face.phoneMeasurer));
  const fits = drawn > 0 ? Math.floor(((room * STATE_FIT_SLACK) / drawn) * 100) / 100 : 1;
  // The inks follow on and off as the glyph's do: for a kind lit when on,
  // the off face's inks, with a rule per ink that takes the on face's while
  // the entity is on (the layer's ink reaches the figure, the unit, tail and
  // word have their own), so "Off" turns the second ink as the line does.
  const inks = (f: Face | undefined) => f === undefined ? undefined : {
    ink: inkHex(f.model.palette.ink),
    unit: inkHex({ rgb: f.model.palette.ink.rgb, opacity: f.model.palette.ink.opacity * ONE_LOOK_UNIT_OPACITY }),
    ink2: inkHex(f.model.palette.ink2),
  };
  let base = inks(face)!;
  let lit: typeof base | undefined;
  if (ctx !== undefined && LIT_ON_KINDS.has(tileKind(tileEntityId(face.tile)))) {
    const at = facesAt(face.tile, ctx);
    const on = inks(at("on"));
    const off = inks(at("off"));
    if (on !== undefined && off !== undefined) {
      base = off;
      lit = on;
    }
  }
  const litRule = (rule: number, key: keyof typeof base, partId?: string): Rule | undefined => {
    if (lit === undefined || ctx === undefined || lit[key] === base[key]) return undefined;
    return {
      id: baseRuleId("state", rule, 0, 1),
      ...(partId === undefined ? {} : { partId }),
      cases: [{
        id: baseRuleId("state", rule, 1, 2),
        when: { join: "all", tests: [{ id: baseRuleId("state", rule, 1, 3), value: entityValue(face.tile, ctx.states), comparison: { kind: "isOn" } }] },
        then: [{ kind: "setColor", value: literal(lit[key]) }],
      }],
    };
  };
  const part = (piece: TileStatePart, look: Omit<TextPart, "id" | "value"> = {}): TextPart => ({
    id: BASE_STATE_PART_IDS[piece],
    value: { kind: { kind: "tileState", part: piece } },
    ...look,
  });
  const parts: TextPart[] = TILE_STATE_PARTS.map((piece) => {
    switch (piece) {
      case "figure": return part(piece);
      case "unit": return part(piece, {
        fontSize: round(state.unitSize, 2),
        fontWeight: "semibold",
        colorHex: base.unit,
      });
      case "tail": return part(piece, { fontSize: round(state.tailSize, 2), fontWeight: "regular", fontDesign: "default", colorHex: base.ink2 });
      case "word": return part(piece, { fontWeight: "regular", fontDesign: "default", colorHex: base.ink2 });
    }
  });
  const rules = [
    litRule(1, "ink"),
    litRule(2, "unit", BASE_STATE_PART_IDS.unit),
    litRule(3, "ink2", BASE_STATE_PART_IDS.tail),
    litRule(4, "ink2", BASE_STATE_PART_IDS.word),
  ].filter((r): r is Rule => r !== undefined);
  const payload: TextElement = {
    id: BASE_LAYER_IDS.state,
    name: BASE_LAYER_NAMES.state,
    colorSlot: { baseColorHex: base.ink },
    rules,
    frame: frameOf({ x: line.x, y: line.y, width, height: line.height }, box),
    isHidden: false,
    value: richTextFallback(parts),
    fontSize: round(size, 2),
    fontWeight: "bold",
    fontDesign: "rounded",
    monospacedDigits: true,
    lineLimit: 1,
    minimumScale: round(Math.min(1, Math.max(0.5, Math.min(m.textMin / size, fits))), 2),
    alignment: pill ? "center" : "leading",
    parts,
  };
  if (model.palette.textShadow && model.style.stateShadow) payload.shadow = { ...TEXT_SHADOW };
  return { kind: "text", payload };
}

/**
 * A tile's base layers in draw order (the glyph or photo, the state's pill
 * in the Pill style, the state, the name), made from its simple settings and
 * One Look's layout at the tile's design box, each looking as much like the
 * part One Look draws as a layer can. Empty for a tile whose kind has no
 * layers, and for one One Look does not draw. They come out as a saved
 * document reads back (every key at its default left out), so a layer read
 * from a design compares equal to the one built now.
 */
export function baseLayers(tile: WatchPageTile, ctx: BaseLayerContext): Element[] {
  if (!tileHasLayers(tile)) return [];
  const face = faceOf(tile, ctx);
  if (face === undefined) return [];
  const built = [glyphLayer(face.tile, ctx, face), statePillLayer(face), stateLayer(face, ctx), nameLayer(face)].filter((el): el is Element => el !== undefined);
  const cfg = newConfig("", 0, TILE_DESIGN_FAMILY);
  cfg.elements = built;
  return parseConfig(encodeConfig(cfg)).elements;
}

/** Each base layer `baseLayers` builds, by its id (upper case). */
export function baseLayersById(tile: WatchPageTile, ctx: BaseLayerContext): Map<string, Element> {
  return new Map(baseLayers(tile, ctx).map((el) => [el.payload.id.toUpperCase(), el]));
}

/** The base layers as a design's document (section 1.1): the tile's id and
 * name, one rectangular layout, in the panel's normal form. */
export function baseLayersDocument(tile: WatchPageTile, ctx: BaseLayerContext): CustomComplicationConfig {
  const cfg = newConfig(tileValuesFor(tile, ctx).name, 0, TILE_DESIGN_FAMILY);
  if (typeof tile.id === "string" && tile.id !== "") cfg.id = tile.id.toUpperCase();
  cfg.elements = baseLayers(tile, ctx);
  return normalizeDesignDoc(cfg);
}

// ── anchors ──────────────────────────────────────────────────────────────

/**
 * Each base role's anchor (round two, section 13.1): the native part of the
 * tile's One Look face at its design box on the watch, the face its base
 * layers are built from, as fractions of the box and reference sizes,
 * rounded as the layers are. Only roles with a base layer have one: the
 * icon or the photo, whichever the glyph is, the name and the state. Empty
 * for a tile with no layers or no face.
 */
export function baseAnchors(tile: WatchPageTile, ctx: BaseLayerContext): TileAnchors {
  if (!tileHasLayers(tile)) return {};
  const face = faceOf(tile, ctx);
  if (face === undefined) return {};
  const { model, box } = face;
  const native = tileNativeFrames(model.layout, "watch");
  const out: TileAnchors = {};
  if (model.photo !== undefined) {
    if (native.photo !== undefined) out.photo = anchorOf(native.photo, box);
  } else if (model.baseIcon !== "" && native.icon !== undefined) {
    out.icon = anchorOf(native.icon, box);
  }
  if (model.name !== "" && native.name !== undefined) out.name = anchorOf(native.name, box);
  if (native.state !== undefined) out.state = anchorOf(native.state, box);
  return out;
}

/** The screen a device's native frames are read on for the fixtures and
 * tests: the 46 mm watch, and a 402 point iPhone in the iPhone look. */
export const TILE_NATIVE_SCREENS: Readonly<Record<OneLookDevice, number>> = Object.freeze({ watch: TILE_DESIGN_SCREEN_WIDTH, phone: 402 });

/**
 * A tile's drawn size and native parts on a device `screenWidth` points
 * wide, as that device lays it out: on the watch the tile as the watch
 * holds it (its pull's colour), on the iPhone as stored in the iPhone look.
 * The watch at 208 is exactly the face the base layers are built from.
 * Undefined when One Look draws no face for it.
 */
export function tileNativeFramesOn(
  stored: WatchPageTile,
  ctx: BaseLayerContext,
  device: OneLookDevice,
  screenWidth: number = TILE_NATIVE_SCREENS[device],
): { drawnSize: { width: number; height: number }; native: TileNativeFrames } | undefined {
  const tile = device === "watch" ? watchSyncedTile(stored, ctx.page) : stored;
  const g = tileGeometry(tile);
  const unit = oneLookGridUnit(screenWidth, device);
  const drawnSize = oneLookDrawnSize(g.colSpan, g.rowSpan, unit, device);
  const cell = oneLookCellSize(g.colSpan, g.rowSpan, unit);
  const base = previewInput(tile, ctx, ctx.states);
  const input: WatchPagePreviewInput = device === "phone"
    ? { ...base, screen: { width: screenWidth, height: screenWidth * 2 }, phone: phonePagesLayout(undefined, { look: "iphone" }) }
    : { ...base, screen: { width: screenWidth, height: screenWidth } };
  const measurer = device === "watch" ? (ctx.measurer ?? measurerFor(ctx.icons)) : phoneMeasurer(ctx);
  const model = oneLookPreviewModel({
    tile, input, stub: false, device, look: watchSpecialTileLook(tile, input),
    width: drawnSize.width, height: drawnSize.height, cell, unit, box: "", s: 1, measurer,
  });
  return model === undefined ? undefined : { drawnSize, native: tileNativeFrames(model.layout, device) };
}
