// The map editor's Arrange mode (mock board 1): put the rooms where they
// stand. The left rail lists the floor's rooms as layers (each with its
// size, and the picked one open on its doors, windows, things and devices),
// the other floors, and Draw a room by hand. On the stage a room is dragged
// to move it, snapping to the walls of the rooms round it with a pink guide
// and a label saying what it lined up with (Alt moves it freely, the grid
// moves it in 10 cm steps), turned by the round handle above its box, and
// shows its two sizes. The eight square handles on its box resize it along
// its own walls (`resizeRoom`, a stretch of everything in it): a side
// handle moves that side, a corner its two, the opposite sides staying put;
// the dragged sides snap to the neighbours' walls with the same pink guide,
// the sizes show live and the grid sizes it in 10 cm steps. While resizing,
// Shift keeps its proportions, Alt resizes it about its middle (both sides
// move, so nothing snaps, as Alt moves a room freely) and Cmd or Ctrl turns
// the snapping off for a one sided resize. The pill turns it a quarter,
// squares its corners, snaps it to the walls the iPhone's way, moves it to
// another floor or deletes it. The inspector holds the room's name, Home
// Assistant area and the page a tap opens; where it is (left and top, its
// turn, its width and depth, its floor, its wall height); its floor finish;
// and the things in it, each shown or hidden, with its devices and Add a
// thing.
//
// A thing (a sofa, a TV, a desk) is picked by a click on it inside the
// picked room, by Cmd or Ctrl and a click in any room, or by its name in the
// lists. Picked, it has the same box as a room: dragged to move it (a side
// that runs along a wall of its room snaps flush against it, Alt moves it
// freely, the grid moves its middle in 10 cm steps), the square handles
// resize it along its own sides (Shift and Alt as for a room) and the round
// one turns it. Arrow keys nudge it, Delete removes it and Escape goes back
// to its room. Its inspector holds where its middle is, its turn, its width,
// depth and height, and whether it is shown.
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import {
  type HomeMapObjectResize,
  type HomeMapResize,
  type HomeMapResizeSides,
  type HomeMapSnapGuide,
  HOME_MAP_MAX_OBJECT_SIZE,
  HOME_MAP_MAX_ROOM_SIZE,
  HOME_MAP_MIN_OBJECT_SIZE,
  HOME_MAP_MIN_ROOM_SIZE,
  HOME_MAP_OBJECT_KINDS,
  addObject,
  deleteRoom,
  homeMapLevelTurn,
  homeMapObjectAxes,
  homeMapPinsOfRoom,
  homeMapRoomFrame,
  levelObject,
  levelRoom,
  moveObject,
  moveRoom,
  moveRoomToFloor,
  removeObject,
  resizeObject,
  renameFloor,
  renameRoom,
  resizeRoom,
  setObjectHidden,
  setRoomArea,
  setRoomFinish,
  setRoomPage,
  setObject,
  setWallHeight,
  snapObject,
  snapRoom,
  snapRoomResize,
  snapRoomToWalls,
  squareCorners,
  turnObject,
  turnRoom,
} from "./edit-ops.js";
import { HOME_MAP_ARRANGE_GRID, HomeMapDrawTool } from "./draw-tool.js";
import { type HomeMapEditorContext, type HomeMapMode, homeMapSelectionRoom } from "./editor-mode.js";
import {
  HME_FINISH_DOT,
  hmeCard,
  hmeChip,
  hmeFields,
  hmeFinishSwatch,
  hmeGroup,
  hmeHint,
  hmeMenuButton,
  hmeNumber,
  hmePic,
  hmeRoomThumb,
  hmeRow,
  hmeSelect,
  hmeText,
} from "./editor-parts.js";
import {
  homeMapCount,
  homeMapObjectName,
  homeMapOpeningName,
  homeMapRoomBox,
  homeMapRoomSize,
  homeMapRoomSizeText,
  homeMapShortcut,
  homeMapUndoKey,
} from "./editor-view.js";
import {
  type HomeFloorKind,
  homeBoxCorners,
  homeBoxOf,
  homeFloorGuess,
  homeFloorKind,
  homeLabelPoint,
  homeNormalDegrees,
  homePointBounds,
  homePolygonArea,
  homePolygonHolds,
  homeRoomUnder,
} from "./geometry.js";
import {
  type HomeMapDocument,
  type HomeMapFinish,
  type HomeMapFloor,
  type HomeMapObject,
  type HomeMapRoom,
  type HomePoint,
  HOME_MAP_FINISHES,
  homeMapFloorName,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapLitRooms,
  homeMapPinName,
  homeMapRoomCenter,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";

/** A finish's name. */
export const HOME_MAP_FINISH_NAMES: Readonly<Record<HomeFloorKind, string>> = {
  wood: "Wood",
  tile: "Tile",
  stone: "Stone",
  carpet: "Carpet",
  plain: "Plain",
};

/** A turn handle snaps to this many degrees unless Alt is held. */
const TURN_STEP = 15;

/** The sides of a room's box each of its eight handles drags, in the order
 * the box draws them: a corner, then the middle of the side after it,
 * going round from the corner at a0, c0 (`homeMapRoomFrame`). */
const RESIZE_HANDLES: readonly HomeMapResizeSides[] = [
  { a: 0, c: 0 }, { c: 0 },
  { a: 1, c: 0 }, { a: 1 },
  { a: 1, c: 1 }, { c: 1 },
  { a: 0, c: 1 }, { a: 0 },
];

/** The resize cursor for a handle that lies `dx`, `dy` stage pixels from
 * the box's middle. */
function resizeCursor(dx: number, dy: number): string {
  const degrees = ((Math.atan2(dy, dx) * 180) / Math.PI + 180) % 180;
  return ["ew-resize", "nwse-resize", "ns-resize", "nesw-resize"][Math.round(degrees / 45) % 4]!;
}

/** The question before a room is deleted. */
export function homeMapDeleteRoomText(room: HomeMapRoom, devices: number): string {
  const these = devices === 0 ? "" : ` Its ${homeMapCount(devices, "device")} come${devices === 1 ? "s" : ""} off the map too.`;
  return `${homeMapRoomName(room)} comes off the map.${these} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`;
}

/** A thing as the editor finds it: its room and its place in that room's
 * list, which is how a selection names it. */
interface ThingAt {
  room: HomeMapRoom;
  index: number;
  object: HomeMapObject;
}

/** A thing's turn as the inspector shows it, -180 to 180. */
function thingTurn(object: HomeMapObject): number {
  return Math.round(homeNormalDegrees(object.turn) * 10) / 10;
}

const fmt = (v: number) => v.toFixed(1);
const pt = (p: readonly number[]) => `${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`;

export class ArrangeMode implements HomeMapMode {
  readonly id = "arrange" as const;
  readonly draw = new HomeMapDrawTool(HOME_MAP_ARRANGE_GRID);
  /** What the layers list is filtered by. */
  query = "";
  /** The open parts of the picked room's layer: things, devices. */
  private open = new Set<string>();
  /** The snap lines while a room is dragged, whether a drag is on, and
   * whether that drag resizes it (its sizes then stay on show). */
  private guides: HomeMapSnapGuide[] = [];
  private dragging = false;
  private resizing = false;

  /** A drag is over, let go or dropped: no guides, the handles and the
   * sizes back as before it, and the plan without its preview. */
  private stopDrag(ctx: HomeMapEditorContext): void {
    this.guides = [];
    this.dragging = false;
    this.resizing = false;
    ctx.preview(undefined);
  }

  private focus(ctx: HomeMapEditorContext): HomeMapRoom | undefined {
    const id = homeMapSelectionRoom(ctx.selection);
    return id === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  }

  /** The picked thing, its room and its place in the room's list. */
  private picked(ctx: HomeMapEditorContext): ThingAt | undefined {
    const sel = ctx.selection;
    if (sel?.kind !== "object") return undefined;
    const room = this.focus(ctx);
    const object = room?.objects[sel.object];
    return room === undefined || object === undefined ? undefined : { room, index: sel.object, object };
  }

  /** The shown thing under `at`, the smallest where several overlap (a
   * chair over a table): in `room`, or in any room on the floor. */
  private thingUnder(ctx: HomeMapEditorContext, at: HomePoint, room: HomeMapRoom | undefined): ThingAt | undefined {
    let best: { thing: ThingAt; area: number } | undefined;
    for (const r of room === undefined ? ctx.floor.rooms : [room]) {
      r.objects.forEach((object, index) => {
        if (object.hidden === true) return;
        const corners = homeBoxCorners(homeBoxOf(object));
        if (!homePolygonHolds(corners, at)) return;
        const area = Math.abs(homePolygonArea(corners));
        if (best === undefined || area < best.area) best = { thing: { room: r, index, object }, area };
      });
    }
    return best?.thing;
  }

  private pickThing(ctx: HomeMapEditorContext, room: HomeMapRoom, index: number): void {
    ctx.select({ kind: "object", roomId: room.id, object: index });
  }

  // ── the rail ───────────────────────────────────────────────────────────

  rail(ctx: HomeMapEditorContext): TemplateResult {
    const floor = ctx.floor;
    const q = this.query.trim().toLowerCase();
    const rooms = floor.rooms.filter((r) => q === "" || homeMapRoomName(r).toLowerCase().includes(q));
    const found = q === "" ? [] : floor.pins.filter((p) => homeMapPinName(p, ctx.hass).toLowerCase().includes(q) || p.entityId.includes(q));
    const others = ctx.doc.floors.filter((f) => !sameHomeMapId(f.id, floor.id));
    const focus = this.focus(ctx);
    return html`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${live(this.query)}
          @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${homeMapFloorName(floor)}<span class="hme-h-end">${homeMapCount(floor.rooms.length, "room")}</span></div>
        ${rooms.map((room) => this.layer(ctx, room, focus !== undefined && sameHomeMapId(focus.id, room.id)))}
        ${rooms.length === 0 ? html`<p class="hme-empty-line">${q === "" ? "No rooms on this floor yet." : "No room by that name."}</p>` : nothing}
        ${found.length > 0 ? html`<div class="hme-sep"></div>${found.map((p) => html`<button type="button" class="hme-lay"
            @click=${() => ctx.setMode("devices", { kind: "pin", pinId: p.id })}><span class="hme-dot dev"></span>${homeMapPinName(p, ctx.hass)}<span class="n">Device</span></button>`)}` : nothing}
        ${others.length > 0 ? html`<div class="hme-sep"></div>${others.map((f) => html`<button type="button" class="hme-lay dim"
            @click=${() => ctx.setFloor(f.id)}>▸ ${homeMapFloorName(f)}<span class="n">${homeMapCount(f.rooms.length, "room")}</span></button>`)}` : nothing}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active ? "on" : ""}" @click=${() => (this.draw.active ? this.draw.stop(ctx) : this.draw.start(ctx))}>
        ${this.draw.active ? "Stop drawing" : "＋ Draw a room by hand"}</button>
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`;
  }

  private layer(ctx: HomeMapEditorContext, room: HomeMapRoom, on: boolean): TemplateResult {
    const row = html`<button type="button" class="hme-lay ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
      @click=${() => ctx.select({ kind: "room", roomId: room.id })}>
      <span class="hme-dot" style=${`background:${HME_FINISH_DOT[homeFloorKind(room)]}`}></span>${homeMapRoomName(room)}<span class="n">${homeMapRoomSizeText(room)}</span></button>`;
    if (!on) return row;
    const doors = room.openings.map((o, i) => ({ o, i })).filter(({ o }) => o.kind !== "window");
    const windows = room.openings.map((o, i) => ({ o, i })).filter(({ o }) => o.kind === "window");
    const pins = homeMapPinsOfRoom(ctx.floor, room.id);
    const toggle = (key: string) => {
      if (this.open.has(key)) this.open.delete(key);
      else this.open.add(key);
      ctx.redraw();
    };
    const toShape = (index: number | undefined) => ctx.setMode("shape", index === undefined ? { kind: "room", roomId: room.id } : { kind: "opening", roomId: room.id, opening: index });
    return html`${row}
      <button type="button" class="hme-lay sub" @click=${() => toShape(doors[0]?.i)}>Doors and ways in<span class="n">${doors.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${() => toShape(windows[0]?.i)}>Windows<span class="n">${windows.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things") ? "true" : "false"} @click=${() => toggle("things")}>Things<span class="n">${room.objects.length}</span></button>
      ${this.open.has("things") ? room.objects.map((o, i) => html`<div class="hme-lay subsub ${this.picked(ctx)?.index === i ? "on" : ""}">
        <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${() => this.pickThing(ctx, room, i)}>${homeMapObjectName(o.kind)}</button>
        ${hmeChip({ on: o.hidden !== true, onText: "Shown", offText: "Hidden", label: `${homeMapObjectName(o.kind)} shown`, click: () => ctx.apply((d) => setObjectHidden(d, room.id, i, o.hidden !== true)) })}</div>`) : nothing}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices") ? "true" : "false"} @click=${() => toggle("devices")}>Devices<span class="n">${pins.length}</span></button>
      ${this.open.has("devices") ? pins.map((p) => html`<button type="button" class="hme-lay subsub" @click=${() => ctx.setMode("devices", { kind: "pin", pinId: p.id })}>${homeMapPinName(p, ctx.hass)}<span class="n">›</span></button>`) : nothing}`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    if (this.draw.active) return this.draw.overlay(ctx);
    const room = this.focus(ctx);
    const thing = this.picked(ctx);
    const parts: SVGTemplateResult[] = [];
    for (const guide of this.guides) parts.push(this.guide(ctx, guide));
    if (thing !== undefined) {
      // The thing's room stays outlined faintly, so it is plain whose it is.
      const outline = thing.room.outline.map((p) => pt(ctx.toScreen(p))).join(" ");
      parts.push(svg`<polygon points=${outline} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);
      const o = thing.object;
      parts.push(this.box(ctx, homeBoxCorners(homeBoxOf(o)), { width: o.size[0], depth: o.size[1] }, "thing", o.hidden === true));
    } else if (room !== undefined && room.outline.length >= 3) {
      parts.push(this.box(ctx, homeMapRoomBox(room), homeMapRoomSize(room), "room", false));
    }
    return parts.length === 0 ? nothing : svg`${parts}`;
  }

  /** The picked room's box along its walls, or the picked thing's box: its
   * resize handles, its turn handle and its two sizes (kept on show while it
   * is resized). `corners` go round from the one at the minus end of both
   * ways, the first side along its width. A hidden thing's box is dashed. */
  private box(ctx: HomeMapEditorContext, corners: readonly HomePoint[], size: { width: number; depth: number }, what: "room" | "thing", dashed: boolean): SVGTemplateResult {
    const box = corners.map((p) => ctx.toScreen(p));
    const centre = box.reduce<HomePoint>((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
    const mid = (i: number): HomePoint => [(box[i]![0] + box[(i + 1) % 4]![0]) / 2, (box[i]![1] + box[(i + 1) % 4]![1]) / 2];
    const out = (p: HomePoint): HomePoint => {
      const d = Math.max(Math.hypot(p[0] - centre[0], p[1] - centre[1]), 1e-6);
      return [(p[0] - centre[0]) / d, (p[1] - centre[1]) / d];
    };
    const handles = [0, 1, 2, 3].flatMap((i) => [box[i]!, mid(i)]);
    // The turn handle stands off the edge nearest the top of the screen.
    const topEdge = [0, 1, 2, 3].reduce((best, i) => (mid(i)[1] < mid(best)[1] ? i : best), 0);
    const tm = mid(topEdge);
    const to = out(tm);
    // Past the size tag that sits 20 px off the same edge.
    const knob: HomePoint = [tm[0] + to[0] * 44, tm[1] + to[1] * 44];
    const dims: SVGTemplateResult[] = [];
    // One measure along each way: on the edge facing up for the way that
    // runs across the screen, the edge facing left for the other.
    for (const pair of [[0, 2], [1, 3]] as const) {
      const [i, j] = pair;
      const across = Math.abs(box[(i + 1) % 4]![0] - box[i]![0]) >= Math.abs(box[(i + 1) % 4]![1] - box[i]![1]);
      const pick = across ? (out(mid(i))[1] <= out(mid(j))[1] ? i : j) : (out(mid(i))[0] <= out(mid(j))[0] ? i : j);
      const a = box[pick]!;
      const b = box[(pick + 1) % 4]!;
      const o = out(mid(pick));
      const a2: HomePoint = [a[0] + o[0] * 20, a[1] + o[1] * 20];
      const b2: HomePoint = [b[0] + o[0] * 20, b[1] + o[1] * 20];
      const m: HomePoint = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
      const length = pick % 2 === 0 ? size.width : size.depth;
      const t: HomePoint = [o[0] * 5, o[1] * 5];
      dims.push(svg`<path d=${`M${pt(a2)}L${pt(b2)}M${pt([a2[0] - t[0], a2[1] - t[1]])}L${pt([a2[0] + t[0], a2[1] + t[1]])}M${pt([b2[0] - t[0], b2[1] - t[1]])}L${pt([b2[0] + t[0], b2[1] + t[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${fmt(m[0] - 26)} y=${fmt(m[1] - 9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${fmt(m[0])} y=${fmt(m[1] + 4)} fill="#fff" text-anchor="middle">${length.toFixed(2)} m</text></g>`);
    }
    const resizeTip = what === "room"
      ? "Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping."
      : "Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";
    return svg`<g class="hme-box">
      <polygon points=${box.map(pt).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${dashed ? "5 4" : "none"} />
      ${this.resizing || !this.dragging ? dims : nothing}
      ${this.dragging ? nothing : svg`
        <line x1=${fmt(tm[0])} y1=${fmt(tm[1])} x2=${fmt(knob[0])} y2=${fmt(knob[1])} stroke="#5b8def" stroke-width="1.6" />
        ${handles.map((h, i) => svg`<rect data-hme="resize" data-handle=${i} x=${fmt(h[0] - 5)} y=${fmt(h[1] - 5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${resizeCursor(h[0] - centre[0], h[1] - centre[1])}`}>
          <title>${resizeTip}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${pt(knob)})`}>
          <title>${what === "room" ? "Drag to turn the room. Hold Alt to turn it freely." : "Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`;
  }

  /** A snap guide: the neighbour's wall line drawn long and pink, and what
   * the room lined up with. */
  private guide(ctx: HomeMapEditorContext, g: HomeMapSnapGuide): SVGTemplateResult {
    const a = ctx.toScreen(g.a);
    const b = ctx.toScreen(g.b);
    const d = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-6);
    const u: HomePoint = [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
    const a2: HomePoint = [a[0] - u[0] * 40, a[1] - u[1] * 40];
    const b2: HomePoint = [b[0] + u[0] * 40, b[1] + u[1] * 40];
    const other = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, g.roomId));
    const text = `Lined up with ${other === undefined ? "a" : homeMapRoomName(other)} wall`;
    const w = text.length * 6.2 + 20;
    return svg`<g class="hme-guide" pointer-events="none">
      <line x1=${fmt(a2[0])} y1=${fmt(a2[1])} x2=${fmt(b2[0])} y2=${fmt(b2[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${fmt(b2[0] + 6)} y=${fmt(b2[1] - 10)} width=${fmt(w)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${fmt(b2[0] + 6 + w / 2)} y=${fmt(b2[1] + 4)} fill="#fff" text-anchor="middle">${text}</text></g>
    </g>`;
  }

  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (this.draw.active) return this.draw.pointerDown(ctx, e, at);
    if (e.button !== 0) return false;
    const target = (e.target as Element | null)?.closest?.("[data-hme]");
    const hit = target?.getAttribute("data-hme");
    const focus = this.focus(ctx);
    const picked = this.picked(ctx);
    const sides = RESIZE_HANDLES[Number(target?.getAttribute("data-handle"))];
    if (picked !== undefined) {
      if (hit === "turn") {
        this.thingTurnDrag(ctx, e, picked, at);
        return true;
      }
      if (hit === "resize" && sides !== undefined) {
        this.thingResizeDrag(ctx, e, picked, sides, at);
        return true;
      }
    } else if (focus !== undefined) {
      if (hit === "turn") {
        this.turnDrag(ctx, e, focus, at);
        return true;
      }
      if (hit === "resize" && sides !== undefined) {
        this.resizeDrag(ctx, e, focus, sides, at);
        return true;
      }
    }
    // A thing is dragged at once beside a picked thing in its room, or with
    // Cmd or Ctrl in any room. In a picked room a drag still moves the room
    // and a click without one picks the thing under it.
    const command = e.metaKey || e.ctrlKey;
    const thing = command || picked !== undefined ? this.thingUnder(ctx, at, command ? undefined : picked?.room) : undefined;
    if (thing !== undefined) {
      this.pickThing(ctx, thing.room, thing.index);
      this.thingMoveDrag(ctx, e, thing, at);
      return true;
    }
    const room = homeRoomUnder(ctx.floor, at);
    if (room === undefined) return false;
    const inside = focus !== undefined && sameHomeMapId(focus.id, room.id) ? this.thingUnder(ctx, at, room) : undefined;
    ctx.select({ kind: "room", roomId: room.id });
    this.moveDrag(ctx, e, room, at, inside);
    return true;
  }

  /** Drag a room: snapping to its neighbours' walls unless Alt is held or
   * snapping is off, in grid steps while the grid is on. Saved on the drop
   * as one move from where it started; let go without a move, `thing` (the
   * thing under the press in an already picked room) is picked. */
  private moveDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, start: HomePoint, thing?: ThingAt): void {
    const startDoc = ctx.doc;
    const id = room.id;
    const corner = homePointBounds(room.outline);
    let delta: HomePoint = [0, 0];
    ctx.drag(e, {
      move: (p, ev) => {
        let dx = p[0] - start[0];
        let dy = p[1] - start[1];
        if (ctx.toggles.grid && corner !== undefined) {
          const g = HOME_MAP_ARRANGE_GRID;
          dx = Math.round((corner.minX + dx) / g) * g - corner.minX;
          dy = Math.round((corner.minY + dy) / g) * g - corner.minY;
        }
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey) {
          const snap = snapRoom(startDoc, id, dx, dy);
          if (snap !== undefined) {
            dx = snap.dx;
            dy = snap.dy;
            this.guides = snap.guides;
          }
        }
        this.dragging = true;
        delta = [dx, dy];
        ctx.preview((d) => moveRoom(d, id, dx, dy));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const [dx, dy] = delta;
        if (moved && (Math.abs(dx) >= 0.005 || Math.abs(dy) >= 0.005)) ctx.apply((d) => moveRoom(d, id, dx, dy), { select: { kind: "room", roomId: id } });
        else if (!moved && thing !== undefined) this.pickThing(ctx, thing.room, thing.index);
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a resize handle: the handle's `sides` of the room's box follow the
   * pointer along the room's own walls, the opposite sides staying put. The
   * grid sizes it in 10 cm steps; Shift keeps its proportions (the way that
   * changed most leads); Alt moves the opposite sides too, about its middle,
   * and does not snap; Cmd or Ctrl does not snap. Otherwise, with snapping
   * on, the dragged sides snap to the neighbours' walls. Saved on the drop
   * as one resize from where it started. */
  private resizeDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, sides: HomeMapResizeSides, start: HomePoint): void {
    const frame = homeMapRoomFrame(room);
    if (frame === undefined) return;
    const startDoc = ctx.doc;
    const id = room.id;
    const w0 = frame.a1 - frame.a0;
    const d0 = frame.c1 - frame.c0;
    if (w0 <= 1e-6 || d0 <= 1e-6) return;
    const along = (p: HomePoint) => p[0] * frame.u[0] + p[1] * frame.u[1];
    const across = (p: HomePoint) => p[0] * frame.v[0] + p[1] * frame.v[1];
    const fit = (v: number) => Math.min(Math.max(v, HOME_MAP_MIN_ROOM_SIZE), HOME_MAP_MAX_ROOM_SIZE);
    let last: HomeMapResize | undefined;
    ctx.drag(e, {
      move: (p, ev) => {
        const both = ev.altKey ? 2 : 1;
        let width = w0;
        let depth = d0;
        if (sides.a !== undefined) width = w0 + (along(p) - along(start)) * (sides.a === 1 ? 1 : -1) * both;
        if (sides.c !== undefined) depth = d0 + (across(p) - across(start)) * (sides.c === 1 ? 1 : -1) * both;
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          if (sides.a !== undefined) width = Math.round(width / g) * g;
          if (sides.c !== undefined) depth = Math.round(depth / g) * g;
        }
        width = fit(width);
        depth = fit(depth);
        if (ev.shiftKey) {
          const ka = width / w0;
          const kc = depth / d0;
          let k = sides.a === undefined ? kc : sides.c === undefined ? ka : Math.abs(Math.log(ka)) >= Math.abs(Math.log(kc)) ? ka : kc;
          k = Math.min(Math.max(k, HOME_MAP_MIN_ROOM_SIZE / Math.min(w0, d0)), HOME_MAP_MAX_ROOM_SIZE / Math.max(w0, d0));
          width = w0 * k;
          depth = d0 * k;
        }
        const anchor: [number, number] = [
          ev.altKey || sides.a === undefined ? 0.5 : 1 - sides.a,
          ev.altKey || sides.c === undefined ? 0.5 : 1 - sides.c,
        ];
        let resize: HomeMapResize = { width, depth, anchor };
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
          const snap = snapRoomResize(startDoc, id, resize, sides, { proportional: ev.shiftKey });
          if (snap !== undefined) {
            resize = snap.resize;
            this.guides = snap.guides;
          }
        }
        this.dragging = true;
        this.resizing = true;
        last = resize;
        const made = resize;
        ctx.preview((d) => resizeRoom(d, id, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = last;
        if (!moved || made === undefined) return;
        if (Math.abs((made.width ?? w0) - w0) < 0.005 && Math.abs((made.depth ?? d0) - d0) < 0.005) return;
        ctx.apply((d) => resizeRoom(d, id, made), { select: { kind: "room", roomId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag the turn handle: the room turns round its middle, in 15 degree
   * steps unless Alt is held. */
  private turnDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, start: HomePoint): void {
    const id = room.id;
    const pivot = homeMapRoomCenter(room);
    const a0 = Math.atan2(start[1] - pivot[1], start[0] - pivot[0]);
    let turn = 0;
    ctx.drag(e, {
      move: (p, ev) => {
        let deg = ((Math.atan2(p[1] - pivot[1], p[0] - pivot[0]) - a0) * 180) / Math.PI;
        deg = ((deg + 540) % 360) - 180;
        if (!ev.altKey) deg = Math.round(deg / TURN_STEP) * TURN_STEP;
        this.dragging = true;
        turn = deg;
        ctx.preview((d) => turnRoom(d, id, deg, pivot));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        if (moved && Math.abs(turn) > 0.01) ctx.apply((d) => turnRoom(d, id, turn, pivot), { select: { kind: "room", roomId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing: its middle follows the pointer, in grid steps while the
   * grid is on, and a side that runs along a wall of its room snaps flush
   * against it unless Alt is held or snapping is off. Saved on the drop as
   * one move. */
  private thingMoveDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const from = object.c;
    let c: HomePoint = from;
    ctx.drag(e, {
      move: (p, ev) => {
        let next: HomePoint = [from[0] + p[0] - start[0], from[1] + p[1] - start[1]];
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          next = [Math.round(next[0] / g) * g, Math.round(next[1] / g) * g];
        }
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey) {
          const snap = snapObject(room, object, next);
          next = snap.c;
          this.guides = snap.guides;
        }
        this.dragging = true;
        c = next;
        const made = next;
        ctx.preview((d) => moveObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        if (moved && Math.hypot(c[0] - from[0], c[1] - from[1]) >= 0.005) {
          const made = c;
          ctx.apply((d) => moveObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
        }
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing's resize handle: the handle's `sides` of its box follow
   * the pointer along its own sides, the opposite sides staying put. The
   * grid sizes it in 10 cm steps; Shift keeps its proportions; Alt resizes
   * it about its middle. Saved on the drop as one resize. */
  private thingResizeDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, sides: HomeMapResizeSides, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const { u, v } = homeMapObjectAxes(object);
    const w0 = Math.max(object.size[0], HOME_MAP_MIN_OBJECT_SIZE);
    const d0 = Math.max(object.size[1], HOME_MAP_MIN_OBJECT_SIZE);
    const along = (p: HomePoint) => p[0] * u[0] + p[1] * u[1];
    const across = (p: HomePoint) => p[0] * v[0] + p[1] * v[1];
    const fit = (x: number) => Math.min(Math.max(x, HOME_MAP_MIN_OBJECT_SIZE), HOME_MAP_MAX_OBJECT_SIZE);
    let last: HomeMapObjectResize | undefined;
    ctx.drag(e, {
      move: (p, ev) => {
        const both = ev.altKey ? 2 : 1;
        let width = w0;
        let depth = d0;
        if (sides.a !== undefined) width = w0 + (along(p) - along(start)) * (sides.a === 1 ? 1 : -1) * both;
        if (sides.c !== undefined) depth = d0 + (across(p) - across(start)) * (sides.c === 1 ? 1 : -1) * both;
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          if (sides.a !== undefined) width = Math.round(width / g) * g;
          if (sides.c !== undefined) depth = Math.round(depth / g) * g;
        }
        width = fit(width);
        depth = fit(depth);
        if (ev.shiftKey) {
          const ka = width / w0;
          const kc = depth / d0;
          let k = sides.a === undefined ? kc : sides.c === undefined ? ka : Math.abs(Math.log(ka)) >= Math.abs(Math.log(kc)) ? ka : kc;
          k = Math.min(Math.max(k, HOME_MAP_MIN_OBJECT_SIZE / Math.min(w0, d0)), HOME_MAP_MAX_OBJECT_SIZE / Math.max(w0, d0));
          width = w0 * k;
          depth = d0 * k;
        }
        const anchor: [number, number] = [
          ev.altKey || sides.a === undefined ? 0.5 : 1 - sides.a,
          ev.altKey || sides.c === undefined ? 0.5 : 1 - sides.c,
        ];
        this.dragging = true;
        this.resizing = true;
        const made: HomeMapObjectResize = { width, depth, anchor };
        last = made;
        ctx.preview((d) => resizeObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = last;
        if (!moved || made === undefined) return;
        if (Math.abs((made.width ?? w0) - object.size[0]) < 0.005 && Math.abs((made.depth ?? d0) - object.size[1]) < 0.005) return;
        ctx.apply((d) => resizeObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing's turn handle: it turns about its middle, in 15 degree
   * steps unless Alt is held. */
  private thingTurnDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const pivot = object.c;
    const a0 = Math.atan2(start[1] - pivot[1], start[0] - pivot[0]);
    let turn = 0;
    ctx.drag(e, {
      move: (p, ev) => {
        let deg = ((Math.atan2(p[1] - pivot[1], p[0] - pivot[0]) - a0) * 180) / Math.PI;
        deg = ((deg + 540) % 360) - 180;
        if (!ev.altKey) deg = Math.round(deg / TURN_STEP) * TURN_STEP;
        this.dragging = true;
        // The plan's angles run the other way round from a thing's turn.
        turn = -deg;
        const made = turn;
        ctx.preview((d) => turnObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = turn;
        if (moved && Math.abs(made) > 0.01) ctx.apply((d) => turnObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    this.draw.hover(ctx, at);
  }

  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.draw.active) return this.draw.keyDown(ctx, e);
    const room = this.focus(ctx);
    if (room === undefined) return false;
    const shortcut = homeMapShortcut(e, false);
    const thing = this.picked(ctx);
    if (thing !== undefined) {
      const { index, object } = thing;
      const select = { kind: "room" as const, roomId: room.id };
      if (shortcut === "delete") {
        ctx.apply((d) => removeObject(d, room.id, index), { select });
        return true;
      }
      if (shortcut === "cancel") {
        ctx.select(select);
        return true;
      }
      if (typeof shortcut === "object" && "nudge" in shortcut) {
        const [dx, dy] = shortcut.nudge;
        ctx.apply((d) => moveObject(d, room.id, index, [object.c[0] + dx, object.c[1] + dy]));
        return true;
      }
      return false;
    }
    if (shortcut === "delete") {
      void this.askDelete(ctx, room);
      return true;
    }
    if (typeof shortcut === "object" && "nudge" in shortcut) {
      const [dx, dy] = shortcut.nudge;
      ctx.apply((d) => moveRoom(d, room.id, dx, dy));
      return true;
    }
    return false;
  }

  cursor(): string | undefined {
    return this.draw.active ? "crosshair" : undefined;
  }

  leave(ctx: HomeMapEditorContext): void {
    this.draw.stop(ctx);
    this.guides = [];
    this.dragging = false;
    this.resizing = false;
  }

  dock(ctx: HomeMapEditorContext): TemplateResult {
    return html`<button type="button" class="hme-tb ${ctx.toggles.snap ? "on" : ""}" aria-pressed=${ctx.toggles.snap ? "true" : "false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${() => ctx.setToggle("snap", !ctx.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${ctx.toggles.grid ? "on" : ""}" aria-pressed=${ctx.toggles.grid ? "true" : "false"}
        @click=${() => ctx.setToggle("grid", !ctx.toggles.grid)}>Grid 10 cm</button>`;
  }

  // ── the pill ───────────────────────────────────────────────────────────

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.draw.active) {
      return html`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length >= 3 ? html`<button type="button" class="hme-tb" @click=${() => void this.draw.finish(ctx)}>Close the room</button>` : nothing}
        <button type="button" class="hme-tb" @click=${() => this.draw.stop(ctx)}>Cancel</button>`;
    }
    const room = this.focus(ctx);
    if (room === undefined || this.dragging) return nothing;
    const id = room.id;
    const thing = this.picked(ctx);
    if (thing !== undefined) {
      const { index, object } = thing;
      return html`<span class="hme-pill-name">${homeMapObjectName(object.kind)}</span>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnObject(d, id, index, 90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${() => ctx.apply((d) => levelObject(d, id, index))}>Line up</button>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => setObjectHidden(d, id, index, object.hidden !== true))}>${object.hidden === true ? "Show" : "Hide"}</button>
        <button type="button" class="hme-tb" @click=${() => ctx.select({ kind: "room", roomId: id })}>${homeMapRoomName(room)} ›</button>
        <button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removeObject(d, id, index), { select: { kind: "room", roomId: id } })}>Remove</button>`;
    }
    return html`<span class="hme-pill-name">${homeMapRoomName(room)}</span>
      <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, 90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, id))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${() => ctx.apply((d) => snapRoomToWalls(d, id))}>Snap to walls</button>
      ${this.floorMenu(ctx, room, "Move to floor", "hme-tb")}
      <button type="button" class="hme-tb danger" @click=${() => void this.askDelete(ctx, room)}>Delete</button>`;
  }

  /** Move to floor: the other floors, and a new one. */
  private floorMenu(ctx: HomeMapEditorContext, room: HomeMapRoom, label: string, cls: string): TemplateResult {
    const others = ctx.doc.floors.filter((f) => !sameHomeMapId(f.id, ctx.floor.id));
    return hmeMenuButton({
      label,
      cls,
      options: [...others.map((f) => ({ value: f.id, label: homeMapFloorName(f) })), { value: "new", label: "New floor…" }],
      pick: (v) => void this.moveToFloor(ctx, room, v),
    });
  }

  private async moveToFloor(ctx: HomeMapEditorContext, room: HomeMapRoom, target: string): Promise<void> {
    const id = room.id;
    const select = { kind: "room" as const, roomId: id };
    if (target !== "new") {
      ctx.apply((d) => moveRoomToFloor(d, id, { floorId: target }), { select, floorId: target });
      return;
    }
    const story = Math.max(...ctx.doc.floors.map((f) => f.story)) + 1;
    const name = await ctx.ask({ title: "A new floor", label: "Name", value: story === 1 ? "Upstairs" : `Floor ${story + 1}`, ok: "Move the room there" });
    if (name === undefined) return;
    const floorId = ctx.newId();
    ctx.apply((d) => moveRoomToFloor(d, id, { newFloor: { id: floorId, name, story } }), { select, floorId });
  }

  private async askDelete(ctx: HomeMapEditorContext, room: HomeMapRoom): Promise<void> {
    const devices = homeMapPinsOfRoom(ctx.floor, room.id).length;
    const sure = await ctx.confirm({ title: `Delete ${homeMapRoomName(room)}?`, text: homeMapDeleteRoomText(room, devices), ok: "Delete room", danger: true });
    if (sure) ctx.apply((d) => deleteRoom(d, room.id), { select: null });
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult {
    const room = this.focus(ctx);
    if (room === undefined) return this.floorCard(ctx, ctx.floor);
    const thing = this.picked(ctx);
    if (thing !== undefined) return this.thingInspector(ctx, thing);
    const id = room.id;
    const size = homeMapRoomSize(room);
    const lit = homeMapLitRooms(ctx.floor, ctx.toggles.live ? ctx.hass?.states : undefined).has(room.id);
    const pins = homeMapPinsOfRoom(ctx.floor, id);
    const bounds = homePointBounds(room.outline) ?? { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    const tilt = Math.round(-homeMapLevelTurn(room) * 10) / 10;
    const areaKnown = room.areaId === undefined || ctx.areas.some((a) => a.id === room.areaId);
    const pageKnown = room.pageId === undefined || ctx.pages.some((p) => sameHomeMapId(p.id, room.pageId));
    const guess = homeFloorGuess(room);
    const edit = this.edits(ctx);
    return html`
      <section class="hme-card hme-head">
        ${hmeRoomThumb(room, lit)}
        <div class="hme-head-t">
          <strong>${homeMapRoomName(room)}</strong>
          <span>${homeMapFloorName(ctx.floor)} · ${homeMapRoomSizeText(room)} · ${size.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${hmeCard("Room", html`
        ${hmeRow("Name", hmeText({ value: room.name ?? "", label: "Name", placeholder: "Room", set: (v) => ctx.apply((d) => renameRoom(d, id, v)) }))}
        ${hmeRow("Area", hmeSelect({
          label: "Area",
          value: room.areaId ?? "",
          options: [
            { value: "", label: "None" },
            ...(areaKnown ? [] : [{ value: room.areaId!, label: `Not in Home Assistant (${room.areaId})`, disabled: true }]),
            ...ctx.areas.map((a) => ({ value: a.id, label: a.name })),
          ],
          set: (v) => ctx.apply((d) => setRoomArea(d, id, v === "" ? undefined : v)),
        }))}
        ${hmeHint("The Home Assistant area. Its devices show first in Devices.")}
        ${hmeRow("Tap opens", hmeSelect({
          label: "Tap opens",
          value: room.pageId ?? "",
          options: [
            { value: "", label: "Nothing" },
            ...(pageKnown ? [] : [{ value: room.pageId!, label: "A page not in your library", disabled: true }]),
            ...ctx.pages.map((p) => ({ value: p.id, label: `Page: ${p.name}` })),
          ],
          set: (v) => ctx.apply((d) => setRoomPage(d, id, v === "" ? undefined : v)),
        }))}
        ${hmeHint("What a tap on this room does on the map tiles and the watch.")}`)}

      ${hmeCard("Size", html`
        ${hmeFields(
          hmeNumber({ tag: "W", label: "Width", value: size.width, unit: "m", min: HOME_MAP_MIN_ROOM_SIZE, max: HOME_MAP_MAX_ROOM_SIZE, ...edit((d, v) => resizeRoom(d, id, { width: v })) }),
          hmeNumber({ tag: "D", label: "Depth", value: size.depth, unit: "m", min: HOME_MAP_MIN_ROOM_SIZE, max: HOME_MAP_MAX_ROOM_SIZE, ...edit((d, v) => resizeRoom(d, id, { depth: v })) }),
          hmeNumber({ tag: "H", label: "Wall height", value: room.height, unit: "m", min: 0.5, max: 20, ...edit((d, v) => setWallHeight(d, id, v)) }))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${hmeCard("Place", html`
        ${hmeGroup("Corner", hmeFields(
          hmeNumber({ tag: "X", label: "Left", value: bounds.minX, unit: "m", ...edit((d, v) => moveRoom(d, id, v - bounds.minX, 0)) }),
          hmeNumber({ tag: "Y", label: "Top", value: bounds.minY, unit: "m", ...edit((d, v) => moveRoom(d, id, 0, v - bounds.minY)) })))}
        ${hmeGroup("Turn", html`<div class="hme-turn">
          ${hmeNumber({ label: "Turn", value: tilt, unit: "°", digits: 1, min: -180, max: 180, ...edit((d, v) => turnRoom(d, id, v - tilt)) })}
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, -90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, 90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${() => ctx.apply((d) => levelRoom(d, id))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${hmeRow("Floor", hmeSelect({
          label: "Floor",
          value: ctx.floor.id,
          options: [...ctx.doc.floors.map((f) => ({ value: f.id, label: homeMapFloorName(f) })), { value: "new", label: "New floor…" }],
          set: (v) => void this.moveToFloor(ctx, room, v),
        }))}`)}

      ${hmeCard("Floor finish", html`<div class="hme-pics">
        ${hmePic({ label: `Auto: ${HOME_MAP_FINISH_NAMES[guess]}`, picture: hmeFinishSwatch(guess), on: room.finish === undefined, title: "Picked from the room's name and furniture", click: () => ctx.apply((d) => setRoomFinish(d, id, undefined)) })}
        ${HOME_MAP_FINISHES.map((f: HomeMapFinish) => hmePic({ label: HOME_MAP_FINISH_NAMES[f], picture: hmeFinishSwatch(f), on: room.finish === f, click: () => ctx.apply((d) => setRoomFinish(d, id, f)) }))}
      </div>`)}

      ${hmeCard("In this room", html`
        ${room.objects.length === 0 ? html`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>` : nothing}
        ${room.objects.map((o, i) => html`<div class="hme-r tight"><span class="hme-grow ${o.hidden === true ? "dim" : ""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${() => this.pickThing(ctx, room, i)}>${homeMapObjectName(o.kind)}</button></span>
          ${hmeChip({ on: o.hidden !== true, onText: "Shown", offText: "Hidden", label: `${homeMapObjectName(o.kind)} shown`, click: () => ctx.apply((d) => setObjectHidden(d, id, i, o.hidden !== true)) })}
          <button type="button" class="hme-x" aria-label=${`Remove ${homeMapObjectName(o.kind)}`} title="Remove" @click=${() => ctx.apply((d) => removeObject(d, id, i))}>×</button></div>`)}
        ${room.openings.length > 0 ? html`<div class="hme-r tight"><span class="hme-grow">${[...new Set(room.openings.map(homeMapOpeningName))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${() => ctx.setMode("shape", { kind: "room", roomId: id })}>Shape ›</button></div>` : nothing}
        <div class="hme-r tight"><span class="hme-grow">${pins.length === 0 ? "No devices" : pins.slice(0, 3).map((p) => homeMapPinName(p, ctx.hass)).join(", ") + (pins.length > 3 ? "…" : "")}</span>
          <button type="button" class="hme-link" @click=${() => ctx.setMode("devices", { kind: "room", roomId: id })}>${homeMapCount(pins.length, "device")} ›</button></div>
        <div class="hme-row-end">
          ${hmeMenuButton({
            label: "＋ Add a thing",
            cls: "hme-tb",
            options: HOME_MAP_OBJECT_KINDS.map((k) => ({ value: k, label: homeMapObjectName(k) })),
            pick: (kind) => {
              const at = homeLabelPoint(room) ?? homeMapRoomCenter(room);
              ctx.apply((d) => addObject(d, id, kind, at));
            },
          })}
          <button type="button" class="hme-tb danger push" @click=${() => void this.askDelete(ctx, room)}>Delete room</button>
        </div>`)}`;
  }

  /** A number field's `set` and `preview` for an edit by its value: saved
   * once when typed or let go, drawn as it goes while scrubbed. */
  private edits(ctx: HomeMapEditorContext) {
    return (op: (d: HomeMapDocument, v: number) => HomeMapDocument | undefined) => ({
      set: (v: number) => ctx.apply((d) => op(d, v)),
      preview: (v: number | undefined) => ctx.preview(v === undefined ? undefined : (d) => op(d, v)),
    });
  }

  /** A picked thing: where its middle is, its turn, its sizes, and whether
   * it is shown. */
  private thingInspector(ctx: HomeMapEditorContext, thing: ThingAt): TemplateResult {
    const { room, index, object } = thing;
    const id = room.id;
    const name = homeMapObjectName(object.kind);
    const [width, depth, height] = object.size;
    const turn = thingTurn(object);
    const edit = this.edits(ctx);
    const back = { kind: "room" as const, roomId: id };
    const sizes = { unit: "m", min: HOME_MAP_MIN_OBJECT_SIZE, max: HOME_MAP_MAX_OBJECT_SIZE };
    return html`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${name}</strong>
          <span>In ${homeMapRoomName(room)} · ${width.toFixed(2)} × ${depth.toFixed(2)} × ${height.toFixed(2)} m${(object.lift ?? 0) > 0 ? ` · ${(object.lift ?? 0).toFixed(2)} m up` : ""}${object.hidden === true ? " · Hidden" : ""}</span>
        </div>
      </section>

      ${hmeCard("Size", html`
        ${hmeFields(
          hmeNumber({ tag: "W", label: "Width", value: width, ...sizes, ...edit((d, v) => resizeObject(d, id, index, { width: v })) }),
          hmeNumber({ tag: "D", label: "Depth", value: depth, ...sizes, ...edit((d, v) => resizeObject(d, id, index, { depth: v })) }),
          hmeNumber({ tag: "H", label: "Height", value: height, ...sizes, min: 0.01, ...edit((d, v) => setObject(d, id, index, { size: [width, depth, v] })) }))}`)}

      ${hmeCard("Place", html`
        ${hmeGroup("Middle, and up off the floor", hmeFields(
          hmeNumber({ tag: "X", label: "Middle across", value: object.c[0], unit: "m", ...edit((d, v) => moveObject(d, id, index, [v, object.c[1]])) }),
          hmeNumber({ tag: "Y", label: "Middle down", value: object.c[1], unit: "m", ...edit((d, v) => moveObject(d, id, index, [object.c[0], v])) }),
          hmeNumber({ tag: "Z", label: "Up off the floor", value: object.lift ?? 0, unit: "m", min: 0, max: 100, ...edit((d, v) => setObject(d, id, index, { lift: v })) })))}
        ${hmeGroup("Turn", html`<div class="hme-turn">
          ${hmeNumber({ label: "Turn", value: turn, unit: "°", digits: 1, min: -180, max: 180, ...edit((d, v) => turnObject(d, id, index, v - turn)) })}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${() => ctx.apply((d) => turnObject(d, id, index, -90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${() => ctx.apply((d) => turnObject(d, id, index, 90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${() => ctx.apply((d) => levelObject(d, id, index))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${hmeCard("Show", html`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${hmeChip({ on: object.hidden !== true, onText: "Shown", offText: "Hidden", label: `${name} shown`, click: () => ctx.apply((d) => setObjectHidden(d, id, index, object.hidden !== true)) })}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${() => ctx.select(back)}>‹ ${homeMapRoomName(room)}</button>
          <button type="button" class="hme-tb danger push" @click=${() => ctx.apply((d) => removeObject(d, id, index), { select: back })}>Remove</button>
        </div>`)}`;
  }

  /** With no room picked: the floor itself. */
  private floorCard(ctx: HomeMapEditorContext, floor: HomeMapFloor): TemplateResult {
    const lights = homeMapLightsOn(floor, ctx.toggles.live ? ctx.hass?.states : undefined);
    return html`${hmeCard("Floor", html`
        ${hmeRow("Name", hmeText({ value: floor.name, label: "Floor name", placeholder: homeMapFloorName(floor), set: (v) => ctx.apply((d) => renameFloor(d, floor.id, v)) }))}
        ${hmeRow("On it", html`<span class="hme-val">${homeMapCount(floor.rooms.length, "room")} · ${homeMapCount(floor.pins.length, "device")} · ${homeMapLightsOnWords(lights)}</span>`)}`)}
      ${hmeCard("Arrange", html`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, resize it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${homeMapUndoKey()}.</p>
        <p class="hme-text dim">To move a thing in a room (a sofa, a TV, a desk), pick the room, then click the thing. Cmd or Ctrl and a click picks a thing in any room.</p>`)}`;
  }
}
