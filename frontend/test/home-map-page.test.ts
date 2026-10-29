// The Home map page (app repo docs/home_map_plan_2026-10.md, "The panel"):
// its address among the whole home's screens, listed only with the
// integration's `home_map`; the flat plan as every device draws it (walls cut
// for doors and openings, windows in blue, pins coloured by what their
// entity is doing); and the map editor's one edit page: the bar with its
// Home style panel, the stage's presses and drags (a click picking what is
// on top, a pin, then a thing, then a room), the tool rail and its keys, a
// room's walls edited after a double-click, the page's own dialogs, and
// every edit made at once and saved soon after from the rev it was read at,
// put on top of a newer map after a conflict, and said so when that cannot
// be done.
//
// The element is made and driven directly, with Home Assistant stood in: its
// views are read as text, a press on the stage is a stand-in event on a
// stand-in stage, and every edit is a real save sent to the stand-in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { homeMapDevices, homeMapTray } from "../src/home-map/devices-model.js";
import { HOME_PLAN_COLORS, homePinGlowRadius, homePinPaint, homePlan, homePlanViewBox, homeWallPieces } from "../src/home-map/draw.js";
import { HOME_MAP_EMPTY_TEXT, HOME_MAP_UPDATE_TEXT, WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import { HOME_MAP_PATH, isHomeMapRoute, renderHomeMapView } from "../src/home-map/hook.js";
import { type HomeMapDocument, type HomeMapStates, applyHomeMapEdit } from "../src/home-map/model.js";
import { addLampLight, renameRoom, setHomeStyle } from "../src/home-map/edit-ops.js";
import { homeMapStartSteps } from "../src/home-map/edit-page.js";
import { HOME_MAP_GONE_TEXT, HOME_MAP_MERGED_TEXT } from "../src/home-map/save.js";
import { forgetHomeMap, homeMapRead, setHomeMapCapable } from "../src/home-map/store.js";
import { NO_ICONS } from "../src/watch-pages/editor-host.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const PAGE_A = "C3A0E000-0000-4000-8000-0000000000AA";
const PAGE_B = "C3A0E000-0000-4000-8000-0000000000BB";

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

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and that binds the event itself, as a press on it would call it. */
function handler(root: unknown, marker: string, event: string): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flatten(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e?: unknown) => void;
}

const settle = () => new Promise((r) => setTimeout(r, 0));
const refusal = (code: string, message: string) => Object.assign(new Error(message), { code });
const at = (path: string) => ({ prefix: "/wrist-assistant", path });

// ── the address ──────────────────────────────────────────────────────────

describe("the Home map's address", () => {
  it("is /home-map, naming no device, with a stand-in until the page's chunk is in", () => {
    expect(HOME_MAP_PATH).toBe("/home-map");
    expect(isHomeMapRoute(at("/home-map"))).toBe(true);
    expect(isHomeMapRoute(at("/home-map/anything"))).toBe(true);
    expect(isHomeMapRoute(at("/home-mapper"))).toBe(false);
    expect(isHomeMapRoute(undefined)).toBe(false);
  });

  it("hands the element the home's map capability, the panel's symbols and the way Home", async () => {
    // The chunk is this module, already loaded by the import above.
    const onHome = () => undefined;
    const view = renderHomeMapView({ hass: {} as HassLike, narrow: false, icons: NO_ICONS, iconsTick: 3, capable: true, onHome, onLoaded: () => undefined });
    expect(flatten(view)).toContain("<wa-home-map-editor");
    expect(view.values).toContain(true);
    expect(view.values).toContain(NO_ICONS);
    expect(view.values).toContain(onHome);
  });
});

// ── the plan ─────────────────────────────────────────────────────────────

describe("the plan", () => {
  const floor = fixture().floors[0]!;
  const living = floor.rooms[0]!;

  it("cuts a wall for a door or an opening, and draws a window in its gap", () => {
    // The north wall holds the window, from 1.4 m to 3.4 m.
    expect(homeWallPieces(living.walls[0]!, living.openings)).toEqual({
      solid: [[[0, 0], [1.4, 0]], [[3.4, 0], [6, 0]]],
      windows: [[[1.4, 0], [3.4, 0]]],
    });
    // The west wall runs from (0, 5) to (0, 0); the door is at 1.5 m to 2.5 m.
    const west = homeWallPieces(living.walls[3]!, living.openings);
    expect(west.windows).toEqual([]);
    expect(west.solid).toEqual([[[0, 5], [0, 2.5]], [[0, 1.5], [0, 0]]]);
    // The east wall's opening, from 2 m to 3 m; the south wall has none.
    expect(homeWallPieces(living.walls[1]!, living.openings).solid).toHaveLength(2);
    expect(homeWallPieces(living.walls[2]!, living.openings).solid).toEqual([[[6, 5], [0, 5]]]);
  });

  it("colours each pin by what its entity is doing", () => {
    const s: HomeMapStates = {
      "light.on": { state: "on", attributes: { brightness: 128 } },
      "light.off": { state: "off" },
      "lock.locked": { state: "locked" },
      "lock.open": { state: "unlocked" },
      "switch.fan": { state: "off" },
    };
    expect(homePinPaint("light.on", s)).toEqual({ fill: HOME_PLAN_COLORS.lit, dim: false, glow: 128 / 255 });
    expect(homePinPaint("light.off", s)).toEqual({ fill: HOME_PLAN_COLORS.lit, dim: true, glow: undefined });
    expect(homePinPaint("lock.locked", s).fill).toBe(HOME_PLAN_COLORS.locked);
    expect(homePinPaint("lock.open", s).fill).toBe(HOME_PLAN_COLORS.unlocked);
    expect(homePinPaint("switch.fan", s).dim).toBe(true);
    expect(homePinPaint("switch.fan", s).fill).toMatch(/^#[0-9A-F]{6}$/i);
    expect(homePinPaint("light.gone", s)).toEqual({ fill: HOME_PLAN_COLORS.gone, dim: false, glow: undefined });
    expect([homePinGlowRadius(0), homePinGlowRadius(1), homePinGlowRadius(4)]).toEqual([0.8, 2.2, 2.2]);
  });

  it("draws rooms, furniture, walls, names and a button per pin, the selected one ringed", () => {
    const s: HomeMapStates = { "light.reading_lamp": { state: "on", attributes: {} } };
    const text = flatten(homePlan(floor, { states: s, names: true, pins: "buttons", selected: { kind: "pin", id: READING } }));
    expect(text.split('class="hm-room"').length - 1).toBe(2);
    expect(text.split('class="hm-object"').length - 1).toBe(6);
    expect(text.split("class=hm-window").length - 1).toBe(1);
    // Four walls less the cuts: two pieces each where the window, the door
    // and the opening are, the south wall whole, then the kitchen's three.
    expect(text.split("class=hm-wall").length - 1).toBe(10);
    expect(text).toContain(">Living room</text>");
    expect(text).toContain(">Kitchen</text>");
    expect(text.split('class="hm-pin"').length - 1).toBe(5);
    expect(text).toContain(`data-pin=${READING}`);
    expect(text.split('class="hm-glow"').length - 1).toBe(1);
    expect(text).toContain(`stroke=${HOME_PLAN_COLORS.selected}`);
    // The kitchen table is turned a quarter round its own middle.
    expect(text).toContain("rotate(90 8.1 2.5)");
    // A pin dragged is drawn where it is being dragged.
    const moving = flatten(homePlan(floor, { pins: "buttons", moving: { pinId: READING, at: [9, 4] } }));
    expect(moving).toContain("translate(9 4)");
    expect(homePlanViewBox(floor)).toEqual({ x: -0.4, y: -0.4, width: 10.8, height: 5.8 });
  });
});

// ── the editor ───────────────────────────────────────────────────────────

/** Home Assistant with the map stored at `rev`, the library's two pages,
 * two areas and a few states. */
function fakeHass(start: { doc: HomeMapDocument | null; rev: number }) {
  let stored = start;
  const sent: Record<string, any>[] = [];
  const hass = {
    states: {
      "light.reading_lamp": { entity_id: "light.reading_lamp", state: "on", attributes: { friendly_name: "Reading lamp", brightness: 200 } },
      "switch.fan": { entity_id: "switch.fan", state: "off", attributes: { friendly_name: "Fan" } },
    },
    areas: { living_room: { name: "Living room" }, kitchen: { name: "Kitchen" }, den: { name: "Den" } },
    connection: {
      async sendMessagePromise(msg: Record<string, any>) {
        sent.push(msg);
        if (msg.type === "wrist_assistant/home_map/get") return structuredClone(stored);
        if (msg.type === "wrist_assistant/home_map/save") {
          if (msg.base_rev !== stored.rev) throw refusal("conflict", `stored revision is ${stored.rev}, save was based on ${msg.base_rev}`);
          stored = { doc: msg.doc as HomeMapDocument, rev: stored.rev + 1 };
          return { rev: stored.rev };
        }
        if (msg.type === "wrist_assistant/library/summary") {
          return {
            pages: { [PAGE_A]: { item: { id: PAGE_A, name: "Kitchen" }, owners: [] }, [PAGE_B]: { item: { id: PAGE_B, name: "Evening" }, owners: [] } },
            status_pages: {}, menus: {}, picks: {},
          };
        }
        throw refusal("unknown_command", "Unknown command.");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return {
    hass,
    sent,
    saves: () => sent.filter((m) => m.type === "wrist_assistant/home_map/save"),
    now: () => stored,
    /** Another device saves meanwhile. */
    elsewhere: (change: (doc: HomeMapDocument) => HomeMapDocument) => {
      stored = { doc: change(stored.doc!), rev: stored.rev + 1 };
    },
  };
}

type Inside = {
  selection?: { kind: string; roomId?: string; wall?: number; opening?: number; pinId?: string; object?: number };
  dialog?: { kind: string; title: string; text?: string; done: (v: unknown) => void };
  walls?: string;
  styleOpen: boolean;
  toggles: { measure: boolean };
  view?: { scale: number; ox: number; oy: number };
  floorId?: string;
  willUpdate(changed: Map<string, unknown>): void;
};

/** A stand-in for the stage's `<svg>` at the page's top left, which
 * keeps the listeners a drag adds. */
function stageStandIn() {
  const listeners = new Map<string, (e: unknown) => void>();
  return {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 600 }),
    setPointerCapture: () => undefined,
    releasePointerCapture: () => undefined,
    addEventListener: (type: string, fn: (e: unknown) => void) => listeners.set(type, fn),
    removeEventListener: (type: string) => listeners.delete(type),
    fire: (type: string, e: unknown) => listeners.get(type)?.(e),
  };
}

async function page(start: { doc: HomeMapDocument | null; rev: number } = { doc: fixture(), rev: 4 }, capable = true) {
  const ha = fakeHass(start);
  const el = new WaHomeMapEditor();
  el.hass = ha.hass;
  el.capable = capable;
  const inside = el as unknown as Inside;
  inside.willUpdate(new Map());
  await settle();
  // The stage's observer reports its size; the next draw fits the floor.
  el.resizeStage(1000, 600);
  inside.willUpdate(new Map());
  const stage = stageStandIn();
  /** The stage point over a plan point. */
  const screen = (p: [number, number]) => el.context()!.toScreen(p);
  const pointer = (p: [number, number], extra: Record<string, unknown> = {}) => {
    const [x, y] = screen(p);
    return { button: 0, buttons: 1, pointerId: 1, pointerType: "mouse", clientX: x, clientY: y, currentTarget: stage, target: null, preventDefault: () => undefined, ...extra };
  };
  /** A press, an optional drag through plan points, and the let go. */
  const press = (from: [number, number], through: [number, number][] = [], extra: Record<string, unknown> = {}) => {
    el.onStageDown(pointer(from, extra) as unknown as PointerEvent);
    for (const p of through) stage.fire("pointermove", pointer(p, extra));
    stage.fire("pointerup", pointer(through.at(-1) ?? from, extra));
  };
  const key = (k: string, extra: Record<string, unknown> = {}) => el.onKey({ key: k, preventDefault: () => undefined, composedPath: () => [el], ...extra } as unknown as KeyboardEvent);
  /** A double-click on a plan point. */
  const doubleClick = (p: [number, number]) => el.onStageDblClick(pointer(p) as unknown as MouseEvent);
  /** A click on the page's control whose drawing holds `marker`. */
  const click = (marker: string, event = "@click=") => handler(el.render(), marker, event)({ target: null, currentTarget: null, shiftKey: false, metaKey: false, ctrlKey: false });
  return { el, inside, ha, stage, screen, pointer, press, key, doubleClick, click, text: () => flatten(el.render()) };
}

describe("the Home map editor", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
  });
  afterEach(() => {
    forgetHomeMap();
    vi.unstubAllGlobals();
  });

  it("says to update the integration without home_map, and reads nothing", async () => {
    const { ha, text } = await page(undefined, false);
    expect(text()).toContain(HOME_MAP_UPDATE_TEXT);
    expect(ha.sent).toEqual([]);
  });

  it("says how a map is made when the home has none", async () => {
    const { text } = await page({ doc: null, rev: 0 });
    expect(text()).toContain(HOME_MAP_EMPTY_TEXT);
  });

  it("draws the bar, the floor's layers and the plan with its names and sizes, live", async () => {
    const { ha, text, inside } = await page();
    // The rooms' scans are read once the map is in.
    expect(ha.sent.map((m) => m.type)).toEqual(["wrist_assistant/home_map/get", "wrist_assistant/library/summary", "wrist_assistant/home_map/scans"]);
    const shown = text();
    expect(shown).toContain("Home map");
    expect(shown).toContain("BETA");
    expect(shown).toContain("Ground floor");
    expect(shown).toContain("2 rooms · 5 devices");
    // One edit page: no mode tabs, the view switch and Home style in the bar.
    for (const tab of ["Arrange", "Shape", "Devices", "Style"]) expect(shown).not.toContain(`>${tab}</button>`);
    expect(shown).not.toContain('aria-label="Edit mode"');
    expect(shown).toContain(">Both</button>");
    expect(shown).toMatch(/hme-style-sw[^>]*><\/span>Home style<\/button>/);
    expect(shown).toContain("Saved");
    expect(shown).toContain("Plan of Ground floor");
    expect(shown).toContain(">Living room</text>");
    expect(shown).toContain("6.0 × 5.0 m");
    // The tool rail, each tool named under its picture, its key in its title.
    for (const [label, name, k] of [["Pick and move", "Pick", "V"], ["Draw a room", "Room", "R"], ["Inner wall", "Wall", "W"], ["Door", "Door", "D"], ["Window", "Window", "N"], ["Measure", "Measure", "M"]]) {
      expect(shown).toContain(`aria-label=${label} title=${label} (${k})`);
      expect(shown).toContain(`<span class="hme-rtool-name">${name}</span>`);
    }
    expect(shown).not.toContain("aria-label=Add furniture");
    // No left rail of devices: one side panel, on the left of the stage.
    expect(shown).not.toContain("hme-rail");
    expect(shown).not.toContain("Find a room, thing or device");
    expect(shown).not.toContain("Not on the map");
    expect(shown.indexOf('class="hme-insp"')).toBeGreaterThan(-1);
    expect(shown.indexOf('class="hme-insp"')).toBeLessThan(shown.indexOf('class="hme-stage-wrap"'));
    // The pins are the page's, drawn over the plan and pickable at once.
    expect(shown).not.toContain('class="hmt-pin"');
    expect(shown).toContain('class="hme-pin"');
    // Nothing picked: Start here, the floor's own card and how the page
    // works folded into Keys and tips.
    expect(shown).toContain(">Start here<");
    expect(shown).toContain("Click picks what is on top");
    expect(shown).toMatch(/<details class="hme-tips">\s*<summary>Keys and tips/);
    expect(shown).toContain("Double-click a room to edit its walls");
    // The view fits the floor in the stage.
    expect(inside.view!.scale).toBeGreaterThan(50);
    // The read reaches the page editor's tiles.
    expect(homeMapRead(ha.hass, () => undefined)).toEqual({ doc: fixture(), rev: 4 });
  });

  it("picks what is on top: a pin over a thing over a room, the inspector and the pill following", async () => {
    const { inside, press, text } = await page();
    // The pendants hang over the kitchen table: the pin wins.
    press([8.1, 2.5]);
    expect(inside.selection).toEqual({ kind: "pin", pinId: PENDANTS });
    let shown = text();
    expect(shown).toContain("Same height for all lights");
    expect(shown).toContain("Tap on the map");
    expect(shown).toContain('class="hme-pill-name">light.pendants');
    // Off the pin but on the table: the table, in any room, picked at once.
    press([8.1, 3.1]);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    shown = text();
    expect(shown).toContain("In Kitchen · 1.80 × 1.00 × 0.75 m");
    expect(shown).toContain("Line up");
    // The kitchen's open floor: the room.
    press([9.5, 4]);
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    shown = text();
    expect(shown).toContain("Delete room");
    expect(shown).toContain("Square the corners");
    // The picked room's side panel lists what is in it, and its openings.
    expect(shown).toContain('<span class="hme-ly-nm">Table</span><span class="hme-ly-end">1.8 × 1.0</span>');
    expect(shown).toContain("No doors or windows");
    // Its devices with their on or off dot: the pendants have no state, off.
    expect(shown).toMatch(/hme-dot dev off" aria-hidden="true"><\/span><span class="hme-ly-nm">light\.pendants/);
    // A thing in another room needs no picked room first.
    press([2.7, 4.15]);
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    // A pin picked shows its own cards, not its room's list.
    press([0.8, 3.1]);
    expect(text()).not.toContain(">In this room<");
  });

  it("edits a room's walls after a double-click, held to that room, and leaves with Escape, Done or a click outside", async () => {
    const { el, inside, ha, press, key, doubleClick, click, text } = await page();
    // A double-click on a pin is no room's.
    doubleClick([8.1, 2.5]);
    expect(inside.walls).toBeUndefined();
    doubleClick([9.5, 4]);
    expect(inside.walls).toBe(KITCHEN);
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    let shown = text();
    expect(shown).toContain("Kitchen walls</strong>");
    expect(shown).toContain("Editing the walls of <b>Kitchen</b>");
    expect(shown).toContain("hme-stage  hme-split-l walls");
    // The side panel: its walls, the scan check; the wall tools; Shape's
    // dock, its grid in the View menu.
    expect(shown).toMatch(/<aside class="hme-insp" aria-label=Walls>/);
    expect(shown).toContain("3 walls");
    expect(shown).toContain("Top wall");
    expect(shown).toContain("Scan check");
    expect(shown).toContain("Snap to 90°");
    expect(shown).not.toContain("Grid 5 cm");
    click("View <span");
    expect(text()).toMatch(/role=menuitemcheckbox aria-checked=false[^>]*>[^<]*<span class="hme-check" aria-hidden="true"><\/span>Grid 5 cm/);
    key("Escape");
    expect(inside.walls).toBe(KITCHEN);
    expect(text()).not.toContain("Grid 5 cm");
    for (const [label, name, k] of [["Corners and walls", "Corners", "V"], ["Split the room", "Split", "S"], ["Way through (no door)", "Opening", "O"], ["Stairs", "Stairs", "T"]]) {
      expect(shown).toContain(`aria-label=${label} title=${label} (${k})`);
      expect(shown).toContain(`<span class="hme-rtool-name">${name}</span>`);
    }
    expect(shown).not.toContain("aria-label=Add furniture");
    // The plan draws the pins again; they take no presses here.
    expect(shown).toContain('class="hmt-pin"');
    expect(shown).not.toContain('class="hme-pin"');
    // A wall is picked with a click, a corner shows its handles.
    press([8, 0.03]);
    expect(inside.selection).toEqual({ kind: "wall", roomId: KITCHEN, wall: 0 });
    shown = text();
    expect(shown).toContain("Kitchen, top wall");
    expect(shown).toContain("Window here");
    expect(shown).toContain('class="hme-pill under"');
    // Another room's wall is not this room's: a press there leaves.
    press([3, 3]);
    expect(inside.walls).toBeUndefined();
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    // Its Edit walls in the side panel goes in too; Escape comes out.
    click("Edit walls ›");
    expect(inside.walls).toBe(KITCHEN);
    key("w");
    expect(text()).toContain("Click where the wall starts");
    key("Escape");
    expect(text()).not.toContain("Click where the wall starts");
    expect(inside.walls).toBe(KITCHEN);
    key("Escape");
    expect(inside.walls).toBeUndefined();
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    // Done comes out too.
    doubleClick([9.5, 4]);
    click("Done <kbd>Esc</kbd>");
    expect(inside.walls).toBeUndefined();
    expect(text()).not.toContain("Kitchen walls");
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(0);
  });

  it("picks a tool by its key: draw a room, measure, Add's furniture, and a door on any room that goes into its walls", async () => {
    const { el, inside, ha, press, key, text } = await page();
    key("r");
    expect(text()).toContain("Click to put down the first corner");
    expect(text()).toMatch(/hme-rtool on" aria-pressed=true\s+aria-label=Draw a room/);
    key("v");
    expect(text()).not.toContain("Click to put down the first corner");
    key("m");
    expect(inside.toggles.measure).toBe(true);
    expect(text()).toMatch(/hme-rtool on" aria-pressed=true\s+aria-label=Measure/);
    key("m");
    expect(inside.toggles.measure).toBe(false);
    // F opens Add on its furniture, no tool of its own.
    key("f");
    expect((el as unknown as { addOpen?: string }).addOpen).toBe("furniture");
    expect(text()).toMatch(/hme-rtool on" aria-pressed=true\s+aria-label=Pick and move/);
    (el as unknown as { addOpen?: string }).addOpen = undefined;
    // D, then a click on the kitchen's bottom wall: a door, and the kitchen's
    // walls with the door picked.
    key("d");
    expect(text()).toContain("Click a wall to put a door in it");
    press([8, 4.98]);
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.openings[0]).toMatchObject({ kind: "door", z0: 0, z1: 2 });
    expect(inside.walls).toBe(KITCHEN);
    expect(inside.selection).toEqual({ kind: "opening", roomId: KITCHEN, opening: 0 });
    expect(text()).toContain("Sliding door");
    expect(text()).toContain("Remove door");
    // Undo keeps its keys.
    key("z", { metaKey: true });
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.openings).toEqual([]);
  });

  it("opens the Home style panel from the bar and closes it with ✕, Escape or a click outside", async () => {
    const { el, inside, ha, key, click, text } = await page();
    click("Home style</button>");
    expect(inside.styleOpen).toBe(true);
    let shown = text();
    expect(shown).toContain('class="hme-style-pop" role="dialog" aria-label="Home style"');
    // The seven looks, what the tiles show, the previews and Used on.
    for (const look of ["Plan", "Night", "Warm", "Lines", "Clay", "Blueprint", "Dots"]) expect(shown).toContain(`<span>${look}</span>`);
    for (const label of ["Room names", "Devices", "Furniture", "Light glow", "Turn"]) expect(shown).toContain(`hme-l">${label}<`);
    expect(shown).toContain("Watch tile 2 × 2");
    expect(shown).toContain("iPhone tile 4 × 2");
    // A room's floor finish is in its own card, not here.
    expect(shown).not.toContain("shows in Plan, Night and Warm");
    // Keys belong to the panel: a tool's letter does nothing; Escape closes.
    key("r");
    expect(text()).not.toContain("Click to put down the first corner");
    key("Escape");
    expect(inside.styleOpen).toBe(false);
    click("Home style</button>");
    click("hme-style-scrim", "@pointerdown=");
    expect(inside.styleOpen).toBe(false);
    click("Home style</button>");
    click("Close (Esc)");
    expect(inside.styleOpen).toBe(false);
    // A look picked is saved as the home style, and the bar's swatch follows.
    const swatch = () => /hme-style-sw" style=([^ ]*)/.exec(text())?.[1];
    const before = swatch();
    click("Home style</button>");
    click("<span>Night</span>");
    await el.session!.idle();
    expect(ha.now().doc!.style).toEqual({ look: "night" });
    expect(swatch()).not.toBe(before);
  });

  it("keeps the view as picked in and out of a room's walls", async () => {
    const { el, doubleClick, key, text } = await page();
    (el as unknown as { viewKind: string }).viewKind = "flat";
    doubleClick([9.5, 4]);
    key("Escape");
    expect((el as unknown as { viewKind: string }).viewKind).toBe("flat");
    (el as unknown as { viewKind: string }).viewKind = "model";
    expect(text()).toContain("Turn back");
    // The model's own keys stay off; Escape still clears.
    key("Escape");
    expect((el as unknown as { viewKind: string }).viewKind).toBe("model");
  });

  it("puts the model beside the plan in Both, the picked thing outlined in it and edited on the plan", async () => {
    const { el, inside, press, key, click, text } = await page();
    (el as unknown as { viewKind: string }).viewKind = "both";
    let shown = text();
    expect(shown).toContain("hme-split-l");
    expect(shown).toContain("hme-split-r");
    expect(shown).toContain("Model of Ground floor");
    // The plan's dock and the model's both show, each with its menu; Live
    // states only in the plan's View menu.
    expect(shown).toContain(">Snap</button>");
    expect(shown).toContain("Turn back");
    expect(shown).toMatch(/>View <span class="hme-caret"/);
    expect(shown).toMatch(/>Look: Night <span class="hme-caret"/);
    expect(shown).not.toContain("Live states");
    click("View <span");
    shown = text();
    expect(shown.split("Live states").length - 1).toBe(1);
    for (const item of ["Grid 10 cm", "Side view", "Names", "Live states"]) expect(shown).toMatch(new RegExp(`role=menuitemcheckbox[^>]*>[^<]*<span class="hme-check"[^>]*>✓?</span>${item}<`));
    expect(shown).not.toContain("Show scan as it was");
    // Live states is on: its item is ticked, and a click turns it off,
    // keeping the menu open.
    expect(shown).toMatch(/aria-checked=true[^>]*>[^<]*<span class="hme-check"[^>]*>✓<\/span>Live states/);
    click("</span>Live states");
    expect((el as unknown as { toggles: { live: boolean } }).toggles.live).toBe(false);
    expect(text()).toMatch(/aria-checked=false[^>]*>[^<]*<span class="hme-check"[^>]*><\/span>Live states/);
    // The Look menu holds the looks, one picked, and closes on a pick.
    click("Look: Night <span");
    expect(text()).not.toContain("</span>Live states");
    expect(text()).toMatch(/role=menuitemradio aria-checked=true[^>]*>[^<]*<span class="hme-check"[^>]*>✓<\/span>Night</);
    click("</span>Clay<");
    expect(text()).toMatch(/>Look: Clay <span class="hme-caret"/);
    expect(text()).not.toContain('class="hme-dock-pop"');
    // The plan still edits: pick the kitchen, then its table.
    press([9.5, 4]);
    expect(text()).toContain("hmt-mark");
    press([8, 2]);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    shown = text();
    expect(shown).toContain("hmt-mark");
    expect(shown).toContain("In Kitchen · 1.80 × 1.00 × 0.75 m");
    key("Escape");
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
  });

  it("picks what a click on the 3D look found, and leaves a room's walls for a click elsewhere", async () => {
    const { el, inside } = await page();
    el.pick3d({ kind: "object", roomId: KITCHEN, object: 2 });
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    el.pick3d({ kind: "pin", pinId: READING });
    expect(inside.selection).toEqual({ kind: "pin", pinId: READING });
    el.pick3d({ kind: "room", roomId: LIVING });
    expect(inside.selection).toEqual({ kind: "room", roomId: LIVING });
    el.pick3d(undefined);
    expect(inside.selection).toBeUndefined();
    // Editing the kitchen's walls: a click on the kitchen keeps them, a
    // click on another room goes back to the floor with the kitchen picked.
    el.editWalls(KITCHEN);
    el.pick3d({ kind: "room", roomId: KITCHEN });
    expect(inside.walls).toBe(KITCHEN);
    el.pick3d({ kind: "room", roomId: LIVING });
    expect(inside.walls).toBeUndefined();
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
  });

  it("picks several things with Cmd or Ctrl on the plan and in 3D, each outlined and listed in the side panel", async () => {
    const { el, inside, press, key, text } = await page();
    const view3d = () => (el as unknown as { input3d(): { mark: unknown; floor: HomeMapDocument["floors"][number] } }).input3d();
    const table = { roomId: KITCHEN, object: 2 };
    const sofa = { roomId: LIVING, object: 0 };
    const tv = { roomId: LIVING, object: 2 };
    press([8, 2]);
    press([2.7, 4.15], [], { metaKey: true });
    expect(inside.selection).toEqual({ kind: "objects", items: [table, sofa] });
    // In 3D, Ctrl adds the television and takes it out again; a room or
    // empty space with Ctrl leaves the pick as it is.
    el.pick3d({ kind: "object", ...tv }, { add: true });
    expect(inside.selection).toEqual({ kind: "objects", items: [table, sofa, tv] });
    el.pick3d({ kind: "room", roomId: LIVING }, { add: true });
    el.pick3d(undefined, { add: true });
    expect(inside.selection).toEqual({ kind: "objects", items: [table, sofa, tv] });
    expect(view3d().mark).toEqual({ things: [table, sofa, tv] });
    el.pick3d({ kind: "object", ...tv }, { add: true });
    const shown = text();
    expect(shown).toContain("<strong>2 things</strong>");
    expect(shown).toContain("Table and Sofa · in Kitchen, Living room");
    expect(shown.split("hme-list-row hme-pick-row").length - 1).toBe(2);
    expect(shown).toContain("2 things</span>");
    // A light with Cmd starts a pick of lights; a plain click one thing again.
    el.pick3d({ kind: "pin", pinId: READING }, { add: true });
    expect(inside.selection).toEqual({ kind: "pin", pinId: READING });
    el.pick3d({ kind: "object", ...sofa }, { add: true });
    el.pick3d({ kind: "object", ...table }, { add: true });
    expect(inside.selection).toEqual({ kind: "objects", items: [sofa, table] });
    el.pick3d({ kind: "object", ...table });
    expect(inside.selection).toEqual({ kind: "object", ...table });
    el.pick3d({ kind: "object", ...sofa }, { add: true });
    key("Escape");
    expect(inside.selection).toBeUndefined();
  });

  it("shows a custom colour live on the plan and in 3D, saved once when the picker closes, and nothing kept when it is left unchanged", async () => {
    const { el, ha, press } = await page();
    const view3d = () => (el as unknown as { input3d(): { floor: HomeMapDocument["floors"][number] } }).input3d();
    press([2.7, 4.15]);
    const target = { value: "#112233" };
    handler(el.render(), "Pick a fabric colour", "@input=")({ target });
    expect(view3d().floor.rooms[0]!.objects[0]!.fabric).toBe("#112233");
    expect(el.context()!.doc.floors[0]!.rooms[0]!.objects[0]!.fabric).toBeUndefined();
    await settle();
    expect(ha.saves()).toHaveLength(0);
    target.value = "#223344";
    handler(el.render(), "Pick a fabric colour", "@input=")({ target });
    expect(view3d().floor.rooms[0]!.objects[0]!.fabric).toBe("#223344");
    handler(el.render(), "Pick a fabric colour", "@change=")({ target });
    await settle();
    expect(ha.saves()).toHaveLength(1);
    expect(el.context()!.doc.floors[0]!.rooms[0]!.objects[0]!.fabric).toBe("#223344");
    // One undo takes the whole pick back.
    el.undo();
    expect(view3d().floor.rooms[0]!.objects[0]!.fabric).toBeUndefined();
    // A light's glow colour moved and then clicked away from, with no
    // change sent: the click away saves it, once.
    await settle();
    const saves = ha.saves().length;
    press([0.8, 3.1]);
    const glow = { value: "#00ff00" };
    handler(el.render(), "Pick the glow's color", "@input=")({ target: glow });
    expect(view3d().floor.pins.find((p) => p.id === READING)!.glowColor).toBe("#00ff00");
    handler(el.render(), "Pick the glow's color", "@blur=")({ target: glow });
    await settle();
    expect(view3d().floor.pins.find((p) => p.id === READING)!.glowColor?.toLowerCase()).toBe("#00ff00");
    expect(ha.saves()).toHaveLength(saves + 1);
    // Moved and brought back to where it started, then left: nothing saved.
    const start = view3d().floor.pins.find((p) => p.id === READING)!.glowColor!.toLowerCase();
    const back = { value: "#123456" };
    handler(el.render(), "Pick the glow's color", "@input=")({ target: back });
    back.value = start;
    handler(el.render(), "Pick the glow's color", "@input=")({ target: back });
    handler(el.render(), "Pick the glow's color", "@blur=")({ target: back });
    await settle();
    expect(ha.saves()).toHaveLength(saves + 1);
  });

  it("draws the pins itself, picks and drags one, saved once, and sets a light's glow by its ring's handle", async () => {
    const { el, inside, ha, press, text } = await page();
    const shown = text();
    // The plan leaves its glass pins to the page, which rings none yet.
    expect(shown).not.toContain('class="hmt-pin"');
    expect(shown).toContain('class="hme-pin"');
    press([0.8, 3.1]);
    expect(inside.selection).toEqual({ kind: "pin", pinId: READING });
    const picked = text();
    expect(picked).toContain("Same height for all lights");
    expect(picked).toContain("Turn off");
    expect(picked).toContain("Living room from the side");
    expect(picked).toContain("Living room (found by place)");
    expect(picked).toContain("Auto (floor lamp)");
    expect(picked).toContain("Glow 2.0 m");
    expect(ha.saves()).toHaveLength(0);
    press([0.8, 3.1], [[1.0, 3.2], [1.3, 3.4]]);
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(1);
    expect(ha.now().doc!.floors[0]!.pins[0]!.at).toEqual([1.3, 3.4, 1.5]);
    // The handle sits on the ring, down and to the right.
    const r = 0.6 + 1.8 * (200 / 255);
    const h: [number, number] = [1.3 + r * Math.SQRT1_2, 3.4 + r * Math.SQRT1_2];
    press(h, [[h[0] + 0.5, h[1]], [1.3 + 3, 3.4]]);
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins[0]!.glow).toBe(3);
    expect(text()).toContain("Glow 3.0 m");
  });

  it("places a device dropped on the plan in the room under it, and every device of the floor's areas at once", async () => {
    const { el, ha, inside, stage, screen, text } = await page();
    (ha.hass as unknown as Record<string, unknown>).entities = { "switch.fan": { area_id: "kitchen" }, "light.reading_lamp": { area_id: "living_room" } };
    /** The devices with an area not on the map yet, as Add's Place all
     * takes them. */
    const tray = () => homeMapTray(el.context()!.doc, el.context()!.floor, homeMapDevices(ha.hass)).flatMap((g) => g.devices);
    expect(tray().map((d) => d.entityId)).toEqual(["switch.fan"]);
    const [x, y] = screen([8, 3]);
    const dropped = { clientX: x, clientY: y, currentTarget: stage, preventDefault: () => undefined, dataTransfer: { types: ["application/x-wa-home-map-entity"], getData: () => "switch.fan" } };
    el.onStageDrag(dropped as unknown as DragEvent);
    expect(text()).toContain("Drop in Kitchen");
    el.onStageDrop(dropped as unknown as DragEvent);
    await el.session!.idle();
    const pin = ha.now().doc!.floors[0]!.pins.at(-1)!;
    expect(pin).toMatchObject({ entityId: "switch.fan", roomId: KITCHEN, at: [8, 3, 0.3] });
    expect(inside.selection).toEqual({ kind: "pin", pinId: pin.id });
    expect(text()).not.toContain("Drop in Kitchen");
    // No longer one to add now it is on the map.
    expect(tray()).toEqual([]);
    el.undo();
    await el.session!.idle();
    expect(tray().map((d) => d.entityId)).toEqual(["switch.fan"]);
    // Place all puts each into the room of its area, as one edit.
    el.page.devices.placeAll(el.context()!, tray());
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins.at(-1)).toMatchObject({ entityId: "switch.fan", roomId: KITCHEN });
    expect(tray()).toEqual([]);
  });

  it("sets the home style in its panel, and lists the library's Home map tiles", async () => {
    const { el, ha, text } = await page();
    el.toggleStyle();
    text();
    await settle();
    expect(text()).toContain("Used on 0 tiles");
    el.apply((d) => setHomeStyle(d, { look: "night", turn: 40 }));
    await el.session!.idle();
    expect(ha.now().doc!.style).toEqual({ look: "night", turn: 40 });
    const shown = text();
    expect(shown).toContain("A small model at night.");
    expect(shown).toContain(">40°</span>");
    expect(shown).toContain("Watch tile 2 × 2");
    expect(shown).toContain("iPhone tile 4 × 2");
  });

  it("picks a room with a press and shows its name, area, page, place, finish and things; a click on empty space clears it", async () => {
    const { inside, press, text } = await page();
    press([9.5, 4]);
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    const shown = text();
    expect(shown).toContain(">Den</option>");
    expect(shown).toContain(">Page: Evening</option>");
    expect(shown).toContain("Auto: Tile");
    expect(shown).toContain("Fridge");
    expect(shown).toContain("Turn 90°");
    expect(shown).toContain("Delete room");
    expect(shown).toContain("4.00 m");
    press([20, 20]);
    expect(inside.selection).toBeUndefined();
  });

  it("puts a resize a second finger interrupts back as it was: its sizes once, its handles back, nothing saved", async () => {
    const { el, ha, press, stage, pointer, text } = await page();
    press([9.5, 4]);
    const tags = (s: string) => s.split('class="hme-tag"').length - 1;
    const sizes = (s: string) => s.match(/\d+\.\d\d m</g);
    const idle = text();
    expect(sizes(idle)).toEqual(["5.00 m<", "4.00 m<"]);
    expect(idle).toContain('data-hme="resize"');
    // A corner's handle, by one finger: both sizes grow, shown once each.
    const handle = { closest: () => ({ getAttribute: (k: string) => (k === "data-hme" ? "resize" : "4") }) };
    const touch = (p: [number, number], id: number) => pointer(p, { pointerType: "touch", pointerId: id, target: handle });
    el.onStageDown(touch([10, 5], 1) as unknown as PointerEvent);
    stage.fire("pointermove", touch([10.3, 5.3], 1));
    stage.fire("pointermove", touch([10.5, 5.5], 1));
    const resizing = text();
    expect(sizes(resizing)).toHaveLength(2);
    expect(sizes(resizing)).not.toEqual(sizes(idle));
    expect(resizing).not.toContain('data-hme="resize"');
    // A second finger: the stage pinches and the resize is dropped.
    el.onStageDown(touch([4, 4], 2) as unknown as PointerEvent);
    const after = text();
    expect(sizes(after)).toEqual(sizes(idle));
    expect(after).toContain('data-hme="resize"');
    expect(tags(after)).toBe(tags(idle));
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(0);
    expect(el.context()!.floor.rooms[1]!.outline[1]).toEqual([10, 0]);
  });

  it("drags a room, snapping to its neighbour's wall with a guide, and saves once on the drop", async () => {
    const { el, ha, press, stage, pointer, text } = await page();
    // Press on the kitchen's open floor and drag it 12 cm right and 10 cm
    // down, a step at a time: its top wall snaps back in line with the
    // living room's.
    el.onStageDown(pointer([9.5, 4]) as unknown as PointerEvent);
    stage.fire("pointermove", pointer([9.55, 4.05]));
    stage.fire("pointermove", pointer([9.62, 4.1]));
    expect(text()).toContain("Lined up with Living room wall");
    expect(ha.saves()).toHaveLength(0);
    stage.fire("pointerup", pointer([9.62, 4.1]));
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(1);
    expect(ha.saves()[0]!.base_rev).toBe(4);
    const kitchen = ha.now().doc!.floors[0]!.rooms[1]!;
    expect(kitchen.outline[0]).toEqual([6.12, 0]);
    // Alt moves it freely.
    press([9.5, 4], [[10.1, 4]], { altKey: true });
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.outline[0]![0]).toBeCloseTo(6.7, 1);
    expect(ha.saves().map((s) => s.base_rev)).toEqual([4, 5]);
  });

  it("picks a thing with a click on it, drags it, and saves once on the drop", async () => {
    const { el, inside, ha, press, key, text } = await page();
    // A thing lies over its room: a click on the table picks it at once.
    press([8, 2]);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    expect(text()).toContain("In Kitchen · 1.80 × 1.00 × 0.75 m");
    expect(text()).toContain('data-hme="resize"');
    // A drag on it moves it, not the room.
    press([8, 2], [[8, 2.3], [8, 2.5]]);
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(1);
    const kitchen = () => ha.now().doc!.floors[0]!.rooms[1]!;
    expect(kitchen().objects[2]!.c).toEqual([8.1, 3]);
    expect(kitchen().outline[0]).toEqual([6, 0]);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    // An arrow nudges it, Escape goes back to the room.
    key("ArrowRight", { shiftKey: true });
    await el.session!.idle();
    expect(kitchen().objects[2]!.c).toEqual([8.2, 3]);
    key("Escape");
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    // Cmd and a click picks a thing in another room, as a plain click does;
    // Delete removes it with no question, Undo bringing it back.
    press([2.7, 4.15], [], { metaKey: true });
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    key("Delete");
    await el.session!.idle();
    expect(inside.dialog).toBeUndefined();
    expect(ha.now().doc!.floors[0]!.rooms[0]!.objects.map((o) => o.kind)).toEqual(["table", "television"]);
    expect(inside.selection).toEqual({ kind: "room", roomId: LIVING });
  });

  it("undoes and redoes with the keys, never while a field has focus", async () => {
    const { el, ha, key } = await page();
    el.apply((d) => renameRoom(d, KITCHEN, "Galley"));
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.name).toBe("Galley");
    // Typing in a field: the field's own undo.
    el.onKey({ key: "z", metaKey: true, preventDefault: () => undefined, composedPath: () => [{ tagName: "INPUT", type: "text" }] } as unknown as KeyboardEvent);
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.name).toBe("Galley");
    key("z", { metaKey: true });
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.name).toBe("Kitchen");
    key("z", { metaKey: true, shiftKey: true });
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.name).toBe("Galley");
    expect(ha.saves()).toHaveLength(3);
  });

  it("leaves a focused slider its arrow keys, so they never nudge the picked pin", async () => {
    const { el, ha, press, key } = await page();
    press([0.8, 3.1]);
    const slider = { tagName: "INPUT", type: "range" };
    let stopped = false;
    for (const k of ["ArrowUp", "ArrowLeft", "Home", "PageDown"]) {
      el.onKey({ key: k, preventDefault: () => { stopped = true; }, composedPath: () => [slider] } as unknown as KeyboardEvent);
    }
    await el.session!.idle();
    expect(stopped).toBe(false);
    expect(ha.saves()).toHaveLength(0);
    // An arrow anywhere else still nudges it.
    key("ArrowRight");
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(1);
    expect(ha.now().doc!.floors[0]!.pins[0]!.at[0]).toBeCloseTo(0.81, 5);
  });

  it("never removes, clears or zooms from a key pressed in any control of a form, though undo still works from a slider", async () => {
    const { el, ha, press, key, inside } = await page();
    press([0.8, 3.1]);
    const picked = el.context()!.selection;
    expect(picked).toBeDefined();
    const view = el.context()!.view;
    const controls = [
      { tagName: "INPUT", type: "range" },
      { tagName: "INPUT", type: "color" },
      { tagName: "INPUT", type: "text" },
      { tagName: "INPUT", type: "number" },
      { tagName: "INPUT", type: "checkbox" },
      { tagName: "SELECT" },
      { tagName: "TEXTAREA" },
      { tagName: "DIV", isContentEditable: true },
    ];
    for (const control of controls) {
      for (const k of ["Delete", "Backspace", "Escape", "Enter", "=", "0", "v", " "]) {
        let stopped = false;
        el.onKey({ key: k, preventDefault: () => { stopped = true; }, composedPath: () => [control] } as unknown as KeyboardEvent);
        expect(stopped, `${control.tagName} ${String(control.type)} ${k}`).toBe(false);
      }
    }
    await el.session!.idle();
    expect(inside.dialog).toBeUndefined();
    expect(ha.saves()).toHaveLength(0);
    expect(el.context()!.selection).toEqual(picked);
    expect(el.context()!.view).toEqual(view);
    // A nudge, then undo from the slider: undo is still the editor's there,
    // while in a text field it stays the field's own.
    key("ArrowRight");
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins[0]!.at[0]).toBeCloseTo(0.81, 5);
    el.onKey({ key: "z", metaKey: true, preventDefault: () => undefined, composedPath: () => [{ tagName: "INPUT", type: "number" }] } as unknown as KeyboardEvent);
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins[0]!.at[0]).toBeCloseTo(0.81, 5);
    el.onKey({ key: "z", metaKey: true, preventDefault: () => undefined, composedPath: () => [{ tagName: "INPUT", type: "range" }] } as unknown as KeyboardEvent);
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins[0]!.at[0]).toBeCloseTo(0.8, 5);
    // Delete anywhere else still takes it off the map.
    const pins = ha.now().doc!.floors[0]!.pins.length;
    key("Delete");
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.pins).toHaveLength(pins - 1);
  });

  it("asks before deleting a room in its own dialog, not the browser's", async () => {
    const { el, inside, ha, press, key, text } = await page();
    vi.stubGlobal("window", { confirm: () => { throw new Error("no browser dialogs"); } });
    press([9.5, 4]);
    key("Delete");
    expect(inside.dialog?.kind).toBe("confirm");
    expect(inside.dialog?.title).toBe("Delete Kitchen?");
    expect(inside.dialog?.text).toContain("Its 2 devices come off the map too.");
    expect(text()).toContain('class="hme-dialog"');
    // Keys belong to the dialog while it is open.
    key("z", { metaKey: true });
    inside.dialog!.done(false);
    await settle();
    expect(ha.saves()).toHaveLength(0);
    key("Delete");
    inside.dialog!.done(true);
    await settle();
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms.map((r) => r.id)).toEqual([LIVING]);
    expect(inside.selection).toBeUndefined();
  });

  it("puts an edit on top of a map another device saved meanwhile, and says so", async () => {
    const { el, ha, text } = await page();
    ha.elsewhere((d) => applyHomeMapEdit(d, { kind: "renameRoom", roomId: LIVING, name: "Lounge" })!);
    expect(el.apply((d) => renameRoom(d, KITCHEN, "Galley"))).toBe(true);
    await el.session!.idle();
    expect(ha.saves().map((s) => s.base_rev)).toEqual([4, 5]);
    expect(ha.now().doc!.floors[0]!.rooms.map((r) => r.name)).toEqual(["Lounge", "Galley"]);
    expect(text()).toContain(HOME_MAP_MERGED_TEXT);
    expect(el.session!.doc!.floors[0]!.rooms[0]!.name).toBe("Lounge");
    // Undo would lose the other device's change, so it is not offered.
    expect(el.context()!.canUndo).toBe(false);
  });

  it("says so, and shows the map as saved elsewhere, when the edit no longer fits it", async () => {
    const { el, ha, text } = await page();
    ha.elsewhere((d) => applyHomeMapEdit(d, { kind: "deleteRoom", roomId: KITCHEN })!);
    expect(el.apply((d) => renameRoom(d, KITCHEN, "Galley"))).toBe(true);
    await el.session!.idle();
    expect(text()).toContain(HOME_MAP_GONE_TEXT);
    expect(text()).toContain("Not saved");
    expect(el.session!.doc!.floors[0]!.rooms).toHaveLength(1);
    expect(ha.saves()).toHaveLength(1);
  });

  it("shows each floor in the picker and switches between them", async () => {
    const doc = fixture();
    const upstairs = { id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000002", name: "Upstairs", story: 1, rooms: [{ ...doc.floors[0]!.rooms[1]!, id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000020", name: "Bedroom" }], pins: [] };
    const { el, text } = await page({ doc: { v: 1, floors: [...doc.floors, upstairs] }, rev: 2 });
    (el as unknown as { floorMenu: boolean }).floorMenu = true;
    expect(text()).toContain("<span>Upstairs</span>");
    expect(text()).toContain("Add a floor");
    el.setFloor(upstairs.id);
    expect(text()).toContain("Plan of Upstairs");
    expect(text()).toContain(">Bedroom</text>");
  });

  it("picks a wall in a room's walls, puts a door in it with D and a click, and Escape drops a tool", async () => {
    const { el, inside, ha, press, key, doubleClick, text } = await page();
    doubleClick([9.5, 4]);
    press([8, 0.03]);
    expect(inside.selection).toEqual({ kind: "wall", roomId: KITCHEN, wall: 0 });
    expect(text()).toContain("Kitchen, top wall");
    expect(text()).toContain("Window here");
    key("w");
    expect(text()).toContain("Click where the wall starts");
    key("Escape");
    expect(text()).not.toContain("Click where the wall starts");
    key("d");
    expect(text()).toContain("Click a wall to put a door in it");
    press([8, 4.98]);
    await el.session!.idle();
    const kitchen = ha.now().doc!.floors[0]!.rooms[1]!;
    expect(kitchen.openings).toHaveLength(1);
    expect(kitchen.openings[0]).toMatchObject({ kind: "door", z0: 0, z1: 2 });
    expect(inside.selection).toEqual({ kind: "opening", roomId: KITCHEN, opening: 0 });
    expect(text()).toContain("Sliding door");
    expect(text()).toContain("Remove door");
  });

  it("pans a drag on empty space and zooms with the keys and the wheel", async () => {
    const { el, inside, press, key } = await page();
    const before = { ...inside.view! };
    press([-3, -1], [[-2, -1]]);
    expect(inside.view!.ox).toBeCloseTo(before.ox + before.scale, 3);
    key("+");
    expect(inside.view!.scale).toBeCloseTo(before.scale * 1.25, 3);
    el.onWheel({ deltaX: 0, deltaY: -100, deltaMode: 0, ctrlKey: true, metaKey: false, clientX: 500, clientY: 300, currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) }, preventDefault: () => undefined } as unknown as WheelEvent);
    expect(inside.view!.scale).toBeGreaterThan(before.scale * 1.25);
    key("0");
    expect(inside.view!.scale).toBeCloseTo(before.scale, 3);
  });
});

// ── the side panel ───────────────────────────────────────────────────────

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const THERMOSTAT = "7B1E0C2A-5D3F-4A8B-9C6D-000000000104";
const HELD = "7B1E0C2A-5D3F-4A8B-9C6D-000000000900";

/** The name of the In this room row the hover rings, if any. */
const ringedRow = (text: string) => /class="hme-ly [^"]*\bhov\b[^"]*"[\s\S]*?<span class="hme-ly-nm">([^<]+)</.exec(text)?.[1];

describe("the map editor's side panel", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
  });
  afterEach(() => {
    forgetHomeMap();
  });

  it("counts Start here's steps: a room, a thing, every light in a lamp", () => {
    const doc = fixture();
    const floor = doc.floors[0]!;
    expect(homeMapStartSteps(floor)).toEqual({ rooms: 2, things: 6, lights: 3, loose: [READING, CEILING, PENDANTS], done: [true, true, false] });
    expect(homeMapStartSteps({ ...floor, rooms: [], pins: [] }).done).toEqual([false, false, false]);
    // No lights at all is not done: there is nothing in a lamp yet.
    expect(homeMapStartSteps({ ...floor, pins: floor.pins.filter((p) => !p.entityId.startsWith("light.")) }).done).toEqual([true, true, false]);
    // Every light in a lamp: done.
    let held = addLampLight(doc, FLOOR, LIVING, "light.reading_lamp", "floor", [4.8, 2], HELD)!.doc;
    held = { ...held, floors: [{ ...held.floors[0]!, pins: held.floors[0]!.pins.filter((p) => !p.entityId.startsWith("light.") || p.id === HELD) }] };
    expect(homeMapStartSteps(held.floors[0]!)).toMatchObject({ lights: 1, loose: [], done: [true, true, true] });
  });

  it("shows Start here with nothing picked: done, now and next, the loose lights picked by its button, then the floor and Keys and tips", async () => {
    const { el, inside, click, text } = await page();
    const shown = text();
    expect(shown).toContain('<span class="hme-h-end">2 of 3 done</span>');
    expect(shown).toMatch(/hme-step done[\s\S]*?<b>Rooms<\/b><span>2 rooms on Ground floor\. Draw one with Room, or scan one with the iPhone\.<\/span>/);
    expect(shown).toMatch(/hme-step done[\s\S]*?<b>Furniture<\/b><span>6 things\. Add more from Add › Furniture\.<\/span>/);
    expect(shown).toMatch(/hme-step now[\s\S]*?<b>Lights in lamps<\/b><span>3 lights sit loose\./);
    // The floor's card, then the tips folded into one line.
    expect(shown).toContain(">Floor<");
    expect(shown).toContain("2 rooms · 6 things · 5 devices");
    expect(shown.indexOf(">Start here<")).toBeLessThan(shown.indexOf(">Floor<"));
    expect(shown.indexOf(">Floor<")).toBeLessThan(shown.indexOf("Keys and tips"));
    // The button picks every light no lamp holds.
    click("Show me the loose lights");
    expect(inside.selection).toEqual({ kind: "pins", pinIds: [READING, CEILING, PENDANTS] });
    expect(text()).not.toContain(">Start here<");
    // Add › Furniture opens Add on its furniture.
    inside.selection = undefined;
    click(">Add › Furniture<");
    expect((el as unknown as { addOpen?: string }).addOpen).toBe("furniture");
  });

  it("starts an empty floor on its first step, Draw a room starting the drawing", async () => {
    const empty: HomeMapDocument = { v: 1, floors: [{ id: FLOOR, name: "Ground floor", story: 0, rooms: [], pins: [] }] };
    const { click, text } = await page({ doc: empty, rev: 1 });
    const shown = text();
    expect(shown).toContain('<span class="hme-h-end">0 of 3 done</span>');
    expect(shown).toMatch(/hme-step now[\s\S]*?<b>Rooms<\/b>/);
    expect(shown).toMatch(/hme-step next[\s\S]*?<b>Furniture<\/b><span>None yet\./);
    expect(shown).toMatch(/hme-step next[\s\S]*?<b>Lights in lamps<\/b><span>No lights yet\./);
    expect(shown).not.toContain("Show me the loose lights");
    click("Draw a room ›");
    expect(text()).toContain("Click to put down the first corner");
  });

  it("lists In this room for a picked room: lamps and lights, furniture and devices, and Add to the room", async () => {
    const doc = addLampLight(fixture(), FLOOR, LIVING, "light.reading_lamp", "floor", [4.8, 2], HELD)!.doc;
    const { el, inside, press, click, text } = await page({ doc, rev: 4 });
    press([5, 4.5]);
    expect(inside.selection).toEqual({ kind: "room", roomId: LIVING });
    const shown = text();
    // The room's head: its size, its area and its floor.
    expect(shown).toContain("6.0 × 5.0 m · 30.0 m² · Living room area");
    // Four things and three devices: the light the lamp holds is its row.
    const card = shown.slice(shown.indexOf(">In this room<"), shown.indexOf(">Room<"));
    expect(card).toContain('<span class="hme-h-end">7</span>');
    const names = [...card.matchAll(/<div class="hme-ly-grp">([^<]+)<\/div>|<span class="hme-ly-nm">([^<]+)<\/span>/g)].map((m) => m[1] ?? m[2]);
    expect(names).toEqual(["Lamps and lights", "Floor lamp", "Reading lamp", "light.ceiling", "Furniture", "Sofa", "Table", "TV", "Devices", "lock.side_door"]);
    // A lamp says the light it holds and its state; a loose light says so.
    expect(card).toContain('hme-ly-lamp lit');
    expect(card).toContain('<span class="hme-ly-nm">Floor lamp</span><span class="hme-ly-end">Reading lamp · on · 78%</span>');
    expect(card).toContain('<span class="hme-ly-nm">Reading lamp</span><span class="hme-ly-end">on · 78% · in no lamp</span>');
    // Things have an eye, devices none.
    expect(card.match(/class="hme-eye"/g)).toHaveLength(4);
    expect(card).toContain("aria-label=Hide Sofa");
    // Add to the room opens Add, on its devices.
    expect(card).toContain("＋ Add to Living room");
    click("＋ Add to Living room");
    expect((el as unknown as { addOpen?: string }).addOpen).toBe("devices");
    // The room's own cards follow.
    expect(shown.indexOf(">In this room<")).toBeLessThan(shown.indexOf(">Floor finish<"));
    expect(shown).toContain(">Walls and more<");
  });

  it("hides and shows a thing from its eye, the hidden one staying listed, dimmed", async () => {
    const { el, ha, press, click, text } = await page();
    press([9.5, 4]);
    click("aria-label=Hide Table");
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.objects[2]!.hidden).toBe(true);
    let shown = text();
    expect(shown).toMatch(/class="hme-ly  [^"]*hid"[\s\S]*?<span class="hme-ly-nm">Table<\/span><span class="hme-ly-end">hidden<\/span>/);
    expect(shown).toContain("aria-label=Show Table");
    click("aria-label=Show Table");
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.objects[2]!.hidden).toBeUndefined();
    shown = text();
    expect(shown).toContain("aria-label=Hide Table");
    expect(ha.saves()).toHaveLength(2);
  });

  it("picks a row's thing or device with a click", async () => {
    const { el, inside, press, text } = await page();
    const plain = { metaKey: false, ctrlKey: false, shiftKey: false };
    const row = (name: string) => handler(el.render(), `<span class="hme-ly-nm">${name}</span>`, "@click=");
    press([9.5, 4]);
    row("Fridge")(plain);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 0 });
    // The thing picked: its own cards, not the room's list.
    expect(text()).not.toContain(">In this room<");
    expect(text()).toContain("In Kitchen · 0.75 × 0.70 × 1.80 m");
    // Cmd from the room picks the thing alone, as on the plan.
    el.select({ kind: "room", roomId: KITCHEN });
    row("Table")({ ...plain, metaKey: true });
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 2 });
    // A device's row picks its pin.
    el.select({ kind: "room", roomId: KITCHEN });
    row("climate.thermostat")(plain);
    expect(inside.selection).toEqual({ kind: "pin", pinId: THERMOSTAT });
  });

  it("tints a row's thing while the pointer is over the row, and rings the row the plan or 3D hovers", async () => {
    const { el, inside, press, text } = await page();
    const hovered = () => (el as unknown as { hover?: unknown }).hover;
    press([9.5, 4]);
    expect(ringedRow(text())).toBeUndefined();
    const marker = '<span class="hme-ly-nm">Fridge</span>';
    handler(el.render(), marker, "@pointerenter=")();
    expect(hovered()).toEqual({ kind: "object", roomId: KITCHEN, object: 0 });
    expect(ringedRow(text())).toBe("Fridge");
    // The hover never picks and never saves.
    expect(inside.selection).toEqual({ kind: "room", roomId: KITCHEN });
    handler(el.render(), marker, "@pointerleave=")();
    expect(hovered()).toBeUndefined();
    expect(ringedRow(text())).toBeUndefined();
    // A hover from the plan or 3D, on the thermostat's pin, rings its row.
    el.context()!.setHover({ kind: "pin", pinId: THERMOSTAT });
    expect(ringedRow(text())).toBe("climate.thermostat");
    el.context()!.setHover(undefined);
    expect(ringedRow(text())).toBeUndefined();
  });
});
