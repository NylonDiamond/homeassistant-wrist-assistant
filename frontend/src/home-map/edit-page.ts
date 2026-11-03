// The map editor's one edit page: no modes, one place to arrange the rooms,
// their things, their walls, doors and windows, and the devices.
//
// A click picks what is on top: a device pin first, then a door or window, a
// wall, a thing (a sofa, a TV, a desk), then the room under them, and a drag
// moves what it picked (`plan-pick.ts` finds it, `mode-devices.ts` for pins,
// `mode-shape.ts` for walls and openings, `mode-arrange.ts` for things and
// rooms, each keeping all its own gestures: the room's and thing's handles,
// snapping, Shift, Cmd or Ctrl and a click picking several pins, Cmd or Ctrl and
// a click picking several things in any rooms, Shift and a drag picking every
// pin in a box, the light's glow ring, the side view, the keys). The handles of
// what is picked lie over everything. A picked wall, corner or opening shows its
// room's corners, wall middles and openings as handles; Escape goes back to the
// room.
//
// The side panel, on the left of the stage, and the pill follow what is
// picked. Fit rooms (`mode-doors.ts`) stands on top of the side panel whatever
// is picked. Nothing picked: Start here, three steps each done, the one to do
// now, or next (Rooms, Furniture, and Lights in lamps, whose button picks the
// lights no lamp holds), then the floor's card and one folded line of keys and
// tips. A room: its head, its doors, In this room (its lamps and lights, its
// furniture, its devices, each row picking its thing, tinting it on the plan and
// in 3D while the pointer is over it, a thing's eye hiding or showing it) with
// Add to the room, then the room's own cards (`mode-arrange.ts`) and its walls.
// A wall, corner or opening: its cards (`mode-shape.ts`). A thing, a lamp, a pin
// or several: their cards. Devices and furniture come onto the map through the
// page's Add dialog, which the shell opens (`ctx.openAdd`).
//
// The tools stand in a column of their own on the left of the plan, each tool's
// name under its picture and its key in its title: Pick V, Room R, Split S, Wall
// W, Door D, Window N, Way through O, Stairs T and Measure M; F opens Add on its
// furniture. A light a lamp holds is one thing with its lamp: a press on its pin
// picks the lamp and drags it, and the lamp's cards start with the light's
// (`mode-devices.ts`). Adding a light opens the lamp chooser over the page, by
// the spot.
//
// The dock under the plan holds Snap and the View menu's switches (the grid, the
// side view, every pin's name, the scan as it was; the shell adds Live states).
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { homeMapPickOf, homeMapPickedPins } from "./devices-model.js";
import { homeMapHeldPins } from "./edit-ops.js";
import { type HomeMapEditorContext, type HomeMapPart, type HomeMapViewItem, homeMapPiecePicked } from "./editor-mode.js";
import { hmeCard } from "./editor-parts.js";
import { homeMapCount, homeMapOnMac, homeMapShortcut } from "./editor-view.js";
import { homeMapPiece } from "./furniture.js";
import { ArrangeMode } from "./mode-arrange.js";
import { DevicesMode } from "./mode-devices.js";
import { DoorMode } from "./mode-doors.js";
import { type HomeMapShapeTool, ShapeMode, homeMapShapeToolIcon } from "./mode-shape.js";
import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapFloorName, sameHomeMapId } from "./model.js";

/** The edit page's tools, on its tool rail. */
export type HomeMapEditTool = "pick" | "draw" | "split" | "inner" | "door" | "window" | "opening" | "stairs" | "measure";

/** The edit page's tools in the tool rail's order: the name under each
 * picture, the longer words of its title and the key that picks it. Undo
 * and redo (Cmd or Ctrl Z) and the zoom keys stay as they are. */
export const HOME_MAP_EDIT_TOOLS: readonly { id: HomeMapEditTool; name: string; label: string; key: string }[] = [
  { id: "pick", name: "Pick", label: "Pick and move", key: "v" },
  { id: "draw", name: "Room", label: "Draw a room", key: "r" },
  { id: "split", name: "Split", label: "Split the room", key: "s" },
  { id: "inner", name: "Wall", label: "Inner wall", key: "w" },
  { id: "door", name: "Door", label: "Door", key: "d" },
  { id: "window", name: "Window", label: "Window", key: "n" },
  { id: "opening", name: "Opening", label: "Way through (no door)", key: "o" },
  { id: "stairs", name: "Stairs", label: "Stairs", key: "t" },
  { id: "measure", name: "Measure", label: "Measure", key: "m" },
];

/** The edit page's tool a key picks, if any. */
export function homeMapEditToolFor(letter: string): HomeMapEditTool | undefined {
  return HOME_MAP_EDIT_TOOLS.find((t) => t.key === letter.toLowerCase())?.id;
}

/** The doors and windows of a room in words: "1 door · 2 windows". */
export function homeMapOpeningsWords(room: Pick<HomeMapRoom, "openings">): string {
  const windows = room.openings.filter((o) => o.kind === "window").length;
  const doors = room.openings.length - windows;
  return `${homeMapCount(doors, "door")} · ${homeMapCount(windows, "window")}`;
}

/** Where a floor stands on Start here's three steps: its rooms, its things,
 * its light pins and the ones no lamp holds (by pin id), and whether each
 * step is done (a room, a thing, every light in a lamp and at least one). */
export interface HomeMapStartSteps {
  rooms: number;
  things: number;
  lights: number;
  loose: string[];
  done: [boolean, boolean, boolean];
}

export function homeMapStartSteps(floor: HomeMapFloor): HomeMapStartSteps {
  const held = homeMapHeldPins(floor);
  const lights = floor.pins.filter((p) => p.entityId.startsWith("light."));
  const loose = lights.filter((p) => !held.has(p.id.toUpperCase())).map((p) => p.id);
  const rooms = floor.rooms.length;
  const things = floor.rooms.reduce((n, r) => n + r.objects.length, 0);
  return { rooms, things, lights: lights.length, loose, done: [rooms > 0, things > 0, lights.length > 0 && loose.length === 0] };
}

export class HomeMapEditPage implements HomeMapPart {
  readonly arrange = new ArrangeMode();
  /** The lamp chooser draws its lamps with the furniture picker's
   * pictures. */
  readonly devices = new DevicesMode((ctx, pieceId, cls) => this.arrange.piecePic(ctx, homeMapPiece(pieceId), cls));
  readonly shape = new ShapeMode();
  readonly doors = new DoorMode();

  constructor() {
    this.arrange.roomDoors = (ctx, room) => this.doors.doorsCard(ctx, room);
    this.arrange.roomWalls = (ctx, room) => this.shape.roomCards(ctx, room);
    this.shape.onOpeningClick = (ctx, roomId, index) => this.doors.clicked(ctx, roomId, index);
  }

  /** The tool the rail shows as on. */
  tool(ctx: HomeMapEditorContext): HomeMapEditTool {
    if (ctx.toggles.measure) return "measure";
    if (this.arrange.draw.active) return "draw";
    const t = this.shape.tool;
    return t === "select" ? "pick" : t;
  }

  /** Pick a tool from the tool rail, or by its key. Measure goes on or
   * off; any other tool puts the last one down. */
  setTool(ctx: HomeMapEditorContext, tool: HomeMapEditTool): void {
    this.doors.stop(ctx);
    if (tool === "measure") {
      this.arrange.draw.stop();
      this.shape.setTool(ctx, "select");
      ctx.setToggle("measure", !ctx.toggles.measure);
      ctx.redraw();
      return;
    }
    if (ctx.toggles.measure) ctx.setToggle("measure", false);
    if (tool === "draw") {
      this.shape.setTool(ctx, "select");
      if (!this.arrange.draw.active) this.arrange.draw.start(ctx);
      return;
    }
    this.arrange.draw.stop(ctx);
    this.shape.setTool(ctx, tool === "pick" ? "select" : tool);
  }

  private picksPins(ctx: HomeMapEditorContext): boolean {
    return homeMapPickedPins(ctx.selection).length > 0;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    return svg`${this.arrange.overlay(ctx)}${this.shape.overlay(ctx)}${this.doors.overlay(ctx)}${this.devices.overlay(ctx)}`;
  }

  drawsPins(_ctx: HomeMapEditorContext): boolean {
    return true;
  }

  /** A press: with the lamp chooser open, it closes it and nothing more; a
   * door Connect offers connects; a tool's while one is out; else what is on
   * top, the handles of what is picked first, then the picked light's glow
   * handle, a pin (a pin a thing holds being its thing), with Shift off a pin
   * the box that picks pins, a door, window or wall, a thing, a room. */
  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (this.devices.choosing) {
      this.devices.cancelChooser(ctx);
      return true;
    }
    this.doors.endShow(ctx);
    if (this.doors.active && e.button === 0 && this.doors.pointerDown(ctx, at)) return true;
    if (this.arrange.draw.active) return this.arrange.draw.pointerDown(ctx, e, at);
    if (this.shape.armed) return this.shape.pointerDown(ctx, e, at);
    if (e.button !== 0) return false;
    if (this.shape.pressHandle(ctx, e)) return true;
    if (this.arrange.pressHandle(ctx, e, at) || this.devices.pressHandle(ctx, e, at)) return true;
    const lamp = this.devices.heldThingAt(ctx, at);
    if (lamp !== undefined && this.arrange.pressThing(ctx, e, lamp, at)) return true;
    return this.devices.pressPin(ctx, e, at)
      || this.devices.pressBox(ctx, e, at)
      || this.shape.pressPiece(ctx, e, at)
      || this.arrange.pressBody(ctx, e, at);
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    this.arrange.pointer = at;
    this.arrange.hover(ctx, at);
    this.shape.hover(ctx, at);
  }

  /** A tool's letter picks it; F opens Add on its furniture; Escape stops
   * Connect, puts a tool down, or goes from a wall, door or thing back to its
   * room; the rest is what is picked's (Delete, the arrows). */
  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.devices.chooserKey(ctx, e)) return true;
    const shortcut = homeMapShortcut(e, false);
    const letter = typeof shortcut === "object" && "letter" in shortcut ? shortcut.letter : undefined;
    if (letter === "m") {
      this.setTool(ctx, "measure");
      return true;
    }
    if (this.doors.keyDown(ctx, e)) return true;
    if (this.arrange.draw.active && this.arrange.draw.keyDown(ctx, e)) return true;
    if (shortcut === "copy" || shortcut === "paste" || shortcut === "duplicate") return this.arrange.clipKey(ctx, shortcut);
    if (letter === "f") {
      ctx.openAdd("furniture");
      return true;
    }
    const tool = letter === undefined ? undefined : homeMapEditToolFor(letter);
    if (tool !== undefined) {
      this.setTool(ctx, tool);
      return true;
    }
    if (shortcut === "cancel" && this.shape.armed) {
      this.setTool(ctx, "pick");
      return true;
    }
    if (homeMapPiecePicked(ctx.selection) || this.shape.armed) return this.shape.keyDown(ctx, e);
    return this.picksPins(ctx) ? this.devices.keyDown(ctx, e) : this.arrange.keyDown(ctx, e);
  }

  cursor(ctx: HomeMapEditorContext): string | undefined {
    return this.arrange.draw.active || this.shape.armed ? "crosshair" : undefined;
  }

  leave(ctx: HomeMapEditorContext): void {
    this.arrange.leave(ctx);
    this.devices.leave();
    this.shape.leave(ctx);
    this.doors.stop(ctx);
  }

  /** Snap: rooms to the doors and walls round them, corners to each other. */
  dock(ctx: HomeMapEditorContext): TemplateResult {
    return this.arrange.dock(ctx);
  }

  /** The View menu: the grid, the side view, every pin's name and the scan as
   * it was. */
  viewItems(ctx: HomeMapEditorContext): HomeMapViewItem[] {
    return [...this.arrange.viewItems(ctx), ...this.devices.viewItems(ctx), ...this.shape.viewItems(ctx)];
  }

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.doors.active) return this.doors.pill(ctx);
    if (this.shape.armed || homeMapPiecePicked(ctx.selection)) return this.shape.pill(ctx);
    if (this.arrange.draw.active) return this.arrange.pill(ctx);
    return this.picksPins(ctx) ? this.devices.pill(ctx) : this.arrange.pill(ctx);
  }

  /** The tool rail, the side view of the picked device, and a line on how
   * the stage works. */
  stageExtra(ctx: HomeMapEditorContext): TemplateResult {
    const side = this.devices.stageExtra(ctx);
    const hint = homeMapPiecePicked(ctx.selection) ? "Drag a corner · drag a wall's middle to add a corner · Esc for the room"
      : "Click picks what is on top: a door, a wall, a thing or a room";
    return html`${this.toolRail(ctx)}${side}
      ${side === nothing && ctx.stage.width >= 900 ? html`<div class="hme-stage-hint">${hint}</div>` : nothing}`;
  }

  /** The tools, in their own column on the left of the plan, each with its
   * name under its picture and its key in its title. */
  private toolRail(ctx: HomeMapEditorContext): TemplateResult {
    const on = this.tool(ctx);
    // A line after Pick, and before Measure.
    const lineAfter = new Set([0, HOME_MAP_EDIT_TOOLS.length - 2]);
    return html`<div class="hme-toolrail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      ${HOME_MAP_EDIT_TOOLS.map((t, i) => html`<button type="button" class="hme-rtool ${on === t.id ? "on" : ""}" aria-pressed=${on === t.id ? "true" : "false"}
          aria-label=${t.label} title=${`${t.label} (${t.key.toUpperCase()})`} @click=${() => this.setTool(ctx, t.id)}>
          ${toolIcon(t.id)}<span class="hme-rtool-name">${t.name}</span></button>
        ${lineAfter.has(i) ? html`<span class="hme-rtool-sep" aria-hidden="true"></span>` : nothing}`)}
    </div>`;
  }

  // ── the side panel ─────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    return html`${this.doors.fitCard(ctx)}${this.pickedCards(ctx)}`;
  }

  /** The cards of what is picked. */
  private pickedCards(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.picksPins(ctx)) return this.devices.inspector(ctx);
    const sel = ctx.selection;
    if (sel === undefined) return this.startPanel(ctx);
    if (homeMapPiecePicked(sel)) {
      const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, sel.roomId));
      return html`${this.shape.openingCardOf(ctx)}
        ${room !== undefined && sel.kind === "opening" ? this.doors.opensToCard(ctx, room, sel.opening) : nothing}
        ${this.shape.inspector(ctx)}
        ${room === undefined ? nothing : this.shape.roomCards(ctx, room)}`;
    }
    // A thing's device first (a lamp's light), then the thing's own cards.
    const lamp = sel.kind === "object" ? this.devices.thingCards(ctx, sel.roomId, sel.object) : nothing;
    return lamp === nothing ? this.arrange.inspector(ctx) : html`${lamp}${this.arrange.inspector(ctx)}`;
  }

  /** Nothing picked: Start here, the floor's card, and Keys and tips
   * folded into one line. */
  private startPanel(ctx: HomeMapEditorContext): TemplateResult {
    const floor = ctx.floor;
    const s = homeMapStartSteps(floor);
    const now = s.done.indexOf(false);
    const loose = s.loose.length;
    const step = (i: number, title: string, text: string, action: TemplateResult | typeof nothing = nothing) => {
      const state = s.done[i] ? "done" : i === now ? "now" : "next";
      return html`<div class="hme-step ${state}">
        <span class="hme-step-no" aria-label=${s.done[i] ? "Done" : `Step ${i + 1}`}>${s.done[i] ? "✓" : String(i + 1)}</span>
        <div class="hme-step-t"><b>${title}</b><span>${text}</span>${action}</div>
      </div>`;
    };
    const roomsText = s.rooms > 0 ? `${homeMapCount(s.rooms, "room")} on ${homeMapFloorName(floor)}. Draw one with Room, or scan one with the iPhone.`
      : "Draw one with Room, or scan one with the iPhone.";
    const thingsText = s.things > 0 ? `${homeMapCount(s.things, "thing")}. Add more from Add › Furniture.` : "None yet. Add a sofa, a bed or a lamp from Add › Furniture.";
    const lightsText = s.lights === 0 ? "No lights yet. Add one from Add › Devices and pick its lamp."
      : loose > 0 ? `${homeMapCount(loose, "light")} ${loose === 1 ? "sits" : "sit"} loose. Drop each one on its lamp, or add a light from Add › Devices and pick its lamp.`
        : `Every light sits in a lamp (${s.lights}).`;
    return html`
      ${hmeCard("Start here", html`<div class="hme-steps">
        ${step(0, "Rooms", roomsText, s.rooms > 0 ? nothing : html`<button type="button" class="hme-link" @click=${() => this.startDrawing(ctx)}>Draw a room ›</button>`)}
        ${step(1, "Furniture", thingsText, html`<button type="button" class="hme-link" @click=${() => ctx.openAdd("furniture")}>Add › Furniture</button>`)}
        ${step(2, "Lights in lamps", lightsText, loose === 0 ? nothing
          : html`<button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${() => ctx.select(homeMapPickOf(s.loose))}>Show me the loose lights</button>`)}
      </div>`, `${s.done.filter(Boolean).length} of 3 done`, "hme-start")}
      ${this.arrange.floorCard(ctx, floor)}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room locks to the doors of the rooms round it. Click an amber door, then the door it opens to, to attach its room. Drag the round handle above a room to turn it, or a square handle on its box to resize it. Click a wall, door or window to change it.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Drag a device from Add onto the plan to place it.</p>
          <p class="hme-text dim">Press <kbd>?</kbd> or the ? button in the bar for every key.</p>
          <dl class="hme-keys">
            ${homeMapKeyGroups(homeMapOnMac()).filter((g) => g.title !== "Mouse")
              .flatMap((g) => g.keys).map(([k, what]) => html`<dt><kbd>${k}</kbd></dt><dd>${what}</dd>`)}
          </dl>
        </details>
      </section>`;
  }

  /** The lamp chooser, or the furniture picker (its scrim clear, and its
   * keys reaching the page as well as its own, so Enter and Escape work
   * wherever the focus is). */
  sheet(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const chooser = this.devices.lampChooser(ctx);
    return chooser === nothing ? this.arrange.sheet(ctx) : chooser;
  }

  dragOver(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean {
    return this.devices.dragOver(ctx, at, e);
  }

  drop(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void {
    this.devices.drop(ctx, at, e);
  }

  /** Draw a room by hand, as R does (the empty floor's button). */
  startDrawing(ctx: HomeMapEditorContext): void {
    this.setTool(ctx, "draw");
  }
}

/** The keys Keys and tips lists, after the tools' own. */
/** One group of the editor's keys: its heading, and each key with what it
 * does. */
export interface HomeMapKeyGroup {
  title: string;
  keys: readonly (readonly [string, string])[];
}

/**
 * Every key the map editor knows, by group, as the keys overlay (? or the
 * bar's ? button) lists them, and the clicks that go with them. The tools'
 * keys come from the tool lists, so a tool with a new key is listed with
 * it. `mac` writes Cmd as ⌘, else Ctrl.
 */
export function homeMapKeyGroups(mac: boolean): HomeMapKeyGroup[] {
  const cmd = mac ? "⌘" : "Ctrl";
  return [
    { title: "Tools", keys: HOME_MAP_EDIT_TOOLS.map((t) => [t.key.toUpperCase(), t.label] as const) },
    { title: "Add", keys: [["A", "Add a device or furniture"], ["F", "Add furniture"]] },
    {
      title: "Edit",
      keys: [
        ["Delete", "Remove what is picked"],
        [`${cmd}${mac ? "" : "+"}C`, "Copy the picked furniture"],
        [`${cmd}${mac ? "" : "+"}V`, "Paste it under the pointer, on any floor"],
        [`${cmd}${mac ? "" : "+"}D`, "Duplicate the picked furniture"],
        ["Arrows", "Nudge it 1 cm, with Shift 10 cm"],
        ["Enter", "Close the room being drawn"],
        ["Backspace", "Take back the last corner drawn"],
        ["Esc", "Back out: Connect, a tool, a wall, door or thing to its room"],
        [mac ? "⌘Z" : "Ctrl+Z", "Undo"],
        [mac ? "⇧⌘Z" : "Ctrl+Shift+Z or Ctrl+Y", "Redo"],
      ],
    },
    {
      title: "View",
      keys: [["Space", "Hold and drag to pan"], ["Middle button", "Drag to move the plan or the 3D view"], ["+ −", "Zoom in and out"], ["0", "Fit the floor"], ["Z", "Fit the picked room"], ["?", "Show or hide these keys"]],
    },
    {
      title: "Mouse",
      keys: [
        ["Click", "Pick what is on top: a device, a door or window, a wall, a thing, then the room"],
        ["Click an amber door", "Connect it: then click the door it opens to"],
        [`Shift or ${cmd} click`, "Pick several devices"],
        [`${cmd} click`, "Pick several things"],
        ["Shift drag", "Pick every device in a box"],
        ["Drag in 3D", "Turn the model; scroll to zoom"],
        ["Alt drag", "Drag a copy of the furniture picked"],
        ["Drag a number", "Change it, with Shift in big steps, with Alt in fine ones; click it to type"],
      ],
    },
  ];
}

/** A tool's small picture on the tool rail. */
function toolIcon(tool: HomeMapEditTool): TemplateResult {
  switch (tool) {
    case "pick":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;
    case "draw":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;
    case "measure":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;
    default:
      return homeMapShapeToolIcon(tool as HomeMapShapeTool);
  }
}
