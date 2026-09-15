// Sample items for a list with no data yet.
//
// The seeds exist so a row can be designed before a calendar is picked and
// before the first fetch lands, which only works if they are the shape the
// server really sends: the resolver parses them with the same code it parses a
// reply with, so a seed that carried a key nobody sends would design a row
// against a field that never arrives.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type ListElement,
  type ListSource,
  newConfig,
  newElement,
} from "../src/model.js";
import { listExpressionKey, listKey } from "../src/compiler.js";
import { parseListItems } from "../src/resolver.js";
import {
  LIST_ITEM_FIELDS,
  listItemFields,
  listSeedItems,
  listSeedText,
  sampleListItem,
  stageListSource,
  withListSeeds,
} from "../src/list-seeds.js";

/** A fixed clock, so a seed's timestamps are checked against a number rather
 * than against "roughly now". */
const NOW = 1_757_930_400; // 2025-09-15 10:00:00 UTC

const ENTITIES: ListSource = {
  kind: "entities",
  scope: { kind: "filter", domains: ["light"], areaIds: [], labelIds: [], floorIds: [] },
  sort: "name",
  descending: false,
  attributes: [],
};
const CALENDAR: ListSource = {
  kind: "calendar",
  entities: [{ entityId: "calendar.home", displayName: "Home", domain: "calendar" }],
  hours: 24,
};
const TODO: ListSource = {
  kind: "todo",
  entities: [{ entityId: "todo.shopping", displayName: "Shopping", domain: "todo" }],
  status: "open",
  sort: "list",
};
const FORECAST: ListSource = {
  kind: "forecast",
  entityId: "weather.home",
  displayName: "Home",
  domain: "weather",
  type: "hourly",
};

function listLayer(source: ListSource, rows = 4): Extract<ReturnType<typeof newElement>, { kind: "list" }> {
  const el = newElement("list") as Extract<ReturnType<typeof newElement>, { kind: "list" }>;
  el.payload.source = source;
  el.payload.rows = rows;
  return el;
}

describe("listSeedItems", () => {
  it("has the counts the plan asked for", () => {
    expect(listSeedItems(ENTITIES, NOW)).toHaveLength(4);
    expect(listSeedItems(CALENDAR, NOW)).toHaveLength(3);
    expect(listSeedItems(TODO, NOW)).toHaveLength(3);
    expect(listSeedItems(FORECAST, NOW)).toHaveLength(6);
    expect(listSeedItems({ ...FORECAST, type: "daily" }, NOW)).toHaveLength(5);
    expect(listSeedItems({ kind: "template", value: "x" }, NOW)).toHaveLength(4);
  });

  it("gives an attribute or a template plain scalars, so each row has a value", () => {
    const items = listSeedItems({ kind: "template", value: "x" }, NOW);
    for (const item of items) expect(typeof item).toBe("string");
  });

  it("writes timestamps as unix seconds, never as text", () => {
    for (const item of listSeedItems(CALENDAR, NOW) as Record<string, unknown>[]) {
      expect(typeof item.start).toBe("number");
      expect(typeof item.end).toBe("number");
    }
    for (const item of listSeedItems(FORECAST, NOW) as Record<string, unknown>[]) {
      expect(typeof item.time).toBe("number");
    }
  });

  it("gives a battery list readings a bar can fill, emptiest first", () => {
    const items = listSeedItems({ ...ENTITIES, deviceClass: "battery" } as ListSource, NOW) as Record<string, unknown>[];
    expect(items).toHaveLength(4);
    const numbers = items.map((i) => Number(i.state));
    expect(numbers.every((n) => n >= 0 && n <= 100)).toBe(true);
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
    for (const item of items) expect(item.deviceClass).toBe("battery");
  });

  it("leaves a field the source has nothing for as null rather than dropping it", () => {
    const first = listSeedItems(ENTITIES, NOW)[0] as Record<string, unknown>;
    expect(first.unit).toBeNull();
    expect("deviceClass" in first).toBe(true);
  });
});

describe("the seeds through the resolver's own parser", () => {
  it("gives an entities row every field the picker offers", () => {
    const parsed = parseListItems(listSeedText(ENTITIES, NOW), 4, ENTITIES, NOW);
    expect(parsed.items).toHaveLength(4);
    const fields = parsed.items[0]!.fields;
    for (const [name] of LIST_ITEM_FIELDS.entities) expect(fields.has(name)).toBe(true);
    // Computed at resolve, never sent.
    expect(fields.get("age")).toBe("120");
    expect(fields.get("icon")).not.toBe("");
  });

  it("gives a calendar row a countdown and an all-day event", () => {
    const parsed = parseListItems(listSeedText(CALENDAR, NOW), 4, CALENDAR, NOW);
    expect(parsed.items[0]!.fields.get("isAllDay")).toBe("true");
    const standup = parsed.items[1]!.fields;
    expect(standup.get("title")).toBe("Stand-up");
    expect(standup.get("startsIn")).toBe(String(25 * 60));
  });

  it("gives a to-do row an overdue item and one with no due date", () => {
    const parsed = parseListItems(listSeedText(TODO, NOW), 4, TODO, NOW);
    expect(Number(parsed.items[1]!.fields.get("dueIn"))).toBeLessThan(0);
    expect(parsed.items[2]!.fields.get("due")).toBe("");
    expect(parsed.items[2]!.fields.has("dueIn")).toBe(false);
  });

  it("gives every forecast hour a condition icon", () => {
    const parsed = parseListItems(listSeedText(FORECAST, NOW), 6, FORECAST, NOW);
    expect(parsed.items).toHaveLength(6);
    for (const item of parsed.items) expect(item.fields.get("icon")).toBeTruthy();
  });

  it("gives a scalar list one field called value", () => {
    const source: ListSource = { kind: "template", value: "x" };
    const parsed = parseListItems(listSeedText(source, NOW), 4, source, NOW);
    expect(parsed.items[0]!.fields.get("value")).toBe("Living room");
  });
});

describe("listItemFields", () => {
  it("offers the source's own fields", () => {
    expect(listItemFields(CALENDAR).map(([f]) => f)).toContain("startsIn");
    expect(listItemFields(TODO).map(([f]) => f)).toContain("uid");
    expect(listItemFields(FORECAST).map(([f]) => f)).toContain("templow");
    expect(listItemFields(CALENDAR).map(([f]) => f)).not.toContain("entityId");
  });

  it("folds the row's own attribute names in for an entities source", () => {
    const fields = listItemFields({ ...ENTITIES, attributes: ["brightness"] } as ListSource).map(([f]) => f);
    expect(fields).toContain("attr.brightness");
  });

  it("ends every source with the position, which every item has", () => {
    for (const source of [ENTITIES, CALENDAR, TODO, FORECAST]) {
      expect(listItemFields(source).at(-1)?.[0]).toBe("index");
    }
  });
});

describe("stageListSource", () => {
  it("stands in for a calendar, a list, a forecast and a blank template", () => {
    expect(listKey(stageListSource({ kind: "calendar", entities: [], hours: 24 }))).toBeDefined();
    expect(listKey(stageListSource({ kind: "todo", entities: [], status: "open", sort: "list" }))).toBeDefined();
    expect(listKey(stageListSource({ kind: "forecast", entityId: "", displayName: "", domain: "", type: "hourly" }))).toBeDefined();
    expect(listExpressionKey(stageListSource({ kind: "template", value: "  " }), 4)).toBeDefined();
  });

  it("leaves a source that already names something exactly as it is", () => {
    expect(stageListSource(CALENDAR)).toBe(CALENDAR);
    expect(stageListSource(ENTITIES)).toBe(ENTITIES);
  });
});

describe("withListSeeds", () => {
  function config(source: ListSource): CustomComplicationConfig {
    const cfg = newConfig("List", 0);
    cfg.elements.push(listLayer(source));
    return cfg;
  }

  it("seeds a Jinja source into the template results", () => {
    const cfg = config(ENTITIES);
    const out = withListSeeds(cfg, new Map(), new Map(), NOW);
    const key = listExpressionKey(ENTITIES, 4)!;
    expect(out.templateResults.get(key)).toBe(listSeedText(ENTITIES, NOW));
    expect(out.listItems.size).toBe(0);
  });

  it("seeds a service source into the list items", () => {
    const cfg = config(CALENDAR);
    const out = withListSeeds(cfg, new Map(), new Map(), NOW);
    expect(out.listItems.get(listKey(CALENDAR)!)).toBe(listSeedText(CALENDAR, NOW));
  });

  it("leaves a key that already answered alone, even when the answer is empty", () => {
    const cfg = config(CALENDAR);
    const answered = new Map([[listKey(CALENDAR)!, `{"items":[],"total":0}`]]);
    const out = withListSeeds(cfg, new Map(), answered, NOW);
    expect(out.listItems).toBe(answered);
  });

  it("hands back the same Maps when there is nothing to seed", () => {
    const templates = new Map<string, string>();
    const items = new Map<string, string>();
    const out = withListSeeds(newConfig("Plain", 0), templates, items, NOW);
    expect(out.templateResults).toBe(templates);
    expect(out.listItems).toBe(items);
  });
});

describe("sampleListItem", () => {
  it("reads the first live item when one has arrived", () => {
    const list: ListElement = listLayer(CALENDAR).payload;
    const reply = `{"items":[{"title":"Real","start":${NOW + 60},"end":${NOW + 120}}],"total":1}`;
    const sample = sampleListItem(list, new Map(), new Map([[listKey(CALENDAR)!, reply]]), NOW);
    expect(sample?.fields.get("title")).toBe("Real");
  });

  it("falls back to the seeds, and stands a source in that names nothing", () => {
    const list: ListElement = listLayer({ kind: "calendar", entities: [], hours: 24 }).payload;
    const sample = sampleListItem(list, new Map(), new Map(), NOW);
    expect(sample?.fields.get("title")).toBe("Bin day");
  });
});
