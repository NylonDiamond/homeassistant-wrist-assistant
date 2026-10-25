// The shared tile layer fixtures (app repo docs/tile_layers_contract_2026-10.md,
// section 9): a tile, its states, the design the panel writes for it, the
// template and its key, and what every layer resolves to.
//
// `fixtures-tiles` is a copy of the app repo's `WristAssistantTests/
// Fixtures/tiles`. As for every shared fixture folder, the app's copy is
// canonical once it exists: the app repo's `scripts/sync-complication-fixtures.sh`
// checks the pair, and `--push` copies the app's files over these. The panel
// builds them, so a change starts here: rebuild them with
// `WA_UPDATE_FIXTURES=1 npx vitest run test/tile-layers-fixtures.test.ts`,
// copy them into the app, and check the pair with the script. Without the
// variable this test proves the files are what the panel builds now, byte for
// byte, so `baseLayers` and the files cannot drift apart.
//
// Each file is `NN-name.json`, two space indent and a closing newline, keys in
// the contract's order: description, tile, states, edit, design, template,
// templateKey, resolve, expected.
//
// - `design`: `baseLayersDocument(tile)` with the estimate measurer and the
//   file's states, then `edit` applied, then `encodeTileDesign`.
// - `edit`: null, or the operations run in order on the design, each written
//   as `{"op": ...}`:
//   - `setLayer` `{id, set}`: the layer's fields set to `set` (a `value`
//     is a value as the wire writes it), as an edit in the layer editor does,
//     so a base layer is owned (`ownChangedBaseLayers`).
//   - `addLayer` `{kind, id, set}`: a new layer of `kind` (`addLayer`) with
//     the id given, then `set` as for `setLayer`.
//   - `zonePreset` `{preset, ids}`: the tile split by the preset
//     (`applyZonePreset`), its zones given these ids in order.
//   - `zoneAction` `{id, action}`: one zone's action (`setZoneAction`).
// - `resolve`: the context `expected` is resolved in: the tile's own words
//   (`tileValuesFor`), each entity the document reads as the app builds a
//   `ComplicationEntityState`, and the template's rendered values by key.
// - `expected`: every layer in draw order, resolved by the panel's resolver:
//   `id`, `kind`, then `text` for a text layer, `symbol` and `colorHex` for an
//   icon, `value` (the gauge's fill fraction, 0 to 1, to 4 places) for a gauge,
//   and `hidden`.

import { describe, expect, it } from "vitest";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { compile } from "../src/compiler.js";
import type { HassEntityState } from "../src/ha-api.js";
import { type CustomComplicationConfig, type Element, parseConfig, parseValue } from "../src/model.js";
import { type EntityState, resolveAll } from "../src/resolver.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import {
  type BaseLayerContext,
  type TileDesign,
  type TileZoneAction,
  type TileZonePreset,
  BASE_LAYER_IDS,
  TILE_DESIGN_VERSION,
  addLayer,
  applyZonePreset,
  encodeTileDesign,
  ownChangedBaseLayers,
  parseTileDesign,
  setZoneAction,
  tileTemplateKey,
  zonesOf,
} from "../src/watch-pages/tile-design.js";
import { baseLayersDocument, tileValuesFor } from "../src/watch-pages/tile-base-layers.js";

const dir = join(__dirname, "fixtures-tiles");

type Op =
  | { op: "setLayer"; id: string; set: Record<string, unknown> }
  | { op: "addLayer"; kind: Element["kind"]; id: string; set: Record<string, unknown> }
  | { op: "zonePreset"; preset: TileZonePreset; ids: string[] }
  | { op: "zoneAction"; id: string; action: TileZoneAction };

interface Case {
  file: string;
  description: string;
  tile: WatchPageTile;
  states: Record<string, HassEntityState>;
  edit: Op[] | null;
  /** What Home Assistant renders for each computed value, by the start of
   * its expression. */
  rendered?: Record<string, string>;
}

function entity(entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" };
}

const BATTERY_TEXT = "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A11";
const BATTERY_GAUGE = "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A12";
const ZONE_LEFT = "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A01";
const ZONE_RIGHT = "6F1C2A1E-0B7D-4C55-9E0B-2B9B0D7C1A02";

const OFFICE = { "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 209 }) };

const CASES: Case[] = [
  {
    file: "01-light-medium.json",
    description: "A light at 6x4, on at 82%.",
    tile: { id: "A1B2C3D4-0001-4000-8000-000000000001", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" },
    states: OFFICE,
    edit: null,
  },
  {
    file: "02-person-photo-small.json",
    description: "A person at 4x4, home, showing their photo.",
    tile: { id: "A1B2C3D4-0002-4000-8000-000000000002", entityId: "person.chen", colSpan: 4, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#5E8FD0", usePersonPhoto: true },
    states: { "person.chen": entity("person.chen", "home", { friendly_name: "Chen", entity_picture: "/api/image/serve/chen/512x512" }) },
    edit: null,
  },
  {
    file: "03-sensor-large.json",
    description: "A temperature sensor at 12x4 reading 21.5 °C.",
    tile: { id: "A1B2C3D4-0003-4000-8000-000000000003", entityId: "sensor.living_temperature", colSpan: 12, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#FF9500" },
    states: { "sensor.living_temperature": entity("sensor.living_temperature", "21.5", { friendly_name: "Living room", unit_of_measurement: "°C", device_class: "temperature" }) },
    edit: null,
  },
  {
    file: "04-switch-extra-small.json",
    description: "A switch at 3x3, off.",
    tile: { id: "A1B2C3D4-0004-4000-8000-000000000004", entityId: "switch.kettle", colSpan: 3, rowSpan: 3, gridCol: 0, gridRow: 0, color: "#34C759" },
    states: { "switch.kettle": entity("switch.kettle", "off", { friendly_name: "Kettle" }) },
    edit: null,
  },
  {
    file: "05-light-owned-name.json",
    description: "The light of 01 with its Name layer moved and set to 12 pt bold, so base.name is owned.",
    tile: { id: "A1B2C3D4-0005-4000-8000-000000000005", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" },
    states: OFFICE,
    edit: [{ op: "setLayer", id: BASE_LAYER_IDS.name, set: { fontSize: 12, fontWeight: "bold", frame: { x: 0.06, y: 0.62, width: 0.88, height: 0.24, rotationDegrees: 0 } } }],
  },
  {
    file: "06-person-added-layers.json",
    description: "A person at 6x4 with two added layers: a text reading another entity's attribute (so the design has a template) and a gauge of that entity's state.",
    tile: { id: "A1B2C3D4-0006-4000-8000-000000000006", entityId: "person.chen", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#5E8FD0" },
    states: {
      "person.chen": entity("person.chen", "not_home", { friendly_name: "Chen" }),
      "sensor.chen_phone_battery": entity("sensor.chen_phone_battery", "64", { friendly_name: "Chen phone battery", unit_of_measurement: "%", device_class: "battery", battery_level: 71 }),
    },
    edit: [
      {
        op: "addLayer", kind: "text", id: BATTERY_TEXT,
        set: {
          value: { kind: { kind: "entityAttribute", entityId: "sensor.chen_phone_battery", displayName: "Chen phone battery", domain: "sensor", attribute: "battery_level" }, format: { suffix: "%" } },
          fontSize: 11, frame: { x: 0.55, y: 0.1, width: 0.4, height: 0.2, rotationDegrees: 0 },
        },
      },
      {
        op: "addLayer", kind: "gauge", id: BATTERY_GAUGE,
        set: {
          value: { kind: { kind: "entityState", entityId: "sensor.chen_phone_battery", displayName: "Chen phone battery", domain: "sensor" } },
          frame: { x: 0.7, y: 0.35, width: 0.25, height: 0.38, rotationDegrees: 0 },
        },
      },
    ],
    rendered: { "state_attr('sensor.chen_phone_battery', 'battery_level')": "71" },
  },
  {
    file: "07-switch-zones.json",
    description: "A switch at 6x4, on, split Left · Right: the left zone toggles, the right runs a script after asking first.",
    tile: { id: "A1B2C3D4-0007-4000-8000-000000000007", entityId: "switch.porch", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#34C759" },
    states: { "switch.porch": entity("switch.porch", "on", { friendly_name: "Porch" }) },
    edit: [
      { op: "zonePreset", preset: "leftRight", ids: [ZONE_LEFT, ZONE_RIGHT] },
      { op: "zoneAction", id: ZONE_LEFT, action: { action: "toggle" } },
      {
        op: "zoneAction", id: ZONE_RIGHT,
        action: { action: "triggerEntity", triggerTarget: { entityId: "script.ring_chen", mode: "run", friendlyName: "Ring Chen's phone" }, requiresConfirmation: true },
      },
    ],
  },
  {
    file: "08-light-no-label.json",
    description: "The light of 01 with Show label off: no Name layer.",
    tile: { id: "A1B2C3D4-0008-4000-8000-000000000008", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", showLabel: false },
    states: OFFICE,
    edit: null,
  },
];

const measurer = oneLookMeasurer("watch", { estimate: true });

/** A layer's fields set as an edit in the layer editor sets them. */
function setFields(el: Element, set: Record<string, unknown>): void {
  const payload = el.payload as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(set)) payload[key] = key === "value" ? parseValue(value) : structuredClone(value);
}

function withElements(design: TileDesign, elements: Element[]): TileDesign {
  return { ...design, doc: { ...design.doc, elements } };
}

function runEdit(tile: WatchPageTile, design: TileDesign, op: Op): TileDesign {
  switch (op.op) {
    case "setLayer": {
      const doc = structuredClone(design.doc);
      const el = doc.elements.find((e) => e.payload.id === op.id);
      if (el === undefined) throw new Error(`no layer ${op.id}`);
      setFields(el, op.set);
      return ownChangedBaseLayers(design, { ...design, doc });
    }
    case "addLayer": {
      const { design: added, id } = addLayer(design, op.kind);
      if (id === "") throw new Error(`refused ${op.kind}`);
      const elements = structuredClone(added.doc.elements);
      const el = elements.find((e) => e.payload.id === id)!;
      el.payload.id = op.id;
      setFields(el, op.set);
      return withElements(added, elements);
    }
    case "zonePreset": {
      const split = applyZonePreset(tile, design, op.preset);
      const old = zonesOf(split).map((z) => z.id);
      const rename = new Map(old.map((id, i) => [id, op.ids[i]!]));
      const elements = split.doc.elements.map((e) => (rename.has(e.payload.id) ? ({ ...e, payload: { ...e.payload, id: rename.get(e.payload.id)! } } as Element) : e));
      const zones: Record<string, TileZoneAction> = {};
      for (const [id, action] of Object.entries(split.zones)) zones[rename.get(id) ?? id] = action;
      return { ...withElements(split, elements), zones };
    }
    case "zoneAction":
      return setZoneAction(design, op.id, op.action);
  }
}

/** Each entity a document reads, as the app's `ComplicationEntityState`. */
function entityStatesFor(doc: CustomComplicationConfig, states: Record<string, HassEntityState>) {
  return [...compile(doc).entities.keys()].sort().map((entityId) => {
    const e = states[entityId];
    const attr = (k: string) => (typeof e?.attributes[k] === "string" ? (e.attributes[k] as string) : null);
    return {
      entityId,
      displayName: attr("friendly_name") ?? entityId,
      state: e?.state ?? "unknown",
      unitOfMeasurement: attr("unit_of_measurement"),
      deviceClass: attr("device_class"),
      domain: entityId.split(".")[0]!,
    };
  });
}

function build(c: Case): Record<string, unknown> {
  const ctx: BaseLayerContext = { states: c.states, measurer };
  let design: TileDesign = { v: TILE_DESIGN_VERSION, doc: baseLayersDocument(c.tile, ctx), owned: [], zones: {} };
  for (const op of c.edit ?? []) design = runEdit(c.tile, design, op);
  const encoded = encodeTileDesign(design);
  const read = parseTileDesign(encoded)!;
  const template = read.template ?? null;
  const values = tileValuesFor(c.tile, ctx);
  const entityStates = entityStatesFor(read.doc, c.states);
  const templateResults: Record<string, string> = {};
  for (const [key, expr] of [...compile(read.doc).expressions].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const hit = Object.entries(c.rendered ?? {}).find(([start]) => expr.startsWith(start));
    if (hit === undefined) throw new Error(`no rendered value for ${expr}`);
    templateResults[key] = hit[1];
  }
  const resolved = resolveAll(read.doc, {
    entityStates: new Map<string, EntityState>(entityStates.map((s) => [s.entityId, {
      entityId: s.entityId, state: s.state, iconName: "", domain: s.domain,
      ...(s.unitOfMeasurement === null ? {} : { unitOfMeasurement: s.unitOfMeasurement }),
    }])),
    templateResults: new Map(Object.entries(templateResults)),
    namedValues: read.doc.values,
    tileValues: values,
    locale: "en-US",
    timeZone: "UTC",
  }).rectangular?.elements ?? [];
  const expected = read.doc.elements.map((el) => {
    const r = resolved.find((x) => x.id === el.payload.id);
    const out: Record<string, unknown> = { id: el.payload.id, kind: el.kind };
    if (r?.kind === "text") out.text = r.text;
    if (r?.kind === "icon") {
      out.symbol = r.symbol;
      out.colorHex = r.colorHex;
    }
    if (r?.kind === "gauge") out.value = Math.round(r.fraction * 10000) / 10000;
    out.hidden = r === undefined ? true : r.isHidden;
    return out;
  });
  return {
    description: c.description,
    tile: c.tile,
    states: c.states,
    edit: c.edit,
    design: encoded,
    template,
    templateKey: template === null ? null : tileTemplateKey(template),
    resolve: { tileState: values.state, tileName: values.name, entityStates, templateResults },
    expected,
  };
}

const text = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

describe("tile layer fixtures", () => {
  if (process.env.WA_UPDATE_FIXTURES === "1") {
    mkdirSync(dir, { recursive: true });
    for (const c of CASES) writeFileSync(join(dir, c.file), text(build(c)));
  }

  it("has exactly the cases the panel builds", () => {
    expect(readdirSync(dir).filter((f) => f.endsWith(".json")).sort()).toEqual(CASES.map((c) => c.file));
  });

  for (const c of CASES) {
    it(`${c.file} is what the panel builds now, byte for byte`, () => {
      expect(readFileSync(join(dir, c.file), "utf8")).toBe(text(build(c)));
    });
  }

  it("the base layers in each file are baseLayersDocument's, owned ones aside", () => {
    for (const c of CASES) {
      const fixture = JSON.parse(readFileSync(join(dir, c.file), "utf8")) as { design: { owned: string[]; doc: unknown } };
      const doc = parseConfig(fixture.design.doc);
      const fresh = baseLayersDocument(c.tile, { states: c.states, measurer });
      for (const el of fresh.elements) {
        const role = Object.entries(BASE_LAYER_IDS).find(([, id]) => id === el.payload.id)![0];
        if (fixture.design.owned.includes(`base.${role}`)) continue;
        expect(doc.elements.find((e) => e.payload.id === el.payload.id), `${c.file} ${role}`).toEqual(el);
      }
    }
  });

  it("covers the cases the contract names", () => {
    const by = (file: string) => JSON.parse(readFileSync(join(dir, file), "utf8")) as {
      design: { owned: string[]; zones: Record<string, unknown> }; template: string | null; templateKey: string | null;
      resolve: { tileState: string; tileName: string }; expected: { id: string; kind: string; text?: string; symbol?: string; hidden: boolean }[];
    };
    const light = by("01-light-medium.json");
    expect(light.resolve).toMatchObject({ tileState: "82%", tileName: "Office" });
    expect(light.expected.map((e) => e.kind)).toEqual(["icon", "text", "text"]);
    expect(light.expected.find((e) => e.id === BASE_LAYER_IDS.state)?.text).toBe("82%");
    expect(by("02-person-photo-small.json").expected[0]).toMatchObject({ id: BASE_LAYER_IDS.photo, kind: "image" });
    expect(by("03-sensor-large.json").resolve.tileState).toBe("21.5°C");
    expect(by("05-light-owned-name.json").design.owned).toEqual(["base.name"]);
    const added = by("06-person-added-layers.json");
    expect(added.template).not.toBeNull();
    expect(added.templateKey).toBe(tileTemplateKey(added.template!));
    expect(added.expected.find((e) => e.id === BATTERY_TEXT)?.text).toBe("71%");
    expect(Object.keys(by("07-switch-zones.json").design.zones)).toEqual([ZONE_LEFT, ZONE_RIGHT]);
    expect(by("08-light-no-label.json").expected.some((e) => e.id === BASE_LAYER_IDS.name)).toBe(false);
  });
});
