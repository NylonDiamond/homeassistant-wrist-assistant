// The furniture catalog's rules that need no catalog: a piece's shape, how
// a model is fitted to a thing's box, where a new piece starts off the floor
// and where the device a thing holds sits on it (a lamp's bulb, a TV's
// screen, else the middle of its top). Kept apart from `furniture.ts`, which
// holds the catalog itself, because `edit-ops.ts` needs these and is in the
// panel's first download (the watch page tiles import it), where the catalog
// must never land. For the same reason the catalog's lamps (`bulb`) and the
// pieces with a `hold` spot are copied here (`HOME_MAP_LAMP_PIECES`,
// `HOME_MAP_HOLD_PIECES`), with the kinds whose default piece is one of them,
// and a test keeps the copies equal to the catalog.

import { type HomeMapObject, type HomePoint, homeMapRound } from "./model.js";

/** How a lamp's light shines: all round from its bulb, or down out of a
 * shade that opens downwards (a spot). */
export type HomeMapLampCast = "point" | "down";

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
  /** Its model has fabric parts a thing's `fabric` recolours. */
  fabric?: true;
  /** Its model has wood parts a thing's `wood` recolours. */
  wood?: true;
  /** A lamp's only: where its bulb sits, as shares 0 to 1 of the model's own
   * box before its turn, x along its width, y along its depth (0 its back)
   * and z up from its bottom; the middle of its shade, measured from the
   * model. A piece with one can hold a light. */
  bulb?: [number, number, number];
  /** A lamp's only: how its light shines. */
  cast?: HomeMapLampCast;
  /** Where a device the thing holds sits when it is not a light in a bulb,
   * as `bulb` is measured: a TV's the middle of its screen's front, so its
   * pin sits on the screen. Absent, the middle of the thing's top
   * (`HOME_MAP_MIDDLE_TOP`). */
  hold?: [number, number, number];
  /** Its model's own colours, `#RRGGBB` as the panel writes them, read from
   * the model's materials: its fabric and wood (the colours a thing's own
   * `fabric` and `wood` replace) and its body, the other part seen most from
   * above. The editor's plan paints the piece's top view in them. */
  paint?: HomeMapPiecePaint;
}

/** A piece's own colours (`HomeMapFurniturePiece.paint`). */
export interface HomeMapPiecePaint {
  fabric?: string;
  wood?: string;
  body?: string;
}

/** The catalog's lamps (`furniture-catalog.json`, every piece of kind
 * `lamp`), byte for byte the same numbers, for the edits that put a light in
 * one. */
const LAMP_PAINT: HomeMapPiecePaint = { fabric: "#FFF5CA", body: "#DFEAEC" };

export const HOME_MAP_LAMP_PIECES: readonly HomeMapFurniturePiece[] = [
  { id: "lampRoundFloor", kind: "lamp", name: "Floor lamp", group: "Lights", size: [0.33, 0.38, 1.87], fabric: true, bulb: [0.5, 0.5, 0.9], cast: "point", paint: LAMP_PAINT },
  { id: "lampSquareFloor", kind: "lamp", name: "Square floor lamp", group: "Lights", size: [0.25, 0.25, 1.79], fabric: true, bulb: [0.5, 0.5, 0.58], cast: "point", paint: LAMP_PAINT },
  { id: "lampRoundTable", kind: "lamp", name: "Table lamp", group: "Lights", size: [0.3, 0.35, 0.62], lift: 0.75, fabric: true, bulb: [0.5, 0.5, 0.72], cast: "point", paint: LAMP_PAINT },
  { id: "lampSquareTable", kind: "lamp", name: "Square table lamp", group: "Lights", size: [0.25, 0.25, 0.6], lift: 0.75, fabric: true, bulb: [0.5, 0.5, 0.74], cast: "point", paint: LAMP_PAINT },
  { id: "lampWall", kind: "lamp", name: "Wall lamp", group: "Lights", size: [0.25, 0.17, 0.1], lift: 1.6, fabric: true, bulb: [0.5, 0.4, 0.5], cast: "point", paint: LAMP_PAINT },
  { id: "lampSquareCeiling", kind: "lamp", name: "Ceiling lamp", group: "Lights", size: [0.5, 0.5, 0.96], ceiling: true, fabric: true, bulb: [0.5, 0.5, 0.5], cast: "down", paint: LAMP_PAINT },
];

/** The catalog's pieces with a `hold` spot, byte for byte the same numbers,
 * for the edits that put a device on one. */
export const HOME_MAP_HOLD_PIECES: readonly HomeMapFurniturePiece[] = [
  { id: "televisionModern", kind: "television", name: "TV", group: "Living", size: [1.2, 0.22, 0.8], hold: [0.5, 0.66, 0.58], paint: { body: "#96A7A7" } },
  { id: "televisionVintage", kind: "television", name: "Old TV", group: "Living", size: [0.6, 0.4, 0.4], wood: true, hold: [0.51, 0.94, 0.49], paint: { wood: "#F3CCA8", body: "#96A7A7" } },
  { id: "computerScreen", kind: "screen", name: "Monitor", group: "Office", size: [0.6, 0.16, 0.45], lift: 0.75, hold: [0.5, 0.5, 0.58], paint: { body: "#96A7A7" } },
];

/** The catalog's `defaults` whose piece is copied here: a thing of the kind
 * with no `model` draws as that piece. */
export const HOME_MAP_HOLD_DEFAULTS: Readonly<Record<string, string>> = { television: "televisionModern" };

const lampsById = new Map(HOME_MAP_LAMP_PIECES.map((p) => [p.id, p]));
const holdersById = new Map([...HOME_MAP_LAMP_PIECES, ...HOME_MAP_HOLD_PIECES].map((p) => [p.id, p]));

/** The middle of a thing's top, as shares of its box: where a device it
 * holds sits when its piece says nothing else. */
export const HOME_MAP_MIDDLE_TOP: readonly [number, number, number] = [0.5, 0.5, 1];

/** The copied piece a thing draws as, for where a device it holds sits: the
 * one its `model` names, or with no model its kind's default; undefined for
 * any other, whose device then sits on the middle of its top whatever its
 * piece, since a model is fitted to the thing's whole height. */
export function homeMapHoldPiece(object: Pick<HomeMapObject, "kind" | "model">): HomeMapFurniturePiece | undefined {
  if (object.model !== undefined) return holdersById.get(object.model);
  const fallback = Object.hasOwn(HOME_MAP_HOLD_DEFAULTS, object.kind) ? HOME_MAP_HOLD_DEFAULTS[object.kind] : undefined;
  return fallback === undefined ? undefined : holdersById.get(fallback);
}

/** The lamp a thing's `model` names when that lamp can hold a light (it has
 * a bulb), else undefined: a thing with no model, another piece, or a model
 * this catalog does not know. */
export function homeMapLampPiece(model: string | undefined): HomeMapFurniturePiece | undefined {
  const piece = model === undefined ? undefined : lampsById.get(model);
  return piece?.bulb === undefined ? undefined : piece;
}

/** The lamps a new light can be put in, as its chooser offers them, and
 * `bulb`, a light in no lamp. */
export type HomeMapLampChoice = "ceiling" | "floor" | "table" | "wall" | "bulb";

/** The chooser's choices in its order. */
export const HOME_MAP_LAMP_CHOICES: readonly HomeMapLampChoice[] = ["ceiling", "floor", "table", "wall", "bulb"];

/** The lamp each choice makes, by its piece's id; none for `bulb`. */
export const HOME_MAP_LAMP_CHOICE_MODELS: Readonly<Record<HomeMapLampChoice, string | undefined>> = {
  ceiling: "lampSquareCeiling",
  floor: "lampRoundFloor",
  table: "lampRoundTable",
  wall: "lampWall",
  bulb: undefined,
};

/**
 * Where the device a thing holds sits, as a pin's `at` (x, y on the plan and
 * z up from the floor, each to 1 cm as a pin is kept): for a light (`light`
 * true) in a piece with a `bulb`, the bulb; else the piece's `hold` spot;
 * else the middle of the thing's top (`HOME_MAP_MIDDLE_TOP`). The shares are
 * taken across the thing's box with `piece`'s model fitted to it as the 3D
 * look fits it (`homeMapModelFit`, so a model kept from squashing reaches
 * past a thin box), from its middle along its width and depth, turned by its
 * `turn` (counterclockwise on the plan, as the map stores it), and up from
 * where the look stands the model's bottom, its `lift` (a ceiling lamp's lift
 * is where it hangs). With no piece the box is taken as it is.
 */
export function homeMapHoldSpot(
  object: Pick<HomeMapObject, "c" | "size" | "turn" | "lift">,
  piece: Pick<HomeMapFurniturePiece, "size" | "bulb" | "hold"> | undefined,
  light: boolean,
): [number, number, number] {
  const share = (light ? piece?.bulb : undefined) ?? piece?.hold ?? HOME_MAP_MIDDLE_TOP;
  const size: [number, number, number] = [Math.max(object.size[0], 0.01), Math.max(object.size[1], 0.01), Math.max(object.size[2], 0.01)];
  const natural = piece?.size ?? size;
  const fit = homeMapModelFit(natural, size);
  const across = (share[0] - 0.5) * natural[0] * fit.x;
  const deep = (share[1] - 0.5) * natural[1] * fit.z;
  const up = share[2] * natural[2] * fit.y;
  // The thing's width runs along u, its depth along v (`homeMapObjectAxes`).
  const angle = (-object.turn * Math.PI) / 180;
  const u: HomePoint = [Math.cos(angle), Math.sin(angle)];
  const v: HomePoint = [-u[1], u[0]];
  return [
    homeMapRound(object.c[0] + u[0] * across + v[0] * deep),
    homeMapRound(object.c[1] + u[1] * across + v[1] * deep),
    homeMapRound(Math.max(object.lift ?? 0, 0) + up),
  ];
}

/** The parts of a piece a thing can colour, fabric before wood: none for a
 * plain box or a piece with neither. */
export function homeMapPieceParts(piece: Pick<HomeMapFurniturePiece, "fabric" | "wood"> | undefined): ("fabric" | "wood")[] {
  if (piece === undefined) return [];
  const parts: ("fabric" | "wood")[] = [];
  if (piece.fabric === true) parts.push("fabric");
  if (piece.wood === true) parts.push("wood");
  return parts;
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
