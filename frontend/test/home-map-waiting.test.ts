// Devices first (app repo docs/home_map_plan_2026-10.md, "Devices first
// (2026-11-10)"): the waiting rule and the checklist "Finish your map", run
// on the table the iPhone's tests run too, and the free spots a new pin and
// a room's name take.

import { describe, expect, it } from "vitest";

import { homeMapFreeLabelSpot, homeMapFreePinSpot } from "../src/home-map/free-spot.js";
import type { HomeMapDocument, HomeMapFloor, HomeMapRoom } from "../src/home-map/model.js";
import {
  type HomeMapWaitEntity,
  homeMapChecklist,
  homeMapChecklistActive,
  homeMapChecklistDoneWords,
  homeMapRoomCardWords,
  homeMapRoomWaiting,
  homeMapWaitKind,
  homeMapWaitLabel,
  homeMapWaitTotals,
} from "../src/home-map/waiting.js";

const room = (id: string, areaId: string | undefined, outline: [number, number][] = [[0, 0], [4, 0], [4, 3], [0, 3]]): HomeMapRoom => ({
  id, ...(areaId === undefined ? {} : { areaId }), outline, height: 2.5, walls: [], openings: [], objects: [],
});

const floor = (id: string, rooms: HomeMapRoom[], pinned: string[] = []): HomeMapFloor => ({
  id, name: id, rooms, pins: pinned.map((entityId, i) => ({ id: `${id}-P${i}`, entityId, at: [1, 1, 1] })),
} as unknown as HomeMapFloor);

// The spec's table: area `office` is room R1's, `hall` rooms R2's and R3's
// (R3 on another floor), `attic` no room's.
const ROWS: HomeMapWaitEntity[] = [
  { entityId: "light.desk", name: "Desk Lamp", areaId: "office" },
  { entityId: "light.ceiling", name: "ceiling", areaId: "office" },
  { entityId: "media_player.tv", name: "TV", areaId: "office" },
  { entityId: "switch.pc", name: "PC", areaId: "office" },
  { entityId: "switch.led", name: "Status LED", areaId: "office", category: "config" },
  { entityId: "light.group_member", name: "Bulb 2", areaId: "office", hidden: true },
  { entityId: "sensor.temp", name: "Temperature", areaId: "office" },
  { entityId: "cover.blind", name: "Blind", areaId: "hall" },
  { entityId: "fan.air", name: "Air", areaId: "hall" },
  { entityId: "light.attic", name: "Attic", areaId: "attic" },
];

const R1 = room("R1", "office");
const R2 = room("R2", "hall");
const R3 = room("R3", "hall");
const DOC = { floors: [floor("F1", [R1, R2], ["light.ceiling"]), floor("F2", [R3])] } as unknown as HomeMapDocument;
const ids = (list: readonly HomeMapWaitEntity[]) => list.map((e) => e.entityId);

describe("the waiting rule", () => {
  it("runs the shared table: each room's main and switch devices, and the map's totals", () => {
    const r1 = homeMapRoomWaiting(R1, ROWS, DOC);
    expect(ids(r1.main)).toEqual(["light.desk", "media_player.tv"]);
    expect(ids(r1.more)).toEqual(["switch.pc"]);
    for (const r of [R2, R3]) {
      const w = homeMapRoomWaiting(r, ROWS, DOC);
      expect(ids(w.main)).toEqual(["cover.blind", "fan.air"]);
      expect(w.more).toEqual([]);
    }
    expect(homeMapWaitTotals(DOC, ROWS)).toEqual({ rooms: 3, placed: 1, waiting: 4 });
  });

  it("reads a category, a hidden entry and a domain outside both lists as neither", () => {
    expect(homeMapWaitKind({ entityId: "light.x", name: "x" })).toBe("main");
    expect(homeMapWaitKind({ entityId: "valve.x", name: "x", category: null, hidden: false })).toBe("main");
    expect(homeMapWaitKind({ entityId: "remote.x", name: "x" })).toBe("switch");
    expect(homeMapWaitKind({ entityId: "switch.x", name: "x", category: "diagnostic" })).toBeUndefined();
    expect(homeMapWaitKind({ entityId: "light.x", name: "x", hidden: true })).toBeUndefined();
    expect(homeMapWaitKind({ entityId: "binary_sensor.x", name: "x" })).toBeUndefined();
  });

  it("orders main by domain, then switch, each by name ignoring case, then by id", () => {
    const rows: HomeMapWaitEntity[] = [
      { entityId: "camera.door", name: "Door", areaId: "a" },
      { entityId: "switch.b", name: "beta", areaId: "a" },
      { entityId: "fan.one", name: "Zed", areaId: "a" },
      { entityId: "light.two", name: "alpha", areaId: "a" },
      { entityId: "light.one", name: "Alpha", areaId: "a" },
      { entityId: "switch.a", name: "Beta", areaId: "a" },
      { entityId: "cover.x", name: "a", areaId: "a" },
    ];
    const w = homeMapRoomWaiting(room("R", "a"), rows, { floors: [] });
    expect(ids(w.main)).toEqual(["light.one", "light.two", "cover.x", "fan.one"]);
    expect(ids(w.more)).toEqual(["switch.a", "switch.b", "camera.door"]);
  });

  it("waits for nothing in a room with no area, and counts a pin on any floor as placed", () => {
    expect(homeMapRoomWaiting(room("R", undefined), ROWS, DOC)).toEqual({ main: [], more: [] });
    const pinnedElsewhere = { floors: [floor("F1", [R1]), floor("F2", [], ["light.desk", "light.desk"])] } as unknown as HomeMapDocument;
    expect(ids(homeMapRoomWaiting(R1, ROWS, pinnedElsewhere).main)).toEqual(["light.ceiling", "media_player.tv"]);
    expect(homeMapWaitTotals(pinnedElsewhere, ROWS)).toEqual({ rooms: 1, placed: 1, waiting: 2 });
    expect(homeMapWaitTotals(null, ROWS)).toEqual({ rooms: 0, placed: 0, waiting: 0 });
  });
});

describe("the checklist Finish your map", () => {
  const words = (rooms: number, placed: number, waiting: number, page = false) => homeMapChecklist({ rooms, placed, waiting }, page).map((s) => s.words);

  it("says every sentence of the three steps", () => {
    expect(words(6, 0, 14)).toEqual(["6 rooms.", "14 devices wait in your rooms.", "Put the map on a page to use it each day."]);
    expect(words(1, 0, 1)[0]).toBe("1 room.");
    expect(words(1, 0, 1)[1]).toBe("1 device waits in your rooms.");
    expect(words(6, 0, 0)[1]).toBe("Put your lights and devices on the map.");
    expect(words(6, 3, 11)[1]).toBe("3 on the map. 11 more wait.");
    expect(words(6, 3, 1)[1]).toBe("3 on the map. 1 more waits.");
    expect(words(6, 3, 0)[1]).toBe("3 on the map.");
    expect(words(6, 3, 0, true)[2]).toBe("On a page.");
  });

  it("marks each step done, the first not done active, and counts the done ones", () => {
    const steps = homeMapChecklist({ rooms: 6, placed: 0, waiting: 14 }, false);
    expect(steps.map((s) => [s.id, s.title, s.done])).toEqual([[1, "Rooms", true], [2, "Devices", false], [3, "On a page", false]]);
    expect(homeMapChecklistActive(steps)?.id).toBe(2);
    expect(homeMapChecklistDoneWords(steps)).toBe("1 of 3 done");
    const done = homeMapChecklist({ rooms: 6, placed: 3, waiting: 2 }, true);
    expect(homeMapChecklistActive(done)).toBeUndefined();
    expect(homeMapChecklistDoneWords(done)).toBe("3 of 3 done");
    expect(homeMapChecklistActive(homeMapChecklist({ rooms: 0, placed: 0, waiting: 0 }, true))?.id).toBe(1);
  });

  it("words a room's name with its wait count, and its line in the Rooms card", () => {
    expect(homeMapWaitLabel("Bedroom", 5)).toBe("Bedroom · 5 wait");
    expect(homeMapWaitLabel("stairs", 1)).toBe("stairs · 1 waits");
    expect(homeMapWaitLabel("Hall", 0)).toBe("Hall");
    const card = (hasArea: boolean, onMap: number, wait: number, more = 0) => homeMapRoomCardWords({ hasArea, onMap, wait, more });
    expect(card(true, 2, 3)).toBe("2 on the map · 3 wait");
    expect(card(true, 2, 0)).toBe("2 on the map");
    expect(card(true, 0, 3)).toBe("3 wait");
    expect(card(true, 0, 0)).toBe("No devices in its area");
    expect(card(true, 0, 0, 2)).toBe("2 switches and more");
    expect(card(false, 0, 0)).toBe("No area");
  });
});

describe("free spots", () => {
  const box = room("R", "a", [[0, 0], [4, 0], [4, 3], [0, 3]]);

  it("puts a new pin at the label point when it is clear", () => {
    expect(homeMapFreePinSpot(box, [])).toEqual([2, 1.5]);
  });

  it("keeps new pins 0.4 m apart and off the name, inside the room", () => {
    const pins: { at: number[] }[] = [];
    const label = { at: [2, 1.5] as [number, number], halfW: 0.6, halfH: 0.2 };
    for (let i = 0; i < 12; i += 1) {
      const at = homeMapFreePinSpot(box, pins, label)!;
      expect(at[0] > 0.1 && at[0] < 3.9 && at[1] > 0.1 && at[1] < 2.9).toBe(true);
      expect(Math.abs(at[0] - 2) > 0.6 || Math.abs(at[1] - 1.5) > 0.2).toBe(true);
      for (const p of pins) expect(Math.hypot(p.at[0]! - at[0], p.at[1]! - at[1])).toBeGreaterThanOrEqual(0.4 - 1e-9);
      pins.push({ at });
    }
    // The first lands just past the name, as near the label point as it can.
    expect(Math.hypot(pins[0]!.at[0]! - 2, pins[0]!.at[1]! - 1.5)).toBeLessThan(0.8);
  });

  it("falls back to the label point in a room too full to hold one more", () => {
    const tiny = room("T", "a", [[0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5]]);
    expect(homeMapFreePinSpot(tiny, [{ at: [0.25, 0.25] }])).toEqual([0.25, 0.25]);
    expect(homeMapFreePinSpot(room("E", "a", []), [])).toBeUndefined();
  });

  it("stands a name in free floor, off furniture, pins and other names, and hides it with no room", () => {
    const outline: [number, number][] = [[0, 0], [200, 0], [200, 100], [0, 100]];
    const none = { room: outline, boxes: [], circles: [], taken: [] };
    expect(homeMapFreeLabelSpot([100, 50], [30, 10], none)).toEqual([100, 50]);
    // A bed over the middle pushes it out, clear of the bed.
    const bed: [number, number][] = [[70, 30], [130, 30], [130, 70], [70, 70]];
    const off = homeMapFreeLabelSpot([100, 50], [30, 10], { ...none, boxes: [bed] })!;
    expect(off[1] - 10 >= 70 || off[1] + 10 <= 30 || off[0] - 30 >= 130 || off[0] + 30 <= 70).toBe(true);
    // A pin and a name placed before it are kept clear of too.
    const pinned = homeMapFreeLabelSpot([100, 50], [30, 10], { ...none, circles: [{ c: [100, 50], r: 14 }], taken: [{ c: [100, 25], half: [30, 10] }] })!;
    expect(Math.hypot(Math.max(Math.abs(pinned[0] - 100) - 30, 0), Math.max(Math.abs(pinned[1] - 50) - 10, 0))).toBeGreaterThanOrEqual(14);
    expect(Math.abs(pinned[0] - 100) >= 60 || Math.abs(pinned[1] - 25) >= 20).toBe(true);
    // A name wider than the room has nowhere to stand.
    expect(homeMapFreeLabelSpot([100, 50], [120, 10], none)).toBeUndefined();
  });
});
