// Copy, Paste and Duplicate for the map editor's furniture, the keys that ask
// for them, and the bar between the plan and the model.

import { describe, expect, it } from "vitest";

import { HOME_MAP_PASTE_STEP, homeMapClipOf, pasteThings } from "../src/home-map/edit-ops.js";
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
