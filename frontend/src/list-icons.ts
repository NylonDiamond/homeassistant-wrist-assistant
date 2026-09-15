// The glyph one list item draws, worked out locally on both sides.
//
// An item's `icon` is never sent. The Jinja does not carry it and neither does
// the integration's reply: a symbol name costs bytes on every row of every
// refresh, and both sides already know the same vocabulary. So the resolver
// fills it in from what the item does carry: an entity's domain, device class
// and state, or a forecast hour's condition. Calendar events and to-do items
// have one glyph each.
//
// The tables are the panel's own `states-seeds` vocabulary and the toggle
// symbols a preset draws, written out here rather than imported: the seeds
// module reaches the presets, the presets reach the renderer and the renderer
// reaches the resolver, so importing them here would close a loop through four
// modules for two lookups. `list-icons.test.ts` pins every row of both tables
// against the modules they came from, so a drift fails a test rather than
// showing a different glyph on the wrist than in the panel.
//
// Every name is an SF Symbol in `CURATED_SYMBOLS`, the list checked against
// both the real SF Symbols set and the icon pack the panel draws with.

/** An entity that stopped reporting, a condition nothing names, a domain this
 * build has never heard of. Honest: the row still has its name and its state. */
export const UNKNOWN_ITEM_ICON = "questionmark.circle.fill";

/** One glyph per calendar event and one per to-do item, whatever they say. */
export const CALENDAR_ITEM_ICON = "calendar";
export const TODO_ITEM_ICON = "checklist";

/** Home Assistant's weather conditions, hyphens and all. Mirrors the symbols
 * of `WEATHER_SEEDS` in `states-seeds.ts` and the app's own condition table. */
const FORECAST_ICONS: Record<string, string> = {
  "sunny": "sun.max.fill",
  "clear-night": "moon.stars.fill",
  "partlycloudy": "cloud.sun.fill",
  "cloudy": "cloud.fill",
  "fog": "cloud.fog.fill",
  "rainy": "cloud.rain.fill",
  "pouring": "cloud.heavyrain.fill",
  "lightning": "cloud.bolt.fill",
  "lightning-rainy": "cloud.bolt.rain.fill",
  "snowy": "cloud.snow.fill",
  "snowy-rainy": "cloud.drizzle.fill",
  "hail": "cloud.snow.fill",
  "windy": "wind",
  "windy-variant": "wind",
  "exceptional": "exclamationmark.triangle.fill",
};

/** The glyph for one forecast hour or day. */
export function forecastItemIcon(condition: string): string {
  return FORECAST_ICONS[condition.trim().toLowerCase()] ?? UNKNOWN_ITEM_ICON;
}

/** The two states of a domain whose entities are plainly on and off. The pair
 * a toggle button draws (`toggleSymbols`), so a row and a preset agree. */
const ON_OFF_ICONS: Record<string, { on: string; off: string }> = {
  light: { on: "lightbulb.fill", off: "lightbulb" },
  switch: { on: "power", off: "power" },
  fan: { on: "fan.fill", off: "fan.fill" },
  input_boolean: { on: "circle.fill", off: "circle" },
};

/** A binary sensor's two states per device class: the class is the only thing
 * that says what `on` means. Mirrors `BINARY_CLASSES` in `states-seeds.ts`. */
const BINARY_ICONS: Record<string, { on: string; off: string }> = {
  door: { on: "door.left.hand.open", off: "door.left.hand.closed" },
  garage_door: { on: "door.left.hand.open", off: "door.left.hand.closed" },
  opening: { on: "door.left.hand.open", off: "door.left.hand.closed" },
  window: { on: "window.casement", off: "curtains.closed" },
  motion: { on: "figure.walk", off: "figure.stand" },
  occupancy: { on: "figure.walk", off: "figure.stand" },
  presence: { on: "figure.walk", off: "figure.stand" },
  moisture: { on: "drop.fill", off: "drop" },
  smoke: { on: "exclamationmark.triangle.fill", off: "checkmark.circle.fill" },
  gas: { on: "exclamationmark.triangle.fill", off: "checkmark.circle.fill" },
  carbon_monoxide: { on: "exclamationmark.triangle.fill", off: "checkmark.circle.fill" },
  problem: { on: "exclamationmark.triangle.fill", off: "checkmark.circle.fill" },
  safety: { on: "exclamationmark.triangle.fill", off: "checkmark.circle.fill" },
  battery: { on: "battery.25percent", off: "battery.100percent" },
  lock: { on: "lock.open.fill", off: "lock.fill" },
  plug: { on: "powerplug.fill", off: "poweroutlet.type.b.fill" },
  power: { on: "powerplug.fill", off: "poweroutlet.type.b.fill" },
  connectivity: { on: "wifi", off: "wifi.slash" },
  sound: { on: "speaker.wave.2.fill", off: "speaker.slash.fill" },
  running: { on: "play.fill", off: "stop.fill" },
  update: { on: "arrow.down.circle.fill", off: "checkmark.circle.fill" },
};

/** A binary sensor with no device class, and the fallback for one this build
 * does not know. Mirrors `BINARY_DEFAULT`. */
const BINARY_DEFAULT_ICONS = { on: "circle.fill", off: "circle" };

/** Domains whose states are a fixed list of words the domain owns. Mirrors
 * `DOMAIN_SEEDS` in `states-seeds.ts`, symbol for symbol. */
const DOMAIN_STATE_ICONS: Record<string, Record<string, string>> = {
  cover: { open: "window.casement", closed: "curtains.closed", opening: "arrow.up", closing: "arrow.down" },
  lock: { locked: "lock.fill", unlocked: "lock.open.fill", jammed: "exclamationmark.triangle.fill" },
  media_player: { playing: "play.fill", paused: "pause.fill", idle: "stop.fill", standby: "zzz", off: "speaker.slash.fill" },
  climate: {
    heat: "flame.fill", cool: "snowflake", heat_cool: "thermometer.medium", dry: "humidity.fill",
    fan_only: "fan.fill", auto: "thermometer.variable", off: "power",
  },
  vacuum: { cleaning: "sparkles", returning: "arrow.counterclockwise", docked: "powerplug.fill", idle: "pause.fill", error: "exclamationmark.triangle.fill" },
  alarm_control_panel: {
    disarmed: "shield.slash.fill", armed_home: "house.fill", armed_away: "shield.fill", armed_night: "moon.fill",
    armed_vacation: "airplane", arming: "hourglass", pending: "hourglass", triggered: "bell.badge.fill",
  },
  person: { home: "house.fill", not_home: "figure.walk" },
  device_tracker: { home: "house.fill", not_home: "figure.walk" },
};

/** One glyph per domain for everything the state tables do not name: a sensor,
 * a script, a scene. Mirrors `DOMAIN_SYMBOLS` in `presets.ts`, taking the `on`
 * spelling for an active state and the `off` one otherwise. */
const DOMAIN_FALLBACK_ICONS: Record<string, { on: string; off: string }> = {
  light: { on: "lightbulb.fill", off: "lightbulb" },
  switch: { on: "power", off: "power" },
  fan: { on: "fan.fill", off: "fan.fill" },
  input_boolean: { on: "circle.fill", off: "circle" },
  cover: { on: "window.casement", off: "curtains.closed" },
  lock: { on: "lock.fill", off: "lock.open.fill" },
  media_player: { on: "speaker.wave.2.fill", off: "speaker.slash.fill" },
  siren: { on: "bell.fill", off: "bell.slash.fill" },
  humidifier: { on: "humidifier.fill", off: "humidifier.fill" },
  valve: { on: "spigot.fill", off: "spigot.fill" },
  automation: { on: "gearshape.fill", off: "gearshape.fill" },
  script: { on: "play.fill", off: "play.fill" },
  scene: { on: "sparkles", off: "sparkles" },
  climate: { on: "flame.fill", off: "thermometer.medium" },
  binary_sensor: { on: "circle.fill", off: "circle" },
  group: { on: "circle.fill", off: "circle" },
};

/** The last resort: a plain dot, for a domain nothing here names. */
const PLAIN_ICONS = { on: "circle.fill", off: "circle" };

/** A battery sensor's glyph, from its percentage: the SF battery at the
 * nearest quarter, so 12 draws empty, 37 a quarter, 68 three quarters and 91
 * full. Undefined when the state is not a number, which leaves the sensor on
 * the plain dot like any other. Mirrors `batteryItemIcon` in the app. */
function batteryItemIcon(state: string): string | undefined {
  const n = Number(state);
  if (!Number.isFinite(n)) return undefined;
  const quarter = Math.min(4, Math.max(0, Math.round(n / 25)));
  return `battery.${quarter * 25}percent`;
}

/** States that mean "this is doing something right now", which is what the
 * fallback pair reads to pick its side. The panel's own `isActiveState` list. */
const ACTIVE_STATES = new Set([
  "on", "open", "opening", "closing", "home", "playing", "heat", "cool", "heat_cool",
  "auto", "dry", "fan_only", "cleaning", "returning", "active", "running", "recording", "streaming",
  "triggered", "armed_home", "armed_away", "armed_night", "armed_vacation", "unlocked",
]);

/** The states that mean an entity is not reporting. Both read as the same
 * thing to look at: an entity that stopped and one that never started. */
const MISSING_STATES = new Set(["unavailable", "unknown", ""]);

/**
 * The glyph one entity item draws.
 *
 * The state decides wherever the domain names its states, because a door that
 * is open and one that is closed are two pictures. A battery sensor reads its
 * percentage as a level. Failing that the domain decides, with the active
 * spelling for a state that means "doing something".
 */
export function entityItemIcon(domain: string, deviceClass: string, state: string): string {
  const d = domain.trim().toLowerCase();
  const c = deviceClass.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  if (MISSING_STATES.has(s)) return UNKNOWN_ITEM_ICON;
  const onOff = ON_OFF_ICONS[d] ?? (d === "binary_sensor" ? BINARY_ICONS[c] ?? BINARY_DEFAULT_ICONS : undefined);
  if (onOff) return s === "off" ? onOff.off : onOff.on;
  if (d === "weather") return forecastItemIcon(s);
  if (d === "sensor" && c === "battery") {
    const glyph = batteryItemIcon(s);
    if (glyph !== undefined) return glyph;
  }
  const byState = DOMAIN_STATE_ICONS[d]?.[s];
  if (byState !== undefined) return byState;
  const pair = DOMAIN_FALLBACK_ICONS[d] ?? PLAIN_ICONS;
  return ACTIVE_STATES.has(s) ? pair.on : pair.off;
}
