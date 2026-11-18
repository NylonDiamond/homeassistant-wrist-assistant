import { describe, expect, it } from "vitest";
import { homeBoxCorners, homeBoxOf, homePolygonHolds } from "../src/home-map/geometry.js";
import type { HomeMapDocument, HomeMapObject, HomeMapOpening, HomeMapRoom } from "../src/home-map/model.js";
import { addStairsToRoom, homeMapWantsStairs } from "../src/home-map/stairs-fit.js";
import { moveObject, resizeObject, turnObject } from "../src/home-map/edit-ops.js";

type P = [number, number];
const room = (name: string, outline: P[], openings: HomeMapOpening[] = [], objects: HomeMapObject[] = []): HomeMapRoom => ({
  id: "R", name, outline, height: 2.5,
  walls: outline.map((a, i) => ({ a, b: outline[(i + 1) % outline.length]!, t: 0.1 })),
  openings, objects,
}) as unknown as HomeMapRoom;
const docOf = (r: HomeMapRoom) => ({ v: 1, floors: [{ id: "F", name: "Floor", story: 0, rooms: [r], pins: [] }] }) as unknown as HomeMapDocument;

describe("Add stairs here", () => {
  it("asks for stairs in a room named for them that holds none", () => {
    expect(homeMapWantsStairs({ name: "stairs", objects: [] })).toBe(true);
    expect(homeMapWantsStairs({ name: "Stairwell", objects: [] })).toBe(true);
    expect(homeMapWantsStairs({ name: "Bedroom", objects: [] })).toBe(false);
    expect(homeMapWantsStairs({ name: "stairs", objects: [{ kind: "stairs", c: [0, 0], size: [1, 3, 2.6], turn: 0 }] })).toBe(false);
  });

  it("puts a flight in the room along its long way, inside its walls, against the wall with no door", () => {
    // 2 m across, 4 m long; a door in the middle of the left wall.
    const outline: P[] = [[0, 0], [2, 0], [2, 4], [0, 4]];
    const r = room("stairs", outline, [{ kind: "door", a: [0, 1.6], b: [0, 2.4], z0: 0, z1: 2.05 }]);
    const out = addStairsToRoom(docOf(r), "R")!;
    const flight = out.floors[0]!.rooms[0]!.objects[0]!;
    expect(flight.model).toBe("stairsFlight");
    expect(flight.kind).toBe("stairs");
    // Its depth, 3 m, runs down the room, y.
    expect(flight.size[1]).toBeCloseTo(3);
    const corners = homeBoxCorners(homeBoxOf(flight));
    const ys = corners.map((p) => p[1]);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(3, 1);
    for (const p of corners) expect(homePolygonHolds(outline, p)).toBe(true);
    // Against the right wall, away from the door.
    expect(flight.c[0]).toBeGreaterThan(1);
  });

  it("does nothing in a room too small for a flight", () => {
    const r = room("stairs", [[0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5]]);
    expect(addStairsToRoom(docOf(r), "R")).toBeUndefined();
  });

  it("keeps the flight wholly inside a real stairs room, off its four doors", () => {
    // The live map's stairs room: 3 m across, 3.22 m down, a door on the
    // left wall, two on the right and one in the top wall's right end.
    const outline: P[] = [[7.62, 6.19], [6.83, 6.19], [4.62, 6.19], [4.62, 5.1], [4.62, 2.97], [7.62, 2.97]];
    const r = room("stairs", outline, [
      { kind: "door", a: [4.62, 3.87], b: [4.62, 3.15], z0: 0, z1: 2.04 },
      { kind: "door", a: [7.62, 3.01], b: [7.62, 3.43], z0: 0, z1: 2 },
      { kind: "door", a: [7.62, 3.56], b: [7.62, 4.32], z0: 0, z1: 2.05 },
      { kind: "door", a: [6.94, 2.97], b: [7.56, 2.97], z0: 0, z1: 2.11 },
    ]);
    const flight = addStairsToRoom(docOf(r), "R")!.floors[0]!.rooms[0]!.objects[0]!;
    for (const p of homeBoxCorners(homeBoxOf(flight))) expect(homePolygonHolds(outline, p)).toBe(true);
    // Along the bottom wall, which has no door.
    expect(flight.size[1]).toBeCloseTo(2.8);
    expect(flight.c[1]).toBeGreaterThan(5.5);
  });
});

describe("stairs stay inside their room", () => {
  // The live stairs room, and the flight Add stairs here puts in it.
  const outline: P[] = [[7.62, 6.19], [6.83, 6.19], [4.62, 6.19], [4.62, 5.1], [4.62, 2.97], [7.62, 2.97]];
  const flightDoc = () => addStairsToRoom(docOf(room("stairs", outline)), "R")!;
  const thing = (d: HomeMapDocument) => d.floors[0]!.rooms[0]!.objects[0]!;
  const inside = (o: HomeMapObject) => homeBoxCorners(homeBoxOf(o)).every((p) => homePolygonHolds(outline, p));

  it("slides a flight back in when a turn would push it through a wall", () => {
    for (const degrees of [10, 15, 30, 45, -20]) {
      const turned = thing(turnObject(flightDoc(), "R", 0, degrees)!);
      expect(inside(turned), `turned ${degrees}`).toBe(true);
    }
  });

  it("stops a dragged flight at the wall", () => {
    const moved = thing(moveObject(flightDoc(), "R", 0, [6, 7.5])!);
    expect(inside(moved)).toBe(true);
  });

  it("leaves a flight too big for the room where it is", () => {
    const big = thing(resizeObject(flightDoc(), "R", 0, { depth: 4 })!);
    expect(big.size[1]).toBeCloseTo(4);
  });

  it("leaves any other thing where it is put", () => {
    const sofa: HomeMapObject = { kind: "sofa", c: [5, 3], size: [2, 1, 0.8], turn: 0 };
    const out = thing(moveObject(docOf(room("stairs", outline, [], [sofa])), "R", 0, [5, 2])!);
    expect(out.c).toEqual([5, 2]);
  });
});
