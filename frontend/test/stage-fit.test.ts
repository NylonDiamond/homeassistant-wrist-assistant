// The stage's Fit held to its box's width (`stage-fit.ts`).

import { describe, expect, it } from "vitest";

import {
  STAGE_FILL_FLOOR,
  STAGE_FILL_MAX,
  STAGE_FIT_FLOOR,
  STAGE_ROOMY_TALL,
  STAGE_ROOMY_WIDE,
  STAGE_ROOMY_ZOOM,
  type StageFillDrawing,
  StageFitWatch,
  stageFillZoom,
} from "../src/watch-pages/stage-fit.js";

/** A host with one stage box of the given widths, drawn at `scale`. */
function setup(room: number, used: number, scale = 1.5) {
  const box = { clientWidth: room, scrollWidth: used };
  let asked = 0;
  const host = {
    renderRoot: { querySelector: () => box },
    addController: () => {},
    requestUpdate: () => { asked += 1; },
  };
  const fit = new StageFitWatch(host as never, ".stage", () => scale);
  return { fit, box, asked: () => asked };
}

describe("the stage's Fit", () => {
  it("leaves a drawing that fits alone", () => {
    const { fit, asked } = setup(400, 400);
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(1.5);
    expect(asked()).toBe(0);
  });

  it("holds a drawing wider than its box to the scale that fits, and draws again", () => {
    const { fit, asked } = setup(300, 400);
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(1.12);
    expect(asked()).toBe(1);
    // A picked zoom under the cap is left as it is.
    expect(fit.fit(1)).toBe(1);
  });

  it("draws the watch bigger on a big stage in a tall window, and asks to draw again", () => {
    const tall = globalThis.innerHeight;
    try {
      (globalThis as { innerHeight?: number }).innerHeight = STAGE_ROOMY_TALL;
      const { fit, asked } = setup(STAGE_ROOMY_WIDE, STAGE_ROOMY_WIDE);
      fit.hostUpdated();
      expect(asked()).toBe(1);
      expect(fit.fit(1.5)).toBe(STAGE_ROOMY_ZOOM);
      (globalThis as { innerHeight?: number }).innerHeight = STAGE_ROOMY_TALL - 1;
      expect(fit.fit(1.5)).toBe(1.5);
    } finally {
      (globalThis as { innerHeight?: number }).innerHeight = tall;
    }
  });

  it("never goes under its floor", () => {
    const { fit } = setup(100, 1000);
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(STAGE_FIT_FLOOR);
  });
});

describe("the page editor's Fit, filling the stage", () => {
  /** A 46 mm watch's case at zoom 1, with a label over it. */
  const WATCH: StageFillDrawing = { width: 245, height: 274, fixedWidth: 16, fixedHeight: 30, max: STAGE_FILL_MAX };

  it("takes the largest zoom that fits both the width and the height, to the hundredth, rounded down", () => {
    // A laptop stage: the width is roomy, the height decides.
    expect(stageFillZoom({ width: 900, height: 700 }, WATCH)).toBe(Math.floor(((700 - 30) / 274) * 100) / 100);
    // A narrow, tall stage: the width decides.
    expect(stageFillZoom({ width: 400, height: 1400 }, WATCH)).toBe(Math.floor(((400 - 16) / 245) * 100) / 100);
  });

  it("stops at the drawing's own most, and never goes under the floor", () => {
    // A 4K stage at 100%: 300%, not the 7x the room would hold.
    expect(stageFillZoom({ width: 2200, height: 1900 }, WATCH)).toBe(STAGE_FILL_MAX);
    expect(stageFillZoom({ width: 2200, height: 1900 }, { ...WATCH, max: 6 })).toBeGreaterThan(STAGE_FILL_MAX);
    expect(stageFillZoom({ width: 120, height: 120 }, WATCH)).toBe(STAGE_FIT_FLOOR);
  });

  /** A host whose stage box is `width` by `height`, filling with `drawing`. */
  function filling(width: number, height: number, drawing: StageFillDrawing | undefined) {
    const box = { clientWidth: width, clientHeight: height, scrollWidth: width * 4 };
    let asked = 0;
    const host = {
      renderRoot: { querySelector: () => box },
      addController: () => {},
      requestUpdate: () => { asked += 1; },
    };
    const fit = new StageFitWatch(host as never, ".stage", () => 1.5, () => drawing);
    return { fit, asked: () => asked };
  }

  it("fills the box it measured, and asks to draw again once it has, never held by how wide it drew", () => {
    const { fit, asked } = filling(1000, 800, WATCH);
    // Before the box is measured, the base as before.
    expect(fit.fit(1.5)).toBe(1.5);
    fit.hostUpdated();
    expect(asked()).toBe(1);
    expect(fit.fit(1.5)).toBe(stageFillZoom({ width: 1000, height: 800 }, WATCH));
    // A drawing wider than the box (a long page, a step past Fit) never caps it.
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(stageFillZoom({ width: 1000, height: 800 }, WATCH));
  });

  it("fits all of a page longer than the device's screen, by the drawing's height per unit of zoom", () => {
    // Drawn at 1.5: 600 per unit of zoom past the label, more than the watch alone.
    const box = { clientWidth: 1000, clientHeight: 800, scrollWidth: 1000, firstElementChild: { offsetHeight: 30 + 600 * 1.5 } };
    let asked = 0;
    const host = { renderRoot: { querySelector: () => box }, addController: () => {}, requestUpdate: () => { asked += 1; } };
    const fit = new StageFitWatch(host as never, ".stage", () => 1.5, () => WATCH);
    fit.hostUpdated();
    fit.hostUpdated();
    expect(asked).toBe(2);
    expect(fit.fit(1.5)).toBe(stageFillZoom({ width: 1000, height: 800 }, { ...WATCH, height: 600 }, STAGE_FILL_FLOOR));
    expect(fit.fit(1.5)).toBeLessThan(stageFillZoom({ width: 1000, height: 800 }, WATCH));
    // The same height again draws nothing more.
    fit.hostUpdated();
    expect(asked).toBe(2);
  });

  it("never asks to draw again and again when each draw measures a little differently, and holds while held", () => {
    // A drawing with a part that does not grow with the zoom (120 px more than
    // the label it counts out) and that wobbles by a pixel per draw, as
    // rounding did when the browser froze.
    let scale = 1.5;
    let wobble = 0;
    const child = { get offsetHeight() { wobble ^= 1; return 30 + 120 + 600 * scale + wobble; } };
    const box = { clientWidth: 420, clientHeight: 800, offsetWidth: 420, offsetHeight: 800, scrollWidth: 420, firstElementChild: child };
    let asked = 0;
    let held = false;
    const host = { renderRoot: { querySelector: () => box }, addController: () => {}, requestUpdate: () => { asked += 1; } };
    const fit = new StageFitWatch(host as never, ".stage", () => scale, () => WATCH, () => held);
    // Draw as Lit would: each ask is one more draw at the fit it gives.
    for (let i = 0; i < 50; i++) {
      const before = asked;
      scale = fit.fit(1.5);
      fit.hostUpdated();
      if (asked === before) break;
    }
    expect(asked).toBeLessThanOrEqual(5);
    // Held (a tile dragged), the fit stays where it was and nothing measures.
    const kept = fit.fit(1.5);
    held = true;
    scale = 3;
    const before = asked;
    fit.hostUpdated();
    expect(asked).toBe(before);
    expect(fit.fit(1.5)).toBe(kept);
  });

  it("fits the width alone, as before, when the host says no (a stacked editor)", () => {
    const { fit, asked } = filling(300, 2000, undefined);
    // The first pass measures the box and asks to draw again; the draw after
    // it is held to the width by the drawing four times wider than its box.
    fit.hostUpdated();
    expect(asked()).toBe(1);
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(STAGE_FIT_FLOOR);
  });
});
