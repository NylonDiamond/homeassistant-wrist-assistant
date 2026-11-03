// Doors that meet, Fit rooms, connecting two doors and walls drawn as one
// (`door-pairs.ts`, `edit-ops.ts`, `geometry.ts`), on a real floor scanned one
// room at a time, its measures kept and its rooms named by what they are.

import { describe, expect, it } from "vitest";

import { homeMapDoorChoices, homeMapDoorPairs, homeMapDoorPartner, homeMapOpenDoors } from "../src/home-map/door-pairs.js";
import { connectDoors, fitRooms, homeMapFitIssues, homeMapFitOf, meetDoors, scanIssues, snapRoom, turnRoom } from "../src/home-map/edit-ops.js";
import { homeOneWallPieces, homeOneWallPlaces, homeOneWallsOf } from "../src/home-map/geometry.js";
import { homeMapSplitStacked } from "../src/home-map/editor-view.js";
import type { HomeMapDocument, HomeMapFloor, HomeMapRoom } from "../src/home-map/model.js";
import { homeMapClickPick, homeMapPieceAt } from "../src/home-map/plan-pick.js";
import { homeMapRoomKey, homeMapRoomWalls3D } from "../src/home-map/scene3d.js";

const id = (n: number) => `00000000-0000-4000-8000-0000000000${String(n).padStart(2, "0")}`;

type Open = readonly [kind: "door" | "window", ax: number, ay: number, bx: number, by: number];

function room(n: number, name: string, walls: readonly (readonly [number, number, number, number, number])[], openings: readonly Open[]): HomeMapRoom {
  const xs = walls.flatMap((w) => [w[0], w[2]]);
  const ys = walls.flatMap((w) => [w[1], w[3]]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const outline: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  return {
    id: id(n),
    name,
    outline,
    height: 2.44,
    walls: walls.map((w) => ({ a: [w[0], w[1]], b: [w[2], w[3]], t: w[4] })),
    openings: openings.map((o) => ({ kind: o[0], a: [o[1], o[2]], b: [o[3], o[4]], z0: 0, z1: 2.03 })),
    objects: [],
  } as unknown as HomeMapRoom;
}

const OFFICE_A = 0;
const OFFICE_B = 4;
const HALL = 5;

/** The real floor: six rooms, ten doors, eight of them meeting. The two
 * offices hang a door each on the hall's right wall, a little under a meter
 * from the doors the hall saw. */
function floor(): HomeMapFloor {
  return {
    id: id(90),
    name: "Upstairs",
    story: 1,
    pins: [],
    rooms: [
      room(1, "Office A", [[7.67, 3.86, 7.67, 0.45, 0.05], [10.9, 0.45, 10.9, 3.86, 0.1], [7.67, 0.45, 10.9, 0.45, 0.1], [10.9, 3.86, 7.67, 3.86, 0.1]],
        [["door", 7.67, 3.82, 7.67, 3.1], ["window", 9.1, 0.45, 10.25, 0.45]]),
      room(2, "Bath A", [[7.67, 0.02, 7.67, 2.97, 0.05], [6.15, 2.97, 6.15, 0.02, 0.05], [7.67, 2.97, 6.15, 2.97, 0.05], [6.15, 0.02, 7.67, 0.02, 0.1]],
        [["door", 6.95, 2.97, 7.53, 2.97], ["window", 6.54, 0.02, 7.29, 0.02]]),
      room(3, "Bath B", [[4.62, 2.97, 4.62, 0.02, 0.05], [6.15, 0.02, 6.15, 2.97, 0.05], [4.62, 0.02, 6.15, 0.02, 0.1], [6.15, 2.97, 4.62, 2.97, 0.05]],
        [["door", 4.62, 0.72, 4.62, 1.33]]),
      room(4, "Bedroom", [[0, 0.02, 4.62, 0.02, 0.1], [4.62, 3.97, 0, 3.97, 0.1], [0, 3.97, 0, 0.02, 0.1], [4.62, 0.02, 4.62, 3.97, 0.05]],
        [["door", 4.62, 0.7, 4.62, 1.29], ["door", 4.62, 3.14, 4.62, 3.86], ["window", 1.5, 0.02, 3.07, 0.02]]),
      room(5, "Office B", [[10.92, 6.62, 7.66, 6.62, 0.1], [7.69, 6.61, 7.67, 3.86, 0.05], [7.67, 3.86, 10.9, 3.87, 0.05], [10.9, 3.87, 10.91, 5.24, 0.05], [10.91, 5.24, 10.92, 6.62, 0.05]],
        [["door", 7.67, 3.98, 7.68, 4.74], ["window", 9.58, 6.6, 8.38, 6.62]]),
      room(6, "Hall", [[4.58, 4.79, 4.58, 3.01, 0.1], [7.68, 5.71, 6.86, 5.71, 0.1], [4.58, 3.01, 7.68, 3.01, 0.1], [7.68, 3.01, 7.68, 5.71, 0.1]],
        [["door", 4.58, 3.85, 4.58, 3.14], ["door", 7.68, 4.12, 7.68, 4.61], ["door", 7.68, 4.92, 7.68, 5.64], ["door", 6.99, 3.01, 7.61, 3.01]]),
    ],
  } as unknown as HomeMapFloor;
}

const home = (f: HomeMapFloor = floor()): HomeMapDocument => ({ v: 1, floors: [f] }) as unknown as HomeMapDocument;

describe("doors that meet", () => {
  it("finds the floor's pairs, and the doors with no partner", () => {
    const pairs = homeMapDoorPairs(floor());
    expect(pairs.doors).toHaveLength(10);
    expect(pairs.met).toBe(8);
    expect(homeMapOpenDoors(pairs).map((d) => [d.roomId, d.index])).toEqual([[id(1), 0], [id(6), 2]]);
    expect(homeMapDoorPartner(pairs, id(3), 0)?.roomId).toBe(id(4));
  });

  it("never pairs a window, nor two doors with their rooms on one side", () => {
    const f = floor();
    expect(homeMapDoorPairs(f).doors.some((d) => d.roomId === id(1) && d.index === 1)).toBe(false);
    const a = room(1, "A", [[0, 0, 0, 2, 0.1]], [["door", 0, 0.5, 0, 1.5]]);
    const b = room(2, "B", [[0, 0, 0, 2, 0.1]], [["door", 0, 0.5, 0, 1.5]]);
    a.outline = [[-3, 0], [0, 0], [0, 2], [-3, 2]];
    b.outline = [[-2, 0], [0, 0], [0, 2], [-2, 2]];
    expect(homeMapDoorPairs({ rooms: [a, b] }).met).toBe(0);
  });

  it("offers the doors with no partner first", () => {
    const pairs = homeMapDoorPairs(floor());
    const open = homeMapOpenDoors(pairs)[0]!;
    expect(homeMapDoorChoices(pairs, open).map((d) => d.roomId)).toEqual([id(6)]);
  });
});

describe("Fit rooms", () => {
  it("moves the two offices together, and every door then meets", () => {
    const fit = homeMapFitOf(floor())!;
    expect(fit.before).toBe(8);
    expect(fit.after).toBe(10);
    expect(fit.doors).toBe(10);
    expect(fit.moves.map((m) => m.roomId).sort()).toEqual([id(1), id(5)]);
    expect(fit.moves[0]!.dy).toBeCloseTo(0.91, 1);
    expect(Math.abs(fit.moves[0]!.dx)).toBeLessThan(0.02);
  });

  it("offers nothing once the doors meet", () => {
    const f = floor();
    const moved = fitRooms(home(f), homeMapFitOf(f)!.moves)!;
    expect(homeMapDoorPairs(moved.floors[0]!).met).toBe(10);
    expect(homeMapFitOf(moved.floors[0]!)).toBeUndefined();
  });

  it("leaves a floor with no better place alone", () => {
    expect(homeMapFitOf({ rooms: [floor().rooms[OFFICE_A]!] })).toBeUndefined();
  });

  it("makes the narrow door of a pair as wide as the other", () => {
    const f = floor();
    const moved = fitRooms(home(f), homeMapFitOf(f)!.moves)!;
    const hall = moved.floors[0]!.rooms[HALL]!;
    const o = hall.openings[1]!;
    expect(Math.hypot(o.b[0] - o.a[0], o.b[1] - o.a[1])).toBeCloseTo(0.72, 2);
    // It stays on its own wall.
    expect(o.a[0]).toBeCloseTo(7.68, 2);
    expect(o.b[0]).toBeCloseTo(7.68, 2);
  });

  it("leaves doors that do not meet as they are", () => {
    const doc = home();
    expect(meetDoors(doc, [id(1)])).toBe(doc);
  });
});

describe("connecting two doors", () => {
  it("moves the room so its door lands on the other, and they meet", () => {
    const pulled = home();
    const next = connectDoors(pulled, id(6), 0, id(4), 1)!;
    const pairs = homeMapDoorPairs(next.floors[0]!);
    expect(homeMapDoorPartner(pairs, id(6), 0)?.roomId).toBe(id(4));
  });

  it("turns a room scanned on another heading to fit", () => {
    const doc = home();
    for (const degrees of [37, 90, 180, -120]) {
      const turned = turnRoom(doc, id(6), degrees)!;
      const next = connectDoors(turned, id(6), 0, id(4), 1)!;
      const pairs = homeMapDoorPairs(next.floors[0]!);
      expect(homeMapDoorPartner(pairs, id(6), 0)?.roomId, `after ${degrees}°`).toBe(id(4));
    }
  });

  it("refuses a door that is gone, a window and its own room", () => {
    const doc = home();
    expect(connectDoors(doc, id(6), 9, id(4), 1)).toBeUndefined();
    expect(connectDoors(doc, id(1), 1, id(6), 2)).toBeUndefined();
    expect(connectDoors(doc, id(6), 0, id(6), 1)).toBeUndefined();
  });
});

describe("a dragged room", () => {
  it("locks where the most of its doors meet", () => {
    const f = floor();
    f.rooms[OFFICE_B] = { ...f.rooms[OFFICE_B]!, openings: [] };
    // Dragged a little up and left of where its bedroom and bath doors meet.
    const snap = snapRoom(home(f), id(6), -0.1, -0.05)!;
    expect(snap.guides.filter((g) => g.door === true).map((g) => g.roomId).sort()).toEqual([id(2), id(4)]);
    expect(Math.abs(snap.dx)).toBeLessThan(0.08);
  });
});

describe("the scan check under Fit rooms", () => {
  it("drops small gaps and overlaps and a door a room does not need", () => {
    const f = floor();
    expect(scanIssues(f).some((i) => i.kind === "gap" || i.kind === "overlap")).toBe(true);
    expect(homeMapFitIssues(f).filter((i) => i.kind !== "offSquare")).toEqual([]);
  });

  it("keeps a real overlap", () => {
    const f = floor();
    const hall = f.rooms[HALL]!;
    const move = (p: readonly number[]) => [p[0]! - 0.6, p[1]!] as [number, number];
    f.rooms[HALL] = { ...hall, outline: hall.outline.map(move), walls: hall.walls.map((w) => ({ ...w, a: move(w.a), b: move(w.b) })) };
    expect(homeMapFitIssues(f).some((i) => i.kind === "overlap")).toBe(true);
  });
});

describe("one wall", () => {
  it("brings walls of two rooms onto one line, as thick as the thickest", () => {
    const f = floor();
    const hallWalls = homeOneWallsOf(f, f.rooms[HALL]!);
    const bedroomWalls = homeOneWallsOf(f, f.rooms[3]!);
    const hallLeft = hallWalls[0]!;
    const bedRight = bedroomWalls[3]!;
    expect(hallLeft.joined).toBe(true);
    expect(bedRight.joined).toBe(true);
    expect(hallLeft.a[0]).toBeCloseTo(bedRight.a[0], 6);
    expect(hallLeft.t).toBe(0.1);
    expect(bedRight.t).toBe(0.1);
  });

  it("keeps a wall with no neighbour where it is, and keeps the walls' order", () => {
    const f = floor();
    const places = homeOneWallsOf(f, f.rooms[OFFICE_A]!);
    expect(places).toHaveLength(4);
    expect(places[1]!.joined).toBe(false);
    expect(places[1]!.a).toEqual([10.9, 0.45]);
  });

  it("leaves walls more than the gap apart", () => {
    const a = room(1, "A", [[0, 0, 0, 3, 0.1]], []);
    const b = room(2, "B", [[0.2, 0, 0.2, 3, 0.1]], []);
    expect([...homeOneWallPlaces({ rooms: [a, b] }).values()].flat().some((p) => p.joined)).toBe(false);
  });

  it("cuts a door a neighbour recorded out of the shared wall", () => {
    const f = floor();
    const place = homeOneWallsOf(f, f.rooms[HALL]!)[3]!;
    const openings = f.rooms.flatMap((r) => r.openings);
    const pieces = homeOneWallPieces(place, openings);
    // The hall's right wall: the office's door at y 3.1 to 3.82 cuts it too.
    const covers = (y: number) => pieces.some((s) => Math.min(s.a[1], s.b[1]) < y && Math.max(s.a[1], s.b[1]) > y);
    expect(covers(3.4)).toBe(false);
    expect(covers(4.8)).toBe(true);
    expect(pieces.every((s) => s.t === place.t)).toBe(true);
  });
});

describe("the 3D look's walls", () => {
  it("cuts a door a neighbour recorded out of this room's wall", () => {
    const f = floor();
    const hallRight = homeMapRoomWalls3D(f.rooms[HALL]!, f).find((w) => w.wall === 3)!;
    // The hall's own two doors, and the office's door at y 3.1 to 3.82 that used
    // to stand behind a solid wall.
    const at = (y: number) => hallRight.cuts.some((c) => c.s0 <= y - hallRight.ay && c.s1 >= y - hallRight.ay);
    expect(at(3.4)).toBe(true);
    expect(at(4.3)).toBe(true);
    expect(at(5.3)).toBe(true);
    expect(at(3.05)).toBe(false);
  });

  it("names the cuts this room recorded, so only those pick", () => {
    const f = floor();
    const hallRight = homeMapRoomWalls3D(f.rooms[HALL]!, f).find((w) => w.wall === 3)!;
    expect(hallRight.cuts.map((c) => c.opening)).toContain(1);
    expect(hallRight.cuts.some((c) => c.opening === undefined)).toBe(true);
  });

  it("makes doors that overlap one opening", () => {
    const f = floor();
    const moved = fitRooms(home(f), homeMapFitOf(f)!.moves)!.floors[0]!;
    const hallRight = homeMapRoomWalls3D(moved.rooms[HALL]!, moved).find((w) => w.wall === 3)!;
    expect(hallRight.cuts).toHaveLength(2);
  });

  it("stands each room's wall on its own side of a shared line", () => {
    const f = floor();
    const hallLeft = homeMapRoomWalls3D(f.rooms[HALL]!, f).find((w) => w.wall === 0)!;
    const bedRight = homeMapRoomWalls3D(f.rooms[3]!, f).find((w) => w.wall === 3)!;
    expect(hallLeft.thick).toBeCloseTo(0.05, 5);
    expect(hallLeft.ax).toBeGreaterThan(bedRight.ax);
    expect(hallLeft.ax - bedRight.ax).toBeCloseTo(0.05, 5);
  });

  it("builds a room again only when a neighbour moves onto its walls", () => {
    const f = floor();
    const far = { ...f, rooms: f.rooms.map((r, i) => (i === OFFICE_A ? { ...r, name: "Moved" } : r)) };
    expect(homeMapRoomKey(f.rooms[3]!, f)).toBe(homeMapRoomKey(far.rooms[3]!, far));
    const moved = fitRooms(home(f), homeMapFitOf(f)!.moves)!.floors[0]!;
    expect(homeMapRoomKey(f.rooms[HALL]!, f)).not.toBe(homeMapRoomKey(moved.rooms[HALL]!, moved));
  });
});

describe("what a click on the plan picks", () => {
  const toScreen = (p: readonly number[]): [number, number] => [p[0]! * 100, p[1]! * 100];

  it("finds a door, then a wall, then the floor", () => {
    const f = floor();
    expect(homeMapPieceAt(f, toScreen, [10.9, 2])).toEqual({ kind: "wall", roomId: id(1), wall: 1 });
    expect(homeMapPieceAt(f, toScreen, [9.6, 0.45])).toEqual({ kind: "opening", roomId: id(1), opening: 1 });
    expect(homeMapPieceAt(f, toScreen, [9, 2])).toBeUndefined();
    expect(homeMapClickPick(f, toScreen, [9, 2])).toEqual({ kind: "room", roomId: id(1) });
  });

  it("reaches a wall 12 pixels off over a bare floor, and leaves a thing standing there", () => {
    const f = floor();
    expect(homeMapPieceAt(f, toScreen, [10.8, 2])).toEqual({ kind: "wall", roomId: id(1), wall: 1 });
    const withThing = { ...f, rooms: f.rooms.map((r, i) => (i === OFFICE_A ? { ...r, objects: [{ kind: "table", c: [10.5, 2], size: [1, 1, 1], turn: 0 }] } : r)) } as unknown as HomeMapFloor;
    expect(homeMapPieceAt(withThing, toScreen, [10.8, 2])).toBeUndefined();
    expect(homeMapPieceAt(withThing, toScreen, [10.86, 2])?.kind).toBe("wall");
  });

  it("takes the wall of the room already picked, of two side by side", () => {
    const f = floor();
    expect(homeMapPieceAt(f, toScreen, [7.68, 2], id(2))).toEqual({ kind: "wall", roomId: id(2), wall: 0 });
    expect(homeMapPieceAt(f, toScreen, [7.68, 2], id(1))).toEqual({ kind: "wall", roomId: id(1), wall: 0 });
  });
});

describe("which way Both splits", () => {
  it("stacks in a tall window and sits side by side in a wide one", () => {
    expect(homeMapSplitStacked(1300, 1700, 11, 6.6)).toBe(true);
    expect(homeMapSplitStacked(2000, 800, 11, 6.6)).toBe(false);
    expect(homeMapSplitStacked(0, 800, 11, 6.6)).toBe(false);
  });
});
