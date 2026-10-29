// The contract between the map editor's shell (`home-map-editor.ts`) and
// the part that edits on its page. The shell owns the bar, the stage (the
// plan drawn, pan and zoom, the measure, the dock), the selection, the undo
// stack, the saves and the Home style panel; the page has no modes. Its one
// editing part, `HomeMapEditPage` (`edit-page.ts`), implements `HomeMapPart`:
// it draws the left rail, the inspector, the stage's overlay, its tool rail,
// pill and dock switches from the `HomeMapEditorContext` the shell hands it
// on every draw, and answers the presses and keys the shell passes it.
//
// The page is in one of two states. Editing (no `ctx.walls`): a click picks
// what is on top, a device pin, else a thing, else a room, and moves it.
// Wall editing (`ctx.walls`, a room's id), entered by a double-click on a
// room: that room's corners, walls, doors and windows, the rest dimmed. The
// edit page does its work through three files that each keep one kind of
// edit, as parts of it: `mode-arrange.ts` (rooms and things, the furniture
// picker), `mode-devices.ts` (pins and the devices not on the map) and
// `mode-shape.ts` (walls, corners and openings, and the placing tools).
// `mode-style.ts` is the Home style panel the bar opens.
//
// Rules every part keeps:
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
// - A part's own state (its tool, a half-drawn room) lives on the part
//   object; call `ctx.redraw()` after changing it.
// - Keys reach the page only when no control of a form (a field, slider,
//   colour or menu) has focus and no dialog or panel is open; it returns
//   true for a key it used.
// - `ctx.confirm` and `ctx.ask` are the page's own dialogs, never the
//   browser's.

import type { SVGTemplateResult, TemplateResult, nothing } from "lit";
import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { HomeMapOp, HomeMapThingRef } from "./edit-ops.js";
import type { HomeMapView } from "./editor-view.js";
import type { HomeMapDocument, HomeMapFloor, HomeMapScans, HomePoint } from "./model.js";
import { sameHomeMapId } from "./model.js";
import { homeMapRoomWalls } from "./edit-ops.js";

/** What is picked. Indexes are a room's walls as `homeMapRoomWalls` numbers
 * them, its outline corners, openings and objects (walls, corners and
 * openings only while that room's walls are edited). `pins` is two or more
 * pins picked at once, in the order picked (one is `pin`); `objects` two or
 * more things, in any rooms of the floor, in the order picked (one is
 * `object`). */
export type HomeMapSelection =
  | { kind: "room"; roomId: string }
  | { kind: "wall"; roomId: string; wall: number }
  | { kind: "corner"; roomId: string; corner: number }
  | { kind: "opening"; roomId: string; opening: number }
  | { kind: "object"; roomId: string; object: number }
  | { kind: "objects"; items: HomeMapThingRef[] }
  | { kind: "pin"; pinId: string }
  | { kind: "pins"; pinIds: string[] };

/** The room a selection is in, if any; none for several things, which may
 * lie in several rooms. */
export function homeMapSelectionRoom(sel: HomeMapSelection | undefined): string | undefined {
  return sel === undefined || sel.kind === "pin" || sel.kind === "pins" || sel.kind === "objects" ? undefined : sel.roomId;
}

// A plain click picks one thing; Cmd or Ctrl and a click adds a thing to the
// pick or takes it out. One thing picked is the selection `object`, two or
// more `objects`, in the order they were picked.

/** The things a selection picks, in the order picked: none, one, or
 * several. */
export function homeMapPickedThings(sel: HomeMapSelection | undefined): HomeMapThingRef[] {
  if (sel?.kind === "object") return [{ roomId: sel.roomId, object: sel.object }];
  if (sel?.kind === "objects") return sel.items.map((t) => ({ roomId: t.roomId, object: t.object }));
  return [];
}

const sameThing = (a: HomeMapThingRef, b: HomeMapThingRef) => sameHomeMapId(a.roomId, b.roomId) && a.object === b.object;

/** The selection that picks these things, each once: none, `object` for
 * one, `objects` for several. */
export function homeMapThingsPickOf(things: readonly HomeMapThingRef[]): HomeMapSelection | undefined {
  const items: HomeMapThingRef[] = [];
  for (const t of things) if (!items.some((x) => sameThing(x, t))) items.push({ roomId: t.roomId, object: t.object });
  if (items.length === 0) return undefined;
  return items.length === 1 ? { kind: "object", roomId: items[0]!.roomId, object: items[0]!.object } : { kind: "objects", items };
}

/** Cmd or Ctrl and a click on a thing: the pick with the thing taken out
 * when it was in it, else added to it. Anything else picked (a room, a pin
 * or several) gives way to the thing alone. */
export function homeMapToggleThing(sel: HomeMapSelection | undefined, thing: HomeMapThingRef): HomeMapSelection | undefined {
  const things = homeMapPickedThings(sel);
  return things.some((t) => sameThing(t, thing)) ? homeMapThingsPickOf(things.filter((t) => !sameThing(t, thing))) : homeMapThingsPickOf([...things, thing]);
}

/** Whether a selection picks this thing, alone or among several. */
export function homeMapThingPicked(sel: HomeMapSelection | undefined, roomId: string, object: number): boolean {
  return homeMapPickedThings(sel).some((t) => sameThing(t, { roomId, object }));
}

/** Whether what a selection names is still on the floor: for several pins
 * or things, every one of them. */
export function homeMapSelectionThere(floor: HomeMapFloor | undefined, sel: HomeMapSelection | undefined): boolean {
  if (sel === undefined) return true;
  if (floor === undefined) return false;
  if (sel.kind === "pin") return floor.pins.some((p) => sameHomeMapId(p.id, sel.pinId));
  if (sel.kind === "pins") return sel.pinIds.every((id) => floor.pins.some((p) => sameHomeMapId(p.id, id)));
  if (sel.kind === "objects") return sel.items.every((t) => floor.rooms.find((r) => sameHomeMapId(r.id, t.roomId))?.objects[t.object] !== undefined);
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

/** The stage's switches. `snap`: a dragged room snaps to its neighbours'
 * walls; `square`: a dragged corner keeps its walls square; `grid`: points
 * land on the grid (10 cm, 5 cm while editing walls); `measure`: clicks
 * measure (the tool rail's Measure); `live`: the plan shows Home Assistant's
 * states; `scan`: wall editing draws each room's scan as it was over the
 * plan. */
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
 * the pointer has moved past the click slop; `end` when the pointer lets
 * go, `moved` false for a click; `cancel` instead of `end` when the drag is
 * dropped before that (a second finger starting a pinch, another drag, the
 * page closing), to put back whatever the drag showed and save nothing. */
export interface HomeMapDragHandlers {
  move(at: HomePoint, e: PointerEvent): void;
  end(at: HomePoint, e: PointerEvent, moved: boolean): void;
  cancel?(): void;
}

/** What `ctx.apply` does after the edit. `select`: the selection once made
 * (null clears it); `floorId`: the floor to show. */
export interface HomeMapApplyOptions {
  select?: HomeMapSelection | null;
  floorId?: string;
}

/** Everything a part draws from and acts through, made fresh for each
 * draw. */
export interface HomeMapEditorContext {
  readonly hass: HassLike | undefined;
  readonly icons: IconProvider | undefined;
  /** The map as edited, without any drag's preview. */
  readonly doc: HomeMapDocument;
  /** The floor on the stage, with the preview made on it. */
  readonly floor: HomeMapFloor;
  readonly selection: HomeMapSelection | undefined;
  /** The room whose walls are being edited; undefined while editing the
   * floor as a whole. */
  readonly walls: string | undefined;
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
  /** The furniture models' folder (`scene3d-load.ts`), for the furniture
   * picker's pictures; undefined where the panel gives no address. */
  readonly furnitureBase: string | undefined;
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
  /** Edit a room's walls, `selection` picked in it (else the room); with
   * undefined, back to editing the floor, `selection` picked (else the room
   * whose walls were edited). */
  editWalls(roomId: string | undefined, selection?: HomeMapSelection): void;
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

/** The page's editing part, as the shell asks it. */
export interface HomeMapPart {
  /** The left column's cards. */
  rail(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** The right column's cards. */
  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** Drawn over the plan, in stage pixels. */
  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing;
  /** The floating pill at the top of the stage: what is picked and what can
   * be done to it. */
  pill?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** A bar across the top of the stage, the pill under it (wall editing's
   * Done). */
  banner?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** Switches in the dock, after the zoom. */
  dock?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** A press on the stage at plan point `at`. True when the part took it;
   * false lets the shell pan (and clear the selection on a click). */
  pointerDown?(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean;
  /** A double-click on the stage at plan point `at`. */
  doubleClick?(ctx: HomeMapEditorContext, e: MouseEvent, at: HomePoint): void;
  /** The pointer moving over the stage with no button down. */
  hover?(ctx: HomeMapEditorContext, at: HomePoint | undefined): void;
  /** A key, when no control of a form has focus. True when used. */
  keyDown?(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean;
  /** The stage's cursor. */
  cursor?(ctx: HomeMapEditorContext): string | undefined;
  /** Another floor, or into or out of a room's walls: drop any tool. */
  leave?(ctx: HomeMapEditorContext): void;
  /** Whether the part draws the floor's pins in its overlay, so the plan
   * under it leaves them out (its pools of light stay). */
  drawsPins?(ctx: HomeMapEditorContext): boolean;
  /** Small pieces of page over the stage, beside the pill and the dock,
   * that take their own presses (the tool rail, the side view). */
  stageExtra?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** A sheet over the whole page, under the page's own dialogs (the
   * furniture picker). It keeps its own keys: none reach the shell. */
  sheet?(ctx: HomeMapEditorContext): TemplateResult | typeof nothing;
  /** Something dragged from the rail moving over the plan at `at`, or
   * leaving it (undefined). True to take a drop there. */
  dragOver?(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean;
  /** The drop of what `dragOver` took, at plan point `at`. */
  drop?(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void;
}
