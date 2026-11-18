import { describe, expect, it } from "vitest";
import { homeOpenEdges } from "../src/home-map/geometry.js";
import { homeMapOpenEdgeText } from "../src/home-map/open-edges.js";
import type { HomeMapRoom } from "../src/home-map/model.js";

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
