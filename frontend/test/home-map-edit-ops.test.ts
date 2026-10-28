// The map editor's edits (`edit-ops.ts`): each returns a new document and
// never changes the one it was given, every result passes the store's
// checks, and each does what the editor's Arrange, Shape, Devices and Style
// modes need. The shared fixture (`tests/fixtures/home_map/basic.json`) is a
// living room 6 by 5 m beside a kitchen 4 by 5 m sharing the wall at x 6,
// with a way through it; small boxes are built here for the rest.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  HomeMapHistory,
  addCorner,
  addFloor,
  addInnerWall,
  addObject,
  addOpening,
  addPin,
  addStairs,
  centerPinInRoom,
  deleteFloor,
  deleteRoom,
  drawRoom,
  fixAllIssues,
  fixIssue,
  homeMapBesidePlacement,
  homeMapLevelTurn,
  homeMapOpeningWall,
  homeMapPinsOfRoom,
  homeMapPlaceHeight,
  homeMapSquaredOutline,
  homeStyleOf,
  levelRoom,
  moveCorner,
  moveObject,
  moveOpening,
  movePin,
  moveRoom,
  moveRoomToFloor,
  placeAllByArea,
  removeCorner,
  removeObject,
  removeOpening,
  removePin,
  removeWall,
  renameFloor,
  renameRoom,
  sameHeightForLights,
  scanIssues,
  setHomeStyle,
  setObject,
  setObjectHidden,
  setOpening,
  setPinFields,
  setPinHeight,
  setRoomArea,
  setRoomFinish,
  setRoomPage,
  homeMapRoomFrame,
  resizeObject,
  resizeRoom,
  snapObject,
  snapRoomResize,
  turnObject,
  levelObject,
  HOME_MAP_MIN_OBJECT_SIZE,
  setWallHeight,
  setWallLength,
  setWallThickness,
  snapRoom,
  snapRoomToWalls,
  splitRoom,
  squareCorners,
  straightenWall,
  tileHasOwnStyle,
  tileOptionsResolved,
  tileStyleKey,
  turnRoom,
  withoutTileStyle,
} from "../src/home-map/edit-ops.js";
import { homeMapRoomWalls } from "../src/home-map/edit-ops.js";
import { segmentLength } from "../src/home-map/geometry.js";
import { type HomeMapDocument, type HomeMapRoom, type HomePoint, checkHomeMap } from "../src/home-map/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const PAGE = "C3A0E000-0000-4000-8000-0000000000CC";
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

/** The edit's result, checked as the store checks it, and the input left
 * as it was. */
function done(before: HomeMapDocument, after: HomeMapDocument | undefined): HomeMapDocument {
  expect(after).toBeDefined();
  const text = JSON.stringify(before);
  const out = checkHomeMap(after);
  if (!out.ok) throw new Error(out.message);
  // Already as the store keeps it: rounded and in order.
  expect(JSON.stringify(out.doc)).toBe(JSON.stringify(after));
  expect(JSON.stringify(before)).toBe(text);
  return after!;
}

const room = (doc: HomeMapDocument, roomId: string) => doc.floors.flatMap((f) => f.rooms).find((r) => r.id === roomId)!;
const pinOf = (doc: HomeMapDocument, pinId: string) => doc.floors.flatMap((f) => f.pins).find((p) => p.id === pinId)!;

/** A box room `w` by `h` with its corner at `x`, `y`, walls along each
 * edge. */
function box(roomId: string, x: number, y: number, w: number, h: number, name?: string): HomeMapRoom {
  const outline: HomePoint[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  return {
    id: roomId,
    ...(name === undefined ? {} : { name }),
    outline,
    height: 2.5,
    walls: outline.map((p, i) => ({ a: p, b: outline[(i + 1) % 4]!, t: 0.1 })),
    openings: [],
    objects: [],
  };
}

function home(rooms: HomeMapRoom[]): HomeMapDocument {
  return { v: 1, floors: [{ id: FLOOR, name: "Ground floor", story: 0, rooms, pins: [] }] };
}

// ── Arrange ──────────────────────────────────────────────────────────────

describe("moving and turning a room", () => {
  it("moves everything in the room and its pins, not the next room's", () => {
    const doc = fixture();
    const out = done(doc, moveRoom(doc, LIVING, 1, -0.5));
    const living = room(out, LIVING);
    expect(living.outline[0]).toEqual([1, -0.5]);
    expect(living.walls[0]!.a).toEqual([1, -0.5]);
    expect(living.openings[0]!.a).toEqual([2.4, -0.5]);
    expect(living.objects[0]!.c).toEqual([3.7, 3.65]);
    expect(pinOf(out, READING).at).toEqual([1.8, 2.6, 1.5]);
    expect(pinOf(out, PENDANTS).at).toEqual([8.1, 2.5, 2.1]);
    expect(room(out, KITCHEN)).toEqual(room(doc, KITCHEN));
  });

  it("moves a pin that names no room but stands inside it", () => {
    const doc = fixture();
    delete doc.floors[0]!.pins[0]!.roomId;
    expect(homeMapPinsOfRoom(doc.floors[0]!, LIVING).map((p) => p.id)).toContain(READING);
    expect(pinOf(done(doc, moveRoom(doc, LIVING, 1, 0)), READING).at[0]).toBe(1.8);
  });

  it("turns round the room's middle, clockwise on screen, the furniture's turn too", () => {
    const doc = fixture();
    const out = done(doc, turnRoom(doc, LIVING, 90));
    const living = room(out, LIVING);
    // The 6 by 5 room round (3, 2.5): corner 0, 0 goes to 5.5, -0.5.
    expect(living.outline[0]).toEqual([5.5, -0.5]);
    expect(living.objects[0]!.turn).toBe(-90);
    expect(segmentLength(living.walls[0]!)).toBeCloseTo(6, 5);
    const back = done(out, turnRoom(out, LIVING, -90));
    expect(room(back, LIVING).outline).toEqual(room(doc, LIVING).outline);
  });

  it("levels a room by its longest wall", () => {
    const doc = done(fixture(), turnRoom(fixture(), LIVING, 7));
    expect(homeMapLevelTurn(room(doc, LIVING))).toBeCloseTo(-7, 0);
    const out = done(doc, levelRoom(doc, LIVING));
    const w = room(out, LIVING).walls[0]!;
    expect(Math.abs(w.a[1] - w.b[1])).toBeLessThan(0.02);
  });

  it("refuses a room the map no longer has", () => {
    expect(moveRoom(fixture(), id(99), 1, 1)).toBeUndefined();
    expect(turnRoom(fixture(), id(99), 90)).toBeUndefined();
  });
});

describe("snapping a dragged room", () => {
  const two = () => home([box(id(1), 0, 0, 4, 3, "Living"), box(id(2), 4.18, 0.06, 2, 3, "Hall")]);

  it("pulls a near wall onto a neighbour's, or a wall's thickness from it, with a guide", () => {
    const doc = two();
    const snap = snapRoom(doc, id(2), 0, 0)!;
    // Its left wall is 18 cm from the living room's right wall: within
    // 15 cm of the wall's thickness, so it lands 10 cm off; its top lines up.
    expect(snap.dx).toBeCloseTo(-0.08, 5);
    expect(snap.dy).toBeCloseTo(-0.06, 5);
    expect(snap.guides.length).toBeGreaterThan(0);
    expect(snap.guides.every((g) => g.roomId === id(1))).toBe(true);
  });

  it("leaves a move alone when no wall is near", () => {
    const snap = snapRoom(two(), id(2), 3, 3)!;
    expect(snap).toEqual({ dx: 3, dy: 3, guides: [] });
    const alone = home([box(id(1), 0, 0, 4, 3)]);
    expect(snapRoom(alone, id(1), 0.5, 0)).toEqual({ dx: 0.5, dy: 0, guides: [] });
  });

  it("Snap to Walls turns a room square to the floor and sets it against its neighbour", () => {
    const doc = done(two(), turnRoom(two(), id(2), 3));
    const out = done(doc, snapRoomToWalls(doc, id(2)));
    const hall = room(out, id(2));
    const w = hall.walls[0]!;
    expect(Math.abs(w.a[1] - w.b[1])).toBeLessThan(0.02);
    const minX = Math.min(...hall.outline.map((p) => p[0]));
    expect([4, 4.1].some((x) => Math.abs(minX - x) < 0.03)).toBe(true);
  });
});

describe("resizing a room", () => {
  const size = (r: HomeMapRoom) => {
    const f = homeMapRoomFrame(r)!;
    return { width: f.a1 - f.a0, depth: f.c1 - f.c0 };
  };

  it("stretches a box room from one side, carrying its doors, things and pins, ids kept", () => {
    const doc = fixture();
    const out = done(doc, resizeRoom(doc, LIVING, { width: 8, anchor: [0, 0.5] }));
    const living = room(out, LIVING);
    expect(living.id).toBe(LIVING);
    expect(living.outline).toEqual([[0, 0], [8, 0], [8, 5], [0, 5]]);
    expect(living.walls.map((w) => w.t)).toEqual([0.1, 0.1, 0.1, 0.1]);
    // The window's middle moves from 2.4 to 3.2, its 2 m width kept; the
    // door in the side that stayed does not move; the way through moves with
    // its wall.
    expect(living.openings[0]).toMatchObject({ kind: "window", a: [2.2, 0], b: [4.2, 0] });
    expect(living.openings[1]).toMatchObject({ kind: "door", a: [0, 1.5], b: [0, 2.5] });
    expect(living.openings[2]).toMatchObject({ kind: "opening", a: [8, 2], b: [8, 3] });
    expect(living.objects[0]).toMatchObject({ kind: "sofa", c: [3.6, 4.15], size: [3, 0.9, 0.75], turn: 0 });
    expect(pinOf(out, READING).at).toEqual([1.07, 3.1, 1.5]);
    expect(pinOf(out, CEILING).at).toEqual([4.27, 1.8, 2.4]);
    expect(pinOf(out, PENDANTS)).toEqual(pinOf(doc, PENDANTS));
    expect(room(out, KITCHEN)).toEqual(room(doc, KITCHEN));
    expect(out.floors[0]!.pins.map((p) => p.id)).toEqual(doc.floors[0]!.pins.map((p) => p.id));
  });

  it("shrinks about its middle, keeping the furniture inside", () => {
    const doc = fixture();
    const out = done(doc, resizeRoom(doc, LIVING, { depth: 2 }));
    const living = room(out, LIVING);
    expect(living.outline).toEqual([[0, 1.5], [6, 1.5], [6, 3.5], [0, 3.5]]);
    expect(living.openings[0]).toMatchObject({ a: [1.4, 1.5], b: [3.4, 1.5] });
    // The sofa, 0.9 m deep, would stand at 3.16 and stick out of the wall at
    // 3.5, so it is kept 0.45 m off it; the television fits where it lands.
    expect(living.objects[0]!.c).toEqual([2.7, 3.05]);
    expect(living.objects[2]!.c).toEqual([2.8, 1.64]);
    expect(living.objects[0]!.size).toEqual([3, 0.9, 0.75]);
  });

  it("resizes a turned room along its own walls", () => {
    const doc = done(home([box(id(1), 0, 0, 4, 3)]), turnRoom(home([box(id(1), 0, 0, 4, 3)]), id(1), 30));
    const before = homeMapRoomFrame(room(doc, id(1)))!;
    const out = done(doc, resizeRoom(doc, id(1), { width: 6, anchor: [0, 0] }));
    const turned = room(out, id(1));
    const after = homeMapRoomFrame(turned)!;
    expect(size(turned).width).toBeCloseTo(6, 1);
    expect(size(turned).depth).toBeCloseTo(3, 1);
    expect(after.a0).toBeCloseTo(before.a0, 1);
    expect(after.c0).toBeCloseTo(before.c0, 1);
    const w = turned.walls[0]!;
    expect((Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]) * 180) / Math.PI).toBeCloseTo(30, 0);
    expect(segmentLength(w)).toBeCloseTo(6, 1);
  });

  it("keeps a door inside its wall, cut to the wall when the wall gets shorter", () => {
    const one = box(id(1), 0, 0, 4, 3);
    one.openings = [{ kind: "door", a: [2.8, 0], b: [3.8, 0], z0: 0, z1: 2 }];
    const doc = home([one]);
    const short = room(done(doc, resizeRoom(doc, id(1), { width: 1.5, anchor: [0, 0] })), id(1));
    expect(short.openings[0]).toMatchObject({ a: [0.5, 0], b: [1.5, 0] });
    const tiny = room(done(doc, resizeRoom(doc, id(1), { width: 0.8, anchor: [0, 0] })), id(1));
    expect(tiny.openings[0]).toMatchObject({ a: [0, 0], b: [0.8, 0] });
  });

  it("keeps a room at least 0.5 m each way, and refuses what no longer fits", () => {
    const doc = fixture();
    const out = done(doc, resizeRoom(doc, LIVING, { width: 0.1, depth: 0, anchor: [0, 0] }));
    expect(size(room(out, LIVING)).width).toBeCloseTo(0.5, 5);
    expect(size(room(out, LIVING)).depth).toBeCloseTo(0.5, 5);
    expect(resizeRoom(doc, id(99), { width: 3 })).toBeUndefined();
    expect(resizeRoom(doc, LIVING, { width: Number.NaN })).toBeUndefined();
  });

  it("snaps a dragged side to a neighbour's wall, with a guide", () => {
    const doc = home([box(id(1), 0, 0, 4, 3, "Living"), box(id(2), 4.1, 0, 2, 2.5, "Hall")]);
    // The right side dragged to 3.95: a wall's thickness off the hall's left
    // wall is 4.0, 5 cm away.
    const snap = snapRoomResize(doc, id(1), { width: 3.95, anchor: [0, 0.5] }, { a: 1 })!;
    expect(snap.resize.width).toBeCloseTo(4, 5);
    expect(snap.guides.length).toBeGreaterThan(0);
    expect(snap.guides.every((g) => g.roomId === id(2))).toBe(true);
    // A corner: each dragged side snaps; kept in proportion, only the
    // nearest does (the bottom, onto the hall's bottom at 2.5) and the
    // width follows it.
    const corner = { width: 3.9, depth: 2.55, anchor: [0, 0] as const };
    const free = snapRoomResize(doc, id(1), corner, { a: 1, c: 1 })!;
    expect(free.resize.width).toBeCloseTo(4, 5);
    expect(free.resize.depth).toBeCloseTo(2.5, 5);
    const kept = snapRoomResize(doc, id(1), corner, { a: 1, c: 1 }, { proportional: true })!;
    expect(kept.resize.depth).toBeCloseTo(2.5, 5);
    expect(kept.resize.width).toBeCloseTo((4 * 2.5) / 3, 5);
    // Nothing near: the resize as it was.
    const far = { width: 2, anchor: [0, 0.5] as const };
    expect(snapRoomResize(doc, id(1), far, { a: 1 })).toEqual({ resize: far, guides: [] });
  });
});

describe("floors", () => {
  it("adds, renames and deletes a floor", () => {
    const doc = fixture();
    const added = done(doc, addFloor(doc, { id: id(5), name: " Upstairs ", story: 1 }));
    expect(added.floors[1]).toEqual({ id: id(5), name: "Upstairs", story: 1, rooms: [], pins: [] });
    expect(addFloor(added, { id: id(5), name: "Again", story: 2 })).toBeUndefined();
    const renamed = done(added, renameFloor(added, id(5), "Loft", 2));
    expect(renamed.floors[1]!.name).toBe("Loft");
    expect(renamed.floors[1]!.story).toBe(2);
    expect(done(renamed, deleteFloor(renamed, id(5))).floors).toHaveLength(1);
  });

  it("moves a room to an empty floor at 0, 0 with its pins, keeping the old floor", () => {
    const doc = done(fixture(), addFloor(fixture(), { id: id(5), name: "Upstairs", story: 1 }));
    const out = done(doc, moveRoomToFloor(doc, KITCHEN, { floorId: id(5) }));
    expect(out.floors[0]!.rooms.map((r) => r.id)).toEqual([LIVING]);
    const kitchen = out.floors[1]!.rooms[0]!;
    expect(kitchen.outline[0]).toEqual([0, 0]);
    expect(out.floors[1]!.pins.map((p) => p.entityId)).toEqual(["light.pendants", "climate.thermostat"]);
    expect(out.floors[1]!.pins[0]!.at).toEqual([2.1, 2.5, 2.1]);
    expect(out.floors[1]!.pins.every((p) => p.roomId === KITCHEN)).toBe(true);
  });

  it("sets a moved room right of the floor's rooms, and takes an emptied floor off the map", () => {
    let doc = done(fixture(), addFloor(fixture(), { id: id(5), name: "Upstairs", story: 1 }));
    doc = done(doc, drawRoom(doc, id(5), id(6), [[0, 0], [3, 0], [3, 3], [0, 3]], "Loft"));
    const out = done(doc, moveRoomToFloor(doc, id(6), { floorId: FLOOR }));
    expect(out.floors).toHaveLength(1);
    const loft = room(out, id(6));
    expect(Math.min(...loft.outline.map((p) => p[0]))).toBe(11);
    expect(Math.min(...loft.outline.map((p) => p[1]))).toBe(0);
    expect(homeMapBesidePlacement([loft], []).offset).toEqual([-11, -0]);
  });

  it("moves a room onto a new floor it makes, and once only", () => {
    const doc = fixture();
    const out = done(doc, moveRoomToFloor(doc, KITCHEN, { newFloor: { id: id(7), name: "Annex", story: 1 } }));
    expect(out.floors.map((f) => f.name)).toEqual(["Ground floor", "Annex"]);
    expect(moveRoomToFloor(out, KITCHEN, { newFloor: { id: id(7), name: "Annex", story: 1 } })).toBe(out);
    expect(moveRoomToFloor(doc, KITCHEN, { floorId: id(99) })).toBeUndefined();
  });
});

describe("a room's settings", () => {
  it("deletes a room with its pins, and the floor once it is empty", () => {
    const doc = fixture();
    const out = done(doc, deleteRoom(doc, KITCHEN));
    expect(out.floors[0]!.rooms).toHaveLength(1);
    expect(out.floors[0]!.pins.map((p) => p.entityId)).toEqual(["light.reading_lamp", "light.ceiling", "lock.side_door"]);
    expect(done(out, deleteRoom(out, LIVING)).floors).toEqual([]);
  });

  it("renames, sets the area, page, finish and wall height, and takes them away", () => {
    const doc = fixture();
    let out = done(doc, renameRoom(doc, LIVING, "  Lounge "));
    expect(room(out, LIVING).name).toBe("Lounge");
    out = done(out, renameRoom(out, LIVING, " "));
    expect(Object.hasOwn(room(out, LIVING), "name")).toBe(false);
    out = done(out, setRoomArea(out, LIVING, "lounge"));
    expect(room(out, LIVING).areaId).toBe("lounge");
    expect(setRoomArea(out, LIVING, "a b")).toBeUndefined();
    out = done(out, setRoomPage(out, LIVING, PAGE));
    out = done(out, setRoomFinish(out, LIVING, "carpet"));
    expect(Object.keys(room(out, LIVING))).toEqual(["id", "areaId", "pageId", "finish", "outline", "height", "walls", "openings", "objects"]);
    out = done(out, setRoomFinish(out, LIVING, undefined));
    expect(room(out, LIVING).finish).toBeUndefined();
    out = done(out, setWallHeight(out, LIVING, 2.734));
    expect(room(out, LIVING).height).toBe(2.73);
  });

  it("adds, moves, changes, hides and removes things", () => {
    const doc = fixture();
    let out = done(doc, addObject(doc, LIVING, "bed", [2, 2]));
    expect(room(out, LIVING).objects[3]).toEqual({ kind: "bed", c: [2, 2], size: [1.6, 2, 0.6], turn: 0 });
    expect(addObject(doc, LIVING, "Bed", [2, 2])).toBeUndefined();
    out = done(out, addStairs(out, LIVING, [1, 1], { turn: 90 }));
    expect(room(out, LIVING).objects[4]!.kind).toBe("stairs");
    out = done(out, moveObject(out, LIVING, 3, [2.004, 2.5]));
    expect(room(out, LIVING).objects[3]!.c).toEqual([2, 2.5]);
    out = done(out, setObject(out, LIVING, 3, { size: [1.8, 2, 0.6], turn: 270 }));
    expect(room(out, LIVING).objects[3]!.turn).toBe(-90);
    out = done(out, setObjectHidden(out, LIVING, 0, true));
    expect(room(out, LIVING).objects[0]!.hidden).toBe(true);
    out = done(out, setObjectHidden(out, LIVING, 0, false));
    expect(Object.hasOwn(room(out, LIVING).objects[0]!, "hidden")).toBe(false);
    out = done(out, removeObject(out, LIVING, 1));
    expect(room(out, LIVING).objects.map((o) => o.kind)).toEqual(["sofa", "television", "bed", "stairs"]);
    expect(removeObject(out, LIVING, 9)).toBeUndefined();
  });

  it("lifts a thing off the floor and puts it back, the lift kept by every other edit", () => {
    const doc = fixture();
    let out = done(doc, setObject(doc, LIVING, 2, { lift: 1.2345 }));
    const tv = () => room(out, LIVING).objects[2]!;
    expect(tv().lift).toBe(1.23);
    expect(Object.keys(tv())).toEqual(["kind", "c", "size", "turn", "lift"]);
    out = done(out, setObjectHidden(out, LIVING, 2, true));
    expect(Object.keys(tv())).toEqual(["kind", "c", "size", "turn", "lift", "hidden"]);
    out = done(out, moveObject(out, LIVING, 2, [3, 0.5]));
    out = done(out, turnObject(out, LIVING, 2, 90));
    out = done(out, resizeObject(out, LIVING, 2, { width: 2 }));
    out = done(out, moveRoom(out, LIVING, 1, 0));
    expect(tv().lift).toBe(1.23);
    // Never below the floor; 0 puts it back on the floor and is not kept.
    out = done(out, setObject(out, LIVING, 2, { lift: -1 }));
    expect(Object.hasOwn(tv(), "lift")).toBe(false);
    expect(setObject(doc, LIVING, 2, { lift: Number.NaN })).toBeUndefined();
    // The store's check: a lift of 0 dropped, a negative one refused.
    const raw = fixture();
    raw.floors[0]!.rooms[0]!.objects[0] = { ...raw.floors[0]!.rooms[0]!.objects[0]!, lift: 0 };
    const checked = checkHomeMap(raw);
    expect(checked.ok && Object.hasOwn(checked.doc.floors[0]!.rooms[0]!.objects[0]!, "lift")).toBe(false);
    raw.floors[0]!.rooms[0]!.objects[0]!.lift = -0.5;
    expect(checkHomeMap(raw).ok).toBe(false);
  });

  it("resizes a thing along its own sides, the anchor staying put", () => {
    const doc = home([{ ...box(id(1), 0, 0, 4, 4), objects: [{ kind: "table", c: [2, 2], size: [1, 0.5, 0.75], turn: 0 }] }]);
    // Its plus side along the width stays put, so its middle moves left.
    let out = done(doc, resizeObject(doc, id(1), 0, { width: 2, anchor: [1, 0.5] }));
    expect(room(out, id(1)).objects[0]).toEqual({ kind: "table", c: [1.5, 2], size: [2, 0.5, 0.75], turn: 0 });
    // About its middle by default; the height never changes here.
    out = done(out, resizeObject(out, id(1), 0, { depth: 1 }));
    expect(room(out, id(1)).objects[0]!.c).toEqual([1.5, 2]);
    expect(room(out, id(1)).objects[0]!.size).toEqual([2, 1, 0.75]);
    // Turned a quarter, its width runs down the plan.
    const turned = home([{ ...box(id(1), 0, 0, 4, 4), objects: [{ kind: "table", c: [2, 2], size: [1, 0.5, 0.75], turn: -90 }] }]);
    out = done(turned, resizeObject(turned, id(1), 0, { width: 2, anchor: [0, 0.5] }));
    expect(room(out, id(1)).objects[0]!.c).toEqual([2, 2.5]);
    // Never smaller than 5 cm.
    out = done(doc, resizeObject(doc, id(1), 0, { width: 0.001 }));
    expect(room(out, id(1)).objects[0]!.size[0]).toBe(HOME_MAP_MIN_OBJECT_SIZE);
    expect(resizeObject(doc, id(1), 0, { width: Number.NaN })).toBeUndefined();
    expect(resizeObject(doc, id(1), 3, { width: 1 })).toBeUndefined();
  });

  it("turns a thing and lines it up with its room", () => {
    const doc = home([{ ...box(id(1), 0, 0, 4, 4), objects: [{ kind: "sofa", c: [2, 2], size: [2, 0.9, 0.8], turn: 170 }] }]);
    let out = done(doc, turnObject(doc, id(1), 0, 30));
    expect(room(out, id(1)).objects[0]!.turn).toBe(-160);
    out = done(out, levelObject(out, id(1), 0));
    expect(room(out, id(1)).objects[0]!.turn).toBe(-180 + 360);
    const slanted = home([{ ...box(id(1), 0, 0, 4, 4), objects: [{ kind: "sofa", c: [2, 2], size: [2, 0.9, 0.8], turn: 37 }] }]);
    expect(room(done(slanted, levelObject(slanted, id(1), 0)), id(1)).objects[0]!.turn).toBe(0);
    expect(turnObject(doc, id(1), 0, Number.POSITIVE_INFINITY)).toBeUndefined();
  });

  it("snaps a dragged thing flush against a wall of its room", () => {
    const living = { ...box(id(1), 0, 0, 4, 4), objects: [{ kind: "sofa", c: [2, 2] as HomePoint, size: [2, 0.9, 0.8] as [number, number, number], turn: 0 }] };
    const sofa = living.objects[0]!;
    // Its back 10 cm off the top wall's face (half a 10 cm wall in from the line).
    let snap = snapObject(living, sofa, [2, 0.05 + 0.45 + 0.1]);
    expect(snap.c[0]).toBeCloseTo(2);
    expect(snap.c[1]).toBeCloseTo(0.5);
    expect(snap.guides).toHaveLength(1);
    // Into a corner: one wall each way.
    snap = snapObject(living, sofa, [1.1, 0.55]);
    expect(snap.c[0]).toBeCloseTo(1.05);
    expect(snap.c[1]).toBeCloseTo(0.5);
    expect(snap.guides).toHaveLength(2);
    // Out of reach: left where it was dropped.
    snap = snapObject(living, sofa, [2, 2]);
    expect(snap.c).toEqual([2, 2]);
    expect(snap.guides).toHaveLength(0);
    // Turned 45 degrees, no wall runs along a side.
    expect(snapObject(living, { ...sofa, turn: 45 }, [2, 0.6]).guides).toHaveLength(0);
  });

  it("draws a room by hand with walls along its outline", () => {
    const doc = fixture();
    const out = done(doc, drawRoom(doc, FLOOR, id(8), [[10, 0], [14, 0], [14, 3], [10, 3], [10, 0]], "Garden"));
    const garden = room(out, id(8));
    expect(garden.outline).toHaveLength(4);
    expect(garden.walls).toHaveLength(4);
    expect(garden.walls[0]).toEqual({ a: [10, 0], b: [14, 0], t: 0.1 });
    expect(garden.height).toBe(2.5);
    expect(drawRoom(doc, FLOOR, id(8), [[0, 0], [1, 0], [2, 0]])).toBeUndefined();
    expect(drawRoom(doc, FLOOR, LIVING, [[0, 0], [1, 0], [1, 1]])).toBeUndefined();
  });
});

// ── Shape ────────────────────────────────────────────────────────────────

describe("corners and walls", () => {
  it("moves a corner, its walls, and the same corner of the room beside it", () => {
    const doc = fixture();
    const out = done(doc, moveCorner(doc, LIVING, 1, [6.3, 0]));
    expect(room(out, LIVING).outline[1]).toEqual([6.3, 0]);
    expect(room(out, LIVING).walls[0]!.b).toEqual([6.3, 0]);
    expect(room(out, LIVING).walls[1]!.a).toEqual([6.3, 0]);
    // The kitchen's corner at 6, 0 is the same corner.
    expect(room(out, KITCHEN).outline[0]).toEqual([6.3, 0]);
    expect(room(out, KITCHEN).walls[0]!.a).toEqual([6.3, 0]);
    // The way through in the wall that moved stays in it.
    const way = room(out, LIVING).openings[2]!;
    expect(homeMapOpeningWall(room(out, LIVING), way)).toBe(1);
  });

  it("types a wall's length by moving its far corner", () => {
    const doc = fixture();
    const out = done(doc, setWallLength(doc, LIVING, 0, 6.5));
    expect(room(out, LIVING).outline[1]).toEqual([6.5, 0]);
    expect(segmentLength(room(out, LIVING).walls[0]!)).toBeCloseTo(6.5, 5);
    // The window 1.4 m from the fixed end stays there.
    expect(room(out, LIVING).openings[0]!.a).toEqual([1.4, 0]);
    expect(room(out, KITCHEN).outline[0]).toEqual([6.5, 0]);
    expect(setWallLength(doc, LIVING, 0, 0.05)).toBeUndefined();
  });

  it("straightens a wall to the floor's directions", () => {
    let doc = home([box(id(1), 0, 0, 4, 3), box(id(2), 4.1, 0, 2, 3)]);
    doc = done(doc, moveCorner(doc, id(1), 1, [4, 0.2]));
    const out = done(doc, straightenWall(doc, id(1), 0));
    const w = room(out, id(1)).walls[0]!;
    expect(Math.abs(w.a[1] - w.b[1])).toBeLessThan(0.011);
  });

  it("squares corners within 10 degrees, the longest wall keeping its line", () => {
    const doc = home([{ ...box(id(1), 0, 0, 4, 3), outline: [[0, 0], [4, 0], [4.15, 3], [0, 3]], walls: [] }]);
    const squared = homeMapSquaredOutline(room(doc, id(1)));
    expect(squared[0]![1]).toBeCloseTo(0, 5);
    expect(squared[1]![1]).toBeCloseTo(0, 5);
    const out = done(doc, squareCorners(doc, id(1)));
    const o = room(out, id(1)).outline;
    expect(Math.abs(o[1]![0] - o[2]![0])).toBeLessThan(0.011);
    expect(scanIssues(out.floors[0]!).filter((i) => i.kind === "offSquare")).toEqual([]);
    // A corner far off square is left alone.
    const skew = home([{ ...box(id(1), 0, 0, 4, 3), outline: [[0, 0], [4, 0], [5.5, 3], [0, 3]], walls: [] }]);
    expect(room(done(skew, squareCorners(skew, id(1))), id(1)).outline[2]).toEqual([5.5, 3]);
  });

  it("adds and takes away a corner, splitting and joining the wall", () => {
    const doc = fixture();
    const out = done(doc, addCorner(doc, LIVING, 2, [3, 5.2]));
    const living = room(out, LIVING);
    expect(living.outline).toHaveLength(5);
    expect(living.outline[3]).toEqual([3, 5]);
    expect(living.walls).toHaveLength(5);
    const back = done(out, removeCorner(out, LIVING, 3));
    expect(room(back, LIVING).outline).toEqual(room(doc, LIVING).outline);
    expect(room(back, LIVING).walls).toHaveLength(4);
    expect(removeCorner(home([{ ...box(id(1), 0, 0, 1, 1), outline: [[0, 0], [1, 0], [1, 1]] }]), id(1), 0)).toBeUndefined();
  });

  it("sets a wall's thickness and adds and removes inner walls, writing out an outline's walls", () => {
    const bare = home([{ ...box(id(1), 0, 0, 4, 3), walls: [] }]);
    const thick = done(bare, setWallThickness(bare, id(1), 2, 0.2));
    expect(room(thick, id(1)).walls.map((w) => w.t)).toEqual([0.1, 0.1, 0.2, 0.1]);
    const inner = done(bare, addInnerWall(bare, id(1), [2, 0], [2, 1.5]));
    expect(room(inner, id(1)).walls).toHaveLength(5);
    expect(room(done(inner, removeWall(inner, id(1), 4)), id(1)).walls).toHaveLength(4);
    expect(addInnerWall(bare, id(1), [2, 0], [2, 0.05])).toBeUndefined();
  });
});

describe("splitting a room", () => {
  it("cuts the outline, walls, things and pins to their sides", () => {
    const doc = fixture();
    // A line down x = 3: the right side of a line going down is the left of
    // the plan, which keeps the room.
    const out = done(doc, splitRoom(doc, LIVING, [3, 0], [3, 5], id(9), "Dining"));
    const kept = room(out, LIVING);
    const given = room(out, id(9));
    expect(Math.max(...kept.outline.map((p) => p[0]))).toBe(3);
    expect(Math.min(...given.outline.map((p) => p[0]))).toBe(3);
    expect(given.name).toBe("Dining");
    expect(kept.name).toBe("Living room");
    expect(kept.areaId).toBe("living_room");
    expect(given.areaId).toBeUndefined();
    // Both get the wall along the cut.
    expect(kept.walls.some((w) => w.a[0] === 3 && w.b[0] === 3)).toBe(true);
    expect(given.walls.some((w) => w.a[0] === 3 && w.b[0] === 3)).toBe(true);
    // The window (its middle at x 2.4) and the door at x 0 stay, the way
    // through at x 6 goes.
    expect(kept.openings.map((o) => o.kind)).toEqual(["window", "door"]);
    expect(given.openings.map((o) => o.kind)).toEqual(["opening"]);
    expect(pinOf(out, READING).roomId).toBe(LIVING);
    expect(pinOf(out, CEILING).roomId).toBe(id(9));
    expect(splitRoom(doc, LIVING, [0.01, 0], [0.01, 5], id(9))).toBeUndefined();
  });
});

describe("doors, windows and ways through", () => {
  it("adds each kind with its defaults, kept inside the wall", () => {
    const doc = fixture();
    let out = done(doc, addOpening(doc, KITCHEN, 1, { kind: "door" }));
    expect(room(out, KITCHEN).openings[0]).toEqual({ kind: "door", a: [10, 2.05], b: [10, 2.95], z0: 0, z1: 2 });
    out = done(out, addOpening(out, KITCHEN, 0, { kind: "window", style: "sliding", at: [9.9, -0.3] }));
    expect(room(out, KITCHEN).openings[1]).toEqual({ kind: "window", style: "sliding", a: [8.8, 0], b: [10, 0], z0: 0.9, z1: 2 });
    out = done(out, addOpening(out, KITCHEN, 2, { kind: "opening", at: 1 }));
    expect(room(out, KITCHEN).openings[2]!.z1).toBe(2.1);
    expect(addOpening(doc, KITCHEN, 0, { kind: "window", style: "double" })).toBeUndefined();
    expect(addOpening(doc, KITCHEN, 0, { kind: "opening", style: "sliding" })).toBeUndefined();
  });

  it("slides an opening along its wall, clamped inside it", () => {
    const doc = fixture();
    const out = done(doc, moveOpening(doc, LIVING, 0, [5.9, 1]));
    expect(room(out, LIVING).openings[0]!.a).toEqual([4, 0]);
    expect(room(out, LIVING).openings[0]!.b).toEqual([6, 0]);
    expect(done(doc, moveOpening(doc, LIVING, 0, 1)).floors[0]!.rooms[0]!.openings[0]!.a).toEqual([0, 0]);
  });

  it("changes width, height, kind and style, as the kind allows", () => {
    const doc = fixture();
    let out = done(doc, setOpening(doc, LIVING, 1, { width: 1.4, style: "double" }));
    const door = room(out, LIVING).openings[1]!;
    expect(door).toEqual({ kind: "door", style: "double", a: [0, 1.3], b: [0, 2.7], z0: 0, z1: 2.05 });
    // To a window: double does not fit, so it goes.
    out = done(out, setOpening(out, LIVING, 1, { kind: "window", z0: 0.9 }));
    expect(room(out, LIVING).openings[1]!.style).toBeUndefined();
    expect(setOpening(out, LIVING, 1, { style: "double" })).toBeUndefined();
    expect(setOpening(out, LIVING, 1, { z1: 0.5 })).toBeUndefined();
    out = done(out, setOpening(out, LIVING, 1, { style: "sliding" }));
    out = done(out, setOpening(out, LIVING, 1, { style: null }));
    expect(Object.hasOwn(room(out, LIVING).openings[1]!, "style")).toBe(false);
    expect(done(out, removeOpening(out, LIVING, 1)).floors[0]!.rooms[0]!.openings).toHaveLength(2);
  });
});

describe("the scan check", () => {
  it("finds nothing on the fixture: the rooms meet, with a way through", () => {
    expect(scanIssues(fixture().floors[0]!)).toEqual([]);
  });

  it("finds an overlap, and its fix moves the smaller room clear", () => {
    const doc = home([box(id(1), 0, 0, 4, 3, "Living"), box(id(2), 3.96, 0, 1.4, 1.4, "Bath")]);
    const issues = scanIssues(doc.floors[0]!);
    const overlap = issues.find((i) => i.kind === "overlap")!;
    expect(overlap.roomIds).toEqual([id(2), id(1)]);
    expect(overlap.amount).toBeCloseTo(0.04, 2);
    expect(overlap.title).toBe("Bath and Living overlap 4 cm.");
    const out = done(doc, fixIssue(doc, overlap));
    expect(Math.min(...room(out, id(2)).outline.map((p) => p[0]))).toBeCloseTo(4, 1);
    expect(scanIssues(out.floors[0]!).some((i) => i.kind === "overlap")).toBe(false);
  });

  it("finds a corner off square and squares it", () => {
    const doc = home([{ ...box(id(1), 0, 0, 3, 2, "Kitchen"), outline: [[0, 0], [3, 0], [3.1, 2], [0, 2]], walls: [] }]);
    const [issue] = scanIssues(doc.floors[0]!);
    expect(issue!.kind).toBe("offSquare");
    expect(issue!.title).toBe("Kitchen corner is 93°.");
    expect(issue!.fixLabel).toBe("Square");
    expect(scanIssues(done(doc, fixIssue(doc, issue!)).floors[0]!)).toEqual([]);
  });

  it("finds a small gap between rooms that should meet, and closes it", () => {
    const doc = home([box(id(1), 0, 0, 4, 3, "Living"), box(id(2), 4.15, 0, 2, 3, "Hall")]);
    const gap = scanIssues(doc.floors[0]!).find((i) => i.kind === "gap")!;
    expect(gap.amount).toBeCloseTo(0.05, 2);
    const out = done(doc, fixIssue(doc, gap));
    expect(Math.min(...room(out, id(2)).outline.map((p) => p[0]))).toBeCloseTo(4.1, 2);
  });

  it("finds a room with no door to its neighbours, and adds one where they meet", () => {
    const doc = home([box(id(1), 0, 0, 4, 3, "Hall"), box(id(2), 4.1, 0, 3, 3, "Bedroom")]);
    const issues = scanIssues(doc.floors[0]!);
    expect(issues.map((i) => i.kind)).toEqual(["missingDoor"]);
    expect(issues[0]!.title).toBe("Hall has no door to Bedroom.");
    const out = done(doc, fixIssue(doc, issues[0]!));
    expect(out.floors[0]!.rooms.flatMap((r) => r.openings).map((o) => o.kind)).toEqual(["door"]);
    expect(scanIssues(out.floors[0]!)).toEqual([]);
  });

  it("fixes everything at once", () => {
    const doc = home([
      { ...box(id(1), 0, 0, 4, 3, "Living"), outline: [[0, 0], [4, 0], [4.1, 3], [0, 3]], walls: [] },
      box(id(2), 4.15, 0, 2, 3, "Hall"),
    ]);
    expect(scanIssues(doc.floors[0]!).length).toBeGreaterThan(1);
    const out = done(doc, fixAllIssues(doc, FLOOR));
    expect(scanIssues(out.floors[0]!)).toEqual([]);
    expect(fixAllIssues(fixture(), FLOOR)).toEqual(fixture());
    expect(fixAllIssues(fixture(), id(99))).toBeUndefined();
  });
});

// ── Devices ──────────────────────────────────────────────────────────────

describe("pins", () => {
  it("adds a pin at its kind's height in the room it stands in", () => {
    const doc = fixture();
    let out = done(doc, addPin(doc, FLOOR, { id: id(20), entityId: "light.floor_lamp", at: [2, 2], name: "Floor Lamp" }));
    expect(pinOf(out, id(20))).toEqual({ id: id(20), entityId: "light.floor_lamp", roomId: LIVING, at: [2, 2, 1.6] });
    out = done(out, addPin(out, FLOOR, { id: id(21), entityId: "sensor.temp", at: [20, 20, 0.5] }));
    expect(pinOf(out, id(21))).toEqual({ id: id(21), entityId: "sensor.temp", at: [20, 20, 0.5] });
    expect(addPin(out, FLOOR, { id: id(21), entityId: "light.x", at: [1, 1] })).toBeUndefined();
    expect(addPin(out, FLOOR, { id: id(22), entityId: "light.x", at: [1, 1], roomId: id(99) })).toBeUndefined();
  });

  it("moves a pin into the room it lands in, raises and removes it", () => {
    const doc = fixture();
    let out = done(doc, movePin(doc, READING, [8, 1]));
    expect(pinOf(out, READING).roomId).toBe(KITCHEN);
    expect(pinOf(out, READING).at).toEqual([8, 1, 1.5]);
    out = done(out, setPinHeight(out, READING, 2.456));
    expect(pinOf(out, READING).at[2]).toBe(2.46);
    out = done(out, sameHeightForLights(out, READING));
    expect(out.floors[0]!.pins.filter((p) => p.entityId.startsWith("light.")).map((p) => p.at[2])).toEqual([2.46, 2.46, 2.46]);
    out = done(out, centerPinInRoom(out, READING));
    expect(pinOf(out, READING).at).toEqual([8, 2.5, 2.46]);
    out = done(out, removePin(out, READING));
    expect(out.floors[0]!.pins).toHaveLength(4);
  });

  it("sets what a pin shows and does, dropping defaults", () => {
    const doc = fixture();
    let out = done(doc, setPinFields(doc, READING, { name: " Floor Lamp ", icon: "lamp", reading: "name", glow: 12, glowColor: "#FFB347", tap: "page", pageId: PAGE }));
    expect(pinOf(out, READING)).toEqual({
      id: READING, entityId: "light.reading_lamp", roomId: LIVING, at: [0.8, 3.1, 1.5],
      name: "Floor Lamp", icon: "lamp", reading: "name", glow: 10, glowColor: "#ffb347", tap: "page", pageId: PAGE,
    });
    // Another tap drops the page; the entity's own name is not stored.
    out = done(out, setPinFields(out, READING, { tap: "toggle", name: "Reading lamp" }, "Reading lamp"));
    expect(pinOf(out, READING).pageId).toBeUndefined();
    expect(pinOf(out, READING).name).toBeUndefined();
    out = done(out, setPinFields(out, READING, { icon: null, reading: null, glow: null, glowColor: null, tap: null }));
    expect(Object.keys(pinOf(out, READING))).toEqual(["id", "entityId", "roomId", "at"]);
    expect(setPinFields(out, READING, { tap: "page" })).toBeUndefined();
    expect(setPinFields(out, READING, { glowColor: "orange" })).toBeUndefined();
    expect(setPinFields(out, READING, { icon: "rocket" as never })).toBeUndefined();
  });

  it("starts each kind at its height", () => {
    expect(homeMapPlaceHeight("light.ceiling")).toBe(2.4);
    expect(homeMapPlaceHeight("light.x", "Living Floor Lamp")).toBe(1.6);
    expect(homeMapPlaceHeight("light.x", "Bedside Lamp")).toBe(0.8);
    expect(homeMapPlaceHeight("light.desk_lamp")).toBe(0.8);
    expect(homeMapPlaceHeight("switch.kettle")).toBe(0.3);
    expect(homeMapPlaceHeight("sensor.temperature")).toBe(1.5);
    expect(homeMapPlaceHeight("climate.hall")).toBe(1.5);
    expect(homeMapPlaceHeight("media_player.tv")).toBe(1.0);
    expect(homeMapPlaceHeight("cover.blinds")).toBe(2.0);
    expect(homeMapPlaceHeight("lock.front")).toBe(1.0);
    expect(homeMapPlaceHeight("binary_sensor.front", undefined, "door")).toBe(1.0);
    expect(homeMapPlaceHeight("binary_sensor.motion")).toBe(1.5);
  });

  it("places every device of an area in its room, spread out, skipping those on the map", () => {
    const doc = fixture();
    let n = 100;
    const result = placeAllByArea(
      doc,
      FLOOR,
      [
        { entityId: "light.reading_lamp", areaId: "living_room" },
        { entityId: "light.wall", areaId: "living_room" },
        { entityId: "media_player.soundbar", areaId: "living_room" },
        { entityId: "switch.dishwasher", areaId: "kitchen" },
        { entityId: "cover.blinds", areaId: "bedroom" },
        { entityId: "light.nowhere" },
      ],
      () => id((n += 1)),
    )!;
    const out = done(doc, result.doc);
    expect(result.placed).toEqual(["light.wall", "media_player.soundbar", "switch.dishwasher"]);
    const added = out.floors[0]!.pins.slice(5);
    expect(added.map((p) => [p.entityId, p.roomId, p.at[2]])).toEqual([
      ["light.wall", LIVING, 2.4],
      ["media_player.soundbar", LIVING, 1.0],
      ["switch.dishwasher", KITCHEN, 0.3],
    ]);
    // Spread out: no two pins of a room within 50 cm.
    const living = out.floors[0]!.pins.filter((p) => p.roomId === LIVING);
    for (const p of living) for (const q of living) if (p !== q) expect(Math.hypot(p.at[0] - q.at[0], p.at[1] - q.at[1])).toBeGreaterThan(0.5);
    // Inside the room and off its walls.
    for (const p of added.slice(0, 2)) expect(p.at[0] > 0.29 && p.at[0] < 5.71 && p.at[1] > 0.29 && p.at[1] < 4.71).toBe(true);
    expect(placeAllByArea(out, FLOOR, [{ entityId: "light.wall", areaId: "living_room" }], () => id(500))!.placed).toEqual([]);
  });
});

// ── Style ────────────────────────────────────────────────────────────────

describe("the home style and a tile's options", () => {
  it("sets the home style, dropping defaults and an empty style", () => {
    const doc = fixture();
    let out = done(doc, setHomeStyle(doc, { look: "night", turn: 40.4, names: false }));
    expect(out.style).toEqual({ look: "night", turn: 40, names: false });
    expect(Object.keys(out)).toEqual(["v", "style", "floors"]);
    expect(homeStyleOf(out)).toEqual({ look: "night", turn: 40, names: false, devices: "lights", furniture: true, glow: true });
    out = done(out, setHomeStyle(out, { look: "plan", turn: null, names: true }));
    expect(Object.hasOwn(out, "style")).toBe(false);
    expect(setHomeStyle(out, { look: "glow" as never })).toBeUndefined();
    expect(homeStyleOf(null).turn).toBe(-28);
  });

  it("reads a tile by the tile rule: its own key, else the home style, else the default", () => {
    const doc = done(fixture(), setHomeStyle(fixture(), { look: "warm", turn: 10, glow: false }));
    expect(tileOptionsResolved({}, doc)).toEqual({ look: "warm", turn: 10, names: true, devices: "lights", furniture: true, glow: false });
    expect(tileOptionsResolved({ homeMapLook: "plan", homeMapGlow: true, homeMapTurn: 33.6, homeMapDevices: "bogus" }, doc)).toEqual({
      look: "plan", turn: 34, names: true, devices: "lights", furniture: true, glow: true,
    });
    expect(tileOptionsResolved({ homeMapLook: "dollhouse" }, undefined).look).toBe("warm");
    expect(tileOptionsResolved({ homeMapLook: "nonsense" }, doc).look).toBe("warm");
  });

  it("writes a tile key only when it differs from the home style, and can drop them all", () => {
    const doc = done(fixture(), setHomeStyle(fixture(), { look: "night" }));
    expect(tileStyleKey("look", "night", doc)).toEqual({ key: "homeMapLook", value: undefined });
    expect(tileStyleKey("look", "plan", doc)).toEqual({ key: "homeMapLook", value: "plan" });
    expect(tileStyleKey("turn", -28.2, doc)).toEqual({ key: "homeMapTurn", value: undefined });
    const tile = { id: "t", homeMapLook: "plan", homeMapGlow: false, size: "2x2" };
    expect(tileHasOwnStyle(tile)).toBe(true);
    expect(withoutTileStyle(tile)).toEqual({ id: "t", size: "2x2" });
    expect(tileHasOwnStyle(withoutTileStyle(tile))).toBe(false);
  });
});

// ── History ──────────────────────────────────────────────────────────────

describe("undo and redo", () => {
  it("steps back and forward, a new edit clearing redo, at most 100 back", () => {
    const history = new HomeMapHistory();
    const a = fixture();
    const b = moveRoom(a, LIVING, 1, 0)!;
    const c = moveRoom(b, LIVING, 1, 0)!;
    expect(history.canUndo).toBe(false);
    history.push(a);
    history.push(b);
    expect(history.undo(c)).toBe(b);
    expect(history.canRedo).toBe(true);
    expect(history.undo(b)).toBe(a);
    expect(history.undo(a)).toBeUndefined();
    expect(history.redo(a)).toBe(b);
    history.push(b);
    expect(history.canRedo).toBe(false);
    history.clear();
    expect(history.canUndo).toBe(false);
    const capped = new HomeMapHistory();
    for (let i = 0; i < 150; i += 1) capped.push(a);
    let steps = 0;
    while (capped.undo(a) !== undefined) steps += 1;
    expect(steps).toBe(100);
  });
});

describe("walls as the edits number them", () => {
  it("are the room's walls, or its outline's edges when it has none", () => {
    const doc = fixture();
    expect(homeMapRoomWalls(room(doc, KITCHEN))).toHaveLength(3);
    expect(homeMapRoomWalls({ ...room(doc, KITCHEN), walls: [] })).toHaveLength(4);
  });
});
