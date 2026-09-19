// The list layer's editor: the Source card, the Layout card, the Row card and
// the two value sources a list brings with it.
//
// What is worth pinning here is the bytes and the wiring, not the markup: each
// source has to encode to exactly the keys the wire contract lists, the
// attribute list has to follow the row without anybody keeping it in step, and
// the row stage has to be a document the ordinary drag code can edit. The
// rendered cards are checked only for the controls being there at all, which
// is the one thing a refactor can quietly drop.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type ListElement,
  type ListSource,
  LIST_MAX_TEMPLATE,
  auditUnknownKeys,
  encodeConfig,
  listOwningRowLayer,
  literal,
  newConfig,
  newElement,
  parseConfig,
  schemaVersionFor,
  selectableLayerId,
} from "../src/model.js";
import {
  type EditorHost,
  LIST_MIN_CELL_POINTS,
  LIST_ROW_KINDS,
  addEmptyState,
  elementIn,
  layerEditor,
  listAttributeNames,
  listCellHeightPoints,
  listOwning,
  newRowLayer,
  rowStageConfig,
  scopeDeviceClasses,
  switchListSource,
  syncListAttributes,
  valueKindsFor,
  withListDeviceClass,
} from "../src/editors.js";
import { LIST_ITEM_FIELDS } from "../src/list-seeds.js";
import { LAYER_PRESETS, applyPreset } from "../src/presets.js";
import { familyAllowsKind } from "../src/layouts.js";
import { collectListResults, listItemsRequests, type HassLike } from "../src/ha-api.js";
import { listExpression } from "../src/compiler.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function") return "";
  return String(node);
}

/** A list layer on the wide face, and the config holding it. */
function withList(tweak: (p: ListElement) => void = () => {}): {
  cfg: CustomComplicationConfig;
  el: Extract<CElement, { kind: "list" }>;
} {
  const cfg = newConfig("List", 0);
  const el = newElement("list") as Extract<CElement, { kind: "list" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  cfg.elements.push(el);
  cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
  cfg.perFamily.rectangular.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: false };
  return { cfg, el };
}

function host(cfg: CustomComplicationConfig, over: Partial<EditorHost> = {}): EditorHost {
  const base = {
    hass: { states: {} } as HassLike,
    config: cfg,
    icons: noIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "rectangular" as const,
    setActiveFamily: () => {},
    addFamily: () => {},
    tapAreaShown: false,
    showTapArea: () => {},
    openSections: new Set(["content", "look", "row"]),
    toggleSection: () => {},
    helpSections: new Set<string>(),
    toggleHelp: () => {},
    selectLayer: () => {},
    peekLayer: () => {},
    selectValue: () => {},
    beginGesture: () => {},
    copyPosition: () => {},
    setRowEdit: () => {},
  };
  return { ...base, ...over } as unknown as EditorHost;
}

/** What one document encodes to, for a byte-level look at one source. */
function encodedSource(source: ListSource): Record<string, unknown> {
  const { cfg } = withList((p) => { p.source = source; });
  const doc = encodeConfig(cfg) as { elements: { payload: { source: Record<string, unknown> } }[] };
  return doc.elements[0]!.payload.source;
}

describe("the Source card's bytes", () => {
  it("writes an entities source with only the keys that are not at their default", () => {
    expect(encodedSource({
      kind: "entities",
      scope: { kind: "filter", domains: ["light"], areaIds: ["kitchen"], labelIds: [], floorIds: [] },
      sort: "name",
      descending: false,
      attributes: [],
    })).toEqual({
      kind: "entities",
      scope: { kind: "filter", domains: ["light"], areaIds: ["kitchen"], labelIds: [], floorIds: [] },
    });
  });

  it("writes an entities source's sort, order, filter and attributes when they are set", () => {
    expect(encodedSource({
      kind: "entities",
      scope: { kind: "entities", entities: [{ entityId: "light.kitchen", displayName: "Kitchen", domain: "light" }] },
      stateFilter: { kind: "equals", value: "on" },
      sort: "state",
      descending: true,
      attributes: ["brightness"],
    })).toEqual({
      kind: "entities",
      scope: { kind: "entities", entities: [{ entityId: "light.kitchen", displayName: "Kitchen", domain: "light" }] },
      stateFilter: { kind: "equals", value: "on" },
      sort: "state",
      descending: true,
      attributes: ["brightness"],
    });
  });

  it("writes an entities source's device class only when there is one", () => {
    const scope = { kind: "filter" as const, domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] };
    const base = { kind: "entities" as const, scope, sort: "name" as const, descending: false, attributes: [] };
    expect(encodedSource({ ...base, deviceClass: "battery" }))
      .toEqual({ kind: "entities", scope, deviceClass: "battery" });
    expect(encodedSource({ ...base, deviceClass: "   " })).toEqual({ kind: "entities", scope });
    expect(encodedSource(base)).toEqual({ kind: "entities", scope });
  });

  it("reads a device class back, and drops a blank one on the way in", () => {
    const scope = { kind: "filter" as const, domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] };
    const read = (written: unknown) => {
      const { cfg } = withList((p) => {
        p.source = { kind: "entities", scope, sort: "name", descending: false, attributes: [] };
      });
      const doc = encodeConfig(cfg) as { elements: { payload: { source: Record<string, unknown> } }[] };
      doc.elements[0]!.payload.source.deviceClass = written;
      const back = parseConfig(doc).elements[0]!;
      if (back.kind !== "list" || back.payload.source.kind !== "entities") throw new Error("wrong kind");
      return back.payload.source.deviceClass;
    };
    expect(read("battery")).toBe("battery");
    expect(read(" door ")).toBe("door");
    expect(read("")).toBeUndefined();
    expect(read(42)).toBeUndefined();
  });

  it("writes an attribute source's entity flat", () => {
    expect(encodedSource({
      kind: "attribute", entityId: "media_player.lounge", displayName: "Lounge", domain: "media_player",
      attribute: "source_list",
    })).toEqual({
      kind: "attribute", entityId: "media_player.lounge", displayName: "Lounge", domain: "media_player",
      attribute: "source_list",
    });
  });

  it("writes a template source's text exactly as typed", () => {
    expect(encodedSource({ kind: "template", value: "{{ x | to_json }}" }))
      .toEqual({ kind: "template", value: "{{ x | to_json }}" });
  });

  it("writes a calendar source's hours only when they are not the default day", () => {
    const ref = { entityId: "calendar.home", displayName: "Home", domain: "calendar" };
    expect(encodedSource({ kind: "calendar", entities: [ref], hours: 24 }))
      .toEqual({ kind: "calendar", entities: [ref] });
    expect(encodedSource({ kind: "calendar", entities: [ref], hours: 72 }))
      .toEqual({ kind: "calendar", entities: [ref], hours: 72 });
  });

  it("writes a to-do source's status and sort only away from their defaults", () => {
    const ref = { entityId: "todo.shopping", displayName: "Shopping", domain: "todo" };
    expect(encodedSource({ kind: "todo", entities: [ref], status: "open", sort: "list" }))
      .toEqual({ kind: "todo", entities: [ref] });
    expect(encodedSource({ kind: "todo", entities: [ref], status: "all", sort: "due" }))
      .toEqual({ kind: "todo", entities: [ref], status: "all", sort: "due" });
  });

  it("writes a forecast source's entity flat, and its type only away from hourly", () => {
    const flat = { entityId: "weather.home", displayName: "Home", domain: "weather" };
    expect(encodedSource({ kind: "forecast", ...flat, type: "hourly" })).toEqual({ kind: "forecast", ...flat });
    expect(encodedSource({ kind: "forecast", ...flat, type: "daily" }))
      .toEqual({ kind: "forecast", ...flat, type: "daily" });
  });

  it("passes the unknown-key audit for every source the card can write", () => {
    const sources: ListSource[] = [
      { kind: "entities", scope: { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] }, sort: "lastChanged", descending: true, attributes: ["battery_level"] },
      { kind: "entities", scope: { kind: "filter", domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] }, deviceClass: "battery", sort: "state", descending: false, attributes: [] },
      { kind: "attribute", entityId: "group.all", displayName: "All", domain: "group", attribute: "entity_id" },
      { kind: "template", value: "{{ [] | to_json }}" },
      { kind: "calendar", entities: [{ entityId: "calendar.home", displayName: "", domain: "calendar" }], hours: 336 },
      { kind: "todo", entities: [{ entityId: "todo.a", displayName: "", domain: "todo" }], status: "done", sort: "due" },
      { kind: "forecast", entityId: "weather.home", displayName: "", domain: "weather", type: "twiceDaily" },
    ];
    for (const source of sources) {
      const { cfg } = withList((p) => { p.source = source; });
      const doc = encodeConfig(cfg);
      expect(auditUnknownKeys(doc)).toEqual([]);
      expect(encodeConfig(parseConfig(doc))).toEqual(doc);
    }
  });
});

describe("switchListSource", () => {
  it("carries a calendar's pick over to a to-do list and back", () => {
    const ref = { entityId: "calendar.home", displayName: "Home", domain: "calendar" };
    const todo = switchListSource({ kind: "calendar", entities: [ref], hours: 24 }, "todo");
    expect(todo).toEqual({ kind: "todo", entities: [ref], status: "open", sort: "list" });
  });

  it("carries a flat entity into a forecast and into an attribute", () => {
    const from: ListSource = { kind: "attribute", entityId: "weather.home", displayName: "Home", domain: "weather", attribute: "forecast" };
    expect(switchListSource(from, "forecast")).toEqual({
      kind: "forecast", entityId: "weather.home", displayName: "Home", domain: "weather", type: "hourly",
    });
  });

  it("turns a fixed list of calendars into a fixed entities scope", () => {
    const ref = { entityId: "calendar.home", displayName: "Home", domain: "calendar" };
    const out = switchListSource({ kind: "calendar", entities: [ref], hours: 24 }, "entities");
    expect(out).toEqual({
      kind: "entities", scope: { kind: "entities", entities: [ref] }, sort: "name", descending: false, attributes: [],
    });
  });

  it("gives a source with nothing picked a filter scope to start from", () => {
    const out = switchListSource({ kind: "template", value: "" }, "entities");
    expect(out).toMatchObject({ kind: "entities", scope: { kind: "filter", domains: [] } });
  });
});

describe("the Device class control", () => {
  const scope = { kind: "filter" as const, domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] };
  const entities = { kind: "entities" as const, scope, sort: "name" as const, descending: false, attributes: [] };

  it("writes what was typed, trimmed", () => {
    expect(withListDeviceClass(entities, "battery")).toEqual({ ...entities, deviceClass: "battery" });
    expect(withListDeviceClass(entities, "  door  ")).toEqual({ ...entities, deviceClass: "door" });
  });

  it("clears the key rather than writing an empty one", () => {
    const set = withListDeviceClass(entities, "battery");
    if (set.kind !== "entities") throw new Error("wrong kind");
    const cleared = withListDeviceClass(set, "");
    expect("deviceClass" in cleared).toBe(false);
    expect(withListDeviceClass(set, "   ")).toEqual(entities);
  });

  it("offers the classes this home reports on the entities the scope covers", () => {
    const states = {
      "sensor.a": { entity_id: "sensor.a", state: "50", attributes: { device_class: "battery" }, last_changed: "", last_updated: "" },
      "sensor.b": { entity_id: "sensor.b", state: "21", attributes: { device_class: "temperature" }, last_changed: "", last_updated: "" },
      "sensor.c": { entity_id: "sensor.c", state: "21", attributes: {}, last_changed: "", last_updated: "" },
      "binary_sensor.d": { entity_id: "binary_sensor.d", state: "on", attributes: { device_class: "door" }, last_changed: "", last_updated: "" },
    };
    expect(scopeDeviceClasses(states, scope)).toEqual(["battery", "temperature"]);
    expect(scopeDeviceClasses(states, { ...scope, domains: [] })).toEqual(["battery", "door", "temperature"]);
  });

  it("falls back to the standard names for a scope nothing has reported yet", () => {
    const classes = scopeDeviceClasses({}, scope);
    expect(classes).toContain("battery");
    expect(classes).toContain("temperature");
    expect(scopeDeviceClasses({}, { ...scope, domains: ["binary_sensor"] })).toContain("motion");
  });

  it("is on the Source card of an entities list", () => {
    const { cfg, el } = withList((p) => { p.source = entities; });
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).toContain("Device class");
  });

  it("is not on the card of a source that has no device classes", () => {
    const { cfg, el } = withList((p) => { p.source = { kind: "todo", entities: [], status: "open", sort: "list" }; });
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).not.toContain("Device class");
  });
});

describe("the attributes an entities source asks for", () => {
  const entities: ListSource = {
    kind: "entities",
    scope: { kind: "filter", domains: ["light"], areaIds: [], labelIds: [], floorIds: [] },
    sort: "name", descending: false, attributes: [],
  };

  it("is derived from the attr fields the row reads, in the order it meets them", () => {
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
    const gauge = newElement("gauge");
    if (gauge.kind !== "gauge") throw new Error("wrong kind");
    gauge.payload.value = { kind: { kind: "item", field: "attr.color_temp" } };
    expect(listAttributeNames([text, gauge])).toEqual(["brightness", "color_temp"]);
  });

  it("finds one named by a rule and one named by a row tap's data", () => {
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = literal("x");
    text.payload.rules = [{
      id: "r", cases: [{
        id: "c",
        when: { join: "all", tests: [{ id: "t", value: { kind: { kind: "item", field: "attr.battery_level" } }, comparison: { kind: "lessThan", value: literal("20") } }] },
        then: [],
      }], otherwise: [],
    }];
    const tap = newElement("tap");
    if (tap.kind !== "tap") throw new Error("wrong kind");
    tap.payload.action = {
      type: "callService", serviceDomain: "light", serviceName: "turn_on",
      serviceDataJSON: `{"brightness": "{item.attr.brightness}"}`,
    };
    expect(listAttributeNames([text, tap])).toEqual(["battery_level", "brightness"]);
  });

  it("names each attribute once however many layers read it", () => {
    const a = newElement("text");
    const b = newElement("text");
    if (a.kind !== "text" || b.kind !== "text") throw new Error("wrong kind");
    a.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
    b.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
    expect(listAttributeNames([a, b])).toEqual(["brightness"]);
  });

  it("is written onto the source by syncListAttributes, and cleared when the row stops reading it", () => {
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
    const list: ListElement = { ...(newElement("list").payload as ListElement), source: entities, template: [text] };
    syncListAttributes(list);
    expect(list.source.kind === "entities" && list.source.attributes).toEqual(["brightness"]);
    list.template = [];
    syncListAttributes(list);
    expect(list.source.kind === "entities" && list.source.attributes).toEqual([]);
  });

  it("leaves a source that is not entities alone", () => {
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
    const source: ListSource = { kind: "template", value: "x" };
    const list: ListElement = { ...(newElement("list").payload as ListElement), source, template: [text] };
    syncListAttributes(list);
    expect(list.source).toBe(source);
  });

  it("follows a row layer edited through the ordinary cards", () => {
    const row = newRowLayer("text");
    const { cfg, el } = withList((p) => { p.source = entities; p.template = [row]; });
    const h = host(cfg);
    // The Content card of a row layer, edited the way any layer's is.
    const editor = layerEditor(h, row, "rectangular");
    expect(flatten(editor)).toContain("Content");
    h.update((c) => {
      const target = elementIn(c, row.payload.id);
      if (target?.kind === "text") target.payload.value = { kind: { kind: "item", field: "attr.brightness" } };
      const owner = listOwning(c, row.payload.id);
      if (owner) syncListAttributes(owner.payload);
    });
    expect(el.payload.source.kind === "entities" && el.payload.source.attributes).toEqual(["brightness"]);
  });
});

describe("finding a row layer", () => {
  it("reaches a layer inside a list's template and names the list it belongs to", () => {
    const row = newRowLayer("text");
    const { cfg, el } = withList((p) => { p.template = [row]; });
    expect(elementIn(cfg, row.payload.id)).toBe(row);
    expect(listOwning(cfg, row.payload.id)).toBe(el);
    expect(listOwning(cfg, el.payload.id)).toBeUndefined();
    expect(listOwningRowLayer(cfg, row.payload.id)).toBe(el);
  });

  it("sends a press on a row to the list it is a row of", () => {
    // A row is drawn once per cell and moved only in the row designer, so on
    // the face the thing under the finger is the list itself: a click selects
    // it and a drag moves the whole list.
    const row = newRowLayer("text");
    const tap = newRowLayer("tap");
    const { cfg, el } = withList((p) => { p.template = [row, tap]; });
    expect(selectableLayerId(cfg, row.payload.id)).toBe(el.payload.id);
    expect(selectableLayerId(cfg, tap.payload.id)).toBe(el.payload.id);
    expect(selectableLayerId(cfg, el.payload.id)).toBe(el.payload.id);
    expect(selectableLayerId(cfg, "gone")).toBeUndefined();
  });

  it("leaves the row's own layers selectable on the stage, where they are the document", () => {
    // The row designer draws `rowStageConfig`, whose elements are the row's
    // layers. There the redirect must not fire, or nothing in the row could be
    // picked up at all.
    const row = newRowLayer("text");
    const { cfg, el } = withList((p) => { p.template = [row]; });
    const stage = rowStageConfig(cfg, el.payload.id, "rectangular", undefined);
    expect(stage).toBeDefined();
    expect(selectableLayerId(stage!, row.payload.id)).toBe(row.payload.id);
    expect(listOwningRowLayer(stage!, row.payload.id)).toBeUndefined();
  });
});

describe("the Row card", () => {
  it("offers the six kinds a row may hold and none of the banned ones", () => {
    expect([...LIST_ROW_KINDS]).toEqual(["text", "icon", "shape", "gauge", "image", "tap"]);
    for (const banned of ["list", "chart", "timeline", "chartTimes", "chartDots", "chartGrid", "imageTime"]) {
      expect(LIST_ROW_KINDS).not.toContain(banned);
    }
  });

  it("frames a new row layer inside the cell rather than in the middle of a face", () => {
    const text = newRowLayer("text");
    expect(text.payload.frame).toMatchObject({ x: 0, y: 0, width: 1, height: 1 });
    expect(text.kind === "text" && text.payload.value.kind).toEqual({ kind: "item", field: "" });
    const picture = newRowLayer("image");
    expect(picture.kind === "image" && picture.payload.source).toBe("inline");
  });

  it("adds, reorders and removes row layers, and stops at eight", () => {
    const { cfg, el } = withList();
    const h = host(cfg);
    const add = () => h.update((c) => {
      const target = elementIn(c, el.payload.id);
      if (target?.kind === "list" && target.payload.template.length < LIST_MAX_TEMPLATE) {
        target.payload.template.push(newRowLayer("text"));
      }
    });
    for (let i = 0; i < LIST_MAX_TEMPLATE + 3; i++) add();
    expect(el.payload.template).toHaveLength(LIST_MAX_TEMPLATE);
    const firstId = el.payload.template[0]!.payload.id;
    h.update((c) => {
      const target = elementIn(c, el.payload.id);
      if (target?.kind === "list") target.payload.template.splice(0, 1);
    });
    expect(el.payload.template).toHaveLength(LIST_MAX_TEMPLATE - 1);
    expect(el.payload.template.some((r) => r.payload.id === firstId)).toBe(false);
  });

  it("draws the Design the row button, and says so once the mode is on", () => {
    const { cfg, el } = withList((p) => { p.template = [newRowLayer("text")]; });
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).toContain("Design the row");
    const inMode = host(cfg, { rowEditListId: el.payload.id });
    expect(flatten(layerEditor(inMode, el, "rectangular"))).toContain("Done designing");
  });

  it("warns when the row is empty, because an empty row draws nothing", () => {
    const { cfg, el } = withList();
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).toContain("The row is empty");
  });
});

describe("the row stage", () => {
  it("makes the row's layers the layers of a throwaway document", () => {
    const row = newRowLayer("text");
    const { cfg, el } = withList((p) => { p.template = [row]; });
    const stage = rowStageConfig(cfg, el.payload.id, "rectangular", undefined)!;
    expect(stage.elements.map((e) => e.payload.id)).toEqual([row.payload.id]);
    expect(stage.elements[0]).not.toBe(row);
    expect(stage.perFamily.rectangular?.placements[row.payload.id]).toBeDefined();
    // The list itself is not on the stage: the stage is one cell, not the face.
    expect(stage.perFamily.rectangular?.placements[el.payload.id]).toBeUndefined();
  });

  it("pastes the item's fields in, so a row reads something while it is designed", () => {
    const row = newRowLayer("text");
    if (row.kind !== "text") throw new Error("wrong kind");
    row.payload.value = { kind: { kind: "item", field: "title" } };
    const { cfg, el } = withList((p) => { p.template = [row]; });
    const stage = rowStageConfig(cfg, el.payload.id, "rectangular", new Map([["title", "Stand-up"]]))!;
    const drawn = stage.elements[0]!;
    expect(drawn.kind === "text" && drawn.payload.value.kind).toEqual({ kind: "literal", value: "Stand-up" });
    // The real row is untouched: the stage is a copy.
    expect(row.payload.value.kind).toEqual({ kind: "item", field: "title" });
  });

  it("draws a field the item does not have as the two dashes it draws on the face", () => {
    const row = newRowLayer("text");
    if (row.kind !== "text") throw new Error("wrong kind");
    row.payload.value = { kind: { kind: "item", field: "nope" } };
    const { cfg, el } = withList((p) => { p.template = [row]; });
    const stage = rowStageConfig(cfg, el.payload.id, "rectangular", new Map())!;
    expect(stage.elements[0]!.kind === "text" && (stage.elements[0]! as Extract<CElement, { kind: "text" }>).payload.value.kind)
      .toEqual({ kind: "literal", value: "--" });
  });

  it("is nothing at all for an id that is not a list", () => {
    const { cfg } = withList();
    expect(rowStageConfig(cfg, "no-such-layer", "rectangular", undefined)).toBeUndefined();
  });
});

describe("the value sources a list brings", () => {
  const opts = { key: "k" };

  it("offers Item field only while a row is being designed", () => {
    const { cfg, el } = withList();
    const outside = valueKindsFor(host(cfg), { kind: "literal", value: "" }, opts).map(([k]) => k);
    expect(outside).not.toContain("item");
    const inside = valueKindsFor(host(cfg, { rowEditListId: el.payload.id }), { kind: "literal", value: "" }, opts).map(([k]) => k);
    expect(inside).toContain("item");
  });

  it("keeps offering Item field to a value that already reads one, wherever it is", () => {
    const { cfg } = withList();
    const kinds = valueKindsFor(host(cfg), { kind: "item", field: "title" }, opts).map(([k]) => k);
    expect(kinds).toContain("item");
  });

  it("offers List count once the document has a list, and not before", () => {
    const plain = newConfig("Plain", 0);
    expect(valueKindsFor(host(plain), { kind: "literal", value: "" }, opts).map(([k]) => k)).not.toContain("listStat");
    const { cfg } = withList();
    expect(valueKindsFor(host(cfg), { kind: "literal", value: "" }, opts).map(([k]) => k)).toContain("listStat");
  });

  it("leaves Shared value out where the caller says so", () => {
    const { cfg } = withList();
    const kinds = valueKindsFor(host(cfg), { kind: "literal", value: "" }, { key: "k", allowNamed: false }).map(([k]) => k);
    expect(kinds).not.toContain("named");
  });

  it("lists the source's own fields in the Item field picker", () => {
    const source: ListSource = { kind: "calendar", entities: [], hours: 24 };
    const { cfg, el } = withList((p) => { p.source = source; p.template = [newRowLayer("text")]; });
    const row = el.payload.template[0]!;
    if (row.kind !== "text") throw new Error("wrong kind");
    row.payload.value = { kind: { kind: "item", field: "title" } };
    const h = host(cfg, { rowEditListId: el.payload.id, openSections: new Set(["content"]) });
    const text = flatten(layerEditor(h, row, "rectangular"));
    for (const [, label] of LIST_ITEM_FIELDS.calendar) expect(text).toContain(label);
    // A field of another source has no business being offered here.
    expect(text).not.toContain("Device class");
  });
});

describe("the Timestamp format", () => {
  it("is offered on every value, with None first", () => {
    const { cfg } = withList();
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = literal("1757930400");
    cfg.elements.push(text);
    const rendered = flatten(layerEditor(host(cfg), text, "rectangular"));
    expect(rendered).toContain("Timestamp");
    for (const label of ["None", "Time", "Date", "Weekday", "Weekday and time"]) expect(rendered).toContain(label);
  });

  it("survives a round trip and moves the document to schema 8", () => {
    const cfg = newConfig("Stamp", 0);
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("wrong kind");
    text.payload.value = { kind: { kind: "item", field: "start" }, format: { timestamp: "clock" } };
    cfg.elements.push(text);
    const doc = encodeConfig(cfg);
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(encodeConfig(parseConfig(doc))).toEqual(doc);
    expect(schemaVersionFor(cfg)).toBe(8);
  });
});

describe("the Layout card", () => {
  it("reports the cell height on the shape being edited", () => {
    const { el } = withList((p) => { p.rows = 4; });
    const full = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    const tall = listCellHeightPoints(el.payload, full, "rectangular");
    // The wide face is 65.5 points tall, so four cells and three gaps of 2.
    expect(tall).toBeGreaterThan(13);
    expect(tall).toBeLessThan(15);
  });

  it("drops a cell under the warning line once there are too many of them", () => {
    const { el } = withList((p) => { p.rows = 12; });
    const full = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    expect(listCellHeightPoints(el.payload, full, "rectangular")).toBeLessThan(LIST_MIN_CELL_POINTS);
  });

  it("warns on the card when a cell is too short for a line of text", () => {
    const { cfg, el } = withList((p) => { p.rows = 12; });
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).toContain("too short for a line of text");
  });

  it("hides Columns while the list runs across, where the key means nothing", () => {
    const { cfg, el } = withList((p) => { p.direction = "across"; });
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).not.toContain("Columns");
    el.payload.direction = "down";
    expect(flatten(layerEditor(host(cfg), el, "rectangular"))).toContain("Columns");
  });
});

describe("the empty state helper", () => {
  it("adds a hidden text over the list, shown when the list drew nothing", () => {
    const { cfg, el } = withList((p) => { p.source = { kind: "todo", entities: [], status: "open", sort: "list" }; });
    const id = addEmptyState(cfg, el.payload.id, "rectangular")!;
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    if (made.kind !== "text") throw new Error("wrong kind");
    expect(made.payload.value.kind).toEqual({ kind: "literal", value: "All done" });
    expect(made.payload.isHidden).toBe(true);
    expect(made.payload.frame).toEqual(el.payload.frame);
    const test = made.payload.rules[0]!.cases[0]!.when.tests[0]!;
    expect(test.value.kind).toEqual({ kind: "listStat", layer: el.payload.id, stat: "count" });
    expect(test.comparison).toEqual({ kind: "equals", value: literal("0") });
    expect(made.payload.rules[0]!.cases[0]!.then[0]!.kind).toBe("show");
  });

  it("says what the list is of", () => {
    const { cfg, el } = withList((p) => { p.source = { kind: "calendar", entities: [], hours: 24 }; });
    const id = addEmptyState(cfg, el.payload.id, "rectangular")!;
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    expect(made.kind === "text" && made.payload.value.kind).toEqual({ kind: "literal", value: "No events" });
  });

  it("writes a document the audit accepts", () => {
    const { cfg, el } = withList();
    addEmptyState(cfg, el.payload.id, "rectangular");
    const doc = encodeConfig(cfg);
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(encodeConfig(parseConfig(doc))).toEqual(doc);
  });
});

describe("the list_items fetch", () => {
  const CAL = { entityId: "calendar.home", displayName: "Home", domain: "calendar" };

  it("asks for one entry per distinct list, keyed the way the reply comes back", () => {
    const { cfg } = withList((p) => { p.source = { kind: "calendar", entities: [CAL], hours: 24 }; p.rows = 3; });
    const { requests, signature } = listItemsRequests(cfg);
    expect(Object.keys(requests)).toEqual(["calendar|calendar.home|24"]);
    expect(requests["calendar|calendar.home|24"]).toEqual({
      source: "calendar", entities: ["calendar.home"], hours: 24, limit: 3,
    });
    expect(signature).toBe(JSON.stringify(requests));
  });

  it("asks for nothing at all for a Jinja source, which rides the value document", () => {
    const { cfg } = withList();
    expect(listItemsRequests(cfg).requests).toEqual({});
  });

  it("folds a reply into the text the resolver parses, and drops a failed key", () => {
    const items = collectListResults({
      "calendar|calendar.home|24": { ok: true, items: [{ title: "Stand-up" }], total: 4 },
      "todo|todo.shopping|open|list": { ok: false, error: "no such service" },
    });
    expect(items.get("calendar|calendar.home|24")).toBe(`{"items":[{"title":"Stand-up"}],"total":4}`);
    expect(items.has("todo|todo.shopping|open|list")).toBe(false);
  });
});

describe("the list presets", () => {
  const listPresets = LAYER_PRESETS.filter((p) => p.group === "list");
  const CALENDAR = { entityId: "calendar.home", displayName: "Home", domain: "calendar" };

  it("is the nine the plan named", () => {
    expect(listPresets.map((p) => p.title)).toEqual([
      "Next events", "To-do", "Hourly forecast", "Daily forecast",
      "Lights on", "Low batteries", "Recent activity", "Scenes grid", "Who is home",
    ]);
  });

  it("is offered on the wide face and the Home Screen tiles only", () => {
    for (const preset of listPresets) {
      expect(preset.families).toEqual(["rectangular", "small", "medium", "large", "xlarge"]);
    }
    expect(familyAllowsKind("rectangular", "list")).toBe(true);
    expect(familyAllowsKind("large", "list")).toBe(true);
    expect(familyAllowsKind("circular", "list")).toBe(false);
    expect(familyAllowsKind("corner", "list")).toBe(false);
    expect(familyAllowsKind("inline", "list")).toBe(false);
    expect(familyAllowsKind("circular", "text")).toBe(true);
  });

  for (const preset of listPresets) {
    it(`builds ${preset.title} as one list with a working row`, () => {
      const cfg = newConfig("Preset", 0);
      cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
      const id = applyPreset(cfg, preset.kind, CALENDAR, { family: "rectangular" });
      const made = cfg.elements.find((e) => e.payload.id === id)!;
      expect(made.kind).toBe("list");
      if (made.kind !== "list") throw new Error("wrong kind");
      expect(made.payload.template.length).toBeGreaterThan(0);
      expect(made.payload.template.length).toBeLessThanOrEqual(LIST_MAX_TEMPLATE);
      for (const row of made.payload.template) {
        expect(LIST_ROW_KINDS).toContain(row.kind);
      }
      // One layer of the shape, however many layers the row holds.
      expect(cfg.elements).toHaveLength(1);
      expect(cfg.perFamily.rectangular!.placements[id]).toBeDefined();
      const doc = encodeConfig(cfg);
      expect(auditUnknownKeys(doc)).toEqual([]);
      expect(encodeConfig(parseConfig(doc))).toEqual(doc);
      expect(schemaVersionFor(cfg)).toBe(8);
    });
  }

  it("gives the lights, the to-do list and the scenes a row tap aimed at the item", () => {
    const taps = (kind: Parameters<typeof applyPreset>[1]) => {
      const cfg = newConfig("Preset", 0);
      cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
      const id = applyPreset(cfg, kind, CALENDAR, { family: "rectangular" });
      const made = cfg.elements.find((e) => e.payload.id === id)!;
      if (made.kind !== "list") throw new Error("wrong kind");
      return made.payload.template.filter((r) => r.kind === "tap").map((r) => (r as Extract<CElement, { kind: "tap" }>).payload.action);
    };
    expect(taps("listLightsOn")).toEqual([{ type: "toggleEntity", entityId: "{item.entityId}", displayName: "", domain: "" }]);
    expect(taps("listScenes")).toEqual([{ type: "runScene", entityId: "{item.entityId}", displayName: "", domain: "" }]);
    const todo = taps("listTodo")[0]!;
    expect(todo.type).toBe("callService");
    if (todo.type !== "callService") throw new Error("wrong action");
    expect(todo.serviceDomain).toBe("todo");
    expect(todo.serviceName).toBe("update_item");
    expect(todo.serviceDataJSON).toContain("{item.uid}");
    expect(todo.serviceDataJSON).toContain("{item.listId}");
  });

  it("asks for an entity only where one is needed", () => {
    const needs = Object.fromEntries(listPresets.map((p) => [p.kind, p.needsEntity !== false]));
    expect(needs).toEqual({
      listEvents: true, listTodo: true, listHourly: true, listDaily: true,
      listLightsOn: false, listBatteries: false, listRecent: false, listScenes: false,
      listWhoHome: false,
    });
  });

  it("builds Low batteries as battery sensors, emptiest first, with a bar per row", () => {
    const cfg = newConfig("Preset", 0);
    cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    const id = applyPreset(cfg, "listBatteries", CALENDAR, { family: "rectangular" });
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    if (made.kind !== "list") throw new Error("wrong kind");
    expect(made.payload.rows).toBe(4);
    expect(made.payload.source).toEqual({
      kind: "entities",
      scope: { kind: "filter", domains: ["sensor"], areaIds: [], labelIds: [], floorIds: [] },
      deviceClass: "battery",
      sort: "state",
      descending: false,
      attributes: [],
    });
    const bar = made.payload.template.find((r) => r.kind === "shape");
    if (bar?.kind !== "shape") throw new Error("no bar");
    expect(bar.payload.level).toEqual({
      value: { kind: { kind: "item", field: "state" } },
      minValue: 0,
      maxValue: 100,
      direction: "right",
    });
    const texts = made.payload.template.filter((r) => r.kind === "text");
    expect(texts).toHaveLength(2);
    const doc = encodeConfig(cfg);
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(encodeConfig(parseConfig(doc))).toEqual(doc);
  });

  // The preset's own card draws three bands, and the preset shipped with one
  // flat color: every battery read the same whatever it held.
  it("colors the battery bar in three bands, by the reading on the row", () => {
    const cfg = newConfig("Preset", 0);
    cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    const id = applyPreset(cfg, "listBatteries", CALENDAR, { family: "rectangular" });
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    if (made.kind !== "list") throw new Error("wrong kind");
    const bar = made.payload.template.find((r) => r.kind === "shape");
    if (bar?.kind !== "shape") throw new Error("no bar");

    expect(bar.payload.rules).toHaveLength(1);
    const rule = bar.payload.rules[0]!;
    // Two rows and an otherwise, checked top to bottom: under 25, then under
    // 60, then everything left over.
    expect(rule.cases).toHaveLength(2);
    expect(rule.otherwise).toHaveLength(1);
    const thresholds = rule.cases.map((c) => {
      const comparison = c.when.tests[0]!.comparison;
      return comparison.kind === "lessThan" ? comparison.value?.kind : undefined;
    });
    expect(thresholds).toEqual([
      { kind: "literal", value: "25" },
      { kind: "literal", value: "60" },
    ]);
    // Every test reads the row's own state, not an entity, or one rule could
    // not color four different rows.
    for (const c of rule.cases) {
      expect(c.when.tests[0]!.value.kind).toEqual({ kind: "item", field: "state" });
    }
    // Three different colors, and the base is the one the otherwise sets, so a
    // row that matches nothing is not a fourth look.
    const colors = [
      ...rule.cases.map((c) => (c.then[0]!.value?.kind as { value?: string } | undefined)?.value),
      (rule.otherwise![0]!.value?.kind as { value?: string } | undefined)?.value,
    ];
    expect(new Set(colors).size).toBe(3);
    expect(bar.payload.colorSlot.baseColorHex).toBe(colors[2]);

    const doc = encodeConfig(cfg);
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(encodeConfig(parseConfig(doc))).toEqual(doc);
  });

  // A filter with no domain compiles to `[]` on both sides, so the preset drew
  // an empty face for everybody who added it.
  it("gives Recent activity domains to read", () => {
    const cfg = newConfig("Preset", 0);
    cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    const id = applyPreset(cfg, "listRecent", CALENDAR, { family: "rectangular" });
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    if (made.kind !== "list") throw new Error("wrong kind");
    const source = made.payload.source;
    if (source.kind !== "entities" || source.scope.kind !== "filter") throw new Error("wrong source");

    expect(source.scope.domains).toContain("binary_sensor");
    // Sensors are out on purpose: a power meter rewrites itself every few
    // seconds and would hold every row for ever.
    expect(source.scope.domains).not.toContain("sensor");
    expect(source.sort).toBe("lastChanged");
    expect(source.descending).toBe(true);

    // The compiled question has to read something. `[]` is what an empty scope
    // used to produce, and it can never return a row.
    const jinja = listExpression(source, made.payload.rows) ?? "";
    expect(jinja).toContain("states.binary_sensor");
    expect(jinja).not.toContain("{% for s in ([]) %}");

    // Each document owns its own list, so narrowing one never narrows the next.
    const other = newConfig("Preset", 0);
    other.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    const otherId = applyPreset(other, "listRecent", CALENDAR, { family: "rectangular" });
    const otherMade = other.elements.find((e) => e.payload.id === otherId)!;
    if (otherMade.kind !== "list") throw new Error("wrong kind");
    const otherSource = otherMade.payload.source;
    if (otherSource.kind !== "entities" || otherSource.scope.kind !== "filter") throw new Error("wrong source");
    expect(otherSource.scope.domains).not.toBe(source.scope.domains);

    const doc = encodeConfig(cfg);
    expect(auditUnknownKeys(doc)).toEqual([]);
    expect(encodeConfig(parseConfig(doc))).toEqual(doc);
  });

  it("puts the scenes in a two by two grid", () => {
    const cfg = newConfig("Preset", 0);
    cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
    const id = applyPreset(cfg, "listScenes", CALENDAR, { family: "rectangular" });
    const made = cfg.elements.find((e) => e.payload.id === id)!;
    if (made.kind !== "list") throw new Error("wrong kind");
    expect(made.payload.rows).toBe(4);
    expect(made.payload.columns).toBe(2);
    expect(made.payload.direction).toBe("down");
  });

  it("lays the two forecasts across the face", () => {
    for (const kind of ["listHourly", "listDaily"] as const) {
      const cfg = newConfig("Preset", 0);
      cfg.perFamily.rectangular ??= { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
      const id = applyPreset(cfg, kind, { entityId: "weather.home", displayName: "Home", domain: "weather" }, { family: "rectangular" });
      const made = cfg.elements.find((e) => e.payload.id === id)!;
      if (made.kind !== "list") throw new Error("wrong kind");
      expect(made.payload.direction).toBe("across");
      expect(made.payload.rows).toBe(kind === "listHourly" ? 6 : 5);
    }
  });
});
