// The states a domain is known to report, with an icon and a colour for each.
//
// A timeline already seeds its colour bands from the domain and device class
// (`seedTimelineBands`), because a strip in one colour answers none of the
// questions a timeline is added to answer. A states table has the same problem
// and the same answer: the domain already knows that a cover is open, closed,
// opening or closing, so the rows can be written for the author and left there
// to edit.
//
// Everything here is pure data plus two functions over it. The button that
// calls it lives in the editor, and nothing on the wire changes: a seeded table
// is an ordinary `Rule` with an ordinary case per row.
//
// Two rules the table follows:
//
//  1. The words are the recorder's, not the frontend's. A binary sensor is `on`
//     and `off` whatever its device class, so a door-shaped one gets `on` and
//     `off` with the icons and colours a door wants rather than rows spelling
//     `open` that would match nothing.
//  2. Every symbol is in `CURATED_SYMBOLS`, which is the list checked against
//     both the real SF Symbols set and the icon pack the panel draws with. An
//     invented name costs the author a placeholder box on the watch with no
//     warning at all, and `states-seeds.test.ts` pins the whole table to it.

import {
  type StyleChange,
  type Value,
  literal,
  timelineStateColor,
} from "./model.js";
import { type StatesRowInput } from "./states.js";
import { toggleSymbols } from "./presets.js";

/** One row a fill writes: what the entity reports, and how the layer looks then. */
export interface StateSeed {
  /** The state the recorder holds, which is what the row matches. The one
   * exception is `unavailable`, which stands for the comparison that catches
   * `unknown` as well: an entity that stopped reporting and one that has not
   * reported yet are the same thing to look at. */
  state: string;
  /** An SF Symbol name, always one of `CURATED_SYMBOLS`. */
  symbol: string;
  /** `#RRGGBB`. Shared with the timeline's table wherever that names the same
   * state, so the two seeders cannot drift into different colours for `open`. */
  colorHex: string;
}

/** The look of one side of an on/off pair. */
interface OnOff {
  on: { symbol: string; colorHex: string };
  off: { symbol: string; colorHex: string };
}

const ON_HEX = timelineStateColor("on");
const OFF_HEX = timelineStateColor("off");
const OPEN_HEX = timelineStateColor("open");
const CLOSED_HEX = timelineStateColor("closed");
const GREY_HEX = timelineStateColor("unavailable");

/** The domains whose states are plain on and off. Their symbols come from the
 * pair a toggle button already draws, so a seeded table and a preset agree. */
const ON_OFF_DOMAINS = ["light", "switch", "fan", "input_boolean"];

/**
 * A binary sensor's two states, per device class.
 *
 * The device class is the only thing that says what `on` means: a door sensor
 * that is on stands open, a smoke sensor that is on is an emergency, and a
 * connectivity sensor that is on is the good news. So the colours flip with the
 * class rather than following `on` and `off`.
 */
const BINARY_CLASSES: Record<string, OnOff> = {
  door: { on: { symbol: "door.left.hand.open", colorHex: OPEN_HEX }, off: { symbol: "door.left.hand.closed", colorHex: CLOSED_HEX } },
  garage_door: { on: { symbol: "door.left.hand.open", colorHex: OPEN_HEX }, off: { symbol: "door.left.hand.closed", colorHex: CLOSED_HEX } },
  opening: { on: { symbol: "door.left.hand.open", colorHex: OPEN_HEX }, off: { symbol: "door.left.hand.closed", colorHex: CLOSED_HEX } },
  window: { on: { symbol: "window.casement", colorHex: OPEN_HEX }, off: { symbol: "curtains.closed", colorHex: CLOSED_HEX } },
  motion: { on: { symbol: "figure.walk", colorHex: ON_HEX }, off: { symbol: "figure.stand", colorHex: OFF_HEX } },
  occupancy: { on: { symbol: "figure.walk", colorHex: ON_HEX }, off: { symbol: "figure.stand", colorHex: OFF_HEX } },
  presence: { on: { symbol: "figure.walk", colorHex: ON_HEX }, off: { symbol: "figure.stand", colorHex: OFF_HEX } },
  moisture: { on: { symbol: "drop.fill", colorHex: OPEN_HEX }, off: { symbol: "drop", colorHex: OFF_HEX } },
  smoke: { on: { symbol: "exclamationmark.triangle.fill", colorHex: OPEN_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
  gas: { on: { symbol: "exclamationmark.triangle.fill", colorHex: OPEN_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
  carbon_monoxide: { on: { symbol: "exclamationmark.triangle.fill", colorHex: OPEN_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
  problem: { on: { symbol: "exclamationmark.triangle.fill", colorHex: OPEN_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
  safety: { on: { symbol: "exclamationmark.triangle.fill", colorHex: OPEN_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
  battery: { on: { symbol: "battery.25percent", colorHex: OPEN_HEX }, off: { symbol: "battery.100percent", colorHex: CLOSED_HEX } },
  lock: { on: { symbol: "lock.open.fill", colorHex: OPEN_HEX }, off: { symbol: "lock.fill", colorHex: CLOSED_HEX } },
  plug: { on: { symbol: "powerplug.fill", colorHex: ON_HEX }, off: { symbol: "poweroutlet.type.b.fill", colorHex: OFF_HEX } },
  power: { on: { symbol: "powerplug.fill", colorHex: ON_HEX }, off: { symbol: "poweroutlet.type.b.fill", colorHex: OFF_HEX } },
  connectivity: { on: { symbol: "wifi", colorHex: CLOSED_HEX }, off: { symbol: "wifi.slash", colorHex: OPEN_HEX } },
  sound: { on: { symbol: "speaker.wave.2.fill", colorHex: ON_HEX }, off: { symbol: "speaker.slash.fill", colorHex: OFF_HEX } },
  running: { on: { symbol: "play.fill", colorHex: ON_HEX }, off: { symbol: "stop.fill", colorHex: OFF_HEX } },
  update: { on: { symbol: "arrow.down.circle.fill", colorHex: ON_HEX }, off: { symbol: "checkmark.circle.fill", colorHex: CLOSED_HEX } },
};

/** A binary sensor with no device class, and the fallback for one this build
 * does not know. A plain dot is honest: the row still says `on` and `off`. */
const BINARY_DEFAULT: OnOff = {
  on: { symbol: "circle.fill", colorHex: ON_HEX },
  off: { symbol: "circle", colorHex: OFF_HEX },
};

/** Weather has no timeline colours of its own, so its table names both. The
 * states are Home Assistant's condition words, hyphens and all. */
const WEATHER_SEEDS: StateSeed[] = [
  { state: "sunny", symbol: "sun.max.fill", colorHex: "#FFD60A" },
  { state: "clear-night", symbol: "moon.stars.fill", colorHex: "#5E5CE6" },
  { state: "partlycloudy", symbol: "cloud.sun.fill", colorHex: "#64D2FF" },
  { state: "cloudy", symbol: "cloud.fill", colorHex: "#8E8E93" },
  { state: "fog", symbol: "cloud.fog.fill", colorHex: "#AEAEB2" },
  { state: "rainy", symbol: "cloud.rain.fill", colorHex: "#64D2FF" },
  { state: "pouring", symbol: "cloud.heavyrain.fill", colorHex: "#0A84FF" },
  { state: "lightning", symbol: "cloud.bolt.fill", colorHex: "#FFD60A" },
  { state: "lightning-rainy", symbol: "cloud.bolt.rain.fill", colorHex: "#FFD60A" },
  { state: "snowy", symbol: "cloud.snow.fill", colorHex: "#FFFFFF" },
  { state: "snowy-rainy", symbol: "cloud.drizzle.fill", colorHex: "#AEAEB2" },
  { state: "hail", symbol: "cloud.snow.fill", colorHex: "#64D2FF" },
  { state: "windy", symbol: "wind", colorHex: "#8E8E93" },
  { state: "windy-variant", symbol: "wind", colorHex: "#8E8E93" },
  { state: "exceptional", symbol: "exclamationmark.triangle.fill", colorHex: "#FF453A" },
];

/** Everything whose states are a fixed list of words the domain owns. Colours
 * come from the timeline's table wherever it names the state. */
const DOMAIN_SEEDS: Record<string, { state: string; symbol: string; colorHex?: string }[]> = {
  cover: [
    { state: "open", symbol: "window.casement" },
    { state: "closed", symbol: "curtains.closed" },
    { state: "opening", symbol: "arrow.up" },
    { state: "closing", symbol: "arrow.down" },
  ],
  lock: [
    { state: "locked", symbol: "lock.fill" },
    { state: "unlocked", symbol: "lock.open.fill" },
    { state: "jammed", symbol: "exclamationmark.triangle.fill" },
  ],
  media_player: [
    { state: "playing", symbol: "play.fill" },
    { state: "paused", symbol: "pause.fill" },
    { state: "idle", symbol: "stop.fill" },
    { state: "standby", symbol: "zzz" },
    { state: "off", symbol: "speaker.slash.fill" },
  ],
  // The hvac modes, which are what a climate entity's state holds.
  climate: [
    { state: "heat", symbol: "flame.fill" },
    { state: "cool", symbol: "snowflake" },
    { state: "heat_cool", symbol: "thermometer.medium" },
    { state: "dry", symbol: "humidity.fill" },
    { state: "fan_only", symbol: "fan.fill" },
    { state: "auto", symbol: "thermometer.variable" },
    { state: "off", symbol: "power" },
  ],
  vacuum: [
    { state: "cleaning", symbol: "sparkles" },
    { state: "returning", symbol: "arrow.counterclockwise" },
    { state: "docked", symbol: "powerplug.fill" },
    { state: "idle", symbol: "pause.fill" },
    { state: "error", symbol: "exclamationmark.triangle.fill" },
  ],
  alarm_control_panel: [
    { state: "disarmed", symbol: "shield.slash.fill" },
    { state: "armed_home", symbol: "house.fill" },
    { state: "armed_away", symbol: "shield.fill" },
    { state: "armed_night", symbol: "moon.fill" },
    { state: "armed_vacation", symbol: "airplane", colorHex: "#5E5CE6" },
    { state: "arming", symbol: "hourglass" },
    { state: "pending", symbol: "hourglass" },
    { state: "triggered", symbol: "bell.badge.fill" },
  ],
  person: [
    { state: "home", symbol: "house.fill" },
    { state: "not_home", symbol: "figure.walk" },
  ],
  device_tracker: [
    { state: "home", symbol: "house.fill" },
    { state: "not_home", symbol: "figure.walk" },
  ],
};

/** The last row of every seeded table: the entity stopped reporting, or never
 * started. Reading that as "off" is the one wrong answer a table can give. */
const UNAVAILABLE_SEED: StateSeed = {
  state: "unavailable",
  symbol: "questionmark.circle.fill",
  colorHex: GREY_HEX,
};

/**
 * The rows a fill writes for one entity, or an empty list for a domain this
 * table does not know. The last row always covers unavailable and unknown.
 */
export function seedStates(domain: string, deviceClass?: string): StateSeed[] {
  const rows = bodyRows(domain.trim().toLowerCase(), (deviceClass ?? "").trim().toLowerCase());
  return rows.length === 0 ? [] : [...rows, UNAVAILABLE_SEED];
}

function bodyRows(domain: string, deviceClass: string): StateSeed[] {
  if (ON_OFF_DOMAINS.includes(domain)) {
    const pair = toggleSymbols({ entityId: `${domain}.seed`, displayName: "", domain });
    return [
      { state: "on", symbol: pair.on, colorHex: ON_HEX },
      { state: "off", symbol: pair.off, colorHex: OFF_HEX },
    ];
  }
  if (domain === "binary_sensor") {
    const look = BINARY_CLASSES[deviceClass] ?? BINARY_DEFAULT;
    return [
      { state: "on", symbol: look.on.symbol, colorHex: look.on.colorHex },
      { state: "off", symbol: look.off.symbol, colorHex: look.off.colorHex },
    ];
  }
  if (domain === "weather") return WEATHER_SEEDS.map((s) => ({ ...s }));
  return (DOMAIN_SEEDS[domain] ?? []).map((s) => ({
    state: s.state,
    symbol: s.symbol,
    colorHex: s.colorHex ?? timelineStateColor(s.state),
  }));
}

/** Whether a fill would write anything for this entity. */
export function canSeedStates(domain: string, deviceClass?: string): boolean {
  return seedStates(domain, deviceClass).length > 0;
}

/**
 * The seeded rows as the table stores them.
 *
 * Every row matches on the word itself rather than on "is on" and "is off", so
 * a table reads the same whatever domain it came from and a row says exactly
 * what the recorder holds. The unavailable row is the exception: its comparison
 * catches `unknown` too, which no `equals` row can.
 *
 * `columns` is what this kind of layer reads (`RULE_TARGET_PROPERTIES`), so a
 * shape gets colours and no icons, and a text layer that shows neither gets
 * rows with nothing in them rather than cells the watch ignores.
 */
export function seedStatesRows(seeds: readonly StateSeed[], columns: { icon: boolean; color: boolean }): StatesRowInput[] {
  return seeds.map((seed) => {
    const changes: StyleChange[] = [];
    if (columns.icon) changes.push({ kind: "setIcon", value: literal(seed.symbol) });
    if (columns.color) changes.push({ kind: "setColor", value: literal(seed.colorHex) });
    return {
      comparison: seed.state === UNAVAILABLE_SEED.state
        ? { kind: "isUnavailable" }
        : { kind: "equals", value: literal(seed.state) },
      changes,
    };
  });
}

/** The entity a table tests, when it tests one entity's state. A table built on
 * an attribute, a template or a number has no domain to seed from. */
export function seedEntityOf(value: Value | undefined): { entityId: string; domain: string } | undefined {
  const k = value?.kind;
  if (k?.kind !== "entityState") return undefined;
  const domain = k.domain || k.entityId.split(".")[0] || "";
  return domain === "" ? undefined : { entityId: k.entityId, domain };
}
