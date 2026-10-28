// Drawing a room by hand on the stage, shared by Arrange's "Draw a room by
// hand" and Shape's Draw a room tool: each click puts down a corner, a click
// on the first corner or Enter closes the room (3 corners at least), then
// the page asks its name and the room is added with walls along every edge
// (`drawRoom`). Backspace takes the last corner back, Escape stops.
//
// A corner lands on any room's corner within 10 pixels, else in line with
// the corner before it when nearly so (8 pixels), else on the grid when the
// grid is on. Points are snapped by `homeMapSnapPoint`, which Shape's other
// tools use as well.

import { type SVGTemplateResult, nothing, svg } from "lit";
import { drawRoom } from "./edit-ops.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import type { HomeMapFloor, HomePoint } from "./model.js";

/** A plan point as a tool puts it down: on a corner of the floor within
 * `reach` pixels, else in line with `from` (either way) within 8 pixels,
 * else on a `grid` of meters when given. */
export function homeMapSnapPoint(floor: HomeMapFloor, at: HomePoint, scale: number, opts: { from?: HomePoint; grid?: number; reach?: number; corners?: readonly HomePoint[] } = {}): HomePoint {
  const reach = (opts.reach ?? 10) / scale;
  let best: HomePoint | undefined;
  let bestD = reach;
  for (const p of [...floor.rooms.flatMap((r) => r.outline), ...(opts.corners ?? [])]) {
    const d = Math.hypot(p[0] - at[0], p[1] - at[1]);
    if (d <= bestD) {
      best = p;
      bestD = d;
    }
  }
  if (best !== undefined) return [best[0], best[1]];
  let [x, y] = at;
  if (opts.grid !== undefined && opts.grid > 0) {
    x = Math.round(x / opts.grid) * opts.grid;
    y = Math.round(y / opts.grid) * opts.grid;
  }
  if (opts.from !== undefined) {
    const line = 8 / scale;
    if (Math.abs(at[0] - opts.from[0]) <= line) x = opts.from[0];
    if (Math.abs(at[1] - opts.from[1]) <= line) y = opts.from[1];
  }
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

/** The grid a mode's points land on, in meters, while the grid is on. */
export const HOME_MAP_ARRANGE_GRID = 0.1;
export const HOME_MAP_SHAPE_GRID = 0.05;

export class HomeMapDrawTool {
  /** Whether the tool has the stage. */
  active = false;
  points: HomePoint[] = [];
  private hoverAt: HomePoint | undefined;

  constructor(private readonly grid: number) {}

  start(ctx: HomeMapEditorContext): void {
    this.active = true;
    this.points = [];
    this.hoverAt = undefined;
    ctx.select(undefined);
    ctx.redraw();
  }

  stop(ctx?: HomeMapEditorContext): void {
    this.active = false;
    this.points = [];
    this.hoverAt = undefined;
    ctx?.redraw();
  }

  private snap(ctx: HomeMapEditorContext, at: HomePoint): HomePoint {
    return homeMapSnapPoint(ctx.floor, at, ctx.view.scale, {
      ...(this.points.length > 0 ? { from: this.points[this.points.length - 1]! } : {}),
      ...(ctx.toggles.grid ? { grid: this.grid } : {}),
      corners: this.points,
    });
  }

  /** Whether `at` closes the room: on the first corner, with 3 down. */
  private closes(ctx: HomeMapEditorContext, at: HomePoint): boolean {
    const first = this.points[0];
    return first !== undefined && this.points.length >= 3 && Math.hypot(at[0] - first[0], at[1] - first[1]) * ctx.view.scale <= 10;
  }

  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (!this.active || e.button !== 0) return false;
    const p = this.snap(ctx, at);
    if (this.closes(ctx, p)) {
      void this.finish(ctx);
      return true;
    }
    const last = this.points[this.points.length - 1];
    if (last === undefined || Math.hypot(p[0] - last[0], p[1] - last[1]) >= 0.05) this.points.push(p);
    ctx.redraw();
    return true;
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    if (!this.active) return;
    this.hoverAt = at === undefined ? undefined : this.snap(ctx, at);
    ctx.redraw();
  }

  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (!this.active) return false;
    if (e.key === "Escape") {
      this.stop(ctx);
      return true;
    }
    if (e.key === "Enter") {
      if (this.points.length >= 3) void this.finish(ctx);
      return true;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      this.points.pop();
      ctx.redraw();
      return true;
    }
    return false;
  }

  /** Ask the new room's name and add it, picked. */
  async finish(ctx: HomeMapEditorContext): Promise<void> {
    const outline = this.points.slice();
    this.stop(ctx);
    if (outline.length < 3) return;
    const name = await ctx.ask({ title: "Name the room", label: "Name", value: "Room", ok: "Add room" });
    if (name === undefined) return;
    const id = ctx.newId();
    const floorId = ctx.floor.id;
    if (!ctx.apply((d) => drawRoom(d, floorId, id, outline, name), { select: { kind: "room", roomId: id } })) {
      ctx.note("err", "That room could not be added. Draw at least three corners round some floor.");
    }
  }

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    if (!this.active) return nothing;
    const screen = this.points.map((p) => ctx.toScreen(p));
    const hover = this.hoverAt === undefined ? undefined : ctx.toScreen(this.hoverAt);
    const closing = this.hoverAt !== undefined && this.closes(ctx, this.hoverAt);
    const line = [...screen, ...(hover !== undefined ? [hover] : [])].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const last = this.points[this.points.length - 1];
    const length = last !== undefined && this.hoverAt !== undefined ? Math.hypot(this.hoverAt[0] - last[0], this.hoverAt[1] - last[1]) : 0;
    return svg`<g class="hme-draw">
      ${screen.length >= 3 ? svg`<polygon points=${screen.map(([x, y]) => `${x},${y}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />` : nothing}
      <polyline points=${line} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${screen.map(([x, y], i) => svg`<circle cx=${x} cy=${y} r=${i === 0 && closing ? 8 : 5} fill=${i === 0 && closing ? "#5b8def" : "#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${hover !== undefined && !closing ? svg`<circle cx=${hover[0]} cy=${hover[1]} r="4" fill="#5b8def" />` : nothing}
      ${hover !== undefined && length > 0.05 ? svg`<g class="hme-tag"><rect x=${hover[0] + 10} y=${hover[1] - 26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${hover[0] + 39} y=${hover[1] - 13} fill="#fff" text-anchor="middle">${length.toFixed(2)} m</text></g>` : nothing}
    </g>`;
  }

  /** The pill's words while drawing. */
  hint(): string {
    if (this.points.length === 0) return "Click to put down the first corner";
    if (this.points.length < 3) return "Click to add corners";
    return "Click the first corner or press Enter to close the room";
  }
}
