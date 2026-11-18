import { describe, expect, it } from "vitest";
import { setFloorPlace } from "../src/home-map/edit-ops.js";
import {
  homeMapFloorBelow,
  homeMapFloorBelowOutlines,
  homeMapFloorPlaceOf,
  homeMapLineUpFloor,
  homeMapLineUpWords,
  homeMapPlaceApply,
  homeMapPlaceTurned,
  homeMapPlaceUnapply,
} from "../src/home-map/floor-stack.js";
import type { HomeMapDocument, HomeMapFloor } from "../src/home-map/model.js";

type P = [number, number];
const floor = (id: string, story: number, outline: P[], place?: HomeMapFloor["place"]): HomeMapFloor => ({
  id, name: id, story, ...(place === undefined ? {} : { place }),
  rooms: [{ id: `${id}-r`, outline, height: 2.5, walls: [], openings: [], objects: [] }],
  pins: [],
} as unknown as HomeMapFloor);

const ground = floor("ground", 0, [[0, 0], [10, 0], [10, 6], [0, 6]]);
const upstairs = floor("up", 1, [[0, 0], [4, 0], [4, 2], [0, 2]]);

// The same rules as the app's HomeMapStack ("Stacked floors").
describe("floors stacked in the house", () => {
  it("turns as the plan says: at 90 the point (1, 0) lands at (0, -1) before the move", () => {
    const p = homeMapPlaceApply({ x: 0, y: 0, turn: 90 }, [1, 0]);
    expect(p[0]).toBeCloseTo(0);
    expect(p[1]).toBeCloseTo(-1);
    const moved = homeMapPlaceApply({ x: 1.25, y: -0.5, turn: 0 }, [1, 1]);
    expect(moved).toEqual([2.25, 0.5]);
  });

  it("takes a point back to the floor's plan", () => {
    const place = { x: 3, y: -2, turn: 33 };
    const back = homeMapPlaceUnapply(place, homeMapPlaceApply(place, [1.5, 4]));
    expect(back[0]).toBeCloseTo(1.5);
    expect(back[1]).toBeCloseTo(4);
  });

  it("centres a floor with no place on the base floor, and never moves the base", () => {
    const floors = [upstairs, ground];
    expect(homeMapFloorPlaceOf(floors, ground)).toEqual({ x: 0, y: 0, turn: 0 });
    expect(homeMapFloorPlaceOf(floors, upstairs)).toEqual({ x: 3, y: 2, turn: 0 });
    expect(homeMapFloorPlaceOf([floor("g", 0, [[0, 0], [1, 0], [1, 1]], { x: 9, y: 9, turn: 9 }), upstairs], floor("g", 0, [[0, 0], [1, 0], [1, 1]], { x: 9, y: 9, turn: 9 }))).toEqual({ x: 0, y: 0, turn: 0 });
  });

  it("finds the floor right below by story, a tie in the map's order", () => {
    const top = floor("top", 2, [[0, 0], [1, 0], [1, 1]]);
    expect(homeMapFloorBelow([top, upstairs, ground], "top")?.id).toBe("up");
    expect(homeMapFloorBelow([top, upstairs, ground], "ground")).toBeUndefined();
  });

  it("turns round the floor's middle, which stays put", () => {
    const place = { x: 1, y: 2, turn: 0 };
    const pivot: P = [2, 1];
    const turned = homeMapPlaceTurned(place, 90, pivot);
    const before = homeMapPlaceApply(place, pivot);
    const after = homeMapPlaceApply(turned, pivot);
    expect(after[0]).toBeCloseTo(before[0]);
    expect(after[1]).toBeCloseTo(before[1]);
    expect(turned.turn).toBe(90);
  });

  it("draws the floor below where it lies under this one", () => {
    const doc = { floors: [ground, { ...upstairs, place: { x: 2, y: 1, turn: 0 } }] } as unknown as HomeMapDocument;
    const [outline] = homeMapFloorBelowOutlines(doc, doc.floors[1]!);
    // Ground's corner 0, 0 sits at -2, -1 in the plan of a floor moved by 2, 1.
    expect(outline![0]).toEqual([-2, -1]);
    expect(homeMapFloorBelowOutlines(doc, doc.floors[0]!)).toEqual([]);
  });

  it("stores a place at 2 decimals, the turn within -180 to 180, keys in the store's order, and centres again with none", () => {
    const doc = { v: 1, floors: [ground, upstairs] } as unknown as HomeMapDocument;
    const placed = setFloorPlace(doc, "up", { x: 1.234, y: -0.5, turn: 270 })!;
    expect(placed.floors[1]!.place).toEqual({ x: 1.23, y: -0.5, turn: -90 });
    expect(Object.keys(placed.floors[1]!)).toEqual(["id", "name", "story", "place", "rooms", "pins"]);
    expect(setFloorPlace(placed, "up", undefined)!.floors[1]!.place).toBeUndefined();
    expect(setFloorPlace(doc, "up", { x: 600, y: 0, turn: 0 })).toBeUndefined();
    expect(setFloorPlace(doc, "nope", { x: 0, y: 0, turn: 0 })).toBeUndefined();
  });
});

// Line up for me: the place where the floor's rooms lie most over the
// floor below's.
describe("Line up for me", () => {
  // An L shaped house, so only one turn and one place fit.
  const lShape: P[] = [[0, 0], [9, 0], [9, 4], [4, 4], [4, 8], [0, 8]];
  const groundL = floor("ground", 0, lShape);

  it("brings back a floor that was turned a quarter and moved", () => {
    // The same outline in its own plan, as a scan that started turned and
    // somewhere else would give it: each point taken out of the house by a
    // place the search does not know.
    const truth = { x: 2.3, y: -1.7, turn: 90 };
    const scanned = lShape.map((q) => homeMapPlaceUnapply(truth, q).map((v) => Math.round(v * 1000) / 1000) as P);
    const up = floor("up", 1, scanned);
    const t0 = performance.now();
    const found = homeMapLineUpFloor({ floors: [groundL, up] }, "up");
    const took = performance.now() - t0;
    expect(found).toBeDefined();
    expect(found!.place.turn).toBeCloseTo(90);
    expect(found!.place.x).toBeCloseTo(truth.x, 0);
    expect(found!.place.y).toBeCloseTo(truth.y, 0);
    expect(Math.abs(found!.place.x - truth.x)).toBeLessThan(0.06);
    expect(Math.abs(found!.place.y - truth.y)).toBeLessThan(0.06);
    expect(found!.match).toBeGreaterThan(0.95);
    expect(took).toBeLessThan(400);
  });

  it("puts a smaller floor over the part of the floor below it fits", () => {
    const wing: P[] = [[0, 0], [4, 0], [4, 4], [0, 4]];
    const up = floor("up", 1, wing.map(([x, y]) => [x + 20, y + 30] as P));
    const found = homeMapLineUpFloor({ floors: [groundL, up] }, "up")!;
    // Inside the house's outline wherever it lands.
    const corners = wing.map(([x, y]) => homeMapPlaceApply(found.place, [x + 20, y + 30]));
    for (const [x, y] of corners) {
      expect(x).toBeGreaterThan(-0.1);
      expect(y).toBeGreaterThan(-0.1);
      expect(x).toBeLessThan(9.1);
      expect(y).toBeLessThan(8.1);
    }
  });

  it("has nothing to line up for the base floor", () => {
    expect(homeMapLineUpFloor({ floors: [groundL, upstairs] }, "ground")).toBeUndefined();
  });

  it("says how much matches", () => {
    expect(homeMapLineUpWords(0.923)).toBe("Lined up. 92% of the floor matches the one below.");
    expect(homeMapLineUpWords(0.41)).toBe("Lined up as well as it goes: 41% matches. Check the walls by eye.");
  });
});
