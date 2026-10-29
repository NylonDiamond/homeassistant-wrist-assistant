// A room's floor and wall colours: the keys checked and ordered as the
// store does, the edit that sets or clears one (one undo step, one save)
// and every room edit keeping them, the room inspector's two rows, the 2D
// looks that carry them (plan, night, warm, clay) by the shared rules and
// the ones that ignore them (lines, blueprint, dots), and the 3D view's
// colours and rebuild key.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  type HomeMapOp,
  backToScan,
  moveCorner,
  moveRoom,
  moveRoomToFloor,
  resizeRoom,
  setRoomColor,
  setRoomFinish,
  splitRoom,
  turnRoom,
} from "../src/home-map/edit-ops.js";
import type { HomeMapEditorContext, HomeMapSelection } from "../src/home-map/editor-mode.js";
import { HomeMapSession } from "../src/home-map/editor-session.js";
import { ArrangeMode, HOME_MAP_FLOOR_COLOR_PRESETS, HOME_MAP_WALL_COLOR_PRESETS } from "../src/home-map/mode-arrange.js";
import { type HomeMapDocument, type HomeMapRoom, checkHomeMap, orderedRoom } from "../src/home-map/model.js";
import type { HomeMapApi } from "../src/home-map/save.js";
import { homeMapRoomColors, homeMapRoomKey } from "../src/home-map/scene3d.js";
import { type HomeTileLook, homeTileArt } from "../src/home-map/tile-art.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const room = (doc: HomeMapDocument, roomId: string) => doc.floors.flatMap((f) => f.rooms).find((r) => r.id === roomId)!;

/** The edit's result, checked as the store checks it, and the input left
 * as it was. */
function done(before: HomeMapDocument, after: HomeMapDocument | undefined): HomeMapDocument {
  expect(after).toBeDefined();
  const text = JSON.stringify(before);
  const out = checkHomeMap(after);
  if (!out.ok) throw new Error(out.message);
  expect(JSON.stringify(out.doc)).toBe(JSON.stringify(after));
  expect(JSON.stringify(before)).toBe(text);
  return after!;
}

function refusal(change: (d: Record<string, any>) => void): string | undefined {
  const doc = fixture() as unknown as Record<string, any>;
  change(doc);
  const out = checkHomeMap(doc);
  return out.ok ? undefined : out.message;
}

/** The fixture with the living room in a walnut floor and charcoal walls. */
function coloured(): HomeMapDocument {
  const start = fixture();
  const floor = done(start, setRoomColor(start, LIVING, "floorColor", "#6b4a32"));
  return done(floor, setRoomColor(floor, LIVING, "wallColor", "#3E4044"));
}

describe("a room's colour keys", () => {
  it("are kept after the finish, floor before wall, in the case they were sent", () => {
    const doc = fixture() as unknown as Record<string, any>;
    const living = doc.floors[0].rooms[0];
    Object.assign(living, { wallColor: "#cfc6b8", floorColor: "#B98B5A", finish: "wood" });
    const out = checkHomeMap(doc);
    if (!out.ok) throw new Error(out.message);
    const checked = out.doc.floors[0]!.rooms[0]!;
    expect(Object.keys(checked)).toEqual(["id", "name", "areaId", "finish", "floorColor", "wallColor", "outline", "height", "walls", "openings", "objects"]);
    expect(checked.floorColor).toBe("#B98B5A");
    expect(checked.wallColor).toBe("#cfc6b8");
    // Either alone, with no finish.
    const plain = fixture() as unknown as Record<string, any>;
    plain.floors[0].rooms[0].wallColor = "#3E4044";
    const kept = checkHomeMap(plain);
    expect(kept.ok && Object.keys(kept.doc.floors[0]!.rooms[0]!)).toEqual(["id", "name", "areaId", "wallColor", "outline", "height", "walls", "openings", "objects"]);
  });

  it("are refused empty or not #RRGGBB, in the store's words", () => {
    for (const part of ["floorColor", "wallColor"]) {
      const words = `doc.floors[0].rooms[0].${part} must be a colour like #8E8E93`;
      for (const bad of ["", "warm", "8E8E93", "#8E8E9", "#8E8E93FF", "#GGGGGG", null, 3]) {
        expect(refusal((d) => { d.floors[0].rooms[0][part] = bad; })).toBe(words);
      }
    }
  });

  it("are ordered by orderedRoom and never kept empty", () => {
    const living = fixture().floors[0]!.rooms[0]!;
    const shuffled = { wallColor: "#3E4044", ...living, floorColor: "#B98B5A", finish: "tile" } as HomeMapRoom;
    expect(Object.keys(orderedRoom(shuffled)).slice(0, 6)).toEqual(["id", "name", "areaId", "finish", "floorColor", "wallColor"]);
    expect(Object.keys(orderedRoom({ ...shuffled, floorColor: "", wallColor: undefined }))).not.toContain("floorColor");
    expect(Object.keys(orderedRoom({ ...shuffled, floorColor: "", wallColor: undefined }))).not.toContain("wallColor");
  });
});

describe("colouring a room", () => {
  it("sets a colour in upper case and Default takes the key away", () => {
    const both = coloured();
    expect(room(both, LIVING)).toMatchObject({ floorColor: "#6B4A32", wallColor: "#3E4044" });
    const back = done(both, setRoomColor(both, LIVING, "floorColor", undefined));
    expect(room(back, LIVING)).not.toHaveProperty("floorColor");
    expect(room(back, LIVING).wallColor).toBe("#3E4044");
    expect(room(back, KITCHEN)).not.toHaveProperty("wallColor");
  });

  it("makes no edit for the same colour, a bad one, a room that is gone or a part it does not know", () => {
    const both = coloured();
    expect(setRoomColor(both, LIVING, "floorColor", "#6b4a32")).toBeUndefined();
    expect(setRoomColor(fixture(), LIVING, "wallColor", undefined)).toBeUndefined();
    expect(setRoomColor(fixture(), LIVING, "wallColor", "grey")).toBeUndefined();
    expect(setRoomColor(fixture(), id(99), "wallColor", "#3E4044")).toBeUndefined();
    expect(setRoomColor(fixture(), LIVING, "ceilingColor" as "wallColor", "#3E4044")).toBeUndefined();
  });

  it("is one undo step and one save for each pick", async () => {
    const saves: HomeMapDocument[] = [];
    const api: HomeMapApi = { get: async () => ({ doc: fixture(), rev: 1 }), save: async (doc, baseRev) => { saves.push(doc); return { rev: baseRev + 1 }; } };
    const s = new HomeMapSession(api, { doc: fixture(), rev: 1 });
    expect(s.apply((d) => setRoomColor(d, LIVING, "floorColor", "#D9B88A"))).toBe(true);
    await s.idle();
    expect(saves).toHaveLength(1);
    expect(room(saves[0]!, LIVING).floorColor).toBe("#D9B88A");
    expect(s.apply((d) => setRoomColor(d, LIVING, "wallColor", "#A3B09A"))).toBe(true);
    await s.idle();
    expect(saves).toHaveLength(2);
    expect(s.undo()).toBe(true);
    expect(room(s.doc!, LIVING)).not.toHaveProperty("wallColor");
    expect(room(s.doc!, LIVING).floorColor).toBe("#D9B88A");
    expect(s.undo()).toBe(true);
    expect(room(s.doc!, LIVING)).not.toHaveProperty("floorColor");
  });

  it("keeps them through a move, a turn, a resize, a corner moved, a new finish, another floor and back to its scan", () => {
    const start = coloured();
    const keeps = (doc: HomeMapDocument, roomId = LIVING) => expect(room(doc, roomId)).toMatchObject({ floorColor: "#6B4A32", wallColor: "#3E4044" });
    keeps(done(start, moveRoom(start, LIVING, 1, 0.5)));
    keeps(done(start, turnRoom(start, LIVING, 90)));
    keeps(done(start, resizeRoom(start, LIVING, { width: 7 })));
    keeps(done(start, moveCorner(start, LIVING, 0, [-0.5, -0.5])));
    keeps(done(start, setRoomFinish(start, LIVING, "tile")));
    keeps(done(start, moveRoomToFloor(start, LIVING, { newFloor: { id: id(7), name: "Annex", story: 1 } })));
    const living = room(start, LIVING);
    const scan = { outline: [[0, 0], [5, 0], [5, 4], [0, 4]] as [number, number][], walls: [], openings: [], objects: [], at: "2026-10-01T00:00:00Z" };
    keeps(done(start, backToScan(start, LIVING, scan)));
    expect(living.outline).not.toEqual(scan.outline);
  });

  it("gives both halves of a split room the colours", () => {
    const start = coloured();
    const out = done(start, splitRoom(start, LIVING, [3, 0], [3, 5], id(9), "Dining"));
    for (const roomId of [LIVING, id(9)]) {
      expect(room(out, roomId), roomId).toMatchObject({ floorColor: "#6B4A32", wallColor: "#3E4044" });
    }
    expect(Object.keys(room(out, id(9))).slice(0, 4)).toEqual(["id", "name", "floorColor", "wallColor"]);
  });
});

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}
function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}
function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

/** The room inspector's text for the living room on `doc`. */
function inspect(doc: HomeMapDocument): string {
  const selection: HomeMapSelection = { kind: "room", roomId: LIVING };
  const ctx = {
    hass: undefined,
    doc,
    floor: doc.floors[0]!,
    selection,
    toggles: { snap: true, square: true, grid: false, measure: false, live: false },
    pages: [],
    areas: [],
    furnitureBase: undefined,
    apply: (_op: HomeMapOp) => false,
    preview: () => {},
    select: () => {},
    redraw: () => {},
  } as unknown as HomeMapEditorContext;
  return flatten(new ArrangeMode().inspector(ctx));
}

describe("the room inspector's colours", () => {
  it("shows a floor and a wall row in the Floor finish card, the floor's presets by its finish", () => {
    const start = fixture();
    const text = inspect(start);
    const card = text.slice(text.indexOf(">Floor finish<"), text.indexOf(">In this room<"));
    expect(card).toContain(">Floor<");
    expect(card).toContain(">Walls<");
    expect(card).toContain("Default");
    expect(card).toContain("Custom");
    // The living room's finish is guessed as wood.
    for (const p of HOME_MAP_FLOOR_COLOR_PRESETS.wood) expect(card).toContain(p.hex);
    for (const p of HOME_MAP_WALL_COLOR_PRESETS) expect(card).toContain(p.hex);
    expect(card).not.toContain(HOME_MAP_FLOOR_COLOR_PRESETS.tile[3]!.hex);
    // A tile floor offers the tile colours.
    const tile = inspect(done(start, setRoomFinish(start, LIVING, "tile")));
    for (const p of HOME_MAP_FLOOR_COLOR_PRESETS.tile) expect(tile).toContain(p.hex);
    expect(tile).not.toContain(HOME_MAP_FLOOR_COLOR_PRESETS.wood[2]!.hex);
  });

  it("offers the spec's presets in its order", () => {
    const names = (list: readonly { name: string; hex: string }[]) => list.map((p) => `${p.name} ${p.hex}`);
    expect(names(HOME_MAP_FLOOR_COLOR_PRESETS.wood)).toEqual(["Light oak #D9B88A", "Oak #B98B5A", "Walnut #6B4A32", "Grey wash #9A948C"]);
    expect(names(HOME_MAP_FLOOR_COLOR_PRESETS.tile)).toEqual(["White #E9E7E2", "Grey #8E8E8A", "Black #2E2E30", "Terracotta #B4664A"]);
    expect(names(HOME_MAP_FLOOR_COLOR_PRESETS.stone)).toEqual(["Light #C9C3B8", "Sand #B8A98E", "Slate #5E6468"]);
    expect(names(HOME_MAP_FLOOR_COLOR_PRESETS.carpet)).toEqual(["Grey #8E8E93", "Beige #CBB9A0", "Navy #2E4A7D", "Green #4F6B4A"]);
    expect(names(HOME_MAP_FLOOR_COLOR_PRESETS.plain)).toEqual(["White #E9E7E2", "Grey #8E8E8A", "Black #2E2E30"]);
    expect(names(HOME_MAP_WALL_COLOR_PRESETS)).toEqual([
      "White #F2F0EB", "Warm white #EDE6D8", "Greige #CFC6B8", "Sage #A3B09A", "Blue grey #8C9AA6", "Charcoal #3E4044",
    ]);
  });

  it("marks a picked preset and a custom colour", () => {
    const start = fixture();
    const preset = inspect(done(start, setRoomColor(start, LIVING, "wallColor", "#a3b09a")));
    expect(preset).toMatch(/class="hme-colour on" style=--c:#A3B09A/);
    const custom = inspect(done(start, setRoomColor(start, LIVING, "floorColor", "#123456")));
    expect(custom).toContain("background:#123456");
  });
});

describe("a room's colours in the 2D looks", () => {
  const states = { "light.reading_lamp": { state: "on", attributes: { brightness: 200 } }, "light.ceiling": { state: "off" } };
  const draw = (doc: HomeMapDocument, look: HomeTileLook) =>
    flatten(homeTileArt({ floor: doc.floors[0]!, states, look, width: 600, height: 400, turn: -28, names: true, devices: "all", furniture: true, glow: true }));
  /** The fixture's living room on a wood floor, with `colors`. */
  const painted = (colors: Partial<Pick<HomeMapRoom, "floorColor" | "wallColor">>, finish: HomeMapRoom["finish"] = "wood") => {
    const doc = fixture();
    Object.assign(doc.floors[0]!.rooms[0]!, { finish, ...colors });
    return doc;
  };
  const count = (text: string, part: string) => text.split(part).length - 1;
  const floorFill = (text: string, roomId: string) => text.match(new RegExp(`class="hmt-floor" data-room=${roomId} points=[-\\d., ]+? fill=([^ />]+)`))?.[1];

  it("lays the plan's floor in the room's colour and its boards in a darker shade of it", () => {
    const plain = draw(painted({}), "plan");
    const walnut = draw(painted({ floorColor: "#B98B5A" }), "plan");
    expect(floorFill(walnut, LIVING)).toBe("rgb(185,139,90)");
    expect(floorFill(walnut, KITCHEN)).toBe(floorFill(plain, KITCHEN));
    expect(floorFill(plain, LIVING)).not.toBe("rgb(185,139,90)");
    // F × 0.6 at 0.38.
    expect(walnut).toContain("stroke=rgba(111,83,54,0.38)");
    expect(plain).not.toContain("stroke=rgba(111,83,54,0.38)");
    // Tile keeps its black lines.
    const tile = draw(painted({ floorColor: "#B4664A" }, "tile"), "plan");
    expect(floorFill(tile, LIVING)).toBe("rgb(180,102,74)");
    expect(count(tile, "stroke=rgba(0,0,0,0.14)")).toBe(count(draw(painted({}, "tile"), "plan"), "stroke=rgba(0,0,0,0.14)"));
  });

  it("draws the plan's wall faces in the room's colour, the dark edge kept", () => {
    const plain = draw(painted({}), "plan");
    const sage = draw(painted({ wallColor: "#A3B09A" }), "plan");
    const face = "stroke=rgb(242,237,230)";
    const mine = "stroke=rgb(163,176,154)";
    expect(count(plain, mine)).toBe(0);
    expect(count(sage, mine)).toBeGreaterThan(0);
    // The living room's faces moved to its colour; the kitchen keeps the pale
    // ones, and the door leaves too.
    expect(count(sage, face)).toBeGreaterThan(0);
    expect(count(sage, mine) + count(sage, face)).toBe(count(plain, face));
    expect(count(sage, "stroke=rgba(0,0,0,0.55)")).toBe(count(plain, "stroke=rgba(0,0,0,0.55)"));
  });

  it("darkens the floor and walls by each model's factors in night, warm and clay", () => {
    const red = painted({ floorColor: "#B98B5A", wallColor: "#FF0000" });
    const tops: Record<string, [string, string, number]> = {
      // floor F × k, wall top W × k, wall side factor
      night: ["rgb(67,50,32)", "rgb(78,0,0)", 0.147],
      warm: ["rgb(102,76,50)", "rgb(82,0,0)", 0.175],
      clay: ["rgb(185,139,90)", "rgb(255,0,0)", 0.93],
    };
    for (const [look, [floor, top, side]] of Object.entries(tops)) {
      const text = draw(red, look as HomeTileLook);
      expect(floorFill(text, LIVING), look).toBe(floor);
      expect(floorFill(text, KITCHEN), look).toBe(floorFill(draw(fixture(), look as HomeTileLook), KITCHEN));
      expect(text, look).toContain(`fill=${top} />`);
      // Every side of the living room's walls is a shade of red within the
      // side's factor and the face shading (0.68 to 0.96).
      const sides = [...text.matchAll(/fill=rgb\((\d+),0,0\)/g)].map((m) => Number(m[1]));
      const low = Math.floor(255 * side * 0.68);
      const high = Math.ceil(255 * side * 0.96);
      expect(sides.filter((r) => r >= low && r <= high).length, look).toBeGreaterThan(0);
    }
  });

  it("leaves lines, blueprint and dots as they were", () => {
    const plain = fixture();
    const both = painted({ floorColor: "#B98B5A", wallColor: "#FF0000" }, undefined);
    for (const look of ["lines", "blueprint", "dots"] as const) {
      expect(draw(both, look), look).toBe(draw(plain, look));
    }
  });
});

describe("a room's colours in 3D", () => {
  it("takes the room's colours for its floor and walls, else the finish's and the plain wall", () => {
    const living = room(coloured(), LIVING);
    expect(homeMapRoomColors(living)).toEqual({ floor: "#6B4A32", wall: "#3E4044" });
    expect(homeMapRoomColors({ ...living, floorColor: "#b98b5a" }).floor).toBe("#B98B5A");
    const plain = homeMapRoomColors(room(fixture(), LIVING));
    expect(typeof plain.floor).toBe("number");
    expect(typeof plain.wall).toBe("number");
  });

  it("builds a room again when its colours change, and only that room", () => {
    const start = fixture();
    const next = done(start, setRoomColor(start, LIVING, "wallColor", "#8C9AA6"));
    expect(homeMapRoomKey(room(next, LIVING))).not.toBe(homeMapRoomKey(room(start, LIVING)));
    expect(homeMapRoomKey(room(next, KITCHEN))).toBe(homeMapRoomKey(room(start, KITCHEN)));
    const floor = done(next, setRoomColor(next, LIVING, "floorColor", "#9A948C"));
    expect(homeMapRoomKey(room(floor, LIVING))).not.toBe(homeMapRoomKey(room(next, LIVING)));
  });
});
