import { describe, expect, it } from "vitest";
import { homeOpenEdges } from "../src/home-map/geometry.js";
import { addOpenEdgeWalls, homeMapOpenEdgeCount, homeMapOpenEdgeText } from "../src/home-map/open-edges.js";
import { homeMapClashWords, homeMapGapWords } from "../src/home-map/floor-checks.js";
import type { HomeMapDocument, HomeMapRoom } from "../src/home-map/model.js";

type P = [number, number];
const box = (id: string, x0: number, y0: number, x1: number, y1: number, walls?: [P, P][]): HomeMapRoom => {
  const outline: P[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const edges = walls ?? outline.map((p, i) => [p, outline[(i + 1) % 4]!] as [P, P]);
  return { id, outline, height: 2.5, walls: edges.map(([a, b]) => ({ a, b, t: 0.1 })), openings: [], objects: [] } as unknown as HomeMapRoom;
};

describe("a room's open edges", () => {
  it("finds none for a room walled all round", () => {
    const room = box("a", 0, 0, 4, 3);
    expect(homeOpenEdges({ rooms: [room] }, room)).toEqual([]);
  });

  it("finds a stretch with no wall and no room beside it", () => {
    // The bottom wall runs only from x 3 to 4: 3 m of the bottom is open.
    const room = box("a", 0, 0, 4, 3, [[[0, 0], [4, 0]], [[4, 0], [4, 3]], [[4, 3], [3, 3]], [[0, 3], [0, 0]]]);
    const open = homeOpenEdges({ rooms: [room] }, room);
    expect(open).toHaveLength(1);
    expect(open[0]!.side).toBe("bottom");
    expect(open[0]!.length).toBeCloseTo(3);
    expect(homeMapOpenEdgeText(open[0]!)).toBe("Bottom, 3.00 m");
  });

  it("reads a wall the room beside it holds, a few centimetres off, as closed", () => {
    // Room a has no right wall; room b, scanned apart, has its left wall 6 cm over.
    const a = box("a", 0, 0, 4, 3, [[[0, 0], [4, 0]], [[4, 3], [0, 3]], [[0, 3], [0, 0]]]);
    const b = box("b", 4.06, 0, 7, 3);
    expect(homeOpenEdges({ rooms: [a, b] }, a)).toEqual([]);
  });

  it("reads two rooms that meet with no wall between as one open space, not a hole", () => {
    const a = box("a", 0, 0, 4, 3, [[[0, 0], [4, 0]], [[4, 3], [0, 3]], [[0, 3], [0, 0]]]);
    const b = box("b", 4, 0, 7, 3, [[[4, 0], [7, 0]], [[7, 0], [7, 3]], [[7, 3], [4, 3]]]);
    expect(homeOpenEdges({ rooms: [a, b] }, a)).toEqual([]);
    expect(homeOpenEdges({ rooms: [a, b] }, b)).toEqual([]);
  });

  it("leaves out a slip shorter than 30 cm and a room drawn from its outline", () => {
    const slip = box("a", 0, 0, 4, 3, [[[0, 0], [3.8, 0]], [[4, 0], [4, 3]], [[4, 3], [0, 3]], [[0, 3], [0, 0]]]);
    expect(homeOpenEdges({ rooms: [slip] }, slip)).toEqual([]);
    const plain = { ...box("b", 0, 0, 4, 3), walls: [] };
    expect(homeOpenEdges({ rooms: [plain] }, plain)).toEqual([]);
  });
});

describe("Add walls on every gap", () => {
  const docOf = (rooms: HomeMapRoom[]) => ({ v: 1, floors: [{ id: "F", name: "Floor", story: 0, rooms, pins: [] }] }) as unknown as HomeMapDocument;

  it("closes every gap of the floor in one edit", () => {
    // Room a misses its bottom wall, room b its right one.
    const a = box("a", 0, 0, 4, 3, [[[0, 0], [4, 0]], [[4, 0], [4, 3]], [[0, 3], [0, 0]]]);
    const b = box("b", 10, 0, 13, 3, [[[10, 0], [13, 0]], [[13, 3], [10, 3]], [[10, 3], [10, 0]]]);
    const doc = docOf([a, b]);
    expect(homeMapOpenEdgeCount(doc.floors[0]!)).toBe(2);
    const done = addOpenEdgeWalls(doc, "F");
    expect(done).toBeDefined();
    expect(homeMapOpenEdgeCount(done!.floors[0]!)).toBe(0);
  });

  it("closes only the picked room's gaps when asked", () => {
    const a = box("a", 0, 0, 4, 3, [[[0, 0], [4, 0]], [[4, 0], [4, 3]], [[0, 3], [0, 0]]]);
    const b = box("b", 10, 0, 13, 3, [[[10, 0], [13, 0]], [[13, 3], [10, 3]], [[10, 3], [10, 0]]]);
    const done = addOpenEdgeWalls(docOf([a, b]), "F", "a")!;
    expect(homeMapOpenEdgeCount(done.floors[0]!)).toBe(1);
  });

  it("has nothing to do on a floor with no gap", () => {
    expect(addOpenEdgeWalls(docOf([box("a", 0, 0, 4, 3)]), "F")).toBeUndefined();
  });

  it("names the checks in plain words", () => {
    expect(homeMapGapWords(1)).toBe("1 gap in the walls");
    expect(homeMapGapWords(2)).toBe("2 gaps in the walls");
    expect(homeMapClashWords(1)).toBe("1 door swings into something");
    expect(homeMapClashWords(2)).toBe("2 doors swing into something");
  });
});
