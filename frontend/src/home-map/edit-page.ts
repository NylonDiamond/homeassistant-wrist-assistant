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
// picked. Fit rooms (`mode-doors.ts`) stands on top of the side panel while a
// door does not meet, and is one quiet line at its foot once every door
// does. Nothing picked: the checklist Finish your map (`waiting.ts`): Rooms,
// whose button draws one; Devices, whose Place devices picks the first room
// with devices waiting, with a quiet line for the lights no lamp holds; On a
// page, which lists each watch and iPhone with Add page (`page-step.ts`).
// Then Rooms, one row per room with its devices on the map and waiting, and
// the floor's card and Keys and tips, both folded. A room: the checklist's
// strip, its head, Not on the map (its waiting devices, `mode-devices.ts`),
// On the map (its pins), then folded Furniture, Name, area and tap, Size and
// place, Floor and walls, Doors and windows, and The scan (`mode-arrange.ts`).
// A wall, corner or opening: its cards (`mode-shape.ts`). A thing, a lamp, a
// pin or several: their cards, under the tray of the room that just placed
// the device. Devices also come onto the map through the page's Add dialog,
// which the shell opens (`ctx.openAdd`).
//
// A tray row dragged onto the plan puts its device where it is dropped; a
// click on it arms it, the plan's cursor a crosshair, and the next click on
// the plan puts it there (Escape, or the row again, disarms). A light goes in
// a lamp of the kind the lamp chooser last took, with no dialog; the lamp is
// picked, so its Light card can change it.
//
// The tools stand in a column of their own on the left of the plan, each
// tool's name under its picture and its key in its title: Pick V, Draw, which
// opens the list Room R, Split S, Wall W, Door D, Window N, Opening O and
// Stairs T (showing the one that is on), and Measure M; F opens Add on its
// furniture. A light a lamp holds is one thing with its lamp: a press on its
// pin picks the lamp and drags it, and the lamp's cards start with the
// light's (`mode-devices.ts`).
//
// The dock under the plan holds Snap and the View menu's switches (the grid, the
// side view, every pin's name, the scan as it was; the shell adds Live states).
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { homeMapPickOf, homeMapPickedPins } from "./devices-model.js";
import { homeMapHeldPins, homeMapPinsOfRoom } from "./edit-ops.js";
import { type HomeMapEditorContext, type HomeMapPart, type HomeMapViewItem, homeMapPiecePicked, homeMapRoomsPicked } from "./editor-mode.js";
import { hmeCard, hmeFold, homeMapKeepFold } from "./editor-parts.js";
import { homeMapCount, homeMapOnMac, homeMapShortcut } from "./editor-view.js";
import { homeMapPiece } from "./furniture.js";
import { ArrangeMode, HOME_MAP_ROOM_CARD_FOLD } from "./mode-arrange.js";
import { DevicesMode } from "./mode-devices.js";
import { DoorMode } from "./mode-doors.js";
import { type HomeMapShapeTool, ShapeMode, homeMapShapeToolIcon } from "./mode-shape.js";
import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapFloorName, homeMapRoomName, sameHomeMapId } from "./model.js";
import {
  HOME_MAP_CHECKLIST_TITLE,
  type HomeMapChecklistStep,
  homeMapChecklist,
  homeMapChecklistActive,
  homeMapChecklistDoneWords,
  homeMapRoomCardWords,
  homeMapRoomWaiting,
  type HomeMapWaitTotals,
  homeMapWaitTotals,
} from "./waiting.js";

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

/** The tools under the tool rail's Draw, in its list's order. */
export const HOME_MAP_DRAW_TOOLS = HOME_MAP_EDIT_TOOLS.filter((t) => t.id !== "pick" && t.id !== "measure");

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

/** The floor's light pins no lamp holds, by pin id: the loose lights the
 * checklist's Devices step offers to show. */
export function homeMapLooseLights(floor: HomeMapFloor): string[] {
  const held = homeMapHeldPins(floor);
  return floor.pins.filter((p) => p.entityId.startsWith("light.") && !held.has(p.id.toUpperCase())).map((p) => p.id);
}

/** The name of a device armed by its tray row, for the line over the plan. */
function homeMapArmedName(ctx: HomeMapEditorContext, entityId: string): string {
  const v = ctx.hass?.states?.[entityId]?.attributes?.friendly_name;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : entityId;
}

export class HomeMapEditPage implements HomeMapPart {
  readonly arrange = new ArrangeMode();
  /** The lamp chooser draws its lamps with the furniture picker's
   * pictures. */
  readonly devices = new DevicesMode((ctx, pieceId, cls) => this.arrange.piecePic(ctx, homeMapPiece(pieceId), cls));
  readonly shape = new ShapeMode();
  readonly doors = new DoorMode();

  /** The Draw button's list of tools is open. */
  drawOpen = false;

  constructor() {
    this.arrange.roomDoors = (ctx, room) => this.doors.doorsCard(ctx, room);
    this.arrange.roomWalls = (ctx, room) => this.shape.wallsCard(ctx, room);
    this.arrange.roomScan = (ctx, room) => this.shape.scanCard(ctx, room);
    this.arrange.roomBefore = (ctx) => this.checklistStrip(ctx);
    this.arrange.roomTray = (ctx, room) => html`${this.devices.trayCard(ctx, room)}${this.devices.onMapCard(ctx, room)}`;
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
    this.drawOpen = false;
    this.devices.armed = undefined;
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
    if (this.drawOpen) {
      this.drawOpen = false;
      ctx.redraw();
    }
    if (this.devices.armed !== undefined && e.button === 0) {
      this.devices.placeArmed(ctx, at);
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
    if (shortcut === "cancel" && (this.devices.armed !== undefined || this.drawOpen)) {
      this.devices.armed = undefined;
      this.drawOpen = false;
      ctx.redraw();
      return true;
    }
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
    return this.arrange.draw.active || this.shape.armed || this.devices.armed !== undefined ? "crosshair" : undefined;
  }

  leave(ctx: HomeMapEditorContext): void {
    this.arrange.leave(ctx);
    this.devices.leave();
    this.shape.leave(ctx);
    this.doors.stop(ctx);
    this.drawOpen = false;
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
    const armed = this.devices.armed;
    const hint = homeMapPiecePicked(ctx.selection) ? "Drag a corner · drag a wall's middle to add a corner · Esc for the room"
      : "Click picks what is on top: a door, a wall, a thing or a room";
    return html`${this.toolRail(ctx)}${this.drawList(ctx)}${side}
      ${armed !== undefined ? html`<div class="hme-armed" role="status"><b>${homeMapArmedName(ctx, armed)}</b> Click its place on the plan.
          <button type="button" class="hme-link" @click=${() => this.devices.arm(ctx, undefined)}>Stop</button></div>`
        : side === nothing && ctx.stage.width >= 1200 ? html`<div class="hme-stage-hint">${hint}</div>` : nothing}`;
  }

  /** The tools, in their own column on the left of the plan, each with its
   * name under its picture and its key in its title: Pick, Draw (which opens
   * the list of drawing tools, and shows the one that is on by its name and
   * picture) and Measure. */
  private toolRail(ctx: HomeMapEditorContext): TemplateResult {
    const on = this.tool(ctx);
    const pick = HOME_MAP_EDIT_TOOLS.find((t) => t.id === "pick")!;
    const measure = HOME_MAP_EDIT_TOOLS.find((t) => t.id === "measure")!;
    const drawing = HOME_MAP_DRAW_TOOLS.find((t) => t.id === on);
    const button = (t: (typeof HOME_MAP_EDIT_TOOLS)[number]) => html`<button type="button" class="hme-rtool ${on === t.id ? "on" : ""}" aria-pressed=${on === t.id ? "true" : "false"}
      aria-label=${t.label} title=${`${t.label} (${t.key.toUpperCase()})`} @click=${() => this.setTool(ctx, t.id)}>
      ${toolIcon(t.id)}<span class="hme-rtool-name">${t.name}</span></button>`;
    return html`<div class="hme-toolrail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      ${button(pick)}
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      <button type="button" class="hme-rtool hme-rtool-draw ${drawing !== undefined || this.drawOpen ? "on" : ""}" aria-pressed=${drawing !== undefined ? "true" : "false"}
        aria-haspopup="menu" aria-expanded=${this.drawOpen ? "true" : "false"} aria-label=${drawing === undefined ? "Draw" : `Draw: ${drawing.label}`}
        title=${drawing === undefined ? "Draw a room, a wall, a door, a window, a way through or stairs" : `${drawing.label} (${drawing.key.toUpperCase()})`}
        @click=${() => { this.drawOpen = !this.drawOpen; ctx.redraw(); }}>
        ${toolIcon(drawing?.id ?? "draw")}<span class="hme-rtool-name">${drawing?.name ?? "Draw"} ▾</span></button>
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      ${button(measure)}
    </div>`;
  }

  /** The Draw button's list: each drawing tool with its picture, name and
   * key, the one that is on marked. */
  private drawList(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (!this.drawOpen) return nothing;
    const on = this.tool(ctx);
    return html`<div class="hme-drawlist" role="menu" aria-label="Draw">
      ${HOME_MAP_DRAW_TOOLS.map((t) => html`<button type="button" role="menuitemradio" class="hme-drawlist-item ${on === t.id ? "on" : ""}" aria-checked=${on === t.id ? "true" : "false"}
        title=${`${t.label} (${t.key.toUpperCase()})`} @click=${() => this.setTool(ctx, t.id)}>${toolIcon(t.id)}<span>${t.name}</span><kbd>${t.key.toUpperCase()}</kbd></button>`)}
    </div>`;
  }

  // ── the side panel ─────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    return html`${this.doors.fitCard(ctx)}${this.pickedCards(ctx)}${this.doors.fitFoot(ctx)}`;
  }

  /** The room whose tray placed the device picked now, while that room has
   * devices left to place: its tray stays over the device's cards. */
  private trayAbove(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const id = this.devices.trayRoom;
    const sel = ctx.selection;
    if (id === undefined || sel === undefined) return nothing;
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
    if (room === undefined) return nothing;
    const inRoom = sel.kind === "object" ? sameHomeMapId(sel.roomId, id)
      : sel.kind === "pin" ? homeMapRoomsPicked(ctx.floor, sel).some((r) => sameHomeMapId(r.id, id)) : false;
    if (!inRoom) return nothing;
    const w = this.devices.waitingIn(ctx, room);
    if (w.main.length === 0 && w.more.length === 0) return nothing;
    return html`${this.devices.trayCard(ctx, room, `Next in ${homeMapRoomName(room)}`)}
      <button type="button" class="hme-link hme-tray-back" @click=${() => ctx.select({ kind: "room", roomId: room.id })}>‹ ${homeMapRoomName(room)}</button>`;
  }

  /** The cards of what is picked. */
  private pickedCards(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.picksPins(ctx)) return html`${this.trayAbove(ctx)}${this.devices.inspector(ctx)}`;
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
    return lamp === nothing ? this.arrange.inspector(ctx) : html`${this.trayAbove(ctx)}${lamp}${this.arrange.inspector(ctx)}`;
  }

  // ── the checklist ──────────────────────────────────────────────────────

  /** The checklist's three steps, from the whole map and the library. */
  checklist(ctx: HomeMapEditorContext, totals: HomeMapWaitTotals = homeMapWaitTotals(ctx.doc, this.devices.homeDevices(ctx))): HomeMapChecklistStep[] {
    return homeMapChecklist(totals, ctx.pageStep?.done(ctx.doc) ?? false);
  }

  /** Whether the checklist shows: while a step is left, and after Add page
   * made a page here, so its row can say so. */
  private checklistShown(ctx: HomeMapEditorContext, steps: readonly HomeMapChecklistStep[]): boolean {
    return homeMapChecklistActive(steps) !== undefined || ctx.pageStep?.addedAny === true;
  }

  /** A picked room's strip of the checklist: three cells, the active one
   * tinted with its words; a click goes back to the whole checklist. None
   * once every step is done. */
  checklistStrip(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const steps = this.checklist(ctx);
    const active = homeMapChecklistActive(steps);
    if (active === undefined) return nothing;
    return html`<button type="button" class="hme-strip" title="Show the whole checklist" aria-label=${`${HOME_MAP_CHECKLIST_TITLE}: ${homeMapChecklistDoneWords(steps)}`}
      @click=${() => ctx.select(undefined)}>
      ${steps.map((st) => html`<span class="hme-strip-cell ${st.done ? "done" : st === active ? "now" : "next"}">
        <b>${st.done ? "✓ " : ""}${st.title}</b>${st === active ? html`<small>${st.words}</small>` : nothing}</span>`)}
    </button>`;
  }

  /** The first room with devices waiting, this floor's first, picked so
   * its tray shows. */
  private placeDevices(ctx: HomeMapEditorContext): void {
    const devices = this.devices.homeDevices(ctx);
    const floors = [ctx.floor, ...ctx.doc.floors.filter((f) => !sameHomeMapId(f.id, ctx.floor.id))];
    for (const f of floors) {
      const room = f.rooms.find((r) => homeMapRoomWaiting(r, devices, ctx.doc).main.length > 0);
      if (room === undefined) continue;
      if (!sameHomeMapId(f.id, ctx.floor.id)) ctx.setFloor(f.id);
      ctx.select({ kind: "room", roomId: room.id });
      return;
    }
  }

  /** Finish your map: the three steps, the active one carrying its button.
   * Rooms draws one; Devices picks the first room with devices waiting, and
   * offers the loose lights; On a page lists each watch and iPhone with Add
   * page. */
  private checklistCard(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const totals = homeMapWaitTotals(ctx.doc, this.devices.homeDevices(ctx));
    const steps = this.checklist(ctx, totals);
    if (!this.checklistShown(ctx, steps)) return nothing;
    const active = homeMapChecklistActive(steps);
    const loose = homeMapLooseLights(ctx.floor);
    const step = (st: HomeMapChecklistStep, body: TemplateResult | typeof nothing) => {
      const state = st.done ? "done" : st === active ? "now" : "next";
      return html`<div class="hme-step ${state}">
        <span class="hme-step-no" aria-label=${st.done ? "Done" : `Step ${st.id}`}>${st.done ? "✓" : String(st.id)}</span>
        <div class="hme-step-t"><b>${st.title}</b><span>${st.words}</span>${body}</div>
      </div>`;
    };
    const [rooms, devices, page] = steps as [HomeMapChecklistStep, HomeMapChecklistStep, HomeMapChecklistStep];
    return hmeCard(HOME_MAP_CHECKLIST_TITLE, html`<div class="hme-steps">
      ${step(rooms, active === rooms ? html`<button type="button" class="hme-tb hme-blue" @click=${() => this.startDrawing(ctx)}>Draw a room</button>` : nothing)}
      ${step(devices, html`${active !== devices ? nothing : totals.waiting > 0
          ? html`<button type="button" class="hme-tb hme-blue" @click=${() => this.placeDevices(ctx)}>Place devices</button>`
          : html`<button type="button" class="hme-tb hme-blue" @click=${() => ctx.openAdd("devices")}>Add a device</button>`}
        ${loose.length === 0 ? nothing : html`<span class="hme-step-quiet">${homeMapCount(loose.length, "light")} ${loose.length === 1 ? "sits" : "sit"} in no lamp.
          <button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${() => ctx.select(homeMapPickOf(loose))}>Show me the loose lights</button></span>`}`)}
      ${step(page, active === page || ctx.pageStep?.addedAny === true ? this.pageRows(ctx) : nothing)}
    </div>`, homeMapChecklistDoneWords(steps), "hme-start");
  }

  /** On a page's rows: each watch and iPhone, what it gets, and Add page,
   * then Added with a link to the page. */
  private pageRows(ctx: HomeMapEditorContext): TemplateResult {
    const step = ctx.pageStep;
    if (step === undefined) return html``;
    const rows = step.rows();
    const floor = ctx.floor.rooms.length > 0 ? ctx.floor : ctx.doc.floors.find((f) => f.rooms.length > 0);
    if (rows.length === 0) return html`<span class="hme-step-quiet">Pair a watch or an iPhone first.</span>`;
    return html`<div class="hme-pagerows">${rows.map((r) => html`<div class="hme-pagerow">
      <div class="hme-pagerow-t"><b>${r.device.name}</b><span>${r.line}</span>
        ${r.note === undefined ? nothing : html`<span class="hme-pagerow-note ${r.note.kind}" role="status">${r.note.text}</span>`}</div>
      ${r.added !== undefined
        ? html`<span class="hme-pagerow-done">Added${ctx.openPage === undefined ? nothing : html` · <button type="button" class="hme-link" @click=${() => ctx.openPage?.(r.added!)}>Open it</button>`}</span>`
        : html`<button type="button" class="hme-tb" aria-label=${`Add a page to ${r.device.name}`} ?disabled=${r.busy || floor === undefined}
            @click=${() => { if (floor !== undefined) void step.add(ctx.hass, ctx.doc, floor, r.device, (o) => ctx.confirm(o)); }}>${r.busy ? "Adding…" : "Add page"}</button>`}
    </div>`)}</div>`;
  }

  /** Rooms: each room of the floor, its devices on the map and waiting; a
   * click picks it, and a room with no area opens its Name, area and tap. */
  private roomsCard(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const floor = ctx.floor;
    if (floor.rooms.length === 0) return nothing;
    return hmeCard("Rooms", html`<div class="hme-ly-list">${floor.rooms.map((room) => {
      const w = this.devices.waitingIn(ctx, room);
      const hasArea = room.areaId !== undefined;
      const words = homeMapRoomCardWords({ hasArea, onMap: homeMapPinsOfRoom(floor, room.id).length, wait: w.main.length, more: w.more.length });
      const sel = { kind: "room" as const, roomId: room.id };
      const hover = ctx.hover?.kind === "room" && sameHomeMapId(ctx.hover.roomId, room.id);
      return html`<div class="hme-ly ${hover ? "hov" : ""}" @pointerenter=${() => ctx.setHover(sel)} @pointerleave=${() => ctx.setHover(undefined)}>
        <button type="button" class="hme-ly-main" title=${hasArea ? "Pick it" : "Pick it and give it an area"}
          @click=${() => { if (!hasArea) homeMapKeepFold(HOME_MAP_ROOM_CARD_FOLD, true); ctx.select(sel); }}>
          <span class="hme-thing-ic" aria-hidden="true"></span><span class="hme-ly-nm">${homeMapRoomName(room)}</span>
          <span class="hme-ly-end ${w.main.length > 0 ? "wait" : ""}">${words}</span></button>
      </div>`;
    })}</div>`, String(floor.rooms.length), "hme-rooms");
  }

  /** Nothing picked: Finish your map, the floor's rooms, then the floor's
   * card and Keys and tips, both folded. */
  private startPanel(ctx: HomeMapEditorContext): TemplateResult {
    const floor = ctx.floor;
    return html`
      ${this.checklistCard(ctx)}
      ${this.roomsCard(ctx)}
      ${hmeFold("floor", "Floor", homeMapFloorName(floor), this.arrange.floorBody(ctx, floor))}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room locks to the doors of the rooms round it. Click an amber door, then the door it should meet. Drag the round handle above a room to turn it, or a square handle on its box to resize it. Click a wall, door or window to change it.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Pick a room to see its devices that wait: drag one from its tray onto the plan, or click it, then click its place.</p>
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
        ["Click an amber door", "Connect it: then click the door it should meet"],
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
