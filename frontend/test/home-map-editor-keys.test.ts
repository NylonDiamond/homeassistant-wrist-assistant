// The map editor's keys in the home map document (app repo
// docs/home_map_plan_2026-10.md, "Contract"): the home style, a room's
// finish, a hidden object, an opening's style and a pin's name, icon,
// reading, glow, glow colour, tap and page. The panel's checks take and
// refuse each as the store does (`tests/test_home_map_store.py`), in the
// store's words, keep the contract's key order and drop defaults; the
// drawing reads a finish, a hidden object and a door's style.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { homeDoorSwingsOf, homeFloorGuess, homeFloorKind, homeFloorSpacing } from "../src/home-map/geometry.js";
import {
  type HomeMapDocument,
  applyHomeMapEdit,
  checkHomeMap,
  homeMapObjectsShown,
  homeMapPinName,
  homeMapShownFloor,
} from "../src/home-map/model.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): Record<string, any> => JSON.parse(FIXTURE_TEXT);
const PAGE = "C3A0E000-0000-4000-8000-0000000000CC";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";

function checked(doc: Record<string, any>): HomeMapDocument {
  const out = checkHomeMap(doc);
  if (!out.ok) throw new Error(out.message);
  return out.doc;
}

function refusal(change: (doc: Record<string, any>) => void): string {
  const doc = fixture();
  change(doc);
  const out = checkHomeMap(doc);
  if (out.ok) throw new Error("accepted");
  return out.message;
}

const living = (doc: Record<string, any>) => doc.floors[0].rooms[0];
const pin = (doc: Record<string, any>) => doc.floors[0].pins[0];

describe("the home style", () => {
  it("is kept without its defaults, in the contract's order, before the floors", () => {
    const doc = fixture();
    doc.style = { glow: false, devices: "all", turn: 40, look: "night", names: false, furniture: false };
    const out = checked(doc);
    expect(Object.keys(out)).toEqual(["v", "style", "floors"]);
    expect(Object.keys(out.style!)).toEqual(["look", "turn", "names", "devices", "furniture", "glow"]);
    doc.style = { look: "plan", turn: -28, names: true, devices: "lights", furniture: true, glow: true };
    expect(Object.keys(checked(doc))).toEqual(["v", "floors"]);
    doc.style = {};
    expect(Object.keys(checked(doc))).toEqual(["v", "floors"]);
    doc.style = { look: "clay", glow: true };
    expect(checked(doc).style).toEqual({ look: "clay" });
  });

  it("keeps its turn in whole degrees", () => {
    const doc = fixture();
    doc.style = { turn: 12.4 };
    expect(checked(doc).style).toEqual({ turn: 12 });
    doc.style = { turn: -27.6 };
    expect(checked(doc).style).toBeUndefined();
    doc.style = { turn: -180 };
    expect(checked(doc).style).toEqual({ turn: -180 });
  });

  it.each([
    [{ look: "glow" }, "doc.style.look must be plan, night, warm, lines, clay, blueprint or dots"],
    [{ turn: 181 }, "doc.style.turn must be a whole number between -180 and 180"],
    [{ turn: "40" }, "doc.style.turn must be a whole number between -180 and 180"],
    [{ turn: Number.NaN }, "doc.style.turn must be a whole number between -180 and 180"],
    [{ names: 0 }, "doc.style.names must be true or false"],
    [{ devices: "some" }, "doc.style.devices must be lights, all or none"],
    [{ glow: null }, "doc.style.glow must be true or false"],
    [{ tapLights: true }, "doc.style.tapLights is not a key the home map has"],
    [[], "doc.style must be an object"],
  ])("refuses %j", (style, message) => {
    expect(refusal((d) => (d.style = style))).toBe(message);
  });
});

describe("a room, its things and its openings", () => {
  it("keeps a finish after the page and before the outline, and refuses others", () => {
    const doc = fixture();
    living(doc).finish = "plain";
    living(doc).pageId = PAGE;
    expect(Object.keys(checked(doc).floors[0]!.rooms[0]!)).toEqual(["id", "name", "areaId", "pageId", "finish", "outline", "height", "walls", "openings", "objects"]);
    expect(refusal((d) => (living(d).finish = "marble"))).toBe("doc.floors[0].rooms[0].finish must be wood, tile, stone, carpet or plain");
  });

  it("keeps hidden true last, drops hidden false and refuses anything else", () => {
    const doc = fixture();
    living(doc).objects[0].hidden = true;
    living(doc).objects[1].hidden = false;
    const objects = checked(doc).floors[0]!.rooms[0]!.objects;
    expect(Object.keys(objects[0]!)).toEqual(["kind", "c", "size", "turn", "hidden"]);
    expect(Object.hasOwn(objects[1]!, "hidden")).toBe(false);
    expect(refusal((d) => (living(d).objects[0].hidden = 1))).toBe("doc.floors[0].rooms[0].objects[0].hidden must be true or false");
  });

  it("keeps an opening's style after its kind, as its kind allows", () => {
    const doc = fixture();
    living(doc).openings[0].style = "sliding";
    living(doc).openings[1].style = "double";
    const openings = checked(doc).floors[0]!.rooms[0]!.openings;
    expect(Object.keys(openings[0]!)).toEqual(["kind", "style", "a", "b", "z0", "z1"]);
    expect(openings.map((o) => o.style)).toEqual(["sliding", "double", undefined]);
    expect(refusal((d) => (living(d).openings[0].style = "double"))).toBe("doc.floors[0].rooms[0].openings[0].style double is only for a door");
    expect(refusal((d) => (living(d).openings[2].style = "sliding"))).toBe("doc.floors[0].rooms[0].openings[2].style is only for a door or a window");
    expect(refusal((d) => (living(d).openings[1].style = "french"))).toBe("doc.floors[0].rooms[0].openings[1].style must be sliding or double");
  });
});

describe("a pin", () => {
  const full = (doc: Record<string, any>) => {
    doc.floors[0].pins[0] = {
      pageId: PAGE, tap: "page", glowColor: "#ffB347", glow: 1.704, reading: "name", icon: "lamp", name: "Floor Lamp",
      at: [0.8, 3.1, 1.6], roomId: "7B1E0C2A-5D3F-4A8B-9C6D-000000000010", entityId: "light.reading_lamp", id: READING,
    };
  };

  it("keeps every key in the contract's order, rounded, colour in its own case", () => {
    const doc = fixture();
    full(doc);
    const out = checked(doc).floors[0]!.pins[0]!;
    expect(Object.keys(out)).toEqual(["id", "entityId", "roomId", "at", "name", "icon", "reading", "glow", "glowColor", "tap", "pageId"]);
    expect(out.glow).toBe(1.7);
    expect(out.glowColor).toBe("#ffB347");
  });

  it.each([
    ["name", "", "doc.floors[0].pins[0].name must not be empty"],
    ["name", "x".repeat(101), "doc.floors[0].pins[0].name is at most 100 characters"],
    ["icon", "mdi:lamp", "doc.floors[0].pins[0].icon must be bulb, lamp, ceiling, strip, plug, fan, tv, speaker, thermostat, sensor, motion, door, lock, camera, blinds or vacuum"],
    ["reading", "pill", "doc.floors[0].pins[0].reading must be none or name"],
    ["glow", 0.19, "doc.floors[0].pins[0].glow must be between 0.2 and 10"],
    ["glow", 10.01, "doc.floors[0].pins[0].glow must be between 0.2 and 10"],
    ["glowColor", "#FFB34", "doc.floors[0].pins[0].glowColor must be warm or a colour like #FFB347"],
    ["glowColor", "orange", "doc.floors[0].pins[0].glowColor must be warm or a colour like #FFB347"],
    ["tap", "open", "doc.floors[0].pins[0].tap must be toggle, details, page or none"],
    ["tap", "page", "doc.floors[0].pins[0].pageId is missing"],
    ["pageId", PAGE, "doc.floors[0].pins[0].pageId is only for a pin whose tap is page"],
  ])("refuses %s %j", (key, value, message) => {
    expect(refusal((d) => (pin(d)[key] = value))).toBe(message);
  });

  it("is named by its own name first", () => {
    const hass = { states: { "light.reading_lamp": { state: "on", attributes: { friendly_name: "Reading lamp" } } } };
    expect(homeMapPinName({ entityId: "light.reading_lamp" }, hass)).toBe("Reading lamp");
    expect(homeMapPinName({ entityId: "light.reading_lamp", name: "Floor Lamp" }, hass)).toBe("Floor Lamp");
  });

  it("keeps its keys through the page's own edits", () => {
    const doc = fixture();
    full(doc);
    const moved = applyHomeMapEdit(checked(doc), { kind: "movePin", pinId: READING, at: [1, 1] })!;
    const out = moved.floors[0]!.pins[0]!;
    expect(out.name).toBe("Floor Lamp");
    expect(Object.keys(out)).toEqual(["id", "entityId", "roomId", "at", "name", "icon", "reading", "glow", "glowColor", "tap", "pageId"]);
  });
});

describe("the drawing reads the keys", () => {
  it("lays a room's floor by its finish, else by its name and things", () => {
    const doc = checked(fixture());
    const room = doc.floors[0]!.rooms[0]!;
    expect(homeFloorKind(room)).toBe("wood");
    expect(homeFloorKind({ ...room, finish: "stone" })).toBe("stone");
    expect(homeFloorKind({ ...room, finish: "plain" })).toBe("plain");
    expect(homeFloorGuess({ ...room, finish: "plain" } as never)).toBe("wood");
    expect(homeFloorSpacing("plain")).toBeUndefined();
    // A hidden bed no longer makes the room a bedroom.
    expect(homeFloorKind({ objects: [{ kind: "bed", c: [0, 0], size: [1, 2, 1], turn: 0, hidden: true }] })).toBe("wood");
  });

  it("draws nothing of a hidden thing", () => {
    const doc = fixture();
    living(doc).objects[1].hidden = true;
    const floor = checked(doc).floors[0]!;
    expect(homeMapObjectsShown(floor.rooms[0]!).map((o) => o.kind)).toEqual(["sofa", "television"]);
    expect(homeMapShownFloor(floor).rooms[0]!.objects).toHaveLength(2);
    const plain = checked(fixture()).floors[0]!;
    expect(homeMapShownFloor(plain)).toBe(plain);
  });

  it("swings a door by its style", () => {
    const room = checked(fixture()).floors[0]!.rooms[0]!;
    const door = room.openings[1]!;
    expect(homeDoorSwingsOf(door, room)).toHaveLength(1);
    expect(homeDoorSwingsOf({ ...door, style: "double" }, room)).toHaveLength(2);
    expect(homeDoorSwingsOf({ ...door, style: "sliding" }, room)).toHaveLength(0);
  });
});
