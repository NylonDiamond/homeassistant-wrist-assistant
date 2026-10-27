// The Home map page (app repo docs/home_map_plan_2026-10.md, "The panel",
// step 5): its address among the whole home's screens, listed only with the
// integration's `home_map`; the flat plan as every device draws it (walls cut
// for doors and openings, windows in blue, pins coloured by what their
// entity is doing); and the page's edits, each saved at once with the rev it
// was read at, put on top of a newer map after a conflict, and said so when
// that cannot be done.
//
// The element is made and driven directly, with Home Assistant stood in: its
// views are read as text, a press on the plan is a stand-in event, and every
// edit is a real save sent to the stand-in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { HOME_PLAN_COLORS, homePinGlowRadius, homePinPaint, homePlan, homePlanViewBox, homeWallPieces } from "../src/home-map/draw.js";
import { HOME_MAP_EMPTY_TEXT, HOME_MAP_UPDATE_TEXT, WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import { HOME_MAP_PATH, isHomeMapRoute, renderHomeMapView } from "../src/home-map/hook.js";
import { type HomeMapDocument, type HomeMapStates, applyHomeMapEdit } from "../src/home-map/model.js";
import { HOME_MAP_GONE_TEXT, HOME_MAP_MERGED_TEXT } from "../src/home-map/save.js";
import { forgetHomeMap, homeMapRead, setHomeMapCapable } from "../src/home-map/store.js";
import { NO_ICONS } from "../src/watch-pages/editor-host.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const SIDE_DOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
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

  it("hands the element the home's map capability and the panel's symbols", async () => {
    // The chunk is this module, already loaded by the import above.
    const view = renderHomeMapView({ hass: {} as HassLike, narrow: false, icons: NO_ICONS, iconsTick: 3, capable: true, onLoaded: () => undefined });
    expect(flatten(view)).toContain("<wa-home-map-editor");
    expect(view.values).toContain(true);
    expect(view.values).toContain(NO_ICONS);
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

// ── the page ─────────────────────────────────────────────────────────────

/** Home Assistant with the map stored at `rev`, the library's two pages,
 * two areas and a few states. `onSave` may refuse a save. */
function fakeHass(start: { doc: HomeMapDocument | null; rev: number }, onSave?: (doc: HomeMapDocument, baseRev: number) => void) {
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
          onSave?.(msg.doc as HomeMapDocument, msg.base_rev as number);
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
  read?: { doc: HomeMapDocument | null; rev: number };
  selected?: { kind: string; id: string };
  note?: { kind: string; text: string };
  moving?: unknown;
  willUpdate(changed: Map<string, unknown>): void;
  onPlanDown(e: unknown): void;
};

async function page(start: { doc: HomeMapDocument | null; rev: number } = { doc: fixture(), rev: 4 }, capable = true) {
  const ha = fakeHass(start);
  const el = new WaHomeMapEditor();
  el.hass = ha.hass;
  el.capable = capable;
  const inside = el as unknown as Inside;
  inside.willUpdate(new Map());
  await settle();
  return { el, inside, ha, text: () => flatten(el.render()) };
}

/** A stand-in for the plan's `<svg>` with the identity as its screen
 * matrix, so a client point is a plan point in meters. */
function planStandIn() {
  const listeners = new Map<string, (e: unknown) => void>();
  return {
    getScreenCTM: () => ({ inverse: () => ({}) }),
    setPointerCapture: () => undefined,
    releasePointerCapture: () => undefined,
    addEventListener: (type: string, fn: (e: unknown) => void) => listeners.set(type, fn),
    removeEventListener: (type: string) => listeners.delete(type),
    fire: (type: string, e: unknown) => listeners.get(type)?.(e),
  };
}

/** A press on the plan, landing on a pin or a room (or nothing). */
function press(svgEl: unknown, on: { pin?: string; room?: string }, x: number, y: number) {
  const hit = (attr: string, id: string | undefined) => (id === undefined ? null : { getAttribute: (a: string) => (a === attr ? id : null) });
  return {
    button: 0, pointerId: 1, clientX: x, clientY: y, currentTarget: svgEl,
    target: { closest: (sel: string) => (sel === "[data-pin]" ? hit("data-pin", on.pin) : hit("data-room", on.room)) },
    preventDefault: () => undefined,
  };
}

describe("the Home map page", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
    (globalThis as { DOMPoint?: unknown }).DOMPoint ??= class {
      constructor(readonly x: number, readonly y: number) {}
      matrixTransform() {
        return { x: this.x, y: this.y };
      }
    };
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

  it("draws the floor's plan live, with its names, its counts and a hint until something is picked", async () => {
    const { ha, text } = await page();
    expect(ha.sent.map((m) => m.type)).toEqual(["wrist_assistant/home_map/get", "wrist_assistant/library/summary"]);
    const shown = text();
    expect(shown).toContain("Plan of Ground floor");
    expect(shown).toContain(">Living room</text>");
    expect(shown).toContain("1 light on");
    expect(shown).toContain("2 rooms, 5 pins");
    expect(shown).toContain("Click a room to change it");
    expect(shown).toContain("Add a pin");
    // No floor tabs for a map of one floor.
    expect(shown).not.toContain('role="tablist"');
    // The read reaches the page editor's tiles.
    expect(homeMapRead(ha.hass, () => undefined)).toEqual({ doc: fixture(), rev: 4 });
  });

  it("picks a room with a press, and shows its name, area and page", async () => {
    const { inside, text } = await page();
    inside.onPlanDown(press(planStandIn(), { room: KITCHEN }, 8, 2));
    expect(inside.selected).toEqual({ kind: "room", id: KITCHEN });
    const shown = text();
    expect(shown).toContain("<h4>Kitchen</h4>");
    expect(shown).toContain(">Den</option>");
    expect(shown).toContain(">Evening</option>");
    expect(shown).toContain("Delete room");
    inside.onPlanDown(press(planStandIn(), {}, 20, 20));
    expect(inside.selected).toBeUndefined();
  });

  it("moves a dragged pin and saves it, made from the rev it read; a press that hardly moves picks it", async () => {
    const { inside, ha, text } = await page();
    const plan = planStandIn();
    inside.onPlanDown(press(plan, { pin: READING }, 1, 1));
    plan.fire("pointerup", { pointerId: 1, clientX: 1, clientY: 1 });
    expect(inside.selected).toEqual({ kind: "pin", id: READING });
    expect(ha.saves()).toHaveLength(0);
    expect(text()).toContain("<h4>Reading lamp</h4>");
    expect(text()).toContain("light.reading_lamp");

    inside.onPlanDown(press(plan, { pin: READING }, 1, 1));
    plan.fire("pointermove", { pointerId: 1, clientX: 8, clientY: 2 });
    const moving = inside.moving as { pinId: string; at: [number, number] };
    expect(moving.pinId).toBe(READING);
    expect(moving.at[0]).toBeCloseTo(7.8, 6);
    expect(moving.at[1]).toBeCloseTo(4.1, 6);
    plan.fire("pointerup", { pointerId: 1, clientX: 8, clientY: 2 });
    await settle();
    const [save] = ha.saves();
    expect(save!.base_rev).toBe(4);
    const pin = (save!.doc as HomeMapDocument).floors[0]!.pins[0]!;
    expect(pin).toEqual({ id: READING, entityId: "light.reading_lamp", roomId: KITCHEN, at: [7.8, 4.1, 1.5] });
    expect(inside.read?.rev).toBe(5);
    expect(inside.moving).toBeUndefined();
    expect(homeMapRead(ha.hass, () => undefined)?.rev).toBe(5);
  });

  it("adds a pin for an entity in the room picked, and removes one", async () => {
    const { el, inside, ha } = await page();
    inside.onPlanDown(press(planStandIn(), { room: KITCHEN }, 8, 2));
    expect(await el.addPin("switch.fan")).toBe(true);
    const added = ha.now().doc!.floors[0]!.pins.at(-1)!;
    expect(added).toMatchObject({ entityId: "switch.fan", roomId: KITCHEN, at: [8, 2.5, 1.2] });
    expect(added.id).toMatch(/^[0-9A-F-]{36}$/);
    expect(inside.selected).toEqual({ kind: "pin", id: added.id });
    expect(await el.removePin(SIDE_DOOR)).toBe(true);
    expect(ha.now().doc!.floors[0]!.pins.map((p) => p.entityId)).toEqual(["light.reading_lamp", "light.ceiling", "light.pendants", "climate.thermostat", "switch.fan"]);
    expect(ha.saves().map((s) => s.base_rev)).toEqual([4, 5]);
  });

  it("adds a pin without crypto.randomUUID, which plain http does not have", async () => {
    const { el, inside, ha } = await page();
    const real = Object.getOwnPropertyDescriptor(globalThis, "crypto")!;
    const secure = globalThis.crypto;
    const plain = { getRandomValues: (a: Uint8Array<ArrayBuffer>) => secure.getRandomValues(a) };
    Object.defineProperty(globalThis, "crypto", { value: plain, configurable: true });
    try {
      expect(await el.addPin("switch.fan")).toBe(true);
    } finally {
      Object.defineProperty(globalThis, "crypto", real);
    }
    const added = ha.now().doc!.floors[0]!.pins.at(-1)!;
    expect(added.entityId).toBe("switch.fan");
    expect(added.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
    expect(inside.selected).toEqual({ kind: "pin", id: added.id });
  });

  it("renames a room, sets its area and its page, and deletes it after asking", async () => {
    const { el, inside, ha } = await page();
    await el.renameRoom(KITCHEN, " Galley ");
    await el.setRoomArea(KITCHEN, "den");
    await el.setRoomPage(KITCHEN, PAGE_B);
    expect(ha.now().doc!.floors[0]!.rooms[1]).toMatchObject({ name: "Galley", areaId: "den", pageId: PAGE_B });
    await el.setRoomArea(KITCHEN, undefined);
    expect("areaId" in ha.now().doc!.floors[0]!.rooms[1]!).toBe(false);
    const asked: string[] = [];
    vi.stubGlobal("window", { confirm: (q: string) => { asked.push(q); return false; } });
    const doc = inside.read!.doc!;
    expect(await el.deleteRoom(doc.floors[0]!.rooms[1]!, doc.floors[0]!)).toBe(false);
    expect(asked[0]).toBe("Delete Galley from the map? Its 2 pins stay on the plan, in no room. Scan it again on the iPhone to bring it back.");
    vi.stubGlobal("window", { confirm: () => true });
    expect(await el.deleteRoom(doc.floors[0]!.rooms[1]!, doc.floors[0]!)).toBe(true);
    expect(ha.now().doc!.floors[0]!.rooms.map((r) => r.id)).toEqual([LIVING]);
    expect(ha.saves()).toHaveLength(5);
  });

  it("puts an edit on top of a map the iPhone saved meanwhile, and says so", async () => {
    const { el, inside, ha, text } = await page();
    ha.elsewhere((d) => applyHomeMapEdit(d, { kind: "renameRoom", roomId: LIVING, name: "Lounge" })!);
    expect(await el.renameRoom(KITCHEN, "Galley")).toBe(true);
    expect(ha.saves().map((s) => s.base_rev)).toEqual([4, 5]);
    expect(ha.now().doc!.floors[0]!.rooms.map((r) => r.name)).toEqual(["Lounge", "Galley"]);
    expect(inside.note).toEqual({ kind: "warn", text: HOME_MAP_MERGED_TEXT });
    expect(text()).toContain(HOME_MAP_MERGED_TEXT);
  });

  it("says so, and shows the map as saved elsewhere, when the edit no longer fits it", async () => {
    const { el, inside, ha } = await page();
    ha.elsewhere((d) => applyHomeMapEdit(d, { kind: "deleteRoom", roomId: KITCHEN })!);
    expect(await el.renameRoom(KITCHEN, "Galley")).toBe(false);
    expect(inside.note).toEqual({ kind: "err", text: HOME_MAP_GONE_TEXT });
    expect(inside.read?.rev).toBe(5);
    expect(inside.read?.doc?.floors[0]!.rooms).toHaveLength(1);
    expect(ha.saves()).toHaveLength(1);
  });

  it("shows a tab per floor and switches between them", async () => {
    const doc = fixture();
    const upstairs = { id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000002", name: "Upstairs", story: 1, rooms: [{ ...doc.floors[0]!.rooms[1]!, id: "7B1E0C2A-5D3F-4A8B-9C6D-000000000020", name: "Bedroom" }], pins: [] };
    const { el, text } = await page({ doc: { v: 1, floors: [...doc.floors, upstairs] }, rev: 2 });
    expect(text()).toContain('role="tablist"');
    expect(text()).toContain(">Upstairs</button>");
    expect(text()).toContain("Plan of Ground floor");
    (el as unknown as { floorId: string }).floorId = upstairs.id;
    expect(text()).toContain("Plan of Upstairs");
    expect(text()).toContain(">Bedroom</text>");
  });
});
