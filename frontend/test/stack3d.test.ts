// The 3D layer stack's view: dragging turns and tips it within bounds, the
// wheel zooms within bounds, and the sheets space out evenly with a wider gap
// between groups, centred so the stack turns round its middle.

import { describe, expect, it } from "vitest";
import {
  GROUP_GAP, STACK_HOME, STACK_PITCH_MAX, STACK_ZOOM_MAX, STACK_ZOOM_MIN, sheetUnits, stackRigStyle, stepFactor,
  turnStack, zoomStack,
} from "../src/stack3d.js";

describe("turning the stack", () => {
  it("turns round with a drag across and tips back with a drag down", () => {
    const v = turnStack(STACK_HOME, 100, -20);
    expect(v.yaw).toBeLessThan(STACK_HOME.yaw);
    expect(v.pitch).toBeGreaterThan(STACK_HOME.pitch);
    expect(v.spread).toBe(STACK_HOME.spread);
  });

  it("never tips past edge-on or forward of facing you", () => {
    expect(turnStack(STACK_HOME, 0, -10_000).pitch).toBe(STACK_PITCH_MAX);
    expect(turnStack(STACK_HOME, 0, 10_000).pitch).toBe(0);
  });

  it("zooms within its bounds", () => {
    expect(zoomStack(STACK_HOME, -100_000).zoom).toBe(STACK_ZOOM_MAX);
    expect(zoomStack(STACK_HOME, 100_000).zoom).toBe(STACK_ZOOM_MIN);
    expect(zoomStack(STACK_HOME, -100).zoom).toBeGreaterThan(1);
  });
});

describe("spacing the sheets", () => {
  it("steps evenly inside a group and centres on zero", () => {
    const half = (3 + GROUP_GAP) / 2;
    const want = [-half, -half + 1 + GROUP_GAP, half - 1, half];
    sheetUnits([undefined, "a", "a", "a"]).forEach((u, i) => expect(u).toBeCloseTo(want[i]!));
  });

  it("puts a wider gap where the group changes", () => {
    const u = sheetUnits(["a", "a", "b"]);
    expect(u[1]! - u[0]!).toBeCloseTo(1);
    expect(u[2]! - u[1]!).toBeCloseTo(1 + GROUP_GAP);
  });

  it("keeps a tall stack about the same height as a short one", () => {
    const short = sheetUnits(Array(40).fill(undefined));
    const k = stepFactor(1, short);
    expect(k * (short[39]! - short[0]!)).toBeCloseTo(1.3);
    // A few sheets stay a quarter of a face apart at most.
    expect(stepFactor(1, sheetUnits([undefined, undefined]))).toBe(0.25);
    expect(stepFactor(0, short)).toBe(0);
  });

  it("writes the turn and the step into the rig's style", () => {
    const style = stackRigStyle(STACK_HOME, sheetUnits([undefined, undefined]));
    expect(style).toContain(`rotateX(${STACK_HOME.pitch}deg)`);
    expect(style).toContain(`rotateZ(${STACK_HOME.yaw}deg)`);
    expect(style).toContain(`--k: ${STACK_HOME.spread * 0.25}`);
  });
});
