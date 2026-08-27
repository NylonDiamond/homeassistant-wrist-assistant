// Pointer handling for the active family preview: drag a layer to move it,
// drag a corner handle to resize it. Frames stay normalised (0..1 fractions
// of the canvas) so the maths is the same for every family. Rotation is a
// number field in the inspector, not a handle.

import type { NormalizedFrame } from "./model.js";
import type { CanvasSize } from "./renderer.js";

export type HandleCorner = "nw" | "ne" | "sw" | "se";

export interface GestureTarget {
  elementId: string;
  frame: NormalizedFrame;
  handle?: HandleCorner;
}

export interface GestureCallbacks {
  /** Called with the new frame on every move, and `done` on pointer up. */
  onFrame(elementId: string, frame: NormalizedFrame, done: boolean): void;
}

const MIN_SIZE = 0.04;
/** Keep about 4% of the box on canvas, like the phone editor (schema §4.1). */
const KEEP_VISIBLE = 0.04;

/** Convert a pointer event to canvas points using the SVG's own CTM. */
export function canvasPoint(svg: SVGSVGElement, ev: PointerEvent): { x: number; y: number } {
  const pt = new DOMPoint(ev.clientX, ev.clientY);
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

function clampFrame(f: NormalizedFrame): NormalizedFrame {
  const x = Math.min(1 - KEEP_VISIBLE, Math.max(-f.width + KEEP_VISIBLE, f.x));
  const y = Math.min(1 - KEEP_VISIBLE, Math.max(-f.height + KEEP_VISIBLE, f.y));
  return { ...f, x, y };
}

/**
 * Start a gesture on `pointerdown`. Captures the pointer on the SVG and
 * reports frames until release. Returns a cleanup that cancels the gesture.
 */
export function beginGesture(
  svg: SVGSVGElement,
  canvas: CanvasSize,
  start: PointerEvent,
  target: GestureTarget,
  cb: GestureCallbacks,
): () => void {
  const origin = canvasPoint(svg, start);
  const base = { ...target.frame };
  let last = base;
  svg.setPointerCapture(start.pointerId);

  const round = (n: number) => Math.round(n * 1000) / 1000;

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const p = canvasPoint(svg, ev);
    const dx = (p.x - origin.x) / canvas.width;
    const dy = (p.y - origin.y) / canvas.height;
    let next: NormalizedFrame;
    if (!target.handle) {
      next = clampFrame({ ...base, x: round(base.x + dx), y: round(base.y + dy) });
    } else {
      let { x, y, width, height } = base;
      const right = base.x + base.width;
      const bottom = base.y + base.height;
      if (target.handle.includes("e")) width = Math.max(MIN_SIZE, base.width + dx);
      if (target.handle.includes("s")) height = Math.max(MIN_SIZE, base.height + dy);
      if (target.handle.includes("w")) {
        width = Math.max(MIN_SIZE, base.width - dx);
        x = right - width;
      }
      if (target.handle.includes("n")) {
        height = Math.max(MIN_SIZE, base.height - dy);
        y = bottom - height;
      }
      next = { ...base, x: round(x), y: round(y), width: round(width), height: round(height) };
    }
    last = next;
    cb.onFrame(target.elementId, next, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    cb.onFrame(target.elementId, last, true);
  };
  const cleanup = () => {
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", finish);
    svg.removeEventListener("pointercancel", finish);
    try {
      svg.releasePointerCapture(start.pointerId);
    } catch {
      /* already released */
    }
  };
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
  return cleanup;
}

/** Corner handle positions in canvas points for a frame. */
export function handlePoints(frame: NormalizedFrame, canvas: CanvasSize): { corner: HandleCorner; x: number; y: number }[] {
  const x0 = frame.x * canvas.width;
  const y0 = frame.y * canvas.height;
  const x1 = (frame.x + frame.width) * canvas.width;
  const y1 = (frame.y + frame.height) * canvas.height;
  return [
    { corner: "nw", x: x0, y: y0 },
    { corner: "ne", x: x1, y: y0 },
    { corner: "sw", x: x0, y: y1 },
    { corner: "se", x: x1, y: y1 },
  ];
}
