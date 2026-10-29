// Things hold devices, lamps lights among them: an object's `device` key as
// the store checks and orders it (a pin id's shape only, never looked up),
// `light` its old spelling read as `device`, the catalog's bulb and cast on
// every lamp and its hold spots, and the first download's copy of them,
// where a lamp's bulb and any other thing's hold spot are (against three.js
// placing the model as the 3D look does), how a reader takes the links (a
// link to no pin, or to a pin an earlier thing holds, is ignored), and the
// edits: a light added in a new lamp of each kind, any device linked onto
// and off any thing, kept on it by every edit that moves, sizes, turns,
// lifts or re-models the thing or moves its room, moving its thing when it
// is moved itself, and deleted with its thing either way round. A light
// entity may have many pins.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { describe, expect, it } from "vitest";

import {
  addAnotherLamp,
  addDeviceToThing,
  addLampLight,
  addPiece,
  addPin,
  centerPinInRoom,
  deleteRoom,
  homeMapHeldPins,
  homeMapHeldPin,
  homeMapThingOfPin,
  homeMapPinsOfEntity,
  homeMapWallSpot,
  levelObject,
  linkDevice,
  moveObject,
  moveObjects,
  movePin,
  movePins,
  moveRoom,
  moveRoomToFloor,
  placeAllByArea,
  removeObject,
  removeObjects,
  removePin,
  removePins,
  renameRoom,
  resizeObject,
  resizeRoom,
  sameHeightForLights,
  setObject,
  setObjectHidden,
  setObjectPart,
  setObjectPiece,
  setPinEntity,
  setPinFields,
  setPinHeight,
  setPinsHeight,
  setWallHeight,
  turnObject,
  turnRoom,
  unlinkDevice,
} from "../src/home-map/edit-ops.js";
import {
  HOME_MAP_FURNITURE,
  HOME_MAP_LAMP_CHOICES,
  HOME_MAP_LAMP_CHOICE_MODELS,
  homeMapHoldPiece,
  homeMapHoldSpot,
  homeMapLampPiece,
  homeMapModelFit,
  homeMapPiece,
  homeMapPieceOf,
} from "../src/home-map/furniture.js";
import { HOME_MAP_HOLD_DEFAULTS, HOME_MAP_HOLD_PIECES, HOME_MAP_LAMP_PIECES } from "../src/home-map/furniture-rules.js";
import { type HomeMapDocument, type HomeMapFloor, type HomeMapObject, type HomeMapPin, checkHomeMap, orderedObject } from "../src/home-map/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const LOCK = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const NEW = "7B1E0C2A-5D3F-4A8B-9C6D-000000000200";
const NEW2 = "7B1E0C2A-5D3F-4A8B-9C6D-000000000201";
const NEW3 = "7B1E0C2A-5D3F-4A8B-9C6D-000000000202";
const THERMOSTAT = "7B1E0C2A-5D3F-4A8B-9C6D-000000000104";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
/** The fixture living room's television, the third thing of the room. */
const TV_INDEX = 2;

const floorOf = (doc: HomeMapDocument): HomeMapFloor => doc.floors[0]!;
const roomOf = (doc: HomeMapDocument, roomId: string) => doc.floors.flatMap((f) => f.rooms).find((r) => r.id === roomId)!;
const pinOf = (doc: HomeMapDocument, pinId: string): HomeMapPin | undefined => doc.floors.flatMap((f) => f.pins).find((p) => p.id === pinId);
const lampPiece = (id: string) => {
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

/** The light `pinId` stands at its lamp's bulb and in its lamp's room. */
function expectAtBulb(doc: HomeMapDocument, pinId: string): { lamp: HomeMapObject; pin: HomeMapPin } {
  const floor = floorOf(doc);
  const ref = homeMapThingOfPin(floor, pinId);
  expect(ref).toBeDefined();
  const lamp = roomOf(doc, ref!.roomId).objects[ref!.object]!;
  const pin = pinOf(doc, pinId)!;
  expect(pin.at).toEqual(homeMapHoldSpot(lamp, homeMapLampPiece(lamp.model)!, true));
  expect(pin.roomId).toBe(ref!.roomId);
  return { lamp, pin };
}

/** The pin `pinId` stands on the thing holding it, at its hold spot, and in
 * its room. */
function expectOnThing(doc: HomeMapDocument, pinId: string): { thing: HomeMapObject; pin: HomeMapPin } {
  const ref = homeMapThingOfPin(floorOf(doc), pinId);
  expect(ref).toBeDefined();
  const thing = roomOf(doc, ref!.roomId).objects[ref!.object]!;
  const pin = pinOf(doc, pinId)!;
  expect(pin.at).toEqual(homeMapHoldSpot(thing, homeMapHoldPiece(thing), pin.entityId.startsWith("light.")));
  expect(pin.roomId).toBe(ref!.roomId);
  return { thing, pin };
}

/** The fixture with a floor lamp in the living room at (2, 2) holding the
 * reading lamp's pin. */
function withFloorLamp(): HomeMapDocument {
  const doc = fixture();
  const added = done(doc, addPiece(doc, LIVING, lampPiece("lampRoundFloor"), [2, 2]));
  const index = roomOf(added, LIVING).objects.length - 1;
  return done(added, linkDevice(added, FLOOR, LIVING, index, READING));
}
const LAMP_INDEX = 3;

// ── the contract ─────────────────────────────────────────────────────────

describe("an object's device key", () => {
  it("is kept after the wood and before the centre, whatever order it was sent in", () => {
    const doc = fixture() as unknown as Record<string, any>;
    const object = doc.floors[0].rooms[0].objects[0];
    doc.floors[0].rooms[0].objects[0] = { device: READING.toLowerCase(), ...object, hidden: true, lift: 0.4, wood: "#6B4A32", fabric: "#8E8E93", model: "lampRoundFloor" };
    const out = checkHomeMap(doc);
    if (!out.ok) throw new Error(out.message);
    const kept = out.doc.floors[0]!.rooms[0]!.objects[0]!;
    expect(Object.keys(kept)).toEqual(["kind", "model", "fabric", "wood", "device", "c", "size", "turn", "lift", "hidden"]);
    expect(kept.device).toBe(READING.toLowerCase());
    expect(Object.keys(orderedObject({ ...object, hidden: true, lift: 0.4, device: READING, model: "lampWall" } as HomeMapObject))).toEqual(
      ["kind", "model", "device", "c", "size", "turn", "lift", "hidden"],
    );
  });

  it("reads light, its old spelling, as device, and device wins when both are sent", () => {
    // The real map has two light links stored, and the iPhone build of then
    // still writes light.
    const doc = fixture() as unknown as Record<string, any>;
    const object = doc.floors[0].rooms[0].objects[0];
    doc.floors[0].rooms[0].objects[0] = { light: READING, ...object, model: "lampRoundFloor" };
    const out = checkHomeMap(doc);
    if (!out.ok) throw new Error(out.message);
    const kept = out.doc.floors[0]!.rooms[0]!.objects[0]!;
    expect(Object.keys(kept)).toEqual(["kind", "model", "device", "c", "size", "turn"]);
    expect(kept.device).toBe(READING);
    doc.floors[0].rooms[0].objects[0].device = CEILING;
    const both = checkHomeMap(doc);
    if (!both.ok) throw new Error(both.message);
    expect(both.doc.floors[0]!.rooms[0]!.objects[0]).toMatchObject({ device: CEILING });
    expect("light" in both.doc.floors[0]!.rooms[0]!.objects[0]!).toBe(false);
    // orderedObject, every edit's last step, writes it as device too.
    expect(orderedObject({ ...object, light: READING } as HomeMapObject)).toEqual({ kind: "sofa", device: READING, c: [2.7, 4.15], size: [3, 0.9, 0.75], turn: 0 });
    expect(orderedObject({ ...object, light: READING, device: CEILING } as HomeMapObject).device).toBe(CEILING);
  });

  it("reads an unchecked light link as held, and the next edit writes it as device", () => {
    const doc = fixture();
    doc.floors[0]!.rooms[0]!.objects[TV_INDEX] = { ...doc.floors[0]!.rooms[0]!.objects[TV_INDEX]!, light: LOCK };
    expect(homeMapThingOfPin(floorOf(doc), LOCK)).toEqual({ roomId: LIVING, object: TV_INDEX });
    const out = done(doc, renameRoom(doc, KITCHEN, "Galley"));
    expect(roomOf(out, LIVING).objects[TV_INDEX]).toMatchObject({ device: LOCK });
    expect("light" in roomOf(out, LIVING).objects[TV_INDEX]!).toBe(false);
    expectOnThing(out, LOCK);
  });

  it("is checked by its shape only: a pin no floor has is kept, as an entity id is", () => {
    const doc = fixture() as unknown as Record<string, any>;
    doc.floors[0].rooms[0].objects[0].device = NEW;
    doc.floors[0].rooms[0].objects[1].device = NEW;
    expect(checkHomeMap(doc).ok).toBe(true);
  });

  it("is refused when it is not shaped like a pin id, an empty one too, by the name it was sent as", () => {
    for (const key of ["device", "light"]) {
      for (const bad of ["", "light.reading_lamp", `${READING}0`, READING.slice(1), null, 3, [READING]]) {
        const doc = fixture() as unknown as Record<string, any>;
        doc.floors[0].rooms[0].objects[0][key] = bad;
        const out = checkHomeMap(doc);
        expect(out.ok).toBe(false);
        if (!out.ok) expect(out.message).toBe(`doc.floors[0].rooms[0].objects[0].${key} must be a pin's id, a UUID`);
      }
    }
  });

  it("is never written empty", () => {
    const object = fixture().floors[0]!.rooms[0]!.objects[0]!;
    expect("device" in orderedObject({ ...object, device: "" })).toBe(false);
    expect("device" in orderedObject({ ...object, light: "" })).toBe(false);
  });
});

// ── the catalog ──────────────────────────────────────────────────────────

describe("the catalog's lamps", () => {
  const lamps = HOME_MAP_FURNITURE.pieces.filter((p) => p.kind === "lamp");

  it("each have a bulb inside their own box and a way of shining, the ceiling lamp shining down", () => {
    expect(lamps.length).toBe(6);
    for (const p of lamps) {
      expect(p.bulb, p.id).toHaveLength(3);
      for (const v of p.bulb!) expect(v >= 0 && v <= 1, p.id).toBe(true);
      expect(["point", "down"]).toContain(p.cast);
    }
    expect(lampPiece("lampSquareCeiling").cast).toBe("down");
    expect(lampPiece("lampWall").cast).toBe("point");
    // Only lamps have a bulb.
    expect(HOME_MAP_FURNITURE.pieces.filter((p) => p.bulb !== undefined || p.cast !== undefined).every((p) => p.kind === "lamp")).toBe(true);
  });

  it("are copied for the first download exactly as the catalog has them", () => {
    expect(HOME_MAP_LAMP_PIECES).toEqual(lamps);
    for (const p of lamps) expect(homeMapLampPiece(p.id)).toEqual(p);
    expect(homeMapLampPiece("loungeSofa")).toBeUndefined();
    expect(homeMapLampPiece(undefined)).toBeUndefined();
    expect(homeMapLampPiece("lampFromANewerCatalog")).toBeUndefined();
  });
});

describe("the catalog's hold spots", () => {
  const holders = HOME_MAP_FURNITURE.pieces.filter((p) => p.hold !== undefined);

  it("are on the TVs and the monitor, each inside its own box, never on a lamp", () => {
    expect(holders.map((p) => p.id)).toEqual(["televisionModern", "televisionVintage", "computerScreen"]);
    for (const p of holders) {
      expect(p.hold, p.id).toHaveLength(3);
      for (const v of p.hold!) expect(v >= 0 && v <= 1, p.id).toBe(true);
      expect(p.bulb).toBeUndefined();
    }
  });

  it("are copied for the first download exactly as the catalog has them, with the kinds whose default is one", () => {
    expect(HOME_MAP_HOLD_PIECES).toEqual(holders);
    const copied = new Set(HOME_MAP_HOLD_PIECES.map((p) => p.id));
    const defaults = Object.fromEntries(Object.entries(HOME_MAP_FURNITURE.defaults).filter(([, id]) => copied.has(id)));
    expect(HOME_MAP_HOLD_DEFAULTS).toEqual(defaults);
  });

  it("are found for a thing by its model, or with none by its kind, as the 3D look draws it", () => {
    const tv = { kind: "television", size: [1.6, 0.08, 0.65] as [number, number, number] };
    expect(homeMapHoldPiece(tv)?.id).toBe(homeMapPieceOf(tv)?.id);
    expect(homeMapHoldPiece({ ...tv, model: "televisionVintage" })?.id).toBe("televisionVintage");
    expect(homeMapHoldPiece({ ...tv, model: "lampWall" })?.id).toBe("lampWall");
    expect(homeMapHoldPiece({ kind: "sofa" })).toBeUndefined();
    expect(homeMapHoldPiece({ kind: "sofa", model: "loungeSofa" })).toBeUndefined();
  });

  it("are what the lamp chooser makes, and a bare bulb makes none", () => {
    expect(HOME_MAP_LAMP_CHOICES).toEqual(["ceiling", "floor", "table", "wall", "bulb"]);
    expect(HOME_MAP_LAMP_CHOICE_MODELS).toEqual({ ceiling: "lampSquareCeiling", floor: "lampRoundFloor", table: "lampRoundTable", wall: "lampWall", bulb: undefined });
  });

  it("never come along with the edits: the first download holds no catalog", () => {
    for (const file of ["edit-ops.ts", "furniture-rules.ts", "model.ts"]) {
      const text = readFileSync(join(__dirname, "..", "src", "home-map", file), "utf8");
      expect(/from "\.\/furniture-catalog\.json"/.test(text), file).toBe(false);
      expect(/from "\.\/furniture\.js"/.test(text), file).toBe(false);
    }
  });
});

// ── the bulb spot ────────────────────────────────────────────────────────

describe("where a lamp's bulb, or any other thing's device, is", () => {
  /** The bulb (or `share`) as the 3D look places it: the thing's group at
   * its middle and lift turned by its turn, the model fitted to its box from
   * its foot. */
  function threeBulb(object: HomeMapObject, pieceId: string, share?: readonly [number, number, number]): [number, number, number] {
    const piece = lampPiece(pieceId);
    const fit = homeMapModelFit(piece.size, object.size);
    const group = new THREE.Group();
    group.position.set(object.c[0], object.lift ?? 0, object.c[1]);
    group.rotation.y = (object.turn * Math.PI) / 180;
    group.updateMatrixWorld(true);
    const [fx, fy, fz] = share ?? piece.bulb!;
    const local = new THREE.Vector3((fx - 0.5) * piece.size[0] * fit.x, fz * piece.size[2] * fit.y, (fy - 0.5) * piece.size[1] * fit.z);
    const world = local.applyMatrix4(group.matrixWorld);
    return [world.x, world.z, world.y];
  }

  it("is the shade's middle of a lamp standing square on the floor", () => {
    const object: HomeMapObject = { kind: "lamp", model: "lampRoundFloor", c: [2, 2], size: [0.33, 0.38, 1.87], turn: 0 };
    expect(homeMapHoldSpot(object, lampPiece("lampRoundFloor"), true)).toEqual([2, 2, 1.68]);
  });

  it("stands on the lamp's lift, a ceiling lamp's where it hangs", () => {
    const object: HomeMapObject = { kind: "lamp", model: "lampSquareCeiling", c: [3, 2], size: [0.5, 0.5, 0.96], turn: 0, lift: 1.54 };
    expect(homeMapHoldSpot(object, lampPiece("lampSquareCeiling"), true)).toEqual([3, 2, 2.02]);
  });

  it("turns and stretches with the lamp as three.js places its model", () => {
    for (const [pieceId, turn, size, lift] of [
      ["lampWall", 90, [0.25, 0.17, 0.1], 1.6],
      ["lampWall", -37, [0.5, 0.3, 0.2], 1.2],
      ["lampWall", 180, [0.25, 0.02, 0.1], 1.6],
      ["lampRoundTable", 45, [0.6, 0.35, 0.62], 0.75],
      ["lampSquareCeiling", 12, [0.8, 0.4, 0.5], 2],
    ] as const) {
      const object: HomeMapObject = { kind: "lamp", model: pieceId, c: [4.2, 1.3], size: [...size], turn, lift };
      const spot = homeMapHoldSpot(object, lampPiece(pieceId), true);
      const three = threeBulb(object, pieceId);
      for (let k = 0; k < 3; k++) expect(Math.abs(spot[k]! - three[k]!), `${pieceId} ${turn} ${k}`).toBeLessThanOrEqual(0.005 + 1e-9);
    }
  });

  it("sits toward a wall lamp's back, the wall side", () => {
    // Turned 90, its depth runs along +x: its back, toward the wall, is -x.
    const object: HomeMapObject = { kind: "lamp", model: "lampWall", c: [1, 1], size: [0.25, 0.17, 0.1], turn: 90, lift: 1.6 };
    expect(homeMapHoldSpot(object, lampPiece("lampWall"), true)).toEqual([0.98, 1, 1.65]);
  });

  // ── where any other device a thing holds is ──

  it("is the piece's hold spot, a TV's screen, turned and stretched as three.js places the model", () => {
    for (const [pieceId, turn, size, lift] of [
      ["televisionModern", 0, [1.2, 0.22, 0.8], 0],
      ["televisionModern", -90, [1.6, 0.08, 0.65], 1.1],
      ["televisionVintage", 33, [0.6, 0.4, 0.4], 0.5],
      ["computerScreen", 180, [0.6, 0.16, 0.45], 0.75],
    ] as const) {
      const object: HomeMapObject = { kind: "television", model: pieceId, c: [3.1, 1.7], size: [...size], turn, lift };
      const piece = lampPiece(pieceId);
      const spot = homeMapHoldSpot(object, piece, false);
      const three = threeBulb(object, pieceId, piece.hold);
      for (let k = 0; k < 3; k++) expect(Math.abs(spot[k]! - three[k]!), `${pieceId} ${turn} ${k}`).toBeLessThanOrEqual(0.005 + 1e-9);
    }
  });

  it("sits on a TV's screen, toward its front, a little above its middle", () => {
    const object: HomeMapObject = { kind: "television", model: "televisionModern", c: [2, 1], size: [1.2, 0.22, 0.8], turn: 0 };
    expect(homeMapHoldSpot(object, lampPiece("televisionModern"), false)).toEqual([2, 1.04, 0.46]);
  });

  it("is the middle of the top for a piece with neither, or a light in a piece with no bulb, or no piece at all", () => {
    const sofa: HomeMapObject = { kind: "sofa", model: "loungeSofa", c: [1, 2], size: [2, 0.9, 0.75], turn: 30, lift: 0.1 };
    expect(homeMapHoldSpot(sofa, lampPiece("loungeSofa"), false)).toEqual([1, 2, 0.85]);
    expect(homeMapHoldSpot(sofa, lampPiece("loungeSofa"), true)).toEqual([1, 2, 0.85]);
    expect(homeMapHoldSpot(sofa, undefined, false)).toEqual([1, 2, 0.85]);
    // A TV's light is no bulb: it sits on the screen as any device does.
    const tv: HomeMapObject = { kind: "television", c: [2, 1], size: [1.2, 0.22, 0.8], turn: 0 };
    expect(homeMapHoldSpot(tv, homeMapHoldPiece(tv), true)).toEqual([2, 1.04, 0.46]);
    // A lamp's own bulb is a light's only: a switch in it sits on its top.
    const lamp: HomeMapObject = { kind: "lamp", model: "lampRoundFloor", c: [2, 2], size: [0.33, 0.38, 1.87], turn: 0 };
    expect(homeMapHoldSpot(lamp, lampPiece("lampRoundFloor"), false)).toEqual([2, 2, 1.87]);
  });
});

// ── reading the links ────────────────────────────────────────────────────

describe("which thing holds which pin", () => {
  it("is the first thing of the floor to name a pin, of any entity; a link to no pin holds nothing", () => {
    const doc = fixture();
    const living = doc.floors[0]!.rooms[0]!;
    const kitchen = doc.floors[0]!.rooms[1]!;
    // The living room comes first on the floor, so its television holds the
    // reading lamp's light, whatever the case of the link.
    kitchen.objects[0]!.device = READING;
    living.objects[2]!.device = READING.toLowerCase();
    living.objects[0]!.device = NEW; // no such pin
    living.objects[1]!.device = LOCK; // a lock, held as any device is
    kitchen.objects[1]!.light = CEILING; // the old spelling
    const held = homeMapHeldPins(doc.floors[0]!);
    expect([...held.entries()]).toEqual([
      [LOCK, { roomId: LIVING, object: 1 }],
      [READING, { roomId: LIVING, object: 2 }],
      [CEILING, { roomId: KITCHEN, object: 1 }],
    ]);
    expect(homeMapThingOfPin(doc.floors[0]!, READING.toLowerCase())).toEqual({ roomId: LIVING, object: 2 });
    expect(homeMapThingOfPin(doc.floors[0]!, LOCK)).toEqual({ roomId: LIVING, object: 1 });
    expect(homeMapHeldPin(doc.floors[0]!, LIVING, 2)?.id).toBe(READING);
    expect(homeMapHeldPin(doc.floors[0]!, LIVING, 1)?.id).toBe(LOCK);
    expect(homeMapHeldPin(doc.floors[0]!, KITCHEN, 1)?.id).toBe(CEILING);
    // The second holder and the dangling link hold nothing.
    expect(homeMapHeldPin(doc.floors[0]!, KITCHEN, 0)).toBeUndefined();
    expect(homeMapHeldPin(doc.floors[0]!, LIVING, 0)).toBeUndefined();
    expect(homeMapHeldPin(doc.floors[0]!, LIVING, 9)).toBeUndefined();
  });

  it("is tidied by the next edit: the links a reader ignores are dropped, each held pin put on its thing", () => {
    const doc = fixture();
    const living = doc.floors[0]!.rooms[0]!;
    const kitchen = doc.floors[0]!.rooms[1]!;
    living.objects[0] = orderedObject({ ...living.objects[0]!, model: "lampRoundFloor", device: READING });
    living.objects[1]!.device = NEW;
    living.objects[2] = orderedObject({ ...living.objects[2]!, device: LOCK });
    kitchen.objects[0]!.device = READING;
    const out = done(doc, renameRoom(doc, KITCHEN, "Galley"));
    expect(roomOf(out, LIVING).objects.map((o) => o.device)).toEqual([READING, undefined, LOCK]);
    expect(roomOf(out, KITCHEN).objects[0]!.device).toBeUndefined();
    expectAtBulb(out, READING);
    // The lock sits on the television's screen.
    expect(expectOnThing(out, LOCK).pin.at).toEqual(homeMapHoldSpot(living.objects[2]!, lampPiece("televisionModern"), false));
  });

  it("puts a light in a lamp this catalog does not know on the middle of its top", () => {
    const doc = fixture();
    doc.floors[0]!.rooms[0]!.objects[0] = orderedObject({ ...doc.floors[0]!.rooms[0]!.objects[0]!, model: "lampFromANewerCatalog", device: READING });
    const out = done(doc, renameRoom(doc, LIVING, "Lounge"));
    expect(roomOf(out, LIVING).objects[0]!.device).toBe(READING);
    expect(pinOf(out, READING)!.at).toEqual([2.7, 4.15, 0.75]);
  });
});

// ── adding a light in a lamp ─────────────────────────────────────────────

describe("adding a light in a lamp", () => {
  it("makes the lamp the choice names, holding a new pin at its bulb in its room", () => {
    for (const [choice, model, lift] of [["ceiling", "lampSquareCeiling", 1.54], ["floor", "lampRoundFloor", undefined], ["table", "lampRoundTable", 0.75]] as const) {
      const doc = fixture();
      const made = addLampLight(doc, FLOOR, LIVING, "light.kitchen_cans", choice, [2, 2], NEW);
      const out = done(doc, made?.doc);
      expect(made!.pinId).toBe(NEW);
      expect(made!.lamp).toEqual({ roomId: LIVING, object: 3 });
      const lamp = roomOf(out, LIVING).objects[3]!;
      expect(lamp).toEqual(orderedObject({ kind: "lamp", model, device: NEW, c: [2, 2], size: lampPiece(model).size, turn: 0, ...(lift === undefined ? {} : { lift }) }));
      const { pin } = expectAtBulb(out, NEW);
      expect(pin.entityId).toBe("light.kitchen_cans");
      expect(floorOf(out).pins).toHaveLength(6);
    }
  });

  it("hangs a ceiling lamp from the room's height, its bulb a little under the shade's top", () => {
    const doc = fixture();
    const out = addLampLight(doc, FLOOR, LIVING, "light.hall", "ceiling", [2, 2], NEW)!.doc;
    expect(pinOf(out, NEW)!.at).toEqual([2, 2, 2.02]);
  });

  it("puts a wall lamp flush on the nearest wall, facing into the room", () => {
    const doc = fixture();
    // Near the living room's left wall, x 0, 10 cm thick.
    const left = done(doc, addLampLight(doc, FLOOR, LIVING, "light.sconce", "wall", [0.4, 2.5], NEW)?.doc);
    const lamp = roomOf(left, LIVING).objects[3]!;
    expect(lamp.turn).toBe(90);
    expect(lamp.c).toEqual([0.14, 2.5]);
    expect(lamp.lift).toBe(1.6);
    expectAtBulb(left, NEW);
    // Near the top wall, y 0: no turn.
    const top = addLampLight(doc, FLOOR, LIVING, "light.sconce", "wall", [3, 0.6], NEW)!.doc;
    expect(roomOf(top, LIVING).objects[3]!).toMatchObject({ c: [3, 0.14], turn: 0 });
    // Near the right wall the kitchen shares, from the living room's side.
    const right = addLampLight(doc, FLOOR, LIVING, "light.sconce", "wall", [5.7, 1], NEW)!.doc;
    expect(roomOf(right, LIVING).objects[3]!).toMatchObject({ c: [5.87, 1], turn: -90 });
    // Near the bottom wall, y 5: half a turn.
    const bottom = addLampLight(doc, FLOOR, LIVING, "light.sconce", "wall", [1, 4.9], NEW)!.doc;
    expect(roomOf(bottom, LIVING).objects[3]!).toMatchObject({ c: [1, 4.87], turn: 180 });
  });

  it("keeps a wall lamp on its wall near a corner", () => {
    const spot = homeMapWallSpot(fixture().floors[0]!.rooms[0]!, [0.25, 0.17, 0.1], [0.02, 0.3])!;
    expect(spot.turn).toBe(90);
    expect(spot.c[1]).toBeCloseTo(0.3, 6);
    const corner = homeMapWallSpot(fixture().floors[0]!.rooms[0]!, [0.25, 0.17, 0.1], [-1, -0.5])!;
    expect(corner.c[0] >= 0.125 - 1e-9 || corner.c[1] >= 0.125 - 1e-9).toBe(true);
  });

  it("as just a bulb makes only the pin, at its kind's height, as adding a pin does", () => {
    const doc = fixture();
    const made = addLampLight(doc, FLOOR, LIVING, "light.hall", "bulb", [2, 2], NEW);
    const out = done(doc, made?.doc);
    expect(made!.lamp).toBeUndefined();
    expect(roomOf(out, LIVING).objects).toHaveLength(3);
    expect(pinOf(out, NEW)).toEqual({ id: NEW, entityId: "light.hall", roomId: LIVING, at: [2, 2, 2.4] });
    expect(addLampLight(doc, FLOOR, LIVING, "light.desk_lamp", "bulb", [2, 2], NEW, "Desk lamp")!.doc.floors[0]!.pins.at(-1)!.at[2]).toBe(0.8);
  });

  it("is refused for something that is not a light, a taken id, no room, or an unknown choice", () => {
    const doc = fixture();
    expect(addLampLight(doc, FLOOR, LIVING, "switch.fan", "floor", [2, 2], NEW)).toBeUndefined();
    expect(addLampLight(doc, FLOOR, LIVING, "light.hall", "floor", [2, 2], READING)).toBeUndefined();
    expect(addLampLight(doc, FLOOR, undefined, "light.hall", "floor", [2, 2], NEW)).toBeUndefined();
    expect(addLampLight(doc, FLOOR, NEW, "light.hall", "floor", [2, 2], NEW)).toBeUndefined();
    expect(addLampLight(doc, NEW, LIVING, "light.hall", "floor", [2, 2], NEW)).toBeUndefined();
    expect(addLampLight(doc, FLOOR, LIVING, "light.hall", "chandelier" as never, [2, 2], NEW)).toBeUndefined();
    expect(addLampLight(doc, FLOOR, LIVING, "light.hall", "floor", [Number.NaN, 2], NEW)).toBeUndefined();
  });

  it("puts one light in as many lamps as it takes: six ceiling cans on one light group", () => {
    let doc = fixture();
    const ids = [0, 1, 2, 3, 4, 5].map((i) => `7B1E0C2A-5D3F-4A8B-9C6D-00000000030${i}`);
    for (const [i, id] of ids.entries()) doc = done(doc, addLampLight(doc, FLOOR, LIVING, "light.cans", "ceiling", [1 + (i % 3) * 2, 1.5 + Math.floor(i / 3) * 2], id)?.doc);
    expect(homeMapPinsOfEntity(doc, "light.cans").map((p) => p.id)).toEqual(ids);
    for (const id of ids) expectAtBulb(doc, id);
    expect(homeMapHeldPins(floorOf(doc)).size).toBe(6);
    // A plain pin of the same light can be added too.
    expect(addPin(doc, FLOOR, { id: NEW, entityId: "light.cans", at: [1, 1] })).toBeDefined();
  });

  it("adds another of the same lamp beside it, holding another pin of the same light with its looks", () => {
    let doc = fixture();
    doc = addLampLight(doc, FLOOR, LIVING, "light.sconce", "wall", [0.4, 2.5], NEW)!.doc;
    doc = setPinFields(doc, NEW, { name: "Sconce", glow: 1.5 })!;
    doc = setObjectPart(doc, LIVING, 3, "fabric", "#8E8E93")!;
    const made = addAnotherLamp(doc, FLOOR, LIVING, 3, NEW2);
    const out = done(doc, made?.doc);
    expect(made!.lamp).toEqual({ roomId: LIVING, object: 4 });
    const [first, second] = [roomOf(out, LIVING).objects[3]!, roomOf(out, LIVING).objects[4]!];
    // Along its width, which runs along the wall: still flush on it.
    expect(second).toEqual({ ...first, device: NEW2, c: [first.c[0], 2.15] });
    const pin = expectAtBulb(out, NEW2).pin;
    expect(pin).toMatchObject({ entityId: "light.sconce", name: "Sconce", glow: 1.5 });
    expect(addAnotherLamp(doc, FLOOR, LIVING, 0, NEW3)).toBeUndefined();
    expect(addAnotherLamp(doc, FLOOR, LIVING, 3, NEW)).toBeUndefined();
    // Any other entity keeps one pin: a TV holding the lock has no other.
    const tv = done(doc, linkDevice(doc, FLOOR, LIVING, TV_INDEX, LOCK));
    expect(addAnotherLamp(tv, FLOOR, LIVING, TV_INDEX, NEW3)).toBeUndefined();
  });

  it("from the rail onto a thing that holds nothing puts a new pin straight on it, any device on any thing", () => {
    const doc = done(fixture(), addPiece(fixture(), LIVING, lampPiece("lampRoundTable"), [4, 3]));
    const out = done(doc, addDeviceToThing(doc, FLOOR, LIVING, 3, "light.bedside", NEW));
    expect(roomOf(out, LIVING).objects[3]!.device).toBe(NEW);
    expectAtBulb(out, NEW);
    expect(addDeviceToThing(out, FLOOR, LIVING, 3, "light.other", NEW2)).toBeUndefined();
    // A media player onto the television sits on its screen.
    const tv = done(doc, addDeviceToThing(doc, FLOOR, LIVING, TV_INDEX, "media_player.living_room_tv", NEW2));
    expect(expectOnThing(tv, NEW2).pin).toMatchObject({ entityId: "media_player.living_room_tv", roomId: LIVING });
    // A switch into a lamp sits on its top, never at its bulb.
    const fan = done(doc, addDeviceToThing(doc, FLOOR, LIVING, 3, "switch.lamp_plug", NEW2));
    expect(expectOnThing(fan, NEW2).pin.at[2]).toBe(1.37);
    expect(addDeviceToThing(doc, FLOOR, LIVING, 9, "switch.other", NEW2)).toBeUndefined();
    expect(addDeviceToThing(doc, FLOOR, LIVING, 0, "switch.other", READING)).toBeUndefined();
  });

  it("leaves placing every device by area making bulbs, never lamps", () => {
    const doc = fixture();
    const placed = placeAllByArea(doc, FLOOR, [{ entityId: "light.hall", areaId: "living_room" }], () => NEW)!;
    expect(roomOf(placed.doc, LIVING).objects.every((o) => o.device === undefined)).toBe(true);
  });
});

// ── linking ──────────────────────────────────────────────────────────────

describe("linking a device onto a thing", () => {
  it("moves the light to the lamp's bulb and into its room", () => {
    const doc = withFloorLamp();
    expect(roomOf(doc, LIVING).objects[LAMP_INDEX]!.device).toBe(READING);
    const { pin } = expectAtBulb(doc, READING);
    expect(pin.at).toEqual([2, 2, 1.68]);
  });

  it("puts any pin on any thing: the lock on the sofa, the thermostat from the kitchen onto the television's screen", () => {
    const doc = fixture();
    const sofa = done(doc, linkDevice(doc, FLOOR, LIVING, 0, LOCK));
    expect(expectOnThing(sofa, LOCK).pin.at).toEqual([2.7, 4.15, 0.75]);
    const tv = done(doc, linkDevice(doc, FLOOR, LIVING, TV_INDEX, THERMOSTAT));
    expect(expectOnThing(tv, THERMOSTAT).pin.roomId).toBe(LIVING);
    // A light on a thing with no bulb sits on its top as any device does.
    const table = done(doc, linkDevice(doc, FLOOR, KITCHEN, 2, PENDANTS));
    expect(expectOnThing(table, PENDANTS).pin.at).toEqual([8.1, 2.5, 0.75]);
  });

  it("takes the pin from another thing, and the pin this thing held before stays where it is", () => {
    let doc = withFloorLamp();
    doc = done(doc, addPiece(doc, KITCHEN, lampPiece("lampSquareFloor"), [8, 4]));
    doc = done(doc, linkDevice(doc, FLOOR, KITCHEN, 3, CEILING));
    const ceilingAt = pinOf(doc, CEILING)!.at;
    // The kitchen lamp now takes the reading lamp's light.
    const out = done(doc, linkDevice(doc, FLOOR, KITCHEN, 3, READING));
    expect(roomOf(out, LIVING).objects[LAMP_INDEX]!.device).toBeUndefined();
    expect(roomOf(out, KITCHEN).objects[3]!.device).toBe(READING);
    expect(expectAtBulb(out, READING).pin.roomId).toBe(KITCHEN);
    expect(pinOf(out, CEILING)!.at).toEqual(ceilingAt);
    expect(homeMapThingOfPin(floorOf(out), CEILING)).toBeUndefined();
  });

  it("writes an old light link as device when it takes one", () => {
    const doc = fixture();
    doc.floors[0]!.rooms[0]!.objects[0] = { ...doc.floors[0]!.rooms[0]!.objects[0]!, light: READING };
    const out = done(doc, linkDevice(doc, FLOOR, LIVING, 1, READING));
    expect("light" in roomOf(out, LIVING).objects[0]!).toBe(false);
    expect("device" in roomOf(out, LIVING).objects[0]!).toBe(false);
    expect(roomOf(out, LIVING).objects[1]!.device).toBe(READING);
  });

  it("is refused for a pin it already holds, or a thing or pin the floor does not have", () => {
    const doc = withFloorLamp();
    expect(linkDevice(doc, FLOOR, LIVING, LAMP_INDEX, READING)).toBeUndefined();
    expect(linkDevice(doc, FLOOR, LIVING, 9, CEILING)).toBeUndefined();
    expect(linkDevice(doc, FLOOR, LIVING, LAMP_INDEX, NEW)).toBeUndefined();
    expect(linkDevice(doc, NEW, LIVING, LAMP_INDEX, CEILING)).toBeUndefined();
  });

  it("unlinks, both staying where they are", () => {
    const doc = withFloorLamp();
    const out = done(doc, unlinkDevice(doc, FLOOR, LIVING, LAMP_INDEX));
    expect("device" in roomOf(out, LIVING).objects[LAMP_INDEX]!).toBe(false);
    expect(roomOf(out, LIVING).objects[LAMP_INDEX]!.c).toEqual([2, 2]);
    expect(pinOf(out, READING)).toEqual(pinOf(doc, READING));
    expect(unlinkDevice(out, FLOOR, LIVING, LAMP_INDEX)).toBeUndefined();
    // Now moving the lamp leaves the light behind.
    expect(pinOf(moveObject(out, LIVING, LAMP_INDEX, [4, 4])!, READING)).toEqual(pinOf(doc, READING));
  });

  it("keeps the link through a new piece: a lamp's light at its new bulb, on the middle of the top of a piece with none", () => {
    const doc = withFloorLamp();
    const table = done(doc, setObjectPiece(doc, LIVING, LAMP_INDEX, lampPiece("lampSquareTable")));
    expect(roomOf(table, LIVING).objects[LAMP_INDEX]!.device).toBe(READING);
    expectAtBulb(table, READING);
    expect(pinOf(table, READING)!.at).not.toEqual(pinOf(doc, READING)!.at);
    const sofa = done(doc, setObjectPiece(doc, LIVING, LAMP_INDEX, lampPiece("loungeSofa")));
    expect(roomOf(sofa, LIVING).objects[LAMP_INDEX]!.device).toBe(READING);
    expectOnThing(sofa, READING);
    expect(pinOf(sofa, READING)!.at).toEqual([2, 2, 1.87]);
  });

  it("changes a held pin's entity to any other, the pin moving to the thing's spot for it", () => {
    const doc = withFloorLamp();
    const plug = done(doc, setPinEntity(doc, READING, "switch.lamp"));
    expect(homeMapThingOfPin(floorOf(plug), READING)).toEqual({ roomId: LIVING, object: LAMP_INDEX });
    expect(pinOf(plug, READING)!.at).toEqual([2, 2, 1.87]);
    const out = done(doc, setPinEntity(doc, READING, "light.floor_lamp"));
    expect(pinOf(out, READING)!.entityId).toBe("light.floor_lamp");
    expect(homeMapThingOfPin(floorOf(out), READING)).toEqual({ roomId: LIVING, object: LAMP_INDEX });
    expect(setPinEntity(doc, LOCK, "switch.door")).toBeDefined();
    expect(setPinEntity(doc, READING, "light.reading_lamp")).toBeUndefined();
    expect(setPinEntity(doc, READING, "not an entity")).toBeUndefined();
  });
});

// ── keeping the light in its lamp ────────────────────────────────────────

describe("every edit to the lamp or its room", () => {
  const edits: [string, (d: HomeMapDocument) => HomeMapDocument | undefined][] = [
    ["moving it", (d) => moveObject(d, LIVING, LAMP_INDEX, [4.5, 3.25])],
    ["moving several things", (d) => moveObjects(d, [{ roomId: LIVING, object: 0 }, { roomId: LIVING, object: LAMP_INDEX }], 0.5, -0.25)],
    ["turning it", (d) => turnObject(d, LIVING, LAMP_INDEX, 33)],
    ["levelling it", (d) => levelObject(turnObject(d, LIVING, LAMP_INDEX, 10)!, LIVING, LAMP_INDEX)],
    ["resizing it", (d) => resizeObject(d, LIVING, LAMP_INDEX, { width: 0.8, depth: 0.5, anchor: [0, 0] })],
    ["lifting it", (d) => setObject(d, LIVING, LAMP_INDEX, { lift: 0.4 })],
    ["setting its size and turn", (d) => setObject(d, LIVING, LAMP_INDEX, { size: [0.4, 0.4, 1.2], turn: -60 })],
    ["hiding it", (d) => setObjectHidden(d, LIVING, LAMP_INDEX, true)],
    ["moving its room", (d) => moveRoom(d, LIVING, -1.5, 2)],
    ["turning its room", (d) => turnRoom(d, LIVING, 25)],
    ["stretching its room", (d) => resizeRoom(d, LIVING, { width: 8, depth: 4, anchor: [0, 0] })],
    ["changing its wall height", (d) => setWallHeight(d, LIVING, 3.1)],
    ["taking out a thing before it", (d) => removeObject(d, LIVING, 0)],
  ];
  const STAYS = new Set(["turning it", "levelling it", "hiding it", "changing its wall height", "taking out a thing before it"]);
  for (const [name, edit] of edits) {
    it(`keeps the light at its bulb: ${name}`, () => {
      const doc = withFloorLamp();
      const before = pinOf(doc, READING)!;
      const out = done(doc, edit(doc));
      expectAtBulb(out, READING);
      // A round lamp's bulb is on its middle, so turning it in place leaves
      // the light where it was.
      if (!STAYS.has(name)) expect(pinOf(out, READING)!.at).not.toEqual(before.at);
    });
  }

  it("keeps the light with its lamp when the room moves to another floor", () => {
    const doc = withFloorLamp();
    const out = done(doc, moveRoomToFloor(doc, LIVING, { newFloor: { id: NEW3, name: "Upstairs", story: 1 } }));
    const upstairs = out.floors.find((f) => f.id === NEW3)!;
    expect(upstairs.pins.map((p) => p.id)).toContain(READING);
    const ref = homeMapThingOfPin(upstairs, READING)!;
    const lamp = upstairs.rooms.find((r) => r.id === ref.roomId)!.objects[ref.object]!;
    expect(upstairs.pins.find((p) => p.id === READING)!.at).toEqual(homeMapHoldSpot(lamp, lampPiece("lampRoundFloor"), true));
  });

  it("keeps any device on its thing the same way: a thermostat on the television, the room moved, turned and stretched", () => {
    const doc = done(fixture(), linkDevice(fixture(), FLOOR, LIVING, TV_INDEX, THERMOSTAT));
    for (const edit of [
      (d: HomeMapDocument) => moveObject(d, LIVING, TV_INDEX, [3.5, 0.5]),
      (d: HomeMapDocument) => turnObject(d, LIVING, TV_INDEX, 90),
      (d: HomeMapDocument) => setObject(d, LIVING, TV_INDEX, { lift: 1.2 }),
      (d: HomeMapDocument) => moveRoom(d, LIVING, 1, 1),
      (d: HomeMapDocument) => turnRoom(d, LIVING, 15),
    ]) {
      const out = done(doc, edit(doc));
      expectOnThing(out, THERMOSTAT);
      expect(pinOf(out, THERMOSTAT)!.at).not.toEqual(pinOf(doc, THERMOSTAT)!.at);
    }
    const upstairs = done(doc, moveRoomToFloor(doc, LIVING, { newFloor: { id: NEW3, name: "Upstairs", story: 1 } })).floors.find((f) => f.id === NEW3)!;
    expect(homeMapThingOfPin(upstairs, THERMOSTAT)).toEqual({ roomId: LIVING, object: TV_INDEX });
  });
});

describe("moving a light a lamp holds", () => {
  it("moves the lamp by the same step and keeps the light at its bulb", () => {
    const doc = withFloorLamp();
    const out = done(doc, movePin(doc, READING, [3, 1.5]));
    expect(roomOf(out, LIVING).objects[LAMP_INDEX]!.c).toEqual([3, 1.5]);
    expect(expectAtBulb(out, READING).pin.at).toEqual([3, 1.5, 1.68]);
  });

  it("with others, each lamp once", () => {
    const doc = withFloorLamp();
    const out = done(doc, movePins(doc, [READING, CEILING], 0.5, 0.25));
    expect(roomOf(out, LIVING).objects[LAMP_INDEX]!.c).toEqual([2.5, 2.25]);
    expectAtBulb(out, READING);
    expect(pinOf(out, CEILING)!.at).toEqual([3.7, 2.05, 2.4]);
  });

  it("to the middle of its room takes the lamp there", () => {
    const doc = withFloorLamp();
    const out = done(doc, centerPinInRoom(doc, READING));
    expect(roomOf(out, LIVING).objects[LAMP_INDEX]!.c).toEqual([3, 2.5]);
    expectAtBulb(out, READING);
  });

  it("never changes its height, which is its lamp's", () => {
    const doc = withFloorLamp();
    expect(setPinHeight(doc, READING, 2.2)).toBeUndefined();
    const out = done(doc, setPinsHeight(doc, [READING, CEILING], 2.2));
    expect(pinOf(out, READING)).toEqual(pinOf(doc, READING));
    expect(pinOf(out, CEILING)!.at[2]).toBe(2.2);
    const same = done(doc, sameHeightForLights(doc, READING));
    expect(pinOf(same, CEILING)!.at[2]).toBe(1.68);
    expect(pinOf(same, READING)).toEqual(pinOf(doc, READING));
  });

  it("is so for any device a thing holds: the lock on the sofa moves the sofa, and keeps the sofa's height", () => {
    const doc = done(fixture(), linkDevice(fixture(), FLOOR, LIVING, 0, LOCK));
    const out = done(doc, movePin(doc, LOCK, [3, 4]));
    expect(roomOf(out, LIVING).objects[0]!.c).toEqual([3, 4]);
    expect(expectOnThing(out, LOCK).pin.at).toEqual([3, 4, 0.75]);
    expect(setPinHeight(doc, LOCK, 2)).toBeUndefined();
  });
});

// ── deleting ─────────────────────────────────────────────────────────────

describe("deleting a lamp or its light", () => {
  it("deletes both, from either end", () => {
    const doc = withFloorLamp();
    const noLamp = done(doc, removeObject(doc, LIVING, LAMP_INDEX));
    expect(pinOf(noLamp, READING)).toBeUndefined();
    expect(roomOf(noLamp, LIVING).objects).toHaveLength(3);
    const noLight = done(doc, removePin(doc, READING));
    expect(roomOf(noLight, LIVING).objects).toHaveLength(3);
    expect(roomOf(noLight, LIVING).objects.some((o) => o.model === "lampRoundFloor")).toBe(false);
    expect(JSON.stringify(noLight)).toBe(JSON.stringify(noLamp));
  });

  it("deletes several, each lamp with its light", () => {
    let doc = withFloorLamp();
    doc = addLampLight(doc, FLOOR, LIVING, "light.cans", "ceiling", [4, 1], NEW)!.doc;
    const things = done(doc, removeObjects(doc, [{ roomId: LIVING, object: LAMP_INDEX }, { roomId: LIVING, object: 4 }, { roomId: LIVING, object: 0 }]));
    expect(roomOf(things, LIVING).objects.map((o) => o.kind)).toEqual(["table", "television"]);
    expect(floorOf(things).pins.map((p) => p.id)).not.toContain(READING);
    expect(floorOf(things).pins.map((p) => p.id)).not.toContain(NEW);
    const pins = done(doc, removePins(doc, [NEW, READING, LOCK]));
    expect(roomOf(pins, LIVING).objects.map((o) => o.kind)).toEqual(["sofa", "table", "television"]);
    expect(floorOf(pins).pins.map((p) => p.id)).not.toContain(LOCK);
  });

  it("keeps a light whose lamp let go when that lamp is deleted", () => {
    const doc = done(withFloorLamp(), unlinkDevice(withFloorLamp(), FLOOR, LIVING, LAMP_INDEX));
    expect(pinOf(removeObject(doc, LIVING, LAMP_INDEX)!, READING)).toBeDefined();
  });

  it("deletes the lights a deleted room's lamps hold", () => {
    let doc = withFloorLamp();
    // Even one that names another room: deleting the room takes it.
    doc = structuredClone(doc);
    doc.floors[0]!.pins.find((p) => p.id === READING)!.roomId = KITCHEN;
    const out = done(doc, deleteRoom(doc, LIVING));
    expect(pinOf(out, READING)).toBeUndefined();
  });

  it("deletes a TV and the media player it holds together, from either end, and several at once", () => {
    const doc = done(fixture(), addDeviceToThing(fixture(), FLOOR, LIVING, TV_INDEX, "media_player.living_room_tv", NEW));
    const noTv = done(doc, removeObject(doc, LIVING, TV_INDEX));
    expect(pinOf(noTv, NEW)).toBeUndefined();
    const noPlayer = done(doc, removePin(doc, NEW));
    expect(JSON.stringify(noPlayer)).toBe(JSON.stringify(noTv));
    const both = done(doc, removeObjects(doc, [{ roomId: LIVING, object: TV_INDEX }, { roomId: LIVING, object: 0 }]));
    expect(pinOf(both, NEW)).toBeUndefined();
    expect(roomOf(both, LIVING).objects.map((o) => o.kind)).toEqual(["table"]);
  });
});
