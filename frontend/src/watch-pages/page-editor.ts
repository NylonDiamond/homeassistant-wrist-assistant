// `<wa-page-editor>`: the watch's pages as Home Assistant keeps them, and an
// editor for them.
//
// Part 3a drew them: the watch tabs, the page list, one page at the watch's
// own size, where the stored copy has got to, and the earlier saves with a way
// to put one back. Part 3b edits them: pages are added, renamed, hidden,
// moved and deleted, and tiles are moved, swapped, resized and deleted on the
// page, with undo, redo and a save that merges when the iPhone saved too.
//
// Every edit is a function of `edit.ts` applied to a `WatchPagesDraft`
// (`draft.ts`), which keeps the undo steps and merges a change from elsewhere
// into the edits (`rebase`). The drafts live in `kept.ts`, one per watch, so
// they outlast this element: the panel makes a new one each time the route
// opens. Pages and tiles are selected by id, never by place, so a merge that
// reorders them keeps the selection on the same thing.
//
// The pointer arithmetic (pixels to cells, the drag threshold, the auto
// scroll) is in `stage.ts`, without any DOM.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/pages`, and draws the element in its own shadow tree. The element has
// a shadow root of its own, so none of the panel's rules reach it; it reads
// the panel's `--wa-*` colors, which do, takes the panel's form rules from
// `form-styles.ts`, and keeps every other rule here. Nothing this module
// imports may import `icons.ts`: the panel hands its symbol provider in
// through `icons`, and tells of glyphs arriving through `iconsTick`.
//
// Part 3c's two views, the tile settings and the Add tile dialog, are
// modules of their own (`tile-settings.ts`, `add-tile.ts`) that this element
// calls with a host (`editor-host.ts`). They draw with the panel's field rows
// from `editors.ts`, whose drags on a number (`SCRUB_START`, `SCRUB_END`)
// stop here: the panel hears them as gestures on the complication draft.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { formStyles } from "../form-styles.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { deliveryState, initialWatch, rejectedNow, settingsWatches, watchName } from "../watch-settings.js";
import { addTileStyles, renderAddTile } from "./add-tile.js";
import { type WatchPagesApplyOptions, type WatchPagesDraft, saveWatchPagesDraft } from "./draft.js";
import { type AddTileHost, type WatchPagesEditorHost, NO_ICONS, ScrubRun } from "./editor-host.js";
import {
  type WatchCell,
  type WatchDropOutcome,
  type WatchNudgeDirection,
  type WatchRect,
  type WatchResizeHandle,
  type WatchResizePreview,
  WATCH_EDITOR_MAX_ROWS,
  WATCH_TILE_SIZE_PRESETS,
  addWatchPage,
  deleteWatchPage,
  deleteWatchTile,
  dropWatchTile,
  findWatchPage,
  listedWatchPages,
  moveWatchPage,
  nudgeWatchTile,
  previewWatchTileResize,
  resizeWatchTile,
  sameWatchId,
  setWatchPageHidden,
  setWatchPageName,
  watchDropOutcome,
  watchPageLinks,
  watchResizeHandleRect,
  watchTileAtCell,
  watchTileRect,
} from "./edit.js";
import { registerWatchPagesDrafts } from "./hook.js";
import {
  anyWatchPagesDirty,
  dropAllWatchPages,
  forgetWatchPagesDraft,
  keepWatchPagesSelection,
  keptWatchPagesDraft,
  keptWatchPagesSelection,
  takeWatchPagesRecord,
} from "./kept.js";
import {
  type PlacedWatchTile,
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_GRID_TOP_INSET,
  WATCH_SYNC_LIMIT_BYTES,
  asWatchPagesDocument,
  isHiddenWatchPage,
  isJsonObject,
  isSmartWatchPage,
  sizeOf,
  tileEntityId,
  tileKind,
  tileKindLabel,
  tileLabel,
  watchPageExtent,
  watchPageHasHeader,
  watchPageId,
  watchPageLayout,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "./model.js";
import {
  type WatchPagePreviewInput,
  WATCH_SCREEN_FOLD_TEXT,
  renderWatchPagePreview,
  renderWatchScreenFold,
  renderWatchTileFace,
  watchPagePreviewScrolls,
  watchPagePreviewStyles,
  watchScreenColor,
} from "./preview.js";
import { type WatchPagesNote, watchCommandError, watchPagesSaveNote } from "./save-note.js";
import { renderTileSettings, tileSettingsStyles } from "./tile-settings.js";
import {
  type StageGrid,
  autoScrollStep,
  cellAtPx,
  cellsPath,
  cellDelta,
  cellRectPx,
  draggedCorner,
  listDropIndex,
  listMoveIndex,
  nearestCell,
  pastDragThreshold,
  rowsOnScreen,
  stageGrid,
  stageRows,
} from "./stage.js";

// The entry file asks whether a page draft holds edits before it lets the
// person leave; it cannot import this chunk to find out, so the chunk tells it.
registerWatchPagesDrafts({ dirty: anyWatchPagesDirty, drop: dropAllWatchPages });

// The browser's own "Leave site?" question while any kept draft holds edits.
// The panel asks too, but it removes its listener when it is torn down (a
// visit to another sidebar page), while the drafts live on in this module
// until the tab closes; so the chunk keeps a listener of its own, added once.
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyWatchPagesDirty()) return;
    e.preventDefault();
    // Safari ignores `preventDefault` here and reads `returnValue`.
    e.returnValue = "";
  });
}

/** How often the view asks whether the iPhone has collected a save. Nothing
 * on the live line says so: it only carries new revisions. */
const DELIVERY_POLL_MS = 15_000;

const NO_RECORD_TEXT = "Open the iPhone app once with Save pages to Home Assistant turned on.";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

type Note = WatchPagesNote;

/** The restore question, and what the entry holds once it has been read. */
interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  /** The revision on screen when the question opened. The restore names it
   * as its base, so a save that lands while the question is open makes the
   * restore a conflict instead of being overwritten unseen. */
  baseRevision: number;
  summary?: string;
}

/** Text typed into a field and not committed yet. Home Assistant hands the
 * panel a new `hass` several times a second, and every draw would write the
 * stored value back over a half typed one; so while a field is being typed
 * in, it draws what was typed. */
interface Typing {
  /** Which field: its kind and the page or tile it belongs to. */
  key: string;
  value: string;
  commit: (text: string) => void;
}

/** The delete question for a page. What points at the page is worked out at
 * each draw from the draft, so a change merged in meanwhile is shown. */
interface DeleteAsk {
  pageId: string;
  /** The behavior document, once read, for the room quick jump lines. */
  behavior?: Record<string, unknown>;
  behaviorState: "loading" | "ready" | "none";
  removeLinks: boolean;
}

type HistoryState = "loading" | "ready" | "error" | "unsupported";

/** A press on a tile or a resize handle, from pointer down to up. It counts as
 * a drag once it has travelled `STAGE_DRAG_THRESHOLD`. */
interface GestureBase {
  pointerId: number;
  pageId: string;
  tileId: string;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  started: boolean;
  captured?: Element;
  /** The draft's `baseVersion` when the press began. A base that moves
   * under a gesture (a merge) makes its baseline wrong, so it is cancelled. */
  baseVersion: number;
}

interface MoveGesture extends GestureBase {
  kind: "move";
  /** Where on the tile it was grabbed, in pixels from its top left. */
  grab: { x: number; y: number };
  /** The tile's place when the press began. */
  rect: WatchRect;
  /** The dragged tile's top left on the screen now, in pixels. */
  left: number;
  top: number;
  cell?: WatchCell;
  pointerTileId?: string;
  outcome?: WatchDropOutcome;
}

interface ResizeGesture extends GestureBase {
  kind: "resize";
  handle: WatchResizeHandle;
  startRect: WatchRect;
  /** The page when the press began: what every preview starts from. */
  basePage: WatchPage;
  /** Where the press began, in pixels from the screen's top left. */
  startLocal: { x: number; y: number };
  /** The last rectangle the handle asked for that stays on the grid. */
  rect: WatchRect;
  preview?: WatchResizePreview;
}

type Gesture = MoveGesture | ResizeGesture;

/** A page row being dragged to another place in the list. */
interface RowDrag {
  pointerId: number;
  pageId: string;
  from: number;
  startX: number;
  startY: number;
  started: boolean;
  drop: number;
  /** Where the line is drawn, in pixels from the top of the list. */
  lineY: number;
  captured?: Element;
  baseVersion: number;
}

/** The part of `home-assistant-js-websocket`'s connection that tells of a
 * reconnect. Both optional: a test double or another frontend may lack them. */
interface HassConnectionEvents {
  addEventListener?(type: "ready", listener: () => void): void;
  removeEventListener?(type: "ready", listener: () => void): void;
}

function errText(err: unknown): string {
  return watchCommandError(err).message;
}

function errCode(err: unknown): string | undefined {
  return watchCommandError(err).code;
}

/** A refusal as `saveWatchPagesDraft` reads one: an error with a string
 * `code` at the top, whatever shape the socket rejected with. */
function flatError(err: unknown): Error {
  const { code, message } = watchCommandError(err);
  return Object.assign(new Error(message), code === undefined ? {} : { code });
}

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
}

/** Who made a save, in words: the panel writes `panel`, a device its id. */
function savedBy(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "Saved here" : "From the iPhone";
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function tileIdOf(tile: WatchPageTile): string {
  return typeof tile.id === "string" ? tile.id : "";
}

function sameRect(a: WatchRect, b: WatchRect): boolean {
  return a.col === b.col && a.row === b.row && a.colSpan === b.colSpan && a.rowSpan === b.rowSpan;
}

/** Fields where keys type text or step a number: the editor's own keys stay
 * out of them. */
function isTextField(node: EventTarget | undefined): boolean {
  if (node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) return true;
  if (node instanceof HTMLInputElement) return !["checkbox", "radio", "button", "submit", "reset"].includes(node.type);
  return node instanceof HTMLElement && node.isContentEditable;
}

/** Whether no element has focus: the active element, followed through shadow
 * roots, is the body or the document element. */
function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

const HANDLES: readonly WatchResizeHandle[] = ["left", "right", "top", "bottom", "bottomRight"];

/** The handles a selected tile of this size shows. A tile under two and a
 * half units across has no room for two side handles that do not cover its
 * content, so it keeps the right one (and the corner); the same for the top
 * on a short tile. Each axis keeps one handle and the corner does both. */
function shownHandles(box: { width: number; height: number }, grid: StageGrid, dragged?: WatchResizeHandle): WatchResizeHandle[] {
  const narrow = box.width < grid.unit * 2.5;
  const short = box.height < grid.unit * 2.5;
  // The handle being dragged stays, however small the tile gets: it holds
  // the pointer capture, and losing it would end the drag.
  return HANDLES.filter((h) => h === dragged || (!(h === "left" && narrow) && !(h === "top" && short)));
}

/** Where a tile is drawn on the edit grid: as stored, but one stored past
 * the last row is pulled up and cut to fit, as the phone's editor draws it
 * (`clampedRenderableItem`), so the stage never grows a million rows. */
function drawnRect(rect: WatchRect): WatchRect {
  if (rect.row + rect.rowSpan <= WATCH_EDITOR_MAX_ROWS) return rect;
  const rowSpan = Math.min(WATCH_EDITOR_MAX_ROWS, rect.rowSpan);
  return { ...rect, rowSpan, row: Math.max(0, Math.min(rect.row, WATCH_EDITOR_MAX_ROWS - rowSpan)) };
}

/** A field's text as a whole number for the tile card, NaN when it is not
 * one (an empty field, or text a number field could not read). */
function typedNumber(text: string): number {
  return text.trim() === "" ? Number.NaN : Number(text);
}

const PAGE_END_TEXT = `The page ends at row ${WATCH_EDITOR_MAX_ROWS}.`;
const SAVING_TEXT = "Saving. Tiles and pages move again once the save is done.";

/** How long the edge handles are: four tenths of the side, 8 to 20 pixels,
 * so even a one cell tile shows its handles apart from the corner. */
function handleSizes(box: { width: number; height: number }): string {
  const along = (side: number) => Math.round(Math.max(8, Math.min(20, side * 0.4)));
  return `--pe-hv:${along(box.height)}px;--pe-hh:${along(box.width)}px;`;
}

export class WaPageEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  /** The home's devices, as the panel holds them. */
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  /** The device the panel has selected. The view opens on it when it is a
   * watch, else on the first watch. */
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  /** The panel's symbol provider, shared so the symbol file is read once. */
  @property({ attribute: false }) icons?: IconProvider;
  /** Bumped by the panel each time `icons` has something new to draw: the
   * symbol file, or a glyph fetched on its own. The provider tells the
   * panel, not this element; a new number here is what draws again. */
  @property({ attribute: false }) iconsTick = 0;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  /** The panel's list arrives after the panel's first draw. Until it does,
   * the view asks for the devices itself, to tell "none yet" from "not
   * loaded yet". */
  @state() private ownList?: readonly OwnerSummary[];
  private ownListAsked = false;

  @state() private selectedPageId?: string;
  @state() private selectedTileId?: string;
  @state() private renaming?: { pageId: string; value: string };
  /** Not a reactive state: a keystroke needs no draw, the field shows it. */
  private typing?: Typing;
  @state() private menuPageId?: string;
  @state() private deleteAsk?: DeleteAsk;
  /** Draw the page as the watch does, headers pulling the rows up. Read
   * only. */
  @state() private asOnWatch = false;
  /** Why the last value typed in the tile card was refused. */
  @state() private fieldNote?: string;
  /** The Add tile dialog is open, over the selected page. */
  @state() private addTileOpen = false;

  /** The symbol grids' state (open, searched, recent) for the modules'
   * symbol fields. Not the panel's: its changes must draw this element. */
  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  /** The modules' view state (`WatchPagesEditorHost.uiState`). */
  private readonly uiState = new Map<string, unknown>();
  /** A drag on a number field running now: one undo step. */
  private readonly scrub = new ScrubRun();

  private gesture?: Gesture;
  private rowDrag?: RowDrag;
  /** A change from elsewhere arrived during a gesture or a save, and is
   * fetched once it ends. */
  private reloadPending = false;
  /** A restore landed for this watch as this revision: the record read that
   * brings it starts a new draft, with no undo step from before that could
   * take the restore back. Only that watch's read at that revision or later
   * acts on it; a failed read or a tab switch clears it. */
  private restartDraft?: { watchId: string; revision: number };
  /** The save whose end this element waits for (its own, or one an earlier
   * element for the same watch started). */
  private followedSave?: Promise<unknown>;
  /** Things to do once the next draw is on screen. */
  private focusRename = false;
  private focusPageRow?: string;
  private focusMenu = false;
  private focusHistory = false;
  private revealTile = false;
  /** The watch's screen in points, as last drawn, for the pointer arithmetic. */
  private stageScreen = REFERENCE_CASE.screen;
  private scrollFrame?: number;
  private windowArmed = false;
  private shownDialog?: HTMLDialogElement;

  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  /** The connection whose `ready` event this element listens to. */
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  /** The draft of the watch on screen, while there is a record to edit. */
  private get draft(): WatchPagesDraft | undefined {
    if (this.watchId === undefined || this.record === undefined || this.record.revision <= 0) return undefined;
    return keptWatchPagesDraft(this.watchId);
  }

  /** Editing is off while a page with headers is shown as on the watch. */
  private editingOff(page = this.currentPage()): boolean {
    return this.asOnWatch && page !== undefined && watchPageHasHeader(page);
  }

  /** Whether the watch on screen is being saved. The save belongs to the
   * kept draft, not to this element, so another watch's save never shows
   * here and an element made during a save still knows of it. */
  private get saving(): boolean {
    return this.watchId !== undefined && (keptWatchPagesDraft(this.watchId)?.saving ?? false);
  }

  private get busy(): boolean {
    return this.saving || this.gesture !== undefined || this.rowDrag !== undefined;
  }

  constructor() {
    super();
    // On the element itself: the field rows dispatch these from inside the
    // shadow root, bubbling and composed, and they go no further than here.
    this.addEventListener(SCRUB_START, this.onScrubStart);
    this.addEventListener(SCRUB_END, this.onScrubEnd);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.listenForReconnect();
    // Back in the tree after a visit elsewhere: the record may have moved.
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.cancelGestures();
    this.endScrub();
    this.endSubscription();
    this.stopPolling();
    this.loadSeq++;
    this.historySeq++;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (this.hass) {
      if (changed.has("hass")) this.listenForReconnect();
      if (this.owners.length === 0 && !this.ownListAsked) {
        this.ownListAsked = true;
        fetchOwners(this.hass).then(
          (reply) => { this.ownList = reply.owners; },
          () => { this.ownList = []; },
        );
      }
      const watches = this.watches;
      if (this.watchId === undefined || !watches.some((w) => w.owner_watch_id === this.watchId)) {
        const id = initialWatch(watches, this.ownerId);
        if (id !== undefined && id !== this.watchId) this.openWatch(id);
      }
    }
    this.followSave();
    this.reconcileSelection();
    this.closeStaleAsks();
  }

  /** Hear Home Assistant's connection come back. The live line subscribes
   * again by itself, but saves made while the socket was down sent no event
   * this element heard, so the record is read again, quietly, and merged. The
   * frontend keeps one connection object across reconnects; a new one (a new
   * `hass` from another frontend) moves the listener over. */
  private listenForReconnect(): void {
    const connection = this.hass?.connection as unknown as HassConnectionEvents | undefined;
    if (connection === this.readyConnection) return;
    this.stopListeningForReconnect();
    if (!this.isConnected || typeof connection?.addEventListener !== "function") return;
    connection.addEventListener("ready", this.onReconnect);
    this.readyConnection = connection;
  }

  private stopListeningForReconnect(): void {
    this.readyConnection?.removeEventListener?.("ready", this.onReconnect);
    this.readyConnection = undefined;
  }

  private onReconnect = (): void => {
    const watchId = this.watchId;
    if (!this.isConnected || watchId === undefined) return;
    void this.load(watchId, true);
  };

  /** Follow the save of the watch on screen to its end, whoever started it:
   * an element made while a save was out shows "Saving…" and must learn when
   * it ended. */
  private followSave(): void {
    const watchId = this.watchId;
    const done = watchId === undefined ? undefined : keptWatchPagesDraft(watchId)?.saveDone;
    if (watchId === undefined || done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(watchId);
    void done.then(ended, ended);
  }

  /** A save ended. Read the shown watch's record back (its delivery state,
   * the earlier saves, and whatever came in on the live line meanwhile); for
   * another watch, fetch what was held back while it was busy. */
  private saveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    if (watchId === this.watchId) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.flushPending();
    }
  }

  /** Close a question whose subject is gone: the page a delete asks about
   * was removed by a merge, an undo or a redo, or the save a restore asks
   * about is no longer kept. Closed properly, with focus taken back to the
   * list it was asked from, rather than the dialog vanishing from under the
   * focus while it is still modal. */
  private closeStaleAsks(): void {
    const deleteAsk = this.deleteAsk;
    if (deleteAsk !== undefined) {
      const document = this.draft?.document;
      if (document === undefined || findWatchPage(document, deleteAsk.pageId) === undefined) {
        this.closeAsk();
        if (this.selectedPageId !== undefined) this.focusPageRow = this.selectedPageId;
      }
    }
    if (this.addTileOpen) {
      // The page the dialog adds to went away, or turned into a smart page,
      // in a merge from the iPhone.
      const page = this.currentPage();
      if (page === undefined || isSmartWatchPage(page)) this.closeAsk();
    }
    const restoreAsk = this.restoreAsk;
    if (restoreAsk !== undefined && !this.restoring && this.historyState === "ready") {
      if (!this.history.some((e) => e.revision === restoreAsk.entry.revision)) {
        this.closeAsk();
        this.focusHistory = true;
      }
    }
  }

  protected override updated(): void {
    // A field removed while typed in (an undo took its tile away) never sent
    // a blur: what was typed there is dropped, not shown in another field.
    if (this.typing !== undefined && (this.renderRoot as ShadowRoot).activeElement === null) this.typing = undefined;
    // Open each question once, when it is first drawn. Opening any closed
    // one on every draw reopened a question that was just answered: the
    // draw after the answer came before the dialog's own close event.
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    if (this.focusRename) {
      this.focusRename = false;
      const input = this.renderRoot.querySelector<HTMLInputElement>("input.pe-rename");
      input?.focus();
      input?.select();
    }
    if (this.focusPageRow !== undefined) {
      const id = this.focusPageRow;
      this.focusPageRow = undefined;
      this.pageButton(id)?.focus();
    }
    if (this.focusMenu) {
      this.focusMenu = false;
      this.renderRoot.querySelector<HTMLElement>(".pe-menu button:not(:disabled)")?.focus();
    }
    if (this.focusHistory) {
      this.focusHistory = false;
      this.renderRoot.querySelector<HTMLElement>(".pe-past")?.focus();
    }
    if (this.revealTile) {
      this.revealTile = false;
      const tile = this.selectedTileId === undefined ? undefined : this.tileButton(this.selectedTileId);
      tile?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  // ── selection ──────────────────────────────────────────────────────────

  /** Keep the selection on things that still exist: the selected page, else
   * the first listed page; the selected tile when it is still on that page.
   * Runs before every draw, so an undo, a redo or a merge needs nothing of
   * its own. */
  private reconcileSelection(): void {
    const document = this.draft?.document;
    if (document === undefined || this.watchId === undefined) return;
    let page = this.selectedPageId === undefined ? undefined : findWatchPage(document, this.selectedPageId);
    if (page === undefined) {
      page = listedWatchPages(document)[0];
      this.selectedPageId = page === undefined ? undefined : watchPageId(page);
      this.selectedTileId = undefined;
    }
    if (this.selectedTileId !== undefined && (page === undefined || this.tileOn(page, this.selectedTileId) === undefined)) {
      this.selectedTileId = undefined;
    }
    keepWatchPagesSelection(this.watchId, { pageId: this.selectedPageId, tileId: this.selectedTileId });
  }

  private currentPage(): WatchPage | undefined {
    const document = this.draft?.document;
    return document === undefined || this.selectedPageId === undefined ? undefined : findWatchPage(document, this.selectedPageId);
  }

  private tileOn(page: WatchPage, tileId: string): WatchPageTile | undefined {
    return watchPageTiles(page).find((t) => sameWatchId(t.id, tileId));
  }

  private selectPage(pageId: string): void {
    if (sameWatchId(pageId, this.selectedPageId)) return;
    this.selectedPageId = pageId;
    this.selectedTileId = undefined;
    this.fieldNote = undefined;
  }

  private selectTile(tileId: string | undefined): void {
    if (tileId === this.selectedTileId) return;
    this.selectedTileId = tileId;
    this.fieldNote = undefined;
  }

  private pageButton(pageId: string): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`.pe-page-row[data-page="${CSS.escape(pageId)}"] .pe-page`);
  }

  private tileButton(tileId: string): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`.pe-tile[data-tile="${CSS.escape(tileId)}"]`);
  }

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.reloadPending = false;
      this.restartDraft = undefined;
      this.typing = undefined;
      this.cancelGestures();
      this.watchId = watchId;
      this.note = undefined;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      const selection = keptWatchPagesSelection(watchId);
      this.selectedPageId = selection.pageId;
      this.selectedTileId = selection.tileId;
      this.renaming = undefined;
      this.menuPageId = undefined;
      this.closeAsk();
      this.fieldNote = undefined;
      this.endScrub();
      // The modules' view state was about the other watch's tiles.
      this.uiState.clear();
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
  }

  /** Read the record. A quiet load keeps what is on screen until the answer
   * is in, which is how a change from elsewhere arrives. A quiet load during
   * a gesture or a save waits for it to end, so the document never moves
   * under the pointer or under a save. */
  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.busy) {
      this.reloadPending = true;
      return;
    }
    const seq = ++this.loadSeq;
    this.stopPolling();
    if (!quiet) {
      this.record = undefined;
      this.loading = true;
      this.loadError = undefined;
    }
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (seq !== this.loadSeq) return;
      if (quiet && this.busy) {
        this.reloadPending = true;
        return;
      }
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (!quiet) this.loadError = errText(err);
      // The read that was to bring a restore failed. A later read could find
      // edits made since, which the restart would throw away unasked; the
      // ordinary merge takes the restore in instead.
      if (this.restartDraft?.watchId === watchId) this.restartDraft = undefined;
    }
    this.loading = false;
    this.pollIfWaiting();
    void this.loadHistory(watchId);
  }

  /** A gesture or a save ended: fetch what arrived meanwhile. */
  private flushPending(): void {
    if (!this.reloadPending || this.busy || this.watchId === undefined) return;
    this.reloadPending = false;
    void this.load(this.watchId, true);
  }

  /** Put a record on screen, merging it into the kept draft. */
  private show(record: WatchConfigRecord): void {
    const watchId = this.watchId;
    this.record = record;
    const document = record.revision > 0 ? asWatchPagesDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      // Never a draft with edits: those are merged like any other change.
      if (!(keptWatchPagesDraft(watchId)?.dirty ?? false)) forgetWatchPagesDraft(watchId);
    }
    const taken = takeWatchPagesRecord(watchId, document, record.revision);
    if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The pages changed on the iPhone. Your edits are kept." };
    this.requestUpdate();
  }

  /** Read the earlier saves. Only the newest call's answer is shown, as for
   * `load`: an older one can arrive last. */
  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "pages");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      // An integration from before the history commands: say nothing about
      // history at all rather than show a list that can never fill.
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config. A new `pages` revision reloads
   * quietly and is merged into the draft; the phone's own uploads arrive
   * this way too. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq || event.kind !== "pages") return;
      if (event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => {
        // No live line (an older integration, or the store is not ready):
        // the delivery check and reopening still bring changes in.
      },
    );
  }

  private endSubscription(): void {
    this.subscribeSeq++;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
  }

  /** While a save waits for the phone, ask the store again now and then. */
  private pollIfWaiting(): void {
    this.stopPolling();
    if (!this.isConnected || deliveryState(this.record) !== "waiting") return;
    this.pollTimer = window.setTimeout(() => void this.poll(), DELIVERY_POLL_MS);
  }

  private async poll(): Promise<void> {
    this.pollTimer = undefined;
    const hass = this.hass;
    const watchId = this.watchId;
    const shown = this.record;
    if (!hass || watchId === undefined || shown === undefined) return;
    if (this.busy) {
      this.pollIfWaiting();
      return;
    }
    try {
      const fresh = await fetchWatchConfig(hass, watchId, "pages");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
        };
      } else if (this.busy) {
        this.reloadPending = true;
      } else {
        this.show(fresh);
        void this.loadHistory(watchId);
      }
    } catch {
      // A missed check is not news: the next one will tell.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── editing ────────────────────────────────────────────────────────────

  /** Every edit goes through here: one undo step, or a step of a coalesced
   * run. */
  private edit(next: WatchPagesDocument, options?: WatchPagesApplyOptions): boolean {
    const draft = this.draft;
    if (!draft) return false;
    const changed = draft.apply(next, options);
    if (changed) {
      this.fieldNote = undefined;
      this.requestUpdate();
    }
    return changed;
  }

  /** A drag on a number field's title or box began, in a module's field
   * row. Stopped here, so the panel never opens a gesture on the
   * complication draft under this editor. */
  private onScrubStart = (e: Event): void => {
    e.stopPropagation();
    this.draft?.endCoalesce();
    this.scrub.start();
  };

  private onScrubEnd = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
  };

  private endScrub(): void {
    if (this.scrub.end()) this.draft?.endCoalesce();
  }

  /** What the two 3c modules are handed on each draw, for the selected page
   * (`editor-host.ts`). Undefined while there is nothing to edit. */
  private editorHost(page: WatchPage | undefined): WatchPagesEditorHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined || page === undefined) return undefined;
    const pageId = watchPageId(page);
    const document = draft.document;
    const busy = this.busy || this.editingOff(page);
    return {
      hass,
      icons: this.icons ?? NO_ICONS,
      symbols: this.symbols,
      document,
      pageId,
      page,
      otherPages: listedWatchPages(document).filter((p) => !sameWatchId(p.id, pageId)),
      busy,
      uiState: this.uiState,
      // A refused edit (`busy`) changes nothing, as a drag during a save
      // does: a save that merges must not find the document moved under it.
      apply: (next, options) => !busy && !this.busy && this.edit(next, this.scrub.options(options)),
      endCoalesce: () => this.draft?.endCoalesce(),
      selectTile: (id) => {
        this.selectTile(id);
        if (id !== undefined) this.revealTile = true;
      },
      requestUpdate: () => this.requestUpdate(),
    };
  }

  private openAddTile(): void {
    if (this.busy || this.editingOff()) return;
    this.menuPageId = undefined;
    this.addTileOpen = true;
  }

  private undo(): void {
    if (this.draft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.draft?.redo()) this.requestUpdate();
  }

  private discard(): void {
    if (this.saving) return;
    this.renaming = undefined;
    if (this.draft?.discard()) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  private async save(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    // A name or number still being typed is part of what gets saved.
    if (this.renaming) this.commitRename();
    this.commitTyping();
    const draft = this.draft;
    if (!hass || watchId === undefined || !draft || !draft.dirty || draft.saving || this.gesture || this.rowDrag) return;
    this.note = undefined;
    const running = saveWatchPagesDraft(draft, {
      save: (base, document) => saveWatchConfig(hass, watchId, "pages", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "pages").catch((err: unknown) => {
          throw flatError(err);
        });
        return { revision: record.revision, document: record.document };
      },
    });
    // This element follows its own save as it would another's; the reload
    // after it happens there (`saveEnded`).
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    if (watchId === this.watchId) this.note = watchPagesSaveNote(result);
    this.saveEnded(watchId);
  }

  // ── pages ──────────────────────────────────────────────────────────────

  private addPage(): void {
    const document = this.draft?.document;
    if (document === undefined) return;
    const next = addWatchPage(document);
    if (!this.edit(next)) return;
    const listed = listedWatchPages(next);
    const page = listed[listed.length - 1];
    if (page === undefined) return;
    const id = watchPageId(page);
    this.selectPage(id);
    this.startRename(id);
  }

  private startRename(pageId: string): void {
    const page = this.draft === undefined ? undefined : findWatchPage(this.draft.document, pageId);
    if (page === undefined) return;
    this.menuPageId = undefined;
    this.renaming = { pageId, value: typeof page.name === "string" ? page.name : "" };
    this.focusRename = true;
  }

  private commitRename(): void {
    const renaming = this.renaming;
    if (!renaming) return;
    this.renaming = undefined;
    const document = this.draft?.document;
    if (document !== undefined) this.edit(setWatchPageName(document, renaming.pageId, renaming.value));
  }

  private cancelRename(): void {
    const renaming = this.renaming;
    this.renaming = undefined;
    if (renaming) this.focusPageRow = renaming.pageId;
  }

  private movePage(pageId: string, toIndex: number, focus = false): void {
    const document = this.draft?.document;
    if (document === undefined) return;
    this.menuPageId = undefined;
    if (this.edit(moveWatchPage(document, pageId, toIndex)) && focus) this.focusPageRow = pageId;
  }

  private setHidden(pageId: string, hidden: boolean): void {
    const document = this.draft?.document;
    if (document !== undefined) this.edit(setWatchPageHidden(document, pageId, hidden));
  }

  private askDelete(pageId: string): void {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined) return;
    this.menuPageId = undefined;
    const ask: DeleteAsk = { pageId, behaviorState: "loading", removeLinks: true };
    this.deleteAsk = ask;
    fetchWatchConfig(hass, watchId, "behavior").then(
      (record) => {
        if (this.deleteAsk !== ask) return;
        const behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
        this.deleteAsk = { ...ask, behavior, behaviorState: behavior === undefined ? "none" : "ready" };
      },
      () => {
        // Not knowing the room settings only means no room lines.
        if (this.deleteAsk === ask) this.deleteAsk = { ...ask, behaviorState: "none" };
      },
    );
  }

  /** Close the open question. Its state goes at once, not on the dialog's
   * close event, which comes a task later. */
  private closeAsk(): void {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
    this.deleteAsk = undefined;
    this.addTileOpen = false;
  }

  private deletePage(): void {
    const ask = this.deleteAsk;
    const document = this.draft?.document;
    if (!ask || document === undefined) return;
    const links = watchPageLinks(document, ask.pageId);
    const listed = listedWatchPages(document);
    const index = listed.findIndex((p) => sameWatchId(p.id, ask.pageId));
    const next = deleteWatchPage(document, ask.pageId, { removeLinks: ask.removeLinks && links.tiles.length > 0 });
    this.closeAsk();
    if (!this.edit(next)) return;
    // The neighbour takes the selection: the page that moved up into the
    // place, else the one before.
    const after = listedWatchPages(next);
    const neighbour = after[Math.min(Math.max(0, index), after.length - 1)];
    this.selectedPageId = neighbour === undefined ? undefined : watchPageId(neighbour);
    this.selectedTileId = undefined;
    if (this.selectedPageId !== undefined) this.focusPageRow = this.selectedPageId;
  }

  // ── tiles ──────────────────────────────────────────────────────────────

  private nudge(direction: WatchNudgeDirection): void {
    const document = this.draft?.document;
    const pageId = this.selectedPageId;
    const tileId = this.selectedTileId;
    if (document === undefined || pageId === undefined || tileId === undefined) return;
    if (this.edit(nudgeWatchTile(document, pageId, tileId, direction))) this.revealTile = true;
  }

  private deleteTile(): void {
    const document = this.draft?.document;
    const pageId = this.selectedPageId;
    const tileId = this.selectedTileId;
    if (document === undefined || pageId === undefined || tileId === undefined) return;
    const hadFocus = this.tileButton(tileId)?.matches(":focus") ?? false;
    if (this.edit(deleteWatchTile(document, pageId, tileId)) && hadFocus) {
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".pe-screen")?.focus());
    }
  }

  // ── fields being typed in ──────────────────────────────────────────────

  /** What a field shows: the text being typed in it, else the stored value. */
  private fieldValue(key: string, stored: string): string {
    return this.typing?.key === key ? this.typing.value : stored;
  }

  private onFieldInput(e: Event, key: string, commit: (text: string) => void): void {
    this.typing = { key, value: (e.target as HTMLInputElement).value, commit };
  }

  /** Commit the field being typed in, if any: on change, Enter, blur, a save
   * and Cmd or Ctrl+S. */
  private commitTyping(key?: string): void {
    const typing = this.typing;
    if (typing === undefined || (key !== undefined && typing.key !== key)) return;
    this.typing = undefined;
    typing.commit(typing.value);
    this.requestUpdate();
  }

  /** Enter commits, Escape puts the stored value back. */
  private onFieldKeyDown(e: KeyboardEvent, key: string, stored: string): void {
    if (e.key === "Enter") {
      e.preventDefault();
      this.commitTyping(key);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (this.typing?.key === key) this.typing = undefined;
      (e.target as HTMLInputElement).value = stored;
      this.requestUpdate();
    }
  }

  /** Refuse a typed value: it snaps back on the next draw (the fields are
   * bound with `live`), with the reason under the fields. */
  private refuse(reason: string): void {
    this.fieldNote = reason;
    this.requestUpdate();
  }

  /** Column or Row typed in the tile card, 1-based. A drop there, without the
   * swap a drag can make: a typed place that another tile holds is refused. */
  private placeTile(col: number, row: number): void {
    const document = this.draft?.document;
    const page = this.currentPage();
    const tileId = this.selectedTileId;
    if (document === undefined || page === undefined || tileId === undefined) return;
    const tile = this.tileOn(page, tileId);
    if (tile === undefined) return;
    const rect = watchTileRect(tile);
    if (!Number.isInteger(col) || !Number.isInteger(row)) return this.refuse("Use a whole number.");
    const lastCol = 12 - rect.colSpan + 1;
    if (col < 1 || col > lastCol) {
      return this.refuse(lastCol === 1 ? "A tile this wide starts in column 1." : `A tile this wide starts in a column from 1 to ${lastCol}.`);
    }
    if (row < 1) return this.refuse("Rows start at 1.");
    if (row - 1 + rect.rowSpan > WATCH_EDITOR_MAX_ROWS) {
      const last = WATCH_EDITOR_MAX_ROWS - rect.rowSpan + 1;
      return this.refuse(last >= 1 ? `${PAGE_END_TEXT} A tile this high starts in a row from 1 to ${last}.` : `${PAGE_END_TEXT} Make the tile lower first.`);
    }
    const cell = { col: col - 1, row: row - 1 };
    const outcome = watchDropOutcome(page, tileId, cell);
    if (outcome.kind === "same") return this.requestUpdate();
    if (outcome.kind !== "move") return this.refuse("Another tile is in the way there.");
    this.edit(dropWatchTile(document, watchPageId(page), tileId, cell));
    this.revealTile = true;
  }

  /** Width or Height typed in the tile card, or a size preset: a resize from
   * the tile's own corner, pushing the tiles below down. */
  private sizeTile(colSpan: number, rowSpan: number): void {
    const document = this.draft?.document;
    const page = this.currentPage();
    const tileId = this.selectedTileId;
    if (document === undefined || page === undefined || tileId === undefined) return;
    const tile = this.tileOn(page, tileId);
    if (tile === undefined) return;
    if (!Number.isInteger(colSpan) || !Number.isInteger(rowSpan)) return this.refuse("Use a whole number.");
    if (colSpan < 1 || colSpan > 12) return this.refuse("A tile is 1 to 12 columns wide.");
    if (rowSpan < 1) return this.refuse("A tile is at least 1 row high.");
    const rect = { ...watchTileRect(tile), colSpan, rowSpan };
    if (rect.row + rowSpan > WATCH_EDITOR_MAX_ROWS) {
      const most = WATCH_EDITOR_MAX_ROWS - rect.row;
      return this.refuse(most >= 1 ? `${PAGE_END_TEXT} From this row a tile is at most ${plural(most, "row", "rows")} high.` : `${PAGE_END_TEXT} Move the tile up first.`);
    }
    const preview = previewWatchTileResize(page, tileId, rect, page);
    if (preview.refused === "end") return this.refuse(`${PAGE_END_TEXT} That size would push a tile below it past the end.`);
    if (preview.overlaps) return this.refuse("That size would cover a tile above or beside it.");
    this.edit(resizeWatchTile(document, watchPageId(page), tileId, rect, { baseline: page }));
  }

  // ── keyboard ───────────────────────────────────────────────────────────

  /** The editor's keys work while focus is inside it, and while nothing has
   * focus (a click on an empty part of the page leaves it on the body), so a
   * click beside the editor does not switch Save off. The keys that act on
   * the selected tile (arrows, Delete, Backspace, Escape) work only from the
   * stage itself (a tile, a handle, the screen) or with nothing focused: on a
   * watch tab, a toolbar button, a page row or a link they keep their own
   * meaning. */
  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.defaultPrevented) return;
    const path = e.composedPath();
    if (!path.includes(this) && !nothingFocused()) return;
    if (this.renderRoot.querySelector("dialog[open]")) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey && key === "s") {
      // Never the browser's own save dialog, even when there is nothing to
      // save, and from a field too: the field is committed first (`save`).
      e.preventDefault();
      void this.save();
      return;
    }
    if (e.key === "Escape" && (this.gesture || this.rowDrag)) {
      e.preventDefault();
      this.cancelGestures();
      return;
    }
    if (e.key === "Escape" && this.menuPageId !== undefined) {
      e.preventDefault();
      const id = this.menuPageId;
      this.menuPageId = undefined;
      void this.updateComplete.then(() => {
        this.renderRoot.querySelector<HTMLElement>(`.pe-page-row[data-page="${CSS.escape(id)}"] .pe-more`)?.focus();
      });
      return;
    }
    if (isTextField(path[0])) return;
    const dragging = this.gesture !== undefined || this.rowDrag !== undefined;
    if (mod && !e.altKey && key === "z") {
      e.preventDefault();
      if (dragging) return;
      if (e.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && key === "y") {
      e.preventDefault();
      if (!dragging) this.redo();
      return;
    }
    if (mod || e.altKey || dragging) return;
    const onStage = path.some((n) => n instanceof HTMLElement && n.classList.contains("pe-screen"));
    if (!onStage && !nothingFocused()) return;
    if (this.selectedTileId === undefined || this.editingOff()) return;
    const arrows: Record<string, WatchNudgeDirection> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const direction = arrows[e.key];
    if (direction !== undefined) {
      // Even when the step is refused: the arrow is the editor's here, and
      // the page under it must not scroll instead.
      e.preventDefault();
      this.nudge(direction);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      this.deleteTile();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.selectTile(undefined);
    }
  };

  private onRowKeyDown(e: KeyboardEvent, pageId: string, index: number, count: number): void {
    if (!e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      this.movePage(pageId, index - 1, true);
    } else if (e.key === "ArrowDown" && index < count - 1) {
      e.preventDefault();
      this.movePage(pageId, index + 1, true);
    }
  }

  /** A press anywhere outside the open page menu closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (this.menuPageId === undefined) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && (n.classList.contains("pe-menu") || n.classList.contains("pe-more")));
    if (!inside) this.menuPageId = undefined;
  };

  // ── pointer gestures ───────────────────────────────────────────────────

  private screenEl(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".pe-screen");
  }

  /** The grid as drawn now, measured, so a zoom or a scale change is still
   * read right. */
  private measuredGrid(screen: HTMLElement): { grid: StageGrid; rect: DOMRect } | undefined {
    const rect = screen.getBoundingClientRect();
    const page = this.currentPage();
    if (rect.width <= 0 || page === undefined) return undefined;
    const scale = rect.width / this.stageScreen.width;
    const topInset = page.fullScreen === true ? 0 : WATCH_GRID_TOP_INSET;
    return { grid: stageGrid(this.stageScreen.width, topInset, scale), rect };
  }

  private armWindow(): void {
    if (this.windowArmed) return;
    this.windowArmed = true;
    window.addEventListener("pointermove", this.onPointerMove, { passive: false });
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerCancel);
  }

  private disarmWindow(): void {
    if (!this.windowArmed || this.gesture || this.rowDrag) return;
    this.windowArmed = false;
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerCancel);
  }

  private capture(target: EventTarget | null, pointerId: number): Element | undefined {
    if (!(target instanceof Element)) return undefined;
    try {
      target.setPointerCapture(pointerId);
      target.addEventListener("lostpointercapture", this.onLostCapture);
      return target;
    } catch {
      return undefined;
    }
  }

  private release(element: Element | undefined, pointerId: number): void {
    // Off first: letting go here is no loss of the pointer.
    element?.removeEventListener("lostpointercapture", this.onLostCapture);
    try {
      if (element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
    } catch {
      // Already gone from the tree.
    }
  }

  /** A press on a tile. A mouse or a pen selects it and may drag it at once.
   * A finger drags only the selected tile (the only one with `touch-action:
   * none`); on any other tile it scrolls the page, and a tap selects. */
  private onTilePointerDown(e: PointerEvent, tileId: string): void {
    if (e.button !== 0 || !e.isPrimary || this.gesture || this.editingOff()) return;
    // No drag while a save is out: a conflict merges under the save, and a
    // drag that ended on the old base would put the merged tiles back.
    if (this.saving) return;
    const draft = this.draft;
    if (draft === undefined) return;
    const selected = sameWatchId(tileId, this.selectedTileId);
    if (e.pointerType === "touch" && !selected) return;
    const page = this.currentPage();
    const tile = page === undefined ? undefined : this.tileOn(page, tileId);
    const button = e.currentTarget as HTMLElement;
    if (page === undefined || tile === undefined) return;
    if (!selected) this.selectTile(tileId);
    const box = button.getBoundingClientRect();
    const screen = this.screenEl()?.getBoundingClientRect();
    this.gesture = {
      kind: "move",
      pointerId: e.pointerId,
      pageId: watchPageId(page),
      tileId,
      startX: e.clientX,
      startY: e.clientY,
      clientX: e.clientX,
      clientY: e.clientY,
      started: false,
      grab: { x: e.clientX - box.left, y: e.clientY - box.top },
      rect: watchTileRect(tile),
      left: screen ? box.left - screen.left : 0,
      top: screen ? box.top - screen.top : 0,
      captured: this.capture(button, e.pointerId),
      baseVersion: draft.baseVersion,
    };
    this.armWindow();
  }

  private onHandlePointerDown(e: PointerEvent, handle: WatchResizeHandle): void {
    e.stopPropagation();
    if (e.button !== 0 || !e.isPrimary || this.gesture || this.editingOff()) return;
    e.preventDefault();
    const draft = this.draft;
    if (this.saving || draft === undefined) return;
    const page = this.currentPage();
    const tileId = this.selectedTileId;
    const tile = page === undefined || tileId === undefined ? undefined : this.tileOn(page, tileId);
    const screen = this.screenEl();
    if (page === undefined || tileId === undefined || tile === undefined || !screen) return;
    const rect = screen.getBoundingClientRect();
    const startRect = watchTileRect(tile);
    this.gesture = {
      kind: "resize",
      pointerId: e.pointerId,
      pageId: watchPageId(page),
      tileId,
      startX: e.clientX,
      startY: e.clientY,
      clientX: e.clientX,
      clientY: e.clientY,
      started: false,
      handle,
      startRect,
      basePage: page,
      startLocal: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      rect: startRect,
      captured: this.capture(e.currentTarget, e.pointerId),
      baseVersion: draft.baseVersion,
    };
    this.armWindow();
  }

  private onRowPointerDown(e: PointerEvent, pageId: string, index: number, grip: boolean): void {
    if (e.button !== 0 || !e.isPrimary || this.rowDrag || this.gesture) return;
    // A finger drags a row by its grip only, so the list still scrolls.
    if (!grip && e.pointerType === "touch") return;
    if (grip) e.preventDefault();
    const draft = this.draft;
    if (this.saving || draft === undefined) return;
    this.rowDrag = {
      pointerId: e.pointerId,
      pageId,
      from: index,
      startX: e.clientX,
      startY: e.clientY,
      started: false,
      drop: index,
      lineY: 0,
      captured: this.capture(e.currentTarget, e.pointerId),
      baseVersion: draft.baseVersion,
    };
    this.armWindow();
  }

  /** The browser took the pointer away without a pointer up (a system
   * gesture, a scroll it took over, the window losing it): the gesture ends
   * where it is and changes nothing, as on Escape. */
  private onLostCapture = (e: Event): void => {
    const pointerId = (e as PointerEvent).pointerId;
    if (this.gesture?.pointerId === pointerId) this.endGesture();
    if (this.rowDrag?.pointerId === pointerId) this.endRowDrag();
    this.flushPending();
  };

  /** Whether the draft's base moved since a gesture began. Saves are held
   * off during gestures and reloads wait for their end, so this is the last
   * guard: such a gesture is cancelled, never committed on the old base. */
  private baseMoved(baseVersion: number): boolean {
    const draft = this.draft;
    if (draft !== undefined && draft.baseVersion === baseVersion) return false;
    this.cancelGestures();
    this.note = { kind: "warn", text: "The pages changed while you were dragging, so the drag was stopped. Try it again." };
    return true;
  }

  private onPointerMove = (e: PointerEvent): void => {
    const g = this.gesture;
    if (g && e.pointerId === g.pointerId) {
      if (this.baseMoved(g.baseVersion)) return;
      g.clientX = e.clientX;
      g.clientY = e.clientY;
      if (!g.started) {
        if (!pastDragThreshold(e.clientX - g.startX, e.clientY - g.startY)) return;
        g.started = true;
        this.menuPageId = undefined;
        this.startAutoScroll();
      }
      e.preventDefault();
      this.trackGesture();
      return;
    }
    const r = this.rowDrag;
    if (r && e.pointerId === r.pointerId) {
      if (this.baseMoved(r.baseVersion)) return;
      if (!r.started) {
        if (!pastDragThreshold(e.clientX - r.startX, e.clientY - r.startY)) return;
        r.started = true;
        this.menuPageId = undefined;
      }
      e.preventDefault();
      this.trackRowDrag(e.clientY);
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    const g = this.gesture;
    if (g && e.pointerId === g.pointerId) {
      if (this.baseMoved(g.baseVersion)) return;
      this.endGesture();
      if (g.started) this.finishGesture(g);
      this.flushPending();
      return;
    }
    const r = this.rowDrag;
    if (r && e.pointerId === r.pointerId) {
      if (this.baseMoved(r.baseVersion)) return;
      this.endRowDrag();
      if (r.started) this.movePage(r.pageId, listMoveIndex(r.from, r.drop));
      this.flushPending();
    }
  };

  /** The browser cancelled the pointer (a touch turned into a scroll, a
   * palm, the page hidden): as a lost capture, the gesture ends unmade. */
  private onPointerCancel = (e: PointerEvent): void => {
    this.onLostCapture(e);
  };

  /** Follow the pointer: where the dragged tile is, what dropping it would
   * do; or the rectangle a handle asks for and the page it would leave. */
  private trackGesture(): void {
    const g = this.gesture;
    const screen = this.screenEl();
    const page = this.currentPage();
    const measured = screen ? this.measuredGrid(screen) : undefined;
    if (!g || !measured || page === undefined) return;
    const { grid, rect } = measured;
    const local = { x: g.clientX - rect.left, y: g.clientY - rect.top };
    if (g.kind === "move") {
      const corner = draggedCorner(local, g.grab);
      const size = cellRectPx(grid, g.rect);
      // The picture stays over the screen sideways, so the card never grows
      // a scroll bar under the drag; the cell is clamped the same way.
      g.left = Math.max(0, Math.min(rect.width - size.width, corner.left));
      g.top = Math.max(0, corner.top);
      const cell = nearestCell(grid, g.left, g.top, g.rect.colSpan);
      // No deeper than the phone's editor draws, however long the auto
      // scroll runs.
      g.cell = { ...cell, row: Math.min(cell.row, Math.max(0, WATCH_EDITOR_MAX_ROWS - g.rect.rowSpan)) };
      const under = watchTileAtCell(page, cellAtPx(grid, local.x, local.y));
      const underId = under === undefined ? "" : tileIdOf(under);
      g.pointerTileId = underId !== "" && !sameWatchId(underId, g.tileId) ? underId : undefined;
      g.outcome = watchDropOutcome(page, g.tileId, g.cell, g.pointerTileId);
    } else {
      const delta = cellDelta(grid, local.x - g.startLocal.x, local.y - g.startLocal.y);
      const asked = watchResizeHandleRect(g.startRect, g.handle, delta) ?? g.rect;
      if (g.preview === undefined || !sameRect(asked, g.rect)) {
        g.rect = asked;
        g.preview = previewWatchTileResize(g.basePage, g.tileId, asked, g.basePage);
      }
    }
    this.requestUpdate();
  }

  private finishGesture(g: Gesture): void {
    const document = this.draft?.document;
    if (document === undefined) return;
    if (g.kind === "move") {
      if (g.cell === undefined || g.outcome === undefined) return;
      if (g.outcome.kind === "move" || g.outcome.kind === "swap") {
        this.edit(dropWatchTile(document, g.pageId, g.tileId, g.cell, g.pointerTileId));
      } else if (g.outcome.kind === "none" && g.cell.row + g.rect.rowSpan > WATCH_EDITOR_MAX_ROWS) {
        this.refuse(`${PAGE_END_TEXT} A tile this high cannot go that far down.`);
      }
      return;
    }
    const preview = g.preview;
    if (preview === undefined || sameRect(g.rect, g.startRect)) return;
    if (preview.refused === "end") {
      this.refuse(`${PAGE_END_TEXT} That size would push a tile below it past the end, so the tile kept its size.`);
      return;
    }
    if (preview.overlaps) {
      this.refuse("That size would cover a tile above or beside it, so the tile kept its size.");
      return;
    }
    this.edit(resizeWatchTile(document, g.pageId, g.tileId, g.rect, { baseline: g.basePage }));
  }

  private endGesture(): void {
    const g = this.gesture;
    if (!g) return;
    this.gesture = undefined;
    this.release(g.captured, g.pointerId);
    this.stopAutoScroll();
    this.disarmWindow();
    this.requestUpdate();
  }

  private trackRowDrag(clientY: number): void {
    const r = this.rowDrag;
    const list = this.renderRoot.querySelector<HTMLElement>(".pe-page-list");
    if (!r || !list) return;
    const rows = [...list.querySelectorAll<HTMLElement>(".pe-page-row")].map((row) => row.getBoundingClientRect());
    const top = list.getBoundingClientRect().top;
    r.drop = listDropIndex(rows.map((b) => b.top + b.height / 2), clientY);
    const edge = r.drop < rows.length ? rows[r.drop]!.top - 2 : (rows[rows.length - 1]?.bottom ?? top) + 1;
    r.lineY = edge - top;
    this.requestUpdate();
  }

  private endRowDrag(): void {
    const r = this.rowDrag;
    if (!r) return;
    this.rowDrag = undefined;
    this.release(r.captured, r.pointerId);
    this.disarmWindow();
    this.requestUpdate();
  }

  /** Escape, a watch switch, or the element leaving the tree: every gesture
   * stops where it is and changes nothing. */
  private cancelGestures(): void {
    this.endGesture();
    this.endRowDrag();
    this.stopAutoScroll();
    this.flushPending();
  }

  /** The box that scrolls the stage: the element itself (`:host` scrolls),
   * else the nearest scrolling ancestor across shadow roots, else the
   * document. The walk starts at the host: inside, the stage's own box
   * scrolls sideways only, though the browser reports it as scrolling down
   * too while a dragged tile hangs below it. */
  private scroller(): HTMLElement | undefined {
    let node: Node | null = this;
    while (node) {
      if (node instanceof HTMLElement) {
        const overflow = getComputedStyle(node).overflowY;
        if ((overflow === "auto" || overflow === "scroll") && node.scrollHeight > node.clientHeight) return node;
      }
      node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
    }
    const root = document.scrollingElement;
    return root instanceof HTMLElement ? root : undefined;
  }

  /** While a tile is dragged, scroll when the pointer is near the top or the
   * bottom of the scrolling box, and follow the pointer as the page moves. */
  private startAutoScroll(): void {
    if (this.scrollFrame !== undefined) return;
    const tick = (): void => {
      const g = this.gesture;
      if (!g?.started) {
        this.scrollFrame = undefined;
        return;
      }
      this.scrollFrame = window.requestAnimationFrame(tick);
      const box = this.scroller();
      if (!box) return;
      const whole = box === document.scrollingElement;
      const rect = whole ? { top: 0, bottom: window.innerHeight } : box.getBoundingClientRect();
      const step = autoScrollStep(g.clientY, Math.max(0, rect.top), Math.min(window.innerHeight, rect.bottom));
      if (step === 0) return;
      const before = box.scrollTop;
      box.scrollTop += step;
      if (box.scrollTop !== before) this.trackGesture();
    };
    this.scrollFrame = window.requestAnimationFrame(tick);
  }

  private stopAutoScroll(): void {
    if (this.scrollFrame !== undefined) window.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = undefined;
  }

  // ── restoring an earlier save ──────────────────────────────────────────

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const hass = this.hass;
    const watchId = this.watchId;
    const record = this.record;
    if (!hass || watchId === undefined || record === undefined || this.draft?.dirty) return;
    const ask: RestoreAsk = { entry, baseRevision: record.revision };
    this.restoreAsk = ask;
    fetchWatchConfigHistoryEntry(hass, watchId, "pages", entry.revision).then(
      (reply) => {
        if (this.restoreAsk !== ask) return;
        const pages = listedWatchPages(asWatchPagesDocument(reply.document) ?? {});
        const tiles = pages.reduce((n, p) => n + watchPageTiles(p).length, 0);
        this.restoreAsk = {
          ...ask,
          summary: `${plural(pages.length, "page", "pages")}, ${plural(tiles, "tile", "tiles")}: ${pages.map(watchPageName).join(", ")}`,
        };
      },
      () => undefined,
    );
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    let note: Note;
    try {
      // The base is the revision shown when the question opened, not the
      // one shown now: a save that arrived meanwhile makes this a conflict.
      const reply = await restoreWatchConfig(hass, watchId, "pages", ask.entry.revision, ask.baseRevision);
      note = {
        kind: "ok",
        text: `Revision ${ask.entry.revision} is back, saved as revision ${reply.revision}. The iPhone picks it up the next time it checks.`,
      };
      if (watchId === this.watchId) {
        this.restartDraft = { watchId, revision: reply.revision };
      } else {
        // Another watch is shown now, so no read of this one follows; start
        // its draft over at once, unless it holds edits.
        if (!(keptWatchPagesDraft(watchId)?.dirty ?? false)) forgetWatchPagesDraft(watchId);
      }
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") {
        note = { kind: "warn", text: "Not restored. The pages changed somewhere else, so the newest copy is shown." };
      } else if (code === "no_record") {
        note = { kind: "warn", text: "Not restored. Home Assistant no longer holds pages for this watch." };
      } else if (code === "not_found") {
        note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      } else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore pages. Update it to restore an earlier save." };
      } else {
        note = { kind: "err", text: `Could not restore: ${errText(err)}` };
      }
    } finally {
      this.restoring = false;
      if (this.restoreAsk === ask) this.closeAsk();
    }
    if (watchId !== this.watchId) return;
    this.note = note;
    void this.load(watchId, true);
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const only = watches.length === 1 ? watches[0] : undefined;
    const draft = this.draft;
    return html`
      <div class="pe-head">
        <div class="pe-title">
          <h2>Watch pages</h2>
          <span>${only ? `${watchName(only, watches)}. ` : ""}A save reaches the iPhone the next time Wrist Assistant opens or comes to the front there, and goes on to the watch from the iPhone.</span>
        </div>
        ${watches.length > 1 ? this.renderTabs(watches) : nothing}
      </div>
      ${draft ? this.renderToolbar(draft) : nothing}
      ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
      ${this.deleteAsk && draft ? this.renderDeleteAsk(this.deleteAsk, draft.document) : nothing}
      ${this.addTileOpen ? this.renderAddTileDialog() : nothing}
    `;
  }

  private renderToolbar(draft: WatchPagesDraft): TemplateResult {
    const dirty = draft.dirty;
    const stateText = this.saving ? "Saving…" : dirty ? "Unsaved changes" : "";
    return html`<div class="pe-tools" role="toolbar" aria-label="Edits">
      <button class="pe-btn pe-icon-only" title=${`Undo (${MOD}Z)`} aria-label="Undo" ?disabled=${!draft.canUndo}
        @click=${() => this.undo()}>${uiIcon("undo")}</button>
      <button class="pe-btn pe-icon-only" title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo" ?disabled=${!draft.canRedo}
        @click=${() => this.redo()}>${uiIcon("redo")}</button>
      <span class="pe-state-text" aria-live="polite">${stateText}</span>
      <span class="pe-tools-gap"></span>
      <button class="pe-btn" title="Go back to the copy Home Assistant holds. Undo brings the edits back." ?disabled=${!dirty || this.saving}
        @click=${() => this.discard()}>Discard</button>
      <button class="pe-btn pe-primary" title=${`Save (${MOD}S)`} ?disabled=${!dirty || this.saving}
        @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
    </div>`;
  }

  /** One tab per watch, the glyph in its person's color. */
  private renderTabs(watches: readonly OwnerSummary[]): TemplateResult {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    return html`<div class="pe-tabs" role="tablist" aria-label="Watches">
      ${watches.map((w) => {
        const index = people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === w.owner_watch_id));
        const color = personColorVar(index);
        const on = w.owner_watch_id === this.watchId;
        return html`<button type="button" role="tab" class="pe-tab ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
          style=${color ? `--pe-person: ${color}` : nothing}
          @click=${() => { if (!on) this.openWatch(w.owner_watch_id); }}>
          <span class="pe-tab-glyph" aria-hidden="true">${uiIcon("watch")}</span>
          <span class="pe-tab-name">${watchName(w, watches)}</span>
        </button>`;
      })}
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet."}</div>`;
    }
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this watch's pages: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    if (record.revision <= 0 || draft === undefined) {
      // Edits kept from before Home Assistant lost this watch's record (it
      // was removed, or the store started over). They stay, and are merged
      // into the record the iPhone uploads next; said here, with a way to
      // drop them, so the leave question never asks about edits no one can
      // see.
      const kept = this.watchId === undefined ? undefined : keptWatchPagesDraft(this.watchId);
      const id = this.watchId;
      return html`<div class="pe-empty"><b>No pages from this watch yet.</b><span>${NO_RECORD_TEXT}</span>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when the iPhone saves the pages here again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchPagesDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    const document = draft.document;
    const listed = listedWatchPages(document);
    const page = this.currentPage();
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const tile = page === undefined || this.selectedTileId === undefined ? undefined : this.tileOn(page, this.selectedTileId);
    return html`<div class="pe-grid">
      ${this.renderPageList(listed)}
      <section class="pe-card pe-stage" aria-label="Page">
        ${page ? this.renderStage(page, watchPagesOf(document), owner) : html`<p class="pe-muted">${listed.length === 0 ? "Add a page to start." : "Pick a page."}</p>`}
      </section>
      <aside class="pe-side">
        ${page && tile ? this.renderTileCard(page, tile, watchPagesOf(document)) : page ? this.renderPageCard(page) : nothing}
        ${this.renderState(record, document)}
        ${this.renderHistory(record, draft.dirty)}
      </aside>
    </div>`;
  }

  // ── the page list ──────────────────────────────────────────────────────

  private renderPageList(listed: readonly WatchPage[]): TemplateResult {
    const allHidden = listed.length > 0 && listed.every(isHiddenWatchPage);
    const drag = this.rowDrag?.started ? this.rowDrag : undefined;
    return html`<nav class="pe-card pe-pages ${this.saving ? "saving" : ""}" aria-label="Pages">
      <h3>Pages <span class="pe-count">${listed.length}</span></h3>
      ${listed.length === 0 ? html`<p class="pe-muted">This watch has no pages.</p>` : nothing}
      ${allHidden ? html`<p class="pe-warn">Every page is hidden, so the watch shows "No pages".</p>` : nothing}
      <div class="pe-page-list">
        ${repeat(listed, (p) => watchPageId(p), (p, i) => this.renderPageRow(p, i, listed.length))}
        ${drag ? html`<div class="pe-drop-line" style=${`top:${drag.lineY}px`} aria-hidden="true"></div>` : nothing}
      </div>
      <button class="pe-btn pe-add" @click=${() => this.addPage()}>${uiIcon("plus")}<span>Add page</span></button>
    </nav>`;
  }

  private renderPageRow(page: WatchPage, index: number, count: number): TemplateResult {
    const id = watchPageId(page);
    const on = sameWatchId(id, this.selectedPageId);
    const smart = isSmartWatchPage(page);
    const hidden = isHiddenWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const name = watchPageName(page);
    const renaming = this.renaming !== undefined && sameWatchId(this.renaming.pageId, id) ? this.renaming : undefined;
    const menu = this.menuPageId !== undefined && sameWatchId(this.menuPageId, id);
    const dragging = this.rowDrag?.started === true && sameWatchId(this.rowDrag.pageId, id);
    return html`<div class="pe-page-row ${on ? "on" : ""} ${dragging ? "dragging" : ""}" data-page=${id}>
      <span class="pe-grip" title=${this.saving ? SAVING_TEXT : "Drag to move"} aria-hidden="true"
        @pointerdown=${(e: PointerEvent) => this.onRowPointerDown(e, id, index, true)}>${uiIcon("grip")}</span>
      ${renaming
        ? html`<input class="pe-rename" aria-label="Page name" .value=${renaming.value}
            @input=${(e: InputEvent) => { renaming.value = (e.target as HTMLInputElement).value; }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter") { e.preventDefault(); this.commitRename(); this.focusPageRow = id; }
              else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.cancelRename(); }
            }}
            @blur=${() => this.commitRename()} />`
        : html`<button type="button" class="pe-page" aria-current=${on ? "true" : "false"}
            title=${this.saving ? `${SAVING_TEXT} Double click to rename.` : "Double click to rename. Alt and the arrow keys move the page."}
            @click=${() => this.selectPage(id)}
            @dblclick=${() => this.startRename(id)}
            @keydown=${(e: KeyboardEvent) => this.onRowKeyDown(e, id, index, count)}
            @pointerdown=${(e: PointerEvent) => this.onRowPointerDown(e, id, index, false)}>
            <span class="pe-page-name">${name}</span>
            <span class="pe-page-meta">
              ${smart ? html`<span class="pe-badge smart">Smart</span>` : html`<span>${plural(tiles, "tile", "tiles")}</span>`}
              ${hidden ? html`<span class="pe-badge">Hidden</span>` : nothing}
            </span>
          </button>`}
      <button type="button" class="pe-icon-btn ${hidden ? "off" : ""}" title=${hidden ? "Hidden on the watch. Show it" : "Shown on the watch. Hide it"}
        aria-label=${hidden ? `Show ${name} on the watch` : `Hide ${name} on the watch`}
        @click=${() => this.setHidden(id, !hidden)}>${uiIcon(hidden ? "hide" : "show")}</button>
      <button type="button" class="pe-icon-btn pe-more" title="More" aria-label=${`More for ${name}`}
        aria-haspopup="menu" aria-expanded=${menu ? "true" : "false"}
        @click=${() => {
          this.menuPageId = menu ? undefined : id;
          this.focusMenu = !menu;
        }}>${uiIcon("more")}</button>
      ${menu ? html`<div class="pe-menu" role="menu" aria-label=${name}>
          <button role="menuitem" @click=${() => this.startRename(id)}>Rename</button>
          <button role="menuitem" ?disabled=${index === 0} @click=${() => this.movePage(id, index - 1, true)}>Move up</button>
          <button role="menuitem" ?disabled=${index >= count - 1} @click=${() => this.movePage(id, index + 1, true)}>Move down</button>
          <button role="menuitem" class="pe-danger" @click=${() => this.askDelete(id)}>Delete…</button>
        </div>` : nothing}
    </div>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  private renderStage(page: WatchPage, pages: readonly WatchPage[], owner: OwnerSummary | undefined): TemplateResult {
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const smart = isSmartWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const rows = watchPageExtent(page);
    const facts = [
      smart ? "Smart page" : `${plural(tiles, "tile", "tiles")}, ${plural(rows, "row", "rows")}`,
      found ? watchCase.label : `${watchCase.label}, this watch's size is not known`,
    ];
    if (isHiddenWatchPage(page)) facts.push("hidden on the watch");
    const headers = !smart && watchPageHasHeader(page);
    const asOnWatch = headers && this.asOnWatch;
    const scale = this.narrow ? 1.25 : 1.5;
    const input = { page, pages, screen: watchCase.screen, states: this.hass?.states, icons: this.icons, scale };
    this.stageScreen = watchCase.screen;
    const addOff = this.saving || asOnWatch;
    return html`<div class="pe-stage-head">
        <div class="pe-stage-title">
          <h3>${watchPageName(page)}</h3>
          <span class="pe-muted">${facts.join(" · ")}</span>
        </div>
        <div class="pe-stage-acts">
          ${headers ? html`<label class="pe-switch" title="Headers pull the rows below them up on the watch. Editing is off while this is on.">
              <input type="checkbox" role="switch" .checked=${live(this.asOnWatch)}
                @change=${(e: Event) => { this.asOnWatch = (e.target as HTMLInputElement).checked; this.cancelGestures(); }} />
              <span>As on the watch</span>
            </label>` : nothing}
          ${smart ? nothing : html`<button class="pe-btn pe-add-tile" aria-haspopup="dialog" ?disabled=${addOff}
              title=${this.saving ? SAVING_TEXT : asOnWatch ? "Turn off \"As on the watch\" to add a tile." : "Add a tile to this page"}
              @click=${() => this.openAddTile()}>${uiIcon("plus")}<span>Add tile</span></button>`}
        </div>
      </div>
      <div class="pe-stage-body">
        ${smart || asOnWatch ? renderWatchPagePreview(input) : this.renderEditScreen(page, input)}
      </div>
      ${smart || !(asOnWatch ? watchPagePreviewScrolls(page, watchCase.screen) : this.editStage(page, input).scrolls) ? nothing
        : html`<p class="pe-muted pe-fold-text">${WATCH_SCREEN_FOLD_TEXT}</p>`}
      ${smart ? nothing
        : asOnWatch ? html`<p class="pe-muted">Shown as the watch draws it. Turn off "As on the watch" to edit.</p>`
        : tiles === 0 ? html`<p class="pe-muted">No tiles yet.</p>`
        : html`<p class="pe-muted pe-hint">Drag a tile to move it, or onto another tile to swap the two. Drag an edge or the corner of the selected tile to resize it. Arrow keys move the selected tile.</p>`}`;
  }

  /** The page on a flat grid, with every tile a button. While a handle is
   * dragged, the page drawn is the resize's preview, so the pushed tiles move
   * live. */
  /** What the edit screen draws: the page (the resize's preview while a
   * handle is dragged), its grid, and how many rows and pixels it takes. */
  private editStage(page: WatchPage, input: WatchPagePreviewInput) {
    const s = input.scale ?? 1.5;
    const screen = input.screen;
    const g = this.gesture?.started ? this.gesture : undefined;
    const move = g?.kind === "move" ? g : undefined;
    const resize = g?.kind === "resize" ? g : undefined;
    const shown = resize?.preview?.page ?? page;
    const topInset = page.fullScreen === true ? 0 : WATCH_GRID_TOP_INSET;
    const grid = stageGrid(screen.width, topInset, s);
    const reach = move?.cell ? move.cell.row + move.rect.rowSpan : resize?.preview ? resize.preview.rect.row + resize.preview.rect.rowSpan : 0;
    // Never more rows than an edit may reach: a tile stored past the last
    // row would otherwise draw a million of them.
    const rows = Math.min(WATCH_EDITOR_MAX_ROWS, stageRows(watchPageExtent(shown), rowsOnScreen(grid, screen.height * s), reach));
    const gridHeight = rows * grid.step - grid.spacing;
    const height = Math.max(screen.height * s, grid.top + gridHeight);
    return { s, screen, move, resize, shown, grid, rows, gridHeight, height, scrolls: height > screen.height * s + 0.5 };
  }

  private renderEditScreen(
    page: WatchPage,
    input: WatchPagePreviewInput,
  ): TemplateResult {
    const { s, screen, move, resize, shown, grid, rows, gridHeight, height } = this.editStage(page, input);
    const layout = watchPageLayout(shown, screen, { flat: true });
    const width = screen.width * s;
    const selected = this.selectedTileId;
    const seen = new Set<string>();
    const keyOf = (placed: PlacedWatchTile): string => {
      const id = tileIdOf(placed.tile).toUpperCase();
      const key = id === "" || seen.has(id) ? `#${placed.index}` : id;
      seen.add(key);
      return key;
    };
    const selectedPlaced = selected === undefined ? undefined : layout.tiles.find((t) => sameWatchId(t.tile.id, selected));
    const selBox = resize?.preview
      ? cellRectPx(grid, resize.preview.rect)
      : selectedPlaced && !move
        ? cellRectPx(grid, drawnRect(watchTileRect(selectedPlaced.tile)))
        : undefined;
    return html`<div class="wp-screen pe-screen ${this.saving ? "saving" : ""}" tabindex="-1" role="group" aria-label=${`Layout of ${watchPageName(page)}`}
      style=${`width:${width}px;height:${height}px;background:${watchScreenColor(page)};--pe-base:${watchScreenColor(page)}`}
      @click=${() => this.selectTile(undefined)}>
      ${layout.topInset > 0 ? html`<span class="wp-clock" style=${`font-size:${13 * s}px;height:${layout.topInset * s}px;padding-right:${12 * s}px`}>10:09</span>` : nothing}
      <svg class="pe-cells" width=${width} height=${gridHeight} viewBox=${`0 0 ${width} ${gridHeight}`}
        style=${`top:${grid.top}px`} aria-hidden="true"><path d=${cellsPath(grid, rows, 3 * s)} /></svg>
      ${height > screen.height * s + 0.5 ? renderWatchScreenFold(screen.height * s) : nothing}
      ${move ? this.renderMoveGhosts(move, shown, grid) : nothing}
      ${repeat(layout.tiles, keyOf, (placed) => this.renderStageTile(placed, input, layout.unit, grid, move))}
      ${selBox ? html`<div class="pe-sel ${resize?.preview?.overlaps ? "no" : ""}" aria-hidden="true"
          style=${`left:${selBox.left}px;top:${selBox.top}px;width:${selBox.width}px;height:${selBox.height}px;${handleSizes(selBox)}`}>
          ${repeat(shownHandles(selBox, grid, resize?.handle), (h) => h, (h) => html`<span class="pe-handle ${h}" title=${this.saving ? SAVING_TEXT : "Drag to resize"}
            @pointerdown=${(e: PointerEvent) => this.onHandlePointerDown(e, h)}
            @click=${(e: Event) => e.stopPropagation()}></span>`)}
        </div>` : nothing}
    </div>`;
  }

  private renderStageTile(
    placed: PlacedWatchTile,
    input: WatchPagePreviewInput,
    unit: number,
    grid: StageGrid,
    move: MoveGesture | undefined,
  ): TemplateResult {
    const s = grid.scale;
    const { tile } = placed;
    const id = tileIdOf(tile);
    // The flat layout puts a tile where `cellRectPx` does; one stored past
    // the last row is drawn pulled up and cut, as the phone's editor does.
    const stored = watchTileRect(tile);
    const drawn = drawnRect(stored);
    const box0 = drawn === stored ? undefined : cellRectPx(grid, drawn);
    const left = box0?.left ?? placed.x * s;
    const top = box0?.top ?? grid.top + placed.y * s;
    const width = box0?.width ?? placed.width * s;
    const height = box0?.height ?? placed.height * s;
    const kindLabel = tileKindLabel(tileKind(tileEntityId(tile)));
    const label = tileLabel(tile, input.states, input.pages);
    const selected = id !== "" && sameWatchId(id, this.selectedTileId);
    const moving = move !== undefined && sameWatchId(id, move.tileId);
    const partner = move?.outcome?.kind === "swap" && sameWatchId(id, move.outcome.targetId);
    const shift = moving ? `transform:translate(${move.left - left}px, ${move.top - top}px);` : "";
    const face = renderWatchTileFace(tile, { width: width / s, height: height / s }, input, unit);
    // The ring of a selected tile follows the tile's own corners.
    const radius = Math.min(16, placed.width / 2, placed.height / 2) * s;
    const box = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;border-radius:${radius}px;${shift}`;
    // A tile with no id cannot be named by an edit; it is drawn and left be.
    if (id === "") return html`<div class="pe-tile fixed ${tileKind(tileEntityId(tile)) === "spacer" ? "spacer" : ""}" style=${box} aria-hidden="true">${face}</div>`;
    const spacer = tileKind(tileEntityId(tile)) === "spacer";
    return html`<button type="button" class="pe-tile ${spacer ? "spacer" : ""} ${selected ? "sel" : ""} ${moving ? "moving" : ""} ${partner ? "partner" : ""}"
      data-tile=${id} style=${box}
      aria-label=${label !== "" && label !== kindLabel ? `${label}, ${kindLabel}` : kindLabel} aria-pressed=${selected ? "true" : "false"}
      title=${[label, kindLabel, tileEntityId(tile), this.saving ? SAVING_TEXT : ""].filter((t, i, all) => t !== "" && all.indexOf(t) === i).join(" · ")}
      @pointerdown=${(e: PointerEvent) => this.onTilePointerDown(e, id)}
      @click=${(e: Event) => { e.stopPropagation(); this.selectTile(id); }}>${face}</button>`;
  }

  /** Where a drop would put the tile: the target place, green for a move,
   * accent for a swap with where the other tile goes, red when refused. */
  private renderMoveGhosts(move: MoveGesture, page: WatchPage, grid: StageGrid): TemplateResult | typeof nothing {
    const outcome = move.outcome;
    if (outcome === undefined || outcome.kind === "same") return nothing;
    const at = cellRectPx(grid, { ...outcome.cell, colSpan: move.rect.colSpan, rowSpan: move.rect.rowSpan });
    const box = (b: { left: number; top: number; width: number; height: number }) =>
      `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px`;
    const kind = outcome.kind === "none" ? "no" : outcome.kind === "swap" ? "swap" : "ok";
    let partner: TemplateResult | typeof nothing = nothing;
    if (outcome.kind === "swap") {
      const other = this.tileOn(page, outcome.targetId);
      if (other !== undefined) {
        const r = watchTileRect(other);
        partner = html`<div class="pe-ghost swap-to" style=${box(cellRectPx(grid, { ...outcome.targetCell, colSpan: r.colSpan, rowSpan: r.rowSpan }))}></div>`;
      }
    }
    return html`<div class="pe-ghost ${kind}" style=${box(at)}></div>${partner}`;
  }

  // ── the side cards ─────────────────────────────────────────────────────

  private renderTileCard(page: WatchPage, tile: WatchPageTile, pages: readonly WatchPage[]): TemplateResult {
    const rect = watchTileRect(tile);
    const entityId = tileEntityId(tile);
    const kindLabel = tileKindLabel(tileKind(entityId));
    const label = tileLabel(tile, this.hass?.states, pages);
    const off = this.editingOff(page);
    const id = tileIdOf(tile);
    const field = (name: string, value: number, min: number, max: number | undefined, commit: (v: number) => void) => {
      const key = `${name}:${id.toUpperCase()}`;
      const stored = String(value);
      const take = (text: string): void => commit(typedNumber(text));
      return html`<label class="pe-field"><span>${name}</span>
        <input type="number" inputmode="numeric" step="1" min=${min} max=${max !== undefined && max >= min ? max : nothing} ?disabled=${off}
          .value=${live(this.fieldValue(key, stored))}
          @input=${(e: Event) => this.onFieldInput(e, key, take)}
          @keydown=${(e: KeyboardEvent) => this.onFieldKeyDown(e, key, stored)}
          @change=${() => this.commitTyping(key)}
          @blur=${() => this.commitTyping(key)} /></label>`;
    };
    return html`<div class="pe-card pe-tile-card">
      <div class="pe-card-head">
        <h3>Tile</h3>
        <button class="pe-link" @click=${() => this.selectTile(undefined)}>Show the page</button>
      </div>
      <p class="pe-tile-name">${label || kindLabel}</p>
      <p class="pe-muted">${kindLabel}${entityId !== "" ? html` · <code>${entityId}</code>` : nothing}</p>
      <div class="pe-fields">
        ${field("Column", rect.col + 1, 1, 12 - rect.colSpan + 1, (v) => this.placeTile(v, rect.row + 1))}
        ${field("Row", rect.row + 1, 1, WATCH_EDITOR_MAX_ROWS - rect.rowSpan + 1, (v) => this.placeTile(rect.col + 1, v))}
        ${field("Width", rect.colSpan, 1, 12, (v) => this.sizeTile(v, rect.rowSpan))}
        ${field("Height", rect.rowSpan, 1, WATCH_EDITOR_MAX_ROWS - rect.row, (v) => this.sizeTile(rect.colSpan, v))}
      </div>
      ${this.fieldNote ? html`<p class="pe-warn" role="status">${this.fieldNote}</p>` : nothing}
      <div class="pe-presets" role="group" aria-label="Size">
        ${WATCH_TILE_SIZE_PRESETS.map((p) => {
          const on = rect.colSpan === p.colSpan && rect.rowSpan === p.rowSpan;
          return html`<button class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${off}
            title=${`${p.colSpan} columns by ${p.rowSpan} rows`}
            @click=${() => this.sizeTile(p.colSpan, p.rowSpan)}>${p.name}</button>`;
        })}
      </div>
      ${this.renderTileSettingsFor(page, tile)}
      <button class="pe-btn pe-danger" ?disabled=${off} title="Delete or Backspace" @click=${() => this.deleteTile()}>
        ${uiIcon("delete")}<span>Delete tile</span></button>
    </div>`;
  }

  /** The tile settings module's rows for the selected tile. */
  private renderTileSettingsFor(page: WatchPage, tile: WatchPageTile): TemplateResult | typeof nothing {
    const host = this.editorHost(page);
    const tileId = tileIdOf(tile);
    if (host === undefined || tileId === "") return nothing;
    return renderTileSettings({ ...host, tileId, tile });
  }

  /** The Add tile dialog, the delete question's pattern: a native modal
   * opened once when first drawn (`updated`), its state dropped on close. The
   * body is the add tile module's. */
  private renderAddTileDialog(): TemplateResult | typeof nothing {
    const page = this.currentPage();
    const host = this.editorHost(page);
    if (page === undefined || host === undefined) return nothing;
    const tileId = this.selectedTileId;
    const tile = tileId === undefined ? undefined : this.tileOn(page, tileId);
    const addHost: AddTileHost = {
      ...host,
      tileId: tile === undefined ? undefined : tileId,
      tile,
      close: () => this.closeAsk(),
    };
    return html`<dialog class="pe-ask pe-add-dialog" aria-labelledby="pe-add-title"
      @close=${() => { this.addTileOpen = false; }}>
      <div class="pe-ask-head">
        <h3 id="pe-add-title">Add a tile to "${watchPageName(page)}"</h3>
        <button type="button" class="pe-icon-btn" title="Close" aria-label="Close" @click=${() => this.closeAsk()}>${uiIcon("close")}</button>
      </div>
      ${renderAddTile(addHost)}
    </dialog>`;
  }

  private renderPageCard(page: WatchPage): TemplateResult {
    const id = watchPageId(page);
    const smart = isSmartWatchPage(page);
    const hidden = isHiddenWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const rows = watchPageExtent(page);
    const key = `name:${id.toUpperCase()}`;
    const stored = typeof page.name === "string" ? page.name : "";
    const rename = (text: string): void => {
      const document = this.draft?.document;
      // A blank name or the same one changes nothing; the stored one shows.
      if (document !== undefined && !this.edit(setWatchPageName(document, id, text))) this.requestUpdate();
    };
    return html`<div class="pe-card pe-page-card">
      <h3>Page</h3>
      <label class="pe-field wide"><span>Name</span>
        <input type="text" .value=${live(this.fieldValue(key, stored))}
          @input=${(e: Event) => this.onFieldInput(e, key, rename)}
          @keydown=${(e: KeyboardEvent) => this.onFieldKeyDown(e, key, stored)}
          @change=${() => this.commitTyping(key)}
          @blur=${() => this.commitTyping(key)} /></label>
      <label class="pe-switch">
        <input type="checkbox" role="switch" .checked=${live(hidden)}
          @change=${(e: Event) => this.setHidden(id, (e.target as HTMLInputElement).checked)} />
        <span>Hidden on the watch</span>
      </label>
      <p class="pe-muted">${smart ? "A smart page: the watch fills it itself." : `${plural(tiles, "tile", "tiles")}, ${plural(rows, "row", "rows")}`}</p>
      <button class="pe-btn pe-danger" @click=${() => this.askDelete(id)}>${uiIcon("delete")}<span>Delete page…</span></button>
    </div>`;
  }

  /** Where the stored copy has got to: who saved it and when, whether the
   * iPhone has it, whether it could read it, and how big the pages are now. */
  private renderState(record: WatchConfigRecord, document: WatchPagesDocument): TemplateResult {
    const delivery = deliveryState(record);
    const rejected = rejectedNow(record);
    const size = sizeOf(document);
    const share = size / WATCH_SYNC_LIMIT_BYTES;
    const when = ago(record.updated_at);
    return html`<div class="pe-card pe-state">
      <h3>Stored copy</h3>
      <p><b>Revision ${record.revision}</b> · ${savedBy(record.updated_by)}${when ? ` ${when}` : ""}</p>
      ${rejected
        ? html`<p class="pe-pill err"><i aria-hidden="true"></i>The iPhone could not read this save</p>
          <p class="pe-muted">${this.historyState === "unsupported" ? "Save the pages again from the iPhone." : "Restore an earlier save below."}</p>`
        : delivery === "delivered"
        ? html`<p class="pe-pill ok" title=${`The iPhone has revision ${record.revision} and passes it to the watch.`}><i aria-hidden="true"></i>On the iPhone</p>`
        : html`<p class="pe-pill warn"><i aria-hidden="true"></i>Waiting for the iPhone</p>
          <p class="pe-muted">The iPhone picks it up the next time Wrist Assistant opens or comes to the front.</p>`}
      <p class=${share > 0.8 ? "pe-warn" : "pe-muted"}>${kb(size)} of the ${kb(WATCH_SYNC_LIMIT_BYTES)} the watch takes${share > 0.8 ? ". Close to the limit." : ""}</p>
    </div>`;
  }

  private renderHistory(record: WatchConfigRecord, dirty: boolean): TemplateResult | typeof nothing {
    if (this.historyState === "unsupported") return nothing;
    const entries = this.history;
    const rejected = rejectedNow(record);
    let body: TemplateResult;
    if (this.historyState === "loading") body = html`<p class="pe-muted">Loading…</p>`;
    else if (this.historyState === "error") {
      const id = this.watchId;
      body = html`<p class="pe-muted">Could not load the earlier saves.</p>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => { this.historyState = "loading"; void this.loadHistory(id); }}>Try again</button>`}`;
    } else if (entries.length === 0) body = html`<p class="pe-muted">No earlier saves yet.</p>`;
    else {
      // The newest entry older than the copy on screen is the one to offer
      // first when the iPhone could not read that copy.
      const offer = rejected ? entries.find((e) => e.revision < record.revision)?.revision : undefined;
      body = html`${dirty ? html`<p class="pe-muted">Save or discard your edits first.</p>` : nothing}
        <ul class="pe-history">
        ${entries.map((entry) => {
          const current = entry.revision === record.revision;
          const when = ago(entry.updated_at);
          return html`<li class=${entry.revision === offer ? "offer" : ""}>
            <span class="pe-h-text">
              <b>Revision ${entry.revision}</b>
              <span class="pe-muted">${savedBy(entry.updated_by)}${when ? ` ${when}` : ""} · ${kb(entry.size)}</span>
            </span>
            ${current
              ? html`<span class="pe-badge">Current</span>`
              : html`<button class="pe-btn ${entry.revision === offer ? "pe-primary" : ""}" ?disabled=${this.restoring || dirty}
                  title=${dirty ? "Save or discard your edits first." : nothing}
                  @click=${() => this.askRestore(entry)}>Restore</button>`}
          </li>`;
        })}
      </ul>`;
    }
    return html`<div class="pe-card pe-past" tabindex="-1"><h3>Earlier saves</h3>${body}</div>`;
  }

  // ── questions ──────────────────────────────────────────────────────────

  /** The restore question, as a native modal: Escape and the backdrop behave
   * as everywhere else, and the page under it cannot be clicked. */
  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="pe-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="pe-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedBy(ask.entry.updated_by)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves. The iPhone picks it up the next time it checks and sends it to the watch.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  /** The delete question: what the page holds, and everything Home Assistant
   * can see that points at it. */
  private renderDeleteAsk(ask: DeleteAsk, document: WatchPagesDocument): TemplateResult | typeof nothing {
    const page = findWatchPage(document, ask.pageId);
    if (page === undefined) return nothing;
    const name = watchPageName(page);
    const links = watchPageLinks(document, ask.pageId, ask.behavior);
    const pages = watchPagesOf(document);
    const tiles = watchPageTiles(page).length;
    const rooms = links.roomFallback || links.roomMappingKeys.length > 0;
    return html`<dialog class="pe-ask" aria-labelledby="pe-del-title"
      @close=${() => { this.deleteAsk = undefined; }}>
      <h3 id="pe-del-title">Delete "${name}"?</h3>
      <p>${isSmartWatchPage(page) ? "A smart page." : `It holds ${plural(tiles, "tile", "tiles")}.`} You can undo the delete until you leave this page.</p>
      ${links.tiles.length > 0 ? html`
        <p>${links.tiles.length === 1 ? "A tile opens this page:" : "These tiles open this page:"}</p>
        <ul class="pe-ask-list">${links.tiles.map((link) => {
          const host = findWatchPage(document, link.pageId);
          const tile = host === undefined ? undefined : this.tileOn(host, link.tileId);
          const label = tile === undefined ? "" : tileLabel(tile, this.hass?.states, pages);
          return html`<li><b>${link.pageName}</b>: ${tileKindLabel(link.kind)}${label !== "" ? ` "${label}"` : ""}</li>`;
        })}</ul>
        <label class="pe-check"><input type="checkbox" .checked=${live(ask.removeLinks)}
          @change=${(e: Event) => { this.deleteAsk = { ...ask, removeLinks: (e.target as HTMLInputElement).checked }; }} />
          <span>Also delete ${links.tiles.length === 1 ? "this tile" : "these tiles"}</span></label>` : nothing}
      ${ask.behaviorState === "loading" ? html`<p class="pe-muted">Checking the room settings…</p>` : nothing}
      ${rooms ? html`
        <p>The watch settings name this page for room quick jump:</p>
        <ul class="pe-ask-list">
          ${links.roomFallback ? html`<li>The page it opens when no room matches</li>` : nothing}
          ${links.roomMappingKeys.map((key) => html`<li>The page for <b>${key}</b></li>`)}
        </ul>
        <p class="pe-muted">After the delete the watch opens another page there instead. The setting itself stays as it is.</p>` : nothing}
      <p class="pe-muted">Quick menus and complications set up in the iPhone app may also open this page. Home Assistant cannot see those.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary pe-danger" @click=${() => this.deletePage()}>Delete page</button>
      </div>
    </dialog>`;
  }

  // The panel's form rules first, so the field rows of `editors.ts` look as
  // they do in the panel; this element's own rules come after and win the
  // ties. The two modules' rules come last, so a module can size its own
  // parts of this element (its dialog, say) without outranking anything.
  static override styles = [formStyles, watchPagePreviewStyles, css`
    :host {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      padding: 16px;
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, p { margin: 0; }
    h2 { font-size: 20px; font-weight: 650; }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    /* The browser's own monospace, not the shared sheet's family. */
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    .pe-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 24px; margin-bottom: 12px; }
    .pe-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 280px; }
    .pe-title > span { color: var(--wa-muted); font-size: 13px; }

    .pe-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .pe-tab {
      display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 12px;
      border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card);
      color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-tab:hover { border-color: var(--wa-line-strong); }
    .pe-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-tab.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-tab-glyph { color: var(--pe-person, var(--wa-muted)); }

    .pe-tools {
      display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 12px; padding: 8px 10px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .pe-tools-gap { flex: 1; }
    .pe-state-text { margin-left: 6px; color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .pe-btn.pe-icon-only { display: inline-flex; align-items: center; justify-content: center; width: 32px; padding: 0; }
    .pe-btn.pe-icon-only svg.ui-icon { width: 16px; height: 16px; }

    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }

    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }

    /* Three columns when there is room: the pages, the picture, the cards.
       One column, in that order, when there is not. */
    .pe-grid {
      display: grid;
      grid-template-columns: minmax(200px, 250px) minmax(0, 1fr) minmax(240px, 300px);
      gap: 14px;
      align-items: start;
    }
    @container (max-width: 820px) {
      .pe-grid { grid-template-columns: minmax(0, 1fr); }
    }
    .pe-card {
      display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .pe-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .pe-count { margin-left: 4px; font-weight: 500; }

    /* The page list. */
    .pe-page-list { position: relative; display: flex; flex-direction: column; gap: 2px; }
    .pe-page-row {
      position: relative; display: flex; align-items: center; gap: 2px; min-width: 0;
      border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px);
    }
    .pe-page-row:hover { background: var(--wa-field); }
    .pe-page-row.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    .pe-page-row.dragging { opacity: .5; }
    .pe-grip {
      display: flex; align-items: center; justify-content: center; width: 18px; align-self: stretch; flex: none;
      color: var(--wa-muted); cursor: grab; touch-action: none; opacity: .55;
    }
    .pe-page-row:hover .pe-grip, .pe-page-row.on .pe-grip { opacity: 1; }
    .pe-page {
      display: flex; flex-direction: column; align-items: flex-start; gap: 3px; flex: 1; min-width: 0; padding: 7px 4px;
      border: 0; border-radius: var(--wa-r-sm, 8px); background: none;
      color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer;
    }
    .pe-page:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-page-name { max-width: 100%; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-page-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; color: var(--wa-muted); font-size: 12px; }
    .pe-rename {
      flex: 1; min-width: 0; margin: 4px 2px; padding: 5px 7px; border: 1px solid var(--wa-sel-ring); border-radius: 6px;
      background: var(--wa-input, var(--wa-card)); color: var(--wa-ink); font: inherit; font-weight: 600;
    }
    .pe-rename:focus { outline: none; box-shadow: var(--wa-ring); }
    .pe-icon-btn {
      display: inline-flex; align-items: center; justify-content: center; flex: none; width: 28px; height: 28px; padding: 0;
      border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    .pe-icon-btn:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .pe-icon-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-icon-btn.off { color: var(--wa-amber); }
    .pe-icon-btn svg.ui-icon { width: 16px; height: 16px; }
    .pe-menu {
      position: absolute; right: 0; top: calc(100% + 2px); z-index: 5; display: flex; flex-direction: column; min-width: 150px; padding: 4px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card); box-shadow: var(--wa-shadow-pop);
    }
    .pe-menu > button {
      padding: 7px 10px; border: 0; border-radius: 6px; background: none; color: var(--wa-ink); font: inherit; font-size: 13px;
      text-align: left; cursor: pointer;
    }
    .pe-menu > button:hover:not(:disabled) { background: var(--wa-field); }
    .pe-menu > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-menu > button:disabled { opacity: .45; cursor: default; }
    .pe-menu > button.pe-danger { color: var(--wa-need); }
    .pe-drop-line {
      position: absolute; left: 0; right: 0; height: 3px; margin-top: -1px; border-radius: 2px;
      background: var(--wa-accent); pointer-events: none;
    }
    .pe-add { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 4px; }

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }
    .pe-badge.smart { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }

    /* The stage. */
    .pe-stage { align-items: stretch; }
    .pe-stage-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 8px 12px; }
    .pe-stage-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
    .pe-stage-title { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .pe-stage-head h3 { font-size: 16px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
    /* The picture keeps its size and the card scrolls sideways under it on a
       screen narrower than the watch drawn at this scale. */
    .pe-stage-body { display: flex; justify-content: center; padding: 14px 8px 10px; overflow-x: auto; overflow-y: hidden; }
    .pe-hint { font-size: 12px; }
    .pe-screen { overflow: visible; user-select: none; -webkit-user-select: none; }
    .pe-past:focus { outline: none; }
    .pe-screen.saving .pe-tile, .pe-screen.saving .pe-handle, .pe-pages.saving .pe-grip, .pe-pages.saving .pe-page { cursor: progress; }
    .pe-screen:focus { outline: none; }
    /* The cells stay inside the screen's round bottom corners. */
    .pe-cells { position: absolute; left: 0; pointer-events: none; clip-path: inset(0 round 0 0 28px 28px); }
    .pe-cells > path { fill: rgba(255, 255, 255, 0.07); }
    /* The marks drawn on the watch's screen (selection, handles, swap) are a
       light form of the accent: the screen is black in both skins, where the
       light skin's own accent is too dark to see. */
    .pe-screen { --pe-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); --pe-edge: rgba(255, 255, 255, 0.16); }
    /* Every tile stands on the screen's own color with a hairline edge, so a
       faint tint reads as a tile rather than as words on the grid. A spacer
       stays an outline. */
    .pe-tile {
      position: absolute; display: block; margin: 0; padding: 0; border: 0; border-radius: 10px;
      background: linear-gradient(var(--pe-base, #000), var(--pe-base, #000)), #000;
      box-shadow: inset 0 0 0 1px var(--pe-edge);
      color: inherit; font: inherit; text-align: left; cursor: grab;
      touch-action: manipulation;
    }
    .pe-tile.spacer { background: none; box-shadow: none; }
    .pe-tile.fixed { pointer-events: none; }
    .pe-tile:focus-visible { outline: none; box-shadow: inset 0 0 0 1px var(--pe-edge), 0 0 0 2px #000, 0 0 0 4px var(--pe-mark); }
    .pe-tile.sel { touch-action: none; box-shadow: inset 0 0 0 1px var(--pe-edge), 0 0 0 2px var(--pe-mark); z-index: 2; }
    .pe-tile.sel:focus-visible { box-shadow: inset 0 0 0 1px var(--pe-edge), 0 0 0 2px var(--pe-mark), 0 0 0 4px #000, 0 0 0 6px var(--pe-mark); }
    .pe-tile.moving { z-index: 4; opacity: .9; cursor: grabbing; box-shadow: 0 8px 22px rgba(0, 0, 0, .6), 0 0 0 2px var(--pe-mark); }
    .pe-tile.partner { opacity: .6; box-shadow: 0 0 0 2px var(--pe-mark); }
    .pe-ghost { position: absolute; z-index: 3; border-radius: 10px; pointer-events: none; border: 2px dashed; }
    .pe-ghost.ok { border-color: #34c759; background: rgba(52, 199, 89, .16); }
    .pe-ghost.swap { border-color: var(--pe-mark); background: color-mix(in srgb, var(--pe-mark) 20%, transparent); }
    .pe-ghost.swap-to { border-color: var(--pe-mark); border-style: dotted; background: color-mix(in srgb, var(--pe-mark) 10%, transparent); }
    .pe-ghost.no { border-color: #ff6b6b; background: rgba(255, 107, 107, .16); }
    .pe-sel { position: absolute; z-index: 3; border-radius: 10px; pointer-events: none; }
    .pe-fold-text { font-size: 12px; }
    .pe-sel.no { outline: 2px dashed #ff6b6b; outline-offset: 2px; background: rgba(255, 107, 107, .14); }
    /* Filled grab points straddling the outline, half in and half out, so
       they cover as little of the tile as they can. */
    .pe-handle {
      position: absolute; pointer-events: auto; touch-action: none; border-radius: 3px;
      background: var(--pe-mark); box-shadow: 0 0 0 1.5px #fff, 0 1px 3px rgba(0, 0, 0, .6);
    }
    /* Each handle catches the pointer a little beyond what it draws. */
    .pe-handle::before { content: ""; position: absolute; inset: -6px; }
    .pe-handle.left, .pe-handle.right { top: 50%; width: 6px; height: var(--pe-hv, 18px); margin-top: calc(var(--pe-hv, 18px) / -2); cursor: ew-resize; }
    .pe-handle.left { left: -3px; }
    .pe-handle.right { right: -3px; }
    .pe-handle.top, .pe-handle.bottom { left: 50%; width: var(--pe-hh, 18px); height: 6px; margin-left: calc(var(--pe-hh, 18px) / -2); cursor: ns-resize; }
    .pe-handle.top { top: -3px; }
    .pe-handle.bottom { bottom: -3px; }
    .pe-handle.bottomRight { right: -5px; bottom: -5px; width: 10px; height: 10px; border-radius: 50%; cursor: nwse-resize; }

    .pe-switch { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
    .pe-switch > input {
      appearance: none; position: relative; flex: none; width: 34px; height: 20px; margin: 0; border-radius: 999px;
      background: var(--wa-line-strong); cursor: pointer; transition: background .15s;
    }
    .pe-switch > input::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .3); transition: transform .15s;
    }
    .pe-switch > input:checked { background: var(--wa-accent); }
    .pe-switch > input:checked::after { transform: translateX(14px); }
    .pe-switch > input:focus-visible { outline: none; box-shadow: var(--wa-ring); }

    /* The side cards. */
    .pe-tile-name { font-weight: 650; overflow-wrap: anywhere; }
    .pe-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .pe-field { display: flex; flex-direction: column; gap: 3px; min-width: 0; font-size: 12px; color: var(--wa-muted); }
    .pe-field > input {
      width: 100%; min-height: 32px; padding: 0 8px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-input, var(--wa-card)); color: var(--wa-ink); font: inherit; font-size: 14px;
      transition: all 0s;
    }
    /* The shared sheet's input rules tie with these or outrank them: no
       hover tint, and the focus ring still wins while hovered. */
    .pe-field > input:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .pe-field > input:focus:not(:disabled) { outline: none; box-shadow: var(--wa-ring); border-color: var(--wa-sel-ring); }
    .pe-field > input:disabled { opacity: .55; }
    .pe-presets { display: flex; flex-wrap: wrap; gap: 6px; }
    .pe-chip {
      min-height: 28px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: 999px;
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
    }
    .pe-chip:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-chip:disabled { opacity: .55; cursor: default; }

    .pe-state p { font-size: 13px; }
    .pe-pill {
      display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
      padding: 3px 10px; border-radius: 999px; font-weight: 600;
    }
    .pe-pill > i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .pe-pill.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 13%, transparent); }
    .pe-pill.warn { color: var(--wa-amber); background: var(--wa-amber-bg); }
    .pe-pill.err { color: var(--wa-need); background: color-mix(in srgb, var(--wa-need) 13%, transparent); }

    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }

    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    /* Not "primary" and "danger": the shared sheet's button.primary and
       button.danger outrank .pe-btn and would restyle these. */
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }
    .pe-btn.pe-primary.pe-danger { color: #fff; background: var(--wa-need); align-self: auto; }
    .pe-btn.pe-primary.pe-danger:hover:not(:disabled) { background: var(--wa-need); }

    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-list { margin-top: 4px; padding-left: 20px; font-size: 14px; line-height: 1.45; }
    .pe-check { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    /* A plain tick box, not the shared sheet's switch: everything back to
       the browser's own, in every state. The :is() only lifts the rule to
       the weight of the shared sheet's :checked and :focus-visible rules. */
    .pe-check > input:is(*, :checked, :focus-visible) { all: revert; width: 16px; height: 16px; margin: 0; accent-color: var(--wa-accent); }
    .pe-check > input::after { content: none; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    /* The Add tile dialog (dialog.pe-add-dialog): its title and a close
       button, then the module's body. */
    .pe-ask-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .pe-ask-head > .pe-icon-btn { margin: -4px -6px 0 0; }

    :host([narrow]) { padding: 12px; }
    @container (max-width: 820px) {
      .pe-hint { display: none; }
    }
  `, tileSettingsStyles, addTileStyles];
}

if (!customElements.get("wa-page-editor")) {
  customElements.define("wa-page-editor", WaPageEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-page-editor": WaPageEditor;
  }
}
