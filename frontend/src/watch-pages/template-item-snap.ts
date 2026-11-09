// Guides use the visible item bounds, not its grid point. Like the
// complication canvas, a nearby element wins over the fixed grid.
import { nearestGuide, guideThreshold, guideCandidates, type GuideLine } from "../interact.js";

export interface TemplateSnapBox {
  key: string;
  x: number; y: number; width: number; height: number;
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
  /** The grid is shown. Only then does an item with no guide near it step to
   * the grid; otherwise it stays under the pointer. */
  grid: boolean;
}
export interface TemplateAlignmentGuide extends GuideLine { from: number; to: number }
export interface TemplateSnappedMove { dx: number; dy: number; guides: TemplateAlignmentGuide[] }
const edges = (start: number, size: number): number[] => [start, start + size / 2, start + size];

function groupBox(boxes: readonly TemplateSnapBox[]): TemplateSnapBox | undefined {
  if (boxes.length === 0) return undefined;
  const x = Math.min(...boxes.map(p => p.x)), y = Math.min(...boxes.map(p => p.y));
  return { key: "selection", x, y, width: Math.max(...boxes.map(p => p.x + p.width)) - x, height: Math.max(...boxes.map(p => p.y + p.height)) - y };
}

export function snapTemplateItems(input: TemplateSnapInput): TemplateSnappedMove {
  const { moving, centers, lead, width, height } = input;
  const group = groupBox(moving);
  let { dx, dy } = input;
  let others: TemplateSnapBox[] = [];
  let hitX: { at: number; delta: number } | undefined, hitY: { at: number; delta: number } | undefined;
  if (input.on && !input.free && width > 0 && height > 0) {
    const own = new Set(moving.map(p => p.key));
    others = input.others.filter(p => !own.has(p.key));
    // Share the complication canvas's candidate lines and 3-pixel catch
    // range. A selection offers its outer frame, not every member's edges.
    const threshold = guideThreshold({ width, height });
    const lines = guideCandidates(others.map(p => ({ ...p, rotationDegrees: 0 })));
    if (group) {
      hitX = nearestGuide(edges(group.x + dx, group.width), lines, "x", threshold.x);
      hitY = nearestGuide(edges(group.y + dy, group.height), lines, "y", threshold.y);
    }
    const step = (start: number, delta: number) => input.grid ? Math.round((start + delta) * 20) / 20 - start : delta;
    dx = hitX ? dx + hitX.delta : step(lead.x, dx);
    dy = hitY ? dy + hitY.delta : step(lead.y, dy);
  }
  const snappedX = dx, snappedY = dy;
  if (centers.length > 0) {
    dx = Math.max(-Math.min(...centers.map(p => p.x)), Math.min(1 - Math.max(...centers.map(p => p.x)), dx));
    dy = Math.max(-Math.min(...centers.map(p => p.y)), Math.min(1 - Math.max(...centers.map(p => p.y)), dy));
  }
  // Keep snapping on both axes, but show only the closest alignment on an
  // axis the pointer is actually moving. An already-aligned row should not
  // compete with the column the user is trying to reach.
  const candidates: { guide: TemplateAlignmentGuide; distance: number }[] = [];
  for (const [axis, hit, raw, snapped, actual, pixels] of [
    ["x", hitX, input.dx, snappedX, dx, width],
    ["y", hitY, input.dy, snappedY, dy, height],
  ] as const) {
    if (!hit || Math.abs(actual - snapped) >= 1e-8 || Math.abs(raw * pixels) < 1) continue;
    const guide = alignmentSpan(axis, hit.at, group ? [group] : [], others, dx, dy, width, height);
    if (guide) candidates.push({ guide, distance: Math.abs(hit.delta * pixels) });
  }
  candidates.sort((a, b) => a.distance - b.distance);
  return { dx, dy, guides: candidates.slice(0, 1).map(c => c.guide) };
}

/** Draw just the connection between the nearest aligned pair, with a small
 * overhang. Whole-tile lines make unrelated content look involved. */
function alignmentSpan(axis: "x" | "y", at: number, moving: readonly TemplateSnapBox[], others: readonly TemplateSnapBox[], dx: number, dy: number, width: number, height: number): TemplateAlignmentGuide | undefined {
  const anchors = (p: TemplateSnapBox): number[] => axis === "x" ? edges(p.x, p.width) : edges(p.y, p.height);
  const matches = (p: TemplateSnapBox): boolean => anchors(p).some(v => Math.abs(v - at) <= .00051);
  const range = (p: TemplateSnapBox): [number, number] => axis === "x" ? [p.y, p.y + p.height] : [p.x, p.x + p.width];
  const sources = moving.map(p => ({ ...p, x: p.x + dx, y: p.y + dy })).filter(matches);
  const targets = others.filter(matches);
  let span: [number, number] | undefined;
  for (const source of sources) for (const target of targets) {
    const a = range(source), b = range(target);
    const pair: [number, number] = [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
    if (!span || pair[1] - pair[0] < span[1] - span[0]) span = pair;
  }
  // The tile center is useful; its outer edges do not need an extra guide.
  if (!span && Math.abs(at - .5) < 1e-8 && sources[0]) span = range(sources[0]);
  if (!span) return undefined;
  const pad = 4 / (axis === "x" ? height : width);
  const from = Math.max(0, Math.min(1, span[0] - pad)), to = Math.max(0, Math.min(1, span[1] + pad));
  return to > from ? { axis, at, from, to } : undefined;
}
