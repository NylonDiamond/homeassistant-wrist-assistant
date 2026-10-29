// The map editor's one edit page (mock boards A and B): no modes, one place
// to arrange the rooms, their things and the devices, and a room's walls
// edited in place.
//
// Editing the floor (board A). A click picks what is on top: a device pin
// first, then a thing (a sofa, a TV, a desk), then the room under them, and
// a drag moves what it picked (`mode-devices.ts` for pins, `mode-arrange.ts`
// for things and rooms, each keeping all its own gestures: the room's and
// thing's handles, snapping, Shift, Cmd or Ctrl and a click picking several
// pins, Cmd or Ctrl and a click picking several things in any rooms, Shift
// and a drag picking every pin in a box, the light's glow ring, the side
// view, the keys). The handles of what is picked lie over everything. The
// inspector and the pill follow what is picked: a pin or several pins have
// the devices' cards, a room, a thing or several things their own, nothing
// picked the floor and how the page works. The left rail finds a room, a
// thing or a device; lists the floor's rooms as layers, the picked room (or
// the picked device's, or each picked thing's) open on its things, its
// devices with their on or off dot, and a count of its doors and windows;
// and holds Not on the map, the
// devices that are not placed yet, dragged onto the plan or placed all at
// once by area, the rest behind More. A tool rail floats on the left of the
// plan, each tool with its key: Pick and move V, Draw a room R, Inner wall
// W, Door D, Window N, Add furniture F and Measure M. Inner wall, Door and
// Window work on any room's walls, and once placed go into that room's wall
// editing with the new wall or opening picked. A light a lamp holds is one
// thing with its lamp: a press on its pin picks the lamp and drags it, and
// the lamp's inspector starts with the light's cards (`mode-devices.ts`).
// Adding a light opens the lamp chooser over the page, by the spot.
//
// Editing a room's walls (board B), entered by a double-click on a room on
// the plan or on its layer: the other rooms dim and its corners, walls and
// openings take the presses (`mode-shape.ts`, its whole stage, inspector and
// dock, held to that room). A blue bar across the top of the stage says so,
// with Done; Escape, Done or a click outside the room go back with the room
// picked. The tool rail then holds the wall tools (Corners and walls V,
// Split the room S, Inner wall W, Door D, Window N, Way through O, Stairs T,
// and Measure M), and the left rail the room's walls with what is on each,
// the scan check and the scan as it was.
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import {
  type HomeMapDeviceEntry,
  homeMapDevices,
  homeMapFindDevices,
  homeMapPickedPins,
  homeMapPlaceableCount,
  homeMapStateText,
  homeMapTogglePick,
  homeMapTray,
} from "./devices-model.js";
import { homeMapPinsOfRoom } from "./edit-ops.js";
import { type HomeMapEditorContext, type HomeMapPart, homeMapThingPicked, homeMapToggleThing } from "./editor-mode.js";
import { HME_FINISH_DOT, hmeCard } from "./editor-parts.js";
import { homeMapCount, homeMapRoomSizeText, homeMapShortcut } from "./editor-view.js";
import { homeMapPiece } from "./furniture.js";
import { homeFloorKind, homeRoomUnder } from "./geometry.js";
import { ArrangeMode, homeMapRoomForAdding, homeMapThingName } from "./mode-arrange.js";
import { DevicesMode } from "./mode-devices.js";
import { HOME_MAP_SHAPE_TOOLS, type HomeMapShapeTool, ShapeMode, homeMapShapeToolIcon } from "./mode-shape.js";
import {
  type HomeMapPin,
  type HomeMapRoom,
  type HomeMapStates,
  type HomePoint,
  homeMapFloorName,
  homeMapPinLook,
  homeMapPinName,
  homeMapPinRoom,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";

/** The edit page's tools, on its tool rail. */
export type HomeMapEditTool = "pick" | "draw" | "inner" | "door" | "window" | "furniture" | "measure";

/** The edit page's tools in the tool rail's order, with the key that picks
 * each. Undo and redo (Cmd or Ctrl Z) and the zoom keys stay as they are. */
export const HOME_MAP_EDIT_TOOLS: readonly { id: HomeMapEditTool; label: string; key: string }[] = [
  { id: "pick", label: "Pick and move", key: "v" },
  { id: "draw", label: "Draw a room", key: "r" },
  { id: "inner", label: "Inner wall", key: "w" },
  { id: "door", label: "Door", key: "d" },
  { id: "window", label: "Window", key: "n" },
  { id: "furniture", label: "Add furniture", key: "f" },
  { id: "measure", label: "Measure", key: "m" },
];

/** The edit page's tool a key picks, if any. */
export function homeMapEditToolFor(letter: string): HomeMapEditTool | undefined {
  return HOME_MAP_EDIT_TOOLS.find((t) => t.key === letter.toLowerCase())?.id;
}

/** How many devices Not on the map shows before More. */
const TRAY_SHOWN = 4;

/** A thing's footprint as the layers write it: "2.0 × 0.9". */
const footprint = (size: readonly number[]) => `${size[0]!.toFixed(1)} × ${size[1]!.toFixed(1)}`;

/** The doors and windows of a room as the layers count them. */
export function homeMapOpeningsWords(room: Pick<HomeMapRoom, "openings">): string {
  const windows = room.openings.filter((o) => o.kind === "window").length;
  const doors = room.openings.length - windows;
  return `${homeMapCount(doors, "door")} · ${homeMapCount(windows, "window")}`;
}

/** Whether a pin's device is on, for its dot in the layers. */
function pinOn(pin: HomeMapPin, states: HomeMapStates | undefined): boolean {
  const look = homeMapPinLook(pin.entityId, states);
  return (look.kind === "light" || look.kind === "other") && look.on;
}

export class HomeMapEditPage implements HomeMapPart {
  readonly arrange = new ArrangeMode();
  /** The lamp chooser draws its lamps with the furniture picker's
   * pictures. */
  readonly devices = new DevicesMode((ctx, pieceId, cls) => this.arrange.piecePic(ctx, homeMapPiece(pieceId), cls));
  readonly shape = new ShapeMode();
  /** What the rail's find field holds. */
  query = "";
  /** Not on the map shows every device, not just the first few. */
  private trayOpen = false;

  /** The tool the rail shows as on. */
  tool(ctx: HomeMapEditorContext): HomeMapEditTool | HomeMapShapeTool {
    if (ctx.toggles.measure) return "measure";
    if (ctx.walls !== undefined) return this.shape.tool;
    if (this.arrange.draw.active) return "draw";
    const t = this.shape.tool;
    return t === "inner" || t === "door" || t === "window" ? t : "pick";
  }

  /** Pick a tool from the tool rail, or by its key. Add furniture opens
   * the furniture picker for the picked room, or the one in the middle of
   * the view; Measure goes on or off; any other tool puts the last one
   * down. */
  setTool(ctx: HomeMapEditorContext, tool: HomeMapEditTool | HomeMapShapeTool): void {
    if (tool === "furniture") {
      const room = homeMapRoomForAdding(ctx);
      if (room === undefined) ctx.note("warn", "Draw or scan a room first, then add its furniture.");
      else this.arrange.openPicker(ctx, room);
      return;
    }
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

  /** The rooms whose layers are open: the picked room's, the picked
   * device's, or the room of each picked thing. */
  private openRooms(ctx: HomeMapEditorContext): string[] {
    const sel = ctx.selection;
    if (sel === undefined || sel.kind === "pins") return [];
    if (sel.kind === "pin") {
      const pin = ctx.floor.pins.find((p) => sameHomeMapId(p.id, sel.pinId));
      const room = pin === undefined ? undefined : homeMapPinRoom(ctx.floor, pin)?.id;
      return room === undefined ? [] : [room];
    }
    if (sel.kind === "objects") return sel.items.map((t) => t.roomId);
    return [sel.roomId];
  }

  private picksPins(ctx: HomeMapEditorContext): boolean {
    return homeMapPickedPins(ctx.selection).length > 0;
  }

  // ── the rail ───────────────────────────────────────────────────────────

  rail(ctx: HomeMapEditorContext): TemplateResult {
    if (ctx.walls !== undefined) return this.shape.rail(ctx);
    const states = ctx.hass?.states;
    const devices = homeMapDevices(ctx.hass);
    const q = this.query.trim().toLowerCase();
    // A light is found even when it is on the map: it can go in many lamps.
    const found = q === "" ? [] : homeMapFindDevices(devices, this.query).filter((d) => d.domain === "light" || !ctx.floor.pins.some((p) => p.entityId === d.entityId));
    return html`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room, thing or device" aria-label="Find a room, thing or device" .value=${live(this.query)}
          @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
      ${this.layers(ctx, q)}
      ${q === "" || found.length === 0 ? nothing : hmeCard("Devices found", html`
        ${found.map((d) => this.devices.deviceRow(ctx, d, states))}`, found.length >= 40 ? "40+" : String(found.length), "hme-tray")}
      ${this.trayCard(ctx, devices, states)}`;
  }

  /** The floor's rooms as layers, the open one on its things, devices and
   * openings; with a search, the rooms that match or hold a match, open. */
  private layers(ctx: HomeMapEditorContext, q: string): TemplateResult {
    const floor = ctx.floor;
    const states = ctx.toggles.live ? ctx.hass?.states : undefined;
    const has = (text: string) => text.toLowerCase().includes(q);
    const pinMatch = (p: HomeMapPin) => has(homeMapPinName(p, ctx.hass)) || p.entityId.includes(q);
    const open = this.openRooms(ctx);
    const rows = floor.rooms.map((room) => {
      const things = room.objects.map((object, index) => ({ object, index }));
      const pins = homeMapPinsOfRoom(floor, room.id);
      if (q === "") return { room, things, pins, open: open.some((id) => sameHomeMapId(room.id, id)) };
      const self = has(homeMapRoomName(room));
      const t = things.filter(({ object }) => has(homeMapThingName(object)));
      const p = pins.filter(pinMatch);
      if (!self && t.length === 0 && p.length === 0) return undefined;
      return { room, things: self ? things : t, pins: self ? pins : p, open: true };
    }).filter((r) => r !== undefined);
    const loose = floor.pins.filter((p) => homeMapPinRoom(floor, p) === undefined && (q === "" || pinMatch(p)));
    const others = ctx.doc.floors.filter((f) => !sameHomeMapId(f.id, floor.id));
    return html`<section class="hme-card hme-layers">
      <div class="hme-h">${homeMapFloorName(floor)}<span class="hme-h-end">${homeMapCount(floor.rooms.length, "room")}</span></div>
      ${rows.map((r) => this.layer(ctx, r.room, r.open, r.things, r.pins, states))}
      ${rows.length === 0 ? html`<p class="hme-empty-line">${q === "" ? "No rooms on this floor yet. Draw one with R." : "Nothing by that name."}</p>` : nothing}
      ${loose.length === 0 ? nothing : html`<div class="hme-lay dim">Not in a room<span class="n">${loose.length}</span></div>
        ${loose.map((p) => this.pinLayer(ctx, p, states))}`}
      ${q !== "" ? nothing : html`<div class="hme-sep"></div>${this.devices.kindChips(ctx)}`}
      ${others.length > 0 ? html`<div class="hme-sep"></div>${others.map((f) => html`<button type="button" class="hme-lay dim"
          @click=${() => ctx.setFloor(f.id)}>▸ ${homeMapFloorName(f)}<span class="n">${homeMapCount(f.rooms.length, "room")}</span></button>`)}` : nothing}
    </section>`;
  }

  private layer(ctx: HomeMapEditorContext, room: HomeMapRoom, open: boolean, things: { object: HomeMapRoom["objects"][number]; index: number }[], pins: HomeMapPin[], states: HomeMapStates | undefined): TemplateResult {
    const sel = ctx.selection;
    const on = sel?.kind === "room" && sameHomeMapId(sel.roomId, room.id);
    const row = html`<button type="button" class="hme-lay ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} aria-expanded=${open ? "true" : "false"}
      title="Click to pick it, double-click to edit its walls"
      @click=${() => ctx.select({ kind: "room", roomId: room.id })}
      @dblclick=${() => ctx.editWalls(room.id)}>
      <span class="hme-caret" aria-hidden="true">${open ? "▾" : "▸"}</span>
      <span class="hme-dot" style=${`background:${HME_FINISH_DOT[homeFloorKind(room)]}`}></span>${homeMapRoomName(room)}<span class="n">${homeMapRoomSizeText(room)}</span></button>`;
    if (!open) return row;
    return html`${row}
      ${things.map(({ object, index }) => {
        const picked = homeMapThingPicked(sel, room.id, index);
        const thing = { roomId: room.id, object: index };
        return html`<button type="button" class="hme-lay sub ${picked ? "on" : ""} ${object.hidden === true ? "dim" : ""}" aria-pressed=${picked ? "true" : "false"}
          title="Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several."
          @click=${(e: MouseEvent) => ctx.select(e.metaKey || e.ctrlKey ? homeMapToggleThing(ctx.selection, thing) : { kind: "object", ...thing })}>
          <span class="hme-thing-ic ${picked ? "on" : ""}" aria-hidden="true"></span>${homeMapThingName(object)}<span class="n">${object.hidden === true ? "hidden" : footprint(object.size)}</span></button>`;
      })}
      ${pins.map((p) => this.pinLayer(ctx, p, states))}
      <button type="button" class="hme-lay sub dim" title="Edit this room's walls, doors and windows" @click=${() => ctx.editWalls(room.id)}>${homeMapOpeningsWords(room)}<span class="n">Walls ›</span></button>`;
  }

  /** A device in the layers, its dot lit when it is on; Shift, Cmd or Ctrl
   * and a click adds it to the pick. */
  private pinLayer(ctx: HomeMapEditorContext, p: HomeMapPin, states: HomeMapStates | undefined): TemplateResult {
    const picked = homeMapPickedPins(ctx.selection).some((id) => sameHomeMapId(id, p.id));
    const lit = pinOn(p, states);
    return html`<button type="button" class="hme-lay sub ${picked ? "on" : ""}" aria-pressed=${picked ? "true" : "false"} title="Shift, Cmd or Ctrl and a click picks several"
      @click=${(e: MouseEvent) => ctx.select(e.shiftKey || e.metaKey || e.ctrlKey ? homeMapTogglePick(ctx.selection, p.id) : { kind: "pin", pinId: p.id })}>
      <span class="hme-dot dev ${lit ? "" : "off"}"></span>${homeMapPinName(p, ctx.hass)}<span class="n">${homeMapStateText(p.entityId, states)}</span></button>`;
  }

  /** The devices with an area that are not on the map yet: the first few,
   * dragged onto the plan or clicked to place, Place all by area, and the
   * rest behind More. */
  private trayCard(ctx: HomeMapEditorContext, devices: readonly HomeMapDeviceEntry[], states: HomeMapStates | undefined): TemplateResult {
    const groups = homeMapTray(ctx.doc, ctx.floor, devices);
    const tray = groups.reduce((n, g) => n + g.devices.length, 0);
    const placeable = homeMapPlaceableCount(ctx.floor, groups);
    const more = tray - TRAY_SHOWN;
    const all = this.trayOpen || more <= 0;
    const rows = all
      ? groups.map((g) => html`<div class="hme-ar ${g.here ? "" : "dim"}">${g.name}<span>${g.devices.length}</span></div>
          ${g.devices.map((d) => this.devices.deviceRow(ctx, d, states))}`)
      : groups.flatMap((g) => g.devices).slice(0, TRAY_SHOWN).map((d) => this.devices.deviceRow(ctx, d, states));
    return hmeCard("Not on the map", html`
      ${tray === 0 ? html`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>` : rows}
      ${tray === 0 ? nothing : html`<div class="hme-row-end">
          <button type="button" class="hme-tb hme-grow-btn" ?disabled=${placeable === 0}
            title=${placeable === 0 ? "Link this floor's rooms to Home Assistant areas first (a room's Area, in its card)" : "Each goes into the room linked to its area, at a good height for its kind"}
            @click=${() => this.devices.placeAll(ctx, groups.flatMap((g) => g.devices))}>Place all ${placeable} by area</button>
          ${more <= 0 ? nothing : html`<button type="button" class="hme-tb" aria-expanded=${this.trayOpen ? "true" : "false"}
            @click=${() => { this.trayOpen = !this.trayOpen; ctx.redraw(); }}>${this.trayOpen ? "Fewer" : `${more} more`}</button>`}
        </div>
        <p class="hme-foot">Drag a device onto the plan to place it, or click it to put it in its area's room.</p>`}`,
      String(tray), "hme-tray");
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    if (ctx.walls !== undefined) return this.shape.overlay(ctx);
    return svg`${this.arrange.overlay(ctx)}${this.shape.armed ? this.shape.ghost(ctx) : nothing}${this.devices.overlay(ctx)}`;
  }

  drawsPins(ctx: HomeMapEditorContext): boolean {
    return ctx.walls === undefined;
  }

  /** A press: with the lamp chooser open, it closes it and nothing more; a
   * tool's while one is out; else what is on top, the picked room's or
   * thing's handles first, then the picked light's glow handle, a pin (a
   * light a lamp holds being its lamp), with Shift off a pin the box that
   * picks pins, a thing, a room. */
  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (this.devices.choosing) {
      this.devices.cancelChooser(ctx);
      return true;
    }
    if (ctx.walls !== undefined) return this.shape.pointerDown(ctx, e, at);
    if (this.arrange.draw.active) return this.arrange.draw.pointerDown(ctx, e, at);
    if (this.shape.armed) return this.shape.pointerDown(ctx, e, at);
    if (e.button !== 0) return false;
    if (this.arrange.pressHandle(ctx, e, at) || this.devices.pressHandle(ctx, e, at)) return true;
    const lamp = this.devices.heldLampAt(ctx, at);
    if (lamp !== undefined && this.arrange.pressThing(ctx, e, lamp, at)) return true;
    return this.devices.pressPin(ctx, e, at)
      || this.devices.pressBox(ctx, e, at)
      || this.arrange.pressBody(ctx, e, at);
  }

  /** A double-click on a room edits its walls; on a pin, or while a tool
   * is out, it does nothing more than its two clicks. */
  doubleClick(ctx: HomeMapEditorContext, _e: MouseEvent, at: HomePoint): void {
    if (this.arrange.draw.active || this.shape.armed) return;
    if (ctx.walls === undefined && this.devices.onPin(ctx, at)) return;
    const room = homeRoomUnder(ctx.floor, at);
    if (room === undefined || sameHomeMapId(room.id, ctx.walls)) return;
    ctx.editWalls(room.id);
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    if (ctx.walls === undefined) this.arrange.hover(ctx, at);
    this.shape.hover(ctx, at);
  }

  /** A tool's letter picks it; Escape puts a tool down, leaves a room's
   * walls, or goes from a thing back to its room; the rest is the picked
   * thing's (Delete, the arrows). */
  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.devices.chooserKey(ctx, e)) return true;
    const shortcut = homeMapShortcut(e, false);
    const letter = typeof shortcut === "object" && "letter" in shortcut ? shortcut.letter : undefined;
    if (letter === "m") {
      this.setTool(ctx, "measure");
      return true;
    }
    if (ctx.walls !== undefined) {
      if (this.shape.keyDown(ctx, e)) return true;
      if (shortcut === "cancel") {
        ctx.editWalls(undefined);
        return true;
      }
      return false;
    }
    if (this.arrange.draw.active && this.arrange.draw.keyDown(ctx, e)) return true;
    const tool = letter === undefined ? undefined : homeMapEditToolFor(letter);
    if (tool !== undefined) {
      this.setTool(ctx, tool);
      return true;
    }
    if (shortcut === "cancel" && this.shape.armed) {
      this.setTool(ctx, "pick");
      return true;
    }
    return this.picksPins(ctx) ? this.devices.keyDown(ctx, e) : this.arrange.keyDown(ctx, e);
  }

  cursor(ctx: HomeMapEditorContext): string | undefined {
    if (ctx.walls !== undefined) return this.shape.cursor();
    return this.arrange.draw.active || this.shape.armed ? "crosshair" : undefined;
  }

  leave(ctx: HomeMapEditorContext): void {
    this.arrange.leave(ctx);
    this.devices.leave();
    this.shape.leave(ctx);
  }

  dock(ctx: HomeMapEditorContext): TemplateResult {
    if (ctx.walls !== undefined) return this.shape.dock(ctx);
    return html`${this.arrange.dock(ctx)}<span class="hme-vsep"></span>${this.devices.dock(ctx)}`;
  }

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (ctx.walls !== undefined || this.shape.armed) return this.shape.pill(ctx);
    if (this.arrange.draw.active) return this.arrange.pill(ctx);
    return this.picksPins(ctx) ? this.devices.pill(ctx) : this.arrange.pill(ctx);
  }

  /** While a room's walls are edited: which room, and Done. */
  banner(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const room = this.wallsRoom(ctx);
    if (room === undefined) return nothing;
    return html`<span class="hme-banner-t">Editing the walls of <b>${homeMapRoomName(room)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${() => ctx.editWalls(undefined)}>Done <kbd>Esc</kbd></button>`;
  }

  private wallsRoom(ctx: HomeMapEditorContext): HomeMapRoom | undefined {
    return ctx.walls === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, ctx.walls));
  }

  /** The tool rail, the side view of the picked device, and a line on how
   * the stage works. */
  stageExtra(ctx: HomeMapEditorContext): TemplateResult {
    const side = ctx.walls === undefined ? this.devices.stageExtra(ctx) : nothing;
    const hint = ctx.walls !== undefined ? "Drag a corner · drag a wall's middle to add a corner · Esc when done"
      : "Click picks what is on top · Double-click a room to edit its walls";
    return html`${this.toolRail(ctx)}${side}
      ${side === nothing && ctx.stage.width >= 900 ? html`<div class="hme-stage-hint">${hint}</div>` : nothing}`;
  }

  /** The tools, floating on the left of the plan, each with its key. */
  private toolRail(ctx: HomeMapEditorContext): TemplateResult {
    const on = this.tool(ctx);
    const walls = ctx.walls !== undefined;
    const tools: { id: HomeMapEditTool | HomeMapShapeTool; label: string; key: string }[] = walls
      ? [...HOME_MAP_SHAPE_TOOLS, { id: "measure", label: "Measure", key: "m" }]
      : [...HOME_MAP_EDIT_TOOLS];
    // A line after the first tool, and before the last two (Add furniture
    // and Measure; Way through, Stairs and Measure keep with the rest).
    const lineAfter = new Set(walls ? [0] : [0, 4]);
    return html`<div class="hme-toolrail" role="toolbar" aria-label=${walls ? "Wall tools" : "Tools"} aria-orientation="vertical">
      ${tools.map((t, i) => html`<button type="button" class="hme-rtool ${on === t.id ? "on" : ""}" aria-pressed=${on === t.id ? "true" : "false"}
          aria-label=${t.label} title=${`${t.label} (${t.key.toUpperCase()})`} @click=${() => this.setTool(ctx, t.id)}>
          ${toolIcon(t.id)}<kbd>${t.key.toUpperCase()}</kbd></button>
        ${lineAfter.has(i) ? html`<span class="hme-rtool-sep" aria-hidden="true"></span>` : nothing}`)}
    </div>`;
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (ctx.walls !== undefined) {
      return html`${this.shape.inspector(ctx)}
        ${hmeCard("Leave this", html`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`;
    }
    if (this.picksPins(ctx)) return this.devices.inspector(ctx);
    // A lamp's light first, then the lamp's own cards.
    const sel = ctx.selection;
    const lamp = sel?.kind === "object" ? this.devices.lampCards(ctx, sel.roomId, sel.object) : nothing;
    return lamp === nothing ? this.arrange.inspector(ctx) : html`${lamp}${this.arrange.inspector(ctx)}`;
  }

  /** The furniture picker, or the lamp chooser (its scrim clear, and its
   * keys reaching the page as well as its own, so Enter and Escape work
   * wherever the focus is). */
  sheet(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const chooser = this.devices.lampChooser(ctx);
    return chooser === nothing ? this.arrange.sheet(ctx) : chooser;
  }

  dragOver(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean {
    return ctx.walls === undefined && this.devices.dragOver(ctx, at, e);
  }

  drop(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void {
    if (ctx.walls === undefined) this.devices.drop(ctx, at, e);
  }

  /** Draw a room by hand, as R does (the empty floor's button). */
  startDrawing(ctx: HomeMapEditorContext): void {
    this.setTool(ctx, "draw");
  }
}

/** A tool's small picture on the tool rail. */
function toolIcon(tool: HomeMapEditTool | HomeMapShapeTool): TemplateResult {
  switch (tool) {
    case "pick":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;
    case "draw":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;
    case "furniture":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 8h14v6H2zM4 4h10v4H4zM3 14v2M15 14v2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;
    case "measure":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;
    default:
      return homeMapShapeToolIcon(tool);
  }
}
