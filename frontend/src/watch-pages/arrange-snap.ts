// Where a dragged part of a tile lands (the Custom layout, `arrange-card.ts`).
// As in the complication editor's canvas, a drag snaps: on each axis the part's
// start, middle or end lands on the nearest line of the tile's content box or
// of another part while one is near, else on the grid. Option or Alt places it
// freely. Nothing here draws.
//
// What is stored is the tile key `arrange` as the apps already read it
// (`one-look/arrange.ts`): the spot nearest the part, and a small offset from
// that spot. So a part keeps its side of the tile on every device, whatever
// its width: a name dropped on the left stays on the left, aligned left.

import { type ArrangePart, type ArrangePartEntry, type ArrangeSpot, arrangePartRect } from "./one-look/arrange.js";
import type { OneLookRect, OneLookSize } from "./one-look/layout.js";

/** The grid a part snaps to: the tile's content box cut in this many columns
 * and rows. An even number of each, so its middle lines are grid lines. */
export const ARRANGE_GRID = { across: 12, down: 8 } as const;

/** What a drag knows about the part it moves. */
export interface ArrangeSnapInput {
  tile: OneLookSize;
  /** The tile's content box, which the spots anchor to. */
  content: OneLookRect;
  /** The part's native rect, which its size comes from. */
  native: OneLookRect;
  part: ArrangePart;
  /** The part's entry when the press began. */
  entry: ArrangePartEntry | undefined;
  /** Where it was drawn when the press began: the glyph's ink, the name's
   * text, the state's box. This is what lines up, not a larger empty box. */
  drawn: OneLookRect;
  /** The other parts as drawn, to line up with. */
  others: readonly OneLookRect[];
  /** How near a line must be to take the part, in the tile's points. */
  threshold: number;
  /** Option or Alt is down: no snapping. */
  free: boolean;
}

/** Where a drag leaves a part, and the lines it landed on, to draw. */
export interface ArrangeSnapped {
  entry: ArrangePartEntry;
  guides: { x?: number; y?: number };
}

/** A span held inside a box of `length` from `from`, or centred on it when it
 * is the larger. */
function clampSpan(start: number, size: number, from: number, length: number): number {
  return size >= length ? from + (length - size) / 2 : Math.max(from, Math.min(start, from + length - size));
}

/** The lines of a box on one axis: its start, its middle and its end. */
function spanLines(start: number, size: number): number[] {
  return [start, start + size / 2, start + size];
}

/** One axis of a drag: the span's new start, and the line it landed on when
 * that line was a box's and not just the grid's. Snapping holds the part inside
 * the content box, where a spot would put it, and cuts that box in `cells`;
 * placed freely it may go to the tile's edge. */
function snapAxis(start: number, size: number, tile: number, boxStart: number, box: number, cells: number, lines: readonly number[], threshold: number, free: boolean): { start: number; guide?: number } {
  if (free) return { start: clampSpan(start, size, 0, tile) };
  const at = clampSpan(start, size, boxStart, box);
  let best: { move: number; line: number } | undefined;
  for (const own of spanLines(at, size)) {
    for (const line of lines) {
      const move = line - own;
      if (Math.abs(move) <= threshold && (best === undefined || Math.abs(move) < Math.abs(best.move))) best = { move, line };
    }
  }
  if (best !== undefined) return { start: clampSpan(at + best.move, size, boxStart, box), guide: best.line };
  const step = box / cells;
  const moves = spanLines(at, size).map((own) => boxStart + Math.round((own - boxStart) / step) * step - own);
  const move = moves.reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a));
  return { start: clampSpan(at + move, size, boxStart, box) };
}

/** Which third of a length a span's middle is in. */
function thirdOf(start: number, size: number, length: number): 0 | 1 | 2 {
  const middle = start + size / 2;
  return middle < length / 3 ? 0 : middle > (2 * length) / 3 ? 2 : 1;
}

/** An offset as stored: a share of the tile, to a thousandth, none at all
 * under half a point. */
function storedOffset(points: number, length: number): number {
  if (!(length > 0) || Math.abs(points) < 0.5) return 0;
  return Math.round((points / length) * 1000) / 1000 + 0;
}

/**
 * Where a part dragged by (`moveX`, `moveY`) points lands. The spot written is the one nearest where it lands, with what is left
 * as an offset, so on a tile of another width it stays near that side. The
 * name's text aligns to that side too: its box is nearly the tile's width, so
 * what moves is the text, from the box's start, middle or end.
 */
export function snappedArrangePart(input: ArrangeSnapInput, moveX: number, moveY: number): ArrangeSnapped {
  const { tile, content, native, part, entry, drawn, others, threshold, free } = input;
  const lines = {
    x: [...spanLines(content.x, content.width), ...others.flatMap((o) => spanLines(o.x, o.width))],
    y: [...spanLines(content.y, content.height), ...others.flatMap((o) => spanLines(o.y, o.height))],
  };
  const x = snapAxis(drawn.x + moveX, drawn.width, tile.width, content.x, content.width, ARRANGE_GRID.across, lines.x, threshold, free);
  const y = snapAxis(drawn.y + moveY, drawn.height, tile.height, content.y, content.height, ARRANGE_GRID.down, lines.y, threshold, free);

  const placed = arrangePartRect(tile, content, native, part, entry).rect;
  const col = thirdOf(x.start, drawn.width, tile.width);
  const row = thirdOf(y.start, drawn.height, tile.height);
  // The box's left and top for the place the drawn part landed on.
  const boxX = part === "name"
    ? (col === 0 ? x.start : col === 1 ? x.start + drawn.width / 2 - placed.width / 2 : x.start + drawn.width - placed.width)
    : x.start - (drawn.x - placed.x);
  const boxY = y.start - (drawn.y - placed.y);
  const anchorX = col === 0 ? content.x : col === 1 ? content.x + content.width / 2 - placed.width / 2 : content.x + content.width - placed.width;
  const anchorY = row === 0 ? content.y : row === 1 ? content.y + content.height / 2 - placed.height / 2 : content.y + content.height - placed.height;
  const spot = `${["t", "m", "b"][row]!}${["l", "c", "r"][col]!}` as ArrangeSpot;
  const { dx: _dx, dy: _dy, ...rest } = entry ?? {};
  const dx = storedOffset(boxX - anchorX, tile.width);
  const dy = storedOffset(boxY - anchorY, tile.height);
  return {
    entry: { ...rest, spot, ...(dx === 0 ? {} : { dx }), ...(dy === 0 ? {} : { dy }) },
    guides: { ...(x.guide === undefined ? {} : { x: x.guide }), ...(y.guide === undefined ? {} : { y: y.guide }) },
  };
}
