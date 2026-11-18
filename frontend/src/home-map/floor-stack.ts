// How the floors of the house sit over each other, and Line up floors in the
// map editor. The same rules as the app's `HomeMapStack` ("Stacked floors" in
// the app repo's docs/home_map_plan_2026-10.md): each floor is its own scan
// with its own plan, and only a floor's `place` says how it lies over the
// others. The house's frame is the plan of the base floor, the lowest story
// (the first in `floors` on a tie); a floor goes into it by its `place`, or,
// with none, centred: the middle of its rooms' outlines on the middle of the
// base floor's, not turned.
//
// The editor's Floor card lines a floor up over the one right below it, as
// the iPhone's Line Up Floors does: the floor below drawn dashed on the plan
// while the card's Line up section is open, and its place as numbers that a
// sideways drag moves live, a quarter turn either way, and Centre.

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { setFloorPlace } from "./edit-ops.js";
import { hmeFields, hmeHint, hmeNumber, homeMapFoldOpen, homeMapKeepFold } from "./editor-parts.js";
import { homePointBounds, homePolygonHolds } from "./geometry.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { type HomeMapDocument, type HomeMapFloor, type HomeMapFloorPlace, type HomePoint, homeMapFloorName } from "./model.js";

const NO_PLACE: HomeMapFloorPlace = { x: 0, y: 0, turn: 0 };

/** The floors bottom to top: by story, a tie in the order of `floors`. */
export function homeMapFloorsUp<F extends Pick<HomeMapFloor, "story">>(floors: readonly F[]): F[] {
  return floors.map((f, i) => ({ f, i })).sort((a, b) => a.f.story - b.f.story || a.i - b.i).map(({ f }) => f);
}

/** The floor right below the floor `floorId`, undefined for the base one. */
export function homeMapFloorBelow(floors: readonly HomeMapFloor[], floorId: string): HomeMapFloor | undefined {
  const up = homeMapFloorsUp(floors);
  const i = up.findIndex((f) => f.id.toUpperCase() === floorId.toUpperCase());
  return i > 0 ? up[i - 1] : undefined;
}

/** The middle of a floor's rooms' outlines, undefined with no rooms. */
export function homeMapFloorMiddle(floor: Pick<HomeMapFloor, "rooms">): HomePoint | undefined {
  const points = floor.rooms.flatMap((r) => r.outline);
  if (points.length === 0) return undefined;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

/** Where a floor sits in the house's frame: not moved for the base floor
 * (its own place is ignored), its place when it has one, else centred on
 * the base floor. */
export function homeMapFloorPlaceOf(floors: readonly HomeMapFloor[], floor: HomeMapFloor): HomeMapFloorPlace {
  const base = homeMapFloorsUp(floors)[0];
  if (base === undefined || base.id.toUpperCase() === floor.id.toUpperCase()) return NO_PLACE;
  if (floor.place !== undefined) return floor.place;
  const mine = homeMapFloorMiddle(floor);
  const theirs = homeMapFloorMiddle(base);
  return mine === undefined || theirs === undefined ? NO_PLACE : { x: theirs[0] - mine[0], y: theirs[1] - mine[1], turn: 0 };
}

/** A point of a floor's plan in the house's frame: turned round the plan's
 * 0, 0 by `turn` degrees (counterclockwise on the plan as drawn), then moved
 * by `x`, `y`. */
export function homeMapPlaceApply(place: HomeMapFloorPlace, p: readonly number[]): HomePoint {
  const t = (place.turn * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [place.x + p[0]! * c + p[1]! * s, place.y - p[0]! * s + p[1]! * c];
}

/** A point of the house's frame in the plan of the floor sat by `place`. */
export function homeMapPlaceUnapply(place: HomeMapFloorPlace, h: readonly number[]): HomePoint {
  const t = (place.turn * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const dx = h[0]! - place.x;
  const dy = h[1]! - place.y;
  return [c * dx - s * dy, s * dx + c * dy];
}

/** `place` turned to `turn` degrees round `pivot` (a point of the floor's
 * plan, its middle), so that point stays where it is in the house. */
export function homeMapPlaceTurned(place: HomeMapFloorPlace, turn: number, pivot: HomePoint): HomeMapFloorPlace {
  const fixed = homeMapPlaceApply(place, pivot);
  const moved = homeMapPlaceApply({ x: 0, y: 0, turn }, pivot);
  return { x: fixed[0] - moved[0], y: fixed[1] - moved[1], turn };
}

/** The floor below's room outlines in the plan of `floor`, as `floor` sits
 * now: where they lie under it. */
export function homeMapFloorBelowOutlines(doc: Pick<HomeMapDocument, "floors">, floor: HomeMapFloor): HomePoint[][] {
  const below = homeMapFloorBelow(doc.floors, floor.id);
  if (below === undefined) return [];
  // The floor on the stage carries a preview of its place, so it is read
  // from `floor` and not from the document.
  const floors = doc.floors.map((f) => (f.id.toUpperCase() === floor.id.toUpperCase() ? floor : f));
  const under = homeMapFloorPlaceOf(floors, below);
  const over = homeMapFloorPlaceOf(floors, floor);
  return below.rooms.map((room) => room.outline.map((q) => homeMapPlaceUnapply(over, homeMapPlaceApply(under, q))));
}

// ── Line up for me ─────────────────────────────────────────────────────

/** Where Line up for me puts a floor, and how much of the two floors' rooms
 * then lie over each other: 0 to 1, the shared area over the area either
 * covers. */
export interface HomeMapLineUp {
  place: HomeMapFloorPlace;
  match: number;
}

/** The grid the first, rough search reads the floors on, and steps by, in
 * meters; then the fine one, round the best rough place. */
const LINE_UP_ROUGH = 0.25;
const LINE_UP_FINE = 0.05;

/** The furthest a rough search moves a floor from centred, in meters. */
const LINE_UP_REACH = 10;

/** Cell middles of a `step` grid that lie in any of `outlines`. */
function cellsIn(outlines: readonly HomePoint[][], step: number): HomePoint[] {
  const out: HomePoint[] = [];
  for (const outline of outlines) {
    const b = homePointBounds(outline);
    if (b === undefined) continue;
    for (let y = Math.floor(b.minY / step) * step + step / 2; y < b.maxY; y += step) {
      for (let x = Math.floor(b.minX / step) * step + step / 2; x < b.maxX; x += step) {
        if (homePolygonHolds(outline, [x, y])) out.push([x, y]);
      }
    }
  }
  return out;
}

/** A grid of `step` cells over outlines, each cell in or out, to look a
 * point up in. */
function gridOf(outlines: readonly HomePoint[][], step: number) {
  const b = homePointBounds(outlines.flat());
  if (b === undefined) return undefined;
  const x0 = b.minX;
  const y0 = b.minY;
  const nx = Math.max(1, Math.ceil((b.maxX - x0) / step));
  const ny = Math.max(1, Math.ceil((b.maxY - y0) / step));
  const cells = new Uint8Array(nx * ny);
  let count = 0;
  for (const p of cellsIn(outlines, step)) {
    const i = Math.floor((p[0] - x0) / step);
    const j = Math.floor((p[1] - y0) / step);
    if (i < 0 || j < 0 || i >= nx || j >= ny || cells[j * nx + i] === 1) continue;
    cells[j * nx + i] = 1;
    count += 1;
  }
  const holds = (x: number, y: number) => {
    const i = Math.floor((x - x0) / step);
    const j = Math.floor((y - y0) / step);
    return i >= 0 && j >= 0 && i < nx && j < ny && cells[j * nx + i] === 1;
  };
  return { holds, count, middle: [(b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2] as HomePoint, reach: Math.max(b.maxX - b.minX, b.maxY - b.minY) };
}

/** How much of `points` (moved by `dx`, `dy`) land in `grid`, as shared
 * over either: points and cells being of one size. */
function matchOf(points: readonly HomePoint[], grid: NonNullable<ReturnType<typeof gridOf>>, dx: number, dy: number): number {
  let shared = 0;
  for (const p of points) if (grid.holds(p[0] + dx, p[1] + dy)) shared += 1;
  const either = points.length + grid.count - shared;
  return either === 0 ? 0 : shared / either;
}

/** A turn kept between -180 and 180. */
const halfTurn = (t: number) => ((((t + 180) % 360) + 360) % 360) - 180;

/**
 * Line up for me: where the floor `floorId` best lies over the floor right
 * below it, read from their rooms alone. Each quarter turn from the floor's
 * own turn is tried, and for each every place on a 25 cm grid out from
 * centred, the floors' rooms read on a 25 cm grid; then 5 cm steps round
 * the best two, read on a 5 cm grid. The best is the one whose rooms lie
 * most over the floor below's: their shared area over the area either
 * covers. Undefined for the base floor, or a floor or a floor below with no
 * rooms.
 */
export function homeMapLineUpFloor(doc: Pick<HomeMapDocument, "floors">, floorId: string): HomeMapLineUp | undefined {
  const floor = doc.floors.find((f) => f.id.toUpperCase() === floorId.toUpperCase());
  if (floor === undefined) return undefined;
  const below = homeMapFloorBelow(doc.floors, floor.id);
  if (below === undefined || below.rooms.length === 0 || floor.rooms.length === 0) return undefined;
  const under = homeMapFloorPlaceOf(doc.floors, below);
  const belowOutlines = below.rooms.map((r) => r.outline.map((q) => homeMapPlaceApply(under, q)));
  const ownOutlines = floor.rooms.map((r) => r.outline.map((q): HomePoint => [q[0], q[1]]));
  const roughGrid = gridOf(belowOutlines, LINE_UP_ROUGH);
  const fineGrid = gridOf(belowOutlines, LINE_UP_FINE);
  const pivot = homeMapFloorMiddle(floor);
  if (roughGrid === undefined || fineGrid === undefined || pivot === undefined) return undefined;
  const roughCells = cellsIn(ownOutlines, LINE_UP_ROUGH);
  const fineCells = cellsIn(ownOutlines, LINE_UP_FINE);
  const own = gridOf(ownOutlines, LINE_UP_ROUGH);
  const reach = Math.min(LINE_UP_REACH, (roughGrid.reach + (own?.reach ?? 0)) / 2);
  const steps = Math.ceil(reach / LINE_UP_ROUGH);
  const start = floor.place?.turn ?? 0;

  interface Try { turn: number; dx: number; dy: number; match: number; fine: HomePoint[] }
  const tries: Try[] = [];
  for (let k = 0; k < 4; k += 1) {
    const turn = halfTurn(start + 90 * k);
    const spin = { x: 0, y: 0, turn };
    const m = homeMapPlaceApply(spin, pivot);
    // The floor turned round its plan's 0, 0, then moved so its middle is
    // on the middle of the floor below.
    const ox = roughGrid.middle[0] - m[0];
    const oy = roughGrid.middle[1] - m[1];
    const rough = roughCells.map((q) => homeMapPlaceApply(spin, q));
    let best = { dx: ox, dy: oy, match: -1 };
    for (let j = -steps; j <= steps; j += 1) {
      for (let i = -steps; i <= steps; i += 1) {
        const dx = ox + i * LINE_UP_ROUGH;
        const dy = oy + j * LINE_UP_ROUGH;
        const match = matchOf(rough, roughGrid, dx, dy);
        if (match > best.match) best = { dx, dy, match };
      }
    }
    tries.push({ turn, ...best, fine: fineCells.map((q) => homeMapPlaceApply(spin, q)) });
  }
  tries.sort((p, q) => q.match - p.match);
  let out: HomeMapLineUp | undefined;
  for (const t of tries.slice(0, 2)) {
    const reachFine = Math.round(LINE_UP_ROUGH / LINE_UP_FINE);
    for (let j = -reachFine; j <= reachFine; j += 1) {
      for (let i = -reachFine; i <= reachFine; i += 1) {
        const dx = t.dx + i * LINE_UP_FINE;
        const dy = t.dy + j * LINE_UP_FINE;
        const match = matchOf(t.fine, fineGrid, dx, dy);
        if (out === undefined || match > out.match + 1e-9) out = { place: { x: dx, y: dy, turn: t.turn }, match };
      }
    }
  }
  return out;
}

/** What Line up for me last did, so its card can say how well it matched
 * while the floor still sits there. */
let lastLineUp: { floorId: string; place: HomeMapFloorPlace; match: number } | undefined;

const samePlace = (p: HomeMapFloorPlace | undefined, q: HomeMapFloorPlace) =>
  p !== undefined && Math.abs(p.x - q.x) < 0.006 && Math.abs(p.y - q.y) < 0.006 && Math.abs(halfTurn(p.turn - q.turn)) < 0.06;

/** The words after Line up for me: how much of the floor matches. */
export function homeMapLineUpWords(match: number): string {
  const percent = Math.round(match * 100);
  return percent >= 60 ? `Lined up. ${percent}% of the floor matches the one below.`
    : `Lined up as well as it goes: ${percent}% matches. Check the walls by eye.`;
}

/** The fold the Line up section opens in; the floor below shows dashed on
 * the plan while it is open. */
export const HOME_MAP_LINE_UP_FOLD = "floor-line-up";

/** The floor below, dashed in screen space, while the Line up section is
 * open and the Floor card shows (nothing picked). */
export function homeMapFloorBelowMarks(ctx: HomeMapEditorContext): SVGTemplateResult[] {
  if (ctx.selection !== undefined || !homeMapFoldOpen(HOME_MAP_LINE_UP_FOLD)) return [];
  return homeMapFloorBelowOutlines(ctx.doc, ctx.floor).map((outline) => {
    const points = outline.map((p) => ctx.toScreen(p).map((v) => v.toFixed(1)).join(",")).join(" ");
    return svg`<polygon class="hme-floor-below" points=${points} fill="rgba(120,170,255,0.06)" stroke="#78AAFF"
      stroke-width="1.5" stroke-dasharray="5 4" stroke-linejoin="round" pointer-events="none" />`;
  });
}

/** Line up over the floor below, for the Floor card: nothing for the base
 * floor or a map of one floor. */
export function homeMapLineUpCard(ctx: HomeMapEditorContext, floor: HomeMapFloor): TemplateResult | typeof nothing {
  const below = homeMapFloorBelow(ctx.doc.floors, floor.id);
  if (below === undefined) return nothing;
  const floors = ctx.doc.floors.map((f) => (f.id.toUpperCase() === floor.id.toUpperCase() ? floor : f));
  const place = homeMapFloorPlaceOf(floors, floor);
  const pivot = homeMapFloorMiddle(floor) ?? [0, 0];
  const id = floor.id;
  const to = (next: HomeMapFloorPlace) => (d: HomeMapDocument) => setFloorPlace(d, id, next);
  const edit = (make: (v: number) => HomeMapFloorPlace) => ({
    set: (v: number) => ctx.apply(to(make(v))),
    preview: (v: number | undefined) => ctx.preview(v === undefined ? undefined : to(make(v))),
  });
  const quarter = (by: number) => ctx.apply(to(homeMapPlaceTurned(place, place.turn + by, pivot)));
  const open = homeMapFoldOpen(HOME_MAP_LINE_UP_FOLD);
  const auto = () => {
    const found = homeMapLineUpFloor(ctx.doc, id);
    if (found === undefined) return;
    lastLineUp = { floorId: id, place: { x: Math.round(found.place.x * 100) / 100, y: Math.round(found.place.y * 100) / 100, turn: Math.round(found.place.turn * 100) / 100 }, match: found.match };
    homeMapKeepFold(HOME_MAP_LINE_UP_FOLD, true);
    ctx.apply(to(found.place));
  };
  const note = lastLineUp !== undefined && lastLineUp.floorId.toUpperCase() === id.toUpperCase() && samePlace(floor.place, lastLineUp.place)
    ? homeMapLineUpWords(lastLineUp.match) : undefined;
  return html`<details class="hme-card hme-fold" ?open=${open} data-fold=${HOME_MAP_LINE_UP_FOLD}
    @toggle=${(e: Event) => {
      const now = (e.currentTarget as HTMLDetailsElement).open;
      if (now === homeMapFoldOpen(HOME_MAP_LINE_UP_FOLD)) return;
      homeMapKeepFold(HOME_MAP_LINE_UP_FOLD, now);
      ctx.redraw();
    }}>
    <summary class="hme-h">Line up over ${homeMapFloorName(below)}<span class="hme-h-end">${floor.place === undefined ? "Centred" : "Placed"}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">
      <button type="button" class="hme-tb hme-blue hme-wide" title="Find where this floor's rooms lie best over the floor below, and put it there"
        @click=${auto}>Line up for me</button>
      ${note === undefined ? nothing : html`<p class="hme-text" role="status">${note}</p>`}
      ${hmeHint(`${homeMapFloorName(below)} shows dashed on the plan. Or drag a number sideways to move this floor over it until the walls match.`, true)}
      ${hmeFields(
        hmeNumber({ tag: "Across", label: "Across", value: place.x, unit: "m", min: -500, max: 500, ...edit((v) => ({ ...place, x: v })) }),
        hmeNumber({ tag: "Down", label: "Down", value: place.y, unit: "m", min: -500, max: 500, ...edit((v) => ({ ...place, y: v })) }),
        hmeNumber({ tag: "Turn", label: "Turn", value: place.turn, unit: "°", digits: 1, min: -180, max: 180, ...edit((v) => homeMapPlaceTurned(place, v, pivot)) }))}
      <div class="hme-row-end">
        <button type="button" class="hme-tb" title="Turn this floor a quarter one way" @click=${() => quarter(-90)}>−90°</button>
        <button type="button" class="hme-tb" title="Turn this floor a quarter the other way" @click=${() => quarter(90)}>+90°</button>
        <button type="button" class="hme-tb" ?disabled=${floor.place === undefined} title="Put this floor back in the middle of the lowest floor, not turned"
          @click=${() => ctx.apply((d) => setFloorPlace(d, id, undefined))}>Centre</button>
      </div>
    </div>
  </details>`;
}
