// The floor's checks in the map editor, on the side panel while nothing is
// picked: the gaps in its walls (`open-edges.ts`) and the doors whose swing
// runs into something (`door-swing.ts`), each a row with Show, which picks
// the first one, and a button that fixes them all in one undo step. Nothing
// while the floor has neither. The devices never draw it.

import { type TemplateResult, html, nothing } from "lit";
import { fixDoorSwings, homeMapSwingClashes } from "./door-swing.js";
import { hmeCard, hmeHint } from "./editor-parts.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { homeMapCount } from "./editor-view.js";
import type { HomeMapDocument, HomeMapFloor } from "./model.js";
import { addOpenEdgeWalls, homeMapFirstOpenRoom, homeMapOpenEdgeCount } from "./open-edges.js";

/** Whether Fix swings can make this floor's swings clash less, kept per
 * floor object, as the panel draws on every state change. */
const fixMemo = new WeakMap<HomeMapFloor, boolean>();

function swingsCanImprove(doc: HomeMapDocument, floor: HomeMapFloor): boolean {
  const held = fixMemo.get(floor);
  if (held !== undefined) return held;
  const can = fixDoorSwings(doc, floor.id) !== undefined;
  fixMemo.set(floor, can);
  return can;
}

/** The checks' words, for the card and its tests: "2 gaps in the walls",
 * "1 door swings into something". */
export function homeMapGapWords(gaps: number): string {
  return `${homeMapCount(gaps, "gap")} in the walls`;
}

export function homeMapClashWords(doors: number): string {
  return `${homeMapCount(doors, "door")} ${doors === 1 ? "swings" : "swing"} into something`;
}

/** The floor's checks card; nothing when there is nothing to check. */
export function homeMapFloorChecksCard(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
  const floor = ctx.floor;
  const gaps = homeMapOpenEdgeCount(floor);
  const clashes = homeMapSwingClashes(floor);
  if (gaps === 0 && clashes.length === 0) return nothing;
  const floorId = floor.id;
  const showGap = () => {
    const room = homeMapFirstOpenRoom(floor);
    if (room !== undefined) ctx.select({ kind: "room", roomId: room.id });
  };
  const showClash = () => {
    const first = clashes[0];
    if (first !== undefined) ctx.select({ kind: "opening", roomId: first.door.roomId, opening: first.door.index });
  };
  const fixable = clashes.length > 0 && swingsCanImprove(ctx.doc, floor);
  const total = gaps + clashes.length;
  const row = (words: TemplateResult, acts: TemplateResult) => html`<div class="hme-fix">
    <span class="hme-fix-dot"></span>
    <div class="hme-fix-t">${words}<span class="hme-fix-acts">${acts}</span></div></div>`;
  return hmeCard("Check", html`
    ${gaps === 0 ? nothing : row(
      html`<p @click=${showGap}><b>${homeMapGapWords(gaps)}.</b> Dashed amber on the plan. Leave one open for a stairwell.</p>`,
      html`<button type="button" class="hme-tb hme-blue" title="Put a wall along every gap of this floor"
          @click=${() => ctx.apply((d) => addOpenEdgeWalls(d, floorId))}>Add walls</button>
        <button type="button" class="hme-tb" title="Pick the first room with a gap" @click=${showGap}>Show</button>`)}
    ${clashes.length === 0 ? nothing : row(
      html`<p @click=${showClash}><b>${homeMapClashWords(clashes.length)}.</b> ${fixable ? "Hung from their other side, fewer of them do." : "Hanging them the other way does not help. Show picks the first one."}</p>`,
      html`${fixable ? html`<button type="button" class="hme-tb hme-blue" title="Hang each of these doors from the side where it swings free"
          @click=${() => ctx.apply((d) => fixDoorSwings(d, floorId))}>Fix swings</button>` : nothing}
        <button type="button" class="hme-tb" title="Pick the first door that swings into something" @click=${showClash}>Show</button>`)}
    ${hmeHint("Each fix is one step, so Undo puts it back.", true)}`, String(total), "hme-checks");
}
