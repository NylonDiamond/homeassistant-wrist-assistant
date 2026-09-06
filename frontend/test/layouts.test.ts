// Adding and removing shapes, as pure functions over the config.

import { describe, expect, it } from "vitest";
import { type Value, encodeConfig, literal, newConfig, newElement, newRule, parseConfig, schemaVersionFor } from "../src/model.js";
import {
  ALL_FAMILIES,
  addFamily,
  canRemoveFamily,
  familyContentSummary,
  firstDrawable,
  missingFamilies,
  removeFamily,
  seedInline,
  supportedFamilies,
} from "../src/layouts.js";

describe("newConfig", () => {
  it("keeps the three canvas shapes by default, which is what an old watch needs", () => {
    const cfg = newConfig("X", 0);
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular", "corner"]);
    expect(Object.keys(cfg.perFamily).sort()).toEqual(["circular", "corner", "rectangular"]);
    expect(cfg.inline).toBeUndefined();
    expect(cfg.schemaVersion).toBe(4);
  });

  it("creates one shape with its layout and nothing else", () => {
    const cfg = newConfig("X", 0, ["circular"]);
    expect(cfg.supportedFamilies).toEqual(["circular"]);
    expect(Object.keys(cfg.perFamily)).toEqual(["circular"]);
    expect(cfg.inline).toBeUndefined();
    expect(cfg.schemaVersion).toBe(6);
  });

  it("creates an Inline-only document with a literal and no canvas layout", () => {
    const cfg = newConfig("X", 0, ["inline"]);
    expect(cfg.supportedFamilies).toEqual(["inline"]);
    expect(cfg.perFamily).toEqual({});
    expect(cfg.inline).toEqual({ value: literal("Text") });
    expect(cfg.schemaVersion).toBe(6);
  });

  it("orders the set canonically whatever order it was asked for", () => {
    expect(newConfig("X", 0, ["inline", "corner", "rectangular"]).supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
  });
});

describe("addFamily", () => {
  it("seeds a default layout for a canvas shape and stamps schema 6 stays until all three are back", () => {
    const cfg = newConfig("X", 0, ["rectangular"]);
    addFamily(cfg, "circular");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
    expect(cfg.perFamily.circular).toEqual({ placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] });
    expect(cfg.schemaVersion).toBe(6);
    addFamily(cfg, "corner");
    expect(cfg.schemaVersion).toBe(4);
  });

  it("seeds Inline from the first text layer's value", () => {
    const cfg = newConfig("X", 0, ["rectangular"]);
    const icon = newElement("icon");
    const text = newElement("text");
    if (text.kind !== "text") throw new Error("expected a text layer");
    const value: Value = { kind: { kind: "entityState", entityId: "sensor.t", displayName: "T", domain: "sensor" } };
    text.payload.value = value;
    cfg.elements = [icon, text];
    addFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "inline"]);
    expect(cfg.inline).toEqual({ value });
    expect(cfg.inline!.value).not.toBe(value);
  });

  it("seeds Inline with a literal when there is no text layer", () => {
    expect(seedInline({ elements: [newElement("gauge")] })).toEqual({ value: literal("Text") });
  });

  it("is a no-op for a shape already there and never duplicates it", () => {
    const cfg = newConfig("X", 0, ["rectangular"]);
    cfg.perFamily.rectangular!.borderWidth = 9;
    addFamily(cfg, "rectangular");
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(cfg.perFamily.rectangular!.borderWidth).toBe(9);
  });

  it("keeps canonical order when adding out of order", () => {
    const cfg = newConfig("X", 0, ["corner"]);
    addFamily(cfg, "inline");
    addFamily(cfg, "rectangular");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
  });
});

describe("removeFamily", () => {
  it("drops the shape and its layout together", () => {
    const cfg = newConfig("X", 0);
    removeFamily(cfg, "corner");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
    expect(cfg.perFamily.corner).toBeUndefined();
    expect(cfg.schemaVersion).toBe(6);
  });

  it("drops Inline and its text together", () => {
    const cfg = newConfig("X", 0, ["rectangular", "inline"]);
    removeFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["rectangular"]);
    expect(cfg.inline).toBeUndefined();
  });

  it("refuses to empty the set", () => {
    const cfg = newConfig("X", 0, ["inline"]);
    expect(canRemoveFamily(cfg, "inline")).toBe(false);
    removeFamily(cfg, "inline");
    expect(cfg.supportedFamilies).toEqual(["inline"]);
    expect(cfg.inline).toBeDefined();
  });

  it("ignores a shape the document does not have", () => {
    const cfg = newConfig("X", 0, ["rectangular", "circular"]);
    expect(canRemoveFamily(cfg, "corner")).toBe(false);
    removeFamily(cfg, "corner");
    expect(cfg.supportedFamilies).toEqual(["rectangular", "circular"]);
  });

  it("round-trips through the encoder after a removal so the set and the document agree", () => {
    const cfg = newConfig("X", 0);
    removeFamily(cfg, "circular");
    addFamily(cfg, "inline");
    const back = parseConfig(encodeConfig(cfg));
    expect(back.supportedFamilies).toEqual(["rectangular", "corner", "inline"]);
    expect(Object.keys(back.perFamily).sort()).toEqual(["corner", "rectangular"]);
    expect(back.inline).toEqual({ value: literal("Text") });
    expect(back.schemaVersion).toBe(6);
    expect(schemaVersionFor(back)).toBe(6);
  });
});

describe("familyContentSummary", () => {
  it("is empty for a fresh layout, so no confirmation is asked", () => {
    const cfg = newConfig("X", 0, ["rectangular", "inline"]);
    expect(familyContentSummary(cfg, "rectangular")).toEqual([]);
    expect(familyContentSummary(cfg, "inline")).toEqual([]);
  });

  it("names placements, rules, the bezel and the chrome", () => {
    const cfg = newConfig("X", 0);
    const el = newElement("text");
    cfg.elements = [el];
    const corner = cfg.perFamily.corner!;
    corner.placements[el.payload.id] = { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }, isHidden: false };
    corner.rules = [newRule()];
    corner.bezelText = literal("L");
    corner.backgroundColorHex = "#000000";
    expect(familyContentSummary(cfg, "corner")).toEqual(["1 placed layer", "1 rule", "the bezel", "the background or border"]);
  });

  // A shape starts blank, which is a hidden placement for every layer. That is
  // nothing anyone typed, so removing a shape they have not laid out yet must
  // not stop to ask.
  it("does not count a blank shape's hidden placements", () => {
    const cfg = newConfig("X", 0, ["rectangular"]);
    cfg.elements = [newElement("text"), newElement("icon")];
    addFamily(cfg, "circular");
    expect(Object.keys(cfg.perFamily.circular!.placements)).toHaveLength(2);
    expect(familyContentSummary(cfg, "circular")).toEqual([]);
  });

  it("counts an edited Inline as content", () => {
    const cfg = newConfig("X", 0, ["inline"]);
    cfg.inline!.label = "Temp";
    expect(familyContentSummary(cfg, "inline")).toEqual(["the Inline text"]);
  });
});

describe("helpers", () => {
  it("lists supported and missing shapes in canonical order", () => {
    const cfg = { supportedFamilies: ["inline", "rectangular"] as const };
    expect(supportedFamilies({ supportedFamilies: [...cfg.supportedFamilies] })).toEqual(["rectangular", "inline"]);
    expect(missingFamilies({ supportedFamilies: [...cfg.supportedFamilies] })).toEqual(["circular", "corner"]);
    expect(ALL_FAMILIES).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("finds the first canvas shape, or none for Inline only", () => {
    expect(firstDrawable({ supportedFamilies: ["inline", "corner"] })).toBe("corner");
    expect(firstDrawable({ supportedFamilies: ["inline"] })).toBeUndefined();
  });
});
