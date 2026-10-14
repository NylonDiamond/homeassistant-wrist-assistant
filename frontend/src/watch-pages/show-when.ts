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

/** States the State box offers for an entity: its own now, the domain's
 * usual ones, a select's options and, for a person or tracker, the zones. */
export function watchShowWhenStateSuggestions(entityId: string, states: Readonly<Record<string, HassEntityState>>): string[] {
  const domain = entityId.split(".")[0] ?? "";
  const out: string[] = [];
  const add = (s: unknown) => {
    if (typeof s === "string" && s !== "" && !out.includes(s)) out.push(s);
  };
  const live = states[entityId];
  add(live?.state);
  const usual: Record<string, string[]> = {
    person: ["home", "not_home"],
    device_tracker: ["home", "not_home"],
    lock: ["locked", "unlocked", "open", "jammed"],
    cover: ["open", "closed", "opening", "closing"],
    alarm_control_panel: ["disarmed", "armed_home", "armed_away", "armed_night", "triggered"],
    media_player: ["playing", "paused", "idle", "off", "on"],
    climate: ["off", "heat", "cool", "heat_cool", "auto"],
    vacuum: ["cleaning", "docked", "returning", "idle", "paused"],
    sun: ["above_horizon", "below_horizon"],
  };
  for (const s of usual[domain] ?? ["on", "off"]) add(s);
  if (domain === "person" || domain === "device_tracker") {
    for (const [id, s] of Object.entries(states)) {
      if (id.startsWith("zone.") && id !== "zone.home") add(s.attributes.friendly_name);
    }
  }
  const options = live?.attributes.options;
  if (Array.isArray(options)) for (const o of options) add(o);
  add("unavailable");
  return out;
}
