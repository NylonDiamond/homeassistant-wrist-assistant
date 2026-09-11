// What control a test value gets under the preview: a slider for a number, a
// picker for a state with a known set of words, and a text box for the rest.
// Nothing here is saved; it only shapes how a value is tried out.

import type { HassEntityState } from "./ha-api.js";
import { TIMELINE_DOMAIN_STATES } from "./model.js";

export type TestControl =
  | { kind: "number"; min: number; max: number; step: number }
  | { kind: "choice"; options: string[] }
  | { kind: "text" };

/** States any entity can fall into, offered last so a face can be checked
 * against a sensor that has dropped off. */
const ALWAYS_STATES = ["unavailable", "unknown"];

/** Domains the timeline table does not cover but whose states are still a
 * short, fixed list. */
const MORE_DOMAIN_STATES: Record<string, string[]> = {
  automation: ["on", "off"], script: ["on", "off"], remote: ["on", "off"], update: ["on", "off"],
  timer: ["idle", "active", "paused"],
  sun: ["above_horizon", "below_horizon"],
  valve: ["open", "closed", "opening", "closing"],
  lawn_mower: ["mowing", "docked", "paused", "returning", "error"],
  weather: ["sunny", "clear-night", "partlycloudy", "cloudy", "rainy", "pouring", "snowy", "snowy-rainy",
    "fog", "windy", "windy-variant", "lightning", "lightning-rainy", "hail", "exceptional"],
};

const TEMPERATURE_UNITS = new Set(["°C", "°F"]);

function stringList(v: unknown): string[] | undefined {
  return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string") ? v : undefined;
}

function finite(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

/** The step a reading is written in: 0.1 for "121.5", 1 for "42". */
function stepOf(text: string | undefined): number {
  const decimals = text?.trim().match(/\.(\d+)$/)?.[1]?.length ?? 0;
  return decimals === 0 ? 1 : 10 ** -Math.min(decimals, 4);
}

/** The next round number at or above `n`: 1, 2, 2.5 or 5 times a power of ten. */
function roundUp(n: number): number {
  const scale = 10 ** Math.floor(Math.log10(n));
  const unit = [1, 2, 2.5, 5, 10].find((m) => m * scale >= n) ?? 10;
  return unit * scale;
}

function uniqueWords(words: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    if (w === undefined || w === "" || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

/**
 * The control for one entity's test value.
 *
 * A known list of states wins, because "on" is a word to pick even though it
 * is short. The entity's own list comes first (a select's options, a climate
 * entity's modes), then the domain's usual words. The live state and the value
 * being tried are always in the list, so a picker never hides what is showing.
 *
 * A number slides. An entity that states its own range (input_number, number)
 * keeps it; a percentage runs 0 to 100; anything else gets room to double, and
 * a temperature the same room below zero. The range always stretches to reach
 * the value being tried, so a typed 130% still sits on the slider.
 */
export function testControlFor(entityId: string, s: HassEntityState | undefined, current?: string): TestControl {
  const domain = entityId.split(".")[0] ?? "";
  const attrs = s?.attributes ?? {};

  const listed = stringList(attrs.options) ?? (domain === "climate" ? stringList(attrs.hvac_modes) : undefined);
  const words = listed ?? TIMELINE_DOMAIN_STATES[domain] ?? MORE_DOMAIN_STATES[domain];
  if (words) return { kind: "choice", options: uniqueWords([...words, s?.state, current, ...ALWAYS_STATES]) };

  const live = finite(s?.state);
  const unit = typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : undefined;
  if (live === undefined && unit === undefined && domain !== "input_number" && domain !== "number") return { kind: "text" };

  const tried = finite(current);
  const ownMin = finite(attrs.min);
  const ownMax = finite(attrs.max);
  const ownStep = finite(attrs.step);
  let min: number;
  let max: number;
  if (ownMin !== undefined && ownMax !== undefined && ownMax > ownMin) {
    min = ownMin;
    max = ownMax;
  } else if (unit === "%") {
    min = 0;
    max = 100;
  } else {
    const reach = roundUp(Math.max(Math.abs(live ?? 0) * 2, 10));
    min = (live ?? 0) < 0 || (unit !== undefined && TEMPERATURE_UNITS.has(unit)) ? -reach : 0;
    max = reach;
  }
  if (tried !== undefined) {
    min = Math.min(min, tried);
    max = Math.max(max, tried);
  }
  const step = ownStep !== undefined && ownStep > 0 ? ownStep : stepOf(s?.state);
  return { kind: "number", min, max, step };
}
