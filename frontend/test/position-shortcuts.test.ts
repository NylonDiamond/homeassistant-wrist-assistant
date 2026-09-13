// The Position card's line-up and copy shortcuts. Centring puts the frame's
// middle on the face's middle and leaves its size alone. Paste position gives a
// round shape the copied numbers as they are, and scales around the middle
// between the wide face and a round one, so a centred layer stays centred.

import { describe, expect, it } from "vitest";
import { centerFrame, isCentered } from "../src/interact.js";
import { pastedFrame } from "../src/editors.js";
import type { NormalizedFrame } from "../src/model.js";

const frame = (over: Partial<NormalizedFrame> = {}): NormalizedFrame =>
  ({ x: 0.1, y: 0.2, width: 0.4, height: 0.3, rotationDegrees: 15, ...over });

describe("centerFrame", () => {
  it("centres across and keeps the height where it was", () => {
    expect(centerFrame(frame(), "across")).toEqual(frame({ x: 0.3 }));
  });

  it("centres up and down and keeps the left edge where it was", () => {
    expect(centerFrame(frame(), "down")).toEqual(frame({ y: 0.35 }));
  });

  it("centres both ways", () => {
    expect(centerFrame(frame(), "both")).toEqual(frame({ x: 0.3, y: 0.35 }));
  });

  it("centres a layer wider than the face", () => {
    expect(centerFrame(frame({ width: 1.2 }), "across").x).toBe(-0.1);
  });

  it("knows a centred frame", () => {
    const centred = centerFrame(frame(), "both");
    expect(isCentered(centred, "both")).toBe(true);
    expect(isCentered(frame(), "across")).toBe(false);
    expect(isCentered(frame({ x: 0.3 }), "across")).toBe(true);
    expect(isCentered(frame({ x: 0.3 }), "both")).toBe(false);
  });
});

describe("pastedFrame", () => {
  it("copies the numbers onto the same shape", () => {
    expect(pastedFrame({ frame: frame(), family: "circular" }, "circular", "text")).toEqual(frame());
  });

  it("copies the numbers between the two round shapes", () => {
    expect(pastedFrame({ frame: frame(), family: "circular" }, "corner", "icon")).toEqual(frame());
    expect(pastedFrame({ frame: frame(), family: "corner" }, "circular", "icon")).toEqual(frame());
  });

  it("keeps a centred layer centred from the wide face to a round one", () => {
    const centred = frame({ x: 0.3, y: 0.35 });
    const onRound = pastedFrame({ frame: centred, family: "rectangular" }, "circular", "text");
    expect(onRound.x + onRound.width / 2).toBeCloseTo(0.5, 2);
    expect(onRound.y + onRound.height / 2).toBeCloseTo(0.5, 2);
    expect(onRound.width).toBeLessThan(centred.width);
    expect(onRound.rotationDegrees).toBe(15);
  });
});
