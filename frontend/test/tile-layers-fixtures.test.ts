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
// templateKey, resolve, expected, devices, placed, halo.
//
// - `design`: `baseLayersDocument(tile)` with the estimate measurer, the
//   file's states and symbols that draw every filled variant (so an icon
//   layer carries the rule that fills it as One Look does), then `edit`
//   applied, then `encodeTileDesign`.
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
//   - `dragLayer` `{id, dx, dy}`: the layer dragged on the stage by that much
//     of the design box (`dragLayerFrame`, free of the tile's edges for the
//     glow, then `setLayerFrame`), so a base layer is owned, the State layer
//     takes its pill along and the icon or photo its glow.
//   - `own` `{role}` (an `owned` string): the role owned with its base layers
//     exactly as built, unmoved, its anchor kept. Owning `base.icon` (or
//     `base.photo`) owns the glyph's Glow layer and its `base.glow` anchor
//     with it, as the slot's companions.
// - The design starts with every role's anchor (`baseAnchors`), as
//   `designForEdit` holds them; only the owned roles' are written.
// - `template`: compiled from the layers the design draws only (owned base
//   layers and added layers); a base layer that follows the simple settings
//   is drawn natively and reads nothing.
// - `resolve`: the context `expected` is resolved in: the tile's own words
//   (`tileValuesFor`: the state line, its four parts and the name), each
//   entity the drawn layers read as the app builds a
//   `ComplicationEntityState`, and the template's rendered values by key.
// - `expected`: every layer the design draws itself (`drawnDesignDoc`: owned
//   base layers, added layers, tap zones) in draw order, resolved by the
//   panel's resolver: `id`, `kind`, then `text` for a text layer, `symbol`
//   and `colorHex` for an icon, `value` (the gauge's fill fraction, 0 to 1,
//   to 4 places) for a gauge, `opacity` for a shape whose resolved opacity
//   (its own times its rules') is not 1, to 4 places, and `hidden`. A text layer that draws parts
//   also lists them (`parts`: `text`, `fontSize`, `fontWeight`, `fontDesign`,
//   `colorHex`), resolved in the unplaced document. A design that owns
//   nothing and adds nothing draws nothing of its own: the native tile draws
//   it all.
// - `devices` (round two, section 13.5): null without anchors, else for the
//   watch (208) and the iPhone (402, the iPhone look) the tile's drawn size
//   and native parts (`tileNativeFramesOn`, the estimate measurer), to 4
//   places.
// - `placed`: null without `devices`, else per device the drawn document's
//   elements the anchor map places (`placeDesignDoc`), in draw order: `id`,
//   `frame`, then the sizes the map scales, as written, to 4 places.
// - `halo` (round three, section 14.10): the native glow of the reference
//   watch face, null when the face has no glyph: the setting read
//   (`oneLookGlyphGlowOf`, all four keys), the palette's surface, lit flag and
//   hue, the glyph's picture, icon, photo and disc flags with its size and
//   centre, and what is drawn (`oneLookGlyphHalo`: opacity, diameter and
//   colour, null when none is or the face draws a disc).

import { describe, expect, it } from "vitest";
import { html } from "lit";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { compile } from "../src/compiler.js";
import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { type CustomComplicationConfig, type Element, parseConfig, parseValue } from "../src/model.js";
import { type EntityState, resolveAll } from "../src/resolver.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import { oneLookMeasurer } from "../src/watch-pages/one-look/measurer.js";
import {
  type BaseLayerContext,
  type TileDesign,
  type TileZoneAction,
  type TileZonePreset,
  BASE_GLOW_ID,
  BASE_LAYER_IDS,
  BASE_STATE_PILL_ID,
  TILE_DESIGN_VERSION,
  addLayer,
  applyZonePreset,
  dragLayerFrame,
  drawnDesignDoc,
  setLayerFrame,
  encodeTileDesign,
  ownChangedBaseLayers,
  parseTileDesign,
  setZoneAction,
  tileTemplateKey,
  zonesOf,
} from "../src/watch-pages/tile-design.js";
import { TILE_NATIVE_SCREENS, baseAnchors, baseLayerFaceModel, baseLayersDocument, tileNativeFramesOn, tileValuesFor } from "../src/watch-pages/tile-base-layers.js";
import { oneLookGlyphGlowOf, oneLookGlyphHalo, oneLookHex } from "../src/watch-pages/one-look/colour.js";
import { oneLookCentredGlyph } from "../src/watch-pages/one-look/metrics.js";
import { type TileNativeFrames, type TilePartFrame, placeDesignDoc } from "../src/watch-pages/tile-anchors.js";
import { roleOfOwnedString, tileDesignBox } from "../src/watch-pages/tile-design.js";

const dir = join(__dirname, "fixtures-tiles");

type Op =
  | { op: "setLayer"; id: string; set: Record<string, unknown> }
  | { op: "addLayer"; kind: Element["kind"]; id: string; set: Record<string, unknown> }
  | { op: "zonePreset"; preset: TileZonePreset; ids: string[] }
  | { op: "zoneAction"; id: string; action: TileZoneAction }
  | { op: "dragLayer"; id: string; dx: number; dy: number }
  | { op: "own"; role: string };

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
const BED = { "light.bed": entity("light.bed", "on", { friendly_name: "Bed Light", brightness: 128 }) };

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
  {
    file: "09-light-pill-owned-icon-state.json",
    description: "A light at 6x4, on at 100%, with the Pill value style, its icon dragged a little right and its state dragged a little down and right on the stage: the Icon layer and the State layer with its pill are owned and drawn from the document (the filled bulb while on, the pill under the state), the name is still the native tile's.",
    tile: { id: "A1B2C3D4-0009-4000-8000-000000000009", entityId: "light.office", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", stateValueLabelStyle: "Pill" },
    states: { "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 255 }) },
    edit: [
      { op: "dragLayer", id: BASE_LAYER_IDS.icon, dx: 0.05, dy: 0 },
      { op: "dragLayer", id: BASE_LAYER_IDS.state, dx: 0.02, dy: 0.02 },
    ],
  },
  {
    file: "10-light-anchors-icon-moved.json",
    description: "A light at 6x4, on at 50%, Plain value style, its icon dragged down 0.08 of the design box and its state owned unmoved: the state lands exactly on the native state box on the watch and the iPhone, the icon off the native glyph by 0.08 of the box times the glyph's scale.",
    tile: { id: "A1B2C3D4-0010-4000-8000-000000000010", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" },
    states: BED,
    edit: [
      { op: "dragLayer", id: BASE_LAYER_IDS.icon, dx: 0, dy: 0.08 },
      { op: "own", role: "base.state" },
    ],
  },
  {
    file: "11-light-pill-owned-state-number.json",
    description: "The light of 10 with the Pill value style, its state owned unmoved: the pill and the State layer land exactly on the native state box on both devices, the figure bold rounded and the unit smaller and lighter.",
    tile: { id: "A1B2C3D4-0011-4000-8000-000000000011", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", stateValueLabelStyle: "Pill" },
    states: BED,
    edit: [{ op: "own", role: "base.state" }],
  },
  {
    file: "12-switch-owned-state-word.json",
    description: "A switch at 6x4, off, its state owned unmoved: the word Off in the word part, regular in the system face and the second ink, the number's parts empty.",
    tile: { id: "A1B2C3D4-0012-4000-8000-000000000012", entityId: "switch.kettle", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#34C759" },
    states: { "switch.kettle": entity("switch.kettle", "off", { friendly_name: "Kettle" }) },
    edit: [{ op: "own", role: "base.state" }],
  },
  {
    file: "13-light-glow-setting.json",
    description: "The Bed Light at 6x4, on at 50%, its glow set on, 180% across, 150% bright, in the tile's colour, nothing owned: the Glow layer follows the setting, dimmed by rule while the light is off.",
    tile: { id: "A1B2C3D4-0013-4000-8000-000000000013", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", iconGlow: { mode: "on", size: 180, brightness: 150, color: "tile" } },
    states: BED,
    edit: null,
  },
  {
    file: "14-light-owned-icon-glow.json",
    description: "The Bed Light with its icon dragged a little right: the glyph slot is owned, so the Glow layer is drawn from the document under the icon, moved with it, each placed by its own anchor.",
    tile: { id: "A1B2C3D4-0014-4000-8000-000000000014", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" },
    states: BED,
    edit: [{ op: "dragLayer", id: BASE_LAYER_IDS.icon, dx: 0.05, dy: 0 }],
  },
  {
    file: "15-light-glow-moved.json",
    description: "The Bed Light with only its Glow layer dragged down: the glyph slot is owned, the icon drawn from the document exactly on the native glyph, the glow off the native one.",
    tile: { id: "A1B2C3D4-0015-4000-8000-000000000015", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E" },
    states: BED,
    edit: [{ op: "dragLayer", id: BASE_GLOW_ID, dx: 0, dy: 0.05 }],
  },
  {
    file: "16-light-glow-off.json",
    description: "The Bed Light with its glow turned off and its icon owned unmoved: no Glow layer and no glow anchor, the icon alone drawn from the document.",
    tile: { id: "A1B2C3D4-0016-4000-8000-000000000016", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", iconGlow: { mode: "off" } },
    states: BED,
    edit: [{ op: "own", role: "base.icon" }],
  },
  {
    file: "17-light-off-glow-on.json",
    description: "The Bed Light off with its glow set on and its icon owned unmoved: the gray off tile glows at the resting opacity, the Glow layer dimmed to it by rule.",
    tile: { id: "A1B2C3D4-0017-4000-8000-000000000017", entityId: "light.bed", colSpan: 6, rowSpan: 4, gridCol: 0, gridRow: 0, color: "#F2AE4E", iconGlow: { mode: "on" } },
    states: { "light.bed": entity("light.bed", "off", { friendly_name: "Bed Light" }) },
    edit: [{ op: "own", role: "base.icon" }],
  },
];

const measurer = oneLookMeasurer("watch", { estimate: true });
const phoneMeasurer = oneLookMeasurer("phone", { estimate: true });

/** The symbols the fixtures are built with: every name draws, filled
 * variants included, and crossed out forms only for the bulb. */
const icons: IconProvider = {
  render: (name) => (name.includes(".slash") && !name.startsWith("lightbulb.slash") ? undefined : html``),
  available: () => true,
  names: () => [],
};

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
    case "dragLayer": {
      const el = design.doc.elements.find((e) => e.payload.id === op.id);
      if (el === undefined) throw new Error(`no layer ${op.id}`);
      return setLayerFrame(design, op.id, dragLayerFrame(el.payload.frame, "move", op.dx, op.dy, op.id === BASE_GLOW_ID));
    }
    case "own": {
      const role = roleOfOwnedString(op.role);
      if (role === undefined) throw new Error(`no role ${op.role}`);
      return design.owned.includes(role) ? design : { ...design, owned: [...design.owned, role] };
    }
  }
}

const r4 = (v: number): number => Math.round(v * 10000) / 10000;

/** A native part as the fixtures write it, to 4 places. */
function partJson(part: TilePartFrame): Record<string, unknown> {
  const out: Record<string, unknown> = {
    rect: { x: r4(part.rect.x), y: r4(part.rect.y), width: r4(part.rect.width), height: r4(part.rect.height) },
    size: r4(part.size),
  };
  if (part.textSize !== undefined) out.textSize = r4(part.textSize);
  if (part.unitSize !== undefined) out.unitSize = r4(part.unitSize);
  if (part.tailSize !== undefined) out.tailSize = r4(part.tailSize);
  return out;
}

function nativeJson(native: TileNativeFrames): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const role of ["icon", "photo", "name", "state", "glow"] as const) {
    const part = native[role];
    if (part !== undefined) out[role] = partJson(part);
  }
  return out;
}

/** An element the map placed, as the fixtures write it: its id and frame,
 * then each size the map scales that the element has, to 4 places. */
function placedJson(el: Element): Record<string, unknown> {
  const f = el.payload.frame;
  const out: Record<string, unknown> = { id: el.payload.id, frame: { x: r4(f.x), y: r4(f.y), width: r4(f.width), height: r4(f.height) } };
  if (el.kind === "text") {
    out.fontSize = r4(el.payload.fontSize);
    const own = (el.payload.parts ?? []).filter((p) => p.fontSize !== undefined);
    if (own.length > 0) out.parts = own.map((p) => ({ id: p.id, fontSize: r4(p.fontSize!) }));
  }
  if (el.kind === "icon") out.size = r4(el.payload.size);
  if (el.kind === "image" || el.kind === "shape") out.cornerRadius = r4(el.payload.cornerRadius);
  if (el.kind === "shape") {
    out.borderWidth = r4(el.payload.borderWidth);
    out.thickness = r4(el.payload.thickness);
  }
  const shadow = el.payload.shadow;
  if (shadow !== undefined) out.shadow = { radius: r4(shadow.radius), dx: r4(shadow.dx), dy: r4(shadow.dy) };
  return out;
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
  const ctx: BaseLayerContext = { states: c.states, measurer, phoneMeasurer, icons };
  let design: TileDesign = { v: TILE_DESIGN_VERSION, doc: baseLayersDocument(c.tile, ctx), owned: [], anchors: baseAnchors(c.tile, ctx), zones: {} };
  for (const op of c.edit ?? []) design = runEdit(c.tile, design, op);
  const encoded = encodeTileDesign(design);
  const read = parseTileDesign(encoded)!;
  const template = read.template ?? null;
  const values = tileValuesFor(c.tile, ctx);
  const drawn = drawnDesignDoc(read.doc, read.owned);
  const entityStates = entityStatesFor(drawn, c.states);
  const templateResults: Record<string, string> = {};
  for (const [key, expr] of [...compile(drawn).expressions].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const hit = Object.entries(c.rendered ?? {}).find(([start]) => expr.startsWith(start));
    if (hit === undefined) throw new Error(`no rendered value for ${expr}`);
    templateResults[key] = hit[1];
  }
  const resolved = resolveAll(drawn, {
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
  const expected = drawn.elements.map((el) => {
    const r = resolved.find((x) => x.id === el.payload.id);
    const out: Record<string, unknown> = { id: el.payload.id, kind: el.kind };
    if (r?.kind === "text") out.text = r.text;
    if (r?.kind === "text" && r.parts !== undefined) {
      out.parts = r.parts.map((p) => ({ text: p.text, fontSize: p.fontSize, fontWeight: p.fontWeight, fontDesign: p.fontDesign, colorHex: p.colorHex }));
    }
    if (r?.kind === "icon") {
      out.symbol = r.symbol;
      out.colorHex = r.colorHex;
    }
    if (r?.kind === "gauge") out.value = Math.round(r.fraction * 10000) / 10000;
    if (r?.kind === "shape" && r4(r.opacity) !== 1) out.opacity = r4(r.opacity);
    out.hidden = r === undefined ? true : r.isHidden;
    return out;
  });
  let devices: Record<string, unknown> | null = null;
  let placed: Record<string, unknown> | null = null;
  if (encoded.anchors !== undefined) {
    devices = {};
    placed = {};
    const box = tileDesignBox(Number(c.tile.colSpan), Number(c.tile.rowSpan));
    for (const device of ["watch", "phone"] as const) {
      const on = tileNativeFramesOn(c.tile, ctx, device);
      if (on === undefined) throw new Error(`no ${device} face`);
      devices[device] = {
        screenWidth: TILE_NATIVE_SCREENS[device],
        drawnSize: { width: r4(on.drawnSize.width), height: r4(on.drawnSize.height) },
        native: nativeJson(on.native),
      };
      const doc = placeDesignDoc(drawn, read.anchors, on.native, on.drawnSize, box);
      placed[device] = doc.elements.filter((el, i) => el !== drawn.elements[i]).map(placedJson);
    }
  }
  return {
    description: c.description,
    tile: c.tile,
    states: c.states,
    edit: c.edit,
    design: encoded,
    template,
    templateKey: template === null ? null : tileTemplateKey(template),
    resolve: { tileState: values.state, tileStateParts: values.stateParts, tileName: values.name, entityStates, templateResults },
    expected,
    devices,
    placed,
    halo: haloJson(c.tile, ctx),
  };
}

/** The native glow of the reference watch face (section 14.10). */
function haloJson(tile: WatchPageTile, ctx: BaseLayerContext): Record<string, unknown> | null {
  const model = baseLayerFaceModel(tile, ctx);
  if (model === undefined || !(model.layout.discRect.width > 0)) return null;
  const glow = oneLookGlyphGlowOf(tile.iconGlow);
  const { layout, palette } = model;
  const glyph = { picture: model.picture !== "none", hasIcon: model.baseIcon !== "", photo: model.photo !== undefined };
  const halo = oneLookGlyphHalo(palette, { centred: oneLookCentredGlyph("watch"), ...glyph }, glow);
  const disc = layout.discRect;
  return {
    setting: {
      mode: glow.mode,
      size: glow.size,
      brightness: glow.brightness,
      color: glow.colour.kind === "custom" ? oneLookHex(glow.colour.rgb) : glow.colour.kind,
    },
    palette: { surface: palette.surface, isLit: palette.isLit, hue: palette.hue === undefined ? null : oneLookHex(palette.hue) },
    glyph: { ...glyph, drawsDisc: layout.drawsDisc, glyphSize: r4(layout.glyphSize), center: { x: r4(disc.x + disc.width / 2), y: r4(disc.y + disc.height / 2) } },
    drawn: halo === undefined || layout.drawsDisc ? null : { opacity: r4(halo.opacity), diameter: r4(r4(layout.glyphSize) * halo.share), colorHex: oneLookHex(halo.rgb) },
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
      const fresh = baseLayersDocument(c.tile, { states: c.states, measurer, icons });
      for (const el of fresh.elements) {
        const role = el.payload.id === BASE_STATE_PILL_ID ? "state" : el.payload.id === BASE_GLOW_ID ? "glow" : Object.entries(BASE_LAYER_IDS).find(([, id]) => id === el.payload.id)![0];
        const owned = (r: string) => fixture.design.owned.includes(`base.${r}`);
        if (role === "glow" ? owned("icon") || owned("photo") : owned(role)) continue;
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
    // Nothing owned and nothing added: the native tile draws every part, and
    // the design draws nothing of its own and computes nothing.
    for (const file of ["01-light-medium.json", "02-person-photo-small.json", "03-sensor-large.json", "04-switch-extra-small.json", "08-light-no-label.json"]) {
      expect(by(file).expected, file).toEqual([]);
      expect(by(file).template, file).toBeNull();
    }
    expect(by("03-sensor-large.json").resolve.tileState).toBe("21.5°C");
    const name = by("05-light-owned-name.json");
    expect(name.design.owned).toEqual(["base.name"]);
    expect(name.expected).toEqual([{ id: BASE_LAYER_IDS.name, kind: "text", text: "Office", hidden: false }]);
    const added = by("06-person-added-layers.json");
    expect(added.template).not.toBeNull();
    expect(added.templateKey).toBe(tileTemplateKey(added.template!));
    expect(added.expected.map((e) => e.id)).toEqual([BATTERY_TEXT, BATTERY_GAUGE]);
    expect(added.expected.find((e) => e.id === BATTERY_TEXT)?.text).toBe("71%");
    expect(Object.keys(by("07-switch-zones.json").design.zones)).toEqual([ZONE_LEFT, ZONE_RIGHT]);
    expect(by("07-switch-zones.json").expected.map((e) => e.kind)).toEqual(["tap", "tap"]);
    // The Pill light: the filled bulb while on, the pill under the state,
    // the name left to the native tile.
    const pill = by("09-light-pill-owned-icon-state.json");
    expect(pill.design.owned).toEqual(["base.icon", "base.state"]);
    expect(pill.expected.map((e) => e.id)).toEqual([BASE_GLOW_ID, BASE_LAYER_IDS.icon, BASE_STATE_PILL_ID, BASE_LAYER_IDS.state]);
    expect(pill.expected[0]).toMatchObject({ kind: "shape", hidden: false });
    expect(pill.expected[1]).toMatchObject({ kind: "icon", symbol: "lightbulb.fill" });
    expect(pill.expected[2]).toMatchObject({ kind: "shape", hidden: false });
    expect(pill.expected[3]).toMatchObject({ kind: "text", text: "100%" });
    expect(pill.template).toBeNull();
  });

  it("places owned parts on the native ones on both devices (round two)", () => {
    type Rect = { x: number; y: number; width: number; height: number };
    interface Round2 {
      design: { owned: string[]; anchors?: Record<string, Rect & { size: number }> };
      resolve: { tileStateParts: Record<string, string> };
      expected: { id: string; parts?: { text: string; fontWeight: string; fontDesign: string; colorHex: string }[] }[];
      devices: Record<string, { drawnSize: { width: number; height: number }; native: Record<string, { rect: Rect; size: number }> }> | null;
      placed: Record<string, { id: string; frame: Rect; size?: number }[]> | null;
    }
    const by = (file: string) => JSON.parse(readFileSync(join(dir, file), "utf8")) as Round2;
    // Where a placed frame lands in the drawn tile, in points.
    const drawnRect = (c: Round2, device: string, frame: Rect, tile: WatchPageTile): Rect => {
      const box = tileDesignBox(Number(tile.colSpan), Number(tile.rowSpan));
      const slot = c.devices![device]!.drawnSize;
      const f = Math.min(slot.width / box.width, slot.height / box.height);
      const ox = (slot.width - box.width * f) / 2;
      const oy = (slot.height - box.height * f) / 2;
      return { x: ox + frame.x * box.width * f, y: oy + frame.y * box.height * f, width: frame.width * box.width * f, height: frame.height * box.height * f };
    };
    const near = (a: Rect, b: Rect, what: string) => {
      for (const k of ["x", "y", "width", "height"] as const) expect(Math.abs(a[k] - b[k]), `${what} ${k}`).toBeLessThan(0.02);
    };
    // Without anchors nothing is placed.
    for (const file of ["01-light-medium.json", "06-person-added-layers.json", "07-switch-zones.json"]) {
      expect(by(file).devices, file).toBeNull();
      expect(by(file).placed, file).toBeNull();
    }
    expect(Object.keys(by("05-light-owned-name.json").design.anchors ?? {})).toEqual(["base.name"]);
    expect(Object.keys(by("09-light-pill-owned-icon-state.json").design.anchors ?? {})).toEqual(["base.glow", "base.icon", "base.state"]);

    // 10: the state unmoved lands exactly on the native state box; the icon
    // moved down 0.08 of the box lands that far below the native glyph,
    // scaled by the glyph.
    const moved = CASES.find((c) => c.file === "10-light-anchors-icon-moved.json")!;
    const ten = by(moved.file);
    expect(ten.design.owned).toEqual(["base.icon", "base.state"]);
    for (const device of ["watch", "phone"]) {
      const native = ten.devices![device]!.native;
      const placedIcon = ten.placed![device]!.find((p) => p.id === BASE_LAYER_IDS.icon)!;
      const icon = drawnRect(ten, device, placedIcon.frame, moved.tile);
      const kPos = native.icon!.size / ten.design.anchors!["base.icon"]!.size;
      near(icon, { ...native.icon!.rect, y: native.icon!.rect.y + 0.08 * 66 * kPos }, `${device} icon`);
      // The move is the same share of the glyph on both devices.
      expect((icon.y - native.icon!.rect.y) / native.icon!.rect.height).toBeCloseTo(0.08 * 66 / 34.52, 2);
      const state = ten.placed![device]!.find((p) => p.id === BASE_LAYER_IDS.state)!;
      const at = drawnRect(ten, device, state.frame, moved.tile);
      near({ ...at, width: native.state!.rect.width }, native.state!.rect, `${device} state`);
    }

    // 11: the pill and the State layer exactly on the native state box.
    const pillCase = CASES.find((c) => c.file === "11-light-pill-owned-state-number.json")!;
    const eleven = by(pillCase.file);
    expect(eleven.resolve.tileStateParts).toEqual({ figure: "50", unit: "%", tail: "", word: "" });
    for (const device of ["watch", "phone"]) {
      for (const id of [BASE_STATE_PILL_ID, BASE_LAYER_IDS.state]) {
        const p = eleven.placed![device]!.find((x) => x.id === id)!;
        near(drawnRect(eleven, device, p.frame, pillCase.tile), eleven.devices![device]!.native.state!.rect, `${device} ${id}`);
      }
    }
    const number = eleven.expected.find((e) => e.id === BASE_LAYER_IDS.state)!.parts!;
    expect(number.map((p) => p.text)).toEqual(["50", "%", "", ""]);
    expect(number[0]).toMatchObject({ fontWeight: "bold", fontDesign: "rounded" });
    expect(number[1]).toMatchObject({ fontWeight: "semibold", fontDesign: "rounded" });

    // 12: a word in the word part, regular in the system face.
    const twelve = by("12-switch-owned-state-word.json");
    expect(twelve.resolve.tileStateParts).toEqual({ figure: "", unit: "", tail: "", word: "Off" });
    const word = twelve.expected.find((e) => e.id === BASE_LAYER_IDS.state)!.parts!;
    expect(word.map((p) => p.text)).toEqual(["", "", "", "Off"]);
    expect(word[3]).toMatchObject({ fontWeight: "regular", fontDesign: "default" });
  });
  it("draws the glyph's glow by the setting and owns it with the glyph (round three)", () => {
    type Rect = { x: number; y: number; width: number; height: number };
    interface Shape { id: string; frame: Rect; opacity?: number; colorSlot: { baseColorHex: string }; rules: { cases: { when: { tests: { comparison: { kind: string } }[] }; then: { number: number }[] }[]; otherwise?: { number: number }[] }[]; fill: { stops: { colorHex: string }[] } }
    interface Round3 {
      design: { owned: string[]; anchors?: Record<string, Rect & { size: number }>; doc: { elements: { kind: string; payload: Shape }[] } };
      expected: { id: string; kind: string; opacity?: number }[];
      devices: Record<string, { drawnSize: { width: number; height: number }; native: Record<string, { rect: Rect; size: number }> }> | null;
      placed: Record<string, { id: string; frame: Rect }[]> | null;
      halo: { glyph: { glyphSize: number }; drawn: { opacity: number; diameter: number; colorHex: string } | null } | null;
    }
    const by = (file: string) => JSON.parse(readFileSync(join(dir, file), "utf8")) as Round3;
    const glowOf = (c: Round3) => c.design.doc.elements.find((e) => e.payload.id === BASE_GLOW_ID)?.payload;
    const drawnRect = (c: Round3, device: string, frame: Rect): Rect => {
      const box = tileDesignBox(6, 4);
      const slot = c.devices![device]!.drawnSize;
      const f = Math.min(slot.width / box.width, slot.height / box.height);
      const ox = (slot.width - box.width * f) / 2;
      const oy = (slot.height - box.height * f) / 2;
      return { x: ox + frame.x * box.width * f, y: oy + frame.y * box.height * f, width: frame.width * box.width * f, height: frame.height * box.height * f };
    };
    const centre = (r: Rect) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });

    // 13: the setting followed, nothing owned.
    const thirteen = by("13-light-glow-setting.json");
    const g13 = glowOf(thirteen)!;
    expect(thirteen.design.owned).toEqual([]);
    expect(thirteen.expected).toEqual([]);
    expect(g13.fill.stops.map((s) => s.colorHex)).toEqual(["#F2AE4E", "#F2AE4E00"]);
    expect(g13.opacity).toBe(0.48);
    expect(g13.rules[0]!.cases.map((c) => c.when.tests[0]!.comparison.kind)).toEqual(["isOn"]);
    expect(g13.rules[0]!.cases[0]!.then[0]!.number).toBe(1);
    expect(g13.rules[0]!.otherwise![0]!.number).toBe(0.4375);
    expect(thirteen.halo!.drawn).toMatchObject({ opacity: 0.48, colorHex: "#F2AE4E" });
    expect(thirteen.halo!.drawn!.diameter).toBeCloseTo(1.8 * thirteen.halo!.glyph.glyphSize, 3);

    // 14: the icon dragged takes the glow along; both drawn, each by its own anchor.
    const fourteen = by("14-light-owned-icon-glow.json");
    expect(fourteen.design.owned).toEqual(["base.icon"]);
    expect(Object.keys(fourteen.design.anchors!)).toEqual(["base.glow", "base.icon"]);
    expect(fourteen.expected.map((e) => [e.id, e.kind, e.opacity])).toEqual([[BASE_GLOW_ID, "shape", 0.32], [BASE_LAYER_IDS.icon, "icon", undefined]]);
    for (const device of ["watch", "phone"]) {
      const native = fourteen.devices![device]!.native.glow!;
      const kPos = native.size / fourteen.design.anchors!["base.glow"]!.size;
      const at = drawnRect(fourteen, device, fourteen.placed![device]!.find((p) => p.id === BASE_GLOW_ID)!.frame);
      expect(at.width).toBeCloseTo(native.size * 1.5, 1);
      expect(centre(at).x - centre(native.rect).x).toBeCloseTo(0.05 * 100.5 * kPos, 1);
      expect(centre(at).y - centre(native.rect).y).toBeCloseTo(0, 1);
    }
    // The iPhone's unmoved glow is the native 1.5 x 76.51.
    expect(fourteen.devices!.phone!.native.glow!.size * 1.5).toBeCloseTo(114.77, 1);

    // 15: the glow alone dragged; the icon exactly on the native glyph.
    const fifteen = by("15-light-glow-moved.json");
    expect(fifteen.design.owned).toEqual(["base.icon"]);
    for (const device of ["watch", "phone"]) {
      const native = fifteen.devices![device]!.native;
      const icon = drawnRect(fifteen, device, fifteen.placed![device]!.find((p) => p.id === BASE_LAYER_IDS.icon)!.frame);
      for (const k of ["x", "y", "width", "height"] as const) expect(Math.abs(icon[k] - native.icon!.rect[k]), `${device} icon ${k}`).toBeLessThan(0.02);
      const kPos = native.glow!.size / fifteen.design.anchors!["base.glow"]!.size;
      const at = drawnRect(fifteen, device, fifteen.placed![device]!.find((p) => p.id === BASE_GLOW_ID)!.frame);
      expect(centre(at).y - centre(native.glow!.rect).y).toBeCloseTo(0.05 * 66 * kPos, 1);
      expect(centre(at).x - centre(native.glow!.rect).x).toBeCloseTo(0, 1);
    }

    // 16: the glow off: no layer, no anchor, the icon alone.
    const sixteen = by("16-light-glow-off.json");
    expect(glowOf(sixteen)).toBeUndefined();
    expect(Object.keys(sixteen.design.anchors!)).toEqual(["base.icon"]);
    expect(sixteen.expected.map((e) => e.id)).toEqual([BASE_LAYER_IDS.icon]);
    expect(sixteen.halo!.drawn).toBeNull();

    // 17: an off light glowing with the mode on.
    const seventeen = by("17-light-off-glow-on.json");
    const g17 = glowOf(seventeen)!;
    expect(g17.opacity).toBe(0.32);
    expect(g17.rules[0]!.cases.map((c) => c.when.tests[0]!.comparison.kind)).toEqual(["isOn"]);
    expect(g17.rules[0]!.otherwise![0]!.number).toBe(0.4375);
    expect(seventeen.expected.map((e) => [e.id, e.opacity])).toEqual([[BASE_GLOW_ID, 0.14], [BASE_LAYER_IDS.icon, undefined]]);
    expect(seventeen.halo!.drawn).toMatchObject({ opacity: 0.14, colorHex: "#FFFFFF" });
  });
});
