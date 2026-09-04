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
  type Comparison,
  type CustomComplicationConfig,
  type Element,
  type EntityRef,
  type NormalizedFrame,
  type Rule,
  type StyleChange,
  type Value,
  DRAWABLE_FAMILIES,
  TOGGLEABLE_DOMAINS,
  attachTap,
  literal,
  newElement,
  newRule,
  newStyleChange,
} from "./model.js";

export type PresetKind = "toggle" | "status" | "gauge" | "camera";

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
  /** How many layers it adds, for the 64-layer cap. */
  layerCount: number;
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
    kind: "camera",
    title: "Camera",
    blurb: "The camera's latest snapshot, filling the face.",
    domains: ["camera"],
    layerCount: 1,
  },
];

export function presetSpec(kind: PresetKind): PresetSpec {
  return LAYER_PRESETS.find((p) => p.kind === kind) ?? LAYER_PRESETS[0]!;
}

/** What a preset knows about the world beyond the entity it was given. */
export interface PresetEnv {
  /** The shape being edited. New layers are framed for it (and for every
   * other shape the document has). */
  family: DrawableFamily;
  /** The chosen entity's live state, when Home Assistant has one. Seeds the
   * gauge range and decides whether the text carries a unit. */
  state?: HassEntityState;
}

/** Amber reads as "live" on a black face; the grey is the system's secondary
 * label colour, which is what an off thing should look like. */
const ACCENT_HEX = "#FF9F0A";
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
  return DOMAIN_SYMBOLS[domainOf(ref)] ?? { off: "circle", on: "circle.fill" };
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

function cameraGeometry(): PresetGeometry {
  return { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 } };
}

function applySize(el: Element, size: number | undefined): void {
  if (size === undefined) return;
  if (el.kind === "text") el.payload.fontSize = size;
  else if (el.kind === "icon") el.payload.size = size;
  else if (el.kind === "gauge") el.payload.lineWidth = size;
}

/**
 * Frame a new layer for the shape being edited, and give every other shape the
 * document has its own frame too. A preset that only fits the shape that
 * happened to be on screen would leave the author dragging the same layer
 * twice more, which is exactly the work presets exist to remove.
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
  for (const family of DRAWABLE_FAMILIES) {
    if (family === active || family === "inline") continue;
    const layout = cfg.perFamily[family];
    if (!layout) continue;
    const there = geometry(family as DrawableFamily);
    // Identical to the shared frame is not worth a placement: it would only be
    // one more row for the author to wonder about.
    if (JSON.stringify(there) === JSON.stringify(here)) continue;
    layout.placements[el.payload.id] = {
      frame: there.frame,
      isHidden: false,
      ...(there.size !== undefined ? { size: there.size } : {}),
    };
  }
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

/** The camera's snapshot, filling the face. */
export function addCameraLayer(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("image");
  el.payload.entity = withDomain(ref);
  placeLayer(cfg, el, env.family, cameraGeometry);
  cfg.elements.push(el);
  return el.payload.id;
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
    case "camera": return addCameraLayer(cfg, ref, env);
  }
}
