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
// stretch, so a TV keeps its stand. A lamp can hold a light: its `bulb`
// says where the bulb sits in the model's own box and `cast` how it shines
// (`homeMapBulbSpot`). A piece's `paint` is its model's own fabric, wood and
// body colours, read from the model's materials, which the editor's plan
// draws its top view in (`homeMapPlanLook`). Nothing here draws;
// `scene3d.ts` and `furniture-art.ts` do.
// This file is the editor's alone: the catalog never reaches the panel's
// first download, and three.js never reaches this file's chunk.

import catalogJson from "./furniture-catalog.json";
import type { HomeFurnitureLook } from "./furniture-art.js";
import type { HomeMapFurniturePiece } from "./furniture-rules.js";
import type { HomeMapObject } from "./model.js";

export {
  type HomeMapFurniturePiece,
  type HomeMapLampCast,
  type HomeMapLampChoice,
  HOME_MAP_LAMP_CHOICES,
  HOME_MAP_LAMP_CHOICE_MODELS,
  homeMapBulbSpot,
  homeMapLampPiece,
  homeMapModelFit,
  homeMapPieceLift,
  homeMapPieceParts,
  homeMapPieceSizeText,
} from "./furniture-rules.js";

/** A colour the Colours card offers for a part. */
export interface HomeMapPartPreset {
  name: string;
  /** `#RRGGBB`, upper case, as the panel writes it. */
  hex: string;
}

/** The fabric colours offered before a custom one. */
export const HOME_MAP_FABRIC_PRESETS: readonly HomeMapPartPreset[] = [
  { name: "Grey", hex: "#8E8E93" },
  { name: "Charcoal", hex: "#3A3A3C" },
  { name: "Cream", hex: "#E8DCC8" },
  { name: "Navy", hex: "#2E4A7D" },
  { name: "Green", hex: "#4F6B4A" },
  { name: "Mustard", hex: "#C9A13B" },
  { name: "Rust", hex: "#A0522D" },
  { name: "Blush", hex: "#D8A7A0" },
];

/** The wood colours offered before a custom one. */
export const HOME_MAP_WOOD_PRESETS: readonly HomeMapPartPreset[] = [
  { name: "Light oak", hex: "#D9B88A" },
  { name: "Oak", hex: "#B98B5A" },
  { name: "Walnut", hex: "#6B4A32" },
  { name: "Espresso", hex: "#3B2A20" },
  { name: "White", hex: "#EDEDED" },
  { name: "Black", hex: "#2A2A2A" },
];

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

/** How the editor's plan draws a thing from above: as the piece the 3D
 * view draws it as (`homeMapPieceOf`, so a scanned thing with no `model`
 * is its kind's default piece there too), in the piece's own colours
 * (`paint`) under the thing's own fabric and wood. A thing with no piece
 * keeps its kind and draws as it always did. */
export function homeMapPlanLook(object: HomeMapObject): HomeFurnitureLook {
  const piece = homeMapPieceOf(object);
  if (piece === undefined) return { model: object.model, fabric: object.fabric, wood: object.wood };
  const paint = piece.paint;
  return {
    model: piece.id,
    kind: piece.kind,
    fabric: object.fabric ?? paint?.fabric,
    wood: object.wood ?? paint?.wood,
    body: paint?.body,
  };
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
