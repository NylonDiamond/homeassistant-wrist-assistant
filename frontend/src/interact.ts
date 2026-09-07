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

/**
 * A frame typed into the Place card, held to the rules a gesture already
 * obeys: no smaller than a corner drag allows, and never pushed so far that
 * nothing is left on the face.
 */
export function typedFrame(frame: NormalizedFrame, patch: Partial<NormalizedFrame>): NormalizedFrame {
  const next = { ...frame, ...patch };
  return clampFrame({
    ...next,
    x: round3(next.x),
    y: round3(next.y),
    width: Math.max(MIN_SIZE, round3(next.width)),
    height: Math.max(MIN_SIZE, round3(next.height)),
  });
}

function clampFrame(f: NormalizedFrame): NormalizedFrame {
  const x = Math.min(1 - KEEP_VISIBLE, Math.max(-f.width + KEEP_VISIBLE, f.x));
  const y = Math.min(1 - KEEP_VISIBLE, Math.max(-f.height + KEEP_VISIBLE, f.y));
  return { ...f, x, y };
}

/** Frames carry three decimals on the wire, and every gesture rounds to them
 * so a move is reproducible rather than a long tail of float noise. */
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** How much further one arrow press moves with Shift held. */
export const NUDGE_COARSE = 10;

/**
 * Move a frame by whole design points: what an arrow key does to a layer.
 *
 * `dx`/`dy` are points in the family's design box, so one press moves the same
 * distance on the wrist in every shape, and the result is clamped exactly the
 * way a drag is (KEEP_VISIBLE), so the keyboard cannot put a layer somewhere a
 * pointer could not.
 */
export function nudgeFrame(
  frame: NormalizedFrame,
  dx: number,
  dy: number,
  box: { width: number; height: number },
): NormalizedFrame {
  const x = box.width > 0 ? frame.x + dx / box.width : frame.x;
  const y = box.height > 0 ? frame.y + dy / box.height : frame.y;
  return clampFrame({ ...frame, x: round3(x), y: round3(y) });
}

/**
 * Move a point inside a layer's box by whole design points: what an arrow key
 * does to the image timestamp chip. `box` is that layer's box in design points,
 * and the point stays inside it, as `beginPointDrag` keeps it.
 */
export function nudgePoint(
  base: { x: number; y: number },
  dx: number,
  dy: number,
  box: { w: number; h: number },
): { x: number; y: number } {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return {
    x: box.w > 0 ? round3(clamp(base.x + dx / box.w)) : base.x,
    y: box.h > 0 ? round3(clamp(base.y + dy / box.h)) : base.y,
  };
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

/**
 * Drag a point that lives inside one layer's box, reported as 0..1 fractions of
 * that box: the image timestamp chip is the only one so far.
 *
 * Deliberately not `beginGesture` with a tiny frame. The chip has no frame of
 * its own on the wire, it is not selectable, and it must not pick up the
 * KEEP_VISIBLE rule, which exists to stop a layer being dragged off the face and
 * would let the chip leave the picture it belongs to.
 */
export function beginPointDrag(
  svg: SVGSVGElement,
  box: { x: number; y: number; w: number; h: number },
  start: PointerEvent,
  base: { x: number; y: number },
  onPoint: (x: number, y: number, done: boolean) => void,
): () => void {
  const origin = canvasPoint(svg, start);
  let last = base;
  svg.setPointerCapture(start.pointerId);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const clamp = (n: number) => Math.min(1, Math.max(0, n));

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const p = canvasPoint(svg, ev);
    // A zero-sized box would divide by zero; it cannot be dragged either.
    const x = box.w > 0 ? clamp(base.x + (p.x - origin.x) / box.w) : base.x;
    const y = box.h > 0 ? clamp(base.y + (p.y - origin.y) / box.h) : base.y;
    last = { x: round(x), y: round(y) };
    onPoint(last.x, last.y, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    onPoint(last.x, last.y, true);
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

/**
 * Drag a corner of a box whose only variable is its scale: the image timestamp
 * chip, whose width and height both follow one text size. Reports the factor
 * the box should be multiplied by, taken from whichever axis the pointer has
 * pulled further, so a diagonal drag and a sideways one both do what they look
 * like they do. `size` is the box as drawn, in the SVG's own units.
 */
export function beginScaleDrag(
  svg: SVGSVGElement,
  start: PointerEvent,
  corner: HandleCorner,
  size: { w: number; h: number },
  onScale: (factor: number, done: boolean) => void,
): () => void {
  const origin = canvasPoint(svg, start);
  let last = 1;
  svg.setPointerCapture(start.pointerId);

  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const p = canvasPoint(svg, ev);
    const dx = (p.x - origin.x) * (corner.includes("e") ? 1 : -1);
    const dy = (p.y - origin.y) * (corner.includes("s") ? 1 : -1);
    const fx = size.w > 0 ? (size.w + dx) / size.w : 1;
    const fy = size.h > 0 ? (size.h + dy) / size.h : 1;
    const f = Math.abs(fx - 1) >= Math.abs(fy - 1) ? fx : fy;
    last = Math.max(0.05, f);
    onScale(last, false);
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    onScale(last, true);
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
