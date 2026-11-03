// What a click on the map editor's flat plan picks, worked out without a
// press, and the soft mark the plan draws on it while the pointer rests
// there, as the complication editor tints the layer under its pointer.
//
// The click and the hover share these finders, so the two never disagree:
// a device's pin first (a light a lamp holds being its lamp), then a door or
// window, a wall the point is right on, the smallest thing under the point
// that is not hidden, a wall the point is near, then the room. The
// edit page's own presses (`mode-devices.ts`, `mode-arrange.ts`) find their
// pin and thing here too.
//
// The hover mark is lighter than the picked blue (a pale tint and a thin
// line where the pick has a solid line and handles) and is never drawn on
// what is picked already: that one is lit, and a hover on it says nothing
// new.

import { type SVGTemplateResult, nothing, svg } from "lit";
import { homeMapRoomWalls, homeMapThingOfPin } from "./edit-ops.js";
import { type HomeMapSelection, homeMapPickedThings, sameHomeMapSelection } from "./editor-mode.js";
import { homeBoxCorners, homeBoxOf, homePolygonArea, homePolygonHolds, homeRoomUnder } from "./geometry.js";
import { type HomeMapFloor, type HomeMapObject, type HomeMapPin, type HomeMapRoom, type HomePoint, sameHomeMapId } from "./model.js";

/** A press this near a pin's middle, in stage pixels, picks it. */
export const HOME_MAP_PIN_REACH = 15;

/** Plan meters to stage pixels. */
type ToScreen = (p: readonly number[]) => HomePoint;

/** The pin a press at stage point `s` lands on: the nearest within reach,
 * the later of two as near. */
export function homeMapPinAt(floor: HomeMapFloor, toScreen: ToScreen, s: HomePoint): HomeMapPin | undefined {
  let best: HomeMapPin | undefined;
  let bestD = HOME_MAP_PIN_REACH;
  for (const pin of floor.pins) {
    const p = toScreen(pin.at);
    const d = Math.hypot(p[0] - s[0], p[1] - s[1]);
    if (d <= bestD) {
      best = pin;
      bestD = d;
    }
  }
  return best;
}

/** A thing as the editor finds it: its room and its place in that room's
 * list, which is how a selection names it. */
export interface HomeMapThingAt {
  room: HomeMapRoom;
  index: number;
  object: HomeMapObject;
}

/** The thing under plan point `at`, in `room` or in any room of the floor:
 * the smallest where several overlap, a hidden one never. */
export function homeMapThingUnder(floor: HomeMapFloor, at: HomePoint, room?: HomeMapRoom): HomeMapThingAt | undefined {
  let best: { thing: HomeMapThingAt; area: number } | undefined;
  for (const r of room === undefined ? floor.rooms : [room]) {
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

/** How near a door or window a press must land to pick it, in pixels. */
export const HOME_MAP_OPENING_REACH = 10;
/** A press this near a wall picks it, over a thing standing against it. */
export const HOME_MAP_WALL_ON = 6;
/** A press this near a wall picks it, over the room's floor. */
export const HOME_MAP_WALL_NEAR = 12;

/** How far stage point `s` lies from the line from `a` to `b`, its ends
 * included, in pixels. */
function pixelsFrom(s: HomePoint, a: HomePoint, b: HomePoint): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = dx * dx + dy * dy;
  const k = length <= 0 ? 0 : Math.max(0, Math.min(1, ((s[0] - a[0]) * dx + (s[1] - a[1]) * dy) / length));
  return Math.hypot(s[0] - (a[0] + dx * k), s[1] - (a[1] + dy * k));
}

/** The door or window nearest plan point `at`, within reach. */
export function homeMapOpeningAt(floor: HomeMapFloor, toScreen: ToScreen, at: HomePoint): { roomId: string; opening: number } | undefined {
  const s = toScreen(at);
  let best: { roomId: string; opening: number; d: number } | undefined;
  for (const room of floor.rooms) {
    room.openings.forEach((o, opening) => {
      const d = pixelsFrom(s, toScreen(o.a), toScreen(o.b));
      if (d <= HOME_MAP_OPENING_REACH && (best === undefined || d < best.d)) best = { roomId: room.id, opening, d };
    });
  }
  return best === undefined ? undefined : { roomId: best.roomId, opening: best.opening };
}

/** The wall nearest plan point `at`, within `reach` pixels; among walls of two
 * rooms about as near, the wall of the room `prefer` names. */
export function homeMapWallAt(floor: HomeMapFloor, toScreen: ToScreen, at: HomePoint, reach: number, prefer?: string): { roomId: string; wall: number } | undefined {
  const s = toScreen(at);
  let best: { roomId: string; wall: number; d: number } | undefined;
  for (const room of floor.rooms) {
    const own = prefer !== undefined && sameHomeMapId(room.id, prefer);
    homeMapRoomWalls(room).forEach((w, wall) => {
      const d = pixelsFrom(s, toScreen(w.a), toScreen(w.b));
      if (d > reach) return;
      // Two walls a few pixels apart: the one the pick is already on.
      const score = own ? d - 4 : d;
      if (best === undefined || score < best.d) best = { roomId: room.id, wall, d: score };
    });
  }
  return best === undefined ? undefined : { roomId: best.roomId, wall: best.wall };
}

/** The door, window or wall a click at plan point `at` lands on, if any: an
 * opening first, a wall right under the point, then a wall near it where no
 * thing stands under the point. */
export function homeMapPieceAt(floor: HomeMapFloor, toScreen: ToScreen, at: HomePoint, prefer?: string): Extract<HomeMapSelection, { kind: "wall" | "opening" }> | undefined {
  const opening = homeMapOpeningAt(floor, toScreen, at);
  if (opening !== undefined) return { kind: "opening", ...opening };
  const on = homeMapWallAt(floor, toScreen, at, HOME_MAP_WALL_ON, prefer);
  if (on !== undefined) return { kind: "wall", ...on };
  if (homeMapThingUnder(floor, at) !== undefined) return undefined;
  const near = homeMapWallAt(floor, toScreen, at, HOME_MAP_WALL_NEAR, prefer);
  return near === undefined ? undefined : { kind: "wall", ...near };
}

/** What a plain click at plan point `at` picks with the Pick tool: a pin (a
 * pin a thing holds picking its thing), else a door, window or wall
 * (`homeMapPieceAt`), else a thing, else a room, else nothing. */
export function homeMapClickPick(floor: HomeMapFloor, toScreen: ToScreen, at: HomePoint, prefer?: string): HomeMapSelection | undefined {
  const pin = homeMapPinAt(floor, toScreen, toScreen(at));
  if (pin !== undefined) {
    const thing = homeMapThingOfPin(floor, pin.id);
    return thing === undefined ? { kind: "pin", pinId: pin.id } : { kind: "object", roomId: thing.roomId, object: thing.object };
  }
  const piece = homeMapPieceAt(floor, toScreen, at, prefer);
  if (piece !== undefined) return piece;
  const thing = homeMapThingUnder(floor, at);
  if (thing !== undefined) return { kind: "object", roomId: thing.room.id, object: thing.index };
  const room = homeRoomUnder(floor, at);
  return room === undefined ? undefined : { kind: "room", roomId: room.id };
}

/** The hover, unless what it names is picked already (alone or among
 * several) or is a corner. */
export function homeMapLiveHover(hover: HomeMapSelection | undefined, selection: HomeMapSelection | undefined): HomeMapSelection | undefined {
  if (hover === undefined) return undefined;
  if (hover.kind === "room") return selection?.kind === "room" && sameHomeMapId(selection.roomId, hover.roomId) ? undefined : hover;
  if (hover.kind === "object") {
    const picked = homeMapPickedThings(selection).some((t) => sameHomeMapId(t.roomId, hover.roomId) && t.object === hover.object);
    return picked ? undefined : hover;
  }
  if (hover.kind === "pin") {
    const picked = selection?.kind === "pin" ? [selection.pinId] : selection?.kind === "pins" ? selection.pinIds : [];
    return picked.some((id) => sameHomeMapId(id, hover.pinId)) ? undefined : hover;
  }
  if (hover.kind === "wall" || hover.kind === "opening") return sameHomeMapSelection(hover, selection) ? undefined : hover;
  return undefined;
}

/** The hover's tint and line, a lighter blue than the pick's. */
const HOVER_FILL = "rgba(91,141,239,0.14)";
const HOVER_ROOM_FILL = "rgba(91,141,239,0.07)";
const HOVER_LINE = "rgba(150,186,255,0.75)";

const pt = (p: readonly number[]) => `${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`;

/** The soft mark on the hovered room, thing or pin, in stage pixels, or
 * nothing (no hover, or the hover is picked already). A hidden thing a
 * list row hovers is marked where it stands, dashed. */
export function homeMapHoverMark(floor: HomeMapFloor, hover: HomeMapSelection | undefined, selection: HomeMapSelection | undefined, toScreen: ToScreen): SVGTemplateResult | typeof nothing {
  const h = homeMapLiveHover(hover, selection);
  if (h === undefined) return nothing;
  if (h.kind === "pin") {
    const pin = floor.pins.find((p) => sameHomeMapId(p.id, h.pinId));
    if (pin === undefined) return nothing;
    const [x, y] = toScreen(pin.at);
    return svg`<g class="hme-hover" pointer-events="none"><circle cx=${x.toFixed(1)} cy=${y.toFixed(1)} r="18" fill=${HOVER_FILL} stroke=${HOVER_LINE} stroke-width="1.5" /></g>`;
  }
  const room = floor.rooms.find((r) => sameHomeMapId(r.id, (h as { roomId: string }).roomId));
  if (room === undefined) return nothing;
  if (h.kind === "wall" || h.kind === "opening") {
    const piece = h.kind === "wall" ? homeMapRoomWalls(room)[h.wall] : room.openings[h.opening];
    if (piece === undefined) return nothing;
    const [x1, y1] = toScreen(piece.a);
    const [x2, y2] = toScreen(piece.b);
    return svg`<g class="hme-hover" pointer-events="none"><line x1=${x1.toFixed(1)} y1=${y1.toFixed(1)} x2=${x2.toFixed(1)} y2=${y2.toFixed(1)} stroke=${HOVER_LINE} stroke-width="6" stroke-linecap="round" /></g>`;
  }
  if (h.kind === "object") {
    const object = room.objects[h.object];
    if (object === undefined) return nothing;
    const box = homeBoxCorners(homeBoxOf(object)).map((p) => pt(toScreen(p))).join(" ");
    return svg`<g class="hme-hover" pointer-events="none"><polygon points=${box} fill=${HOVER_FILL} stroke=${HOVER_LINE} stroke-width="1.5"
      stroke-dasharray=${object.hidden === true ? "4 3" : "none"} stroke-linejoin="round" /></g>`;
  }
  if (room.outline.length < 3) return nothing;
  const outline = room.outline.map((p) => pt(toScreen(p))).join(" ");
  return svg`<g class="hme-hover" pointer-events="none"><polygon points=${outline} fill=${HOVER_ROOM_FILL} stroke=${HOVER_LINE} stroke-width="1.5" stroke-linejoin="round" /></g>`;
}
