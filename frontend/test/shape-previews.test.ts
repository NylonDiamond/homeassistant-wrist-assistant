// The row of small previews under the canvas. These cover the parts that are
// arithmetic rather than drawing: which shapes the row lists, how big each one
// is drawn, what the warning badge is for, which layer stands for the selected
// one on another shape, and the choice the browser remembers.

import { describe, expect, it } from "vitest";

import { addFamily } from "../src/layouts.js";
import {
  type CustomComplicationConfig,
  type FamilyKind,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  seedFamilyFromSibling,
} from "../src/model.js";
import type { ResolvedElement, ResolvedLayout } from "../src/resolver.js";
import {
  PREVIEW_STORE_PREFIX,
  loadPreviewHidden,
  previewBox,
  previewFamilies,
  previewStoreKey,
  previewTintFor,
  previewWarnings,
  savePreviewHidden,
  togglePreviewHidden,
  twinLayerId,
} from "../src/shapePreviews.js";

/** The shape bar's order for a phone that draws the lot. */
const PHONE_ORDER: FamilyKind[] = ["large", "medium", "small", "rectangular", "circular", "inline"];

describe("which shapes the row lists", () => {
  it("lists every other shape the complication has, in the bar's order", () => {
    expect(previewFamilies({
      order: PHONE_ORDER,
      supported: ["rectangular", "circular", "small", "medium"],
      editing: "rectangular",
      hidden: new Set(),
    })).toEqual(["medium", "small", "circular"]);
  });

  it("leaves out the shape being edited", () => {
    const out = previewFamilies({
      order: PHONE_ORDER,
      supported: ["rectangular", "circular"],
      editing: "circular",
      hidden: new Set(),
    });
    expect(out).toEqual(["rectangular"]);
  });

  it("leaves out a shape the device does not draw", () => {
    // A watch owner's bar never lists the Home Screen sizes, so a document
    // carrying them does not preview them here either.
    expect(previewFamilies({
      order: ["rectangular", "circular", "corner"],
      supported: ["rectangular", "circular", "small"],
      editing: "rectangular",
      hidden: new Set(),
    })).toEqual(["circular"]);
  });

  it("leaves out a shape switched off", () => {
    expect(previewFamilies({
      order: PHONE_ORDER,
      supported: ["rectangular", "circular", "small"],
      editing: "rectangular",
      hidden: new Set<FamilyKind>(["small"]),
    })).toEqual(["circular"]);
  });

  it("lists Inline only when there is something to draw it with", () => {
    const args = {
      order: PHONE_ORDER,
      supported: ["rectangular", "inline"] as FamilyKind[],
      editing: "rectangular" as FamilyKind,
      hidden: new Set<FamilyKind>(),
    };
    expect(previewFamilies(args)).toEqual([]);
    expect(previewFamilies({ ...args, inline: true })).toEqual(["inline"]);
  });

  it("lists nothing on a complication with one shape", () => {
    expect(previewFamilies({
      order: PHONE_ORDER,
      supported: ["rectangular"],
      editing: "rectangular",
      hidden: new Set(),
    })).toEqual([]);
  });
});

describe("how big a preview is drawn", () => {
  const room = { width: 200, height: 160 };

  it("fits a wide shape to the width", () => {
    const box = previewBox("rectangular", room);
    expect(box.width).toBeCloseTo(200, 5);
    expect(box.height).toBeLessThan(room.height);
    expect(box.scale).toBeCloseTo(200 / 181, 5);
  });

  it("fits a tall shape to the height", () => {
    const box = previewBox("xlarge", room);
    expect(box.height).toBeCloseTo(160, 5);
    expect(box.width).toBeLessThan(room.width);
  });

  it("gives a square shape the shorter side", () => {
    const box = previewBox("small", room);
    expect(box.width).toBeCloseTo(160, 5);
    expect(box.height).toBeCloseTo(160, 5);
  });

  it("never draws a shape outside the room it was given", () => {
    for (const f of ["rectangular", "circular", "corner", "small", "medium", "large", "xlarge"] as const) {
      const box = previewBox(f, room);
      expect(box.width).toBeLessThanOrEqual(room.width + 0.001);
      expect(box.height).toBeLessThanOrEqual(room.height + 0.001);
    }
  });
});

describe("the choice the browser remembers", () => {
  /** A Storage with nothing behind it but a Map. */
  function fakeStorage(): Storage {
    const map = new Map<string, string>();
    return {
      get length() { return map.size; },
      clear: () => map.clear(),
      getItem: (k: string) => map.get(k) ?? null,
      key: (i: number) => [...map.keys()][i] ?? null,
      removeItem: (k: string) => { map.delete(k); },
      setItem: (k: string, v: string) => { map.set(k, v); },
    } as Storage;
  }

  it("keys on the complication, under one prefix", () => {
    expect(previewStoreKey("ABC")).toBe(`${PREVIEW_STORE_PREFIX}ABC`);
  });

  it("starts with every preview shown", () => {
    expect([...loadPreviewHidden("ABC", fakeStorage())]).toEqual([]);
  });

  it("reads back what was switched off, per complication", () => {
    const store = fakeStorage();
    savePreviewHidden("ABC", new Set<FamilyKind>(["small", "circular"]), store);
    expect([...loadPreviewHidden("ABC", store)].sort()).toEqual(["circular", "small"]);
    // Another complication keeps its own, which is all of them shown.
    expect([...loadPreviewHidden("XYZ", store)]).toEqual([]);
  });

  it("forgets the key when nothing is switched off", () => {
    const store = fakeStorage();
    savePreviewHidden("ABC", new Set<FamilyKind>(["small"]), store);
    savePreviewHidden("ABC", new Set(), store);
    expect(store.getItem(previewStoreKey("ABC"))).toBeNull();
  });

  it("reads a key it cannot make sense of as nothing hidden", () => {
    const store = fakeStorage();
    store.setItem(previewStoreKey("ABC"), "not json");
    expect([...loadPreviewHidden("ABC", store)]).toEqual([]);
    store.setItem(previewStoreKey("ABC"), JSON.stringify({ hidden: "small" }));
    expect([...loadPreviewHidden("ABC", store)]).toEqual([]);
  });

  it("flips one shape without touching the rest", () => {
    const on = new Set<FamilyKind>(["small"]);
    expect([...togglePreviewHidden(on, "circular")].sort()).toEqual(["circular", "small"]);
    expect([...togglePreviewHidden(on, "small")]).toEqual([]);
    // The set handed in is never edited in place.
    expect([...on]).toEqual(["small"]);
  });
});

describe("the warning badge", () => {
  const layer = (fields: Record<string, unknown>) => ({
    isHidden: false, opacity: 1, ...fields,
  }) as unknown as ResolvedElement;
  const layout = (family: FamilyKind, elements: ResolvedElement[]) => ({
    family, elements, cornerBodyShape: "circle", borderWidth: 0,
  }) as unknown as ResolvedLayout;
  const frame = (x: number, y: number, width: number, height: number) => ({ x, y, width, height, rotationDegrees: 0 });
  const text = (fields: Record<string, unknown>) => layer({
    kind: "text", fontSize: 14, minimumScale: 1, lineLimit: 1, text: "Hello", ...fields,
  });

  it("says nothing about a shape that is laid out inside its canvas", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.1, 0.1, 0.8, 0.5) }),
    ]))).toEqual([]);
  });

  it("counts the layers that hang off the edge", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.6, 0.1, 0.8, 0.3) }),
      text({ frame: frame(-0.2, 0.1, 0.3, 0.3) }),
      text({ frame: frame(0.1, 0.5, 0.2, 0.2) }),
    ]))[0]).toBe("2 layers hang off the edge.");
  });

  it("says nothing about a layer sitting exactly on the edge", () => {
    expect(previewWarnings(layout("rectangular", [text({ frame: frame(0, 0, 1, 1) })]))).toEqual([]);
  });

  it("counts the layers a round shape cuts off at the rim", () => {
    expect(previewWarnings(layout("circular", [
      // Inside the box, but its corners fall outside the circle.
      layer({ kind: "shape", frame: frame(0.02, 0.02, 0.96, 0.96) }),
    ]))[0]).toBe("1 layer runs under the rim.");
  });

  it("leaves a round shape alone when the layout is inside the rim", () => {
    expect(previewWarnings(layout("circular", [
      layer({ kind: "shape", frame: frame(0.3, 0.3, 0.4, 0.4) }),
    ]))).toEqual([]);
  });

  it("marks a word that cannot fit its layer even shrunk", () => {
    const lines = previewWarnings(layout("circular", [
      text({ frame: frame(0.1, 0.4, 0.3, 0.2), text: "Unbreakable", fontSize: 14, minimumScale: 1 }),
    ]));
    expect(lines.some((l) => l.startsWith("Text is cut short"))).toBe(true);
  });

  it("leaves text that can shrink or wrap alone", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(0.05, 0.3, 0.9, 0.4), text: "Kitchen light", fontSize: 12 }),
    ]))).toEqual([]);
  });

  it("ignores what the shape does not draw", () => {
    expect(previewWarnings(layout("rectangular", [
      text({ frame: frame(1.5, 1.5, 0.8, 0.3), isHidden: true }),
      layer({ kind: "tap", frame: frame(1.5, 1.5, 0.8, 0.3) }),
    ]))).toEqual([]);
  });
});

describe("the selected layer on another shape", () => {
  /** Two layers on Rectangular, then a Small shape seeded from it. */
  function pair(): CustomComplicationConfig {
    const cfg = newConfig("X", 0, ["rectangular"]);
    cfg.elements = [newElement("text"), newElement("icon")];
    normalizeOwnership(cfg, "rectangular");
    addFamily(cfg, "small");
    seedFamilyFromSibling(cfg, "small");
    return cfg;
  }

  it("is the copy in the same place in the stack", () => {
    const cfg = pair();
    const here = ownedElements(cfg, "rectangular");
    const there = ownedElements(cfg, "small");
    expect(twinLayerId(cfg, "rectangular", "small", here[1]!.payload.id)).toBe(there[1]!.payload.id);
  });

  it("is the layer itself on the shape being edited", () => {
    const cfg = pair();
    const id = ownedElements(cfg, "rectangular")[0]!.payload.id;
    expect(twinLayerId(cfg, "rectangular", "rectangular", id)).toBe(id);
  });

  it("is nothing when the two shapes have gone their own ways", () => {
    const cfg = pair();
    const id = ownedElements(cfg, "rectangular")[0]!.payload.id;
    const extra = newElement("shape");
    cfg.elements.push(extra);
    normalizeOwnership(cfg, "small");
    expect(twinLayerId(cfg, "rectangular", "small", id)).toBeUndefined();
  });

  it("is nothing when nothing is selected", () => {
    const cfg = pair();
    expect(twinLayerId(cfg, "rectangular", "small", undefined)).toBeUndefined();
  });
});

describe("how a preview is tinted", () => {
  it("draws a phone's Lock Screen shapes in white", () => {
    expect(previewTintFor("rectangular", true, undefined)).toEqual({ tint: "#FFFFFF", tintSurface: "watch" });
    expect(previewTintFor("circular", true, undefined)).toEqual({ tint: "#FFFFFF", tintSurface: "watch" });
  });

  it("draws a phone's Home Screen tiles in full colour", () => {
    expect(previewTintFor("small", true, undefined)).toEqual({});
  });

  it("leaves a watch's own shapes in full colour", () => {
    expect(previewTintFor("rectangular", false, undefined)).toEqual({});
  });

  it("follows the tint tool when it is on", () => {
    expect(previewTintFor("rectangular", true, "#FF9F0A")).toEqual({ tint: "#FF9F0A", tintSurface: "watch" });
    expect(previewTintFor("medium", false, "#FF9F0A")).toEqual({ tint: "#FF9F0A", tintSurface: "phone" });
  });
});
