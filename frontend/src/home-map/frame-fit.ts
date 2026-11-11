// How far the 3D look's camera stands to show a whole floor, and where it
// looks: the floor's box (its plan bounds, from the ground up to its
// tallest room) seen from `turn` degrees round and `polar` down from
// straight above, as near as keeps all eight corners in view. The box fills
// `fill` of the view in its tighter direction and never more in the other,
// and sits in the middle of it. Plain maths, no three.js, so it tests
// without a browser.
//
// World axes are three's: the plan's x is x, the plan's y is z, up is y.

export interface HomeMapFrameBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** The tallest room's height; the box stands on the ground. */
  top: number;
}

export interface HomeMapFrameView {
  /** Degrees round from the plan's foot, as the model looks turn. */
  turn: number;
  /** Radians down from straight above. */
  polar: number;
  /** The camera's vertical field of view, in radians. */
  vfov: number;
  /** Width over height. */
  aspect: number;
  /** The share of the view the box spans in its tighter direction. */
  fill?: number;
}

export interface HomeMapFrame {
  distance: number;
  target: [number, number, number];
  /** From the target towards the camera, one long. */
  direction: [number, number, number];
}

/** A plan side shorter than this is framed as this long, so a tiny room is
 * not seen absurdly close. */
export const HOME_MAP_FRAME_MIN_SIDE = 3;
export const HOME_MAP_FRAME_FILL = 0.88;

export function homeMapFrameFit(box: HomeMapFrameBox, view: HomeMapFrameView): HomeMapFrame {
  const fill = view.fill ?? HOME_MAP_FRAME_FILL;
  const aspect = view.aspect > 0 ? view.aspect : 1;
  const tanV = Math.tan(view.vfov / 2);
  const tanH = tanV * aspect;
  const t = (view.turn * Math.PI) / 180;
  const sp = Math.sin(view.polar);
  const cp = Math.cos(view.polar);
  // The camera's own axes, as a camera looking at the target with up as up
  // has them: d back towards the camera, x to the right, y up the screen.
  const d = [Math.sin(t) * sp, cp, Math.cos(t) * sp] as const;
  const x = [Math.cos(t), 0, -Math.sin(t)] as const;
  const y = [-cp * Math.sin(t), sp, -cp * Math.cos(t)] as const;
  const grow = (lo: number, hi: number): [number, number] => {
    const short = HOME_MAP_FRAME_MIN_SIDE - (hi - lo);
    return short > 0 ? [lo - short / 2, hi + short / 2] : [lo, hi];
  };
  const [minX, maxX] = grow(box.minX, box.maxX);
  const [minZ, maxZ] = grow(box.minZ, box.maxZ);
  const top = Math.max(box.top, 0);
  const corners: [number, number, number][] = [];
  for (const cx of [minX, maxX]) for (const cy of [0, top]) for (const cz of [minZ, maxZ]) corners.push([cx, cy, cz]);
  const target: [number, number, number] = [(minX + maxX) / 2, top * 0.3, (minZ + maxZ) / 2];
  const dot = (a: readonly number[], b: readonly number[]): number => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
  const kx = fill * tanH;
  const ky = fill * tanV;
  // For each corner, how far right (a), up (b) and towards the camera (c)
  // of the target it is, and the distance that just keeps it in.
  const fit = (): { distance: number; mx: number; my: number } => {
    const q = corners.map((p) => [p[0] - target[0], p[1] - target[1], p[2] - target[2]]);
    const abc = q.map((v) => [dot(v, x), dot(v, y), dot(v, d)] as const);
    let distance = 0;
    for (const [a, b, c] of abc) distance = Math.max(distance, c + Math.max(Math.abs(a) / kx, Math.abs(b) / ky));
    let loX = Infinity;
    let hiX = -Infinity;
    let loY = Infinity;
    let hiY = -Infinity;
    for (const [a, b, c] of abc) {
      const u = a / ((distance - c) * tanH);
      const w = b / ((distance - c) * tanV);
      loX = Math.min(loX, u);
      hiX = Math.max(hiX, u);
      loY = Math.min(loY, w);
      hiY = Math.max(hiY, w);
    }
    return { distance, mx: (loX + hiX) / 2, my: (loY + hiY) / 2 };
  };
  // Move the target across the view until the box's picture is centred;
  // nearer corners move more than far ones, so it takes a few steps.
  let at = fit();
  for (let i = 0; i < 8 && (Math.abs(at.mx) > 1e-4 || Math.abs(at.my) > 1e-4); i++) {
    const sx = at.mx * at.distance * tanH;
    const sy = at.my * at.distance * tanV;
    for (let k = 0; k < 3; k++) target[k] = target[k]! + x[k]! * sx + y[k]! * sy;
    at = fit();
  }
  return { distance: at.distance, target, direction: [d[0], d[1], d[2]] };
}
