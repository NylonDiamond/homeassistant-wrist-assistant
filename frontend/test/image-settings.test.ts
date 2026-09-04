// The picture settings on a camera layer. `pictureRect` is a port of
// `CustomComplication.pictureRect` in the app, and these are the same numbers
// its Swift tests pin (WristAssistantTests/CustomComplicationImageSettingsTests).

import { describe, expect, it } from "vitest";
import { encodeConfig, nearestTimestampCorner, newConfig, newElement, parseConfig } from "../src/model.js";
import { MAX_ZOOM, MIN_ZOOM, pictureRect, timestampChipRect, timestampLabel } from "../src/renderer.js";

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

  it("shrinks a filled picture away from the frame's edges below 1x", () => {
    expect(rect({ zoom: 0.5 })).toEqual({ x: 0, y: 25, width: 100, height: 50 });
  });

  it("stops at the ends of the zoom range, and draws the whole frame for a picture with no size", () => {
    expect(rect({ zoom: 0.01 }).width).toBe(rect({ zoom: MIN_ZOOM }).width);
    expect(rect({ zoom: 99 }).width).toBe(rect({ zoom: MAX_ZOOM }).width);
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
    });
    const written = payloadOf(doc);
    expect(written.contentMode).toBe("fit");
    expect(written.zoom).toBe(2.5);
    expect(written.panX).toBe(-0.4);
    expect(written.cornerRadius).toBe(0);
    expect(written.timestampCorner).toBe("bottomTrailing");
    expect(written.timestampSize).toBe(12);

    const p = parseConfig(doc).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(p.contentMode).toBe("fit");
    expect(p.zoom).toBe(2.5);
    expect(p.panY).toBe(0.75);
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
  });

  it("writes neither free coordinate until both are set", () => {
    expect(payloadOf(imageDoc((p) => { p.timestamp = true; })).timestampX).toBeUndefined();
    // Half a point is not a position, so the encoder ignores it and the parser
    // falls back to the corner.
    const half = imageDoc((p) => { p.timestamp = true; p.timestampX = 0.4; });
    expect(payloadOf(half).timestampX).toBeUndefined();
    const back = parseConfig(half).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(back.timestampX).toBeUndefined();
    expect(back.timestampCorner).toBe("topLeading");
  });

  it("writes both coordinates and the corner they are nearest, and reads them back", () => {
    const doc = imageDoc((p) => { p.timestamp = true; p.timestampX = 0.8; p.timestampY = 0.9; });
    const written = payloadOf(doc);
    expect(written.timestampX).toBe(0.8);
    expect(written.timestampY).toBe(0.9);
    // The compatibility copy an older watch reads.
    expect(written.timestampCorner).toBe("bottomTrailing");

    const p = parseConfig(doc).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(p.timestampX).toBe(0.8);
    expect(p.timestampY).toBe(0.9);
  });

  it("derives the compatibility corner rather than trusting the authored one", () => {
    const doc = imageDoc((p) => {
      p.timestamp = true;
      p.timestampCorner = "bottomTrailing";
      p.timestampX = 0.1;
      p.timestampY = 0.1;
    });
    expect(payloadOf(doc).timestampCorner).toBeUndefined(); // topLeading is the default, so unwritten
  });

  it("clamps a coordinate that arrived outside the picture", () => {
    const doc = imageDoc((p) => { p.timestamp = true; p.timestampX = 5; p.timestampY = -2; });
    const p = parseConfig(doc).elements[0]!.payload as unknown as Record<string, unknown>;
    expect(p.timestampX).toBe(1);
    expect(p.timestampY).toBe(0);
  });
});

describe("nearestTimestampCorner", () => {
  it("splits the picture into quarters, with the midlines going to top and leading", () => {
    expect(nearestTimestampCorner(0.1, 0.1)).toBe("topLeading");
    expect(nearestTimestampCorner(0.9, 0.1)).toBe("topTrailing");
    expect(nearestTimestampCorner(0.1, 0.9)).toBe("bottomLeading");
    expect(nearestTimestampCorner(0.9, 0.9)).toBe("bottomTrailing");
    expect(nearestTimestampCorner(0.5, 0.5)).toBe("topLeading");
  });
});

describe("timestampChipRect", () => {
  // A 100x50 picture at the canvas origin, the shape the clamp has to respect.
  const box = { x: 0, y: 0, w: 100, h: 50, cx: 50, cy: 25 };
  const label = "3:04:07";
  const el = (over: Partial<{ timestampX: number; timestampY: number; timestampCorner: string; timestampSize: number }> = {}) => ({
    timestampSize: 9,
    timestampCorner: "topLeading",
    ...over,
  });

  it("keeps the four corners exactly where they were", () => {
    const tl = timestampChipRect(el(), box, label);
    expect(tl.x).toBe(4);
    expect(tl.y).toBe(4);
    const br = timestampChipRect(el({ timestampCorner: "bottomTrailing" }), box, label);
    expect(br.x).toBe(box.w - 4 - br.w);
    expect(br.y).toBe(box.h - 4 - br.h);
  });

  it("treats a free pair as the chip's centre", () => {
    const c = timestampChipRect(el({ timestampX: 0.5, timestampY: 0.5 }), box, label);
    expect(c.x + c.w / 2).toBeCloseTo(50, 6);
    expect(c.y + c.h / 2).toBeCloseTo(25, 6);
  });

  it("stops the chip at the edge instead of letting it hang off", () => {
    const right = timestampChipRect(el({ timestampX: 1, timestampY: 1 }), box, label);
    expect(right.x + right.w).toBeCloseTo(box.w, 6);
    expect(right.y + right.h).toBeCloseTo(box.h, 6);
    const left = timestampChipRect(el({ timestampX: 0, timestampY: 0 }), box, label);
    expect(left.x).toBe(0);
    expect(left.y).toBe(0);
  });

  it("centres a chip too wide for the picture rather than hanging it off one side", () => {
    const narrow = { ...box, w: 20 };
    const c = timestampChipRect(el({ timestampX: 0, timestampY: 0.5 }), narrow, label);
    expect(c.x + c.w / 2).toBeCloseTo(10, 6);
  });

  it("labels the time as 12-hour with seconds and no AM/PM", () => {
    expect(timestampLabel(new Date(2026, 8, 4, 15, 4, 7))).toBe("3:04:07");
    expect(timestampLabel(new Date(2026, 8, 4, 0, 0, 0))).toBe("12:00:00");
  });
});
