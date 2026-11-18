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
  return html`<details class="hme-card hme-fold" ?open=${open} data-fold=${HOME_MAP_LINE_UP_FOLD}
    @toggle=${(e: Event) => {
      const now = (e.currentTarget as HTMLDetailsElement).open;
      if (now === homeMapFoldOpen(HOME_MAP_LINE_UP_FOLD)) return;
      homeMapKeepFold(HOME_MAP_LINE_UP_FOLD, now);
      ctx.redraw();
    }}>
    <summary class="hme-h">Line up over ${homeMapFloorName(below)}<span class="hme-h-end">${floor.place === undefined ? "Centred" : "Placed"}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">
      ${hmeHint(`${homeMapFloorName(below)} shows dashed on the plan. Drag a number sideways to move this floor over it until the walls match.`, true)}
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
