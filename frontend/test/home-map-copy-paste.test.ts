// Copy, Paste and Duplicate for the map editor's furniture, the keys that ask
// for them, and the bar between the plan and the model.

import { describe, expect, it } from "vitest";

import { HOME_MAP_EDIT_TOOLS } from "../src/home-map/edit-page.js";
import { HOME_MAP_PASTE_STEP, homeMapClipOf, homeMapRehomeThings, moveRoom, pasteThings } from "../src/home-map/edit-ops.js";
import { homeMapRoomsPicked } from "../src/home-map/editor-mode.js";
import { HOME_MAP_SHAPE_TOOLS } from "../src/home-map/mode-shape.js";
import { HOME_MAP_SPLIT_MAX, HOME_MAP_SPLIT_MIN, homeMapClampSplit, homeMapShortcut, homeMapSplitPercent } from "../src/home-map/editor-view.js";
import { type HomeMapDocument, type HomeMapObject, type HomeMapRoom, checkHomeMap } from "../src/home-map/model.js";

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LEFT = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const RIGHT = "7B1E0C2A-5D3F-4A8B-9C6D-000000000012";

function room(id: string, x: number, objects: HomeMapObject[]): HomeMapRoom {
  const outline: [number, number][] = [[x, 0], [x + 4, 0], [x + 4, 3], [x, 3]];
  return {
    id,
    name: id === LEFT ? "Left" : "Right",
    outline,
    height: 2.4,
    walls: outline.map((a, i) => ({ a, b: outline[(i + 1) % 4]!, t: 0.1 })),
    openings: [],
    objects,
  } as unknown as HomeMapRoom;
}

const chair: HomeMapObject = { kind: "chair", c: [1, 1], size: [0.5, 0.5, 0.9], turn: 30 };
const lamp: HomeMapObject = { kind: "lamp", c: [2, 1], size: [0.3, 0.3, 1.5], turn: 0, lift: 0.2, device: "PIN-1", light: "PIN-1" } as unknown as HomeMapObject;

function doc(): HomeMapDocument {
  return { v: 1, floors: [{ id: FLOOR, rooms: [room(LEFT, 0, [chair, lamp]), room(RIGHT, 4, [])], pins: [] }] } as unknown as HomeMapDocument;
}

const objects = (d: HomeMapDocument, i: number) => d.floors[0]!.rooms[i]!.objects;

describe("copying furniture", () => {
  it("takes every picked thing and no device", () => {
    const clip = homeMapClipOf(doc(), [{ roomId: LEFT, object: 0 }, { roomId: LEFT, object: 1 }]);
    expect(clip?.objects).toHaveLength(2);
    expect(clip?.objects[1]).not.toHaveProperty("device");
    expect(clip?.objects[1]).not.toHaveProperty("light");
    expect(clip?.objects[1]?.lift).toBe(0.2);
  });

  it("gives nothing when the picked things are gone", () => {
    expect(homeMapClipOf(doc(), [{ roomId: LEFT, object: 9 }])).toBeUndefined();
    expect(homeMapClipOf(doc(), [])).toBeUndefined();
  });
});

describe("pasting furniture", () => {
  const clip = homeMapClipOf(doc(), [{ roomId: LEFT, object: 0 }])!;

  it("lands a step on from the original with no pointer, keeping its turn and size", () => {
    const pasted = pasteThings(doc(), FLOOR, clip)!;
    const copy = objects(pasted.doc, 0)[2]!;
    expect(copy.c).toEqual([1 + HOME_MAP_PASTE_STEP, 1 + HOME_MAP_PASTE_STEP]);
    expect(copy.turn).toBe(30);
    expect(copy.size).toEqual([0.5, 0.5, 0.9]);
    expect(pasted.items).toEqual([{ roomId: LEFT, object: 2 }]);
  });

  it("lands under the pointer, in the room there", () => {
    const pasted = pasteThings(doc(), FLOOR, clip, [6, 2])!;
    expect(objects(pasted.doc, 1)[0]?.c).toEqual([6, 2]);
    expect(pasted.items).toEqual([{ roomId: RIGHT, object: 0 }]);
    expect(objects(pasted.doc, 0)).toHaveLength(2);
  });

  it("keeps several things in the shape they were copied in", () => {
    const two = homeMapClipOf(doc(), [{ roomId: LEFT, object: 0 }, { roomId: LEFT, object: 1 }])!;
    const pasted = pasteThings(doc(), FLOOR, two, [6, 2])!;
    const [a, b] = objects(pasted.doc, 1);
    expect(a?.c).toEqual([5.5, 2]);
    expect(b?.c).toEqual([6.5, 2]);
  });

  it("steps on from the last paste when pasted again", () => {
    const first = pasteThings(doc(), FLOOR, clip)!;
    const second = pasteThings(first.doc, FLOOR, first.clip)!;
    expect(objects(second.doc, 0)[3]?.c).toEqual([1 + 2 * HOME_MAP_PASTE_STEP, 1 + 2 * HOME_MAP_PASTE_STEP]);
  });

  it("falls back to the room asked for when off every room", () => {
    const pasted = pasteThings(doc(), FLOOR, clip, [50, 50], RIGHT)!;
    expect(pasted.items[0]?.roomId).toBe(RIGHT);
  });

  it("leaves a map the store still takes", () => {
    const pasted = pasteThings(doc(), FLOOR, homeMapClipOf(doc(), [{ roomId: LEFT, object: 1 }])!, [6, 2])!;
    expect(checkHomeMap(pasted.doc)).toEqual(checkHomeMap(doc()));
  });

  it("refuses a floor that is not there, and a room that is full", () => {
    expect(pasteThings(doc(), "nowhere", clip)).toBeUndefined();
    const full = doc();
    full.floors[0]!.rooms[0]!.objects = Array.from({ length: 256 }, () => chair);
    expect(pasteThings(full, FLOOR, clip)).toBeUndefined();
  });
});

describe("the keys", () => {
  it("are Cmd or Ctrl and C, V or D, without Shift", () => {
    expect(homeMapShortcut({ key: "c", metaKey: true }, false)).toBe("copy");
    expect(homeMapShortcut({ key: "v", ctrlKey: true }, false)).toBe("paste");
    expect(homeMapShortcut({ key: "d", metaKey: true }, false)).toBe("duplicate");
    expect(homeMapShortcut({ key: "c", metaKey: true, shiftKey: true }, false)).toBeUndefined();
    expect(homeMapShortcut({ key: "c" }, false)).toEqual({ letter: "c" });
  });

  it("stay out of a text field", () => {
    expect(homeMapShortcut({ key: "v", metaKey: true }, true)).toBeUndefined();
  });
});

describe("Fit room", () => {
  const floor = () => doc().floors[0]!;
  const ids = (sel: Parameters<typeof homeMapRoomsPicked>[1]) => homeMapRoomsPicked(floor(), sel).map((r) => r.id);

  it("goes by the room of what is picked", () => {
    expect(ids(undefined)).toEqual([]);
    expect(ids({ kind: "room", roomId: RIGHT })).toEqual([RIGHT]);
    expect(ids({ kind: "object", roomId: LEFT, object: 0 })).toEqual([LEFT]);
    expect(ids({ kind: "wall", roomId: LEFT, wall: 1 })).toEqual([LEFT]);
    expect(ids({ kind: "objects", items: [{ roomId: LEFT, object: 0 }, { roomId: RIGHT, object: 0 }, { roomId: LEFT, object: 1 }] })).toEqual([LEFT, RIGHT]);
  });

  it("finds a pin's room by its own key, else by where it stands", () => {
    const pins = [
      { id: "kept", entityId: "light.a", roomId: LEFT, at: [6, 1, 1] },
      { id: "loose", entityId: "light.b", at: [6, 1, 1] },
      { id: "outside", entityId: "light.c", at: [50, 50, 1] },
    ];
    const withPins = { ...floor(), pins } as unknown as ReturnType<typeof floor>;
    const of = (pinId: string) => homeMapRoomsPicked(withPins, { kind: "pin", pinId }).map((r) => r.id);
    expect(of("kept")).toEqual([LEFT]);
    expect(of("loose")).toEqual([RIGHT]);
    expect(of("outside")).toEqual([]);
  });

  it("is on a free letter and takes no tool's key", () => {
    expect(homeMapShortcut({ key: "z" }, false)).toEqual({ letter: "z" });
    expect([...HOME_MAP_EDIT_TOOLS, ...HOME_MAP_SHAPE_TOOLS].map((t) => t.key)).not.toContain("z");
  });
});

describe("the bar between the plan and the model", () => {
  it("follows the pointer across its space", () => {
    expect(homeMapSplitPercent(600, 100, 1000)).toBe(50);
    expect(homeMapSplitPercent(800, 100, 1000)).toBe(70);
  });

  it("keeps both sides usable", () => {
    expect(homeMapSplitPercent(0, 100, 1000)).toBe(HOME_MAP_SPLIT_MIN);
    expect(homeMapSplitPercent(5000, 100, 1000)).toBe(HOME_MAP_SPLIT_MAX);
    expect(homeMapClampSplit(Number.NaN)).toBe(50);
    expect(homeMapSplitPercent(10, 0, 0)).toBe(50);
  });
});

describe("furniture and the room it stands in", () => {
  const chairAt = (x: number, y: number, extra = {}): HomeMapObject => ({ ...chair, c: [x, y], ...extra });
  const twoRooms = (left: HomeMapObject[], right: HomeMapObject[] = [], pins: unknown[] = []) => (
    { v: 1, floors: [{ id: FLOOR, rooms: [room(LEFT, 0, left), room(RIGHT, 4, right)], pins }] } as unknown as HomeMapDocument
  );

  it("moves the furniture standing in a room, whichever room lists it", () => {
    const moved = moveRoom(twoRooms([chairAt(1, 1), chairAt(5, 1)]), RIGHT, 0, 10)!;
    expect(objects(moved, 0).map((o) => o.c)).toEqual([[1, 1]]);
    expect(objects(moved, 1).map((o) => o.c)).toEqual([[5, 11]]);
  });

  it("leaves a neighbour's furniture behind when the listing room moves", () => {
    const moved = moveRoom(twoRooms([chairAt(1, 1), chairAt(5, 1)]), LEFT, 0, 10)!;
    expect(objects(moved, 0).map((o) => o.c)).toEqual([[1, 11]]);
    expect(objects(moved, 1).map((o) => o.c)).toEqual([[5, 1]]);
  });

  it("keeps a thing inside its own room there, and returns the same floor with nothing to do", () => {
    const floor = twoRooms([chairAt(1, 1)], [chairAt(5, 1)]).floors[0]!;
    expect(homeMapRehomeThings(floor)).toBe(floor);
  });

  it("gives a thing outside every room to the nearer room within a meter, else leaves it", () => {
    const near = homeMapRehomeThings({ ...twoRooms([chairAt(4.5, 3.4)]).floors[0]! });
    expect(near.rooms[1]!.objects).toHaveLength(1);
    const far = homeMapRehomeThings({ ...twoRooms([chairAt(1, 9)]).floors[0]! });
    expect(far.rooms[0]!.objects).toHaveLength(1);
  });

  it("takes along a pin the thing holds", () => {
    const pin = { id: "PIN-1", entityId: "light.a", roomId: LEFT, at: [5, 1, 1] };
    const floor = homeMapRehomeThings(twoRooms([chairAt(5, 1, { device: "PIN-1" })], [], [pin]).floors[0]!);
    expect(floor.pins[0]?.roomId).toBe(RIGHT);
  });
});
