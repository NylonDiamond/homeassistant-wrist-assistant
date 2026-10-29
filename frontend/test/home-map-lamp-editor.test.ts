// Lamps hold lights, as the map editor's page edits them: a light's row in
// the rail always adding another and saying how many are on the map, a
// click there picking each in turn; the lamp chooser by the spot a light
// goes to (its last choice ringed and kept in the browser, or not when the
// browser keeps nothing, Enter taking it, the arrows ringing another, Escape
// or a press outside cancelling, only Just a bulb outside every room); a
// light dropped on a lamp that holds nothing going straight in, and a
// light's pin dragged onto one put in it, the lamp lit while it is over it;
// a press on a light a lamp holds picking the lamp, on the plan and in 3D,
// Cmd adding it; the lamp's inspector starting with its light (its entity
// changed by a search, its glow and tap, no height, Add another and
// Unlink), an empty lamp's search giving it one; and Delete taking both.
//
// The element is made and driven directly, as `home-map-page.test.ts`
// does, with Home Assistant stood in.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { HOME_MAP_DEVICE_DRAG_TYPE, HOME_MAP_LIGHT_DRAG_TYPE } from "../src/home-map/devices-model.js";
import { addLampLight, addPiece, homeMapHeldPin } from "../src/home-map/edit-ops.js";
import { homeMapLampPick } from "../src/home-map/editor-mode.js";
import { homeMapBulbSpot, homeMapLampPiece, homeMapPiece } from "../src/home-map/furniture.js";
import { WaHomeMapEditor } from "../src/home-map/home-map-editor.js";
import { HOME_MAP_LAMP_CHOICE_KEY, homeMapKeepLampChoice, homeMapLastLampChoice } from "../src/home-map/mode-devices.js";
import type { HomeMapDocument } from "../src/home-map/model.js";
import { forgetHomeMap, setHomeMapCapable } from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const FLOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000001";
const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const LOCK = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const HELD = "7B1E0C2A-5D3F-4A8B-9C6D-000000000900";

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
 * and that binds the event itself: the binding on the tag the marker is
 * in, else the last one before the marker, so two buttons side by side in
 * one template are told apart. */
function handler(root: unknown, marker: string, event: string): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      const bound: { at: number; fn: unknown }[] = [];
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) bound.push({ at: text.length, fn: v });
        text += flatten(v);
      });
      const where = text.indexOf(marker);
      if (where < 0) return { text, fn: undefined };
      const tagStart = text.lastIndexOf("<", where);
      const tagEnd = text.indexOf(">", tagStart);
      const own = bound.find((b) => tagStart >= 0 && b.at > tagStart && b.at <= tagEnd);
      return { text, fn: (own ?? bound.filter((b) => b.at <= where).at(-1))?.fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e?: unknown) => void;
}

const settle = () => new Promise((r) => setTimeout(r, 0));

/** Home Assistant with the map stored, four lights, a switch and a lock,
 * the pendants and the kitchen's lights in the kitchen's area. */
function fakeHass(start: { doc: HomeMapDocument; rev: number }) {
  let stored = start;
  const sent: Record<string, any>[] = [];
  const hass = {
    states: {
      "light.reading_lamp": { entity_id: "light.reading_lamp", state: "on", attributes: { friendly_name: "Reading lamp", brightness: 200 } },
      "light.ceiling": { entity_id: "light.ceiling", state: "off", attributes: { friendly_name: "Ceiling light" } },
      "light.pendants": { entity_id: "light.pendants", state: "off", attributes: { friendly_name: "Pendants" } },
      "light.kitchen_cans": { entity_id: "light.kitchen_cans", state: "off", attributes: { friendly_name: "Kitchen cans" } },
      "switch.fan": { entity_id: "switch.fan", state: "off", attributes: { friendly_name: "Fan" } },
    },
    entities: { "light.pendants": { area_id: "kitchen" }, "light.kitchen_cans": { area_id: "kitchen" }, "switch.fan": { area_id: "kitchen" } },
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
  return { hass, saves: () => sent.filter((m) => m.type === "wrist_assistant/home_map/save"), now: () => stored };
}

type Inside = {
  selection?: Record<string, unknown>;
  willUpdate(changed: Map<string, unknown>): void;
};

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
  const screen = (p: readonly number[]) => el.context()!.toScreen(p);
  const pointer = (p: readonly number[], extra: Record<string, unknown> = {}) => {
    const [x, y] = screen(p);
    return { button: 0, buttons: 1, pointerId: 1, pointerType: "mouse", clientX: x, clientY: y, currentTarget: stage, target: null, preventDefault: () => undefined, ...extra };
  };
  const press = (from: readonly number[], through: (readonly number[])[] = [], extra: Record<string, unknown> = {}) => {
    el.onStageDown(pointer(from, extra) as unknown as PointerEvent);
    for (const p of through) stage.fire("pointermove", pointer(p, extra));
    stage.fire("pointerup", pointer(through.at(-1) ?? from, extra));
  };
  const key = (k: string, extra: Record<string, unknown> = {}) => el.onKey({ key: k, preventDefault: () => undefined, composedPath: () => [el], ...extra } as unknown as KeyboardEvent);
  const event = { target: null, currentTarget: null, shiftKey: false, metaKey: false, ctrlKey: false, stopPropagation: () => undefined, preventDefault: () => undefined };
  const click = (marker: string) => handler(el.render(), marker, "@click=")(event);
  const type = (marker: string, value: string) => handler(el.render(), marker, "@input=")({ ...event, target: { value } });
  /** Something dragged from the rail over a plan point, then dropped. */
  const drag = (entityId: string, p: readonly number[]) => {
    const [x, y] = screen(p);
    const types = entityId.startsWith("light.") ? [HOME_MAP_DEVICE_DRAG_TYPE, HOME_MAP_LIGHT_DRAG_TYPE] : [HOME_MAP_DEVICE_DRAG_TYPE];
    const e = { clientX: x, clientY: y, currentTarget: stage, preventDefault: () => undefined, dataTransfer: { types, getData: (t: string) => (types.includes(t) ? entityId : "") } };
    el.onStageDrag(e as unknown as DragEvent);
    return { drop: () => el.onStageDrop(e as unknown as DragEvent) };
  };
  const floor = () => el.context()!.doc.floors[0]!;
  const room = (id: string) => floor().rooms.find((r) => r.id === id)!;
  const saved = async () => {
    await el.session!.idle();
    return ha.now().doc.floors[0]!;
  };
  return { el, inside, ha, stage, pointer, press, key, click, type, drag, floor, room, saved, text: () => flatten(el.render()) };
}

/** The choice the lamp chooser rings. */
const ringed = (text: string) => /class="hme-lampc-b on"[\s\S]*?<span>([^<]+)<\/span>/.exec(text)?.[1];

/** A stand-in for the browser's storage. */
function storage(start: Record<string, string> = {}) {
  const kept = new Map(Object.entries(start));
  return { kept, getItem: (k: string) => kept.get(k) ?? null, setItem: (k: string, v: string) => void kept.set(k, v) };
}

/** The fixture with a floor lamp holding nothing in the living room (its
 * thing 3), at 4.8, 2. */
const withLamp = () => addPiece(fixture(), LIVING, homeMapPiece("lampRoundFloor")!, [4.8, 2])!;
/** The fixture with the reading lamp's light in a new floor lamp at 4.8, 2
 * (the living room's thing 3), its pin `HELD`. */
const withHeld = () => addLampLight(fixture(), FLOOR, LIVING, "light.reading_lamp", "floor", [4.8, 2], HELD)!.doc;

describe("lamps that hold lights in the map editor", () => {
  beforeEach(() => {
    setHomeMapCapable(true);
    vi.stubGlobal("localStorage", storage());
  });
  afterEach(() => {
    forgetHomeMap();
    vi.unstubAllGlobals();
  });

  it("keeps the chooser's last choice in the browser, and keeps nothing where the browser will not", () => {
    expect(homeMapLastLampChoice()).toBeUndefined();
    homeMapKeepLampChoice("wall");
    expect(homeMapLastLampChoice()).toBe("wall");
    vi.stubGlobal("localStorage", storage({ [HOME_MAP_LAMP_CHOICE_KEY]: "chandelier" }));
    expect(homeMapLastLampChoice()).toBeUndefined();
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    vi.stubGlobal("localStorage", broken);
    expect(() => homeMapKeepLampChoice("table")).not.toThrow();
    expect(homeMapLastLampChoice()).toBeUndefined();
  });

  it("adds a light from its row through the lamp chooser every time, says how many are on the map and picks each in turn", async () => {
    const { el, inside, key, click, text, saved, room } = await page();
    el.page.query = "pend";
    let shown = text();
    // On the map already, and still offered: it can go in many lamps.
    expect(shown).toContain("Devices found");
    expect(shown).toContain(">1 on map</button>");
    // A click on the row opens the chooser by its area's room.
    click("Pendants<small>");
    shown = text();
    expect(shown).toContain('aria-label="Which lamp is it in?"');
    expect(shown).toContain("In Kitchen. Which lamp is it in?");
    for (const word of ["Ceiling", "Floor", "Table", "Wall", "Just a bulb"]) expect(shown).toContain(`<span>${word}</span>`);
    // Nothing kept yet: Ceiling is ringed, and Enter takes it.
    expect(ringed(shown)).toBe("Ceiling");
    key("Enter");
    expect(text()).not.toContain("Which lamp is it in?");
    const kitchen = room(KITCHEN);
    const lamp = kitchen.objects[3]!;
    expect(lamp.model).toBe("lampSquareCeiling");
    const held = homeMapHeldPin(el.context()!.doc.floors[0]!, KITCHEN, 3)!;
    expect(held.entityId).toBe("light.pendants");
    expect(held.at).toEqual(homeMapBulbSpot(lamp, homeMapLampPiece(lamp.model)!));
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 3 });
    expect(localStorage.getItem(HOME_MAP_LAMP_CHOICE_KEY)).toBe("ceiling");
    expect((await saved()).pins.filter((p) => p.entityId === "light.pendants")).toHaveLength(2);
    // Two on the map now; the count picks the next after the one picked,
    // the plain pin, then the lamp that holds the other.
    expect(text()).toContain(">2 on map</button>");
    click(">2 on map</button>");
    expect(inside.selection).toEqual({ kind: "pin", pinId: PENDANTS });
    click(">2 on map</button>");
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 3 });
    // Other devices are one to the map as before: on the map, a click picks it.
    el.page.query = "fan";
    click("Fan<small>");
    const fan = el.context()!.doc.floors[0]!.pins.at(-1)!;
    expect(fan.entityId).toBe("switch.fan");
    expect(text()).not.toContain("Which lamp is it in?");
    expect(inside.selection).toEqual({ kind: "pin", pinId: fan.id });
  });

  it("rings the last choice taken, moves the ring with the arrows, and cancels with Escape or a press outside, saving nothing", async () => {
    vi.stubGlobal("localStorage", storage({ [HOME_MAP_LAMP_CHOICE_KEY]: "table" }));
    const { el, ha, inside, key, click, press, text, room } = await page();
    el.page.query = "cans";
    click("Kitchen cans<small>");
    expect(ringed(text())).toBe("Table");
    key("ArrowRight");
    expect(ringed(text())).toBe("Wall");
    key("ArrowLeft");
    key("ArrowLeft");
    expect(ringed(text())).toBe("Floor");
    // Delete does nothing while it is open.
    key("Delete");
    key("Escape");
    expect(text()).not.toContain("Which lamp is it in?");
    // A press outside it closes it and does nothing more.
    click("Kitchen cans<small>");
    press([3, 3]);
    expect(text()).not.toContain("Which lamp is it in?");
    expect(inside.selection).toBeUndefined();
    await el.session!.idle();
    expect(ha.saves()).toHaveLength(0);
    expect(localStorage.getItem(HOME_MAP_LAMP_CHOICE_KEY)).toBe("table");
    // A click on a choice takes it, and it is kept for next time.
    click("Kitchen cans<small>");
    click("<span>Floor</span>");
    expect(room(KITCHEN).objects[3]!.model).toBe("lampRoundFloor");
    expect(localStorage.getItem(HOME_MAP_LAMP_CHOICE_KEY)).toBe("floor");
  });

  it("works without the browser's storage, starting from Ceiling", async () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } });
    const { el, key, click, text, room } = await page();
    el.page.query = "cans";
    click("Kitchen cans<small>");
    expect(ringed(text())).toBe("Ceiling");
    key("Enter");
    expect(room(KITCHEN).objects[3]!.model).toBe("lampSquareCeiling");
  });

  it("opens the chooser where a light is dropped, offering only a bulb outside every room", async () => {
    const { inside, key, drag, text, floor } = await page();
    drag("light.kitchen_cans", [2, 1.5]).drop();
    let shown = text();
    expect(shown).toContain("In Living room. Which lamp is it in?");
    key("Escape");
    drag("light.kitchen_cans", [-3, 2]).drop();
    shown = text();
    expect(shown).toContain("In no room, so just a bulb.");
    expect(ringed(shown)).toBe("Just a bulb");
    expect(shown.match(/hme-lampc-b " aria-pressed=false \?disabled=true\s+title=A lamp goes in a room/g)).toHaveLength(4);
    key("ArrowRight");
    expect(ringed(text())).toBe("Just a bulb");
    key("Enter");
    const pin = floor().pins.at(-1)!;
    expect(pin).toMatchObject({ entityId: "light.kitchen_cans", at: [-3, 2, 2.4] });
    expect("roomId" in pin).toBe(false);
    expect(inside.selection).toEqual({ kind: "pin", pinId: pin.id });
    // A switch dropped is placed as before, no chooser.
    drag("switch.fan", [8, 3]).drop();
    expect(text()).not.toContain("Which lamp is it in?");
    expect(floor().pins.at(-1)).toMatchObject({ entityId: "switch.fan", roomId: KITCHEN });
  });

  it("puts a light dropped on a lamp that holds nothing straight in it, the lamp lit while the light is over it", async () => {
    const { inside, drag, text, saved } = await page(withLamp());
    const over = drag("light.kitchen_cans", [4.8, 2]);
    expect(text()).toContain("Put it in this lamp");
    // A switch over the same lamp lights nothing up.
    drag("switch.fan", [4.8, 2]);
    expect(text()).not.toContain("Put it in this lamp");
    over.drop();
    expect(text()).not.toContain("Which lamp is it in?");
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    const floor = await saved();
    const held = homeMapHeldPin(floor, LIVING, 3)!;
    expect(held.entityId).toBe("light.kitchen_cans");
    const lamp = floor.rooms[0]!.objects[3]!;
    expect(held.at).toEqual(homeMapBulbSpot(lamp, homeMapLampPiece(lamp.model)!));
    // That lamp holds a light now: another light dropped there gets the chooser.
    drag("light.pendants", [4.8, 2]);
    expect(text()).not.toContain("Put it in this lamp");
  });

  it("puts a light's pin dragged onto a lamp that holds nothing in it, and only a light's", async () => {
    const { el, inside, stage, pointer, press, text, saved } = await page(withLamp());
    el.onStageDown(pointer([3.2, 1.8]) as unknown as PointerEvent);
    stage.fire("pointermove", pointer([4, 2]));
    expect(text()).not.toContain("Put it in this lamp");
    stage.fire("pointermove", pointer([4.8, 2.02]));
    expect(text()).toContain("Put it in this lamp");
    stage.fire("pointerup", pointer([4.8, 2.02]));
    expect(text()).not.toContain("Put it in this lamp");
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    let floor = await saved();
    expect(homeMapHeldPin(floor, LIVING, 3)?.id).toBe(CEILING);
    // The lock is no light: dragged over a lamp it just moves.
    el.apply((d) => addPiece(d, LIVING, homeMapPiece("lampRoundFloor")!, [4.8, 3.5]));
    press([0.25, 2], [[2, 3], [4.8, 3.5]]);
    floor = await saved();
    expect(homeMapHeldPin(floor, LIVING, 4)).toBeUndefined();
    expect(floor.pins.find((p) => p.id === LOCK)!.at).toEqual([4.8, 3.5, 1]);
  });

  it("picks the lamp for a press on the light it holds, drags the lamp with it, and adds it with Cmd, on the plan and in 3D", async () => {
    const { el, inside, press, room, saved } = await page(withHeld());
    const lamp = room(LIVING).objects[3]!;
    const bulb = homeMapBulbSpot(lamp, homeMapLampPiece(lamp.model)!)!;
    press(bulb);
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    // A drag from the light moves the lamp, the light kept at its bulb.
    press(bulb, [[bulb[0] + 0.25, bulb[1]], [bulb[0] + 0.5, bulb[1]]]);
    const floor = await saved();
    const moved = floor.rooms[0]!.objects[3]!;
    expect(moved.c[0]).toBeCloseTo(lamp.c[0] + 0.5, 5);
    expect(floor.pins.find((p) => p.id === HELD)!.at[0]).toBeCloseTo(bulb[0] + 0.5, 5);
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    // Cmd and a press on the light adds its lamp to the things picked.
    press([2.7, 4.15]);
    press([bulb[0] + 0.5, bulb[1]], [], { metaKey: true });
    expect(inside.selection).toEqual({ kind: "objects", items: [{ roomId: LIVING, object: 0 }, { roomId: LIVING, object: 3 }] });
    // In 3D: the light picks its lamp, Cmd takes it out again; a light no
    // lamp holds is still a pin.
    el.pick3d({ kind: "pin", pinId: HELD }, { add: true });
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 0 });
    el.pick3d({ kind: "pin", pinId: HELD });
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    el.pick3d({ kind: "object", roomId: LIVING, object: 3 });
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    el.pick3d({ kind: "pin", pinId: CEILING });
    expect(inside.selection).toEqual({ kind: "pin", pinId: CEILING });
    // Picked from a list by its pin, it is its lamp too.
    el.select({ kind: "pin", pinId: HELD });
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 3 });
    expect(homeMapLampPick(el.context()!.floor, { kind: "pin", pinId: READING })).toEqual({ kind: "pin", pinId: READING });
  });

  it("starts a lamp's inspector with its light: name, entity, glow and tap, no height, then the lamp's own cards", async () => {
    const { el, text } = await page(withHeld());
    el.select({ kind: "object", roomId: LIVING, object: 3 });
    const shown = text();
    expect(shown).toContain("light.reading_lamp");
    expect(shown).toContain("Reading lamp");
    expect(shown).toContain("Glow size");
    expect(shown).toContain("Tap on the map");
    expect(shown).toContain(">Add another</button>");
    expect(shown).toContain(">Unlink</button>");
    expect(shown).not.toContain("The model looks stand the pin at this height.");
    expect(shown.indexOf("Glow size")).toBeLessThan(shown.indexOf("Up off the floor"));
    expect(shown.indexOf("Tap on the map")).toBeLessThan(shown.indexOf("Up off the floor"));
    // A thing that is no lamp has no Light card.
    el.select({ kind: "object", roomId: LIVING, object: 0 });
    expect(text()).not.toContain("Glow size");
  });

  it("changes a lamp's light by a search of the home's lights, adds another lamp beside it, and unlinks it", async () => {
    const { el, inside, click, type, text, saved, room } = await page(withHeld());
    el.select({ kind: "object", roomId: LIVING, object: 3 });
    click("Show another of the home's lights");
    let shown = text();
    expect(shown).toContain('aria-label="Find a light"');
    // The light it holds now is left out of the list.
    expect(shown).not.toContain("Put Reading lamp in this lamp");
    expect(shown).toContain("Put Pendants in this lamp");
    type('aria-label="Find a light"', "cans");
    shown = text();
    expect(shown).toContain("Put Kitchen cans in this lamp");
    expect(shown).not.toContain("Put Pendants in this lamp");
    click("Put Kitchen cans in this lamp");
    let floor = await saved();
    expect(floor.pins.find((p) => p.id === HELD)!.entityId).toBe("light.kitchen_cans");
    expect(text()).not.toContain('aria-label="Find a light"');
    // The glow is the pin's, set as the pin inspector sets it.
    click("aria-label=Stay in room");
    floor = await saved();
    expect(floor.pins.find((p) => p.id === HELD)!.glowSpill).toBe(true);
    // Add another: the same lamp beside it, holding another pin of the light, picked.
    click(">Add another</button>");
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 4 });
    expect(room(LIVING).objects[4]!.model).toBe("lampRoundFloor");
    floor = await saved();
    const another = homeMapHeldPin(floor, LIVING, 4)!;
    expect(another.entityId).toBe("light.kitchen_cans");
    expect(another.id).not.toBe(HELD);
    // Unlink: both stay, the lamp holds nothing and says so.
    click(">Unlink</button>");
    floor = await saved();
    expect(homeMapHeldPin(floor, LIVING, 4)).toBeUndefined();
    expect(floor.pins.some((p) => p.id === another.id)).toBe(true);
    expect(floor.rooms[0]!.objects).toHaveLength(5);
    expect(inside.selection).toEqual({ kind: "object", roomId: LIVING, object: 4 });
    shown = text();
    expect(shown).toContain('<span class="hme-l">Light</span><span class="hme-in hme-ro dim">None</span>');
    expect(shown).toContain('aria-label="Find a light"');
  });

  it("gives a lamp that holds nothing its light from its search, the room's area's lights first", async () => {
    const { el, inside, click, text, saved } = await page(addPiece(fixture(), KITCHEN, homeMapPiece("lampRoundTable")!, [9, 4])!);
    el.select({ kind: "object", roomId: KITCHEN, object: 3 });
    const shown = text();
    expect(shown).toContain(">None</span>");
    // The kitchen's lights first, with nothing typed.
    expect(shown.indexOf("Put Kitchen cans in this lamp")).toBeLessThan(shown.indexOf("Put Ceiling light in this lamp"));
    expect(shown.indexOf("Put Pendants in this lamp")).toBeLessThan(shown.indexOf("Put Reading lamp in this lamp"));
    click("Put Pendants in this lamp");
    const floor = await saved();
    const held = homeMapHeldPin(floor, KITCHEN, 3)!;
    expect(held.entityId).toBe("light.pendants");
    expect(held.id).not.toBe(PENDANTS);
    expect(inside.selection).toEqual({ kind: "object", roomId: KITCHEN, object: 3 });
    expect(text()).toContain(">Unlink</button>");
  });

  it("deletes a picked lamp and its light together with Delete, one undo bringing both back", async () => {
    const { el, inside, key, press, room, saved } = await page(withHeld());
    const lamp = room(LIVING).objects[3]!;
    press(homeMapBulbSpot(lamp, homeMapLampPiece(lamp.model)!)!);
    key("Backspace");
    let floor = await saved();
    expect(floor.rooms[0]!.objects).toHaveLength(3);
    expect(floor.pins.some((p) => p.id === HELD)).toBe(false);
    expect(inside.selection).toEqual({ kind: "room", roomId: LIVING });
    el.undo();
    floor = await saved();
    expect(homeMapHeldPin(floor, LIVING, 3)?.id).toBe(HELD);
    // Several picked, a lamp among them: Delete asks, then takes the light too.
    el.select({ kind: "objects", items: [{ roomId: LIVING, object: 0 }, { roomId: LIVING, object: 3 }] });
    key("Delete");
    (inside as unknown as { dialog: { done: (v: unknown) => void } }).dialog.done(true);
    await settle();
    floor = await saved();
    expect(floor.rooms[0]!.objects).toHaveLength(2);
    expect(floor.pins.some((p) => p.id === HELD)).toBe(false);
  });
});
