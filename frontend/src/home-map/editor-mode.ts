// The contract between the map editor's shell (`home-map-editor.ts`) and
// its modes. The shell owns the bar, the stage (the plan drawn, pan and
// zoom, the measure tool, the dock), the selection, the undo stack and the
// saves; each mode is one file (`mode-arrange.ts`, `mode-shape.ts`, ...)
// exporting a `HomeMapMode` that draws its own left rail, inspector, stage
// overlay, selection pill and dock toggles from the `HomeMapEditorContext`
// the shell hands it on every draw, and answers the presses and keys the
// shell passes it.
//
// Rules a mode keeps:
//
// - Every change goes through `ctx.apply(op)`, with `op` an `edit-ops.ts`
//   function of the map naming things by id, so a save that meets a newer
//   map makes the same change there. Never change `ctx.doc` in place.
// - A drag shows its result live with `ctx.preview(op)` (the same kind of
//   op, made on `ctx.doc` each time, never saved) and calls `ctx.apply` once,
//   on the drop, with the op for the whole drag from where it started.
//   `ctx.drag` captures the pointer and hands back plan points in meters.
// - The overlay is drawn in stage pixels: `ctx.toScreen(p)` for a plan
//   point, `ctx.px(m)` for a length. Elements a press should find carry
//   `data-hme="..."`; the shell's own art takes no presses.
// - A mode's own state (its tool, a half-drawn room) lives on the mode
//   object; call `ctx.redraw()` after changing it.
// - Keys reach a mode only when no text field has focus and no dialog is
//   open; a mode returns true for a key it used.
// - `ctx.confirm` and `ctx.ask` are the page's own dialogs, never the
//   browser's.

import type { SVGTemplateResult, TemplateResult, nothing } from "lit";
import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { HomeMapOp } from "./edit-ops.js";
import type { HomeMapView } from "./editor-view.js";
import type { HomeMapDocument, HomeMapFloor, HomeMapScans, HomePoint } from "./model.js";
import { sameHomeMapId } from "./model.js";
import { homeMapRoomWalls } from "./edit-ops.js";

/** The editor's four modes, in the bar's order. */
export type HomeMapModeId = "arrange" | "shape" | "devices" | "style";
export const HOME_MAP_MODE_IDS: readonly HomeMapModeId[] = ["arrange", "shape", "devices", "style"];
export const HOME_MAP_MODE_LABELS: Readonly<Record<HomeMapModeId, string>> = {
  arrange: "Arrange",
  shape: "Shape",
  devices: "Devices",
  style: "Style",
};

/** What is picked. Indexes are a room's walls as `homeMapRoomWalls` numbers
 * them, its outline corners, openings and objects. `pins` is two or more
 * pins picked at once in Devices, in the order picked (one is `pin`). */
export type HomeMapSelection =
  | { kind: "room"; roomId: string }
  | { kind: "wall"; roomId: string; wall: number }
  | { kind: "corner"; roomId: string; corner: number }
  | { kind: "opening"; roomId: string; opening: number }
  | { kind: "object"; roomId: string; object: number }
  | { kind: "pin"; pinId: string }
  | { kind: "pins"; pinIds: string[] };

/** The room a selection is in, if any. */
export function homeMapSelectionRoom(sel: HomeMapSelection | undefined): string | undefined {
  return sel === undefined || sel.kind === "pin" || sel.kind === "pins" ? undefined : sel.roomId;
}

/** Whether what a selection names is still on the floor: for several pins,
 * every one of them. */
export function homeMapSelectionThere(floor: HomeMapFloor | undefined, sel: HomeMapSelection | undefined): boolean {
  if (sel === undefined) return true;
  if (floor === undefined) return false;
  if (sel.kind === "pin") return floor.pins.some((p) => sameHomeMapId(p.id, sel.pinId));
  if (sel.kind === "pins") return sel.pinIds.every((id) => floor.pins.some((p) => sameHomeMapId(p.id, id)));
  const room = floor.rooms.find((r) => sameHomeMapId(r.id, sel.roomId));
  if (room === undefined) return false;
  switch (sel.kind) {
    case "room": return true;
    case "wall": return homeMapRoomWalls(room)[sel.wall] !== undefined;
    case "corner": return room.outline[sel.corner] !== undefined;
    case "opening": return room.openings[sel.opening] !== undefined;
    case "object": return room.objects[sel.object] !== undefined;
  }
}

/** Whether two selections name the same thing. */
export function sameHomeMapSelection(a: HomeMapSelection | undefined, b: HomeMapSelection | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return JSON.stringify(a) === JSON.stringify(b);
}

/** The stage's switches in the dock. `snap`: a dragged room snaps to its
 * neighbours' walls; `square`: a dragged corner keeps its walls square;
 * `grid`: points land on the mode's grid; `measure`: clicks measure;
 * `live`: the plan shows Home Assistant's states; `scan`: Shape draws each
 * room's scan as it was over the plan. */
export interface HomeMapToggles {
  snap: boolean;
  square: boolean;
  grid: boolean;
  measure: boolean;
  live: boolean;
  scan: boolean;
}

/** A page a room or pin can open, as the library lists it. */
export interface HomeMapPageChoice {
  id: string;
  name: string;
}

/** What a drag reports: plan points in meters. `move` is called only once
 * the pointer has moved past the click slop; `end` always, `moved` false
 * for a click. */
export interface HomeMapDragHandlers {
  move(at: HomePoint, e: PointerEvent): void;
  end(at: HomePoint, e: PointerEvent, moved: boolean): void;
}

/** What `ctx.apply` does after the edit. `select`: the selection once made
 * (null clears it); `floorId`: the floor to show. */
export interface HomeMapApplyOptions {
  select?: HomeMapSelection | null;
  floorId?: string;
}

/** Everything a mode draws from and acts through, made fresh for each
 * draw. */
export interface HomeMapEditorContext {
  readonly hass: HassLike | undefined;
  readonly icons: IconProvider | undefined;
  /** The map as edited, without any drag's preview. */
  readonly doc: HomeMapDocument;
  /** The floor on the stage, with the preview made on it. */
  readonly floor: HomeMapFloor;
  readonly selection: HomeMapSelection | undefined;
  readonly mode: HomeMapModeId;
  readonly view: HomeMapView;
  /** The stage's size in pixels. */
  readonly stage: { width: number; height: number };
  readonly toggles: HomeMapToggles;
  /** The library's pages (empty without the library). */
  readonly pages: readonly HomeMapPageChoice[];
  /** Home Assistant's areas, by name. */
  readonly areas: readonly { id: string; name: string }[];
  /** Each room as the iPhone scanned it, as last read; undefined from an
   * integration that keeps none (and until the first read is in). */
  readonly scans: HomeMapScans | undefined;
  readonly canUndo: boolean;
  readonly canRedo: boolean;

  /** Plan meters to stage pixels, and a length in meters as pixels. */
  toScreen(p: readonly number[]): HomePoint;
  px(meters: number): number;
  /** The plan point under a pointer, from its client coordinates. */
  toPlan(clientX: number, clientY: number): HomePoint;

  /** Make an edit, record it for undo and save it. False when it no longer
   * fits the map (nothing changes). */
  apply(op: HomeMapOp, options?: HomeMapApplyOptions): boolean;
  /** Show a change live without saving it; undefined ends it. */
  preview(op: HomeMapOp | undefined): void;
  select(selection: HomeMapSelection | undefined): void;
  setMode(mode: HomeMapModeId, selection?: HomeMapSelection): void;
  setFloor(floorId: string): void;
  setToggle(key: keyof HomeMapToggles, on: boolean): void;
  /** Follow a press as a drag, the pointer captured. */
  drag(e: PointerEvent, handlers: HomeMapDragHandlers): void;
  undo(): void;
  redo(): void;
  /** The page's own yes or no. */
  confirm(o: { title: string; text?: string; ok: string; danger?: boolean }): Promise<boolean>;
  /** The page's own one line of text; undefined when cancelled. */
  ask(o: { title: string; label: string; value: string; ok: string }): Promise<string | undefined>;
  /** A new id for a room, floor or pin. */
  newId(): string;
  note(kind: "warn" | "err", text: string): void;
  redraw(): void;
  /** Open a library page in the page editor; absent where the panel gives
   * no way there. */
  readonly openPage?: ((pageId: string) => void) | undefined;
}

/** One mode of the editor. */
export interface HomeMapMode {
  readonly id: HomeMapModeId;
  /** The left column's cards. */
  rail(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** The right column's cards. */
  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** Drawn over the plan, in stage pixels. */
  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing;
  /** The floating pill at the top of the stage: what is picked and what can
   * be done to it. */
  pill?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** The mode's switches in the dock, between the zoom and Measure. */
  dock?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** A press on the stage at plan point `at`. True when the mode took it;
   * false lets the shell pan (and clear the selection on a click). */
  pointerDown?(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean;
  /** The pointer moving over the stage with no button down. */
  hover?(ctx: HomeMapEditorContext, at: HomePoint | undefined): void;
  /** A key, when no text field has focus. True when used. */
  keyDown?(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean;
  /** The stage's cursor while this mode has it. */
  cursor?(ctx: HomeMapEditorContext): string | undefined;
  /** Leaving the mode (another mode, another floor): drop any tool. */
  leave?(ctx: HomeMapEditorContext): void;
  /** The mode draws the floor's pins in its overlay, so the plan under it
   * leaves them out (its pools of light stay). */
  readonly drawsPins?: boolean;
  /** Small pieces of page over the stage, beside the pill and the dock,
   * that take their own presses (Devices' side view). */
  stageExtra?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** The mode's own middle column in place of the plan stage (Style). The
   * element in it with the class `hme-stage` is the one measured as
   * `ctx.stage`; the shell keeps the bar, the rail and the inspector, and
   * there is no Flat or Model. */
  stage?(ctx: HomeMapEditorContext): TemplateResult;
  /** Something dragged from the rail moving over the plan at `at`, or
   * leaving it (undefined). True to take a drop there. */
  dragOver?(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean;
  /** The drop of what `dragOver` took, at plan point `at`. */
  drop?(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void;
}
