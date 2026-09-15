// Lining several layers up at once: align to an edge or a middle, and even
// out the gaps between them. Pure frame maths, in the same 0..1 fractions of
// the face a frame is stored in, so one set of rules covers every shape.
//
// Nothing here touches width, height or rotation. A layer that is aligned is
// moved, never resized, which is what the buttons above the canvas promise.

import type { NormalizedFrame } from "./model.js";

/** Which edge or middle the selection lines up on. */
export type AlignTo = "left" | "centerX" | "right" | "top" | "middleY" | "bottom";

export const ALIGN_ACROSS: readonly AlignTo[] = ["left", "centerX", "right"];
export const ALIGN_DOWN: readonly AlignTo[] = ["top", "middleY", "bottom"];

/** Which way the gaps are evened out. */
export type SpreadAxis = "across" | "down";

/** The face itself, which one layer on its own lines up against. */
const FACE: NormalizedFrame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };

const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** The box around every frame given. Empty in gives a zero box at the origin. */
export function framesBounds(frames: readonly NormalizedFrame[]): NormalizedFrame {
  if (frames.length === 0) return { x: 0, y: 0, width: 0, height: 0, rotationDegrees: 0 };
  const x = Math.min(...frames.map((f) => f.x));
  const y = Math.min(...frames.map((f) => f.y));
  const right = Math.max(...frames.map((f) => f.x + f.width));
  const bottom = Math.max(...frames.map((f) => f.y + f.height));
  return { x, y, width: right - x, height: bottom - y, rotationDegrees: 0 };
}

/**
 * Every frame moved onto one edge or middle of the box they share. Two or more
 * line up against the box around themselves, so the outermost of them does not
 * move; one on its own has nothing to line up with, so it lines up against the
 * face, which is what the Position card's Center buttons already do.
 *
 * The frames come back in the order they went in, so a caller can pair them
 * with the ids it collected them from.
 */
export function alignFrames(frames: readonly NormalizedFrame[], to: AlignTo): NormalizedFrame[] {
  if (frames.length === 0) return [];
  const box = frames.length === 1 ? FACE : framesBounds(frames);
  return frames.map((f) => {
    switch (to) {
      case "left": return { ...f, x: round3(box.x) };
      case "centerX": return { ...f, x: round3(box.x + (box.width - f.width) / 2) };
      case "right": return { ...f, x: round3(box.x + box.width - f.width) };
      case "top": return { ...f, y: round3(box.y) };
      case "middleY": return { ...f, y: round3(box.y + (box.height - f.height) / 2) };
      case "bottom": return { ...f, y: round3(box.y + box.height - f.height) };
    }
  });
}

/**
 * Every frame moved so the gaps between them are equal. The two outermost stay
 * exactly where they are and the rest are spread between them, so the block
 * keeps the span the author gave it.
 *
 * Gaps rather than middles: three layers of different widths spread by their
 * middles leave gaps that read as uneven, which is the thing being fixed here.
 * Layers that overlap give a negative gap, and are spread just as evenly.
 *
 * Fewer than three frames have no gap to even out and come back untouched.
 */
export function spreadFrames(frames: readonly NormalizedFrame[], axis: SpreadAxis): NormalizedFrame[] {
  const out = frames.map((f) => ({ ...f }));
  if (frames.length < 3) return out;
  const across = axis === "across";
  const startOf = (f: NormalizedFrame) => (across ? f.x : f.y);
  const sizeOf = (f: NormalizedFrame) => (across ? f.width : f.height);
  // Index order is the Layers list's order, which says nothing about where a
  // layer sits, so the run is taken from the face: leading edge first, and a
  // tie broken by the list so the result never depends on sort stability.
  const order = frames.map((f, i) => i).sort((a, b) => startOf(frames[a]!) - startOf(frames[b]!) || a - b);
  const first = frames[order[0]!]!;
  const start = startOf(first);
  const end = Math.max(...frames.map((f) => startOf(f) + sizeOf(f)));
  const total = frames.reduce((sum, f) => sum + sizeOf(f), 0);
  const gap = (end - start - total) / (frames.length - 1);
  let at = start;
  for (const i of order) {
    const f = out[i]!;
    if (across) f.x = round3(at);
    else f.y = round3(at);
    at += sizeOf(f) + gap;
  }
  return out;
}
