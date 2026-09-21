import { describe, expect, it } from "vitest";
import { DESIGN_BOX, DRAWABLE_FAMILIES, HOME_FAMILIES, WATCH_CANVAS_FAMILIES } from "../src/model.js";
import { CANVAS, CASES, PHONE_CASES, REFERENCE_CASE, REFERENCE_PHONE, caseForScreenSize, fitBox, phoneCaseForScreenSize, slotFor } from "../src/renderer.js";

// Mirror of CustomComplicationDesignBoxTests.swift in the app repo. The two
// fit functions must agree to the point, or the panel preview drifts from the
// wrist.
describe("design box", () => {
  it("covers all seven canvas shapes and nothing else", () => {
    expect(DRAWABLE_FAMILIES).toEqual(["rectangular", "circular", "corner", "small", "medium", "large", "xlarge"]);
    expect(Object.keys(CANVAS).sort()).toEqual([...DRAWABLE_FAMILIES].sort());
    expect(CANVAS).toBe(DESIGN_BOX);
  });

  // These numbers are on the wire forever: every saved frame is a fraction of
  // them, so a change here silently moves every layer in every document. The
  // home sizes were measured on an iPhone 15 Pro, iOS 26.6, margins disabled.
  it("holds the measured boxes to the point", () => {
    expect(CANVAS.rectangular).toEqual({ width: 181, height: 65.5 });
    expect(CANVAS.circular).toEqual({ width: 51, height: 51 });
    expect(CANVAS.corner).toEqual({ width: 34, height: 34 });
    expect(CANVAS.small).toEqual({ width: 162.67, height: 162.67 });
    expect(CANVAS.medium).toEqual({ width: 344.67, height: 162.67 });
    expect(CANVAS.large).toEqual({ width: 344.67, height: 360 });
    expect(CANVAS.xlarge).toEqual({ width: 344.67, height: 557.33 });
  });

  it("every shape's own box is the identity fit", () => {
    for (const family of DRAWABLE_FAMILIES) {
      const fit = fitBox(CANVAS[family], family);
      expect(fit.scale).toBe(1);
      expect(fit.x).toBe(0);
      expect(fit.y).toBe(0);
      expect(fit.width).toBe(CANVAS[family].width);
      expect(fit.height).toBe(CANVAS[family].height);
    }
  });

  // Small is square, medium about 2.1:1, large about 0.96:1, extra large about
  // 0.62:1. Four ratios is the whole reason there are four shapes.
  it("gives each Home Screen tile its own ratio", () => {
    const ratios = HOME_FAMILIES.map((f) => CANVAS[f].width / CANVAS[f].height);
    expect(new Set(ratios.map((r) => r.toFixed(3))).size).toBe(HOME_FAMILIES.length);
    expect(CANVAS.small.width).toBe(CANVAS.small.height);
    for (const f of ["medium", "large", "xlarge"] as const) expect(CANVAS[f].width).toBe(CANVAS.medium.width);
  });

  it("the reference case row is the three watch boxes", () => {
    expect(REFERENCE_CASE.measured).toBe(true);
    expect(REFERENCE_CASE.slots).toEqual({
      rectangular: CANVAS.rectangular, circular: CANVAS.circular, corner: CANVAS.corner,
    });
    for (const family of WATCH_CANVAS_FAMILIES) {
      expect(slotFor(REFERENCE_CASE, family)).toEqual(CANVAS[family]);
    }
  });

  // A watch case has no Home Screen slot, so the tile falls back to its own
  // design box rather than reading undefined into the renderer.
  it("falls back to the design box for a shape a case does not carry", () => {
    for (const family of HOME_FAMILIES) {
      expect(slotFor(REFERENCE_CASE, family)).toBe(CANVAS[family]);
    }
  });

  it("a smaller slot scales down uniformly and centres", () => {
    const fit = fitBox({ width: 153, height: 55.5 }, "rectangular");
    expect(fit.scale).toBeCloseTo(153 / 181, 6);
    expect(fit.width).toBeCloseTo(153, 6);
    expect(fit.height).toBeLessThan(55.5);
    expect(fit.y * 2 + fit.height).toBeCloseTo(55.5, 6);
    expect(fit.x).toBe(0);
  });

  it("a wider slot letterboxes instead of stretching", () => {
    const fit = fitBox({ width: 100, height: 34 }, "corner");
    expect(fit.scale).toBe(1);
    expect(fit.width).toBe(34);
    expect(fit.x).toBe(33);
    expect(fit.y).toBe(0);
  });

  it("every case scales to at most 1 against the reference", () => {
    for (const c of CASES) {
      for (const family of WATCH_CANVAS_FAMILIES) {
        expect(fitBox(c.slots[family], family).scale).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });

  it("a zero slot never yields NaN", () => {
    const fit = fitBox({ width: 0, height: 0 }, "circular");
    expect(fit.scale).toBe(0);
    expect(Number.isNaN(fit.x)).toBe(false);
  });
});

// The watch reports `screen_size` as "WIDTHxHEIGHT" in points (from
// WKInterfaceDevice.screenBounds); the panel uses it to default the preview
// dropdown. Unknown or malformed values must fall through to undefined so the
// caller keeps its current default.
describe("caseForScreenSize", () => {
  it("round-trips every case's own screen size", () => {
    for (const c of CASES) {
      expect(caseForScreenSize(`${c.screen.width}x${c.screen.height}`)).toBe(c);
    }
  });

  it("tolerates surrounding whitespace", () => {
    expect(caseForScreenSize(" 208x248 ")?.label).toBe("46 mm");
  });

  it("returns undefined for missing, malformed, or unknown sizes", () => {
    expect(caseForScreenSize(null)).toBeUndefined();
    expect(caseForScreenSize(undefined)).toBeUndefined();
    expect(caseForScreenSize("")).toBeUndefined();
    expect(caseForScreenSize("208×248")).toBeUndefined();
    expect(caseForScreenSize("banana")).toBeUndefined();
    expect(caseForScreenSize("999x999")).toBeUndefined();
  });
});

// The phone cases feed "Preview as: iPhone". Only the iPhone 15 Pro row was
// measured; the rest are estimated from Apple's published widget sizes and are
// labelled as such in the dropdown, exactly like the watch cases.
describe("phone cases", () => {
  it("names one measured phone and makes it the reference", () => {
    expect(PHONE_CASES.filter((c) => c.measured)).toHaveLength(1);
    expect(REFERENCE_PHONE.label).toBe("iPhone 15 Pro");
    expect(REFERENCE_PHONE.measured).toBe(true);
  });

  it("carries the seven slots an iPhone can hold a complication in", () => {
    for (const c of PHONE_CASES) {
      expect(Object.keys(c.slots).sort()).toEqual(
        ["circular", "inline", "large", "medium", "rectangular", "small", "xlarge"],
      );
      for (const size of Object.values(c.slots)) {
        expect(size.width).toBeGreaterThan(0);
        expect(size.height).toBeGreaterThan(0);
      }
    }
  });

  // The measured phone's Home Screen tiles are the design boxes: it is the
  // phone they were read off.
  it("the reference phone's Home Screen slots are the design boxes", () => {
    for (const family of HOME_FAMILIES) expect(REFERENCE_PHONE.slots[family]).toBe(CANVAS[family]);
    expect(REFERENCE_PHONE.slots.circular).toEqual({ width: 58, height: 58 });
  });

  // Both Lock Screen slots are readings off Jesse's iPhone 15 Pro, not guesses
  // from the watch's shapes: the rectangle was estimated at 160 x 72 until
  // 2026-09-21 and previewed a good deal taller than the phone really draws.
  // Pinned so a future tidy-up cannot quietly round it back to a guess.
  it("the reference phone's Lock Screen rectangle is the measured slot", () => {
    expect(REFERENCE_PHONE.slots.rectangular).toEqual({ width: 147.67, height: 58 });
  });

  // One Lock Screen row holds both shapes, so the phone reads their height as
  // one number. Every estimated row is built that way from its own circular.
  it("every phone's Lock Screen rectangle is as tall as its circle", () => {
    for (const c of PHONE_CASES) {
      expect(c.slots.rectangular.height).toBe(c.slots.circular.height);
    }
  });

  // The estimated rows carry the measured phone's proportion, not a fresh
  // guess: a row that drifts off it is a row somebody re-estimated by hand.
  it("every phone's Lock Screen rectangle keeps the measured proportion", () => {
    const measured = REFERENCE_PHONE.slots.rectangular;
    const ratio = measured.width / measured.height;
    for (const c of PHONE_CASES) {
      expect(c.slots.rectangular.width / c.slots.rectangular.height).toBeCloseTo(ratio, 2);
    }
  });

  it("round-trips every phone's own screen size and refuses anything else", () => {
    for (const c of PHONE_CASES) {
      expect(phoneCaseForScreenSize(`${c.screen.width}x${c.screen.height}`)).toBe(c);
    }
    expect(phoneCaseForScreenSize(" 393x852 ")?.label).toBe("iPhone 15 Pro");
    expect(phoneCaseForScreenSize(null)).toBeUndefined();
    expect(phoneCaseForScreenSize("banana")).toBeUndefined();
    expect(phoneCaseForScreenSize("999x999")).toBeUndefined();
  });
});
