import { describe, expect, it } from "vitest";
import { setObjectGoes } from "../src/home-map/edit-ops.js";
import { homeFurnitureArt } from "../src/home-map/furniture-art.js";
import { homeMapFlightSteps, homeMapFloorStairsGoDown, homeMapPlanLook, homeMapStairsGoDown } from "../src/home-map/furniture.js";
import { type HomeMapDocument, type HomeMapObject, checkHomeMap, orderedObject } from "../src/home-map/model.js";
import { homeMapRoomWells } from "../src/home-map/scene3d.js";
import { homeBoxCorners, homeBoxOf, homeDownFlightBox, homeDownStairsDrawn, homeRoomHoldsNearly } from "../src/home-map/geometry.js";
import { fitStairsToRoom, homeMapStairsNeedFit } from "../src/home-map/stairs-fit.js";
import { watchHomeMapArtOptions } from "../src/watch-pages/home-map-tile.js";
import { watchHomeMapEntityId } from "../src/watch-pages/tile-new.js";

// Which way stairs go from their floor: the object's own `goes`, else the
// map picks by its floors' stories. The app tests the same table
// (`HomeMapStairsWayTests`).
const floors = (...stories: number[]) => stories.map((story, i) => ({ id: `F${i}`, story }));
const onStory = (list: { id: string; story: number }[], story: number) => list.find((f) => f.story === story)!.id;
const stairs = (goes?: "up" | "down"): Pick<HomeMapObject, "kind" | "goes"> => ({ kind: "stairs", ...(goes === undefined ? {} : { goes }) });

describe("which way stairs go", () => {
  const table: { stories: number[]; on: number; goes?: "up" | "down"; down: boolean }[] = [
    { stories: [3], on: 3, down: true },
    { stories: [0], on: 0, down: false },
    { stories: [-1], on: -1, down: false },
    { stories: [0, 1], on: 1, down: true },
    { stories: [0, 1], on: 0, down: false },
    { stories: [0, 1, 2], on: 1, down: false },
    { stories: [0, 1, 2], on: 2, down: true },
    { stories: [3], on: 3, goes: "up", down: false },
    { stories: [0], on: 0, goes: "down", down: true },
  ];
  for (const row of table) {
    it(`stories ${row.stories.join(", ")}, on ${row.on}${row.goes === undefined ? "" : `, goes ${row.goes}`}: ${row.down ? "down" : "up"}`, () => {
      const list = floors(...row.stories);
      expect(homeMapStairsGoDown(list, onStory(list, row.on), stairs(row.goes))).toBe(row.down);
    });
  }

  it("is the floor's pick for stairs with no way of their own, and never down for other things", () => {
    const list = floors(0, 1);
    expect(homeMapFloorStairsGoDown(list, "F1")).toBe(true);
    expect(homeMapStairsGoDown(list, "F1", { kind: "sofa" })).toBe(false);
  });
});

describe("a flight that goes down", () => {
  it("keeps each step's depth and puts its tread below the floor, the last at the full drop", () => {
    const up = homeMapFlightSteps(2.8, 2.44);
    const down = homeMapFlightSteps(2.8, 2.44, true);
    expect(down).toHaveLength(up.length);
    down.forEach((step, k) => {
      expect(step.front).toBeCloseTo(up[k]!.front);
      expect(step.back).toBeCloseTo(up[k]!.back);
      expect(step.top).toBeCloseTo(-((k + 1) * 2.44) / up.length);
    });
    expect(down[down.length - 1]!.top).toBeCloseTo(-2.44);
  });

  it("is drawn on the plan with darker treads towards the back and a dashed arrow", () => {
    const look = homeMapPlanLook({ kind: "stairs", model: "stairsFlight", c: [0, 0], size: [0.9, 2.8, 2.44], turn: 0 }, true);
    expect(look.down).toBe(true);
    const svgText = (r: unknown) => JSON.stringify(r);
    const downArt = svgText(homeFurnitureArt("stairs", 90, 280, 100, look));
    const upArt = svgText(homeFurnitureArt("stairs", 90, 280, 100, { ...look, down: false }));
    expect(downArt).toContain("stroke-dasharray");
    expect(downArt).toContain("fill-opacity");
    expect(upArt).not.toContain("fill-opacity");
    // A flight with its own way up stays up on a floor that picks down.
    expect(homeMapPlanLook({ kind: "stairs", model: "stairsFlight", goes: "up", c: [0, 0], size: [0.9, 2.8, 2.44], turn: 0 }, true).down).toBeUndefined();
  });

  it("cuts a well in its room's floor as deep as it is tall, only for stairs going down", () => {
    const room = {
      id: "R", outline: [[0, 0], [3, 0], [3, 3], [0, 3]], height: 2.44, walls: [], openings: [],
      objects: [
        { kind: "stairs", model: "stairsFlight", c: [1.5, 1.5], size: [0.9, 2.8, 2.44], turn: 0 },
        { kind: "stairs", model: "stairsFlight", goes: "up", c: [1.5, 1.5], size: [0.9, 2.8, 2.44], turn: 0 },
        { kind: "sofa", c: [1.5, 1.5], size: [2, 1, 0.8], turn: 0 },
      ],
    } as unknown as Parameters<typeof homeMapRoomWells>[0];
    const wells = homeMapRoomWells(room, true);
    expect(wells).toHaveLength(1);
    expect(wells[0]!.depth).toBeCloseTo(2.44);
    expect(wells[0]!.corners).toHaveLength(4);
    expect(homeMapRoomWells(room, false)).toHaveLength(0);
  });
});

function checkHomeMapDocument(raw: unknown): HomeMapDocument {
  const out = checkHomeMap(raw);
  if (!out.ok) throw new Error(out.message);
  return out.doc;
}

describe("the goes key", () => {
  const docWith = (object: Record<string, unknown>) => ({
    v: 1,
    floors: [{
      id: "1B4E28BA-2FA1-11D2-883F-0016D3CCA427", name: "Up", story: 3, pins: [],
      rooms: [{ id: "2B4E28BA-2FA1-11D2-883F-0016D3CCA427", outline: [[0, 0], [3, 0], [3, 3], [0, 3]], height: 2.44, walls: [], openings: [], objects: [object] }],
    }],
  });

  it("is checked, kept in the contract's order after lift and before hidden", () => {
    const checked = checkHomeMapDocument(docWith({ hidden: true, goes: "down", lift: 0.2, kind: "stairs", c: [1, 1], size: [0.9, 2.8, 2.44], turn: 0 }));
    const object = checked.floors[0]!.rooms[0]!.objects[0]!;
    expect(Object.keys(orderedObject(object))).toEqual(["kind", "c", "size", "turn", "lift", "goes", "hidden"]);
    expect(object.goes).toBe("down");
    expect(() => checkHomeMapDocument(docWith({ goes: "sideways", kind: "stairs", c: [1, 1], size: [1, 1, 1], turn: 0 }))).toThrow(/goes/);
  });

  it("is set, changed and cleared as one edit each", () => {
    const doc = checkHomeMapDocument(docWith({ kind: "stairs", c: [1, 1], size: [0.9, 2.8, 2.44], turn: 0 }));
    const roomId = doc.floors[0]!.rooms[0]!.id;
    const down = setObjectGoes(doc, roomId, 0, "down")!;
    expect(down.floors[0]!.rooms[0]!.objects[0]!.goes).toBe("down");
    expect(setObjectGoes(down, roomId, 0, "down")).toBeUndefined();
    const cleared = setObjectGoes(down, roomId, 0, undefined)!;
    expect("goes" in cleared.floors[0]!.rooms[0]!.objects[0]!).toBe(false);
  });
});

// Every flight going down is the built flight, drawn in the box its well
// fits: its own, or cut 5 cm at a time in width and depth, up to 30 cm.
describe("stairs going down in their room", () => {
  // The live map's stairs room and the stairs Jesse put in it.
  const outline: [number, number][] = [[7.62, 6.19], [6.83, 6.19], [4.62, 6.19], [4.62, 5.1], [4.62, 2.97], [7.62, 2.97]];
  const live = { kind: "stairs", model: "stairs", wood: "#2A2A2A", c: [5.72, 5.49], size: [1.51, 2.09, 2.44], turn: 90 } as HomeMapObject;
  const roomWith = (objects: HomeMapObject[]) => ({ id: "35C038AB-F560-4043-8717-7ECF3918C429", name: "stairs", outline, height: 2.44, walls: [], openings: [], objects }) as unknown as Parameters<typeof homeMapRoomWells>[0];

  it("cuts Jesse's stairs 10 cm to fit, so the floor gets its hole", () => {
    const box = homeDownFlightBox({ outline }, live)!;
    expect(box.size[0]).toBeCloseTo(1.41);
    expect(box.size[1]).toBeCloseTo(1.99);
    expect(box.c).toEqual(live.c);
    const wells = homeMapRoomWells(roomWith([live]), true);
    expect(wells).toHaveLength(1);
    expect(wells[0]!.hole).toBe(true);
  });

  it("keeps a box that fits as it is, and draws one past 30 cm in its own box with no hole", () => {
    const inside = { ...live, size: [1, 1.5, 2.44] } as HomeMapObject;
    expect(homeDownFlightBox({ outline }, inside)!.size.slice(0, 2)).toEqual([1, 1.5]);
    const huge = { ...live, c: [6.12, 5.9], size: [2, 2, 2.44] } as HomeMapObject;
    expect(homeDownFlightBox({ outline }, huge)).toBeUndefined();
    const drawn = homeDownStairsDrawn({ outline }, huge);
    expect(drawn.hole).toBe(false);
    expect(drawn.object.size).toEqual(huge.size);
    expect(homeMapRoomWells(roomWith([huge]), true)[0]!.hole).toBe(false);
  });

  it("is the built flight whatever its model, in its own wood", () => {
    const drawn = homeDownStairsDrawn({ outline }, live).object;
    expect(drawn.model).toBe("stairsFlight");
    expect(drawn.wood).toBe("#2A2A2A");
    const look = homeMapPlanLook(live, true);
    expect(look.model).toBe("stairsFlight");
    expect(look.wood).toBe("#2A2A2A");
    expect(look.down).toBe(true);
    // Going up, it keeps its own model.
    expect(homeMapPlanLook({ ...live, goes: "up" }, true).model).toBe("stairs");
  });

  it("offers Fit to the room for stairs that are not the flight or cross the room, and fits them in one edit", () => {
    expect(homeMapStairsNeedFit({ outline }, live)).toBe(true);
    const doc = {
      v: 1,
      floors: [{ id: "1B4E28BA-2FA1-11D2-883F-0016D3CCA427", name: "Upstairs", story: 3, pins: [], rooms: [roomWith([{ ...live, goes: "down" }])] }],
    } as unknown as HomeMapDocument;
    const roomId = doc.floors[0]!.rooms[0]!.id;
    const fitted = fitStairsToRoom(doc, roomId, 0)!.floors[0]!.rooms[0]!.objects[0]!;
    expect(fitted.model).toBe("stairsFlight");
    expect(fitted.goes).toBe("down");
    expect(fitted.wood).toBe("#2A2A2A");
    expect(homeMapStairsNeedFit({ outline }, fitted)).toBe(false);
    for (const p of homeBoxCorners(homeBoxOf(fitted))) expect(homeRoomHoldsNearly({ outline }, p)).toBe(true);
  });

  it("tells the Pages editor's tile previews the floor's pick", () => {
    const home = { v: 1, floors: [{ id: "1B4E28BA-2FA1-11D2-883F-0016D3CCA427", name: "Upstairs", story: 3, pins: [], rooms: [] }] } as unknown as HomeMapDocument;
    const tile = { entityId: watchHomeMapEntityId("1B4E28BA-2FA1-11D2-883F-0016D3CCA427") };
    expect(watchHomeMapArtOptions(tile, home).stairsDown).toBe(true);
    const ground = { ...home, floors: [{ ...home.floors[0]!, story: 0 }] } as HomeMapDocument;
    expect("stairsDown" in watchHomeMapArtOptions(tile, ground)).toBe(false);
  });
});
