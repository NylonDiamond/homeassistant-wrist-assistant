// The panel's 3D view takes the mouse as the plan does: the middle button moves it.

import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { homeMapSetMouse } from "../src/home-map/scene3d.js";

/** As much of a canvas as the controls read: the tests run with no page. */
class Canvas extends EventTarget {
  clientWidth = 800;
  clientHeight = 600;
  style: Record<string, string> = {};
  ownerDocument = this;
  getRootNode(): this { return this; }
  setPointerCapture(): void {}
  releasePointerCapture(): void {}
}

function view(): { controls: OrbitControls; camera: THREE.PerspectiveCamera; canvas: Canvas } {
  const canvas = new Canvas();
  const camera = new THREE.PerspectiveCamera(50, 800 / 600, 0.1, 100);
  camera.position.set(0, 8, 8);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const controls = new OrbitControls(camera, canvas as unknown as HTMLElement);
  homeMapSetMouse(controls);
  controls.update();
  return { controls, camera, canvas };
}

function drag(canvas: Canvas, button: number, by: [number, number]): void {
  const send = (type: string, x: number, y: number): void => {
    canvas.dispatchEvent(Object.assign(new Event(type, { cancelable: true }), {
      pointerId: 1, pointerType: "mouse", button, clientX: x, clientY: y, pageX: x, pageY: y,
      ctrlKey: false, metaKey: false, shiftKey: false,
    }));
  };
  send("pointerdown", 100, 100);
  send("pointermove", 100 + by[0], 100 + by[1]);
  send("pointerup", 100 + by[0], 100 + by[1]);
}

describe("the 3D view's middle button", () => {
  it("moves the view rather than zooms", () => {
    const { controls, camera, canvas } = view();
    const distance = camera.position.distanceTo(controls.target);
    drag(canvas, 1, [120, 0]);
    controls.update();
    expect(Math.abs(controls.target.x)).toBeGreaterThan(0.1);
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(distance, 5);
  });

  it("keeps the point it turns round on the floor", () => {
    const { controls, canvas } = view();
    drag(canvas, 1, [0, 120]);
    controls.update();
    expect(Math.abs(controls.target.z)).toBeGreaterThan(0.1);
    expect(controls.target.y).toBeCloseTo(0, 5);
  });

  it("leaves the left button to orbit", () => {
    const { controls, camera, canvas } = view();
    const before = camera.position.clone();
    drag(canvas, 0, [120, 0]);
    controls.update();
    expect(controls.target.length()).toBeCloseTo(0, 5);
    expect(camera.position.distanceTo(before)).toBeGreaterThan(0.1);
  });
});
