// The Add a layer card's search box. The rule is small enough to read, and
// worth pinning: it decides whether a preset the author knows is there can be
// found by typing part of its name.

import { describe, expect, it } from "vitest";
import { addSearchTerms, filterAddOffers, matchesAddSearch } from "../src/add-filter.js";
import { addDetailFrom } from "../src/panel.js";
import { LAYER_PRESETS } from "../src/presets.js";

describe("the remembered card size", () => {
  it("takes the three sizes back as they are", () => {
    expect(addDetailFrom("names")).toBe("names");
    expect(addDetailFrom("small")).toBe("small");
    expect(addDetailFrom("large")).toBe("large");
  });

  it("keeps a choice made before Small existed", () => {
    expect(addDetailFrom("expanded")).toBe("large");
    expect(addDetailFrom("compact")).toBe("names");
  });

  it("has no opinion when nothing was stored, so the default stands", () => {
    expect(addDetailFrom(undefined)).toBeUndefined();
    expect(addDetailFrom("")).toBeUndefined();
    expect(addDetailFrom(2)).toBeUndefined();
    expect(addDetailFrom({ size: "small" })).toBeUndefined();
  });
});

describe("add search terms", () => {
  it("lowercases and drops the empty ones", () => {
    expect(addSearchTerms("  Door   History ")).toEqual(["door", "history"]);
  });

  it("is empty for nothing typed and for spaces alone", () => {
    expect(addSearchTerms("")).toEqual([]);
    expect(addSearchTerms("   ")).toEqual([]);
  });
});

describe("matching a name", () => {
  it("matches a substring whatever the case", () => {
    expect(matchesAddSearch("Door history", "door")).toBe(true);
    expect(matchesAddSearch("Door history", "DOOR")).toBe(true);
    expect(matchesAddSearch("Door history", "HIST")).toBe(true);
  });

  it("matches inside a word, not only at its start", () => {
    expect(matchesAddSearch("Battery ring", "ring")).toBe(true);
    expect(matchesAddSearch("Sparkline", "park")).toBe(true);
  });

  it("wants every word, in any order and with any gap", () => {
    expect(matchesAddSearch("Door history", "door hist")).toBe(true);
    expect(matchesAddSearch("Door history", "history door")).toBe(true);
    expect(matchesAddSearch("Door history", "door chart")).toBe(false);
  });

  it("matches everything when nothing is typed", () => {
    expect(matchesAddSearch("Anything", "")).toBe(true);
    expect(matchesAddSearch("Anything", "  ")).toBe(true);
  });

  it("says no when the name does not hold the word", () => {
    expect(matchesAddSearch("Camera", "gauge")).toBe(false);
  });
});

describe("filtering the offers", () => {
  const offers = [
    { title: "Text" },
    { title: "Sensor gauge" },
    { title: "Battery ring" },
    { title: "Forecast chart" },
  ];

  it("keeps the order it was given", () => {
    expect(filterAddOffers(offers, "a").map((o) => o.title))
      .toEqual(["Sensor gauge", "Battery ring", "Forecast chart"]);
  });

  it("hands back the same list when nothing is typed", () => {
    expect(filterAddOffers(offers, "")).toBe(offers);
  });

  it("can leave nothing, which is how a group hides itself", () => {
    expect(filterAddOffers(offers, "timeline")).toEqual([]);
  });

  it("finds the presets an author would type for", () => {
    const found = (q: string) => filterAddOffers(LAYER_PRESETS, q).map((p) => p.title);
    expect(found("door")).toContain("Door history");
    expect(found("batter")).toContain("Low batteries");
    expect(found("forecast")).toEqual(["Forecast chart", "Hourly forecast", "Daily forecast"]);
  });

  it("matches the name and not the blurb", () => {
    // A preset's blurb is a sentence about what it builds, and the words it
    // shares with a dozen other blurbs would return the lot.
    const entityish = LAYER_PRESETS.filter((p) => p.blurb.toLowerCase().includes("entity"));
    expect(entityish.length).toBeGreaterThan(3);
    expect(filterAddOffers(LAYER_PRESETS, "entity")).toEqual([]);
  });
});
