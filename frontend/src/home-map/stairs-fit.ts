// Add stairs here: a room named for its stairs ("stairs", "Stairwell") that
// holds no stairs gets a card in the map editor with one button, which puts
// the catalog's flight of stairs in it, fitted to the room: its length along
// the room's long way, against the long wall with fewer doors. One edit, so
// one undo. The devices never draw the card; they draw the stairs.

import { type TemplateResult, html, nothing } from "lit";
import { addPiece, homeMapRoomFrame, setObject } from "./edit-ops.js";
import { hmeCard, hmeHint } from "./editor-parts.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { homeMapPiece } from "./furniture.js";
import { HOME_WALL_THICKNESS } from "./geometry.js";
import { type HomeMapDocument, type HomeMapRoom, type HomePoint, sameHomeMapId } from "./model.js";

/** The catalog piece the button adds. */
const FLIGHT = "stairsFlight";

/** How far a flight stands off the walls' inner faces, in meters. */
const CLEAR = 0.05;

/** A flight is at least this wide, in meters, or the room is too small. */
const NARROWEST = 0.6;

/** Whether the room says it is stairs and holds none. */
export function homeMapWantsStairs(room: Pick<HomeMapRoom, "name" | "objects">): boolean {
  return /stair/i.test(room.name ?? "") && !room.objects.some((o) => o.kind === "stairs");
}

/** The flight fitted to the room: its middle, size and turn; undefined for
 * a room too small or with no box. It runs along the room's long way when
 * that leaves every door clear, else along the short way; against one of
 * the two walls it runs beside, in the middle of that wall or slid to
 * either end, the first of those that stands in front of no door or way
 * through, and the one in front of fewest when none is clear. */
export function homeMapStairsFit(room: HomeMapRoom, piece: { size: readonly [number, number, number] }): { c: HomePoint; size: [number, number, number]; turn: number } | undefined {
  const frame = homeMapRoomFrame(room);
  if (frame === undefined) return undefined;
  const inset = HOME_WALL_THICKNESS / 2 + CLEAR;
  const ways = [
    { long: frame.u, side: frame.v, l0: frame.a0, l1: frame.a1, s0: frame.c0, s1: frame.c1 },
    { long: frame.v, side: frame.u, l0: frame.c0, l1: frame.c1, s0: frame.a0, s1: frame.a1 },
  ].sort((p, q) => (q.l1 - q.l0) - (p.l1 - p.l0));
  const doors = room.openings.filter((o) => o.kind !== "window");
  const dot = (p: readonly number[], d: HomePoint) => p[0]! * d[0] + p[1]! * d[1];
  let best: { c: HomePoint; size: [number, number, number]; turn: number; blocks: number } | undefined;
  for (const way of ways) {
    const length = Math.min(piece.size[1], way.l1 - way.l0 - 2 * inset);
    const width = Math.min(piece.size[0], way.s1 - way.s0 - 2 * inset);
    if (length < 1 || width < NARROWEST) continue;
    const middle = (way.l0 + way.l1) / 2;
    const slides = [middle, way.l0 + inset + length / 2, way.l1 - inset - length / 2];
    for (const wall of [way.s0, way.s1]) {
      for (const a of slides) {
        // The doors on this wall whose stretch along it meets the flight's.
        const blocks = doors.filter((o) => {
          if (Math.abs(dot(o.a, way.side) - wall) > 0.3 || Math.abs(dot(o.b, way.side) - wall) > 0.3) return false;
          const p = dot(o.a, way.long);
          const q = dot(o.b, way.long);
          return Math.max(p, q) > a - length / 2 && Math.min(p, q) < a + length / 2;
        }).length;
        if (best !== undefined && blocks >= best.blocks) continue;
        const c = wall === way.s0 ? wall + inset + width / 2 : wall - inset - width / 2;
        // Its depth, the way it rises, along the way it runs: a box's depth
        // runs along (-sin, cos) of its angle, and its angle is minus its
        // turn.
        const angle = Math.atan2(-way.long[0], way.long[1]);
        const height = room.height > 0 ? room.height : piece.size[2];
        best = {
          c: [a * way.long[0] + c * way.side[0], a * way.long[1] + c * way.side[1]],
          size: [round(width), round(length), round(height)],
          turn: round((-angle * 180) / Math.PI),
          blocks,
        };
        if (blocks === 0) return withoutBlocks(best);
      }
    }
  }
  return best === undefined ? undefined : withoutBlocks(best);
}

const round = (v: number) => Math.round(v * 100) / 100;

function withoutBlocks(fit: { c: HomePoint; size: [number, number, number]; turn: number; blocks: number }) {
  return { c: fit.c, size: fit.size, turn: fit.turn };
}

/** The room with the flight of stairs fitted in it; undefined for no such
 * room, no such piece, or a room too small. */
export function addStairsToRoom(doc: HomeMapDocument, roomId: string): HomeMapDocument | undefined {
  const piece = homeMapPiece(FLIGHT);
  const room = doc.floors.flatMap((f) => f.rooms).find((r) => sameHomeMapId(r.id, roomId));
  if (piece === undefined || room === undefined) return undefined;
  const fit = homeMapStairsFit(room, piece);
  if (fit === undefined) return undefined;
  const added = addPiece(doc, roomId, piece, fit.c);
  if (added === undefined) return undefined;
  return setObject(added, roomId, room.objects.length, { c: fit.c, size: fit.size, turn: fit.turn });
}

/** The card: nothing for a room that holds stairs or is not named for them. */
export function homeMapStairsCard(ctx: HomeMapEditorContext, room: HomeMapRoom): TemplateResult | typeof nothing {
  if (!homeMapWantsStairs(room)) return nothing;
  const piece = homeMapPiece(FLIGHT);
  if (piece === undefined || homeMapStairsFit(room, piece) === undefined) return nothing;
  const index = room.objects.length;
  return hmeCard("Stairs", html`
    <p class="hme-text">This room has no stairs drawn in it yet.</p>
    <button type="button" class="hme-tb hme-blue hme-wide" title="Put a flight of stairs in this room, sized to fit"
      @click=${() => ctx.apply((d) => addStairsToRoom(d, room.id), { select: { kind: "object", roomId: room.id, object: index } })}>Add stairs here</button>
    ${hmeHint("Drag it or its corners after, to match the real stairs.", true)}`);
}
