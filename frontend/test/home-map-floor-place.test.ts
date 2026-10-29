// A floor's place in the home map document (app repo
// docs/home_map_plan_2026-10.md, "Stacked floors"): how the floor sits over
// the base floor, written by the iPhone's Line Up Floors. The panel's checks
// take and refuse it as the store does (`tests/test_home_map_store.py`), in
// the store's words, rounded and in the contract's order; and every panel
// edit that rebuilds a floor keeps it, a new floor getting none. The panel
// never draws or changes it.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  addFloor,
  addPin,
  deleteFloor,
  deleteRoom,
  moveRoom,
  moveRoomToFloor,
  movePin,
  removePin,
  renameFloor,
  setHomeStyle,
  splitRoom,
} from "../src/home-map/edit-ops.js";
import { type HomeMapDocument, type HomeMapFloorPlace, applyHomeMapEdit, checkHomeMap } from "../src/home-map/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): Record<string, any> => JSON.parse(FIXTURE_TEXT);

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const UPSTAIRS = "00000000-0000-4000-8000-000000000201";
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const GROUND: HomeMapFloorPlace = { x: 0.5, y: -1, turn: 0 };
const UP: HomeMapFloorPlace = { x: 1.25, y: -0.5, turn: 90 };

function checked(doc: Record<string, any>): HomeMapDocument {
  const out = checkHomeMap(doc);
  if (!out.ok) throw new Error(out.message);
  return out.doc;
}

function refusal(place: unknown): string {
  const doc = fixture();
  doc.floors[0].place = place;
  const out = checkHomeMap(doc);
  if (out.ok) throw new Error("accepted");
  return out.message;
}

/** The edit's result, checked as the store checks it (already rounded and
 * in order), the input left as it was. */
function done(before: HomeMapDocument, after: HomeMapDocument | undefined): HomeMapDocument {
  expect(after).toBeDefined();
  const text = JSON.stringify(before);
  const out = checkHomeMap(after);
  if (!out.ok) throw new Error(out.message);
  expect(JSON.stringify(out.doc)).toBe(JSON.stringify(after));
  expect(JSON.stringify(before)).toBe(text);
  return after!;
}

/** The fixture with an empty upstairs, each floor with a place. */
function twoFloors(): HomeMapDocument {
  const doc = checked(fixture());
  const out = addFloor(doc, { id: UPSTAIRS, name: "Upstairs", story: 1 })!;
  return checked({
    ...out,
    floors: out.floors.map((f) => ({ id: f.id, name: f.name, story: f.story, place: f.id === FLOOR ? GROUND : UP, rooms: f.rooms, pins: f.pins })),
  });
}

const placeOf = (doc: HomeMapDocument, floorId: string) => doc.floors.find((f) => f.id === floorId)?.place;

describe("a floor's place", () => {
  it("is kept after the story, its keys in the contract's order, rounded", () => {
    const doc = fixture();
    // Sent last, its keys in another order.
    doc.floors[0].place = { turn: 90.004, y: -0.5, x: 1.25678 };
    const floor = checked(doc).floors[0]!;
    expect(Object.keys(floor)).toEqual(["id", "name", "story", "place", "rooms", "pins"]);
    expect(Object.keys(floor.place!)).toEqual(["x", "y", "turn"]);
    expect(floor.place).toEqual({ x: 1.26, y: -0.5, turn: 90 });
    doc.floors[0].place = { x: -500, y: 500, turn: -360 };
    expect(checked(doc).floors[0]!.place).toEqual({ x: -500, y: 500, turn: -360 });
    doc.floors[0].place = { x: -0.001, y: 0, turn: 360 };
    expect(Object.is(checked(doc).floors[0]!.place!.x, 0)).toBe(true);
    // Absent, it stays absent.
    expect(Object.hasOwn(checked(fixture()).floors[0]!, "place")).toBe(false);
  });

  it.each([
    [{ x: 501, y: 0, turn: 0 }, "doc.floors[0].place.x must be between -500 and 500"],
    [{ x: 0, y: -500.01, turn: 0 }, "doc.floors[0].place.y must be between -500 and 500"],
    [{ x: 0, y: 0, turn: 360.5 }, "doc.floors[0].place.turn must be between -360 and 360"],
    [{ x: 0, y: 0, turn: -361 }, "doc.floors[0].place.turn must be between -360 and 360"],
    [{ x: "1", y: 0, turn: 0 }, "doc.floors[0].place.x must be a number"],
    [{ x: 0, y: true, turn: 0 }, "doc.floors[0].place.y must be a number"],
    [{ x: 0, y: 0, turn: Number.POSITIVE_INFINITY }, "doc.floors[0].place.turn must be a finite number"],
    [{ x: 0, y: 0 }, "doc.floors[0].place.turn is missing"],
    [{ x: 0, y: 0, turn: 0, z: 1 }, "doc.floors[0].place.z is not a key the home map has"],
    [[0, 0, 0], "doc.floors[0].place must be an object"],
    [null, "doc.floors[0].place must be an object"],
  ])("refuses %j", (place, message) => {
    expect(refusal(place)).toBe(message);
  });
});

describe("the panel's edits keep a floor's place", () => {
  it("through its room, pin, floor and style edits", () => {
    const doc = twoFloors();
    const edits: [string, (d: HomeMapDocument) => HomeMapDocument | undefined][] = [
      ["moveRoom", (d) => moveRoom(d, LIVING, 0.5, 0)],
      ["splitRoom", (d) => splitRoom(d, LIVING, [3, -1], [3, 6], id(300))],
      ["deleteRoom", (d) => deleteRoom(d, KITCHEN)],
      ["addPin", (d) => addPin(d, UPSTAIRS, { id: id(301), entityId: "light.landing", at: [1, 1] })],
      ["movePin", (d) => movePin(d, READING, [1, 1])],
      ["removePin", (d) => removePin(d, READING)],
      ["renameFloor", (d) => renameFloor(d, UPSTAIRS, "Loft", 2)],
      ["setHomeStyle", (d) => setHomeStyle(d, { look: "night" })],
      ["applyHomeMapEdit", (d) => applyHomeMapEdit(d, { kind: "renameRoom", roomId: LIVING, name: "Lounge" })],
    ];
    for (const [name, edit] of edits) {
      const out = done(doc, edit(doc));
      expect([name, placeOf(out, FLOOR), placeOf(out, UPSTAIRS)]).toEqual([name, GROUND, UP]);
    }
  });

  it("through a room moved to another floor, a new floor getting none", () => {
    const doc = twoFloors();
    let out = done(doc, moveRoomToFloor(doc, KITCHEN, { floorId: UPSTAIRS }));
    expect(out.floors.find((f) => f.id === UPSTAIRS)!.rooms.map((r) => r.id)).toEqual([KITCHEN]);
    expect([placeOf(out, FLOOR), placeOf(out, UPSTAIRS)]).toEqual([GROUND, UP]);
    // The kitchen kept downstairs, so the ground floor is not emptied.
    out = done(doc, moveRoomToFloor(doc, LIVING, { newFloor: { id: id(302), name: "Attic", story: 2 } }));
    expect([placeOf(out, FLOOR), placeOf(out, UPSTAIRS)]).toEqual([GROUND, UP]);
    expect(Object.hasOwn(out.floors.find((f) => f.id === id(302))!, "place")).toBe(false);
    // A floor added is centred: no place.
    const added = done(doc, addFloor(doc, { id: id(303), name: "Basement", story: -1 }));
    expect(Object.hasOwn(added.floors.at(-1)!, "place")).toBe(false);
    expect(placeOf(done(doc, deleteFloor(doc, FLOOR)), UPSTAIRS)).toEqual(UP);
  });
});
