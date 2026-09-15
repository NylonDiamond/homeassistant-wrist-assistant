// Sample items for a list that has no data yet, and the field table the
// editor's "Item field" picker reads.
//
// A row template is designed against items, so a list whose source names no
// entity, or whose first fetch has not landed, would be a stack of empty cells
// with nothing to line up. These seeds fill that gap: the same shape the
// server sends (absent fields left out, timestamps as unix seconds, `null`
// where the source really has nothing), so a row designed against them draws
// the same way once the real items arrive.
//
// Everything here is pure. The panel folds the text into the two Maps the
// resolver reads, under the key the list would have read anyway, and only when
// nothing has arrived for that key.

import {
  type EntityRef,
  type ListElement,
  type ListSource,
  type CustomComplicationConfig,
  clampListRows,
} from "./model.js";
import { listExpressionKey, listKey } from "./compiler.js";
import { parseListItems } from "./resolver.js";

/** One field a row layer may name, with the words the picker shows. */
export type ItemField = readonly [field: string, label: string];

/** Every item carries its position, whatever the source. */
const INDEX_FIELD: ItemField = ["index", "Position (0 first)"];

/** The fields each source's items hold, in the order the picker lists them.
 * The contract's table, one entry per row. `attr.<name>` is not here: those
 * are the author's own attribute names, typed into the free box beside the
 * picker, and each one joins `source.attributes` when it is used. */
export const LIST_ITEM_FIELDS: Record<ListSource["kind"], readonly ItemField[]> = {
  entities: [
    ["name", "Name"],
    ["state", "State"],
    ["unit", "Unit"],
    ["entityId", "Entity id"],
    ["domain", "Domain"],
    ["deviceClass", "Device class"],
    ["area", "Area"],
    ["icon", "Icon"],
    ["lastChanged", "Last changed (seconds)"],
    ["age", "Age (seconds)"],
    INDEX_FIELD,
  ],
  attribute: [["value", "Value"], INDEX_FIELD],
  template: [["value", "Value"], INDEX_FIELD],
  calendar: [
    ["title", "Title"],
    ["start", "Start (seconds)"],
    ["end", "End (seconds)"],
    ["startsIn", "Starts in (seconds)"],
    ["endsIn", "Ends in (seconds)"],
    ["isAllDay", "All day"],
    ["location", "Location"],
    ["description", "Description"],
    ["calendar", "Calendar"],
    ["calendarId", "Calendar id"],
    ["icon", "Icon"],
    INDEX_FIELD,
  ],
  todo: [
    ["title", "Title"],
    ["status", "Status"],
    ["due", "Due (seconds)"],
    ["dueIn", "Due in (seconds)"],
    ["description", "Description"],
    ["uid", "Item id"],
    ["list", "List"],
    ["listId", "List id"],
    ["icon", "Icon"],
    INDEX_FIELD,
  ],
  forecast: [
    ["time", "Time (seconds)"],
    ["condition", "Condition"],
    ["icon", "Icon"],
    ["temperature", "Temperature"],
    ["templow", "Low temperature"],
    ["unit", "Unit"],
    ["precipitation", "Precipitation"],
    ["precipitationProbability", "Chance of rain"],
    ["humidity", "Humidity"],
    ["windSpeed", "Wind speed"],
    ["isDaytime", "Daytime"],
    INDEX_FIELD,
  ],
};

/**
 * The fields a source offers, with the author's own `attr.` names folded in.
 *
 * Only `entities` carries those: an attribute or a template holds whatever the
 * object holds, and the picker there offers the seed's own keys plus a free
 * box, because nothing in the panel can know what a template will yield.
 */
export function listItemFields(source: ListSource): readonly ItemField[] {
  const base = LIST_ITEM_FIELDS[source.kind];
  if (source.kind !== "entities" || source.attributes.length === 0) return base;
  return [...base, ...source.attributes.map((name): ItemField => [`attr.${name}`, `Attribute: ${name}`])];
}

/** Which fields of a source hold unix seconds, so the editor can offer the
 * `timestamp` format where it means something without the author guessing. */
export const LIST_TIME_FIELDS: readonly string[] = ["lastChanged", "start", "end", "due", "time"];

// ── the seeds ─────────────────────────────────────────────────────────────

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

/** Seconds, rounded, the way every timestamp on the wire is. */
function at(nowSeconds: number, offset: number): number {
  return Math.round(nowSeconds + offset);
}

/** Four entities: two lights, a temperature and a door, so a row designed
 * against them meets a name, a numeric state, a unit and an icon that differs
 * per row. `n` is the numeric state the Jinja sends beside the text one, null
 * where the state is a word. */
function entitySeeds(now: number): unknown[] {
  return [
    {
      entityId: "light.kitchen", name: "Kitchen", state: "on", unit: null, domain: "light",
      deviceClass: null, area: "Kitchen", lastChanged: at(now, -2 * MINUTE), n: null,
    },
    {
      entityId: "light.hallway", name: "Hallway", state: "on", unit: null, domain: "light",
      deviceClass: null, area: "Hallway", lastChanged: at(now, -18 * MINUTE), n: null,
    },
    {
      entityId: "sensor.living_room_temperature", name: "Living room", state: "21.5", unit: "°C",
      domain: "sensor", deviceClass: "temperature", area: "Living room",
      lastChanged: at(now, -1 * MINUTE), n: 21.5,
    },
    {
      entityId: "binary_sensor.front_door", name: "Front door", state: "on", unit: null,
      domain: "binary_sensor", deviceClass: "door", area: "Hallway",
      lastChanged: at(now, -45), n: null,
    },
  ];
}

/** Four battery sensors, emptiest first.
 *
 * The one device class worth its own seeds: it is what the Low batteries
 * preset builds, and that row draws a bar filled by the reading, which says
 * nothing at all unless the sample states are numbers between 0 and 100. Every
 * other class keeps the mixed seeds above, where a name, a state and an icon
 * are what a row is being lined up against. */
function batterySeeds(now: number): unknown[] {
  return [
    {
      entityId: "sensor.front_door_battery", name: "Front door", state: "8", unit: "%",
      domain: "sensor", deviceClass: "battery", area: "Hallway",
      lastChanged: at(now, -2 * MINUTE), n: 8,
    },
    {
      entityId: "sensor.thermostat_battery", name: "Thermostat", state: "34", unit: "%",
      domain: "sensor", deviceClass: "battery", area: "Living room",
      lastChanged: at(now, -26 * MINUTE), n: 34,
    },
    {
      entityId: "sensor.back_door_battery", name: "Back door", state: "67", unit: "%",
      domain: "sensor", deviceClass: "battery", area: "Kitchen",
      lastChanged: at(now, -3 * HOUR), n: 67,
    },
    {
      entityId: "sensor.doorbell_battery", name: "Doorbell", state: "95", unit: "%",
      domain: "sensor", deviceClass: "battery", area: "Hallway",
      lastChanged: at(now, -9 * HOUR), n: 95,
    },
  ];
}

/** Three events: one soon, one later today, one all day. An all-day event
 * starts at local midnight, which is what the day boundary below stands in
 * for. */
function calendarSeeds(now: number): unknown[] {
  const midnight = Math.floor(now / DAY) * DAY;
  return [
    {
      title: "Bin day", start: midnight, end: midnight + DAY, isAllDay: true,
      location: null, description: null, calendar: "Home", calendarId: "calendar.home",
    },
    {
      title: "Stand-up", start: at(now, 25 * MINUTE), end: at(now, 40 * MINUTE), isAllDay: false,
      location: "Office", description: null, calendar: "Work", calendarId: "calendar.work",
    },
    {
      title: "Dentist", start: at(now, 5 * HOUR), end: at(now, 6 * HOUR), isAllDay: false,
      location: "High Street", description: null, calendar: "Home", calendarId: "calendar.home",
    },
  ];
}

/** Three to-dos: one due today, one overdue, one with no due date at all. */
function todoSeeds(now: number): unknown[] {
  return [
    {
      title: "Milk", status: "open", due: at(now, 3 * HOUR), description: null,
      uid: "seed-1", list: "Shopping", listId: "todo.shopping",
    },
    {
      title: "Water the plants", status: "open", due: at(now, -20 * HOUR), description: null,
      uid: "seed-2", list: "Shopping", listId: "todo.shopping",
    },
    {
      title: "Book the car in", status: "open", due: "", description: null,
      uid: "seed-3", list: "Shopping", listId: "todo.shopping",
    },
  ];
}

const HOURLY_SEED: readonly [condition: string, temperature: number, chance: number][] = [
  ["sunny", 18, 0],
  ["partlycloudy", 19, 5],
  ["partlycloudy", 20, 10],
  ["cloudy", 19, 25],
  ["rainy", 17, 70],
  ["rainy", 16, 55],
];

const DAILY_SEED: readonly [condition: string, high: number, low: number, chance: number][] = [
  ["sunny", 21, 12, 0],
  ["partlycloudy", 20, 11, 10],
  ["rainy", 17, 10, 80],
  ["cloudy", 18, 11, 30],
  ["sunny", 22, 13, 0],
];

/** Six hours, or five days: the two strips people build first. */
function forecastSeeds(now: number, type: "hourly" | "daily" | "twiceDaily"): unknown[] {
  if (type === "hourly") {
    const top = Math.ceil(now / HOUR) * HOUR;
    return HOURLY_SEED.map(([condition, temperature, chance], i) => ({
      time: top + i * HOUR, condition, temperature, templow: null, unit: "°C",
      precipitation: chance > 20 ? 0.4 : 0, precipitationProbability: chance,
      humidity: 60 + i, windSpeed: 8 + i, isDaytime: true,
    }));
  }
  const midnight = Math.floor(now / DAY) * DAY;
  return DAILY_SEED.map(([condition, high, low, chance], i) => ({
    time: midnight + i * DAY, condition, temperature: high, templow: low, unit: "°C",
    precipitation: chance > 20 ? 2.5 : 0, precipitationProbability: chance,
    humidity: 62 + i, windSpeed: 10 + i, isDaytime: type === "twiceDaily" ? i % 2 === 0 : true,
  }));
}

/** Four scalars: what a select's options or a plain template list looks like.
 * Their one field is `value`, the way the resolver reads any non-object item. */
const SCALAR_SEEDS: readonly string[] = ["Living room", "Kitchen", "Bedroom", "Office"];

/** The sample items one source would have sent, as objects. */
export function listSeedItems(source: ListSource, nowSeconds: number): unknown[] {
  switch (source.kind) {
    case "entities":
      return source.deviceClass?.trim() === "battery" ? batterySeeds(nowSeconds) : entitySeeds(nowSeconds);
    case "calendar": return calendarSeeds(nowSeconds);
    case "todo": return todoSeeds(nowSeconds);
    case "forecast": return forecastSeeds(nowSeconds, source.type);
    case "attribute":
    case "template": return [...SCALAR_SEEDS];
  }
}

/** The same items as the reply text the resolver parses: the `{"items",
 * "total"}` object both doors produce. */
export function listSeedText(source: ListSource, nowSeconds: number): string {
  const items = listSeedItems(source, nowSeconds);
  return JSON.stringify({ items, total: items.length });
}

// ── standing in for a source that names nothing yet ───────────────────────

/** The placeholders a source with nothing picked stands in with while a row is
 * being designed. Real ids, so the key is a real key; nothing is ever fetched
 * for them, because the stage document is never compiled to the server. */
const SEED_CALENDAR: EntityRef = { entityId: "calendar.sample", displayName: "Sample calendar", domain: "calendar" };
const SEED_TODO: EntityRef = { entityId: "todo.sample", displayName: "Sample list", domain: "todo" };
const SEED_WEATHER: EntityRef = { entityId: "weather.sample", displayName: "Sample forecast", domain: "weather" };
/** A template that renders to nothing, so a blank template source still has an
 * expression and therefore a key to seed under. */
const SEED_TEMPLATE = "{{ [] | to_json }}";

/**
 * A source that is certain to have a key.
 *
 * Only the row stage uses this. On the face itself a list that names no
 * calendar draws no cells, which is the honest answer; but a row being
 * designed has to show something, and a source with nothing picked has no key
 * at all for a seed to hang from.
 */
export function stageListSource(source: ListSource): ListSource {
  switch (source.kind) {
    case "calendar":
      return source.entities.some((e) => e.entityId !== "") ? source : { ...source, entities: [SEED_CALENDAR] };
    case "todo":
      return source.entities.some((e) => e.entityId !== "") ? source : { ...source, entities: [SEED_TODO] };
    case "forecast":
      return source.entityId === "" ? { ...source, ...SEED_WEATHER } : source;
    case "template":
      return source.value.trim() === "" ? { ...source, value: SEED_TEMPLATE } : source;
    default:
      return source;
  }
}

// ── folding the seeds into a context ──────────────────────────────────────

/**
 * The item a row is designed against: the first of whatever that list holds,
 * live if anything has arrived and seeded if not.
 *
 * Parsed by the resolver's own `parseListItems`, so the computed fields (the
 * icon, the age, the countdowns) are worked out exactly once, in one place,
 * and the stage cannot disagree with the face about what `startsIn` means.
 */
export function sampleListItem(
  list: ListElement,
  templateResults: ReadonlyMap<string, string>,
  listItems: ReadonlyMap<string, string>,
  nowSeconds: number,
): { source: ListSource; fields: ReadonlyMap<string, string> } | undefined {
  const source = stageListSource(list.source);
  const jinjaKey = listExpressionKey(source, list.rows);
  const key = jinjaKey ?? listKey(source);
  const stored = jinjaKey !== undefined
    ? templateResults.get(jinjaKey)
    : key === undefined ? undefined : listItems.get(key);
  const text = stored ?? listSeedText(source, nowSeconds);
  const parsed = parseListItems(text, clampListRows(list.rows), source, nowSeconds);
  const first = parsed.items[0];
  return first === undefined ? undefined : { source, fields: first.fields };
}

/** Every list layer of a document, top level only: a row template holds no
 * list, so there is nothing deeper to walk. */
function listLayers(cfg: CustomComplicationConfig): ListElement[] {
  const out: ListElement[] = [];
  for (const el of cfg.elements) if (el.kind === "list") out.push(el.payload);
  return out;
}

/** What a seeding pass produced: the two Maps the resolver reads, copied only
 * when something was actually added, so an ordinary document keeps the Maps it
 * already had and lit sees no change. */
export interface SeededListData {
  templateResults: Map<string, string>;
  listItems: Map<string, string>;
}

/**
 * Fill in sample items for every list that has nothing yet.
 *
 * A Jinja source reads its items out of the value document, a service source
 * out of the `list_items` reply, so a seed goes into whichever Map that list
 * would have read. A key that already carries something is left alone, even
 * when what it carries is an empty list: "no events today" is an answer and
 * sample events drawn over it would be a lie.
 */
export function withListSeeds(
  cfg: CustomComplicationConfig | undefined,
  templateResults: Map<string, string>,
  listItems: Map<string, string>,
  nowSeconds: number,
): SeededListData {
  if (!cfg) return { templateResults, listItems };
  let templates = templateResults;
  let items = listItems;
  for (const list of listLayers(cfg)) {
    const jinjaKey = listExpressionKey(list.source, list.rows);
    if (jinjaKey !== undefined) {
      if (templates.has(jinjaKey)) continue;
      if (templates === templateResults) templates = new Map(templateResults);
      templates.set(jinjaKey, listSeedText(list.source, nowSeconds));
      continue;
    }
    const key = listKey(list.source);
    if (key === undefined || items.has(key)) continue;
    if (items === listItems) items = new Map(listItems);
    items.set(key, listSeedText(list.source, nowSeconds));
  }
  return { templateResults: templates, listItems: items };
}
