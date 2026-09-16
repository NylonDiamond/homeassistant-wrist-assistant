// Layer presets: one button, one entity, a finished layer.
//
// The Layers card used to offer the schema's own vocabulary (text, icon,
// gauge, shape) and leave the author to assemble a working thing out of it.
// A preset is the intent instead: "toggle button" builds the icon, attaches
// the tap, and writes the on/off rule, all pointed at the entity the author
// picked once. Nothing here is stored in the document; a preset is a starting
// point that any later edit is free to take apart.
//
// Everything in this file is pure: it takes a config and mutates it, so the
// panel can run a whole preset inside one `Draft.update` and undo removes it
// in a single step.

import { CANVAS, type DrawableFamily } from "./renderer.js";
import type { HassEntityState } from "./ha-api.js";
import { buildStatesRule, type StatesRowInput } from "./states.js";
import {
  type CallServiceAction,
  type Comparison,
  type ControlSpec,
  type CustomComplicationConfig,
  type Element,
  type EntityRef,
  type FamilyKind,
  type ListDirection,
  type ListSource,
  type NormalizedFrame,
  type Rule,
  type StyleChange,
  type TapAction,
  type Value,
  CONTROL_DEFAULT_SYMBOL,
  DRAWABLE_FAMILIES,
  LIST_FAMILIES,
  controlEffectiveKind,
  defaultLayout,
  defaultLevel,
  TOGGLEABLE_DOMAINS,
  attachTap,
  literal,
  newElement,
  newRule,
  newStyleChange,
  seedTimelineBands,
} from "./model.js";

export type PresetKind =
  | "toggle" | "status" | "gauge" | "camera" | "chart" | "history" | "doorHistory"
  | "listEvents" | "listTodo" | "listHourly" | "listDaily"
  | "listLightsOn" | "listBatteries" | "listRecent" | "listScenes";

export interface PresetSpec {
  kind: PresetKind;
  /** The button's label, which is also the dialog's title. */
  title: string;
  /** One line under the entity search, so the promise stays visible while the
   * author is choosing. */
  blurb: string;
  /** Domains the entity search offers. Undefined means every domain. */
  domains?: readonly string[];
  /** Float entities whose state reads as a number to the top of the search. */
  preferNumeric?: boolean;
  /** How many layers it adds, for the 64-layer cap. A list counts as one: its
   * row layers live inside it and are not layers of the shape. */
  layerCount: number;
  /** Which group of buttons it sits in. */
  group?: "list";
  /** False for a preset that asks nothing: it is built the moment the button
   * is clicked, because a scope filter is edited afterwards rather than
   * chosen up front. Defaults to true. */
  needsEntity?: boolean;
  /** Only offered on these shapes. Undefined means every shape with a canvas. */
  families?: readonly FamilyKind[];
}

export const LAYER_PRESETS: readonly PresetSpec[] = [
  {
    kind: "toggle",
    title: "Toggle button",
    blurb: "An icon that toggles the entity when tapped and looks different while it is on.",
    domains: TOGGLEABLE_DOMAINS,
    layerCount: 2,
  },
  {
    kind: "status",
    title: "Status text",
    blurb: "The entity's state as one line of text, dimmed while it is unavailable.",
    layerCount: 1,
  },
  {
    kind: "gauge",
    title: "Sensor gauge",
    blurb: "An arc that fills with the entity's reading and changes colour across three bands.",
    preferNumeric: true,
    layerCount: 1,
  },
  {
    kind: "chart",
    title: "Forecast chart",
    blurb: "A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",
    layerCount: 1,
  },
  {
    kind: "history",
    title: "History chart",
    blurb: "A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",
    preferNumeric: true,
    layerCount: 1,
  },
  {
    kind: "doorHistory",
    title: "Door history",
    blurb: "A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",
    domains: ["binary_sensor", "cover"],
    layerCount: 2,
  },
  {
    kind: "camera",
    title: "Camera",
    blurb: "The camera's latest snapshot, filling the face.",
    domains: ["camera"],
    layerCount: 1,
  },
  {
    kind: "listEvents",
    title: "Next events",
    blurb: "The next three events from one calendar, each with the time it starts.",
    domains: ["calendar"],
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
  },
  {
    kind: "listTodo",
    title: "To-do",
    blurb: "Open items from one list. Tap a row to complete it.",
    domains: ["todo"],
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
  },
  {
    kind: "listHourly",
    title: "Hourly forecast",
    blurb: "Six hours across the face: the time, the weather and the temperature.",
    domains: ["weather"],
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
  },
  {
    kind: "listDaily",
    title: "Daily forecast",
    blurb: "Five days across the face: the day, the weather, the high and the low.",
    domains: ["weather"],
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
  },
  {
    kind: "listLightsOn",
    title: "Lights on",
    blurb: "Every light that is on, one per row. Tap a row to turn that light off.",
    layerCount: 1,
    group: "list",
    needsEntity: false,
    families: LIST_FAMILIES,
  },
  {
    kind: "listBatteries",
    title: "Low batteries",
    blurb: "Your battery sensors, emptiest first, each with a bar that runs down as it does.",
    layerCount: 1,
    group: "list",
    needsEntity: false,
    families: LIST_FAMILIES,
  },
  {
    kind: "listRecent",
    title: "Recent activity",
    blurb: "Whatever changed most recently, newest first, with how long ago it was.",
    layerCount: 1,
    group: "list",
    needsEntity: false,
    families: LIST_FAMILIES,
  },
  {
    kind: "listScenes",
    title: "Scenes grid",
    blurb: "Your scenes as a two by two grid. Tap a cell to run that scene.",
    layerCount: 1,
    group: "list",
    needsEntity: false,
    families: LIST_FAMILIES,
  },
];

export function presetSpec(kind: PresetKind): PresetSpec {
  return LAYER_PRESETS.find((p) => p.kind === kind) ?? LAYER_PRESETS[0]!;
}

/** What a preset knows about the world beyond the entity it was given. */
export interface PresetEnv {
  /** The shape being edited. New layers are framed for it and belong to it. */
  family: DrawableFamily;
  /** The chosen entity's live state, when Home Assistant has one. Seeds the
   * gauge range and decides whether the text carries a unit. */
  state?: HassEntityState;
}

/** Amber reads as "live" on a black face; the grey is the system's secondary
 * label colour, which is what an off thing should look like. */
export const ACCENT_HEX = "#FF9F0A";
const MUTED_HEX = "#8E8E93";

/** The three band colours of a gauge, lowest reading first. Every hex here is
 * one `colorWords` can name, so a band cell reads "red" rather than "#FF453A". */
export type BandColors = readonly [string, string, string];

/** Low is bad: a battery at 10% should look alarming, and full should not. */
export const ALARM_LOW_RAMP: BandColors = ["#FF453A", "#FFD60A", "#34C759"];
/** Nothing is wrong with either end, so the ramp only says cool or warm. */
export const NEUTRAL_RAMP: BandColors = ["#0A84FF", "#34C759", "#FF9F0A"];

/**
 * Which way a gauge's colours run.
 *
 * Only a charge level has an end that is plainly bad, so only that gets the
 * red-to-green ramp. A temperature has no bad end, and neither does anything
 * whose class the entity never states, so both get the neutral one rather than
 * a colour that implies a judgement the panel cannot make.
 */
export function bandColors(state: HassEntityState | undefined): BandColors {
  const deviceClass = state?.attributes?.device_class;
  return deviceClass === "battery" ? ALARM_LOW_RAMP : NEUTRAL_RAMP;
}

// ── symbols ───────────────────────────────────────────────────────────────

export interface SymbolPair {
  /** Drawn while the entity is not on. Also the layer's own symbol. */
  off: string;
  /** Drawn while it is on. Equal to `off` when the catalogue has no filled
   * sibling, in which case the colour carries the state on its own. */
  on: string;
}

/**
 * Off and on symbols per domain.
 *
 * Every name here is in `symbols.ts`, which is the list checked against both
 * the real SF Symbols set and the icon pack the panel draws with, so a preset
 * never plants a name that shows up as a placeholder box.
 */
const DOMAIN_SYMBOLS: Record<string, SymbolPair> = {
  light: { off: "lightbulb", on: "lightbulb.fill" },
  switch: { off: "power", on: "power" },
  fan: { off: "fan.fill", on: "fan.fill" },
  input_boolean: { off: "circle", on: "circle.fill" },
  cover: { off: "curtains.closed", on: "window.casement" },
  lock: { off: "lock.open.fill", on: "lock.fill" },
  media_player: { off: "speaker.slash.fill", on: "speaker.wave.2.fill" },
  siren: { off: "bell.slash.fill", on: "bell.fill" },
  humidifier: { off: "humidifier.fill", on: "humidifier.fill" },
  valve: { off: "spigot.fill", on: "spigot.fill" },
  automation: { off: "gearshape.fill", on: "gearshape.fill" },
  script: { off: "play.fill", on: "play.fill" },
  scene: { off: "sparkles", on: "sparkles" },
  climate: { off: "thermometer.medium", on: "flame.fill" },
  binary_sensor: { off: "circle", on: "circle.fill" },
  group: { off: "circle", on: "circle.fill" },
};

/**
 * The pair a toggle button draws.
 *
 * A stored reference that already carries an SF Symbol name (the iPhone fills
 * `iconName` when it converts a preset) wins, because that is the entity's own
 * icon and nothing here can improve on it. Otherwise the domain decides, and
 * an unknown domain gets a plain dot, which is honest rather than wrong.
 */
export function toggleSymbols(ref: EntityRef): SymbolPair {
  const own = ref.iconName?.trim();
  if (own) return { off: own, on: own };
  return domainSymbolPair(ref) ?? { off: "circle", on: "circle.fill" };
}

/** The table's pair for one entity's domain, or nothing for a domain it does
 * not name. The lookup behind `toggleSymbols`, exported for a caller that has
 * to tell "the table knows this domain" from "the table has no opinion". */
export function domainSymbolPair(ref: EntityRef): SymbolPair | undefined {
  return DOMAIN_SYMBOLS[domainOf(ref)];
}

/**
 * The test that means "this entity is on".
 *
 * `isOn` is a literal state check on the watch, so a lock (locked/unlocked), a
 * cover (open/closed) and a media player (playing/paused) each need their own
 * word or the preset would ship a rule that can never match.
 */
export function onComparison(ref: EntityRef): Comparison {
  switch (domainOf(ref)) {
    case "lock": return { kind: "equals", value: literal("locked") };
    case "cover": case "valve": return { kind: "equals", value: literal("open") };
    case "media_player": return { kind: "equals", value: literal("playing") };
    default: return { kind: "isOn" };
  }
}

function domainOf(ref: EntityRef): string {
  return ref.domain || ref.entityId.split(".")[0] || "";
}

function withDomain(ref: EntityRef): EntityRef {
  return { ...ref, domain: domainOf(ref) };
}

// ── Control Center ────────────────────────────────────────────────────────

/** The name a seeded control prints: the entity's own, or its id when Home
 * Assistant gave it none. */
function entityTitle(ref: EntityRef): string {
  return ref.displayName.trim() || ref.entityId.trim();
}

/** Whether a title is one nobody typed, so a pick may replace it: blank, the
 * word `defaultControlSpec` falls back to, the document's own name, or the name
 * the previous entity seeded. A template or an entity read is the author's by
 * definition and always stands. */
function titleIsSpare(title: Value, documentName: string | undefined, previous: EntityRef | undefined): boolean {
  if (title.kind.kind !== "literal") return false;
  const text = title.kind.value.trim();
  if (text === "" || text === "Control") return true;
  if (documentName !== undefined && text === documentName.trim()) return true;
  return previous !== undefined && text === entityTitle(previous);
}

/** Whether a state row still reads the entity the action pointed at before. */
function statesEntity(state: Value | undefined, previous: EntityRef | undefined): boolean {
  if (state === undefined || previous === undefined) return false;
  return state.kind.kind === "entityState" && state.kind.entityId === previous.entityId;
}

/**
 * The Control Center rows the target entity can fill in: the title, the state a
 * toggle reads, the two symbols and the tint.
 *
 * Pure, and deliberately shy. A row is written only while it is still at its
 * default or still holds what the previous entity seeded, so picking a second
 * entity moves everything the panel wrote and nothing the author typed.
 * `previous` is the entity the action pointed at before this pick; without it
 * only the defaults are replaced. The value line, the status text and the kind
 * are never touched: nothing here can guess what a second line should say, and
 * the other two are decisions rather than details.
 *
 * The symbols and the tint are the Toggle button preset's own, so a control and
 * a layer pointed at one light look alike. A domain `DOMAIN_SYMBOLS` does not
 * name keeps the symbols it has rather than being handed a plain dot, which
 * would be a worse guess than the one already there.
 */
export function seedControlFromEntity(
  spec: ControlSpec,
  ref: EntityRef,
  previous?: EntityRef,
  documentName?: string,
): ControlSpec {
  if (ref.entityId.trim() === "") return spec;
  // A blank previous entity is no previous entity: every row still at its
  // default is fair game, and nothing matches a seed that never happened.
  const was = previous !== undefined && previous.entityId.trim() !== "" ? previous : undefined;
  const next: ControlSpec = { ...spec };
  const toggle = controlEffectiveKind(next) === "toggle";
  if (titleIsSpare(next.title, documentName, was)) next.title = literal(entityTitle(ref));
  // A button has no state to read, so it is never given one: a scene cannot be
  // off. An existing state is left where it is, the same as the card does when
  // the Kind row changes.
  if (toggle && (next.state === undefined || statesEntity(next.state, was))) next.state = entityStateValue(ref);
  const pair = domainSymbolPair(ref);
  if (pair !== undefined) {
    const before = was === undefined ? undefined : domainSymbolPair(was);
    if (next.symbol.trim() === "" || next.symbol === CONTROL_DEFAULT_SYMBOL
      || (before !== undefined && next.symbol === before.on)) next.symbol = pair.on;
    if (toggle && (next.symbolOff === undefined || (before !== undefined && next.symbolOff === before.off))) {
      // One symbol on both faces is the pair's own answer for a domain with no
      // filled sibling, and the card spells that as a blank off symbol.
      if (pair.off === pair.on) delete next.symbolOff; else next.symbolOff = pair.off;
    }
  }
  // One accent for every domain, which is the toggle preset's rule too, so
  // "still the accent" and "never set" are the same test.
  if (next.tintColorHex === undefined || next.tintColorHex === ACCENT_HEX) next.tintColorHex = ACCENT_HEX;
  return next;
}

// ── gauge range ───────────────────────────────────────────────────────────

/**
 * Where a gauge's arc starts and ends.
 *
 * A `number` or `input_number` states its own bounds, and those are always
 * right. Failing that the device class is the next best guess: a percentage is
 * a percentage, and a temperature depends on which scale the entity reports.
 * The last resort is 0 to 100, which at least makes the arc move.
 */
export function gaugeRange(state: HassEntityState | undefined): { min: number; max: number } {
  const attrs = state?.attributes ?? {};
  const min = attrs.min;
  const max = attrs.max;
  if (typeof min === "number" && typeof max === "number" && max > min) return { min, max };
  const deviceClass = typeof attrs.device_class === "string" ? attrs.device_class : "";
  const unit = typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : "";
  switch (deviceClass) {
    case "battery": case "humidity": case "moisture":
      return { min: 0, max: 100 };
    case "temperature":
      return unit.includes("F") ? { min: 0, max: 100 } : { min: -10, max: 40 };
    default:
      return unit === "%" ? { min: 0, max: 100 } : { min: 0, max: 100 };
  }
}

// ── geometry ──────────────────────────────────────────────────────────────

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function clamp(n: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, n));
}

/** A frame that many points wide and tall, in the middle of one shape's canvas. */
export function centredFrame(family: DrawableFamily, widthPt: number, heightPt: number): NormalizedFrame {
  const canvas = CANVAS[family];
  const width = clamp(round4(widthPt / canvas.width), 0, 1);
  const height = clamp(round4(heightPt / canvas.height), 0, 1);
  return { x: round4((1 - width) / 2), y: round4((1 - height) / 2), width, height, rotationDegrees: 0 };
}

/** What one preset layer looks like in one shape: its frame, and the size the
 * shape's placement should carry (font size, icon size or line width). */
export interface PresetGeometry {
  frame: NormalizedFrame;
  size?: number;
}

/** The three canvases are 181x65.5, 51x51 and 34x34 points, so a fraction that
 * looks right on one is wrong on the others. Every preset sizes itself from
 * the shape's own canvas instead. */
function toggleGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const side = clamp(Math.round(Math.min(canvas.width, canvas.height) * 0.55), 12, 30);
  // The frame is the tap target as well as the glyph's box, so it is a little
  // bigger than the glyph: a button the size of its own picture is hard to hit.
  return { frame: centredFrame(family, side * 1.3, side * 1.3), size: side };
}

function statusGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const size = clamp(Math.round(Math.min(canvas.width, canvas.height) * 0.3), 9, 20);
  return { frame: centredFrame(family, canvas.width * 0.88, size * 1.7), size };
}

function gaugeGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const side = Math.min(canvas.width, canvas.height) * 0.9;
  return { frame: centredFrame(family, side, side), size: Math.max(2.5, Math.round(side * 0.2) / 2) };
}

/** A wide, short band: a chart is read across, and on a rectangular tile it wants
 * the room the text lines above and below it are not using. The medium Home
 * Screen tile is the same kind of band, about twice as wide as it is tall. */
function chartGeometry(family: DrawableFamily): PresetGeometry {
  const wide = family === "rectangular" || family === "medium";
  return {
    frame: {
      x: 0.05,
      y: wide ? 0.34 : 0.3,
      width: 0.9,
      height: wide ? 0.42 : 0.4,
      rotationDegrees: 0,
    },
    size: 2,
  };
}

/** A strip along the bottom of the face, with room for one line above it. A
 * timeline is read across, and it needs less height than a chart because there
 * is nothing to plot: the whole reading is which colour is where. */
function timelineGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const height = clamp(Math.round(canvas.height * 0.2), 6, 14);
  return {
    frame: { x: 0.06, y: 0.56, width: 0.88, height: round4(height / canvas.height), rotationDegrees: 0 },
  };
}

/** The name above the strip: a strip of colour says nothing about what it is
 * of, and the entity is the one fact a reader needs to make sense of it. */
function timelineNameGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const size = clamp(Math.round(Math.min(canvas.width, canvas.height) * 0.26), 8, 15);
  return {
    frame: { x: 0.06, y: 0.2, width: 0.88, height: round4(clamp((size * 1.5) / canvas.height, 0, 1)), rotationDegrees: 0 },
    size,
  };
}

function cameraGeometry(): PresetGeometry {
  return { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 } };
}

function applySize(el: Element, size: number | undefined): void {
  if (size === undefined) return;
  if (el.kind === "text") el.payload.fontSize = size;
  else if (el.kind === "icon") el.payload.size = size;
  else if (el.kind === "gauge") el.payload.lineWidth = size;
  else if (el.kind === "chart") el.payload.lineWidth = size;
}

/**
 * Frame a new layer for the shape being edited, and put it on that shape.
 *
 * One shape, because that is where a layer lives. It used to fit the same
 * layer for all three at once, back when one layer was drawn by every shape.
 * A shape that wants this preset now gets a copy of its own, framed for its
 * own canvas by this same function.
 */
function placeLayer(
  cfg: CustomComplicationConfig,
  el: Element,
  active: DrawableFamily,
  geometry: (family: DrawableFamily) => PresetGeometry,
): void {
  const here = geometry(active);
  el.payload.frame = here.frame;
  applySize(el, here.size);
  const layout = cfg.perFamily[active] ?? (cfg.perFamily[active] = defaultLayout());
  layout.placements[el.payload.id] = {
    frame: here.frame,
    isHidden: false,
    ...(here.size !== undefined ? { size: here.size } : {}),
  };
}

// ── the presets ───────────────────────────────────────────────────────────

function layerOf<K extends Element["kind"]>(kind: K): Extract<Element, { kind: K }> {
  return newElement(kind) as Extract<Element, { kind: K }>;
}

function entityStateValue(ref: EntityRef, state?: HassEntityState): Value {
  const value: Value = { kind: { kind: "entityState", ...withDomain(ref) } };
  const unit = state?.attributes?.unit_of_measurement;
  if (typeof unit === "string" && unit.trim() !== "") value.format = { useEntityUnit: true };
  return value;
}

function setIconTo(name: string): StyleChange {
  const change = newStyleChange("setIcon");
  change.value = literal(name);
  return change;
}

function setColorTo(hex: string): StyleChange {
  const change = newStyleChange("setColor");
  change.value = literal(hex);
  return change;
}

/**
 * The rule behind a toggle button: one rule, one case, one test, all reading
 * the same entity state. That is exactly the shape the states table draws, so
 * a preset's own output never falls through to the Advanced editor.
 */
export function toggleRule(ref: EntityRef, symbols: SymbolPair): Rule {
  const rule = newRule();
  const onCase = rule.cases[0]!;
  const test = onCase.when.tests[0]!;
  test.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  test.comparison = onComparison(ref);
  const differs = symbols.on !== symbols.off;
  onCase.then = differs ? [setIconTo(symbols.on), setColorTo(ACCENT_HEX)] : [setColorTo(ACCENT_HEX)];
  rule.otherwise = differs ? [setIconTo(symbols.off), setColorTo(MUTED_HEX)] : [setColorTo(MUTED_HEX)];
  return rule;
}

/** The rule behind status text: dim the line while the entity has nothing to
 * say. Same shape as the toggle rule, one case on the same left-hand value. */
export function unavailableRule(ref: EntityRef): Rule {
  const rule = newRule();
  const only = rule.cases[0]!;
  const test = only.when.tests[0]!;
  test.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  test.comparison = { kind: "isUnavailable" };
  const dim = newStyleChange("setOpacity");
  dim.number = 0.35;
  only.then = [dim];
  return rule;
}

/**
 * A threshold that reads like a number a person would have typed.
 *
 * A third of 0 to 100 is 33.333…, which nobody wants to see in a row that says
 * "below 33.3333333". Anything ten or larger rounds to a whole number; smaller
 * bands keep one decimal, because rounding 0.67 to 1 would move the band.
 */
export function bandThreshold(n: number): string {
  const rounded = Math.abs(n) >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  return String(rounded);
}

/**
 * The three colour bands behind a sensor gauge: below the first third, between
 * the thirds, above the second.
 *
 * Built through `buildStatesRule` so the result is exactly the shape the states
 * table draws, and tested on the same value the gauge itself reads, because a
 * band that watched something else would disagree with the header chip above
 * it. The rows are checked top to bottom and the first match wins, so `below`,
 * `between` and `above` cover every reading between them with no overlap to
 * reason about.
 */
export function gaugeBandRule(ref: EntityRef, range: { min: number; max: number }, colors: BandColors = NEUTRAL_RAMP): Rule {
  const span = range.max - range.min;
  const low = bandThreshold(range.min + span / 3);
  const high = bandThreshold(range.min + (span * 2) / 3);
  const rows: StatesRowInput[] = [
    { comparison: { kind: "lessThan", value: literal(low) }, changes: [setColorTo(colors[0])] },
    { comparison: { kind: "between", value: literal(low), upper: literal(high) }, changes: [setColorTo(colors[1])] },
    { comparison: { kind: "greaterThan", value: literal(high) }, changes: [setColorTo(colors[2])] },
  ];
  return buildStatesRule(entityStateValue(ref), rows);
}

/** Icon, tap and on/off rule, all pointed at one entity. The two steps the
 * whole authoring layer exists for. */
export function addToggleButton(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("icon");
  const symbols = toggleSymbols(ref);
  el.payload.symbol = literal(symbols.off);
  el.payload.colorSlot.baseColorHex = MUTED_HEX;
  el.payload.rules = [toggleRule(ref, symbols)];
  placeLayer(cfg, el, env.family, toggleGeometry);
  cfg.elements.push(el);
  // attachTap re-runs syncAttachedTaps, so the tap picks up the per-shape
  // placements written just above without this having to copy them.
  attachTap(cfg, el.payload.id, { type: "toggleEntity", ...withDomain(ref) });
  return el.payload.id;
}

/** One line of text reading the entity's state, with its unit when it has one. */
export function addStatusText(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("text");
  el.payload.value = entityStateValue(ref, env.state);
  el.payload.rules = [unavailableRule(ref)];
  placeLayer(cfg, el, env.family, statusGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/** An arc bound to the entity, scaled to whatever range the entity implies. */
export function addSensorGauge(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("gauge");
  el.payload.value = entityStateValue(ref);
  const range = gaugeRange(env.state);
  el.payload.minValue = range.min;
  el.payload.maxValue = range.max;
  el.payload.rules = [gaugeBandRule(ref, range, bandColors(env.state))];
  placeLayer(cfg, el, env.family, gaugeGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/** A bar chart of whatever numbers the entity holds, both ends marked.
 *
 * Highlighting is on here where it is off by default, because the entity someone
 * reaches this preset with is a forecast, and "when is it cheapest" is the whole
 * question a forecast on a wrist is asked. */
export function addForecastChart(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("chart");
  el.payload.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  // The value itself, not history: a new chart starts on history, and this
  // preset exists for the one kind of entity that already holds the list.
  el.payload.historyMinutes = 0;
  el.payload.highlight = "both";
  el.payload.marker = "pointer";
  placeLayer(cfg, el, env.family, chartGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/** How an ordinary sensor has moved, from the recorder.
 *
 * The counterpart to the forecast chart, and the one most people actually want:
 * a forecast sensor holds a list, but every other sensor holds one number, and
 * pointing a chart at one of those draws a single bar. Six hours is the default
 * because it is long enough to show a shape and short enough that the recorder
 * still has it under any purge setting.
 *
 * A line rather than bars: a reading sampled every quarter hour is a continuous
 * quantity, and bars imply buckets that mean something. Highlights are on for
 * the same reason they are on the forecast preset: "when was it highest" is the
 * question someone charting a history came to ask. */
export function addHistoryChart(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("chart");
  el.payload.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  el.payload.historyMinutes = 360;
  el.payload.historyPoints = 24;
  el.payload.style = "line";
  el.payload.highlight = "both";
  el.payload.marker = "pointer";
  placeLayer(cfg, el, env.family, chartGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/**
 * When the door was open, as a strip, with its name above it.
 *
 * The counterpart to the history chart for everything that holds a word rather
 * than a number: a chart of a door draws nothing, because "open" is not a
 * reading. The colour table is seeded from the entity's own domain and device
 * class, so a door starts red while it is open and a plain switch starts amber
 * while it is on, and both are one edit away from anything else.
 */
export function addDoorHistory(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const name = layerOf("text");
  name.payload.value = literal(full.displayName || full.entityId);
  name.payload.colorSlot.baseColorHex = MUTED_HEX;
  placeLayer(cfg, name, env.family, timelineNameGeometry);
  cfg.elements.push(name);

  const deviceClass = env.state?.attributes?.device_class;
  const el = layerOf("timeline");
  el.payload.value = { kind: { kind: "entityState", ...full } };
  el.payload.bands = seedTimelineBands(full.domain, typeof deviceClass === "string" ? deviceClass : undefined);
  placeLayer(cfg, el, env.family, timelineGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/** The camera's snapshot, filling the face. */
export function addCameraLayer(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("image");
  el.payload.entity = withDomain(ref);
  placeLayer(cfg, el, env.family, cameraGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

// ── list presets ──────────────────────────────────────────────────────────
// A list is one layer with a row inside it, so each of these builds a source,
// a layout and a working row template in one go. Row frames are fractions of
// the cell, never of the face, and the row layers carry their own point sizes
// rather than a per-shape placement: a row laid out for one shape only would
// draw nothing on the others.

/** The list's own box on the face: nearly all of it, with a hair of margin so
 * the top and bottom rows are not against the bezel. */
function listGeometry(): NormalizedFrame {
  return { x: 0.04, y: 0.06, width: 0.92, height: 0.88, rotationDegrees: 0 };
}

function itemValue(field: string, format?: Value["format"]): Value {
  const value: Value = { kind: { kind: "item", field } };
  if (format) value.format = format;
  return value;
}

/** One text row layer: a frame inside the cell, a value, a size and an
 * alignment. Everything a row is made of, in one line at the call site. */
function rowText(
  value: Value,
  frame: { x: number; y: number; width: number; height: number },
  opts: { size?: number; align?: "leading" | "center" | "trailing"; colorHex?: string; weight?: "regular" | "semibold" } = {},
): Element {
  const el = layerOf("text");
  el.payload.value = value;
  el.payload.frame = { ...frame, rotationDegrees: 0 };
  el.payload.fontSize = opts.size ?? 11;
  if (opts.weight) el.payload.fontWeight = opts.weight;
  if (opts.align && opts.align !== "center") el.payload.alignment = opts.align;
  if (opts.colorHex) el.payload.colorSlot.baseColorHex = opts.colorHex;
  return el;
}

/** One icon row layer reading the item's own glyph. */
function rowIcon(frame: { x: number; y: number; width: number; height: number }, size = 11): Element {
  const el = layerOf("icon");
  el.payload.symbol = itemValue("icon");
  el.payload.frame = { ...frame, rotationDegrees: 0 };
  el.payload.size = size;
  return el;
}

/** One shape row layer filled by the item's own reading, the way a tank is:
 * a battery at 12 shows a tenth of the capsule and one at 95 nearly all of it.
 * The scale is 0 to 100, which is what a percentage reads on. */
function rowLevel(
  value: Value,
  frame: { x: number; y: number; width: number; height: number },
  colorHex: string,
): Element {
  const el = layerOf("shape");
  el.payload.kind = "capsule";
  el.payload.borderWidth = 0;
  el.payload.frame = { ...frame, rotationDegrees: 0 };
  el.payload.colorSlot.baseColorHex = colorHex;
  el.payload.level = { ...defaultLevel(value), direction: "right" };
  return el;
}

/** One tap row layer covering the whole cell. */
function rowTap(action: TapAction): Element {
  const el = layerOf("tap");
  el.payload.action = action;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  return el;
}

/** Build a list layer, put it on the shape being edited and return its id. */
function addList(
  cfg: CustomComplicationConfig,
  env: PresetEnv,
  source: ListSource,
  layout: { rows: number; direction?: ListDirection; columns?: number; gap?: number },
  template: Element[],
): string {
  const el = layerOf("list");
  el.payload.source = source;
  el.payload.rows = layout.rows;
  if (layout.direction) el.payload.direction = layout.direction;
  if (layout.columns !== undefined) el.payload.columns = layout.columns;
  if (layout.gap !== undefined) el.payload.gap = layout.gap;
  el.payload.template = template;
  placeLayer(cfg, el, env.family, () => ({ frame: listGeometry() }));
  cfg.elements.push(el);
  return el.payload.id;
}

/** The next few events, each with the time it starts. */
export function addEventsList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  return addList(cfg, env, { kind: "calendar", entities: [withDomain(ref)], hours: 24 }, { rows: 3 }, [
    rowText(itemValue("title"), { x: 0, y: 0, width: 0.68, height: 1 }, { align: "leading" }),
    rowText(itemValue("start", { timestamp: "clock" }), { x: 0.7, y: 0, width: 0.3, height: 1 },
      { align: "trailing", colorHex: MUTED_HEX }),
  ]);
}

/** Open items, with a tap that completes the one it is on. */
export function addTodoList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const complete: CallServiceAction = {
    type: "callService",
    serviceDomain: "todo",
    serviceName: "update_item",
    serviceDataJSON: `{"entity_id": "{item.listId}", "item": "{item.uid}", "status": "completed"}`,
  };
  return addList(cfg, env, { kind: "todo", entities: [full], status: "open", sort: "list" }, { rows: 4 }, [
    rowIcon({ x: 0, y: 0.1, width: 0.14, height: 0.8 }, 10),
    rowText(itemValue("title"), { x: 0.18, y: 0, width: 0.82, height: 1 }, { align: "leading" }),
    rowTap(complete),
  ]);
}

/** Six hours across the face. */
export function addHourlyForecastList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  return addList(cfg, env, { kind: "forecast", ...withDomain(ref), type: "hourly" },
    { rows: 6, direction: "across", gap: 1 }, [
      rowText(itemValue("time", { timestamp: "clock" }), { x: 0, y: 0, width: 1, height: 0.3 },
        { size: 9, colorHex: MUTED_HEX }),
      rowIcon({ x: 0.15, y: 0.34, width: 0.7, height: 0.32 }, 12),
      rowText(itemValue("temperature", { decimals: 0, suffix: "°" }), { x: 0, y: 0.7, width: 1, height: 0.3 }, { size: 10 }),
    ]);
}

/** Five days across the face, each with a high and a low. */
export function addDailyForecastList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  return addList(cfg, env, { kind: "forecast", ...withDomain(ref), type: "daily" },
    { rows: 5, direction: "across", gap: 1 }, [
      rowText(itemValue("time", { timestamp: "weekday" }), { x: 0, y: 0, width: 1, height: 0.26 },
        { size: 9, colorHex: MUTED_HEX }),
      rowIcon({ x: 0.18, y: 0.3, width: 0.64, height: 0.28 }, 12),
      rowText(itemValue("temperature", { decimals: 0, suffix: "°" }), { x: 0, y: 0.6, width: 1, height: 0.22 }, { size: 10 }),
      rowText(itemValue("templow", { decimals: 0, suffix: "°" }), { x: 0, y: 0.8, width: 1, height: 0.2 },
        { size: 9, colorHex: MUTED_HEX }),
    ]);
}

/** Every light that is on, with a tap that turns that one off. */
export function addLightsOnList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["light"], areaIds: [], labelIds: [], floorIds: [] },
    stateFilter: { kind: "isOn" },
    sort: "name",
    descending: false,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4 }, [
    rowIcon({ x: 0, y: 0.1, width: 0.14, height: 0.8 }, 10),
    rowText(itemValue("name"), { x: 0.18, y: 0, width: 0.82, height: 1 }, { align: "leading" }),
    rowTap({ type: "toggleEntity", entityId: "{item.entityId}", displayName: "", domain: "" }),
  ]);
}

/** Battery sensors, emptiest first, each with a bar that runs down as it does. */
export function addBatteriesList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] },
    deviceClass: "battery",
    sort: "state",
    descending: false,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4 }, [
    rowLevel(itemValue("state"), { x: 0, y: 0.34, width: 0.14, height: 0.32 }, ACCENT_HEX),
    rowText(itemValue("name"), { x: 0.18, y: 0, width: 0.5, height: 1 }, { align: "leading" }),
    rowText(itemValue("state", { decimals: 0, useEntityUnit: true }), { x: 0.7, y: 0, width: 0.3, height: 1 },
      { align: "trailing" }),
  ]);
}

/** Whatever changed most recently, with how long ago it was. */
export function addRecentList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] },
    sort: "lastChanged",
    descending: true,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4 }, [
    rowText(itemValue("name"), { x: 0, y: 0, width: 0.7, height: 1 }, { align: "leading" }),
    rowText(itemValue("age", { relativeTime: true }), { x: 0.72, y: 0, width: 0.28, height: 1 },
      { align: "trailing", colorHex: MUTED_HEX }),
  ]);
}

/** Scenes as a grid, one tap per cell. */
export function addScenesList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["scene"], areaIds: [], labelIds: [], floorIds: [] },
    sort: "name",
    descending: false,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4, columns: 2, gap: 3 }, [
    rowIcon({ x: 0.34, y: 0.06, width: 0.32, height: 0.44 }, 12),
    rowText(itemValue("name"), { x: 0, y: 0.54, width: 1, height: 0.46 }, { size: 9 }),
    rowTap({ type: "runScene", entityId: "{item.entityId}", displayName: "", domain: "" }),
  ]);
}

/** Run one preset and return the id of the layer to select afterwards. */
export function applyPreset(
  cfg: CustomComplicationConfig,
  kind: PresetKind,
  ref: EntityRef,
  env: PresetEnv,
): string {
  switch (kind) {
    case "toggle": return addToggleButton(cfg, ref, env);
    case "status": return addStatusText(cfg, ref, env);
    case "gauge": return addSensorGauge(cfg, ref, env);
    case "chart": return addForecastChart(cfg, ref, env);
    case "history": return addHistoryChart(cfg, ref, env);
    case "doorHistory": return addDoorHistory(cfg, ref, env);
    case "camera": return addCameraLayer(cfg, ref, env);
    case "listEvents": return addEventsList(cfg, ref, env);
    case "listTodo": return addTodoList(cfg, ref, env);
    case "listHourly": return addHourlyForecastList(cfg, ref, env);
    case "listDaily": return addDailyForecastList(cfg, ref, env);
    case "listLightsOn": return addLightsOnList(cfg, env);
    case "listBatteries": return addBatteriesList(cfg, env);
    case "listRecent": return addRecentList(cfg, env);
    case "listScenes": return addScenesList(cfg, env);
  }
}
