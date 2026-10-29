// The map editor's hover, as the complication editor's: the pointer resting
// on the flat plan names what a click there would pick (a pin, a light a
// lamp holds being its lamp, else a thing, else a room), found by the same
// finder the click uses, so the two never disagree; it clears when the
// pointer leaves, presses, drags, or while a tool other than Pick is out;
// it never changes the pick or saves; the plan marks it softly and never on
// what is picked; and the 3D view's hover reads a light a lamp holds as its
// lamp, as its click does.
//
// The element is made and driven directly, as `home-map-lamp-editor.test.ts`
// does, with Home Assistant stood in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { addLampLight } from "../src/home-map/edit-ops.js";
import type { HomeMapSelection } from "../src/home-map/editor-mode.js";
import { WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import type { HomeMapDocument } from "../src/home-map/model.js";
import { homeMapClickPick, homeMapHoverMark, homeMapLiveHover } from "../src/home-map/plan-pick.js";
import { forgetHomeMap, setHomeMapCapable } from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const LOCK = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const HELD = "7B1E0C2A-5D3F-4A8B-9C6D-000000000900";

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

const settle = () => new Promise((r) => setTimeout(r, 0));

function fakeHass(start: { doc: HomeMapDocument; rev: number }) {
  let stored = start;
  const sent: Record<string, any>[] = [];
  const hass = {
    states: {
      "light.reading_lamp": { entity_id: "light.reading_lamp", state: "on", attributes: { friendly_name: "Reading lamp", brightness: 200 } },
      "light.ceiling": { entity_id: "light.ceiling", state: "off", attributes: { friendly_name: "Ceiling light" } },
      "light.pendants": { entity_id: "light.pendants", state: "off", attributes: { friendly_name: "Pendants" } },
    },
    entities: {},
    areas: { living_room: { name: "Living room" }, kitchen: { name: "Kitchen" } },
    connection: {
      async sendMessagePromise(msg: Record<string, any>) {
        sent.push(msg);
        if (msg.type === "wrist_assistant/home_map/get") return structuredClone(stored);
        if (msg.type === "wrist_assistant/home_map/save") {
          stored = { doc: msg.doc as HomeMapDocument, rev: stored.rev + 1 };
          return { rev: stored.rev };
        }
        throw Object.assign(new Error("Unknown command."), { code: "unknown_command" });
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return { hass, saves: () => sent.filter((m) => m.type === "wrist_assistant/home_map/save") };
}

type Inside = { willUpdate(changed: Map<string, unknown>): void; selection?: HomeMapSelection };

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

async function page(doc: HomeMapDocument = fixture()) {
  const ha = fakeHass({ doc, rev: 4 });
  const el = new WaHomeMapEditor();
  el.hass = ha.hass;
  el.capable = true;
  const inside = el as unknown as Inside;
  inside.willUpdate(new Map());
  await settle();
  el.resizeStage(1000, 600);
  inside.willUpdate(new Map());
  const stage = stageStandIn();
  const pointer = (p: readonly number[], extra: Record<string, unknown> = {}) => {
    const [x, y] = el.context()!.toScreen(p);
    return { button: 0, buttons: 1, pointerId: 1, pointerType: "mouse", clientX: x, clientY: y, currentTarget: stage, target: null, preventDefault: () => undefined, ...extra };
  };
  /** The pointer resting over a plan point, no button down. */
  const rest = (p: readonly number[], extra: Record<string, unknown> = {}) => el.onStageMove(pointer(p, { buttons: 0, ...extra }) as unknown as PointerEvent);
  /** A click there: a press let go where it started. */
  const click = (p: readonly number[]) => {
    el.onStageDown(pointer(p) as unknown as PointerEvent);
    stage.fire("pointerup", pointer(p));
  };
  const hover = () => el.context()!.hover;
  return { el, inside, ha, stage, pointer, rest, click, hover };
}

/** The fixture with the reading lamp's light in a new floor lamp at 4.8, 2
 * (the living room's thing 3), its pin `HELD`. */
const withHeld = () => addLampLight(fixture(), FLOOR, LIVING, "light.reading_lamp", "floor", [4.8, 2], HELD)!.doc;

describe("the plan's hover", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
  });
  afterEach(() => {
    forgetHomeMap();
    vi.unstubAllGlobals();
  });

  it("names what a click at the same point picks: a pin, a lamp for its light, a thing, a room, or nothing", async () => {
    const { el, rest, click, hover } = await page(withHeld());
    const spots: [string, readonly number[], HomeMapSelection | undefined][] = [
      ["the side door's lock", [0.25, 2], { kind: "pin", pinId: LOCK }],
      ["the held light's pin, which is its lamp", [4.8, 2], { kind: "object", roomId: LIVING, object: 3 }],
      ["the pendants' pin over the kitchen table", [8.1, 2.5], { kind: "pin", pinId: PENDANTS }],
      ["the sofa", [2.7, 4.15], { kind: "object", roomId: LIVING, object: 0 }],
      ["the coffee table", [2.7, 2.65], { kind: "object", roomId: LIVING, object: 1 }],
      ["the kitchen table off the pin", [8.1, 3.2], { kind: "object", roomId: KITCHEN, object: 2 }],
      ["the living room's open floor", [4.5, 4], { kind: "room", roomId: LIVING }],
      ["outside every room", [12, 2], undefined],
    ];
    for (const [name, at, expected] of spots) {
      rest(at);
      const hovered = hover();
      expect(hovered, name).toEqual(expected);
      click(at);
      expect(el.context()!.selection, name).toEqual(hovered);
      // The hover sits on what is picked now; the plan draws no mark on it.
      rest(at);
      expect(homeMapLiveHover(hover(), el.context()!.selection), name).toBeUndefined();
    }
  });

  it("finds the same as the pure finder the page's presses use", async () => {
    const { el, rest, hover } = await page();
    const ctx = el.context()!;
    for (let x = -1; x <= 11; x += 0.37) {
      for (let y = -1; y <= 6; y += 0.41) {
        rest([x, y]);
        expect(hover(), `${x},${y}`).toEqual(homeMapClickPick(ctx.floor, ctx.toScreen, [x, y]));
      }
    }
  });

  it("clears when the pointer leaves, presses or drags, and never picks or saves", async () => {
    const { el, ha, rest, pointer, hover } = await page();
    rest([2.7, 4.15]);
    expect(hover()).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    el.onStageLeave();
    expect(hover()).toBeUndefined();

    rest([2.7, 4.15]);
    // A move with a button down is a drag or a pan.
    el.onStageMove(pointer([3, 4.15]) as unknown as PointerEvent);
    expect(hover()).toBeUndefined();

    rest([2.7, 4.15]);
    el.onStageDown(pointer([2.7, 4.15]) as unknown as PointerEvent);
    expect(hover()).toBeUndefined();

    // Resting never picked anything, nor saved.
    const fresh = await page();
    fresh.rest([2.7, 4.15]);
    fresh.rest([8.1, 2.5]);
    expect(fresh.el.context()!.selection).toBeUndefined();
    await fresh.el.session!.idle();
    expect(fresh.ha.saves()).toEqual([]);
    expect(ha.saves()).toEqual([]);
  });

  it("shows nothing for a finger, while Space pans, or while a tool other than Pick is out", async () => {
    const { el, rest, hover } = await page();
    rest([2.7, 4.15], { pointerType: "touch" });
    expect(hover()).toBeUndefined();

    el.onKey({ key: " ", preventDefault: () => undefined, composedPath: () => [el] } as unknown as KeyboardEvent);
    rest([2.7, 4.15]);
    expect(hover()).toBeUndefined();
    (el as unknown as { onKeyUp(e: KeyboardEvent): void }).onKeyUp({ key: " " } as KeyboardEvent);

    el.setToggle("measure", true);
    rest([2.7, 4.15]);
    expect(hover()).toBeUndefined();
    el.setToggle("measure", false);

    rest([2.7, 4.15]);
    expect(hover()).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    // A room's walls edited: the shape tools have the plan.
    el.editWalls(LIVING);
    rest([2.7, 4.15]);
    expect(hover()).toBeUndefined();
  });

  it("is dropped when what it names leaves the map", async () => {
    const { el, rest, hover } = await page();
    rest([2.7, 4.15]);
    expect(hover()).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    el.context()!.apply((d) => ({ ...d, floors: d.floors.map((f) => ({ ...f, rooms: f.rooms.map((r) => (r.id === LIVING ? { ...r, objects: [] } : r)) })) }));
    expect(hover()).toBeUndefined();
  });

  it("is set by a list row through the context, the same value drawing nothing new", async () => {
    const { el, hover } = await page();
    const tick = () => (el as unknown as { hover?: HomeMapSelection }).hover;
    el.context()!.setHover({ kind: "object", roomId: LIVING, object: 1 });
    const first = tick();
    expect(hover()).toEqual({ kind: "object", roomId: LIVING, object: 1 });
    el.context()!.setHover({ kind: "object", roomId: LIVING, object: 1 });
    // The same value again keeps the very same object: no new draw.
    expect(tick()).toBe(first);
    el.context()!.setHover(undefined);
    expect(hover()).toBeUndefined();
  });
});

describe("the plan's hover mark", () => {
  const floor = fixture().floors[0]!;
  const toScreen = (p: readonly number[]): [number, number] => [p[0]! * 100, p[1]! * 100];

  it("tints a room, a thing or a pin softly, lighter than the pick", () => {
    const room = flatten(homeMapHoverMark(floor, { kind: "room", roomId: LIVING }, undefined, toScreen));
    expect(room).toContain('class="hme-hover"');
    expect(room).toContain("points=0.0,0.0 600.0,0.0 600.0,500.0 0.0,500.0");
    expect(room).toContain("rgba(91,141,239,0.07)");
    const thing = flatten(homeMapHoverMark(floor, { kind: "object", roomId: LIVING, object: 0 }, undefined, toScreen));
    expect(thing).toContain("points=120.0,370.0 420.0,370.0 420.0,460.0 120.0,460.0");
    expect(thing).toContain("rgba(91,141,239,0.14)");
    const pin = flatten(homeMapHoverMark(floor, { kind: "pin", pinId: READING }, undefined, toScreen));
    expect(pin).toContain("cx=80.0 cy=310.0");
    // Never the pick's solid blue line.
    for (const text of [room, thing, pin]) expect(text).not.toContain("#5b8def");
  });

  it("draws nothing on what is picked, alone or among several", () => {
    const sofa: HomeMapSelection = { kind: "object", roomId: LIVING, object: 0 };
    expect(homeMapHoverMark(floor, sofa, sofa, toScreen)).toBe(homeMapHoverMark(floor, undefined, undefined, toScreen));
    const both: HomeMapSelection = { kind: "objects", items: [{ roomId: LIVING, object: 1 }, { roomId: LIVING, object: 0 }] };
    expect(homeMapLiveHover(sofa, both)).toBeUndefined();
    expect(homeMapLiveHover({ kind: "pin", pinId: READING }, { kind: "pins", pinIds: [PENDANTS, READING] })).toBeUndefined();
    expect(homeMapLiveHover({ kind: "room", roomId: LIVING }, { kind: "room", roomId: LIVING })).toBeUndefined();
    // A room's thing picked: the room itself still tints.
    expect(homeMapLiveHover({ kind: "room", roomId: LIVING }, sofa)).toEqual({ kind: "room", roomId: LIVING });
    // Gone from the map: nothing.
    expect(flatten(homeMapHoverMark(floor, { kind: "object", roomId: LIVING, object: 9 }, undefined, toScreen))).toBe("");
  });
});

describe("the 3D view's hover", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
  });
  afterEach(() => {
    forgetHomeMap();
    vi.unstubAllGlobals();
  });

  it("reads a light a lamp holds as its lamp, as its click does, and picks nothing", async () => {
    const { el, hover } = await page(withHeld());
    el.hover3d({ kind: "pin", pinId: HELD });
    expect(hover()).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    el.hover3d({ kind: "pin", pinId: PENDANTS });
    expect(hover()).toEqual({ kind: "pin", pinId: PENDANTS });
    el.hover3d({ kind: "room", roomId: KITCHEN });
    expect(hover()).toEqual({ kind: "room", roomId: KITCHEN });
    expect(el.context()!.selection).toBeUndefined();
    el.hover3d(undefined);
    expect(hover()).toBeUndefined();
    // While a room's walls are edited, none.
    el.editWalls(LIVING);
    el.hover3d({ kind: "room", roomId: KITCHEN });
    expect(hover()).toBeUndefined();
  });
});
