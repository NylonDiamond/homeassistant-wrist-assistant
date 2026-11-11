// The 3D look's framing of a whole floor: the floor's box as near as keeps
// every corner in view, filling about 88% of the pane in its tighter
// direction, centred, checked with three's own perspective camera.

import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { type HomeMapFrameBox, type HomeMapFrameView, homeMapFrameFit } from "../src/home-map/frame-fit.js";

const POLAR = (50 * Math.PI) / 180;
const VFOV = (32 * Math.PI) / 180;

/** Each corner of `box` on screen, -1 to 1 each way, as a camera standing
 * where the fit says and looking at its target sees it. */
function projected(box: HomeMapFrameBox, view: HomeMapFrameView): THREE.Vector3[] {
  const { distance, target, direction } = homeMapFrameFit(box, view);
  const camera = new THREE.PerspectiveCamera((view.vfov * 180) / Math.PI, view.aspect, 0.05, 200);
  camera.position.set(target[0] + direction[0] * distance, target[1] + direction[1] * distance, target[2] + direction[2] * distance);
  camera.lookAt(target[0], target[1], target[2]);
  camera.updateMatrixWorld();
  const out: THREE.Vector3[] = [];
  for (const x of [box.minX, box.maxX]) for (const y of [0, box.top]) for (const z of [box.minZ, box.maxZ]) out.push(new THREE.Vector3(x, y, z).project(camera));
  return out;
}

function spans(points: THREE.Vector3[]): { x: number; y: number; midX: number; midY: number } {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const lo = (v: number[]): number => Math.min(...v);
  const hi = (v: number[]): number => Math.max(...v);
  return { x: (hi(xs) - lo(xs)) / 2, y: (hi(ys) - lo(ys)) / 2, midX: (hi(xs) + lo(xs)) / 2, midY: (hi(ys) + lo(ys)) / 2 };
}

/** The old framing: a sphere round the floor's diagonal and its height. */
function sphereDistance(box: HomeMapFrameBox, aspect: number): number {
  const radius = Math.max(Math.hypot(box.maxX - box.minX, box.maxZ - box.minZ, box.top) / 2, 1.5);
  const hfov = 2 * Math.atan(Math.tan(VFOV / 2) * aspect);
  return (radius * 0.95) / Math.sin(Math.min(VFOV, hfov) / 2);
}

const house: HomeMapFrameBox = { minX: 0, maxX: 11, minZ: 0, maxZ: 6.2, top: 2.44 };
const square: HomeMapFrameBox = { minX: -2, maxX: 4, minZ: 1, maxZ: 7, top: 2.4 };

const cases: [string, HomeMapFrameBox, number, number][] = [
  ["a wide low house in a wide pane", house, 2.2, 0],
  ["a wide low house in a tall pane", house, 0.8, 0],
  ["a wide low house turned in a wide pane", house, 2.2, 35],
  ["a wide low house turned half round in a tall pane", house, 0.8, 200],
  ["a square box in a square pane", square, 1, 0],
  ["a square box turned in a wide pane", square, 1.6, 45],
];

describe("homeMapFrameFit", () => {
  for (const [name, box, aspect, turn] of cases) {
    it(`keeps every corner in and fills the tighter way: ${name}`, () => {
      const view = { turn, polar: POLAR, vfov: VFOV, aspect };
      const points = projected(box, view);
      for (const p of points) {
        expect(Math.abs(p.x)).toBeLessThanOrEqual(0.95);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(0.95);
        // In front of the camera.
        expect(p.z).toBeLessThan(1);
      }
      const s = spans(points);
      const tighter = Math.max(s.x, s.y);
      expect(tighter).toBeGreaterThanOrEqual(0.8);
      expect(tighter).toBeLessThanOrEqual(0.95);
      // Centred on the pane.
      expect(Math.abs(s.midX)).toBeLessThan(0.02);
      expect(Math.abs(s.midY)).toBeLessThan(0.02);
    });
  }

  it("stands the owner's house far nearer than the old sphere did in a wide pane", () => {
    // About 13.4 m where the sphere stood 22.2 m off.
    const wide = homeMapFrameFit(house, { turn: 0, polar: POLAR, vfov: VFOV, aspect: 2.2 }).distance;
    expect(wide).toBeLessThan(sphereDistance(house, 2.2) * 0.65);
    // In a tall pane the sphere stood too near and cut the house's ends
    // off; the fit stands a little further back and keeps them.
    const tall = homeMapFrameFit(house, { turn: 0, polar: POLAR, vfov: VFOV, aspect: 0.8 }).distance;
    expect(tall).toBeGreaterThan(sphereDistance(house, 0.8));
    expect(tall).toBeLessThan(sphereDistance(house, 0.8) * 1.2);
  });

  it("frames a tiny room as one three metres across", () => {
    const tiny: HomeMapFrameBox = { minX: 0, maxX: 0.5, minZ: 0, maxZ: 0.5, top: 2.4 };
    const floor: HomeMapFrameBox = { minX: -1.25, maxX: 1.75, minZ: -1.25, maxZ: 1.75, top: 2.4 };
    const view = { turn: 0, polar: POLAR, vfov: VFOV, aspect: 1.5 };
    expect(homeMapFrameFit(tiny, view).distance).toBeCloseTo(homeMapFrameFit(floor, view).distance, 6);
  });

  it("looks the way the turn says, tipped 50 degrees from straight above", () => {
    const { direction } = homeMapFrameFit(house, { turn: 90, polar: POLAR, vfov: VFOV, aspect: 1.5 });
    expect(direction[0]).toBeCloseTo(Math.sin(POLAR), 6);
    expect(direction[1]).toBeCloseTo(Math.cos(POLAR), 6);
    expect(direction[2]).toBeCloseTo(0, 6);
  });
});
