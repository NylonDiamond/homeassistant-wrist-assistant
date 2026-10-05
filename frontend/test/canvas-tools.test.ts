// The canvas column's toolbar and first-run tiles: the Snap menu writes the
// same four flags the three old buttons did, the zoom steps between half and
// three times the size that fits, and the empty-complication tiles add the
// kinds they name.

import { describe, expect, it, vi } from "vitest";
import {
  FIRST_RUN_TILES, STAGE_GAP, STAGE_HINT_HEIGHT, STAGE_PAD_BOTTOM, STAGE_PAD_TOP, STAGE_TOOLS_GAP, STAGE_TOOLS_HEIGHT, ZOOM_FIT, ZOOM_MAX, ZOOM_MIN, ZOOM_STEPS,
  anySnap, pickGridStep, runFirstRunTile, slotWord, snapSwitchOn, stageReserve, toggleSnap, zoomIn, zoomLabel, zoomOut,
  type SnapFlags,
} from "../src/canvas-tools.js";
import { canvasStyles } from "../src/editor-chrome.js";
import { GRID_STEPS } from "../src/interact.js";

const flags = (over: Partial<SnapFlags> = {}): SnapFlags =>
  ({ snapGrid: true, gridStep: 0.01, showGridLines: false, snapLayers: true, ...over });

describe("Snap menu", () => {
  it("maps each switch to its own flag and leaves the rest alone", () => {
    expect(toggleSnap(flags(), "grid")).toEqual(flags({ snapGrid: false }));
    expect(toggleSnap(flags(), "lines")).toEqual(flags({ showGridLines: true }));
    expect(toggleSnap(flags(), "layers")).toEqual(flags({ snapLayers: false }));
  });

  it("flips back on a second press", () => {
    for (const which of ["grid", "lines", "layers"] as const) {
      expect(toggleSnap(toggleSnap(flags(), which), which)).toEqual(flags());
    }
  });

  it("reads each switch from the flag it writes", () => {
    const f = flags({ snapGrid: false, showGridLines: true, snapLayers: false });
    expect(snapSwitchOn(f, "grid")).toBe(false);
    expect(snapSwitchOn(f, "lines")).toBe(true);
    expect(snapSwitchOn(f, "layers")).toBe(false);
  });

  it("picking a grid size turns snapping to the grid on", () => {
    for (const step of GRID_STEPS) {
      expect(pickGridStep(flags({ snapGrid: false }), step)).toEqual(flags({ snapGrid: true, gridStep: step }));
    }
  });

  it("lights the button for any snapping, not for grid lines alone", () => {
    expect(anySnap(flags())).toBe(true);
    expect(anySnap(flags({ snapGrid: false }))).toBe(true);
    expect(anySnap(flags({ snapLayers: false }))).toBe(true);
    expect(anySnap(flags({ snapGrid: false, snapLayers: false, showGridLines: true }))).toBe(false);
  });
});

describe("zoom", () => {
  it("starts at Fit, inside the range, with Fit as one of the steps", () => {
    expect(ZOOM_FIT).toBe(1);
    expect(ZOOM_STEPS).toContain(ZOOM_FIT);
    expect(ZOOM_MIN).toBe(0.5);
    expect(ZOOM_MAX).toBe(3);
    expect([...ZOOM_STEPS].sort((a, b) => a - b)).toEqual(ZOOM_STEPS);
  });

  it("steps up and down one step at a time", () => {
    expect(zoomIn(ZOOM_FIT)).toBe(1.25);
    expect(zoomOut(ZOOM_FIT)).toBe(0.75);
    expect(zoomOut(zoomIn(ZOOM_FIT))).toBe(ZOOM_FIT);
  });

  it("stops at both ends", () => {
    expect(zoomIn(ZOOM_MAX)).toBe(ZOOM_MAX);
    expect(zoomOut(ZOOM_MIN)).toBe(ZOOM_MIN);
  });

  it("walks every step from the smallest to the largest", () => {
    const seen = [ZOOM_MIN];
    let z = ZOOM_MIN;
    while (z < ZOOM_MAX) { z = zoomIn(z); seen.push(z); }
    expect(seen).toEqual(ZOOM_STEPS);
  });

  it("goes to the next step past a zoom that sits between two", () => {
    expect(zoomIn(1.1)).toBe(1.25);
    expect(zoomOut(1.1)).toBe(1);
  });

  it("labels Fit by name and everything else as a percent", () => {
    expect(zoomLabel(ZOOM_FIT)).toBe("Fit");
    expect(zoomLabel(0.5)).toBe("50%");
    expect(zoomLabel(0.67)).toBe("67%");
    expect(zoomLabel(3)).toBe("300%");
  });

  it("keeps more room around the face for the row banner and the first-run tiles", () => {
    const plain = stageReserve();
    expect(stageReserve({ rowStrip: true })).toBeGreaterThan(plain);
    expect(stageReserve({ firstRun: true })).toBeGreaterThan(plain);
  });

  // The face's Fit height is the stage less this reserve, so the reserve has
  // to be the whole of what the stage draws besides the face, or a face bound
  // by height overruns the stage and it grows a scroll bar.
  it("reserves the stage's whole box besides the face, hint and gap included", () => {
    expect(stageReserve()).toBe(STAGE_PAD_TOP + STAGE_TOOLS_HEIGHT + STAGE_TOOLS_GAP + STAGE_GAP + STAGE_GAP + STAGE_HINT_HEIGHT + STAGE_PAD_BOTTOM);
    expect(stageReserve()).toBe(137);
    const css = canvasStyles.cssText;
    expect(css).toContain(`padding: ${STAGE_PAD_TOP}px 24px ${STAGE_PAD_BOTTOM}px;`);
    expect(css).toMatch(new RegExp(`\\.stage-face \\{[^}]*gap: ${STAGE_GAP}px;`));
    // The toolbar is in the face's own column, so it sits just over the face.
    expect(css).toMatch(new RegExp(`\\.stage-tools \\{[^}]*position: sticky;[^}]*margin-bottom: ${STAGE_TOOLS_GAP}px;[^}]*height: ${STAGE_TOOLS_HEIGHT}px;`));
    expect(css).toMatch(new RegExp(`\\.stage-face > \\.under \\{[^}]*min-height: ${STAGE_HINT_HEIGHT}px;`));
  });
});

describe("first-run tiles", () => {
  it("offers a value, a gauge, a chart and a preset, in that order", () => {
    expect(FIRST_RUN_TILES.map((t) => t.title)).toEqual(["A value", "A gauge", "A chart", "A preset"]);
    expect(FIRST_RUN_TILES.map((t) => t.blurb)).toEqual([
      "Text from one entity", "Number between min and max", "Recent history", "Set up, just pick an entity",
    ]);
  });

  it("adds a text, a gauge and a chart layer, and opens the presets", () => {
    const addElement = vi.fn();
    const openAddSheet = vi.fn();
    for (const tile of FIRST_RUN_TILES) runFirstRunTile(tile, { addElement, openAddSheet });
    expect(addElement.mock.calls).toEqual([["text"], ["gauge"], ["chart"]]);
    expect(openAddSheet.mock.calls).toEqual([["presets"]]);
  });

  it("names the empty face after where it sits", () => {
    expect(slotWord("rectangular", false)).toBe("watch face slot");
    expect(slotWord("circular", true)).toBe("Lock Screen slot");
    expect(slotWord("medium", true)).toBe("Home Screen slot");
    expect(slotWord("small", false)).toBe("Home Screen slot");
  });
});
