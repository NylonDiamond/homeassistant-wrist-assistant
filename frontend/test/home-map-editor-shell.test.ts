// The map editor's shell, the parts that need no browser: which keys mean
// what and when a key belongs to a text field; the stage's pan and zoom;
// the sizes and names the editor writes; the selection's rules; the
// session that makes each edit at once, saves one at a time (edits made
// meanwhile go in one save), undoes without throwing away another device's
// change, and says why when a save fails; and the plan drawn at a fixed fit
// for the stage, with sliding doors and windows as two panes.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { HOME_MAP_ARRANGE_GRID, homeMapSnapPoint } from "../src/home-map/draw-tool.js";
import { addOpening, moveRoom, renameRoom, setRoomFinish } from "../src/home-map/edit-ops.js";
import { homeMapSelectionRoom, homeMapSelectionThere, sameHomeMapSelection } from "../src/home-map/editor-mode.js";
import { HomeMapSession, sameHomeMapDocument } from "../src/home-map/editor-session.js";
import {
  homeMapFitView,
  homeMapIsTypingTarget,
  homeMapMeters,
  homeMapNumberText,
  homeMapObjectName,
  homeMapOpeningName,
  homeMapParseNumber,
  homeMapRoomBox,
  homeMapRoomSize,
  homeMapRoomSizeText,
  homeMapShortcut,
  homeMapToPlan,
  homeMapToScreen,
  homeMapWallName,
  homeMapWallSide,
  homeMapZoomAt,
  homeMapZoomPercent,
} from "../src/home-map/editor-view.js";
import { homeSlidingPanes } from "../src/home-map/geometry.js";
import { homeMapSaveWords } from "../src/home-map/home-map-editor.js";
import { homeMapDeleteRoomText } from "../src/home-map/mode-arrange.js";
import { HOME_MAP_SHAPE_TOOLS, homeMapFixAllLabel, homeMapShapeToolFor } from "../src/home-map/mode-shape.js";
import type { HomeMapDocument, HomeMapRead } from "../src/home-map/model.js";
import { HOME_MAP_GONE_TEXT, HOME_MAP_MERGED_TEXT, type HomeMapApi } from "../src/home-map/save.js";
import { homeTileArt } from "../src/home-map/tile-art.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";

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

describe("the editor's keys", () => {
  it("undoes and redoes with Cmd or Ctrl, and leaves a text field's keys alone", () => {
    expect(homeMapShortcut({ key: "z", metaKey: true }, false)).toBe("undo");
    expect(homeMapShortcut({ key: "z", ctrlKey: true }, false)).toBe("undo");
    expect(homeMapShortcut({ key: "Z", metaKey: true, shiftKey: true }, false)).toBe("redo");
    expect(homeMapShortcut({ key: "y", ctrlKey: true }, false)).toBe("redo");
    expect(homeMapShortcut({ key: "z", metaKey: true }, true)).toBeUndefined();
    expect(homeMapShortcut({ key: "d" }, true)).toBeUndefined();
    expect(homeMapShortcut({ key: "c", metaKey: true }, false)).toBeUndefined();
  });

  it("hands a lone letter to the mode, and reads Escape, Delete, Enter, zoom and the arrows", () => {
    expect(homeMapShortcut({ key: "D" }, false)).toEqual({ letter: "d" });
    expect(homeMapShortcut({ key: "D", shiftKey: true }, false)).toBeUndefined();
    expect(homeMapShortcut({ key: "d", altKey: true }, false)).toBeUndefined();
    expect(homeMapShortcut({ key: "Escape" }, false)).toBe("cancel");
    expect(homeMapShortcut({ key: "Backspace" }, false)).toBe("delete");
    expect(homeMapShortcut({ key: "Delete" }, false)).toBe("delete");
    expect(homeMapShortcut({ key: "Enter" }, false)).toBe("enter");
    expect(homeMapShortcut({ key: "=" }, false)).toBe("zoomIn");
    expect(homeMapShortcut({ key: "-" }, false)).toBe("zoomOut");
    expect(homeMapShortcut({ key: "0" }, false)).toBe("fit");
    expect(homeMapShortcut({ key: "ArrowLeft" }, false)).toEqual({ nudge: [-0.01, 0] });
    expect(homeMapShortcut({ key: "ArrowDown", shiftKey: true }, false)).toEqual({ nudge: [0, 0.1] });
  });

  it("knows a field that takes typing from one that does not", () => {
    expect(homeMapIsTypingTarget({ tagName: "INPUT", type: "text" })).toBe(true);
    expect(homeMapIsTypingTarget({ tagName: "input", type: "search" })).toBe(true);
    expect(homeMapIsTypingTarget({ tagName: "INPUT", type: "checkbox" })).toBe(false);
    expect(homeMapIsTypingTarget({ tagName: "INPUT", type: "range" })).toBe(false);
    expect(homeMapIsTypingTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(homeMapIsTypingTarget({ tagName: "SELECT" })).toBe(true);
    expect(homeMapIsTypingTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(homeMapIsTypingTarget({ tagName: "BUTTON" })).toBe(false);
    expect(homeMapIsTypingTarget(null)).toBe(false);
  });

  it("picks Shape's tools by their letters", () => {
    expect(HOME_MAP_SHAPE_TOOLS.map((t) => t.key).join("")).toBe("vrswdnot");
    expect(homeMapShapeToolFor("D")).toBe("door");
    expect(homeMapShapeToolFor("n")).toBe("window");
    expect(homeMapShapeToolFor("o")).toBe("opening");
    expect(homeMapShapeToolFor("x")).toBeUndefined();
  });
});

describe("the stage's view", () => {
  const floor = fixture().floors[0]!;

  it("fits the floor in the stage, centred, and maps plan and stage points both ways", () => {
    const view = homeMapFitView(floor, 1000, 600, 50, 50);
    // 10 m by 5 m less the pad: 900 / 10 and 500 / 5, the smaller.
    expect(view.scale).toBe(90);
    const [x, y] = homeMapToScreen(view, [5, 2.5]);
    expect(x).toBeCloseTo(500, 6);
    expect(y).toBeCloseTo(300, 6);
    const back = homeMapToPlan(view, [x, y]);
    expect(back[0]).toBeCloseTo(5, 9);
    expect(back[1]).toBeCloseTo(2.5, 9);
    // A floor with nothing on it shows ten meters round 0, 0.
    const empty = homeMapFitView({ ...floor, rooms: [], pins: [] }, 1000, 600, 50);
    expect(homeMapToScreen(empty, [0, 0])).toEqual([500, 300]);
  });

  it("zooms about a point, which stays put, within its limits, and says how far from the fit", () => {
    const fit = homeMapFitView(floor, 1000, 600, 50);
    const zoomed = homeMapZoomAt(fit, 2, [200, 100]);
    expect(homeMapToPlan(zoomed, [200, 100])[0]).toBeCloseTo(homeMapToPlan(fit, [200, 100])[0], 9);
    expect(homeMapZoomPercent(zoomed, fit)).toBe(200);
    expect(homeMapZoomAt(fit, 1e9, [0, 0]).scale).toBe(2400);
    expect(homeMapZoomAt(fit, 1e-9, [0, 0]).scale).toBe(4);
  });
});

describe("the editor's words", () => {
  const floor = fixture().floors[0]!;
  const living = floor.rooms[0]!;

  it("writes lengths and reads numbers typed with a comma or a unit", () => {
    expect(homeMapMeters(4.1)).toBe("4.10 m");
    expect(homeMapNumberText(-0.001)).toBe("0.00");
    expect(homeMapNumberText(12.5, 1)).toBe("12.5");
    expect(homeMapParseNumber("2,5 m")).toBe(2.5);
    expect(homeMapParseNumber(" 3 ")).toBe(3);
    expect(homeMapParseNumber("50cm")).toBe(0.5);
    expect(homeMapParseNumber("-12°")).toBe(-12);
    expect(homeMapParseNumber("two")).toBeUndefined();
    expect(homeMapParseNumber("")).toBeUndefined();
  });

  it("measures a room along its own walls", () => {
    expect(homeMapRoomSize(living)).toEqual({ width: 6, depth: 5, area: 30 });
    expect(homeMapRoomSizeText(living)).toBe("6.0 × 5.0 m");
    const box = homeMapRoomBox(living);
    expect(box).toHaveLength(4);
    for (const corner of [[0, 0], [6, 0], [6, 5], [0, 5]]) expect(box.some((p) => Math.hypot(p[0] - corner[0]!, p[1] - corner[1]!) < 1e-9)).toBe(true);
  });

  it("names a wall by the way it faces out of its room", () => {
    expect([0, 1, 2, 3].map((i) => homeMapWallSide(living, i))).toEqual(["top", "right", "bottom", "left"]);
    expect(homeMapWallName(living, 0, "Living room")).toBe("Living room, top wall");
    const inner = { ...living, walls: [...living.walls, { a: [3, 1], b: [3, 4], t: 0.1 }] } as typeof living;
    expect(homeMapWallSide(inner, 4)).toBe("inner");
  });

  it("names openings and things plainly", () => {
    expect(homeMapOpeningName({ kind: "door" })).toBe("Door");
    expect(homeMapOpeningName({ kind: "door", style: "double" })).toBe("Double door");
    expect(homeMapOpeningName({ kind: "door", style: "sliding" })).toBe("Sliding door");
    expect(homeMapOpeningName({ kind: "window", style: "sliding" })).toBe("Sliding window");
    expect(homeMapOpeningName({ kind: "opening" })).toBe("Way through");
    expect(homeMapObjectName("washerDryer")).toBe("Washer dryer");
    expect(homeMapObjectName("television")).toBe("TV");
    expect(homeMapObjectName("coffeeMachine")).toBe("Coffee machine");
    expect(homeMapFixAllLabel(3)).toBe("Fix all three");
    expect(homeMapFixAllLabel(2)).toBe("Fix both");
    expect(homeMapFixAllLabel(14)).toBe("Fix all 14");
    expect(homeMapSaveWords({ kind: "saving" })).toBe("Saving…");
    expect(homeMapSaveWords({ kind: "error", text: "x" })).toBe("Not saved");
    expect(homeMapDeleteRoomText(living, 3)).toBe("Living room comes off the map. Its 3 devices come off the map too. A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.");
  });
});

describe("the selection", () => {
  const floor = fixture().floors[0]!;

  it("knows which room it is in and whether it is still there", () => {
    expect(homeMapSelectionRoom({ kind: "wall", roomId: KITCHEN, wall: 1 })).toBe(KITCHEN);
    expect(homeMapSelectionRoom({ kind: "pin", pinId: "x" })).toBeUndefined();
    expect(homeMapSelectionThere(floor, { kind: "wall", roomId: KITCHEN, wall: 2 })).toBe(true);
    expect(homeMapSelectionThere(floor, { kind: "wall", roomId: KITCHEN, wall: 3 })).toBe(false);
    expect(homeMapSelectionThere(floor, { kind: "opening", roomId: LIVING, opening: 2 })).toBe(true);
    expect(homeMapSelectionThere(floor, { kind: "corner", roomId: "gone", corner: 0 })).toBe(false);
    expect(homeMapSelectionThere(floor, undefined)).toBe(true);
    expect(sameHomeMapSelection({ kind: "room", roomId: LIVING }, { kind: "room", roomId: LIVING })).toBe(true);
    expect(sameHomeMapSelection({ kind: "room", roomId: LIVING }, undefined)).toBe(false);
  });

  it("puts a drawn corner on a room's corner, in line with the last one, or on the grid", () => {
    // 50 pixels a meter: a corner within 10 pixels, 20 cm.
    expect(homeMapSnapPoint(floor, [6.1, 0.12], 50)).toEqual([6, 0]);
    expect(homeMapSnapPoint(floor, [12.04, 7.3], 50, { from: [12, 2] })).toEqual([12, 7.3]);
    expect(homeMapSnapPoint(floor, [12.04, 7.33], 50, { grid: HOME_MAP_ARRANGE_GRID })).toEqual([12, 7.3]);
  });
});

/** Saves held until released, so a test sees what is queued meanwhile. */
function slowApi(start: HomeMapRead) {
  let stored = start;
  const saves: { doc: HomeMapDocument; baseRev: number }[] = [];
  const waiting: (() => void)[] = [];
  let hold = false;
  const api: HomeMapApi = {
    get: async () => structuredClone(stored),
    save: async (doc, baseRev) => {
      saves.push({ doc, baseRev });
      if (hold) await new Promise<void>((r) => waiting.push(r));
      if (baseRev !== stored.rev) throw Object.assign(new Error("conflict"), { code: "conflict" });
      stored = { doc, rev: stored.rev + 1 };
      return { rev: stored.rev };
    },
  };
  return {
    api,
    saves,
    now: () => stored,
    hold: (on: boolean) => { hold = on; },
    release: () => waiting.splice(0).forEach((r) => r()),
    elsewhere: (change: (d: HomeMapDocument) => HomeMapDocument) => {
      stored = { doc: change(stored.doc!), rev: stored.rev + 1 };
    },
  };
}

describe("the editor's session", () => {
  it("makes an edit at once and saves it, from the rev it read", async () => {
    const ha = slowApi({ doc: fixture(), rev: 4 });
    const kept: number[] = [];
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 4 }, () => undefined, (r) => kept.push(r.rev));
    expect(s.apply((d) => renameRoom(d, KITCHEN, "Galley"))).toBe(true);
    expect(s.doc!.floors[0]!.rooms[1]!.name).toBe("Galley");
    expect(s.state.kind).toBe("saving");
    await s.idle();
    expect(ha.saves.map((x) => x.baseRev)).toEqual([4]);
    expect(s.state.kind).toBe("saved");
    expect(s.confirmed.rev).toBe(5);
    expect(kept).toEqual([5]);
  });

  it("puts the edits made while a save is out into one save after it", async () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    ha.hold(true);
    s.apply((d) => renameRoom(d, KITCHEN, "Galley"));
    await Promise.resolve();
    s.apply((d) => moveRoom(d, KITCHEN, 1, 0));
    s.apply((d) => setRoomFinish(d, KITCHEN, "wood"));
    expect(s.doc!.floors[0]!.rooms[1]).toMatchObject({ name: "Galley", finish: "wood" });
    ha.hold(false);
    ha.release();
    await s.idle();
    expect(ha.saves.map((x) => x.baseRev)).toEqual([1, 2]);
    expect(ha.now().doc!.floors[0]!.rooms[1]).toMatchObject({ name: "Galley", finish: "wood" });
    expect(ha.now().doc!.floors[0]!.rooms[1]!.outline[0]).toEqual([7, 0]);
    expect(sameHomeMapDocument(s.doc, ha.now().doc)).toBe(true);
  });

  it("refuses an edit that no longer fits or that the store would refuse, changing nothing", () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    expect(s.apply((d) => renameRoom(d, "gone", "x"))).toBe(false);
    expect(s.apply((d) => ({ ...d, v: 2 as 1 }))).toBe(false);
    expect(s.note?.kind).toBe("err");
    expect(s.canUndo).toBe(false);
    expect(ha.saves).toHaveLength(0);
  });

  it("undoes and redoes, each saved as a swap of the whole map", async () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    s.apply((d) => addOpening(d, KITCHEN, 0, { kind: "door" }));
    await s.idle();
    expect(s.undo()).toBe(true);
    await s.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.openings).toEqual([]);
    expect(s.canRedo).toBe(true);
    expect(s.redo()).toBe(true);
    await s.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.openings).toHaveLength(1);
    expect(s.redo()).toBe(false);
  });

  it("never lets an undo throw away what another device saved meanwhile", async () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    s.apply((d) => renameRoom(d, KITCHEN, "Galley"));
    await s.idle();
    ha.elsewhere((d) => renameRoom(d, LIVING, "Lounge")!);
    s.undo();
    await s.idle();
    expect(ha.now().doc!.floors[0]!.rooms.map((r) => r.name)).toEqual(["Lounge", "Galley"]);
    expect(s.note).toEqual({ kind: "err", text: HOME_MAP_GONE_TEXT });
    expect(s.doc!.floors[0]!.rooms[0]!.name).toBe("Lounge");
    expect(s.canUndo).toBe(false);
  });

  it("makes an edit on a newer map after a conflict, says so, and keeps what was queued", async () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    ha.elsewhere((d) => renameRoom(d, LIVING, "Lounge")!);
    s.apply((d) => renameRoom(d, KITCHEN, "Galley"));
    await s.idle();
    expect(s.note).toEqual({ kind: "warn", text: HOME_MAP_MERGED_TEXT });
    expect(s.doc!.floors[0]!.rooms.map((r) => r.name)).toEqual(["Lounge", "Galley"]);
    expect(s.dismissNote()).toBeUndefined();
    expect(s.note).toBeUndefined();
  });

  it("ignores a fresh read while a save is out, and takes it otherwise", async () => {
    const ha = slowApi({ doc: fixture(), rev: 1 });
    const s = new HomeMapSession(ha.api, { doc: fixture(), rev: 1 });
    ha.hold(true);
    s.apply((d) => renameRoom(d, KITCHEN, "Galley"));
    expect(s.load({ doc: fixture(), rev: 9 })).toBe(false);
    ha.hold(false);
    ha.release();
    await s.idle();
    expect(s.load({ doc: fixture(), rev: 9 })).toBe(true);
    expect(s.confirmed.rev).toBe(9);
    expect(s.canUndo).toBe(false);
  });
});

describe("the plan on the stage", () => {
  const floor = fixture().floors[0]!;

  it("draws the plan look at a fixed fit, so a moved room moves alone", () => {
    const text = flatten(homeTileArt({ floor, look: "plan", width: 1000, height: 600, names: false, frame: { scale: 50, ox: 10, oy: 20 } }));
    expect(text).toContain(`data-room=${LIVING} points=10,20 310,20 310,270 10,270`);
    const moved = moveRoom({ v: 1, floors: [floor] }, KITCHEN, 1, 0)!.floors[0]!;
    const again = flatten(homeTileArt({ floor: moved, look: "plan", width: 1000, height: 600, names: false, frame: { scale: 50, ox: 10, oy: 20 } }));
    expect(again).toContain(`data-room=${LIVING} points=10,20 310,20 310,270 10,270`);
    expect(again).toContain(`data-room=${KITCHEN} points=360,20 560,20 560,270 360,270`);
  });

  it("draws a sliding door or window as two offset panes and no swing", () => {
    const [p, q] = homeSlidingPanes({ a: [0, 0], b: [2, 0] }, 0.2);
    expect(p.a[0]).toBeCloseTo(0, 9);
    expect(p.b[0]).toBeCloseTo(1.1, 9);
    expect(q.a[0]).toBeCloseTo(0.9, 9);
    expect(q.b[0]).toBeCloseTo(2, 9);
    expect(p.a[1]).toBeCloseTo(0.05, 9);
    expect(q.a[1]).toBeCloseTo(-0.05, 9);
    const doc = addOpening({ v: 1, floors: [floor] }, KITCHEN, 1, { kind: "door", style: "sliding" })!;
    const plain = flatten(homeTileArt({ floor, look: "plan", width: 600, height: 400, names: false }));
    const sliding = flatten(homeTileArt({ floor: doc.floors[0]!, look: "plan", width: 600, height: 400, names: false }));
    // The living room's door swings as before; the sliding one adds no swing.
    expect(sliding.split("stroke-dasharray=\"3 2.5\"").length).toBe(plain.split("stroke-dasharray=\"3 2.5\"").length);
  });
});
