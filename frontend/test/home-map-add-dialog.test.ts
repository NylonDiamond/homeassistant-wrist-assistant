// The map editor's Add dialog and the edit behind its furniture: a new
// piece standing with its back to the nearest free wall, facing into the
// room (sliding past a thing in its way, never into a doorway, under a
// window only when it is low, over a thing only when the two share no
// height, against a wall anyway when nowhere is clear, in the room's middle
// when it hangs from the ceiling, is a rug or fits no wall); and the dialog
// itself, opened by ＋ Add and the key A, closed by Escape and Close, its
// devices by area and kind, a light going through the lamp chooser into the
// picked room, any other device placed there or picked when it is on the
// map, Place all by area, and its furniture added into the picked room, the
// room under the middle of the view, or one picked in the dialog.
//
// The element is made and driven directly, as `home-map-lamp-editor.test.ts`
// does, with Home Assistant stood in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import {
  HOME_MAP_ADD_ALL_AREAS,
  HOME_MAP_ADD_NO_AREA,
  homeMapAddAreaChips,
  homeMapAddCandidates,
  homeMapAddKindOf,
  homeMapAddSections,
} from "../src/home-map/add-dialog.js";
import { homeMapDevices } from "../src/home-map/devices-model.js";
import {
  addPiece,
  addPieceByWall,
  homeMapFreeWallSpot,
  homeMapObjectAxes,
  homeMapPieceStandsFree,
} from "../src/home-map/edit-ops.js";
import { homeMapPiece } from "../src/home-map/furniture.js";
import { homeBoxCorners, homeBoxOf } from "../src/home-map/geometry.js";
import { WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import { type HomeMapDocument, type HomeMapObject, type HomeMapRoom, checkHomeMap, homeMapFloorName, homeMapPinRoom } from "../src/home-map/model.js";
import { forgetHomeMap, setHomeMapCapable } from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const LOCK = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";

const piece = (id: string) => {
  const p = homeMapPiece(id);
  if (p === undefined) throw new Error(`no piece ${id}`);
  return p;
};

/** The edit's result, checked as the store checks it, and the input left
 * as it was. */
function done(before: HomeMapDocument, after: HomeMapDocument | undefined): HomeMapDocument {
  expect(after).toBeDefined();
  const text = JSON.stringify(before);
  const out = checkHomeMap(after);
  if (!out.ok) throw new Error(out.message);
  expect(JSON.stringify(out.doc)).toBe(JSON.stringify(after));
  expect(JSON.stringify(before)).toBe(text);
  return after!;
}

/** The fixture with its living room made an empty 4 by 4 m square with
 * four walls, then changed as given. */
function square(change: (room: HomeMapRoom) => void = () => undefined): HomeMapDocument {
  const doc = fixture();
  const room = doc.floors[0]!.rooms[0]!;
  room.outline = [[0, 0], [4, 0], [4, 4], [0, 4]];
  room.walls = [
    { a: [0, 0], b: [4, 0], t: 0.1 },
    { a: [4, 0], b: [4, 4], t: 0.1 },
    { a: [4, 4], b: [0, 4], t: 0.1 },
    { a: [0, 4], b: [0, 0], t: 0.1 },
  ];
  room.openings = [];
  room.objects = [];
  change(room);
  return doc;
}

const living = (doc: HomeMapDocument) => doc.floors[0]!.rooms.find((r) => r.id === LIVING)!;
const newest = (doc: HomeMapDocument, roomId = LIVING) => doc.floors[0]!.rooms.find((r) => r.id === roomId)!.objects.at(-1)!;
const thing = (kind: string, c: [number, number], size: [number, number, number], extra: Partial<HomeMapObject> = {}): HomeMapObject => ({ kind, c, size, turn: 0, ...extra });

/** Whether two things' boxes overlap by more than a centimetre. */
function boxesOverlap(a: HomeMapObject, b: HomeMapObject): boolean {
  const shrink = (o: HomeMapObject) => homeBoxCorners({ ...homeBoxOf(o), width: o.size[0] - 0.02, depth: o.size[1] - 0.02 });
  const p = shrink(a);
  const q = shrink(b);
  for (const shape of [p, q]) {
    for (let i = 0; i < shape.length; i += 1) {
      const s = shape[i]!;
      const t = shape[(i + 1) % shape.length]!;
      const n = [s[1] - t[1], t[0] - s[0]];
      const span = (pts: number[][]) => pts.map((v) => v[0]! * n[0]! + v[1]! * n[1]!);
      const sp = span(p);
      const sq = span(q);
      if (Math.max(...sp) <= Math.min(...sq) || Math.max(...sq) <= Math.min(...sp)) return false;
    }
  }
  return true;
}

describe("a new piece against the nearest free wall", () => {
  it("stands with its back to the wall nearest the point, its front facing into the room", () => {
    const cases: [readonly [number, number], [number, number], number][] = [
      [[2, 1], [2, 0.3], 0],
      [[2, 3], [2, 3.7], 180],
      [[3, 2], [3.7, 2], -90],
      [[1, 2], [0.3, 2], 90],
    ];
    for (const [near, c, turn] of cases) {
      const before = square();
      const after = done(before, addPieceByWall(before, LIVING, piece("bookcaseClosed"), [near[0], near[1]]));
      const added = newest(after);
      expect(added).toEqual({ kind: "storage", model: "bookcaseClosed", c, size: [0.8, 0.5, 1.7], turn });
      // Its front (the model's +z, the thing's v) points at the room's middle.
      const { v } = homeMapObjectAxes(added);
      expect(v[0] * (2 - c[0]) + v[1] * (2 - c[1])).toBeGreaterThan(0);
    }
  });

  it("slides along the wall past a thing in its way", () => {
    const before = square((r) => { r.objects = [thing("storage", [2.2, 0.3], [1, 0.5, 0.9])]; });
    const after = done(before, addPieceByWall(before, LIVING, piece("bookcaseClosed"), [2, 1]));
    const added = newest(after);
    expect(added.c[0]).toBeCloseTo(1.3, 2);
    expect(added.c[1]).toBeCloseTo(0.3, 2);
    expect(added.turn).toBe(0);
    expect(boxesOverlap(added, living(after).objects[0]!)).toBe(false);
  });

  it("never stands in a doorway or the floor in front of it", () => {
    const before = square((r) => { r.openings = [{ kind: "door", a: [1.6, 0], b: [2.4, 0], z0: 0, z1: 2.05 }]; });
    const added = newest(done(before, addPieceByWall(before, LIVING, piece("bookcaseClosed"), [1.9, 1])));
    expect(added.c).toEqual([1.2, 0.3]);
    expect(added.c[0] + 0.4).toBeLessThanOrEqual(1.6);
  });

  it("goes under a window when it is low, and beside it when it is tall", () => {
    const withWindow = () => square((r) => { r.openings = [{ kind: "window", a: [1, 0], b: [3, 0], z0: 0.9, z1: 2.1 }]; });
    const low = newest(done(withWindow(), addPieceByWall(withWindow(), LIVING, piece("sideTable"), [2, 1])));
    expect(low.c[0]).toBeCloseTo(2, 2);
    expect(low.c[1]).toBeLessThan(0.5);
    const tall = newest(done(withWindow(), addPieceByWall(withWindow(), LIVING, piece("bookcaseClosed"), [1.8, 1])));
    expect(tall.c).toEqual([0.6, 0.3]);
    expect(tall.c[0] + 0.4 <= 1 || tall.c[0] - 0.4 >= 3).toBe(true);
  });

  it("stands a table lamp over a low cabinet, but beside a sofa it would stand in", () => {
    const cabinet = square((r) => { r.objects = [thing("storage", [2, 0.3], [1, 0.5, 0.6])]; });
    const over = newest(done(cabinet, addPieceByWall(cabinet, LIVING, piece("lampRoundTable"), [2, 1])));
    expect(over.c[0]).toBeCloseTo(2, 2);
    expect(over.lift).toBe(0.75);
    const sofa = square((r) => { r.objects = [thing("sofa", [2, 0.3], [1, 0.5, 0.94])]; });
    const beside = newest(done(sofa, addPieceByWall(sofa, LIVING, piece("lampRoundTable"), [2, 1])));
    expect(Math.abs(beside.c[0] - 2)).toBeGreaterThanOrEqual(0.64);
    // A rug never stands in the way.
    const rug = square((r) => { r.objects = [thing("rug", [2, 0.6], [3, 1.2, 0.01])]; });
    expect(newest(done(rug, addPieceByWall(rug, LIVING, piece("bookcaseClosed"), [2, 1]))).c).toEqual([2, 0.3]);
    // Nor a hidden thing.
    const hidden = square((r) => { r.objects = [thing("storage", [2, 0.3], [1, 0.5, 0.9], { hidden: true })]; });
    expect(newest(done(hidden, addPieceByWall(hidden, LIVING, piece("bookcaseClosed"), [2, 1]))).c).toEqual([2, 0.3]);
  });

  it("stands against the nearest wall anyway when no spot is clear", () => {
    const crowded = square((r) => { r.objects = [thing("table", [2, 2], [3.9, 3.9, 1])]; });
    const room = living(crowded);
    const spot = homeMapFreeWallSpot(crowded.floors[0]!, room, [0.8, 0.5, 1.7], 0, [2, 1])!;
    expect(spot.clear).toBe(false);
    expect(spot.c[0]).toBeCloseTo(2, 6);
    expect(spot.c[1]).toBeCloseTo(0.3, 6);
    expect(newest(done(crowded, addPieceByWall(crowded, LIVING, piece("bookcaseClosed"), [2, 1]))).c).toEqual([2, 0.3]);
    // With room to spare, the spot is clear.
    expect(homeMapFreeWallSpot(square().floors[0]!, living(square()), [0.8, 0.5, 1.7], 0, [2, 1])!.clear).toBe(true);
  });

  it("puts a ceiling lamp, a rug and a piece no wall can hold square in the room, as Add furniture always did", () => {
    expect(homeMapPieceStandsFree(piece("lampSquareCeiling"))).toBe(true);
    expect(homeMapPieceStandsFree(piece("rugRound"))).toBe(true);
    expect(homeMapPieceStandsFree(piece("loungeSofa"))).toBe(false);
    for (const id of ["lampSquareCeiling", "rugRectangle", "ceilingFan"]) {
      const before = square();
      expect(newest(done(before, addPieceByWall(before, LIVING, piece(id), [1, 1])))).toEqual(newest(addPiece(before, LIVING, piece(id), [1, 1])!));
    }
    const tiny = square((r) => {
      r.outline = [[0, 0], [1, 0], [1, 1], [0, 1]];
      r.walls = [{ a: [0, 0], b: [1, 0], t: 0.1 }, { a: [1, 0], b: [1, 1], t: 0.1 }, { a: [1, 1], b: [0, 1], t: 0.1 }, { a: [0, 1], b: [0, 0], t: 0.1 }];
    });
    expect(homeMapFreeWallSpot(tiny.floors[0]!, living(tiny), [1.6, 1.88, 0.63], 0, [0.5, 0.5])).toBeUndefined();
    expect(newest(done(tiny, addPieceByWall(tiny, LIVING, piece("bedDouble"), [0.2, 0.2])))).toMatchObject({ c: [0.5, 0.5], turn: 0 });
  });

  it("refuses a room that is gone, a full room, a point that is no number, or a piece the store would refuse", () => {
    const before = square();
    expect(addPieceByWall(before, "7B1E0C2A-5D3F-4A8B-9C6D-0000000000FF", piece("desk"), [1, 1])).toBeUndefined();
    expect(addPieceByWall(before, LIVING, { ...piece("desk"), id: "Desk" }, [1, 1])).toBeUndefined();
    expect(addPieceByWall(before, LIVING, piece("desk"), [Number.NaN, 1])).toBeUndefined();
    const full = square((r) => { r.objects = Array.from({ length: 256 }, () => thing("box", [1, 1], [0.1, 0.1, 0.1])); });
    expect(addPieceByWall(full, LIVING, piece("desk"), [1, 1])).toBeUndefined();
  });
});

// ── the dialog ────────────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}
function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}
function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}
function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}
/** The `event` handler of the smallest template whose text holds `marker`
 * and that binds the event itself: the binding on the tag the marker is
 * in, else the last one before the marker. */
function handler(root: unknown, marker: string, event: string): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      const bound: { at: number; fn: unknown }[] = [];
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) bound.push({ at: text.length, fn: v });
        text += flatten(v);
      });
      const where = text.indexOf(marker);
      if (where < 0) return { text, fn: undefined };
      const tagStart = text.lastIndexOf("<", where);
      const tagEnd = text.indexOf(">", tagStart);
      const own = bound.find((b) => tagStart >= 0 && b.at > tagStart && b.at <= tagEnd);
      return { text, fn: (own ?? bound.filter((b) => b.at <= where).at(-1))?.fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e?: unknown) => void;
}

const settle = () => new Promise((r) => setTimeout(r, 0));

/** Home Assistant with the map stored, three lights, a switch, a lock, two
 * sensors (one with no area) and a diagnostic sensor. */
function fakeHass(start: { doc: HomeMapDocument; rev: number }) {
  let stored = start;
  const hass = {
    states: {
      "light.reading_lamp": { entity_id: "light.reading_lamp", state: "on", attributes: { friendly_name: "Reading lamp", brightness: 200 } },
      "light.ceiling": { entity_id: "light.ceiling", state: "off", attributes: { friendly_name: "Ceiling light" } },
      "light.pendants": { entity_id: "light.pendants", state: "off", attributes: { friendly_name: "Pendants" } },
      "light.kitchen_cans": { entity_id: "light.kitchen_cans", state: "off", attributes: { friendly_name: "Kitchen cans" } },
      "switch.fan": { entity_id: "switch.fan", state: "off", attributes: { friendly_name: "Fan" } },
      "lock.side_door": { entity_id: "lock.side_door", state: "locked", attributes: { friendly_name: "Side door" } },
      "sensor.living_temp": { entity_id: "sensor.living_temp", state: "21.5", attributes: { friendly_name: "Living temperature", unit_of_measurement: "°C" } },
      "sensor.outside": { entity_id: "sensor.outside", state: "12", attributes: { friendly_name: "Outside", unit_of_measurement: "°C" } },
      "sensor.fan_signal": { entity_id: "sensor.fan_signal", state: "-60", attributes: { friendly_name: "Fan signal" } },
    },
    entities: {
      "light.reading_lamp": { area_id: "living_room" },
      "light.ceiling": { area_id: "living_room" },
      "lock.side_door": { area_id: "living_room" },
      "sensor.living_temp": { area_id: "living_room" },
      "light.pendants": { area_id: "kitchen" },
      "light.kitchen_cans": { area_id: "kitchen" },
      "switch.fan": { area_id: "kitchen" },
      "sensor.fan_signal": { area_id: "kitchen", entity_category: "diagnostic" },
    },
    areas: { living_room: { name: "Living room" }, kitchen: { name: "Kitchen" } },
    connection: {
      async sendMessagePromise(msg: Record<string, any>) {
        if (msg.type === "wrist_assistant/home_map/get") return structuredClone(stored);
        if (msg.type === "wrist_assistant/home_map/save") {
          stored = { doc: msg.doc as HomeMapDocument, rev: stored.rev + 1 };
          return { rev: stored.rev };
        }
        throw Object.assign(new Error("Unknown command."), { code: "unknown_command" });
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return { hass, now: () => stored };
}

type Inside = {
  selection?: Record<string, unknown>;
  addOpen?: string;
  view?: { scale: number; ox: number; oy: number };
  willUpdate(changed: Map<string, unknown>): void;
};

async function page(doc: HomeMapDocument = fixture()) {
  const ha = fakeHass({ doc, rev: 4 });
  const el = new WaHomeMapEditor();
  el.hass = ha.hass;
  el.capable = true;
  const inside = el as unknown as Inside;
  inside.willUpdate(new Map());
  await settle();
  el.resizeStage(1000, 600);
  inside.willUpdate(new Map());
  const key = (k: string, extra: Record<string, unknown> = {}) => el.onKey({ key: k, preventDefault: () => undefined, composedPath: () => [el], ...extra } as unknown as KeyboardEvent);
  const event = { target: null, currentTarget: null, shiftKey: false, metaKey: false, ctrlKey: false, key: "", stopPropagation: () => undefined, preventDefault: () => undefined };
  const click = (marker: string) => handler(el.render(), marker, "@click=")(event);
  const type = (marker: string, value: string) => handler(el.render(), marker, "@input=")({ ...event, target: { value } });
  const floor = () => el.context()!.doc.floors[0]!;
  const room = (id: string) => floor().rooms.find((r) => r.id === id)!;
  /** The dialog's own text, from its tag on; empty while it is shut. */
  const dialog = () => {
    const all = flatten(el.render());
    const at = all.indexOf(OPEN);
    return at < 0 ? "" : all.slice(at);
  };
  return { el, inside, ha, key, event, click, type, floor, room, dialog, text: () => flatten(el.render()) };
}

const OPEN = 'class="hma"';

describe("the Add dialog's lists", () => {
  it("groups a device by its kind, in the dialog's order", () => {
    expect(homeMapAddKindOf("light.a")).toBe("lights");
    expect(homeMapAddKindOf("binary_sensor.a")).toBe("sensors");
    expect(homeMapAddKindOf("fan.a")).toBe("climate");
    expect(homeMapAddKindOf("switch.a")).toBe("switches");
    expect(homeMapAddKindOf("input_boolean.a")).toBe("switches");
    expect(homeMapAddKindOf("media_player.a")).toBe("media");
    expect(homeMapAddKindOf("cover.a")).toBe("covers");
    expect(homeMapAddKindOf("lock.a")).toBe("locks");
    expect(homeMapAddKindOf("camera.a")).toBe("other");
    expect(homeMapAddKindOf("vacuum.a")).toBe("other");
  });

  it("lists the kinds that belong on a plan with no search, any entity with one, and chips each area with its count", () => {
    const { hass } = fakeHass({ doc: fixture(), rev: 1 });
    const all = homeMapDevices(hass);
    const plain = homeMapAddCandidates(all, "");
    // The diagnostic sensor waits for a search.
    expect(plain.map((d) => d.entityId)).not.toContain("sensor.fan_signal");
    expect(homeMapAddCandidates(all, "signal").map((d) => d.entityId)).toEqual(["sensor.fan_signal"]);
    const ctx = { floor: fixture().floors[0]!, areas: [{ id: "kitchen", name: "Kitchen" }, { id: "living_room", name: "Living room" }] };
    const chips = homeMapAddAreaChips(ctx, plain, "kitchen");
    expect(chips.map((c) => [c.name, c.count])).toEqual([["Kitchen", 3], ["Living room", 4], ["No area", 1], ["All areas", 8]]);
    expect(chips.at(-2)!.id).toBe(HOME_MAP_ADD_NO_AREA);
    expect(chips.at(-1)!.id).toBe(HOME_MAP_ADD_ALL_AREAS);
    // The rooms' order without a picked room; an area with nothing to list left out.
    expect(homeMapAddAreaChips(ctx, homeMapAddCandidates(all, "fan"), undefined).map((c) => c.name)).toEqual(["Kitchen", "All areas"]);
    // The chip that is on stays, with nothing to list.
    expect(homeMapAddAreaChips(ctx, homeMapAddCandidates(all, "fan"), undefined, "living_room").map((c) => [c.name, c.count])).toEqual([["Kitchen", 2], ["Living room", 0], ["All areas", 2]]);
    expect(homeMapAddAreaChips(ctx, homeMapAddCandidates(all, "fan"), undefined, HOME_MAP_ADD_NO_AREA).map((c) => c.name)).toEqual(["Kitchen", "No area", "All areas"]);
    const sections = homeMapAddSections(plain, "living_room");
    expect(sections.map((s) => s.label)).toEqual(["Lights", "Sensors", "Locks"]);
    expect(homeMapAddSections(plain, HOME_MAP_ADD_NO_AREA).flatMap((s) => s.devices.map((d) => d.entityId))).toEqual(["sensor.outside"]);
  });
});

describe("the Add dialog in the map editor", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => undefined });
  });
  afterEach(() => {
    forgetHomeMap();
    vi.unstubAllGlobals();
  });

  it("opens from ＋ Add and the key A, keeps the page's keys while open, and closes on Escape and Close", async () => {
    const { el, inside, key, click, text, event, floor } = await page();
    expect(text()).toContain("Add device or furniture</button>");
    expect(text()).not.toContain(OPEN);
    click("Add a device or a piece of furniture (A)");
    let shown = text();
    expect(shown).toContain(OPEN);
    expect(shown).toContain(`Add to ${homeMapFloorName(floor())}`);
    expect(inside.addOpen).toBe("devices");
    click("hma-close");
    expect(text()).not.toContain(OPEN);
    // A in a text field is typing, not the dialog.
    key("a", { composedPath: () => [{ tagName: "INPUT", type: "search" }] });
    expect(text()).not.toContain(OPEN);
    key("a");
    expect(text()).toContain(OPEN);
    // While it is open the page's keys do nothing: Delete leaves the picked thing.
    el.select({ kind: "object", roomId: LIVING, object: 0 });
    const things = floor().rooms[0]!.objects.length;
    key("Delete");
    expect(floor().rooms[0]!.objects.length).toBe(things);
    handler(el.render(), OPEN, "@keydown=")({ ...event, key: "Escape" });
    shown = text();
    expect(shown).not.toContain(OPEN);
    expect(inside.addOpen).toBeUndefined();
  });

  it("lists the picked room's area first and on, by kind, with what is on the map tagged", async () => {
    const { el, click, type, dialog } = await page();
    el.select({ kind: "room", roomId: LIVING });
    el.openAdd();
    let shown = dialog();
    expect(shown).toContain("Add to Living room");
    expect(shown).toMatch(/class="hme-chip sel on"[^>]*>\s*Living room<span class="hma-n">4<\/span>/);
    expect(shown.indexOf("Living room<span")).toBeLessThan(shown.indexOf("Kitchen<span"));
    expect(shown.indexOf(">Lights<span")).toBeLessThan(shown.indexOf(">Sensors<span"));
    expect(shown.indexOf(">Sensors<span")).toBeLessThan(shown.indexOf(">Locks<span"));
    expect(shown).toContain("Reading lamp</span><small class=\"mono\">light.reading_lamp</small>");
    expect(shown).toContain('<span class="hma-tag">1 on map</span>');
    expect(shown).toContain('<span class="hma-tag">on map</span>');
    expect(shown).not.toContain("Pendants</span>");
    // Another area's chip lists its devices.
    click('Kitchen<span class="hma-n">');
    shown = dialog();
    expect(shown).toContain("Pendants</span>");
    expect(shown).not.toContain("Reading lamp</span>");
    // A search narrows them.
    type('aria-label="Find a device"', "fan");
    shown = dialog();
    expect(shown).toContain("Fan</span>");
    expect(shown).not.toContain("Pendants</span>");
    type('aria-label="Find a device"', "zzz");
    expect(dialog()).toContain("Nothing by that name in Kitchen.");
  });

  it("adds a light through the lamp chooser in the picked room, places another device there, and picks one on the map", async () => {
    const { el, inside, click, text, floor, room } = await page();
    el.select({ kind: "room", roomId: LIVING });
    el.openAdd();
    click('All areas<span class="hma-n">');
    click("Pendants</span>");
    let shown = text();
    expect(shown).not.toContain(OPEN);
    expect(shown).toContain("In Living room. Which lamp is it in?");
    el.page.devices.cancelChooser(el.context()!);
    // Any other device goes into the picked room and is picked.
    el.select({ kind: "room", roomId: LIVING });
    el.openAdd();
    click('All areas<span class="hma-n">');
    const pins = floor().pins.length;
    click("Fan</span>");
    expect(text()).not.toContain(OPEN);
    expect(floor().pins).toHaveLength(pins + 1);
    const fan = floor().pins.at(-1)!;
    expect(fan.entityId).toBe("switch.fan");
    expect(homeMapPinRoom(floor(), fan)?.id).toBe(room(LIVING).id);
    expect(inside.selection).toEqual({ kind: "pin", pinId: fan.id });
    // A device on the map already is picked, not added again.
    el.openAdd();
    click("Side door</span>");
    expect(floor().pins).toHaveLength(pins + 1);
    expect(inside.selection).toEqual({ kind: "pin", pinId: LOCK });
  });

  it("places every device not on the map by area from its footer", async () => {
    const { el, click, text, floor } = await page();
    el.openAdd();
    expect(text()).toContain("Place all 3 by area");
    click("Place all 3 by area");
    expect(text()).not.toContain(OPEN);
    const ids = floor().pins.map((p) => p.entityId);
    for (const id of ["light.kitchen_cans", "switch.fan", "sensor.living_temp"]) expect(ids).toContain(id);
    expect(ids).not.toContain("sensor.outside");
  });

  it("adds a piece into the room under the middle of the view, against its nearest free wall, and picks it", async () => {
    const { el, inside, click, text, room } = await page();
    el.openAdd("furniture");
    let shown = text();
    expect(shown).toMatch(/id=hma-tab-furniture class=on\s+aria-selected=true/);
    expect(shown).toContain("Into <b>Living room</b>");
    const before = room(LIVING).objects.length;
    click("Add Sofa, 2.00 × 0.84 m");
    shown = text();
    expect(shown).not.toContain(OPEN);
    const objects = room(LIVING).objects;
    expect(objects).toHaveLength(before + 1);
    const sofa = objects.at(-1)!;
    // The east wall's stretches beside its way through are too short once
    // the walls' thickness is counted, and the TV fills the north wall's
    // middle: the sofa stands right of the TV, its back to the north wall.
    expect(sofa).toMatchObject({ kind: "sofa", model: "loungeSofa", turn: 0 });
    expect(sofa.c[0]).toBeCloseTo(4.95, 2);
    expect(sofa.c[1]).toBeCloseTo(0.47, 2);
    for (const other of objects.slice(0, -1)) expect(boxesOverlap(sofa, other)).toBe(false);
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: before });
    // The tabs switch.
    el.openAdd();
    click("hma-tab-furniture");
    expect(text()).toContain("Find a piece: sofa, lamp, desk");
  });

  it("asks for a room when none is picked and none is under the middle of the view", async () => {
    const { el, inside, click, text, room } = await page();
    inside.view = { scale: 40, ox: 5000, oy: 5000 };
    el.openAdd("furniture");
    let shown = text();
    expect(shown).toContain("Which room is it for?");
    expect(shown).toContain(`Add to ${homeMapFloorName(el.context()!.floor)}`);
    // The cards wait for a room.
    const before = room(KITCHEN).objects.length;
    click("Add Sofa, 2.00 × 0.84 m");
    expect(room(KITCHEN).objects).toHaveLength(before);
    el.addDialog.roomId = KITCHEN;
    shown = text();
    expect(shown).toContain("Into <b>Kitchen</b>");
    click("Add Floor lamp, 0.33 × 0.38 m");
    expect(room(KITCHEN).objects).toHaveLength(before + 1);
    expect(room(KITCHEN).objects.at(-1)!.model).toBe("lampRoundFloor");
  });
});
