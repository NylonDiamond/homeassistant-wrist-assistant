// A room's name on the plan stands in free floor, with floor showing round
// it, not flush against a piece. The two rooms are copied from Jesse's live
// map (2026-11-18), where each room's label point lies on a piece (the
// office's desk, the bathroom's toilet) and the names used to land touching
// it, 0 to 2 px away, which reads as the name lying on the piece. Now the
// office's name keeps 10 px of floor from each piece, and the bathroom's,
// in a room barely wider than its name, at least 4 px.

import { describe, expect, it } from "vitest";
import { homeMapLabelObstacles, homeMapPlaceLabel } from "../src/home-map/free-spot.js";
import { homeLabelPoint } from "../src/home-map/geometry.js";
import type { HomeMapObject, HomeMapRoom, HomePoint } from "../src/home-map/model.js";

const thing = (o: Partial<HomeMapObject> & Pick<HomeMapObject, "kind" | "c" | "size" | "turn">) => o as HomeMapObject;

const jesseOffice = {
  name: "Jesse Office",
  outline: [[10.91, 3.43], [7.69, 3.43], [7.69, 0.02], [10.91, 0.02]] as HomePoint[],
  objects: [
    thing({ kind: "table", model: "desk", c: [8.95, 1.44], size: [1.25, 0.84, 0.64], turn: 89.98 }),
    thing({ kind: "chair", model: "chairDesk", c: [8.62, 1.24], size: [0.63, 0.7, 1.09], turn: -82.36 }),
    thing({ kind: "sofa", c: [10.14, 0.66], size: [0.85, 0.94, 0.96], turn: -60.02 }),
  ],
  pins: [[10.44, 2.93], [8.95, 1.44], [8.06, 1.48]] as HomePoint[],
  wait: 3,
};

const masterBathroom = {
  name: "Master Bathroom",
  outline: [[6.11, 2.91], [4.67, 2.91], [4.67, 0.02], [6.11, 0.02]] as HomePoint[],
  objects: [
    thing({ kind: "bathtub", c: [5.39, 2.54], size: [1.47, 0.82, 0.44], turn: 179.98 }),
    thing({ kind: "toilet", model: "toilet", c: [5.76, 1.64], size: [0.44, 0.73, 0.84], turn: -90.02 }),
    thing({ kind: "storage", model: "bathroomCabinetDrawer", c: [5.39, 0.31], size: [1.47, 0.58, 0.77], turn: -0.02 }),
    thing({ kind: "sink", c: [5.02, 0.32], size: [0.49, 0.39, 0.19], turn: -0.02, lift: 0.57 }),
    thing({ kind: "sink", c: [5.74, 0.34], size: [0.51, 0.42, 0.21], turn: -0.02, lift: 0.55 }),
    thing({ kind: "mirror", model: "bathroomMirror", c: [4.97, 0.22], size: [0.6, 0.29, 0.87], turn: 0, lift: 1.1 }),
    thing({ kind: "mirror", model: "bathroomMirror", c: [5.83, 0.22], size: [0.6, 0.29, 0.87], turn: 0, lift: 1.1 }),
  ],
  pins: [[4.78, 0.54]] as HomePoint[],
  wait: 2,
};

type Fixture = typeof jesseOffice;

/** The distance from `p` to the segment `a`-`b`. */
function toSegment(p: HomePoint, a: HomePoint, b: HomePoint): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

/** Whether a point is inside a convex outline (either winding). */
function insideConvex(p: HomePoint, poly: readonly HomePoint[]): boolean {
  let sign = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const cross = (poly[i]![0] - poly[j]![0]) * (p[1] - poly[j]![1]) - (poly[i]![1] - poly[j]![1]) * (p[0] - poly[j]![0]);
    if (cross === 0) continue;
    if (sign === 0) sign = Math.sign(cross);
    else if (Math.sign(cross) !== sign) return false;
  }
  return true;
}

/** How far apart two convex outlines are: 0 when they touch, negative
 * when they overlap. Worked out on its own, not with the code under test. */
function gapBetween(a: readonly HomePoint[], b: readonly HomePoint[]): number {
  if (a.some((p) => insideConvex(p, b)) || b.some((p) => insideConvex(p, a))) return -1;
  let best = Infinity;
  for (const [ps, poly] of [[a, b], [b, a]] as const) {
    for (const p of ps) for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) best = Math.min(best, toSegment(p, poly[j]!, poly[i]!));
  }
  return best;
}

/** The room's name as the editor's `labels()` places it on a stage at
 * `scale` pixels a meter: the same pill sizes, obstacles and placement. */
function placeName(room: Fixture, scale: number) {
  const toScreen = (p: readonly number[]): HomePoint => [40 + p[0]! * scale, 40 + p[1]! * scale];
  const full = { ...room, id: room.name } as unknown as HomeMapRoom;
  const name = `${room.name} · ${room.wait} wait`;
  const size = "2.9 × 1.4 m";
  const xs = room.outline.map((p) => p[0]);
  const ys = room.outline.map((p) => p[1]);
  const roomW = (Math.max(...xs) - Math.min(...xs)) * scale;
  const roomH = (Math.max(...ys) - Math.min(...ys)) * scale;
  const nameW = name.length * 7.4 + 22;
  if (nameW > roomW * 0.95 || roomH < 26) return undefined;
  const both = Math.max(nameW, size.length * 5.8 + 22) <= roomW * 0.95 && roomH >= 48;
  const w = both ? Math.max(nameW, size.length * 5.8 + 22) : nameW;
  const h = both ? 36 : 22;
  const pills: (readonly [number, number])[] = both ? [[w / 2, h / 2], [nameW / 2, 11]] : [[nameW / 2, 11]];
  const obstacles = homeMapLabelObstacles(full, toScreen, room.pins.map((p) => ({ c: toScreen(p), r: 15 })), []);
  const placed = homeMapPlaceLabel(toScreen(homeLabelPoint(full)!), pills, obstacles);
  if (placed === undefined) return { box: undefined, obstacles };
  const [hx, hy] = pills[placed.pill]!;
  const [x, y] = placed.at;
  const box: HomePoint[] = [[x - hx, y - hy], [x + hx, y - hy], [x + hx, y + hy], [x - hx, y + hy]];
  return { box, obstacles };
}

describe("a room's name on the plan", () => {
  it("stands off every piece in Jesse Office with floor showing round it", () => {
    for (const scale of [87, 120, 150, 200, 300]) {
      const { box, obstacles } = placeName(jesseOffice, scale)!;
      expect(box, `scale ${scale}`).toBeDefined();
      for (const piece of obstacles.boxes) expect(gapBetween(box!, piece), `scale ${scale}`).toBeGreaterThanOrEqual(10);
    }
  });

  it("stands off the toilet and the rest in the Master Bathroom, as far as the narrow room lets it", () => {
    let placed = 0;
    for (const scale of [120, 150, 200, 300]) {
      const out = placeName(masterBathroom, scale);
      if (out?.box === undefined) continue;
      placed += 1;
      const gaps = out.obstacles.boxes.map((piece) => gapBetween(out.box!, piece));
      for (const g of gaps) expect(g, `scale ${scale}`).toBeGreaterThanOrEqual(4);
      // Clear of the walls too, and inside the room.
      const walls = out.obstacles.room;
      for (const corner of out.box!) {
        expect(insideConvex(corner, walls), `scale ${scale}`).toBe(true);
        const wall = Math.min(...walls.map((q, i) => toSegment(corner, walls[(i + walls.length - 1) % walls.length]!, q)));
        expect(wall, `scale ${scale}`).toBeGreaterThanOrEqual(4);
      }
    }
    // At the zooms the room is wide enough for the name at all.
    expect(placed).toBeGreaterThanOrEqual(3);
  });

  it("keeps the size line when it fits with floor round it, and drops it before touching a piece", () => {
    const room: HomePoint[] = [[0, 0], [200, 0], [200, 100], [0, 100]];
    const none = { room, boxes: [], circles: [], taken: [] };
    const pills = [[60, 18], [50, 11]] as const;
    expect(homeMapPlaceLabel([100, 50], pills, none)).toEqual({ at: [100, 50], pill: 0 });
    // A band of floor 40 high between two pieces: the full pill (36 high)
    // would stand 2 px from each, so the name alone (22 high) stands in it
    // with floor showing above and below.
    const top: HomePoint[] = [[0, 0], [200, 0], [200, 35], [0, 35]];
    const bottom: HomePoint[] = [[0, 75], [200, 75], [200, 100], [0, 100]];
    const band = homeMapPlaceLabel([100, 55], pills, { ...none, boxes: [top, bottom] })!;
    expect(band.pill).toBe(1);
    expect(band.at[1] - 11).toBeGreaterThanOrEqual(35 + 4);
    expect(band.at[1] + 11).toBeLessThanOrEqual(75 - 4);
    // With no name alone to fall back on, the full pill still stands there.
    expect(homeMapPlaceLabel([100, 55], [pills[0]], { ...none, boxes: [top, bottom] })?.pill).toBe(0);
  });

  it("touches a piece only when no spot has floor round it, and is left out with no spot at all", () => {
    const room: HomePoint[] = [[0, 0], [200, 0], [200, 100], [0, 100]];
    // A slot exactly the pill's height: it stands there, edge to edge.
    const top: HomePoint[] = [[0, 0], [200, 0], [200, 39], [0, 39]];
    const bottom: HomePoint[] = [[0, 61], [200, 61], [200, 100], [0, 100]];
    const tight = homeMapPlaceLabel([100, 50], [[50, 11]], { room, boxes: [top, bottom], circles: [], taken: [] });
    expect(tight).toEqual({ at: [100, 50], pill: 0 });
    // A room filled by one piece: the name is left out, as before.
    expect(homeMapPlaceLabel([100, 50], [[50, 11]], { room, boxes: [room], circles: [], taken: [] })).toBeUndefined();
  });
});
