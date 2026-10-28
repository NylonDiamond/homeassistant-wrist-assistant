// The furniture catalog: the pieces the 3D look draws a thing as, and the
// rules the panel and the iPhone share for them (app repo
// `WristAssistant/Furniture/catalog.json` is a byte copy of
// `furniture-catalog.json`). Each piece is a model, `<id>.glb` in the
// integration's `frontend/furniture/` folder (Kenney Furniture Kit 2.0, CC0),
// with its default real size in meters (width along its own x, depth along
// its own y on the plan, height) and where a new one starts off the floor:
// `lift` meters up (on a desk, a counter, a wall), or `ceiling`, hung with
// its top at the room's height.
//
// Which piece a thing draws as: the one its `model` names, else its kind's
// default (a bed by its width, storage by its shape), else none, and the
// thing is the plain box it always was. A `model` the catalog does not know
// falls to the default, so a map saved by a newer catalog still draws.
//
// Fitting a piece to a thing's box (`furniture-rules.ts`): stretched to the
// box's width and height, and to its depth too, except that a very thin box
// (a scanned TV is 5 cm deep) never squashes the piece below half its other
// stretch, so a TV keeps its stand. Nothing here draws; `scene3d.ts` does.
// This file is the editor's alone: the catalog never reaches the panel's
// first download, and three.js never reaches this file's chunk.

import catalogJson from "./furniture-catalog.json";
import type { HomeMapFurniturePiece } from "./furniture-rules.js";
import type { HomeMapObject } from "./model.js";

export { type HomeMapFurniturePiece, homeMapModelFit, homeMapPieceLift, homeMapPieceSizeText } from "./furniture-rules.js";

export interface HomeMapFurnitureCatalog {
  v: number;
  source: string;
  groups: string[];
  /** A RoomPlan kind's piece, for a thing with no `model`. */
  defaults: Record<string, string>;
  pieces: HomeMapFurniturePiece[];
}

export const HOME_MAP_FURNITURE: HomeMapFurnitureCatalog = catalogJson as unknown as HomeMapFurnitureCatalog;

const byId = new Map(HOME_MAP_FURNITURE.pieces.map((p) => [p.id, p]));

/** A bed this wide or wider is a double. */
export const HOME_MAP_DOUBLE_BED_WIDTH = 1.3;

/** The piece with this id, if the catalog has it. */
export function homeMapPiece(id: string | undefined): HomeMapFurniturePiece | undefined {
  return id === undefined ? undefined : byId.get(id);
}

/** The piece a thing draws as: the one its `model` names; else its kind's
 * default, a bed a double when 1.3 m wide or more and else a single,
 * storage a wide dresser when as wide as it is tall or wider and else a
 * cupboard; else none (the plain box). */
export function homeMapPieceOf(object: Pick<HomeMapObject, "kind" | "model" | "size">): HomeMapFurniturePiece | undefined {
  const own = homeMapPiece(object.model);
  if (own !== undefined) return own;
  const [width, , height] = object.size;
  if (object.kind === "bed") return homeMapPiece(width >= HOME_MAP_DOUBLE_BED_WIDTH ? "bedDouble" : "bedSingle");
  if (object.kind === "storage") return homeMapPiece(width >= height ? "bookcaseClosedWide" : "bookcaseClosed");
  return homeMapPiece(HOME_MAP_FURNITURE.defaults[object.kind]);
}

/** The pieces whose name, group or kind holds every word of `query`, in
 * the catalog's order; with `kind`, the pieces of that kind first. */
export function homeMapPieceSearch(query: string, kind?: string): HomeMapFurniturePiece[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter((w) => w !== "");
  const found = HOME_MAP_FURNITURE.pieces.filter((p) => {
    const text = `${p.name} ${p.group} ${p.kind} ${p.id}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
  if (kind === undefined) return found;
  return [...found.filter((p) => p.kind === kind), ...found.filter((p) => p.kind !== kind)];
}
