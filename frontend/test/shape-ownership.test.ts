// Opening a document written before a layer belonged to one shape.
//
// Until now one layer could be drawn by every shape at once, and most saved
// complications are like that. The editor no longer has a way to show it, so a
// document is split on the way in: each shape gets its own copy of what it was
// drawing. The rule that has to hold is that nothing moves. Whatever each
// shape drew before, it draws after, layer for layer and frame for frame.

import { describe, expect, it } from "vitest";

import { Draft } from "../src/draft.js";
import { addFamily } from "../src/layouts.js";
import {
  type CustomComplicationConfig,
  DRAWABLE_FAMILIES,
  attachTap,
  elementsFor,
  encodeConfig,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  createGroup,
} from "../src/model.js";

/** What one shape actually draws, in draw order: the comparison these tests
 * are all about. Ids are left out, because splitting mints new ones. */
function drawn(cfg: CustomComplicationConfig, family: "rectangular" | "circular" | "corner") {
  return elementsFor(cfg, family)
    .filter((el) => !el.payload.isHidden)
    .map((el) => ({ kind: el.kind, frame: el.payload.frame }));
}

/** A document the way an older panel wrote one: layers with no placement of
 * their own, so every shape draws every one of them. */
function shared(): CustomComplicationConfig {
  const cfg = newConfig("Old", 0, ["rectangular", "circular", "corner"]);
  const a = newElement("text");
  const b = newElement("icon");
  a.payload.frame = { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 };
  b.payload.frame = { x: 0.5, y: 0.5, width: 0.2, height: 0.2, rotationDegrees: 0 };
  cfg.elements = [a, b];
  return cfg;
}

describe("a document whose layers were drawn by every shape", () => {
  it("draws exactly what it drew before", () => {
    const cfg = shared();
    const before = DRAWABLE_FAMILIES.map((f) => drawn(cfg, f as "rectangular"));
    normalizeOwnership(cfg);
    expect(DRAWABLE_FAMILIES.map((f) => drawn(cfg, f as "rectangular"))).toEqual(before);
  });

  it("gives each shape its own copy of them", () => {
    const cfg = shared();
    normalizeOwnership(cfg);
    expect(cfg.elements).toHaveLength(6);
    for (const f of ["rectangular", "circular", "corner"] as const) {
      expect(ownedElements(cfg, f).map((el) => el.kind)).toEqual(["text", "icon"]);
    }
    // Six layers, six ids, no shape pointing at another shape's layer.
    expect(new Set(cfg.elements.map((el) => el.payload.id)).size).toBe(6);
  });

  it("lets each copy be edited without touching the others", () => {
    const cfg = shared();
    normalizeOwnership(cfg);
    const round = ownedElements(cfg, "circular").find((el) => el.kind === "text")!;
    if (round.kind !== "text") return;
    round.payload.value = { kind: { kind: "literal", value: "round only" } };
    const wide = ownedElements(cfg, "rectangular").find((el) => el.kind === "text")!;
    if (wide.kind !== "text") return;
    expect(wide.payload.value).not.toEqual(round.payload.value);
  });

  it("keeps a shape's own frames where the shape already had them", () => {
    const cfg = shared();
    const moved = { x: 0.7, y: 0.7, width: 0.1, height: 0.1, rotationDegrees: 0 };
    cfg.perFamily.circular!.placements[cfg.elements[0]!.payload.id] = { frame: moved, isHidden: false };
    cfg.perFamily.circular!.placements[cfg.elements[1]!.payload.id] = { frame: { ...cfg.elements[1]!.payload.frame }, isHidden: false };
    const before = drawn(cfg, "circular");
    normalizeOwnership(cfg);
    expect(drawn(cfg, "circular")).toEqual(before);
    expect(drawn(cfg, "rectangular")[0]!.frame).not.toEqual(moved);
  });

  it("leaves a layer only one shape drew on that one shape, uncopied", () => {
    const cfg = shared();
    for (const f of ["rectangular", "corner"] as const) {
      cfg.perFamily[f]!.placements[cfg.elements[1]!.payload.id] = { frame: { ...cfg.elements[1]!.payload.frame }, isHidden: true };
      cfg.perFamily[f]!.placements[cfg.elements[0]!.payload.id] = { frame: { ...cfg.elements[0]!.payload.frame }, isHidden: false };
    }
    normalizeOwnership(cfg);
    expect(ownedElements(cfg, "circular").map((el) => el.kind)).toEqual(["text", "icon"]);
    expect(ownedElements(cfg, "rectangular").map((el) => el.kind)).toEqual(["text"]);
    expect(ownedElements(cfg, "corner").map((el) => el.kind)).toEqual(["text"]);
  });

  // A copy is appended, so a shape whose bottom layer was the borrowed one
  // would draw it last, on top of everything. Splitting must not restack.
  it("keeps every shape's stacking", () => {
    const cfg = shared();
    const before = DRAWABLE_FAMILIES.map((f) => drawn(cfg, f as "rectangular").map((d) => d.kind));
    // Only the circular shape draws the icon, so its text has to be copied and
    // has to land under the icon again, where it started.
    for (const f of ["rectangular", "corner"] as const) {
      cfg.perFamily[f]!.placements[cfg.elements[1]!.payload.id] = { frame: { ...cfg.elements[1]!.payload.frame }, isHidden: true };
      cfg.perFamily[f]!.placements[cfg.elements[0]!.payload.id] = { frame: { ...cfg.elements[0]!.payload.frame }, isHidden: false };
    }
    normalizeOwnership(cfg);
    expect(drawn(cfg, "circular").map((d) => d.kind)).toEqual(before[1]);
  });

  it("keeps a layer nothing drew, hidden, on one shape", () => {
    const cfg = shared();
    cfg.elements[1]!.payload.isHidden = true;
    normalizeOwnership(cfg);
    const seats = DRAWABLE_FAMILIES.filter((f) => ownedElements(cfg, f).some((el) => el.kind === "icon"));
    expect(seats).toHaveLength(1);
    expect(drawn(cfg, "rectangular").map((d) => d.kind)).toEqual(["text"]);
  });

  it("splits an attached tap along with its layer, still attached", () => {
    const cfg = shared();
    attachTap(cfg, cfg.elements[1]!.payload.id);
    normalizeOwnership(cfg);
    for (const f of ["rectangular", "circular", "corner"] as const) {
      const mine = ownedElements(cfg, f);
      const icon = mine.find((el) => el.kind === "icon")!;
      const tap = mine.find((el) => el.kind === "tap");
      expect(tap, f).toBeDefined();
      expect((tap!.payload as { attachedTo?: string }).attachedTo, f).toBe(icon.payload.id);
    }
  });

  it("splits a group along with its layers, one group per shape", () => {
    const cfg = shared();
    createGroup(cfg, [cfg.elements[0]!.payload.id, cfg.elements[1]!.payload.id], "Pair");
    normalizeOwnership(cfg);
    expect(cfg.groups).toHaveLength(3);
    for (const f of ["rectangular", "circular", "corner"] as const) {
      const ids = new Set(ownedElements(cfg, f).map((el) => el.payload.groupId));
      expect(ids.size, f).toBe(1);
      expect([...ids][0], f).toBeDefined();
    }
  });

  it("is idempotent, so running it again changes nothing", () => {
    const cfg = shared();
    normalizeOwnership(cfg);
    const once = JSON.stringify(encodeConfig(cfg));
    normalizeOwnership(cfg);
    expect(JSON.stringify(encodeConfig(cfg))).toBe(once);
  });
});

describe("the draft that opens one", () => {
  it("splits on the way in without looking like unsaved work", () => {
    const doc = encodeConfig(shared());
    const draft = Draft.fromDocument(doc, 3);
    expect(draft.dirty).toBe(false);
    expect(draft.config.elements).toHaveLength(6);
  });

  it("puts a layer added afterwards on the shape being edited, and only there", () => {
    const draft = new Draft(shared(), null);
    const fresh = newElement("gauge");
    draft.update((c) => { c.elements.push(fresh); }, undefined, "corner");
    expect(ownedElements(draft.config, "corner").map((el) => el.kind)).toEqual(["text", "icon", "gauge"]);
    expect(ownedElements(draft.config, "circular").map((el) => el.kind)).toEqual(["text", "icon"]);
    // And it is not split into three: an edit never splits.
    expect(draft.config.elements.filter((el) => el.kind === "gauge")).toHaveLength(1);
  });

  it("never splits the same document twice", () => {
    const draft = new Draft(shared(), null);
    draft.update((c) => { c.name = "Renamed"; }, undefined, "rectangular");
    draft.update((c) => { c.name = "Again"; }, undefined, "circular");
    expect(draft.config.elements).toHaveLength(6);
  });
});

describe("a shape a document does not have", () => {
  it("gets nothing, and adding it later still gets nothing", () => {
    const cfg = newConfig("X", 0, ["rectangular"]);
    cfg.elements = [newElement("text")];
    normalizeOwnership(cfg);
    expect(ownedElements(cfg, "rectangular")).toHaveLength(1);
    addFamily(cfg, "corner");
    normalizeOwnership(cfg, "rectangular");
    expect(ownedElements(cfg, "corner")).toHaveLength(0);
    expect(cfg.elements).toHaveLength(1);
  });
});

describe("what the watch reads", () => {
  it("draws nothing a shape does not own, through the layer's own flag", () => {
    const cfg = shared();
    normalizeOwnership(cfg);
    // Every layer's own `isHidden` is true. That is the fallback the watch uses
    // for a shape with no placement for it, so a shape draws its own and no
    // more, with no new key on the wire.
    expect(cfg.elements.every((el) => el.payload.isHidden)).toBe(true);
    for (const f of ["rectangular", "circular", "corner"] as const) {
      const mine = new Set(ownedElements(cfg, f).map((el) => el.payload.id));
      for (const el of elementsFor(cfg, f)) {
        expect(el.payload.isHidden, `${f} ${el.kind}`).toBe(!mine.has(el.payload.id));
      }
    }
  });

  it("survives a round trip through the wire", () => {
    const cfg = shared();
    normalizeOwnership(cfg);
    const back = new Draft(cfg, null).config;
    const doc = encodeConfig(back);
    const reopened = Draft.fromDocument(doc, 1).config;
    for (const f of ["rectangular", "circular", "corner"] as const) {
      expect(ownedElements(reopened, f).map((el) => el.kind), f).toEqual(ownedElements(back, f).map((el) => el.kind));
      expect(drawn(reopened, f), f).toEqual(drawn(back, f));
    }
    expect(reopened.elements).toHaveLength(6);
  });
});
