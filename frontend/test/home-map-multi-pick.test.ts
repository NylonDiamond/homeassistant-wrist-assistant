// A light's pool staying in its room (`glowSpill`) and picking several
// devices at once on the map editor's edit page: the key checked as the
// store checks it (true kept, false dropped, in the contract's order), set
// and taken away by the pin edits, and drawn on the page's flat plan, the
// tile's plan look and the model looks (the room's walls stopping the pool
// unless it spills, a light in no room never stopped); then the pick (a
// click, Shift adding or taking away, a box), the values the picked pins
// share or not, the group's Turn on or off, the page's devices part with a
// stand-in shell (Shift clicks, a box, dragging and nudging them all, Delete
// after the page's own yes, the pill and the inspector with Mixed and Stay
// in room, the glow ring faint past the walls), and the group edits (move,
// set fields, remove), each one edit.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  homeMapAddPicks,
  homeMapGroupToggle,
  homeMapPickOf,
  homeMapPickedPins,
  homeMapPinsInBox,
  homeMapShared,
  homeMapTogglePick,
} from "../src/home-map/devices-model.js";
import { nothing } from "lit";
import { homePlan } from "../src/home-map/draw.js";
import {
  type HomeMapOp,
  addPiece,
  moveObjects,
  movePins,
  removeObjects,
  removePins,
  setObjectsHidden,
  setObjectsPart,
  setPinFields,
  setPinsFields,
} from "../src/home-map/edit-ops.js";
import {
  type HomeMapApplyOptions,
  type HomeMapDragHandlers,
  type HomeMapEditorContext,
  type HomeMapSelection,
  homeMapPickedThings,
  homeMapSelectionRoom,
  homeMapSelectionThere,
  homeMapThingPicked,
  homeMapThingsPickOf,
  homeMapToggleThing,
} from "../src/home-map/editor-mode.js";
import { hmeColourInput } from "../src/home-map/editor-parts.js";
import { homeMapPiece } from "../src/home-map/furniture.js";
import { ArrangeMode } from "../src/home-map/mode-arrange.js";
import { DevicesMode } from "../src/home-map/mode-devices.js";
import { type HomeMapDocument, type HomeMapStates, type HomePoint, checkHomeMap, orderedPin } from "../src/home-map/model.js";
import { homeTileArt } from "../src/home-map/tile-art.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const CEILING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000101";
const LOCK = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const PENDANTS = "7B1E0C2A-5D3F-4A8B-9C6D-000000000103";
const THERMOSTAT = "7B1E0C2A-5D3F-4A8B-9C6D-000000000104";
const PAGE = "5F0C1D2E-3A4B-4C5D-8E6F-7A8B9C0D1E2F";

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

const S = (state: string, attributes: Record<string, unknown> = {}) => ({ state, attributes });
const pinOf = (doc: HomeMapDocument, id: string) => doc.floors[0]!.pins.find((p) => p.id === id)!;

// ── glowSpill ────────────────────────────────────────────────────────────

describe("a pin's glowSpill", () => {
  it("is checked as the store checks it: true kept in the contract's order, false dropped, anything else refused", () => {
    const doc = fixture();
    const pin = doc.floors[0]!.pins[0]! as unknown as Record<string, unknown>;
    Object.assign(pin, { tap: "page", pageId: PAGE, glowSpill: true, glowColor: "warm", glow: 1.5 });
    const checked = checkHomeMap(doc);
    expect(checked.ok).toBe(true);
    if (!checked.ok) return;
    expect(Object.keys(checked.doc.floors[0]!.pins[0]!)).toEqual(["id", "entityId", "roomId", "at", "glow", "glowColor", "glowSpill", "tap", "pageId"]);
    expect(checked.doc.floors[0]!.pins[0]!.glowSpill).toBe(true);

    pin.glowSpill = false;
    const dropped = checkHomeMap(doc);
    expect(dropped.ok && "glowSpill" in dropped.doc.floors[0]!.pins[0]!).toBe(false);

    pin.glowSpill = "yes";
    expect(checkHomeMap(doc)).toEqual({ ok: false, code: "invalid", message: "doc.floors[0].pins[0].glowSpill must be true or false" });
    delete pin.glowSpill;
    pin.glowSpell = true;
    expect(checkHomeMap(doc)).toEqual({ ok: false, code: "invalid", message: "doc.floors[0].pins[0].glowSpell is not a key the home map has" });
  });

  it("keeps its place in a pin written out, and only ever as true", () => {
    const pin = orderedPin({ pageId: PAGE, tap: "page", glowSpill: true, glowColor: "warm", at: [1, 2, 3], entityId: "light.a", id: READING });
    expect(Object.keys(pin)).toEqual(["id", "entityId", "at", "glowColor", "glowSpill", "tap", "pageId"]);
    expect("glowSpill" in orderedPin({ id: READING, entityId: "light.a", at: [1, 2, 3], glowSpill: false as unknown as true })).toBe(false);
  });

  it("is set by true and taken away by false or null", () => {
    const on = setPinFields(fixture(), READING, { glowSpill: true })!;
    expect(pinOf(on, READING).glowSpill).toBe(true);
    expect(Object.keys(pinOf(on, READING))).toEqual(["id", "entityId", "roomId", "at", "glowSpill"]);
    expect("glowSpill" in pinOf(setPinFields(on, READING, { glowSpill: false })!, READING)).toBe(false);
    expect("glowSpill" in pinOf(setPinFields(on, READING, { glowSpill: null })!, READING)).toBe(false);
    // Other edits keep it.
    expect(pinOf(setPinFields(on, READING, { glow: 2 })!, READING).glowSpill).toBe(true);
  });
});

describe("a pool of light and its room's walls", () => {
  const states: HomeMapStates = { "light.reading_lamp": S("on", { brightness: 255 }) };
  const spilt = () => {
    const doc = fixture();
    doc.floors[0]!.pins[0] = { ...doc.floors[0]!.pins[0]!, glowSpill: true };
    return doc;
  };
  /** The reading lamp standing in no room: west of the living room. */
  const roomless = () => {
    const doc = fixture();
    const { roomId: _r, ...rest } = doc.floors[0]!.pins[0]!;
    doc.floors[0]!.pins[0] = { ...rest, at: [-2, 3, 1.5] };
    return doc;
  };

  it("stays inside its room on the page's flat plan unless it spills, and a light in no room is never stopped", () => {
    const kept = flatten(homePlan(fixture().floors[0]!, { states }));
    expect(kept).toContain(`<clipPath id=wa-hm-pool-7B1E0C2A-5D3F-4A8B-9C6D-000000000010><polygon points=0,0 6,0 6,5 0,5 /></clipPath>`);
    expect(kept).toMatch(/<g clip-path=url\(#wa-hm-pool-7B1E0C2A-5D3F-4A8B-9C6D-000000000010\)><circle class="hm-glow"/);
    const free = flatten(homePlan(spilt().floors[0]!, { states }));
    expect(free).not.toContain("wa-hm-pool-");
    expect(free).toContain(`class="hm-glow"`);
    const loose = flatten(homePlan(roomless().floors[0]!, { states }));
    expect(loose).not.toContain("wa-hm-pool-");
    expect(loose).toContain(`class="hm-glow"`);
    // Dragged into the kitchen, it is stopped by the kitchen's walls.
    const dragged = flatten(homePlan(fixture().floors[0]!, { states, moving: { pinId: READING, at: [9, 4] } }));
    expect(dragged).toContain("wa-hm-pool-7B1E0C2A-5D3F-4A8B-9C6D-000000000011");
  });

  it("stays inside its room in the tile's plan look unless it spills", () => {
    const art = (doc: HomeMapDocument) => flatten(homeTileArt({ floor: doc.floors[0]!, states, look: "plan", width: 1000, height: 500, frame: { scale: 100, ox: 0, oy: 0 } }));
    expect(art(fixture())).toMatch(/<g clip-path=url\(#wa-hmt-c-[a-z0-9]+\)><circle class="hmt-pool"/);
    const free = art(spilt());
    expect(free).toContain(`<circle class="hmt-pool"`);
    expect(free).not.toMatch(/<g clip-path=url\(#wa-hmt-c-[a-z0-9]+\)><circle class="hmt-pool"/);
    expect(art(roomless())).not.toMatch(/<g clip-path=url\(#wa-hmt-c-[a-z0-9]+\)><circle class="hmt-pool"/);
  });

  it("stays inside its room in the model looks unless it spills, and a light in no room spreads freely there too", () => {
    // Clay and blueprint draw no pools on the floor.
    for (const look of ["night", "warm", "lines"] as const) {
      const art = (doc: HomeMapDocument) => flatten(homeTileArt({ floor: doc.floors[0]!, states, look, width: 600, height: 400 }));
      expect(art(fixture()), look).toMatch(/class="hmt-pool" clip-path=url\(#wa-hmt-c-/);
      const free = art(spilt());
      expect(free, look).toContain(`class="hmt-pool" clip-path= `);
      expect(free, look).not.toMatch(/class="hmt-pool" clip-path=url/);
      // Before, a light in no room drew no pool at all in these looks.
      expect(art(roomless()), look).toContain(`class="hmt-pool" clip-path= `);
    }
  });
});

// ── picking several devices ──────────────────────────────────────────────

describe("picking several devices", () => {
  it("adds a pin to the pick or takes it out with Shift, one pin being `pin` and more `pins`", () => {
    let sel = homeMapTogglePick(undefined, READING);
    expect(sel).toEqual({ kind: "pin", pinId: READING });
    sel = homeMapTogglePick(sel, CEILING);
    expect(sel).toEqual({ kind: "pins", pinIds: [READING, CEILING] });
    sel = homeMapTogglePick(sel, LOCK);
    expect(homeMapPickedPins(sel)).toEqual([READING, CEILING, LOCK]);
    // Taken out again, whatever its case.
    sel = homeMapTogglePick(sel, CEILING.toLowerCase());
    expect(sel).toEqual({ kind: "pins", pinIds: [READING, LOCK] });
    sel = homeMapTogglePick(sel, READING);
    expect(sel).toEqual({ kind: "pin", pinId: LOCK });
    expect(homeMapTogglePick(sel, LOCK)).toBeUndefined();
    // A room picked gives way to the pin alone.
    expect(homeMapTogglePick({ kind: "room", roomId: "x" }, PENDANTS)).toEqual({ kind: "pin", pinId: PENDANTS });
    expect(homeMapPickOf([READING, READING])).toEqual({ kind: "pin", pinId: READING });
    expect(homeMapPickOf([])).toBeUndefined();
  });

  it("picks every pin inside a box dragged either way, added to the pick", () => {
    const pins = fixture().floors[0]!.pins;
    // The living room's west half: the reading lamp and the lock.
    expect(homeMapPinsInBox(pins, [0, 0], [1, 5])).toEqual([READING, LOCK]);
    expect(homeMapPinsInBox(pins, [1, 5], [0, 0])).toEqual([READING, LOCK]);
    expect(homeMapPinsInBox(pins, [20, 20], [30, 30])).toEqual([]);
    const sel = homeMapAddPicks({ kind: "pin", pinId: PENDANTS }, homeMapPinsInBox(pins, [0, 0], [1, 5]));
    expect(sel).toEqual({ kind: "pins", pinIds: [PENDANTS, READING, LOCK] });
    // Already picked ones are not picked twice.
    expect(homeMapAddPicks(sel, [READING])).toEqual(sel);
  });

  it("is still there while every picked pin is, and is in no room", () => {
    const floor = fixture().floors[0]!;
    expect(homeMapSelectionThere(floor, { kind: "pins", pinIds: [READING, LOCK] })).toBe(true);
    expect(homeMapSelectionThere(floor, { kind: "pins", pinIds: [READING, "7B1E0C2A-5D3F-4A8B-9C6D-000000000999"] })).toBe(false);
    expect(homeMapSelectionRoom({ kind: "pins", pinIds: [READING, LOCK] })).toBeUndefined();
  });

  it("shows a shared value, or mixed where the picked pins differ", () => {
    expect(homeMapShared([1.5, 1.5])).toEqual({ mixed: false, value: 1.5 });
    expect(homeMapShared([1.5, 2.4])).toEqual({ mixed: true });
    expect(homeMapShared([undefined, undefined])).toEqual({ mixed: false, value: undefined });
    expect(homeMapShared(["name", undefined])).toEqual({ mixed: true });
    expect(homeMapShared([["page", "a"], ["page", "a"]])).toEqual({ mixed: false, value: ["page", "a"] });
    expect(homeMapShared([])).toEqual({ mixed: true });
  });

  it("turns them on or off together only when every one can be", () => {
    const states: HomeMapStates = { "light.a": S("off"), "light.b": S("on"), "switch.c": S("off"), "cover.d": S("open"), "cover.e": S("closed") };
    expect(homeMapGroupToggle(["light.a", "light.b"], states)).toEqual({ words: "Turn off", service: "turn_off" });
    expect(homeMapGroupToggle(["light.a", "switch.c"], states)).toEqual({ words: "Turn on", service: "turn_on" });
    expect(homeMapGroupToggle(["cover.d", "cover.e"], states)).toEqual({ words: "Close", service: "turn_off" });
    expect(homeMapGroupToggle(["cover.e"], states)).toEqual({ words: "Open", service: "turn_on" });
    expect(homeMapGroupToggle(["light.a", "lock.x"], states)).toBeUndefined();
    expect(homeMapGroupToggle([], states)).toBeUndefined();
  });
});

// ── the devices part with several picked ─────────────────────────────────

/** A stand-in for the shell: 100 pixels a meter, the edits made on its own
 * map, and a record of what the part asked for. */
function shell(selection?: HomeMapSelection, states?: HomeMapStates, start: HomeMapDocument = fixture()) {
  let doc = start;
  let preview: HomeMapOp | undefined;
  let drag: HomeMapDragHandlers | undefined;
  const log = { applied: 0, previews: 0, confirms: [] as string[], selects: [] as (HomeMapSelection | undefined)[], answer: true };
  const ctx = {
    hass: states === undefined ? undefined : { states },
    icons: undefined,
    get doc() { return doc; },
    get floor() { return (preview?.(doc) ?? doc).floors[0]!; },
    selection,
    walls: undefined,
    view: { scale: 100, ox: 0, oy: 0 },
    stage: { width: 1200, height: 800 },
    toggles: { snap: true, square: true, grid: false, measure: false, live: true },
    pages: [],
    areas: [],
    canUndo: false,
    canRedo: false,
    toScreen: (p: readonly number[]): HomePoint => [p[0]! * 100, p[1]! * 100],
    px: (m: number) => m * 100,
    toPlan: (x: number, y: number): HomePoint => [x / 100, y / 100],
    apply(op: HomeMapOp, options?: HomeMapApplyOptions) {
      const next = op(doc);
      if (next === undefined) return false;
      doc = next;
      log.applied += 1;
      if (options?.select !== undefined) ctx.select(options.select ?? undefined);
      return true;
    },
    preview(op: HomeMapOp | undefined) {
      preview = op;
      if (op !== undefined) log.previews += 1;
    },
    select(sel: HomeMapSelection | undefined) {
      ctx.selection = sel;
      log.selects.push(sel);
    },
    drag(_e: PointerEvent, handlers: HomeMapDragHandlers) {
      drag = handlers;
    },
    confirm: async (o: { title: string }) => {
      log.confirms.push(o.title);
      return log.answer;
    },
    note: () => {},
    redraw: () => {},
    newId: () => "7B1E0C2A-5D3F-4A8B-9C6D-000000000777",
  };
  const press = (o: Partial<PointerEvent> = {}) => ({ button: 0, shiftKey: false, metaKey: false, ctrlKey: false, ...o }) as PointerEvent;
  return { ctx: ctx as unknown as HomeMapEditorContext & { selection: HomeMapSelection | undefined }, log, press, handlers: () => drag, get doc() { return doc; } };
}

describe("the devices part with several picked", () => {
  it("adds a pin with Shift, Cmd or Ctrl and a click, never moving it", () => {
    const s = shell({ kind: "pin", pinId: READING });
    const mode = new DevicesMode();
    expect(mode.pointerDown(s.ctx, s.press({ shiftKey: true }), [3.2, 1.8])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "pins", pinIds: [READING, CEILING] });
    expect(mode.pointerDown(s.ctx, s.press({ metaKey: true }), [8.1, 2.5])).toBe(true);
    expect(mode.pointerDown(s.ctx, s.press({ ctrlKey: true }), [0.8, 3.1])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "pins", pinIds: [CEILING, PENDANTS] });
    expect(s.handlers()).toBeUndefined();
  });

  it("moves every picked pin by dragging one, previewed live and saved once", () => {
    const s = shell({ kind: "pins", pinIds: [READING, LOCK] });
    const mode = new DevicesMode();
    expect(mode.pointerDown(s.ctx, s.press(), [0.8, 3.1])).toBe(true);
    s.handlers()!.move([1.3, 3.1], s.press());
    expect(s.log.previews).toBe(1);
    // The pill and the inspector stay out of the way while it moves.
    expect(mode.pill(s.ctx)).toBe(nothing);
    s.handlers()!.move([1.8, 3.6], s.press());
    s.handlers()!.end([1.8, 3.6], s.press(), true);
    expect(s.log.applied).toBe(1);
    expect(pinOf(s.doc, READING).at).toEqual([1.8, 3.6, 1.5]);
    expect(pinOf(s.doc, LOCK).at).toEqual([1.25, 2.5, 1]);
    expect(s.ctx.selection).toEqual({ kind: "pins", pinIds: [READING, LOCK] });
  });

  it("picks the pressed one alone on a click with no move", () => {
    const s = shell({ kind: "pins", pinIds: [READING, LOCK] });
    const mode = new DevicesMode();
    mode.pointerDown(s.ctx, s.press(), [0.25, 2]);
    s.handlers()!.end([0.25, 2], s.press(), false);
    expect(s.log.applied).toBe(0);
    expect(s.ctx.selection).toEqual({ kind: "pin", pinId: LOCK });
  });

  it("picks the pins in a box dragged with Shift over empty space, and leaves a plain drag there to pan", () => {
    const s = shell({ kind: "pin", pinId: PENDANTS });
    const mode = new DevicesMode();
    expect(mode.pointerDown(s.ctx, s.press(), [4, 4])).toBe(false);
    expect(mode.pointerDown(s.ctx, s.press({ shiftKey: true }), [0, 0])).toBe(true);
    s.handlers()!.move([1, 4], s.press());
    expect(flatten(mode.overlay(s.ctx))).toContain(`class="hme-box"`);
    s.handlers()!.end([1, 5], s.press(), true);
    expect(s.ctx.selection).toEqual({ kind: "pins", pinIds: [PENDANTS, READING, LOCK] });
    expect(flatten(mode.overlay(s.ctx))).not.toContain(`class="hme-box"`);
  });

  it("rings every picked pin", () => {
    const s = shell({ kind: "pins", pinIds: [READING, LOCK, THERMOSTAT] });
    const art = flatten(new DevicesMode().overlay(s.ctx));
    expect(art.split(`stroke="#5b8def" stroke-width="2.5"`).length - 1).toBe(3);
  });

  it("nudges them all with an arrow key, one edit", () => {
    const s = shell({ kind: "pins", pinIds: [READING, CEILING] });
    expect(new DevicesMode().keyDown(s.ctx, { key: "ArrowRight", shiftKey: true } as KeyboardEvent)).toBe(true);
    expect(s.log.applied).toBe(1);
    expect(pinOf(s.doc, READING).at[0]).toBe(0.9);
    expect(pinOf(s.doc, CEILING).at[0]).toBe(3.3);
  });

  it("removes several only after the page's own yes, one alone at once", async () => {
    const s = shell({ kind: "pins", pinIds: [READING, CEILING] });
    const mode = new DevicesMode();
    s.log.answer = false;
    expect(mode.keyDown(s.ctx, { key: "Backspace" } as KeyboardEvent)).toBe(true);
    await Promise.resolve();
    expect(s.log.confirms).toEqual(["Remove 2 devices from the map?"]);
    expect(s.log.applied).toBe(0);
    s.log.answer = true;
    mode.keyDown(s.ctx, { key: "Delete" } as KeyboardEvent);
    await Promise.resolve();
    expect(s.log.applied).toBe(1);
    expect(s.doc.floors[0]!.pins.map((p) => p.id)).toEqual([LOCK, PENDANTS, THERMOSTAT]);
    expect(s.ctx.selection).toBeUndefined();
    const one = shell({ kind: "pin", pinId: LOCK });
    mode.keyDown(one.ctx, { key: "Delete" } as KeyboardEvent);
    await Promise.resolve();
    expect(one.log.confirms).toEqual([]);
    expect(one.doc.floors[0]!.pins.some((p) => p.id === LOCK)).toBe(false);
  });

  it("shows how many in the pill, Same height and Remove", () => {
    const s = shell({ kind: "pins", pinIds: [READING, CEILING] });
    const pill = flatten(new DevicesMode().pill(s.ctx));
    expect(pill).toContain("2 devices");
    expect(pill).toContain(">Same height</button>");
    expect(pill).toContain(">Remove</button>");
  });

  it("lists them in the inspector and sets a shared field on all of them as one edit, Mixed where they differ", () => {
    const s = shell({ kind: "pins", pinIds: [READING, CEILING] });
    const mode = new DevicesMode();
    const text = flatten(mode.inspector(s.ctx));
    expect(text).toContain("<strong>2 devices</strong>");
    // Two lights at 1.5 m and 2.4 m: the height is mixed, and so is the
    // slider's knob; every light card field is there, Stay in room on.
    expect(text).toContain("hme-range mixed");
    expect(text).toContain("Mixed");
    expect(text).toContain(">Glow size<");
    expect(text).toContain(">Stay in room<");
    expect(text).toContain("walls stop the glow");
    expect(text).not.toContain(">Icon<");
    s.ctx.apply((d) => setPinsFields(d, [READING, CEILING], { glowSpill: true }));
    expect(flatten(mode.inspector(s.ctx))).toContain("the glow spreads past the walls");
    // With the lock picked too, the light card goes.
    const mixed = shell({ kind: "pins", pinIds: [READING, LOCK] });
    expect(flatten(mode.inspector(mixed.ctx))).not.toContain(">Glow size<");
  });

  it("shows Stay in room for one light, the ring on the stage faint past its room's walls unless it spills", () => {
    const s = shell({ kind: "pin", pinId: READING }, { "light.reading_lamp": S("on", { brightness: 255 }) });
    const mode = new DevicesMode();
    expect(flatten(mode.inspector(s.ctx))).toContain(">Stay in room<");
    expect(flatten(mode.overlay(s.ctx))).toContain(`<clipPath id="hme-glow-walls">`);
    s.ctx.apply((d) => setPinFields(d, READING, { glowSpill: true }));
    expect(flatten(mode.overlay(s.ctx))).not.toContain("hme-glow-walls");
  });
});

describe("editing several pins as one edit", () => {
  it("moves them all by one step, each into the room it lands in, its height kept", () => {
    const doc = fixture();
    const moved = movePins(doc, [READING, LOCK, PENDANTS], 3.5, 0.5)!;
    expect(pinOf(moved, READING).at).toEqual([4.3, 3.6, 1.5]);
    expect(pinOf(moved, LOCK).at).toEqual([3.75, 2.5, 1]);
    // The pendants cross into no room east of the kitchen.
    expect(pinOf(moved, PENDANTS).at).toEqual([11.6, 3, 2.1]);
    expect(pinOf(moved, PENDANTS).roomId).toBeUndefined();
    // The others stay put, and the map it was given is unchanged.
    expect(pinOf(moved, CEILING)).toEqual(pinOf(doc, CEILING));
    expect(doc).toEqual(fixture());
    // A pin the map lost is passed over; none left is no edit.
    expect(pinOf(movePins(doc, [READING, "7B1E0C2A-5D3F-4A8B-9C6D-000000000999"], 1, 0)!, READING).at).toEqual([1.8, 3.1, 1.5]);
    expect(movePins(doc, ["7B1E0C2A-5D3F-4A8B-9C6D-000000000999"], 1, 0)).toBeUndefined();
    expect(movePins(doc, [READING], Number.NaN, 0)).toBeUndefined();
  });

  it("sets the same fields on every picked pin, or none when one would refuse", () => {
    const doc = fixture();
    const lit = setPinsFields(doc, [READING, CEILING], { glow: 1.25, glowColor: "#7FC0FF", glowSpill: true, reading: "name", tap: "page", pageId: PAGE })!;
    for (const id of [READING, CEILING]) {
      expect(pinOf(lit, id)).toMatchObject({ glow: 1.25, glowColor: "#7fc0ff", glowSpill: true, reading: "name", tap: "page", pageId: PAGE });
    }
    expect(pinOf(lit, PENDANTS)).toEqual(pinOf(doc, PENDANTS));
    const back = setPinsFields(lit, [READING, CEILING], { glowSpill: null, tap: "toggle" })!;
    expect("glowSpill" in pinOf(back, READING)).toBe(false);
    expect(pinOf(back, CEILING).pageId).toBeUndefined();
    // A page tap with no page on one of them refuses the whole edit.
    const half = setPinFields(doc, READING, { tap: "page", pageId: PAGE })!;
    expect(setPinsFields(half, [READING, THERMOSTAT], { tap: "page" })).toBeUndefined();
    // A name is one pin's own, never set on several.
    expect(pinOf(setPinsFields(doc, [READING, CEILING], { name: "Same", reading: "none" } as never)!, READING).name).toBeUndefined();
  });

  it("removes them all", () => {
    const left = removePins(fixture(), [READING, PENDANTS, READING])!;
    expect(left.floors[0]!.pins.map((p) => p.id)).toEqual([CEILING, LOCK, THERMOSTAT]);
    expect(removePins(fixture(), [])).toBeUndefined();
  });
});

// ── several things picked ────────────────────────────────────────────────

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";

/** The fixture with two floor lamps in the living room (its things 3 and
 * 4), as Add furniture puts them there. */
function lamps(): HomeMapDocument {
  const lamp = homeMapPiece("lampRoundFloor")!;
  const one = addPiece(fixture(), LIVING, lamp, [1, 1])!;
  return addPiece(one, LIVING, lamp, [5, 1])!;
}
const LAMP_A = { roomId: LIVING, object: 3 };
const LAMP_B = { roomId: LIVING, object: 4 };
/** The kitchen's table, drawn as the plain wooden table: wood, no fabric. */
const TABLE = { roomId: KITCHEN, object: 2 };
const thingOf = (doc: HomeMapDocument, t: { roomId: string; object: number }) => doc.floors[0]!.rooms.find((r) => r.id === t.roomId)!.objects[t.object]!;

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and that binds the event itself. */
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

describe("picking several things", () => {
  it("adds a thing to the pick or takes it out, one thing being `object` and more `objects`, in any rooms", () => {
    let sel = homeMapToggleThing({ kind: "object", ...LAMP_A }, LAMP_B);
    expect(sel).toEqual({ kind: "objects", items: [LAMP_A, LAMP_B] });
    sel = homeMapToggleThing(sel, TABLE);
    expect(homeMapPickedThings(sel)).toEqual([LAMP_A, LAMP_B, TABLE]);
    expect(homeMapThingPicked(sel, KITCHEN, 2)).toBe(true);
    expect(homeMapThingPicked(sel, KITCHEN, 1)).toBe(false);
    sel = homeMapToggleThing(homeMapToggleThing(sel, LAMP_A), TABLE);
    expect(sel).toEqual({ kind: "object", ...LAMP_B });
    expect(homeMapToggleThing(sel, LAMP_B)).toBeUndefined();
    // A pin, several pins or a room give way to the thing alone.
    expect(homeMapToggleThing({ kind: "pins", pinIds: [READING, LOCK] }, TABLE)).toEqual({ kind: "object", ...TABLE });
    expect(homeMapToggleThing({ kind: "room", roomId: LIVING }, TABLE)).toEqual({ kind: "object", ...TABLE });
    // And the other way round: a pin picked with Cmd gives several things up.
    expect(homeMapTogglePick({ kind: "objects", items: [LAMP_A, TABLE] }, READING)).toEqual({ kind: "pin", pinId: READING });
    expect(homeMapThingsPickOf([LAMP_A, LAMP_A])).toEqual({ kind: "object", ...LAMP_A });
    expect(homeMapThingsPickOf([])).toBeUndefined();
  });

  it("is still there while every picked thing is, and is in no one room", () => {
    const doc = lamps();
    const sel: HomeMapSelection = { kind: "objects", items: [LAMP_A, TABLE] };
    expect(homeMapSelectionThere(doc.floors[0], sel)).toBe(true);
    expect(homeMapSelectionThere(fixture().floors[0], sel)).toBe(false);
    expect(homeMapSelectionRoom(sel)).toBeUndefined();
  });
});

describe("the things part with several picked", () => {
  it("adds a thing with Cmd or Ctrl and a click, never moving it, and a plain click picks one alone", () => {
    const s = shell({ kind: "object", ...LAMP_A }, undefined, lamps());
    const mode = new ArrangeMode();
    expect(mode.pointerDown(s.ctx, s.press({ metaKey: true }), [5, 1])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "objects", items: [LAMP_A, LAMP_B] });
    expect(mode.pointerDown(s.ctx, s.press({ ctrlKey: true }), [8.1, 2.5])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "objects", items: [LAMP_A, LAMP_B, TABLE] });
    expect(mode.pointerDown(s.ctx, s.press({ metaKey: true }), [1, 1])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "objects", items: [LAMP_B, TABLE] });
    // Cmd on a room's open floor keeps the pick; nothing was dragged.
    expect(mode.pointerDown(s.ctx, s.press({ metaKey: true }), [4, 3.4])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "objects", items: [LAMP_B, TABLE] });
    expect(s.handlers()).toBeUndefined();
    expect(mode.pointerDown(s.ctx, s.press(), [5, 1])).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "object", ...LAMP_B });
    expect(s.handlers()).toBeDefined();
  });

  it("outlines every picked thing, with no handles", () => {
    const s = shell({ kind: "objects", items: [LAMP_A, LAMP_B, TABLE] }, undefined, lamps());
    const art = flatten(new ArrangeMode().overlay(s.ctx));
    expect(art.split(`<polygon class="hme-box"`).length - 1).toBe(3);
    expect(art).not.toContain(`data-hme="resize"`);
    expect(art).not.toContain(`data-hme="turn"`);
  });

  it("shows how many, which, a Fabric row for the lamps and a Wood row for the table, Shown and Delete", () => {
    const s = shell({ kind: "objects", items: [LAMP_A, LAMP_B, TABLE] }, undefined, lamps());
    const text = flatten(new ArrangeMode().inspector(s.ctx));
    expect(text).toContain("<strong>3 things</strong>");
    expect(text).toContain("Floor lamp, Floor lamp and Table · in Living room, Kitchen");
    expect(text).toContain(">Picked<");
    expect(text).toContain(">Fabric<");
    expect(text).toContain(">Wood<");
    expect(text).toContain(">Shown</button>");
    expect(text).toContain("Delete 3 things");
    // Two lamps alone: fabric only.
    const two = shell({ kind: "objects", items: [LAMP_A, LAMP_B] }, undefined, lamps());
    const only = flatten(new ArrangeMode().inspector(two.ctx));
    expect(only).toContain(">Fabric<");
    expect(only).not.toContain(">Wood<");
  });

  it("colours every picked thing that has the part as one edit, the rest left as they are, Mixed where they differ", () => {
    const s = shell({ kind: "objects", items: [LAMP_A, LAMP_B, TABLE] }, undefined, lamps());
    const mode = new ArrangeMode();
    handler(mode.inspector(s.ctx), "Fabric: Navy", "@click=")();
    expect(s.log.applied).toBe(1);
    expect(thingOf(s.doc, LAMP_A).fabric).toBe("#2E4A7D");
    expect(thingOf(s.doc, LAMP_B).fabric).toBe("#2E4A7D");
    expect(thingOf(s.doc, TABLE).fabric).toBeUndefined();
    expect(flatten(mode.inspector(s.ctx))).toMatch(/class="hme-colour on" style=--c:#2E4A7D/);
    s.ctx.apply((d) => setObjectsPart(d, [LAMP_A], "fabric", "#C9A13B"));
    const mixed = flatten(mode.inspector(s.ctx));
    expect(mixed).toContain("Mixed: their fabric colours differ");
    expect(mixed).not.toMatch(/class="hme-colour on"/);
  });

  it("shows a custom colour live on every picked thing and saves it once when the picker closes", () => {
    const s = shell({ kind: "objects", items: [LAMP_A, LAMP_B] }, undefined, lamps());
    const view = new ArrangeMode().inspector(s.ctx);
    const el = { value: "#112233" };
    handler(view, "Pick a fabric colour for every picked thing", "@input=")({ target: el });
    el.value = "#445566";
    handler(view, "Pick a fabric colour for every picked thing", "@input=")({ target: el });
    expect(s.log.previews).toBe(2);
    expect(s.log.applied).toBe(0);
    expect(thingOf({ ...s.doc, floors: [s.ctx.floor] }, LAMP_A).fabric).toBe("#445566");
    expect(thingOf({ ...s.doc, floors: [s.ctx.floor] }, LAMP_B).fabric).toBe("#445566");
    expect(thingOf(s.doc, LAMP_A).fabric).toBeUndefined();
    handler(view, "Pick a fabric colour for every picked thing", "@change=")({ target: el });
    expect(s.log.applied).toBe(1);
    expect(thingOf(s.doc, LAMP_A).fabric).toBe("#445566");
    expect(thingOf(s.doc, LAMP_B).fabric).toBe("#445566");
    // The preview is over: the floor shown is the map itself.
    expect(s.ctx.floor).toBe(s.doc.floors[0]);
  });

  it("hides, shows and deletes them all, each one edit, Delete after the page's own yes", async () => {
    const s = shell({ kind: "objects", items: [LAMP_A, TABLE] }, undefined, lamps());
    const mode = new ArrangeMode();
    const pill = flatten(mode.pill(s.ctx));
    expect(pill).toContain("2 things");
    expect(pill).toContain(">Hide</button>");
    expect(pill).toContain(">Delete</button>");
    handler(mode.pill(s.ctx), ">Hide<", "@click=")();
    expect(s.log.applied).toBe(1);
    expect(thingOf(s.doc, LAMP_A).hidden).toBe(true);
    expect(thingOf(s.doc, TABLE).hidden).toBe(true);
    expect(flatten(mode.pill(s.ctx))).toContain(">Show</button>");
    s.log.answer = false;
    expect(mode.keyDown(s.ctx, { key: "Delete" } as KeyboardEvent)).toBe(true);
    await Promise.resolve();
    expect(s.log.confirms).toEqual(["Delete 2 things?"]);
    expect(s.log.applied).toBe(1);
    s.log.answer = true;
    handler(mode.inspector(s.ctx), "Delete 2 things", "@click=")();
    await Promise.resolve();
    expect(s.log.applied).toBe(2);
    expect(s.doc.floors[0]!.rooms[0]!.objects.map((o) => o.model ?? o.kind)).toEqual(["sofa", "table", "television", "lampRoundFloor"]);
    expect(s.doc.floors[0]!.rooms[1]!.objects.map((o) => o.kind)).toEqual(["refrigerator", "storage"]);
    // Across two rooms, nothing is picked after.
    expect(s.ctx.selection).toBeUndefined();
  });

  it("nudges them all with an arrow key as one edit, and Escape goes to their room when they share one, else to nothing", () => {
    const s = shell({ kind: "objects", items: [LAMP_A, LAMP_B] }, undefined, lamps());
    const mode = new ArrangeMode();
    const a = thingOf(s.doc, LAMP_A).c;
    const b = thingOf(s.doc, LAMP_B).c;
    expect(mode.keyDown(s.ctx, { key: "ArrowDown", shiftKey: true } as KeyboardEvent)).toBe(true);
    expect(s.log.applied).toBe(1);
    expect(thingOf(s.doc, LAMP_A).c).toEqual([a[0], a[1] + 0.1]);
    expect(thingOf(s.doc, LAMP_B).c).toEqual([b[0], b[1] + 0.1]);
    expect(mode.keyDown(s.ctx, { key: "Escape" } as KeyboardEvent)).toBe(true);
    expect(s.ctx.selection).toEqual({ kind: "room", roomId: LIVING });
    const across = shell({ kind: "objects", items: [LAMP_A, TABLE] }, undefined, lamps());
    expect(mode.keyDown(across.ctx, { key: "Escape" } as KeyboardEvent)).toBe(true);
    expect(across.ctx.selection).toBeUndefined();
  });
});

describe("editing several things as one edit", () => {
  it("sets a part on each that changes, and refuses when one is gone or none changes", () => {
    const doc = lamps();
    const out = setObjectsPart(doc, [LAMP_A, LAMP_B, LAMP_A], "fabric", "#8e8e93")!;
    expect(thingOf(out, LAMP_A).fabric).toBe("#8E8E93");
    expect(thingOf(out, LAMP_B).fabric).toBe("#8E8E93");
    expect(checkHomeMap(out).ok).toBe(true);
    expect(setObjectsPart(out, [LAMP_A, LAMP_B], "fabric", "#8E8E93")).toBeUndefined();
    expect(setObjectsPart(doc, [LAMP_A, { roomId: LIVING, object: 9 }], "fabric", "#8E8E93")).toBeUndefined();
    expect(setObjectsPart(doc, [LAMP_A], "fabric", "grey")).toBeUndefined();
    expect("fabric" in thingOf(setObjectsPart(out, [LAMP_A], "fabric", undefined)!, LAMP_A)).toBe(false);
  });

  it("hides, moves and removes several, a room's things taken from the end so the rest keep their places", () => {
    const doc = lamps();
    const hidden = setObjectsHidden(doc, [LAMP_A, TABLE], true)!;
    expect(thingOf(hidden, LAMP_A).hidden).toBe(true);
    expect(thingOf(hidden, TABLE).hidden).toBe(true);
    expect(setObjectsHidden(hidden, [LAMP_A, TABLE], true)).toBeUndefined();
    const moved = moveObjects(doc, [LAMP_B, TABLE], 0.5, -0.5)!;
    expect(thingOf(moved, TABLE).c).toEqual([8.6, 2]);
    const left = removeObjects(doc, [{ roomId: LIVING, object: 0 }, LAMP_A])!;
    expect(left.floors[0]!.rooms[0]!.objects.map((o) => o.model ?? o.kind)).toEqual(["table", "television", "lampRoundFloor"]);
    expect(removeObjects(doc, [])).toBeUndefined();
  });
});

describe("a colour picker that shows its colour live", () => {
  const picker = () => {
    const calls: (string | undefined)[] = [];
    const saved: string[] = [];
    const view = hmeColourInput({ value: "#8E8E93", label: "Pick", preview: (v) => calls.push(v), set: (v) => saved.push(v) });
    const on = (event: string) => handler(view, "Pick", event);
    return { calls, saved, on };
  };

  it("previews each move, then ends the preview and saves once on a change", () => {
    const p = picker();
    const el = { value: "#112233" };
    p.on("@input=")({ target: el });
    el.value = "#223344";
    p.on("@input=")({ target: el });
    p.on("@change=")({ target: el });
    expect(p.calls).toEqual(["#112233", "#223344", undefined]);
    expect(p.saved).toEqual(["#223344"]);
  });

  it("ends the preview when moved back to its own colour, and saves nothing when left there", () => {
    const p = picker();
    const el = { value: "#112233" };
    p.on("@input=")({ target: el });
    el.value = "#8e8e93";
    p.on("@input=")({ target: el });
    expect(p.calls).toEqual(["#112233", undefined]);
    p.on("@blur=")({ target: el });
    expect(p.calls).toEqual(["#112233", undefined, undefined]);
    expect(p.saved).toEqual([]);
  });

  it("saves the colour shown on a click away, which Chromium may send without a change", () => {
    const p = picker();
    const el = { value: "#445566" };
    p.on("@input=")({ target: el });
    p.on("@blur=")({ target: el });
    expect(p.calls).toEqual(["#445566", undefined]);
    expect(p.saved).toEqual(["#445566"]);
    // The change that comes after the blur saves it no second time.
    p.on("@change=")({ target: el });
    expect(p.saved).toEqual(["#445566"]);
    // A blur after a change saves nothing more.
    const q = picker();
    const other = { value: "#000000" };
    q.on("@input=")({ target: other });
    q.on("@change=")({ target: other });
    q.on("@blur=")({ target: other });
    expect(q.calls).toEqual(["#000000", undefined]);
    expect(q.saved).toEqual(["#000000"]);
  });
});
