// The stage's Fit held to its box's width (`stage-fit.ts`).

import { describe, expect, it } from "vitest";

import { STAGE_FIT_FLOOR, StageFitWatch } from "../src/watch-pages/stage-fit.js";

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

  it("never goes under its floor", () => {
    const { fit } = setup(100, 1000);
    fit.hostUpdated();
    expect(fit.fit(1.5)).toBe(STAGE_FIT_FLOOR);
  });
});
