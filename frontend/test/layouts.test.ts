// Adding and removing shapes, as pure functions over the config.

import { describe, expect, it } from "vitest";
import { type FamilyKind, type Value, cornerMode, encodeConfig, literal, setCornerMode, legacyConfig, newConfig, newElement, newRule, parseConfig, schemaVersionFor } from "../src/model.js";
import {
  ALL_FAMILIES,
  XLARGE_OFFERED,
  addFamily,
  canRemoveFamily,
  familiesFor,
  familyContentSummary,
  comingSoonFamilies,
  familyNote,
  biggestFirst,
  placeGroups,
  placeOf,
  placeTitle,
  firstDrawable,
  isHomeFamily,
  keepFamilies,
  missingFamilies,
  removeFamily,
  blankInline,
  supportedFamilies,
} from "../src/layouts.js";
import { MIN_IPHONE_VERSION_FOR_HOME_SCREEN } from "../src/version.js";

const WATCH_SHAPES = ["rectangular", "circular", "corner", "inline"];
/** A phone new enough for the Home Screen shapes, per the gate. */
const NEW_PHONE = { device_kind: "iphone" as const, app_version: MIN_IPHONE_VERSION_FOR_HOME_SCREEN };

describe("familiesFor", () => {
  it("offers the four watch shapes to a watch and never a Home Screen tile", () => {
    expect(familiesFor({ device_kind: "watch" })).toEqual(WATCH_SHAPES);
    expect(familiesFor({ device_kind: "watch", app_version: "9.9.9" })).toEqual(WATCH_SHAPES);
  });

  it("treats an absent or null kind as a watch, which is what every owner used to be", () => {
    expect(familiesFor({})).toEqual(WATCH_SHAPES);
    expect(familiesFor({ device_kind: null })).toEqual(WATCH_SHAPES);
    expect(familiesFor(undefined)).toEqual(WATCH_SHAPES);
  });

  // Corner is a watch face slot and nothing else: the iPhone lock screen has
  // circular, rectangular and inline.
  it("hides corner from a phone and keeps the other three in order", () => {
    expect(familiesFor({ device_kind: "iphone" })).toEqual(["rectangular", "circular", "inline"]);
  });

  // The Home Screen shapes are a version gate, not a lock-out: a phone below
  // it keeps its three lock screen shapes and simply is not offered the tiles.
  it("holds the Home Screen shapes back from a phone below the gate", () => {
    for (const app_version of ["2.7.2", "1.0.0", undefined, null, "nonsense"]) {
      expect(familiesFor({ device_kind: "iphone", app_version })).toEqual(["rectangular", "circular", "inline"]);
    }
  });

  it("offers the Home Screen shapes to a phone at or above the gate", () => {
    const expected = ["rectangular", "circular", "inline", "small", "medium", "large"];
    expect(familiesFor(NEW_PHONE)).toEqual(XLARGE_OFFERED ? [...expected, "xlarge"] : expected);
    expect(familiesFor({ device_kind: "iphone", app_version: "3.4.5" })).toEqual(
      XLARGE_OFFERED ? [...expected, "xlarge"] : expected,
    );
  });

  // Extra Large's design box is a placeholder until it is measured on iOS 27,
  // and a design box is on the wire forever, so the shape stays hidden.
  it("offers Extra Large only once its box is measured", () => {
    expect(familiesFor(NEW_PHONE).includes("xlarge")).toBe(XLARGE_OFFERED);
  });

  // The library is not a device and draws nothing, so nothing narrows it: it
  // holds whatever a newest watch and a newest phone draw between them, which
  // is every shape the panel offers at all.
  it("gives the library every shape a watch and a phone draw between them", () => {
    const expected = [...WATCH_SHAPES, "small", "medium", "large"];
    expect(familiesFor({ device_kind: "library" })).toEqual(
      XLARGE_OFFERED ? [...expected, "xlarge"] : expected,
    );
  });

  it("narrows the library by neither the version nor the absence of one", () => {
    const every = familiesFor({ device_kind: "library" });
    expect(familiesFor({ device_kind: "library", app_version: "1.0.0" })).toEqual(every);
    expect(familiesFor({ device_kind: "library", app_version: null })).toEqual(every);
    // The id alone is enough, which is what an older reply would carry.
    expect(familiesFor({ owner_watch_id: "library" })).toEqual(every);
  });

  it("gives the library the union of what the two newest devices draw", () => {
    const both = new Set([...familiesFor({ device_kind: "watch" }), ...familiesFor(NEW_PHONE)]);
    expect(familiesFor({ device_kind: "library" })).toEqual(ALL_FAMILIES.filter((f) => both.has(f)));
  });

  it("does not change the shared list it filters", () => {
    familiesFor({ device_kind: "iphone" });
    familiesFor({ device_kind: "watch" });
    familiesFor({ device_kind: "library" });
    expect(ALL_FAMILIES).toEqual([...WATCH_SHAPES, "small", "medium", "large", "xlarge"]);
  });

  it("knows which shapes are Home Screen tiles", () => {
    expect(ALL_FAMILIES.filter(isHomeFamily)).toEqual(["small", "medium", "large", "xlarge"]);
  });
});

describe("newConfig", () => {
  it("makes one rectangular shape by default", () => {
    const cfg = newConfig("X", 0);
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(Object.keys(cfg.perFamily)).toEqual(["rectangular"]);
    expect(cfg.inline).toBeUndefined();
    expect(cfg.schemaVersion).toBe(6);
  });

  it("makes a document with no shape at all for a control", () => {
    const cfg = newConfig("X", 0, null);
    expect(cfg.supportedFamilies).toEqual([]);
    expect(cfg.perFamily).toEqual({});
  });

  it("keeps the three canvas shapes for a document an older panel wrote", () => {
    const cfg = legacyConfig("X", 0);
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular", "corner"]);
    expect(Object.keys(cfg.perFamily).sort()).toEqual(["circular", "corner", "rectangular"]);
    expect(cfg.schemaVersion).toBe(4);
  });

  it("creates one shape with its layout and nothing else", () => {
    const cfg = newConfig("X", 0, "circular");
    expect(cfg.supportedFamilies).toEqual(["circular"]);
    expect(Object.keys(cfg.perFamily)).toEqual(["circular"]);
    expect(cfg.inline).toBeUndefined();
    expect(cfg.schemaVersion).toBe(6);
  });

  // An empty layer canvas the size of a corner gives nothing to edit, so a new
  // corner starts as the stock look: big curved text over a gauge arc.
  it("starts a corner as big curved text over a bezel gauge", () => {
    const cfg = newConfig("X", 0, "corner");
    const corner = cfg.perFamily.corner!;
    expect(corner.curvedText).toEqual(literal("Text"));
    expect(corner.bezelGauge).toEqual({ value: literal("50"), minValue: 0, maxValue: 100, colorHexes: ["#34C759", "#FFCC00", "#FF3B30"] });
    expect(corner.bezelText).toBeUndefined();
    expect(corner.placements).toEqual({});
    expect(cfg.schemaVersion).toBe(schemaVersionFor(cfg));
    const back = parseConfig(encodeConfig(cfg))!;
    expect(back.perFamily.corner!.curvedText).toEqual(corner.curvedText);
    expect(back.perFamily.corner!.bezelGauge).toEqual(corner.bezelGauge);
  });

  it("switches a corner between curved text and layers, keeping the bezel", () => {
    const cfg = newConfig("X", 0, "corner");
    const corner = cfg.perFamily.corner!;
    expect(cornerMode(corner)).toBe("curved");
    corner.curvedColorHex = "#FF0000";
    setCornerMode(corner, "canvas");
    expect(cornerMode(corner)).toBe("canvas");
    expect(corner.curvedText).toBeUndefined();
    expect(corner.curvedColorHex).toBeUndefined();
    expect(corner.bezelGauge).toBeDefined();
    setCornerMode(corner, "curved");
    expect(corner.curvedText).toEqual(literal("Text"));
    corner.curvedText = literal("Mine");
    setCornerMode(corner, "curved");
    expect(corner.curvedText).toEqual(literal("Mine"));
    expect(cornerMode(undefined)).toBe("canvas");
  });

  it("leaves the other shapes' layouts empty", () => {
    for (const f of ["rectangular", "circular"] as const) {
      const layout = newConfig("X", 0, f).perFamily[f]!;
      expect(layout.curvedText).toBeUndefined();
      expect(layout.bezelGauge).toBeUndefined();
    }
    expect(legacyConfig("X", 0).perFamily.corner!.curvedText).toBeUndefined();
  });

  it("creates an Inline-only document with a literal and no canvas layout", () => {
    const cfg = newConfig("X", 0, "inline");
    expect(cfg.supportedFamilies).toEqual(["inline"]);
    expect(cfg.perFamily).toEqual({});
    expect(cfg.inline).toEqual({ value: literal("Text") });
    expect(cfg.schemaVersion).toBe(6);
  });

  it("orders the set canonically whatever order it was asked for", () => {
    expect(legacyConfig("X", 0, ["inline", "corner", "rectangular"]).supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
  });
});

describe("addFamily", () => {
  it("seeds a default layout for a canvas shape and stamps schema 6 stays until all three are back", () => {
    const cfg = newConfig("X", 0, "rectangular");
    addFamily(cfg, "circular");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
    expect(cfg.perFamily.circular).toEqual({ placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] });
    expect(cfg.schemaVersion).toBe(6);
    addFamily(cfg, "corner");
    expect(cfg.schemaVersion).toBe(4);
  });

  // Inline used to copy the first text layer's value. Every shape starts with
  // nothing on it now, and a shape that helps itself to a layer's content is
  // the same surprise a canvas shape used to spring by arriving full.
  it("starts Inline empty, whatever the document already draws", () => {
    const cfg = newConfig("X", 0, "rectangular");
    const icon = newElement("icon");
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("expected a text layer");
    text.payload.value = { kind: { kind: "entityState", entityId: "sensor.t", displayName: "T", domain: "sensor" } };
    cfg.elements = [icon, text];
    addFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "inline"]);
    expect(cfg.inline).toEqual({ value: literal("") });
  });

  it("counts an untouched Inline as empty, so dropping it asks nothing", () => {
    const cfg = newConfig("X", 0, "rectangular");
    cfg.elements = [newElement("text")];
    addFamily(cfg, "inline");
    expect(familyContentSummary(cfg, "inline")).toEqual([]);
  });

  it("blankInline carries no label and no symbol", () => {
    expect(blankInline()).toEqual({ value: literal("") });
  });

  it("is a no-op for a shape already there and never duplicates it", () => {
    const cfg = newConfig("X", 0, "rectangular");
    cfg.perFamily.rectangular!.borderWidth = 9;
    addFamily(cfg, "rectangular");
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(cfg.perFamily.rectangular!.borderWidth).toBe(9);
  });

  it("keeps canonical order when adding out of order", () => {
    const cfg = newConfig("X", 0, "corner");
    addFamily(cfg, "inline");
    addFamily(cfg, "rectangular");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
  });
});

describe("keepFamilies", () => {
  it("returns a copy with only the chosen shapes and leaves the document alone", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "circular", "corner", "inline"]);
    const kept = keepFamilies(cfg, ["circular", "inline"]);
    expect(kept.supportedFamilies).toEqual(["circular", "inline"]);
    expect(Object.keys(kept.perFamily)).toEqual(["circular"]);
    expect(kept.inline).toBeDefined();
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("drops Inline when it is not kept", () => {
    const kept = keepFamilies(legacyConfig("X", 0, ["rectangular", "inline"]), ["rectangular"]);
    expect(kept.supportedFamilies).toEqual(["rectangular"]);
    expect(kept.inline).toBeUndefined();
  });

  it("keeps the whole document rather than empty the set", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "circular"]);
    expect(keepFamilies(cfg, []).supportedFamilies).toEqual(["rectangular", "circular"]);
    expect(keepFamilies(cfg, ["corner"]).supportedFamilies).toEqual(["rectangular", "circular"]);
  });
});

describe("removeFamily", () => {
  it("drops the shape and its layout together", () => {
    const cfg = legacyConfig("X", 0);
    removeFamily(cfg, "corner");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
    expect(cfg.perFamily.corner).toBeUndefined();
    expect(cfg.schemaVersion).toBe(6);
  });

  it("drops Inline and its text together", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "inline"]);
    removeFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(cfg.inline).toBeUndefined();
  });

  it("refuses to empty the set", () => {
    const cfg = newConfig("X", 0, "inline");
    expect(canRemoveFamily(cfg, "inline")).toBe(false);
    removeFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["inline"]);
    expect(cfg.inline).toBeDefined();
  });

  it("ignores a shape the document does not have", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "circular"]);
    expect(canRemoveFamily(cfg, "corner")).toBe(false);
    removeFamily(cfg, "corner");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
  });

  it("round-trips through the encoder after a removal so the set and the document agree", () => {
    const cfg = legacyConfig("X", 0);
    removeFamily(cfg, "circular");
    addFamily(cfg, "inline");
    const back = parseConfig(encodeConfig(cfg));
    expect(back.supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
    expect(Object.keys(back.perFamily).sort()).toEqual(["corner", "rectangular"]);
    expect(back.inline).toEqual({ value: literal("") });
    expect(back.schemaVersion).toBe(6);
    expect(schemaVersionFor(back)).toBe(6);
  });
});

describe("familyContentSummary", () => {
  it("is empty for a fresh layout, so no confirmation is asked", () => {
    const cfg = legacyConfig("X", 0, ["rectangular", "inline"]);
    expect(familyContentSummary(cfg, "rectangular")).toEqual([]);
    expect(familyContentSummary(cfg, "inline")).toEqual([]);
  });

  it("names placements, rules, the bezel and the chrome", () => {
    const cfg = legacyConfig("X", 0);
    const el = newElement("text");
    cfg.elements = [el];
    const corner = cfg.perFamily.corner!;
    corner.placements[el.payload.id] = { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }, isHidden: false };
    corner.rules = [newRule()];
    corner.bezelText = literal("L");
    corner.backgroundColorHex = "#000000";
    expect(familyContentSummary(cfg, "corner")).toEqual(["1 layer", "1 rule", "the bezel", "the background or border"]);
  });

  // A shape starts with nothing on it, so removing one the author has not laid
  // out yet must not stop to ask.
  it("counts nothing on a shape that has no layers", () => {
    const cfg = newConfig("X", 0, "rectangular");
    cfg.elements = [newElement("text"), newElement("icon")];
    addFamily(cfg, "circular");
    expect(Object.keys(cfg.perFamily.circular!.placements)).toHaveLength(0);
    expect(familyContentSummary(cfg, "circular")).toEqual([]);
  });

  it("counts an edited Inline as content", () => {
    const cfg = newConfig("X", 0, "inline");
    cfg.inline!.label = "Temp";
    expect(familyContentSummary(cfg, "inline")).toEqual(["the Inline text"]);
  });
});

describe("helpers", () => {
  it("lists supported and missing shapes in canonical order", () => {
    const cfg = { supportedFamilies: ["inline", "rectangular"] as const };
    expect(supportedFamilies({ supportedFamilies: [...cfg.supportedFamilies] })).toEqual(["rectangular", "inline"]);
    expect(missingFamilies({ supportedFamilies: [...cfg.supportedFamilies] })).toEqual(
      ["circular", "corner", "small", "medium", "large", "xlarge"],
    );
    expect(ALL_FAMILIES).toEqual(["rectangular", "circular", "corner", "inline", "small", "medium", "large", "xlarge"]);
  });

  it("finds the first canvas shape, or none for Inline only", () => {
    expect(firstDrawable({ supportedFamilies: ["inline", "corner"] })).toBe("corner");
    expect(firstDrawable({ supportedFamilies: ["inline"] })).toBeUndefined();
  });
});

// The note is read straight, not through familiesFor: Extra Large is hidden
// from every owner while its design box is a placeholder, so the only way to
// check the line the card would carry is to ask for it.
describe("biggestFirst", () => {
  it("runs from the whole page down to the thinnest line, whatever order it is given", () => {
    expect(biggestFirst(["inline", "small", "xlarge", "medium", "large"]))
      .toEqual(["xlarge", "large", "medium", "small", "inline"]);
    expect(biggestFirst(["inline", "corner", "circular", "rectangular"]))
      .toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("leaves the caller's array alone", () => {
    const given = ["small", "large"] as const;
    biggestFirst(given);
    expect(given).toEqual(["small", "large"]);
  });
});

describe("placeOf", () => {
  // The same four shapes are the face's on a watch and the Lock Screen's on a
  // phone, so the owner is what decides, never the shape alone.
  it("reads the four shared shapes as the face on a watch and the Lock Screen on a phone", () => {
    expect(placeOf("rectangular", { device_kind: "watch" })).toBe("watch");
    expect(placeOf("corner", { device_kind: "watch" })).toBe("watch");
    expect(placeOf("rectangular", NEW_PHONE)).toBe("lock");
  });

  it("reads a tile as the Home Screen on either device", () => {
    expect(placeOf("medium", NEW_PHONE)).toBe("home");
    expect(placeOf("medium", { device_kind: "watch" })).toBe("home");
  });
});

describe("placeTitle", () => {
  it("names the three places the way the cards and headings read them", () => {
    expect(placeTitle("home")).toBe("Home Screen");
    expect(placeTitle("lock")).toBe("Lock Screen");
    expect(placeTitle("watch")).toBe("Watch face");
  });
});

describe("placeGroups", () => {
  it("gives a watch one place, holding its four shapes widest first", () => {
    expect(placeGroups({ device_kind: "watch" }, ["inline", "corner", "circular", "rectangular"])).toEqual([
      { place: "watch", label: "Watch face", families: ["rectangular", "circular", "corner", "inline"], comingSoon: [] },
    ]);
  });

  it("splits a phone into Home Screen first, then Lock Screen, each biggest first", () => {
    expect(placeGroups(NEW_PHONE, ["rectangular", "circular", "inline", "small", "medium", "large"])).toEqual([
      { place: "home", label: "Home Screen", families: ["large", "medium", "small"], comingSoon: [] },
      { place: "lock", label: "Lock Screen", families: ["rectangular", "circular", "inline"], comingSoon: [] },
    ]);
  });

  it("leaves out a place this device has nothing in", () => {
    expect(placeGroups(NEW_PHONE, ["small"])).toEqual([
      { place: "home", label: "Home Screen", families: ["small"], comingSoon: [] },
    ]);
  });

  it("carries a coming-soon shape in its own place, not among the pickable ones", () => {
    expect(placeGroups(NEW_PHONE, ["rectangular", "small"], ["xlarge"])).toEqual([
      { place: "home", label: "Home Screen", families: ["small"], comingSoon: ["xlarge"] },
      { place: "lock", label: "Lock Screen", families: ["rectangular"], comingSoon: [] },
    ]);
  });
});

describe("comingSoonFamilies", () => {
  it("promises Extra Large to a phone that already has the Home Screen shapes", () => {
    expect(comingSoonFamilies(NEW_PHONE)).toEqual(XLARGE_OFFERED ? [] : ["xlarge"]);
  });

  it("promises nothing to a watch", () => {
    expect(comingSoonFamilies({ device_kind: "watch", app_version: "9.9.9" })).toEqual([]);
  });

  it("promises nothing to a phone too old for the Home Screen", () => {
    expect(comingSoonFamilies({ device_kind: "iphone", app_version: "2.7.0" })).toEqual([]);
  });

  // A shape coming to any device in the home is coming to the shelf, since the
  // shelf holds a design for all of them.
  it("promises the library whatever the newest phone is promised", () => {
    expect(comingSoonFamilies({ device_kind: "library" })).toEqual(comingSoonFamilies(NEW_PHONE));
    expect(comingSoonFamilies({ device_kind: "library", app_version: null })).toEqual(
      XLARGE_OFFERED ? [] : ["xlarge"],
    );
  });
});

describe("familyNote", () => {
  it("marks Extra Large as an iOS 27 shape", () => {
    expect(familyNote("xlarge")).toBe("iOS 27 and later");
  });

  it("says nothing about any other shape", () => {
    for (const family of ALL_FAMILIES.filter((f) => f !== "xlarge")) {
      expect(familyNote(family)).toBeUndefined();
    }
  });
});
