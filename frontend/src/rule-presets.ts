// Rule presets: one menu item, a finished test.
//
// A case's "+ test" gives an empty test and leaves the author to find the sun
// entity, remember that Home Assistant spells the state `below_horizon`, and
// know that Jinja counts weekdays from Monday. A preset is the intent instead:
// "after sunset" writes the whole test, already pointed at `sun.sun`, and any
// later edit is free to take it apart.
//
// Everything here is pure. A preset returns `Test[]`, the caller pushes them
// into a case inside one `Draft.update`, and undo removes them in a single
// step. Nothing in this file reaches for the document or the DOM.

import type { HassEntityState } from "./ha-api.js";
import { type EntityRef, type Test, literal, newId } from "./model.js";

/** Home Assistant's sun integration is a single fixed entity, which is what
 * lets three of these presets need no entity picker at all. */
export const SUN_ENTITY_ID = "sun.sun";

/**
 * The stored reference to `sun.sun`, with the name Home Assistant itself uses
 * when the panel can see it. "Sun" is the fallback, not a guess at a name: it
 * is what the integration is called when the states map has nothing to say.
 */
export function sunRef(states?: Record<string, HassEntityState>): EntityRef {
  const s = states?.[SUN_ENTITY_ID];
  const friendly = typeof s?.attributes?.friendly_name === "string" ? s.attributes.friendly_name.trim() : "";
  return { entityId: SUN_ENTITY_ID, displayName: friendly || "Sun", domain: "sun" };
}

// ── weekdays ──────────────────────────────────────────────────────────────

/** Monday first, because that is where Jinja's `now().weekday()` starts and
 * the stored options are those numbers. Index is the stored value. */
export const WEEKDAY_LABELS: readonly string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** The days a "weekday in" preset starts with. A working week is what someone
 * reaches for first; a weekend rule is two clicks from here. */
export const WEEKDAYS_MON_FRI: readonly number[] = [0, 1, 2, 3, 4];

/** Stored options to the day numbers they name, dropping anything that is not
 * a day. Used by the editor's checkbox row, which cannot show a seventh box
 * for an option a hand-written document invented. */
export function weekdayNumbers(options: readonly string[] | undefined): number[] {
  const out: number[] = [];
  for (const o of options ?? []) {
    const text = o.trim();
    // An empty string is not a day. `Number("")` is 0, which would quietly make
    // a blank option mean Monday.
    if (text === "") continue;
    const n = Number(text);
    if (Number.isInteger(n) && n >= 0 && n <= 6 && !out.includes(n)) out.push(n);
  }
  return out.sort((a, b) => a - b);
}

/** Day numbers back to stored options, in week order. */
export function weekdayOptions(days: readonly number[]): string[] {
  return [...new Set(days)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b).map(String);
}

/** "Mon, Tue and Wed", for a summary line. */
export function weekdayWords(days: readonly number[]): string {
  const names = weekdayOptions(days).map((d) => WEEKDAY_LABELS[Number(d)] ?? d);
  if (names.length === 0) return "no days";
  if (names.length === 1) return names[0]!;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// ── the presets ───────────────────────────────────────────────────────────

export type RulePresetKind = "afterSunset" | "daytime" | "sunElevation" | "weekday" | "timeBetween";

export interface RulePresetSpec {
  kind: RulePresetKind;
  /** The menu wording. */
  label: string;
  /** One line on the menu item, so what it will write is visible before it is
   * chosen. */
  hint: string;
}

export const RULE_PRESETS: readonly RulePresetSpec[] = [
  {
    kind: "afterSunset",
    label: "After sunset",
    hint: "True from sunset to sunrise, from the sun entity's own state.",
  },
  {
    kind: "daytime",
    label: "Daytime",
    hint: "True while the sun is up.",
  },
  {
    kind: "sunElevation",
    label: "Sun below an angle",
    hint: "The sun's elevation in degrees, below a number you set. 0 is the horizon.",
  },
  {
    kind: "weekday",
    label: "Weekday is one of",
    hint: "A row of days, starting on Monday to Friday.",
  },
  {
    kind: "timeBetween",
    label: "Time between",
    hint: "A clock window that may wrap midnight, starting at 22:00 to 06:00.",
  },
];

/** The sun's state is `above_horizon` or `below_horizon`, which is why these
 * two presets are one equals test and not a template. */
export function afterSunsetTests(sun: EntityRef): Test[] {
  return [sunStateTest(sun, "below_horizon")];
}

export function daytimeTests(sun: EntityRef): Test[] {
  return [sunStateTest(sun, "above_horizon")];
}

function sunStateTest(sun: EntityRef, state: string): Test {
  return {
    id: newId(),
    value: { kind: { kind: "entityState", ...sun } },
    comparison: { kind: "equals", value: literal(state) },
  };
}

/** Degrees above the horizon, negative below it. 0 is the geometric horizon,
 * which is close to but not the same as the state flipping; someone reaching
 * for this usually wants a few degrees either side. */
export function sunElevationTests(sun: EntityRef, degrees = 0): Test[] {
  return [{
    id: newId(),
    value: { kind: { kind: "entityAttribute", ...sun, attribute: "elevation" } },
    comparison: { kind: "lessThan", value: literal(String(degrees)) },
  }];
}

export function weekdayTests(days: readonly number[] = WEEKDAYS_MON_FRI): Test[] {
  return [{
    id: newId(),
    value: { kind: { kind: "time", timeField: "weekday" } },
    comparison: { kind: "isOneOf", options: weekdayOptions(days) },
  }];
}

/** Start included, end excluded, and an end earlier than the start wraps
 * midnight. Both bounds are literal `HH:MM`, which is the shape `time(now)`
 * resolves to. */
export function timeBetweenTests(start = "22:00", end = "06:00"): Test[] {
  return [{
    id: newId(),
    value: { kind: { kind: "time", timeField: "now" } },
    comparison: { kind: "timeBetween", value: literal(start), upper: literal(end) },
  }];
}

/** What one menu choice adds. Every preset lands with a working default, so a
 * choice is never a form to fill in before anything happens. */
export function rulePresetTests(kind: RulePresetKind, sun: EntityRef): Test[] {
  switch (kind) {
    case "afterSunset": return afterSunsetTests(sun);
    case "daytime": return daytimeTests(sun);
    case "sunElevation": return sunElevationTests(sun);
    case "weekday": return weekdayTests();
    case "timeBetween": return timeBetweenTests();
  }
}
