// What the map editor says when a map cannot be saved: plain words that
// name the room, floor or device by its name, for the page, with the
// store's own message and its path kept for the console. And names counted
// and cut by code point, as the store counts them, so an emoji is one
// character and a cut never splits one in half.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { homeMapFirstFloor, renameFloor, renameRoom } from "../src/home-map/edit-ops.js";
import { HomeMapSession } from "../src/home-map/editor-session.js";
import {
  type HomeMapDocument,
  HOME_MAP_MAX_NAME,
  HOME_MAP_MAX_ROOMS,
  applyHomeMapEdit,
  checkHomeMap,
  homeMapNameLength,
  homeMapProblemOf,
  homeMapProblemText,
  homeMapTrimName,
} from "../src/home-map/model.js";
import { type HomeMapApi, homeMapReadFailText, homeMapRefusalText, saveHomeMapEdit } from "../src/home-map/save.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const refusal = (code: string, message: string) => Object.assign(new Error(message), { code });

/** No lone half of a surrogate pair anywhere in `text`. */
const whole = (text: string) => !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(text);

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => {
  warn.mockRestore();
});

function refused(doc: unknown): { message: string; text: string } {
  const out = checkHomeMap(doc);
  if (out.ok) throw new Error("expected a refusal");
  return out;
}

describe("a refused map in plain words", () => {
  it("names a room whose name is too long, keeping the store's path for the console", () => {
    const doc = fixture();
    doc.floors[0]!.rooms[1]!.name = `Kitchen ${"and pantry ".repeat(10)}`;
    const out = refused(doc);
    expect(out.message).toBe("doc.floors[0].rooms[1].name is at most 100 characters");
    expect(out.text).toBe("The room name Kitchen and pantry and p... is too long. Use 100 letters or fewer.");
  });

  it("names a floor, and a device, whose name is too long", () => {
    const floor = fixture();
    floor.floors[0]!.name = "G".repeat(101);
    expect(refused(floor).text).toMatch(/^The floor name G{24}\.\.\. is too long\. Use 100 letters or fewer\.$/);
    const pin = fixture();
    pin.floors[0]!.pins[2]!.name = "Side door ".repeat(11);
    expect(refused(pin).text).toBe("The device name Side door Side door Side... is too long. Use 100 letters or fewer.");
  });

  it("says which device's name is empty, by its entity", () => {
    const doc = fixture();
    doc.floors[0]!.pins[2]!.name = "";
    expect(refused(doc).text).toBe("The name of lock.side_door cannot be empty.");
  });

  it("says how many rooms, devices and floors a map holds, and too many of a room's parts", () => {
    const doc = fixture();
    const room = doc.floors[0]!.rooms[0]!;
    doc.floors[0]!.rooms = Array.from({ length: HOME_MAP_MAX_ROOMS + 1 }, (_, i) => ({ ...room, id: `7B1E0C2A-5D3F-4A8B-9C6D-${String(500 + i).padStart(12, "0")}` }));
    doc.floors[0]!.pins = [];
    expect(refused(doc).text).toBe("A home map holds at most 40 rooms.");
    const many = fixture();
    const kitchen = many.floors[0]!.rooms[1]!;
    kitchen.objects = Array.from({ length: 257 }, () => kitchen.objects[0]!);
    expect(refused(many).text).toBe("The room Kitchen has too many things in it. Use 256 or fewer.");
  });

  it("names the room, the thing in it or the device for anything else, and says to undo", () => {
    const room = fixture();
    (room.floors[0]!.rooms[1] as unknown as Record<string, unknown>).finish = "marble";
    expect(refused(room).message).toBe("doc.floors[0].rooms[1].finish must be wood, tile, stone, carpet or plain");
    expect(refused(room).text).toBe("Something about the room Kitchen cannot be saved. Undo the last change and try again.");
    const thing = fixture();
    (thing.floors[0]!.rooms[1]!.objects[0] as unknown as Record<string, unknown>).model = "Not A Model";
    expect(refused(thing).text).toBe("Something about a refrigerator in the room Kitchen cannot be saved. Undo the last change and try again.");
    const pin = fixture();
    (pin.floors[0]!.pins[0] as unknown as Record<string, unknown>).glowSpill = "yes";
    expect(refused(pin).text).toBe("Something about the device light.reading_lamp cannot be saved. Undo the last change and try again.");
    const style = fixture();
    style.style = { look: "neon" } as never;
    expect(refused(style).text).toBe("Something about the home style cannot be saved. Undo the last change and try again.");
    expect(refused({ v: 2, floors: [] }).text).toBe("Something about the map cannot be saved. Undo the last change and try again.");
  });

  it("says a map too big to save is too big, with its size", () => {
    const doc = fixture();
    const kitchen = doc.floors[0]!.rooms[1]!;
    const objects = Array.from({ length: 256 }, () => kitchen.objects[0]!);
    // 40 rooms of 256 things each, near a megabyte.
    doc.floors[0]!.rooms = Array.from({ length: HOME_MAP_MAX_ROOMS }, (_, i) => ({ ...kitchen, objects, id: `7B1E0C2A-5D3F-4A8B-9C6D-${String(700 + i).padStart(12, "0")}` }));
    doc.floors[0]!.pins = [];
    const out = checkHomeMap(doc);
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.code).toBe("too_large");
    expect(out.text).toMatch(/^The map is too big to save: \d+ KB, and the most is 256 KB\. Take out some rooms or things\.$/);
  });

  it("reads a store's invalid message back into its path and kind", () => {
    expect(homeMapProblemOf("doc.floors[0].rooms[1].name is at most 100 characters")).toEqual({ path: "doc.floors[0].rooms[1].name", problem: "long" });
    expect(homeMapProblemOf("doc.floors[0].pins[2].name must not be empty")).toEqual({ path: "doc.floors[0].pins[2].name", problem: "empty" });
    expect(homeMapProblemOf("the home map holds at most 40 rooms")).toEqual({ path: "doc.rooms", problem: "many" });
    expect(homeMapProblemOf("the home map holds at most 400 pins")).toEqual({ path: "doc.pins", problem: "many" });
    expect(homeMapProblemOf("doc.floors[0].rooms[1].walls holds at most 256")).toEqual({ path: "doc.floors[0].rooms[1].walls", problem: "many" });
    expect(homeMapProblemOf("base_rev must be a whole number of 0 or more")).toEqual({ path: "doc", problem: "shape" });
    expect(homeMapProblemText(fixture(), "doc.pins", "many")).toBe("A home map holds at most 400 devices.");
  });
});

describe("a refusal from Home Assistant in plain words", () => {
  it("names the room an invalid refusal is about, from the map sent, and logs the store's words", () => {
    const text = homeMapRefusalText(refusal("invalid", "doc.floors[0].rooms[1].name is at most 100 characters"), fixture());
    expect(text).toBe("Not saved. The room name Kitchen is too long. Use 100 letters or fewer.");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("(invalid): doc.floors[0].rooms[1].name is at most 100 characters"));
  });

  it("has plain words for every other code the panel can get", () => {
    expect(homeMapRefusalText(refusal("too_large", "a home map is at most 256 KiB"))).toBe("Not saved. The map is too big to save. Take out some rooms or things.");
    expect(homeMapRefusalText(refusal("conflict", "stored revision is 4, save was based on 3"))).toBe("The map changed again while saving, so your change was not saved. Try it once more.");
    expect(homeMapRefusalText(refusal("unauthorized", "Unauthorized"))).toMatch(/^Not saved\. Home Assistant did not let this login save the map\./);
    expect(homeMapRefusalText(refusal("invalid_format", "extra keys not allowed @ data['x']"))).toMatch(/^Not saved\. Home Assistant could not read the map sent\./);
    expect(homeMapRefusalText(refusal("unknown_command", "Unknown command."))).toBe("Not saved. Update the Wrist Assistant integration to save the map here.");
    expect(homeMapRefusalText(refusal("unavailable", "integration not ready"))).toMatch(/could not be reached/);
    expect(homeMapRefusalText(refusal("home_assistant_error", "Traceback"))).toBe("Not saved. Home Assistant did not take the change. Try again.");
    for (const call of warn.mock.calls) expect(String(call[0])).toMatch(/^Home map: /);
  });

  it("says why the map could not be read, without the socket's own words", () => {
    expect(homeMapReadFailText(refusal("unavailable", "integration not ready"))).toBe("Wrist Assistant is still starting. Try again in a moment.");
    expect(homeMapReadFailText(new Error("Connection lost"))).toBe("Home Assistant could not be reached. Check the connection and try again.");
    expect(homeMapReadFailText(refusal("unauthorized", "Unauthorized"))).toBe("Home Assistant did not let this login read it. Sign in again.");
  });

  it("is what a save says when Home Assistant refuses it invalid", async () => {
    const api: HomeMapApi = { get: vi.fn(), save: vi.fn(async () => { throw refusal("invalid", "doc.floors[0].rooms[1].finish must be wood"); }) };
    const outcome = await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, (d) => renameRoom(d, KITCHEN, "Galley"));
    expect(outcome).toEqual({ ok: false, text: "Not saved. Something about the room Galley cannot be saved. Undo the last change and try again." });
  });

  it("is the session's note for an edit the store would refuse, the path going to the console", () => {
    const api: HomeMapApi = { get: vi.fn(), save: vi.fn() };
    const s = new HomeMapSession(api, { doc: fixture(), rev: 1 });
    const made = s.apply((d) => ({ ...d, floors: [{ ...d.floors[0]!, name: "Ground ".repeat(20) }] }));
    expect(made).toBe(false);
    expect(s.note).toEqual({ kind: "err", text: "The floor name Ground Ground Ground Gro... is too long. Use 100 letters or fewer." });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("doc.floors[0].name is at most 100 characters"));
    expect(api.save).not.toHaveBeenCalled();
  });
});

describe("names by code point", () => {
  const smiles = (n: number) => "😀".repeat(n);

  it("counts an emoji as one character, as the store does", () => {
    expect(homeMapNameLength(smiles(3))).toBe(3);
    expect(smiles(3).length).toBe(6);
    expect(homeMapNameLength("Kök 🍳")).toBe(5);
  });

  it("takes a name of 100 emoji and refuses 101, as the store does", () => {
    const doc = fixture();
    doc.floors[0]!.rooms[1]!.name = smiles(HOME_MAP_MAX_NAME);
    expect(checkHomeMap(doc).ok).toBe(true);
    doc.floors[0]!.rooms[1]!.name = smiles(HOME_MAP_MAX_NAME + 1);
    expect(refused(doc).message).toBe("doc.floors[0].rooms[1].name is at most 100 characters");
  });

  it("cuts a long name at 100 characters without splitting an emoji", () => {
    const name = `${"a".repeat(99)}😀😀`;
    const cut = homeMapTrimName(name);
    expect(cut).toBe(`${"a".repeat(99)}😀`);
    expect(whole(cut)).toBe(true);
    expect(name.slice(0, 100).endsWith("\uD83D")).toBe(true);
    expect(homeMapTrimName(`  ${smiles(120)}  `)).toBe(smiles(100));
    expect(homeMapTrimName("  Kitchen ")).toBe("Kitchen");
  });

  it("keeps whole emoji when a room, a floor or a first floor is named", () => {
    const long = `${"Kitchen ".repeat(13).slice(0, 99)}🍳🍳🍳`;
    const room = renameRoom(fixture(), KITCHEN, long)!;
    const roomName = room.floors[0]!.rooms[1]!.name!;
    expect(homeMapNameLength(roomName)).toBe(100);
    expect(whole(roomName)).toBe(true);
    expect(checkHomeMap(room).ok).toBe(true);

    const floor = renameFloor(fixture(), FLOOR, smiles(150))!;
    expect(floor.floors[0]!.name).toBe(smiles(100));
    expect(checkHomeMap(floor).ok).toBe(true);

    const edited = applyHomeMapEdit(fixture(), { kind: "renameRoom", roomId: KITCHEN, name: smiles(101) })!;
    expect(edited.floors[0]!.rooms[1]!.name).toBe(smiles(100));

    expect(homeMapFirstFloor({ a: { name: `${"b".repeat(99)}🏠🏠`, level: 0 } }).name).toBe(`${"b".repeat(99)}🏠`);
  });
});
