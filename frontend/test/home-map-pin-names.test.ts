// The map editor's pins can be told apart on its plan (`pin-names.ts`,
// `homeMapEditorPinPaint`): each pin's short name (its room's name off the
// front, the words its kind's pins in its room share off both ends), a
// reading that says whose it is when two devices in a room show the same
// kind, short names placed off the pins, the other pills and the rooms'
// names, and left out when crowded, and each kind in its tile colour.

import { describe, expect, it } from "vitest";

import type { HomeMapFloor, HomeMapPin, HomeMapRoom, HomeMapStates } from "../src/home-map/model.js";
import { homeMapEditorPinPaint, homeMapPinPill } from "../src/home-map/pin-look.js";
import { homeMapPinPillWidth, homeMapPinPillWords, homeMapPinShortNames, homeMapPlacePinPills } from "../src/home-map/pin-names.js";

const room = (id: string, name: string, x0: number, x1: number): HomeMapRoom => ({
  id,
  name,
  outline: [[x0, 0], [x1, 0], [x1, 4], [x0, 4]],
  height: 2.5,
  walls: [],
  openings: [],
  objects: [],
});

const pin = (id: string, entityId: string, roomId: string, x: number, y: number, more: Partial<HomeMapPin> = {}): HomeMapPin => ({
  id,
  entityId,
  roomId,
  at: [x, y, 1.2],
  ...more,
});

// Jesse's upstairs, as the live map and its friendly names had it.
const NAMES: Record<string, string> = {
  "light.jesse_office_lights": "Jesse Office Lamps",
  "light.smart_plug_dimmer": "Smart Plug Dimmer",
  "switch.lg_c2": "C2",
  "cover.bedroom_shade_blackout": "Blackout",
  "cover.bedroom_shade_sheer": "Sheer",
  "fan.winix_living_room": "Winix Air Purifier",
  "climate.eight_sleep_chen_temperature": "Eight Sleep - Chen Temperature",
  "climate.eight_sleep_jesse_temperature": "Eight Sleep - Jesse Temperature",
  "light.all_bedroom_lights": "Bedroom Lights",
  "light.master_bathroom_light_switch": "Master Bathroom Light Switch",
};

const floor = (): HomeMapFloor => ({
  id: "F",
  name: "Upstairs",
  story: 1,
  rooms: [room("BED", "Bedroom", 0, 4), room("OFF", "Jesse Office", 4, 8), room("BATH", "Master Bathroom", 8, 10)],
  pins: [
    pin("1", "light.jesse_office_lights", "OFF", 5, 1),
    pin("2", "light.smart_plug_dimmer", "OFF", 7, 1),
    pin("3", "switch.lg_c2", "OFF", 6, 3),
    pin("4", "cover.bedroom_shade_blackout", "BED", 1, 0.2),
    pin("5", "cover.bedroom_shade_sheer", "BED", 2.5, 0.2),
    pin("6", "fan.winix_living_room", "BED", 0.2, 3.8),
    pin("7", "climate.eight_sleep_chen_temperature", "BED", 0.9, 3),
    pin("8", "climate.eight_sleep_jesse_temperature", "BED", 2.6, 0.6),
    pin("9", "light.all_bedroom_lights", "BED", 3.5, 3),
    pin("10", "light.master_bathroom_light_switch", "BATH", 9, 1),
  ],
});

const nameOf = (p: HomeMapPin) => p.name ?? NAMES[p.entityId] ?? p.entityId;

const STATES: HomeMapStates = {
  "climate.eight_sleep_chen_temperature": { state: "off", attributes: { current_temperature: 78 } },
  "climate.eight_sleep_jesse_temperature": { state: "off", attributes: { current_temperature: 78 } },
};

describe("a pin's short name", () => {
  it("drops its room's name, and the words its kind's pins in the room share", () => {
    const short = homeMapPinShortNames(floor(), nameOf);
    expect(short.get("1")).toBe("Lamps");
    expect(short.get("2")).toBe("Smart Plug Dimmer");
    expect(short.get("3")).toBe("C2");
    expect(short.get("4")).toBe("Blackout");
    expect(short.get("5")).toBe("Sheer");
    expect(short.get("6")).toBe("Winix Air Purifier");
    expect(short.get("7")).toBe("Chen");
    expect(short.get("8")).toBe("Jesse");
    expect(short.get("9")).toBe("Lights");
    expect(short.get("10")).toBe("Light Switch");
  });

  it("keeps a name that is only its room's, and cuts a long one at a word", () => {
    const f = floor();
    f.pins = [pin("1", "light.a", "OFF", 5, 1, { name: "Jesse Office" }), pin("2", "light.b", "BED", 1, 1, { name: "Very Long Ceiling Pendant Over Bed" })];
    const short = homeMapPinShortNames(f, nameOf);
    expect(short.get("1")).toBe("Jesse Office");
    expect(short.get("2")).toBe("Very Long Ceiling…");
    expect(short.get("2")!.length).toBeLessThanOrEqual(18);
  });

  it("gives a light on the map twice its one name", () => {
    const f = floor();
    f.pins = [pin("1", "light.jesse_office_lights", "OFF", 5, 1), pin("2", "light.jesse_office_lights", "OFF", 7, 1)];
    const short = homeMapPinShortNames(f, nameOf);
    expect([short.get("1"), short.get("2")]).toEqual(["Lamps", "Lamps"]);
  });
});

describe("a pin's pill", () => {
  const words = (names: boolean, picked = "") =>
    homeMapPinPillWords(floor(), { nameOf, readingOf: (p) => homeMapPinPill(p, STATES), picked: (p) => p.id === picked, names });

  it("says whose a reading is when another device in the room shows one of its kind", () => {
    const pills = words(false);
    expect(pills.get("7")).toEqual({ text: "Chen 78°", must: true });
    expect(pills.get("8")).toEqual({ text: "Jesse 78°", must: true });
  });

  it("is the reading alone when no other device in the room shows that kind", () => {
    const f = floor();
    f.pins = f.pins.filter((p) => p.id !== "8");
    const pills = homeMapPinPillWords(f, { nameOf, readingOf: (p) => homeMapPinPill(p, STATES), picked: () => false, names: true });
    expect(pills.get("7")).toEqual({ text: "78°", must: true });
  });

  it("is the short name with Names on, only where there is room, and nothing with it off", () => {
    expect(words(true).get("4")).toEqual({ text: "Blackout", must: false });
    expect(words(false).get("4")).toBeUndefined();
  });

  it("is the whole name when picked or when the pin shows its name, and none for reading none", () => {
    expect(words(true, "7").get("7")).toEqual({ text: "Eight Sleep - Chen Temperature", must: true });
    const f = floor();
    f.pins[0] = { ...f.pins[0]!, reading: "name" };
    f.pins[1] = { ...f.pins[1]!, reading: "none" };
    const pills = homeMapPinPillWords(f, { nameOf, readingOf: () => undefined, picked: () => false, names: true });
    expect(pills.get("1")).toEqual({ text: "Jesse Office Lamps", must: true });
    expect(pills.has("2")).toBe(false);
  });
});

describe("where the pills stand", () => {
  const pills = (entries: [string, string, boolean][]) => new Map(entries.map(([id, text, must]) => [id, { text, must }]));

  it("puts a pill under its pin when that is clear", () => {
    const spots = homeMapPlacePinPills([{ id: "a", c: [100, 100], r: 12 }], pills([["a", "Lamps", false]]));
    expect(spots.get("a")).toEqual([100, 124]);
  });

  it("moves a name over its pin when a pin stands under it, and off a room's name", () => {
    const pins = [{ id: "a", c: [100, 100] as [number, number], r: 12 }, { id: "b", c: [100, 128] as [number, number], r: 12 }];
    const spots = homeMapPlacePinPills(pins, pills([["a", "Lamps", false]]));
    expect(spots.get("a")).toEqual([100, 76]);
    const off = homeMapPlacePinPills([pins[0]!], pills([["a", "Lamps", false]]), [{ c: [100, 124], half: [40, 11] }]);
    expect(off.get("a")).toEqual([100, 76]);
  });

  it("keeps a name inside its pin's room before a spot past its walls", () => {
    // A pin by the room's bottom wall: under it is past the wall, over it is in.
    const room: [number, number][] = [[0, 0], [300, 0], [300, 110], [0, 110]];
    const spots = homeMapPlacePinPills([{ id: "a", c: [150, 100], r: 12, room }], pills([["a", "Blackout", false]]));
    expect(spots.get("a")).toEqual([150, 76]);
  });

  it("leaves a name out where the pins crowd it, but always shows a reading", () => {
    // A ring of pins round "a" closes every spot.
    const ring = [[0, 28], [0, -28], [40, 0], [-40, 0]].map(([dx, dy], i) => ({ id: `n${i}`, c: [100 + dx!, 100 + dy!] as [number, number], r: 12 }));
    const pins = [{ id: "a", c: [100, 100] as [number, number], r: 12 }, ...ring];
    expect(homeMapPlacePinPills(pins, pills([["a", "Lamps", false]])).has("a")).toBe(false);
    expect(homeMapPlacePinPills(pins, pills([["a", "78°", true]])).get("a")).toEqual([100, 124]);
  });

  it("places the readings first, and two names never meet", () => {
    const pins = [{ id: "a", c: [100, 100] as [number, number], r: 12 }, { id: "b", c: [110, 100] as [number, number], r: 12 }];
    const spots = homeMapPlacePinPills(pins, pills([["a", "Blackout", false], ["b", "Chen 78°", true]]));
    expect(spots.get("b")).toEqual([110, 124]);
    const a = spots.get("a");
    if (a !== undefined) {
      const b = spots.get("b")!;
      const apart = Math.abs(a[0] - b[0]) >= (homeMapPinPillWidth("Blackout") + homeMapPinPillWidth("Chen 78°")) / 2 || Math.abs(a[1] - b[1]) >= 16;
      expect(apart).toBe(true);
    }
  });
});

describe("a pin's colours in the editor", () => {
  it("draws each kind in its tile colour, fainter while it is off", () => {
    const on = (id: string, state: string) => homeMapEditorPinPaint({ entityId: id }, { [id]: { state } });
    expect(on("cover.a", "open").ink).toBe("#8B7DD6");
    expect(on("fan.a", "on").ink).toBe("#4DBFE0");
    expect(on("climate.a", "heat").ink).toBe("#E76F51");
    expect(on("switch.a", "on").ink).toBe("#2A9D8F");
    expect(on("switch.a", "off").ink).toBe("rgba(42,157,143,0.7)");
    expect(new Set(["cover.a", "fan.a", "climate.a", "switch.a"].map((e) => on(e, "on").ink)).size).toBe(4);
  });

  it("keeps a lit light amber, a lock green or orange, and a gone entity gray", () => {
    expect(homeMapEditorPinPaint({ entityId: "light.a" }, { "light.a": { state: "on" } })).toMatchObject({ lit: true, fill: "#ffbf55", ink: "#3a2600" });
    expect(homeMapEditorPinPaint({ entityId: "light.a", glowColor: "#00FF00" }, { "light.a": { state: "on" } }).fill).toBe("#00ff00");
    expect(homeMapEditorPinPaint({ entityId: "lock.a" }, { "lock.a": { state: "locked" } }).ink).toBe("#30D158");
    expect(homeMapEditorPinPaint({ entityId: "lock.a" }, { "lock.a": { state: "unlocked" } }).ink).toBe("#FF9F0A");
    expect(homeMapEditorPinPaint({ entityId: "fan.a" }, {}).ink).toBe("#8e8e93");
  });
});
