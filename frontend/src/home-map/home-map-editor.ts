// `<wa-home-map-editor>`: the home's map editor in the panel, built from the
// approved mock boards of one edit page (A: one edit page, B: a room's walls,
// C: the Home style panel). The map is made by the iPhone's scan; here it is
// arranged, reshaped, dressed with devices and styled, all on one page with
// no modes.
//
// The page is a shell round one editing part (`edit-page.ts`). The shell
// owns:
//
// - the bar: ‹ Home, the title (with "› <Room> walls" while a room's walls
//   are edited), the floor picker (each floor with its picture and counts;
//   add, rename and delete a floor), ＋ Add (also the key A), which opens
//   the Add dialog of devices and furniture (`add-dialog.ts`), the Flat |
//   Model | Both view switch,
//   Home style with a swatch of the home style's look, which opens the Home
//   style panel (`mode-style.ts`) over the page, closed by ✕, Escape or a
//   click outside it, Undo and Redo (also Cmd or Ctrl Z, Shift for redo,
//   whenever no text field has focus; every other key does nothing while
//   any control of a form has focus) and whether the map is saved;
// - the side panel on the left, the page's;
// - the stage, which fills all the space the side panel leaves and grows
//   with the window: the floor drawn as the plan look of `tile-art.ts` (floors by
//   finish, walls, doors with their swing, windows, furniture, pools of
//   light, pins), each room's name and size, and over it the page's overlay
//   and its tool rail. Drag empty space, hold Space and drag, or scroll to
//   pan; Ctrl or Cmd and scroll, a pinch, or the dock's buttons to zoom; Fit
//   shows the floor; a double-click goes to the page. The floating pill at
//   the top is the page's (under the blue Done bar while a room's walls are
//   edited, the stage ringed in blue); the dock at the bottom has the zoom,
//   Fit, the page's Snap and the View menu (the page's switches and Live
//   states), closed by Escape or a press on the stage. Measure (the tool
//   rail's M) clicks
//   two points. Model shows the floor as the tiles' small model (read only,
//   dragged to turn); editing happens in Flat. Both puts the model beside
//   the plan, the
//   plan on the left edited as in Flat and the model on the right following
//   every edit and drag as it happens. The model outlines the picked room or
//   thing in blue. The model's dock has Lights and Daylight in 3D, Turn
//   back, and the Look menu, which picks its look: the tiles' five, or 3D,
//   the whole floor drawn for real by three.js (`scene3d.ts`, loaded only
//   when first picked) with the catalog's furniture and each light lit as
//   Home Assistant says, orbited by dragging and zoomed by scrolling, at
//   night (Lights) or by day (Daylight);
// - the hover (`ctx.hover`), as the complication editor's: the pointer
//   resting on the plan or the 3D view, or on a list row, names what a
//   click there would pick (`plan-pick.ts` finds it on the plan, as the
//   page's presses do), and the plan and the 3D view mark it in a paler
//   blue than the pick, never on what is picked; it never picks or saves;
// - the selection, the undo stack and the saves (`editor-session.ts`):
//   every edit is made at once on the page and saved soon after, a drag
//   once on the drop;
// - the page's own dialogs for a yes or no and for one line of text.
//
// The edit page implements `HomeMapPart` (`editor-mode.ts` has the contract
// and the rules). On each draw the shell makes a `HomeMapEditorContext` (the
// map, the floor shown with any drag's preview, the selection, the room
// whose walls are edited, the view and its coordinate helpers, the
// switches, each room's scan as the iPhone made it, read with the map,
// apply, preview, select, editWalls, drag, undo, the dialogs) and asks the
// page for its side panel, overlay, pill, dock and View menu; presses on
// the stage and keys go to the page first, and what it leaves pans, clears
// the selection or zooms. The page draws its own pins while the floor is
// edited (the plan then leaves them out), puts its tool rail and the side
// view over the stage, and takes a device dragged onto the plan.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/home-map` (`hook.ts`). Nothing it imports may import `icons.ts`.

import { LitElement, type PropertyValues, type TemplateResult, html, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import { chromeTokens } from "../editor-chrome.js";
import { formStyles } from "../form-styles.js";
import { type HassLike, fetchHomeMap } from "../ha-api.js";
import { fetchLibrarySummary } from "../library/client.js";
import { libraryItems, libraryOf } from "../library/model.js";
import type { IconProvider } from "../renderer.js";
import { randomWatchId } from "../watch-pages/edit.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type HomeMapOp, addFloor, deleteFloor, homeMapLampOfPin, homeStyleOf, renameFloor } from "./edit-ops.js";
import { HomeMapEditPage } from "./edit-page.js";
import { type HomeMapAddTab, HomeMapAddDialog, homeMapAddDialogStyles } from "./add-dialog.js";
import {
  type HomeMapApplyOptions,
  type HomeMapDragHandlers,
  type HomeMapEditorContext,
  type HomeMapPageChoice,
  type HomeMapSelection,
  type HomeMapToggles,
  homeMapLampPick,
  homeMapPickedThings,
  homeMapSelectionRoom,
  homeMapSelectionThere,
  homeMapToggleThing,
  sameHomeMapSelection,
} from "./editor-mode.js";
import { homeMapTogglePick } from "./devices-model.js";
import { hmeFloorThumb } from "./editor-parts.js";
import { type HomeMapSaveState, HomeMapSession } from "./editor-session.js";
import { editorStyles } from "./editor-styles.js";
import {
  type HomeMapView,
  HOME_MAP_ZOOM_STEP,
  homeMapCount,
  homeMapFitView,
  homeMapIsFormControl,
  homeMapIsTypingTarget,
  homeMapOnMac,
  homeMapRoomSizeText,
  homeMapShortcut,
  homeMapToPlan,
  homeMapToScreen,
  homeMapZoomAt,
  homeMapZoomPercent,
} from "./editor-view.js";
import { HOME_MAP_ARRANGE_GRID, HOME_MAP_SHAPE_GRID } from "./draw-tool.js";
import { homeLabelPoint, homePointBounds } from "./geometry.js";
import { HomeStylePanel } from "./mode-style.js";
import {
  type HomeMapDocument,
  type HomeMapFloor,
  type HomeMapLook,
  type HomeMapRead,
  type HomeMapScans,
  type HomePoint,
  homeMapAreaChoices,
  homeMapFloorName,
  homeMapRoomName,
  readHomeMap,
  sameHomeMapId,
} from "./model.js";
import { homeMapClickPick, homeMapHoverMark, homeMapLiveHover } from "./plan-pick.js";
import { homeMapApi } from "./save.js";
import type { HomeMap3DInput, HomeMap3DPick, HomeMapScene3D } from "./scene3d.js";
import { homeMapFurnitureBase, homeMapLoad3D } from "./scene3d-load.js";
import { homeMapPlanLook } from "./furniture.js";
import { keepHomeMap, readHomeMapScansFrom } from "./store.js";
import { HOME_TILE_DEFAULT_TURN, HOME_TILE_MODEL_LOOKS, homeTileArt, homeTileGround } from "./tile-art.js";

export const HOME_MAP_UPDATE_TEXT = "Update the Wrist Assistant integration to see the home map here.";
export const HOME_MAP_EMPTY_TEXT = "No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.";

/** A drag shorter than this, in screen pixels, is a click. */
export const HOME_MAP_DRAG_SLOP = 4;
/** How long the zoom must rest before the plan is drawn again at its new
 * scale; meanwhile the last drawing is scaled. */
const REDRAW_AFTER_ZOOM_MS = 140;

/** The words for where the saves stand. */
export function homeMapSaveWords(state: HomeMapSaveState): string {
  return state.kind === "saving" ? "Saving…" : state.kind === "error" ? "Not saved" : "Saved";
}

const MODEL_LOOK_NAMES: Readonly<Record<string, string>> = { night: "Night", warm: "Warm", lines: "Lines", clay: "Clay", blueprint: "Blueprint" };

/** A choice in a dock's View or Look menu. */
interface HomeMapDockItem {
  label: string;
  on: boolean;
  title?: string | undefined;
  pick(): void;
}

type Dialog =
  | { kind: "confirm"; title: string; text?: string; ok: string; danger?: boolean; done: (v: boolean) => void }
  | { kind: "ask"; title: string; label: string; value: string; ok: string; done: (v: string | undefined) => void };

/** The stage element's part the shell reads: where it is on screen, and
 * pointer capture. A stand-in in tests. */
type StageEl = Pick<Element, "getBoundingClientRect" | "addEventListener" | "removeEventListener"> & Partial<Pick<Element, "setPointerCapture" | "releasePointerCapture">>;

export class WaHomeMapEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons: IconProvider | undefined = undefined;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) capable = false;
  /** Where the panel's bundle was served from, for the furniture models
   * beside it; no 3D look without it. */
  @property({ attribute: false }) bundleUrl: string | undefined = undefined;
  /** Back to the panel's Home; no ‹ Home without it. */
  @property({ attribute: false }) onHome: (() => void) | undefined = undefined;
  /** Open a library page in the page editor (Style's Used on, Edit). */
  @property({ attribute: false }) onOpenPage: ((pageId: string) => void) | undefined = undefined;

  @state() private unsupported = false;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private floorId?: string;
  @state() private selection?: HomeMapSelection;
  /** The room whose walls are being edited; undefined while the floor is. */
  @state() private walls?: string;
  /** The Home style panel is open. */
  @state() private styleOpen = false;
  /** Opens on Both, the plan to edit beside the model in 3D. */
  @state() private viewKind: "flat" | "model" | "both" = "both";
  @state() private view?: HomeMapView;
  @state() private artScale = 0;
  @state() private stageSize = { width: 0, height: 0 };
  @state() private toggles: HomeMapToggles = { snap: true, square: true, grid: false, measure: false, live: true, scan: false };
  /** Each room as the iPhone scanned it; undefined from an integration
   * that keeps none. */
  @state() private scans?: HomeMapScans;
  @state() private measure: { a?: HomePoint; b?: HomePoint; hover?: HomePoint } = {};
  @state() private floorMenu = false;
  /** The dock's View menu (the plan's) or Look menu (the model's) is open. */
  @state() private dockMenu?: "view" | "look";
  @state() private dialog?: Dialog;
  @state() private modelLook?: HomeMapLook;
  /** The model is drawn in real 3D rather than as one of the looks. */
  @state() private model3d = true;
  /** The 3D look by day, a sun coming in; else at night, lights only. */
  @state() private daylight = false;
  @state() private modelTurn?: number;
  @state() private pages?: HomeMapPageChoice[];
  @state() private spaceHeld = false;
  /** Bumped to draw again after a change the shell cannot see. */
  @state() private tick = 0;
  /** What a click would pick under the pointer (the context's `hover`). */
  @state() private hover?: HomeMapSelection;
  /** The Add dialog is open, on this tab. */
  @state() private addOpen?: "devices" | "furniture";

  /** The map, its undo stack and its saves; made on the first read. */
  session?: HomeMapSession;
  /** The one edit page, and the Home style panel. */
  readonly page = new HomeMapEditPage();
  readonly stylePanel = new HomeStylePanel();
  /** The Add dialog (`add-dialog.ts`): it adds devices through the page's
   * devices part and draws pieces with its furniture pictures. */
  readonly addDialog = new HomeMapAddDialog(this.page.devices, (ctx, piece, cls) => this.page.arrange.piecePic(ctx, piece, cls));

  /** A drag's live result (`ctx.preview`), never saved. */
  private previewDoc?: HomeMapDocument;
  private loadSeq = 0;
  private askedOnce = false;
  /** The view needs fitting to the floor at the next draw. */
  private needFit = true;
  /** The user panned or zoomed, so a resize keeps the view. */
  private userMoved = false;
  private stageEl?: StageEl;
  private observer?: ResizeObserver;
  private observed?: Element;
  private zoomTimer?: ReturnType<typeof setTimeout>;
  private endDrag?: () => void;
  private touches = new Map<number, HomePoint>();
  private artKey = "";
  private artHeld: unknown = nothing;
  private focusedDialog?: Element;
  /** The 3D look while it is on screen; let go, with all it holds on the
   * GPU, as soon as it is not. */
  private scene3d?: HomeMapScene3D;
  private loading3d = false;
  private failed3d = false;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("keyup", this.onKeyUp);
    if (this.askedOnce) void this.load(true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("keyup", this.onKeyUp);
    this.endDrag?.();
    this.observer?.disconnect();
    this.observed = undefined;
    if (this.zoomTimer !== undefined) clearTimeout(this.zoomTimer);
    this.loadSeq++;
    this.drop3d();
  }

  protected override willUpdate(_changed: PropertyValues): void {
    if (this.hass && this.capable && !this.askedOnce) {
      this.askedOnce = true;
      void this.load();
      void this.loadPages();
    }
    const floor = this.baseFloor();
    if (this.needFit && floor !== undefined && this.stageSize.width > 0) this.fit();
  }

  protected override updated(): void {
    // A dialog just opened takes the focus: its field, else its button.
    const dialog = this.renderRoot.querySelector?.(".hme-dialog");
    if (dialog instanceof Element && dialog !== this.focusedDialog) {
      this.focusedDialog = dialog;
      (dialog.querySelector("input") ?? dialog.querySelector(".primary"))?.focus?.();
      dialog.querySelector("input")?.select?.();
    } else if (dialog === null) {
      this.focusedDialog = undefined;
    }
    const stage = this.renderRoot.querySelector?.(".hme-stage");
    if (stage instanceof Element && stage !== this.observed && typeof ResizeObserver !== "undefined") {
      this.observer ??= new ResizeObserver((entries) => {
        const box = entries[entries.length - 1]?.contentRect;
        if (box !== undefined) this.resizeStage(box.width, box.height);
      });
      if (this.observed !== undefined) this.observer.unobserve(this.observed);
      this.observer.observe(stage);
      this.observed = stage;
    }
    // Draw the plan again at its new scale once the zoom rests.
    if (this.view !== undefined && this.view.scale !== this.artScale && this.zoomTimer === undefined) {
      this.zoomTimer = setTimeout(() => {
        this.zoomTimer = undefined;
        if (this.view !== undefined) this.artScale = this.view.scale;
      }, REDRAW_AFTER_ZOOM_MS);
    }
    this.sync3d();
  }

  // ── the 3D look ────────────────────────────────────────────────────────

  /** What the 3D look draws now: the floor shown with any drag's preview,
   * the live states, the picked room or thing. */
  private input3d(): HomeMap3DInput | undefined {
    const floor = this.shownFloor();
    if (floor === undefined) return undefined;
    const sel = this.selection;
    const things = homeMapPickedThings(sel);
    const roomId = homeMapSelectionRoom(sel);
    const mark = things.length > 0 ? { things } : roomId === undefined ? undefined : { roomId };
    return { floor, states: this.toggles.live ? this.hass?.states : undefined, mark, daylight: this.daylight };
  }

  /** After each draw: the 3D look in its place on the page and drawing what
   * the page shows, loaded the first time; let go when it is off the
   * page. */
  private sync3d(): void {
    const host = this.renderRoot.querySelector?.(".hme-3d-host");
    const input = this.input3d();
    if (!(host instanceof HTMLElement) || input === undefined || this.bundleUrl === undefined) {
      this.drop3d();
      return;
    }
    if (this.scene3d !== undefined) {
      this.scene3d.attach(host);
      this.scene3d.update(input, this.modelTurnNow());
      this.scene3d.setHover(this.hoverFor3d());
      return;
    }
    if (this.loading3d || this.failed3d) return;
    this.loading3d = true;
    const base = homeMapFurnitureBase(this.bundleUrl);
    void homeMapLoad3D().then(
      (m) => {
        this.loading3d = false;
        if (!this.isConnected) return;
        try {
          this.scene3d ??= new m.HomeMapScene3D(base);
          this.scene3d.onPick = (pick, keys) => this.pick3d(pick, keys);
          this.scene3d.onHover = (pick) => this.hover3d(pick);
        } catch {
          // No WebGL here.
          this.failed3d = true;
        }
        this.tick++;
      },
      () => {
        this.loading3d = false;
        this.failed3d = true;
        this.tick++;
      },
    );
  }

  /** A click on the 3D look picks what it found, as a click on the plan
   * does: a thing, a light's pin or a room, empty space picking nothing.
   * With Cmd or Ctrl (`keys.add`) a thing or a light is added to the pick or
   * taken out, as on the plan, and a room or empty space leaves the pick as
   * it is. A light a lamp holds is its lamp, picked or added as the lamp.
   * While a room's walls are edited, a click anywhere but that room goes
   * back to the floor, the room picked. */
  pick3d(found: HomeMap3DPick | undefined, keys: { add: boolean } = { add: false }): void {
    if (this.dialog !== undefined) return;
    this.floorMenu = false;
    const floor = this.baseFloor();
    const lamp = found?.kind === "pin" && floor !== undefined ? homeMapLampOfPin(floor, found.pinId) : undefined;
    const pick: HomeMap3DPick | undefined = lamp === undefined ? found : { kind: "object", roomId: lamp.roomId, object: lamp.object };
    if (this.walls !== undefined) {
      if (pick === undefined || pick.kind === "pin" || !sameHomeMapId(pick.roomId, this.walls)) this.editWalls(undefined);
      return;
    }
    if (keys.add) {
      if (pick?.kind === "object") this.select(homeMapToggleThing(this.selection, { roomId: pick.roomId, object: pick.object }));
      else if (pick?.kind === "pin") this.select(homeMapTogglePick(this.selection, pick.pinId));
      return;
    }
    this.select(pick === undefined ? undefined
      : pick.kind === "pin" ? { kind: "pin", pinId: pick.pinId }
      : pick.kind === "object" ? { kind: "object", roomId: pick.roomId, object: pick.object }
      : { kind: "room", roomId: pick.roomId });
  }

  private drop3d(): void {
    this.scene3d?.dispose();
    this.scene3d = undefined;
  }

  // ── the hover ──────────────────────────────────────────────────────────

  /** Set or clear what a click would pick under the pointer (`ctx.hover`);
   * the same again draws nothing. It never changes the pick or saves. */
  setHover(hover: HomeMapSelection | undefined): void {
    if (!sameHomeMapSelection(hover, this.hover)) this.hover = hover;
  }

  /** The pointer resting on the 3D look over what a click there would
   * pick, as `pick3d` reads a click: a light a lamp holds is its lamp.
   * Nothing while a room's walls are edited or a dialog is open. */
  hover3d(found: HomeMap3DPick | undefined): void {
    if (this.dialog !== undefined || this.walls !== undefined) {
      this.setHover(undefined);
      return;
    }
    this.setHover(found === undefined ? undefined
      : found.kind === "pin" ? homeMapLampPick(this.baseFloor(), { kind: "pin", pinId: found.pinId })
      : found.kind === "object" ? { kind: "object", roomId: found.roomId, object: found.object }
      : { kind: "room", roomId: found.roomId });
  }

  /** The hover as the 3D look marks it: a room, a thing or a light's pin,
   * unless it is picked already (the pick's own outline shows it). */
  private hoverFor3d(): HomeMap3DPick | undefined {
    const h = homeMapLiveHover(this.hover, this.selection);
    if (h === undefined) return undefined;
    if (h.kind === "pin") return { kind: "pin", pinId: h.pinId };
    if (h.kind === "object") return { kind: "object", roomId: h.roomId, object: h.object };
    return h.kind === "room" ? { kind: "room", roomId: h.roomId } : undefined;
  }

  /** What a click at plan point `at` would pick, for the plan's hover:
   * nothing for a finger, while Space pans, while a tool other than Pick is
   * out (Measure, drawing, a door or window to place, a room's walls), while
   * the lamp chooser or a dialog is open, or over a picked thing's handles,
   * which take the press. */
  private planHoverAt(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): HomeMapSelection | undefined {
    if (e.pointerType === "touch" || this.spaceHeld || this.dialog !== undefined || this.walls !== undefined) return undefined;
    if (this.page.tool(ctx) !== "pick" || this.page.devices.choosing) return undefined;
    const target = e.target as Element | null;
    if (typeof target?.closest === "function" && target.closest("[data-hme=turn], [data-hme=resize]") !== null) return undefined;
    return homeMapClickPick(ctx.floor, ctx.toScreen, at);
  }

  /** Back to the home style's turn: the model looks' turn, and the 3D
   * look's camera framing the whole floor from there. */
  private turnBack(): void {
    this.modelTurn = undefined;
    this.scene3d?.frameFloor(homeStyleOf(this.doc).turn ?? HOME_TILE_DEFAULT_TURN);
  }

  // ── loading ────────────────────────────────────────────────────────────

  private async load(quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass || !this.capable) return;
    const seq = ++this.loadSeq;
    if (!quiet) {
      this.loading = this.session === undefined;
      this.loadError = undefined;
    }
    try {
      const reply = await fetchHomeMap(hass);
      if (seq !== this.loadSeq) return;
      this.unsupported = false;
      this.loadError = undefined;
      this.show({ doc: readHomeMap(reply?.doc) ?? null, rev: typeof reply?.rev === "number" ? reply.rev : 0 });
      void this.loadScans();
    } catch (err) {
      if (seq !== this.loadSeq) return;
      const { code, message } = watchCommandError(err);
      if (code === "unknown_command") this.unsupported = true;
      else if (!quiet || this.session === undefined) this.loadError = message;
    }
    this.loading = false;
  }

  /** Each room as the iPhone scanned it, for Shape's Show scan as it was
   * and Back to the scan: read with the map and again when the switch is
   * turned on, so a scan saved meanwhile shows. A failed read keeps the
   * last one. */
  private async loadScans(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    try {
      this.scans = await readHomeMapScansFrom(hass);
    } catch {
      // Kept as last read; the map itself is unaffected.
    }
  }

  /** The library's pages, for a room's Tap opens menu. A home without the
   * library offers none. */
  private async loadPages(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    try {
      const lib = libraryOf(await fetchLibrarySummary(hass));
      this.pages = libraryItems(lib, "pages").map((p) => ({ id: p.id, name: p.name }));
    } catch {
      this.pages = [];
    }
  }

  private show(read: HomeMapRead): void {
    const hass = this.hass;
    if (hass) keepHomeMap(hass, read);
    if (this.session === undefined) {
      this.session = new HomeMapSession(homeMapApi(this.hassOrThrow()), read, () => this.afterChange(), (saved) => {
        if (this.hass) keepHomeMap(this.hass, saved);
      });
      this.needFit = true;
    } else if (!this.session.load(read)) {
      return;
    }
    this.afterChange();
  }

  private hassOrThrow(): HassLike {
    const hass = this.hass;
    if (hass === undefined) throw new Error("no hass");
    return hass;
  }

  /** After the map changed: the floor shown still on it, the room whose
   * walls are edited still on that floor, the selection still there, and a
   * draw. */
  private afterChange(): void {
    const floors = this.session?.doc?.floors ?? [];
    if (!floors.some((f) => sameHomeMapId(f.id, this.floorId))) {
      this.floorId = floors[0]?.id;
      this.needFit = true;
    }
    const walls = this.walls;
    if (walls !== undefined && !(this.baseFloor()?.rooms ?? []).some((r) => sameHomeMapId(r.id, walls))) this.walls = undefined;
    if (!homeMapSelectionThere(this.baseFloor(), this.selection)) this.selection = undefined;
    if (!homeMapSelectionThere(this.baseFloor(), this.hover)) this.hover = undefined;
    this.tick++;
  }

  // ── the map and the floor ──────────────────────────────────────────────

  private get doc(): HomeMapDocument | null {
    return this.session?.doc ?? null;
  }

  /** The floor shown, without a preview. */
  private baseFloor(): HomeMapFloor | undefined {
    const floors = this.doc?.floors ?? [];
    return floors.find((f) => sameHomeMapId(f.id, this.floorId)) ?? floors[0];
  }

  /** The floor shown with a drag's preview made on it. */
  private shownFloor(): HomeMapFloor | undefined {
    const base = this.baseFloor();
    if (base === undefined || this.previewDoc === undefined) return base;
    return this.previewDoc.floors.find((f) => sameHomeMapId(f.id, base.id)) ?? base;
  }

  // ── edits ──────────────────────────────────────────────────────────────

  /** Make an edit (`ctx.apply`). */
  apply(op: HomeMapOp, options: HomeMapApplyOptions = {}): boolean {
    const session = this.session;
    if (session === undefined) return false;
    this.previewDoc = undefined;
    if (!session.apply(op)) {
      this.tick++;
      return false;
    }
    if (options.floorId !== undefined) this.floorId = options.floorId;
    if (options.select !== undefined) this.selection = homeMapLampPick(this.baseFloor(), options.select ?? undefined);
    this.afterChange();
    return true;
  }

  preview(op: HomeMapOp | undefined): void {
    const doc = this.doc;
    this.previewDoc = op === undefined || doc === null ? undefined : op(doc) ?? this.previewDoc;
    this.tick++;
  }

  undo(): void {
    this.previewDoc = undefined;
    if (this.session?.undo() === true) this.afterChange();
  }

  redo(): void {
    this.previewDoc = undefined;
    if (this.session?.redo() === true) this.afterChange();
  }

  /** Pick something (`ctx.select`); a light a lamp holds picks its lamp. */
  select(selection: HomeMapSelection | undefined): void {
    this.selection = homeMapLampPick(this.baseFloor(), selection);
  }

  /** Edit a room's walls (`ctx.editWalls`), or with undefined go back to
   * editing the floor; any tool is put down on the way in or out. Flat,
   * Model or Both stays as picked. */
  editWalls(roomId: string | undefined, selection?: HomeMapSelection): void {
    const from = this.walls;
    const room = roomId === undefined ? undefined : this.baseFloor()?.rooms.find((r) => sameHomeMapId(r.id, roomId));
    if (roomId !== undefined && room === undefined) return;
    const ctx = this.context();
    if (ctx !== undefined && !(roomId === undefined ? from === undefined : sameHomeMapId(roomId, from))) this.page.leave?.(ctx);
    this.walls = room?.id;
    this.styleOpen = false;
    const back = room?.id ?? from;
    this.selection = selection ?? (back === undefined ? this.selection : { kind: "room", roomId: back });
  }

  setFloor(floorId: string): void {
    const ctx = this.context();
    if (ctx !== undefined) this.page.leave?.(ctx);
    this.floorId = floorId;
    this.walls = undefined;
    this.selection = undefined;
    this.floorMenu = false;
    this.measure = {};
    this.needFit = true;
    this.userMoved = false;
  }

  setToggle(key: keyof HomeMapToggles, on: boolean): void {
    this.toggles = { ...this.toggles, [key]: on };
    if (key === "measure") this.measure = {};
    if (key === "scan" && on) void this.loadScans();
  }

  /** The page's own yes or no. */
  confirm(o: { title: string; text?: string; ok: string; danger?: boolean }): Promise<boolean> {
    this.dialog?.kind === "confirm" ? this.dialog.done(false) : this.dialog?.done(undefined);
    return new Promise((resolve) => {
      this.dialog = { kind: "confirm", ...o, done: (v) => { this.dialog = undefined; resolve(v); } };
    });
  }

  /** The page's own line of text. */
  ask(o: { title: string; label: string; value: string; ok: string }): Promise<string | undefined> {
    this.dialog?.kind === "confirm" ? this.dialog.done(false) : this.dialog?.done(undefined);
    return new Promise((resolve) => {
      this.dialog = { kind: "ask", ...o, done: (v) => { this.dialog = undefined; resolve(v); } };
    });
  }

  /** The stage's size, from its observer; the first one fits the floor. */
  resizeStage(width: number, height: number): void {
    const first = this.stageSize.width === 0;
    this.stageSize = { width, height };
    if (first || !this.userMoved) this.needFit = true;
  }

  /** Show the whole floor. */
  fit(): void {
    const { width, height } = this.stageSize;
    if (width <= 0) return;
    this.view = homeMapFitView(this.baseFloor(), width, height);
    this.artScale = this.view.scale;
    this.needFit = false;
    this.userMoved = false;
  }

  zoomBy(factor: number, at?: HomePoint): void {
    if (this.view === undefined) return;
    this.view = homeMapZoomAt(this.view, factor, at ?? [this.stageSize.width / 2, this.stageSize.height / 2]);
    this.userMoved = true;
  }

  // ── the context the page is handed ─────────────────────────────────────

  /** The context for the page, or undefined before a map with a floor is
   * in. */
  context(): HomeMapEditorContext | undefined {
    const doc = this.doc;
    const floor = this.shownFloor();
    if (doc === null || floor === undefined) return undefined;
    const view = this.view ?? { scale: 40, ox: 0, oy: 0 };
    const session = this.session;
    return {
      hass: this.hass,
      icons: this.icons,
      doc,
      floor,
      selection: this.selection,
      walls: this.walls,
      view,
      stage: this.stageSize,
      toggles: this.toggles,
      pages: this.pages ?? [],
      areas: homeMapAreaChoices(this.hass),
      scans: this.scans,
      furnitureBase: this.bundleUrl === undefined ? undefined : homeMapFurnitureBase(this.bundleUrl),
      canUndo: session?.canUndo ?? false,
      canRedo: session?.canRedo ?? false,
      toScreen: (p) => homeMapToScreen(view, p),
      px: (m) => m * view.scale,
      toPlan: (x, y) => this.toPlan(x, y),
      apply: (op, options) => this.apply(op, options),
      preview: (op) => this.preview(op),
      select: (sel) => this.select(sel),
      editWalls: (roomId, sel) => this.editWalls(roomId, sel),
      setFloor: (id) => this.setFloor(id),
      setToggle: (key, on) => this.setToggle(key, on),
      drag: (e, handlers) => this.drag(e, handlers),
      undo: () => this.undo(),
      redo: () => this.redo(),
      confirm: (o) => this.confirm(o),
      ask: (o) => this.ask(o),
      newId: () => randomWatchId(),
      note: (kind, text) => {
        if (this.session !== undefined) this.session.note = { kind, text };
        this.tick++;
      },
      redraw: () => {
        this.tick++;
      },
      hover: this.hover,
      setHover: (hover) => this.setHover(hover),
      openAdd: (tab) => this.openAdd(tab),
      openPage: this.onOpenPage,
    };
  }

  /** Open the Add dialog on a tab (`ctx.openAdd`, the bar's ＋ Add, the key
   * A): the floor menu and the Home style panel close first. */
  openAdd(tab: HomeMapAddTab = "devices"): void {
    const ctx = this.context();
    if (ctx === undefined) return;
    this.floorMenu = false;
    if (this.styleOpen) this.closeStyle();
    this.addDialog.open(ctx, tab);
    this.addOpen = tab;
  }

  /** Close the Add dialog, the focus going back to ＋ Add (a lamp chooser
   * an add opened takes it from there). */
  closeAdd(): void {
    if (this.addOpen === undefined) return;
    this.addOpen = undefined;
    void this.updateComplete.then(() => {
      const button = this.renderRoot?.querySelector?.(".hme-add-btn") as { focus?: () => void } | null | undefined;
      button?.focus?.();
    });
  }

  private toPlan(clientX: number, clientY: number): HomePoint {
    const rect = this.stageEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return homeMapToPlan(this.view ?? { scale: 40, ox: 0, oy: 0 }, [clientX - rect.left, clientY - rect.top]);
  }

  private stagePoint(e: { clientX: number; clientY: number }): HomePoint {
    const rect = this.stageEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  /** Follow a press as a drag (`ctx.drag`): the pointer captured, moves
   * past the slop reported once a frame, then the end, or the cancel when
   * the drag is dropped first (`endDrag`: a pinch, another drag, the page
   * closing), with no move left waiting for its frame. */
  private drag(e: PointerEvent, handlers: HomeMapDragHandlers): void {
    const el = this.stageEl;
    if (el === undefined) return;
    this.endDrag?.();
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    let last: PointerEvent | undefined;
    let frame = 0;
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : undefined;
    const flush = () => {
      frame = 0;
      if (last !== undefined) handlers.move(this.toPlan(last.clientX, last.clientY), last);
    };
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {
      /* a synthetic press has no pointer to capture */
    }
    const move = (ev: Event) => {
      const p = ev as PointerEvent;
      if (p.pointerId !== e.pointerId) return;
      if (!moved && Math.hypot(p.clientX - sx, p.clientY - sy) < HOME_MAP_DRAG_SLOP) return;
      moved = true;
      last = p;
      if (raf === undefined) flush();
      else if (frame === 0) frame = raf(flush);
    };
    const finish = (ev: Event) => {
      const p = ev as PointerEvent;
      if (p.pointerId !== e.pointerId) return;
      cleanup();
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        flush();
      }
      handlers.end(this.toPlan(p.clientX, p.clientY), p, moved);
    };
    const cleanup = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", finish);
      el.removeEventListener("pointercancel", finish);
      try {
        el.releasePointerCapture?.(e.pointerId);
      } catch {
        /* already released */
      }
      if (this.endDrag === drop) this.endDrag = undefined;
    };
    const drop = () => {
      cleanup();
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      handlers.cancel?.();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", finish);
    el.addEventListener("pointercancel", finish);
    this.endDrag = drop;
  }

  // ── the stage's presses ────────────────────────────────────────────────

  /** A press on the stage: a pinch's second finger, the model's turn, a
   * pan (middle button, Space, or a press the page leaves), a measure, or
   * the page's. */
  onStageDown(e: PointerEvent): void {
    this.stageEl = e.currentTarget as unknown as StageEl;
    this.floorMenu = false;
    this.dockMenu = undefined;
    // A press lets go of the hover: what it picks is lit as the pick.
    this.setHover(undefined);
    if (this.dialog !== undefined) return;
    if (e.pointerType === "touch") {
      this.touches.set(e.pointerId, [e.clientX, e.clientY]);
      if (this.touches.size === 2) {
        this.endDrag?.();
        this.preview(undefined);
        this.pinch();
        return;
      }
    }
    if (this.viewKind === "model") {
      this.turnModel(e);
      return;
    }
    if (e.button === 1 || this.spaceHeld) {
      e.preventDefault?.();
      this.pan(e, false);
      return;
    }
    if (e.button !== 0) return;
    const ctx = this.context();
    if (ctx === undefined) return;
    if (this.toggles.measure) {
      const at = this.toPlan(e.clientX, e.clientY);
      const m = this.measure;
      this.measure = m.a === undefined || m.b !== undefined ? { a: at } : { a: m.a, b: at };
      return;
    }
    const at = this.toPlan(e.clientX, e.clientY);
    if (this.page.pointerDown?.(ctx, e, at) === true) {
      e.preventDefault?.();
      return;
    }
    this.pan(e, true);
  }

  /** A double-click on the plan: the page's (a room's walls). */
  onStageDblClick(e: MouseEvent): void {
    this.stageEl = e.currentTarget as unknown as StageEl;
    if (this.dialog !== undefined || this.viewKind === "model" || this.toggles.measure || this.spaceHeld || e.button !== 0) return;
    const ctx = this.context();
    if (ctx !== undefined) this.page.doubleClick?.(ctx, e, this.toPlan(e.clientX, e.clientY));
  }

  /** The pointer over the plan: the measure's loose end, the page's hover,
   * and what a click there would pick, tinted (none while a button is
   * down, so a drag or a pan shows none). */
  onStageMove(e: PointerEvent): void {
    this.stageEl = e.currentTarget as unknown as StageEl;
    if (this.touches.has(e.pointerId)) this.touches.set(e.pointerId, [e.clientX, e.clientY]);
    if (e.buttons !== 0 || this.viewKind === "model") {
      this.setHover(undefined);
      return;
    }
    const at = this.toPlan(e.clientX, e.clientY);
    if (this.toggles.measure && this.measure.a !== undefined && this.measure.b === undefined) this.measure = { ...this.measure, hover: at };
    const ctx = this.context();
    if (ctx === undefined) return;
    this.page.hover?.(ctx, at);
    this.setHover(this.planHoverAt(ctx, e, at));
  }

  onStageLeave(): void {
    this.setHover(undefined);
    const ctx = this.context();
    if (ctx !== undefined) this.page.hover?.(ctx, undefined);
  }

  onStageUp(e: PointerEvent): void {
    this.touches.delete(e.pointerId);
  }

  /** Something dragged from the rail over the plan: the page says whether
   * it takes a drop there. */
  onStageDrag(e: DragEvent): void {
    this.stageEl = e.currentTarget as unknown as StageEl;
    const ctx = this.context();
    if (ctx === undefined || this.viewKind === "model" || this.dialog !== undefined) return;
    if (this.page.dragOver?.(ctx, this.toPlan(e.clientX, e.clientY), e) === true) {
      e.preventDefault?.();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    }
  }

  onStageDragLeave(e: DragEvent): void {
    // Leaving for one of the plan's own parts is not leaving the plan.
    const to = e.relatedTarget as Node | null;
    const from = e.currentTarget as Node | null;
    if (to !== null && from !== null && typeof from.contains === "function" && from.contains(to)) return;
    const ctx = this.context();
    if (ctx !== undefined) this.page.dragOver?.(ctx, undefined, e);
  }

  onStageDrop(e: DragEvent): void {
    this.stageEl = e.currentTarget as unknown as StageEl;
    const ctx = this.context();
    if (ctx === undefined || this.viewKind === "model") return;
    e.preventDefault?.();
    this.page.drop?.(ctx, this.toPlan(e.clientX, e.clientY), e);
  }

  /** Drag the plan about. A click (no move) on empty space clears the
   * selection when `clears`. */
  private pan(e: PointerEvent, clears: boolean): void {
    const start = this.view;
    if (start === undefined) return;
    const sx = e.clientX;
    const sy = e.clientY;
    this.drag(e, {
      move: (_p, ev) => {
        this.view = { ...start, ox: start.ox + ev.clientX - sx, oy: start.oy + ev.clientY - sy };
        this.userMoved = true;
      },
      end: (_p, _ev, moved) => {
        if (!moved && clears) this.selection = undefined;
      },
    });
  }

  /** Two fingers on the stage: they pan and zoom it. */
  private pinch(): void {
    const el = this.stageEl;
    const start = this.view;
    const ids = [...this.touches.keys()];
    if (el === undefined || start === undefined || ids.length < 2) return;
    const at = () => ids.map((id) => this.touches.get(id)!);
    const [p0, q0] = at();
    const d0 = Math.max(Math.hypot(q0![0] - p0![0], q0![1] - p0![1]), 1);
    const rect = el.getBoundingClientRect();
    const m0: HomePoint = [(p0![0] + q0![0]) / 2 - rect.left, (p0![1] + q0![1]) / 2 - rect.top];
    const move = (ev: Event) => {
      const p = ev as PointerEvent;
      if (!this.touches.has(p.pointerId)) return;
      this.touches.set(p.pointerId, [p.clientX, p.clientY]);
      const [a, b] = at();
      const d = Math.max(Math.hypot(b![0] - a![0], b![1] - a![1]), 1);
      const m: HomePoint = [(a![0] + b![0]) / 2 - rect.left, (a![1] + b![1]) / 2 - rect.top];
      const zoomed = homeMapZoomAt(start, d / d0, m0);
      this.view = { ...zoomed, ox: zoomed.ox + m[0] - m0[0], oy: zoomed.oy + m[1] - m0[1] };
      this.userMoved = true;
    };
    const up = (ev: Event) => {
      this.touches.delete((ev as PointerEvent).pointerId);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  /** Drag across the model to turn it. */
  private turnModel(e: PointerEvent): void {
    const start = this.modelTurnNow();
    const sx = e.clientX;
    this.drag(e, {
      move: (_p, ev) => {
        let turn = start + (ev.clientX - sx) * 0.5;
        turn = ((((turn + 180) % 360) + 360) % 360) - 180;
        this.modelTurn = Math.round(turn);
      },
      end: () => undefined,
    });
  }

  private modelTurnNow(): number {
    return this.modelTurn ?? homeStyleOf(this.doc).turn ?? HOME_TILE_DEFAULT_TURN;
  }

  private modelLookNow(): HomeMapLook {
    if (this.modelLook !== undefined) return this.modelLook;
    const look = homeStyleOf(this.doc).look;
    return HOME_TILE_MODEL_LOOKS.includes(look) ? look : "night";
  }

  /** Scroll pans; with Ctrl or Cmd (a trackpad's pinch too) it zooms about
   * the pointer. */
  onWheel(e: WheelEvent): void {
    if (this.viewKind === "model" || this.view === undefined) return;
    this.stageEl = e.currentTarget as unknown as StageEl;
    e.preventDefault?.();
    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    if (e.ctrlKey || e.metaKey) {
      this.zoomBy(Math.exp(-e.deltaY * scale * 0.0025), this.stagePoint(e));
      return;
    }
    this.view = { ...this.view, ox: this.view.ox - e.deltaX * scale, oy: this.view.oy - e.deltaY * scale };
    this.userMoved = true;
  }

  // ── keys ───────────────────────────────────────────────────────────────

  /** A key anywhere on the page while it is open: nothing while a text
   * field has focus or a dialog is open; undo and redo; nothing more while
   * any other control of a form has focus (a slider, a colour, a menu), so
   * Delete there never removes the picked things; with the Home style panel
   * open, only Escape, which closes it; then Space for panning, the page's
   * keys, then Escape, zoom and fit. */
  readonly onKey = (e: KeyboardEvent): void => {
    // The Add dialog keeps its own keys.
    if (this.dialog !== undefined || this.addOpen !== undefined || this.session === undefined) return;
    // A sheet keeps its own keys.
    if ((this.renderRoot as ParentNode | undefined)?.querySelector?.(".hme-sheet") != null) return;
    const target = (typeof e.composedPath === "function" ? e.composedPath()[0] : undefined) ?? e.target;
    if (homeMapIsTypingTarget(target)) return;
    const shortcut = homeMapShortcut(e, false);
    if (shortcut === "undo" || shortcut === "redo") {
      e.preventDefault?.();
      if (shortcut === "undo") this.undo();
      else this.redo();
      return;
    }
    if (this.styleOpen) {
      if (e.key === "Escape") this.closeStyle();
      return;
    }
    if (homeMapIsFormControl(target)) return;
    if (this.dockMenu !== undefined && e.key === "Escape") {
      this.dockMenu = undefined;
      return;
    }
    if (e.key === " " && !e.repeat) {
      this.spaceHeld = true;
      e.preventDefault?.();
      return;
    }
    // A opens the Add dialog, in any view, unless the lamp chooser is open.
    if (typeof shortcut === "object" && "letter" in shortcut && shortcut.letter === "a" && !this.page.devices.choosing) {
      e.preventDefault?.();
      this.openAdd();
      return;
    }
    const ctx = this.context();
    if (ctx !== undefined && this.viewKind !== "model" && this.page.keyDown?.(ctx, e) === true) {
      e.preventDefault?.();
      return;
    }
    switch (shortcut) {
      case "cancel":
        if (this.floorMenu) this.floorMenu = false;
        else if (this.toggles.measure) this.setToggle("measure", false);
        else if (this.walls !== undefined) this.editWalls(undefined);
        else this.selection = undefined;
        return;
      case "zoomIn":
        this.zoomBy(HOME_MAP_ZOOM_STEP);
        return;
      case "zoomOut":
        this.zoomBy(1 / HOME_MAP_ZOOM_STEP);
        return;
      case "fit":
        this.fit();
        return;
    }
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === " ") this.spaceHeld = false;
  };

  // ── the Home style panel ───────────────────────────────────────────────

  /** Open or close the Home style panel. */
  toggleStyle(): void {
    if (this.styleOpen) {
      this.closeStyle();
      return;
    }
    this.floorMenu = false;
    this.styleOpen = true;
  }

  closeStyle(): void {
    this.styleOpen = false;
    this.stylePanel.leave();
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    void this.tick;
    if (!this.capable || this.unsupported) return this.calm(html`<b>${HOME_MAP_UPDATE_TEXT}</b>`);
    if (this.loadError !== undefined) {
      return this.calm(html`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${() => void this.load()}>Try again</button>`);
    }
    if (this.loading || this.session === undefined) return this.calm(html`Loading…`);
    const doc = this.doc;
    if (doc === null || doc.floors.length === 0) return this.calm(html`<b>${HOME_MAP_EMPTY_TEXT}</b>`);
    const ctx = this.context()!;
    const note = this.session.note;
    return html`<div class="hme">
      ${this.renderBar(doc, ctx)}
      ${note === undefined ? nothing : html`<div class="hme-note ${note.kind}" role="status"><span>${note.text}</span>
        <button class="hme-link" @click=${() => this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-insp" aria-label=${this.walls === undefined ? "Side panel" : "Walls"}>${this.page.inspector(ctx)}</aside>
        <section class="hme-stage-wrap">${this.renderStage(ctx)}</section>
      </div>
      ${this.page.sheet?.(ctx) ?? nothing}
      ${this.renderDialog()}
      ${this.addOpen === undefined ? nothing : this.addDialog.render(ctx, () => this.closeAdd())}
    </div>`;
  }

  private calm(body: TemplateResult): TemplateResult {
    return html`<div class="hme-calm"><div class="hme-empty">${body}</div></div>`;
  }

  private renderBar(doc: HomeMapDocument, ctx: HomeMapEditorContext): TemplateResult {
    const floor = this.baseFloor()!;
    const state = this.session?.state ?? { kind: "saved" };
    const mac = homeMapOnMac();
    const wallsRoom = this.walls === undefined ? undefined : floor.rooms.find((r) => sameHomeMapId(r.id, this.walls));
    const look = homeStyleOf(doc).look;
    return html`<header class="hme-bar">
      ${this.onHome === undefined ? nothing : html`<button type="button" class="hme-back" @click=${() => this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${wallsRoom === undefined ? nothing : html`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${homeMapRoomName(wallsRoom)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu ? "true" : "false"}
          @click=${() => { this.floorMenu = !this.floorMenu; }}>
          ${hmeFloorThumb(floor)}
          <span class="hme-floor-t"><span>${homeMapFloorName(floor)}</span><small>${homeMapCount(floor.rooms.length, "room")} · ${homeMapCount(floor.pins.length, "device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu ? this.renderFloorMenu(doc, floor) : nothing}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind === "flat" ? "on" : ""} aria-pressed=${this.viewKind === "flat" ? "true" : "false"} @click=${() => { this.viewKind = "flat"; }}>Flat</button>
        <button type="button" class=${this.viewKind === "model" ? "on" : ""} aria-pressed=${this.viewKind === "model" ? "true" : "false"} @click=${() => { this.viewKind = "model"; }}>Model</button>
        <button type="button" class=${this.viewKind === "both" ? "on" : ""} aria-pressed=${this.viewKind === "both" ? "true" : "false"}
          title="The plan to edit on the left, the model following it on the right" @click=${() => { this.viewKind = "both"; }}>Both</button>
      </div>
      <div class="hme-style-wrap">
        ${this.renderStyleButton(look)}
        ${this.styleOpen ? this.stylePanel.panel(ctx, () => this.closeStyle()) : nothing}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${mac ? "⌘Z" : "Ctrl+Z"})`} ?disabled=${!ctx.canUndo} @click=${() => this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${mac ? "⇧⌘Z" : "Ctrl+Shift+Z"})`} ?disabled=${!ctx.canRedo} @click=${() => this.redo()}>↷</button>
      <span class="hme-status ${state.kind}" role="status" title=${state.kind === "error" ? state.text : nothing}><span class="hme-status-dot"></span>${homeMapSaveWords(state)}</span>
    </header>`;
  }

  /** Home style, with a swatch of the home style's look: opens its panel. */
  private renderStyleButton(look: HomeMapLook): TemplateResult {
    return html`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen ? "on" : ""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen ? "true" : "false"}
      title="How every map tile looks, unless a tile picks its own" @click=${() => this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${homeTileGround(look, 0.2)}`} aria-hidden="true"></span>Home style</button>`;
  }

  private renderFloorMenu(doc: HomeMapDocument, on: HomeMapFloor): TemplateResult {
    return html`<div class="hme-pop" role="menu" aria-label="Floors">
      ${doc.floors.map((f) => html`<div class="hme-pop-row ${sameHomeMapId(f.id, on.id) ? "on" : ""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${() => this.setFloor(f.id)}>
          ${hmeFloorThumb(f)}<span class="hme-floor-t"><span>${homeMapFloorName(f)}</span><small>${homeMapCount(f.rooms.length, "room")} · ${homeMapCount(f.pins.length, "device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${homeMapFloorName(f)}`} @click=${() => void this.renameFloorAsk(f)}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${doc.floors.length === 1 ? "The map keeps at least one floor" : "Delete"} aria-label=${`Delete ${homeMapFloorName(f)}`}
          ?disabled=${doc.floors.length === 1} @click=${() => void this.deleteFloorAsk(f)}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${() => void this.addFloorAsk()}>＋ Add a floor</button>
    </div>`;
  }

  private async addFloorAsk(): Promise<void> {
    this.floorMenu = false;
    const doc = this.doc;
    if (doc === null) return;
    const story = Math.max(...doc.floors.map((f) => f.story)) + 1;
    const name = await this.ask({ title: "Add a floor", label: "Name", value: story === 1 ? "Upstairs" : `Floor ${story + 1}`, ok: "Add floor" });
    if (name === undefined) return;
    const id = randomWatchId();
    if (this.apply((d) => addFloor(d, { id, name, story }), { floorId: id, select: null })) this.needFit = true;
  }

  private async renameFloorAsk(floor: HomeMapFloor): Promise<void> {
    this.floorMenu = false;
    const name = await this.ask({ title: "Rename floor", label: "Name", value: floor.name || homeMapFloorName(floor), ok: "Rename" });
    if (name !== undefined) this.apply((d) => renameFloor(d, floor.id, name));
  }

  private async deleteFloorAsk(floor: HomeMapFloor): Promise<void> {
    this.floorMenu = false;
    const sure = await this.confirm({
      title: `Delete ${homeMapFloorName(floor)}?`,
      text: `Its ${homeMapCount(floor.rooms.length, "room")} and ${homeMapCount(floor.pins.length, "device")} come off the map. Undo brings them back while this page is open.`,
      ok: "Delete floor",
      danger: true,
    });
    if (sure) this.apply((d) => deleteFloor(d, floor.id), { select: null });
  }

  // ── the stage ──────────────────────────────────────────────────────────

  private renderStage(ctx: HomeMapEditorContext): TemplateResult {
    const page = this.page;
    const { width, height } = this.stageSize;
    const model = this.viewKind === "model";
    const both = this.viewKind === "both";
    const pill = model ? nothing : page.pill?.(ctx) ?? nothing;
    const banner = model ? nothing : page.banner?.(ctx) ?? nothing;
    const cursor = this.spaceHeld ? "grab" : model ? "ew-resize" : this.toggles.measure ? "crosshair" : page.cursor?.(ctx) ?? "default";
    const empty = ctx.floor.rooms.length === 0;
    const real = this.model3d && this.bundleUrl !== undefined;
    // The model beside the plan, the same size as it; the stage's observer
    // measures the plan, the first stage.
    const side = !both ? nothing : real ? html`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(ctx)}
      ${this.renderModelDock(false)}
    </div>` : html`<div class="hme-stage model hme-split-r" style=${`background:${homeTileGround(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${homeMapFloorName(ctx.floor)}`}
        @pointerdown=${(e: PointerEvent) => this.onModelDown(e)}>
        ${this.renderModel(ctx, width, height)}
      </svg>
      ${this.renderModelDock(false)}
    </div>`;
    if (model && real) {
      return html`<div class="hme-stage model hme-3d">
        ${this.render3d(ctx)}
        ${this.renderAddButton()}
        ${this.renderDock(ctx)}
      </div>`;
    }
    const walls = this.walls !== undefined && !model;
    return html`<div class="hme-stage ${model ? "model" : ""} ${both ? "hme-split-l" : ""} ${walls ? "walls" : ""}" style=${model ? `background:${homeTileGround(this.modelLookNow())}` : ""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`} style=${`cursor:${cursor}`}
        role="img" aria-label=${`Plan of ${homeMapFloorName(ctx.floor)}`}
        @pointerdown=${(e: PointerEvent) => this.onStageDown(e)}
        @contextmenu=${(e: MouseEvent) => { if (e.ctrlKey) e.preventDefault(); }}
        @dblclick=${(e: MouseEvent) => this.onStageDblClick(e)}
        @pointermove=${(e: PointerEvent) => this.onStageMove(e)}
        @pointerup=${(e: PointerEvent) => this.onStageUp(e)}
        @pointercancel=${(e: PointerEvent) => this.onStageUp(e)}
        @pointerleave=${() => this.onStageLeave()}
        @wheel=${(e: WheelEvent) => this.onWheel(e)}
        @dragover=${(e: DragEvent) => this.onStageDrag(e)}
        @dragleave=${(e: DragEvent) => this.onStageDragLeave(e)}
        @drop=${(e: DragEvent) => this.onStageDrop(e)}>
        ${model ? this.renderModel(ctx, width, height) : this.renderPlan(ctx, width, height)}
      </svg>
      ${banner === nothing ? nothing : html`<div class="hme-banner">${banner}</div>`}
      ${pill === nothing ? nothing : html`<div class="hme-pill ${banner === nothing ? "" : "under"}">${pill}</div>`}
      ${model ? nothing : page.stageExtra?.(ctx) ?? nothing}
      ${empty && !model && !page.arrange.draw.active ? html`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${() => { const c = this.context(); if (c) page.startDrawing(c); }}>＋ Draw a room by hand</button></div>` : nothing}
      ${walls ? nothing : this.renderAddButton()}
      ${this.renderDock(ctx)}
    </div>${side}`;
  }

  /** The Add button, floating in the plan's top left corner (the 3D view's
   * in Model): the one way in for devices and furniture, where the eye
   * already is rather than in the bar, where it was easy to miss. */
  private renderAddButton(): TemplateResult {
    return html`<button type="button" class="hme-add-btn" aria-haspopup="dialog" aria-expanded=${this.addOpen === undefined ? "false" : "true"}
      title="Add a device or a piece of furniture (A)" @click=${() => this.openAdd()}>
      <span aria-hidden="true">＋</span>Add device or furniture</button>`;
  }

  /** A press on the model beside the plan turns it, as in Model. */
  onModelDown(e: PointerEvent): void {
    if (this.dialog !== undefined || e.button !== 0) return;
    this.stageEl = e.currentTarget as unknown as StageEl;
    this.floorMenu = false;
    this.dockMenu = undefined;
    this.turnModel(e);
  }

  /** The plan, its names and sizes, the page's overlay and the measure. */
  private renderPlan(ctx: HomeMapEditorContext, width: number, height: number) {
    const view = this.view;
    if (view === undefined || width <= 0) return nothing;
    const art = this.planArt(ctx.floor, width, height, this.page.drawsPins?.(ctx) === true ? "none" : "all");
    const k = view.scale / (this.artScale || view.scale);
    return svg`${this.background(view, width, height)}
      <g class="hme-art" transform=${`translate(${view.ox.toFixed(2)} ${view.oy.toFixed(2)}) scale(${k.toFixed(5)})`} pointer-events="none">${art}</g>
      ${ctx.walls === undefined ? homeMapHoverMark(ctx.floor, this.hover, this.selection, ctx.toScreen) : nothing}
      <g class="hme-labels" pointer-events="none">${this.labels(ctx)}</g>
      <g class="hme-overlay">${this.page.overlay(ctx)}</g>
      ${this.toggles.measure ? this.measureMarks(ctx) : nothing}`;
  }

  /** The plan look drawn at the resting scale, kept while nothing it shows
   * changed (a hover draws the page again but not the plan). `devices`
   * none leaves the pins to the page, which draws its own. */
  private planArt(floor: HomeMapFloor, width: number, height: number, devices: "all" | "none"): unknown {
    const states = this.toggles.live ? this.hass?.states : undefined;
    const scale = this.artScale || this.view!.scale;
    const key = `${floorKey(floor)}|${objectKey(states)}|${scale}|${width}|${height}|${this.iconsTick}|${objectKey(this.icons)}|${devices}`;
    if (key !== this.artKey) {
      this.artKey = key;
      this.artHeld = homeTileArt({
        floor,
        states,
        look: "plan",
        names: false,
        devices,
        furniture: true,
        // Each thing as the piece the 3D view draws, in its own colours.
        furnitureLook: homeMapPlanLook,
        glow: true,
        width,
        height,
        icons: this.icons,
        frame: { scale, ox: 0, oy: 0 },
      });
    }
    return this.artHeld;
  }

  /** Dots that move with the plan, or the grid while it is on. */
  private background(view: HomeMapView, width: number, height: number) {
    const step = this.walls !== undefined ? HOME_MAP_SHAPE_GRID : HOME_MAP_ARRANGE_GRID;
    let size = 20;
    if (this.toggles.grid) {
      size = step * view.scale;
      while (size < 8) size *= 10;
    }
    const ox = ((view.ox % size) + size) % size;
    const oy = ((view.oy % size) + size) % size;
    return svg`<defs><pattern id="hme-bg" width=${size} height=${size} patternUnits="userSpaceOnUse" patternTransform=${`translate(${ox.toFixed(1)} ${oy.toFixed(1)})`}>
        ${this.toggles.grid ? svg`<path d=${`M${size} 0V${size}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />` : svg`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${width} height=${height} fill="url(#hme-bg)" />`;
  }

  /** Each room's name and size on a dark pill, where it fits. */
  private labels(ctx: HomeMapEditorContext) {
    return ctx.floor.rooms.map((room) => {
      const at = homeLabelPoint(room);
      const b = homePointBounds(room.outline);
      if (at === undefined || b === undefined) return nothing;
      const name = homeMapRoomName(room);
      const size = homeMapRoomSizeText(room);
      const roomW = (b.maxX - b.minX) * ctx.view.scale;
      const roomH = (b.maxY - b.minY) * ctx.view.scale;
      const nameW = name.length * 7.4 + 22;
      if (nameW > roomW * 0.95 || roomH < 26) return nothing;
      const both = Math.max(nameW, size.length * 5.8 + 22) <= roomW * 0.95 && roomH >= 48;
      const w = both ? Math.max(nameW, size.length * 5.8 + 22) : nameW;
      const h = both ? 36 : 22;
      const [x, y] = ctx.toScreen(at);
      return svg`<g class="hme-label"><rect x=${(x - w / 2).toFixed(1)} y=${(y - h / 2).toFixed(1)} width=${w.toFixed(1)} height=${h} rx=${both ? 9 : 7} fill="rgba(0,0,0,0.6)" />
        <text x=${x.toFixed(1)} y=${(y + (both ? -3 : 4.5)).toFixed(1)} fill="#fff" font-size=${both ? 13 : 12} font-weight="600" text-anchor="middle">${name}</text>
        ${both ? svg`<text x=${x.toFixed(1)} y=${(y + 11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${size}</text>` : nothing}</g>`;
    });
  }

  private measureMarks(ctx: HomeMapEditorContext) {
    const m = this.measure;
    if (m.a === undefined) return svg`<g class="hme-measure"></g>`;
    const end = m.b ?? m.hover;
    const a = ctx.toScreen(m.a);
    if (end === undefined) return svg`<g class="hme-measure" pointer-events="none"><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /></g>`;
    const b = ctx.toScreen(end);
    const length = Math.hypot(end[0] - m.a[0], end[1] - m.a[1]);
    const mid: HomePoint = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return svg`<g class="hme-measure" pointer-events="none">
      <line x1=${a[0]} y1=${a[1]} x2=${b[0]} y2=${b[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${m.b === undefined ? "6 4" : "none"} />
      <circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /><circle cx=${b[0]} cy=${b[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(mid[0] - 32).toFixed(1)} y=${(mid[1] - 22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${mid[0].toFixed(1)} y=${(mid[1] - 8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${length.toFixed(2)} m</text></g></g>`;
  }

  /** The model look, read only, turned by dragging, the picked room or
   * thing outlined in blue. */
  private renderModel(ctx: HomeMapEditorContext, width: number, height: number) {
    if (width <= 0) return nothing;
    const sel = this.selection;
    const roomId = homeMapSelectionRoom(sel);
    const room = roomId === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, roomId));
    const boxes = homeMapPickedThings(sel).flatMap((t) => ctx.floor.rooms.find((r) => sameHomeMapId(r.id, t.roomId))?.objects[t.object] ?? []);
    const mark = boxes.length > 0 ? { boxes } : room !== undefined ? { outline: room.outline } : undefined;
    return homeTileArt({
      mark,
      floor: ctx.floor,
      states: this.toggles.live ? this.hass?.states : undefined,
      look: this.modelLookNow(),
      turn: this.modelTurnNow(),
      names: true,
      devices: "lights",
      furniture: true,
      glow: true,
      width,
      height,
    });
  }

  /** The 3D look's place: the scene's canvas goes in it after the draw
   * (`sync3d`), with a word while it loads or when it cannot. */
  private render3d(ctx: HomeMapEditorContext): TemplateResult {
    const words = this.failed3d ? "The 3D view needs WebGL, which this browser has turned off." : this.scene3d === undefined ? "Loading the 3D view…" : undefined;
    return html`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${homeMapFloorName(ctx.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${words === undefined ? nothing : html`<div class="hme-3d-note">${words}</div>`}`;
  }

  /** The model's dock: Lights or Daylight in 3D, the Look menu (the tiles'
   * looks and 3D) and Turn back, with Live states when no plan's dock is
   * beside it. */
  private renderModelDock(withLive: boolean, live?: TemplateResult): TemplateResult {
    const real = this.model3d && this.bundleUrl !== undefined;
    const look = real ? undefined : this.modelLookNow();
    const pressed = (on: boolean) => (on ? "true" : "false");
    const looks: HomeMapDockItem[] = HOME_TILE_MODEL_LOOKS.map((l) => ({
      label: MODEL_LOOK_NAMES[l] ?? l,
      on: l === look,
      pick: () => { this.modelLook = l; this.model3d = false; this.dockMenu = undefined; },
    }));
    if (this.bundleUrl !== undefined) {
      looks.push({ label: "3D", on: real, title: "The floor in real 3D, with its furniture and each light lit as it is now", pick: () => { this.model3d = true; this.dockMenu = undefined; } });
    }
    return html`<div class="hme-dock">
      ${real ? html`<button type="button" class="hme-tb ${this.daylight ? "" : "on"}" aria-pressed=${pressed(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${() => { this.daylight = false; }}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight ? "on" : ""}" aria-pressed=${pressed(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${() => { this.daylight = true; }}>Daylight</button>
        <span class="hme-vsep"></span>` : nothing}
      ${this.dockMenuButton("look", `Look: ${real ? "3D" : MODEL_LOOK_NAMES[look ?? "night"] ?? look}`, "How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${real ? "Show the whole floor from the home style's turn" : "Back to the home style's turn"} @click=${() => this.turnBack()}>⟲ Turn back</button>
      ${withLive && live !== undefined ? html`<span class="hme-vsep"></span>${live}` : nothing}
    </div>${this.dockMenuList("look", "Look", looks, "menuitemradio")}`;
  }

  /** The plan's dock: the zoom, Fit, the page's Snap and the View menu (the
   * page's switches and Live states). */
  private renderDock(ctx: HomeMapEditorContext): TemplateResult {
    const liveTitle = "Draw what Home Assistant's devices are doing now";
    const flipLive = () => this.setToggle("live", !this.toggles.live);
    if (this.viewKind === "model") {
      return this.renderModelDock(true, html`<button type="button" class="hme-tb ${this.toggles.live ? "on" : ""}" aria-pressed=${this.toggles.live ? "true" : "false"}
        title=${liveTitle} @click=${flipLive}><span class="hme-live-dot"></span>Live states</button>`);
    }
    const fit = this.stageSize.width > 0 ? homeMapFitView(this.baseFloor(), this.stageSize.width, this.stageSize.height) : undefined;
    const percent = this.view === undefined || fit === undefined ? 100 : homeMapZoomPercent(this.view, fit);
    const items: HomeMapDockItem[] = [
      ...(this.page.viewItems?.(ctx) ?? []).map((v) => ({ label: v.label, on: v.on, title: v.title, pick: () => v.flip() })),
      { label: "Live states", on: this.toggles.live, title: liveTitle, pick: flipLive },
    ];
    return html`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${() => this.zoomBy(1 / HOME_MAP_ZOOM_STEP)}>−</button>
      <span class="hme-zoom mono">${percent}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${() => this.zoomBy(HOME_MAP_ZOOM_STEP)}>＋</button>
      <button type="button" class="hme-tb" @click=${() => this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(ctx) ?? nothing}
      ${this.dockMenuButton("view", "View", "What the plan shows: the grid, names, live states and more")}
    </div>${this.dockMenuList("view", "View", items, "menuitemcheckbox")}`;
  }

  /** A dock's menu button, View or Look, opening or closing its list. */
  private dockMenuButton(which: "view" | "look", label: string, title: string): TemplateResult {
    const open = this.dockMenu === which;
    return html`<button type="button" class="hme-tb ${open ? "on" : ""}" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} title=${title}
      @click=${() => { this.dockMenu = open ? undefined : which; }}>${label} <span class="hme-caret" aria-hidden="true">▾</span></button>`;
  }

  /** A dock's menu while it is open, over the dock rather than in it (the
   * dock scrolls sideways, which would cut it off): each switch ticked
   * when on. A View switch keeps the menu open; a look closes it. */
  private dockMenuList(which: "view" | "look", label: string, items: readonly HomeMapDockItem[], role: "menuitemcheckbox" | "menuitemradio"): TemplateResult | typeof nothing {
    if (this.dockMenu !== which) return nothing;
    return html`<div class="hme-dock-pop" role="menu" aria-label=${label}>
      ${items.map((it) => html`<button type="button" role=${role} aria-checked=${it.on ? "true" : "false"} class="hme-dock-item ${it.on ? "on" : ""}"
        title=${it.title ?? it.label} @click=${() => it.pick()}><span class="hme-check" aria-hidden="true">${it.on ? "✓" : ""}</span>${it.label}</button>`)}
    </div>`;
  }

  private renderDialog(): TemplateResult | typeof nothing {
    const d = this.dialog;
    if (d === undefined) return nothing;
    const cancel = () => (d.kind === "confirm" ? d.done(false) : d.done(undefined));
    const ok = (root: Element | null) => {
      if (d.kind === "confirm") d.done(true);
      else d.done(((root?.querySelector("input") as HTMLInputElement | null)?.value ?? d.value).trim() || d.value);
    };
    return html`<div class="hme-scrim" @pointerdown=${(e: Event) => { if (e.target === e.currentTarget) cancel(); }}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${d.title}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Escape") { e.stopPropagation(); cancel(); }
          if (e.key === "Enter") { e.preventDefault(); ok(e.currentTarget as Element); }
        }}>
        <h3>${d.title}</h3>
        ${d.kind === "confirm" ? (d.text === undefined ? nothing : html`<p>${d.text}</p>`)
          : html`<label class="hme-dialog-field"><span>${d.label}</span><input type="text" maxlength="100" .value=${d.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${cancel}>Cancel</button>
          <button type="button" class="hme-tb primary ${d.kind === "confirm" && d.danger === true ? "danger-fill" : ""}"
            @click=${(e: Event) => ok((e.currentTarget as Element).closest(".hme-dialog"))}>${d.ok}</button>
        </div>
      </div>
    </div>`;
  }

  static override styles = [formStyles, chromeTokens, editorStyles, homeMapAddDialogStyles];
}

/** A cheap key for a floor drawn: the object itself, by identity. */
const ids = new WeakMap<object, number>();
let nextId = 1;
function objectKey(o: object | undefined): number {
  if (o === undefined) return 0;
  let id = ids.get(o);
  if (id === undefined) ids.set(o, (id = nextId++));
  return id;
}
const floorKey = (floor: HomeMapFloor) => objectKey(floor);

if (!customElements.get("wa-home-map-editor")) {
  customElements.define("wa-home-map-editor", WaHomeMapEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-home-map-editor": WaHomeMapEditor;
  }
}
