// Doors whose swing runs into another door's swing or a piece of furniture
// (`door-swing.ts`), with the swing the plan draws: the leaf hung at the
// door's `a`, opening square to the wall into its own room.

import { describe, expect, it } from "vitest";
import {
  HOME_MAP_SWING_CLASH_DEPTH,
  homeMapOverlapDepth,
  homeMapSwingClashOf,
  homeMapSwingClashes,
  homeMapSwingFlipClears,
  homeMapSwingHitWords,
  homeMapSwingPolygon,
  swingDoorOtherWay,
} from "../src/home-map/door-swing.js";
import { homeDoorSwingsOf } from "../src/home-map/geometry.js";
import type { HomeMapDocument, HomeMapFloor, HomeMapObject, HomeMapOpening, HomeMapRoom } from "../src/home-map/model.js";

type P = [number, number];
const door = (a: P, b: P, z1 = 2.05): HomeMapOpening => ({ kind: "door", a, b, z0: 0, z1 });
const thing = (kind: string, c: P, size: [number, number, number], turn = 0, extra: Partial<HomeMapObject> = {}): HomeMapObject => ({ kind, c, size, turn, ...extra });
const room = (id: string, outline: P[], openings: HomeMapOpening[] = [], objects: HomeMapObject[] = [], name?: string): HomeMapRoom =>
  ({ id, ...(name === undefined ? {} : { name }), outline, height: 2.5, walls: [], openings, objects }) as HomeMapRoom;
const box = (id: string, x0: number, y0: number, x1: number, y1: number, openings: HomeMapOpening[] = [], objects: HomeMapObject[] = [], name?: string) =>
  room(id, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], openings, objects, name);
const floorOf = (rooms: HomeMapRoom[]): HomeMapFloor => ({ id: "F", name: "Floor", story: 0, rooms, pins: [] });
const docOf = (floor: HomeMapFloor): HomeMapDocument => ({ v: 1, floors: [floor] }) as HomeMapDocument;

describe("how deep two shapes overlap", () => {
  it("is the overlap's narrowest way across", () => {
    const a: P[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const b: P[] = [[0.8, -1], [2, -1], [2, 2], [0.8, 2]];
    expect(homeMapOverlapDepth(a, b)).toBeCloseTo(0.2);
    expect(homeMapOverlapDepth(a, [[2, 2], [3, 2], [3, 3]])).toBe(0);
  });
});

describe("a door's swing running into something", () => {
  it("finds two doors in one corner swinging into each other, from both sides", () => {
    // A hall 3 by 3 m: a door on the top wall hung at x 2.2 and one on the
    // right wall hung at y 0.2, both opening into the hall.
    const hall = box("hall", 0, 0, 3, 3, [door([2.2, 0], [2.95, 0]), door([3, 0.2], [3, 0.95])], [], "Hall");
    const floor = floorOf([hall]);
    const clashes = homeMapSwingClashes(floor);
    expect(clashes.map((c) => c.door.index)).toEqual([0, 1]);
    expect(clashes[0]!.hits).toHaveLength(1);
    expect(clashes[0]!.hits[0]!.kind).toBe("door");
    expect(homeMapSwingHitWords(floor, clashes[0]!.door, clashes[0]!.hits[0]!)).toBe("Swings into another door");
  });

  it("finds nothing for two doors on one wall with room between their swings", () => {
    const hall = box("hall", 0, 0, 4, 3, [door([0.2, 0], [1, 0]), door([1.2, 0], [2, 0])]);
    expect(homeMapSwingClashes(floorOf([hall]))).toEqual([]);
  });

  it("ignores an overlap thinner than the tolerance", () => {
    // The second door's swing reaches 4 cm into the first's.
    const hall = box("hall", 0, 0, 4, 3, [door([0, 0.1], [0, 0.9]), door([0.1, 0.94], [0.9, 0.94])]);
    const near = homeMapSwingClashes(floorOf([hall]));
    expect(near).toEqual([]);
    expect(HOME_MAP_SWING_CLASH_DEPTH).toBe(0.05);
  });

  it("never checks a door against its own partner, the same door scanned from the next room", () => {
    // Two rooms side by side; one door on the shared wall, scanned from each.
    // Each copy swings into its own room, and they share the doorway.
    const left = box("L", 0, 0, 3, 3, [door([3, 1], [3, 1.8])], [], "Left");
    const right = box("R", 3, 0, 6, 3, [door([3, 1.8], [3, 1])], [], "Right");
    expect(homeMapSwingClashes(floorOf([left, right]))).toEqual([]);
  });

  it("finds furniture in a swing, by its piece's name, and leaves a rug and a thing hung above the door alone", () => {
    const office = box("O", 0, 0, 4, 3, [door([0, 0.2], [0, 1])], [
      thing("table", [0.5, 0.6], [1.2, 0.6, 0.75], 90, { model: "desk" }),
      thing("rug", [0.5, 0.5], [1, 1, 0.01]),
      thing("shelf", [0.3, 0.5], [0.6, 0.3, 0.3], 0, { lift: 2.2 }),
      thing("storage", [3, 2.5], [1, 0.5, 1]),
    ]);
    const floor = floorOf([office]);
    const clash = homeMapSwingClashOf(floor, "O", 0);
    expect(clash?.hits.map((h) => (h.kind === "object" ? h.object : -1))).toEqual([0]);
    expect(homeMapSwingHitWords(floor, clash!.door, clash!.hits[0]!)).toBe("Swings into the desk");
  });

  it("offers Swing the other way only when hanging the door from its other end clears it", () => {
    // A cupboard where the open leaf stands: hung from the other end, the leaf
    // stands at y 1 and its sweep stops short of it.
    const office = box("O", 0, 0, 4, 3, [door([0, 0.2], [0, 1])], [thing("storage", [0.7, 0.15], [0.4, 0.3, 1])]);
    const doc = docOf(floorOf([office]));
    expect(homeMapSwingClashOf(doc.floors[0]!, "O", 0)).toBeDefined();
    expect(homeMapSwingFlipClears(doc, "F", "O", 0)).toBe(true);
    const flipped = swingDoorOtherWay(doc, "O", 0)!;
    expect(flipped.floors[0]!.rooms[0]!.openings[0]!.a).toEqual([0, 1]);
    expect(homeMapSwingClashOf(flipped.floors[0]!, "O", 0)).toBeUndefined();
    // A cupboard in the middle of the swing is hit either way.
    const middle = box("O", 0, 0, 4, 3, [door([0, 0.2], [0, 1])], [thing("storage", [0.4, 0.6], [0.4, 0.4, 1])]);
    expect(homeMapSwingFlipClears(docOf(floorOf([middle])), "F", "O", 0)).toBe(false);
  });

  it("names a door by the room it opens to", () => {
    const hall = box("H", 0, 0, 3, 3, [door([2.2, 0], [2.95, 0]), door([3, 0.2], [3, 0.95])], [], "Hall");
    const study = box("S", 3, 0, 6, 3, [door([3, 0.95], [3, 0.2])], [], "Study");
    const floor = floorOf([hall, study]);
    const clash = homeMapSwingClashOf(floor, "H", 0)!;
    expect(homeMapSwingHitWords(floor, clash.door, clash.hits[0]!)).toBe("Swings into the door to Study");
  });
});

// Jesse's Upstairs as saved on 2026-11-18: each room's outline, doors and
// furniture (windows left out).
const UPSTAIRS: HomeMapRoom[] = [
  room("E5A58B62-D4BF-46DC-8305-DDBF62ABC7D4", [[10.91, 3.43], [7.69, 3.43], [7.69, 0.02], [10.91, 0.02]], [door([7.68, 3.43], [7.68, 3.01], 2.07)], [
    thing("table", [8.95, 1.44], [1.25, 0.84, 0.64], 89.98, { model: "desk" }),
    thing("chair", [8.62, 1.24], [0.63, 0.7, 1.09], -82.36, { model: "chairDesk" }),
    thing("sofa", [10.14, 0.66], [0.85, 0.94, 0.96], -60.02),
  ], "Jesse Office"),
  room("483B87E9-F6DF-44DF-98E7-800D16AB5D7E", [[7.65, 2.92], [6.16, 2.92], [6.16, 0.05], [7.65, 0.04]], [door([6.93, 2.97], [7.55, 2.97], 2.11)], [
    thing("bathtub", [6.91, 0.42], [1.47, 0.79, 0.34], -0.02),
    thing("sink", [6.4, 2.49], [0.56, 0.4, 0.28], 89.98, { lift: 0.45 }),
    thing("toilet", [6.51, 1.45], [0.42, 0.67, 0.78], 89.98),
    thing("storage", [6.41, 2.49], [0.91, 0.47, 0.76], 89.98, { model: "bathroomCabinetDrawer" }),
  ], "Guest Bathroom"),
  room("8FA84888-7CE4-4513-A515-A9D56EA12656", [[6.11, 2.91], [4.67, 2.91], [4.67, 0.02], [6.11, 0.02]], [door([4.62, 0.72], [4.62, 1.33], 2.05)], [
    thing("bathtub", [5.39, 2.54], [1.47, 0.82, 0.44], 179.98),
    thing("toilet", [5.76, 1.64], [0.44, 0.73, 0.84], -90.02, { model: "toilet" }),
    thing("storage", [5.39, 0.31], [1.47, 0.58, 0.77], -0.02, { model: "bathroomCabinetDrawer" }),
    thing("sink", [5.02, 0.32], [0.49, 0.39, 0.19], -0.02, { lift: 0.57 }),
    thing("sink", [5.74, 0.34], [0.51, 0.42, 0.21], -0.02, { lift: 0.55 }),
    thing("mirror", [4.97, 0.22], [0.6, 0.29, 0.87], 0, { model: "bathroomMirror", lift: 1.1 }),
    thing("mirror", [5.83, 0.22], [0.6, 0.29, 0.87], 0, { model: "bathroomMirror", lift: 1.1 }),
  ], "Master Bathroom"),
  room("58AD9236-1B9C-48CC-9C89-5AE9B0CF09C2", [[4.61, 3.97], [0, 3.97], [0, 0], [4.61, 0]], [door([4.62, 0.7], [4.62, 1.29], 2.06), door([4.62, 3.14], [4.62, 3.86], 2.11)], [
    thing("storage", [4.34, 2.25], [1.61, 0.52, 0.89], -90.02),
    thing("storage", [0.21, 0.87], [0.52, 0.42, 0.8], 89.98),
    thing("storage", [0.21, 3.4], [0.6, 0.43, 0.82], 89.98),
    thing("bed", [0.99, 2.13], [1.6, 1.88, 0.63], 90, { model: "bedDouble" }),
  ], "Bedroom"),
  room("8B5FD520-3C9D-4511-83AF-37DF41E65307", [[10.93, 6.19], [7.66, 6.19], [7.66, 6.19], [7.66, 6.19], [7.64, 3.48], [10.91, 3.49], [10.92, 4.81]], [door([7.67, 3.55], [7.68, 4.31], 2.11)], [
    thing("table", [9.87, 4.63], [1.25, 0.84, 0.64], -179.99, { model: "desk" }),
    thing("chair", [9.91, 4.15], [0.63, 0.7, 1.09], 7.67, { model: "chairDesk" }),
    thing("sofa", [10.43, 5.49], [0.85, 0.94, 0.96], -89.99),
  ], "Chens Office"),
  room("35C038AB-F560-4043-8717-7ECF3918C429", [[7.62, 6.19], [6.83, 6.19], [4.62, 6.19], [4.62, 5.1], [4.62, 2.97], [7.62, 2.97]], [
    door([4.62, 3.87], [4.62, 3.15], 2.04),
    door([7.62, 3.01], [7.62, 3.43], 2),
    door([7.62, 3.56], [7.62, 4.32], 2.05),
    door([6.94, 2.97], [7.56, 2.97], 2.11),
  ], [], "stairs"),
];

describe("Jesse's Upstairs", () => {
  const floor = floorOf(UPSTAIRS);
  const stairs = UPSTAIRS[5]!;
  const name = (id: string) => floor.rooms.find((r) => r.id === id)!.name;

  it("finds the hall clash: the stairs' doors to Jesse Office and to Guest Bathroom swing into each other", () => {
    const found = homeMapSwingClashes(floor).map((c) => ({
      door: `${name(c.door.roomId)} ${c.door.index}`,
      hits: c.hits.map((h) => homeMapSwingHitWords(floor, c.door, h)),
    }));
    expect(found).toEqual([
      { door: "stairs 1", hits: ["Swings into the door to Guest Bathroom"] },
      { door: "stairs 3", hits: ["Swings into the door to Jesse Office"] },
    ]);
    // A third of a meter deep, the corner by Jesse Office.
    expect(homeMapSwingClashOf(floor, stairs.id, 1)!.hits[0]!.depth).toBeGreaterThan(0.3);
    // Neither door clears it hung from its other end.
    const doc = docOf(floor);
    expect(homeMapSwingFlipClears(doc, "F", stairs.id, 1)).toBe(false);
    expect(homeMapSwingFlipClears(doc, "F", stairs.id, 3)).toBe(false);
  });

  it("leaves the sliver where the door to Chens Office meets the door to Guest Bathroom alone", () => {
    const swing = (i: number) => homeMapSwingPolygon(homeDoorSwingsOf(stairs.openings[i]!, stairs)[0]!);
    const sliver = homeMapOverlapDepth(swing(2), swing(3));
    expect(sliver).toBeGreaterThan(0);
    expect(sliver).toBeLessThan(HOME_MAP_SWING_CLASH_DEPTH);
    // The doors to Jesse Office and Chens Office stand 13 cm apart on one wall
    // and their swings never meet.
    expect(homeMapOverlapDepth(swing(1), swing(2))).toBe(0);
  });
});
