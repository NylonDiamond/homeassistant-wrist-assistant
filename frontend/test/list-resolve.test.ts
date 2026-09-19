// A list layer, resolved: the cells it lays out, the row template drawn once
// per item, the fields an item value reads, the taps a row fires and the two
// numbers a layer outside the list can read off it.
//
// The parsing and the cell arithmetic are ports of the Swift in the app repo,
// and the shared fixtures run both sides, so a drift fails in both repos.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element,
  type ListElement,
  type ListSource,
  type NormalizedFrame,
  type Rule,
  type Value,
  literal,
  newConfig,
  newElement,
} from "../src/model.js";
import { listExpressionKey } from "../src/compiler.js";
import { type ResolveContext, type ResolvedElement, formatValue, resolveAll, timestampString } from "../src/resolver.js";

/** A readable, valid hexadecimal UUID: ids are uppercased on the way in, and a
 * mnemonic like `ROW-1` would not survive the Swift side's `UUID`. */
function uuid(n: number): string {
  return `0000000${n}-0000-4000-8000-000000000000`.toUpperCase();
}

const FULL_FRAME: NormalizedFrame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };

const ENTITIES_SOURCE: ListSource = {
  kind: "entities",
  scope: { kind: "filter", domains: ["light"], areaIds: [], labelIds: [], floorIds: [] },
  sort: "name",
  descending: false,
  attributes: [],
};

function listLayer(source: ListSource, edit: (l: ListElement) => void = () => {}): Extract<Element, { kind: "list" }> {
  const el = newElement("list") as Extract<Element, { kind: "list" }>;
  el.payload.id = uuid(1);
  el.payload.frame = { ...FULL_FRAME };
  el.payload.gap = 0;
  el.payload.source = source;
  edit(el.payload);
  return el;
}

function textLayer(id: number, value: Value, edit: (t: Extract<Element, { kind: "text" }>["payload"]) => void = () => {}): Element {
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.id = uuid(id);
  el.payload.value = value;
  el.payload.frame = { ...FULL_FRAME };
  edit(el.payload);
  return el;
}

function item(field: string): Value {
  return { kind: { kind: "item", field } };
}

function configWith(...elements: Element[]): CustomComplicationConfig {
  const cfg = newConfig("Lists", 0);
  cfg.elements = elements;
  return cfg;
}

function contextWith(entries: Record<string, string>, extra: Partial<ResolveContext> = {}): ResolveContext {
  return {
    entityStates: new Map(),
    templateResults: new Map(Object.entries(entries)),
    namedValues: [],
    ...extra,
  };
}

/** The rectangular layout's layers, which is where every test below looks. */
function resolved(cfg: CustomComplicationConfig, ctx: ResolveContext): ResolvedElement[] {
  return resolveAll(cfg, ctx).rectangular!.elements;
}

function cellsOf(elements: readonly ResolvedElement[], id = uuid(1)) {
  const list = elements.find((el) => el.id === id);
  expect(list?.kind, "the list resolved").toBe("list");
  return (list as Extract<ResolvedElement, { kind: "list" }>).cells;
}

/** One reply as the value document carries it, under the source's own key. */
function jinjaReply(source: ListSource, rows: number, text: string): Record<string, string> {
  return { [listExpressionKey(source, rows)!]: text };
}

describe("an entities list", () => {
  const reply = JSON.stringify({
    items: [
      { entityId: "light.hall", name: "Hall", state: "80", unit: "%", domain: "light", deviceClass: null, lastChanged: 1_757_000_000 },
      { entityId: "light.porch", name: "Porch", state: "12", unit: "%", domain: "light", lastChanged: 1_757_000_600 },
    ],
    total: 5,
  });

  function documentWithRule(): CustomComplicationConfig {
    // One row: the entity's name, colored by its own reading.
    const rule: Rule = {
      id: uuid(4),
      cases: [{
        id: uuid(5),
        when: { join: "all", tests: [{ id: uuid(6), value: item("state"), comparison: { kind: "greaterThan", value: literal("50") } }] },
        then: [{ kind: "setColor", value: literal("#FFD60A") }],
      }],
      otherwise: [{ kind: "setColor", value: literal("#8E8E93") }],
    };
    const row = textLayer(2, item("name"), (t) => { t.rules = [rule]; });
    return configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [row]; }));
  }

  it("draws one cell per item, not one per row", () => {
    const cfg = documentWithRule();
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    expect(cells).toHaveLength(2);
    expect(cells.map((c) => c.frame.y)).toEqual([0, 0.25]);
    expect(cells.every((c) => c.frame.height === 0.25)).toBe(true);
  });

  it("reads each row's fields off its own item", () => {
    const cfg = documentWithRule();
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    const texts = cells.map((c) => (c.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text);
    expect(texts).toEqual(["Hall", "Porch"]);
  });

  it("evaluates each row's rules against its own item", () => {
    const cfg = documentWithRule();
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    const colors = cells.map((c) => (c.elements[0] as Extract<ResolvedElement, { kind: "text" }>).colorHex);
    expect(colors).toEqual(["#FFD60A", "#8E8E93"]);
  });

  it("prints a field the item does not have as the placeholder", () => {
    const row = textLayer(2, item("nonesuch"));
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [row]; }));
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("--");
  });

  it("prints a field that arrived null as nothing at all", () => {
    const row = textLayer(2, item("deviceClass"));
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [row]; }));
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("");
  });

  it("borrows the item's own unit", () => {
    const row = textLayer(2, { ...item("state"), format: { useEntityUnit: true } });
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [row]; }));
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply))));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("80%");
  });

  it("works out each row's age and glyph from the clock, not the reply", () => {
    const age = textLayer(2, item("age"));
    const icon = newElement("icon") as Extract<Element, { kind: "icon" }>;
    icon.payload.id = uuid(3);
    icon.payload.symbol = item("icon");
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [age, icon]; }));
    const ctx = contextWith(jinjaReply(ENTITIES_SOURCE, 4, reply), { nowMs: 1_757_000_900_000 });
    const cells = cellsOf(resolved(cfg, ctx));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("900");
    expect((cells[1]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("300");
    // A light that is on at 80 percent, by the panel's own states vocabulary.
    expect((cells[0]!.elements[1] as Extract<ResolvedElement, { kind: "icon" }>).symbol).toBe("lightbulb.fill");
  });

  it("draws no cells at all before the items arrive", () => {
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [textLayer(2, item("name"))]; }));
    expect(cellsOf(resolved(cfg, contextWith({})))).toEqual([]);
  });

  it("draws no cells when the reply is not JSON", () => {
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [textLayer(2, item("name"))]; }));
    expect(cellsOf(resolved(cfg, contextWith(jinjaReply(ENTITIES_SOURCE, 4, "not json"))))).toEqual([]);
  });

  it("takes a bare array as the items, which is what a raw template yields", () => {
    const source: ListSource = { kind: "template", value: "{{ ['a', 'b', 'c'] | to_json }}" };
    const cfg = configWith(listLayer(source, (l) => { l.rows = 2; l.template = [textLayer(2, item("value"))]; }));
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(source, 2, '["a", "b", "c"]'))));
    expect(cells).toHaveLength(2);
    expect(cells.map((c) => (c.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text)).toEqual(["a", "b"]);
  });
});

describe("a calendar list", () => {
  const source: ListSource = {
    kind: "calendar",
    entities: [{ entityId: "calendar.work", displayName: "Work", domain: "calendar" }],
    hours: 24,
  };
  // 2026-09-15 09:00 UTC, and an event half an hour later.
  const now = Date.UTC(2026, 8, 15, 9, 0);
  const reply = JSON.stringify({
    items: [{ title: "Standup", start: now / 1000 + 1800, end: now / 1000 + 3600, calendar: "Work" }],
    total: 1,
  });

  function documentWith(...template: Element[]): CustomComplicationConfig {
    return configWith(listLayer(source, (l) => { l.rows = 3; l.template = template; }));
  }

  function ctxWith(): ResolveContext {
    return contextWith({}, {
      nowMs: now,
      locale: "en-US",
      timeZone: "UTC",
      listItems: new Map([["calendar|calendar.work|24", reply]]),
    });
  }

  it("reads its items out of the list replies, by the readable key", () => {
    const cells = cellsOf(resolved(documentWith(textLayer(2, item("title"))), ctxWith()));
    expect(cells).toHaveLength(1);
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("Standup");
  });

  it("counts down to the start from the context clock", () => {
    const row = textLayer(2, { ...item("startsIn"), format: { duration: true } });
    const cells = cellsOf(resolved(documentWith(row), ctxWith()));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("30m");
  });

  it("clamps a countdown that has already run out", () => {
    const past = JSON.stringify({ items: [{ title: "Over", start: now / 1000 - 600, end: now / 1000 - 60 }], total: 1 });
    const ctx = contextWith({}, { nowMs: now, listItems: new Map([["calendar|calendar.work|24", past]]) });
    const cells = cellsOf(resolved(documentWith(textLayer(2, item("startsIn"))), ctx));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text).toBe("0");
  });

  it("prints a start time as a clock time", () => {
    const row = textLayer(2, { ...item("start"), format: { timestamp: "clock" } });
    const cells = cellsOf(resolved(documentWith(row), ctxWith()));
    const text = (cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>).text;
    // The context forces en-US and UTC, so the hour is the same wherever this
    // runs, which is exactly what the shared fixture does.
    expect(text).toMatch(/^9:30\s?AM$/);
  });

  it("gives every event the calendar glyph", () => {
    const icon = newElement("icon") as Extract<Element, { kind: "icon" }>;
    icon.payload.id = uuid(3);
    icon.payload.symbol = item("icon");
    const cells = cellsOf(resolved(documentWith(icon), ctxWith()));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "icon" }>).symbol).toBe("calendar");
  });
});

describe("a to-do list", () => {
  const source: ListSource = {
    kind: "todo",
    entities: [{ entityId: "todo.shopping", displayName: "Shopping", domain: "todo" }],
    status: "open",
    sort: "list",
  };
  const key = "todo|todo.shopping|open|list";
  const reply = JSON.stringify({
    items: [
      { title: "Milk", uid: "abc123", status: "open", listId: "todo.shopping", due: "" },
      { title: "Bread", uid: "def456", status: "open", listId: "todo.shopping", due: "" },
    ],
    total: 4,
  });

  function tapLayer(id: number, serviceDataJSON: string): Element {
    const el = newElement("tap") as Extract<Element, { kind: "tap" }>;
    el.payload.id = uuid(id);
    el.payload.frame = { ...FULL_FRAME };
    el.payload.action = {
      type: "callService",
      serviceDomain: "todo",
      serviceName: "update_item",
      serviceDataJSON,
    };
    return el;
  }

  function cellsWith(...template: Element[]) {
    const cfg = configWith(listLayer(source, (l) => { l.rows = 4; l.template = template; }));
    return cellsOf(resolved(cfg, contextWith({}, { listItems: new Map([[key, reply]]) })));
  }

  it("fills a row tap's service data from its own item", () => {
    const cells = cellsWith(tapLayer(2, '{"entity_id":"{item.listId}","item":"{item.uid}","status":"completed"}'));
    const actions = cells.map((c) => (c.elements[0] as Extract<ResolvedElement, { kind: "tap" }>).action);
    expect(actions[0]).toMatchObject({
      type: "callService",
      serviceDataJSON: '{"entity_id":"todo.shopping","item":"abc123","status":"completed"}',
    });
    expect(actions[1]).toMatchObject({ serviceDataJSON: '{"entity_id":"todo.shopping","item":"def456","status":"completed"}' });
  });

  it("disables a row tap whose placeholder names a field the item has not got", () => {
    const cells = cellsWith(tapLayer(2, '{"item":"{item.nonesuch}"}'));
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "tap" }>).action).toEqual({ type: "none" });
  });

  it("fills an entity action and refills its domain from the substituted id", () => {
    const el = newElement("tap") as Extract<Element, { kind: "tap" }>;
    el.payload.id = uuid(2);
    el.payload.action = { type: "toggleEntity", entityId: "{item.listId}", displayName: "{item.title}", domain: "" };
    const cells = cellsWith(el);
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "tap" }>).action)
      .toEqual({ type: "toggleEntity", entityId: "todo.shopping", displayName: "Milk", domain: "todo" });
  });

  it("leaves a tap with no placeholder exactly as it was", () => {
    const el = newElement("tap") as Extract<Element, { kind: "tap" }>;
    el.payload.id = uuid(2);
    el.payload.action = { type: "toggleEntity", entityId: "light.hall", displayName: "Hall", domain: "light" };
    const cells = cellsWith(el);
    expect((cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "tap" }>).action)
      .toEqual({ type: "toggleEntity", entityId: "light.hall", displayName: "Hall", domain: "light" });
  });

  it("reads its count and its total from outside the list", () => {
    const count = textLayer(7, { kind: { kind: "listStat", layer: uuid(1), stat: "count" } });
    const total = textLayer(8, { kind: { kind: "listStat", layer: uuid(1), stat: "total" } });
    const cfg = configWith(listLayer(source, (l) => { l.rows = 4; }), count, total);
    const elements = resolved(cfg, contextWith({}, { listItems: new Map([[key, reply]]) }));
    expect((elements.find((e) => e.id === uuid(7)) as Extract<ResolvedElement, { kind: "text" }>).text).toBe("2");
    expect((elements.find((e) => e.id === uuid(8)) as Extract<ResolvedElement, { kind: "text" }>).text).toBe("4");
  });
});

describe("an empty list", () => {
  const source: ListSource = {
    kind: "todo",
    entities: [{ entityId: "todo.chores", displayName: "Chores", domain: "todo" }],
    status: "open",
    sort: "list",
  };
  const key = "todo|todo.chores|open|list";

  /** The empty-state helper the list card writes: a hidden text shown by a rule
   * on the list's own count. */
  function allDone(): Element {
    return textLayer(9, literal("All done"), (t) => {
      t.isHidden = true;
      t.rules = [{
        id: uuid(4),
        cases: [{
          id: uuid(5),
          when: { join: "all", tests: [{
            id: uuid(6),
            value: { kind: { kind: "listStat", layer: uuid(1), stat: "count" } },
            comparison: { kind: "equals", value: literal("0") },
          }] },
          then: [{ kind: "show" }],
        }],
      }];
    });
  }

  it("draws no cells and shows the empty-state text", () => {
    const cfg = configWith(listLayer(source, (l) => { l.template = [textLayer(2, item("title"))]; }), allDone());
    const elements = resolved(cfg, contextWith({}, { listItems: new Map([[key, '{"items": [], "total": 0}']]) }));
    expect(cellsOf(elements)).toEqual([]);
    expect(elements.find((e) => e.id === uuid(9))!.isHidden).toBe(false);
  });

  it("keeps the empty-state text hidden while the list has items", () => {
    const reply = '{"items": [{"title": "Bins"}], "total": 1}';
    const cfg = configWith(listLayer(source, (l) => { l.template = [textLayer(2, item("title"))]; }), allDone());
    const elements = resolved(cfg, contextWith({}, { listItems: new Map([[key, reply]]) }));
    expect(cellsOf(elements)).toHaveLength(1);
    expect(elements.find((e) => e.id === uuid(9))!.isHidden).toBe(true);
  });
});

describe("the cell geometry", () => {
  const reply = JSON.stringify({ items: [{ value: "a" }, { value: "b" }, { value: "c" }, { value: "d" }], total: 4 });
  const source: ListSource = { kind: "template", value: "{{ items }}" };

  function framesOf(edit: (l: ListElement) => void): NormalizedFrame[] {
    const cfg = configWith(listLayer(source, (l) => {
      l.rows = 4;
      l.template = [textLayer(2, item("value"))];
      edit(l);
    }));
    return cellsOf(resolved(cfg, contextWith(jinjaReply(source, 4, reply)))).map((c) => c.frame);
  }

  const round = (n: number) => Math.round(n * 1000) / 1000;

  it("stacks the cells down the frame", () => {
    expect(framesOf(() => {})).toEqual([
      { x: 0, y: 0, width: 1, height: 0.25, rotationDegrees: 0 },
      { x: 0, y: 0.25, width: 1, height: 0.25, rotationDegrees: 0 },
      { x: 0, y: 0.5, width: 1, height: 0.25, rotationDegrees: 0 },
      { x: 0, y: 0.75, width: 1, height: 0.25, rotationDegrees: 0 },
    ]);
  });

  it("fills a grid row-major when the list has columns", () => {
    const frames = framesOf((l) => { l.columns = 2; });
    expect(frames.map((f) => [f.x, f.y, f.width, f.height])).toEqual([
      [0, 0, 0.5, 0.5],
      [0.5, 0, 0.5, 0.5],
      [0, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
    ]);
  });

  it("lays the cells across and ignores the columns", () => {
    const frames = framesOf((l) => { l.direction = "across"; l.columns = 3; });
    expect(frames.map((f) => [round(f.x), f.y, round(f.width), f.height])).toEqual([
      [0, 0, 0.25, 1],
      [0.25, 0, 0.25, 1],
      [0.5, 0, 0.25, 1],
      [0.75, 0, 0.25, 1],
    ]);
  });

  it("turns the gap into a fraction through the list's own size in points", () => {
    // Four cells down the whole 65.5 point rectangular canvas, two points apart.
    const frames = framesOf((l) => { l.gap = 2; });
    const gap = 2 / 65.5;
    expect(round(frames[0]!.height)).toBe(round((1 - gap * 3) / 4));
    expect(round(frames[1]!.y)).toBe(round(frames[0]!.height + gap));
  });

  it("never folds the cells through each other on a frame too small for the gap", () => {
    const frames = framesOf((l) => { l.gap = 12; l.frame = { ...FULL_FRAME, height: 0.2 }; });
    expect(frames.every((f) => f.height >= 0)).toBe(true);
    expect(round(frames[3]!.y + frames[3]!.height)).toBeLessThanOrEqual(1);
  });
});

describe("the timestamp format", () => {
  // 2026-09-15 09:30 UTC, a Tuesday. Every check below forces the zone as well
  // as the locale, which is what a fixture pinning an hour has to do: the
  // locale decides the words, the zone decides the number.
  const seconds = Date.UTC(2026, 8, 15, 9, 30) / 1000;

  it("prints a clock time on the locale's own cycle", () => {
    expect(timestampString(seconds, "clock", "en-US", "UTC")).toMatch(/^9:30\s?AM$/);
    expect(timestampString(seconds, "clock", "en-GB", "UTC")).toBe("09:30");
  });

  it("leaves the minutes, the day period or both out of a clock", () => {
    const trim = (minutes: boolean, dayPeriod: boolean, locale = "en-US") =>
      timestampString(seconds, "clock", locale, "UTC", { minutes, dayPeriod });
    // Dropping the minutes takes the ":" with them and leaves the space before
    // "AM" alone, so the day period still reads.
    expect(trim(true, false)).toMatch(/^9\s?AM$/);
    expect(trim(false, true)).toBe("9:30");
    expect(trim(true, true)).toBe("9");
    // A 24-hour locale has no day period to drop, and keeps its padded hour
    // rather than falling back to an hour-only pattern, which would say "Uhr".
    expect(trim(true, false, "de-DE")).toBe("09");
    expect(trim(false, true, "de-DE")).toBe("09:30");
  });

  it("leaves the weekday of a dateTime alone while trimming its clock", () => {
    expect(timestampString(seconds, "dateTime", "en-US", "UTC", { minutes: true }))
      .toMatch(/^Tue,? 9\s?AM$/);
    expect(timestampString(seconds, "dateTime", "en-US", "UTC", { minutes: true, dayPeriod: true }))
      .toMatch(/^Tue,? 9$/);
  });

  it("means nothing to a style with no clock in it", () => {
    const both = { minutes: true, dayPeriod: true };
    expect(timestampString(seconds, "date", "en-US", "UTC", both)).toBe("Sep 15");
    expect(timestampString(seconds, "weekday", "en-US", "UTC", both)).toBe("Tue");
  });

  it("reads the trim off the format keys", () => {
    const f = { timestamp: "clock" as const, hideMinutes: true, hideDayPeriod: true };
    expect(formatValue(String(seconds), f, undefined, "en-US", "UTC")).toBe("9");
  });

  it("reads the hour in the zone it was given", () => {
    expect(timestampString(seconds, "clock", "en-GB", "Europe/Berlin")).toBe("11:30");
    expect(timestampString(seconds, "clock", "en-GB", "America/New_York")).toBe("05:30");
  });

  it("prints a date in the locale's own order", () => {
    expect(timestampString(seconds, "date", "en-US", "UTC")).toBe("Sep 15");
    expect(timestampString(seconds, "date", "en-GB", "UTC")).toMatch(/^15 Sep[t]?$/);
  });

  it("prints a weekday on its own, and a weekday with a time", () => {
    expect(timestampString(seconds, "weekday", "en-US", "UTC")).toBe("Tue");
    expect(timestampString(seconds, "dateTime", "en-US", "UTC")).toMatch(/^Tue,? 9:30\s?AM$/);
  });

  it("follows the device when no zone is named", () => {
    const here = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(seconds * 1000));
    expect(timestampString(seconds, "clock", "en-GB")).toBe(here);
  });

  it("leaves a value that is not a number exactly as it reads", () => {
    expect(formatValue("Standup", { timestamp: "clock" }, undefined, "en-US", "UTC")).toBe("Standup");
  });

  it("gives way to duration and relative time, which also read a number", () => {
    expect(formatValue("5400", { timestamp: "clock", duration: true }, undefined, "en-US", "UTC")).toBe("1h 30m");
    expect(formatValue("5400", { timestamp: "clock", relativeTime: true }, undefined, "en-US", "UTC")).toBe("1h");
  });

  it("still takes a prefix, a suffix and a case", () => {
    expect(formatValue(String(seconds), { timestamp: "weekday", prefix: "on ", textCase: "upper" }, undefined, "en-US", "UTC"))
      .toBe("ON TUE");
  });
});

describe("a row layer's per-shape placement", () => {
  const source: ListSource = { kind: "template", value: "{{ items }}" };
  const reply = '{"items": [{"value": "a"}], "total": 1}';

  it("is read out of the same placements map as a layer of the document", () => {
    const row = textLayer(2, item("value"), (t) => { t.fontSize = 10; });
    const cfg = configWith(listLayer(source, (l) => { l.rows = 1; l.template = [row]; }));
    cfg.perFamily.rectangular!.placements[uuid(2)] = {
      frame: { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 },
      isHidden: false,
      size: 18,
    };
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(source, 1, reply))));
    const text = cells[0]!.elements[0] as Extract<ResolvedElement, { kind: "text" }>;
    expect(text.frame).toEqual({ x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 });
    expect(text.fontSize).toBe(18);
  });

  it("can hide one row layer on one shape", () => {
    const row = textLayer(2, item("value"));
    const cfg = configWith(listLayer(source, (l) => { l.rows = 1; l.template = [row]; }));
    cfg.perFamily.rectangular!.placements[uuid(2)] = { frame: { ...FULL_FRAME }, isHidden: true };
    const cells = cellsOf(resolved(cfg, contextWith(jinjaReply(source, 1, reply))));
    expect(cells[0]!.elements[0]!.isHidden).toBe(true);
  });
});
