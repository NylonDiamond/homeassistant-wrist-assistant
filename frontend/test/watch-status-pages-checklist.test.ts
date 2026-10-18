// A hand picked dynamic list's Edit Entities checklist and the filters on
// it, as a beta tester met them on the Low Battery page (2026-10-17): a
// tick flipped another entity than the one clicked, and Show all states
// seemed to do nothing while the watch said "Nothing to show now".

import { describe, expect, it } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import { type StatusPagesDocument, findStatusPage, findStatusRow, setStatusRowKey } from "../src/watch-status-pages/model.js";
import { readStatusRow } from "../src/watch-status-pages/rules.js";
import {
  type StatusPagesViewHost,
  entityChecklistOrder,
  renderStatusInspector,
  renderStatusPageScreen,
  selectStatusRow,
} from "../src/watch-status-pages/view.js";

/** A lit directive's result: `repeat(items, key, template)` or `live(v)`. */
interface Directive { _$litDirective$: unknown; values: unknown[] }
const isDirective = (v: unknown): v is Directive => v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v;
const isTemplate = (v: unknown): v is { strings: readonly string[]; values: unknown[] } =>
  v !== null && typeof v === "object" && "strings" in v && "values" in v;

/** A template flattened to text, `repeat` and `live` drawn as their values. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (isDirective(v)) {
    const [items, , template] = v.values;
    if (Array.isArray(items) && typeof template === "function") return items.map((it, i) => flat((template as (x: unknown, i: number) => unknown)(it, i))).join("");
    return flat(v.values[0]);
  }
  if (isTemplate(v)) return v.strings.map((s, i) => s + (i < v.values.length ? flat(v.values[i]) : "")).join("");
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** One drawn row of the checklist: its entity, its box's binding, its key. */
interface PickRow { id: string; checked: unknown; key: string; change: (e: Event) => void }

/** One row's template as a row, under `key` (none for a list not keyed). */
function pickRow(row: { strings: readonly string[]; values: unknown[] }, key: string): PickRow {
  return { id: String(row.values[4]), checked: row.values[0], key, change: row.values[2] as (e: Event) => void };
}

/** The checklist's rows, in order, from the inspector's template. */
function pickRows(v: unknown, out: PickRow[] = []): PickRow[] {
  if (Array.isArray(v)) v.forEach((x) => (isTemplate(x) && x.strings.join("").includes("sp-pick-row") ? out.push(pickRow(x, "")) : pickRows(x, out)));
  else if (isDirective(v)) {
    const [items, key, template] = v.values;
    if (Array.isArray(items) && typeof key === "function" && typeof template === "function") {
      for (const [i, item] of items.entries()) {
        const row = (template as (x: unknown, i: number) => unknown)(item, i);
        if (isTemplate(row) && row.strings.join("").includes("sp-pick-row")) {
          out.push(pickRow(row, String((key as (x: unknown) => unknown)(item))));
        } else pickRows(row, out);
      }
    }
  } else if (isTemplate(v)) v.values.forEach((x) => pickRows(x, out));
  return out;
}

/** What a box shows: the value its `live` binding sets. */
const boxOn = (row: PickRow): boolean => (isDirective(row.checked) ? row.checked.values[0] : row.checked) as boolean;

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as StatusPagesViewHost["icons"];

const battery = (name: string, level: string) => ({ state: level, attributes: { device_class: "battery", friendly_name: name, unit_of_measurement: "%" } });

// The tester's entities, two of them sharing one name.
const STATES = {
  "sensor.batterij_lekkagemelders": battery("Batterij Lekkagemelders", "85"),
  "sensor.batterij_regenton": battery("Batterij regenton", "70"),
  "sensor.batterij_rookmelders": battery("Batterij Rookmelders", "95"),
  "sensor.deur_batterij": battery("Deur Batterij", "60"),
  "sensor.deur_berging_2_battery_level": battery("Deur Battery", "55"),
  "sensor.deur_berging_battery_level": battery("Deur Battery", "50"),
  "sensor.keuken_battery": battery("Keuken Battery", "40"),
};

const PAGE = "00000000-0000-0000-0000-000000000005";
const ROW = "00000000-0000-0000-0001-000000000041";

/** The starter Low Battery page with its Batteries list switched to hand
 * picked: the max value of 20 it came with is still on it. */
function lowBattery(picked: string[]): StatusPagesDocument {
  return {
    statusPages: [{
      id: PAGE,
      name: "Low Battery",
      schemaVersion: 1,
      roundNumericValues: true,
      rows: [{
        id: ROW,
        rowType: "dynamicList",
        displayName: "Batteries",
        domain: "sensor",
        entityId: "",
        iconName: "battery.25percent",
        deviceClassFilter: ["battery"],
        dynamicMode: "specific",
        groupEntityIds: picked,
        maxNumericValue: 20,
        showAllStates: true,
      }],
    }],
  };
}

function host(document: StatusPagesDocument): StatusPagesViewHost {
  const h = {
    hass: { states: STATES } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    busy: false,
    uiState: new Map<string, unknown>(),
    screen: { width: 208, height: 248 },
    scale: 1,
    edit(change: (d: StatusPagesDocument) => StatusPagesDocument) {
      const next = change(h.document);
      if (next === h.document) return false;
      h.document = next;
      return true;
    },
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };
  return h;
}

const held = (h: StatusPagesViewHost): string[] => readStatusRow(findStatusRow(findStatusPage(h.document, PAGE), ROW)!).groupEntityIds ?? [];
const tick = (row: PickRow, on: boolean) => row.change({ target: { checked: on } } as unknown as Event);

describe("the Edit Entities checklist", () => {
  it("keeps its order while boxes are ticked, so the row under the pointer stays the same entity", () => {
    const h = host(lowBattery(["sensor.batterij_lekkagemelders", "sensor.batterij_regenton", "sensor.batterij_rookmelders"]));
    selectStatusRow(h, ROW);
    const before = pickRows(renderStatusInspector(h));
    const order = before.map((r) => r.id);
    expect(order.slice(0, 3)).toEqual(["sensor.batterij_lekkagemelders", "sensor.batterij_regenton", "sensor.batterij_rookmelders"]);
    expect(before.map(boxOn)).toEqual([true, true, true, false, false, false, false]);

    // Untick the first: it stays first, unticked, and nothing else moves.
    tick(before[0]!, false);
    let rows = pickRows(renderStatusInspector(h));
    expect(rows.map((r) => r.id)).toEqual(order);
    expect(rows.map(boxOn)).toEqual([false, true, true, false, false, false, false]);

    // Tick the last, then the one sharing its name: each lands on its own.
    tick(rows[6]!, true);
    rows = pickRows(renderStatusInspector(h));
    expect(rows.map((r) => r.id)).toEqual(order);
    const second = rows.findIndex((r) => r.id === "sensor.deur_berging_2_battery_level");
    tick(rows[second]!, true);
    rows = pickRows(renderStatusInspector(h));
    expect(rows.map((r) => r.id)).toEqual(order);
    expect(held(h).sort()).toEqual(["sensor.batterij_regenton", "sensor.batterij_rookmelders", "sensor.deur_berging_2_battery_level", "sensor.keuken_battery"]);
    for (const row of rows) expect(boxOn(row)).toBe(held(h).includes(row.id));
  });

  it("keys each row by its entity and binds its box live, so the drawn box never keeps a stale tick", () => {
    const h = host(lowBattery(["sensor.deur_batterij"]));
    selectStatusRow(h, ROW);
    const rows = pickRows(renderStatusInspector(h));
    expect(rows).toHaveLength(7);
    expect(rows.map((r) => r.key)).toEqual(rows.map((r) => r.id));
    for (const row of rows) expect(isDirective(row.checked)).toBe(true);
  });

  it("puts the picks on top again on the next visit to the row, and for a new search", () => {
    const h = host(lowBattery([]));
    selectStatusRow(h, ROW);
    const first = pickRows(renderStatusInspector(h));
    tick(first.find((r) => r.id === "sensor.keuken_battery")!, true);
    expect(pickRows(renderStatusInspector(h)).at(-1)?.id).toBe("sensor.keuken_battery");
    selectStatusRow(h, undefined);
    selectStatusRow(h, ROW);
    expect(pickRows(renderStatusInspector(h))[0]?.id).toBe("sensor.keuken_battery");

    expect(entityChecklistOrder(["a.x", "a.y", "a.z"], ["a.z"], "", (id) => id)).toEqual(["a.z", "a.x", "a.y"]);
    expect(entityChecklistOrder(["a.x", "a.y", "a.z"], ["a.z"], " Y ", (id) => id)).toEqual(["a.y"]);
    expect(entityChecklistOrder(["a.x", "a.y"], [], "deur", (id) => (id === "a.y" ? "Deur Battery" : id))).toEqual(["a.y"]);
  });
});

describe("a hand picked list's filters", () => {
  it("shows the max value it still holds, which the watch applies to a hand picked list too", () => {
    const h = host(lowBattery(["sensor.batterij_lekkagemelders", "sensor.batterij_regenton", "sensor.batterij_rookmelders"]));
    selectStatusRow(h, ROW);
    const text = flat(renderStatusInspector(h));
    expect(text).toContain("Max value (%)");
    expect(text).toContain("Either way, the max value below still applies.");
    // A sensor row has no Show State control, so the hint names the state.
    expect(text).toContain("Off: only those whose state is “on”.");
    expect(text).not.toContain("the state above");

    // Every battery is above 20%, so the watch has nothing to list, Show
    // all states or not.
    expect(flat(renderStatusPageScreen(h))).toContain("Nothing to show now");
    // Clearing the max value lists the three picks.
    h.edit((d) => setStatusRowKey(d, PAGE, ROW, "maxNumericValue", undefined));
    const preview = flat(renderStatusPageScreen(h));
    for (const name of ["Batterij Lekkagemelders", "Batterij regenton", "Batterij Rookmelders"]) expect(preview).toContain(name);
    expect(preview).not.toContain("Deur Battery");
    // Show all states off: a reading is never "on", so nothing again.
    h.edit((d) => setStatusRowKey(d, PAGE, ROW, "showAllStates", undefined));
    expect(flat(renderStatusPageScreen(h))).toContain("Nothing to show now");
  });

  it("keeps the max value away from a list that holds none and is not a sensor list", () => {
    const h = host({
      statusPages: [{
        id: PAGE, name: "Lights", schemaVersion: 1,
        rows: [{ id: ROW, rowType: "dynamicList", displayName: "Lights", domain: "light", entityId: "", iconName: "lightbulb", dynamicMode: "specific", groupEntityIds: [] }],
      }],
    });
    selectStatusRow(h, ROW);
    const text = flat(renderStatusInspector(h));
    expect(text).not.toContain("Max value");
    expect(text).toContain("Off: only those in the state above.");
  });
});
