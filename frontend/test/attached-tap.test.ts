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
} from "../src/model.js";
import { setPlacement } from "../src/editors.js";
import { Draft } from "../src/draft.js";

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

  it("heals a document whose attached tap has drifted", () => {
    const { cfg, icon } = withIcon();
    attachTap(cfg, icon.payload.id);
    const doc = encodeConfig(cfg) as { elements: { kind: string; payload: Record<string, unknown> }[] };
    // A hand-edit that moves the tap off its owner and behind it in z-order.
    const tapIndex = doc.elements.findIndex((e) => e.kind === "tap");
    const [tapEl] = doc.elements.splice(tapIndex, 1);
    tapEl!.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
    doc.elements.unshift(tapEl!);

    const draft = Draft.fromDocument(doc, 1);
    expect(draft.dirty, "healing on open never looks like unsaved work").toBe(false);
    expect(draft.config.elements.map((e) => e.kind)).toEqual(["icon", "tap"]);
    expect(tapOf(draft.config, icon.payload.id).frame).toEqual(icon.payload.frame);
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
