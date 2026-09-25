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
// states-seeds imports toggleSymbols back from here. Safe: neither module
// calls into the other while it loads.
import { seedStates, seedStatesRows } from "./states-seeds.js";
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
  CUSTOM_SVG_SYMBOL,
  DRAWABLE_FAMILIES,
  IMAGE_TIMESTAMP_CAPSULE_HEX,
  LIST_FAMILIES,
  controlEffectiveKind,
  createGroup,
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
  | "battery" | "sparkline" | "lastChanged" | "person" | "timer" | "alarm"
  | "weatherNow" | "sunTimes" | "openCount"
  | "stateIcon" | "runButton" | "thermostat" | "nowPlaying" | "summary"
  | "togglePill" | "levelBar" | "weatherCard" | "eventCountdown" | "personPhoto" | "nowPlayingArt"
  | "listEntities" | "listEvents" | "listTodo" | "listHourly" | "listDaily"
  | "listLightsOn" | "listBatteries" | "listRecent" | "listScenes" | "listWhoHome" | "listToggles"
  | "houseScene" | "floorPlan";

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
  /** True when `layerCount` is the most it adds rather than the exact count:
   * a scene preset draws one part per light or room it finds in the home. */
  layerCountIsMost?: boolean;
}

/** The Home Screen tiles a whole-tile scene is drawn for. */
const SCENE_FAMILIES: readonly FamilyKind[] = ["medium", "large"];

/** The toggleable domains whose on state is the word `on`. A grid lights its
 * pills with one `isOn` rule shared by every row, and a lock (`locked`) or a
 * cover (`open`) would never light, so those are not offered. */
export const ON_OFF_DOMAINS: readonly string[] =
  TOGGLEABLE_DOMAINS.filter((d) => !["cover", "lock", "valve", "media_player"].includes(d));

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
    blurb: "An arc that fills with the entity's reading and changes color across three bands.",
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
    kind: "battery",
    title: "Battery ring",
    blurb: "A ring that empties as the battery does, red when low and green when full, with the percentage in the middle.",
    domains: ["sensor"],
    preferNumeric: true,
    layerCount: 2,
  },
  {
    kind: "sparkline",
    title: "Reading and sparkline",
    blurb: "The reading now, big, with the last six hours drawn as a faint line under it.",
    preferNumeric: true,
    layerCount: 2,
  },
  {
    kind: "lastChanged",
    title: "Last changed",
    blurb: "How long ago the entity last changed, with its name above. For anything you want to know is still being reported.",
    layerCount: 2,
  },
  {
    kind: "person",
    title: "Person",
    blurb: "A house while they are home and a walker while they are out, green or grey, with the word under it.",
    domains: ["person", "device_tracker"],
    layerCount: 2,
  },
  {
    kind: "timer",
    title: "Countdown timer",
    blurb: "The time left on a timer, ticking on the watch. Tap it to start or pause.",
    domains: ["timer"],
    layerCount: 3,
  },
  {
    kind: "alarm",
    title: "Alarm state",
    blurb: "One word for the alarm: green armed, amber arming, red triggered, grey off.",
    domains: ["alarm_control_panel"],
    layerCount: 2,
  },
  {
    kind: "weatherNow",
    title: "Weather now",
    blurb: "The temperature outside, with a symbol for the weather above it.",
    domains: ["weather"],
    layerCount: 2,
  },
  {
    kind: "sunTimes",
    title: "Sun times",
    blurb: "The next sunrise and the next sunset, each on its own line. Pick your sun entity.",
    domains: ["sun"],
    layerCount: 4,
  },
  {
    kind: "openCount",
    title: "Open now",
    blurb: "How many of your binary sensors are on right now, big. Narrow it to your doors and windows by area or label in the Source card.",
    layerCount: 2,
    needsEntity: false,
  },
  {
    kind: "stateIcon",
    title: "State icon",
    blurb: "An icon and a color for each state the entity reports, with its name under it. A tap does nothing.",
    layerCount: 2,
  },
  {
    kind: "runButton",
    title: "Run button",
    blurb: "A button that runs one scene or script when tapped, with its name under it.",
    domains: ["scene", "script"],
    layerCount: 3,
  },
  {
    kind: "thermostat",
    title: "Thermostat",
    blurb: "The temperature now, big, the target under it, and a bar along the bottom showing where it sits in the thermostat's range. Orange while it heats and blue while it cools.",
    domains: ["climate"],
    layerCount: 4,
  },
  {
    kind: "nowPlaying",
    title: "Now playing",
    blurb: "The song and the artist, with a button that plays or pauses. Dimmed while the player is off.",
    domains: ["media_player"],
    layerCount: 4,
  },
  {
    kind: "summary",
    title: "Home summary",
    blurb: "Three card rows: how many lights are on, who is home and how many doors and windows are open.",
    layerCount: 9,
    needsEntity: false,
    families: LIST_FAMILIES,
  },
  {
    kind: "togglePill",
    title: "Toggle pill",
    blurb: "A pill with the entity's icon and name in it. It fills with color while the entity is on. Tap it to toggle.",
    domains: TOGGLEABLE_DOMAINS,
    layerCount: 4,
    families: LIST_FAMILIES,
  },
  {
    kind: "levelBar",
    title: "Reading and bar",
    blurb: "The entity's name, its reading big, and a bar under it that fills with the reading and changes color across three bands.",
    preferNumeric: true,
    layerCount: 3,
  },
  {
    kind: "weatherCard",
    title: "Weather card",
    blurb: "A symbol for the weather, the temperature big, and the humidity and wind on a quiet line.",
    domains: ["weather"],
    layerCount: 3,
  },
  {
    kind: "eventCountdown",
    title: "Next event countdown",
    blurb: "The next event on one calendar, a live countdown to when it starts, and the time it starts.",
    domains: ["calendar"],
    layerCount: 3,
  },
  {
    kind: "personPhoto",
    title: "Person photo",
    blurb: "Their picture in a ring, with a word under it. Green while they are home, grey while they are out.",
    domains: ["person", "device_tracker"],
    layerCount: 3,
  },
  {
    kind: "nowPlayingArt",
    title: "Now playing art",
    blurb: "The cover art filling the face, with the song on a dark band along the bottom. Tap it to play or pause.",
    domains: ["media_player"],
    layerCount: 4,
  },
  {
    kind: "listEntities",
    title: "Entity rows",
    blurb: "Entities one per row, each with its icon, name and state. Starts with the one you pick. Add more in the Source card.",
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
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
  {
    kind: "listWhoHome",
    title: "Who is home",
    blurb: "Everyone in your home, across the face. Green while they are home, dimmed while they are out.",
    layerCount: 1,
    group: "list",
    needsEntity: false,
    families: LIST_FAMILIES,
  },
  {
    kind: "listToggles",
    title: "Toggle grid",
    blurb: "Four pills in a two by two grid, one per entity, each lit while it is on. Tap a pill to toggle it. Starts with the one you pick; swap the rest in the Source card.",
    domains: ON_OFF_DOMAINS,
    layerCount: 1,
    group: "list",
    families: LIST_FAMILIES,
  },
  {
    kind: "houseScene",
    title: "Tiny house",
    blurb: "A drawing of a house that fills the tile. Each window glows while its light is on, and a tap on a window toggles that light. The sky follows the sun and shows rain when the weather says so.",
    layerCount: 44,
    layerCountIsMost: true,
    needsEntity: false,
    families: SCENE_FAMILIES,
  },
  {
    kind: "floorPlan",
    title: "Floor plan",
    blurb: "Your areas as rooms seen from above, each lit while a light in it is on, with its temperature and a dot for motion. Tap a room to toggle its lights. Drag the rooms into the shape of your home.",
    layerCount: 55,
    layerCountIsMost: true,
    needsEntity: false,
    families: [...SCENE_FAMILIES, "xlarge"],
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
  /** Every entity Home Assistant knows, for a preset that fills in more than
   * the one it was given (Entity rows). */
  states?: Record<string, HassEntityState>;
  /** The frontend's registry snapshots, for a preset that sorts entities into
   * areas (Floor plan, Tiny house). Absent in tests and on a frontend that
   * does not carry them, and then every entity is in no area. */
  registry?: {
    entities?: Record<string, { area_id?: string | null; device_id?: string | null }>;
    devices?: Record<string, { area_id?: string | null }>;
    areas?: Record<string, { name?: string | null }>;
  };
}

/** Amber reads as "live" on a black face; the grey is the system's secondary
 * label color, which is what an off thing should look like. */
export const ACCENT_HEX = "#FF9F0A";
const MUTED_HEX = "#8E8E93";

/** The fill behind a card row: an eighth of white, which on the black face is
 * the grey a system widget's cells are drawn in, and on a tinted face is a
 * hair lighter than the face itself rather than a fixed grey fighting it. */
export const CARD_HEX = "#FFFFFF1F";
/** The ink on a pill that is lit: near black, because white on amber does not
 * read and the pill's own color is what says "on". */
const ON_INK_HEX = "#1C1C1E";
const WHITE_HEX = "#FFFFFF";

/** The three band colors of a gauge, lowest reading first. Every hex here is
 * one `colorWords` can name, so a band cell reads "red" rather than "#FF453A". */
export type BandColors = readonly [string, string, string];

/** Low is bad: a battery at 10% should look alarming, and full should not. */
export const ALARM_LOW_RAMP: BandColors = ["#FF453A", "#FFD60A", "#34C759"];
/** Nothing is wrong with either end, so the ramp only says cool or warm. */
export const NEUTRAL_RAMP: BandColors = ["#0A84FF", "#34C759", "#FF9F0A"];

/**
 * Which way a gauge's colors run.
 *
 * Only a charge level has an end that is plainly bad, so only that gets the
 * red-to-green ramp. A temperature has no bad end, and neither does anything
 * whose class the entity never states, so both get the neutral one rather than
 * a color that implies a judgement the panel cannot make.
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
   * sibling, in which case the color carries the state on its own. */
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
 * is nothing to plot: the whole reading is which color is where. */
function timelineGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const height = clamp(Math.round(canvas.height * 0.2), 6, 14);
  return {
    frame: { x: 0.06, y: 0.56, width: 0.88, height: round4(height / canvas.height), rotationDegrees: 0 },
  };
}

/** The name above the strip: a strip of color says nothing about what it is
 * of, and the entity is the one fact a reader needs to make sense of it. */
function timelineNameGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const size = clamp(Math.round(Math.min(canvas.width, canvas.height) * 0.26), 8, 15);
  return {
    frame: { x: 0.06, y: 0.2, width: 0.88, height: round4(clamp((size * 1.5) / canvas.height, 0, 1)), rotationDegrees: 0 },
    size,
  };
}

/**
 * One band of a stacked preset: a small label over a big reading over a small
 * caption.
 *
 * Six of the presets draw that same three-band stack, and each of the three
 * canvases is a different shape, so the band is a fraction of the face and the
 * point size is read back out of it. A size worked out from the band can never
 * be taller than the band it sits in, which is what a fixed size on the 34x34
 * corner canvas always was.
 */
function bandGeometry(family: DrawableFamily, y: number, height: number, factor: number, max: number): PresetGeometry {
  const canvas = CANVAS[family];
  return {
    frame: { x: 0.06, y, width: 0.88, height, rotationDegrees: 0 },
    size: clamp(Math.round(canvas.height * height * factor), 7, max),
  };
}

/** The reading itself: the middle band, and the biggest thing on the face. */
function mainBandGeometry(family: DrawableFamily): PresetGeometry {
  return bandGeometry(family, 0.32, 0.38, 0.82, 26);
}

/** The line under the reading: the entity's name, or one word about it. */
function captionBandGeometry(family: DrawableFamily): PresetGeometry {
  return bandGeometry(family, 0.72, 0.18, 0.8, 13);
}

/** The line over the reading. Same size as the caption, so a preset that uses
 * both reads as one reading between two quiet lines. */
function labelBandGeometry(family: DrawableFamily): PresetGeometry {
  return bandGeometry(family, 0.12, 0.18, 0.8, 13);
}

/** The number inside a ring: a box across the middle of the arc, wide enough
 * for three digits and a percent sign. */
function ringCentreGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const side = Math.min(canvas.width, canvas.height) * 0.46;
  return { frame: centredFrame(family, side * 1.5, side), size: clamp(Math.round(side * 0.6), 8, 22) };
}

/** A sparkline's own strip: the bottom third, under the reading it belongs to.
 * Narrower than a chart preset's band, because here the chart is the
 * background and the number is the subject. */
function sparkChartGeometry(): PresetGeometry {
  return { frame: { x: 0.06, y: 0.58, width: 0.88, height: 0.32, rotationDegrees: 0 }, size: 2 };
}

/** The reading over a sparkline: taller and higher than the ordinary main
 * band, since the strip below it takes the room the caption would have. */
function sparkValueGeometry(family: DrawableFamily): PresetGeometry {
  return bandGeometry(family, 0.12, 0.42, 0.85, 30);
}

/** One of the two rows the Sun times preset draws: a symbol on the left and a
 * time beside it. `top` is the sunrise row. */
function sunRowGeometry(family: DrawableFamily, top: boolean, icon: boolean): PresetGeometry {
  const canvas = CANVAS[family];
  const y = top ? 0.2 : 0.54;
  const height = 0.26;
  const size = clamp(Math.round(canvas.height * height * (icon ? 0.85 : 0.8)), 8, 20);
  return {
    frame: icon
      ? { x: 0.12, y, width: 0.22, height, rotationDegrees: 0 }
      : { x: 0.38, y, width: 0.5, height, rotationDegrees: 0 },
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
 * The three color bands behind a sensor gauge: below the first third, between
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
 * reading. The color table is seeded from the entity's own domain and device
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

// ── stacked presets ───────────────────────────────────────────────────────
// Six presets that draw the same three bands: a quiet line, one big reading,
// and a quiet line under it. They share `mainBandGeometry` and friends so a
// battery and an alarm sit at the same height on the same face.

/** The green a good state wears, and the red and amber beside it. The same
 * three hexes the gauge ramps use, so a preset never invents a fourth green. */
const GOOD_HEX = ALARM_LOW_RAMP[2];
const WARN_HEX = ALARM_LOW_RAMP[1];
const BAD_HEX = ALARM_LOW_RAMP[0];

function setTextTo(text: string): StyleChange {
  const change = newStyleChange("setText");
  change.value = literal(text);
  return change;
}

function setOpacityTo(fraction: number): StyleChange {
  const change = newStyleChange("setOpacity");
  change.number = fraction;
  return change;
}

/** One quiet line of text, placed in one of the stack's bands. Used for a name
 * over a reading and for a word under one. */
function addQuietLine(
  cfg: CustomComplicationConfig,
  value: Value,
  env: PresetEnv,
  geometry: (family: DrawableFamily) => PresetGeometry,
): string {
  const el = layerOf("text");
  el.payload.value = value;
  el.payload.colorSlot.baseColorHex = MUTED_HEX;
  placeLayer(cfg, el, env.family, geometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/** The name to print for an entity: its own, or its id when it has none. */
function refLabel(ref: EntityRef): Value {
  return literal(ref.displayName.trim() || ref.entityId);
}

/**
 * A ring that empties as a battery does, with the percentage inside it.
 *
 * The Sensor gauge preset would draw the arc, but it reads the entity's own
 * range and its own device class, and a battery sensor that never states
 * either would come out on the neutral ramp with an arbitrary scale. This one
 * knows what it is for: 0 to 100, and red at the empty end, whatever the
 * entity says about itself. The number in the middle is a second layer rather
 * than a feature of the gauge, so it can be moved, restyled or deleted.
 */
export function addBatteryRing(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const range = { min: 0, max: 100 };
  const gauge = layerOf("gauge");
  gauge.payload.value = entityStateValue(ref);
  gauge.payload.minValue = range.min;
  gauge.payload.maxValue = range.max;
  gauge.payload.rules = [gaugeBandRule(ref, range, ALARM_LOW_RAMP)];
  placeLayer(cfg, gauge, env.family, gaugeGeometry);
  cfg.elements.push(gauge);

  const text = layerOf("text");
  text.payload.value = { kind: { kind: "entityState", ...withDomain(ref) }, format: { decimals: 0, suffix: "%" } };
  text.payload.fontWeight = "semibold";
  text.payload.rules = [gaugeBandRule(ref, range, ALARM_LOW_RAMP)];
  placeLayer(cfg, text, env.family, ringCentreGeometry);
  cfg.elements.push(text);
  return gauge.payload.id;
}

/**
 * The reading now, with where it has been drawn faintly under it.
 *
 * The History chart preset draws the line and nothing else, which answers
 * "how has it moved" but not "what is it". This is the other way round: the
 * number is the subject and the line is context, so the chart is muted, gets
 * no highlights and takes the bottom third. The chart goes in first because
 * the list draws in order and the number belongs on top.
 */
export function addSparkline(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const chart = layerOf("chart");
  chart.payload.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  chart.payload.historyMinutes = 360;
  chart.payload.historyPoints = 24;
  chart.payload.style = "line";
  chart.payload.colorSlot.baseColorHex = MUTED_HEX;
  placeLayer(cfg, chart, env.family, sparkChartGeometry);
  cfg.elements.push(chart);

  const text = layerOf("text");
  text.payload.value = entityStateValue(ref, env.state);
  text.payload.fontWeight = "semibold";
  placeLayer(cfg, text, env.family, sparkValueGeometry);
  cfg.elements.push(text);
  return text.payload.id;
}

/**
 * How long ago the entity last changed, with its name over it.
 *
 * `entityAge` resolves to a number of seconds, and `relativeTime` is what
 * turns that into "2h ago", the same pair the Recent activity list uses on
 * every row.
 */
export function addLastChanged(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  addQuietLine(cfg, refLabel(ref), env, labelBandGeometry);
  const el = layerOf("text");
  el.payload.value = { kind: { kind: "entityAge", ...withDomain(ref) }, format: { relativeTime: true } };
  el.payload.fontWeight = "semibold";
  placeLayer(cfg, el, env.family, mainBandGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/**
 * Whether one person is home: a house or a walker, and the word under it.
 *
 * The word is set by the rule rather than printed raw, because Home Assistant
 * says `not_home`, which is not a word anybody wants on their wrist. A person
 * in a named zone falls through both cases and prints the zone, which is
 * better than either word.
 */
export function addPersonTile(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const home = entityStateValue(ref);
  const icon = layerOf("icon");
  icon.payload.symbol = literal("figure.walk");
  icon.payload.colorSlot.baseColorHex = MUTED_HEX;
  icon.payload.rules = [buildStatesRule(home, [
    { comparison: { kind: "equals", value: literal("home") }, changes: [setIconTo("house.fill"), setColorTo(GOOD_HEX)] },
  ], [setIconTo("figure.walk"), setColorTo(MUTED_HEX)])];
  placeLayer(cfg, icon, env.family, mainBandGeometry);
  cfg.elements.push(icon);

  const word = layerOf("text");
  word.payload.value = entityStateValue(ref);
  word.payload.colorSlot.baseColorHex = MUTED_HEX;
  word.payload.rules = [buildStatesRule(entityStateValue(ref), [
    { comparison: { kind: "equals", value: literal("home") }, changes: [setTextTo("Home")] },
    { comparison: { kind: "equals", value: literal("not_home") }, changes: [setTextTo("Away")] },
  ])];
  placeLayer(cfg, word, env.family, captionBandGeometry);
  cfg.elements.push(word);
  return icon.payload.id;
}

/**
 * A timer's remaining time, ticking, with a tap that starts and pauses it.
 *
 * `countdown` is what makes the watch tick the label itself rather than wait
 * for the next push: the resolver reads the timer's `finishes_at` and counts
 * to it. Monospaced digits stop the seconds shuffling the minutes sideways
 * once a second.
 */
export function addCountdownTimer(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const el = layerOf("text");
  el.payload.value = { kind: { kind: "entityState", ...withDomain(ref) } };
  el.payload.countdown = true;
  el.payload.monospacedDigits = true;
  el.payload.fontWeight = "semibold";
  placeLayer(cfg, el, env.family, mainBandGeometry);
  cfg.elements.push(el);
  addQuietLine(cfg, refLabel(ref), env, captionBandGeometry);
  // After the placement, the same way the toggle preset does it: attachTap
  // re-runs the sync and copies the per-shape frames onto the tap.
  attachTap(cfg, el.payload.id, { type: "timerStartPause" });
  return el.payload.id;
}

/**
 * One word for the alarm, in a color that says what it means.
 *
 * Every arming mode starts `armed_`, so one `startsWith` covers home, away,
 * night and vacation without four rows. The rows are checked top to bottom and
 * the first match wins, so triggered, arming and pending are listed before it:
 * all three would otherwise be nothing at all, and `arming` does not start
 * with `armed_`.
 *
 * Arming and pending are two rows saying the same thing rather than one "is
 * one of", because the states table cannot draw an "is one of" row, and a
 * preset whose own rule falls through to the Advanced editor is a preset
 * nobody can edit where they found it.
 */
export function addAlarmState(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  addQuietLine(cfg, refLabel(ref), env, labelBandGeometry);
  const el = layerOf("text");
  el.payload.value = entityStateValue(ref);
  el.payload.fontWeight = "semibold";
  el.payload.colorSlot.baseColorHex = MUTED_HEX;
  el.payload.rules = [buildStatesRule(entityStateValue(ref), [
    { comparison: { kind: "equals", value: literal("triggered") }, changes: [setTextTo("Triggered"), setColorTo(BAD_HEX)] },
    { comparison: { kind: "equals", value: literal("arming") }, changes: [setTextTo("Arming"), setColorTo(WARN_HEX)] },
    { comparison: { kind: "equals", value: literal("pending") }, changes: [setTextTo("Arming"), setColorTo(WARN_HEX)] },
    { comparison: { kind: "startsWith", value: literal("armed") }, changes: [setTextTo("Armed"), setColorTo(GOOD_HEX)] },
    { comparison: { kind: "equals", value: literal("disarmed") }, changes: [setTextTo("Off"), setColorTo(MUTED_HEX)] },
  ])];
  placeLayer(cfg, el, env.family, mainBandGeometry);
  cfg.elements.push(el);
  return el.payload.id;
}

/**
 * The weather outside: a symbol for the condition, the temperature under it.
 *
 * A weather entity's state is its condition word, so the symbol comes from a
 * rule over that word rather than from the entity's own icon, which the watch
 * never sees. Sleet and hail share the snow symbol: the set the watch draws
 * from has no sibling for either, and a wrong glyph is worse than a near one.
 * The temperature is an attribute, not the state, which is why this cannot be
 * a Status text.
 */
export function addWeatherNow(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const condition = entityStateValue(ref);
  const icon = layerOf("icon");
  icon.payload.symbol = literal("cloud.fill");
  icon.payload.rules = [buildStatesRule(condition,
    WEATHER_SYMBOLS.map(([state, symbol]) => ({
      comparison: { kind: "equals" as const, value: literal(state) },
      changes: [setIconTo(symbol)],
    })),
    [setIconTo("cloud.fill")])];
  placeLayer(cfg, icon, env.family, (family) => bandGeometry(family, 0.1, 0.3, 0.95, 26));
  cfg.elements.push(icon);

  const temp = layerOf("text");
  temp.payload.value = {
    kind: { kind: "entityAttribute", ...withDomain(ref), attribute: "temperature" },
    format: { decimals: 0, suffix: "°" },
  };
  temp.payload.fontWeight = "semibold";
  placeLayer(cfg, temp, env.family, (family) => bandGeometry(family, 0.44, 0.4, 0.85, 30));
  cfg.elements.push(temp);
  return temp.payload.id;
}

/** Home Assistant's weather conditions, and the symbol each one draws. Every
 * name here is in `symbols.ts`, so none of them can land as a placeholder. */
const WEATHER_SYMBOLS: readonly (readonly [string, string])[] = [
  ["sunny", "sun.max.fill"],
  ["clear-night", "moon.stars.fill"],
  ["partlycloudy", "cloud.sun.fill"],
  ["cloudy", "cloud.fill"],
  ["fog", "cloud.fog.fill"],
  ["rainy", "cloud.rain.fill"],
  ["pouring", "cloud.heavyrain.fill"],
  ["lightning", "cloud.bolt.fill"],
  ["lightning-rainy", "cloud.bolt.rain.fill"],
  ["snowy", "cloud.snow.fill"],
  ["snowy-rainy", "cloud.snow.fill"],
  ["hail", "cloud.snow.fill"],
  ["windy", "wind"],
  ["windy-variant", "wind"],
  ["exceptional", "exclamationmark.triangle.fill"],
];

/**
 * The next sunrise and the next sunset, one line each.
 *
 * The times come through a template rather than straight off the attribute,
 * because `next_rising` is an ISO string and the clock format only reads a
 * number of seconds. `as_timestamp` on the server is the shortest way to hand
 * the watch what it can print.
 */
export function addSunTimes(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const at = (attribute: string): Value => ({
    kind: { kind: "jinja", value: `{{ (as_timestamp(state_attr('${ref.entityId}', '${attribute}')) | int) }}` },
    format: { timestamp: "clock" },
  });
  const row = (symbol: string, attribute: string, top: boolean): string => {
    const icon = layerOf("icon");
    icon.payload.symbol = literal(symbol);
    icon.payload.colorSlot.baseColorHex = ACCENT_HEX;
    placeLayer(cfg, icon, env.family, (family) => sunRowGeometry(family, top, true));
    cfg.elements.push(icon);

    const text = layerOf("text");
    text.payload.value = at(attribute);
    text.payload.alignment = "leading";
    placeLayer(cfg, text, env.family, (family) => sunRowGeometry(family, top, false));
    cfg.elements.push(text);
    createGroup(cfg, [icon.payload.id, text.payload.id], top ? "Sunrise" : "Sunset");
    return text.payload.id;
  };
  const rise = row("sunrise.fill", "next_rising", true);
  row("sunset.fill", "next_setting", false);
  return rise;
}

/**
 * How many things are on right now, as one number.
 *
 * It asks for nothing, the same way Lights on and Recent activity do: what it
 * needs is a scope, and a scope is narrowed in the Source card afterwards
 * rather than searched for up front. It starts on every binary sensor because
 * that is where doors and windows live in most homes, and an aggregate takes
 * areas, labels and floors but not a device class, so the narrowing is by
 * room or by label.
 */
export function addOpenCount(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const el = layerOf("text");
  el.payload.value = {
    kind: {
      kind: "aggregate",
      aggregate: {
        function: "count",
        scope: { kind: "filter", domains: ["binary_sensor"], areaIds: [], labelIds: [], floorIds: [] },
        stateFilter: { kind: "isOn" },
      },
    },
  };
  el.payload.fontWeight = "semibold";
  placeLayer(cfg, el, env.family, mainBandGeometry);
  cfg.elements.push(el);
  addQuietLine(cfg, literal("open"), env, captionBandGeometry);
  return el.payload.id;
}

// ── presets carried over from the iPhone editor ───────────────────────────
// The iPhone app had its own preset styles before the panel existed. Most of
// them already have a preset here; these are the ones that did not, plus two
// domains (climate, media) that had no good look at all.

/**
 * An icon that shows which state the entity is in, with its name under it.
 *
 * The rows come from the same table the states editor's fill button uses, so a
 * cover gets open, closed, opening and closing rather than a bare on and off.
 * A domain that table does not know falls back to the toggle button's on/off
 * rule, which is right for anything that is on or off and harmless otherwise.
 * No tap: the Toggle button is the one that acts.
 */
export function addStateIcon(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const deviceClass = env.state?.attributes?.device_class;
  const seeds = seedStates(full.domain, typeof deviceClass === "string" ? deviceClass : undefined);
  const icon = layerOf("icon");
  if (seeds.length > 0) {
    icon.payload.symbol = literal(seeds[0]!.symbol);
    icon.payload.colorSlot.baseColorHex = MUTED_HEX;
    icon.payload.rules = [buildStatesRule(entityStateValue(full), seedStatesRows(seeds, { icon: true, color: true }))];
  } else {
    const symbols = toggleSymbols(full);
    icon.payload.symbol = literal(symbols.off);
    icon.payload.colorSlot.baseColorHex = MUTED_HEX;
    icon.payload.rules = [toggleRule(full, symbols)];
  }
  placeLayer(cfg, icon, env.family, mainBandGeometry);
  cfg.elements.push(icon);
  addQuietLine(cfg, refLabel(full), env, captionBandGeometry);
  return icon.payload.id;
}

/** A button that runs one scene or script, with its name under it. */
export function addRunButton(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const script = full.domain === "script";
  const icon = layerOf("icon");
  icon.payload.symbol = literal(script ? "play.fill" : "sparkles");
  icon.payload.colorSlot.baseColorHex = ACCENT_HEX;
  placeLayer(cfg, icon, env.family, mainBandGeometry);
  cfg.elements.push(icon);
  addQuietLine(cfg, refLabel(full), env, captionBandGeometry);
  attachTap(cfg, icon.payload.id, { type: script ? "runScript" : "runScene", ...full });
  return icon.payload.id;
}

const COOL_HEX = NEUTRAL_RAMP[0];

/**
 * The target line of the Thermostat preset: "Set 21°" for one target, or
 * "68-77°" for a thermostat in heat/cool mode, which has no `temperature` at
 * all and keeps its two targets in `target_temp_low` and `target_temp_high`.
 * Reading `temperature` alone printed dashes for every such thermostat.
 *
 * `%g` prints 21 as "21" and 20.5 as "20.5", so a half-degree target keeps
 * its decimal and a whole one gets none. A mode with no target at all prints
 * the mode instead ("Fan only").
 */
export function thermostatTargetTemplate(entityId: string): string {
  const attr = (name: string) => `state_attr('${entityId}', '${name}')`;
  return `{% set t = ${attr("temperature")} %}`
    + `{% set lo = ${attr("target_temp_low")} %}{% set hi = ${attr("target_temp_high")} %}`
    + `{% if t is number %}Set {{ '%g' | format(t) }}°`
    + `{% elif lo is number and hi is number %}{{ '%g' | format(lo) }}-{{ '%g' | format(hi) }}°`
    + `{% else %}{{ states('${entityId}') | replace('_', ' ') | capitalize }}{% endif %}`;
}

/**
 * The room temperature, the target under it, and a symbol for what the
 * thermostat is doing.
 *
 * Every value is an attribute: a climate entity's state is its mode (`heat`,
 * `cool`, `off`), which says what it is set to and not what it is doing. What
 * it is doing is `hvac_action`, so the color reads that. The target line is a
 * template, because the target lives in different attributes by mode: see
 * `thermostatTargetTemplate`.
 */
export function addThermostat(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const action: Value = { kind: { kind: "entityAttribute", ...full, attribute: "hvac_action" } };

  const icon = layerOf("icon");
  icon.payload.symbol = literal("thermometer.medium");
  icon.payload.colorSlot.baseColorHex = MUTED_HEX;
  icon.payload.rules = [buildStatesRule(action, [
    { comparison: { kind: "equals", value: literal("heating") }, changes: [setIconTo("flame.fill"), setColorTo(ACCENT_HEX)] },
    { comparison: { kind: "equals", value: literal("cooling") }, changes: [setIconTo("snowflake"), setColorTo(COOL_HEX)] },
    { comparison: { kind: "equals", value: literal("fan") }, changes: [setIconTo("fan.fill"), setColorTo(COOL_HEX)] },
  ], [setIconTo("thermometer.medium"), setColorTo(MUTED_HEX)])];
  placeLayer(cfg, icon, env.family, (family) => bandGeometry(family, 0.06, 0.16, 0.8, 13));
  cfg.elements.push(icon);

  const now = layerOf("text");
  now.payload.value = {
    kind: { kind: "entityAttribute", ...full, attribute: "current_temperature" },
    format: { decimals: 0, suffix: "°" },
  };
  now.payload.fontWeight = "semibold";
  now.payload.rules = [buildStatesRule(action, [
    { comparison: { kind: "equals", value: literal("heating") }, changes: [setColorTo(ACCENT_HEX)] },
    { comparison: { kind: "equals", value: literal("cooling") }, changes: [setColorTo(COOL_HEX)] },
  ])];
  placeLayer(cfg, now, env.family, (family) => bandGeometry(family, 0.24, 0.36, 0.82, 26));
  cfg.elements.push(now);

  const target = layerOf("text");
  target.payload.value = { kind: { kind: "jinja", value: thermostatTargetTemplate(full.entityId) } };
  target.payload.colorSlot.baseColorHex = MUTED_HEX;
  // Off has no target, and "Set --°" is worse than saying so.
  target.payload.rules = [buildStatesRule(entityStateValue(full), [
    { comparison: { kind: "equals", value: literal("off") }, changes: [setTextTo("Off")] },
  ])];
  placeLayer(cfg, target, env.family, (family) => bandGeometry(family, 0.6, 0.16, 0.8, 13));
  cfg.elements.push(target);

  // Where the room sits in the thermostat's own range, as a bar along the
  // bottom. The range is read live from `min_temp` and `max_temp`, with the
  // entity's numbers now as the fallback and a plain 5 to 35 behind those.
  const range = thermostatRange(env.state);
  const bar = newCard();
  bar.payload.colorSlot.baseColorHex = MUTED_HEX;
  bar.payload.level = {
    ...defaultLevel({ kind: { kind: "entityAttribute", ...full, attribute: "current_temperature" } }),
    minValue: range.min,
    maxValue: range.max,
    minSource: { kind: { kind: "entityAttribute", ...full, attribute: "min_temp" } },
    maxSource: { kind: { kind: "entityAttribute", ...full, attribute: "max_temp" } },
    direction: "right",
  };
  bar.payload.rules = [buildStatesRule(action, [
    { comparison: { kind: "equals", value: literal("heating") }, changes: [setColorTo(ACCENT_HEX)] },
    { comparison: { kind: "equals", value: literal("cooling") }, changes: [setColorTo(COOL_HEX)] },
  ], [setColorTo(MUTED_HEX)])];
  placeLayer(cfg, bar, env.family, bottomBarGeometry);
  cfg.elements.push(bar);
  return now.payload.id;
}

/** The ends of a thermostat's bar: its own `min_temp` and `max_temp` when it
 * states them, else a span that covers any room in either scale. */
export function thermostatRange(state: HassEntityState | undefined): { min: number; max: number } {
  const min = state?.attributes?.min_temp;
  const max = state?.attributes?.max_temp;
  if (typeof min === "number" && typeof max === "number" && max > min) return { min, max };
  return { min: 5, max: 35 };
}

/**
 * The song, the artist, and a button that plays or pauses.
 *
 * The title and artist are attributes that only exist while something is
 * loaded, so a player that is off would print dashes. The title says the state
 * in words instead, dimmed, and the artist line goes away. The button shows
 * what a tap will do: pause while playing, play otherwise.
 */
export function addNowPlaying(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const state = (): Value => entityStateValue(full);
  const quiet: readonly (readonly [string, string])[] = [["off", "Off"], ["idle", "Idle"], ["standby", "Standby"]];

  const icon = layerOf("icon");
  icon.payload.symbol = literal("play.fill");
  icon.payload.colorSlot.baseColorHex = ACCENT_HEX;
  icon.payload.rules = [buildStatesRule(state(), [
    { comparison: { kind: "equals", value: literal("playing") }, changes: [setIconTo("pause.fill")] },
  ], [setIconTo("play.fill")])];
  placeLayer(cfg, icon, env.family, (family) => bandGeometry(family, 0.08, 0.28, 0.85, 22));
  cfg.elements.push(icon);

  const title = layerOf("text");
  title.payload.value = { kind: { kind: "entityAttribute", ...full, attribute: "media_title" } };
  title.payload.fontWeight = "semibold";
  title.payload.rules = [buildStatesRule(state(), [
    ...quiet.map(([word, text]) => ({
      comparison: { kind: "equals" as const, value: literal(word) },
      changes: [setTextTo(text), setOpacityTo(0.45)],
    })),
    { comparison: { kind: "isUnavailable" }, changes: [setTextTo("Unavailable"), setOpacityTo(0.45)] },
  ])];
  placeLayer(cfg, title, env.family, (family) => bandGeometry(family, 0.4, 0.28, 0.8, 18));
  cfg.elements.push(title);

  const artist = layerOf("text");
  artist.payload.value = { kind: { kind: "entityAttribute", ...full, attribute: "media_artist" } };
  artist.payload.colorSlot.baseColorHex = MUTED_HEX;
  artist.payload.rules = [buildStatesRule(state(), [
    ...quiet.map(([word]) => ({ comparison: { kind: "equals" as const, value: literal(word) }, changes: [setOpacityTo(0)] })),
    { comparison: { kind: "isUnavailable" }, changes: [setOpacityTo(0)] },
  ])];
  placeLayer(cfg, artist, env.family, captionBandGeometry);
  cfg.elements.push(artist);

  attachTap(cfg, icon.payload.id, {
    type: "callService",
    serviceDomain: "media_player",
    serviceName: "media_play_pause",
    target: full,
  });
  return title.payload.id;
}

/** Every door and window sensor that is open, counted on the server. An
 * aggregate cannot filter by device class, so this is a template, the same one
 * the iPhone's Status Summary converts to. */
export const DOORS_OPEN_TEMPLATE =
  "{{ states.binary_sensor"
  + " | selectattr('attributes.device_class', 'defined')"
  + " | selectattr('attributes.device_class', 'in', ['door', 'window', 'opening', 'garage_door'])"
  + " | selectattr('state', 'eq', 'on')"
  + " | list | count }}";

/** A card: a capsule with no border, filled in the card grey, for a row's
 * other layers to sit on. Framed by the caller. */
function newCard(kind: "capsule" | "roundedRectangle" = "capsule"): Extract<Element, { kind: "shape" }> {
  const el = layerOf("shape");
  el.payload.kind = kind;
  el.payload.borderWidth = 0;
  el.payload.colorSlot.baseColorHex = CARD_HEX;
  return el;
}

/** One of the summary's three rows: a card across the face, a symbol at its
 * left end and the count at its right. Three cards with a hair between them
 * fill the face top to bottom. */
function summaryRowGeometry(family: DrawableFamily, row: number, part: "card" | "icon" | "text"): PresetGeometry {
  const canvas = CANVAS[family];
  const height = 0.3;
  const y = 0.02 + row * 0.33;
  const size = clamp(Math.round(canvas.height * height * (part === "icon" ? 0.72 : 0.7)), 8, 20);
  switch (part) {
    case "card": return { frame: { x: 0.02, y, width: 0.96, height, rotationDegrees: 0 } };
    case "icon": return { frame: { x: 0.06, y, width: 0.12, height, rotationDegrees: 0 }, size };
    case "text": return { frame: { x: 0.2, y, width: 0.74, height, rotationDegrees: 0 }, size };
  }
}

/**
 * Lights on, people home, doors open: the iPhone's Status Summary.
 *
 * Each row is a card with a symbol at one end and a count at the other, the
 * count with its words as a suffix and a rule that rewrites the counts that
 * read badly ("0 lights on" is "All off"). The symbol lights up while there
 * is something to report. Like Open now, it asks for nothing: every light and
 * every person counts, and the scope is narrowed in the Source card
 * afterwards. The card goes in first on each row, because the list draws in
 * order and the card is the thing underneath.
 */
export function addHomeSummary(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const count = (domain: string, stateFilter: { kind: "isOn" } | { kind: "equals"; value: string }): Value["kind"] => ({
    kind: "aggregate",
    aggregate: {
      function: "count",
      scope: { kind: "filter", domains: [domain], areaIds: [], labelIds: [], floorIds: [] },
      stateFilter,
    },
  });
  const rows: {
    value: Value["kind"];
    suffix: string;
    rewrites: readonly (readonly [string, string])[];
    /** The row's own sub-group in the Layers list. */
    name: string;
    idle: string;
    busy: string;
    busyHex: string;
    goodWhenZero: boolean;
  }[] = [
    {
      value: count("light", { kind: "isOn" }), suffix: " lights on",
      rewrites: [["0", "All off"], ["1", "1 light on"]],
      name: "Lights",
      idle: "lightbulb", busy: "lightbulb.fill", busyHex: ACCENT_HEX, goodWhenZero: false,
    },
    {
      value: count("person", { kind: "equals", value: "home" }), suffix: " home",
      rewrites: [["0", "Nobody home"]],
      name: "People",
      idle: "person.fill", busy: "person.fill", busyHex: COOL_HEX, goodWhenZero: false,
    },
    {
      value: { kind: "jinja", value: DOORS_OPEN_TEMPLATE }, suffix: " open",
      rewrites: [["0", "All closed"]],
      name: "Doors",
      idle: "door.left.hand.closed", busy: "door.left.hand.open", busyHex: WARN_HEX, goodWhenZero: true,
    },
  ];

  let first = "";
  rows.forEach((row, i) => {
    const reading = (): Value => ({ kind: row.value });
    const zero = { kind: "equals" as const, value: literal("0") };

    const card = newCard();
    placeLayer(cfg, card, env.family, (family) => summaryRowGeometry(family, i, "card"));
    cfg.elements.push(card);

    const icon = layerOf("icon");
    icon.payload.symbol = literal(row.busy);
    icon.payload.colorSlot.baseColorHex = row.busyHex;
    icon.payload.rules = [buildStatesRule(reading(), [
      { comparison: zero, changes: [setIconTo(row.idle), setColorTo(row.goodWhenZero ? GOOD_HEX : MUTED_HEX)] },
    ], [setIconTo(row.busy), setColorTo(row.busyHex)])];
    placeLayer(cfg, icon, env.family, (family) => summaryRowGeometry(family, i, "icon"));
    cfg.elements.push(icon);

    const text = layerOf("text");
    text.payload.value = { kind: row.value, format: { suffix: row.suffix } };
    text.payload.alignment = "trailing";
    text.payload.fontWeight = "semibold";
    text.payload.rules = [buildStatesRule(reading(), row.rewrites.map(([equals, words]) => ({
      comparison: { kind: "equals" as const, value: literal(equals) },
      changes: [setTextTo(words)],
    })))];
    placeLayer(cfg, text, env.family, (family) => summaryRowGeometry(family, i, "text"));
    cfg.elements.push(text);
    // Each row is a part of its own: card, symbol and count move together,
    // and `applyPreset` then folds the three rows into the preset's group.
    createGroup(cfg, [card.payload.id, icon.payload.id, text.payload.id], row.name);
    if (i === 0) first = text.payload.id;
  });
  return first;
}

// ── card presets ──────────────────────────────────────────────────────────
// Presets whose look is a card: a pill or a bar under the reading, the way
// the system's own widgets draw a cell. Wide shapes only where the pill
// carries a name; the reading-and-bar and the photo fit every shape.

/** The pill and what sits in it: the pill itself across the middle of the
 * face, the symbol at its left end and the name filling the rest. */
function pillGeometry(family: DrawableFamily, part: "card" | "icon" | "text"): PresetGeometry {
  const canvas = CANVAS[family];
  const height = 0.5;
  const y = 0.25;
  const size = clamp(Math.round(canvas.height * height * (part === "icon" ? 0.55 : 0.5)), 9, 22);
  switch (part) {
    case "card": return { frame: { x: 0.05, y, width: 0.9, height, rotationDegrees: 0 } };
    case "icon": return { frame: { x: 0.1, y, width: 0.14, height, rotationDegrees: 0 }, size };
    case "text": return { frame: { x: 0.27, y, width: 0.63, height, rotationDegrees: 0 }, size };
  }
}

/**
 * A pill that fills with the accent while the entity is on, with its symbol
 * and its name inside it, and a tap that toggles it.
 *
 * The Toggle button is a bare glyph, which is what fits a corner; this is the
 * same idea drawn the way a wide face can afford, and the tap is attached to
 * the pill so the whole pill is the button. The ink inside flips to near
 * black while the pill is lit, because the pill's own color carries the state
 * and white on amber does not read.
 */
export function addTogglePill(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const symbols = toggleSymbols(full);
  const on = (): Comparison => onComparison(full);
  const reading = (): Value => entityStateValue(full);

  const pill = newCard();
  pill.payload.rules = [buildStatesRule(reading(), [
    { comparison: on(), changes: [setColorTo(ACCENT_HEX)] },
  ], [setColorTo(CARD_HEX)])];
  placeLayer(cfg, pill, env.family, (family) => pillGeometry(family, "card"));
  cfg.elements.push(pill);

  const icon = layerOf("icon");
  icon.payload.symbol = literal(symbols.off);
  icon.payload.rules = [buildStatesRule(reading(), [
    { comparison: on(), changes: [setIconTo(symbols.on), setColorTo(ON_INK_HEX)] },
  ], [setIconTo(symbols.off), setColorTo(WHITE_HEX)])];
  placeLayer(cfg, icon, env.family, (family) => pillGeometry(family, "icon"));
  cfg.elements.push(icon);

  const name = layerOf("text");
  name.payload.value = refLabel(full);
  name.payload.alignment = "leading";
  name.payload.fontWeight = "semibold";
  name.payload.rules = [buildStatesRule(reading(), [
    { comparison: on(), changes: [setColorTo(ON_INK_HEX)] },
  ], [setColorTo(WHITE_HEX)])];
  placeLayer(cfg, name, env.family, (family) => pillGeometry(family, "text"));
  cfg.elements.push(name);

  attachTap(cfg, pill.payload.id, { type: "toggleEntity", ...full });
  return pill.payload.id;
}

/** A thin bar along the bottom of the face, under the bands above it. Its
 * height is in points, because a bar that scaled with the face would be a
 * slab on a Home Screen tile. */
function bottomBarGeometry(family: DrawableFamily): PresetGeometry {
  const canvas = CANVAS[family];
  const height = clamp(Math.round(canvas.height * 0.08), 4, 8);
  return { frame: { x: 0.08, y: round4(0.9 - height / canvas.height), width: 0.84, height: round4(height / canvas.height), rotationDegrees: 0 } };
}

/**
 * A capsule that fills from the left with a reading, colored by where in the
 * range the reading sits. `colors` runs lowest band first, the same way a
 * gauge's do, and the rule is the same one a gauge wears so the two agree.
 */
function levelBar(
  ref: EntityRef,
  value: Value,
  range: { min: number; max: number },
  colors: BandColors,
): Extract<Element, { kind: "shape" }> {
  const bar = newCard();
  bar.payload.colorSlot.baseColorHex = colors[1];
  bar.payload.level = { ...defaultLevel(value), minValue: range.min, maxValue: range.max, direction: "right" };
  bar.payload.rules = [gaugeBandRule(ref, range, colors)];
  return bar;
}

/**
 * The name, the reading big, and a bar under it that fills with the reading.
 *
 * The Sensor gauge says the same thing as an arc, which suits a round face;
 * a bar suits a wide one, and leaves room for the name above the number that
 * the arc has to do without. Range and ramp come from the entity the same way
 * the gauge's do, so a battery runs red to green and a temperature stays
 * neutral.
 */
export function addLevelBar(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  addQuietLine(cfg, refLabel(full), env, (family) => bandGeometry(family, 0.06, 0.18, 0.8, 13));

  const text = layerOf("text");
  text.payload.value = entityStateValue(full, env.state);
  text.payload.fontWeight = "semibold";
  placeLayer(cfg, text, env.family, (family) => bandGeometry(family, 0.26, 0.4, 0.82, 26));
  cfg.elements.push(text);

  const bar = levelBar(full, entityStateValue(full), gaugeRange(env.state), bandColors(env.state));
  placeLayer(cfg, bar, env.family, bottomBarGeometry);
  cfg.elements.push(bar);
  return text.payload.id;
}

/**
 * The humidity and the wind on one line, each only when the entity reports
 * it. `%g`-free on purpose: both round to whole numbers, because "64.3%" on a
 * wrist is noise.
 */
export function weatherDetailsTemplate(entityId: string): string {
  const attr = (name: string) => `state_attr('${entityId}', '${name}')`;
  return `{% set h = ${attr("humidity")} %}{% set w = ${attr("wind_speed")} %}{% set u = ${attr("wind_speed_unit")} or '' %}`
    + `{% if h is number %}{{ h | round | int }}%{% endif %}`
    + `{% if h is number and w is number %} · {% endif %}`
    + `{% if w is number %}{{ w | round | int }} {{ u }}{% endif %}`;
}

/** Whether a shape is wide enough for a symbol beside its text rather than
 * over it. The two watch bands and the two wide Home Screen tiles are. */
function isWide(family: DrawableFamily): boolean {
  return family === "rectangular" || family === "medium" || family === "large" || family === "xlarge";
}

/** The weather card's three parts. On a wide shape the symbol takes the left
 * third and the two lines stack beside it; on a square one they stack. */
function weatherCardGeometry(family: DrawableFamily, part: "icon" | "temp" | "details"): PresetGeometry {
  const canvas = CANVAS[family];
  if (isWide(family)) {
    switch (part) {
      case "icon": return { frame: { x: 0.04, y: 0.14, width: 0.3, height: 0.72, rotationDegrees: 0 }, size: clamp(Math.round(canvas.height * 0.5), 12, 40) };
      case "temp": return { frame: { x: 0.36, y: 0.1, width: 0.6, height: 0.5, rotationDegrees: 0 }, size: clamp(Math.round(canvas.height * 0.42), 12, 34) };
      case "details": return { frame: { x: 0.36, y: 0.62, width: 0.6, height: 0.28, rotationDegrees: 0 }, size: clamp(Math.round(canvas.height * 0.2), 8, 14) };
    }
  }
  switch (part) {
    case "icon": return bandGeometry(family, 0.06, 0.3, 0.95, 26);
    case "temp": return bandGeometry(family, 0.38, 0.38, 0.85, 30);
    case "details": return bandGeometry(family, 0.78, 0.18, 0.8, 13);
  }
}

/**
 * The weather outside, with more of it than Weather now: the symbol, the
 * temperature big, and the humidity and wind under it. The symbol rule is the
 * same table Weather now uses, so the two agree on what rain looks like.
 */
export function addWeatherCard(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const icon = layerOf("icon");
  icon.payload.symbol = literal("cloud.fill");
  icon.payload.rules = [buildStatesRule(entityStateValue(full),
    WEATHER_SYMBOLS.map(([state, symbol]) => ({
      comparison: { kind: "equals" as const, value: literal(state) },
      changes: [setIconTo(symbol)],
    })),
    [setIconTo("cloud.fill")])];
  placeLayer(cfg, icon, env.family, (family) => weatherCardGeometry(family, "icon"));
  cfg.elements.push(icon);

  const temp = layerOf("text");
  temp.payload.value = {
    kind: { kind: "entityAttribute", ...full, attribute: "temperature" },
    format: { decimals: 0, suffix: "°" },
  };
  temp.payload.fontWeight = "semibold";
  if (isWide(env.family)) temp.payload.alignment = "leading";
  placeLayer(cfg, temp, env.family, (family) => weatherCardGeometry(family, "temp"));
  cfg.elements.push(temp);

  const details = layerOf("text");
  details.payload.value = { kind: { kind: "jinja", value: weatherDetailsTemplate(full.entityId) } };
  details.payload.colorSlot.baseColorHex = MUTED_HEX;
  if (isWide(env.family)) details.payload.alignment = "leading";
  placeLayer(cfg, details, env.family, (family) => weatherCardGeometry(family, "details"));
  cfg.elements.push(details);
  return temp.payload.id;
}

/**
 * When the calendar's next event starts, as unix seconds for the countdown to
 * tick toward. An event already under way prints "Now" and a calendar with
 * nothing coming prints nothing, because a countdown handed a past time draws
 * the raw number.
 */
export function eventStartTemplate(entityId: string): string {
  return `{% set s = state_attr('${entityId}', 'start_time') %}`
    + `{% if s and as_timestamp(s) > now().timestamp() %}{{ as_timestamp(s) | int }}`
    + `{% elif s %}Now{% else %}{% endif %}`;
}

/** The event's name, or the words for having none. `message` is unset on a
 * calendar with nothing ahead, and "None" is not what that should say. */
export function eventTitleTemplate(entityId: string): string {
  return `{{ state_attr('${entityId}', 'message') or 'No events' }}`;
}

/**
 * The next event on one calendar: its name, a live countdown to it, and the
 * clock time it starts.
 *
 * The calendar entity carries only its next event, in `message` and
 * `start_time`, so no list is needed. `start_time` is a local date string
 * rather than ISO, which the countdown cannot read, so the template turns it
 * into seconds on the server, and the same seconds print as the clock time
 * on the line under it.
 */
export function addEventCountdown(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  addQuietLine(cfg, { kind: { kind: "jinja", value: eventTitleTemplate(full.entityId) } }, env, labelBandGeometry);

  const countdown = layerOf("text");
  countdown.payload.value = { kind: { kind: "jinja", value: eventStartTemplate(full.entityId) } };
  countdown.payload.countdown = true;
  countdown.payload.monospacedDigits = true;
  countdown.payload.fontWeight = "semibold";
  placeLayer(cfg, countdown, env.family, mainBandGeometry);
  cfg.elements.push(countdown);

  const at = layerOf("text");
  at.payload.value = {
    kind: { kind: "jinja", value: `{% set s = state_attr('${full.entityId}', 'start_time') %}{% if s %}{{ as_timestamp(s) | int }}{% endif %}` },
    format: { timestamp: "clock" },
  };
  at.payload.colorSlot.baseColorHex = MUTED_HEX;
  placeLayer(cfg, at, env.family, captionBandGeometry);
  cfg.elements.push(at);
  return countdown.payload.id;
}

/** The disc behind the photo, and the photo inside it. The disc is a hair
 * larger than the photo all round, and that hair is the ring. */
function photoGeometry(family: DrawableFamily, part: "disc" | "photo"): PresetGeometry & { radius?: number } {
  const canvas = CANVAS[family];
  const disc = Math.min(canvas.width, canvas.height) * 0.6;
  const ring = clamp(Math.round(disc * 0.07), 1.5, 4);
  const side = part === "disc" ? disc : disc - ring * 2;
  const centreY = canvas.height * 0.42;
  return {
    frame: {
      x: round4((canvas.width - side) / 2 / canvas.width),
      y: round4((centreY - side / 2) / canvas.height),
      width: round4(side / canvas.width),
      height: round4(side / canvas.height),
      rotationDegrees: 0,
    },
    radius: round4(side / 2),
  };
}

/**
 * Their picture in a ring, and a word under it.
 *
 * The ring is a disc behind the picture rather than a border on it: a rule
 * can recolor a disc and cannot recolor a border. The picture is the
 * entity's own `entity_picture`, clipped to a circle by a corner radius of
 * half its side. A person with no picture gets a plain disc, which still says
 * home or away by its color.
 */
export function addPersonPhoto(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const home = (): Value => entityStateValue(full);

  const disc = layerOf("shape");
  disc.payload.kind = "circle";
  disc.payload.borderWidth = 0;
  disc.payload.colorSlot.baseColorHex = MUTED_HEX;
  disc.payload.rules = [buildStatesRule(home(), [
    { comparison: { kind: "equals", value: literal("home") }, changes: [setColorTo(GOOD_HEX)] },
  ], [setColorTo(MUTED_HEX)])];
  placeLayer(cfg, disc, env.family, (family) => photoGeometry(family, "disc"));
  cfg.elements.push(disc);

  const photo = layerOf("image");
  photo.payload.entity = full;
  photo.payload.source = "entityPicture";
  photo.payload.cornerRadius = photoGeometry(env.family, "photo").radius!;
  placeLayer(cfg, photo, env.family, (family) => photoGeometry(family, "photo"));
  cfg.elements.push(photo);

  const word = layerOf("text");
  word.payload.value = entityStateValue(full);
  word.payload.colorSlot.baseColorHex = MUTED_HEX;
  word.payload.rules = [buildStatesRule(home(), [
    { comparison: { kind: "equals", value: literal("home") }, changes: [setTextTo("Home"), setColorTo(GOOD_HEX)] },
    { comparison: { kind: "equals", value: literal("not_home") }, changes: [setTextTo("Away")] },
  ])];
  placeLayer(cfg, word, env.family, (family) => bandGeometry(family, 0.76, 0.18, 0.8, 13));
  cfg.elements.push(word);
  return photo.payload.id;
}

/**
 * The cover art filling the face, the song on a dark band across the bottom,
 * and a tap on the picture that plays or pauses.
 *
 * The band is the same translucent black a picture's timestamp chip wears,
 * so the two look like one family. A player that is off has no art and no
 * title, and the band says so in words, dimmed, the way Now playing does.
 */
export function addNowPlayingArt(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const full = withDomain(ref);
  const quiet: readonly (readonly [string, string])[] = [["off", "Off"], ["idle", "Idle"], ["standby", "Standby"]];

  const art = layerOf("image");
  art.payload.entity = full;
  art.payload.source = "entityPicture";
  placeLayer(cfg, art, env.family, cameraGeometry);
  cfg.elements.push(art);

  const band = newCard("roundedRectangle");
  band.payload.cornerRadius = 5;
  band.payload.colorSlot.baseColorHex = IMAGE_TIMESTAMP_CAPSULE_HEX;
  placeLayer(cfg, band, env.family, () => ({ frame: { x: 0.04, y: 0.66, width: 0.92, height: 0.3, rotationDegrees: 0 } }));
  cfg.elements.push(band);

  const title = layerOf("text");
  title.payload.value = { kind: { kind: "entityAttribute", ...full, attribute: "media_title" } };
  title.payload.fontWeight = "semibold";
  title.payload.rules = [buildStatesRule(entityStateValue(full), [
    ...quiet.map(([word, text]) => ({
      comparison: { kind: "equals" as const, value: literal(word) },
      changes: [setTextTo(text), setOpacityTo(0.6)],
    })),
    { comparison: { kind: "isUnavailable" }, changes: [setTextTo("Unavailable"), setOpacityTo(0.6)] },
  ])];
  placeLayer(cfg, title, env.family, (family) => bandGeometry(family, 0.68, 0.26, 0.6, 15));
  cfg.elements.push(title);

  attachTap(cfg, art.payload.id, {
    type: "callService",
    serviceDomain: "media_player",
    serviceName: "media_play_pause",
    target: full,
  });
  return title.payload.id;
}

// ── list presets ──────────────────────────────────────────────────────────
// A list is one layer with a row inside it, so each of these builds a source,
// a layout and a working row template in one go. Row frames are fractions of
// the cell, never of the face, and the row layers carry their own point sizes
// rather than a per-shape placement: a row laid out for one shape only would
// draw nothing on the others.

/** The list's own box on the face: nearly all of it, with a hair of margin so
 * the top and bottom rows are not against the bezel. A list of cards keeps
 * less, because each card brings its own edge. */
function listGeometry(cards = false): NormalizedFrame {
  return cards
    ? { x: 0.02, y: 0.03, width: 0.96, height: 0.94, rotationDegrees: 0 }
    : { x: 0.04, y: 0.06, width: 0.92, height: 0.88, rotationDegrees: 0 };
}

/** The gap between two card rows, in points: enough to read as two cards and
 * no more, since every point of gap is a point off the rows. */
const CARD_GAP = 2;

/** One card row layer: a capsule across the whole cell, first in the
 * template so the row's other layers sit on it. */
function rowCard(kind: "capsule" | "roundedRectangle" = "capsule"): Element {
  const el = newCard(kind);
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  return el;
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
  layout: { rows: number; direction?: ListDirection; columns?: number; gap?: number; cards?: boolean },
  template: Element[],
): string {
  const el = layerOf("list");
  el.payload.source = source;
  el.payload.rows = layout.rows;
  if (layout.direction) el.payload.direction = layout.direction;
  if (layout.columns !== undefined) el.payload.columns = layout.columns;
  const gap = layout.gap ?? (layout.cards ? CARD_GAP : undefined);
  if (gap !== undefined) el.payload.gap = gap;
  el.payload.template = template;
  placeLayer(cfg, el, env.family, () => ({ frame: listGeometry(layout.cards) }));
  cfg.elements.push(el);
  return el.payload.id;
}

/**
 * A few chosen entities, one per row: icon, name, state. The iPhone's
 * Multi-Entity.
 *
 * The scope is an explicit list starting with the one entity the dialog asks
 * for, because the preset dialog picks one. Three more are filled in beside it
 * (`companionEntities`) so all four rows draw on creation; the Source card
 * swaps them. Rows sort by name: a list has no "as added" order to keep.
 */
export function addEntitiesList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "entities", entities: [withDomain(ref), ...companionEntities(ref, env.states, 3)] },
    sort: "name",
    descending: false,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4, cards: true }, [
    rowCard(),
    rowIcon({ x: 0.04, y: 0.1, width: 0.12, height: 0.8 }, 10),
    rowText(itemValue("name"), { x: 0.2, y: 0, width: 0.46, height: 1 }, { align: "leading" }),
    rowText(itemValue("state", { useEntityUnit: true }), { x: 0.66, y: 0, width: 0.3, height: 1 },
      { align: "trailing", colorHex: MUTED_HEX }),
  ]);
}

/** Domains worth a row when the picked entity's own domain runs out: things
 * people check at a glance, in the order they are most often checked. */
const COMPANION_DOMAINS: readonly string[] = ["light", "climate", "lock", "cover", "switch", "fan", "sensor", "binary_sensor"];

/**
 * Up to `count` more entities to sit beside the picked one.
 *
 * Nearest first: the same domain and device class (another temperature beside
 * a temperature), then the same domain, then the glance domains above. Nothing
 * unavailable or unknown, since a row of dashes looks broken, no groups, and
 * nothing without a name. Sorted by name inside each tier, so the same home always
 * gets the same rows. `domains` narrows the pool and sets the order of the
 * later tiers; without it the glance domains above do both.
 */
export function companionEntities(
  ref: EntityRef,
  states: Record<string, HassEntityState> | undefined,
  count: number,
  domains: readonly string[] = COMPANION_DOMAINS,
): EntityRef[] {
  if (!states) return [];
  const domain = domainOf(ref);
  const deviceClass = states[ref.entityId]?.attributes?.device_class;
  const candidates = Object.values(states).filter((s) =>
    s.entity_id !== ref.entityId
    && s.state !== "unavailable" && s.state !== "unknown"
    // A group lists its members in `entity_id`. "All lights" sorts before
    // every real light and says less than any of them.
    && !Array.isArray(s.attributes?.entity_id)
    && typeof s.attributes?.friendly_name === "string" && s.attributes.friendly_name.trim() !== "");
  const tier = (s: HassEntityState): number => {
    const d = s.entity_id.split(".")[0] ?? "";
    if (d === domain) return deviceClass !== undefined && s.attributes?.device_class === deviceClass ? 0 : 1;
    const i = domains.indexOf(d);
    return i < 0 ? Infinity : 2 + i;
  };
  const name = (s: HassEntityState): string => String(s.attributes.friendly_name).trim();
  return candidates
    .map((s) => ({ s, t: tier(s) }))
    .filter((c) => c.t !== Infinity)
    .sort((a, b) => a.t - b.t || name(a.s).localeCompare(name(b.s)))
    .slice(0, count)
    .map(({ s }) => ({ entityId: s.entity_id, displayName: name(s), domain: s.entity_id.split(".")[0] ?? "" }));
}

/** The next few events, each with the time it starts. */
export function addEventsList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  return addList(cfg, env, { kind: "calendar", entities: [withDomain(ref)], hours: 24 }, { rows: 3, cards: true }, [
    rowCard(),
    rowText(itemValue("title"), { x: 0.05, y: 0, width: 0.6, height: 1 }, { align: "leading" }),
    rowText(itemValue("start", { timestamp: "clock" }), { x: 0.66, y: 0, width: 0.3, height: 1 },
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
  return addList(cfg, env, { kind: "todo", entities: [full], status: "open", sort: "list" }, { rows: 4, cards: true }, [
    rowCard(),
    rowIcon({ x: 0.04, y: 0.1, width: 0.12, height: 0.8 }, 10),
    rowText(itemValue("title"), { x: 0.2, y: 0, width: 0.76, height: 1 }, { align: "leading" }),
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
  return addList(cfg, env, source, { rows: 4, cards: true }, [
    rowCard(),
    rowIcon({ x: 0.04, y: 0.1, width: 0.12, height: 0.8 }, 10),
    rowText(itemValue("name"), { x: 0.2, y: 0, width: 0.76, height: 1 }, { align: "leading" }),
    rowTap({ type: "toggleEntity", entityId: "{item.entityId}", displayName: "", domain: "" }),
  ]);
}

/**
 * Battery sensors, emptiest first, each with a bar that runs down as it does.
 *
 * The bar is colored by the reading rather than left one color, because the
 * length alone is four points of difference between a full battery and a dead
 * one and the color is what carries at a glance. Red under 25, amber under
 * 60, green above: the same three bands the preset's own card draws, so what
 * was promised on the button is what lands on the face.
 *
 * The rule reads `item.state`, which the resolver fills in per row, so one
 * rule colors every bar. `lessThan` compares as a number, and a sensor whose
 * state is not a number matches neither row and falls through to green.
 */
export function addBatteriesList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] },
    deviceClass: "battery",
    sort: "state",
    descending: false,
    attributes: [],
  };
  const bar = rowLevel(itemValue("state"), { x: 0.04, y: 0.34, width: 0.12, height: 0.32 }, GOOD_HEX);
  bar.payload.rules = [buildStatesRule(itemValue("state"), [
    { comparison: { kind: "lessThan", value: literal("25") }, changes: [setColorTo(BAD_HEX)] },
    { comparison: { kind: "lessThan", value: literal("60") }, changes: [setColorTo(WARN_HEX)] },
  ], [setColorTo(GOOD_HEX)])];
  return addList(cfg, env, source, { rows: 4, cards: true }, [
    rowCard(),
    bar,
    rowText(itemValue("name"), { x: 0.2, y: 0, width: 0.46, height: 1 }, { align: "leading" }),
    rowText(itemValue("state", { decimals: 0, useEntityUnit: true }), { x: 0.66, y: 0, width: 0.3, height: 1 },
      { align: "trailing" }),
  ]);
}

/** The domains Recent activity starts on: the ones where a change is
 * something that happened. A fresh array every call, so the document owns its
 * own list and narrowing one complication never narrows the preset. */
function recentDomains(): string[] {
  return ["binary_sensor", "light", "switch", "lock", "cover", "climate", "media_player", "fan", "person"];
}

/**
 * Whatever changed most recently, with how long ago it was.
 *
 * A filter with no domain at all reads nothing: both compilers turn an empty
 * scope into an empty list, so the preset used to draw a blank face for
 * everybody. It names the domains where a change is an event instead. Sensors
 * are deliberately out: a power meter rewrites itself every few seconds and
 * would hold all four rows for ever, which is the opposite of what the list is
 * for. The Source card narrows it further by room or label.
 */
export function addRecentList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: {
      kind: "filter",
      domains: recentDomains(),
      areaIds: [],
      labelIds: [],
      floorIds: [],
    },
    sort: "lastChanged",
    descending: true,
    attributes: [],
  };
  return addList(cfg, env, source, { rows: 4, cards: true }, [
    rowCard(),
    rowText(itemValue("name"), { x: 0.05, y: 0, width: 0.6, height: 1 }, { align: "leading" }),
    rowText(itemValue("age", { relativeTime: true }), { x: 0.66, y: 0, width: 0.3, height: 1 },
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
  const card = rowCard("roundedRectangle");
  if (card.kind === "shape") card.payload.cornerRadius = 5;
  return addList(cfg, env, source, { rows: 4, columns: 2, gap: 3, cards: true }, [
    card,
    rowIcon({ x: 0.34, y: 0.08, width: 0.32, height: 0.42 }, 12),
    rowText(itemValue("name"), { x: 0.04, y: 0.54, width: 0.92, height: 0.42 }, { size: 9 }),
    rowTap({ type: "runScene", entityId: "{item.entityId}", displayName: "", domain: "" }),
  ]);
}

/**
 * Four pills in a grid, one per entity, lit while that entity is on, with a
 * tap on each that toggles it.
 *
 * The Toggle pill drawn as a list: the same pill, the same ink flip, one rule
 * per layer reading `item.state` so it serves every row. Starts with the
 * entity picked and fills the other three cells from the same on/off domains,
 * nearest kind first, so the grid draws full on creation.
 */
export function addTogglesList(cfg: CustomComplicationConfig, ref: EntityRef, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "entities", entities: [withDomain(ref), ...companionEntities(ref, env.states, 3, ON_OFF_DOMAINS)] },
    sort: "name",
    descending: false,
    attributes: [],
  };
  const lit = (on: StyleChange[], off: StyleChange[]): Rule =>
    buildStatesRule(itemValue("state"), [{ comparison: { kind: "isOn" }, changes: on }], off);

  const pill = rowCard();
  pill.payload.rules = [lit([setColorTo(ACCENT_HEX)], [setColorTo(CARD_HEX)])];
  const icon = rowIcon({ x: 0.08, y: 0.2, width: 0.18, height: 0.6 }, 11);
  icon.payload.rules = [lit([setColorTo(ON_INK_HEX)], [setColorTo(WHITE_HEX)])];
  const name = rowText(itemValue("name"), { x: 0.3, y: 0, width: 0.64, height: 1 }, { size: 10, align: "leading", weight: "semibold" });
  name.payload.rules = [lit([setColorTo(ON_INK_HEX)], [setColorTo(WHITE_HEX)])];

  return addList(cfg, env, source, { rows: 4, columns: 2, gap: 3, cards: true }, [
    pill,
    icon,
    name,
    rowTap({ type: "toggleEntity", entityId: "{item.entityId}", displayName: "", domain: "" }),
  ]);
}

/**
 * Everyone in the home, across the face, dimmed while they are out.
 *
 * The rules read `item.state`, which the resolver fills in per row: the same
 * layer is resolved once for each person, so one rule colors all of them. The
 * symbol is fixed rather than the person's own icon, because a row of
 * identical figures reads as a row of people and a row of different glyphs
 * does not.
 */
export function addWhoHomeList(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const source: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["person"], areaIds: [], labelIds: [], floorIds: [] },
    sort: "name",
    descending: false,
    attributes: [],
  };
  const homeRule = (): Rule => buildStatesRule(itemValue("state"), [
    { comparison: { kind: "equals", value: literal("home") }, changes: [setColorTo(GOOD_HEX)] },
  ], [setColorTo(MUTED_HEX), setOpacityTo(0.45)]);

  const figure = layerOf("icon");
  figure.payload.symbol = literal("person.fill");
  figure.payload.frame = { x: 0.2, y: 0.06, width: 0.6, height: 0.46, rotationDegrees: 0 };
  figure.payload.size = 14;
  figure.payload.rules = [homeRule()];

  const name = rowText(itemValue("name"), { x: 0, y: 0.58, width: 1, height: 0.42 }, { size: 9 });
  name.payload.rules = [homeRule()];

  return addList(cfg, env, source, { rows: 4, direction: "across", gap: 2 }, [figure, name]);
}

// ── scene presets ─────────────────────────────────────────────────────────
// Two presets that fill a whole Home Screen tile with one picture: a house
// whose windows are the home's lights, and the home's areas seen from above.
// Both are ordinary layers (shapes, pasted SVG drawings, text, taps, rules),
// so every part stays editable afterwards. Neither asks for an entity: each
// reads the home to fill itself in, and a light or a room is swapped in that
// part's own cards later.

/** How much larger than its point size a pasted drawing is fitted. Mirrors
 * `MDI_SIZE_FACTOR` in the renderer and `mdiSizeFactor` in the app. */
const PATH_SIZE_FACTOR = 1.15;

const FULL_FRAME: NormalizedFrame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** A circle as path data. The drawings here are rectangles and discs only. */
function disc(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
}

function rectPath(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

/** A pasted drawing in one color. */
function drawing(path: string, viewBox: string, hex: string): Extract<Element, { kind: "icon" }> {
  const el = layerOf("icon");
  el.payload.symbol = literal(CUSTOM_SVG_SYMBOL);
  el.payload.path = path;
  el.payload.viewBox = viewBox;
  el.payload.colorSlot.baseColorHex = hex;
  return el;
}

/** A shape with no border and square corners unless told otherwise. */
function flatShape(kind: "rectangle" | "roundedRectangle" | "circle", hex: string, radius = 0): Extract<Element, { kind: "shape" }> {
  const el = layerOf("shape");
  el.payload.kind = kind;
  el.payload.borderWidth = 0;
  el.payload.cornerRadius = radius;
  el.payload.colorSlot.baseColorHex = hex;
  return el;
}

/** A top-to-bottom gradient. The flat color is kept as the first stop, which
 * is what an app older than fills draws. */
function verticalFill(el: Extract<Element, { kind: "shape" }>, stops: readonly (readonly [number, string])[]): void {
  el.payload.fill = { kind: "linear", stops: stops.map(([at, colorHex]) => ({ at, colorHex })), angle: 90 };
  el.payload.colorSlot.baseColorHex = stops[0]![1];
}

function glow(hex: string, radius: number): { colorHex: string; radius: number; dx: number; dy: number } {
  return { colorHex: hex, radius, dx: 0, dy: 0 };
}

/** Shown while the comparison holds, hidden otherwise. */
function showWhile(value: Value, comparison: Comparison): Rule {
  return buildStatesRule(value, [{ comparison, changes: [newStyleChange("show")] }], [newStyleChange("hide")]);
}

function hideWhile(value: Value, comparison: Comparison): Rule {
  return buildStatesRule(value, [{ comparison, changes: [newStyleChange("hide")] }]);
}

function stateOf(ref: EntityRef): Value {
  return { kind: { kind: "entityState", ...ref } };
}

function equalsWord(word: string): Comparison {
  return { kind: "equals", value: literal(word) };
}

/** The area an entity is in: its own, or its device's, as Home Assistant
 * resolves it. */
function areaIdOf(env: PresetEnv, entityId: string): string | undefined {
  const reg = env.registry?.entities?.[entityId];
  if (!reg) return undefined;
  return reg.area_id || (reg.device_id ? env.registry?.devices?.[reg.device_id]?.area_id : undefined) || undefined;
}

function refOf(env: PresetEnv, entityId: string): EntityRef {
  const name = env.states?.[entityId]?.attributes?.friendly_name;
  return {
    entityId,
    displayName: typeof name === "string" && name.trim() !== "" ? name.trim() : entityId,
    domain: entityId.split(".")[0] ?? "",
  };
}

function entitiesOf(env: PresetEnv, domain: string): string[] {
  return Object.keys(env.states ?? {}).filter((id) => id.startsWith(`${domain}.`)).sort();
}

function deviceClassOf(env: PresetEnv, entityId: string): string {
  const dc = env.states?.[entityId]?.attributes?.device_class;
  return typeof dc === "string" ? dc : "";
}

/** A temperature to print: a temperature sensor's state, else a thermostat's
 * current temperature, whole degrees with the degree sign. */
function temperatureValue(env: PresetEnv, candidates: (id: string) => boolean): Value | undefined {
  const format = { decimals: 0, suffix: "°" };
  const sensor = entitiesOf(env, "sensor").find((id) => deviceClassOf(env, id) === "temperature" && candidates(id));
  if (sensor) return { kind: { kind: "entityState", ...refOf(env, sensor) }, format };
  const climate = entitiesOf(env, "climate").find((id) => candidates(id) && env.states?.[id]?.attributes?.current_temperature !== undefined);
  if (climate) return { kind: { kind: "entityAttribute", ...refOf(env, climate), attribute: "current_temperature" }, format };
  return undefined;
}

/** A frame in one shape's own points. */
function pointFrame(family: DrawableFamily, x: number, y: number, w: number, h: number): PresetGeometry {
  const canvas = CANVAS[family];
  return {
    frame: {
      x: round4(x / canvas.width),
      y: round4(y / canvas.height),
      width: round4(w / canvas.width),
      height: round4(h / canvas.height),
      rotationDegrees: 0,
    },
  };
}

// ── the tiny house ────────────────────────────────────────────────────────

/** The house picture was drawn 364 points wide and 382 tall for the large tile,
 * 170 tall for the medium one. A tile scales it evenly and centres it. */
const SCENE_WIDTH = 364;

function sceneHeight(family: DrawableFamily): number {
  return family === "medium" ? 170 : 382;
}

function sceneScale(family: DrawableFamily): { s: number; ox: number; oy: number } {
  const canvas = CANVAS[family];
  const h = sceneHeight(family);
  const s = Math.min(canvas.width / SCENE_WIDTH, canvas.height / h);
  return { s, ox: (canvas.width - SCENE_WIDTH * s) / 2, oy: (canvas.height - h * s) / 2 };
}

/** A rectangle in the picture's own points, as a frame on this tile. */
function sceneRect(family: DrawableFamily, x: number, y: number, w: number, h: number): PresetGeometry {
  const { s, ox, oy } = sceneScale(family);
  return pointFrame(family, ox + x * s, oy + y * s, w * s, h * s);
}

/** A size in the picture's points (a font, an icon, a radius) as tile points. */
function scenePoints(family: DrawableFamily, n: number): number {
  return round2(n * sceneScale(family).s);
}

/** The house itself, tree to car, is 364 by 300 of its own points. It fills
 * the top of the large picture and shrinks into the right of the medium one. */
const HOUSE_W = 364;
const HOUSE_H = 300;
const HOUSE_VIEWBOX = `0 0 ${HOUSE_W} ${HOUSE_H}`;

function houseStage(family: DrawableFamily): { x: number; y: number; k: number } {
  // 160 + 364 x 0.56 is 363.84: the medium house's frame ends at the tile's edge.
  return family === "medium" ? { x: 160, y: 2, k: 0.56 } : { x: 0, y: 0, k: 1 };
}

function houseRect(family: DrawableFamily, x: number, y: number, w: number, h: number): PresetGeometry {
  const st = houseStage(family);
  return sceneRect(family, st.x + x * st.k, st.y + y * st.k, w * st.k, h * st.k);
}

/** A drawing in the house's own points: framed on the whole house, sized so
 * the path fills that frame exactly. */
function houseDrawingGeometry(family: DrawableFamily): PresetGeometry {
  const st = houseStage(family);
  const longest = Math.max(HOUSE_W, HOUSE_H) * st.k;
  return { ...houseRect(family, 0, 0, HOUSE_W, HOUSE_H), size: round2(scenePoints(family, longest) / PATH_SIZE_FACTOR) };
}

/** A drawing in the whole picture's points (stars, rain). */
function skyDrawingGeometry(family: DrawableFamily): PresetGeometry {
  const h = sceneHeight(family);
  return { ...sceneRect(family, 0, 0, SCENE_WIDTH, h), size: round2(scenePoints(family, Math.max(SCENE_WIDTH, h)) / PATH_SIZE_FACTOR) };
}

/** The four windows, in the order lights are handed out: the two downstairs
 * first, since a lit room downstairs is what reads as "someone is home". */
const HOUSE_WINDOWS: readonly { name: string; x: number; y: number; w: number; h: number }[] = [
  { name: "Downstairs left", x: 88, y: 206, w: 44, h: 34 },
  { name: "Downstairs right", x: 168, y: 206, w: 44, h: 34 },
  { name: "Upstairs left", x: 94, y: 156, w: 40, h: 30 },
  { name: "Upstairs right", x: 166, y: 156, w: 40, h: 30 },
];

/** A window's four panes, which leave its frame and its cross showing between
 * them when drawn over the frame's own rectangle. */
function windowPanes(win: { x: number; y: number; w: number; h: number }): string {
  const border = 2;
  const bar = 2;
  const qw = (win.w - 2 * border - bar) / 2;
  const qh = (win.h - 2 * border - bar) / 2;
  const x0 = win.x + border;
  const y0 = win.y + border;
  return [
    rectPath(x0, y0, qw, qh),
    rectPath(x0 + qw + bar, y0, qw, qh),
    rectPath(x0, y0 + qh + bar, qw, qh),
    rectPath(x0 + qw + bar, y0 + qh + bar, qw, qh),
  ].join("");
}

const HOUSE_PARTS: readonly { name: string; hex: string; path: string }[] = [
  { name: "Tree", hex: "#4C8A40", path: disc(37, 194, 26) + disc(22, 212, 16) + disc(54, 210, 18) },
  { name: "Trunk", hex: "#6B4A33", path: rectPath(33, 214, 8, 36) },
  { name: "Roofs", hex: "#5A4841", path: "M62 144L150 80L238 144Z" + rectPath(192, 92, 14, 36) + "M216 180L270 152L326 180Z" + rectPath(132, 199, 36, 5) },
  { name: "Walls", hex: "#F1EADB", path: rectPath(76, 142, 148, 108) + rectPath(222, 178, 98, 72) },
  { name: "Window frames", hex: "#FFFFFF", path: HOUSE_WINDOWS.map((w) => rectPath(w.x, w.y, w.w, w.h)).join("") + disc(150, 118, 10) + rectPath(134, 248, 32, 4) },
  { name: "Glass", hex: "#86A9C8", path: HOUSE_WINDOWS.map(windowPanes).join("") + disc(150, 118, 7) },
  { name: "Front door", hex: "#8A4F36", path: rectPath(139, 206, 22, 44) },
  { name: "Garage door", hex: "#FBF7EE", path: rectPath(236, 194, 70, 56) },
  { name: "Garage panels", hex: "#E0D8C6", path: rectPath(236, 207, 70, 2) + rectPath(236, 221, 70, 2) + rectPath(236, 235, 70, 2) },
  { name: "Driveway", hex: "#A7A39B", path: "M236 252H306L328 298H214Z" },
  { name: "Car", hex: "#4A74C8", path: "M250 269L256 256H286L292 269Z" + "M247 267h48a7 7 0 0 1 7 7v7a7 7 0 0 1-7 7h-48a7 7 0 0 1-7-7v-7a7 7 0 0 1 7-7z" },
  { name: "Windshield", hex: "#A8CBE4", path: "M254 267L259 259H283L288 267Z" },
  { name: "Wheels", hex: "#0C0F18", path: rectPath(262, 275, 18, 5) + rectPath(243, 286, 10, 7) + rectPath(289, 286, 10, 7) },
];

/** Where the stars are, in the picture's points, by tile. */
function starsPath(family: DrawableFamily): string {
  const large: [number, number, number][] = [
    [30, 96, 1.1], [72, 58, 0.9], [118, 74, 1.3], [164, 34, 1], [206, 56, 1.2], [300, 96, 1],
    [336, 70, 1.3], [96, 128, 0.9], [20, 160, 1.2], [322, 150, 0.9], [276, 120, 1.1],
  ];
  const medium: [number, number, number][] = [
    [150, 22, 1], [236, 58, 1.1], [268, 22, 0.9], [300, 64, 1.2], [132, 74, 0.9], [112, 40, 1.1], [340, 90, 1],
  ];
  return (family === "medium" ? medium : large).map(([x, y, r]) => disc(x, y, r)).join("");
}

function rainPath(family: DrawableFamily): string {
  const large: [number, number][] = [
    [20, 30], [64, 80], [110, 20], [150, 120], [200, 60], [240, 140], [290, 30], [330, 100], [40, 170], [90, 220],
    [130, 180], [180, 240], [220, 200], [270, 90], [310, 190], [350, 50], [120, 270], [260, 260], [340, 240], [30, 120],
  ];
  const medium: [number, number][] = [
    [20, 60], [60, 30], [104, 70], [140, 20], [180, 60], [214, 26], [250, 80], [290, 40], [330, 96], [200, 110],
    [270, 118], [150, 100], [232, 44], [310, 70], [350, 30],
  ];
  const [len, run] = family === "medium" ? [9, 3] : [12, 4];
  return (family === "medium" ? medium : large).map(([x, y]) => `M${x} ${y}l1.4 0l${-run} ${len}l-1.4 0z`).join("");
}

/** The weather states that draw rain over the house. */
const RAINY_STATES = ["rainy", "pouring", "lightning-rainy", "snowy-rainy"];

const DAY_INK_HEX = "#0D2136";
const DAY_SUB_HEX = "#0D2136BF";
const NIGHT_SUB_HEX = "#FFFFFFB8";

/**
 * Up to `max` lights for the windows, one per area first so the lit windows
 * mean different rooms, then any others.
 */
export function pickSceneLights(env: PresetEnv, max: number): EntityRef[] {
  const seen = new Set<string>();
  const first: string[] = [];
  const rest: string[] = [];
  for (const id of entitiesOf(env, "light")) {
    const area = areaIdOf(env, id);
    if (area !== undefined && !seen.has(area)) {
      seen.add(area);
      first.push(id);
    } else rest.push(id);
  }
  return [...first, ...rest].slice(0, max).map((id) => refOf(env, id));
}

/**
 * A house that fills the tile, with the home's lights in its windows.
 *
 * Daytime colors throughout, and at night one dark wash over the whole picture
 * with the lit windows drawn above it, so a single rule on `sun.sun` turns day
 * into night instead of one on every wall. The sky, the sun, the moon and the
 * stars follow the same entity; without it the picture is always at night. A
 * window's lit panes glow and are hidden while its light is off; the tap over
 * the window toggles it. A home with fewer than four lights leaves the spare
 * windows dark and untappable.
 */
export function addHouseScene(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const family = env.family;
  const medium = family === "medium";
  const sun = env.states?.["sun.sun"] ? refOf(env, "sun.sun") : undefined;
  const weather = entitiesOf(env, "weather")[0];
  const lights = pickSceneLights(env, HOUSE_WINDOWS.length);
  const put = <T extends Element>(el: T, geometry: PresetGeometry, name?: string): T => {
    if (name) el.payload.name = name;
    placeLayer(cfg, el, family, () => geometry);
    cfg.elements.push(el);
    return el;
  };
  /** The daytime look of a layer, when the sun is up. */
  const byDay = (el: Element, changes: StyleChange[]): void => {
    if (sun) el.payload.rules.push(buildStatesRule(stateOf(sun), [{ comparison: equalsWord("above_horizon"), changes }]));
  };
  const sky: string[] = [];
  const house: string[] = [];

  // The sky: day under night, and the night hidden while the sun is up.
  if (sun) {
    const day = flatShape("rectangle", "#5CA3DE");
    verticalFill(day, [[0, "#5CA3DE"], [0.66, "#CFE6F7"]]);
    sky.push(put(day, { frame: FULL_FRAME }, "Day sky").payload.id);
  }
  const night = flatShape("rectangle", "#09122B");
  verticalFill(night, [[0, "#09122B"], [0.66, "#22335C"]]);
  if (sun) night.payload.rules = [hideWhile(stateOf(sun), equalsWord("above_horizon"))];
  sky.push(put(night, { frame: FULL_FRAME }, "Night sky").payload.id);

  const stars = drawing(starsPath(family), `0 0 ${SCENE_WIDTH} ${sceneHeight(family)}`, "#FFFFFFE6");
  if (sun) stars.payload.rules = [hideWhile(stateOf(sun), equalsWord("above_horizon"))];
  sky.push(put(stars, skyDrawingGeometry(family), "Stars").payload.id);

  const [orbX, orbY, orbR] = medium ? [200, 34, 12] : [250, 62, 16];
  if (sun) {
    const sunDisc = flatShape("circle", "#FFD66B");
    sunDisc.payload.shadow = glow("#FFD66B", 8);
    sunDisc.payload.rules = [hideWhile(stateOf(sun), equalsWord("below_horizon"))];
    sky.push(put(sunDisc, sceneRect(family, orbX - orbR, orbY - orbR, orbR * 2, orbR * 2), "Sun").payload.id);
  }
  const moon = flatShape("circle", "#F3EAD0");
  if (sun) moon.payload.rules = [hideWhile(stateOf(sun), equalsWord("above_horizon"))];
  const moonR = orbR * 0.8;
  sky.push(put(moon, sceneRect(family, orbX - moonR, orbY - moonR, moonR * 2, moonR * 2), "Moon").payload.id);

  const horizon = houseRect(family, 0, 250, HOUSE_W, 1).frame.y;
  const ground = flatShape("rectangle", "#6AA055");
  sky.push(put(ground, { frame: { x: 0, y: horizon, width: 1, height: round4(1 - horizon), rotationDegrees: 0 } }, "Ground").payload.id);
  createGroup(cfg, sky, "Sky");

  // The house, one drawing per color, all framed on the whole house.
  for (const part of HOUSE_PARTS) {
    house.push(put(drawing(part.path, HOUSE_VIEWBOX, part.hex), houseDrawingGeometry(family), part.name).payload.id);
  }

  // Night: one wash over everything drawn so far, clear across the top of the
  // sky so the moon and the stars keep their color.
  const clearTo = medium ? 0.27 : 0.2;
  const wash = flatShape("rectangle", "#0A133000");
  verticalFill(wash, [[0, "#0A133000"], [clearTo, "#0A133000"], [clearTo + 0.2, "#0A1330A6"], [1, "#0A1330B8"]]);
  if (sun) wash.payload.rules = [hideWhile(stateOf(sun), equalsWord("above_horizon"))];
  house.push(put(wash, { frame: FULL_FRAME }, "Night").payload.id);
  house.push(put(drawing(disc(250, 277, 3.6) + disc(292, 277, 3.6), HOUSE_VIEWBOX, "#FFF2C2"), houseDrawingGeometry(family), "Headlights").payload.id);
  createGroup(cfg, house, "House");

  // The lit windows, above the night wash so they glow in the dark.
  HOUSE_WINDOWS.forEach((win, i) => {
    const light = lights[i];
    if (!light) return;
    const full = withDomain(light);
    const lit = drawing(windowPanes(win), HOUSE_VIEWBOX, "#FFD37A");
    lit.payload.shadow = glow("#FFBE5A", medium ? 5 : 8);
    lit.payload.rules = [showWhile(entityStateValue(full), onComparison(full))];
    put(lit, houseDrawingGeometry(family), `${win.name} lit`);
    const tap = layerOf("tap");
    tap.payload.action = { type: "toggleEntity", ...full };
    put(tap, houseRect(family, win.x - 2, win.y - 2, win.w + 4, win.h + 4), `${win.name} tap`);
    createGroup(cfg, [lit.payload.id, tap.payload.id], `${win.name}: ${full.displayName}`);
  });

  if (weather) {
    const rain = drawing(rainPath(family), `0 0 ${SCENE_WIDTH} ${sceneHeight(family)}`, "#A9C2F0B3");
    // One row per word rather than "is one of", which the states table cannot show.
    rain.payload.rules = [buildStatesRule(
      stateOf(refOf(env, weather)),
      RAINY_STATES.map((word) => ({ comparison: equalsWord(word), changes: [newStyleChange("show")] })),
      [newStyleChange("hide")],
    )];
    put(rain, skyDrawingGeometry(family), "Rain");
  }

  // The words, white at night and dark ink by day.
  const title = layerOf("text");
  title.payload.value = literal("Home");
  title.payload.fontSize = scenePoints(family, 17);
  title.payload.fontWeight = "semibold";
  title.payload.alignment = "leading";
  byDay(title, [setColorTo(DAY_INK_HEX)]);
  put(title, sceneRect(family, 16, 12, 200, 22));

  const count = layerOf("text");
  count.payload.value = lights.length === 0
    ? literal("Pick a light for each window")
    : {
      kind: {
        kind: "aggregate",
        aggregate: { function: "count", scope: { kind: "entities", entities: lights.map(withDomain) }, stateFilter: { kind: "isOn" } },
      },
      format: { suffix: ` of ${lights.length} ${lights.length === 1 ? "light" : "lights"} on` },
    };
  count.payload.fontSize = scenePoints(family, 12);
  count.payload.alignment = "leading";
  count.payload.colorSlot.baseColorHex = NIGHT_SUB_HEX;
  byDay(count, [setColorTo(DAY_SUB_HEX)]);
  put(count, sceneRect(family, 16, 34, 240, 16), "Lights on");
  createGroup(cfg, [title.payload.id, count.payload.id], "Title");

  addSceneRefresh(cfg, family, medium ? [320, 12, 32] : [318, 12, 34], (el, day) => byDay(el, day), put);

  if (medium) addHouseFootnote(cfg, env, family, byDay, put);
  else addHouseChips(cfg, env, family, byDay, put);
  return title.payload.id;
}

type ScenePut = <T extends Element>(el: T, geometry: PresetGeometry, name?: string) => T;

/** The round refresh button in the top right: a disc, the arrow on it, and a
 * refresh tap attached to the disc. `at` is x, y and diameter in the
 * picture's points. */
function addSceneRefresh(
  cfg: CustomComplicationConfig,
  family: DrawableFamily,
  at: readonly [number, number, number],
  byDay: (el: Element, changes: StyleChange[]) => void,
  put: ScenePut,
): void {
  const [x, y, d] = at;
  const button = flatShape("circle", "#FFFFFF29");
  byDay(button, [setColorTo("#FFFFFF9E")]);
  put(button, sceneRect(family, x, y, d, d), "Refresh button");
  const arrow = layerOf("icon");
  arrow.payload.symbol = literal("arrow.clockwise");
  arrow.payload.size = scenePoints(family, d * 0.44);
  byDay(arrow, [setColorTo(DAY_INK_HEX)]);
  put(arrow, { ...sceneRect(family, x, y, d, d), size: scenePoints(family, d * 0.44) }, "Refresh arrow");
  attachTap(cfg, button.payload.id, { type: "refresh" });
  createGroup(cfg, [button.payload.id, arrow.payload.id], "Refresh");
}

/** The large tile's three cards along the bottom: inside, outside and the
 * front door, each only when the home has something to read for it. */
function addHouseChips(
  cfg: CustomComplicationConfig,
  env: PresetEnv,
  family: DrawableFamily,
  byDay: (el: Element, changes: StyleChange[]) => void,
  put: ScenePut,
): void {
  const chips: { label: string; value: Value }[] = [];
  const inside = temperatureValue(env, (id) => !id.includes("outdoor") && !id.includes("outside"));
  if (inside) chips.push({ label: "Inside", value: inside });
  const weather = entitiesOf(env, "weather")[0];
  if (weather) {
    chips.push({ label: "Outside", value: { kind: { kind: "entityAttribute", ...refOf(env, weather), attribute: "temperature" }, format: { decimals: 0, suffix: "°" } } });
  }
  const lock = entitiesOf(env, "lock")[0];
  if (lock) chips.push({ label: refOf(env, lock).displayName, value: { kind: { kind: "entityState", ...refOf(env, lock) }, format: { textCase: "capitalized" } } });
  if (chips.length === 0) return;
  const gap = 8;
  const width = (336 - gap * (chips.length - 1)) / chips.length;
  chips.forEach((chip, i) => {
    const x = 14 + i * (width + gap);
    const y = 320;
    const card = flatShape("roundedRectangle", "#FFFFFF17", scenePoints(family, 14));
    byDay(card, [setColorTo("#FFFFFF9E")]);
    put(card, sceneRect(family, x, y, width, 48), `${chip.label} card`);
    const label = layerOf("text");
    label.payload.value = literal(chip.label);
    label.payload.fontSize = scenePoints(family, 11);
    label.payload.alignment = "leading";
    label.payload.colorSlot.baseColorHex = NIGHT_SUB_HEX;
    byDay(label, [setColorTo(DAY_SUB_HEX)]);
    put(label, sceneRect(family, x + 11, y + 7, width - 22, 15), `${chip.label} label`);
    const value = layerOf("text");
    value.payload.value = chip.value;
    value.payload.fontSize = scenePoints(family, 17);
    value.payload.fontWeight = "semibold";
    value.payload.fontDesign = "rounded";
    value.payload.alignment = "leading";
    byDay(value, [setColorTo(DAY_INK_HEX)]);
    put(value, sceneRect(family, x + 11, y + 21, width - 22, 22), `${chip.label} value`);
    createGroup(cfg, [card.payload.id, label.payload.id, value.payload.id], chip.label);
  });
}

/** The medium tile's two lines in the bottom left: the temperatures, then the
 * front door. Templates, because each line reads two or more entities. */
function addHouseFootnote(
  cfg: CustomComplicationConfig,
  env: PresetEnv,
  family: DrawableFamily,
  byDay: (el: Element, changes: StyleChange[]) => void,
  put: ScenePut,
): void {
  const whole = (expr: string) => `{{ ${expr} | float(0) | round(0) | int }}`;
  const parts: string[] = [];
  const climate = entitiesOf(env, "climate").find((id) => env.states?.[id]?.attributes?.current_temperature !== undefined);
  const sensor = entitiesOf(env, "sensor").find((id) => deviceClassOf(env, id) === "temperature" && !id.includes("outdoor") && !id.includes("outside"));
  if (sensor) parts.push(`${whole(`states('${sensor}')`)}° in`);
  else if (climate) parts.push(`${whole(`state_attr('${climate}', 'current_temperature')`)}° in`);
  const weather = entitiesOf(env, "weather")[0];
  if (weather) parts.push(`${whole(`state_attr('${weather}', 'temperature')`)}° out`);
  const ids: string[] = [];
  if (parts.length > 0) {
    const temps = layerOf("text");
    temps.payload.value = { kind: { kind: "jinja", value: parts.join(" · ") } };
    temps.payload.fontSize = scenePoints(family, 15);
    temps.payload.fontWeight = "semibold";
    temps.payload.fontDesign = "rounded";
    temps.payload.alignment = "leading";
    byDay(temps, [setColorTo(DAY_INK_HEX)]);
    ids.push(put(temps, sceneRect(family, 16, 122, 150, 20), "Temperatures").payload.id);
  }
  const lock = entitiesOf(env, "lock")[0];
  if (lock) {
    const door = layerOf("text");
    door.payload.value = { kind: { kind: "jinja", value: `${refOf(env, lock).displayName} {{ states('${lock}') }}` } };
    door.payload.fontSize = scenePoints(family, 12);
    door.payload.alignment = "leading";
    door.payload.colorSlot.baseColorHex = NIGHT_SUB_HEX;
    byDay(door, [setColorTo(DAY_SUB_HEX)]);
    ids.push(put(door, sceneRect(family, 16, 143, 150, 15), "Front door").payload.id);
  }
  createGroup(cfg, ids, "Readings");
}

// ── the floor plan ────────────────────────────────────────────────────────

const PLAN_BG_HEX = "#0F141E";
const PLAN_WALL_HEX = "#2C3446";
const ROOM_OFF_HEX = "#1A2130";
const ROOM_LIT_HEX = "#F2BF5B";
const ROOM_INK_HEX = "#E1E6F0";
const ROOM_LIT_INK_HEX = "#2B1F06";
const ROOM_DIM_INK_HEX = "#98A2B8";
const ROOM_LIT_DIM_HEX = "#2B1F06B3";
const MOTION_HEX = "#58D3C3";
const MOTION_CLASSES = ["motion", "occupancy", "presence"];

/** The most rooms each tile draws. Six layers a room, and 64 in a document. */
function planMaxRooms(family: DrawableFamily): number {
  return family === "medium" ? 6 : 8;
}

export interface PlanRoom {
  name: string;
  /** The area whose lights the room shows and toggles. */
  areaId?: string;
  /** Or one light, for a home whose lights are in no area. */
  light?: EntityRef;
  temperature?: Value;
  motion?: EntityRef;
}

/**
 * The rooms to draw: every area with a light in it, the ones with the most
 * lights first (they get the bigger cells). A home with no areas gets a room
 * per light, and a home with no lights gets four named placeholders.
 */
export function planRooms(env: PresetEnv, max: number): PlanRoom[] {
  const areas = env.registry?.areas ?? {};
  const lights = entitiesOf(env, "light");
  const byArea = new Map<string, number>();
  for (const id of lights) {
    const area = areaIdOf(env, id);
    if (area !== undefined && areas[area] !== undefined) byArea.set(area, (byArea.get(area) ?? 0) + 1);
  }
  const nameOf = (area: string) => (areas[area]?.name ?? "").trim() || area;
  const inArea = (area: string) => (id: string) => areaIdOf(env, id) === area;
  const rooms: PlanRoom[] = [...byArea.entries()]
    .sort(([a, na], [b, nb]) => nb - na || nameOf(a).localeCompare(nameOf(b)))
    .slice(0, max)
    .map(([areaId]) => {
      const room: PlanRoom = { name: nameOf(areaId), areaId };
      const temperature = temperatureValue(env, inArea(areaId));
      if (temperature) room.temperature = temperature;
      const motion = entitiesOf(env, "binary_sensor").find((id) => inArea(areaId)(id) && MOTION_CLASSES.includes(deviceClassOf(env, id)));
      if (motion) room.motion = refOf(env, motion);
      return room;
    });
  if (rooms.length > 0) return rooms;
  if (lights.length > 0) {
    return lights.slice(0, max).map((id) => {
      const light = refOf(env, id);
      return { name: light.displayName, light };
    });
  }
  return ["Living", "Kitchen", "Bedroom", "Office"].slice(0, max).map((name) => ({ name }));
}

interface PointRect { x: number; y: number; w: number; h: number }

/** Where the plan sits on each tile, in its points: under the title, with the
 * tile's own margin all round. */
function planRect(family: DrawableFamily): PointRect {
  const canvas = CANVAS[family];
  switch (family) {
    case "medium": return { x: 10, y: 42, w: canvas.width - 20, h: canvas.height - 42 - 12 };
    case "large":
    case "xlarge": return { x: 13, y: 58, w: canvas.width - 26, h: canvas.height - 58 - 14 };
    default: return { x: canvas.width * 0.04, y: canvas.height * 0.26, w: canvas.width * 0.92, h: canvas.height * 0.7 };
  }
}

/**
 * The rooms' cells: rows of up to three, walls between them. Widths are
 * uneven and every other row mirrors, so the grid reads as a floor rather than
 * a spreadsheet. It is only a start: Home Assistant does not know where a room
 * is, so the author drags the cells into the real shape of the home.
 */
export function planCells(count: number, plan: PointRect): PointRect[] {
  const wall = 2;
  const gap = 3;
  const rows = Math.max(1, Math.ceil(count / 3));
  const base = Math.floor(count / rows);
  const extra = count % rows;
  const inner = { x: plan.x + wall, y: plan.y + wall, w: plan.w - 2 * wall, h: plan.h - 2 * wall };
  const rowH = (inner.h - gap * (rows - 1)) / rows;
  const weightsFor: Record<number, number[]> = { 1: [1], 2: [1.4, 1], 3: [1.25, 0.95, 1.1] };
  const cells: PointRect[] = [];
  for (let r = 0; r < rows; r++) {
    const k = base + (r < extra ? 1 : 0);
    const weights = [...(weightsFor[k] ?? Array.from({ length: k }, () => 1))];
    if (r % 2 === 1) weights.reverse();
    const total = weights.reduce((a, b) => a + b, 0);
    const avail = inner.w - gap * (k - 1);
    let x = inner.x;
    for (const weight of weights) {
      const w = (avail * weight) / total;
      cells.push({ x: round2(x), y: round2(inner.y + r * (rowH + gap)), w: round2(w), h: round2(rowH) });
      x += w + gap;
    }
  }
  return cells;
}

/**
 * The home seen from above: each area a room, lit amber while any light in it
 * is on, with its temperature, a bulb, and a dot while its motion sensor sees
 * someone. A tap on a room toggles every light in its area.
 */
export function addFloorPlan(cfg: CustomComplicationConfig, env: PresetEnv): string {
  const family = env.family;
  const medium = family === "medium";
  const canvas = CANVAS[family];
  const rooms = planRooms(env, planMaxRooms(family));
  const plan = planRect(family);
  const cells = planCells(rooms.length, plan);
  const put = <T extends Element>(el: T, geometry: PresetGeometry, name?: string): T => {
    if (name) el.payload.name = name;
    placeLayer(cfg, el, family, () => geometry);
    cfg.elements.push(el);
    return el;
  };
  const nameSize = medium ? 11.5 : 12.5;
  const tempSize = medium ? 10.5 : 11;
  const bulbSize = medium ? 12 : 13;

  const back = put(flatShape("rectangle", PLAN_BG_HEX), { frame: FULL_FRAME }, "Background");
  const walls = put(flatShape("roundedRectangle", PLAN_WALL_HEX, medium ? 9 : 10), pointFrame(family, plan.x, plan.y, plan.w, plan.h), "Walls");
  createGroup(cfg, [back.payload.id, walls.payload.id], "Floor");

  const areaIds: string[] = [];
  const roomLights: EntityRef[] = [];
  rooms.forEach((room, i) => {
    const cell = cells[i]!;
    let lit: { value: () => Value; comparison: () => Comparison; tap: TapAction } | undefined;
    if (room.areaId !== undefined) {
      const areaId = room.areaId;
      areaIds.push(areaId);
      lit = {
        value: () => ({
          kind: {
            kind: "aggregate",
            aggregate: {
              function: "count",
              scope: { kind: "filter", domains: ["light"], areaIds: [areaId], labelIds: [], floorIds: [] },
              stateFilter: { kind: "isOn" },
            },
          },
        }),
        comparison: () => ({ kind: "greaterThan", value: literal("0") }),
        tap: { type: "callService", serviceDomain: "light", serviceName: "toggle", serviceDataJSON: JSON.stringify({ area_id: areaId }) },
      };
    } else if (room.light !== undefined) {
      const full = withDomain(room.light);
      roomLights.push(full);
      lit = { value: () => entityStateValue(full), comparison: () => onComparison(full), tap: { type: "toggleEntity", ...full } };
    }
    const whenLit = (on: StyleChange[], off?: StyleChange[]): Rule[] =>
      lit ? [buildStatesRule(lit.value(), [{ comparison: lit.comparison(), changes: on }], off)] : [];
    const ids: string[] = [];

    const card = flatShape("roundedRectangle", ROOM_OFF_HEX, medium ? 5 : 6);
    card.payload.rules = whenLit([setColorTo(ROOM_LIT_HEX)]);
    ids.push(put(card, pointFrame(family, cell.x, cell.y, cell.w, cell.h), `${room.name} room`).payload.id);

    const name = layerOf("text");
    name.payload.value = literal(room.name);
    name.payload.fontSize = nameSize;
    name.payload.fontWeight = "semibold";
    name.payload.alignment = "leading";
    name.payload.colorSlot.baseColorHex = ROOM_INK_HEX;
    name.payload.rules = whenLit([setColorTo(ROOM_LIT_INK_HEX)]);
    ids.push(put(name, pointFrame(family, cell.x + 8, cell.y + 5, cell.w - 30, nameSize * 1.45), `${room.name} name`).payload.id);

    if (room.temperature) {
      const temp = layerOf("text");
      temp.payload.value = room.temperature;
      temp.payload.fontSize = tempSize;
      temp.payload.fontDesign = "rounded";
      temp.payload.alignment = "leading";
      temp.payload.colorSlot.baseColorHex = ROOM_DIM_INK_HEX;
      temp.payload.rules = whenLit([setColorTo(ROOM_LIT_DIM_HEX)]);
      const h = tempSize * 1.4;
      ids.push(put(temp, pointFrame(family, cell.x + 8, cell.y + cell.h - 5 - h, cell.w - 30, h), `${room.name} temperature`).payload.id);
    }

    const bulb = layerOf("icon");
    bulb.payload.symbol = literal("lightbulb");
    bulb.payload.colorSlot.baseColorHex = ROOM_DIM_INK_HEX;
    bulb.payload.rules = whenLit([setIconTo("lightbulb.fill"), setColorTo(ROOM_LIT_INK_HEX)], [setIconTo("lightbulb"), setColorTo(ROOM_DIM_INK_HEX)]);
    ids.push(put(bulb, { ...pointFrame(family, cell.x + cell.w - 22, cell.y + 4, 18, 18), size: bulbSize }, `${room.name} bulb`).payload.id);

    if (room.motion) {
      const motion = withDomain(room.motion);
      const dot = flatShape("circle", MOTION_HEX);
      dot.payload.shadow = glow(MOTION_HEX, 3);
      dot.payload.rules = [showWhile(entityStateValue(motion), onComparison(motion))];
      ids.push(put(dot, pointFrame(family, cell.x + cell.w - 14, cell.y + cell.h - 14, 7, 7), `${room.name} motion`).payload.id);
    }

    if (lit) attachTap(cfg, card.payload.id, lit.tap);
    createGroup(cfg, ids, room.name);
  });

  const title = layerOf("text");
  title.payload.value = literal("Home");
  title.payload.fontSize = medium ? 15 : 17;
  title.payload.fontWeight = "semibold";
  title.payload.alignment = "leading";
  title.payload.colorSlot.baseColorHex = ROOM_INK_HEX;
  put(title, medium ? pointFrame(family, 14, 10, 46, 21) : pointFrame(family, 16, 12, 200, 22));

  const count = layerOf("text");
  const scope = areaIds.length > 0
    ? { kind: "filter" as const, domains: ["light"], areaIds, labelIds: [], floorIds: [] }
    : { kind: "entities" as const, entities: roomLights };
  const counted = areaIds.length > 0 || roomLights.length > 0;
  const reading: Value = { kind: { kind: "aggregate", aggregate: { function: "count", scope, stateFilter: { kind: "isOn" } } } };
  count.payload.value = counted ? { ...reading, format: { suffix: " lights on" } } : literal("Pick your rooms");
  if (counted) {
    count.payload.rules = [buildStatesRule(reading, [
      { comparison: equalsWord("0"), changes: [setTextTo("All lights off")] },
      { comparison: equalsWord("1"), changes: [setTextTo("1 light on")] },
    ])];
  }
  count.payload.fontSize = 12;
  count.payload.alignment = "leading";
  count.payload.colorSlot.baseColorHex = "#8C96AD";
  put(count, medium ? pointFrame(family, 62, 13, 200, 16) : pointFrame(family, 16, 34, 240, 16), "Lights on");
  createGroup(cfg, [title.payload.id, count.payload.id], "Title");

  const d = medium ? 30 : 34;
  const button = flatShape("circle", "#FFFFFF1A");
  const at = pointFrame(family, canvas.width - (medium ? 10 : 12) - d, medium ? 6 : 12, d, d);
  put(button, at, "Refresh button");
  const arrow = layerOf("icon");
  arrow.payload.symbol = literal("arrow.clockwise");
  arrow.payload.colorSlot.baseColorHex = ROOM_INK_HEX;
  put(arrow, { ...at, size: round2(d * 0.44) }, "Refresh arrow");
  attachTap(cfg, button.payload.id, { type: "refresh" });
  createGroup(cfg, [button.payload.id, arrow.payload.id], "Refresh");
  return title.payload.id;
}

/**
 * Run one preset and return the id of the layer to select afterwards.
 *
 * Every layer the preset added goes into one group named after the preset,
 * so the finished part moves, copies and deletes as one and the Layers list
 * shows it as one thing. A preset that adds a single layer (a list, a status
 * line) is left loose: `createGroup` wants two members, and a group of one
 * would be a name with nothing to hold together. Attached taps follow the
 * layer they are attached to, as they do everywhere else.
 */
export function applyPreset(
  cfg: CustomComplicationConfig,
  kind: PresetKind,
  ref: EntityRef,
  env: PresetEnv,
): string {
  const before = new Set(cfg.elements.map((e) => e.payload.id));
  const id = buildPreset(cfg, kind, ref, env);
  const added = cfg.elements.filter((e) => !before.has(e.payload.id)).map((e) => e.payload.id);
  createGroup(cfg, added, presetSpec(kind).title);
  return id;
}

function buildPreset(
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
    case "battery": return addBatteryRing(cfg, ref, env);
    case "sparkline": return addSparkline(cfg, ref, env);
    case "lastChanged": return addLastChanged(cfg, ref, env);
    case "person": return addPersonTile(cfg, ref, env);
    case "timer": return addCountdownTimer(cfg, ref, env);
    case "alarm": return addAlarmState(cfg, ref, env);
    case "weatherNow": return addWeatherNow(cfg, ref, env);
    case "sunTimes": return addSunTimes(cfg, ref, env);
    case "openCount": return addOpenCount(cfg, env);
    case "stateIcon": return addStateIcon(cfg, ref, env);
    case "runButton": return addRunButton(cfg, ref, env);
    case "thermostat": return addThermostat(cfg, ref, env);
    case "nowPlaying": return addNowPlaying(cfg, ref, env);
    case "summary": return addHomeSummary(cfg, env);
    case "togglePill": return addTogglePill(cfg, ref, env);
    case "levelBar": return addLevelBar(cfg, ref, env);
    case "weatherCard": return addWeatherCard(cfg, ref, env);
    case "eventCountdown": return addEventCountdown(cfg, ref, env);
    case "personPhoto": return addPersonPhoto(cfg, ref, env);
    case "nowPlayingArt": return addNowPlayingArt(cfg, ref, env);
    case "listEntities": return addEntitiesList(cfg, ref, env);
    case "listEvents": return addEventsList(cfg, ref, env);
    case "listTodo": return addTodoList(cfg, ref, env);
    case "listHourly": return addHourlyForecastList(cfg, ref, env);
    case "listDaily": return addDailyForecastList(cfg, ref, env);
    case "listLightsOn": return addLightsOnList(cfg, env);
    case "listBatteries": return addBatteriesList(cfg, env);
    case "listRecent": return addRecentList(cfg, env);
    case "listScenes": return addScenesList(cfg, env);
    case "listWhoHome": return addWhoHomeList(cfg, env);
    case "listToggles": return addTogglesList(cfg, ref, env);
    case "houseScene": return addHouseScene(cfg, env);
    case "floorPlan": return addFloorPlan(cfg, env);
  }
}
