// A room's open edges in the map editor: the stretches of its outline with
// no wall and no room beside them (`homeOpenEdges`), where the house is open
// to nothing. A scan leaves one where it found no wall: a stairwell with a
// rail, or a wall it missed. The editor shows each as a dashed line on the
// plan and lists it on the room's card with Add wall; nothing is saved to
// say an edge is open on purpose, so the dash stays while it is open. The
// devices never draw it.

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { addInnerWall } from "./edit-ops.js";
import { hmeCard, hmeHint } from "./editor-parts.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { homeMapMeters } from "./editor-view.js";
import { HOME_WALL_THICKNESS, type HomeOpenEdge, homeOpenEdges } from "./geometry.js";
import type { HomeMapRoom } from "./model.js";

/** The dashed line's colour: the editor's amber, a fact to look at, not an
 * error. */
const OPEN_EDGE_INK = "#E8A33D";

/** A new wall on an open edge is as thick as the room's thickest wall. */
function wallThickness(room: HomeMapRoom): number {
  return room.walls.reduce((t, w) => Math.max(t, w.t), 0) || HOME_WALL_THICKNESS;
}

/** Every open edge of the floor's rooms, dashed, in screen space. */
export function homeMapOpenEdgeMarks(ctx: HomeMapEditorContext): SVGTemplateResult[] {
  return ctx.floor.rooms.flatMap((room) => homeOpenEdges(ctx.floor, room).map((edge) => {
    const [x1, y1] = ctx.toScreen(edge.a);
    const [x2, y2] = ctx.toScreen(edge.b);
    return svg`<line class="hme-open-edge" x1=${x1.toFixed(1)} y1=${y1.toFixed(1)} x2=${x2.toFixed(1)} y2=${y2.toFixed(1)}
      stroke=${OPEN_EDGE_INK} stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round" pointer-events="none" />`;
  }));
}

/** The words for one open edge on the card: "Bottom, 2.21 m". */
export function homeMapOpenEdgeText(edge: Pick<HomeOpenEdge, "side" | "length">): string {
  return `${edge.side.charAt(0).toUpperCase()}${edge.side.slice(1)}, ${homeMapMeters(edge.length)}`;
}

/** The room's open edges, each with Add wall; nothing for a room closed all
 * round. */
export function homeMapOpenEdgesCard(ctx: HomeMapEditorContext, room: HomeMapRoom): TemplateResult | typeof nothing {
  const edges = homeOpenEdges(ctx.floor, room);
  if (edges.length === 0) return nothing;
  const t = wallThickness(room);
  return hmeCard(edges.length === 1 ? "Open edge" : "Open edges", html`
    ${edges.map((edge) => html`<div class="hme-r"><span class="hme-l">${homeMapOpenEdgeText(edge)}</span>
      <button type="button" class="hme-tb" title="Put a wall along this edge"
        @click=${() => ctx.apply((d) => addInnerWall(d, room.id, edge.a, edge.b, t))}>Add wall</button></div>`)}
    ${hmeHint("No wall here and no room beside it, so the house is open: dashed on the plan. Leave it for a stairwell or an open side.", true)}`);
}
