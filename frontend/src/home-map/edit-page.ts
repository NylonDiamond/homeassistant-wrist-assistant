// The map editor's one edit page (mock boards A and B, and G for the side
// panel): no modes, one place to arrange the rooms, their things and the
// devices, and a room's walls edited in place.
//
// Editing the floor (board A). A click picks what is on top: a device pin
// first, then a thing (a sofa, a TV, a desk), then the room under them, and
// a drag moves what it picked (`mode-devices.ts` for pins, `mode-arrange.ts`
// for things and rooms, each keeping all its own gestures: the room's and
// thing's handles, snapping, Shift, Cmd or Ctrl and a click picking several
// pins, Cmd or Ctrl and a click picking several things in any rooms, Shift
// and a drag picking every pin in a box, the light's glow ring, the side
// view, the keys). The handles of what is picked lie over everything.
//
// The side panel, on the left of the stage, and the pill follow what is
// picked. Nothing picked: Start here, three steps each done, the one to do
// now, or next (Rooms, Furniture, and Lights in lamps, whose button picks
// the lights no lamp holds), then the floor's card and one folded line of
// keys and tips. A room: its head, In this room (its lamps and lights, its
// furniture, its devices, each row picking its thing, tinting it on the
// plan and in 3D while the pointer is over it, a thing's eye hiding or
// showing it) with Add to the room, then the room's own cards
// (`mode-arrange.ts`). A thing, a lamp, a pin or several: their cards as
// before. Devices and furniture come onto the map through the page's Add
// dialog, which the shell opens (`ctx.openAdd`).
//
// A tool rail floats on the left of the plan, each tool's name under its
// picture and its key in its title: Pick V, Room R, Wall W, Door D, Window N
// and Measure M; F opens Add on its furniture. Wall, Door and Window work on
// any room's walls, and once placed go into that room's wall editing with
// the new wall or opening picked. A light a lamp holds is one thing with its
// lamp: a press on its pin picks the lamp and drags it, and the lamp's
// cards start with the light's (`mode-devices.ts`). Adding a light opens the
// lamp chooser over the page, by the spot.
//
// The dock under the plan holds Snap and the View menu's switches (the
// grid, the side view, every pin's name; the shell adds Live states).
//
// Editing a room's walls (board B), entered by a double-click on a room on
// the plan: the other rooms dim and its corners, walls and openings take the
// presses (`mode-shape.ts`, its whole stage, side panel and dock, held to
// that room). A blue bar across the top of the stage says so, with Done;
// Escape, Done or a click outside the room go back with the room picked. The
// tool rail then holds the wall tools (Corners V, Split S, Wall W, Door D,
// Window N, Opening O, Stairs T, and Measure M), and the side panel the
// picked wall's or opening's cards, the room's walls with what is on each,
// the scan check and the scan as it was.
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { homeMapPickOf, homeMapPickedPins } from "./devices-model.js";
import { homeMapHeldLights } from "./edit-ops.js";
import type { HomeMapEditorContext, HomeMapPart, HomeMapViewItem } from "./editor-mode.js";
import { hmeCard } from "./editor-parts.js";
import { homeMapCount, homeMapShortcut, homeMapUndoKey } from "./editor-view.js";
import { homeMapPiece } from "./furniture.js";
import { homeRoomUnder } from "./geometry.js";
import { ArrangeMode } from "./mode-arrange.js";
import { DevicesMode } from "./mode-devices.js";
import { HOME_MAP_SHAPE_TOOLS, type HomeMapShapeTool, ShapeMode, homeMapShapeToolIcon } from "./mode-shape.js";
import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapFloorName, homeMapRoomName, sameHomeMapId } from "./model.js";

/** The edit page's tools, on its tool rail. */
export type HomeMapEditTool = "pick" | "draw" | "inner" | "door" | "window" | "measure";

/** The edit page's tools in the tool rail's order: the name under each
 * picture, the longer words of its title and the key that picks it. Undo
 * and redo (Cmd or Ctrl Z) and the zoom keys stay as they are. */
export const HOME_MAP_EDIT_TOOLS: readonly { id: HomeMapEditTool; name: string; label: string; key: string }[] = [
  { id: "pick", name: "Pick", label: "Pick and move", key: "v" },
  { id: "draw", name: "Room", label: "Draw a room", key: "r" },
  { id: "inner", name: "Wall", label: "Inner wall", key: "w" },
  { id: "door", name: "Door", label: "Door", key: "d" },
  { id: "window", name: "Window", label: "Window", key: "n" },
  { id: "measure", name: "Measure", label: "Measure", key: "m" },
];

/** The name under each wall tool's picture. */
const SHAPE_TOOL_NAMES: Readonly<Record<HomeMapShapeTool, string>> = {
  select: "Corners",
  split: "Split",
  inner: "Wall",
  door: "Door",
  window: "Window",
  opening: "Opening",
  stairs: "Stairs",
};

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
  const held = homeMapHeldLights(floor);
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

  /** The tool the rail shows as on. */
  tool(ctx: HomeMapEditorContext): HomeMapEditTool | HomeMapShapeTool {
    if (ctx.toggles.measure) return "measure";
    if (ctx.walls !== undefined) return this.shape.tool;
    if (this.arrange.draw.active) return "draw";
    const t = this.shape.tool;
    return t === "inner" || t === "door" || t === "window" ? t : "pick";
  }

  /** Pick a tool from the tool rail, or by its key. Measure goes on or
   * off; any other tool puts the last one down. */
  setTool(ctx: HomeMapEditorContext, tool: HomeMapEditTool | HomeMapShapeTool): void {
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

  /** A tool's letter picks it; F opens Add on its furniture; Escape puts a
   * tool down, leaves a room's walls, or goes from a thing back to its
   * room; the rest is the picked thing's (Delete, the arrows). */
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

  /** Snap: rooms to the walls round them, or a room's corners to 90°. */
  dock(ctx: HomeMapEditorContext): TemplateResult {
    return ctx.walls !== undefined ? this.shape.dock(ctx) : this.arrange.dock(ctx);
  }

  /** The View menu: the grid and, while a room's walls are edited, the
   * scan as it was; else also the side view and every pin's name. */
  viewItems(ctx: HomeMapEditorContext): HomeMapViewItem[] {
    return ctx.walls !== undefined ? this.shape.viewItems(ctx) : [...this.arrange.viewItems(ctx), ...this.devices.viewItems(ctx)];
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

  /** The tools, floating on the left of the plan, each with its name under
   * its picture and its key in its title. */
  private toolRail(ctx: HomeMapEditorContext): TemplateResult {
    const on = this.tool(ctx);
    const walls = ctx.walls !== undefined;
    const tools: { id: HomeMapEditTool | HomeMapShapeTool; name: string; label: string; key: string }[] = walls
      ? [...HOME_MAP_SHAPE_TOOLS.map((t) => ({ ...t, name: SHAPE_TOOL_NAMES[t.id] })), { id: "measure", name: "Measure", label: "Measure", key: "m" }]
      : [...HOME_MAP_EDIT_TOOLS];
    // A line after the first tool, and before Measure (Way through, Stairs
    // and Measure keep with the rest).
    const lineAfter = new Set(walls ? [0] : [0, 4]);
    return html`<div class="hme-toolrail" role="toolbar" aria-label=${walls ? "Wall tools" : "Tools"} aria-orientation="vertical">
      ${tools.map((t, i) => html`<button type="button" class="hme-rtool ${on === t.id ? "on" : ""}" aria-pressed=${on === t.id ? "true" : "false"}
          aria-label=${t.label} title=${`${t.label} (${t.key.toUpperCase()})`} @click=${() => this.setTool(ctx, t.id)}>
          ${toolIcon(t.id)}<span class="hme-rtool-name">${t.name}</span></button>
        ${lineAfter.has(i) ? html`<span class="hme-rtool-sep" aria-hidden="true"></span>` : nothing}`)}
    </div>`;
  }

  // ── the side panel ─────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (ctx.walls !== undefined) {
      return html`${this.shape.inspector(ctx)}
        ${this.shape.rail(ctx)}
        ${hmeCard("Leave this", html`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`;
    }
    if (this.picksPins(ctx)) return this.devices.inspector(ctx);
    const sel = ctx.selection;
    if (sel === undefined) return this.startPanel(ctx);
    // A lamp's light first, then the lamp's own cards.
    const lamp = sel.kind === "object" ? this.devices.lampCards(ctx, sel.roomId, sel.object) : nothing;
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
          <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Double-click a room to edit its walls, doors and windows.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Drag a device from Add onto the plan to place it.</p>
          <dl class="hme-keys">
            ${KEYS.map(([k, what]) => html`<dt><kbd>${k}</kbd></dt><dd>${what}</dd>`)}
            <dt><kbd>${homeMapUndoKey()}</kbd></dt><dd>Undo</dd>
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

/** The keys Keys and tips lists, after the tools' own. */
const KEYS: readonly [string, string][] = [
  ["V", "Pick and move"],
  ["R", "Draw a room"],
  ["W", "Inner wall"],
  ["D", "Door"],
  ["N", "Window"],
  ["M", "Measure"],
  ["F", "Add furniture"],
  ["Delete", "Remove what is picked"],
  ["Arrows", "Nudge it (Shift for bigger steps)"],
  ["Esc", "Back out: a tool, a thing to its room, a room's walls"],
  ["Space", "Hold and drag to pan"],
  ["+ −", "Zoom"],
  ["0", "Fit the floor"],
];

/** A tool's small picture on the tool rail. */
function toolIcon(tool: HomeMapEditTool | HomeMapShapeTool): TemplateResult {
  switch (tool) {
    case "pick":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;
    case "draw":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;
    case "measure":
      return html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;
    default:
      return homeMapShapeToolIcon(tool);
  }
}
