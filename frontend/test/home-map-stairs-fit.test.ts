import { describe, expect, it } from "vitest";
import { homeBoxCorners, homeBoxOf, homePolygonHolds } from "../src/home-map/geometry.js";
import type { HomeMapDocument, HomeMapObject, HomeMapOpening, HomeMapRoom } from "../src/home-map/model.js";
import { addStairsToRoom, homeMapWantsStairs } from "../src/home-map/stairs-fit.js";

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
});
