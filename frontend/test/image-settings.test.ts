// The picture settings on a camera layer. `pictureRect` is a port of
// `CustomComplication.pictureRect` in the app, and these are the same numbers
// its Swift tests pin (WristAssistantTests/CustomComplicationImageSettingsTests).

import { describe, expect, it } from "vitest";
import { encodeConfig, newConfig, newElement, parseConfig } from "../src/model.js";
import { pictureRect } from "../src/renderer.js";

/** A 200x100 picture in a 100x100 frame: twice as wide as it is tall. */
function rect(opts: Partial<{ mode: "fill" | "fit"; zoom: number; panX: number; panY: number; iw: number; ih: number }> = {}) {
  return pictureRect(100, 100, opts.iw ?? 200, opts.ih ?? 100, opts.mode ?? "fill", opts.zoom ?? 1, opts.panX ?? 0, opts.panY ?? 0);
}

describe("pictureRect", () => {
  it("fills the frame and centres the crop", () => {
    expect(rect()).toEqual({ x: -50, y: 0, width: 200, height: 100 });
  });

  it("pans to an edge and stops there", () => {
    expect(rect({ panX: -1 }).x).toBe(0);
    expect(rect({ panX: 1 }).x).toBe(-100);
    expect(rect({ panX: 0.5 }).x).toBe(-75);
    // Nothing spills vertically here, so vertical pan cannot move anything.
    expect(rect({ panY: 1 }).y).toBe(0);
    expect(rect({ panY: -1 }).y).toBe(0);
  });

  it("clamps a pan past the edge instead of extrapolating", () => {
    expect(rect({ panX: 9 }).x).toBe(rect({ panX: 1 }).x);
    expect(rect({ panX: -9 }).x).toBe(rect({ panX: -1 }).x);
  });

  it("fits the whole picture and leaves the spare edges empty", () => {
    expect(rect({ mode: "fit" })).toEqual({ x: 0, y: 25, width: 100, height: 50 });
  });

  it("zooms whichever fit was chosen, which gives a fitted picture something to pan", () => {
    expect(rect({ mode: "fit", zoom: 2 })).toEqual({ x: -50, y: 0, width: 200, height: 100 });
    expect(rect({ mode: "fit", zoom: 2, panX: 1 }).x).toBe(-100);
  });

  it("clamps a zoom below 1 and draws the whole frame for a picture with no size", () => {
    expect(rect({ zoom: 0.2 }).width).toBe(rect({ zoom: 1 }).width);
    expect(rect({ iw: 0, ih: 0 })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });
});

describe("image element wire format", () => {
  type Doc = { elements: { kind: string; payload: Record<string, unknown> }[] };

  function imageDoc(mutate: (p: Record<string, unknown>) => void = () => {}): Doc {
    const cfg = newConfig("Test", 0);
    const el = newElement("image");
    mutate(el.payload as unknown as Record<string, unknown>);
    cfg.elements.push(el);
    return encodeConfig(cfg) as unknown as Doc;
  }

  const payloadOf = (doc: Doc) => doc.elements[0]!.payload;

  it("writes none of the settings while they are at their defaults", () => {
    expect(Object.keys(payloadOf(imageDoc())).sort()).toEqual(["entity", "frame", "id", "isHidden", "rules"]);
  });

  it("writes each setting that differs, and reads it back", () => {
    const doc = imageDoc((p) => {
      p.timestamp = true;
      p.contentMode = "fit";
      p.zoom = 2.5;
      p.panX = -0.4;
      p.panY = 0.75;
      p.cornerRadius = 0;
      p.timestampCorner = "bottomTrailing";
      p.timestampSize = 12;
      p.timestampStyle = "age";
    });
    const written = payloadOf(doc);
    expect(written.contentMode).toBe("fit");
    expect(written.zoom).toBe(2.5);
    expect(written.panX).toBe(-0.4);
    expect(written.cornerRadius).toBe(0);
    expect(written.timestampCorner).toBe("bottomTrailing");
    expect(written.timestampSize).toBe(12);
    expect(written.timestampStyle).toBe("age");

    const p = parseConfig(doc).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(p.contentMode).toBe("fit");
    expect(p.zoom).toBe(2.5);
    expect(p.panY).toBe(0.75);
    expect(p.timestampStyle).toBe("age");
  });

  it("reads a document written before the settings existed as the old look", () => {
    // Exactly what an older panel or watch wrote: the payload with none of the
    // new keys on it at all.
    const doc = imageDoc();
    const p = parseConfig(doc).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(p.contentMode).toBe("fill");
    expect(p.zoom).toBe(1);
    expect(p.panX).toBe(0);
    expect(p.panY).toBe(0);
    expect(p.cornerRadius).toBe(6);
    expect(p.timestampCorner).toBe("topLeading");
    expect(p.timestampSize).toBe(9);
    expect(p.timestampStyle).toBe("clock");
  });
});
