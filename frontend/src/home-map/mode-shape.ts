// The map editor's Shape mode (mock board 2): fix what the scan got a
// little wrong, and draw what it never saw. The left rail holds the tools,
// each with its key (Walls and corners V, Draw a room R, Split a room S,
// Inner wall W, Door D, Window N, Way through O, Stairs T), and the scan
// check: overlapping rooms, corners a little off square, small gaps and
// rooms with no way into their neighbours (`scanIssues`), each with its fix
// and a fix for all.
//
// On the stage the picked room stands out from the rest. Its corners are
// handles (a corner another room shares moves with it; with Snap to 90° on
// a corner lines up with the corners beside it), the middle of each wall
// adds a corner when dragged, a wall is picked with a click and shows its
// length, and each door, window and way through slides along its wall with
// the space to each corner shown. Corners off square and the other issues
// are marked in amber wherever they are. The placing tools show where the
// door, window or stairs would go before the click.
//
// The inspector shows the picked wall (its room and side, length, which
// moves its far corner, thickness and the room's wall height, and
// Straighten, Square the corners and Split wall), what is on that wall with
// buttons to add more, and the picked opening (its kind as pictures, width,
// height from the floor and how tall, Remove). Edits go through the shell
// (`editor-mode.ts`).
//
// The dock's Show scan as it was draws each room's scan as Home Assistant
// kept it (`ctx.scans`) faint and dashed over the plan, in a teal apart
// from the blue of a picked thing and the amber of an issue: its outline,
// walls, doors and windows. A picked room whose shape is no longer its
// scan's has Back to the scan in its card, one undo step that puts its
// walls, doors, windows and furniture back and leaves its devices; a room
// drawn by hand, or one already as scanned, has none.

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import {
  type HomeMapIssue,
  addCorner,
  addInnerWall,
  addOpening,
  addStairs,
  backToScan,
  fixAllIssues,
  homeMapOpeningWall,
  homeMapRoomWalls,
  homeMapScanDiffers,
  homeMapScanMarks,
  moveCorner,
  moveOpening,
  removeCorner,
  removeOpening,
  removeWall,
  scanIssues,
  setOpening,
  setWallHeight,
  setWallLength,
  setWallThickness,
  splitRoom,
  squareCorners,
  straightenWall,
} from "./edit-ops.js";
import { HOME_MAP_SHAPE_GRID, HomeMapDrawTool, homeMapSnapPoint } from "./draw-tool.js";
import { type HomeMapEditorContext, type HomeMapMode, type HomeMapSelection, homeMapSelectionRoom } from "./editor-mode.js";
import { hmeCard, hmeHint, hmeNumber, hmePic, hmeRow } from "./editor-parts.js";
import { homeMapCount, homeMapMeters, homeMapOpeningName, homeMapShortcut, homeMapWallName } from "./editor-view.js";
import { type HomeSegment, homeDistanceToSegment, homeLabelPoint, homeMainDirection, homeProject, homeRoomUnder, homeWallsOf, segmentLength } from "./geometry.js";
import {
  type HomeMapDocument,
  type HomeMapFloor,
  type HomeMapOpening,
  type HomeMapOpeningKind,
  type HomeMapOpeningStyle,
  type HomeMapRoom,
  type HomePoint,
  homeMapRoomCenter,
  homeMapRoomName,
  homeMapScanOf,
  sameHomeMapId,
} from "./model.js";

/** Shape's tools, by the key that picks each. */
export type HomeMapShapeTool = "select" | "draw" | "split" | "inner" | "door" | "window" | "opening" | "stairs";

export const HOME_MAP_SHAPE_TOOLS: readonly { id: HomeMapShapeTool; label: string; key: string }[] = [
  { id: "select", label: "Walls and corners", key: "v" },
  { id: "draw", label: "Draw a room", key: "r" },
  { id: "split", label: "Split a room", key: "s" },
  { id: "inner", label: "Inner wall", key: "w" },
  { id: "door", label: "Door", key: "d" },
  { id: "window", label: "Window", key: "n" },
  { id: "opening", label: "Way through (no door)", key: "o" },
  { id: "stairs", label: "Stairs", key: "t" },
];

/** The tool a key picks, if any. */
export function homeMapShapeToolFor(letter: string): HomeMapShapeTool | undefined {
  return HOME_MAP_SHAPE_TOOLS.find((t) => t.key === letter.toLowerCase())?.id;
}

/** The six kinds an opening can be, as the inspector's pictures offer
 * them. */
export const HOME_MAP_OPENING_CHOICES: readonly { label: string; kind: HomeMapOpeningKind; style?: HomeMapOpeningStyle }[] = [
  { label: "Door", kind: "door" },
  { label: "Double door", kind: "door", style: "double" },
  { label: "Sliding door", kind: "door", style: "sliding" },
  { label: "Window", kind: "window" },
  { label: "Sliding window", kind: "window", style: "sliding" },
  { label: "Way through", kind: "opening" },
];

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "Fix all three", "Fix all 12". */
export function homeMapFixAllLabel(n: number): string {
  return n === 2 ? "Fix both" : `Fix all ${NUMBER_WORDS[n] ?? n}`;
}

/** How near a wall a click must land to pick it, in pixels. */
const WALL_REACH = 9;
/** How near a wall a door or window tool looks, in pixels. */
const PLACE_REACH = 18;

/** The scan as it was: a teal apart from the picked blue, the amber of an
 * issue and the pink snap guide, light enough for the dark stage of both
 * skins. */
const SCAN_COLOR = "#4fd6c2";

/** What the dock's Show scan as it was does, on hover. */
const SCAN_TOGGLE_TITLE = "Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.";
/** What Back to the scan does, on hover. */
const BACK_TO_SCAN_TITLE = "Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.";

const fmt = (v: number) => v.toFixed(1);
const pt = (p: readonly number[]) => `${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`;

/** The scan check's findings, kept per floor drawn. */
const issueMemo = new WeakMap<HomeMapFloor, HomeMapIssue[]>();
function issuesOf(floor: HomeMapFloor): HomeMapIssue[] {
  let held = issueMemo.get(floor);
  if (held === undefined) issueMemo.set(floor, (held = scanIssues(floor)));
  return held;
}

/** The wall nearest a plan point within `reach` pixels: the picked room's
 * walls first, then every room's. */
function wallNear(ctx: HomeMapEditorContext, at: HomePoint, reach: number, prefer?: HomeMapRoom): { room: HomeMapRoom; wall: number; seg: HomeSegment } | undefined {
  const limit = reach / ctx.view.scale;
  const search = (rooms: readonly HomeMapRoom[]) => {
    let best: { room: HomeMapRoom; wall: number; seg: HomeSegment; d: number } | undefined;
    for (const room of rooms) {
      for (const [i, seg] of homeMapRoomWalls(room).entries()) {
        const d = homeDistanceToSegment(at, seg);
        if (d <= limit && (best === undefined || d < best.d)) best = { room, wall: i, seg, d };
      }
    }
    return best;
  };
  return (prefer === undefined ? undefined : search([prefer])) ?? search(ctx.floor.rooms);
}

/** The unit normal of a wall pointing out of its room. */
function outward(room: HomeMapRoom, seg: HomeSegment): HomePoint {
  const length = Math.max(segmentLength(seg), 1e-9);
  let n: HomePoint = [-(seg.b[1] - seg.a[1]) / length, (seg.b[0] - seg.a[0]) / length];
  const mid: HomePoint = [(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2];
  const inside = homeLabelPoint(room) ?? homeMapRoomCenter(room);
  if ((inside[0] - mid[0]) * n[0] + (inside[1] - mid[1]) * n[1] > 0) n = [-n[0], -n[1]];
  return n;
}

export class ShapeMode implements HomeMapMode {
  readonly id = "shape" as const;
  tool: HomeMapShapeTool = "select";
  readonly draw = new HomeMapDrawTool(HOME_MAP_SHAPE_GRID);
  /** The first click of Split a room or Inner wall. */
  private first: { roomId: string; a: HomePoint } | undefined;
  private hoverAt: HomePoint | undefined;
  /** Where the picked wall was clicked, for the pill's "here". */
  private wallAt: HomePoint | undefined;
  /** An opening being dragged, so its distances show. */
  private sliding: { roomId: string; index: number } | undefined;
  private dragging = false;

  setTool(ctx: HomeMapEditorContext, tool: HomeMapShapeTool): void {
    this.first = undefined;
    if (tool === "draw") this.draw.start(ctx);
    else this.draw.stop();
    this.tool = tool;
    ctx.redraw();
  }

  private focus(ctx: HomeMapEditorContext): HomeMapRoom | undefined {
    const id = homeMapSelectionRoom(ctx.selection);
    return id === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  }

  /** The wall picked: the wall itself, or the wall a picked opening is in. */
  private pickedWall(ctx: HomeMapEditorContext, room: HomeMapRoom | undefined): number | undefined {
    const sel = ctx.selection;
    if (room === undefined || sel === undefined) return undefined;
    if (sel.kind === "wall") return sel.wall;
    if (sel.kind === "opening") {
      const o = room.openings[sel.opening];
      const wi = o === undefined ? -1 : homeMapOpeningWall(room, o);
      return wi >= 0 ? wi : undefined;
    }
    return undefined;
  }

  // ── the rail ───────────────────────────────────────────────────────────

  rail(ctx: HomeMapEditorContext): TemplateResult {
    const issues = issuesOf(ctx.floor);
    const floorId = ctx.floor.id;
    return html`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${HOME_MAP_SHAPE_TOOLS.map((t, i) => html`${i === 4 ? html`<div class="hme-sep"></div>` : nothing}
          <button type="button" class="hme-tool ${this.tool === t.id ? "on" : ""}" aria-pressed=${this.tool === t.id ? "true" : "false"}
            @click=${() => this.setTool(ctx, t.id)}>${TOOL_ICONS[t.id]}${t.label}<kbd>${t.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${hmeCard("Scan check", html`
        ${issues.length === 0 ? html`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>` : nothing}
        ${issues.map((issue) => html`<div class="hme-fix">
          <span class="hme-fix-dot ${issue.kind === "missingDoor" ? "gray" : ""}"></span>
          <p @click=${() => ctx.select({ kind: "room", roomId: issue.roomIds[0]! })}><b>${issue.title}</b> ${issue.detail}</p>
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => issue.fix(d))}>${issue.fixLabel}</button></div>`)}
        ${issues.length > 1 ? html`<button type="button" class="hme-tb hme-wide" @click=${() => ctx.apply((d) => fixAllIssues(d, floorId))}>${homeMapFixAllLabel(issues.length)}</button>` : nothing}`,
        issues.length === 0 ? undefined : html`<span class="hme-amber">${issues.length} to fix</span>`)}`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    if (this.tool === "draw") return this.draw.overlay(ctx);
    const room = this.focus(ctx);
    const parts: SVGTemplateResult[] = [];
    if (room !== undefined && room.outline.length >= 3) {
      const shape = room.outline.map((p) => pt(ctx.toScreen(p))).join("L");
      parts.push(svg`<path d=${`M0 0H${ctx.stage.width}V${ctx.stage.height}H0ZM${shape}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`);
    }
    if (ctx.toggles.scan) parts.push(...this.scanMarks(ctx));
    parts.push(...this.issueMarks(ctx));
    if (room !== undefined) parts.push(this.roomHandles(ctx, room));
    parts.push(...this.toolGhost(ctx));
    return svg`${parts}`;
  }

  /** Each room's scan as it was, faint and dashed: the outline, the walls
   * over a dark edge so they read on any floor, a door as a solid bar and
   * a window as a dotted one. */
  private scanMarks(ctx: HomeMapEditorContext): SVGTemplateResult[] {
    return homeMapScanMarks(ctx.floor, ctx.scans).map((mark) => {
      const shape = mark.outline.map((p) => pt(ctx.toScreen(p))).join("L");
      const walls = mark.walls.map((w) => `M${pt(ctx.toScreen(w.a))}L${pt(ctx.toScreen(w.b))}`).join("");
      return svg`<g class="hme-scan" data-room=${mark.roomId} pointer-events="none">
        <path d=${`M${shape}Z`} fill=${SCAN_COLOR} fill-opacity="0.06" stroke="none" />
        <path d=${walls} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${walls} fill="none" stroke=${SCAN_COLOR} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${mark.openings.map((o) => {
          const a = ctx.toScreen(o.a);
          const b = ctx.toScreen(o.b);
          return svg`<line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke=${SCAN_COLOR} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${o.kind === "window" ? "2 3" : "none"} />`;
        })}
      </g>`;
    });
  }

  private issueMarks(ctx: HomeMapEditorContext): SVGTemplateResult[] {
    return issuesOf(ctx.floor).map((issue) => {
      const [x, y] = ctx.toScreen(issue.where);
      if (issue.kind === "offSquare") {
        const deg = /(\d+)°/.exec(issue.title)?.[1] ?? "";
        return svg`<g class="hme-issue" data-hme=${`issue:${issue.id}`} style="cursor:pointer"><title>${issue.title} Click to square it.</title>
          <circle cx=${fmt(x)} cy=${fmt(y)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${fmt(x + 12)} y=${fmt(y + 6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${fmt(x + 34)} y=${fmt(y + 20)} fill="#2a1a00" text-anchor="middle">${deg}°</text></g></g>`;
      }
      const cm = `${Math.round(issue.amount * 100)} cm`;
      const text = issue.kind === "overlap" ? `Overlap ${cm} · ${issue.fixLabel}` : issue.kind === "gap" ? `Gap ${cm} · ${issue.fixLabel}` : `No door · ${issue.fixLabel}`;
      const w = text.length * 6.2 + 18;
      const gray = issue.kind === "missingDoor";
      return svg`<g class="hme-issue" data-hme=${`issue:${issue.id}`} style="cursor:pointer"><title>${issue.title} ${issue.detail}</title>
        <circle cx=${fmt(x)} cy=${fmt(y)} r="4" fill=${gray ? "#8e8e93" : "#ffb340"} />
        <g class="hme-tag"><rect x=${fmt(x - w / 2)} y=${fmt(y + 8)} width=${fmt(w)} height="20" rx="10" fill=${gray ? "#8e8e93" : "#ffb340"} />
        <text x=${fmt(x)} y=${fmt(y + 22)} fill=${gray ? "#fff" : "#2a1a00"} text-anchor="middle">${text}</text></g></g>`;
    });
  }

  /** The picked room's wall, openings, corners and wall middles. */
  private roomHandles(ctx: HomeMapEditorContext, room: HomeMapRoom): SVGTemplateResult {
    const walls = homeMapRoomWalls(room);
    const sel = ctx.selection;
    const wi = this.pickedWall(ctx, room);
    const parts: SVGTemplateResult[] = [];
    if (wi !== undefined && walls[wi] !== undefined) {
      const seg = walls[wi]!;
      const a = ctx.toScreen(seg.a);
      const b = ctx.toScreen(seg.b);
      const n = outward(room, seg);
      parts.push(svg`<line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`);
      if (sel?.kind === "wall" && !this.dragging) {
        const m: HomePoint = [(a[0] + b[0]) / 2 + n[0] * 22, (a[1] + b[1]) / 2 + n[1] * 22];
        parts.push(svg`<g class="hme-tag" pointer-events="none"><rect x=${fmt(m[0] - 27)} y=${fmt(m[1] - 9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${fmt(m[0])} y=${fmt(m[1] + 4)} fill="#fff" text-anchor="middle">${segmentLength(seg).toFixed(2)} m</text></g>`);
      }
    }
    // Openings: each a bar along its wall, dragged to slide it.
    for (const [i, o] of room.openings.entries()) {
      const a = ctx.toScreen(o.a);
      const b = ctx.toScreen(o.b);
      const on = sel?.kind === "opening" && sel.opening === i;
      const color = o.kind === "window" ? "#8bb8f0" : o.kind === "door" ? "#ece6da" : "#98989d";
      parts.push(svg`<g data-hme=${`opening:${i}`} style="cursor:ew-resize">
        <line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke=${on ? "#5b8def" : "rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke=${color} stroke-width="3" />
        ${on ? svg`<circle cx=${fmt(a[0])} cy=${fmt(a[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${fmt(b[0])} cy=${fmt(b[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />` : nothing}
      </g>`);
    }
    const shown = this.sliding !== undefined && sameHomeMapId(this.sliding.roomId, room.id) ? this.sliding.index : sel?.kind === "opening" ? sel.opening : undefined;
    if (shown !== undefined && room.openings[shown] !== undefined) parts.push(this.distances(ctx, room, room.openings[shown]!));
    if (!this.dragging || this.sliding === undefined) {
      // The middle of each wall: drag to add a corner there.
      if (this.tool === "select") {
        for (const [i, seg] of walls.entries()) {
          if (segmentLength(seg) * ctx.view.scale < 40) continue;
          const m = ctx.toScreen([(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2]);
          parts.push(svg`<circle data-hme=${`mid:${i}`} cx=${fmt(m[0])} cy=${fmt(m[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`);
        }
      }
      for (const [i, p] of room.outline.entries()) {
        const [x, y] = ctx.toScreen(p);
        const on = sel?.kind === "corner" && sel.corner === i;
        parts.push(svg`<circle data-hme=${`corner:${i}`} cx=${fmt(x)} cy=${fmt(y)} r="7" fill=${on ? "#5b8def" : "#fff"} stroke=${on ? "#fff" : "#5b8def"} stroke-width="2" style="cursor:move" />`);
      }
    }
    return svg`<g class="hme-handles">${parts}</g>`;
  }

  /** The space from an opening to each end of its wall, and its width,
   * measured beside the wall outside the room. */
  private distances(ctx: HomeMapEditorContext, room: HomeMapRoom, o: HomeMapOpening): SVGTemplateResult {
    const wi = homeMapOpeningWall(room, o);
    const seg = wi >= 0 ? homeMapRoomWalls(room)[wi] : undefined;
    if (seg === undefined) return svg``;
    const length = segmentLength(seg);
    const sa = homeProject(o.a, seg.a, seg.b).along;
    const sb = homeProject(o.b, seg.a, seg.b).along;
    const s0 = Math.max(0, Math.min(sa, sb));
    const s1 = Math.min(length, Math.max(sa, sb));
    const n = outward(room, seg);
    const u: HomePoint = [(seg.b[0] - seg.a[0]) / length, (seg.b[1] - seg.a[1]) / length];
    const at = (s: number): HomePoint => {
      const p = ctx.toScreen([seg.a[0] + u[0] * s, seg.a[1] + u[1] * s]);
      return [p[0] + n[0] * 26, p[1] + n[1] * 26];
    };
    const stops = [0, s0, s1, length];
    const tick = (p: HomePoint) => `M${pt([p[0] - n[0] * 5, p[1] - n[1] * 5])}L${pt([p[0] + n[0] * 5, p[1] + n[1] * 5])}`;
    const pieces = [[0, s0, false], [s0, s1, true], [s1, length, false]] as const;
    return svg`<g class="hme-dist" pointer-events="none">
      <path d=${`M${pt(at(0))}L${pt(at(length))}${stops.map((s) => tick(at(s))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${pieces.filter(([p, q]) => q - p > 0.02).map(([p, q, main]) => {
        const m = at((p + q) / 2);
        return svg`<g class="hme-tag"><rect x=${fmt(m[0] - 25)} y=${fmt(m[1] - 9)} width="50" height="18" rx="9" fill=${main ? "#5b8def" : "#2c2c2e"} />
          <text x=${fmt(m[0])} y=${fmt(m[1] + 4)} fill="#fff" text-anchor="middle">${(q - p).toFixed(2)} m</text></g>`;
      })}
    </g>`;
  }

  /** Where the current tool would put what it makes. */
  private toolGhost(ctx: HomeMapEditorContext): SVGTemplateResult[] {
    const at = this.hoverAt;
    if (at === undefined) return [];
    const out: SVGTemplateResult[] = [];
    if (this.tool === "door" || this.tool === "window" || this.tool === "opening") {
      const near = wallNear(ctx, at, PLACE_REACH, this.focus(ctx));
      if (near !== undefined) {
        const width = this.tool === "window" ? 1.2 : 0.9;
        const length = segmentLength(near.seg);
        const w = Math.min(width, length);
        const c = Math.min(Math.max(homeProject(at, near.seg.a, near.seg.b).along, w / 2), length - w / 2);
        const u: HomePoint = [(near.seg.b[0] - near.seg.a[0]) / length, (near.seg.b[1] - near.seg.a[1]) / length];
        const a = ctx.toScreen([near.seg.a[0] + u[0] * (c - w / 2), near.seg.a[1] + u[1] * (c - w / 2)]);
        const b = ctx.toScreen([near.seg.a[0] + u[0] * (c + w / 2), near.seg.a[1] + u[1] * (c + w / 2)]);
        out.push(svg`<line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`);
      }
    }
    if (this.tool === "stairs" && homeRoomUnder(ctx.floor, at) !== undefined) {
      const [x, y] = ctx.toScreen(at);
      const w = ctx.px(1.0);
      const h = ctx.px(2.6);
      out.push(svg`<g pointer-events="none" opacity="0.7"><rect x=${fmt(x - w / 2)} y=${fmt(y - h / 2)} width=${fmt(w)} height=${fmt(h)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1, 2, 3, 4, 5, 6, 7].map((k) => svg`<line x1=${fmt(x - w / 2)} x2=${fmt(x + w / 2)} y1=${fmt(y - h / 2 + (h * k) / 8)} y2=${fmt(y - h / 2 + (h * k) / 8)} stroke="#5b8def" stroke-width="1" />`)}</g>`);
    }
    if ((this.tool === "split" || this.tool === "inner") && this.first !== undefined) {
      const a = ctx.toScreen(this.first.a);
      const b = ctx.toScreen(this.snap(ctx, at, this.first.a));
      if (this.tool === "split") {
        const d = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-6);
        const u: HomePoint = [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
        const far = Math.hypot(ctx.stage.width, ctx.stage.height);
        out.push(svg`<line x1=${fmt(a[0] - u[0] * far)} y1=${fmt(a[1] - u[1] * far)} x2=${fmt(a[0] + u[0] * far)} y2=${fmt(a[1] + u[1] * far)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`);
      } else {
        out.push(svg`<line x1=${fmt(a[0])} y1=${fmt(a[1])} x2=${fmt(b[0])} y2=${fmt(b[1])} stroke="#ece6da" stroke-width=${fmt(Math.max(ctx.px(0.1), 3))} stroke-opacity="0.8" pointer-events="none" />`);
      }
      out.push(svg`<circle cx=${fmt(a[0])} cy=${fmt(a[1])} r="5" fill="#5b8def" pointer-events="none" />`);
    }
    return out;
  }

  private snap(ctx: HomeMapEditorContext, at: HomePoint, from?: HomePoint): HomePoint {
    return homeMapSnapPoint(ctx.floor, at, ctx.view.scale, { ...(from === undefined ? {} : { from }), ...(ctx.toggles.grid ? { grid: HOME_MAP_SHAPE_GRID } : {}) });
  }

  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (this.tool === "draw") return this.draw.pointerDown(ctx, e, at);
    if (e.button !== 0) return false;
    switch (this.tool) {
      case "door":
      case "window":
      case "opening": {
        const near = wallNear(ctx, at, PLACE_REACH, this.focus(ctx));
        if (near === undefined) return false;
        const kind: HomeMapOpeningKind = this.tool;
        const roomId = near.room.id;
        const index = near.room.openings.length;
        const wall = near.wall;
        if (ctx.apply((d) => addOpening(d, roomId, wall, { kind, at }), { select: { kind: "opening", roomId, opening: index } })) this.setTool(ctx, "select");
        return true;
      }
      case "stairs": {
        const room = homeRoomUnder(ctx.floor, at);
        if (room === undefined) return false;
        const roomId = room.id;
        if (ctx.apply((d) => addStairs(d, roomId, at), { select: { kind: "room", roomId } })) this.setTool(ctx, "select");
        return true;
      }
      case "split":
      case "inner":
        return this.twoPoints(ctx, at);
      default:
        return this.pick(ctx, e, at);
    }
  }

  /** Split a room or Inner wall: the first click starts the line, the
   * second ends it. */
  private twoPoints(ctx: HomeMapEditorContext, at: HomePoint): boolean {
    if (this.first === undefined) {
      const room = homeRoomUnder(ctx.floor, at) ?? this.focus(ctx);
      if (room === undefined) return false;
      this.first = { roomId: room.id, a: this.snap(ctx, at) };
      ctx.select({ kind: "room", roomId: room.id });
      return true;
    }
    const { roomId, a } = this.first;
    const b = this.snap(ctx, at, a);
    this.first = undefined;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.1) {
      ctx.redraw();
      return true;
    }
    if (this.tool === "inner") {
      const room = ctx.doc.floors.flatMap((f) => f.rooms).find((r) => sameHomeMapId(r.id, roomId));
      const index = room === undefined ? 0 : homeWallsOf(room).length;
      if (ctx.apply((d) => addInnerWall(d, roomId, a, b), { select: { kind: "wall", roomId, wall: index } })) this.setTool(ctx, "select");
      else ctx.note("err", "An inner wall needs to be at least 10 cm long.");
      return true;
    }
    void this.split(ctx, roomId, a, b);
    return true;
  }

  private async split(ctx: HomeMapEditorContext, roomId: string, a: HomePoint, b: HomePoint): Promise<void> {
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, roomId));
    const name = await ctx.ask({ title: "Name the new room", label: "Name", value: room === undefined ? "Room" : `${homeMapRoomName(room)} 2`, ok: "Split the room" });
    if (name === undefined) return;
    const id = ctx.newId();
    if (ctx.apply((d) => splitRoom(d, roomId, a, b, id, name), { select: { kind: "room", roomId: id } })) this.setTool(ctx, "select");
    else ctx.note("err", "That line does not cut the room in two. Draw it right across the room.");
  }

  /** Walls and corners: a handle drags, a wall or room is picked. */
  private pick(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    const room = this.focus(ctx);
    const hit = (e.target as Element | null)?.closest?.("[data-hme]")?.getAttribute("data-hme") ?? "";
    const [what, arg] = hit.split(/:(.*)/s) as [string, string | undefined];
    if (what === "issue") {
      const issue = issuesOf(ctx.floor).find((i) => i.id === arg);
      if (issue !== undefined) ctx.apply((d) => issue.fix(d));
      return true;
    }
    const index = Number(arg);
    if (room !== undefined && what === "corner" && Number.isInteger(index)) {
      this.cornerDrag(ctx, e, room, index);
      return true;
    }
    if (room !== undefined && what === "mid" && Number.isInteger(index)) {
      this.midDrag(ctx, e, room, index);
      return true;
    }
    if (room !== undefined && what === "opening" && Number.isInteger(index)) {
      this.openingDrag(ctx, e, room, index);
      return true;
    }
    const near = wallNear(ctx, at, WALL_REACH, room);
    if (near !== undefined) {
      this.wallAt = homeProject(at, near.seg.a, near.seg.b).point;
      ctx.select({ kind: "wall", roomId: near.room.id, wall: near.wall });
      return true;
    }
    const under = homeRoomUnder(ctx.floor, at);
    if (under === undefined) return false;
    ctx.select({ kind: "room", roomId: under.id });
    return true;
  }

  /** Where a dragged corner lands: on another room's corner within 10
   * pixels (so the two become one), on the grid while it is on, and with
   * Snap to 90° in line with the corners either side of it along the
   * floor's two wall directions. */
  private cornerTo(ctx: HomeMapEditorContext, room: HomeMapRoom, index: number, at: HomePoint): HomePoint {
    const others = ctx.floor.rooms.filter((r) => !sameHomeMapId(r.id, room.id)).flatMap((r) => r.outline);
    const reach = 10 / ctx.view.scale;
    for (const p of others) if (Math.hypot(p[0] - at[0], p[1] - at[1]) <= reach) return [p[0], p[1]];
    let to: HomePoint = at;
    if (ctx.toggles.grid) to = [Math.round(to[0] / HOME_MAP_SHAPE_GRID) * HOME_MAP_SHAPE_GRID, Math.round(to[1] / HOME_MAP_SHAPE_GRID) * HOME_MAP_SHAPE_GRID];
    if (ctx.toggles.square) {
      const dir = homeMainDirection(ctx.floor.rooms.flatMap((r) => homeWallsOf(r)));
      const c = Math.cos(dir);
      const s = Math.sin(dir);
      const uv = (p: readonly number[]): HomePoint => [p[0]! * c + p[1]! * s, -p[0]! * s + p[1]! * c];
      let [u, v] = uv(to);
      const n = room.outline.length;
      const line = 8 / ctx.view.scale;
      for (const k of [(index + n - 1) % n, (index + 1) % n]) {
        const [nu, nv] = uv(room.outline[k]!);
        if (Math.abs(u - nu) <= line) u = nu;
        if (Math.abs(v - nv) <= line) v = nv;
      }
      to = [u * c - v * s, u * s + v * c];
    }
    return to;
  }

  private cornerDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, index: number): void {
    const roomId = room.id;
    let to: HomePoint | undefined;
    ctx.drag(e, {
      move: (p) => {
        this.dragging = true;
        const target = this.cornerTo(ctx, room, index, p);
        to = target;
        ctx.preview((d) => moveCorner(d, roomId, index, target));
      },
      end: (_p, _ev, moved) => {
        this.dragging = false;
        ctx.preview(undefined);
        const target = to;
        const select: HomeMapSelection = { kind: "corner", roomId, corner: index };
        if (moved && target !== undefined) ctx.apply((d) => moveCorner(d, roomId, index, target), { select });
        else ctx.select(select);
      },
    });
  }

  /** Drag a wall's middle: a corner is added there and follows the
   * pointer. A click adds the corner where it is. */
  private midDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, wall: number): void {
    const roomId = room.id;
    const seg = homeMapRoomWalls(room)[wall];
    const base = addCorner(ctx.doc, roomId, wall);
    const added = base?.floors.flatMap((f) => f.rooms).find((r) => sameHomeMapId(r.id, roomId));
    if (seg === undefined || base === undefined || added === undefined) return;
    const mid: HomePoint = [(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2];
    const index = added.outline.reduce((best, p, i) => (Math.hypot(p[0] - mid[0], p[1] - mid[1]) < Math.hypot(added.outline[best]![0] - mid[0], added.outline[best]![1] - mid[1]) ? i : best), 0);
    const make = (to: HomePoint | undefined) => (d: HomeMapDocument) => {
      const split = addCorner(d, roomId, wall);
      return split === undefined || to === undefined ? split : moveCorner(split, roomId, index, to);
    };
    let to: HomePoint | undefined;
    ctx.drag(e, {
      move: (p) => {
        this.dragging = true;
        to = this.cornerTo(ctx, added, index, p);
        ctx.preview(make(to));
      },
      end: (_p, _ev, moved) => {
        this.dragging = false;
        ctx.preview(undefined);
        ctx.apply(make(moved ? to : undefined), { select: { kind: "corner", roomId, corner: index } });
      },
    });
  }

  private openingDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, index: number): void {
    const roomId = room.id;
    const o = room.openings[index];
    if (o === undefined) return;
    const select: HomeMapSelection = { kind: "opening", roomId, opening: index };
    const mid: HomePoint = [(o.a[0] + o.b[0]) / 2, (o.a[1] + o.b[1]) / 2];
    let start: HomePoint | undefined;
    let to: HomePoint | undefined;
    ctx.select(select);
    ctx.drag(e, {
      move: (p) => {
        start ??= p;
        this.dragging = true;
        this.sliding = { roomId, index };
        const target: HomePoint = [mid[0] + p[0] - start[0], mid[1] + p[1] - start[1]];
        to = target;
        ctx.preview((d) => moveOpening(d, roomId, index, target));
      },
      end: (_p, _ev, moved) => {
        this.dragging = false;
        this.sliding = undefined;
        ctx.preview(undefined);
        const target = to;
        if (moved && target !== undefined) ctx.apply((d) => moveOpening(d, roomId, index, target), { select });
      },
    });
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    if (this.tool === "draw") {
      this.draw.hover(ctx, at);
      return;
    }
    if (this.tool === "select") return;
    this.hoverAt = at;
    ctx.redraw();
  }

  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.tool === "draw" && this.draw.active && (e.key === "Enter" || e.key === "Backspace" || e.key === "Delete")) return this.draw.keyDown(ctx, e);
    const shortcut = homeMapShortcut(e, false);
    if (typeof shortcut === "object" && "letter" in shortcut) {
      const tool = homeMapShapeToolFor(shortcut.letter);
      if (tool === undefined) return false;
      this.setTool(ctx, tool);
      return true;
    }
    if (shortcut === "cancel" && (this.tool !== "select" || this.first !== undefined)) {
      this.setTool(ctx, "select");
      return true;
    }
    if (shortcut === "delete") {
      const sel = ctx.selection;
      if (sel?.kind === "corner") ctx.apply((d) => removeCorner(d, sel.roomId, sel.corner), { select: { kind: "room", roomId: sel.roomId } });
      else if (sel?.kind === "opening") ctx.apply((d) => removeOpening(d, sel.roomId, sel.opening), { select: { kind: "room", roomId: sel.roomId } });
      else if (sel?.kind === "wall") ctx.apply((d) => removeWall(d, sel.roomId, sel.wall), { select: { kind: "room", roomId: sel.roomId } });
      else return false;
      return true;
    }
    return false;
  }

  cursor(): string | undefined {
    return this.tool === "select" ? undefined : "crosshair";
  }

  leave(ctx: HomeMapEditorContext): void {
    this.first = undefined;
    this.hoverAt = undefined;
    this.dragging = false;
    this.sliding = undefined;
    this.draw.stop();
    this.tool = "select";
    ctx.redraw();
  }

  dock(ctx: HomeMapEditorContext): TemplateResult {
    return html`<button type="button" class="hme-tb ${ctx.toggles.square ? "on" : ""}" aria-pressed=${ctx.toggles.square ? "true" : "false"}
        title="A dragged corner lines up with the corners beside it" @click=${() => ctx.setToggle("square", !ctx.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${ctx.toggles.grid ? "on" : ""}" aria-pressed=${ctx.toggles.grid ? "true" : "false"}
        @click=${() => ctx.setToggle("grid", !ctx.toggles.grid)}>Grid 5 cm</button>
      ${ctx.scans === undefined ? nothing : html`<button type="button" class="hme-tb ${ctx.toggles.scan ? "on" : ""}" aria-pressed=${ctx.toggles.scan ? "true" : "false"}
        title=${SCAN_TOGGLE_TITLE} @click=${() => ctx.setToggle("scan", !ctx.toggles.scan)}>Show scan as it was</button>`}`;
  }

  // ── the pill ───────────────────────────────────────────────────────────

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.tool === "draw") {
      return html`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length >= 3 ? html`<button type="button" class="hme-tb" @click=${() => void this.draw.finish(ctx)}>Close the room</button>` : nothing}
        <button type="button" class="hme-tb" @click=${() => this.setTool(ctx, "select")}>Cancel</button>`;
    }
    if (this.tool !== "select") {
      const words: Record<string, string> = {
        split: this.first === undefined ? "Click where the cut starts" : "Click where it ends, across the room",
        inner: this.first === undefined ? "Click where the wall starts" : "Click where it ends",
        door: "Click a wall to put a door in it",
        window: "Click a wall to put a window in it",
        opening: "Click a wall to open a way through it",
        stairs: "Click in a room to put stairs there",
      };
      return html`<span class="hme-pill-name">${words[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${() => this.setTool(ctx, "select")}>Cancel</button>`;
    }
    const room = this.focus(ctx);
    const sel = ctx.selection;
    if (room === undefined || sel === undefined || this.dragging) return nothing;
    const roomId = room.id;
    const name = homeMapRoomName(room);
    if (sel.kind === "wall") {
      const wall = sel.wall;
      const at = this.wallAt;
      const side = homeMapWallName(room, wall, name).replace(", ", " · ");
      return html`<span class="hme-pill-name">${side}</span>
        <button type="button" class="hme-tb" @click=${() => this.addHere(ctx, room, wall, "window", at)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${() => this.addHere(ctx, room, wall, "door", at)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${() => this.cornerHere(ctx, room, wall, at)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => straightenWall(d, roomId, wall))}>Straighten</button>`;
    }
    if (sel.kind === "corner") {
      return html`<span class="hme-pill-name">${name} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${room.outline.length <= 3} @click=${() => ctx.apply((d) => removeCorner(d, roomId, sel.corner), { select: { kind: "room", roomId } })}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, roomId))}>Square the corners</button>`;
    }
    if (sel.kind === "opening") {
      const o = room.openings[sel.opening];
      if (o === undefined) return nothing;
      return html`<span class="hme-pill-name">${homeMapOpeningName(o)}</span>
        <button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removeOpening(d, roomId, sel.opening), { select: { kind: "room", roomId } })}>Remove</button>`;
    }
    return html`<span class="hme-pill-name">${name}</span>
      <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, roomId))}>Square the corners</button>`;
  }

  private addHere(ctx: HomeMapEditorContext, room: HomeMapRoom, wall: number, kind: HomeMapOpeningKind, at: HomePoint | undefined): void {
    const roomId = room.id;
    const index = room.openings.length;
    ctx.apply((d) => addOpening(d, roomId, wall, { kind, ...(at === undefined ? {} : { at }) }), { select: { kind: "opening", roomId, opening: index } });
  }

  private cornerHere(ctx: HomeMapEditorContext, room: HomeMapRoom, wall: number, at: HomePoint | undefined): void {
    const roomId = room.id;
    const op = (d: HomeMapDocument) => addCorner(d, roomId, wall, at);
    const next = op(ctx.doc)?.floors.flatMap((f) => f.rooms).find((r) => sameHomeMapId(r.id, roomId));
    const seg = homeMapRoomWalls(room)[wall];
    const where = at ?? (seg === undefined ? undefined : ([(seg.a[0] + seg.b[0]) / 2, (seg.a[1] + seg.b[1]) / 2] as HomePoint));
    const index = next === undefined || where === undefined ? -1
      : next.outline.reduce((best, p, i) => (Math.hypot(p[0] - where[0], p[1] - where[1]) < Math.hypot(next.outline[best]![0] - where[0], next.outline[best]![1] - where[1]) ? i : best), 0);
    ctx.apply(op, { select: index < 0 ? { kind: "room", roomId } : { kind: "corner", roomId, corner: index } });
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult {
    const room = this.focus(ctx);
    const sel = ctx.selection;
    if (room === undefined || sel === undefined) {
      const issues = issuesOf(ctx.floor);
      return hmeCard("Shape", html`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${issues.length === 0 ? "The scan check found nothing to fix on this floor." : `The scan check found ${homeMapCount(issues.length, "thing")} to fix. They are marked in amber.`}</p>`);
    }
    const roomId = room.id;
    if (sel.kind === "corner") return this.cornerCard(ctx, room, sel.corner);
    const wi = this.pickedWall(ctx, room);
    if (wi === undefined) {
      const scan = homeMapScanOf(ctx.scans, roomId);
      const back = scan !== undefined && homeMapScanDiffers(room, scan) ? scan : undefined;
      return hmeCard(homeMapRoomName(room), html`
        ${hmeRow("Corners", html`<span class="hme-val">${room.outline.length}</span>`)}
        ${hmeRow("Walls", html`<span class="hme-val">${homeMapRoomWalls(room).length}</span>`)}
        ${hmeRow("Wall height", hmeNumber({ label: "Wall height", value: room.height, unit: "m", min: 0.5, max: 20, set: (v) => ctx.apply((d) => setWallHeight(d, roomId, v)) }))}
        ${hmeHint("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${back === undefined ? nothing : hmeHint("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${back === undefined ? nothing : html`<button type="button" class="hme-tb" title=${BACK_TO_SCAN_TITLE} @click=${() => ctx.apply((d) => backToScan(d, roomId, back))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, roomId))}>Square the corners</button>
        </div>`);
    }
    const seg = homeMapRoomWalls(room)[wi]!;
    const onWall = room.openings.map((o, i) => ({ o, i })).filter(({ o }) => homeMapOpeningWall(room, o) === wi);
    const opening = sel.kind === "opening" ? room.openings[sel.opening] : undefined;
    const length = segmentLength(seg);
    const add = (kind: HomeMapOpeningKind) => {
      const index = room.openings.length;
      ctx.apply((d) => addOpening(d, roomId, wi, { kind }), { select: { kind: "opening", roomId, opening: index } });
    };
    return html`
      ${hmeCard("Wall", html`
        ${hmeRow("Room", html`<span class="hme-val strong">${homeMapWallName(room, wi, homeMapRoomName(room))}</span>`)}
        ${hmeRow("Length", hmeNumber({ label: "Length", value: length, unit: "m", min: 0.1, max: 200, set: (v) => ctx.apply((d) => setWallLength(d, roomId, wi, v)) }))}
        ${hmeRow("Thickness", hmeNumber({ label: "Thickness", value: seg.t, unit: "m", min: 0.01, max: 1, set: (v) => ctx.apply((d) => setWallThickness(d, roomId, wi, v)) }))}
        ${hmeRow("Height", hmeNumber({ label: "Wall height", value: room.height, unit: "m", min: 0.5, max: 20, set: (v) => ctx.apply((d) => setWallHeight(d, roomId, v)) }))}
        ${hmeHint("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => straightenWall(d, roomId, wi))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, roomId))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${() => this.cornerHere(ctx, room, wi, undefined)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${() => ctx.apply((d) => removeWall(d, roomId, wi), { select: { kind: "room", roomId } })}>Remove</button>
        </div>`)}
      ${hmeCard("On this wall", html`
        ${onWall.map(({ o, i }) => {
          const sa = homeProject(o.a, seg.a, seg.b).along;
          const sb = homeProject(o.b, seg.a, seg.b).along;
          const on = sel.kind === "opening" && sel.opening === i;
          return html`<button type="button" class="hme-list-row ${on ? "on" : ""}" @click=${() => ctx.select({ kind: "opening", roomId, opening: i })}>
            <span class="hme-grow">${homeMapOpeningName(o)}</span><span class="mono dim">${homeMapMeters(Math.abs(sb - sa))} · ${homeMapMeters(Math.max(0, Math.min(sa, sb)))} in</span></button>`;
        })}
        ${onWall.length === 0 ? html`<p class="hme-empty-line">Nothing on this wall.</p>` : nothing}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${() => add("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${() => add("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${() => add("opening")}>＋ Way through</button>
        </div>`)}
      ${opening === undefined || sel.kind !== "opening" ? nothing : this.openingCard(ctx, room, sel.opening, opening)}`;
  }

  private openingCard(ctx: HomeMapEditorContext, room: HomeMapRoom, index: number, o: HomeMapOpening): TemplateResult {
    const roomId = room.id;
    const width = Math.hypot(o.b[0] - o.a[0], o.b[1] - o.a[1]);
    const tall = o.z1 - o.z0;
    return hmeCard(homeMapOpeningName(o), html`
      <div class="hme-pics">${HOME_MAP_OPENING_CHOICES.map((c) => hmePic({
        label: c.label,
        picture: OPENING_PICTURES[c.label]!,
        on: o.kind === c.kind && o.style === c.style,
        click: () => ctx.apply((d) => setOpening(d, roomId, index, { kind: c.kind, style: c.style ?? null })),
      }))}</div>
      ${hmeRow("Width", hmeNumber({ label: "Width", value: width, unit: "m", min: 0.1, max: 20, set: (v) => ctx.apply((d) => setOpening(d, roomId, index, { width: v })) }))}
      ${hmeRow("From floor",
        hmeNumber({ label: "From floor", value: o.z0, unit: "m", min: 0, max: 20, set: (v) => ctx.apply((d) => setOpening(d, roomId, index, { z0: v, z1: v + tall })) }),
        html`<span class="hme-l short">Tall</span>`,
        hmeNumber({ label: "Tall", value: tall, unit: "m", min: 0.05, max: 20, set: (v) => ctx.apply((d) => setOpening(d, roomId, index, { z1: o.z0 + v })) }))}
      ${hmeHint("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removeOpening(d, roomId, index), { select: { kind: "room", roomId } })}>Remove ${homeMapOpeningName(o).toLowerCase()}</button></div>`);
  }

  private cornerCard(ctx: HomeMapEditorContext, room: HomeMapRoom, index: number): TemplateResult {
    const roomId = room.id;
    const p = room.outline[index];
    if (p === undefined) return html``;
    const shared = ctx.floor.rooms.filter((r) => !sameHomeMapId(r.id, roomId) && r.outline.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) <= 0.02));
    return hmeCard("Corner", html`
      ${hmeRow("Room", html`<span class="hme-val strong">${homeMapRoomName(room)}</span>`)}
      ${hmeRow("Left, top",
        hmeNumber({ label: "Corner left", value: p[0], unit: "m", set: (v) => ctx.apply((d) => moveCorner(d, roomId, index, [v, p[1]])) }),
        hmeNumber({ label: "Corner top", value: p[1], unit: "m", set: (v) => ctx.apply((d) => moveCorner(d, roomId, index, [p[0], v])) }))}
      ${hmeHint(shared.length === 0 ? "Drag it on the plan. Drop it on another room's corner and the two move together after." : `Shared with ${shared.map(homeMapRoomName).join(", ")}, which move${shared.length === 1 ? "s" : ""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${room.outline.length <= 3} @click=${() => ctx.apply((d) => removeCorner(d, roomId, index), { select: { kind: "room", roomId } })}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, roomId))}>Square the corners</button>
      </div>`);
  }
}

// ── pictures ─────────────────────────────────────────────────────────────

const TOOL_ICONS: Readonly<Record<HomeMapShapeTool, TemplateResult>> = {
  select: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,
  draw: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,
  split: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,
  inner: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,
  door: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,
  window: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,
  opening: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,
  stairs: html`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`,
};

/** Each opening kind drawn small, as the plan draws it. */
const OPENING_PICTURES: Readonly<Record<string, TemplateResult>> = {
  Door: html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,
  "Double door": html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,
  "Sliding door": html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,
  Window: html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,
  "Sliding window": html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,
  "Way through": html`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`,
};
