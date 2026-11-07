import type { TemplateSnapBox } from "./template-item-snap.js";

export interface SelectionPoint { x: number; y: number }
export interface TemplateSelectionRect { x: number; y: number; width: number; height: number }

/** Dragging either way gives the same rectangle, clipped to the tile. */
export function templateSelectionRect(from: SelectionPoint, to: SelectionPoint): TemplateSelectionRect {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const a = { x: clamp(from.x), y: clamp(from.y) }, b = { x: clamp(to.x), y: clamp(to.y) };
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
}

/** A box selects visible items it overlaps. A modifier adds to the selection
 * present at pointer-down, so moving back out does not leave items behind. */
export function templateMarqueeSelection(boxes: readonly TemplateSnapBox[], rect: TemplateSelectionRect, before: readonly string[] = [], additive = false): string[] {
  const keys = new Set(additive ? before : []);
  if (rect.width > 0 && rect.height > 0) for (const box of boxes) {
    const overlapX = Math.min(box.x + box.width, rect.x + rect.width) - Math.max(box.x, rect.x);
    const overlapY = Math.min(box.y + box.height, rect.y + rect.height) - Math.max(box.y, rect.y);
    if (box.width > 0 && box.height > 0 && overlapX > 1e-9 && overlapY > 1e-9) keys.add(box.key);
  }
  return [...keys];
}
