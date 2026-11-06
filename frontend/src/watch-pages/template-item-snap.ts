// Guides use the visible item bounds, not its grid point. Like the
// complication canvas, a nearby element wins over the fixed grid.
import { nearestGuide, guideThreshold, type GuideLine } from "../interact.js";

export interface TemplateSnapBox {
  key: string;
  x: number; y: number; width: number; height: number;
  /** Text baseline as a fraction of the content height; icons have none. */
  baseline?: number;
}
export interface TemplateSnapInput {
  moving: readonly TemplateSnapBox[];
  others: readonly TemplateSnapBox[];
  /** Stored centers, including any selected item that is not yet drawn. */
  centers: readonly { x: number; y: number }[];
  lead: { x: number; y: number };
  width: number;
  height: number;
  dx: number;
  dy: number;
  on: boolean;
  free: boolean;
}
export interface TemplateSnappedMove { dx: number; dy: number; guides: GuideLine[] }
const edges = (start: number, size: number): number[] => [start, start + size, start + size / 2];

export function snapTemplateItems(input: TemplateSnapInput): TemplateSnappedMove {
  const { moving, centers, lead, width, height } = input;
  let { dx, dy } = input;
  let hitX: { at: number; delta: number } | undefined, hitY: { at: number; delta: number } | undefined;
  if (input.on && !input.free && width > 0 && height > 0) {
    const own = new Set(moving.map(p => p.key));
    const others = input.others.filter(p => !own.has(p.key));
    const threshold = guideThreshold({ width, height }, 7);
    const xLines: GuideLine[] = [0, .5, 1].map(at => ({ axis: "x", at }));
    const yLines: GuideLine[] = [0, .5, 1].map(at => ({ axis: "y", at }));
    for (const box of others) {
      xLines.push(...edges(box.x, box.width).map(at => ({ axis: "x" as const, at })));
      yLines.push(...edges(box.y, box.height).map(at => ({ axis: "y" as const, at })));
    }
    hitX = nearestGuide(moving.flatMap(p => edges(p.x + dx, p.width)), xLines, "x", threshold.x);
    // Different text sizes sit on the same baseline even when their boxes
    // have different centers. Baselines only attract other text baselines.
    const baselines = others.flatMap(p => p.baseline === undefined ? [] : [{ axis: "y" as const, at: p.baseline }]);
    hitY = nearestGuide(moving.flatMap(p => p.baseline === undefined ? [] : [p.baseline + dy]), baselines, "y", threshold.y)
      ?? nearestGuide(moving.flatMap(p => edges(p.y + dy, p.height)), yLines, "y", threshold.y);
    dx = hitX ? dx + hitX.delta : Math.round((lead.x + dx) * 20) / 20 - lead.x;
    dy = hitY ? dy + hitY.delta : Math.round((lead.y + dy) * 20) / 20 - lead.y;
  }
  const snappedX = dx, snappedY = dy;
  if (centers.length > 0) {
    dx = Math.max(-Math.min(...centers.map(p => p.x)), Math.min(1 - Math.max(...centers.map(p => p.x)), dx));
    dy = Math.max(-Math.min(...centers.map(p => p.y)), Math.min(1 - Math.max(...centers.map(p => p.y)), dy));
  }
  const guides: GuideLine[] = [];
  // Never draw a guide when keeping the group on the tile moved it off it.
  if (hitX && Math.abs(dx - snappedX) < 1e-8) guides.push({ axis: "x", at: hitX.at });
  if (hitY && Math.abs(dy - snappedY) < 1e-8) guides.push({ axis: "y", at: hitY.at });
  return { dx, dy, guides };
}
