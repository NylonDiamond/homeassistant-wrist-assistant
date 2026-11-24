// The starter page a new iPhone gets, pinned for the integration's signed
// `starter_page_make` (app repo docs/magic_setup_2026-11.md, "The page").
// Home Assistant builds that page itself
// (`custom_components/wrist_assistant/starter_page.py`), so each tile must
// stay what the panel's Add tile makes (`newWatchEntityTile`, placed by
// `addNewWatchTile` on a `newWatchPage`), and the entities it picks must
// follow the home map's waiting rule (`waiting.ts`). `tests/fixtures/
// starter_page/starter_page.json` holds both, written from the panel's own
// functions; this test fails when they drift from it, and
// `tests/test_starter_page.py` fails when the Python page does. Rebuild it
// with `WA_UPDATE_FIXTURES=1 npx vitest run test/starter-page-fixture.test.ts`,
// then bring `starter_page.py` in step.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { HOME_MAP_MAIN_DOMAINS, homeMapWaitKind, homeMapWaitOrder } from "../src/home-map/waiting.js";
import { newWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";
import { addNewWatchTile, newWatchEntityTile, watchEntityAddFromHass, type WatchHassView } from "../src/watch-pages/tile-new.js";

const FIXTURE = join(__dirname, "..", "..", "tests", "fixtures", "starter_page", "starter_page.json");

/** An entity as the integration's `areas_get` reads it (`home_entities`):
 * `name` is the friendly name, else the entity id. */
interface Row {
  id: string;
  name: string;
  area_id: string | null;
  entity_category: string | null;
  hidden: boolean;
  device_class: string | null;
  disabled?: boolean;
}
interface Floor {
  id: string;
  name: string;
  level: number | null;
}
interface Area {
  id: string;
  name: string;
  floor_id: string | null;
}

const SWITCH_DOMAINS = ["switch", "input_boolean"];
const FIRST_PASS = 3;
const MAX_TILES = 12;

const row = (id: string, name: string, area: string | null, extra: Partial<Row> = {}): Row => ({
  id,
  name,
  area_id: area,
  entity_category: null,
  hidden: false,
  device_class: null,
  ...extra,
});

const domainOf = (id: string) => id.slice(0, id.indexOf(".") < 0 ? id.length : id.indexOf("."));

/** The rule of "The page", written out over the panel's waiting rule. */
function picked(floors: Floor[], areas: Area[], entities: Row[]): Row[] {
  const usable = (e: Row, domains: readonly string[]) =>
    e.disabled !== true &&
    homeMapWaitKind({ entityId: e.id, name: e.name, category: e.entity_category, hidden: e.hidden }) !== undefined &&
    domains.includes(domainOf(e.id));
  const mains = entities.filter((e) => usable(e, HOME_MAP_MAIN_DOMAINS)).length;
  const domains = mains < 2 ? [...HOME_MAP_MAIN_DOMAINS, ...SWITCH_DOMAINS] : HOME_MAP_MAIN_DOMAINS;
  const byCode = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  const floorOrder = floors
    .slice()
    .sort(
      (a, b) =>
        Number(a.level === null) - Number(b.level === null) ||
        (a.level ?? 0) - (b.level ?? 0) ||
        byCode(a.name.toLowerCase(), b.name.toLowerCase()) ||
        byCode(a.id, b.id),
    )
    .map((f) => f.id);
  const floorRank = (id: string | null) => (id !== null && floorOrder.includes(id) ? floorOrder.indexOf(id) : floorOrder.length);
  const areaOrder = areas
    .slice()
    .sort(
      (a, b) =>
        floorRank(a.floor_id) - floorRank(b.floor_id) ||
        byCode(a.name.toLowerCase(), b.name.toLowerCase()) ||
        byCode(a.id, b.id),
    )
    .map((a) => a.id);
  const keys: (string | null)[] = [...areaOrder, null];
  const groups = new Map<string | null, Row[]>(keys.map((k) => [k, []]));
  for (const e of entities) {
    if (!usable(e, domains)) continue;
    groups.get(e.area_id !== null && areaOrder.includes(e.area_id) ? e.area_id : null)!.push(e);
  }
  for (const list of groups.values()) list.sort((a, b) => homeMapWaitOrder({ entityId: a.id, name: a.name }, { entityId: b.id, name: b.name }));
  const taken = new Map<string | null, number>();
  let total = 0;
  for (const k of keys) {
    const n = Math.min(FIRST_PASS, groups.get(k)!.length, MAX_TILES - total);
    taken.set(k, n);
    total += n;
  }
  for (const k of keys) {
    const n = Math.min(groups.get(k)!.length - taken.get(k)!, MAX_TILES - total);
    taken.set(k, taken.get(k)! + n);
    total += n;
  }
  return keys.flatMap((k) => groups.get(k)!.slice(0, taken.get(k)!));
}

/** The frontend's `hass` for these rows: every state id, each row's
 * friendly name (none when it is the id) and device class. */
function hassOf(entities: Row[], stateIds: string[]): WatchHassView {
  const states: Record<string, { state: string; attributes: Record<string, unknown> }> = {};
  for (const id of stateIds) states[id] = { state: "on", attributes: {} };
  for (const e of entities) {
    const attributes: Record<string, unknown> = {};
    if (e.name !== e.id) attributes.friendly_name = e.name;
    if (e.device_class !== null) attributes.device_class = e.device_class;
    states[e.id] = { state: "on", attributes };
  }
  return { states };
}

/** The page as the panel builds it: a new page named Home, then each entity
 * added through Add tile, ids handed out in order. */
function panelPage(pageId: string, tileIds: string[], rows: Row[], hass: WatchHassView): unknown {
  const id = pageId.toUpperCase();
  let document: WatchPagesDocument = { schemaVersion: 1, pages: [newWatchPage(id, "Home")] };
  const ids = tileIds.slice();
  for (const r of rows) {
    const result = addNewWatchTile(document, id, { kind: "entity", ...watchEntityAddFromHass(hass, r.id) }, { newId: () => ids.shift()! });
    expect(result.refusal).toBeUndefined();
    document = result.document;
  }
  return (document.pages as unknown[])[0];
}

const FLOORS: Floor[] = [
  { id: "upstairs", name: "Upstairs", level: 1 },
  { id: "loft", name: "Loft", level: null },
  { id: "ground", name: "Ground floor", level: 0 },
];
const AREAS: Area[] = [
  { id: "bedroom", name: "Bedroom", floor_id: "upstairs" },
  { id: "garage", name: "Garage", floor_id: null },
  { id: "living", name: "living room", floor_id: "ground" },
  { id: "kitchen", name: "Kitchen", floor_id: "ground" },
  { id: "attic", name: "Attic", floor_id: "upstairs" },
  { id: "studio", name: "Studio", floor_id: "loft" },
];
const HOME: Row[] = [
  // Kitchen: five main, three on the first pass, one more on the fill.
  row("light.kitchen_ceiling", "Kitchen Ceiling", "kitchen"),
  row("light.counter", "counter lights", "kitchen"),
  row("light.pendant", "Pendant", "kitchen"),
  row("cover.kitchen_blind", "Kitchen Blind", "kitchen"),
  row("climate.kitchen", "Kitchen Heat", "kitchen"),
  row("light.kitchen_hidden", "Hidden Light", "kitchen", { hidden: true }),
  row("light.kitchen_status", "Status Light", "kitchen", { entity_category: "diagnostic" }),
  row("light.kitchen_old", "Old Light", "kitchen", { disabled: true }),
  row("sensor.kitchen_temp", "Kitchen Temperature", "kitchen"),
  row("switch.kettle", "Kettle", "kitchen"),
  // Living room: a TV that stands in for its remote, an Apple TV.
  row("media_player.living_room_tv", "Living Room TV", "living", { device_class: "tv" }),
  row("media_player.apple_tv_den", "Den Apple TV", "living", { device_class: "tv" }),
  row("light.floor_lamp", "Floor Lamp", "living"),
  row("fan.ceiling", "Ceiling Fan", "living"),
  row("lock.front_door", "Front Door", "living"),
  // Bedroom: a TV with a remote of its own, a light with no name.
  row("media_player.bedroom_tv", "Bedroom TV", "bedroom", { device_class: "tv" }),
  row("remote.bedroom_tv", "Bedroom TV Remote", "bedroom"),
  row("light.bedside_lamp", "light.bedside_lamp", "bedroom"),
  row("cover.garage_door", "Garage Door", "garage"),
  // No area, and an area Home Assistant does not list.
  row("light.shed", "Shed", "gone"),
  row("vacuum.robot", "Robot", null),
];

const SMALL: Row[] = [
  row("light.only", "Only Light", "office"),
  row("switch.desk_fan", "Desk Fan", "office"),
  row("input_boolean.guest_mode", "Guest Mode", "office"),
  row("switch.heater", "Heater", null),
  row("switch.hidden_plug", "Hidden Plug", null, { hidden: true }),
  row("camera.door", "Door", null),
  row("sensor.power", "Power", "office"),
];

const NOTHING: Row[] = [
  row("sensor.temp", "Temperature", null),
  row("light.hidden", "Hidden", null, { hidden: true }),
  row("switch.config", "Config", null, { entity_category: "config" }),
  row("camera.porch", "Porch", null),
];

/** `n` tile ids of one case: the case number, then the tile's, lower case on purpose (both sides write ids upper case). */
const ids = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${String(i + 1).padStart(11, "0")}`);

const CASES = [
  { name: "home", floors: FLOORS, areas: AREAS, entities: HOME, state_ids: [] as string[] },
  { name: "small home", floors: [] as Floor[], areas: [{ id: "office", name: "Office", floor_id: null }], entities: SMALL, state_ids: [] as string[] },
  { name: "nothing to show", floors: [] as Floor[], areas: [] as Area[], entities: NOTHING, state_ids: [] as string[] },
];

/** One tile per look the table has, built alone at the first spot. */
const LOOKS: Row[] = [
  ...[
    "light",
    "cover",
    "fan",
    "climate",
    "media_player",
    "lock",
    "vacuum",
    "humidifier",
    "water_heater",
    "alarm_control_panel",
    "valve",
    "switch",
    "input_boolean",
  ].map((d) => row(`${d}.sample_thing`, `${d}.sample_thing`, null)),
  row("media_player.tv", "TV", null, { device_class: "tv" }),
  row("media_player.Apple_Lounge", "Apple Lounge", null, { device_class: "tv" }),
  row("media_player.apple_speaker", "Apple Speaker", null, { device_class: "speaker" }),
  row("media_player.has_remote", "Has Remote", null, { device_class: "tv" }),
  row("light.tv2go_strip", "light.tv2go_strip", null),
  row("light.o'brien_reading", "", null),
  row("switch.café_plug", "switch.café_plug", null),
  row("light.ünïcode_ßensor", "light.ünïcode_ßensor", null),
];
const LOOK_STATE_IDS = ["remote.has_remote"];

/** Sorted keys at every level, two space indent, one newline at the end. */
function fixtureText(value: unknown): string {
  const sorted = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sorted);
    if (typeof v === "object" && v !== null) {
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(v).sort()) out[key] = sorted((v as Record<string, unknown>)[key]);
      return out;
    }
    return v;
  };
  return `${JSON.stringify(sorted(value), null, 2)}\n`;
}

function built(): unknown {
  const cases = CASES.map((c, n) => {
    const pageId = `5a1d2e3f-4a5b-4c6d-8e7f-00000000000${n + 1}`;
    const tileIds = ids(`5a1d2e3f-4a5b-4c6d-8e7f-${n + 1}`, MAX_TILES);
    const rows = picked(c.floors, c.areas, c.entities);
    const hass = hassOf(c.entities, c.state_ids);
    return {
      ...c,
      page_id: pageId,
      tile_ids: tileIds,
      picked: rows.map((r) => r.id),
      page: rows.length === 0 ? null : panelPage(pageId, tileIds, rows, hass),
    };
  });
  const hass = hassOf(LOOKS, LOOK_STATE_IDS);
  const tiles = LOOKS.map((r, n) => {
    const tileId = `5a1d2e3f-4a5b-4c6d-8e7f-9${String(n + 1).padStart(11, "0")}`;
    return { row: r, tile_id: tileId, tile: newWatchEntityTile(watchEntityAddFromHass(hass, r.id), newWatchPage("P", "Home"), { newId: () => tileId }) };
  });
  return { cases, tiles, tile_state_ids: LOOK_STATE_IDS };
}

describe("the starter page starter_page_make builds", () => {
  it("is the panel's Add tile on a new page named Home, byte for byte", () => {
    const text = fixtureText(built());
    if (process.env.WA_UPDATE_FIXTURES === "1") writeFileSync(FIXTURE, text);
    expect(readFileSync(FIXTURE, "utf8")).toBe(text);
  });

  it("picks by area in floor order, three each, then fills to twelve", () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, "utf8")) as { cases: { name: string; picked: string[] }[] };
    const [home, small, nothing] = fixture.cases;
    expect(home!.picked).toEqual([
      "light.counter",
      "light.kitchen_ceiling",
      "light.pendant",
      "cover.kitchen_blind",
      "light.floor_lamp",
      "fan.ceiling",
      "media_player.apple_tv_den",
      "light.bedside_lamp",
      "media_player.bedroom_tv",
      "cover.garage_door",
      "light.shed",
      "vacuum.robot",
    ]);
    expect(small!.picked).toEqual(["light.only", "switch.desk_fan", "input_boolean.guest_mode", "switch.heater"]);
    expect(nothing!.picked).toEqual([]);
  });

  it("places two tiles a row, 6 by 4, with the TV remote look", () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, "utf8")) as {
      cases: { page: { name: string; pageTitleIcon: string; items: { gridCol: number; gridRow: number; colSpan: number; rowSpan: number; icon?: string }[] } | null }[];
    };
    const page = fixture.cases[0]!.page!;
    expect(page.name).toBe("Home");
    expect(page.pageTitleIcon).toBe("house");
    expect(page.items.map((t) => [t.gridCol, t.gridRow, t.colSpan, t.rowSpan])).toEqual(
      page.items.map((_, i) => [(i % 2) * 6, Math.floor(i / 2) * 4, 6, 4]),
    );
    expect(page.items[6]!.icon).toBe("appletv");
    expect(page.items[8]!.icon).toBe("play.circle");
  });
});
