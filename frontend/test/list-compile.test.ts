// What a list layer compiles to.
//
// The three Jinja sources are pinned character for character, because the
// value key is a hash of the text: a panel and a watch that disagree about one
// space ask the integration for the same items twice under two keys, and the
// fixtures that pin the compiled document would fail on one side only. The
// three service sources are pinned by their readable key and by the request
// body the integration reads.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element,
  type ListElement,
  type ListSource,
  documentEntityUses,
  literal,
  mapEntityRefs,
  legacyConfig,
  newConfig,
  newElement,
  schemaVersionFor,
} from "../src/model.js";
import { compile, deriveDataSources, fnv1a64Hex, listExpression, listExpressionKey, listKey, listRequests } from "../src/compiler.js";

/** The pinned entities source: a filter scope over one area and one domain,
 * only the lights that are on, brightest first, with two attributes the row
 * reads. Every fixture and both compilers agree on the text below. */
const ENTITIES_SOURCE: ListSource = {
  kind: "entities",
  scope: { kind: "filter", domains: ["light"], areaIds: ["kitchen"], labelIds: [], floorIds: [] },
  stateFilter: { kind: "isOn" },
  sort: "state",
  descending: true,
  attributes: ["brightness", "color_temp"],
};

const ENTITIES_JINJA =
  "{% set ns = namespace(items=[]) %}"
  + "{% for s in ((expand(area_entities('kitchen')) | selectattr('domain', 'in', ['light']))) | rejectattr('state', 'in', ['unavailable', 'unknown']) | selectattr('state', 'eq', 'on') %}"
  + "{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120],"
  + " 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain,"
  + " 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id),"
  + " 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none)),"
  + " 'attr.brightness': s.attributes.get('brightness'), 'attr.color_temp': s.attributes.get('color_temp')}] %}"
  + "{% endfor %}"
  + "{% set sorted = ((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=true) | list)"
  + " + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=true) | list)) %}"
  + "{{ {'items': sorted[:4], 'total': (sorted | count)} | to_json }}";

/** The pinned device-class case: every battery sensor, emptiest first, which
 * is what the Low batteries preset builds. Pinned on its own because the class
 * clause sits between the reject and the state filter, and a compiler that put
 * it anywhere else would key the same list differently. */
const BATTERIES_SOURCE: ListSource = {
  kind: "entities",
  scope: { kind: "filter", domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] },
  deviceClass: "battery",
  sort: "state",
  descending: false,
  attributes: [],
};

const BATTERIES_JINJA =
  "{% set ns = namespace(items=[]) %}"
  + "{% for s in (((states.sensor | list))) | rejectattr('state', 'in', ['unavailable', 'unknown'])"
  + " | selectattr('attributes.device_class', 'eq', 'battery') %}"
  + "{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120],"
  + " 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain,"
  + " 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id),"
  + " 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))}] %}"
  + "{% endfor %}"
  + "{% set sorted = ((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=false) | list)"
  + " + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=false) | list)) %}"
  + "{{ {'items': sorted[:4], 'total': (sorted | count)} | to_json }}";

const ATTRIBUTE_JINJA =
  "{% set a = state_attr('media_player.lounge', 'source_list') %}"
  + "{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}"
  + "{% set a = a | list %}"
  + "{{ {'items': a[:4], 'total': (a | count)} | to_json }}";

function listLayer(source: ListSource, edit: (l: ListElement) => void = () => {}): Element {
  const el = newElement("list") as Extract<Element, { kind: "list" }>;
  el.payload.source = source;
  edit(el.payload);
  return el;
}

function configWith(...elements: Element[]): CustomComplicationConfig {
  const cfg = legacyConfig("Lists", 0);
  cfg.elements = elements;
  for (const el of elements) cfg.perFamily.rectangular!.placements[el.payload.id] = { frame: el.payload.frame, isHidden: false };
  return cfg;
}

describe("the entities source", () => {
  it("compiles to the pinned Jinja", () => {
    expect(listExpression(ENTITIES_SOURCE, 4)).toBe(ENTITIES_JINJA);
  });

  it("is one line, so the value document stays one line per key", () => {
    expect(ENTITIES_JINJA).not.toContain("\n");
  });

  it("keys itself by the hash of that text", () => {
    expect(listExpressionKey(ENTITIES_SOURCE, 4)).toBe("e_" + fnv1a64Hex(ENTITIES_JINJA));
  });

  it("sorts by name when the author has not chosen", () => {
    const jinja = listExpression({ ...ENTITIES_SOURCE, sort: "name", descending: false, attributes: [] }, 4)!;
    expect(jinja).toContain("{% set sorted = (ns.items | sort(attribute='name', reverse=false) | list) %}");
    expect(jinja).toContain("'n': (s.state | float(none))}] %}");
  });

  it("sorts by lastChanged for a recent-activity list", () => {
    const jinja = listExpression({ ...ENTITIES_SOURCE, sort: "lastChanged" }, 4)!;
    expect(jinja).toContain("sort(attribute='lastChanged', reverse=true)");
  });

  it("drops the entities that are not reporting", () => {
    expect(listExpression({ ...ENTITIES_SOURCE, stateFilter: undefined }, 4))
      .toContain(" | rejectattr('state', 'in', ['unavailable', 'unknown']) %}");
  });

  it("keeps them when they are exactly what the author asked for", () => {
    const jinja = listExpression({ ...ENTITIES_SOURCE, stateFilter: { kind: "equals", value: "unavailable" } }, 4)!;
    expect(jinja).not.toContain("rejectattr('state', 'in'");
    expect(jinja).toContain("| selectattr('state', 'eq', 'unavailable') %}");
  });

  it("slices to the cells it draws", () => {
    expect(listExpression(ENTITIES_SOURCE, 9)).toContain("sorted[:9]");
    // The decode clamp applies here too, so a document asking for 40 rows asks
    // the template for 12.
    expect(listExpression(ENTITIES_SOURCE, 40)).toContain("sorted[:12]");
  });

  it("keeps only the chosen device class, between the reject and the state filter", () => {
    expect(listExpression(BATTERIES_SOURCE, 4)).toBe(BATTERIES_JINJA);
  });

  it("keys the device-class list by the hash of that text", () => {
    expect(listExpressionKey(BATTERIES_SOURCE, 4)).toBe("e_" + fnv1a64Hex(BATTERIES_JINJA));
  });

  it("writes the class clause after the state filter's reject and before its select", () => {
    const jinja = listExpression({ ...ENTITIES_SOURCE, deviceClass: "battery" }, 4)!;
    expect(jinja).toContain(
      " | rejectattr('state', 'in', ['unavailable', 'unknown'])"
      + " | selectattr('attributes.device_class', 'eq', 'battery')"
      + " | selectattr('state', 'eq', 'on') %}",
    );
  });

  it("says nothing about a device class when there is none, so an older list keys as it did", () => {
    expect(listExpression(ENTITIES_SOURCE, 4)).toBe(ENTITIES_JINJA);
    expect(listExpression({ ...BATTERIES_SOURCE, deviceClass: undefined }, 4))
      .not.toContain("device_class', 'eq'");
    // A box cleared to spaces is a box cleared.
    expect(listExpression({ ...BATTERIES_SOURCE, deviceClass: "  " }, 4))
      .toBe(listExpression({ ...BATTERIES_SOURCE, deviceClass: undefined }, 4));
  });

  it("names an explicit entity list the way the aggregate does", () => {
    const jinja = listExpression({
      ...ENTITIES_SOURCE,
      scope: { kind: "entities", entities: [
        { entityId: "light.hall", displayName: "Hall", domain: "light" },
        { entityId: "light.porch", displayName: "Porch", domain: "light" },
      ] },
    }, 4)!;
    expect(jinja).toContain("{% for s in (expand(['light.hall', 'light.porch'])) | rejectattr(");
  });
});

describe("the attribute source", () => {
  const source: ListSource = {
    kind: "attribute",
    entityId: "media_player.lounge",
    displayName: "Lounge",
    domain: "media_player",
    attribute: "source_list",
  };

  it("compiles to the pinned Jinja", () => {
    expect(listExpression(source, 4)).toBe(ATTRIBUTE_JINJA);
  });

  it("keys itself by the hash of that text", () => {
    expect(listExpressionKey(source, 4)).toBe("e_" + fnv1a64Hex(ATTRIBUTE_JINJA));
  });
});

describe("the template source", () => {
  it("is the author's text, trimmed", () => {
    const source: ListSource = { kind: "template", value: "  {{ [1, 2, 3] | to_json }}  " };
    expect(listExpression(source, 4)).toBe("{{ [1, 2, 3] | to_json }}");
    expect(listExpressionKey(source, 4)).toBe("e_" + fnv1a64Hex("{{ [1, 2, 3] | to_json }}"));
  });

  it("is nothing at all while it is blank", () => {
    expect(listExpression({ kind: "template", value: "   " }, 4)).toBeUndefined();
    expect(listExpressionKey({ kind: "template", value: "" }, 4)).toBeUndefined();
  });
});

describe("the service sources", () => {
  const calendars: ListSource = {
    kind: "calendar",
    entities: [
      { entityId: "calendar.work", displayName: "Work", domain: "calendar" },
      { entityId: "calendar.family", displayName: "Family", domain: "calendar" },
    ],
    hours: 48,
  };
  const todo: ListSource = {
    kind: "todo",
    entities: [{ entityId: "todo.shopping", displayName: "Shopping", domain: "todo" }],
    status: "open",
    sort: "due",
  };
  const forecast: ListSource = {
    kind: "forecast",
    entityId: "weather.home",
    displayName: "Home",
    domain: "weather",
    type: "hourly",
  };

  it("has no Jinja of its own", () => {
    for (const source of [calendars, todo, forecast]) expect(listExpression(source, 4)).toBeUndefined();
  });

  it("reads its readable key", () => {
    expect(listKey(calendars)).toBe("calendar|calendar.work,calendar.family|48");
    expect(listKey(todo)).toBe("todo|todo.shopping|open|due");
    expect(listKey(forecast)).toBe("forecast|weather.home|hourly");
  });

  it("asks for nothing while it names no entity", () => {
    expect(listKey({ ...calendars, entities: [] })).toBeUndefined();
    expect(listKey({ ...forecast, entityId: "" })).toBeUndefined();
  });

  it("builds the request body the integration reads", () => {
    const cfg = configWith(
      listLayer(calendars, (l) => { l.rows = 4; }),
      listLayer(todo, (l) => { l.rows = 6; }),
      listLayer(forecast, (l) => { l.rows = 6; }),
    );
    expect([...listRequests(cfg).entries()]).toEqual([
      ["calendar|calendar.work,calendar.family|48",
        { source: "calendar", entities: ["calendar.work", "calendar.family"], hours: 48, limit: 4 }],
      ["forecast|weather.home|hourly",
        { source: "forecast", entity_id: "weather.home", type: "hourly", limit: 6 }],
      ["todo|todo.shopping|open|due",
        { source: "todo", entities: ["todo.shopping"], status: "open", sort: "due", limit: 6 }],
    ]);
  });

  it("asks once for two lists of the same items, at the larger limit", () => {
    const cfg = configWith(
      listLayer(todo, (l) => { l.rows = 3; }),
      listLayer({ ...todo }, (l) => { l.rows = 8; }),
    );
    const requests = [...listRequests(cfg).values()];
    expect(requests).toHaveLength(1);
    expect(requests[0]!.limit).toBe(8);
  });

  it("lands in dataSources after the template, one per identity", () => {
    const cfg = configWith(listLayer(calendars), listLayer(ENTITIES_SOURCE));
    const kinds = deriveDataSources(cfg).map((d) => d.kind);
    expect(kinds).toEqual(["template", "list"]);
  });
});

describe("a list in a document", () => {
  it("puts its Jinja in the value document as a raw block", () => {
    const cfg = configWith(listLayer(ENTITIES_SOURCE));
    const compiled = compile(cfg);
    const key = listExpressionKey(ENTITIES_SOURCE, 4)!;
    expect([...compiled.expressions.keys()]).toEqual([key]);
    expect(compiled.document).toContain(`{% set v_${key} %}${ENTITIES_JINJA}{% endset %}`);
  });

  it("fetches what its row layers read, and nothing for an item field", () => {
    const row = newElement("text") as Extract<Element, { kind: "text" }>;
    row.payload.value = { kind: { kind: "entityState", entityId: "sensor.outside", displayName: "Outside", domain: "sensor" } };
    const itemRow = newElement("text") as Extract<Element, { kind: "text" }>;
    itemRow.payload.value = { kind: { kind: "item", field: "name" } };
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [row, itemRow]; }));
    const compiled = compile(cfg);
    expect([...compiled.entities.keys()]).toEqual(["sensor.outside"]);
    expect([...compiled.expressions.keys()]).toEqual([listExpressionKey(ENTITIES_SOURCE, 4)!]);
  });

  it("moves the document to schema 8", () => {
    expect(schemaVersionFor(configWith(listLayer(ENTITIES_SOURCE)))).toBe(8);
  });

  it("moves the document to schema 8 for an item value on an ordinary layer", () => {
    const text = newElement("text") as Extract<Element, { kind: "text" }>;
    text.payload.value = { kind: { kind: "item", field: "title" } };
    expect(schemaVersionFor(configWith(text))).toBe(8);
  });

  it("moves the document to schema 8 for a listStat in a rule", () => {
    const text = newElement("text") as Extract<Element, { kind: "text" }>;
    text.payload.value = literal("All done");
    text.payload.rules = [{
      id: "11111111-1111-4111-8111-111111111111",
      cases: [{
        id: "22222222-2222-4222-8222-222222222222",
        when: { join: "all", tests: [{
          id: "33333333-3333-4333-8333-333333333333",
          value: { kind: { kind: "listStat", layer: "44444444-4444-4444-8444-444444444444", stat: "count" } },
          comparison: { kind: "equals", value: literal("0") },
        }] },
        then: [{ kind: "show" }],
      }],
    }];
    expect(schemaVersionFor(configWith(text))).toBe(8);
  });

  it("names the entities its source and its row layers read", () => {
    const row = newElement("text") as Extract<Element, { kind: "text" }>;
    row.payload.value = { kind: { kind: "entityState", entityId: "sensor.outside", displayName: "Outside", domain: "sensor" } };
    const source: ListSource = {
      kind: "calendar",
      entities: [{ entityId: "calendar.work", displayName: "Work", domain: "calendar" }],
      hours: 24,
    };
    const cfg = configWith(listLayer(source, (l) => { l.template = [row]; }));
    expect(documentEntityUses(cfg).map((u) => u.entityId)).toEqual(["calendar.work", "sensor.outside"]);
  });

  it("names the entities of an explicit scope, and none of a filter", () => {
    const explicit: ListSource = {
      ...ENTITIES_SOURCE,
      scope: { kind: "entities", entities: [{ entityId: "light.hall", displayName: "Hall", domain: "light" }] },
    };
    expect(documentEntityUses(configWith(listLayer(explicit))).map((u) => u.entityId)).toEqual(["light.hall"]);
    expect(documentEntityUses(configWith(listLayer(ENTITIES_SOURCE)))).toEqual([]);
  });

  it("leaves a row tap's item placeholder alone", () => {
    const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
    tap.payload.action = { type: "toggleEntity", entityId: "{item.entityId}", displayName: "{item.name}", domain: "light" };
    const cfg = configWith(listLayer(ENTITIES_SOURCE, (l) => { l.template = [tap]; }));
    expect(documentEntityUses(cfg)).toEqual([]);
    // And a remap leaves it exactly as it was: it is not an id to point
    // somewhere else, it is the row's own item.
    mapEntityRefs(cfg, () => ({ entityId: "light.elsewhere", displayName: "Elsewhere", domain: "light" }));
    const list = cfg.elements[0]!;
    expect(list.kind === "list" && list.payload.template[0]!.kind === "tap"
      && list.payload.template[0]!.payload.action).toMatchObject({ entityId: "{item.entityId}" });
  });

  it("rewrites the entities of a source when a document is imported", () => {
    const source: ListSource = {
      kind: "forecast",
      entityId: "weather.old",
      displayName: "Old",
      domain: "weather",
      type: "daily",
    };
    const cfg = configWith(listLayer(source));
    mapEntityRefs(cfg, (ref) => (ref.entityId === "weather.old"
      ? { entityId: "weather.new", displayName: "New", domain: "weather" }
      : undefined));
    const list = cfg.elements[0]!;
    expect(list.kind === "list" && list.payload.source).toMatchObject({ entityId: "weather.new", displayName: "New" });
  });

  it("leaves a document with no list where it was", () => {
    const cfg = configWith(newElement("text"));
    expect(schemaVersionFor(cfg)).toBe(4);
  });
});
