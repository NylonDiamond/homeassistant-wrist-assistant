// The home map's furniture: an object's `model` key as the store checks and
// orders it (kept by name only, so a newer catalog's pieces survive), the
// catalog's kinds RoomPlan never makes passing the kind check, the catalog
// itself (every piece has its model beside the bundle, every default names
// a piece), which piece a thing draws as (a bed by its width, storage by its
// shape), fitting a model to a thing's box (a thin TV keeps its stand), the
// lift a new piece starts at, the edits that add a piece to a room and
// change a thing's piece (undoable as every edit is), the picker's
// sections, a thing's name, the room a new piece goes into, and how a light
// shines in the 3D look.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type HomeMapOp, addPiece, homeMapInsideRoom, setObject, setObjectHidden, setObjectPart, setObjectPiece } from "../src/home-map/edit-ops.js";
import type { HomeMapEditorContext, HomeMapSelection } from "../src/home-map/editor-mode.js";
import { HomeMapSession } from "../src/home-map/editor-session.js";
import {
  HOME_MAP_FABRIC_PRESETS,
  HOME_MAP_FURNITURE,
  HOME_MAP_WOOD_PRESETS,
  homeMapModelFit,
  homeMapPiece,
  homeMapPieceLift,
  homeMapPieceOf,
  homeMapPieceParts,
  homeMapPieceSearch,
  homeMapPieceSizeText,
} from "../src/home-map/furniture.js";
import { ArrangeMode, homeMapColourParts, homeMapPickerSections, homeMapRoomForAdding, homeMapThingName } from "../src/home-map/mode-arrange.js";
import { type HomeMapDocument, type HomeMapObject, type HomeMapRoom, checkHomeMap, orderedObject } from "../src/home-map/model.js";
import type { HomeMapApi } from "../src/home-map/save.js";
import {
  HOME_MAP_TINTED_MATERIALS,
  homeMapKelvinColor,
  homeMapLampOf,
  homeMapLinearOf,
  homeMapMaterialTint,
} from "../src/home-map/scene3d.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const MODELS = join(__dirname, "..", "..", "custom_components", "wrist_assistant", "frontend", "furniture");

const room = (doc: HomeMapDocument, roomId: string) => doc.floors.flatMap((f) => f.rooms).find((r) => r.id === roomId)!;
const piece = (id: string) => {
  const p = homeMapPiece(id);
  if (p === undefined) throw new Error(`no piece ${id}`);
  return p;
};

/** The edit's result, checked as the store checks it, and the input left
 * as it was. */
function done(before: HomeMapDocument, after: HomeMapDocument | undefined): HomeMapDocument {
  expect(after).toBeDefined();
  const text = JSON.stringify(before);
  const out = checkHomeMap(after);
  if (!out.ok) throw new Error(out.message);
  expect(JSON.stringify(out.doc)).toBe(JSON.stringify(after));
  expect(JSON.stringify(before)).toBe(text);
  return after!;
}

function refusal(change: (d: Record<string, any>) => void): string | undefined {
  const doc = fixture() as unknown as Record<string, any>;
  change(doc);
  const out = checkHomeMap(doc);
  return out.ok ? undefined : out.message;
}

describe("an object's model key", () => {
  it("is kept right after the kind, whatever order it was sent in", () => {
    const doc = fixture() as unknown as Record<string, any>;
    doc.floors[0].rooms[0].objects[0] = { ...doc.floors[0].rooms[0].objects[0], lift: 0.4, hidden: true, model: "loungeSofa" };
    const out = checkHomeMap(doc);
    if (!out.ok) throw new Error(out.message);
    const object = out.doc.floors[0]!.rooms[0]!.objects[0]!;
    expect(Object.keys(object)).toEqual(["kind", "model", "c", "size", "turn", "lift", "hidden"]);
    expect(object.model).toBe("loungeSofa");
  });

  it("is a name only, so a piece no catalog has yet is kept", () => {
    const doc = fixture() as unknown as Record<string, any>;
    doc.floors[0].rooms[0].objects[0].model = "chairRocking2";
    const out = checkHomeMap(doc);
    expect(out.ok && out.doc.floors[0]!.rooms[0]!.objects[0]!.model).toBe("chairRocking2");
  });

  it("is refused empty or not in lower camel case, in the store's words", () => {
    const words = "doc.floors[0].rooms[0].objects[0].model must be a furniture piece's name in lower camel case";
    for (const bad of ["", "BedDouble", "bed double", "bed-double", "b".repeat(41), null, 3]) {
      expect(refusal((d) => { d.floors[0].rooms[0].objects[0].model = bad; })).toBe(words);
    }
  });

  it("is ordered by orderedObject and never kept empty", () => {
    const object = { turn: 0, size: [1, 1, 1], c: [0, 0], model: "desk", kind: "table" } as unknown as HomeMapObject;
    expect(Object.keys(orderedObject(object))).toEqual(["kind", "model", "c", "size", "turn"]);
    expect(Object.keys(orderedObject({ ...object, model: "" }))).toEqual(["kind", "c", "size", "turn"]);
  });

  it("passes every catalog kind RoomPlan never makes through the kind check", () => {
    const kinds = ["rug", "lamp", "plant", "ottoman", "speaker", "screen", "laptop", "bench", "microwave", "coffeeMachine", "toaster", "hood", "shower", "mirror", "fan", "books", "bin", "box"];
    for (const kind of kinds) expect(refusal((d) => { d.floors[0].rooms[0].objects[0].kind = kind; })).toBeUndefined();
    // And every kind the catalog has.
    for (const p of HOME_MAP_FURNITURE.pieces) expect(refusal((d) => { d.floors[0].rooms[0].objects[0].kind = p.kind; })).toBeUndefined();
  });
});

describe("the furniture catalog", () => {
  it("has a model beside the bundle for every piece, and ids that pass the model check", () => {
    expect(HOME_MAP_FURNITURE.pieces.length).toBeGreaterThan(50);
    for (const p of HOME_MAP_FURNITURE.pieces) {
      expect(existsSync(join(MODELS, `${p.id}.glb`)), `${p.id}.glb`).toBe(true);
      expect(refusal((d) => { d.floors[0].rooms[0].objects[0].model = p.id; })).toBeUndefined();
    }
  });

  it("names a real piece for every kind's default, and puts every piece in one of its groups", () => {
    for (const [kind, id] of Object.entries(HOME_MAP_FURNITURE.defaults)) expect(homeMapPiece(id), `${kind} → ${id}`).toBeDefined();
    for (const p of HOME_MAP_FURNITURE.pieces) {
      expect(HOME_MAP_FURNITURE.groups).toContain(p.group);
      expect(p.size).toHaveLength(3);
      expect(p.size.every((v) => v > 0)).toBe(true);
    }
    expect(new Set(HOME_MAP_FURNITURE.pieces.map((p) => p.id)).size).toBe(HOME_MAP_FURNITURE.pieces.length);
    for (const id of ["bedDouble", "bedSingle", "bookcaseClosedWide", "bookcaseClosed"]) expect(homeMapPiece(id)).toBeDefined();
  });
});

describe("which piece a thing draws as", () => {
  const thing = (kind: string, size: [number, number, number], model?: string) => ({ kind, size, ...(model === undefined ? {} : { model }) });

  it("takes the piece its model names", () => {
    expect(homeMapPieceOf(thing("table", [1.4, 0.7, 0.7], "desk"))?.id).toBe("desk");
    // Even against its kind's size rule.
    expect(homeMapPieceOf(thing("bed", [0.9, 2, 0.5], "bedDouble"))?.id).toBe("bedDouble");
  });

  it("makes a bed a double from 1.3 m wide, else a single", () => {
    expect(homeMapPieceOf(thing("bed", [1.3, 2, 0.5]))?.id).toBe("bedDouble");
    expect(homeMapPieceOf(thing("bed", [1.6, 2, 0.5]))?.id).toBe("bedDouble");
    expect(homeMapPieceOf(thing("bed", [1.29, 2, 0.5]))?.id).toBe("bedSingle");
  });

  it("makes storage a dresser when as wide as it is tall, else a cupboard", () => {
    expect(homeMapPieceOf(thing("storage", [1.2, 0.5, 1.2]))?.id).toBe("bookcaseClosedWide");
    expect(homeMapPieceOf(thing("storage", [1.4, 0.5, 0.9]))?.id).toBe("bookcaseClosedWide");
    expect(homeMapPieceOf(thing("storage", [0.8, 0.5, 1.8]))?.id).toBe("bookcaseClosed");
  });

  it("falls to the kind's default for a model the catalog does not know, and to none for a kind with no default", () => {
    expect(homeMapPieceOf(thing("television", [1, 0.1, 0.6], "televisionHolo"))?.id).toBe("televisionModern");
    expect(homeMapPieceOf(thing("sofa", [2, 0.9, 0.8]))?.id).toBe(HOME_MAP_FURNITURE.defaults.sofa);
    expect(homeMapPieceOf(thing("fireplace", [1.2, 0.4, 1]))).toBeUndefined();
    expect(homeMapPieceOf(thing("fireplace", [1.2, 0.4, 1], "gone"))).toBeUndefined();
  });
});

describe("fitting a model to a thing's box", () => {
  it("stretches each way to the box", () => {
    expect(homeMapModelFit([1, 0.5, 2], [2, 1, 1])).toEqual({ x: 2, y: 0.5, z: 2 });
  });

  it("never squashes the depth below half the lesser other stretch, so a thin TV keeps its stand", () => {
    // A 5 cm deep scanned TV on a model 0.2 deep.
    const fit = homeMapModelFit([1.2, 0.2, 0.8], [1.07, 0.05, 0.73]);
    expect(fit.x).toBeCloseTo(1.07 / 1.2);
    expect(fit.y).toBeCloseTo(0.73 / 0.8);
    expect(fit.z).toBeCloseTo(0.5 * Math.min(1.07 / 1.2, 0.73 / 0.8));
    expect(fit.z).toBeGreaterThan(0.05 / 0.2);
  });

  it("stretches by 1 along a way the model has no size", () => {
    expect(homeMapModelFit([0, 1, 1], [2, 1, 1]).x).toBe(1);
  });
});

describe("where a new piece starts", () => {
  it("stands at its own lift, or hangs with its top at the room's height", () => {
    expect(homeMapPieceLift(piece("loungeSofa"), 2.5)).toBe(0);
    expect(homeMapPieceLift(piece("laptop"), 2.5)).toBe(0.75);
    const ceiling = piece("lampSquareCeiling");
    expect(ceiling.ceiling).toBe(true);
    expect(homeMapPieceLift(ceiling, 2.5)).toBeCloseTo(2.5 - ceiling.size[2]);
    // Never below the floor in a room lower than the piece.
    expect(homeMapPieceLift(ceiling, 0.5)).toBe(0);
  });

  it("says its size for the picker", () => {
    expect(homeMapPieceSizeText(piece("bedDouble"))).toBe("1.60 × 1.88 m");
  });
});

describe("adding a piece and changing one", () => {
  it("adds the piece's kind, model, size and lift at the end of the room's list, square, at the point given", () => {
    const before = fixture();
    const after = done(before, addPiece(before, LIVING, piece("bedDouble"), [3, 2.5]));
    const objects = room(after, LIVING).objects;
    expect(objects).toHaveLength(room(before, LIVING).objects.length + 1);
    expect(objects.at(-1)).toEqual({ kind: "bed", model: "bedDouble", c: [3, 2.5], size: [1.6, 1.88, 0.63], turn: 0 });
    const laptop = done(after, addPiece(after, LIVING, piece("laptop"), [3, 2.5]));
    expect(room(laptop, LIVING).objects.at(-1)).toMatchObject({ kind: "laptop", model: "laptop", lift: 0.75 });
    const lamp = done(after, addPiece(after, KITCHEN, piece("lampSquareCeiling"), [8, 2.5]));
    expect(room(lamp, KITCHEN).objects.at(-1)!.lift).toBeCloseTo(2.5 - piece("lampSquareCeiling").size[2], 2);
  });

  it("keeps the new piece inside the room, off its walls", () => {
    const before = fixture();
    // The living room is 0 to 6 by 0 to 5; a double bed asked for in its corner.
    const after = done(before, addPiece(before, LIVING, piece("bedDouble"), [0, 0]));
    const bed = room(after, LIVING).objects.at(-1)!;
    expect(bed.c[0]).toBeCloseTo(0.05 + 1.6 / 2, 2);
    expect(bed.c[1]).toBeCloseTo(0.05 + 1.88 / 2, 2);
    const far = done(before, addPiece(before, LIVING, piece("bedDouble"), [40, 40]));
    expect(room(far, LIVING).objects.at(-1)!.c).toEqual([5.15, 4.01]);
    // A piece wider than the room sits in its middle.
    const tiny: HomeMapRoom = { ...room(before, LIVING), outline: [[0, 0], [1, 0], [1, 1], [0, 1]], walls: [] };
    expect(homeMapInsideRoom(tiny, [0.1, 0.1], [2, 2, 1])).toEqual([0.5, 0.5]);
  });

  it("refuses a room that is gone or a piece the store would refuse", () => {
    const before = fixture();
    expect(addPiece(before, "7B1E0C2A-5D3F-4A8B-9C6D-0000000000FF", piece("desk"), [1, 1])).toBeUndefined();
    expect(addPiece(before, LIVING, { ...piece("desk"), id: "Desk" }, [1, 1])).toBeUndefined();
    expect(addPiece(before, LIVING, piece("desk"), [Number.NaN, 1])).toBeUndefined();
  });

  it("changes a thing's piece and kind, keeping its place, size, turn, lift and hidden", () => {
    const start = fixture();
    const raised = done(start, setObject(start, LIVING, 2, { lift: 0.9 }));
    const hidden = done(raised, setObjectHidden(raised, LIVING, 2, true));
    const old = room(hidden, LIVING).objects[2]!;
    const after = done(hidden, setObjectPiece(hidden, LIVING, 2, piece("televisionVintage")));
    expect(room(after, LIVING).objects[2]).toEqual({ ...old, kind: "television", model: "televisionVintage" });
    const asLamp = done(after, setObjectPiece(after, LIVING, 2, piece("lampRoundFloor")));
    expect(room(asLamp, LIVING).objects[2]).toMatchObject({ kind: "lamp", model: "lampRoundFloor", c: old.c, size: old.size, turn: old.turn, lift: 0.9, hidden: true });
    expect(setObjectPiece(start, LIVING, 99, piece("desk"))).toBeUndefined();
  });

  it("undoes and redoes both, as every edit", () => {
    const api: HomeMapApi = { get: async () => ({ doc: fixture(), rev: 1 }), save: async (_doc, baseRev) => ({ rev: baseRev + 1 }) };
    const s = new HomeMapSession(api, { doc: fixture(), rev: 1 });
    const count = () => room(s.doc!, LIVING).objects.length;
    const n = count();
    expect(s.apply((d) => addPiece(d, LIVING, piece("pottedPlant"), [1, 1]))).toBe(true);
    expect(count()).toBe(n + 1);
    expect(s.apply((d) => setObjectPiece(d, LIVING, n, piece("plantSmall1")))).toBe(true);
    expect(room(s.doc!, LIVING).objects[n]!.model).toBe("plantSmall1");
    expect(s.undo()).toBe(true);
    expect(room(s.doc!, LIVING).objects[n]!.model).toBe("pottedPlant");
    expect(s.undo()).toBe(true);
    expect(count()).toBe(n);
    expect(s.redo()).toBe(true);
    expect(count()).toBe(n + 1);
  });
});

describe("the picker", () => {
  it("shows every group in the catalog's order with no search", () => {
    const sections = homeMapPickerSections("", "");
    expect(sections.map((s) => s.title)).toEqual(HOME_MAP_FURNITURE.groups);
    expect(sections.reduce((n, s) => n + s.pieces.length, 0)).toBe(HOME_MAP_FURNITURE.pieces.length);
  });

  it("puts a thing's own kind first when changing it", () => {
    const sections = homeMapPickerSections("", "", "television");
    expect(sections[0]!.title).toBe("TV pieces");
    expect(sections[0]!.pieces.every((p) => p.kind === "television")).toBe(true);
    expect(sections.reduce((n, s) => n + s.pieces.length, 0)).toBe(HOME_MAP_FURNITURE.pieces.length);
    expect(homeMapPieceSearch("", "chair")[0]!.kind).toBe("chair");
  });

  it("finds by every word, within a group", () => {
    const [found] = homeMapPickerSections("floor lamp", "");
    expect(found!.pieces.map((p) => p.id)).toEqual(["lampRoundFloor", "lampSquareFloor"]);
    const [kitchen] = homeMapPickerSections("", "Kitchen");
    expect(kitchen!.title).toBe("Kitchen");
    expect(kitchen!.pieces.every((p) => p.group === "Kitchen")).toBe(true);
    expect(homeMapPickerSections("zebra", "")[0]!.pieces).toEqual([]);
  });

  it("names a thing by its piece, else its kind", () => {
    expect(homeMapThingName({ kind: "bed", model: "bedBunk" })).toBe("Bunk bed");
    expect(homeMapThingName({ kind: "bed" })).toBe("Bed");
    expect(homeMapThingName({ kind: "bed", model: "notYet" })).toBe("Bed");
  });

  it("adds to the picked room, else the room in the view's middle, else the nearest", () => {
    const floor = fixture().floors[0]!;
    const view = { scale: 50, ox: 0, oy: 0 };
    const stage = { width: 400, height: 300 };
    // The middle of the stage is plan point 4, 3: the living room.
    expect(homeMapRoomForAdding({ floor, selection: undefined, view, stage })?.id).toBe(LIVING);
    expect(homeMapRoomForAdding({ floor, selection: { kind: "room", roomId: KITCHEN }, view, stage })?.id).toBe(KITCHEN);
    // Plan point 12, 3 is in no room; the kitchen's middle is nearest.
    expect(homeMapRoomForAdding({ floor, selection: undefined, view: { scale: 50, ox: -400, oy: 0 }, stage })?.id).toBe(KITCHEN);
    expect(homeMapRoomForAdding({ floor: { ...floor, rooms: [] }, selection: undefined, view, stage })).toBeUndefined();
  });
});

describe("a light in the 3D look", () => {
  const pin = { id: "P", entityId: "light.lamp", at: [1, 1, 1.2] as [number, number, number] };
  const on = (attributes: Record<string, unknown>) => ({ "light.lamp": { state: "on", attributes } });

  it("shines at its brightness, full when Home Assistant gives none, and not at all off or gone", () => {
    expect(homeMapLampOf(pin, on({ brightness: 128 })).level).toBeCloseTo(128 / 255);
    expect(homeMapLampOf(pin, on({})).level).toBe(1);
    expect(homeMapLampOf(pin, { "light.lamp": { state: "off" } }).level).toBe(0);
    expect(homeMapLampOf(pin, { "light.lamp": { state: "unavailable" } }).level).toBe(0);
    expect(homeMapLampOf(pin, {}).level).toBe(0);
    expect(homeMapLampOf(pin, undefined).level).toBe(0);
  });

  it("takes its colour from rgb_color, else color_temp_kelvin, else a warm 2700 K", () => {
    expect(homeMapLampOf(pin, on({ rgb_color: [255, 0, 51], color_temp_kelvin: 6500 })).rgb).toEqual([1, 0, 0.2]);
    expect(homeMapLampOf(pin, on({ color_temp_kelvin: 6500 })).rgb).toEqual(homeMapKelvinColor(6500));
    expect(homeMapLampOf(pin, on({})).rgb).toEqual(homeMapKelvinColor(2700));
    const [r, g, b] = homeMapKelvinColor(2700);
    expect(r).toBe(1);
    expect(g).toBeLessThan(r);
    expect(b).toBeLessThan(g);
    const day = homeMapKelvinColor(6600);
    expect(day.every((v) => v > 0.95)).toBe(true);
  });
});

describe("an object's fabric and wood", () => {
  it("are kept after the model, fabric before wood, in the case they were sent", () => {
    const doc = fixture() as unknown as Record<string, any>;
    doc.floors[0].rooms[0].objects[0] = { ...doc.floors[0].rooms[0].objects[0], hidden: true, wood: "#6b4a32", lift: 0.4, fabric: "#8E8E93", model: "loungeSofa" };
    const out = checkHomeMap(doc);
    if (!out.ok) throw new Error(out.message);
    const object = out.doc.floors[0]!.rooms[0]!.objects[0]!;
    expect(Object.keys(object)).toEqual(["kind", "model", "fabric", "wood", "c", "size", "turn", "lift", "hidden"]);
    expect(object.fabric).toBe("#8E8E93");
    expect(object.wood).toBe("#6b4a32");
    // On any object, either alone, with no model.
    const plain = fixture() as unknown as Record<string, any>;
    plain.floors[0].rooms[0].objects[0].wood = "#D9B88A";
    const kept = checkHomeMap(plain);
    expect(kept.ok && Object.keys(kept.doc.floors[0]!.rooms[0]!.objects[0]!)).toEqual(["kind", "wood", "c", "size", "turn"]);
  });

  it("are refused empty or not #RRGGBB, in the store's words", () => {
    for (const part of ["fabric", "wood"]) {
      const words = `doc.floors[0].rooms[0].objects[0].${part} must be a colour like #8E8E93`;
      for (const bad of ["", "warm", "8E8E93", "#8E8E9", "#8E8E93FF", "#GGGGGG", null, 3]) {
        expect(refusal((d) => { d.floors[0].rooms[0].objects[0][part] = bad; })).toBe(words);
      }
    }
  });

  it("are ordered by orderedObject and never kept empty", () => {
    const object = { wood: "#2A2A2A", turn: 0, size: [1, 1, 1], c: [0, 0], fabric: "#3A3A3C", model: "loungeSofa", kind: "sofa" } as unknown as HomeMapObject;
    expect(Object.keys(orderedObject(object))).toEqual(["kind", "model", "fabric", "wood", "c", "size", "turn"]);
    expect(Object.keys(orderedObject({ ...object, fabric: "", wood: undefined }))).toEqual(["kind", "model", "c", "size", "turn"]);
  });
});

describe("colouring a thing", () => {
  it("sets a part in upper case and Default takes the key away, each its own edit", () => {
    const start = fixture();
    const fabric = done(start, setObjectPart(start, LIVING, 0, "fabric", "#2e4a7d"));
    expect(room(fabric, LIVING).objects[0]!.fabric).toBe("#2E4A7D");
    const both = done(fabric, setObjectPart(fabric, LIVING, 0, "wood", "#6B4A32"));
    expect(Object.keys(room(both, LIVING).objects[0]!)).toEqual(["kind", "fabric", "wood", "c", "size", "turn"]);
    const back = done(both, setObjectPart(both, LIVING, 0, "fabric", undefined));
    expect(room(back, LIVING).objects[0]).not.toHaveProperty("fabric");
    expect(room(back, LIVING).objects[0]!.wood).toBe("#6B4A32");
  });

  it("makes no edit for the same colour, a bad one, a thing that is gone or a part it does not know", () => {
    const start = fixture();
    const set = setObjectPart(start, LIVING, 0, "wood", "#B98B5A")!;
    expect(setObjectPart(set, LIVING, 0, "wood", "#b98b5a")).toBeUndefined();
    expect(setObjectPart(start, LIVING, 0, "wood", undefined)).toBeUndefined();
    expect(setObjectPart(start, LIVING, 0, "wood", "brown")).toBeUndefined();
    expect(setObjectPart(start, LIVING, 99, "wood", "#B98B5A")).toBeUndefined();
    expect(setObjectPart(start, LIVING, 0, "metal" as "wood", "#B98B5A")).toBeUndefined();
  });

  it("keeps the colours when the thing is changed to another piece", () => {
    const start = fixture();
    const coloured = done(start, setObjectPart(start, LIVING, 0, "fabric", "#4F6B4A"));
    const changed = done(coloured, setObjectPiece(coloured, LIVING, 0, piece("loungeDesignSofa")));
    expect(room(changed, LIVING).objects[0]).toMatchObject({ model: "loungeDesignSofa", fabric: "#4F6B4A" });
  });

  it("is one undo step and one save for each pick", async () => {
    const saves: HomeMapDocument[] = [];
    const api: HomeMapApi = { get: async () => ({ doc: fixture(), rev: 1 }), save: async (doc, baseRev) => { saves.push(doc); return { rev: baseRev + 1 }; } };
    const s = new HomeMapSession(api, { doc: fixture(), rev: 1 });
    expect(s.apply((d) => setObjectPart(d, LIVING, 0, "fabric", "#C9A13B"))).toBe(true);
    await s.idle();
    expect(saves).toHaveLength(1);
    expect(room(saves[0]!, LIVING).objects[0]!.fabric).toBe("#C9A13B");
    expect(s.apply((d) => setObjectPart(d, LIVING, 0, "wood", "#3B2A20"))).toBe(true);
    await s.idle();
    expect(saves).toHaveLength(2);
    expect(room(s.doc!, LIVING).objects[0]).toMatchObject({ fabric: "#C9A13B", wood: "#3B2A20" });
    expect(s.undo()).toBe(true);
    expect(room(s.doc!, LIVING).objects[0]).toMatchObject({ fabric: "#C9A13B" });
    expect(room(s.doc!, LIVING).objects[0]).not.toHaveProperty("wood");
    expect(s.undo()).toBe(true);
    expect(room(s.doc!, LIVING).objects[0]).not.toHaveProperty("fabric");
    expect(s.redo()).toBe(true);
    expect(room(s.doc!, LIVING).objects[0]!.fabric).toBe("#C9A13B");
  });
});

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}
function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}
function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

/** The thing inspector's text for the living room's thing `index` on
 * `doc`, and the edits its buttons made. */
function inspect(doc: HomeMapDocument, index: number) {
  let now = doc;
  const selection: HomeMapSelection = { kind: "object", roomId: LIVING, object: index };
  const ctx = {
    hass: undefined,
    get doc() { return now; },
    get floor() { return now.floors[0]!; },
    selection,
    toggles: { snap: true, square: true, grid: false, measure: false, live: false },
    pages: [],
    areas: [],
    furnitureBase: undefined,
    apply(op: HomeMapOp) {
      const next = op(now);
      if (next === undefined) return false;
      now = next;
      return true;
    },
    preview: () => {},
    select: () => {},
    redraw: () => {},
  } as unknown as HomeMapEditorContext;
  return { text: flatten(new ArrangeMode().inspector(ctx)), get doc() { return now; } };
}

describe("the Colours card", () => {
  it("offers fabric and wood for a sofa, wood only for a desk and nothing for a TV", () => {
    expect(homeMapColourParts({ kind: "sofa", size: [2, 0.9, 0.8] })).toEqual(["fabric", "wood"]);
    expect(homeMapColourParts({ kind: "table", model: "desk", size: [1.4, 0.7, 0.75] })).toEqual(["wood"]);
    expect(homeMapColourParts({ kind: "television", size: [1.2, 0.1, 0.7] })).toEqual([]);
    expect(homeMapColourParts({ kind: "sofa", model: "loungeDesignSofa", size: [2, 0.9, 0.8] })).toEqual(["fabric"]);
    // A plain box has no parts.
    expect(homeMapColourParts({ kind: "fireplace", size: [1, 0.4, 1] })).toEqual([]);
    expect(homeMapPieceParts(undefined)).toEqual([]);
  });

  it("shows a row for each part the piece has, beside the Model card, and none for a TV", () => {
    const start = fixture();
    const desk = done(start, setObjectPiece(start, LIVING, 1, piece("desk")));
    const sofa = inspect(desk, 0).text;
    expect(sofa).toContain(">Colours<");
    expect(sofa.indexOf(">Model<")).toBeLessThan(sofa.indexOf(">Colours<"));
    expect(sofa.indexOf(">Colours<")).toBeLessThan(sofa.indexOf(">Size<"));
    expect(sofa).toContain(">Fabric<");
    expect(sofa).toContain(">Wood<");
    for (const p of [...HOME_MAP_FABRIC_PRESETS, ...HOME_MAP_WOOD_PRESETS]) expect(sofa).toContain(p.hex);
    const deskText = inspect(desk, 1).text;
    expect(deskText).toContain(">Colours<");
    expect(deskText).not.toContain(">Fabric<");
    expect(deskText).toContain(">Wood<");
    expect(deskText).not.toContain(HOME_MAP_FABRIC_PRESETS[0]!.hex);
    const tv = inspect(desk, 2).text;
    expect(tv).not.toContain(">Colours<");
    expect(tv).not.toContain(">Fabric<");
  });

  it("offers the spec's presets in its order", () => {
    expect(HOME_MAP_FABRIC_PRESETS.map((p) => `${p.name} ${p.hex}`)).toEqual([
      "Grey #8E8E93", "Charcoal #3A3A3C", "Cream #E8DCC8", "Navy #2E4A7D", "Green #4F6B4A", "Mustard #C9A13B", "Rust #A0522D", "Blush #D8A7A0",
    ]);
    expect(HOME_MAP_WOOD_PRESETS.map((p) => `${p.name} ${p.hex}`)).toEqual([
      "Light oak #D9B88A", "Oak #B98B5A", "Walnut #6B4A32", "Espresso #3B2A20", "White #EDEDED", "Black #2A2A2A",
    ]);
  });
});

describe("recolouring a model", () => {
  const near = (got: readonly number[] | undefined, want: readonly number[]) => {
    expect(got).toBeDefined();
    got!.forEach((v, i) => expect(v).toBeCloseTo(want[i]!, 5));
  };

  it("turns an sRGB hex into linear colour", () => {
    near(homeMapLinearOf("#FFFFFF"), [1, 1, 1]);
    near(homeMapLinearOf("#000000"), [0, 0, 0]);
    // 0x80 is 0.2159 linear; 0x0A falls on the straight part of the curve.
    near(homeMapLinearOf("#80800a"), [0.215861, 0.215861, 10 / 255 / 12.92]);
    expect(homeMapLinearOf("warm")).toBeUndefined();
    expect(homeMapLinearOf(undefined)).toBeUndefined();
  });

  it("changes the fabric and wood materials only, the darker ones by their factor in linear", () => {
    const colors = { fabric: "#2E4A7D", wood: "#6B4A32" };
    const fabric = homeMapLinearOf("#2E4A7D")!;
    const wood = homeMapLinearOf("#6B4A32")!;
    near(homeMapMaterialTint("carpet", colors), fabric);
    near(homeMapMaterialTint("carpetBlue", colors), fabric);
    near(homeMapMaterialTint("carpetDarker", colors), fabric.map((v) => v * 0.645));
    near(homeMapMaterialTint("wood", colors), wood);
    near(homeMapMaterialTint("woodDark", colors), wood.map((v) => v * 0.757));
    for (const name of ["carpetWhite", "metal", "metalDark", "metalLight", "glass", "plant", "_defaultMat", "toString", ""]) {
      expect(homeMapMaterialTint(name, colors), name).toBeUndefined();
    }
    expect(Object.keys(HOME_MAP_TINTED_MATERIALS).sort()).toEqual(["carpet", "carpetBlue", "carpetDarker", "lamp", "wood", "woodDark"]);
  });

  it("takes a lamp's shade as fabric, in the fabric colour as it is", () => {
    const fabric = homeMapLinearOf("#C9A13B")!;
    near(homeMapMaterialTint("lamp", { fabric: "#C9A13B", wood: "#6B4A32" }), fabric);
    expect(homeMapMaterialTint("lamp", { wood: "#6B4A32" })).toBeUndefined();
    expect(HOME_MAP_FURNITURE.pieces.find((p) => p.id === "lampRoundFloor")?.fabric).toBe(true);
  });

  it("leaves a part with no colour of its own as the model has it", () => {
    expect(homeMapMaterialTint("carpet", { wood: "#6B4A32" })).toBeUndefined();
    expect(homeMapMaterialTint("wood", { fabric: "#2E4A7D" })).toBeUndefined();
    expect(homeMapMaterialTint("wood", {})).toBeUndefined();
  });

  it("finds the flagged parts in the models themselves", () => {
    // Each piece's fabric and wood flags match its model's material names.
    for (const p of HOME_MAP_FURNITURE.pieces) {
      const glb = readFileSync(join(MODELS, `${p.id}.glb`));
      const json = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString("utf8")) as { materials?: { name?: string }[] };
      const names = (json.materials ?? []).map((m) => m.name ?? "");
      const has = (part: "fabric" | "wood") => names.some((n) => HOME_MAP_TINTED_MATERIALS[n]?.part === part);
      expect(p.fabric === true, `${p.id} fabric`).toBe(has("fabric"));
      expect(p.wood === true, `${p.id} wood`).toBe(has("wood"));
    }
  });
});
