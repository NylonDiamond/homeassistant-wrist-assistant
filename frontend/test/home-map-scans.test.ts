// Each room as the iPhone scanned it, kept by Home Assistant beside the map
// (`home_map_store.py`, "Scans"), in the map editor's wall editing: the
// records read as the store checks a room (`readHomeMapScans`) and through
// `home_map/scans` (`readHomeMapScansFrom`, none from an older
// integration), Back to the scan (`backToScan`: the room's shape put back,
// its pins, name and height left, a door's or window's style and a hidden
// thing kept as the iPhone's Scan Again keeps them, nothing when it already
// matches once rounded, one undo step in the session), the overlay's marks
// (`homeMapScanMarks`) and wall editing's dock switch, overlay, card and
// rail.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { backToScan, homeMapScanDiffers, homeMapScanMarks, homeMapScanRoom, moveCorner, moveRoom, setObjectHidden, setOpening } from "../src/home-map/edit-ops.js";
import type { HomeMapEditorContext, HomeMapSelection } from "../src/home-map/editor-mode.js";
import { HomeMapSession } from "../src/home-map/editor-session.js";
import { ShapeMode } from "../src/home-map/mode-shape.js";
import {
  type HomeMapDocument,
  type HomeMapRoom,
  type HomeMapScan,
  type HomeMapScans,
  type HomePoint,
  checkHomeMap,
  homeMapScanOf,
  readHomeMapScans,
} from "../src/home-map/model.js";
import type { HomeMapApi } from "../src/home-map/save.js";
import { readHomeMapScansFrom } from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const AT = "2026-10-28T09:00:00Z";

const living = (doc: HomeMapDocument): HomeMapRoom => doc.floors[0]!.rooms[0]!;
const kitchen = (doc: HomeMapDocument): HomeMapRoom => doc.floors[0]!.rooms[1]!;

/** A room's record as the store keeps it. */
function scanOf(room: HomeMapRoom): HomeMapScan {
  return structuredClone({ outline: room.outline, walls: room.walls, openings: room.openings, objects: room.objects, at: AT });
}

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

// ── reading the records ──────────────────────────────────────────────────

describe("reading the scans", () => {
  it("checks each record as a room, rounds it and leaves out a damaged one", () => {
    const room = living(fixture());
    const raw = {
      [LIVING]: { ...scanOf(room), outline: [[0.004, 0], [6, 0], [6, 5.001], [0, 5]] },
      [KITCHEN]: { outline: [[0, 0]], walls: [], openings: [], objects: [], at: AT },
      "not-a-room": scanOf(room),
      [LIVING.replace("10", "12")]: "damaged",
    };
    const scans = readHomeMapScans(raw);
    expect(Object.keys(scans)).toEqual([LIVING]);
    expect(scans[LIVING]!.outline).toEqual([[0, 0], [6, 0], [6, 5], [0, 5]]);
    expect(scans[LIVING]!.openings).toEqual(room.openings);
    expect(scans[LIVING]!.at).toBe(AT);
    expect(readHomeMapScans(null)).toEqual({});
    expect(readHomeMapScans([scanOf(room)])).toEqual({});
  });

  it("finds a room's scan whatever the id's case", () => {
    const scans: HomeMapScans = { [LIVING.toLowerCase()]: scanOf(living(fixture())) };
    expect(homeMapScanOf(scans, LIVING)).toBe(scans[LIVING.toLowerCase()]);
    expect(homeMapScanOf(scans, KITCHEN)).toBeUndefined();
    expect(homeMapScanOf(undefined, LIVING)).toBeUndefined();
  });

  it("reads them over home_map/scans, and none from an older integration", async () => {
    const sent: unknown[] = [];
    const hass = (reply: () => Promise<unknown>) => ({ connection: { sendMessagePromise: (msg: unknown) => { sent.push(msg); return reply(); } } }) as never;
    const scans = await readHomeMapScansFrom(hass(async () => ({ scans: { [LIVING]: scanOf(living(fixture())) }, rev: 3 })));
    expect(Object.keys(scans!)).toEqual([LIVING]);
    expect(sent).toEqual([{ type: "wrist_assistant/home_map/scans" }]);
    const old = await readHomeMapScansFrom(hass(async () => { throw { code: "unknown_command", message: "Unknown command." }; }));
    expect(old).toBeUndefined();
    await expect(readHomeMapScansFrom(hass(async () => { throw { code: "unavailable", message: "no" }; }))).rejects.toMatchObject({ code: "unavailable" });
  });
});

// ── Back to the scan ─────────────────────────────────────────────────────

describe("Back to the scan", () => {
  it("puts the room's shape back as scanned, its pins, name and height left", () => {
    const scanned = fixture();
    const scan = scanOf(living(scanned));
    let doc = moveCorner(fixture(), LIVING, 1, [6.5, -0.3])!;
    doc = { ...doc, floors: [{ ...doc.floors[0]!, rooms: [{ ...living(doc), name: "Lounge", height: 2.7, objects: [], openings: [] }, kitchen(doc)] }] };
    const pinsBefore = structuredClone(doc.floors[0]!.pins);
    expect(homeMapScanDiffers(living(doc), scan)).toBe(true);
    const back = backToScan(doc, LIVING, scan)!;
    expect(checkHomeMap(back).ok).toBe(true);
    const room = living(back);
    expect({ outline: room.outline, walls: room.walls, openings: room.openings, objects: room.objects }).toEqual({
      outline: living(scanned).outline,
      walls: living(scanned).walls,
      openings: living(scanned).openings,
      objects: living(scanned).objects,
    });
    expect(room.name).toBe("Lounge");
    expect(room.height).toBe(2.7);
    expect(room.areaId).toBe("living_room");
    expect(back.floors[0]!.pins).toEqual(pinsBefore);
    // The kitchen, which shares the moved corner, is not touched.
    expect(kitchen(back)).toEqual(kitchen(doc));
    // The map it was given is unchanged.
    expect(living(doc).outline[1]).toEqual([6.5, -0.3]);
  });

  it("puts back a room moved as a whole, leaving its pins where they are", () => {
    const scan = scanOf(living(fixture()));
    const doc = moveRoom(fixture(), LIVING, 2, 1)!;
    const back = backToScan(doc, LIVING, scan)!;
    expect(living(back).outline).toEqual(living(fixture()).outline);
    expect(back.floors[0]!.pins).toEqual(doc.floors[0]!.pins);
  });

  it("is nothing once the room matches its scan after rounding, or when the room is gone", () => {
    const doc = fixture();
    const scan = scanOf(living(doc));
    expect(homeMapScanDiffers(living(doc), scan)).toBe(false);
    expect(backToScan(doc, LIVING, scan)).toBeUndefined();
    const nearly = { ...scan, outline: scan.outline.map(([x, y]): HomePoint => [x + 0.004, y - 0.003]) };
    expect(homeMapScanDiffers(living(doc), nearly)).toBe(false);
    expect(backToScan(doc, LIVING, nearly)).toBeUndefined();
    expect(backToScan(doc, "7B1E0C2A-5D3F-4A8B-9C6D-000000000099", scan)).toBeUndefined();
  });

  it("keeps a door's or window's style when the scan has one of its kind within half a meter", () => {
    const scan = scanOf(living(fixture()));
    // The window made sliding and the door double in the panel, then the
    // room changed: both keep their style.
    let doc = setOpening(fixture(), LIVING, 0, { style: "sliding" })!;
    doc = setOpening(doc, LIVING, 1, { style: "double" })!;
    doc = moveCorner(doc, LIVING, 2, [6.4, 5.4])!;
    const room = homeMapScanRoom(living(doc), scan);
    expect(room.openings.map((o) => o.style)).toEqual(["sliding", "double", undefined]);
    // Moved more than half a meter, or another kind there, it takes none.
    const far = { ...scan, openings: scan.openings.map((o, i) => (i === 0 ? { ...o, a: [1.4, 0] as HomePoint, b: [1.5, 0] as HomePoint } : o)) };
    expect(homeMapScanRoom(living(doc), far).openings[0]!.style).toBeUndefined();
    const other = { ...scan, openings: scan.openings.map((o, i) => (i === 1 ? { ...o, kind: "window" as const } : o)) };
    expect(homeMapScanRoom(living(doc), other).openings[1]!.style).toBeUndefined();
    // A style the scan itself has is its own.
    const own = { ...scan, openings: scan.openings.map((o, i) => (i === 0 ? { ...o, style: "sliding" as const } : o)) };
    expect(homeMapScanRoom(living(fixture()), own).openings[0]!.style).toBe("sliding");
  });

  it("keeps a thing hidden when the scan has one of its kind within half a meter, else shows it", () => {
    const scan = scanOf(living(fixture()));
    let doc = setObjectHidden(fixture(), LIVING, 0, true)!;
    doc = moveCorner(doc, LIVING, 2, [6.4, 5.4])!;
    expect(homeMapScanRoom(living(doc), scan).objects.map((o) => o.hidden)).toEqual([true, undefined, undefined]);
    // A sofa scanned more than half a meter away is shown.
    const moved = { ...scan, objects: scan.objects.map((o, i) => (i === 0 ? { ...o, c: [2.7, 3.5] as HomePoint } : o)) };
    expect(homeMapScanRoom(living(doc), moved).objects[0]!.hidden).toBeUndefined();
    // Hidden in the record but shown in the room now: shown.
    const recorded = { ...scan, objects: scan.objects.map((o, i) => (i === 1 ? { ...o, hidden: true as const } : o)) };
    expect(homeMapScanRoom(living(fixture()), recorded).objects[1]!.hidden).toBeUndefined();
    // Only the hidden flag differs: putting it back changes nothing else.
    const shown = setObjectHidden(fixture(), LIVING, 0, true)!;
    expect(homeMapScanDiffers(living(shown), scan)).toBe(false);
  });

  it("is one undo step in the editor's session", async () => {
    let stored = { doc: moveCorner(fixture(), LIVING, 1, [6.5, -0.3])!, rev: 2 };
    const api: HomeMapApi = {
      get: async () => structuredClone(stored),
      save: async (doc, baseRev) => {
        if (baseRev !== stored.rev) throw Object.assign(new Error("conflict"), { code: "conflict" });
        stored = { doc, rev: stored.rev + 1 };
        return { rev: stored.rev };
      },
    };
    const before = structuredClone(stored.doc);
    const s = new HomeMapSession(api, structuredClone(stored));
    const scan = scanOf(living(fixture()));
    expect(s.apply((d) => backToScan(d, LIVING, scan))).toBe(true);
    expect(living(s.doc!).outline).toEqual(living(fixture()).outline);
    await s.idle();
    expect(s.undo()).toBe(true);
    expect(s.doc).toEqual(before);
    expect(s.canUndo).toBe(false);
    await s.idle();
    expect(stored.doc).toEqual(before);
  });
});

// ── the overlay ──────────────────────────────────────────────────────────

describe("the scan's marks", () => {
  it("draws each room of the floor with a scan: outline, walls, doors and windows", () => {
    const doc = fixture();
    const marks = homeMapScanMarks(doc.floors[0]!, { [LIVING.toLowerCase()]: scanOf(living(doc)) });
    expect(marks).toHaveLength(1);
    const [mark] = marks;
    expect(mark!.roomId).toBe(LIVING);
    expect(mark!.outline).toEqual(living(doc).outline);
    expect(mark!.walls.map((w) => [w.a, w.b])).toEqual(living(doc).walls.map((w) => [w.a, w.b]));
    // The way through is left out: doors and windows only.
    expect(mark!.openings).toEqual([
      { kind: "window", a: [1.4, 0], b: [3.4, 0] },
      { kind: "door", a: [0, 1.5], b: [0, 2.5] },
    ]);
  });

  it("draws the outline's edges as walls when the scan kept none, and nothing with no scans", () => {
    const doc = fixture();
    const scan = { ...scanOf(kitchen(doc)), walls: [] };
    const [mark] = homeMapScanMarks(doc.floors[0]!, { [KITCHEN]: scan });
    expect(mark!.walls).toHaveLength(4);
    expect(mark!.walls[3]!.a).toEqual([6, 5]);
    expect(mark!.walls[3]!.b).toEqual([6, 0]);
    expect(homeMapScanMarks(doc.floors[0]!, undefined)).toEqual([]);
    expect(homeMapScanMarks(doc.floors[0]!, {})).toEqual([]);
  });
});

// ── wall editing ─────────────────────────────────────────────────────────

/** A stand-in for the shell at 100 pixels a meter, editing `walls`' walls
 * when given. */
function shell(options: { doc?: HomeMapDocument; scans?: HomeMapScans; scan?: boolean; selection?: HomeMapSelection; walls?: string }) {
  let doc = options.doc ?? fixture();
  const log = { toggles: [] as [string, boolean][], applied: 0 };
  const ctx = {
    hass: undefined,
    icons: undefined,
    get doc() { return doc; },
    get floor() { return doc.floors[0]!; },
    selection: options.selection,
    walls: options.walls,
    view: { scale: 100, ox: 0, oy: 0 },
    stage: { width: 1200, height: 800 },
    toggles: { snap: true, square: true, grid: false, measure: false, live: true, scan: options.scan ?? false },
    pages: [],
    areas: [],
    scans: options.scans,
    canUndo: false,
    canRedo: false,
    toScreen: (p: readonly number[]): HomePoint => [p[0]! * 100, p[1]! * 100],
    px: (m: number) => m * 100,
    apply(op: (d: HomeMapDocument) => HomeMapDocument | undefined) {
      const next = op(doc);
      if (next === undefined) return false;
      doc = next;
      log.applied += 1;
      return true;
    },
    setToggle: (key: string, on: boolean) => log.toggles.push([key, on]),
    redraw: () => {},
  };
  return { ctx: ctx as unknown as HomeMapEditorContext, log };
}

describe("wall editing's scan as it was", () => {
  it("offers Show scan as it was in the dock only when Home Assistant keeps scans", () => {
    const mode = new ShapeMode();
    expect(flatten(mode.dock(shell({ scans: {} }).ctx))).toContain("Show scan as it was");
    expect(flatten(mode.dock(shell({ scans: {} }).ctx))).toContain("as first seen");
    expect(flatten(mode.dock(shell({}).ctx))).not.toContain("Show scan as it was");
    expect(flatten(mode.dock(shell({ scans: {}, scan: true }).ctx))).toMatch(/hme-tb on" aria-pressed=true[^>]*>Show scan as it was/);
  });

  it("draws the scans over the plan only while the switch is on", () => {
    const mode = new ShapeMode();
    const scans = { [LIVING]: scanOf(living(fixture())), [KITCHEN]: scanOf(kitchen(fixture())) };
    const on = flatten(mode.overlay(shell({ scans, scan: true }).ctx));
    expect(on.match(/class="hme-scan"/g)).toHaveLength(2);
    expect(on).toContain(`data-room=${LIVING} `);
    expect(on).toContain("stroke=#4fd6c2");
    expect(on).toContain(`stroke-dasharray="7 5"`);
    // The window's mark dotted, the door's solid; no mark for the way
    // through.
    expect(on).toMatch(/x1=140\.0 y1=0\.0 x2=340\.0 y2=0\.0 [^>]*stroke-dasharray=2 3 /);
    expect(on).toMatch(/x1=0\.0 y1=150\.0 x2=0\.0 y2=250\.0 [^>]*stroke-dasharray=none /);
    expect(on).not.toContain("y1=200.0");
    expect(flatten(mode.overlay(shell({ scans, scan: false }).ctx))).not.toContain("hme-scan");
  });

  it("shows Back to the scan for a picked room only when it differs from its scan", () => {
    const mode = new ShapeMode();
    const scans = { [LIVING]: scanOf(living(fixture())) };
    const select: HomeMapSelection = { kind: "room", roomId: LIVING };
    expect(flatten(mode.inspector(shell({ scans, selection: select }).ctx))).not.toContain("Back to the scan");
    const changed = moveCorner(fixture(), LIVING, 2, [6.4, 5.4])!;
    const card = flatten(mode.inspector(shell({ doc: changed, scans, selection: select }).ctx));
    expect(card).toContain(">Back to the scan</button>");
    expect(card).toContain("Its shape has changed since the iPhone scanned it.");
    // A room drawn by hand has no scan, and no button.
    expect(flatten(mode.inspector(shell({ doc: changed, scans: {}, selection: select }).ctx))).not.toContain("Back to the scan");
    expect(flatten(mode.inspector(shell({ doc: changed, scans: undefined, selection: select }).ctx))).not.toContain("Back to the scan");
  });

  it("lists the room's walls with what is on each in the rail, with the scan as it was and Back to the scan", () => {
    const mode = new ShapeMode();
    const scans = { [LIVING]: scanOf(living(fixture())) };
    const select: HomeMapSelection = { kind: "wall", roomId: LIVING, wall: 0 };
    const rail = flatten(mode.rail(shell({ scans, selection: select, walls: LIVING }).ctx));
    expect(rail).toContain("4 walls");
    expect(rail).toMatch(/hme-lay on" aria-pressed=true[^>]*>Top wall<span class="n">6\.00 m/);
    expect(rail).toContain("Window<span class=\"n\">2.00 m");
    expect(rail).toContain("Scan check");
    expect(rail).toContain("Show scan as it was");
    // As scanned: Back to the scan is off until the room differs.
    expect(rail).toMatch(/\?disabled=true[^>]*>Back to the scan/);
    const changed = moveCorner(fixture(), LIVING, 2, [6.4, 5.4])!;
    expect(flatten(mode.rail(shell({ doc: changed, scans, selection: select, walls: LIVING }).ctx))).toMatch(/\?disabled=false[^>]*>Back to the scan/);
    // None from an integration that keeps no scans.
    expect(flatten(mode.rail(shell({ selection: select, walls: LIVING }).ctx))).not.toContain("Show scan as it was");
  });
});
