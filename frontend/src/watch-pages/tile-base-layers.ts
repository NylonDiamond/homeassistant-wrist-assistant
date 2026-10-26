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
  type TileInks,
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
import {
  type OneLookGlyphHalo,
  type OneLookInk,
  type OneLookPalette,
  ONE_LOOK_PILL_OPACITY,
  ONE_LOOK_UNIT_OPACITY,
  oneLookGlyphGlowOf,
  oneLookGlyphHalo,
  oneLookGlyphInk,
  oneLookHex,
} from "./one-look/colour.js";
import { type OneLookStateLine, oneLookStateFor } from "./one-look/state.js";
import { type OneLookDevice, oneLookCellSize, oneLookCentredGlyph, oneLookDrawnSize, oneLookGridUnit, oneLookMetrics } from "./one-look/metrics.js";
import { type OneLookRect, ONE_LOOK_GLYPH_INK_SHARE, ONE_LOOK_GLYPH_STATE_GAP, ONE_LOOK_PILL_PAD_H, oneLookLayoutMetrics } from "./one-look/layout.js";
import { oneLookMeasurer } from "./one-look/measurer.js";
import { ONE_LOOK_WATCH_TAIL_COLUMNS, type TextMeasurer, glyphExtentOf, oneLookStateWidth } from "./one-look/text.js";
import { phonePagesLayout } from "../phone-frame.js";
import { type TileNativeFrames, anchorOf, tileNativeFrames } from "./tile-anchors.js";
import {
  type BaseLayerRole,
  type TileAnchors,
  BASE_GLOW_ID,
  BASE_GLOW_NAME,
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

/** The One Look model of the reference watch face the base layers are built
 * from (the tile at its design box on the 46 mm watch), or undefined when
 * One Look draws none. For the fixtures' `halo`. */
export function baseLayerFaceModel(tile: WatchPageTile, ctx: BaseLayerContext): OneLookPreviewModel | undefined {
  return faceOf(tile, ctx)?.model;
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
 * the device shows one (`showsTail`); a word in full; nothing for none.
 */
export function oneLookStateLineText(line: OneLookStateLine, colSpan: number, device: OneLookDevice = "watch"): string {
  if (line.kind === "none") return "";
  if (line.kind === "word") return line.word;
  const tail = line.tail !== undefined && showsTail(line, colSpan, device) ? ` ${line.tail}` : "";
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
export function oneLookStateLineParts(line: OneLookStateLine, colSpan: number, device: OneLookDevice = "watch"): TileStateParts {
  if (line.kind === "none") return { ...NO_STATE_PARTS };
  if (line.kind === "word") return { ...NO_STATE_PARTS, word: line.word };
  const tail = line.tail !== undefined && showsTail(line, colSpan, device) ? ` ${line.tail}` : "";
  const unit = line.unit === undefined ? "" : (line.unitSpaced === true ? " " : "") + line.unit;
  return { figure: line.figure, unit, tail, word: "" };
}

/** Whether a number's tail shows, by the native fitter's rule: the iPhone
 * always keeps it; the watch drops it under 8 columns unless the line keeps
 * it (contract section 5.1, the apps' `OneLookTextFitter.dropsTail`). */
function showsTail(line: OneLookStateLine & { kind: "number" }, colSpan: number, device: OneLookDevice): boolean {
  return device !== "watch" || line.keepTail === true || colSpan >= ONE_LOOK_WATCH_TAIL_COLUMNS;
}

const NO_STATE_PARTS: Readonly<TileStateParts> = Object.freeze({ figure: "", unit: "", tail: "", word: "" });

/** A tile's own words for `ResolveContext.tileValues`: its state line as
 * text ("" while its entity has not loaded), the same line in its four
 * pieces, and its name (its label, else the friendly name, else the entity
 * id), whether or not the label shows. `device` is the frame the words
 * draw in, for the tail rule (the watch unless the iPhone frame says so).
 * With them the inks of the reference watch face (round four, section
 * 15.3), absent when One Look draws no face for the tile; a frame drawing
 * the tile hands its own face's in their place. */
export function tileValuesFor(tile: WatchPageTile, ctx: BaseLayerContext, device: OneLookDevice = "watch"): { state: string; name: string; stateParts: TileStateParts; inks?: TileInks } {
  const face = faceOf(tile, ctx);
  const name = watchPreviewTileLabel(face?.tile ?? tile, face?.input ?? previewInput(tile, ctx, ctx.states));
  if (face === undefined) return { state: "", name, stateParts: { ...NO_STATE_PARTS } };
  const inks = tileInksOf(face.model.palette, face.model.layout.drawsDisc, "watch");
  const ks = face.model.kind;
  if (ks.stateHidden) return { state: "", name, stateParts: { ...NO_STATE_PARTS }, inks };
  const line = oneLookStateFor(ks, false);
  return { state: oneLookStateLineText(line, face.model.colSpan, device), name, stateParts: oneLookStateLineParts(line, face.model.colSpan, device), inks };
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

const WHITE: readonly [number, number, number] = [255, 255, 255];

/**
 * The tile inks of a palette, as the native tile draws its parts with them
 * (round four, section 15.3): the figure's and name's ink, the tail's and
 * word's second ink, the unit's (the ink at One Look's unit opacity), the
 * glyph's (`oneLookGlyphInk` with the layout's disc, centred as the device
 * centres it), the tile's hue (white with none) and that hue clear. Each a
 * hex as the documents write one.
 */
export function tileInksOf(palette: OneLookPalette, drawsDisc: boolean, device: OneLookDevice): TileInks {
  const hue = oneLookHex(palette.hue ?? [...WHITE]);
  return {
    ink: inkHex(palette.ink),
    ink2: inkHex(palette.ink2),
    unit: inkHex({ rgb: palette.ink.rgb, opacity: palette.ink.opacity * ONE_LOOK_UNIT_OPACITY }),
    glyph: inkHex(oneLookGlyphInk(palette, drawsDisc, oneLookCentredGlyph(device))),
    hue,
    hueClear: `${hue}00`,
  };
}

/** A face's tile inks, as the base layers write them beside their
 * references. */
function faceInks(face: Face): TileInks {
  return tileInksOf(face.model.palette, face.model.layout.drawsDisc, "watch");
}

/** A hex as the documents write one: "#" and upper case. */
function normalHex(value: string): string {
  const body = value.trim().replace(/^#/, "");
  return `#${body.toUpperCase()}`;
}

/** The kinds whose lit state is `on`: their symbol and glow follow on and
 * off by a rule. */
const LIT_ON_KINDS: ReadonlySet<string> = new Set(["light", "switch", "input_boolean", "fan", "siren", "humidifier", "automation"]);

/** One Look's text shadow on a coloured fill (`OneLookViews.TextShadow`). */
const TEXT_SHADOW = Object.freeze({ colorHex: "#00000040", radius: 0.75, dx: 0, dy: 0.5 });
/** The glyph's shadow with Icon Shadow on (`glyphShadowOpacity`, `glyphShadowRadius`). */
const GLYPH_SHADOW = Object.freeze({ colorHex: "#00000080", radius: 2, dx: 0, dy: 1 });

/** Fixed ids for the rules a base layer carries, so a rebuild writes the
 * same document: the role, the rule, the case and the part (1 the rule, 2
 * the case, 3 its test). */
function baseRuleId(role: BaseLayerRole | "glow", rule: number, caseIndex: number, part: 1 | 2 | 3): string {
  const r = { icon: 1, photo: 2, name: 3, state: 4, glow: 6 }[role];
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

/** The glow One Look draws behind the glyph in a face, with the tile's glow
 * setting, or undefined when it draws none then. */
function haloOf(face: Face | undefined): OneLookGlyphHalo | undefined {
  if (face === undefined) return undefined;
  const m = face.model;
  return oneLookGlyphHalo(m.palette, {
    centred: oneLookCentredGlyph("watch"),
    picture: m.picture !== "none",
    hasIcon: m.baseIcon !== "",
    photo: m.photo !== undefined,
  }, m.style.glow);
}

/** A glow's opacity in a face, 0 when it draws none. */
function glowOpacityOf(face: Face | undefined): number {
  return haloOf(face)?.opacity ?? 0;
}

/** The glyph box in a face, a square of side `glyphSize` on the glyph's
 * centre, or undefined with no bare glyph. */
function glyphBoxOf(face: Face): OneLookRect | undefined {
  const layout = face.model.layout;
  const disc = layout.discRect;
  const g = layout.glyphSize;
  if (!(disc.width > 0) || !(g > 0) || layout.drawsDisc) return undefined;
  const cx = disc.x + disc.width / 2;
  const cy = disc.y + disc.height / 2;
  return { x: cx - g / 2, y: cy - g / 2, width: g, height: g };
}

/** The glow's brightness from the tile's faces, as the icon's rules read
 * them (section 14.4): for a kind lit when on its on and off faces, else the
 * face now, and the unavailable face. `M` is the brightest, which the layer
 * is built at; `giver` the face that has it. */
function glowFaces(tile: WatchPageTile, face: Face, tileAt: FacesAt): { M: number; aOn: number; aOff: number; u: number; onOff: boolean; giver: Face | undefined } {
  const onOffKind = LIT_ON_KINDS.has(tileKind(tileEntityId(tile)));
  const u = glowOpacityOf(tileAt("unavailable"));
  if (!onOffKind) {
    const now = glowOpacityOf(face);
    return { M: now, aOn: now, aOff: now, u, onOff: false, giver: face };
  }
  const on = tileAt("on");
  const off = tileAt("off");
  const aOn = glowOpacityOf(on);
  const aOff = glowOpacityOf(off);
  return { M: Math.max(aOn, aOff), aOn, aOff, u, onOff: aOn !== aOff, giver: aOn >= aOff ? on : off };
}

/**
 * The glyph's glow (tile layers round three, section 14.4): a circle shape
 * on the glow One Look draws behind a bare glyph, a radial fill from the
 * glow's colour to clear, as wide as the glow, at the brightest opacity any
 * face of the tile draws it, with one rule that dims it to the face the
 * entity is in (on, off, unavailable) as the native glow does. Undefined
 * with no bare glyph or no face that draws a glow.
 */
function glowLayer(tile: WatchPageTile, face: Face, tileAt: FacesAt, ctx: BaseLayerContext): Element | undefined {
  const glyph = glyphBoxOf(face);
  if (glyph === undefined) return undefined;
  const { M, aOn, aOff, u, onOff, giver } = glowFaces(tile, face, tileAt);
  const halo = haloOf(giver);
  if (!(M > 0) || halo === undefined) return undefined;
  const hex = oneLookHex(halo.rgb);
  // In the tile's colour, the glow names the tile's hue (round four, section
  // 15.3), so it follows a change of the tile's colour as the native one
  // does. White and a colour of the user's are constants.
  const live = face.model.style.glow.colour.kind === "tile";
  const d = glyph.width * (face.model.style.glow.size / 100);
  const cx = glyph.x + glyph.width / 2;
  const cy = glyph.y + glyph.height / 2;
  const r = (a: number) => round(a / M, 4);
  const rest = onOff ? r(aOff) : 1;
  const value = entityValue(tile, ctx.states);
  const cases: RuleCase[] = [];
  const addCase = (comparison: Comparison, opacity: number) => {
    const at = cases.length + 1;
    cases.push({
      id: baseRuleId("glow", 1, at, 2),
      when: { join: "all", tests: [{ id: baseRuleId("glow", 1, at, 3), value, comparison }] },
      then: [{ kind: "setOpacity", number: opacity }],
    });
  };
  if (r(u) !== rest) addCase({ kind: "isUnavailable" }, r(u));
  if (onOff) addCase({ kind: "isOn" }, r(aOn));
  const rules: Rule[] = cases.length === 0 ? [] : [{
    id: baseRuleId("glow", 1, 0, 1),
    cases,
    ...(onOff ? { otherwise: [{ kind: "setOpacity" as const, number: r(aOff) }] } : {}),
  }];
  const payload: ShapeElement = {
    id: BASE_GLOW_ID,
    name: BASE_GLOW_NAME,
    colorSlot: live ? { baseColorHex: hex, tileInk: "hue" } : { baseColorHex: hex },
    rules,
    frame: frameOf({ x: cx - d / 2, y: cy - d / 2, width: d, height: d }, face.box),
    isHidden: false,
    kind: "circle",
    cornerRadius: 0,
    thickness: 1,
    borderWidth: 0,
    fill: {
      kind: "radial",
      stops: live
        ? [{ at: 0, colorHex: hex, tileInk: "hue" }, { at: 1, colorHex: `${hex}00`, tileInk: "hueClear" }]
        : [{ at: 0, colorHex: hex }, { at: 1, colorHex: `${hex}00` }],
    },
  };
  const opacity = round(M, 4);
  if (opacity < 1) payload.opacity = opacity;
  return { kind: "shape", payload };
}

/**
 * What the Glow layer's own editor measures against (section 14.8): the
 * glyph box as fractions of the design box, the brightest opacity this tile
 * would draw its glow at with the brightness at 100 (with the mode on in
 * place of auto or off when those draw none), and the tile's colour as a hex
 * (white with none). Undefined with no face or no bare glyph.
 */
export function glowReference(tile: WatchPageTile, ctx: BaseLayerContext): { box: NormalizedFrame; opacity: number; tileHex: string } | undefined {
  if (!tileHasLayers(tile)) return undefined;
  const face = faceOf(tile, ctx);
  if (face === undefined) return undefined;
  const glyph = glyphBoxOf(face);
  if (glyph === undefined) return undefined;
  const stored = oneLookGlyphGlowOf(tile.iconGlow);
  const at100 = (mode: typeof stored.mode) => {
    const probe: WatchPageTile = { ...tile, iconGlow: { mode, brightness: 100 } };
    const pf = faceOf(probe, ctx);
    return pf === undefined ? 0 : glowFaces(pf.tile, pf, facesAt(probe, ctx)).M;
  };
  let opacity = at100(stored.mode === "off" ? "on" : stored.mode);
  if (!(opacity > 0) && stored.mode !== "on") opacity = at100("on");
  const hue = face.model.palette.hue;
  return { box: frameOf(glyph, face.box), opacity: round(opacity, 4), tileHex: hue === undefined ? "#FFFFFF" : oneLookHex(hue) };
}

/** The glyph layer: the person's photo, or the symbol. */
function glyphLayer(tile: WatchPageTile, ctx: BaseLayerContext, face: Face, faces?: FacesAt): Element | undefined {
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
  const tileAt = faces ?? facesAt(tile, ctx);
  const { symbol, rule: fillRule } = symbolRule(tile, ctx, face, tileAt);
  // The glyph's ink is the tile's live glyph ink (round four, section 15.3):
  // it follows on and off, the tile's colour and every other palette change
  // by itself, the face's ink now beside it for a reader without inks.
  const extent = Math.max(0.5, glyphExtentOf(face.measurer, model.baseIcon));
  const payload: IconElement = {
    id: BASE_LAYER_IDS.icon,
    name: BASE_LAYER_NAMES.icon,
    colorSlot: { baseColorHex: faceInks(face).glyph, tileInk: "glyph" },
    // The fill rule first: a per state icon, later, wins where it matches.
    rules: [fillRule, iconRule].filter((r): r is Rule => r !== undefined),
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
  // A Label Color of the tile's own is a constant; else the name takes the
  // tile's live ink (round four, section 15.3).
  const labelColour = model.picture === "none" && model.style.nameColour !== undefined ? normalHex(model.style.nameColour) : undefined;
  const design = FONT_DESIGNS[model.style.nameDesign] ?? "default";
  const payload: TextElement = {
    id: BASE_LAYER_IDS.name,
    name: BASE_LAYER_NAMES.name,
    colorSlot: labelColour !== undefined ? { baseColorHex: labelColour } : { baseColorHex: faceInks(face).ink, tileInk: "ink" },
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
 * live, with no rule. The figure keeps One Look's tracking, and every ink
 * names the tile's live ink (round four, sections 15.2 and 15.3). */
function stateLayer(face: Face): Element | undefined {
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
  // The inks are the tile's live ones (the layer's reaches the figure; the
  // unit, tail and word name their own), the face's now beside each, so
  // "Off" turns the second ink as the line does, with no rule.
  const inks = faceInks(face);
  const part = (piece: TileStatePart, look: Omit<TextPart, "id" | "value"> = {}): TextPart => ({
    id: BASE_STATE_PART_IDS[piece],
    value: { kind: { kind: "tileState", part: piece } },
    ...look,
  });
  const parts: TextPart[] = TILE_STATE_PARTS.map((piece) => {
    switch (piece) {
      case "figure": return part(piece, { tracking: round(oneLookMetrics("watch").nameTracking, 4) });
      case "unit": return part(piece, {
        fontSize: round(state.unitSize, 2),
        fontWeight: "semibold",
        colorHex: inks.unit,
        tileInk: "unit",
      });
      case "tail": return part(piece, { fontSize: round(state.tailSize, 2), fontWeight: "regular", fontDesign: "default", colorHex: inks.ink2, tileInk: "ink2" });
      case "word": return part(piece, { fontWeight: "regular", fontDesign: "default", colorHex: inks.ink2, tileInk: "ink2" });
    }
  });
  const payload: TextElement = {
    id: BASE_LAYER_IDS.state,
    name: BASE_LAYER_NAMES.state,
    colorSlot: { baseColorHex: inks.ink, tileInk: "ink" },
    rules: [],
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
  const tileAt = facesAt(face.tile, ctx);
  const built = [glowLayer(face.tile, face, tileAt, ctx), glyphLayer(face.tile, ctx, face, tileAt), statePillLayer(face), stateLayer(face), nameLayer(face)].filter((el): el is Element => el !== undefined);
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
  // The glow's anchor goes with the glyph's (section 14.6); a write keeps it
  // only while the design holds a Glow layer.
  if ((out.photo !== undefined || out.icon !== undefined) && native.glow !== undefined) out.glow = anchorOf(native.glow, box);
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
