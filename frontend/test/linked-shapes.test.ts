// A shape can follow another: `FamilyLayout.follows`, editor-only. Following
// is a link, not a copy, so the follower draws the leader's own layers at
// frames refitted for its canvas, and every edit anywhere in the document
// leaves the two in step. These pin the wire key, the four rules that keep a
// link a link, what a sync and a detach do, and what happens when the leader
// goes away.

import { describe, expect, it } from "vitest";

import {
  type CustomComplicationConfig,
  type FamilyKind,
  auditUnknownKeys,
  canFollow,
  canLink,
  detachFamily,
  elementSize,
  encodeConfig,
  followChoices,
  followersOf,
  isFollowing,
  leaderOf,
  newConfig,
  newElement,
  normalizeOwnership,
  ownedElements,
  parseConfig,
  refitPlacement,
  setFollows,
  syncFollowers,
} from "../src/model.js";
import { keepFamilies, removeFamily } from "../src/layouts.js";
import { Draft } from "../src/draft.js";
import { parseImportText } from "../src/transfer.js";
import { effectivePlacement, setPlacement } from "../src/editors.js";

/** Two layers on Rectangular, with Small alongside and nothing on it. */
function twoShapes(families: FamilyKind[] = ["rectangular", "small"]) {
  const cfg = newConfig("X", 0, families);
  const text = newElement("text");
  const icon = newElement("icon");
  text.payload.frame = { x: 0.05, y: 0.1, width: 0.5, height: 0.35, rotationDegrees: 0 };
  icon.payload.frame = { x: 0.6, y: 0.1, width: 0.3, height: 0.3, rotationDegrees: 0 };
  cfg.elements = [text, icon];
  normalizeOwnership(cfg, "rectangular");
  return { cfg, text, icon };
}

/** A shape's placements, keyed the way a reader would look them up. */
const placementsOf = (cfg: CustomComplicationConfig, family: FamilyKind) => cfg.perFamily[family]!.placements;

describe("the follows key on the wire", () => {
  it("round-trips, and absent stays absent", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const encoded = encodeConfig(cfg) as Record<string, unknown>;
    const perFamily = encoded.perFamily as unknown[];
    const small = perFamily[perFamily.indexOf("small") + 1] as Record<string, unknown>;
    const rect = perFamily[perFamily.indexOf("rectangular") + 1] as Record<string, unknown>;
    expect(small.follows).toBe("rectangular");
    expect("follows" in rect).toBe(false);
    expect(parseConfig(encoded).perFamily.small!.follows).toBe("rectangular");
    expect(parseConfig(encoded).perFamily.rectangular!.follows).toBeUndefined();
  });

  it("is a key the audit knows, so a document carrying one still opens", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("ignores a value that is no shape, or a shape no link can join", () => {
    const { cfg } = twoShapes();
    const encoded = encodeConfig(cfg) as Record<string, unknown>;
    const perFamily = encoded.perFamily as unknown[];
    const small = perFamily[perFamily.indexOf("small") + 1] as Record<string, unknown>;
    small.follows = "sideways";
    expect(parseConfig(encoded).perFamily.small!.follows).toBeUndefined();
    small.follows = "corner";
    expect(parseConfig(encoded).perFamily.small!.follows).toBeUndefined();
  });
});

describe("the rules a link has to keep", () => {
  it("never joins the corner or inline, whose content is not an arrangement", () => {
    expect(canLink("corner")).toBe(false);
    expect(canLink("inline")).toBe(false);
    expect(canLink("rectangular")).toBe(true);
    const { cfg } = twoShapes(["rectangular", "corner", "small"]);
    expect(canFollow(cfg, "corner", "rectangular")).toBe(false);
    expect(canFollow(cfg, "small", "corner")).toBe(false);
    expect(followChoices(cfg, "small")).toEqual(["rectangular"]);
  });

  it("refuses a shape following itself", () => {
    const { cfg } = twoShapes();
    expect(canFollow(cfg, "small", "small")).toBe(false);
    setFollows(cfg, "small", "small");
    expect(leaderOf(cfg, "small")).toBeUndefined();
  });

  it("refuses a chain: a leader that follows, and a shape that is followed", () => {
    const { cfg } = twoShapes(["rectangular", "circular", "small"]);
    setFollows(cfg, "small", "rectangular");
    // Rectangular leads already, so it may not start following Circular.
    expect(canFollow(cfg, "rectangular", "circular")).toBe(false);
    // Small follows already, so nothing may point at it.
    expect(canFollow(cfg, "circular", "small")).toBe(false);
    expect(followChoices(cfg, "circular")).toEqual(["rectangular"]);
  });

  it("holds a shape to one leader", () => {
    const { cfg } = twoShapes(["rectangular", "circular", "small"]);
    setFollows(cfg, "small", "rectangular");
    setFollows(cfg, "small", "circular");
    expect(leaderOf(cfg, "small")).toBe("circular");
    expect(followersOf(cfg, "rectangular")).toEqual([]);
    expect(followersOf(cfg, "circular")).toEqual(["small"]);
  });

  it("refuses a leader the document does not have", () => {
    const { cfg } = twoShapes();
    expect(canFollow(cfg, "small", "large")).toBe(false);
    setFollows(cfg, "small", "large");
    expect(cfg.perFamily.small!.follows).toBeUndefined();
  });
});

describe("what a link draws", () => {
  it("puts every one of the leader's layers on the follower, refitted", () => {
    const { cfg, text, icon } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const from = placementsOf(cfg, "rectangular");
    const to = placementsOf(cfg, "small");
    expect(Object.keys(to).sort()).toEqual(Object.keys(from).sort());
    for (const el of [text, icon]) {
      const id = el.payload.id;
      const base = { ...from[id]!, size: from[id]!.size ?? elementSize(el) };
      expect(to[id]).toEqual(refitPlacement(base, "rectangular", "small", el.kind));
    }
  });

  it("leaves the follower its own background, border and rules", () => {
    const { cfg } = twoShapes();
    cfg.perFamily.small!.backgroundColorHex = "#101820";
    cfg.perFamily.small!.borderWidth = 4;
    setFollows(cfg, "small", "rectangular");
    syncFollowers(cfg);
    expect(cfg.perFamily.small!.backgroundColorHex).toBe("#101820");
    expect(cfg.perFamily.small!.borderWidth).toBe(4);
  });

  it("owns none of the layers it draws, so the leader stays the one owner", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    expect(isFollowing(cfg, "small")).toBe(true);
    expect(ownedElements(cfg, "small")).toEqual([]);
    expect(ownedElements(cfg, "rectangular")).toHaveLength(2);
    // Settling the document has to leave the mirror alone: counting it would
    // give every one of those layers a second owner.
    normalizeOwnership(cfg, "rectangular");
    expect(Object.keys(placementsOf(cfg, "small"))).toHaveLength(2);
    expect(ownedElements(cfg, "rectangular")).toHaveLength(2);
  });

  it("drops the layers the follower had of its own", () => {
    const { cfg } = twoShapes();
    const own = newElement("shape");
    cfg.elements.push(own);
    normalizeOwnership(cfg, "small");
    expect(ownedElements(cfg, "small")).toHaveLength(1);
    setFollows(cfg, "small", "rectangular");
    expect(cfg.elements.some((el) => el.payload.id === own.payload.id)).toBe(false);
  });
});

describe("staying in step", () => {
  it("follows a leader's move through the draft's one commit point", () => {
    const { cfg, text } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const draft = new Draft(cfg, null);
    const moved = { x: 0.4, y: 0.6, width: 0.2, height: 0.2, rotationDegrees: 0 };
    draft.update((c) => setPlacement(c, "rectangular", text.payload.id, { frame: moved }), undefined, "rectangular");
    const after = placementsOf(draft.config, "small")[text.payload.id]!;
    expect(after.frame).toEqual(moved);
  });

  it("picks up a layer added to the leader, and loses one deleted from it", () => {
    const { cfg, text } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const added = newElement("icon");
    cfg.elements.push(added);
    normalizeOwnership(cfg, "rectangular");
    syncFollowers(cfg);
    expect(Object.keys(placementsOf(cfg, "small"))).toHaveLength(3);
    cfg.elements = cfg.elements.filter((el) => el.payload.id !== text.payload.id);
    delete placementsOf(cfg, "rectangular")[text.payload.id];
    syncFollowers(cfg);
    expect(Object.keys(placementsOf(cfg, "small"))).toHaveLength(2);
    expect(placementsOf(cfg, "small")[text.payload.id]).toBeUndefined();
  });

  it("puts a document that arrives out of step right on open", () => {
    const { cfg, text } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    // A hand-edit: the follower's frame no longer says what the leader says.
    placementsOf(cfg, "small")[text.payload.id]!.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    const draft = Draft.fromDocument(encodeConfig(cfg), 1);
    expect(placementsOf(draft.config, "small")[text.payload.id]!.frame.width).toBe(0.5);
    // Healing rides along with the next real save rather than nagging.
    expect(draft.dirty).toBe(false);
  });
});

describe("detach", () => {
  it("keeps the frames it was drawing and clears the key", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const before = structuredClone(placementsOf(cfg, "small"));
    detachFamily(cfg, "small");
    expect(cfg.perFamily.small!.follows).toBeUndefined();
    expect(isFollowing(cfg, "small")).toBe(false);
    const after = placementsOf(cfg, "small");
    expect(Object.values(after).map((p) => p.frame)).toEqual(Object.values(before).map((p) => p.frame));
    expect(Object.values(after).map((p) => p.size)).toEqual(Object.values(before).map((p) => p.size));
  });

  it("leaves the shape layers of its own, so the leader can move without it", () => {
    const { cfg, text } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    detachFamily(cfg, "small");
    const own = ownedElements(cfg, "small");
    expect(own).toHaveLength(2);
    expect(own.map((el) => el.payload.id)).not.toContain(text.payload.id);
    const frozen = { ...effectivePlacement(cfg, "small", own[0]!).frame };
    setPlacement(cfg, "rectangular", text.payload.id, { frame: { x: 0.9, y: 0.9, width: 0.05, height: 0.05, rotationDegrees: 0 } });
    syncFollowers(cfg);
    expect(effectivePlacement(cfg, "small", own[0]!).frame).toEqual(frozen);
  });

  it("is one undo step", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const draft = new Draft(cfg, null);
    draft.update((c) => detachFamily(c, "small"));
    expect(draft.config.perFamily.small!.follows).toBeUndefined();
    draft.undo();
    expect(draft.config.perFamily.small!.follows).toBe("rectangular");
    expect(draft.canUndo).toBe(false);
  });
});

describe("a leader that goes away", () => {
  it("detaches its followers rather than leaving a link to nothing", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    cfg.supportedFamilies = ["small"];
    expect(leaderOf(cfg, "small")).toBeUndefined();
    syncFollowers(cfg);
    expect(cfg.perFamily.small!.follows).toBeUndefined();
  });

  it("detaches when the leader has no layout at all", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    delete cfg.perFamily.rectangular;
    syncFollowers(cfg);
    expect(cfg.perFamily.small!.follows).toBeUndefined();
  });

  it("hands the follower a copy before removing the shape, so nothing blanks", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    removeFamily(cfg, "rectangular");
    expect(cfg.perFamily.small!.follows).toBeUndefined();
    expect(ownedElements(cfg, "small")).toHaveLength(2);
  });
});

describe("share and import", () => {
  it("sends a real copy when only the follower is shared", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const only = keepFamilies(cfg, ["small"]);
    expect(only.perFamily.small!.follows).toBeUndefined();
    expect(ownedElements(only, "small")).toHaveLength(2);
  });

  it("carries the key through an export and back", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const parsed = parseImportText(JSON.stringify(encodeConfig(cfg)), 7);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.config.perFamily.small!.follows).toBe("rectangular");
    expect(leaderOf(parsed.config, "small")).toBe("rectangular");
  });

  it("drops the key when the leader is not one of the shapes that arrived", () => {
    const { cfg } = twoShapes();
    setFollows(cfg, "small", "rectangular");
    const document = encodeConfig(cfg) as Record<string, unknown>;
    // The kind of document the Share dialog makes when only Small is sent: the
    // layout is copied whole, `follows` and all, and names a shape that is gone.
    document.supportedFamilies = ["small"];
    const parsed = parseImportText(JSON.stringify(document), 7);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    // The key survives the parse, because parsing is not the place that judges
    // it, and is gone by the time the draft holds the document.
    const draft = new Draft(parsed.config, null);
    expect(draft.config.perFamily.small!.follows).toBeUndefined();
    expect(Object.keys(placementsOf(draft.config, "small"))).toHaveLength(2);
  });
});
