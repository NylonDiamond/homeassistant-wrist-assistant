// What a click on the map editor's flat plan picks, worked out without a
// press, and the soft mark the plan draws on it while the pointer rests
// there, as the complication editor tints the layer under its pointer.
//
// The click and the hover share these finders, so the two never disagree:
// a device's pin first (a light a lamp holds being its lamp), then the
// smallest thing under the point that is not hidden, then the room. The
// edit page's own presses (`mode-devices.ts`, `mode-arrange.ts`) find their
// pin and thing here too.
//
// The hover mark is lighter than the picked blue (a pale tint and a thin
// line where the pick has a solid line and handles) and is never drawn on
// what is picked already: that one is lit, and a hover on it says nothing
// new.

import { type SVGTemplateResult, nothing, svg } from "lit";
import { homeMapThingOfPin } from "./edit-ops.js";
import { type HomeMapSelection, homeMapPickedThings } from "./editor-mode.js";
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

/** What a plain click at plan point `at` picks while the floor is edited
 * with the Pick tool: a pin (a pin a thing holds picking its thing), else
 * a thing, else a room, else nothing. */
export function homeMapClickPick(floor: HomeMapFloor, toScreen: ToScreen, at: HomePoint): HomeMapSelection | undefined {
  const pin = homeMapPinAt(floor, toScreen, toScreen(at));
  if (pin !== undefined) {
    const thing = homeMapThingOfPin(floor, pin.id);
    return thing === undefined ? { kind: "pin", pinId: pin.id } : { kind: "object", roomId: thing.roomId, object: thing.object };
  }
  const thing = homeMapThingUnder(floor, at);
  if (thing !== undefined) return { kind: "object", roomId: thing.room.id, object: thing.index };
  const room = homeRoomUnder(floor, at);
  return room === undefined ? undefined : { kind: "room", roomId: room.id };
}

/** The hover, unless what it names is picked already (alone or among
 * several) or is not a room, thing or pin. */
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
