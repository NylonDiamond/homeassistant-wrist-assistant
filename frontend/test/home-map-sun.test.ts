// The real sun over the 3D view, and where north is on the plan.

import { describe, expect, it } from "vitest";

import { setHomeNorth } from "../src/home-map/edit-ops.js";
import { checkHomeMap, type HomeMapDocument, type HomeMapFloor } from "../src/home-map/model.js";
import { HOME_MAP_DAY, HOME_MAP_NIGHT, homeMapFloorNorth, homeMapSkyFor, homeMapSkyOf, homeMapSunPlace } from "../src/home-map/sun.js";

const FLOOR_A = "11111111-1111-4111-8111-111111111111";
const FLOOR_B = "22222222-2222-4222-8222-222222222222";

function floor(id: string, story: number, turn?: number): HomeMapFloor {
  return { id, name: "Floor", story, ...(turn === undefined ? {} : { place: { x: 0, y: 0, turn } }), rooms: [], pins: [] };
}

describe("homeMapSkyOf", () => {
  it("puts the sun where the compass says, with north at the top of the plan", () => {
    // East, on a plan with north up, is the plan's right: world +x.
    const east = homeMapSkyOf({ azimuth: 90, elevation: 0 }, 0);
    expect(east.dir[0]).toBeCloseTo(1);
    expect(east.dir[2]).toBeCloseTo(0);
    // South is down the plan: world +z.
    const south = homeMapSkyOf({ azimuth: 180, elevation: 0 }, 0);
    expect(south.dir[0]).toBeCloseTo(0);
    expect(south.dir[2]).toBeCloseTo(1);
  });

  it("turns the sun with north", () => {
    // North on the plan's right: a sun in the north stands to the right.
    const sky = homeMapSkyOf({ azimuth: 0, elevation: 0 }, 90);
    expect(sky.dir[0]).toBeCloseTo(1);
    expect(sky.dir[2]).toBeCloseTo(0);
  });

  it("raises the sun with its elevation", () => {
    expect(homeMapSkyOf({ azimuth: 0, elevation: 90 }, 0).dir[1]).toBeCloseTo(1);
    expect(homeMapSkyOf({ azimuth: 0, elevation: 30 }, 0).dir[1]).toBeCloseTo(0.5);
  });

  it("has no direct sun under the horizon and a full one by 12 degrees", () => {
    expect(homeMapSkyOf({ azimuth: 0, elevation: -20 }, 0).sun).toBe(0);
    expect(homeMapSkyOf({ azimuth: 0, elevation: 0 }, 0).sun).toBe(0);
    expect(homeMapSkyOf({ azimuth: 0, elevation: 12 }, 0).sun).toBe(1);
  });

  it("keeps some sky in twilight, and none in the deep night", () => {
    expect(homeMapSkyOf({ azimuth: 0, elevation: -3 }, 0).sky).toBeGreaterThan(0);
    expect(homeMapSkyOf({ azimuth: 0, elevation: -7 }, 0).sky).toBe(0);
    expect(homeMapSkyOf({ azimuth: 0, elevation: 10 }, 0).sky).toBe(1);
  });

  it("is orange low down and white high up", () => {
    expect(homeMapSkyOf({ azimuth: 0, elevation: 1 }, 0).warm).toBe(1);
    expect(homeMapSkyOf({ azimuth: 0, elevation: 40 }, 0).warm).toBe(0);
  });
});

describe("homeMapSkyFor", () => {
  const place = { azimuth: 180, elevation: 40 };
  it("shows the choice, whatever the sun", () => {
    expect(homeMapSkyFor("day", place, 0)).toBe(HOME_MAP_DAY);
    expect(homeMapSkyFor("night", place, 0)).toBe(HOME_MAP_NIGHT);
    expect(homeMapSkyFor("now", place, 0).sun).toBe(1);
  });
  it("is night for Now with no sun known", () => {
    expect(homeMapSkyFor("now", undefined, 0)).toBe(HOME_MAP_NIGHT);
  });
});

describe("homeMapSunPlace", () => {
  it("reads sun.sun", () => {
    expect(homeMapSunPlace({ "sun.sun": { state: "above_horizon", attributes: { azimuth: 120.5, elevation: 22 } } })).toEqual({ azimuth: 120.5, elevation: 22 });
  });
  it("knows nothing with no entity or no numbers", () => {
    expect(homeMapSunPlace(undefined)).toBeUndefined();
    expect(homeMapSunPlace({})).toBeUndefined();
    expect(homeMapSunPlace({ "sun.sun": { state: "above_horizon", attributes: { azimuth: "south", elevation: 22 } } })).toBeUndefined();
  });
});

describe("homeMapFloorNorth", () => {
  it("is the map's north on the base floor, its own place ignored", () => {
    const base = floor(FLOOR_A, 0, 30);
    expect(homeMapFloorNorth({ north: 90, floors: [base] }, base)).toBe(90);
  });
  it("adds a floor's turn over the base floor", () => {
    // The upper floor is turned 90 degrees counterclockwise over the base. North
    // to the left of the base's plan is up on that floor's own plan.
    const base = floor(FLOOR_A, 0);
    const upper = floor(FLOOR_B, 1, 90);
    expect(homeMapFloorNorth({ north: 270, floors: [base, upper] }, upper)).toBe(0);
  });
  it("is the top of the plan with no key", () => {
    const base = floor(FLOOR_A, 0);
    expect(homeMapFloorNorth({ floors: [base] }, base)).toBe(0);
    expect(homeMapFloorNorth(null, base)).toBe(0);
  });
});

describe("the north key", () => {
  const doc: HomeMapDocument = { v: 1, style: { look: "clay" }, floors: [] };

  it("stands after the style and before the floors, and 0 is dropped", () => {
    const set = setHomeNorth(doc, 90)!;
    expect(Object.keys(set)).toEqual(["v", "style", "north", "floors"]);
    expect(set.north).toBe(90);
    expect("north" in setHomeNorth(set, 0)!).toBe(false);
  });

  it("wraps and rounds", () => {
    expect(setHomeNorth(doc, -90)!.north).toBe(270);
    expect(setHomeNorth(doc, 359.6)).not.toHaveProperty("north");
    expect(setHomeNorth(doc, Number.NaN)).toBeUndefined();
  });

  it("is checked as the store checks it", () => {
    const checked = checkHomeMap({ v: 1, north: 45, floors: [] });
    expect(checked.ok && checked.doc.north).toBe(45);
    const dropped = checkHomeMap({ v: 1, north: 0, floors: [] });
    expect(dropped.ok && "north" in dropped.doc).toBe(false);
    for (const north of [360, -1, "90", true]) expect(checkHomeMap({ v: 1, north, floors: [] }).ok).toBe(false);
  });
});
