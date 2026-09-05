// Attached taps: a tap layer that belongs to a drawing layer instead of
// standing on its own. The editor never lines one up by hand, so everything
// here is about syncAttachedTaps keeping the two in step after any edit.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type TapElement,
  attachTap,
  attachedTapsOf,
  auditUnknownKeys,
  defaultAttachedTapAction,
  detachTaps,
  duplicateElement,
  elementEntity,
  encodeConfig,
  isAttachedTap,
  newConfig,
  newElement,
  parseConfig,
  removeElement,
  selectableLayerId,
  syncAttachedTaps,
  setTapOutsetFromFrame,
  tapPointSize,
} from "../src/model.js";
import { setPlacement } from "../src/editors.js";
import { Draft } from "../src/draft.js";
import { nothing } from "lit";
import { renderLayout, type IconProvider, type RenderOptions } from "../src/renderer.js";
import { resolveAll } from "../src/resolver.js";

/** A config with one icon layer bound to `entityId`, and its id. */
function withIcon(entityId = "light.kitchen"): { cfg: CustomComplicationConfig; icon: CElement } {
  const cfg = newConfig("Test", 0);
  const icon = newElement("icon");
  if (icon.kind === "icon" && entityId !== "") {
    icon.payload.symbol = { kind: { kind: "entityState", entityId, displayName: "Kitchen", domain: entityId.split(".")[0]! } };
  }
  icon.payload.frame = { x: 0.1, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 };
  cfg.elements.push(icon);
  return { cfg, icon };
}

function tapOf(cfg: CustomComplicationConfig, ownerId: string): TapElement {
  const tap = attachedTapsOf(cfg, ownerId)[0];
  expect(tap, "the owner has an attached tap").toBeDefined();
  return tap!.payload as TapElement;
}

describe("attachTap", () => {
  it("defaults to toggling the layer's own entity when the domain allows it", () => {
    const { cfg, icon } = withIcon("light.kitchen");
    const tap = attachTap(cfg, icon.payload.id)!;
    expect(tap.action).toEqual({ type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" });
    expect(tap.attachedTo).toBe(icon.payload.id);
  });

  it("falls back to the plain tap-layer default for anything else", () => {
    const { cfg, icon } = withIcon("sensor.temperature");
    expect(attachTap(cfg, icon.payload.id)!.action).toEqual({ type: "refresh" });

    const bare = withIcon("");
    expect(attachTap(bare.cfg, bare.icon.payload.id)!.action).toEqual({ type: "refresh" });
  });

  it("reads the entity through a named value", () => {
    const { cfg, icon } = withIcon("");
    cfg.values.push({ id: "AAAAAAAA-0000-4000-8000-00000000000A", name: "Lamp", value: { kind: { kind: "entityState", entityId: "switch.lamp", displayName: "Lamp", domain: "switch" } } });
    if (icon.kind === "icon") icon.payload.symbol = { kind: { kind: "named", id: "AAAAAAAA-0000-4000-8000-00000000000A" } };
    expect(elementEntity(cfg, icon)?.entityId).toBe("switch.lamp");
    expect(defaultAttachedTapAction(cfg, icon).type).toBe("toggleEntity");
  });

  it("is idempotent: a second tick returns the tap that is already there", () => {
    const { cfg, icon } = withIcon();
    const first = attachTap(cfg, icon.payload.id)!;
    first.action = { type: "openApp" };
    const second = attachTap(cfg, icon.payload.id)!;
    expect(second.id).toBe(first.id);
    expect(second.action).toEqual({ type: "openApp" });
    expect(cfg.elements.filter((e) => e.kind === "tap")).toHaveLength(1);
  });

  it("refuses a tap layer and an unknown id", () => {
    const { cfg } = withIcon();
    const free = newElement("tap");
    cfg.elements.push(free);
    expect(attachTap(cfg, free.payload.id)).toBeUndefined();
    expect(attachTap(cfg, "NOT-AN-ELEMENT")).toBeUndefined();
  });
});

describe("syncAttachedTaps", () => {
  it("follows the owner's frame and hidden state", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    expect(tapOf(cfg, icon.payload.id).frame).toEqual(icon.payload.frame);

    icon.payload.frame = { x: 0.5, y: 0.6, width: 0.2, height: 0.2, rotationDegrees: 30 };
    icon.payload.isHidden = true;
    syncAttachedTaps(cfg);
    const tap = tapOf(cfg, icon.payload.id);
    expect(tap.frame).toEqual(icon.payload.frame);
    expect(tap.isHidden).toBe(true);
    // A copy, not the same object: editing one must not silently edit the other.
    expect(tap.frame).not.toBe(icon.payload.frame);
  });

  it("follows every per-family placement, and lets go when the owner does", () => {
    const { cfg, icon } = withIcon();
    const ownerId = icon.payload.id;
    attachTap(cfg, ownerId);
    const tapId = tapOf(cfg, ownerId).id;

    setPlacement(cfg, "circular", ownerId, { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }, isHidden: true });
    syncAttachedTaps(cfg);
    expect(cfg.perFamily.circular!.placements[tapId]).toEqual({ frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }, isHidden: true });
    // Rectangular was never touched, so both fall back to the shared frame.
    expect(cfg.perFamily.rectangular!.placements[tapId]).toBeUndefined();

    delete cfg.perFamily.circular!.placements[ownerId];
    syncAttachedTaps(cfg);
    expect(cfg.perFamily.circular!.placements[tapId]).toBeUndefined();
  });

  it("keeps the tap directly above its owner, wherever the owner moves", () => {
    const { cfg, icon } = withIcon();
    const text = newElement("text");
    cfg.elements.push(text);
    attachTap(cfg, icon.payload.id);
    const tapId = tapOf(cfg, icon.payload.id).id;
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([icon.payload.id, tapId, text.payload.id]);

    // Send the owner to the back of the list; the tap goes with it.
    cfg.elements = [text, ...cfg.elements.filter((e) => e.payload.id !== text.payload.id)];
    syncAttachedTaps(cfg);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([text.payload.id, icon.payload.id, tapId]);
  });

  it("frees an orphan instead of dropping it", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const tapId = tapOf(cfg, icon.payload.id).id;
    cfg.elements = cfg.elements.filter((e) => e.payload.id !== icon.payload.id);
    syncAttachedTaps(cfg);
    const tap = cfg.elements.find((e) => e.payload.id === tapId);
    expect(tap, "the tap survives as a free-standing layer").toBeDefined();
    expect((tap!.payload as TapElement).attachedTo).toBeUndefined();
    expect(isAttachedTap(cfg, tap!)).toBe(false);
  });

  it("frees a tap that points at another tap, or at itself", () => {
    const cfg = newConfig("Test", 0);
    const a = newElement("tap");
    const b = newElement("tap");
    (b.payload as TapElement).attachedTo = a.payload.id;
    (a.payload as TapElement).attachedTo = a.payload.id;
    cfg.elements.push(a, b);
    syncAttachedTaps(cfg);
    expect((a.payload as TapElement).attachedTo).toBeUndefined();
    expect((b.payload as TapElement).attachedTo).toBeUndefined();
  });

  it("is idempotent", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    setPlacement(cfg, "corner", icon.payload.id, { frame: { x: 0.2, y: 0.2, width: 0.6, height: 0.6, rotationDegrees: 0 } });
    syncAttachedTaps(cfg);
    const once = JSON.stringify(encodeConfig(cfg));
    syncAttachedTaps(cfg);
    syncAttachedTaps(cfg);
    expect(JSON.stringify(encodeConfig(cfg))).toBe(once);
  });

  it("leaves free-standing taps exactly where they are", () => {
    const cfg = newConfig("Test", 0);
    const free = newElement("tap");
    const text = newElement("text");
    cfg.elements.push(free, text);
    const before = JSON.stringify(encodeConfig(cfg));
    syncAttachedTaps(cfg);
    expect(JSON.stringify(encodeConfig(cfg))).toBe(before);
  });
});

// Pushing the area out past its layer is the whole point of the feature: a
// 20 pt icon is a hard target on a wrist. The three design boxes are different
// sizes, so the same point value has to become a different fraction in each
// shape. The outset is editor state read back from the frames, so the wire
// carries nothing new and a round trip through the watch loses nothing.
describe("outset", () => {
  /** An icon in the middle, small enough that pushing it out never hits an edge. */
  function withSmallIcon(): { cfg: CustomComplicationConfig; icon: CElement; tapId: string } {
    const { cfg, icon } = withIcon();
    icon.payload.frame = { x: 0.4, y: 0.4, width: 0.2, height: 0.2, rotationDegrees: 0 };
    attachTap(cfg, icon.payload.id);
    syncAttachedTaps(cfg);
    return { cfg, icon, tapId: tapOf(cfg, icon.payload.id).id };
  }

  /** The same points on every side, the shape the old `grow` slider made. */
  function outsetAll(cfg: CustomComplicationConfig, ownerId: string, pt: number): void {
    tapOf(cfg, ownerId).outset = { top: pt, left: pt, bottom: pt, right: pt };
    syncAttachedTaps(cfg);
  }

  it("turns points into the right fraction for each shape", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    outsetAll(cfg, icon.payload.id, 8);

    const rect = cfg.perFamily.rectangular!.placements[tapId]!.frame;
    expect(rect.x).toBeCloseTo(0.4 - 8 / 181, 9);
    expect(rect.width).toBeCloseTo(0.2 + 16 / 181, 9);
    expect(rect.y).toBeCloseTo(0.4 - 8 / 65.5, 9);
    expect(rect.height).toBeCloseTo(0.2 + 16 / 65.5, 9);

    // A square box grows by the same fraction on both axes.
    const circ = cfg.perFamily.circular!.placements[tapId]!.frame;
    expect(circ.x).toBeCloseTo(0.4 - 8 / 51, 9);
    expect(circ.y).toBeCloseTo(0.4 - 8 / 51, 9);
    expect(circ.width).toBeCloseTo(0.2 + 16 / 51, 9);
    expect(circ.height).toBeCloseTo(circ.width, 9);
  });

  it("applies each side on its own", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    tapOf(cfg, icon.payload.id).outset = { top: 0, left: 10, bottom: 5, right: 0 };
    syncAttachedTaps(cfg);
    const circ = cfg.perFamily.circular!.placements[tapId]!.frame;
    expect(circ.x).toBeCloseTo(0.4 - 10 / 51, 9);
    expect(circ.width).toBeCloseTo(0.2 + 10 / 51, 9);
    expect(circ.y).toBeCloseTo(0.4, 9);
    expect(circ.height).toBeCloseTo(0.2 + 5 / 51, 9);
  });

  it("writes a placement in every shape, even where the owner has none", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    expect(cfg.perFamily.corner!.placements[tapId], "nothing to override yet").toBeUndefined();
    outsetAll(cfg, icon.payload.id, 4);
    // The shared frame would be pushed out by the rectangular ratio, which is
    // the wrong size here, so the tap needs its own frame in every shape.
    for (const family of ["rectangular", "circular", "corner"] as const) {
      expect(cfg.perFamily[family]!.placements[tapId], family).toBeDefined();
    }
  });

  it("pushes out from the owner's own placement where it has one", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    setPlacement(cfg, "corner", icon.payload.id, { frame: { x: 0.3, y: 0.3, width: 0.4, height: 0.4, rotationDegrees: 0 }, isHidden: true });
    outsetAll(cfg, icon.payload.id, 3);
    const p = cfg.perFamily.corner!.placements[tapId]!;
    expect(p.frame.x).toBeCloseTo(0.3 - 3 / 34, 9);
    expect(p.frame.width).toBeCloseTo(0.4 + 6 / 34, 9);
    expect(p.isHidden).toBe(true);
  });

  it("stops at the edge of the face instead of leaving it", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    outsetAll(cfg, icon.payload.id, 20);
    const corner = cfg.perFamily.corner!.placements[tapId]!.frame;
    expect(corner).toEqual({ x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
  });

  it("keeps the owner's rotation", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    icon.payload.frame = { ...icon.payload.frame, rotationDegrees: 30 };
    outsetAll(cfg, icon.payload.id, 5);
    expect(cfg.perFamily.circular!.placements[tapId]!.frame.rotationDegrees).toBe(30);
  });

  it("adds no placements at zero, and never writes a key", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    outsetAll(cfg, icon.payload.id, 8);
    outsetAll(cfg, icon.payload.id, 0);
    expect(cfg.perFamily.corner!.placements[tapId]).toBeUndefined();
    expect(tapOf(cfg, icon.payload.id).frame).toEqual(icon.payload.frame);
    expect(JSON.stringify(encodeConfig(cfg))).not.toContain("outset");
    expect(JSON.stringify(encodeConfig(cfg))).not.toContain("grow");
  });

  it("is read back from the frames on the way in, so a round trip keeps the size", () => {
    const { cfg, icon } = withSmallIcon();
    tapOf(cfg, icon.payload.id).outset = { top: 2, left: 8, bottom: 4, right: 6 };
    syncAttachedTaps(cfg);
    const enc = encodeConfig(cfg);
    expect(auditUnknownKeys(enc)).toEqual([]);
    expect(JSON.stringify(enc)).not.toContain("outset");
    const back = parseConfig(enc);
    expect(tapOf(back, icon.payload.id).outset).toBeUndefined();
    syncAttachedTaps(back);
    expect(tapOf(back, icon.payload.id).outset).toEqual({ top: 2, left: 8, bottom: 4, right: 6 });
    expect(encodeConfig(back)).toEqual(enc);
  });

  it("still opens a document that carries the retired grow key, and drops it on save", () => {
    const { cfg, icon } = withSmallIcon();
    outsetAll(cfg, icon.payload.id, 8);
    const enc = encodeConfig(cfg) as { elements: { kind: string; payload: Record<string, unknown> }[] };
    enc.elements.find((e) => e.kind === "tap")!.payload.grow = 8;
    expect(auditUnknownKeys(enc)).toEqual([]);
    const back = parseConfig(enc);
    syncAttachedTaps(back);
    // The frames carried the result, so the size is the one the slider made.
    expect(tapOf(back, icon.payload.id).outset).toEqual({ top: 8, left: 8, bottom: 8, right: 8 });
    expect(JSON.stringify(encodeConfig(back))).not.toContain("grow");
  });

  it("takes a dragged frame in one shape and applies the points everywhere", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    // Dragged out 6 pt on the left and 3 pt below in the circular preview.
    setTapOutsetFromFrame(cfg, tapId, "circular", { x: 0.4 - 6 / 51, y: 0.4, width: 0.2 + 6 / 51, height: 0.2 + 3 / 51, rotationDegrees: 0 });
    expect(tapOf(cfg, icon.payload.id).outset).toEqual({ top: 0, left: 6, bottom: 3, right: 0 });
    syncAttachedTaps(cfg);
    const rect = cfg.perFamily.rectangular!.placements[tapId]!.frame;
    expect(rect.x).toBeCloseTo(0.4 - 6 / 181, 9);
    expect(rect.height).toBeCloseTo(0.2 + 3 / 65.5, 9);
  });

  it("holds a dragged frame inside the face before measuring it", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    setTapOutsetFromFrame(cfg, tapId, "corner", { x: -0.5, y: 0.4, width: 1.6, height: 0.2, rotationDegrees: 0 });
    // Left edge held at 0: 0.4 of 34 pt. Right edge held at 1: same.
    expect(tapOf(cfg, icon.payload.id).outset).toEqual({ top: 0, left: 13.6, bottom: 0, right: 13.6 });
  });

  it("ignores a frame for a tap that is not attached", () => {
    const { cfg } = withSmallIcon();
    const free = newElement("tap");
    cfg.elements.push(free);
    setTapOutsetFromFrame(cfg, free.payload.id, "circular", { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 });
    expect((free.payload as TapElement).outset).toBeUndefined();
  });

  it("reports the tap's real size in points, per shape", () => {
    const { cfg, icon, tapId } = withSmallIcon();
    // 0.2 of 181 x 65.5 is a wide, short target; the corner box makes it square.
    expect(tapPointSize(cfg, tapId, "rectangular")!.width).toBeCloseTo(0.2 * 181, 9);
    expect(tapPointSize(cfg, tapId, "corner")!.height).toBeCloseTo(0.2 * 34, 9);

    outsetAll(cfg, icon.payload.id, 6);
    expect(tapPointSize(cfg, tapId, "corner")!.width).toBeCloseTo(0.2 * 34 + 12, 9);
    expect(tapPointSize(cfg, "gone", "corner")).toBeUndefined();
  });
});

describe("removeElement and duplicateElement", () => {
  it("deleting the owner takes its tap and both placements", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    setPlacement(cfg, "circular", icon.payload.id, { isHidden: true });
    syncAttachedTaps(cfg);
    removeElement(cfg, icon.payload.id);
    expect(cfg.elements).toHaveLength(0);
    expect(Object.keys(cfg.perFamily.circular!.placements)).toEqual([]);
  });

  it("detachTaps leaves the layer alone", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    detachTaps(cfg, icon.payload.id);
    expect(cfg.elements.map((e) => e.kind)).toEqual(["icon"]);
  });

  it("duplicating the owner duplicates and re-attaches the tap", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const copyId = duplicateElement(cfg, icon.payload.id)!;
    expect(cfg.elements).toHaveLength(4);
    const copyTap = tapOf(cfg, copyId);
    expect(copyTap.id).not.toBe(tapOf(cfg, icon.payload.id).id);
    expect(copyTap.action).toEqual(tapOf(cfg, icon.payload.id).action);
    // The copy is nudged, and its tap sits on the copy rather than the original.
    const copy = cfg.elements.find((e) => e.payload.id === copyId)!;
    expect(copyTap.frame).toEqual(copy.payload.frame);
    expect(copyTap.frame.x).toBeCloseTo(icon.payload.frame.x + 0.05, 9);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([icon.payload.id, tapOf(cfg, icon.payload.id).id, copyId, copyTap.id]);
  });
});

describe("attachedTo on the wire", () => {
  it("is written only when set, and survives a round trip", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const enc = encodeConfig(cfg) as { elements: { kind: string; payload: Record<string, unknown> }[] };
    const tapPayload = enc.elements.find((e) => e.kind === "tap")!.payload;
    expect(tapPayload.attachedTo).toBe(icon.payload.id);
    expect(auditUnknownKeys(enc)).toEqual([]);
    expect(encodeConfig(parseConfig(enc))).toEqual(enc);

    const back = parseConfig(enc).elements.find((e) => e.kind === "tap")!;
    expect((back.payload as TapElement).attachedTo).toBe(icon.payload.id);

    // A free-standing tap never mentions the key, so an old watch build sees a
    // byte-identical document.
    const plain = newConfig("Y", 1);
    plain.elements = [newElement("tap")];
    expect(JSON.stringify(encodeConfig(plain))).not.toContain("attachedTo");
  });

  it("uppercases the owner id on the way in, like every other id", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const enc = encodeConfig(cfg) as { elements: { kind: string; payload: Record<string, unknown> }[] };
    const tapPayload = enc.elements.find((e) => e.kind === "tap")!.payload;
    tapPayload.attachedTo = String(tapPayload.attachedTo).toLowerCase();
    const back = parseConfig(enc);
    const tap = back.elements.find((e) => e.kind === "tap")!;
    expect((tap.payload as TapElement).attachedTo).toBe(icon.payload.id);
    expect(isAttachedTap(back, tap)).toBe(true);
  });
});

describe("Draft", () => {
  it("re-glues the tap after every mutation, and undo puts it back", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const draft = new Draft(cfg, null);
    expect(draft.dirty).toBe(false);

    draft.update((c) => {
      const el = c.elements.find((e) => e.payload.id === icon.payload.id)!;
      el.payload.frame = { ...el.payload.frame, x: 0.75 };
    });
    expect(tapOf(draft.config, icon.payload.id).frame.x).toBe(0.75);

    draft.update((c) => detachTaps(c, icon.payload.id));
    expect(attachedTapsOf(draft.config, icon.payload.id)).toHaveLength(0);
    draft.undo();
    expect(tapOf(draft.config, icon.payload.id).frame.x).toBe(0.75);
  });

  it("keeps a tap that sits off its owner, as an outset, and still heals its order", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const doc = encodeConfig(cfg) as { elements: { kind: string; payload: Record<string, unknown> }[] };
    // A tap bigger than its owner and behind it in z-order. The size is what
    // an author drags out, and the wire carries only the frames, so it has to
    // be taken as meant; the order is not a thing anyone sets, so it is fixed.
    const tapIndex = doc.elements.findIndex((e) => e.kind === "tap");
    const [tapEl] = doc.elements.splice(tapIndex, 1);
    tapEl!.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    doc.elements.unshift(tapEl!);

    const draft = Draft.fromDocument(doc, 1);
    expect(draft.dirty, "healing on open never looks like unsaved work").toBe(false);
    expect(draft.config.elements.map((e) => e.kind)).toEqual(["icon", "tap"]);
    const tap = tapOf(draft.config, icon.payload.id);
    // The points are kept to 0.01, so the frame comes back within float noise.
    expect(tap.frame.x).toBeCloseTo(0, 9);
    expect(tap.frame.y).toBeCloseTo(0, 9);
    expect(tap.frame.width).toBeCloseTo(1, 9);
    expect(tap.frame.height).toBeCloseTo(1, 9);
    expect(tap.outset).toEqual({ left: 18.1, right: 108.6, top: 13.1, bottom: 26.2 });
    // And from here on it follows the owner: a nudge moves the tap with it.
    draft.update((c) => { c.elements[0]!.payload.frame = { ...c.elements[0]!.payload.frame, x: 0.2 }; });
    expect(tapOf(draft.config, icon.payload.id).frame.x).toBeCloseTo(0.2 - 18.1 / 181, 9);
  });
});

// The preview hit test both a drag and pick mode go through: a hit on an
// attached tap has to answer with the layer the author can see there.
describe("selectableLayerId", () => {
  it("sends an attached tap's hit to its owner", () => {
    const { cfg, icon } = withIcon();
    const tap = attachTap(cfg, icon.payload.id)!;
    expect(selectableLayerId(cfg, tap.id)).toBe(icon.payload.id);
    expect(selectableLayerId(cfg, icon.payload.id)).toBe(icon.payload.id);
  });

  it("keeps a free-standing tap as itself", () => {
    const cfg = newConfig("Test", 0);
    const tap = newElement("tap");
    cfg.elements.push(tap);
    expect(selectableLayerId(cfg, tap.payload.id)).toBe(tap.payload.id);
  });

  it("answers undefined for an id the document does not have", () => {
    expect(selectableLayerId(newConfig("Test", 0), "gone")).toBeUndefined();
  });
});

// ── Review mode ───────────────────────────────────────────────────────────
//
// An attached tap is invisible during normal editing on purpose: its box sits
// on the layer and says nothing new. That is also why the Tappable checkbox was
// missable, and why review mode exists. These tests read the rendered SVG as
// plain text, which is enough to answer "is this box here, and what does it
// say?" without a DOM.

/** Flattens a lit template tree to plain text. */
function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

/** The rectangular face as text, with the given render options. */
function draw(cfg: CustomComplicationConfig, opts: Partial<RenderOptions> = {}): string {
  const layouts = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values });
  return flatten(renderLayout(layouts.rectangular!, { icons: noIcons, showHidden: true, tapAreas: true, ...opts }));
}

describe("tap review mode", () => {
  it("hides an attached tap normally and shows it in review mode", () => {
    const { cfg, icon } = withIcon();
    const tap = attachTap(cfg, icon.payload.id)!;
    expect(draw(cfg)).not.toContain(tap.id);
    expect(draw(cfg, { tapReview: true })).toContain(tap.id);
  });

  it("labels a tap box with what the tap does", () => {
    const { cfg, icon } = withIcon("light.kitchen");
    icon.payload.frame = { x: 0.05, y: 0.2, width: 0.6, height: 0.4, rotationDegrees: 0 };
    attachTap(cfg, icon.payload.id);
    syncAttachedTaps(cfg);
    expect(draw(cfg, { tapReview: true })).toContain("Toggle an entity: Kitchen");
    expect(draw(cfg)).not.toContain("Toggle an entity");
  });

  it("trims a label that does not fit rather than spilling out of the box", () => {
    const { cfg, icon } = withIcon("light.kitchen");
    // 0.3 of the 181 pt box is 54 pt: room for some of the label, not all.
    attachTap(cfg, icon.payload.id);
    const review = draw(cfg, { tapReview: true });
    expect(review).toContain("Toggle an entity:…");
    expect(review).not.toContain("Kitchen");
  });

  it("keeps the glyph instead of a label when the box is too small", () => {
    const { cfg, icon } = withIcon("light.kitchen");
    icon.payload.frame = { x: 0.1, y: 0.1, width: 0.04, height: 0.04, rotationDegrees: 0 };
    attachTap(cfg, icon.payload.id);
    syncAttachedTaps(cfg);
    expect(draw(cfg, { tapReview: true })).not.toContain("Toggle an entity");
  });

  it("dims the drawing layers and leaves the tap boxes bright", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const review = draw(cfg, { tapReview: true });
    // 0.35 is the dim factor, applied to the icon's own opacity of 1.
    expect(review).toContain(`data-element-id=${icon.payload.id} opacity=0.35`);
    expect(review).toContain(`data-element-id=${tapOf(cfg, icon.payload.id).id} opacity=1`);
    expect(draw(cfg)).toContain(`data-element-id=${icon.payload.id} opacity=1`);
  });

  it("still draws a free-standing tap in both modes", () => {
    const cfg = newConfig("Test", 0);
    const tap = newElement("tap");
    cfg.elements.push(tap);
    expect(draw(cfg)).toContain(tap.payload.id);
    expect(draw(cfg, { tapReview: true })).toContain(tap.payload.id);
  });

  it("shows taps even when the caller did not ask for tap areas", () => {
    const cfg = newConfig("Test", 0);
    const tap = newElement("tap");
    cfg.elements.push(tap);
    expect(draw(cfg, { tapAreas: false })).not.toContain(tap.payload.id);
    expect(draw(cfg, { tapAreas: false, tapReview: true })).toContain(tap.payload.id);
  });
});

// Review mode narrowed to one tap: the box the author is sizing is the only
// tap on the face, and it carries the handles a selected layer would.
describe("tap focus view", () => {
  /** Two tappable icons, so there is a tap to hide as well as one to show. */
  function withTwoTaps(): { cfg: CustomComplicationConfig; a: string; b: string } {
    const { cfg, icon } = withIcon("light.kitchen");
    const other = newElement("icon");
    other.payload.frame = { x: 0.6, y: 0.2, width: 0.3, height: 0.4, rotationDegrees: 0 };
    cfg.elements.push(other);
    const a = attachTap(cfg, icon.payload.id)!.id;
    const b = attachTap(cfg, other.payload.id)!.id;
    syncAttachedTaps(cfg);
    return { cfg, a, b };
  }

  it("draws only the focused tap, with its handles", () => {
    const { cfg, a, b } = withTwoTaps();
    const out = draw(cfg, { tapReview: true, tapFocusId: a, highlightId: a, handles: true });
    expect(out).toContain(a);
    expect(out).not.toContain(b);
    expect(out).toContain("data-handle=se");
  });

  it("gives no handles and no move cursor to the dimmed layers", () => {
    const { cfg, a } = withTwoTaps();
    const out = draw(cfg, { tapReview: true, tapFocusId: a, highlightId: a, handles: true });
    // One group has the move cursor: the focused tap. Every other group has none.
    expect(out.match(/cursor:move/g)).toHaveLength(1);
    expect(out.match(/data-handle=/g)).toHaveLength(4);
  });

  it("is ignored outside review mode", () => {
    const { cfg, a, b } = withTwoTaps();
    const out = draw(cfg, { tapFocusId: a });
    expect(out).not.toContain(a);
    expect(out).not.toContain(b);
  });

  it("shows every tap again without a focus", () => {
    const { cfg, a, b } = withTwoTaps();
    const out = draw(cfg, { tapReview: true });
    expect(out).toContain(a);
    expect(out).toContain(b);
  });
});

describe("timestamp chip selection", () => {
  function withChip(): { cfg: CustomComplicationConfig; id: string } {
    const cfg = newConfig("Test", 0);
    const img = newElement("image");
    if (img.kind === "image") {
      img.payload.entity = { entityId: "camera.door", displayName: "Door", domain: "camera" };
      img.payload.timestamp = true;
    }
    cfg.elements.push(img);
    return { cfg, id: img.payload.id };
  }

  /** The rectangular face with the camera's picture known, so the chip draws. */
  function drawWithPicture(cfg: CustomComplicationConfig, opts: Partial<RenderOptions>): string {
    const entityStates = new Map([["camera.door", {
      entityId: "camera.door", state: "idle", iconName: "camera", domain: "camera", entityPicture: "/api/camera_proxy/camera.door?token=t",
    }]]);
    const layouts = resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values });
    return flatten(renderLayout(layouts.rectangular!, { icons: noIcons, showHidden: true, tapAreas: true, ...opts }));
  }

  it("draws a box and corner handles only for the selected chip", () => {
    const { cfg, id } = withChip();
    const plain = drawWithPicture(cfg, { highlightId: id, handles: true });
    expect(plain).toContain("data-ts-handle");
    expect(plain).not.toContain("data-ts-corner");
    const selected = drawWithPicture(cfg, { highlightId: id, handles: true, timestampActiveId: id });
    expect(selected.match(/data-ts-corner=/g)).toHaveLength(4);
  });
});
