// The Home map page (app repo docs/home_map_plan_2026-10.md, "The panel"):
// its address among the whole home's screens, listed only with the
// integration's `home_map`; the flat plan as every device draws it (walls cut
// for doors and openings, windows in blue, pins coloured by what their
// entity is doing); and the map editor's shell with its Arrange and Shape
// modes: the bar, the stage's presses and drags, the keys, the page's own
// dialogs, and every edit made at once and saved soon after from the rev
// it was read at, put on top of a newer map after a conflict, and said so
// when that cannot be done.
//
// The element is made and driven directly, with Home Assistant stood in: its
// views are read as text, a press on the stage is a stand-in event on a
// stand-in stage, and every edit is a real save sent to the stand-in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { HOME_PLAN_COLORS, homePinGlowRadius, homePinPaint, homePlan, homePlanViewBox, homeWallPieces } from "../src/home-map/draw.js";
import { HOME_MAP_EMPTY_TEXT, HOME_MAP_UPDATE_TEXT, WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import { HOME_MAP_PATH, isHomeMapRoute, renderHomeMapView } from "../src/home-map/hook.js";
import { type HomeMapDocument, type HomeMapStates, applyHomeMapEdit } from "../src/home-map/model.js";
import { renameRoom, setHomeStyle } from "../src/home-map/edit-ops.js";
import { HOME_MAP_GONE_TEXT, HOME_MAP_MERGED_TEXT } from "../src/home-map/save.js";
import { forgetHomeMap, homeMapRead, setHomeMapCapable } from "../src/home-map/store.js";
import { NO_ICONS } from "../src/watch-pages/editor-host.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
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
  selection?: { kind: string; roomId?: string; wall?: number; opening?: number };
  dialog?: { kind: string; title: string; text?: string; done: (v: unknown) => void };
  mode: string;
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
  return { el, inside, ha, stage, screen, pointer, press, key, text: () => flatten(el.render()) };
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
    for (const tab of ["Arrange", "Shape", "Devices", "Style"]) expect(shown).toContain(`>${tab}</button>`);
    expect(shown).toContain("Saved");
    expect(shown).toContain("Plan of Ground floor");
    expect(shown).toContain(">Living room</text>");
    expect(shown).toContain("6.0 × 5.0 m");
    expect(shown).toContain("Draw a room by hand");
    expect(shown).toContain("Find a room or device");
    // Nothing picked: the floor's own card.
    expect(shown).toContain("Pick a room on the plan");
    // The view fits the floor in the stage.
    expect(inside.view!.scale).toBeGreaterThan(50);
    // The read reaches the page editor's tiles.
    expect(homeMapRead(ha.hass, () => undefined)).toEqual({ doc: fixture(), rev: 4 });
  });

  it("switches modes", async () => {
    const { el, inside, text } = await page();
    el.setMode("shape");
    expect(inside.mode).toBe("shape");
    expect(text()).toContain("Walls and corners");
    expect(text()).toContain("Scan check");
    expect(text()).toContain("Snap to 90°");
    el.setMode("devices");
    expect(text()).toContain("Find any device");
    expect(text()).toContain("Not on the map");
    expect(text()).toContain("Side view");
    el.setMode("style");
    expect(text()).toContain("Looks");
    expect(text()).toContain("Home style");
    // Style's own middle: no plan and no Flat or Model.
    expect(text()).not.toContain("Plan of Ground floor");
    expect(text()).not.toContain(">Model</button>");
    el.setMode("arrange");
    expect(text()).toContain("Snap to walls");
  });

  it("draws the pins itself in Devices, picks and drags one, saved once, and sets a light's glow by its ring's handle", async () => {
    const { el, inside, ha, press, text } = await page();
    el.setMode("devices");
    const shown = text();
    // The plan leaves its glass pins to the mode, which rings none yet.
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
    el.setMode("devices");
    expect(text()).toContain("Place all 1 by area");
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
    // Gone from the tray now it is on the map.
    expect(text()).toContain("Every device with an area is on the map.");
    el.undo();
    await el.session!.idle();
    expect(text()).toContain("Place all 1 by area");
  });

  it("sets the home style in Style, and lists the library's Home map tiles", async () => {
    const { el, ha, text } = await page();
    el.setMode("style");
    text();
    await settle();
    expect(text()).toContain("Used on 0 tiles");
    el.apply((d) => setHomeStyle(d, { look: "night", turn: 40 }));
    await el.session!.idle();
    expect(ha.now().doc!.style).toEqual({ look: "night", turn: 40 });
    const shown = text();
    expect(shown).toContain("A small model at night.");
    expect(shown).toContain("Drag to turn · 40°");
    expect(shown).toContain("Watch tile 2 × 2");
    expect(shown).toContain("iPhone full map");
  });

  it("picks a room with a press and shows its name, area, page, place, finish and things; a click on empty space clears it", async () => {
    const { inside, press, text } = await page();
    press([8, 2]);
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

  it("drags a room, snapping to its neighbour's wall with a guide, and saves once on the drop", async () => {
    const { el, ha, press, stage, pointer, text } = await page();
    // Press on the kitchen and drag it 12 cm right and 10 cm down, a step at
    // a time: its top wall snaps back in line with the living room's.
    el.onStageDown(pointer([8, 2]) as unknown as PointerEvent);
    stage.fire("pointermove", pointer([8.05, 2.05]));
    stage.fire("pointermove", pointer([8.12, 2.1]));
    expect(text()).toContain("Lined up with Living room wall");
    expect(ha.saves()).toHaveLength(0);
    stage.fire("pointerup", pointer([8.12, 2.1]));
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(1);
    expect(ha.saves()[0]!.base_rev).toBe(4);
    const kitchen = ha.now().doc!.floors[0]!.rooms[1]!;
    expect(kitchen.outline[0]).toEqual([6.12, 0]);
    // Alt moves it freely.
    press([8, 2], [[8.6, 2]], { altKey: true });
    await el.session!.idle();
    expect(ha.now().doc!.floors[0]!.rooms[1]!.outline[0]![0]).toBeCloseTo(6.7, 1);
    expect(ha.saves().map((s) => s.base_rev)).toEqual([4, 5]);
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
    el.setMode("devices");
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

  it("asks before deleting a room in its own dialog, not the browser's", async () => {
    const { el, inside, ha, press, key, text } = await page();
    vi.stubGlobal("window", { confirm: () => { throw new Error("no browser dialogs"); } });
    press([8, 2]);
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
    expect(text()).toContain("▸ Upstairs");
    (el as unknown as { floorMenu: boolean }).floorMenu = true;
    expect(text()).toContain("Add a floor");
    el.setFloor(upstairs.id);
    expect(text()).toContain("Plan of Upstairs");
    expect(text()).toContain(">Bedroom</text>");
  });

  it("picks a wall in Shape, puts a door in it with D and a click, and Escape drops a tool", async () => {
    const { el, inside, ha, press, key, text } = await page();
    el.setMode("shape");
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
