// The furniture catalog's rules that need no catalog: a piece's shape, how
// a model is fitted to a thing's box and where a new piece starts off the
// floor. Kept apart from `furniture.ts`, which holds the catalog itself,
// because `edit-ops.ts` needs these and is in the panel's first download
// (the watch page tiles import it), where the catalog must never land.

/** One piece of the catalog. */
export interface HomeMapFurniturePiece {
  /** Its model's name, `<id>.glb`; what an object's `model` holds. */
  id: string;
  /** The kind a thing made from it takes. */
  kind: string;
  name: string;
  /** One of the catalog's `groups`. */
  group: string;
  /** Width, depth and height in meters, the model's own proportions. */
  size: [number, number, number];
  /** Where a new one stands off the floor, in meters. */
  lift?: number;
  /** A new one hangs with its top at the room's height. */
  ceiling?: true;
}

/** How much a model is stretched along its own x (width), y (height) and z
 * (depth) to fill a thing's box `size` (width, depth, height), from the
 * model's natural bounds `natural` (x, z, y: width, depth, height). The
 * depth is never squashed below half the lesser of the other two
 * stretches. A natural size of 0 stretches by 1. */
export function homeMapModelFit(natural: readonly [number, number, number], size: readonly [number, number, number]): { x: number; y: number; z: number } {
  const [nw, nd, nh] = natural;
  const [w, d, h] = size;
  const by = (want: number, have: number) => (have > 1e-6 ? want / have : 1);
  const x = by(w, nw);
  const y = by(h, nh);
  const z = Math.max(by(d, nd), 0.5 * Math.min(x, y));
  return { x, y, z };
}

/** Where a new piece starts off the floor of a room `roomHeight` tall: its
 * own `lift`, or for one that hangs from the ceiling the room's height less
 * its own, never below the floor. */
export function homeMapPieceLift(piece: Pick<HomeMapFurniturePiece, "size" | "lift" | "ceiling">, roomHeight: number): number {
  if (piece.ceiling === true) return Math.max(roomHeight - piece.size[2], 0);
  return Math.max(piece.lift ?? 0, 0);
}

/** A piece's size as the picker shows it: "1.60 × 0.84 m". */
export function homeMapPieceSizeText(piece: Pick<HomeMapFurniturePiece, "size">): string {
  return `${piece.size[0].toFixed(2)} × ${piece.size[1].toFixed(2)} m`;
}
