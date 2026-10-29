// The furniture on the plan seen from above: every piece of the furniture
// catalog drawn as itself rather than the plain box a kind with no drawing
// stays, tinted by its own fabric and wood colours, turned with the thing
// and, as the 3D view stands it, never flipped to face a wall; a rug drawn
// under everything else with no shadow; the editor's plan drawing a scanned
// thing with no model as the piece the 3D view picks, in that model's own
// colours (the catalog's `paint`) under the thing's own; and the tile's
// plan of a map with no catalog pieces drawn exactly as before (the plan's
// hash is in `home-map-editor-shell.test.ts`).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { addPiece } from "../src/home-map/edit-ops.js";
import { homeFurnitureArt, homeFurnitureOutline } from "../src/home-map/furniture-art.js";
import { HOME_MAP_FURNITURE, homeMapPiece, homeMapPlanLook } from "../src/home-map/furniture.js";
import type { HomeMapDocument } from "../src/home-map/model.js";
import { homeTileArt } from "../src/home-map/tile-art.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}
function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in node && "values" in node) {
    const t = node as Tpl;
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

/** A piece at 50 drawing units a meter, as the plan draws it at a middling
 * zoom. */
const SCALE = 50;
const draw = (kind: string, size: readonly number[], look = {}) => flatten(homeFurnitureArt(kind, size[0]! * SCALE, size[1]! * SCALE, SCALE, look));

describe("the furniture's top views", () => {
  it("draws every catalog piece as itself, none as the plain box", () => {
    const kinds = new Set<string>();
    for (const piece of HOME_MAP_FURNITURE.pieces) {
      kinds.add(piece.kind);
      const text = draw(piece.kind, piece.size, { model: piece.id });
      const box = draw("somethingUnknown", piece.size);
      expect(text, piece.id).not.toBe(box);
      expect(text, piece.id).not.toMatch(/NaN|undefined|Infinity/);
      expect(text.length, piece.id).toBeGreaterThan(80);
      // Its shadow is drawn from the same shape, a rug and a ceiling fan
      // casting none.
      const shadow = flatten(homeFurnitureOutline(piece.kind, piece.size[0]! * SCALE, piece.size[1]! * SCALE, "black", { model: piece.id }));
      expect(shadow === "", piece.id).toBe(piece.kind === "rug" || piece.kind === "fan");
    }
    // Each catalog kind, drawn by its kind alone (no model), also has its
    // own drawing.
    for (const kind of kinds) {
      const size = HOME_MAP_FURNITURE.pieces.find((p) => p.kind === kind)!.size;
      expect(draw(kind, size), kind).not.toBe(draw("somethingUnknown", size));
    }
  });

  it("keeps a kind with no drawing a plain box, and a scanned piece with no model as it was", () => {
    expect(draw("vacuum", [0.4, 0.4])).toBe(draw("somethingUnknown", [0.4, 0.4]));
    // No model and no colours: the scan's drawing, unchanged.
    for (const kind of ["sofa", "bed", "chair", "table", "storage", "television", "toilet"]) {
      expect(draw(kind, [1.6, 0.9], {}), kind).toBe(draw(kind, [1.6, 0.9], { model: undefined, fabric: undefined, wood: undefined }));
    }
  });

  it("draws the pieces the spec names with their parts", () => {
    // An office chair's star of five feet and round seat.
    const office = draw("chair", [0.6, 0.56], { model: "chairDesk" });
    expect(office.match(/L-?\d/g)?.length).toBe(5);
    expect(office).toContain("<ellipse");
    // A plant's leaves round its pot.
    expect(draw("plant", [0.45, 0.51], { model: "pottedPlant" }).split("<ellipse").length - 1).toBe(7);
    // A lamp's round shade and warm bulb.
    expect(draw("lamp", [0.33, 0.38], { model: "lampRoundFloor" })).toContain("rgb(255,232,180)");
    // A corner sofa and a corner desk lie in an L along the back and the
    // right, as their models do.
    expect(draw("sofa", [2.4, 2.4], { model: "loungeSofaCorner" })).toContain("<path d=M-60 -60H60V60H7.2V-7.2H-60Z");
    expect(draw("table", [1.6, 1.6], { model: "deskCorner" })).toContain("<path");
    // A rug lies flat, its border in from its edge, no box line round it.
    expect(draw("rug", [2, 1.17], { model: "rugRectangle" })).not.toContain("rgba(0,0,0,0.34)");
  });

  it("tints a piece by its fabric and wood, a lamp's shade by its fabric", () => {
    const plain = draw("sofa", [2, 0.84], { model: "loungeSofa" });
    const navy = draw("sofa", [2, 0.84], { model: "loungeSofa", fabric: "#2E4A7D" });
    expect(navy).not.toBe(plain);
    expect(navy).toContain("rgb(46,74,125)");
    // The darker back is the fabric's own shade.
    expect(navy).toContain("rgb(34,55,93)");
    const walnut = draw("table", [1.6, 0.85], { model: "table", wood: "#6B4A32" });
    expect(walnut).toContain("rgb(107,74,50)");
    expect(walnut).not.toContain("url(#wa-hmf-table)");
    expect(draw("lamp", [0.33, 0.38], { model: "lampRoundTable", fabric: "#C9A13B" })).toContain("rgb(201,161,59)");
    // A colour that is not one is ignored.
    expect(draw("sofa", [2, 0.84], { model: "loungeSofa", fabric: "navy" })).toBe(plain);
  });
});

describe("the editor's plan draws the 3D view's piece", () => {
  const editorPlan = (doc: HomeMapDocument) => flatten(homeTileArt({ floor: doc.floors[0]!, look: "plan", width: 1000, height: 600, names: false, furniture: true, furnitureLook: homeMapPlanLook, frame: { scale: 50, ox: 0, oy: 0 } }));
  const tilePlan = (doc: HomeMapDocument) => flatten(homeTileArt({ floor: doc.floors[0]!, look: "plan", width: 1000, height: 600, names: false, furniture: true, frame: { scale: 50, ox: 0, oy: 0 } }));

  it("gives every catalog piece its model's own colours", () => {
    for (const piece of HOME_MAP_FURNITURE.pieces) {
      expect(piece.paint, piece.id).toBeDefined();
      for (const hex of Object.values(piece.paint ?? {})) expect(hex, piece.id).toMatch(/^#[0-9A-F]{6}$/);
      // A piece with fabric or wood parts has their colour.
      if (piece.fabric === true) expect(piece.paint?.fabric, piece.id).toBeDefined();
      if (piece.wood === true) expect(piece.paint?.wood, piece.id).toBeDefined();
    }
  });

  it("draws a scanned thing with no model as its kind's default piece, as the 3D view does, in that piece's colours", () => {
    const desk = { kind: "table", c: [1, 1] as [number, number], size: [1.4, 0.7, 0.75] as [number, number, number], turn: 0 };
    expect(homeMapPlanLook(desk)).toEqual({ model: "table", kind: "table", fabric: undefined, wood: "#F3CCA8", body: undefined });
    // Its own colours win over the model's.
    expect(homeMapPlanLook({ ...desk, wood: "#3B2A20" }).wood).toBe("#3B2A20");
    // A dishwasher is drawn as the cupboard the 3D view stands there.
    expect(homeMapPlanLook({ ...desk, kind: "dishwasher" })).toMatchObject({ model: "kitchenCabinet", kind: "storage" });
    // A kind with no piece stays as it was.
    expect(homeMapPlanLook({ ...desk, kind: "vacuum" })).toEqual({ model: undefined, fabric: undefined, wood: undefined });
  });

  it("paints the fixture's scanned sofa and tables in the models' colours on the editor's plan only", () => {
    const doc = fixture();
    const editor = editorPlan(doc);
    // The sofa's pink fabric and the tables' light wood, sRGB of the models'
    // carpet and wood.
    expect(editor).toContain("rgb(249,163,158)");
    expect(editor).toContain("rgb(243,204,168)");
    // The tile's own plan keeps its grey furniture.
    const tile = tilePlan(doc);
    expect(tile).not.toContain("rgb(249,163,158)");
    expect(tile).toContain("rgb(120,110,102)");
  });
});

describe("the furniture on the plan", () => {
  const plan = (doc: HomeMapDocument) => flatten(homeTileArt({ floor: doc.floors[0]!, look: "plan", width: 1000, height: 600, names: false, furniture: true, frame: { scale: 50, ox: 0, oy: 0 } }));

  it("turns a catalog piece with the thing, never flipped to face a wall", () => {
    const doc = addPiece(fixture(), LIVING, homeMapPiece("chairDesk")!, [1, 1])!;
    const room = doc.floors[0]!.rooms[0]!;
    const at = room.objects.length - 1;
    const turned: HomeMapDocument = { ...doc, floors: [{ ...doc.floors[0]!, rooms: [{ ...room, objects: room.objects.map((o, i) => (i === at ? { ...o, turn: 30 } : o)) }, ...doc.floors[0]!.rooms.slice(1)] }] };
    const text = plan(turned);
    expect(text).toContain("translate(50 50) rotate(-30) scale(1 1)");
    // Its back against the room's top wall or not, the same way round.
    const facing = plan(doc);
    expect(facing).toContain("translate(50 50) rotate(0) scale(1 1)");
  });

  it("lays a rug under everything else, with no shadow", () => {
    const doc = addPiece(fixture(), LIVING, homeMapPiece("rugRectangle")!, [2.7, 3.5])!;
    const text = plan(doc);
    const rug = text.indexOf("data-kind=rug");
    const sofa = text.indexOf("data-kind=sofa");
    expect(rug).toBeGreaterThan(0);
    expect(rug).toBeLessThan(sofa);
    const rugPiece = text.slice(rug, text.indexOf("data-kind=", rug + 1));
    expect(rugPiece).not.toContain("filter=");
  });
});
