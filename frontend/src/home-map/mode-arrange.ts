// The edit page's rooms and things (`edit-page.ts`, which uses this part):
// put the rooms where they stand. On the stage a room is dragged
// to move it, snapping to the walls of the rooms round it with a pink guide
// and a label saying what it lined up with (Alt moves it freely, the grid
// moves it in 10 cm steps), turned by the round handle above its box, and
// shows its two sizes. The eight square handles on its box resize it along
// its own walls (`resizeRoom`, a stretch of everything in it): a side
// handle moves that side, a corner its two, the opposite sides staying put;
// the dragged sides snap to the neighbours' walls with the same pink guide,
// the sizes show live and the grid sizes it in 10 cm steps. While resizing,
// Shift keeps its proportions, Alt resizes it about its middle (both sides
// move, so nothing snaps, as Alt moves a room freely) and Cmd or Ctrl turns
// the snapping off for a one sided resize. The pill turns it a quarter,
// squares its corners, snaps it to the walls the iPhone's way, moves it to
// another floor or deletes it. The inspector holds the room's name, Home
// Assistant area and the page a tap opens; where it is (left and top, its
// turn, its width and depth, its floor, its wall height); its floor finish
// with its floor and wall colours; and the things in it, each shown or hidden, with its devices and Add a
// thing.
//
// A thing (a sofa, a TV, a desk) lies over its room, so a click on it picks
// it, in any room, and a drag on it moves it at once; a room is dragged by
// its open floor. It is also picked by its name in the lists. Picked, it
// has the same box as a room: dragged to move it (a side
// that runs along a wall of its room snaps flush against it, Alt moves it
// freely, the grid moves its middle in 10 cm steps), the square handles
// resize it along its own sides (Shift and Alt as for a room) and the round
// one turns it. Arrow keys nudge it, Delete removes it and Escape goes back
// to its room. Its inspector holds the furniture piece the 3D look draws it
// as (Change opens the picker, pieces of its own kind first), the colours
// of the piece's fabric and wood when it has either, where its
// middle is, its turn, its width, depth and height, and whether it is shown.
// A custom colour shows on the plan and in 3D as the picker moves and is
// saved once, when the picker closes or is left.
//
// Cmd or Ctrl and a click on a thing (on the plan, in 3D or in the layers)
// adds it to the pick or takes it out, things in any rooms together; a
// plain click picks one again. Several things are each outlined, with no
// handles. Their inspector names them and holds the Colours card (a Fabric
// row when any of their pieces has fabric, a Wood row when any has wood,
// each pick set on every one that has the part), Shown or Hidden for all and
// Delete for all, after the page's own yes; their pill has Hide and Delete.
// The arrows nudge them all, Delete asks to take them off, and Escape goes
// back to their room when they are all in one, else to nothing picked. Each
// of these is one edit.
//
// Add furniture (the tool rail's F, and a room's inspector) opens the
// furniture picker over the page: the catalog's pieces by group, a search, and a card
// for each with its small 3D picture (drawn once by `scene3d.ts`), name and
// size. A card picked goes into the picked room, or the room in the middle
// of the view, at the room's middle, and is picked so it can be dragged
// into place at once.
//
// Draw a room by hand (the tool rail's R) puts a room down corner by corner
// (`draw-tool.ts`).
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
import {
  type HomeMapObjectResize,
  type HomeMapPart,
  type HomeMapResize,
  type HomeMapResizeSides,
  type HomeMapRoomPart,
  type HomeMapSnapGuide,
  type HomeMapThingRef,
  HOME_MAP_MAX_OBJECT_SIZE,
  HOME_MAP_MAX_ROOM_SIZE,
  HOME_MAP_MIN_OBJECT_SIZE,
  HOME_MAP_MIN_ROOM_SIZE,
  HOME_MAP_OBJECT_KINDS,
  addObject,
  addPiece,
  deleteRoom,
  homeMapLevelTurn,
  homeMapObjectAxes,
  homeMapPinsOfRoom,
  homeMapRoomFrame,
  levelObject,
  levelRoom,
  moveObject,
  moveObjects,
  moveRoom,
  moveRoomToFloor,
  removeObject,
  removeObjects,
  resizeObject,
  renameFloor,
  renameRoom,
  resizeRoom,
  setObjectHidden,
  setObjectsHidden,
  setObjectsPart,
  setRoomArea,
  setRoomColor,
  setRoomFinish,
  setRoomPage,
  setObject,
  setObjectPart,
  setObjectPiece,
  setWallHeight,
  snapObject,
  snapRoom,
  snapRoomResize,
  snapRoomToWalls,
  squareCorners,
  turnObject,
  turnRoom,
} from "./edit-ops.js";
import { HOME_MAP_ARRANGE_GRID, HomeMapDrawTool } from "./draw-tool.js";
import { homeMapShared, homeMapStateText } from "./devices-model.js";
import { type HomeMapEditorContext, type HomeMapSelection, homeMapPickedThings, homeMapSelectionRoom, homeMapToggleThing } from "./editor-mode.js";
import {
  hmeCard,
  hmeChip,
  hmeColourInput,
  hmeFields,
  hmeFinishSwatch,
  hmeGroup,
  hmeHint,
  hmeMenuButton,
  hmeNumber,
  hmePic,
  hmeRoomThumb,
  hmeRow,
  hmeSelect,
  hmeText,
} from "./editor-parts.js";
import {
  homeMapCount,
  homeMapObjectName,
  homeMapOpeningName,
  homeMapRoomBox,
  homeMapRoomSize,
  homeMapRoomSizeText,
  homeMapShortcut,
  homeMapToPlan,
  homeMapUndoKey,
} from "./editor-view.js";
import {
  type HomeMapFurniturePiece,
  type HomeMapPartPreset,
  HOME_MAP_FABRIC_PRESETS,
  HOME_MAP_FURNITURE,
  HOME_MAP_WOOD_PRESETS,
  homeMapPiece,
  homeMapPieceOf,
  homeMapPieceParts,
  homeMapPieceSearch,
  homeMapPieceSizeText,
} from "./furniture.js";
import {
  type HomeFloorKind,
  homeBoxCorners,
  homeBoxOf,
  homeFloorGuess,
  homeFloorKind,
  homeLabelPoint,
  homeNormalDegrees,
  homePointBounds,
  homePolygonArea,
  homePolygonHolds,
  homeRoomUnder,
} from "./geometry.js";
import {
  type HomeMapDocument,
  type HomeMapFinish,
  type HomeMapFloor,
  type HomeMapObject,
  type HomeMapRoom,
  type HomePoint,
  HOME_MAP_FINISHES,
  homeMapFloorName,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapLitRooms,
  homeMapPinName,
  homeMapRoomCenter,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";
import { homeMapLoad3D } from "./scene3d-load.js";

/** A finish's name. */
export const HOME_MAP_FINISH_NAMES: Readonly<Record<HomeFloorKind, string>> = {
  wood: "Wood",
  tile: "Tile",
  stone: "Stone",
  carpet: "Carpet",
  plain: "Plain",
};

/** The floor colours offered before a custom one, by the room's finish (its
 * auto guess when it has none). */
export const HOME_MAP_FLOOR_COLOR_PRESETS: Readonly<Record<HomeFloorKind, readonly HomeMapPartPreset[]>> = {
  wood: [
    { name: "Light oak", hex: "#D9B88A" },
    { name: "Oak", hex: "#B98B5A" },
    { name: "Walnut", hex: "#6B4A32" },
    { name: "Grey wash", hex: "#9A948C" },
  ],
  tile: [
    { name: "White", hex: "#E9E7E2" },
    { name: "Grey", hex: "#8E8E8A" },
    { name: "Black", hex: "#2E2E30" },
    { name: "Terracotta", hex: "#B4664A" },
  ],
  stone: [
    { name: "Light", hex: "#C9C3B8" },
    { name: "Sand", hex: "#B8A98E" },
    { name: "Slate", hex: "#5E6468" },
  ],
  carpet: [
    { name: "Grey", hex: "#8E8E93" },
    { name: "Beige", hex: "#CBB9A0" },
    { name: "Navy", hex: "#2E4A7D" },
    { name: "Green", hex: "#4F6B4A" },
  ],
  plain: [
    { name: "White", hex: "#E9E7E2" },
    { name: "Grey", hex: "#8E8E8A" },
    { name: "Black", hex: "#2E2E30" },
  ],
};

/** The wall colours offered before a custom one. */
export const HOME_MAP_WALL_COLOR_PRESETS: readonly HomeMapPartPreset[] = [
  { name: "White", hex: "#F2F0EB" },
  { name: "Warm white", hex: "#EDE6D8" },
  { name: "Greige", hex: "#CFC6B8" },
  { name: "Sage", hex: "#A3B09A" },
  { name: "Blue grey", hex: "#8C9AA6" },
  { name: "Charcoal", hex: "#3E4044" },
];

/** A row of colours: Default (no key), a round button for each preset,
 * ringed when picked, and Custom, a picker whose colour shows live as it
 * moves (`preview`) and is saved once when it closes or is left. `mixed`:
 * several things picked that differ, so nothing is ringed. */
function colourChoice(o: {
  word: string;
  presets: readonly HomeMapPartPreset[];
  now: string | undefined;
  mixed?: boolean;
  defaultTitle: string;
  customTitle: string;
  customLabel: string;
  set: (color: string | undefined) => void;
  preview: (color: string | undefined) => void;
}): TemplateResult {
  const mixed = o.mixed === true;
  const now = mixed ? undefined : o.now?.toUpperCase();
  const custom = now !== undefined && !o.presets.some((p) => p.hex === now);
  return html`<div class="hme-r top"><span class="hme-l">${o.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${o.word} colour`}>
      <button type="button" class="hme-chip sel ${now === undefined && !mixed ? "on" : ""}" aria-pressed=${now === undefined && !mixed ? "true" : "false"}
        title=${o.defaultTitle} @click=${() => o.set(undefined)}>Default</button>
      ${o.presets.map((p) => html`<button type="button" class="hme-colour ${now === p.hex ? "on" : ""}" style=${`--c:${p.hex}`}
        title=${p.name} aria-label=${`${o.word}: ${p.name}`} aria-pressed=${now === p.hex ? "true" : "false"} @click=${() => o.set(p.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${custom ? "on" : ""}" title=${o.customTitle}>${custom ? html`<span class="hme-swatch" style=${`background:${now}`}></span>` : nothing}Custom
        ${hmeColourInput({ value: now ?? o.presets[0]!.hex, label: o.customLabel, preview: o.preview, set: o.set })}</label>
    </div></div>
    ${mixed ? hmeHint(`Mixed: their ${o.word.toLowerCase()} colours differ. Pick one to set them all.`) : nothing}`;
}

/** A turn handle snaps to this many degrees unless Alt is held. */
const TURN_STEP = 15;

/** The sides of a room's box each of its eight handles drags, in the order
 * the box draws them: a corner, then the middle of the side after it,
 * going round from the corner at a0, c0 (`homeMapRoomFrame`). */
const RESIZE_HANDLES: readonly HomeMapResizeSides[] = [
  { a: 0, c: 0 }, { c: 0 },
  { a: 1, c: 0 }, { a: 1 },
  { a: 1, c: 1 }, { c: 1 },
  { a: 0, c: 1 }, { a: 0 },
];

/** The resize cursor for a handle that lies `dx`, `dy` stage pixels from
 * the box's middle. */
function resizeCursor(dx: number, dy: number): string {
  const degrees = ((Math.atan2(dy, dx) * 180) / Math.PI + 180) % 180;
  return ["ew-resize", "nwse-resize", "ns-resize", "nesw-resize"][Math.round(degrees / 45) % 4]!;
}

/** The question before a room is deleted. */
export function homeMapDeleteRoomText(room: HomeMapRoom, devices: number): string {
  const these = devices === 0 ? "" : ` Its ${homeMapCount(devices, "device")} come${devices === 1 ? "s" : ""} off the map too.`;
  return `${homeMapRoomName(room)} comes off the map.${these} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`;
}

/** A thing as the editor finds it: its room and its place in that room's
 * list, which is how a selection names it. */
interface ThingAt {
  room: HomeMapRoom;
  index: number;
  object: HomeMapObject;
}

/** A thing's name: the furniture piece it was picked as, else its kind's. */
export function homeMapThingName(object: Pick<HomeMapObject, "kind" | "model">): string {
  return homeMapPiece(object.model)?.name ?? homeMapObjectName(object.kind);
}

/** Several things' names, as a sentence lists them: "Sofa, Floor lamp and
 * Floor lamp". */
export function homeMapThingNames(things: readonly { object: Pick<HomeMapObject, "kind" | "model"> }[]): string {
  const names = things.map((t) => homeMapThingName(t.object));
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Where Escape goes from several things: their room when they are all in
 * one, else nothing picked. */
export function homeMapThingsHome(things: readonly { room: Pick<HomeMapRoom, "id"> }[]): HomeMapSelection | undefined {
  const first = things[0]?.room.id;
  return first !== undefined && things.every((t) => sameHomeMapId(t.room.id, first)) ? { kind: "room", roomId: first } : undefined;
}

/** The parts a thing's colours can change, in the Colours card's order. */
const HOME_MAP_COLOUR_PARTS: readonly HomeMapPart[] = ["fabric", "wood"];

/** Things as an edit names them. */
const thingRefs = (things: readonly ThingAt[]): HomeMapThingRef[] => things.map((t) => ({ roomId: t.room.id, object: t.index }));

/** The parts of a thing its Colours card offers, those of the piece it draws
 * as (its `model`, else its kind's): fabric, wood, both or none. */
export function homeMapColourParts(object: Pick<HomeMapObject, "kind" | "model" | "size">): HomeMapPart[] {
  return homeMapPieceParts(homeMapPieceOf(object));
}

/** The room a new piece goes into: the picked one, else the one under the
 * middle of the view, else the one whose middle is nearest it. */
export function homeMapRoomForAdding(ctx: Pick<HomeMapEditorContext, "floor" | "selection" | "view" | "stage">): HomeMapRoom | undefined {
  const id = homeMapSelectionRoom(ctx.selection);
  const picked = id === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  if (picked !== undefined) return picked;
  const middle = homeMapToPlan(ctx.view, [ctx.stage.width / 2, ctx.stage.height / 2]);
  const under = homeRoomUnder(ctx.floor, middle);
  if (under !== undefined) return under;
  let best: { room: HomeMapRoom; d: number } | undefined;
  for (const room of ctx.floor.rooms) {
    const c = homeMapRoomCenter(room);
    const d = Math.hypot(c[0] - middle[0], c[1] - middle[1]);
    if (best === undefined || d < best.d) best = { room, d };
  }
  return best?.room;
}

/** What the furniture picker is open for: a new piece for a room, or
 * another piece for one of its things. */
interface Picker {
  roomId: string;
  index?: number;
}

/** A section of the picker: its title and its pieces. */
export interface HomeMapPickerSection {
  title: string;
  pieces: HomeMapFurniturePiece[];
}

/** The picker's sections: with no search and every group, one section a
 * group in the catalog's order, a thing's own kind first when changing one
 * (`kind`); else one section of what the search and group find, its own
 * kind first. */
export function homeMapPickerSections(query: string, group: string, kind?: string): HomeMapPickerSection[] {
  const found = homeMapPieceSearch(query, kind).filter((p) => group === "" || p.group === group);
  if (query.trim() !== "" || group !== "") return [{ title: group === "" ? "Found" : group, pieces: found }];
  const sections: HomeMapPickerSection[] = [];
  const own = kind === undefined ? [] : found.filter((p) => p.kind === kind);
  if (own.length > 0) sections.push({ title: `${homeMapObjectName(kind!)} pieces`, pieces: own });
  for (const g of HOME_MAP_FURNITURE.groups) {
    const pieces = found.filter((p) => p.group === g && !own.includes(p));
    if (pieces.length > 0) sections.push({ title: g, pieces });
  }
  return sections;
}

/** A thing's turn as the inspector shows it, -180 to 180. */
function thingTurn(object: HomeMapObject): number {
  return Math.round(homeNormalDegrees(object.turn) * 10) / 10;
}

const fmt = (v: number) => v.toFixed(1);
const pt = (p: readonly number[]) => `${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`;

export class ArrangeMode {
  readonly draw = new HomeMapDrawTool(HOME_MAP_ARRANGE_GRID);
  /** The snap lines while a room is dragged, whether a drag is on, and
   * whether that drag resizes it (its sizes then stay on show). */
  private guides: HomeMapSnapGuide[] = [];
  private dragging = false;
  private resizing = false;
  /** The furniture picker while it is open, what it searches for and the
   * group it shows ("" every group). */
  private picker?: Picker;
  private pickerQuery = "";
  private pickerGroup = "";
  private pickerFocus = false;
  /** The pieces' small pictures as they arrive, and the ones asked for. */
  private readonly thumbs = new Map<string, string>();
  private readonly askedThumbs = new Set<string>();
  private thumbFrame = 0;

  // ── the furniture picker ───────────────────────────────────────────────

  /** Open the picker to add a piece to `room`, or with `index` to change
   * that thing's piece. */
  openPicker(ctx: HomeMapEditorContext, room: HomeMapRoom, index?: number): void {
    this.picker = index === undefined ? { roomId: room.id } : { roomId: room.id, index };
    this.pickerQuery = "";
    this.pickerGroup = "";
    this.pickerFocus = true;
    ctx.redraw();
  }

  closePicker(ctx: HomeMapEditorContext): void {
    this.picker = undefined;
    ctx.redraw();
  }

  /** Whether the picker is open. */
  get pickerOpen(): boolean {
    return this.picker !== undefined;
  }

  /** A piece's small picture, asked for the first time it is shown and
   * drawn again once it is in (a frame's worth of them at a time). */
  private thumb(ctx: HomeMapEditorContext, pieceId: string): string | undefined {
    const done = this.thumbs.get(pieceId);
    const base = ctx.furnitureBase;
    if (done !== undefined || base === undefined || this.askedThumbs.has(pieceId)) return done;
    this.askedThumbs.add(pieceId);
    void homeMapLoad3D()
      .then((m) => m.homeMapPieceThumb(base, pieceId))
      .then((url) => {
        if (url === undefined) return;
        this.thumbs.set(pieceId, url);
        if (this.thumbFrame !== 0) return;
        const later = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (f: () => void) => setTimeout(f, 16) as unknown as number;
        this.thumbFrame = later(() => {
          this.thumbFrame = 0;
          ctx.redraw();
        });
      }, () => undefined);
    return undefined;
  }

  /** A piece's picture, or a quiet stand in until it is drawn (the lamp
   * chooser's pictures too). */
  piecePic(ctx: HomeMapEditorContext, piece: HomeMapFurniturePiece | undefined, cls: string): TemplateResult {
    const url = piece === undefined ? undefined : this.thumb(ctx, piece.id);
    return html`<span class="${cls} ${url === undefined ? "wait" : ""}">${url === undefined ? nothing : html`<img src=${url} alt="" draggable="false" />`}</span>`;
  }

  /** Add the piece to the picker's room at its middle, or put it on the
   * picker's thing, and pick the thing. */
  private pickPiece(ctx: HomeMapEditorContext, piece: HomeMapFurniturePiece): void {
    const picker = this.picker;
    const room = picker === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, picker.roomId));
    this.picker = undefined;
    if (picker === undefined || room === undefined) {
      ctx.redraw();
      return;
    }
    const id = room.id;
    if (picker.index !== undefined) {
      const index = picker.index;
      if (!ctx.apply((d) => setObjectPiece(d, id, index, piece), { select: { kind: "object", roomId: id, object: index } })) ctx.redraw();
      return;
    }
    const at = homeLabelPoint(room) ?? homeMapRoomCenter(room);
    const index = room.objects.length;
    if (!ctx.apply((d) => addPiece(d, id, piece, at), { select: { kind: "object", roomId: id, object: index } })) ctx.redraw();
  }

  /** The picker over the page. */
  sheet(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const picker = this.picker;
    if (picker === undefined) return nothing;
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, picker.roomId));
    const thing = picker.index === undefined ? undefined : room?.objects[picker.index];
    if (room === undefined || (picker.index !== undefined && thing === undefined)) {
      this.picker = undefined;
      return nothing;
    }
    const current = thing === undefined ? undefined : homeMapPieceOf(thing);
    const sections = homeMapPickerSections(this.pickerQuery, this.pickerGroup, thing?.kind);
    const title = thing === undefined ? "Add furniture" : "Change model";
    const sub = thing === undefined
      ? `To ${homeMapRoomName(room)}, in its middle. Drag it into place once it is in.`
      : `${homeMapThingName(thing)} in ${homeMapRoomName(room)} keeps its place, size and turn.`;
    const count = (g: string) => HOME_MAP_FURNITURE.pieces.filter((p) => g === "" || p.group === g).length;
    const groups = ["", ...HOME_MAP_FURNITURE.groups];
    const focus = this.pickerFocus;
    this.pickerFocus = false;
    return html`<div class="hme-scrim hme-sheet"
      @pointerdown=${(e: Event) => { if (e.target === e.currentTarget) this.closePicker(ctx); }}
      @keydown=${(e: KeyboardEvent) => {
        // Every key stays in the picker, so Delete or an arrow never reaches the plan.
        e.stopPropagation();
        if (e.key === "Escape") this.closePicker(ctx);
      }}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${title}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${title}</strong><span>${sub}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${live(this.pickerQuery)}
              ${ref((el) => { if (focus && el instanceof HTMLInputElement) setTimeout(() => el.focus(), 0); })}
              @input=${(e: Event) => { this.pickerQuery = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${() => this.closePicker(ctx)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${groups.map((g) => html`<button type="button" class="hme-tool ${g === this.pickerGroup ? "on" : ""}" aria-pressed=${g === this.pickerGroup ? "true" : "false"}
              @click=${() => { this.pickerGroup = g; ctx.redraw(); }}>${g === "" ? "All" : g}<span class="n">${count(g)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${sections.every((s) => s.pieces.length === 0) ? html`<p class="hme-empty-line">No piece by that name${this.pickerGroup === "" ? "" : ` in ${this.pickerGroup}`}.</p>` : nothing}
            ${sections.filter((s) => s.pieces.length > 0).map((s) => html`<section class="hme-fpick-sec">
              <div class="hme-h">${s.title}<span class="hme-h-end">${homeMapCount(s.pieces.length, "piece")}</span></div>
              <div class="hme-fgrid">${s.pieces.map((p) => {
                const on = current?.id === p.id;
                return html`<button type="button" class="hme-fcard ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
                  title=${`${thing === undefined ? "Add" : "Use"} ${p.name}, ${homeMapPieceSizeText(p)}`} @click=${() => this.pickPiece(ctx, p)}>
                  ${this.piecePic(ctx, p, "hme-fcard-pic")}
                  <span class="hme-fcard-name">${p.name}</span>
                  <span class="hme-fcard-size mono">${homeMapPieceSizeText(p)}</span>
                </button>`;
              })}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`;
  }

  /** A drag is over, let go or dropped: no guides, the handles and the
   * sizes back as before it, and the plan without its preview. */
  private stopDrag(ctx: HomeMapEditorContext): void {
    this.guides = [];
    this.dragging = false;
    this.resizing = false;
    ctx.preview(undefined);
  }

  private focus(ctx: HomeMapEditorContext): HomeMapRoom | undefined {
    const id = homeMapSelectionRoom(ctx.selection);
    return id === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  }

  /** The things picked together, two or more in the order picked; undefined
   * unless several are. */
  private pickedMany(ctx: HomeMapEditorContext): ThingAt[] | undefined {
    if (ctx.selection?.kind !== "objects") return undefined;
    return homeMapPickedThings(ctx.selection).flatMap((t) => {
      const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, t.roomId));
      const object = room?.objects[t.object];
      return room === undefined || object === undefined ? [] : [{ room, index: t.object, object }];
    });
  }

  /** The picked thing, its room and its place in the room's list. */
  private picked(ctx: HomeMapEditorContext): ThingAt | undefined {
    const sel = ctx.selection;
    if (sel?.kind !== "object") return undefined;
    const room = this.focus(ctx);
    const object = room?.objects[sel.object];
    return room === undefined || object === undefined ? undefined : { room, index: sel.object, object };
  }

  /** The shown thing under `at`, the smallest where several overlap (a
   * chair over a table): in `room`, or in any room on the floor. */
  private thingUnder(ctx: HomeMapEditorContext, at: HomePoint, room: HomeMapRoom | undefined): ThingAt | undefined {
    let best: { thing: ThingAt; area: number } | undefined;
    for (const r of room === undefined ? ctx.floor.rooms : [room]) {
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

  private pickThing(ctx: HomeMapEditorContext, room: HomeMapRoom, index: number): void {
    ctx.select({ kind: "object", roomId: room.id, object: index });
  }

  /** Add furniture, into `room`; off with no room to put it in. */
  private addFurnitureButton(ctx: HomeMapEditorContext, room: HomeMapRoom | undefined, cls: string): TemplateResult {
    return html`<button type="button" class=${cls} ?disabled=${room === undefined}
      title=${room === undefined ? "Draw or scan a room first" : `Pick a sofa, a bed, a lamp or more from the furniture catalog for ${homeMapRoomName(room)}`}
      @click=${() => { if (room !== undefined) this.openPicker(ctx, room); }}>＋ Add furniture</button>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    if (this.draw.active) return this.draw.overlay(ctx);
    const room = this.focus(ctx);
    const thing = this.picked(ctx);
    const many = this.pickedMany(ctx);
    const parts: SVGTemplateResult[] = [];
    for (const guide of this.guides) parts.push(this.guide(ctx, guide));
    if (many !== undefined) {
      // Each picked thing outlined, no handles: several move by the arrows.
      for (const t of many) {
        const box = homeBoxCorners(homeBoxOf(t.object)).map((p) => pt(ctx.toScreen(p))).join(" ");
        parts.push(svg`<polygon class="hme-box" points=${box} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${t.object.hidden === true ? "5 4" : "none"} pointer-events="none" />`);
      }
    } else if (thing !== undefined) {
      // The thing's room stays outlined faintly, so it is plain whose it is.
      const outline = thing.room.outline.map((p) => pt(ctx.toScreen(p))).join(" ");
      parts.push(svg`<polygon points=${outline} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);
      const o = thing.object;
      parts.push(this.box(ctx, homeBoxCorners(homeBoxOf(o)), { width: o.size[0], depth: o.size[1] }, "thing", o.hidden === true));
    } else if (room !== undefined && room.outline.length >= 3) {
      parts.push(this.box(ctx, homeMapRoomBox(room), homeMapRoomSize(room), "room", false));
    }
    return parts.length === 0 ? nothing : svg`${parts}`;
  }

  /** The picked room's box along its walls, or the picked thing's box: its
   * resize handles, its turn handle and its two sizes (kept on show while it
   * is resized). `corners` go round from the one at the minus end of both
   * ways, the first side along its width. A hidden thing's box is dashed. */
  private box(ctx: HomeMapEditorContext, corners: readonly HomePoint[], size: { width: number; depth: number }, what: "room" | "thing", dashed: boolean): SVGTemplateResult {
    const box = corners.map((p) => ctx.toScreen(p));
    const centre = box.reduce<HomePoint>((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
    const mid = (i: number): HomePoint => [(box[i]![0] + box[(i + 1) % 4]![0]) / 2, (box[i]![1] + box[(i + 1) % 4]![1]) / 2];
    const out = (p: HomePoint): HomePoint => {
      const d = Math.max(Math.hypot(p[0] - centre[0], p[1] - centre[1]), 1e-6);
      return [(p[0] - centre[0]) / d, (p[1] - centre[1]) / d];
    };
    const handles = [0, 1, 2, 3].flatMap((i) => [box[i]!, mid(i)]);
    // The turn handle stands off the edge nearest the top of the screen.
    const topEdge = [0, 1, 2, 3].reduce((best, i) => (mid(i)[1] < mid(best)[1] ? i : best), 0);
    const tm = mid(topEdge);
    const to = out(tm);
    // Past the size tag that sits 20 px off the same edge.
    const knob: HomePoint = [tm[0] + to[0] * 44, tm[1] + to[1] * 44];
    const dims: SVGTemplateResult[] = [];
    // One measure along each way: on the edge facing up for the way that
    // runs across the screen, the edge facing left for the other.
    for (const pair of [[0, 2], [1, 3]] as const) {
      const [i, j] = pair;
      const across = Math.abs(box[(i + 1) % 4]![0] - box[i]![0]) >= Math.abs(box[(i + 1) % 4]![1] - box[i]![1]);
      const pick = across ? (out(mid(i))[1] <= out(mid(j))[1] ? i : j) : (out(mid(i))[0] <= out(mid(j))[0] ? i : j);
      const a = box[pick]!;
      const b = box[(pick + 1) % 4]!;
      const o = out(mid(pick));
      const a2: HomePoint = [a[0] + o[0] * 20, a[1] + o[1] * 20];
      const b2: HomePoint = [b[0] + o[0] * 20, b[1] + o[1] * 20];
      const m: HomePoint = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
      const length = pick % 2 === 0 ? size.width : size.depth;
      const t: HomePoint = [o[0] * 5, o[1] * 5];
      dims.push(svg`<path d=${`M${pt(a2)}L${pt(b2)}M${pt([a2[0] - t[0], a2[1] - t[1]])}L${pt([a2[0] + t[0], a2[1] + t[1]])}M${pt([b2[0] - t[0], b2[1] - t[1]])}L${pt([b2[0] + t[0], b2[1] + t[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${fmt(m[0] - 26)} y=${fmt(m[1] - 9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${fmt(m[0])} y=${fmt(m[1] + 4)} fill="#fff" text-anchor="middle">${length.toFixed(2)} m</text></g>`);
    }
    const resizeTip = what === "room"
      ? "Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping."
      : "Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";
    return svg`<g class="hme-box">
      <polygon points=${box.map(pt).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${dashed ? "5 4" : "none"} />
      ${this.resizing || !this.dragging ? dims : nothing}
      ${this.dragging ? nothing : svg`
        <line x1=${fmt(tm[0])} y1=${fmt(tm[1])} x2=${fmt(knob[0])} y2=${fmt(knob[1])} stroke="#5b8def" stroke-width="1.6" />
        ${handles.map((h, i) => svg`<rect data-hme="resize" data-handle=${i} x=${fmt(h[0] - 5)} y=${fmt(h[1] - 5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${resizeCursor(h[0] - centre[0], h[1] - centre[1])}`}>
          <title>${resizeTip}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${pt(knob)})`}>
          <title>${what === "room" ? "Drag to turn the room. Hold Alt to turn it freely." : "Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`;
  }

  /** A snap guide: the neighbour's wall line drawn long and pink, and what
   * the room lined up with. */
  private guide(ctx: HomeMapEditorContext, g: HomeMapSnapGuide): SVGTemplateResult {
    const a = ctx.toScreen(g.a);
    const b = ctx.toScreen(g.b);
    const d = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-6);
    const u: HomePoint = [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
    const a2: HomePoint = [a[0] - u[0] * 40, a[1] - u[1] * 40];
    const b2: HomePoint = [b[0] + u[0] * 40, b[1] + u[1] * 40];
    const other = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, g.roomId));
    const text = `Lined up with ${other === undefined ? "a" : homeMapRoomName(other)} wall`;
    const w = text.length * 6.2 + 20;
    return svg`<g class="hme-guide" pointer-events="none">
      <line x1=${fmt(a2[0])} y1=${fmt(a2[1])} x2=${fmt(b2[0])} y2=${fmt(b2[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${fmt(b2[0] + 6)} y=${fmt(b2[1] - 10)} width=${fmt(w)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${fmt(b2[0] + 6 + w / 2)} y=${fmt(b2[1] + 4)} fill="#fff" text-anchor="middle">${text}</text></g>
    </g>`;
  }

  /** A press: the drawing tool's while it draws, else the picked room's or
   * thing's handles, else the thing or room under it. */
  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (this.draw.active) return this.draw.pointerDown(ctx, e, at);
    if (e.button !== 0) return false;
    return this.pressHandle(ctx, e, at) || this.pressBody(ctx, e, at);
  }

  /** A press on the picked room's or thing's resize or turn handle, which
   * lie over everything else on the plan. */
  pressHandle(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    const target = (e.target as Element | null)?.closest?.("[data-hme]");
    const hit = target?.getAttribute("data-hme");
    if (hit !== "turn" && hit !== "resize") return false;
    const sides = RESIZE_HANDLES[Number(target?.getAttribute("data-handle"))];
    const picked = this.picked(ctx);
    const focus = this.focus(ctx);
    if (picked !== undefined) {
      if (hit === "turn") this.thingTurnDrag(ctx, e, picked, at);
      else if (sides !== undefined) this.thingResizeDrag(ctx, e, picked, sides, at);
      else return false;
      return true;
    }
    if (focus === undefined) return false;
    if (hit === "turn") this.turnDrag(ctx, e, focus, at);
    else if (sides !== undefined) this.resizeDrag(ctx, e, focus, sides, at);
    else return false;
    return true;
  }

  /** A press on a light a lamp holds, which is its lamp: picks the lamp
   * alone and drags it at once, or with Shift, Cmd or Ctrl adds it to the
   * pick of things or takes it out. False when the lamp is gone. */
  pressThing(ctx: HomeMapEditorContext, e: PointerEvent, ref: HomeMapThingRef, at: HomePoint): boolean {
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, ref.roomId));
    const object = room?.objects[ref.object];
    if (room === undefined || object === undefined) return false;
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      ctx.select(homeMapToggleThing(ctx.selection, { roomId: room.id, object: ref.object }));
      return true;
    }
    this.pickThing(ctx, room, ref.object);
    this.thingMoveDrag(ctx, e, { room, index: ref.object, object }, at);
    return true;
  }

  /** A press on a thing (in any room; the smallest where several overlap)
   * picks it alone and drags it at once; on a room's open floor, picks the
   * room and drags it. With Cmd or Ctrl a thing is added to the pick or
   * taken out, and a room's open floor leaves the pick as it is. */
  pressBody(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    const thing = this.thingUnder(ctx, at, undefined);
    if (e.metaKey || e.ctrlKey) {
      if (thing !== undefined) ctx.select(homeMapToggleThing(ctx.selection, { roomId: thing.room.id, object: thing.index }));
      return thing !== undefined || homeRoomUnder(ctx.floor, at) !== undefined;
    }
    if (thing !== undefined) {
      this.pickThing(ctx, thing.room, thing.index);
      this.thingMoveDrag(ctx, e, thing, at);
      return true;
    }
    const room = homeRoomUnder(ctx.floor, at);
    if (room === undefined) return false;
    ctx.select({ kind: "room", roomId: room.id });
    this.moveDrag(ctx, e, room, at);
    return true;
  }

  /** Drag a room: snapping to its neighbours' walls unless Alt is held or
   * snapping is off, in grid steps while the grid is on. Saved on the drop
   * as one move from where it started. */
  private moveDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, start: HomePoint): void {
    const startDoc = ctx.doc;
    const id = room.id;
    const corner = homePointBounds(room.outline);
    let delta: HomePoint = [0, 0];
    ctx.drag(e, {
      move: (p, ev) => {
        let dx = p[0] - start[0];
        let dy = p[1] - start[1];
        if (ctx.toggles.grid && corner !== undefined) {
          const g = HOME_MAP_ARRANGE_GRID;
          dx = Math.round((corner.minX + dx) / g) * g - corner.minX;
          dy = Math.round((corner.minY + dy) / g) * g - corner.minY;
        }
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey) {
          const snap = snapRoom(startDoc, id, dx, dy);
          if (snap !== undefined) {
            dx = snap.dx;
            dy = snap.dy;
            this.guides = snap.guides;
          }
        }
        this.dragging = true;
        delta = [dx, dy];
        ctx.preview((d) => moveRoom(d, id, dx, dy));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const [dx, dy] = delta;
        if (moved && (Math.abs(dx) >= 0.005 || Math.abs(dy) >= 0.005)) ctx.apply((d) => moveRoom(d, id, dx, dy), { select: { kind: "room", roomId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a resize handle: the handle's `sides` of the room's box follow the
   * pointer along the room's own walls, the opposite sides staying put. The
   * grid sizes it in 10 cm steps; Shift keeps its proportions (the way that
   * changed most leads); Alt moves the opposite sides too, about its middle,
   * and does not snap; Cmd or Ctrl does not snap. Otherwise, with snapping
   * on, the dragged sides snap to the neighbours' walls. Saved on the drop
   * as one resize from where it started. */
  private resizeDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, sides: HomeMapResizeSides, start: HomePoint): void {
    const frame = homeMapRoomFrame(room);
    if (frame === undefined) return;
    const startDoc = ctx.doc;
    const id = room.id;
    const w0 = frame.a1 - frame.a0;
    const d0 = frame.c1 - frame.c0;
    if (w0 <= 1e-6 || d0 <= 1e-6) return;
    const along = (p: HomePoint) => p[0] * frame.u[0] + p[1] * frame.u[1];
    const across = (p: HomePoint) => p[0] * frame.v[0] + p[1] * frame.v[1];
    const fit = (v: number) => Math.min(Math.max(v, HOME_MAP_MIN_ROOM_SIZE), HOME_MAP_MAX_ROOM_SIZE);
    let last: HomeMapResize | undefined;
    ctx.drag(e, {
      move: (p, ev) => {
        const both = ev.altKey ? 2 : 1;
        let width = w0;
        let depth = d0;
        if (sides.a !== undefined) width = w0 + (along(p) - along(start)) * (sides.a === 1 ? 1 : -1) * both;
        if (sides.c !== undefined) depth = d0 + (across(p) - across(start)) * (sides.c === 1 ? 1 : -1) * both;
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          if (sides.a !== undefined) width = Math.round(width / g) * g;
          if (sides.c !== undefined) depth = Math.round(depth / g) * g;
        }
        width = fit(width);
        depth = fit(depth);
        if (ev.shiftKey) {
          const ka = width / w0;
          const kc = depth / d0;
          let k = sides.a === undefined ? kc : sides.c === undefined ? ka : Math.abs(Math.log(ka)) >= Math.abs(Math.log(kc)) ? ka : kc;
          k = Math.min(Math.max(k, HOME_MAP_MIN_ROOM_SIZE / Math.min(w0, d0)), HOME_MAP_MAX_ROOM_SIZE / Math.max(w0, d0));
          width = w0 * k;
          depth = d0 * k;
        }
        const anchor: [number, number] = [
          ev.altKey || sides.a === undefined ? 0.5 : 1 - sides.a,
          ev.altKey || sides.c === undefined ? 0.5 : 1 - sides.c,
        ];
        let resize: HomeMapResize = { width, depth, anchor };
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
          const snap = snapRoomResize(startDoc, id, resize, sides, { proportional: ev.shiftKey });
          if (snap !== undefined) {
            resize = snap.resize;
            this.guides = snap.guides;
          }
        }
        this.dragging = true;
        this.resizing = true;
        last = resize;
        const made = resize;
        ctx.preview((d) => resizeRoom(d, id, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = last;
        if (!moved || made === undefined) return;
        if (Math.abs((made.width ?? w0) - w0) < 0.005 && Math.abs((made.depth ?? d0) - d0) < 0.005) return;
        ctx.apply((d) => resizeRoom(d, id, made), { select: { kind: "room", roomId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag the turn handle: the room turns round its middle, in 15 degree
   * steps unless Alt is held. */
  private turnDrag(ctx: HomeMapEditorContext, e: PointerEvent, room: HomeMapRoom, start: HomePoint): void {
    const id = room.id;
    const pivot = homeMapRoomCenter(room);
    const a0 = Math.atan2(start[1] - pivot[1], start[0] - pivot[0]);
    let turn = 0;
    ctx.drag(e, {
      move: (p, ev) => {
        let deg = ((Math.atan2(p[1] - pivot[1], p[0] - pivot[0]) - a0) * 180) / Math.PI;
        deg = ((deg + 540) % 360) - 180;
        if (!ev.altKey) deg = Math.round(deg / TURN_STEP) * TURN_STEP;
        this.dragging = true;
        turn = deg;
        ctx.preview((d) => turnRoom(d, id, deg, pivot));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        if (moved && Math.abs(turn) > 0.01) ctx.apply((d) => turnRoom(d, id, turn, pivot), { select: { kind: "room", roomId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing: its middle follows the pointer, in grid steps while the
   * grid is on, and a side that runs along a wall of its room snaps flush
   * against it unless Alt is held or snapping is off. Saved on the drop as
   * one move. */
  private thingMoveDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const from = object.c;
    let c: HomePoint = from;
    ctx.drag(e, {
      move: (p, ev) => {
        let next: HomePoint = [from[0] + p[0] - start[0], from[1] + p[1] - start[1]];
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          next = [Math.round(next[0] / g) * g, Math.round(next[1] / g) * g];
        }
        this.guides = [];
        if (ctx.toggles.snap && !ev.altKey) {
          const snap = snapObject(room, object, next);
          next = snap.c;
          this.guides = snap.guides;
        }
        this.dragging = true;
        c = next;
        const made = next;
        ctx.preview((d) => moveObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        if (moved && Math.hypot(c[0] - from[0], c[1] - from[1]) >= 0.005) {
          const made = c;
          ctx.apply((d) => moveObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
        }
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing's resize handle: the handle's `sides` of its box follow
   * the pointer along its own sides, the opposite sides staying put. The
   * grid sizes it in 10 cm steps; Shift keeps its proportions; Alt resizes
   * it about its middle. Saved on the drop as one resize. */
  private thingResizeDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, sides: HomeMapResizeSides, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const { u, v } = homeMapObjectAxes(object);
    const w0 = Math.max(object.size[0], HOME_MAP_MIN_OBJECT_SIZE);
    const d0 = Math.max(object.size[1], HOME_MAP_MIN_OBJECT_SIZE);
    const along = (p: HomePoint) => p[0] * u[0] + p[1] * u[1];
    const across = (p: HomePoint) => p[0] * v[0] + p[1] * v[1];
    const fit = (x: number) => Math.min(Math.max(x, HOME_MAP_MIN_OBJECT_SIZE), HOME_MAP_MAX_OBJECT_SIZE);
    let last: HomeMapObjectResize | undefined;
    ctx.drag(e, {
      move: (p, ev) => {
        const both = ev.altKey ? 2 : 1;
        let width = w0;
        let depth = d0;
        if (sides.a !== undefined) width = w0 + (along(p) - along(start)) * (sides.a === 1 ? 1 : -1) * both;
        if (sides.c !== undefined) depth = d0 + (across(p) - across(start)) * (sides.c === 1 ? 1 : -1) * both;
        if (ctx.toggles.grid) {
          const g = HOME_MAP_ARRANGE_GRID;
          if (sides.a !== undefined) width = Math.round(width / g) * g;
          if (sides.c !== undefined) depth = Math.round(depth / g) * g;
        }
        width = fit(width);
        depth = fit(depth);
        if (ev.shiftKey) {
          const ka = width / w0;
          const kc = depth / d0;
          let k = sides.a === undefined ? kc : sides.c === undefined ? ka : Math.abs(Math.log(ka)) >= Math.abs(Math.log(kc)) ? ka : kc;
          k = Math.min(Math.max(k, HOME_MAP_MIN_OBJECT_SIZE / Math.min(w0, d0)), HOME_MAP_MAX_OBJECT_SIZE / Math.max(w0, d0));
          width = w0 * k;
          depth = d0 * k;
        }
        const anchor: [number, number] = [
          ev.altKey || sides.a === undefined ? 0.5 : 1 - sides.a,
          ev.altKey || sides.c === undefined ? 0.5 : 1 - sides.c,
        ];
        this.dragging = true;
        this.resizing = true;
        const made: HomeMapObjectResize = { width, depth, anchor };
        last = made;
        ctx.preview((d) => resizeObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = last;
        if (!moved || made === undefined) return;
        if (Math.abs((made.width ?? w0) - object.size[0]) < 0.005 && Math.abs((made.depth ?? d0) - object.size[1]) < 0.005) return;
        ctx.apply((d) => resizeObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag a thing's turn handle: it turns about its middle, in 15 degree
   * steps unless Alt is held. */
  private thingTurnDrag(ctx: HomeMapEditorContext, e: PointerEvent, thing: ThingAt, start: HomePoint): void {
    const { room, index, object } = thing;
    const id = room.id;
    const pivot = object.c;
    const a0 = Math.atan2(start[1] - pivot[1], start[0] - pivot[0]);
    let turn = 0;
    ctx.drag(e, {
      move: (p, ev) => {
        let deg = ((Math.atan2(p[1] - pivot[1], p[0] - pivot[0]) - a0) * 180) / Math.PI;
        deg = ((deg + 540) % 360) - 180;
        if (!ev.altKey) deg = Math.round(deg / TURN_STEP) * TURN_STEP;
        this.dragging = true;
        // The plan's angles run the other way round from a thing's turn.
        turn = -deg;
        const made = turn;
        ctx.preview((d) => turnObject(d, id, index, made));
      },
      end: (_p, _ev, moved) => {
        this.stopDrag(ctx);
        const made = turn;
        if (moved && Math.abs(made) > 0.01) ctx.apply((d) => turnObject(d, id, index, made), { select: { kind: "object", roomId: id, object: index } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  hover(ctx: HomeMapEditorContext, at: HomePoint | undefined): void {
    this.draw.hover(ctx, at);
  }

  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.draw.active) return this.draw.keyDown(ctx, e);
    const many = this.pickedMany(ctx);
    if (many !== undefined) return this.manyKeyDown(ctx, e, many);
    const room = this.focus(ctx);
    if (room === undefined) return false;
    const shortcut = homeMapShortcut(e, false);
    const thing = this.picked(ctx);
    if (thing !== undefined) {
      const { index, object } = thing;
      const select = { kind: "room" as const, roomId: room.id };
      if (shortcut === "delete") {
        ctx.apply((d) => removeObject(d, room.id, index), { select });
        return true;
      }
      if (shortcut === "cancel") {
        ctx.select(select);
        return true;
      }
      if (typeof shortcut === "object" && "nudge" in shortcut) {
        const [dx, dy] = shortcut.nudge;
        ctx.apply((d) => moveObject(d, room.id, index, [object.c[0] + dx, object.c[1] + dy]));
        return true;
      }
      return false;
    }
    if (shortcut === "delete") {
      void this.askDelete(ctx, room);
      return true;
    }
    if (typeof shortcut === "object" && "nudge" in shortcut) {
      const [dx, dy] = shortcut.nudge;
      ctx.apply((d) => moveRoom(d, room.id, dx, dy));
      return true;
    }
    return false;
  }

  /** Keys for several picked things: Delete asks, then takes them all off;
   * the arrows nudge them all, as one edit; Escape goes back to their room
   * when they are all in one, else to nothing picked. */
  private manyKeyDown(ctx: HomeMapEditorContext, e: KeyboardEvent, many: readonly ThingAt[]): boolean {
    const shortcut = homeMapShortcut(e, false);
    const refs = thingRefs(many);
    if (shortcut === "delete") {
      void this.askDeleteThings(ctx, many);
      return true;
    }
    if (shortcut === "cancel") {
      ctx.select(homeMapThingsHome(many));
      return true;
    }
    if (typeof shortcut === "object" && "nudge" in shortcut) {
      const [dx, dy] = shortcut.nudge;
      ctx.apply((d) => moveObjects(d, refs, dx, dy));
      return true;
    }
    return false;
  }

  /** Take several things off the map, after the page's own yes, as one
   * edit that one undo brings back. */
  private async askDeleteThings(ctx: HomeMapEditorContext, many: readonly ThingAt[]): Promise<void> {
    const refs = thingRefs(many);
    const sure = await ctx.confirm({
      title: `Delete ${homeMapCount(many.length, "thing")}?`,
      text: `${homeMapThingNames(many)} come off the map. Undo brings them back while this page is open.`,
      ok: "Delete",
      danger: true,
    });
    if (sure) ctx.apply((d) => removeObjects(d, refs), { select: homeMapThingsHome(many) ?? null });
  }

  cursor(): string | undefined {
    return this.draw.active ? "crosshair" : undefined;
  }

  leave(ctx: HomeMapEditorContext): void {
    this.draw.stop(ctx);
    this.picker = undefined;
    this.guides = [];
    this.dragging = false;
    this.resizing = false;
  }

  dock(ctx: HomeMapEditorContext): TemplateResult {
    return html`<button type="button" class="hme-tb ${ctx.toggles.snap ? "on" : ""}" aria-pressed=${ctx.toggles.snap ? "true" : "false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${() => ctx.setToggle("snap", !ctx.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${ctx.toggles.grid ? "on" : ""}" aria-pressed=${ctx.toggles.grid ? "true" : "false"}
        @click=${() => ctx.setToggle("grid", !ctx.toggles.grid)}>Grid 10 cm</button>`;
  }

  // ── the pill ───────────────────────────────────────────────────────────

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    if (this.draw.active) {
      return html`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length >= 3 ? html`<button type="button" class="hme-tb" @click=${() => void this.draw.finish(ctx)}>Close the room</button>` : nothing}
        <button type="button" class="hme-tb" @click=${() => this.draw.stop(ctx)}>Cancel</button>`;
    }
    const many = this.pickedMany(ctx);
    if (many !== undefined) {
      const refs = thingRefs(many);
      const shown = many.some((t) => t.object.hidden !== true);
      return html`<span class="hme-pill-name">${homeMapCount(many.length, "thing")}</span>
        <button type="button" class="hme-tb" title=${shown ? "Hide every picked thing" : "Show every picked thing"}
          @click=${() => ctx.apply((d) => setObjectsHidden(d, refs, shown))}>${shown ? "Hide" : "Show"}</button>
        <button type="button" class="hme-tb danger" @click=${() => void this.askDeleteThings(ctx, many)}>Delete</button>`;
    }
    const room = this.focus(ctx);
    if (room === undefined || this.dragging) return nothing;
    const id = room.id;
    const thing = this.picked(ctx);
    if (thing !== undefined) {
      const { index, object } = thing;
      return html`<span class="hme-pill-name">${homeMapThingName(object)}</span>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnObject(d, id, index, 90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${() => ctx.apply((d) => levelObject(d, id, index))}>Line up</button>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => setObjectHidden(d, id, index, object.hidden !== true))}>${object.hidden === true ? "Show" : "Hide"}</button>
        <button type="button" class="hme-tb" @click=${() => ctx.select({ kind: "room", roomId: id })}>${homeMapRoomName(room)} ›</button>
        <button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removeObject(d, id, index), { select: { kind: "room", roomId: id } })}>Remove</button>`;
    }
    return html`<span class="hme-pill-name">${homeMapRoomName(room)}</span>
      <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, 90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => squareCorners(d, id))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${() => ctx.apply((d) => snapRoomToWalls(d, id))}>Snap to walls</button>
      ${this.floorMenu(ctx, room, "Move to floor", "hme-tb")}
      <button type="button" class="hme-tb danger" @click=${() => void this.askDelete(ctx, room)}>Delete</button>`;
  }

  /** Move to floor: the other floors, and a new one. */
  private floorMenu(ctx: HomeMapEditorContext, room: HomeMapRoom, label: string, cls: string): TemplateResult {
    const others = ctx.doc.floors.filter((f) => !sameHomeMapId(f.id, ctx.floor.id));
    return hmeMenuButton({
      label,
      cls,
      options: [...others.map((f) => ({ value: f.id, label: homeMapFloorName(f) })), { value: "new", label: "New floor…" }],
      pick: (v) => void this.moveToFloor(ctx, room, v),
    });
  }

  private async moveToFloor(ctx: HomeMapEditorContext, room: HomeMapRoom, target: string): Promise<void> {
    const id = room.id;
    const select = { kind: "room" as const, roomId: id };
    if (target !== "new") {
      ctx.apply((d) => moveRoomToFloor(d, id, { floorId: target }), { select, floorId: target });
      return;
    }
    const story = Math.max(...ctx.doc.floors.map((f) => f.story)) + 1;
    const name = await ctx.ask({ title: "A new floor", label: "Name", value: story === 1 ? "Upstairs" : `Floor ${story + 1}`, ok: "Move the room there" });
    if (name === undefined) return;
    const floorId = ctx.newId();
    ctx.apply((d) => moveRoomToFloor(d, id, { newFloor: { id: floorId, name, story } }), { select, floorId });
  }

  private async askDelete(ctx: HomeMapEditorContext, room: HomeMapRoom): Promise<void> {
    const devices = homeMapPinsOfRoom(ctx.floor, room.id).length;
    const sure = await ctx.confirm({ title: `Delete ${homeMapRoomName(room)}?`, text: homeMapDeleteRoomText(room, devices), ok: "Delete room", danger: true });
    if (sure) ctx.apply((d) => deleteRoom(d, room.id), { select: null });
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult {
    const many = this.pickedMany(ctx);
    if (many !== undefined) return this.manyInspector(ctx, many);
    const room = this.focus(ctx);
    if (room === undefined) return this.floorCard(ctx, ctx.floor);
    const thing = this.picked(ctx);
    if (thing !== undefined) return this.thingInspector(ctx, thing);
    const id = room.id;
    const size = homeMapRoomSize(room);
    const lit = homeMapLitRooms(ctx.floor, ctx.toggles.live ? ctx.hass?.states : undefined).has(room.id);
    const pins = homeMapPinsOfRoom(ctx.floor, id);
    const bounds = homePointBounds(room.outline) ?? { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    const tilt = Math.round(-homeMapLevelTurn(room) * 10) / 10;
    const areaKnown = room.areaId === undefined || ctx.areas.some((a) => a.id === room.areaId);
    const pageKnown = room.pageId === undefined || ctx.pages.some((p) => sameHomeMapId(p.id, room.pageId));
    const guess = homeFloorGuess(room);
    const edit = this.edits(ctx);
    return html`
      <section class="hme-card hme-head">
        ${hmeRoomThumb(room, lit)}
        <div class="hme-head-t">
          <strong>${homeMapRoomName(room)}</strong>
          <span>${homeMapFloorName(ctx.floor)} · ${homeMapRoomSizeText(room)} · ${size.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${hmeCard("Room", html`
        ${hmeRow("Name", hmeText({ value: room.name ?? "", label: "Name", placeholder: "Room", set: (v) => ctx.apply((d) => renameRoom(d, id, v)) }))}
        ${hmeRow("Area", hmeSelect({
          label: "Area",
          value: room.areaId ?? "",
          options: [
            { value: "", label: "None" },
            ...(areaKnown ? [] : [{ value: room.areaId!, label: `Not in Home Assistant (${room.areaId})`, disabled: true }]),
            ...ctx.areas.map((a) => ({ value: a.id, label: a.name })),
          ],
          set: (v) => ctx.apply((d) => setRoomArea(d, id, v === "" ? undefined : v)),
        }))}
        ${hmeHint("The Home Assistant area. Its devices show first in Not on the map, and Place all by area puts them here.")}
        ${hmeRow("Tap opens", hmeSelect({
          label: "Tap opens",
          value: room.pageId ?? "",
          options: [
            { value: "", label: "Nothing" },
            ...(pageKnown ? [] : [{ value: room.pageId!, label: "A page not in your library", disabled: true }]),
            ...ctx.pages.map((p) => ({ value: p.id, label: `Page: ${p.name}` })),
          ],
          set: (v) => ctx.apply((d) => setRoomPage(d, id, v === "" ? undefined : v)),
        }))}
        ${hmeHint("What a tap on this room does on the map tiles and the watch.")}`)}

      ${hmeCard("Size", html`
        ${hmeFields(
          hmeNumber({ tag: "W", label: "Width", value: size.width, unit: "m", min: HOME_MAP_MIN_ROOM_SIZE, max: HOME_MAP_MAX_ROOM_SIZE, ...edit((d, v) => resizeRoom(d, id, { width: v })) }),
          hmeNumber({ tag: "D", label: "Depth", value: size.depth, unit: "m", min: HOME_MAP_MIN_ROOM_SIZE, max: HOME_MAP_MAX_ROOM_SIZE, ...edit((d, v) => resizeRoom(d, id, { depth: v })) }),
          hmeNumber({ tag: "H", label: "Wall height", value: room.height, unit: "m", min: 0.5, max: 20, ...edit((d, v) => setWallHeight(d, id, v)) }))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${hmeCard("Place", html`
        ${hmeGroup("Corner", hmeFields(
          hmeNumber({ tag: "X", label: "Left", value: bounds.minX, unit: "m", ...edit((d, v) => moveRoom(d, id, v - bounds.minX, 0)) }),
          hmeNumber({ tag: "Y", label: "Top", value: bounds.minY, unit: "m", ...edit((d, v) => moveRoom(d, id, 0, v - bounds.minY)) })))}
        ${hmeGroup("Turn", html`<div class="hme-turn">
          ${hmeNumber({ label: "Turn", value: tilt, unit: "°", digits: 1, min: -180, max: 180, ...edit((d, v) => turnRoom(d, id, v - tilt)) })}
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, -90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => turnRoom(d, id, 90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${() => ctx.apply((d) => levelRoom(d, id))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${hmeRow("Floor", hmeSelect({
          label: "Floor",
          value: ctx.floor.id,
          options: [...ctx.doc.floors.map((f) => ({ value: f.id, label: homeMapFloorName(f) })), { value: "new", label: "New floor…" }],
          set: (v) => void this.moveToFloor(ctx, room, v),
        }))}`)}

      ${hmeCard("Floor finish", html`<div class="hme-pics">
        ${hmePic({ label: `Auto: ${HOME_MAP_FINISH_NAMES[guess]}`, picture: hmeFinishSwatch(guess), on: room.finish === undefined, title: "Picked from the room's name and furniture", click: () => ctx.apply((d) => setRoomFinish(d, id, undefined)) })}
        ${HOME_MAP_FINISHES.map((f: HomeMapFinish) => hmePic({ label: HOME_MAP_FINISH_NAMES[f], picture: hmeFinishSwatch(f), on: room.finish === f, click: () => ctx.apply((d) => setRoomFinish(d, id, f)) }))}
      </div>
        ${this.roomColourRow(ctx, room, "floorColor")}
        ${this.roomColourRow(ctx, room, "wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${hmeCard("In this room", html`
        ${room.objects.length === 0 ? html`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>` : nothing}
        ${room.objects.map((o, i) => html`<div class="hme-r tight"><span class="hme-grow ${o.hidden === true ? "dim" : ""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${() => this.pickThing(ctx, room, i)}>${homeMapThingName(o)}</button></span>
          ${hmeChip({ on: o.hidden !== true, onText: "Shown", offText: "Hidden", label: `${homeMapThingName(o)} shown`, click: () => ctx.apply((d) => setObjectHidden(d, id, i, o.hidden !== true)) })}
          <button type="button" class="hme-x" aria-label=${`Remove ${homeMapThingName(o)}`} title="Remove" @click=${() => ctx.apply((d) => removeObject(d, id, i))}>×</button></div>`)}
        <div class="hme-r tight"><span class="hme-grow">${room.openings.length === 0 ? "No doors or windows" : [...new Set(room.openings.map(homeMapOpeningName))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${() => ctx.editWalls(id)}>Edit walls ›</button></div>
        ${pins.length === 0 ? html`<div class="hme-r tight"><span class="hme-grow dim">No devices. Drag one from Not on the map.</span></div>` : nothing}
        ${pins.map((p) => html`<div class="hme-r tight"><span class="hme-grow">
          <button type="button" class="hme-link" title="Pick it to set its height, glow and tap" @click=${() => ctx.select({ kind: "pin", pinId: p.id })}>${homeMapPinName(p, ctx.hass)}</button></span>
          <span class="hme-val">${homeMapStateText(p.entityId, ctx.toggles.live ? ctx.hass?.states : undefined)}</span></div>`)}
        <div class="hme-row-end">
          ${hmeMenuButton({
            label: "＋ Add a thing",
            cls: "hme-tb",
            options: HOME_MAP_OBJECT_KINDS.map((k) => ({ value: k, label: homeMapObjectName(k) })),
            pick: (kind) => {
              const at = homeLabelPoint(room) ?? homeMapRoomCenter(room);
              ctx.apply((d) => addObject(d, id, kind, at));
            },
          })}
          ${this.addFurnitureButton(ctx, room, "hme-tb")}
          <button type="button" class="hme-tb danger push" @click=${() => void this.askDelete(ctx, room)}>Delete room</button>
        </div>`)}`;
  }

  /** A number field's `set` and `preview` for an edit by its value: saved
   * once when typed or let go, drawn as it goes while scrubbed. */
  private edits(ctx: HomeMapEditorContext) {
    return (op: (d: HomeMapDocument, v: number) => HomeMapDocument | undefined) => ({
      set: (v: number) => ctx.apply((d) => op(d, v)),
      preview: (v: number | undefined) => ctx.preview(v === undefined ? undefined : (d) => op(d, v)),
    });
  }

  /** A picked thing: where its middle is, its turn, its sizes, and whether
   * it is shown. */
  private thingInspector(ctx: HomeMapEditorContext, thing: ThingAt): TemplateResult {
    const { room, index, object } = thing;
    const id = room.id;
    const name = homeMapThingName(object);
    const [width, depth, height] = object.size;
    const turn = thingTurn(object);
    const edit = this.edits(ctx);
    const back = { kind: "room" as const, roomId: id };
    const sizes = { unit: "m", min: HOME_MAP_MIN_OBJECT_SIZE, max: HOME_MAP_MAX_OBJECT_SIZE };
    return html`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${name}</strong>
          <span>In ${homeMapRoomName(room)} · ${width.toFixed(2)} × ${depth.toFixed(2)} × ${height.toFixed(2)} m${(object.lift ?? 0) > 0 ? ` · ${(object.lift ?? 0).toFixed(2)} m up` : ""}${object.hidden === true ? " · Hidden" : ""}</span>
        </div>
      </section>

      ${this.modelCard(ctx, thing)}

      ${this.coloursCard(ctx, thing)}

      ${hmeCard("Size", html`
        ${hmeFields(
          hmeNumber({ tag: "W", label: "Width", value: width, ...sizes, ...edit((d, v) => resizeObject(d, id, index, { width: v })) }),
          hmeNumber({ tag: "D", label: "Depth", value: depth, ...sizes, ...edit((d, v) => resizeObject(d, id, index, { depth: v })) }),
          hmeNumber({ tag: "H", label: "Height", value: height, ...sizes, min: 0.01, ...edit((d, v) => setObject(d, id, index, { size: [width, depth, v] })) }))}`)}

      ${hmeCard("Place", html`
        ${hmeGroup("Middle, and up off the floor", hmeFields(
          hmeNumber({ tag: "X", label: "Middle across", value: object.c[0], unit: "m", ...edit((d, v) => moveObject(d, id, index, [v, object.c[1]])) }),
          hmeNumber({ tag: "Y", label: "Middle down", value: object.c[1], unit: "m", ...edit((d, v) => moveObject(d, id, index, [object.c[0], v])) }),
          hmeNumber({ tag: "Z", label: "Up off the floor", value: object.lift ?? 0, unit: "m", min: 0, max: 100, ...edit((d, v) => setObject(d, id, index, { lift: v })) })))}
        ${hmeGroup("Turn", html`<div class="hme-turn">
          ${hmeNumber({ label: "Turn", value: turn, unit: "°", digits: 1, min: -180, max: 180, ...edit((d, v) => turnObject(d, id, index, v - turn)) })}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${() => ctx.apply((d) => turnObject(d, id, index, -90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${() => ctx.apply((d) => turnObject(d, id, index, 90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${() => ctx.apply((d) => levelObject(d, id, index))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${hmeCard("Show", html`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${hmeChip({ on: object.hidden !== true, onText: "Shown", offText: "Hidden", label: `${name} shown`, click: () => ctx.apply((d) => setObjectHidden(d, id, index, object.hidden !== true)) })}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${() => ctx.select(back)}>‹ ${homeMapRoomName(room)}</button>
          <button type="button" class="hme-tb danger push" @click=${() => ctx.apply((d) => removeObject(d, id, index), { select: back })}>Remove</button>
        </div>`)}`;
  }

  /** Several picked things: how many and which; the colours of the parts
   * any of their pieces has, each pick set on every one that has that part;
   * shown or hidden; and Delete. Each change is one edit (one undo, one
   * save). */
  private manyInspector(ctx: HomeMapEditorContext, many: readonly ThingAt[]): TemplateResult {
    const refs = thingRefs(many);
    const rooms = [...new Set(many.map((t) => homeMapRoomName(t.room)))];
    const hidden = homeMapShared(many.map((t) => t.object.hidden === true));
    const parts = HOME_MAP_COLOUR_PARTS.filter((part) => many.some((t) => homeMapColourParts(t.object).includes(part)));
    return html`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${homeMapCount(many.length, "thing")}</strong>
          <span>${homeMapThingNames(many)} · in ${rooms.join(", ")}</span>
        </div>
      </section>

      ${hmeCard("Picked", html`${many.map((t) => html`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${t.object.hidden === true ? "dim" : ""}" title="Pick this one alone"
            @click=${() => this.pickThing(ctx, t.room, t.index)}>${homeMapThingName(t.object)}</button>
          <span class="hme-val">${homeMapRoomName(t.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${homeMapThingName(t.object)} out of the pick`} title="Leave it out of the pick"
            @click=${() => ctx.select(homeMapToggleThing(ctx.selection, { roomId: t.room.id, object: t.index }))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`, String(many.length))}

      ${parts.length === 0 ? nothing : hmeCard("Colours", html`
        ${parts.map((part) => this.manyColourRow(ctx, many, part))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${hmeCard("Show", html`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${hidden.mixed
            ? html`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${() => ctx.apply((d) => setObjectsHidden(d, refs, false))}>Mixed</button>`
            : hmeChip({ on: !hidden.value, onText: "Shown", offText: "Hidden", label: "Shown", click: () => ctx.apply((d) => setObjectsHidden(d, refs, !hidden.value)) })}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${() => void this.askDeleteThings(ctx, many)}>Delete ${homeMapCount(many.length, "thing")}</button>
        </div>`)}`;
  }

  /** A part's colour for several things: on those whose piece has it,
   * Mixed while they differ. */
  private manyColourRow(ctx: HomeMapEditorContext, many: readonly ThingAt[], part: HomeMapPart): TemplateResult {
    const having = many.filter((t) => homeMapColourParts(t.object).includes(part));
    const refs = thingRefs(having);
    const shared = homeMapShared(having.map((t) => t.object[part]?.toUpperCase()));
    return colourChoice({
      word: part === "fabric" ? "Fabric" : "Wood",
      presets: part === "fabric" ? HOME_MAP_FABRIC_PRESETS : HOME_MAP_WOOD_PRESETS,
      now: shared.mixed ? undefined : shared.value,
      mixed: shared.mixed,
      defaultTitle: "Each model's own colour",
      customTitle: `Any ${part} colour`,
      customLabel: `Pick a ${part} colour for every picked thing`,
      set: (color) => ctx.apply((d) => setObjectsPart(d, refs, part, color)),
      preview: (color) => ctx.preview(color === undefined ? undefined : (d) => setObjectsPart(d, refs, part, color) ?? d),
    });
  }

  /** The piece the 3D look draws a thing as: its picture, name and why it
   * is that one, and Change, which opens the picker. */
  private modelCard(ctx: HomeMapEditorContext, thing: ThingAt): TemplateResult {
    const { room, index, object } = thing;
    const piece = homeMapPieceOf(object);
    const own = homeMapPiece(object.model);
    const why = own !== undefined
      ? `${own.group}, picked from the catalog`
      : object.model !== undefined
        ? piece === undefined ? "A piece this panel does not know yet" : `A piece this panel does not know yet, drawn as the ${piece.name.toLowerCase()} meanwhile`
        : piece !== undefined ? `Picked by its kind: ${homeMapObjectName(object.kind)}` : "A plain box, as the scan found it";
    return hmeCard("Model", html`<div class="hme-model">
        ${this.piecePic(ctx, piece, "hme-model-pic")}
        <div class="hme-model-t"><strong>${piece?.name ?? "Plain box"}</strong><span>${why}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${() => this.openPicker(ctx, room, index)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`);
  }

  /** The colours of the piece's fabric and wood, a row for each part the
   * piece has (none, no card): Default (the model's own), the presets and a
   * custom colour. Each pick is one edit. */
  private coloursCard(ctx: HomeMapEditorContext, thing: ThingAt): TemplateResult | typeof nothing {
    const parts = homeMapColourParts(thing.object);
    if (parts.length === 0) return nothing;
    return hmeCard("Colours", html`
      ${parts.map((part) => this.colourRow(ctx, thing, part))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`);
  }

  private colourRow(ctx: HomeMapEditorContext, thing: ThingAt, part: HomeMapPart): TemplateResult {
    const { room, index, object } = thing;
    const id = room.id;
    const word = part === "fabric" ? "Fabric" : "Wood";
    return colourChoice({
      word,
      presets: part === "fabric" ? HOME_MAP_FABRIC_PRESETS : HOME_MAP_WOOD_PRESETS,
      now: object[part],
      defaultTitle: "The model's own colour",
      customTitle: `Any ${part} colour`,
      customLabel: `Pick a ${part} colour`,
      set: (color) => ctx.apply((d) => setObjectPart(d, id, index, part, color)),
      preview: (color) => ctx.preview(color === undefined ? undefined : (d) => setObjectPart(d, id, index, part, color) ?? d),
    });
  }

  /** A room's floor or wall colour: Default (the look's own), the presets
   * (for the floor, those of its finish or its auto guess) and a custom
   * colour. Each pick is one edit. */
  private roomColourRow(ctx: HomeMapEditorContext, room: HomeMapRoom, part: HomeMapRoomPart): TemplateResult {
    const id = room.id;
    const floor = part === "floorColor";
    return colourChoice({
      word: floor ? "Floor" : "Walls",
      presets: floor ? HOME_MAP_FLOOR_COLOR_PRESETS[homeFloorKind(room)] : HOME_MAP_WALL_COLOR_PRESETS,
      now: room[part],
      defaultTitle: floor ? "The finish's own colour" : "The look's own wall colour",
      customTitle: floor ? "Any floor colour" : "Any wall colour",
      customLabel: floor ? "Pick a floor colour" : "Pick a wall colour",
      set: (color) => ctx.apply((d) => setRoomColor(d, id, part, color)),
      preview: (color) => ctx.preview(color === undefined ? undefined : (d) => setRoomColor(d, id, part, color) ?? d),
    });
  }

  /** With no room picked: the floor itself. */
  private floorCard(ctx: HomeMapEditorContext, floor: HomeMapFloor): TemplateResult {
    const lights = homeMapLightsOn(floor, ctx.toggles.live ? ctx.hass?.states : undefined);
    return html`${hmeCard("Floor", html`
        ${hmeRow("Name", hmeText({ value: floor.name, label: "Floor name", placeholder: homeMapFloorName(floor), set: (v) => ctx.apply((d) => renameFloor(d, floor.id, v)) }))}
        ${hmeRow("On it", html`<span class="hme-val">${homeMapCount(floor.rooms.length, "room")} · ${homeMapCount(floor.pins.length, "device")} · ${homeMapLightsOnWords(lights)}</span>`)}`)}
      ${hmeCard("Edit", html`<p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
        <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${homeMapUndoKey()}.</p>
        <p class="hme-text dim">Double-click a room to edit its walls, doors and windows. Drag a device from Not on the map onto the plan to place it; Shift, Cmd or Ctrl and a click picks several. Cmd or Ctrl and a click picks several things too, to colour or hide them together.</p>`)}`;
  }
}
