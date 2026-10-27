// The home map document as the panel reads and edits it (app repo
// docs/home_map_plan_2026-10.md, "Contract"): the shared fixture passes the
// checks unchanged, every refusal the store makes is made here in its words,
// where things are on the plan, what each pin's entity is doing, and every
// edit the Home map page makes.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  type HomeMapDocument,
  type HomeMapStates,
  HOME_MAP_MAX_BYTES,
  applyHomeMapEdit,
  checkHomeMap,
  homeMapAreaChoices,
  homeMapBounds,
  homeMapBytes,
  homeMapDeleteRoomQuestion,
  homeMapFloorName,
  homeMapFloorsWithRooms,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapLitRooms,
  homeMapPinHeight,
  homeMapPinLook,
  homeMapPinName,
  homeMapPinRoom,
  homeMapRoomAt,
  homeMapRoomCenter,
  homeMapRoomName,
  homeMapRoomPinCount,
  newHomeMapPin,
  readHomeMap,
} from "../src/home-map/model.js";

/** The shared fixture, a byte copy of the app's. */
const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const SIDE_DOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const NEW_ID = "c3a0e000-0000-4000-8000-0000000000f1";

const states = (entries: Record<string, [string, Record<string, unknown>?]>): HomeMapStates =>
  Object.fromEntries(Object.entries(entries).map(([id, [state, attributes]]) => [id, { state, attributes: attributes ?? {} }]));

function refusal(change: (doc: Record<string, any>) => void): string {
  const doc = fixture() as unknown as Record<string, any>;
  change(doc);
  const checked = checkHomeMap(doc);
  if (checked.ok) throw new Error("accepted");
  return checked.message;
}

describe("the checks", () => {
  it("take the shared fixture as it is, keys in the contract's order", () => {
    const checked = checkHomeMap(fixture());
    expect(checked.ok).toBe(true);
    if (!checked.ok) return;
    expect(checked.doc).toEqual(fixture());
    expect(JSON.stringify(checked.doc)).toBe(JSON.stringify(fixture()));
    expect(readHomeMap(fixture())).toEqual(fixture());
    expect(checked.doc.floors[0]!.rooms.map((r) => r.name)).toEqual(["Living room", "Kitchen"]);
    expect(checked.doc.floors[0]!.pins).toHaveLength(5);
  });

  it("round every number to 2 decimals and keep a whole number whole", () => {
    const doc = fixture() as unknown as Record<string, any>;
    doc.floors[0].pins[0].at = [0.8049, 3.1, -0.0001];
    const checked = checkHomeMap(doc);
    expect(checked.ok && checked.doc.floors[0]!.pins[0]!.at).toEqual([0.8, 3.1, 0]);
    expect(Object.is(checked.ok && checked.doc.floors[0]!.pins[0]!.at[2], -0)).toBe(false);
  });

  it("refuse each break of the contract in the store's words", () => {
    expect(refusal((d) => { d.v = 2; })).toBe("doc.v must be 1");
    expect(refusal((d) => { d.extra = 1; })).toBe("doc.extra is not a key the home map has");
    expect(refusal((d) => { delete d.floors[0].pins; })).toBe("doc.floors[0].pins is missing");
    expect(refusal((d) => { d.floors[0].id = "ground"; })).toBe("doc.floors[0].id must be a UUID");
    expect(refusal((d) => { d.floors[0].rooms[1].id = LIVING.toLowerCase(); })).toBe(`doc.floors[0].rooms[1].id repeats the id ${LIVING.toLowerCase()}`);
    expect(refusal((d) => { d.floors[0].story = 1.5; })).toBe("doc.floors[0].story must be a whole number between -100 and 100");
    expect(refusal((d) => { d.floors[0].rooms[0].outline = [[0, 0], [1, 1]]; })).toBe("doc.floors[0].rooms[0].outline needs at least 3");
    expect(refusal((d) => { d.floors[0].rooms[0].areaId = "living room"; })).toBe("doc.floors[0].rooms[0].areaId must be a Home Assistant area id");
    expect(refusal((d) => { d.floors[0].rooms[0].openings[0].kind = "arch"; })).toBe("doc.floors[0].rooms[0].openings[0].kind must be door, window or opening");
    expect(refusal((d) => { d.floors[0].rooms[0].openings[0].z1 = 0.1; })).toBe("doc.floors[0].rooms[0].openings[0].z1 must not be below z0");
    expect(refusal((d) => { d.floors[0].rooms[0].objects[0].kind = "Sofa"; })).toBe("doc.floors[0].rooms[0].objects[0].kind must be a RoomPlan category in lower camel case");
    expect(refusal((d) => { d.floors[0].rooms[0].height = 0; })).toBe("doc.floors[0].rooms[0].height must be between 0.01 and 100");
    expect(refusal((d) => { d.floors[0].pins[0].entityId = "Light.Lamp"; })).toBe("doc.floors[0].pins[0].entityId must be an entity id, like light.reading_lamp");
    expect(refusal((d) => { d.floors[0].pins[0].roomId = FLOOR; })).toBe("doc.floors[0].pins[0].roomId names no room of this floor");
    expect(refusal((d) => { d.floors[0].pins[0].at = [1, 2]; })).toBe("doc.floors[0].pins[0].at must be a list of 3 numbers");
    expect(refusal((d) => { d.floors[0].pins[0].at = [1, 2, Number.NaN]; })).toBe("doc.floors[0].pins[0].at[2] must be a finite number");
    expect(refusal((d) => { d.floors[0].name = "x".repeat(101); })).toBe("doc.floors[0].name is at most 100 characters");
  });

  it("hold the whole map to 40 rooms and 256 KiB", () => {
    const many = refusal((d) => {
      const room = d.floors[0].rooms[1];
      d.floors[0].rooms = Array.from({ length: 41 }, (_, i) => ({ ...room, id: `7B1E0C2A-5D3F-4A8B-9C6D-1${String(i).padStart(11, "0")}` }));
      d.floors[0].pins = [];
    });
    expect(many).toBe("doc.floors[0].rooms holds at most 40");
    const doc = fixture() as unknown as Record<string, any>;
    const wall = doc.floors[0].rooms[0].walls[0];
    doc.floors[0].rooms[0].walls = Array.from({ length: 256 }, () => ({ ...wall, a: [1234.56, 2345.67], b: [3456.78, 4567.89] }));
    for (const room of doc.floors[0].rooms) room.walls = doc.floors[0].rooms[0].walls;
    const extra = Array.from({ length: 30 }, (_, i) => ({ ...doc.floors[0].rooms[1], id: `7B1E0C2A-5D3F-4A8B-9C6D-2${String(i).padStart(11, "0")}` }));
    doc.floors[0].rooms.push(...extra);
    const checked = checkHomeMap(doc);
    expect(checked.ok).toBe(false);
    if (checked.ok) return;
    expect(checked.code).toBe("too_large");
    expect(checked.message).toMatch(/^a home map is at most 256 KiB; this one is \d+ KiB$/);
    expect(homeMapBytes(doc)).toBeGreaterThan(HOME_MAP_MAX_BYTES);
  });

  it("read a damaged reply as no map", () => {
    expect(readHomeMap(null)).toBeUndefined();
    expect(readHomeMap({ v: 1 })).toBeUndefined();
  });
});

describe("finding things", () => {
  const doc = fixture();
  const floor = doc.floors[0]!;

  it("knows the plan's box, each room's middle and the room a point is in", () => {
    expect(homeMapBounds(floor)).toEqual({ minX: 0, minY: 0, maxX: 10, maxY: 5 });
    expect(homeMapRoomCenter(floor.rooms[0]!)).toEqual([3, 2.5]);
    expect(homeMapRoomCenter(floor.rooms[1]!)).toEqual([8, 2.5]);
    expect(homeMapRoomAt(floor, [2, 2])?.id).toBe(LIVING);
    expect(homeMapRoomAt(floor, [9, 1])?.id).toBe(KITCHEN);
    expect(homeMapRoomAt(floor, [11, 1])).toBeUndefined();
    // A pin names its room; one that names none is in the room it stands in.
    expect(homeMapPinRoom(floor, floor.pins[3]!)?.id).toBe(KITCHEN);
    const loose = { ...floor.pins[0]!, roomId: undefined };
    expect(homeMapPinRoom(floor, loose)?.id).toBe(LIVING);
    expect(homeMapRoomPinCount(floor, LIVING)).toBe(3);
  });

  it("names floors and rooms, a blank one by its story or as Room", () => {
    expect(homeMapFloorName(floor)).toBe("Ground floor");
    expect(homeMapFloorName({ name: " ", story: 1 })).toBe("Floor 2");
    expect(homeMapRoomName({})).toBe("Room");
    expect(homeMapFloorsWithRooms(doc)).toHaveLength(1);
    expect(homeMapFloorsWithRooms({ v: 1, floors: [{ ...floor, rooms: [], pins: [] }] })).toEqual([]);
    expect(homeMapFloorsWithRooms(null)).toEqual([]);
  });
});

describe("what each pin is doing", () => {
  const floor = fixture().floors[0]!;

  it("reads a light, a lock, any other kind, and an entity that is gone", () => {
    const s = states({
      "light.reading_lamp": ["on", { brightness: 51 }],
      "light.ceiling": ["off"],
      "lock.side_door": ["unlocked"],
      "climate.thermostat": ["heat"],
    });
    expect(homeMapPinLook("light.reading_lamp", s)).toEqual({ kind: "light", on: true, brightness: 0.2 });
    expect(homeMapPinLook("light.ceiling", s)).toEqual({ kind: "light", on: false });
    expect(homeMapPinLook("lock.side_door", s)).toEqual({ kind: "lock", locked: false });
    expect(homeMapPinLook("climate.thermostat", s)).toEqual({ kind: "other", on: true });
    expect(homeMapPinLook("light.pendants", s)).toEqual({ kind: "gone" });
    expect(homeMapPinLook("light.pendants", undefined)).toEqual({ kind: "gone" });
  });

  it("counts each lit light once and finds the rooms it lights", () => {
    const s = states({ "light.reading_lamp": ["on"], "light.ceiling": ["on"], "light.pendants": ["off"] });
    expect(homeMapLightsOn(floor, s)).toBe(2);
    expect([...homeMapLitRooms(floor, s)]).toEqual([LIVING]);
    const twice = { ...floor, pins: [...floor.pins, { ...floor.pins[0]!, id: NEW_ID }] };
    expect(homeMapLightsOn(twice, s)).toBe(2);
    expect([0, 1, 4].map(homeMapLightsOnWords)).toEqual(["No lights on", "1 light on", "4 lights on"]);
  });
});

describe("the page's edits", () => {
  it("move a pin, rounded, into the room it now stands in, its height kept", () => {
    const next = applyHomeMapEdit(fixture(), { kind: "movePin", pinId: READING.toLowerCase(), at: [8.123, 1.009] })!;
    const pin = next.floors[0]!.pins[0]!;
    expect(pin).toEqual({ id: READING, entityId: "light.reading_lamp", roomId: KITCHEN, at: [8.12, 1.01, 1.5] });
    expect(Object.keys(pin)).toEqual(["id", "entityId", "roomId", "at"]);
    // Outside every room: in none.
    const out = applyHomeMapEdit(fixture(), { kind: "movePin", pinId: READING, at: [12, 1] })!;
    expect(out.floors[0]!.pins[0]!.roomId).toBeUndefined();
    expect(checkHomeMap(out).ok).toBe(true);
    // Only the path to the pin is new.
    const before = fixture();
    const after = applyHomeMapEdit(before, { kind: "movePin", pinId: READING, at: [1, 1] })!;
    expect(after.floors[0]!.rooms).toBe(before.floors[0]!.rooms);
    expect(after.floors[0]!.pins[1]).toBe(before.floors[0]!.pins[1]);
  });

  it("add a pin in the room it stands in, and refuse a taken id or a floor that is gone", () => {
    const doc = fixture();
    const pin = newHomeMapPin(doc.floors[0]!, "switch.fan", doc.floors[0]!.rooms[1], () => NEW_ID);
    expect(pin).toEqual({ id: NEW_ID.toUpperCase(), entityId: "switch.fan", at: [8, 2.5, 1.2] });
    const next = applyHomeMapEdit(doc, { kind: "addPin", floorId: FLOOR, pin })!;
    expect(next.floors[0]!.pins.at(-1)).toEqual({ ...pin, roomId: KITCHEN });
    expect(checkHomeMap(next).ok).toBe(true);
    expect(applyHomeMapEdit(next, { kind: "addPin", floorId: FLOOR, pin })).toBeUndefined();
    expect(applyHomeMapEdit(doc, { kind: "addPin", floorId: FLOOR, pin: { ...pin, id: READING } })).toBeUndefined();
    expect(applyHomeMapEdit(doc, { kind: "addPin", floorId: NEW_ID, pin })).toBeUndefined();
    expect(applyHomeMapEdit(doc, { kind: "addPin", floorId: FLOOR, pin: { ...pin, entityId: "not an entity" } })).toBeUndefined();
    // With no room, the middle of the floor.
    expect(newHomeMapPin(doc.floors[0]!, "lock.front", undefined, () => NEW_ID).at).toEqual([5, 2.5, 1]);
    expect([homeMapPinHeight("light.x"), homeMapPinHeight("lock.x"), homeMapPinHeight("sensor.x")]).toEqual([1.5, 1, 1.2]);
  });

  it("remove a pin, and refuse one that is gone", () => {
    const next = applyHomeMapEdit(fixture(), { kind: "removePin", pinId: SIDE_DOOR })!;
    expect(next.floors[0]!.pins.map((p) => p.entityId)).toEqual(["light.reading_lamp", "light.ceiling", "light.pendants", "climate.thermostat"]);
    expect(applyHomeMapEdit(next, { kind: "removePin", pinId: SIDE_DOOR })).toBeUndefined();
  });

  it("rename a room, trimmed, and take the name off when blank", () => {
    const named = applyHomeMapEdit(fixture(), { kind: "renameRoom", roomId: KITCHEN, name: "  Galley  " })!;
    expect(named.floors[0]!.rooms[1]!.name).toBe("Galley");
    expect(Object.keys(named.floors[0]!.rooms[1]!)).toEqual(["id", "name", "areaId", "pageId", "outline", "height", "walls", "openings", "objects"]);
    const blank = applyHomeMapEdit(fixture(), { kind: "renameRoom", roomId: KITCHEN, name: " " })!;
    expect("name" in blank.floors[0]!.rooms[1]!).toBe(false);
    expect(applyHomeMapEdit(fixture(), { kind: "renameRoom", roomId: KITCHEN, name: "x".repeat(140) })!.floors[0]!.rooms[1]!.name).toHaveLength(100);
    expect(applyHomeMapEdit(fixture(), { kind: "renameRoom", roomId: NEW_ID, name: "Hall" })).toBeUndefined();
  });

  it("set and clear a room's area and page, in the contract's key order", () => {
    const area = applyHomeMapEdit(fixture(), { kind: "setRoomArea", roomId: LIVING, areaId: "lounge" })!;
    expect(area.floors[0]!.rooms[0]!.areaId).toBe("lounge");
    const page = applyHomeMapEdit(area, { kind: "setRoomPage", roomId: LIVING, pageId: NEW_ID })!;
    expect(Object.keys(page.floors[0]!.rooms[0]!).slice(0, 4)).toEqual(["id", "name", "areaId", "pageId"]);
    expect(checkHomeMap(page).ok).toBe(true);
    const cleared = applyHomeMapEdit(page, { kind: "setRoomArea", roomId: LIVING, areaId: undefined })!;
    expect("areaId" in cleared.floors[0]!.rooms[0]!).toBe(false);
    expect("pageId" in applyHomeMapEdit(fixture(), { kind: "setRoomPage", roomId: KITCHEN, pageId: undefined })!.floors[0]!.rooms[1]!).toBe(false);
    expect(applyHomeMapEdit(fixture(), { kind: "setRoomArea", roomId: LIVING, areaId: "has space" })).toBeUndefined();
    expect(applyHomeMapEdit(fixture(), { kind: "setRoomPage", roomId: LIVING, pageId: "not-a-uuid" })).toBeUndefined();
  });

  it("delete a room and keep its pins where they are, in no room", () => {
    const next = applyHomeMapEdit(fixture(), { kind: "deleteRoom", roomId: KITCHEN })!;
    expect(next.floors[0]!.rooms.map((r) => r.id)).toEqual([LIVING]);
    const pendants = next.floors[0]!.pins.find((p) => p.id === PENDANTS)!;
    expect(pendants).toEqual({ id: PENDANTS, entityId: "light.pendants", at: [8.1, 2.5, 2.1] });
    expect(next.floors[0]!.pins.find((p) => p.id === CEILING)!.roomId).toBe(LIVING);
    expect(checkHomeMap(next).ok).toBe(true);
    expect(applyHomeMapEdit(next, { kind: "deleteRoom", roomId: KITCHEN })).toBeUndefined();
  });
});

describe("the page's words", () => {
  it("lists the areas by name, names a pin by its entity, and asks before a delete", () => {
    expect(homeMapAreaChoices({ areas: { kitchen: { name: "Kitchen" }, attic: { name: null }, den: { name: "Den" } } }))
      .toEqual([{ id: "attic", name: "attic" }, { id: "den", name: "Den" }, { id: "kitchen", name: "Kitchen" }]);
    expect(homeMapAreaChoices(undefined)).toEqual([]);
    expect(homeMapPinName({ entityId: "light.a" }, { states: { "light.a": { state: "on", attributes: { friendly_name: "Lamp" } } } })).toBe("Lamp");
    expect(homeMapPinName({ entityId: "light.a" }, undefined)).toBe("light.a");
    expect(homeMapDeleteRoomQuestion({ name: "Kitchen" }, 2)).toBe("Delete Kitchen from the map? Its 2 pins stay on the plan, in no room. Scan it again on the iPhone to bring it back.");
    expect(homeMapDeleteRoomQuestion({ name: "Kitchen" }, 1)).toContain("Its pin stays");
    expect(homeMapDeleteRoomQuestion({}, 0)).toBe("Delete Room from the map? Scan it again on the iPhone to bring it back.");
  });
});
