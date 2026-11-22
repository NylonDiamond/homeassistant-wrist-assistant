// The order the plan draws things in: rugs first, then the lowest top
// first, so a thing high up is seen over a thing on the floor under it,
// whichever was placed first. The app's Flat plan pins the same cases
// (`HomeMapPlanOrderTests`).

import { describe, expect, it } from "vitest";

import type { HomeMapObject } from "../src/home-map/model.js";
import { homeMapPlanOrder } from "../src/home-map/tile-art.js";

function thing(kind: string, height: number, lift?: number): { object: HomeMapObject } {
  return { object: { kind, c: [0, 0], size: [1, 1, height], turn: 0, ...(lift === undefined ? {} : { lift }) } };
}

const kinds = (things: readonly { object: HomeMapObject }[]) => things.map((t) => t.object.kind);

describe("homeMapPlanOrder", () => {
  it("draws a ceiling light over a bed placed after it", () => {
    expect(kinds(homeMapPlanOrder([thing("light", 0.3, 2.2), thing("bed", 0.6)]))).toEqual(["bed", "light"]);
  });

  it("draws a TV on the wall over the cabinet under it", () => {
    expect(kinds(homeMapPlanOrder([thing("television", 0.6, 1.2), thing("storage", 0.8)]))).toEqual(["storage", "television"]);
  });

  it("keeps rugs under everything, even a rug lifted", () => {
    expect(kinds(homeMapPlanOrder([thing("table", 0.75), thing("rug", 0.01, 0.5)]))).toEqual(["rug", "table"]);
  });

  it("keeps the map's order for things as high", () => {
    expect(kinds(homeMapPlanOrder([thing("chair", 0.9), thing("sofa", 0.9), thing("bed", 0.9)]))).toEqual(["chair", "sofa", "bed"]);
  });

  it("leaves the list it was given as it was", () => {
    const list = [thing("light", 0.3, 2.2), thing("bed", 0.6)];
    homeMapPlanOrder(list);
    expect(kinds(list)).toEqual(["light", "bed"]);
  });
});
