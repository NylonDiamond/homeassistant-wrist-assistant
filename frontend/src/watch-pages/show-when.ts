// A tile's "Show only when" (`showWhen`): the watch shows the tile only while
// another entity's raw Home Assistant state compares true, as Home
// Assistant's conditional card does. The watch's side is
// `GridConfiguration.TileCondition` and `VisibilityOperator.evaluate`.

import type { HassEntityState } from "../ha-api.js";
import type { WatchPageTile } from "./model.js";

/** Every `VisibilityOperator` the watch reads (`page-keys.json`). */
export const WATCH_SHOW_WHEN_OPERATOR_VALUES = ["eq", "neq", "gt", "lt", "gte", "lte", "contains"] as const;
export type WatchShowWhenOperator = (typeof WATCH_SHOW_WHEN_OPERATOR_VALUES)[number];

/** The operators the panel offers, in menu order. The rest are read and
 * kept, never offered. */
export const WATCH_SHOW_WHEN_OPERATORS: readonly [WatchShowWhenOperator, string][] = [
  ["eq", "is"],
  ["neq", "is not"],
  ["gt", "is above"],
  ["lt", "is below"],
];

/** A tile's condition as stored. */
export interface WatchShowWhen {
  entityId: string;
  comparisonOperator: WatchShowWhenOperator;
  state: string;
}

export function isWatchShowWhenOperator(value: unknown): value is WatchShowWhenOperator {
  return typeof value === "string" && (WATCH_SHOW_WHEN_OPERATOR_VALUES as readonly string[]).includes(value);
}

/** The tile's condition, or undefined when it has none or one the watch
 * could not read. */
export function watchTileShowWhen(tile: WatchPageTile): WatchShowWhen | undefined {
  const raw = tile.showWhen;
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;
  const c = raw as Record<string, unknown>;
  if (typeof c.entityId !== "string" || typeof c.state !== "string" || !isWatchShowWhenOperator(c.comparisonOperator)) return undefined;
  return { entityId: c.entityId, comparisonOperator: c.comparisonOperator, state: c.state };
}

/** A number as Swift's `Double(String)` reads one, else undefined. */
function swiftDouble(text: string): number | undefined {
  if (/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(text)) return Number(text);
  if (/^[+-]?(inf|infinity)$/i.test(text)) return text.startsWith("-") ? -Infinity : Infinity;
  return undefined;
}

/** `VisibilityOperator.evaluate`: text compares ignoring case, the four
 * number operators are false unless both sides are numbers. */
export function watchShowWhenCompares(operator: WatchShowWhenOperator, entityState: string, value: string): boolean {
  const a = entityState.toLowerCase();
  const b = value.toLowerCase();
  switch (operator) {
    case "eq":
      return a === b;
    case "neq":
      return a !== b;
    case "contains":
      return a.includes(b);
  }
  const x = swiftDouble(entityState);
  const y = swiftDouble(value);
  if (x === undefined || y === undefined) return false;
  switch (operator) {
    case "gt":
      return x > y;
    case "lt":
      return x < y;
    case "gte":
      return x >= y;
    case "lte":
      return x <= y;
  }
}

/** Whether the condition lets the tile show (`TileCondition.passes`): an
 * entity with no state shows the tile, as on the watch before its first data. */
export function watchShowWhenPasses(condition: WatchShowWhen, states: Readonly<Record<string, HassEntityState>>): boolean {
  if (condition.entityId === "") return true;
  const state = states[condition.entityId]?.state;
  return state === undefined ? true : watchShowWhenCompares(condition.comparisonOperator, state, condition.state);
}

/** A value the Value row offers: what is stored, and the words shown. */
export interface WatchShowWhenChoice {
  value: string;
  label: string;
}

/** The states each domain can be in, with Home Assistant's words. */
const DOMAIN_STATES: Readonly<Record<string, readonly [string, string][]>> = {
  person: [["home", "Home"], ["not_home", "Away"]],
  device_tracker: [["home", "Home"], ["not_home", "Away"]],
  lock: [["locked", "Locked"], ["unlocked", "Unlocked"], ["open", "Open"], ["jammed", "Jammed"]],
  cover: [["open", "Open"], ["closed", "Closed"], ["opening", "Opening"], ["closing", "Closing"]],
  alarm_control_panel: [["disarmed", "Disarmed"], ["armed_home", "Armed home"], ["armed_away", "Armed away"], ["armed_night", "Armed night"], ["triggered", "Triggered"]],
  media_player: [["playing", "Playing"], ["paused", "Paused"], ["idle", "Idle"], ["on", "On"], ["off", "Off"]],
  vacuum: [["cleaning", "Cleaning"], ["docked", "Docked"], ["returning", "Returning"], ["idle", "Idle"], ["paused", "Paused"], ["error", "Error"]],
  lawn_mower: [["mowing", "Mowing"], ["docked", "Docked"], ["paused", "Paused"], ["error", "Error"]],
  sun: [["above_horizon", "Above horizon"], ["below_horizon", "Below horizon"]],
  climate: [["off", "Off"], ["heat", "Heat"], ["cool", "Cool"], ["heat_cool", "Heat/Cool"], ["auto", "Auto"], ["dry", "Dry"], ["fan_only", "Fan only"]],
  timer: [["active", "Active"], ["paused", "Paused"], ["idle", "Idle"]],
  update: [["on", "Update available"], ["off", "Up to date"]],
};

/** Domains whose states are on and off. */
const ON_OFF_DOMAINS = new Set([
  "light", "switch", "fan", "input_boolean", "binary_sensor", "remote", "siren", "automation", "humidifier", "script",
]);

/** A binary sensor's on and off in its device class's words, as Home
 * Assistant shows them. */
const BINARY_CLASS_WORDS: Readonly<Record<string, readonly [string, string]>> = {
  battery: ["Low", "Normal"],
  battery_charging: ["Charging", "Not charging"],
  carbon_monoxide: ["Detected", "Clear"],
  cold: ["Cold", "Normal"],
  connectivity: ["Connected", "Disconnected"],
  door: ["Open", "Closed"],
  garage_door: ["Open", "Closed"],
  gas: ["Detected", "Clear"],
  heat: ["Hot", "Normal"],
  light: ["Light detected", "No light"],
  lock: ["Unlocked", "Locked"],
  moisture: ["Wet", "Dry"],
  motion: ["Detected", "Clear"],
  moving: ["Moving", "Not moving"],
  occupancy: ["Detected", "Clear"],
  opening: ["Open", "Closed"],
  plug: ["Plugged in", "Unplugged"],
  power: ["Power detected", "No power"],
  presence: ["Home", "Away"],
  problem: ["Problem", "OK"],
  running: ["Running", "Not running"],
  safety: ["Unsafe", "Safe"],
  smoke: ["Detected", "Clear"],
  sound: ["Detected", "Clear"],
  tamper: ["Tampering detected", "Clear"],
  vibration: ["Detected", "Clear"],
  window: ["Open", "Closed"],
};

/** Words for a raw state with none of its own: `not_home` reads "Not home". */
function stateWords(state: string): string {
  const words = state.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * The values the Value row offers for an entity, as buttons: the states its
 * domain can be in, in its device class's words for a binary sensor; a
 * select's options; for a person or tracker, the zones; and its state now
 * when that is none of those (a sensor's reading). Empty with no entity.
 */
export function watchShowWhenStateChoices(entityId: string, states: Readonly<Record<string, HassEntityState>>): WatchShowWhenChoice[] {
  if (entityId === "") return [];
  const domain = entityId.split(".")[0] ?? "";
  const live = states[entityId];
  const out: WatchShowWhenChoice[] = [];
  const add = (value: unknown, label?: unknown) => {
    if (typeof value !== "string" || value === "" || out.some((c) => c.value === value)) return;
    out.push({ value, label: typeof label === "string" && label !== "" ? label : stateWords(value) });
  };
  if (ON_OFF_DOMAINS.has(domain)) {
    const words = domain === "binary_sensor" ? BINARY_CLASS_WORDS[String(live?.attributes.device_class ?? "")] : undefined;
    add("on", words?.[0] ?? "On");
    add("off", words?.[1] ?? "Off");
  }
  // A climate entity lists its own modes; the table is for one that does not.
  const modes = domain === "climate" ? live?.attributes.hvac_modes : undefined;
  if (Array.isArray(modes)) {
    for (const m of modes) add(m, DOMAIN_STATES.climate!.find(([v]) => v === m)?.[1]);
  } else {
    for (const [value, label] of DOMAIN_STATES[domain] ?? []) add(value, label);
  }
  if (domain === "person" || domain === "device_tracker") {
    for (const [id, s] of Object.entries(states)) {
      if (id.startsWith("zone.") && id !== "zone.home") add(s.attributes.friendly_name);
    }
  }
  const options = live?.attributes.options;
  if (Array.isArray(options)) for (const o of options) add(o, o);
  // A reading such as 42 % or a zone name the tracker reports.
  if (live !== undefined && live.state !== "unavailable" && live.state !== "unknown") add(live.state, live.state);
  return out;
}
